// AUTHOR DRAFT: six independent SYN contracts for lesson 4.03.
// No value below is observed data, a real issuer, a real currency, a policy threshold,
// a causal estimate, PIT/OOS evidence, a sovereign rating or a production signal.

export type SafeAssetLabId = 'C1' | 'C3' | 'C5' | 'C6' | 'C7' | 'C8';
export type SafeAssetUseCase = 'INTERVENTION' | 'COLLATERAL_FUNDING' | 'VALUE_PARKING';
export type SafeAssetMarketState = 'NORMAL' | 'STRESS';
export type MatchState = 'MATCH' | 'MISMATCH';

export type SafeAssetNumericDomain = Readonly<{
  min: number;
  max: number;
  step: number;
  scale: 1 | 10 | 100 | 1_000 | 10_000;
  kind: 'integer' | 'decimal';
}>;

export type SafeAssetExactQuantity = Readonly<{ numerator: string; denominator: string }>;
export type SafeAssetStop = Readonly<{ status: 'STOP'; reason: string }>;
export type SafeAssetOk<T extends object> = Readonly<{
  status: 'OK';
  value: Readonly<T>;
  exact: Readonly<Partial<Record<keyof T & string, SafeAssetExactQuantity>>>;
}>;
export type SafeAssetResult<T extends object> = SafeAssetStop | SafeAssetOk<T>;

export type ServiceDimension =
  | 'creditSafety'
  | 'nominalPriceStability'
  | 'marketLiquidity'
  | 'legalOperationalAccess'
  | 'collateralUsability'
  | 'badStatePerformance';

export type C1Input = Readonly<{
  useCase: SafeAssetUseCase;
  marketState: SafeAssetMarketState;
  creditSafety: number;
  nominalPriceStability: number;
  marketLiquidity: number;
  legalOperationalAccess: number;
  collateralUsability: number;
  badStatePerformance: number;
}>;

export type C3Input = Readonly<{
  comparatorYieldPct: number;
  serviceAssetYieldPct: number;
  currencyMatch: MatchState;
  maturityMatch: MatchState;
  cashflowMatch: MatchState;
  creditMatch: MatchState;
  taxMatch: MatchState;
  hedgeCostMatch: MatchState;
}>;

export type C5Input = Readonly<{
  pricePerUnit: number;
  quantity: number;
  eligibilityPct: number;
  availabilityPct: number;
  haircutPct: number;
}>;

export type C6Input = Readonly<{
  grossOutstanding: number;
  availablePct: number;
  eligiblePct: number;
  unencumberedPct: number;
  marketCapacityPct: number;
}>;

export type C7Input = Readonly<{
  issuedQuantity: number;
  baseDepthServiceBps: number;
  depthGainBpsPerUnit: number;
  constraintTriggerQuantity: number;
  erosionBpsPerExcessUnit: number;
}>;

export type C8Input = Readonly<{
  openingCurrencyValue: number;
  principalTransactions: number;
  incomeReinvestment: number;
  fxValuation: number;
  priceValuation: number;
  coverageChange: number;
  pathADepositValue: number;
  pathABondQuantity: number;
  pathABondPrice: number;
  pathAOtherClaimsValue: number;
  pathBDepositValue: number;
  pathBBondQuantity: number;
  pathBBondPrice: number;
  pathBOtherClaimsValue: number;
}>;

export type SafeAssetInputsById = {
  C1: C1Input;
  C3: C3Input;
  C5: C5Input;
  C6: C6Input;
  C7: C7Input;
  C8: C8Input;
};

export type C1Output = {
  contextKey: string;
  serviceVector: Readonly<Record<ServiceDimension, number>>;
  independentDimensionCount: 6;
  priorityDimensions: readonly ServiceDimension[];
  priorityDimensionCount: number;
  lowestDimension: ServiceDimension;
  lowestScore: number;
  priorityLowestDimension: ServiceDimension;
  priorityLowestScore: number;
  singleSafetyLabel: null;
  singleCompositeScore: null;
};

export type C3Output = {
  comparatorYieldPct: number;
  serviceAssetYieldPct: number;
  convenienceYieldBps: number;
  matchedDimensionCount: 6;
  failedDeclaredMatchDimensions: readonly string[];
  declaredMatchGatesPassed: true;
};

export type C5Output = {
  grossMarketValue: number;
  eligibilityAdjustedValue: number;
  availableEligibleValue: number;
  cashCapacity: number;
  haircutDeduction: number;
  counterpartyWillingnessInferred: false;
};

export type C6Output = {
  grossOutstanding: number;
  availableCapacity: number;
  eligibleCapacity: number;
  unencumberedCapacity: number;
  qEff: number;
  totalCapacityLoss: number;
  retentionPct: number | null;
};

export type SupplyCurvePoint = Readonly<{
  issuedQuantity: number;
  depthServicePct: number;
  credibilityServicePct: number;
  bindingServicePct: number;
  effectiveSafeCapacity: number;
}>;

export type C7Output = {
  issuedQuantity: number;
  depthServicePct: number;
  credibilityServicePct: number;
  bindingServicePct: number;
  effectiveSafeCapacity: number;
  curve: readonly SupplyCurvePoint[];
  illustrativeGridPeakQuantity: number;
  illustrativeGridPeakCapacity: number;
  curveTurnsDown: boolean;
  realWorldThresholdEstimated: false;
  policyOptimumComputed: false;
};

export type C8Output = {
  closingCurrencyValue: number;
  bridgeChange: number;
  pathABondValue: number;
  pathATotalValue: number;
  pathBBondValue: number;
  pathBTotalValue: number;
  pathABridgeGap: 0;
  pathBBridgeGap: 0;
  bondQuantityDifference: number;
  aggregateValuesEquivalent: true;
  specificBondQuantityIdentified: false;
  identifiedBondQuantity: null;
};

export type SafeAssetOutputsById = {
  C1: C1Output;
  C3: C3Output;
  C5: C5Output;
  C6: C6Output;
  C7: C7Output;
  C8: C8Output;
};

const integer = (min: number, max: number): SafeAssetNumericDomain => Object.freeze({ min, max, step: 1, scale: 1, kind: 'integer' });
const decimal2 = (min: number, max: number, step = 0.01): SafeAssetNumericDomain => Object.freeze({ min, max, step, scale: 100, kind: 'decimal' });
const score = integer(0, 100);
const percent2 = decimal2(0, 100);
const signedAmount = integer(-1_000_000, 1_000_000);

export const safeAssetRawDomains = Object.freeze({
  C1: Object.freeze({
    creditSafety: score,
    nominalPriceStability: score,
    marketLiquidity: score,
    legalOperationalAccess: score,
    collateralUsability: score,
    badStatePerformance: score,
  }),
  C3: Object.freeze({
    comparatorYieldPct: decimal2(-20, 20),
    serviceAssetYieldPct: decimal2(-20, 20),
  }),
  C5: Object.freeze({
    pricePerUnit: decimal2(0, 10_000),
    quantity: integer(0, 1_000_000),
    eligibilityPct: percent2,
    availabilityPct: percent2,
    haircutPct: percent2,
  }),
  C6: Object.freeze({
    grossOutstanding: integer(0, 1_000_000),
    availablePct: percent2,
    eligiblePct: percent2,
    unencumberedPct: percent2,
    marketCapacityPct: percent2,
  }),
  C7: Object.freeze({
    issuedQuantity: integer(0, 200),
    baseDepthServiceBps: integer(0, 10_000),
    depthGainBpsPerUnit: integer(0, 1_000),
    constraintTriggerQuantity: integer(0, 200),
    erosionBpsPerExcessUnit: integer(0, 1_000),
  }),
  C8: Object.freeze({
    openingCurrencyValue: integer(0, 1_000_000),
    principalTransactions: signedAmount,
    incomeReinvestment: signedAmount,
    fxValuation: signedAmount,
    priceValuation: signedAmount,
    coverageChange: signedAmount,
    pathADepositValue: integer(0, 1_000_000),
    pathABondQuantity: integer(0, 1_000_000),
    pathABondPrice: decimal2(0, 10_000),
    pathAOtherClaimsValue: integer(0, 1_000_000),
    pathBDepositValue: integer(0, 1_000_000),
    pathBBondQuantity: integer(0, 1_000_000),
    pathBBondPrice: decimal2(0, 10_000),
    pathBOtherClaimsValue: integer(0, 1_000_000),
  }),
}) satisfies Readonly<Record<SafeAssetLabId, Readonly<Record<string, SafeAssetNumericDomain>>>>;

export const safeAssetCanonicalInputs = Object.freeze({
  C1: Object.freeze({
    useCase: 'INTERVENTION', marketState: 'STRESS',
    creditSafety: 95, nominalPriceStability: 80, marketLiquidity: 72,
    legalOperationalAccess: 90, collateralUsability: 65, badStatePerformance: 60,
  }),
  C3: Object.freeze({
    comparatorYieldPct: 4.75, serviceAssetYieldPct: 4.55,
    currencyMatch: 'MATCH', maturityMatch: 'MATCH', cashflowMatch: 'MATCH',
    creditMatch: 'MATCH', taxMatch: 'MATCH', hedgeCostMatch: 'MATCH',
  }),
  C5: Object.freeze({ pricePerUnit: 100.25, quantity: 1_000, eligibilityPct: 90, availabilityPct: 80, haircutPct: 5 }),
  C6: Object.freeze({ grossOutstanding: 1_000, availablePct: 80, eligiblePct: 90, unencumberedPct: 75, marketCapacityPct: 80 }),
  C7: Object.freeze({ issuedQuantity: 140, baseDepthServiceBps: 2_000, depthGainBpsPerUnit: 100, constraintTriggerQuantity: 100, erosionBpsPerExcessUnit: 150 }),
  C8: Object.freeze({
    openingCurrencyValue: 1_000,
    principalTransactions: 80, incomeReinvestment: 10, fxValuation: -20, priceValuation: 15, coverageChange: 5,
    pathADepositValue: 300, pathABondQuantity: 500, pathABondPrice: 1, pathAOtherClaimsValue: 290,
    pathBDepositValue: 500, pathBBondQuantity: 300, pathBBondPrice: 1.5, pathBOtherClaimsValue: 140,
  }),
}) satisfies Readonly<{ [K in SafeAssetLabId]: SafeAssetInputsById[K] }>;

function stop(reason: string): SafeAssetStop { return { status: 'STOP', reason }; }

function isStop(value: unknown): value is SafeAssetStop {
  return value !== null && typeof value === 'object' && (value as { status?: unknown }).status === 'STOP';
}

function exact(numerator: bigint, denominator: bigint = BigInt(1)): SafeAssetExactQuantity {
  if (denominator <= BigInt(0)) throw new RangeError('精确量分母必须严格为正。');
  const gcd = (a: bigint, b: bigint): bigint => {
    let x = a < BigInt(0) ? -a : a;
    let y = b < BigInt(0) ? -b : b;
    while (y !== BigInt(0)) { const remainder = x % y; x = y; y = remainder; }
    return x;
  };
  const divisor = gcd(numerator, denominator);
  return Object.freeze({ numerator: (numerator / divisor).toString(), denominator: (denominator / divisor).toString() });
}

function rational(quantity: SafeAssetExactQuantity): Readonly<{ n: bigint; d: bigint }> {
  return Object.freeze({ n: BigInt(quantity.numerator), d: BigInt(quantity.denominator) });
}

function addExact(a: SafeAssetExactQuantity, b: SafeAssetExactQuantity): SafeAssetExactQuantity {
  const left = rational(a); const right = rational(b);
  return exact(left.n * right.d + right.n * left.d, left.d * right.d);
}

function subtractExact(a: SafeAssetExactQuantity, b: SafeAssetExactQuantity): SafeAssetExactQuantity {
  const left = rational(a); const right = rational(b);
  return exact(left.n * right.d - right.n * left.d, left.d * right.d);
}

function multiplyExact(a: SafeAssetExactQuantity, b: SafeAssetExactQuantity): SafeAssetExactQuantity {
  const left = rational(a); const right = rational(b);
  return exact(left.n * right.n, left.d * right.d);
}

function compareExact(a: SafeAssetExactQuantity, b: SafeAssetExactQuantity): number {
  const left = rational(a); const right = rational(b);
  const difference = left.n * right.d - right.n * left.d;
  return difference < BigInt(0) ? -1 : difference > BigInt(0) ? 1 : 0;
}

export function safeAssetExactToNumber(quantity: SafeAssetExactQuantity): number {
  const value = Number(BigInt(quantity.numerator)) / Number(BigInt(quantity.denominator));
  if (!Number.isFinite(value)) throw new RangeError('精确量展示投影不是有限数。');
  return value === 0 ? 0 : value;
}

function ok<T extends object>(
  value: T,
  exactValues: Partial<Record<keyof T & string, SafeAssetExactQuantity>> = {},
): SafeAssetOk<T> {
  return { status: 'OK', value: Object.freeze(value), exact: Object.freeze(exactValues) };
}

function ownDataObject(input: unknown, expectedKeys: readonly string[]): SafeAssetStop | Readonly<Record<string, unknown>> {
  if (input === null || typeof input !== 'object' || Array.isArray(input)) return stop('必须提供完整原始对象。');
  const supplied = Reflect.ownKeys(input);
  if (supplied.length !== expectedKeys.length || supplied.some(key => typeof key !== 'string' || !expectedKeys.includes(key))) {
    return stop('原始键必须完整，且不得添加其他字段或符号键。');
  }
  const values: Record<string, unknown> = {};
  for (const key of expectedKeys) {
    const descriptor = Object.getOwnPropertyDescriptor(input, key);
    if (!descriptor || !('value' in descriptor)) return stop(`输入须是自有数据字段，不接受getter：${key}`);
    values[key] = descriptor.value;
  }
  return Object.freeze(values);
}

function scaledInteger(value: unknown, domain: SafeAssetNumericDomain, key: string): SafeAssetStop | number {
  if (typeof value !== 'number' || !Number.isFinite(value) || Object.is(value, -0)) return stop(`输入必须是有限且非负零的数：${key}`);
  if (value < domain.min || value > domain.max) return stop(`输入超出声明范围：${key}`);
  const scaled = Math.round(value * domain.scale);
  if (!Number.isSafeInteger(scaled) || Math.abs(value - scaled / domain.scale) > 1e-10) {
    return stop(`输入小数位超过声明精度或无法安全缩放：${key}`);
  }
  const scaledStep = Math.round(domain.step * domain.scale);
  const scaledMin = Math.round(domain.min * domain.scale);
  if ((scaled - scaledMin) % scaledStep !== 0) return stop(`输入不符合声明步长：${key}`);
  return scaled === 0 ? 0 : scaled;
}

function numericInput<K extends SafeAssetLabId>(
  raw: Readonly<Record<string, unknown>>,
  id: K,
): SafeAssetStop | Readonly<Record<string, number>> {
  const domains = safeAssetRawDomains[id] as Readonly<Record<string, SafeAssetNumericDomain>>;
  const parsed: Record<string, number> = {};
  for (const [key, domain] of Object.entries(domains)) {
    const value = scaledInteger(raw[key], domain, key);
    if (isStop(value)) return value;
    parsed[key] = value;
  }
  return Object.freeze(parsed);
}

function checked<T extends object>(calculate: () => SafeAssetResult<T>): SafeAssetResult<T> {
  try { return calculate(); } catch (error) { if (error instanceof RangeError) return stop(error.message); throw error; }
}

export function parseSafeAssetRawInteger(text: unknown): number | null {
  if (typeof text !== 'string') return null;
  const trimmed = text.trim();
  if (!/^(?:0|-[1-9]\d*|[1-9]\d*)$/.test(trimmed)) return null;
  const value = Number(trimmed);
  return Number.isSafeInteger(value) && !Object.is(value, -0) ? (value === 0 ? 0 : value) : null;
}

export function parseSafeAssetRawDecimal(text: unknown, fractionDigits = 2): number | null {
  if (typeof text !== 'string' || !Number.isSafeInteger(fractionDigits) || fractionDigits < 0 || fractionDigits > 4) return null;
  const trimmed = text.trim();
  const pattern = fractionDigits === 0
    ? /^(?:0|-[1-9]\d*|[1-9]\d*)$/
    : new RegExp(`^-?(?:0|[1-9]\\d*)(?:\\.\\d{1,${fractionDigits}})?$`);
  if (!pattern.test(trimmed) || /^-0(?:\.0+)?$/.test(trimmed)) return null;
  const value = Number(trimmed);
  const scale = 10 ** fractionDigits;
  const scaled = Math.round(value * scale);
  if (!Number.isFinite(value) || !Number.isSafeInteger(scaled) || Math.abs(value - scaled / scale) > 1e-10 || Object.is(value, -0)) return null;
  return value === 0 ? 0 : value;
}

const dimensions = (...values: ServiceDimension[]): readonly ServiceDimension[] => Object.freeze(values);

const c1Priorities = Object.freeze({
  INTERVENTION: Object.freeze({
    NORMAL: dimensions('marketLiquidity', 'legalOperationalAccess'),
    STRESS: dimensions('nominalPriceStability', 'marketLiquidity', 'legalOperationalAccess', 'badStatePerformance'),
  }),
  COLLATERAL_FUNDING: Object.freeze({
    NORMAL: dimensions('marketLiquidity', 'collateralUsability'),
    STRESS: dimensions('marketLiquidity', 'legalOperationalAccess', 'collateralUsability', 'badStatePerformance'),
  }),
  VALUE_PARKING: Object.freeze({
    NORMAL: dimensions('creditSafety', 'nominalPriceStability'),
    STRESS: dimensions('creditSafety', 'nominalPriceStability', 'marketLiquidity', 'badStatePerformance'),
  }),
}) satisfies Readonly<Record<SafeAssetUseCase, Readonly<Record<SafeAssetMarketState, readonly ServiceDimension[]>>>>;

const serviceDimensions = Object.freeze([
  'creditSafety', 'nominalPriceStability', 'marketLiquidity',
  'legalOperationalAccess', 'collateralUsability', 'badStatePerformance',
] as const satisfies readonly ServiceDimension[]);

export function serviceVectorByUseAndState(input: unknown): SafeAssetResult<C1Output> {
  return checked(() => {
    const keys = ['useCase', 'marketState', ...serviceDimensions] as const;
    const raw = ownDataObject(input, keys); if (isStop(raw)) return raw;
    const useCase = raw.useCase;
    const marketState = raw.marketState;
    if (useCase !== 'INTERVENTION' && useCase !== 'COLLATERAL_FUNDING' && useCase !== 'VALUE_PARKING') return stop('useCase必须是声明的严格枚举。');
    if (marketState !== 'NORMAL' && marketState !== 'STRESS') return stop('marketState必须是声明的严格枚举。');
    const parsed = numericInput(raw, 'C1'); if (isStop(parsed)) return parsed;
    const vector = Object.freeze(Object.fromEntries(serviceDimensions.map(key => [key, parsed[key] / safeAssetRawDomains.C1[key].scale])) as Record<ServiceDimension, number>);
    const priorities = c1Priorities[useCase][marketState];
    const lowestDimension = serviceDimensions.reduce((lowest, key) => vector[key] < vector[lowest] ? key : lowest);
    const priorityLowestDimension = priorities.reduce((lowest, key) => vector[key] < vector[lowest] ? key : lowest);
    return ok({
      contextKey: `${useCase}:${marketState}`,
      serviceVector: vector,
      independentDimensionCount: 6,
      priorityDimensions: priorities,
      priorityDimensionCount: priorities.length,
      lowestDimension,
      lowestScore: vector[lowestDimension],
      priorityLowestDimension,
      priorityLowestScore: vector[priorityLowestDimension],
      singleSafetyLabel: null,
      singleCompositeScore: null,
    });
  });
}

const c3MatchKeys = Object.freeze(['currencyMatch', 'maturityMatch', 'cashflowMatch', 'creditMatch', 'taxMatch', 'hedgeCostMatch'] as const);
const c3MatchLabels: Readonly<Record<(typeof c3MatchKeys)[number], string>> = Object.freeze({
  currencyMatch: '币种', maturityMatch: '期限', cashflowMatch: '现金流',
  creditMatch: '信用风险', taxMatch: '税收', hedgeCostMatch: '套保成本',
});

export function matchedConvenienceYield(input: unknown): SafeAssetResult<C3Output> {
  return checked(() => {
    const keys = ['comparatorYieldPct', 'serviceAssetYieldPct', ...c3MatchKeys] as const;
    const raw = ownDataObject(input, keys); if (isStop(raw)) return raw;
    const failedDeclaredMatches: string[] = [];
    for (const key of c3MatchKeys) {
      if (raw[key] !== 'MATCH' && raw[key] !== 'MISMATCH') return stop(`${key}必须是MATCH或MISMATCH。`);
      if (raw[key] === 'MISMATCH') failedDeclaredMatches.push(c3MatchLabels[key]);
    }
    if (failedDeclaredMatches.length > 0) return stop(`声明控制门未通过：${failedDeclaredMatches.join('、')}；不显示便利收益候选。`);
    const parsed = numericInput(raw, 'C3'); if (isStop(parsed)) return parsed;
    const comparatorScaled = parsed.comparatorYieldPct;
    const serviceScaled = parsed.serviceAssetYieldPct;
    const convenience = exact(BigInt(comparatorScaled - serviceScaled));
    return ok({
      comparatorYieldPct: comparatorScaled / 100,
      serviceAssetYieldPct: serviceScaled / 100,
      convenienceYieldBps: safeAssetExactToNumber(convenience),
      matchedDimensionCount: 6,
      failedDeclaredMatchDimensions: Object.freeze([]),
      declaredMatchGatesPassed: true,
    }, { convenienceYieldBps: convenience });
  });
}

export function collateralCashCapacity(input: unknown): SafeAssetResult<C5Output> {
  return checked(() => {
    const keys = Object.keys(safeAssetRawDomains.C5);
    const raw = ownDataObject(input, keys); if (isStop(raw)) return raw;
    const parsed = numericInput(raw, 'C5'); if (isStop(parsed)) return parsed;
    const price = exact(BigInt(parsed.pricePerUnit), BigInt(100));
    const quantity = exact(BigInt(parsed.quantity));
    const eligibility = exact(BigInt(parsed.eligibilityPct), BigInt(10_000));
    const availability = exact(BigInt(parsed.availabilityPct), BigInt(10_000));
    const retention = exact(BigInt(10_000 - parsed.haircutPct), BigInt(10_000));
    const gross = multiplyExact(price, quantity);
    const eligible = multiplyExact(gross, eligibility);
    const availableEligible = multiplyExact(eligible, availability);
    const cash = multiplyExact(availableEligible, retention);
    const haircutDeduction = subtractExact(availableEligible, cash);
    return ok({
      grossMarketValue: safeAssetExactToNumber(gross),
      eligibilityAdjustedValue: safeAssetExactToNumber(eligible),
      availableEligibleValue: safeAssetExactToNumber(availableEligible),
      cashCapacity: safeAssetExactToNumber(cash),
      haircutDeduction: safeAssetExactToNumber(haircutDeduction),
      counterpartyWillingnessInferred: false,
    }, {
      grossMarketValue: gross, eligibilityAdjustedValue: eligible,
      availableEligibleValue: availableEligible, cashCapacity: cash, haircutDeduction,
    });
  });
}

export function effectiveCapacityFunnel(input: unknown): SafeAssetResult<C6Output> {
  return checked(() => {
    const keys = Object.keys(safeAssetRawDomains.C6);
    const raw = ownDataObject(input, keys); if (isStop(raw)) return raw;
    const parsed = numericInput(raw, 'C6'); if (isStop(parsed)) return parsed;
    const gross = exact(BigInt(parsed.grossOutstanding));
    const available = multiplyExact(gross, exact(BigInt(parsed.availablePct), BigInt(10_000)));
    const eligible = multiplyExact(available, exact(BigInt(parsed.eligiblePct), BigInt(10_000)));
    const unencumbered = multiplyExact(eligible, exact(BigInt(parsed.unencumberedPct), BigInt(10_000)));
    const qEff = multiplyExact(unencumbered, exact(BigInt(parsed.marketCapacityPct), BigInt(10_000)));
    const loss = subtractExact(gross, qEff);
    const retention = parsed.grossOutstanding === 0
      ? null
      : multiplyExact(exact(BigInt(100)), exact(BigInt(parsed.availablePct) * BigInt(parsed.eligiblePct) * BigInt(parsed.unencumberedPct) * BigInt(parsed.marketCapacityPct), BigInt(10_000) ** BigInt(4)));
    return ok({
      grossOutstanding: parsed.grossOutstanding,
      availableCapacity: safeAssetExactToNumber(available),
      eligibleCapacity: safeAssetExactToNumber(eligible),
      unencumberedCapacity: safeAssetExactToNumber(unencumbered),
      qEff: safeAssetExactToNumber(qEff),
      totalCapacityLoss: safeAssetExactToNumber(loss),
      retentionPct: retention === null ? null : safeAssetExactToNumber(retention),
    }, {
      availableCapacity: available, eligibleCapacity: eligible,
      unencumberedCapacity: unencumbered, qEff, totalCapacityLoss: loss,
      ...(retention === null ? {} : { retentionPct: retention }),
    });
  });
}

function supplyPoint(quantity: number, parsed: Readonly<Record<string, number>>): SupplyCurvePoint {
  const depthBps = Math.min(10_000, parsed.baseDepthServiceBps + quantity * parsed.depthGainBpsPerUnit);
  const excess = Math.max(0, quantity - parsed.constraintTriggerQuantity);
  const credibilityBps = Math.max(0, 10_000 - excess * parsed.erosionBpsPerExcessUnit);
  const bindingBps = Math.min(depthBps, credibilityBps);
  const effective = quantity * bindingBps / 10_000;
  if (![depthBps, credibilityBps, bindingBps, effective].every(Number.isFinite)) throw new RangeError('非单调曲线产生非有限数。');
  return Object.freeze({
    issuedQuantity: quantity,
    depthServicePct: depthBps / 100,
    credibilityServicePct: credibilityBps / 100,
    bindingServicePct: bindingBps / 100,
    effectiveSafeCapacity: effective === 0 ? 0 : effective,
  });
}

export function nonMonotonicSupplyCurve(input: unknown): SafeAssetResult<C7Output> {
  return checked(() => {
    const keys = Object.keys(safeAssetRawDomains.C7);
    const raw = ownDataObject(input, keys); if (isStop(raw)) return raw;
    const parsed = numericInput(raw, 'C7'); if (isStop(parsed)) return parsed;
    if (parsed.depthGainBpsPerUnit === 0 || parsed.erosionBpsPerExcessUnit === 0) {
      return stop('教学驼峰要求深度增益与约束侵蚀斜率都严格为正。');
    }
    const curve = Object.freeze(Array.from({ length: 11 }, (_, index) => supplyPoint(index * 20, parsed)));
    const current = supplyPoint(parsed.issuedQuantity, parsed);
    const peak = curve.reduce((best, point) => point.effectiveSafeCapacity > best.effectiveSafeCapacity ? point : best);
    const peakIndex = curve.indexOf(peak);
    const hasRise = curve.slice(1, peakIndex + 1).some((point, index) => point.effectiveSafeCapacity > curve[index].effectiveSafeCapacity);
    const hasFall = curve.slice(peakIndex + 1).some(point => point.effectiveSafeCapacity < peak.effectiveSafeCapacity);
    if (!hasRise || !hasFall) {
      return stop('当前参数没有在固定0–200教学网格上同时形成上升段与下降段；不得把单调或平坦曲线冒充本实验的非单调机制。');
    }
    return ok({
      issuedQuantity: current.issuedQuantity,
      depthServicePct: current.depthServicePct,
      credibilityServicePct: current.credibilityServicePct,
      bindingServicePct: current.bindingServicePct,
      effectiveSafeCapacity: current.effectiveSafeCapacity,
      curve,
      illustrativeGridPeakQuantity: peak.issuedQuantity,
      illustrativeGridPeakCapacity: peak.effectiveSafeCapacity,
      curveTurnsDown: hasRise && hasFall,
      realWorldThresholdEstimated: false,
      policyOptimumComputed: false,
    });
  });
}

export function coferInstrumentIdentificationBridge(input: unknown): SafeAssetResult<C8Output> {
  return checked(() => {
    const keys = Object.keys(safeAssetRawDomains.C8);
    const raw = ownDataObject(input, keys); if (isStop(raw)) return raw;
    const parsed = numericInput(raw, 'C8'); if (isStop(parsed)) return parsed;
    const integerExact = (key: keyof C8Input): SafeAssetExactQuantity => exact(BigInt(parsed[key]));
    const opening = integerExact('openingCurrencyValue');
    const bridgeChange = ['principalTransactions', 'incomeReinvestment', 'fxValuation', 'priceValuation', 'coverageChange']
      .map(key => integerExact(key as keyof C8Input))
      .reduce(addExact, exact(BigInt(0)));
    const closing = addExact(opening, bridgeChange);
    if (compareExact(closing, exact(BigInt(0))) < 0) return stop('存量桥不得产生负的期末币种总市场价值。');
    const pathABond = multiplyExact(exact(BigInt(parsed.pathABondQuantity)), exact(BigInt(parsed.pathABondPrice), BigInt(100)));
    const pathBBond = multiplyExact(exact(BigInt(parsed.pathBBondQuantity)), exact(BigInt(parsed.pathBBondPrice), BigInt(100)));
    const pathATotal = addExact(addExact(integerExact('pathADepositValue'), pathABond), integerExact('pathAOtherClaimsValue'));
    const pathBTotal = addExact(addExact(integerExact('pathBDepositValue'), pathBBond), integerExact('pathBOtherClaimsValue'));
    const gapA = subtractExact(pathATotal, closing);
    const gapB = subtractExact(pathBTotal, closing);
    if (compareExact(gapA, exact(BigInt(0))) !== 0 || compareExact(gapB, exact(BigInt(0))) !== 0) {
      return stop('两条工具路径都必须精确闭合到同一个币种总市场价值；不得用残差伪装等价。');
    }
    const quantityDifference = Math.abs(parsed.pathABondQuantity - parsed.pathBBondQuantity);
    if (quantityDifference === 0) return stop('教学识别桥要求两条等价路径具有不同的债券数量。');
    return ok({
      closingCurrencyValue: safeAssetExactToNumber(closing),
      bridgeChange: safeAssetExactToNumber(bridgeChange),
      pathABondValue: safeAssetExactToNumber(pathABond),
      pathATotalValue: safeAssetExactToNumber(pathATotal),
      pathBBondValue: safeAssetExactToNumber(pathBBond),
      pathBTotalValue: safeAssetExactToNumber(pathBTotal),
      pathABridgeGap: 0,
      pathBBridgeGap: 0,
      bondQuantityDifference: quantityDifference,
      aggregateValuesEquivalent: true,
      specificBondQuantityIdentified: false,
      identifiedBondQuantity: null,
    }, {
      closingCurrencyValue: closing, bridgeChange,
      pathABondValue: pathABond, pathATotalValue: pathATotal,
      pathBBondValue: pathBBond, pathBTotalValue: pathBTotal,
      pathABridgeGap: gapA, pathBBridgeGap: gapB,
    });
  });
}

export const safeAssetEvaluators = Object.freeze({
  C1: serviceVectorByUseAndState,
  C3: matchedConvenienceYield,
  C5: collateralCashCapacity,
  C6: effectiveCapacityFunnel,
  C7: nonMonotonicSupplyCurve,
  C8: coferInstrumentIdentificationBridge,
}) satisfies { [K in SafeAssetLabId]: (input: unknown) => SafeAssetResult<SafeAssetOutputsById[K]> };

function finiteDeep(value: unknown): boolean {
  if (typeof value === 'number') return Number.isFinite(value) && !Object.is(value, -0);
  if (value === null || typeof value === 'string' || typeof value === 'boolean') return true;
  if (Array.isArray(value)) return value.every(finiteDeep);
  if (typeof value === 'object') return Object.values(value).every(finiteDeep);
  return false;
}

const defaultResults = [
  serviceVectorByUseAndState(safeAssetCanonicalInputs.C1),
  matchedConvenienceYield(safeAssetCanonicalInputs.C3),
  collateralCashCapacity(safeAssetCanonicalInputs.C5),
  effectiveCapacityFunnel(safeAssetCanonicalInputs.C6),
  nonMonotonicSupplyCurve(safeAssetCanonicalInputs.C7),
  coferInstrumentIdentificationBridge(safeAssetCanonicalInputs.C8),
] as const;

const c1Normal = serviceVectorByUseAndState({ ...safeAssetCanonicalInputs.C1, marketState: 'NORMAL' });
const c3Negative = matchedConvenienceYield({ ...safeAssetCanonicalInputs.C3, comparatorYieldPct: 4.4 });
const c5ZeroEligibility = collateralCashCapacity({ ...safeAssetCanonicalInputs.C5, eligibilityPct: 0 });
const c5FullHaircut = collateralCashCapacity({ ...safeAssetCanonicalInputs.C5, haircutPct: 100 });
const c6AllRetained = effectiveCapacityFunnel({ grossOutstanding: 1_000, availablePct: 100, eligiblePct: 100, unencumberedPct: 100, marketCapacityPct: 100 });
const c6ZeroLayer = effectiveCapacityFunnel({ ...safeAssetCanonicalInputs.C6, eligiblePct: 0 });
const c6ZeroGross = effectiveCapacityFunnel({ ...safeAssetCanonicalInputs.C6, grossOutstanding: 0 });
const c8Default = defaultResults[5];

/** Finite AUTHOR mechanical checks; never an independent content review or real-data validation. */
export const safeAssetFixtureAudit = [
  {
    key: 'six independent canonical defaults return finite OK outputs',
    passed: defaultResults.length === 6 && defaultResults.every(result => result.status === 'OK' && finiteDeep(result.value) && finiteDeep(result.exact)),
  },
  {
    key: 'strict integer and finite-decimal parsers reject blank exponent plus negative-zero overflow and excess precision',
    passed: ['', '1.5', '1e3', '+1', '-0', '01', String(Number.MAX_SAFE_INTEGER + 1)].every(value => parseSafeAssetRawInteger(value) === null)
      && ['', '1e3', '+1.2', '-0', '-0.00', '.5', '1.', '01.5', '1.234'].every(value => parseSafeAssetRawDecimal(value, 2) === null)
      && parseSafeAssetRawInteger('-12') === -12
      && parseSafeAssetRawDecimal('4.75', 2) === 4.75
      && parseSafeAssetRawDecimal('-1.25', 2) === -1.25
      && parseSafeAssetRawDecimal('-0.25', 2) === -0.25
      && parseSafeAssetRawDecimal('-0.99', 2) === -0.99,
  },
  {
    key: 'C1 retains six independent dimensions and changes priority set by use-state without creating a single safety label',
    passed: defaultResults[0].status === 'OK' && c1Normal.status === 'OK'
      && defaultResults[0].value.independentDimensionCount === 6
      && defaultResults[0].value.priorityDimensionCount === 4
      && c1Normal.value.priorityDimensionCount === 2
      && defaultResults[0].value.singleSafetyLabel === null
      && defaultResults[0].value.singleCompositeScore === null,
  },
  {
    key: 'C3 computes only after all six matches and permits a negative matched service wedge',
    passed: defaultResults[1].status === 'OK' && defaultResults[1].value.convenienceYieldBps === 20
      && matchedConvenienceYield({ ...safeAssetCanonicalInputs.C3, maturityMatch: 'MISMATCH' }).status === 'STOP'
      && c3Negative.status === 'OK' && c3Negative.value.convenienceYieldBps === -15,
  },
  {
    key: 'C5 exact cash capacity includes price quantity eligibility availability and haircut with zero-edge closures',
    passed: defaultResults[2].status === 'OK' && defaultResults[2].value.cashCapacity === 68_571
      && c5ZeroEligibility.status === 'OK' && c5ZeroEligibility.value.cashCapacity === 0
      && c5FullHaircut.status === 'OK' && c5FullHaircut.value.cashCapacity === 0
      && collateralCashCapacity({ ...safeAssetCanonicalInputs.C5, haircutPct: 100.01 }).status === 'STOP',
  },
  {
    key: 'C6 funnel closes from gross to qEff and handles full-retention and zero-layer extremes',
    passed: defaultResults[3].status === 'OK' && defaultResults[3].value.qEff === 432
      && defaultResults[3].value.totalCapacityLoss === 568 && defaultResults[3].value.retentionPct === 43.2
      && c6AllRetained.status === 'OK' && c6AllRetained.value.qEff === 1_000
      && c6ZeroLayer.status === 'OK' && c6ZeroLayer.value.qEff === 0
      && c6ZeroGross.status === 'OK' && c6ZeroGross.value.qEff === 0 && c6ZeroGross.value.retentionPct === null,
  },
  {
    key: 'C7 fixed teaching grid rises and then falls while refusing real thresholds or policy optimum claims',
    passed: defaultResults[4].status === 'OK' && defaultResults[4].value.curveTurnsDown
      && defaultResults[4].value.illustrativeGridPeakQuantity === 100
      && defaultResults[4].value.effectiveSafeCapacity === 56
      && !defaultResults[4].value.realWorldThresholdEstimated
      && !defaultResults[4].value.policyOptimumComputed
      && nonMonotonicSupplyCurve({ ...safeAssetCanonicalInputs.C7, erosionBpsPerExcessUnit: 0 }).status === 'STOP'
      && nonMonotonicSupplyCurve({ ...safeAssetCanonicalInputs.C7, constraintTriggerQuantity: 200, erosionBpsPerExcessUnit: 1 }).status === 'STOP',
  },
  {
    key: 'C8 two exact instrument paths close to one currency aggregate while bond quantities remain non-identified',
    passed: c8Default.status === 'OK' && c8Default.value.closingCurrencyValue === 1_090
      && c8Default.value.pathATotalValue === c8Default.value.pathBTotalValue
      && c8Default.value.bondQuantityDifference === 200
      && c8Default.value.identifiedBondQuantity === null
      && coferInstrumentIdentificationBridge({ ...safeAssetCanonicalInputs.C8, pathAOtherClaimsValue: 291 }).status === 'STOP',
  },
  {
    key: 'strict object boundary rejects missing extra symbol getter and non-finite inputs',
    passed: collateralCashCapacity({ ...safeAssetCanonicalInputs.C5, extra: 1 }).status === 'STOP'
      && collateralCashCapacity({ pricePerUnit: Number.NaN, quantity: 1, eligibilityPct: 1, availabilityPct: 1, haircutPct: 1 }).status === 'STOP'
      && collateralCashCapacity(Object.defineProperty({ quantity: 1, eligibilityPct: 1, availabilityPct: 1, haircutPct: 1 }, 'pricePerUnit', { get: () => 1, enumerable: true })).status === 'STOP',
  },
] as const;

if (!safeAssetFixtureAudit.every(item => item.passed)) {
  throw new Error(`4.03 fixture gate failed: ${safeAssetFixtureAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
