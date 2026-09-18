export type SyntheticAmountUnit = 'SYN-currency';

const finite = (...values: number[]) => values.every(Number.isFinite);
const nonNegative = (...values: number[]) => finite(...values) && values.every((value) => value >= 0);
const close = (left: number | null | undefined, right: number, tolerance = 1e-9) => typeof left === 'number' && Math.abs(left - right) <= tolerance;

export type LeverageRegistryInput = {
  assets: number;
  debt: number;
  otherLiabilities: number;
  annualIncome: number;
  ebitda: number;
  eligibleCash: number;
  eligibleCashPolicy: 'course-target-date-eligible-cash-v1';
  eligibleCashTargetDate: string;
  grossExposure: number;
  nav: number;
  amountUnit: SyntheticAmountUnit;
  snapshotTime: string;
  incomeWindow: 'trailing-twelve-months';
};

export type LeverageRegistryResult = {
  equity: number;
  totalLiabilities: number;
  debtToAssets: number;
  debtToEquity: number;
  assetsToEquity: number;
  debtToIncome: number;
  netDebtToEbitda: number;
  grossExposureToNav: number;
};

export function leverageRegistryMetrics(input: LeverageRegistryInput): LeverageRegistryResult | null {
  if (!nonNegative(input.assets, input.debt, input.otherLiabilities, input.annualIncome, input.ebitda, input.eligibleCash, input.grossExposure, input.nav)
    || input.assets <= 0 || input.annualIncome <= 0 || input.ebitda <= 0 || input.nav <= 0
    || input.debt < input.eligibleCash || input.eligibleCashPolicy !== 'course-target-date-eligible-cash-v1'
    || !Number.isFinite(Date.parse(input.eligibleCashTargetDate)) || input.amountUnit !== 'SYN-currency' || !input.snapshotTime
    || input.incomeWindow !== 'trailing-twelve-months') return null;
  const totalLiabilities = input.debt + input.otherLiabilities;
  const equity = input.assets - totalLiabilities;
  if (equity <= 0) return null;
  return {
    equity,
    totalLiabilities,
    debtToAssets: input.debt / input.assets,
    debtToEquity: input.debt / equity,
    assetsToEquity: input.assets / equity,
    debtToIncome: input.debt / input.annualIncome,
    netDebtToEbitda: (input.debt - input.eligibleCash) / input.ebitda,
    grossExposureToNav: input.grossExposure / input.nav,
  };
}

export type PassiveLeverageInput = {
  assets: number;
  debt: number;
  otherLiabilities: number;
  assetPriceShockPct: number;
  amountUnit: SyntheticAmountUnit;
  snapshotTime: string;
};

export type BalanceSheetSnapshot = {
  assets: number;
  debt: number;
  otherLiabilities: number;
  equity: number;
  assetsToEquity: number | null;
  debtToAssets: number;
};

const balanceSheetSnapshot = (assets: number, debt: number, otherLiabilities: number): BalanceSheetSnapshot => {
  const equity = assets - debt - otherLiabilities;
  return { assets, debt, otherLiabilities, equity, assetsToEquity: equity > 0 ? assets / equity : null, debtToAssets: debt / assets };
};

export function passiveLeverageShock(input: PassiveLeverageInput) {
  if (!nonNegative(input.assets, input.debt, input.otherLiabilities) || input.assets <= 0 || !finite(input.assetPriceShockPct)
    || input.assetPriceShockPct <= -100 || input.amountUnit !== 'SYN-currency' || !input.snapshotTime) return null;
  const before = balanceSheetSnapshot(input.assets, input.debt, input.otherLiabilities);
  if (before.equity <= 0) return null;
  const afterAssets = input.assets * (1 + input.assetPriceShockPct / 100);
  if (afterAssets <= 0) return null;
  const after = balanceSheetSnapshot(afterAssets, input.debt, input.otherLiabilities);
  return {
    before,
    after,
    debtChanged: false as const,
    equityLossPct: after.equity > 0 ? (after.equity / before.equity - 1) * 100 : null,
    equityExhausted: after.equity <= 0,
  };
}

export type TargetLeverageInput = PassiveLeverageInput & {
  targetAssetsToEquity: number;
  targetRuleStatus: 'synthetic-rule-not-observed-target';
};

export function targetLeverageProposal(input: TargetLeverageInput) {
  const shock = passiveLeverageShock(input);
  if (!shock || !finite(input.targetAssetsToEquity) || input.targetAssetsToEquity <= 1 || input.targetRuleStatus !== 'synthetic-rule-not-observed-target' || shock.after.equity <= 0) return null;
  const targetAssets = input.targetAssetsToEquity * shock.after.equity;
  const proposedAssetTrade = targetAssets - shock.after.assets;
  const proposedDebtChange = proposedAssetTrade;
  const proposedEndDebt = input.debt + proposedDebtChange;
  if (targetAssets <= 0 || proposedEndDebt < 0) return null;
  return {
    postShock: shock.after,
    targetAssets,
    proposedAssetTrade,
    proposedDebtChange,
    proposedEnd: balanceSheetSnapshot(targetAssets, proposedEndDebt, input.otherLiabilities),
    proposalStatus: 'illustrative-proposal-not-observed-action' as const,
    actualAdjustment: null,
  };
}

export type CashCandidate = {
  id: string;
  amount: number;
  legalEntity: string;
  currency: string;
  unrestricted: boolean;
  availableAt: string;
};

export type NetDebtInput = {
  grossDebt: number;
  debtLegalEntity: string;
  debtCurrency: string;
  targetDate: string;
  eligibilityPolicy: 'course-target-date-eligible-cash-v1';
  cashCandidates: readonly CashCandidate[];
  amountUnit: SyntheticAmountUnit;
};

export function netDebtEligibility(input: NetDebtInput) {
  const target = Date.parse(input.targetDate);
  if (!nonNegative(input.grossDebt) || !input.debtLegalEntity || !input.debtCurrency || !Number.isFinite(target)
    || input.eligibilityPolicy !== 'course-target-date-eligible-cash-v1'
    || input.amountUnit !== 'SYN-currency' || new Set(input.cashCandidates.map(({ id }) => id)).size !== input.cashCandidates.length
    || input.cashCandidates.some(({ id, amount, legalEntity, currency, availableAt }) => !id || !nonNegative(amount) || !legalEntity || !currency || !Number.isFinite(Date.parse(availableAt)))) return null;
  const decisions = input.cashCandidates.map((candidate) => {
    const failedRules = [
      candidate.legalEntity === input.debtLegalEntity ? null : 'wrong-legal-entity',
      candidate.currency === input.debtCurrency ? null : 'wrong-currency',
      candidate.unrestricted ? null : 'restricted',
      Date.parse(candidate.availableAt) <= target ? null : 'available-after-target-date',
    ].filter((value): value is string => Boolean(value));
    return { ...candidate, eligible: failedRules.length === 0, failedRules };
  });
  const eligibleCash = decisions.filter(({ eligible }) => eligible).reduce((sum, { amount }) => sum + amount, 0);
  return {
    policyId: input.eligibilityPolicy,
    measureLabel: 'course-target-date-eligible-net-debt' as const,
    grossDebt: input.grossDebt,
    eligibleCash,
    netDebt: input.grossDebt - eligibleCash,
    decisions,
  };
}

export type MaturityBucket = {
  id: string;
  windowStart: string;
  windowEnd: string;
  principalDue: number;
};

export type RefinancingGapInput = {
  totalDebt: number;
  maturityBuckets: readonly MaturityBucket[];
  targetWindowStart: string;
  targetWindowEnd: string;
  interestDue: number;
  eligibleOpeningCash: number;
  nonOverlappingOperatingCashFlow: number;
  committedUndrawnFacility: number;
  facilityAvailabilityFactor: number;
  otherUsesExcludingPrincipalAndInterest: number;
  amountUnit: SyntheticAmountUnit;
};

export function refinancingGapMetrics(input: RefinancingGapInput) {
  const start = Date.parse(input.targetWindowStart);
  const end = Date.parse(input.targetWindowEnd);
  if (!nonNegative(input.totalDebt, input.interestDue, input.eligibleOpeningCash, input.nonOverlappingOperatingCashFlow, input.committedUndrawnFacility, input.otherUsesExcludingPrincipalAndInterest)
    || !finite(input.facilityAvailabilityFactor) || input.facilityAvailabilityFactor < 0 || input.facilityAvailabilityFactor > 1
    || !Number.isFinite(start) || !Number.isFinite(end) || start >= end || input.amountUnit !== 'SYN-currency'
    || new Set(input.maturityBuckets.map(({ id }) => id)).size !== input.maturityBuckets.length) return null;
  const ordered = [...input.maturityBuckets].sort((a, b) => Date.parse(a.windowStart) - Date.parse(b.windowStart));
  if (ordered.some(({ id, windowStart, windowEnd, principalDue }) => !id || !nonNegative(principalDue) || !Number.isFinite(Date.parse(windowStart)) || !Number.isFinite(Date.parse(windowEnd)) || Date.parse(windowStart) >= Date.parse(windowEnd))) return null;
  if (ordered.some((bucket, index) => index > 0 && Date.parse(bucket.windowStart) < Date.parse(ordered[index - 1].windowEnd))) return null;
  if (ordered.reduce((sum, { principalDue }) => sum + principalDue, 0) > input.totalDebt) return null;
  const partiallyOverlappingTarget = ordered.some((bucket) => {
    const bucketStart = Date.parse(bucket.windowStart);
    const bucketEnd = Date.parse(bucket.windowEnd);
    const overlapsTarget = bucketStart < end && bucketEnd > start;
    const fullyInsideTarget = bucketStart >= start && bucketEnd <= end;
    return overlapsTarget && !fullyInsideTarget;
  });
  if (partiallyOverlappingTarget) return null;
  const principalDue = ordered.filter((bucket) => Date.parse(bucket.windowStart) >= start && Date.parse(bucket.windowEnd) <= end).reduce((sum, bucket) => sum + bucket.principalDue, 0);
  const availableCommittedFunding = input.committedUndrawnFacility * input.facilityAvailabilityFactor;
  const totalUses = principalDue + input.interestDue + input.otherUsesExcludingPrincipalAndInterest;
  const totalReliableSources = input.eligibleOpeningCash + input.nonOverlappingOperatingCashFlow + availableCommittedFunding;
  return {
    principalDue,
    interestDue: input.interestDue,
    otherUsesExcludingPrincipalAndInterest: input.otherUsesExcludingPrincipalAndInterest,
    availableCommittedFunding,
    totalUses,
    totalReliableSources,
    refinancingGap: Math.max(0, totalUses - totalReliableSources),
    surplus: Math.max(0, totalReliableSources - totalUses),
  };
}

export type DebtOverhangInput = {
  existingTerminalAssetValue: number;
  oldDebtFaceValue: number;
  projectCostPaidByExistingEquity: number;
  projectTerminalPayoffIncrement: number;
  amountUnit: SyntheticAmountUnit;
  debtRenegotiable: false;
  newFinancingSeniority: 'existing-equity-cash-no-new-claim';
};

export function debtOverhangMetrics(input: DebtOverhangInput) {
  if (!nonNegative(input.existingTerminalAssetValue, input.oldDebtFaceValue, input.projectCostPaidByExistingEquity, input.projectTerminalPayoffIncrement)
    || input.amountUnit !== 'SYN-currency' || input.debtRenegotiable !== false || input.newFinancingSeniority !== 'existing-equity-cash-no-new-claim') return null;
  const terminalWithout = input.existingTerminalAssetValue;
  const terminalWith = terminalWithout + input.projectTerminalPayoffIncrement;
  const creditorWithout = Math.min(input.oldDebtFaceValue, terminalWithout);
  const creditorWith = Math.min(input.oldDebtFaceValue, terminalWith);
  const equityWithout = Math.max(0, terminalWithout - input.oldDebtFaceValue);
  const equityWith = Math.max(0, terminalWith - input.oldDebtFaceValue);
  const totalNpv = input.projectTerminalPayoffIncrement - input.projectCostPaidByExistingEquity;
  const creditorGain = creditorWith - creditorWithout;
  const equityIncrementBeforeCost = equityWith - equityWithout;
  const equityNpv = equityIncrementBeforeCost - input.projectCostPaidByExistingEquity;
  return { terminalWithout, terminalWith, creditorWithout, creditorWith, equityWithout, equityWith, totalNpv, creditorGain, equityIncrementBeforeCost, equityNpv };
}

export type DeleveragingPath = 'asset-sale-repay' | 'new-equity-retained-cash' | 'debt-write-down' | 'retained-earnings-cash';

export type DeleveragingInput = {
  assets: number;
  debt: number;
  otherLiabilities: number;
  targetAssetsToEquity: number;
  path: DeleveragingPath;
  amountUnit: SyntheticAmountUnit;
};

export function deleveragingPathMetrics(input: DeleveragingInput) {
  if (!nonNegative(input.assets, input.debt, input.otherLiabilities) || input.assets <= 0 || !finite(input.targetAssetsToEquity)
    || input.targetAssetsToEquity <= 1 || input.amountUnit !== 'SYN-currency') return null;
  const initial = balanceSheetSnapshot(input.assets, input.debt, input.otherLiabilities);
  if (initial.equity <= 0) return null;
  const excessAssetsAtFrozenEquity = Math.max(0, input.assets - input.targetAssetsToEquity * initial.equity);
  let amount = 0;
  let endAssets = input.assets;
  let endDebt = input.debt;
  if (input.path === 'asset-sale-repay') {
    amount = excessAssetsAtFrozenEquity;
    endAssets -= amount;
    endDebt -= amount;
  } else if (input.path === 'new-equity-retained-cash' || input.path === 'retained-earnings-cash') {
    amount = excessAssetsAtFrozenEquity / (input.targetAssetsToEquity - 1);
    endAssets += amount;
  } else if (input.path === 'debt-write-down') {
    amount = excessAssetsAtFrozenEquity / input.targetAssetsToEquity;
    endDebt -= amount;
  } else return null;
  if (amount < 0 || endDebt < 0) return null;
  const end = balanceSheetSnapshot(endAssets, endDebt, input.otherLiabilities);
  return {
    path: input.path,
    amount,
    initial,
    end,
    closes: close(end.assets, end.debt + end.otherLiabilities + end.equity),
    reachesTarget: close(end.assetsToEquity, input.targetAssetsToEquity),
    observedStatus: 'synthetic-accounting-path-not-observed-action' as const,
    realSpendingEffect: input.path === 'retained-earnings-cash' ? 'likely-delayed-spending-or-distribution' : input.path === 'asset-sale-repay' ? 'possible-asset-supply-and-spending-pressure' : input.path === 'debt-write-down' ? 'loss-transferred-to-creditor' : 'depends-on-equity-supplier-and-use-of-cash',
  };
}

export type DistributionGroup = { id: string; populationWeight: number; debt: number; income: number; principalDue: number };

export function leverageDistributionMetrics(groups: readonly DistributionGroup[]) {
  if (groups.length < 2 || new Set(groups.map(({ id }) => id)).size !== groups.length
    || groups.some(({ id, populationWeight, debt, income, principalDue }) => !id || !nonNegative(populationWeight, debt, income, principalDue) || income <= 0 || principalDue > debt)
    || !close(groups.reduce((sum, { populationWeight }) => sum + populationWeight, 0), 1)) return null;
  const averageOfRatios = groups.reduce((sum, group) => sum + group.populationWeight * group.debt / group.income, 0);
  const weightedDebt = groups.reduce((sum, group) => sum + group.populationWeight * group.debt, 0);
  const weightedIncome = groups.reduce((sum, group) => sum + group.populationWeight * group.income, 0);
  const ratioOfSums = weightedDebt / weightedIncome;
  const weightedPrincipalDue = groups.reduce((sum, group) => sum + group.populationWeight * group.principalDue, 0);
  const vulnerableWeight = groups.filter((group) => group.debt / group.income >= 4 || group.principalDue / group.income >= 1).reduce((sum, group) => sum + group.populationWeight, 0);
  return { averageOfRatios, ratioOfSums, weightedDebt, weightedIncome, weightedPrincipalDue, vulnerableWeight };
}

export const canonicalLeverageRegistryInput: LeverageRegistryInput = {
  assets: 100, debt: 80, otherLiabilities: 10, annualIncome: 20, ebitda: 16, eligibleCash: 5,
  eligibleCashPolicy: 'course-target-date-eligible-cash-v1', eligibleCashTargetDate: '2026-12-31T23:59:59-05:00',
  grossExposure: 150, nav: 10, amountUnit: 'SYN-currency', snapshotTime: '2026-09-14T00:00:00-04:00', incomeWindow: 'trailing-twelve-months',
};

export const canonicalPassiveLeverageInput: PassiveLeverageInput = {
  assets: 100, debt: 90, otherLiabilities: 0, assetPriceShockPct: -4, amountUnit: 'SYN-currency', snapshotTime: '2026-09-14T00:00:00-04:00',
};

export const canonicalTargetLeverageInput: TargetLeverageInput = {
  ...canonicalPassiveLeverageInput, targetAssetsToEquity: 10, targetRuleStatus: 'synthetic-rule-not-observed-target',
};

export const canonicalNetDebtInput: NetDebtInput = {
  grossDebt: 80, debtLegalEntity: 'SYN-PARENT', debtCurrency: 'SYN', targetDate: '2026-12-31T23:59:59-05:00',
  eligibilityPolicy: 'course-target-date-eligible-cash-v1', amountUnit: 'SYN-currency',
  cashCandidates: [
    { id: 'same-entity-unrestricted', amount: 5, legalEntity: 'SYN-PARENT', currency: 'SYN', unrestricted: true, availableAt: '2026-09-14T00:00:00-04:00' },
    { id: 'restricted', amount: 7, legalEntity: 'SYN-PARENT', currency: 'SYN', unrestricted: false, availableAt: '2026-09-14T00:00:00-04:00' },
    { id: 'subsidiary', amount: 9, legalEntity: 'SYN-SUB', currency: 'SYN', unrestricted: true, availableAt: '2026-09-14T00:00:00-04:00' },
    { id: 'wrong-currency', amount: 4, legalEntity: 'SYN-PARENT', currency: 'ALT', unrestricted: true, availableAt: '2026-09-14T00:00:00-04:00' },
    { id: 'future-cash', amount: 6, legalEntity: 'SYN-PARENT', currency: 'SYN', unrestricted: true, availableAt: '2027-01-15T00:00:00-05:00' },
  ],
};

export const canonicalRefinancingGapInput: RefinancingGapInput = {
  totalDebt: 80,
  maturityBuckets: [
    { id: 'within-2027', windowStart: '2027-01-01T00:00:00Z', windowEnd: '2028-01-01T00:00:00Z', principalDue: 30 },
    { id: 'after-2027', windowStart: '2028-01-01T00:00:00Z', windowEnd: '2030-01-01T00:00:00Z', principalDue: 50 },
  ],
  targetWindowStart: '2027-01-01T00:00:00Z', targetWindowEnd: '2028-01-01T00:00:00Z', interestDue: 0, eligibleOpeningCash: 8,
  nonOverlappingOperatingCashFlow: 7, committedUndrawnFacility: 5, facilityAvailabilityFactor: 0.8, otherUsesExcludingPrincipalAndInterest: 0, amountUnit: 'SYN-currency',
};

export const canonicalDebtOverhangInput: DebtOverhangInput = {
  existingTerminalAssetValue: 90, oldDebtFaceValue: 100, projectCostPaidByExistingEquity: 10, projectTerminalPayoffIncrement: 15,
  amountUnit: 'SYN-currency', debtRenegotiable: false, newFinancingSeniority: 'existing-equity-cash-no-new-claim',
};

export const canonicalDistributionGroups: readonly DistributionGroup[] = [
  { id: 'thin-buffer-tail', populationWeight: 0.2, debt: 90, income: 15, principalDue: 18 },
  { id: 'resilient-majority', populationWeight: 0.8, debt: 40, income: 20, principalDue: 3 },
];

export const canonicalLeverageRegistryResult = leverageRegistryMetrics(canonicalLeverageRegistryInput);
export const canonicalPassiveLeverageResult = passiveLeverageShock(canonicalPassiveLeverageInput);
export const canonicalTargetLeverageResult = targetLeverageProposal(canonicalTargetLeverageInput);
export const canonicalNetDebtResult = netDebtEligibility(canonicalNetDebtInput);
export const canonicalRefinancingGapResult = refinancingGapMetrics(canonicalRefinancingGapInput);
export const canonicalDebtOverhangResult = debtOverhangMetrics(canonicalDebtOverhangInput);
export const canonicalDeleveragingResults = (['asset-sale-repay', 'new-equity-retained-cash', 'debt-write-down', 'retained-earnings-cash'] as const).map((path) => deleveragingPathMetrics({ assets: 96, debt: 90, otherLiabilities: 0, targetAssetsToEquity: 10, path, amountUnit: 'SYN-currency' }));
export const canonicalDistributionResult = leverageDistributionMetrics(canonicalDistributionGroups);

export const debtLeverageTransmissionSourceIds = [1, 2, 3, 4, 47] as const;
export const debtLeverageMechanismLabSources = {
  c1: [1, 5, 6, 7, 8],
  c2: [18, 20, 21],
  c3: [5, 6, 10],
  c4: [7, 8, 10, 22, 23, 24, 25],
  c5: [12, 14, 26],
  c6: [26, 27, 28, 29, 30, 31],
  c7: [33, 35, 36, 37, 38, 40],
} as const;
export const debtLeverageMechanismLabSourceIds = Object.values(debtLeverageMechanismLabSources).flat();

const sha256Initial = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19] as const;
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
      const p15 = words[index - 15]; const p2 = words[index - 2];
      const s0 = rotateRight(p15, 7) ^ rotateRight(p15, 18) ^ (p15 >>> 3);
      const s1 = rotateRight(p2, 17) ^ rotateRight(p2, 19) ^ (p2 >>> 10);
      words[index] = (words[index - 16] + s0 + words[index - 7] + s1) >>> 0;
    }
    let [a, b, c, d, e, f, g, h] = hash;
    for (let index = 0; index < 64; index += 1) {
      const s1 = rotateRight(e, 6) ^ rotateRight(e, 11) ^ rotateRight(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (h + s1 + ch + sha256RoundConstants[index] + words[index]) >>> 0;
      const s0 = rotateRight(a, 2) ^ rotateRight(a, 13) ^ rotateRight(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) >>> 0;
      h = g; g = f; f = e; e = (d + t1) >>> 0; d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    hash[0] = (hash[0] + a) >>> 0; hash[1] = (hash[1] + b) >>> 0; hash[2] = (hash[2] + c) >>> 0; hash[3] = (hash[3] + d) >>> 0;
    hash[4] = (hash[4] + e) >>> 0; hash[5] = (hash[5] + f) >>> 0; hash[6] = (hash[6] + g) >>> 0; hash[7] = (hash[7] + h) >>> 0;
  }
  return hash.map((word) => word.toString(16).padStart(8, '0')).join('');
}

export type BrokerDealerLeverageObservation = { period: string; leverage: number };
export const brokerDealerLeverageObservations: readonly BrokerDealerLeverageObservation[] = [
  { period: '1995-Q4', leverage: 31.8437861119866 }, { period: '1996-Q4', leverage: 33.8799653746273 },
  { period: '1997-Q4', leverage: 32.9736871252037 }, { period: '1998-Q4', leverage: 30.4295790511052 },
  { period: '1999-Q4', leverage: 28.557997841401 }, { period: '2000-Q4', leverage: 28.2648060796646 },
  { period: '2001-Q4', leverage: 31.338968071904 }, { period: '2002-Q4', leverage: 30.6285497486484 },
  { period: '2003-Q4', leverage: 33.6675097743329 }, { period: '2004-Q4', leverage: 39.2777396924885 },
  { period: '2005-Q4', leverage: 39.880072868668 }, { period: '2006-Q4', leverage: 43.0107629130303 },
  { period: '2007-Q4', leverage: 46.2983034482759 }, { period: '2008-Q1', leverage: 47.89183041899 },
  { period: '2008-Q4', leverage: 30.7079615940182 }, { period: '2009-Q4', leverage: 23.5052722711834 },
  { period: '2010-Q4', leverage: 23.5247459227071 }, { period: '2011-Q4', leverage: 24.6372270220987 },
  { period: '2012-Q4', leverage: 23.4598855351307 }, { period: '2013-Q4', leverage: 21.097681616223 },
  { period: '2014-Q4', leverage: 19.8169499480063 }, { period: '2015-Q4', leverage: 18.1493925866296 },
  { period: '2016-Q4', leverage: 17.6136082150251 }, { period: '2017-Q4', leverage: 17.1500899174335 },
  { period: '2018-Q4', leverage: 18.1021874008148 }, { period: '2019-Q4', leverage: 16.8485077888428 },
  { period: '2020-Q4', leverage: 16.6196028088193 }, { period: '2021-Q4', leverage: 15.7850315685682 },
  { period: '2022-Q4', leverage: 15.9521612582599 }, { period: '2023-Q4', leverage: 17.081807501296 },
  { period: '2024-Q4', leverage: 16.5456570897438 }, { period: '2025-Q4', leverage: 17.1574912858505 },
] as const;

export const brokerDealerLeverageDataPassport = {
  sourceId: 'FED_FSR_2026_FIGURE_3_7_BROKER_DEALER_LEVERAGE',
  provider: 'Board of Governors of the Federal Reserve System',
  seriesLabel: 'Leverage at broker-dealers',
  definition: 'total assets divided by equity',
  frequency: 'quarterly', nativeUnit: 'assets-per-unit-of-equity-multiple',
  observationStart: '1995-Q1', observationEnd: '2025-Q4', selectedObservationCount: brokerDealerLeverageObservations.length,
  publicationVintage: 'May 2026 Financial Stability Report',
  retrievedAt: '2026-09-14', sourceUrl: 'https://www.federalreserve.gov/publications/2026-may-financial-stability-report-accessibility-tables.htm',
  capturedResponseSha256: 'e6ba33a459023902beb5f6686b2308f45a4087de193d824ad1c4a91848a5908c',
  capturedResponseHashScope: 'one-response-specific-html-including-dynamic-edge-token-not-a-stable-source-fingerprint',
  capturedResponseRetainedInRepository: false as const,
  transactionTableId: 'S125s3.t', stockTableId: 'S125s3.s', priorTableIds: ['F.130', 'L.130'],
  stableEvidenceAnchor: 'normalized-selected-figure-3-7-rows',
  scope: 'United States broker-dealer sector aggregate; not households, banks, insurers, hedge funds, or a representative institution',
  historyType: 'MAY_2026_PUBLICATION_VINTAGE_NOT_SEQUENTIAL_PIT',
  revisionWarning: 'this fixed May 2026 publication snapshot is not the sequence of tables known at earlier historical dates',
  mayEnterCanonicalCalculation: false as const,
} as const;

export const brokerDealerLeverageNormalizedSha256 = '2a16f42859d8bf93ca4065a9a298cf52b289f046f4cf6dc17556fb6ff92dc536';
export const brokerDealerLeverageRecomputedNormalizedSha256 = sha256Hex(JSON.stringify(brokerDealerLeverageObservations));
const brokerDealerInjectedDriftSha256 = sha256Hex(JSON.stringify(brokerDealerLeverageObservations.map((row, index) => index === 4 ? { ...row, leverage: row.leverage + 0.01 } : row)));

export type HouseholdDebtObservation = {
  period: string;
  totalLiabilitiesToDpi: number;
  homeMortgageToDpi: number;
  consumerCreditToDpi: number;
  otherLiabilitiesToDpi: number;
  realEstateToDpi: number;
};

export const householdDebtObservations: readonly HouseholdDebtObservation[] = [
  { period: '2003-Q1', totalLiabilitiesToDpi: 109.10, homeMortgageToDpi: 74.68, consumerCreditToDpi: 24.01, otherLiabilitiesToDpi: 10.41, realEstateToDpi: 199.04 },
  { period: '2005-Q4', totalLiabilitiesToDpi: 128.50, homeMortgageToDpi: 93.16, consumerCreditToDpi: 24.28, otherLiabilitiesToDpi: 11.05, realEstateToDpi: 243.74 },
  { period: '2007-Q4', totalLiabilitiesToDpi: 136.81, homeMortgageToDpi: 99.76, consumerCreditToDpi: 24.61, otherLiabilitiesToDpi: 12.43, realEstateToDpi: 219.49 },
  { period: '2009-Q1', totalLiabilitiesToDpi: 132.62, homeMortgageToDpi: 97.38, consumerCreditToDpi: 23.80, otherLiabilitiesToDpi: 11.44, realEstateToDpi: 188.54 },
  { period: '2013-Q1', totalLiabilitiesToDpi: 111.77, homeMortgageToDpi: 77.14, consumerCreditToDpi: 23.78, otherLiabilitiesToDpi: 10.85, realEstateToDpi: 154.31 },
  { period: '2015-Q1', totalLiabilitiesToDpi: 104.86, homeMortgageToDpi: 69.51, consumerCreditToDpi: 24.72, otherLiabilitiesToDpi: 10.63, realEstateToDpi: 163.70 },
  { period: '2019-Q1', totalLiabilitiesToDpi: 98.54, homeMortgageToDpi: 63.43, consumerCreditToDpi: 24.97, otherLiabilitiesToDpi: 10.14, realEstateToDpi: 172.61 },
  { period: '2026-Q2', totalLiabilitiesToDpi: 92.55, homeMortgageToDpi: 59.12, consumerCreditToDpi: 21.66, otherLiabilitiesToDpi: 11.77, realEstateToDpi: 210.60 },
] as const;

export const householdDeleveragingEpisodes = [
  { id: 'boom-2003Q1-2007Q4', start: '2003-Q1', end: '2007-Q4', liabilitiesGrowthPct: 60.463, dpiGrowthPct: 27.963, ratioChangePp: 27.71, interpretation: 'liability-numerator-grew-faster-than-income' },
  { id: 'stock-contraction-2007Q4-2013Q1', start: '2007-Q4', end: '2013-Q1', liabilitiesGrowthPct: -5.576, dpiGrowthPct: 15.581, ratioChangePp: -25.04, interpretation: 'liability-stock-fell-while-income-recovered' },
  { id: 'denominator-repair-2013Q1-2019Q1', start: '2013-Q1', end: '2019-Q1', liabilitiesGrowthPct: 15.102, dpiGrowthPct: 30.547, ratioChangePp: -13.23, interpretation: 'liabilities-rose-but-income-grew-faster' },
] as const;

export const householdDebtDataPassport = {
  sourceId: 'FED_Z1_HOUSEHOLDS_NONPROFITS_BALANCE_SHEET_2026Q2',
  provider: 'Board of Governors of the Federal Reserve System', release: 'Financial Accounts of the United States 2026Q2',
  releaseUpdatedAt: '2026-09-11', retrievedAtUtc: '2026-09-14T21:26:53Z',
  sourceUrl: 'https://www.federalreserve.gov/releases/z1/dataviz/z1/balance_sheet/table/',
  latestDownloadUrl: 'https://www.federalreserve.gov/releases/z1/dataviz/download/zips/z1-visualization.zip',
  scope: 'Households and nonprofit organizations, sector aggregate', frequency: 'quarterly',
  units: 'end-of-period liabilities divided by disposable personal income at seasonally adjusted annual rate; percent',
  rawArchiveSha256: '379ced866e8da615a23b10d84cfd15c5271c49f1776fc0292d477f3b198ace93',
  dataMemberSha256: '2efa56449d0f03b6e415467261c7646092423e817ad0ed90776cec0269c05d33',
  fullNormalizedSha256: '0c25447e362de90237e983c444387cd128f4660ef0502a8f0fdb3066e52c1568',
  capturedArchiveRetainedInRepository: false as const,
  downloadEndpointMutability: 'LIVING_LATEST_RELEASE_URL_NOT_CONTENT_ADDRESSED',
  reproducibilityWarning: 'the hashes identify bytes retrieved on 2026-09-14, but the captured ZIP is not retained in this repository and the living latest-release URL may later serve different bytes',
  historyType: 'CURRENT_VINTAGE_RECONSTRUCTION_NOT_POINT_IN_TIME',
  denominatorWarning: 'DPI is a flow at SAAR; 2020-2021 policy transfers can move the denominator sharply',
  identityWarning: 'sector aggregate is not micro household DTI, DSR, average LTV, or the distribution of household leverage',
  mayEnterCanonicalCalculation: false as const,
} as const;

export const householdDebtNormalizedSha256 = '997c450e80921573e9e398e36969f58f8014f71e40bbfeabcc241e1aed494f21';
export const householdDebtRecomputedNormalizedSha256 = sha256Hex(JSON.stringify(householdDebtObservations));
const householdDebtInjectedDriftSha256 = sha256Hex(JSON.stringify(householdDebtObservations.map((row, index) => index === 2 ? { ...row, homeMortgageToDpi: row.homeMortgageToDpi + 0.01 } : row)));

export const debtLeverageFixtureAudit = [
  { key: 'C1 leverage registry closes and preserves six denominators', passed: canonicalLeverageRegistryResult?.equity === 10 && close(canonicalLeverageRegistryResult.debtToAssets, 0.8) && close(canonicalLeverageRegistryResult.debtToEquity, 8) && close(canonicalLeverageRegistryResult.assetsToEquity, 10) && close(canonicalLeverageRegistryResult.debtToIncome, 4) && close(canonicalLeverageRegistryResult.netDebtToEbitda, 75 / 16) && close(canonicalLeverageRegistryResult.grossExposureToNav, 15) },
  { key: 'C1 rejects non-positive denominators and unregistered cash policy', passed: leverageRegistryMetrics({ ...canonicalLeverageRegistryInput, nav: 0 }) === null && leverageRegistryMetrics({ ...canonicalLeverageRegistryInput, ebitda: 0 }) === null && leverageRegistryMetrics({ ...canonicalLeverageRegistryInput, eligibleCashPolicy: 'generic-net-debt' as never }) === null },
  { key: 'C1 debt is not silently promoted to total liabilities', passed: canonicalLeverageRegistryResult?.totalLiabilities === 90 && canonicalLeverageRegistryResult.equity === canonicalLeverageRegistryInput.assets - canonicalLeverageRegistryInput.debt - canonicalLeverageRegistryInput.otherLiabilities },
  { key: 'C2 passive shock leaves debt fixed and amplifies a four-percent asset loss into a forty-percent equity loss', passed: canonicalPassiveLeverageResult?.debtChanged === false && close(canonicalPassiveLeverageResult.after.assets, 96) && close(canonicalPassiveLeverageResult.after.debt, 90) && close(canonicalPassiveLeverageResult.after.equity, 6) && close(canonicalPassiveLeverageResult.after.assetsToEquity, 16) && close(canonicalPassiveLeverageResult.equityLossPct, -40) },
  { key: 'C2 target rule proposes but does not observe a thirty-six-unit sale', passed: close(canonicalTargetLeverageResult?.proposedAssetTrade, -36) && close(canonicalTargetLeverageResult?.proposedDebtChange, -36) && close(canonicalTargetLeverageResult?.proposedEnd.assets, 60) && close(canonicalTargetLeverageResult?.proposedEnd.debt, 54) && close(canonicalTargetLeverageResult?.proposedEnd.assetsToEquity, 10) && canonicalTargetLeverageResult?.actualAdjustment === null },
  { key: 'C2 rejects target rules masquerading as observed behavior', passed: targetLeverageProposal({ ...canonicalTargetLeverageInput, targetRuleStatus: 'observed-target' as never }) === null },
  { key: 'C3 course policy admits only same-entity same-currency unrestricted timely cash', passed: canonicalNetDebtResult?.policyId === 'course-target-date-eligible-cash-v1' && canonicalNetDebtResult.measureLabel === 'course-target-date-eligible-net-debt' && canonicalNetDebtResult.eligibleCash === 5 && canonicalNetDebtResult.netDebt === 75 && canonicalNetDebtResult.decisions.filter(({ eligible }) => eligible).length === 1 },
  { key: 'C3 rejects duplicate cash identities and unregistered net-debt policies', passed: netDebtEligibility({ ...canonicalNetDebtInput, cashCandidates: [...canonicalNetDebtInput.cashCandidates, canonicalNetDebtInput.cashCandidates[0]] }) === null && netDebtEligibility({ ...canonicalNetDebtInput, eligibilityPolicy: 'generic-net-debt' as never }) === null },
  { key: 'C4 maturity buckets are exclusive and refinancing uses explicitly include zero interest', passed: canonicalRefinancingGapResult?.principalDue === 30 && canonicalRefinancingGapResult.interestDue === 0 && canonicalRefinancingGapResult.otherUsesExcludingPrincipalAndInterest === 0 && canonicalRefinancingGapResult.totalUses === 30 && close(canonicalRefinancingGapResult.availableCommittedFunding, 4) && close(canonicalRefinancingGapResult.totalReliableSources, 19) && close(canonicalRefinancingGapResult.refinancingGap, 11) && canonicalRefinancingGapResult.surplus === 0 },
  { key: 'C4 interest changes uses while overfunding yields zero gap and a separately reported surplus', passed: refinancingGapMetrics({ ...canonicalRefinancingGapInput, interestDue: 5 })?.refinancingGap === 16 && refinancingGapMetrics({ ...canonicalRefinancingGapInput, eligibleOpeningCash: 20 })?.refinancingGap === 0 && refinancingGapMetrics({ ...canonicalRefinancingGapInput, eligibleOpeningCash: 20 })?.surplus === 1 && [canonicalRefinancingGapResult, refinancingGapMetrics({ ...canonicalRefinancingGapInput, interestDue: 5 }), refinancingGapMetrics({ ...canonicalRefinancingGapInput, eligibleOpeningCash: 20 })].every((result) => result !== null && result.refinancingGap * result.surplus === 0) },
  { key: 'C4 rejects negative or omitted interest overlapping buckets partial-target buckets and principal over total debt', passed: refinancingGapMetrics({ ...canonicalRefinancingGapInput, interestDue: -1 }) === null && refinancingGapMetrics({ ...canonicalRefinancingGapInput, interestDue: undefined as never }) === null && refinancingGapMetrics({ ...canonicalRefinancingGapInput, maturityBuckets: [{ id: 'a', windowStart: '2027-01-01T00:00:00Z', windowEnd: '2028-06-01T00:00:00Z', principalDue: 20 }, { id: 'b', windowStart: '2028-01-01T00:00:00Z', windowEnd: '2029-01-01T00:00:00Z', principalDue: 20 }] }) === null && refinancingGapMetrics({ ...canonicalRefinancingGapInput, maturityBuckets: [{ id: 'partial', windowStart: '2026-12-01T00:00:00Z', windowEnd: '2027-06-01T00:00:00Z', principalDue: 20 }, { id: 'after', windowStart: '2028-01-01T00:00:00Z', windowEnd: '2029-01-01T00:00:00Z', principalDue: 20 }] }) === null && refinancingGapMetrics({ ...canonicalRefinancingGapInput, maturityBuckets: [{ id: 'a', windowStart: '2027-01-01T00:00:00Z', windowEnd: '2028-01-01T00:00:00Z', principalDue: 81 }] }) === null },
  { key: 'C5 debt overhang separates total value, creditor gain and equity incentive', passed: canonicalDebtOverhangResult?.totalNpv === 5 && canonicalDebtOverhangResult.creditorGain === 10 && canonicalDebtOverhangResult.equityIncrementBeforeCost === 5 && canonicalDebtOverhangResult.equityNpv === -5 },
  { key: 'C6 all four deleveraging paths close and reach target without calling a write-down repayment', passed: canonicalDeleveragingResults.every((result) => result?.closes && result.reachesTarget) && close(canonicalDeleveragingResults[0]?.amount, 36) && close(canonicalDeleveragingResults[1]?.amount, 4) && close(canonicalDeleveragingResults[2]?.amount, 3.6) && close(canonicalDeleveragingResults[3]?.amount, 4) },
  { key: 'C7 average ratio and ratio of sums remain distinct while tail weight is explicit', passed: close(canonicalDistributionResult?.averageOfRatios, 2.8) && close(canonicalDistributionResult?.ratioOfSums, 50 / 19) && close(canonicalDistributionResult?.vulnerableWeight, 0.2) },
  { key: 'official Fed series contains 31 Q4 observations plus the 2008Q1 peak and is ordered', passed: brokerDealerLeverageObservations.length === 32 && brokerDealerLeverageObservations.filter(({ period }) => period.endsWith('-Q4')).length === 31 && brokerDealerLeverageObservations.filter(({ period }) => period === '2008-Q1').length === 1 && brokerDealerLeverageObservations.every(({ period }, index) => !index || period > brokerDealerLeverageObservations[index - 1].period) },
  { key: 'official checkpoints and scope are preserved', passed: close(brokerDealerLeverageObservations.find(({ period }) => period === '2008-Q1')?.leverage, 47.89183041899) && close(brokerDealerLeverageObservations.at(-1)?.leverage, 17.1574912858505) && brokerDealerLeverageDataPassport.scope.includes('not households') },
  { key: 'official publication passport is fixed-vintage quarantined HTTPS hash-scoped and uses exact redesigned table IDs', passed: brokerDealerLeverageDataPassport.historyType === 'MAY_2026_PUBLICATION_VINTAGE_NOT_SEQUENTIAL_PIT' && brokerDealerLeverageDataPassport.mayEnterCanonicalCalculation === false && brokerDealerLeverageDataPassport.sourceUrl.startsWith('https://') && /^[0-9a-f]{64}$/.test(brokerDealerLeverageDataPassport.capturedResponseSha256) && brokerDealerLeverageDataPassport.capturedResponseHashScope.includes('response-specific') && brokerDealerLeverageDataPassport.stableEvidenceAnchor === 'normalized-selected-figure-3-7-rows' && brokerDealerLeverageDataPassport.transactionTableId === 'S125s3.t' && brokerDealerLeverageDataPassport.stockTableId === 'S125s3.s' && brokerDealerLeverageDataPassport.priorTableIds.join('/') === 'F.130/L.130' },
  { key: 'portable SHA-256 passes abc and full official row hash', passed: sha256Hex('abc') === 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad' && brokerDealerLeverageRecomputedNormalizedSha256 === brokerDealerLeverageNormalizedSha256 },
  { key: 'an injected non-checkpoint drift changes the official row hash', passed: brokerDealerInjectedDriftSha256 !== brokerDealerLeverageNormalizedSha256 },
  { key: 'household checkpoints preserve additive liability composition within rounding tolerance', passed: householdDebtObservations.every((row) => Math.abs(row.totalLiabilitiesToDpi - row.homeMortgageToDpi - row.consumerCreditToDpi - row.otherLiabilitiesToDpi) <= 0.011) },
  { key: 'household boom and two repair regimes keep numerator and denominator mechanisms distinct', passed: householdDeleveragingEpisodes.length === 3 && householdDeleveragingEpisodes[0].liabilitiesGrowthPct > householdDeleveragingEpisodes[0].dpiGrowthPct && householdDeleveragingEpisodes[1].liabilitiesGrowthPct < 0 && householdDeleveragingEpisodes[1].dpiGrowthPct > 0 && householdDeleveragingEpisodes[2].liabilitiesGrowthPct > 0 && householdDeleveragingEpisodes[2].dpiGrowthPct > householdDeleveragingEpisodes[2].liabilitiesGrowthPct },
  { key: 'household passport is latest-vintage quarantined and does not mislabel the mutable endpoint as a retained archive', passed: householdDebtDataPassport.historyType.includes('NOT_POINT_IN_TIME') && householdDebtDataPassport.mayEnterCanonicalCalculation === false && householdDebtDataPassport.sourceUrl.startsWith('https://') && householdDebtDataPassport.latestDownloadUrl.startsWith('https://') && /^[0-9a-f]{64}$/.test(householdDebtDataPassport.rawArchiveSha256) && /^[0-9a-f]{64}$/.test(householdDebtDataPassport.dataMemberSha256) && /^[0-9a-f]{64}$/.test(householdDebtDataPassport.fullNormalizedSha256) && householdDebtDataPassport.capturedArchiveRetainedInRepository === false && householdDebtDataPassport.downloadEndpointMutability === 'LIVING_LATEST_RELEASE_URL_NOT_CONTENT_ADDRESSED' && householdDebtDataPassport.reproducibilityWarning.includes('not retained') },
  { key: 'household selected rows recompute to their frozen hash and drift is detected', passed: householdDebtRecomputedNormalizedSha256 === householdDebtNormalizedSha256 && householdDebtInjectedDriftSha256 !== householdDebtNormalizedSha256 },
] as const;

export const debtLeverageFixtureAuditPassed = debtLeverageFixtureAudit.every(({ passed }) => passed);
if (!debtLeverageFixtureAuditPassed) throw new Error(`3.15 debt/leverage fixture gate failed: ${debtLeverageFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
