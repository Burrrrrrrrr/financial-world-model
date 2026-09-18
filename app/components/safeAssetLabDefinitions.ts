import {
  safeAssetCanonicalInputs,
  safeAssetEvaluators,
  safeAssetExactToNumber,
  safeAssetFixtureAudit,
  safeAssetRawDomains,
} from './safeAssetFixtures';
import type {
  SafeAssetExactQuantity,
  SafeAssetLabId,
  SafeAssetNumericDomain,
} from './safeAssetFixtures';

export type SafeAssetDisplay =
  | Readonly<{ status: 'STOP'; reason: string }>
  | Readonly<{ status: 'OK'; rows: readonly (readonly [string, string])[] }>;

export type SafeAssetNumberField = Readonly<{
  kind: 'integer' | 'decimal';
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  scale: 1 | 10 | 100 | 1_000 | 10_000;
}>;

export type SafeAssetSelectField = Readonly<{
  kind: 'select';
  key: string;
  label: string;
  options: readonly Readonly<{ value: string; label: string }>[];
}>;

export type SafeAssetField = SafeAssetNumberField | SafeAssetSelectField;

export type SafeAssetChartSpec = Readonly<{
  kind:
    | 'service-vector-bars'
    | 'matched-yield-gap'
    | 'collateral-funnel'
    | 'capacity-funnel'
    | 'nonmonotonic-supply'
    | 'dual-instrument-bridge';
  xLabel: string;
  yLabel: string;
  series: readonly Readonly<{ key: string; label: string; axis: 'primary' | 'secondary' }>[];
  invariant: string;
  zeroIsMeaningful: boolean;
}>;

export type SafeAssetLab = Readonly<{
  id: SafeAssetLabId;
  title: string;
  coreMechanism: string;
  question: string;
  passport: string;
  syntheticNotice: string;
  sourceIds: readonly number[];
  initial: Readonly<Record<string, unknown>>;
  fields: readonly SafeAssetField[];
  display: (input: unknown) => SafeAssetDisplay;
  staticResult: SafeAssetDisplay;
  formula: readonly string[];
  chartKind: SafeAssetChartSpec['kind'];
  chartSpec: SafeAssetChartSpec;
  defaultRebuild: string;
  changeCondition: string;
  extremes: readonly string[];
  misconception: string;
  counterexample: string;
  unknownWarning: string;
  invariants: readonly string[];
}>;

export function safeAssetNumber(value: number): string {
  if (!Number.isFinite(value) || Object.is(value, -0)) throw Error('安全资产实验展示只接受有限且非负零的数。');
  return (value === 0 ? '0' : String(Number(value.toPrecision(12)))).replace('-', '−');
}

function bigintGcd(a: bigint, b: bigint): bigint {
  let x = a < BigInt(0) ? -a : a;
  let y = b < BigInt(0) ? -b : b;
  while (y !== BigInt(0)) { const remainder = x % y; x = y; y = remainder; }
  return x;
}

function exactText(quantity: SafeAssetExactQuantity): string {
  const numerator = BigInt(quantity.numerator);
  const denominator = BigInt(quantity.denominator);
  const divisor = bigintGcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  const fraction = reducedDenominator === BigInt(1)
    ? reducedNumerator.toString()
    : `${reducedNumerator}/${reducedDenominator}`;
  const normalized = fraction.replace('-', '−');
  return reducedDenominator === BigInt(1) ? normalized : `${normalized} ≈ ${safeAssetNumber(safeAssetExactToNumber(quantity))}`;
}

type LooseOk = Readonly<{
  status: 'OK';
  value: Readonly<Record<string, unknown>>;
  exact: Readonly<Record<string, SafeAssetExactQuantity | undefined>>;
}>;

const dimensionLabels: Readonly<Record<string, string>> = Object.freeze({
  creditSafety: '信用安全',
  nominalPriceStability: '名义价格稳定',
  marketLiquidity: '市场流动性',
  legalOperationalAccess: '法律与操作可达性',
  collateralUsability: '抵押品可用性',
  badStatePerformance: '坏状态表现',
});

function valueText(result: LooseOk, key: string): string {
  const value = result.value[key];
  const exactValue = result.exact[key];
  if (value === null) return 'unknown／未识别（不是0）';
  if (exactValue) return exactText(exactValue);
  if (typeof value === 'number') return safeAssetNumber(value);
  if (typeof value === 'boolean') return value ? '是（仅在SYN题设内）' : '否（仅在SYN题设内）';
  if (typeof value === 'string') return dimensionLabels[value] ?? value;
  if (Array.isArray(value)) return value.length === 0
    ? '无（全部声明条件已通过）'
    : value.map(item => typeof item === 'string' ? (dimensionLabels[item] ?? item) : String(item)).join('、');
  if (value && typeof value === 'object') {
    return Object.entries(value).map(([name, score]) => `${dimensionLabels[name] ?? name} ${safeAssetNumber(Number(score))}`).join('；');
  }
  throw Error(`未声明展示规则：${key}`);
}

const fieldLabels: Record<SafeAssetLabId, Readonly<Record<string, string>>> = {
  C1: {
    useCase: '用途（严格枚举）', marketState: '市场状态（严格枚举）',
    creditSafety: '信用安全服务（SYN分）', nominalPriceStability: '名义价格稳定服务（SYN分）',
    marketLiquidity: '市场流动性服务（SYN分）', legalOperationalAccess: '法律与操作可达性（SYN分）',
    collateralUsability: '抵押品可用性（SYN分）', badStatePerformance: '坏状态表现（SYN分）',
  },
  C3: {
    comparatorYieldPct: '匹配比较资产收益率（SYN %）', serviceAssetYieldPct: '服务资产收益率（SYN %）',
    currencyMatch: '币种匹配', maturityMatch: '期限匹配', cashflowMatch: '现金流匹配',
    creditMatch: '信用风险匹配', taxMatch: '税收匹配', hedgeCostMatch: '套保成本匹配',
  },
  C5: {
    pricePerUnit: '单位市价P（SYN金额）', quantity: '名义数量Q（SYN单位）',
    eligibilityPct: '设施资格比例（SYN %）', availabilityPct: '未占用且可及时调用比例（SYN %）',
    haircutPct: 'haircut（SYN %）',
  },
  C6: {
    grossOutstanding: '毛未偿余额（SYN金额）', availablePct: '实际可提供比例（SYN %）',
    eligiblePct: '目标设施合格比例（SYN %）', unencumberedPct: '未质押且操作可达比例（SYN %）',
    marketCapacityPct: '给定冲击下市场承接比例（SYN %）',
  },
  C7: {
    issuedQuantity: '当前发行量Q（SYN单位）', baseDepthServiceBps: '零发行时深度服务（SYN bp）',
    depthGainBpsPerUnit: '每单位深度增益（SYN bp/单位）', constraintTriggerQuantity: '约束触发量（SYN单位）',
    erosionBpsPerExcessUnit: '超出后每单位可信服务侵蚀（SYN bp/单位）',
  },
  C8: {
    openingCurrencyValue: '期初币种总市场价值（SYN金额）', principalTransactions: '本金工具净交易T（SYN金额）',
    incomeReinvestment: '应计/再投资收益I（SYN金额）', fxValuation: '汇率估值FX（SYN金额）',
    priceValuation: '工具价格估值P（SYN金额）', coverageChange: '覆盖/重分类/修订C（SYN金额）',
    pathADepositValue: '路径A存款价值（SYN金额）', pathABondQuantity: '路径A债券数量（SYN单位）',
    pathABondPrice: '路径A债券单价（SYN金额）', pathAOtherClaimsValue: '路径A其他债权价值（SYN金额）',
    pathBDepositValue: '路径B存款价值（SYN金额）', pathBBondQuantity: '路径B债券数量（SYN单位）',
    pathBBondPrice: '路径B债券单价（SYN金额）', pathBOtherClaimsValue: '路径B其他债权价值（SYN金额）',
  },
};

const rowKeys: Record<SafeAssetLabId, readonly (readonly [string, string])[]> = {
  C1: [
    ['用途—状态键', 'contextKey'], ['六维服务向量', 'serviceVector'], ['独立维度数量', 'independentDimensionCount'],
    ['本状态优先维度', 'priorityDimensions'], ['优先维度数量', 'priorityDimensionCount'],
    ['全向量最低维度', 'lowestDimension'], ['全向量最低分', 'lowestScore'],
    ['优先维度最低项', 'priorityLowestDimension'], ['优先维度最低分', 'priorityLowestScore'],
    ['单一“安全”标签', 'singleSafetyLabel'], ['单一综合分数', 'singleCompositeScore'],
  ],
  C3: [
    ['比较资产收益率', 'comparatorYieldPct'], ['服务资产收益率', 'serviceAssetYieldPct'],
    ['匹配后便利收益候选', 'convenienceYieldBps'], ['通过匹配维度', 'matchedDimensionCount'],
    ['已声明匹配失败项', 'failedDeclaredMatchDimensions'], ['六项声明控制门是否全部通过', 'declaredMatchGatesPassed'],
  ],
  C5: [
    ['毛市场价值', 'grossMarketValue'], ['资格调整后价值', 'eligibilityAdjustedValue'],
    ['资格且可用价值', 'availableEligibleValue'], ['haircut后现金能力', 'cashCapacity'],
    ['haircut扣减', 'haircutDeduction'], ['是否推断对手方愿意成交', 'counterpartyWillingnessInferred'],
  ],
  C6: [
    ['毛未偿余额', 'grossOutstanding'], ['实际可提供容量', 'availableCapacity'],
    ['设施合格容量', 'eligibleCapacity'], ['未质押且操作可达容量', 'unencumberedCapacity'],
    ['市场承接后Qeff', 'qEff'], ['总容量损耗', 'totalCapacityLoss'], ['毛余额留存率', 'retentionPct'],
  ],
  C7: [
    ['当前发行量', 'issuedQuantity'], ['深度服务', 'depthServicePct'], ['可信服务', 'credibilityServicePct'],
    ['约束后的每单位服务', 'bindingServicePct'], ['当前有效安全服务容量', 'effectiveSafeCapacity'],
    ['离散图示峰值横坐标', 'illustrativeGridPeakQuantity'], ['离散图示峰值容量', 'illustrativeGridPeakCapacity'],
    ['曲线是否先升后降', 'curveTurnsDown'], ['是否估计现实阈值', 'realWorldThresholdEstimated'],
    ['是否计算政策最优', 'policyOptimumComputed'],
  ],
  C8: [
    ['期末币种总市场价值', 'closingCurrencyValue'], ['总额存量桥变化', 'bridgeChange'],
    ['路径A债券价值', 'pathABondValue'], ['路径A总价值', 'pathATotalValue'],
    ['路径B债券价值', 'pathBBondValue'], ['路径B总价值', 'pathBTotalValue'],
    ['路径A桥残差', 'pathABridgeGap'], ['路径B桥残差', 'pathBBridgeGap'],
    ['两路径债券数量差', 'bondQuantityDifference'], ['币种总额是否等价', 'aggregateValuesEquivalent'],
    ['是否识别特定债券数量', 'specificBondQuantityIdentified'], ['已识别债券数量', 'identifiedBondQuantity'],
  ],
};

const syntheticNotice = '全部参数、曲线、工具路径、时钟与阈值均为作者SYN教学输入；不是现实发行者、真实币种、市场报价、point-in-time（PIT，历史时点当时可得）资料、out-of-sample（OOS，样本外）证据、因果估计、政策反事实或交易建议。';

const chartSpecs: Record<SafeAssetLabId, SafeAssetChartSpec> = {
  C1: {
    kind: 'service-vector-bars', xLabel: '相互独立的服务维度', yLabel: '作者SYN服务分（0–100）',
    series: [{ key: 'serviceVector', label: '条件服务向量', axis: 'primary' }],
    invariant: '六维使用同一题设内的序数教学尺并始终分别绘制；只允许在单一C1情景内逐维定位约束，不跨资产、跨情景排序，也不产生综合“安全分”或永久标签。', zeroIsMeaningful: true,
  },
  C3: {
    kind: 'matched-yield-gap', xLabel: '已匹配资产', yLabel: '作者SYN收益率（%）与差值（bp）',
    series: [
      { key: 'comparatorYieldPct', label: '匹配比较资产', axis: 'primary' },
      { key: 'serviceAssetYieldPct', label: '服务资产', axis: 'primary' },
      { key: 'convenienceYieldBps', label: '收益率楔子', axis: 'secondary' },
    ],
    invariant: '任一匹配开关失败即STOP，图表不得留下旧的便利收益数值，也不得把污染后的原始利差换名继续展示。', zeroIsMeaningful: true,
  },
  C5: {
    kind: 'collateral-funnel', xLabel: '抵押品现金化步骤', yLabel: '作者SYN价值',
    series: [
      { key: 'grossMarketValue', label: '价格×数量', axis: 'primary' },
      { key: 'eligibilityAdjustedValue', label: '设施合格', axis: 'primary' },
      { key: 'availableEligibleValue', label: '合格且可用', axis: 'primary' },
      { key: 'cashCapacity', label: 'haircut后现金', axis: 'primary' },
    ],
    invariant: '每层只能不增；结果不推断交易对手成交意愿、期限、margin或法律执行。', zeroIsMeaningful: true,
  },
  C6: {
    kind: 'capacity-funnel', xLabel: '毛余额到有效容量的过滤层', yLabel: '作者SYN容量',
    series: [
      { key: 'grossOutstanding', label: '毛余额', axis: 'primary' },
      { key: 'availableCapacity', label: '可提供', axis: 'primary' },
      { key: 'eligibleCapacity', label: '合格', axis: 'primary' },
      { key: 'unencumberedCapacity', label: '未占用且可达', axis: 'primary' },
      { key: 'qEff', label: '市场承接后Qeff', axis: 'primary' },
    ],
    invariant: '各比例均为0–100%的独立作者系数，绝不替换为某国现实债务余额后自称实测容量。', zeroIsMeaningful: true,
  },
  C7: {
    kind: 'nonmonotonic-supply', xLabel: '作者SYN毛发行量', yLabel: '作者SYN有效服务容量',
    series: [
      { key: 'effectiveSafeCapacity', label: '有效安全服务容量', axis: 'primary' },
      { key: 'depthServicePct', label: '深度服务条件', axis: 'secondary' },
      { key: 'credibilityServicePct', label: '可信服务条件', axis: 'secondary' },
    ],
    invariant: '固定0–200教学网格只展示“可能非单调”；峰值不是现实阈值、最优发行量或债务可持续性结论。', zeroIsMeaningful: true,
  },
  C8: {
    kind: 'dual-instrument-bridge', xLabel: '同一币种总额的两条工具路径', yLabel: '作者SYN期末市场价值',
    series: [
      { key: 'pathATotalValue', label: '路径A总值', axis: 'primary' },
      { key: 'pathBTotalValue', label: '路径B总值', axis: 'primary' },
      { key: 'bondQuantityDifference', label: '债券数量差', axis: 'secondary' },
    ],
    invariant: '两条路径必须无残差闭合同一币种总额，同时保留不同债券数量；聚合相等不创造工具识别。', zeroIsMeaningful: true,
  },
};

const copy: Record<SafeAssetLabId, Omit<SafeAssetLab, 'id' | 'initial' | 'fields' | 'display' | 'staticResult' | 'chartKind' | 'chartSpec'>> = {
  C1: {
    title: '安全是一组随用途和状态变化的服务',
    coreMechanism: '同一债权可同时提供六种程度不同的服务；用途与状态改变关注维度，却不能把向量压成永久标签。',
    question: '一项资产信用分很高，为什么仍不能直接盖上“安全”标签？',
    passport: '独立SYN服务向量；六维共用作者序数教学尺：0表示题设内该维服务不存在，100表示题设内作者上界，只能在同一C1情景内逐维寻找约束。分差不是可测距离，不得跨资产、跨情景或跨现实样本排名。没有现实发行者、评级、概率、市场价格或共同基线。',
    syntheticNotice, sourceIds: [1, 2, 7, 12, 13, 14],
    formula: ['S(u,s)=(credit, nominal, liquidity, access, collateral, bad-state)', 'singleSafetyLabel=not-defined'],
    defaultRebuild: '默认是干预用途、压力状态；六维为95/80/72/90/65/60。压力干预优先看名义稳定、市场流动性、法律与操作可达、坏状态表现四维；其中坏状态60最低。程序保留全部六维，并把单一标签与综合分留为null。',
    changeCondition: '只切换用途或状态会改变优先维度集合，不改写原始六维；改变某一服务分也不会自动推导其余五维。',
    extremes: ['某一维为0时只说明该项SYN服务为0，不把所有维度归零。', '六维都为100仍不等于现实永久无风险。', 'NORMAL切到STRESS会加入坏状态维度，但不改变给定服务分。'],
    misconception: '低违约风险不是市场深度、法律可达、抵押资格或压力期表现的充分证明。',
    counterexample: '信用服务95的债权若坏状态表现只有60，仍不能凭信用一维推出干预或保证金时可无损调用。',
    unknownWarning: '现实主体、用途、状态概率、期限、价格风险、法律辖区、设施资格、可出售规模和六维测量方法均未知。',
    invariants: ['始终保留六个独立维度。', '0–100只是在单一C1情景内逐维定位约束的共同序数尺，不作跨资产或跨情景比较。', '用途—状态只选择关注维度，不生成加权平均。', 'singleSafetyLabel与singleCompositeScore始终为null。'],
  },
  C3: {
    title: '先通过六项匹配，再计算便利收益候选',
    coreMechanism: '先登记故意保留的安全、流动与抵押目标服务，再尽量匹配币种、期限、现金流、信用、税和套保成本六个非目标维度，收益差才有资格被称为该服务组合的价格候选。',
    question: '比较资产4.75%、服务资产4.55%时，何时可以报告20bp便利收益候选？',
    passport: '独立SYN两资产静态比较；目标服务组合、收益率和六项非目标匹配开关均为作者题设。没有现实报价、期限结构、可交易性、估计误差或官方储备动机。',
    syntheticNotice, sourceIds: [8, 9],
    formula: ['CY_bps=100×(y_comparator−y_service)', '任一match=MISMATCH → STOP'],
    defaultRebuild: '六个声明控制门全部通过时，4.75%−4.55%=0.20个百分点=20bp；这只允许显示目标服务组合的便利收益候选，不证明残余楔子纯净。若期限等任一控制门不匹配，程序列出失败项并STOP，不显示便利收益候选。',
    changeCondition: '收益率改变会线性改变匹配后楔子，楔子允许为负；任一匹配状态改变为MISMATCH会清空全部数值结果。',
    extremes: ['两收益率相等时CY=0，而不是缺失。', '比较资产收益更低时CY可以为负。', '任一开关不匹配即STOP，不能以“近似”绕过。'],
    misconception: '任意国债—公司债或跨币种收益差都不能直接命名为便利收益候选，更不是纯量。',
    counterexample: '4.75%与4.55%的20bp差若来自期限或套保成本不同，就是混合量；同一个算术差没有相同经济解释。',
    unknownWarning: '现实中完全匹配通常困难；目标服务必须预先登记，监管需求、期限溢价、对冲基差、未纳入目标的流动性差异和估计误差仍可能污染楔子。',
    invariants: ['目标服务与非目标控制的边界必须预先登记，六项非目标匹配必须全部为MATCH。', 'bp换算严格使用1个百分点=100bp。', '允许负CY且不将其钳成0。'],
  },
  C5: {
    title: '抵押品怎样逐层变成可用现金',
    coreMechanism: '市价与数量先形成毛价值，再经过资格、可用性和haircut三层过滤得到即时现金能力。',
    question: '名义上可抵押的资产，为什么只能换得毛市场价值的一部分现金？',
    passport: '独立SYN单设施算术；价格、数量、资格、可用比例与haircut都由作者给定。没有期限、追加保证金通知（margin call）、集中度、法律执行或对手方意愿。',
    syntheticNotice, sourceIds: [12, 13],
    formula: ['cash=P×Q×eligibility×availability×(1−haircut)'],
    defaultRebuild: '100.25×1000=100250；资格90%后90225；可用80%后72180；haircut 5%扣减3609，现金能力=68571。每一步都精确使用有理数，不由显示舍入回写。',
    changeCondition: '价格、数量或任一比例只沿本漏斗改变现金能力；本实验不会因为数值较高就推断交易对手愿意成交。',
    extremes: ['资格或可用性为0时现金能力为0。', 'haircut=100%时现金能力为0。', 'haircut=0且资格、可用性均100%时现金能力等于P×Q。'],
    misconception: '“可作抵押”既不等于整个数量合格，也不等于没有haircut，更不等于一定成交。',
    counterexample: '相同100250毛价值，在90%资格、80%可用与5% haircut下只能形成68571现金能力。',
    unknownWarning: '现实设施资格、已质押状态、集中度限额、结算时点、压力haircut、追加保证金与法律可执行性均未观测。资格未知会STOP；已知资格比例为0%则现金能力是经济零。',
    invariants: ['三个比例均在0–100%；已知0%是可计算的经济零，不等于unknown。', '漏斗各层非增。', 'counterpartyWillingnessInferred固定为false。'],
  },
  C6: {
    title: '毛余额经过四层过滤才成为Qeff',
    coreMechanism: '未偿余额只在漏斗入口；可提供、合格、未占用可达和市场承接分别损耗有效容量。',
    question: '1000毛余额为什么在默认条件下只剩432有效容量？',
    passport: '独立SYN容量漏斗；四个0–100%比例是作者教学系数，不对应任何国家、设施或日期，也不是官方安全资产容量指标。',
    syntheticNotice, sourceIds: [1, 7, 12, 13, 14],
    formula: ['Qeff=Qout×a_available×a_eligible×a_unencumbered×a_market'],
    defaultRebuild: '1000→800（可提供80%）→720（合格90%）→540（未占用可达75%）→432（市场承接80%）；总损耗568，留存率43.2%。',
    changeCondition: '任一比例下降只会压低其后所有层；比例恢复100%只移除该层损耗，不补偿其他层。',
    extremes: ['四层均100%时Qeff等于毛余额。', '任一层为0时Qeff为0。', '毛余额为0时容量和损耗均为0，但留存率是0/0而显示unknown／null，不伪装成经济零。'],
    misconception: '毛政府债务、可交易余额、自由流通量、设施合格量与压力期可变现量不是同一个存量。',
    counterexample: '1000毛余额即使有80%可提供，经过资格、占用和市场承接后仍只有432，而不是800或1000。',
    unknownWarning: '现实free float、持有者异质性、重复质押、期限、流通速度、交易商资产负债表与压力价格冲击均未知。',
    invariants: ['每一层容量不高于前一层。', 'Qeff与总损耗精确相加为毛余额。', '所有系数只属于本实验且不得现实校准。'],
  },
  C7: {
    title: '供给先增厚容量，约束后可能侵蚀每单位服务',
    coreMechanism: '发行量增加可先改善深度；超过作者触发量后，可信服务条件下降并可能使有效容量转为下降。',
    question: '为什么“债务越多越安全”和“债务越多越危险”都不是无条件规律？',
    passport: '独立SYN分段曲线；0–200网格、深度增益、约束触发量与侵蚀斜率都是作者构造，不代表任何发行者或现实阈值。',
    syntheticNotice, sourceIds: [7, 8],
    formula: ['depth=min(10000,base+gain×Q)', 'credibility=max(0,10000−erosion×max(0,Q−trigger))', 'Qsafe=Q×min(depth,credibility)/10000'],
    defaultRebuild: '在固定20单位网格上，有效容量从0升到Q=100时的100，随后在Q=120/140降到84/56；默认Q=140时深度服务100%、可信服务40%，所以绑定服务40%、有效容量56。这个网格峰值只是图示，不是最优发行。',
    changeCondition: '增益斜率改变左段承载，触发量和侵蚀斜率改变右段约束；程序必须同时观察数量与每单位服务，不能只看发行量。',
    extremes: ['深度增益为0、侵蚀为0，或固定0–200网格未同时出现上升段与下降段时STOP，因为不再是本实验定义的非单调机制。', '约束前新增发行可提高有效容量。', '强侵蚀可把高发行量下的每单位服务压到0。'],
    misconception: '市场更深不保证财政、展期、做市或制度约束永远不绑定；约束存在也不意味着第一单位发行立即有害。',
    counterexample: '默认曲线中Q从80到100提高容量，但从120到140反而从84降到56；方向取决于哪条机制绑定。',
    unknownWarning: '现实财政空间、展期结构、交易商承接、机构可信度、需求、阈值、斜率、动态反馈与福利均未估计。',
    invariants: ['每单位服务被限制在0–100%。', '输出曲线必须至少有一段上升和一段下降。', 'realWorldThresholdEstimated与policyOptimumComputed固定为false。'],
  },
  C8: {
    title: '同一币种总额不能唯一识别工具数量',
    coreMechanism: '币种市场价值存量桥可由净交易、收益、FX、价格和覆盖共同变化；同一期末总额又可由不同存款与债券数量—价格组合构成。',
    question: '已知一个币种期末总市场价值，为什么仍不能反推出特定债券净买入或数量？',
    passport: '独立SYN币种总额与两条工具路径；不复制4.02现实COFER份额或币种值，不含匿名国家、真实证券代码、交易动机或官方工具分解。',
    syntheticNotice, sourceIds: [4, 5, 6],
    formula: ['V1=V0+Tprincipal+I+FX+P+C', 'Vpath=deposits+bondQuantity×bondPrice+otherClaims'],
    defaultRebuild: '币种总额从1000经+80本金交易、+10收益、−20 FX、+15价格与+5覆盖变为1090。路径A=300存款+500×1债券+290其他=1090；路径B=500存款+300×1.5债券+140其他=1090。总额相同但债券数量相差200，所以已识别数量保持null。',
    changeCondition: '任一桥项改变期末总额；两条工具路径都必须无残差闭合到新总额且保持不同债券数量，否则STOP。',
    extremes: ['所有桥项为0时总额可不变，但工具构成仍可不同。', '价格与数量可以反向变化而保持债券价值相同。', '任一路径残差非0或两条债券数量相同时STOP。'],
    misconception: '币种总市场价值上升不是特定国债数量净买入的同义词。',
    counterexample: '1090总额同时兼容500张单价1和300张单价1.5的债券路径；仅凭聚合总额无法选择其一。',
    unknownWarning: 'COFER不公开匿名报告者逐工具数量与完整交易—价格—收益—覆盖桥；现实缺失项必须为unknown，不能以0填补。',
    invariants: ['Tprincipal与I属于互斥分类口径，同一现金流不得双计；同一期汇总值可以同时非零。', '两条路径精确闭合且残差为0。', 'identifiedBondQuantity始终为null并与经济零分开。'],
  },
};

function display(id: SafeAssetLabId, input: unknown): SafeAssetDisplay {
  const evaluator = safeAssetEvaluators[id] as (candidate: unknown) =>
    | Readonly<{ status: 'STOP'; reason: string }>
    | LooseOk;
  const result = evaluator(input);
  if (result.status === 'STOP') return result;
  return { status: 'OK', rows: rowKeys[id].map(([label, key]) => [label, valueText(result, key)]) };
}

function numericFields(id: SafeAssetLabId): SafeAssetNumberField[] {
  return Object.entries(safeAssetRawDomains[id] as Readonly<Record<string, SafeAssetNumericDomain>>).map(([key, domain]) => ({
    kind: domain.kind, key, label: fieldLabels[id][key], min: domain.min, max: domain.max, step: domain.step, scale: domain.scale,
  }));
}

const matchOptions = Object.freeze([
  { value: 'MATCH', label: '已匹配' },
  { value: 'MISMATCH', label: '未匹配（将STOP）' },
]);

function fields(id: SafeAssetLabId): readonly SafeAssetField[] {
  const base: SafeAssetField[] = numericFields(id);
  if (id === 'C1') {
    base.unshift(
      {
        kind: 'select', key: 'marketState', label: fieldLabels.C1.marketState,
        options: [{ value: 'NORMAL', label: '常态' }, { value: 'STRESS', label: '压力状态' }],
      },
    );
    base.unshift({
      kind: 'select', key: 'useCase', label: fieldLabels.C1.useCase,
      options: [
        { value: 'INTERVENTION', label: '干预/紧急支付' },
        { value: 'COLLATERAL_FUNDING', label: '抵押融资' },
        { value: 'VALUE_PARKING', label: '价值停放' },
      ],
    });
  }
  if (id === 'C3') {
    (['currencyMatch', 'maturityMatch', 'cashflowMatch', 'creditMatch', 'taxMatch', 'hedgeCostMatch'] as const).forEach(key => {
      base.push({ kind: 'select', key, label: fieldLabels.C3[key], options: matchOptions });
    });
  }
  return Object.freeze(base);
}

export const safeAssetLabs: readonly SafeAssetLab[] = (Object.keys(safeAssetCanonicalInputs) as SafeAssetLabId[]).map(id => {
  const initial = safeAssetCanonicalInputs[id] as Readonly<Record<string, unknown>>;
  const chartSpec = chartSpecs[id];
  return {
    id,
    ...copy[id],
    initial,
    fields: fields(id),
    display: input => display(id, input),
    staticResult: display(id, initial),
    chartKind: chartSpec.kind,
    chartSpec,
  };
});

export const safeAssetLabAudit = [
  {
    key: 'six unique independent SYN labs expose canonical static and interactive equivalents',
    passed: safeAssetLabs.length === 6
      && new Set(safeAssetLabs.map(lab => lab.id)).size === 6
      && safeAssetLabs.every(lab => lab.initial === safeAssetCanonicalInputs[lab.id]
        && lab.staticResult.status === 'OK'
        && lab.display(lab.initial).status === 'OK'),
  },
  {
    key: 'all number fields retain bounded integer or exact finite-decimal contracts and selects retain strict unique enums',
    passed: safeAssetLabs.every(lab => lab.fields.every(field => field.kind === 'select'
      ? field.options.length >= 2 && new Set(field.options.map(option => option.value)).size === field.options.length
      : Number.isFinite(field.min) && Number.isFinite(field.max) && field.min <= field.max
        && field.step > 0 && Number.isSafeInteger(field.scale) && field.label.includes('SYN'))),
  },
  {
    key: 'every lab has a one-task chart spec finite static rows extremes and explicit evidence boundaries',
    passed: safeAssetLabs.every(lab => {
      const result = lab.staticResult;
      return result.status === 'OK' && result.rows.length === rowKeys[lab.id].length
        && result.rows.every(([label, value]) => label.length > 0 && value.length > 0)
        && lab.chartKind === lab.chartSpec.kind && lab.chartSpec.series.length > 0
        && lab.chartSpec.invariant.length >= 35 && lab.formula.length > 0
        && lab.extremes.length >= 3 && lab.invariants.length >= 3
        && lab.defaultRebuild.length >= 70 && lab.counterexample.length >= 35 && lab.unknownWarning.length >= 40;
    }),
  },
  {
    key: 'chart suite covers vector match cash funnel capacity funnel nonmonotonicity and dual identification exactly once',
    passed: new Set(safeAssetLabs.map(lab => lab.chartKind)).size === 6
      && safeAssetLabs.map(lab => lab.chartKind).join('|') === 'service-vector-bars|matched-yield-gap|collateral-funnel|capacity-funnel|nonmonotonic-supply|dual-instrument-bridge',
  },
  {
    key: 'all fixture mechanical checks pass without being treated as content approval',
    passed: safeAssetFixtureAudit.every(item => item.passed),
  },
] as const;

if (!safeAssetLabAudit.every(item => item.passed)) {
  throw new Error(`4.03 lab-definition gate failed: ${safeAssetLabAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
