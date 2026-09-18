import { imsEvaluators, internationalMonetaryStatisticalPassports } from './internationalMonetaryFixtures';
import type { ImsLabId, StatisticalPassport } from './internationalMonetaryFixtures';
import { imsNumber } from './internationalMonetaryLabDefinitions';
import styles from './internationalMonetary.module.css';

type LooseResult =
  | Readonly<{ status: 'STOP'; reason: string }>
  | Readonly<{ status: 'OK'; value: Readonly<Record<string, unknown>> }>;

function valuesFor(labId: ImsLabId, input: unknown): Readonly<Record<string, unknown>> | null {
  const evaluator = imsEvaluators[labId] as (candidate: unknown) => LooseResult;
  const result = evaluator(input);
  return result.status === 'OK' ? result.value : null;
}

function numberAt(values: Readonly<Record<string, unknown>>, key: string): number {
  const value = values[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw Error(`图形缺少有限数：${key}`);
  return value;
}

function pct(value: number, maximum: number): string {
  if (!(maximum > 0)) return '0%';
  return `${Math.max(0, Math.min(100, value / maximum * 100))}%`;
}

const passportFields: readonly Readonly<{ key: keyof StatisticalPassport; label: string }>[] = [
  { key: 'function', label: 'function／功能' },
  { key: 'unit', label: 'unit／单位' },
  { key: 'referencePeriod', label: 'reference period／参考期' },
  { key: 'coverage', label: 'coverage／覆盖' },
  { key: 'denominator', label: 'denominator／分母' },
  { key: 'vintage', label: 'vintage／版本' },
  { key: 'actorRoles', label: 'actor roles／参与角色' },
  { key: 'recordObject', label: 'record object／记录对象' },
  { key: 'denominationCurrency', label: 'denomination currency／计价币' },
  { key: 'paymentCurrency', label: 'payment currency／付款币' },
];

function StatisticalPassportCards() {
  return <section className={styles.passportPanel} aria-label="C2五张完整统计护照">
    <h4>逐张核对完整统计护照</h4>
    <p>先比较每张卡回答的功能、单位、时钟、覆盖和分母，再核对参与角色、记录对象以及计价币／付款币。字段不同意味着这些百分比没有天然共同总体。</p>
    <div className={styles.passportGrid}>
      {internationalMonetaryStatisticalPassports.map(passport => <article className={styles.passportCard} key={passport.id}>
        <h5>{passport.id} · {passport.candidateCurrency}</h5>
        <dl>
          {passportFields.map(field => <div key={field.key}>
            <dt>{field.label}</dt>
            <dd><code>{passport[field.key]}</code></dd>
          </div>)}
        </dl>
      </article>)}
    </div>
    <p className={styles.passportConclusion}><b>比较结论：</b>五张护照的统计对象并不相同；“同一候选货币”和“都写成百分比”不能把它们变成可直接平均的一列数。</p>
  </section>;
}

function Bars({ rows, maximum, suffix = '' }: {
  rows: readonly Readonly<{ label: string; value: number; tone?: 'warm' | 'cool' }>[];
  maximum: number;
  suffix?: string;
}) {
  return <div className={styles.chartBars}>{rows.map(row => <div className={styles.chartRow} key={row.label}>
    <span>{row.label}</span>
    <div className={styles.chartTrack} aria-hidden="true"><i className={row.tone === 'warm' ? styles.chartWarm : styles.chartCool} style={{ width: pct(Math.abs(row.value), maximum) }} /></div>
    <b>{row.value > 0 && row.label.includes('变化') ? '+' : ''}{imsNumber(row.value)}{suffix}</b>
  </div>)}</div>;
}

export default function InternationalMonetaryLabChart({ labId, input }: { labId: ImsLabId; input: unknown }) {
  const values = valuesFor(labId, input);
  if (!values) return null;

  if (labId === 'C1') {
    const current = numberAt(values, 'expectedSaving');
    const net = numberAt(values, 'netBenefit');
    const acceptance = Number((input as Readonly<Record<string, unknown>>).expectedAcceptancePct);
    const threshold = numberAt(values, 'thresholdPct');
    const thresholdReachable = threshold <= 100;
    return <figure className={styles.labChart} aria-label="协调采用阈值图">
      <figcaption><b>C1 · 接受率—采用门槛</b><span>当前接受率{imsNumber(acceptance)}%，阈值{imsNumber(threshold)}%{thresholdReachable ? '' : '（超过100%，题设内不可达）'}；预期节省{imsNumber(current)}，净收益{imsNumber(net)}。</span></figcaption>
      <div className={styles.thresholdChart} aria-hidden="true">
        <div className={styles.thresholdScale}><span>0%</span><span>50%</span><span>100%</span></div>
        <div className={styles.thresholdTrack}>
          <i className={styles.currentMarker} style={{ left: pct(acceptance, 100) }} />
          {thresholdReachable ? <i className={styles.thresholdMarker} style={{ left: pct(threshold, 100) }} /> : null}
        </div>
        {thresholdReachable ? null : <div className={styles.unreachableThreshold}>轴外 → a*={imsNumber(threshold)}% · 超出100%上限，题设内不可达</div>}
        <div className={styles.thresholdLegend}><span>● 当前预期</span><span>{thresholdReachable ? '│ 零净收益阈值' : '→ 阈值位于轴外'}</span></div>
      </div>
    </figure>;
  }

  if (labId === 'C2') {
    const rows = [
      { label: 'FX turnover', value: numberAt(values, 'fxSharePct') },
      { label: '贸易计价', value: numberAt(values, 'invoiceSharePct') },
      { label: '跨境融资', value: numberAt(values, 'fundingSharePct') },
      { label: '官方储备', value: numberAt(values, 'reserveSharePct') },
      { label: '跨境支付记录', value: numberAt(values, 'paymentSharePct') },
    ];
    return <figure className={`${styles.labChart} ${styles.passportLabChart}`} aria-label="五张功能统计护照小多图">
      <figcaption><b>C2 · 同一候选货币，五个不同统计总体</b><span>条形只在各自护照内表示分子/分母；并排不创造共同分母，故不显示综合平均。</span></figcaption>
      <Bars rows={rows} maximum={100} suffix="%" />
      <StatisticalPassportCards />
    </figure>;
  }

  if (labId === 'C3') {
    const direct = numberAt(values, 'directCostBps');
    const vehicle = numberAt(values, 'vehicleEffectiveCostBps');
    const maximum = Math.max(direct, vehicle, 1);
    return <figure className={styles.labChart} aria-label="直接与载体货币路径成本比较">
      <figcaption><b>C3 · 路径比例成本</b><span>条越短，给定SYN条件下最终交付越多；两腿按留存率乘法合成。</span></figcaption>
      <Bars rows={[{ label: '直接 A/B', value: direct, tone: 'warm' }, { label: 'A/载体/B', value: vehicle }]} maximum={maximum} suffix=" bp" />
    </figure>;
  }

  if (labId === 'C4') {
    const rows = [
      { label: 'FX-A', value: numberAt(values, 'currencyASharePct') },
      { label: 'FX-B', value: numberAt(values, 'currencyBSharePct') },
      { label: 'FX-C', value: numberAt(values, 'currencyCSharePct') },
      { label: 'FX-D', value: numberAt(values, 'currencyDSharePct') },
      { label: 'FX-E', value: numberAt(values, 'currencyESharePct') },
    ];
    return <figure className={styles.labChart} aria-label="外汇货币两腿份额图">
      <figcaption><b>C4 · 每条货币对边产生两个币种腿</b><span>五币种份额合计{imsNumber(numberAt(values, 'currencyShareSumPct'))}%，不是普通构成表的100%。</span></figcaption>
      <Bars rows={rows} maximum={100} suffix="%" />
    </figure>;
  }

  if (labId === 'C5') {
    const opening = Number((input as Readonly<Record<string, unknown>>).openingStock);
    const issuance = Number((input as Readonly<Record<string, unknown>>).grossNewIssuance);
    const repayments = Number((input as Readonly<Record<string, unknown>>).repayments);
    const closing = numberAt(values, 'closingStock');
    const maximum = Math.max(opening, issuance, repayments, closing, 1);
    return <figure className={styles.labChart} aria-label="新融资流量与既有存量桥">
      <figcaption><b>C5 · 存量桥</b><span>期初 + 毛新发行 − 偿还 = 期末；毛活动与净变化保持分开。</span></figcaption>
      <Bars rows={[{ label: '期初存量', value: opening }, { label: '毛新发行', value: issuance }, { label: '偿还', value: -repayments, tone: 'warm' }, { label: '期末存量', value: closing }]} maximum={maximum} />
    </figure>;
  }

  if (labId === 'C6') {
    const opening = numberAt(values, 'openingReserveValue');
    const a = numberAt(values, 'currencyAValuationChange');
    const b = numberAt(values, 'currencyBValuationChange');
    const closing = numberAt(values, 'closingReserveValue');
    const maximum = Math.max(opening, Math.abs(a), Math.abs(b), closing, 1);
    return <figure className={styles.labChart} aria-label="零交易储备估值桥">
      <figcaption><b>C6 · 固定持有量的估值桥</b><span>交易贡献固定为0；正负汇率重估仍把报告价值从{imsNumber(opening)}推到{imsNumber(closing)}。</span></figcaption>
      <Bars rows={[{ label: '期初价值', value: opening }, { label: 'R-A估值变化', value: a }, { label: 'R-B估值变化', value: b, tone: 'warm' }, { label: '期末价值', value: closing }]} maximum={maximum} />
    </figure>;
  }

  const states = values.statePath;
  if (!Array.isArray(states)) throw Error('C7图形缺少状态路径。');
  const inputRecord = input as Readonly<Record<string, unknown>>;
  const scores = [1, 2, 3, 4, 5, 6].map(period => Number(inputRecord[`score${period}`]));
  return <figure className={styles.labChart} aria-label="双阈值网络迟滞时间线">
    <figcaption><b>C7 · 双阈值状态路径</b><span>进入阈值{String(inputRecord.entryThreshold)}，退出阈值{String(inputRecord.exitThreshold)}；迟滞带内沿用上一期状态。</span></figcaption>
    <div className={styles.timeline} role="list">
      {states.map((state, index) => <div className={state === 1 ? styles.timelineCore : styles.timelineEdge} key={index} role="listitem"><span>第{index + 1}期</span><b>{imsNumber(scores[index])}分</b><em>{state === 1 ? '核心' : '外围'}</em></div>)}
    </div>
  </figure>;
}
