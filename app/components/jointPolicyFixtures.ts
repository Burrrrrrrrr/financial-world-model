/** Seven independent bounded SYN arithmetic experiments; source tests are not content approval. */
export type JointStop = { status: 'STOP'; reason: string };
export type JointResult<T> = { status: 'OK'; result: T } | JointStop;
const stop = (reason: string): JointStop => ({ status: 'STOP', reason });
const finite = (...xs: number[]) => xs.every(x => typeof x === 'number' && Number.isFinite(x));
const ok = <T>(result: T): JointResult<T> => ({ status: 'OK', result });
export const jointTeachingAmountLimit = 1_000_000;
/** A deliberately bounded SYN arithmetic passport, NOT an economic/legal parameter restriction. */
const teachingAmount = (x: number) => finite(x) && Number.isSafeInteger(x) && Math.abs(x) <= jointTeachingAmountLimit;
const teachingNonnegativeAmount = (x: number) => teachingAmount(x) && x >= 0;
const teachingBps = (x: number): number | null => {
  if (!finite(x) || Math.abs(x) > 100) return null;
  const bps = Math.round(x * 100);
  return x === bps / 100 ? bps : null;
};

/** Percent inputs; one-period no-default, no-fee contract and a GIVEN positive price ratio. */
export function jointPurchasingPower(nominalNetPercent: number, inflationScenarioPercent: number) {
  const nominalBps = teachingBps(nominalNetPercent), inflationBps = teachingBps(inflationScenarioPercent);
  if (nominalBps === null || inflationBps === null || nominalBps <= -10000 || inflationBps <= -10000) return stop('DECLARED_RATE_GRID_OR_POSITIVE_PRICE_DOMAIN');
  const grossNominal = (10000 + nominalBps) / 10000, priceRatio = (10000 + inflationBps) / 10000;
  if (!(grossNominal > 0 && priceRatio > 0)) return stop('NONPOSITIVE_ROUNDED_FACTOR');
  const grossReal = grossNominal / priceRatio;
  const realScenarioPercent = (nominalBps - inflationBps) / (10000 + inflationBps) * 100;
  const linearApproximationPercent = nominalNetPercent - inflationScenarioPercent;
  const approximationGapPercentagePoints = realScenarioPercent - linearApproximationPercent;
  if (!(grossReal > 0) || !finite(grossReal, realScenarioPercent, linearApproximationPercent, approximationGapPercentagePoints)) return stop('NUMERIC_OVERFLOW_OR_UNDERFLOW');
  return ok({ grossNominal, priceRatio, realScenarioPercent, linearApproximationPercent, approximationGapPercentagePoints, stochasticExpectedRealReturn: null, causalInflationResponse: null });
}

/** Two price scenarios, constant nominal payoff; expectation of reciprocal is not reciprocal of expectation. */
export function jointRandomPurchasingPower(nominalNetPercent: number, inflationAPercent: number, inflationBPercent: number, probabilityA: number) {
  if (!finite(probabilityA) || probabilityA < 0 || probabilityA > 1 || probabilityA !== Math.round(probabilityA * 100) / 100) return stop('DECLARED_PROBABILITY_PERCENT_GRID');
  const a = jointPurchasingPower(nominalNetPercent, inflationAPercent), b = jointPurchasingPower(nominalNetPercent, inflationBPercent);
  if (a.status === 'STOP') return a;
  if (b.status === 'STOP') return b;
  const probabilityPercent = Math.round(probabilityA * 100), nominalBps = teachingBps(nominalNetPercent)!, inflationABps = teachingBps(inflationAPercent)!, inflationBBps = teachingBps(inflationBPercent)!;
  const weightedInflationBpsNumerator = probabilityPercent * inflationABps + (100 - probabilityPercent) * inflationBBps;
  const meanInflationPercent = weightedInflationBpsNumerator / 10000;
  const meanRealReturnPercent = probabilityA * a.result.realScenarioPercent + (1 - probabilityA) * b.result.realScenarioPercent;
  const plugInMeanReturnPercent = (nominalBps * 100 - weightedInflationBpsNumerator) / (1_000_000 + weightedInflationBpsNumerator) * 100;
  const meanPriceRatio = (1_000_000 + weightedInflationBpsNumerator) / 1_000_000;
  const priceDifference = (inflationABps - inflationBBps) / 10000;
  // Algebraically the Jensen gap; avoids subtracting two nearly equal net-return displays.
  const meanVersusPlugInGapPercentagePoints = a.result.grossNominal * probabilityA * (1 - probabilityA) * priceDifference ** 2 / (a.result.priceRatio * b.result.priceRatio * meanPriceRatio) * 100;
  if (!finite(meanInflationPercent, meanRealReturnPercent, plugInMeanReturnPercent, meanVersusPlugInGapPercentagePoints)) return stop('NUMERIC_EXPECTATION_UNRESOLVED');
  return ok({ meanInflationPercent, realReturnAPercent: a.result.realScenarioPercent, realReturnBPercent: b.result.realScenarioPercent, meanRealReturnPercent, plugInMeanReturnPercent, meanVersusPlugInGapPercentagePoints, equilibriumNominalPolicyRate: null, scenarioDistributionEstimated: false });
}

/** Instant purchase at par FROM A PRIVATE BANK; initially no CB bonds/reserves/cash in this experiment. */
export function jointConsolidation(treasuryBondPrincipal: number, centralBankPurchaseAtPar: number) {
  if (!teachingNonnegativeAmount(treasuryBondPrincipal) || !teachingNonnegativeAmount(centralBankPurchaseAtPar) || centralBankPurchaseAtPar > treasuryBondPrincipal) return stop('DECLARED_WHOLE_SYN_PRINCIPAL_DOMAIN_OR_EXCESS_PURCHASE');
  const privateLongBondPrincipal = treasuryBondPrincipal - centralBankPurchaseAtPar;
  const paidReservePrincipal = centralBankPurchaseAtPar;
  const consolidatedExternalPrincipal = privateLongBondPrincipal + paidReservePrincipal;
  if (!finite(privateLongBondPrincipal, consolidatedExternalPrincipal)) return stop('NUMERIC_PRINCIPAL_UNRESOLVED');
  return ok({ treasuryGrossBondPrincipal: treasuryBondPrincipal, centralBankInternalBondAsset: centralBankPurchaseAtPar, internalBondPairRemoved: centralBankPurchaseAtPar, privateLongBondPrincipal, paidReservePrincipal, consolidatedExternalPrincipal, externalPrincipalReduction: treasuryBondPrincipal - consolidatedExternalPrincipal, fiscalSpendingCreatedBySwap: 0, marketRevaluation: null, institutionalPermissionsMerged: false });
}

/** Fixed initial principals for one equal teaching period; excludes repricing, principal repayment and financing of fees. */
export function jointInterestCost(fixedBondPrincipal: number, fixedCouponPercent: number, repricingBondPrincipal: number, newBondRatePercent: number, paidReservePrincipal: number, reserveRatePercent: number, noninterestCashPrincipal: number) {
  const couponBps = teachingBps(fixedCouponPercent), newBondBps = teachingBps(newBondRatePercent), reserveBps = teachingBps(reserveRatePercent);
  if (![fixedBondPrincipal, repricingBondPrincipal, paidReservePrincipal, noninterestCashPrincipal].every(teachingNonnegativeAmount) || couponBps === null || newBondBps === null || reserveBps === null || Math.min(couponBps, newBondBps, reserveBps) < 0) return stop('DECLARED_WHOLE_SYN_PRINCIPAL_AND_NONNEGATIVE_RATE_GRID');
  const fixedInterestNumerator = fixedBondPrincipal * couponBps, repricingInterestNumerator = repricingBondPrincipal * newBondBps, reserveInterestNumerator = paidReservePrincipal * reserveBps;
  const fixedBondInterest = fixedInterestNumerator / 10000;
  const repricingBondInterest = repricingInterestNumerator / 10000;
  const reserveInterest = reserveInterestNumerator / 10000;
  const noninterestCashContractualInterest = 0;
  const totalExternalInterest = (fixedInterestNumerator + repricingInterestNumerator + reserveInterestNumerator) / 10000;
  const externalPrincipal = fixedBondPrincipal + repricingBondPrincipal + paidReservePrincipal + noninterestCashPrincipal;
  if (!finite(fixedBondInterest, repricingBondInterest, reserveInterest, totalExternalInterest, externalPrincipal)) return stop('NUMERIC_INTEREST_OR_PRINCIPAL_OVERFLOW');
  if ((fixedBondPrincipal > 0 && fixedCouponPercent > 0 && fixedBondInterest === 0) || (repricingBondPrincipal > 0 && newBondRatePercent > 0 && repricingBondInterest === 0) || (paidReservePrincipal > 0 && reserveRatePercent > 0 && reserveInterest === 0)) return stop('POSITIVE_INTEREST_PRODUCT_UNDERFLOW_NOT_REAL_ZERO');
  return ok({ fixedBondInterest, repricingBondInterest, reserveInterest, noninterestCashContractualInterest, totalExternalInterest, externalPrincipal, principalRepaymentIncluded: false, inflationResponse: null, allEconomicCosts: null, debtSafety: null });
}

/** Simplified earnings carry/remittance ledger inspired by US FAM; excludes capital/surplus and all other legal adjustments. */
export function jointRemittanceLedger(income: number, expense: number, initialDeferredEarningsRequirement: number) {
  if (![income, expense, initialDeferredEarningsRequirement].every(teachingNonnegativeAmount)) return stop('DECLARED_WHOLE_SYN_EARNINGS_LEDGER_DOMAIN');
  const netEarnings = income - expense;
  const newDeferredEarningsRequirement = netEarnings < 0 ? initialDeferredEarningsRequirement - netEarnings : Math.max(0, initialDeferredEarningsRequirement - netEarnings);
  const simplifiedRemittance = netEarnings > 0 ? Math.max(0, netEarnings - initialDeferredEarningsRequirement) : 0;
  if (!finite(netEarnings, newDeferredEarningsRequirement, simplifiedRemittance)) return stop('NUMERIC_EARNINGS_LEDGER_OVERFLOW');
  return ok({ netEarnings, newDeferredEarningsRequirement, simplifiedRemittance, automaticTreasuryCashInjection: null, realFedBalanceForecast: null, allLegalAccountingAdjustmentsIncluded: false });
}

/** Real period budget identity with GIVEN real bond interest, no default, no assets or FX. Price determination unknown. */
export function jointRealBudgetIdentity(oldRealBondPrincipal: number, realNetInterestPercent: number, realPrimaryDeficit: number, noninterestMoneyFinancingRealFlow: number) {
  const realInterestBps = teachingBps(realNetInterestPercent);
  if (!teachingNonnegativeAmount(oldRealBondPrincipal) || !teachingNonnegativeAmount(noninterestMoneyFinancingRealFlow) || !teachingAmount(realPrimaryDeficit) || realInterestBps === null || realInterestBps <= -10000) return stop('DECLARED_WHOLE_REAL_SYN_FLOWS_AND_RATE_GRID');
  const interestNumerator = oldRealBondPrincipal * realInterestBps;
  const realInterest = interestNumerator / 10000;
  if (oldRealBondPrincipal > 0 && realNetInterestPercent !== 0 && realInterest === 0) return stop('NONZERO_REAL_INTEREST_UNDERFLOW_NOT_REAL_ZERO');
  const deltaNumerator = interestNumerator + (realPrimaryDeficit - noninterestMoneyFinancingRealFlow) * 10000;
  const newDebtNumerator = oldRealBondPrincipal * 10000 + deltaNumerator;
  const newRealBondPrincipal = newDebtNumerator / 10000;
  if (!finite(realInterest, newRealBondPrincipal)) return stop('NUMERIC_REAL_BUDGET_OVERFLOW');
  if (newRealBondPrincipal < 0) return stop('NET_ASSET_POSITION_OUTSIDE_THIS_DEBT_ONLY_EXPERIMENT');
  return ok({ realInterest, realPrimaryDeficit, noninterestMoneyFinancingRealFlow, newRealBondPrincipal, realDebtChange: deltaNumerator / 10000, nominalPriceLevel: null, inflation: null, moneyGrowthResponse: null, isEmpiricalDebtToGDPRatio: false });
}

export const jointNumericBoundaryTolerance = 1e-12;
/** Leeper's local roots only; intercepts, positive steady state, shock independence and TVC NOT solved by this function. */
export function jointLeeperRootConfiguration(beta: number, alpha: number, gamma: number) {
  if (!finite(beta, alpha, gamma) || beta <= 0 || beta >= 1) return stop('INVALID_LEEPER_ROOT_DOMAIN');
  const inverseBeta = 1 / beta, monetaryRoot = alpha * beta, fiscalRoot = inverseBeta - gamma;
  if (!finite(inverseBeta, monetaryRoot, fiscalRoot) || (alpha !== 0 && monetaryRoot === 0)) return stop('NUMERIC_ROOT_OVERFLOW_OR_UNDERFLOW');
  const absMonetaryRoot = Math.abs(monetaryRoot), absFiscalRoot = Math.abs(fiscalRoot);
  if (absMonetaryRoot === 1 || absFiscalRoot === 1) return stop('COMPUTED_UNIT_CIRCLE_OR_NUMERIC_BOUNDARY_UNRESOLVED');
  const errorM = 4 * Number.EPSILON * (Math.abs(monetaryRoot) + 1);
  const errorF = 4 * Number.EPSILON * (Math.abs(inverseBeta) + Math.abs(gamma) + 1);
  if (!finite(errorM, errorF) || Math.abs(absMonetaryRoot - 1) <= Math.max(jointNumericBoundaryTolerance, errorM) || Math.abs(absFiscalRoot - 1) <= Math.max(jointNumericBoundaryTolerance, errorF)) return stop('DECLARED_NUMERIC_NEAR_BOUNDARY_UNRESOLVED_NOT_NEW_ECONOMIC_REGION');
  const monetaryOutside = absMonetaryRoot > 1, fiscalOutside = absFiscalRoot > 1;
  const localRegion = monetaryOutside ? (fiscalOutside ? 'IV' : 'I') : (fiscalOutside ? 'II' : 'III');
  return ok({ monetaryRoot, fiscalRoot, absMonetaryRoot, absFiscalRoot, localRegion, monetaryResponseLabel: monetaryOutside ? 'active' : 'passive', fiscalResponseLabel: fiscalOutside ? 'active' : 'passive', calibratedPositiveSteadyState: false, completeEquilibriumCertified: false, observedCountryClassification: null, policyRecommendation: null });
}

export const jointCanonicalInputs = {
  c1: { nominalNetPercent: 5, inflationScenarioPercent: 2 },
  c2: { nominalNetPercent: 5, inflationAPercent: 0, inflationBPercent: 10, probabilityA: .5 },
  c3: { treasuryBondPrincipal: 100, centralBankPurchaseAtPar: 60 },
  c4: { fixedBondPrincipal: 40, fixedCouponPercent: 3, repricingBondPrincipal: 0, newBondRatePercent: 6, paidReservePrincipal: 60, reserveRatePercent: 6, noninterestCashPrincipal: 0 },
  c5: { income: 20, expense: 30, initialDeferredEarningsRequirement: 5 },
  c6: { oldRealBondPrincipal: 100, realNetInterestPercent: 3, realPrimaryDeficit: 10, noninterestMoneyFinancingRealFlow: 5 },
  c7: { beta: .8, alpha: 2, gamma: 1 },
} as const;
