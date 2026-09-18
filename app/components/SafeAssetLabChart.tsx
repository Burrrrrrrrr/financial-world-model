import { safeAssetEvaluators } from './safeAssetFixtures';
import type { SafeAssetLabId, ServiceDimension, SupplyCurvePoint } from './safeAssetFixtures';
import { safeAssetNumber } from './safeAssetLabDefinitions';
import styles from './safeAsset.module.css';

type LooseResult =
  | Readonly<{ status: 'STOP'; reason: string }>
  | Readonly<{ status: 'OK'; value: Readonly<Record<string, unknown>> }>;

const serviceLabels: Readonly<Record<ServiceDimension, string>> = {
  creditSafety: '信用安全',
  nominalPriceStability: '名义价格稳定',
  marketLiquidity: '市场流动性',
  legalOperationalAccess: '法律／操作可达',
  collateralUsability: '抵押品可用',
  badStatePerformance: '坏状态表现',
};

function valuesFor(labId: SafeAssetLabId, input: unknown): Readonly<Record<string, unknown>> | null {
  const evaluator = safeAssetEvaluators[labId] as (candidate: unknown) => LooseResult;
  const result = evaluator(input);
  return result.status === 'OK' ? result.value : null;
}

function numberAt(values: Readonly<Record<string, unknown>>, key: string): number {
  const value = values[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw Error(`4.03图形缺少有限数：${key}`);
  return value;
}

function width(value: number, maximum: number): string {
  if (!(maximum > 0)) return '0%';
  return `${Math.max(0, Math.min(100, Math.abs(value) / maximum * 100))}%`;
}

function Bars({ rows, maximum, suffix = '' }: {
  rows: readonly Readonly<{ label: string; value: number; tone?: 'warm' | 'risk' }> [];
  maximum: number;
  suffix?: string;
}) {
  return <div className={styles.chartRows}>{rows.map(row => <div className={styles.chartRow} key={row.label}>
    <span>{row.label}</span>
    <div className={styles.chartTrack} aria-hidden="true"><i className={row.tone === 'warm' ? styles.warm : row.tone === 'risk' ? styles.risk : undefined} style={{ width: width(row.value, maximum) }} /></div>
    <b>{row.value > 0 && row.label.includes('变化') ? '+' : ''}{safeAssetNumber(row.value)}{suffix}</b>
  </div>)}</div>;
}

function SignedBars({ rows, maximum, suffix = '' }: {
  rows: readonly Readonly<{ label: string; value: number; tone?: 'warm' | 'risk' }> [];
  maximum: number;
  suffix?: string;
}) {
  return <div className={styles.chartRows}>{rows.map(row => {
    const share = maximum > 0 ? Math.min(50, Math.abs(row.value) / maximum * 50) : 0;
    return <div className={styles.chartRow} key={row.label}>
      <span>{row.label}</span>
      <div className={styles.signedTrack} aria-hidden="true"><i className={row.tone === 'warm' ? styles.warm : row.tone === 'risk' ? styles.risk : undefined} style={{ left: `${row.value < 0 ? 50 - share : 50}%`, width: `${share}%` }} /></div>
      <b>{row.value > 0 ? '+' : ''}{safeAssetNumber(row.value)}{suffix}</b>
    </div>;
  })}</div>;
}

function SupplyCurve({ points, currentPoint }: { points: readonly SupplyCurvePoint[]; currentPoint: SupplyCurvePoint }) {
  const widthPx = 620;
  const heightPx = 230;
  const padX = 42;
  const padY = 26;
  const maxX = Math.max(...points.map(point => point.issuedQuantity), currentPoint.issuedQuantity, 1);
  const maxY = Math.max(...points.map(point => point.effectiveSafeCapacity), currentPoint.effectiveSafeCapacity, 1);
  const x = (value: number) => padX + value / maxX * (widthPx - padX * 2);
  const y = (value: number) => heightPx - padY - value / maxY * (heightPx - padY * 2);
  const polyline = points.map(point => `${x(point.issuedQuantity)},${y(point.effectiveSafeCapacity)}`).join(' ');

  return <svg className={styles.supplySvg} viewBox={`0 0 ${widthPx} ${heightPx}`} role="img" aria-label="作者SYN发行量与有效安全容量非单调曲线">
    <title>作者SYN非单调供给曲线，不是现实最优发行量或债务阈值</title>
    <line x1={padX} y1={heightPx - padY} x2={widthPx - padX} y2={heightPx - padY} />
    <line x1={padX} y1={padY} x2={padX} y2={heightPx - padY} />
    <polyline points={polyline} />
    {points.map(point => <circle key={point.issuedQuantity} cx={x(point.issuedQuantity)} cy={y(point.effectiveSafeCapacity)} r={3.5} />)}
    <circle cx={x(currentPoint.issuedQuantity)} cy={y(currentPoint.effectiveSafeCapacity)} r={6} data-current="true" />
    <text x={widthPx / 2} y={heightPx - 4} textAnchor="middle">SYN毛发行量</text>
    <text x={14} y={heightPx / 2} textAnchor="middle" transform={`rotate(-90 14 ${heightPx / 2})`}>有效安全容量</text>
  </svg>;
}

export default function SafeAssetLabChart({ labId, input }: { labId: SafeAssetLabId; input: unknown }) {
  const values = valuesFor(labId, input);
  if (!values) return null;

  if (labId === 'C1') {
    const vector = values.serviceVector;
    if (vector === null || typeof vector !== 'object' || Array.isArray(vector)) throw Error('C1图形缺少服务向量。');
    const priorities = Array.isArray(values.priorityDimensions) ? new Set(values.priorityDimensions) : new Set<unknown>();
    const rows = (Object.keys(serviceLabels) as ServiceDimension[]).map(key => ({
      label: `${serviceLabels[key]}${priorities.has(key) ? ' · 当前优先' : ''}`,
      value: numberAt(vector as Readonly<Record<string, unknown>>, key),
      tone: priorities.has(key) ? undefined : 'warm' as const,
    }));
    return <figure className={styles.chart} aria-label="六维安全服务向量">
      <figcaption><b>C1 · 服务向量，不合成单一安全分数</b><span>0与100只是同一题设内的作者序数锚点；每根条独立，最低项只定位本情景约束，不用于跨资产或跨情景排名。</span></figcaption>
      <Bars rows={rows} maximum={100} suffix="/100" />
    </figure>;
  }

  if (labId === 'C3') {
    const comparator = numberAt(values, 'comparatorYieldPct');
    const service = numberAt(values, 'serviceAssetYieldPct');
    const wedge = numberAt(values, 'convenienceYieldBps');
    const maximum = Math.max(Math.abs(comparator), Math.abs(service), 1);
    return <figure className={styles.chart} aria-label="匹配比较资产与服务资产收益率">
      <figcaption><b>C3 · 先匹配，再看收益楔子</b><span>六个匹配开关全部通过后，候选便利收益为{safeAssetNumber(wedge)} bp；负值也允许，不预设服务资产必然低收益。</span></figcaption>
      <SignedBars rows={[{ label: '匹配比较资产收益率', value: comparator }, { label: '服务资产收益率', value: service, tone: 'warm' }]} maximum={maximum} suffix="%" />
    </figure>;
  }

  if (labId === 'C5') {
    const rows = [
      { label: '毛市场价值', value: numberAt(values, 'grossMarketValue') },
      { label: '资格调整后', value: numberAt(values, 'eligibilityAdjustedValue') },
      { label: '同时可用且合格', value: numberAt(values, 'availableEligibleValue') },
      { label: '扣haircut后现金能力', value: numberAt(values, 'cashCapacity'), tone: 'warm' as const },
    ];
    return <figure className={styles.chart} aria-label="抵押品现金能力漏斗">
      <figcaption><b>C5 · 市值不是可融资现金</b><span>价格×数量还要依次通过资格、可用性和haircut；结果不推断交易对手是否愿意成交。</span></figcaption>
      <Bars rows={rows} maximum={Math.max(rows[0].value, 1)} />
    </figure>;
  }

  if (labId === 'C6') {
    const rows = [
      { label: '毛未偿额', value: numberAt(values, 'grossOutstanding') },
      { label: '真正可提供', value: numberAt(values, 'availableCapacity') },
      { label: '目标设施合格', value: numberAt(values, 'eligibleCapacity') },
      { label: '未质押且操作可达', value: numberAt(values, 'unencumberedCapacity') },
      { label: '市场承接后Qeff', value: numberAt(values, 'qEff'), tone: 'warm' as const },
    ];
    const retention = values.retentionPct;
    if (retention !== null && (typeof retention !== 'number' || !Number.isFinite(retention))) throw Error('C6图形留存率必须是有限数或null。');
    return <figure className={styles.chart} aria-label="毛未偿额到有效安全容量漏斗">
      <figcaption><b>C6 · Gross stock → Qeff</b><span>当前留存率{retention === null ? 'N/A（毛余额为0，分母不存在）' : `${safeAssetNumber(retention)}%`}；所有比例均是作者SYN，不是现实国家的有效安全资产统计。</span></figcaption>
      <Bars rows={rows} maximum={Math.max(rows[0].value, 1)} />
    </figure>;
  }

  if (labId === 'C7') {
    const curve = values.curve;
    if (!Array.isArray(curve)) throw Error('C7图形缺少供给曲线。');
    const points = curve as SupplyCurvePoint[];
    const currentPoint: SupplyCurvePoint = {
      issuedQuantity: numberAt(values, 'issuedQuantity'),
      depthServicePct: numberAt(values, 'depthServicePct'),
      credibilityServicePct: numberAt(values, 'credibilityServicePct'),
      bindingServicePct: numberAt(values, 'bindingServicePct'),
      effectiveSafeCapacity: numberAt(values, 'effectiveSafeCapacity'),
    };
    return <figure className={styles.chart} aria-label="作者SYN非单调供给曲线">
      <figcaption><b>C7 · 深度增益与可信度侵蚀共存</b><span>当前毛发行{safeAssetNumber(numberAt(values, 'issuedQuantity'))}、有效容量{safeAssetNumber(numberAt(values, 'effectiveSafeCapacity'))}；网格峰值不是现实阈值或政策最优。</span></figcaption>
      <SupplyCurve points={points} currentPoint={currentPoint} />
      <Bars rows={[
        { label: '深度服务', value: numberAt(values, 'depthServicePct') },
        { label: '可信度服务', value: numberAt(values, 'credibilityServicePct'), tone: 'risk' },
        { label: '绑定服务', value: numberAt(values, 'bindingServicePct'), tone: 'warm' },
      ]} maximum={100} suffix="%" />
    </figure>;
  }

  const closing = numberAt(values, 'closingCurrencyValue');
  const pathA = numberAt(values, 'pathATotalValue');
  const pathB = numberAt(values, 'pathBTotalValue');
  const inputRecord = input as Readonly<Record<string, unknown>>;
  const bridgeRows = [
    { label: '本金交易变化', value: Number(inputRecord.principalTransactions), tone: 'warm' as const },
    { label: '收益再投资变化', value: Number(inputRecord.incomeReinvestment) },
    { label: 'FX估值变化', value: Number(inputRecord.fxValuation), tone: 'risk' as const },
    { label: '价格估值变化', value: Number(inputRecord.priceValuation) },
    { label: '覆盖／修订变化', value: Number(inputRecord.coverageChange), tone: 'risk' as const },
  ];
  const maximum = Math.max(...bridgeRows.map(row => Math.abs(row.value)), 1);
  return <figure className={styles.chart} aria-label="币种总值桥与两条工具等价路径">
    <figcaption><b>C8 · 相同聚合总值，不同工具数量</b><span>A、B两条路径都精确闭合到{safeAssetNumber(closing)}，但债券数量相差{safeAssetNumber(numberAt(values, 'bondQuantityDifference'))}；聚合值不能唯一反推特定国债数量。</span></figcaption>
    <div className={styles.pathPair}>
      <article><span>币种总值桥起点</span><b>{safeAssetNumber(Number(inputRecord.openingCurrencyValue))}</b><p>下面五项保持各自正负方向；它们合计{safeAssetNumber(numberAt(values, 'bridgeChange'))}。</p></article>
      <article><span>币种总值桥终点</span><b>{safeAssetNumber(closing)}</b><p>终点是市场价值汇总，不是任何单一债券数量。</p></article>
    </div>
    <SignedBars rows={bridgeRows} maximum={maximum} />
    <div className={styles.pathPair}>
      <article><span>工具路径 A</span><b>{safeAssetNumber(pathA)}</b><p>债券数量 {safeAssetNumber(Number(inputRecord.pathABondQuantity))}；其余由存款、价格与其他债权闭合。</p></article>
      <article><span>工具路径 B</span><b>{safeAssetNumber(pathB)}</b><p>债券数量 {safeAssetNumber(Number(inputRecord.pathBBondQuantity))}；聚合等价仍不产生数量识别。</p></article>
    </div>
  </figure>;
}
