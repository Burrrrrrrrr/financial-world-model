/** Pure, nominal, synthetic household arithmetic. No national-index or empirical coefficient enters these calculators. */
export type HousingAmounts = { price: number; firstLien: number; secondLien: number; cash: number };
const nonnegative = (...values: number[]) => values.every((value) => Number.isFinite(value) && value >= 0);
const positive = (...values: number[]) => values.every((value) => Number.isFinite(value) && value > 0);

export function housingEquity(input: HousingAmounts) {
  if (!positive(input.price) || !nonnegative(input.firstLien, input.secondLien, input.cash)) return null;
  const debt = input.firstLien + input.secondLien;
  return { debt, equity: input.price - debt, ltv: input.firstLien / input.price, cltv: debt / input.price, liquidCash: input.cash };
}

/** Fully amortizing, end-of-month, constant nominal P&I, no fees, arrears, tax or insurance. */
export function annuityFactor(monthlyRate: number, months: number) {
  if (!nonnegative(monthlyRate) || !Number.isInteger(months) || months <= 0 || months > 1200 || monthlyRate > 1) return null;
  if (monthlyRate === 0) return 1 / months;
  return monthlyRate / -Math.expm1(-months * Math.log1p(monthlyRate));
}

export type NewLoanInput = { price: number; maxLtv: number; paymentBudget: number; monthlyRate: number; months: number; cash: number; fees: number };
export function newLoanCapacity(input: NewLoanInput) {
  const factor = annuityFactor(input.monthlyRate, input.months);
  if (factor === null || !positive(input.price) || !nonnegative(input.maxLtv, input.paymentBudget, input.cash, input.fees) || input.maxLtv > 1) return null;
  const collateralCap = input.price * input.maxLtv;
  const paymentCap = input.paymentBudget / factor;
  const capacity = Math.min(collateralCap, paymentCap);
  const cashNeededAtCap = input.price - capacity + input.fees;
  return { factor, collateralCap, paymentCap, capacity, cashNeededAtCap, cashGapAtCap: Math.max(0, cashNeededAtCap - input.cash), feasibleAtCap: input.cash >= cashNeededAtCap, bindingGate: collateralCap < paymentCap ? 'collateral' : collateralCap > paymentCap ? 'payment' : 'both', approval: null, actualDraw: null };
}

export type CashOutInput = { capacity: number; approved: number; drawn: number; dischargedDebt: number; fees: number };
export function cashOutLedger(input: CashOutInput) {
  if (!nonnegative(input.capacity, input.approved, input.drawn, input.dischargedDebt, input.fees) || input.approved > input.capacity || input.drawn > input.approved) return null;
  const closingUses = input.dischargedDebt + input.fees;
  return { closingUses, cashOut: Math.max(0, input.drawn - closingUses), cashRequired: Math.max(0, closingUses - input.drawn), newDebt: input.drawn, oldDebtDischarged: input.dischargedDebt, netDebtIncrease: input.drawn - input.dischargedDebt };
}

export type PaymentInput = { principal: number; oldMonthlyRate: number; resetMonthlyRate: number; remainingMonths: number; resetDueNow: boolean; income: number; necessarySpending: number; taxInsurance: number };
export function paymentClocks(input: PaymentInput) {
  const oldFactor = annuityFactor(input.oldMonthlyRate, input.remainingMonths);
  const resetFactor = annuityFactor(input.resetMonthlyRate, input.remainingMonths);
  if (oldFactor === null || resetFactor === null || !nonnegative(input.principal, input.income, input.necessarySpending, input.taxInsurance)) return null;
  const fixedPi = input.principal * oldFactor;
  const hypotheticalResetPi = input.principal * resetFactor;
  const currentArmPi = input.resetDueNow ? hypotheticalResetPi : fixedPi;
  return { fixedPi, hypotheticalResetPi, currentArmPi, fixedTotalHousingPayment: fixedPi + input.taxInsurance, fixedMonthlySurplus: input.income - input.necessarySpending - input.taxInsurance - fixedPi, armMonthlySurplus: input.income - input.necessarySpending - input.taxInsurance - currentArmPi, priceTriggeredFixedPaymentChange: 0 };
}

export type StressInput = { price: number; debt: number; income: number; necessarySpending: number; pi: number; cash: number; months: number };
export function housingStress(input: StressInput) {
  if (!positive(input.price) || !nonnegative(input.debt, input.income, input.necessarySpending, input.pi, input.cash) || !Number.isInteger(input.months) || input.months <= 0 || input.months > 1200) return null;
  const monthlyBalance = input.income - input.necessarySpending - input.pi;
  const monthlyGap = Math.max(0, -monthlyBalance);
  const windowGapBeforeCash = monthlyGap * input.months;
  return { equity: input.price - input.debt, negativeEquity: input.price < input.debt, monthlyBalance, monthlyGap, cashRunwayMonths: monthlyGap > 0 ? input.cash / monthlyGap : null, windowGapBeforeCash, unfundedWindowGap: Math.max(0, windowGapBeforeCash - input.cash), delinquency: null, default: null, foreclosure: null, status: 'budget-state-not-default-prediction' };
}

export type SaleInput = { salePrice: number; saleCosts: number; seniorClaim: number; juniorClaim: number };
export function recoveryWaterfall(input: SaleInput) {
  if (!nonnegative(input.salePrice, input.saleCosts, input.seniorClaim, input.juniorClaim) || input.saleCosts > input.salePrice) return null;
  const netProceeds = input.salePrice - input.saleCosts;
  const seniorRecovery = Math.min(input.seniorClaim, netProceeds);
  const juniorRecovery = Math.min(input.juniorClaim, Math.max(0, netProceeds - seniorRecovery));
  const ownerResidual = netProceeds - seniorRecovery - juniorRecovery;
  return { netProceeds, seniorRecovery, juniorRecovery, ownerResidual, seniorUnrecovered: input.seniorClaim - seniorRecovery, juniorUnrecovered: input.juniorClaim - juniorRecovery, deficiencyLegallyCollectible: null, finalCreditorLoss: null, priority: 'declared-teaching-senior-then-junior-not-jurisdiction-law' };
}

export type SpendingGroup = { id: string; households: number; perHouseholdValueShock: number; syntheticResponse: number };
export function spendingAggregation(groups: readonly SpendingGroup[]) {
  if (groups.length === 0 || groups.some((group) => !group.id || !Number.isInteger(group.households) || group.households <= 0 || !Number.isFinite(group.perHouseholdValueShock) || !nonnegative(group.syntheticResponse) || group.syntheticResponse > 1) || new Set(groups.map(({ id }) => id)).size !== groups.length) return null;
  const households = groups.reduce((sum, group) => sum + group.households, 0);
  const totalValueShock = groups.reduce((sum, group) => sum + group.households * group.perHouseholdValueShock, 0);
  const totalSpendingChange = groups.reduce((sum, group) => sum + group.households * group.perHouseholdValueShock * group.syntheticResponse, 0);
  return { households, totalValueShock, totalSpendingChange, perHouseholdSpendingChange: totalSpendingChange / households, aggregateResponseRatio: totalValueShock === 0 ? null : totalSpendingChange / totalValueShock, unweightedResponseMean: groups.reduce((sum, group) => sum + group.syntheticResponse, 0) / groups.length, nationalMultiplier: null, causalEstimate: null };
}

export const housingC1 = { price: 100, firstLien: 70, secondLien: 10, cash: 5 } as const;
export const housingC2 = { price: 100, maxLtv: 0.8, paymentBudget: 0.45, monthlyRate: 0.005, months: 240, cash: 25, fees: 2 } as const;
export const housingC3 = { capacity: 90, approved: 85, drawn: 85, dischargedDebt: 75, fees: 2 } as const;
export const housingC4 = { principal: 70, oldMonthlyRate: 0.004, resetMonthlyRate: 0.006, remainingMonths: 240, resetDueNow: false, income: 2, necessarySpending: 1, taxInsurance: 0.1 } as const;
export const housingC5 = { price: 70, debt: 80, income: 1.2, necessarySpending: 1, pi: 0.6, cash: 3, months: 12 } as const;
export const housingC6 = { salePrice: 60, saleCosts: 3, seniorClaim: 50, juniorClaim: 20 } as const;
export const housingC7: readonly SpendingGroup[] = [
  { id: 'liquid-owner', households: 40, perHouseholdValueShock: -10, syntheticResponse: 0.02 },
  { id: 'constrained-owner', households: 40, perHouseholdValueShock: -5, syntheticResponse: 0.06 },
  { id: 'renter-with-no-house-exposure', households: 20, perHouseholdValueShock: 0, syntheticResponse: 0 },
];
export const housingCanonicalResults = {
  c1: housingEquity(housingC1)!, c2: newLoanCapacity(housingC2)!, c3: cashOutLedger(housingC3)!,
  c4: paymentClocks(housingC4)!, c5: housingStress(housingC5)!, c6: recoveryWaterfall(housingC6)!, c7: spendingAggregation(housingC7)!,
};
const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const audit = (key: string, passed: boolean) => ({ key, passed });
export const housingFixtureAudit = [
  audit('C1 includes both liens but excludes liquid cash from housing equity', housingCanonicalResults.c1.equity === 20 && housingCanonicalResults.c1.debt === 80 && housingCanonicalResults.c1.cltv === 0.8 && housingCanonicalResults.c1.liquidCash === 5),
  audit('C1 invalid price and negative debt STOP; underwater value preserved', housingEquity({ ...housingC1, price: 0 }) === null && housingEquity({ ...housingC1, secondLien: -1 }) === null && housingEquity({ ...housingC1, price: 60 })?.equity === -20),
  audit('annuity zero rate, one period and invalid period domains', annuityFactor(0, 240) === 1 / 240 && near(annuityFactor(0.005, 1)!, 1.005) && annuityFactor(-0.01, 240) === null && annuityFactor(0.005, 2.5) === null),
  audit('C2 binding payment cap and closing cash gap computed independently', housingCanonicalResults.c2.bindingGate === 'payment' && near(housingCanonicalResults.c2.paymentCap, 62.81134725731812) && near(housingCanonicalResults.c2.cashGapAtCap, 14.188652742681882) && !housingCanonicalResults.c2.feasibleAtCap),
  audit('C2 capacity is not approval or actual draw; synthetic LTV above one rejected', housingCanonicalResults.c2.approval === null && housingCanonicalResults.c2.actualDraw === null && newLoanCapacity({ ...housingC2, maxLtv: 1.1 }) === null),
  audit('C3 cash-out eight; final debt eighty-five; net increase ten', housingCanonicalResults.c3.cashOut === 8 && housingCanonicalResults.c3.newDebt === 85 && housingCanonicalResults.c3.netDebtIncrease === 10 && housingCanonicalResults.c3.cashRequired === 0),
  audit('C3 partial draw cannot fund closing; impossible approval and draw rejected', cashOutLedger({ ...housingC3, drawn: 70 })?.cashRequired === 7 && cashOutLedger({ ...housingC3, approved: 95 }) === null && cashOutLedger({ ...housingC3, drawn: 86 }) === null),
  audit('C4 FRM ignores price; ARM only resets on declared date; same principal and horizon', housingCanonicalResults.c4.priceTriggeredFixedPaymentChange === 0 && housingCanonicalResults.c4.currentArmPi === housingCanonicalResults.c4.fixedPi && paymentClocks({ ...housingC4, resetDueNow: true })?.currentArmPi === housingCanonicalResults.c4.hypotheticalResetPi),
  audit('C5 negative equity plus twelve-month cash deficit is not observed default', housingCanonicalResults.c5.equity === -10 && near(housingCanonicalResults.c5.monthlyGap, 0.4) && near(housingCanonicalResults.c5.cashRunwayMonths!, 7.5) && near(housingCanonicalResults.c5.unfundedWindowGap, 1.8) && housingCanonicalResults.c5.default === null),
  audit('C5 negative equity with healthy cash flow and positive equity with cash stress remain distinct', housingStress({ ...housingC5, income: 2 })?.negativeEquity === true && housingStress({ ...housingC5, income: 2 })?.cashRunwayMonths === null && housingStress({ ...housingC5, price: 100 })?.negativeEquity === false && near(housingStress({ ...housingC5, price: 100 })!.monthlyGap, 0.4)),
  audit('C6 costs first; senior fifty junior seven; uncollected deficiency thirteen is not legal loss', housingCanonicalResults.c6.netProceeds === 57 && housingCanonicalResults.c6.seniorRecovery === 50 && housingCanonicalResults.c6.juniorRecovery === 7 && housingCanonicalResults.c6.juniorUnrecovered === 13 && housingCanonicalResults.c6.finalCreditorLoss === null),
  audit('C6 conservation, positive owner residual and infeasible costs', housingCanonicalResults.c6.netProceeds === housingCanonicalResults.c6.seniorRecovery + housingCanonicalResults.c6.juniorRecovery + housingCanonicalResults.c6.ownerResidual && recoveryWaterfall({ ...housingC6, salePrice: 100 })?.ownerResidual === 27 && recoveryWaterfall({ ...housingC6, saleCosts: 61 }) === null),
  audit('C7 weights household shock times registered synthetic response; no causal estimate', housingCanonicalResults.c7.households === 100 && housingCanonicalResults.c7.totalValueShock === -600 && housingCanonicalResults.c7.totalSpendingChange === -20 && near(housingCanonicalResults.c7.aggregateResponseRatio!, 1 / 30) && housingCanonicalResults.c7.causalEstimate === null),
  audit('C7 zero shock returns missing ratio, not zero; duplicate groups and negative weights STOP', spendingAggregation([{ id: 'renter', households: 10, perHouseholdValueShock: 0, syntheticResponse: 0 }])?.aggregateResponseRatio === null && spendingAggregation([housingC7[0], housingC7[0]]) === null && spendingAggregation([{ ...housingC7[0], households: -1 }]) === null),
] as const;
if (housingFixtureAudit.some(({ passed }) => !passed)) throw new Error(`3.16 fixture audit: ${housingFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key).join('; ')}`);
