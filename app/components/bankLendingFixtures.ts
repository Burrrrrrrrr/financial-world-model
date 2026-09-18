export type SyntheticCurrency = 'SYN';
export type SyntheticAmountUnit = 'SYN-currency';
export type AnnualRateUnit = 'percent-per-year';
export type BasisPointUnit = 'basis-points';
export type RatioUnit = 'decimal-ratio';
export type ProbabilityUnit = 'percent-probability';
export type RealOutcomeUnit = 'SYN-real-index';

export type BankLendingFixtureAssertion = {
  id: string;
  statement: string;
  passed: boolean;
};

function finiteNonNegative(...values: number[]) {
  return values.every((value) => Number.isFinite(value) && value >= 0);
}

function finite(...values: number[]) {
  return values.every((value) => Number.isFinite(value));
}

function positive(value: number) {
  return Number.isFinite(value) && value > 0;
}

function near(actual: number | undefined, expected: number, tolerance = 1e-9) {
  return typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - expected) <= tolerance;
}

function uniqueNonEmpty(values: unknown[]) {
  return values.every((value) => typeof value === 'string' && value.trim().length > 0) && new Set(values).size === values.length;
}

export type LoanFundingQuote =
  | { kind: 'all-in-mcf'; marginalFundingCostPct: number }
  | { kind: 'spread-over-reference'; fundingSpreadPct: number };

export type AllInLoanCostComponentIds = {
  referenceRate: string;
  marginalFundingCost: string;
  fundingSpread: string;
  expectedLoss: string;
  operatingCost: string;
  capitalShadowCost: string;
  liquidityShadowCost: string;
  concentrationOpportunityCost: string;
  targetResidualReturn: string;
  upfrontFee: string;
};

export type AllInLoanOfferInput = {
  synthetic: true;
  currency: SyntheticCurrency;
  amountUnit: SyntheticAmountUnit;
  rateUnit: AnnualRateUnit;
  feeOutputUnit: BasisPointUnit;
  referenceRatePct: number;
  fundingQuote: LoanFundingQuote;
  expectedLossPct: number;
  operatingCostPct: number;
  capitalShadowCostPct: number;
  liquidityShadowCostPct: number;
  concentrationOpportunityCostPct: number;
  targetResidualReturnPct: number;
  upfrontFeeAmount: number;
  principalAmount: number;
  termMonths: number;
  componentIds: AllInLoanCostComponentIds;
};

export type AllInLoanOfferResult = {
  referenceRatePct: number;
  marginalFundingCostPct: number;
  fundingSpreadPct: number;
  expectedLossPct: number;
  operatingCostPct: number;
  capitalShadowCostPct: number;
  liquidityShadowCostPct: number;
  concentrationOpportunityCostPct: number;
  targetResidualReturnPct: number;
  annualInterestRatePct: number;
  annualizedFeeBp: number;
  allInEquivalentPct: number;
  additiveInterestComponentIds: string[];
  allInComponentIds: string[];
  componentIdCount: number;
  annualizationConvention: 'simple-linear-over-contract-months';
};

/**
 * SYNTHETIC teaching calculator. An all-in MCF already contains the reference
 * rate; a spread quote does not. Fees remain separately visible before the
 * simple annual-equivalent total is formed.
 */
export function allInLoanOfferMetrics(input: AllInLoanOfferInput): AllInLoanOfferResult | null {
  if (
    input.synthetic !== true
    || input.currency !== 'SYN'
    || input.amountUnit !== 'SYN-currency'
    || input.rateUnit !== 'percent-per-year'
    || input.feeOutputUnit !== 'basis-points'
    || !['all-in-mcf', 'spread-over-reference'].includes(input.fundingQuote.kind)
  ) return null;

  const fundingValue = input.fundingQuote.kind === 'all-in-mcf'
    ? input.fundingQuote.marginalFundingCostPct
    : input.fundingQuote.fundingSpreadPct;
  const componentIds = Object.values(input.componentIds);
  if (!finite(input.referenceRatePct, fundingValue) || !uniqueNonEmpty(componentIds)) return null;
  if (!finiteNonNegative(
    input.expectedLossPct,
    input.operatingCostPct,
    input.capitalShadowCostPct,
    input.liquidityShadowCostPct,
    input.concentrationOpportunityCostPct,
    input.targetResidualReturnPct,
    input.upfrontFeeAmount,
    input.principalAmount,
    input.termMonths,
  )) return null;
  if (!positive(input.principalAmount) || !Number.isSafeInteger(input.termMonths) || input.termMonths < 1) return null;

  const marginalFundingCostPct = input.fundingQuote.kind === 'all-in-mcf'
    ? input.fundingQuote.marginalFundingCostPct
    : input.referenceRatePct + input.fundingQuote.fundingSpreadPct;
  const fundingSpreadPct = marginalFundingCostPct - input.referenceRatePct;
  const annualInterestRatePct = marginalFundingCostPct
    + input.expectedLossPct
    + input.operatingCostPct
    + input.capitalShadowCostPct
    + input.liquidityShadowCostPct
    + input.concentrationOpportunityCostPct
    + input.targetResidualReturnPct;
  const annualizedFeeBp = (input.upfrontFeeAmount / input.principalAmount) * (12 / input.termMonths) * 10_000;
  const additiveInterestComponentIds = input.fundingQuote.kind === 'all-in-mcf'
    ? [
      input.componentIds.marginalFundingCost,
      input.componentIds.expectedLoss,
      input.componentIds.operatingCost,
      input.componentIds.capitalShadowCost,
      input.componentIds.liquidityShadowCost,
      input.componentIds.concentrationOpportunityCost,
      input.componentIds.targetResidualReturn,
    ]
    : [
      input.componentIds.referenceRate,
      input.componentIds.fundingSpread,
      input.componentIds.expectedLoss,
      input.componentIds.operatingCost,
      input.componentIds.capitalShadowCost,
      input.componentIds.liquidityShadowCost,
      input.componentIds.concentrationOpportunityCost,
      input.componentIds.targetResidualReturn,
    ];
  const allInComponentIds = [...additiveInterestComponentIds, input.componentIds.upfrontFee];

  return {
    referenceRatePct: input.referenceRatePct,
    marginalFundingCostPct,
    fundingSpreadPct,
    expectedLossPct: input.expectedLossPct,
    operatingCostPct: input.operatingCostPct,
    capitalShadowCostPct: input.capitalShadowCostPct,
    liquidityShadowCostPct: input.liquidityShadowCostPct,
    concentrationOpportunityCostPct: input.concentrationOpportunityCostPct,
    targetResidualReturnPct: input.targetResidualReturnPct,
    annualInterestRatePct,
    annualizedFeeBp,
    allInEquivalentPct: annualInterestRatePct + annualizedFeeBp / 100,
    additiveInterestComponentIds,
    allInComponentIds,
    componentIdCount: allInComponentIds.length,
    annualizationConvention: 'simple-linear-over-contract-months',
  };
}

type FundingSourceCommon = {
  sourceId: string;
  stockWeightRatio: number;
  marginalFundingShareRatio: number;
  openingCostPct: number;
};

export type FundingSourceInput =
  | FundingSourceCommon & { kind: 'deposit'; depositBeta: number }
  | FundingSourceCommon & { kind: 'wholesale' | 'secured' | 'long-term'; passThroughCoefficient: number };

export type FundingPassThroughInput = {
  synthetic: true;
  rateUnit: AnnualRateUnit;
  moveUnit: BasisPointUnit;
  weightUnit: RatioUnit;
  policyMoveDirection: 'tightening' | 'easing';
  policyMoveBp: number;
  sources: FundingSourceInput[];
  depositSourceId: string;
  depositOutflowFraction: number;
  replacementFunding: {
    openingCostPct: number;
    passThroughCoefficient: number;
    transitionPremiumBp: number;
  };
};

export type FundingPassThroughResult = {
  signedPolicyMoveBp: number;
  stockWeightedPassThroughCoefficient: number;
  marginalFundingPassThroughCoefficient: number;
  openingAverageFundingCostPct: number;
  openingMarginalFundingCostPct: number;
  fixedStockPostAverageCostPct: number;
  fixedMarginalPostFundingCostPct: number;
  averageFirstStageChangeBp: number;
  marginalFirstStageChangeBp: number;
  displacedDepositStockWeight: number;
  displacedDepositMarginalShare: number;
  replacementFundingPostCostPct: number;
  replacementEffectOnAverageCostBp: number;
  replacementEffectOnMarginalCostBp: number;
  secondStageAverageFundingCostPct: number;
  secondStageMarginalFundingCostPct: number;
  totalAverageFundingCostChangeBp: number;
  totalMarginalFundingCostChangeBp: number;
  stockWeightTotal: number;
  marginalFundingShareTotal: number;
};

function sourcePassThrough(source: FundingSourceInput) {
  return source.kind === 'deposit' ? source.depositBeta : source.passThroughCoefficient;
}

/** Stock weights produce an ACF basket; marginal shares separately produce the next-unit MCF basket. */
export function fundingPassThroughMetrics(input: FundingPassThroughInput): FundingPassThroughResult | null {
  if (
    input.synthetic !== true
    || input.rateUnit !== 'percent-per-year'
    || input.moveUnit !== 'basis-points'
    || input.weightUnit !== 'decimal-ratio'
    || !['tightening', 'easing'].includes(input.policyMoveDirection)
    || input.sources.length < 1
    || !uniqueNonEmpty(input.sources.map((source) => source.sourceId))
    || input.sources.some((source) => !['deposit', 'wholesale', 'secured', 'long-term'].includes(source.kind))
  ) return null;
  if (!finiteNonNegative(
    input.policyMoveBp,
    input.depositOutflowFraction,
    input.replacementFunding.openingCostPct,
    input.replacementFunding.passThroughCoefficient,
    input.replacementFunding.transitionPremiumBp,
    ...input.sources.flatMap((source) => [source.stockWeightRatio, source.marginalFundingShareRatio, source.openingCostPct, sourcePassThrough(source)]),
  )) return null;
  if (input.depositOutflowFraction > 1) return null;

  const stockWeightTotal = input.sources.reduce((sum, source) => sum + source.stockWeightRatio, 0);
  const marginalFundingShareTotal = input.sources.reduce((sum, source) => sum + source.marginalFundingShareRatio, 0);
  if (Math.abs(stockWeightTotal - 1) > 1e-9 || Math.abs(marginalFundingShareTotal - 1) > 1e-9) return null;
  const depositSource = input.sources.find((source) => source.sourceId === input.depositSourceId);
  if (!depositSource || depositSource.kind !== 'deposit') return null;

  const signedPolicyMoveBp = input.policyMoveDirection === 'tightening' ? input.policyMoveBp : -input.policyMoveBp;
  const sourcePostCosts = input.sources.map((source) => source.openingCostPct + sourcePassThrough(source) * signedPolicyMoveBp / 100);
  const replacementFundingPostCostPct = input.replacementFunding.openingCostPct
    + input.replacementFunding.passThroughCoefficient * signedPolicyMoveBp / 100
    + input.replacementFunding.transitionPremiumBp / 100;
  if (!sourcePostCosts.every((cost) => finiteNonNegative(cost)) || !finiteNonNegative(replacementFundingPostCostPct)) return null;

  const stockWeightedPassThroughCoefficient = input.sources.reduce((sum, source) => sum + source.stockWeightRatio * sourcePassThrough(source), 0);
  const marginalFundingPassThroughCoefficient = input.sources.reduce((sum, source) => sum + source.marginalFundingShareRatio * sourcePassThrough(source), 0);
  const openingAverageFundingCostPct = input.sources.reduce((sum, source) => sum + source.stockWeightRatio * source.openingCostPct, 0);
  const openingMarginalFundingCostPct = input.sources.reduce((sum, source) => sum + source.marginalFundingShareRatio * source.openingCostPct, 0);
  const fixedStockPostAverageCostPct = input.sources.reduce((sum, source, index) => sum + source.stockWeightRatio * sourcePostCosts[index], 0);
  const fixedMarginalPostFundingCostPct = input.sources.reduce((sum, source, index) => sum + source.marginalFundingShareRatio * sourcePostCosts[index], 0);
  const averageFirstStageChangeBp = (fixedStockPostAverageCostPct - openingAverageFundingCostPct) * 100;
  const marginalFirstStageChangeBp = (fixedMarginalPostFundingCostPct - openingMarginalFundingCostPct) * 100;
  const displacedDepositStockWeight = depositSource.stockWeightRatio * input.depositOutflowFraction;
  const displacedDepositMarginalShare = depositSource.marginalFundingShareRatio * input.depositOutflowFraction;
  const depositPostCostPct = depositSource.openingCostPct + depositSource.depositBeta * signedPolicyMoveBp / 100;
  const replacementCostGapPct = replacementFundingPostCostPct - depositPostCostPct;
  const replacementEffectOnAverageCostBp = displacedDepositStockWeight * replacementCostGapPct * 100;
  const replacementEffectOnMarginalCostBp = displacedDepositMarginalShare * replacementCostGapPct * 100;
  const secondStageAverageFundingCostPct = fixedStockPostAverageCostPct + replacementEffectOnAverageCostBp / 100;
  const secondStageMarginalFundingCostPct = fixedMarginalPostFundingCostPct + replacementEffectOnMarginalCostBp / 100;

  return {
    signedPolicyMoveBp,
    stockWeightedPassThroughCoefficient,
    marginalFundingPassThroughCoefficient,
    openingAverageFundingCostPct,
    openingMarginalFundingCostPct,
    fixedStockPostAverageCostPct,
    fixedMarginalPostFundingCostPct,
    averageFirstStageChangeBp,
    marginalFirstStageChangeBp,
    displacedDepositStockWeight,
    displacedDepositMarginalShare,
    replacementFundingPostCostPct,
    replacementEffectOnAverageCostBp,
    replacementEffectOnMarginalCostBp,
    secondStageAverageFundingCostPct,
    secondStageMarginalFundingCostPct,
    totalAverageFundingCostChangeBp: (secondStageAverageFundingCostPct - openingAverageFundingCostPct) * 100,
    totalMarginalFundingCostChangeBp: (secondStageMarginalFundingCostPct - openingMarginalFundingCostPct) * 100,
    stockWeightTotal,
    marginalFundingShareTotal,
  };
}

export type RepricingBucketId = 'floating' | 'reset-3m' | 'reset-6m' | 'reset-12m' | 'fixed';
export type RepricingHorizon = 0 | 3 | 12 | 24;

export type RepricingBucketInput = {
  bucket: RepricingBucketId;
  balance: number;
  currentRatePct: number;
  repricedRatePct: number;
};

export type RepricingClockInput = {
  synthetic: true;
  amountUnit: SyntheticAmountUnit;
  rateUnit: AnnualRateUnit;
  newBusinessRatePct: number;
  buckets: RepricingBucketInput[];
};

export type RepricingClockResult = {
  totalStockBalance: number;
  newBusinessRatePct: number;
  stockRateMonth0Pct: number;
  stockRateMonth3Pct: number;
  stockRateMonth12Pct: number;
  stockRateMonth24Pct: number;
  repricedShareMonth0: number;
  repricedShareMonth3: number;
  repricedShareMonth12: number;
  repricedShareMonth24: number;
  stockRatesPctByHorizon: Record<RepricingHorizon, number>;
  repricedSharesByHorizon: Record<RepricingHorizon, number>;
  newBusinessIncludedInStock: false;
  bucketResetRule: Record<RepricingBucketId, number | null>;
};

const repricingResetMonth: Record<RepricingBucketId, number | null> = {
  floating: 0,
  'reset-3m': 3,
  'reset-6m': 6,
  'reset-12m': 12,
  fixed: null,
};

/** Existing stock and new business are deliberately kept separate. */
export function repricingClockMetrics(input: RepricingClockInput): RepricingClockResult | null {
  const expectedBuckets: RepricingBucketId[] = ['floating', 'reset-3m', 'reset-6m', 'reset-12m', 'fixed'];
  if (
    input.synthetic !== true
    || input.amountUnit !== 'SYN-currency'
    || input.rateUnit !== 'percent-per-year'
    || input.buckets.length !== expectedBuckets.length
    || !uniqueNonEmpty(input.buckets.map((bucket) => bucket.bucket))
    || !expectedBuckets.every((bucket) => input.buckets.some((item) => item.bucket === bucket))
  ) return null;
  if (!finiteNonNegative(
    input.newBusinessRatePct,
    ...input.buckets.flatMap((bucket) => [bucket.balance, bucket.currentRatePct, bucket.repricedRatePct]),
  )) return null;
  const totalStockBalance = input.buckets.reduce((sum, bucket) => sum + bucket.balance, 0);
  if (!positive(totalStockBalance)) return null;

  const horizons: RepricingHorizon[] = [0, 3, 12, 24];
  const stockRatesPctByHorizon = {} as Record<RepricingHorizon, number>;
  const repricedSharesByHorizon = {} as Record<RepricingHorizon, number>;
  horizons.forEach((horizon) => {
    let weightedRate = 0;
    let repricedBalance = 0;
    input.buckets.forEach((bucket) => {
      const resetMonth = repricingResetMonth[bucket.bucket];
      const hasRepriced = resetMonth !== null && horizon >= resetMonth;
      weightedRate += bucket.balance * (hasRepriced ? bucket.repricedRatePct : bucket.currentRatePct);
      if (hasRepriced) repricedBalance += bucket.balance;
    });
    stockRatesPctByHorizon[horizon] = weightedRate / totalStockBalance;
    repricedSharesByHorizon[horizon] = repricedBalance / totalStockBalance;
  });

  return {
    totalStockBalance,
    newBusinessRatePct: input.newBusinessRatePct,
    stockRateMonth0Pct: stockRatesPctByHorizon[0],
    stockRateMonth3Pct: stockRatesPctByHorizon[3],
    stockRateMonth12Pct: stockRatesPctByHorizon[12],
    stockRateMonth24Pct: stockRatesPctByHorizon[24],
    repricedShareMonth0: repricedSharesByHorizon[0],
    repricedShareMonth3: repricedSharesByHorizon[3],
    repricedShareMonth12: repricedSharesByHorizon[12],
    repricedShareMonth24: repricedSharesByHorizon[24],
    stockRatesPctByHorizon,
    repricedSharesByHorizon,
    newBusinessIncludedInStock: false,
    bucketResetRule: { ...repricingResetMonth },
  };
}

export type LoanCapacityInput = {
  synthetic: true;
  amountUnit: SyntheticAmountUnit;
  capacityUnit: SyntheticAmountUnit;
  ratioUnit: RatioUnit;
  mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1';
  mappingTarget: {
    loanInstrumentId: string;
    lenderLegalEntityId: string;
    currency: SyntheticCurrency;
    decisionTime: string;
    mappingBasis: 'incremental-drawn-term-loan-principal';
  };
  capital: { nativeHorizon: 'point-in-time'; cet1: number; minimumCET1Ratio: number; rwaBefore: number; loanRiskWeight: number };
  leverage: { nativeHorizon: 'point-in-time'; tier1Capital: number; minimumLeverageRatio: number; leverageExposureBefore: number; loanExposureFactor: number };
  lcr: { nativeHorizon: '30-calendar-days'; hqla: number; minimumLCR: number; cappedNetCashOutflowBefore: number; loanNetOutflowFactor: number };
  nsfr: { nativeHorizon: 'one-year'; availableStableFunding: number; minimumNSFR: number; requiredStableFundingBefore: number; loanRSFFactor: number };
  concentration: { nativeHorizon: 'point-in-time'; tier1Capital: number; maximumExposureRatio: number; connectedExposureBefore: number; loanExposureFactor: number };
  assumptions: {
    otherAssetsFixed: true;
    capitalAndEarningsFixed: true;
    riskWeightsFixed: true;
    lcrNetOutflowAlreadyCapped: true;
    marginalLoanFactorsFixed: true;
    regulatoryBuffersIncludedInMinimums: true;
  };
};

export type LoanCapacityConstraint = 'capital' | 'leverage' | 'lcr' | 'nsfr' | 'concentration';

export type LoanCapacityConstraintDiagnostic = {
  direction: 'minimum' | 'maximum';
  signedRawHeadroom: number;
  signedConvertedCapacity: number;
  breached: boolean;
  bindingState: 'breached' | 'binding-at-zero' | 'positive-binding' | 'not-binding';
};

function deriveSignedConstraintArithmetic(input: {
  direction: LoanCapacityConstraintDiagnostic['direction'];
  numerator: number;
  denominator: number;
  threshold: number;
  marginalRuleUsagePerLoan: number;
}) {
  const directionSign = input.direction === 'minimum' ? 1 : -1;
  const signedRawHeadroom = directionSign * (input.numerator - input.threshold * input.denominator);
  return {
    direction: input.direction,
    signedRawHeadroom,
    signedConvertedCapacity: signedRawHeadroom / input.marginalRuleUsagePerLoan,
  };
}

export type LoanCapacityResult = {
  constraintDiagnostics: Record<LoanCapacityConstraint, LoanCapacityConstraintDiagnostic>;
  signedRawHeadrooms: Record<LoanCapacityConstraint, number>;
  signedConvertedCapacities: Record<LoanCapacityConstraint, number>;
  feasibleLoanCapacity: number;
  bindingConstraint: LoanCapacityConstraint;
  bindingConstraints: LoanCapacityConstraint[];
  breachedConstraints: LoanCapacityConstraint[];
  capacityUnit: SyntheticAmountUnit;
  capacitiesAreAdditive: false;
  ratiosWereAdded: false;
  mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1';
  mappingTarget: LoanCapacityInput['mappingTarget'];
  nativeHorizons: Record<LoanCapacityConstraint, LoanCapacityInput[LoanCapacityConstraint]['nativeHorizon']>;
  ruleAssumptions: LoanCapacityInput['assumptions'];
};

/** Convert each heterogeneous rule to the same marginal-loan amount before taking min. */
export function loanCapacityMetrics(input: LoanCapacityInput): LoanCapacityResult | null {
  if (
    input.synthetic !== true
    || input.amountUnit !== 'SYN-currency'
    || input.capacityUnit !== 'SYN-currency'
    || input.ratioUnit !== 'decimal-ratio'
    || input.mappingVersion !== 'SYNTHETIC_LOCAL_LINEAR_V1'
    || input.mappingTarget.currency !== 'SYN'
    || input.mappingTarget.mappingBasis !== 'incremental-drawn-term-loan-principal'
    || !uniqueNonEmpty([input.mappingTarget.loanInstrumentId, input.mappingTarget.lenderLegalEntityId, input.mappingTarget.decisionTime])
    || !Number.isFinite(Date.parse(input.mappingTarget.decisionTime))
    || input.capital.nativeHorizon !== 'point-in-time'
    || input.leverage.nativeHorizon !== 'point-in-time'
    || input.lcr.nativeHorizon !== '30-calendar-days'
    || input.nsfr.nativeHorizon !== 'one-year'
    || input.concentration.nativeHorizon !== 'point-in-time'
    || !Object.values(input.assumptions).every((value) => value === true)
  ) return null;
  const values = [
    input.capital.cet1, input.capital.minimumCET1Ratio, input.capital.rwaBefore, input.capital.loanRiskWeight,
    input.leverage.tier1Capital, input.leverage.minimumLeverageRatio, input.leverage.leverageExposureBefore, input.leverage.loanExposureFactor,
    input.lcr.hqla, input.lcr.minimumLCR, input.lcr.cappedNetCashOutflowBefore, input.lcr.loanNetOutflowFactor,
    input.nsfr.availableStableFunding, input.nsfr.minimumNSFR, input.nsfr.requiredStableFundingBefore, input.nsfr.loanRSFFactor,
    input.concentration.tier1Capital, input.concentration.maximumExposureRatio, input.concentration.connectedExposureBefore, input.concentration.loanExposureFactor,
  ];
  if (!finiteNonNegative(...values)) return null;
  if (
    !positive(input.capital.minimumCET1Ratio)
    || !positive(input.capital.loanRiskWeight)
    || !positive(input.leverage.minimumLeverageRatio)
    || !positive(input.leverage.loanExposureFactor)
    || !positive(input.lcr.minimumLCR)
    || !positive(input.lcr.loanNetOutflowFactor)
    || !positive(input.nsfr.minimumNSFR)
    || !positive(input.nsfr.loanRSFFactor)
    || !positive(input.concentration.maximumExposureRatio)
    || input.concentration.maximumExposureRatio > 1
    || !positive(input.concentration.loanExposureFactor)
  ) return null;

  const arithmeticByConstraint = {
    capital: deriveSignedConstraintArithmetic({ direction: 'minimum', numerator: input.capital.cet1, denominator: input.capital.rwaBefore, threshold: input.capital.minimumCET1Ratio, marginalRuleUsagePerLoan: input.capital.minimumCET1Ratio * input.capital.loanRiskWeight }),
    leverage: deriveSignedConstraintArithmetic({ direction: 'minimum', numerator: input.leverage.tier1Capital, denominator: input.leverage.leverageExposureBefore, threshold: input.leverage.minimumLeverageRatio, marginalRuleUsagePerLoan: input.leverage.minimumLeverageRatio * input.leverage.loanExposureFactor }),
    lcr: deriveSignedConstraintArithmetic({ direction: 'minimum', numerator: input.lcr.hqla, denominator: input.lcr.cappedNetCashOutflowBefore, threshold: input.lcr.minimumLCR, marginalRuleUsagePerLoan: input.lcr.minimumLCR * input.lcr.loanNetOutflowFactor }),
    nsfr: deriveSignedConstraintArithmetic({ direction: 'minimum', numerator: input.nsfr.availableStableFunding, denominator: input.nsfr.requiredStableFundingBefore, threshold: input.nsfr.minimumNSFR, marginalRuleUsagePerLoan: input.nsfr.minimumNSFR * input.nsfr.loanRSFFactor }),
    concentration: deriveSignedConstraintArithmetic({ direction: 'maximum', numerator: input.concentration.connectedExposureBefore, denominator: input.concentration.tier1Capital, threshold: input.concentration.maximumExposureRatio, marginalRuleUsagePerLoan: input.concentration.loanExposureFactor }),
  };
  const orderedConstraints = Object.keys(arithmeticByConstraint) as LoanCapacityConstraint[];
  const signedRawHeadrooms = Object.fromEntries(orderedConstraints.map((constraint) => [constraint, arithmeticByConstraint[constraint].signedRawHeadroom])) as Record<LoanCapacityConstraint, number>;
  const signedConvertedCapacities = Object.fromEntries(orderedConstraints.map((constraint) => [constraint, arithmeticByConstraint[constraint].signedConvertedCapacity])) as Record<LoanCapacityConstraint, number>;
  if (![...Object.values(signedRawHeadrooms), ...Object.values(signedConvertedCapacities)].every(Number.isFinite)) return null;
  const minimumSignedConvertedCapacity = Math.min(...Object.values(signedConvertedCapacities));
  const feasibleLoanCapacity = Math.max(0, minimumSignedConvertedCapacity);
  const bindingConstraints = orderedConstraints.filter((constraint) => near(signedConvertedCapacities[constraint], minimumSignedConvertedCapacity));
  const breachedConstraints = orderedConstraints.filter((constraint) => signedConvertedCapacities[constraint] < 0 && !near(signedConvertedCapacities[constraint], 0));
  const constraintDiagnostics = Object.fromEntries(orderedConstraints.map((constraint) => {
    const signedConvertedCapacity = signedConvertedCapacities[constraint];
    const isBinding = bindingConstraints.includes(constraint);
    const breached = signedConvertedCapacity < 0 && !near(signedConvertedCapacity, 0);
    const bindingState: LoanCapacityConstraintDiagnostic['bindingState'] = breached
      ? 'breached'
      : isBinding && near(signedConvertedCapacity, 0)
        ? 'binding-at-zero'
        : isBinding && signedConvertedCapacity > 0
          ? 'positive-binding'
          : 'not-binding';
    return [constraint, {
      direction: arithmeticByConstraint[constraint].direction,
      signedRawHeadroom: signedRawHeadrooms[constraint],
      signedConvertedCapacity,
      breached,
      bindingState,
    }];
  })) as Record<LoanCapacityConstraint, LoanCapacityConstraintDiagnostic>;

  return {
    constraintDiagnostics,
    signedRawHeadrooms,
    signedConvertedCapacities,
    feasibleLoanCapacity,
    bindingConstraint: bindingConstraints[0],
    bindingConstraints,
    breachedConstraints,
    capacityUnit: 'SYN-currency',
    capacitiesAreAdditive: false,
    ratiosWereAdded: false,
    mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1',
    mappingTarget: { ...input.mappingTarget },
    nativeHorizons: {
      capital: input.capital.nativeHorizon,
      leverage: input.leverage.nativeHorizon,
      lcr: input.lcr.nativeHorizon,
      nsfr: input.nsfr.nativeHorizon,
      concentration: input.concentration.nativeHorizon,
    },
    ruleAssumptions: { ...input.assumptions },
  };
}

export type CreditMenuLevel = {
  offerRatePct: number;
  approvedLimit: number;
  termMonths: number;
  collateralRequirementPct: number;
  covenantCount: number;
  rejectionProbabilityPct: number;
};

export type CreditMenuInput = {
  synthetic: true;
  amountUnit: SyntheticAmountUnit;
  rateUnit: AnnualRateUnit;
  probabilityUnit: ProbabilityUnit;
  baseline: CreditMenuLevel;
  proposed: CreditMenuLevel;
  frozen: {
    borrowerPD: true;
    borrowerLGD: true;
    collateralValue: true;
    bankRiskTolerance: true;
  };
  rationingModel: {
    framework: 'none' | 'stiglitz-weiss';
    higherRateReducesExpectedReturnUnderModel: boolean;
  };
};

export type CreditMenuResult = {
  proposed: CreditMenuLevel;
  offerRateChangeBp: number;
  approvedLimitChange: number;
  termChangeMonths: number;
  collateralRequirementChangePctPoints: number;
  covenantCountChange: number;
  rejectionProbabilityChangePctPoints: number;
  tighteningDimensions: number;
  stiglitzWeissConditionalResult: boolean;
  modelConditionalOnly: true;
  universalCreditRationingClaim: false;
  independentBankLendingChannelIdentified: false;
};

function validCreditMenuLevel(level: CreditMenuLevel) {
  return finiteNonNegative(
    level.offerRatePct,
    level.approvedLimit,
    level.termMonths,
    level.collateralRequirementPct,
    level.covenantCount,
    level.rejectionProbabilityPct,
  )
    && Number.isSafeInteger(level.termMonths)
    && level.termMonths > 0
    && Number.isSafeInteger(level.covenantCount)
    && level.rejectionProbabilityPct <= 100;
}

/** A loan offer is a menu, not only a price. No identification claim is made here. */
export function creditMenuMetrics(input: CreditMenuInput): CreditMenuResult | null {
  if (
    input.synthetic !== true
    || input.amountUnit !== 'SYN-currency'
    || input.rateUnit !== 'percent-per-year'
    || input.probabilityUnit !== 'percent-probability'
    || !['none', 'stiglitz-weiss'].includes(input.rationingModel.framework)
    || !Object.values(input.frozen).every((value) => value === true)
    || !validCreditMenuLevel(input.baseline)
    || !validCreditMenuLevel(input.proposed)
    || (input.rationingModel.framework === 'none' && input.rationingModel.higherRateReducesExpectedReturnUnderModel)
  ) return null;

  const offerRateChangeBp = (input.proposed.offerRatePct - input.baseline.offerRatePct) * 100;
  const approvedLimitChange = input.proposed.approvedLimit - input.baseline.approvedLimit;
  const termChangeMonths = input.proposed.termMonths - input.baseline.termMonths;
  const collateralRequirementChangePctPoints = input.proposed.collateralRequirementPct - input.baseline.collateralRequirementPct;
  const covenantCountChange = input.proposed.covenantCount - input.baseline.covenantCount;
  const rejectionProbabilityChangePctPoints = input.proposed.rejectionProbabilityPct - input.baseline.rejectionProbabilityPct;
  const tighteningDimensions = [
    offerRateChangeBp > 0,
    approvedLimitChange < 0,
    termChangeMonths < 0,
    collateralRequirementChangePctPoints > 0,
    covenantCountChange > 0,
    rejectionProbabilityChangePctPoints > 0,
  ].filter(Boolean).length;

  return {
    proposed: { ...input.proposed },
    offerRateChangeBp,
    approvedLimitChange,
    termChangeMonths,
    collateralRequirementChangePctPoints,
    covenantCountChange,
    rejectionProbabilityChangePctPoints,
    tighteningDimensions,
    stiglitzWeissConditionalResult: input.rationingModel.framework === 'stiglitz-weiss'
      && input.rationingModel.higherRateReducesExpectedReturnUnderModel,
    modelConditionalOnly: true,
    universalCreditRationingClaim: false,
    independentBankLendingChannelIdentified: false,
  };
}

export type AllocationBankInput = {
  bankId: string;
  fixedRiskToleranceScore: number;
};

export type AllocationBorrowerInput = {
  borrowerId: string;
  fixedPDPct: number;
  fixedLGDPct: number;
  fixedCollateralValue: number;
  totalFinancingDemand: number;
  relationshipBankId: string;
};

export type AllocationPairInput = {
  bankId: string;
  borrowerId: string;
  preAmount: number;
  postAmount: number;
};

export type ExternalFinancingInput = {
  borrowerId: string;
  preAmount: number;
  postAmount: number;
};

export type BankBorrowerAllocationInput = {
  synthetic: true;
  amountUnit: SyntheticAmountUnit;
  probabilityUnit: ProbabilityUnit;
  banks: AllocationBankInput[];
  borrowers: AllocationBorrowerInput[];
  pairs: AllocationPairInput[];
  externalFinancing: ExternalFinancingInput[];
  frozen: {
    borrowerPD: true;
    borrowerLGD: true;
    collateralValue: true;
    bankRiskTolerance: true;
  };
};

export type BankBorrowerAllocationResult = {
  pairChanges: { bankId: string; borrowerId: string; change: number }[];
  bankRows: { bankId: string; preAmount: number; postAmount: number; change: number }[];
  borrowerRows: { borrowerId: string; bankLoanChange: number; externalFinancingChange: number; totalFinancingChange: number }[];
  systemBankLendingChange: number;
  totalFinancingChange: number;
  crossBankReallocationAbsorbed: number;
  externalSubstitutionIncrease: number;
  relationshipAmountChange: number;
  relationshipRetainedCount: number;
  expectedLossAmountChangeAtFrozenRisk: number;
  riskMetricsFrozen: true;
  bankRiskToleranceFrozen: true;
  independentSupplyIdentified: false;
};

/** Two-bank allocation matrix with risk and collateral held fixed by construction. */
export function bankBorrowerAllocationMetrics(input: BankBorrowerAllocationInput): BankBorrowerAllocationResult | null {
  if (
    input.synthetic !== true
    || input.amountUnit !== 'SYN-currency'
    || input.probabilityUnit !== 'percent-probability'
    || input.banks.length !== 2
    || input.borrowers.length < 2
    || !uniqueNonEmpty(input.banks.map((bank) => bank.bankId))
    || !uniqueNonEmpty(input.borrowers.map((borrower) => borrower.borrowerId))
    || !Object.values(input.frozen).every((value) => value === true)
  ) return null;
  if (!finiteNonNegative(
    ...input.banks.map((bank) => bank.fixedRiskToleranceScore),
    ...input.borrowers.flatMap((borrower) => [borrower.fixedPDPct, borrower.fixedLGDPct, borrower.fixedCollateralValue, borrower.totalFinancingDemand]),
    ...input.pairs.flatMap((pair) => [pair.preAmount, pair.postAmount]),
    ...input.externalFinancing.flatMap((item) => [item.preAmount, item.postAmount]),
  )) return null;
  if (
    input.banks.some((bank) => bank.fixedRiskToleranceScore > 100)
    || input.borrowers.some((borrower) => borrower.fixedPDPct > 100 || borrower.fixedLGDPct > 100)
    || input.borrowers.some((borrower) => !input.banks.some((bank) => bank.bankId === borrower.relationshipBankId))
  ) return null;

  const pairKeys = input.pairs.map((pair) => `${pair.bankId}::${pair.borrowerId}`);
  const expectedPairKeys = input.banks.flatMap((bank) => input.borrowers.map((borrower) => `${bank.bankId}::${borrower.borrowerId}`));
  if (!uniqueNonEmpty(pairKeys) || pairKeys.length !== expectedPairKeys.length || !expectedPairKeys.every((key) => pairKeys.includes(key))) return null;
  if (!uniqueNonEmpty(input.externalFinancing.map((item) => item.borrowerId)) || input.externalFinancing.length !== input.borrowers.length) return null;
  if (!input.borrowers.every((borrower) => input.externalFinancing.some((item) => item.borrowerId === borrower.borrowerId))) return null;

  const demandRespected = input.borrowers.every((borrower) => {
    const external = input.externalFinancing.find((item) => item.borrowerId === borrower.borrowerId)!;
    const preTotal = input.pairs.filter((pair) => pair.borrowerId === borrower.borrowerId).reduce((sum, pair) => sum + pair.preAmount, 0) + external.preAmount;
    const postTotal = input.pairs.filter((pair) => pair.borrowerId === borrower.borrowerId).reduce((sum, pair) => sum + pair.postAmount, 0) + external.postAmount;
    return preTotal <= borrower.totalFinancingDemand + 1e-9 && postTotal <= borrower.totalFinancingDemand + 1e-9;
  });
  if (!demandRespected) return null;

  const pairChanges = input.pairs.map((pair) => ({ ...pair, change: pair.postAmount - pair.preAmount }))
    .map(({ bankId, borrowerId, change }) => ({ bankId, borrowerId, change }));
  const bankRows = input.banks.map((bank) => {
    const bankPairs = input.pairs.filter((pair) => pair.bankId === bank.bankId);
    const preAmount = bankPairs.reduce((sum, pair) => sum + pair.preAmount, 0);
    const postAmount = bankPairs.reduce((sum, pair) => sum + pair.postAmount, 0);
    return { bankId: bank.bankId, preAmount, postAmount, change: postAmount - preAmount };
  });
  const borrowerRows = input.borrowers.map((borrower) => {
    const borrowerPairs = input.pairs.filter((pair) => pair.borrowerId === borrower.borrowerId);
    const external = input.externalFinancing.find((item) => item.borrowerId === borrower.borrowerId)!;
    const bankLoanChange = borrowerPairs.reduce((sum, pair) => sum + pair.postAmount - pair.preAmount, 0);
    const externalFinancingChange = external.postAmount - external.preAmount;
    return { borrowerId: borrower.borrowerId, bankLoanChange, externalFinancingChange, totalFinancingChange: bankLoanChange + externalFinancingChange };
  });
  const crossBankReallocationAbsorbed = input.borrowers.reduce((total, borrower) => {
    const borrowerPairChanges = pairChanges.filter((pair) => pair.borrowerId === borrower.borrowerId).map((pair) => pair.change);
    const losses = -borrowerPairChanges.filter((change) => change < 0).reduce((sum, change) => sum + change, 0);
    const gains = borrowerPairChanges.filter((change) => change > 0).reduce((sum, change) => sum + change, 0);
    return total + Math.min(losses, gains);
  }, 0);
  const externalSubstitutionIncrease = input.externalFinancing.reduce((sum, item) => sum + Math.max(0, item.postAmount - item.preAmount), 0);
  const relationshipPairs = input.pairs.filter((pair) => {
    const borrower = input.borrowers.find((item) => item.borrowerId === pair.borrowerId)!;
    return borrower.relationshipBankId === pair.bankId;
  });
  const expectedLossBefore = input.pairs.reduce((sum, pair) => {
    const borrower = input.borrowers.find((item) => item.borrowerId === pair.borrowerId)!;
    return sum + pair.preAmount * borrower.fixedPDPct / 100 * borrower.fixedLGDPct / 100;
  }, 0);
  const expectedLossAfter = input.pairs.reduce((sum, pair) => {
    const borrower = input.borrowers.find((item) => item.borrowerId === pair.borrowerId)!;
    return sum + pair.postAmount * borrower.fixedPDPct / 100 * borrower.fixedLGDPct / 100;
  }, 0);

  return {
    pairChanges,
    bankRows,
    borrowerRows,
    systemBankLendingChange: bankRows.reduce((sum, row) => sum + row.change, 0),
    totalFinancingChange: borrowerRows.reduce((sum, row) => sum + row.totalFinancingChange, 0),
    crossBankReallocationAbsorbed,
    externalSubstitutionIncrease,
    relationshipAmountChange: relationshipPairs.reduce((sum, pair) => sum + pair.postAmount - pair.preAmount, 0),
    relationshipRetainedCount: relationshipPairs.filter((pair) => pair.preAmount > 0 && pair.postAmount > 0).length,
    expectedLossAmountChangeAtFrozenRisk: expectedLossAfter - expectedLossBefore,
    riskMetricsFrozen: true,
    bankRiskToleranceFrozen: true,
    independentSupplyIdentified: false,
  };
}

export type IdentificationPairInput = {
  bankId: string;
  borrowerId: string;
  preAmount: number;
  postAmount: number;
};

export type IdentificationSubstitutionInput = {
  synthetic: true;
  amountUnit: SyntheticAmountUnit;
  realOutcomeUnit: RealOutcomeUnit;
  banks: { bankId: string; exposed: boolean }[];
  borrowers: { borrowerId: string }[];
  pairs: IdentificationPairInput[];
  otherFinancing: { borrowerId: string; preAmount: number; postAmount: number }[];
  realOutcomes: { borrowerId: string; preIndex: number; postIndex: number }[];
  frozen: {
    borrowerPD: true;
    borrowerLGD: true;
    collateralValue: true;
    bankRiskTolerance: true;
  };
  design: {
    shockExogeneitySupported: boolean;
    preTrendsPassed: boolean;
    demandVariationControlled: boolean;
    matchingFormationExitSelectionAddressed: boolean;
    spilloversAddressed: boolean;
  };
};

export type LendingIdentificationStatus = 'descriptive-only' | 'candidate-not-identified' | 'identified-under-stated-assumptions';

export type IdentificationSubstitutionResult = {
  pairEstimandCurrency: number | null;
  borrowerTotalMeanObservedChangeCurrency: number;
  realOutcomeMeanObservedChangeIndex: number;
  exposedBankMeanChangeCurrency: number | null;
  controlBankMeanChangeCurrency: number | null;
  otherFinancingMeanChangeCurrency: number;
  pairIdentificationStatus: LendingIdentificationStatus;
  borrowerTotalIdentificationStatus: LendingIdentificationStatus;
  realOutcomeIdentificationStatus: LendingIdentificationStatus;
  bankSupplyResponseSupported: boolean;
  completeBankLendingTransmissionSupported: boolean;
  borrowerTotalObservedDecline: boolean;
  realOutcomeObservedDecline: boolean;
  borrowerTimeRelationshipSupportByBorrower: {
    borrowerId: string;
    preActiveRelationshipCount: number;
    postActiveRelationshipCount: number;
    perPeriodActiveCountEligible: boolean;
    stableExposedRelationship: boolean;
    stableControlRelationshipCount: number;
    stableControlBankIds: string[];
    stableEstimationSupportEligible: boolean;
  }[];
  stablePairEstimationSupportEligible: boolean;
  stableSupportDerivedFromObservedBalances: true;
  matchingSelectionDesignGateSatisfied: boolean;
  estimandOrder: readonly ['pair', 'borrower-total-financing', 'real-outcome'];
};

function isIdentified(status: LendingIdentificationStatus) {
  return status === 'identified-under-stated-assumptions';
}

/** Keep pair, borrower-total and real estimands separate; co-movement never self-identifies supply. */
export function identificationSubstitutionMetrics(input: IdentificationSubstitutionInput): IdentificationSubstitutionResult | null {
  const designGateValues = [
    input.design.shockExogeneitySupported,
    input.design.preTrendsPassed,
    input.design.demandVariationControlled,
    input.design.matchingFormationExitSelectionAddressed,
    input.design.spilloversAddressed,
  ];
  if (
    input.synthetic !== true
    || input.amountUnit !== 'SYN-currency'
    || input.realOutcomeUnit !== 'SYN-real-index'
    || input.banks.length < 2
    || input.borrowers.length < 2
    || !uniqueNonEmpty(input.banks.map((bank) => bank.bankId))
    || !uniqueNonEmpty(input.borrowers.map((borrower) => borrower.borrowerId))
    || input.banks.filter((bank) => bank.exposed).length !== 1
    || !Object.values(input.frozen).every((value) => value === true)
    || designGateValues.some((value) => typeof value !== 'boolean')
  ) return null;
  if (!finiteNonNegative(
    ...input.pairs.flatMap((pair) => [pair.preAmount, pair.postAmount]),
    ...input.otherFinancing.flatMap((item) => [item.preAmount, item.postAmount]),
    ...input.realOutcomes.flatMap((item) => [item.preIndex, item.postIndex]),
  )) return null;

  const pairKeys = input.pairs.map((pair) => `${pair.bankId}::${pair.borrowerId}`);
  const expectedPairKeys = input.banks.flatMap((bank) => input.borrowers.map((borrower) => `${bank.bankId}::${borrower.borrowerId}`));
  if (!uniqueNonEmpty(pairKeys) || pairKeys.length !== expectedPairKeys.length || !expectedPairKeys.every((key) => pairKeys.includes(key))) return null;
  const otherIds = input.otherFinancing.map((item) => item.borrowerId);
  const realIds = input.realOutcomes.map((item) => item.borrowerId);
  const borrowerIds = input.borrowers.map((borrower) => borrower.borrowerId);
  if (!uniqueNonEmpty(otherIds) || !uniqueNonEmpty(realIds) || otherIds.length !== borrowerIds.length || realIds.length !== borrowerIds.length) return null;
  if (!borrowerIds.every((borrowerId) => otherIds.includes(borrowerId) && realIds.includes(borrowerId))) return null;

  const exposedBankId = input.banks.find((bank) => bank.exposed)!.bankId;
  const borrowerTimeRelationshipSupportByBorrower = input.borrowers.map((borrower) => {
    const borrowerPairs = input.pairs.filter((pair) => pair.borrowerId === borrower.borrowerId);
    const exposedPair = borrowerPairs.find((pair) => pair.bankId === exposedBankId)!;
    const stableControlPairs = borrowerPairs.filter((pair) => pair.bankId !== exposedBankId && pair.preAmount > 0 && pair.postAmount > 0);
    const preActiveRelationshipCount = borrowerPairs.filter((pair) => pair.preAmount > 0).length;
    const postActiveRelationshipCount = borrowerPairs.filter((pair) => pair.postAmount > 0).length;
    const stableExposedRelationship = exposedPair.preAmount > 0 && exposedPair.postAmount > 0;
    const stableEstimationSupportEligible = stableExposedRelationship && stableControlPairs.length >= 1;
    return {
      borrowerId: borrower.borrowerId,
      preActiveRelationshipCount,
      postActiveRelationshipCount,
      perPeriodActiveCountEligible: preActiveRelationshipCount >= 2 && postActiveRelationshipCount >= 2,
      stableExposedRelationship,
      stableControlRelationshipCount: stableControlPairs.length,
      stableControlBankIds: stableControlPairs.map((pair) => pair.bankId),
      stableEstimationSupportEligible,
    };
  });
  const stablePairEstimationSupportEligible = borrowerTimeRelationshipSupportByBorrower
    .every((item) => item.stableEstimationSupportEligible);
  const pairContrasts = borrowerTimeRelationshipSupportByBorrower.flatMap((support) => {
    if (!support.stableEstimationSupportEligible) return [];
    const exposedPair = input.pairs.find((pair) => pair.bankId === exposedBankId && pair.borrowerId === support.borrowerId)!;
    const stableControlPairs = input.pairs.filter((pair) => support.stableControlBankIds.includes(pair.bankId) && pair.borrowerId === support.borrowerId);
    const exposedChange = exposedPair.postAmount - exposedPair.preAmount;
    const controlMeanChange = stableControlPairs.reduce((sum, pair) => sum + pair.postAmount - pair.preAmount, 0) / stableControlPairs.length;
    return [{ borrowerId: support.borrowerId, exposedChange, controlMeanChange, contrast: exposedChange - controlMeanChange }];
  });
  const borrowerTotalChanges = input.borrowers.map((borrower) => {
    const bankChange = input.pairs.filter((pair) => pair.borrowerId === borrower.borrowerId).reduce((sum, pair) => sum + pair.postAmount - pair.preAmount, 0);
    const other = input.otherFinancing.find((item) => item.borrowerId === borrower.borrowerId)!;
    return bankChange + other.postAmount - other.preAmount;
  });
  const realChanges = input.borrowers.map((borrower) => {
    const outcome = input.realOutcomes.find((item) => item.borrowerId === borrower.borrowerId)!;
    return outcome.postIndex - outcome.preIndex;
  });
  const otherChanges = input.otherFinancing.map((item) => item.postAmount - item.preAmount);
  const mean = (values: number[]) => values.reduce((sum, value) => sum + value, 0) / values.length;
  const meanOrNull = (values: number[]) => values.length > 0 ? mean(values) : null;
  const pairEstimandCurrency = meanOrNull(pairContrasts.map((item) => item.contrast));
  const borrowerTotalMeanObservedChangeCurrency = mean(borrowerTotalChanges);
  const realOutcomeMeanObservedChangeIndex = mean(realChanges);
  const designPasses = designGateValues.every((value) => value === true)
    && stablePairEstimationSupportEligible;
  const pairIdentificationStatus: LendingIdentificationStatus = designPasses
    ? 'identified-under-stated-assumptions'
    : input.design.shockExogeneitySupported && input.design.preTrendsPassed
      ? 'candidate-not-identified'
      : 'descriptive-only';
  const borrowerTotalIdentificationStatus: LendingIdentificationStatus = 'descriptive-only';
  const realOutcomeIdentificationStatus: LendingIdentificationStatus = 'descriptive-only';
  const bankSupplyResponseSupported = isIdentified(pairIdentificationStatus) && pairEstimandCurrency !== null && pairEstimandCurrency < 0;
  const completeBankLendingTransmissionSupported = bankSupplyResponseSupported
    && isIdentified(borrowerTotalIdentificationStatus)
    && borrowerTotalMeanObservedChangeCurrency < 0
    && isIdentified(realOutcomeIdentificationStatus)
    && realOutcomeMeanObservedChangeIndex < 0;

  return {
    pairEstimandCurrency,
    borrowerTotalMeanObservedChangeCurrency,
    realOutcomeMeanObservedChangeIndex,
    exposedBankMeanChangeCurrency: meanOrNull(pairContrasts.map((item) => item.exposedChange)),
    controlBankMeanChangeCurrency: meanOrNull(pairContrasts.map((item) => item.controlMeanChange)),
    otherFinancingMeanChangeCurrency: mean(otherChanges),
    pairIdentificationStatus,
    borrowerTotalIdentificationStatus,
    realOutcomeIdentificationStatus,
    bankSupplyResponseSupported,
    completeBankLendingTransmissionSupported,
    borrowerTotalObservedDecline: borrowerTotalMeanObservedChangeCurrency < 0,
    realOutcomeObservedDecline: realOutcomeMeanObservedChangeIndex < 0,
    borrowerTimeRelationshipSupportByBorrower,
    stablePairEstimationSupportEligible,
    stableSupportDerivedFromObservedBalances: true,
    matchingSelectionDesignGateSatisfied: input.design.matchingFormationExitSelectionAddressed,
    estimandOrder: ['pair', 'borrower-total-financing', 'real-outcome'],
  };
}

function offerComponentIds(prefix: string): AllInLoanCostComponentIds {
  return {
    referenceRate: `${prefix}:reference-rate`,
    marginalFundingCost: `${prefix}:marginal-funding-cost`,
    fundingSpread: `${prefix}:funding-spread`,
    expectedLoss: `${prefix}:expected-loss`,
    operatingCost: `${prefix}:operating-cost`,
    capitalShadowCost: `${prefix}:capital-shadow-cost`,
    liquidityShadowCost: `${prefix}:liquidity-shadow-cost`,
    concentrationOpportunityCost: `${prefix}:concentration-opportunity-cost`,
    targetResidualReturn: `${prefix}:target-residual-return`,
    upfrontFee: `${prefix}:upfront-fee`,
  };
}

const offerAllInFixture: AllInLoanOfferInput = {
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', feeOutputUnit: 'basis-points',
  referenceRatePct: 4, fundingQuote: { kind: 'all-in-mcf', marginalFundingCostPct: 5 }, expectedLossPct: 0.8,
  operatingCostPct: 0.4, capitalShadowCostPct: 0.6, liquidityShadowCostPct: 0.2,
  concentrationOpportunityCostPct: 0.2, targetResidualReturnPct: 0.8,
  upfrontFeeAmount: 1, principalAmount: 100, termMonths: 12, componentIds: offerComponentIds('offer-all-in'),
};
const offerSpreadFixture: AllInLoanOfferInput = {
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', feeOutputUnit: 'basis-points',
  referenceRatePct: 3, fundingQuote: { kind: 'spread-over-reference', fundingSpreadPct: 0.8 }, expectedLossPct: 0.5,
  operatingCostPct: 0.3, capitalShadowCostPct: 0.4, liquidityShadowCostPct: 0.2,
  concentrationOpportunityCostPct: 0.1, targetResidualReturnPct: 0.7,
  upfrontFeeAmount: 0.5, principalAmount: 100, termMonths: 6, componentIds: offerComponentIds('offer-spread'),
};
const fundingTighteningFixture: FundingPassThroughInput = {
  synthetic: true, rateUnit: 'percent-per-year', moveUnit: 'basis-points', weightUnit: 'decimal-ratio',
  policyMoveDirection: 'tightening', policyMoveBp: 100,
  sources: [
    { sourceId: 'deposits', kind: 'deposit', stockWeightRatio: 0.6, marginalFundingShareRatio: 0.6, openingCostPct: 2, depositBeta: 0.3 },
    { sourceId: 'wholesale', kind: 'wholesale', stockWeightRatio: 0.4, marginalFundingShareRatio: 0.4, openingCostPct: 4, passThroughCoefficient: 0.9 },
  ],
  depositSourceId: 'deposits', depositOutflowFraction: 0.25,
  replacementFunding: { openingCostPct: 4, passThroughCoefficient: 1, transitionPremiumBp: 20 },
};
const fundingEasingFixture: FundingPassThroughInput = {
  synthetic: true, rateUnit: 'percent-per-year', moveUnit: 'basis-points', weightUnit: 'decimal-ratio',
  policyMoveDirection: 'easing', policyMoveBp: 50,
  sources: [
    { sourceId: 'deposits', kind: 'deposit', stockWeightRatio: 0.7, marginalFundingShareRatio: 0.7, openingCostPct: 2, depositBeta: 0.2 },
    { sourceId: 'wholesale', kind: 'wholesale', stockWeightRatio: 0.3, marginalFundingShareRatio: 0.3, openingCostPct: 4, passThroughCoefficient: 1 },
  ],
  depositSourceId: 'deposits', depositOutflowFraction: 0,
  replacementFunding: { openingCostPct: 4, passThroughCoefficient: 1, transitionPremiumBp: 0 },
};
const fundingDifferentBasketsFixture: FundingPassThroughInput = {
  ...fundingTighteningFixture,
  sources: [
    { sourceId: 'deposits', kind: 'deposit', stockWeightRatio: 0.6, marginalFundingShareRatio: 0.2, openingCostPct: 2, depositBeta: 0.3 },
    { sourceId: 'wholesale', kind: 'wholesale', stockWeightRatio: 0.4, marginalFundingShareRatio: 0.8, openingCostPct: 4, passThroughCoefficient: 0.9 },
  ],
};
const equalBucketClockFixture: RepricingClockInput = {
  synthetic: true, amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', newBusinessRatePct: 7,
  buckets: (['floating', 'reset-3m', 'reset-6m', 'reset-12m', 'fixed'] as RepricingBucketId[])
    .map((bucket) => ({ bucket, balance: 20, currentRatePct: 5, repricedRatePct: 7 })),
};
const weightedClockFixture: RepricingClockInput = {
  synthetic: true, amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', newBusinessRatePct: 5.5,
  buckets: [
    { bucket: 'floating', balance: 40, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'reset-3m', balance: 20, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'reset-6m', balance: 15, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'reset-12m', balance: 15, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'fixed', balance: 10, currentRatePct: 4, repricedRatePct: 5.5 },
  ],
};
const capacityFixture: LoanCapacityInput = {
  synthetic: true, amountUnit: 'SYN-currency', capacityUnit: 'SYN-currency', ratioUnit: 'decimal-ratio', mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1',
  mappingTarget: { loanInstrumentId: 'SYN-TERM-LOAN-A', lenderLegalEntityId: 'SYN-BANK-A', currency: 'SYN', decisionTime: '2026-09-03T00:00:00Z', mappingBasis: 'incremental-drawn-term-loan-principal' },
  capital: { nativeHorizon: 'point-in-time', cet1: 15, minimumCET1Ratio: 0.1, rwaBefore: 100, loanRiskWeight: 0.5 },
  leverage: { nativeHorizon: 'point-in-time', tier1Capital: 12, minimumLeverageRatio: 0.03, leverageExposureBefore: 300, loanExposureFactor: 1 },
  lcr: { nativeHorizon: '30-calendar-days', hqla: 30, minimumLCR: 1, cappedNetCashOutflowBefore: 20, loanNetOutflowFactor: 0.2 },
  nsfr: { nativeHorizon: 'one-year', availableStableFunding: 120, minimumNSFR: 1, requiredStableFundingBefore: 100, loanRSFFactor: 0.5 },
  concentration: { nativeHorizon: 'point-in-time', tier1Capital: 12, maximumExposureRatio: 0.25, connectedExposureBefore: 0.5, loanExposureFactor: 0.05 },
  assumptions: { otherAssetsFixed: true, capitalAndEarningsFixed: true, riskWeightsFixed: true, lcrNetOutflowAlreadyCapped: true, marginalLoanFactorsFixed: true, regulatoryBuffersIncludedInMinimums: true },
};
const concentrationCapacityFixture: LoanCapacityInput = {
  ...capacityFixture,
  mappingTarget: { ...capacityFixture.mappingTarget, loanInstrumentId: 'SYN-TERM-LOAN-B' },
  capital: { nativeHorizon: 'point-in-time', cet1: 20, minimumCET1Ratio: 0.1, rwaBefore: 120, loanRiskWeight: 0.8 },
  leverage: { nativeHorizon: 'point-in-time', tier1Capital: 15, minimumLeverageRatio: 0.05, leverageExposureBefore: 200, loanExposureFactor: 1 },
  lcr: { nativeHorizon: '30-calendar-days', hqla: 50, minimumLCR: 1, cappedNetCashOutflowBefore: 30, loanNetOutflowFactor: 0.25 },
  nsfr: { nativeHorizon: 'one-year', availableStableFunding: 150, minimumNSFR: 1, requiredStableFundingBefore: 120, loanRSFFactor: 0.5 },
  concentration: { nativeHorizon: 'point-in-time', tier1Capital: 15, maximumExposureRatio: 0.25, connectedExposureBefore: 1.75, loanExposureFactor: 0.05 },
};
const menuFixture: CreditMenuInput = {
  synthetic: true, amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', probabilityUnit: 'percent-probability',
  baseline: { offerRatePct: 6, approvedLimit: 100, termMonths: 36, collateralRequirementPct: 50, covenantCount: 1, rejectionProbabilityPct: 10 },
  proposed: { offerRatePct: 7, approvedLimit: 80, termMonths: 24, collateralRequirementPct: 70, covenantCount: 3, rejectionProbabilityPct: 25 },
  frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
  rationingModel: { framework: 'stiglitz-weiss', higherRateReducesExpectedReturnUnderModel: true },
};
const allocationFixture: BankBorrowerAllocationInput = {
  synthetic: true, amountUnit: 'SYN-currency', probabilityUnit: 'percent-probability',
  banks: [{ bankId: 'A', fixedRiskToleranceScore: 60 }, { bankId: 'B', fixedRiskToleranceScore: 60 }],
  borrowers: [
    { borrowerId: 'X', fixedPDPct: 2, fixedLGDPct: 40, fixedCollateralValue: 100, totalFinancingDemand: 150, relationshipBankId: 'A' },
    { borrowerId: 'Y', fixedPDPct: 4, fixedLGDPct: 50, fixedCollateralValue: 80, totalFinancingDemand: 130, relationshipBankId: 'A' },
  ],
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 20, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 30 },
  ],
  externalFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 5 }, { borrowerId: 'Y', preAmount: 0, postAmount: 5 }],
  frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
};
const identifiedSubstitutionFixture: IdentificationSubstitutionInput = {
  synthetic: true, amountUnit: 'SYN-currency', realOutcomeUnit: 'SYN-real-index',
  banks: [{ bankId: 'A', exposed: true }, { bankId: 'B', exposed: false }],
  borrowers: [{ borrowerId: 'X' }, { borrowerId: 'Y' }],
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 55 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 30 },
  ],
  otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 10 }, { borrowerId: 'Y', preAmount: 0, postAmount: 5 }],
  realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 48 }, { borrowerId: 'Y', preIndex: 30, postIndex: 29 }],
  frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
  design: { shockExogeneitySupported: true, preTrendsPassed: true, demandVariationControlled: true, matchingFormationExitSelectionAddressed: true, spilloversAddressed: true },
};

const offerAllIn = allInLoanOfferMetrics(offerAllInFixture);
const offerSpread = allInLoanOfferMetrics(offerSpreadFixture);
const fundingTightening = fundingPassThroughMetrics(fundingTighteningFixture);
const fundingEasing = fundingPassThroughMetrics(fundingEasingFixture);
const fundingDifferentBaskets = fundingPassThroughMetrics(fundingDifferentBasketsFixture);
const equalClock = repricingClockMetrics(equalBucketClockFixture);
const weightedClock = repricingClockMetrics(weightedClockFixture);
const capacity = loanCapacityMetrics(capacityFixture);
const concentrationCapacity = loanCapacityMetrics(concentrationCapacityFixture);
const minimumRuleBreachCapacity = loanCapacityMetrics({
  ...capacityFixture,
  capital: { ...capacityFixture.capital, cet1: 5 },
});
const maximumRuleBreachCapacity = loanCapacityMetrics({
  ...capacityFixture,
  concentration: { ...capacityFixture.concentration, connectedExposureBefore: 4 },
});
const menu = creditMenuMetrics(menuFixture);
const allocation = bankBorrowerAllocationMetrics(allocationFixture);
const identified = identificationSubstitutionMetrics(identifiedSubstitutionFixture);
const descriptive = identificationSubstitutionMetrics({ ...identifiedSubstitutionFixture, design: { ...identifiedSubstitutionFixture.design, shockExogeneitySupported: false } });
const zeroControlRelationshipCounterexample = identificationSubstitutionMetrics({
  ...identifiedSubstitutionFixture,
  pairs: identifiedSubstitutionFixture.pairs.map((pair) => pair.bankId === 'B' ? { ...pair, preAmount: 0, postAmount: 0 } : pair),
});
const pureCrossTimeRelationshipSwitchCounterexample = identificationSubstitutionMetrics({
  ...identifiedSubstitutionFixture,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 0 },
    { bankId: 'B', borrowerId: 'X', preAmount: 0, postAmount: 100 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 100, postAmount: 0 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 0, postAmount: 100 },
  ],
});
const perPeriodCountsWithoutStableControlCounterexample = identificationSubstitutionMetrics({
  ...identifiedSubstitutionFixture,
  banks: [{ bankId: 'A', exposed: true }, { bankId: 'B', exposed: false }, { bankId: 'C', exposed: false }],
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 0 },
    { bankId: 'C', borrowerId: 'X', preAmount: 0, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 0 },
    { bankId: 'C', borrowerId: 'Y', preAmount: 0, postAmount: 20 },
  ],
});

export const bankLendingFixtureAssertions: BankLendingFixtureAssertion[] = [
  { id: 'offer-all-in-mcf', statement: '全含MCF直接进入资金成本，不再叠加reference。', passed: near(offerAllIn?.marginalFundingCostPct, 5) },
  { id: 'offer-reference-once', statement: '全含MCF模式不把reference ID作为第二个加总项；spread模式恰好加一次。', passed: offerAllIn !== null && !offerAllIn.additiveInterestComponentIds.includes(offerAllInFixture.componentIds.referenceRate) && offerSpread?.additiveInterestComponentIds.filter((id) => id === offerSpreadFixture.componentIds.referenceRate).length === 1 },
  { id: 'offer-interest', statement: '利息报价完整加总MCF、EL、运营、资本、流动性、集中度与目标剩余回报。', passed: offerAllIn !== null && near(offerAllIn.annualInterestRatePct, offerAllIn.marginalFundingCostPct + offerAllIn.expectedLossPct + offerAllIn.operatingCostPct + offerAllIn.capitalShadowCostPct + offerAllIn.liquidityShadowCostPct + offerAllIn.concentrationOpportunityCostPct + offerAllIn.targetResidualReturnPct) && near(offerAllIn.annualInterestRatePct, 8) },
  { id: 'offer-fee-separate', statement: '12个月1/100费用单列为100bp，且费用ID不在利息加总项中。', passed: near(offerAllIn?.annualizedFeeBp, 100) && offerAllIn !== null && !offerAllIn.additiveInterestComponentIds.includes(offerAllInFixture.componentIds.upfrontFee) && near(offerAllIn.allInEquivalentPct - offerAllIn.annualInterestRatePct, offerAllIn.annualizedFeeBp / 100) },
  { id: 'offer-all-in-equivalent', statement: '费用年化后全含等价报价为9%。', passed: near(offerAllIn?.allInEquivalentPct, 9) },
  { id: 'offer-spread-convention', statement: 'spread quote先与reference合成MCF。', passed: near(offerSpread?.marginalFundingCostPct, 3.8) && near(offerSpread?.fundingSpreadPct, 0.8) },
  { id: 'offer-short-fee', statement: '6个月0.5/100费用简单年化为100bp。', passed: near(offerSpread?.annualizedFeeBp, 100) },
  { id: 'offer-component-ids-unique', statement: '所有报价成本组件ID互异，输出加总ID也保持互异。', passed: offerAllIn !== null && new Set(Object.values(offerAllInFixture.componentIds)).size === Object.values(offerAllInFixture.componentIds).length && new Set(offerAllIn.allInComponentIds).size === offerAllIn.componentIdCount },
  { id: 'offer-duplicate-component-rejected', statement: '任意两个成本组件复用同一ID时停止输出。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, componentIds: { ...offerAllInFixture.componentIds, concentrationOpportunityCost: offerAllInFixture.componentIds.capitalShadowCost } }) === null },
  { id: 'offer-signed-reference-accepted', statement: '有限负reference与有限有符号spread可以进入报价桥。', passed: near(allInLoanOfferMetrics({ ...offerSpreadFixture, referenceRatePct: -0.5, fundingQuote: { kind: 'spread-over-reference', fundingSpreadPct: -0.25 } })?.marginalFundingCostPct, -0.75) },
  { id: 'offer-mcf-below-reference-accepted', statement: '有限MCF低于reference时保留负融资楔子，不误判非法。', passed: near(allInLoanOfferMetrics({ ...offerAllInFixture, referenceRatePct: 4, fundingQuote: { kind: 'all-in-mcf', marginalFundingCostPct: 3.5 } })?.fundingSpreadPct, -0.5) },
  { id: 'offer-kind-whitelist', statement: '未知fundingQuote.kind被运行时白名单拒绝。', passed: allInLoanOfferMetrics({ ...offerSpreadFixture, fundingQuote: { kind: 'bogus', fundingSpreadPct: 0.8 } as unknown as LoanFundingQuote }) === null },
  { id: 'offer-nan-rejected', statement: '报价拒绝NaN。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, targetResidualReturnPct: Number.NaN }) === null },
  { id: 'offer-infinity-rejected', statement: '报价拒绝Infinity。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, principalAmount: Number.POSITIVE_INFINITY }) === null },
  { id: 'offer-negative-cost-rejected', statement: '报价拒绝负EL等非负成本项。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, expectedLossPct: -0.1 }) === null },
  { id: 'offer-zero-principal-rejected', statement: '报价拒绝零本金。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, principalAmount: 0 }) === null },
  { id: 'offer-zero-term-rejected', statement: '报价拒绝零期限。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, termMonths: 0 }) === null },
  { id: 'offer-unit-rejected', statement: '报价拒绝单位错配。', passed: allInLoanOfferMetrics({ ...offerAllInFixture, amountUnit: 'USD' as SyntheticAmountUnit }) === null },
  { id: 'funding-two-basket-coefficients', statement: '冻结样例中ACF存量篮子与MCF边际篮子的传导系数都为0.54。', passed: near(fundingTightening?.stockWeightedPassThroughCoefficient, 0.54) && near(fundingTightening?.marginalFundingPassThroughCoefficient, 0.54) },
  { id: 'funding-stage-one', statement: '100bp政策移动使ACF与MCF篮子第一阶段都变化54bp。', passed: near(fundingTightening?.averageFirstStageChangeBp, 54) && near(fundingTightening?.marginalFirstStageChangeBp, 54) },
  { id: 'funding-displaced-shares', statement: '存量与边际篮子中60%的存款份额流出25%，分别替代15%。', passed: near(fundingTightening?.displacedDepositStockWeight, 0.15) && near(fundingTightening?.displacedDepositMarginalShare, 0.15) },
  { id: 'funding-stage-two', statement: '两个篮子的替代融资二阶段额外成本都为43.5bp。', passed: near(fundingTightening?.replacementEffectOnAverageCostBp, 43.5) && near(fundingTightening?.replacementEffectOnMarginalCostBp, 43.5) },
  { id: 'funding-total', statement: '两阶段ACF与MCF篮子总变化都为97.5bp。', passed: near(fundingTightening?.totalAverageFundingCostChangeBp, 97.5) && near(fundingTightening?.totalMarginalFundingCostChangeBp, 97.5) },
  { id: 'funding-baskets-separate', statement: '只改变边际融资份额会改变MCF篮子，却不改变ACF存量篮子。', passed: near(fundingDifferentBaskets?.totalAverageFundingCostChangeBp, 97.5) && near(fundingDifferentBaskets?.totalMarginalFundingCostChangeBp, 92.5) && near(fundingDifferentBaskets?.openingAverageFundingCostPct, 2.8) && near(fundingDifferentBaskets?.openingMarginalFundingCostPct, 3.6) },
  { id: 'funding-easing-signed', statement: '50bp宽松生成-50bp有符号移动。', passed: near(fundingEasing?.signedPolicyMoveBp, -50) },
  { id: 'funding-easing-stage-one', statement: '无流出时ACF与MCF篮子均下降22bp，替代效应为0。', passed: near(fundingEasing?.averageFirstStageChangeBp, -22) && near(fundingEasing?.marginalFirstStageChangeBp, -22) && near(fundingEasing?.replacementEffectOnMarginalCostBp, 0) },
  { id: 'funding-stock-weight-rejected', statement: '存量融资权重不合计1时停止输出。', passed: fundingPassThroughMetrics({ ...fundingTighteningFixture, sources: fundingTighteningFixture.sources.map((source) => ({ ...source, stockWeightRatio: 0.4 })) }) === null },
  { id: 'funding-marginal-share-rejected', statement: '边际融资份额不合计1时独立停止输出。', passed: fundingPassThroughMetrics({ ...fundingTighteningFixture, sources: fundingTighteningFixture.sources.map((source) => ({ ...source, marginalFundingShareRatio: 0.4 })) }) === null },
  { id: 'funding-outflow-rejected', statement: '存款流出比例超过1时停止输出。', passed: fundingPassThroughMetrics({ ...fundingTighteningFixture, depositOutflowFraction: 1.01 }) === null },
  { id: 'funding-unit-rejected', statement: '融资传导拒绝单位错配。', passed: fundingPassThroughMetrics({ ...fundingTighteningFixture, moveUnit: 'percent' as BasisPointUnit }) === null },
  { id: 'funding-negative-rejected', statement: '融资传导拒绝负政策幅度。', passed: fundingPassThroughMetrics({ ...fundingTighteningFixture, policyMoveBp: -1 }) === null },
  { id: 'funding-direction-whitelist', statement: '未知policyMoveDirection被运行时白名单拒绝。', passed: fundingPassThroughMetrics({ ...fundingTighteningFixture, policyMoveDirection: 'bogus' as FundingPassThroughInput['policyMoveDirection'] }) === null },
  { id: 'clock-month-zero', statement: '时点0仅浮息桶重定价，存量利率5.4%。', passed: near(equalClock?.stockRateMonth0Pct, 5.4) && near(equalClock?.repricedShareMonth0, 0.2) },
  { id: 'clock-month-three', statement: '第3月浮息与3月桶重定价，存量利率5.8%。', passed: near(equalClock?.stockRateMonth3Pct, 5.8) && near(equalClock?.repricedShareMonth3, 0.4) },
  { id: 'clock-month-twelve', statement: '第12月除固定桶外均重定价，存量利率6.6%。', passed: near(equalClock?.stockRateMonth12Pct, 6.6) && near(equalClock?.repricedShareMonth12, 0.8) },
  { id: 'clock-month-twenty-four', statement: '固定桶在24月仍未按新率重定价。', passed: near(equalClock?.stockRateMonth24Pct, 6.6) && near(equalClock?.repricedShareMonth24, 0.8) },
  { id: 'clock-new-business-separate', statement: '新贷报价与存量利率分列。', passed: near(equalClock?.newBusinessRatePct, 7) && equalClock?.newBusinessIncludedInStock === false },
  { id: 'clock-weighted', statement: '不等余额桶在0/3/12月得到4.6/4.9/5.35。', passed: near(weightedClock?.stockRateMonth0Pct, 4.6) && near(weightedClock?.stockRateMonth3Pct, 4.9) && near(weightedClock?.stockRateMonth12Pct, 5.35) },
  { id: 'clock-missing-rejected', statement: '重定价时钟拒绝缺桶。', passed: repricingClockMetrics({ ...equalBucketClockFixture, buckets: equalBucketClockFixture.buckets.slice(0, 4) }) === null },
  { id: 'clock-duplicate-rejected', statement: '重定价时钟拒绝重复桶。', passed: repricingClockMetrics({ ...equalBucketClockFixture, buckets: equalBucketClockFixture.buckets.map((bucket, index) => index === 4 ? { ...bucket, bucket: 'floating' } : bucket) }) === null },
  { id: 'clock-zero-stock-rejected', statement: '重定价时钟拒绝零存量。', passed: repricingClockMetrics({ ...equalBucketClockFixture, buckets: equalBucketClockFixture.buckets.map((bucket) => ({ ...bucket, balance: 0 })) }) === null },
  { id: 'clock-unit-rejected', statement: '重定价时钟拒绝单位错配。', passed: repricingClockMetrics({ ...equalBucketClockFixture, rateUnit: 'basis-points' as AnnualRateUnit }) === null },
  { id: 'capacity-capital', statement: '资本规则有符号换算容量100。', passed: near(capacity?.signedConvertedCapacities.capital, 100) },
  { id: 'capacity-leverage', statement: '杠杆规则有符号换算容量100。', passed: near(capacity?.signedConvertedCapacities.leverage, 100) },
  { id: 'capacity-lcr', statement: 'LCR规则有符号换算容量50。', passed: near(capacity?.signedConvertedCapacities.lcr, 50) },
  { id: 'capacity-nsfr', statement: 'NSFR规则有符号换算容量40。', passed: near(capacity?.signedConvertedCapacities.nsfr, 40) },
  { id: 'capacity-concentration', statement: '集中度规则有符号换算容量50。', passed: near(capacity?.signedConvertedCapacities.concentration, 50) },
  { id: 'capacity-min', statement: '统一单位后先取有符号最小值40，再与零取最大值；NSFR正容量绑定。', passed: near(capacity?.feasibleLoanCapacity, 40) && capacity?.bindingConstraint === 'nsfr' && capacity.constraintDiagnostics.nsfr.bindingState === 'positive-binding' },
  { id: 'capacity-not-additive', statement: '可行容量等于max(0, 五项有符号同口径容量的最小值)，而不是总和。', passed: capacity !== null && near(capacity.feasibleLoanCapacity, Math.max(0, Math.min(...Object.values(capacity.signedConvertedCapacities)))) && !near(capacity.feasibleLoanCapacity, Object.values(capacity.signedConvertedCapacities).reduce((sum, value) => sum + value, 0)) },
  { id: 'capacity-mapping-target', statement: '五项规则共同映射到同一贷款工具、法人、币种、决策时点与basis。', passed: capacity?.mappingTarget.loanInstrumentId === capacityFixture.mappingTarget.loanInstrumentId && capacity.mappingTarget.lenderLegalEntityId === capacityFixture.mappingTarget.lenderLegalEntityId && capacity.mappingTarget.currency === 'SYN' && capacity.mappingTarget.decisionTime === capacityFixture.mappingTarget.decisionTime && capacity.mappingTarget.mappingBasis === 'incremental-drawn-term-loan-principal' },
  { id: 'capacity-native-horizons', statement: 'LCR保留30日、NSFR保留一年，其余规则保留时点口径。', passed: capacity?.nativeHorizons.lcr === '30-calendar-days' && capacity.nativeHorizons.nsfr === 'one-year' && capacity.nativeHorizons.capital === 'point-in-time' && capacity.nativeHorizons.leverage === 'point-in-time' && capacity.nativeHorizons.concentration === 'point-in-time' },
  { id: 'capacity-concentration-binding', statement: '第二fixture由集中度容量40绑定。', passed: near(concentrationCapacity?.feasibleLoanCapacity, 40) && concentrationCapacity?.bindingConstraint === 'concentration' },
  { id: 'capacity-minimum-breach-signed', statement: '最低资本规则越界不被抹平：CET1=5、门槛10%、RWA=100、风险权重50%得到raw=-5、converted=-100、feasible=0且capital标记breached。', passed: near(minimumRuleBreachCapacity?.signedRawHeadrooms.capital, -5) && near(minimumRuleBreachCapacity?.signedConvertedCapacities.capital, -100) && minimumRuleBreachCapacity?.feasibleLoanCapacity === 0 && minimumRuleBreachCapacity.breachedConstraints.includes('capital') && minimumRuleBreachCapacity.constraintDiagnostics.capital.bindingState === 'breached' },
  { id: 'capacity-maximum-breach-signed', statement: '最高集中度规则越界也保留深度：上限3、既有暴露4、边际因子5%得到raw=-1、converted=-20、feasible=0且concentration标记breached。', passed: near(maximumRuleBreachCapacity?.signedRawHeadrooms.concentration, -1) && near(maximumRuleBreachCapacity?.signedConvertedCapacities.concentration, -20) && maximumRuleBreachCapacity?.feasibleLoanCapacity === 0 && maximumRuleBreachCapacity.breachedConstraints.includes('concentration') && maximumRuleBreachCapacity.constraintDiagnostics.concentration.bindingState === 'breached' },
  { id: 'capacity-zero-binding-distinct', statement: '恰好落在门槛时显示binding-at-zero，而不是breached。', passed: loanCapacityMetrics({ ...capacityFixture, capital: { ...capacityFixture.capital, cet1: 10 } })?.constraintDiagnostics.capital.bindingState === 'binding-at-zero' },
  { id: 'capacity-zero-denominator-rejected', statement: '容量映射拒绝零分母。', passed: loanCapacityMetrics({ ...capacityFixture, lcr: { ...capacityFixture.lcr, loanNetOutflowFactor: 0 } }) === null },
  { id: 'capacity-assumption-rejected', statement: '容量映射拒绝未冻结的规则假设。', passed: loanCapacityMetrics({ ...capacityFixture, assumptions: { ...capacityFixture.assumptions, riskWeightsFixed: false as true } }) === null },
  { id: 'capacity-target-rejected', statement: '缺失目标贷款工具ID时容量映射停止输出。', passed: loanCapacityMetrics({ ...capacityFixture, mappingTarget: { ...capacityFixture.mappingTarget, loanInstrumentId: '' } }) === null },
  { id: 'capacity-horizon-rejected', statement: '规则原生horizon错标时容量映射停止输出。', passed: loanCapacityMetrics({ ...capacityFixture, lcr: { ...capacityFixture.lcr, nativeHorizon: 'one-year' as LoanCapacityInput['lcr']['nativeHorizon'] } }) === null },
  { id: 'capacity-unit-rejected', statement: '容量映射拒绝单位错配。', passed: loanCapacityMetrics({ ...capacityFixture, capacityUnit: 'USD' as SyntheticAmountUnit }) === null },
  { id: 'capacity-infinity-rejected', statement: '容量映射拒绝Infinity。', passed: loanCapacityMetrics({ ...capacityFixture, capital: { ...capacityFixture.capital, cet1: Number.POSITIVE_INFINITY } }) === null },
  { id: 'menu-six-dimensions', statement: '价格、额度、期限、抵押、契约与拒绝六维均收紧。', passed: menu?.tighteningDimensions === 6 },
  { id: 'menu-price-limit', statement: '菜单价格上升100bp且额度减少20。', passed: near(menu?.offerRateChangeBp, 100) && near(menu?.approvedLimitChange, -20) },
  { id: 'menu-term-collateral', statement: '期限减少12月且抵押要求增加20个百分点。', passed: near(menu?.termChangeMonths, -12) && near(menu?.collateralRequirementChangePctPoints, 20) },
  { id: 'menu-model-conditional', statement: 'Stiglitz-Weiss型结果被标为模型条件命题。', passed: menu?.stiglitzWeissConditionalResult === true && menu?.modelConditionalOnly === true && menu?.universalCreditRationingClaim === false },
  { id: 'menu-not-identification', statement: '报价菜单本身不识别独立贷款供给渠道。', passed: menu?.independentBankLendingChannelIdentified === false },
  { id: 'menu-freeze-rejected', statement: '菜单拒绝把风险偏好放开到3.12边界。', passed: creditMenuMetrics({ ...menuFixture, frozen: { ...menuFixture.frozen, bankRiskTolerance: false as true } }) === null },
  { id: 'menu-negative-rejected', statement: '菜单拒绝负额度。', passed: creditMenuMetrics({ ...menuFixture, proposed: { ...menuFixture.proposed, approvedLimit: -1 } }) === null },
  { id: 'menu-probability-rejected', statement: '菜单拒绝超过100%的拒绝概率。', passed: creditMenuMetrics({ ...menuFixture, proposed: { ...menuFixture.proposed, rejectionProbabilityPct: 101 } }) === null },
  { id: 'menu-unit-rejected', statement: '菜单拒绝单位错配。', passed: creditMenuMetrics({ ...menuFixture, probabilityUnit: 'decimal-ratio' as ProbabilityUnit }) === null },
  { id: 'menu-framework-whitelist', statement: '未知rationing framework被运行时白名单拒绝。', passed: creditMenuMetrics({ ...menuFixture, rationingModel: { ...menuFixture.rationingModel, framework: 'bogus' as CreditMenuInput['rationingModel']['framework'] } }) === null },
  { id: 'allocation-bank-a', statement: '银行A贷款变化-50。', passed: near(allocation?.bankRows.find((row) => row.bankId === 'A')?.change, -50) },
  { id: 'allocation-bank-b', statement: '银行B贷款变化+30。', passed: near(allocation?.bankRows.find((row) => row.bankId === 'B')?.change, 30) },
  { id: 'allocation-reallocation', statement: '跨银行重新配置吸收30。', passed: near(allocation?.crossBankReallocationAbsorbed, 30) },
  { id: 'allocation-substitution', statement: '外部融资替代增加10。', passed: near(allocation?.externalSubstitutionIncrease, 10) },
  { id: 'allocation-total', statement: '银行体系贷款-20、借款人总融资-10。', passed: near(allocation?.systemBankLendingChange, -20) && near(allocation?.totalFinancingChange, -10) },
  { id: 'allocation-frozen', statement: '配置保持PD/LGD/抵押价值和risk tolerance冻结。', passed: allocation?.riskMetricsFrozen === true && allocation?.bankRiskToleranceFrozen === true },
  { id: 'allocation-not-identified', statement: '配置描述不被误标为供给识别。', passed: allocation?.independentSupplyIdentified === false },
  { id: 'allocation-matrix-rejected', statement: '配置拒绝不完整的银行借款人矩阵。', passed: bankBorrowerAllocationMetrics({ ...allocationFixture, pairs: allocationFixture.pairs.slice(0, 3) }) === null },
  { id: 'allocation-demand-rejected', statement: '配置拒绝超过冻结融资需求的post金额。', passed: bankBorrowerAllocationMetrics({ ...allocationFixture, pairs: allocationFixture.pairs.map((pair) => pair.bankId === 'B' && pair.borrowerId === 'X' ? { ...pair, postAmount: 200 } : pair) }) === null },
  { id: 'allocation-negative-rejected', statement: '配置拒绝负贷款金额。', passed: bankBorrowerAllocationMetrics({ ...allocationFixture, pairs: allocationFixture.pairs.map((pair, index) => index === 0 ? { ...pair, preAmount: -1 } : pair) }) === null },
  { id: 'allocation-unit-rejected', statement: '配置拒绝单位错配。', passed: bankBorrowerAllocationMetrics({ ...allocationFixture, amountUnit: 'USD' as SyntheticAmountUnit }) === null },
  { id: 'identification-pair', statement: '只在持续暴露行与持续控制行组成的实际支持集内，银行-借款人pair estimand为-37.5。', passed: near(identified?.pairEstimandCurrency ?? undefined, -37.5) },
  { id: 'identification-borrower-total', statement: '借款人总融资前后观察均值为-5且保持descriptive。', passed: near(identified?.borrowerTotalMeanObservedChangeCurrency, -5) && identified?.borrowerTotalIdentificationStatus === 'descriptive-only' },
  { id: 'identification-real', statement: '实体结果前后观察均值为-1.5且保持descriptive。', passed: near(identified?.realOutcomeMeanObservedChangeIndex, -1.5) && identified?.realOutcomeIdentificationStatus === 'descriptive-only' },
  { id: 'identification-pair-status', statement: '五项pair设计门与由余额计算的持续暴露/控制支持门均通过，才给pair层条件识别与银行供给反应支持。', passed: identified?.pairIdentificationStatus === 'identified-under-stated-assumptions' && identified?.stablePairEstimationSupportEligible === true && identified.stableSupportDerivedFromObservedBalances === true && identified.bankSupplyResponseSupported === true },
  { id: 'identification-complete-guard', statement: 'pair层条件支持不能替代后二层反事实，完整传导保持不支持。', passed: identified?.completeBankLendingTransmissionSupported === false },
  { id: 'identification-descriptive', statement: '冲击外生性缺失时相同pair数值降为描述且不支持银行供给反应。', passed: descriptive?.pairIdentificationStatus === 'descriptive-only' && descriptive?.bankSupplyResponseSupported === false && descriptive.completeBankLendingTransmissionSupported === false },
  { id: 'identification-stable-support', statement: '默认样例每位借款人都有持续暴露行和至少一条持续控制行，实际估计支持集由余额计算且控制均值只纳入持续控制关系。', passed: identified?.stablePairEstimationSupportEligible === true && identified.borrowerTimeRelationshipSupportByBorrower.every((item) => item.stableExposedRelationship && item.stableControlRelationshipCount >= 1 && item.stableEstimationSupportEligible) && near(identified.controlBankMeanChangeCurrency ?? undefined, 12.5) },
  { id: 'identification-zero-control-counterexample', statement: '控制行pre/post全零时没有持续控制关系；设计假设全真也必须降级，pair估计为空且不得支持银行供给反应。', passed: zeroControlRelationshipCounterexample?.stablePairEstimationSupportEligible === false && zeroControlRelationshipCounterexample.borrowerTimeRelationshipSupportByBorrower.every((item) => item.preActiveRelationshipCount === 1 && item.postActiveRelationshipCount === 1 && item.stableControlRelationshipCount === 0 && item.stableEstimationSupportEligible === false) && zeroControlRelationshipCounterexample.pairEstimandCurrency === null && zeroControlRelationshipCounterexample.pairIdentificationStatus === 'candidate-not-identified' && zeroControlRelationshipCounterexample.bankSupplyResponseSupported === false },
  { id: 'identification-cross-time-switch-counterexample', statement: 'A 100→0、B 0→100的纯跨期换行没有持续暴露或控制关系，必须降级，pair估计为空且不得支持银行供给反应。', passed: pureCrossTimeRelationshipSwitchCounterexample?.stablePairEstimationSupportEligible === false && pureCrossTimeRelationshipSwitchCounterexample.borrowerTimeRelationshipSupportByBorrower.every((item) => item.preActiveRelationshipCount === 1 && item.postActiveRelationshipCount === 1 && !item.stableExposedRelationship && item.stableControlRelationshipCount === 0 && item.stableEstimationSupportEligible === false) && pureCrossTimeRelationshipSwitchCounterexample.pairEstimandCurrency === null && pureCrossTimeRelationshipSwitchCounterexample.pairIdentificationStatus === 'candidate-not-identified' && pureCrossTimeRelationshipSwitchCounterexample.bankSupplyResponseSupported === false },
  { id: 'identification-period-counts-insufficient-counterexample', statement: '三银行反例A持续、B退出、C进入：pre/post各有两条active仍没有持续控制行；支持门失败、pair降级、估计为空且bankSupply为false。', passed: perPeriodCountsWithoutStableControlCounterexample?.stablePairEstimationSupportEligible === false && perPeriodCountsWithoutStableControlCounterexample.borrowerTimeRelationshipSupportByBorrower.every((item) => item.preActiveRelationshipCount === 2 && item.postActiveRelationshipCount === 2 && item.perPeriodActiveCountEligible && item.stableExposedRelationship && item.stableControlRelationshipCount === 0 && item.stableEstimationSupportEligible === false) && perPeriodCountsWithoutStableControlCounterexample.pairEstimandCurrency === null && perPeriodCountsWithoutStableControlCounterexample.pairIdentificationStatus === 'candidate-not-identified' && perPeriodCountsWithoutStableControlCounterexample.bankSupplyResponseSupported === false },
  { id: 'identification-matching-design-key-required', statement: '“匹配形成、退出与选择已处理”是显式设计证据门；缺失该键不能由持续关系支持自认证。', passed: identificationSubstitutionMetrics({ ...identifiedSubstitutionFixture, design: { shockExogeneitySupported: true, preTrendsPassed: true, demandVariationControlled: true, spilloversAddressed: true } as IdentificationSubstitutionInput['design'] }) === null },
  { id: 'identification-matrix-rejected', statement: '识别器拒绝不完整pair矩阵。', passed: identificationSubstitutionMetrics({ ...identifiedSubstitutionFixture, pairs: identifiedSubstitutionFixture.pairs.slice(0, 3) }) === null },
  { id: 'identification-freeze-rejected', statement: '识别器拒绝把抵押价值变化越界带入3.10。', passed: identificationSubstitutionMetrics({ ...identifiedSubstitutionFixture, frozen: { ...identifiedSubstitutionFixture.frozen, collateralValue: false as true } }) === null },
  { id: 'identification-unit-rejected', statement: '识别器拒绝实体结果单位错配。', passed: identificationSubstitutionMetrics({ ...identifiedSubstitutionFixture, realOutcomeUnit: 'percent' as RealOutcomeUnit }) === null },
  { id: 'identification-nan-rejected', statement: '识别器拒绝NaN结果值。', passed: identificationSubstitutionMetrics({ ...identifiedSubstitutionFixture, realOutcomes: identifiedSubstitutionFixture.realOutcomes.map((item, index) => index === 0 ? { ...item, postIndex: Number.NaN } : item) }) === null },
];

export function assertBankLendingFixtureIntegrity() {
  const failed = bankLendingFixtureAssertions.filter((assertion) => !assertion.passed);
  if (failed.length > 0) {
    throw new Error(`Bank-lending fixture integrity failed: ${failed.map((assertion) => assertion.id).join(', ')}`);
  }
  return {
    total: bankLendingFixtureAssertions.length,
    passed: bankLendingFixtureAssertions.length - failed.length,
    failed: failed.map((assertion) => assertion.id),
    allPassed: failed.length === 0,
  };
}

export const bankLendingFixtureIntegrityGate = assertBankLendingFixtureIntegrity();
