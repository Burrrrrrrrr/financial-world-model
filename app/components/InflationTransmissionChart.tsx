const formationStages = [
  {
    step: '01', eyebrow: 'GENERATE', title: '冲击、约束与名义制度',
    body: '总需求、供给能力、工资与生产率、商品和汇率冲击进入既有合同、竞争、财政与名义锚环境。',
    leak: '冲击本身 ≠ 已实现通胀',
  },
  {
    step: '02', eyebrow: 'PRICE', title: '异质企业决定是否、何时、调多少',
    body: '企业比较需求、边际或重置成本、库存、产能、竞争和调价摩擦；有的改价格，有的改数量、质量、组合或利润。',
    leak: '成本变化 ≠ 一比一终端转嫁',
  },
  {
    step: '03', eyebrow: 'PROPAGATE', title: '相对价格变化传播或衰减',
    body: '投入产出、工资、合同、指数化、预期与政策环境决定一次相对价变化是被吸收、扩散，还是形成二轮反馈。',
    leak: '一次价格水平跳升 ≠ 永久通胀率',
  },
];

const measurementBranches = [
  {
    step: '04A', eyebrow: 'CONSUMPTION TARGET', title: '居民消费价格：CPI / PCE',
    body: '同一组交易会因人群、付款主体、消费范围、权重、公式、质量处理与季调规则不同，被聚合成不同居民消费价格指标。',
    leak: 'CPI ≠ PCE ≠ 每户个人生活成本',
  },
  {
    step: '04B', eyebrow: 'PRODUCTION TARGET', title: '境内生产与购买：GDP prices / purchases',
    body: 'GDP 价格指标组织境内生产，gross domestic purchases 组织境内购买；进口与出口在两种对象中的位置并不相同。',
    leak: 'GDP deflator ≠ 消费者生活成本指数',
  },
];

export default function InflationTransmissionChart() {
  return (
    <figure className="growth-transmission-chart" aria-labelledby="inflation-transmission-title inflation-transmission-caption">
      <div className="growth-transmission-head">
        <div>
          <span>SHOCK → PRICE SETTING → INDEX → FEEDBACK</span>
          <h3 id="inflation-transmission-title">通胀先由异质定价行为形成，再被不同统计目标聚合；发布值随后成为下一轮合同、预期和政策的输入</h3>
        </div>
        <div className="growth-transmission-legend" aria-label="图例">
          <span className="main-path">经济形成与传播</span>
          <span className="break-path">统计目标分支</span>
        </div>
      </div>

      <div
        className="growth-transmission-map"
        role="group"
        tabIndex={0}
        aria-label="需求、供给、工资生产率、商品汇率、合同预期与制度先进入异质企业定价；企业可改变价格、数量、质量、组合或利润；价格变化再经供应链、工资、合同、指数化和预期传播或衰减"
      >
        {formationStages.map((stage, index) => (
          <div className="growth-stage-wrap" key={stage.step}>
            <article className="growth-stage">
              <div><span>{stage.step}</span><small>{stage.eyebrow}</small></div>
              <h4>{stage.title}</h4>
              <p>{stage.body}</p>
              <em>{stage.leak}</em>
            </article>
            {index < formationStages.length - 1 ? <span className="growth-stage-arrow" aria-hidden="true">→</span> : null}
          </div>
        ))}
      </div>

      <div className="growth-branch-origin"><span>可观察成交价、数量、质量、门店与支出资料</span><i aria-hidden="true">↙　↘</i></div>
      <div className="growth-branch-grid">
        {measurementBranches.map((branch) => (
          <article className="growth-stage growth-branch" key={branch.step}>
            <div><span>{branch.step}</span><small>{branch.eyebrow}</small></div>
            <h4>{branch.title}</h4>
            <p>{branch.body}</p>
            <em>{branch.leak}</em>
          </article>
        ))}
      </div>
      <div className="growth-branch-merge" aria-hidden="true">↘　↙</div>
      <article className="growth-stage growth-stage-final">
        <div><span>05</span><small>MEASURE</small></div>
        <h4>带完整口径与时钟的已发布通胀率</h4>
        <p>只有同时写明 target、population、scope、formula、weight reference、period、季调状态和 release vintage，一个通胀数字才成为可比较的研究对象。</p>
        <em>测量正确不等于已经识别冲击原因</em>
      </article>

      <div className="growth-feedback-band">
        <span>跨期反馈</span>
        <p>已实现和已发布的通胀会改变实际工资、合同重置、企业预算、预期、政策路径与资产价格；这些反应又会改变下一期需求、成本和定价。反馈存在不表示工资、货币、利润或预期中的任何一个单独变量是每次通胀的充分原因。</p>
      </div>
      <figcaption id="inflation-transmission-caption">
        01→03 是经济中的价格形成与传播；04A 与 04B 是针对同一经济现实提出不同统计问题的并行分支。读图时始终分开“价格怎样形成”“指数怎样测量”和“发布后怎样反馈”三层。
      </figcaption>
    </figure>
  );
}
