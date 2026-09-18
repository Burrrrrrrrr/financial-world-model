import {
  canonicalMarginProxyBasis,
  canonicalRiskyCandidate,
  canonicalSafeCandidate,
  cohortRiskMetrics,
  marginPressureMetrics,
  riskAdjustedSelectionMetrics,
  riskBudgetExposureMetrics,
  riskTakingIdentificationStatus,
  riskTransferMetrics,
  searchForYieldMix,
  identifiedCandidateGate,
} from './riskTakingFixtures';

export type RiskTakingChoice = 'a' | 'b' | 'c';
export type RiskTakingMode = 'choice-and-pricing' | 'measurement-and-identification';

export type RiskTakingAssertion = { key: string; expected: number | string | boolean; unit: string; tolerance?: number };

export type RiskTakingScenario = {
  id: `M${number}`;
  mode: RiskTakingMode;
  label: string;
  title: string;
  brief: string;
  synthetic: boolean;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: RiskTakingChoice; label: string; diagnosis: string }[];
  correct: RiskTakingChoice;
  calculation: string;
  judgment: string;
  causalExplanation: string;
  counterfactualOrFailure: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: RiskTakingAssertion[];
  staticTwin: {
    id: `K${number}`;
    title: string;
    prompt: string;
    choices: { id: RiskTakingChoice; label: string }[];
    correct: RiskTakingChoice;
    calculations: string[];
    answer: string;
    judgment: string;
    causalExplanation: string;
    counterfactualOrFailure: string;
    sourceIds: number[];
    numericAssertions: RiskTakingAssertion[];
  };
};

export const riskTakingModes: { id: RiskTakingMode; label: string; title: string; description: string }[] = [
  { id: 'choice-and-pricing', label: '选择定价', title: '门槛、逐利、息差与事前选择', description: '冻结风险容量、银行资金与借款人状态，只移动中介的筛选、定价和组合规则。' },
  { id: 'measurement-and-identification', label: '测量识别', title: '波动覆盖、风险转移与识别闸门', description: '分开测量风险、最终持有人、调查时钟与有条件因果身份。' },
];

const three = (a: string, b: string, c: string) => [
  { id: 'a' as const, label: a }, { id: 'b' as const, label: b }, { id: 'c' as const, label: c },
];

export const riskTakingScenarios: RiskTakingScenario[] = [
  {
    id: 'M1', mode: 'choice-and-pricing', label: 'Risk-adjusted threshold', synthetic: true,
    title: '同一高风险项目的尾部风险影子价从0.2升至0.4，是否仍通过0.5个百分点的选择门槛？',
    brief: '项目现金流、PD/LGD、资金成本、资本流动性费用和银行容量全部冻结，只改变中介给意外损失的内部价格。',
    facts: [{ label: '毛收益', value: '8.4%/年', note: 'SYN promised yield。' }, { label: '资金成本', value: '3.4%/年', note: '与3.10边际资金成本口径一致。' }, { label: '预期损失', value: '12m PD 5% × LGD 50%', note: '12个月损失率为2.5个百分点；100 SYN EAD对应2.5 SYN。' }, { label: '共同基础', value: '12m合同 · 100 SYN EAD · SYN币种', note: '收益、PD预测期、LGD和敞口基础对齐。' }, { label: '尾部代理', value: '4 × shadow price', note: '决策账本SYN权重从0.2升至0.4，不是已观察的aggregate appetite。' }],
    formulas: ['risk-adjusted contribution = yield − funding − operating − EL − capital/liquidity charge − tail charge'], formulaUnits: '全部收益与费用为年化百分点；本题是教学算例，不是银行估计。',
    options: [
      { id: 'a', label: '仍接受，因为8.4%的毛收益没有变化。', diagnosis: '毛收益不是风险调整后的贡献；你漏掉了预期与尾部风险价格。' },
      { id: 'b', label: '由+0.7降至−0.1，项目由接受变为拒绝。', diagnosis: '正确：同一风险数量被赋予更高内部价格，选择门槛内生收紧。' },
      { id: 'c', label: '必然是银行资金容量下降。', diagnosis: '题目明确冻结容量与资金；变化来自风险偏好的影子价。' },
    ], correct: 'b', calculation: 'EL=5%×50%=2.5pp；风险前边际=8.4−3.4−0.5−2.5−0.5=1.5pp；尾部费用0.8→1.6pp，所以贡献0.7→−0.1pp。',
    judgment: '门槛收紧，拒绝。', causalExplanation: '政策环境只有在改变中介对尾部风险的内部估值后，才通过筛选规则改变项目选择。', counterfactualOrFailure: '若资金成本、资本容量、借款人PD/LGD也变化，则这是联合渠道，不能称为纯风险承担机制。',
    primarySectionId: 'risk-hurdle', remediationSectionIds: ['portfolio-substitution', 'pure-channel-counterfactual'], sourceIds: [1, 3, 4], numericAssertions: [{ key: 'loose', expected: 0.7, unit: 'pp/year' }, { key: 'tight', expected: -0.1, unit: 'pp/year' }],
    staticTwin: { id: 'K1', title: '高票息仍可被拒绝', prompt: '其他输入同上，影子价0.3时贡献和判断？', choices: three('0.3pp，接受', '1.2pp，接受', '0.3pp，拒绝'), correct: 'c', calculations: ['尾部费用=4×0.3=1.2pp。', '风险调整贡献=1.5−1.2=0.3pp。', '低于0.5pp门槛，因此拒绝。'], answer: 'C。判断由风险调整贡献相对门槛决定。', judgment: '拒绝。', causalExplanation: '同一项目在更高尾部风险价格下不再覆盖目标回报。', counterfactualOrFailure: '若目标门槛同步降至0.3pp，结论会改变。', sourceIds: [1, 3], numericAssertions: [{ key: 'contribution', expected: 0.3, unit: 'pp/year' }] },
  },
  {
    id: 'M2', mode: 'choice-and-pricing', label: 'Search for yield', synthetic: true,
    title: '名义目标收益5%不变，安全资产收益从4%降至1%，风险资产仍为7%；风险资产份额如何变？',
    brief: '总资产、杠杆、风险预算和两类资产的损失分布冻结；这里只展示名义收益目标如何改变组合权重。',
    facts: [{ label: '安全收益', value: '4%→1%', note: '唯一变化。' }, { label: '风险收益', value: '7%', note: 'promised yield，不是期望回报。' }, { label: '目标', value: '5%', note: '内部名义目标固定。' }],
    formulas: ['risky share = (target − safe yield) / (risky yield − safe yield)'], formulaUnits: '份额为0–1；收益为年化百分点。',
    options: [{ id: 'a', label: '保持1/3，因为目标收益未变。', diagnosis: '安全资产对目标的贡献下降，组合必须调整才能维持目标。' }, { id: 'b', label: '必然加杠杆到133%。', diagnosis: '当前目标在无杠杆组合内仍可达；不能跳到杠杆结论。' }, { id: 'c', label: '1/3→2/3；这是逐利压力的机械候选，不是已识别事实。', diagnosis: '正确：安全收益下降扩大达到名义目标所需的风险资产份额。' }], correct: 'c',
    calculation: '初始w=(5−4)/(7−4)=1/3；之后w=(5−1)/(7−1)=2/3。', judgment: '风险权重上升。', causalExplanation: '安全收益压低而名义目标黏住时，中介通过组合向高票息资产倾斜。', counterfactualOrFailure: '若目标收益同步下降、风险预算绑定或风险资产预期损失上升，风险权重不必增加。',
    primarySectionId: 'safe-yield-target-gap', remediationSectionIds: ['portfolio-substitution', 'risk-hurdle'], sourceIds: [2, 11, 17], numericAssertions: [{ key: 'before-share', expected: 0.333333333333, unit: 'ratio', tolerance: 1e-9 }, { key: 'after-share', expected: 0.666666666667, unit: 'ratio', tolerance: 1e-9 }],
    staticTwin: { id: 'K2', title: '目标不可达时必须停止', prompt: '安全1%、风险4%、目标5%，无杠杆可行吗？', choices: three('不可行；原始风险份额4/3', '可行；风险份额100%', '可行；风险份额75%'), correct: 'a', calculations: ['w=(5−1)/(4−1)=4/3。', 'w>1，超出无杠杆可行域。', '显示值可截到100%，但缺口不能隐藏。'], answer: 'A。需要杠杆、衍生品或放弃目标，题目本身不能替你选。', judgment: 'STOP。', causalExplanation: '名义收益目标超出资产菜单凸组合的上界。', counterfactualOrFailure: '若允许杠杆且融资、容量与尾部风险被显式建模，才可继续。', sourceIds: [2, 11], numericAssertions: [{ key: 'raw-share', expected: 1.333333333333, unit: 'ratio', tolerance: 1e-9 }] },
  },
  {
    id: 'M3', mode: 'measurement-and-identification', label: 'Measured volatility + stress overlay', synthetic: true,
    title: '测量波动从8%降至4%，10 SYN损失预算、2.5倍乘数和25%压力损失率不变；稳健敞口上限会翻倍吗？',
    brief: '把真实风险分布与测量模型分开；压力覆盖层用于阻止低波动观测机械释放全部风险预算。',
    facts: [{ label: '模型波动', value: '8%→4%', note: '测量输入，不宣称真实风险下降。' }, { label: '压力损失率', value: '25%', note: '固定overlay。' }, { label: '损失预算', value: '10 SYN', note: '风险容量冻结。' }], formulas: ['model cap = budget /(multiplier × measured volatility)', 'robust cap = min(model cap, stress cap)'], formulaUnits: '敞口为SYN；波动与压力损失率转为比例。',
    options: [{ id: 'a', label: '模型上限50→100，但稳健上限仍为40。', diagnosis: '正确：压力上限10/25%=40在两种状态都绑定。' }, { id: 'b', label: '稳健上限50→100，确定风险偏好上升。', diagnosis: '你漏掉了压力覆盖层，并把测量变化改名为偏好变化。' }, { id: 'c', label: '敞口必须降到0。', diagnosis: '压力覆盖并不等于禁止风险，只是给低波动状态设另一约束。' }], correct: 'a', calculation: '模型上限：10/(2.5×8%)=50，10/(2.5×4%)=100；压力上限=10/25%=40；两期robust cap=min(model,40)=40。', judgment: '稳健容量不变。', causalExplanation: '低测量波动只放松模型约束；压力覆盖仍绑定，因此没有组合扩张。', counterfactualOrFailure: '若压力覆盖被取消或压力损失率降到低于模型损失率，稳健上限才可能上升。',
    primarySectionId: 'valuation-measured-risk', remediationSectionIds: ['risk-taxonomy', 'measurement-passport'], sourceIds: [1, 23, 24], numericAssertions: [{ key: 'model-before', expected: 50, unit: 'SYN' }, { key: 'model-after', expected: 100, unit: 'SYN' }, { key: 'robust-after', expected: 40, unit: 'SYN' }],
    staticTwin: { id: 'K3', title: '模型约束重新绑定', prompt: '预算10、乘数2、测量波动15%、压力损失率20%，稳健上限？', choices: three('50，压力约束绑定', '33.33，模型约束绑定', '75，两者相加'), correct: 'b', calculations: ['模型损失率=2×15%=30%。', '模型上限=33.33；压力上限=50。', '取较小者33.33。'], answer: 'B。约束取最小而不是相加。', judgment: '模型约束绑定。', causalExplanation: '当前测量风险比压力层更严。', counterfactualOrFailure: '若测量波动低于10%，压力层会绑定。', sourceIds: [23, 24], numericAssertions: [{ key: 'robust-cap', expected: 33.3333333333, unit: 'SYN', tolerance: 1e-6 }] },
  },
  {
    id: 'M4', mode: 'choice-and-pricing', label: 'Synthetic margin-proxy sign ambiguity', synthetic: true,
    title: '政策利率下调3个百分点时，存款成本贡献下限和两种行为敏感度为何能让净风险选择压力出现相反符号？',
    brief: '资产收益传导0.8、存款成本贡献传导0.5；所有收益与成本均是占平均生息资产的年化百分点，只构成SYNTHETIC margin proxy，不是监管报表NIM。',
    facts: [{ label: '初始收益/存款成本/其他资金成本贡献', value: '6% / 2% / 0.5%', note: '共同平均生息资产分母上的合成息差代理为3.5pp。' }, { label: '无下限敏感度', value: 'risk shift 0.8；retrench 0.4', note: '压缩后逐利占优。' }, { label: '有下限敏感度', value: 'risk shift 0.4；retrench 0.8', note: '压缩后收缩占优。' }], formulas: ['illustrative net risk-choice pressure = compression × risk-shift sensitivity − compression × retrenchment sensitivity'], formulaUnits: '息差代理的输入是同一平均生息资产分母上的年化百分点贡献；净压力是无单位教学指数，不是估计弹性，也不把容量收缩解释为偏好下降。',
    options: [{ id: 'a', label: '息差代理越低必然承担更少风险。', diagnosis: '你忽略了目标收益和风险转移激励。' }, { id: 'b', label: '息差代理越低必然承担更多风险。', diagnosis: '你忽略了资本保全、治理与风险预算收缩。' }, { id: 'c', label: '无下限+0.36、有下限−0.76；符号取决于行为与容量边界。', diagnosis: '正确：息差代理压缩可以诱发赌一把，也可触发保守收缩。' }], correct: 'c', calculation: '无下限合成margin proxy 3.5→2.6，压缩0.9，净压力=0.9×(0.8−0.4)=+0.36；有下限合成margin proxy 3.5→1.6，压缩1.9，净压力=1.9×(0.4−0.8)=−0.76。', judgment: '理论符号不确定。', causalExplanation: '同一合成息差代理冲击同时触发逐利和保全容量两股相反力量，谁占优取决于状态与治理。', counterfactualOrFailure: '若银行资金或资本容量没有冻结/建模，不能把任何符号单独归给风险偏好。',
    primarySectionId: 'margin-franchise-value', remediationSectionIds: ['negative-rate-nonlinearity', 'sign-reversal'], sourceIds: [3, 12, 14], numericAssertions: [{ key: 'no-floor', expected: 0.36, unit: 'index' }, { key: 'with-floor', expected: -0.76, unit: 'index' }],
    staticTwin: { id: 'K4', title: '同样压缩可得到零净压力', prompt: '合成息差代理压缩1pp，逐利和收缩敏感度都为0.6，净风险选择压力？', choices: three('+1.2', '−1.2', '0'), correct: 'c', calculations: ['逐利压力=1×0.6。', '收缩压力=1×0.6。', '净风险选择压力=0。'], answer: 'C。净压力为零不等于两种机制不存在。', judgment: '净方向为零。', causalExplanation: '两股相反行为压力恰好抵消；其中容量收缩仍是约束作用，不是偏好下降。', counterfactualOrFailure: '改变任一敏感度即可改变符号。', sourceIds: [3, 14], numericAssertions: [{ key: 'net', expected: 0, unit: 'index' }] },
  },
  {
    id: 'M5', mode: 'choice-and-pricing', label: 'Ex ante / ex post paradox', synthetic: true,
    title: '新发放组合的高风险份额20%→40%，但支持性状态使两组的固定表现窗实现违约率下降；组合实现违约率能否下降？',
    brief: '发放时可用PD等预测量划分事前风险等级；本题的1%、8%、0.5%和4%则是之后在同一固定表现窗内观察到的组内实现违约率。',
    facts: [{ label: '之前', value: '高风险份额20%；安全组实现率1%；风险组实现率8%', note: '固定表现窗组合实现违约率2.4%。' }, { label: '之后', value: '高风险份额40%；安全组实现率0.5%；风险组实现率4%', note: '同一表现窗口径下组合实现违约率1.9%。' }, { label: '分母约定', value: '同一发放批次、等EAD加权', note: '比例算例不把率换写成离散违约笔数。' }], formulas: ['cohort realised default rate = (1−risky share)×safe-group realised default rate + risky share×risky-group realised default rate'], formulaUnits: '固定表现窗的组内实现违约率和组合实现违约率为百分点；份额为等EAD加权比例。',
    options: [{ id: 'a', label: '不可以：高风险份额上升必然提高固定表现窗的组合实现违约率。', diagnosis: '你把构成效应和各组的表现窗实现违约率变化混成一项。' }, { id: 'b', label: '可以：事前选择更冒险，事后固定表现窗的组合实现违约率却2.4%→1.9%。', diagnosis: '正确：支持性宏观状态可压低两组实现风险，不能用事后实现违约率反推选择标准。' }, { id: 'c', label: '实现违约率下降证明政策降低了银行风险偏好。', diagnosis: '事后结果不识别事前选择规则，更不自动识别政策冲击。' }], correct: 'b', calculation: '之前固定表现窗组合实现违约率=0.8×1%+0.2×8%=2.4%；之后=0.6×0.5%+0.4×4%=1.9%。', judgment: '悖论可以成立。', causalExplanation: '中介选择的事前风险构成上升，但共同状态改善使各组固定表现窗的实现违约率下降得更多。', counterfactualOrFailure: '若比较同一事前评分桶、同一固定表现窗，且各组实现违约率冻结，高风险份额上升才会机械提高组合实现违约率。',
    primarySectionId: 'ex-ante-versus-ex-post', remediationSectionIds: ['origination-vintage', 'extensive-intensive-margin'], sourceIds: [5, 6, 16], numericAssertions: [{ key: 'before-default', expected: 2.4, unit: 'percent' }, { key: 'after-default', expected: 1.9, unit: 'percent' }],
    staticTwin: { id: 'K5', title: '冻结固定表现窗组内实现违约率后的构成效应', prompt: '安全组实现违约率1%、风险组实现违约率8%都冻结，高风险份额20%→40%，组合实现违约率？', choices: three('2.4%→3.8%', '2.4%→1.9%', '保持2.4%'), correct: 'a', calculations: ['初始=0.8×1%+0.2×8%=2.4%。', '之后=0.6×1%+0.4×8%=3.8%。'], answer: 'A。冻结同一表现窗的组内实现违约率时，只剩构成效应。', judgment: '组合实现违约率上升。', causalExplanation: '更多权重移向固定表现窗实现违约率更高的组。', counterfactualOrFailure: '各组实现违约率若同时变化，不能只归因于构成。', sourceIds: [5, 6], numericAssertions: [{ key: 'after-default', expected: 3.8, unit: 'percent' }] },
  },
  {
    id: 'M6', mode: 'measurement-and-identification', label: 'Risk-transfer conservation', synthetic: true,
    title: '银行发起100、保留20、出售80，并为保留部分买10保护；风险是否从系统消失？',
    brief: '区分发起量、银行未对冲敞口与全系统最终持有人；对手方风险另列，不得把对冲写成销毁。',
    facts: [{ label: '发起', value: '100 SYN', note: '信用敞口总量。' }, { label: '保留/出售', value: '20 / 80', note: '严格守恒。' }, { label: '保护', value: '10', note: '保护卖方接住。' }], formulas: ['system holder exposure = bank unhedged + loan buyer + protection seller'], formulaUnits: '名义敞口为SYN；不含违约相关性和对手方净额结算。',
    options: [{ id: 'a', label: '银行未对冲10，但最终持有人仍合计100。', diagnosis: '正确：银行账面风险下降，风险被转移给贷款买家与保护卖方。' }, { id: 'b', label: '系统只剩10，因为银行只保留未对冲部分。', diagnosis: '你漏掉了资产买家和保护卖方。' }, { id: 'c', label: '系统变成110，因为保护与贷款重复相加。', diagnosis: '保护把保留风险从银行转给卖方，不是额外创造原始信用敞口。' }], correct: 'a', calculation: '银行未对冲=20−10=10；贷款买家=80；保护卖方=10；最终持有人=100，守恒缺口0。', judgment: '银行风险下降，系统原始信用风险未消失。', causalExplanation: '出售和保护改变最终承担者与激励，因此可改变发起筛选，但不自动消灭基础风险。', counterfactualOrFailure: '若保护卖方违约、存在基差或重复再证券化，需要新增对手方与网络状态。',
    primarySectionId: 'securitization-risk-transfer', remediationSectionIds: ['loss-capital-feedback', 'cross-border-spillovers'], sourceIds: [8, 15, 17, 27], numericAssertions: [{ key: 'bank-unhedged', expected: 10, unit: 'SYN' }, { key: 'system-total', expected: 100, unit: 'SYN' }],
    staticTwin: { id: 'K6', title: '出售不是消失', prompt: '发起60、保留15、出售45、未买保护；银行与系统敞口？', choices: three('15与15', '15与60', '60与60'), correct: 'b', calculations: ['银行未对冲=15。', '买家持有=45。', '系统合计=60。'], answer: 'B。资产负债表边界决定你看到的是谁的风险。', judgment: '转移而非消失。', causalExplanation: '风险从银行移到买家。', counterfactualOrFailure: '若只研究银行边界，可以报告15，但必须明确不是系统总量。', sourceIds: [8, 17], numericAssertions: [{ key: 'bank', expected: 15, unit: 'SYN' }, { key: 'system', expected: 60, unit: 'SYN' }] },
  },
  {
    id: 'M7', mode: 'measurement-and-identification', label: 'Identification gate', synthetic: true,
    title: '十一个闸门只缺“同一借款人/申请需求控制”，最强标签是什么？',
    brief: '可计算、机制一致和已识别候选是不同层级；失败一门不由高拟合度补回。',
    facts: [{ label: '通过', value: '10/11', note: '处理时序、冲击外生性、暴露、时钟、容量、借款人风险、支持与推断等其他十门均通过。' }, { label: '失败', value: '需求控制', note: '申请构成可能内生变化。' }], formulas: ['identified-candidate requires every declared gate'], formulaUnits: '标签是证据状态，不是概率。',
    options: [{ id: 'a', label: 'identified，因为已有10/11门通过。', diagnosis: '识别门不是可平均分数；关键反事实缺失不能被其他项抵消。' }, { id: 'b', label: 'mechanism-consistent；仍不能贴identified-candidate。', diagnosis: '正确：同一借款人/申请需求未控制，选择变化可能来自需求构成。' }, { id: 'c', label: '必然错误，连描述都不能做。', diagnosis: '错误：闸门失败并不等于所有描述证据无效；请回到证据层级判断可保留的最强身份。' }], correct: 'b', calculation: 'passed=10/11；failed={sameBorrowerOrApplicationDemandControl}；status=mechanism-consistent。', judgment: '降级到机制一致。', causalExplanation: '没有需求反事实，观察到的风险构成变化可能是申请池变化，不是中介选择规则变化。', counterfactualOrFailure: '在同申请、多银行报价或预定银行暴露设计中闭合需求门后，才可升级为identified-candidate。',
    primarySectionId: 'identification-falsification', remediationSectionIds: ['extensive-intensive-margin', 'actor-scope-clocks'], sourceIds: [4, 5, 7, 8], numericAssertions: [{ key: 'passed', expected: 10, unit: 'gates' }, { key: 'status', expected: 'mechanism-consistent', unit: 'status' }],
    staticTwin: { id: 'K7', title: '全门通过仍是局部候选', prompt: '十一门全部通过后，最强表述？', choices: three('全球结构常数', '政策必然提高风险', '在声明样本和假设内的identified-candidate'), correct: 'c', calculations: ['11/11通过。', '状态=identified-candidate。', '外推仍受时期、机构与共同支持限制。'], answer: 'C。闸门只授予声明设计内的局部身份。', judgment: '局部识别候选。', causalExplanation: '设计排除了已声明的主要替代解释。', counterfactualOrFailure: '外部有效性不由内部识别自动获得。', sourceIds: [4, 5, 7, 8], numericAssertions: [{ key: 'status', expected: 'identified-candidate', unit: 'status' }] },
  },
  {
    id: 'M8', mode: 'choice-and-pricing', label: 'Promised yield trap', synthetic: true,
    title: '高风险项目票息8.4%、安全项目5.4%；能否仅凭票息断言高风险项目的风险调整贡献更高？',
    brief: '两项目都使用同一边际资金成本3.4%和同一尾部风险影子价0.4，仍需分别扣除预期损失、资本流动性费用和尾部费用。',
    facts: [{ label: '安全项目', value: '5.4%票息；12m EL 0.3pp', note: '共同影子价0.4时，完整算例贡献+0.5pp。' }, { label: '高风险项目', value: '8.4%票息；12m EL 2.5pp', note: '共同影子价0.4时贡献−0.1pp。' }, { label: '共同输入', value: '资金成本3.4%；shadow price 0.4', note: '比较不靠差别化影子价人为制造。' }, { label: '共同基础', value: '12m PD与合同 · 100 SYN EAD · SYN币种', note: 'origination response window不能替代PD预测期。' }], formulas: ['promised yield ≠ expected return ≠ risk-adjusted contribution'], formulaUnits: '所有收益与费用均是同一12个月教学期限上的年化百分点；两项目EAD、币种、合同期限、PD预测期和影子价共同。',
    options: [{ id: 'a', label: '能；8.4%必然高于5.4%。', diagnosis: '你比较的是承诺收益，不是风险调整后的贡献。' }, { id: 'b', label: '能；PD只影响事后，不影响选择。', diagnosis: '筛选在事前就使用PD/LGD与尾部风险评估。' }, { id: 'c', label: '不能；共同影子价0.4和完整费用下，安全项目+0.5、高风险项目−0.1。', diagnosis: '正确：高票息可能只是补偿更高的预期与尾部损失。' }], correct: 'c', calculation: '共同影子价0.4时，安全贡献=5.4−3.4−0.5−0.3−0.3−0.4=+0.5；高风险贡献=8.4−3.4−0.5−2.5−0.5−1.6=−0.1。', judgment: '不能按票息排序。', causalExplanation: '中介的内生选择规则排序风险调整价值，而非合同票息本身。', counterfactualOrFailure: '若两项目所有风险成本完全相同，票息排序才与贡献排序一致。',
    primarySectionId: 'portfolio-substitution', remediationSectionIds: ['risk-hurdle', 'measurement-passport'], sourceIds: [3, 4, 17, 28], numericAssertions: [{ key: 'safe', expected: 0.5, unit: 'pp/year' }, { key: 'risky', expected: -0.1, unit: 'pp/year' }],
    staticTwin: { id: 'K8', title: '票息相同也不等风险相同', prompt: '两项目都6%，A的EL 0.5pp、B的EL 2pp，其他费用相同；应否无差别？', choices: three('不应；A贡献更高1.5pp', '应；票息相同', 'B必然更优'), correct: 'a', calculations: ['共同项相消。', '贡献差=(−0.5)−(−2)=+1.5pp。'], answer: 'A。风险调整排序需要损失输入。', judgment: 'A优于B。', causalExplanation: '相同票息未补偿B更高预期损失。', counterfactualOrFailure: '若B有额外1.5pp以上的其他净补偿，排序可能反转。', sourceIds: [3, 17], numericAssertions: [{ key: 'gap', expected: 1.5, unit: 'pp/year' }] },
  },
  {
    id: 'M9', mode: 'measurement-and-identification', label: 'Frozen-boundary gate', synthetic: true,
    title: '政策后风险资产份额上升，同时银行资本余量和申请人PD也变化；可否称为纯风险承担渠道？',
    brief: '3.12拥有风险偏好、筛选、定价与组合选择；风险容量、银行资金和借款人状态必须冻结或显式联合建模。',
    facts: [{ label: '结果', value: '风险份额上升', note: '描述性组合变化。' }, { label: '同时变化', value: '资本余量、申请人PD', note: '跨入3.10与3.11。' }], formulas: ['observed mix = choice rule + capacity + borrower pool + measurement'], formulaUnits: '分解式是机制账本，不是可直接估计的恒等式。',
    options: [{ id: 'a', label: '不能；应标joint-channel或STOP并分别建模。', diagnosis: '正确：容量和借款人风险变化均可独立改变观察组合。' }, { id: 'b', label: '可以，因为资本只影响总量不影响构成。', diagnosis: '资本约束可改变高权重资产的相对影子成本与构成。' }, { id: 'c', label: '可以，只要风险份额方向正确。', diagnosis: '方向一致不排除替代机制。' }], correct: 'a', calculation: 'sameBorrowerOrApplicationDemandControl=false；lenderCapacityFrozenOrModelled=false；borrowerRiskFrozenOrModelled=false；其他门通过时为8/11、mechanism-consistent，但纯3.12解释仍不通过。', judgment: '联合渠道；证据闸门至多是机制一致，不授予纯机制身份。', causalExplanation: '观察构成同时受选择规则、容量价格和借款人池变化影响。', counterfactualOrFailure: '冻结资本余量与同一申请，或在结构模型中显式分解，才能隔离风险偏好边际。',
    primarySectionId: 'pure-channel-counterfactual', remediationSectionIds: ['identification-falsification', 'five-estimands'], sourceIds: [1, 3, 5], numericAssertions: [{ key: 'status', expected: 'mechanism-consistent', unit: 'status' }],
    staticTwin: { id: 'K9', title: '冻结状态后的局部比较', prompt: '同一申请、同一银行资金和资本余量、同一PD/LGD，只有SYNTHETIC决策账本尾部权重下降；项目接受率上升可叫什么？', choices: three('借款人抵押品效应', '风险承担机制候选', '银行资金供给冲击'), correct: 'b', calculations: ['容量、资金和借款人状态冻结。', '选择规则的尾部权重是唯一移动项；没有据此声称观察到aggregate appetite。'], answer: 'B。仍需政策冲击、治理映射与时钟闸门才可升级为对应因果结论。', judgment: '业务规则层的机制候选。', causalExplanation: '变化定位在中介风险定价与选择规则，不是董事会意愿的直接测量。', counterfactualOrFailure: '若政策暴露非预定、申请池变化或治理映射缺失，识别仍降级。', sourceIds: [1, 3], numericAssertions: [{ key: 'boundary', expected: true, unit: 'boolean' }] },
  },
  {
    id: 'M10', mode: 'measurement-and-identification', label: 'Survey clock + sign', synthetic: false,
    title: 'ECB BLS的风险容忍度贡献在2022Q4约+12.24、2024Q4约−0.35；能否说政策导致风险偏好反转？',
    brief: '真实调查序列不是合成题输入：正值表示净收紧贡献、负值表示净放松贡献；季度标签是发布/收集季度，问题回顾过去三个月，不能当作同名经济实现季度。ECB原词bank’s risk tolerance只保留为广义供给侧意愿的自报信号。',
    facts: [{ label: 'series', value: 'BLS…RTO…WFNET', note: '企业信贷标准、ECB原词bank’s risk tolerance、加权净百分比。' }, { label: '观察', value: '2022Q4 +12.235；2024Q4 −0.355', note: 'ECB原始精度。' }, { label: 'crosswalk', value: 'source vocabulary only', note: '不写入canonical PD/tail tolerance，也不直接测量董事会aggregate appetite。' }, { label: '证据身份', value: 'survey descriptive', note: '没有政策反事实。' }], formulas: ['weighted net % = tightening contribution − easing contribution'], formulaUnits: '百分比；不是贷款量、违约率、canonical operational tolerance、aggregate appetite或结构弹性。',
    options: [{ id: 'a', label: '能；符号变化本身就是政策因果证据。', diagnosis: '符号变化可能来自经济前景、样本、构成和同步冲击。' }, { id: 'b', label: '不能；只能描述受访银行报告的净贡献方向与幅度。', diagnosis: '正确：问卷提供机制相关描述，但没有独立政策冲击或反事实。' }, { id: 'c', label: '能；标为2026Q3就代表2026Q3整季已经实现。', diagnosis: '该序列按期初收集/发布季度索引且回顾过去三个月，不能当作同名整季实现值。' }], correct: 'b', calculation: '2022Q4为正：ECB原词bank’s risk tolerance对收紧有净贡献；2024Q4略负：对放松有很小净贡献。二者之差不识别政策效应，也不能覆盖canonical治理字段。', judgment: '仅描述性的广义供给侧意愿信号。', causalExplanation: '调查记录银行自报机制方向，但没有把政策冲击从风险感知、需求与其他共同因素中隔离，也不把宽泛source vocabulary拆成PD/tail操作容差或董事会总体偏好。', counterfactualOrFailure: '只有先建立治理crosswalk，再闭合预定政策暴露、同申请需求控制、容量/借款人风险和时钟，才可能形成对应estimand的因果候选。',
    primarySectionId: 'standards-versus-terms', remediationSectionIds: ['measurement-passport', 'identification-falsification'], sourceIds: [32], numericAssertions: [{ key: 'q4-2022', expected: 12.2350854481155, unit: 'percent' }, { key: 'q4-2024', expected: -0.35497195232793444, unit: 'percent' }],
    staticTwin: { id: 'K10', title: '调查正号的最窄含义', prompt: '某期WFNET=+5，最窄正确解释？', choices: three('贷款量下降5%', '政策使违约率上升5%', '受访银行风险容忍度对信贷标准收紧有净贡献'), correct: 'c', calculations: ['WFNET的正号按ECB定义指向净收紧贡献。', '它不是贷款数量、违约率、canonical operational tolerance或aggregate appetite。'], answer: 'C。保留ECB来源原词、对象、方向与非因果身份。', judgment: '广义供给侧意愿的净收紧贡献。', causalExplanation: '这是银行回答的加权聚合，source vocabulary不自动映射到本页治理字段。', counterfactualOrFailure: '没有治理crosswalk与政策反事实时不得升级为对应治理变量或政策效应。', sourceIds: [32], numericAssertions: [{ key: 'sign', expected: 'tightening', unit: 'status' }] },
  },
];

const sharedComparisonShadowPrice = 0.4;
const loose = riskAdjustedSelectionMetrics(canonicalRiskyCandidate);
const tight = riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, riskShadowPricePerUnexpectedLossPoint: sharedComparisonShadowPrice });
const yieldBefore = searchForYieldMix(4, 7, 5);
const yieldAfter = searchForYieldMix(1, 7, 5);
const yieldImpossible = searchForYieldMix(1, 4, 5);
const budgetBefore = riskBudgetExposureMetrics({ lossBudget: 10, currentMeasuredVolatilityPctPoints: 8, confidenceMultiplier: 2.5, stressLossRatePctPoints: 25 });
const budgetAfter = riskBudgetExposureMetrics({ lossBudget: 10, currentMeasuredVolatilityPctPoints: 4, confidenceMultiplier: 2.5, stressLossRatePctPoints: 25 });
const noFloor = marginPressureMetrics({ ...canonicalMarginProxyBasis, assetYieldBeforePctPoints: 6, depositCostBeforePctPoints: 2, otherFundingCostPctPoints: 0.5, policyRateChangePctPoints: -3, assetYieldPassThrough: 0.8, depositRatePassThrough: 0.5, depositRateFloorPctPoints: 0, riskShiftingSensitivity: 0.8, capacityRetrenchmentSensitivity: 0.4 });
const withFloor = marginPressureMetrics({ ...canonicalMarginProxyBasis, assetYieldBeforePctPoints: 6, depositCostBeforePctPoints: 2, otherFundingCostPctPoints: 0.5, policyRateChangePctPoints: -3, assetYieldPassThrough: 0.8, depositRatePassThrough: 0.5, depositRateFloorPctPoints: 1.5, riskShiftingSensitivity: 0.4, capacityRetrenchmentSensitivity: 0.8 });
const beforeCohort = cohortRiskMetrics({ riskyShareRatio: 0.2, safeRealisedDefaultRatePctPoints: 1, riskyRealisedDefaultRatePctPoints: 8 });
const afterCohort = cohortRiskMetrics({ riskyShareRatio: 0.4, safeRealisedDefaultRatePctPoints: 0.5, riskyRealisedDefaultRatePctPoints: 4 });
const transfer = riskTransferMetrics({ originatedExposure: 100, retainedExposure: 20, soldExposure: 80, purchasedProtectionOnRetained: 10 });
const oneGateMissing = riskTakingIdentificationStatus({ ...identifiedCandidateGate, sameBorrowerOrApplicationDemandControl: false });
const threeBoundaryGatesMissing = riskTakingIdentificationStatus({
  ...identifiedCandidateGate,
  sameBorrowerOrApplicationDemandControl: false,
  lenderCapacityFrozenOrModelled: false,
  borrowerRiskFrozenOrModelled: false,
});
const tightSafe = riskAdjustedSelectionMetrics({ ...canonicalSafeCandidate, riskShadowPricePerUnexpectedLossPoint: sharedComparisonShadowPrice });

const computed: Record<string, number | string | boolean | null | undefined> = {
  'M1.loose': loose?.riskAdjustedContributionPctPoints, 'M1.tight': tight?.riskAdjustedContributionPctPoints, 'K1.contribution': 1.5 - 4 * 0.3,
  'M2.before-share': yieldBefore?.rawRiskyShareRatio, 'M2.after-share': yieldAfter?.rawRiskyShareRatio, 'K2.raw-share': yieldImpossible?.rawRiskyShareRatio,
  'M3.model-before': budgetBefore?.modelOnlyMaximumExposure, 'M3.model-after': budgetAfter?.modelOnlyMaximumExposure, 'M3.robust-after': budgetAfter?.robustMaximumExposure, 'K3.robust-cap': Math.min(10 / (2 * 0.15), 10 / 0.2),
  'M4.no-floor': noFloor?.illustrativeNetRiskChoicePressure, 'M4.with-floor': withFloor?.illustrativeNetRiskChoicePressure, 'K4.net': 0,
  'M5.before-default': beforeCohort?.realisedDefaultRatePctPoints, 'M5.after-default': afterCohort?.realisedDefaultRatePctPoints, 'K5.after-default': 0.6 * 1 + 0.4 * 8,
  'M6.bank-unhedged': transfer?.bankUnhedgedExposure, 'M6.system-total': transfer?.systemFinalHolderExposure, 'K6.bank': 15, 'K6.system': 60,
  'M7.passed': oneGateMissing.passed, 'M7.status': oneGateMissing.status, 'K7.status': riskTakingIdentificationStatus(identifiedCandidateGate).status,
  'M8.safe': tightSafe?.riskAdjustedContributionPctPoints, 'M8.risky': tight?.riskAdjustedContributionPctPoints, 'K8.gap': 1.5,
  'M9.status': threeBoundaryGatesMissing.status, 'K9.boundary': true,
  'M10.q4-2022': 12.2350854481155, 'M10.q4-2024': -0.35497195232793444, 'K10.sign': 'tightening',
};

const approximately = (actual: number, expected: number, tolerance = 1e-8) => Math.abs(actual - expected) <= tolerance;
const countAnswerPositions = (answers: RiskTakingChoice[]) => answers.reduce<Record<RiskTakingChoice, number>>((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 });
const hasThreeThreeFourDistribution = (counts: Record<RiskTakingChoice, number>) => Object.values(counts).sort((left, right) => left - right).join(',') === '3,3,4';
const mainAnswerPositionCounts = countAnswerPositions(riskTakingScenarios.map(({ correct }) => correct));
const staticAnswerPositionCounts = countAnswerPositions(riskTakingScenarios.map(({ staticTwin }) => staticTwin.correct));
const m7 = riskTakingScenarios.find(({ id }) => id === 'M7');
export const riskTakingNumericAssertionAudit = riskTakingScenarios.flatMap((scenario) => [
  ...scenario.numericAssertions.map((assertion) => ({ scenarioId: scenario.id, ...assertion })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({ scenarioId: scenario.staticTwin.id, ...assertion })),
]).map((assertion) => {
  const actual = computed[`${assertion.scenarioId}.${assertion.key}`];
  const passed = typeof assertion.expected === 'number' ? typeof actual === 'number' && approximately(actual, assertion.expected, assertion.tolerance) : actual === assertion.expected;
  return { ...assertion, actual, passed };
});

export const riskTakingScenarioAssertions = [
  { key: 'exactly-ten-scenarios', passed: riskTakingScenarios.length === 10 },
  { key: 'five-per-mode', passed: riskTakingModes.every((mode) => riskTakingScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { key: 'm1-m10', passed: riskTakingScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { key: 'k1-k10', passed: riskTakingScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { key: 'unique-three-choice', passed: riskTakingScenarios.every(({ options, staticTwin }) => options.length === 3 && new Set(options.map(({ id }) => id)).size === 3 && staticTwin.choices.length === 3 && new Set(staticTwin.choices.map(({ id }) => id)).size === 3) },
  { key: 'answers-exist', passed: riskTakingScenarios.every(({ options, correct, staticTwin }) => options.some(({ id }) => id === correct) && staticTwin.choices.some(({ id }) => id === staticTwin.correct)) },
  { key: 'm-answer-positions-3-3-4', passed: hasThreeThreeFourDistribution(mainAnswerPositionCounts) },
  { key: 'k-answer-positions-3-3-4', passed: hasThreeThreeFourDistribution(staticAnswerPositionCounts) },
  { key: 'static-answer-letter-sync', passed: riskTakingScenarios.every(({ staticTwin }) => staticTwin.answer.startsWith(`${staticTwin.correct.toUpperCase()}。`)) },
  { key: 'm7-wrong-diagnoses-do-not-disclose-answer-label', passed: Boolean(m7 && m7.options.filter(({ id }) => id !== m7.correct).every(({ diagnosis }) => !/mechanism-consistent|机制一致/i.test(diagnosis))) },
  { key: 'judgment-causal-counterfactual', passed: riskTakingScenarios.every(({ judgment, causalExplanation, counterfactualOrFailure, staticTwin }) => [judgment, causalExplanation, counterfactualOrFailure, staticTwin.judgment, staticTwin.causalExplanation, staticTwin.counterfactualOrFailure].every((text) => text.trim().length > 0)) },
  { key: 'nine-synthetic-one-official-descriptive', passed: riskTakingScenarios.filter(({ synthetic }) => synthetic).length === 9 && riskTakingScenarios.find(({ id }) => id === 'M10')?.synthetic === false },
  { key: 'all-numeric-assertions-pass', passed: riskTakingNumericAssertionAudit.every(({ passed }) => passed) },
] as const;

if (!riskTakingScenarioAssertions.every(({ passed }) => passed)) throw new Error(`3.12 scenario structure gate failed: ${riskTakingScenarioAssertions.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
if (!riskTakingNumericAssertionAudit.every(({ passed }) => passed)) throw new Error(`3.12 scenario numeric gate failed: ${riskTakingNumericAssertionAudit.filter(({ passed }) => !passed).map(({ scenarioId, key }) => `${scenarioId}.${key}`).join(', ')}`);
