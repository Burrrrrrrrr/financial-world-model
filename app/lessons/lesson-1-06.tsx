import LiquidityDimensionsLab from '../components/LiquidityDimensionsLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson106Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Liquidity 不是证券身上的固定标签，而是市场在给定状态下，把一项交易任务转成已完成头寸的条件性能力。</h2>
        <p>
          假设市场 A 的 quoted spread 只有 1 bp，但最优档附近仅有 800 股；市场 B 的 spread 是 3 bp，却能在很小价格让步内立即承接 100,000 股。一个现在只买 200 股的人可能合理地选择 A，
          一个必须立刻买入 50,000 股的人则可能合理地选择 B。两人没有对同一个客观排名给出矛盾答案，而是在回答不同问题。第一项任务主要受 tightness（价格紧度）约束，第二项还会触及 depth（深度）与 immediacy（即时完成能力）。
          若十秒后还要重复交易，冲击后的 resiliency（恢复能力）又会进入决策。
        </p>
        <p>
          因而本节采用的统一定义是：<strong>市场流动性描述一笔给定方向、数量与时限的交易，在特定市场状态下，能否以可接受的价格让步和足够高的完成概率执行，以及这种能力在被流量扰动后能否重新形成。</strong>
          Tightness、depth、immediacy 与 resiliency 不是四个同义指标，也不是四个彼此独立的旋钮；它们是同一成本—数量—时间—状态系统的四种投影。经典研究早已强调 liquidity 是难以由一个数字捕捉的多面概念，政策测量文献也明确要求同时查看多种指标。<Cite n={1} /><Cite n={2} /><Cite n={3} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把“这个市场流动性好不好”改写成包含方向、数量、期限、成本上限、完成可靠性与状态的可回答任务。</li>
            <li>分别定义 tightness、depth、immediacy 与 resiliency，并为每一维选择有单位、有窗口、有条件的测量。</li>
            <li>说明为什么相同 spread、相同成交量或相同静态 depth 都不能推出相同的总体流动性。</li>
            <li>区分显示能力、实际执行结果与冲击后路径，识别隐藏量、撤单、样本选择和聚合造成的观察损失。</li>
            <li>审计一个 liquidity proxy 能支持什么结论，并把模型度量、经验代理与因果机制保持分离。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节边界</span>
          <p>
            1.05 已经解释 spread 为什么形成，本节只把它作为 tightness 的一项测量；1.07 才深入订单簿消耗、补单、撤单与恢复曲线；1.09 才区分机械、暂时、持久与信息相关的 price impact；7.11 才把 market liquidity 与 funding liquidity、保证金和资产负债表反馈闭合成 liquidity spiral。
            本节会建立这些接口，但不会提前把静态扫簿称为因果冲击，也不会仅凭压力状态恶化就声称已经识别出螺旋。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="task-first">
        <p className="section-kicker">01 · 先定义交易任务</p>
        <h2>“流动”必须有宾语、数量、时限和状态；脱离这些条件的总排名通常没有明确经济对象</h2>
        <p>
          一项最小交易任务可以记作 θ=(d, Q, H, c̄, α, z)：d 是买入或卖出方向，Q 是目标数量，H 是完成期限，c̄ 是最大可接受的实施成本，α 是要求的完成概率，z 是当时的市场状态。
          对同一证券，把 Q 从 200 股改成 200,000 股，会使关注点从第一档 spread 转向整条价格—数量曲线；把 H 从一分钟缩短到一秒，会迫使交易者用更激进的订单购买即时性；把 z 从平静期改成公告或去杠杆压力期，又会使原本显示的订单撤回、风险容量收缩。
        </p>
        <div className="mechanism-chain" aria-label="交易任务如何转化为流动性结果">
          {[
            ['定义任务', '方向、数量、截止时间、成本上限与完成可靠性'],
            ['观察当前状态', '报价、累计数量、队列、场所、波动与订单流'],
            ['选择执行路径', '主动跨价、被动等待、拆单、路由或议价'],
            ['产生任务结果', '价格让步、完成时间、部分成交与机会损失'],
            ['交易改变状态', '深度被消耗，其他参与者补单、撤单或改价'],
            ['形成下一轮能力', '恢复后的 spread、depth 与完成分布成为新输入'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链还解释了为什么 liquidity 既是状态又是结果。订单到达前，报价和深度构成可执行机会；订单策略把机会转成成交；成交和撤改单又改变后续机会。一个对小单很 tight 的市场可以对大单很 shallow，一个此刻 shallow 的市场也可能因快速补单而对分拆执行很有韧性。
          因而严谨的比较不是问“哪个市场更流动”，而是问“对于 θ，这两个市场各自有哪些可行执行路径，结果分布怎样”。<Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="four-projections">
        <p className="section-kicker">02 · 四种直白投影</p>
        <h2>价格入口、数量斜率、完成时钟与恢复路径，分别回答不同层的问题</h2>
        <div className="market-stack">
          <article><span>TIGHTNESS · PRICE</span><b>小额立即交换要让出多远</b><p>常由 quoted / effective spread 与 all-in 小单成本投影；不能说明大单后续档位。</p></article>
          <article><span>DEPTH · SIZE</span><b>数量扩大时成本恶化多快</b><p>常由指定价格带累计数量、扫簿成本曲线或模型化 inverse impact 投影；必须说明方向和窗口。</p></article>
          <article><span>IMMEDIACY · TIME</span><b>给定约束下多久能完成</b><p>常由 time-to-fill 分布、截止前完整成交概率与未成交量投影；不能等同撮合主机延迟。</p></article>
          <article><span>RESILIENCY · DYNAMICS</span><b>冲击以后能力怎样重建</b><p>常由 spread、depth、fill ability 或 impact 的恢复路径、阈值时间与恢复概率投影。</p></article>
        </div>
        <p>
          “投影”意味着每个指标都压缩了原系统。Quoted spread 压缩掉数量与等待，单一 depth 快照压缩掉撤补单和隐藏量，平均 fill time 压缩掉未成交的右尾，半衰期又可能压缩掉根本没有恢复的样本。
          专业测量不是寻找一个看起来最聪明的数字，而是保留被压缩掉的条件，并让结论严格停留在该指标能覆盖的维度。
        </p>
      </section>

      <section className="lesson-section" id="taxonomy">
        <p className="section-kicker">03 · 分类不是自然定律</p>
        <h2>本课程采用四维坐标，但不会把它冒充为唯一、无争议的学界标准</h2>
        <p>
          Kyle 在 1985 年讨论 liquidity 时列出的经典维度是 tightness、depth 与 resiliency，而不是“四维”；后来的政策与测量框架经常把 immediacy 单列，以强调达到给定成交结果所需的时间。
          Sarr 与 Lybek 的 IMF 综述又明确列出 tightness、immediacy、depth、breadth 与 resiliency 五项，并强调不存在唯一、理论上正确且普遍接受的单一流动性指标。<Cite n={1} /><Cite n={2} />
        </p>
        <div className="table-scroll" role="region" aria-label="流动性分类口径比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>分类服务于问题；同名维度在不同文献中也可能有不同操作定义</caption>
            <thead><tr><th scope="col">组织方式</th><th scope="col">明确列出的维度</th><th scope="col">本节如何使用</th><th scope="col">不能误写成什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Kyle 经典三维</th><td>Tightness、Depth、Resiliency</td><td>提供价格成本、数量吸收与无信息冲击恢复的理论起点</td><td>“Kyle 提出了公认四维”</td></tr>
              <tr><th scope="row">本课程四维</th><td>在三维之外单列 Immediacy</td><td>把成本—数量—时间—冲击后路径连接成执行任务</td><td>彼此正交、可无条件等权相加的四个因子</td></tr>
              <tr><th scope="row">IMF 五维示例</th><td>另列 Breadth</td><td>提醒读者查看交易兴趣在价格层、参与者与场所上的覆盖</td><td>本课程遗漏了一个被所有文献统一定义的固定维度</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          本课程把 depth 严格用于“给定价格范围内可吸收多少数量”，把 breadth 作为旁注中的结构性检查：订单和流动性提供是否分布在多个价格层、参与者或场所，还是只依靠少数脆弱来源。某些文献把 breadth 与 depth 合并，另一些将其单列；这里不强行消除差异。
          还要避免把这个 market breadth 与技术分析中的上涨/下跌家数混为一谈。标题中的“四个维度”是一套透明的教材约定，不是对分类史的改写。
        </p>
      </section>

      <section className="lesson-section" id="opportunity-set">
        <p className="section-kicker">04 · 进阶统一化表达</p>
        <h2>把流动性看成一组可行的成本—规模—时间组合，四维便成为同一对象的不同截面</h2>
        <p>
          为了统一语言，本课程定义一个教学性的执行机会集。它不是某篇经典论文的原式，也不是能直接从一张订单簿估计出的结构恒等式；它只是把比较所需条件写完整。令 𝓕<sub>t</sub> 表示时点 t 可观察的报价、队列、波动、场所与订单流状态，IC 表示明确基准下的实施成本，则：
        </p>
        <div className="equation-card">
          <span>本课程的任务条件化机会集 · 教学定义</span>
          <div>𝓔<sup>α</sup><sub>t</sub> = [ (Q, H, c) : Pr(T<sub>fill</sub> ≤ H, Q<sub>filled</sub> ≥ Q, IC ≤ c | 𝓕<sub>t</sub>, π) ≥ α ]</div>
          <p>
            π 是允许的执行策略。机会集越大，表示市场越能在较低成本、较短时间内，以指定可靠性完成较大数量。Tightness 是 Q 很小且 H 很短时的成本入口；depth 是 Q 扩大时成本边界的形状；immediacy 是固定 Q 与成本约束后，完成概率怎样随 H 增长；resiliency 是一次暂时冲击后，整个机会集怎样重新扩张。
          </p>
        </div>
        <p>
          这个表达还揭示了“低成本”和“快”之间没有无条件的优先级。愿意跨越多档报价，可以扩大短期限内可完成的数量，却把 c 推高；愿意等待，可以争取更低价格，却降低截止前完成的可靠性。只有交易者的损失函数告诉我们哪种交换更好。
          因而一个 composite liquidity score 若没有公开 θ、策略集 π 与权重，本质上只是把不同任务的答案混在一起。
        </p>
      </section>

      <section className="lesson-section" id="tightness">
        <p className="section-kicker">05 · Tightness</p>
        <h2>最窄的价格入口，最适合描述小额即时交易，却不是一张大单的完整成本</h2>
        <p>
          设 best bid 为 b<sub>t</sub>，best ask 为 a<sub>t</sub>，midpoint 为 m<sub>t</sub>=(a<sub>t</sub>+b<sub>t</sub>)/2。Absolute quoted spread 是 a<sub>t</sub>−b<sub>t</sub>，relative spread 则用它除以 m<sub>t</sub>；乘以 10,000 后得到 bp。
          Kyle 将 tightness 描述为在短期内反转头寸所付的成本，Demsetz 则把 spread 置于“为立即交换支付价格”的经济结构中。<Cite n={1} /><Cite n={6} />
        </p>
        <div className="equation-card">
          <span>小额报价 tightness</span>
          <div>S<sup>Q</sup><sub>t</sub> = a<sub>t</sub> − b<sub>t</sub>　；　S<sup>rel</sup><sub>t</sub> = (a<sub>t</sub> − b<sub>t</sub>) / m<sub>t</sub> × 10,000 bp</div>
          <p>若 a=100.01、b=99.99，则绝对价差为 0.02，relative quoted spread 为 2 bp。这个计算默认关注靠近最优报价、数量不超过可执行一档的即时任务。</p>
        </div>
        <p>
          1.05 已经区分 quoted、effective 与 realized spread，本节不重做价差形成与成交后分解。这里只保留测量边界：quoted spread 是成交前可见入口；effective spread 把实际成交相对成交前 mid 的方向化距离纳入，能反映价格改善或更差执行；all-in tightness 还应视研究目的加入佣金、费用、返佣与税。
          任何一种都必须注明 full / half spread、absolute / relative、报价场所、时间戳和订单规模。
        </p>
      </section>

      <section className="lesson-section" id="tightness-boundary">
        <p className="section-kicker">06 · Tightness 的盲区</p>
        <h2>一个 tick 的报价可以只承诺一手；屏幕看起来很紧，不等于交易者拿得到足够数量</h2>
        <p>
          假设 X 与 Y 的 quoted spread 都为 1 bp。X 在 best ask 只有 100 股，之后下一档高出 20 bp；Y 在 best ask 有 50,000 股。对 50 股订单，二者的价格入口可能相同；对 10,000 股订单，X 的 1 bp 只描述前 1% 数量。
          这不是 spread “算错了”，而是把一个局部截面用于不属于它的规模。ECB 的市场流动性框架同样提醒，窄价差可能掩盖最优报价上可交易数量很少的事实。<Cite n={15} />
        </p>
        <div className="contrast-card">
          <div><span>可以推出</span><b>指定时点、指定报价集合的小量价格间隙</b><p>若数量确实能在最优档完成，spread 是进入即时交易成本的重要组成部分。</p></div>
          <div><span>不能推出</span><b>大单总成本、完成概率或压力下可用容量</b><p>需要沿价位累计数量、观察撤补单、场所路由与冲击后状态。</p></div>
        </div>
        <p>
          Tick size 还可能制造维度权衡。更小 tick 允许报价更细，可能缩窄 spread，却也可能降低在单一最优价位展示大量数量的优先价值；更大 tick 可能让 quoted spread 更宽，同时鼓励在最佳报价争夺队列位置。
          Harris 对最小价格变动、离散 spread 与报价数量的研究说明，市场设计不能只以“价差越窄越好”评估，具体效果仍依赖证券与制度。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="depth">
        <p className="section-kicker">07 · Depth</p>
        <h2>Depth 是价格—数量曲线，不是一个脱离方向和价格窗口的“挂单总数”</h2>
        <p>
          对想买入的人，相关的是卖方流动性；对想卖出的人，相关的是买方流动性。令卖方第 j 档价格和数量为 a<sub>j,t</sub> 与 q<sup>a</sup><sub>j,t</sub>，则在 midpoint 上方 ε 范围内的累计显示卖方深度可以写成下式。
          买方深度对称定义，但方向不能混合，因为订单簿可能显著不对称。
        </p>
        <div className="equation-card">
          <span>固定相对价格带的显示深度</span>
          <div>D<sup>a</sup><sub>t</sub>(ε) = Σ<sub>j</sub> q<sup>a</sup><sub>j,t</sub> · 1[a<sub>j,t</sub> ≤ m<sub>t</sub>(1+ε)]<br />D<sup>b</sup><sub>t</sub>(ε) = Σ<sub>j</sub> q<sup>b</sup><sub>j,t</sub> · 1[b<sub>j,t</sub> ≥ m<sub>t</sub>(1−ε)]</div>
          <p>“Mid 至 +5 bp 的卖方累计显示 depth 为 20,000 股”比“卖盘很多”完整得多：它给出了方向、价格容忍度、单位和时点。若只报前 K 档，还必须说明不同资产的一档价格距离并不相同。</p>
        </div>
        <p>
          常见口径包括 best-level size、前 K 档累计数量、固定 bp / 价格区间内累计数量，以及完成指定 Q 的静态 VWAP 曲线。前两者依赖 tick 与价格水平，固定价格带更适合跨时点比较，却仍不能自动跨资产比较：股票以股计、债券以面值或风险单位计，期货以合约计；相同名义数量的风险和可对冲性并不相同。
          Fleming 对美国国债的系统比较也发现，quote / trade size 只与其他流动性指标温和相关，说明单一数量读数不是充分统计量。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="static-sweep">
        <p className="section-kicker">08 · 静态执行曲线</p>
        <h2>冻结订单簿可以计算机械扫簿成本，但不能把反事实不存在的动态世界偷换成 price impact</h2>
        <p>
          假设一笔立即买单在冻结的卖方订单簿上依次取得 x<sub>j</sub> 股，总量为 Q。静态 VWAP 是各档成交价的数量加权平均，静态 concession 则比较 VWAP 与下单前 mid。随着 Q 增加，若 concession 上升很慢，当前显示卖方簿较深；若出现陡峭台阶，说明近端深度有限。
        </p>
        <div className="equation-card">
          <span>冻结订单簿下的买入路径 · 描述性反事实</span>
          <div>VWAP<sup>+</sup><sub>t</sub>(Q) = Σ<sub>j</sub>a<sub>j,t</sub>x<sub>j</sub> / Q　；　C<sup>+</sup><sub>t</sub>(Q) = [VWAP<sup>+</sup><sub>t</sub>(Q) − m<sub>t</sub>] / m<sub>t</sub> × 10,000 bp</div>
          <p>这条曲线假定所有显示订单留在原地、没有隐藏量、没有其他交易、没有路由延迟，也没有参与者因你的订单改价或撤单。它是静态 depth 的一项测量，不是现实成交路径的保证。</p>
        </div>
        <p>
          实际大单到达时，显示订单可能撤走，隐藏量可能出现，其他市场可能提供更好价格，主动订单也可能被拆分并等待补单。更重要的是，成交后的 mid 变化同时可能包含机械吃档、信息更新、公共新闻和其他订单流。
          因而“静态 VWAP 离 mid 8 bp”不能被命名为“这笔订单造成 8 bp 永久冲击”。Depth 是交易前的条件吸收曲线；1.09 才会研究交易后价格反应及其暂时/持久成分。<Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="lambda">
        <p className="section-kicker">09 · Kyle λ 的正确边界</p>
        <h2>Inverse impact 可以在特定模型中代表 depth，却不是屏幕订单簿数量的通用倒数</h2>
        <p>
          在 Kyle 的线性模型中，竞争性做市商根据总订单流 y 调整价格，常写成 Δp=λy。λ 的单位是“价格变化 / 订单流单位”；λ 越大，给定订单流对应的价格变化越大，1/λ 因而可在该模型中解释为 market depth。
          这是一种结构化、非常有用的语言，但它依赖线性定价、信息结构、噪声交易与做市商推断等假设。<Cite n={1} />
        </p>
        <div className="precision-note">
          <span>三个不能直接画等号的对象</span>
          <p>
            屏幕 depth 是指定价带内的显示数量；经验 λ 是给定抽样频率、订单流定义与回归设定下的价格—流量斜率；真实 price impact 是一条可能非线性、状态依赖、包含信息和策略反应的动态路径。
            三者相关不等于互为恒等式。报告 λ 时至少要写出价格单位、流量单位、时间聚合、买卖方向算法、控制变量与估计窗口。
          </p>
        </div>
        <p>
          Fleming 在美国国债数据中发现，价格冲击系数与 bid–ask spread 以及市场被报告为流动性较差的时期高度相关，而成交量与成交频率的相关性很弱。这支持 price–flow 度量有信息，却不意味着 λ 纯粹识别了“深度”或某项单一结构原因。
          波动、新闻与内生订单选择仍会同时进入。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="immediacy">
        <p className="section-kicker">10 · Immediacy</p>
        <h2>Immediacy 是在同一价格与数量约束下的完成分布，不是撮合引擎返回确认消息有多快</h2>
        <p>
          对一笔 Q 股订单、执行策略 π 与状态 z<sub>t</sub>，可以关注截止 H 前是否完整成交的条件概率。这个定义把“快”与任务绑定：一张被动限价单可能在 50 微秒内被交易所确认，但若十秒内完整成交概率只有 20%，它对十秒任务缺乏经济即时性；
          另一场所确认慢 0.5 毫秒，却有 95% 概率在五秒内完成同一数量与价格约束，后者对该任务更 immediate。
        </p>
        <div className="equation-card">
          <span>任务条件化完成概率</span>
          <div>I<sub>t</sub>(Q,H,c̄,π) = Pr(T<sub>fill</sub> ≤ H, Q<sub>filled</sub> ≥ Q, IC ≤ c̄ | z<sub>t</sub>, π)</div>
          <p>可同时报告完整成交时间分位数 T<sub>50</sub> / T<sub>90</sub>、截止完成率、部分成交比例和未成交量。若不固定 Q、c̄、方向与策略，两个“平均成交时间”不是同一个对象。</p>
        </div>
        <p>
          1.03 已经解释订单类型的交换：更激进的订单用价格控制换取成交确定性，被动限价单用等待与未成交风险争取更好价格。本节再推进一步：immediacy 不是免费增加的属性，而是一条 cost–time frontier。
          Foucault、Kadan 与 Kandel 的动态 LOB 模型把交易者耐心程度、到达率、spread、交易频率、resiliency 与限价单执行时间放在同一均衡中，说明这些结果由参与者选择共同形成。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="fill-measurement">
        <p className="section-kicker">11 · Immediacy 的测量陷阱</p>
        <h2>只看最终成交的订单，会把最慢、最难成交的右尾从样本里悄悄删除</h2>
        <p>
          若研究者只计算 fills 的平均等待时间，被撤销、过期或研究窗口结束仍未成交的订单就没有进入均值。这是选择偏差：越不 immediate 的订单越可能不被观测为完成。部分成交又提出新的终点问题——第一股成交、50% 完成还是 100% 完成？
          Lo、MacKinlay 与 Zhang 在 survival model 中把撤销或到期订单作为 censored observations，进一步区分 time-to-first-fill 与 time-to-completion，并说明用价格触及限价替代真实订单生命周期可能产生很差的成交时间代理。若撤单是由信息、价格远离或害怕被挑中驱动的主动退出，非信息删失假设便不足；成交与撤单需要另行建模为 competing events，而不能把撤单时间冒充完成时间。<Cite n={21} />
        </p>
        <div className="table-scroll" role="region" aria-label="Immediacy 测量口径审计，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每个时间指标都需要起点、终点、未完成处理与价格条件</caption>
            <thead><tr><th scope="col">口径</th><th scope="col">回答什么</th><th scope="col">主要遗漏</th><th scope="col">最低报告要求</th></tr></thead>
            <tbody>
              <tr><th scope="row">Acknowledgement latency</th><td>系统多久确认接收/处理</td><td>没有说明目标数量何时成交</td><td>端到端时钟、网络位置、消息定义</td></tr>
              <tr><th scope="row">Time to first fill</th><td>第一部分多久开始成交</td><td>可能只成交极小比例</td><td>订单规模、首笔比例、限价和队列</td></tr>
              <tr><th scope="row">Time to complete</th><td>完整数量多久完成</td><td>未完成/撤销会形成删失</td><td>截止窗口、删失规则与完成率</td></tr>
              <tr><th scope="row">P(fill by H)</th><td>给定期限内完成可靠性</td><td>若价格和规模不统一仍不可比</td><td>Q、c̄、方向、状态、策略与置信区间</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          OTC 或大宗交易还会把 immediacy 表现为搜索对手方、请求报价、议价、分拆与结算准备时间；它不必对应中央订单簿的队列时钟。把股票微秒指标直接拿去评价公司债或外汇询价市场，会把制度差异误写成经济流动性差异。
          跨市场比较前应先定义相同任务和终点，再解释制度如何产生这一分布。
        </p>
      </section>

      <section className="lesson-section" id="resiliency">
        <p className="section-kicker">12 · Resiliency</p>
        <h2>Resiliency 不是“价格回到原位”，而是暂时扰动后可交易能力恢复得多快、多可靠</h2>
        <p>
          Kyle 对 resiliency 的经典描述限定在随机、无信息冲击后的价格恢复。这个限定防止我们把有效价格发现误判为失灵：若公开消息永久提高了合理价值，mid 留在新水平可能完全正确；市场仍可在新价格附近重新形成窄 spread、足够 depth 与稳定完成能力。
          真正的问题是暂时性订单失衡或流动性消耗留下的偏离，是否随新的挂单、反向订单和报价调整消退。<Cite n={1} />
        </p>
        <div className="equation-card">
          <span>状态变量 X 的教学恢复比例</span>
          <div>R<sub>X</sub>(u) = 1 − |X<sub>t₀+u</sub> − X<sup>base</sup><sub>t₀+u</sub>| / |X<sub>t₀+</sub> − X<sup>base</sup><sub>t₀+</sub>|<br />τ<sub>X</sub>(ρ) = inf [u ≥ 0 : R<sub>X</sub>(u) ≥ ρ]</div>
          <p>X 可以是 spread、指定价带 depth、完成概率或其他事先选定状态。X<sup>base</sup> 应是状态依赖基准或可辩护反事实，不必是冲击前最后一个价格。公式只有在分母非零、冲击与基准定义清楚时才使用。</p>
        </div>
        <p>
          只报 τ 仍可能不够。Large 将电子订单簿的韧性同时表述为补充是否会发生以及若发生需要多久；其特定 LSE 样本中，可靠补充并非每次出现，而发生时可能很快。这说明“条件于恢复的 20 秒半衰期”不能被改写成“所有冲击都在 20 秒恢复”。
          恢复速度、恢复概率、恢复到哪个变量与哪个阈值必须一起报告。若路径发生 overshoot 或非单调反复，R<sub>X</sub> 还可能下降或为负；此时应保留完整路径、阈值首次穿越与路径面积，而不是强迫数据服从单一指数半衰期。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="multiple-clocks">
        <p className="section-kicker">13 · 多个恢复时钟</p>
        <h2>Spread 可以先恢复、depth 可以后恢复；“市场恢复时间”若不写变量便没有唯一答案</h2>
        <p>
          设冲击前 spread=2 bp、指定价带 depth=1,000,000 股；大单后 spread=12 bp、depth=200,000 股。十秒后 spread 已回到 2 bp，但 depth 只有 250,000 股；六十秒后 spread 仍为 2 bp，depth 回到 900,000 股。
          如果只看 tightness，十秒似乎完全恢复；如果看冲击损失的 depth，十秒仅补回 50,000 / 800,000=6.25%，六十秒才补回 87.5%。
        </p>
        <div className="state-sequence">
          <article><span>BASELINE</span><b>2 bp · 1,000k</b><p>先明确 spread 与固定价带 depth 两个基准。</p></article>
          <article><span>0+</span><b>12 bp · 200k</b><p>流动性消耗同时扩大价格入口并抽走容量。</p></article>
          <article><span>10 SECONDS</span><b>2 bp · 250k</b><p>Tightness 已回归；depth 损失只修复 6.25%。</p></article>
          <article><span>60 SECONDS</span><b>2 bp · 900k</b><p>Depth 修复 87.5%；仍不能说隐藏量和完成分布已完全恢复。</p></article>
        </div>
        <p>
          这个最小案例只负责建立“变量—阈值—时钟”的语言；1.07 才会深入 event time 与 calendar time、冲击选择、补单/撤单强度、基准估计和状态依赖。动态供求模型还说明，恢复速度会改变最优拆单策略：等待让供给重新形成，交易者的执行又持续消耗它。
          因而静态 depth 与 resiliency 共同决定一条大单的动态可执行容量。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="interactions">
        <p className="section-kicker">14 · 四维怎样相互作用</p>
        <h2>四维不是正交统计因子：交易者行为会把一个维度的变化传进另一个维度</h2>
        <p>
          一笔紧急市场单首先跨越 spread，并按当前深度逐档成交；这提高 immediacy，却消耗 depth，可能使后续 spread 变宽。流动性提供者观察到订单后，会判断它更像暂时需求还是信息，决定补单、撤单或移价；这些反应形成 resiliency。
          恢复后的订单簿又决定下一笔订单的 tightness 与 depth。于是四维可连接成闭环，而不是四列互不相干的数据。
        </p>
        <div className="mechanism-chain" aria-label="四维流动性的动态反馈链">
          {[
            ['当前 tightness / depth', '提供此刻的价格入口与数量曲线'],
            ['任务需要 immediacy', '交易者选择更激进价格或接受等待'],
            ['执行消耗状态', '成交、撤单与信息更新改变盘口和队列'],
            ['提供者重新判断', '补单、改价、对冲或暂时退出'],
            ['形成 resiliency', '不同变量以不同概率和速度接近新基准'],
            ['新一轮机会集', '恢复程度成为下一位交易者的条件输入'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这也产生反直觉组合：市场可以 tight but shallow；deep but wide；静态 shallow but resilient；immediate but expensive；或者 calm-state 四项都好、stress-state 同时恶化。共同变化不证明指标相同，背离也不证明某项“失真”。
          研究者应把背离当成机制信息：究竟是价格入口、风险容量、等待供给还是恢复行为发生了变化。
        </p>
      </section>

      <section className="lesson-section" id="surface">
        <p className="section-kicker">15 · Size × Horizon × State × Direction</p>
        <h2>流动性更像一张条件曲面：改变任何坐标，都可能让市场排名反转</h2>
        <div className="number-story three-column">
          <div><span>SIZE</span><b>从一手到一项头寸</b><p>小单看 spread；大单沿深度曲线扩张，并可能需要拆分与补单。</p></div>
          <div><span>HORIZON</span><b>从立即到耐心</b><p>短时限购买执行确定性；较长时限换取价格改善，却承担未成交与泄露风险。</p></div>
          <div><span>STATE</span><b>从平静到压力</b><p>平静期平均指标不能保证公告、开盘、波动跃升或资产负债表收缩时仍可用。</p></div>
        </div>
        <p>
          Direction 是第四个经常被遗漏的坐标。买方任务面对 ask-side depth，卖方任务面对 bid-side depth；库存、做空约束、资金流与新闻方向可以使两侧不对称。同一市场可能容易买入却难以卖出，或者在上升行情中卖方 depth 丰富、下跌压力中买方深度撤退。
          把两侧先平均再研究，会恰好抹掉最有经济意义的非对称。
        </p>
        <p>
          多尺度还意味着抽样频率不能随意混用。毫秒级 quoted spread、分钟 fill distribution、日 Amihud proxy 与月度 turnover 不在同一信息集合；它们可以共同描述一个市场，却不能假装同时点观测。研究设计必须先指定理论时间尺度，再选择能观察该机制的频率与聚合方式。
        </p>
      </section>

      <section className="lesson-section" id="observability">
        <p className="section-kicker">16 · Ex ante、Ex post 与潜在供给</p>
        <h2>你能看到报价和成交，却看不到所有愿意在条件改变后进入的供给</h2>
        <div className="table-scroll" role="region" aria-label="四维流动性的事前事后观测矩阵，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>“有高频数据”不等于直接观察真实流动性；每一维都有不同缺口</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">Ex ante 投影</th><th scope="col">Ex post 结果</th><th scope="col">仍不可观察或需建模</th></tr></thead>
            <tbody>
              <tr><th scope="row">Tightness</th><td>Quoted spread、费用表</td><td>Effective / all-in execution cost</td><td>未提交订单的保留价、机会成本</td></tr>
              <tr><th scope="row">Depth</th><td>显示簿、RFQ quotes、指示数量</td><td>实际 VWAP、逐笔完成路径</td><td>撤回量、隐藏量、其他场所与潜在对手方</td></tr>
              <tr><th scope="row">Immediacy</th><td>历史条件完成分布</td><td>某笔 time-to-fill / 未完成</td><td>反事实策略结果、删失订单与需求异质性</td></tr>
              <tr><th scope="row">Resiliency</th><td>历史状态依赖响应</td><td>一次冲击后的完整路径</td><td>无冲击反事实、新信息与共同冲击分离</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          显示流动性是一项可撤回的承诺，不是仓库里不可移动的库存；隐藏流动性又可能只在订单到达时显现。跨场所市场中，本地 depth 不等于全市场 depth，consolidated quote 也不一定包含可执行的全部数量与费用。
          高频数据减少时间聚合，却增加同步、重复消息、撤单、场所映射与订单方向识别问题。测量精细度提高，构念识别不会自动完成。<Cite n={4} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="proxy-hierarchy">
        <p className="section-kicker">17 · 指标层级</p>
        <h2>先用直接任务指标回答局部问题；数据不足时才退到代理，并把退让写在结论里</h2>
        <p>
          最接近执行任务的数据通常是逐笔报价、订单簿、成交、费用、订单生命周期和场所状态。它们允许直接构造特定规模的 spread、depth、fill distribution 与恢复路径。若只有日频价格和成交金额，研究者可以使用低频 proxy，
          但结论必须从“市场能在 10 秒内完成 100,000 股”退回到“该日频比率与交易摩擦或价格—流量敏感度相关”。IMF 的综述把交易成本、volume-based、equilibrium-price 与 market-impact 指标分组，正因为任何一类都不能无歧义覆盖全部维度。<Cite n={2} />
        </p>
        <div className="market-stack">
          <article><span>LEVEL 1 · DIRECT TASK</span><b>同一 Q、H、c̄ 下的成本与完成</b><p>最接近交易者问题，但需要订单与执行级数据，也最依赖策略定义。</p></article>
          <article><span>LEVEL 2 · QUOTE / BOOK</span><b>Spread、价带 depth、撤补单路径</b><p>直接描述显示市场状态，却遗漏隐藏、未来和跨场所供给。</p></article>
          <article><span>LEVEL 3 · TRADE / FLOW</span><b>Effective cost、price–flow slope、reversal</b><p>观测实际结果，但订单选择、信息和共同冲击会内生进入。</p></article>
          <article><span>LEVEL 4 · LOW-FREQUENCY PROXY</span><b>Amihud、turnover、zero-return 等</b><p>适合长样本与数据稀缺环境，解释范围最窄，跨制度可比性最弱。</p></article>
        </div>
        <p>
          指标层级不是“越高频越科学”的排名。某些 OTC 市场没有完整订单簿，RFQ 响应和实际 dealer quotes 可能比伪造的 LOB depth 更贴近机制；某些长期资产定价问题又确实只能使用多年日频代理。
          正确原则是让数据生成过程与研究问题一致，并报告 proxy 的 construct validity，而不是用一个熟悉公式替代市场制度。
        </p>
      </section>

      <section className="lesson-section" id="low-frequency-proxies">
        <p className="section-kicker">18 · 低频 Proxy 审计</p>
        <h2>Volume、turnover、Amihud 与 zero-return 都能提供信号，却没有一个等同于 liquidity 本体</h2>
        <p>
          成交量是已经实现的交易流量。高 volume 可能来自流动性供给充足，也可能来自恐慌卖出、信息到达或频繁双向换手；低 volume 可能意味着缺乏需求，也可能是持有人没有交易需要。Fleming 在美国国债样本中发现，volume 与 trading frequency 对其他流动性指标只是弱代理，且高、低活动都可能伴随 poor liquidity。
          因而“今天成交量创纪录，所以市场很流动”缺少价格成本与供给状态。<Cite n={8} />
        </p>
        <div className="equation-card">
          <span>Amihud 日频 illiquidity proxy</span>
          <div>ILLIQ<sub>i,T</sub> = (1 / N<sub>T</sub>) Σ<sub>d∈T</sub> |r<sub>i,d</sub>| / DollarVolume<sub>i,d</sub></div>
          <p>该比率把“每单位成交金额对应的绝对收益变化”作为粗略 illiquidity 投影，适合只有日频数据的长样本。它混合波动、新闻、价格离散、成交金额和内生订单选择，不能称为纯粹的因果 price impact、depth 或 resiliency。</p>
        </div>
        <p>
          Amihud 本人把这一比率作为容易取得的 price-impact / illiquidity proxy，并用于研究流动性与预期收益；它的便利不消除口径边界。Pástor–Stambaugh 则从订单流相关的短期收益反转构造市场流动性状态，研究资产对 aggregate liquidity 波动的敏感度；这回答 liquidity risk 的资产定价问题，不是某时点订单簿 depth。
          Zero-return 方法利用价格不变日反推交易成本，却也会受到价格网格、停牌、陈旧报价与真实无新闻的影响。<Cite n={9} /><Cite n={10} /><Cite n={18} />
        </p>
        <div className="precision-note">
          <span>把三个概念分开</span>
          <p><strong>Liquidity level</strong> 是当前任务的交易条件；<strong>resiliency</strong> 是冲击后的恢复；<strong>liquidity risk</strong> 是未来流动性状态的不确定性及其与坏状态的共同变化。当前 spread 窄不保证未来不枯竭，对 aggregate liquidity 很敏感也不等于今天的屏幕簿很浅。</p>
        </div>
      </section>

      <section className="lesson-section" id="aggregation">
        <p className="section-kicker">19 · 单位、条件化与聚合</p>
        <h2>一个 liquidity 数字必须带着单位、规模、方向、时钟和权重一起出现</h2>
        <p>
          报告 spread 的日均值时，time-weighted average 回答“随机时点看到什么”，quote-update-weighted average 回答“更新事件上的状态”，trade-weighted average 更接近“成交集中在哪里”；三者可以显著不同。Depth 也可按时点、事件或成交前状态聚合，且极端值、开收盘和公告窗口会改变结果。
          若先把所有时段平均，研究者可能用午间平静状态掩盖开盘或压力期真正绑定的执行约束。
        </p>
        <div className="table-scroll" role="region" aria-label="流动性指标最小元数据，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>没有这些元数据，数值不能稳定复现，也难以解释</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">必须给出的单位</th><th scope="col">必须给出的条件</th><th scope="col">常见错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Spread / cost</th><td>价格、百分比、bp；full / half</td><td>报价集合、费用、时点、订单规模</td><td>不同价格资产直接比较 0.01 元</td></tr>
              <tr><th scope="row">Depth</th><td>股、面值、合约、美元或风险单位</td><td>买/卖方向、价带、档数、场所</td><td>前五档跨证券直接比较</td></tr>
              <tr><th scope="row">Immediacy</th><td>秒/毫秒、概率、完成比例</td><td>Q、限价、截止、删失、策略</td><td>只对 fills 求平均</td></tr>
              <tr><th scope="row">Resiliency</th><td>恢复比例、阈值时间、概率</td><td>冲击、变量、基准、事件/日历时钟</td><td>不写 X 就报告“半衰期”</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          跨资产比较还要决定用名义量还是风险量。100 万美元两年期国债与 100 万美元三十年期国债的利率风险不同；一万股低价股票与一万股高价股票的名义价值不同。若任务是风险转移，可以用 duration / DV01、delta-adjusted notional 或资本占用归一化；若任务是订单簿可执行性，又需保留原生 tick 和数量。
          归一化不是装饰，而是理论对象的一部分。
        </p>
      </section>

      <section className="lesson-section" id="composite-score">
        <p className="section-kicker">20 · Composite Score 的边界</p>
        <h2>Z-score 只消除了数值量纲，不会自动发现四维应当怎样权衡</h2>
        <p>
          假设研究者计算 −z(spread)+z(depth)−z(fill time)−z(recovery time)，等权相加后称为“普遍流动性分数”。标准化确实把均值和尺度转换成可相加数字，却没有回答：对 200 股还是 2,000,000 股？一秒还是一天？买入还是卖出？平静还是压力？
          更没有说明为何 spread 改善一个标准差应当恰好抵消 recovery time 恶化一个标准差。
        </p>
        <div className="contrast-card">
          <div><span>有条件的正确用法</span><b>用明确任务损失函数导出权重</b><p>先固定 Q、H、c̄、α、方向和状态，再验证分数能否预测成本、完成或压力损失。</p></div>
          <div><span>不成立的升级</span><b>把样本内等权排名称为普遍市场质量</b><p>跨制度、跨资产与状态变化会改变单位、缺失机制和经济权重。</p></div>
        </div>
        <p>
          这并不意味着 composite 永远无用。一个执行台可以为“在十秒内卖出给定风险量、且未完成损失很高”的任务训练任务特定 score；监管者也可为多个目标建立 dashboard。但指标必须接受样本外检验、压力期稳定性、缺失机制、极端值与权重敏感度审计。
          一旦任务改变，权重和阈值就应重新论证，而不是把同一总分迁移到所有使用者。
        </p>
      </section>

      <section className="lesson-section" id="liquidity-lab">
        <LiquidityDimensionsLab />
      </section>

      <section className="lesson-section" id="march-2020">
        <p className="section-kicker">22 · 真实案例 · 2020 年 3 月美国国债</p>
        <h2>“避险资产成交很多”与“市场能低成本吸收卖盘”可以同时向相反方向变化</h2>
        <p>
          2020 年 3 月的美国国债市场提供了一个重要反例：高度活跃、制度成熟且通常很深的市场，也会在现金需求、卖盘与中介容量同时变化时出现多维流动性恶化。纽约联储的当时分析显示，Treasury liquidity 在 3 月 6 日和 9 日开始明显恶化；bid–ask spread 与 price impact 多数在 3 月 13 日达到全球金融危机以来的高位，
          order-book depth 则依证券在 3 月 12 或 13 日触底。成交和客户卖出需求很大，并没有阻止 tightness、depth 与 price–flow absorption 同时恶化。<Cite n={16} />
        </p>
        <div className="table-scroll" role="region" aria-label="2020年3月美国国债市场多维流动性官方数据，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>IAWG staff report 的不同指标、不同证券与不同基准；它们不能合并成一个“流动性下降百分比”</caption>
            <thead><tr><th scope="col">观察量</th><th scope="col">官方报告的时点与数值</th><th scope="col">能够支持的结论</th><th scope="col">不能过度推断</th></tr></thead>
            <tbody>
              <tr><th scope="row">Cash transaction volume</th><td>2020-02-28 超过 1.3 万亿美元；通常日均约 6,000 亿美元</td><td>实现交易活动和中介需求激增</td><td>高 volume 证明吸收能力充足</td></tr>
              <tr><th scope="row">10Y on-the-run spread</th><td>2020-03-13 为 1.4 ticks；典型约 0.5 tick</td><td>该券、该场所口径的 tightness 恶化</td><td>所有 Treasury 客户成本同倍数上升</td></tr>
              <tr><th scope="row">30Y on-the-run spread</th><td>3 月中旬超过全球金融危机后均值的 6 倍</td><td>长端恶化更显著且跨期限异质</td><td>整个市场“失去 六分之五流动性”</td></tr>
              <tr><th scope="row">Cash price impact</th><td>3 月 12–13 日为正常水平的 5–6 倍</td><td>单位有向流量对应的价格变化显著上升</td><td>每位投资者实际成本都上升 5–6 倍</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这组 staff findings 来自美国财政部、Federal Reserve Board、纽约联储、SEC 与 CFTC 工作人员的联合进展报告；五家机构明确声明报告只代表 staff findings，并不等于各机构正式采纳全部分析。数值还对应不同期限、场所与基准，最有力的结论是<strong>高活动与多维 illiquidity 同时出现</strong>，不是把四行数字压成一个总体比例。<Cite n={19} />
        </p>
        <div className="mechanism-chain" aria-label="2020年3月美国国债流动性压力链">
          {[
            ['现金需求跃升', '投资者出售包括长期国债在内的资产以筹集现金'],
            ['卖盘集中到达', '外国持有人、杠杆策略与其他资金转移大量风险'],
            ['中介容量受约束', 'Dealer 库存、资产负债表、内部限额与波动压力上升'],
            ['显示供给退缩', '部分交易商与交易公司降低参与，spread 扩大、depth 下降'],
            ['单位流量影响上升', '同样净订单流对应更大价格变化，执行能力恶化'],
            ['政策与状态共同转变', '大规模购买、融资支持与波动回落伴随多项指标修复'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          FSB 的事后综述指出，杠杆 basis trade 的大规模平仓约 900 亿美元，外国持有人在 3 月净出售接近 3,000 亿美元国债与票据；这些是压力来源之一，而不是单一、充分原因。Dealers 难以完全吸收销售，运营约束与部分高速交易者降低参与也可能放大问题。
          这条证据链比“投资者恐慌所以不流动”更具体：需求首先改变谁的头寸与融资，哪些中介受到容量约束，他们如何减少承接，结果才进入 spread、depth 与 impact。<Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="case-clocks">
        <p className="section-kicker">23 · 案例中的不同恢复时钟</p>
        <h2>指标随后共同改善，并不允许把时间重合直接写成单一政策的净因果效应</h2>
        <p>
          纽约联储记录显示，3 月中下旬 bid–ask spreads 收窄、price impact 下降、order-book depth 开始恢复。3 月 23 日以后，联储宣布按支持市场运作所需规模购买；自 3 月 19 日开始的两周内，Treasury purchases 日均约 720 亿美元。到 4 月末，price impact 与 depth 仍未回到 1 月和 2 月初水平，
          但已接近 2019 年夏末与初秋波动期状态。不同指标没有同一恢复日。<Cite n={16} />
        </p>
        <p>
          一项后续 Federal Reserve staff comparison 将 10 年期 on-the-run Treasury 的 market depth 定义为订单簿买卖前五档累计显示量的平均，并以事件前 3 日均值建立基准。按“三日移动平均首次修复初始跌幅 75%”的严格口径，2020-02-28 起算的 coronavirus episode 用了 57 个营业日；同表中的全球金融危机和欧洲主权债务危机分别为 149 与 101 日。
          这个 57 日不是 Treasury market 的统一半衰期：它只属于特定券、前五档、三日平滑与 75% 阈值。研究同时指出，spread 往往在几天内先回落，depth 的更慢恢复意味着市场可能更依赖高速补单，因而仍然脆弱。<Cite n={20} />
        </p>
        <div className="precision-note">
          <span>因果边界</span>
          <p>
            大规模购买、repo 与 dealer 融资设施、临时监管调整、波动回落、卖盘变化和信息更新在相近时期发生。时间顺序支持“政策与市场状态修复相伴”，但仅凭这条时序不能识别每项措施的独立效应。
            更严格研究需要反事实、工具变量、跨证券处理差异或结构模型。本案例在本节用于展示四维分裂与测量边界，不用于估计政策乘数。
          </p>
        </div>
        <p>
          样本覆盖也非常关键。纽约联储的主要高频图表关注最流动的 on-the-run notes / bonds 电子 interdealer market，并明确提示这可能低估 off-the-run、voice 与 dealer-to-customer 市场的恶化。
          “美国国债 liquidity”不是一个无场所、无证券集合的数值；同一危机中，期限、券龄、场所与客户类型会有不同状态。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">24 · 反例库</p>
        <h2>用最小反例拆掉“一个好指标代表全部好”的直觉</h2>
        <div className="edge-list">
          <article><span>TIGHT BUT SHALLOW</span><h3>1 bp spread，best size 只有一手</h3><p>小单入口便宜，大单成本曲线陡峭；spread 没有测错，只是任务超出它的尺度。</p></article>
          <article><span>DEEP BUT FLEETING</span><h3>冲击前显示 200 万，半秒内撤走 170 万</h3><p>Pre-shock stock 很大，却没有证明承诺会留存或冲击后会恢复。</p></article>
          <article><span>FAST BUT EXPENSIVE</span><h3>两秒完成，但允许扫到 25 bp</h3><p>执行快来自更高价格让步；若另一方案被限制在 3 bp，秒数不可直接排名。</p></article>
          <article><span>NEW PRICE, RESTORED MARKET</span><h3>公告后 mid 永久重估，spread 与 depth 修复</h3><p>信息进入价格不是缺乏韧性；恢复对象应是围绕新基准的交易能力。</p></article>
          <article><span>HIGH VOLUME, POOR LIQUIDITY</span><h3>恐慌卖出制造纪录成交与更大冲击</h3><p>已实现需求流量上升，可以与条件吸收能力下降同时发生。</p></article>
          <article><span>NO TRADE, NO PROOF</span><h3>价格不动、成交为零</h3><p>可能平静，也可能没有可接受对手方或报价陈旧；零变化不是高流动性的充分证据。</p></article>
        </div>
        <p>
          这些反例共同训练一种审计顺序：先问指标观测哪一维，再问任务是否匹配，然后检查状态、制度和不可观察部分，最后才讨论机制。若研究者从“spread 很窄”直接跳到“市场能吸收强制卖盘”，中间至少跨越了规模、时间、承诺留存、恢复和融资容量五道未经验证的桥。
        </p>
      </section>

      <section className="lesson-section" id="pressure-boundary">
        <p className="section-kicker">25 · Market 与 Funding Liquidity</p>
        <h2>四维描述市场交易能力；中介能否融资是另一层状态，二者可能连接却不能混称</h2>
        <p>
          Market liquidity 是资产在市场中的可交易条件；funding liquidity 是机构取得现金、融资头寸、满足保证金与维持资产负债表的能力。后者不是本节四维之外的“第五维”。一个 dealer 即使看到有利报价机会，也可能因资本、杠杆或风险限额无法扩表；
          这会减少报价数量、扩大 spread、延长完成时间或拖慢恢复，使 funding state 进入四维 market outcomes。ECB 的官方框架明确把两者区分，并讨论压力中可能的相互强化。<Cite n={15} />
        </p>
        <p>
          本节在这里停止：它只允许说“给定压力状态下，市场流动性多维恶化，潜在原因包括中介容量变化”。要证明 liquidity spiral，还必须观察 haircut / margin、融资可得性、去杠杆、价格、波动与进一步保证金之间的双向反馈，并排除共同新闻或单向卖盘。
          7.11 将把这条链完整闭合；在此之前，用“流动性螺旋”替代缺失机制只是一种命名，不是解释。
        </p>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">26 · 从世界观到可证伪研究</p>
        <h2>研究流动性不是把代理放进回归，而是先说明哪项任务、哪一维、哪个冲击与哪条替代机制</h2>
        <p>
          一个可检验问题可以是：“在相同卖出风险量与开盘后十分钟窗口内，公告日的 bid-side depth 与 90% 完成成本是否相对匹配非公告日恶化，并且 spread 恢复是否先于 depth？”这比“新闻会不会降低 liquidity”更局部：它给出方向、风险量、时窗、变量和恢复次序。
          随后必须保留公共波动、交易需求、中介容量、tick / fee、场所迁移与数据错误等竞争解释。
        </p>
        <div className="mechanism-chain" aria-label="流动性研究设计步骤">
          {[
            ['定义任务与维度', '写出 d、Q、H、c̄、α、state 及主观测量'],
            ['明确数据生成', '报价、订单、成交、RFQ、场所和时钟怎样形成'],
            ['提出机制差异', '不同原因对方向、规模、时距或参与者有何不同预测'],
            ['识别冲击与基准', '事件、制度变化、反事实路径与共同新闻怎样处理'],
            ['审计聚合和样本', '权重、删失、缺失、异常报价、开收盘和存活偏差'],
            ['限制结论', '支持哪个局部投影，不能升级为什么总体因果主张'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Hasbrouck 与 Seppi 发现价格、订单流与若干 liquidity proxies 存在跨股票共同因子，但不同指标的共同性强度并不一致。这提醒我们：个券流动性既有本地成分，也有市场状态成分；把所有变化归因于公司新闻会漏掉共同冲击，把市场均值直接当因果控制又可能吸收传导机制。
          研究设计必须先决定共同流动性是混淆、机制还是研究对象。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">27 · 主动练习</p>
        <h2>先写出任务、单位与主导维度，再展开答案</h2>
        <details>
          <summary>练习一 · 三项任务为什么让两个市场的排名反转？</summary>
          <div>
            <p><strong>题目。</strong>以下均为买入任务；depth 指 mid 至 +5 bp 的卖方累计显示量。市场 P：spread 1 bp、depth 50k，T<sub>90</sub>(20k)=0.2 秒，T<sub>90</sub>(400k)=60 秒，80% 恢复时间 90 秒。市场 Q：spread 4 bp、depth 800k，T<sub>90</sub>(20k)=1 秒，T<sub>90</sub>(400k)=6 秒，80% 恢复时间 8 秒。分别选择：①20k、deadline 0.5 秒；②400k、deadline 10 秒；③每 15 秒重复 200k 且要求 80% 恢复不超过 15 秒。</p>
            <details className="practice-answer"><summary>展开机制答案</summary><p>①选 P：它满足 0.5 秒并有更低小单价格入口；Q 的 1 秒违反硬时限。②选 Q：P 的 60 秒不满足期限，Q 的 depth 与 6 秒完成能力主导。③选 Q：P 的 90 秒恢复会让下一波持续撞上未修复状态，Q 的 8 秒满足恢复约束。排名变化来自 θ 改变，不是 liquidity 定义自相矛盾。</p></details>
          </div>
        </details>
        <details>
          <summary>练习二 · 从冻结订单簿计算 tightness 与 depth</summary>
          <div>
            <p><strong>题目。</strong>Best bid=99.99；卖盘为 100 股@100.01、300 股@100.02、600 股@100.05。计算 quoted spread、100.02 以内累计卖方 depth、400 股立即买单的静态 VWAP 与最后触及价，并说明为什么 VWAP 偏离不是完整 price impact。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>Best ask=100.01，所以 spread=0.02，mid=100.00。100.02 以内累计 depth=100+300=400 股。400 股 VWAP=(100×100.01+300×100.02)/400=100.0175，最后一股触及 100.02。Spread 是 tightness；累计量和 C(Q) 是静态 depth。该计算冻结订单簿，没有撤补单、隐藏量、其他交易、后续 mid 和无该订单时的反事实，因此不能识别暂时、持久或因果 price impact。</p></details>
          </div>
        </details>
        <details>
          <summary>练习三 · Immediacy 的价值怎样取决于未完成损失？</summary>
          <div>
            <p><strong>题目。</strong>Immediate route 在期限内 100% 完成，成本 5 bp。Passive route 有 60% 概率在期限内以 1 bp 完成；未完成时任务损失 12 bp。按教学式期望损失比较。若未完成损失改为 4 bp，选择是否改变？</p>
            <details className="practice-answer"><summary>展开计算答案</summary><p>第一种设定下，被动路径期望损失=0.6×1+0.4×12=5.4 bp，高于立即路径的 5 bp，因此购买 immediacy 更好。未完成损失降为 4 bp 后，被动路径=0.6×1+0.4×4=2.2 bp，选择反转。市场数据没有改变，改变的是任务损失函数；这正说明 immediacy 的经济价值不是市场的孤立常数。</p></details>
          </div>
        </details>
        <details>
          <summary>练习四 · 两个状态变量为什么有两个恢复时钟？</summary>
          <div>
            <p><strong>题目。</strong>Baseline spread=2 bp、depth=1,000k；冲击后为 10 bp、200k；5 秒为 6 bp、400k；15 秒为 3 bp、700k；30 秒为 2 bp、900k。用离散观测定义 spread 的 50% recovery time 与 depth 的 80% recovery time。</p>
            <details className="practice-answer"><summary>展开计算答案</summary><p>Spread 初始偏离为 8 bp；5 秒时仍偏离 4 bp，恰好修复 50%，所以首次观测到的 τ<sub>spread</sub>(50%)=5 秒。Depth 损失为 800k；修复 80% 要达到 200+0.8×800=840k，15 秒的 700k 不足，30 秒的 900k 达标，因此 τ<sub>depth</sub>(80%)=30 秒。结论必须保留变量和阈值，不能说“市场恢复时间就是 5 秒”。</p></details>
          </div>
        </details>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">28 · 理解检查</p>
        <h2>真正掌握的标准，是能指出一个 liquidity 结论还缺少哪些条件</h2>
        <details><summary>1. 同一市场能否同时对小单“流动”、对大单“不流动”？</summary><p>可以。小单可能只面对窄 spread，大单会沿订单簿进入 depth、扫簿成本和完成时间；任务规模改变了绑定维度。</p></details>
        <details><summary>2. 两个市场 spread 相同，能否说 liquidity 相同？</summary><p>不能。最多说指定时点、报价集合和小单口径的 observed tightness 相同；depth、immediacy、resiliency、费用与隐藏/跨场所供给仍可不同。</p></details>
        <details><summary>3. 五档 depth 是否等于交易者能保证取得的数量？</summary><p>不等于。显示订单可以撤销，存在队列竞争、延迟、隐藏量、其他场所与新订单；五档还因 tick 和价格水平而跨资产不可直接比较。</p></details>
        <details><summary>4. 50 微秒确认、60 秒内只有 35% 完成的订单是否具有高经济 immediacy？</summary><p>对短期限任务没有。确认 latency 是技术处理速度，economic immediacy 要在同一 Q、价格约束和状态下看完整成交分布。</p></details>
        <details><summary>5. 冲击前 depth 很大，是否证明 resiliency 很高？</summary><p>不能。Depth 是冲击前存量；resiliency 要观察冲击后数量是否留存、是否补回、以什么概率和速度接近哪个基准。</p></details>
        <details><summary>6. 新闻后 mid 没回旧水平，是否证明市场没有恢复？</summary><p>不能。若新闻改变合理价值，价格留在新水平是价格发现；应检查 spread、depth 和执行能力是否围绕新基准重新形成。</p></details>
        <details><summary>7. 高成交量为什么可能与 poor liquidity 同时出现？</summary><p>Volume 衡量已实现交易需求；压力中需求可以激增，而提供者同时撤单、减少承接，使 spread、depth 与单位流量价格变化恶化。</p></details>
        <details><summary>8. Amihud 指标高能否证明屏幕订单簿很浅？</summary><p>不能。它是日频绝对收益/成交金额 proxy，混合波动、新闻、交易量和制度；可以与 illiquidity 相关，却不能直接识别某时点显示 depth。</p></details>
        <details><summary>9. Spread 十秒恢复、depth 六十秒恢复时，“市场恢复时间”是多少？</summary><p>没有无条件单一答案。必须分别报告变量、基准和阈值；若任务依赖重复大单，depth 时钟可能比 spread 时钟更关键。</p></details>
        <details><summary>10. Market liquidity 恶化是否等于 funding liquidity 已恶化？</summary><p>不等于。二者概念不同；要证明连接，需要融资、保证金、资产负债表与报价行为证据，双向强化留给 7.11。</p></details>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">29 · 课程接口</p>
        <h2>四维坐标把“流动性好不好”改写成动态问题，也为后续机制留下清晰边界</h2>
        <p>
          1.04 给出订单簿状态，1.05 解释 spread 的经济来源；本节把 spread 降回 tightness 的局部投影，并加入数量、时间与恢复。下一节 1.07 将聚焦订单簿怎样被消耗、补单与撤单怎样形成不同恢复路径，以及如何在 event time 和 calendar time 中测量 depth / resiliency。
          1.08 会把订单事件聚合成 order flow，1.09 才会讨论价格为什么随订单变化，以及 temporary / permanent impact 如何区分。
        </p>
        <p>
          更外层的接口同样重要。1.14 会解释流动性提供者为何可能在压力中一起撤退；2.07 与 2.16 会加入 broker–dealer 资产负债表和风险限额；7.11 再把 funding 与 market liquidity 闭合成反馈。
          走到这些章节时，本节的任务条件仍是防止概念膨胀的锚：面对任何 liquidity 结论，先问<strong>哪一方向、多少数量、多长时间、允许多大成本、要求多高完成概率、在哪种状态，以及证据究竟观测了哪个投影。</strong>
        </p>
      </section>
    </>
  );
}

export const lesson106: LessonRecord = {
  slug: '1-06',
  id: '1.06',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Liquidity 的四个维度',
  subtitle: '从单一标签到任务条件化的成本—数量—时间—恢复系统',
  readingTime: '约 82–90 分钟（核心阅读 49–53＋互动 12–14＋主动练习 21–23）',
  prerequisite: '1.04 · Limit Order Book 的结构；建议先完成 1.05 Bid–Ask Spread；按需回看 T01 Price / Return 与 T08 Time Scale',
  updatedAt: '2026-08-28',
  revision: '1.06-r3',
  reviewStatus: 'double-reviewed',
  previous: { slug: '1-05', label: '1.05 Bid–Ask Spread 为什么存在' },
  next: { slug: '1-07', label: '1.07 Market Depth 与 Resiliency' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.06-r1',
      summary: '首轮学术审阅未发现 blocker 或 major；四维分类、公式、练习数值、2020 年美债官方口径与 21 条引用均通过，并建议进一步统一 full spread、恢复条件集及删失模型措辞。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.06-r1',
      summary: '要求消除市场命名和固定选项位置造成的答案泄露，提高实验核心文字字号，并修正混向柱图、模式焦点、live region 与进阶内容顺序。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.06-r2',
      summary: 'r1 的五项精度建议全部解决；full spread、单向 concession、条件 τ50、成交删失、ask-side depth、四道答案与全部引用通过回归核验。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.06-r2',
      summary: 'r1 的两项 major 与六项 minor 全部解决；中性预测、非固定答案位置、字号、焦点、live region、内容顺序及窄屏布局通过，并留下三项不阻碍批准的微调建议。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.06-r3',
      summary: '最终版的恢复摘要边界、任务 04 唯一答案、通用错误诊断、模式焦点、公式、21 条引用与案例数据全部通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.06-r3',
      summary: '最终版三项微调全部解决；无新的预测泄露、答案歧义、焦点回归、读屏重复或窄屏问题，未发现 blocker、major 或 minor。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'task-first', label: '先定义交易任务' },
    { id: 'four-projections', label: '四种直白投影' },
    { id: 'taxonomy', label: '分类不是自然定律' },
    { id: 'opportunity-set', label: '进阶统一化表达' },
    { id: 'tightness', label: 'Tightness' },
    { id: 'tightness-boundary', label: 'Tightness 的盲区' },
    { id: 'depth', label: 'Depth' },
    { id: 'static-sweep', label: '静态执行曲线' },
    { id: 'lambda', label: 'Kyle λ 的边界' },
    { id: 'immediacy', label: 'Immediacy' },
    { id: 'fill-measurement', label: '成交时间测量' },
    { id: 'resiliency', label: 'Resiliency' },
    { id: 'multiple-clocks', label: '多个恢复时钟' },
    { id: 'interactions', label: '四维相互作用' },
    { id: 'surface', label: 'Size × Horizon × State' },
    { id: 'observability', label: '可观察边界' },
    { id: 'proxy-hierarchy', label: '指标层级' },
    { id: 'low-frequency-proxies', label: '低频 Proxy 审计' },
    { id: 'aggregation', label: '单位与聚合' },
    { id: 'composite-score', label: 'Composite Score' },
    { id: 'liquidity-lab', label: '双模式互动实验' },
    { id: 'march-2020', label: '2020 年 3 月美债' },
    { id: 'case-clocks', label: '案例恢复时钟' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'pressure-boundary', label: 'Market vs Funding' },
    { id: 'research-design', label: '研究设计' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson106Content,
  references: [
    {
      id: 1,
      authors: 'Albert S. Kyle',
      year: '1985',
      title: 'Continuous Auctions and Insider Trading',
      publication: 'Econometrica, 53(6), 1315–1335',
      url: 'https://doi.org/10.2307/1913210',
      use: 'Tightness、depth、resiliency 三维的经典理论起点，以及线性价格规则中的 λ / inverse-depth 语言；特定信息结构与线性模型不能外推为通用经验恒等式。',
    },
    {
      id: 2,
      authors: 'Abdourahmane Sarr & Tonny Lybek',
      year: '2002',
      title: 'Measuring Liquidity in Financial Markets',
      publication: 'IMF Working Paper No. 2002/232',
      url: 'https://doi.org/10.5089/9781451875577.001',
      use: '多指标测量综述，并明确列出 tightness、immediacy、depth、breadth、resiliency 五维及不存在单一普遍指标；working paper 观点不代表 IMF 政策。',
    },
    {
      id: 3,
      authors: 'Committee on the Global Financial System',
      year: '1999',
      title: 'Market Liquidity: Research Findings and Selected Policy Implications',
      publication: 'CGFS Papers No. 11, Bank for International Settlements',
      url: 'https://www.bis.org/publ/cgfs11.htm',
      use: '跨中央银行研究对市场流动性决定因素、压力状态与测量的政策框架；历史市场结构结论需按当前制度更新。',
    },
    {
      id: 4,
      authors: 'Thierry Foucault, Marco Pagano & Ailsa Röell',
      year: '2013',
      title: 'Market Liquidity: Theory, Evidence, and Policy',
      publication: 'Oxford University Press',
      url: 'https://doi.org/10.1093/acprof:oso/9780199936243.001.0001',
      use: 'Market microstructure、liquidity measurement、order flow、depth、LOB 与价格动态的系统教材；本节统一机会集是自己的教学表达，不归于该书。',
    },
    {
      id: 5,
      authors: 'Dimitri Vayanos & Jiang Wang',
      year: '2013',
      title: 'Market Liquidity—Theory and Empirical Evidence',
      publication: 'Handbook of the Economics of Finance, Vol. 2B, Chapter 19, 1289–1361',
      url: 'https://doi.org/10.1016/B978-0-44-459406-8.00019-6',
      use: '以参与成本、交易成本、信息不对称、竞争、融资约束与搜索组织理论和经验测量，支持“代理需由机制解释”而非单指标定义。',
    },
    {
      id: 6,
      authors: 'Harold Demsetz',
      year: '1968',
      title: 'The Cost of Transacting',
      publication: 'Quarterly Journal of Economics, 82(1), 33–53',
      url: 'https://doi.org/10.2307/1882244',
      use: '把 spread 解释为有组织市场中立即交换的价格，为 tightness 与 immediacy 的经济联系提供经典起点。',
    },
    {
      id: 7,
      authors: 'Thierry Foucault, Ohad Kadan & Eugene Kandel',
      year: '2005',
      title: 'Limit Order Book as a Market for Liquidity',
      publication: 'Review of Financial Studies, 18(4), 1171–1217',
      url: 'https://doi.org/10.1093/rfs/hhi029',
      use: '耐心异质性、到达率、spread、交易频率、resiliency 与限价单执行时间的动态联系；模型比较静态不作为真实市场参数。',
    },
    {
      id: 8,
      authors: 'Michael J. Fleming',
      year: '2003',
      title: 'Measuring Treasury Market Liquidity',
      publication: 'Federal Reserve Bank of New York Economic Policy Review, 9(3), 83–108',
      url: 'https://www.newyorkfed.org/research/staff_reports/sr133.html',
      use: '系统比较美国国债 spread、size、volume、frequency、price impact 与其他指标，显示成交量/频率是弱代理且不同指标相关性不等。',
    },
    {
      id: 9,
      authors: 'Yakov Amihud',
      year: '2002',
      title: 'Illiquidity and Stock Returns: Cross-section and Time-series Effects',
      publication: 'Journal of Financial Markets, 5(1), 31–56',
      url: 'https://doi.org/10.1016/S1386-4181(01)00024-6',
      use: '日频绝对收益/美元成交量 illiquidity proxy 与资产定价；方便的低频指标不能被称为纯 depth 或因果 price impact。',
    },
    {
      id: 10,
      authors: 'Ľuboš Pástor & Robert F. Stambaugh',
      year: '2003',
      title: 'Liquidity Risk and Expected Stock Returns',
      publication: 'Journal of Political Economy, 111(3), 642–685',
      url: 'https://doi.org/10.1086/374184',
      use: '基于订单流相关收益反转的 aggregate liquidity measure 与 liquidity risk 定价，支持区分当前 level、恢复与未来状态风险。',
    },
    {
      id: 11,
      authors: 'Joel Hasbrouck & Duane J. Seppi',
      year: '2001',
      title: 'Common Factors in Prices, Order Flows, and Liquidity',
      publication: 'Journal of Financial Economics, 59(3), 383–411',
      url: 'https://doi.org/10.1016/S0304-405X(00)00091-X',
      use: '价格、订单流与多种 liquidity proxies 的共同因子及差异，支持区分个券与市场状态，并说明指标共同性并非相同。',
    },
    {
      id: 12,
      authors: 'Jeremy Large',
      year: '2007',
      title: 'Measuring the Resiliency of an Electronic Limit Order Book',
      publication: 'Journal of Financial Markets, 10(1), 1–25',
      url: 'https://doi.org/10.1016/j.finmar.2006.09.001',
      use: '以连续时间响应同时刻画订单簿补充的概率与速度；特定 Barclays / LSE 历史样本结果不作为普遍恢复常数。',
    },
    {
      id: 13,
      authors: 'Anna A. Obizhaeva & Jiang Wang',
      year: '2013',
      title: 'Optimal Trading Strategy and Supply/Demand Dynamics',
      publication: 'Journal of Financial Markets, 16(1), 1–32',
      url: 'https://doi.org/10.1016/j.finmar.2012.09.001',
      use: '动态供求恢复如何影响最优执行，支持静态 depth 与 resiliency 共同决定大单路径；模型参数不对应本节合成实验。',
    },
    {
      id: 14,
      authors: 'Lawrence E. Harris',
      year: '1994',
      title: 'Minimum Price Variations, Discrete Bid–Ask Spreads, and Quotation Sizes',
      publication: 'Review of Financial Studies, 7(1), 149–178',
      url: 'https://doi.org/10.1093/rfs/7.1.149',
      use: 'Tick、离散 spread 与报价数量之间的市场设计权衡；历史制度证据不支持“更小 tick 必然全面改善所有维度”。',
    },
    {
      id: 15,
      authors: 'Nander de Vette, Benjamin Klaus, Simon Kördel & Andrzej Sowiński',
      year: '2023',
      accessedAt: '2026-08-28',
      title: 'Gauging the Interplay between Market Liquidity and Funding Liquidity',
      publication: 'Financial Stability Review, May 2023 — Special Feature',
      url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/special/html/ecb.fsrart202305_01~830184261b.en.html',
      use: '五个测量子维度、窄 spread 可掩盖低可交易数量，以及 market / funding liquidity 区分；欧元债券框架不机械外推到所有资产。',
    },
    {
      id: 16,
      authors: 'Michael J. Fleming',
      year: '2020',
      accessedAt: '2026-08-28',
      title: 'Treasury Market Liquidity and the Federal Reserve during the COVID-19 Pandemic',
      publication: 'Federal Reserve Bank of New York, Liberty Street Economics, May 29, 2020',
      url: 'https://libertystreeteconomics.newyorkfed.org/2020/05/treasury-market-liquidity-and-the-federal-reserve-during-the-covid-19-pandemic/',
      use: '2020 年 3 月 on-the-run 电子 interdealer 国债市场的 spread、depth、price impact 与政策时序；作者明确声明观点不代表纽约联储，且样本可能低估其他分部恶化。',
    },
    {
      id: 17,
      authors: 'Financial Stability Board',
      year: '2020',
      accessedAt: '2026-08-28',
      title: 'Holistic Review of the March Market Turmoil',
      publication: 'Report to the G20, 17 November 2020',
      url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/',
      use: 'March 2020 跨市场现金需求、NBFI、Treasury sales、dealer intermediation 与政策响应的官方事后综述；金额和机制表述为多项贡献因素，不作单一因果归因。',
    },
    {
      id: 18,
      authors: 'David A. Lesmond, Joseph P. Ogden & Charles A. Trzcinka',
      year: '1999',
      title: 'A New Estimate of Transaction Costs',
      publication: 'Review of Financial Studies, 12(5), 1113–1141',
      url: 'https://doi.org/10.1093/rfs/12.5.1113',
      use: '利用 zero returns 估计低频交易成本的经典方法；零收益频率也受价格网格、停牌、陈旧价格与真实无信息状态影响。',
    },
    {
      id: 19,
      authors: 'Staffs of the U.S. Department of the Treasury, Board of Governors of the Federal Reserve System, Federal Reserve Bank of New York, U.S. Securities and Exchange Commission & U.S. Commodity Futures Trading Commission',
      year: '2021',
      accessedAt: '2026-08-28',
      title: 'Recent Disruptions and Potential Reforms in the U.S. Treasury Market: A Staff Progress Report',
      publication: 'Inter-Agency Working Group for Treasury Market Surveillance, 8 November 2021',
      url: 'https://home.treasury.gov/system/files/136/IAWG-Treasury-Report.pdf',
      use: '2020 年 3 月 Treasury 成交量、spread、depth 与 price impact 的官方精确数值和口径；报告为跨机构 staff findings，参与机构未对其中分析或选项表达立场。',
    },
    {
      id: 20,
      authors: 'Alex Aronovich, Dobrislav Dobrev & Andrew Meldrum',
      year: '2021',
      accessedAt: '2026-08-28',
      title: 'The Treasury Market Flash Event of February 25, 2021',
      publication: 'Board of Governors of the Federal Reserve System, FEDS Notes, May 14, 2021',
      url: 'https://www.federalreserve.gov/econres/notes/feds-notes/the-treasury-market-flash-event-of-february-25-2021-20210514.html',
      use: '10 年期 on-the-run 前五档 depth、三日移动平均、75% 恢复阈值与疫情冲击 57 个营业日的比较口径；该数值不是通用恢复半衰期。',
    },
    {
      id: 21,
      authors: 'Andrew W. Lo, A. Craig MacKinlay & June Zhang',
      year: '2002',
      title: 'Econometric Models of Limit-Order Executions',
      publication: 'Journal of Financial Economics, 65(1), 31–71',
      url: 'https://doi.org/10.1016/S0304-405X(02)00134-4',
      use: '区分限价订单 time-to-first-fill 与 time-to-completion，并支持用订单生命周期、删失和完成分布测量 immediacy；历史样本与模型设定不是通用成交分布。',
    },
  ],
  readingList: [
    {
      title: 'Continuous Auctions and Insider Trading',
      scope: '理论原点 · Kyle（1985），重点读 p.1316 对 tightness、depth、resiliency 的定义与 λ 的模型角色',
      reason: '亲自核对经典三维，而不是从二手材料误记成“四维”；同时理解 inverse depth 只有在特定线性模型中成立。',
      url: 'https://doi.org/10.2307/1913210',
    },
    {
      title: 'Measuring Liquidity in Financial Markets',
      scope: '测量地图 · Sarr & Lybek（2002），读五维分类、四类指标、市场特定因素与结论',
      reason: '看到为什么多个指标会在危机中发出混合信号，以及 breadth 为什么在部分框架中被单列。',
      url: 'https://doi.org/10.5089/9781451875577.001',
    },
    {
      title: 'Market Liquidity · Chapters 2–4',
      scope: '系统教材 · Foucault、Pagano、Röell；测量、订单流/价格动态与 trade size / depth',
      reason: '把指标重新连接到市场微观结构机制，避免用数据便利性决定概念定义。',
      url: 'https://doi.org/10.1093/acprof:oso/9780199936243.001.0001',
    },
    {
      title: 'Measuring Treasury Market Liquidity',
      scope: '经验审计 · Fleming（2003），比较 spread、size、volume、frequency、impact 与跨券关系',
      reason: '训练自己判断“某指标与坏状态相关”与“它是流动性的充分统计量”之间的距离。',
      url: 'https://www.newyorkfed.org/research/staff_reports/sr133.html',
    },
    {
      title: 'Measuring the Resiliency of an Electronic Limit Order Book',
      scope: '动态测量 · Large（2007），读 shock、replenishment probability、continuous-time response 与 half-life',
      reason: '理解恢复速度必须与恢复是否发生一起报告，并为 1.07 的订单簿动态奠基。',
      url: 'https://doi.org/10.1016/j.finmar.2006.09.001',
    },
    {
      title: 'Holistic Review of the March Market Turmoil',
      scope: '历史案例 · FSB（2020），重点读 market functioning、Treasury propagation 与 dealer intermediation',
      reason: '把多维指标放回真实的卖盘、中介容量、跨市场传导与政策响应，同时练习不把并发事件写成单因果故事。',
      url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/',
    },
    {
      title: 'Recent Disruptions and Potential Reforms in the U.S. Treasury Market',
      scope: '官方口径 · IAWG（2021），重点读 March 2020 的 volume、spread、depth、price impact 与市场结构限制',
      reason: '用同一官方报告核对四类指标的精确数值，同时注意 staff report 的制度立场边界与分市场覆盖范围。',
      url: 'https://home.treasury.gov/system/files/136/IAWG-Treasury-Report.pdf',
    },
  ],
};
