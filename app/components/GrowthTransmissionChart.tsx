const formationStages = [
  {
    step: '01', eyebrow: 'GENERATE', title: '投入、生产率与重配',
    body: '劳动服务、资本服务、利用率、组织、技术和资源配置共同生成当期可实现的生产。',
    leak: '投入增长 ≠ 生产率增长',
  },
  {
    step: '02', eyebrow: 'PRODUCE', title: '实际境内新增价值',
    body: '企业 gross output 扣除中间投入，跨行业聚合为经济领土内的 value added。',
    leak: 'Gross sales ≠ GDP value added',
  },
  {
    step: '03', eyebrow: 'MEASURE', title: '国民账户与实际增长',
    body: '生产、支出和收入资料经价格—数量分解、平衡、季调与修订，形成可发布的 real-growth estimate。',
    leak: '测量值含修订与统计差异',
  },
];

const marketBranches = [
  {
    step: '04A', eyebrow: 'CASH-FLOW BRANCH', title: '行业 → 公司 → 每股现金流',
    body: '产品结构、进口含量、上市覆盖、全球收入、价格/组合/汇率、成本、税、资本开支和股本共同决定股东现金流。',
    leak: 'GDP growth ≠ EPS growth',
  },
  {
    step: '04B', eyebrow: 'DISCOUNT-RATE BRANCH', title: '政策路径 → 利率与风险溢价',
    body: '增长状态或增长新闻可直接改写政策预期、实际利率、期限补偿和风险溢价，无需等待当期公司收入实现。',
    leak: 'Good cash-flow news may meet a higher discount rate',
  },
];

export default function GrowthTransmissionChart() {
  return (
    <figure className="growth-transmission-chart" aria-labelledby="growth-transmission-title growth-transmission-caption">
      <div className="growth-transmission-head">
        <div>
          <span>REAL ACTIVITY → SHAREHOLDER RETURN</span>
          <h3 id="growth-transmission-title">增长先由投入与生产率生成；进入市场后，现金流与折现率两条支路共同决定意外回报</h3>
        </div>
        <div className="growth-transmission-legend" aria-label="图例">
          <span className="main-path">形成与测量</span>
          <span className="break-path">并行定价支路</span>
        </div>
      </div>

      <div
        className="growth-transmission-map"
        role="group"
        tabIndex={0}
        aria-label="劳动、资本、生产率和重配先生成实际境内增加值，国民账户再测量实际增长；增长状态或新闻随后分为现金流支路与折现率支路，两者共同形成相对事前信息集的意外总回报"
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

      <div className="growth-branch-origin"><span>增长状态 / 相对事前信息集的增长新闻</span><i aria-hidden="true">↙　↘</i></div>
      <div className="growth-branch-grid">
        {marketBranches.map((branch) => (
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
        <div><span>05</span><small>PRICE</small></div>
        <h4>相对事前预期的意外总回报</h4>
        <p>在同一信息集与可比对数现值单位下，未来现金流新闻减去未来折现率新闻，才给出方向性的 return decomposition。</p>
        <em>增长百分点不能直接与回报百分点相减</em>
      </article>

      <div className="growth-feedback-band">
        <span>跨期反馈</span>
        <p>利润、融资与投资改变下一期资本存量、进入退出和技术采用；资产价格又会改写融资条件。反馈存在不表示当期 GDP 与当期回报应同号。</p>
      </div>
      <figcaption id="growth-transmission-caption">
        01→03 是经济形成后被统计系统观察的顺序；04A 与 04B 是并行而非先后关系。每一格都必须保存对象、地理范围、名义／实际口径、信息时点与 data vintage。
      </figcaption>
    </figure>
  );
}
