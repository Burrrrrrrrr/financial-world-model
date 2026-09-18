export type BalanceSheetAmountUnit = 'SYN-currency';
export type RatioUnit = 'decimal-ratio';

export type BalanceSheetLine = {
  lineId: string;
  label: string;
  amount: number;
  measurementBasis: 'market-value' | 'book-value' | 'replacement-cost' | 'face-value' | 'synthetic-assumption';
};

export type BalanceSheetSnapshotInput = {
  synthetic: true;
  currency: 'SYN';
  amountUnit: BalanceSheetAmountUnit;
  observationTime: string;
  assets: BalanceSheetLine[];
  liabilities: BalanceSheetLine[];
};

export type BalanceSheetSnapshotResult = {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  liabilitiesToAssetsRatio: number;
  assetsToNetWorthMultiple: number | null;
};

export type CollateralAssetInput = {
  collateralId: string;
  label: string;
  marketValue: number;
  ownershipShareRatio: number;
  valuationHaircutRatio: number;
  liquidityHaircutRatio: number;
  fxRiskReserveRatio: number;
  advanceRateRatio: number;
  concentrationCap: number | null;
  priorSeniorClaims: number;
  enforcementCost: number;
  eligible: boolean;
  transferable: boolean;
  perfected: boolean;
  enforceable: boolean;
};

export type PledgeableCollateralInput = {
  synthetic: true;
  currency: 'SYN';
  amountUnit: BalanceSheetAmountUnit;
  decisionTime: string;
  currentFacilityDrawn: number;
  assets: CollateralAssetInput[];
};

export type CollateralContribution = {
  collateralId: string;
  legalGatePassed: boolean;
  ownedGrossValue: number;
  valueAfterHaircuts: number;
  borrowingBaseContribution: number;
};

export type PledgeableCollateralResult = {
  contributions: CollateralContribution[];
  totalBorrowingBase: number;
  signedFacilityHeadroom: number;
  maxIncrementalAssetBasedPrincipal: number;
};

export type DebtServiceCapacityInput = {
  synthetic: true;
  currency: 'SYN';
  cashFlowUnit: 'SYN-currency-per-year';
  principalUnit: BalanceSheetAmountUnit;
  observationWindow: 'trailing-12-months';
  ebitda: number;
  cashTaxes: number;
  maintenanceCapexReserve: number;
  otherSeniorCashCommitments: number;
  minimumDSCR: number;
  currentAnnualDebtService: number;
  marginalAnnualInterestRateRatio: number;
  amortisationTermMonths: number;
};

export type DebtServiceCapacityResult = {
  qualifyingCashFlow: number;
  maximumAnnualDebtService: number;
  signedAnnualDebtServiceHeadroom: number;
  annualDebtServicePerPrincipal: number;
  signedIncrementalEarningsBasedPrincipal: number;
  maxIncrementalEarningsBasedPrincipal: number;
};

export type CapacityConstraintInput = {
  constraintId: 'asset-based' | 'earnings-based' | 'contractual' | 'lender-offer';
  applicable: boolean;
  signedIncrementalPrincipalHeadroom: number | null;
  currency: 'SYN';
  amountUnit: BalanceSheetAmountUnit;
  decisionTime: string;
  borrowerLegalEntityId: string;
  facilityId: string;
  principalConcept: string;
  horizon: string;
};

export type BorrowingCapacityEnvelopeResult = {
  comparableConstraintCount: number;
  signedBindingHeadroom: number;
  lendableIncrementalPrincipal: number;
  bindingConstraintIds: CapacityConstraintInput['constraintId'][];
};

export type ExternalFinancePremiumInput = {
  synthetic: true;
  rateUnit: 'percent-per-year';
  netWorthRatio: number;
  matchedBenchmarkPct: number | null;
  opportunityCostInternalFundsPct: number | null;
  requiredExternalReturnPct: number;
  illustrativeModel: {
    targetNetWorthRatio: number;
    premiumFloorBp: number;
    slopeBpPerNetWorthPercentagePointShortfall: number;
  };
};

export type ExternalFinancePremiumResult = {
  observableSpreadBp: number | null;
  definitionalPremiumBp: number | null;
  measurementStatus: 'not-comparable' | 'spread-only' | 'efp-estimated';
  netWorthShortfallPercentagePoints: number;
  illustrativeModelPremiumBp: number;
};

export type DebtOverhangInput = {
  synthetic: true;
  amountUnit: BalanceSheetAmountUnit;
  projectCost: number;
  expectedPresentValueOfProjectPayoff: number;
  legacyCreditorCaptureShareRatio: number;
};

export type DebtOverhangResult = {
  totalProjectNPV: number;
  valueAccruingToLegacyCreditors: number;
  valueAccruingToEquity: number;
  equityPrivateNPV: number;
  debtOverhangBlocksPositiveNPVProject: boolean;
};

export type FinancialAcceleratorInput = {
  synthetic: true;
  amountUnit: BalanceSheetAmountUnit;
  initialBorrowerNetWorthShock: number;
  localFeedbackGain: number;
  rounds: number;
};

export type FinancialAcceleratorResult = {
  roundEffects: number[];
  finiteRoundCumulativeEffect: number;
  finiteRoundAmplificationMultiple: number | null;
  stableInfiniteCumulativeEffect: number | null;
  stabilityStatus: 'locally-stable' | 'unit-root-or-explosive';
};

export type IdentificationGate = {
  plausiblyExogenousCollateralShock: boolean;
  preExistingExposureMeasured: boolean;
  localDemandOrProductivityConfoundingAddressed: boolean;
  preTrendsSupported: boolean;
  commonSupportEstablished: boolean;
  treatmentSelectionAndAttritionAddressed: boolean;
  interferenceOrSpilloversAddressed: boolean;
};

export type CollateralIdentificationInput = {
  synthetic: true;
  outcomeUnit: 'SYN-real-outcome-index';
  treatedPre: number;
  treatedPost: number;
  controlPre: number;
  controlPost: number;
  gates: IdentificationGate;
};

export type CollateralIdentificationResult = {
  treatedChange: number;
  controlChange: number;
  descriptiveDifferenceInDifferences: number;
  identificationStatus: 'descriptive' | 'identified-candidate-under-declared-gates';
  failedGateIds: (keyof IdentificationGate)[];
};

function finite(value: number) {
  return Number.isFinite(value);
}

function uniqueNonEmpty(values: string[]) {
  return values.every((value) => value.trim().length > 0) && new Set(values).size === values.length;
}

function inClosedUnitInterval(value: number) {
  return finite(value) && value >= 0 && value <= 1;
}

export function balanceSheetSnapshotMetrics(input: BalanceSheetSnapshotInput): BalanceSheetSnapshotResult | null {
  const lines = [...input.assets, ...input.liabilities];
  if (!input.synthetic || input.currency !== 'SYN' || input.amountUnit !== 'SYN-currency' || !input.observationTime
    || input.assets.length === 0 || input.liabilities.length === 0 || !uniqueNonEmpty(lines.map(({ lineId }) => lineId))
    || lines.some(({ amount, label }) => !finite(amount) || amount < 0 || !label.trim())) return null;
  const totalAssets = input.assets.reduce((sum, line) => sum + line.amount, 0);
  const totalLiabilities = input.liabilities.reduce((sum, line) => sum + line.amount, 0);
  if (!(totalAssets > 0)) return null;
  const netWorth = totalAssets - totalLiabilities;
  return {
    totalAssets,
    totalLiabilities,
    netWorth,
    liabilitiesToAssetsRatio: totalLiabilities / totalAssets,
    assetsToNetWorthMultiple: netWorth > 0 ? totalAssets / netWorth : null,
  };
}

export function pledgeableCollateralMetrics(input: PledgeableCollateralInput): PledgeableCollateralResult | null {
  if (!input.synthetic || input.currency !== 'SYN' || input.amountUnit !== 'SYN-currency' || !input.decisionTime
    || !finite(input.currentFacilityDrawn) || input.currentFacilityDrawn < 0 || input.assets.length === 0
    || !uniqueNonEmpty(input.assets.map(({ collateralId }) => collateralId))) return null;
  const valid = input.assets.every((asset) => finite(asset.marketValue) && asset.marketValue >= 0
    && inClosedUnitInterval(asset.ownershipShareRatio) && inClosedUnitInterval(asset.valuationHaircutRatio)
    && inClosedUnitInterval(asset.liquidityHaircutRatio) && inClosedUnitInterval(asset.fxRiskReserveRatio)
    && asset.valuationHaircutRatio + asset.liquidityHaircutRatio + asset.fxRiskReserveRatio <= 1
    && inClosedUnitInterval(asset.advanceRateRatio)
    && (asset.concentrationCap === null || (finite(asset.concentrationCap) && asset.concentrationCap >= 0))
    && finite(asset.priorSeniorClaims) && asset.priorSeniorClaims >= 0
    && finite(asset.enforcementCost) && asset.enforcementCost >= 0 && asset.label.trim().length > 0);
  if (!valid) return null;
  const contributions = input.assets.map((asset): CollateralContribution => {
    const legalGatePassed = asset.eligible && asset.transferable && asset.perfected && asset.enforceable;
    const ownedGrossValue = asset.marketValue * asset.ownershipShareRatio;
    const totalHaircut = asset.valuationHaircutRatio + asset.liquidityHaircutRatio + asset.fxRiskReserveRatio;
    const valueAfterHaircuts = legalGatePassed ? ownedGrossValue * (1 - totalHaircut) : 0;
    const advancedValue = asset.advanceRateRatio * valueAfterHaircuts;
    const cappedAdvancedValue = asset.concentrationCap === null ? advancedValue : Math.min(advancedValue, asset.concentrationCap);
    const borrowingBaseContribution = legalGatePassed
      ? Math.max(0, cappedAdvancedValue - asset.priorSeniorClaims - asset.enforcementCost)
      : 0;
    return { collateralId: asset.collateralId, legalGatePassed, ownedGrossValue, valueAfterHaircuts, borrowingBaseContribution };
  });
  const totalBorrowingBase = contributions.reduce((sum, item) => sum + item.borrowingBaseContribution, 0);
  const signedFacilityHeadroom = totalBorrowingBase - input.currentFacilityDrawn;
  return { contributions, totalBorrowingBase, signedFacilityHeadroom, maxIncrementalAssetBasedPrincipal: Math.max(0, signedFacilityHeadroom) };
}

function monthlyPaymentPerPrincipal(annualRateRatio: number, termMonths: number) {
  const monthlyRate = annualRateRatio / 12;
  if (monthlyRate === 0) return 1 / termMonths;
  return monthlyRate / (1 - (1 + monthlyRate) ** (-termMonths));
}

export function debtServiceCapacityMetrics(input: DebtServiceCapacityInput): DebtServiceCapacityResult | null {
  const nonnegative = [input.ebitda, input.cashTaxes, input.maintenanceCapexReserve, input.otherSeniorCashCommitments, input.currentAnnualDebtService, input.marginalAnnualInterestRateRatio];
  if (!input.synthetic || input.currency !== 'SYN' || input.cashFlowUnit !== 'SYN-currency-per-year'
    || input.principalUnit !== 'SYN-currency' || input.observationWindow !== 'trailing-12-months'
    || nonnegative.some((value) => !finite(value) || value < 0) || !finite(input.minimumDSCR) || input.minimumDSCR <= 0
    || !Number.isSafeInteger(input.amortisationTermMonths) || input.amortisationTermMonths <= 0) return null;
  const qualifyingCashFlow = input.ebitda - input.cashTaxes - input.maintenanceCapexReserve - input.otherSeniorCashCommitments;
  const maximumAnnualDebtService = qualifyingCashFlow / input.minimumDSCR;
  const signedAnnualDebtServiceHeadroom = maximumAnnualDebtService - input.currentAnnualDebtService;
  const annualDebtServicePerPrincipal = monthlyPaymentPerPrincipal(input.marginalAnnualInterestRateRatio, input.amortisationTermMonths) * 12;
  const signedIncrementalEarningsBasedPrincipal = signedAnnualDebtServiceHeadroom / annualDebtServicePerPrincipal;
  const maxIncrementalEarningsBasedPrincipal = Math.max(0, signedIncrementalEarningsBasedPrincipal);
  return { qualifyingCashFlow, maximumAnnualDebtService, signedAnnualDebtServiceHeadroom, annualDebtServicePerPrincipal, signedIncrementalEarningsBasedPrincipal, maxIncrementalEarningsBasedPrincipal };
}

export function borrowingCapacityEnvelope(input: CapacityConstraintInput[]): BorrowingCapacityEnvelopeResult | null {
  const active = input.filter(({ applicable }) => applicable);
  const comparableDimensions = ['currency', 'amountUnit', 'decisionTime', 'borrowerLegalEntityId', 'facilityId', 'principalConcept', 'horizon'] as const;
  if (active.length === 0 || !uniqueNonEmpty(input.map(({ constraintId }) => constraintId))
    || active.some(({ signedIncrementalPrincipalHeadroom, currency, amountUnit, decisionTime, borrowerLegalEntityId, facilityId, principalConcept, horizon }) => signedIncrementalPrincipalHeadroom === null
      || !finite(signedIncrementalPrincipalHeadroom) || currency !== 'SYN' || amountUnit !== 'SYN-currency'
      || !decisionTime.trim() || !borrowerLegalEntityId.trim() || !facilityId.trim() || !principalConcept.trim() || !horizon.trim())
    || comparableDimensions.some((dimension) => new Set(active.map((constraint) => constraint[dimension])).size !== 1)) return null;
  const signedBindingHeadroom = Math.min(...active.map(({ signedIncrementalPrincipalHeadroom }) => signedIncrementalPrincipalHeadroom as number));
  const tolerance = Math.max(1, Math.abs(signedBindingHeadroom)) * 1e-9;
  const bindingConstraintIds = active
    .filter(({ signedIncrementalPrincipalHeadroom }) => Math.abs((signedIncrementalPrincipalHeadroom as number) - signedBindingHeadroom) <= tolerance)
    .map(({ constraintId }) => constraintId);
  return {
    comparableConstraintCount: active.length,
    signedBindingHeadroom,
    lendableIncrementalPrincipal: Math.max(0, signedBindingHeadroom),
    bindingConstraintIds,
  };
}

export function externalFinancePremiumMetrics(input: ExternalFinancePremiumInput): ExternalFinancePremiumResult | null {
  const { illustrativeModel: model } = input;
  if (!input.synthetic || input.rateUnit !== 'percent-per-year' || !inClosedUnitInterval(input.netWorthRatio)
    || (input.matchedBenchmarkPct !== null && !finite(input.matchedBenchmarkPct))
    || (input.opportunityCostInternalFundsPct !== null && !finite(input.opportunityCostInternalFundsPct)) || !finite(input.requiredExternalReturnPct)
    || !inClosedUnitInterval(model.targetNetWorthRatio) || !finite(model.premiumFloorBp) || model.premiumFloorBp < 0
    || !finite(model.slopeBpPerNetWorthPercentagePointShortfall) || model.slopeBpPerNetWorthPercentagePointShortfall < 0) return null;
  const netWorthShortfallPercentagePoints = Math.max(0, model.targetNetWorthRatio - input.netWorthRatio) * 100;
  const observableSpreadBp = input.matchedBenchmarkPct === null ? null : (input.requiredExternalReturnPct - input.matchedBenchmarkPct) * 100;
  const definitionalPremiumBp = input.opportunityCostInternalFundsPct === null ? null : (input.requiredExternalReturnPct - input.opportunityCostInternalFundsPct) * 100;
  return {
    observableSpreadBp,
    definitionalPremiumBp,
    measurementStatus: definitionalPremiumBp !== null ? 'efp-estimated' : observableSpreadBp !== null ? 'spread-only' : 'not-comparable',
    netWorthShortfallPercentagePoints,
    illustrativeModelPremiumBp: model.premiumFloorBp + netWorthShortfallPercentagePoints * model.slopeBpPerNetWorthPercentagePointShortfall,
  };
}

export function debtOverhangMetrics(input: DebtOverhangInput): DebtOverhangResult | null {
  if (!input.synthetic || input.amountUnit !== 'SYN-currency' || !finite(input.projectCost) || input.projectCost < 0
    || !finite(input.expectedPresentValueOfProjectPayoff) || input.expectedPresentValueOfProjectPayoff < 0
    || !inClosedUnitInterval(input.legacyCreditorCaptureShareRatio)) return null;
  const totalProjectNPV = input.expectedPresentValueOfProjectPayoff - input.projectCost;
  const valueAccruingToLegacyCreditors = input.expectedPresentValueOfProjectPayoff * input.legacyCreditorCaptureShareRatio;
  const valueAccruingToEquity = input.expectedPresentValueOfProjectPayoff - valueAccruingToLegacyCreditors;
  const equityPrivateNPV = valueAccruingToEquity - input.projectCost;
  return {
    totalProjectNPV,
    valueAccruingToLegacyCreditors,
    valueAccruingToEquity,
    equityPrivateNPV,
    debtOverhangBlocksPositiveNPVProject: totalProjectNPV > 0 && equityPrivateNPV < 0,
  };
}

export function financialAcceleratorMetrics(input: FinancialAcceleratorInput): FinancialAcceleratorResult | null {
  if (!input.synthetic || input.amountUnit !== 'SYN-currency' || !finite(input.initialBorrowerNetWorthShock)
    || !finite(input.localFeedbackGain) || input.localFeedbackGain < 0 || input.localFeedbackGain > 2
    || !Number.isSafeInteger(input.rounds) || input.rounds < 1 || input.rounds > 20) return null;
  const roundEffects = Array.from({ length: input.rounds }, (_, index) => input.initialBorrowerNetWorthShock * input.localFeedbackGain ** index);
  const finiteRoundCumulativeEffect = roundEffects.reduce((sum, value) => sum + value, 0);
  const finiteRoundAmplificationMultiple = input.initialBorrowerNetWorthShock === 0 ? null : finiteRoundCumulativeEffect / input.initialBorrowerNetWorthShock;
  const locallyStable = input.localFeedbackGain < 1;
  return {
    roundEffects,
    finiteRoundCumulativeEffect,
    finiteRoundAmplificationMultiple,
    stableInfiniteCumulativeEffect: locallyStable ? input.initialBorrowerNetWorthShock / (1 - input.localFeedbackGain) : null,
    stabilityStatus: locallyStable ? 'locally-stable' : 'unit-root-or-explosive',
  };
}

export function collateralIdentificationMetrics(input: CollateralIdentificationInput): CollateralIdentificationResult | null {
  const outcomes = [input.treatedPre, input.treatedPost, input.controlPre, input.controlPost];
  if (!input.synthetic || input.outcomeUnit !== 'SYN-real-outcome-index' || outcomes.some((value) => !finite(value))) return null;
  const failedGateIds = (Object.entries(input.gates) as [keyof IdentificationGate, boolean][])
    .filter(([, passed]) => !passed)
    .map(([key]) => key);
  const treatedChange = input.treatedPost - input.treatedPre;
  const controlChange = input.controlPost - input.controlPre;
  return {
    treatedChange,
    controlChange,
    descriptiveDifferenceInDifferences: treatedChange - controlChange,
    identificationStatus: failedGateIds.length === 0 ? 'identified-candidate-under-declared-gates' : 'descriptive',
    failedGateIds,
  };
}

export const canonicalBalanceSheetBefore: BalanceSheetSnapshotInput = {
  synthetic: true,
  currency: 'SYN',
  amountUnit: 'SYN-currency',
  observationTime: '2026-09-03T00:00:00Z',
  assets: [
    { lineId: 'cash', label: '现金', amount: 20, measurementBasis: 'synthetic-assumption' },
    { lineId: 'operating-assets', label: '经营资产', amount: 80, measurementBasis: 'replacement-cost' },
    { lineId: 'property', label: '不动产', amount: 100, measurementBasis: 'market-value' },
  ],
  liabilities: [
    { lineId: 'secured-debt', label: '有担保债务', amount: 90, measurementBasis: 'face-value' },
    { lineId: 'other-liabilities', label: '其他负债', amount: 30, measurementBasis: 'book-value' },
  ],
};

export const canonicalBalanceSheetAfter: BalanceSheetSnapshotInput = {
  ...canonicalBalanceSheetBefore,
  observationTime: '2026-09-03T00:00:01Z',
  assets: canonicalBalanceSheetBefore.assets.map((line) => line.lineId === 'property' ? { ...line, amount: 80 } : line),
};

export const canonicalCollateralInput: PledgeableCollateralInput = {
  synthetic: true,
  currency: 'SYN',
  amountUnit: 'SYN-currency',
  decisionTime: '2026-09-03T00:00:00Z',
  currentFacilityDrawn: 35,
  assets: [
    {
      collateralId: 'warehouse', label: '可转让仓库', marketValue: 100, ownershipShareRatio: 1,
      valuationHaircutRatio: 0.1, liquidityHaircutRatio: 0.1, fxRiskReserveRatio: 0,
      advanceRateRatio: 0.75, concentrationCap: null, priorSeniorClaims: 10, enforcementCost: 5,
      eligible: true, transferable: true, perfected: true, enforceable: true,
    },
    {
      collateralId: 'unperfected-receivable', label: '未完成对抗要件的应收账款', marketValue: 50, ownershipShareRatio: 1,
      valuationHaircutRatio: 0.1, liquidityHaircutRatio: 0.1, fxRiskReserveRatio: 0,
      advanceRateRatio: 0.6, concentrationCap: null, priorSeniorClaims: 0, enforcementCost: 0,
      eligible: true, transferable: true, perfected: false, enforceable: true,
    },
  ],
};

export const canonicalDebtServiceInput: DebtServiceCapacityInput = {
  synthetic: true,
  currency: 'SYN',
  cashFlowUnit: 'SYN-currency-per-year',
  principalUnit: 'SYN-currency',
  observationWindow: 'trailing-12-months',
  ebitda: 30,
  cashTaxes: 3,
  maintenanceCapexReserve: 5,
  otherSeniorCashCommitments: 2,
  minimumDSCR: 1.25,
  currentAnnualDebtService: 10,
  marginalAnnualInterestRateRatio: 0.12,
  amortisationTermMonths: 36,
};

export const canonicalExternalFinancePremiumInput: ExternalFinancePremiumInput = {
  synthetic: true,
  rateUnit: 'percent-per-year',
  netWorthRatio: 0.2,
  matchedBenchmarkPct: 4,
  opportunityCostInternalFundsPct: 4,
  requiredExternalReturnPct: 7,
  illustrativeModel: { targetNetWorthRatio: 0.3, premiumFloorBp: 100, slopeBpPerNetWorthPercentagePointShortfall: 20 },
};

export const canonicalDebtOverhangInput: DebtOverhangInput = {
  synthetic: true,
  amountUnit: 'SYN-currency',
  projectCost: 20,
  expectedPresentValueOfProjectPayoff: 28,
  legacyCreditorCaptureShareRatio: 0.4,
};

export const canonicalAcceleratorInput: FinancialAcceleratorInput = {
  synthetic: true,
  amountUnit: 'SYN-currency',
  initialBorrowerNetWorthShock: -10,
  localFeedbackGain: 0.5,
  rounds: 4,
};

export const canonicalIdentificationInput: CollateralIdentificationInput = {
  synthetic: true,
  outcomeUnit: 'SYN-real-outcome-index',
  treatedPre: 100,
  treatedPost: 88,
  controlPre: 100,
  controlPost: 96,
  gates: {
    plausiblyExogenousCollateralShock: true,
    preExistingExposureMeasured: true,
    localDemandOrProductivityConfoundingAddressed: true,
    preTrendsSupported: true,
    commonSupportEstablished: true,
    treatmentSelectionAndAttritionAddressed: true,
    interferenceOrSpilloversAddressed: true,
  },
};

export type FixtureAssertion = { key: string; passed: boolean; expected: string; observed: string };

function close(actual: number | null | undefined, expected: number, tolerance = 1e-8) {
  return actual !== null && actual !== undefined && Math.abs(actual - expected) <= tolerance;
}

const before = balanceSheetSnapshotMetrics(canonicalBalanceSheetBefore);
const after = balanceSheetSnapshotMetrics(canonicalBalanceSheetAfter);
const collateral = pledgeableCollateralMetrics(canonicalCollateralInput);
const earnings = debtServiceCapacityMetrics(canonicalDebtServiceInput);
const constraintPassport = {
  currency: 'SYN', amountUnit: 'SYN-currency', decisionTime: canonicalCollateralInput.decisionTime,
  borrowerLegalEntityId: 'SYN_BORROWER_1', facilityId: 'SYN_FACILITY_1',
  principalConcept: 'incremental-drawn-principal', horizon: '36m',
} as const;
const fixtureConstraint = (
  constraintId: CapacityConstraintInput['constraintId'],
  signedIncrementalPrincipalHeadroom: number,
  overrides: Partial<CapacityConstraintInput> = {},
): CapacityConstraintInput => ({ constraintId, applicable: true, signedIncrementalPrincipalHeadroom, ...constraintPassport, ...overrides });
const envelope = collateral && earnings ? borrowingCapacityEnvelope([
  fixtureConstraint('asset-based', collateral.signedFacilityHeadroom),
  fixtureConstraint('earnings-based', earnings.signedIncrementalEarningsBasedPrincipal),
  fixtureConstraint('contractual', 30),
  fixtureConstraint('lender-offer', 25),
]) : null;
const negativeDebtService = debtServiceCapacityMetrics({ ...canonicalDebtServiceInput, ebitda: 28, minimumDSCR: 1.5, currentAnnualDebtService: 14 });
const negativeDebtServiceEnvelope = negativeDebtService ? borrowingCapacityEnvelope([
  fixtureConstraint('asset-based', 8),
  fixtureConstraint('earnings-based', negativeDebtService.signedIncrementalEarningsBasedPrincipal),
]) : null;
const comparableFixturePair = [fixtureConstraint('asset-based', 5), fixtureConstraint('earnings-based', 6)];
const premium = externalFinancePremiumMetrics(canonicalExternalFinancePremiumInput);
const overhang = debtOverhangMetrics(canonicalDebtOverhangInput);
const accelerator = financialAcceleratorMetrics(canonicalAcceleratorInput);
const identified = collateralIdentificationMetrics(canonicalIdentificationInput);
const descriptive = collateralIdentificationMetrics({ ...canonicalIdentificationInput, gates: { ...canonicalIdentificationInput.gates, localDemandOrProductivityConfoundingAddressed: false } });

export const balanceSheetCollateralFixtureAudit: FixtureAssertion[] = [
  { key: 'snapshot.before.assets', passed: close(before?.totalAssets, 200), expected: '200', observed: String(before?.totalAssets) },
  { key: 'snapshot.before.liabilities', passed: close(before?.totalLiabilities, 120), expected: '120', observed: String(before?.totalLiabilities) },
  { key: 'snapshot.before.net-worth', passed: close(before?.netWorth, 80), expected: '80', observed: String(before?.netWorth) },
  { key: 'snapshot.after.net-worth', passed: close(after?.netWorth, 60), expected: '60', observed: String(after?.netWorth) },
  { key: 'snapshot.asset-loss-maps-one-for-one', passed: close((after?.netWorth ?? Number.NaN) - (before?.netWorth ?? Number.NaN), -20), expected: '-20', observed: String((after?.netWorth ?? 0) - (before?.netWorth ?? 0)) },
  { key: 'snapshot.nonpositive-net-worth-leverage-null', passed: balanceSheetSnapshotMetrics({ ...canonicalBalanceSheetBefore, liabilities: [{ lineId: 'debt', label: '债务', amount: 210, measurementBasis: 'face-value' }] })?.assetsToNetWorthMultiple === null, expected: 'null', observed: String(balanceSheetSnapshotMetrics({ ...canonicalBalanceSheetBefore, liabilities: [{ lineId: 'debt', label: '债务', amount: 210, measurementBasis: 'face-value' }] })?.assetsToNetWorthMultiple) },
  { key: 'collateral.warehouse-owned-value', passed: close(collateral?.contributions[0]?.ownedGrossValue, 100), expected: '100', observed: String(collateral?.contributions[0]?.ownedGrossValue) },
  { key: 'collateral.warehouse-after-haircuts', passed: close(collateral?.contributions[0]?.valueAfterHaircuts, 80), expected: '80', observed: String(collateral?.contributions[0]?.valueAfterHaircuts) },
  { key: 'collateral.warehouse-base', passed: close(collateral?.contributions[0]?.borrowingBaseContribution, 45), expected: '45', observed: String(collateral?.contributions[0]?.borrowingBaseContribution) },
  { key: 'collateral.unperfected-gate', passed: close(collateral?.contributions[1]?.borrowingBaseContribution, 0), expected: '0', observed: String(collateral?.contributions[1]?.borrowingBaseContribution) },
  { key: 'collateral.total-base', passed: close(collateral?.totalBorrowingBase, 45), expected: '45', observed: String(collateral?.totalBorrowingBase) },
  { key: 'collateral.signed-headroom', passed: close(collateral?.signedFacilityHeadroom, 10), expected: '10', observed: String(collateral?.signedFacilityHeadroom) },
  { key: 'collateral.no-double-subtraction', passed: close(collateral?.totalBorrowingBase, 0.75 * 80 - 10 - 5), expected: '0.75*80-10-5', observed: String(collateral?.totalBorrowingBase) },
  { key: 'collateral.excess-haircut-invalid', passed: pledgeableCollateralMetrics({ ...canonicalCollateralInput, assets: [{ ...canonicalCollateralInput.assets[0], valuationHaircutRatio: 0.8, liquidityHaircutRatio: 0.3 }] }) === null, expected: 'null', observed: String(pledgeableCollateralMetrics({ ...canonicalCollateralInput, assets: [{ ...canonicalCollateralInput.assets[0], valuationHaircutRatio: 0.8, liquidityHaircutRatio: 0.3 }] })) },
  { key: 'earnings.qualifying-cash-flow', passed: close(earnings?.qualifyingCashFlow, 20), expected: '20', observed: String(earnings?.qualifyingCashFlow) },
  { key: 'earnings.max-debt-service', passed: close(earnings?.maximumAnnualDebtService, 16), expected: '16', observed: String(earnings?.maximumAnnualDebtService) },
  { key: 'earnings.signed-service-headroom', passed: close(earnings?.signedAnnualDebtServiceHeadroom, 6), expected: '6', observed: String(earnings?.signedAnnualDebtServiceHeadroom) },
  { key: 'earnings.payment-factor-positive', passed: (earnings?.annualDebtServicePerPrincipal ?? 0) > 0, expected: '>0', observed: String(earnings?.annualDebtServicePerPrincipal) },
  { key: 'earnings.signed-principal-positive', passed: (earnings?.signedIncrementalEarningsBasedPrincipal ?? 0) > 0, expected: '>0', observed: String(earnings?.signedIncrementalEarningsBasedPrincipal) },
  { key: 'earnings.principal-positive', passed: (earnings?.maxIncrementalEarningsBasedPrincipal ?? 0) > 0, expected: '>0', observed: String(earnings?.maxIncrementalEarningsBasedPrincipal) },
  { key: 'earnings.zero-rate-factor', passed: close(debtServiceCapacityMetrics({ ...canonicalDebtServiceInput, marginalAnnualInterestRateRatio: 0, amortisationTermMonths: 24 })?.annualDebtServicePerPrincipal, 0.5), expected: '0.5', observed: String(debtServiceCapacityMetrics({ ...canonicalDebtServiceInput, marginalAnnualInterestRateRatio: 0, amortisationTermMonths: 24 })?.annualDebtServicePerPrincipal) },
  { key: 'earnings.negative-service-headroom-retained', passed: close(negativeDebtService?.signedAnnualDebtServiceHeadroom, -2), expected: '-2 SYN/year', observed: String(negativeDebtService?.signedAnnualDebtServiceHeadroom) },
  { key: 'earnings.negative-principal-headroom-retained', passed: (negativeDebtService?.signedIncrementalEarningsBasedPrincipal ?? 0) < 0, expected: '<0 SYN principal', observed: String(negativeDebtService?.signedIncrementalEarningsBasedPrincipal) },
  { key: 'earnings.negative-principal-lendable-zero', passed: close(negativeDebtService?.maxIncrementalEarningsBasedPrincipal, 0), expected: '0', observed: String(negativeDebtService?.maxIncrementalEarningsBasedPrincipal) },
  { key: 'earnings.negative-principal-binds-envelope', passed: close(negativeDebtServiceEnvelope?.signedBindingHeadroom, negativeDebtService?.signedIncrementalEarningsBasedPrincipal ?? Number.NaN), expected: String(negativeDebtService?.signedIncrementalEarningsBasedPrincipal), observed: String(negativeDebtServiceEnvelope?.signedBindingHeadroom) },
  { key: 'earnings.negative-principal-envelope-lendable-zero', passed: close(negativeDebtServiceEnvelope?.lendableIncrementalPrincipal, 0), expected: '0', observed: String(negativeDebtServiceEnvelope?.lendableIncrementalPrincipal) },
  { key: 'envelope.active-count', passed: envelope?.comparableConstraintCount === 4, expected: '4', observed: String(envelope?.comparableConstraintCount) },
  { key: 'envelope.asset-binding', passed: envelope?.bindingConstraintIds.join('|') === 'asset-based', expected: 'asset-based', observed: String(envelope?.bindingConstraintIds.join('|')) },
  { key: 'envelope.lendable-ten', passed: close(envelope?.lendableIncrementalPrincipal, 10), expected: '10', observed: String(envelope?.lendableIncrementalPrincipal) },
  { key: 'envelope.tie-preserved', passed: borrowingCapacityEnvelope([fixtureConstraint('asset-based', 5), fixtureConstraint('earnings-based', 5)])?.bindingConstraintIds.length === 2, expected: '2', observed: String(borrowingCapacityEnvelope([fixtureConstraint('asset-based', 5), fixtureConstraint('earnings-based', 5)])?.bindingConstraintIds.length) },
  { key: 'envelope.negative-retained', passed: borrowingCapacityEnvelope([fixtureConstraint('contractual', -3)])?.signedBindingHeadroom === -3, expected: '-3', observed: String(borrowingCapacityEnvelope([fixtureConstraint('contractual', -3)])?.signedBindingHeadroom) },
  { key: 'envelope.negative-clipped-only-at-lendable', passed: borrowingCapacityEnvelope([fixtureConstraint('contractual', -3)])?.lendableIncrementalPrincipal === 0, expected: '0', observed: String(borrowingCapacityEnvelope([fixtureConstraint('contractual', -3)])?.lendableIncrementalPrincipal) },
  { key: 'envelope.borrower-mismatch-stops', passed: borrowingCapacityEnvelope([comparableFixturePair[0]!, { ...comparableFixturePair[1]!, borrowerLegalEntityId: 'SYN_BORROWER_2' }]) === null, expected: 'null', observed: String(borrowingCapacityEnvelope([comparableFixturePair[0]!, { ...comparableFixturePair[1]!, borrowerLegalEntityId: 'SYN_BORROWER_2' }])) },
  { key: 'envelope.facility-mismatch-stops', passed: borrowingCapacityEnvelope([comparableFixturePair[0]!, { ...comparableFixturePair[1]!, facilityId: 'SYN_FACILITY_2' }]) === null, expected: 'null', observed: String(borrowingCapacityEnvelope([comparableFixturePair[0]!, { ...comparableFixturePair[1]!, facilityId: 'SYN_FACILITY_2' }])) },
  { key: 'envelope.horizon-mismatch-stops', passed: borrowingCapacityEnvelope([comparableFixturePair[0]!, { ...comparableFixturePair[1]!, horizon: '12m' }]) === null, expected: 'null', observed: String(borrowingCapacityEnvelope([comparableFixturePair[0]!, { ...comparableFixturePair[1]!, horizon: '12m' }])) },
  { key: 'premium.definition', passed: close(premium?.definitionalPremiumBp, 300), expected: '300bp', observed: String(premium?.definitionalPremiumBp) },
  { key: 'premium.observable-spread', passed: close(premium?.observableSpreadBp, 300), expected: '300bp', observed: String(premium?.observableSpreadBp) },
  { key: 'premium.known-internal-cost-label', passed: premium?.measurementStatus === 'efp-estimated', expected: 'efp-estimated', observed: String(premium?.measurementStatus) },
  { key: 'premium.missing-internal-cost-no-efp', passed: externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, opportunityCostInternalFundsPct: null })?.definitionalPremiumBp === null, expected: 'null', observed: String(externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, opportunityCostInternalFundsPct: null })?.definitionalPremiumBp) },
  { key: 'premium.missing-internal-cost-keeps-observable-spread', passed: close(externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, opportunityCostInternalFundsPct: null })?.observableSpreadBp, 300), expected: '300bp', observed: String(externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, opportunityCostInternalFundsPct: null })?.observableSpreadBp) },
  { key: 'premium.missing-internal-cost-spread-only', passed: externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, opportunityCostInternalFundsPct: null })?.measurementStatus === 'spread-only', expected: 'spread-only', observed: String(externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, opportunityCostInternalFundsPct: null })?.measurementStatus) },
  { key: 'premium.missing-both-not-comparable', passed: externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, matchedBenchmarkPct: null, opportunityCostInternalFundsPct: null })?.measurementStatus === 'not-comparable', expected: 'not-comparable', observed: String(externalFinancePremiumMetrics({ ...canonicalExternalFinancePremiumInput, matchedBenchmarkPct: null, opportunityCostInternalFundsPct: null })?.measurementStatus) },
  { key: 'premium.shortfall', passed: close(premium?.netWorthShortfallPercentagePoints, 10), expected: '10pp', observed: String(premium?.netWorthShortfallPercentagePoints) },
  { key: 'premium.illustrative-model', passed: close(premium?.illustrativeModelPremiumBp, 300), expected: '300bp', observed: String(premium?.illustrativeModelPremiumBp) },
  { key: 'overhang.total-npv', passed: close(overhang?.totalProjectNPV, 8), expected: '8', observed: String(overhang?.totalProjectNPV) },
  { key: 'overhang.legacy-capture', passed: close(overhang?.valueAccruingToLegacyCreditors, 11.2), expected: '11.2', observed: String(overhang?.valueAccruingToLegacyCreditors) },
  { key: 'overhang.equity-private-npv', passed: close(overhang?.equityPrivateNPV, -3.2), expected: '-3.2', observed: String(overhang?.equityPrivateNPV) },
  { key: 'overhang.blocks-positive-npv', passed: overhang?.debtOverhangBlocksPositiveNPVProject === true, expected: 'true', observed: String(overhang?.debtOverhangBlocksPositiveNPVProject) },
  { key: 'accelerator.round-count', passed: accelerator?.roundEffects.length === 4, expected: '4', observed: String(accelerator?.roundEffects.length) },
  { key: 'accelerator.round-effects', passed: accelerator?.roundEffects.every((value, index) => close(value, [-10, -5, -2.5, -1.25][index]!)) === true, expected: '-10,-5,-2.5,-1.25', observed: String(accelerator?.roundEffects.join(',')) },
  { key: 'accelerator.finite-sum', passed: close(accelerator?.finiteRoundCumulativeEffect, -18.75), expected: '-18.75', observed: String(accelerator?.finiteRoundCumulativeEffect) },
  { key: 'accelerator.stable-infinite-sum', passed: close(accelerator?.stableInfiniteCumulativeEffect, -20), expected: '-20', observed: String(accelerator?.stableInfiniteCumulativeEffect) },
  { key: 'accelerator.unit-gain-unstable', passed: financialAcceleratorMetrics({ ...canonicalAcceleratorInput, localFeedbackGain: 1 })?.stableInfiniteCumulativeEffect === null, expected: 'null', observed: String(financialAcceleratorMetrics({ ...canonicalAcceleratorInput, localFeedbackGain: 1 })?.stableInfiniteCumulativeEffect) },
  { key: 'identification.did', passed: close(identified?.descriptiveDifferenceInDifferences, -8), expected: '-8', observed: String(identified?.descriptiveDifferenceInDifferences) },
  { key: 'identification.all-gates-only-candidate', passed: identified?.identificationStatus === 'identified-candidate-under-declared-gates', expected: 'identified-candidate-under-declared-gates', observed: String(identified?.identificationStatus) },
  { key: 'identification.failed-gate-stays-descriptive', passed: descriptive?.identificationStatus === 'descriptive', expected: 'descriptive', observed: String(descriptive?.identificationStatus) },
  { key: 'identification.failed-gate-recorded', passed: descriptive?.failedGateIds.join('|') === 'localDemandOrProductivityConfoundingAddressed', expected: 'localDemandOrProductivityConfoundingAddressed', observed: String(descriptive?.failedGateIds.join('|')) },
];

export const balanceSheetCollateralFixtureAuditPassed = balanceSheetCollateralFixtureAudit.every(({ passed }) => passed);

if (!balanceSheetCollateralFixtureAuditPassed) {
  const failed = balanceSheetCollateralFixtureAudit.filter(({ passed }) => !passed).map(({ key, expected, observed }) => `${key}: expected ${expected}, observed ${observed}`);
  throw new Error(`3.11 balance-sheet/collateral fixture gate failed: ${failed.join('; ')}`);
}
