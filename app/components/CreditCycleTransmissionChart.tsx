'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  bisCreditCycleCombinedNormalizedSha256,
  bisCreditCycleDynamicDataPassports as bisCreditCycleDataPassports,
  bisCreditCycleSelectedObservations,
  creditCycleTransmissionSourceIds,
  type BisCreditCycleObservation,
} from './creditCycleFixtures';
import styles from './creditCycle.module.css';

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function Cite({ n }: { n: number }) {
  return <a aria-label={`参考文献 ${n}`} className="citation-mark" href={`#ref-${n}`}>[{n}]</a>;
}

function signed(value: number, digits = 1) {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}`;
}

type PanelSpec = {
  id: 'totalCreditToGdp' | 'creditGap' | 'debtServiceRatio';
  title: string;
  short: string;
  unit: string;
  color: string;
  min: number;
  max: number;
  digits: number;
  description: string;
};

const panels: readonly PanelSpec[] = [
  { id: 'totalCreditToGdp', title: 'A · 总信用 / GDP', short: '总信用/GDP', unit: '% of GDP', color: '#526f64', min: 125, max: 180, digits: 1, description: '私人非金融部门对所有贷款人的总信用存量，并非新发放或供给冲击。' },
  { id: 'creditGap', title: 'B · Credit-to-GDP gap', short: '信用/GDP gap', unit: 'percentage points', color: '#9b4b43', min: -20, max: 15, digits: 4, description: '信用/GDP比率相对单边长期趋势的偏离；不是均衡缺口或危机概率。' },
  { id: 'debtServiceRatio', title: 'C · Debt-service ratio', short: 'DSR', unit: '% of income', color: '#766347', min: 12.5, max: 20, digits: 1, description: '基于债务、利率、剩余期限与收入的聚合偿债负担估算；不是债务/收入。' },
] as const;

const labelledPeriods = new Set(['1999-Q4', '2007-Q4', '2015-Q4', '2020-Q2', '2025-Q4']);

function quarterOrdinal(period: string) {
  const match = /^(\d{4})-Q([1-4])$/.exec(period);
  if (!match) throw new Error(`3.14 invalid quarterly period: ${period}`);
  return Number(match[1]) * 4 + Number(match[2]) - 1;
}

function SeriesPanel({ spec }: { spec: PanelSpec }) {
  const geometry = useMemo(() => {
    const left = 58;
    const top = 24;
    const width = 700;
    const height = 178;
    const firstQuarter = quarterOrdinal(bisCreditCycleSelectedObservations[0].period);
    const lastQuarter = quarterOrdinal(bisCreditCycleSelectedObservations.at(-1)!.period);
    const x = (index: number) => left + (quarterOrdinal(bisCreditCycleSelectedObservations[index].period) - firstQuarter) * width / (lastQuarter - firstQuarter);
    const y = (value: number) => top + (spec.max - value) * height / (spec.max - spec.min);
    const path = bisCreditCycleSelectedObservations.map((point, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(2)} ${y(point[spec.id]).toFixed(2)}`).join(' ');
    return { left, top, width, height, x, y, path };
  }, [spec]);
  const ticks = [spec.min, (spec.min + spec.max) / 2, spec.max];
  return <figure className={styles.panel}>
    <div className={styles.panelScroll} role="region" aria-label={`${spec.title}折线图，可横向滚动`} tabIndex={0}>
      <svg aria-describedby={`credit-cycle-${spec.id}-desc`} aria-label={`${spec.title}，1999-Q4至2025-Q4的选定观测`} role="img" viewBox="0 0 800 244">
        <desc id={`credit-cycle-${spec.id}-desc`}>{spec.description}折线画出每年第四季度，并额外保留2020年第二季度。</desc>
        <rect fill="#f7f1e7" height="244" width="800" />
        {ticks.map((tick) => <g key={tick}><line stroke="#d9d0c4" strokeDasharray="4 5" x1={geometry.left} x2={geometry.left + geometry.width} y1={geometry.y(tick)} y2={geometry.y(tick)} /><text fill="#625f58" fontSize="10" textAnchor="end" x={geometry.left - 7} y={geometry.y(tick) + 4}>{tick.toFixed(spec.digits > 1 ? 1 : spec.digits)}</text></g>)}
        {spec.id === 'creditGap' ? <line stroke="#292e2b" strokeWidth="1.2" x1={geometry.left} x2={geometry.left + geometry.width} y1={geometry.y(0)} y2={geometry.y(0)} /> : null}
        <path d={geometry.path} fill="none" stroke={spec.color} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
        {bisCreditCycleSelectedObservations.map((point, index) => <circle aria-label={`${point.period} ${point[spec.id]}`} cx={geometry.x(index)} cy={geometry.y(point[spec.id])} fill={labelledPeriods.has(point.period) ? '#202725' : '#f7f1e7'} key={point.period} r={labelledPeriods.has(point.period) ? 3.8 : 2.2} stroke={spec.color} strokeWidth="1.3" />)}
        {bisCreditCycleSelectedObservations.map((point, index) => labelledPeriods.has(point.period) ? <text fill="#625f58" fontSize="10" key={point.period} textAnchor={point.period === '1999-Q4' ? 'start' : point.period === '2025-Q4' ? 'end' : 'middle'} x={geometry.x(index)} y="226">{point.period.replace('-Q', 'Q')}</text> : null)}
        <text fill="#625f58" fontSize="10" textAnchor="end" x="758" y="15">{spec.unit}</text>
      </svg>
    </div>
    <figcaption><b>{spec.title}</b> · {spec.description}</figcaption>
  </figure>;
}

function OfficialSeriesTable({ printEquivalent = false }: { printEquivalent?: boolean }) {
  return <div className={`yield-data-table-wrap ${styles.tableWrap}`} role="region" aria-label={`BIS三联图28期${printEquivalent ? '打印等价' : '完整'}数据表`} tabIndex={printEquivalent ? undefined : 0}>
    <table className="yield-data-table">
      <caption>{printEquivalent ? '打印等价表 · ' : ''}BIS美国信用周期三面板所绘的28个选定观测；每年Q4加2020-Q2，三列保留原生单位</caption>
      <thead><tr><th scope="col">期间</th><th scope="col">总信用/GDP<br />(%)</th><th scope="col">Credit gap<br />(pp)</th><th scope="col">DSR<br />(%)</th></tr></thead>
      <tbody>{bisCreditCycleSelectedObservations.map((point) => <tr key={point.period}><th scope="row">{point.period}</th><td>{point.totalCreditToGdp.toFixed(1)}</td><td>{signed(point.creditGap, 4)}</td><td>{point.debtServiceRatio.toFixed(1)}</td></tr>)}</tbody>
    </table>
  </div>;
}

function Snapshot({ point }: { point: BisCreditCycleObservation }) {
  return <div aria-atomic="true" aria-live="polite" className={`holding-return-chain ${styles.snapshot}`} role="group" aria-label={`${point.period}三项官方指标快照`}>
    <article><span>总信用 / GDP</span><b>{point.totalCreditToGdp.toFixed(1)}%</b><p>期末存量相对四季度GDP。</p></article>
    <article><span>Credit gap</span><b>{signed(point.creditGap, 4)}pp</b><p>比率减当前vintage的单边趋势。</p></article>
    <article><span>Debt-service ratio</span><b>{point.debtServiceRatio.toFixed(1)}%</b><p>估算偿债支出占收入。</p></article>
  </div>;
}

export default function CreditCycleTransmissionChart() {
  const hydrated = useSyncExternalStore(subscribeHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  const focusPeriods = ['2007-Q4', '2020-Q2', '2025-Q4'] as const;
  const [focusPeriod, setFocusPeriod] = useState<(typeof focusPeriods)[number]>('2025-Q4');
  const selected = bisCreditCycleSelectedObservations.find(({ period }) => period === focusPeriod) ?? bisCreditCycleSelectedObservations.at(-1)!;
  const portalSchedule = bisCreditCycleDataPassports[0];
  return <section className={`impact-lab risk-taking-data-plot financial-conditions-official credit-cycle-official ${styles.official}${hydrated ? ' is-hydrated' : ''}`} aria-labelledby="credit-cycle-official-title">
    <div className="impact-lab-head"><div><span>OFFICIAL BIS DATA · THREE NATIVE UNITS · LATEST-VINTAGE HISTORY</span><h3 id="credit-cycle-official-title">同一个信用系统的存量、趋势偏离与偿债负担，不是同一个指标</h3></div><p>数据口径：{creditCycleTransmissionSourceIds.map((id) => <Cite key={id} n={id} />)}</p></div>
    <div className={styles.panelGrid}>{panels.map((spec) => <SeriesPanel key={spec.id} spec={spec} />)}</div>
    <p className="risk-taking-scroll-hint">移动端可在每幅图内左右滑动；三面板各用原生纵轴，没有被z-score化或合成“真实信用周期指数”。</p>
    <details className="fci-g-series-ledger"><summary>展开三联图的28期语义化数据表</summary><OfficialSeriesTable /></details>
    <section aria-label="BIS三联图28期打印等价数据表" className={`print-only fci-g-series-ledger-print ${styles.tableWrap}`}><h4>三联图的28期打印等价数据</h4><OfficialSeriesTable printEquivalent /></section>
    <div className="impact-mode-picker" role="group" aria-label="选择BIS三指标快照日期">{focusPeriods.map((period) => {
      const point = bisCreditCycleSelectedObservations.find((row) => row.period === period)!;
      return <button aria-pressed={focusPeriod === period} className={focusPeriod === period ? 'active' : ''} key={period} onClick={() => setFocusPeriod(period)} type="button"><span>{period}</span><b>{point.totalCreditToGdp.toFixed(1)} / {signed(point.creditGap, 1)} / {point.debtServiceRatio.toFixed(1)}</b><small>{period === '2007-Q4' ? '转折前高位' : period === '2020-Q2' ? '疫情期分母与融资冲击' : '最新共同观测'}</small></button>;
    })}</div>
    <Snapshot point={selected} />
    <div className={`precision-note ${styles.passport}`}><span>数据护照与可主张边界</span><p>本页于{portalSchedule.retrievedAt}从BIS SDMX API v2下载三个官方季度序列：<a href={bisCreditCycleDataPassports[0].sourceUrl}><code>{bisCreditCycleDataPassports[0].dataflowVersion} / {bisCreditCycleDataPassports[0].seriesKey}</code></a>、<a href={bisCreditCycleDataPassports[1].sourceUrl}><code>{bisCreditCycleDataPassports[1].dataflowVersion} / {bisCreditCycleDataPassports[1].seriesKey}</code></a>与<a href={bisCreditCycleDataPassports[2].sourceUrl}><code>{bisCreditCycleDataPassports[2].dataflowVersion} / {bisCreditCycleDataPassports[2].seriesKey}</code></a>。原文件SHA-256分别为<code>{bisCreditCycleDataPassports[0].rawSha256}</code>、<code>{bisCreditCycleDataPassports[1].rawSha256}</code>和<code>{bisCreditCycleDataPassports[2].rawSha256}</code>；28行联合标准化快照SHA-256为<code>{bisCreditCycleCombinedNormalizedSha256}</code>。BIS门户在取数时声明最近发布为{portalSchedule.portalDeclaredLastRelease}、下一计划发布为{portalSchedule.portalDeclaredNextScheduledRelease}；后者只是日程，本页没有把它写成已发布。图中历史是下载日可得的latest-vintage history，信用、GDP、断点、利率、期限和单边趋势端点都可修订；它不是历史各时点当时可得的PIT档案，不能直接用于声称实时预警表现。</p></div>
    <div className="yield-static-summary"><b>无脚本静态摘要：</b><p>2007-Q4的三项读数为170.6% GDP、+11.6298pp gap和18.5% DSR；2020-Q2为161.8、+2.8827和14.6；最新2025-Q4为140.3、−11.5378和14.1。这些数字只能在各自口径内解读，不得相加。完整28行仍保留在HTML与打印等价表中；日期按钮只是客户端快捷视图。</p></div>
  </section>;
}
