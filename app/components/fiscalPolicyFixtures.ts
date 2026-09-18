/** 3.17 preparation: independent SYN teaching experiments, not causal estimates or forecasts. */
const finite = (...values: number[]) => values.every(Number.isFinite);
const nonnegative = (...values: number[]) => finite(...values) && values.every((value) => value >= 0);
const near = (a: number, b: number) => Math.abs(a - b) <= 1e-9 * Math.max(1, Math.abs(a), Math.abs(b));

export function fiscalFirstRound(input: { deliveredPurchaseChange: number; cashTransferChange: number; taxRevenueChange: number; observedPrivateConsumptionChange: number; observedPrivateInvestmentChange: number; observedExportChange: number; observedImportChange: number }) {
  if (!finite(...Object.values(input))) return null;
  const outputAccountingChange = input.deliveredPurchaseChange + input.observedPrivateConsumptionChange + input.observedPrivateInvestmentChange + input.observedExportChange - input.observedImportChange;
  const primaryDeficitChange = input.deliveredPurchaseChange + input.cashTransferChange - input.taxRevenueChange;
  if (!finite(outputAccountingChange, primaryDeficitChange)) return null;
  return { outputAccountingChange, primaryDeficitChange, transferDirectGDPEntry: 0, causalMultiplier: null, welfare: null, scope: 'all-inputs-are-declared-same-period-incremental-differences-not-budget-levels-zero-interest-change-and-no-other-fiscal-items' };
}

export type FiscalTransferGroup = { id: string; households: number; perHouseholdTransfer: number; syntheticConsumptionShare: number; syntheticDebtRepaymentShare: number };
export function fiscalTransferUses(groups: readonly FiscalTransferGroup[]) {
  if (!groups.length || new Set(groups.map(({ id }) => id)).size !== groups.length || groups.some((g) => !g.id || !Number.isSafeInteger(g.households) || g.households <= 0 || !nonnegative(g.households, g.perHouseholdTransfer, g.syntheticConsumptionShare, g.syntheticDebtRepaymentShare) || g.syntheticConsumptionShare + g.syntheticDebtRepaymentShare > 1)) return null;
  const totals = groups.reduce((a, g) => {
    const transfer = g.households * g.perHouseholdTransfer;
    return { households: a.households + g.households, transfer: a.transfer + transfer, consumption: a.consumption + transfer * g.syntheticConsumptionShare, debtRepayment: a.debtRepayment + transfer * g.syntheticDebtRepaymentShare, financialAssetAccumulation: a.financialAssetAccumulation + transfer * (1 - g.syntheticConsumptionShare - g.syntheticDebtRepaymentShare) };
  }, { households: 0, transfer: 0, consumption: 0, debtRepayment: 0, financialAssetAccumulation: 0 });
  if (!Number.isSafeInteger(totals.households) || !totals.households || !finite(...Object.values(totals))) return null;
  return { ...totals, budgetClosed: near(totals.transfer, totals.consumption + totals.debtRepayment + totals.financialAssetAccumulation), estimatedMPC: null, totalGDPResponse: null };
}

export function fiscalAutomaticRule(input: { baselineIncome: number; currentIncome: number; unchangedTaxRate: number; baselineTransfer: number; automaticTransferIncrease: number; discretionaryTransferIncrease: number }) {
  if (!nonnegative(...Object.values(input)) || input.unchangedTaxRate > 1) return null;
  const baselineTax = input.baselineIncome * input.unchangedTaxRate;
  const currentTax = input.currentIncome * input.unchangedTaxRate;
  const baselineDisposable = input.baselineIncome - baselineTax + input.baselineTransfer;
  const noNewPolicyDisposable = input.currentIncome - currentTax + input.baselineTransfer + input.automaticTransferIncrease;
  if (!finite(baselineTax, currentTax, baselineDisposable, noNewPolicyDisposable, noNewPolicyDisposable + input.discretionaryTransferIncrease, baselineTax - currentTax + input.automaticTransferIncrease)) return null;
  return { baselineTax, currentTax, automaticDeficitIncrease: baselineTax - currentTax + input.automaticTransferIncrease, baselineDisposable, noNewPolicyDisposable, withNewPolicyDisposable: noNewPolicyDisposable + input.discretionaryTransferIncrease, discretionaryImpulse: input.discretionaryTransferIncrease, rulesChangedAutomatically: false, causalMultiplier: null };
}

export function fiscalTeachingLoop(input: { initialGovernmentPurchase: number; initialTaxCut: number; consumptionShare: number; unchangedTaxRate: number; importPerIncomeShare: number; rounds: number }) {
  if (!nonnegative(...Object.values(input)) || input.consumptionShare > 1 || input.unchangedTaxRate > 1 || input.importPerIncomeShare > 1 || !Number.isInteger(input.rounds) || input.rounds < 1 || input.rounds > 10000) return null;
  const q = input.consumptionShare * (1 - input.unchangedTaxRate) - input.importPerIncomeShare;
  if (q < 0 || q >= 1) return null;
  const firstRound = input.initialGovernmentPurchase + input.consumptionShare * input.initialTaxCut;
  let cumulative = 0, contribution = firstRound;
  for (let i = 0; i < input.rounds; i++) { cumulative += contribution; contribution *= q; }
  const infiniteTeachingOutput = firstRound / (1 - q);
  const remainingTeachingTail = firstRound * Math.pow(q, input.rounds) / (1 - q);
  if (!finite(firstRound, cumulative, infiniteTeachingOutput, remainingTeachingTail)) return null;
  return { q, firstRound, finiteRoundTeachingOutput: cumulative, infiniteTeachingOutput, remainingTeachingTail, purchaseMultiplierWithinModel: 1 / (1 - q), taxCutMultiplierWithinModel: input.consumptionShare / (1 - q), modelConditions: 'fixed-price-and-interest-demand-determined-output-adequate-resources-declared-financing-only', empiricalMultiplier: null };
}

export function fiscalPathMultipliers(input: { spendingChanges: readonly number[]; realOutputChanges: readonly number[]; horizonIndex: number }) {
  if (!input.spendingChanges.length || input.spendingChanges.length !== input.realOutputChanges.length || !finite(...input.spendingChanges, ...input.realOutputChanges) || !Number.isInteger(input.horizonIndex) || input.horizonIndex < 0 || input.horizonIndex >= input.spendingChanges.length) return null;
  const totalSpendingChange = input.spendingChanges.slice(0, input.horizonIndex + 1).reduce((a, b) => a + b, 0);
  const totalOutputChange = input.realOutputChanges.slice(0, input.horizonIndex + 1).reduce((a, b) => a + b, 0);
  if (!finite(totalSpendingChange, totalOutputChange)) return null;
  const impactRatio = input.spendingChanges[0] === 0 ? null : input.realOutputChanges[0] / input.spendingChanges[0];
  const horizonRatio = input.spendingChanges[0] === 0 ? null : input.realOutputChanges[input.horizonIndex] / input.spendingChanges[0];
  const cumulativeRatio = totalSpendingChange === 0 ? null : totalOutputChange / totalSpendingChange;
  if ([impactRatio, horizonRatio, cumulativeRatio].some((value) => value !== null && !Number.isFinite(value))) return null;
  return { impactRatio, horizonRatio, cumulativeRatio, totalSpendingChange, totalOutputChange, cumulativeWindowEndIndex: input.horizonIndex, unitContract: 'same-frequency-real-SYN-period-flow-not-SAAR-or-growth-percentage-points', causalStatus: 'not-identified-synthetic-paths' };
}

export function fiscalResponseConvolution(input: { baselineLevels: readonly number[]; fiscalImpulses: readonly number[]; syntheticResponseKernel: readonly number[]; baselineAlreadyIncludesTheseImpulseEffects: boolean }) {
  const { baselineLevels: b, fiscalImpulses: s, syntheticResponseKernel: k } = input;
  if (!b.length || b.length !== s.length || !k.length || !finite(...b, ...s, ...k) || b.some((value) => value <= 0) || typeof input.baselineAlreadyIncludesTheseImpulseEffects !== 'boolean' || input.baselineAlreadyIncludesTheseImpulseEffects) return null;
  const outputDifferences = b.map((_, t) => s.slice(0, t + 1).reduce((sum, shock, j) => sum + shock * (k[t - j] ?? 0), 0));
  const withPolicyLevels = b.map((value, i) => value + outputDifferences[i]);
  if (!finite(...outputDifferences, ...withPolicyLevels) || withPolicyLevels.some((value) => value <= 0)) return null;
  const growthDifferencePercentagePoints = b.map((_, i) => i === 0 ? null : 100 * (withPolicyLevels[i] / withPolicyLevels[i - 1] - b[i] / b[i - 1]));
  if (growthDifferencePercentagePoints.some((value) => value !== null && !Number.isFinite(value))) return null;
  return { outputDifferences, withPolicyLevels, growthDifferencePercentagePoints, tailContract: 'kernel-zero-after-explicitly-declared-last-lag', estimatedKernel: false, forecastStatus: 'synthetic-not-forecast' };
}

export function fiscalCapacityDiagnostic(input: { requestedAdditionalRealDomesticOutput: number; declaredAdditionalRealDomesticCapacity: number }) {
  if (!nonnegative(...Object.values(input))) return null;
  return { incompatibleTeachingDemand: input.requestedAdditionalRealDomesticOutput > input.declaredAdditionalRealDomesticCapacity, capacityGap: Math.max(0, input.requestedAdditionalRealDomesticOutput - input.declaredAdditionalRealDomesticCapacity), actualOutput: null, inflation: null, imports: null, privateCrowdingOut: null, status: 'diagnostic-only-requires-price-resource-and-trade-model-not-min-demand-capacity-estimate' };
}

export const fiscalC1 = { deliveredPurchaseChange: 10, cashTransferChange: 0, taxRevenueChange: 0, observedPrivateConsumptionChange: 0, observedPrivateInvestmentChange: 0, observedExportChange: 0, observedImportChange: 0 } as const;
export const fiscalC2: readonly FiscalTransferGroup[] = [{ id: 'constrained', households: 40, perHouseholdTransfer: 1, syntheticConsumptionShare: 0.7, syntheticDebtRepaymentShare: 0.2 }, { id: 'liquid', households: 60, perHouseholdTransfer: 1, syntheticConsumptionShare: 0.3, syntheticDebtRepaymentShare: 0.1 }];
export const fiscalC3 = { baselineIncome: 100, currentIncome: 90, unchangedTaxRate: 0.2, baselineTransfer: 0, automaticTransferIncrease: 3, discretionaryTransferIncrease: 0 } as const;
export const fiscalC4 = { initialGovernmentPurchase: 10, initialTaxCut: 0, consumptionShare: 0.6, unchangedTaxRate: 0.2, importPerIncomeShare: 0.1, rounds: 4 } as const;
export const fiscalC5 = { spendingChanges: [10, 5, 0], realOutputChanges: [8, 7, 3], horizonIndex: 2 } as const;
export const fiscalC6 = { baselineLevels: [100, 102, 104, 106], fiscalImpulses: [10, 5, 0, 0], syntheticResponseKernel: [0.8, 0.5, 0.2], baselineAlreadyIncludesTheseImpulseEffects: false } as const;
export const fiscalC7 = { requestedAdditionalRealDomesticOutput: 10, declaredAdditionalRealDomesticCapacity: 6 } as const;
export const fiscalCanonicalResults = { c1: fiscalFirstRound(fiscalC1)!, c2: fiscalTransferUses(fiscalC2)!, c3: fiscalAutomaticRule(fiscalC3)!, c4: fiscalTeachingLoop(fiscalC4)!, c5: fiscalPathMultipliers(fiscalC5)!, c6: fiscalResponseConvolution(fiscalC6)!, c7: fiscalCapacityDiagnostic(fiscalC7)! };
const audit = (key: string, passed: boolean) => ({ key, passed });
export const fiscalFixtureAudit = [
  audit('C1 delivered purchase enters declared accounting, transfer does not directly enter GDP', fiscalCanonicalResults.c1.outputAccountingChange === 10 && fiscalFirstRound({ ...fiscalC1, deliveredPurchaseChange: 0, cashTransferChange: 10, observedPrivateConsumptionChange: 6 })?.outputAccountingChange === 6 && fiscalCanonicalResults.c1.primaryDeficitChange === 10),
  audit('C1 declared imported purchase offsets same-period gross purchase', fiscalFirstRound({ ...fiscalC1, observedImportChange: 10 })?.outputAccountingChange === 0),
  audit('C2 uses close: 100 transfer, 46 consumption, 14 principal repayment, 40 financial asset accumulation', near(fiscalCanonicalResults.c2.transfer, 100) && near(fiscalCanonicalResults.c2.consumption, 46) && near(fiscalCanonicalResults.c2.debtRepayment, 14) && near(fiscalCanonicalResults.c2.financialAssetAccumulation, 40) && fiscalCanonicalResults.c2.budgetClosed),
  audit('C2 invalid budget shares and zero-household group even in mixed population rejected', fiscalTransferUses([{ ...fiscalC2[0], syntheticConsumptionShare: 0.9, syntheticDebtRepaymentShare: 0.2 }]) === null && fiscalTransferUses([{ ...fiscalC2[0], households: 0 }, fiscalC2[1]]) === null),
  audit('C3 unchanged rules give automatic five, no discretionary impulse', fiscalCanonicalResults.c3.baselineTax === 20 && fiscalCanonicalResults.c3.currentTax === 18 && fiscalCanonicalResults.c3.automaticDeficitIncrease === 5 && fiscalCanonicalResults.c3.noNewPolicyDisposable === 75 && fiscalCanonicalResults.c3.discretionaryImpulse === 0),
  audit('C3 extra legislated transfer is separate two, not full deficit movement', fiscalAutomaticRule({ ...fiscalC3, discretionaryTransferIncrease: 2 })?.discretionaryImpulse === 2 && fiscalAutomaticRule({ ...fiscalC3, discretionaryTransferIncrease: 2 })?.withNewPolicyDisposable === 77),
  audit('C4 finite four-round geometric loop and infinite limit differ', near(fiscalCanonicalResults.c4.q, 0.38) && near(fiscalCanonicalResults.c4.finiteRoundTeachingOutput, 15.79272) && near(fiscalCanonicalResults.c4.infiniteTeachingOutput, 10 / 0.62)),
  audit('C4 zero feedback, tax-cut first round and unstable loop handled', fiscalTeachingLoop({ ...fiscalC4, consumptionShare: 0, importPerIncomeShare: 0 })?.finiteRoundTeachingOutput === 10 && fiscalTeachingLoop({ ...fiscalC4, initialGovernmentPurchase: 0, initialTaxCut: 10 })?.firstRound === 6 && fiscalTeachingLoop({ ...fiscalC4, consumptionShare: 1, unchangedTaxRate: 0, importPerIncomeShare: 0 }) === null),
  audit('C5 impact .8, horizon .3 and cumulative 1.2 use different denominators/windows', fiscalCanonicalResults.c5.impactRatio === 0.8 && fiscalCanonicalResults.c5.horizonRatio === 0.3 && fiscalCanonicalResults.c5.cumulativeRatio === 1.2),
  audit('C5 zero denominators return null, not zero multiplier', fiscalPathMultipliers({ ...fiscalC5, spendingChanges: [0, 0, 0] })?.impactRatio === null && fiscalPathMultipliers({ ...fiscalC5, spendingChanges: [10, -10, 0] })?.cumulativeRatio === null),
  audit('C5 selected cumulative window does not include later periods', fiscalPathMultipliers({ ...fiscalC5, horizonIndex: 0 })?.cumulativeRatio === 0.8 && fiscalPathMultipliers({ ...fiscalC5, horizonIndex: 0 })?.totalSpendingChange === 10),
  audit('C6 all lagged impulses overlap as 8,9,4.5,1', fiscalCanonicalResults.c6.outputDifferences.every((value, i) => near(value, [8, 9, 4.5, 1][i]))),
  audit('C6 a baseline with already included effects rejects double count', fiscalResponseConvolution({ ...fiscalC6, baselineAlreadyIncludesTheseImpulseEffects: true }) === null && fiscalCanonicalResults.c6.growthDifferencePercentagePoints[0] === null),
  audit('C7 capacity mismatch is diagnostic, price/trade/output unknown', fiscalCanonicalResults.c7.incompatibleTeachingDemand && fiscalCanonicalResults.c7.capacityGap === 4 && fiscalCanonicalResults.c7.actualOutput === null && fiscalCanonicalResults.c7.inflation === null),
  audit('C1 signed fiscal differences distinguish tax cuts from tax levels', fiscalFirstRound({ ...fiscalC1, deliveredPurchaseChange: 0, taxRevenueChange: -10 })?.primaryDeficitChange === 10 && fiscalFirstRound({ ...fiscalC1, deliveredPurchaseChange: -10 })?.outputAccountingChange === -10),
  audit('nonfinite inputs, mismatched periods and invalid horizons rejected', fiscalFirstRound({ ...fiscalC1, deliveredPurchaseChange: NaN }) === null && fiscalAutomaticRule({ ...fiscalC3, unchangedTaxRate: 2 }) === null && fiscalPathMultipliers({ ...fiscalC5, horizonIndex: 3 }) === null && fiscalResponseConvolution({ ...fiscalC6, fiscalImpulses: [10] }) === null && fiscalCapacityDiagnostic({ ...fiscalC7, requestedAdditionalRealDomesticOutput: Infinity }) === null),
  audit('C4 analytic geometric tail remains nonnegative at 10000 rounds', (fiscalTeachingLoop({ ...fiscalC4, rounds: 10000 })?.remainingTeachingTail ?? -1) >= 0 && !Object.is(fiscalTeachingLoop({ ...fiscalC4, rounds: 10000 })?.remainingTeachingTail, -0)),
  audit('C2 unsafe individual or aggregate household counts rejected', fiscalTransferUses([{ ...fiscalC2[0], households: Number.MAX_SAFE_INTEGER + 1 }]) === null && fiscalTransferUses([{ ...fiscalC2[0], households: Number.MAX_SAFE_INTEGER }, fiscalC2[1]]) === null),
] as const;
if (fiscalFixtureAudit.some(({ passed }) => !passed)) throw new Error(`3.17 preparation fixture: ${fiscalFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key).join('; ')}`);
