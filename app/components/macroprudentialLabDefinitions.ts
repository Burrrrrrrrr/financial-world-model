import {
  macroCanonicalInputs,
  macroEvaluators,
  macroExactToNumber,
  macroRawDomains,
} from './macroprudentialFixtures';
import type {
  ExactQuantity,
  MacroDomain,
  MacroLabId,
  MacroResult,
} from './macroprudentialFixtures';

export type MacroprudentialDisplay =
  | Readonly<{ status: 'STOP'; reason: string }>
  | Readonly<{ status: 'OK'; rows: readonly (readonly [string, string])[] }>;

export type MacroprudentialLab = Readonly<{
  id: MacroLabId;
  title: string;
  question: string;
  passport: string;
  sourceIds: readonly number[];
  initial: Readonly<Record<string, number>>;
  fields: readonly Readonly<{ key: string; label: string; min: number; max: number; step: 1 }>[];
  display: (input: unknown) => MacroprudentialDisplay;
  rebuild: string;
  changeCondition: string;
  counterexample: string;
  unknownWarning: string;
}>;

export function macroNumber(value: number): string {
  if (!Number.isFinite(value)) throw Error('宏观审慎展示只接受有限数。');
  return (value === 0 ? '0' : String(Number(value.toPrecision(12)))).replace('-', '−');
}

function gcd(a: bigint, b: bigint): bigint {
  const zero = BigInt(0);
  let x = a < zero ? -a : a;
  let y = b < zero ? -b : b;
  while (y !== zero) {
    const remainder = x % y;
    x = y;
    y = remainder;
  }
  return x;
}

function exactText(quantity: ExactQuantity): string {
  const numerator = BigInt(quantity.numerator) * BigInt(quantity.scale);
  const denominator = BigInt(quantity.denominator);
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor;
  const reducedDenominator = denominator / divisor;
  const fraction = reducedDenominator === BigInt(1)
    ? reducedNumerator.toString()
    : `${reducedNumerator}/${reducedDenominator}`;
  return reducedDenominator === BigInt(1)
    ? fraction.replace('-', '−')
    : `${fraction.replace('-', '−')} ≈ ${macroNumber(macroExactToNumber(quantity))}`;
}

function valueText(result: Extract<MacroResult, { status: 'OK' }>, key: string): string {
  const value = result.value[key];
  if (value === null) return 'unknown／未观测或未识别（不是0）';
  if (result.exact[key]) return exactText(result.exact[key]);
  if (typeof value === 'number') return macroNumber(value);
  if (typeof value === 'boolean') return value ? '是（只在题设内）' : '否（只在题设内）';
  if (typeof value === 'string') return value;
  throw Error(`未声明展示规则：${key}`);
}

const fieldLabels: Record<MacroLabId, Readonly<Record<string, string>>> = {
  C1: {
    rateTargetChangeBp: '政策利率方案下目标部门变化（SYN bp）',
    rateNonTargetChangeBp: '政策利率方案下非目标部门变化（SYN bp）',
    targetedTargetChangeBp: '定向方案下目标部门变化（SYN bp）',
    targetedNonTargetChangeBp: '定向方案下非目标部门变化（SYN bp）',
  },
  C2: {
    bankCount: '同步卖出的银行数（SYN家数）',
    initialEquityPerBank: '每家初始权益（SYN金额）',
    commonAssetUnitsPerBank: '每家共同资产持有量（SYN单位）',
    soldUnitsPerBank: '每家出售量（SYN单位）',
    priceBefore: '共同资产出售前单价（SYN金额）',
    impactBpPerUnitSold: '系统每卖一单位的线性价格冲击（SYN bp）',
  },
  C3: {
    cet1Amount: '冲击前实际CET1（SYN金额）',
    rwa: '风险加权资产RWA（SYN金额）',
    minimumRequirementBp: '最低要求（SYN bp of RWA）',
    conservationBufferBp: '资本留存缓冲（SYN bp of RWA）',
    ccybBp: '已建立CCyB（SYN bp of RWA）',
    managementTargetBp: '要求之上的管理层目标（SYN bp）',
    shockLoss: '冲击损失（SYN金额）',
    ccybReleaseBp: '显式释放CCyB（SYN bp）',
  },
  C4: {
    loanAmount: '贷款本金（SYN金额）',
    collateralBefore: '冲击前抵押品价值（SYN金额）',
    annualIncomeBefore: '冲击前年收入（SYN金额/年）',
    annualDebtServiceBefore: '冲击前年债务服务（SYN金额/年）',
    collateralAfter: '冲击后抵押品价值（SYN金额）',
    annualIncomeAfter: '冲击后年收入（SYN金额/年）',
    annualDebtServiceAfter: '冲击后年债务服务（SYN金额/年）',
  },
  C5: {
    hqla: '高质量流动性资产HQLA（SYN金额）',
    thirtyDayOutflows: '30日现金流出（SYN金额）',
    eligibleInflows: '题设合资格30日流入（SYN金额）',
    inflowCapBp: '流入相对流出的上限（SYN bp）',
    stableFunding: '可用稳定融资（SYN金额）',
    requiredStableFunding: '所需稳定融资（SYN金额）',
    capitalRatioBp: '另给相同资本率（SYN bp）',
  },
  C6: {
    bankCreditChange: '受约束银行信贷变化（SYN金额）',
    nonbankCreditChange: '非银信贷变化（SYN金额）',
    foreignBranchChange: '外国分行信贷变化（SYN金额）',
    offshoreDirectChange: '离岸直接借款变化（SYN金额）',
    unmeasuredChannelObserved: '未测渠道是否被观察（0否／1是）',
    unmeasuredChannelChange: '若已观察，未测渠道变化（SYN金额）',
  },
  C7: {
    treatedPreGrowthBp: '政策对象实施前增速（SYN bp）',
    treatedPostGrowthBp: '政策对象实施后增速（SYN bp）',
    noPolicyCounterfactualPostGrowthBp: '另给无政策事后反事实增速（SYN bp）',
    controlPreGrowthBp: '对照组实施前增速（SYN bp）',
    controlPostGrowthBp: '对照组实施后增速（SYN bp）',
  },
};

const rowKeys: Record<MacroLabId, readonly (readonly [string, string])[]> = {
  C1: [
    ['两方案目标部门变化之差（bp）', 'sameTargetHitBp'],
    ['利率方案非目标影响绝对值（bp）', 'rateSpilloverMagnitudeBp'],
    ['定向方案非目标影响绝对值（bp）', 'targetedSpilloverMagnitudeBp'],
    ['题设非目标影响缩减（%）', 'stipulatedSpilloverReductionPercent'],
    ['现实部门弹性', 'realElasticities'],
    ['现实最优政策', 'optimalPolicy'],
    ['现实福利效果', 'actualWelfareEffect'],
  ],
  C2: [
    ['系统同步出售量（单位）', 'systemUnitsSold'],
    ['题设价格跌幅（bp）', 'priceDropBp'],
    ['题设冲击后价格（SYN金额）', 'priceAfter'],
    ['每家出售后共同资产余量（单位）', 'remainingUnitsPerBank'],
    ['每家余量按市值损失（SYN金额）', 'markToMarketLossPerBank'],
    ['每家冲击后权益（SYN金额）', 'equityAfter'],
    ['每家按题设出售前价取得现金（SYN金额）', 'cashRaisedAtStipulatedPreSalePrice'],
    ['个体流动性在题设中改善', 'individualLiquidityImproves'],
    ['系统价格在题设中下降', 'systemPriceFalls'],
    ['现实均衡火售', 'equilibriumFireSale'],
    ['现实网络传染', 'networkContagion'],
  ],
  C3: [
    ['冲击后实际CET1（SYN金额）', 'cet1AfterShock'],
    ['冲击前实际CET1率（bp）', 'actualRatioBeforeBp'],
    ['冲击后实际CET1率（bp）', 'actualRatioAfterShockBp'],
    ['释放前监管阈值（bp）', 'regulatoryThresholdBeforeBp'],
    ['释放前管理层阈值（bp）', 'managementThresholdBeforeBp'],
    ['释放后监管阈值（bp）', 'regulatoryThresholdAfterReleaseBp'],
    ['释放后管理层阈值（bp）', 'managementThresholdAfterReleaseBp'],
    ['冲击前监管headroom（bp）', 'regulatoryHeadroomBeforeShockBp'],
    ['冲击后、释放前监管headroom（bp）', 'regulatoryHeadroomAfterShockBeforeReleaseBp'],
    ['释放后监管headroom（bp）', 'regulatoryHeadroomAfterReleaseBp'],
    ['释放凭空创造的资本（SYN金额）', 'capitalCreatedByRelease'],
    ['现实信贷反应', 'actualLendingResponse'],
    ['现实缓冲可用性', 'bufferUsability'],
  ],
  C4: [
    ['冲击前LTV（%）', 'ltvBeforePercent'],
    ['冲击后LTV（%）', 'ltvAfterPercent'],
    ['冲击前DSTI（%）', 'dstiBeforePercent'],
    ['冲击后DSTI（%）', 'dstiAfterPercent'],
    ['LTV变化（百分点）', 'ltvChangePercentagePoints'],
    ['DSTI变化（百分点）', 'dstiChangePercentagePoints'],
    ['现实法定阈值', 'legalLimit'],
    ['现实违约概率', 'defaultProbability'],
    ['现实违约损失率', 'lossGivenDefault'],
  ],
  C5: [
    ['封顶后合资格流入（SYN金额）', 'cappedEligibleInflowsAmount'],
    ['简化30日净现金流出（SYN金额）', 'netCashOutflows'],
    ['简化LCR（%）', 'simplifiedLcrPercent'],
    ['HQLA相对净流出缺口（SYN金额）', 'hqlaGap'],
    ['简化稳定融资率（%）', 'stableFundingRatioPercent'],
    ['稳定融资缺口（SYN金额）', 'stableFundingGap'],
    ['另给资本率（%）', 'capitalRatioPercent'],
    ['现实Basel合规结论', 'baselCompliance'],
    ['现实挤兑风险', 'actualRunRisk'],
  ],
  C6: [
    ['银行渠道毛收缩（SYN金额）', 'grossBankContraction'],
    ['三条已测替代渠道合计（SYN金额）', 'measuredOffsets'],
    ['已测系统净变化（SYN金额）', 'measuredSystemChange'],
    ['已测抵消率（%）', 'measuredOffsetRatioPercent'],
    ['含未测渠道的完整系统变化', 'fullSystemChange'],
    ['未测渠道值', 'unmeasuredChannelValue'],
    ['题设覆盖是否完整', 'completeCoverage'],
    ['现实因果泄漏', 'causalLeakage'],
    ['现实最优监管范围', 'optimalPerimeter'],
  ],
  C7: [
    ['朴素前后差（bp）', 'naiveBeforeAfterBp'],
    ['相对另给无政策反事实差（bp）', 'counterfactualGapBp'],
    ['对照组前后变化（bp）', 'controlChangeBp'],
    ['SYN双重差分算术（bp）', 'syntheticDifferenceInDifferencesBp'],
    ['已识别因果效应', 'identifiedCausalEffect'],
    ['平行趋势已验证', 'parallelTrendsValidated'],
    ['政策外生性', 'policyExogeneity'],
    ['真实观测数据集', 'observedRealDataset'],
  ],
};

const copy: Record<MacroLabId, Omit<MacroprudentialLab, 'id' | 'initial' | 'fields' | 'display'>> = {
  C1: {
    title: '利率与定向约束不是同一把尺',
    question: '当两个方案在题设中同样命中目标部门时，非目标部门承受的变化是否仍相同？',
    passport: '独立SYN比较，四个变化量是题设给定的近端响应，不是估计弹性。负号只表示该题设变量下降；未给价格、福利、通胀、产出、时滞或一般均衡。结果不能选择现实最优政策。',
    sourceIds: [1, 2, 6],
    rebuild: '目标部门：定向−100−利率(−100)=0bp。非目标影响绝对值分别为80与5bp；题设缩减=(80−5)/80=75/80=93.75%。',
    changeCondition: '若利率方案的非目标变化改成0，缩减率的分母为0，程序保留unknown而不是伪造百分比。',
    counterexample: '即使定向方案在这一组数里外溢较小，它也可能在现实中被规避、误校准或产生分配成本；本题没有证明“定向总更优”。',
    unknownWarning: '现实部门弹性、通胀与产出代价、政策交互、法律权限、福利权重和最优组合均未观测。',
  },
  C2: {
    title: '个体守比率可以同时损害系统权益',
    question: '五家银行同步卖出同一资产时，个体取得现金与共同持仓市值损失能否并存？',
    passport: '独立SYN有限同步回合。价格冲击被线性题设给定，出售现金按题设出售前价计算；没有订单簿、抢跑、非线性市场深度、网络债权、会计类别、监管动作或均衡买家。',
    sourceIds: [1, 2],
    rebuild: '系统卖出5×2=10单位，价格跌10×50=500bp，即从100到95。每家余18单位，按市值损失18×5=90，权益1000−90=910；题设出售现金2×100=200。',
    changeCondition: '若单家出售超过其持有量，或线性冲击把价格压到0及以下，实验STOP；不会把不可能状态钳回0。',
    counterexample: '若深口袋买家按原价吸收、资产不共同持有或卖出不触发价格冲击，个体去风险未必造成同样系统损失。',
    unknownWarning: '现实市场深度、成交价、权益会计、约束触发、其他资产、网络第二跳和政策承接均未知。',
  },
  C3: {
    title: 'CCyB建立、实际资本、可用与释放分栏',
    question: '损失发生后释放CCyB，改变的是监管阈值还是银行实际CET1存量？',
    passport: '独立SYN静态资本账本，RWA冻结。最低要求、留存缓冲、CCyB与管理层目标仅作题设加总；不实现完整Basel资本栈、分配限制、风险权重变化、监督判断或银行行为。',
    sourceIds: [2, 3, 4, 5],
    rebuild: '冲击前实际率1200bp；监管阈值450+250+200=900bp。损失300使CET1从1200降到900、实际率900bp。释放200bp后阈值从900降到700，监管headroom从0升到200bp，但实际CET1仍是900。',
    changeCondition: '若释放量超过已建立CCyB、损失超过资本或题设资本率超过100%，程序STOP；不会重复释放或制造负资本。',
    counterexample: '监管headroom增加不保证银行愿意放贷：管理层目标、融资、资产质量、需求和监督预期都可能阻止缓冲被使用。',
    unknownWarning: '现实资本定义、适用法域、宣布/生效时钟、银行使用、信贷与实体结果都未观测。',
  },
  C4: {
    title: 'LTV与DSTI是两道不同的借款人门',
    question: '抵押品、收入和年度债务服务同时变化时，哪一个分母驱动哪一道约束？',
    passport: '独立SYN存量快照。LTV=贷款/抵押品；DSTI=题设年度债务服务/同窗年收入。年度债务服务直接给定，未由利率、期限和摊还表推导；阈值不是任何法域法定线。',
    sourceIds: [2, 3, 4, 6],
    rebuild: 'LTV从800/1000=80%升到800/800=100%，变化20个百分点。DSTI从80/200=40%升到96/160=60%，也变化20个百分点；相同数值变化来自不同分母。',
    changeCondition: '只把抵押品恢复到1000会直接把LTV降回80%，却不改变当前DSTI；只恢复收入或债务服务则反向。',
    counterexample: '无抵押补充贷款、估值滞后、收入核验和真实摊还方式会改变约束；本题不能预测获批、违约或LGD。',
    unknownWarning: '真实合同、借款人分布、法定阈值、利率重定价、违约概率、损失率与行为反应未知。',
  },
  C5: {
    title: '流动性缺口不会被相同资本率消去',
    question: '给定30日现金流、HQLA和稳定融资，同一个资本率能否代替流动性与期限结构？',
    passport: '独立SYN简式，流入上限、HQLA、稳定融资和资本率均由题设给定；不是Basel合规引擎，不含资产折扣、流出类别、法律实体、币种、压力情景或监管判断。',
    sourceIds: [1, 2, 3],
    rebuild: '流入上限为200×75%=150，题设流入50全部合格；净流出=200−50=150。简化LCR=120/150=80%，HQLA缺口−30；稳定融资率=700/800=87.5%，缺口−100；资本率12%另列。',
    changeCondition: '提高资本率但不改变HQLA、流出和稳定融资，不会机械改变本题两项流动性结果；若净流出不再严格为正则STOP。',
    counterexample: '一家资本充足机构仍可能面临短期现金缺口；一家流动性充足机构也可能最终资不抵债。两种约束会互动但不互换。',
    unknownWarning: '真实合规口径、资产可变现性、挤兑概率、央行工具、融资网络和法域要求未知。',
  },
  C6: {
    title: '银行渠道收缩可被非银与跨境渠道抵消',
    question: '已测替代渠道几乎抵消银行收缩时，能否据此宣布系统信贷只下降10？',
    passport: '独立SYN同单位变化量。非银、外国分行和离岸直接借款是三个题设渠道；未测渠道由0/1观察开关区分，0表示“未观察”而不是变化为0。没有因果政策冲击或福利评价。',
    sourceIds: [2, 4, 7],
    rebuild: '银行毛收缩=|−200|=200；已测抵消=120+40+30=190；已测系统净变化=−200+190=−10；已测抵消率=190/200=95%。未测渠道未观察，所以完整系统变化保持unknown。',
    changeCondition: '把观察开关改为1后才把未测渠道变化纳入完整系统量；开关为0时输入槽里的0不具有经济零含义。',
    counterexample: '渠道金额恢复也可能伴随更短期限、更高币种错配或更弱监管；净数量接近0不等于系统风险不变，也不等于韧性提高。',
    unknownWarning: '真实范围覆盖、分支/子公司法律形态、风险迁移、互惠执行、因果泄漏与最优范围未知。',
  },
  C7: {
    title: '政策后的下降不是自动因果效果',
    question: '风险本来上升且政策内生收紧时，前后差、反事实差和对照差会给出同一个答案吗？',
    passport: '独立SYN增速比较。无政策反事实和对照路径均为题设给定，不是估计结果；未检验平行趋势、外生性、干扰、预期、提前反应、构成或推断。只展示estimand怎样改变。',
    sourceIds: [2, 4, 6],
    rebuild: '朴素前后差=700−1200=−500bp；相对题设无政策反事实=700−1500=−800bp；对照变化=1000−800=+200bp；SYN双重差分=−500−200=−700bp。',
    changeCondition: '改变任一反事实或对照路径会改变估计量；程序不会因某个数为负就自动授予因果身份。',
    counterexample: '若政策正因预期风险暴增而实施，事后仍增长7%既不能证明无效，也不能仅凭下降5个百分点证明有效。',
    unknownWarning: '真实数据、政策外生性、平行趋势、支持集、标准误、近端命中、韧性、泄漏与社会成本未知。',
  },
};

function display(id: MacroLabId, input: unknown): MacroprudentialDisplay {
  const result = macroEvaluators[id](input);
  if (result.status === 'STOP') return result;
  return {
    status: 'OK',
    rows: rowKeys[id].map(([label, key]) => [label, valueText(result, key)]),
  };
}

export const macroprudentialLabs: readonly MacroprudentialLab[] = (Object.keys(macroCanonicalInputs) as MacroLabId[]).map(id => ({
  id,
  ...copy[id],
  initial: macroCanonicalInputs[id],
  fields: Object.entries(macroRawDomains[id] as Readonly<Record<string, MacroDomain>>).map(([key, domain]) => ({
    key,
    label: fieldLabels[id][key],
    ...domain,
  })),
  display: input => display(id, input),
}));

export const macroprudentialLabAudit = [
  {
    key: 'seven independent canonical input identities and 43 declared raw integer fields',
    passed: macroprudentialLabs.length === 7
      && macroprudentialLabs.reduce((sum, lab) => sum + lab.fields.length, 0) === 43
      && macroprudentialLabs.every(lab => lab.initial === macroCanonicalInputs[lab.id]),
  },
  {
    key: 'all field labels carry units or object meaning and preserve exact declared domains',
    passed: macroprudentialLabs.every(lab => lab.fields.every(field => field.label.length >= 10
      && field.step === 1
      && Number.isSafeInteger(field.min)
      && Number.isSafeInteger(field.max)
      && field.min <= field.max)),
  },
  {
    key: 'all defaults yield named finite⁠-⁠or⁠-⁠explicit⁠-⁠unknown records with hand rebuild and counterexample',
    passed: macroprudentialLabs.every(lab => {
      const result = lab.display(lab.initial);
      return result.status === 'OK'
        && result.rows.every(([label, value]) => label.length > 0 && value.length > 0)
        && lab.rebuild.length >= 60
        && lab.counterexample.length >= 45
        && lab.unknownWarning.length >= 35;
    }),
  },
] as const;
