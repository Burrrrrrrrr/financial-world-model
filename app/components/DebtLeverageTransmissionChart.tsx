'use client';

import { useMemo, useState, useSyncExternalStore } from 'react';
import {
  brokerDealerLeverageDataPassport,
  brokerDealerLeverageNormalizedSha256,
  brokerDealerLeverageObservations,
  debtLeverageTransmissionSourceIds,
  householdDebtDataPassport,
  householdDebtNormalizedSha256,
  householdDebtObservations,
  householdDeleveragingEpisodes,
} from './debtLeverageFixtures';
import styles from './debtLeverage.module.css';

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

const focusPeriods = ['2008Q1', '2020Q4', '2025Q4'] as const;
type FocusPeriod = (typeof focusPeriods)[number];
type LeverageObservation = (typeof brokerDealerLeverageObservations)[number];
type HouseholdDebtObservation = (typeof householdDebtObservations)[number];
type HouseholdEpisode = (typeof householdDeleveragingEpisodes)[number];
const householdEvidenceSourceIds = [47, 9] as const;

function Cite({ n }: { n: number }) {
  return <a aria-label={`参考文献 ${n}`} className="citation-mark" href={`#ref-${n}`}>[{n}]</a>;
}

function formatLeverage(value: number, digits = 2) {
  return `${value.toFixed(digits)}×`;
}

function normalizedPeriod(period: string) {
  return period.replace('-', '');
}

function periodLabel(period: string) {
  return normalizedPeriod(period).replace(/Q([1-4])$/, ' Q$1');
}

function quarterOrdinal(period: string) {
  const match = /^(\d{4})Q([1-4])$/.exec(normalizedPeriod(period));
  if (!match) throw new Error(`3.15 invalid quarterly period: ${period}`);
  return Number(match[1]) * 4 + Number(match[2]) - 1;
}

function focusNote(period: FocusPeriod) {
  if (period === '2008Q1') return '所选样本峰值；不是危机阈值';
  if (period === '2020Q4') return '疫情年份末快照；不是冲击识别';
  return '当前数据页的最新季度';
}

function observationForFocus(period: FocusPeriod): LeverageObservation {
  const point = brokerDealerLeverageObservations.find((row) => normalizedPeriod(row.period) === period);
  if (!point) throw new Error(`3.15 missing required focus observation: ${period}`);
  return point;
}

function householdObservation(period: string): HouseholdDebtObservation {
  const point = householdDebtObservations.find((row) => row.period === period);
  if (!point) throw new Error(`3.15 missing required household observation: ${period}`);
  return point;
}

function signedPercent(value: number, digits = 1) {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}%`;
}

function signedPoints(value: number, digits = 2) {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}pp`;
}

function episodeCopy(episode: HouseholdEpisode) {
  if (episode.interpretation === 'liability-numerator-grew-faster-than-income') return {
    kicker: '扩张 · 分子快于分母',
    title: '负债存量增长快于收入',
    body: '总负债/DPI上升，因为负债分子的累计增速显著快于收入分母；这是一项会计分解，不识别为何借款增加。',
  };
  if (episode.interpretation === 'liability-stock-fell-while-income-recovered') return {
    kicker: '修复 I · 两端共同作用',
    title: '负债存量收缩，收入同时修复',
    body: '比率下降既来自负债存量减少，也来自DPI增长；存量下降仍不能自动译成主动现金还款。',
  };
  return {
    kicker: '修复 II · 分母跑得更快',
    title: '负债重新增长，但收入增长更快',
    body: '名义负债已经上升，总负债/DPI却继续下降；“去杠杆”在这里是分母修复，不是债务分子持续收缩。',
  };
}

function HouseholdDebtTable({ printEquivalent = false }: { printEquivalent?: boolean }) {
  return <div className={`yield-data-table-wrap ${styles.tableWrap}`} role="region" aria-label={`家庭与非营利组织负债构成${printEquivalent ? '打印等价' : '完整'}数据表`} tabIndex={printEquivalent ? undefined : 0}>
    <table className="yield-data-table">
      <caption>{printEquivalent ? '打印等价表 · ' : ''}家庭与非营利组织部门：期末负债或房地产市值相对DPI SAAR，单位为%；三项负债构成因发布舍入与总额最多相差0.01个百分点</caption>
      <thead><tr><th scope="col">期间</th><th scope="col">总负债 / DPI</th><th scope="col">住房按揭 / DPI</th><th scope="col">消费信贷 / DPI</th><th scope="col">其他负债 / DPI</th><th scope="col">房地产 / DPI<br />（独立辅助）</th></tr></thead>
      <tbody>{householdDebtObservations.map((point) => <tr key={point.period}><th scope="row">{periodLabel(point.period)}</th><td>{point.totalLiabilitiesToDpi.toFixed(2)}</td><td>{point.homeMortgageToDpi.toFixed(2)}</td><td>{point.consumerCreditToDpi.toFixed(2)}</td><td>{point.otherLiabilitiesToDpi.toFixed(2)}</td><td>{point.realEstateToDpi.toFixed(2)}</td></tr>)}</tbody>
    </table>
  </div>;
}

function HouseholdCompositionChart() {
  return <figure className={`${styles.chartPanel} ${styles.householdPanel}`} aria-labelledby="household-composition-title">
    <div className={styles.compositionHeading}>
      <div><span>负债构成 · 共同150% DPI标尺</span><h4 id="household-composition-title">总负债 = 住房按揭 + 消费信贷 + 其他负债</h4></div>
      <p>房地产/DPI使用独立250%标尺，只作资产侧背景。</p>
    </div>
    <div aria-label="家庭与非营利组织负债相对DPI的选定季度构成图，可横向滚动" className={`${styles.chartScroll} ${styles.compositionScroll}`} role="region" tabIndex={0}>
      <div className={styles.compositionCanvas}>
        <div aria-hidden="true" className={styles.scaleRow}><span>0</span><span>50%</span><span>100%</span><span>150% DPI</span></div>
        <div aria-label="图例" className={styles.compositionLegend} role="list">
          <span className={styles.mortgageLegend} role="listitem">住房按揭</span><span className={styles.consumerLegend} role="listitem">消费信贷</span><span className={styles.otherLegend} role="listitem">其他负债</span><span className={styles.realEstateLegend} role="listitem">房地产/DPI（独立）</span>
        </div>
        {householdDebtObservations.map((point) => {
          const isCurrentMarker = point.period === '2026-Q2';
          return <article className={`${styles.compositionRow}${isCurrentMarker ? ` ${styles.currentMarker}` : ''}`} key={point.period}>
            <div className={styles.periodCell}><b>{periodLabel(point.period)}</b>{isCurrentMarker ? <small>current marker</small> : null}</div>
            <div className={styles.liabilityCell}>
              <div aria-label={`${periodLabel(point.period)}：总负债占DPI ${point.totalLiabilitiesToDpi.toFixed(2)}%，其中住房按揭${point.homeMortgageToDpi.toFixed(2)}%，消费信贷${point.consumerCreditToDpi.toFixed(2)}%，其他负债${point.otherLiabilitiesToDpi.toFixed(2)}%`} className={styles.liabilityScale} role="img">
                <div className={styles.liabilityStack} style={{ width: `${point.totalLiabilitiesToDpi / 1.5}%` }}>
                  <span aria-hidden="true" className={styles.mortgageSegment} style={{ flexGrow: point.homeMortgageToDpi }} />
                  <span aria-hidden="true" className={styles.consumerSegment} style={{ flexGrow: point.consumerCreditToDpi }} />
                  <span aria-hidden="true" className={styles.otherSegment} style={{ flexGrow: point.otherLiabilitiesToDpi }} />
                </div>
              </div>
              <b className={styles.totalLabel}>{point.totalLiabilitiesToDpi.toFixed(2)}%</b>
            </div>
            <div className={styles.assetCell}>
              <span>房地产/DPI</span>
              <div aria-label={`${periodLabel(point.period)}房地产市值占DPI ${point.realEstateToDpi.toFixed(2)}%，独立辅助标尺，不是平均LTV`} className={styles.assetScale} role="img"><span aria-hidden="true" style={{ width: `${point.realEstateToDpi / 2.5}%` }} /></div>
              <b>{point.realEstateToDpi.toFixed(2)}%</b>
            </div>
          </article>;
        })}
      </div>
    </div>
    <p className={styles.omissionNote}><b>为什么主路径跳过2020–2021：</b>DPI是经季调年率化的收入流量，政策转移支付可使分母急跳。为避免把这段特殊分母冲击误读成常规去杠杆，本图不插入2020–2021观察点；2026Q2仅作为图外延伸后的当前标记，不连接成连续季度轨迹。</p>
    <figcaption><b>怎么读：</b>彩色段在同一150% DPI标尺上相加，深色总额是其会计合计；房地产/DPI在右侧独立显示，不能用聚合房地产市值与聚合按揭机械制造“平均家庭LTV”。所有比率都是部门总量，不显示哪类家庭承受尾部风险。</figcaption>
  </figure>;
}

function HouseholdDebtEvidence() {
  const latest = householdObservation('2026-Q2');
  return <section className={`impact-lab ${styles.official} ${styles.householdOfficial}`} aria-labelledby="household-debt-evidence-title">
    <div className="impact-lab-head">
      <div><span>PRIMARY OFFICIAL EVIDENCE · FEDERAL RESERVE Z.1 · CURRENT VINTAGE</span><h3 id="household-debt-evidence-title">家庭部门“去杠杆”不是一条线：先拆负债构成，再辨认分子收缩与分母修复</h3></div>
      <p>数据口径：{householdEvidenceSourceIds.map((id) => <Cite key={id} n={id} />)}</p>
    </div>

    <div className={styles.roomHeader}>
      <div><span>主体边界</span><b>households + nonprofit organizations</b></div>
      <div><span>分子时钟</span><b>quarter-end liability stock</b></div>
      <div><span>分母时钟</span><b>可支配个人收入（disposable personal income, DPI）· 经季节调整的年率（seasonally adjusted annual rate, SAAR）</b></div>
      <div><span>证据身份</span><b>current vintage · descriptive</b></div>
    </div>

    <HouseholdCompositionChart />
    <p className="risk-taking-scroll-hint">窄屏可在构成图内左右滑动；下方表格保留全部八个选定季度及原生数值。</p>

    <section aria-labelledby="household-regimes-title" className={styles.regimeSection}>
      <div className={styles.sectionLabel}><span>NUMERATOR / DENOMINATOR REGIMES</span><h4 id="household-regimes-title">同样是比率升降，资产负债表动作可以完全不同</h4></div>
      <div className={styles.regimeGrid}>{householdDeleveragingEpisodes.map((episode) => {
        const copy = episodeCopy(episode);
        return <article className={styles.regimeCard} key={episode.id}>
          <span>{copy.kicker}</span><h5>{periodLabel(episode.start)} → {periodLabel(episode.end)}</h5><b>{copy.title}</b>
          <dl><div><dt>负债存量</dt><dd>{signedPercent(episode.liabilitiesGrowthPct, 3)}</dd></div><div><dt>DPI SAAR</dt><dd>{signedPercent(episode.dpiGrowthPct, 3)}</dd></div><div><dt>负债/DPI</dt><dd>{signedPoints(episode.ratioChangePp)}</dd></div></dl>
          <p>{copy.body}</p>
        </article>;
      })}</div>
      <p className={styles.stockFlowGuard}>这些卡片比较期末名义存量与收入分母的累计变化。负债存量变化还可能包含核销、重分类及其他数量变化，因此“存量下降”不自动等于同额主动还款，“存量上升”也不自动等于当期新借款流量。<Cite n={9} /></p>
    </section>

    <details className={styles.dataLedger}><summary>展开八个官方选定季度的完整构成表</summary><HouseholdDebtTable /></details>
    <section aria-label="家庭与非营利组织负债构成打印等价数据" className={`print-only ${styles.printTable}`}><h4>家庭部门构成图的打印等价数据</h4><HouseholdDebtTable printEquivalent /></section>

    <div className={`precision-note ${styles.passport}`}>
      <span>家庭部门数据护照与可主张边界</span>
      <p>来源为<a href={householdDebtDataPassport.sourceUrl}>{householdDebtDataPassport.provider}，{householdDebtDataPassport.release}</a>（<a href={householdDebtDataPassport.latestDownloadUrl}>当前最新版本下载端点</a>，不是内容寻址的冻结归档）；范围是{householdDebtDataPassport.scope}，单位为{householdDebtDataPassport.units}。发布更新日{householdDebtDataPassport.releaseUpdatedAt}，取数时点{householdDebtDataPassport.retrievedAtUtc}。取数时所见ZIP字节、数据成员、298期全量规范化数据与本图八行快照SHA-256依次为<code>{householdDebtDataPassport.rawArchiveSha256}</code>、<code>{householdDebtDataPassport.dataMemberSha256}</code>、<code>{householdDebtDataPassport.fullNormalizedSha256}</code>和<code>{householdDebtNormalizedSha256}</code>。<strong>本仓库没有保留该ZIP原件（<code>capturedArchiveRetainedInRepository={String(householdDebtDataPassport.capturedArchiveRetainedInRepository)}</code>）；这些哈希只能识别2026-09-14取到的字节，动态端点日后可能返回另一版本，不能靠该链接按哈希重取。</strong>历史身份为<code>{householdDebtDataPassport.historyType}</code>，不是历史时点当时可知的PIT档案；这组会计分解不识别借贷供给、房价或政策的因果作用。<strong>它不是微观家庭DTI、DSR、平均LTV或家庭杠杆分布；<code>mayEnterCanonicalCalculation={String(householdDebtDataPassport.mayEnterCanonicalCalculation)}</code>，只作外部描述证据，绝不写入合成canonical计算。</strong></p>
    </div>

    <div className="yield-static-summary"><b>无脚本静态摘要：</b><p>2003Q1至2007Q4，负债存量增长60.463%，快于DPI的27.963%，总负债/DPI上升27.71个百分点；2007Q4至2013Q1，负债存量下降5.576%且DPI增长15.581%，比率下降25.04个百分点；2013Q1至2019Q1，负债恢复增长15.102%，但DPI增长30.547%，比率仍下降13.23个百分点。最新2026Q2选定读数为总负债/DPI {latest.totalLiabilitiesToDpi.toFixed(2)}%，其中按揭{latest.homeMortgageToDpi.toFixed(2)}%、消费信贷{latest.consumerCreditToDpi.toFixed(2)}%、其他负债{latest.otherLiabilitiesToDpi.toFixed(2)}%。完整结构、数据护照和打印等价表不依赖JavaScript。</p></div>
  </section>;
}

function OfficialSeriesTable({ printEquivalent = false }: { printEquivalent?: boolean }) {
  return <div className={`yield-data-table-wrap ${styles.tableWrap}`} role="region" aria-label={`美联储经纪自营商杠杆${printEquivalent ? '打印等价' : '完整'}数据表`} tabIndex={printEquivalent ? undefined : 0}>
    <table className="yield-data-table">
      <caption>{printEquivalent ? '打印等价表 · ' : ''}美国经纪自营商总资产/权益：每年第四季度，并额外保留2008年第一季度；单位为原生倍数</caption>
      <thead><tr><th scope="col">期间</th><th scope="col">总资产 / 权益<br />（倍）</th><th scope="col">权益 / 总资产<br />（机械倒数，%）</th></tr></thead>
      <tbody>{brokerDealerLeverageObservations.map((point) => <tr key={point.period}><th scope="row">{periodLabel(point.period)}</th><td>{point.leverage.toFixed(6)}</td><td>{(100 / point.leverage).toFixed(3)}</td></tr>)}</tbody>
    </table>
  </div>;
}

function ControlRoomReadout({ point }: { point: LeverageObservation }) {
  const peak = brokerDealerLeverageObservations.reduce((current, candidate) => candidate.leverage > current.leverage ? candidate : current);
  const equityShare = 100 / point.leverage;
  const distanceFromPeak = point.leverage - peak.leverage;
  return <><output aria-atomic="true" aria-live="polite" className="sr-only">观察季度更新为{periodLabel(point.period)}：经纪自营商总资产除以Fed Z.1权益分母为{formatLeverage(point.leverage)}，机械倒数为{equityShare.toFixed(2)}%。</output><div className={styles.controlRoom} role="group" aria-label={`${periodLabel(point.period)}资产负债表控制室读数`}>
    <article className={styles.controlCard}>
      <span>仪表 A · 官方杠杆</span>
      <b>{formatLeverage(point.leverage)}</b>
      <p>总资产÷Fed Z.1权益分母；本页来源没有把它证明为通用“账面权益”口径。它也不是债务/资产、监管杠杆率或风险加权资本率。</p>
    </article>
    <article className={styles.controlCard}>
      <span>仪表 B · 机械倒数</span>
      <b>{equityShare.toFixed(2)}%</b>
      <p>权益÷总资产，仅由同一比率倒算；不是CET1资本率，也没有风险权重调整。</p>
    </article>
    <article className={`${styles.controlCard} ${styles.warningCard}`}>
      <span>仪表 C · 距样本峰值</span>
      <b>{distanceFromPeak === 0 ? '0.00×' : `${distanceFromPeak.toFixed(2)}×`}</b>
      <p>相对本图{periodLabel(peak.period)}的描述性差值；零不是安全线，负值也不证明脆弱性消失。</p>
    </article>
  </div></>;
}

function BrokerDealerLeverageEvidence() {
  const hydrated = useSyncExternalStore(subscribeHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  const [focusPeriod, setFocusPeriod] = useState<FocusPeriod>('2025Q4');
  const selected = observationForFocus(focusPeriod);
  const geometry = useMemo(() => {
    const left = 62;
    const top = 30;
    const width = 806;
    const height = 250;
    const min = 10;
    const max = 50;
    const firstQuarter = quarterOrdinal(brokerDealerLeverageObservations[0].period);
    const lastQuarter = quarterOrdinal(brokerDealerLeverageObservations[brokerDealerLeverageObservations.length - 1].period);
    const x = (period: string) => left + (quarterOrdinal(period) - firstQuarter) * width / (lastQuarter - firstQuarter);
    const y = (value: number) => top + (max - value) * height / (max - min);
    const path = brokerDealerLeverageObservations.map((point, index) => `${index === 0 ? 'M' : 'L'} ${x(point.period).toFixed(2)} ${y(point.leverage).toFixed(2)}`).join(' ');
    return { left, top, width, height, min, max, x, y, path };
  }, []);
  const labelledPeriods = new Set(['1995Q4', '2000Q4', '2005Q4', '2008Q1', '2010Q4', '2015Q4', '2020Q4', '2025Q4']);

  return <section className={`impact-lab ${styles.official}${hydrated ? ' is-hydrated' : ''}`} aria-labelledby="debt-leverage-official-title">
    <div className="impact-lab-head">
      <div><span>SECTOR-SPECIFIC CONTRAST · OFFICIAL FED DATA · NATIVE MULTIPLE</span><h3 id="debt-leverage-official-title">经纪自营商杠杆的长周期读数：同一条历史线不能替代资产负债表诊断</h3></div>
      <p>数据口径：{debtLeverageTransmissionSourceIds.map((id) => <Cite key={id} n={id} />)}</p>
    </div>

    <div className={styles.roomHeader}>
      <div><span>监测对象</span><b>{brokerDealerLeverageDataPassport.seriesLabel}</b></div>
      <div><span>原生定义</span><b>total assets / equity</b></div>
      <div><span>历史身份</span><b>May 2026 publication · not sequential PIT</b></div>
      <div><span>状态写入</span><b>official → canonical: blocked</b></div>
    </div>

    <figure className={styles.chartPanel}>
      <div className={styles.chartScroll} role="region" aria-label="美国经纪自营商总资产权益倍数折线图，可横向滚动" tabIndex={0}>
        <svg aria-describedby="broker-dealer-leverage-desc" aria-label="1995年第四季度至2025年第四季度美国经纪自营商总资产权益倍数" role="img" viewBox="0 0 950 330">
          <title>美国经纪自营商总资产除以权益，选定季度</title>
          <desc id="broker-dealer-leverage-desc">图中保留1995年至2025年每年第四季度，并额外保留样本峰值附近的2008年第一季度；纵轴是原生杠杆倍数，不是标准分数或危机概率。</desc>
          <rect fill="#f5efe4" height="330" width="950" />
          <rect className={styles.crisisBand} height={geometry.height} width={geometry.x('2009Q4') - geometry.x('2007Q4')} x={geometry.x('2007Q4')} y={geometry.top} />
          {[10, 20, 30, 40, 50].map((tick) => <g key={tick}>
            <line className={styles.gridLine} x1={geometry.left} x2={geometry.left + geometry.width} y1={geometry.y(tick)} y2={geometry.y(tick)} />
            <text className={styles.axisLabel} textAnchor="end" x={geometry.left - 9} y={geometry.y(tick) + 4}>{tick}×</text>
          </g>)}
          <path className={styles.seriesLine} d={geometry.path} />
          {brokerDealerLeverageObservations.map((point) => {
            const isFocus = focusPeriods.includes(normalizedPeriod(point.period) as FocusPeriod);
            return <circle className={isFocus ? styles.focusPoint : styles.seriesPoint} cx={geometry.x(point.period)} cy={geometry.y(point.leverage)} key={point.period} r={isFocus ? 5 : 2.7}>
              <title>{`${periodLabel(point.period)}: ${formatLeverage(point.leverage, 6)}`}</title>
            </circle>;
          })}
          {brokerDealerLeverageObservations.map((point) => labelledPeriods.has(normalizedPeriod(point.period)) ? <text className={styles.axisLabel} key={point.period} textAnchor={normalizedPeriod(point.period) === '1995Q4' ? 'start' : normalizedPeriod(point.period) === '2025Q4' ? 'end' : 'middle'} x={geometry.x(point.period)} y="308">{periodLabel(point.period)}</text> : null)}
          <text className={styles.unitLabel} textAnchor="end" x={geometry.left + geometry.width} y="18">总资产 / 权益（倍）</text>
          <text className={styles.eventLabel} x={geometry.x('2007Q4') + 6} y={geometry.top + 16}>2007–09窗口</text>
        </svg>
      </div>
      <figcaption><b>怎么读：</b>杠杆倍数上升意味着每一单位Fed Z.1权益分母承托更多总资产，因此同幅度资产价值变化对应更大的权益百分比变化；这里不把该官方分母额外提升为通用账面权益定义。但这条聚合线没有债务期限、币种、抵押品、对冲、流动性缓冲或主体分布，不能单独判定系统安全，也不能把2008年的形状当作固定阈值。</figcaption>
    </figure>
    <p className="risk-taking-scroll-hint">窄屏可在图内左右滑动；完整数值同时保留在语义化表格中。</p>

    <details className={styles.dataLedger}><summary>展开全部官方观测与机械倒数</summary><OfficialSeriesTable /></details>
    <section aria-label="美国经纪自营商杠杆打印等价数据" className={`print-only ${styles.printTable}`}><h4>官方折线图的打印等价数据</h4><OfficialSeriesTable printEquivalent /></section>

    <div className={`impact-mode-picker ${styles.focusPicker}`} role="group" aria-label="选择资产负债表控制室的观察季度">
      {focusPeriods.map((period) => {
        const point = observationForFocus(period);
        return <button aria-pressed={focusPeriod === period} key={period} onClick={() => setFocusPeriod(period)} type="button">
          <span>{periodLabel(period)}</span><b>{formatLeverage(point.leverage)}</b><small>{focusNote(period)}</small>
        </button>;
      })}
    </div>
    <ControlRoomReadout point={selected} />

    <div className={`precision-note ${styles.passport}`}>
      <span>数据护照与可主张边界</span>
      <p><a href={brokerDealerLeverageDataPassport.sourceUrl}>{brokerDealerLeverageDataPassport.seriesLabel}</a>；定义为{brokerDealerLeverageDataPassport.definition}。范围：{brokerDealerLeverageDataPassport.scope}。历史身份是{brokerDealerLeverageDataPassport.publicationVintage}，取数日为{brokerDealerLeverageDataPassport.retrievedAt}。一次抓取响应的SHA-256为<code>{brokerDealerLeverageDataPassport.capturedResponseSha256}</code>，但其范围是<code>{brokerDealerLeverageDataPassport.capturedResponseHashScope}</code>，且原件未随站点保存，不能当作稳定源指纹；可重算的稳定锚是Figure 3.7所选行规范化SHA-256 <code>{brokerDealerLeverageNormalizedSha256}</code>。历史身份代码为<code>{brokerDealerLeverageDataPassport.historyType}</code>：它不是每个历史日期当时可得的连续point-in-time档案。<strong>官方序列只承担描述和量纲校准，<code>mayEnterCanonicalCalculation={String(brokerDealerLeverageDataPassport.mayEnterCanonicalCalculation)}</code>；它不会进入本课合成案例、目标杠杆规则、脆弱性得分或canonical计算。</strong></p>
    </div>

    <div className="yield-static-summary">
      <b>无脚本静态摘要：</b>
      <p>官方序列的2008Q1读数为{formatLeverage(observationForFocus('2008Q1').leverage, 6)}，2020Q4为{formatLeverage(observationForFocus('2020Q4').leverage, 6)}，2025Q4为{formatLeverage(observationForFocus('2025Q4').leverage, 6)}。按钮只在浏览器中切换上方三个仪表；关闭JavaScript后，默认显示2025Q4读数，全部官方观测、定义、哈希与边界仍在HTML和打印等价表中。该May 2026出版物快照不是逐历史日期的PIT序列，且绝不写入本课合成canonical状态。</p>
    </div>
  </section>;
}

export default function DebtLeverageTransmissionChart() {
  return <div className={styles.evidenceStack}>
    <HouseholdDebtEvidence />
    <BrokerDealerLeverageEvidence />
  </div>;
}
