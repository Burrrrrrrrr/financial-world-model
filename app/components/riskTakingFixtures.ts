export type RiskTakingIdentificationStatus = 'descriptive' | 'mechanism-consistent' | 'identified-candidate' | 'identified';

export type RiskSelectionInput = {
  synthetic: true;
  candidateId: string;
  productExposureBasis: string;
  contractMaturityMonths: number;
  pdForecastHorizonMonths: number;
  eadAmount: number;
  eadCurrency: string;
  grossYieldPctPointsPerYear: number;
  fundingCostPctPointsPerYear: number;
  operatingCostPctPointsPerYear: number;
  pdPctPoints: number;
  lgdPctPoints: number;
  capitalAndLiquidityChargePctPointsPerYear: number;
  unexpectedLossProxyPctPoints: number;
  riskShadowPricePerUnexpectedLossPoint: number;
  targetResidualReturnPctPointsPerYear: number;
  maximumDecisionPdPctPoints: number;
  maximumUnexpectedLossProxyPctPoints: number;
};

export type RiskSelectionMetrics = {
  expectedLossRatePctPoints: number;
  expectedLossAmount: number;
  eadAmount: number;
  eadCurrency: string;
  expectedMarginBeforeTailRiskPctPoints: number;
  tailRiskChargePctPoints: number;
  riskAdjustedContributionPctPoints: number;
  returnHurdlePassed: boolean;
  decisionPdCapPassed: boolean;
  unexpectedLossBudgetPassed: boolean;
  accepted: boolean;
};

const finite = (...values: number[]) => values.every(Number.isFinite);
const boundedPct = (value: number) => Number.isFinite(value) && value >= 0 && value <= 100;

export function expectedCreditLossRatePctPoints(pdPctPoints: number, lgdPctPoints: number) {
  if (!boundedPct(pdPctPoints) || !boundedPct(lgdPctPoints)) return null;
  return pdPctPoints * lgdPctPoints / 100;
}

export function riskAdjustedSelectionMetrics(input: RiskSelectionInput): RiskSelectionMetrics | null {
  const {
    productExposureBasis,
    contractMaturityMonths,
    pdForecastHorizonMonths,
    eadAmount,
    eadCurrency,
    grossYieldPctPointsPerYear,
    fundingCostPctPointsPerYear,
    operatingCostPctPointsPerYear,
    pdPctPoints,
    lgdPctPoints,
    capitalAndLiquidityChargePctPointsPerYear,
    unexpectedLossProxyPctPoints,
    riskShadowPricePerUnexpectedLossPoint,
    targetResidualReturnPctPointsPerYear,
    maximumDecisionPdPctPoints,
    maximumUnexpectedLossProxyPctPoints,
  } = input;
  if (!finite(
    grossYieldPctPointsPerYear,
    contractMaturityMonths,
    pdForecastHorizonMonths,
    eadAmount,
    fundingCostPctPointsPerYear,
    operatingCostPctPointsPerYear,
    capitalAndLiquidityChargePctPointsPerYear,
    unexpectedLossProxyPctPoints,
    riskShadowPricePerUnexpectedLossPoint,
    targetResidualReturnPctPointsPerYear,
    maximumDecisionPdPctPoints,
    maximumUnexpectedLossProxyPctPoints,
  ) || !boundedPct(pdPctPoints) || !boundedPct(lgdPctPoints)
    || productExposureBasis.trim().length === 0
    || eadCurrency.trim().length === 0
    || contractMaturityMonths !== 12
    || pdForecastHorizonMonths !== 12
    || eadAmount <= 0
    || !boundedPct(maximumDecisionPdPctPoints)
    || unexpectedLossProxyPctPoints < 0
    || maximumUnexpectedLossProxyPctPoints < 0
    || riskShadowPricePerUnexpectedLossPoint < 0) return null;

  const expectedLossRatePctPoints = pdPctPoints * lgdPctPoints / 100;
  const expectedLossAmount = eadAmount * pdPctPoints / 100 * lgdPctPoints / 100;
  const expectedMarginBeforeTailRiskPctPoints = grossYieldPctPointsPerYear
    - fundingCostPctPointsPerYear
    - operatingCostPctPointsPerYear
    - expectedLossRatePctPoints
    - capitalAndLiquidityChargePctPointsPerYear;
  const tailRiskChargePctPoints = unexpectedLossProxyPctPoints * riskShadowPricePerUnexpectedLossPoint;
  const riskAdjustedContributionPctPoints = expectedMarginBeforeTailRiskPctPoints - tailRiskChargePctPoints;
  const returnHurdlePassed = riskAdjustedContributionPctPoints + 1e-12 >= targetResidualReturnPctPointsPerYear;
  const decisionPdCapPassed = pdPctPoints <= maximumDecisionPdPctPoints + 1e-12;
  const unexpectedLossBudgetPassed = unexpectedLossProxyPctPoints <= maximumUnexpectedLossProxyPctPoints + 1e-12;
  return {
    expectedLossRatePctPoints,
    expectedLossAmount,
    eadAmount,
    eadCurrency,
    expectedMarginBeforeTailRiskPctPoints,
    tailRiskChargePctPoints,
    riskAdjustedContributionPctPoints,
    returnHurdlePassed,
    decisionPdCapPassed,
    unexpectedLossBudgetPassed,
    accepted: returnHurdlePassed && decisionPdCapPassed && unexpectedLossBudgetPassed,
  };
}

export type SearchForYieldMetrics = {
  rawRiskyShareRatio: number;
  feasibleWithoutLeverage: boolean;
  displayedRiskyShareRatio: number;
  displayedPromisedYieldPctPoints: number;
};

export function searchForYieldMix(
  safePromisedYieldPctPoints: number,
  riskyPromisedYieldPctPoints: number,
  nominalTargetYieldPctPoints: number,
): SearchForYieldMetrics | null {
  if (!finite(safePromisedYieldPctPoints, riskyPromisedYieldPctPoints, nominalTargetYieldPctPoints)
    || riskyPromisedYieldPctPoints <= safePromisedYieldPctPoints) return null;
  const rawRiskyShareRatio = (nominalTargetYieldPctPoints - safePromisedYieldPctPoints)
    / (riskyPromisedYieldPctPoints - safePromisedYieldPctPoints);
  const displayedRiskyShareRatio = Math.min(1, Math.max(0, rawRiskyShareRatio));
  return {
    rawRiskyShareRatio,
    feasibleWithoutLeverage: rawRiskyShareRatio >= 0 && rawRiskyShareRatio <= 1,
    displayedRiskyShareRatio,
    displayedPromisedYieldPctPoints: safePromisedYieldPctPoints
      + displayedRiskyShareRatio * (riskyPromisedYieldPctPoints - safePromisedYieldPctPoints),
  };
}

export type RiskBudgetMetrics = {
  modelLossRateRatio: number;
  modelOnlyMaximumExposure: number;
  stressMaximumExposure: number;
  robustMaximumExposure: number;
  bindingMeasure: 'current-model' | 'stress-overlay' | 'tie';
};

export function riskBudgetExposureMetrics({
  lossBudget,
  currentMeasuredVolatilityPctPoints,
  confidenceMultiplier,
  stressLossRatePctPoints,
}: {
  lossBudget: number;
  currentMeasuredVolatilityPctPoints: number;
  confidenceMultiplier: number;
  stressLossRatePctPoints: number;
}): RiskBudgetMetrics | null {
  if (!finite(lossBudget, currentMeasuredVolatilityPctPoints, confidenceMultiplier, stressLossRatePctPoints)
    || lossBudget < 0 || currentMeasuredVolatilityPctPoints <= 0 || confidenceMultiplier <= 0
    || stressLossRatePctPoints <= 0) return null;
  const modelLossRateRatio = confidenceMultiplier * currentMeasuredVolatilityPctPoints / 100;
  const stressLossRateRatio = stressLossRatePctPoints / 100;
  const modelOnlyMaximumExposure = lossBudget / modelLossRateRatio;
  const stressMaximumExposure = lossBudget / stressLossRateRatio;
  const robustMaximumExposure = Math.min(modelOnlyMaximumExposure, stressMaximumExposure);
  const gap = modelOnlyMaximumExposure - stressMaximumExposure;
  return {
    modelLossRateRatio,
    modelOnlyMaximumExposure,
    stressMaximumExposure,
    robustMaximumExposure,
    bindingMeasure: Math.abs(gap) <= 1e-9 ? 'tie' : gap < 0 ? 'current-model' : 'stress-overlay',
  };
}

export type MarginPressureMetrics = {
  assetYieldAfterPctPoints: number;
  depositCostAfterPctPoints: number;
  depositFloorBinding: boolean;
  marginBeforePctPoints: number;
  marginAfterPctPoints: number;
  marginChangePctPoints: number;
  riskShiftingPressure: number;
  capacityRetrenchmentPressure: number;
  illustrativeNetRiskChoicePressure: number;
};

export const canonicalMarginProxyBasis = {
  commonDenominator: 'average-interest-earning-assets',
  costInputsAreWeightedContributions: true,
} as const;

export function marginPressureMetrics({
  assetYieldBeforePctPoints,
  depositCostBeforePctPoints,
  otherFundingCostPctPoints,
  policyRateChangePctPoints,
  assetYieldPassThrough,
  depositRatePassThrough,
  depositRateFloorPctPoints,
  riskShiftingSensitivity,
  capacityRetrenchmentSensitivity,
  commonDenominator,
  costInputsAreWeightedContributions,
}: {
  assetYieldBeforePctPoints: number;
  depositCostBeforePctPoints: number;
  otherFundingCostPctPoints: number;
  policyRateChangePctPoints: number;
  assetYieldPassThrough: number;
  depositRatePassThrough: number;
  depositRateFloorPctPoints: number;
  riskShiftingSensitivity: number;
  capacityRetrenchmentSensitivity: number;
  commonDenominator: 'average-interest-earning-assets';
  costInputsAreWeightedContributions: true;
}): MarginPressureMetrics | null {
  if (!finite(
    assetYieldBeforePctPoints,
    depositCostBeforePctPoints,
    otherFundingCostPctPoints,
    policyRateChangePctPoints,
    assetYieldPassThrough,
    depositRatePassThrough,
    depositRateFloorPctPoints,
    riskShiftingSensitivity,
    capacityRetrenchmentSensitivity,
  ) || commonDenominator !== 'average-interest-earning-assets'
    || costInputsAreWeightedContributions !== true
    || assetYieldPassThrough < 0 || depositRatePassThrough < 0
    || depositRateFloorPctPoints > depositCostBeforePctPoints
    || riskShiftingSensitivity < 0 || capacityRetrenchmentSensitivity < 0) return null;
  const assetYieldAfterPctPoints = assetYieldBeforePctPoints + assetYieldPassThrough * policyRateChangePctPoints;
  const rawDepositCostAfterPctPoints = depositCostBeforePctPoints + depositRatePassThrough * policyRateChangePctPoints;
  const depositCostAfterPctPoints = Math.max(depositRateFloorPctPoints, rawDepositCostAfterPctPoints);
  const marginBeforePctPoints = assetYieldBeforePctPoints - depositCostBeforePctPoints - otherFundingCostPctPoints;
  const marginAfterPctPoints = assetYieldAfterPctPoints - depositCostAfterPctPoints - otherFundingCostPctPoints;
  const marginChangePctPoints = marginAfterPctPoints - marginBeforePctPoints;
  const compression = Math.max(0, -marginChangePctPoints);
  const riskShiftingPressure = compression * riskShiftingSensitivity;
  const capacityRetrenchmentPressure = compression * capacityRetrenchmentSensitivity;
  return {
    assetYieldAfterPctPoints,
    depositCostAfterPctPoints,
    depositFloorBinding: depositCostAfterPctPoints > rawDepositCostAfterPctPoints + 1e-12,
    marginBeforePctPoints,
    marginAfterPctPoints,
    marginChangePctPoints,
    riskShiftingPressure,
    capacityRetrenchmentPressure,
    illustrativeNetRiskChoicePressure: riskShiftingPressure - capacityRetrenchmentPressure,
  };
}

export type CohortRiskMetrics = {
  riskyShareRatio: number;
  realisedDefaultRatePctPoints: number;
};

export function cohortRiskMetrics({
  riskyShareRatio,
  safeRealisedDefaultRatePctPoints,
  riskyRealisedDefaultRatePctPoints,
}: {
  riskyShareRatio: number;
  safeRealisedDefaultRatePctPoints: number;
  riskyRealisedDefaultRatePctPoints: number;
}): CohortRiskMetrics | null {
  if (!finite(riskyShareRatio, safeRealisedDefaultRatePctPoints, riskyRealisedDefaultRatePctPoints)
    || riskyShareRatio < 0 || riskyShareRatio > 1
    || !boundedPct(safeRealisedDefaultRatePctPoints) || !boundedPct(riskyRealisedDefaultRatePctPoints)) return null;
  const realisedDefaultRatePctPoints = (1 - riskyShareRatio) * safeRealisedDefaultRatePctPoints
    + riskyShareRatio * riskyRealisedDefaultRatePctPoints;
  return {
    riskyShareRatio,
    realisedDefaultRatePctPoints,
  };
}

export type RiskTransferMetrics = {
  bankUnhedgedExposure: number;
  loanBuyerExposure: number;
  protectionSellerExposure: number;
  systemFinalHolderExposure: number;
  conservationGap: number;
};

export function riskTransferMetrics({
  originatedExposure,
  retainedExposure,
  soldExposure,
  purchasedProtectionOnRetained,
}: {
  originatedExposure: number;
  retainedExposure: number;
  soldExposure: number;
  purchasedProtectionOnRetained: number;
}): RiskTransferMetrics | null {
  if (!finite(originatedExposure, retainedExposure, soldExposure, purchasedProtectionOnRetained)
    || [originatedExposure, retainedExposure, soldExposure, purchasedProtectionOnRetained].some((value) => value < 0)
    || Math.abs(originatedExposure - retainedExposure - soldExposure) > 1e-9
    || purchasedProtectionOnRetained > retainedExposure) return null;
  const bankUnhedgedExposure = retainedExposure - purchasedProtectionOnRetained;
  const loanBuyerExposure = soldExposure;
  const protectionSellerExposure = purchasedProtectionOnRetained;
  const systemFinalHolderExposure = bankUnhedgedExposure + loanBuyerExposure + protectionSellerExposure;
  return {
    bankUnhedgedExposure,
    loanBuyerExposure,
    protectionSellerExposure,
    systemFinalHolderExposure,
    conservationGap: systemFinalHolderExposure - originatedExposure,
  };
}

export type IdentificationGate = {
  policyTreatmentDefinedBeforeOutcome: boolean;
  policyShockExogeneityEstablished: boolean;
  predeterminedIntermediaryExposure: boolean;
  sameBorrowerOrApplicationDemandControl: boolean;
  lenderCapacityFrozenOrModelled: boolean;
  borrowerRiskFrozenOrModelled: boolean;
  exAnteRiskOutcomeObserved: boolean;
  commonSupportEstablished: boolean;
  eventDecisionOutcomeClocksOrdered: boolean;
  noPostTreatmentControls: boolean;
  inferenceMatchesAssignment: boolean;
};

export function riskTakingIdentificationStatus(gate: IdentificationGate): {
  status: RiskTakingIdentificationStatus;
  passed: number;
  total: number;
  failedKeys: (keyof IdentificationGate)[];
} {
  const entries = Object.entries(gate) as [keyof IdentificationGate, boolean][];
  const failedKeys = entries.filter(([, passed]) => !passed).map(([key]) => key);
  const passed = entries.length - failedKeys.length;
  const status: RiskTakingIdentificationStatus = failedKeys.length === 0
    ? 'identified-candidate'
    : passed >= 8
      ? 'mechanism-consistent'
      : 'descriptive';
  return { status, passed, total: entries.length, failedKeys };
}

const close = (left: number | null | undefined, right: number, tolerance = 1e-9) => left !== null
  && left !== undefined
  && Number.isFinite(left)
  && Math.abs(left - right) <= tolerance;

export const canonicalSafeCandidate: RiskSelectionInput = {
  synthetic: true,
  candidateId: 'SYN_SAFE_PROJECT',
  productExposureBasis: 'same synthetic equal-EAD one-year bullet-loan exposure',
  contractMaturityMonths: 12,
  pdForecastHorizonMonths: 12,
  eadAmount: 100,
  eadCurrency: 'SYN',
  grossYieldPctPointsPerYear: 5.4,
  fundingCostPctPointsPerYear: 3.4,
  operatingCostPctPointsPerYear: 0.5,
  pdPctPoints: 1,
  lgdPctPoints: 30,
  capitalAndLiquidityChargePctPointsPerYear: 0.3,
  unexpectedLossProxyPctPoints: 1,
  riskShadowPricePerUnexpectedLossPoint: 0.2,
  targetResidualReturnPctPointsPerYear: 0.5,
  maximumDecisionPdPctPoints: 6,
  maximumUnexpectedLossProxyPctPoints: 5,
};

export const canonicalRiskyCandidate: RiskSelectionInput = {
  synthetic: true,
  candidateId: 'SYN_RISKY_PROJECT',
  productExposureBasis: 'same synthetic equal-EAD one-year bullet-loan exposure',
  contractMaturityMonths: 12,
  pdForecastHorizonMonths: 12,
  eadAmount: 100,
  eadCurrency: 'SYN',
  grossYieldPctPointsPerYear: 8.4,
  fundingCostPctPointsPerYear: 3.4,
  operatingCostPctPointsPerYear: 0.5,
  pdPctPoints: 5,
  lgdPctPoints: 50,
  capitalAndLiquidityChargePctPointsPerYear: 0.5,
  unexpectedLossProxyPctPoints: 4,
  riskShadowPricePerUnexpectedLossPoint: 0.2,
  targetResidualReturnPctPointsPerYear: 0.5,
  maximumDecisionPdPctPoints: 6,
  maximumUnexpectedLossProxyPctPoints: 5,
};

const safeLoose = riskAdjustedSelectionMetrics(canonicalSafeCandidate);
const riskyLoose = riskAdjustedSelectionMetrics(canonicalRiskyCandidate);
const riskyTight = riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, riskShadowPricePerUnexpectedLossPoint: 0.4 });
const yieldMixHighSafe = searchForYieldMix(4, 7, 5);
const yieldMixLowSafe = searchForYieldMix(1, 7, 5);
const yieldMixInfeasible = searchForYieldMix(1, 4, 5);
const riskBudgetHighVol = riskBudgetExposureMetrics({ lossBudget: 10, currentMeasuredVolatilityPctPoints: 8, confidenceMultiplier: 2.5, stressLossRatePctPoints: 25 });
const riskBudgetLowVol = riskBudgetExposureMetrics({ lossBudget: 10, currentMeasuredVolatilityPctPoints: 4, confidenceMultiplier: 2.5, stressLossRatePctPoints: 25 });
const marginNoFloor = marginPressureMetrics({ ...canonicalMarginProxyBasis, assetYieldBeforePctPoints: 6, depositCostBeforePctPoints: 2, otherFundingCostPctPoints: 0.5, policyRateChangePctPoints: -3, assetYieldPassThrough: 0.8, depositRatePassThrough: 0.5, depositRateFloorPctPoints: 0, riskShiftingSensitivity: 0.8, capacityRetrenchmentSensitivity: 0.4 });
const marginWithFloor = marginPressureMetrics({ ...canonicalMarginProxyBasis, assetYieldBeforePctPoints: 6, depositCostBeforePctPoints: 2, otherFundingCostPctPoints: 0.5, policyRateChangePctPoints: -3, assetYieldPassThrough: 0.8, depositRatePassThrough: 0.5, depositRateFloorPctPoints: 1.5, riskShiftingSensitivity: 0.4, capacityRetrenchmentSensitivity: 0.8 });
const exAnteBefore = cohortRiskMetrics({ riskyShareRatio: 0.2, safeRealisedDefaultRatePctPoints: 1, riskyRealisedDefaultRatePctPoints: 8 });
const exAnteAfterSupport = cohortRiskMetrics({ riskyShareRatio: 0.4, safeRealisedDefaultRatePctPoints: 0.5, riskyRealisedDefaultRatePctPoints: 4 });
const transfer = riskTransferMetrics({ originatedExposure: 100, retainedExposure: 20, soldExposure: 80, purchasedProtectionOnRetained: 10 });

export const identifiedCandidateGate: IdentificationGate = {
  policyTreatmentDefinedBeforeOutcome: true,
  policyShockExogeneityEstablished: true,
  predeterminedIntermediaryExposure: true,
  sameBorrowerOrApplicationDemandControl: true,
  lenderCapacityFrozenOrModelled: true,
  borrowerRiskFrozenOrModelled: true,
  exAnteRiskOutcomeObserved: true,
  commonSupportEstablished: true,
  eventDecisionOutcomeClocksOrdered: true,
  noPostTreatmentControls: true,
  inferenceMatchesAssignment: true,
};

export const canonicalIdentificationGate: IdentificationGate = {
  ...identifiedCandidateGate,
  policyShockExogeneityEstablished: false,
  predeterminedIntermediaryExposure: false,
};

const identificationMutations = (Object.keys(identifiedCandidateGate) as (keyof IdentificationGate)[])
  .map((key) => ({ key, result: riskTakingIdentificationStatus({ ...identifiedCandidateGate, [key]: false }) }));

export const riskTakingFixtureAudit = [
  { key: 'EL-5x50', passed: close(expectedCreditLossRatePctPoints(5, 50), 2.5) },
  { key: 'EL-boundary-zero', passed: close(expectedCreditLossRatePctPoints(0, 100), 0) },
  { key: 'EL-rejects-negative-PD', passed: expectedCreditLossRatePctPoints(-1, 50) === null },
  { key: 'EL-rejects-LGD-over-100', passed: expectedCreditLossRatePctPoints(2, 101) === null },
  { key: 'safe-EL', passed: close(safeLoose?.expectedLossRatePctPoints, 0.3) },
  { key: 'safe-EL-amount', passed: close(safeLoose?.expectedLossAmount, 0.3) && safeLoose?.eadAmount === 100 && safeLoose.eadCurrency === 'SYN' },
  { key: 'safe-margin-before-tail', passed: close(safeLoose?.expectedMarginBeforeTailRiskPctPoints, 0.9) },
  { key: 'safe-tail-charge', passed: close(safeLoose?.tailRiskChargePctPoints, 0.2) },
  { key: 'safe-risk-adjusted', passed: close(safeLoose?.riskAdjustedContributionPctPoints, 0.7) },
  { key: 'safe-three-gates-pass', passed: safeLoose?.returnHurdlePassed === true && safeLoose.decisionPdCapPassed === true && safeLoose.unexpectedLossBudgetPassed === true },
  { key: 'safe-accepted', passed: safeLoose?.accepted === true },
  { key: 'risky-EL', passed: close(riskyLoose?.expectedLossRatePctPoints, 2.5) },
  { key: 'risky-EL-amount', passed: close(riskyLoose?.expectedLossAmount, 2.5) && riskyLoose?.eadAmount === 100 && riskyLoose.eadCurrency === 'SYN' },
  { key: 'risky-margin-before-tail', passed: close(riskyLoose?.expectedMarginBeforeTailRiskPctPoints, 1.5) },
  { key: 'risky-loose-tail-charge', passed: close(riskyLoose?.tailRiskChargePctPoints, 0.8) },
  { key: 'risky-loose-risk-adjusted', passed: close(riskyLoose?.riskAdjustedContributionPctPoints, 0.7) },
  { key: 'risky-loose-accepted', passed: riskyLoose?.accepted === true },
  { key: 'risky-tight-risk-adjusted', passed: close(riskyTight?.riskAdjustedContributionPctPoints, -0.1) },
  { key: 'risky-tight-rejected', passed: riskyTight?.accepted === false },
  { key: 'selection-rejects-pd-cap-breach', passed: riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, maximumDecisionPdPctPoints: 4 })?.accepted === false },
  { key: 'selection-rejects-tail-budget-breach', passed: riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, maximumUnexpectedLossProxyPctPoints: 3 })?.accepted === false },
  { key: 'selection-rejects-PD-over-100', passed: riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, pdPctPoints: 101 }) === null },
  { key: 'selection-passport-common-12m-equal-EAD-SYN', passed: canonicalSafeCandidate.pdForecastHorizonMonths === 12 && canonicalRiskyCandidate.pdForecastHorizonMonths === 12 && canonicalSafeCandidate.contractMaturityMonths === 12 && canonicalRiskyCandidate.contractMaturityMonths === 12 && canonicalSafeCandidate.eadAmount === canonicalRiskyCandidate.eadAmount && canonicalSafeCandidate.eadCurrency === canonicalRiskyCandidate.eadCurrency && canonicalSafeCandidate.productExposureBasis === canonicalRiskyCandidate.productExposureBasis },
  { key: 'selection-rejects-nonannual-PD-horizon', passed: riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, pdForecastHorizonMonths: 6 }) === null },
  { key: 'selection-rejects-empty-EAD-currency', passed: riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, eadCurrency: '' }) === null },
  { key: 'selection-rejects-nonpositive-EAD', passed: riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, eadAmount: 0 }) === null },
  { key: 'yield-high-safe-share', passed: close(yieldMixHighSafe?.rawRiskyShareRatio, 1 / 3) },
  { key: 'yield-low-safe-share', passed: close(yieldMixLowSafe?.rawRiskyShareRatio, 2 / 3) },
  { key: 'yield-lower-safe-requires-more-risk', passed: (yieldMixLowSafe?.rawRiskyShareRatio ?? 0) > (yieldMixHighSafe?.rawRiskyShareRatio ?? 1) },
  { key: 'yield-target-feasible', passed: yieldMixLowSafe?.feasibleWithoutLeverage === true },
  { key: 'yield-target-infeasible', passed: yieldMixInfeasible?.feasibleWithoutLeverage === false && close(yieldMixInfeasible?.rawRiskyShareRatio, 4 / 3) },
  { key: 'yield-display-clamped', passed: close(yieldMixInfeasible?.displayedRiskyShareRatio, 1) && close(yieldMixInfeasible?.displayedPromisedYieldPctPoints, 4) },
  { key: 'yield-rejects-reversed-assets', passed: searchForYieldMix(5, 4, 4.5) === null },
  { key: 'risk-budget-high-vol-model-capacity', passed: close(riskBudgetHighVol?.modelOnlyMaximumExposure, 50) },
  { key: 'risk-budget-low-vol-model-capacity', passed: close(riskBudgetLowVol?.modelOnlyMaximumExposure, 100) },
  { key: 'risk-budget-low-vol-doubles-model-capacity', passed: close((riskBudgetLowVol?.modelOnlyMaximumExposure ?? 0) / (riskBudgetHighVol?.modelOnlyMaximumExposure ?? 1), 2) },
  { key: 'risk-budget-stress-capacity', passed: close(riskBudgetHighVol?.stressMaximumExposure, 40) && close(riskBudgetLowVol?.stressMaximumExposure, 40) },
  { key: 'risk-budget-overlay-binds', passed: riskBudgetHighVol?.bindingMeasure === 'stress-overlay' && riskBudgetLowVol?.bindingMeasure === 'stress-overlay' },
  { key: 'risk-budget-rejects-zero-vol', passed: riskBudgetExposureMetrics({ lossBudget: 10, currentMeasuredVolatilityPctPoints: 0, confidenceMultiplier: 2.5, stressLossRatePctPoints: 25 }) === null },
  { key: 'margin-no-floor-before', passed: close(marginNoFloor?.marginBeforePctPoints, 3.5) },
  { key: 'margin-no-floor-after', passed: close(marginNoFloor?.marginAfterPctPoints, 2.6) },
  { key: 'margin-no-floor-change', passed: close(marginNoFloor?.marginChangePctPoints, -0.9) },
  { key: 'margin-no-floor-not-binding', passed: marginNoFloor?.depositFloorBinding === false },
  { key: 'margin-no-floor-gamble-dominates', passed: (marginNoFloor?.illustrativeNetRiskChoicePressure ?? -1) > 0 },
  { key: 'margin-floor-after', passed: close(marginWithFloor?.marginAfterPctPoints, 1.6) },
  { key: 'margin-floor-change', passed: close(marginWithFloor?.marginChangePctPoints, -1.9) },
  { key: 'margin-floor-binding', passed: marginWithFloor?.depositFloorBinding === true },
  { key: 'margin-floor-retrenchment-dominates', passed: (marginWithFloor?.illustrativeNetRiskChoicePressure ?? 1) < 0 },
  { key: 'margin-rejects-floor-above-before-cost', passed: marginPressureMetrics({ ...canonicalMarginProxyBasis, assetYieldBeforePctPoints: 6, depositCostBeforePctPoints: 2, otherFundingCostPctPoints: 0.5, policyRateChangePctPoints: -3, assetYieldPassThrough: 0.8, depositRatePassThrough: 0.5, depositRateFloorPctPoints: 2.5, riskShiftingSensitivity: 0.4, capacityRetrenchmentSensitivity: 0.8 }) === null },
  { key: 'cohort-before-risk-share', passed: close(exAnteBefore?.riskyShareRatio, 0.2) },
  { key: 'cohort-before-realised-default-rate', passed: close(exAnteBefore?.realisedDefaultRatePctPoints, 2.4) },
  { key: 'cohort-after-risk-share', passed: close(exAnteAfterSupport?.riskyShareRatio, 0.4) },
  { key: 'cohort-after-realised-default-rate', passed: close(exAnteAfterSupport?.realisedDefaultRatePctPoints, 1.9) },
  { key: 'cohort-selection-risk-rises-while-realised-default-rate-falls', passed: (exAnteAfterSupport?.riskyShareRatio ?? 0) > (exAnteBefore?.riskyShareRatio ?? 1) && (exAnteAfterSupport?.realisedDefaultRatePctPoints ?? 99) < (exAnteBefore?.realisedDefaultRatePctPoints ?? 0) },
  { key: 'cohort-rejects-share-over-one', passed: cohortRiskMetrics({ riskyShareRatio: 1.1, safeRealisedDefaultRatePctPoints: 1, riskyRealisedDefaultRatePctPoints: 8 }) === null },
  { key: 'transfer-bank-unhedged', passed: close(transfer?.bankUnhedgedExposure, 10) },
  { key: 'transfer-buyers', passed: close(transfer?.loanBuyerExposure, 80) },
  { key: 'transfer-protection-seller', passed: close(transfer?.protectionSellerExposure, 10) },
  { key: 'transfer-system-conservation', passed: close(transfer?.systemFinalHolderExposure, 100) && close(transfer?.conservationGap, 0) },
  { key: 'transfer-rejects-nonconservation', passed: riskTransferMetrics({ originatedExposure: 100, retainedExposure: 30, soldExposure: 80, purchasedProtectionOnRetained: 0 }) === null },
  { key: 'transfer-rejects-overhedge', passed: riskTransferMetrics({ originatedExposure: 100, retainedExposure: 20, soldExposure: 80, purchasedProtectionOnRetained: 25 }) === null },
  { key: 'identification-complete-is-candidate', passed: riskTakingIdentificationStatus(identifiedCandidateGate).status === 'identified-candidate' },
  { key: 'identification-complete-count', passed: riskTakingIdentificationStatus(identifiedCandidateGate).passed === 11 },
  { key: 'conditional-level-fixture-is-not-identified', passed: riskTakingIdentificationStatus(canonicalIdentificationGate).status === 'mechanism-consistent' && riskTakingIdentificationStatus(canonicalIdentificationGate).failedKeys.includes('policyShockExogeneityEstablished') && riskTakingIdentificationStatus(canonicalIdentificationGate).failedKeys.includes('predeterminedIntermediaryExposure') },
  ...identificationMutations.map(({ key, result }) => ({
    key: `identification-mutation-${key}`,
    passed: result.status !== 'identified-candidate' && result.failedKeys.length === 1 && result.failedKeys[0] === key,
  })),
] as const;

export const riskTakingFixturePassedCount = riskTakingFixtureAudit.filter(({ passed }) => passed).length;

if (riskTakingFixturePassedCount !== riskTakingFixtureAudit.length) {
  const failed = riskTakingFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ');
  throw new Error(`Risk-taking fixture audit failed: ${failed}`);
}
