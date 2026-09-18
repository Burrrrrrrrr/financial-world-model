import LiquidityCompetitionLab from '../components/LiquidityCompetitionLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson114Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>做市竞争是否稳定流动性，取决于竞争者的行动怎样同时改变“被成交的概率”与“成交后的条件净价值”：净价值为正时，退出留下可被新资本填补的机会；净价值为负时，更高成交概率反而把有害成交集中给留下者，理性撤单会相互放大。</h2>
        <p>
          1.12 解释了为什么市场需要有人暂时承接不同时到达的买卖意愿，1.13 又解释了单一做市商怎样把库存状态映射为价格、数量、对冲和参与决策。本节只增加一个看似简单、实则改变整个系统的问题：如果许多供应者同时观察订单簿并调整自己的 quote，任何一张订单的成交机会就不再只由外部订单流决定，还取决于其他人报在什么价格、排在队列什么位置、何时撤单以及是否继续承担风险。Ho–Stoll 将 dealer 的库存定价推进到竞争环境；Parlour、Foucault–Kadan–Kandel 与 Roşu 则从不同动态订单簿模型说明，执行机会、耐心和竞争状态会内生决定价差与队列。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <p>
          因而“供应者越多，流动性越好”只能是待检验的局部命题。平静时，更多人争夺同一笔可盈利的被动成交，常会改善价格、补充深度并缩短过时报价的寿命；压力时，公共信息、maker-side adverse markout、库存集中或 hedge cost 可能同时恶化，使每次成交的条件净价值转负。竞争者退出会提高留下者被击中的概率，此时原本稳定系统的替代机制转成放大损失的互补机制。速度既能帮助供应者更快加入和更新报价，也能帮助其更快逃离 stale quote；HFT 因而不是固定的“流动性提供者”身份，而是一组低延迟、高自动化、短持仓和高消息活动常见特征的重叠集合。SEC 也明确指出，HFT 没有一个单一、清晰且穷尽的定义。<Cite n={6} /><Cite n={10} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>区分 firm、strategy、order role 与 market outcome，不再把 HFT、算法交易和做市商当成同义词。</li>
            <li>把单张限价单拆成条件成交净边际 g、成交概率、规模与固定成本，并说明参与阈值。</li>
            <li>解释 price competition、queue competition 与 relative latency 怎样共同改变执行权。</li>
            <li>用同一个 ΔV 公式说明竞争何时形成补单负反馈、何时形成撤单正反馈。</li>
            <li>分别测量 spread、depth、fill、resiliency 与尾部执行，不用单一指标宣判“流动性改善”。</li>
            <li>按理论、身份数据、活动代理、准实验和压力过程证据读取 HFT 文献，并提出可证伪研究。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="object-map">
        <p className="section-kicker">01 · 先把分析单位分开</p>
        <h2>公司名称、交易台、策略、订单、报价角色和市场结果处在不同层级；一个主体可以逐单换角色，一张订单也不能代表整家公司。</h2>
        <div className="table-scroll" role="region" aria-label="流动性供应竞争对象地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从组织身份到市场结果的六层地图</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">对象</th><th scope="col">它回答什么</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">组织</th><td>firm / participant ID / desk</td><td>谁拥有账户、资本和风险限额？</td><td>每张订单都是同一策略</td></tr>
              <tr><th scope="row">能力</th><td>算法、共址、连接与端到端 latency</td><td>能多快感知、计算并让消息抵达撮合引擎？</td><td>必然供给或拿走流动性</td></tr>
              <tr><th scope="row">策略</th><td>电子做市、套利、执行、方向交易、hedge</td><td>在什么状态下追求什么收益并受何约束？</td><td>一个技术标签的永久身份</td></tr>
              <tr><th scope="row">订单</th><td>resting limit、marketable order、cancel / replace</td><td>这一条消息此刻增加、消耗还是修改显示供给？</td><td>主体的全部净风险承接</td></tr>
              <tr><th scope="row">报价</th><td>price、size、queue rank、age</td><td>这张订单以什么优先权等待哪种成交？</td><td>可执行到任意规模的资本</td></tr>
              <tr><th scope="row">结果</th><td>spread、depth、fill、markout、impact、resiliency</td><td>市场不同维度怎样变化？</td><td>一个维度可替代全部市场质量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          本节把 functional liquidity provider 定义为“在当前观察窗口用可成交订单提供即时性的主体”，不要求它拥有正式做市牌照。Designated market maker（DMM）是承担特定制度权利或义务的指定做市商；principal trading firm（PTF）通常以自有资本交易而非代客户执行。两者都可能使用高速技术，但法律身份、义务与策略并不相同。Hagströmer–Nordén 的 participant-ID 研究正因为能把 market-making 与 opportunistic HFT 分开，才说明“HFT 平均效应”会掩盖关键异质性。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 本节范围契约</p>
        <h2>先固定一只证券、一个连续限价订单簿、既定 tick、费用和撮合规则，才看得清竞争本身改变了什么。</h2>
        <p>
          连续限价订单簿（continuous limit order book，CLOB）在营业时间内逐条接收订单并按既定优先规则撮合。本节假定研究者已经知道规则版本，并把其他 venue、相关证券和 hedge 市场的状态当作外生控制或边界条件。这样可以专注于多个供应者怎样选择 price、displayed size、queue、cancel 和 participation，以及这些动作怎样改变彼此的成交概率与风险集中。
        </p>
        <div className="boundary-box">
          <b>明确留给后续章节</b>
          <p>Tick 大小怎样把价格竞争推向队列竞争留给 1.18；跨 venue fragmentation、routing、SIP / direct feed 与跨市场 latency arbitrage 留给 1.11、2.08 和 4.12；HFT 的完整目标函数、技术投资与策略工程留给 2.08；融资约束和跨资产网络怎样把局部撤回扩成系统事件留给 7.11 与 7.14。Frequent batch auction 或 speed bump 只作为边界反例，不在本节做制度优劣裁决。</p>
        </div>
        <p>
          这个边界也防止把 1.13 重写一遍：每个供应者仍有库存、内部价值、风险限额和 hedge cost，但本节不再推导单主体 reservation price。唯一升级是把原来近似外生的 fill function 改成所有竞争者行动共同决定的对象。
        </p>
      </section>

      <section className="lesson-section" id="hft-definition">
        <p className="section-kicker">03 · HFT 不是一种固定策略</p>
        <h2>Algorithmic trading、HFT、low latency 与 electronic market making 彼此重叠，却不构成从宽到窄的唯一分类树。</h2>
        <div className="table-scroll" role="region" aria-label="算法与高频交易术语比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>术语必须按用途而非情绪标签使用</caption>
            <thead><tr><th scope="col">术语</th><th scope="col">最小含义</th><th scope="col">可能做什么</th><th scope="col">不自动意味着</th></tr></thead>
            <tbody>
              <tr><th scope="row">Algorithmic trading</th><td>由程序决定订单的时点、价格、数量或管理</td><td>客户执行、做市、套利、风险控制</td><td>持仓很短或速度领先</td></tr>
              <tr><th scope="row">Low-latency trading</th><td>把感知到撮合结果的延迟压低</td><td>更快加入、取消、hedge 或主动交易</td><td>一定是高消息率或做市</td></tr>
              <tr><th scope="row">HFT</th><td>高速自动化、短持仓、频繁消息等特征的经验组合</td><td>被动供给、主动套利、执行与切换角色</td><td>单一法律身份或永久策略</td></tr>
              <tr><th scope="row">Electronic market making</th><td>持续或状态依赖地用电子限价单赚取供给收益</td><td>双边 quote、库存控制、快速更新</td><td>所有成交均被动或必须高频</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          SEC 2010 年概念稿列举了极高速程序、共址、高消息率、极短建仓平仓和近乎日终平仓等常见特征，同时强调没有一个单一清晰定义；2020 年工作人员报告也把算法交易的正常状态贡献与异常压力中的潜在风险并列，而非把所有程序交易归为同一行为。<Cite n={10} /><Cite n={28} /> 因而本节只在研究具有 participant identity 时使用“HFT 主体”，在只能观察消息模式时写“low-latency activity proxy”，在逐单机制中则直接写 passive 或 aggressive order role。
        </p>
      </section>

      <section className="lesson-section" id="quote-lifecycle">
        <p className="section-kicker">04 · Quote lifecycle</p>
        <h2>竞争发生在完整订单生命周期中，而不是只发生在屏幕快照上的最终价差。</h2>
        <div className="mechanism-chain" aria-label="竞争性报价生命周期">
          {[
            ['状态冻结', '读取公共价格、queue、库存、风险限额、fees 与竞争者状态'],
            ['形成消息', '选择 price、size、venue action 与是否 cancel / replace'],
            ['传输与排队', '消息经过本地系统、网络、gateway 后由撮合引擎按 receipt time 接收'],
            ['获得优先权', 'resting order 按具体规则进入 queue，前方数量和后续新增持续变化'],
            ['竞争退出 / 状态更新', 'partial fill 更新剩余数量并继续等待；full fill、主动撤单、过期或拒单会终止，cancel / replace 通常终结原订单并生成新订单'],
            ['经济结果', '成交后计算 maker markout、费用、库存和 hedge；未成交也产生机会与技术成本'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Resting order 是已进入簿中等待别人主动成交的限价单；BBO 是 best bid and offer；partial fill 表示只成交显示数量的一部分；cancel / replace 通常会终结原订单并生成新优先时间，但具体规则必须按 venue 版本核验。本地收到市场数据的时钟、策略决定时钟、消息发出时钟与 exchange matching-engine receipt time 不是同一个时钟。若只保留每秒快照，研究者会看见报价“消失”，却不知道它先被成交、先被撤回，还是根本没抵达。
        </p>
      </section>

      <section className="lesson-section" id="one-to-many">
        <p className="section-kicker">05 · 从一个做市商到许多供应者</p>
        <h2>每个主体仍然优化自己的报价，但它的 fill intensity 现在依赖所有竞争者的 price、size、queue 和 latency。</h2>
        <p>
          对供应者 i 和一侧 s，沿用 1.13 的库存 q<sub>i</sub>、目标 q*<sub>i</sub>、偏离 x<sub>i</sub>、内部风险与 hedge cost。新增的关键是对手行动向量 a<sub>−i</sub>：其他人改善价格会把 i 移出 BBO；在同价前方增加 size 会延长 i 的 queue；撤单会缩短 queue；更快响应会在状态切换时先加入或先离开。于是 i 的成交概率必须条件于共同市场状态 X<sub>t</sub>、自身价格距离 δ<sub>i</sub>、queue ahead A<sub>i</sub>、size L<sub>i</sub>、端到端 latency ℓ<sub>i</sub> 和 a<sub>−i</sub>。
        </p>
        <div className="equation-card">
          <span>多主体成交机会</span>
          <div>P<sub>i</sub>(F | X<sub>t</sub>, δ<sub>i</sub>, A<sub>i</sub>, L<sub>i</sub>, ℓ<sub>i</sub>, a<sub>−i</sub>)</div>
          <p>F 表示原订单在撤单、失效或被替换前发生目标成交。这个概率不是主体单方面选择的参数，而是订单流、规则与所有竞争行动共同形成的均衡结果。</p>
        </div>
        <p>
          Parlour 的一 tick 动态模型说明，当前簿状态会通过未来执行概率改变 market / limit order 选择；Foucault–Kadan–Kandel 又把耐心差异、arrival rate 与 resiliency 联系起来。它们提供机制语言，而非现代高速订单簿的直接数值校准。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="net-fill-value">
        <p className="section-kicker">06 · 条件成交净边际</p>
        <h2>评价被动订单要先问“如果它真的成交，每股条件期望赚或亏多少”，再问它多大概率成交。</h2>
        <p>
          Maker 与 taker 描述的是逐笔成交中的角色，而不是一家公司的永久身份：maker 先把 resting order 留在订单簿中，后来被别人主动成交；taker 则发出可立即成交的订单，与簿中已有报价成交。同一主体可以在不同订单中切换角色，所以费用与返佣也必须按具体角色、venue、日期和费率版本匹配，不能仅凭公司标签分配。
        </p>
        <p>
          以 ask 为例，gross spread capture 是成交价格相对当时基准价值的毛距离；rebate 与 fee 是适用 maker / taker 费用；maker-side adverse markout 是在预先固定 horizon 上，成交后参考价值朝不利于 maker 的方向移动多少；incremental inventory risk 是这次成交给当前资产负债表增加的边际风险；hedge cost 则是把新增暴露转移到其他市场的预期成本。所有项目必须使用同一“每股货币单位”与同一成交条件。
        </p>
        <div className="equation-card">
          <span>单侧、每股的条件净边际</span>
          <div>g<sub>i,s</sub> = gross capture + rebate − fee − E[maker-side adverse markout | F] − incremental inventory risk − hedge cost</div>
          <p>g&gt;0 表示在给定成交条件与 horizon 下，每成交一股仍有正的期望边际；g&lt;0 表示“被成交”本身平均有害。它不是整家公司利润，也未计入成交概率、固定技术成本和尾部。</p>
        </div>
        <p>
          Stale quote 是新信息已改变可交易价值、但原报价尚未来得及更新的订单；被人以更优信息选择成交常称 picked off。Foucault–Röell–Sandås 的模型指出，监控报价有成本，监控更快可以减少被挑中过时报价的损失，但监控成本如何由供应者共同承担会改变竞争结果。<Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="order-value-participation">
        <p className="section-kicker">07 · 从每股边际到订单价值</p>
        <h2>一张订单是否值得提交，由成交概率、成交规模、条件净边际和该订单占用的固定资源共同决定。</h2>
        <div className="equation-card">
          <span>教学性订单价值与参与约束</span>
          <div>V<sub>i,s</sub> = P<sub>i</sub>(F before cancel / expiry | state, quote, queue, size, latency, competitors) · L<sub>i</sub> · g<sub>i,s</sub> − K<sub>i,s</sub></div>
          <p>L 是目标成交规模，K 是为维持这张订单分配的预期固定或机会成本。V≥0 是最小参与条件；真实系统还需处理部分成交、多个退出原因、动态改价和风险尾部。</p>
        </div>
        <p>
          这个分解避免两个常见错误。第一，较高 fill rate 不一定好：若 g 已为负，更多成交只会放大损失。第二，未成交并非“没有数据”或“没有成本”：它可能占据消息预算、queue capital、监控资源与错过其他价格的机会。实证中必须把所有进入风险集的订单保留下来，而不能只在已成交样本上回归 markout。
        </p>
      </section>

      <section className="lesson-section" id="zero-profit-boundary">
        <p className="section-kicker">08 · 竞争与 zero-profit 边界</p>
        <h2>自由进入会压缩可复制的经济租金，却不会让最优 spread 必然变成零。</h2>
        <p>
          Economic rent 是超过资本、风险与技术机会成本后的剩余收益。若某种报价可以公开复制、资金可无摩擦进入且新增供应者不改变成交质量，正租金会吸引竞争，改善价格或增加 size，直至边际进入者的 V 接近零。但 adverse markout、库存风险、hedge、fees、固定技术成本和 queue waiting 都必须从毛 capture 中支付；tick 还可能阻止价格连续改善；现有 queue position 又是一项状态依赖的执行权。零利润边界因此是“风险调整后边际进入价值接近零”，不是 bid=ask。
        </p>
        <p>
          Roşu 的对称信息动态订单簿模型预测，在其设定下更高竞争与活动可缩小 spread 和 price impact；Bongaerts–Van Achter 则让快慢交易者内生进入，显示速度与信息可改善流动性，但 winner’s curse 也可能挤出慢供应者并降低其执行和福利。两类结果并不矛盾：它们改变的是信息、进入成本与被选择风险的条件。<Cite n={4} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="price-competition">
        <p className="section-kicker">09 · Price competition</p>
        <h2>改善一个价格档位会赢得价格优先，却同时少收一部分毛补偿并改变被谁、在什么状态下成交。</h2>
        <p>
          假设当前 best ask 为 $100.02。新供应者报 $100.01，会在所有 $100.02 卖单之前成交；其 fill probability 通常上升，但每股 gross capture 少一美分，而且更靠近买方可接受区间，可能更容易被信息型订单选择。理性比较的是 V<sub>improve</sub> 与 V<sub>join</sub>，不是“更靠近 mid 总是更好”。当 tick 阻止更细价格时，竞争会转向同价 queue、size、连接速度或其他制度优先权；tick 本身的设计留给 1.18。
        </p>
        <p>
          价格改善也会改变对手。原 best ask 可能跟进、撤回或转向另一侧；后续投资者因此面对新的 spread 和 depth，订单流与 markout 再反馈到供应者收益。把一次价格改善的直接效果当作最终市场均衡，会漏掉这条战略响应链。
        </p>
      </section>

      <section className="lesson-section" id="queue-competition">
        <p className="section-kicker">10 · Queue competition</p>
        <h2>当许多订单报在同一价格，竞争从“谁给价更好”转成“谁在可成交队列中拥有更早、更多且仍有效的执行权”。</h2>
        <p>
          在常见 price–time priority 下，价格更优者先成交；同价时，较早被撮合引擎接收的订单先成交。Queue ahead 是同价、同侧排在目标订单之前的可执行数量。前方订单被成交或撤回会让目标向前移动，新订单通常排在其后；partial fill 又会让剩余数量继续等待。其他市场可能按 pro rata、规模或参与者类别分配，所以“queue rank”的定义必须连同 venue、产品、订单类型和规则版本记录。
        </p>
        <p>
          Queue position 的价值来自条件执行权：在有利流量到来时排在前方可能先获得 spread，但新闻刚发生时也可能先被打到 stale quote。它不是证券的 fundamental value，也不能脱离订单 age、前方数量、预计主动流、撤单行为和 markout 单独估值。Parlour 与 Foucault–Kadan–Kandel 的模型正是通过这种执行等待，把静态价差问题变成动态流动性市场。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="join-improve-cancel">
        <p className="section-kicker">11 · Join、Improve、Wait 还是 Cancel</p>
        <h2>供应者的动作集合至少包含加入现价队尾、改善一档、等待更好状态、撤回原单和退出该侧，而不是只有“扩 spread”。</h2>
        <div className="table-scroll" role="region" aria-label="供应者报价动作比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>四种动作改变不同价值分量</caption>
            <thead><tr><th scope="col">动作</th><th scope="col">可能得到</th><th scope="col">可能失去</th><th scope="col">关键状态</th></tr></thead>
            <tbody>
              <tr><th scope="row">Join</th><td>保留较高每股 capture</td><td>排在已有 size 后，期限内未必成交</td><td>queue ahead、flow、order age</td></tr>
              <tr><th scope="row">Improve</th><td>价格优先与更高 fill chance</td><td>更低 capture、可能更差 markout</td><td>tick、toxicity、库存急迫度</td></tr>
              <tr><th scope="row">Wait</th><td>避免在不确定状态暴露</td><td>错过正边际订单和 queue position</td><td>消息解析、机会到达、技术成本</td></tr>
              <tr><th scope="row">Cancel / exit</th><td>切断 stale、库存或限额风险</td><td>失去原 queue rank 与供给收入</td><td>relative latency、重入成本、义务</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          撤单因此不自动等于虚假流动性，更不自动构成 spoofing。正常价值更新、库存控制、queue 管理和系统保护都可能合法地产生高 cancel rate；操纵判断需要订单模式、可执行意图、行为上下文和适用法律证据。反过来，“合法撤单”也不表示它对市场质量没有外部性：许多理性个体同时撤回，仍会减少别人可立即使用的供给。
        </p>
      </section>

      <section className="lesson-section" id="queue-value-example">
        <p className="section-kicker">12 · Join / Improve 手算</p>
        <h2>价格少收多少与成交机会增加多少必须放进同一单位，才能判断竞争动作。</h2>
        <p>
          假设一张 100 股 ask 加入 $100.03 队尾时，期限内成交概率为 15%，成交条件净边际为 1.6 美分/股；改善到 $100.02 后获得价格优先，成交概率升至 50%，但净边际降为 0.6 美分/股。两种动作各有 $0.04 的订单级固定成本。所有数字只是教学参数，并非经验校准。
        </p>
        <div className="equation-card">
          <span>两种订单价值</span>
          <div>V<sub>join</sub> = 0.15 × 100 × $0.016 − $0.04 = $0.20　；　V<sub>improve</sub> = 0.50 × 100 × $0.006 − $0.04 = $0.26</div>
          <p>在这些条件下改善一档多 $0.06 的期望价值。但若更靠近 mid 使条件 markout 额外恶化 1 美分/股，improve 的 g 变成 −0.4 美分，V 变为 −$0.24，最优动作可能改为 join、wait 或 exit。</p>
        </div>
        <p>
          这个例子不是在教一个可交易规则，而是在训练反事实：只改变一个价格动作时，fill probability 与 conditional margin 必须同时重估。真实 queue 中，成交规模可能部分实现、概率会随状态更新，竞争者也会回应，静态算式只是决策树的第一层。
        </p>
      </section>

      <section className="lesson-section" id="competing-risks">
        <p className="section-kicker">13 · Fill–Cancel–Reprice competing risks</p>
        <h2>订单成交、主动撤单和因状态变化而失效是彼此竞争的终止事件；只研究已成交订单会产生选择偏差。</h2>
        <p>
          Hazard（风险率）是在订单仍存活到某时刻的条件下，下一瞬间发生某类事件的速率。若为教学而假设 fill、cancel 与 reprice 三个等待时间彼此独立且服从常强度指数分布，分别为 λ<sub>F</sub>、λ<sub>C</sub>、λ<sub>R</sub>，则 fill 最先发生的概率为：
        </p>
        <div className="equation-card">
          <span>仅用于教学的 competing-risks 基准</span>
          <div>P(F first) = λ<sub>F</sub> / (λ<sub>F</sub> + λ<sub>C</sub> + λ<sub>R</sub>)</div>
          <p>若三者分别为 3/s、4/s、3/s，则 fill 先发生的模型概率为 3/10=30%。这不是“每秒有三次成交”，而是三个终止时钟竞争后的累计结果。</p>
        </div>
        <p>
          真实 queue 不满足独立常强度：公共新闻会同时提高 cancel 与有害 fill；前方数量、partial fill、订单 age 和对手反应使 hazard 随时间变化；replace 还可能生成新的订单生命。研究者应重建完整 lifecycle，并用 cause-specific hazard 或 cumulative incidence（累计发生函数）明确估计哪种事件先发生，而不是把取消样本删掉后把成交概率当普通分类问题。
        </p>
      </section>

      <section className="lesson-section" id="relative-latency">
        <p className="section-kicker">14 · Relative latency</p>
        <h2>“更快”必须相对某条信息—决策—撮合路径定义；更早发出消息不等于更早被交易所接受。</h2>
        <p>
          End-to-end latency 从相关市场事件发生或被接收到，本地数据解析、策略计算、风险检查、网络传输、gateway 处理，直到 matching engine receipt，再到确认返回。Co-location 只是把设备部署在接近交易所基础设施的位置，以缩短并稳定其中一段；它不删除软件、风控和撮合排队。研究若只测网络 round-trip，可能遗漏真正决定“先入队或先撤掉”的瓶颈。
        </p>
        <p>
          速度价值通常是相对的。若所有人都从 100 微秒降到 20 微秒，抵达顺序可能不变，但 stale exposure 可以下降；绝对监控改善可能降低风险，却未必改变谁赢 queue。若只有一方从 100 降到 80 微秒，它还可能重排大量边界事件。Hoffmann 的快慢交易者模型正是把更快 quote revision 的效率收益与慢供应者策略改变放在同一均衡中。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="two-races">
        <p className="section-kicker">15 · 同一技术参加两种 race</p>
        <h2>平静时争的是 first in queue，新闻后争的是 first out of stale quote；速度既支持供给，也支持撤回。</h2>
        <div className="table-scroll" role="region" aria-label="两类速度竞争比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先加入与先退出使用同一套基础设施，却产生不同市场结果</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">竞争对象</th><th scope="col">私人收益</th><th scope="col">市场层结果</th></tr></thead>
            <tbody>
              <tr><th scope="row">平静 / 正 g</th><td>先改善价格、先占同价 queue</td><td>更多有利 fill 与 queue rent</td><td>更紧报价、更快补单，也可能更薄 size</td></tr>
              <tr><th scope="row">公共新闻 / stale risk</th><td>先取消旧 quote 或先主动成交别人的旧 quote</td><td>避免被挑中，或获得 latency-arbitrage 转移收益</td><td>陈旧报价寿命缩短，同时显示 depth 可瞬时下降</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Budish–Cramton–Shim 把连续时间市场中的公开套利机会描述为速度军备竞赛；Aquilina–Budish–O’Neill 用 LSE/FCA message data 直接重建类似竞赛。它们讨论的是连续处理规则下微小到达先后如何分配交易机会，不表示每一条高速消息都是 latency arbitrage。<Cite n={8} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="stale-quote-news">
        <p className="section-kicker">16 · 公共新闻也会产生 adverse selection</p>
        <h2>信息不必私有：只要不同主体把同一公共信号转成撮合消息的速度不同，旧报价就可能被更快者选择。</h2>
        <p>
          假设相关期货公开跳升，而股票 ask 尚停在旧值。更快主体可以买入旧 ask，慢做市商成交后面对负 maker markout。信息来源是公开且对称的，优势来自处理与传输时差；这与掌握未公开重大信息在经济与法律上完全不同。若做市商能够更快取消，它的 stale-loss 下降，因而平静状态可能愿意报得更紧；若所有人都投入只为重排同一公开事件的微秒先后，私人回报又可能主要来自相互转移。
        </p>
        <p>
          Biais–Foucault–Moinas 在模型中同时得到更快搜索的匹配收益与给慢方造成 adverse-selection externality 的速度投资，因而可能出现社会意义上的过度投资；Menkveld–Zoican 则把 faster exchange 的两股力量分开：更快更新 quote 可收紧 spread，更快“bandit”相遇又可扩大 spread，净效应取决于新闻与流动性交易的相对强度。两者都是条件性模型结论。<Cite n={7} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="normal-equilibrium">
        <p className="section-kicker">17 · 正常状态的竞争均衡</p>
        <h2>当多数边际成交的 g 为正，价格改善、补单和技术规模经济通常把可复制租金压向进入成本，并让公开信息更快进入报价。</h2>
        <p>
          正常状态的负反馈可以这样展开：某供应者撤回后，inside queue 变短或 spread 变宽；留下者与潜在进入者的 fill chance 和 gross capture 上升；若 adverse markout、库存与 hedge cost 没有同步恶化，V 上升，于是有人加回 size 或改善价格；新增供给又压低 fill rent，直至边际参与者接近零风险调整价值。竞争因而可以提高 tightness 与 replenishment，而无需假设供应者出于公共责任行动。
        </p>
        <p>
          速度在这里也可能是生产性投入：更快监控降低 stale exposure，使相同风险预算支持更紧 quote。Baldauf–Mollner 的模型同时提醒，更快 HFT 虽可改善 spread，却可能削弱基本面信息生产激励；“价格更快反映已有信息”和“社会产生更多有价值信息”不是同一命题。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="named-vs-effective-providers">
        <p className="section-kicker">18 · 名义供应者不等于有效风险容量</p>
        <h2>账户数、活跃报价者数、显示深度份额、成交份额与独立资本是五种不同的竞争口径。</h2>
        <p>
          市场可以显示二十个 participant ID，却由同一家母公司控制多个账户；也可以有二十家公司，但它们使用相同波动信号、同一 cloud、同一 hedge venue 或相似的 VaR 阈值。平静时它们会同时竞争，压力时却可能一起撤回。反过来，两家资本充足、信号异质且对冲渠道不同的供应者，可能比二十个共享约束的账户更有韧性。
        </p>
        <p>
          Menkveld 对一个跨市场 HFT 做市者的个案显示，同一机构可在新 venue 中占很高参与率、主要以被动订单交易，并从 spread earning 抵消库存损失；这提供了电子做市商可成为重要供给者的个案证据，却不能从单一机构外推整个 HFT 类别。Brogaard–Garriott 研究加拿大 Alpha 市场十一家 HFT 的逐步进入，发现流动性改善更符合数量竞争而非简单价格竞争，也说明“进入人数”必须和具体竞争边际一起解释。<Cite n={13} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="concentration">
        <p className="section-kicker">19 · Concentration 与有效数量</p>
        <h2>HHI 可以把不等份额压缩成“等权供应者数量”，但看不见共同风控、所有权和基础设施依赖。</h2>
        <p>
          若同一侧显示深度由供应者 i 贡献 D<sub>i</sub>，其份额 s<sub>i</sub>=D<sub>i</sub>/ΣD<sub>j</sub>。Herfindahl–Hirschman Index（HHI）是份额平方和；有效数量 N<sub>eff</sub> 是其倒数。也可对 fill、quote time 或风险承接分别计算，但每个口径回答不同问题。
        </p>
        <div className="equation-card">
          <span>显示深度集中度</span>
          <div>HHI<sub>D</sub> = Σ<sub>i</sub> s<sub>i</sub>²　；　N<sub>eff</sub> = 1 / HHI<sub>D</sub></div>
          <p>四家各 25% 时 HHI=0.25、N<sub>eff</sub>=4；份额 70/10/10/10 时 HHI=0.52、N<sub>eff</sub>≈1.92。后者虽然仍有四个名字，显示供给只相当于约 1.92 个等权来源。</p>
        </div>
        <p>
          该指标只描述所选窗口、场所、档位与可见订单的集中度。Hidden liquidity、跨 venue 供给和 latent liquidity 没被观察；即使 N<sub>eff</sub>=4，四家公司共享同一 risk trigger 时真实独立容量仍可能远低于四。Boehmer–Li–Saar 把 HFT 数据产品分成不同类别并发现竞争效应异质，也说明主体聚合方式会改变经验结论。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="stabilizing-entry">
        <p className="section-kicker">20 · 稳定机制：退出创造进入空间</p>
        <h2>当条件净边际仍为正，竞争者退出提高留下和重新进入的价值，战略替代把流动性拉回。</h2>
        <p>
          Strategic substitute（战略替代）意味着别人少供给时，我多供给更有价值。竞争者撤掉 ask，留下者的 queue ahead 减少，spread 可能扩大，gross capture 与 fill chance 上升；只要成交后的 markout、库存与 hedge 条件近似不变，g 仍为正，V 就上升。已有供应者增加 size、潜在供应者进入或慢资本接替，都会形成负反馈。
        </p>
        <div className="equation-card">
          <span>竞争者行动造成的局部价值变化</span>
          <div>ΔV<sub>i</sub> ≈ L<sub>i</sub>[g<sub>i</sub>ΔP<sub>i</sub>(F) + P<sub>i</sub>(F)Δg<sub>i</sub>] − ΔK<sub>i</sub></div>
          <p>若 g&gt;0、ΔP&gt;0 且 Δg 与 ΔK 没有显著恶化，第一项为正，退出留下经济空间。公式是局部分解，不是假定市场总有充足进入者。</p>
        </div>
        <p>
          这也解释为什么一次撤单未必是脆弱性证据：若 depth 很快被异质资本补回、完成成本和 markout 没恶化，系统展示的是 resiliency（受到冲击后恢复可交易供给的速度）。仅报告 cancel rate 会漏掉恢复路径。
        </p>
      </section>

      <section className="lesson-section" id="destabilizing-withdrawal">
        <p className="section-kicker">21 · 失稳机制：退出集中有害成交</p>
        <h2>当 g 已为负，竞争者退出让留下者更容易被击中；“更高 fill probability”从机会变成损失放大器。</h2>
        <p>
          Strategic complement（战略互补）意味着别人撤回时，我撤回也更有价值。公共新闻使 stale markout 上升，波动与相关性跳变提高库存风险，hedge venue 变薄又提高对冲成本；此时即使屏幕 spread 尚未变化，g 也可能转负。第一批供应者撤回后，剩余 queue 缩短，后续主动流更集中击中留下者；库存和 markout 再恶化，使其也降低 size 或取消。个体风险控制完全理性，聚合后却产生正反馈。
        </p>
        <p>
          Anand–Venkataraman 用 TSX 账户审计轨迹研究 non-DMM endogenous liquidity providers，发现进入和撤回在股票内及跨股票相关，DMM 可缓和周期性 illiquidity；但其条件回归中更高波动本身并非机械地减少参与。正确结论是复合市场状态、预期利润和风险约束决定参与，而不是“波动上升必然让所有人退出”。<Cite n={22} />
        </p>
        <p>
          Bongaerts–Van Achter 给出另一条信息筛选路径：有信息优势的快供应者在疑似有毒订单到来时选择不报价、在良性状态与慢供应者竞争；慢供应者于是发现，“自己仍是最优报价”这个条件本身更可能意味着快方已经避开的有毒流量。Winner’s curse 会使慢方降低参与，甚至让市场单有正概率得不到服务。该模型还说明，已完成交易的条件 half-spread 可以下降，而 liquidity-demand service probability 同时下降；它是特定内生进入模型的条件结论，不是现实市场的统一概率。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="state-switch">
        <p className="section-kicker">22 · 同一算式为何反号</p>
        <h2>负反馈与正反馈不是两套故事，而是 g 的符号和竞争者退出是否透露共同风险发生了变化。</h2>
        <p>
          平静状态中，gross capture 加 rebate 为 1.2 美分/股，maker markout 为 0.3 美分，fee、库存与 hedge 合计 0.3 美分，所以 g=+0.6 美分。对 100 股订单，若 P(F)=20%、K=$0.04，则 V=0.20×100×$0.006−$0.04=$0.08；竞争者退出使 P 升至 35% 时，V=$0.17，留下更有价值。
        </p>
        <div className="equation-card">
          <span>压力状态中的符号切换</span>
          <div>g = 1.2¢ − 1.5¢ − 0.6¢ = −0.9¢　；　V<sub>20%</sub> = −$0.22　；　V<sub>35%</sub> = −$0.355</div>
          <p>只把 markout 提高到 1.5 美分、其他成本提高到 0.6 美分，较高成交概率就让价值更负。所有数字都是教学参数；现实阈值随证券、主体、horizon 与状态变化。</p>
        </div>
        <p>
          更一般地，即使原 g&gt;0，别人退出也可能是共同毒性或对冲失灵的信号，使 Δg&lt;0；若 PΔg 的负项大过 gΔP 的正项，留下价值仍下降。因而研究竞争者退出不能只把它当作“少一个对手”的供给冲击，还要检验它是否携带市场状态信息。
        </p>
      </section>

      <section className="lesson-section" id="fragility-loop">
        <p className="section-kicker">23 · 局部流动性脆弱闭环</p>
        <h2>显示流动性突然消失，是状态恶化、同步控制与薄簿价格影响彼此反馈的结果，不需要假设某个主体“非理性恐慌”。</h2>
        <div className="mechanism-chain" aria-label="竞争性流动性脆弱闭环">
          {[
            ['共同状态恶化', '新闻、markout、波动、库存或 hedge cost 令许多供应者的 g 下行'],
            ['阈值响应', '降 size、widen、cancel、主动 hedge 或退出降低个体预期损失'],
            ['供给集中', '显示 depth 下降，剩余供应者 fill probability 与库存跳幅上升'],
            ['执行破坏增强', '同样后续 flow 穿过更多价位，price impact 与尾部完成成本上升'],
            ['风险再估计', '更差 markout、波动和对冲条件让更多 V 变负'],
            ['恢复或扩散', '新异质资本若被更宽补偿吸引则恢复；共同约束仍在则继续收缩'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <div className="equation-card">
          <span>显示深度只是订单消息的会计变化</span>
          <div>D<sup>s</sup><sub>t+1</sub> = D<sup>s</sup><sub>t</sub> + ΣAdd<sup>s</sup><sub>i,t</sub> − ΣCancel<sup>s</sup><sub>i,t</sub> − ΣFill<sup>s</sup><sub>i,t</sub></div>
          <p>要解释 depth 下降，必须区分新增减少、撤单增加与被成交消耗；快照或成交量本身无法完成这项归因。</p>
        </div>
      </section>

      <section className="lesson-section" id="common-shock-vs-propagation">
        <p className="section-kicker">24 · Common shock 不等于 propagation</p>
        <h2>所有人同时撤单可能只是共同新闻或共同阈值；只有一个人的行动改变另一个人的风险，才是主体间传播。</h2>
        <p>
          第一条路径是 common shock：公共价格跳变同时让每家 stale quote 变差，大家独立撤回。第二条是 common constraint：不同公司采用相似 volatility、VaR 或 hedge-liquidity 信号，在同一阈值附近同步降险。第三条才是 endogenous propagation：供应者 A 退出后，B 的 queue、fill concentration、库存与 markout 发生变化，B 因而改变行为。共享网络或 market-data outage 又可能同时影响所有人，但仍不是 A 的撤单导致 B 撤单。
        </p>
        <div className="boundary-box">
          <b>识别顺序</b>
          <p>先控制共同新闻、相关市场、交易所状态和共享基础设施，再寻找 participant-specific 且不携带价值信息的退出；随后测量未受影响竞争者的 queue、fill、markout、size 与补单。只观察同步相关性，最多支持“共同状态下行为相关”。</p>
        </div>
      </section>

      <section className="lesson-section" id="liquidity-vector">
        <p className="section-kicker">25 · 流动性是一组状态变量</p>
        <h2>Spread 可以收窄而 depth 同时下降；小单体验改善，不等于大单、恢复速度和尾部执行也改善。</h2>
        <div className="table-scroll" role="region" aria-label="流动性维度与测量比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>不同维度可能异向变化</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">常见测量</th><th scope="col">用户问题</th><th scope="col">主要盲点</th></tr></thead>
            <tbody>
              <tr><th scope="row">Tightness</th><td>quoted / effective spread</td><td>小单立即成交要付多大价格让步？</td><td>看不到可用规模</td></tr>
              <tr><th scope="row">Depth</th><td>best level 与多档累计 size</td><td>给定距离内能吸收多少量？</td><td>显示不等于真实可成交</td></tr>
              <tr><th scope="row">Fill</th><td>概率、等待时间、完成率</td><td>被动订单多快、多少能成交？</td><td>不说明成交后质量</td></tr>
              <tr><th scope="row">Price impact</th><td>规模条件下的价格移动</td><td>主动执行会把价格推多远？</td><td>混合信息与机械冲击</td></tr>
              <tr><th scope="row">Resiliency</th><td>冲击后 spread / depth 恢复路径</td><td>供给被消耗后多快补回？</td><td>依赖冲击定义</td></tr>
              <tr><th scope="row">Tail execution</th><td>高分位 slippage、短缺与停顿</td><td>最坏状态能否完成交易？</td><td>样本稀少且状态内生</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          例如 spread 从 4 美分降到 2 美分而 best-level depth 从 10,000 股降到 2,000 股，只能说 tightness 改善 50%、显示 inside depth 下降 80%。如果没有订单规模权重、整条簿曲线、完成率和恢复路径，就没有诚实的单一“净改善”结论。
        </p>
        <p>
          还要防止 execution conditioning：只在已经成交的市场单中计算平均 half-spread，会把“根本没有供应者愿意服务”的状态删掉。Bongaerts–Van Achter 因此同时分析已成交交易的预期 half-spread 与需求获得服务的概率，两者在其 winner’s-curse 区间可以异向。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="role-switching">
        <p className="section-kicker">26 · 同一 HFT 可以逐单换角色</p>
        <h2>被动做市、主动抢走旧报价与主动 hedge 可以在毫秒内依次发生；gross turnover 不等于净风险承接。</h2>
        <p>
          一家电子做市商先以 resting bid 买入，随后发现相关市场上涨，可能撤掉 ask、主动买入别处，或卖出期货 hedge。第一笔是被动供给，第二笔可能是主动拿走流动性，第三笔是跨资产风险管理；主体身份没有变，订单角色却变了。Brogaard–Hendershott–Riordan 发现主动 HFT 订单有助于永久价格变化并纠正暂时定价误差，而被动 HFT 会遭受 adverse selection，正说明逐单角色不可合并。<Cite n={16} />
        </p>
        <p>
          Kirilenko 等对 2010 Flash Crash 的审计数据还提醒，极高买卖周转可以伴随很小净库存变化：风险可能在中介之间高速传递，却没有长期留在任何一家账上。评价压力承接必须看有符号净库存、持有时间、跨资产 hedge 和冲击广度，而不是只看成交次数。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="quote-price-discovery">
        <p className="section-kicker">27 · 没有成交也能更新价格</p>
        <h2>新限价单与撤单会把公共状态写入可交易价格；price discovery 不只发生在主动成交上。</h2>
        <p>
          若相关市场公开上涨，供应者撤掉旧 ask 并把新 ask 抬高，即使没人击中旧单，BBO 也已更新。Quote innovation 是报价消息带来的价格变化；trade impact 是成交与后续价格的关系；long-run price discovery 则关心某类创新对较长期有效价格的贡献。三者不能用同一个短 horizon markout 替代。
        </p>
        <p>
          Brogaard–Hendershott–Riordan 的交易研究显示 HFT 的主动与被动角色对价格发现不同；其后关于“Price Discovery without Trading”的研究进一步把 limit-order submission 和 cancellation 纳入价格发现。观察性贡献分解说明报价信息包含量，却不等于速度身份被随机分配，也不证明每次撤单都提高福利。<Cite n={16} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="private-social-speed">
        <p className="section-kicker">28 · 速度的私人价值与社会价值</p>
        <h2>更快既可能减少真实监控成本，也可能只重排公开机会的赢家；私人利润不能直接当作社会新增产出。</h2>
        <p>
          绝对速度改善若缩短 stale quote 寿命、提高系统可靠性并允许做市商在相同风险下报得更紧，会产生真实匹配和风险共享收益。相对速度竞赛若主要决定谁先抢到已经公开的价差，其赢家利润大体对应慢方损失；光纤、微波、共址与工程支出却是社会真实资源。Budish–Cramton–Shim 与 Aquilina–Budish–O’Neill 因此把连续处理的竞赛租金同信息生产或风险共享收益区分。<Cite n={8} /><Cite n={26} />
        </p>
        <p>
          福利还取决于分配：慢投资者的 adverse-selection cost、快供应者的固定投资、普通投资者的 spread 与大单 depth 可能异向；Baldauf–Mollner 又指出速度会反过来改变信息生产激励。由此不能从“spread 变窄”直接推出社会福利提高，也不能从“存在速度竞赛”推出所有低延迟工程都无生产性。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">29 · 证据地图</p>
        <h2>HFT 文献不是一场赞成或反对的投票；先问研究看见了谁、怎样识别、测量哪个状态，才能比较结论。</h2>
        <div className="table-scroll" role="region" aria-label="HFT 与流动性证据类型地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>证据强度取决于问题与识别设计是否匹配</caption>
            <thead><tr><th scope="col">类型</th><th scope="col">观察对象</th><th scope="col">能回答</th><th scope="col">典型限制</th></tr></thead>
            <tbody>
              <tr><th scope="row">理论模型</th><td>明确偏好、信息、规则与均衡</td><td>机制和 comparative statics</td><td>结论随假设改变，不是经验事实</td></tr>
              <tr><th scope="row">Participant-ID 描述</th><td>已分类主体的订单、成交与库存</td><td>角色、异质性与条件行为</td><td>身份内生，市场和时期特定</td></tr>
              <tr><th scope="row">Activity proxy</th><td>消息串、战略运行或低延迟模式</td><td>可扩展的活动—市场质量关系</td><td>代理混合身份和策略</td></tr>
              <tr><th scope="row">准实验</th><td>技术、规则或连接的外生变化</td><td>特定处理的局部因果效应</td><td>采用自选择、并发变化与 spillover</td></tr>
              <tr><th scope="row">压力过程证据</th><td>审计轨迹、事件时间线、净流量</td><td>谁在何时供给、拿走或传递风险</td><td>过程一致不等于单因归责</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Competition 还使 SUTVA——“一个单位的处理不影响另一个单位结果”的常见因果假设——天然脆弱。某家连接升级会改变别人的 queue 和 fill；某家退出会改变留下者风险。研究必须分别估计处理主体的 direct effect、竞争者的 spillover 与市场 aggregate effect，而不能把未升级者直接当成无干扰对照。
        </p>
        <div className="boundary-box">
          <b>本节只需掌握的识别词典</b>
          <p>
            Estimand 是研究在看数据前先规定要估计的因果量。Instrumental variable（IV，工具变量）是在排除限制等假设下改变处理、且只通过该处理影响结果的变量；LATE 是它对“处理状态会被该工具推动而改变”的局部人群所识别的平均处理效应。Difference-in-differences（DID）比较处理组与对照组在处理前后的变化差；DDD 再增加第三个比较维度。FESE 是 Federation of European Securities Exchanges，文中的 FESE tick harmonization 指其最小价格单位协调改革。AT proxy 则只是从可观察消息活动构造的 algorithmic-trading 代理，不等于研究者真正看见了 HFT 身份。
          </p>
        </div>
      </section>

      <section className="lesson-section" id="normal-evidence">
        <p className="section-kicker">30 · 正常状态证据</p>
        <h2>多项研究在特定市场发现某类算法或低延迟活动改善了部分流动性指标，但处理对象、身份可见度和识别强度差异很大。</h2>
        <div className="table-scroll" role="region" aria-label="正常状态算法交易与流动性证据，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每个结果都与样本和不能外推的边界绑定</caption>
            <thead><tr><th scope="col">研究</th><th scope="col">样本 / 识别</th><th scope="col">主要结果</th><th scope="col">不能证明</th></tr></thead>
            <tbody>
              <tr><th scope="row">Hendershott–Jones–Menkveld (2011)</th><td>NYSE 2001–2005 描述样本；因果估计使用 2002-12-02 至 2003-07-31 的 167 日平衡面板，Autoquote 于 2003-01-29 至 05-27 分阶段上线并用作 IV</td><td>最大市值五分位（Q1）中 AT proxy 每增一单位，quoted / effective half-spread 约降 0.53 / 0.18 bp，但 quoted depth 约降 $3,490；收益集中于较小交易</td><td>AT proxy 不是 HFT；第一阶段有限、Autoquote 可能有直接流程效应，只是 2003 年流动股附近的 LATE</td></tr>
              <tr><th scope="row">Hendershott–Riordan (2013)</th><td>30 只 DAX，2008-01，带算法标记</td><td>算法供给在 spread 宽时更强、在窄时更常消耗；非 marketable limit volume 占比高</td><td>描述性均衡行为不是一般 HFT 处理效应</td></tr>
              <tr><th scope="row">Hasbrouck–Saar (2013)</th><td>NASDAQ 2007-10 与 2008-06；message-level low-latency proxy</td><td>更多低延迟活动与更好传统市场质量相关，在两期均成立</td><td>活动代理不等于完整主体身份或随机处理</td></tr>
              <tr><th scope="row">Hagströmer–Nordén (2013)</th><td>30 只 Stockholm 大盘股，2011-08 与 2012-02；participant category</td><td>market-making HFT 构成 HFT 流量主要部分，策略类别表现不同</td><td>样本占比不能外推为全球市场常数</td></tr>
              <tr><th scope="row">Brogaard et al. (2015)</th><td>Stockholm 可选 colocation upgrade</td><td>总体及未共址者流动性改善；采用者多为做市者，机制与较低 adverse selection、库存约束缓解一致</td><td>自愿采用不是无条件随机，制度边界需保留</td></tr>
              <tr><th scope="row">Brogaard–Garriott (2019)</th><td>加拿大 Alpha，279 股、2008-11 至 2012-09，11 家推断 HFT 的 1,121 个进入事件与匹配 DID</td><td>第二个 passive entrant 后 non-HFT effective spread 首月约降 38 bp，第三个约降 4 bp；第四个以后与 inside depth 多为零</td><td>进入内生于盈利、新 venue 起点特殊、身份由行为推断；只支持边际递减的局部数量竞争</td></tr>
              <tr><th scope="row">Breckenfelder (2024)</th><td>Stockholm OMXS30，2009-06 至 2010-01；HFT 进入/退出 DID 与 FESE tick reform DDD</td><td>形成至少两家 HFT 竞争时，投机型 HFT 约由 29% 升至 41%，spread +5%、price impact +23%、non-HFT shortfall +2 至 4 pp</td><td>30 只流动股、约八个月；进入与 tick 排除限制仍可争议，不能说 HFT 份额上升本身有害</td></tr>
              <tr><th scope="row">Aquilina–Budish–O’Neill (2022)</th><td>LSE/FCA，2015-08-17 至 2015-10-16 的 43 个交易日，约 22 亿条消息</td><td>FTSE 100 平均每股每日约 537 场 race，平均约 81 微秒；模型反事实估计竞赛构成显著流动性成本</td><td>数字与 17% 流动性成本反事实仅属该样本、race 定义和模型</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Hendershott–Jones–Menkveld 估计大盘股较窄 spread 的 75%–90% 来自较小 price impact，并发现 realized spread 暂时上升；这些分量提醒“投资者成本下降”与“中介收入下降”不是同一个量。更直接的竞争研究也出现相反局部结果：Alpha 中早期 passive entrant 主要表现为数量竞争和价差改善，Stockholm 中新增 HFT 竞争却伴随策略向同侧投机切换和执行恶化；它们处理的 venue 起点、进入者角色和 tick 环境不同。Brogaard 等的 colocation 结果又与 absolute monitoring speed 改善一致，但 Shkilko–Sokolov 利用微波天气中断发现，相对速度差暂时缩小时 adverse selection 和交易成本下降。一个改变 maker 的绝对更新能力，另一个削弱主体间相对抢跑优势。<Cite n={11} /><Cite n={12} /><Cite n={14} /><Cite n={15} /><Cite n={17} /><Cite n={20} /><Cite n={26} /><Cite n={27} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="stress-evidence">
        <p className="section-kicker">31 · 压力过程证据</p>
        <h2>极端事件最有价值的是主体、订单与库存的时间路径；它们可以排除简单故事，却很少单独识别“HFT 的总因果效应”。</h2>
        <div className="table-scroll" role="region" aria-label="压力状态 HFT 与流动性证据，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>区分事件起因、风险传播与条件供给</caption>
            <thead><tr><th scope="col">证据</th><th scope="col">观察到的过程</th><th scope="col">可支持</th><th scope="col">不可支持</th></tr></thead>
            <tbody>
              <tr><th scope="row">CFTC–SEC 2010 Staff Report</th><td>大额自动卖出、流动性消耗、跨市场反馈与订单簿深度恶化共同出现</td><td>重建 2010-05-06 的特定过程链与制度状态</td><td>把全部事件归因于“HFT”单一类别</td></tr>
              <tr><th scope="row">Kirilenko et al. (2017)</th><td>E-mini 审计轨迹显示自动卖出程序与中介间快速库存传递；最活跃非指定中介的交易模式在下跌时未出现简单断裂</td><td>区分 gross turnover 与净承接，并检验简单退出叙事</td><td>排除所有放大渠道或外推到全部市场</td></tr>
              <tr><th scope="row">Brogaard et al. (2018)</th><td>单股 extreme price movement 中 HFT 平均供给并吸收 non-HFT 失衡；多股同时事件中 HFT demand 更占主导</td><td>供给角色随冲击广度发生条件性符号翻转；结果与共同风险容量受压机制一致，但不单独识别该机制</td><td>“HFT 总会退出”或“HFT 从不放大”</td></tr>
              <tr><th scope="row">2014 Treasury Joint Staff Report</th><td>十年期收益率全日区间 37 bp，09:33–09:45 出现 16 bp 往返；期货量约为常态九倍，market depth 最多降约 80%</td><td>PTF 在往返阶段仍占约 70%–75% 成交，说明高成交和较窄 inside spread 可与容量骤降并存</td><td>报告未找到单一原因；PTF 不完全等于 HFT，事件也不是随机处理</td></tr>
              <tr><th scope="row">2020 Treasury pandemic shock</th><td>广泛现金需求与历史性销售使 dealer / PTF 中介承压；on-the-run depth 急降，standing orders 的补充赶不上成交量</td><td>把库存容量、flow 广度、replenishment 与官方干预置于同一过程链</td><td>纽约联储讲话是早期综合与作者观点，不是单一电子交易机制的因果估计</td></tr>
              <tr><th scope="row">BIS FX HFT report (2011)</th><td>正常状态小额价差常更紧；较大交易与压力状态下流动性可能更不稳定，且多数高速主体无正式持续义务</td><td>提醒规模、状态和制度义务必须分开</td><td>把 FX 访谈与案例结论当作股票市场定律</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Brogaard 等的 extreme-price-movement 结果几乎没有证据表明 HFT 是事件起因，但“不是起因”并不等于“无法传播或改变恢复”。官方 Flash Crash 与 2014 Treasury 报告都描述多个机制耦合，而不是一个自动化主体类别的单因故事；2020 Treasury 压力又显示，销售广度、dealer inventory、PTF 参与和补单速度要放在同一中介容量约束中。压力研究应先定义 idiosyncratic 还是 simultaneous shock、被动供给还是主动需求、净库存还是成交量，再讨论因果角色。<Cite n={23} /><Cite n={24} /><Cite n={25} /><Cite n={29} /><Cite n={32} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="data-estimation">
        <p className="section-kicker">32 · 数据与估计协议</p>
        <h2>竞争研究必须重建“谁的哪张订单在什么时钟下与哪些对手竞争”，否则 spread 回归无法识别机制。</h2>
        <div className="protocol-grid">
          <article><span>01</span><h3>固定身份层级</h3><p>区分 participant、firm、desk 和策略分类；记录聚合规则、跨账户所有权未知与 DMM 义务。</p></article>
          <article><span>02</span><h3>重建 lifecycle</h3><p>为每条 add、modify、cancel、reject、partial / full fill 建立稳定 order ID；未成交订单保留在风险集。</p></article>
          <article><span>03</span><h3>对齐双时钟</h3><p>分开本地 receive / send 与 exchange receipt / execution；同步相关市场并报告 clock drift 和消息丢失。</p></article>
          <article><span>04</span><h3>版本化规则</h3><p>记录 tick、fee/rebate、priority、订单类型、熔断、交易阶段和技术升级；不能用当前规则解释历史 queue。</p></article>
          <article><span>05</span><h3>重建竞争状态</h3><p>在决策前测 price、queue ahead、age、displayed size、竞争者数、HHI 与最近 add/cancel，而非用事后快照。</p></article>
          <article><span>06</span><h3>固定 markout</h3><p>按 maker side 定义多个 horizon 的 adverse markout，并分开公共价格更新、机械 impact 与 hedge 结果。</p></article>
          <article><span>07</span><h3>测参与与容量</h3><p>分别估计 quote presence、size、fill、净库存和跨资产 hedge；名义账户数不代替独立风险资本。</p></article>
          <article><span>08</span><h3>直接与外溢</h3><p>预先写 direct、spillover、aggregate estimand；检查预趋势、共同冲击、共享设施和未受影响路径。</p></article>
        </div>
        <p>
          最低数据表应以订单—时间为单位，包含主体、方向、价格、size、queue、消息与撮合时钟、状态退出原因、后续 reference price、fees、规则版本和相关市场状态。只有成交记录会产生 survivorship bias；只有 aggregate message rate 会把新增、撤单、路由与风险控制混在一起；只有 BBO 会看不见整条深度曲线和 queue 竞争。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先在原始状态上预测，再揭示计算与边界，训练从单张订单价值推到市场层反馈。</h2>
        <p>
          Mode A 处理 conditional margin、join / improve、有效供应者数量与 spread–depth 异向；Mode B 处理参与阈值、公共信号速度竞赛、HFT 分类与极端状态证据。所有数值均为教学参数或在题目中明确限定的研究结果，不输出伪经验概率，也不构成可部署策略。
        </p>
        <LiquidityCompetitionLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 反例库</p>
        <h2>每个线性口号都应当经受一个只改变关键条件的反例。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>二十个名字不如两个独立资本源</h3><p>二十家共享同一风控、数据与 hedge venue，可同时退出；两家资本充足且信号异质者反而更有韧性。</p></article>
          <article><span>反例 02</span><h3>Spread 窄、depth 薄</h3><p>价格竞争把最优档收窄，却让供应者减少 size；小单改善不代表大单或尾部执行改善。</p></article>
          <article><span>反例 03</span><h3>高撤单不等于操纵</h3><p>公共价值更新、库存控制和 queue 管理都可产生大量合法撤单；操纵需要意图与模式证据。</p></article>
          <article><span>反例 04</span><h3>HFT 也会主动消耗</h3><p>同一高速做市者可先 passive fill、再主动 hedge 或抢旧报价；技术标签不决定逐单角色。</p></article>
          <article><span>反例 05</span><h3>退出反而吸引补单</h3><p>若 g&gt;0、退出提高 P(F) 且 Δg / ΔK 未显著恶化，从而使某些可进入者的 V 升至非负，异质资本才可能补单；局部撤单因此未必形成级联。</p></article>
          <article><span>反例 06</span><h3>同时撤回无需主体传染</h3><p>一条公共新闻或共同 volatility trigger 足以让所有人独立响应；先排除 common shock 才谈 spillover。</p></article>
          <article><span>反例 07</span><h3>更快更新不等于更多信息生产</h3><p>报价可更快纳入已有公共信息，但基本面研究激励可能不变甚至下降。</p></article>
          <article><span>反例 08</span><h3>高 turnover、低净承接</h3><p>风险在多家之间快速来回传递时成交量很大，日终或分钟净库存吸收仍可很小。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 把竞争机制压缩成可证伪研究</p>
        <h2>好的设计同时问处理者发生什么、竞争者被怎样影响，以及聚合市场质量最终怎样变化。</h2>
        <div className="research-card">
          <span>研究题 A · 外生相对速度变化</span>
          <h3>连接分阶段升级或特定线路天气中断，怎样改变 queue rank、maker markout 与慢供应者的参与？</h3>
          <p><b>Direct：</b>受影响主体的 exchange-receipt latency、queue、fill 与 markout。<b>Spillover：</b>未升级供应者的 fill concentration、size 与退出。<b>Aggregate：</b>spread、整条 depth、完成成本与恢复。<b>失败：</b>自愿采用、同时 fee/order-type 变化、线路中断也携带市场信息，或把受干扰对手误作无干扰控制。</p>
        </div>
        <div className="research-card">
          <span>研究题 B · Participant-specific 退出</span>
          <h3>与证券价值无关、预先确定的单一供应者连接中断，会让留下者补单还是同步撤回？</h3>
          <p><b>处理：</b>不共享基础设施且不透露市场状态的 participant-specific interruption。<b>结果：</b>其他供应者 queue、fill、markout、size、replenishment 与 N<sub>eff</sub>。<b>机制判别：</b>g&gt;0 时预测替代进入；有害成交集中时预测撤回。<b>失败：</b>中断影响交易所、共同行情或相关 hedge market。</p>
        </div>
        <div className="research-card">
          <span>研究题 C · 公共新闻 quote lifecycle</span>
          <h3>固定官方事件时点后，不同预先定义速度组如何加入、取消、被成交和重新补单？</h3>
          <p><b>设计：</b>用 exchange receipt time 重建所有 add/cancel/fill，比较新闻前已定义的速度组，并同步相关市场。<b>结果：</b>stale survival、competing risks、maker markout 与 depth recovery。<b>边界：</b>这能描述条件响应；只有额外的外生相对速度变化，才能把组间差异解释为速度因果效应。</p>
        </div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>先写单位、状态与反事实，再计算或解释；答案的边界与数值同样重要。</h2>
        <div className="practice-grid">
          <article>
            <span>练习 01 · 符号切换</span>
            <h3>用本节正常与压力参数计算 g、P=20% 和 35% 时的 V，并解释为什么竞争者退出产生相反反应。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>正常 g=1.2¢−0.3¢−0.3¢=+0.6¢；100 股、K=$0.04 时 V20%=$0.08，V35%=$0.17。压力 g=1.2¢−1.5¢−0.6¢=−0.9¢；V20%=−$0.22，V35%=−$0.355。正 g 时更多 fill 是机会，负 g 时更多 fill 是预期损失；若退出还使 Δg&lt;0，撤回会更强。</p></details>
          </article>
          <article>
            <span>练习 02 · Join / Improve / Cancel</span>
            <h3>复算 $100.03 join 与 $100.02 improve 的价值；再只让 improve 的 markout 成本增加 1¢/股，说明动作怎样改变。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>原 Vjoin=0.15×100×$0.016−$0.04=$0.20；Vimprove=0.50×100×$0.006−$0.04=$0.26，所以原状态 improve 更优。额外 1¢ 成本使 improve 的 g=−$0.004，V=0.50×100×(−$0.004)−$0.04=−$0.24；此时 join 的 $0.20 更好，若其状态也恶化则还要与 wait / cancel 比较。</p></details>
          </article>
          <article>
            <span>练习 03 · Competing risks</span>
            <h3>λF=3/s、λC=4/s、λR=3/s 时求 fill 先发生的概率；列出至少四个让该公式失效的现实条件。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>P=3/(3+4+3)=30%。独立常强度会被公共新闻的共同冲击、queue 随时间移动、订单 age、partial fill、状态依赖撤单、竞争者响应与 replace 后的新生命打破。真实分析应报告 cause-specific hazard 与 cumulative incidence，并保留全部未成交订单。</p></details>
          </article>
          <article>
            <span>练习 04 · 有效供应者</span>
            <h3>计算 25/25/25/25 与 70/10/10/10 的 HHI、N<sub>eff</sub>，再列出 HHI 看不到的四类共同依赖。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>等份额 HHI=4×0.25²=0.25，Neff=4；集中份额 HHI=0.70²+3×0.10²=0.52，Neff≈1.92。HHI 看不到共同母公司、相同风险模型/阈值、共享数据与网络基础设施、共同 hedge venue，也看不到 hidden / latent liquidity。</p></details>
          </article>
          <article>
            <span>练习 05 · 相对速度研究</span>
            <h3>为一次线路天气扰动分别写出 direct、competitive spillover 与 aggregate estimand，并说明一个关键安慰剂。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>先固定结果单位、观察窗口和主体对各条线路的事前 exposure mapping。Direct estimand 是“本路线受扰”减去“同一路线未受扰”的反事实结果差；competitive spillover estimand 是“本身路线未受扰但竞争者路线受扰”减去“双方路线均未受扰”；aggregate estimand 是“实际扰动分配”减去“所有路线均未受扰的分配”。主体层结果可用 queue rank、fill 与 maker markout，市场层结果可用 spread、全曲线 depth、完成成本和恢复时间。可用不依赖该线路、但在相同新闻时段交易的证券或路线做安慰剂，并检验扰动前趋势；若天气同时影响信息或共同基础设施，设计失效。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>能够脱离“HFT 好或坏”的标签，重建条件价值与反馈链，才算真正理解。</h2>
        <div className="check-grid">
          <details><summary>01 · 本节正式解决的课程问题是什么？</summary><p>做市竞争为什么既可能改善流动性，也可能让流动性突然消失。答案在于竞争同时改变成交概率与条件成交净价值，后者符号改变会把战略替代转成战略互补。</p></details>
          <details><summary>02 · 为什么 HFT 不能直接等同 market maker？</summary><p>HFT 是高速自动化、短持仓和高消息等特征的重叠集合；同一主体可被动供给、主动交易或 hedge，非 HFT 也能提供限价流动性。</p></details>
          <details><summary>03 · g 与 V 分别回答什么？</summary><p>g 是订单已成交条件下每股期望净边际；V 再乘成交概率和规模并扣订单级成本，回答是否值得提交或维持。</p></details>
          <details><summary>04 · 竞争者退出为什么会产生相反反馈？</summary><p>退出通常提高留下者 fill probability。g&gt;0 且质量不恶化时这吸引补单；g&lt;0 或退出令 Δg&lt;0 时，它集中有害成交并鼓励继续撤回。</p></details>
          <details><summary>05 · Price competition 与 queue competition 有何区别？</summary><p>前者通过更优价格获得优先权并牺牲 capture；后者在同价下按规则争执行顺序、size 或分配权，价值依赖 queue ahead 与状态。</p></details>
          <details><summary>06 · 为什么 latency 必须写成相对、端到端？</summary><p>决定结果的是从事件感知到 matching-engine receipt 的完整链和参与者间到达差；某一网络段更快不保证最终先入队或先撤掉。</p></details>
          <details><summary>07 · 为什么 participant count 不等于独立容量？</summary><p>账户可共享母公司、信号、风险阈值、数据网络和 hedge venue。HHI 只能描述某口径份额集中度，仍看不到共同依赖。</p></details>
          <details><summary>08 · Spread 收窄为何不足以证明流动性全面改善？</summary><p>它只说明 tightness。Depth、fill、impact、resiliency 与 tail execution 可以同时恶化，且不同订单规模面对不同结果。</p></details>
          <details><summary>09 · 撤单怎样参与 price discovery？</summary><p>撤掉 stale quote 并在新价格补单，会在没有成交时更新 BBO；但报价贡献分解不自动识别速度因果，也不证明每次取消提高福利。</p></details>
          <details><summary>10 · 为什么“波动时撤单更多”的回归不能证明传播？</summary><p>波动、公共新闻、订单毒性、库存、hedge cost 与撤单共同内生。还需排除 common shock / common constraint，并用 participant-specific variation 识别退出对其他人的 spillover。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节完成单一订单簿中的多供应者竞争与状态切换；成交量、tick、完整 HFT agent 和系统脆弱性分别在后续层级展开。</h2>
        <div className="interface-grid">
          <article><span>← 1.12 / 1.13</span><h3>供应服务与单主体状态</h3><p>输入即时性服务、现金—库存账本及每个供应者的内部风险；本节把 fill 改成竞争者共同决定的对象。</p></article>
          <article><span>→ 1.15</span><h3>Trading Volume 与 Volatility</h3><p>高 turnover 可能只是风险高速传递；下一节分开成交量、消息量、净承接与波动的共同生成。</p></article>
          <article><span>→ 1.18 / 2.08</span><h3>Tick 与 HFT Agent</h3><p>1.18 让 tick 内生改变 price / queue competition；2.08 再打开策略目标、技术投资、venue routing 与 latency arbitrage。</p></article>
          <article><span>→ 7.14</span><h3>Systemic Fragility</h3><p>本节只刻画共同阈值与退出外溢的局部机制及识别要求；7.14 再加入跨资产持仓、融资、基础设施与网络耦合。</p></article>
        </div>
        <p className="closing-thesis">面对“供应者竞争会不会改善市场”，应依次追问：观察的是 firm、strategy 还是 order role；被动成交条件下的 gross capture、markout、库存、hedge 和 fees 怎样组成 g；price、queue 与相对 latency 怎样共同决定 fill；其他人退出提高 P(F) 时 g 是否仍为正、退出是否又使 Δg 恶化；名义账户、份额集中与独立风险容量是否分开；spread、depth、fill、impact、resiliency 和 tail execution 是否分别报告；同步撤单来自共同新闻、共同约束还是主体间 spillover；证据是理论、身份数据、活动代理、准实验还是压力过程。只有这些层级闭合，HFT 才从一个带立场的标签变成可观察、可比较、可证伪的市场机制。</p>
      </section>
    </>
  );
}

export const lesson114: LessonRecord = {
  slug: '1-14',
  id: '1.14',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Liquidity Provider Competition 与 HFT',
  subtitle: '从单一做市商推进到多个供应者争夺价格与 queue，用条件成交净价值、fill–cancel competing risks 和相对速度解释：竞争何时通过进入与补单稳定流动性，何时因 stale quote、共同风险与成交集中转为同步撤回',
  readingTime: '约 105–115 分钟（核心阅读 62–66＋互动 14–15＋主动练习 18–20＋理解检查 8–10＋课程接口 2；参考文献与延伸阅读不计）',
  prerequisite: '1.12 · Market Maker 为什么存在；强烈建议先完成 1.13 · Inventory Risk 与 Quote Adjustment，并按需回看 1.04 的 queue / priority 与 1.10 的 stale quote / adverse selection',
  updatedAt: '2026-08-28',
  revision: '1.14-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.14-r1',
      summary: '要求修正 partial fill 不会终结剩余订单这一生命周期与 competing-risk 风险集错误，精确 HJM 的平衡面板、Autoquote rollout 与 Q1 分组，补足天气线路研究的 direct/spillover/aggregate estimand，并修正 BIS 月份和互动实验两处标签/记号。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.14-r1',
      summary: '确认结构、认知坡度、阅读预算、互动可访问性与课程接口成立；要求为零背景读者补齐 maker/taker 及 estimand、IV/LATE、DID/DDD、FESE、AT proxy 的即时定义，并让延伸阅读卡标题与单一链接逐项对应。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.14-r2',
      summary: '确认 r1 的生命周期、HJM、estimand、BIS 与互动记号意见全部关闭；要求把补单进入重新绑定完整参与约束 V=P·L·g−K，把 EPM 的容量解释降为与机制一致而非已识别渠道，并消除绝对速度和课程接口中的两处过强措辞。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.14-r2',
      summary: '完整复审确认 39 节认知坡度、零背景术语、公式与直白解释、105–115 分钟预算、8 项互动、5 项练习、10 项检查、17 张逐篇阅读卡、可访问性、移动端源码、范围与课程接口均通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.14-r3',
      summary: '完整复审确认 r1 与 r2 的全部准确性问题均已关闭；g、V、局部 ΔV、competing risks、HHI、所有算例、5 项练习与 8 项互动正确，33 条来源和 50 个引文全覆盖，指定经验研究的样本、数字、识别与外推边界均通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.14-r3',
      summary: '完整复审确认全部既有教学问题持续关闭，r3 的参与约束、EPM 证据边界、绝对/相对速度与课程接口修订清楚且无回归；39 节、学习预算、互动与练习、可访问性、17 张阅读卡和课程导航全部通过，未发现 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-13', label: '1.13 Inventory Risk 与 Quote Adjustment' },
  next: { slug: '1-15', label: '1.15 Trading Volume 与 Volatility 的关系' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'object-map', label: '对象地图' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'hft-definition', label: 'HFT 定义边界' },
    { id: 'quote-lifecycle', label: 'Quote Lifecycle' },
    { id: 'one-to-many', label: '从一个到多个' },
    { id: 'net-fill-value', label: '条件成交净边际' },
    { id: 'order-value-participation', label: '订单价值与参与' },
    { id: 'zero-profit-boundary', label: 'Zero-profit 边界' },
    { id: 'price-competition', label: 'Price Competition' },
    { id: 'queue-competition', label: 'Queue Competition' },
    { id: 'join-improve-cancel', label: 'Join / Improve / Cancel' },
    { id: 'queue-value-example', label: 'Queue Value 算例' },
    { id: 'competing-risks', label: 'Competing Risks' },
    { id: 'relative-latency', label: 'Relative Latency' },
    { id: 'two-races', label: '两种速度竞赛' },
    { id: 'stale-quote-news', label: 'Stale Quote 与新闻' },
    { id: 'normal-equilibrium', label: '正常状态均衡' },
    { id: 'named-vs-effective-providers', label: '名义与有效供应者' },
    { id: 'concentration', label: '集中度' },
    { id: 'stabilizing-entry', label: '稳定性进入' },
    { id: 'destabilizing-withdrawal', label: '失稳性撤回' },
    { id: 'state-switch', label: '反馈符号切换' },
    { id: 'fragility-loop', label: '脆弱性闭环' },
    { id: 'common-shock-vs-propagation', label: '共同冲击与传播' },
    { id: 'liquidity-vector', label: '流动性向量' },
    { id: 'role-switching', label: '角色切换' },
    { id: 'quote-price-discovery', label: '报价价格发现' },
    { id: 'private-social-speed', label: '速度的私人/社会价值' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'normal-evidence', label: '正常状态证据' },
    { id: 'stress-evidence', label: '压力过程证据' },
    { id: 'data-estimation', label: '数据与估计协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson114Content,
  references: [
    { id: 1, authors: 'Thomas S. Y. Ho & Hans R. Stoll', year: '1983', title: 'The Dynamics of Dealer Markets Under Competition', publication: 'Journal of Finance, 38(4), 1053–1074', url: 'https://doi.org/10.1111/j.1540-6261.1983.tb02282.x', use: '把单 dealer 库存定价推进到竞争 dealer 环境；旧式 dealer 制度不直接等同现代 CLOB。' },
    { id: 2, authors: 'Christine A. Parlour', year: '1998', title: 'Price Dynamics in Limit Order Markets', publication: 'Review of Financial Studies, 11(4), 789–816', url: 'https://doi.org/10.1093/rfs/11.4.789', use: '说明当前订单簿状态与 queue 怎样通过执行概率影响 market / limit order 选择；一 tick 模型只作机制基准。' },
    { id: 3, authors: 'Thierry Foucault, Ohad Kadan & Eugene Kandel', year: '2005', title: 'Limit Order Book as a Market for Liquidity', publication: 'Review of Financial Studies, 18(4), 1171–1217', url: 'https://doi.org/10.1093/rfs/hhi029', use: '连接耐心、到达率、spread、execution time 与 resiliency；tick 设计的完整分析留给 1.18。' },
    { id: 4, authors: 'Ioanid Roşu', year: '2009', title: 'A Dynamic Model of the Limit Order Book', publication: 'Review of Financial Studies, 22(11), 4601–4641', url: 'https://doi.org/10.1093/rfs/hhp011', use: '提供战略流动性竞争、快速短暂限价单与动态 spread / impact 的模型基准；预测依赖对称信息等设定。' },
    { id: 5, authors: 'Thierry Foucault, Ailsa Röell & Patrik Sandås', year: '2003', title: 'Market Making with Costly Monitoring: An Analysis of the SOES Controversy', publication: 'Review of Financial Studies, 16(2), 345–384', url: 'https://doi.org/10.1093/rfs/hhg005', use: '说明 costly monitoring、picked-off risk 与竞争怎样共同决定报价；不把特定 SOES 制度当现代通则。' },
    { id: 6, authors: 'Peter Hoffmann', year: '2014', title: 'A Dynamic Limit Order Market with Fast and Slow Traders', publication: 'Journal of Financial Economics, 113(1), 156–169', url: 'https://doi.org/10.1016/j.jfineco.2014.04.002', use: '支持快速 quote revision 降低 stale inefficiency，同时改变慢方策略与速度投资福利。' },
    { id: 7, authors: 'Bruno Biais, Thierry Foucault & Sophie Moinas', year: '2015', title: 'Equilibrium Fast Trading', publication: 'Journal of Financial Economics, 116(2), 292–313', url: 'https://doi.org/10.1016/j.jfineco.2015.03.004', use: '在模型中并列更快搜索收益与 adverse-selection externality；速度过度投资是条件性均衡结论。' },
    { id: 8, authors: 'Eric Budish, Peter Cramton & John Shim', year: '2015', title: 'The High-Frequency Trading Arms Race: Frequent Batch Auctions as a Market Design Response', publication: 'Quarterly Journal of Economics, 130(4), 1547–1621', url: 'https://doi.org/10.1093/qje/qjv027', use: '刻画连续时间下公开套利机会的速度竞赛；batch auction 只作为制度边界，不在本节裁决。' },
    { id: 9, authors: 'Markus Baldauf & Joshua Mollner', year: '2020', title: 'High-Frequency Trading and Market Performance', publication: 'Journal of Finance, 75(3), 1495–1526', url: 'https://doi.org/10.1111/jofi.12882', use: '分析速度、流动性与信息生产激励的理论权衡；不作为现实统一福利结论。' },
    { id: 10, authors: 'U.S. Securities and Exchange Commission', year: '2010', title: 'Concept Release on Equity Market Structure', publication: 'Release No. 34-61358, 75 FR 3594', url: 'https://www.sec.gov/rules-regulations/2010/01/concept-release-equity-market-structure', use: '提供 HFT 常见特征及“无单一清晰定义”的官方政策背景；不是经验因果研究。' },
    { id: 11, authors: 'Terrence Hendershott, Charles M. Jones & Albert J. Menkveld', year: '2011', title: 'Does Algorithmic Trading Improve Liquidity?', publication: 'Journal of Finance, 66(1), 1–33', url: 'https://doi.org/10.1111/j.1540-6261.2010.01624.x', use: '以 NYSE Autoquote 分阶段引入作为工具变量研究 algorithmic trading 与流动性；结果和数字限于样本、股票规模与历史制度。' },
    { id: 12, authors: 'Terrence Hendershott & Ryan Riordan', year: '2013', title: 'Algorithmic Trading and the Market for Liquidity', publication: 'Journal of Financial and Quantitative Analysis, 48(4), 1001–1024', url: 'https://doi.org/10.1017/S0022109013000471', use: '用 30 只 DAX 股票的算法标记说明供给/需求角色随 spread 状态变化；描述性均衡不是一般 HFT 处理。' },
    { id: 13, authors: 'Albert J. Menkveld', year: '2013', title: 'High Frequency Trading and the New-Market Makers', publication: 'Journal of Financial Markets, 16(4), 712–740', url: 'https://doi.org/10.1016/j.finmar.2013.06.006', use: '研究一个大型跨市场 HFT 做市者的参与、被动交易和库存收益；单一机构个案不得外推。' },
    { id: 14, authors: 'Joel Hasbrouck & Gideon Saar', year: '2013', title: 'Low-Latency Trading', publication: 'Journal of Financial Markets, 16(4), 646–679', url: 'https://doi.org/10.1016/j.finmar.2013.05.003', use: '以 NASDAQ message-level proxy 研究低延迟活动和市场质量；代理变量不等于完整 HFT 身份。' },
    { id: 15, authors: 'Björn Hagströmer & Lars Nordén', year: '2013', title: 'The Diversity of High-Frequency Traders', publication: 'Journal of Financial Markets, 16(4), 741–770', url: 'https://doi.org/10.1016/j.finmar.2013.05.009', use: '用 Stockholm participant category 区分 market-making 与 opportunistic HFT；样本占比不作全球外推。' },
    { id: 16, authors: 'Jonathan Brogaard, Terrence Hendershott & Ryan Riordan', year: '2014', title: 'High-Frequency Trading and Price Discovery', publication: 'Review of Financial Studies, 27(8), 2267–2306', url: 'https://doi.org/10.1093/rfs/hhu032', use: '区分主动 HFT 的价格发现贡献与被动 HFT 的 adverse selection；主体身份不能替代逐单角色。' },
    { id: 17, authors: 'Jonathan Brogaard, Björn Hagströmer, Lars Nordén & Ryan Riordan', year: '2015', title: 'Trading Fast and Slow: Colocation and Liquidity', publication: 'Review of Financial Studies, 28(12), 3407–3443', url: 'https://doi.org/10.1093/rfs/hhv045', use: '研究 Stockholm colocation upgrade 与流动性、adverse selection 和库存约束；保留自愿采用与制度边界。' },
    { id: 18, authors: 'Albert J. Menkveld & Marius A. Zoican', year: '2017', title: 'Need for Speed? Exchange Latency and Liquidity', publication: 'Review of Financial Studies, 30(4), 1188–1228', url: 'https://doi.org/10.1093/rfs/hhx006', use: '把更快 quote update 与更快 bandit 相遇的相反 spread 效应置于同一模型。' },
    { id: 19, authors: 'Dion Bongaerts & Mark Van Achter', year: '2021', title: 'Competition among Liquidity Providers with Access to High-Frequency Trading Technology', publication: 'Journal of Financial Economics, 140(1), 220–249', url: 'https://doi.org/10.1016/j.jfineco.2020.11.002', use: '让快慢交易者内生参与，说明速度/信息收益、winner’s-curse crowd-out、条件 half-spread 与服务概率可以异向。' },
    { id: 20, authors: 'Jonathan Brogaard & Corey Garriott', year: '2019', title: 'High-Frequency Trading Competition', publication: 'Journal of Financial and Quantitative Analysis, 54(4), 1469–1497', url: 'https://doi.org/10.1017/S0022109018001175', use: '用加拿大 Alpha 市场 HFT 逐步进入研究竞争与流动性；证据更符合数量竞争，外推受 venue 与进入过程限制。' },
    { id: 21, authors: 'Ekkehart Boehmer, Dan Li & Gideon Saar', year: '2018', title: 'The Competitive Landscape of High-Frequency Trading Firms', publication: 'Review of Financial Studies, 31(6), 2227–2276', url: 'https://doi.org/10.1093/rfs/hhx144', use: '比较不同 HFT 数据类别与竞争异质性；支持聚合口径会改变结论。' },
    { id: 22, authors: 'Amber Anand & Kumar Venkataraman', year: '2016', title: 'Market Conditions, Fragility, and the Economics of Market Making', publication: 'Journal of Financial Economics, 121(2), 327–349', url: 'https://doi.org/10.1016/j.jfineco.2016.03.006', use: '用 TSX 账户审计轨迹研究 endogenous liquidity providers 的相关进入/退出和 DMM 缓冲；不把波动机械写成退出原因。' },
    { id: 23, authors: 'Jonathan Brogaard, Allen Carrion, Thibaut Moyaert, Ryan Riordan, Andriy Shkilko & Konstantin Sokolov', year: '2018', title: 'High Frequency Trading and Extreme Price Movements', publication: 'Journal of Financial Economics, 128(2), 253–265', url: 'https://doi.org/10.1016/j.jfineco.2018.02.002', use: '区分单股与多股同时极端运动中的 HFT 净供给/需求，并报告少有起因证据；不排除条件放大。' },
    { id: 24, authors: 'Andrei Kirilenko, Albert S. Kyle, Mehrdad Samadi & Tugkan Tuzun', year: '2017', title: 'The Flash Crash: High-Frequency Trading in an Electronic Market', publication: 'Journal of Finance, 72(3), 967–998', url: 'https://doi.org/10.1111/jofi.12498', use: '用 E-mini 审计轨迹区分自动卖出、HFT 交易模式、gross turnover 与净库存传递；不作跨市场单因外推。' },
    { id: 25, authors: 'CFTC & U.S. Securities and Exchange Commission Staffs', year: '2010', title: 'Findings Regarding the Market Events of May 6, 2010', publication: 'Joint Staff Report, September 30, 2010', url: 'https://www.sec.gov/news/studies/2010/marketevents-report.pdf', use: '提供 Flash Crash 的官方过程时间线、流动性消耗与跨市场反馈；属于特定事件的 staff findings。' },
    { id: 26, authors: 'Matteo Aquilina, Eric Budish & Peter O’Neill', year: '2022', title: 'Quantifying the High-Frequency Trading “Arms Race”', publication: 'Quarterly Journal of Economics, 137(1), 493–564', url: 'https://doi.org/10.1093/qje/qjab032', use: '用 LSE/FCA 消息数据重建竞赛并估计延迟税反事实；所有数字严格限于样本、race 定义与模型。' },
    { id: 27, authors: 'Andriy Shkilko & Konstantin Sokolov', year: '2020', title: 'Every Cloud Has a Silver Lining: Fast Trading, Microwave Connectivity, and Trading Costs', publication: 'Journal of Finance, 75(6), 2899–2927', url: 'https://doi.org/10.1111/jofi.12969', use: '利用微波线路天气扰动研究相对速度差与 adverse selection / 交易成本；与绝对 maker-speed 升级区分。' },
    { id: 28, authors: 'U.S. Securities and Exchange Commission Staff', year: '2020', title: 'Staff Report on Algorithmic Trading in U.S. Capital Markets', publication: 'Division of Economic and Risk Analysis, August 5, 2020', url: 'https://www.sec.gov/files/marketstructure/research/algo_trading_report_2020.pdf', use: '官方综合正常市场质量贡献与异常压力风险；不作为单一经验识别。' },
    { id: 29, authors: 'Bank for International Settlements Markets Committee', year: '2011', title: 'High-Frequency Trading in the Foreign Exchange Market', publication: 'Markets Committee report, September 2011', url: 'https://www.bis.org/publ/mktc05.pdf', use: '提供 FX 市场中规模、正常/压力状态和无持续义务的制度观察；不可直接外推到股票 CLOB。' },
    { id: 30, authors: 'Jonathan Brogaard, Terrence Hendershott & Ryan Riordan', year: '2019', title: 'Price Discovery without Trading: Evidence from Limit Orders', publication: 'Journal of Finance, 74(4), 1621–1658', url: 'https://doi.org/10.1111/jofi.12769', use: '衡量限价单提交与取消对价格发现的贡献；贡献分解不等于速度随机处理或逐条消息福利判断。' },
    { id: 31, authors: 'Johannes Breckenfelder', year: '2024', title: 'Competition among High-Frequency Traders and Market Quality', publication: 'Journal of Economic Dynamics and Control, 166, 104922', url: 'https://doi.org/10.1016/j.jedc.2024.104922', use: '利用 Stockholm HFT 进入/退出与 tick reform 研究竞争、策略切换和市场质量；结果限于本地样本，且 tick 排除限制需保留。' },
    { id: 32, authors: 'U.S. Treasury, Federal Reserve Board, Federal Reserve Bank of New York, SEC & CFTC Staffs', year: '2015', title: 'The U.S. Treasury Market on October 15, 2014', publication: 'Joint Staff Report, July 13, 2015', url: 'https://home.treasury.gov/system/files/276/joint-staff-report-the-us-treasury-market-on-10-15-2014.pdf', use: '提供 2014 Treasury 快速往返、成交、depth 和参与者结构的官方过程证据；报告明确不支持单一原因。' },
    { id: 33, authors: 'Lorie K. Logan', year: '2020', title: 'Treasury Market Liquidity and Early Lessons from the Pandemic Shock', publication: 'Federal Reserve Bank of New York remarks, October 23, 2020', url: 'https://www.newyorkfed.org/newsevents/speeches/2020/log201023', use: '综合 2020 疫情冲击中的销售、dealer/PTF 中介、订单簿 depth、replenishment 与政策响应；属于早期官方讲话和作者观点。' },
  ],
  readingList: [
    { title: 'Ho & Stoll (1983), The Dynamics of Dealer Markets Under Competition', scope: '模型设定、dealer reservation values、竞争与库存动态', reason: '从 1.13 的单主体库存控制进入多 dealer 相互作用的经典起点。', url: 'https://doi.org/10.1111/j.1540-6261.1983.tb02282.x' },
    { title: 'Parlour (1998), Price Dynamics in Limit Order Markets', scope: '执行概率、queue state 与 market / limit order 选择', reason: '理解当前订单簿状态怎样通过未来执行概率改变订单选择。', url: 'https://doi.org/10.1093/rfs/11.4.789' },
    { title: 'Foucault, Kadan & Kandel (2005), Limit Order Book as a Market for Liquidity', scope: '耐心、到达率、spread、执行时间与 resiliency', reason: '理解流动性供求双方的等待成本怎样内生生成价差和恢复速度。', url: 'https://doi.org/10.1093/rfs/hhi029' },
    { title: 'Hoffmann (2014), A Dynamic Limit Order Market with Fast and Slow Traders', scope: '快慢交易者、quote revision、picked-off risk 与均衡福利', reason: '把“速度改善监控”和“速度改变竞争”放进同一模型。', url: 'https://doi.org/10.1016/j.jfineco.2014.04.002' },
    { title: 'Biais, Foucault & Moinas (2015), Equilibrium Fast Trading', scope: '速度投资、搜索收益与 adverse-selection externality', reason: '区分速度的私人收益、匹配收益和施加给慢方的外部成本。', url: 'https://doi.org/10.1016/j.jfineco.2015.03.004' },
    { title: 'Budish, Cramton & Shim (2015), The High-Frequency Trading Arms Race', scope: '公开套利机会、连续时间竞赛与 frequent batch auctions', reason: '理解连续匹配如何把极短暂公开套利变成私人速度投资激励。', url: 'https://doi.org/10.1093/qje/qjv027' },
    { title: 'Hendershott, Jones & Menkveld (2011), Does Algorithmic Trading Improve Liquidity?', scope: 'Autoquote 工具变量、样本分组、spread 分解、depth 与弱工具边界', reason: '学习怎样把一个广泛因果结论压回具体处理、样本和市场质量维度。', url: 'https://doi.org/10.1111/j.1540-6261.2010.01624.x' },
    { title: 'Hagströmer & Nordén (2013), The Diversity of High-Frequency Traders', scope: 'participant category、market-making 与 opportunistic HFT', reason: '建立“HFT 聚合身份内部仍有策略异质性”的经验基础。', url: 'https://doi.org/10.1016/j.finmar.2013.05.009' },
    { title: 'Brogaard, Hendershott & Riordan (2014), High-Frequency Trading and Price Discovery', scope: '主动/被动 HFT、永久价格与 adverse selection', reason: '建立“HFT 身份不等于逐单角色”并观察两类角色怎样进入价格发现。', url: 'https://doi.org/10.1093/rfs/hhu032' },
    { title: 'Brogaard et al. (2015), Trading Fast and Slow: Colocation and Liquidity', scope: 'colocation upgrade、绝对监控速度、流动性与库存约束', reason: '学习绝对更新能力改善时的局部制度证据及自愿采用边界。', url: 'https://doi.org/10.1093/rfs/hhv045' },
    { title: 'Shkilko & Sokolov (2020), Every Cloud Has a Silver Lining', scope: 'microwave weather disruption、相对速度差与交易成本', reason: '把主体间相对速度优势与整个市场的绝对速度提升区分开。', url: 'https://doi.org/10.1111/jofi.12969' },
    { title: 'Aquilina, Budish & O’Neill (2022), Quantifying the HFT “Arms Race”', scope: 'race 定义、消息重建、样本统计和 latency-tax 反事实', reason: '观察怎样从海量消息识别微秒竞赛，同时审计模型依赖。', url: 'https://doi.org/10.1093/qje/qjab032' },
    { title: 'Anand & Venkataraman (2016), Market Conditions, Fragility, and the Economics of Market Making', scope: 'endogenous liquidity providers、相关进入退出、DMM 与复合市场状态', reason: '理解名义供应者竞争为何不保证压力期独立容量。', url: 'https://doi.org/10.1016/j.jfineco.2016.03.006' },
    { title: 'Brogaard & Garriott (2019), High-Frequency Trading Competition', scope: '加拿大 Alpha 的分阶段 passive entry 与边际竞争效应', reason: '观察早期被动进入者怎样改善价差以及边际效应为何递减。', url: 'https://doi.org/10.1017/S0022109018001175' },
    { title: 'Breckenfelder (2024), Competition among High-Frequency Traders and Market Quality', scope: 'Stockholm 的 HFT 竞争、策略重配与市场质量', reason: '与 Alpha 结果并读，判断竞争何时从数量供给切向同侧投机。', url: 'https://doi.org/10.1016/j.jedc.2024.104922' },
    { title: 'Kirilenko et al. (2017), The Flash Crash', scope: 'E-mini 审计轨迹、初始卖单、HFT turnover 与净库存传递', reason: '训练区分事件起因、库存控制与条件性放大。', url: 'https://doi.org/10.1111/jofi.12498' },
    { title: 'Brogaard et al. (2018), High Frequency Trading and Extreme Price Movements', scope: '单股与多股同时极端运动中的 HFT 净供给/需求', reason: '理解冲击相关性怎样让同一类主体的流动性角色发生符号翻转。', url: 'https://doi.org/10.1016/j.jfineco.2018.02.002' },
  ],
};
