// AUTHOR DRAFT: seven independent SYN accounting contracts for lesson 4.01.
// They do not contain observed country data, a shared economy, causal estimates, PIT evidence, or policy advice.
export type BopLabId = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6' | 'C7';
export type BopDomain = Readonly<{ min: number; max: number; step: 1 }>;
export type ExactQuantity = Readonly<{ numerator: number; denominator: number; scale: 1 | 100 }>;
export type BopStop = Readonly<{ status: 'STOP'; reason: string }>;
export type BopOk = Readonly<{ status: 'OK'; value: Readonly<Record<string, unknown>>; exact: Readonly<Record<string, ExactQuantity>> }>;
export type BopResult = BopStop | BopOk;

const signed: BopDomain = Object.freeze({ min: -1000000, max: 1000000, step: 1 });
const amount: BopDomain = Object.freeze({ min: 0, max: 1000000, step: 1 });
const positive: BopDomain = Object.freeze({ min: 1, max: 1000000, step: 1 });

export const bopRawDomains = Object.freeze({
  C1: Object.freeze({ goodsExportCredit: amount, foreignDepositAcquisition: amount, tradeCreditAcquisition: amount }),
  C2: Object.freeze({
    goodsRevenue: amount, goodsExpenditure: amount, servicesRevenue: amount, servicesExpenditure: amount,
    earnedIncomeRevenue: amount, earnedIncomeExpenditure: amount, transferIncomeRevenue: amount, transferIncomeExpenditure: amount,
    capitalRevenue: amount, capitalExpenditure: amount, netAssetAcquisition: signed, netLiabilityIncurrence: signed,
  }),
  C3: Object.freeze({ assetAcquisitions: amount, assetDisposals: amount, liabilityIncurrences: amount, liabilityRepayments: amount }),
  C4: Object.freeze({ openingReserveAssets: amount, reserveTransactions: signed, exchangeRateRevaluation: signed, otherPriceRevaluation: signed, otherVolumeChange: signed }),
  C5: Object.freeze({
    openingAssets: amount, openingLiabilities: amount, assetTransactions: signed, liabilityTransactions: signed,
    assetExchangeRateChange: signed, liabilityExchangeRateChange: signed, assetOtherPriceChange: signed, liabilityOtherPriceChange: signed,
    assetOtherVolumeChange: signed, liabilityOtherVolumeChange: signed,
  }),
  C6: Object.freeze({ privateSaving: amount, privateInvestment: amount, governmentSaving: amount, governmentInvestment: amount }),
  C7: Object.freeze({
    economyAAssets: positive, economyALiabilities: positive, economyAReserveAssets: amount, economyAShortTermFxDebt: positive,
    economyBAssets: positive, economyBLiabilities: positive, economyBReserveAssets: amount, economyBShortTermFxDebt: positive,
  }),
}) satisfies Readonly<Record<BopLabId, Readonly<Record<string, BopDomain>>>>;

export const bopCanonicalInputs = Object.freeze({
  C1: Object.freeze({ goodsExportCredit: 120, foreignDepositAcquisition: 80, tradeCreditAcquisition: 40 }),
  C2: Object.freeze({
    goodsRevenue: 500, goodsExpenditure: 420, servicesRevenue: 100, servicesExpenditure: 120,
    earnedIncomeRevenue: 60, earnedIncomeExpenditure: 90, transferIncomeRevenue: 30, transferIncomeExpenditure: 20,
    capitalRevenue: 10, capitalExpenditure: 5, netAssetAcquisition: 90, netLiabilityIncurrence: 35,
  }),
  C3: Object.freeze({ assetAcquisitions: 600, assetDisposals: 500, liabilityIncurrences: 800, liabilityRepayments: 700 }),
  C4: Object.freeze({ openingReserveAssets: 500, reserveTransactions: 50, exchangeRateRevaluation: 20, otherPriceRevaluation: 0, otherVolumeChange: -10 }),
  C5: Object.freeze({
    openingAssets: 1000, openingLiabilities: 800, assetTransactions: 100, liabilityTransactions: 50,
    assetExchangeRateChange: 40, liabilityExchangeRateChange: 30, assetOtherPriceChange: -20, liabilityOtherPriceChange: 10,
    assetOtherVolumeChange: 0, liabilityOtherVolumeChange: -5,
  }),
  C6: Object.freeze({ privateSaving: 300, privateInvestment: 250, governmentSaving: 50, governmentInvestment: 80 }),
  C7: Object.freeze({
    economyAAssets: 1000, economyALiabilities: 900, economyAReserveAssets: 100, economyAShortTermFxDebt: 400,
    economyBAssets: 300, economyBLiabilities: 200, economyBReserveAssets: 80, economyBShortTermFxDebt: 40,
  }),
}) satisfies Readonly<Record<BopLabId, Readonly<Record<string, number>>>>;

function stop(reason: string): BopStop { return { status: 'STOP', reason }; }
function integer(value: number, label: string): number {
  if (!Number.isSafeInteger(value)) throw new RangeError(`中间整数不安全：${label}`);
  return value === 0 ? 0 : value;
}
function add(a: number, b: number): number { return integer(a + b, '加法'); }
function subtract(a: number, b: number): number { return integer(a - b, '减法'); }
function gcd(a: number, b: number): number {
  let x = Math.abs(integer(a, 'gcd输入')); let y = Math.abs(integer(b, 'gcd输入'));
  while (y !== 0) { const remainder = integer(x % y, 'gcd余数'); x = y; y = remainder; }
  return x;
}
function ratio(numerator: number, denominator: number, scale: 1 | 100 = 1): ExactQuantity {
  integer(numerator, '分子'); integer(denominator, '分母');
  if (denominator <= 0) throw new RangeError('精确比率分母必须严格为正。');
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator: integer(numerator / divisor, '约分分子'), denominator: integer(denominator / divisor, '约分分母'), scale });
}
export function bopExactToNumber(quantity: ExactQuantity): number {
  const value = (quantity.numerator / quantity.denominator) * quantity.scale;
  if (!Number.isFinite(value)) throw new RangeError('展示投影不是有限数。');
  return value === 0 ? 0 : value;
}
function ok(value: Record<string, unknown>, exact: Record<string, ExactQuantity> = {}): BopOk {
  return { status: 'OK', value: Object.freeze(value), exact: Object.freeze(exact) };
}
function raw(input: unknown, id: BopLabId): BopStop | Readonly<{ status: 'RAW_OK'; value: Record<string, number> }> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return stop('必须提供完整原始整数对象。');
  const domains: Readonly<Record<string, BopDomain>> = bopRawDomains[id];
  const keys = Object.keys(domains); const supplied = Reflect.ownKeys(input);
  if (supplied.length !== keys.length || supplied.some(key => typeof key !== 'string' || !Object.hasOwnProperty.call(domains, key))) return stop('原始键必须完整，且不得添加其他字段或符号键。');
  const value: Record<string, number> = {};
  for (const key of keys) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor || !('value' in descriptor)) return stop(`输入须是自有数据字段，不接受 getter：${key}`);
    const candidate: unknown = descriptor.value; const domain = domains[key];
    if (typeof candidate !== 'number' || !Number.isSafeInteger(candidate) || candidate < domain.min || candidate > domain.max) return stop(`原始输入须在声明的安全整数域内：${key}`);
    value[key] = candidate === 0 ? 0 : candidate;
  }
  return { status: 'RAW_OK', value };
}
function checked(input: unknown, id: BopLabId, calculate: (values: Record<string, number>) => BopResult): BopResult {
  const parsed = raw(input, id); if (parsed.status === 'STOP') return parsed;
  try { return calculate(parsed.value); } catch (error) { if (error instanceof RangeError) return stop(error.message); throw error; }
}
export function parseBopRawInteger(text: unknown): number | null {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!/^(?:0|-?[1-9]\d*)$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isSafeInteger(value) ? (value === 0 ? 0 : value) : null;
}

export function transactionDoubleEntry(input: unknown): BopResult {
  return checked(input, 'C1', values => {
    const counterpartDebits = add(values.foreignDepositAcquisition, values.tradeCreditAcquisition);
    const entryGap = subtract(values.goodsExportCredit, counterpartDebits);
    return ok({ ...values, counterpartDebits, entryGap, transactionBalanced: entryGap === 0, physicalCashCrossingBorderRequired: false });
  });
}

export function accountBalances(input: unknown): BopResult {
  return checked(input, 'C2', values => {
    const currentRevenues = add(add(values.goodsRevenue, values.servicesRevenue), add(values.earnedIncomeRevenue, values.transferIncomeRevenue));
    const currentExpenditures = add(add(values.goodsExpenditure, values.servicesExpenditure), add(values.earnedIncomeExpenditure, values.transferIncomeExpenditure));
    const currentAccountBalance = subtract(currentRevenues, currentExpenditures);
    const capitalAccountBalance = subtract(values.capitalRevenue, values.capitalExpenditure);
    const financialAccountBalance = subtract(values.netAssetAcquisition, values.netLiabilityIncurrence);
    const currentPlusCapital = add(currentAccountBalance, capitalAccountBalance);
    const statisticalDiscrepancy = subtract(financialAccountBalance, currentPlusCapital);
    return ok({ ...values, currentRevenues, currentExpenditures, currentAccountBalance, capitalAccountBalance, financialAccountBalance, currentPlusCapital, statisticalDiscrepancy, causalDriverIdentified: null });
  });
}

export function grossAndNetFlows(input: unknown): BopResult {
  return checked(input, 'C3', values => {
    const netAssetAcquisition = subtract(values.assetAcquisitions, values.assetDisposals);
    const netLiabilityIncurrence = subtract(values.liabilityIncurrences, values.liabilityRepayments);
    const financialAccountBalance = subtract(netAssetAcquisition, netLiabilityIncurrence);
    const grossTurnover = add(add(values.assetAcquisitions, values.assetDisposals), add(values.liabilityIncurrences, values.liabilityRepayments));
    return ok({ ...values, netAssetAcquisition, netLiabilityIncurrence, financialAccountBalance, grossTurnover, fundingStability: null, rolloverRisk: null });
  });
}

export function reserveBridge(input: unknown): BopResult {
  return checked(input, 'C4', values => {
    const revaluation = add(values.exchangeRateRevaluation, values.otherPriceRevaluation);
    const closingReserveAssets = add(add(values.openingReserveAssets, values.reserveTransactions), add(revaluation, values.otherVolumeChange));
    if (closingReserveAssets < 0) return stop('期末储备资产不得为负；请区分交易、重估和其他数量变化。');
    const nontransactionChange = add(revaluation, values.otherVolumeChange);
    return ok({ ...values, revaluation, nontransactionChange, closingReserveAssets, interventionAmount: null, reserveAdequacy: null });
  });
}

export function iipBridge(input: unknown): BopResult {
  return checked(input, 'C5', values => {
    const closingAssets = add(add(values.openingAssets, values.assetTransactions), add(add(values.assetExchangeRateChange, values.assetOtherPriceChange), values.assetOtherVolumeChange));
    const closingLiabilities = add(add(values.openingLiabilities, values.liabilityTransactions), add(add(values.liabilityExchangeRateChange, values.liabilityOtherPriceChange), values.liabilityOtherVolumeChange));
    if (closingAssets < 0 || closingLiabilities < 0) return stop('期末外部资产与负债必须保持非负。');
    const openingNetIip = subtract(values.openingAssets, values.openingLiabilities);
    const closingNetIip = subtract(closingAssets, closingLiabilities);
    const financialAccountBalance = subtract(values.assetTransactions, values.liabilityTransactions);
    const netExchangeRateChange = subtract(values.assetExchangeRateChange, values.liabilityExchangeRateChange);
    const netOtherPriceChange = subtract(values.assetOtherPriceChange, values.liabilityOtherPriceChange);
    const netOtherVolumeChange = subtract(values.assetOtherVolumeChange, values.liabilityOtherVolumeChange);
    const explainedNetIipChange = add(financialAccountBalance, add(add(netExchangeRateChange, netOtherPriceChange), netOtherVolumeChange));
    const actualNetIipChange = subtract(closingNetIip, openingNetIip);
    return ok({ ...values, closingAssets, closingLiabilities, openingNetIip, closingNetIip, financialAccountBalance, netExchangeRateChange, netOtherPriceChange, netOtherVolumeChange, explainedNetIipChange, actualNetIipChange, bridgeGap: subtract(actualNetIipChange, explainedNetIipChange) });
  });
}

export function savingInvestmentIdentity(input: unknown): BopResult {
  return checked(input, 'C6', values => {
    const privateGap = subtract(values.privateSaving, values.privateInvestment);
    const governmentGap = subtract(values.governmentSaving, values.governmentInvestment);
    const nationalSaving = add(values.privateSaving, values.governmentSaving);
    const nationalInvestment = add(values.privateInvestment, values.governmentInvestment);
    const impliedCurrentAccountBalance = subtract(nationalSaving, nationalInvestment);
    return ok({ ...values, privateGap, governmentGap, nationalSaving, nationalInvestment, impliedCurrentAccountBalance, causalAdjustmentPath: null });
  });
}

export function sameNetDifferentStructure(input: unknown): BopResult {
  return checked(input, 'C7', values => {
    if (values.economyAReserveAssets > values.economyAAssets || values.economyBReserveAssets > values.economyBAssets) return stop('储备资产不得超过题设总外部资产。');
    if (values.economyAShortTermFxDebt > values.economyALiabilities || values.economyBShortTermFxDebt > values.economyBLiabilities) return stop('短期外币债务不得超过题设总外部负债。');
    const economyANetIip = subtract(values.economyAAssets, values.economyALiabilities);
    const economyBNetIip = subtract(values.economyBAssets, values.economyBLiabilities);
    const economyAGrossPosition = add(values.economyAAssets, values.economyALiabilities);
    const economyBGrossPosition = add(values.economyBAssets, values.economyBLiabilities);
    const economyAReserveCoverage = ratio(values.economyAReserveAssets, values.economyAShortTermFxDebt, 100);
    const economyBReserveCoverage = ratio(values.economyBReserveAssets, values.economyBShortTermFxDebt, 100);
    return ok({
      ...values, economyANetIip, economyBNetIip, sameNetIip: economyANetIip === economyBNetIip,
      economyAGrossPosition, economyBGrossPosition,
      economyAReserveCoveragePercent: bopExactToNumber(economyAReserveCoverage),
      economyBReserveCoveragePercent: bopExactToNumber(economyBReserveCoverage),
      crisisProbability: null, liquidityAdequacy: null,
    }, { economyAReserveCoveragePercent: economyAReserveCoverage, economyBReserveCoveragePercent: economyBReserveCoverage });
  });
}

export const bopEvaluators = Object.freeze({
  C1: transactionDoubleEntry,
  C2: accountBalances,
  C3: grossAndNetFlows,
  C4: reserveBridge,
  C5: iipBridge,
  C6: savingInvestmentIdentity,
  C7: sameNetDifferentStructure,
});
