import LaborMarketLab from '../components/LaborMarketLab';
import LaborMarketTransmissionChart from '../components/LaborMarketTransmissionChart';
import { laborMarketScenarios } from '../components/laborMarketScenarios';
import { lesson303ReadingList, lesson303References } from './lesson-3-03-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson303Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>劳动力市场不是一个失业率数字，而是把人口与岗位需求转成匹配、再把匹配剩余写入就业关系和工资合同的动态系统。</h2>
        <p>
          央行观察就业、失业、参与、职位空缺、雇佣、离职和工资，不是因为其中某一项能机械决定通胀或利率，而是因为劳动力市场的真实松紧不可直接观察。人口能否工作、企业是否真正招聘、双方多快匹配、工人拥有什么外部选择，以及工资合同多快重置，分别提供数量、流量、匹配与名义调整四类不完全证据。只有把这些证据放进同一状态系统，才可能区分需求降温、供给收缩、构成变化、匹配效率下降与纯粹测量噪声。<Cite n={1} /><Cite n={3} /><Cite n={9} /><Cite n={104} />
        </p>
        <div className="causal-chain" aria-label="劳动力市场从人口状态到政策信息的完整链条" role="list">
          <div role="listitem"><span>01</span><b>States</b><p>人口在 E、U、N 之间流动。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Vacancies</b><p>企业发布岗位并投入招聘。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Matching</b><p>搜索摩擦决定 finding 与 filling。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Surplus</b><p>匹配创造可被分配的剩余。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Contract</b><p>议价、报价与刚性形成工资。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Feedback</b><p>收入、成本、资产与政策更新。</p></div>
        </div>
        <p>
          这条链天然存在双边拥挤：职位越多，求职者通常越容易找到工作，但每个岗位反而可能更难招到人；工资越高，既可能反映生产率和更大匹配剩余，也可能反映企业为降低离职而支付的租金，或只是低薪工人退出样本后的构成效应。因而“就业强”“工资高”“劳动力短缺”都不是无需口径和反事实的原始事实。后文会把每个词拆成可测对象、行为机制和可被否证的断链。<Cite n={39} /><Cite n={41} /><Cite n={50} /><Cite n={75} />
        </p>
        <LaborMarketTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>本节只解释就业和工资怎样形成、怎样被测量以及提供什么状态信息；生产、通胀和政策决定各自留在相邻单元。</h2>
        <div className="learning-objectives">
          <span>六层路线 · 从统计对象到状态向量</span>
          <ol>
            <li><b>对象与口径（00–19）：</b>人、岗位、匹配、合同，E/U/N、vacancy、工资与数据时钟。</li>
            <li><b>流动与匹配（20–34）：</b>gross flows、hazard、job ladder、matching、tightness 与 Beveridge curve。</li>
            <li><b>工资形成（35–52）：</b>劳动需求、保留工资、剩余、议价、报价、市场力、制度与名义刚性。</li>
            <li><b>状态与接口（53–59）：</b>wage Phillips、非线性、u*、综合 dashboard、家庭、企业与资产。</li>
            <li><b>主动迁移（60–62）：</b>10 道互动、10 道静态孪生、14 道检查与 18 个术语。</li>
            <li><b>证据审计（63）：</b>8 个章节接口、Evidence Passport、逐项证据地图与 20 组阅读。</li>
          </ol>
        </div>
        <p>
          硬先修为 3.01–3.02；建议按需调用 T03、T05、T06 与 T08。零背景核心首读走 00–10、13–16、18–31、33–45、48–51、53–60；完整正文与逐式复算约 205–255 分钟。3.01 已经解释劳动作为生产投入、总工时和生产率，本节不重讲生产函数；3.02 已经解释工资、生产率、单位劳动成本和价格反馈，本节只形成工资并把条件性接口交回；3.05 才讨论央行目标、损失函数、反应函数和工具。本节的最终输出不是“应该加息或降息”，而是一份带口径、置信度和竞争性解释的劳动力市场状态向量。<Cite n={5} /><Cite n={12} /><Cite n={97} /><Cite n={104} />
        </p>
      </section>

      <section className="lesson-section" id="units-person-job-match-contract">
        <p className="section-kicker">02 · Person、Job、Match 与 Wage Contract</p>
        <h2>人、岗位、雇佣关系和工资合同是四种统计单位；把它们混成“就业”会制造不存在的矛盾。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="劳动力市场四种统计单位，可横向滚动">
          <table className="concept-table">
            <caption>同一人在同一时点可以对应多个岗位，但每个岗位又可能处于未填补状态</caption>
            <thead><tr><th scope="col">单位</th><th scope="col">被数的对象</th><th scope="col">不能替代什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Person</th><td>调查总体中的个人及其 E/U/N 状态</td><td>岗位数、工时或收入充足性</td></tr>
              <tr><th scope="row">Job</th><td>单位账册上的受薪岗位，兼职和副业可各算一份</td><td>独立就业人数或自雇人数</td></tr>
              <tr><th scope="row">Match</th><td>某名工人与某个岗位建立的雇佣关系</td><td>招聘广告或待填岗位</td></tr>
              <tr><th scope="row">Contract</th><td>基本工资、奖金、福利、工时和调整条款</td><td>家庭总收入或企业全部劳动成本</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一名工人拥有两份工作时，住户调查通常仍数一名就业者，单位调查可能数两个 payroll jobs；一个职位空缺尚未匹配任何工人；同一匹配还可能同时有基本工资、奖金和福利三套调整时钟。因此 household employment、payroll jobs、vacancies 和 wage contracts 可以同向，也可以暂时分叉。分叉首先要求核对单位与覆盖，不能立刻被解释成某个调查“错了”。<Cite n={1} /><Cite n={5} /><Cite n={8} /><Cite n={9} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="stocks-flows-hazards-growth">
        <p className="section-kicker">03 · Stock、Flow、Hazard 与 Growth</p>
        <h2>存量描述某个时点有多少，流量描述期间发生多少次转移，hazard 描述处于风险集中的人有多大转移概率。</h2>
        <div className="equation-card">
          <span>四种时间对象不能混用</span>
          <div>U<sub>t</sub> = 某时点失业存量；　F<sup>U→E</sup><sub>t</sub> = 期间转移人数；　f<sub>t</sub> = F<sup>U→E</sup><sub>t</sub>/U<sub>t−1</sub></div>
          <p>f 是离散期近似 hazard，分母是期初处于失业且面临转移风险的人；它不是就业人数增长率，也不等于平均失业期限的简单倒数。</p>
        </div>
        <p>
          Vacancy 常以调查参考日的存量记录，hires 和 separations 则是在整个月发生的流量。失业率是失业存量占劳动力的比例；job-finding rate 是失业者离开 U 进入 E 的条件概率；payroll growth 又是岗位存量的变化率。把“空缺率 5%”“雇佣率 4%”“就业增长 0.2%”并列比较而不写分母和期间，数学上没有共同含义。<Cite n={9} /><Cite n={10} /><Cite n={47} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="target-population">
        <p className="section-kicker">04 · Target Population 与调查边界</p>
        <h2>劳动力指标必须先声明代表哪些人、住在哪里、年龄多大以及由谁回答；国际标准不消除国家实施差异。</h2>
        <p>
          住户调查要规定 working-age threshold、通常居住人口、军人、机构人口、学生、临时迁移者与集体户的处理。单位调查则以企业或机构名录为抽样框，常排除自雇、无雇员企业或某些行业。人口控制更新、移民估计和住户轮换会改变分母；企业出生、死亡和基准名录更新会改变岗位估计。相同的“就业率”只有在总体、年龄、地理和参考期一致时才可比较。<Cite n={1} /><Cite n={2} /><Cite n={5} /><Cite n={15} /><Cite n={27} /><Cite n={36} /><Cite n={38} />
        </p>
        <div className="precision-note"><span>国际可比的正确含义</span><p>ILO resolution 提供概念基准，Eurostat 等提供协调方法，但国家问卷、搜索窗口、抽样框、季调和制度断点仍须逐项读取 metadata。可比不是“所有国家已经用同一张问卷”。</p></div>
      </section>

      <section className="lesson-section" id="eun-states">
        <p className="section-kicker">05 · Employment、Unemployment 与 Non-participation</p>
        <h2>E、U、N 是按照活动和搜索行为划分的互斥状态，不是“工作好”“工作差”“懒惰”的价值判断。</h2>
        <div className="equation-card">
          <span>人口存量恒等式</span>
          <div>WAP<sub>t</sub> = E<sub>t</sub> + U<sub>t</sub> + N<sub>t</sub>；　LF<sub>t</sub> = E<sub>t</sub> + U<sub>t</sub></div>
          <p>WAP 是给定定义下的工作年龄人口；LF 是劳动力。三个状态必须穷尽且互斥，具体判断依参考期、工作活动、可工作性和搜索条件。</p>
        </div>
        <p>
          就业 E 通常优先于其他状态：参考期内只要满足工作定义，即使同时求职或是学生，也先归为就业。没有工作的人只有在可开始工作并满足主动搜索或临时解雇等规则时才归入 U；其余归 N。N 包含退休、在学、照护、健康限制、失望退出和其他原因，内部异质性极大。失业因此不是“所有没有工作的人”，非劳动力也不是“永远不会工作的人”。<Cite n={1} /><Cite n={3} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="one-hour-rule">
        <p className="section-kicker">06 · One-hour Rule</p>
        <h2>“至少工作一小时”是一条避免状态重叠的统计分类规则，不是对充分就业、工作质量或收入充足的判断。</h2>
        <p>
          国际劳动统计以短参考期内为报酬或利润工作至少一小时作为就业边界之一，目的是让零小时与正工作活动可被一致分类。它使少量兼职、自雇活动和临时工作不会被同时算作失业，却也意味着 headline employment 不能说明一名工人是否获得所需工时、稳定合同、足够收入或匹配技能。更广的工时、非自愿兼职和劳动低利用指标正是用来补充这些维度；国际标准须按 19th ICLS 经 21st ICLS 修订后的当前文本读取。<Cite n={1} /><Cite n={3} /><Cite n={29} /><Cite n={121} />
        </p>
        <div className="myth-grid">
          <article><span>错误读法</span><h3>工作一小时就算“充分就业”</h3><p>分类只回答参考期内是否发生就业活动，不回答工时意愿、收入、保障或生产率。</p></article>
          <article><span>正确接口</span><h3>状态之后继续看数量与质量</h3><p>把 employment 与 hours、underemployment、earnings、contract type 和 transition risk 并列。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="unemployment-qualification">
        <p className="section-kicker">07 · 失业资格与搜索窗口</p>
        <h2>没有工作只是失业的必要条件；可开始工作、主动搜索和临时解雇规则决定谁进入 U。</h2>
        <p>
          美国 headline unemployment 通常要求在过去四周采取具体求职行动并当前可工作，临时解雇等待召回者有特殊处理；其他国家的搜索窗口、可工作期限或制度例外可能不同。仅“想工作”、浏览招聘信息却没有采取规定行动，或因照护暂时不能开始工作的人，可能进入 N 而非 U。规则变化会移动 U/N 边界，即使真实就业关系没有立刻变化。<Cite n={1} /><Cite n={3} /><Cite n={4} /><Cite n={33} />
        </p>
        <p>
          搜索行为本身也内生于机会：岗位稀少时，有人停止搜索而转入 N；机会改善时，同一人重新进入 U，短期内反而推高失业率。于是失业率上升既可能来自裁员，也可能来自更多人重新寻找工作。需要流入来源与参与率共同判断，而不能把 U 的方向直接命名为景气方向。
        </p>
      </section>

      <section className="lesson-section" id="unemployment-participation-epop">
        <p className="section-kicker">08 · Unemployment Rate、LFPR 与 EPOP</p>
        <h2>失业率只在劳动力分母内比较 U；参与率和就业人口比决定这个分母为何变化。</h2>
        <div className="equation-card">
          <span>三个必须并列的比例</span>
          <div>u = U/(E+U)；　LFPR = (E+U)/WAP；　EPOP = E/WAP</div>
          <p>三者都是比例而非人数。u 的分母会随 U↔N 流动变化；LFPR 观察进入劳动力的份额；EPOP 直接把就业人数放回工作年龄人口。</p>
        </div>
        <p>
          若十名失业者停止搜索并转入 N，E 不变、U 减少、LF 变小，失业率可以下降而 EPOP 完全不变；若大量学生毕业开始求职，U 和 LFPR 可同时上升，EPOP 暂时不变。长期比较还要分开老龄化等人口构成和周期性退出。没有哪一个比例单独足够，但三者能对分母变化形成第一轮交叉约束。<Cite n={3} /><Cite n={57} /><Cite n={104} /><Cite n={125} />
        </p>
      </section>

      <section className="lesson-section" id="broader-underutilization">
        <p className="section-kicker">09 · Broader Labor Underutilization</p>
        <h2>边际依附、想工作但未搜索和非自愿兼职补充 headline unemployment，却不能简单相加为一个无争议的“真实失业率”。</h2>
        <p>
          更广义指标可把因暂时原因没有搜索但接近劳动力市场的人、因找不到全职而被迫兼职的人，以及其他潜在劳动力纳入不同层级。这些群体与 U 的就业转换概率、可工作时间和政策含义不相同，分母也可能改变。美国 U-6、Eurostat labour market slack 和 ILO labour underutilization 因定义结构不同，不能只比较最后一个百分比；Eurostat 的 15–74 岁年度值与 20–64 岁季调季度值也不是同一对象。<Cite n={1} /><Cite n={3} /><Cite n={17} /><Cite n={121} /><Cite n={125} />
        </p>
        <div className="precision-note"><span>更广不等于更真</span><p>指标范围越广，回答的问题越接近“未被满足的劳动供给”，却也把不同距离和不同工时约束的人放在一起。研究目的必须先决定该看哪一层。</p></div>
      </section>

      <section className="lesson-section" id="persons-jobs-selfemployment">
        <p className="section-kicker">10 · Persons、Payroll Jobs 与 Self-employment</p>
        <h2>住户调查数人，单位调查数岗位；多重就业、自雇与企业覆盖使两条序列不要求月月相等。</h2>
        <p>
          一名双职工人在 household survey 仍是一名 employed person，在 establishment payroll 中可贡献两份 jobs；自雇者通常进入住户就业，却不进入 payroll employee jobs。相反，单位调查可更精确记录大型雇主的工资册，但不能从岗位数恢复独立就业人数。人口估计、企业 birth–death、参考周与 pay period 也会造成时点差异。<Cite n={5} /><Cite n={6} /><Cite n={7} /><Cite n={8} />
        </p>
        <p>
          因此 payroll jobs 下降而 household employment 稳定，可能是副业减少、自雇增加、抽样误差或真正趋势分叉；要先分解差异项，再寻找结构故事。把一个序列当成另一个序列的误差校正，会丢掉两种单位本来提供的互补信息。
        </p>
      </section>

      <section className="lesson-section" id="household-establishment">
        <p className="section-kicker">11 · Household Survey 与 Establishment Survey</p>
        <h2>两类调查不是优劣排名，而是用不同抽样框回答“哪些人在工作”和“雇主有多少岗位”两个问题。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="住户与单位调查差异，可横向滚动">
          <table className="concept-table">
            <caption>比较前先冻结 target、frame、unit、reference period 与 revision</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">Household</th><th scope="col">Establishment</th></tr></thead>
            <tbody>
              <tr><th scope="row">核心单位</th><td>人及其活动状态</td><td>受薪岗位、工资与工时记录</td></tr>
              <tr><th scope="row">典型优势</th><td>参与、自雇、人口群体与多状态</td><td>行业岗位、雇主工资册与较大样本</td></tr>
              <tr><th scope="row">主要误差</th><td>住户抽样、代理回答、人口控制</td><td>单位抽样、迟报、企业出生死亡、benchmark</td></tr>
              <tr><th scope="row">不能做的事</th><td>把一人两份工作数成两个人</td><td>推断有多少独立的人获得工作</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国 CPS/CES 只是最熟悉的例子，其他国家可能使用行政 payroll、企业调查和住户调查的不同组合。严谨报告应同时列估计值、抽样或非抽样不确定性、基准修订和人口断点，而不是只选择更符合叙事的一条线。<Cite n={2} /><Cite n={5} /><Cite n={6} /><Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="vacancies">
        <p className="section-kicker">12 · Job Vacancy</p>
        <h2>Vacancy 是雇主愿意在一定条件下填补的未占岗位存量，不是招聘广告条数、未来雇佣量或无条件劳动需求。</h2>
        <p>
          统计定义通常要求岗位存在、可在规定期限内开始、雇主正采取外部招聘行动。一个岗位可在多个平台刊登，广告数因此可能重复；“evergreen” posting 可能不急于填补；内部岗位、猎头搜寻或未在线发布的 vacancy 又可能缺失。调查记录期末存量或季度平均的选择，也会改变 vacancy rate。<Cite n={9} /><Cite n={18} /><Cite n={19} /><Cite n={54} />
        </p>
        <div className="equation-card">
          <span>Vacancy rate 的分母必须注明</span>
          <div>v<sup>JOLTS</sup> = V/(E<sup>jobs</sup>+V)；　θ = V/U</div>
          <p>前者把空缺放在岗位总需求中，后者是匹配模型的市场紧度；它们的分母不同，数值和经济含义不能互换。</p>
        </div>
      </section>

      <section className="lesson-section" id="hires-separations">
        <p className="section-kicker">13 · Hires、Quits、Layoffs 与 Other Separations</p>
        <h2>净岗位变化只是雇佣与离职的差；相同净值可以来自低周转停滞或高周转重配。</h2>
        <div className="equation-card">
          <span>岗位存量桥</span>
          <div>Jobs<sub>t</sub> = Jobs<sub>t−1</sub> + Hires<sub>t</sub> − Separations<sub>t</sub></div>
          <p>Separations 可进一步分 quits、layoffs/discharges 与 other separations。该式是单位账本恒等，不识别每一流量背后的需求、供给或制度冲击。</p>
        </div>
        <p>
          Quits 往往随有吸引力的外部机会增加，但也受行业、远程工作、退休和数据口径影响；layoffs 更接近雇主发起的关系终止，却不等于所有失业流入，因为合同结束、新进入与 N→U 也会改变 U。Hires 高可能代表扩张，也可能只是高离职后的替补。把四项合读，才能区分 labor hoarding、churn 和净扩张。<Cite n={9} /><Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="hours-fte">
        <p className="section-kicker">14 · Headcount、Hours 与 Full-time Equivalent</p>
        <h2>企业可先调整加班、排班和兼职比例，再调整人数；就业人数稳定不等于劳动投入或收入稳定。</h2>
        <p>
          Headcount 让每个人权重相同，hours 把实际工作时间相加，FTE 则按一个约定的标准工时把岗位换算。需求初降时，企业可能先取消加班或缩短班次以保留匹配资本；恢复初期又可能先增加工时，再招聘新员工。于是 aggregate hours 常比 headcount 更早变化，但它也受日历、休假、罢工和报告误差影响。<Cite n={5} /><Cite n={35} /><Cite n={36} />
        </p>
        <div className="precision-note"><span>与 3.01 的边界</span><p>3.01 把 hours 作为生产与生产率的投入；本节只解释为什么雇主在岗位、人数与工时间选择，以及这些边际怎样影响劳动力市场状态。</p></div>
      </section>

      <section className="lesson-section" id="wage-object-map">
        <p className="section-kicker">15 · Wage Object Map</p>
        <h2>工资率、实际收入、固定岗位工资、总薪酬和单位劳动成本回答不同问题；“工资增长”必须先选择对象。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="工资指标对象地图，可横向滚动">
          <table className="concept-table">
            <caption>同一时期五个工资指标可以同时给出不同增速</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">典型分子</th><th scope="col">主要用途</th></tr></thead>
            <tbody>
              <tr><th scope="row">Wage rate</th><td>每小时或每期约定基本工资</td><td>岗位价格与合同调整</td></tr>
              <tr><th scope="row">Earnings</th><td>实际收到的工资、加班和奖金</td><td>家庭现金收入</td></tr>
              <tr><th scope="row">Fixed-job index</th><td>同类岗位的工资价格</td><td>尽量隔离就业构成</td></tr>
              <tr><th scope="row">Compensation</th><td>现金工资加雇主福利与缴费</td><td>企业完整劳动成本</td></tr>
              <tr><th scope="row">ULC</th><td>劳动报酬相对实际产出</td><td>单位产出的劳动成本接口</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Average hourly earnings 可因岗位和人员构成变化；ECI、WPI 等固定岗位指标有意冻结部分构成；AWE、PAYE RTI 等实际支付指标又会受工时、奖金和迟报影响。ULC 还需要生产率分母，完整机制已在 3.02。报告“工资加速”而不说明 cash/total、mean/median、fixed/current composition、nominal/real、hourly/weekly 和季调状态，几乎没有可检验含义。<Cite n={5} /><Cite n={12} /><Cite n={13} /><Cite n={20} /><Cite n={26} /><Cite n={30} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="cash-total-compensation">
        <p className="section-kicker">16 · Cash Wage 与 Total Compensation</p>
        <h2>工人看到的现金工资、税后收入和企业承担的总薪酬可以向不同方向变化。</h2>
        <div className="equation-card">
          <span>劳动成本的最小账本</span>
          <div>Compensation = cash wages + employer benefits + employer social contributions</div>
          <p>这是一项覆盖恒等；不同调查对奖金、股权、养老金、带薪休假和法定缴费的估值与时点可能不同。</p>
        </div>
        <p>
          若现金工资涨 3%、福利成本涨 8%，而初始成本权重为 70/30，总薪酬的一阶增幅约 4.5%；员工工资单仍可能只显示 3%。税率或福利资格变化还会使 net take-home pay 与 employer cost 进一步分离。因此家庭需求研究更关心可支配收入，企业岗位决策更关心完整成本，工资形成研究则可能更关心基本工资率。<Cite n={12} /><Cite n={13} /><Cite n={20} /><Cite n={85} />
        </p>
      </section>

      <section className="lesson-section" id="mean-median-quantiles">
        <p className="section-kicker">17 · Mean、Median 与 Quantiles</p>
        <h2>均值让高薪岗位贡献更多金额，中位数观察排序中心，分位数揭示分布；三者不能互相校正成唯一真值。</h2>
        <p>
          平均工资是总工资除以相应人数或工时，容易被少数高薪岗位和就业构成影响；中位数是排序后居中的人或岗位，对尾部较稳健，却不反映工资总额；分位数增长可以显示低、中、高端调整是否同步。固定岗位指数则回答另一问题：在岗位质量尽量不变时，岗位价格怎样变化。分布指标之间的差异本身就是关于重配、压缩或扩散的信息。<Cite n={12} /><Cite n={14} /><Cite n={26} /><Cite n={31} /><Cite n={37} />
        </p>
        <p>
          例如低薪就业大量消失时，留存样本的平均工资可上升，而每个留任者的工资完全没变；若底部分位工资真实上涨，中位数可能上升而平均数受高薪行业收缩影响较小。任何工资叙事都应同时报告统计单位、权重和样本进出。
        </p>
      </section>

      <section className="lesson-section" id="wage-composition">
        <p className="section-kicker">18 · Composition Effect</p>
        <h2>聚合工资增长等于组内工资变化与就业权重重配的共同结果；构成效应可以在没有个人加薪时制造“工资上涨”。</h2>
        <div className="equation-card">
          <span>两组平均工资的离散桥</span>
          <div>W̄<sub>t</sub> = s<sub>L,t</sub>W<sub>L,t</sub> + s<sub>H,t</sub>W<sub>H,t</sub>，　s<sub>L,t</sub>+s<sub>H,t</sub>=1</div>
          <p>平均工资变化可来自 W_L、W_H 的组内变化，也可来自就业份额 s 的变化；组的定义、工时权重与人员进出必须固定。</p>
        </div>
        <p>
          低薪服务岗位在衰退初期集中流失时，s<sub>H</sub> 上升会推高平均工资；复工时低薪岗位回归又可能压低平均工资，即使每个人都获得加薪。固定职业—行业篮子的 ECI 或固定岗位 WPI 试图减少这种影响，但也有自己的权重和岗位替换规则。最稳健的做法是把 current-composition earnings、fixed-job index 和分位数共同展示。<Cite n={12} /><Cite n={13} /><Cite n={14} /><Cite n={31} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="labor-data-clock">
        <p className="section-kicker">19 · Reference、Pay、Release、Revision 与 Vintage</p>
        <h2>劳动力数据有参考周、发薪期、调查截止、发布日期和修订版本多只时钟；实时判断必须保存当时真正可见的信息集。</h2>
        <p>
          住户就业可能指某一参考周，payroll jobs 可能指包含特定日期的 pay period，vacancy 可能是月末存量，hires 是全月流量，工资又可能按周、月或季度发布。初值随后会因迟报、季调重估、人口控制、企业 benchmark 与调查方法变化而修订。把不同参考期在同一“本月”标签下堆叠，会创造虚假的领先与滞后。<Cite n={2} /><Cite n={6} /><Cite n={10} /><Cite n={11} /><Cite n={16} /><Cite n={22} /><Cite n={26} /><Cite n={36} />
        </p>
        <div className="practice-card"><span>实时证据护照</span><p>每个观测至少保存 object、unit、population、reference period、seasonal-adjustment status、release timestamp、revision status 与 as-of vintage。跨国比较还要记录制度断点。</p></div>
      </section>

      <section className="lesson-section" id="unemployment-stock-identity">
        <p className="section-kicker">20 · Unemployment Stock Identity</p>
        <h2>失业存量由进入与离开失业的总流量共同生成；净变化很小不表示市场没有发生大量重配。</h2>
        <div className="equation-card">
          <span>失业存量的精确离散账本</span>
          <div>U<sub>t</sub> = U<sub>t−1</sub> + F<sup>E→U</sup><sub>t</sub> + F<sup>N→U</sup><sub>t</sub> − F<sup>U→E</sup><sub>t</sub> − F<sup>U→N</sup><sub>t</sub></div>
          <p>每项都是期间人数流量；分类修订、短期多次转移和调查匹配误差会使实测桥需要调整，但恒等式固定了必须解释的入口和出口。</p>
        </div>
        <p>
          若一月有 100 万人从 E 进入 U，同时 100 万人从 U 找到工作，U 可以不变，但风险和机会都很高；若两边都只有 10 万人，净值同样为零，却是低流动停滞。政策、家庭和企业面对的状态显然不同。失业率变化必须拆为 separation、job finding、参与流入和退出，而不是把净存量当完整机制。<Cite n={47} /><Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="transition-matrix">
        <p className="section-kicker">21 · E/U/N Transition Matrix</p>
        <h2>三状态转移矩阵把九种留存与流动概率放在同一系统中，避免只研究 U 而丢掉参与边际。</h2>
        <div className="equation-card">
          <span>行条件转移矩阵</span>
          <div>p<sub>ij,t</sub> = Pr(S<sub>t</sub>=j | S<sub>t−1</sub>=i)，　Σ<sub>j∈(E,U,N)</sub>p<sub>ij,t</sub>=1</div>
          <p>每一行以期初状态 i 为风险集，元素是转到期末状态 j 的概率；时间聚合会遗漏期内多次转移，估计时要说明匹配间隔。</p>
        </div>
        <p>
          U→E 上升通常改善找工机会，但若 E→N 同时因退休增加，就业率未必相应上升；E→E 跳槽不改变 E 存量，却会改变工资和岗位配置；N→E 直接就业又可能绕过观测到的 U。矩阵揭示“同一失业率”可以由完全不同的状态循环维持，也使人口结构和周期流动可被分开。<Cite n={49} /><Cite n={50} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="job-finding">
        <p className="section-kicker">22 · Job-finding Hazard</p>
        <h2>Job-finding rate 测失业者在给定期间离开 U 进入 E 的条件概率；它同时反映岗位机会、搜索努力、匹配和求职者构成。</h2>
        <div className="equation-card">
          <span>离散 job-finding rate</span>
          <div>f<sub>t</sub> = F<sup>U→E</sup><sub>t</sub>/U<sub>t−1</sub></div>
          <p>分子和分母必须使用相容调查与时间窗口；月度概率不是连续时间 hazard 本身，平均失业期限也只有在稳定、同质等强条件下才近似 1/f。</p>
        </div>
        <p>
          f 下降可能是 vacancy 减少、招聘速度下降、地域技能错配增加，或 U 中长期失业者权重上升；即使每类求职者的 finding rate 不变，构成变化也能让聚合 f 下降。因此“matching efficiency 恶化”只是竞争性解释之一，需要 vacancy、recruiting intensity 和异质性调整共同识别。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="separation">
        <p className="section-kicker">23 · Separation Hazard</p>
        <h2>从就业进入失业的风险既包含需求冲击，也受合同到期、行业重配和统计分类影响；它与单位调查的 separations 不是同一个分母。</h2>
        <div className="equation-card">
          <span>Person-side separation rate</span>
          <div>s<sub>t</sub> = F<sup>E→U</sup><sub>t</sub>/E<sub>t−1</sub></div>
          <p>该式只数 E→U；E→N、E→E 和单位调查中的岗位离职需要另列。把所有 separations 当作失业流入会重复或遗漏。</p>
        </div>
        <p>
          衰退可以通过 s 急升形成失业，也可以主要通过 f 下降让失业者更难离开；不同历史时期和国家的相对贡献不同。企业 labor hoarding 会在需求下降初期压低裁员，却可能先减少 hours、vacancies 和 hires。只看 layoffs 低便宣布市场强劲，会忽略招聘冻结造成的慢性失业积累。<Cite n={47} /><Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="recall">
        <p className="section-kicker">24 · Recall 与 Permanent Job Loss</p>
        <h2>等待原雇主召回与永久失去岗位的失业者面对不同的搜索、期限和工资路径，不能被同一 U 存量抹平。</h2>
        <p>
          Temporary layoff 的工人与原雇主保留某种关系或召回预期，可能少搜索新岗位并较快回到 E；permanent job loser 必须建立新匹配，面对技能折旧、地域转换和更大工资损失。一次衰退中 recall 占比上升，会提高聚合 U→E，却不一定代表新岗位创造更强。疫情等特殊冲击尤其需要把 recall 和新匹配分开。<Cite n={55} /><Cite n={59} />
        </p>
        <div className="precision-note"><span>同一“找到工作”有两种机制</span><p>召回恢复旧匹配，新雇建立新匹配。两者都进入 U→E，却对招聘成本、岗位重配、工资议价和持久性提供不同信息。</p></div>
      </section>

      <section className="lesson-section" id="employer-employer">
        <p className="section-kicker">25 · Employer-to-employer Flow</p>
        <h2>E→E 跳槽不改变就业存量，却是工人外部选择、岗位重配和工资增长的重要边际。</h2>
        <p>
          一名工人从 A 企业直接转到 B 企业时，宏观 E 不变，两个单位可能分别记录 separation 与 hire。扩张期有更多企业竞争已就业工人，E→E 和 quits 往往上升，工资增长可由外部 offer 触发；衰退期 job ladder 冻结，即使裁员仍低，工人的谈判威胁点也会变弱。只看净就业会完全遗漏这条渠道。<Cite n={58} /><Cite n={60} />
        </p>
        <p>
          E→E 的测量需要跨期匹配个人和雇主，易受代理回答、短期重叠岗位和匹配误差影响。它不是所有 quits 的同义词，也不能从单位净岗位变化直接恢复。可靠判断应把 matched-person flows、quits 和新雇工资共同观察。
        </p>
      </section>

      <section className="lesson-section" id="job-ladder">
        <p className="section-kicker">26 · Job Ladder</p>
        <h2>工人会从失业进入较低匹配，再沿岗位梯子转向更高工资或更合适企业；周期会改变这条梯子的运行速度。</h2>
        <p>
          在有 on-the-job search 的市场里，就业不是终点。企业异质性、offer 到达率与反报价决定工人能否从低生产率或低工资匹配向上移动；快速增长的高薪企业在扩张期从其他企业吸引工人。衰退时 vacancy 与 offer 减少，E→E 先降，留在较差匹配中的工人增加，聚合工资增速也可能在没有名义降薪时放缓。<Cite n={60} /><Cite n={73} /><Cite n={74} />
        </p>
        <div className="precision-note"><span>工资增长不只来自在岗加薪</span><p>同一人的工资路径可由内部晋升、外部跳槽、奖金和工时共同形成；cross-sectional average 又叠加谁进入、谁退出的构成。</p></div>
      </section>

      <section className="lesson-section" id="matching-function">
        <p className="section-kicker">27 · Matching Function</p>
        <h2>求职者和职位空缺不会一对一即时成交；匹配函数把搜索双方与匹配技术转成新雇佣流量。</h2>
        <div className="equation-card">
          <span>常见 Cobb–Douglas 匹配表示</span>
          <div>M<sub>t</sub> = A<sub>t</sub>U<sub>t</sub><sup>α</sup>V<sub>t</sub><sup>1−α</sup>，　0&lt;α&lt;1</div>
          <p>M、U、V 必须处于同一市场和期间；A 是在给定函数形式与构成后估计的匹配效率残差，不是可直接观察的技术水平。</p>
        </div>
        <p>
          地域、技能、行业、岗位质量、招聘强度、搜索努力和平台技术都会改变实际 M。标准函数常假定规模报酬不变，便于把市场紧度单独提出，但实证中的聚合与异质性可能破坏这一性质。模型是组织 congestion 与外部性的基准，不是把每个未填岗位自动归因于“技能错配”的机器。<Cite n={40} /><Cite n={41} /><Cite n={50} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="market-tightness">
        <p className="section-kicker">28 · Market Tightness θ = V/U</p>
        <h2>市场紧度对工人与企业产生方向相反的拥挤：V/U 越高，求职者通常越容易找到工作，每个岗位却越难填。</h2>
        <div className="equation-card">
          <span>同一个匹配流量的双边概率</span>
          <div>θ = V/U；　f(θ)=M/U；　q(θ)=M/V=f(θ)/θ</div>
          <p>f 是工人 finding rate，q 是岗位 filling rate。在标准匹配函数下 f 随 θ 上升、q 随 θ 下降；具体弹性由 α、A、市场边界和时间单位决定。</p>
        </div>
        <p>
          V 增加可能同时让总 matches 增加、每个求职者机会改善，却降低单个 vacancy 的 yield。企业感到“招人更难”与工人感到“更容易找到工作”可以同时成立。θ 也不是无需处理的充分统计量：U 中求职者构成、online postings 的重复和 recruiting intensity 都会改变它与真实选择集的关系。<Cite n={41} /><Cite n={42} /><Cite n={43} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="finding-filling">
        <p className="section-kicker">29 · Finding Rate 与 Filling Rate</p>
        <h2>同一份 hire 从工人侧是一人找到工作，从企业侧是一个岗位被填；两个 rate 的分母不同，不能比较高低判断谁更紧。</h2>
        <p>
          若 M=80、U=100、V=400，则 finding rate 为 80%，filling rate 只有 20%。这不是矛盾：求职者少于岗位时，每名求职者可以很快获得工作，但大量 vacancy 仍未填。反过来，U 很多而 V 很少时，岗位容易收到人选，工人却难找到工作。只有同时报告 M、U、V 和期间，才能解释两个比例。<Cite n={41} /><Cite n={51} />
        </p>
        <div className="practice-card"><span>双边诊断</span><p>工人侧问“给定 U，有多少进入 E”；企业侧问“给定 V，有多少形成 hire”。任何用 V/U 直接推出工资或通胀的叙事，都还缺岗位质量、议价、生产率与制度。</p></div>
      </section>

      <section className="lesson-section" id="recruiting-intensity">
        <p className="section-kicker">30 · Recruiting Intensity</p>
        <h2>Vacancy 只是宣布要招人；工资报价、广告、筛选速度和 HR 投入决定企业实际投入了多少招聘努力。</h2>
        <p>
          两家企业各有十个 vacancy，一家提高工资、扩大广告渠道并快速面试，另一家保留低报价和漫长审批，它们的 hires 可以完全不同。Recruiting intensity 会随企业增长目标和市场状态变化，使 vacancy yield 不只由 V/U 决定。在线 posting 数量的上升也可能来自重复发布或更低发布成本，而不是等比例的真实招聘投入。<Cite n={51} /><Cite n={54} />
        </p>
        <p>
          因此 Beveridge curve 外移或 matching residual 下降，可能部分是企业行为改变，而非工人技能突然不匹配。可观察的 offer wage、time-to-fill、application handling、posting duration 与 hires per vacancy 能帮助区分，但每项都有选择性和平台覆盖边界。
        </p>
      </section>

      <section className="lesson-section" id="beveridge-movement">
        <p className="section-kicker">31 · Beveridge Curve Movement</p>
        <h2>沿 Beveridge curve 的反向移动描述常见周期：需求收紧时 vacancy 高、失业低，需求走弱时方向相反。</h2>
        <p>
          在匹配技术、劳动力构成和制度大致稳定时，企业扩张提高 V，更多 U 被匹配，经济从高失业低空缺向低失业高空缺移动；衰退则沿相反方向。这一图形是 stocks 的联合状态，不是因果模型，也不自动告诉我们冲击来自需求、供给还是政策。时间聚合、vacancy 口径和滞后都能让短期轨迹形成环。<Cite n={39} /><Cite n={53} />
        </p>
        <div className="precision-note"><span>Movement 不是 policy menu</span><p>历史负相关不保证央行能任意选择一点，也不表示降低 vacancy 必然以固定比例提高 unemployment；预期、匹配效率和供给会一起变化。</p></div>
      </section>

      <section className="lesson-section" id="beveridge-shift">
        <p className="section-kicker">32 · Beveridge Curve Shift</p>
        <h2>同一失业率对应更多 vacancy 提示曲线外移，但仅凭两个 aggregate stocks 不能识别是错配、构成、招聘强度还是测量变化。</h2>
        <p>
          外移可以来自行业或地域需求与求职者不匹配、长期失业者占比上升、参与人口构成改变、企业降低 recruiting intensity，或 online postings 更易发布；内移则可能反映匹配改善或相反构成。每个解释对工资、持续时间和政策含义不同。必须继续检查 hires、filling rate、job-finding、duration、行业地域矩阵与平台覆盖。<Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={54} />
        </p>
        <p>
          “曲线外移=结构性失业”是一个标签，不是已识别机制。结构与周期也会交互：大衰退先改变行业需求，持续失业再改变搜索与技能，最终使原本周期冲击具有持久后果。
        </p>
      </section>

      <section className="lesson-section" id="duration-dependence">
        <p className="section-kicker">33 · Long-term Unemployment 与 Duration Dependence</p>
        <h2>失业越久找工率越低，既可能是真实状态依赖，也可能只是低 finding 类型逐渐留在样本中。</h2>
        <p>
          真正 duration dependence 可能来自技能折旧、网络弱化、雇主筛选、心理与搜索资源下降；动态选择则是高 finding 求职者更早离开 U，留下原本更难匹配的人。观察到期限与 finding 的负相关不能单独区分两者。召回、行业、年龄和宏观状态也会改变期限分布。<Cite n={55} /><Cite n={56} />
        </p>
        <p>
          这一区分决定反事实：若主要是选择，改善岗位机会可能迅速吸收部分长期失业；若存在强状态依赖，晚干预会造成更大持久损失。识别需要可比求职者、外生机会变化或结构模型，而不是把 duration coefficient 直接命名为技能损失。
        </p>
      </section>

      <section className="lesson-section" id="participation-demographics">
        <p className="section-kicker">34 · Participation Margin 与 Demographics</p>
        <h2>参与率同时受周期机会和人口结构影响；老龄化、入学、照护、健康与迁移不能全部压缩成 labor slack。</h2>
        <p>
          更好的岗位与工资会吸引部分 N 进入 LF，形成 procyclical participation；退休年龄结构、教育年限、育儿制度、健康冲击和移民又会改变长期参与趋势。同一 aggregate LFPR 下降，可能是各年龄组参与都下降，也可能只是高参与年龄组权重降低。应先做组内率与人口权重分解，再把剩余部分解释为周期。<Cite n={57} /><Cite n={102} /><Cite n={104} />
        </p>
        <div className="equation-card">
          <span>组别参与率聚合</span>
          <div>LFPR<sub>t</sub> = Σ<sub>g</sub>ω<sub>g,t</sub>LFPR<sub>g,t</sub></div>
          <p>变化可来自组内参与率或人口权重 ω；组别划分与人口控制本身也会修订。</p>
        </div>
      </section>

      <section className="lesson-section" id="derived-labor-demand">
        <p className="section-kicker">35 · Derived Labor Demand</p>
        <h2>企业对劳动的需求来自岗位带来的预期增量价值，而不是对“就业”本身的偏好。</h2>
        <div className="equation-card">
          <span>岗位创造的最小阈值</span>
          <div>Expected marginal revenue product ≥ wage + benefits + hiring/adjustment cost</div>
          <p>两边必须使用相容期限和风险调整；边际收入产出取决于需求、价格、资本、组织与生产率，成本还包括招聘和未来解雇承诺。</p>
        </div>
        <p>
          产品需求、售价或生产率上升会提高岗位价值，但企业也可用加班、资本、外包或自动化替代招聘；融资约束和不确定性会使正净现值岗位仍被延后。工资不是唯一决定变量，观测到 employment–wage 关系也不能自动识别劳动需求曲线。3.01 已讲生产率与产出，本节只把岗位价值作为搜索和合同的输入。<Cite n={41} /><Cite n={79} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="reservation-wage">
        <p className="section-kicker">36 · Reservation Wage 与 Job Value</p>
        <h2>工人接受工作的门槛不仅是现金工资，还包含搜寻价值、通勤、风险、工时、福利和岗位的未来跳板价值。</h2>
        <p>
          保留工资是令接受与继续搜索的预期价值相等的阈值。失业保险、家庭收入、流动资产、照护责任和预期 offer 到达率会改变等待能力；远程工作、稳定性、培训和排班等非工资属性会改变同一现金工资的总价值。观察到较长搜索不能简单等同“不愿工作”，较低接受工资也不必表示偏好较低。<Cite n={40} /><Cite n={73} /><Cite n={74} />
        </p>
        <div className="precision-note"><span>阈值是个体状态变量</span><p>聚合“reservation wage”受求职者构成和调查假设影响；它不是政策可直接观察或统一设定的一条工资底线。</p></div>
      </section>

      <section className="lesson-section" id="match-surplus">
        <p className="section-kicker">37 · Match Surplus</p>
        <h2>一段雇佣关系创造的总剩余，是工人获得的就业价值与企业获得的岗位价值相对各自外部选择之和。</h2>
        <div className="equation-card">
          <span>匹配剩余的价值表示</span>
          <div>S = (W − U<sup>outside</sup>) + (J − V<sup>outside</sup>)</div>
          <p>W、U、J、V 是贴现价值而非当期现金流；符号只表示工人就业/外部状态与企业已填/空缺状态，具体模型会加入税、福利、解雇和资本。</p>
        </div>
        <p>
          高生产率、强需求或较低招聘成本可扩大 S；更好的失业机会或更多外部 offer 会提高工人的威胁点，改变剩余如何分配。工资因此不只由当期边际产品决定，也不只是“供需交点”；它是合同、外部选择和持续关系的结果。总剩余为正是匹配可持续的必要条件，但不会唯一决定工资。<Cite n={41} /><Cite n={61} /><Cite n={63} />
        </p>
      </section>

      <section className="lesson-section" id="nash-bargaining">
        <p className="section-kicker">38 · Nash Bargaining Baseline</p>
        <h2>Nash 解把剩余与议价权分开：更大剩余和更强工人议价力都能提高工资，但它们是两种不同机制。</h2>
        <div className="equation-card">
          <span>抽象的剩余分配问题</span>
          <div>max<sub>w</sub> (W(w)−U)<sup>η</sup>(J(w)−V)<sup>1−η</sup>，　0&lt;η&lt;1</div>
          <p>η 是模型中的议价权参数，解依双方价值函数和可承诺合同；它不是工会覆盖率、收入份额或工资弹性的直接观测值。</p>
        </div>
        <p>
          生产率上升可扩大 S，即使 η 不变也提高工资；失业机会改善可抬高 U，使工人获得更多份额；工会、制度或集中度又可能改变实际 bargaining protocol。Nash bargaining 是清楚的基准，却不能预设现实所有工资逐岗位即时谈判，也不能从 wage share 反推唯一 η。<Cite n={61} /><Cite n={62} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="threat-point">
        <p className="section-kicker">39 · Threat Point 与 Credibility</p>
        <h2>失业率只有在谈判破裂真的把双方推向相应外部状态时才进入威胁点；不可信的永久分离不能机械决定每次工资。</h2>
        <p>
          传统 Nash 模型常把谈判失败视为匹配立即破裂，失业价值因此强烈影响工资；交替报价模型可把暂时延迟生产而非永久分离设为当期威胁，使工资对 headline unemployment 的敏感度更小。现实中的长期关系、内部工资结构、法律保护和重新招聘成本都会改变哪种威胁可信。<Cite n={45} /><Cite n={63} /><Cite n={64} />
        </p>
        <p>
          这解释了为什么 unemployment 与 wage growth 的经验关系可能跨制度和时期变化，而不意味着 slack 完全无关。正确问题不是“失业率是否进入工资”，而是它通过哪种外部选择、对哪类工人、在什么合同重置时点进入。
        </p>
      </section>

      <section className="lesson-section" id="posted-wage">
        <p className="section-kicker">40 · Posted Wage 与 On-the-job Search</p>
        <h2>企业可以先报价、工人再决定是否接受；即使相似工人和岗位并存，搜索摩擦也能让工资分散持续存在。</h2>
        <p>
          在 wage-posting 模型中，企业权衡较高工资带来的更快招聘、更低离职与更高成本；工人不断收到 offer，并可能从低薪企业跳到高薪企业。由于 offer 到达不即时、工人无法同时观察所有岗位，低工资企业仍可能保留一部分员工。工资分散因此不必全部来自技能差异，也不必每份工资都是逐人 Nash 谈判。<Cite n={73} /><Cite n={74} />
        </p>
        <p>
          现实还存在内部工资带、集体协议、最低工资和个性化反报价。Posted wage 是组织机制的一端，不是排除议价的普遍事实。识别需要 vacancy wage、实际入职工资、留存和 offer 数据，而不能从横截面工资方差唯一反推企业市场力。
        </p>
      </section>

      <section className="lesson-section" id="efficiency-fair-wage">
        <p className="section-kicker">41 · Efficiency Wage 与 Fair Wage</p>
        <h2>工资也可能是企业用来改变努力、留任、招聘和公平感知的组织工具，而不只是市场清算价格。</h2>
        <p>
          当努力难以完全观察、离职与招聘昂贵，或团队内部公平影响合作时，企业可能支付高于外部即时替代工资的报酬。较高工资可降低 shirking、提高申请者质量、减少 quits 或维持士气；因此在需求下降时，企业可能先减岗位和工时而不是普遍降基本工资。效率工资与公平工资给出不同微观理由，不能被合并成一个可直接估计的“士气参数”。<Cite n={65} /><Cite n={66} /><Cite n={67} />
        </p>
        <div className="precision-note"><span>反例边界</span><p>观察到高工资与高生产率共存，既可能是工资提高努力，也可能是高生产率企业能支付更多、选择了高技能工人，或共同受第三因素影响；相关不识别方向。</p></div>
      </section>

      <section className="lesson-section" id="monopsony">
        <p className="section-kicker">42 · Monopsony 与 Wage-setting Power</p>
        <h2>即使有许多雇主，搜索摩擦、通勤和岗位差异也可让单个企业面对向上倾斜的劳动供给，从而拥有工资设定力。</h2>
        <div className="equation-card">
          <span>简化的 markdown 条件</span>
          <div>MRPL = w(1 + 1/ε<sub>L,w</sub>)，　ε<sub>L,w</sub> &gt; 0</div>
          <p>在静态单买方基准中，ε 是企业层劳动供给对工资的弹性；弹性越低，工资与边际收益产品的楔子越大。现实动态模型还要处理招聘、离职和异质性。</p>
        </div>
        <p>
          Local concentration 可以强化这种力量，却不是同义词：市场边界如何划分、在线 vacancy 覆盖和企业招聘网络都会改变 concentration measure。低 quits 对工资的响应、较长 vacancy duration 或 wage posting evidence 可提供补充。Monopsony 也不推出所有提高工资地板都无就业成本；效果取决于地板位置、产品需求和其他调整边际。<Cite n={73} /><Cite n={81} /><Cite n={82} />
        </p>
      </section>

      <section className="lesson-section" id="rent-sharing">
        <p className="section-kicker">43 · Firm Rents 与 Rent Sharing</p>
        <h2>企业盈利冲击可以通过议价、留人成本和内部工资规范进入工资，但利润—工资共动不等于已识别的剩余分享。</h2>
        <p>
          需求、生产率或市场势力提高企业可分配租金时，工人可通过谈判、跳槽威胁、工会合同或企业主动留任分享部分收益；负面冲击又可能通过奖金、招聘工资和岗位数量先调整。工资对企业冲击的敏感度会随工人可替代性、资本强度、集体议价和劳动市场集中度变化。<Cite n={75} /><Cite n={76} /><Cite n={77} /><Cite n={78} /><Cite n={85} />
        </p>
        <p>
          实证上，高利润企业也可能雇用更高技能工人或处于高工资地区。只有控制 worker effects、firm effects、sorting，并找到可信的企业租金冲击，才能接近 rent-sharing estimand。会计利润、经济租金与当前现金流也必须分开。
        </p>
      </section>

      <section className="lesson-section" id="worker-firm-sorting">
        <p className="section-kicker">44 · Worker–Firm Sorting</p>
        <h2>高工资可能来自高工资工人、高工资企业以及二者正向匹配；平均工资差不能全部归为“技能”。</h2>
        <div className="equation-card">
          <span>双向固定效应的描述框架</span>
          <div>ln w<sub>it</sub> = α<sub>i</sub> + ψ<sub>J(i,t)</sub> + x′<sub>it</sub>β + ε<sub>it</sub></div>
          <p>α 是工人固定效应，ψ 是企业固定效应；模型依赖跨企业流动和加性可分假设，固定效应不是纯结构能力或企业因果溢价。</p>
        </div>
        <p>
          高 α 工人更集中于高 ψ 企业时形成 positive sorting；企业间工资差与企业内分布共同决定总不平等。行业工资增长可因高薪企业扩张或工人重新排序，而不是岗位价格普遍上涨。固定岗位指数、matched employer–employee data 和 movers design 各自观察不同层面，不能互换。<Cite n={75} /><Cite n={76} /><Cite n={77} /><Cite n={78} />
        </p>
      </section>

      <section className="lesson-section" id="unions-bargaining">
        <p className="section-kicker">45 · Unions、Collective Bargaining 与 Contract Coverage</p>
        <h2>工会覆盖、谈判层级、协调程度和合同期限共同改变工资调整的对象、频率与外部性。</h2>
        <p>
          企业级谈判更贴近单一企业的剩余，行业或全国协调可把竞争外部性和宏观条件纳入；multi-year agreement 会让工资对当期冲击滞后，并通过 reopeners、indexation 或一次性支付调整。Union membership 与 collective-bargaining coverage 也不是同一比例。相同覆盖率在分散和协调制度下可能产生不同 wage drift、就业与通胀接口。<Cite n={64} /><Cite n={69} /><Cite n={80} /><Cite n={100} />
        </p>
        <div className="precision-note"><span>制度不是单个 dummy</span><p>跨国回归中的“union”系数压缩了覆盖、延伸、合同长度、协调和罢工制度；它不能替代具体工资形成链。</p></div>
      </section>

      <section className="lesson-section" id="minimum-wage">
        <p className="section-kicker">46 · Minimum Wage 与 Wage Floor</p>
        <h2>最低工资是否具有约束力，取决于它相对工资分布、企业工资设定力和其他调整边际的位置。</h2>
        <p>
          若工资地板低于多数有效报价，它几乎不改变合同；进入低薪分布后，可提高受影响岗位工资并压缩底部差距。企业可能通过价格、利润、就业、工时、福利、招聘标准、自动化或进入退出分摊冲击。在有 monopsony 的区间，小幅提高地板甚至可同时提高工资与就业；超过相应区间后，需求与替代约束仍会增强。<Cite n={81} /><Cite n={83} /><Cite n={84} />
        </p>
        <p>
          经验结论是局部处理效应：特定幅度、工资分布、地区与时期的结果不能变成所有最低工资水平的统一弹性。研究应报告 bunching、受影响份额、spillover 和多种调整边际，而不是只用 aggregate employment 一个结果变量。
        </p>
      </section>

      <section className="lesson-section" id="payroll-tax-benefits">
        <p className="section-kicker">47 · Payroll Tax、Benefits 与 Non-wage Cost</p>
        <h2>税费和福利改变企业用工成本与工人净收入之间的楔子；法定归属不决定经济负担最终落在哪里。</h2>
        <div className="equation-card">
          <span>劳动楔子的最小表示</span>
          <div>Employer cost = gross cash wage + benefits + employer levies；　take-home = gross wage − employee taxes</div>
          <p>制度可把缴费名义上分给不同一方，但长期归宿取决于劳动供需弹性、工资刚性、最低工资和租金分享。</p>
        </div>
        <p>
          减免 payroll tax 可能进入工人工资、企业利润或就业，比例随市场结构和政策目标群体而变；福利成本上升可使 compensation 增长快于现金工资。于是“工资温和”不保证企业劳动成本温和，“企业成本上升”也不保证员工实际可支配收入增加。<Cite n={13} /><Cite n={20} /><Cite n={85} />
        </p>
      </section>

      <section className="lesson-section" id="nominal-wage-rigidity">
        <p className="section-kicker">48 · Downward Nominal Wage Rigidity</p>
        <h2>企业更常冻结基本工资而不是普遍下调名义工资；调整因此可能转向奖金、工时、新雇工资和岗位数量。</h2>
        <p>
          降薪可能损害士气、触发离职、违反内部公平或合同，工资变化分布因而在零附近堆积。通胀较高时，名义工资冻结仍可降低实际工资；低通胀时，同样刚性更限制实际调整。测量误差、工资圆整和未观察奖金也会制造零点堆积，必须用行政记录和跨国证据交叉。<Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} /><Cite n={71} /><Cite n={72} />
        </p>
        <p>
          刚性不是“工资永远不降”：岗位转换、新雇合同、奖金、工时、福利和失业都能降低总劳动收入。它改变的是调整的边际和非线性，也解释了工资曲线为何在低通胀环境更可能弯曲。
        </p>
      </section>

      <section className="lesson-section" id="incumbent-new-hire">
        <p className="section-kicker">49 · Incumbent Wage 与 New-hire Wage</p>
        <h2>新雇工资处于当前匹配边际，通常比全体在职者平均工资更快反映市场；但样本小、岗位构成和选择也更强。</h2>
        <p>
          大量 incumbent wages 由既有合同和内部工资带决定，调整频率低；new-hire wage 面对当期 vacancy、求职者选择和外部 offer，理论上更灵活。市场突然转弱时，企业可先降低招聘报价而不触碰在职基本工资；市场收紧时又可能给新员工 premium，随后产生内部公平与 retention 压力。<Cite n={46} /><Cite n={70} /><Cite n={71} />
        </p>
        <p>
          实测 new-hire wage 还会因谁被雇、岗位质量和签约奖金变化。聚合平均工资的滞后不证明边际工资没有变化；边际工资的剧烈变化也不能直接外推到整套工资账本。需要 matched job、occupation 与 worker controls。
        </p>
      </section>

      <section className="lesson-section" id="settlement-drift-bonus">
        <p className="section-kicker">50 · Settlement、Wage Drift、Bonus 与 One-off Payment</p>
        <h2>合同约定增长、晋升与构成造成的工资漂移、奖金和一次性补偿有不同持续性与发布日期。</h2>
        <p>
          Settlement 或 negotiated wage 记录协议中的基本工资路径；wage drift 是实际支付相对合同率的偏离，可来自晋升、加班、企业差异和构成；bonus 与 one-off payment 可能在单月制造尖峰，却不写入未来基本工资。Tracker 若已知未来生效协议，可以“前瞻”，但覆盖率随期限下降，绝不是对未知合同的预测。<Cite n={21} /><Cite n={26} /><Cite n={35} /><Cite n={100} /><Cite n={107} />
        </p>
        <div className="precision-note"><span>Persistence passport</span><p>每个工资项目都要记录 base/non-base、recurring/one-off、incumbent/new hire、coverage、effective date 与 revision。同比高点不等于下一年自动延续。</p></div>
      </section>

      <section className="lesson-section" id="wage-dashboard">
        <p className="section-kicker">51 · Wage Dashboard</p>
        <h2>没有一条“工资真值”能同时服务家庭收入、岗位价格、企业成本、合同持续性和跨国比较。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="工资指标仪表盘，可横向滚动">
          <table className="concept-table">
            <caption>指标应按研究问题组合，而不是排成准确度榜单</caption>
            <thead><tr><th scope="col">指标族</th><th scope="col">主要回答</th><th scope="col">突出边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">AHE / AWE</th><td>当前受雇样本实际平均支付如何变</td><td>构成、工时、奖金</td></tr>
              <tr><th scope="row">ECI / WPI</th><td>固定职业或岗位价格如何变</td><td>篮子、权重、岗位替换</td></tr>
              <tr><th scope="row">PAYE / payroll admin</th><td>工资册上人数和支付如何变</td><td>覆盖、迟报、自雇与非现金</td></tr>
              <tr><th scope="row">Negotiated tracker</th><td>已签协议何时生效</td><td>覆盖率、one-off、不是 forecast</td></tr>
              <tr><th scope="row">Compensation / LCI</th><td>企业完整劳动成本如何变</td><td>福利估值与小时分母</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国 ECI、欧元区 negotiated tracker、英国 AWE/PAYE、日本 Monthly Labour Survey、中国城镇单位平均工资和澳大利亚 WPI 各有不同总体、单位、权重与修订。跨国比较应先建立 object–unit–clock–coverage 表，再比较共同机制，不能把年度均值、固定岗位季度指数和月度工资册中位数直接排成同一增长榜。<Cite n={5} /><Cite n={12} /><Cite n={20} /><Cite n={21} /><Cite n={22} /><Cite n={26} /><Cite n={30} /><Cite n={35} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="real-wage-catchup">
        <p className="section-kicker">52 · Real-wage Catch-up</p>
        <h2>名义工资快于当前通胀，可能只是补回此前实际工资损失；同向上涨本身不构成 wage–price spiral。</h2>
        <div className="equation-card">
          <span>实际工资增长的精确桥</span>
          <div>1+g<sup>real wage</sup> = (1+g<sup>nominal wage</sup>)/(1+π)</div>
          <p>工资与价格必须使用相容期间和消费口径；“工资增速减通胀”只是小变化近似，且不能直接代表单位劳动成本或企业边际成本。</p>
        </div>
        <p>
          供给冲击先推高价格并压低实际工资后，名义工资追赶可以恢复分配而不产生自我维持螺旋；若工资、价格、预期、合同与政策不断互相写入下一轮，才形成更强反馈。行业成本份额、生产率、利润吸收和需求决定企业如何反应。完整工资—价格传导属于 3.02，本节只交付工资合同与 real-wage gap。<Cite n={97} /><Cite n={98} /><Cite n={99} /><Cite n={101} />
        </p>
      </section>

      <section className="lesson-section" id="wage-phillips">
        <p className="section-kicker">53 · Wage Phillips Curve Interface</p>
        <h2>Wage Phillips curve 是在给定预期、趋势生产率、制度与构成下，slack 与名义工资增长的条件关系，不是稳定菜单。</h2>
        <div className="equation-card">
          <span>教学性条件式</span>
          <div>Δw<sub>t</sub> = a + E<sub>t</sub>π<sub>t+1</sub> + γg<sup>trend productivity</sup><sub>t</sub> − κ(u<sub>t</sub>−u*<sub>t</sub>) + z<sub>t</sub></div>
          <p>所有增长率须在同一频率；u−u* 是潜在 slack proxy，z 包含制度、构成和合同冲击。该式不是从一条相关曲线已识别出的政策因果。</p>
        </div>
        <p>
          原始 Phillips 研究的是货币工资变化与失业；Friedman、Phelps 和后续研究加入预期、自然率与制度。估计 slope 会随预期 proxy、地区相对冲击、样本期、工资指标和劳动议价变化。地区或行业识别可减少全国共同冲击，却未必等于 aggregate policy slope。<Cite n={86} /><Cite n={87} /><Cite n={88} /><Cite n={89} /><Cite n={90} /><Cite n={91} /><Cite n={92} /><Cite n={93} /><Cite n={94} />
        </p>
      </section>

      <section className="lesson-section" id="nonlinear-tightness">
        <p className="section-kicker">54 · Non-linearity in a Very Tight Market</p>
        <h2>当可匹配求职者接近稀缺，新增 vacancy 可能更多进入招聘竞争和工资，而不是同比例增加就业。</h2>
        <p>
          给定 U，常用 Cobb–Douglas matching function 意味着新增 vacancy 带来的边际匹配递减；但它推出的 f=Aθ<sup>1−α</sup> 会随 θ 继续上升，本身并不对离散期 finding probability 施加上限。在连续时间中，f 可以解释为不必小于 1 的到达强度；若要把它解释成“一个月内找到工作的概率”，就要使用 1−e<sup>−f</sup> 之类的有界映射，或另行显式施加概率／匹配容量约束。downward nominal wage rigidity 又可让松弛与收紧方向不对称。极高 V/U 可能使企业相互争夺在职工人、提高 offer wage 和 recruiting intensity，hires 对 vacancy 的边际响应下降。非线性因此可能来自边际匹配递减、显式概率约束、构成、工资刚性或制度，而不是一个普遍固定的 V/U 阈值。<Cite n={51} /><Cite n={72} /><Cite n={95} /><Cite n={96} />
        </p>
        <div className="precision-note"><span>不把拐点当自然常数</span><p>估计到的 kink 依 vacancy measure、疫情样本、u*、预期和函数形式；样本外必须重新验证，不能机械变成政策触发线。</p></div>
      </section>

      <section className="lesson-section" id="natural-unemployment-nairu">
        <p className="section-kicker">55 · u*、Natural Rate 与 NAIRU</p>
        <h2>u* 和 NAIRU 是模型中的潜变量与条件概念，不是每月可直接观测、跨时期固定的失业率红线。</h2>
        <p>
          Natural rate 强调在给定摩擦、制度与实际结构下的中期均衡失业；NAIRU 常指与不加速通胀相容的失业率。两者并非所有模型都相同，也会随人口、匹配、议价、生产率和名义制度变化。用实际 u 减一条平滑估计得到的 gap 含模型与实时修订不确定性。<Cite n={87} /><Cite n={88} /><Cite n={89} /><Cite n={90} />
        </p>
        <p>
          工资、vacancies、quits、flows、participation 和 inflation 可以共同约束 u*，却没有一项直接揭示它。若估计高度依赖 Phillips slope，而 slope 又不稳定，置信区间必须进入决策。说“失业率低于 4% 必然过热”把潜变量、估计误差和制度条件错误压成确定阈值。<Cite n={91} /><Cite n={93} /><Cite n={104} />
        </p>
      </section>

      <section className="lesson-section" id="no-sufficient-statistic">
        <p className="section-kicker">56 · No Single Sufficient Statistic</p>
        <h2>劳动力市场需要数量、流量、紧度、工资、分布与测量不确定性共同确认；任何单一 headline 都可能被另一维度反证。</h2>
        <div className="equation-card">
          <span>本节交付的五维状态向量</span>
          <div>S<sub>t</sub> = {'{'}quantity, flows, tightness, wage formation, measurement uncertainty{'}'}</div>
          <p>这不是可加总的指数，而是一份证据结构：每一维包含对象、时钟、方向、置信度和竞争性解释。</p>
        </div>
        <p>
          低 unemployment 若伴随低 participation、低 quits 和低 hiring，可能是供需同时低迷；高 vacancies 若 filling 和 recruiting intensity 低，未必代表同等强需求；高 average wage 若固定岗位工资平稳，可能主要是构成；工资快于价格若是实际工资追赶，也不等于螺旋。主要央行的实际材料都使用指标组合和叙事判断，而非宣布唯一劳动阈值。<Cite n={104} /><Cite n={105} /><Cite n={106} /><Cite n={107} /><Cite n={108} /><Cite n={109} /><Cite n={110} />
        </p>
      </section>

      <section className="lesson-section" id="household-income">
        <p className="section-kicker">57 · Household Labor-income Channel</p>
        <h2>家庭劳动收入由就业者数量、工时和每小时报酬共同生成；个体工资率上涨不能抵消所有岗位或工时损失。</h2>
        <div className="equation-card">
          <span>聚合劳动收入的最小桥</span>
          <div>Labor cash earnings ≈ employed persons × hours per person × cash earnings per hour</div>
          <p>这是教学桥，不是完整国民账户。精确账户还要处理自雇混合收入、奖金、福利、税费、行业构成和多重就业；三项增长率相加仅是对数近似。</p>
        </div>
        <p>
          平均时薪上升 4%，若就业人数下降 3%、人均工时下降 2%，名义劳动收入可下降约 1.1%。对于总消费能力，extensive margin 往往比留任者工资 headline 更直接；收入分布和流动资产又决定相同总额如何进入支出。央行从劳动数据读取需求韧性时，应把 employment、hours、earnings 与 transfer/tax 分开，而不是只看 wage growth。<Cite n={5} /><Cite n={12} /><Cite n={104} /><Cite n={122} /><Cite n={123} /><Cite n={124} />
        </p>
      </section>

      <section className="lesson-section" id="firm-channel">
        <p className="section-kicker">58 · Firm Cost、Margin 与 Job-design Channel</p>
        <h2>工资和招聘难度进入企业后，可被生产率、利润、价格、岗位设计、自动化和数量调整吸收；没有一条一比一价格通道。</h2>
        <p>
          企业面对的是 compensation、招聘与培训、离职和空缺成本，而非一条平均工资。劳动成本上升可因生产率提高而不增加 ULC，可由利润率吸收，也可推动售价、外包、自动化、工时或岗位标准变化。工资粘性还会让劳动承诺像经营杠杆：收入下行时成本不立即下降，利润和招聘先调整。<Cite n={97} /><Cite n={98} /><Cite n={99} /><Cite n={118} /><Cite n={120} />
        </p>
        <div className="precision-note"><span>与 3.02 的边界</span><p>本节解释 wage contract 和 hiring cost 怎样形成；工资、生产率、markup、需求与价格怎样闭合为通胀反馈，仍以 3.02 的传导与断链为准。</p></div>
      </section>

      <section className="lesson-section" id="asset-interface">
        <p className="section-kicker">59 · Labor News → Cash Flow、Discount Rate 与 Risk Premium</p>
        <h2>同一份“强于预期”的就业数据可利好或利空股票，因为它同时更新现金流、政策路径和风险溢价。</h2>
        <div className="equation-card">
          <span>公告 surprise 与价格反应不是同一个对象</span>
          <div>Surprise<sub>t</sub> = Release<sub>t</sub> − E<sub>t−</sub>[Release<sub>t</sub>]；　ΔP = CF news − DR news − RP news</div>
          <p>预期必须来自公告前信息集并匹配 vintage；第二式是方向性 news decomposition，不是用一个事件窗口已识别出的三个可观察加数。</p>
        </div>
        <p>
          在衰退担忧主导时，强就业可提高盈利与违约前景，现金流通道占优；在需求过热和政策收紧担忧主导时，同一 surprise 可推高实际利率预期，贴现率通道占优。国债、外汇和股票的响应还依期限、政策 regime 与流动性。就业公告不是交易口诀，更不是劳动数据“好坏”的单一排名。<Cite n={111} /><Cite n={112} /><Cite n={113} /><Cite n={114} /><Cite n={115} /><Cite n={116} /><Cite n={117} />
        </p>
        <p>
          长期横截面还存在另一层：招聘调整成本、劳动流动性和工资刚性会改变企业经营杠杆与风险暴露。公告高频反应、企业横截面预期回报和结构资产定价模型属于不同 estimand，不能拼成一条因果系数。<Cite n={118} /><Cite n={119} /><Cite n={120} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">60 · Interactive State-to-Wage Lab</p>
        <h2>十道互动题先校准统计对象与分母，再要求你把匹配、合同、收入和公告 surprise 沿同一条因果链逐步复算。</h2>
        <p>
          Mode A 的五题依次检验失业率分母、persons/jobs 双账本、E/U/N gross flows、平均工资构成与 cash/compensation；Mode B 的五题检验 matching 的双边 hazard、Beveridge movement/shift、new-hire contract reset、家庭劳动现金收入与资产事件分解。题设中每个总体、时钟和参数都是唯一判分所需的冻结条件，不是对现实经济的估计。提交前必须记录置信度；首次答案、首次置信度和提交次数会保留，以便把“高置信错误”与普通记忆遗漏分开。<Cite n={2} /><Cite n={5} /><Cite n={9} /><Cite n={12} /><Cite n={39} /><Cite n={47} />
        </p>
        <LaborMarketLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <div id="labor-static-twins" />
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道无脚本孪生题更换数字和表面情境，检验你能否迁移单位、风险集、合同时钟与传导边界。</h2>
        <div className="understanding-checks">
          {laborMarketScenarios.map((scenario, index) => (
            <details key={scenario.id}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>复算：</b>{scenario.staticTwin.answer}</p>
              <p className="impact-source-links"><b>依据：</b>{' '}{scenario.staticSourceIds.map((id) => <Cite key={`${scenario.id}:${id}`} n={id} />)}</p>
            </details>
          ))}
        </div>
        <p>
          在展开答案前，先写出被数对象、分母、参考期、状态转移方向和至少一个链条断点。若只能记住原题数字或凭选项语气作答，就回到相应 revisit 单元并再换一组数；只有当 persons、jobs、hours、wage、compensation 和 asset news 被换到新情境后仍能重建，知识才从识别转成生成。
        </p>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks、Glossary 与 Labor Evidence Passport</p>
        <h2>十四道检查要求重建机制，十八个术语固定统计对象；Evidence Passport 则阻止 headline、模型参数与因果证据互相冒充。</h2>
        <div className="understanding-checks">
          <details><summary>01 · 五个边界人物应怎样进入 E／U／N？</summary><p>参考期内为报酬工作至少一小时通常归 E；暂时未工作但仍有工作关系者在满足本国规则时归 E；无工作、可工作且积极搜索者归 U；想工作但未积极搜索者通常归 N。已经接受未来工作者取决于开始期限、可工作性与国家实施规则，不能脱离 survey metadata 硬判。分类是活动规则，不是福利判断。</p></details>
          <details><summary>02 · 已知 P、LFPR 和 u，怎样复算 EPOP，并构造 u 降但 EPOP 也降？</summary><p>在同一总体下，EPOP=LFPR×(1−u)。例：P=100，期初 E=60、U=5，则 u=7.6923%、EPOP=60%；期末 E=59、U=4，则 u=6.3492% 却 EPOP=59%。一名就业者和一名失业者转入 N，足以让两个 headline 同时下降。</p></details>
          <details><summary>03 · 一名就业者新增第二份工作、主工作同时减时，四个量怎样变化？</summary><p>Employed persons 不变，jobs 增加一份；总 hours 的方向取决于副业新增工时是否超过主业减少工时，labor input 还取决于技能与质量权重。Persons、jobs、hours 与 labor services 没有机械同向关系。</p></details>
          <details><summary>04 · 六项 E／U／N gross flows 怎样复算失业净变化？</summary><p>ΔU=E→U+N→U−U→E−U→N。若四项分别为 1.8、0.3、2.4、0.6 百万人，ΔU=−0.9 百万人；但找到工作人数是 2.4 百万，净值不能识别任何单个入口或出口。</p></details>
          <details><summary>05 · f=30%、s=3% 时，两态稳态失业是多少，为什么不是 NAIRU？</summary><p>冻结两态、齐次且转移率不变时，ū=s/(s+f)=3/33≈9.0909%。它只是该流量系统的稳态；NAIRU 还依工资/价格关系、预期、制度和模型，实际经济又包含 N、异质 duration 与时变 rates。</p></details>
          <details><summary>06 · Vacancy、hires、quits、layoffs 与 payroll change 分别是什么时间对象？</summary><p>Vacancy 是参考日未填岗位 stock；hires、quits 和 layoffs 是期间 flows；payroll change 是岗位 stock 的净变化。覆盖、期内多次事件、其他 separations、企业出生死亡和修订会使官方序列不精确闭合，不能用 hires 减 separations 逐点强行复制 CES。</p></details>
          <details><summary>07 · CRS matching 中 θ 上升时，finding 与 filling 为什么异向？</summary><p>若 M=μU<sup>α</sup>V<sup>1−α</sup> 且 μ 与有效搜索/招聘不变，f=M/U=μθ<sup>1−α</sup> 随 θ 上升，q=M/V=μθ<sup>−α</sup> 下降。V/U 只有在搜索强度、招聘强度、构成与测量相容时才是有效 tightness 的代理。</p></details>
          <details><summary>08 · Beveridge curve outward shift 至少有哪些竞争性解释？</summary><p>Matching efficiency 下降、行业或地区 mismatch、separation/recall 改变、recruiting intensity 下降、求职者构成或搜索强度变化、vacancy 测量与制度断点都可能外移曲线。要用 flows、duration、岗位填补率、招聘投入和分组暴露逐项区分。</p></details>
          <details><summary>09 · 怎样构造“无人加薪、平均工资却上涨”的 composition 反例？</summary><p>低薪组 $20/h、高薪组 $50/h；paid hours 由 80 万／20 万变为 70 万／20 万，归一化工时权重因此由 80%／20% 变为约 77.78%／22.22%，组内工资不变。平均时薪由 $26 升至约 $26.67，但工资总额由 $26m 降至 $24m。平均数上升既不证明普遍加薪，也不证明家庭劳动收入增加。</p></details>
          <details><summary>10 · 名义工资 +6%、CPI +4%、产出价格 +8% 时，两种实际工资怎样变化？</summary><p>消费者实际工资增长 1.06/1.04−1≈1.9231%，购买力改善；product wage 增长 1.06/1.08−1≈−1.8519%，相对企业产出价格下降。Deflator 不同是在回答家庭购买力和企业成本两个问题，不是谁更“真实”。</p></details>
          <details><summary>11 · Compensation +6%、productivity +2%，ULC 精确增长多少，能否推出 CPI？</summary><p>ULC 增长 1.06/1.02−1≈3.9216%，不是精确 4%。这仍不能推出 CPI 同涨 3.9216%：劳动成本份额、非劳动投入、利润率、需求、合同、生产率测量和价格重置都可能断链，完整反馈属于 3.02。</p></details>
          <details><summary>12 · Outside option 改善在三种工资模型里为何没有无条件同一方向？</summary><p>Nash bargaining 中工人威胁点改善通常提高其剩余份额，但也可降低 vacancy creation；posted-wage/job-ladder 中企业可能提高 offer 以吸引或留住工人；monopsony 中结果取决于 firm-facing labor supply、最低工资和竞争。工资、vacancy 与 finding 的联合方向必须由具体制度和弹性识别。</p></details>
          <details><summary>13 · Natural rate、flow steady state、NAIRU 与 NAWRU 有什么区别？</summary><p>Natural rate 是给定摩擦与制度下的模型均衡概念；flow steady state 是转移率恒定时的存量结果；NAIRU/NAWRU 分别是与价格/工资不加速关系相容的潜变量估计。它们都不是直接观测真值，“u 低于 u* 就必然加速通胀”忽略置信区间、非线性与冲击身份。</p></details>
          <details><summary>14 · 为“强 payroll 让股票涨/跌”各写一条链和 chain-break test。</summary><p>上涨链：正 surprise→预期销量/利润上修→cash-flow news 超过利率与风险溢价冲击。下跌链：正 surprise→通胀或政策路径上修→实际贴现率上升超过现金流改善。研究必须保存公告前 consensus、初值、revision 与窄窗 rates/equity；若盈利预期未升或收益率变化来自 term premium，原命名应被拒绝。</p></details>
        </div>

        <div className="glossary-grid" aria-label="十八个劳动力市场核心术语">
          <article><b>E / U / N</b><p>同一目标人口与参考期内互斥穷尽的就业、失业和非劳动力状态。</p></article>
          <article><b>Labor force</b><p>L=E+U，不是全部 working-age population，也不等于有工作的人。</p></article>
          <article><b>Unemployment rate</b><p>U/L，只描述劳动力内部；分母会随参与流动改变。</p></article>
          <article><b>LFPR / EPOP</b><p>分别为 L/P 与 E/P；一个测参与，一个测人口中的就业占比。</p></article>
          <article><b>Person / Job</b><p>前者是人，后者是职位；多重任职使一名就业者对应多份工作。</p></article>
          <article><b>Gross flow / Hazard</b><p>状态间期间人数及其除以期初来源状态存量的条件转移概率。</p></article>
          <article><b>Finding / Separation</b><p>进入就业和离开既有匹配的期间概率；必须注明起点状态、窗口与 recall。</p></article>
          <article><b>Vacancy / Hire</b><p>前者是待填岗位 stock，后者是开始雇佣的 flow；均不等于净 job creation。</p></article>
          <article><b>Recruiting intensity</b><p>每份 vacancy 所附广告、筛选、报价与招聘资源，会改变 vacancy yield。</p></article>
          <article><b>Market tightness</b><p>有效岗位相对有效求职者的拥挤状态；V/U 只是受口径约束的代理。</p></article>
          <article><b>Matching function</b><p>把 searchers、effective vacancies 与 matching efficiency 映射为 matches 的聚合模型。</p></article>
          <article><b>Beveridge curve</b><p>给定制度、构成和流量条件下 unemployment 与 vacancies 的条件关系。</p></article>
          <article><b>Match surplus / Outside option</b><p>维持匹配相对双方替代状态创造的价值，以及各方离开时可获得的价值。</p></article>
          <article><b>Reservation wage / Nash bargaining</b><p>接受工作与继续搜索等值的状态依赖工资，以及一种特定的剩余分配机制。</p></article>
          <article><b>Monopsony</b><p>企业面对向上倾斜的 firm-level labor supply 所拥有的工资设定力，不要求唯一雇主。</p></article>
          <article><b>Wage / Earnings / Compensation</b><p>单位支付率、期间实际收到的劳动收入，以及加入雇主福利缴费后的总劳动报酬。</p></article>
          <article><b>Real wage / Product wage / ULC</b><p>用消费价或产出价缩减工资，以及每单位实际产出的劳动报酬成本。</p></article>
          <article><b>Natural rate / NAIRU / NAWRU</b><p>不同模型中的潜在均衡或价格/工资加速兼容概念，不是直接观测阈值。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="劳动力市场机制主张 Evidence Passport，可横向滚动">
          <table className="concept-table">
            <caption>每条 labor-market claim 必须保存的最小字段</caption>
            <tbody>
              <tr><th scope="row">Claim / estimand</th><td>方向明确的局部句；population、unit、treatment、outcome、horizon 与 counterfactual</td></tr>
              <tr><th scope="row">Object / universe</th><td>person/job/match/contract；年龄、居住、行业、自雇、机构人口与覆盖</td></tr>
              <tr><th scope="row">State / denominator</th><td>E/U/N、vacancy/hire；risk set、stock/flow、rate、gross/net 与 frequency</td></tr>
              <tr><th scope="row">Clocks / vintage</th><td>reference period、survey week、release timestamp、forecast origin、initial/revised/benchmark vintage</td></tr>
              <tr><th scope="row">Mechanism</th><td>labor demand、search effort、recruiting intensity、matching、surplus、contract reset 与 institution</td></tr>
              <tr><th scope="row">Wage object</th><td>cash/base/bonus/earnings/compensation；incumbent/new hire、mean/median/index 与 deflator</td></tr>
              <tr><th scope="row">Transmission / break</th><td>household hours/tax/transfer；firm productivity/margin/quantity；policy information 与 asset news</td></tr>
              <tr><th scope="row">Evidence status</th><td>identity / official measure / descriptive relation / model estimate / causal estimate / structural counterfactual</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces、Evidence Map 与 20 组阅读</p>
        <h2>3.03 最终交付一张人员—岗位双账本、一套流量—匹配—工资状态图，以及能被后续宏观、公司和资产研究直接调用的 Evidence Passport。</h2>
        <div className="interface-grid">
          <article><span>回到 3.01</span><h3>Real Growth</h3><p>3.01 提供 hours、labor services、productivity 与 potential output；3.03 解释这些劳动投入怎样由人口流动和企业匹配形成。</p></article>
          <article><span>回到 3.02</span><h3>Inflation</h3><p>3.03 输出 compensation/hour、工资合同与 ULC 首端；价格重置、通胀聚合和 wage–price feedback 仍由 3.02 拥有。</p></article>
          <article><span>连接 3.04</span><h3>Expectations</h3><p>本节允许预期价格与生产率进入合同；主体怎样形成、更新和量测预期留给 3.04。</p></article>
          <article><span>连接 3.05</span><h3>Central Bank</h3><p>交付带 uncertainty 和 vintage 的 labor state vector；目标权重、reaction function 与工具留给 3.05。</p></article>
          <article><span>连接 3.07–3.08</span><h3>Rates / Discounting</h3><p>劳动 surprise 可更新预期政策路径、实际利率和折现率；期限结构模型不在本节展开。</p></article>
          <article><span>连接 3.23</span><h3>Macro Surprise</h3><p>本节固定 reference、release、revision 与 consensus 时钟；完整 surprise construction 和公告识别由 3.23 完成。</p></article>
          <article><span>连接 Equity / Chapter 4</span><h3>Cash Flow / Risk</h3><p>家庭收入进入需求，劳动成本进入公司现金流；股票、债券和 FX 反应还需现金流、利率与风险溢价分解。</p></article>
          <article><span>连接 Chapter 7</span><h3>Research Design</h3><p>Labor Evidence Passport 把宏大叙事压成局部 estimand、实时资料、中介、异质预测和 chain-break test。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="劳动力市场四层二十组阅读路径，可横向滚动">
          <table className="concept-table">
            <caption>页面下方列出 Core、Models、Evidence、Systems 各五组阅读单元</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">五个主题</th><th scope="col">完成标准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Core</th><td>国际标准；CPS/CES；JOLTS/ECI；EU-LFS；英国转换</td><td>能冻结统计单位、总体、状态、分母、参考期、初值与修订</td></tr>
              <tr><th scope="row">Models</th><td>匹配经典；失业波动；职位阶梯；工资协商；Phillips</td><td>能区分恒等、行为方程、均衡条件、校准与可识别经验对象</td></tr>
              <tr><th scope="row">Evidence</th><td>中国；日本；澳加；流量持续时间；工资刚性</td><td>能报告国家制度、样本、覆盖、估计量、断点与外推边界</td></tr>
              <tr><th scope="row">Systems</th><td>企业工资；买方势力；疫情；央行 tracker；劳动新闻资产</td><td>能重建 states→matching→contract→income/cost→news→price response</td></tr>
            </tbody>
          </table>
        </div>

        <div className="evidence-map" aria-label="3.03 逐项证据地图">
          <h3>层一｜官方对象、分母与实时测量</h3>
          <p>ILO 的 19th ICLS 决议与 BLS 的 CPS 文档、定义和失业测量说明共同固定 E/U/N、积极搜索、可工作性和调查实现；国际标准与美国问卷不能互相冒充。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /></p>
          <p>CES 的 concepts、calculation、FAQ 与 CPS–CES reconciliation 固定 jobs、hours、earnings、企业出生死亡和 benchmark；person 与 job 分叉首先是单位与覆盖问题。<Cite n={5} /><Cite n={6} /><Cite n={7} /><Cite n={8} /></p>
          <p>JOLTS 的概念、计算与 FAQ 分开 openings、hires、quits 和 layoffs；ECI 方法与概念则分开固定结构的工资、福利与 compensation，stock、flow 和 index 不可混算。<Cite n={9} /><Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={13} /></p>
          <p>ECI 计算、EU-LFS 方法和 2021 断点说明结构权重与制度变化；Eurostat 年度 slack 与季度 vacancy 数据又使用不同年龄、频率和覆盖，不能直接拼接。<Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} /><Cite n={18} /></p>
          <p>Eurostat vacancy metadata、劳动成本指数和 ECB wage-tracker 页面分别固定覆盖、小时总成本与已签合同；英国 LFS/TLFS 指南证明调查转换本身也是数据生成过程的一部分。<Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={22} /><Cite n={23} /></p>
          <p>英国 2026 转换计划、质量报告与 PAYE 指南记录样本恢复、实时插补和 payroll 边界；中国 2026 调查制度与约 34 万户来源提供另一套实施背景。<Cite n={24} /><Cite n={25} /><Cite n={26} /><Cite n={27} /><Cite n={28} /></p>
          <p>中国调查失业率定义、单位工资来源、计算和 2025 年结果固定城乡、单位与年度边界；日本 LFS FAQ 说明同名指标仍须读取本国规则。<Cite n={29} /><Cite n={30} /><Cite n={31} /><Cite n={32} /><Cite n={33} /></p>
          <p>日本结果页和 Monthly Labour Survey、澳大利亚 LFS/WPI 版本化方法以及加拿大 2025 redesign 共同说明结果、工资价格指数和住户状态各有独立抽样与修订时钟。<Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /></p>

          <h3>层二｜流量、招聘、匹配与职位阶梯</h3>
          <p>Beveridge curve 与 Diamond–Mortensen–Pissarides 搜索模型把 vacancies、unemployment、matches 和 job creation 接入均衡；Shimer 的波动难题提醒基准校准未必产生现实数量响应。<Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={42} /><Cite n={43} /></p>
          <p>Hall 的工资粘性、Hagedorn–Manovskii 的小剩余校准和 Pissarides 的新雇工资边际给出不同放大机制；它们是竞争模型，不是同一事实的三个别名。<Cite n={44} /><Cite n={45} /><Cite n={46} /></p>
          <p>失业 ins-and-outs、separation/finding 周期性、Shimer 的重新测量和异质求职者效率共同证明净 U 变化会掩盖 gross flows，且 hazard 会随构成和测量方法改变。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} /></p>
          <p>单位层 vacancy/hiring、mismatch 分解、Beveridge survey 与 composite help-wanted index 分别处理 recruiting intensity、错配与历史 vacancy；曲线外移不能被一项 residual 唯一命名。<Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={54} /></p>
          <p>长期失业证据、duration/composition 分解、EPOP 综述和 E–E gross flows 说明时长、参与和跳槽共同塑造存量；持续时间相关不自动等于个体技能损失。<Cite n={55} /><Cite n={56} /><Cite n={57} /><Cite n={58} /></p>
          <p>Recall 与新岗位的区分、周期职位阶梯、Nash 解、工资—就业协商和 Hall–Milgrom threat point 共同说明匹配外部选择可通过不同协议进入工资。<Cite n={59} /><Cite n={60} /><Cite n={61} /><Cite n={62} /><Cite n={63} /></p>

          <h3>层三｜工资形成、企业异质性与制度</h3>
          <p>交错 Nash bargaining、效率工资、公平工资和 Bewley 访谈给出合同、努力、士气与内部公平机制；Kahn 的微观分布则提供名义下调阻力的量化证据。<Cite n={64} /><Cite n={65} /><Cite n={66} /><Cite n={67} /><Cite n={68} /></p>
          <p>国际工资灵活性、行政 payroll、DNWR 非线性与 posted-wage 搜索共同分开 base wage、bonus、新雇合同和 offer distribution；聚合平均工资不能代理每个边际。<Cite n={69} /><Cite n={70} /><Cite n={71} /><Cite n={72} /><Cite n={73} /></p>
          <p>异质工人与企业的 wage dispersion、matched worker–firm effects、德国企业异质性、美国 inequality 与 rent-sharing 证据揭示 sorting 和 firm premium，但统计 fixed effect 不是结构议价系数。<Cite n={74} /><Cite n={75} /><Cite n={76} /><Cite n={77} /><Cite n={78} /></p>
          <p>Superstar firms、工会历史、labor-market concentration 与 employer power 证据展示企业结构和集体制度；最低工资 bunching 研究提供局部政策效应，不能变成所有水平的无条件结论。<Cite n={79} /><Cite n={80} /><Cite n={81} /><Cite n={82} /><Cite n={83} /></p>
          <p>匈牙利最低工资的成本归宿与瑞典青年 payroll-tax 的租金分享属于不同政策；Phillips、Friedman 与 Phelps 又把历史 wage relation、预期与长期边界分开。<Cite n={84} /><Cite n={85} /><Cite n={86} /><Cite n={87} /><Cite n={88} /></p>

          <h3>层四｜工资状态、通胀接口与央行信息集</h3>
          <p>Blanchard–Katz 工资动态、冲击×制度、州际 Phillips 识别、预期测量与 forecast instability 共同说明 slope、trend、u* 和制度都不是跨样本常数。<Cite n={89} /><Cite n={90} /><Cite n={91} /><Cite n={92} /><Cite n={93} /></p>
          <p>议价力量假说、非线性 tightness、疫情分解、美国 labor-cost 分析和欧元区 labor-cost pass-through 各自支持条件机制；工作论文、政策简报和结构模型必须保留证据等级。<Cite n={94} /><Cite n={95} /><Cite n={96} /><Cite n={97} /><Cite n={98} /></p>
          <p>Inflation-as-conflict、ECB negotiated tracker 与日本工资—价格、人口和生产率研究展示不同制度下的合同与分配；已签协议 tracker 不是未知工资 forecast。<Cite n={99} /><Cite n={100} /><Cite n={101} /><Cite n={102} /><Cite n={103} /></p>
          <p>Fed、BoE 的 2026 报告、历史 BoE 对照、ECB 7 月 tracker 与 RBA 8 月报告记录各自当时信息集；发布日、数据 cutoff 和后来统计不可回填混用。<Cite n={104} /><Cite n={105} /><Cite n={106} /><Cite n={107} /><Cite n={108} /></p>

          <h3>层五｜家庭、公司、新闻与资产</h3>
          <p>BOJ 三个发布日期、BoC 7 月报告与股票、国债和外汇对宏观公告的经典证据表明政策文件 vintage 与市场事件窗不同；资产交易 surprise，不交易孤立水准。<Cite n={109} /><Cite n={110} /><Cite n={111} /><Cite n={112} /><Cite n={113} /></p>
          <p>国债价格与流动性的两阶段反应、高频汇率/利率响应、货币政策 target/path 因子和央行 information shock 进一步要求把 cash-flow、expected-rate、term-premium 与 risk-premium news 分开。<Cite n={114} /><Cite n={115} /><Cite n={116} /><Cite n={117} /></p>
          <p>企业 hiring investment、labor mobility 与 wage rigidity 的资产定价模型说明劳动调整会进入横截面风险；2023 ICLS 修订同时提醒最前端 E/U/N 统计标准也会更新，二者属于不同 estimand。<Cite n={118} /><Cite n={119} /><Cite n={120} /><Cite n={121} /></p>
          <p>BEA compensation、DPI 与 wage accrual/disbursement 方法把工资、雇主补充、税与转移接到家庭账户；Eurostat 2026Q1 slack 则提供当前季度口径，并明确不能与不同年龄的年度值直接比较。<Cite n={122} /><Cite n={123} /><Cite n={124} /><Cite n={125} /></p>
        </div>
        <p>
          本节的最小复述是：<b>劳动力市场先把给定人口按活动与搜索规则分进 E、U、N，再让人员和岗位以 gross flows 相遇。企业的 vacancy、招聘强度与岗位设计和劳动者的搜索、技能与外部选择共同决定匹配；匹配剩余随后经议价、报价、市场力、制度和名义刚性写入不同工资对象。Persons、jobs、hours、wage、earnings 与 compensation 因统计单位、构成和时钟不同而可以分叉。工资只有穿过就业、工时、税和转移才接近家庭可支配收入，只有穿过生产率、非劳动投入、利润和价格合同才进入企业价格，劳动公告也只有相对事前信息集的 surprise 才进入现金流、利率和风险溢价。因此任何“就业强、工资高、市场过热”的主张都必须同时保存总体、分母、流量、合同时钟、vintage、竞争机制和可观测断链。</b>
        </p>
      </section>
    </>
  );
}

export const lesson303: LessonRecord = {
  slug: '3-03',
  id: '3.03',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Labor Market 与 Wage Dynamics：从人口流动、岗位匹配到工资合同与状态估计',
  subtitle: '先把人、岗位、匹配和合同量对，再沿 E／U／N 流动、职位空缺、搜索摩擦、匹配剩余、议价与名义刚性解释就业和工资怎样形成，以及它们为何只是政策与市场的条件性信息',
  readingTime: '核心首读约 95–105 分钟；完整正文含逐式复算约 205–255 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习 25–35，理解检查与术语 25–35，建议分三至四次完成；参考文献与延伸阅读不计',
  prerequisite: '3.01–3.02；建议按需调用 T03、T05、T06 与 T08；与 3.05、3.13、3.23、4.04、6.10 和 Chapter 7 只建立接口',
  updatedAt: '2026-09-01',
  revision: '3.03-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.03-r2',
      summary:
        '独立复核 64 个机制单元、125 条来源、27 个 Evidence Map 证据簇、20 组阅读及 10 道互动与 10 道静态孪生，逐项核对人员／岗位单位、E／U／N 流量、风险集、匹配函数、工资合同、家庭收入和资产 surprise 的公式、数值、来源与因果边界；书目、连续时间强度／离散概率和构成权重的修订均准确，冻结哈希、类型、规范、生产构建、HTTP、目录与引用不变量一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.03-r2',
      summary:
        '独立通读零背景路线、64 节递进、25 个公式卡、10 道互动、10 道静态孪生、14 道检查、18 个术语、8 个接口及四层各五组阅读；真实浏览器验证未提交答案跨模式刷新保留、错误重试、双击防重、首次答案与置信度、提交次数、下一未答、10／10 完成态、硬刷新、焦点、ARIA、移动端、导航和深链，受只读策略限制的损坏存储与 API 拒绝分支另经逐分支源码审计，冻结哈希及工程检查一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '3-02', label: '3.02 Inflation' },
  next: { slug: '3-04', label: '3.04 Inflation Expectations' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    { id: 'units-person-job-match-contract', label: 'Person / Job / Match / Contract' },
    { id: 'stocks-flows-hazards-growth', label: 'Stock / Flow / Hazard / Growth' },
    { id: 'target-population', label: 'Target Population' },
    { id: 'eun-states', label: 'E / U / N States' },
    { id: 'one-hour-rule', label: 'One-hour Rule' },
    { id: 'unemployment-qualification', label: 'Unemployment Qualification' },
    { id: 'unemployment-participation-epop', label: 'u / LFPR / EPOP' },
    { id: 'broader-underutilization', label: 'Broader Underutilization' },
    { id: 'persons-jobs-selfemployment', label: 'Persons / Jobs / Self-employment' },
    { id: 'household-establishment', label: 'Household / Establishment' },
    { id: 'vacancies', label: 'Vacancies' },
    { id: 'hires-separations', label: 'Hires / Separations' },
    { id: 'hours-fte', label: 'Hours / FTE' },
    { id: 'wage-object-map', label: 'Wage Object Map' },
    { id: 'cash-total-compensation', label: 'Cash / Total Compensation' },
    { id: 'mean-median-quantiles', label: 'Mean / Median / Quantiles' },
    { id: 'wage-composition', label: 'Wage Composition' },
    { id: 'labor-data-clock', label: 'Labor Data Clock' },
    { id: 'unemployment-stock-identity', label: 'Unemployment Stock Identity' },
    { id: 'transition-matrix', label: 'E / U / N Transition Matrix' },
    { id: 'job-finding', label: 'Job-finding Hazard' },
    { id: 'separation', label: 'Separation Hazard' },
    { id: 'recall', label: 'Recall' },
    { id: 'employer-employer', label: 'Employer-to-Employer' },
    { id: 'job-ladder', label: 'Job Ladder' },
    { id: 'matching-function', label: 'Matching Function' },
    { id: 'market-tightness', label: 'Market Tightness' },
    { id: 'finding-filling', label: 'Finding / Filling' },
    { id: 'recruiting-intensity', label: 'Recruiting Intensity' },
    { id: 'beveridge-movement', label: 'Beveridge Movement' },
    { id: 'beveridge-shift', label: 'Beveridge Shift' },
    { id: 'duration-dependence', label: 'Duration Dependence' },
    { id: 'participation-demographics', label: 'Participation / Demographics' },
    { id: 'derived-labor-demand', label: 'Derived Labor Demand' },
    { id: 'reservation-wage', label: 'Reservation Wage' },
    { id: 'match-surplus', label: 'Match Surplus' },
    { id: 'nash-bargaining', label: 'Nash Bargaining' },
    { id: 'threat-point', label: 'Threat Point' },
    { id: 'posted-wage', label: 'Posted Wage' },
    { id: 'efficiency-fair-wage', label: 'Efficiency / Fair Wage' },
    { id: 'monopsony', label: 'Monopsony' },
    { id: 'rent-sharing', label: 'Rent Sharing' },
    { id: 'worker-firm-sorting', label: 'Worker–Firm Sorting' },
    { id: 'unions-bargaining', label: 'Unions / Bargaining' },
    { id: 'minimum-wage', label: 'Minimum Wage' },
    { id: 'payroll-tax-benefits', label: 'Payroll Tax / Benefits' },
    { id: 'nominal-wage-rigidity', label: 'Nominal Wage Rigidity' },
    { id: 'incumbent-new-hire', label: 'Incumbent / New-hire' },
    { id: 'settlement-drift-bonus', label: 'Settlement / Drift / Bonus' },
    { id: 'wage-dashboard', label: 'Wage Dashboard' },
    { id: 'real-wage-catchup', label: 'Real-wage Catch-up' },
    { id: 'wage-phillips', label: 'Wage Phillips' },
    { id: 'nonlinear-tightness', label: 'Nonlinear Tightness' },
    { id: 'natural-unemployment-nairu', label: 'Natural Rate / NAIRU' },
    { id: 'no-sufficient-statistic', label: 'No Sufficient Statistic' },
    { id: 'household-income', label: 'Household Income' },
    { id: 'firm-channel', label: 'Firm Channel' },
    { id: 'asset-interface', label: 'Asset Interface' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson303Content,
  references: lesson303References,
  readingList: lesson303ReadingList,
};
