import type { PolicyAutonomySourceId } from '../lessons/policyAutonomyReferences';

export type PolicyAutonomyLabId = 'C1' | 'C2';

export type C1Compatibility =
  | 'compatible-within-declared-benchmark'
  | 'incompatible-within-declared-benchmark'
  | 'state-dependent-benchmark'
  | 'benchmark-not-applicable'
  | 'unknown';

export type C1Input = {
  exchangeCommitment: 'credible-hard-peg' | 'band-or-managed' | 'float' | 'unknown';
  effectiveCapitalMobility: 'frictionless-high' | 'segmented-or-wedged' | 'unknown';
  domesticRatePathIndependent: 'yes' | 'no' | 'unknown';
  assetComparability: 'confirmed' | 'confirmed-not-comparable' | 'unknown';
  domesticRate: number | null;
  foreignRate: number | null;
  expectedDepreciation: number | null;
  riskLiquidityPremium: number | null;
  segmentationCostWedge: number | null;
};

export type C1Result = {
  status: 'OK';
  compatibility: C1Compatibility;
  declaredDomesticRate: number | null;
  parityRequiredRate: number | null;
  parityResidual: number | null;
  residualClosed: boolean | null;
  parityStatus: 'closed' | 'open' | 'unknown';
  missingParityFields: readonly string[];
  financialConditionInsulation: null;
  capitalFlowDirection: null;
  reservePath: null;
  policyEffect: null;
  welfare: null;
};

export const c1Default: C1Input = {
  exchangeCommitment: 'credible-hard-peg',
  effectiveCapitalMobility: 'frictionless-high',
  domesticRatePathIndependent: 'yes',
  assetComparability: 'confirmed',
  domesticRate: 4,
  foreignRate: 4,
  expectedDepreciation: 0,
  riskLiquidityPremium: 0,
  segmentationCostWedge: 0,
};

export const c1ExplicitWedge: C1Input = {
  ...c1Default,
  exchangeCommitment: 'band-or-managed',
  effectiveCapitalMobility: 'segmented-or-wedged',
  domesticRate: 6,
  foreignRate: 4,
  expectedDepreciation: 1,
  riskLiquidityPremium: 0.5,
  segmentationCostWedge: 0.5,
};

export function calculateC1(input: C1Input): C1Result {
  const missingParityFields = [
    ['domesticRate', input.domesticRate],
    ['foreignRate', input.foreignRate],
    ['expectedDepreciation', input.expectedDepreciation],
    ['riskLiquidityPremium', input.riskLiquidityPremium],
    ['segmentationCostWedge', input.segmentationCostWedge],
  ].filter((entry): entry is [string, null] => entry[1] === null).map(([key]) => key);
  const numericUnknown = input.domesticRate === null
    || input.foreignRate === null
    || input.expectedDepreciation === null
    || input.riskLiquidityPremium === null
    || input.segmentationCostWedge === null;
  const parityRequiredRate = numericUnknown
    ? null
    : input.foreignRate! + input.expectedDepreciation! + input.riskLiquidityPremium! + input.segmentationCostWedge!;
  const parityResidual = parityRequiredRate === null ? null : input.domesticRate! - parityRequiredRate;
  const institutionalUnknown = input.exchangeCommitment === 'unknown'
    || input.effectiveCapitalMobility === 'unknown'
    || input.domesticRatePathIndependent === 'unknown'
    || input.assetComparability === 'unknown';
  const compatibility: C1Compatibility = institutionalUnknown
    ? 'unknown'
    : input.assetComparability === 'confirmed-not-comparable' || input.effectiveCapitalMobility === 'segmented-or-wedged'
      ? 'benchmark-not-applicable'
      : input.exchangeCommitment === 'band-or-managed'
        ? 'state-dependent-benchmark'
      : input.exchangeCommitment === 'credible-hard-peg'
        ? input.domesticRatePathIndependent === 'yes'
          ? 'incompatible-within-declared-benchmark'
          : 'compatible-within-declared-benchmark'
        : 'compatible-within-declared-benchmark';

  return {
    status: 'OK',
    compatibility,
    declaredDomesticRate: input.domesticRate,
    parityRequiredRate,
    parityResidual,
    residualClosed: parityResidual === null ? null : Math.abs(parityResidual) < 1e-9,
    parityStatus: parityResidual === null ? 'unknown' : Math.abs(parityResidual) < 1e-9 ? 'closed' : 'open',
    missingParityFields,
    financialConditionInsulation: null,
    capitalFlowDirection: null,
    reservePath: null,
    policyEffect: null,
    welfare: null,
  };
}

export type C2EconomyInput = {
  maturingFxDebt: number;
  fxRevenue: number;
  executableHedgeReceipts: number;
  committedExternalRollover: number;
  usableFxReplacement: number;
  localCurrencyReplacementCapacity: number;
  creditSpreadChangeBp: number;
  creditQuantityChange: number;
  creditAccess: 'open' | 'partial' | 'closed' | 'unknown';
};

export type C2Input = {
  externalRateChangeBp: number;
  sharedLocalPolicyRateChangeBp: number;
  economyA: C2EconomyInput;
  economyB: C2EconomyInput;
};

export type C2EconomyResult = C2EconomyInput & {
  fxCashGap: number;
  fxCoverageSurplus: number;
};

export type C2Result = {
  status: 'OK';
  localToExternalRateChangeRatio: number | null;
  samePolicyRatePathByConstruction: true;
  economyA: C2EconomyResult;
  economyB: C2EconomyResult;
  gapsDiffer: boolean;
  localCurrencyCapacityDeductedFromFxGap: false;
  financialConditionInsulation: null;
  identifiedExternalShock: null;
  policyEffect: null;
  welfare: null;
};

export const c2Default: C2Input = {
  externalRateChangeBp: 100,
  sharedLocalPolicyRateChangeBp: 25,
  economyA: {
    maturingFxDebt: 12,
    fxRevenue: 4,
    executableHedgeReceipts: 3,
    committedExternalRollover: 3,
    usableFxReplacement: 2,
    localCurrencyReplacementCapacity: 1,
    creditSpreadChangeBp: 35,
    creditQuantityChange: -2,
    creditAccess: 'open',
  },
  economyB: {
    maturingFxDebt: 12,
    fxRevenue: 1,
    executableHedgeReceipts: 1,
    committedExternalRollover: 3,
    usableFxReplacement: 1,
    localCurrencyReplacementCapacity: 8,
    creditSpreadChangeBp: 110,
    creditQuantityChange: -7,
    creditAccess: 'partial',
  },
};

function calculateEconomy(input: C2EconomyInput): C2EconomyResult {
  const fxResources = input.fxRevenue + input.executableHedgeReceipts + input.committedExternalRollover + input.usableFxReplacement;
  return {
    ...input,
    fxCashGap: Math.max(0, input.maturingFxDebt - fxResources),
    fxCoverageSurplus: Math.max(0, fxResources - input.maturingFxDebt),
  };
}

export function calculateC2(input: C2Input): C2Result {
  const economyA = calculateEconomy(input.economyA);
  const economyB = calculateEconomy(input.economyB);
  return {
    status: 'OK',
    localToExternalRateChangeRatio: input.externalRateChangeBp === 0 ? null : input.sharedLocalPolicyRateChangeBp / input.externalRateChangeBp,
    samePolicyRatePathByConstruction: true,
    economyA,
    economyB,
    gapsDiffer: economyA.fxCashGap !== economyB.fxCashGap,
    localCurrencyCapacityDeductedFromFxGap: false,
    financialConditionInsulation: null,
    identifiedExternalShock: null,
    policyEffect: null,
    welfare: null,
  };
}

export const policyAutonomyLabs = [
  {
    id: 'C1' as const,
    title: '三元约束相容性账本：声明基准与利率楔子能否闭合？',
    question: '先判断汇率承诺、有效资本流动、资产可比与独立利率路径在经典基准内是否相容；再单独审计利率、预期与楔子的算术残差。',
    passport: 'MODEL-SYN · 年化百分点 · S为一单位外币的本币价格，预期贬值为正 · 资产可比与制度状态为显式枚举 · 兼容状态和利率残差是两项不同检查 · 不代表现实国家、资本流、储备、危机或福利。',
    sourceIds: [1, 2, 3, 5, 30, 31, 32, 33] as readonly PolicyAutonomySourceId[],
  },
  {
    id: 'C2' as const,
    title: '同样的政策率路径，不同的外币现金与金融条件向量',
    question: '保持声明的外部利率变化与本地政策率路径相同，先比较两个匿名经济体的外币现金桥；再把信用价格、数量与准入作为独立合成观察并列，而不伪装成因果匹配。',
    passport: 'AUTHOR-SYN · A/B同一未来现金窗口、同一外币单位 · 外币现金桥改变到期支付、收入、对冲、续作与可用外币替代，本币容量另栏且无兑换路线不得扣减FX gap · credit price／quantity／access为作者另行声明的独立观察，不由缺口机械生成，A/B也不是已识别因果配对 · 非政策效果或福利估计。',
    sourceIds: [9, 17, 18, 19, 20, 23, 35] as readonly PolicyAutonomySourceId[],
  },
] as const;

const c1 = calculateC1(c1Default);
const c1Float = calculateC1({ ...c1Default, exchangeCommitment: 'float' });
const c1Managed = calculateC1({ ...c1Default, exchangeCommitment: 'band-or-managed' });
const c1Segmented = calculateC1({ ...c1Default, effectiveCapitalMobility: 'segmented-or-wedged' });
const c1NonComparable = calculateC1({ ...c1Default, assetComparability: 'confirmed-not-comparable' });
const c1Unknown = calculateC1({ ...c1Default, assetComparability: 'unknown' });
const c1NumericUnknown = calculateC1({ ...c1Default, expectedDepreciation: null });
const c1OpenNoIndependence = calculateC1({ ...c1Default, domesticRatePathIndependent: 'no' });
const c1Unclosed = calculateC1({ ...c1Default, domesticRate: 5 });
const c1ExplicitWedges = calculateC1(c1ExplicitWedge);
const c2 = calculateC2(c2Default);
const c2ZeroChange = calculateC2({ ...c2Default, externalRateChangeBp: 0 });
const c2Overcovered = calculateC2({
  ...c2Default,
  economyB: { ...c2Default.economyB, fxRevenue: 8, executableHedgeReceipts: 4, committedExternalRollover: 3, usableFxReplacement: 3 },
});

export const policyAutonomyLabAudit = [
  { key: 'C1 default is the classic no-wedge benchmark and closes the declared parity relation exactly', passed: c1.parityRequiredRate === 4 && c1.parityResidual === 0 && c1.residualClosed },
  { key: 'C1 classic three-commitment declaration is incompatible within the benchmark', passed: c1.compatibility === 'incompatible-within-declared-benchmark' },
  { key: 'C1 float relaxes the fixed-rate commitment without inferring financial insulation', passed: c1Float.compatibility === 'compatible-within-declared-benchmark' && c1Float.financialConditionInsulation === null },
  { key: 'C1 managed arrangement is state dependent rather than automatically compatible', passed: c1Managed.compatibility === 'state-dependent-benchmark' },
  { key: 'C1 segmentation makes the frictionless benchmark inapplicable rather than successful', passed: c1Segmented.compatibility === 'benchmark-not-applicable' },
  { key: 'C1 non-comparable assets make the declared parity benchmark inapplicable rather than violated', passed: c1NonComparable.compatibility === 'benchmark-not-applicable' },
  { key: 'C1 unknown stays unknown and no real-world outcomes are invented', passed: c1Unknown.compatibility === 'unknown' && c1Unknown.capitalFlowDirection === null && c1Unknown.reservePath === null },
  { key: 'C1 numeric unknown preserves the independent institutional verdict while withholding parity arithmetic', passed: c1NumericUnknown.compatibility === 'incompatible-within-declared-benchmark' && c1NumericUnknown.parityResidual === null && c1NumericUnknown.residualClosed === null },
  { key: 'C1 hard peg and no independent rate path is compatible within the declared benchmark', passed: c1OpenNoIndependence.compatibility === 'compatible-within-declared-benchmark' },
  { key: 'C1 nonzero residual remains a diagnostic without policy or welfare inference', passed: c1Unclosed.parityResidual === 1 && !c1Unclosed.residualClosed && c1Unclosed.policyEffect === null && c1Unclosed.welfare === null },
  { key: 'C1 explicit-wedge preset relaxes the classic institutional assumptions and closes only its separate parity ledger', passed: c1ExplicitWedges.compatibility === 'benchmark-not-applicable' && c1ExplicitWedges.parityRequiredRate === 6 && c1ExplicitWedges.parityResidual === 0 },
  { key: 'C2 default keeps the policy rate path shared and reports a quarter declared-path ratio', passed: c2.samePolicyRatePathByConstruction && c2.localToExternalRateChangeRatio === 0.25 },
  { key: 'C2 default economy A closes FX cash and economy B has a six-unit gap', passed: c2.economyA.fxCashGap === 0 && c2.economyB.fxCashGap === 6 && c2.gapsDiffer },
  { key: 'C2 never deducts local-currency capacity from the FX cash gap', passed: !c2.localCurrencyCapacityDeductedFromFxGap && c2.economyB.localCurrencyReplacementCapacity === 8 && c2.economyB.fxCashGap === 6 },
  { key: 'C2 zero external rate change returns a null ratio rather than dividing by zero', passed: c2ZeroChange.localToExternalRateChangeRatio === null },
  { key: 'C2 overcoverage reports zero gap and a positive surplus', passed: c2Overcovered.economyB.fxCashGap === 0 && c2Overcovered.economyB.fxCoverageSurplus === 6 },
  { key: 'C2 credit price quantity and access stay independent inputs', passed: c2.economyA.creditSpreadChangeBp === 35 && c2.economyA.creditQuantityChange === -2 && c2.economyA.creditAccess === 'open' },
  { key: 'C2 empirical shock policy effect insulation and welfare remain null', passed: c2.identifiedExternalShock === null && c2.policyEffect === null && c2.financialConditionInsulation === null && c2.welfare === null },
] as const;

if (!policyAutonomyLabAudit.every(item => item.passed)) {
  throw new Error(`4.09 lab audit failed: ${policyAutonomyLabAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
