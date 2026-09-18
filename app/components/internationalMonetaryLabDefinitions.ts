import {
  imsCanonicalInputs,
  imsEvaluators,
  imsRawDomains,
  internationalMonetaryExactToNumber,
  internationalMonetaryFixtureAudit,
  internationalMonetaryStatisticalPassports,
} from './internationalMonetaryFixtures';
import type {
  ExactQuantity,
  ImsLabId,
  IntegerDomain,
  StatisticalPassport,
} from './internationalMonetaryFixtures';

export type ImsDisplay =
  | Readonly<{ status: 'STOP'; reason: string }>
  | Readonly<{ status: 'OK'; rows: readonly (readonly [string, string])[] }>;

export type ImsNumberField = Readonly<{
  kind: 'integer';
  key: string;
  label: string;
  min: number;
  max: number;
  step: 1;
}>;

export type ImsSelectField = Readonly<{
  kind: 'select';
  key: string;
  label: string;
  options: readonly Readonly<{ value: string; label: string }>[];
}>;

export type ImsField = ImsNumberField | ImsSelectField;

export type ImsLab = Readonly<{
  id: ImsLabId;
  title: string;
  coreMechanism: string;
  question: string;
  passport: string;
  syntheticNotice: string;
  sourceIds: readonly number[];
  initial: Readonly<Record<string, unknown>>;
  fields: readonly ImsField[];
  display: (input: unknown) => ImsDisplay;
  formula: readonly string[];
  chartKind:
    | 'threshold-line'
    | 'passport-small-multiples'
    | 'route-cost-comparison'
    | 'fx-pair-network'
    | 'stock-waterfall'
    | 'valuation-waterfall'
    | 'hysteresis-timeline';
  defaultRebuild: string;
  changeCondition: string;
  extremes: readonly string[];
  misconception: string;
  counterexample: string;
  unknownWarning: string;
  invariants: readonly string[];
  statisticalPassports?: readonly StatisticalPassport[];
}>;

export function imsNumber(value: number): string {
  if (!Number.isFinite(value)) throw Error('国际货币实验展示只接受有限数。');
  return (value === 0 ? '0' : String(Number(value.toPrecision(12)))).replace('-', '−');
}

function bigintGcd(a: bigint, b: bigint): bigint {
  const zero = BigInt(0);
  let x = a < zero ? -a : a;
  let y = b < zero ? -b : b;
  while (y !== zero) { const remainder = x % y; x = y; y = remainder; }
  return x;
}

function exactText(quantity: ExactQuantity): string {
  const numerator = BigInt(quantity.numerator) * BigInt(quantity.scale);
  const denominator = BigInt(quantity.denominator);
  const divisor = bigintGcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  const fraction = reducedDenominator === BigInt(1)
    ? reducedNumerator.toString()
    : `${reducedNumerator}/${reducedDenominator}`;
  const normalized = fraction.replace('-', '−');
  return reducedDenominator === BigInt(1) ? normalized : `${normalized} ≈ ${imsNumber(internationalMonetaryExactToNumber(quantity))}`;
}

type LooseOk = Readonly<{
  status: 'OK';
  value: Readonly<Record<string, unknown>>;
  exact: Readonly<Record<string, ExactQuantity | undefined>>;
}>;

function valueText(result: LooseOk, key: string): string {
  const value = result.value[key];
  const exactValue = result.exact[key];
  if (value === null) return 'not-computed／不可直接合并（不是0）';
  if (exactValue) return exactText(exactValue);
  if (typeof value === 'number') return imsNumber(value);
  if (typeof value === 'boolean') return value ? '是（只在题设内）' : '否（只在题设内）';
  if (typeof value === 'string') {
    if (value === 'ADOPT') return '采用（净收益严格为正）';
    if (value === 'DO_NOT_ADOPT') return '不采用（净收益严格为负）';
    if (value === 'INDIFFERENT') return '无差异（净收益等于0；未设决胜规则）';
    if (value === 'DIRECT') return '直接路径';
    if (value === 'VEHICLE') return '载体路径';
    if (value === 'TIE') return '两条路径相同';
    return value;
  }
  if (Array.isArray(value)) return value.map(item => item === 1 ? '核心' : item === 0 ? '外围' : String(item)).join(' → ');
  throw Error(`未声明展示规则：${key}`);
}

const fieldLabels: Record<ImsLabId, Readonly<Record<string, string>>> = {
  C1: {
    fixedSetupCost: '采用固定成本K（SYN金额）',
    interactions: '潜在互动次数N（SYN次数）',
    savingPerAcceptedInteraction: '每次被接受时节省Δc（SYN金额）',
    expectedAcceptancePct: '预期对手接受率a（SYN百分比）',
  },
  C2: {
    fxNumerator: 'FX护照候选币种参与额（SYN）', fxDenominator: 'FX护照总成交额分母（SYN）',
    invoiceNumerator: '计价护照候选币种贸易额（SYN）', invoiceDenominator: '计价护照覆盖贸易额分母（SYN）',
    fundingNumerator: '融资护照候选币种期末存量（SYN）', fundingDenominator: '融资护照覆盖期末存量分母（SYN）',
    reserveNumerator: '储备护照候选币种市场价值（SYN）', reserveDenominator: '储备护照覆盖市场价值分母（SYN）',
    paymentNumerator: '跨境支付护照候选付款币记录值（SYN）', paymentDenominator: '跨境支付护照覆盖记录值分母（SYN）',
    aggregationMode: '跨护照处理规则（严格枚举）',
  },
  C3: {
    notional: '起始名义额Q（SYN金额）',
    directCostBps: '直接A/B路径比例成本d（SYN bp）',
    firstVehicleLegBps: 'A/载体第一腿成本c₁（SYN bp）',
    secondVehicleLegBps: '载体/B第二腿成本c₂（SYN bp）',
  },
  C4: {
    pairAB: 'FX-A/FX-B成交额（SYN）', pairAC: 'FX-A/FX-C成交额（SYN）',
    pairAD: 'FX-A/FX-D成交额（SYN）', pairAE: 'FX-A/FX-E成交额（SYN）',
    pairBC: 'FX-B/FX-C成交额（SYN）',
  },
  C5: {
    openingStock: '期初融资存量（SYN金额）',
    grossNewIssuance: '期间毛新发行/新贷款（SYN金额）',
    repayments: '期间偿还/到期（SYN金额）',
  },
  C6: {
    holdingA: '储备币种R-A持有数量（SYN单位）', oldRateACents: 'R-A期初报告汇率（SYN分/单位）', newRateACents: 'R-A期末报告汇率（SYN分/单位）',
    holdingB: '储备币种R-B持有数量（SYN单位）', oldRateBCents: 'R-B期初报告汇率（SYN分/单位）', newRateBCents: 'R-B期末报告汇率（SYN分/单位）',
  },
  C7: {
    startCore: '期初网络状态（0外围/1核心，SYN）', entryThreshold: '进入核心阈值（SYN分）', exitThreshold: '退出核心阈值（SYN分）',
    score1: '第1期支持分（SYN）', score2: '第2期支持分（SYN）', score3: '第3期支持分（SYN）',
    score4: '第4期支持分（SYN）', score5: '第5期支持分（SYN）', score6: '第6期支持分（SYN）',
  },
};

const rowKeys: Record<ImsLabId, readonly (readonly [string, string])[]> = {
  C1: [
    ['全接受时总节省', 'fullAcceptanceSaving'], ['当前预期节省', 'expectedSaving'], ['当前净收益', 'netBenefit'],
    ['协调阈值a*', 'thresholdPct'], ['阈值是否在0–100%可达', 'thresholdReachable'], ['当前题设决策', 'adoptionDecision'],
  ],
  C2: [
    ['功能统计护照数量', 'passportCount'], ['FX turnover份额', 'fxSharePct'], ['贸易计价份额', 'invoiceSharePct'],
    ['跨境融资份额', 'fundingSharePct'], ['官方储备份额', 'reserveSharePct'], ['跨境支付记录价值份额', 'paymentSharePct'],
    ['可直接平均的护照百分比数量', 'directlyAverageableShareCount'], ['共同单位', 'commonUnit'],
    ['共同参考期', 'commonReferencePeriod'], ['共同覆盖', 'commonCoverage'], ['共同分母', 'commonDenominator'],
    ['跨护照直接平均', 'directAveragePct'],
  ],
  C3: [
    ['直接路径成本', 'directCostBps'], ['载体路径有效成本', 'vehicleEffectiveCostBps'],
    ['直接路径最终交付', 'directDelivered'], ['载体路径最终交付', 'vehicleDelivered'],
    ['载体相对直接多交付', 'vehicleDeliveryAdvantage'], ['给定成本下优选路径', 'preferredRoute'],
  ],
  C4: [
    ['总FX成交额', 'totalFxTurnover'], ['FX-A参与额', 'currencyATurnover'], ['FX-B参与额', 'currencyBTurnover'],
    ['FX-C参与额', 'currencyCTurnover'], ['FX-D参与额', 'currencyDTurnover'], ['FX-E参与额', 'currencyETurnover'],
    ['FX-A币种份额', 'currencyASharePct'], ['五币种参与额合计', 'currencyTurnoverSum'], ['五币种份额合计', 'currencyShareSumPct'],
  ],
  C5: [
    ['净新流量', 'netNewFlow'], ['毛融资活动', 'grossActivity'], ['期末存量', 'closingStock'],
    ['存量变化', 'stockChange'], ['本实验冻结的估值变化', 'valuationChangeFrozen'], ['流量—存量桥残差', 'bridgeGap'],
  ],
  C6: [
    ['期初储备报告价值', 'openingReserveValue'], ['期末储备报告价值', 'closingReserveValue'],
    ['R-A估值变化', 'currencyAValuationChange'], ['R-B估值变化', 'currencyBValuationChange'],
    ['总估值变化', 'totalValuationChange'], ['R-A期末价值份额', 'currencyAClosingSharePct'],
    ['R-B期末价值份额', 'currencyBClosingSharePct'], ['期末份额合计', 'closingShareSumPct'],
    ['交易贡献', 'transactionContribution'], ['估值桥残差', 'bridgeGap'],
  ],
  C7: [
    ['六期网络状态路径', 'statePathText'], ['状态切换次数', 'switchCount'], ['首次进入核心期', 'firstEntryPeriod'],
    ['首次退出核心期', 'firstExitPeriod'], ['迟滞带停留期数', 'hysteresisBandVisits'], ['同分异态是否出现', 'sameScoreDifferentState'],
  ],
};

const syntheticNotice = '全部数值、币种代码、时钟与覆盖均为作者SYN教学输入；不是来源数据、真实市场报价、point-in-time（PIT，历史时点当时可得）资料、因果估计或政策建议。';

const copy: Record<ImsLabId, Omit<ImsLab, 'id' | 'initial' | 'fields' | 'display'>> = {
  C1: {
    title: '预期接受率何时跨过采用门槛',
    coreMechanism: '静态协调阈值；只比较当前预期收益与固定采用成本。',
    question: '当收益取决于对手也接受同一货币时，55%的预期接受率是否足以覆盖固定采用成本？',
    passport: '独立SYN单主体采用问题；互动次数、每次节省、固定成本和预期接受率均给定。没有真实货币、历史路径、福利排序或均衡识别。',
    syntheticNotice, sourceIds: [1, 2], chartKind: 'threshold-line',
    formula: ['B=N×Δc×a/100', 'NB=B−K', 'a*=100×K/(N×Δc)'],
    defaultRebuild: '全接受节省=40×1=40；当前预期节省=40×55%=22；净收益=22−24=−2；阈值=24/40=60%，所以55%下不采用；若恰好60%，结果是无差异而非自动采用。',
    changeCondition: '只改变预期接受率会沿同一直线移动当前点；改变固定成本或单次节省会移动阈值。阈值超过100%时显示不可达，不钳成100%。',
    extremes: ['K=0且a=0时净收益恰为0，显示无差异；a>0才严格采用。', 'K=N×Δc时阈值为100%，恰好100%仍显示无差异。', 'K>N×Δc时阈值超过100%，题设内不可达。'],
    misconception: '“货币本身更好”不自动推出采用；预期多少对手接受会改变采用净收益。',
    counterexample: '即使全体协调后的单次成本更低，当前预期接受率低于阈值时，单个主体仍可能不采用。',
    unknownWarning: '现实采用成本、对手分布、制度可信度、战略互动、福利、真实阈值及时间演化均未估计。',
    invariants: ['N与Δc严格为正。', 'a在0–100之间。', '决策使用同比例整数比较；正/负/零分别映射采用/不采用/无差异，不依赖显示舍入或未声明决胜规则。'],
  },
  C2: {
    title: '同一候选货币的五张功能统计护照不可直接平均',
    coreMechanism: '功能、单位、参考期、覆盖、分母与vintage共同决定一个百分比回答什么问题。',
    question: '五个百分比都写着同一候选货币，为什么仍不能相加或取简单平均？',
    passport: '同一虚构候选货币C2_SYN_CANDIDATE的FX turnover、贸易计价、跨境融资、官方储备与跨境支付记录价值五个独立SYN观测。第五张只测付款币支付记录，不测消息、清算义务、结算资产或法律最终性。每张护照冻结function、unit、reference period、coverage、denominator、vintage、功能专属参与角色、记录对象、计价币与付款币字段。',
    syntheticNotice, sourceIds: [4, 5, 8, 10, 12, 14, 15, 17, 19], chartKind: 'passport-small-multiples',
    formula: ['share_j=100×numerator_j/denominator_j', 'directAverage(five passports)=not-defined'],
    defaultRebuild: '五张护照分别得到90%、60%、70%、50%和75%；第五张只是跨境支付记录价值。它们的单位、参考期、覆盖与分母不同，可直接平均的百分比数量为0。程序不生成貌似精确的69%。',
    changeCondition: '每个分子只与自己护照的分母配对；选择REQUEST_DIRECT_AVERAGE会STOP并清除结果。',
    extremes: ['任一分子为0时该护照份额为0，但其他护照不受影响。', '任一分子等于自身分母时该护照为100%。', '分子超过自身分母或请求跨护照平均时STOP。'],
    misconception: '“同一货币”和“都以百分比表示”并不创造共同统计总体；五个数不能天然成为一个全球货币综合份额。',
    counterexample: 'FX份额可能按一个月日均成交且合计200%，储备份额却是期末市场价值且合计100%；即使数值相同，也不是同一对象。',
    unknownWarning: '现实份额、权重、缺失覆盖、估算部分、综合指数选择、跨功能因果与发布时间差异均未知。',
    invariants: ['五张护照属于同一SYN候选币，但五个function唯一。', '每个分母严格为正且分子不超过自身分母。', 'directAveragePct保持null，不能用0代替。'],
    statisticalPassports: internationalMonetaryStatisticalPassports,
  },
  C3: {
    title: '两腿载体路径可以比一腿直接路径便宜',
    coreMechanism: '用乘法留存率比较直接与载体货币两条给定成本路径。',
    question: '两次兑换是否必然比一次兑换贵？',
    passport: '独立SYN比例成本比较。成本仅作为名义额损失bp；没有买卖价、价格冲击、结算、信用、延迟、资本、合规或市场准入。',
    syntheticNotice, sourceIds: [3, 9], chartKind: 'route-cost-comparison',
    formula: ['Q_D=Q×(1−d/10000)', 'Q_V=Q×(1−c₁/10000)×(1−c₂/10000)', 'c_V=c₁+c₂−c₁c₂/10000'],
    defaultRebuild: '载体有效成本=10+20−10×20/10000=29.98bp；直接交付996500，载体交付997002，所以载体多交付502。',
    changeCondition: '改变任一腿成本会乘法改变载体交付；名义额只缩放金额结果，在纯比例假设下不改变bp排序。',
    extremes: ['两腿都为0bp时载体成本为0。', '直接路径为0bp时直接路径不劣。', '任一载体腿为10000bp时载体交付为0。'],
    misconception: '只数兑换腿数会漏掉每条市场的深度与比例成本；两腿不必然更贵。',
    counterexample: '若直接小币种市场成本35bp，而两条深市场腿为10bp和20bp，两腿路径仍可交付更多。',
    unknownWarning: '现实最优执行、报价时点、可成交量、PvP结算、信用和操作成本均未认证。',
    invariants: ['所有成本在0–10000bp。', '两条交付量均在0–Q。', '相等时返回TIE，不强行选路。'],
  },
  C4: {
    title: 'FX币种份额为什么精确合计200%',
    coreMechanism: '每笔FX交易同时给两种币种各记一条参与腿。',
    question: '总成交额为100时，为什么五种币种的参与份额可以合计200%？',
    passport: '独立SYN五币种、五货币对网络。每条边是同一口径成交额；没有真实币种、交易场所、工具拆分、柜台所在地或结算数据。',
    syntheticNotice, sourceIds: [5], chartKind: 'fx-pair-network',
    formula: ['T=Σ_e q_e', 'P_c=Σ_{e incident to c}q_e', 'share_c=100×P_c/T', 'Σ_c P_c=2T'],
    defaultRebuild: '五条边合计100；A/B/C/D/E参与额为90/55/35/15/5，合计200，所以币种份额也精确合计200%。',
    changeCondition: '任一货币对成交额同时进入其两端币种；程序不会把币种份额重新归一化为100%。',
    extremes: ['只有一条正边时，两端各100%，其余0%。', '全部边为0时分母不存在并STOP。'],
    misconception: 'A占90%不意味着其他币种合计只能占10%；其他币种仍合计110%。',
    counterexample: '一笔A/B交易既进入A参与额，也进入B参与额，但总FX成交额只记录一次。',
    unknownWarning: '现实2025年4月成交、全年代表性、支付、清算、最终结算和储备份额均不由本SYN给出。',
    invariants: ['总成交额严格为正。', '币种参与额合计严格等于2T。', '每币份额在0–100%，合计严格为200%。'],
  },
  C5: {
    title: '毛新融资不等于存量增加',
    coreMechanism: '在估值冻结为零的交易桥中，净新流量而非毛发行连接期初和期末存量。',
    question: '新发行300时，为什么期末存量只增加20？',
    passport: '独立SYN融资交易桥。只包含期初存量、新发行和偿还；汇率、价格、核销、分类和覆盖变化明确冻结为0。',
    syntheticNotice, sourceIds: [4, 10, 15], chartKind: 'stock-waterfall',
    formula: ['netNewFlow=grossNewIssuance−repayments', 'closingStock=openingStock+netNewFlow', 'grossActivity=grossNewIssuance+repayments'],
    defaultRebuild: '净新流量=300−280=20；期末存量=1000+20=1020；毛活动=300+280=580；桥残差0。',
    changeCondition: '发行和偿还分别改变毛活动；只有二者净额进入本实验的存量变化。',
    extremes: ['发行等于偿还时存量不变但毛活动可为正。', '偿还等于期初加发行时期末为0。', '更大偿还会令期末为负并STOP。'],
    misconception: '把300毛新发行叫成存量增加300，或把1020期末存量叫成本期新流量。',
    counterexample: '一个成熟融资市场可以同时有很大新发行和很大到期偿还，却只有很小净存量变化。',
    unknownWarning: '现实估值、核销、重分类、季调、币种转换、覆盖变化和来源修订均未进入本实验。',
    invariants: ['closingStock不得为负。', 'stockChange=netNewFlow。', 'grossActivity≥|netNewFlow|且bridgeGap=0。'],
  },
  C6: {
    title: '零交易时储备报告价值和份额仍会变化',
    coreMechanism: '固定原币持有数量，只让报告汇率改变储备市场价值。',
    question: '央行没有买卖时，储备总额和币种份额为什么仍可改变？',
    passport: '独立SYN两币种储备估值桥。原币数量固定、交易贡献为0，只改变报告货币/外币汇率；不含债券价格、应计收益、对冲或覆盖变化。',
    syntheticNotice, sourceIds: [12, 13, 14, 19], chartKind: 'valuation-waterfall',
    formula: ['V_t=Σ_i h_i×r_i,t/100', 'ΔV_FX=Σ_i h_i×(r_i,1−r_i,0)/100'],
    defaultRebuild: '期初=60×1+80×0.5=100；期末=60×1.2+80×0.45=108；A贡献+12、B贡献−4，总估值+8，交易贡献0，A期末份额=72/108=66⅔%。',
    changeCondition: '持有数量不变时，每个汇率只改变对应币种的报告价值；总份额仍以同一时点期末总值作分母。',
    extremes: ['全部汇率不变时总估值变化为0。', '某持有数量为0时该币种估值贡献为0。', '期末总报告价值为0时份额无定义并STOP。'],
    misconception: '储备报告价值或份额上升不自动证明央行净买入、干预或政策意图。',
    counterexample: 'A升值带来的+12可超过B贬值的−4，即使两种原币持有量与交易量都完全没变。',
    unknownWarning: '现实交易、债券价格、收益、衍生品、估算未分配部分、储备可用性和管理动机未知。',
    invariants: ['持有数量在期初期末相同。', 'transactionContribution=0。', 'closing−opening=totalValuationChange且bridgeGap=0。', '期末两币份额合计100%。'],
  },
  C7: {
    title: '同一支持分为何会因历史不同而保留不同网络状态',
    coreMechanism: '进入阈值高于退出阈值的双阈值状态机产生迟滞，并允许网络逆转。',
    question: '55分为何在一次路径中保留核心、另一次路径中保留外围？',
    passport: '独立SYN六期作者规则。支持分、进入阈值、退出阈值和初态均为题设；不是现实货币地位指数、转移概率或预测。',
    syntheticNotice, sourceIds: [1, 2, 4, 7], chartKind: 'hysteresis-timeline',
    formula: ['外围且score≥entry→核心', '核心且score≤exit→外围', 'exit<score<entry→保留上期状态'],
    defaultRebuild: '初态外围；50保留外围，65进入核心，55保留核心，35退出，55保留外围，65再次进入；路径为外围→核心→核心→外围→外围→核心，共切换3次。',
    changeCondition: '迟滞带中的分数不自行改变状态；只有达到进入阈值或退出阈值才切换。',
    extremes: ['全部分数位于迟滞带时完整保留初态。', '高分可进入，低分可退出。', '退出阈值不低于进入阈值时STOP。'],
    misconception: '网络效应既不意味着一旦领先就永不逆转，也不意味着每个小幅基本面变化都会立即改变状态。',
    counterexample: '同为55分，第3期因先前已进入而保持核心，第5期因先前已退出而保持外围。',
    unknownWarning: '现实阈值、支持分构成、主体异质性、政策冲击、转换速度、路径概率与福利均未识别。',
    invariants: ['状态只能为0或1。', '六个输入分全部在0–100。', '状态只在对应阈值条件满足时切换。', '切换次数在0–6。'],
  },
};

function display(id: ImsLabId, input: unknown): ImsDisplay {
  const evaluator = imsEvaluators[id] as (candidate: unknown) =>
    | Readonly<{ status: 'STOP'; reason: string }>
    | LooseOk;
  const result = evaluator(input);
  if (result.status === 'STOP') return result;
  return { status: 'OK', rows: rowKeys[id].map(([label, key]) => [label, valueText(result, key)]) };
}

function numericFields(id: ImsLabId): ImsNumberField[] {
  return Object.entries(imsRawDomains[id] as Readonly<Record<string, IntegerDomain>>).map(([key, domain]) => ({
    kind: 'integer', key, label: fieldLabels[id][key], ...domain,
  }));
}

function fields(id: ImsLabId): readonly ImsField[] {
  const base: ImsField[] = numericFields(id);
  if (id === 'C2') {
    base.push({
      kind: 'select', key: 'aggregationMode', label: fieldLabels.C2.aggregationMode,
      options: [
        { value: 'KEEP_SEPARATE', label: '逐护照保留，不直接平均' },
        { value: 'REQUEST_DIRECT_AVERAGE', label: '尝试直接平均（将STOP）' },
      ],
    });
  }
  return Object.freeze(base);
}

export const internationalMonetaryLabs: readonly ImsLab[] = (Object.keys(imsCanonicalInputs) as ImsLabId[]).map(id => ({
  id,
  ...copy[id],
  initial: imsCanonicalInputs[id] as Readonly<Record<string, unknown>>,
  fields: fields(id),
  display: input => display(id, input),
}));

export const internationalMonetaryLabAudit = [
  {
    key: 'seven unique independent SYN labs and forty-two complete fields',
    passed: internationalMonetaryLabs.length === 7
      && new Set(internationalMonetaryLabs.map(lab => lab.id)).size === 7
      && internationalMonetaryLabs.reduce((sum, lab) => sum + lab.fields.length, 0) === 42
      && internationalMonetaryLabs.every(lab => lab.initial === imsCanonicalInputs[lab.id]),
  },
  {
    key: 'all integer fields retain safe exact domains and select fields retain unique strict enums',
    passed: internationalMonetaryLabs.every(lab => lab.fields.every(field => field.kind === 'integer'
      ? field.step === 1 && Number.isSafeInteger(field.min) && Number.isSafeInteger(field.max) && field.min <= field.max && field.label.includes('SYN')
      : field.options.length > 0 && new Set(field.options.map(option => option.value)).size === field.options.length)),
  },
  {
    key: 'all defaults yield complete displays with one mechanism formula graph extremes and evidence boundary',
    passed: internationalMonetaryLabs.every(lab => {
      const result = lab.display(lab.initial);
      return result.status === 'OK' && result.rows.length === rowKeys[lab.id].length
        && result.rows.every(([label, value]) => label.length > 0 && value.length > 0)
        && lab.formula.length > 0 && lab.extremes.length >= 2 && lab.invariants.length >= 3
        && lab.defaultRebuild.length >= 55 && lab.counterexample.length >= 35 && lab.unknownWarning.length >= 35;
    }),
  },
  {
    key: 'C2 exposes exactly five complete same-candidate statistical passports and no composite average',
    passed: copy.C2.statisticalPassports?.length === 5
      && copy.C2.statisticalPassports.every(passport => passport.candidateCurrency === 'C2_SYN_CANDIDATE'
        && [passport.function, passport.unit, passport.referencePeriod, passport.coverage, passport.denominator, passport.vintage,
          passport.actorRoles, passport.recordObject, passport.denominationCurrency, passport.paymentCurrency]
          .every(value => value.length > 0)),
  },
  {
    key: 'all fixture finite and structural author checks pass independently of content approval',
    passed: internationalMonetaryFixtureAudit.every(item => item.passed),
  },
] as const;
