const quarterlyFlow = [
  { period: '2020Q1', issuance: 116.49, repurchases: 145.43, ma: 59.13, net: -88.07 },
  { period: '2020Q2', issuance: 162.55, repurchases: 80.02, ma: 89.49, net: -6.96 },
  { period: '2020Q3', issuance: 149.18, repurchases: 90.39, ma: 38.66, net: 20.13 },
  { period: '2020Q4', issuance: 191.35, repurchases: 112.05, ma: 99.89, net: -20.59 },
  { period: '2021Q1', issuance: 240.83, repurchases: 130.35, ma: 62.82, net: 47.66 },
  { period: '2021Q2', issuance: 251.82, repurchases: 143.10, ma: 112.77, net: -4.05 },
  { period: '2021Q3', issuance: 230.42, repurchases: 156.28, ma: 161.86, net: -87.72 },
  { period: '2021Q4', issuance: 245.12, repurchases: 196.84, ma: 160.45, net: -112.17 },
  { period: '2022Q1', issuance: 177.04, repurchases: 222.35, ma: 104.84, net: -150.14 },
  { period: '2022Q2', issuance: 135.68, repurchases: 192.95, ma: 94.30, net: -151.56 },
  { period: '2022Q3', issuance: 130.74, repurchases: 179.56, ma: 107.93, net: -156.76 },
  { period: '2022Q4', issuance: 152.70, repurchases: 180.96, ma: 147.82, net: -176.09 },
  { period: '2023Q1', issuance: 138.85, repurchases: 173.98, ma: 62.88, net: -98.02 },
  { period: '2023Q2', issuance: 115.88, repurchases: 144.36, ma: 73.39, net: -101.87 },
  { period: '2023Q3', issuance: 111.10, repurchases: 158.56, ma: 73.10, net: -120.55 },
  { period: '2023Q4', issuance: 116.87, repurchases: 181.59, ma: 218.17, net: -282.89 },
  { period: '2024Q1', issuance: 125.26, repurchases: 187.66, ma: 108.48, net: -170.88 },
  { period: '2024Q2', issuance: 127.38, repurchases: 184.21, ma: 59.79, net: -116.62 },
  { period: '2024Q3', issuance: 155.43, repurchases: 172.40, ma: 72.88, net: -89.84 },
  { period: '2024Q4', issuance: 247.20, repurchases: 184.08, ma: 80.92, net: -17.80 },
  { period: '2025Q1', issuance: 183.89, repurchases: 221.22, ma: 90.49, net: -127.83 },
  { period: '2025Q2', issuance: 223.66, repurchases: 180.19, ma: 76.83, net: -33.36 },
  { period: '2025Q3', issuance: 210.88, repurchases: 176.14, ma: 129.68, net: -94.94 },
  { period: '2025Q4', issuance: 221.46, repurchases: 195.73, ma: 78.78, net: -53.05 },
  { period: '2026Q1', issuance: 361.45, repurchases: 176.10, ma: 160.15, net: 25.20 },
] as const;

const baseline = 205;
const scale = 0.43;
const xStart = 55;
const step = 35;
const barWidth = 19;

export default function CorporateFlowChart() {
  const netPoints = quarterlyFlow.map((row, index) => {
    const x = xStart + index * step + barWidth / 2;
    const y = baseline - row.net * scale;
    return x + ',' + y;
  }).join(' ');

  return (
    <figure className="corporate-flow-chart" aria-labelledby="corporate-flow-chart-title corporate-flow-chart-desc">
      <div className="corporate-flow-chart-head">
        <div><span>FED EFA · 2026Q1 VINTAGE</span><h3 id="corporate-flow-chart-title">美国非金融公司股本发行与退休：gross legs 先于 net</h3></div>
        <div className="corporate-flow-legend" aria-label="图例"><span className="issuance">Gross issuance</span><span className="repurchase">Repurchases</span><span className="ma">Cash M&amp;A retirements</span><span className="net">Net issuance</span></div>
      </div>
      <p id="corporate-flow-chart-desc">每根向上柱为季度 gross issuance；向下堆叠柱把 gross retirement 分为 issuer repurchases 与 cash-financed mergers and acquisitions。叠加折线是 net issuance，等于上方发行减去下方两项退休。单位均为十亿美元季度流量，不是日度交易量，也不是季调年率。</p>
      <div aria-label="美国非金融公司季度股本发行与退休图，可横向滚动；图下方提供完整数据表" className="corporate-flow-svg-wrap" role="region" tabIndex={0}>
        <svg aria-hidden="true" viewBox="0 0 960 430">
          <line className="flow-axis" x1="42" x2="930" y1={baseline} y2={baseline} />
          <line className="flow-grid" x1="42" x2="930" y1={baseline - 100 * scale} y2={baseline - 100 * scale} />
          <line className="flow-grid" x1="42" x2="930" y1={baseline - 300 * scale} y2={baseline - 300 * scale} />
          <line className="flow-grid" x1="42" x2="930" y1={baseline + 100 * scale} y2={baseline + 100 * scale} />
          <line className="flow-grid" x1="42" x2="930" y1={baseline + 300 * scale} y2={baseline + 300 * scale} />
          <text x="5" y={baseline - 300 * scale + 5}>+300</text><text x="5" y={baseline - 100 * scale + 5}>+100</text>
          <text x="19" y={baseline + 5}>0</text><text x="5" y={baseline + 100 * scale + 5}>−100</text><text x="5" y={baseline + 300 * scale + 5}>−300</text>
          {quarterlyFlow.map((row, index) => {
            const x = xStart + index * step;
            const issuanceHeight = row.issuance * scale;
            const repurchaseHeight = row.repurchases * scale;
            const maHeight = row.ma * scale;
            return (
              <g key={row.period}>
                <rect className="flow-bar-issuance" height={issuanceHeight} width={barWidth} x={x} y={baseline - issuanceHeight}><title>{row.period} gross issuance: ${row.issuance.toFixed(2)}bn</title></rect>
                <rect className="flow-bar-repurchase" height={repurchaseHeight} width={barWidth} x={x} y={baseline}><title>{row.period} issuer repurchases: ${row.repurchases.toFixed(2)}bn</title></rect>
                <rect className="flow-bar-ma" height={maHeight} width={barWidth} x={x} y={baseline + repurchaseHeight}><title>{row.period} cash M&amp;A retirements: ${row.ma.toFixed(2)}bn</title></rect>
                {(row.period.endsWith('Q1') || row.period === '2025Q4') && <text className="flow-period" x={x + barWidth / 2} y="405">{row.period.replace('Q1', '').replace('2025Q4', '25Q4')}</text>}
              </g>
            );
          })}
          <polyline className="flow-net-line" points={netPoints} />
          {quarterlyFlow.map((row, index) => <circle className="flow-net-dot" cx={xStart + index * step + barWidth / 2} cy={baseline - row.net * scale} key={row.period + '-net'} r="2.8"><title>{row.period} net issuance: ${row.net.toFixed(2)}bn</title></circle>)}
          <text className="flow-unit" x="790" y="24">USD billions per quarter</text>
        </svg>
      </div>
      <details className="understanding-check">
        <summary>打开无图形数据表与复算提示</summary>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="Fed 股本发行与退休季度数据，可横向滚动">
          <table className="concept-table">
            <caption>2020Q1–2026Q1 静态快照；每行满足 net = issuance − repurchases − cash M&amp;A，四舍五入可能产生 0.01 差异</caption>
            <thead><tr><th scope="col">Quarter</th><th scope="col">Gross issuance</th><th scope="col">Repurchases</th><th scope="col">Cash M&amp;A</th><th scope="col">Net issuance</th></tr></thead>
            <tbody>{quarterlyFlow.map((row) => <tr key={row.period + '-row'}><th scope="row">{row.period}</th><td>{row.issuance.toFixed(2)}</td><td>{row.repurchases.toFixed(2)}</td><td>{row.ma.toFixed(2)}</td><td>{row.net.toFixed(2)}</td></tr>)}</tbody>
          </table>
        </div>
      </details>
      <figcaption>最关键的读图纪律：2023Q4 的 −282.89 并不是 282.89 的回购，而是 116.87 的 gross issuance 减去 181.59 的 issuer repurchases 和 218.17 的 cash M&amp;A retirement。2026Q1 转正同样不表示回购消失；当季回购仍为 176.10。数据会修订，研究必须保存下载日和 vintage。</figcaption>
    </figure>
  );
}
