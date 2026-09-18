import {
  brokerDealerLeverageObservations,
  canonicalDebtOverhangResult,
  canonicalDeleveragingResults,
  canonicalDistributionResult,
  canonicalLeverageRegistryResult,
  canonicalNetDebtResult,
  canonicalPassiveLeverageResult,
  canonicalRefinancingGapInput,
  canonicalRefinancingGapResult,
  canonicalTargetLeverageResult,
  debtOverhangMetrics,
  deleveragingPathMetrics,
  leverageDistributionMetrics,
  leverageRegistryMetrics,
  netDebtEligibility,
  passiveLeverageShock,
  refinancingGapMetrics,
  targetLeverageProposal,
} from './debtLeverageFixtures';

export type DebtLeverageChoice = 'a' | 'b' | 'c';
export type DebtLeverageMode = 'ledger' | 'system';

export type DebtLeverageNumericAssertion = {
  key: string;
  expected: number | string;
  unit: string;
  tolerance?: number;
};

export type DebtLeverageOption = {
  id: DebtLeverageChoice;
  label: string;
  diagnosis: string;
};

export type DebtLeverageStaticTwin = {
  id: string;
  synthetic: boolean;
  title: string;
  prompt: string;
  choices: readonly DebtLeverageOption[];
  correct: DebtLeverageChoice;
  calculations: readonly string[];
  answer: string;
  judgment: string;
  mechanismExplanation: string;
  counterfactualOrFailure: string;
  sourceIds: readonly number[];
  numericAssertions: readonly DebtLeverageNumericAssertion[];
};

export type DebtLeverageScenario = {
  id: string;
  mode: DebtLeverageMode;
  label: string;
  synthetic: boolean;
  title: string;
  brief: string;
  facts: readonly { label: string; value: string; note: string }[];
  formulas: readonly string[];
  formulaUnits: string;
  options: readonly DebtLeverageOption[];
  correct: DebtLeverageChoice;
  calculation: string;
  judgment: string;
  mechanismExplanation: string;
  counterfactualOrFailure: string;
  primarySectionId: string;
  remediationSectionIds: readonly string[];
  sourceIds: readonly number[];
  numericAssertions: readonly DebtLeverageNumericAssertion[];
  staticTwin: DebtLeverageStaticTwin;
};

const three = (a: string, b: string, c: string): readonly DebtLeverageOption[] => [
  { id: 'a', label: a, diagnosis: '静态迁移题；完整解析见答案区。' },
  { id: 'b', label: b, diagnosis: '静态迁移题；完整解析见答案区。' },
  { id: 'c', label: c, diagnosis: '静态迁移题；完整解析见答案区。' },
];

export const debtLeverageModes: readonly { id: DebtLeverageMode; label: string; description: string }[] = [
  { id: 'ledger', label: '账本与约束', description: '先锁定资产负债表、分母、可用现金、到期窗和目标规则。' },
  { id: 'system', label: '系统与反馈', description: '再判断重定价、投资激励、去杠杆外溢、尾部与证据边界。' },
];

// These are deliberately incorrect source-policy paths, not alternative
// canonical states. The display labels and diagnostics use their recomputed
// results so a conceptual distractor cannot acquire an unrelated arithmetic error.
const m5FullFacilityWrongPath = refinancingGapMetrics({ ...canonicalRefinancingGapInput, facilityAvailabilityFactor: 1 });
const m5ExcludeCashAndOcfWrongPath = refinancingGapMetrics({ ...canonicalRefinancingGapInput, eligibleOpeningCash: 0, nonOverlappingOperatingCashFlow: 0 });
if (!m5FullFacilityWrongPath || !m5ExcludeCashAndOcfWrongPath) throw new Error('M5 distractor path fixtures did not close');

export const debtLeverageScenarios: readonly DebtLeverageScenario[] = [
  {
    id: 'M1', mode: 'ledger', label: 'Leverage registry', synthetic: true,
    title: '同一资产负债表能否只用一个“杠杆率”概括？',
    brief: '先登记分子、分母、合并范围与时钟；不同杠杆率回答不同问题。',
    facts: [
      { label: 'balance sheet', value: '资产100；债务80；其他负债10', note: '同一主体、同一时点' },
      { label: 'flows', value: 'TTM收入20；EBITDA 16', note: '流量窗口明确' },
      { label: 'cash / exposure', value: '合资格现金5；gross exposure 150；NAV 10', note: '不能跨口径混用' },
    ],
    formulas: ['E=A−D−L_other', 'D/A；D/E；A/E；D/I；(D−eligible cash)/EBITDA；gross exposure/NAV'],
    formulaUnits: '资产负债表金额为同一SYN货币单位；杠杆率为比率或倍数。',
    options: [
      { id: 'a', label: 'D/A=80%，所以所有口径都显示0.8倍', diagnosis: '不同分母不能互换；权益、收入、EBITDA和NAV不是资产。' },
      { id: 'b', label: 'E=10；D/E=8倍、A/E=10倍、本课合资格净债务/EBITDA=4.6875倍', diagnosis: '正确；债务也没有被偷偷当作全部负债，现金按已注册资格政策扣除。' },
      { id: 'c', label: '权益=20，因为只需从资产扣除债务', diagnosis: '遗漏了其他负债10，资产负债表没有闭合。' },
    ],
    correct: 'b',
    calculation: '总负债=80+10=90，权益=100−90=10；D/A=.8，D/E=8，A/E=10，D/I=4，本课目标日合资格净债务/EBITDA=(80−5)/16=4.6875，gross exposure/NAV=15。',
    judgment: '“杠杆”不是一个可脱离分母使用的数字；每次比较都必须携带口径护照。',
    mechanismExplanation: '资产覆盖、权益损失吸收、收入偿债、经营现金创造与表内外风险规模分别由不同分母刻画。',
    counterfactualOrFailure: '若权益、EBITDA或NAV非正，相关倍数应停止解释；若现金受限、跨主体或跨币种，也不能进入本课目标日合资格净债务。实务换政策时必须换标签重算。',
    primarySectionId: 'leverage-measure-registry', remediationSectionIds: ['gross-net-debt', 'evidence-boundaries'], sourceIds: [1, 5, 6, 7],
    numericAssertions: [
      { key: 'equity', expected: 10, unit: 'SYN-currency' },
      { key: 'debt-to-equity', expected: 8, unit: 'multiple' },
      { key: 'net-debt-to-ebitda', expected: 75 / 16, unit: 'multiple' },
      { key: 'gross-exposure-to-nav', expected: 15, unit: 'multiple' },
    ],
    staticTwin: {
      id: 'K1', synthetic: true, title: '换一张资产负债表重新登记',
      prompt: '资产120、债72、其他负债18、TTM收入24、EBITDA18、合资格现金6、gross exposure 180、NAV 20；哪组正确？',
      choices: three('E=30；D/E=2.4；本课合资格净债务/EBITDA≈3.667；gross exposure/NAV=9', 'E=48；D/E=1.5；本课合资格净债务/EBITDA=4', 'E=30；所有杠杆率都等于60%'),
      correct: 'a', calculations: ['E=120−72−18=30。', 'D/E=72/30=2.4；(72−6)/18≈3.667；180/20=9。', '若遗漏其他负债18，会把E错算为48、D/E错报为72/48=1.5，而真实D/E是2.4。'],
      answer: 'A。四个数来自四个明确口径。', judgment: '资产负债表闭合之后，仍要逐一登记分母。',
      mechanismExplanation: '同一债务分子面对资产、权益、收入或经营现金流时，经济问题不同。',
      counterfactualOrFailure: '若把其他负债漏掉，权益会被高估，所有以权益为分母的杠杆都会被低估。', sourceIds: [5, 6, 7],
      numericAssertions: [{ key: 'equity', expected: 30, unit: 'SYN-currency' }, { key: 'debt-to-equity', expected: 2.4, unit: 'multiple' }, { key: 'net-debt-to-ebitda', expected: 11 / 3, unit: 'multiple' }, { key: 'gross-exposure-to-nav', expected: 9, unit: 'multiple' }, { key: 'omitted-liability-equity', expected: 48, unit: 'SYN-currency' }, { key: 'omitted-liability-debt-to-equity', expected: 1.5, unit: 'multiple' }, { key: 'omission-direction', expected: 'equity-overstated-leverage-understated', unit: 'status' }],
    },
  },
  {
    id: 'M2', mode: 'ledger', label: 'Passive leverage', synthetic: true,
    title: '没有新增借款，杠杆为什么仍从10倍跳到16倍？',
    brief: '固定名义债务与薄权益相遇时，小幅资产损失会先压缩分母。',
    facts: [
      { label: 'before', value: 'A=100；D=90；其他负债=0；E=10', note: 'A/E=10' },
      { label: 'shock', value: '资产价格−4%', note: '债务数量冻结' },
      { label: 'after', value: 'A=96；D=90；E=6', note: '尚未发生主动交易' },
    ],
    formulas: ['E_after=A_before×(1+shock)−D−L_other', 'passive A/E=A_after/E_after'],
    formulaUnits: '金额为SYN货币；价格冲击与权益损失为百分比；A/E为倍数。',
    options: [
      { id: 'a', label: '杠杆仍为10倍，因为债务没有变化', diagnosis: '债务分子固定不代表权益分母固定。' },
      { id: 'b', label: '杠杆降到9.6倍，因为资产降到96', diagnosis: '你把96直接除以冲击前权益10，遗漏权益先吸收损失。' },
      { id: 'c', label: 'A/E升至16倍，权益损失40%，但这仍是被动状态', diagnosis: '正确；尚不能把随后目标规则的交易当成实际行动。' },
    ],
    correct: 'c', calculation: 'A_after=100×.96=96；E_after=96−90=6；A/E=96/6=16；权益损失=(6/10−1)=−40%。',
    judgment: '资产只跌4%，薄权益却跌40%；被动杠杆上升不需要新增债务。',
    mechanismExplanation: '债务具有先偿付性，市值损失先由剩余权益承担，因此资产冲击被权益分母放大。',
    counterfactualOrFailure: '若债务同步偿还、资产未按市值计量、存在其他负债或权益已非正，路径与可解释性都会改变。',
    primarySectionId: 'passive-leverage', remediationSectionIds: ['leverage-measure-registry', 'target-leverage'], sourceIds: [16, 17, 18, 20],
    numericAssertions: [{ key: 'after-assets', expected: 96, unit: 'SYN-currency' }, { key: 'after-equity', expected: 6, unit: 'SYN-currency' }, { key: 'assets-to-equity', expected: 16, unit: 'multiple' }, { key: 'equity-loss', expected: -40, unit: 'percent' }],
    staticTwin: {
      id: 'K2', synthetic: true, title: '另一种薄权益放大',
      prompt: 'A=150、D=120、其他负债=10，资产跌5%且负债冻结；冲击后的E、A/E与权益损失是多少？',
      choices: three('E=22.5；A/E≈6.333；权益损失−25%', 'E=12.5；A/E=11.4；权益损失−37.5%', 'E=20；A/E=7.125；权益不变'),
      correct: 'b', calculations: ['A_after=150×.95=142.5；E_after=142.5−120−10=12.5。', 'A/E=142.5/12.5=11.4；权益由20降至12.5，即−37.5%。'],
      answer: 'B。债务没增加，但权益分母快速收缩。', judgment: '被动杠杆必须先于任何行为假设计算。',
      mechanismExplanation: '初始权益只有20，7.5的资产损失已吞掉37.5%的权益。',
      counterfactualOrFailure: '若把其他负债10遗漏，便会错误报告E=22.5并显著低估杠杆。', sourceIds: [16, 18, 20],
      numericAssertions: [{ key: 'after-equity', expected: 12.5, unit: 'SYN-currency' }, { key: 'assets-to-equity', expected: 11.4, unit: 'multiple' }, { key: 'equity-loss', expected: -37.5, unit: 'percent' }],
    },
  },
  {
    id: 'M3', mode: 'ledger', label: 'Target leverage', synthetic: true,
    title: '16倍的被动杠杆若面对10倍目标规则，会“要求”卖多少资产？',
    brief: '目标是合成决策规则；它生成提案，不是对真实行为的观察。',
    facts: [
      { label: 'post-shock', value: 'A=96；D=90；E=6', note: '来自M2的被动状态' },
      { label: 'target', value: 'A/E=10', note: 'SYNTHETIC规则，不是估计参数' },
      { label: 'execution assumption', value: '卖出所得按面值还债；无价格冲击', note: '仅隔离账本闭合' },
    ],
    formulas: ['target assets=target A/E×post-shock equity', 'proposed sale=A_after−target assets'],
    formulaUnits: '金额为SYN货币；目标为无量纲倍数。',
    options: [
      { id: 'a', label: '建议卖36并还债36，终点A=60、D=54、E=6；实际行动仍未知', diagnosis: '正确；这是规则的条件性提案，不是观察到的成交。' },
      { id: 'b', label: '建议卖6，因为权益缺口为6', diagnosis: '目标约束作用于总资产相对权益，不是只补一个权益数字。' },
      { id: 'c', label: '已证实机构实际卖出36', diagnosis: '模型输出不能被提升为实际行动。' },
    ],
    correct: 'a', calculation: '目标资产=10×6=60；建议资产交易=60−96=−36，建议债务变化同为−36；终点60=54+6，A/E=10。',
    judgment: '容量、目标、选择与实际调整是四个对象；本题只计算合成目标规则的提案。',
    mechanismExplanation: '当权益先缩水而目标倍数固定，恢复目标可能要求成倍缩表；多人同时执行时才可能形成价格反馈。',
    counterfactualOrFailure: '若可补充权益、放宽目标、容忍偏离、资产出售折价或债务不能按面值偿还，36不会是实际路径。',
    primarySectionId: 'target-leverage', remediationSectionIds: ['passive-leverage', 'deleveraging-paths'], sourceIds: [18, 19, 20, 21],
    numericAssertions: [{ key: 'required-sale', expected: 36, unit: 'SYN-currency' }, { key: 'end-assets', expected: 60, unit: 'SYN-currency' }, { key: 'end-debt', expected: 54, unit: 'SYN-currency' }, { key: 'actual-status', expected: 'not-observed', unit: 'status' }],
    staticTwin: {
      id: 'K3', synthetic: true, title: '正向冲击也能生成扩表提案',
      prompt: 'A=100、D=80、其他负债=0，资产先涨10%；若合成目标A/E=4且新增资产全由债务融资，提案是什么？',
      choices: three('卖10并还债10', '维持A=110，因为目标就是实际行为', '买入10并新增债务10，终点A=120、D=90、E=30'),
      correct: 'c', calculations: ['冲击后A=110、E=30、A/E≈3.667。', '目标资产=4×30=120，所以提议买入10并融资10。'],
      answer: 'C。规则提出扩表10；实际是否执行仍未知。', judgment: '目标杠杆规则在好时期也可能形成顺周期扩表提案。',
      mechanismExplanation: '资产上涨抬高权益，使冻结的目标倍数允许更大资产负债表。',
      counterfactualOrFailure: '若目标本身随风险变化、融资成本上升或管理层不追逐目标，提案不会机械实现。', sourceIds: [18, 19, 20],
      numericAssertions: [{ key: 'proposed-purchase', expected: 10, unit: 'SYN-currency' }, { key: 'end-assets', expected: 120, unit: 'SYN-currency' }, { key: 'end-debt', expected: 90, unit: 'SYN-currency' }, { key: 'actual-status', expected: 'not-observed', unit: 'status' }],
    },
  },
  {
    id: 'M4', mode: 'ledger', label: 'Gross versus net debt', synthetic: true,
    title: '账上现金31，为什么本课目标日合资格净债务只允许扣5？',
    brief: '现金只有在同一法律主体、同一币种、不受限且目标日前可用时才构成同口径缓冲。',
    facts: [
      { label: 'gross debt', value: '80 SYN；SYN-PARENT；目标日2026-12-31', note: '净额计算的债务护照' },
      { label: 'candidate cash', value: '5 + 7 + 9 + 4 + 6 = 31', note: '分别含受限、子公司、错币种或晚到现金' },
      { label: 'eligible', value: '仅5', note: '四道资格门同时通过' },
    ],
    formulas: ['eligible cash=Σ cash_i×I(same entity,currency,unrestricted,available by target)', 'course-policy eligible net debt=gross debt−eligible cash'],
    formulaUnits: '同一SYN货币单位；资格判断先于加总。',
    options: [
      { id: 'a', label: '本课合资格净债务49，因为全部账面现金都可扣除', diagnosis: '现金不一定可由该债务主体在目标日用于偿债。' },
      { id: 'b', label: '本课合资格净债务75；其余26不能跨法律、币种、限制或时间门', diagnosis: '正确；只扣同时通过本课四门政策的5。' },
      { id: 'c', label: '本课合资格净债务80，因为现金永远不能扣除', diagnosis: '同主体、同币种、不受限且及时可用的现金可以在本课声明口径下扣除。' },
    ],
    correct: 'b', calculation: '本课政策下的合资格现金=5；受限7、子公司9、错币种4、目标日后到账6均排除；目标日合资格净债务=80−5=75。',
    judgment: 'gross debt与本课目标日合资格net debt都可有用，但后者必须携带政策ID；它不是实务中唯一通用定义，也不能凭“账上有钱”直接净额化。',
    mechanismExplanation: '危机中的偿债能力取决于谁在何时能以何种币种动用现金，而非集团表面总现金。',
    counterfactualOrFailure: '若存在可执行的跨主体担保、已锁定外汇互换或限制解除文件，应更新护照后重算；不能口头假设可转移。',
    primarySectionId: 'gross-net-debt', remediationSectionIds: ['leverage-measure-registry', 'maturity-refinancing'], sourceIds: [5, 6, 10],
    numericAssertions: [{ key: 'eligible-cash', expected: 5, unit: 'SYN-currency' }, { key: 'net-debt', expected: 75, unit: 'SYN-currency' }, { key: 'eligible-count', expected: 1, unit: 'count' }],
    staticTwin: {
      id: 'K4', synthetic: true, title: '现金资格门的另一组输入',
      prompt: 'HoldCo有USD债60；五笔现金分别为同主体可用USD 8、受限USD 5、子公司USD 10、EUR 7、目标日后USD 4。按本课政策，目标日合资格净债务是多少？',
      choices: three('52', '26', '60'), correct: 'a', calculations: ['只有8同时满足同主体、同币种、不受限、及时可用。', 'net debt=60−8=52。'],
      answer: 'A。本课目标日合资格净债务52。', judgment: '现金总额34并不是按本课政策可用于这笔债务的34；换一个合法披露的实务政策可能得到不同口径。',
      mechanismExplanation: '法律与结算约束会把会计现金和目标日流动性缓冲分开。',
      counterfactualOrFailure: '若EUR已完全对冲且交割日在目标日前，也须把对冲合同身份和结算现金流显式加入，不能直接视作USD。', sourceIds: [5, 6, 10],
      numericAssertions: [{ key: 'eligible-cash', expected: 8, unit: 'SYN-currency' }, { key: 'net-debt', expected: 52, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M5', mode: 'ledger', label: 'Maturity and refinancing', synthetic: true,
    title: '一年内到期30，为什么可靠资金19对应再融资缺口11？',
    brief: '债务总量不变时，到期集中和资金可得性也能改变脆弱性。',
    facts: [
      { label: 'uses', value: '窗口内互斥本金桶30；利息0；其他用途（不含本金与利息）0', note: '利息显式冻结；三栏互斥，本金不得重复计入' },
      { label: 'sources', value: '期初合资格现金8；非重叠经营现金流7', note: '同一窗口' },
      { label: 'facility', value: '承诺未提款5×可用系数80%=4', note: '不是无条件的5' },
    ],
    formulas: ['uses=principal due+interest due+other uses', 'reliable sources=cash+non-overlapping OCF+committed facility×availability', 'gap=max(0, uses−reliable sources)；surplus=max(0, reliable sources−uses)'],
    formulaUnits: '全部为同一SYN货币单位、同一前瞻窗口。',
    options: [
      { id: 'a', label: `缺口${m5FullFacilityWrongPath.refinancingGap}，因为授信额度5必须全额可用`, diagnosis: `把授信5全额算入，会误计可靠来源${m5FullFacilityWrongPath.totalReliableSources}、误算缺口${m5FullFacilityWrongPath.refinancingGap}。本题可计入的是5×80%=4；请修正可用系数后重算。` },
      { id: 'b', label: `缺口${m5ExcludeCashAndOcfWrongPath.refinancingGap}，因为现金和经营现金流不能计入`, diagnosis: `排除现金8与经营现金流7，会误计可靠来源${m5ExcludeCashAndOcfWrongPath.totalReliableSources}、误算缺口${m5ExcludeCashAndOcfWrongPath.refinancingGap}。二者在本题已通过资格和非重叠门；请保留合资格来源后重算。` },
      { id: 'c', label: '可靠来源19，缺口11', diagnosis: '正确；8+7+4=19，30−19=11。' },
    ],
    correct: 'c', calculation: '可用承诺资金=5×.8=4；可靠来源=8+7+4=19；总用途=本金30+利息0+其他用途0=30；gap=max(0,30−19)=11，surplus=max(0,19−30)=0。',
    judgment: '高存量债务并非唯一风险；短期到期墙可能在长期偿付能力尚可时先制造流动性压力。',
    mechanismExplanation: '旧债到期必须以现金、经营流量或新融资接续；信贷状态恶化时，名义授信不一定完全兑现。',
    counterfactualOrFailure: '若到期桶重叠、同一现金被重复计算、窗口错配或授信可撤销，11不再有效；必须STOP并修复数据。',
    primarySectionId: 'maturity-refinancing', remediationSectionIds: ['gross-net-debt', 'rate-reset-service'], sourceIds: [7, 8, 10, 22, 23, 24, 25],
    numericAssertions: [{ key: 'principal-due', expected: 30, unit: 'SYN-currency' }, { key: 'interest-due', expected: 0, unit: 'SYN-currency' }, { key: 'uses', expected: 30, unit: 'SYN-currency' }, { key: 'available-facility', expected: 4, unit: 'SYN-currency' }, { key: 'reliable-sources', expected: 19, unit: 'SYN-currency' }, { key: 'gap', expected: 11, unit: 'SYN-currency' }, { key: 'surplus', expected: 0, unit: 'SYN-currency' }, { key: 'wrong-full-facility-sources', expected: 20, unit: 'SYN-currency' }, { key: 'wrong-full-facility-gap', expected: 10, unit: 'SYN-currency' }, { key: 'wrong-exclude-cash-ocf-sources', expected: 4, unit: 'SYN-currency' }, { key: 'wrong-exclude-cash-ocf-gap', expected: 26, unit: 'SYN-currency' }],
    staticTwin: {
      id: 'K5', synthetic: true, title: '换一个到期窗复算缺口',
      prompt: '窗口内本金24、利息1、其他用途（不含本金与利息）1；合资格现金6、非重叠经营现金流8、承诺未提款10且可用系数50%。缺口是多少？',
      choices: three('5', '7', '9'), correct: 'b', calculations: ['总用途=本金24+利息1+其他用途1=26。', '可靠来源=6+8+10×.5=19；gap=max(0,26−19)=7，surplus=0。'],
      answer: 'B。再融资缺口7。', judgment: '其他用途也会与到期本金争夺同一流动性池。',
      mechanismExplanation: '把来源与用途放在同一窗口，才看得见到期墙是否需要外部再融资。',
      counterfactualOrFailure: '若OCF已经包含期初现金变化或授信与另一来源重复，来源19会被高估。', sourceIds: [7, 8, 10, 22, 25],
      numericAssertions: [{ key: 'interest-due', expected: 1, unit: 'SYN-currency' }, { key: 'other-uses', expected: 1, unit: 'SYN-currency' }, { key: 'uses', expected: 26, unit: 'SYN-currency' }, { key: 'reliable-sources', expected: 19, unit: 'SYN-currency' }, { key: 'gap', expected: 7, unit: 'SYN-currency' }, { key: 'surplus', expected: 0, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M6', mode: 'system', label: 'Rate reset versus maturity', synthetic: true,
    title: '只有60%的债务重定价，偿债负担怎样变化？',
    brief: '利率重定价时钟与本金到期时钟不同；未到期的浮动利率债也会先增加现金流压力。',
    facts: [
      { label: 'debt', value: '100；其中60%由3%重定价到7%', note: '其余40%仍为3%' },
      { label: 'window principal', value: '2', note: '与利息分开' },
      { label: 'window income', value: '20', note: '同一前瞻年' },
    ],
    formulas: ['interest_after=D×[(1−repricing share)×old rate+repricing share×new rate]', 'service ratio=(interest+principal due)/income'],
    formulaUnits: '金额为SYN货币；利率和偿债负担显示为百分比。',
    options: [
      { id: 'a', label: '利息5.4，偿债负担37%；本金未到期部分也可先重定价', diagnosis: '正确；重定价和到期是两条时钟。' },
      { id: 'b', label: '利息7，偿债负担45%，因为全部债务立即按7%', diagnosis: '只有60%重定价，不能把新利率施加于全部债务。' },
      { id: 'c', label: '利息仍为3，因为本金只到期2', diagnosis: '利率重定价不要求本金到期。' },
    ],
    correct: 'a', calculation: '利息=100×(.4×.03+.6×.07)=5.4；同窗偿债负担=(5.4+2)/20=37%。',
    judgment: '低到期本金不保证低利率风险；重定价份额、利率路径和收入窗口必须分别登记。',
    mechanismExplanation: '浮息或短重置合同把政策利率更快传到现金流，随后才可能压缩消费、投资或缓冲。',
    counterfactualOrFailure: '若使用利率掉期、不同债务在窗内分段重置或收入也变化，必须按合同现金流重建，不能套用本题加权平均。',
    primarySectionId: 'rate-reset-service', remediationSectionIds: ['maturity-refinancing', 'aggregate-demand-feedback'], sourceIds: [7, 8, 10, 29, 31],
    numericAssertions: [{ key: 'interest', expected: 5.4, unit: 'SYN-currency' }, { key: 'service-ratio', expected: 0.37, unit: 'ratio' }, { key: 'repricing-status', expected: 'distinct-from-maturity', unit: 'status' }],
    staticTwin: {
      id: 'K6', synthetic: true, title: '较小重定价份额的现金流桥',
      prompt: '债120，25%从4%重定价到8%，其余仍为4%；同窗本金3、收入30。利息与偿债负担是多少？',
      choices: three('利息9.6；负担42%', '利息4.8；负担26%', '利息6；负担30%'), correct: 'c',
      calculations: ['利息=120×(.75×.04+.25×.08)=6。', '偿债负担=(6+3)/30=30%。'],
      answer: 'C。利息6，偿债负担30%。', judgment: '只有重定价部分应用新利率。',
      mechanismExplanation: '合同重置结构决定利率冲击进入现金流的速度，而不是债务总量单独决定。',
      counterfactualOrFailure: '若本金在窗内逐步摊还，应使用实际余额路径；用期初余额计算全年利息会偏高。', sourceIds: [7, 8, 10],
      numericAssertions: [{ key: 'interest', expected: 6, unit: 'SYN-currency' }, { key: 'service-ratio', expected: 0.3, unit: 'ratio' }],
    },
  },
  {
    id: 'M7', mode: 'system', label: 'Debt overhang', synthetic: true,
    title: '总NPV为+5的项目，为什么旧股东仍可能拒绝？',
    brief: '高旧债会让新项目的一部分收益先转移给旧债权人，造成投资激励楔子。',
    facts: [
      { label: 'without project', value: '终值资产90；旧债面值100', note: '债权人90、股东0' },
      { label: 'project', value: '旧股东现在支付10；终值增加15', note: '无新优先索取权' },
      { label: 'with project', value: '终值资产105', note: '债权人100、股东5' },
    ],
    formulas: ['total NPV=payoff increment−cost', 'equity NPV=(equity with−equity without)−equity-funded cost'],
    formulaUnits: '全部为同一SYN货币单位；终值未折现是本题冻结假设。',
    options: [
      { id: 'a', label: '股东会接受，因为总NPV +5必然全部归股东', diagnosis: '项目增值中有10先改善旧债权人的回收。' },
      { id: 'b', label: '总NPV +5、债权人增益10、股权NPV −5；存在债务悬置', diagnosis: '正确；总价值和旧股东私人激励必须分开。' },
      { id: 'c', label: '项目总NPV −5，所以拒绝没有融资摩擦', diagnosis: '项目本身增加15、成本10，总NPV是+5。' },
    ],
    correct: 'b', calculation: '无项目：creditor=90、equity=0；有项目：creditor=min(100,105)=100、equity=5；total NPV=15−10=5，creditor gain=10，equity NPV=5−10=−5。',
    judgment: '价值创造为正不保证原股东愿意出资；这是一种分配诱因问题，不是项目技术NPV为负。',
    mechanismExplanation: '旧债处于受损区间时，新投资提高回收率，部分边际收益被旧债权人捕获，股东因而可能投资不足。',
    counterfactualOrFailure: '若旧债可重谈、项目由新优先债融资、风险和贴现不同或有限责任结构改变，收益分配与结论都可能反转。',
    primarySectionId: 'debt-overhang', remediationSectionIds: ['leverage-measure-registry', 'deleveraging-paths'], sourceIds: [12, 13, 14, 26],
    numericAssertions: [{ key: 'total-npv', expected: 5, unit: 'SYN-currency' }, { key: 'creditor-gain', expected: 10, unit: 'SYN-currency' }, { key: 'equity-npv', expected: -5, unit: 'SYN-currency' }],
    staticTwin: {
      id: 'K7', synthetic: true, title: '另一组债务悬置分配',
      prompt: '无项目终值资产70、旧债面值80；旧股东出资8使终值增加12。总NPV、债权人增益与股权NPV是多少？',
      choices: three('+4、+10、−6', '+4、+2、+2', '−4、+10、−6'), correct: 'a',
      calculations: ['无项目：债权人70、股东0；有项目总资产82：债权人80、股东2。', 'total NPV=12−8=4；creditor gain=10；equity NPV=2−8=−6。'],
      answer: 'A。总价值增加，但旧股东的私人NPV为负。', judgment: '债务悬置来自增量价值的索取权分配。',
      mechanismExplanation: '项目让旧债从70恢复到80，留下给股东的终值增量只有2，却要求其先投入8。',
      counterfactualOrFailure: '若债权人让渡部分旧债价值或共同出资，原来的拒绝激励可能消失。', sourceIds: [12, 14, 26],
      numericAssertions: [{ key: 'total-npv', expected: 4, unit: 'SYN-currency' }, { key: 'creditor-gain', expected: 10, unit: 'SYN-currency' }, { key: 'equity-npv', expected: -6, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M8', mode: 'system', label: 'Deleveraging paths', synthetic: true,
    title: '同样回到A/E=10，四条去杠杆路径为何不等价？',
    brief: '比率终点相同，不代表资产、债务、权益、现金流和损失承担者相同。',
    facts: [
      { label: 'initial', value: 'A=96；D=90；E=6；A/E=16', note: '其他负债=0' },
      { label: 'target', value: 'A/E=10', note: '冻结目标' },
      { label: 'paths', value: '卖资产还债／新股留现／留存收益留现／债务减记', note: '合成账本路径' },
    ],
    formulas: ['sale=(A−target×E)', 'new equity or retained earnings=(A−target×E)/(target−1)', 'write-down=(A−target×E)/target'],
    formulaUnits: '全部为SYN货币；终点倍数相同，经济路径不同。',
    options: [
      { id: 'a', label: '四条路径都需要36，所以宏观效果相同', diagnosis: '补权益和减记会改变权益分母，所需金额不同。' },
      { id: 'b', label: '债务减记3.6等于现金偿还3.6', diagnosis: '减记转移损失，不产生同额现金流，不能称作还款。' },
      { id: 'c', label: '卖资产还债36；新股或留存收益4；减记3.6，且都只是合成路径', diagnosis: '正确；比率闭合不等于实际行为或相同外溢。' },
    ],
    correct: 'c', calculation: '卖资产还债：96−10×6=36；补权益或留存收益：(96−60)/(10−1)=4；债务减记=(96−60)/10=3.6。四个终点均A/E=10。',
    judgment: '杠杆下降必须分解为债务偿还、资产出售、权益/收入增长、估值变化或减记；不能只看一个比率。',
    mechanismExplanation: '资产出售可能压价，留存收益可能压缩支出，新股把资金来源转给投资者，减记把损失转给债权人。',
    counterfactualOrFailure: '若出售有折价、补股不能全部留现、利润不是现金或债权人减记引发自身约束，静态闭合金额会改变并产生二阶反馈。',
    primarySectionId: 'deleveraging-paths', remediationSectionIds: ['target-leverage', 'aggregate-demand-feedback'], sourceIds: [26, 27, 28, 29, 30, 31],
    numericAssertions: [{ key: 'sale', expected: 36, unit: 'SYN-currency' }, { key: 'new-equity', expected: 4, unit: 'SYN-currency' }, { key: 'write-down', expected: 3.6, unit: 'SYN-currency' }, { key: 'retained-earnings', expected: 4, unit: 'SYN-currency' }, { key: 'all-reach-target', expected: 'yes', unit: 'status' }],
    staticTwin: {
      id: 'K8', synthetic: true, title: '换一个初始状态比较路径',
      prompt: 'A=80、D=74、E=6，要回到A/E=8；无折价时卖资产还债、补新股留现、债务减记各需多少？',
      choices: three('32、4、4', '32、约4.571、4', '26、约3.714、3.25'), correct: 'b',
      calculations: ['冻结权益下超额资产=80−8×6=32。', '卖还32；补股=32/(8−1)≈4.571；减记=32/8=4。'],
      answer: 'B。三条路径金额不同，但各自账本可闭合到8倍。', judgment: '同一目标比率不能告诉你调整发生在哪一侧。',
      mechanismExplanation: '补股和减记会同时抬高权益，因此达到目标所需金额小于纯缩表。',
      counterfactualOrFailure: '若债务减记被误写为现金还款，会虚构现金流并错判债权人损失。', sourceIds: [26, 27, 28],
      numericAssertions: [{ key: 'sale', expected: 32, unit: 'SYN-currency' }, { key: 'new-equity', expected: 32 / 7, unit: 'SYN-currency' }, { key: 'write-down', expected: 4, unit: 'SYN-currency' }],
    },
  },
  {
    id: 'M9', mode: 'system', label: 'Distribution and aggregate feedback', synthetic: true,
    title: '平均杠杆接近时，为什么20%的尾部仍可能主导支出收缩？',
    brief: '总量均值会掩盖高债务、薄缓冲与近期到期集中在哪些主体。',
    facts: [
      { label: 'tail', value: '权重20%；D=90；I=15；到期18', note: 'D/I=6；到期/I=1.2' },
      { label: 'majority', value: '权重80%；D=40；I=20；到期3', note: 'D/I=2' },
      { label: 'aggregation', value: '加权平均比率 vs 加权总债/总收入', note: '两个统计量不相同' },
    ],
    formulas: ['average of ratios=Σw_i(D_i/I_i)', 'ratio of sums=Σw_iD_i/Σw_iI_i', 'vulnerable weight=Σw_i I(D/I≥4 or principal/I≥1)'],
    formulaUnits: '杠杆为倍数；尾部权重为0–1比例。',
    options: [
      { id: 'a', label: '平均比率2.8、总量比率约2.632、脆弱权重20%；不能用任一均值消除尾部', diagnosis: '正确；平均的平均与总量比率不同，尾部另行报告。' },
      { id: 'b', label: '两种平均必然都为2.8，因此尾部没有额外信息', diagnosis: '非线性比率的加权平均通常不等于加权总量之比。' },
      { id: 'c', label: '脆弱权重80%，因为大多数组占样本多数', diagnosis: '脆弱门由D/I或到期/I决定，不由组规模单独决定。' },
    ],
    correct: 'a', calculation: 'average=.2×6+.8×2=2.8；ratio of sums=(.2×90+.8×40)/(.2×15+.8×20)=50/19≈2.632；只有tail过门，权重=.2。',
    judgment: '总量看似温和时，边际消费倾向高、缓冲薄或集中到期的少数主体仍可主导短期调整。',
    mechanismExplanation: '冲击先落在约束最紧的主体，他们更快削减消费、投资或资产需求；这些支出是他人的收入，于是个体修复转为总需求反馈。',
    counterfactualOrFailure: '若高杠杆主体有稳定长期现金流、完全固定利率或高流动缓冲，杠杆尾部不必立即成为支出尾部；需要联合分布而非单变量排序。',
    primarySectionId: 'distribution-tail', remediationSectionIds: ['aggregate-demand-feedback', 'rate-reset-service'], sourceIds: [29, 30, 31, 33, 35, 36, 37, 40],
    numericAssertions: [{ key: 'average-of-ratios', expected: 2.8, unit: 'multiple' }, { key: 'ratio-of-sums', expected: 50 / 19, unit: 'multiple' }, { key: 'vulnerable-weight', expected: 0.2, unit: 'ratio' }],
    staticTwin: {
      id: 'K9', synthetic: true, title: '同一均值附近的另一种尾部',
      prompt: 'A组权重25%、D=100、I=20、到期25；B组权重75%、D=30、I=15、到期2。平均比率、总量比率和脆弱权重是多少？',
      choices: three('2.923、2.75、75%', '2.75、2.75、25%', '2.75、约2.923、25%'), correct: 'c',
      calculations: ['平均比率=.25×5+.75×2=2.75。', '总量比率=(25+22.5)/(5+11.25)=47.5/16.25≈2.923；A组过门，所以权重25%。'],
      answer: 'C。两个总括统计量不同，且尾部权重为25%。', judgment: '均值附近的相似不代表脆弱主体相同。',
      mechanismExplanation: '收入权重、债务权重和人口权重不同，聚合方法会改变可见的风险。',
      counterfactualOrFailure: '若组内还有巨大异质性，两组统计仍会掩盖更细尾部，应继续下钻而非把25%当作精确风险概率。', sourceIds: [33, 35, 36, 37],
      numericAssertions: [{ key: 'average-of-ratios', expected: 2.75, unit: 'multiple' }, { key: 'ratio-of-sums', expected: 38 / 13, unit: 'multiple' }, { key: 'vulnerable-weight', expected: 0.25, unit: 'ratio' }],
    },
  },
  {
    id: 'M10', mode: 'system', label: 'Official data boundary', synthetic: false,
    title: 'Fed图3.7的2025-Q4值17.1575，最窄可以说什么？',
    brief: '官方观察值携带部门、定义、频率与vintage；它不校准合成案例，也不自动识别因果。',
    facts: [
      { label: 'series', value: 'Leverage at broker-dealers', note: 'total assets / equity' },
      { label: 'observations', value: '2008-Q1 47.8918；2025-Q4 17.1575', note: 'May 2026出版物Figure 3.7的冻结行' },
      { label: 'scope', value: '美国broker-dealer部门总量', note: '不是家庭、银行、对冲基金或代表性机构' },
    ],
    formulas: ['Fed broker-dealer leverage=total assets/equity'],
    formulaUnits: '资产/权益倍数；季度；May 2026 publication vintage。',
    options: [
      { id: 'a', label: '2025-Q4所有美国借款人的杠杆都是17.1575倍', diagnosis: '部门总量不能外推到所有借款人或个体分布。' },
      { id: 'b', label: '该数证明2025-Q4之后不会发生危机', diagnosis: '描述性杠杆水平不是危机概率或因果安全证书。' },
      { id: 'c', label: 'May 2026出版物显示broker-dealer部门A/E为17.1575倍；仅作规模参照并保留非PIT警告', diagnosis: '正确；没有跨部门外推，也没有因果升级。' },
    ],
    correct: 'c', calculation: '直接读取冻结官方行：2008-Q1=47.89183041899，2025-Q4=17.1574912858505；不从图形像素估读，也不写入SYN案例参数。',
    judgment: '官方数据提高对象真实性，不会自动把描述升级为实时预警、结构目标或因果效应。',
    mechanismExplanation: '定义与部门边界决定数字回答什么；May 2026固定出版物中的历史不能冒充各时点当时可见的连续PIT信息集。',
    counterfactualOrFailure: '换成银行、家庭或hedge fund口径，分子分母与表内外暴露都不同；若要做历史实时检验，还需逐期vintage档案。',
    primarySectionId: 'official-data', remediationSectionIds: ['evidence-boundaries', 'leverage-measure-registry'], sourceIds: [1, 2, 3, 4],
    numericAssertions: [{ key: 'peak-observation', expected: 47.89183041899, unit: 'assets-to-equity-multiple' }, { key: 'latest-observation', expected: 17.1574912858505, unit: 'assets-to-equity-multiple' }, { key: 'evidence-status', expected: 'descriptive-may-2026-publication-vintage', unit: 'status' }],
    staticTwin: {
      id: 'K10', synthetic: false, title: '官方两点之差仍不是因果效应',
      prompt: '同一Fed May 2026出版物中，broker-dealer杠杆由2008-Q1的47.8918降至2025-Q4的17.1575；最窄解释是什么？',
      choices: three('监管单独造成杠杆精确下降64.17%', '所有金融机构的危机概率下降64.17%', '同一出版物口径两点间约下降64.17%，但原因、逐期PIT表现与跨部门外推均未识别'), correct: 'c',
      calculations: ['相对变化=(17.1574912858505/47.89183041899−1)×100≈−64.17%。', '这是两点描述，不是处理效应。'],
      answer: 'C。可报告同序列两点变化，同时停止在描述边界。', judgment: '数值变化的精确不等于因果归属的精确。',
      mechanismExplanation: '监管、商业模式、估值、资产构成和样本定义都可能共同变化；两点比较没有反事实。',
      counterfactualOrFailure: '若要归因于某项规则，需要处理定义、暴露、对照组、共同趋势和同期冲击，而不是把时间差直接当因果效应。', sourceIds: [1, 2, 3, 4],
      numericAssertions: [{ key: 'relative-change', expected: (17.1574912858505 / 47.89183041899 - 1) * 100, unit: 'percent' }, { key: 'causal-status', expected: 'not-identified', unit: 'status' }],
    },
  },
] as const;

const k1Input = {
  assets: 120, debt: 72, otherLiabilities: 18, annualIncome: 24, ebitda: 18, eligibleCash: 6,
  eligibleCashPolicy: 'course-target-date-eligible-cash-v1', eligibleCashTargetDate: '2026-12-31T23:59:59-05:00',
  grossExposure: 180, nav: 20, amountUnit: 'SYN-currency', snapshotTime: '2026-09-14T00:00:00-04:00', incomeWindow: 'trailing-twelve-months',
} as const;
const k1 = leverageRegistryMetrics(k1Input);
const k1WithOmittedOtherLiabilities = leverageRegistryMetrics({ ...k1Input, otherLiabilities: 0 });
const k2 = passiveLeverageShock({ assets: 150, debt: 120, otherLiabilities: 10, assetPriceShockPct: -5, amountUnit: 'SYN-currency', snapshotTime: '2026-09-14T00:00:00-04:00' });
const k3 = targetLeverageProposal({ assets: 100, debt: 80, otherLiabilities: 0, assetPriceShockPct: 10, targetAssetsToEquity: 4, targetRuleStatus: 'synthetic-rule-not-observed-target', amountUnit: 'SYN-currency', snapshotTime: '2026-09-14T00:00:00-04:00' });
const k4 = netDebtEligibility({
  grossDebt: 60, debtLegalEntity: 'SYN-HOLDCO', debtCurrency: 'USD', targetDate: '2026-12-31T23:59:59Z', amountUnit: 'SYN-currency',
  eligibilityPolicy: 'course-target-date-eligible-cash-v1',
  cashCandidates: [
    { id: 'eligible', amount: 8, legalEntity: 'SYN-HOLDCO', currency: 'USD', unrestricted: true, availableAt: '2026-09-14T00:00:00Z' },
    { id: 'restricted', amount: 5, legalEntity: 'SYN-HOLDCO', currency: 'USD', unrestricted: false, availableAt: '2026-09-14T00:00:00Z' },
    { id: 'subsidiary', amount: 10, legalEntity: 'SYN-SUB', currency: 'USD', unrestricted: true, availableAt: '2026-09-14T00:00:00Z' },
    { id: 'eur', amount: 7, legalEntity: 'SYN-HOLDCO', currency: 'EUR', unrestricted: true, availableAt: '2026-09-14T00:00:00Z' },
    { id: 'late', amount: 4, legalEntity: 'SYN-HOLDCO', currency: 'USD', unrestricted: true, availableAt: '2027-01-15T00:00:00Z' },
  ],
});
const k5 = refinancingGapMetrics({
  totalDebt: 70,
  maturityBuckets: [
    { id: 'target', windowStart: '2027-01-01T00:00:00Z', windowEnd: '2028-01-01T00:00:00Z', principalDue: 24 },
    { id: 'later', windowStart: '2028-01-01T00:00:00Z', windowEnd: '2030-01-01T00:00:00Z', principalDue: 46 },
  ],
  targetWindowStart: '2027-01-01T00:00:00Z', targetWindowEnd: '2028-01-01T00:00:00Z', eligibleOpeningCash: 6,
  interestDue: 1, nonOverlappingOperatingCashFlow: 8, committedUndrawnFacility: 10, facilityAvailabilityFactor: 0.5, otherUsesExcludingPrincipalAndInterest: 1, amountUnit: 'SYN-currency',
});
const k7 = debtOverhangMetrics({ existingTerminalAssetValue: 70, oldDebtFaceValue: 80, projectCostPaidByExistingEquity: 8, projectTerminalPayoffIncrement: 12, amountUnit: 'SYN-currency', debtRenegotiable: false, newFinancingSeniority: 'existing-equity-cash-no-new-claim' });
const k8Sale = deleveragingPathMetrics({ assets: 80, debt: 74, otherLiabilities: 0, targetAssetsToEquity: 8, path: 'asset-sale-repay', amountUnit: 'SYN-currency' });
const k8Equity = deleveragingPathMetrics({ assets: 80, debt: 74, otherLiabilities: 0, targetAssetsToEquity: 8, path: 'new-equity-retained-cash', amountUnit: 'SYN-currency' });
const k8WriteDown = deleveragingPathMetrics({ assets: 80, debt: 74, otherLiabilities: 0, targetAssetsToEquity: 8, path: 'debt-write-down', amountUnit: 'SYN-currency' });
const k9 = leverageDistributionMetrics([
  { id: 'tail', populationWeight: 0.25, debt: 100, income: 20, principalDue: 25 },
  { id: 'majority', populationWeight: 0.75, debt: 30, income: 15, principalDue: 2 },
]);

const repricingService = (debt: number, repricingShare: number, oldRate: number, newRate: number, principalDue: number, income: number) => {
  const interest = debt * ((1 - repricingShare) * oldRate + repricingShare * newRate);
  return { interest, serviceRatio: (interest + principalDue) / income };
};
const m6 = repricingService(100, 0.6, 0.03, 0.07, 2, 20);
const k6 = repricingService(120, 0.25, 0.04, 0.08, 3, 30);
const officialPeak = brokerDealerLeverageObservations.find(({ period }) => period === '2008-Q1');
const officialLatest = brokerDealerLeverageObservations.find(({ period }) => period === '2025-Q4');

const computed: Record<string, number | string | null | undefined> = {
  'M1.equity': canonicalLeverageRegistryResult?.equity,
  'M1.debt-to-equity': canonicalLeverageRegistryResult?.debtToEquity,
  'M1.net-debt-to-ebitda': canonicalLeverageRegistryResult?.netDebtToEbitda,
  'M1.gross-exposure-to-nav': canonicalLeverageRegistryResult?.grossExposureToNav,
  'K1.equity': k1?.equity,
  'K1.debt-to-equity': k1?.debtToEquity,
  'K1.net-debt-to-ebitda': k1?.netDebtToEbitda,
  'K1.gross-exposure-to-nav': k1?.grossExposureToNav,
  'K1.omitted-liability-equity': k1WithOmittedOtherLiabilities?.equity,
  'K1.omitted-liability-debt-to-equity': k1WithOmittedOtherLiabilities?.debtToEquity,
  'K1.omission-direction': k1 && k1WithOmittedOtherLiabilities && k1WithOmittedOtherLiabilities.equity > k1.equity && k1WithOmittedOtherLiabilities.debtToEquity < k1.debtToEquity ? 'equity-overstated-leverage-understated' : 'direction-failed',
  'M2.after-assets': canonicalPassiveLeverageResult?.after.assets,
  'M2.after-equity': canonicalPassiveLeverageResult?.after.equity,
  'M2.assets-to-equity': canonicalPassiveLeverageResult?.after.assetsToEquity,
  'M2.equity-loss': canonicalPassiveLeverageResult?.equityLossPct,
  'K2.after-equity': k2?.after.equity,
  'K2.assets-to-equity': k2?.after.assetsToEquity,
  'K2.equity-loss': k2?.equityLossPct,
  'M3.required-sale': canonicalTargetLeverageResult ? Math.abs(canonicalTargetLeverageResult.proposedAssetTrade) : null,
  'M3.end-assets': canonicalTargetLeverageResult?.proposedEnd.assets,
  'M3.end-debt': canonicalTargetLeverageResult?.proposedEnd.debt,
  'M3.actual-status': canonicalTargetLeverageResult?.actualAdjustment === null ? 'not-observed' : 'observed',
  'K3.proposed-purchase': k3?.proposedAssetTrade,
  'K3.end-assets': k3?.proposedEnd.assets,
  'K3.end-debt': k3?.proposedEnd.debt,
  'K3.actual-status': k3?.actualAdjustment === null ? 'not-observed' : 'observed',
  'M4.eligible-cash': canonicalNetDebtResult?.eligibleCash,
  'M4.net-debt': canonicalNetDebtResult?.netDebt,
  'M4.eligible-count': canonicalNetDebtResult?.decisions.filter(({ eligible }) => eligible).length,
  'K4.eligible-cash': k4?.eligibleCash,
  'K4.net-debt': k4?.netDebt,
  'M5.principal-due': canonicalRefinancingGapResult?.principalDue,
  'M5.interest-due': canonicalRefinancingGapResult?.interestDue,
  'M5.uses': canonicalRefinancingGapResult?.totalUses,
  'M5.available-facility': canonicalRefinancingGapResult?.availableCommittedFunding,
  'M5.reliable-sources': canonicalRefinancingGapResult?.totalReliableSources,
  'M5.gap': canonicalRefinancingGapResult?.refinancingGap,
  'M5.surplus': canonicalRefinancingGapResult?.surplus,
  'M5.wrong-full-facility-sources': m5FullFacilityWrongPath.totalReliableSources,
  'M5.wrong-full-facility-gap': m5FullFacilityWrongPath.refinancingGap,
  'M5.wrong-exclude-cash-ocf-sources': m5ExcludeCashAndOcfWrongPath.totalReliableSources,
  'M5.wrong-exclude-cash-ocf-gap': m5ExcludeCashAndOcfWrongPath.refinancingGap,
  'K5.interest-due': k5?.interestDue,
  'K5.other-uses': k5?.otherUsesExcludingPrincipalAndInterest,
  'K5.uses': k5?.totalUses,
  'K5.reliable-sources': k5?.totalReliableSources,
  'K5.gap': k5?.refinancingGap,
  'K5.surplus': k5?.surplus,
  'M6.interest': m6.interest,
  'M6.service-ratio': m6.serviceRatio,
  'M6.repricing-status': 'distinct-from-maturity',
  'K6.interest': k6.interest,
  'K6.service-ratio': k6.serviceRatio,
  'M7.total-npv': canonicalDebtOverhangResult?.totalNpv,
  'M7.creditor-gain': canonicalDebtOverhangResult?.creditorGain,
  'M7.equity-npv': canonicalDebtOverhangResult?.equityNpv,
  'K7.total-npv': k7?.totalNpv,
  'K7.creditor-gain': k7?.creditorGain,
  'K7.equity-npv': k7?.equityNpv,
  'M8.sale': canonicalDeleveragingResults[0]?.amount,
  'M8.new-equity': canonicalDeleveragingResults[1]?.amount,
  'M8.write-down': canonicalDeleveragingResults[2]?.amount,
  'M8.retained-earnings': canonicalDeleveragingResults[3]?.amount,
  'M8.all-reach-target': canonicalDeleveragingResults.every((result) => result?.reachesTarget) ? 'yes' : 'no',
  'K8.sale': k8Sale?.amount,
  'K8.new-equity': k8Equity?.amount,
  'K8.write-down': k8WriteDown?.amount,
  'M9.average-of-ratios': canonicalDistributionResult?.averageOfRatios,
  'M9.ratio-of-sums': canonicalDistributionResult?.ratioOfSums,
  'M9.vulnerable-weight': canonicalDistributionResult?.vulnerableWeight,
  'K9.average-of-ratios': k9?.averageOfRatios,
  'K9.ratio-of-sums': k9?.ratioOfSums,
  'K9.vulnerable-weight': k9?.vulnerableWeight,
  'M10.peak-observation': officialPeak?.leverage,
  'M10.latest-observation': officialLatest?.leverage,
  'M10.evidence-status': 'descriptive-may-2026-publication-vintage',
  'K10.relative-change': officialPeak && officialLatest ? (officialLatest.leverage / officialPeak.leverage - 1) * 100 : null,
  'K10.causal-status': 'not-identified',
};

const approximately = (actual: number, expected: number, tolerance = 1e-8) => Math.abs(actual - expected) <= tolerance;
const countAnswerPositions = (answers: readonly DebtLeverageChoice[]) => answers.reduce<Record<DebtLeverageChoice, number>>((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 });
const balancedThreeThreeFour = (counts: Record<DebtLeverageChoice, number>) => Object.values(counts).sort((left, right) => left - right).join(',') === '3,3,4';
const allowedSectionIds = new Set([
  'leverage-measure-registry', 'passive-leverage', 'target-leverage', 'gross-net-debt', 'maturity-refinancing', 'rate-reset-service',
  'debt-overhang', 'deleveraging-paths', 'aggregate-demand-feedback', 'distribution-tail', 'evidence-boundaries', 'official-data',
]);
const requiredSectionIds = [...allowedSectionIds];

const verifyNumericAssertion = (scenarioId: string, assertion: DebtLeverageNumericAssertion) => {
  const actual = computed[`${scenarioId}.${assertion.key}`];
  const passed = typeof assertion.expected === 'number'
    ? typeof actual === 'number' && approximately(actual, assertion.expected, assertion.tolerance)
    : actual === assertion.expected;
  return { scenarioId, ...assertion, actual, passed };
};

export const debtLeverageNumericAssertionAudit = debtLeverageScenarios.flatMap((scenario) => [
  ...scenario.numericAssertions.map((assertion) => verifyNumericAssertion(scenario.id, assertion)),
  ...scenario.staticTwin.numericAssertions.map((assertion) => verifyNumericAssertion(scenario.staticTwin.id, assertion)),
]);

const mainAnswerCounts = countAnswerPositions(debtLeverageScenarios.map(({ correct }) => correct));
const twinAnswerCounts = countAnswerPositions(debtLeverageScenarios.map(({ staticTwin }) => staticTwin.correct));
const usedSectionIds = new Set(debtLeverageScenarios.flatMap(({ primarySectionId, remediationSectionIds }) => [primarySectionId, ...remediationSectionIds]));
const allSourceIds = debtLeverageScenarios.flatMap(({ sourceIds, staticTwin }) => [...sourceIds, ...staticTwin.sourceIds]);
const injectedNumericMismatchDetected = !verifyNumericAssertion('M1', { key: 'equity', expected: 11, unit: 'SYN-currency' }).passed;
const missingNumericKeyDetected = !verifyNumericAssertion('M1', { key: 'missing-key', expected: 0, unit: 'SYN-currency' }).passed;

export const debtLeverageScenarioAssertions = [
  { key: 'exactly-ten-scenarios', passed: debtLeverageScenarios.length === 10 },
  { key: 'exactly-two-distinct-modes', passed: debtLeverageModes.length === 2 && new Set(debtLeverageModes.map(({ id }) => id)).size === 2 },
  { key: 'five-scenarios-per-mode', passed: debtLeverageModes.every((mode) => debtLeverageScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { key: 'M1-through-M10-ordered-and-unique', passed: debtLeverageScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) && new Set(debtLeverageScenarios.map(({ id }) => id)).size === 10 },
  { key: 'K1-through-K10-ordered-and-unique', passed: debtLeverageScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) && new Set(debtLeverageScenarios.map(({ staticTwin }) => staticTwin.id)).size === 10 },
  { key: 'every-M-and-K-has-exactly-a-b-c', passed: debtLeverageScenarios.every(({ options, staticTwin }) => options.map(({ id }) => id).join('') === 'abc' && staticTwin.choices.map(({ id }) => id).join('') === 'abc') },
  { key: 'every-question-has-unique-nonempty-option-labels', passed: debtLeverageScenarios.every(({ options, staticTwin }) => [options, staticTwin.choices].every((choices) => choices.every(({ label }) => label.trim().length > 0) && new Set(choices.map(({ label }) => label.trim())).size === 3)) },
  { key: 'every-declared-correct-choice-exists', passed: debtLeverageScenarios.every(({ options, correct, staticTwin }) => options.some(({ id }) => id === correct) && staticTwin.choices.some(({ id }) => id === staticTwin.correct)) },
  { key: 'main-and-twin-answer-positions-balanced-3-3-4', passed: balancedThreeThreeFour(mainAnswerCounts) && balancedThreeThreeFour(twinAnswerCounts) },
  { key: 'every-scenario-has-complete-learning-loop', passed: debtLeverageScenarios.every(({ title, brief, facts, formulas, formulaUnits, calculation, judgment, mechanismExplanation, counterfactualOrFailure, sourceIds, numericAssertions, staticTwin }) => Boolean(title && brief && facts.length && facts.every(({ label, value, note }) => label && value && note) && formulas.length && formulaUnits && calculation && judgment && mechanismExplanation && counterfactualOrFailure && sourceIds.length && numericAssertions.length && staticTwin.title && staticTwin.prompt && staticTwin.calculations.length && staticTwin.answer && staticTwin.judgment && staticTwin.mechanismExplanation && staticTwin.counterfactualOrFailure && staticTwin.sourceIds.length && staticTwin.numericAssertions.length)) },
  { key: 'all-section-links-are-allowed-and-required-sections-covered', passed: debtLeverageScenarios.every(({ primarySectionId, remediationSectionIds }) => allowedSectionIds.has(primarySectionId) && remediationSectionIds.length > 0 && new Set(remediationSectionIds).size === remediationSectionIds.length && remediationSectionIds.every((id) => id !== primarySectionId && allowedSectionIds.has(id))) && requiredSectionIds.every((id) => usedSectionIds.has(id)) },
  { key: 'all-source-ids-are-unique-per-item-and-within-1-to-46', passed: debtLeverageScenarios.every(({ sourceIds, staticTwin }) => new Set(sourceIds).size === sourceIds.length && new Set(staticTwin.sourceIds).size === staticTwin.sourceIds.length) && allSourceIds.every((id) => Number.isInteger(id) && id >= 1 && id <= 46) },
  { key: 'only-official-data-pair-is-non-synthetic', passed: debtLeverageScenarios.every(({ id, synthetic, staticTwin }) => synthetic === (id !== 'M10') && staticTwin.synthetic === (staticTwin.id !== 'K10')) },
  { key: 'numeric-assertion-keys-are-unique-per-item', passed: debtLeverageScenarios.every(({ numericAssertions, staticTwin }) => new Set(numericAssertions.map(({ key }) => key)).size === numericAssertions.length && new Set(staticTwin.numericAssertions.map(({ key }) => key)).size === staticTwin.numericAssertions.length) },
  { key: 'all-numeric-and-status-assertions-recompute', passed: debtLeverageNumericAssertionAudit.length > 0 && debtLeverageNumericAssertionAudit.every(({ passed }) => passed) },
  { key: 'numeric-audit-detects-injected-mismatch-and-missing-key', passed: injectedNumericMismatchDetected && missingNumericKeyDetected },
  { key: 'K1-omission-direction-and-prose-agree', passed: computed['K1.omission-direction'] === 'equity-overstated-leverage-understated' && debtLeverageScenarios[0].staticTwin.counterfactualOrFailure.includes('权益会被高估') && debtLeverageScenarios[0].staticTwin.counterfactualOrFailure.includes('杠杆都会被低估') },
  { key: 'M5-distractor-labels-and-diagnoses-bind-computed-error-paths', passed: debtLeverageScenarios[4].options[0].label.startsWith(`缺口${m5FullFacilityWrongPath.refinancingGap}，`) && debtLeverageScenarios[4].options[0].diagnosis.includes(`误计可靠来源${m5FullFacilityWrongPath.totalReliableSources}、误算缺口${m5FullFacilityWrongPath.refinancingGap}`) && debtLeverageScenarios[4].options[1].label.startsWith(`缺口${m5ExcludeCashAndOcfWrongPath.refinancingGap}，`) && debtLeverageScenarios[4].options[1].diagnosis.includes(`误计可靠来源${m5ExcludeCashAndOcfWrongPath.totalReliableSources}、误算缺口${m5ExcludeCashAndOcfWrongPath.refinancingGap}`) },
] as const;

if (!debtLeverageScenarioAssertions.every(({ passed }) => passed)) {
  throw new Error(`3.15 debt/leverage scenario gate failed: ${debtLeverageScenarioAssertions.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}
