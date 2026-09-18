import { lesson406References, type GlobalBanksSourceId } from '../lessons/globalBanksReferences';
import {
  globalBanksC4LocalScenarioContract,
  globalBanksImportedUpstreamStatusEnum,
  globalBanksImportedUpstreamTemporalContract,
  globalBanksLocalOfficeTypeEnum,
} from '../lessons/globalBanksState';

export type GlobalBanksLabId = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
export type GlobalBanksResultStatus = 'OK' | 'STOP' | 'ACCOUNTING_ONLY';
export type GlobalBanksInput = Readonly<Record<string, unknown>>;

export type ExactFraction = Readonly<{
  numerator: number;
  denominator: number;
  text: string;
}>;

export type GlobalBanksOutputValue = number | string | null | ExactFraction;
export type GlobalBanksOutput = Readonly<Record<string, GlobalBanksOutputValue>>;
export type GlobalBanksRow = readonly [label: string, value: string];

export type GlobalBanksResult =
  | Readonly<{ status: 'STOP'; code: string; reason: string }>
  | Readonly<{
      status: 'OK' | 'ACCOUNTING_ONLY';
      note: string;
      rows: readonly GlobalBanksRow[];
      chart: readonly number[];
      values: GlobalBanksOutput;
    }>;

type FieldBase = Readonly<{
  key: string;
  label: string;
  help: string;
  editable?: boolean;
}>;

export type GlobalBanksField =
  | (FieldBase & Readonly<{ kind: 'number'; min: number; max: number; step: 1; unit: string }>)
  | (FieldBase & Readonly<{ kind: 'select'; options: readonly Readonly<{ value: string; label: string }>[] }>)
  | (FieldBase & Readonly<{ kind: 'text'; format: 'canonical-id' }>)
  | (FieldBase & Readonly<{ kind: 'timestamp'; format: 'UTC ISO minute' }>);

export type GlobalBanksCase = Readonly<{
  id: string;
  kind: 'boundary' | 'counterexample' | 'stop';
  label: string;
  overrides: GlobalBanksInput;
  expectedStatus: GlobalBanksResultStatus;
  expected: string;
}>;

export type GlobalBanksLab = Readonly<{
  id: GlobalBanksLabId;
  fixtureId: string;
  title: string;
  question: string;
  passport: string;
  fields: readonly GlobalBanksField[];
  initial: GlobalBanksInput;
  formula: readonly string[];
  defaultRebuild: string;
  zeroOrNull: string;
  counterexample: string;
  evidenceCeiling: string;
  invariants: readonly string[];
  sourceIds: readonly GlobalBanksSourceId[];
  chartTitle: string;
  chartLabels: readonly string[];
  cases: readonly GlobalBanksCase[];
  calculate: (input: GlobalBanksInput) => GlobalBanksResult;
}>;

const MAX_SAFE = Number.MAX_SAFE_INTEGER;

const option = (value: string, label: string) => Object.freeze({ value, label });
const select = (key: string, label: string, help: string, options: readonly Readonly<{ value: string; label: string }>[], editable = true): GlobalBanksField =>
  Object.freeze({ kind: 'select', key, label, help, options, editable });
const amount = (key: string, label: string, help: string, editable = true): GlobalBanksField =>
  Object.freeze({ kind: 'number', key, label, help, min: 0, max: MAX_SAFE, step: 1 as const, unit: 'SYN currency units', editable });
const idField = (key: string, label: string, help: string, editable = false): GlobalBanksField =>
  Object.freeze({ kind: 'text', key, label, help, format: 'canonical-id' as const, editable });
const timestamp = (key: string, label: string, help: string, editable = false): GlobalBanksField =>
  Object.freeze({ kind: 'timestamp', key, label, help, format: 'UTC ISO minute' as const, editable });

const matchedOptions = [option('matched', 'Matched · 同一范围'), option('unmatched', 'Unmatched · 范围不一致'), option('missing', 'Missing · 范围护照缺失')] as const;
const completeOptions = [option('complete', 'Complete · 完整'), option('missing', 'Missing · 缺失')] as const;
const yesNoUnknownOptions = [option('yes', 'Yes · 已验证'), option('no', 'No · 不满足'), option('unknown', 'Unknown · 缺证据')] as const;
const cbsiBasisOptions = [option('CBSI', 'CBSI · immediate counterparty basis'), option('CBSG', 'CBSG · guarantor basis'), option('mixed', 'Mixed · 混合口径'), option('missing', 'Missing · 未声明')] as const;

export const globalBanksUpstreamTransferStatusEnum = globalBanksImportedUpstreamStatusEnum;
export type GlobalBanksUpstreamTransferStatus = (typeof globalBanksUpstreamTransferStatusEnum)[number];

const upstreamStatusOptions = globalBanksUpstreamTransferStatusEnum.map(value => option(value, value));
const localOfficeTypeOptions = globalBanksLocalOfficeTypeEnum.map(value => option(value, value === 'head_office' ? 'Head office' : value === 'branch' ? 'Branch' : 'Subsidiary'));

function stop(code: string, reason: string): GlobalBanksResult {
  return { status: 'STOP', code, reason: `${code} · ${reason}` };
}

function resolved(
  status: 'OK' | 'ACCOUNTING_ONLY',
  note: string,
  rows: readonly GlobalBanksRow[],
  chart: readonly number[],
  values: GlobalBanksOutput,
): GlobalBanksResult {
  return { status, note, rows, chart, values };
}

function canonicalTimestampMs(value: unknown): number | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(value)) return null;
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) return null;
  const canonical = new Date(milliseconds).toISOString().slice(0, 16) + 'Z';
  return canonical === value ? milliseconds : null;
}

function canonicalId(value: unknown): value is string {
  return typeof value === 'string' && /^[A-Z0-9][A-Z0-9._:-]*$/.test(value);
}

function validateFields(labId: GlobalBanksLabId, input: GlobalBanksInput, fields: readonly GlobalBanksField[]): GlobalBanksResult | null {
  for (const field of fields) {
    const value = input[field.key];
    if (field.kind === 'number') {
      if (typeof value !== 'number' || !Number.isSafeInteger(value) || value < field.min || value > field.max) {
        return stop(`${labId}_INVALID_SAFE_INTEGER`, `${field.key}必须是[${field.min}, ${field.max}]内的安全整数；字符串、小数、NaN、Infinity与越界值均不可用。`);
      }
      continue;
    }
    if (field.kind === 'select') {
      if (typeof value !== 'string' || !field.options.some(candidate => candidate.value === value)) {
        return stop(`${labId}_INVALID_ENUM`, `${field.key}不在声明枚举内。`);
      }
      continue;
    }
    if (field.kind === 'text') {
      if (!canonicalId(value)) return stop(`${labId}_INVALID_ID`, `${field.key}必须是非空canonical ID。`);
      continue;
    }
    if (canonicalTimestampMs(value) === null) return stop(`${labId}_INVALID_TIMESTAMP`, `${field.key}必须是canonical UTC ISO minute（YYYY-MM-DDTHH:mmZ）。`);
  }
  return null;
}

function integer(input: GlobalBanksInput, key: string): number {
  return input[key] as number;
}

function text(input: GlobalBanksInput, key: string): string {
  return input[key] as string;
}

function safeSum(values: readonly number[]): number | null {
  let total = 0;
  for (const value of values) {
    total += value;
    if (!Number.isSafeInteger(total)) return null;
  }
  return total;
}

function safeDifference(left: number, right: number): number | null {
  const difference = left - right;
  return Number.isSafeInteger(difference) ? difference : null;
}

function gcd(left: number, right: number): number {
  let a = Math.abs(left);
  let b = Math.abs(right);
  while (b !== 0) [a, b] = [b, a % b];
  return a;
}

export function exactFraction(numerator: number, denominator: number): ExactFraction | null {
  if (!Number.isSafeInteger(numerator) || !Number.isSafeInteger(denominator) || denominator === 0) return null;
  const sign = denominator < 0 ? -1 : 1;
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = sign * (numerator / divisor);
  const reducedDenominator = Math.abs(denominator / divisor);
  return Object.freeze({ numerator: reducedNumerator, denominator: reducedDenominator, text: `${reducedNumerator}/${reducedDenominator}` });
}

function fmtInteger(value: number): string {
  return String(Object.is(value, -0) ? 0 : value).replace('-', '−');
}

function fmtSigned(value: number): string {
  if (value > 0) return `+${value}`;
  return fmtInteger(value);
}

function valueNumber(result: GlobalBanksResult, key: string): number | null {
  if (result.status === 'STOP') return null;
  const value = result.values[key];
  return typeof value === 'number' ? value : null;
}

function valueFraction(result: GlobalBanksResult, key: string): ExactFraction | null {
  if (result.status === 'STOP') return null;
  const value = result.values[key];
  return typeof value === 'object' && value !== null && 'numerator' in value ? value as ExactFraction : null;
}

const c1Fields = [
  amount('externalCrossBorderClaims', 'X · comparable external cross-border core', '只含LBS与CBSI均可比的loans/deposits与debt securities；排除derivatives及other exposures。'),
  amount('crossBorderIntragroupClaims', 'G · comparable cross-border intragroup core', '标准跨境LBS中对非居民related offices的同一共同工具核心。'),
  amount('localExternalClaims', 'L · comparable local external core', '标准consolidated CBSI中host当地关联机构对同一外部对手方部门的共同工具核心。'),
  select('scopeAlignment', 'Nationality / host scope', '两个镜头必须指向同一reporting nationality与host。', matchedOptions),
  select('lensPassport', 'Lens passport', 'LBS与CBSI定义、合并规则和观察单位必须完整。', completeOptions),
  select('cbsiBasis', 'CBS basis', '本实验只允许immediate-counterparty basis CBSI。', cbsiBasisOptions),
  select('benchmarkReportingScope', 'LBS / CBS reporting benchmark', '只比较reporting-area bank group的标准consolidated CBS与跨境LBS related-office positions；例外reporters须另查metadata。', [option('reporting_area_standard', 'Reporting-area standard benchmark'), option('exception_or_standalone', 'Exception / standalone reporter'), option('missing', 'Missing')]),
  select('commonInstrumentPerimeter', 'Common instrument perimeter', 'X、G、L都必须只含loans/deposits与debt securities，并排除derivatives及other exposures。', [option('loans_deposits_debt_securities', 'Loans/deposits + debt securities'), option('includes_derivatives_or_other', 'Includes derivatives / other exposures'), option('mismatched', 'Mismatched'), option('missing', 'Missing')]),
  select('reportingPopulation', 'Reporting population', '两边必须是同一reporting-area banking-group population。', matchedOptions),
  select('valuationSignConvention', 'Valuation / sign convention', '两边必须共享同一估值基础与gross-positive-claims符号约定。', matchedOptions),
  select('currencyAggregation', 'Currency aggregation', '两边必须共享同一币种聚合范围；本实验不反推CBS币种拆分。', matchedOptions),
  select('externalCounterpartySector', 'External counterparty sector', 'X与L的外部借款人部门范围必须相同；G另行标识为related offices。', matchedOptions),
  select('maturityScope', 'Maturity scope', 'X、G、L必须共享同一到期范围。', matchedOptions),
  select('asOfAlignment', 'Reference / as-of date', '两个产品必须共享同一reference date。', matchedOptions),
  select('dataVintageAlignment', 'Release vintage', '两个产品必须来自同一冻结数据vintage。', matchedOptions),
  select('requestedView', 'Requested output', '本实验只提供两个已命名聚合，不提供未给出的CBS币种拆分。', [option('named_aggregates', 'Named aggregates only'), option('cbs_currency_split', 'Request unavailable CBS currency split')]),
] as const satisfies readonly GlobalBanksField[];

export const globalBanksC1Fixture = Object.freeze<GlobalBanksInput>({
  externalCrossBorderClaims: 80,
  crossBorderIntragroupClaims: 40,
  localExternalClaims: 60,
  scopeAlignment: 'matched',
  lensPassport: 'complete',
  cbsiBasis: 'CBSI',
  benchmarkReportingScope: 'reporting_area_standard',
  commonInstrumentPerimeter: 'loans_deposits_debt_securities',
  reportingPopulation: 'matched',
  valuationSignConvention: 'matched',
  currencyAggregation: 'matched',
  externalCounterpartySector: 'matched',
  maturityScope: 'matched',
  asOfAlignment: 'matched',
  dataVintageAlignment: 'matched',
  requestedView: 'named_aggregates',
});

export function calculateGlobalBanksC1(input: GlobalBanksInput): GlobalBanksResult {
  const invalid = validateFields('C1', input, c1Fields);
  if (invalid) return invalid;
  if (text(input, 'scopeAlignment') !== 'matched') return stop('C1_SCOPE_UNMATCHED', 'LBS与CBSI不在同一reporting nationality与host范围内，不能计算桥。');
  if (text(input, 'lensPassport') !== 'complete') return stop('C1_LENS_PASSPORT_MISSING', '缺少观察单位、合并或集团内头寸处理护照。');
  if (text(input, 'cbsiBasis') !== 'CBSI') return stop('C1_CBSI_REQUIRED', 'C1只比较CBSI immediate-counterparty basis；CBSG需要风险转移桥。');
  if (text(input, 'benchmarkReportingScope') !== 'reporting_area_standard') return stop('C1_BENCHMARK_SCOPE_REQUIRED', '本桥只适用于reporting-area bank group的标准consolidated CBS与跨境LBS related-office benchmark；exception/standalone reporters须读取各自metadata。');
  if (text(input, 'commonInstrumentPerimeter') !== 'loans_deposits_debt_securities') return stop('C1_INSTRUMENT_PERIMETER_MISMATCH', 'X、G、L没有共同冻结为loans/deposits加debt securities，或混入derivatives/other exposures。');
  if (text(input, 'reportingPopulation') !== 'matched') return stop('C1_REPORTING_POPULATION_MISMATCH', 'LBS与CBSI reporting population不一致或缺失。');
  if (text(input, 'valuationSignConvention') !== 'matched') return stop('C1_VALUATION_SIGN_MISMATCH', '估值基础或gross-positive-claims符号约定不一致或缺失。');
  if (text(input, 'currencyAggregation') !== 'matched') return stop('C1_CURRENCY_AGGREGATION_MISMATCH', '币种聚合范围不一致或缺失。');
  if (text(input, 'externalCounterpartySector') !== 'matched') return stop('C1_COUNTERPARTY_SECTOR_MISMATCH', 'X与L的外部对手方部门范围不一致或缺失。');
  if (text(input, 'maturityScope') !== 'matched') return stop('C1_MATURITY_SCOPE_MISMATCH', '到期范围不一致或缺失。');
  if (text(input, 'asOfAlignment') !== 'matched') return stop('C1_AS_OF_MISMATCH', 'LBS与CBSI reference/as-of date不一致或缺失。');
  if (text(input, 'dataVintageAlignment') !== 'matched') return stop('C1_VINTAGE_MISMATCH', 'LBS与CBSI release vintage不一致或缺失。');
  if (text(input, 'requestedView') !== 'named_aggregates') return stop('C1_CBS_CURRENCY_SPLIT_UNAVAILABLE', '本fixture没有CBS币种拆分，不能由总量反推。');
  const x = integer(input, 'externalCrossBorderClaims');
  const g = integer(input, 'crossBorderIntragroupClaims');
  const l = integer(input, 'localExternalClaims');
  const lbs = safeSum([x, g]);
  const cbsi = safeSum([x, l]);
  const bridge = safeDifference(l, g);
  if (lbs === null || cbsi === null || bridge === null) return stop('C1_ARITHMETIC_OVERFLOW', '聚合或桥超过安全整数范围。');
  return resolved('OK', '在冻结的共同工具、population、估值/符号、币种、部门、到期、as-of与vintage内，标准跨境LBS保留G，标准consolidated CBSI消去G并加入L。例外reporters不自动适用此桥。', [
    ['Comparable instrument core', 'loans/deposits + debt securities · derivatives/other exposures excluded'],
    ['Reporting benchmark', 'reporting-area standard consolidated CBSI + cross-border LBS related offices'],
    ['External cross-border X', fmtInteger(x)],
    ['Cross-border intragroup G', fmtInteger(g)],
    ['Local external L', fmtInteger(l)],
    ['Comparable-core LBS cross-border into host', fmtInteger(lbs)],
    ['Comparable-core CBSI foreign claims', fmtInteger(cbsi)],
    ['CBSI − LBS bridge = L − G', fmtSigned(bridge)],
  ], [lbs, cbsi], { lbsCrossBorderIntoHost: lbs, cbsiForeignClaims: cbsi, cbsiMinusLbsBridge: bridge });
}

const c2Fields = [
  amount('directCrossBorderClaims', 'XBC · direct cross-border claims', 'CBSI foreign claims中的直接跨境部分。'),
  amount('localClaimsForeignCurrency', 'LCFX · local claims in foreign currency', '当地office对当地居民、以外币计价的债权。'),
  amount('localClaimsLocalCurrency', 'LCLC · local claims in local currency', '当地office对当地居民、以当地币计价的债权。'),
  select('scopePassport', 'CBSI scope passport', 'Nationality、host、as-of与合并范围必须一致。', [option('verified', 'Verified'), option('missing', 'Missing'), option('mixed', 'Mixed')]),
  select('allocationBasis', 'Allocation basis', 'C2只接受CBSI，不接受CBSG或混合基础。', cbsiBasisOptions),
  select('lclcRoute', 'LCLC origination route', '当地币种不能被当作跨境路线。', [option('local', 'Local'), option('cross_border', 'Cross-border')]),
] as const satisfies readonly GlobalBanksField[];

export const globalBanksC2Fixture = Object.freeze<GlobalBanksInput>({
  directCrossBorderClaims: 40,
  localClaimsForeignCurrency: 10,
  localClaimsLocalCurrency: 50,
  scopePassport: 'verified',
  allocationBasis: 'CBSI',
  lclcRoute: 'local',
});

export function calculateGlobalBanksC2(input: GlobalBanksInput): GlobalBanksResult {
  const invalid = validateFields('C2', input, c2Fields);
  if (invalid) return invalid;
  if (text(input, 'scopePassport') !== 'verified') return stop('C2_SCOPE_PASSPORT_INVALID', 'Nationality、host、as-of或consolidation perimeter缺失或混合。');
  if (text(input, 'allocationBasis') !== 'CBSI') return stop('C2_CBSI_ONLY', 'C2只在CBSI immediate-counterparty basis内做路线分解。');
  if (text(input, 'lclcRoute') !== 'local') return stop('C2_LCLC_ROUTE_CONFLICT', '当地office对当地居民的LCLC不能标成direct cross-border。');
  const xbc = integer(input, 'directCrossBorderClaims');
  const lcfx = integer(input, 'localClaimsForeignCurrency');
  const lclc = integer(input, 'localClaimsLocalCurrency');
  const internationalClaims = safeSum([xbc, lcfx]);
  const foreignClaims = safeSum([xbc, lcfx, lclc]);
  if (internationalClaims === null || foreignClaims === null) return stop('C2_ARITHMETIC_OVERFLOW', 'CBSI聚合超过安全整数范围。');
  const lclcShare = exactFraction(lclc, foreignClaims);
  return resolved('OK', 'C2只使用CBSI：外币计价不改变当地origination route；CBSG风险转移不会在这里重写路线。', [
    ['Direct cross-border XBC', fmtInteger(xbc)],
    ['Local claims in foreign currency LCFX', fmtInteger(lcfx)],
    ['Local claims in local currency LCLC', fmtInteger(lclc)],
    ['CBSI international claims = XBC + LCFX', fmtInteger(internationalClaims)],
    ['CBSI foreign claims = XBC + LCFX + LCLC', fmtInteger(foreignClaims)],
    ['LCLC share of CBSI foreign claims', lclcShare?.text ?? 'null · denominator is zero'],
  ], [xbc, lcfx, lclc], { internationalClaims, foreignClaims, lclcShareOfForeignClaims: lclcShare });
}

const c3Fields = [
  amount('loansAndDeposits', 'Loans and deposits', 'LBS credit与claims的共同组成。'),
  amount('debtSecurities', 'Debt securities', 'LBS credit与claims的共同组成。'),
  amount('derivativesPositiveMarketValue', 'Derivatives · positive market value', '只接受正市场价值，不接受notional。'),
  amount('otherResidualInstruments', 'Other residual instruments', '进入本fixture的LBS claims，但不进入LBS credit。'),
  amount('undrawnCommitments', 'Undrawn commitments', '作为potential exposure单列，不进入两个小计。'),
  select('statisticalPerimeter', 'Statistical perimeter', '该公式是LBS fixture，不能切换为CBS。', [option('LBS', 'LBS'), option('CBS', 'CBS')]),
  select('derivativeMeasure', 'Derivative measure', '必须使用positive market value。', [option('positive_market_value', 'Positive market value'), option('notional', 'Notional')]),
  select('commitmentTreatment', 'Commitment treatment', '未提用承诺必须单列。', [option('separate', 'Separate potential exposure'), option('included_in_claims', 'Add to claims')]),
] as const satisfies readonly GlobalBanksField[];

export const globalBanksC3Fixture = Object.freeze<GlobalBanksInput>({
  loansAndDeposits: 50,
  debtSecurities: 20,
  derivativesPositiveMarketValue: 6,
  otherResidualInstruments: 4,
  undrawnCommitments: 12,
  statisticalPerimeter: 'LBS',
  derivativeMeasure: 'positive_market_value',
  commitmentTreatment: 'separate',
});

export function calculateGlobalBanksC3(input: GlobalBanksInput): GlobalBanksResult {
  const invalid = validateFields('C3', input, c3Fields);
  if (invalid) return invalid;
  if (text(input, 'statisticalPerimeter') !== 'LBS') return stop('C3_LBS_ONLY', '本公式只定义LBS instrument perimeter。');
  if (text(input, 'derivativeMeasure') !== 'positive_market_value') return stop('C3_DERIVATIVE_NOTIONAL_FORBIDDEN', 'derivative notional不能与正市场价值claims相加。');
  if (text(input, 'commitmentTreatment') !== 'separate') return stop('C3_COMMITMENT_DOUBLE_COUNT', '未提用承诺是potential exposure，不能加入本fixture的LBS claims。');
  const loans = integer(input, 'loansAndDeposits');
  const securities = integer(input, 'debtSecurities');
  const derivatives = integer(input, 'derivativesPositiveMarketValue');
  const residual = integer(input, 'otherResidualInstruments');
  const commitments = integer(input, 'undrawnCommitments');
  const lbsCredit = safeSum([loans, securities]);
  const lbsClaims = lbsCredit === null ? null : safeSum([lbsCredit, derivatives, residual]);
  if (lbsCredit === null || lbsClaims === null) return stop('C3_ARITHMETIC_OVERFLOW', 'LBS instrument subtotal超过安全整数范围。');
  const creditShare = exactFraction(lbsCredit, lbsClaims);
  return resolved('OK', 'LBS credit是本fixture内较窄的工具子集；commitments保持potential exposure，claims不等于已提贷款现金。', [
    ['Loans / deposits', fmtInteger(loans)],
    ['Debt securities', fmtInteger(securities)],
    ['LBS credit', fmtInteger(lbsCredit)],
    ['Positive-market-value derivatives', fmtInteger(derivatives)],
    ['Other residual instruments', fmtInteger(residual)],
    ['LBS claims', fmtInteger(lbsClaims)],
    ['Undrawn commitments · separate', fmtInteger(commitments)],
    ['LBS credit / LBS claims', creditShare?.text ?? 'null · claims denominator is zero'],
  ], [lbsCredit, lbsClaims, commitments], { lbsCredit, lbsClaims, undrawnCommitments: commitments, creditShareOfClaims: creditShare });
}

const c4Fields = [
  select('upstreamStatus', 'Imported 4.05 five-value status', '只直接消费4.05现有五值枚举；身份、金额、zero/null与贷款容量映射均由406-c4-local-scenario-v1定义。', upstreamStatusOptions),
  amount('commonResourceShockAmount', 'Common abstract resource-shock amount', '两个互斥情景使用相同合成金额，但各自映射到不同receiver与cash leg；它们不是同一实际现金腿。'),
  select('currency', 'Scenario cash-leg currency', '两个互斥fixture都冻结为USD。', [option('USD', 'USD'), option('EUR', 'EUR')]),
  timestamp('valueTimestamp', 'Scenario value timestamp', 'Realised必须不晚于as-of；committed executable必须晚于as-of。quoted-only与unavailable只用它保存护照，不产生贡献。'),
  timestamp('asOfTimestamp', 'Loan-offer as-of', '当前资源与前瞻资源的切分时点。'),
  timestamp('decisionHorizonEnd', 'Decision-horizon end', 'Committed executable只有落在窗口内才进入条件性前瞻容量。'),
  idField('providerLegalEntityId', 'Provider legal entity ID', '两个互斥情景共享的provider法人ID。'),
  idField('providerOfficeId', 'Provider office ID', 'provider office必须与branch receiver office分开。'),
  select('providerOfficeType', 'Provider office type', '本fixture把provider冻结为head office。', localOfficeTypeOptions),
  idField('branchReceiverLegalEntityId', 'Branch receiver legal entity ID', 'Branch不是第二法人：必须等于provider legalEntityId。'),
  idField('branchReceiverOfficeId', 'Branch receiver office ID', 'Branch必须是同一法人下、不同于provider的office。'),
  select('branchReceiverOfficeType', 'Branch receiver office type', 'Branch情景必须明确标为branch。', localOfficeTypeOptions),
  select('branchReceiverIdentityPassport', 'Branch receiver identity passport', 'Branch的legalEntityId、officeId与officeType必须完整可验证。', [option('verified', 'Verified'), option('missing', 'Missing'), option('conflict', 'Conflict')]),
  idField('branchTransactionId', 'Branch scenario transaction ID', '只属于branch反事实的不可变transaction ID。'),
  idField('branchCashLegId', 'Branch scenario cash-leg ID', '只属于branch反事实，不能与subsidiary情景复用。'),
  idField('subsidiaryReceiverLegalEntityId', 'Subsidiary receiver legal entity ID', 'Subsidiary是独立host法人，必须不同于provider。'),
  idField('subsidiaryReceiverOfficeId', 'Subsidiary receiver office ID', 'Subsidiary情景的独立office ID。'),
  select('subsidiaryReceiverOfficeType', 'Subsidiary receiver office type', 'Subsidiary情景必须明确标为subsidiary。', localOfficeTypeOptions),
  select('subsidiaryReceiverIdentityPassport', 'Subsidiary receiver identity passport', 'Subsidiary的legalEntityId、officeId与officeType必须完整可验证。', [option('verified', 'Verified'), option('missing', 'Missing'), option('conflict', 'Conflict')]),
  idField('subsidiaryTransactionId', 'Subsidiary scenario transaction ID', '只属于subsidiary反事实的不可变transaction ID。'),
  idField('subsidiaryCashLegId', 'Subsidiary scenario cash-leg ID', '只属于subsidiary反事实，不能与branch情景复用。'),
  select('baseExcludesTaggedCashLeg', 'Bases exclude scenario cash legs', '两个base都必须在加入各自情景cash leg之前测量。', yesNoUnknownOptions),
  select('comparisonMode', 'Scenario relationship', 'Branch与subsidiary是互斥条件情景，容量不可相加。', [option('mutually_exclusive', 'Mutually exclusive'), option('additive', 'Additive')]),
  amount('branchBaseResourcesExcludingTaggedCashLeg', 'Branch base resources · excluding scenario cash leg', '加入branch情景cash leg前的基线资源。'),
  amount('branchAdditionalLoanCap', 'Branch additional-loan cap', '本情景联合约束给出的新增贷款上限。'),
  amount('subsidiaryBaseResourcesExcludingTaggedCashLeg', 'Subsidiary base resources · excluding scenario cash leg', '加入subsidiary情景cash leg前的基线资源。'),
  amount('subsidiaryAdditionalLoanCap', 'Subsidiary additional-loan cap', '本情景联合约束给出的新增贷款上限。'),
] as const satisfies readonly GlobalBanksField[];

export const globalBanksC4Fixture = Object.freeze<GlobalBanksInput>({
  upstreamStatus: 'realised',
  commonResourceShockAmount: 20,
  currency: 'USD',
  valueTimestamp: '2026-09-17T08:00Z',
  asOfTimestamp: '2026-09-17T09:00Z',
  decisionHorizonEnd: '2026-12-16T09:00Z',
  providerLegalEntityId: 'SYN-PARENT-BANK-01',
  providerOfficeId: 'SYN-PARENT-HO-01',
  providerOfficeType: 'head_office',
  branchReceiverLegalEntityId: 'SYN-PARENT-BANK-01',
  branchReceiverOfficeId: 'SYN-HOST-BRANCH-01',
  branchReceiverOfficeType: 'branch',
  branchReceiverIdentityPassport: 'verified',
  branchTransactionId: 'SYN-406-C4-BRANCH-TX-001',
  branchCashLegId: 'SYN-406-C4-BRANCH-CASH-001',
  subsidiaryReceiverLegalEntityId: 'SYN-HOST-SUBSIDIARY-LE-01',
  subsidiaryReceiverOfficeId: 'SYN-HOST-SUBSIDIARY-OFFICE-01',
  subsidiaryReceiverOfficeType: 'subsidiary',
  subsidiaryReceiverIdentityPassport: 'verified',
  subsidiaryTransactionId: 'SYN-406-C4-SUBSIDIARY-TX-001',
  subsidiaryCashLegId: 'SYN-406-C4-SUBSIDIARY-CASH-001',
  baseExcludesTaggedCashLeg: 'yes',
  comparisonMode: 'mutually_exclusive',
  branchBaseResourcesExcludingTaggedCashLeg: 10,
  branchAdditionalLoanCap: 25,
  subsidiaryBaseResourcesExcludingTaggedCashLeg: 15,
  subsidiaryAdditionalLoanCap: 30,
});

export function calculateGlobalBanksC4(input: GlobalBanksInput): GlobalBanksResult {
  const invalid = validateFields('C4', input, c4Fields);
  if (invalid) return invalid;
  if (text(input, 'branchReceiverIdentityPassport') !== 'verified') return stop('C4_BRANCH_OFFICE_IDENTITY_MISSING', 'Branch receiver的legalEntityId、officeId或officeType缺失/冲突。');
  if (text(input, 'subsidiaryReceiverIdentityPassport') !== 'verified') return stop('C4_SUBSIDIARY_OFFICE_IDENTITY_MISSING', 'Subsidiary receiver的legalEntityId、officeId或officeType缺失/冲突。');
  if (text(input, 'comparisonMode') !== 'mutually_exclusive') return stop('C4_COUNTERFACTUALS_NOT_ADDITIVE', 'Branch与subsidiary是互斥条件情景，不能相加。');
  if (text(input, 'baseExcludesTaggedCashLeg') !== 'yes') return stop('C4_TAGGED_CASH_LEG_DOUBLE_COUNT', '基线未明确排除各自情景cash leg；再次加入会双计。');
  if (text(input, 'currency') !== 'USD') return stop('C4_CURRENCY_SCOPE_CONFLICT', '本fixture的两条情景cash leg与贷款资源均冻结为USD。');
  const providerLegalEntityId = text(input, 'providerLegalEntityId');
  const providerOfficeId = text(input, 'providerOfficeId');
  const branchReceiverLegalEntityId = text(input, 'branchReceiverLegalEntityId');
  const branchReceiverOfficeId = text(input, 'branchReceiverOfficeId');
  const subsidiaryReceiverLegalEntityId = text(input, 'subsidiaryReceiverLegalEntityId');
  const subsidiaryReceiverOfficeId = text(input, 'subsidiaryReceiverOfficeId');
  const branchTransactionId = text(input, 'branchTransactionId');
  const branchCashLegId = text(input, 'branchCashLegId');
  const subsidiaryTransactionId = text(input, 'subsidiaryTransactionId');
  const subsidiaryCashLegId = text(input, 'subsidiaryCashLegId');
  if (text(input, 'providerOfficeType') !== 'head_office') return stop('C4_PROVIDER_OFFICE_TYPE_INVALID', '本fixture的provider必须明确为head office。');
  if (text(input, 'branchReceiverOfficeType') !== 'branch') return stop('C4_BRANCH_OFFICE_TYPE_INVALID', 'Branch情景receiver必须明确为branch office。');
  if (text(input, 'subsidiaryReceiverOfficeType') !== 'subsidiary') return stop('C4_SUBSIDIARY_OFFICE_TYPE_INVALID', 'Subsidiary情景receiver必须明确为subsidiary office。');
  if (branchReceiverLegalEntityId === subsidiaryReceiverLegalEntityId && branchReceiverOfficeId === subsidiaryReceiverOfficeId) {
    return stop('C4_RECEIVER_IDENTITY_REUSED', '两个互斥情景不得复用同一legalEntityId + officeId receiver identity。');
  }
  if (branchReceiverLegalEntityId !== providerLegalEntityId) return stop('C4_BRANCH_LEGAL_ENTITY_MISMATCH', 'Branch不是第二法人：branch receiver legalEntityId必须等于provider legalEntityId。');
  if (branchReceiverOfficeId === providerOfficeId) return stop('C4_BRANCH_OFFICE_NOT_DISTINCT', '同一法人内的provider与branch receiver必须有不同officeId。');
  if (subsidiaryReceiverLegalEntityId === providerLegalEntityId) return stop('C4_SUBSIDIARY_SAME_LEGAL_ENTITY', 'Subsidiary必须是不同于provider的独立legal entity。');
  if (new Set([providerOfficeId, branchReceiverOfficeId, subsidiaryReceiverOfficeId]).size !== 3) return stop('C4_OFFICE_ID_REUSED', 'Provider、branch receiver与subsidiary receiver必须有三个不同officeId。');
  if (branchCashLegId === subsidiaryCashLegId) return stop('C4_CASH_LEG_ID_REUSED', 'Branch与subsidiary反事实必须映射到不同cash-leg IDs；共同的是抽象冲击金额，不是实际现金腿。');
  if (branchTransactionId === subsidiaryTransactionId) return stop('C4_TRANSACTION_ID_REUSED', 'Branch与subsidiary反事实必须使用不同transaction IDs。');
  if (new Set([branchTransactionId, branchCashLegId, subsidiaryTransactionId, subsidiaryCashLegId]).size !== 4) return stop('C4_TRANSACTION_CASH_LEG_ID_CONFLICT', 'Transaction IDs与cash-leg IDs是不同层级且不得跨情景复用。');
  const asOf = canonicalTimestampMs(input.asOfTimestamp) as number;
  const horizonEnd = canonicalTimestampMs(input.decisionHorizonEnd) as number;
  const valueTime = canonicalTimestampMs(input.valueTimestamp) as number;
  if (horizonEnd <= asOf) return stop('C4_HORIZON_NOT_FORWARD', 'Decision horizon必须晚于as-of。');
  const status = text(input, 'upstreamStatus') as GlobalBanksUpstreamTransferStatus;
  let currentContribution = 0;
  let decisionHorizonContribution = 0;
  let statusTreatment = '';
  if (status === 'realised') {
    if (valueTime > asOf) return stop('C4_REALISED_AFTER_AS_OF', '标为realised的cash leg不能晚于as-of。');
    currentContribution = integer(input, 'commonResourceShockAmount');
    decisionHorizonContribution = currentContribution;
    statusTreatment = 'realised · current and decision-horizon contribution counted';
  } else if (status === 'committed_executable') {
    if (valueTime <= asOf) return stop('C4_COMMITTED_NOT_FUTURE', 'committed_executable的value timestamp必须晚于as-of。');
    decisionHorizonContribution = valueTime <= horizonEnd ? integer(input, 'commonResourceShockAmount') : 0;
    statusTreatment = valueTime <= horizonEnd
      ? 'committed_executable · current 0; in-window prospective contribution counted'
      : 'committed_executable · current 0; outside-window prospective contribution excluded';
  } else if (status === 'quoted_only') {
    statusTreatment = 'quoted_only · current contribution known 0; future amount uncounted; base-only capacity';
  } else if (status === 'unavailable') {
    statusTreatment = 'unavailable · route contribution known 0; base-only capacity';
  } else {
    return stop('C4_UPSTREAM_STATUS_UNKNOWN', 'canonical status=null表示上游身份或状态未知；不得把未知补成0或计算贷款容量。');
  }
  const branchBase = integer(input, 'branchBaseResourcesExcludingTaggedCashLeg');
  const subsidiaryBase = integer(input, 'subsidiaryBaseResourcesExcludingTaggedCashLeg');
  const branchCurrentGross = safeSum([branchBase, currentContribution]);
  const subsidiaryCurrentGross = safeSum([subsidiaryBase, currentContribution]);
  const branchDecisionGross = safeSum([branchBase, decisionHorizonContribution]);
  const subsidiaryDecisionGross = safeSum([subsidiaryBase, decisionHorizonContribution]);
  if ([branchCurrentGross, subsidiaryCurrentGross, branchDecisionGross, subsidiaryDecisionGross].some(value => value === null)) {
    return stop('C4_ARITHMETIC_OVERFLOW', '基线资源与tagged cash leg之和超过安全整数范围。');
  }
  const branchCurrentCapacity = Math.min(branchCurrentGross as number, integer(input, 'branchAdditionalLoanCap'));
  const subsidiaryCurrentCapacity = Math.min(subsidiaryCurrentGross as number, integer(input, 'subsidiaryAdditionalLoanCap'));
  const branchOfferCapacity = Math.min(branchDecisionGross as number, integer(input, 'branchAdditionalLoanCap'));
  const subsidiaryOfferCapacity = Math.min(subsidiaryDecisionGross as number, integer(input, 'subsidiaryAdditionalLoanCap'));
  return resolved('OK', status === 'realised'
    ? '共同抽象资源冲击分别映射到两个不同receiver/cash-leg identities；每个互斥情景内恰好加入一次，两个输出不可相加。'
    : decisionHorizonContribution > 0
      ? 'Committed executable只进入同一决策窗口的条件性容量；当前已到账贡献仍为0。'
      : status === 'committed_executable'
        ? 'Committed executable位于决策窗口之后；当前与本窗口容量都不得把它当作已到账现金。'
        : status === 'quoted_only'
          ? 'Quoted-only的当前贡献已知为0；quote不是cash，未来金额保持uncounted，因此只报告base-only容量。'
          : 'Unavailable表示该路线贡献已知为0；在基线护照完整时继续报告base-only容量，而不是把整个实验变成unknown。', [
    ['Imported 4.05 status enum value', status],
    ['Status treatment', statusTreatment],
    ['Common abstract shock', `${fmtInteger(integer(input, 'commonResourceShockAmount'))} USD · ${text(input, 'valueTimestamp')} · never add scenarios`],
    ['Branch identity mapping', `${providerLegalEntityId}/${providerOfficeId} → ${branchReceiverLegalEntityId}/${branchReceiverOfficeId} · ${branchCashLegId}`],
    ['Subsidiary identity mapping', `${providerLegalEntityId}/${providerOfficeId} → ${subsidiaryReceiverLegalEntityId}/${subsidiaryReceiverOfficeId} · ${subsidiaryCashLegId}`],
    ['Current realised contribution', fmtInteger(currentContribution)],
    ['Decision-horizon conditional contribution', fmtInteger(decisionHorizonContribution)],
    ['Branch current offer capacity', fmtInteger(branchCurrentCapacity)],
    ['Subsidiary current offer capacity', fmtInteger(subsidiaryCurrentCapacity)],
    ['Branch scenario offer capacity', fmtInteger(branchOfferCapacity)],
    ['Subsidiary scenario offer capacity', fmtInteger(subsidiaryOfferCapacity)],
    ['Scenario relationship', 'mutually exclusive · do not add'],
  ], [branchOfferCapacity, subsidiaryOfferCapacity], {
    currentRealisedContribution: currentContribution,
    decisionHorizonConditionalContribution: decisionHorizonContribution,
    upstreamStatusTreatment: statusTreatment,
    branchCurrentOfferCapacity: branchCurrentCapacity,
    subsidiaryCurrentOfferCapacity: subsidiaryCurrentCapacity,
    branchOfferCapacity,
    subsidiaryOfferCapacity,
  });
}

const horizonOptions = [option('forward_90_days', 'Forward 90 days'), option('forward_180_days', 'Forward 180 days')] as const;
const currencyOptions = [option('USD', 'USD'), option('EUR', 'EUR')] as const;
const instrumentOptions = [option('loan_claims', 'Loan claims'), option('debt_securities', 'Debt securities')] as const;

const c5Fields = [
  amount('baselineA', 'Baseline · destination A', '同一决策问题的baseline配置。'),
  amount('baselineB', 'Baseline · destination B', '同一决策问题的baseline配置。'),
  amount('baselineC', 'Baseline · destination C', '同一决策问题的baseline配置。'),
  amount('counterfactualA', 'Counterfactual · destination A', '互斥counterfactual配置。'),
  amount('counterfactualB', 'Counterfactual · destination B', '互斥counterfactual配置。'),
  amount('counterfactualC', 'Counterfactual · destination C', '互斥counterfactual配置。'),
  select('allocationMode', 'Allocation mode', '稳定总额与明确集团收缩必须分开声明。', [option('reallocation_only', 'Reallocation only · fixed group total'), option('group_retrenchment', 'Group retrenchment · lower counterfactual total')]),
  idField('destinationAId', 'Destination A ID', '唯一destination ID。'),
  idField('destinationBId', 'Destination B ID', '唯一destination ID。'),
  idField('destinationCId', 'Destination C ID', '唯一destination ID。'),
  timestamp('baselineAsOf', 'Baseline as-of', '不是t0 observed stock；只是同一决策问题的as-of。'),
  timestamp('counterfactualAsOf', 'Counterfactual as-of', '必须与baseline相同。'),
  select('baselineHorizon', 'Baseline horizon', '前瞻决策窗口。', horizonOptions, false),
  select('counterfactualHorizon', 'Counterfactual horizon', '必须与baseline相同。', horizonOptions, false),
  select('baselineCurrency', 'Baseline currency', '配置的共同币种。', currencyOptions, false),
  select('counterfactualCurrency', 'Counterfactual currency', '必须与baseline相同。', currencyOptions, false),
  select('baselineInstrument', 'Baseline instrument', '本fixture冻结为loan claims。', instrumentOptions, false),
  select('counterfactualInstrument', 'Counterfactual instrument', '必须与baseline相同。', instrumentOptions, false),
] as const satisfies readonly GlobalBanksField[];

export const globalBanksC5Fixture = Object.freeze<GlobalBanksInput>({
  baselineA: 40,
  baselineB: 30,
  baselineC: 20,
  counterfactualA: 20,
  counterfactualB: 50,
  counterfactualC: 20,
  allocationMode: 'reallocation_only',
  destinationAId: 'SYN-DEST-A',
  destinationBId: 'SYN-DEST-B',
  destinationCId: 'SYN-DEST-C',
  baselineAsOf: '2026-09-17T09:00Z',
  counterfactualAsOf: '2026-09-17T09:00Z',
  baselineHorizon: 'forward_90_days',
  counterfactualHorizon: 'forward_90_days',
  baselineCurrency: 'USD',
  counterfactualCurrency: 'USD',
  baselineInstrument: 'loan_claims',
  counterfactualInstrument: 'loan_claims',
});

export function calculateGlobalBanksC5(input: GlobalBanksInput): GlobalBanksResult {
  const invalid = validateFields('C5', input, c5Fields);
  if (invalid) return invalid;
  const destinationIds = [text(input, 'destinationAId'), text(input, 'destinationBId'), text(input, 'destinationCId')];
  if (new Set(destinationIds).size !== destinationIds.length) return stop('C5_DUPLICATE_DESTINATION_ID', 'Destination IDs必须唯一。');
  if (text(input, 'baselineAsOf') !== text(input, 'counterfactualAsOf')) return stop('C5_AS_OF_MISMATCH', 'Baseline与counterfactual必须共享同一as-of；它们不是t0/t1存量。');
  if (text(input, 'baselineHorizon') !== text(input, 'counterfactualHorizon')) return stop('C5_HORIZON_MISMATCH', 'Baseline与counterfactual必须共享同一forward decision horizon。');
  if (text(input, 'baselineCurrency') !== text(input, 'counterfactualCurrency')) return stop('C5_CURRENCY_MISMATCH', 'Baseline与counterfactual币种不一致。');
  if (text(input, 'baselineInstrument') !== text(input, 'counterfactualInstrument') || text(input, 'baselineInstrument') !== 'loan_claims') {
    return stop('C5_INSTRUMENT_MISMATCH', '本fixture要求同一loan-claims instrument perimeter。');
  }
  const baseline = [integer(input, 'baselineA'), integer(input, 'baselineB'), integer(input, 'baselineC')] as const;
  const counterfactual = [integer(input, 'counterfactualA'), integer(input, 'counterfactualB'), integer(input, 'counterfactualC')] as const;
  const baselineTotal = safeSum(baseline);
  const counterfactualTotal = safeSum(counterfactual);
  if (baselineTotal === null || counterfactualTotal === null) return stop('C5_ARITHMETIC_OVERFLOW', '配置总额超过安全整数范围。');
  const mode = text(input, 'allocationMode');
  if (mode === 'reallocation_only' && counterfactualTotal !== baselineTotal) return stop('C5_CONSERVATION_REQUIRED', 'Reallocation-only必须精确守恒；不能静默创造或销毁集团loan-book budget。');
  if (mode === 'group_retrenchment' && counterfactualTotal >= baselineTotal) return stop('C5_RETRENCHMENT_NOT_PRESENT', 'group_retrenchment要求counterfactual total严格低于baseline。');
  const deltas = counterfactual.map((value, index) => safeDifference(value, baseline[index]));
  if (deltas.some(value => value === null)) return stop('C5_ARITHMETIC_OVERFLOW', '目的地变化超过安全整数范围。');
  const signedDeltas = deltas as readonly number[];
  const grossExpansions = safeSum(signedDeltas.filter(value => value > 0));
  const grossCuts = safeSum(signedDeltas.filter(value => value < 0).map(value => -value));
  const groupShrinkage = safeDifference(baselineTotal, counterfactualTotal);
  if (grossExpansions === null || grossCuts === null || groupShrinkage === null) return stop('C5_ARITHMETIC_OVERFLOW', '重新配置分解超过安全整数范围。');
  if (safeDifference(grossCuts, grossExpansions) !== groupShrinkage) return stop('C5_INTERNAL_IDENTITY_FAILURE', '目的地变化与集团总额桥接不闭合。');
  return resolved('OK', mode === 'reallocation_only'
    ? 'Baseline与counterfactual共享as-of/horizon且集团总额固定；局部−20与+20可被总量90完全遮蔽。'
    : '集团收缩已显式声明；目的地扩张只表示部分重新配置，未被吸收的cuts另列为group shrinkage。', [
    ['Shared as-of / horizon', `${text(input, 'baselineAsOf')} · ${text(input, 'baselineHorizon')}`],
    ['Baseline group loan-book budget', fmtInteger(baselineTotal)],
    ['Counterfactual group loan-book budget', fmtInteger(counterfactualTotal)],
    [`${destinationIds[0]} change`, fmtSigned(signedDeltas[0])],
    [`${destinationIds[1]} change`, fmtSigned(signedDeltas[1])],
    [`${destinationIds[2]} change`, fmtSigned(signedDeltas[2])],
    ['Gross destination cuts', fmtInteger(grossCuts)],
    ['Gross destination expansions / reallocated amount', fmtInteger(grossExpansions)],
    ['Explicit group shrinkage', fmtInteger(groupShrinkage)],
  ], signedDeltas, {
    baselineTotal,
    counterfactualTotal,
    destinationAChange: signedDeltas[0],
    destinationBChange: signedDeltas[1],
    destinationCChange: signedDeltas[2],
    grossDestinationCuts: grossCuts,
    grossDestinationExpansions: grossExpansions,
    groupShrinkage,
  });
}

const bankChannelPresenceOptions = [option('present', 'Present · observed amount'), option('known_zero', 'Known zero · verified absent contribution'), option('missing', 'Missing · unobserved and unknown')] as const;

const c6Fields = [
  amount('originalGlobalBankRouteBalance', 'Original global-bank route balance', '削减不能超过该路线原始余额。'),
  amount('globalBankRouteReduction', 'Global-bank route reduction', '输入为非负削减幅度，输出显示负变化。'),
  amount('domesticBankAddition', 'Domestic-bank addition', '已覆盖的domestic-bank替代渠道。'),
  amount('sameBankOtherRouteAddition', 'Same-bank-other-route addition', '只有presence=present时进入covered-bank channels；missing不是0。'),
  amount('otherForeignBankAddition', 'Other-foreign-bank addition', '只有presence=present时进入covered-bank channels；missing不是0。'),
  amount('bondFinancingAddition', 'Bond-financing addition', '只进入all observed financing perimeter。'),
  select('allBankCoverage', 'All-bank coverage gate', '只有complete才可把covered-bank总和命名为all-bank；incomplete/unknown保留未观测渠道unknown。', [option('complete', 'Complete'), option('incomplete', 'Incomplete'), option('unknown', 'Unknown')]),
  select('sameBankOtherRoutePresence', 'Same-bank-other-route coverage', '显式记录该渠道是observed、known zero还是missing。', bankChannelPresenceOptions),
  select('otherForeignBankPresence', 'Other-foreign-bank coverage', '显式记录该渠道是observed、known zero还是missing。', bankChannelPresenceOptions),
  select('demandCondition', 'Demand held constant?', '不是yes时只保留accounting bridge。', [option('held_constant', 'Yes · held constant'), option('not_held_constant', 'No · demand changed'), option('unknown', 'Unknown')]),
  select('channelPassport', 'Channel ID passport', '五个渠道必须完整且唯一。', [option('unique', 'Unique'), option('duplicate', 'Duplicate'), option('missing', 'Missing')]),
  idField('globalBankRouteId', 'Global-bank route ID', '双边/路线层ID。'),
  idField('domesticBankChannelId', 'Domestic-bank channel ID', 'all-bank替代渠道ID。'),
  idField('sameBankOtherRouteChannelId', 'Same-bank-other-route channel ID', '同一银行其他贷款路线的独立渠道ID。'),
  idField('otherForeignBankChannelId', 'Other-foreign-bank channel ID', '其他外国银行替代路线的独立渠道ID。'),
  idField('bondFinancingChannelId', 'Bond-financing channel ID', '非银行融资渠道ID。'),
] as const satisfies readonly GlobalBanksField[];

export const globalBanksC6Fixture = Object.freeze<GlobalBanksInput>({
  originalGlobalBankRouteBalance: 60,
  globalBankRouteReduction: 20,
  domesticBankAddition: 5,
  sameBankOtherRouteAddition: 3,
  otherForeignBankAddition: 4,
  bondFinancingAddition: 5,
  allBankCoverage: 'complete',
  sameBankOtherRoutePresence: 'present',
  otherForeignBankPresence: 'present',
  demandCondition: 'held_constant',
  channelPassport: 'unique',
  globalBankRouteId: 'SYN-GLOBAL-BANK-ROUTE',
  domesticBankChannelId: 'SYN-DOMESTIC-BANKS',
  sameBankOtherRouteChannelId: 'SYN-SAME-BANK-OTHER-ROUTE',
  otherForeignBankChannelId: 'SYN-OTHER-FOREIGN-BANKS',
  bondFinancingChannelId: 'SYN-BOND-FINANCING',
});

export function calculateGlobalBanksC6(input: GlobalBanksInput): GlobalBanksResult {
  const invalid = validateFields('C6', input, c6Fields);
  if (invalid) return invalid;
  if (text(input, 'channelPassport') !== 'unique') return stop('C6_CHANNEL_PASSPORT_INVALID', '渠道ID缺失或声明重复。');
  const ids = [text(input, 'globalBankRouteId'), text(input, 'domesticBankChannelId'), text(input, 'sameBankOtherRouteChannelId'), text(input, 'otherForeignBankChannelId'), text(input, 'bondFinancingChannelId')];
  if (new Set(ids).size !== ids.length) return stop('C6_DUPLICATE_CHANNEL_ID', '五个融资渠道必须有不同ID。');
  const original = integer(input, 'originalGlobalBankRouteBalance');
  const reduction = integer(input, 'globalBankRouteReduction');
  const domesticAddition = integer(input, 'domesticBankAddition');
  const sameBankOtherRouteAddition = integer(input, 'sameBankOtherRouteAddition');
  const otherForeignBankAddition = integer(input, 'otherForeignBankAddition');
  const bondAddition = integer(input, 'bondFinancingAddition');
  if (reduction > original) return stop('C6_REDUCTION_EXCEEDS_BALANCE', '路线削减不能超过其原始余额。');
  const sameBankPresence = text(input, 'sameBankOtherRoutePresence');
  const otherForeignPresence = text(input, 'otherForeignBankPresence');
  if (sameBankPresence === 'known_zero' && sameBankOtherRouteAddition !== 0) return stop('C6_KNOWN_ZERO_AMOUNT_CONFLICT', 'Same-bank-other-route标为known zero时金额必须为0。');
  if (otherForeignPresence === 'known_zero' && otherForeignBankAddition !== 0) return stop('C6_KNOWN_ZERO_AMOUNT_CONFLICT', 'Other-foreign-bank标为known zero时金额必须为0。');
  if (sameBankPresence === 'missing' && sameBankOtherRouteAddition !== 0) return stop('C6_UNOBSERVED_CHANNEL_AMOUNT_CONFLICT', 'Same-bank-other-route为missing时输入框必须保持0占位；该0不代表经济零，渠道仍是unknown。');
  if (otherForeignPresence === 'missing' && otherForeignBankAddition !== 0) return stop('C6_UNOBSERVED_CHANNEL_AMOUNT_CONFLICT', 'Other-foreign-bank为missing时输入框必须保持0占位；该0不代表经济零，渠道仍是unknown。');
  const hasMissingBankChannel = sameBankPresence === 'missing' || otherForeignPresence === 'missing';
  const allBankCoverage = text(input, 'allBankCoverage');
  if (allBankCoverage === 'complete' && hasMissingBankChannel) return stop('C6_COMPLETE_COVERAGE_HAS_MISSING_CHANNEL', 'allBankCoverage=complete要求same-bank-other-route与other-foreign-bank均为present或known zero。');
  if (allBankCoverage === 'incomplete' && !hasMissingBankChannel) return stop('C6_INCOMPLETE_COVERAGE_WITHOUT_MISSING_CHANNEL', 'allBankCoverage=incomplete必须显式标出至少一个missing bank channel。');
  const sameBankCoveredAddition = sameBankPresence === 'present' ? sameBankOtherRouteAddition : 0;
  const otherForeignCoveredAddition = otherForeignPresence === 'present' ? otherForeignBankAddition : 0;
  const routeChange = -reduction;
  const coveredBankSubstitution = safeSum([domesticAddition, sameBankCoveredAddition, otherForeignCoveredAddition]);
  const coveredBankChannelsChange = coveredBankSubstitution === null ? null : safeSum([routeChange, coveredBankSubstitution]);
  const coveredObservedFinancingChange = coveredBankChannelsChange === null ? null : safeSum([coveredBankChannelsChange, bondAddition]);
  const coveredTotalSubstitution = coveredBankSubstitution === null ? null : safeSum([coveredBankSubstitution, bondAddition]);
  if (coveredBankSubstitution === null || coveredBankChannelsChange === null || coveredObservedFinancingChange === null || coveredTotalSubstitution === null) return stop('C6_ARITHMETIC_OVERFLOW', '替代桥超过安全整数范围。');
  const allBankEligible = allBankCoverage === 'complete';
  const allBankCreditChange = allBankEligible ? coveredBankChannelsChange : null;
  const allObservedFinancingChange = allBankEligible ? coveredObservedFinancingChange : null;
  const substitutionCoverage = exactFraction(coveredTotalSubstitution, reduction);
  const demandCondition = text(input, 'demandCondition');
  const status = demandCondition === 'held_constant' && allBankEligible ? 'OK' : 'ACCOUNTING_ONLY';
  return resolved(status, status === 'OK'
    ? '银行渠道inventory已声明complete，因而本fixture可把银行合计命名为all-bank；需求保持不变仍只是SYN识别门，不是现实供给因果估计。'
    : !allBankEligible
      ? '银行渠道覆盖为incomplete或unknown；只报告covered-bank channels，未观测银行渠道保持unknown，不得贴上all-bank标签。'
      : '数量桥可以计算，但需求未保持不变或未知，因此不得把路线变化解释为已识别的供给冲击。', [
    ['Global-bank route change', fmtSigned(routeChange)],
    ['Domestic-bank substitution', fmtSigned(domesticAddition)],
    ['Same-bank-other-route inventory', `${sameBankPresence} · ${sameBankPresence === 'missing' ? 'unknown, placeholder excluded' : fmtSigned(sameBankCoveredAddition)}`],
    ['Other-foreign-bank inventory', `${otherForeignPresence} · ${otherForeignPresence === 'missing' ? 'unknown, placeholder excluded' : fmtSigned(otherForeignCoveredAddition)}`],
    [allBankEligible ? 'All-bank credit change' : 'Covered-bank channels change · not all-bank', fmtSigned(coveredBankChannelsChange)],
    ['Unobserved bank channels', allBankEligible ? 'none within declared inventory' : 'unknown · not imputed as zero'],
    ['Bond-financing substitution', fmtSigned(bondAddition)],
    [allBankEligible ? 'All observed financing change' : 'Covered observed-financing change', fmtSigned(coveredObservedFinancingChange)],
    ['Covered substitution / route reduction', substitutionCoverage?.text ?? 'null · route reduction is zero'],
    ['All-bank coverage gate', allBankCoverage],
    ['Interpretation status', status],
  ], [routeChange, coveredBankChannelsChange, coveredObservedFinancingChange], {
    globalBankRouteChange: routeChange,
    coveredBankChannelsChange,
    allBankCreditChange,
    coveredObservedFinancingChange,
    allObservedFinancingChange,
    coveredBankSubstitution,
    coveredTotalSubstitution,
    substitutionCoverage,
    allBankCoverage,
    unobservedBankChannels: allBankEligible ? 'none within declared inventory' : 'unknown',
  });
}

export const globalBanksLabs = [
  {
    id: 'C1', fixtureId: '406-lens-v2', title: 'Lens switch：共同可比核心在LBS与CBSI镜头下为何不同？', question: '先冻结共同工具、population、估值/符号、币种、部门、到期、as-of与vintage后，标准LBS与CBSI两个聚合如何桥接？', passport: '独立author-SYN；reporting-area bank group标准benchmark；X/G/L仅含loans/deposits + debt securities共同核心；不是任一统计系统的完整总量。', fields: c1Fields, initial: globalBanksC1Fixture,
    formula: ['Comparable-core LBS cross-border into host = X + G', 'Comparable-core CBSI foreign claims = X + L', 'CBSI − LBS = L − G'],
    defaultRebuild: '在共同loans/deposits + debt securities核心内，X=80、G=40、L=60，因此LBS=120、CBSI=140，桥为+20。',
    zeroOrNull: 'X=G=L=0是已知零并返回两个0；任一工具、population、估值/符号、币种、部门、到期、as-of或vintage护照缺失/不匹配都STOP。',
    counterexample: '保持X=80，将L=20、G=50，CBSI=100而LBS=130；CBSI并不必然更大。',
    evidenceCeiling: '只验证标准reporting-area benchmark下共同工具核心的口径桥；reporter exceptions须查metadata，不产生实体现金、当前数据或因果解释。',
    invariants: ['精确命名为Comparable-core LBS cross-border into host与Comparable-core CBSI foreign claims', 'X/G/L只含loans/deposits与debt securities共同核心', 'reporting population、估值/符号、币种、部门、到期、as-of与vintage全部匹配', '标准LBS保留跨境related-office G而标准consolidated CBSI消去G并加入L', '两个镜头不可相加且无固定大小排序', 'CBS币种拆分未提供时必须STOP'], sourceIds: [1, 2, 5], chartTitle: '共同可比核心的两个不可相加聚合', chartLabels: ['Comparable-core LBS cross-border into host', 'Comparable-core CBSI foreign claims'],
    cases: [
      { id: 'C1-zero', kind: 'boundary', label: '已知零不是缺失', overrides: { externalCrossBorderClaims: 0, crossBorderIntragroupClaims: 0, localExternalClaims: 0 }, expectedStatus: 'OK', expected: '0 / 0 / bridge 0' },
      { id: 'C1-cbsi-lower', kind: 'counterexample', label: 'CBSI低于LBS', overrides: { localExternalClaims: 20, crossBorderIntragroupClaims: 50 }, expectedStatus: 'OK', expected: 'LBS 130, CBSI 100, bridge −30' },
      { id: 'C1-instrument-mismatch', kind: 'stop', label: '工具范围混入derivatives', overrides: { commonInstrumentPerimeter: 'includes_derivatives_or_other' }, expectedStatus: 'STOP', expected: 'C1_INSTRUMENT_PERIMETER_MISMATCH' },
      { id: 'C1-valuation-mismatch', kind: 'stop', label: '估值/符号不匹配', overrides: { valuationSignConvention: 'unmatched' }, expectedStatus: 'STOP', expected: 'C1_VALUATION_SIGN_MISMATCH' },
      { id: 'C1-population-mismatch', kind: 'stop', label: 'Reporting population不匹配', overrides: { reportingPopulation: 'unmatched' }, expectedStatus: 'STOP', expected: 'C1_REPORTING_POPULATION_MISMATCH' },
      { id: 'C1-reporter-exception', kind: 'stop', label: 'Exception reporter不能套用benchmark', overrides: { benchmarkReportingScope: 'exception_or_standalone' }, expectedStatus: 'STOP', expected: 'C1_BENCHMARK_SCOPE_REQUIRED' },
    ], calculate: calculateGlobalBanksC1,
  },
  {
    id: 'C2', fixtureId: '406-routes-v1', title: 'CBSI route decomposition：跨境路线、当地外币与当地本币不是同一分类轴。', question: 'CBSI foreign claims怎样分解为international claims与local-currency local claims？', passport: '独立author-SYN；只允许CBSI immediate-counterparty basis，不接受CBSG。', fields: c2Fields, initial: globalBanksC2Fixture,
    formula: ['CBSI foreign claims = XBC + LCFX + LCLC', 'CBSI international claims = XBC + LCFX', 'foreign claims = international claims + LCLC'],
    defaultRebuild: '40+10+50=100；international claims=40+10=50；LCLC占foreign claims精确为1/2。',
    zeroOrNull: '三项全0返回两个总量0；份额分母为0，所以份额是null而不是0%。',
    counterexample: 'LCFX是当地路线但进入international claims；“外币”不能被改写为“跨境”。',
    evidenceCeiling: '只做CBSI工具/币种/位置口径分解，不推断融资来源、风险转移或贷款供给。',
    invariants: ['C2只使用CBSI', 'LCLC永远不标成direct cross-border', 'CBSG不改变origination route但不进入本计算', '零分母份额为null'], sourceIds: [1, 4], chartTitle: 'CBSI foreign claims的三项路线/币种组成', chartLabels: ['XBC', 'LCFX', 'LCLC'],
    cases: [
      { id: 'C2-zero', kind: 'boundary', label: '零总量与null份额', overrides: { directCrossBorderClaims: 0, localClaimsForeignCurrency: 0, localClaimsLocalCurrency: 0 }, expectedStatus: 'OK', expected: 'foreign claims 0; share null' },
      { id: 'C2-local-fx', kind: 'counterexample', label: '外币并不等于跨境', overrides: { directCrossBorderClaims: 0, localClaimsForeignCurrency: 10, localClaimsLocalCurrency: 0 }, expectedStatus: 'OK', expected: 'international claims 10 from a local route' },
      { id: 'C2-cbsg', kind: 'stop', label: 'CBSG被拒绝', overrides: { allocationBasis: 'CBSG' }, expectedStatus: 'STOP', expected: 'C2_CBSI_ONLY' },
    ], calculate: calculateGlobalBanksC2,
  },
  {
    id: 'C3', fixtureId: '406-perimeter-v1', title: 'LBS claims不是LBS credit：工具边界先于总量比较。', question: '贷款、债券、正市场价值衍生品、其他工具和未提用承诺分别进入哪个LBS小计？', passport: '独立author-SYN；只在声明的LBS instrument perimeter内成立。', fields: c3Fields, initial: globalBanksC3Fixture,
    formula: ['LBS credit = loans/deposits + debt securities', 'LBS claims = LBS credit + positive-market-value derivatives + other residual instruments', 'undrawn commitments remain separate'],
    defaultRebuild: '50+20=70 LBS credit；70+6+4=80 LBS claims；12承诺单列；credit/claims=7/8。',
    zeroOrNull: '所有claims工具为0时两个小计为0，credit/claims份额为null；承诺仍可独立为正。',
    counterexample: '把undrawn commitments从12增到100，LBS claims仍为80；potential exposure不是当前claim。',
    evidenceCeiling: '只验证本LBS fixture的instrument perimeter；不是跨产品通用定义，也不是已提款现金。',
    invariants: ['C3只使用LBS', '衍生品使用positive market value而非notional', 'commitments不进入credit或claims', 'credit是本fixture claims的子集'], sourceIds: [1, 4], chartTitle: 'LBS credit、LBS claims与单列承诺', chartLabels: ['LBS credit', 'LBS claims', 'Undrawn commitments'],
    cases: [
      { id: 'C3-zero-claims', kind: 'boundary', label: '零claims但承诺存在', overrides: { loansAndDeposits: 0, debtSecurities: 0, derivativesPositiveMarketValue: 0, otherResidualInstruments: 0, undrawnCommitments: 12 }, expectedStatus: 'OK', expected: 'claims 0; commitments 12; ratio null' },
      { id: 'C3-large-commitment', kind: 'counterexample', label: '承诺增加不改当前claims', overrides: { undrawnCommitments: 100 }, expectedStatus: 'OK', expected: 'claims stays 80' },
      { id: 'C3-notional', kind: 'stop', label: '衍生品notional被拒绝', overrides: { derivativeMeasure: 'notional' }, expectedStatus: 'STOP', expected: 'C3_DERIVATIVE_NOTIONAL_FORBIDDEN' },
    ], calculate: calculateGlobalBanksC3,
  },
  {
    id: 'C4', fixtureId: '406-legal-form-v2', title: '导入4.05五值枚举后，以4.06本地身份合同比较branch与subsidiary贷款要约门。', question: '同一抽象资源冲击如何映射到两个互斥、receiver/cash-leg均不同的legal-form情景，并保持zero与null分离？', passport: '独立author-SYN；从4.05只导入五值status enum与可核验时钟约束；身份、金额、zero/null及容量映射属于406-c4-local-scenario-v1。branch是同法人不同office，subsidiary是不同法人；两情景不是同一实际cash leg。', fields: c4Fields, initial: globalBanksC4Fixture,
    formula: ['realised: current contribution = amount only when valueTimestamp ≤ asOf', 'committed_executable: current 0; in-window prospective amount separate', 'quoted_only / unavailable: current 0 and base-only; null: STOP unknown', 'scenario capacity = min(base excluding its own cash leg + eligible contribution, scenario cap)'],
    defaultRebuild: 'Realised抽象冲击20分别映射到不同cash-leg IDs：branch=min(10+20,25)=25；subsidiary=min(15+20,30)=30；两情景不可相加。',
    zeroOrNull: 'amount=0、quoted_only与unavailable都可返回base-only容量；quoted future保持uncounted，unavailable路线贡献是known 0；只有status=null或身份护照缺失才STOP。',
    counterexample: '把branch cap设35、subsidiary cap设20，得到branch 30、subsidiary 20，推翻固定韧性排序。',
    evidenceCeiling: '输出是身份完整的互斥条件情景offer capacity；共同的是合成冲击大小，不是同一实际现金腿，也不是实际origination或legal-form因果效应。',
    invariants: ['五值状态枚举逐字导入4.05；时钟谓词只复用已声明边界', 'provider/receiver/office/IDs、金额、zero/null与容量映射均属于4.06本地合同', 'branch与provider同法人但officeId不同', 'subsidiary与provider法人不同', '两个反事实receiver/cash-leg mappings不同', 'base必须排除各自情景cash leg', 'committed current为0；quoted/unavailable base-only；null STOP', 'branch与subsidiary容量不可相加'], sourceIds: [6, 7, 8, 10, 11], chartTitle: '身份分离的互斥legal-form offer capacity', chartLabels: ['Branch scenario', 'Subsidiary scenario'],
    cases: [
      { id: 'C4-same-entity-branch', kind: 'boundary', label: '同法人不同office的branch合法', overrides: {}, expectedStatus: 'OK', expected: 'provider and branch share legalEntityId; officeIds differ' },
      { id: 'C4-committed', kind: 'boundary', label: 'Committed executable分开显示', overrides: { upstreamStatus: 'committed_executable', valueTimestamp: '2026-09-18T09:00Z' }, expectedStatus: 'OK', expected: 'current contribution 0; decision-horizon contribution 20' },
      { id: 'C4-quoted-only', kind: 'boundary', label: 'Quoted-only是当前0且未来不计入', overrides: { upstreamStatus: 'quoted_only' }, expectedStatus: 'OK', expected: 'current 0; future uncounted; branch/subsidiary base-only 10/15' },
      { id: 'C4-unavailable', kind: 'boundary', label: 'Unavailable路线贡献已知为0', overrides: { upstreamStatus: 'unavailable' }, expectedStatus: 'OK', expected: 'known route contribution 0; branch/subsidiary base-only 10/15' },
      { id: 'C4-null', kind: 'stop', label: 'Null状态保持unknown', overrides: { upstreamStatus: 'null' }, expectedStatus: 'STOP', expected: 'C4_UPSTREAM_STATUS_UNKNOWN' },
      { id: 'C4-branch-office-missing', kind: 'stop', label: 'Branch office身份缺失', overrides: { branchReceiverIdentityPassport: 'missing' }, expectedStatus: 'STOP', expected: 'C4_BRANCH_OFFICE_IDENTITY_MISSING' },
      { id: 'C4-branch-office-id-blank', kind: 'stop', label: 'Branch office ID为空', overrides: { branchReceiverOfficeId: '' }, expectedStatus: 'STOP', expected: 'C4_INVALID_ID' },
      { id: 'C4-subsidiary-same-entity', kind: 'stop', label: 'Subsidiary不得与provider同法人', overrides: { subsidiaryReceiverLegalEntityId: 'SYN-PARENT-BANK-01' }, expectedStatus: 'STOP', expected: 'C4_SUBSIDIARY_SAME_LEGAL_ENTITY' },
      { id: 'C4-reused-receiver', kind: 'stop', label: '两个情景不得复用receiver identity', overrides: { subsidiaryReceiverLegalEntityId: 'SYN-PARENT-BANK-01', subsidiaryReceiverOfficeId: 'SYN-HOST-BRANCH-01' }, expectedStatus: 'STOP', expected: 'C4_RECEIVER_IDENTITY_REUSED' },
      { id: 'C4-reused-cash-leg', kind: 'stop', label: '两个情景不得复用cash-leg ID', overrides: { subsidiaryCashLegId: 'SYN-406-C4-BRANCH-CASH-001' }, expectedStatus: 'STOP', expected: 'C4_CASH_LEG_ID_REUSED' },
      { id: 'C4-ranking-reversal', kind: 'counterexample', label: 'Legal form无固定排序', overrides: { branchAdditionalLoanCap: 35, subsidiaryAdditionalLoanCap: 20 }, expectedStatus: 'OK', expected: 'branch 30; subsidiary 20' },
      { id: 'C4-double-count', kind: 'stop', label: 'Tagged cash leg双计门', overrides: { baseExcludesTaggedCashLeg: 'no' }, expectedStatus: 'STOP', expected: 'C4_TAGGED_CASH_LEG_DOUBLE_COUNT' },
    ], calculate: calculateGlobalBanksC4,
  },
  {
    id: 'C5', fixtureId: '406-reallocation-v1', title: '目的地重新配置：集团总额稳定可以遮蔽局部大幅收缩。', question: '在同一as-of与forward horizon下，如何把destination reallocation和group retrenchment分开？', passport: '独立author-SYN；baseline与counterfactual是互斥决策配置，不是t0/t1观测存量。', fields: c5Fields, initial: globalBanksC5Fixture,
    formula: ['destination change = counterfactual − baseline', 'gross cuts − gross expansions = baseline total − counterfactual total', 'reallocation-only requires exact total conservation'],
    defaultRebuild: 'Baseline 40+30+20=90；counterfactual 20+50+20=90；A −20、B +20、C 0，group shrinkage 0。',
    zeroOrNull: '全零且同口径是合法稳定配置；任何as-of、horizon、currency或instrument不匹配均STOP而不推断。',
    counterexample: '集团总额90完全不变，但destination A仍收缩20；稳定集团总量不代表每个host稳定。',
    evidenceCeiling: '只做同一决策问题的条件性配置账；不证明管理意图、时间变化或global common factor。',
    invariants: ['baseline/counterfactual共享as-of与forward horizon', 'destination IDs唯一且scope完全一致', 'reallocation-only精确守恒', 'group shrinkage只有显式声明才允许', '两个配置互斥而不可相加'], sourceIds: [3, 9, 10, 11, 13], chartTitle: '相同集团预算下的目的地变化', chartLabels: ['Destination A Δ', 'Destination B Δ', 'Destination C Δ'],
    cases: [
      { id: 'C5-group-retrenchment', kind: 'boundary', label: '显式集团收缩', overrides: { allocationMode: 'group_retrenchment', counterfactualA: 20, counterfactualB: 40, counterfactualC: 20 }, expectedStatus: 'OK', expected: 'gross cuts 20; expansion 10; shrinkage 10' },
      { id: 'C5-stable-total-local-cut', kind: 'counterexample', label: '集团稳定但A收缩', overrides: {}, expectedStatus: 'OK', expected: 'total 90; A −20' },
      { id: 'C5-unbalanced', kind: 'stop', label: '未声明收缩却破坏守恒', overrides: { counterfactualB: 40 }, expectedStatus: 'STOP', expected: 'C5_CONSERVATION_REQUIRED' },
    ], calculate: calculateGlobalBanksC5,
  },
  {
    id: 'C6', fixtureId: '406-substitution-v2', title: 'Retrenchment不是total credit：覆盖完整性决定能否说“all-bank”。', question: '同一−20全球银行路线冲击，在domestic、same-bank-other-route与other-foreign-bank逐项盘点后，什么时候只能报告covered-bank channels？', passport: '独立author-SYN；五个渠道ID唯一；allBankCoverage显式为complete/incomplete/unknown；missing渠道永不补0。', fields: c6Fields, initial: globalBanksC6Fixture,
    formula: ['global-bank route change = −reduction', 'covered-bank channels change = route change + covered domestic + same-bank-other-route + other-foreign-bank additions', 'all-bank label is permitted only when allBankCoverage = complete', 'covered observed-financing change = covered-bank change + bond addition'],
    defaultRebuild: '路线−20；domestic +5、same-bank-other-route +3、other-foreign-bank +4且coverage complete，因此all-bank=−8；bond +5后all observed financing=−3。',
    zeroOrNull: '所有已完整覆盖替代均为0时三层都是−20；reduction=0时比例为null。只要coverage incomplete/unknown，未观测银行渠道保持unknown，不能从输入框0占位推成经济零。',
    counterexample: '双边路线减少20，并不意味着借款人总融资减少20；本fixture在更宽口径只减少3。',
    evidenceCeiling: '只验证显式覆盖范围内的perimeter与替代会计；complete只代表本fixture库存声明完整，不是现实覆盖证明、因果估计或实体活动结论。',
    invariants: ['complete才可显示all-bank标签', 'incomplete/unknown只显示covered-bank channels且unobserved=unknown', 'same-bank-other-route与other-foreign-bank各有presence/missing marker', '削减不得超过原路线余额', '五个渠道ID不可重复', '需求非恒定或覆盖非complete时状态为ACCOUNTING_ONLY', '数量替代不证明价格期限与契约等价'], sourceIds: [12, 14, 15, 18, 19], chartTitle: '从路线到已覆盖银行与融资渠道的净变化', chartLabels: ['Global-bank route', 'Covered-bank channels', 'Covered observed financing'],
    cases: [
      { id: 'C6-zero-substitution', kind: 'boundary', label: '完整覆盖下零替代', overrides: { domesticBankAddition: 0, sameBankOtherRouteAddition: 0, otherForeignBankAddition: 0, bondFinancingAddition: 0 }, expectedStatus: 'OK', expected: '−20 / −20 / −20' },
      { id: 'C6-incomplete-coverage', kind: 'boundary', label: '缺same-bank-other-route只能说covered-bank', overrides: { allBankCoverage: 'incomplete', sameBankOtherRoutePresence: 'missing', sameBankOtherRouteAddition: 0 }, expectedStatus: 'ACCOUNTING_ONLY', expected: 'covered-bank only; allBankCreditChange null; unobserved unknown' },
      { id: 'C6-unknown-coverage', kind: 'boundary', label: '覆盖完整性未知', overrides: { allBankCoverage: 'unknown' }, expectedStatus: 'ACCOUNTING_ONLY', expected: 'covered-bank only; unobserved unknown' },
      { id: 'C6-complete-with-missing', kind: 'stop', label: 'Complete与missing矛盾', overrides: { allBankCoverage: 'complete', otherForeignBankPresence: 'missing', otherForeignBankAddition: 0 }, expectedStatus: 'STOP', expected: 'C6_COMPLETE_COVERAGE_HAS_MISSING_CHANNEL' },
      { id: 'C6-accounting-only', kind: 'counterexample', label: '需求未知不阻止会计桥', overrides: { demandCondition: 'unknown' }, expectedStatus: 'ACCOUNTING_ONLY', expected: 'same arithmetic; no supply interpretation' },
      { id: 'C6-overdraw', kind: 'stop', label: '削减超过原余额', overrides: { globalBankRouteReduction: 61 }, expectedStatus: 'STOP', expected: 'C6_REDUCTION_EXCEEDS_BALANCE' },
    ], calculate: calculateGlobalBanksC6,
  },
] as const satisfies readonly GlobalBanksLab[];

export const globalBanksCalculators = Object.freeze({
  C1: calculateGlobalBanksC1,
  C2: calculateGlobalBanksC2,
  C3: calculateGlobalBanksC3,
  C4: calculateGlobalBanksC4,
  C5: calculateGlobalBanksC5,
  C6: calculateGlobalBanksC6,
});

export const globalBanksCanonicalResults = Object.freeze({
  C1: calculateGlobalBanksC1(globalBanksC1Fixture),
  C2: calculateGlobalBanksC2(globalBanksC2Fixture),
  C3: calculateGlobalBanksC3(globalBanksC3Fixture),
  C4: calculateGlobalBanksC4(globalBanksC4Fixture),
  C5: calculateGlobalBanksC5(globalBanksC5Fixture),
  C6: calculateGlobalBanksC6(globalBanksC6Fixture),
});

const caseResult = (lab: GlobalBanksLab, testCase: GlobalBanksCase) => lab.calculate({ ...lab.initial, ...testCase.overrides });
const resultHasCode = (result: GlobalBanksResult, code: string) => result.status === 'STOP' && result.code === code;
const knownSourceIds = new Set(lesson406References.map(reference => reference.id));

export const globalBanksLabAudit = [
  { key: 'six labs and six fixture IDs are unique', passed: globalBanksLabs.length === 6 && new Set(globalBanksLabs.map(lab => lab.id)).size === 6 && new Set(globalBanksLabs.map(lab => lab.fixtureId)).size === 6 },
  { key: 'all labs have unique fields complete teaching records source IDs and at least four invariants', passed: globalBanksLabs.every(lab => new Set(lab.fields.map(field => field.key)).size === lab.fields.length && lab.formula.length > 0 && lab.defaultRebuild.length > 0 && lab.zeroOrNull.length > 0 && lab.counterexample.length > 0 && lab.evidenceCeiling.length > 0 && lab.invariants.length >= 4 && lab.sourceIds.length > 0 && lab.sourceIds.every(sourceId => knownSourceIds.has(sourceId))) },
  { key: 'all default fixtures resolve OK and every declared boundary counterexample STOP status is executable', passed: globalBanksLabs.every(lab => lab.calculate(lab.initial).status === 'OK' && lab.cases.every(testCase => caseResult(lab, testCase).status === testCase.expectedStatus)) },
  { key: 'every declared numeric field rejects strings decimals NaN infinity negatives and unsafe integers', passed: globalBanksLabs.every(lab => lab.fields.filter(field => field.kind === 'number').every(field => ['1', 0.5, Number.NaN, Number.POSITIVE_INFINITY, -1, MAX_SAFE + 1].every(invalid => lab.calculate({ ...lab.initial, [field.key]: invalid }).status === 'STOP'))) },
  { key: 'every declared enum field rejects out-of-contract values', passed: globalBanksLabs.every(lab => lab.fields.filter(field => field.kind === 'select').every(field => lab.calculate({ ...lab.initial, [field.key]: '__INVALID_ENUM__' }).status === 'STOP')) },
  { key: 'every canonical ID and timestamp rejects blank malformed or noncanonical values', passed: globalBanksLabs.every(lab => lab.fields.filter(field => field.kind === 'text').every(field => ['', ' BAD ', 'lowercase-id'].every(invalid => lab.calculate({ ...lab.initial, [field.key]: invalid }).status === 'STOP')) && lab.fields.filter(field => field.kind === 'timestamp').every(field => ['', ' BAD ', '2026-09-17'].every(invalid => lab.calculate({ ...lab.initial, [field.key]: invalid }).status === 'STOP'))) },
  { key: 'C1 exact comparable-core named aggregates are 120 and 140 with bridge +20', passed: valueNumber(globalBanksCanonicalResults.C1, 'lbsCrossBorderIntoHost') === 120 && valueNumber(globalBanksCanonicalResults.C1, 'cbsiForeignClaims') === 140 && valueNumber(globalBanksCanonicalResults.C1, 'cbsiMinusLbsBridge') === 20 && globalBanksCanonicalResults.C1.status === 'OK' && globalBanksCanonicalResults.C1.rows.some(([label]) => label === 'Comparable-core LBS cross-border into host') && globalBanksCanonicalResults.C1.rows.some(([label]) => label === 'Comparable-core CBSI foreign claims') },
  { key: 'C1 boundary permits CBSI lower than LBS and freezes benchmark plus full comparability passport', passed: (() => { const lower = calculateGlobalBanksC1({ ...globalBanksC1Fixture, localExternalClaims: 20, crossBorderIntragroupClaims: 50 }); return valueNumber(lower, 'lbsCrossBorderIntoHost') === 130 && valueNumber(lower, 'cbsiForeignClaims') === 100 && valueNumber(lower, 'cbsiMinusLbsBridge') === -30 && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, benchmarkReportingScope: 'exception_or_standalone' }), 'C1_BENCHMARK_SCOPE_REQUIRED') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, commonInstrumentPerimeter: 'includes_derivatives_or_other' }), 'C1_INSTRUMENT_PERIMETER_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, reportingPopulation: 'unmatched' }), 'C1_REPORTING_POPULATION_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, valuationSignConvention: 'unmatched' }), 'C1_VALUATION_SIGN_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, currencyAggregation: 'unmatched' }), 'C1_CURRENCY_AGGREGATION_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, externalCounterpartySector: 'unmatched' }), 'C1_COUNTERPARTY_SECTOR_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, maturityScope: 'unmatched' }), 'C1_MATURITY_SCOPE_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, asOfAlignment: 'unmatched' }), 'C1_AS_OF_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, dataVintageAlignment: 'unmatched' }), 'C1_VINTAGE_MISMATCH') && resultHasCode(calculateGlobalBanksC1({ ...globalBanksC1Fixture, requestedView: 'cbs_currency_split' }), 'C1_CBS_CURRENCY_SPLIT_UNAVAILABLE'); })() },
  { key: 'C2 is CBSI-only and returns foreign 100 international 50 exact LCLC share one-half', passed: valueNumber(globalBanksCanonicalResults.C2, 'foreignClaims') === 100 && valueNumber(globalBanksCanonicalResults.C2, 'internationalClaims') === 50 && valueFraction(globalBanksCanonicalResults.C2, 'lclcShareOfForeignClaims')?.text === '1/2' && resultHasCode(calculateGlobalBanksC2({ ...globalBanksC2Fixture, allocationBasis: 'CBSG' }), 'C2_CBSI_ONLY') },
  { key: 'C2 all-zero amounts preserve zero totals and null share', passed: (() => { const zero = calculateGlobalBanksC2({ ...globalBanksC2Fixture, directCrossBorderClaims: 0, localClaimsForeignCurrency: 0, localClaimsLocalCurrency: 0 }); return valueNumber(zero, 'foreignClaims') === 0 && valueNumber(zero, 'internationalClaims') === 0 && valueFraction(zero, 'lclcShareOfForeignClaims') === null; })() },
  { key: 'C3 LBS-only perimeter returns credit 70 claims 80 commitments 12 and seven-eighths', passed: valueNumber(globalBanksCanonicalResults.C3, 'lbsCredit') === 70 && valueNumber(globalBanksCanonicalResults.C3, 'lbsClaims') === 80 && valueNumber(globalBanksCanonicalResults.C3, 'undrawnCommitments') === 12 && valueFraction(globalBanksCanonicalResults.C3, 'creditShareOfClaims')?.text === '7/8' && resultHasCode(calculateGlobalBanksC3({ ...globalBanksC3Fixture, statisticalPerimeter: 'CBS' }), 'C3_LBS_ONLY') },
  { key: 'C3 excludes commitments and derivative notional from LBS claims', passed: valueNumber(calculateGlobalBanksC3({ ...globalBanksC3Fixture, undrawnCommitments: 100 }), 'lbsClaims') === 80 && resultHasCode(calculateGlobalBanksC3({ ...globalBanksC3Fixture, derivativeMeasure: 'notional' }), 'C3_DERIVATIVE_NOTIONAL_FORBIDDEN') && resultHasCode(calculateGlobalBanksC3({ ...globalBanksC3Fixture, commitmentTreatment: 'included_in_claims' }), 'C3_COMMITMENT_DOUBLE_COUNT') },
  { key: 'C4 imports only the exact five 4.05 statuses and declared temporal constraints while the identity and zero-null mapping remain in the 4.06-local contract', passed: JSON.stringify(globalBanksUpstreamTransferStatusEnum) === JSON.stringify(['realised', 'committed_executable', 'quoted_only', 'unavailable', 'null']) && globalBanksImportedUpstreamTemporalContract.timestampFormat === 'UTC ISO minute with Z' && globalBanksC4LocalScenarioContract.contractId === '406-c4-local-scenario-v1' && globalBanksC4LocalScenarioContract.importedFrom405.versionedTypedTransferSchemaConsumed === false && JSON.stringify(globalBanksC4LocalScenarioContract.localOfficeTypeEnum) === JSON.stringify(['head_office', 'branch', 'subsidiary']) },
  { key: 'C4 realised default uses same-entity distinct-office branch and distinct-entity subsidiary mappings', passed: globalBanksCanonicalResults.C4.status === 'OK' && valueNumber(globalBanksCanonicalResults.C4, 'currentRealisedContribution') === 20 && valueNumber(globalBanksCanonicalResults.C4, 'branchOfferCapacity') === 25 && valueNumber(globalBanksCanonicalResults.C4, 'subsidiaryOfferCapacity') === 30 },
  { key: 'C4 committed state stays out of current cash while preserving in-horizon conditional capacity', passed: (() => { const committed = calculateGlobalBanksC4({ ...globalBanksC4Fixture, upstreamStatus: 'committed_executable', valueTimestamp: '2026-09-18T09:00Z' }); return valueNumber(committed, 'currentRealisedContribution') === 0 && valueNumber(committed, 'decisionHorizonConditionalContribution') === 20 && valueNumber(committed, 'branchCurrentOfferCapacity') === 10 && valueNumber(committed, 'branchOfferCapacity') === 25; })() },
  { key: 'C4 separates quoted-only unavailable and null without collapsing known zero into unknown', passed: (() => { const quoted = calculateGlobalBanksC4({ ...globalBanksC4Fixture, upstreamStatus: 'quoted_only' }); const unavailable = calculateGlobalBanksC4({ ...globalBanksC4Fixture, upstreamStatus: 'unavailable' }); return quoted.status === 'OK' && unavailable.status === 'OK' && valueNumber(quoted, 'currentRealisedContribution') === 0 && valueNumber(quoted, 'decisionHorizonConditionalContribution') === 0 && valueNumber(quoted, 'branchOfferCapacity') === 10 && valueNumber(unavailable, 'branchOfferCapacity') === 10 && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, upstreamStatus: 'null' }), 'C4_UPSTREAM_STATUS_UNKNOWN'); })() },
  { key: 'C4 identity gates accept branch same legal entity but reject missing office same-entity subsidiary and reused mappings', passed: resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, branchReceiverIdentityPassport: 'missing' }), 'C4_BRANCH_OFFICE_IDENTITY_MISSING') && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, branchReceiverOfficeId: '' }), 'C4_INVALID_ID') && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, subsidiaryReceiverLegalEntityId: globalBanksC4Fixture.providerLegalEntityId }), 'C4_SUBSIDIARY_SAME_LEGAL_ENTITY') && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, subsidiaryReceiverLegalEntityId: globalBanksC4Fixture.branchReceiverLegalEntityId, subsidiaryReceiverOfficeId: globalBanksC4Fixture.branchReceiverOfficeId }), 'C4_RECEIVER_IDENTITY_REUSED') && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, subsidiaryCashLegId: globalBanksC4Fixture.branchCashLegId }), 'C4_CASH_LEG_ID_REUSED') },
  { key: 'C4 rejects future realised tagged-leg double counting and cross-layer identifier reuse', passed: resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, valueTimestamp: '2026-09-18T09:00Z' }), 'C4_REALISED_AFTER_AS_OF') && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, baseExcludesTaggedCashLeg: 'no' }), 'C4_TAGGED_CASH_LEG_DOUBLE_COUNT') && resultHasCode(calculateGlobalBanksC4({ ...globalBanksC4Fixture, subsidiaryCashLegId: globalBanksC4Fixture.branchTransactionId }), 'C4_TRANSACTION_CASH_LEG_ID_CONFLICT') },
  { key: 'C4 reversal case disproves a universal legal-form ranking', passed: (() => { const reversal = calculateGlobalBanksC4({ ...globalBanksC4Fixture, branchAdditionalLoanCap: 35, subsidiaryAdditionalLoanCap: 20 }); return valueNumber(reversal, 'branchOfferCapacity') === 30 && valueNumber(reversal, 'subsidiaryOfferCapacity') === 20; })() },
  { key: 'C5 same-asOf same-horizon default conserves 90 and exposes minus20 plus20 zero', passed: valueNumber(globalBanksCanonicalResults.C5, 'baselineTotal') === 90 && valueNumber(globalBanksCanonicalResults.C5, 'counterfactualTotal') === 90 && valueNumber(globalBanksCanonicalResults.C5, 'destinationAChange') === -20 && valueNumber(globalBanksCanonicalResults.C5, 'destinationBChange') === 20 && valueNumber(globalBanksCanonicalResults.C5, 'destinationCChange') === 0 && valueNumber(globalBanksCanonicalResults.C5, 'groupShrinkage') === 0 },
  { key: 'C5 rejects scope drift duplicates and undeclared shrinkage but separates declared group retrenchment', passed: resultHasCode(calculateGlobalBanksC5({ ...globalBanksC5Fixture, counterfactualAsOf: '2026-09-18T09:00Z' }), 'C5_AS_OF_MISMATCH') && resultHasCode(calculateGlobalBanksC5({ ...globalBanksC5Fixture, destinationBId: 'SYN-DEST-A' }), 'C5_DUPLICATE_DESTINATION_ID') && resultHasCode(calculateGlobalBanksC5({ ...globalBanksC5Fixture, counterfactualB: 40 }), 'C5_CONSERVATION_REQUIRED') && (() => { const contraction = calculateGlobalBanksC5({ ...globalBanksC5Fixture, allocationMode: 'group_retrenchment', counterfactualA: 20, counterfactualB: 40, counterfactualC: 20 }); return valueNumber(contraction, 'grossDestinationCuts') === 20 && valueNumber(contraction, 'grossDestinationExpansions') === 10 && valueNumber(contraction, 'groupShrinkage') === 10; })() },
  { key: 'C6 default visibly preserves minus20 minus8 minus3 perimeters and exact 17/20 substitution coverage', passed: valueNumber(globalBanksCanonicalResults.C6, 'globalBankRouteChange') === -20 && valueNumber(globalBanksCanonicalResults.C6, 'allBankCreditChange') === -8 && valueNumber(globalBanksCanonicalResults.C6, 'allObservedFinancingChange') === -3 && valueFraction(globalBanksCanonicalResults.C6, 'substitutionCoverage')?.text === '17/20' },
  { key: 'C6 unknown demand is accounting-only with unchanged arithmetic and complete zero substitution gives minus20 throughout', passed: (() => { const unknown = calculateGlobalBanksC6({ ...globalBanksC6Fixture, demandCondition: 'unknown' }); const zero = calculateGlobalBanksC6({ ...globalBanksC6Fixture, domesticBankAddition: 0, sameBankOtherRouteAddition: 0, otherForeignBankAddition: 0, bondFinancingAddition: 0 }); return unknown.status === 'ACCOUNTING_ONLY' && valueNumber(unknown, 'globalBankRouteChange') === -20 && valueNumber(unknown, 'allObservedFinancingChange') === -3 && valueNumber(zero, 'globalBankRouteChange') === -20 && valueNumber(zero, 'allBankCreditChange') === -20 && valueNumber(zero, 'allObservedFinancingChange') === -20; })() },
  { key: 'C6 incomplete and unknown coverage never receive all-bank values and preserve unobserved channels as unknown', passed: (() => { const incomplete = calculateGlobalBanksC6({ ...globalBanksC6Fixture, allBankCoverage: 'incomplete', sameBankOtherRoutePresence: 'missing', sameBankOtherRouteAddition: 0 }); const unknown = calculateGlobalBanksC6({ ...globalBanksC6Fixture, allBankCoverage: 'unknown' }); return incomplete.status === 'ACCOUNTING_ONLY' && unknown.status === 'ACCOUNTING_ONLY' && valueNumber(incomplete, 'coveredBankChannelsChange') === -11 && valueNumber(incomplete, 'allBankCreditChange') === null && valueNumber(unknown, 'coveredBankChannelsChange') === -8 && valueNumber(unknown, 'allBankCreditChange') === null && incomplete.values.unobservedBankChannels === 'unknown'; })() },
  { key: 'C6 coverage inventory rejects declaration conflicts nonzero missing placeholders route overdraft and duplicate IDs', passed: resultHasCode(calculateGlobalBanksC6({ ...globalBanksC6Fixture, allBankCoverage: 'complete', sameBankOtherRoutePresence: 'missing', sameBankOtherRouteAddition: 0 }), 'C6_COMPLETE_COVERAGE_HAS_MISSING_CHANNEL') && resultHasCode(calculateGlobalBanksC6({ ...globalBanksC6Fixture, allBankCoverage: 'incomplete' }), 'C6_INCOMPLETE_COVERAGE_WITHOUT_MISSING_CHANNEL') && resultHasCode(calculateGlobalBanksC6({ ...globalBanksC6Fixture, allBankCoverage: 'incomplete', sameBankOtherRoutePresence: 'missing' }), 'C6_UNOBSERVED_CHANNEL_AMOUNT_CONFLICT') && resultHasCode(calculateGlobalBanksC6({ ...globalBanksC6Fixture, globalBankRouteReduction: 61 }), 'C6_REDUCTION_EXCEEDS_BALANCE') && resultHasCode(calculateGlobalBanksC6({ ...globalBanksC6Fixture, otherForeignBankChannelId: 'SYN-GLOBAL-BANK-ROUTE' }), 'C6_DUPLICATE_CHANNEL_ID') },
] as const;

export const globalBanksLabAuditPassed = globalBanksLabAudit.every(assertion => assertion.passed);

if (!globalBanksLabAuditPassed) {
  throw new Error(`4.06 lab contract failed: ${globalBanksLabAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
