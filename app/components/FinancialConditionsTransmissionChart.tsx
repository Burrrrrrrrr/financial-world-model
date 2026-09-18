'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  fciGDataPassport,
  fciGDecompositionSnapshots,
  fciGSelectedQuarterEnds,
} from './financialConditionsFixtures';

function formatSigned(value: number, digits = 2) {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}`;
}

function Reference({ n }: { n: number }) {
  return <a aria-label={`参考文献 ${n}`} className="citation-mark" href={`#ref-${n}`}>[{n}]</a>;
}

function FciGSeriesTable({ printEquivalent = false }: { printEquivalent?: boolean }) {
  const label = printEquivalent ? 'FCI-G折线图27期打印等价数据表' : 'FCI-G折线图27期完整数据表';
  return (
    <div className="yield-data-table-wrap" role="region" aria-label={label} tabIndex={printEquivalent ? undefined : 0}>
      <table className="yield-data-table">
        <caption>{printEquivalent ? '打印等价表 · ' : ''}官方FCI-G baseline三年回看 · 折线所绘27个选定观测；单位为对未来一年实际GDP增长的百分点逆风（正）或尾风（负）</caption>
        <thead><tr><th scope="col">观测日期</th><th scope="col">FCI-G</th><th scope="col">最窄方向解释</th></tr></thead>
        <tbody>{fciGSelectedQuarterEnds.map((point) => <tr key={point.date}><th scope="row">{point.date}</th><td>{formatSigned(point.total, 6)}pp</td><td>{point.total > 0 ? '模型映射的增长逆风' : point.total < 0 ? '模型映射的增长尾风' : '所含贡献相加为零'}</td></tr>)}</tbody>
      </table>
    </div>
  );
}

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

export default function FinancialConditionsTransmissionChart() {
  const [snapshotIndex, setSnapshotIndex] = useState(2);
  const hydrated = useSyncExternalStore(subscribeHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  const snapshot = fciGDecompositionSnapshots[snapshotIndex];
  const line = useMemo(() => {
    const min = -2;
    const max = 1.2;
    const left = 54;
    const top = 24;
    const width = 700;
    const height = 210;
    const x = (index: number) => left + index * width / (fciGSelectedQuarterEnds.length - 1);
    const y = (value: number) => top + (max - value) * height / (max - min);
    const path = fciGSelectedQuarterEnds.map(({ total }, index) => `${index ? 'L' : 'M'} ${x(index).toFixed(2)} ${y(total).toFixed(2)}`).join(' ');
    return { min, max, left, top, width, height, x, y, path };
  }, []);
  const decompositionEntries = Object.entries(snapshot.contributions);

  return (
    <section className={`risk-taking-data-plot financial-conditions-official${hydrated ? ' is-hydrated' : ''}`} aria-labelledby="fci-g-chart-title">
      <div className="impact-lab-head">
        <div>
          <span>OFFICIAL DATA · FCI-G BASELINE · SELECTED OBSERVATIONS</span>
          <h3 id="fci-g-chart-title">同一个“金融条件”读数，必须同时保留目的、单位、滞后结构与分项贡献</h3>
        </div>
        <p>数据与方法：<Reference n={1} /><Reference n={2} /></p>
      </div>

      <div className="risk-taking-data-chart">
        <div className="risk-taking-data-scroll" role="region" aria-label="FCI-G 2020年至2026年所选季度末与最新月度观测折线图，可横向滚动" tabIndex={0}>
          <svg aria-labelledby="fci-g-line-title fci-g-line-desc" role="img" viewBox="0 0 800 276">
            <title id="fci-g-line-title">FCI-G 2020年3月至2026年7月所选观测</title>
            <desc id="fci-g-line-desc">正值表示对未来一年实际GDP增长的逆风，负值表示尾风。折线从2020年3月负0.13下降到2021年6月负1.75，随后上升到2022年12月正1.00，再下降到2026年7月负0.88。这里只画季度末行并追加最新月度行。</desc>
            <rect fill="#f7f1e7" height="276" width="800" />
            {[-2, -1, 0, 1].map((tick) => (
              <g key={tick}>
                <line stroke={tick === 0 ? '#202725' : '#d9d0c4'} strokeDasharray={tick === 0 ? undefined : '4 5'} x1={line.left} x2={line.left + line.width} y1={line.y(tick)} y2={line.y(tick)} />
                <text fill="#625f58" fontSize="11" textAnchor="end" x={line.left - 8} y={line.y(tick) + 4}>{formatSigned(tick, 0)}</text>
              </g>
            ))}
            <text fill="#9b4b43" fontSize="11" fontWeight="700" x={line.left + 4} y={line.y(1) - 8}>逆风 / 收紧方向</text>
            <text fill="#2f6f65" fontSize="11" fontWeight="700" x={line.left + 4} y={line.y(-1) + 18}>尾风 / 放松方向</text>
            <path d={line.path} fill="none" stroke="#9b4b43" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" />
            {fciGSelectedQuarterEnds.map((point, index) => {
              const important = point.date === '2021-06-30' || point.date === '2022-12-30' || point.date === '2026-07-31';
              return <circle aria-label={`${point.date} ${formatSigned(point.total, 3)}`} cx={line.x(index)} cy={line.y(point.total)} fill={important ? '#202725' : '#f7f1e7'} key={point.date} r={important ? 4.5 : 2.4} stroke="#9b4b43" strokeWidth="1.5" />;
            })}
            {[
              { index: 0, label: '2020-03' },
              { index: 7, label: '2021-12' },
              { index: 15, label: '2023-12' },
              { index: 23, label: '2025-12' },
              { index: 26, label: '2026-07' },
            ].map(({ index, label }) => <text fill="#625f58" fontSize="11" key={label} textAnchor={index === 0 ? 'start' : index === 26 ? 'end' : 'middle'} x={line.x(index)} y="258">{label}</text>)}
            <text fill="#625f58" fontSize="10" x="754" y="18">单位：百分点</text>
          </svg>
        </div>
        <p className="risk-taking-scroll-hint">移动端可左右滑动查看完整时间轴；打印版会自动压缩到页宽。</p>
      </div>

      <details className="fci-g-series-ledger">
        <summary>展开折线图的27期语义化数据表</summary>
        <FciGSeriesTable />
      </details>
      <section aria-label="FCI-G折线图27期打印等价表" className="print-only fci-g-series-ledger-print">
        <h4>折线图的27期打印等价数据</h4>
        <FciGSeriesTable printEquivalent />
      </section>

      <div className="impact-mode-picker" role="group" aria-label="选择FCI-G分解日期">
        {fciGDecompositionSnapshots.map((item, index) => (
          <button aria-pressed={snapshotIndex === index} className={snapshotIndex === index ? 'active' : ''} key={item.date} onClick={() => setSnapshotIndex(index)} type="button">
            <span>{item.date}</span><b>{formatSigned(item.total, 3)}pp</b><small>{index === 0 ? '所选2020+窗口的最强尾风' : index === 1 ? '所选2020+窗口的最强逆风' : 'CSV最新观测'}</small>
          </button>
        ))}
      </div>

      <div className="risk-taking-data-chart">
        <div className="risk-taking-data-scroll" role="region" aria-label={`${snapshot.date} FCI-G七项贡献分解`} tabIndex={0}>
          <svg aria-labelledby="fci-g-bars-title fci-g-bars-desc" role="img" viewBox="0 0 800 310">
          <title id="fci-g-bars-title">所选FCI-G日期的七项贡献</title>
          <desc id="fci-g-bars-desc">从左向右分别绘制对未来一年增长的尾风和逆风贡献。七项贡献相加等于总指数。</desc>
          <rect fill="#f7f1e7" height="310" width="800" />
          <line stroke="#202725" x1="410" x2="410" y1="24" y2="276" />
          <text fill="#2f6f65" fontSize="11" fontWeight="700" textAnchor="end" x="397" y="18">尾风 −</text>
          <text fill="#9b4b43" fontSize="11" fontWeight="700" x="423" y="18">+ 逆风</text>
          {decompositionEntries.map(([label, value], index) => {
            const y = 38 + index * 34;
            const barWidth = Math.abs(value) * 330;
            const x = value < 0 ? 410 - barWidth : 410;
            return <g key={label}><text fill="#3d433f" fontSize="12" textAnchor="end" x="116" y={y + 14}>{label}</text><rect fill={value < 0 ? '#4f8c82' : '#b85d50'} height="20" rx="2" width={barWidth} x={x} y={y} /><text fill="#3d433f" fontSize="11" fontWeight="700" textAnchor={value < 0 ? 'end' : 'start'} x={value < 0 ? x - 6 : x + barWidth + 6} y={y + 14}>{formatSigned(value, 3)}</text></g>;
          })}
          <text fill="#202725" fontSize="13" fontWeight="800" x="116" y="296">七项合计 {formatSigned(snapshot.total, 3)}pp</text>
          </svg>
        </div>
      </div>

      <div aria-atomic="true" aria-live="polite" className="yield-data-table-wrap fci-g-live-ledger" role="region" aria-label="当前所选FCI-G日期的七项贡献数据表" tabIndex={0}>
        <table className="yield-data-table">
          <caption>{snapshot.date} · 当前所选七项贡献；合计{formatSigned(snapshot.total, 6)}pp</caption>
          <thead><tr><th scope="col">组件</th><th scope="col">贡献</th><th scope="col">方向</th></tr></thead>
          <tbody>{decompositionEntries.map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{formatSigned(value, 6)}pp</td><td>{value > 0 ? '增长逆风' : value < 0 ? '增长尾风' : '零贡献'}</td></tr>)}</tbody>
          <tfoot><tr><th scope="row">七项合计</th><td>{formatSigned(snapshot.total, 6)}pp</td><td>与官方总指数闭合</td></tr></tfoot>
        </table>
      </div>

      <section aria-labelledby="fci-g-static-ledgers-title" className="fci-g-static-ledgers-section">
        <h4 id="fci-g-static-ledgers-title">三期静态分解账本：无脚本、屏幕阅读器与打印均保留</h4>
        <div className="fci-g-snapshot-ledgers">{fciGDecompositionSnapshots.map((item) => <div className="yield-data-table-wrap fci-g-snapshot-ledger" key={item.date}><table className="yield-data-table"><caption>{item.label} · 合计{formatSigned(item.total, 6)}pp</caption><thead><tr><th scope="col">组件</th><th scope="col">贡献</th></tr></thead><tbody>{Object.entries(item.contributions).map(([label, value]) => <tr key={label}><th scope="row">{label}</th><td>{formatSigned(value, 6)}pp</td></tr>)}</tbody><tfoot><tr><th scope="row">七项合计</th><td>{formatSigned(item.total, 6)}pp</td></tr></tfoot></table></div>)}</div>
      </section>

      <div className="precision-note">
        <span>数据护照与最窄解释</span>
        <p>这是美联储理事会FCI-G baseline、三年回看窗口的研究产品快照。<a href={fciGDataPassport.sourceURL}>下载本页冻结来源CSV</a>；原文件共有{fciGDataPassport.observationCount}条月度观测，范围{fciGDataPassport.observationStart}至{fciGDataPassport.observationEnd}。本折线只选2020年3月至2026年6月的季度末行，并追加最新的2026年7月行。文件于{fciGDataPassport.retrievedAt}取回，SHA-256为<code>{fciGDataPassport.sha256}</code>。正值不是“GDP必然少这么多”，而是模型把已观察且可能内生的金融变量变化映射为未来一年增长逆风的rule-of-thumb；它遗漏贷款标准与条款，也不是货币政策冲击。七项柱形贡献的和在底层逐期复算闭合。</p>
      </div>
      <div className="yield-static-summary"><b>无脚本静态摘要：</b>所选窗口中，2021-06-30为−1.753pp尾风，2022-12-30为+0.999pp逆风；最新CSV观测2026-07-31为−0.877pp，其中股票贡献−0.669pp最大。折线的27期表与三期七项静态分解账本都保留在HTML；日期按钮只是客户端快捷视图。</div>
    </section>
  );
}
