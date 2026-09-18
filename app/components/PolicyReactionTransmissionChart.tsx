const assignmentStages = [
  {
    step: '01',
    eyebrow: 'ASSIGN',
    title: '法律先分配任务与权力',
    body: '立法授权规定央行要追求什么、由谁决定、向谁说明；战略文件再把抽象目标翻译成指数、数值、对称性与时间范围。',
    leak: 'mandate 不是当次会议结论',
  },
  {
    step: '02',
    eyebrow: 'OBSERVE',
    title: '决策者只看得到实时信息集',
    body: '当期数据会修订，潜在产出、自然利率与锚定程度不可直接观察；工作人员预测和情景分布把带噪信号压缩成可决策状态。',
    leak: '事后数据不可偷渡进当时判断',
  },
  {
    step: '03',
    eyebrow: 'WEIGH',
    title: '把目标缺口与风险放进同一权衡',
    body: '通胀、活动、就业、金融与外部状态的权重受授权层级、政策时滞、冲击类型、模型不确定性和尾部损失共同约束。',
    leak: '双目标不等于固定五五开',
  },
];

const reactionBranches = [
  {
    step: '04A',
    eyebrow: 'SYSTEMATIC',
    title: '可预期的系统性反应',
    body: '若状态与预测按某种规律变化，决策者通常会沿可描述但未必线性的反应函数调整政策；规则可作为基准，却不能代替判断。',
    leak: 'Taylor rule 是参照，不是法律算法',
  },
  {
    step: '04B',
    eyebrow: 'RISK',
    title: '状态依赖的风险管理修正',
    body: '参数不确定性可能使行动收敛，零下限、失锚或金融脆弱性也可能使行动更早、更强或改换工具；方向取决于损失的不对称性。',
    leak: '不确定性不总意味着少做一点',
  },
];

export default function PolicyReactionTransmissionChart() {
  return (
    <figure className="growth-transmission-chart" aria-labelledby="policy-reaction-title policy-reaction-caption">
      <div className="growth-transmission-head">
        <div>
          <span>MANDATE → REAL-TIME STATE → TRADE-OFF → REACTION → PATH → OUTCOME</span>
          <h3 id="policy-reaction-title">央行不是对单个数据点机械加息或降息，而是在制度授权下，用当时可得的带噪信息选择一条条件政策路径</h3>
        </div>
        <div className="growth-transmission-legend" aria-label="图例" role="group">
          <span className="main-path">制度与信息主链</span>
          <span className="break-path">基准反应与风险修正</span>
        </div>
      </div>

      <div
        className="growth-transmission-map"
        role="group"
        tabIndex={0}
        aria-label="从法律授权、实时信息和目标权衡，形成央行条件反应"
      >
        {assignmentStages.map((stage, index) => (
          <div className="growth-stage-wrap" key={stage.step}>
            <article className="growth-stage">
              <div><span>{stage.step}</span><small>{stage.eyebrow}</small></div>
              <h4>{stage.title}</h4>
              <p>{stage.body}</p>
              <em>{stage.leak}</em>
            </article>
            {index < assignmentStages.length - 1 ? <span className="growth-stage-arrow" aria-hidden="true">→</span> : null}
          </div>
        ))}
      </div>

      <div className="growth-branch-origin">
        <span>同一状态向量先经过基准反应，再由非线性风险、承诺与委员会判断修正</span>
        <i aria-hidden="true">↙　↘</i>
      </div>
      <div className="growth-branch-grid">
        {reactionBranches.map((branch) => (
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
        <div><span>05</span><small>CHOOSE</small></div>
        <h4>选择当下工具、未来路径与沟通承诺</h4>
        <p>决策不只是一个政策利率点位，还包括资产负债表、流动性工具、外汇或宏观审慎接口，以及对未来行动条件的沟通。本节只解释为什么选择这组工具与路径；准备金、走廊和市场利率如何把决定落地，留给 3.06。</p>
        <em>政策点位相同，不代表预期路径、工具组合与金融条件相同</em>
      </article>

      <article className="growth-stage growth-stage-final">
        <div><span>06</span><small>LEARN</small></div>
        <h4>实施与传导生成结果，再更新下一次状态估计</h4>
        <p>工具经操作框架、收益率曲线、信贷、汇率、资产价格与预期影响经济；实现通胀和就业、市场反应及预测误差随后回到新的信息集。研究者要把可预期反应、目标意外与路径信息分开，才能讨论因果政策冲击。</p>
        <em>规则残差、公告 surprise 与结构性政策冲击不是同义词</em>
      </article>

      <div className="growth-feedback-band">
        <span>闭环如何改变政策含义</span>
        <p>反应函数本身会改变私人部门的预期和行为，因而政策不是对一个不受政策影响的世界做外生校正。可信承诺可能提前改善金融条件；制度或模型发生变化，也会使历史系数失效。评价决策必须使用当时的信息集、当时的制度与一条明确反事实路径。</p>
      </div>
      <figcaption id="policy-reaction-caption">
        01–03 确定“被授权追求什么、当时知道什么、怎样权衡”；04A–04B 解释系统性反应与风险修正；05 把判断翻译成工具和路径；06 通过实施、传导与学习闭合回路。任何一层都不能被一个简单利率公式替代。
      </figcaption>
    </figure>
  );
}
