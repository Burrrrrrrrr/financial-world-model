const formationStages = [
  {
    step: '01', eyebrow: 'CLASSIFY', title: '先把人口放入 E、U、N',
    body: '调查依据参考期、是否工作、能否开始工作和是否主动寻找，把人划为就业、失业或非劳动力；参与率决定失业率的分母。',
    leak: '失业率下降 ≠ 就业人数一定增加',
  },
  {
    step: '02', eyebrow: 'SEARCH', title: '工人与企业各自在找什么',
    body: '工人比较工资、通勤、风险与非工资属性；企业决定是否发布岗位、报价多少，并投入筛选、广告和招聘强度。',
    leak: '职位空缺 ≠ 已经发生的雇佣',
  },
  {
    step: '03', eyebrow: 'MATCH', title: '搜索摩擦把两边转成匹配',
    body: '求职者和空缺岗位经过匹配技术、异质性、地域技能错配与招聘投入，形成新的雇佣、召回或求职失败。',
    leak: 'V/U 上升 ≠ 匹配效率必然提高',
  },
];

const contractBranches = [
  {
    step: '04A', eyebrow: 'WORKER SIDE', title: '找到工作、跳槽或退出',
    body: '市场紧度、外部选择和保留工资改变 job-finding、E→E 流动、参与和劳动收入；同一净就业变化可隐藏很大的双向总流量。',
    leak: '人数、岗位、工时与收入不是同一单位',
  },
  {
    step: '04B', eyebrow: 'FIRM SIDE', title: '填岗、议价或调整别的边际',
    body: '企业可提高报价、改善岗位属性、降低标准、增加招聘强度，也可改工时、奖金、自动化或岗位数；vacancy yield 因而会变。',
    leak: '平均工资上涨 ≠ 每名工人工资都上涨',
  },
];

export default function LaborMarketTransmissionChart() {
  return (
    <figure className="growth-transmission-chart" aria-labelledby="labor-transmission-title labor-transmission-caption">
      <div className="growth-transmission-head">
        <div>
          <span>POPULATION → SEARCH → MATCH → CONTRACT → FEEDBACK</span>
          <h3 id="labor-transmission-title">劳动力市场先把人口与岗位需求转成匹配，再把匹配剩余写入就业和工资合同；统计发布只观察这套系统的不同切面</h3>
        </div>
        <div className="growth-transmission-legend" aria-label="图例">
          <span className="main-path">数量与匹配主链</span>
          <span className="break-path">工人与企业双边结果</span>
        </div>
      </div>

      <div
        className="growth-transmission-map"
        role="group"
        tabIndex={0}
        aria-label="调查先把人口划为就业失业或非劳动力；工人与企业分别搜索；搜索摩擦、异质性和招聘投入共同形成匹配"
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

      <div className="growth-branch-origin"><span>同一批匹配同时改变工人的找到工作概率与企业的填岗概率</span><i aria-hidden="true">↙　↘</i></div>
      <div className="growth-branch-grid">
        {contractBranches.map((branch) => (
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
        <div><span>05</span><small>CONTRACT</small></div>
        <h4>就业关系、工资合同与可观察统计</h4>
        <p>匹配剩余、议价权、报价制度和名义刚性共同决定谁被雇佣、基本工资何时调整以及福利和奖金怎样变化；住户、单位、岗位和合同调查随后从不同单位记录结果。</p>
        <em>一个指标测量正确，不表示它是市场松紧的充分统计量</em>
      </article>

      <div className="growth-feedback-band">
        <span>跨期反馈</span>
        <p>就业数量和薪酬改变家庭劳动收入与消费承受力，工资、招聘难度和离职率改变企业成本、利润与岗位设计；数据 surprise 又通过现金流、贴现率和风险溢价进入资产价格，并成为央行下一期状态估计的输入。反馈存在不等于工资机械制造通胀，也不等于某个失业率阈值自动触发政策。</p>
      </div>
      <figcaption id="labor-transmission-caption">
        01→03 是人口与岗位如何进入搜索匹配；04A 与 04B 是同一匹配从工人和企业两侧看到的结果；05 才是工资合同与统计观测。读图时始终分开人口分类、匹配机制、工资形成和政策使用四层。
      </figcaption>
    </figure>
  );
}
