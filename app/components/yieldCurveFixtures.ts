export const curveCoordinateFixture = {
  maturitiesYears: [1, 2, 3],
  discountFactors: [0.97, 0.935, 0.89],
  compoundingConvention: 'continuous annual rate',
  annualCouponFrequency: 1,
  synthetic: true,
} as const;

export function continuousZeroRatePct(discountFactor: number, maturityYears: number) {
  return -Math.log(discountFactor) / maturityYears * 100;
}

export function intervalForwardRatePct(
  startDiscountFactor: number,
  endDiscountFactor: number,
  startYears: number,
  endYears: number,
) {
  return -(Math.log(endDiscountFactor) - Math.log(startDiscountFactor)) / (endYears - startYears) * 100;
}

export function annualParCouponPct(discountFactors: readonly number[]) {
  const last = discountFactors[discountFactors.length - 1];
  return (1 - last) / discountFactors.reduce((sum, value) => sum + value, 0) * 100;
}

export const curveCoordinateMetrics = {
  zeroRateContinuousPct: curveCoordinateFixture.discountFactors.map((discountFactor, index) => (
    continuousZeroRatePct(discountFactor, curveCoordinateFixture.maturitiesYears[index])
  )),
  intervalForwardRatePct: [
    intervalForwardRatePct(0.97, 0.935, 1, 2),
    intervalForwardRatePct(0.935, 0.89, 2, 3),
  ],
  threeYearAnnualParCouponPct: annualParCouponPct(curveCoordinateFixture.discountFactors),
} as const;

export type DecompositionConvention = 'additive-yield-teaching-approximation';

export const expectationsTermPremiumFixture = {
  maturitiesYears: [1, 2, 3, 4, 5],
  expectedShortPathPct: [3, 3.25, 3.5, 3.75, 4],
  expectedAverageShortRatePct: [3, 3.125, 3.25, 3.375, 3.5],
  estimatedYieldTermPremiumPct: [0.02, 0.08, 0.18, 0.32, 0.5],
  observedYieldPct: [3.02, 3.205, 3.43, 3.695, 4],
  decompositionConvention: 'additive-yield-teaching-approximation' as DecompositionConvention,
  jensenConvexityConvention: 'included-in-estimated-term-premium',
  synthetic: true,
} as const;

export const alternativeDecompositionFixture = {
  expectedAverageShortRatePct: [3, 3.1, 3.18, 3.22, 3.25],
  estimatedYieldTermPremiumPct: [0.02, 0.105, 0.25, 0.475, 0.75],
  observedYieldPct: expectationsTermPremiumFixture.observedYieldPct,
  interpretation: '基准时对应同一 observed curve；施加相同的两项情景移动后，仍对应同一 scenario-implied additive yield。',
  synthetic: true,
} as const;

export type HoldingReturnScenarioId = 'M5' | 'K5';

export const holdingReturnFixtures = {
  M5: { buyPrice: 94, salePrice: 97, shortGrossReturn: 1.03 },
  K5: { buyPrice: 91, salePrice: 95, shortGrossReturn: 1.025 },
} as const;

export function holdingPeriodReturnMetrics(id: HoldingReturnScenarioId) {
  const fixture = holdingReturnFixtures[id];
  const bondGrossReturn = fixture.salePrice / fixture.buyPrice;
  const simpleExcessReturn = bondGrossReturn - fixture.shortGrossReturn;
  const logExcessReturn = Math.log(bondGrossReturn) - Math.log(fixture.shortGrossReturn);
  return {
    bondGrossReturn,
    simpleExcessReturn,
    simpleExcessReturnBp: simpleExcessReturn * 10_000,
    logExcessReturn,
    logExcessReturnBp: logExcessReturn * 10_000,
  };
}

export const preferredHabitatFixture = {
  maturitiesYears: [2, 5, 10, 30],
  spilloverMatrix: [
    [1, 0.2, 0.05, 0],
    [0.2, 1, 0.25, 0.05],
    [0.05, 0.25, 1, 0.25],
    [0, 0.05, 0.25, 1],
  ],
  baselineExpectedAveragePct: [3.2, 3.35, 3.5, 3.65],
  baselineEstimatedTermPremiumPct: [0.15, 0.3, 0.55, 0.85],
  kappaUnit: 'basisPointsPerNormalizedNetDurationSupplyUnit',
  supplyShockDefinition: '套利者需要吸收的净久期供给；负值表示需吸收的供给减少',
  synthetic: true,
} as const;

export function preferredHabitatTermPremiumChangeBp(
  selectedSupplyBucket: number,
  netDurationSupplyShockNormalized: number,
  riskBearingCapacity: number,
  kappaBpPerNormalizedSupplyUnit: number,
) {
  return preferredHabitatFixture.spilloverMatrix.map((row) => (
    kappaBpPerNormalizedSupplyUnit
      * row[selectedSupplyBucket]
      * netDurationSupplyShockNormalized
      / riskBearingCapacity
  ));
}

export type TermPremiumVintage = 'V1' | 'V2';

export const termPremiumVintageFixtures = {
  V1: [
    { id: 'ACM', expectedAverageShortRatePct: 3.1, estimatedYieldTermPremiumPct: 0.9, jensenConvexityConvention: 'model-defined' },
    { id: 'KW', expectedAverageShortRatePct: 3.35, estimatedYieldTermPremiumPct: 0.65, jensenConvexityConvention: 'convexity-included-in-term-premium' },
    { id: 'Survey residual', expectedAverageShortRatePct: 3.25, additiveResidualTermPremiumPct: 0.75, jensenConvexityConvention: 'residual-includes-unmodeled-terms' },
  ],
  V2: [
    { id: 'ACM', expectedAverageShortRatePct: 3.25, estimatedYieldTermPremiumPct: 0.75, jensenConvexityConvention: 'model-defined' },
    { id: 'KW', expectedAverageShortRatePct: 3.45, estimatedYieldTermPremiumPct: 0.55, jensenConvexityConvention: 'convexity-included-in-term-premium' },
    { id: 'Survey residual', expectedAverageShortRatePct: 3.3, additiveResidualTermPremiumPct: 0.7, jensenConvexityConvention: 'residual-includes-unmodeled-terms' },
  ],
} as const;

export function decompositionEstimatePct(model: (typeof termPremiumVintageFixtures)[TermPremiumVintage][number]) {
  return 'estimatedYieldTermPremiumPct' in model
    ? model.estimatedYieldTermPremiumPct
    : model.additiveResidualTermPremiumPct;
}

export function numericMedian(values: readonly number[]) {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  if (sorted.length % 2 === 1) return sorted[middle];
  return (sorted[middle - 1] + sorted[middle]) / 2;
}

export function decompositionEstimateRangeBp(vintage: TermPremiumVintage, visibleModelIds?: readonly string[]) {
  const values = termPremiumVintageFixtures[vintage]
    .filter((model) => !visibleModelIds || visibleModelIds.includes(model.id))
    .map((model) => decompositionEstimatePct(model) * 100);
  if (values.length < 2) return null;
  const minBp = Math.min(...values);
  const maxBp = Math.max(...values);
  return { minBp, medianBp: numericMedian(values), maxBp, widthBp: maxBp - minBp };
}

const near = (actual: number, expected: number, tolerance = 1e-9) => Math.abs(actual - expected) <= tolerance;
const vintageV1Range = decompositionEstimateRangeBp('V1');
const vintageV2Range = decompositionEstimateRangeBp('V2');

export const yieldCurveFixtureAssertions = [
  { id: 'discount-order', statement: 'D(0)=1>D1>D2>D3>0。', passed: 1 > 0.97 && 0.97 > 0.935 && 0.935 > 0.89 && 0.89 > 0 },
  { id: 'continuous-zero-1y', statement: '1Y 连续复利 zero 为 3.045920748471%。', passed: near(curveCoordinateMetrics.zeroRateContinuousPct[0], 3.0459207484708575) },
  { id: 'forward-1y2y', statement: '[1Y,2Y] 区间 forward 为 3.674954220874%。', passed: near(curveCoordinateMetrics.intervalForwardRatePct[0], 3.6749542208741373) },
  { id: 'forward-2y3y', statement: '[2Y,3Y] 区间 forward 为 4.932506656250%。', passed: near(curveCoordinateMetrics.intervalForwardRatePct[1], 4.932506656250156) },
  { id: 'par-reprices', statement: '3Y 年付息 par coupon 为 3.935599284436%，理论价格回到 100。', passed: near(curveCoordinateMetrics.threeYearAnnualParCouponPct, 3.9355992844364933) },
  { id: 'decomposition-adds-up', statement: '每个期限的预期平均短率与估计期限溢价之和等于 observed yield。', passed: expectationsTermPremiumFixture.observedYieldPct.every((yieldPct, index) => near(yieldPct, expectationsTermPremiumFixture.expectedAverageShortRatePct[index] + expectationsTermPremiumFixture.estimatedYieldTermPremiumPct[index])) },
  { id: 'alternative-decomposition', statement: '同一 observed curve 可对应不同预期路径与溢价分解。', passed: alternativeDecompositionFixture.observedYieldPct.every((yieldPct, index) => near(yieldPct, alternativeDecompositionFixture.expectedAverageShortRatePct[index] + alternativeDecompositionFixture.estimatedYieldTermPremiumPct[index])) },
  { id: 'holding-return-m5', statement: 'M5 对数超额回报按九位小数显示为 18.573939918bp。', passed: near(holdingPeriodReturnMetrics('M5').logExcessReturnBp, 18.57393991834485) },
  { id: 'holding-return-k5', statement: 'K5 对数超额回报按九位小数显示为 183.247724933bp。', passed: near(holdingPeriodReturnMetrics('K5').logExcessReturnBp, 183.24772493319443) },
  { id: 'habitat-sign-and-spillover', statement: '10Y 供给减少 10 单位时四期限变化为 [-0.5,-2.5,-10,-2.5]bp。', passed: preferredHabitatTermPremiumChangeBp(2, -10, 1, 1).every((value, index) => near(value, [-0.5, -2.5, -10, -2.5][index])) },
  { id: 'vintage-v1-range', statement: 'V1 分解估计敏感性范围是 65/75/90bp，宽度 25bp。', passed: vintageV1Range !== null && near(vintageV1Range.minBp, 65) && near(vintageV1Range.medianBp, 75) && near(vintageV1Range.maxBp, 90) && near(vintageV1Range.widthBp, 25) },
  { id: 'vintage-v2-range', statement: 'V2 分解估计敏感性范围是 55/70/75bp，宽度 20bp。', passed: vintageV2Range !== null && near(vintageV2Range.minBp, 55) && near(vintageV2Range.medianBp, 70) && near(vintageV2Range.maxBp, 75) && near(vintageV2Range.widthBp, 20) },
] as const;
