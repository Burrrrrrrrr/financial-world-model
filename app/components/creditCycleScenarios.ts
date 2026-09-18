import {
  bisCreditCycleSelectedObservations,
  canonicalCapitalLossInput,
  canonicalCapitalLossResult,
  canonicalCollateralCapacityResult,
  canonicalCompositionResult,
  canonicalDebtServiceResult,
  canonicalPassiveLeverageResult,
  canonicalStockFlowResult,
  canonicalWarningResult,
  capitalLossFeedbackMetrics,
  collateralCapacityMetrics,
  compositionDecomposition,
  debtServiceRepricingMetrics,
  passiveLeverageMetrics,
  stockFlowBridge,
  warningCausalGate,
} from './creditCycleFixtures';

export type CreditCycleChoice = 'a' | 'b' | 'c';
export type CreditCycleMode = 'calculation' | 'interpretation';

export type CreditCycleNumericAssertion = {
  key: string;
  expected: number | string;
  unit: string;
  tolerance?: number;
};

export type CreditCycleOption = {
  id: CreditCycleChoice;
  label: string;
  diagnosis: string;
};

export type CreditCycleStaticTwin = {
  id: string;
  synthetic: boolean;
  title: string;
  prompt: string;
  choices: readonly CreditCycleOption[];
  correct: CreditCycleChoice;
  calculations: readonly string[];
  answer: string;
  judgment: string;
  mechanismExplanation: string;
  counterfactualOrFailure: string;
  sourceIds: readonly number[];
  numericAssertions: readonly CreditCycleNumericAssertion[];
};

export type CreditCycleScenario = {
  id: string;
  mode: CreditCycleMode;
  label: string;
  synthetic: boolean;
  title: string;
  brief: string;
  facts: readonly { label: string; value: string; note: string }[];
  formulas: readonly string[];
  formulaUnits: string;
  options: readonly CreditCycleOption[];
  correct: CreditCycleChoice;
  calculation: string;
  judgment: string;
  mechanismExplanation: string;
  counterfactualOrFailure: string;
  primarySectionId: string;
  remediationSectionIds: readonly string[];
  sourceIds: readonly number[];
  numericAssertions: readonly CreditCycleNumericAssertion[];
  staticTwin: CreditCycleStaticTwin;
};

const three = (a: string, b: string, c: string): readonly CreditCycleOption[] => [
  { id: 'a', label: a, diagnosis: '' },
  { id: 'b', label: b, diagnosis: '' },
  { id: 'c', label: c, diagnosis: '' },
];

const latestBis = bisCreditCycleSelectedObservations.at(-1);

export const creditCycleModes: readonly { id: CreditCycleMode; label: string; description: string }[] = [
  { id: 'calculation', label: '账本与约束', description: '复算存量—流量、杠杆、抵押、偿债与资本反馈。' },
  { id: 'interpretation', label: '识别与证据', description: '区分描述、预警、供需分解和因果处理。' },
];

export const creditCycleScenarios: readonly CreditCycleScenario[] = [
  {
    id: 'M1', mode: 'calculation', label: 'Stock–flow identity', synthetic: true,
    title: '期初信用100，gross originations 20，偿还8，核销3，其他变化+1；期末信用是多少？',
    brief: '新增发放、净交易流和存量变化是三个不同对象。',
    facts: [{ label: 'opening', value: '100', note: '期初点时存量' }, { label: 'gross originations', value: '20', note: '区间内新发放' }, { label: 'repayments / charge-offs / other', value: '8 / 3 / +1', note: '分别入账' }],
    formulas: ['closing = opening + originations − repayments − charge-offs + other changes'], formulaUnits: '全部为同一SYN货币单位；流量共享同一区间。',
    options: [
      { id: 'a', label: '112', diagnosis: '你只计算了发放减偿还，漏掉核销和其他变化。' },
      { id: 'b', label: '110', diagnosis: '正确；期末为110，净交易流为12，存量变化为10。' },
      { id: 'c', label: '120', diagnosis: '你把gross originations直接当成存量变化。' },
    ],
    correct: 'b', calculation: '100+20−8−3+1=110；net transaction flow=20−8=12；stock change=110−100=10。',
    judgment: '发放20、净交易流12、存量变化10不可互换。',
    mechanismExplanation: '偿还和核销会消灭存量，估值、汇率或重分类还会让存量差分偏离交易流。',
    counterfactualOrFailure: '若各项不属于同一信用口径、币种、合并基础或期间，算术即使闭合也没有经济含义。',
    primarySectionId: 'stock-flow-accounting', remediationSectionIds: ['credit-growth', 'origination-stock-disconnect'], sourceIds: [1, 14],
    numericAssertions: [{ key: 'closing', expected: 110, unit: 'SYN-currency' }, { key: 'net-flow', expected: 12, unit: 'SYN-currency' }, { key: 'stock-change', expected: 10, unit: 'SYN-currency' }],
    staticTwin: {
      id: 'K1', synthetic: true, title: '另一份存量—流量账本', prompt: '期初120、发放30、偿还15、核销4、其他变化−1；期末是多少？',
      choices: three('130', '134', '135'), correct: 'a', calculations: ['120+30−15−4−1=130。', '交易净流=30−15=15；存量变化=10。'],
      answer: 'A。期末130。', judgment: 'gross origination、net flow与stock change再次分离。', mechanismExplanation: '核销和其他变化解释了15的交易净流为何只留下10的存量变化。', counterfactualOrFailure: '若“其他变化”含义未拆成估值、汇率与重分类，研究时仍需继续解包。', sourceIds: [1, 14],
      numericAssertions: [{ key: 'closing', expected: 130, unit: 'SYN-currency' }, { key: 'net-flow', expected: 15, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M2', mode: 'calculation', label: 'Passive leverage', synthetic: true,
    title: '债务80、其他负债0、资产120、收入20；资产跌15%而负债不变。冲击后的D/E是多少？',
    brief: '分子不变并不意味着杠杆不变；资产价格先压缩权益分母。',
    facts: [{ label: 'debt', value: '80', note: '冲击前后冻结' }, { label: 'other liabilities', value: '0', note: '教学简化，显式冻结' }, { label: 'assets', value: '120 → 102', note: '价格冲击−15%' }, { label: 'equity', value: '40 → 22', note: 'assets−debt−other liabilities' }],
    formulas: ['equity = assets − total liabilities; D/E = debt / equity'], formulaUnits: '无量纲倍数；本题其他负债明确为0，必须保存与D/A、D/I不同的分母。',
    options: [
      { id: 'a', label: '2.000倍', diagnosis: '这是冲击前80/40。' },
      { id: 'b', label: '4.000倍', diagnosis: '这是债务/收入，不是债务/权益。' },
      { id: 'c', label: '约3.636倍', diagnosis: '正确；80/(102−80)=80/22。' },
    ],
    correct: 'c', calculation: '资产=120×0.85=102；其他负债=0，所以权益=102−80−0=22；D/E=80/22≈3.636。',
    judgment: '没有新增借款，也会发生被动去净值式杠杆上升。', mechanismExplanation: '资产价格损失由权益先吸收，固定债务相对缩水后的权益变得更大。',
    counterfactualOrFailure: '若存在其他负债，权益必须从资产扣除全部负债；若债务同时偿还、资产不完全按市值重估或收入时钟不同，三个杠杆率会走出另一条路径。',
    primarySectionId: 'leverage-ratio', remediationSectionIds: ['borrower-net-worth', 'financial-accelerator'], sourceIds: [15, 16, 17],
    numericAssertions: [{ key: 'debt-to-equity-after', expected: 80 / 22, unit: 'multiple' }, { key: 'debt-to-assets-after', expected: 80 / 102, unit: 'ratio' }],
    staticTwin: {
      id: 'K2', synthetic: true, title: '三个杠杆分母分叉', prompt: '债90、其他负债0、资产150、收入30；资产跌20%、负债不变。新的D/A、D/E、D/I分别是多少？',
      choices: three('60%、1.5、3', '75%、4、3', '75%、3、3'), correct: 'c', calculations: ['资产=150×0.8=120；权益=30。', 'D/A=90/120=75%；D/E=90/30=3；D/I=90/30=3。'],
      answer: 'C。75%、3倍、3倍。', judgment: 'D/I不变而D/A与D/E上升。', mechanismExplanation: '同一债务分子配上不同分母，回答的是偿债、损失吸收与资产覆盖三类问题；本题仅因其他负债显式为0，才可用资产减债务得到权益。', counterfactualOrFailure: '若存在其他负债，权益必须从资产扣除全部负债；若权益非正，D/E应报告不可解释或负权益，而不是强行给正常倍数。', sourceIds: [15, 16],
      numericAssertions: [{ key: 'debt-to-assets', expected: 0.75, unit: 'ratio' }, { key: 'debt-to-equity', expected: 3, unit: 'multiple' }, { key: 'debt-to-income', expected: 3, unit: 'multiple' }],
    },
  },
  {
    id: 'M3', mode: 'interpretation', label: 'Credit gap', synthetic: true,
    title: '信用/GDP为180%，同一vintage的单边趋势为165%；credit gap怎样表达？',
    brief: 'gap是比率水平相对估计趋势的百分点差，不是信用增长或危机概率。',
    facts: [{ label: 'credit/GDP', value: '180%', note: '比率水平' }, { label: 'one-sided trend', value: '165%', note: '估计趋势' }],
    formulas: ['gap = credit-to-GDP ratio − estimated one-sided trend'], formulaUnits: 'credit/GDP比率的百分点（pp）。',
    options: [
      { id: 'a', label: '+15个百分点', diagnosis: '正确；180−165=15pp。' },
      { id: 'b', label: '信用增长15%', diagnosis: '你把水平差误写成增长率。' },
      { id: 'c', label: '未来危机概率15%', diagnosis: '预警指标值不是概率。' },
    ],
    correct: 'a', calculation: '180%−165%=+15 percentage points。', judgment: '这是特定方法和vintage下的正gap。',
    mechanismExplanation: '比率上升可能来自信用分子上升，也可能来自GDP分母下降；趋势又是估计对象。', counterfactualOrFailure: '更换信用口径、GDP版本、起点或滤波规则会改变gap；它不是结构均衡。',
    primarySectionId: 'credit-gap', remediationSectionIds: ['credit-growth', 'early-warning'], sourceIds: [2, 8, 9, 10],
    numericAssertions: [{ key: 'gap', expected: 15, unit: 'percentage points' }],
    staticTwin: {
      id: 'K3', synthetic: true, title: '负gap仍不是“安全概率”', prompt: 'credit/GDP=150%，趋势=158%；最窄解释是什么？',
      choices: three('gap=−8pp', '信用收缩8%', '危机概率下降8%'), correct: 'a', calculations: ['150−158=−8pp。'], answer: 'A。gap为−8个百分点。',
      judgment: '低于该估计趋势。', mechanismExplanation: '负号只描述相对趋势的位置，不自动说明边际融资宽松、信用供给增加或系统安全。', counterfactualOrFailure: '若GDP突然上升或历史数据修订，gap会变化而信贷合同可能不变。', sourceIds: [2, 8], numericAssertions: [{ key: 'gap', expected: -8, unit: 'percentage points' }],
    },
  },
  {
    id: 'M4', mode: 'interpretation', label: 'Supply versus demand', synthetic: true,
    title: '贷款余额下降10%、申请下降25%，没有申请级反事实或外生贷款人暴露。最强结论是什么？',
    brief: '观察到的数量是供给、需求、风险、偿还、核销和构成共同决定的结果。',
    facts: [{ label: 'loan stock', value: '−10%', note: '余额变化' }, { label: 'applications', value: '−25%', note: '需求代理之一' }, { label: 'identification design', value: 'none', note: '没有外生处理或双边匹配' }],
    formulas: ['observed lending quantity = joint outcome of supply, demand, contract and accounting states'], formulaUnits: '描述式，不是一条可直接估计的加总恒等式。',
    options: [
      { id: 'a', label: '贷款供给冲击等于−10%', diagnosis: '余额下降没有把供给与需求、偿还和核销分开。' },
      { id: 'b', label: '贷款需求冲击等于−25%', diagnosis: '申请变化不是完整合格需求，更没有识别处理效应。' },
      { id: 'c', label: '数量下降，但供需分解尚未识别', diagnosis: '正确；描述证据到此为止。' },
    ],
    correct: 'c', calculation: '只能报告stock change=−10%、application change=−25%；supply shock与demand shock均为not identified。',
    judgment: '数量事实成立，因果归属停止。', mechanismExplanation: '借款人可能减少申请，银行可能提高标准，存量还受偿还与核销影响；这些路径可同时发生。',
    counterfactualOrFailure: '若有同一借款人面对不同银行的预定暴露、申请母体与银行时变冲击，才可能构造更窄的供给estimand。',
    primarySectionId: 'supply-demand-nonidentification', remediationSectionIds: ['conditions-to-menu', 'identification-gate'], sourceIds: [29, 30, 32, 35, 36],
    numericAssertions: [{ key: 'identification', expected: 'jointly-determined', unit: 'status' }],
    staticTwin: {
      id: 'K4', synthetic: true, title: '相对银行冲击仍不是总融资冲击', prompt: '同一借款人在暴露银行的贷款变化−20，在控制银行+5；预定暴露与设计门通过，pair estimand是多少？',
      choices: three('−15', '−25', '−20'), correct: 'b', calculations: ['相对银行效应=−20−(+5)=−25。'], answer: 'B。相对差为−25。',
      judgment: '只在声明假设下支持相对银行供给反应。', mechanismExplanation: '借款人固定效应帮助比较同一需求方受到不同贷款人冲击，但不观察其他渠道就不能推断总融资变化。', counterfactualOrFailure: '若借款人把缺口转向债券、非银行或内部现金，总外部融资不必下降25。', sourceIds: [29, 30, 32], numericAssertions: [{ key: 'pair-estimand', expected: -25, unit: 'relative change' }],
    },
  },
  {
    id: 'M5', mode: 'calculation', label: 'Collateral headroom', synthetic: true,
    title: '抵押市值120、eligible share 80%、advance rate 70%、已提款50；可用headroom是多少？',
    brief: '市值必须先经过法律资格与折扣，才成为borrowing base。',
    facts: [{ label: 'market value', value: '120', note: '不是可借金额' }, { label: 'eligibility × advance', value: '0.8 × 0.7', note: '合同与法律过滤' }, { label: 'drawn', value: '50', note: '占用基数' }],
    formulas: ['borrowing base = market value × eligible share × advance rate', 'headroom = borrowing base − existing secured drawn'], formulaUnits: '同一SYN货币单位。',
    options: [
      { id: 'a', label: '67.2', diagnosis: '这是borrowing base，尚未扣除已提款。' },
      { id: 'b', label: '17.2', diagnosis: '正确；67.2−50=17.2。' },
      { id: 'c', label: '46.0', diagnosis: '这没有对应完整合同算式。' },
    ],
    correct: 'b', calculation: '120×0.8×0.7=67.2；67.2−50=17.2。', judgment: '申请20时最多新增17.2，仍有2.8未满足。',
    mechanismExplanation: '市值下跌或eligible/advance rate下降会离散压缩headroom，触发再融资缺口。', counterfactualOrFailure: '没有所有权、可执行性或同一估值时点时，borrowing base必须STOP。',
    primarySectionId: 'collateral-borrowing-base', remediationSectionIds: ['borrower-net-worth', 'financial-accelerator'], sourceIds: [16, 17, 18, 26],
    numericAssertions: [{ key: 'borrowing-base', expected: 67.2, unit: 'SYN-currency' }, { key: 'headroom', expected: 17.2, unit: 'SYN-currency' }],
    staticTwin: {
      id: 'K5', synthetic: true, title: '另一份抵押借款基数', prompt: '市值100、eligible=.75、advance=.60、已提款32；headroom是多少？',
      choices: three('45', '18', '13'), correct: 'c', calculations: ['base=100×.75×.60=45。', 'headroom=45−32=13。'], answer: 'C。headroom为13。',
      judgment: '市值100并不支持新增68或45。', mechanismExplanation: '法律资格和advance rate先削减市值，既有提款再占用基数。', counterfactualOrFailure: '缺失抵押权或估值时钟时，即使13算对也不能进入canonical。', sourceIds: [18, 26], numericAssertions: [{ key: 'headroom', expected: 13, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M6', mode: 'calculation', label: 'Debt-service ratio', synthetic: true,
    title: '2026-09-11至2027-09-11前瞻支付窗：债务100、年利率4%、计划摊还本金6、气球本金0、收入25；DSR是多少？',
    brief: 'DSR比较同一窗口内的利息、本金与收入；本题用期初债务计全窗利息，并假设本金在窗末支付。',
    facts: [{ label: 'interest', value: '100×4%=4', note: '年度利息' }, { label: 'scheduled amortisation', value: '6', note: '不含气球本金' }, { label: 'balloon principal', value: '0', note: '与计划摊还互斥' }, { label: 'income', value: '25', note: '同一12个月' }],
    formulas: ['total principal due = amortisation excluding balloon + balloon principal; DSR = (interest + total principal due) / income'], formulaUnits: '0–1比率，展示为百分比；同一笔本金只进入一个桶。',
    options: [
      { id: 'a', label: '40%', diagnosis: '正确；(4+6)/25=40%。' },
      { id: 'b', label: '16%', diagnosis: '你只算了利息/收入。' },
      { id: 'c', label: '24%', diagnosis: '你只算了本金/收入。' },
    ],
    correct: 'a', calculation: '(100×0.04+6)/25=10/25=40%。', judgment: '这是现金流负担，不是债务/收入4倍。',
    mechanismExplanation: '利率重定价、本金到期集中或收入下降都能抬高DSR，并先于违约侵蚀缓冲。', counterfactualOrFailure: '若本金是季度量而收入是年度量、气球本金又被重复计入计划摊还、只部分债务重定价，或本金在窗内逐步摊还却仍用期初债务计全窗利息，40%就失效。',
    primarySectionId: 'debt-service-ratio', remediationSectionIds: ['maturity-wall', 'default-transition'], sourceIds: [11, 12, 13],
    numericAssertions: [{ key: 'dsr', expected: 0.4, unit: 'ratio' }],
    staticTwin: {
      id: 'K6', synthetic: true, title: '利息与互斥本金桶共同占用收入', prompt: '同一前瞻十二个月窗内：债120、年利率5%、不含气球本金的计划摊还6、气球本金2、年度收入35；按期初债务计全窗利息且本金视作窗末支付，DSR是多少？',
      choices: three('17.14%', '40%', '34.29%'), correct: 'b', calculations: ['利息=120×5%=6。', '(6+8)/35=14/35=40%。'], answer: 'B。DSR为40%。',
      judgment: '同样的DSR可以来自不同债务、利率、本金与收入组合。', mechanismExplanation: '只看债务/收入或利率无法恢复现金流负担；6单位计划摊还与2单位气球本金属于互斥分桶。', counterfactualOrFailure: '若一笔到期本金同时进入两个桶，DSR会被高估；若本金不是窗末支付，必须改用实际摊还表或加权平均余额。', sourceIds: [11, 13], numericAssertions: [{ key: 'dsr', expected: 0.4, unit: 'ratio' }],
    },
  },
  {
    id: 'M7', mode: 'calculation', label: 'Capital-loss feedback', synthetic: true,
    title: '资本10、最低资本率10%、RWA density 80%、计入前净账面贷款100。同一份EAD 10 × 假设净LGD 40%的估计按教学假设确认一次后，容量链如何闭合？',
    brief: '这里隔离“损失侵蚀资本—容量下降”机制，不是完整Basel合规计算。',
    facts: [{ label: 'capital', value: '10', note: '损失吸收垫' }, { label: 'minimum ratio', value: '10%', note: '教学门槛' }, { label: 'RWA density', value: '80%', note: '冻结不变' }, { label: 'loss bridge', value: 'EAD 10 × net LGD 40%', note: '完整回收期合成假设，非实现损失' }],
    formulas: ['synthetic loss estimate = defaulted EAD × assumed net economic LGD', 'simplified capacity = capital / (minimum capital ratio × RWA density)', 'required simple shrinkage = max(0, post-assumed-write-down loans − post-assumed-loss capacity)'], formulaUnits: 'SYN货币单位；比率是无量纲。',
    options: [
      { id: 'a', label: '125 → 96；无需收缩', diagnosis: '96是按同一估计减记后的贷款，不是资本约束容量。' },
      { id: 'b', label: '100 → 75；需收缩25', diagnosis: '100是当前贷款而非初始容量；减记后贷款也已由100降到96。' },
      { id: 'c', label: '125 → 75；需收缩21', diagnosis: '正确；初始容量125，估计计入后容量75，而假定减记后贷款96。' },
    ],
    correct: 'c', calculation: '初始容量=10/(0.10×0.80)=125；合成损失估计=10×40%=4；假定计入后资本=6、容量=6/(0.10×0.80)=75；贷款按同一估计减记为96，因此简化收缩量=96−75=21。', judgment: '125、75和21都只是冻结RWA密度与单一比率的教学桥；不是新增贷款意愿、已实现损失或监管裁决。',
    mechanismExplanation: '本题把违约时EAD乘假设净经济LGD得到合成损失估计，再在教学假设下让同一估计只确认一次，同时减少资本与计入前净账面贷款；风险密度和门槛不变时，允许支持的资产规模下降得更快。', counterfactualOrFailure: '真实LGD必须声明回收窗口、贴现日、可变现担保现金回收与处置成本；本题这些未来回收尚未观测。真实银行还受会计确认、杠杆率、流动性、风险权重迁移、缓冲、监管处置与内部限额约束。',
    primarySectionId: 'intermediary-capital-feedback', remediationSectionIds: ['bank-capacity', 'loss-severity'], sourceIds: [19, 20, 22, 25, 49],
    numericAssertions: [{ key: 'initial-capacity', expected: 125, unit: 'SYN-currency' }, { key: 'post-assumed-loss-capacity', expected: 75, unit: 'SYN-currency' }, { key: 'simple-shrinkage', expected: 21, unit: 'SYN-currency' }],
    staticTwin: {
      id: 'K7', synthetic: true, title: '资本损失估计的非线性容量效应', prompt: '资本12、最低率12%、RWA density 75%；随后违约时EAD 3乘100%假设净经济LGD，形成合成损失估计3。估计计入资本前后简化容量是多少？',
      choices: three('133.333与100', '100与75', '120与90'), correct: 'a', calculations: ['前：12/(.12×.75)=133.333。', '后：9/(.12×.75)=100。'], answer: 'A。容量从133.333降到100。',
      judgment: '3单位合成损失估计映射为33.333单位的简化容量下降。', mechanismExplanation: '资本是风险加权资产容量的薄缓冲，因此一旦该合成估计按教学假设计入资本，影响可放大到资产侧。', counterfactualOrFailure: '若回收尚未闭合或LGD口径不同，损失估计会改变；容量下降也不等于当期贷款必然立即下降同额，银行可补资本、改组合或使用缓冲。', sourceIds: [19, 20, 49], numericAssertions: [{ key: 'before-capacity', expected: 400 / 3, unit: 'SYN-currency' }, { key: 'after-capacity', expected: 100, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M8', mode: 'interpretation', label: 'Composition effect', synthetic: true,
    title: 'SME状态+1、债券发行人−0.5均不变；权重由60/40变为30/70。总体为何从0.4变为−0.05？',
    brief: '总体变化可以完全来自谁还留在样本或谁占更大暴露。',
    facts: [{ label: 'within states', value: '+1 / −0.5', note: '组内冻结' }, { label: 'weights', value: '60/40 → 30/70', note: '构成改变' }],
    formulas: ['aggregate change = within effect + composition effect'], formulaUnits: 'SYN状态点。',
    options: [
      { id: 'a', label: 'SME组内改善了0.45', diagnosis: '组内状态明确不变。' },
      { id: 'b', label: '纯构成效应为−0.45', diagnosis: '正确；within=0，composition=−0.45。' },
      { id: 'c', label: '已识别新的信用供给冲击', diagnosis: '权重变化不是外生供给处理。' },
    ],
    correct: 'b', calculation: '之前=.6×1+.4×(−.5)=.4；之后=.3×1+.7×(−.5)=−.05；变化=−.45。', judgment: '总体看似改善，组内谁都没变。',
    mechanismExplanation: '较宽松组占比上升会机械拉低总体指标，可能掩盖原来受约束群体仍然紧张。', counterfactualOrFailure: '使用固定权重反事实并同时报告组别分布，才能分开within与composition。',
    primarySectionId: 'distribution-heterogeneity', remediationSectionIds: ['underwriting-composition', 'conditions-to-menu'], sourceIds: [26, 30, 31],
    numericAssertions: [{ key: 'before', expected: 0.4, unit: 'SYN-index-points' }, { key: 'after', expected: -0.05, unit: 'SYN-index-points' }, { key: 'composition', expected: -0.45, unit: 'SYN-index-points' }],
    staticTwin: {
      id: 'K8', synthetic: true, title: '另一份纯构成分解', prompt: '两组状态+.8和−.2均不变；权重75/25变50/50。总体与composition effect是多少？',
      choices: three('.55→.55；0', '.30→.55；+.25', '.55→.30；−.25'), correct: 'c', calculations: ['初始=.75×.8+.25×(−.2)=.55。', '新=.5×.8+.5×(−.2)=.30；composition=−.25。'], answer: 'C。.55降至.30，纯构成效应−.25。',
      judgment: '总体变化不等于组内传导。', mechanismExplanation: '权重从紧组转向松组会改变均值，即使每组状态原地不动。', counterfactualOrFailure: '组别定义或支持总体改变时，简单两组分解也需重建。', sourceIds: [26, 31], numericAssertions: [{ key: 'before', expected: 0.55, unit: 'SYN-index-points' }, { key: 'after', expected: 0.3, unit: 'SYN-index-points' }, { key: 'composition', expected: -0.25, unit: 'SYN-index-points' }],
    },
  },
  {
    id: 'M9', mode: 'interpretation', label: 'Warning is not a shock', synthetic: true,
    title: 'credit z=1.5、asset-price z=1.0、spread z=−1.2；预警规则得1.233，但没有外生处理。可以怎样命名？',
    brief: '预警身份、预测验证和因果身份必须分三栏。',
    facts: [{ label: 'synthetic score', value: '(1.5+1−(−1.2))/3=1.233', note: '预注册教学规则' }, { label: 'causal gates', value: '0/3', note: '外生性、预定暴露、需求反事实均失败' }],
    formulas: ['warning score ≠ validated OOS probability ≠ identified causal shock'], formulaUnits: 'SYN指数点；不是概率或百分点效应。',
    options: [
      { id: 'a', label: '合成规则下预警升高；预测尚未估计，因果未识别', diagnosis: '正确；只授予算术与规则身份。' },
      { id: 'b', label: '已识别信用供给冲击1.233', diagnosis: '三道因果门都失败。' },
      { id: 'c', label: '未来危机概率123.3%', diagnosis: '分数不是概率，而且没有OOS校准。' },
    ],
    correct: 'a', calculation: '(1.5+1.0−(−1.2))/3=1.2333；warning=elevated under synthetic rule；prediction=not-estimated；causal=not-identified。',
    judgment: '机制一致的候选预警，不是预测成绩或shock。', mechanismExplanation: '信用繁荣与低利差可能先于危机，但共同驱动、反向预期和样本选择仍可解释相关性。',
    counterfactualOrFailure: '只有冻结标签、预测窗、vintage、阈值并做时间外评估后，才能升级预测；因果还需独立设计。',
    primarySectionId: 'identification-gate', remediationSectionIds: ['early-warning', 'turning-sequence'], sourceIds: [4, 9, 37, 38, 39, 40, 41, 42, 44],
    numericAssertions: [{ key: 'score', expected: 3.7 / 3, unit: 'SYN-index-points' }, { key: 'prediction', expected: 'not-estimated', unit: 'status' }, { key: 'causal', expected: 'not-identified', unit: 'status' }],
    staticTwin: {
      id: 'K9', synthetic: true, title: '一个因果门通过仍不够', prompt: 'credit z=1.2、asset z=.6、spread z=−.9；外生性通过，但预定暴露与需求反事实失败。最强结论？',
      choices: three('score=.9且因果已识别', 'score=.9；warning可输出但causal仍STOP', 'score=−.3且无任何描述'), correct: 'b', calculations: ['(1.2+.6−(−.9))/3=.9。', '2/3 causal gates failed，所以causal=not-identified。'], answer: 'B。预警算术与因果门分开。',
      judgment: '一个门通过不能补偿另两个门失败。', mechanismExplanation: '外生冲击若没有预定暴露或需求反事实，仍无法定义目标处理效应。', counterfactualOrFailure: '即使三门全过，也最多先成为identified-candidate，还需支持集、推断与安慰剂。', sourceIds: [29, 30, 42], numericAssertions: [{ key: 'score', expected: 0.9, unit: 'SYN-index-points' }, { key: 'causal', expected: 'not-identified', unit: 'status' }],
    },
  },
  {
    id: 'M10', mode: 'interpretation', label: 'Official BIS gap', synthetic: false,
    title: 'BIS序列 Q.US.P.A.C 的2025-Q4冻结值为−11.5378。最窄解释是什么？',
    brief: '这是2026-09-11下载的latest-vintage历史行，单位与算法必须一起保留。',
    facts: [{ label: 'series', value: 'Q.US.P.A.C', note: '美国私人非金融部门/全部贷款人/credit gap' }, { label: 'value', value: '−11.5378pp', note: '2025-Q4当前vintage' }],
    formulas: ['BIS credit gap = credit-to-GDP ratio − one-sided long-run trend'], formulaUnits: 'credit/GDP比率的百分点。',
    options: [
      { id: 'a', label: '美国贷款同比下降11.5378%', diagnosis: 'gap不是贷款增长。' },
      { id: 'b', label: '当前vintage下，信用/GDP比率低于单边趋势11.5378pp', diagnosis: '正确；还要携带修订警告。' },
      { id: 'c', label: '未来危机概率为−11.5378%', diagnosis: '概率不能为负，gap也不是概率。' },
    ],
    correct: 'b', calculation: '直接读取冻结官方行；不从图上估读。值为−11.5378pp。', judgment: '当前vintage下低于估计趋势，不等于“信用宽松”或“没有风险”。',
    mechanismExplanation: '分子、GDP分母和单边趋势端点都可随后续数据与修订变化。', counterfactualOrFailure: '这不是PIT档案；不能用今天下载的完整历史直接宣称历史实时预警表现。',
    primarySectionId: 'official-data', remediationSectionIds: ['credit-gap', 'early-warning'], sourceIds: [1, 2, 8, 9],
    numericAssertions: [{ key: 'official-gap', expected: -11.5378, unit: 'percentage points' }],
    staticTwin: {
      id: 'K10', synthetic: false, title: '官方BIS DSR的最窄语义', prompt: 'BIS Q.US.P 的2025-Q4冻结值14.1，最窄含义是什么？',
      choices: three('未偿债务占收入14.1倍', '新贷款增长14.1%', '方法定义下估算的私人非金融部门偿债支出占收入14.1%'), correct: 'c', calculations: ['直接读取冻结官方行：14.1%。', '该指标基于债务、收入、利率与剩余期限的统一估算。'], answer: 'C。估算DSR为收入的14.1%。',
      judgment: '这是aggregate model-based debt-service burden，不是债务存量或逐笔现金流。', mechanismExplanation: 'DSR把利息和摊还放入同一流量分子，因此比单纯利息负担更完整。', counterfactualOrFailure: '跨国绝对水平受期限与制度假设影响；更适合在一国时间序列内比较。', sourceIds: [11, 12, 13], numericAssertions: [{ key: 'official-dsr', expected: 14.1, unit: 'percent-of-income' }],
    },
  },
] as const;

const k1 = stockFlowBridge({ openingStock: 120, grossOriginations: 30, principalRepayments: 15, chargeOffs: 4, valuationChanges: -1, fxChanges: 0, reclassifications: 0, declaredClosingStock: 130, amountUnit: 'SYN-currency', periodStart: '2026-01-01', periodEnd: '2026-12-31' });
const k2 = passiveLeverageMetrics({ debt: 90, otherLiabilities: 0, assets: 150, income: 30, assetPriceShockPct: -20, amountUnit: 'SYN-currency', snapshotTime: '2026-09-11T00:00:00+08:00' });
const k5 = collateralCapacityMetrics({ marketValue: 100, eligibleShare: 0.75, advanceRate: 0.6, existingSecuredDrawn: 32, requestedIncrement: 20, marketValueShockPct: 0, ownershipVerified: true, enforceabilityVerified: true, valuationTime: '2026-09-11T00:00:00+08:00', amountUnit: 'SYN-currency' });
const k6 = debtServiceRepricingMetrics({ debt: 120, annualRatePct: 5, scheduledAmortisationExcludingBalloon: 6, balloonPrincipalDue: 2, annualIncome: 35, newAnnualRatePct: 5, incomeShockPct: 0, repricingShare: 1, amountUnit: 'SYN-currency', paymentWindow: 'twelve-month', paymentWindowStart: '2026-09-11T00:00:00+08:00', paymentWindowEnd: '2027-09-11T00:00:00+08:00', paymentWindowDirection: 'forward-contractual-cash-flows', interestAccrualAssumption: 'opening-debt-full-window-interest-principal-paid-at-window-end' });
const k7 = capitalLossFeedbackMetrics({ ...canonicalCapitalLossInput, capital: 12, minimumCapitalRatio: 0.12, rwaDensity: 0.75, currentLoans: 100, defaultedEad: 3, assumedNetEconomicLgd: 1 });
const k8 = compositionDecomposition([{ id: 'A', stateBefore: 0.8, stateAfter: 0.8, weightBefore: 0.75, weightAfter: 0.5 }, { id: 'B', stateBefore: -0.2, stateAfter: -0.2, weightBefore: 0.25, weightAfter: 0.5 }]);
const k9 = warningCausalGate({ creditGrowthZ: 1.2, assetPriceGrowthZ: 0.6, spreadZ: -0.9, warningThreshold: 0.8, labelDefinition: 'synthetic future event', predictionHorizon: '12-to-36-months', thresholdVersion: 'synthetic-rule-v1', exogeneityGate: true, predeterminedExposureGate: false, demandCounterfactualGate: false });

const computed: Record<string, number | string | null | undefined> = {
  'M1.closing': canonicalStockFlowResult?.computedClosingStock, 'M1.net-flow': canonicalStockFlowResult?.netTransactionFlow, 'M1.stock-change': canonicalStockFlowResult?.stockChange,
  'K1.closing': k1?.computedClosingStock, 'K1.net-flow': k1?.netTransactionFlow,
  'M2.debt-to-equity-after': canonicalPassiveLeverageResult?.after.debtToEquity, 'M2.debt-to-assets-after': canonicalPassiveLeverageResult?.after.debtToAssets,
  'K2.debt-to-assets': k2?.after.debtToAssets, 'K2.debt-to-equity': k2?.after.debtToEquity, 'K2.debt-to-income': k2?.after.debtToIncome,
  'M3.gap': 180 - 165, 'K3.gap': 150 - 158,
  'M4.identification': 'jointly-determined', 'K4.pair-estimand': -20 - 5,
  'M5.borrowing-base': canonicalCollateralCapacityResult?.before.borrowingBase, 'M5.headroom': canonicalCollateralCapacityResult?.before.rawHeadroom, 'K5.headroom': k5?.before.rawHeadroom,
  'M6.dsr': canonicalDebtServiceResult?.before.dsr, 'K6.dsr': k6?.before.dsr,
  'M7.initial-capacity': canonicalCapitalLossResult?.initialCapacity, 'M7.post-assumed-loss-capacity': canonicalCapitalLossResult?.postAssumedLossCapacity, 'M7.simple-shrinkage': canonicalCapitalLossResult?.requiredSimpleShrinkage,
  'K7.before-capacity': k7?.initialCapacity, 'K7.after-capacity': k7?.postAssumedLossCapacity,
  'M8.before': canonicalCompositionResult?.aggregateBefore, 'M8.after': canonicalCompositionResult?.aggregateAfter, 'M8.composition': canonicalCompositionResult?.compositionEffect,
  'K8.before': k8?.aggregateBefore, 'K8.after': k8?.aggregateAfter, 'K8.composition': k8?.compositionEffect,
  'M9.score': canonicalWarningResult?.vulnerabilityScore, 'M9.prediction': canonicalWarningResult?.predictionStatus, 'M9.causal': canonicalWarningResult?.causalStatus,
  'K9.score': k9?.vulnerabilityScore, 'K9.causal': k9?.causalStatus,
  'M10.official-gap': latestBis?.creditGap, 'K10.official-dsr': latestBis?.debtServiceRatio,
};

const approximately = (actual: number, expected: number, tolerance = 1e-8) => Math.abs(actual - expected) <= tolerance;
const countAnswerPositions = (answers: readonly CreditCycleChoice[]) => answers.reduce<Record<CreditCycleChoice, number>>((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 });
const balancedThreeThreeFour = (counts: Record<CreditCycleChoice, number>) => Object.values(counts).sort((left, right) => left - right).join(',') === '3,3,4';

export const creditCycleNumericAssertionAudit = creditCycleScenarios.flatMap((scenario) => [
  ...scenario.numericAssertions.map((assertion) => ({ scenarioId: scenario.id, ...assertion })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({ scenarioId: scenario.staticTwin.id, ...assertion })),
]).map((assertion) => {
  const actual = computed[`${assertion.scenarioId}.${assertion.key}`];
  const passed = typeof assertion.expected === 'number'
    ? typeof actual === 'number' && approximately(actual, assertion.expected, assertion.tolerance)
    : actual === assertion.expected;
  return { ...assertion, actual, passed };
});

const mainAnswerCounts = countAnswerPositions(creditCycleScenarios.map(({ correct }) => correct));
const twinAnswerCounts = countAnswerPositions(creditCycleScenarios.map(({ staticTwin }) => staticTwin.correct));

export const creditCycleScenarioAssertions = [
  { key: 'exactly-ten-scenarios', passed: creditCycleScenarios.length === 10 },
  { key: 'five-scenarios-per-mode', passed: creditCycleModes.every((mode) => creditCycleScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { key: 'M1-through-M10 ordered', passed: creditCycleScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { key: 'K1-through-K10 ordered', passed: creditCycleScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { key: 'every M and K has exactly three unique choices', passed: creditCycleScenarios.every(({ options, staticTwin }) => options.length === 3 && new Set(options.map(({ id }) => id)).size === 3 && staticTwin.choices.length === 3 && new Set(staticTwin.choices.map(({ id }) => id)).size === 3) },
  { key: 'every declared correct choice exists', passed: creditCycleScenarios.every(({ options, correct, staticTwin }) => options.some(({ id }) => id === correct) && staticTwin.choices.some(({ id }) => id === staticTwin.correct)) },
  { key: 'answer positions are balanced 3-3-4', passed: balancedThreeThreeFour(mainAnswerCounts) && balancedThreeThreeFour(twinAnswerCounts) },
  { key: 'every scenario has a complete learning loop', passed: creditCycleScenarios.every(({ calculation, judgment, mechanismExplanation, counterfactualOrFailure, primarySectionId, remediationSectionIds, sourceIds, staticTwin }) => Boolean(calculation && judgment && mechanismExplanation && counterfactualOrFailure && primarySectionId && remediationSectionIds.length && sourceIds.length && staticTwin.calculations.length && staticTwin.answer && staticTwin.judgment && staticTwin.mechanismExplanation && staticTwin.counterfactualOrFailure && staticTwin.sourceIds.length)) },
  { key: 'every scenario exposes numeric or status assertions', passed: creditCycleScenarios.every(({ numericAssertions, staticTwin }) => numericAssertions.length > 0 && staticTwin.numericAssertions.length > 0) },
  { key: 'all numeric and status assertions recompute', passed: creditCycleNumericAssertionAudit.every(({ passed }) => passed) },
] as const;

if (!creditCycleScenarioAssertions.every(({ passed }) => passed)) {
  throw new Error(`3.14 credit-cycle scenario gate failed: ${creditCycleScenarioAssertions.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}
