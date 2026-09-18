// AUTHOR DRAFT: seven independent SYN contracts for lesson 4.02.
// No value below is observed data, a real currency, a shared economy, a causal estimate,
// PIT evidence, a policy recommendation or a production signal.

export type InternationalMonetaryLabId = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';
export type IntegerDomain = Readonly<{ min: number; max: number; step: 1 }>;
export type ExactQuantity = Readonly<{ numerator: number; denominator: number; scale: 1 | 100 | 10_000 }>;
export type InternationalMonetaryStop = Readonly<{ status: 'STOP'; reason: string }>;
export type InternationalMonetaryOk<T extends object> = Readonly<{
  status: 'OK';
  value: Readonly<T>;
  exact: Readonly<Partial<Record<keyof T & string, ExactQuantity>>>;
}>;
export type InternationalMonetaryResult<T extends object> = InternationalMonetaryStop | InternationalMonetaryOk<T>;

export type PassportAggregationMode = 'KEEP_SEPARATE' | 'REQUEST_DIRECT_AVERAGE';
export type StatisticalPassportId = 'FX' | 'INVOICE' | 'FUNDING' | 'RESERVE' | 'PAYMENT';
export type PassportFunction =
  | 'FX_TURNOVER'
  | 'TRADE_INVOICING'
  | 'CROSS_BORDER_FINANCING'
  | 'OFFICIAL_RESERVES'
  | 'CROSS_BORDER_PAYMENT_VALUE';
export type PassportActorRoles =
  | 'BUYER_AND_SELLER_NO_ISSUER_HOLDER_INFERENCE'
  | 'SELLER_AND_BUYER_NO_ASSET_HOLDER_INFERENCE'
  | 'NONBANK_DEBTOR_AND_BANK_OR_BONDHOLDER_CREDITOR'
  | 'RESERVE_MANAGER_HOLDER_AND_MULTIPLE_ASSET_ISSUERS'
  | 'PAYER_AND_PAYEE_NO_SETTLEMENT_ASSET_INFERENCE';
export type PassportRecordObject =
  | 'SYN_FX_CONTRACTS'
  | 'SYN_TRADE_CONTRACTS'
  | 'SYN_LOAN_AND_BOND_CLAIMS'
  | 'SYN_RESERVE_ASSETS'
  | 'SYN_CROSS_BORDER_PAYMENT_RECORDS';
export type PassportCurrencyField = 'C2_SYN_CANDIDATE' | 'PAIR_SPECIFIC' | 'NOT_OBSERVED';

export type StatisticalPassport = Readonly<{
  id: StatisticalPassportId;
  candidateCurrency: 'C2_SYN_CANDIDATE';
  function: PassportFunction;
  unit: string;
  referencePeriod: string;
  coverage: string;
  denominator: string;
  vintage: 'SYN-V1';
  actorRoles: PassportActorRoles;
  recordObject: PassportRecordObject;
  denominationCurrency: PassportCurrencyField;
  paymentCurrency: PassportCurrencyField;
  numeratorKey: C2NumericKey;
  denominatorKey: C2NumericKey;
}>;

export type C1Input = Readonly<{
  fixedSetupCost: number;
  interactions: number;
  savingPerAcceptedInteraction: number;
  expectedAcceptancePct: number;
}>;

export type C2NumericKey =
  | 'fxNumerator' | 'fxDenominator'
  | 'invoiceNumerator' | 'invoiceDenominator'
  | 'fundingNumerator' | 'fundingDenominator'
  | 'reserveNumerator' | 'reserveDenominator'
  | 'paymentNumerator' | 'paymentDenominator';

export type C2Input = Readonly<Record<C2NumericKey, number> & { aggregationMode: PassportAggregationMode }>;

export type C3Input = Readonly<{
  notional: number;
  directCostBps: number;
  firstVehicleLegBps: number;
  secondVehicleLegBps: number;
}>;

export type C4Input = Readonly<{
  pairAB: number;
  pairAC: number;
  pairAD: number;
  pairAE: number;
  pairBC: number;
}>;

export type C5Input = Readonly<{
  openingStock: number;
  grossNewIssuance: number;
  repayments: number;
}>;

export type C6Input = Readonly<{
  holdingA: number;
  oldRateACents: number;
  newRateACents: number;
  holdingB: number;
  oldRateBCents: number;
  newRateBCents: number;
}>;

export type NetworkState = 0 | 1;
export type C7Input = Readonly<{
  startCore: NetworkState;
  entryThreshold: number;
  exitThreshold: number;
  score1: number;
  score2: number;
  score3: number;
  score4: number;
  score5: number;
  score6: number;
}>;

export type InternationalMonetaryInputsById = {
  C1: C1Input;
  C2: C2Input;
  C3: C3Input;
  C4: C4Input;
  C5: C5Input;
  C6: C6Input;
  C7: C7Input;
};

export type C1Output = {
  fullAcceptanceSaving: number;
  expectedSaving: number;
  netBenefit: number;
  thresholdPct: number;
  thresholdReachable: boolean;
  adoptionDecision: 'ADOPT' | 'DO_NOT_ADOPT' | 'INDIFFERENT';
};

export type C2Output = {
  passportCount: number;
  fxSharePct: number;
  invoiceSharePct: number;
  fundingSharePct: number;
  reserveSharePct: number;
  paymentSharePct: number;
  directlyAverageableShareCount: number;
  commonUnit: boolean;
  commonReferencePeriod: boolean;
  commonCoverage: boolean;
  commonDenominator: boolean;
  directAveragePct: null;
};

export type C3Output = {
  directCostBps: number;
  vehicleEffectiveCostBps: number;
  directDelivered: number;
  vehicleDelivered: number;
  vehicleDeliveryAdvantage: number;
  preferredRoute: 'DIRECT' | 'VEHICLE' | 'TIE';
};

export type C4Output = {
  totalFxTurnover: number;
  currencyATurnover: number;
  currencyBTurnover: number;
  currencyCTurnover: number;
  currencyDTurnover: number;
  currencyETurnover: number;
  currencyASharePct: number;
  currencyBSharePct: number;
  currencyCSharePct: number;
  currencyDSharePct: number;
  currencyESharePct: number;
  currencyTurnoverSum: number;
  currencyShareSumPct: number;
};

export type C5Output = {
  netNewFlow: number;
  grossActivity: number;
  closingStock: number;
  stockChange: number;
  valuationChangeFrozen: 0;
  bridgeGap: 0;
};

export type C6Output = {
  openingReserveValue: number;
  closingReserveValue: number;
  currencyAValuationChange: number;
  currencyBValuationChange: number;
  totalValuationChange: number;
  currencyAClosingSharePct: number;
  currencyBClosingSharePct: number;
  closingShareSumPct: number;
  transactionContribution: 0;
  bridgeGap: 0;
};

export type C7Output = {
  statePath: readonly NetworkState[];
  statePathText: string;
  switchCount: number;
  firstEntryPeriod: number | null;
  firstExitPeriod: number | null;
  hysteresisBandVisits: number;
  sameScoreDifferentState: boolean;
};

export type InternationalMonetaryOutputsById = {
  C1: C1Output;
  C2: C2Output;
  C3: C3Output;
  C4: C4Output;
  C5: C5Output;
  C6: C6Output;
  C7: C7Output;
};

const nonnegative: IntegerDomain = Object.freeze({ min: 0, max: 1_000_000, step: 1 });
const positiveTenThousand: IntegerDomain = Object.freeze({ min: 1, max: 10_000, step: 1 });
const percent: IntegerDomain = Object.freeze({ min: 0, max: 100, step: 1 });
const bps: IntegerDomain = Object.freeze({ min: 0, max: 10_000, step: 1 });
const binary: IntegerDomain = Object.freeze({ min: 0, max: 1, step: 1 });
const rateCents: IntegerDomain = Object.freeze({ min: 0, max: 10_000, step: 1 });

export const internationalMonetaryRawDomains = Object.freeze({
  C1: Object.freeze({
    fixedSetupCost: nonnegative,
    interactions: positiveTenThousand,
    savingPerAcceptedInteraction: positiveTenThousand,
    expectedAcceptancePct: percent,
  }),
  C2: Object.freeze({
    fxNumerator: nonnegative, fxDenominator: positiveTenThousand,
    invoiceNumerator: nonnegative, invoiceDenominator: positiveTenThousand,
    fundingNumerator: nonnegative, fundingDenominator: positiveTenThousand,
    reserveNumerator: nonnegative, reserveDenominator: positiveTenThousand,
    paymentNumerator: nonnegative, paymentDenominator: positiveTenThousand,
  }),
  C3: Object.freeze({
    notional: Object.freeze({ min: 1, max: 1_000_000, step: 1 }),
    directCostBps: bps,
    firstVehicleLegBps: bps,
    secondVehicleLegBps: bps,
  }),
  C4: Object.freeze({ pairAB: nonnegative, pairAC: nonnegative, pairAD: nonnegative, pairAE: nonnegative, pairBC: nonnegative }),
  C5: Object.freeze({ openingStock: nonnegative, grossNewIssuance: nonnegative, repayments: nonnegative }),
  C6: Object.freeze({
    holdingA: Object.freeze({ min: 0, max: 10_000, step: 1 }),
    oldRateACents: rateCents,
    newRateACents: rateCents,
    holdingB: Object.freeze({ min: 0, max: 10_000, step: 1 }),
    oldRateBCents: rateCents,
    newRateBCents: rateCents,
  }),
  C7: Object.freeze({
    startCore: binary,
    entryThreshold: percent,
    exitThreshold: percent,
    score1: percent, score2: percent, score3: percent,
    score4: percent, score5: percent, score6: percent,
  }),
}) satisfies Readonly<Record<InternationalMonetaryLabId, Readonly<Record<string, IntegerDomain>>>>;

export const internationalMonetaryCanonicalInputs = Object.freeze({
  C1: Object.freeze({ fixedSetupCost: 24, interactions: 40, savingPerAcceptedInteraction: 1, expectedAcceptancePct: 55 }),
  C2: Object.freeze({
    fxNumerator: 90, fxDenominator: 100,
    invoiceNumerator: 60, invoiceDenominator: 100,
    fundingNumerator: 140, fundingDenominator: 200,
    reserveNumerator: 50, reserveDenominator: 100,
    paymentNumerator: 150, paymentDenominator: 200,
    aggregationMode: 'KEEP_SEPARATE',
  }),
  C3: Object.freeze({ notional: 1_000_000, directCostBps: 35, firstVehicleLegBps: 10, secondVehicleLegBps: 20 }),
  C4: Object.freeze({ pairAB: 45, pairAC: 25, pairAD: 15, pairAE: 5, pairBC: 10 }),
  C5: Object.freeze({ openingStock: 1_000, grossNewIssuance: 300, repayments: 280 }),
  C6: Object.freeze({ holdingA: 60, oldRateACents: 100, newRateACents: 120, holdingB: 80, oldRateBCents: 50, newRateBCents: 45 }),
  C7: Object.freeze({
    startCore: 0, entryThreshold: 60, exitThreshold: 40,
    score1: 50, score2: 65, score3: 55, score4: 35, score5: 55, score6: 65,
  }),
}) satisfies Readonly<{ [K in InternationalMonetaryLabId]: InternationalMonetaryInputsById[K] }>;

export const internationalMonetaryStatisticalPassports: readonly StatisticalPassport[] = Object.freeze([
  Object.freeze({
    id: 'FX', candidateCurrency: 'C2_SYN_CANDIDATE', function: 'FX_TURNOVER',
    unit: 'SYN百分比：候选货币出现在FX交易一侧的成交额/总FX成交额',
    referencePeriod: 'SYN月内日均', coverage: 'SYN OTC FX净净口径', denominator: 'SYN总FX成交额；币种份额合计200%', vintage: 'SYN-V1',
    actorRoles: 'BUYER_AND_SELLER_NO_ISSUER_HOLDER_INFERENCE', recordObject: 'SYN_FX_CONTRACTS',
    denominationCurrency: 'PAIR_SPECIFIC', paymentCurrency: 'NOT_OBSERVED', numeratorKey: 'fxNumerator', denominatorKey: 'fxDenominator',
  }),
  Object.freeze({
    id: 'INVOICE', candidateCurrency: 'C2_SYN_CANDIDATE', function: 'TRADE_INVOICING',
    unit: 'SYN百分比：候选货币计价贸易额/覆盖贸易额',
    referencePeriod: 'SYN年度', coverage: 'SYN可得经济体货物与服务样本', denominator: 'SYN覆盖贸易额', vintage: 'SYN-V1',
    actorRoles: 'SELLER_AND_BUYER_NO_ASSET_HOLDER_INFERENCE', recordObject: 'SYN_TRADE_CONTRACTS',
    denominationCurrency: 'C2_SYN_CANDIDATE', paymentCurrency: 'NOT_OBSERVED', numeratorKey: 'invoiceNumerator', denominatorKey: 'invoiceDenominator',
  }),
  Object.freeze({
    id: 'FUNDING', candidateCurrency: 'C2_SYN_CANDIDATE', function: 'CROSS_BORDER_FINANCING',
    unit: 'SYN百分比：候选货币融资期末存量/覆盖融资期末存量',
    referencePeriod: 'SYN期末', coverage: 'SYN货币区外非银行贷款与国际债券', denominator: 'SYN覆盖融资存量', vintage: 'SYN-V1',
    actorRoles: 'NONBANK_DEBTOR_AND_BANK_OR_BONDHOLDER_CREDITOR', recordObject: 'SYN_LOAN_AND_BOND_CLAIMS',
    denominationCurrency: 'C2_SYN_CANDIDATE', paymentCurrency: 'NOT_OBSERVED', numeratorKey: 'fundingNumerator', denominatorKey: 'fundingDenominator',
  }),
  Object.freeze({
    id: 'RESERVE', candidateCurrency: 'C2_SYN_CANDIDATE', function: 'OFFICIAL_RESERVES',
    unit: 'SYN百分比：候选货币储备资产市场价值/覆盖外汇储备市场价值',
    referencePeriod: 'SYN期末', coverage: 'SYN报告者与SYN估算未分配部分', denominator: 'SYN覆盖外汇储备；不含黄金', vintage: 'SYN-V1',
    actorRoles: 'RESERVE_MANAGER_HOLDER_AND_MULTIPLE_ASSET_ISSUERS', recordObject: 'SYN_RESERVE_ASSETS',
    denominationCurrency: 'C2_SYN_CANDIDATE', paymentCurrency: 'NOT_OBSERVED', numeratorKey: 'reserveNumerator', denominatorKey: 'reserveDenominator',
  }),
  Object.freeze({
    id: 'PAYMENT', candidateCurrency: 'C2_SYN_CANDIDATE', function: 'CROSS_BORDER_PAYMENT_VALUE',
    unit: 'SYN百分比：候选付款币跨境支付记录价值/覆盖跨境支付记录价值',
    referencePeriod: 'SYN月度', coverage: 'SYN跨境支付记录；不含消息数、清算义务、结算资产或法律最终性', denominator: 'SYN覆盖跨境支付记录价值', vintage: 'SYN-V1',
    actorRoles: 'PAYER_AND_PAYEE_NO_SETTLEMENT_ASSET_INFERENCE', recordObject: 'SYN_CROSS_BORDER_PAYMENT_RECORDS',
    denominationCurrency: 'NOT_OBSERVED', paymentCurrency: 'C2_SYN_CANDIDATE', numeratorKey: 'paymentNumerator', denominatorKey: 'paymentDenominator',
  }),
]);

function stop(reason: string): InternationalMonetaryStop { return { status: 'STOP', reason }; }

function isStop(value: unknown): value is InternationalMonetaryStop {
  return value !== null && typeof value === 'object' && (value as { status?: unknown }).status === 'STOP';
}

function safeInteger(value: number, label: string): number {
  if (!Number.isSafeInteger(value)) throw new RangeError(`中间整数不安全：${label}`);
  return value === 0 ? 0 : value;
}

function add(a: number, b: number, label = '加法'): number { return safeInteger(a + b, label); }
function subtract(a: number, b: number, label = '减法'): number { return safeInteger(a - b, label); }
function multiply(a: number, b: number, label = '乘法'): number { return safeInteger(a * b, label); }

function gcd(a: number, b: number): number {
  let x = Math.abs(safeInteger(a, 'gcd输入'));
  let y = Math.abs(safeInteger(b, 'gcd输入'));
  while (y !== 0) { const remainder = safeInteger(x % y, 'gcd余数'); x = y; y = remainder; }
  return x;
}

function exact(numerator: number, denominator: number, scale: 1 | 100 | 10_000 = 1): ExactQuantity {
  safeInteger(numerator, '精确量分子');
  safeInteger(denominator, '精确量分母');
  if (denominator <= 0) throw new RangeError('精确量分母必须严格为正。');
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator: numerator / divisor, denominator: denominator / divisor, scale });
}

export function internationalMonetaryExactToNumber(quantity: ExactQuantity): number {
  const scaledNumerator = safeInteger(quantity.numerator * quantity.scale, '展示投影分子');
  const value = scaledNumerator / quantity.denominator;
  if (!Number.isFinite(value)) throw new RangeError('展示投影不是有限数。');
  return value === 0 ? 0 : value;
}

function ok<T extends object>(
  value: T,
  exactValues: Partial<Record<keyof T & string, ExactQuantity>> = {},
): InternationalMonetaryOk<T> {
  return { status: 'OK', value: Object.freeze(value), exact: Object.freeze(exactValues) };
}

function ownDataObject(input: unknown, expectedKeys: readonly string[]): InternationalMonetaryStop | Readonly<Record<string, unknown>> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return stop('必须提供完整原始对象。');
  const supplied = Reflect.ownKeys(input);
  if (supplied.length !== expectedKeys.length || supplied.some(key => typeof key !== 'string' || !expectedKeys.includes(key))) {
    return stop('原始键必须完整，且不得添加其他字段或符号键。');
  }
  const value: Record<string, unknown> = {};
  for (const key of expectedKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor || !('value' in descriptor)) return stop(`输入须是自有数据字段，不接受getter：${key}`);
    value[key] = descriptor.value;
  }
  return Object.freeze(value);
}

function numericInput<K extends Exclude<InternationalMonetaryLabId, 'C2'>>(
  input: unknown,
  id: K,
): InternationalMonetaryStop | Readonly<Record<string, number>> {
  const domains = internationalMonetaryRawDomains[id] as Readonly<Record<string, IntegerDomain>>;
  const keys = Object.keys(domains);
  const raw = ownDataObject(input, keys);
  if (isStop(raw)) return raw;
  const value: Record<string, number> = {};
  for (const key of keys) {
    const candidate = raw[key];
    const domain = domains[key];
    if (typeof candidate !== 'number' || !Number.isSafeInteger(candidate) || candidate < domain.min || candidate > domain.max) {
      return stop(`原始输入须在声明的安全整数域内：${key}`);
    }
    value[key] = candidate === 0 ? 0 : candidate;
  }
  return Object.freeze(value);
}

function c2Input(input: unknown): InternationalMonetaryStop | C2Input {
  const numericKeys = Object.keys(internationalMonetaryRawDomains.C2) as C2NumericKey[];
  const raw = ownDataObject(input, [...numericKeys, 'aggregationMode']);
  if (isStop(raw)) return raw;
  const value: Partial<Record<C2NumericKey, number>> & { aggregationMode?: PassportAggregationMode } = {};
  for (const key of numericKeys) {
    const candidate = raw[key];
    const domain = internationalMonetaryRawDomains.C2[key];
    if (typeof candidate !== 'number' || !Number.isSafeInteger(candidate) || candidate < domain.min || candidate > domain.max) {
      return stop(`原始输入须在声明的安全整数域内：${key}`);
    }
    value[key] = candidate === 0 ? 0 : candidate;
  }
  const mode = raw.aggregationMode;
  if (mode !== 'KEEP_SEPARATE' && mode !== 'REQUEST_DIRECT_AVERAGE') return stop('aggregationMode必须是声明的严格枚举。');
  value.aggregationMode = mode;
  return Object.freeze(value as C2Input);
}

function checked<T extends object>(calculate: () => InternationalMonetaryResult<T>): InternationalMonetaryResult<T> {
  try { return calculate(); } catch (error) { if (error instanceof RangeError) return stop(error.message); throw error; }
}

export function parseInternationalMonetaryRawInteger(text: unknown): number | null {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!/^(?:0|-?[1-9]\d*)$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isSafeInteger(value) ? (value === 0 ? 0 : value) : null;
}

export function coordinationThreshold(input: unknown): InternationalMonetaryResult<C1Output> {
  return checked(() => {
    const parsed = numericInput(input, 'C1'); if (isStop(parsed)) return parsed;
    const fullAcceptanceSaving = multiply(parsed.interactions, parsed.savingPerAcceptedInteraction, '全接受节省');
    const expectedNumerator = multiply(fullAcceptanceSaving, parsed.expectedAcceptancePct, '预期节省分子');
    const expectedQuantity = exact(expectedNumerator, 100);
    const expectedSaving = internationalMonetaryExactToNumber(expectedQuantity);
    const costTimes100 = multiply(parsed.fixedSetupCost, 100, '固定成本同比例');
    const netQuantity = exact(subtract(expectedNumerator, costTimes100, '净收益分子'), 100);
    const thresholdQuantity = exact(parsed.fixedSetupCost, fullAcceptanceSaving, 100);
    const thresholdPct = internationalMonetaryExactToNumber(thresholdQuantity);
    return ok({
      fullAcceptanceSaving,
      expectedSaving,
      netBenefit: internationalMonetaryExactToNumber(netQuantity),
      thresholdPct,
      thresholdReachable: thresholdPct <= 100,
      adoptionDecision: expectedNumerator > costTimes100
        ? 'ADOPT'
        : expectedNumerator < costTimes100 ? 'DO_NOT_ADOPT' : 'INDIFFERENT',
    }, { expectedSaving: expectedQuantity, netBenefit: netQuantity, thresholdPct: thresholdQuantity });
  });
}

export function functionalStatisticalPassports(input: unknown): InternationalMonetaryResult<C2Output> {
  return checked(() => {
    const parsed = c2Input(input); if (isStop(parsed)) return parsed;
    for (const passport of internationalMonetaryStatisticalPassports) {
      if (parsed[passport.numeratorKey] > parsed[passport.denominatorKey]) {
        return stop(`${passport.id}护照的SYN分子不得超过其自身分母。`);
      }
    }
    if (parsed.aggregationMode === 'REQUEST_DIRECT_AVERAGE') {
      return stop('五张护照的function、unit、reference period、coverage与denominator不同；不得直接平均。');
    }
    const fx = exact(parsed.fxNumerator, parsed.fxDenominator, 100);
    const invoice = exact(parsed.invoiceNumerator, parsed.invoiceDenominator, 100);
    const funding = exact(parsed.fundingNumerator, parsed.fundingDenominator, 100);
    const reserve = exact(parsed.reserveNumerator, parsed.reserveDenominator, 100);
    const payment = exact(parsed.paymentNumerator, parsed.paymentDenominator, 100);
    return ok({
      passportCount: internationalMonetaryStatisticalPassports.length,
      fxSharePct: internationalMonetaryExactToNumber(fx),
      invoiceSharePct: internationalMonetaryExactToNumber(invoice),
      fundingSharePct: internationalMonetaryExactToNumber(funding),
      reserveSharePct: internationalMonetaryExactToNumber(reserve),
      paymentSharePct: internationalMonetaryExactToNumber(payment),
      directlyAverageableShareCount: 0,
      commonUnit: false,
      commonReferencePeriod: false,
      commonCoverage: false,
      commonDenominator: false,
      directAveragePct: null,
    }, { fxSharePct: fx, invoiceSharePct: invoice, fundingSharePct: funding, reserveSharePct: reserve, paymentSharePct: payment });
  });
}

export function vehicleCurrencyRoute(input: unknown): InternationalMonetaryResult<C3Output> {
  return checked(() => {
    const parsed = numericInput(input, 'C3'); if (isStop(parsed)) return parsed;
    const directRetention = subtract(10_000, parsed.directCostBps, '直接路径留存率');
    const firstRetention = subtract(10_000, parsed.firstVehicleLegBps, '载体第一腿留存率');
    const secondRetention = subtract(10_000, parsed.secondVehicleLegBps, '载体第二腿留存率');
    const directNumerator = multiply(parsed.notional, directRetention, '直接交付分子');
    const vehicleNumerator = multiply(multiply(parsed.notional, firstRetention, '载体第一腿'), secondRetention, '载体第二腿');
    const vehicleCostNumerator = subtract(
      multiply(add(parsed.firstVehicleLegBps, parsed.secondVehicleLegBps, '两腿bp相加'), 10_000, '两腿bp同比例'),
      multiply(parsed.firstVehicleLegBps, parsed.secondVehicleLegBps, '两腿交叉项'),
      '载体有效成本分子',
    );
    const advantageNumerator = subtract(vehicleNumerator, multiply(directNumerator, 10_000, '直接交付同分母'), '路径交付差');
    const directDelivered = exact(directNumerator, 10_000);
    const vehicleDelivered = exact(vehicleNumerator, 100_000_000);
    const vehicleEffectiveCostBps = exact(vehicleCostNumerator, 10_000);
    const vehicleDeliveryAdvantage = exact(advantageNumerator, 100_000_000);
    return ok({
      directCostBps: parsed.directCostBps,
      vehicleEffectiveCostBps: internationalMonetaryExactToNumber(vehicleEffectiveCostBps),
      directDelivered: internationalMonetaryExactToNumber(directDelivered),
      vehicleDelivered: internationalMonetaryExactToNumber(vehicleDelivered),
      vehicleDeliveryAdvantage: internationalMonetaryExactToNumber(vehicleDeliveryAdvantage),
      preferredRoute: advantageNumerator > 0 ? 'VEHICLE' : advantageNumerator < 0 ? 'DIRECT' : 'TIE',
    }, { directDelivered, vehicleDelivered, vehicleEffectiveCostBps, vehicleDeliveryAdvantage });
  });
}

export function fxTwoCurrencySides(input: unknown): InternationalMonetaryResult<C4Output> {
  return checked(() => {
    const parsed = numericInput(input, 'C4'); if (isStop(parsed)) return parsed;
    const totalFxTurnover = [parsed.pairAB, parsed.pairAC, parsed.pairAD, parsed.pairAE, parsed.pairBC]
      .reduce((sum, value) => add(sum, value, 'FX总成交'), 0);
    if (totalFxTurnover <= 0) return stop('FX总成交额必须严格为正，才能定义币种份额。');
    const currencyATurnover = add(add(parsed.pairAB, parsed.pairAC), add(parsed.pairAD, parsed.pairAE), 'A币参与额');
    const currencyBTurnover = add(parsed.pairAB, parsed.pairBC, 'B币参与额');
    const currencyCTurnover = add(parsed.pairAC, parsed.pairBC, 'C币参与额');
    const currencyDTurnover = parsed.pairAD;
    const currencyETurnover = parsed.pairAE;
    const currencyTurnoverSum = [currencyATurnover, currencyBTurnover, currencyCTurnover, currencyDTurnover, currencyETurnover]
      .reduce((sum, value) => add(sum, value, '币种参与额合计'), 0);
    if (currencyTurnoverSum !== multiply(totalFxTurnover, 2, '两条币种腿')) throw new RangeError('FX两条币种腿不变量失败。');
    const a = exact(currencyATurnover, totalFxTurnover, 100);
    const b = exact(currencyBTurnover, totalFxTurnover, 100);
    const c = exact(currencyCTurnover, totalFxTurnover, 100);
    const d = exact(currencyDTurnover, totalFxTurnover, 100);
    const e = exact(currencyETurnover, totalFxTurnover, 100);
    const sum = exact(currencyTurnoverSum, totalFxTurnover, 100);
    return ok({
      totalFxTurnover,
      currencyATurnover, currencyBTurnover, currencyCTurnover, currencyDTurnover, currencyETurnover,
      currencyASharePct: internationalMonetaryExactToNumber(a),
      currencyBSharePct: internationalMonetaryExactToNumber(b),
      currencyCSharePct: internationalMonetaryExactToNumber(c),
      currencyDSharePct: internationalMonetaryExactToNumber(d),
      currencyESharePct: internationalMonetaryExactToNumber(e),
      currencyTurnoverSum,
      currencyShareSumPct: internationalMonetaryExactToNumber(sum),
    }, { currencyASharePct: a, currencyBSharePct: b, currencyCSharePct: c, currencyDSharePct: d, currencyESharePct: e, currencyShareSumPct: sum });
  });
}

export function newFlowAndStock(input: unknown): InternationalMonetaryResult<C5Output> {
  return checked(() => {
    const parsed = numericInput(input, 'C5'); if (isStop(parsed)) return parsed;
    const netNewFlow = subtract(parsed.grossNewIssuance, parsed.repayments, '净新流量');
    const closingStock = add(parsed.openingStock, netNewFlow, '期末存量');
    if (closingStock < 0) return stop('偿还不得使题设期末存量为负。');
    const stockChange = subtract(closingStock, parsed.openingStock, '存量变化');
    const bridgeGap = subtract(stockChange, netNewFlow, '流量存量桥残差');
    if (bridgeGap !== 0) throw new RangeError('新流量—存量桥不变量失败。');
    return ok({
      netNewFlow,
      grossActivity: add(parsed.grossNewIssuance, parsed.repayments, '毛活动'),
      closingStock,
      stockChange,
      valuationChangeFrozen: 0,
      bridgeGap: 0,
    });
  });
}

export function reserveValuation(input: unknown): InternationalMonetaryResult<C6Output> {
  return checked(() => {
    const parsed = numericInput(input, 'C6'); if (isStop(parsed)) return parsed;
    const openingACents = multiply(parsed.holdingA, parsed.oldRateACents, 'A期初价值');
    const closingACents = multiply(parsed.holdingA, parsed.newRateACents, 'A期末价值');
    const openingBCents = multiply(parsed.holdingB, parsed.oldRateBCents, 'B期初价值');
    const closingBCents = multiply(parsed.holdingB, parsed.newRateBCents, 'B期末价值');
    const openingCents = add(openingACents, openingBCents, '储备期初价值');
    const closingCents = add(closingACents, closingBCents, '储备期末价值');
    if (closingCents <= 0) return stop('期末储备报告价值必须严格为正，才能定义构成份额。');
    const aChangeCents = subtract(closingACents, openingACents, 'A估值变化');
    const bChangeCents = subtract(closingBCents, openingBCents, 'B估值变化');
    const totalChangeCents = add(aChangeCents, bChangeCents, '总估值变化');
    const bridgeGapCents = subtract(subtract(closingCents, openingCents, '总价值变化'), totalChangeCents, '储备估值桥残差');
    if (bridgeGapCents !== 0) throw new RangeError('储备估值桥不变量失败。');
    const openingReserveValue = exact(openingCents, 100);
    const closingReserveValue = exact(closingCents, 100);
    const currencyAValuationChange = exact(aChangeCents, 100);
    const currencyBValuationChange = exact(bChangeCents, 100);
    const totalValuationChange = exact(totalChangeCents, 100);
    const aShare = exact(closingACents, closingCents, 100);
    const bShare = exact(closingBCents, closingCents, 100);
    const shareSum = exact(add(closingACents, closingBCents), closingCents, 100);
    return ok({
      openingReserveValue: internationalMonetaryExactToNumber(openingReserveValue),
      closingReserveValue: internationalMonetaryExactToNumber(closingReserveValue),
      currencyAValuationChange: internationalMonetaryExactToNumber(currencyAValuationChange),
      currencyBValuationChange: internationalMonetaryExactToNumber(currencyBValuationChange),
      totalValuationChange: internationalMonetaryExactToNumber(totalValuationChange),
      currencyAClosingSharePct: internationalMonetaryExactToNumber(aShare),
      currencyBClosingSharePct: internationalMonetaryExactToNumber(bShare),
      closingShareSumPct: internationalMonetaryExactToNumber(shareSum),
      transactionContribution: 0,
      bridgeGap: 0,
    }, {
      openingReserveValue, closingReserveValue, currencyAValuationChange, currencyBValuationChange,
      totalValuationChange, currencyAClosingSharePct: aShare, currencyBClosingSharePct: bShare, closingShareSumPct: shareSum,
    });
  });
}

export function networkReversalHysteresis(input: unknown): InternationalMonetaryResult<C7Output> {
  return checked(() => {
    const parsed = numericInput(input, 'C7'); if (isStop(parsed)) return parsed;
    if (parsed.exitThreshold >= parsed.entryThreshold) return stop('退出阈值必须严格低于进入阈值，才能定义迟滞带。');
    const scores = [parsed.score1, parsed.score2, parsed.score3, parsed.score4, parsed.score5, parsed.score6] as const;
    let previous = parsed.startCore as NetworkState;
    let switchCount = 0;
    let firstEntryPeriod: number | null = null;
    let firstExitPeriod: number | null = null;
    let hysteresisBandVisits = 0;
    const statePath: NetworkState[] = [];
    scores.forEach((score, index) => {
      let next = previous;
      if (previous === 0 && score >= parsed.entryThreshold) next = 1;
      else if (previous === 1 && score <= parsed.exitThreshold) next = 0;
      else if (score > parsed.exitThreshold && score < parsed.entryThreshold) hysteresisBandVisits += 1;
      if (next !== previous) {
        switchCount += 1;
        if (next === 1 && firstEntryPeriod === null) firstEntryPeriod = index + 1;
        if (next === 0 && firstExitPeriod === null) firstExitPeriod = index + 1;
      }
      statePath.push(next);
      previous = next;
    });
    const sameScoreDifferentState = scores.some((score, i) => scores.some((other, j) => i < j && score === other && statePath[i] !== statePath[j]));
    return ok({
      statePath: Object.freeze(statePath),
      statePathText: statePath.map(state => state === 1 ? '核心' : '外围').join(' → '),
      switchCount,
      firstEntryPeriod,
      firstExitPeriod,
      hysteresisBandVisits,
      sameScoreDifferentState,
    });
  });
}

export const internationalMonetaryEvaluators = Object.freeze({
  C1: coordinationThreshold,
  C2: functionalStatisticalPassports,
  C3: vehicleCurrencyRoute,
  C4: fxTwoCurrencySides,
  C5: newFlowAndStock,
  C6: reserveValuation,
  C7: networkReversalHysteresis,
}) satisfies { [K in InternationalMonetaryLabId]: (input: unknown) => InternationalMonetaryResult<InternationalMonetaryOutputsById[K]> };

function finiteDeep(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value);
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(finiteDeep);
  if (typeof value === 'object') return Object.values(value).every(finiteDeep);
  return false;
}

const defaultResults = [
  coordinationThreshold(internationalMonetaryCanonicalInputs.C1),
  functionalStatisticalPassports(internationalMonetaryCanonicalInputs.C2),
  vehicleCurrencyRoute(internationalMonetaryCanonicalInputs.C3),
  fxTwoCurrencySides(internationalMonetaryCanonicalInputs.C4),
  newFlowAndStock(internationalMonetaryCanonicalInputs.C5),
  reserveValuation(internationalMonetaryCanonicalInputs.C6),
  networkReversalHysteresis(internationalMonetaryCanonicalInputs.C7),
] as const;

const c1Adopt = coordinationThreshold({ ...internationalMonetaryCanonicalInputs.C1, expectedAcceptancePct: 61 });
const c1Indifferent = coordinationThreshold({ ...internationalMonetaryCanonicalInputs.C1, expectedAcceptancePct: 60 });
const c1DoNotAdopt = coordinationThreshold({ ...internationalMonetaryCanonicalInputs.C1, expectedAcceptancePct: 59 });
const c4Default = defaultResults[3];
const c5Default = defaultResults[4];
const c6Default = defaultResults[5];
const c7Default = defaultResults[6];

/** Finite AUTHOR contract checks, not independent review or real-data validation. */
export const internationalMonetaryFixtureAudit = [
  {
    key: 'seven independent defaults all return finite OK outputs',
    passed: defaultResults.length === 7 && defaultResults.every(result => result.status === 'OK' && finiteDeep(result.value) && finiteDeep(result.exact)),
  },
  {
    key: 'five same-candidate statistical passports freeze distinct complete functions and metadata',
    passed: internationalMonetaryStatisticalPassports.length === 5
      && new Set(internationalMonetaryStatisticalPassports.map(passport => passport.id)).size === 5
      && new Set(internationalMonetaryStatisticalPassports.map(passport => passport.function)).size === 5
      && internationalMonetaryStatisticalPassports.every(passport => passport.candidateCurrency === 'C2_SYN_CANDIDATE'
        && [passport.unit, passport.referencePeriod, passport.coverage, passport.denominator, passport.vintage].every(value => value.length > 0)),
  },
  {
    key: 'C2 uses function-specific actor roles and keeps payment records separate from clearing settlement assets and legal finality',
    passed: internationalMonetaryStatisticalPassports.find(passport => passport.id === 'FUNDING')?.actorRoles === 'NONBANK_DEBTOR_AND_BANK_OR_BONDHOLDER_CREDITOR'
      && internationalMonetaryStatisticalPassports.find(passport => passport.id === 'RESERVE')?.actorRoles === 'RESERVE_MANAGER_HOLDER_AND_MULTIPLE_ASSET_ISSUERS'
      && internationalMonetaryStatisticalPassports.find(passport => passport.id === 'PAYMENT')?.function === 'CROSS_BORDER_PAYMENT_VALUE'
      && internationalMonetaryStatisticalPassports.find(passport => passport.id === 'PAYMENT')?.coverage.includes('不含消息数、清算义务、结算资产或法律最终性') === true,
  },
  {
    key: 'C2 rejects undeclared enums, direct averaging and numerator above own denominator',
    passed: functionalStatisticalPassports({ ...internationalMonetaryCanonicalInputs.C2, aggregationMode: 'INVALID' }).status === 'STOP'
      && functionalStatisticalPassports({ ...internationalMonetaryCanonicalInputs.C2, aggregationMode: 'REQUEST_DIRECT_AVERAGE' }).status === 'STOP'
      && functionalStatisticalPassports({ ...internationalMonetaryCanonicalInputs.C2, reserveNumerator: 101 }).status === 'STOP',
  },
  {
    key: 'strict parser rejects blank decimals exponent notation negative zero and unsafe integers',
    passed: ['', '1.5', '1e3', '-0', String(Number.MAX_SAFE_INTEGER + 1)].every(value => parseInternationalMonetaryRawInteger(value) === null)
      && parseInternationalMonetaryRawInteger('0') === 0
      && parseInternationalMonetaryRawInteger('-12') === -12,
  },
  {
    key: 'C1 distinguishes strict adoption non-adoption and zero-net-benefit indifference without an invented tie-break',
    passed: c1Adopt.status === 'OK' && c1Adopt.value.adoptionDecision === 'ADOPT'
      && c1Indifferent.status === 'OK' && c1Indifferent.value.adoptionDecision === 'INDIFFERENT'
      && c1DoNotAdopt.status === 'OK' && c1DoNotAdopt.value.adoptionDecision === 'DO_NOT_ADOPT',
  },
  {
    key: 'C4 exactly preserves two currency sides and 200 percent convention',
    passed: c4Default.status === 'OK'
      && c4Default.value.currencyTurnoverSum === c4Default.value.totalFxTurnover * 2
      && c4Default.value.currencyShareSumPct === 200,
  },
  {
    key: 'C5 and C6 bridges close exactly with transaction and valuation channels separated',
    passed: c5Default.status === 'OK' && c5Default.value.bridgeGap === 0 && c5Default.value.valuationChangeFrozen === 0
      && c6Default.status === 'OK' && c6Default.value.bridgeGap === 0 && c6Default.value.transactionContribution === 0,
  },
  {
    key: 'C7 default has three switches and same score can retain different prior states',
    passed: c7Default.status === 'OK' && c7Default.value.switchCount === 3 && c7Default.value.sameScoreDifferentState
      && networkReversalHysteresis({ ...internationalMonetaryCanonicalInputs.C7, exitThreshold: 60 }).status === 'STOP',
  },
] as const;

// 4.01-compatible public aliases used by the lesson UI layer.
export type ImsLabId = InternationalMonetaryLabId;
export const imsRawDomains = internationalMonetaryRawDomains;
export const imsCanonicalInputs = internationalMonetaryCanonicalInputs;
export const imsEvaluators = internationalMonetaryEvaluators;
export const parseImsRawInteger = parseInternationalMonetaryRawInteger;
