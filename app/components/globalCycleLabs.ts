import type { GlobalCycleSourceId } from '../lessons/globalCycleReferences';

export type GlobalCycleLabId = 'C1' | 'C2';

export type C1Input = {
  globalStress: number;
  aExposureQ: number;
  aBufferQ: number;
  aLocal: number;
  bExposureQ: number;
  bBufferQ: number;
  bLocal: number;
  cExposureQ: number;
  cBufferQ: number;
  cLocal: number;
};

export type C1Row = {
  id: 'A' | 'B' | 'C';
  asset: string;
  exposure: number;
  buffer: number;
  local: number;
  unbuffered: number;
  bufferOffset: number;
  commonContribution: number;
  total: number;
  globalShare: number | null;
};

export type C1Result = {
  status: 'OK';
  rows: readonly C1Row[];
  causalShare: null;
  realWorldEstimate: null;
};

export const c1Default: C1Input = {
  globalStress: 4,
  aExposureQ: 4,
  aBufferQ: 1,
  aLocal: 0,
  bExposureQ: 6,
  bBufferQ: 2,
  bLocal: -1,
  cExposureQ: 2,
  cBufferQ: 0,
  cLocal: 2,
};

const c1Assets = {
  A: 'A国股票损失score',
  B: 'B国汇率贬值score',
  C: 'C国主权利差压力score',
} as const;

export function calculateC1(input: C1Input): C1Result {
  const specs = [
    ['A', input.aExposureQ, input.aBufferQ, input.aLocal],
    ['B', input.bExposureQ, input.bBufferQ, input.bLocal],
    ['C', input.cExposureQ, input.cBufferQ, input.cLocal],
  ] as const;
  const rows = specs.map(([id, exposureQ, bufferQ, local]) => {
    const exposure = exposureQ / 4;
    const buffer = bufferQ / 4;
    const unbuffered = input.globalStress * exposure;
    const bufferOffset = -unbuffered * buffer;
    const commonContribution = unbuffered + bufferOffset;
    const total = commonContribution + local;
    return {
      id,
      asset: c1Assets[id],
      exposure,
      buffer,
      local,
      unbuffered,
      bufferOffset,
      commonContribution,
      total,
      globalShare: total === 0 ? null : commonContribution / total,
    };
  });
  return { status: 'OK', rows, causalShare: null, realWorldEstimate: null };
}

export type C2Input = { h: number; k: number };

export type C2Result = {
  status: 'OK';
  series: readonly { time: string; A: number; B: number; C: number; P: number }[];
  gram: readonly (readonly number[])[];
  eigenvalues: readonly number[];
  pc1Kind: 'global-common-direction' | 'local-contrast-direction';
  pc1Loadings: readonly number[];
  explainedShare: number;
  correlationAB: number;
  correlationCP: number;
  proxyResidual: readonly number[];
  commonScore: readonly number[];
  commonComponentDetected: boolean;
  proxySampleMatch: boolean;
  identifiedShock: null;
  contagionDirection: null;
  causalEffect: null;
};

export const c2Default: C2Input = { h: 1, k: 2 };

export function calculateC2({ h, k }: C2Input): C2Result {
  const g = [-3, -1, 1, 3] as const;
  const q = [1, -1, -1, 1] as const;
  const series = g.map((common, index) => ({
    time: `t${index + 1}`,
    A: common + h * q[index],
    B: common - h * q[index],
    C: common,
    P: common + k * q[index],
  }));
  const gram = [
    [20 + 4 * h ** 2, 20 - 4 * h ** 2, 20],
    [20 - 4 * h ** 2, 20 + 4 * h ** 2, 20],
    [20, 20, 20],
  ] as const;
  const globalEigenvalue = 60;
  const localEigenvalue = 8 * h ** 2;
  const globalDominates = globalEigenvalue > localEigenvalue;
  const inverseSqrt3 = 1 / Math.sqrt(3);
  const inverseSqrt2 = 1 / Math.sqrt(2);
  const pc1Loadings = globalDominates
    ? [inverseSqrt3, inverseSqrt3, inverseSqrt3]
    : [inverseSqrt2, -inverseSqrt2, 0];
  const eigenvalues = [Math.max(globalEigenvalue, localEigenvalue), Math.min(globalEigenvalue, localEigenvalue), 0];
  return {
    status: 'OK',
    series,
    gram,
    eigenvalues,
    pc1Kind: globalDominates ? 'global-common-direction' : 'local-contrast-direction',
    pc1Loadings,
    explainedShare: eigenvalues[0] / (globalEigenvalue + localEigenvalue),
    correlationAB: (5 - h ** 2) / (5 + h ** 2),
    correlationCP: Math.sqrt(5 / (5 + k ** 2)),
    proxyResidual: q.map(value => k * value),
    commonScore: g,
    commonComponentDetected: globalDominates,
    proxySampleMatch: k === 0,
    identifiedShock: null,
    contagionDirection: null,
    causalEffect: null,
  };
}

export const globalCycleLabs = [
  {
    id: 'C1' as const,
    title: '共同压力经过暴露、缓冲和本地冲击，为什么会产生反排序？',
    question: '改变G、四分之一档exposure/buffer或本地冲击，观察相同全球输入如何被缓冲、放大或反转。',
    passport: 'AUTHOR-SYN · 三条独立country×asset记录 · adverse-score同方向单位 · 非现实收益、bp或实时指数 · causal share与现实估计恒为null。',
    sourceIds: [4, 9, 12] as readonly GlobalCycleSourceId[],
  },
  {
    id: 'C2' as const,
    title: 'PCA、VIX-like proxy、相关性和因果识别为什么是四种镜头？',
    question: '改变市场本地对比h和proxy-specific成分k，观察PC1方向与代理相关如何变化，同时因果字段保持null。',
    passport: 'AUTHOR-SYN · 四个时点、三市场与一条VIX-like proxy · 已去均值、同synthetic stress-score单位 · X′X冻结定义 · 非真实VIX。',
    sourceIds: [2, 4, 7, 19] as readonly GlobalCycleSourceId[],
  },
] as const;

function near(left: number, right: number, tolerance = 1e-10) {
  return Math.abs(left - right) <= tolerance;
}

const c1 = calculateC1(c1Default);
const c2 = calculateC2(c2Default);
const c2H3 = calculateC2({ h: 3, k: 2 });
const c2ExactProxy = calculateC2({ h: 0, k: 0 });

export const globalCycleLabAudit = [
  { key: 'C1 default exact totals are 3, 2, 4', passed: JSON.stringify(c1.rows.map(row => row.total)) === JSON.stringify([3, 2, 4]) },
  { key: 'C1 accounting identity holds for every row', passed: c1.rows.every(row => near(row.total, row.unbuffered + row.bufferOffset + row.local) && near(row.total, row.commonContribution + row.local)) },
  { key: 'C1 default reverses exposure and outcome rank between B and C', passed: c1.rows[1].exposure > c1.rows[2].exposure && c1.rows[1].total < c1.rows[2].total },
  { key: 'C1 causal and real-world estimates remain null', passed: c1.causalShare === null && c1.realWorldEstimate === null },
  { key: 'C1 zero total preserves null share', passed: calculateC1({ ...c1Default, aLocal: -3 }).rows[0].total === 0 && calculateC1({ ...c1Default, aLocal: -3 }).rows[0].globalShare === null },
  { key: 'C2 default Gram matrix is exact', passed: JSON.stringify(c2.gram) === JSON.stringify([[24, 16, 20], [16, 24, 20], [20, 20, 20]]) },
  { key: 'C2 default eigenvalues and explained share are 60, 8, 0 and 15/17', passed: JSON.stringify(c2.eigenvalues) === JSON.stringify([60, 8, 0]) && near(c2.explainedShare, 15 / 17) },
  { key: 'C2 default correlations and residual are exact', passed: near(c2.correlationAB, 2 / 3) && near(c2.correlationCP, Math.sqrt(5) / 3) && JSON.stringify(c2.proxyResidual) === JSON.stringify([2, -2, -2, 2]) },
  { key: 'C2 h=3 changes PC1 to local contrast', passed: c2H3.pc1Kind === 'local-contrast-direction' && JSON.stringify(c2H3.eigenvalues) === JSON.stringify([72, 60, 0]) },
  { key: 'C2 exact proxy match still leaves causal fields null', passed: c2ExactProxy.proxySampleMatch && c2ExactProxy.identifiedShock === null && c2ExactProxy.contagionDirection === null && c2ExactProxy.causalEffect === null },
] as const;

if (!globalCycleLabAudit.every(item => item.passed)) {
  throw new Error(`4.07 lab audit failed: ${globalCycleLabAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
