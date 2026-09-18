export type TreasuryCurveLabId = 'C1' | 'C2' | 'C3' | 'C4' | 'C5' | 'C6';

export type TreasuryCurveChartValue = number | null;

export type TreasuryCurveResult =
  | {
      status: 'OK';
      rows: readonly (readonly [string, string])[];
      chart: readonly number[];
      chartValues?: readonly TreasuryCurveChartValue[];
      note: string;
    }
  | { status: 'STOP'; reason: string };

export function parseTreasuryCurveDecimal(raw: string, decimals: number): number | null {
  if (raw === '' || raw.trim() !== raw || /[eE+]/.test(raw) || Object.is(Number(raw), -0)) return null;
  const expression = decimals === 0 ? /^-?(?:0|[1-9]\d*)$/ : new RegExp(`^-?(?:0|[1-9]\\d*)(?:\\.\\d{1,${decimals}})?$`);
  if (!expression.test(raw)) return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
}

export function finite(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value)) throw Error('4.04 display accepts finite numbers only.');
  const normalized = Object.is(value, -0) || Math.abs(value) < 0.5 * 10 ** -decimals ? 0 : value;
  return normalized.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).replace('-', '−');
}

export function formatSigned(value: number, suffix = '', decimals = 2): string {
  const normalized = Object.is(value, -0) || Math.abs(value) < 0.5 * 10 ** -decimals ? 0 : value;
  return `${normalized > 0 ? '+' : ''}${formatNumber(normalized, decimals)}${suffix}`;
}

export function c1RoleClassifier(input: Readonly<Record<string, unknown>>): TreasuryCurveResult {
  const object = input.object;
  const claimedRole = input.claimedRole;
  const map: Record<string, { roles: string[]; not: string; label: string }> = {
    cmt: { label: 'Treasury CMT par quote', roles: ['reference', 'information'], not: '不是SOFR/OIS discount curve，也不是实际可成交10Y券。' },
    sofrOis: { label: 'Governing SOFR/OIS discount curve under stated collateral rules', roles: ['discount', 'reference'], not: '不是Treasury CMT，也不是所有未担保合约的自动折现曲线。' },
    onRun: { label: 'On-the-run Treasury note', roles: ['reference', 'hedge', 'collateral', 'information'], not: '不是纯粹宏观zero node；可含liquidity与repo specialness。' },
    treasuryCollateral: { label: 'Specific Treasury issue used as repo collateral', roles: ['collateral'], not: '抵押品是特定Treasury券；repo交易本身承担funding，不是collateral instrument。' },
    repoSpecial: { label: 'Specific-issue special repo funding trade', roles: ['funding'], not: '这笔repo交易是funding对象，其特定Treasury券才是collateral；较低repo rate也不等于长期Treasury yield下降。' },
    corporateSpread: { label: 'Matched corporate spread quote', roles: ['relative-value'], not: '不是纯信用补偿，除非其他楔子已匹配或识别。' },
    clearedSwap: { label: 'CCP-cleared USD swap contract', roles: ['hedge', 'relative-value'], not: '掌管折现的是相应SOFR/OIS曲线与清算/抵押制度，不是swap合约本身；Treasury仍可作hedge/reference。' },
  };
  if (typeof object !== 'string' || typeof claimedRole !== 'string' || !map[object]) return { status: 'STOP', reason: '对象或声明角色不在C1固定枚举中。' };
  const record = map[object];
  const accepted = record.roles.includes(claimedRole);
  return {
    status: 'OK',
    rows: [
      ['对象', record.label],
      ['声明角色', claimedRole],
      ['角色判定', accepted ? '可成立，但必须保留用途和制度限定' : '不成立；该对象在本情景不承担此角色'],
      ['允许角色集合', record.roles.join(' / ')],
      ['强制反例', record.not],
    ],
    chart: record.roles.map((_, index) => index + 1),
    note: 'C1只训练对象—角色匹配，不输出价格方向、回报或交易结论。',
  };
}

export function c2MatchedCashFlows(input: Readonly<Record<string, unknown>>): TreasuryCurveResult {
  const keys = ['cf1', 'cf3', 'cf5', 'z1', 'z3', 'z5', 'spreadBp'] as const;
  if (!keys.every(key => finite(input[key]))) return { status: 'STOP', reason: 'C2现金流、zero nodes或asset spread存在unknown/非法值。' };
  const [cf1, cf3, cf5, z1, z3, z5, spreadBp] = keys.map(key => input[key] as number);
  const rates = [z1, z3, z5].map(value => (value + spreadBp / 100) / 100);
  const terms = [1, 3, 5];
  const cashFlows = [cf1, cf3, cf5];
  const pvs = cashFlows.map((cashFlow, index) => cashFlow * Math.exp(-rates[index] * terms[index]));
  if (![...rates, ...pvs].every(Number.isFinite)) return { status: 'STOP', reason: 'C2指数贴现未得到有限结果。' };
  const total = pvs.reduce((sum, value) => sum + value, 0);
  return {
    status: 'OK',
    rows: [
      ['1Y现金流现值', formatNumber(pvs[0], 3)],
      ['3Y现金流现值', formatNumber(pvs[1], 3)],
      ['5Y现金流现值', formatNumber(pvs[2], 3)],
      ['总现值', formatNumber(total, 3)],
      ['曲线身份', '作者SYN continuous-zero nodes + 同一SYN asset spread'],
    ],
    chart: pvs,
    note: '三个节点分别贴现三笔现金流；这不是用某个CMT par point统一贴现。',
  };
}

const c3ShockMap: Record<string, readonly number[]> = {
  parallel: [10, 10, 10, 10],
  steepener: [-5, 0, 8, 18],
  butterfly: [6, -8, -8, 6],
};

export function c3KeyRateResidual(input: Readonly<Record<string, unknown>>): TreasuryCurveResult {
  const numeric = ['p2', 'p5', 'p10', 'p30', 'h2', 'h5', 'h10', 'h30'] as const;
  if (!numeric.every(key => finite(input[key])) || typeof input.shock !== 'string' || !c3ShockMap[input.shock]) return { status: 'STOP', reason: 'C3节点暴露或shock枚举不完整。' };
  const portfolio = numeric.slice(0, 4).map(key => input[key] as number);
  const hedge = numeric.slice(4).map(key => input[key] as number);
  const residual = portfolio.map((value, index) => value + hedge[index]);
  const shock = c3ShockMap[input.shock];
  const contribution = residual.map((value, index) => -value * shock[index] / 10_000);
  const total = contribution.reduce((sum, value) => sum + value, 0);
  return {
    status: 'OK',
    rows: [
      ['Residual KRD [2Y,5Y,10Y,30Y]', residual.map(value => formatNumber(value, 2)).join(' / ')],
      ['SYN shock bp', shock.map(value => formatSigned(value, 'bp', 0)).join(' / ')],
      ['节点价格贡献', contribution.map(value => formatSigned(value * 100, '%', 3)).join(' / ')],
      ['合计一阶价格变化', formatSigned(total * 100, '%', 3)],
      ['仍未覆盖', 'convexity / basis / liquidity / funding / jump risk'],
    ],
    chart: residual,
    note: '即使residual之和为0，非平行shock下加权P&L仍可非0。',
  };
}

const c4DriverMap: Record<string, { label: string; cf: number; erpBp: number; basisPct: number }> = {
  growth: { label: 'growth-information', cf: 3.0, erpBp: -20, basisPct: 0 },
  policy: { label: 'policy-tightening', cf: 0, erpBp: 30, basisPct: 0 },
  funding: { label: 'liquidity-funding stress', cf: -1.0, erpBp: 60, basisPct: 0.8 },
};

export function c4DriverContest(input: Readonly<Record<string, unknown>>): TreasuryCurveResult {
  if (typeof input.driver !== 'string' || !c4DriverMap[input.driver] || !finite(input.treasuryBp) || !finite(input.assetDuration)) return { status: 'STOP', reason: 'C4 driver、Treasury shock或总贴现率SYN局部敏感度不完整。' };
  const driver = c4DriverMap[input.driver];
  const treasury = input.treasuryBp as number;
  const sharedSynSensitivity = input.assetDuration as number;
  const rfContribution = -sharedSynSensitivity * treasury / 100;
  const erpContribution = -sharedSynSensitivity * driver.erpBp / 100;
  const net = driver.cf + rfContribution + erpContribution - driver.basisPct;
  return {
    status: 'OK',
    rows: [
      ['Driver class', driver.label],
      ['共享SYN局部敏感度', `${formatNumber(sharedSynSensitivity, 1)} years-like`],
      ['暴露限制', 'κRf = κERP仅在本作者SYN内用于隔离driver；现实中两类暴露不自动相等'],
      ['现金流贡献', formatSigned(driver.cf, '%')],
      ['Treasury期限价格贡献', formatSigned(rfContribution, '%')],
      ['ERP贡献', formatSigned(erpContribution, '%')],
      ['Basis/funding拖累', formatSigned(-driver.basisPct, '%')],
      ['SYN净价格变化', formatSigned(net, '%')],
    ],
    chart: [driver.cf, rfContribution, erpContribution, -driver.basisPct, net],
    note: '相同Treasury yield方向在不同driver下可以得到相反或抵消的asset outcome。为隔离driver，本作者SYN故意用同一κ乘Treasury与ERP shock；现实risk-free与risk-premium暴露不自动相等。',
  };
}

export function c5FxHedge(input: Readonly<Record<string, unknown>>): TreasuryCurveResult {
  const keys = ['usdReturn', 'spotContribution', 'hedgeRatio', 'forwardCost', 'basisCost'] as const;
  if (!keys.every(key => finite(input[key]))) return { status: 'STOP', reason: 'C5本币回报所需字段存在unknown；不得补0。' };
  const [usdReturn, spotContribution, hedgeRatio, forwardCost, basisCost] = keys.map(key => input[key] as number);
  if (hedgeRatio < 0 || hedgeRatio > 100) return { status: 'STOP', reason: 'C5 hedge ratio必须在0%至100%。' };
  const h = hedgeRatio / 100;
  const unhedged = usdReturn + spotContribution;
  const hedged = usdReturn + (1 - h) * spotContribution - h * (forwardCost + basisCost);
  return {
    status: 'OK',
    rows: [
      ['USD资产回报', formatSigned(usdReturn, '%')],
      ['未套保本币回报', formatSigned(unhedged, '%')],
      ['套保比例', `${formatNumber(hedgeRatio, 0)}%`],
      ['Forward + basis成本', formatSigned(forwardCost + basisCost, '%')],
      ['套保后本币回报', formatSigned(hedged, '%')],
      ['仍未覆盖', 'tenor mismatch / roll / collateral / tax / transaction cost'],
    ],
    chart: [usdReturn, unhedged, hedged],
    note: '公式采用明确的SYN贡献符号；现实应用必须再声明FX报价方向与套保期限。',
  };
}

const c6DriverMultipliers: Record<string, { short: number | null; term: number | null; fx: number | null; label: string }> = {
  policy: { label: 'identified-policy candidate', short: 0.55, term: 0.25, fx: 0.20 },
  growth: { label: 'growth-information candidate', short: 0.20, term: 0.10, fx: -0.05 },
  funding: { label: 'funding-stress candidate', short: 0.05, term: 0.65, fx: 0.45 },
  unknown: { label: 'unknown — no forced classification', short: null, term: null, fx: null },
};

export function c6GlobalPassThrough(input: Readonly<Record<string, unknown>>): TreasuryCurveResult {
  if (typeof input.driver !== 'string' || !c6DriverMultipliers[input.driver] || !finite(input.usShockBp) || !finite(input.localGate) || !finite(input.policyOffsetBp) || !finite(input.reverseBp)) return { status: 'STOP', reason: 'C6 driver或本地gate输入不完整。' };
  const map = c6DriverMultipliers[input.driver];
  if (map.short === null || map.term === null || map.fx === null) {
    const reverse = input.reverseBp as number;
    return {
      status: 'OK',
      rows: [
        ['Driver class', map.label],
        ['Local expected-short-rate', 'null — driver未识别'],
        ['Local term premium', 'null — driver未识别'],
        ['FX/funding pressure', 'null — driver未识别'],
        ['Reverse spillover', formatSigned(reverse, 'bp', 1)],
        ['Reverse spillover flag', reverse === 0 ? 'false in this SYN record' : 'true in this SYN record'],
      ],
      chart: [],
      chartValues: [null, null, null, reverse],
      note: 'Unknown是合法输出，三个未识别的本地分支保持null，不得由相同yield sign强制分类；独立输入的reverse spillover仍照实显示。',
    };
  }
  const shock = input.usShockBp as number;
  const gate = (input.localGate as number) / 100;
  const short = shock * map.short * gate + (input.policyOffsetBp as number);
  const term = shock * map.term * gate;
  const fx = shock * map.fx * gate;
  const total = short + term;
  return {
    status: 'OK',
    rows: [
      ['Driver class', map.label],
      ['Local expected-short-rate contribution', formatSigned(short, 'bp', 1)],
      ['Local term-premium contribution', formatSigned(term, 'bp', 1)],
      ['SYN local long-yield response', formatSigned(total, 'bp', 1)],
      ['FX/funding pressure index', formatSigned(fx, ' SYN', 1)],
      ['Reverse spillover', formatSigned(input.reverseBp as number, 'bp', 1)],
    ],
    chart: [short, term, fx, input.reverseBp as number],
    note: '系数仅用于条件逻辑，不来自BIS/Fed样本，也不是国家预测。',
  };
}

export const treasuryCurveCalculators = {
  C1: c1RoleClassifier,
  C2: c2MatchedCashFlows,
  C3: c3KeyRateResidual,
  C4: c4DriverContest,
  C5: c5FxHedge,
  C6: c6GlobalPassThrough,
} as const;

export const treasuryCurveFixtureAudit = [
  { key: 'strict parser rejects blanks whitespace exponent plus sign and negative zero', passed: ['', ' 1', '1 ', '1e2', '+1', '-0'].every(value => parseTreasuryCurveDecimal(value, 2) === null) },
  { key: 'C1 assigns collateral discount funding and swap roles to the actual objects', passed: [
    ['treasuryCollateral', 'collateral', '可成立'],
    ['repoSpecial', 'funding', '可成立'],
    ['repoSpecial', 'collateral', '不成立'],
    ['sofrOis', 'discount', '可成立'],
    ['clearedSwap', 'discount', '不成立'],
    ['clearedSwap', 'hedge', '可成立'],
    ['clearedSwap', 'relative-value', '可成立'],
  ].every(([object, claimedRole, expected]) => {
    const result = c1RoleClassifier({ object, claimedRole });
    return result.status === 'OK' && result.rows.some(([label, value]) => label === '角色判定' && value.startsWith(expected));
  }) },
  { key: 'C2 default cash-flow present value is finite', passed: c2MatchedCashFlows({ cf1: 4, cf3: 4, cf5: 104, z1: 3, z3: 3.5, z5: 4, spreadBp: 80 }).status === 'OK' },
  { key: 'C3 preserves signed residuals under a nonparallel shock', passed: c3KeyRateResidual({ p2: 4, p5: 2, p10: 6, p30: 1, h2: 0, h5: 0, h10: -13, h30: 0, shock: 'steepener' }).status === 'OK' },
  { key: 'C4 same positive Treasury shock permits opposite outcomes under an explicitly shared SYN sensitivity', passed: ['growth', 'policy'].every(driver => {
    const result = c4DriverContest({ driver, treasuryBp: 20, assetDuration: 4 });
    return result.status === 'OK' && result.rows.some(([label, value]) => label === '暴露限制' && value.includes('现实中两类暴露不自动相等'));
  }) },
  { key: 'C5 rejects invalid hedge ratios and preserves negative outcomes', passed: c5FxHedge({ usdReturn: 2, spotContribution: -3, hedgeRatio: 120, forwardCost: 2, basisCost: 0.4 }).status === 'STOP' && c5FxHedge({ usdReturn: 2, spotContribution: -3, hedgeRatio: 100, forwardCost: 2, basisCost: 0.4 }).status === 'OK' },
  { key: 'C6 unknown driver preserves three null chart branches and the independent reverse input', passed: (() => {
    const result = c6GlobalPassThrough({ driver: 'unknown', usShockBp: 25, localGate: 80, policyOffsetBp: 0, reverseBp: 3 });
    return result.status === 'OK'
      && result.chart.length === 0
      && result.chartValues?.length === 4
      && result.chartValues.slice(0, 3).every(value => value === null)
      && result.chartValues[3] === 3;
  })() },
] as const;
