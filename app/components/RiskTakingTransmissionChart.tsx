const ecbRiskToleranceSeries = [
  ['2019Q1', 1.659909979332748], ['2019Q2', 2.424639931695896], ['2019Q3', 3.5235658794849987], ['2019Q4', 0.7075934142446152],
  ['2020Q1', 2.4577873666603463], ['2020Q2', 3.575043374287753], ['2020Q3', 8.838313667835774], ['2020Q4', 9.371315570037922],
  ['2021Q1', 8.12496239667437], ['2021Q2', 2.094916533129913], ['2021Q3', 1.5363877866763145], ['2021Q4', 0.4870144256677463],
  ['2022Q1', 1.131874752199818], ['2022Q2', 5.708417635471675], ['2022Q3', 8.52056528679869], ['2022Q4', 12.2350854481155],
  ['2023Q1', 8.61601568270005], ['2023Q2', 8.876720805676618], ['2023Q3', 6.970368150570025], ['2023Q4', 3.8749417850446646],
  ['2024Q1', 1.3931051024561332], ['2024Q2', 0.21289975477970657], ['2024Q3', 2.723146239447325], ['2024Q4', -0.35497195232793444],
  ['2025Q1', 6.6165653432704925], ['2025Q2', 1.1676903927883877], ['2025Q3', 1.074993630584186], ['2025Q4', -0.07410727648022225],
  ['2026Q1', 4.955877593989691], ['2026Q2', 3.3319672497390513], ['2026Q3', 3.441939614482094],
] as const;

const stages = [
  { id: '01', title: '定义政策对象与时钟', body: '把政策决定、实施后的无风险曲线与可辩护的外生政策冲击分开，并先于中介选择和结果测量。', guard: '市场利率变化不是自动识别的政策冲击；调查季度也不是政策事件时刻。' },
  { id: '02', title: '冻结相邻状态', body: '固定或显式建模银行资金、资本与流动性容量，以及同一借款人或申请的PD、LGD、净值与抵押品。', guard: '容量变化属于3.10，借款人状态变化属于3.11；未分解时只能写joint-channel。' },
  { id: '03', title: '让风险价格与选择规则内生', body: '政策环境通过目标收益、尾部风险影子价、治理和测量风险改变筛选门槛、报价、期限、契约与资产排序。', guard: '高票息不等于高期望回报，低测量波动也不等于真实尾部风险下降。' },
  { id: '04', title: '形成组合与发起反应', body: '中介在安全/风险资产、借款人类别、新发放/证券之间重配，并可能通过出售或保护改变保留风险。', guard: '银行账面风险下降不代表系统风险消失；风险必须追到贷款买家和保护卖方。' },
  { id: '05', title: '分开事前风险与事后结果', body: '发放时的评分、拒绝阈值和风险份额是事前对象；违约、损失和收益要按同批次成熟窗口测量。', guard: '支持性状态可让选择更冒险但实现违约更低，不能用事后结果反推事前偏好。' },
  { id: '06', title: '用多类证据三角互证', body: '合同与逐笔贷款揭示选择，证券持仓揭示组合，问卷揭示自报机制；三者的单位、覆盖与时钟分别保留。', guard: 'ECB BLS加权净百分比不是贷款量、违约率、弹性或结构参数。' },
  { id: '07', title: '通过识别闸门再升级语言', body: '检查预定暴露、同申请需求控制、共同支持、处理前测量、无处理后控制与匹配的推断层级。', guard: '机制一致性不是因果识别；所有闸门通过也只授予声明样本内的identified-candidate。' },
] as const;

const chart = { left: 44, right: 12, top: 14, bottom: 28, width: 720, height: 230, min: -2, max: 14 };
const plotWidth = chart.width - chart.left - chart.right;
const plotHeight = chart.height - chart.top - chart.bottom;
const xOf = (index: number) => chart.left + index / (ecbRiskToleranceSeries.length - 1) * plotWidth;
const yOf = (value: number) => chart.top + (chart.max - value) / (chart.max - chart.min) * plotHeight;
const points = ecbRiskToleranceSeries.map(([, value], index) => `${xOf(index).toFixed(1)},${yOf(value).toFixed(1)}`).join(' ');

export default function RiskTakingTransmissionChart() {
  return <>
    <figure className="growth-transmission-chart risk-taking-transmission-chart" aria-labelledby="risk-taking-transmission-title">
      <div className="growth-transmission-head"><div><span>INTERMEDIARY RISK-TAKING CHANNEL MAP</span><h3 id="risk-taking-transmission-title">从政策环境到风险定价、筛选与组合选择：容量、借款人状态和因果身份逐层设闸</h3></div></div>
      <ol className="growth-transmission-map">{stages.map((stage) => <li className="growth-stage" key={stage.id}><span>{stage.id}</span><h4>{stage.title}</h4><p>{stage.body}</p><em>护栏：{stage.guard}</em></li>)}</ol>
      <div className="holding-return-chain" role="group" aria-label="风险承担渠道的三个不可混同对象"><article><span>偏好治理翻译 / 选择规则</span><b>decision-book risk weight → acceptance / pricing</b><p>3.12核心：在冻结风险数量和容量后，中介怎样改变风险的内部价格与项目排序；业务权重不自动等于董事会aggregate appetite。</p></article><article><span>风险容量</span><b>capital / liquidity / funding → feasible set</b><p>可以显式建模，但不能偷偷把可行集合扩大写成偏好更冒险。</p></article><article className="result"><span>借款人风险</span><b>12m PD / LGD / EAD / collateral → project state</b><p>预测期、金额、币种、申请池与同一借款人风险必须冻结、控制或单独路由到3.11。</p></article></div>
      <figcaption>这是一张机制与识别路线图，不是结构估计。政策只有先改变中介的风险定价、筛选或组合规则，并在容量和借款人状态的替代解释被关闭后，才形成3.12的局部风险承担渠道候选。</figcaption>
    </figure>

    <figure className="growth-transmission-chart risk-taking-data-chart" aria-labelledby="ecb-risk-tolerance-title">
      <div className="risk-taking-data-plot">
        <div className="growth-transmission-head"><div><span>REAL DATA · ECB BANK LENDING SURVEY</span><h3 id="ecb-risk-tolerance-title">风险容忍度对欧元区企业贷款信贷标准的贡献，2019Q1–2026Q3</h3></div><p>加权净百分比；正值=对收紧有净贡献，负值=对放松有净贡献。</p></div>
        <p className="sr-only" id="ecb-risk-scroll-instruction">在窄屏上可用水平滚动查看完整坐标；折线图之后仍提供31期原始精度读数。</p>
        <div aria-describedby="ecb-risk-scroll-instruction" aria-label="ECB BLS风险容忍度贡献折线图，可横向滚动" className="risk-taking-data-scroll" role="region" tabIndex={0}>
          <svg aria-describedby="ecb-risk-tolerance-desc" role="img" viewBox={`0 0 ${chart.width} ${chart.height}`}>
            <title>ECB BLS企业信贷标准中风险容忍度贡献的加权净百分比</title>
            <desc id="ecb-risk-tolerance-desc">2019年第一季度到2026年第三季度共31个调查发布季度。最高值约为2022年第四季度12.24，2024年第四季度和2025年第四季度略为负值。</desc>
            {[-2, 0, 4, 8, 12].map((tick) => <g key={tick}><line stroke="currentColor" strokeOpacity={tick === 0 ? 0.55 : 0.12} x1={chart.left} x2={chart.width - chart.right} y1={yOf(tick)} y2={yOf(tick)} /><text fill="currentColor" fontSize="10" textAnchor="end" x={chart.left - 7} y={yOf(tick) + 3}>{tick}</text></g>)}
            <polyline fill="none" points={points} stroke="currentColor" strokeWidth="2.5" />
            {ecbRiskToleranceSeries.map(([quarter, value], index) => <circle cx={xOf(index)} cy={yOf(value)} fill="currentColor" key={quarter} r="2.6"><title>{`${quarter}: ${value.toFixed(2)}%`}</title></circle>)}
            {[0, 4, 8, 12, 16, 20, 24, 30].map((index) => <text fill="currentColor" fontSize="9" key={ecbRiskToleranceSeries[index][0]} textAnchor={index === 0 ? 'start' : index === 30 ? 'end' : 'middle'} x={xOf(index)} y={chart.height - 8}>{ecbRiskToleranceSeries[index][0]}</text>)}
          </svg>
        </div>
        <p className="risk-taking-scroll-hint">窄屏提示：横向滚动图表可查看完整坐标；下方“31期原始精度读数”提供逐期文本值。</p>
      </div>
      <div className="precision-note"><span>publication-quarter 警示</span><p>CSV的 <code>TIME_PERIOD</code> 是BLS发布/收集季度索引，<code>COLLECTION=B</code>（期初），而问题的 <code>TIME_HORIZON=B3</code> 指向过去三个月。因此“2026Q3”行是在第三季度发布/收集、回顾此前三个月的调查值，不能当作2026Q3整季已经实现的经济结果，也不能与同标签宏观季度机械同步。</p></div>
      <div className="precision-note"><span>source-vocabulary crosswalk</span><p>图中保留ECB问卷原词 <i>bank&apos;s risk tolerance</i>，只把它解释为受访银行自报的广义贷款供给意愿信号。它既不是本页PD/tail operational tolerance字段，也不是董事会aggregate appetite的直接测量，因而不得覆盖canonical治理状态。</p></div>
      <div className="impact-facts" role="group" aria-label="ECB BLS数据护照">
        <article><span>Series key / source</span><b>BLS.Q.U2.ALL.RTO.E.Z.B3.ST.S.WFNET</b><p>ESCB；ECB Data Portal / ECB Data API。</p></article>
        <article><span>对象与频率</span><b>Q · U2 · ALL · RTO · E · Z</b><p>季度；欧元区变化构成；全部银行；银行风险容忍度影响；企业；counterpart detail不适用。</p></article>
        <article><span>问题域与时钟</span><b>B3 · ST · S · COLLECTION=B</b><p>回顾过去三个月；信贷标准；贷款供给；期初收集。OBS_STATUS=A；OBS_CONF在原CSV为F至2023Q4、之后为空。</p></article>
        <article><span>聚合与单位</span><b>WFNET · UNIT=PC · UNIT_MULT=0 · DECIMALS=0</b><p>按各国在区域贷款余额中的份额加权的净百分比（收紧减放松或相反题目方向）；API保留底层浮点值。</p></article>
        <article><span>版本与完整性</span><b>retrieved 2026-09-03</b><p>覆盖2019Q1–2026Q3，共31行；原CSV SHA-256 <code>3659ded652a256e037ad2e3ed933e40401514de639f7e215eedfa78cb2205d5f</code>。</p></article>
      </div>
      <p className="impact-source-links"><b>当前URL：</b>{' '}<a href="https://data.ecb.europa.eu/data/datasets/BLS/BLS.Q.U2.ALL.RTO.E.Z.B3.ST.S.WFNET">ECB Data Portal series</a>{' · '}<a href="https://data-api.ecb.europa.eu/service/data/BLS/Q.U2.ALL.RTO.E.Z.B3.ST.S.WFNET?startPeriod=2019-Q1&endPeriod=2026-Q3&format=csvdata">原始CSV API查询</a>{' · '}<a aria-label="参考文献 32" className="citation-mark" href="#ref-32">[32]</a></p>
      <details><summary>查看31期原始精度读数</summary><div className="impact-facts" role="list">{ecbRiskToleranceSeries.map(([quarter, value]) => <article key={quarter} role="listitem"><span>{quarter}</span><b>{String(value)}%</b></article>)}</div></details>
      <figcaption><b>证据身份：调查描述，非因果。</b>该序列说明受访银行以ECB来源词“risk tolerance”报告其对企业信贷标准收紧/放松的加权净贡献，可用于核对广义供给侧机制方向和时期异质性；它不识别货币政策冲击，不测量贷款数量、风险资产份额、违约率、canonical operational tolerance或董事会aggregate appetite，也不能单独排除风险感知、需求构成、银行容量与借款人状态。</figcaption>
    </figure>
  </>;
}

export { ecbRiskToleranceSeries };
