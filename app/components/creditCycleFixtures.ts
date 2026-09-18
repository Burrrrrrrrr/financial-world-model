export type SyntheticAmountUnit = 'SYN-currency';
export type DecimalRatioUnit = 'decimal-ratio';
export type PercentagePointUnit = 'percentage-points';

const finite = (...values: number[]) => values.every(Number.isFinite);
const nonNegative = (...values: number[]) => finite(...values) && values.every((value) => value >= 0);
const close = (left: number | null | undefined, right: number, tolerance = 1e-9) => typeof left === 'number' && Math.abs(left - right) <= tolerance;

export type StockFlowBridgeInput = {
  openingStock: number;
  grossOriginations: number;
  principalRepayments: number;
  chargeOffs: number;
  valuationChanges: number;
  fxChanges: number;
  reclassifications: number;
  declaredClosingStock: number;
  amountUnit: SyntheticAmountUnit;
  periodStart: string;
  periodEnd: string;
};

export type StockFlowBridgeResult = {
  netTransactionFlow: number;
  otherChanges: number;
  computedClosingStock: number;
  stockChange: number;
  reconciliationResidual: number;
  accepted: boolean;
};

export function stockFlowBridge(input: StockFlowBridgeInput): StockFlowBridgeResult | null {
  if (!nonNegative(input.openingStock, input.grossOriginations, input.principalRepayments, input.chargeOffs, input.declaredClosingStock)) return null;
  if (!finite(input.valuationChanges, input.fxChanges, input.reclassifications) || input.amountUnit !== 'SYN-currency' || !input.periodStart || !input.periodEnd || input.periodStart >= input.periodEnd) return null;
  const netTransactionFlow = input.grossOriginations - input.principalRepayments;
  const otherChanges = input.valuationChanges + input.fxChanges + input.reclassifications;
  const computedClosingStock = input.openingStock + netTransactionFlow - input.chargeOffs + otherChanges;
  const stockChange = input.declaredClosingStock - input.openingStock;
  const reconciliationResidual = input.declaredClosingStock - computedClosingStock;
  return { netTransactionFlow, otherChanges, computedClosingStock, stockChange, reconciliationResidual, accepted: close(reconciliationResidual, 0) };
}

export type PassiveLeverageInput = {
  debt: number;
  otherLiabilities: number;
  assets: number;
  income: number;
  assetPriceShockPct: number;
  amountUnit: SyntheticAmountUnit;
  snapshotTime: string;
};

export type LeverageSnapshot = {
  assets: number;
  debt: number;
  otherLiabilities: number;
  totalLiabilities: number;
  equity: number;
  debtToAssets: number;
  debtToEquity: number | null;
  debtToIncome: number;
};

export type PassiveLeverageResult = {
  before: LeverageSnapshot;
  after: LeverageSnapshot;
  nonPositiveEquity: boolean;
};

function leverageSnapshot(debt: number, otherLiabilities: number, assets: number, income: number): LeverageSnapshot {
  const totalLiabilities = debt + otherLiabilities;
  const equity = assets - totalLiabilities;
  return { assets, debt, otherLiabilities, totalLiabilities, equity, debtToAssets: debt / assets, debtToEquity: equity > 0 ? debt / equity : null, debtToIncome: debt / income };
}

export function passiveLeverageMetrics(input: PassiveLeverageInput): PassiveLeverageResult | null {
  if (!nonNegative(input.debt, input.otherLiabilities) || !finite(input.assets, input.income, input.assetPriceShockPct) || input.assets <= 0 || input.income <= 0 || input.assetPriceShockPct <= -100 || input.amountUnit !== 'SYN-currency' || !input.snapshotTime) return null;
  const afterAssets = input.assets * (1 + input.assetPriceShockPct / 100);
  if (afterAssets <= 0) return null;
  const before = leverageSnapshot(input.debt, input.otherLiabilities, input.assets, input.income);
  const after = leverageSnapshot(input.debt, input.otherLiabilities, afterAssets, input.income);
  return { before, after, nonPositiveEquity: after.equity <= 0 };
}

export type CollateralCapacityInput = {
  marketValue: number;
  eligibleShare: number;
  advanceRate: number;
  existingSecuredDrawn: number;
  requestedIncrement: number;
  marketValueShockPct: number;
  ownershipVerified: boolean;
  enforceabilityVerified: boolean;
  valuationTime: string;
  amountUnit: SyntheticAmountUnit;
};

export type CollateralCapacitySnapshot = {
  marketValue: number;
  borrowingBase: number;
  rawHeadroom: number;
  approvedIncrement: number;
  unmetRequest: number;
};

export type CollateralCapacityResult = {
  before: CollateralCapacitySnapshot;
  after: CollateralCapacitySnapshot;
  capacityChange: number;
};

function collateralSnapshot(marketValue: number, input: CollateralCapacityInput): CollateralCapacitySnapshot {
  const borrowingBase = marketValue * input.eligibleShare * input.advanceRate;
  const rawHeadroom = borrowingBase - input.existingSecuredDrawn;
  const approvedIncrement = Math.max(0, Math.min(input.requestedIncrement, rawHeadroom));
  return { marketValue, borrowingBase, rawHeadroom, approvedIncrement, unmetRequest: input.requestedIncrement - approvedIncrement };
}

export function collateralCapacityMetrics(input: CollateralCapacityInput): CollateralCapacityResult | null {
  if (!nonNegative(input.marketValue, input.existingSecuredDrawn, input.requestedIncrement) || !finite(input.eligibleShare, input.advanceRate, input.marketValueShockPct) || input.eligibleShare < 0 || input.eligibleShare > 1 || input.advanceRate < 0 || input.advanceRate > 1 || input.marketValueShockPct <= -100 || !input.ownershipVerified || !input.enforceabilityVerified || !input.valuationTime || input.amountUnit !== 'SYN-currency') return null;
  const before = collateralSnapshot(input.marketValue, input);
  const after = collateralSnapshot(input.marketValue * (1 + input.marketValueShockPct / 100), input);
  return { before, after, capacityChange: after.borrowingBase - before.borrowingBase };
}

export type DebtServiceRepricingInput = {
  debt: number;
  annualRatePct: number;
  scheduledAmortisationExcludingBalloon: number;
  balloonPrincipalDue: number;
  annualIncome: number;
  newAnnualRatePct: number;
  incomeShockPct: number;
  repricingShare: number;
  amountUnit: SyntheticAmountUnit;
  paymentWindow: 'twelve-month';
  paymentWindowStart: string;
  paymentWindowEnd: string;
  paymentWindowDirection: 'forward-contractual-cash-flows';
  interestAccrualAssumption: 'opening-debt-full-window-interest-principal-paid-at-window-end';
};

export type DebtServiceSnapshot = {
  interestPayment: number;
  scheduledAmortisationExcludingBalloon: number;
  balloonPrincipalDue: number;
  totalPrincipalDue: number;
  income: number;
  debtServicePayment: number;
  dsr: number;
};

export type DebtServiceRepricingResult = {
  before: DebtServiceSnapshot;
  after: DebtServiceSnapshot;
  dsrChangePercentagePoints: number;
};

export function debtServiceRepricingMetrics(input: DebtServiceRepricingInput): DebtServiceRepricingResult | null {
  const paymentWindowStart = Date.parse(input.paymentWindowStart);
  const paymentWindowEnd = Date.parse(input.paymentWindowEnd);
  const expectedWindowEnd = new Date(paymentWindowStart);
  expectedWindowEnd.setUTCFullYear(expectedWindowEnd.getUTCFullYear() + 1);
  if (!nonNegative(input.debt, input.annualRatePct, input.scheduledAmortisationExcludingBalloon, input.balloonPrincipalDue, input.annualIncome, input.newAnnualRatePct) || input.annualIncome <= 0 || !finite(input.incomeShockPct, input.repricingShare) || input.incomeShockPct <= -100 || input.repricingShare < 0 || input.repricingShare > 1 || input.scheduledAmortisationExcludingBalloon + input.balloonPrincipalDue > input.debt || input.amountUnit !== 'SYN-currency' || input.paymentWindow !== 'twelve-month' || input.paymentWindowDirection !== 'forward-contractual-cash-flows' || input.interestAccrualAssumption !== 'opening-debt-full-window-interest-principal-paid-at-window-end' || !Number.isFinite(paymentWindowStart) || !Number.isFinite(paymentWindowEnd) || paymentWindowEnd !== expectedWindowEnd.getTime()) return null;
  const beforeInterest = input.debt * input.annualRatePct / 100;
  const effectiveAfterRate = input.annualRatePct + input.repricingShare * (input.newAnnualRatePct - input.annualRatePct);
  const afterInterest = input.debt * effectiveAfterRate / 100;
  const afterIncome = input.annualIncome * (1 + input.incomeShockPct / 100);
  const totalPrincipalDue = input.scheduledAmortisationExcludingBalloon + input.balloonPrincipalDue;
  const principalState = { scheduledAmortisationExcludingBalloon: input.scheduledAmortisationExcludingBalloon, balloonPrincipalDue: input.balloonPrincipalDue, totalPrincipalDue };
  const before = { interestPayment: beforeInterest, ...principalState, income: input.annualIncome, debtServicePayment: beforeInterest + totalPrincipalDue, dsr: (beforeInterest + totalPrincipalDue) / input.annualIncome };
  const after = { interestPayment: afterInterest, ...principalState, income: afterIncome, debtServicePayment: afterInterest + totalPrincipalDue, dsr: (afterInterest + totalPrincipalDue) / afterIncome };
  return { before, after, dsrChangePercentagePoints: (after.dsr - before.dsr) * 100 };
}

export type CapitalLossFeedbackInput = {
  capital: number;
  minimumCapitalRatio: number;
  rwaDensity: number;
  currentLoans: number;
  currentLoansBasis: 'pre-assumed-loss-net-carrying-loans';
  defaultedEad: number;
  assumedNetEconomicLgd: number;
  defaultObservationTime: string;
  recoveryCutoff: string;
  discountingDate: string;
  lossEstimateStatus: 'synthetic-defaulted-ead-times-assumed-net-lgd';
  guaranteeTreatment: 'assumed-cash-recoveries-from-enforceable-guarantees-included-in-assumed-net-lgd-no-separate-deduction';
  workoutCostTreatment: 'included-in-assumed-net-lgd';
  separateRecoveryOrGuaranteeDeductionApplied: false;
  recognitionAssumption: 'same-synthetic-estimate-immediately-recognised-once-against-capital-and-net-carrying-loans';
  amountUnit: SyntheticAmountUnit;
  simplificationId: 'fixed-rwa-density-teaching-bridge';
};

export type CapitalLossFeedbackResult = {
  initialCapacity: number;
  initialHeadroom: number;
  syntheticLossEstimate: number;
  postAssumedLossCapital: number;
  postAssumedWriteDownLoans: number;
  postAssumedLossCapacity: number;
  requiredSimpleShrinkage: number;
};

export function capitalLossFeedbackMetrics(input: CapitalLossFeedbackInput): CapitalLossFeedbackResult | null {
  const defaultTime = Date.parse(input.defaultObservationTime);
  const recoveryCutoff = Date.parse(input.recoveryCutoff);
  if (!nonNegative(input.capital, input.currentLoans, input.defaultedEad) || !finite(input.minimumCapitalRatio, input.rwaDensity, input.assumedNetEconomicLgd) || input.minimumCapitalRatio <= 0 || input.minimumCapitalRatio > 1 || input.rwaDensity <= 0 || input.rwaDensity > 1 || input.assumedNetEconomicLgd < 0 || input.assumedNetEconomicLgd > 1 || input.defaultedEad > input.currentLoans || !Number.isFinite(defaultTime) || !Number.isFinite(recoveryCutoff) || recoveryCutoff <= defaultTime || input.discountingDate !== input.defaultObservationTime || input.currentLoansBasis !== 'pre-assumed-loss-net-carrying-loans' || input.lossEstimateStatus !== 'synthetic-defaulted-ead-times-assumed-net-lgd' || input.guaranteeTreatment !== 'assumed-cash-recoveries-from-enforceable-guarantees-included-in-assumed-net-lgd-no-separate-deduction' || input.workoutCostTreatment !== 'included-in-assumed-net-lgd' || input.separateRecoveryOrGuaranteeDeductionApplied !== false || input.recognitionAssumption !== 'same-synthetic-estimate-immediately-recognised-once-against-capital-and-net-carrying-loans' || input.amountUnit !== 'SYN-currency' || input.simplificationId !== 'fixed-rwa-density-teaching-bridge') return null;
  const syntheticLossEstimate = input.defaultedEad * input.assumedNetEconomicLgd;
  const postAssumedLossCapital = input.capital - syntheticLossEstimate;
  if (postAssumedLossCapital < 0) return null;
  const initialCapacity = input.capital / (input.minimumCapitalRatio * input.rwaDensity);
  const postAssumedWriteDownLoans = input.currentLoans - syntheticLossEstimate;
  const postAssumedLossCapacity = postAssumedLossCapital / (input.minimumCapitalRatio * input.rwaDensity);
  return { initialCapacity, initialHeadroom: initialCapacity - input.currentLoans, syntheticLossEstimate, postAssumedLossCapital, postAssumedWriteDownLoans, postAssumedLossCapacity, requiredSimpleShrinkage: Math.max(0, postAssumedWriteDownLoans - postAssumedLossCapacity) };
}

export type CompositionGroup = {
  id: string;
  stateBefore: number;
  stateAfter: number;
  weightBefore: number;
  weightAfter: number;
};

export type CompositionResult = {
  aggregateBefore: number;
  aggregateAfter: number;
  aggregateChange: number;
  withinEffect: number;
  compositionEffect: number;
  residual: number;
};

export function compositionDecomposition(groups: readonly CompositionGroup[]): CompositionResult | null {
  if (groups.length < 2 || new Set(groups.map(({ id }) => id)).size !== groups.length || groups.some(({ id, stateBefore, stateAfter, weightBefore, weightAfter }) => !id || !finite(stateBefore, stateAfter, weightBefore, weightAfter) || weightBefore < 0 || weightAfter < 0)) return null;
  if (!close(groups.reduce((sum, group) => sum + group.weightBefore, 0), 1) || !close(groups.reduce((sum, group) => sum + group.weightAfter, 0), 1)) return null;
  const aggregateBefore = groups.reduce((sum, group) => sum + group.weightBefore * group.stateBefore, 0);
  const aggregateAfter = groups.reduce((sum, group) => sum + group.weightAfter * group.stateAfter, 0);
  const withinEffect = groups.reduce((sum, group) => sum + group.weightBefore * (group.stateAfter - group.stateBefore), 0);
  const compositionEffect = groups.reduce((sum, group) => sum + (group.weightAfter - group.weightBefore) * group.stateAfter, 0);
  const aggregateChange = aggregateAfter - aggregateBefore;
  return { aggregateBefore, aggregateAfter, aggregateChange, withinEffect, compositionEffect, residual: aggregateChange - withinEffect - compositionEffect };
}

export type WarningCausalInput = {
  creditGrowthZ: number;
  assetPriceGrowthZ: number;
  spreadZ: number;
  warningThreshold: number;
  labelDefinition: string;
  predictionHorizon: string;
  thresholdVersion: string;
  exogeneityGate: boolean;
  predeterminedExposureGate: boolean;
  demandCounterfactualGate: boolean;
};

export type WarningCausalResult = {
  vulnerabilityScore: number;
  warningStatus: 'elevated-under-synthetic-rule' | 'below-synthetic-threshold';
  predictionStatus: 'not-estimated';
  causalStatus: 'not-identified' | 'identified-candidate';
  failedCausalGates: string[];
};

export function warningCausalGate(input: WarningCausalInput): WarningCausalResult | null {
  if (!finite(input.creditGrowthZ, input.assetPriceGrowthZ, input.spreadZ, input.warningThreshold) || !input.labelDefinition || !input.predictionHorizon || !input.thresholdVersion) return null;
  const vulnerabilityScore = (input.creditGrowthZ + input.assetPriceGrowthZ - input.spreadZ) / 3;
  const failedCausalGates = [
    ['exogeneity', input.exogeneityGate],
    ['predetermined-exposure', input.predeterminedExposureGate],
    ['demand-counterfactual', input.demandCounterfactualGate],
  ].filter(([, passed]) => !passed).map(([gate]) => String(gate));
  return {
    vulnerabilityScore,
    warningStatus: vulnerabilityScore >= input.warningThreshold ? 'elevated-under-synthetic-rule' : 'below-synthetic-threshold',
    predictionStatus: 'not-estimated',
    causalStatus: failedCausalGates.length ? 'not-identified' : 'identified-candidate',
    failedCausalGates,
  };
}

export const canonicalStockFlowInput: StockFlowBridgeInput = {
  openingStock: 100, grossOriginations: 20, principalRepayments: 8, chargeOffs: 3,
  valuationChanges: 1, fxChanges: 0, reclassifications: 0, declaredClosingStock: 110,
  amountUnit: 'SYN-currency', periodStart: '2026-01-01', periodEnd: '2026-09-11',
};

export const canonicalPassiveLeverageInput: PassiveLeverageInput = {
  debt: 80, otherLiabilities: 0, assets: 120, income: 20, assetPriceShockPct: -15, amountUnit: 'SYN-currency', snapshotTime: '2026-09-11T00:00:00+08:00',
};

export const canonicalCollateralCapacityInput: CollateralCapacityInput = {
  marketValue: 120, eligibleShare: 0.8, advanceRate: 0.7, existingSecuredDrawn: 50, requestedIncrement: 20,
  marketValueShockPct: -20, ownershipVerified: true, enforceabilityVerified: true,
  valuationTime: '2026-09-11T00:00:00+08:00', amountUnit: 'SYN-currency',
};

export const canonicalDebtServiceInput: DebtServiceRepricingInput = {
  debt: 100, annualRatePct: 4, scheduledAmortisationExcludingBalloon: 6, balloonPrincipalDue: 0, annualIncome: 25, newAnnualRatePct: 7,
  incomeShockPct: -10, repricingShare: 1, amountUnit: 'SYN-currency', paymentWindow: 'twelve-month',
  paymentWindowStart: '2026-09-11T00:00:00+08:00', paymentWindowEnd: '2027-09-11T00:00:00+08:00', paymentWindowDirection: 'forward-contractual-cash-flows',
  interestAccrualAssumption: 'opening-debt-full-window-interest-principal-paid-at-window-end',
};

export const canonicalCapitalLossInput: CapitalLossFeedbackInput = {
  capital: 10, minimumCapitalRatio: 0.1, rwaDensity: 0.8, currentLoans: 100, currentLoansBasis: 'pre-assumed-loss-net-carrying-loans', defaultedEad: 10,
  assumedNetEconomicLgd: 0.4, defaultObservationTime: '2026-09-11T00:00:00+08:00', recoveryCutoff: '2031-09-11T00:00:00+08:00', discountingDate: '2026-09-11T00:00:00+08:00',
  lossEstimateStatus: 'synthetic-defaulted-ead-times-assumed-net-lgd', guaranteeTreatment: 'assumed-cash-recoveries-from-enforceable-guarantees-included-in-assumed-net-lgd-no-separate-deduction', workoutCostTreatment: 'included-in-assumed-net-lgd',
  separateRecoveryOrGuaranteeDeductionApplied: false, recognitionAssumption: 'same-synthetic-estimate-immediately-recognised-once-against-capital-and-net-carrying-loans',
  amountUnit: 'SYN-currency', simplificationId: 'fixed-rwa-density-teaching-bridge',
};

export const canonicalCompositionGroups: readonly CompositionGroup[] = [
  { id: 'SME_BANK_BORROWERS', stateBefore: 1, stateAfter: 1, weightBefore: 0.6, weightAfter: 0.3 },
  { id: 'PUBLIC_BOND_ISSUERS', stateBefore: -0.5, stateAfter: -0.5, weightBefore: 0.4, weightAfter: 0.7 },
];

export const canonicalWarningInput: WarningCausalInput = {
  creditGrowthZ: 1.5, assetPriceGrowthZ: 1, spreadZ: -1.2, warningThreshold: 1,
  labelDefinition: 'systemic-banking-crisis-start within declared horizon', predictionHorizon: '12-to-36-months',
  thresholdVersion: 'synthetic-rule-v1', exogeneityGate: false, predeterminedExposureGate: false, demandCounterfactualGate: false,
};

export const canonicalStockFlowResult = stockFlowBridge(canonicalStockFlowInput);
export const canonicalPassiveLeverageResult = passiveLeverageMetrics(canonicalPassiveLeverageInput);
export const canonicalCollateralCapacityResult = collateralCapacityMetrics(canonicalCollateralCapacityInput);
export const canonicalDebtServiceResult = debtServiceRepricingMetrics(canonicalDebtServiceInput);
export const canonicalCapitalLossResult = capitalLossFeedbackMetrics(canonicalCapitalLossInput);
export const canonicalCompositionResult = compositionDecomposition(canonicalCompositionGroups);
export const canonicalWarningResult = warningCausalGate(canonicalWarningInput);

export type BisCreditCycleObservation = {
  period: string;
  totalCreditToGdp: number;
  creditGap: number;
  debtServiceRatio: number;
};

export const creditCycleTransmissionSourceIds = [1, 2, 11, 12] as const;

export const creditCycleMechanismLabSources = {
  c1: [1, 14],
  c2: [15, 16, 17, 18],
  c3: [16, 17, 18, 26],
  c4: [11, 12, 13],
  c5: [19, 20, 22, 25, 49],
  c6: [26, 30, 31],
  c7: [9, 29, 30, 37, 42, 44],
} as const;

export const creditCycleMechanismLabSourceIds = Object.values(creditCycleMechanismLabSources).flat();

const sha256Initial = [
  0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
  0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19,
] as const;

const sha256RoundConstants = [
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
  0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
  0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
  0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
  0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
  0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
] as const;

const rotateRight = (value: number, bits: number) => (value >>> bits) | (value << (32 - bits));

/** Synchronous, dependency-free SHA-256 so browser, SSR and build gates hash the same frozen JSON bytes. */
function sha256Hex(value: string) {
  const bytes = new TextEncoder().encode(value);
  const bitLength = bytes.length * 8;
  const paddedLength = Math.ceil((bytes.length + 9) / 64) * 64;
  const message = new Uint8Array(paddedLength);
  message.set(bytes);
  message[bytes.length] = 0x80;
  const view = new DataView(message.buffer);
  view.setUint32(paddedLength - 8, Math.floor(bitLength / 0x100000000), false);
  view.setUint32(paddedLength - 4, bitLength >>> 0, false);
  const hash: number[] = [...sha256Initial];
  const words = new Uint32Array(64);

  for (let offset = 0; offset < paddedLength; offset += 64) {
    for (let index = 0; index < 16; index += 1) words[index] = view.getUint32(offset + index * 4, false);
    for (let index = 16; index < 64; index += 1) {
      const prior15 = words[index - 15];
      const prior2 = words[index - 2];
      const sigma0 = rotateRight(prior15, 7) ^ rotateRight(prior15, 18) ^ (prior15 >>> 3);
      const sigma1 = rotateRight(prior2, 17) ^ rotateRight(prior2, 19) ^ (prior2 >>> 10);
      words[index] = (words[index - 16] + sigma0 + words[index - 7] + sigma1) >>> 0;
    }

    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const sum1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const choose = (e & f) ^ (~e & g);
      const temp1 = (h + sum1 + choose + sha256RoundConstants[index] + words[index]) >>> 0;
      const sum0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const majority = (a & b) ^ (a & c) ^ (b & c);
      const temp2 = (sum0 + majority) >>> 0;
      h = g;
      g = f;
      f = e;
      e = (d + temp1) >>> 0;
      d = c;
      c = b;
      b = a;
      a = (temp1 + temp2) >>> 0;
    }
    hash[0] = (hash[0] + a) >>> 0;
    hash[1] = (hash[1] + b) >>> 0;
    hash[2] = (hash[2] + c) >>> 0;
    hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0;
    hash[5] = (hash[5] + f) >>> 0;
    hash[6] = (hash[6] + g) >>> 0;
    hash[7] = (hash[7] + h) >>> 0;
  }

  return hash.map((word) => word.toString(16).padStart(8, '0')).join('');
}

export const bisCreditCycleSelectedObservations: readonly BisCreditCycleObservation[] = [
  { period: '1999-Q4', totalCreditToGdp: 133.9, creditGap: 4.2452, debtServiceRatio: 17 },
  { period: '2000-Q4', totalCreditToGdp: 136.7, creditGap: 4.6518, debtServiceRatio: 17.6 },
  { period: '2001-Q4', totalCreditToGdp: 141.4, creditGap: 6.6739, debtServiceRatio: 17 },
  { period: '2002-Q4', totalCreditToGdp: 145.6, creditGap: 7.6891, debtServiceRatio: 16.3 },
  { period: '2003-Q4', totalCreditToGdp: 149.3, creditGap: 7.7547, debtServiceRatio: 15.9 },
  { period: '2004-Q4', totalCreditToGdp: 153.2, creditGap: 8.0135, debtServiceRatio: 16.1 },
  { period: '2005-Q4', totalCreditToGdp: 157.3, creditGap: 8.1691, debtServiceRatio: 17.1 },
  { period: '2006-Q4', totalCreditToGdp: 163.9, creditGap: 10.1073, debtServiceRatio: 17.9 },
  { period: '2007-Q4', totalCreditToGdp: 170.6, creditGap: 11.6298, debtServiceRatio: 18.5 },
  { period: '2008-Q4', totalCreditToGdp: 170.7, creditGap: 6.6777, debtServiceRatio: 17.5 },
  { period: '2009-Q4', totalCreditToGdp: 169.2, creditGap: 1.238, debtServiceRatio: 16.7 },
  { period: '2010-Q4', totalCreditToGdp: 160.4, creditGap: -9.4305, debtServiceRatio: 15.6 },
  { period: '2011-Q4', totalCreditToGdp: 155.8, creditGap: -13.9783, debtServiceRatio: 14.9 },
  { period: '2012-Q4', totalCreditToGdp: 152.4, creditGap: -16.1636, debtServiceRatio: 14.4 },
  { period: '2013-Q4', totalCreditToGdp: 151.3, creditGap: -15.5667, debtServiceRatio: 14.5 },
  { period: '2014-Q4', totalCreditToGdp: 150.4, creditGap: -14.7433, debtServiceRatio: 14.4 },
  { period: '2015-Q4', totalCreditToGdp: 150.5, creditGap: -12.7333, debtServiceRatio: 14.5 },
  { period: '2016-Q4', totalCreditToGdp: 152.2, creditGap: -9.6245, debtServiceRatio: 14.8 },
  { period: '2017-Q4', totalCreditToGdp: 153.9, creditGap: -6.8423, debtServiceRatio: 14.9 },
  { period: '2018-Q4', totalCreditToGdp: 153.2, creditGap: -6.5036, debtServiceRatio: 14.7 },
  { period: '2019-Q4', totalCreditToGdp: 152.9, creditGap: -5.8043, debtServiceRatio: 14.7 },
  { period: '2020-Q2', totalCreditToGdp: 161.8, creditGap: 2.8827, debtServiceRatio: 14.6 },
  { period: '2020-Q4', totalCreditToGdp: 164.1, creditGap: 4.5786, debtServiceRatio: 14.1 },
  { period: '2021-Q4', totalCreditToGdp: 159.3, creditGap: -0.9847, debtServiceRatio: 13.9 },
  { period: '2022-Q4', totalCreditToGdp: 153.4, creditGap: -6.2089, debtServiceRatio: 14.8 },
  { period: '2023-Q4', totalCreditToGdp: 147.1, creditGap: -10.6438, debtServiceRatio: 14.5 },
  { period: '2024-Q4', totalCreditToGdp: 142.5, creditGap: -12.4608, debtServiceRatio: 14.4 },
  { period: '2025-Q4', totalCreditToGdp: 140.3, creditGap: -11.5378, debtServiceRatio: 14.1 },
] as const;

export const bisCreditCycleDataPassports = [
  {
    sourceId: 'BIS_US_TOTAL_CREDIT_TO_GDP', provider: 'Bank for International Settlements', product: 'Long series on total credit to the private non-financial sector',
    dataflowVersion: 'BIS,WS_TC,2.0', seriesKey: 'Q.US.P.A.M.770.A', frequency: 'quarterly', nativeUnit: 'percent-of-GDP',
    observationStart: '1947-Q4', observationEnd: '2025-Q4', observationCount: 313, selectedObservationCount: 28,
    retrievedAt: '2026-09-11', portalDeclaredLastRelease: '2026-06-15', portalDeclaredNextScheduledRelease: '2026-09-14', latestVintageOnly: true,
    sourceUrl: 'https://stats.bis.org/api/v2/data/dataflow/BIS/WS_TC/2.0/Q.US.P.A.M.770.A?format=csv',
    rawSha256: '614f84c718fc866ba8e902833485bc1e92dd53b251f18c4d330b294f283a4a86', normalizedSha256: 'd81b441dc04165c413888bf93e343a0091ca5d34bfdfac140f729d554e485e59',
    revisionWarning: 'latest-vintage history; source series, GDP denominator, break adjustments and historical observations may revise', sourceReferenceIds: [1],
  },
  {
    sourceId: 'BIS_US_CREDIT_TO_GDP_GAP', provider: 'Bank for International Settlements', product: 'Credit-to-GDP gaps',
    dataflowVersion: 'BIS,WS_CREDIT_GAP,1.0', seriesKey: 'Q.US.P.A.C', frequency: 'quarterly', nativeUnit: 'percentage-points-of-credit-to-GDP-ratio',
    observationStart: '1957-Q4', observationEnd: '2025-Q4', observationCount: 273, selectedObservationCount: 28,
    retrievedAt: '2026-09-11', portalDeclaredLastRelease: '2026-06-15', portalDeclaredNextScheduledRelease: '2026-09-14', latestVintageOnly: true,
    sourceUrl: 'https://stats.bis.org/api/v2/data/dataflow/BIS/WS_CREDIT_GAP/1.0/Q.US.P.A.C?format=csv',
    rawSha256: '5bf1a8b05de63e78b331a830b02cabe9047366f2b2f4e2dffb77d0ca830d09d5', normalizedSha256: 'fecb61d7a771ff7629f9b2a57febc398c909b746357df0bc83d50b6e401f8a48',
    revisionWarning: 'latest-vintage history; credit, GDP, break adjustments and one-sided trend endpoints may revise', sourceReferenceIds: [2, 8, 9, 10],
  },
  {
    sourceId: 'BIS_US_PRIVATE_NFS_DSR', provider: 'Bank for International Settlements', product: 'Debt service ratios for the private non-financial sector',
    dataflowVersion: 'BIS,WS_DSR,1.0', seriesKey: 'Q.US.P', frequency: 'quarterly', nativeUnit: 'percent-of-income',
    observationStart: '1999-Q1', observationEnd: '2025-Q4', observationCount: 108, selectedObservationCount: 28,
    retrievedAt: '2026-09-11', portalDeclaredLastRelease: '2026-06-15', portalDeclaredNextScheduledRelease: '2026-09-14', latestVintageOnly: true,
    sourceUrl: 'https://stats.bis.org/api/v2/data/dataflow/BIS/WS_DSR/1.0/Q.US.P?format=csv',
    rawSha256: 'e6c8e89c16d7de0d9be13894e3db251cb9389c4c2d5378866d67d63e4624d0c6', normalizedSha256: 'd53afeed11063b7b3c696db323cf1562f318cc3e39e14586c2e42b1f77d263e0',
    revisionWarning: 'latest-vintage model-based aggregate estimate; debt, income, rate and remaining-maturity inputs may revise', sourceReferenceIds: [11, 12, 13],
  },
] as const;

export const bisCreditCycleDynamicDataPassports = bisCreditCycleDataPassports.map((passport) => ({
  ...passport,
  mayEnterCanonicalCalculation: false as const,
}));

export const bisCreditCycleCombinedNormalizedSha256 = '4ab2fd4a4171a37a2a5e5bccd97d072160f8fcd22f5ef9625b8e7a18c4e475d6';

export const bisCreditCycleRecomputedNormalizedSha256 = {
  totalCreditToGdp: sha256Hex(JSON.stringify(bisCreditCycleSelectedObservations.map(({ period, totalCreditToGdp }) => ({ period, value: totalCreditToGdp })))),
  creditGap: sha256Hex(JSON.stringify(bisCreditCycleSelectedObservations.map(({ period, creditGap }) => ({ period, value: creditGap })))),
  debtServiceRatio: sha256Hex(JSON.stringify(bisCreditCycleSelectedObservations.map(({ period, debtServiceRatio }) => ({ period, value: debtServiceRatio })))),
} as const;

export const bisCreditCycleRecomputedCombinedNormalizedSha256 = sha256Hex(JSON.stringify(bisCreditCycleSelectedObservations));

const bisCreditCycleInjectedDriftSha256 = sha256Hex(JSON.stringify(bisCreditCycleSelectedObservations.map((row, index) => index === 5 ? { ...row, creditGap: row.creditGap + 0.1 } : row)));

const dates = bisCreditCycleSelectedObservations.map(({ period }) => period);
const latest = bisCreditCycleSelectedObservations.at(-1);
const q2_2020 = bisCreditCycleSelectedObservations.find(({ period }) => period === '2020-Q2');

export const creditCycleFixtureAudit = [
  { key: 'C1 canonical stock-flow bridge exists and closes', passed: canonicalStockFlowResult?.accepted === true && close(canonicalStockFlowResult.computedClosingStock, 110) && close(canonicalStockFlowResult.netTransactionFlow, 12) && close(canonicalStockFlowResult.stockChange, 10) },
  { key: 'C1 keeps gross origination, net flow and stock change distinct', passed: canonicalStockFlowInput.grossOriginations === 20 && canonicalStockFlowResult?.netTransactionFlow === 12 && canonicalStockFlowResult?.stockChange === 10 },
  { key: 'C1 rejects a missing or reversed clock', passed: stockFlowBridge({ ...canonicalStockFlowInput, periodEnd: canonicalStockFlowInput.periodStart }) === null },
  { key: 'C2 passive leverage reproduces before and after denominators under an explicit zero-other-liabilities fixture', passed: canonicalPassiveLeverageInput.otherLiabilities === 0 && close(canonicalPassiveLeverageResult?.before.debtToAssets, 2 / 3) && close(canonicalPassiveLeverageResult?.before.debtToEquity, 2) && close(canonicalPassiveLeverageResult?.after.debtToAssets, 80 / 102) && close(canonicalPassiveLeverageResult?.after.debtToEquity, 80 / 22) && close(canonicalPassiveLeverageResult?.after.debtToIncome, 4) },
  { key: 'C2 subtracts registered other liabilities rather than assuming debt is total liabilities', passed: close(passiveLeverageMetrics({ ...canonicalPassiveLeverageInput, otherLiabilities: 10, assetPriceShockPct: 0 })?.before.debtToEquity, 80 / 30) },
  { key: 'C2 rejects a non-positive income denominator', passed: passiveLeverageMetrics({ ...canonicalPassiveLeverageInput, income: 0 }) === null },
  { key: 'C3 borrowing base and headroom close before and after shock', passed: close(canonicalCollateralCapacityResult?.before.borrowingBase, 67.2) && close(canonicalCollateralCapacityResult?.before.rawHeadroom, 17.2) && close(canonicalCollateralCapacityResult?.after.borrowingBase, 53.76) && close(canonicalCollateralCapacityResult?.after.rawHeadroom, 3.76) && close(canonicalCollateralCapacityResult?.capacityChange, -13.44) },
  { key: 'C3 rejects unverified enforceability', passed: collateralCapacityMetrics({ ...canonicalCollateralCapacityInput, enforceabilityVerified: false }) === null },
  { key: 'C4 debt-service repricing preserves one explicit forward window and counts each principal cash flow once', passed: canonicalDebtServiceInput.paymentWindowStart === '2026-09-11T00:00:00+08:00' && canonicalDebtServiceInput.paymentWindowEnd === '2027-09-11T00:00:00+08:00' && canonicalDebtServiceInput.interestAccrualAssumption === 'opening-debt-full-window-interest-principal-paid-at-window-end' && canonicalDebtServiceResult?.before.totalPrincipalDue === 6 && canonicalDebtServiceResult.before.scheduledAmortisationExcludingBalloon === 6 && canonicalDebtServiceResult.before.balloonPrincipalDue === 0 && close(canonicalDebtServiceResult.before.dsr, 0.4) && close(canonicalDebtServiceResult.after.dsr, 13 / 22.5) && close(canonicalDebtServiceResult.dsrChangePercentagePoints, 160 / 9) },
  { key: 'C4 rejects a missing or reversed forward payment clock', passed: debtServiceRepricingMetrics({ ...canonicalDebtServiceInput, paymentWindowEnd: canonicalDebtServiceInput.paymentWindowStart }) === null },
  { key: 'C4 rejects ratio shares outside zero to one', passed: debtServiceRepricingMetrics({ ...canonicalDebtServiceInput, repricingShare: 1.1 }) === null },
  { key: 'C5 capital-loss bridge closes once across capital and pre-loss net carrying loans', passed: close(canonicalCapitalLossResult?.initialCapacity, 125) && close(canonicalCapitalLossResult?.initialHeadroom, 25) && close(canonicalCapitalLossResult?.syntheticLossEstimate, 4) && close(canonicalCapitalLossResult?.postAssumedLossCapital, 6) && close(canonicalCapitalLossResult?.postAssumedWriteDownLoans, 96) && close(canonicalCapitalLossResult?.postAssumedLossCapacity, 75) && close(canonicalCapitalLossResult?.requiredSimpleShrinkage, 21) && canonicalCapitalLossInput.currentLoansBasis === 'pre-assumed-loss-net-carrying-loans' && canonicalCapitalLossInput.recognitionAssumption.includes('recognised-once') && canonicalCapitalLossInput.discountingDate === canonicalCapitalLossInput.defaultObservationTime && canonicalCapitalLossInput.guaranteeTreatment.includes('no-separate-deduction') },
  { key: 'C5 rejects an impossible assumed net LGD', passed: capitalLossFeedbackMetrics({ ...canonicalCapitalLossInput, assumedNetEconomicLgd: 1.2 }) === null },
  { key: 'C5 rejects a recovery cutoff that does not follow default', passed: capitalLossFeedbackMetrics({ ...canonicalCapitalLossInput, recoveryCutoff: canonicalCapitalLossInput.defaultObservationTime }) === null },
  { key: 'C6 aggregate change decomposes into within and composition', passed: close(canonicalCompositionResult?.aggregateBefore, 0.4) && close(canonicalCompositionResult?.aggregateAfter, -0.05) && close(canonicalCompositionResult?.withinEffect, 0) && close(canonicalCompositionResult?.compositionEffect, -0.45) && close(canonicalCompositionResult?.residual, 0) },
  { key: 'C6 rejects weights that do not sum to one', passed: compositionDecomposition(canonicalCompositionGroups.map((group, index) => ({ ...group, weightAfter: index ? 0.6 : 0.3 }))) === null },
  { key: 'C7 warning arithmetic can pass while every causal gate fails', passed: close(canonicalWarningResult?.vulnerabilityScore, 3.7 / 3) && canonicalWarningResult?.warningStatus === 'elevated-under-synthetic-rule' && canonicalWarningResult?.predictionStatus === 'not-estimated' && canonicalWarningResult?.causalStatus === 'not-identified' && canonicalWarningResult.failedCausalGates.length === 3 },
  { key: 'BIS selected rows contain 27 Q4 observations plus 2020-Q2', passed: bisCreditCycleSelectedObservations.length === 28 && dates.filter((date) => date.endsWith('-Q4')).length === 27 && dates.filter((date) => date === '2020-Q2').length === 1 },
  { key: 'BIS selected periods are unique and ordered', passed: new Set(dates).size === dates.length && dates.every((date, index) => !index || date > dates[index - 1]) },
  { key: 'BIS 2020-Q2 checkpoint closes across all three native series', passed: close(q2_2020?.totalCreditToGdp, 161.8) && close(q2_2020?.creditGap, 2.8827) && close(q2_2020?.debtServiceRatio, 14.6) },
  { key: 'BIS latest common observation closes across all three native series', passed: latest?.period === '2025-Q4' && close(latest.totalCreditToGdp, 140.3) && close(latest.creditGap, -11.5378) && close(latest.debtServiceRatio, 14.1) },
  { key: 'BIS passports preserve three unique dataflows keys, observation counts, source URLs and release clocks', passed: bisCreditCycleDataPassports.length === 3 && new Set(bisCreditCycleDataPassports.map(({ dataflowVersion, seriesKey }) => `${dataflowVersion}:${seriesKey}`)).size === 3 && bisCreditCycleDataPassports.every(({ observationCount, selectedObservationCount, sourceUrl, portalDeclaredLastRelease, portalDeclaredNextScheduledRelease, rawSha256, normalizedSha256 }) => observationCount >= selectedObservationCount && selectedObservationCount === bisCreditCycleSelectedObservations.length && sourceUrl.startsWith('https://') && portalDeclaredLastRelease === '2026-06-15' && portalDeclaredNextScheduledRelease === '2026-09-14' && /^[0-9a-f]{64}$/.test(rawSha256) && /^[0-9a-f]{64}$/.test(normalizedSha256)) },
  { key: 'portable SHA-256 implementation passes the standard abc test vector', passed: sha256Hex('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' },
  { key: 'BIS every selected series cell recomputes to its frozen normalized SHA-256', passed: bisCreditCycleRecomputedNormalizedSha256.totalCreditToGdp === bisCreditCycleDataPassports[0].normalizedSha256 && bisCreditCycleRecomputedNormalizedSha256.creditGap === bisCreditCycleDataPassports[1].normalizedSha256 && bisCreditCycleRecomputedNormalizedSha256.debtServiceRatio === bisCreditCycleDataPassports[2].normalizedSha256 },
  { key: 'BIS every selected row recomputes to the frozen combined SHA-256', passed: bisCreditCycleRecomputedCombinedNormalizedSha256 === bisCreditCycleCombinedNormalizedSha256 },
  { key: 'BIS injected non-checkpoint row drift changes the combined SHA-256', passed: bisCreditCycleInjectedDriftSha256 !== bisCreditCycleCombinedNormalizedSha256 },
  { key: 'BIS dynamic passports preserve the full frozen passport and quarantine flag', passed: bisCreditCycleDynamicDataPassports.length === bisCreditCycleDataPassports.length && bisCreditCycleDynamicDataPassports.every((passport, index) => passport.sourceId === bisCreditCycleDataPassports[index].sourceId && passport.sourceUrl === bisCreditCycleDataPassports[index].sourceUrl && passport.observationCount === bisCreditCycleDataPassports[index].observationCount && passport.portalDeclaredNextScheduledRelease === bisCreditCycleDataPassports[index].portalDeclaredNextScheduledRelease && passport.mayEnterCanonicalCalculation === false) },
  { key: 'BIS official rows remain latest-vintage evidence outside synthetic arithmetic', passed: bisCreditCycleDataPassports.every(({ latestVintageOnly, revisionWarning }) => latestVintageOnly && revisionWarning.includes('latest-vintage')) },
] as const;

export const creditCycleFixtureAuditPassed = creditCycleFixtureAudit.every(({ passed }) => passed);

if (!creditCycleFixtureAuditPassed) {
  throw new Error(`3.14 credit-cycle fixture gate failed: ${creditCycleFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}
