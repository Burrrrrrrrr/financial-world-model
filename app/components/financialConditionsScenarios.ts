import { populationStandardScore } from './financialConditionsFixtures';

export type FinancialConditionsChoice = 'a' | 'b' | 'c';
export type FinancialConditionsMode = 'construction' | 'interpretation';

type NumericAssertion = { key: string; expected: number | string | boolean; unit: string; tolerance?: number };

export type FinancialConditionsStaticTwin = {
  id: `K${number}`;
  synthetic: boolean;
  title: string;
  prompt: string;
  choices: { id: FinancialConditionsChoice; label: string }[];
  correct: FinancialConditionsChoice;
  calculations: string[];
  answer: string;
  judgment: string;
  causalExplanation: string;
  counterfactualOrFailure: string;
  sourceIds: number[];
  numericAssertions: NumericAssertion[];
};

export type FinancialConditionsScenario = {
  id: `M${number}`;
  mode: FinancialConditionsMode;
  label: string;
  synthetic: boolean;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: FinancialConditionsChoice; label: string; diagnosis: string }[];
  correct: FinancialConditionsChoice;
  calculation: string;
  judgment: string;
  causalExplanation: string;
  counterfactualOrFailure: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: NumericAssertion[];
  staticTwin: FinancialConditionsStaticTwin;
};

export const financialConditionsModes = [
  { id: 'construction' as const, label: 'BUILD', title: '构造与复算', description: '方向、标准化、权重、重复项和vintage。' },
  { id: 'interpretation' as const, label: 'USE', title: '解释与边界', description: '价格/数量、聚合、预测、政策和真实数据。' },
] as const;

const three = (a: string, b: string, c: string) => [
  { id: 'a' as const, label: a }, { id: 'b' as const, label: b }, { id: 'c' as const, label: c },
];

export const financialConditionsScenarios: FinancialConditionsScenario[] = [
  {
    id: 'M1', mode: 'construction', label: 'Direction alignment', synthetic: true,
    title: '方向统一后的四项z为利率+1、信用+2、股票−1、美元+0.5；等权FCI是多少？',
    brief: '正值统一表示对声明主体的收紧；股票上涨在本企业融资护照中已经翻成负号。',
    facts: [{ label: 'aligned vector', value: '(+1,+2,−1,+0.5)', note: '四项已经处于可比教学尺度。' }, { label: 'weights', value: '各25%', note: '不是市场价值权重。' }],
    formulas: ['FCI = Σ wᵢzᵢ'], formulaUnits: '结果是index points，不是百分点或综合指数自身的标准差。',
    options: [{ id: 'a', label: '+1.125', diagnosis: '你可能把四项的和与等权平均混淆。' }, { id: 'b', label: '+0.625', diagnosis: '正确：先使用已经统一方向的数值，再做四项等权平均。' }, { id: 'c', label: '−0.625', diagnosis: '“正值=收紧”已在输入中完成，不应再次整体翻号。' }],
    correct: 'b', calculation: '(1+2−1+0.5)/4=+0.625。', judgment: '该SYNTHETIC四项等权状态指向相对收紧。', causalExplanation: '方向统一只建立测量口径；它没有解释为什么这些市场变量变化。', counterfactualOrFailure: '若美元主体暴露、币种或对冲未知，美元项方向未定义，应STOP而非继续平均。',
    primarySectionId: 'direction-standardisation', remediationSectionIds: ['fx-dollar-lane', 'component-passport'], sourceIds: [3, 8, 9], numericAssertions: [{ key: 'score', expected: 0.625, unit: 'index points' }],
    staticTwin: { id: 'K1', synthetic: true, title: '另一组方向已统一的输入', prompt: '实际利率−0.5、信用+1.5、股票下跌对应+1、美元0，等权结果？', choices: three('−0.5', '+1.0', '+0.5'), correct: 'c', calculations: ['(−0.5+1.5+1+0)/4=+0.5。'], answer: 'C。四项等权结果为+0.5 index points。', judgment: '合成状态指向收紧。', causalExplanation: '信用与股票项的收紧贡献超过实际利率的宽松贡献。', counterfactualOrFailure: '方向未统一或单位未标准化时不能使用这个和式。', sourceIds: [3, 8], numericAssertions: [{ key: 'score', expected: 0.5, unit: 'index points' }] },
  },
  {
    id: 'M2', mode: 'construction', label: 'Standardisation', synthetic: true,
    title: '信用利差和实际利率都上升50bp；历史SD分别是25bp和100bp。哪个标准化移动更大？',
    brief: '两项原始变化单位相同，不代表相对各自历史分布的异常度相同。',
    facts: [{ label: '信用利差', value: '+50bp；SD 25bp', note: '均值变化已从分子扣除。' }, { label: '实际利率', value: '+50bp；SD 100bp', note: '同样按正值收紧。' }],
    formulas: ['z = aligned change / calibration SD'], formulaUnits: 'bp在分子分母相消，得到组件z单位。',
    options: [{ id: 'a', label: '二者都是+1。', diagnosis: '你忽略了不同的历史SD。' }, { id: 'b', label: '实际利率更异常。', diagnosis: '同样50bp除以更大的100bp标准差，异常度反而更小。' }, { id: 'c', label: '信用+2、实际利率+0.5；前者是后者4倍。', diagnosis: '正确：标准化比较的是相对各自校准分布的移动。' }],
    correct: 'c', calculation: '50/25=2；50/100=0.5；2/0.5=4。', judgment: '信用利差的标准化移动更大。', causalExplanation: '标准化改变比较尺度，不证明信用冲击在经济上有四倍因果影响。', counterfactualOrFailure: '若校准窗含结构断点或SD接近零，应更换稳健尺度或STOP。',
    primarySectionId: 'direction-standardisation', remediationSectionIds: ['level-change-horizon', 'realtime-vintage'], sourceIds: [8, 9], numericAssertions: [{ key: 'ratio', expected: 4, unit: 'ratio' }],
    staticTwin: { id: 'K2', synthetic: true, title: '不同波动率下的相同单位', prompt: '贷款率+25bp、SD50bp；信用spread +40bp、SD20bp，两个z是多少？', choices: three('+0.5与+2', '都为+1', '+2与+0.5'), correct: 'a', calculations: ['贷款率：25/50=+0.5。', '信用spread：40/20=+2。'], answer: 'A。信用标准化移动是贷款率的4倍。', judgment: '原始bp不可直接代替标准化比较。', causalExplanation: '分母编码各自冻结历史窗中的尺度。', counterfactualOrFailure: '这仍不是经济影响权重。', sourceIds: [8, 9], numericAssertions: [{ key: 'loan', expected: 0.5, unit: 'z' }, { key: 'credit', expected: 2, unit: 'z' }] },
  },
  {
    id: 'M3', mode: 'construction', label: 'Weighting purpose', synthetic: true,
    title: '对z=(1,2,−1,0.5)，等权与信用重权(0.15,0.55,0.15,0.15)分别是多少？',
    brief: '权重必须先声明用途；这里两组都只是SYNTHETIC镜头。',
    facts: [{ label: 'vector', value: '(rates 1, credit 2, equity −1, dollar .5)', note: '输入在两种镜头中完全相同。' }, { label: 'credit-heavy', value: '(.15,.55,.15,.15)', note: '权重和为1。' }],
    formulas: ['FCIᵖ = Σ wᵢᵖzᵢ'], formulaUnits: 'p标记用途；不同p的数值不宜直接比较。',
    options: [{ id: 'a', label: '等权0.625；信用重权1.175。', diagnosis: '正确：信用+2得到更大权重后，汇总更紧。' }, { id: 'b', label: '两者都是1。', diagnosis: '权重改变了贡献和，不会自动抵消。' }, { id: 'c', label: '等权0.675；信用重权0.625。', diagnosis: '请逐项复算wᵢzᵢ。' }],
    correct: 'a', calculation: '等权=(1+2−1+0.5)/4=0.625；信用重权=0.15+1.10−0.15+0.075=1.175。', judgment: '权重改变指数回答的问题。', causalExplanation: '同一世界状态可被不同用途的测量算子投影成不同标量。', counterfactualOrFailure: '若权重是在看到预测结果后挑选，OOS身份失效。',
    primarySectionId: 'weighting-purpose', remediationSectionIds: ['component-contribution', 'index-families'], sourceIds: [1, 3, 8], numericAssertions: [{ key: 'equal', expected: 0.625, unit: 'index points' }, { key: 'credit-heavy', expected: 1.175, unit: 'index points' }],
    staticTwin: { id: 'K3', synthetic: true, title: '美元重权镜头', prompt: 'z=(−1,2,0,1)，等权与美元重权(0.1,0.2,0.1,0.6)分别是多少？', choices: three('0与1', '0.5与0.9', '0.9与0.5'), correct: 'b', calculations: ['等权=(−1+2+0+1)/4=0.5。', '美元重权=−0.1+0.4+0+0.6=0.9。'], answer: 'B。分别为+0.5与+0.9。', judgment: '美元暴露用途显示更紧。', causalExplanation: '暴露权重改变相同市场状态对主体的有效条件。', counterfactualOrFailure: '若主体没有净美元暴露，美元重权没有经济依据。', sourceIds: [8, 14], numericAssertions: [{ key: 'equal', expected: 0.5, unit: 'index points' }, { key: 'dollar', expected: 0.9, unit: 'index points' }] },
  },
  {
    id: 'M4', mode: 'construction', label: 'Duplicate signal', synthetic: true,
    title: '四块(0,2,0,0)等权为0.5；加入同值的重复信用项并五等分后会怎样？',
    brief: '第五项没有新经济信息，只是复制了信用块。',
    facts: [{ label: 'before', value: '4 blocks, one credit signal', note: '(0+2+0+0)/4。' }, { label: 'after', value: '5 components, two credit copies', note: '(0+2+2+0+0)/5。' }],
    formulas: ['equal-component weight ≠ equal-economic-block weight'], formulaUnits: '指数点；相关性不是额外独立证据的数量。',
    options: [{ id: 'a', label: '保持0.5，因为没有新信息。', diagnosis: '经济信息没变，但naive等组件权重已经改变。' }, { id: 'b', label: '变成0.4。', diagnosis: '请把两个信用2都放进五项分子。' }, { id: 'c', label: '变成0.8，但没有新增经济信息。', diagnosis: '正确：复制项把信用块总权重从25%提高到40%。' }],
    correct: 'c', calculation: '(0+2+2+0+0)/5=0.8；四块等权、信用块内部平均仍为0.5。', judgment: 'raw component aggregation发生double counting。', causalExplanation: '数据更密集的经济块在等组件法下获得更大隐含权重。', counterfactualOrFailure: '若新指标测量独立经济维度，就不能简单视作完全重复；需要经济与统计两层审计。',
    primarySectionId: 'redundancy-double-count', remediationSectionIds: ['weighting-purpose', 'pca-factor'], sourceIds: [3, 5, 8], numericAssertions: [{ key: 'naive', expected: 0.8, unit: 'index points' }, { key: 'block', expected: 0.5, unit: 'index points' }],
    staticTwin: { id: 'K4', synthetic: true, title: '复制利率块', prompt: '原四项(1,0,0,0)等权0.25；复制利率项并五等分会怎样？', choices: three('仍0.25', '变0.2', '变0.4，而block-neutral仍0.25'), correct: 'c', calculations: ['naive=(1+1+0+0+0)/5=0.4。', '四块等权仍为1/4=0.25。'], answer: 'C。复制改变了隐含block weight。', judgment: '应报告重复项处理。', causalExplanation: '组件数量不应决定经济类别的重要性。', counterfactualOrFailure: '若两利率测量不同期限且用途需要期限结构，它们可能属于不同有效状态。', sourceIds: [3, 8], numericAssertions: [{ key: 'naive', expected: 0.4, unit: 'index points' }, { key: 'block', expected: 0.25, unit: 'index points' }] },
  },
  {
    id: 'M5', mode: 'construction', label: 'Vintage leakage', synthetic: true,
    title: '[100,102,104,106,108]中108的实时z，与加入120/130/140后的full-sample旧日期z分别是多少？',
    brief: '采用population SD；旧原值108没有修订，变化只来自未来样本进入normaliser。',
    facts: [{ label: 'real-time', value: 'mean 104; SD 2.828', note: '仅使用当时五个观测。' }, { label: 'ex-post', value: 'mean 113.75; SD 13.727', note: '错误地把三个未来值加入。' }],
    formulas: ['zₜ|ᵥ = (xₜ|ᵥ − μᵥ) / σᵥ'], formulaUnits: 'bp在标准化中相消；v是信息vintage。',
    options: [{ id: 'a', label: '两者都约+1.41。', diagnosis: 'full-sample均值和SD已经被未来大值改变。' }, { id: 'b', label: '约+1.41与−0.42。', diagnosis: '正确：未来样本甚至反转了旧日期的相对符号。' }, { id: 'c', label: '108被自动修订为140。', diagnosis: '原观测与normaliser是两件事；本题没有修改108。' }],
    correct: 'b', calculation: '(108−104)/2.828=+1.414；(108−113.75)/13.727≈−0.419。', judgment: '完整样本标准化造成历史信息泄漏。', causalExplanation: '未来危机改变了校准分布，而非当时融资状态本身。', counterfactualOrFailure: '若明确做ex-post历史重述可以使用全样本，但必须与pseudo-real-time系列分开命名。',
    primarySectionId: 'realtime-vintage', remediationSectionIds: ['level-change-horizon', 'validation-protocol'], sourceIds: [4, 9, 19], numericAssertions: [{ key: 'realtime', expected: Math.sqrt(2), unit: 'z' }, { key: 'full', expected: -0.41887474627625065, unit: 'z', tolerance: 1e-12 }],
    staticTwin: { id: 'K5', synthetic: true, title: '另一个未来样本反转', prompt: '实时样本[1,2,3]中3的z，与加入7、9后的full-sample z分别是多少？', choices: three('约+1.225与−0.456', '都约+1.225', '−1与+1'), correct: 'a', calculations: ['实时：均值2、population SD√(2/3)，z=+1.225。', '全样本：均值4.4、SD√9.44，z≈−0.456。'], answer: 'A。未来样本把旧日期从相对高位改写为相对低位。', judgment: '历史标签对校准vintage敏感。', causalExplanation: 'normaliser获得了未来信息。', counterfactualOrFailure: '冻结expanding/rolling规则和重估日程可避免这种伪实时泄漏。', sourceIds: [9, 19], numericAssertions: [{ key: 'realtime', expected: Math.sqrt(1.5), unit: 'z' }, { key: 'full', expected: -1.4 / Math.sqrt(9.44), unit: 'z' }] },
  },
  {
    id: 'M6', mode: 'interpretation', label: 'Price versus access', synthetic: true,
    title: '小企业获批者报价8%降至7.5%，批准率70%降至40%，额度比80%降至40%，抵押要求由100%升至140%。最完整判断是什么？',
    brief: '平均报价只条件于“仍被批准”的样本；价格、数量和条款是不同margin。',
    facts: [{ label: 'price among approved', value: '−0.5pp', note: '存活样本可能更安全。' }, { label: 'approval', value: '−30pp', note: '申请母体分母固定。' }, { label: 'amount/request', value: '−40pp', note: '获批容量明显收缩。' }, { label: 'collateral', value: '+40pp', note: '非价格条款收紧。' }],
    formulas: ['financing menu = {price, approval, amount, maturity, collateral, covenants}'], formulaUnits: '这是并列向量，不是把不同margin机械相乘或相加成一数。',
    options: [{ id: 'a', label: '报价样本看似宽松，但可得数量和条款明显收紧。', diagnosis: '正确：条件报价下降不能覆盖被拒申请与额度收缩。' }, { id: 'b', label: '全面宽松，因为利率下降。', diagnosis: '你忽略了批准、额度和抵押要求。' }, { id: 'c', label: '无法观察任何变化。', diagnosis: '题目提供了多个可观察margin；缺的是因果归属，不是描述变化。' }],
    correct: 'a', calculation: '报价−0.5pp；批准率−30pp；额度比−40pp；抵押要求+40pp。', judgment: 'price样本宽松与access/terms收紧并存。', causalExplanation: '拒绝高风险申请会让获批样本的平均报价机械下降，产生选择构成效应。', counterfactualOrFailure: '若同一合格申请的批准、额度与条款都不变，报价下降才更接近纯价格宽松。',
    primarySectionId: 'price-quantity-terms', remediationSectionIds: ['component-passport', 'aggregate-borrower-specific'], sourceIds: [8, 17, 21], numericAssertions: [{ key: 'approval-drop', expected: 30, unit: 'percentage points' }, { key: 'amount-drop', expected: 40, unit: 'percentage points' }],
    staticTwin: { id: 'K6', synthetic: true, title: '价格不动也会收紧', prompt: '获批报价保持6%，批准率80%降至50%、额度100%降至60%、契约收紧，如何判断？', choices: three('条件不变', 'price不变但quantity/terms收紧', '报价不变证明供给不变'), correct: 'b', calculations: ['报价变化=0。', '批准率−30pp，额度比−40pp，契约方向=收紧。'], answer: 'B。价格只是融资菜单的一条lane。', judgment: '可得性和非价格条款收紧。', causalExplanation: '信贷供给可以通过拒绝、限额和契约而非报价调整。', counterfactualOrFailure: '数量变化仍可能含需求；供给因果需要申请或需求反事实。', sourceIds: [17, 21], numericAssertions: [{ key: 'approval-drop', expected: 30, unit: 'percentage points' }] },
  },
  {
    id: 'M7', mode: 'interpretation', label: 'Aggregation weights', synthetic: true,
    title: '大企业报价变化+1.5pp、小企业−0.5pp；存量权重80/20与申请者权重20/80的加权变化分别是多少？',
    brief: '两个权重都可计算，但分别回答存量暴露与当前申请总体。',
    facts: [{ label: 'large firms', value: '+1.5pp', note: '正值表示报价收紧。' }, { label: 'small firms', value: '−0.5pp', note: '只看获批报价。' }, { label: 'weights', value: '80/20 vs 20/80', note: '总体构成不同。' }],
    formulas: ['aggregate = Σ group weight × group condition'], formulaUnits: '百分点；权重母体必须与问题一致。',
    options: [{ id: 'a', label: '两者都是+1.0pp。', diagnosis: '组间变化并不相同，交换权重会改变加权结果。' }, { id: 'b', label: '+0.5pp与−0.5pp。', diagnosis: '请逐项乘权重再求和。' }, { id: 'c', label: '+1.1pp与−0.1pp；聚合方向依权重改变。', diagnosis: '正确：总体不是主体分布的替代品。' }],
    correct: 'c', calculation: '0.8×1.5+0.2×(−0.5)=+1.1；0.2×1.5+0.8×(−0.5)=−0.1。', judgment: '总体符号对人口权重敏感。', causalExplanation: 'aggregation把组内变化与构成选择同时写入一个均值。', counterfactualOrFailure: '固定同一组权重并同时报告组别分布，才能区分组内与构成效应。',
    primarySectionId: 'aggregate-borrower-specific', remediationSectionIds: ['price-quantity-terms', 'component-contribution'], sourceIds: [8, 21], numericAssertions: [{ key: 'stock', expected: 1.1, unit: 'percentage points' }, { key: 'applicant', expected: -0.1, unit: 'percentage points' }],
    staticTwin: { id: 'K7', synthetic: true, title: '纯构成变化', prompt: 'A组FCI−1、B组+2，组内均不变；权重从80/20变到20/80，总体怎样变化？', choices: three('−0.4到−0.4', '+1.4到+1.4', '−0.4到+1.4，变化完全来自构成'), correct: 'c', calculations: ['之前=0.8×(−1)+0.2×2=−0.4。', '之后=0.2×(−1)+0.8×2=+1.4。'], answer: 'C。组内状态没有变化，总体变化来自权重。', judgment: 'aggregation composition effect。', causalExplanation: '样本/暴露份额把更多权重移到较紧的B组。', counterfactualOrFailure: '使用固定权重反事实可隔离组内变化。', sourceIds: [8], numericAssertions: [{ key: 'before', expected: -0.4, unit: 'index points' }, { key: 'after', expected: 1.4, unit: 'index points' }] },
  },
  {
    id: 'M8', mode: 'interpretation', label: 'Forecast versus cause', synthetic: true,
    title: 'SYNTHETIC系数−0.8、FCI=+1.5，但没有真实OOS记录或外生冲击。最强结论是什么？',
    brief: '这里可以检查乘法与符号，却没有估计样本、forecast origin、vintage、benchmark、loss或因果处理。',
    facts: [{ label: 'teaching rule', value: 'Δgrowtĥ=−0.8×FCI', note: 'SYNTHETIC系数。' }, { label: 'current input', value: '+1.5', note: 'SYNTHETIC收紧分数。' }, { label: 'evidence state', value: 'prediction not estimated; causal not claimed', note: '没有经验预测或外生处理记录。' }],
    formulas: ['synthetic forecast arithmetic ≠ empirical OOS evidence ≠ do(shock) causal response'], formulaUnits: '算术结果以教学pp表示；不是现实预测或结构乘数。',
    options: [{ id: 'a', label: 'FCI因果使增长下降0.8%。', diagnosis: '你既错算了数值，也把合成系数变成因果系数。' }, { id: 'b', label: '合成算术为−1.2pp；经验预测尚未估计，因果也未声明。', diagnosis: '正确：算术、预测验证和因果识别是三种不同证据状态。' }, { id: 'c', label: '连−1.2这个教学乘法也无法计算。', diagnosis: '算术可以复算，但不能据此授予经验预测或因果身份。' }],
    correct: 'b', calculation: 'SYNTHETIC算术：−0.8×1.5=−1.2pp；predictionStatus=not-estimated；causalStatus=not-claimed。', judgment: '只通过合成算术门，没有经验OOS或因果证据。', causalExplanation: '即使未来观察到预测关系，坏增长消息也可能同时恶化市场变量与未来增长；本题尚未估计这种关系。', counterfactualOrFailure: '真实预注册OOS记录通过后才可授予预测候选；具体外生处理、支持集、推断和排除限制闭合后，才可讨论identified-candidate。',
    primarySectionId: 'prediction-not-causation', remediationSectionIds: ['prediction-target', 'claim-ladder'], sourceIds: [1, 8, 11, 16], numericAssertions: [{ key: 'forecast', expected: -1.2, unit: 'synthetic percentage points' }, { key: 'prediction', expected: 'not-estimated', unit: 'status' }, { key: 'causal', expected: 'not-claimed', unit: 'status' }],
    staticTwin: { id: 'K8', synthetic: true, title: '另一条合成算术规则', prompt: 'SYNTHETIC系数−0.6、SYNTHETIC FCI=2，且没有经验OOS或外生设计；最强结论？', choices: three('合成算术−1.2pp；既非已验证预测也非因果效应', '已识别因果效应−1.2pp', '经验预测已验证为+1.2pp'), correct: 'a', calculations: ['SYNTHETIC算术：−0.6×2=−1.2pp。', 'empirical prediction=not estimated；causal=not claimed。'], answer: 'A。只授予可复算的合成算术身份。', judgment: '不是经验预测，更不是处理效应。', causalExplanation: '系数是教学设定，没有由真实样本估计；共同信息问题也尚未进入识别。', counterfactualOrFailure: '只有真实预注册OOS记录通过，才能另行升级预测身份。', sourceIds: [8, 11], numericAssertions: [{ key: 'forecast', expected: -1.2, unit: 'synthetic percentage points' }, { key: 'prediction', expected: 'not-estimated', unit: 'status' }] },
  },
  {
    id: 'M9', mode: 'interpretation', label: 'Policy reaction', synthetic: true,
    title: '政策率贡献−0.4，信用+0.8、股票+0.5、美元+0.2。政策放松能否与总体金融条件收紧同时发生？',
    brief: '央行可能正是在其他金融条件和经济前景恶化时降息。',
    facts: [{ label: 'policy-rate lane', value: '−0.4', note: '指向宽松。' }, { label: 'other lanes', value: '+1.5 combined', note: '信用、股票与美元合计。' }],
    formulas: ['total FCI = policy-related contribution + other endogenous contributions'], formulaUnits: 'index points；分项不是结构冲击。',
    options: [{ id: 'a', label: '可以；净FCI为+1.1，政策行动与总体状态可异号。', diagnosis: '正确：政策利率只是金融条件的一项，而且政策会内生反应。' }, { id: 'b', label: '不可以；净FCI为−1.9。', diagnosis: '请按给定符号相加，其他三项合计为+1.5。' }, { id: 'c', label: '不可以；降息定义上保证全部金融条件宽松。', diagnosis: '信用风险、股价和美元可以压过政策率贡献。' }],
    correct: 'a', calculation: '−0.4+0.8+0.5+0.2=+1.1。', judgment: '政策放松与总体金融条件收紧并存。', causalExplanation: '政策可能响应同一坏消息；市场风险溢价、预期和全球冲击也独立移动。', counterfactualOrFailure: '只有把政策冲击与内生反应分开，才能讨论政策导致的金融条件变化。',
    primarySectionId: 'fci-policy-stress-cycle', remediationSectionIds: ['prediction-not-causation', 'index-families'], sourceIds: [1, 7, 16], numericAssertions: [{ key: 'total', expected: 1.1, unit: 'index points' }],
    staticTwin: { id: 'K9', synthetic: true, title: '另一组政策与市场异号', prompt: '政策组件−0.5，其他金融组件合计+0.9；总体和含义？', choices: three('−1.4', '+0.4，政策行动放松但金融条件净收紧', '两者必同号'), correct: 'b', calculations: ['−0.5+0.9=+0.4。'], answer: 'B。政策组件与总体状态并非同义词。', judgment: '净金融条件收紧。', causalExplanation: '市场与中介状态可以压过政策率的宽松贡献。', counterfactualOrFailure: '总和不识别每个分项为何变化。', sourceIds: [1, 7], numericAssertions: [{ key: 'total', expected: 0.4, unit: 'index points' }] },
  },
  {
    id: 'M10', mode: 'interpretation', label: 'Official FCI-G boundary', synthetic: false,
    title: '官方FCI-G最新CSV观测为−0.877pp，股票贡献−0.669pp。最窄且完整的解释是什么？',
    brief: '这是2026-07-31的baseline三年回看研究产品快照；正值为未来一年增长逆风，负值为尾风。',
    facts: [{ label: 'FCI-G total', value: '−0.877331pp', note: '七项贡献闭合。' }, { label: 'equity contribution', value: '−0.668908pp', note: '该期绝对值最大的分项。' }, { label: 'identity', value: 'model-based rule-of-thumb', note: '已观察金融变量变化可能内生。' }],
    formulas: ['FCI-G = Σ variable Σ lag multiplier × observed change'], formulaUnits: '对未来一年实际GDP增长的百分点尾风/逆风映射；不是实现值。',
    options: [{ id: 'a', label: '美国未来一年GDP必然多增长0.877%。', diagnosis: 'FCI-G是模型rule-of-thumb，不是确定预测或实现值。' }, { id: 'b', label: '美联储政策已被因果识别为提升增长0.877pp。', diagnosis: '官方方法明确提醒金融变量变化可能内生，指数不是政策冲击。' }, { id: 'c', label: '在该模型与三年回看规则下，已观察条件构成约0.877pp增长尾风；股票是最大分项，但不能作政策因果解释。', diagnosis: '正确：保留单位、时点、模型用途、贡献与内生性边界。' }],
    correct: 'c', calculation: '七项贡献之和=−0.877331pp；股票=−0.668908pp，按绝对值为该快照最大贡献。', judgment: '描述性的增长尾风rule-of-thumb，不是政策冲击。', causalExplanation: 'FCI-G把已观察变化视同外生来做模型映射，但这些变化本身受宏观、政策和市场共同决定。', counterfactualOrFailure: '若贷款标准与条款向相反方向变化，FCI-G可能遗漏关键融资条件；研究前还要刷新vintage。',
    primarySectionId: 'fci-g', remediationSectionIds: ['prediction-not-causation', 'component-contribution'], sourceIds: [1, 2], numericAssertions: [{ key: 'total', expected: -0.87733131640446, unit: 'percentage points' }, { key: 'equity', expected: -0.668907837539753, unit: 'percentage points' }],
    staticTwin: { id: 'K10', synthetic: false, title: '另一官方日期的FCI-G边界', prompt: '官方2022-12-30 FCI-G为+0.999349pp，按绝对值最大分项是Mortgage +0.497281pp。最窄解释是什么？', choices: three('美国GDP必然少增长0.999349%', '已识别的加息政策造成0.999349pp增长损失', '在该模型与三年回看规则下构成约0.999349pp增长逆风；Mortgage为最大分项，但不是政策因果效应'), correct: 'c', calculations: ['七项官方贡献之和=+0.999348948pp。', '|Mortgage +0.497281178|大于其余六项绝对贡献。'], answer: 'C。保留日期、单位、模型、分项与非因果边界。', judgment: '这是官方研究产品的模型增长逆风快照。', causalExplanation: '已观察金融变量由宏观消息、政策反应与市场共同决定，FCI-G映射不识别这些来源。', counterfactualOrFailure: 'FCI-G遗漏贷款标准与条款；若银行可得性反向变化，市场七项快照不完整。', sourceIds: [1, 2], numericAssertions: [{ key: 'total', expected: 0.999348948059591, unit: 'percentage points' }, { key: 'mortgage', expected: 0.49728117780608, unit: 'percentage points' }] },
  },
];

const m5Realtime = populationStandardScore([100, 102, 104, 106, 108], 4);
const m5Full = populationStandardScore([100, 102, 104, 106, 108, 120, 130, 140], 4);
const k5Realtime = populationStandardScore([1, 2, 3], 2);
const k5Full = populationStandardScore([1, 2, 3, 7, 9], 2);

const computed: Record<string, number | string | boolean | null | undefined> = {
  'M1.score': (1 + 2 - 1 + 0.5) / 4,
  'K1.score': (-0.5 + 1.5 + 1 + 0) / 4,
  'M2.ratio': (50 / 25) / (50 / 100),
  'K2.loan': 25 / 50, 'K2.credit': 40 / 20,
  'M3.equal': (1 + 2 - 1 + 0.5) / 4, 'M3.credit-heavy': 0.15 * 1 + 0.55 * 2 + 0.15 * -1 + 0.15 * 0.5,
  'K3.equal': (-1 + 2 + 0 + 1) / 4, 'K3.dollar': 0.1 * -1 + 0.2 * 2 + 0.1 * 0 + 0.6 * 1,
  'M4.naive': (0 + 2 + 2 + 0 + 0) / 5, 'M4.block': (0 + 2 + 0 + 0) / 4,
  'K4.naive': (1 + 1 + 0 + 0 + 0) / 5, 'K4.block': (1 + 0 + 0 + 0) / 4,
  'M5.realtime': m5Realtime?.score, 'M5.full': m5Full?.score,
  'K5.realtime': k5Realtime?.score, 'K5.full': k5Full?.score,
  'M6.approval-drop': 70 - 40, 'M6.amount-drop': 80 - 40,
  'K6.approval-drop': 80 - 50,
  'M7.stock': 0.8 * 1.5 + 0.2 * -0.5, 'M7.applicant': 0.2 * 1.5 + 0.8 * -0.5,
  'K7.before': 0.8 * -1 + 0.2 * 2, 'K7.after': 0.2 * -1 + 0.8 * 2,
  'M8.forecast': -0.8 * 1.5, 'M8.prediction': 'not-estimated', 'M8.causal': 'not-claimed',
  'K8.forecast': -0.6 * 2, 'K8.prediction': 'not-estimated',
  'M9.total': -0.4 + 0.8 + 0.5 + 0.2,
  'K9.total': -0.5 + 0.9,
  'M10.total': -0.87733131640446, 'M10.equity': -0.668907837539753,
  'K10.total': 0.999348948059591, 'K10.mortgage': 0.49728117780608,
};

const approximately = (actual: number, expected: number, tolerance = 1e-8) => Math.abs(actual - expected) <= tolerance;
const countAnswerPositions = (answers: FinancialConditionsChoice[]) => answers.reduce<Record<FinancialConditionsChoice, number>>((counts, answer) => ({ ...counts, [answer]: counts[answer] + 1 }), { a: 0, b: 0, c: 0 });
const hasThreeThreeFourDistribution = (counts: Record<FinancialConditionsChoice, number>) => Object.values(counts).sort((left, right) => left - right).join(',') === '3,3,4';

export const financialConditionsNumericAssertionAudit = financialConditionsScenarios.flatMap((scenario) => [
  ...scenario.numericAssertions.map((assertion) => ({ scenarioId: scenario.id, ...assertion })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({ scenarioId: scenario.staticTwin.id, ...assertion })),
]).map((assertion) => {
  const actual = computed[`${assertion.scenarioId}.${assertion.key}`];
  const passed = typeof assertion.expected === 'number'
    ? typeof actual === 'number' && approximately(actual, assertion.expected, assertion.tolerance)
    : actual === assertion.expected;
  return { ...assertion, actual, passed };
});

const mainAnswerPositionCounts = countAnswerPositions(financialConditionsScenarios.map(({ correct }) => correct));
const staticAnswerPositionCounts = countAnswerPositions(financialConditionsScenarios.map(({ staticTwin }) => staticTwin.correct));

export const financialConditionsScenarioAssertions = [
  { key: 'exactly-ten-scenarios', passed: financialConditionsScenarios.length === 10 },
  { key: 'five-per-mode', passed: financialConditionsModes.every((mode) => financialConditionsScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { key: 'm1-m10', passed: financialConditionsScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { key: 'k1-k10', passed: financialConditionsScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { key: 'unique-three-choice', passed: financialConditionsScenarios.every(({ options, staticTwin }) => options.length === 3 && new Set(options.map(({ id }) => id)).size === 3 && staticTwin.choices.length === 3 && new Set(staticTwin.choices.map(({ id }) => id)).size === 3) },
  { key: 'answers-exist', passed: financialConditionsScenarios.every(({ options, correct, staticTwin }) => options.some(({ id }) => id === correct) && staticTwin.choices.some(({ id }) => id === staticTwin.correct)) },
  { key: 'm-answer-positions-3-3-4', passed: hasThreeThreeFourDistribution(mainAnswerPositionCounts) },
  { key: 'k-answer-positions-3-3-4', passed: hasThreeThreeFourDistribution(staticAnswerPositionCounts) },
  { key: 'static-answer-letter-sync', passed: financialConditionsScenarios.every(({ staticTwin }) => staticTwin.answer.startsWith(`${staticTwin.correct.toUpperCase()}。`)) },
  { key: 'm-nine-synthetic-one-official', passed: financialConditionsScenarios.filter(({ synthetic }) => synthetic).length === 9 && financialConditionsScenarios.find(({ id }) => id === 'M10')?.synthetic === false },
  { key: 'k-nine-synthetic-one-official', passed: financialConditionsScenarios.filter(({ staticTwin }) => staticTwin.synthetic).length === 9 && financialConditionsScenarios.find(({ id }) => id === 'M10')?.staticTwin.synthetic === false },
  { key: 'judgment-causal-counterfactual', passed: financialConditionsScenarios.every(({ judgment, causalExplanation, counterfactualOrFailure, staticTwin }) => [judgment, causalExplanation, counterfactualOrFailure, staticTwin.judgment, staticTwin.causalExplanation, staticTwin.counterfactualOrFailure].every((text) => text.trim().length > 0)) },
  { key: 'all-numeric-assertions-pass', passed: financialConditionsNumericAssertionAudit.every(({ passed }) => passed) },
] as const;

if (!financialConditionsScenarioAssertions.every(({ passed }) => passed)) throw new Error(`3.13 scenario structure gate failed: ${financialConditionsScenarioAssertions.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
if (!financialConditionsNumericAssertionAudit.every(({ passed }) => passed)) throw new Error(`3.13 scenario numeric gate failed: ${financialConditionsNumericAssertionAudit.filter(({ passed }) => !passed).map(({ scenarioId, key }) => `${scenarioId}.${key}`).join(', ')}`);
