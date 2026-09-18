export type SellerSector = 'resident-nonbank' | 'bank' | 'nonresident';
export type MoneyPassportIssuer = 'bank' | 'central-bank' | 'nonbank';
export type MoneyPassportHolder = 'resident-money-holder' | 'bank' | 'government' | 'nonresident';
export type MoneyPassportInstrument = 'deposit' | 'reserve' | 'bond';
export type EligibilityStatus = 'included' | 'excluded' | 'unknown';
export type ReplayLedgerSide = 'asset' | 'liability' | 'equity';

export type ReplayLedgerPosition = {
  positionId: string;
  entityId: string;
  account: string;
  side: ReplayLedgerSide;
  claimId: string | null;
  counterpartyEntityId: string | null;
  amount: number | null;
  currency: string | null;
  measurementBasis: string | null;
  asOf: string | null;
};

export type ReplayLedgerPosting = {
  postingId: string;
  postingSequence: number;
  positionId: string;
  entityId: string;
  account: string;
  side: ReplayLedgerSide;
  claimId: string | null;
  counterpartyEntityId: string | null;
  signedAmount: number;
  currency: string;
  measurementBasis: string;
  effectiveAt: string;
};

export type ReplayLedgerEvent = {
  eventId: string;
  ledgerSequence: number;
  status: 'proposed' | 'committed' | 'posted' | 'final' | 'cancelled' | 'failed';
  applyRuleVersion: string | null;
  postings: ReplayLedgerPosting[];
};

export function finiteNonNegative(...values: number[]) {
  return values.every((value) => Number.isFinite(value) && value >= 0);
}

export function replayBankCreditLedger(openingPositions: ReplayLedgerPosition[], eventLedger: ReplayLedgerEvent[]) {
  const errors: string[] = [];
  const positions = new Map<string, ReplayLedgerPosition>();
  openingPositions.forEach((position) => {
    if (positions.has(position.positionId)) errors.push(`duplicate-opening-position:${position.positionId}`);
    if (typeof position.amount !== 'number' || !finiteNonNegative(position.amount)) errors.push(`invalid-opening-amount:${position.positionId}`);
    positions.set(position.positionId, { ...position });
  });

  const eventSequences = new Set<number>();
  const orderedEvents = [...eventLedger].sort((a, b) => a.ledgerSequence - b.ledgerSequence || a.eventId.localeCompare(b.eventId));
  orderedEvents.forEach((event) => {
    if (!Number.isSafeInteger(event.ledgerSequence) || event.ledgerSequence < 1 || eventSequences.has(event.ledgerSequence)) errors.push(`invalid-event-sequence:${event.eventId}`);
    eventSequences.add(event.ledgerSequence);
    const applies = event.status === 'posted' || event.status === 'final';
    if (!applies && event.postings.length > 0) errors.push(`non-posted-event-has-postings:${event.eventId}`);
    if (!applies) return;
    if (event.applyRuleVersion !== 'bank-credit-ledger-v1') errors.push(`unsupported-apply-rule:${event.eventId}`);

    const postingSequences = new Set<number>();
    [...event.postings].sort((a, b) => a.postingSequence - b.postingSequence || a.postingId.localeCompare(b.postingId)).forEach((posting) => {
      if (!Number.isSafeInteger(posting.postingSequence) || posting.postingSequence < 1 || postingSequences.has(posting.postingSequence)) errors.push(`invalid-posting-sequence:${posting.postingId}`);
      postingSequences.add(posting.postingSequence);
      const position = positions.get(posting.positionId);
      if (!position) { errors.push(`missing-position:${posting.positionId}`); return; }
      if (position.entityId !== posting.entityId || position.account !== posting.account || position.side !== posting.side || position.claimId !== posting.claimId || position.counterpartyEntityId !== posting.counterpartyEntityId || position.currency !== posting.currency || position.measurementBasis !== posting.measurementBasis) {
        errors.push(`posting-identity-mismatch:${posting.postingId}`);
        return;
      }
      if (!Number.isFinite(posting.signedAmount) || typeof position.amount !== 'number') { errors.push(`invalid-posting-amount:${posting.postingId}`); return; }
      const closingAmount = position.amount + posting.signedAmount;
      if (!finiteNonNegative(closingAmount)) { errors.push(`negative-closing-position:${posting.positionId}`); return; }
      positions.set(posting.positionId, { ...position, amount: closingAmount, asOf: posting.effectiveAt });
    });
  });

  const closingPositions = [...positions.values()].sort((a, b) => a.positionId.localeCompare(b.positionId));
  const entityIds = [...new Set(closingPositions.map((position) => position.entityId))];
  const claimIds = [...new Set(closingPositions.map((position) => position.claimId).filter((claimId): claimId is string => claimId !== null))];
  const verticalResiduals = entityIds.map((entityId) => ({
    entityId,
    residual: closingPositions.filter((position) => position.entityId === entityId).reduce((sum, position) => sum + (position.side === 'asset' ? 1 : -1) * (position.amount ?? Number.NaN), 0),
  }));
  const horizontalResiduals = claimIds.map((claimId) => ({
    claimId,
    residual: closingPositions.filter((position) => position.claimId === claimId).reduce((sum, position) => sum + (position.side === 'asset' ? 1 : position.side === 'liability' ? -1 : 0) * (position.amount ?? Number.NaN), 0),
  }));
  const balanced = [...verticalResiduals, ...horizontalResiduals].every(({ residual }) => Number.isFinite(residual) && Math.abs(residual) <= 1e-9);
  return { closingPositions, appliedEventIds: orderedEvents.filter((event) => event.status === 'posted' || event.status === 'final').map((event) => event.eventId), verticalResiduals, horizontalResiduals, errors, passed: errors.length === 0 && balanced };
}

export const canonicalLoanDrawOpeningPositions: ReplayLedgerPosition[] = [
  { positionId: 'BANK_A_LOAN_ASSET', entityId: 'BANK_A', account: 'loan-principal', side: 'asset', claimId: 'CLAIM_LOAN_001', counterpartyEntityId: 'BORROWER_1', amount: 0, currency: 'SYN', measurementBasis: 'contract-principal', asOf: '2026-09-01T23:59:59Z' },
  { positionId: 'BORROWER_LOAN_LIABILITY', entityId: 'BORROWER_1', account: 'loan-payable', side: 'liability', claimId: 'CLAIM_LOAN_001', counterpartyEntityId: 'BANK_A', amount: 0, currency: 'SYN', measurementBasis: 'contract-principal', asOf: '2026-09-01T23:59:59Z' },
  { positionId: 'BORROWER_DEPOSIT_ASSET', entityId: 'BORROWER_1', account: 'transaction-deposit', side: 'asset', claimId: 'CLAIM_DEPOSIT_001', counterpartyEntityId: 'BANK_A', amount: 0, currency: 'SYN', measurementBasis: 'nominal-value', asOf: '2026-09-01T23:59:59Z' },
  { positionId: 'BANK_A_DEPOSIT_LIABILITY', entityId: 'BANK_A', account: 'transaction-deposit', side: 'liability', claimId: 'CLAIM_DEPOSIT_001', counterpartyEntityId: 'BORROWER_1', amount: 0, currency: 'SYN', measurementBasis: 'nominal-value', asOf: '2026-09-01T23:59:59Z' },
];

export const canonicalLoanDrawReplayEvent: ReplayLedgerEvent = {
  eventId: 'EVT_DRAW_001',
  ledgerSequence: 1,
  status: 'final',
  applyRuleVersion: 'bank-credit-ledger-v1',
  postings: [
    { postingId: 'POST_DRAW_001_01', postingSequence: 1, positionId: 'BANK_A_LOAN_ASSET', entityId: 'BANK_A', account: 'loan-principal', side: 'asset', claimId: 'CLAIM_LOAN_001', counterpartyEntityId: 'BORROWER_1', signedAmount: 100, currency: 'SYN', measurementBasis: 'contract-principal', effectiveAt: '2026-09-02T00:00:00Z' },
    { postingId: 'POST_DRAW_001_02', postingSequence: 2, positionId: 'BORROWER_LOAN_LIABILITY', entityId: 'BORROWER_1', account: 'loan-payable', side: 'liability', claimId: 'CLAIM_LOAN_001', counterpartyEntityId: 'BANK_A', signedAmount: 100, currency: 'SYN', measurementBasis: 'contract-principal', effectiveAt: '2026-09-02T00:00:00Z' },
    { postingId: 'POST_DRAW_001_03', postingSequence: 3, positionId: 'BORROWER_DEPOSIT_ASSET', entityId: 'BORROWER_1', account: 'transaction-deposit', side: 'asset', claimId: 'CLAIM_DEPOSIT_001', counterpartyEntityId: 'BANK_A', signedAmount: 100, currency: 'SYN', measurementBasis: 'nominal-value', effectiveAt: '2026-09-02T00:00:00Z' },
    { postingId: 'POST_DRAW_001_04', postingSequence: 4, positionId: 'BANK_A_DEPOSIT_LIABILITY', entityId: 'BANK_A', account: 'transaction-deposit', side: 'liability', claimId: 'CLAIM_DEPOSIT_001', counterpartyEntityId: 'BORROWER_1', signedAmount: 100, currency: 'SYN', measurementBasis: 'nominal-value', effectiveAt: '2026-09-02T00:00:00Z' },
  ],
};

export const canonicalLoanDrawReplayResult = replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [canonicalLoanDrawReplayEvent]);

export function onUsLoanMetrics(amount: number, moneyEligibility: EligibilityStatus) {
  if (!finiteNonNegative(amount)) return null;
  return {
    bankLoanAsset: amount,
    bankDepositLiability: amount,
    bankReserveChange: 0,
    bankEquityChange: 0,
    borrowerDepositAsset: amount,
    borrowerLoanLiability: amount,
    borrowerNetWorthChange: 0,
    broadMoneyChange: moneyEligibility === 'included' ? amount : moneyEligibility === 'excluded' ? 0 : null,
    monetaryBaseChange: 0,
  };
}

export function crossBankPaymentMetrics(amount: number, payerReserveBefore = amount) {
  if (!finiteNonNegative(amount, payerReserveBefore) || amount > payerReserveBefore) return null;
  return {
    payerBankReserveChange: -amount,
    payerBankDepositChange: -amount,
    payeeBankReserveChange: amount,
    payeeBankDepositChange: amount,
    payerReserveAfter: payerReserveBefore - amount,
    systemReserveChange: 0,
    systemDepositChange: 0,
  };
}

export function onUsDepositPaymentMetrics(amount: number, payerEligibility: EligibilityStatus, payeeEligibility: EligibilityStatus) {
  if (!finiteNonNegative(amount)) return null;
  const payerWeight = payerEligibility === 'included' ? 1 : payerEligibility === 'excluded' ? 0 : null;
  const payeeWeight = payeeEligibility === 'included' ? 1 : payeeEligibility === 'excluded' ? 0 : null;
  return {
    payerDepositChange: -amount,
    payeeDepositChange: amount,
    bankDepositTotalChange: 0,
    bankReserveChange: 0,
    broadMoneyChange: payerWeight === null || payeeWeight === null ? null : (payeeWeight - payerWeight) * amount,
  };
}

export function bilateralNetSettlement(aToB: number, bToA: number) {
  if (!finiteNonNegative(aToB, bToA)) return null;
  const netAtoB = aToB - bToA;
  return { grossPayments: aToB + bToA, netAtoB, netSettlementObligation: Math.abs(netAtoB), grossObligationReduction: aToB + bToA - Math.abs(netAtoB), customerTransactionsDeleted: false };
}

export function crossBankSettlementBalances(amount: number, payerReserveBefore: number, payeeReserveBefore: number) {
  const changes = crossBankPaymentMetrics(amount, payerReserveBefore);
  if (!changes || !finiteNonNegative(payeeReserveBefore)) return null;
  return {
    ...changes,
    payeeReserveAfter: payeeReserveBefore + amount,
    systemReserveBefore: payerReserveBefore + payeeReserveBefore,
    systemReserveAfter: changes.payerReserveAfter + payeeReserveBefore + amount,
    loanMigrates: false,
  };
}

export function refinancingMetrics(grossOrigination: number, grossRepayment: number, repaymentUsesInScopeBankDeposit: boolean) {
  if (!finiteNonNegative(grossOrigination, grossRepayment)) return null;
  return {
    grossOrigination,
    grossRepayment,
    netLoanChange: grossOrigination - grossRepayment,
    netDepositChange: repaymentUsesInScopeBankDeposit ? grossOrigination - grossRepayment : null,
  };
}

export function overdraftDrawMetrics(limit: number, outstandingBefore: number, depositBefore: number, payment: number) {
  if (!finiteNonNegative(limit, outstandingBefore, depositBefore, payment) || outstandingBefore > limit) return null;
  const newDraw = Math.max(0, payment - depositBefore);
  if (newDraw > limit - outstandingBefore) return null;
  const loanBalanceAfter = outstandingBefore + newDraw;
  return { newDraw, loanBalanceAfter, unusedCommitmentAfter: limit - loanBalanceAfter };
}

export function settlementFundingMetrics(netOutflow: number, availableReserves: number, source: 'interbank' | 'central-bank') {
  if (!finiteNonNegative(netOutflow, availableReserves)) return null;
  const shortfall = Math.max(0, netOutflow - availableReserves);
  return {
    shortfall,
    bankReserveChange: shortfall,
    bankFundingLiabilityChange: shortfall,
    systemReserveChange: source === 'central-bank' ? shortfall : 0,
    monetaryBaseChange: source === 'central-bank' ? shortfall : 0,
    broadMoneyChange: 0,
  };
}

export function depositCashConversionMetrics(amount: number, aggregateIncludesPublicCurrency = true) {
  if (!finiteNonNegative(amount)) return null;
  return { depositChange: -amount, publicCurrencyChange: amount, loanChange: 0, broadMoneyChange: aggregateIncludesPublicCurrency ? 0 : -amount };
}

export function principalRepaymentMetrics(amount: number, moneyEligibility: EligibilityStatus) {
  if (!finiteNonNegative(amount)) return null;
  return { loanChange: -amount, depositChange: -amount, reserveSystemChange: 0, broadMoneyChange: moneyEligibility === 'included' ? -amount : moneyEligibility === 'excluded' ? 0 : null, bankEquityChange: 0 };
}

export function interestMetrics(amount: number) {
  if (!finiteNonNegative(amount)) return null;
  return {
    accrual: { accruedInterestChange: amount, bankEquityChange: amount, depositChange: 0, principalChange: 0 },
    paymentAfterAccrual: { accruedInterestChange: -amount, depositChange: -amount, bankEquityChange: 0, principalChange: 0 },
  };
}

export function allowanceMetrics(grossLoan: number, openingAllowance: number, closingAllowance: number) {
  if (!finiteNonNegative(grossLoan, openingAllowance, closingAllowance) || openingAllowance > grossLoan || closingAllowance > grossLoan) return null;
  const allowanceIncrease = closingAllowance - openingAllowance;
  return { grossLoan, openingNetLoan: grossLoan - openingAllowance, closingNetLoan: grossLoan - closingAllowance, allowanceIncrease, pretaxProfitChange: -allowanceIncrease, equityChangeIgnoringTaxAndOtherEntries: -allowanceIncrease, depositChange: 0 };
}

export function coveredWriteOffMetrics(grossLoan: number, allowance: number, writeOff: number) {
  if (!finiteNonNegative(grossLoan, allowance, writeOff) || allowance > grossLoan || writeOff > grossLoan) return null;
  const allowanceUsed = Math.min(allowance, writeOff);
  const additionalLoss = writeOff - allowanceUsed;
  return {
    grossLoanAfter: grossLoan - writeOff,
    allowanceAfter: allowance - allowanceUsed,
    netLoanBefore: grossLoan - allowance,
    netLoanAfter: grossLoan - writeOff - (allowance - allowanceUsed),
    additionalLoss,
    depositChange: 0,
  };
}

export function bankSecurityTradeMetrics(amount: number, direction: 'buy-from-resident-nonbank' | 'sell-to-resident-nonbank' | 'interbank') {
  if (!finiteNonNegative(amount)) return null;
  if (direction === 'buy-from-resident-nonbank') return { securitiesChange: amount, broadMoneyChange: amount, monetaryBaseChange: 0, systemReserveChange: 0 };
  if (direction === 'sell-to-resident-nonbank') return { securitiesChange: -amount, broadMoneyChange: -amount, monetaryBaseChange: 0, systemReserveChange: 0 };
  return { securitiesChange: 0, broadMoneyChange: 0, monetaryBaseChange: 0, systemReserveChange: 0 };
}

export function fiscalSettlementMetrics(tax: number, spending: number, governmentAccount: 'central-bank' | 'commercial-bank' = 'central-bank') {
  if (!finiteNonNegative(tax, spending)) return null;
  return {
    taxBroadMoneyChange: -tax,
    taxBaseChange: governmentAccount === 'central-bank' ? -tax : 0,
    spendingBroadMoneyChange: spending,
    spendingBaseChange: governmentAccount === 'central-bank' ? spending : 0,
    combinedBroadMoneyChange: spending - tax,
    combinedBaseChange: governmentAccount === 'central-bank' ? spending - tax : 0,
  };
}

export function centralBankPurchaseMetrics(amount: number, sellerSector: SellerSector) {
  if (!finiteNonNegative(amount)) return null;
  return { monetaryBaseChange: amount, broadMoneyChange: sellerSector === 'resident-nonbank' ? amount : 0, sellerSector };
}

export function centralBankLoanMetrics(amount: number) {
  if (!finiteNonNegative(amount)) return null;
  return { monetaryBaseChange: amount, broadMoneyChange: 0, bankEquityChange: 0, bankReserveChange: amount, centralBankBorrowingChange: amount };
}

export function moneyPassportEligibility(issuer: MoneyPassportIssuer, holder: MoneyPassportHolder, instrument: MoneyPassportInstrument): { broadMoney: EligibilityStatus; monetaryBase: EligibilityStatus } {
  const broadMoney: EligibilityStatus = issuer === 'bank' && holder === 'resident-money-holder' && instrument === 'deposit'
    ? 'included'
    : holder !== 'resident-money-holder' || instrument === 'reserve'
      ? 'excluded'
      : 'unknown';
  const monetaryBase: EligibilityStatus = issuer !== 'central-bank'
    ? 'excluded'
    : holder === 'bank' && instrument === 'reserve'
      ? 'included'
      : holder === 'government'
        ? 'excluded'
        : 'unknown';
  return { broadMoney, monetaryBase };
}

export function observedMoneyBaseRatio(broadMoney: number, monetaryBase: number) {
  if (!finiteNonNegative(broadMoney, monetaryBase) || monetaryBase === 0) return null;
  return broadMoney / monetaryBase;
}

export function moneyBaseTransitionMetrics(broadMoneyBefore: number, baseBefore: number, broadMoneyAfter: number, baseAfter: number) {
  const initialRatio = observedMoneyBaseRatio(broadMoneyBefore, baseBefore);
  const finalRatio = observedMoneyBaseRatio(broadMoneyAfter, baseAfter);
  if (initialRatio === null || finalRatio === null || broadMoneyBefore === 0) return null;
  return {
    initialRatio,
    finalRatio,
    ratioChangePct: initialRatio === 0 ? null : (finalRatio / initialRatio - 1) * 100,
    broadMoneyGrowthPct: (broadMoneyAfter / broadMoneyBefore - 1) * 100,
    isCausalMultiplier: false,
  };
}

export function prudentialMetrics(input: { cet1: number; tier1: number; tier2: number; rwa: number; leverageExposure: number; hqla: number; outflows: number; inflows: number; asf: number; rsf: number; connectedExposure: number }) {
  const { cet1, tier1, tier2, rwa, leverageExposure, hqla, outflows, inflows, asf, rsf, connectedExposure } = input;
  if (!finiteNonNegative(cet1, tier1, tier2, rwa, leverageExposure, hqla, outflows, inflows, asf, rsf, connectedExposure) || rwa === 0 || leverageExposure === 0 || rsf === 0 || tier1 === 0) return null;
  const inflowCap = 0.75 * outflows;
  const netOutflow = outflows - Math.min(inflows, inflowCap);
  return {
    cet1RatioPct: cet1 / rwa * 100,
    tier1RatioPct: tier1 / rwa * 100,
    totalCapitalRatioPct: (tier1 + tier2) / rwa * 100,
    leverageRatioPct: tier1 / leverageExposure * 100,
    inflowCap,
    netOutflow,
    lcrPct: netOutflow > 0 ? hqla / netOutflow * 100 : null,
    nsfrPct: asf / rsf * 100,
    largeExposurePct: connectedExposure / tier1 * 100,
  };
}

export function simplifiedEcl(ead: number, pdPct: number, lgdPct: number) {
  if (!finiteNonNegative(ead, pdPct, lgdPct) || pdPct > 100 || lgdPct > 100) return null;
  return ead * pdPct / 100 * lgdPct / 100;
}

export function depositInsuranceMetrics(balance: number, applicableLimit: number, aggregationBasis: 'owner-bank-ownership-category' | 'per-account') {
  if (!finiteNonNegative(balance, applicableLimit)) return null;
  const insured = Math.min(balance, applicableLimit);
  return { insured, uninsured: balance - insured, aggregationBasis, perAccountRule: aggregationBasis === 'per-account' };
}

export type ConstraintCapacityInput = {
  capital: number;
  leverage: number;
  liquidity: number;
  stableFunding: number;
  largeExposure: number;
  eligibleDemand: number;
  expectedNetReturn: number;
};

export function feasibleCreditCapacity(input: ConstraintCapacityInput) {
  const keys = ['capital', 'leverage', 'liquidity', 'stableFunding', 'largeExposure', 'eligibleDemand', 'expectedNetReturn'] as const satisfies readonly (keyof ConstraintCapacityInput)[];
  const runtimeKeys = Object.keys(input);
  if (runtimeKeys.length !== keys.length || runtimeKeys.some((key) => !keys.includes(key as keyof ConstraintCapacityInput))) return null;
  const entries = keys.map((key) => [key, input[key]] as const);
  if (entries.some(([, value]) => !Number.isFinite(value) || value < 0)) return null;
  const capacity = Math.min(...entries.map(([, value]) => value));
  const bindingConstraints = entries.filter(([, value]) => value === capacity).map(([key]) => key);
  return { capacity, feasibleCapacity: capacity, bindingConstraints, bindingConstraint: bindingConstraints.length === 1 ? bindingConstraints[0] : bindingConstraints.join('|'), capacityIsSum: false };
}

const near = (actual: number | null | undefined, expected: number, tolerance = 1e-9) => typeof actual === 'number' && Math.abs(actual - expected) <= tolerance;
const loan100 = onUsLoanMetrics(100, 'included');
const payment60 = crossBankSettlementBalances(60, 100, 40);
const netting = bilateralNetSettlement(100, 70);
const interbankFunding = settlementFundingMetrics(70, 30, 'interbank');
const centralBankFunding = settlementFundingMetrics(70, 30, 'central-bank');
const cash25 = depositCashConversionMetrics(25);
const repayment40 = principalRepaymentMetrics(40, 'included');
const onUsIncludedToIncluded = onUsDepositPaymentMetrics(40, 'included', 'included');
const onUsIncludedToExcluded = onUsDepositPaymentMetrics(40, 'included', 'excluded');
const onUsExcludedToIncluded = onUsDepositPaymentMetrics(40, 'excluded', 'included');
const onUsUnknown = onUsDepositPaymentMetrics(40, 'included', 'unknown');
const interest5 = interestMetrics(5);
const allowance8 = allowanceMetrics(100, 0, 8);
const writeoff8 = coveredWriteOffMetrics(100, 8, 8);
const fiscal = fiscalSettlementMetrics(30, 45);
const qeNonbank = centralBankPurchaseMetrics(80, 'resident-nonbank');
const qeBank = centralBankPurchaseMetrics(80, 'bank');
const prudent = prudentialMetrics({ cet1: 9, tier1: 10, tier2: 5, rwa: 180, leverageExposure: 400, hqla: 120, outflows: 150, inflows: 60, asf: 110, rsf: 100, connectedExposure: 3 });
const insurance = depositInsuranceMetrics(300_000, 250_000, 'owner-bank-ownership-category');
const capacity = feasibleCreditCapacity({ capital: 150, leverage: 120, liquidity: 90, stableFunding: 110, largeExposure: 70, eligibleDemand: 95, expectedNetReturn: 85 });
const refinancing = refinancingMetrics(120, 100, true);
const refinancingContraction = refinancingMetrics(80, 100, true);
const overdraft = overdraftDrawMetrics(500, 120, 30, 80);
const centralBankLoan = centralBankLoanMetrics(50);
const moneyTransition = moneyBaseTransitionMetrics(500, 100, 520, 200);
const governmentDepositPassport = moneyPassportEligibility('central-bank', 'government', 'deposit');
const bankReservePassport = moneyPassportEligibility('central-bank', 'bank', 'reserve');

export const bankCreditFixtureAssertions = [
  { id: 'ledger-replay-closing', statement: '非空提款事件按event/posting序号从四个期初头寸重放为四个100期末头寸。', passed: canonicalLoanDrawReplayResult.passed && canonicalLoanDrawReplayResult.appliedEventIds.join('|') === 'EVT_DRAW_001' && canonicalLoanDrawReplayResult.closingPositions.every((position) => position.amount === 100) },
  { id: 'ledger-replay-balance', statement: '提款重放后的银行、借款人垂直残差与两项请求权横向残差均为0。', passed: canonicalLoanDrawReplayResult.verticalResiduals.every(({ residual }) => residual === 0) && canonicalLoanDrawReplayResult.horizontalResiduals.every(({ residual }) => residual === 0) },
  { id: 'ledger-replay-rule-guard', statement: '重放器拒绝未知应用规则版本，而不是猜测分录语义。', passed: !replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [{ ...canonicalLoanDrawReplayEvent, applyRuleVersion: 'unknown-rule' }]).passed },
  { id: 'ledger-replay-position-guard', statement: '重放器拒绝分录身份与期初position不一致。', passed: !replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [{ ...canonicalLoanDrawReplayEvent, postings: canonicalLoanDrawReplayEvent.postings.map((posting, index) => index === 0 ? { ...posting, entityId: 'WRONG_ENTITY' } : posting) }]).passed },
  { id: 'ledger-replay-nonfinite-guard', statement: '重放器拒绝非有限的有符号分录金额。', passed: !replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [{ ...canonicalLoanDrawReplayEvent, postings: canonicalLoanDrawReplayEvent.postings.map((posting, index) => index === 0 ? { ...posting, signedAmount: Number.NaN } : posting) }]).passed },
  { id: 'ledger-replay-negative-balance-guard', statement: '重放器拒绝会把position推到负余额的分录。', passed: !replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [{ ...canonicalLoanDrawReplayEvent, postings: canonicalLoanDrawReplayEvent.postings.map((posting, index) => index === 0 ? { ...posting, signedAmount: -1 } : posting) }]).passed },
  { id: 'ledger-replay-sequence-guard', statement: '重放器拒绝重复的event序号或同一事件内重复的posting序号。', passed: !replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [canonicalLoanDrawReplayEvent, { ...canonicalLoanDrawReplayEvent, eventId: 'EVT_DRAW_DUPLICATE' }]).passed && !replayBankCreditLedger(canonicalLoanDrawOpeningPositions, [{ ...canonicalLoanDrawReplayEvent, postings: canonicalLoanDrawReplayEvent.postings.map((posting, index) => index === 1 ? { ...posting, postingSequence: 1 } : posting) }]).passed },
  { id: 'loan-bank-balance', statement: '同行提款100使银行贷款资产与存款负债各增加100。', passed: loan100?.bankLoanAsset === 100 && loan100.bankDepositLiability === 100 },
  { id: 'loan-no-reserve-capital', statement: '同行提款本金不自动改变准备金或资本。', passed: loan100?.bankReserveChange === 0 && loan100.bankEquityChange === 0 },
  { id: 'loan-borrower-net-worth', statement: '借款人存款与债务各增100，初始净值变化为0。', passed: loan100?.borrowerNetWorthChange === 0 && loan100.borrowerLoanLiability === 100 },
  { id: 'loan-money-base', statement: '冻结口径下贷款创造100广义货币，基础货币不变。', passed: loan100?.broadMoneyChange === 100 && loan100.monetaryBaseChange === 0 },
  { id: 'payment-payer', statement: '跨行支付60使付款行准备金与存款各减少60。', passed: payment60?.payerBankReserveChange === -60 && payment60.payerBankDepositChange === -60 },
  { id: 'payment-payee', statement: '跨行支付60使收款行准备金与存款各增加60。', passed: payment60?.payeeBankReserveChange === 60 && payment60.payeeBankDepositChange === 60 },
  { id: 'payment-system-invariant', statement: '纯私人跨行支付不改变体系存款或准备金总量。', passed: payment60?.systemReserveChange === 0 && payment60.systemDepositChange === 0 },
  { id: 'on-us-same-eligibility', statement: '同行付款双方都纳入冻结货币口径时，银行总存款、准备金与广义货币均不变。', passed: onUsIncludedToIncluded?.bankDepositTotalChange === 0 && onUsIncludedToIncluded.bankReserveChange === 0 && onUsIncludedToIncluded.broadMoneyChange === 0 },
  { id: 'on-us-included-to-excluded', statement: '居民货币持有人向同行政府等排除账户付款40时，银行总存款不变但广义货币减少40。', passed: onUsIncludedToExcluded?.bankDepositTotalChange === 0 && onUsIncludedToExcluded.broadMoneyChange === -40 },
  { id: 'on-us-excluded-to-included', statement: '同行排除账户向居民货币持有人付款40时，银行总存款不变但广义货币增加40。', passed: onUsExcludedToIncluded?.bankDepositTotalChange === 0 && onUsExcludedToIncluded.broadMoneyChange === 40 },
  { id: 'on-us-unknown-eligibility', statement: '同行付款任一方资格未知时停止输出广义货币变化。', passed: onUsUnknown?.broadMoneyChange === null },
  { id: 'netting', statement: 'A→B 100、B→A 70的总额170、净结算30、名义结算义务压缩140。', passed: netting?.grossPayments === 170 && netting.netAtoB === 30 && netting.grossObligationReduction === 140 },
  { id: 'funding-shortfall', statement: '净流出70、可用准备金30形成40结算缺口。', passed: interbankFunding?.shortfall === 40 && centralBankFunding?.shortfall === 40 },
  { id: 'funding-source', statement: '同业融资只重配准备金，央行融资使基础货币增加40。', passed: interbankFunding?.systemReserveChange === 0 && centralBankFunding?.monetaryBaseChange === 40 },
  { id: 'cash-conversion', statement: '取现25在含公众现金的口径中只改货币组成，贷款与广义货币不变。', passed: cash25?.depositChange === -25 && cash25.publicCurrencyChange === 25 && cash25.loanChange === 0 && cash25.broadMoneyChange === 0 },
  { id: 'principal-repayment', statement: '本金偿还40使贷款与存款各减少40，准备金体系总量不变。', passed: repayment40?.loanChange === -40 && repayment40.depositChange === -40 && repayment40.reserveSystemChange === 0 },
  { id: 'principal-repayment-included-money', statement: '用纳入口径的银行存款偿还本金40时，广义货币减少40。', passed: principalRepaymentMetrics(40, 'included')?.broadMoneyChange === -40 },
  { id: 'principal-repayment-excluded-money', statement: '用排除于口径的银行存款偿还本金40时，冻结广义货币变化为0。', passed: principalRepaymentMetrics(40, 'excluded')?.broadMoneyChange === 0 },
  { id: 'principal-repayment-unknown-money', statement: '偿还所用存款的货币资格未知时，停止输出广义货币变化。', passed: principalRepaymentMetrics(40, 'unknown')?.broadMoneyChange === null },
  { id: 'interest-accrual', statement: '应计利息5增加应计债权与权益，不改变存款或本金。', passed: interest5?.accrual.accruedInterestChange === 5 && interest5.accrual.bankEquityChange === 5 && interest5.accrual.depositChange === 0 && interest5.accrual.principalChange === 0 },
  { id: 'interest-payment', statement: '已应计利息付款5减少存款与应收，不再次改变权益或本金。', passed: interest5?.paymentAfterAccrual.depositChange === -5 && interest5.paymentAfterAccrual.accruedInterestChange === -5 && interest5.paymentAfterAccrual.bankEquityChange === 0 },
  { id: 'allowance', statement: '拨备8不改贷款总额或存款，使净贷款与税前利润各减少8；忽略税及同步分录时权益也减少8。', passed: allowance8?.grossLoan === 100 && allowance8.closingNetLoan === 92 && allowance8.pretaxProfitChange === -8 && allowance8.equityChangeIgnoringTaxAndOtherEntries === -8 && allowance8.depositChange === 0 },
  { id: 'covered-writeoff', statement: '全额拨备后核销8使gross与allowance各减8，净贷款、权益和存款不再变化。', passed: writeoff8?.grossLoanAfter === 92 && writeoff8.allowanceAfter === 0 && writeoff8.netLoanBefore === writeoff8.netLoanAfter && writeoff8.additionalLoss === 0 && writeoff8.depositChange === 0 },
  { id: 'writeoff-invalid-allowance', statement: '损失准备大于gross loan的非法起始状态被拒绝。', passed: coveredWriteOffMetrics(100, 120, 8) === null },
  { id: 'writeoff-invalid-amount', statement: '核销金额大于gross loan的非法事件被拒绝。', passed: coveredWriteOffMetrics(100, 20, 120) === null },
  { id: 'security-purchase', statement: '银行向居民非银买券70在冻结口径下增加70存款货币。', passed: bankSecurityTradeMetrics(70, 'buy-from-resident-nonbank')?.broadMoneyChange === 70 },
  { id: 'security-sale', statement: '居民以既有存款向银行买券30在冻结口径下减少30存款货币。', passed: bankSecurityTradeMetrics(30, 'sell-to-resident-nonbank')?.broadMoneyChange === -30 },
  { id: 'interbank-security', statement: '银行间证券交易不直接改变居民存款或体系准备金。', passed: bankSecurityTradeMetrics(70, 'interbank')?.broadMoneyChange === 0 && bankSecurityTradeMetrics(70, 'interbank')?.systemReserveChange === 0 },
  { id: 'tax', statement: '税30进入央行政府账户时，冻结口径下M与B各减少30。', passed: fiscal?.taxBroadMoneyChange === -30 && fiscal.taxBaseChange === -30 },
  { id: 'spending', statement: '政府从央行账户向居民支出45时，冻结口径下M与B各增加45。', passed: fiscal?.spendingBroadMoneyChange === 45 && fiscal.spendingBaseChange === 45 },
  { id: 'fiscal-combined', statement: '税30与居民支出45的孤立净结算使M与B各增加15。', passed: fiscal?.combinedBroadMoneyChange === 15 && fiscal.combinedBaseChange === 15 },
  { id: 'qe-nonbank', statement: '央行从居民非银买券80使冻结口径下M与B各增加80。', passed: qeNonbank?.broadMoneyChange === 80 && qeNonbank.monetaryBaseChange === 80 },
  { id: 'qe-bank', statement: '央行从银行买券80使B增加80、M直接变化为0。', passed: qeBank?.broadMoneyChange === 0 && qeBank.monetaryBaseChange === 80 },
  { id: 'multiplier-ratio', statement: 'B从100到200、M从500到520时，M/B从5降至2.6。', passed: observedMoneyBaseRatio(500, 100) === 5 && observedMoneyBaseRatio(520, 200) === 2.6 },
  { id: 'multiplier-zero-boundaries', statement: '末期M为0保留0比率与−100%变化；初期M为0或任一期B为0时拒绝增长分解。', passed: moneyBaseTransitionMetrics(500, 100, 0, 200)?.finalRatio === 0 && moneyBaseTransitionMetrics(500, 100, 0, 200)?.ratioChangePct === -100 && moneyBaseTransitionMetrics(500, 100, 0, 200)?.broadMoneyGrowthPct === -100 && moneyBaseTransitionMetrics(0, 100, 0, 200) === null && moneyBaseTransitionMetrics(500, 0, 520, 200) === null },
  { id: 'cet1', statement: 'CET1=9、RWA=180对应5% CET1 ratio。', passed: near(prudent?.cet1RatioPct, 5) },
  { id: 'tier1-total-capital', statement: 'Tier1=10、Tier2=5、RWA=180对应5.555556%与8.333333%。', passed: near(prudent?.tier1RatioPct, 5.555555555555555) && near(prudent?.totalCapitalRatioPct, 8.333333333333332) },
  { id: 'expanded-cet1', statement: '资本分子冻结、RWA再增100后CET1 ratio为3.214286%。', passed: near(9 / 280 * 100, 3.2142857142857144) },
  { id: 'leverage', statement: 'Tier1=10、杠杆暴露400对应2.5% leverage ratio。', passed: near(prudent?.leverageRatioPct, 2.5) },
  { id: 'lcr', statement: 'HQLA120、流出150、流入60对应净流出90和LCR 133.333333%。', passed: prudent?.inflowCap === 112.5 && prudent.netOutflow === 90 && near(prudent.lcrPct, 133.33333333333331) },
  { id: 'nsfr', statement: 'ASF110、RSF100对应110% NSFR。', passed: near(prudent?.nsfrPct, 110) },
  { id: 'large-exposure', statement: '关联组暴露3、Tier1=10对应30%大额风险比率。', passed: near(prudent?.largeExposurePct, 30) },
  { id: 'ecl', statement: '教学简化ECL：EAD100、PD2%/10%、LGD40%对应0.8/4.0。', passed: simplifiedEcl(100, 2, 40) === 0.8 && simplifiedEcl(100, 10, 40) === 4 },
  { id: 'fdic', statement: '美国同一所有权类别余额300,000、限额250,000对应受保250,000、未保50,000。', passed: insurance?.insured === 250_000 && insurance.uninsured === 50_000 },
  { id: 'binding-capacity', statement: '七类冻结容量取最小值70，大额风险为唯一绑定项。', passed: capacity?.capacity === 70 && capacity.bindingConstraints.length === 1 && capacity.bindingConstraints[0] === 'largeExposure' },
  { id: 'capacity-runtime-schema', statement: '容量函数拒绝缺键与额外键的运行时输入。', passed: feasibleCreditCapacity({ capital: 150, leverage: 120, liquidity: 90, stableFunding: 110, largeExposure: 70, eligibleDemand: 95 } as ConstraintCapacityInput) === null && feasibleCreditCapacity({ capital: 150, leverage: 120, liquidity: 90, stableFunding: 110, largeExposure: 70, eligibleDemand: 95, expectedNetReturn: 85, extra: 1 } as ConstraintCapacityInput) === null },
  { id: 'capacity-non-finite', statement: '容量函数拒绝NaN和其他非有限输入。', passed: feasibleCreditCapacity({ capital: Number.NaN, leverage: 120, liquidity: 90, stableFunding: 110, largeExposure: 70, eligibleDemand: 95, expectedNetReturn: 85 }) === null },
  { id: 'refinancing-net-contraction', statement: '总偿还大于总新发放是有效的净收缩窗口，不被误判为非法输入。', passed: refinancingContraction?.netLoanChange === -20 && refinancingContraction.netDepositChange === -20 },
  { id: 'derived-scenario-calculators', statement: '再融资、透支、央行贷款与M/B变化均由纯计算器导出冻结值。', passed: refinancing?.netLoanChange === 20 && refinancing.netDepositChange === 20 && overdraft?.newDraw === 50 && overdraft.loanBalanceAfter === 170 && centralBankLoan?.monetaryBaseChange === 50 && near(moneyTransition?.finalRatio, 2.6) && near(moneyTransition?.broadMoneyGrowthPct, 4) },
  { id: 'money-passport-holder-gate', statement: '基础货币资格读取持有人：银行准备金纳入，政府央行存款在冻结TGA口径中排除。', passed: bankReservePassport.monetaryBase === 'included' && governmentDepositPassport.monetaryBase === 'excluded' },
] as const;
