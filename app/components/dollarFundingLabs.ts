import type { DollarFundingSourceId } from '../lessons/dollarFundingReferences';

export type DollarFundingLabId = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';
export type DollarFundingInput = Readonly<Record<string, number | string>>;
export type DollarFundingResult =
  | { status: 'STOP'; reason: string }
  | { status: 'OK'; note: string; rows: readonly (readonly [string, string])[]; chart: readonly (number | null)[] };

type DollarFundingVisibilityRule = { key: string; values: readonly string[] };
type DollarFundingFieldBase = { key: string; label: string; visibleWhen?: readonly DollarFundingVisibilityRule[] };

export type DollarFundingField =
  | (DollarFundingFieldBase & { kind: 'number'; min: number; max: number; step: number; unit: string })
  | (DollarFundingFieldBase & { kind: 'timestamp'; min?: string; max?: string; unit: 'UTC ISO minute' })
  | (DollarFundingFieldBase & { kind: 'select'; options: readonly { value: string; label: string }[] });

export type DollarFundingLab = {
  id: DollarFundingLabId;
  fixtureId: string;
  title: string;
  question: string;
  passport: string;
  fields: readonly DollarFundingField[];
  initial: DollarFundingInput;
  formula: readonly string[];
  defaultRebuild: string;
  changeCondition: string;
  extremes: readonly string[];
  misconception: string;
  counterexample: string;
  unknownWarning: string;
  invariants: readonly string[];
  sourceIds: readonly DollarFundingSourceId[];
  chartTitle: string;
  chartLabels: readonly string[];
  calculate: (input: DollarFundingInput) => DollarFundingResult;
};

const yesNoUnknown = [
  { value: 'yes', label: 'Yes · 已验证' },
  { value: 'no', label: 'No · 不满足' },
  { value: 'unknown', label: 'Unknown · 缺证据' },
] as const;

function n(input: DollarFundingInput, key: string): number | null {
  const value = input[key];
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function s(input: DollarFundingInput, key: string): string | null {
  const value = input[key];
  return typeof value === 'string' && value.length > 0 ? value : null;
}

function fmt(value: number, unit = '', digits = 2) {
  const normalized = Object.is(value, -0) ? 0 : value;
  return `${normalized.toFixed(digits).replace('-', '−')}${unit}`;
}

function stopMissing(keys: readonly string[]): DollarFundingResult {
  return { status: 'STOP', reason: `缺少或非法字段：${keys.join('、')}。Unknown/null不能补0。` };
}

export function dollarFundingFieldIsActive(field: DollarFundingField, input: Readonly<Record<string, number | string>>): boolean {
  return !field.visibleWhen || field.visibleWhen.every(rule => rule.values.includes(String(input[rule.key] ?? '')));
}

type C6Leg = Readonly<{
  transactionId: string;
  legId: string;
  cashLegId?: string;
  sourceEventId: string;
  entity: string;
  currencyOrAsset: string;
  direction: 'IN' | 'OUT';
  amount: number;
  valueTimestamp: string;
  settlementStatus: C6CashStatus;
}>;

type C6CashStatus = 'realised' | 'committed_executable';
type C6TimeBucket = 'history' | 'current_horizon' | 'next';

const C6_DAY_MS = 86_400_000;

function c6TimestampMs(value: string | null): number | null {
  if (!value || !/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(value)) return null;
  const milliseconds = Date.parse(value);
  if (!Number.isFinite(milliseconds)) return null;
  const canonical = new Date(milliseconds).toISOString().slice(0, 16) + 'Z';
  return canonical === value ? milliseconds : null;
}

function c6AddDays(timestamp: string, days: number): string {
  const milliseconds = c6TimestampMs(timestamp);
  if (milliseconds === null || !Number.isInteger(days)) throw new Error('C6 timestamp/day contract invalid');
  return new Date(milliseconds + days * C6_DAY_MS).toISOString().slice(0, 16) + 'Z';
}

function c6DayOrdinal(timestamp: string, asOfTimestamp: string): number | null {
  const value = c6TimestampMs(timestamp); const asOf = c6TimestampMs(asOfTimestamp);
  if (value === null || asOf === null) return null;
  const difference = (value - asOf) / C6_DAY_MS;
  return Number.isInteger(difference) ? difference : null;
}

function c6TimeLabel(timestamp: string, asOfTimestamp: string): string {
  const ordinal = c6DayOrdinal(timestamp, asOfTimestamp);
  return `${ordinal === null ? 'off-grid' : ordinal < 0 ? `D−${Math.abs(ordinal)}` : `D${ordinal}`} · ${timestamp}`;
}

function c6InProspectiveWindow(valueTimestamp: string, asOfTimestamp: string, horizonEndTimestamp: string): boolean {
  const value = c6TimestampMs(valueTimestamp); const asOf = c6TimestampMs(asOfTimestamp); const horizonEnd = c6TimestampMs(horizonEndTimestamp);
  return value !== null && asOf !== null && horizonEnd !== null && value > asOf && value <= horizonEnd;
}

function c6TimeBucket(valueTimestamp: string, asOfTimestamp: string, horizonEndTimestamp: string): C6TimeBucket | null {
  const value = c6TimestampMs(valueTimestamp); const asOf = c6TimestampMs(asOfTimestamp); const horizonEnd = c6TimestampMs(horizonEndTimestamp);
  if (value === null || asOf === null || horizonEnd === null) return null;
  return value <= asOf ? 'history' : value <= horizonEnd ? 'current_horizon' : 'next';
}

function c6ValidateCashTiming(status: string, valueTimestamp: string, asOfTimestamp: string, label: string): DollarFundingResult | null {
  const value = c6TimestampMs(valueTimestamp); const asOf = c6TimestampMs(asOfTimestamp);
  if (value === null) return stopC6('C6_TIMESTAMP_FORMAT_INVALID', `${label}必须是canonical UTC ISO minute（YYYY-MM-DDTHH:mmZ）`);
  if (asOf === null) return stopC6('C6_AS_OF_TIMESTAMP_INVALID', 'as-of必须是canonical UTC ISO minute（YYYY-MM-DDTHH:mmZ）');
  if (status === 'realised' && value > asOf) return stopC6('C6_REALISED_FUTURE_SETTLEMENT', `${label}标为realised却晚于as-of`);
  if (status === 'committed_executable' && value <= asOf) return stopC6('C6_COMMITTED_NOT_FUTURE', `${label}标为committed executable却不晚于as-of`);
  if (!c6StatusIsCashEligible(status)) return stopC6('C6_STATUS_MISSING', `${label}缺少realised或committed executable状态`);
  return null;
}

function c6AmountInBucket(amount: number, bucket: C6TimeBucket | null, target: C6TimeBucket): number {
  return bucket === target ? amount : 0;
}

function c6ScheduleLabel(amount: number, timestamp: string, asOfTimestamp: string) {
  return `${fmt(amount, ' USD')} on ${c6TimeLabel(timestamp, asOfTimestamp)}`;
}

const c6SovereignPassport = Object.freeze({
  transactionId: 'SYN-C6-A-TX-001',
  fedEntity: 'SYN-FRBNY-01',
  foreignCentralBankEntity: 'SYN-FOREIGN-CB-01',
  legs: {
    initialUsd: { legId: 'SYN-C6-A-CASH-USD-INITIAL', sourceEventId: 'SYN-C6-A-EVENT-USD-INITIAL' },
    initialFcy: { legId: 'SYN-C6-A-CASH-FCY-INITIAL', sourceEventId: 'SYN-C6-A-EVENT-FCY-INITIAL' },
    reversalUsd: { legId: 'SYN-C6-A-CASH-USD-REVERSAL', sourceEventId: 'SYN-C6-A-EVENT-USD-REVERSAL' },
    reversalFcy: { legId: 'SYN-C6-A-CASH-FCY-REVERSAL', sourceEventId: 'SYN-C6-A-EVENT-FCY-REVERSAL' },
  },
});

const c6FimaPassport = Object.freeze({
  transactionId: 'SYN-C6-B-TX-001',
  holder: 'SYN-FIMA-HOLDER-01',
  counterparty: 'SYN-FED-SOMA-01',
  pool: 'SYN-C6-B-UST-POOL-001',
  lot: 'SYN-C6-B-UST-LOT-001',
  allocation: 'SYN-C6-B-ALLOC-001',
});

const c6LocalPassport = Object.freeze({
  transactionId: 'SYN-C6-C-TX-004',
  allocator: 'SYN-CB-01',
  recipient: 'SYN-BANK-09',
  program: 'SYN-LOCAL-AUCTION',
});

function stopC6(code: string, message: string): DollarFundingResult {
  return { status: 'STOP', reason: `${code} · ${message}；X_H=null，O_H=null。` };
}

function validateC6Legs(legs: readonly C6Leg[]): DollarFundingResult | null {
  const legKeys = new Map<string, string>();
  const cashKeys = new Map<string, string>();
  const sourceEvents = new Set<string>();
  for (const leg of legs) {
    const legKey = `${leg.transactionId}\u0000${leg.legId}`;
    const canonical = JSON.stringify(leg);
    if (legKeys.has(legKey)) {
      return stopC6(legKeys.get(legKey) === canonical ? 'C6_ID_DUPLICATE' : 'C6_ID_CONFLICT', `重复或冲突的(transactionId, legId)：${leg.transactionId}/${leg.legId}`);
    }
    legKeys.set(legKey, canonical);
    if (leg.cashLegId) {
      const cashKey = `${leg.transactionId}\u0000${leg.cashLegId}`;
      if (cashKeys.has(cashKey)) return stopC6('C6_ID_CONFLICT', `cashLegId并非一对一：${leg.transactionId}/${leg.cashLegId}`);
      cashKeys.set(cashKey, leg.legId);
    }
    if (sourceEvents.has(leg.sourceEventId)) return stopC6('C6_SOURCE_EVENT_DUPLICATE', `sourceEventId被不同腿重复使用：${leg.sourceEventId}`);
    sourceEvents.add(leg.sourceEventId);
  }
  return null;
}

function validateC6TransactionPassport(status: string, baseLegs: readonly C6Leg[]): DollarFundingResult | null {
  if (status === 'missing') return stopC6('C6_ID_MISSING', 'transaction/leg/source-event passport缺失');
  if (status === 'not_applicable') return stopC6('C6_ID_CONFLICT', '可入账交易不能把transaction passport标成not applicable');
  if (status === 'duplicate') return validateC6Legs([...baseLegs, baseLegs[0]]);
  if (status === 'conflict') return validateC6Legs([...baseLegs, { ...baseLegs[0], amount: baseLegs[0].amount + 0.01 }]);
  if (status !== 'unique') return stopC6('C6_ID_MISSING', 'transaction passport状态未知');
  return validateC6Legs(baseLegs);
}

function c6StatusIsCashEligible(status: string) {
  return status === 'realised' || status === 'committed_executable';
}

function c6ValidateActiveFieldContracts(fields: readonly DollarFundingField[], input: DollarFundingInput): DollarFundingResult | null {
  for (const field of fields) {
    if (!dollarFundingFieldIsActive(field, input)) continue;
    const value = input[field.key];
    if (value === undefined) continue;
    if (field.kind === 'select') {
      if (typeof value !== 'string' || !field.options.some(option => option.value === value)) {
        return stopC6(field.key === 'fimaMarginCashLegStatus' ? 'C6_FIMA_MARGIN_LEG_INVALID' : 'C6_INVALID_ENUM', `${field.key}不在当前活跃字段的声明枚举内`);
      }
      continue;
    }
    if (field.kind === 'number') {
      if (typeof value !== 'number' || !Number.isFinite(value) || value < field.min || value > field.max) {
        return stopC6('C6_ACTIVE_NUMBER_RANGE', `${field.key}必须落在活跃输入范围[${field.min}, ${field.max}]`);
      }
      continue;
    }
    if (typeof value !== 'string' || c6TimestampMs(value) === null) {
      return stopC6(field.key === 'asOfTimestamp' ? 'C6_AS_OF_TIMESTAMP_INVALID' : 'C6_TIMESTAMP_FORMAT_INVALID', `${field.key}必须是canonical UTC ISO minute（YYYY-MM-DDTHH:mmZ）`);
    }
    const valueMs = c6TimestampMs(value) as number;
    const belowMin = field.min ? valueMs < (c6TimestampMs(field.min) as number) : false;
    const aboveMax = field.max ? valueMs > (c6TimestampMs(field.max) as number) : false;
    if (belowMin || aboveMax) {
      return stopC6(field.key === 'asOfTimestamp' ? 'C6_AS_OF_TIMESTAMP_RANGE' : 'C6_ACTIVE_TIMESTAMP_RANGE', `${field.key}超出当前活跃输入的声明时间范围`);
    }
  }
  return null;
}

const c6CashStatusOptions = [
  { value: 'realised', label: 'Realised · settled at/before as-of' },
  { value: 'committed_executable', label: 'Committed executable · settles after as-of' },
] as const;

export const dollarFundingLabs: readonly DollarFundingLab[] = [
  {
    id: 'C1',
    fixtureId: '405-passport-v1',
    title: 'Funding Passport Builder：集团标签不能替代实体、币种与结算窗口。',
    question: '哪些最小字段齐全后，才可以提出“这个主体在7日内是否缺美元”？',
    passport: '独立SYN字段完整性实验；不加载真实银行、账户、支付消息、余额或其他C的状态。',
    fields: [
      { kind: 'select', key: 'entityKnown', label: 'Legal entity', options: yesNoUnknown },
      { kind: 'select', key: 'currencyKnown', label: 'Settlement currency', options: yesNoUnknown },
      { kind: 'select', key: 'horizonKnown', label: 'As-of + horizon', options: yesNoUnknown },
      { kind: 'select', key: 'valueDatesKnown', label: 'Value dates', options: yesNoUnknown },
      { kind: 'select', key: 'nettingKnown', label: 'Legal netting set', options: yesNoUnknown },
    ],
    initial: { entityKnown: 'yes', currencyKnown: 'yes', horizonKnown: 'yes', valueDatesKnown: 'yes', nettingKnown: 'yes' },
    formula: ['passport completeness = five verified gates', 'any unknown → exposure result null; any no → stated aggregation invalid'],
    defaultRebuild: '五个字段全部已验证，因此只通过“可以开始期限化记账”的门；它不会自动输出shortage、金额或概率。',
    changeCondition: '把Legal netting set改为Unknown，结果必须STOP，不能仍显示上一个完整状态。',
    extremes: ['五项Yes只表示对象可定义', '一项No会使拟议净额无效', '一项Unknown不会被当作Yes或0'],
    misconception: '填完passport不等于已经证明短缺或安全。',
    counterexample: '集团名称、国别和总美元净额都已知，但legal entity未知，仍不能决定哪些现金腿可净额。',
    unknownWarning: '未接入任何observed/PIT合同、账户、netting opinion或支付系统资料。',
    invariants: ['no cross-lab state', 'unknown stops', 'completeness is not risk score'],
    sourceIds: [2, 14],
    chartTitle: 'Passport五道门（1=已验证）',
    chartLabels: ['Entity', 'Currency', 'Horizon', 'Value dates', 'Netting'],
    calculate(input) {
      const values = ['entityKnown', 'currencyKnown', 'horizonKnown', 'valueDatesKnown', 'nettingKnown'].map(key => s(input, key));
      if (values.some(value => value === null)) return stopMissing(['passport gate']);
      const unknown = values.findIndex(value => value === 'unknown');
      if (unknown >= 0) return { status: 'STOP', reason: `第${unknown + 1}道门为Unknown；exposure=null，不用集团默认值替代。` };
      const failed = values.findIndex(value => value === 'no');
      if (failed >= 0) return { status: 'STOP', reason: `第${failed + 1}道门明确不满足；当前聚合/净额问题无效。` };
      return { status: 'OK', note: '对象护照完整；仅允许进入下一步现金流登记。', rows: [['结论', 'Passport complete — not a shortage score'], ['可做', '按实体、USD与H登记gross legs'], ['不可做', '从完整度推断概率或金额']], chart: [1, 1, 1, 1, 1] };
    },
  },
  {
    id: 'C2',
    fixtureId: '405-ladder-v1',
    title: 'Bank Dollar Maturity Ladder：只算行动前G_pre，collateral capacity保留在现金式之外。',
    question: '期初现金、合同收付、或有流出和最低缓冲怎样组成7日行动前缺口？',
    passport: '所有数字都是同一合成实体、同一USD cash单位和同一H；不执行sale、rollover、repo、FX swap、内部或官方route。',
    fields: [
      { kind: 'number', key: 'cash', label: 'C₀ usable cash', min: 0, max: 300, step: 1, unit: 'USD cash' },
      { kind: 'number', key: 'inflow', label: 'Iᶜ_H contractual inflow', min: 0, max: 300, step: 1, unit: 'USD cash' },
      { kind: 'number', key: 'outflow', label: 'Oᶜ_H contractual outflow', min: 0, max: 300, step: 1, unit: 'USD cash' },
      { kind: 'number', key: 'contingent', label: 'Oˣ_H contingent outflow', min: 0, max: 300, step: 1, unit: 'USD cash' },
      { kind: 'number', key: 'minimum', label: 'Cmin_H stated buffer', min: 0, max: 100, step: 1, unit: 'USD cash' },
      { kind: 'number', key: 'capacity', label: 'Potential collateral capacity', min: 0, max: 300, step: 1, unit: 'USD capacity · not cash' },
    ],
    initial: { cash: 25, inflow: 50, outflow: 120, contingent: 20, minimum: 0, capacity: 15 },
    formula: ['N_pre=C₀+Iᶜ−Oᶜ−Oˣ−Cmin', 'G_pre=max(0,−N_pre)', 'potential collateral capacity is displayed but excluded'],
    defaultRebuild: '25+50−120−20−0=−65；G_pre=65。另列15 potential capacity，但无交易/status/value date，因此答案不是50。',
    changeCondition: '只把contractual inflow从50改为70，G_pre降至45；capacity仍不进入等式。',
    extremes: ['G_pre可为0', '高capacity仍可与高G_pre并存', 'Cmin未知不允许默认为0'],
    misconception: '有抵押品并不等于现金已到账。',
    counterexample: '把15 capacity直接扣除得到50，会在后续repo receipt再次扣减同一能力，形成双重计算。',
    unknownWarning: '不是LCR、违约概率、现实银行压力或post-action liquidity。',
    invariants: ['G_pre only', 'capacity excluded', 'all cash fields nonnegative', 'no route inputs'],
    sourceIds: [1, 2, 18],
    chartTitle: 'SYN-2现金贡献与潜在capacity',
    chartLabels: ['Cash', 'Inflows', 'Contractual out', 'Contingent out', 'Buffer', 'Capacity not cash', 'G_pre'],
    calculate(input) {
      const keys = ['cash', 'inflow', 'outflow', 'contingent', 'minimum', 'capacity'] as const;
      const values = Object.fromEntries(keys.map(key => [key, n(input, key)]));
      if (keys.some(key => values[key] === null)) return stopMissing(keys);
      if (keys.some(key => (values[key] as number) < 0)) return { status: 'STOP', reason: 'SYN-2所有输入必须非负；方向由公式位置表达。' };
      const net = (values.cash as number) + (values.inflow as number) - (values.outflow as number) - (values.contingent as number) - (values.minimum as number);
      const gap = Math.max(0, -net);
      return { status: 'OK', note: '只报告行动前现金位置；potential capacity不参与算术。', rows: [['N_pre', fmt(net, ' USD')], ['G_pre', fmt(gap, ' USD')], ['Potential capacity', `${fmt(values.capacity as number, ' USD')} · NOT CASH`], ['G_post', '不存在／不输出']], chart: [values.cash as number, values.inflow as number, -(values.outflow as number), -(values.contingent as number), -(values.minimum as number), values.capacity as number, gap] };
    },
  },
  {
    id: 'C3',
    fixtureId: '405-router-v1',
    title: 'Instrument Substitution Router：价格存在不等于这家实体能在窗口内拿到钱。',
    question: '一条private repo route怎样从collateral marked value走到可执行cash receipt之前的capacity门？',
    passport: '独立private-repo SYN；只计算capacity与route gate，不读SYN-2 gap，也不生成post-action reconciliation。',
    fields: [
      { kind: 'number', key: 'markedValue', label: 'Collateral marked value', min: 0, max: 300, step: 1, unit: 'USD marked value' },
      { kind: 'number', key: 'encumbered', label: 'Already encumbered', min: 0, max: 300, step: 1, unit: 'USD marked value' },
      { kind: 'number', key: 'haircut', label: 'Haircut', min: 0, max: 50, step: 1, unit: '%' },
      { kind: 'number', key: 'limit', label: 'Counterparty limit', min: 0, max: 300, step: 1, unit: 'USD cash' },
      { kind: 'select', key: 'eligible', label: 'Entity/collateral eligible', options: yesNoUnknown },
      { kind: 'number', key: 'settlementDay', label: 'Earliest value day', min: 0, max: 30, step: 1, unit: 'days from as-of' },
      { kind: 'number', key: 'horizonDays', label: 'Horizon', min: 1, max: 30, step: 1, unit: 'days' },
    ],
    initial: { markedValue: 100, encumbered: 20, haircut: 5, limit: 70, eligible: 'yes', settlementDay: 2, horizonDays: 7 },
    formula: ['U=max(0, markedValue−encumbered)', 'capacity=min(limit,(1−haircut)×U)', 'route feasible requires eligibility and value date in H'],
    defaultRebuild: 'U=80，haircut后76，counterparty limit=70，所以capacity=70；value day D2在7日窗口内且eligible，但仍只是可执行性上限，不是settled receipt。',
    changeCondition: '把encumbered改为100，capacity变0；把eligibility改Unknown则STOP。',
    extremes: ['haircut 0仍需其他门', 'limit 0可使capacity为0', 'settlementDay>H时本窗口route不可用'],
    misconception: 'Secured route并非只要有Treasury就自动成立。',
    counterexample: 'marked value为100但全部encumbered时，屏幕repo rate再好也没有可重复质押的collateral。',
    unknownWarning: '未含真实repo quote、legal agreement、counterparty、settlement、margin或未来repurchase。',
    invariants: ['capacity is not cash', 'encumbered cannot exceed marked value', 'unknown access stops'],
    sourceIds: [1, 2, 18],
    chartTitle: '从marked value到route capacity',
    chartLabels: ['Marked value', 'Unencumbered', 'Haircut capacity', 'Limit', 'Final capacity'],
    calculate(input) {
      const marked = n(input, 'markedValue'); const enc = n(input, 'encumbered'); const haircut = n(input, 'haircut'); const limit = n(input, 'limit'); const settlement = n(input, 'settlementDay'); const horizon = n(input, 'horizonDays'); const eligible = s(input, 'eligible');
      if ([marked, enc, haircut, limit, settlement, horizon].some(value => value === null) || eligible === null) return stopMissing(['router input']);
      if ((enc as number) > (marked as number)) return { status: 'STOP', reason: 'Encumbered不能超过marked value；collateral ledger冲突。' };
      if (eligible === 'unknown') return { status: 'STOP', reason: 'Eligibility未知；capacity与receipt均保持null。' };
      const unencumbered = Math.max(0, (marked as number) - (enc as number));
      const haircutCapacity = unencumbered * (1 - (haircut as number) / 100);
      const capacity = eligible === 'yes' ? Math.min(limit as number, haircutCapacity) : 0;
      const inWindow = (settlement as number) <= (horizon as number);
      return { status: 'OK', note: `${eligible === 'yes' && inWindow ? 'Route gates pass at capacity level' : 'Route unavailable in current H'}；无binding transaction，因此cash receipt仍为null。`, rows: [['Unencumbered value', fmt(unencumbered, ' USD')], ['Haircut capacity', fmt(haircutCapacity, ' USD')], ['Limit-capped capacity', fmt(capacity, ' USD')], ['Value date in H', inWindow ? 'Yes' : 'No'], ['Cash receipt', 'null · no transaction/status']], chart: [marked as number, unencumbered, haircutCapacity, limit as number, capacity] };
    },
  },
  {
    id: 'C4',
    fixtureId: '405-cip-ledger-v1',
    title: 'CIP Cash-flow Ledger：完整quote passport之后，才计算直接与合成美元的相对价格。',
    question: '在声明“外币单位/美元”的报价方向下，spot、forward和两端利率是否形成一致的复制关系？',
    passport: '独立、单期、simple-rate SYN；不读取router，不输出shortage标签，不代表可交易quote。',
    fields: [
      { kind: 'select', key: 'passportComplete', label: 'Pair/direction/tenor/side complete', options: yesNoUnknown },
      { kind: 'number', key: 'spot', label: 'S · foreign currency per USD', min: 0.1, max: 10, step: 0.001, unit: 'FCY/USD' },
      { kind: 'number', key: 'forward', label: 'F · same direction', min: 0.1, max: 10, step: 0.001, unit: 'FCY/USD' },
      { kind: 'number', key: 'foreignRate', label: 'Foreign cash rate', min: -5, max: 25, step: 0.1, unit: '%' },
      { kind: 'number', key: 'usdRate', label: 'USD cash rate', min: -5, max: 25, step: 0.1, unit: '%' },
      { kind: 'number', key: 'tenorDays', label: 'Tenor', min: 1, max: 365, step: 1, unit: 'days/365' },
    ],
    initial: { passportComplete: 'yes', spot: 1.1, forward: 1.079, foreignRate: 3, usdRate: 5, tenorDays: 365 },
    formula: ['F_CIP=S×(1+r_f×τ)/(1+r_USD×τ)', 'implied r_USD=[(1+r_f×τ)×S/F−1]/τ', 'wedge=(implied r_USD−cash r_USD)×10,000bp'],
    defaultRebuild: 'F_CIP=1.1×1.03/1.05≈1.0790；输入F=1.079，implied USD约5.00%，wedge接近0bp。',
    changeCondition: '只把F改为1.07，观察implied USD与wedge改变；这仍不是shortage=yes。',
    extremes: ['passport Unknown直接STOP', '负利率在声明域内', 'F或S非正非法'],
    misconception: '任何wedge都不自动等于无风险利润或全球美元缺口。',
    counterexample: '同一数字若改用USD/FCY方向而未同步反转公式，wedge符号与含义都会错。',
    unknownWarning: '未含bid/ask、信用、抵押、day-count差异、capital、margin、execution size或市场冲击。',
    invariants: ['same quote direction', 'passport before arithmetic', 'no shortage label'],
    sourceIds: [1, 4, 5],
    chartTitle: 'CIP parity与输入forward',
    chartLabels: ['Input F', 'CIP F', 'Implied USD %', 'Cash USD %', 'Wedge bp'],
    calculate(input) {
      const complete = s(input, 'passportComplete'); const spot = n(input, 'spot'); const forward = n(input, 'forward'); const rf = n(input, 'foreignRate'); const ru = n(input, 'usdRate'); const days = n(input, 'tenorDays');
      if (complete === null || [spot, forward, rf, ru, days].some(value => value === null)) return stopMissing(['CIP passport/input']);
      if (complete !== 'yes') return { status: 'STOP', reason: complete === 'unknown' ? 'Quote passport未知；basis interpretation=null。' : 'Quote passport明确不完整；禁止计算。' };
      const tau = (days as number) / 365;
      const fCip = (spot as number) * (1 + (rf as number) / 100 * tau) / (1 + (ru as number) / 100 * tau);
      const impliedUsd = (((1 + (rf as number) / 100 * tau) * (spot as number) / (forward as number)) - 1) / tau * 100;
      const wedge = (impliedUsd - (ru as number)) * 100;
      return { status: 'OK', note: '显示一条声明报价约定下的SYN relative-price wedge；不输出shortage。', rows: [['CIP-consistent F', fmt(fCip, ' FCY/USD', 4)], ['Input F', fmt(forward as number, ' FCY/USD', 4)], ['Implied USD rate', fmt(impliedUsd, '%')], ['Cash USD rate', fmt(ru as number, '%')], ['SYN wedge', fmt(wedge, ' bp')]], chart: [forward as number, fCip, impliedUsd, ru as number, wedge] };
    },
  },
  {
    id: 'C5',
    fixtureId: '405-margin-loop-v1',
    title: 'Dollar Appreciation / Margin Loop：同一汇率变化必须经过三种主体资产负债表。',
    question: '美元升值时，未对冲债务人、自然对冲出口商与套保NBFI的现金压力为什么不同？',
    passport: '三个主体是独立合成卡；只共享同一个FX shock输入，不共享债务、收入、hedge或margin。',
    fields: [
      { kind: 'number', key: 'usdAppreciation', label: 'USD appreciation', min: -30, max: 30, step: 1, unit: '%' },
      { kind: 'number', key: 'unhedgedDebt', label: 'Importer USD payment', min: 0, max: 300, step: 1, unit: 'USD' },
      { kind: 'number', key: 'exportRevenue', label: 'Exporter natural USD revenue', min: 0, max: 300, step: 1, unit: 'USD' },
      { kind: 'number', key: 'exportDebt', label: 'Exporter USD payment', min: 0, max: 300, step: 1, unit: 'USD' },
      { kind: 'number', key: 'nbfiMargin', label: 'Hedged NBFI immediate margin', min: 0, max: 100, step: 1, unit: 'USD cash' },
    ],
    initial: { usdAppreciation: 10, unhedgedDebt: 100, exportRevenue: 80, exportDebt: 60, nbfiMargin: 12 },
    formula: ['unhedged home-currency burden index = USD payment×(1+FX shock)', 'export natural USD net = revenue−USD payment', 'hedged NBFI margin is an independent cash leg'],
    defaultRebuild: '未对冲100美元付款的本币指数从100升至110；出口商有80收入对60付款，净20美元自然缓冲；套保NBFI仍有12美元即时margin cash outflow。',
    changeCondition: '把exportRevenue降到40，出口商从+20自然缓冲变成−20美元缺口；其他主体不变。',
    extremes: ['FX shock 0不消除margin', '自然收入可大于或小于债务', '负shock代表美元贬值但主体路径仍需方向'],
    misconception: 'DXY或美元方向不能给所有主体同一个风险符号。',
    counterexample: '套保可以稳定最终本币价值，同时令衍生品margin在今天形成现金需求。',
    unknownWarning: '不代表真实FX quote、hedge ratio、资产价值、margin模型或主体净值。',
    invariants: ['three subjects separate', 'value and cash separated', 'DXY is not an input'],
    sourceIds: [1, 2, 9],
    chartTitle: '三主体SYN现金/负担指标',
    chartLabels: ['Importer burden Δ', 'Exporter USD net', 'NBFI margin outflow'],
    calculate(input) {
      const shock = n(input, 'usdAppreciation'); const debt = n(input, 'unhedgedDebt'); const revenue = n(input, 'exportRevenue'); const exportDebt = n(input, 'exportDebt'); const margin = n(input, 'nbfiMargin');
      if ([shock, debt, revenue, exportDebt, margin].some(value => value === null)) return stopMissing(['subject input']);
      const burdenChange = (debt as number) * (shock as number) / 100;
      const exportNet = (revenue as number) - (exportDebt as number);
      return { status: 'OK', note: '同一shock经三个独立passport产生不同结果；没有“全球统一方向”。', rows: [['Importer home-currency burden change', fmt(burdenChange, ' index units')], ['Exporter natural USD net', fmt(exportNet, ' USD')], ['Hedged NBFI immediate margin', fmt(margin as number, ' USD cash outflow')], ['Shortage label', 'not produced']], chart: [burdenChange, exportNet, -(margin as number)] };
    },
  },
  {
    id: 'C6',
    fixtureId: '405-backstop-v3',
    title: 'Official Backstop Routing：swap line、FIMA direct repo与local onward逐层判定。',
    question: '某条官方路线的上游美元，何时才能登记为当前ledger entity的cash receipt？',
    passport: '独立官方路线SYN-6；固定ID、主体、金额与日期均为作者合成。它不读取C1–C5或G_pre，不产生G_post，也不声称A/B/C穷尽全球官方安排。',
    fields: [
      { kind: 'select', key: 'route', label: 'Official layer', options: [
        { value: 'sovereign', label: 'Layer A · Fed↔foreign central bank swap' },
        { value: 'fima', label: 'Layer B · FIMA account-holder repo' },
        { value: 'local', label: 'Layer C · local onward operation' },
        { value: 'other', label: 'Other · separate passport required' },
      ] },
      { kind: 'select', key: 'routeStatus', label: 'Initial receipt / route status', options: [
        { value: 'realised', label: 'Realised · settled at/before as-of' },
        { value: 'committed_executable', label: 'Committed executable · settles after as-of' },
        { value: 'quoted_only', label: 'Quoted only · capacity, not cash' },
        { value: 'unavailable', label: 'Unavailable · known zero receipt' },
        { value: 'null', label: 'Null · status missing' },
      ] },
      { kind: 'select', key: 'transactionPassportStatus', label: 'Immutable transaction / leg passport', options: [
        { value: 'unique', label: 'Unique and complete' },
        { value: 'not_applicable', label: 'Not applicable · no transaction' },
        { value: 'missing', label: 'Missing' },
        { value: 'duplicate', label: 'Duplicate key' },
        { value: 'conflict', label: 'Same key, conflicting fields' },
      ] },
      { kind: 'timestamp', key: 'asOfTimestamp', label: 'As-of timestamp t', min: '2026-09-17T00:00Z', max: '2026-09-17T23:59Z', unit: 'UTC ISO minute' },
      { kind: 'number', key: 'horizonDays', label: 'Horizon H from D0', min: 1, max: 30, step: 1, unit: 'calendar days' },

      { kind: 'select', key: 'sovereignCounterpartyReadiness', label: 'Layer A Fed / foreign-CB counterparty readiness', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: yesNoUnknown },
      { kind: 'select', key: 'sovereignFedObligor', label: 'Fed contractual obligor / counterparty risk bearer', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'foreign_central_bank', label: 'Foreign central bank' }, { value: 'federal_reserve', label: 'Federal Reserve' }, { value: 'private_recipient', label: 'Private recipient' }, { value: 'unknown', label: 'Unknown' },
      ] },
      { kind: 'number', key: 'sovereignTermDays', label: 'Declared SYN swap term', min: 1, max: 30, step: 1, unit: 'calendar days', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'number', key: 'sovereignFcyPerUsdRate', label: 'Declared FCY per USD exchange rate', min: 0.0001, max: 1000, step: 0.0001, unit: 'FCY / USD', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'number', key: 'sovereignUsdInterestAmount', label: 'Declared USD interest amount', min: 0.01, max: 300, step: 0.01, unit: 'USD cash', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },

      { kind: 'select', key: 'sovereignInitialUsdLegStatus', label: 'Initial USD IN structure · foreign CB', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'sovereignInitialUsdCashStatus', label: 'Initial USD IN cash settlement status', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'sovereignInitialUsdAmount', label: 'Initial USD IN amount · foreign CB', min: 0, max: 300, step: 0.01, unit: 'USD cash IN', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'sovereignInitialUsdTimestamp', label: 'Initial USD IN timestamp', max: '2026-10-17T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },

      { kind: 'select', key: 'sovereignInitialFcyLegStatus', label: 'Initial FCY OUT structure · foreign CB', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'sovereignInitialFcyCashStatus', label: 'Initial FCY OUT cash settlement status', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'sovereignInitialFcyAmount', label: 'Initial FCY OUT amount · foreign CB', min: 0, max: 3000, step: 0.01, unit: 'FCY cash OUT', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'sovereignInitialFcyTimestamp', label: 'Initial FCY OUT timestamp', max: '2026-10-17T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },

      { kind: 'select', key: 'sovereignReversalUsdLegStatus', label: 'Reversal USD OUT structure · foreign CB', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'sovereignReversalUsdCashStatus', label: 'Reversal USD OUT cash settlement status', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'sovereignReversalUsdAmount', label: 'Reversal USD OUT amount · foreign CB', min: 0, max: 600, step: 0.01, unit: 'USD cash OUT', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'sovereignReversalUsdTimestamp', label: 'Reversal USD OUT timestamp', max: '2026-11-16T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },

      { kind: 'select', key: 'sovereignReversalFcyLegStatus', label: 'Reversal FCY IN structure · foreign CB', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'sovereignReversalFcyCashStatus', label: 'Reversal FCY IN cash settlement status', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'sovereignReversalFcyAmount', label: 'Reversal FCY IN amount · foreign CB', min: 0, max: 3000, step: 0.01, unit: 'FCY cash IN', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'sovereignReversalFcyTimestamp', label: 'Reversal FCY IN timestamp', max: '2026-11-16T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['sovereign'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },

      { kind: 'select', key: 'fimaApprovedHolder', label: 'Approved FIMA account holder', options: yesNoUnknown, visibleWhen: [{ key: 'route', values: ['fima'] }] },
      { kind: 'select', key: 'fimaTreasuryEligibility', label: 'Holder-owned Treasury eligibility', visibleWhen: [{ key: 'route', values: ['fima'] }], options: [
        { value: 'eligible', label: 'Eligible' }, { value: 'ineligible', label: 'Ineligible' }, { value: 'unknown', label: 'Unknown' },
      ] },
      { kind: 'select', key: 'fimaTreasuryAllocationStatus', label: 'Unique Treasury allocation', visibleWhen: [{ key: 'route', values: ['fima'] }], options: [
        { value: 'unique', label: 'Unique allocation' }, { value: 'reused', label: 'Reused / duplicate lot' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'number', key: 'fimaTreasuryAllocated', label: 'Initial Treasury delivery', min: 0, max: 300, step: 0.5, unit: 'USD marked value · asset OUT', visibleWhen: [{ key: 'route', values: ['fima'] }] },
      { kind: 'number', key: 'fimaInitialMarginPct', label: 'Initial margin / collateral deduction', min: 0, max: 100, step: 0.5, unit: '%', visibleWhen: [{ key: 'route', values: ['fima'] }] },
      { kind: 'number', key: 'fimaBilateralLimit', label: 'Facility / bilateral limit', min: 0, max: 300, step: 0.5, unit: 'USD cash', visibleWhen: [{ key: 'route', values: ['fima'] }] },
      { kind: 'select', key: 'fimaInitialLegStatus', label: 'Initial Treasury + USD legs', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'timestamp', key: 'fimaInitialValueTimestamp', label: 'Initial Treasury OUT / USD IN timestamp', max: '2026-10-17T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'number', key: 'fimaUsdReceiptAmount', label: 'Initial USD receipt', min: 0, max: 300, step: 0.01, unit: 'USD cash IN', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'select', key: 'fimaTerm', label: 'FIMA term passport', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'overnight', label: 'Overnight' },
        { value: 'seven_calendar_days', label: 'Seven-calendar-day' },
        { value: 'unknown', label: 'Unknown' },
        { value: 'invalid', label: 'Other / invalid term' },
      ] },
      { kind: 'select', key: 'fimaRepurchaseLegStatus', label: 'Repurchase USD + Treasury return legs', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'fimaRepurchaseCashStatus', label: 'Repurchase cash settlement status', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'fimaRepurchaseAmount', label: 'Repurchase USD payment', min: 0, max: 300, step: 0.01, unit: 'USD cash OUT', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'fimaRepurchaseValueTimestamp', label: 'USD repayment / Treasury return timestamp', max: '2026-10-24T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'select', key: 'fimaMarginCashLegStatus', label: 'Optional author-SYN additional margin cash leg', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'not_applicable', label: 'Not applicable' }, { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'fimaMarginCashStatus', label: 'Additional margin settlement status', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }, { key: 'fimaMarginCashLegStatus', values: ['complete'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'fimaMarginCashOutflowAmount', label: 'Additional margin cash outflow', min: 0, max: 300, step: 0.01, unit: 'USD cash OUT', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }, { key: 'fimaMarginCashLegStatus', values: ['complete'] }] },
      { kind: 'timestamp', key: 'fimaMarginCashValueTimestamp', label: 'Additional margin cash timestamp', max: '2026-10-24T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['fima'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }, { key: 'fimaMarginCashLegStatus', values: ['complete'] }] },

      { kind: 'select', key: 'localTransactionRelation', label: 'Layer C relation to upstream', visibleWhen: [{ key: 'route', values: ['local'] }], options: [
        { value: 'independent', label: 'Independent transaction' }, { value: 'reuses_upstream', label: 'Incorrectly reuses upstream IDs' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'localUpstreamProvenance', label: 'Upstream provenance only', visibleWhen: [{ key: 'route', values: ['local'] }], options: [
        { value: 'sovereign_swap', label: 'Sovereign swap' }, { value: 'fima', label: 'FIMA' }, { value: 'reserves', label: 'Own reserves' }, { value: 'other', label: 'Other declared source' }, { value: 'unknown', label: 'Unknown' },
      ] },
      { kind: 'select', key: 'localProgramAuthority', label: 'Local program authority', visibleWhen: [{ key: 'route', values: ['local'] }], options: [
        { value: 'verified', label: 'Verified' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'localRecipientEligibility', label: 'Local recipient eligible', options: yesNoUnknown, visibleWhen: [{ key: 'route', values: ['local'] }] },
      { kind: 'select', key: 'localAward', label: 'Independent local award', options: yesNoUnknown, visibleWhen: [{ key: 'route', values: ['local'] }] },
      { kind: 'number', key: 'localUsdReceiptAmount', label: 'Local USD receipt', min: 0, max: 300, step: 0.01, unit: 'USD cash IN', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'localValueTimestamp', label: 'Local USD value timestamp', max: '2026-10-17T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'select', key: 'localCollateralRequired', label: 'Recipient collateral required', options: yesNoUnknown, visibleWhen: [{ key: 'route', values: ['local'] }] },
      { kind: 'select', key: 'localCollateralPassportStatus', label: 'Recipient-owned collateral allocation', visibleWhen: [{ key: 'route', values: ['local'] }], options: [
        { value: 'not_applicable', label: 'Not applicable · no collateral required' }, { value: 'unique', label: 'Unique recipient-owned allocation' }, { value: 'reused', label: 'Reused / duplicate lot' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'number', key: 'localEligibleCollateralValue', label: 'Local eligible collateral value', min: 0, max: 300, step: 0.5, unit: 'USD marked value', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'localCollateralRequired', values: ['yes'] }] },
      { kind: 'number', key: 'localCollateralHaircutPct', label: 'Local collateral haircut', min: 0, max: 100, step: 0.5, unit: '%', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'localCollateralRequired', values: ['yes'] }] },
      { kind: 'number', key: 'localLimit', label: 'Local operation limit', min: 0, max: 300, step: 0.5, unit: 'USD cash', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'localCollateralRequired', values: ['yes'] }] },
      { kind: 'select', key: 'localRepaymentLegStatus', label: 'Local repayment leg', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: [
        { value: 'complete', label: 'Complete' }, { value: 'missing', label: 'Missing' }, { value: 'conflict', label: 'Conflict' },
      ] },
      { kind: 'select', key: 'localRepaymentCashStatus', label: 'Local repayment settlement status', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }], options: c6CashStatusOptions },
      { kind: 'number', key: 'localRepaymentAmount', label: 'Local USD repayment', min: 0, max: 300, step: 0.01, unit: 'USD cash OUT', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
      { kind: 'timestamp', key: 'localRepaymentValueTimestamp', label: 'Local repayment timestamp', max: '2026-10-24T23:59Z', unit: 'UTC ISO minute', visibleWhen: [{ key: 'route', values: ['local'] }, { key: 'routeStatus', values: ['realised', 'committed_executable'] }] },
    ],
    initial: {
      route: 'fima', routeStatus: 'committed_executable', transactionPassportStatus: 'unique', asOfTimestamp: '2026-09-17T09:00Z', horizonDays: 7,
      sovereignCounterpartyReadiness: 'yes', sovereignFedObligor: 'foreign_central_bank', sovereignTermDays: 7, sovereignFcyPerUsdRate: 1.2, sovereignUsdInterestAmount: 0.5,
      sovereignInitialUsdLegStatus: 'complete', sovereignInitialUsdCashStatus: 'committed_executable', sovereignInitialUsdAmount: 100, sovereignInitialUsdTimestamp: '2026-09-19T09:00Z',
      sovereignInitialFcyLegStatus: 'complete', sovereignInitialFcyCashStatus: 'committed_executable', sovereignInitialFcyAmount: 120, sovereignInitialFcyTimestamp: '2026-09-19T09:00Z',
      sovereignReversalUsdLegStatus: 'complete', sovereignReversalUsdCashStatus: 'committed_executable', sovereignReversalUsdAmount: 100.5, sovereignReversalUsdTimestamp: '2026-09-26T09:00Z',
      sovereignReversalFcyLegStatus: 'complete', sovereignReversalFcyCashStatus: 'committed_executable', sovereignReversalFcyAmount: 120, sovereignReversalFcyTimestamp: '2026-09-26T09:00Z',
      fimaApprovedHolder: 'yes', fimaTreasuryEligibility: 'eligible', fimaTreasuryAllocationStatus: 'unique',
      fimaTreasuryAllocated: 10, fimaInitialMarginPct: 5, fimaBilateralLimit: 10, fimaInitialLegStatus: 'complete',
      fimaInitialValueTimestamp: '2026-09-19T09:00Z', fimaUsdReceiptAmount: 9.1, fimaTerm: 'seven_calendar_days', fimaRepurchaseLegStatus: 'complete',
      fimaRepurchaseCashStatus: 'committed_executable', fimaRepurchaseAmount: 9.15, fimaRepurchaseValueTimestamp: '2026-09-26T09:00Z', fimaMarginCashLegStatus: 'not_applicable', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 0, fimaMarginCashValueTimestamp: '2026-09-19T09:00Z',
      localTransactionRelation: 'independent', localUpstreamProvenance: 'sovereign_swap', localProgramAuthority: 'verified',
      localRecipientEligibility: 'yes', localAward: 'yes', localUsdReceiptAmount: 15.5, localValueTimestamp: '2026-09-20T09:00Z',
      localCollateralRequired: 'no', localCollateralPassportStatus: 'not_applicable', localEligibleCollateralValue: 20,
      localCollateralHaircutPct: 0, localLimit: 20, localRepaymentLegStatus: 'complete', localRepaymentCashStatus: 'committed_executable', localRepaymentAmount: 15.6, localRepaymentValueTimestamp: '2026-10-17T09:00Z',
    },
    formula: ['H=(as-of timestamp, horizon-end timestamp]', 'Layer A: initial USD IN/FCY OUT同刻，reversal USD OUT/FCY IN同刻，reversal=initial+declared SYN term', 'Layer A: initial FCY=round(USD principal×declared rate, 2 FCY minor units)；reversal FCY=initial FCY原数量；reversal USD=principal+USD interest/compensation', 'capacity_B=min(limit,Treasury_allocated×(1−initial margin))', 'committed executable receipt只有在value timestamp∈H时进入X_H；realised settlement≤as-of进入C0/history且X_H=0', 'FIMA optional author-SYN additional margin: initialTimestamp < marginTimestamp < repurchaseTimestamp'],
    defaultRebuild: 'Layer B固定SYN：as-of=2026-09-17T09:00Z，H=(as-of, 2026-09-24T09:00Z]。10.00 Treasury×(1−5%)=9.50；min(9.50,10.00 limit)=9.50 capacity上限，9.10≤9.50。2026-09-19T09:00Z（D2）同时交付Treasury并登记9.10 USD committed-executable receipt；2026-09-26T09:00Z（D9）与D2相差7个日历日。所以X_B,H=9.10、O_B,H=0；D9的9.15 USD repurchase与Treasury return进入下一桶。已在as-of或之前结算的realised receipt只能进C0/history，不能再次进入X_H。',
    changeCondition: '只把D9 timestamp改成D8，seven-calendar-day term/date mismatch会STOP/null；改成O/N时必须同时把repurchase timestamp改为D3。本课可选author-SYN FIMA additional-margin腿若启用，在initial之前/同刻或在repurchase同刻/之后都STOP。',
    extremes: ['Layer A四腿任一缺失、0金额、ID/时间/汇率关系冲突均STOP', 'quoted-only/unavailable不读取隐藏四腿或FIMA交易字段', 'realised D0 receipt进入C0/history且X_H=0，realised+未来timestamp直接STOP', 'initial D30、seven-day D37仍可完整保留反向腿', 'local D3 receipt与D5 repayment会同时进入H', 'other route在独立passport建立前STOP'],
    misconception: '官方设施不是私人机构直接点击、自动足额的美元承诺。',
    counterexample: '只提供Layer A的100 USD initial却缺FCY与两条reversal，或把本课可选author-SYN FIMA additional-margin腿放在repo建立前/终止后，都必须STOP；Fed↔foreign-central-bank四腿完整也不能写成私人receipt。',
    unknownWarning: '没有真实holder、Treasury lot、limit、award、settlement、take-up、PIT vintage或政策效果。Layer A的1–30日只是本实验输入域；官方swap-line材料支持next day至最长3个月。本课逐笔FIMA additional-margin leg是可选author-SYN stress-ledger extension，不是已观察或官方公开的逐腿schedule。',
    invariants: ['layers separate', 'Layer A requires fixed FRBNY/foreign-CB entities plus four immutable two-currency legs; FRBNY executes under FOMC authorization', 'Layer A Fed contractual obligor is the foreign central bank; Layer C is not created and local onward risk is N/A', 'Layer A 1–30 day term is only the author-SYN input domain; official support runs from next day to a maximum of three months', 'H=(t,t+H] uses full UTC value timestamps', 'realised settlement≤t belongs to C0/history and never X_H', 'committed executable value time must be >t and enters X_H only when ≤horizon end', 'capacity is not cash', 'status separates realised/scheduled/quoted/unavailable/null', 'FIMA requires approved holder and unique eligible holder-owned Treasury allocation', 'O/N=+1 and seven-calendar-day=+7', 'optional author-SYN additional FIMA margin occurs strictly inside the repo lifecycle when enabled', 'transaction/leg/source-event IDs are immutable and unique', 'local onward has distinct transaction and repayment legs', 'no cross-lab state', 'no G_post', 'no observed/PIT/causal/production upgrade'],
    sourceIds: [10, 11, 12, 13],
    chartTitle: '独立官方route的capacity、H内收款与H内付款',
    chartLabels: ['Capacity / upstream amount', 'Current-H receipt X_H', 'Current-H outflow O_H'],
    calculate(input) {
      const route = s(input, 'route'); const routeStatus = s(input, 'routeStatus'); const passportStatus = s(input, 'transactionPassportStatus');
      const asOfTimestamp = s(input, 'asOfTimestamp'); const horizon = n(input, 'horizonDays');
      if (!route || !routeStatus || !passportStatus) return stopC6('C6_COMMON_INPUT_MISSING', 'route、status与transaction passport必须完整');
      if (!['sovereign', 'fima', 'local', 'other'].includes(route)) return stopC6('C6_ROUTE_INVALID', 'route不在{sovereign, fima, local, other}白名单内');
      const c6Fields = dollarFundingLabs.find(lab => lab.id === 'C6')?.fields ?? [];
      const activeFieldInvalid = c6ValidateActiveFieldContracts(c6Fields, input); if (activeFieldInvalid) return activeFieldInvalid;
      if (route === 'other') return stopC6('C6_OTHER_ROUTE_UNPASSPORTED', 'A/B/C不是全球穷尽分类；other route需另建passport');
      if (routeStatus === 'null') return stopC6('C6_STATUS_MISSING', 'route status未知，不能把capacity或announcement当cash');
      if (!['realised', 'committed_executable', 'quoted_only', 'unavailable'].includes(routeStatus)) return stopC6('C6_STATUS_MISSING', 'route status不在声明枚举内');
      if (!asOfTimestamp || c6TimestampMs(asOfTimestamp) === null) return stopC6('C6_AS_OF_TIMESTAMP_INVALID', 'as-of必须是canonical UTC ISO minute（YYYY-MM-DDTHH:mmZ）');
      if (horizon === null || !Number.isInteger(horizon) || horizon < 1 || horizon > 30) return stopC6('C6_HORIZON_INVALID', 'H必须是1–30个整数日历日');
      const horizonEndTimestamp = c6AddDays(asOfTimestamp, horizon);
      const initialDomainEnd = c6AddDays(asOfTimestamp, 30);
      const reverseDomainEnd = c6AddDays(asOfTimestamp, 37);
      const sovereignReverseDomainEnd = c6AddDays(asOfTimestamp, 60);
      const transactionRequired = c6StatusIsCashEligible(routeStatus);
      if (transactionRequired && passportStatus === 'not_applicable') return stopC6('C6_ID_CONFLICT', 'cash-eligible status要求唯一transaction/leg passport');
      if (!transactionRequired && passportStatus !== 'not_applicable') return stopC6('C6_ID_CONFLICT', 'quoted-only或unavailable不得携带虚构的binding transaction passport');

      if (route === 'sovereign') {
        if (!transactionRequired) return { status: 'OK', note: routeStatus === 'quoted_only' ? 'Layer A只有合成route indication；没有binding transaction，隐藏的四腿字段不被读取。' : 'Layer A路线已知不可用；没有transaction，隐藏的四腿字段不被读取。', rows: [['Layer A fixed counterparties', `${c6SovereignPassport.fedEntity} ↔ ${c6SovereignPassport.foreignCentralBankEntity}`], ['Layer A transaction', 'none · no binding transaction'], ['Foreign-central-bank upstream amount', routeStatus === 'quoted_only' ? 'null · quoted only' : '0 USD · unavailable'], ['Private recipient receipt X_H', '0 USD · Layer C not created'], ['Private recipient outflow O_H', '0 USD']], chart: [routeStatus === 'quoted_only' ? null : 0, 0, 0] };

        const readiness = s(input, 'sovereignCounterpartyReadiness'); const fedObligor = s(input, 'sovereignFedObligor');
        const termDays = n(input, 'sovereignTermDays'); const fcyPerUsd = n(input, 'sovereignFcyPerUsdRate'); const usdInterest = n(input, 'sovereignUsdInterestAmount');
        if (!readiness || !fedObligor || termDays === null || fcyPerUsd === null || usdInterest === null) return stopC6('C6_SOVEREIGN_PASSPORT_MISSING', 'Layer A readiness、Fed contractual obligor、term、exchange rate与USD interest必须完整');
        if (readiness !== 'yes') return stopC6(readiness === 'unknown' ? 'C6_SOVEREIGN_READINESS_UNKNOWN' : 'C6_SOVEREIGN_NOT_READY', 'Fed与foreign central bank对手准备度必须已验证');
        if (fedObligor !== 'foreign_central_bank') return stopC6(fedObligor === 'unknown' ? 'C6_SOVEREIGN_FED_OBLIGOR_UNKNOWN' : 'C6_SOVEREIGN_FED_OBLIGOR_CONFLICT', 'Fed contractual obligor / counterparty risk bearer必须是foreign central bank；Layer A没有创建Layer C，本地onward风险不适用');
        if (!Number.isInteger(termDays) || termDays < 1 || termDays > 30) return stopC6('C6_SOVEREIGN_TERM_INVALID', 'Layer A declared SYN term必须是本实验输入域内1–30个整数日历日；这不是官方期限上限');
        if (fcyPerUsd <= 0 || usdInterest <= 0) return stopC6('C6_SOVEREIGN_RATE_OR_INTEREST_INVALID', 'FCY per USD rate与USD interest amount必须为正');

        const layerAInputs = [
          { key: 'initialUsd', label: 'initial USD IN', structure: s(input, 'sovereignInitialUsdLegStatus'), cashStatus: s(input, 'sovereignInitialUsdCashStatus'), amount: n(input, 'sovereignInitialUsdAmount'), timestamp: s(input, 'sovereignInitialUsdTimestamp'), currency: 'USD', direction: 'IN' as const, identity: c6SovereignPassport.legs.initialUsd },
          { key: 'initialFcy', label: 'initial FCY OUT', structure: s(input, 'sovereignInitialFcyLegStatus'), cashStatus: s(input, 'sovereignInitialFcyCashStatus'), amount: n(input, 'sovereignInitialFcyAmount'), timestamp: s(input, 'sovereignInitialFcyTimestamp'), currency: 'SYN-FCY', direction: 'OUT' as const, identity: c6SovereignPassport.legs.initialFcy },
          { key: 'reversalUsd', label: 'reversal USD OUT', structure: s(input, 'sovereignReversalUsdLegStatus'), cashStatus: s(input, 'sovereignReversalUsdCashStatus'), amount: n(input, 'sovereignReversalUsdAmount'), timestamp: s(input, 'sovereignReversalUsdTimestamp'), currency: 'USD', direction: 'OUT' as const, identity: c6SovereignPassport.legs.reversalUsd },
          { key: 'reversalFcy', label: 'reversal FCY IN', structure: s(input, 'sovereignReversalFcyLegStatus'), cashStatus: s(input, 'sovereignReversalFcyCashStatus'), amount: n(input, 'sovereignReversalFcyAmount'), timestamp: s(input, 'sovereignReversalFcyTimestamp'), currency: 'SYN-FCY', direction: 'IN' as const, identity: c6SovereignPassport.legs.reversalFcy },
        ] as const;
        for (const leg of layerAInputs) {
          if (!leg.structure || !leg.cashStatus || leg.amount === null || !leg.timestamp) return stopC6('C6_SOVEREIGN_LEG_MISSING', `${leg.label}结构、settlement status、amount与timestamp必须完整`);
          if (leg.structure !== 'complete') return stopC6(`C6_SOVEREIGN_LEG_${leg.structure.toUpperCase()}`, `${leg.label}结构不完整`);
          if (leg.amount <= 0) return stopC6('C6_SOVEREIGN_AMOUNT_NONPOSITIVE', `${leg.label}金额必须为正`);
        }
        const [initialUsd, initialFcy, reversalUsd, reversalFcy] = layerAInputs;
        if (initialUsd.cashStatus !== routeStatus) return stopC6('C6_SOVEREIGN_ROUTE_STATUS_CONFLICT', 'route status必须与initial USD receipt的settlement status一致');
        if (initialUsd.cashStatus !== initialFcy.cashStatus) return stopC6('C6_SOVEREIGN_INITIAL_STATUS_MISMATCH', '同时结算的initial USD IN与FCY OUT必须具有一致settlement status');
        if (reversalUsd.cashStatus !== reversalFcy.cashStatus) return stopC6('C6_SOVEREIGN_REVERSAL_STATUS_MISMATCH', '同时结算的reversal USD OUT与FCY IN必须具有一致settlement status');
        for (const leg of layerAInputs) {
          const timingInvalid = c6ValidateCashTiming(leg.cashStatus as string, leg.timestamp as string, asOfTimestamp, `Layer A ${leg.label}`); if (timingInvalid) return timingInvalid;
        }
        if (initialUsd.timestamp !== initialFcy.timestamp) return stopC6('C6_SOVEREIGN_INITIAL_TIMESTAMP_MISMATCH', 'initial USD IN与FCY OUT必须在同一canonical UTC timestamp');
        if (reversalUsd.timestamp !== reversalFcy.timestamp) return stopC6('C6_SOVEREIGN_REVERSAL_TIMESTAMP_MISMATCH', 'reversal USD OUT与FCY IN必须在同一canonical UTC timestamp');
        const expectedReversalTimestamp = c6AddDays(initialUsd.timestamp as string, termDays);
        if (reversalUsd.timestamp !== expectedReversalTimestamp) return stopC6('C6_SOVEREIGN_TERM_DATE_MISMATCH', `declared ${termDays}-day term要求${expectedReversalTimestamp}反转，当前却是${reversalUsd.timestamp}`);
        if ((c6TimestampMs(initialUsd.timestamp as string) as number) > (c6TimestampMs(initialDomainEnd) as number)) return stopC6('C6_INITIAL_TIMESTAMP_DOMAIN_EXCEEDED', 'Layer A initial timestamp晚于as-of+30日');
        if ((c6TimestampMs(reversalUsd.timestamp as string) as number) > (c6TimestampMs(sovereignReverseDomainEnd) as number)) return stopC6('C6_SOVEREIGN_REVERSAL_TIMESTAMP_DOMAIN_EXCEEDED', 'Layer A reversal timestamp晚于as-of+60日');
        const amountMatches = (actual: number | null, expected: number) => actual !== null && Math.abs(actual - expected) <= 1e-8;
        const roundFcyMinorUnits = (value: number) => Math.round((value + Number.EPSILON) * 100) / 100;
        const expectedInitialFcy = roundFcyMinorUnits((initialUsd.amount as number) * fcyPerUsd);
        if (!amountMatches(initialFcy.amount, expectedInitialFcy)) return stopC6('C6_SOVEREIGN_INITIAL_FCY_RATE_MISMATCH', `initial FCY OUT必须等于USD principal×declared rate后按2位FCY最小结算单位四舍五入：${fmt(expectedInitialFcy, ' FCY')}`);
        if (!amountMatches(reversalUsd.amount, (initialUsd.amount as number) + usdInterest)) return stopC6('C6_SOVEREIGN_USD_REVERSAL_MISMATCH', 'reversal USD OUT必须等于principal+declared USD interest');
        if (!amountMatches(reversalFcy.amount, initialFcy.amount as number)) return stopC6('C6_SOVEREIGN_REVERSAL_FCY_QUANTITY_MISMATCH', 'reversal FCY IN必须返还initial FCY OUT的原数量；USD interest/compensation不改变FCY返还量');
        const legs: readonly C6Leg[] = layerAInputs.map(leg => ({ transactionId: c6SovereignPassport.transactionId, legId: leg.identity.legId, cashLegId: leg.identity.legId, sourceEventId: leg.identity.sourceEventId, entity: c6SovereignPassport.foreignCentralBankEntity, currencyOrAsset: leg.currency, direction: leg.direction, amount: leg.amount as number, valueTimestamp: leg.timestamp as string, settlementStatus: leg.cashStatus as C6CashStatus }));
        const invalid = validateC6TransactionPassport(passportStatus, legs); if (invalid) return invalid;
        const buckets = legs.map(leg => c6TimeBucket(leg.valueTimestamp, asOfTimestamp, horizonEndTimestamp));
        const classify = (target: C6TimeBucket) => legs.map((leg, index) => buckets[index] === target ? `${leg.legId} ${fmt(leg.amount, ` ${leg.currencyOrAsset}`)} ${leg.direction}` : null).filter((value): value is string => value !== null).join(' + ') || 'none';
        return { status: 'OK', note: 'Layer A四腿完整验证并按foreign-central-bank时间轴分桶；FRBNY执行FOMC授权的安排；任何history/current/next分类都不自动创造私人recipient cash。', rows: [['Layer A fixed counterparties', `${c6SovereignPassport.fedEntity} ↔ ${c6SovereignPassport.foreignCentralBankEntity}`], ['Fed execution / authorization', 'FRBNY execution · FOMC authorization'], ['Layer A immutable transaction', c6SovereignPassport.transactionId], ['Fed contractual obligor / counterparty risk bearer', 'foreign central bank'], ['Layer C / local onward risk', 'not created / N/A'], ['Declared SYN term / rate / USD interest', `${termDays} days / ${fmt(fcyPerUsd, ' FCY per USD', 4)} / ${fmt(usdInterest, ' USD')}`], ['Declared FCY minor-unit rule', 'round to 2 FCY decimal places'], ...legs.map((leg, index) => [`${layerAInputs[index].label} · ${leg.legId} · ${leg.sourceEventId}`, `${fmt(leg.amount, ` ${leg.currencyOrAsset}`)} ${leg.direction} · ${c6TimeLabel(leg.valueTimestamp, asOfTimestamp)} · ${leg.settlementStatus}`] as const), ['Foreign-CB history legs', classify('history')], ['Foreign-CB current-H legs', classify('current_horizon')], ['Foreign-CB next legs', classify('next')], ['Private recipient receipt X_H', '0 USD · Layer C not created'], ['Private recipient outflow O_H', '0 USD']], chart: [initialUsd.amount as number, 0, 0] };
      }

      if (route === 'fima') {
        const holder = s(input, 'fimaApprovedHolder'); const treasuryEligibility = s(input, 'fimaTreasuryEligibility'); const allocation = s(input, 'fimaTreasuryAllocationStatus');
        const treasury = n(input, 'fimaTreasuryAllocated'); const marginPct = n(input, 'fimaInitialMarginPct'); const limit = n(input, 'fimaBilateralLimit');
        if (!holder || !treasuryEligibility || !allocation || treasury === null || marginPct === null || limit === null) return stopC6('C6_FIMA_COLLATERAL_MISSING', 'holder、Treasury allocation、margin与limit必须完整');
        if (holder !== 'yes') return stopC6(holder === 'unknown' ? 'C6_FIMA_HOLDER_UNKNOWN' : 'C6_FIMA_NOT_APPROVED', 'FIMA直接对手必须是获批官方账户持有人');
        if (treasuryEligibility !== 'eligible') return stopC6(treasuryEligibility === 'unknown' ? 'C6_FIMA_TREASURY_UNKNOWN' : 'C6_FIMA_TREASURY_INELIGIBLE', '必须验证holder-owned Treasury资格');
        if (allocation !== 'unique') return stopC6(allocation === 'reused' ? 'C6_FIMA_COLLATERAL_REUSED' : allocation === 'missing' ? 'C6_FIMA_COLLATERAL_MISSING' : 'C6_FIMA_COLLATERAL_CONFLICT', 'Treasury lot必须唯一分配给当前FIMA transaction');
        const capacity = Math.min(limit as number, (treasury as number) * (1 - (marginPct as number) / 100));
        if (routeStatus === 'quoted_only') return { status: 'OK', note: '只有合成capacity；没有binding transaction，所以X_H与O_H保持null。', rows: [['FIMA holder / collateral', `${c6FimaPassport.holder} · ${c6FimaPassport.lot} unique`], ['Capacity upper bound', fmt(capacity, ' USD')], ['Receipt X_H', 'null · quoted only'], ['Outflow O_H', 'null · quoted only']], chart: [capacity, null, null] };
        if (routeStatus === 'unavailable') return { status: 'OK', note: '路线已知不可用；这是0 receipt，不是unknown。', rows: [['FIMA holder / collateral', `${c6FimaPassport.holder} · ${c6FimaPassport.lot} unique`], ['Capacity upper bound', fmt(capacity, ' USD')], ['Receipt X_H', '0 USD · unavailable'], ['Outflow O_H', '0 USD · no transaction']], chart: [capacity, 0, 0] };

        const initialLegStatus = s(input, 'fimaInitialLegStatus'); const initialTimestamp = s(input, 'fimaInitialValueTimestamp'); const receipt = n(input, 'fimaUsdReceiptAmount'); const term = s(input, 'fimaTerm');
        const repurchaseLegStatus = s(input, 'fimaRepurchaseLegStatus'); const repurchaseCashStatus = s(input, 'fimaRepurchaseCashStatus'); const repurchase = n(input, 'fimaRepurchaseAmount'); const repurchaseTimestamp = s(input, 'fimaRepurchaseValueTimestamp');
        const marginLegStatus = s(input, 'fimaMarginCashLegStatus');
        if (!initialLegStatus || receipt === null || !term || !repurchaseLegStatus || !repurchaseCashStatus || repurchase === null || !marginLegStatus) return stopC6('C6_FIMA_LEG_MISSING', '初始、回购或margin腿字段缺失');
        if (!initialTimestamp) return stopC6('C6_FIMA_INITIAL_TIMESTAMP_MISSING', 'FIMA initial timestamp缺失');
        if (!repurchaseTimestamp) return stopC6('C6_FIMA_REPURCHASE_TIMESTAMP_MISSING', 'FIMA repurchase timestamp缺失');
        if (initialLegStatus !== 'complete') return stopC6(`C6_FIMA_INITIAL_LEG_${initialLegStatus.toUpperCase()}`, 'Treasury OUT与USD IN必须成对完整');
        if (repurchaseLegStatus !== 'complete') return stopC6(`C6_FIMA_REPURCHASE_LEG_${repurchaseLegStatus.toUpperCase()}`, 'USD OUT与Treasury return必须成对完整');
        const termDays = term === 'overnight' ? 1 : term === 'seven_calendar_days' ? 7 : null;
        if (termDays === null) return stopC6(term === 'unknown' ? 'C6_FIMA_TERM_MISSING' : 'C6_FIMA_TERM_INVALID', '当前官方期限只能是O/N或seven-calendar-day');
        const initialTimingInvalid = c6ValidateCashTiming(routeStatus, initialTimestamp, asOfTimestamp, 'FIMA initial receipt'); if (initialTimingInvalid) return initialTimingInvalid;
        const repurchaseTimingInvalid = c6ValidateCashTiming(repurchaseCashStatus, repurchaseTimestamp, asOfTimestamp, 'FIMA repurchase cash leg'); if (repurchaseTimingInvalid) return repurchaseTimingInvalid;
        if ((c6TimestampMs(initialTimestamp) as number) > (c6TimestampMs(initialDomainEnd) as number)) return stopC6('C6_INITIAL_TIMESTAMP_DOMAIN_EXCEEDED', 'FIMA initial timestamp晚于as-of+30日');
        if ((c6TimestampMs(repurchaseTimestamp) as number) > (c6TimestampMs(reverseDomainEnd) as number)) return stopC6('C6_REVERSE_TIMESTAMP_DOMAIN_EXCEEDED', 'FIMA reverse timestamp晚于as-of+37日');
        const expectedRepurchaseTimestamp = c6AddDays(initialTimestamp, termDays);
        if (repurchaseTimestamp !== expectedRepurchaseTimestamp) return stopC6('C6_FIMA_TERM_DATE_MISMATCH', `${term}要求${expectedRepurchaseTimestamp}回购，当前却是${repurchaseTimestamp}`);
        if ((receipt as number) > capacity) return stopC6('C6_FIMA_MARGIN_LIMIT_BREACH', `${fmt(receipt as number, ' USD')} receipt超过${fmt(capacity, ' USD')} capacity`);
        if ((receipt as number) <= 0 || (repurchase as number) <= 0 || (repurchase as number) < (receipt as number)) return stopC6('C6_FIMA_LEG_CONFLICT', '初始receipt与repurchase金额必须为正，且本SYN回购额不得小于principal');
        let marginAmount = 0; let marginTimestamp: string | null = null; let marginCashStatus: C6CashStatus | null = null;
        if (!['not_applicable', 'complete', 'missing', 'conflict'].includes(marginLegStatus)) return stopC6('C6_FIMA_MARGIN_LEG_INVALID', 'additional margin cash-leg structure status不在声明枚举内');
        if (marginLegStatus === 'missing' || marginLegStatus === 'conflict') return stopC6(`C6_FIMA_MARGIN_LEG_${marginLegStatus.toUpperCase()}`, '额外margin cash leg状态不完整');
        if (marginLegStatus === 'complete') {
          const amount = n(input, 'fimaMarginCashOutflowAmount'); const timestamp = s(input, 'fimaMarginCashValueTimestamp'); const status = s(input, 'fimaMarginCashStatus');
          if (amount === null || amount <= 0 || !status) return stopC6('C6_FIMA_MARGIN_LEG_MISSING', '完整margin腿必须给出正amount与settlement status');
          if (!timestamp) return stopC6('C6_FIMA_MARGIN_TIMESTAMP_MISSING', '完整margin腿必须给出value timestamp');
          const marginMs = c6TimestampMs(timestamp); const initialMs = c6TimestampMs(initialTimestamp); const repurchaseMs = c6TimestampMs(repurchaseTimestamp);
          if (marginMs === null) return stopC6('C6_TIMESTAMP_FORMAT_INVALID', 'FIMA margin cash leg必须是canonical UTC ISO minute（YYYY-MM-DDTHH:mmZ）');
          if (initialMs === null || repurchaseMs === null) return stopC6('C6_FIMA_MARGIN_LIFECYCLE_UNRESOLVED', 'initial与repurchase timestamp必须先通过canonical UTC校验');
          if (marginMs <= initialMs) return stopC6('C6_FIMA_MARGIN_NOT_AFTER_INITIAL', 'additional margin timestamp必须严格晚于initial timestamp');
          if (marginMs >= repurchaseMs) return stopC6('C6_FIMA_MARGIN_NOT_BEFORE_REPURCHASE', 'additional margin timestamp必须严格早于repurchase timestamp');
          const marginTimingInvalid = c6ValidateCashTiming(status, timestamp, asOfTimestamp, 'FIMA margin cash leg'); if (marginTimingInvalid) return marginTimingInvalid;
          if ((c6TimestampMs(timestamp) as number) > (c6TimestampMs(reverseDomainEnd) as number)) return stopC6('C6_REVERSE_TIMESTAMP_DOMAIN_EXCEEDED', 'FIMA margin timestamp晚于as-of+37日');
          marginAmount = amount; marginTimestamp = timestamp; marginCashStatus = status as C6CashStatus;
        }
        const legs: C6Leg[] = [
          { transactionId: c6FimaPassport.transactionId, legId: 'SYN-C6-B-ASSET-INITIAL', sourceEventId: 'SYN-C6-B-EVENT-ASSET-INITIAL', entity: c6FimaPassport.holder, currencyOrAsset: 'US Treasury', direction: 'OUT', amount: treasury as number, valueTimestamp: initialTimestamp, settlementStatus: routeStatus as C6CashStatus },
          { transactionId: c6FimaPassport.transactionId, legId: 'SYN-C6-B-CASH-USD-INITIAL', cashLegId: 'SYN-C6-B-CASH-USD-INITIAL', sourceEventId: 'SYN-C6-B-EVENT-CASH-INITIAL', entity: c6FimaPassport.holder, currencyOrAsset: 'USD', direction: 'IN', amount: receipt as number, valueTimestamp: initialTimestamp, settlementStatus: routeStatus as C6CashStatus },
          { transactionId: c6FimaPassport.transactionId, legId: 'SYN-C6-B-CASH-USD-REPURCHASE', cashLegId: 'SYN-C6-B-CASH-USD-REPURCHASE', sourceEventId: 'SYN-C6-B-EVENT-CASH-REPURCHASE', entity: c6FimaPassport.holder, currencyOrAsset: 'USD', direction: 'OUT', amount: repurchase as number, valueTimestamp: repurchaseTimestamp, settlementStatus: repurchaseCashStatus as C6CashStatus },
          { transactionId: c6FimaPassport.transactionId, legId: 'SYN-C6-B-ASSET-RETURN', sourceEventId: 'SYN-C6-B-EVENT-ASSET-RETURN', entity: c6FimaPassport.holder, currencyOrAsset: 'US Treasury', direction: 'IN', amount: treasury as number, valueTimestamp: repurchaseTimestamp, settlementStatus: repurchaseCashStatus as C6CashStatus },
        ];
        if (marginLegStatus === 'complete' && marginTimestamp && marginCashStatus) legs.push({ transactionId: c6FimaPassport.transactionId, legId: 'SYN-C6-B-CASH-MARGIN-001', cashLegId: 'SYN-C6-B-CASH-MARGIN-001', sourceEventId: 'SYN-C6-B-EVENT-CASH-MARGIN-001', entity: c6FimaPassport.holder, currencyOrAsset: 'USD', direction: 'OUT', amount: marginAmount, valueTimestamp: marginTimestamp, settlementStatus: marginCashStatus });
        const invalid = validateC6TransactionPassport(passportStatus, legs); if (invalid) return invalid;
        const initialBucket = c6TimeBucket(initialTimestamp, asOfTimestamp, horizonEndTimestamp);
        const repurchaseBucket = c6TimeBucket(repurchaseTimestamp, asOfTimestamp, horizonEndTimestamp);
        const marginBucket = marginTimestamp ? c6TimeBucket(marginTimestamp, asOfTimestamp, horizonEndTimestamp) : null;
        const xH = c6AmountInBucket(receipt as number, initialBucket, 'current_horizon');
        const repurchaseInH = c6AmountInBucket(repurchase as number, repurchaseBucket, 'current_horizon');
        const marginInH = marginTimestamp ? c6AmountInBucket(marginAmount, marginBucket, 'current_horizon') : 0;
        const oH = repurchaseInH + marginInH;
        const historyOutflow = c6AmountInBucket(repurchase as number, repurchaseBucket, 'history') + (marginTimestamp ? c6AmountInBucket(marginAmount, marginBucket, 'history') : 0);
        const nextOutflow = [repurchaseBucket === 'next' ? c6ScheduleLabel(repurchase as number, repurchaseTimestamp, asOfTimestamp) : null, marginTimestamp && marginBucket === 'next' ? c6ScheduleLabel(marginAmount, marginTimestamp, asOfTimestamp) : null].filter((value): value is string => value !== null).join(' + ') || 'none';
        return { status: 'OK', note: '每条cash leg按同一UTC时间轴分类；C6只做history归因，不读取或重算C2的C0，也不产生G_post。', rows: [['Layer B fixed transaction', `${c6FimaPassport.transactionId} · ${c6FimaPassport.holder} ↔ ${c6FimaPassport.counterparty}`], ['As-of / prospective window', `${asOfTimestamp} / (${asOfTimestamp}, ${horizonEndTimestamp}]`], ['Unique Treasury passport', `${c6FimaPassport.pool} / ${c6FimaPassport.lot} / ${c6FimaPassport.allocation}`], ['Capacity upper bound', `${fmt(capacity, ' USD')} · NOT CASH`], [`${c6TimeLabel(initialTimestamp, asOfTimestamp)} initial asset leg`, `${fmt(treasury as number, ' Treasury')} OUT`], [`${c6TimeLabel(initialTimestamp, asOfTimestamp)} initial cash leg`, `${fmt(receipt as number, ' USD')} IN · ${routeStatus}`], [`${c6TimeLabel(repurchaseTimestamp, asOfTimestamp)} reverse cash leg`, `${fmt(repurchase as number, ' USD')} OUT · ${repurchaseCashStatus} · ${term}`], [`${c6TimeLabel(repurchaseTimestamp, asOfTimestamp)} reverse asset leg`, `${fmt(treasury as number, ' Treasury')} IN`], ['Historical receipt attribution', fmt(c6AmountInBucket(receipt as number, initialBucket, 'history'), ' USD · not X_H')], ['Current-H receipt X_B,H', fmt(xH, ' USD')], ['Next-bucket scheduled receipt', initialBucket === 'next' ? c6ScheduleLabel(receipt as number, initialTimestamp, asOfTimestamp) : 'none'], ['Historical outflow attribution', fmt(historyOutflow, ' USD · not O_H')], ['Current-H outflow O_B,H', fmt(oH, ' USD')], ['Next-bucket scheduled outflow', nextOutflow]], chart: [capacity, xH, -oH] };
      }

      const relation = s(input, 'localTransactionRelation'); const provenance = s(input, 'localUpstreamProvenance'); const authority = s(input, 'localProgramAuthority');
      const recipient = s(input, 'localRecipientEligibility'); const award = s(input, 'localAward'); const collateralRequired = s(input, 'localCollateralRequired'); const collateralStatus = s(input, 'localCollateralPassportStatus');
      if (!relation || !provenance || !authority || !recipient || !award || !collateralRequired || !collateralStatus) return stopC6('C6_LOCAL_INPUT_MISSING', 'Layer C独立transaction passport不完整');
      if (relation !== 'independent') return stopC6('C6_LOCAL_NOT_INDEPENDENT', 'Layer C必须使用与upstream A/B不同的transaction、leg与source-event IDs');
      if (provenance === 'unknown') return stopC6('C6_LOCAL_PROVENANCE_MISSING', '可记录upstream provenance，但不能拿它替代本地transaction');
      if (authority !== 'verified') return stopC6(authority === 'missing' ? 'C6_LOCAL_PROGRAM_MISSING' : 'C6_LOCAL_PROGRAM_CONFLICT', '本地program authority必须验证');
      if (recipient === 'unknown' || award === 'unknown') return stopC6('C6_LOCAL_ELIGIBILITY_OR_AWARD_UNKNOWN', 'recipient eligibility或独立award未知');
      if (collateralRequired === 'unknown') return stopC6('C6_LOCAL_COLLATERAL_REQUIREMENT_UNKNOWN', '必须明确本地操作是否要求recipient collateral');
      let localCapacity: number | null = null;
      if (collateralRequired === 'no' && collateralStatus !== 'not_applicable') return stopC6('C6_LOCAL_COLLATERAL_CONFLICT', '不要求collateral时passport必须明确not applicable');
      if (collateralRequired === 'yes') {
        if (collateralStatus !== 'unique') return stopC6(collateralStatus === 'reused' ? 'C6_LOCAL_COLLATERAL_REUSED' : collateralStatus === 'missing' ? 'C6_LOCAL_COLLATERAL_MISSING' : 'C6_LOCAL_COLLATERAL_CONFLICT', '本地抵押品必须属于recipient且唯一分配，不能复用FIMA holder lot');
        const value = n(input, 'localEligibleCollateralValue'); const haircut = n(input, 'localCollateralHaircutPct'); const limit = n(input, 'localLimit');
        if (value === null || haircut === null || limit === null) return stopC6('C6_LOCAL_COLLATERAL_MISSING', '本地collateral value、haircut与limit必须完整');
        localCapacity = Math.min(limit, value * (1 - haircut / 100));
      }
      if (routeStatus === 'quoted_only') return { status: 'OK', note: '只有本地指示性route；没有independent award transaction，X_H与O_H为null。', rows: [['Layer C program', `${c6LocalPassport.program} · provenance ${provenance}`], ['Recipient', `${c6LocalPassport.recipient} · quote only`], ['Capacity', localCapacity === null ? 'null · no collateral-capacity model' : fmt(localCapacity, ' USD')], ['Receipt X_H', 'null · quoted only'], ['Outflow O_H', 'null · quoted only']], chart: [localCapacity, null, null] };
      if (routeStatus === 'unavailable') return { status: 'OK', note: '本地路线已知不可用；没有transaction或cash leg。', rows: [['Layer C program', c6LocalPassport.program], ['Recipient', c6LocalPassport.recipient], ['Capacity', localCapacity === null ? 'null · not modelled' : fmt(localCapacity, ' USD')], ['Receipt X_H', '0 USD · unavailable'], ['Outflow O_H', '0 USD · no transaction']], chart: [localCapacity, 0, 0] };
      if (recipient !== 'yes' || award !== 'yes') return stopC6('C6_LOCAL_STATUS_CONFLICT', 'positive cash-eligible status要求recipient eligible且有独立award');
      const receipt = n(input, 'localUsdReceiptAmount'); const valueTimestamp = s(input, 'localValueTimestamp'); const repaymentStatus = s(input, 'localRepaymentLegStatus'); const repaymentCashStatus = s(input, 'localRepaymentCashStatus'); const repayment = n(input, 'localRepaymentAmount'); const repaymentTimestamp = s(input, 'localRepaymentValueTimestamp');
      if (receipt === null || !repaymentStatus || !repaymentCashStatus || repayment === null) return stopC6('C6_LOCAL_REPAYMENT_LEG_MISSING', '本地receipt与repayment schedule必须完整');
      if (!valueTimestamp) return stopC6('C6_LOCAL_VALUE_TIMESTAMP_MISSING', '本地receipt timestamp缺失');
      if (!repaymentTimestamp) return stopC6('C6_LOCAL_REPAYMENT_TIMESTAMP_MISSING', '本地repayment timestamp缺失');
      if (repaymentStatus !== 'complete') return stopC6(`C6_LOCAL_REPAYMENT_LEG_${repaymentStatus.toUpperCase()}`, '独立本地操作必须保留还款腿');
      const receiptTimingInvalid = c6ValidateCashTiming(routeStatus, valueTimestamp, asOfTimestamp, 'local receipt'); if (receiptTimingInvalid) return receiptTimingInvalid;
      const repaymentTimingInvalid = c6ValidateCashTiming(repaymentCashStatus, repaymentTimestamp, asOfTimestamp, 'local repayment'); if (repaymentTimingInvalid) return repaymentTimingInvalid;
      if ((c6TimestampMs(valueTimestamp) as number) > (c6TimestampMs(initialDomainEnd) as number)) return stopC6('C6_INITIAL_TIMESTAMP_DOMAIN_EXCEEDED', 'local receipt timestamp晚于as-of+30日');
      if ((c6TimestampMs(repaymentTimestamp) as number) > (c6TimestampMs(reverseDomainEnd) as number)) return stopC6('C6_LOCAL_REPAYMENT_TIMESTAMP_DOMAIN_EXCEEDED', 'local repayment timestamp晚于as-of+37日');
      if ((c6TimestampMs(repaymentTimestamp) as number) <= (c6TimestampMs(valueTimestamp) as number) || repayment < receipt || receipt <= 0) return stopC6('C6_LOCAL_REPAYMENT_DATE_CONFLICT', 'repayment必须晚于receipt，且本SYN偿还额不得小于principal');
      if (localCapacity !== null && receipt > localCapacity) return stopC6('C6_LOCAL_COLLATERAL_LIMIT_BREACH', 'receipt超过本地collateral/limit capacity');
      const localLegs: readonly C6Leg[] = [
        { transactionId: c6LocalPassport.transactionId, legId: 'SYN-C6-C-CASH-RECEIPT', cashLegId: 'SYN-C6-C-CASH-RECEIPT', sourceEventId: 'SYN-C6-C-EVENT-RECEIPT', entity: c6LocalPassport.recipient, currencyOrAsset: 'USD', direction: 'IN', amount: receipt, valueTimestamp, settlementStatus: routeStatus as C6CashStatus },
        { transactionId: c6LocalPassport.transactionId, legId: 'SYN-C6-C-CASH-REPAYMENT', cashLegId: 'SYN-C6-C-CASH-REPAYMENT', sourceEventId: 'SYN-C6-C-EVENT-REPAYMENT', entity: c6LocalPassport.recipient, currencyOrAsset: 'USD', direction: 'OUT', amount: repayment, valueTimestamp: repaymentTimestamp, settlementStatus: repaymentCashStatus as C6CashStatus },
      ];
      const invalid = validateC6TransactionPassport(passportStatus, localLegs); if (invalid) return invalid;
      const receiptBucket = c6TimeBucket(valueTimestamp, asOfTimestamp, horizonEndTimestamp); const repaymentBucket = c6TimeBucket(repaymentTimestamp, asOfTimestamp, horizonEndTimestamp);
      const xH = c6AmountInBucket(receipt, receiptBucket, 'current_horizon'); const oH = c6AmountInBucket(repayment, repaymentBucket, 'current_horizon');
      return { status: 'OK', note: 'Layer C有独立program、award与cash legs；C6只做history归因，不读取或重算C2的C0。', rows: [['Layer C fixed transaction', `${c6LocalPassport.transactionId} · ${c6LocalPassport.allocator} → ${c6LocalPassport.recipient}`], ['As-of / prospective window', `${asOfTimestamp} / (${asOfTimestamp}, ${horizonEndTimestamp}]`], ['Program / upstream provenance', `${c6LocalPassport.program} / ${provenance}`], ['Recipient collateral rule', collateralRequired === 'yes' ? `unique recipient-owned allocation · capacity ${fmt(localCapacity as number, ' USD')}` : 'explicitly not required'], [`${c6TimeLabel(valueTimestamp, asOfTimestamp)} local cash leg`, `${fmt(receipt, ' USD')} IN · ${routeStatus}`], [`${c6TimeLabel(repaymentTimestamp, asOfTimestamp)} local repayment leg`, `${fmt(repayment, ' USD')} OUT · ${repaymentCashStatus}`], ['Historical receipt attribution', fmt(c6AmountInBucket(receipt, receiptBucket, 'history'), ' USD · not X_H')], ['Current-H receipt X_C,H', fmt(xH, ' USD')], ['Next-bucket scheduled receipt', receiptBucket === 'next' ? c6ScheduleLabel(receipt, valueTimestamp, asOfTimestamp) : 'none'], ['Historical outflow attribution', fmt(c6AmountInBucket(repayment, repaymentBucket, 'history'), ' USD · not O_H')], ['Current-H outflow O_C,H', fmt(oH, ' USD')], ['Next-bucket scheduled outflow', repaymentBucket === 'next' ? c6ScheduleLabel(repayment, repaymentTimestamp, asOfTimestamp) : 'none']], chart: [localCapacity, xH, -oH] };
    },
  },
] as const;

const c6Lab = dollarFundingLabs.find(lab => lab.id === 'C6');
if (!c6Lab) throw new Error('C6 lab missing');
const c6Default = c6Lab.calculate(c6Lab.initial);
const c6Case = (overrides: DollarFundingInput) => c6Lab.calculate({ ...c6Lab.initial, ...overrides });
const c6StopIs = (result: DollarFundingResult, code: string) => result.status === 'STOP' && result.reason.startsWith(code);
const c6LocalBase: DollarFundingInput = { route: 'local', routeStatus: 'committed_executable', transactionPassportStatus: 'unique', asOfTimestamp: '2026-09-17T09:00Z', horizonDays: 7, localTransactionRelation: 'independent', localUpstreamProvenance: 'sovereign_swap', localProgramAuthority: 'verified', localRecipientEligibility: 'yes', localAward: 'yes', localUsdReceiptAmount: 15.5, localValueTimestamp: '2026-09-20T09:00Z', localCollateralRequired: 'no', localCollateralPassportStatus: 'not_applicable', localRepaymentLegStatus: 'complete', localRepaymentCashStatus: 'committed_executable', localRepaymentAmount: 15.6, localRepaymentValueTimestamp: '2026-10-17T09:00Z' };
const c6SovereignBase: DollarFundingInput = {
  route: 'sovereign', routeStatus: 'committed_executable', transactionPassportStatus: 'unique', asOfTimestamp: '2026-09-17T09:00Z', horizonDays: 7,
  sovereignCounterpartyReadiness: 'yes', sovereignFedObligor: 'foreign_central_bank', sovereignTermDays: 7, sovereignFcyPerUsdRate: 1.2, sovereignUsdInterestAmount: 0.5,
  sovereignInitialUsdLegStatus: 'complete', sovereignInitialUsdCashStatus: 'committed_executable', sovereignInitialUsdAmount: 100, sovereignInitialUsdTimestamp: '2026-09-19T09:00Z',
  sovereignInitialFcyLegStatus: 'complete', sovereignInitialFcyCashStatus: 'committed_executable', sovereignInitialFcyAmount: 120, sovereignInitialFcyTimestamp: '2026-09-19T09:00Z',
  sovereignReversalUsdLegStatus: 'complete', sovereignReversalUsdCashStatus: 'committed_executable', sovereignReversalUsdAmount: 100.5, sovereignReversalUsdTimestamp: '2026-09-26T09:00Z',
  sovereignReversalFcyLegStatus: 'complete', sovereignReversalFcyCashStatus: 'committed_executable', sovereignReversalFcyAmount: 120, sovereignReversalFcyTimestamp: '2026-09-26T09:00Z',
};
const c6LegAuditBase: readonly C6Leg[] = [
  { transactionId: 'AUDIT-TX', legId: 'AUDIT-LEG-1', cashLegId: 'AUDIT-CASH-1', sourceEventId: 'AUDIT-EVENT-1', entity: 'AUDIT-ENTITY', currencyOrAsset: 'USD', direction: 'IN', amount: 1, valueTimestamp: '2026-09-18T09:00Z', settlementStatus: 'committed_executable' },
  { transactionId: 'AUDIT-TX', legId: 'AUDIT-LEG-2', cashLegId: 'AUDIT-CASH-2', sourceEventId: 'AUDIT-EVENT-2', entity: 'AUDIT-ENTITY', currencyOrAsset: 'USD', direction: 'OUT', amount: 1.01, valueTimestamp: '2026-09-19T09:00Z', settlementStatus: 'committed_executable' },
];

export const dollarFundingLabAudit = [
  { key: 'six labs have unique IDs and fixture IDs', passed: dollarFundingLabs.length === 6 && new Set(dollarFundingLabs.map(lab => lab.id)).size === 6 && new Set(dollarFundingLabs.map(lab => lab.fixtureId)).size === 6 },
  { key: 'every lab has fields formulas sources boundaries and at least three invariants', passed: dollarFundingLabs.every(lab => lab.fields.length >= 5 && lab.formula.length > 0 && lab.sourceIds.length > 0 && lab.invariants.length >= 3) },
  { key: 'every fixed default produces an OK record', passed: dollarFundingLabs.every(lab => lab.calculate(lab.initial).status === 'OK') },
  { key: 'field keys are unique inside every lab', passed: dollarFundingLabs.every(lab => new Set(lab.fields.map(field => field.key)).size === lab.fields.length) },
  { key: 'C6 default is exact FIMA D2-D9 UTC ledger with capacity receipt and no current-H outflow', passed: c6Default.status === 'OK' && JSON.stringify(c6Default.chart) === JSON.stringify([9.5, 9.1, 0]) && c6Default.rows.some(([label, value]) => label === 'Current-H receipt X_B,H' && value === '9.10 USD') && c6Default.rows.some(([label, value]) => label === 'Next-bucket scheduled outflow' && value === '9.15 USD on D9 · 2026-09-26T09:00Z') },
  { key: 'C6 validates overnight and seven-calendar-day timestamps rather than trusting term labels', passed: c6Case({ fimaTerm: 'overnight', fimaRepurchaseValueTimestamp: '2026-09-20T09:00Z' }).status === 'OK' && c6StopIs(c6Case({ fimaTerm: 'overnight' }), 'C6_FIMA_TERM_DATE_MISMATCH') && c6StopIs(c6Case({ fimaRepurchaseValueTimestamp: '2026-09-26T09:01Z' }), 'C6_FIMA_TERM_DATE_MISMATCH') },
  { key: 'C6 rejects missing reused or conflicting FIMA collateral and capacity breaches', passed: ['reused', 'missing', 'conflict'].every(status => c6Case({ fimaTreasuryAllocationStatus: status }).status === 'STOP') && c6Case({ fimaUsdReceiptAmount: 9.6 }).status === 'STOP' && c6Case({ fimaApprovedHolder: 'unknown' }).status === 'STOP' },
  { key: 'C6 rejects incomplete initial reverse and immutable transaction passports', passed: c6Case({ fimaInitialLegStatus: 'missing' }).status === 'STOP' && c6Case({ fimaRepurchaseLegStatus: 'conflict' }).status === 'STOP' && ['missing', 'duplicate', 'conflict'].every(status => c6Case({ transactionPassportStatus: status }).status === 'STOP') },
  { key: 'C6 immutable-leg validator catches exact duplicate changed duplicate and reused source event', passed: validateC6Legs([...c6LegAuditBase, c6LegAuditBase[0]])?.status === 'STOP' && validateC6Legs([...c6LegAuditBase, { ...c6LegAuditBase[0], amount: 2 }])?.status === 'STOP' && validateC6Legs([...c6LegAuditBase, { ...c6LegAuditBase[0], legId: 'AUDIT-LEG-3', cashLegId: 'AUDIT-CASH-3' }])?.status === 'STOP' },
  { key: 'C6 quoted and unavailable FIMA do not read hidden transaction timestamps', passed: (() => { const quoted = c6Case({ routeStatus: 'quoted_only', transactionPassportStatus: 'not_applicable', fimaInitialValueTimestamp: 'malformed' }); const unavailable = c6Case({ routeStatus: 'unavailable', transactionPassportStatus: 'not_applicable', fimaRepurchaseValueTimestamp: 'malformed' }); return quoted.status === 'OK' && JSON.stringify(quoted.chart) === JSON.stringify([9.5, null, null]) && unavailable.status === 'OK' && JSON.stringify(unavailable.chart) === JSON.stringify([9.5, 0, 0]); })() },
  { key: 'C6 local onward is independent and preserves receipt plus future repayment', passed: (() => { const result = c6Case(c6LocalBase); return result.status === 'OK' && JSON.stringify(result.chart) === JSON.stringify([null, 15.5, 0]) && result.rows.some(([label, value]) => label === 'Next-bucket scheduled outflow' && value === '15.60 USD on D30 · 2026-10-17T09:00Z'); })() && c6Case({ ...c6LocalBase, localTransactionRelation: 'reuses_upstream' }).status === 'STOP' && c6Case({ ...c6LocalBase, localCollateralRequired: 'unknown' }).status === 'STOP' && c6Case({ ...c6LocalBase, localRepaymentLegStatus: 'missing' }).status === 'STOP' },
  { key: 'C6 sovereign Layer A validates FRBNY execution and four immutable two-currency legs but never creates private receipt', passed: (() => { const result = c6Case(c6SovereignBase); return result.status === 'OK' && JSON.stringify(result.chart) === JSON.stringify([100, 0, 0]) && result.rows.some(([label, value]) => label === 'Layer A fixed counterparties' && value === 'SYN-FRBNY-01 ↔ SYN-FOREIGN-CB-01') && result.rows.some(([label, value]) => label === 'Fed execution / authorization' && value === 'FRBNY execution · FOMC authorization') && result.rows.some(([label, value]) => label === 'Foreign-CB current-H legs' && value.includes('SYN-C6-A-CASH-USD-INITIAL') && value.includes('SYN-C6-A-CASH-FCY-INITIAL')) && result.rows.some(([label, value]) => label === 'Foreign-CB next legs' && value.includes('SYN-C6-A-CASH-USD-REVERSAL') && value.includes('SYN-C6-A-CASH-FCY-REVERSAL')) && result.rows.some(([label, value]) => label === 'Private recipient receipt X_H' && value.startsWith('0 USD')); })() && c6Case({ route: 'other' }).status === 'STOP' },
  { key: 'C6 route is whitelisted before any layer branch', passed: c6StopIs(c6Case({ route: 'local_typo' }), 'C6_ROUTE_INVALID') },
  { key: 'C6 rejects invalid active select enums across cash quoted and unavailable states', passed: c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialUsdCashStatus: 'settled-ish' }), 'C6_INVALID_ENUM') && c6StopIs(c6Case({ ...c6LocalBase, localTransactionRelation: 'almost_independent' }), 'C6_INVALID_ENUM') && c6StopIs(c6Case({ routeStatus: 'quoted_only', transactionPassportStatus: 'not_applicable', fimaApprovedHolder: 'maybe' }), 'C6_INVALID_ENUM') && c6StopIs(c6Case({ routeStatus: 'unavailable', transactionPassportStatus: 'not_applicable', fimaTreasuryEligibility: 'probably' }), 'C6_INVALID_ENUM') },
  { key: 'C6 enforces active number bounds and the declared as-of day', passed: c6StopIs(c6Case({ fimaTreasuryAllocated: -0.5 }), 'C6_ACTIVE_NUMBER_RANGE') && c6StopIs(c6Case({ fimaInitialMarginPct: 101 }), 'C6_ACTIVE_NUMBER_RANGE') && c6StopIs(c6Case({ ...c6LocalBase, localCollateralRequired: 'yes', localCollateralPassportStatus: 'unique', localEligibleCollateralValue: -1 }), 'C6_ACTIVE_NUMBER_RANGE') && c6StopIs(c6Case({ ...c6LocalBase, localCollateralRequired: 'yes', localCollateralPassportStatus: 'unique', localCollateralHaircutPct: 101 }), 'C6_ACTIVE_NUMBER_RANGE') && c6StopIs(c6Case({ ...c6LocalBase, localUsdReceiptAmount: 301 }), 'C6_ACTIVE_NUMBER_RANGE') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignUsdInterestAmount: 301 }), 'C6_ACTIVE_NUMBER_RANGE') && c6StopIs(c6Case({ asOfTimestamp: '2026-09-16T23:59Z' }), 'C6_AS_OF_TIMESTAMP_RANGE') && c6StopIs(c6Case({ asOfTimestamp: '2026-09-18T00:00Z' }), 'C6_AS_OF_TIMESTAMP_RANGE') },
  { key: 'C6 sovereign Layer A stops missing zero conflicting economic status and immutable-ID passports', passed: c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialFcyLegStatus: 'missing' }), 'C6_SOVEREIGN_LEG_MISSING') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialUsdAmount: 0 }), 'C6_SOVEREIGN_AMOUNT_NONPOSITIVE') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignFedObligor: 'federal_reserve' }), 'C6_SOVEREIGN_FED_OBLIGOR_CONFLICT') && c6StopIs(c6Case({ ...c6SovereignBase, routeStatus: 'realised' }), 'C6_SOVEREIGN_ROUTE_STATUS_CONFLICT') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialFcyCashStatus: 'realised' }), 'C6_SOVEREIGN_INITIAL_STATUS_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignReversalFcyCashStatus: 'realised' }), 'C6_SOVEREIGN_REVERSAL_STATUS_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialFcyAmount: 119 }), 'C6_SOVEREIGN_INITIAL_FCY_RATE_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignReversalUsdAmount: 100.4 }), 'C6_SOVEREIGN_USD_REVERSAL_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignReversalFcyAmount: 120.6 }), 'C6_SOVEREIGN_REVERSAL_FCY_QUANTITY_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignReversalFcyTimestamp: '2026-09-26T09:01Z' }), 'C6_SOVEREIGN_REVERSAL_TIMESTAMP_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, transactionPassportStatus: 'duplicate' }), 'C6_ID_DUPLICATE') },
  { key: 'C6 sovereign FCY uses declared two-decimal minor-unit rounding', passed: c6Case({ ...c6SovereignBase, sovereignInitialUsdAmount: 100.01, sovereignFcyPerUsdRate: 1.2345, sovereignInitialFcyAmount: 123.46, sovereignReversalUsdAmount: 100.51, sovereignReversalFcyAmount: 123.46 }).status === 'OK' && c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialUsdAmount: 100.01, sovereignFcyPerUsdRate: 1.2345, sovereignInitialFcyAmount: 123.45, sovereignReversalUsdAmount: 100.51, sovereignReversalFcyAmount: 123.45 }), 'C6_SOVEREIGN_INITIAL_FCY_RATE_MISMATCH') },
  { key: 'C6 sovereign SYN term domain admits D30 to D60 and rejects initial beyond D30', passed: c6Case({ ...c6SovereignBase, sovereignTermDays: 30, sovereignInitialUsdTimestamp: '2026-10-17T09:00Z', sovereignInitialFcyTimestamp: '2026-10-17T09:00Z', sovereignReversalUsdTimestamp: '2026-11-16T09:00Z', sovereignReversalFcyTimestamp: '2026-11-16T09:00Z' }).status === 'OK' && c6StopIs(c6Case({ ...c6SovereignBase, sovereignTermDays: 30, sovereignInitialUsdTimestamp: '2026-10-18T09:00Z', sovereignInitialFcyTimestamp: '2026-10-18T09:00Z', sovereignReversalUsdTimestamp: '2026-11-17T09:00Z', sovereignReversalFcyTimestamp: '2026-11-17T09:00Z' }), 'C6_ACTIVE_TIMESTAMP_RANGE') },
  { key: 'C6 sovereign supports all-history and initial-history reversal-future ledgers', passed: (() => { const allHistory = c6Case({ ...c6SovereignBase, routeStatus: 'realised', sovereignInitialUsdCashStatus: 'realised', sovereignInitialFcyCashStatus: 'realised', sovereignInitialUsdTimestamp: '2026-09-10T09:00Z', sovereignInitialFcyTimestamp: '2026-09-10T09:00Z', sovereignReversalUsdCashStatus: 'realised', sovereignReversalFcyCashStatus: 'realised', sovereignReversalUsdTimestamp: '2026-09-17T09:00Z', sovereignReversalFcyTimestamp: '2026-09-17T09:00Z' }); const split = c6Case({ ...c6SovereignBase, routeStatus: 'realised', sovereignInitialUsdCashStatus: 'realised', sovereignInitialFcyCashStatus: 'realised', sovereignInitialUsdTimestamp: '2026-09-11T09:00Z', sovereignInitialFcyTimestamp: '2026-09-11T09:00Z', sovereignReversalUsdTimestamp: '2026-09-18T09:00Z', sovereignReversalFcyTimestamp: '2026-09-18T09:00Z' }); return allHistory.status === 'OK' && allHistory.rows.some(([label, value]) => label === 'Foreign-CB history legs' && value.includes('USD-INITIAL') && value.includes('USD-REVERSAL')) && split.status === 'OK' && split.rows.some(([label, value]) => label === 'Foreign-CB history legs' && value.includes('USD-INITIAL')) && split.rows.some(([label, value]) => label === 'Foreign-CB current-H legs' && value.includes('USD-REVERSAL')); })() },
  { key: 'C6 sovereign rejects paired-initial timestamp and declared-term date mismatches', passed: c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialFcyTimestamp: '2026-09-19T09:01Z' }), 'C6_SOVEREIGN_INITIAL_TIMESTAMP_MISMATCH') && c6StopIs(c6Case({ ...c6SovereignBase, sovereignReversalUsdTimestamp: '2026-09-25T09:00Z', sovereignReversalFcyTimestamp: '2026-09-25T09:00Z' }), 'C6_SOVEREIGN_TERM_DATE_MISMATCH') },
  { key: 'C6 quoted and unavailable sovereign routes do not read hidden four-leg fields', passed: c6Case({ ...c6SovereignBase, routeStatus: 'quoted_only', transactionPassportStatus: 'not_applicable', sovereignInitialUsdTimestamp: 'malformed', sovereignInitialUsdAmount: 0 }).status === 'OK' && c6Case({ ...c6SovereignBase, routeStatus: 'unavailable', transactionPassportStatus: 'not_applicable', sovereignReversalUsdTimestamp: 'malformed', sovereignFedObligor: 'unknown' }).status === 'OK' },
  { key: 'C6 realised receipts at as-of are history only while their future outflows remain prospective', passed: (() => { const fima = c6Case({ routeStatus: 'realised', fimaInitialValueTimestamp: '2026-09-17T09:00Z', fimaRepurchaseValueTimestamp: '2026-09-24T09:00Z' }); const local = c6Case({ ...c6LocalBase, routeStatus: 'realised', localValueTimestamp: '2026-09-17T09:00Z', localRepaymentValueTimestamp: '2026-09-22T09:00Z' }); return fima.status === 'OK' && JSON.stringify(fima.chart) === JSON.stringify([9.5, 0, -9.15]) && fima.rows.some(([label, value]) => label === 'Historical receipt attribution' && value === '9.10 USD · not X_H') && local.status === 'OK' && JSON.stringify(local.chart) === JSON.stringify([null, 0, -15.6]); })() },
  { key: 'C6 rejects future realised receipts in all three layers', passed: c6StopIs(c6Case({ ...c6SovereignBase, routeStatus: 'realised', sovereignInitialUsdCashStatus: 'realised', sovereignInitialFcyCashStatus: 'realised' }), 'C6_REALISED_FUTURE_SETTLEMENT') && c6StopIs(c6Case({ routeStatus: 'realised' }), 'C6_REALISED_FUTURE_SETTLEMENT') && c6StopIs(c6Case({ ...c6LocalBase, routeStatus: 'realised' }), 'C6_REALISED_FUTURE_SETTLEMENT') },
  { key: 'C6 rejects committed receipts at or before as-of in all three layers', passed: c6StopIs(c6Case({ ...c6SovereignBase, sovereignInitialUsdTimestamp: '2026-09-17T09:00Z', sovereignInitialFcyTimestamp: '2026-09-17T09:00Z', sovereignReversalUsdTimestamp: '2026-09-24T09:00Z', sovereignReversalFcyTimestamp: '2026-09-24T09:00Z' }), 'C6_COMMITTED_NOT_FUTURE') && c6StopIs(c6Case({ fimaInitialValueTimestamp: '2026-09-17T09:00Z', fimaRepurchaseValueTimestamp: '2026-09-24T09:00Z' }), 'C6_COMMITTED_NOT_FUTURE') && c6StopIs(c6Case({ ...c6LocalBase, localValueTimestamp: '2026-09-17T09:00Z' }), 'C6_COMMITTED_NOT_FUTURE') },
  { key: 'C6 uses the open-left closed-right prospective boundary', passed: (() => { const after = c6Case({ fimaInitialValueTimestamp: '2026-09-17T09:01Z', fimaRepurchaseValueTimestamp: '2026-09-24T09:01Z' }); const end = c6Case({ fimaInitialValueTimestamp: '2026-09-24T09:00Z', fimaRepurchaseValueTimestamp: '2026-10-01T09:00Z' }); const afterEnd = c6Case({ fimaInitialValueTimestamp: '2026-09-24T09:01Z', fimaRepurchaseValueTimestamp: '2026-10-01T09:01Z' }); return after.status === 'OK' && after.chart[1] === 9.1 && end.status === 'OK' && end.chart[1] === 9.1 && afterEnd.status === 'OK' && afterEnd.chart[1] === 0; })() },
  { key: 'C6 history and current outflow boundaries do not double count', passed: (() => { const history = c6Case({ routeStatus: 'realised', fimaInitialValueTimestamp: '2026-09-10T09:00Z', fimaRepurchaseCashStatus: 'realised', fimaRepurchaseValueTimestamp: '2026-09-17T09:00Z' }); const current = c6Case({ routeStatus: 'realised', fimaInitialValueTimestamp: '2026-09-10T09:01Z', fimaRepurchaseCashStatus: 'committed_executable', fimaRepurchaseValueTimestamp: '2026-09-17T09:01Z' }); return history.status === 'OK' && JSON.stringify(history.chart) === JSON.stringify([9.5, 0, 0]) && current.status === 'OK' && JSON.stringify(current.chart) === JSON.stringify([9.5, 0, -9.15]); })() },
  { key: 'C6 additional margin cash stays inside lifecycle and obeys realised prospective buckets', passed: (() => { const history = c6Case({ routeStatus: 'realised', fimaInitialValueTimestamp: '2026-09-10T09:00Z', fimaRepurchaseCashStatus: 'realised', fimaRepurchaseValueTimestamp: '2026-09-17T09:00Z', fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'realised', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-12T09:00Z' }); const current = c6Case({ fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-21T09:00Z' }); const next = c6Case({ fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-25T09:00Z' }); return history.status === 'OK' && history.chart[2] === 0 && current.status === 'OK' && current.chart[2] === -1 && next.status === 'OK' && next.chart[2] === 0; })() },
  { key: 'C6 additional margin rejects before or equal initial and equal or after repurchase with stable codes', passed: c6StopIs(c6Case({ fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'realised', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-16T09:00Z' }), 'C6_FIMA_MARGIN_NOT_AFTER_INITIAL') && c6StopIs(c6Case({ fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-19T09:00Z' }), 'C6_FIMA_MARGIN_NOT_AFTER_INITIAL') && c6StopIs(c6Case({ fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-26T09:00Z' }), 'C6_FIMA_MARGIN_NOT_BEFORE_REPURCHASE') && c6StopIs(c6Case({ fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-27T09:00Z' }), 'C6_FIMA_MARGIN_NOT_BEFORE_REPURCHASE') },
  { key: 'C6 overnight author-SYN margin admits an interior minute but rejects both endpoints', passed: c6Case({ fimaTerm: 'overnight', fimaRepurchaseValueTimestamp: '2026-09-20T09:00Z', fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-19T09:01Z' }).status === 'OK' && c6StopIs(c6Case({ fimaTerm: 'overnight', fimaRepurchaseValueTimestamp: '2026-09-20T09:00Z', fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-19T09:00Z' }), 'C6_FIMA_MARGIN_NOT_AFTER_INITIAL') && c6StopIs(c6Case({ fimaTerm: 'overnight', fimaRepurchaseValueTimestamp: '2026-09-20T09:00Z', fimaMarginCashLegStatus: 'complete', fimaMarginCashStatus: 'committed_executable', fimaMarginCashOutflowAmount: 1, fimaMarginCashValueTimestamp: '2026-09-20T09:00Z' }), 'C6_FIMA_MARGIN_NOT_BEFORE_REPURCHASE') },
  { key: 'C6 additional margin structure status has an explicit whitelist', passed: c6StopIs(c6Case({ fimaMarginCashLegStatus: 'unexpected_status' }), 'C6_FIMA_MARGIN_LEG_INVALID') },
  { key: 'C6 FIMA supports D30 overnight and D30-D37 seven-day terms but rejects D38 at the active timestamp max', passed: c6Case({ fimaInitialValueTimestamp: '2026-10-17T09:00Z', fimaTerm: 'overnight', fimaRepurchaseValueTimestamp: '2026-10-18T09:00Z' }).status === 'OK' && c6Case({ fimaInitialValueTimestamp: '2026-10-17T09:00Z', fimaRepurchaseValueTimestamp: '2026-10-24T09:00Z' }).status === 'OK' && c6StopIs(c6Case({ fimaInitialValueTimestamp: '2026-10-17T09:00Z', fimaRepurchaseValueTimestamp: '2026-10-25T09:00Z' }), 'C6_ACTIVE_TIMESTAMP_RANGE') },
  { key: 'C6 local supports D30-D37 and rejects same-time exact-domain overflow or D38', passed: c6Case({ ...c6LocalBase, localValueTimestamp: '2026-10-17T09:00Z', localRepaymentValueTimestamp: '2026-10-24T09:00Z' }).status === 'OK' && c6StopIs(c6Case({ ...c6LocalBase, localValueTimestamp: '2026-10-17T09:00Z', localRepaymentValueTimestamp: '2026-10-17T09:00Z' }), 'C6_LOCAL_REPAYMENT_DATE_CONFLICT') && c6StopIs(c6Case({ ...c6LocalBase, localValueTimestamp: '2026-10-17T09:00Z', localRepaymentValueTimestamp: '2026-10-24T09:01Z' }), 'C6_LOCAL_REPAYMENT_TIMESTAMP_DOMAIN_EXCEEDED') && c6StopIs(c6Case({ ...c6LocalBase, localValueTimestamp: '2026-10-17T09:00Z', localRepaymentValueTimestamp: '2026-10-25T09:00Z' }), 'C6_ACTIVE_TIMESTAMP_RANGE') },
  { key: 'C6 immutable-leg validator rejects cashLegId reuse across distinct legs', passed: c6StopIs(validateC6Legs([{ transactionId: 'AUDIT-CASH-TX', legId: 'AUDIT-CASH-LEG-1', cashLegId: 'AUDIT-CASH-SHARED', sourceEventId: 'AUDIT-CASH-EVENT-1', entity: 'AUDIT-ENTITY', currencyOrAsset: 'USD', direction: 'IN', amount: 1, valueTimestamp: '2026-09-18T09:00Z', settlementStatus: 'committed_executable' }, { transactionId: 'AUDIT-CASH-TX', legId: 'AUDIT-CASH-LEG-2', cashLegId: 'AUDIT-CASH-SHARED', sourceEventId: 'AUDIT-CASH-EVENT-2', entity: 'AUDIT-ENTITY', currencyOrAsset: 'USD', direction: 'OUT', amount: 1.01, valueTimestamp: '2026-09-19T09:00Z', settlementStatus: 'committed_executable' }]) as DollarFundingResult, 'C6_ID_CONFLICT') },
  { key: 'C6 ignores poisoned inactive transaction fields on sovereign FIMA and local non-cash routes', passed: c6Case({ ...c6SovereignBase, routeStatus: 'quoted_only', transactionPassportStatus: 'not_applicable', sovereignCounterpartyReadiness: 'poison', sovereignInitialUsdCashStatus: 'poison', sovereignInitialUsdAmount: -999, sovereignInitialUsdTimestamp: 'poison', fimaApprovedHolder: 'poison', localTransactionRelation: 'poison' }).status === 'OK' && c6Case({ routeStatus: 'quoted_only', transactionPassportStatus: 'not_applicable', fimaInitialLegStatus: 'poison', fimaUsdReceiptAmount: -999, fimaInitialValueTimestamp: 'poison', fimaMarginCashLegStatus: 'poison', sovereignInitialUsdCashStatus: 'poison', localTransactionRelation: 'poison' }).status === 'OK' && c6Case({ ...c6LocalBase, routeStatus: 'unavailable', transactionPassportStatus: 'not_applicable', localUsdReceiptAmount: -999, localValueTimestamp: 'poison', localRepaymentLegStatus: 'poison', localRepaymentCashStatus: 'poison', localRepaymentAmount: -999, localRepaymentValueTimestamp: 'poison', localEligibleCollateralValue: -999, localCollateralHaircutPct: 999, localLimit: -999, sovereignInitialUsdCashStatus: 'poison', fimaInitialLegStatus: 'poison' }).status === 'OK' },
  { key: 'C6 malformed UTC timestamps stop and clear numerical outputs', passed: c6StopIs(c6Case({ fimaInitialValueTimestamp: '2026-09-19 09:00Z' }), 'C6_TIMESTAMP_FORMAT_INVALID') && c6StopIs(c6Case({ asOfTimestamp: '2026-09-17T09:00+00:00' }), 'C6_AS_OF_TIMESTAMP_INVALID') },
  { key: 'C6 contract contains no G_post output and remains independent of other lab state', passed: c6Default.status === 'OK' && !c6Default.rows.some(([label]) => label.includes('G_post')) && c6Lab.passport.includes('不读取C1–C5') && c6Lab.passport.includes('不产生G_post') },
] as const;

if (!dollarFundingLabAudit.every(item => item.passed)) {
  throw new Error(`4.05 lab contract failed: ${dollarFundingLabAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
