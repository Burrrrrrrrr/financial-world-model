const formationStages = [
  {
    step: '01',
    eyebrow: 'DEFINE',
    title: '先定义预期对象',
    body: '同一句“未来通胀”必须展开为主体、价格指数、地区、期限窗口、条件以及点值或主观分布；否则不同数字没有共同 estimand。',
    leak: '同名期限不保证同一时间窗口',
  },
  {
    step: '02',
    eyebrow: 'MEASURE',
    title: '再识别测量代理',
    body: '家庭、企业、专家、央行、市场合约和模型潜变量从不同总体与信息集观察预期，并各自带有抽样、风险、流动性或模型楔子。',
    leak: 'survey、market 与 model 不可直接互换',
  },
  {
    step: '03',
    eyebrow: 'UPDATE',
    title: '信息经过异质更新',
    body: '先验、信号精度、注意成本、更新时点、生活经历和主观模型共同决定谁更新、更新多少，以及均值、尾部和分歧怎样变化。',
    leak: '更新缓慢不自动等于不理性',
  },
];

const decisionBranches = [
  {
    step: '04A',
    eyebrow: 'CONTRACT',
    title: '信念进入重设价格与工资合同',
    body: '只有具有重设机会、定价能力并面对足够需求的企业或工人才可能把未来成本和价格信念写进当前合同；机械指数化则是另一条规则。',
    leak: '报告更高预期 ≠ 已经改变合同',
  },
  {
    step: '04B',
    eyebrow: 'CHOICE',
    title: '信念进入跨期选择',
    body: '预期通胀通过事前实际回报、实际收入、债务再分配、融资约束与不确定性影响消费、储蓄、库存和投资，净效应可因主体而异。',
    leak: '实际利率下降 ≠ 消费必然上升',
  },
];

export default function InflationExpectationsTransmissionChart() {
  return (
    <figure className="growth-transmission-chart" aria-labelledby="expectations-transmission-title expectations-transmission-caption">
      <div className="growth-transmission-head">
        <div>
          <span>OBJECT → MEASURE → UPDATE → ANCHOR → ACTION → NEW SIGNAL</span>
          <h3 id="expectations-transmission-title">通胀预期不是单个数字，而是被定义、被带噪测量并由异质主体更新的分布；它只有穿过合同或选择边际，才可能反过来影响现实</h3>
        </div>
        <div className="growth-transmission-legend" aria-label="图例" role="group">
          <span className="main-path">对象与信息主链</span>
          <span className="break-path">合同与跨期选择双分支</span>
        </div>
      </div>

      <div
        className="growth-transmission-map"
        role="group"
        tabIndex={0}
        aria-label="先定义预期对象，再从调查市场或模型测量，随后由具有不同信息和约束的主体更新"
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

      <div className="growth-branch-origin">
        <span>锚定状态决定长期分布对短期新闻的映射，但行为仍取决于主体能否行动</span>
        <i aria-hidden="true">↙　↘</i>
      </div>
      <div className="growth-branch-grid">
        {decisionBranches.map((branch) => (
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
        <div><span>05</span><small>OUTCOME</small></div>
        <h4>实现值、政策沟通与资产价格生成下一轮信号</h4>
        <p>合同和选择共同影响需求、成本与价格；实现通胀、央行表述和市场价格随后进入新的信息集。公告 surprise 必须相对事前共识和首次发布定义，名义收益率变化还要分开实际利率、通胀补偿、风险与流动性新闻。</p>
        <em>共同冲击会同时移动预期与结果，相关性不是 belief→outcome 的因果证明</em>
      </article>

      <div className="growth-feedback-band">
        <span>闭环是否稳定</span>
        <p>信念对信号的更新增益与行为对信念的传导强度共同决定反馈是衰减还是放大。可信制度、短合同、竞争、收入和信用约束可以截断回路；协调、频繁重设与较强传导则可能放大。因而“预期自我实现”是带条件的系统命题，不是问卷均值上升后的自动结论。</p>
      </div>
      <figcaption id="expectations-transmission-caption">
        01→03 先解决“在测什么”和“怎样更新”；04A 与 04B 才把信念接入可观察行动；05 生成下一轮信息。读图时始终分开主观分布、测量代理、行为边际、实现结果与资产 surprise 五层。
      </figcaption>
    </figure>
  );
}
