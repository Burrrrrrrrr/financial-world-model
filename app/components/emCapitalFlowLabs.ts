import type { EmCapitalFlowSourceId } from '../lessons/emCapitalFlowReferences';

export type EmCapitalFlowLabId = 'C1' | 'C2';

export type C1Input = {
  inwardPortfolioDebt: number;
  inwardPortfolioEquity: number;
  inwardOtherInvestment: number;
  outwardPortfolioDebt: number;
  outwardPortfolioEquity: number;
  outwardOtherInvestment: number;
  inwardThreshold: number;
  outwardThreshold: number;
};

export type FlowEvent = 'surge' | 'stop' | 'none';
export type ResidentEvent = 'flight' | 'retrenchment' | 'none';

export type C1Result = {
  status: 'OK';
  grossInflowChange: number;
  grossOutflowChange: number;
  netInflowChange: number;
  inwardEvent: FlowEvent;
  outwardEvent: ResidentEvent;
  offsettingGrossLegChanges: boolean;
  causalDriver: null;
  crisis: null;
  welfare: null;
};

export const c1Default: C1Input = {
  inwardPortfolioDebt: -6,
  inwardPortfolioEquity: 0,
  inwardOtherInvestment: 0,
  outwardPortfolioDebt: -6,
  outwardPortfolioEquity: 0,
  outwardOtherInvestment: 0,
  inwardThreshold: 4,
  outwardThreshold: 4,
};

export const c1ReportingCells = [
  { key: 'portfolio-debt', label: '证券投资·债务证券', rule: '非直接投资关系下的可交易债务证券；不含贷款、存款或关联企业债。' },
  { key: 'portfolio-equity', label: '证券投资·股权与基金份额', rule: '非直接投资关系下的股权与基金份额；不含直接投资股权。' },
  { key: 'other-investment', label: '其他投资', rule: '贷款、存款、贸易信贷等；不含证券债务与直接投资关联债。' },
] as const;

export function calculateC1(input: C1Input): C1Result {
  const grossInflowChange = input.inwardPortfolioDebt + input.inwardPortfolioEquity + input.inwardOtherInvestment;
  const grossOutflowChange = input.outwardPortfolioDebt + input.outwardPortfolioEquity + input.outwardOtherInvestment;
  const netInflowChange = grossInflowChange - grossOutflowChange;
  const inwardEvent: FlowEvent = grossInflowChange >= input.inwardThreshold
    ? 'surge'
    : grossInflowChange <= -input.inwardThreshold
      ? 'stop'
      : 'none';
  const outwardEvent: ResidentEvent = grossOutflowChange >= input.outwardThreshold
    ? 'flight'
    : grossOutflowChange <= -input.outwardThreshold
      ? 'retrenchment'
      : 'none';
  return {
    status: 'OK',
    grossInflowChange,
    grossOutflowChange,
    netInflowChange,
    inwardEvent,
    outwardEvent,
    offsettingGrossLegChanges: netInflowChange === 0 && (grossInflowChange !== 0 || grossOutflowChange !== 0),
    causalDriver: null,
    crisis: null,
    welfare: null,
  };
}

export type C2Input = {
  nonresidentBankBefore: number;
  nonresidentBondBefore: number;
  nonresidentEquityBefore: number;
  residentBankBefore: number;
  nonresidentBankAfter: number;
  nonresidentBondAfter: number;
  nonresidentEquityAfter: number;
  residentBankAfter: number;
  maturingFxDebt: number;
  committedRefinancingCash: number;
  executableHedgeReceipts: number;
  additionalAttributesMatch: 'yes' | 'no' | 'unknown';
};

export type C2Route = {
  key: 'nonresident-bank' | 'nonresident-bond' | 'nonresident-equity' | 'resident-bank';
  label: string;
  before: number;
  after: number;
  change: number;
  beforeShare: number | null;
  afterShare: number | null;
};

export type C2Result = {
  status: 'OK';
  totalBefore: number;
  totalAfter: number;
  totalChange: number;
  routes: readonly C2Route[];
  routeVectorChanged: boolean;
  rolloverGap: number;
  coverageSurplus: number;
  compositionComparable: boolean;
  additionalAttributeConclusion: 'declared-additional-fields-match' | 'declared-additional-fields-mismatch' | 'undetermined-insufficient-fields' | 'no-migration-to-compare';
  identifiedSupplyShock: null;
  realWorldRiskEstimate: null;
};

export const c2Default: C2Input = {
  nonresidentBankBefore: 8,
  nonresidentBondBefore: 2,
  nonresidentEquityBefore: 1,
  residentBankBefore: 1,
  nonresidentBankAfter: 2,
  nonresidentBondAfter: 8,
  nonresidentEquityAfter: 1,
  residentBankAfter: 1,
  maturingFxDebt: 6,
  committedRefinancingCash: 4,
  executableHedgeReceipts: 1,
  additionalAttributesMatch: 'unknown',
};

export const c2RouteDefinitions = [
  { key: 'nonresident-bank', label: '非居民银行·短期外币贷款', rule: '同一合成企业借款人从非居民银行获得、原始期限不超过一年的外币贷款新提款。' },
  { key: 'nonresident-bond', label: '非居民·长期本币债券一级认购', rule: '同一借款人新发行、由非居民在一级市场认购的长期本币证券债务。' },
  { key: 'nonresident-equity', label: '非居民·证券股权一级认购', rule: '同一企业新发行、由非居民认购且未形成直接投资关系的证券股权。' },
  { key: 'resident-bank', label: '居民银行·本币贷款', rule: '同一企业从居民银行获得的本币贷款新提款；不含本地债券或股权。' },
] as const;

export function calculateC2(input: C2Input): C2Result {
  const totalBefore = input.nonresidentBankBefore + input.nonresidentBondBefore + input.nonresidentEquityBefore + input.residentBankBefore;
  const totalAfter = input.nonresidentBankAfter + input.nonresidentBondAfter + input.nonresidentEquityAfter + input.residentBankAfter;
  const specs = [
    ['nonresident-bank', c2RouteDefinitions[0].label, input.nonresidentBankBefore, input.nonresidentBankAfter],
    ['nonresident-bond', c2RouteDefinitions[1].label, input.nonresidentBondBefore, input.nonresidentBondAfter],
    ['nonresident-equity', c2RouteDefinitions[2].label, input.nonresidentEquityBefore, input.nonresidentEquityAfter],
    ['resident-bank', c2RouteDefinitions[3].label, input.residentBankBefore, input.residentBankAfter],
  ] as const;
  const routes = specs.map(([key, label, before, after]) => ({
    key,
    label,
    before,
    after,
    change: after - before,
    beforeShare: totalBefore === 0 ? null : before / totalBefore,
    afterShare: totalAfter === 0 ? null : after / totalAfter,
  }));
  const routeVectorChanged = routes.some(route => route.change !== 0);
  return {
    status: 'OK',
    totalBefore,
    totalAfter,
    totalChange: totalAfter - totalBefore,
    routes,
    routeVectorChanged,
    rolloverGap: Math.max(0, input.maturingFxDebt - input.committedRefinancingCash - input.executableHedgeReceipts),
    coverageSurplus: Math.max(0, input.committedRefinancingCash + input.executableHedgeReceipts - input.maturingFxDebt),
    compositionComparable: totalBefore > 0 && totalAfter > 0,
    additionalAttributeConclusion: !routeVectorChanged
      ? 'no-migration-to-compare'
      : input.additionalAttributesMatch === 'yes'
        ? 'declared-additional-fields-match'
        : input.additionalAttributesMatch === 'no'
          ? 'declared-additional-fields-mismatch'
          : 'undetermined-insufficient-fields',
    identifiedSupplyShock: null,
    realWorldRiskEstimate: null,
  };
}

export const emCapitalFlowLabs = [
  {
    id: 'C1' as const,
    title: '净流入变化为零，为什么两条gross leg仍可能同时剧烈收缩？',
    question: '分别改变非居民取得本国资产与居民取得外国资产的三个互斥功能分类单元，观察net如何遮蔽stop与retrenchment。',
    passport: 'AUTHOR-SYN · 同期、同单位、交易口径 · 实验宇宙只含证券债务、证券股权、其他投资三个互斥且在本SYN内穷尽的报告单元；直接投资、衍生品与储备在范围外而非填0 · 正号表示该gross leg增加 · 阈值为事前冻结的合成阈值 · 非现实国家事件识别器。',
    sourceIds: [1, 3, 4] as readonly EmCapitalFlowSourceId[],
  },
  {
    id: 'C2' as const,
    title: '总融资不变，融资路线和到期现金缺口为什么仍可能改变？',
    question: '在同一合成企业与期间内，把非居民短期外币银行贷款替换为非居民一级认购本币债、非居民证券股权或居民银行本币贷款，并把新融资总量与旧债时点rollover gap分栏。',
    passport: 'AUTHOR-SYN · 四条按债权人居民身份×工具×一级融资定义的互斥路线 · 每单位新融资只进一个桶 · 合成数量0–12 · 旧债到期、确定再融资现金与可执行套保收款共享同一未来窗口且彼此不重复 · 非真实融资或风险估计。',
    sourceIds: [2, 9, 15, 16, 17] as readonly EmCapitalFlowSourceId[],
  },
] as const;

function near(left: number, right: number, tolerance = 1e-10) {
  return Math.abs(left - right) <= tolerance;
}

const c1 = calculateC1(c1Default);
const c1Masked = calculateC1({ ...c1Default, inwardPortfolioEquity: 6 });
const c2 = calculateC2(c2Default);
const c2Zero = calculateC2({ ...c2Default, nonresidentBankBefore: 0, nonresidentBondBefore: 0, nonresidentEquityBefore: 0, residentBankBefore: 0 });
const c2Equivalent = calculateC2({ ...c2Default, additionalAttributesMatch: 'yes' });
const c2NotEquivalent = calculateC2({ ...c2Default, additionalAttributesMatch: 'no' });
const c2Unknown = calculateC2({ ...c2Default, additionalAttributesMatch: 'unknown' });
const c2NoMigration = calculateC2({ ...c2Default, nonresidentBankAfter: 8, nonresidentBondAfter: 2 });
const c2Overcovered = calculateC2({ ...c2Default, committedRefinancingCash: 8, executableHedgeReceipts: 2 });

export const emCapitalFlowLabAudit = [
  { key: 'C1 default gross legs are both minus six and net change is zero', passed: c1.grossInflowChange === -6 && c1.grossOutflowChange === -6 && c1.netInflowChange === 0 },
  { key: 'C1 reporting cells are unique mutually exclusive functional-category cells within the declared synthetic universe', passed: c1ReportingCells.length === 3 && new Set(c1ReportingCells.map(cell => cell.key)).size === 3 && c1ReportingCells.every(cell => cell.rule.length >= 20) },
  { key: 'C1 default labels stop and retrenchment without inventing a crisis', passed: c1.inwardEvent === 'stop' && c1.outwardEvent === 'retrenchment' && c1.offsettingGrossLegChanges && c1.crisis === null },
  { key: 'C1 tool composition can mask debt stop at the aggregate inward leg', passed: c1Masked.grossInflowChange === 0 && c1Masked.inwardEvent === 'none' && c1Masked.netInflowChange === 6 },
  { key: 'C1 causal welfare and crisis fields remain null', passed: c1.causalDriver === null && c1.crisis === null && c1.welfare === null },
  { key: 'C2 default keeps total funding at twelve while route vector changes', passed: c2.totalBefore === 12 && c2.totalAfter === 12 && c2.totalChange === 0 && c2.routeVectorChanged },
  { key: 'C2 routes are unique mutually exclusive residence instrument and primary-financing cells', passed: c2RouteDefinitions.length === 4 && new Set(c2RouteDefinitions.map(route => route.key)).size === 4 && c2RouteDefinitions.every(route => route.rule.length >= 20) },
  { key: 'C2 default rollover gap is exactly one', passed: c2.rolloverGap === 1 },
  { key: 'C2 overcoverage is valid and reports zero gap plus positive surplus', passed: c2Overcovered.rolloverGap === 0 && c2Overcovered.coverageSurplus === 4 },
  { key: 'C2 zero denominator returns null share rather than zero percent', passed: !c2Zero.compositionComparable && c2Zero.routes.every(route => route.beforeShare === null) },
  { key: 'C2 yes no unknown and no-migration states remain distinct', passed: c2Equivalent.additionalAttributeConclusion === 'declared-additional-fields-match' && c2NotEquivalent.additionalAttributeConclusion === 'declared-additional-fields-mismatch' && c2Unknown.additionalAttributeConclusion === 'undetermined-insufficient-fields' && c2NoMigration.additionalAttributeConclusion === 'no-migration-to-compare' },
  { key: 'C2 additional-attribute state changes only the declared comparison conclusion', passed: c2Equivalent.totalAfter === c2.totalAfter && near(c2Equivalent.rolloverGap, c2.rolloverGap) },
  { key: 'C2 identified supply shock and real-world risk remain null', passed: c2.identifiedSupplyShock === null && c2.realWorldRiskEstimate === null },
] as const;

if (!emCapitalFlowLabAudit.every(item => item.passed)) {
  throw new Error(`4.08 lab audit failed: ${emCapitalFlowLabAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
