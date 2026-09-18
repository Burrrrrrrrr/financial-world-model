import { housingFormat } from './housingLabDefinitions';
import { housingPriceCrossing, housingPriceDrawdownPercent, housingPriceObservations, housingPricePassport, housingPricePeak, housingPriceTrough } from './housingPriceData';
import styles from './housingCollateral.module.css';

const x = (i: number) => 65 + i / 115 * 700;
const y = (value: number) => 260 - (value - 90) / 200 * 210;
const path = housingPriceObservations.map(({ value }, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(3)},${y(value).toFixed(3)}`).join(' ');
const markers = [housingPricePeak, housingPriceTrough, housingPriceCrossing];

export default function HousingPriceChart() {
  return <figure className={styles.official} aria-labelledby="housing-price-caption">
    <svg className={styles.chart} viewBox="0 0 840 340" role="img" aria-labelledby="housing-price-title housing-price-desc"><title id="housing-price-title">FHFA全国季度购买型名义季调房价指数，1991Q1至2019Q4</title><desc id="housing-price-desc">1991Q1等于100。事后指定窗口中的峰值2007Q1为222.84，谷值2011Q2为175.49，下降21.248%；2016Q2达到223.11首次重新超过旧名义峰值。它是2026年9月15日取得的当前历史快照，不是当时实时资料，也不识别抵押反馈的因果作用。</desc>
      {[100, 150, 200, 250].map((value) => <g key={value}><line x1="65" x2="765" y1={y(value)} y2={y(value)} stroke="#d2cabd" /><text x="53" y={y(value) + 5} textAnchor="end" fontSize="16" fill="#555d56">{value}</text></g>)}
      <path d={path} fill="none" stroke="#375f59" strokeWidth="3" />
      {[0, 36, 72, 115].map((i) => <text key={i} x={x(i)} y="292" textAnchor="middle" fontSize="16" fill="#555d56">{housingPriceObservations[i].period}</text>)}
      {markers.map((marker, i) => { const index = housingPriceObservations.findIndex(({ period }) => period === marker.period); const labelY = i === 1 ? y(marker.value) + 34 : y(marker.value) - 32; return <g key={marker.period}><circle cx={x(index)} cy={y(marker.value)} r="6" fill={i === 1 ? '#9a6155' : '#375f59'} /><text x={x(index)} y={labelY} textAnchor="middle" fontSize="16" fill="#25302d">{marker.period}</text><text x={x(index)} y={labelY + 20} textAnchor="middle" fontSize="16" fill="#25302d">{marker.value.toFixed(2)}</text></g>; })}
      <text x="65" y="327" fontSize="16" fill="#555d56">季度 · 名义指数 · SA · 1991Q1=100 · 当前快照的回溯展示</text>
    </svg>
    <figcaption id="housing-price-caption"><b>真实数据只提供价格背景。</b>{housingPricePassport.attribution}。116季度连续原值；峰谷跌幅{housingFormat(housingPriceDrawdownPercent)}%。全国指数不是某套房的评估价、净权益、现金、租金或按揭违约率。</figcaption>
    <div className={styles.markerTable}><table><caption>事后窗口和复算端点</caption><thead><tr><th>选择规则</th><th>结果</th><th>不可推断</th></tr></thead><tbody><tr><td>峰值搜索1991Q1–2008Q4</td><td>2007Q1 · 222.84</td><td>不是完整原始文件的最高值</td></tr><tr><td>谷值搜索2007Q1–2013Q4</td><td>2011Q2 · 175.49</td><td>不是可提前知道的转折信号</td></tr><tr><td>2011Q3起首次≥旧峰</td><td>2016Q2 · 223.11</td><td>名义价格恢复≠实际财富或信贷恢复</td></tr></tbody></table></div>
    <p className={styles.passport}><b>数据护照：</b>原始文件{housingPricePassport.rawBytes}字节，含全国及9个区域、最新至2026Q2；只选<code>division=USA</code>和第5列SA，并冻结展示至2019Q4。取得响应时间{housingPricePassport.retrievedAtUtc}；2026Q2参考报告发布日期{housingPricePassport.referenceReportReleaseDate}，未证明当日发布字节与本次取得字节相同。没有插值、通胀调整或重新定基。原始SHA-256：<code>{housingPricePassport.rawSha256}</code>。历史会修订；本页不是historical PIT，也不将这条指数输入C1–C7家庭计算。</p>
    <details className={styles.observations}><summary>展开116个原始选定季度，核对图形与原值</summary><div className={styles.observationGrid}>{housingPriceObservations.map(({ period, value }) => <span key={period}>{period} <b>{value.toFixed(2)}</b></span>)}</div></details>
    <p className="section-sources"><a href={housingPricePassport.sourceUrl}>官方季度下载</a> · <a href="#ref-12">[12]</a><a href="#ref-13">[13]</a><a href="#ref-14">[14]</a></p>
  </figure>;
}
