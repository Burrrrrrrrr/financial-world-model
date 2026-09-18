export function exactRealReturnPct(nominalReturnPct: number, inflationPct: number) {
  if (!Number.isFinite(nominalReturnPct) || !Number.isFinite(inflationPct)) return null;
  const inflationGross = 1 + inflationPct / 100;
  if (inflationGross <= 0) return null;
  return ((1 + nominalReturnPct / 100) / inflationGross - 1) * 100;
}

export function additiveRealRateApproxPct(nominalRatePct: number, inflationPct: number) {
  return nominalRatePct - inflationPct;
}

export function exactFisherNominalPct(realRatePct: number, inflationPct: number) {
  return ((1 + realRatePct / 100) * (1 + inflationPct / 100) - 1) * 100;
}

export function stochasticExpectedRealReturnPct(
  nominalReturnPct: number,
  states: readonly { inflationPct: number; probability: number }[],
) {
  if (!Number.isFinite(nominalReturnPct) || states.length === 0 || states.some((state) => !Number.isFinite(state.inflationPct) || !Number.isFinite(state.probability))) return null;
  const probabilityTotal = states.reduce((sum, state) => sum + state.probability, 0);
  if (Math.abs(probabilityTotal - 1) > 1e-12 || states.some((state) => state.probability < 0 || state.inflationPct <= -100)) return null;
  return ((1 + nominalReturnPct / 100) * states.reduce((sum, state) => (
    sum + state.probability / (1 + state.inflationPct / 100)
  ), 0) - 1) * 100;
}

export const tipsContractFixtures = {
  M5: { baseReferenceCpi: 250, currentReferenceCpi: 265, maturityReferenceCpi: 240, originalPrincipal: 1000, annualCouponRatePct: 1.2, couponFrequency: 2 },
  K5: { baseReferenceCpi: 200, currentReferenceCpi: 218, maturityReferenceCpi: 196, originalPrincipal: 2000, annualCouponRatePct: 0.8, couponFrequency: 2 },
} as const;

export type TipsFixtureId = keyof typeof tipsContractFixtures;

export function tipsContractMetrics(id: TipsFixtureId, maturityReferenceCpiOverride?: number) {
  const fixture = tipsContractFixtures[id];
  const maturityReferenceCpi = maturityReferenceCpiOverride ?? fixture.maturityReferenceCpi;
  const currentIndexRatio = fixture.currentReferenceCpi / fixture.baseReferenceCpi;
  const currentAdjustedPrincipal = fixture.originalPrincipal * currentIndexRatio;
  const nextCoupon = currentAdjustedPrincipal * (fixture.annualCouponRatePct / 100) / fixture.couponFrequency;
  const maturityIndexRatio = maturityReferenceCpi / fixture.baseReferenceCpi;
  const maturityAdjustedPrincipal = fixture.originalPrincipal * maturityIndexRatio;
  const maturityPrincipalPayment = Math.max(fixture.originalPrincipal, maturityAdjustedPrincipal);
  return { ...fixture, maturityReferenceCpi, currentIndexRatio, currentAdjustedPrincipal, nextCoupon, maturityIndexRatio, maturityAdjustedPrincipal, maturityPrincipalPayment };
}

export const realYieldDecompositionFixtures = {
  M6: { observedTipsYieldPct: 2.1, signedTipsLiquidityYieldWedgePct: 0.25, estimatedModelRealYieldPct: 1.85, expectedAverageRealShortRatePct: 1.3, estimatedRealTermPremiumPct: 0.55, independentRStarEstimatePct: 0.8 },
  K6: { observedTipsYieldPct: 1.8, signedTipsLiquidityYieldWedgePct: 0.15, estimatedModelRealYieldPct: 1.65, expectedAverageRealShortRatePct: 1.2, estimatedRealTermPremiumPct: 0.45, independentRStarEstimatePct: 0.9 },
} as const;

export type RealYieldFixtureId = keyof typeof realYieldDecompositionFixtures;

export const dcfConsistencyFixtures = {
  M7: { realCashFlow: 100, realDiscountRatePct: 3, deterministicInflationPct: 4, currentPriceIndexNormalization: 1 },
  K7: { realCashFlow: 200, realDiscountRatePct: 2, deterministicInflationPct: 5, currentPriceIndexNormalization: 1 },
} as const;

export type DcfFixtureId = keyof typeof dcfConsistencyFixtures;

export function dcfConsistencyMetrics(id: DcfFixtureId) {
  const fixture = dcfConsistencyFixtures[id];
  const nominalCashFlow = fixture.realCashFlow * (1 + fixture.deterministicInflationPct / 100);
  const exactNominalDiscountRatePct = exactFisherNominalPct(fixture.realDiscountRatePct, fixture.deterministicInflationPct);
  const realPresentValue = fixture.realCashFlow / (1 + fixture.realDiscountRatePct / 100);
  const nominalPresentValue = nominalCashFlow / (1 + exactNominalDiscountRatePct / 100);
  const additiveNominalDiscountRatePct = fixture.realDiscountRatePct + fixture.deterministicInflationPct;
  const mismatchedPresentValue = nominalCashFlow / (1 + additiveNominalDiscountRatePct / 100);
  return { ...fixture, nominalCashFlow, exactNominalDiscountRatePct, additiveNominalDiscountRatePct, realPresentValue, nominalPresentValue, mismatchedPresentValue };
}

export function durationPriceChangePct(modifiedDurationYears: number, yieldShockBp: number) {
  return -modifiedDurationYears * yieldShockBp / 100;
}

export function gordonPrice(dividendNext: number, requiredReturnPct: number, growthPct: number) {
  if (![dividendNext, requiredReturnPct, growthPct].every(Number.isFinite)) return null;
  const spread = (requiredReturnPct - growthPct) / 100;
  if (dividendNext <= 0 || spread <= 0) return null;
  return dividendNext / spread;
}

export function waccPct(equityMarketValue: number, debtMarketValue: number, costOfEquityPct: number, costOfDebtPct: number, corporateTaxPct: number) {
  if (![equityMarketValue, debtMarketValue, costOfEquityPct, costOfDebtPct, corporateTaxPct].every(Number.isFinite)) return null;
  const total = equityMarketValue + debtMarketValue;
  if (equityMarketValue < 0 || debtMarketValue < 0 || total <= 0 || corporateTaxPct < 0 || corporateTaxPct > 100) return null;
  return equityMarketValue / total * costOfEquityPct + debtMarketValue / total * costOfDebtPct * (1 - corporateTaxPct / 100);
}

export type CrossAssetState = {
  realCurveShockBp: number;
  creditSpreadShockBp: number;
  equityRiskPremiumShockBp: number;
  propertyRiskPremiumShockBp: number;
  equityGrowthShockBp: number;
  propertyNoiGrowthShockBp: number;
};

export function crossAssetSensitivity(state: CrossAssetState) {
  const nominalBondApproxPct = durationPriceChangePct(7.5, state.realCurveShockBp);
  const tipsApproxPct = durationPriceChangePct(8.5, state.realCurveShockBp);
  const corporateBondApproxPct = durationPriceChangePct(5.5, state.realCurveShockBp + state.creditSpreadShockBp);
  const equityBase = gordonPrice(5, 9, 4) ?? 0;
  const equityShocked = gordonPrice(5, 9 + (state.realCurveShockBp + state.equityRiskPremiumShockBp) / 100, 4 + state.equityGrowthShockBp / 100);
  const propertyBase = gordonPrice(6, 8, 2) ?? 0;
  const propertyShocked = gordonPrice(6, 8 + (state.realCurveShockBp + state.propertyRiskPremiumShockBp) / 100, 2 + state.propertyNoiGrowthShockBp / 100);
  return {
    nominalBondApproxPct,
    tipsApproxPct,
    corporateBondApproxPct,
    equityPriceChangePct: equityShocked === null ? null : (equityShocked / equityBase - 1) * 100,
    propertyPriceChangePct: propertyShocked === null ? null : (propertyShocked / propertyBase - 1) * 100,
  };
}

const near = (actual: number | null, expected: number, tolerance = 1e-9) => actual !== null && Math.abs(actual - expected) <= tolerance;
const m5Tips = tipsContractMetrics('M5');
const k5Tips = tipsContractMetrics('K5');
const m7Dcf = dcfConsistencyMetrics('M7');
const k7Dcf = dcfConsistencyMetrics('K7');
const baseCrossAsset = crossAssetSensitivity({ realCurveShockBp: 50, creditSpreadShockBp: 0, equityRiskPremiumShockBp: 0, propertyRiskPremiumShockBp: 0, equityGrowthShockBp: 0, propertyNoiGrowthShockBp: 0 });

export const realRateFixtureAssertions = [
  { id: 'm1-ex-post', statement: '6% 名义总回报与 3% 已实现通胀对应 2.912621359% 事后实际回报。', passed: near(exactRealReturnPct(6, 3), 2.912621359223298) },
  { id: 'k1-deflation', statement: '5.5% 名义总回报与 −1% 通胀对应 6.565656566% 事后实际回报。', passed: near(exactRealReturnPct(5.5, -1), 6.565656565656575) },
  { id: 'm3-fisher', statement: '5% 实际率与 8% 通胀对应 13.4% 精确名义率。', passed: near(exactFisherNominalPct(5, 8), 13.4) },
  { id: 'm4-jensen', statement: '0%/12% 各半时严格期望实际回报为 0.321428571%。', passed: near(stochasticExpectedRealReturnPct(6, [{ inflationPct: 0, probability: 0.5 }, { inflationPct: 12, probability: 0.5 }]), 0.32142857142856185) },
  { id: 'm5-tips-current', statement: 'M5 当前指数化本金 1060，半年票息 6.36。', passed: near(m5Tips.currentAdjustedPrincipal, 1060) && near(m5Tips.nextCoupon, 6.36) },
  { id: 'm5-tips-floor', statement: 'M5 到期指数化本金 960，原始本金 floor 使偿还额为 1000。', passed: near(m5Tips.maturityAdjustedPrincipal, 960) && near(m5Tips.maturityPrincipalPayment, 1000) },
  { id: 'k5-tips', statement: 'K5 当前本金 2180、半年票息 8.72、到期 floor 支付 2000。', passed: near(k5Tips.currentAdjustedPrincipal, 2180) && near(k5Tips.nextCoupon, 8.72) && near(k5Tips.maturityPrincipalPayment, 2000) },
  { id: 'm6-real-yield-adds-up', statement: 'M6 模型实际收益率 1.85%=预期实际短率 1.30%+估计实际 TP 0.55%。', passed: near(realYieldDecompositionFixtures.M6.expectedAverageRealShortRatePct + realYieldDecompositionFixtures.M6.estimatedRealTermPremiumPct, realYieldDecompositionFixtures.M6.estimatedModelRealYieldPct) },
  { id: 'm6-liquidity-wedge', statement: 'M6 observed TIPS yield 2.10%=模型实际收益率 1.85%+有符号流动性收益率楔子 0.25%。', passed: near(realYieldDecompositionFixtures.M6.estimatedModelRealYieldPct + realYieldDecompositionFixtures.M6.signedTipsLiquidityYieldWedgePct, realYieldDecompositionFixtures.M6.observedTipsYieldPct) },
  { id: 'm7-dcf', statement: 'M7 在 I₀=1 且 real CF 以 date-0 货币购买力表达时，实际与精确名义 DCF 都等于 97.087378641。', passed: m7Dcf.currentPriceIndexNormalization === 1 && near(m7Dcf.realPresentValue, 97.0873786407767) && near(m7Dcf.nominalPresentValue, m7Dcf.realPresentValue) },
  { id: 'k7-dcf', statement: 'K7 在 I₀=1 且 real CF 以 date-0 货币购买力表达时，实际与精确名义 DCF 都等于 196.078431373。', passed: k7Dcf.currentPriceIndexNormalization === 1 && near(k7Dcf.realPresentValue, 196.078431372549) && near(k7Dcf.nominalPresentValue, k7Dcf.realPresentValue) },
  { id: 'm8-duration', statement: '价格 102、modified duration 8、+50bp 时一阶相对变化 −4%，金额变化 −4.08。', passed: near(durationPriceChangePct(8, 50), -4) && near(102 * durationPriceChangePct(8, 50) / 100, -4.08) },
  { id: 'm9-gordon', statement: 'D1=5、k=9%、g=4% 时价格100；k升至10%后83.333333333。', passed: near(gordonPrice(5, 9, 4), 100) && near(gordonPrice(5, 10, 4), 83.33333333333333) },
  { id: 'm10-wacc', statement: 'E=600、D=400、Re=10%、Rd=5%、税率25%时 WACC=7.5%。', passed: near(waccPct(600, 400, 10, 5, 25), 7.5) },
  { id: 'cross-asset-nonuniform', statement: '同一 +50bp 实际曲线冲击在冻结其他项时不会产生统一价格变化。', passed: near(baseCrossAsset.nominalBondApproxPct, -3.75) && near(baseCrossAsset.tipsApproxPct, -4.25) && near(baseCrossAsset.corporateBondApproxPct, -2.75) && near(baseCrossAsset.equityPriceChangePct, -9.090909090909093) && near(baseCrossAsset.propertyPriceChangePct, -7.692307692307687) },
] as const;
