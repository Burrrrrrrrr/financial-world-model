import MarketMakerHftLab from '../components/MarketMakerHftLab';
import { marketMakerHftScenarios } from '../components/marketMakerHftScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson208Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Market maker／HFT agent 不是一条“看见价差就套利”的规则，而是一台在事件到来后不断重写信念、库存、队列位置和可行集的实时决策系统。</h2>
        <p>
          一张报价在送出时只是条件性承诺。它能否赚钱，取决于成交前公允价值是否已移动、订单前方还有多少队列、撤单能否先于成交到达、成交后库存能否被反向流量或 hedge 消化，以及费用、风险限额和系统健康是否允许下一步动作。因而本节的中心链不是“预测价格→交易”，而是：<b>公共行情与私有状态进入短期信念；硬约束先筛去不可行动作；agent 再在 quote center、spread、size、cancel、hedge 与 routing 之间选择；ack、fill、markout 和拒单更新状态；许多 agent 的相似响应最终形成流动性补充或同步撤退。</b><Cite n={1} /><Cite n={2} /><Cite n={12} /><Cite n={31} />
        </p>
        <p>
          “Market maker”“dealer”“designated market maker”和“HFT”分别描述经济功能、法律／交易所身份或技术行为，不能互换。HFT 既可能被动供给流动性，也可能主动吃单、套利或执行母单；传统 dealer 也可以不追求微秒速度。只有先冻结 actor、venue、产品、账户、时钟和规则版本，才能讨论 objective function，而不是先给所有高速参与者贴上同一种动机。<Cite n={13} /><Cite n={23} /><Cite n={35} /><Cite n={39} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整事件闭环</p>
        <h2>电子做市的最小分析单位不是“一天的收益”，而是从一个有序事件到下一次状态承诺的闭环。</h2>
        <div className="mechanism-chain" aria-label="电子做市从事件到反馈的七步因果链">
          <div><span>01</span><b>接收事件</b><p>行情、成交、ack、reject、计时器、风险告警或相关资产变化到达。</p></div>
          <div><span>02</span><b>校验时间与状态</b><p>检查 sequence、clock、连接、订单生命周期、库存和 queue 是否一致。</p></div>
          <div><span>03</span><b>更新信念</b><p>重估短期公允价值、fill probability、toxicity、markout 与 hedge cost。</p></div>
          <div><span>04</span><b>读取可行集</b><p>库存、notional、capital、消息、义务、价格带和系统健康先排除动作。</p></div>
          <div><span>05</span><b>选择动作</b><p>keep、cancel、join、improve、resize、take、hedge、route 或停止。</p></div>
          <div><span>06</span><b>等待确认</b><p>请求在网络、gateway 与 matching engine 中传播；在途状态仍可成交。</p></div>
          <div><span>07</span><b>反馈重启</b><p>fill、markout、库存、队列和其他 agent 响应成为下一轮输入。</p></div>
        </div>
        <p>
          这条闭环解释了为什么“撤单”不是瞬间消除风险，“低延迟”也不是一个单数。若新信息在 t<sub>0</sub> 出现，agent 在 t<sub>1</sub> 看见、t<sub>2</sub> 完成计算、t<sub>3</sub> 通过风险检查、t<sub>4</sub> 发出 cancel，而撮合器到 t<sub>5</sub> 才处理，旧报价在 t<sub>0</sub>–t<sub>5</sub> 仍可能被执行。正确研究必须保留这段因果时钟，而不是用毫秒 bar 把先后次序压平。<Cite n={14} /><Cite n={18} /><Cite n={31} /><Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与术语桥</p>
        <h2>本节把 1.12–1.14 的做市机制和 2.07 的机构约束，转换成一个可执行、可观测、可证伪的 agent policy。</h2>
        <p>
          硬先修是 1.12–1.14；按需回看 1.03–1.05 的订单与 LOB、1.08–1.10 的订单流／price impact／adverse selection、1.18 的 tick、2.07 的法律实体与 dealer headroom，以及 T03、T05、T08。本节不重做做市存在理由、券商净资本或系统级融资螺旋；期权 delta/gamma hedge 只保留 1.24 接口，完整系统性反馈留给 7.11。
        </p>
        <div className="learning-objectives">
          <span>八阶段学习路线 · 从事件到受约束策略</span>
          <ol>
            <li><b>主体与时钟（03–07）：</b>分开经济功能、身份、技术和策略，再冻结公共／私有状态。</li>
            <li><b>状态向量（08–14）：</b>建立 fair value、inventory、queue、latency、toxicity、venue 与可行集。</li>
            <li><b>模型核（15–22）：</b>把 Ho–Stoll、Glosten–Milgrom、Kyle 与 A–S 放进各自边界。</li>
            <li><b>报价决策（23–31）：</b>选择中心、宽度、数量、排队、撤单与 markout 诊断。</li>
            <li><b>场所与系统（32–46）：</b>处理 hedge、routing、数据、colocation、fees、controls 与治理。</li>
            <li><b>反馈与案例（47–52）：</b>区分库存负反馈、流动性正反馈、mirage、Flash Crash 与 Knight。</li>
            <li><b>研究与法域（53–54）：</b>冻结观测单位、识别策略和当前美国／欧盟／中国边界。</li>
            <li><b>实验与接口（55–59）：</b>用十题共享数据、静态变式和主动复述闭合 world model。</li>
          </ol>
          <p><b>时间预算：</b>核心阅读约 120–135 分钟；互动实验快速 25–30 分钟、含复盘 45–55 分钟；主动练习核对 25–30 分钟、完整书写 45–60 分钟；理解检查快速 10–12 分钟、完整复述 18–22 分钟；接口 4 分钟。建议分三次完成，参考文献与延伸阅读不计。</p>
          <p><b>订单生命周期：</b>quote/order 是尚未成交的条件性指令；send 是本地发出；gateway ack 是场所接受或拒绝的回报；fill 才改变成交与库存；cancel 是撤销请求，不是已经撤销；cancel ack 之前存在 cancel/fill race。Modify 在不同 venue 可能保留或失去优先级，不能统一假定。</p>
          <p><b>市场状态：</b>mid 是 bid/ask 的参照中心，不保证可成交；queue ahead 是同价位在本单之前仍待消耗的数量；stale quote 是相关信息变化后仍可按旧条件成交的报价；actionable liquidity 是同一状态、同一时点真正可同时执行的深度，不等于跨 venue 显示量简单相加。</p>
          <p><b>风险与测量：</b>adverse selection 是成交条件本身使未来价值分布变差；markout 是成交后统一期限相对基准的结果测量，可能混入公共新闻、机械 impact 和 latency；toxicity 是条件成交损失的风险概念，不是交易者道德标签；delta-one 指标的变化一单位时头寸局部价值约变化一单位。</p>
          <p><b>市场基础设施与法域缩写：</b>NMS（National Market System）是美国全国市场体系语境；LULD（Limit Up–Limit Down）是 NMS 股票价格带与暂停计划；round lot 是规则定义的标准交易单位，ADV（average daily volume）是平均日成交量；SIP（Securities Information Processor）汇集并发布规定的美国市场数据，ATS（Alternative Trading System）是受相应证券规则约束的替代交易系统。SCI entity 是 Regulation Systems Compliance and Integrity 覆盖的特定基础设施主体；MPID（Market Participant Identifier）是市场参与者识别码。期货法域的 DCM（Designated Contract Market）是指定合约市场，FCM（Futures Commission Merchant）是期货佣金商；欧盟 DEA（Direct Electronic Access）指客户通过成员／参与者的基础设施直接电子接入场所。本段只搭术语桥，精确主体和效力仍以第 54 节的产品、法域与规则版本为准。</p>
          <p><b>技术状态：</b>latency 至少拆成市场传播、接收标准化、信号计算、风险检查、网络、gateway、matching 与回报；jitter 是延迟的波动。Colocation 缩短部分物理与网络路径，但不保证最先到达或获利。Kill switch 阻止新增动作并尽可能撤单，不等于市场级 LULD、熔断或 CME Stop Logic。</p>
          <p><b>费用与身份：</b>maker/taker 描述一次成交的流动性角色，不等于机构永久身份；rebate 是现金流，不是总利润。DMM 是特定场所规则身份；dealer 是法律／经济角色；HFT 是技术与行为集合，在不同法域定义不同。</p>
          <p><b>七个缩写与系统词：</b>RFQ 是请求一个或多个 dealer 报价；NBBO 是美国 NMS 证券在各交易中心汇总后的全国最佳 bid/offer；notional 是价格乘数量形成的名义暴露，不等于最大可能损失；basis 是现货与 hedge 工具之间可能变化的相对价差；sequence 是数据源赋予事件的有序编号；gateway 是订单进入场所或风控系统的接入层；parent order 是上层交易意图，child orders 是算法据此生成的具体场所指令。</p>
          <p><b>六个“不等同”：</b>DMM ≠ 一般 electronic market maker ≠ HFT；LULD ≠ firm kill；cancellation ≠ spoofing；公开数据驱动的 order anticipation ≠ 使用客户重大非公开订单信息的 front-running；达到高消息阈值 ≠ 操纵；Reg SCI ≠ Rule 15c3-5。每个等号都必须由额外身份、意图、法域或控制证据建立。</p>
        </div>
      </section>

      <section className="lesson-section" id="functional-legal-technical">
        <p className="section-kicker">阶段一 · 主体与状态　|　03 · 三条分类轴</p>
        <h2>“提供流动性”“具有做市义务”“使用高频技术”是三条正交轴；任何一条都不能推出另外两条。</h2>
        <div className="table-scroll" role="region" aria-label="做市与高频交易三条分类轴，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">做市经济功能、法律身份和技术行为的区别</caption>
            <thead><tr><th scope="col">轴</th><th scope="col">它回答什么</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">经济功能</th><td>是否暂时承接订单另一侧、桥接自然买卖者并承担库存</td><td>不自动拥有交易所指定身份，也不说明速度</td></tr>
              <tr><th scope="row">法律／venue 身份</th><td>是否为 dealer、registered market maker、DMM 或其他受规则约束主体</td><td>不保证每笔交易都被动供给流动性</td></tr>
              <tr><th scope="row">技术／行为</th><td>是否自动决策、低延迟、高消息率以及使用何类策略</td><td>HFT 不是单一策略、观点或统一美国法定实体</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          SEC 2010 concept release 用一组常见特征和策略描述 HFT，而不是创造一项完备法律身份；MiFID II 则把 high-frequency algorithmic trading technique 放在 algorithmic trading 的子集中，并同时要求旨在降低延迟的基础设施、逐笔订单的发起、生成、路由或执行由系统决定且无人干预，以及较高的日内消息率，后者的计算细节再由 delegated regulation 操作化。“有限或无人干预”属于较宽的 algorithmic trading 定义，不能替代这里的无人干预要件。这仍是在定义一种技术，不是在认定单一策略、盈利方向或普遍做市义务。两套文本服务于不同法域，不能把一方阈值移植成全球定义。<Cite n={35} /><Cite n={48} /><Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="traditional-electronic">
        <p className="section-kicker">04 · 传统与电子做市</p>
        <h2>电子化改变的是状态更新频率、动作粒度和控制失败路径，不会消除做市的库存、信息与参与约束。</h2>
        <p>
          传统 dealer 可能用电话、RFQ 或人工判断承接较大、较稀疏的订单，并在分钟到数日内管理库存；电子 proprietary market maker 往往同时在大量 symbol／venue 上运行自动策略，用更小订单和更短持有期循环库存。两者都在出售 immediacy，并同时面对“成交赚取价差”和“被更知情或更快的对手方挑中”的矛盾。<Cite n={1} /><Cite n={9} /><Cite n={13} />
        </p>
        <p>
          自动化把该矛盾转成运营状态：一条旧代码、一个失序 sequence、一次错误部署或无法对账的子单流都能使策略在经济模型仍然正确时失控。因而 production agent 的 policy 必须把 system healthy、version、connection、message budget 和 kill state 放进可行集，而不是把它们留给“IT 后台”。<Cite n={28} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="dmm">
        <p className="section-kicker">05 · Designated Market Maker</p>
        <h2>DMM 的指定身份通过报价、参与或公平有序市场义务改变可行集；它不承诺在任何价格和任何压力状态下无限接盘。</h2>
        <p>
          NYSE Rule 104 要求 assigned DMM 维持至少一 round lot 的连续双边报价，并分别规定其在 NBBO 或更优价位的日内 presence：相关证券 consolidated ADV 低于 100 万股时至少 15%，否则至少 10%。这不等于 DMM 始终处于 NBBO，更不等于无限库存担保。义务与激励会使 DMM 的退出选择不同于完全自由的 proprietary liquidity provider，但资本、风险与市场状态仍然存在。把 DMM 经验结果推广到没有同样规则、auction 和责任结构的 venue，会把制度变量误当作普遍 agent 性格。<Cite n={39} /><Cite n={24} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="hft-strategy-taxonomy">
        <p className="section-kicker">06 · HFT 策略分类</p>
        <h2>同一家高速公司可以同时被动报价、主动对冲、跨 venue 套利和执行库存修复；“HFT 买入”不说明它为什么买。</h2>
        <div className="table-scroll" role="region" aria-label="高频策略与订单角色分类，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">HFT 常见策略的目标、订单与主要风险</caption>
            <thead><tr><th scope="col">策略功能</th><th scope="col">常见动作</th><th scope="col">主要状态</th><th scope="col">误读边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">被动做市</th><td>双边 limit、skew、resize、cancel</td><td>fill、库存、queue、markout</td><td>并非所有 HFT 都持续供给</td></tr>
              <tr><th scope="row">跨 venue／资产套利</th><td>一处 take、另一处 hedge 或同步订单</td><td>basis、latency、leg risk</td><td>价差不保证可同时成交</td></tr>
              <tr><th scope="row">短期方向／anticipation</th><td>根据信号主动吃单或撤旧价</td><td>预测、impact、法律信息边界</td><td>公开流量推断不自动是 front-running</td></tr>
              <tr><th scope="row">执行算法</th><td>把母单按时间、成交量或流动性拆分</td><td>implementation shortfall、participation</td><td>高频执行不等于自营 HFT</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          实证研究确实发现 HFT 在流动性供给、需求和价格发现中的行为不同，但分类依赖 participant ID、样本与标签规则。消息成交比、短持有期或高撤单率只能是行为代理，不能单独证明法律身份或获利策略。<Cite n={22} /><Cite n={23} /><Cite n={31} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="public-private-state">
        <p className="section-kicker">07 · 公共信息与私有状态</p>
        <h2>两台 agent 看到同一 order book，也会因为库存、订单回报、延迟和风险余量不同而采取相反动作。</h2>
        <p>
          公共输入包括多档 LOB、成交、auction/phase、相关证券、期货或 ETF、价格带、venue status 与 fee schedule；私有输入包括自己的 live orders、queue estimate、fills、inventory、hedges、PnL、risk headroom、client/strategy mandate、连接健康、版本和在途请求。只有公共行情而没有私有订单状态，无法重建 agent 的真实 policy。<Cite n={12} /><Cite n={31} /><Cite n={58} /><Cite n={60} /><Cite n={61} />
        </p>
        <p>
          状态必须带 event time 与 knowledge time：交易所何时生成事件、agent 何时收到、何时据此下单是三个时点。研究若用事后完整 order book 标签构造“实时信号”，或用日终库存解释盘中撤单，就泄漏了未来和跨尺度信息。
        </p>
        <div className="precision-note">
          <span>MEASUREMENT SHIELD · 在首次读取 queue、toxicity 或 markout 之前</span>
          <p>先核对 consolidated/direct feed 的覆盖与时延、clock accuracy、hidden/replenishing liquidity、modify priority、稳定 participant identifier、失败入站消息和 cancel intent 是否可见；再冻结 markout side、benchmark、horizon 与存活样本。缺失这些字段时可以报告 reduced-form 关联，不能声称恢复了真实 queue、私有信念或法律意图。</p>
        </div>
      </section>

      <section className="lesson-section" id="fair-value-belief">
        <p className="section-kicker">阶段二 · 状态向量　|　08 · 短期公允价值信念</p>
        <h2>Agent 报价围绕的不是永恒基本价值，而是给定当前信息和持有期限的条件价值分布。</h2>
        <div className="equation-card">
          <span>短期公允价值 · 条件信念</span>
          <div>m̂<sub>t</sub>(h) = E[V<sub>t+h</sub> | I<sub>t</sub>]</div>
          <p>m̂ 是每股价格，h 是预测／持有期限，I<sub>t</sub> 是该时点 agent 真正可见的市场与私有状态。改变 h、数据时钟或信息集会改变答案；m̂ 不是保证成交的 mid，也不是公司永续内在价值。</p>
        </div>
        <p>
          一个可执行信念还要给出不确定性与更新规则。若期货先动、相关 venue 深度消失或自身 bid 刚被连续击中，agent 可能同时上调条件价值、提高毒性概率并降低 quote size；这三个状态对中心、宽度与数量的作用不同，不能压成一个模糊“看多信号”。<Cite n={4} /><Cite n={5} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-state">
        <p className="section-kicker">09 · Inventory State</p>
        <h2>库存状态至少要分 gross、net、hedged、available-to-trade 与 target deviation；一个日终净数会隐藏盘中风险路径。</h2>
        <p>
          q 是某一风险坐标上的净库存，不必等于会计证券数量。现货多头和期货空头可以使 delta 接近零，却仍留下 basis、funding、margin、dividend、borrow 与 settlement risk；多个 venue 的同券订单还可能在同一瞬间同时成交。正确状态应写成当前仓位、潜在 live-order fills、已确认 hedge 与尚在途 hedge 的分层，而不是只观察最后净额。<Cite n={1} /><Cite n={2} /><Cite n={13} />
        </p>
        <p>
          Inventory target 也未必为零：义务、预期客户流、hedge lot、borrow availability 或 auction 需求都可使目标随状态改变。价格中心向下移动、bid size 缩小、ask size 增加、主动卖出 hedge 都能减少多头风险，动作之间的成本和时钟不同。
        </p>
      </section>

      <section className="lesson-section" id="queue-state">
        <p className="section-kicker">10 · Queue State</p>
        <h2>同一价格的一张订单有多大价值，取决于它前面有多少可被成交或撤销的量，以及修改是否重置优先级。</h2>
        <p>
          本节的 queue 公式只对严格 price–time/FIFO 成立；pro-rata、size-priority 或 hybrid allocation 要使用另一套状态。FIFO 下，queue ahead 随前方成交和前方撤单下降，也可因规则允许的新增优先订单、hidden/reserve replenishment 或 order modification 改变。屏幕上的档位总量并不告诉你自己的精确位置；仅有 L1 或 trade prints 更无法知道撤单来自前方还是后方。<Cite n={6} /><Cite n={7} /><Cite n={11} /><Cite n={19} /><Cite n={61} />
        </p>
        <p>
          排得更前提高 fill probability，却也意味着旧价最先暴露于 informed or fast flow。Queue priority 因此同时是获得 spread 的资产和被挑中的风险；“更快永远更好”只有在两部分净价值为正、系统与成本相同时才成立。
        </p>
      </section>

      <section className="lesson-section" id="latency-vector">
        <p className="section-kicker">11 · Latency Vector</p>
        <h2>端到端延迟是八段路径与随机抖动的向量；平均值相同的两套系统可能具有完全不同的尾部成交风险。</h2>
        <div className="table-scroll" role="region" aria-label="交易延迟分段，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">从市场事件到订单回报的延迟路径</caption>
            <thead><tr><th scope="col">阶段</th><th scope="col">起止</th><th scope="col">主要失败</th></tr></thead>
            <tbody>
              <tr><th scope="row">Market/data</th><td>撮合事件→feed→接收／标准化</td><td>packet loss、sequence gap、feed divergence</td></tr>
              <tr><th scope="row">Decision/risk</th><td>状态更新→策略→pre-trade check</td><td>stale state、拥塞、限额或版本错误</td></tr>
              <tr><th scope="row">Outbound/venue</th><td>network→gateway→matching engine</td><td>jitter、排队、reject、session throttle</td></tr>
              <tr><th scope="row">Return</th><td>ack/fill/cancel report→本地账本</td><td>回报迟到、乱序、重复与 reconciliation gap</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          相对延迟决定竞速，尾部 jitter 决定风险控制最坏时刻。Colocation 只缩短部分路径；若本地状态机、risk gateway 或回报对账更慢，物理距离优势仍可能被吞掉。实证还必须检验 timestamp precision 与 accuracy，而不是看到纳秒字段就假定跨参与者次序精确。<Cite n={14} /><Cite n={17} /><Cite n={18} /><Cite n={63} />
        </p>
      </section>

      <section className="lesson-section" id="fill-toxicity">
        <p className="section-kicker">12 · Fill Probability 与 Toxicity</p>
        <h2>高成交率既可能来自优秀排队，也可能来自报价过时；只最大化 fill probability 会选择最危险的成交。</h2>
        <div className="equation-card">
          <span>被动订单的条件期望价值 · 教学分解</span>
          <div>EV<sub>keep</sub> = P(ℱ)E[MO<sub>h</sub> + R − Fee − H | ℱ] + [1 − P(ℱ)]V<sub>cont</sub> − C<sub>I</sub> − C<sub>O</sub></div>
          <p>ℱ 是本报价成交事件；MO<sub>h</sub>=d(m<sub>t+h</sub>−p<sub>exec</sub>) 是从成交价量到未来 mid 的有符号每股 markout，买入时 d=+1、卖出时 d=−1，坏成交为负，因此它已经包含成交价相对未来基准的价差结果，不能再额外加一次 spread capture。R/Fee 是 rebate/fee，H 是条件对冲成本；V<sub>cont</sub> 是未成交后继续排队、改价或撤单的价值。C<sub>I</sub>、C<sub>O</sub> 是库存与运营成本的同单位等价值。所有项必须使用同一方向、期限和每股单位，rebate 与成交损益只能在 ℱ 条件下计入。</p>
        </div>
        <p>
          成交是选择事件：只有被挑中的订单才产生 markout，而最毒的状态往往最容易成交。研究若把 filled quotes 与全体未成交 quotes 直接比较，会把 selection 当作处理效应；需要构造仍存活的可比报价，并把 fill 与 cancel 当作 competing risks。<Cite n={7} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="venue-system-state">
        <p className="section-kicker">13 · Venue Economics 与 System Health</p>
        <h2>Tick、priority、fees、交易阶段和系统健康会共同改变同一信念对应的最优动作。</h2>
        <p>
          大 tick 可能把竞争从价格推向 queue speed 和 size；maker rebate 可能使显示价向外调整；auction、halt 或 price band 会改变可用订单类型和成交时钟；消息节流又可能让理论上应撤的订单无法及时撤。因而 venue state 不是执行后的附注，而是 policy 输入。<Cite n={19} /><Cite n={20} /><Cite n={42} /><Cite n={44} />
        </p>
        <p>
          System healthy 也不能用“进程还活着”替代。至少要检查行情 sequence、订单／成交回报完整性、时钟、risk service、连接、版本、限额、input-output reconciliation 与 kill path。若任何关键状态未知，安全可行集通常应缩小，而不是沿用最后已知报价。<Cite n={28} /><Cite n={32} /><Cite n={51} />
        </p>
      </section>

      <section className="lesson-section" id="feasible-action-set">
        <p className="section-kicker">14 · Action Feasibility</p>
        <h2>硬约束先于优化：理论期望收益最高但会被风控拒绝的订单，不是 agent 的真实可选动作。</h2>
        <div className="equation-card">
          <span>动作可行集 · 教学状态约束</span>
          <div>A(x<sub>t</sub>) = {'{'}a : |q<sub>t</sub> + Δq(a) + H<sub>confirmed</sub>(a)| ≤ Q<sub>max</sub>, N(a) ≤ N<sub>max</sub>, M(a) ≤ M<sub>max</sub>, system healthy{'}'}</div>
          <p>q 是当前库存，Δq(a) 是候选 fill 带来的库存；H<sub>confirmed</sub>(a) 只能计入已经成交并确认的 hedge，或由真实市场机制保证与动作原子执行的 hedge，普通跨 venue 在途订单不能预先冲减 headroom。N 和 M 是 notional 与消息消耗。真实系统还有 price、credit/capital、concentration、venue 和义务约束；先筛可行，再比较价值。</p>
        </div>
        <p>
          可行集本身会随 event 改变：一个 fill 直接消耗库存余量，并可能触发 hedge、cancel 或 replace 等出站动作，从而间接消耗消息余量；若题设限定的是 outbound message cap，入站 fill report 本身不能被偷算成 add/cancel/replace。只有具体 venue 规则明确计入时，fill report 才进入相应消息口径。一个 reject 可能表明场所状态不同，一个 hedge venue halt 会使原本可接受的 quote size 失去风险出口。2.07 提供法人和资本 headroom，本节只把这些上游约束读成实时 policy 输入。<Cite n={29} /><Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="objective-function">
        <p className="section-kicker">阶段三 · 模型核　|　15 · Objective Function</p>
        <h2>做市 agent 优化的是受约束、跨路径的风险调整结果，不是逐笔价差或订单数量。</h2>
        <div className="equation-card">
          <span>课程综合目标 · 不是公司真实效用函数</span>
          <div>π* = arg max<sub>π∈Π_feas</sub> E<sub>t</sub>[W<sub>T</sub> − λ<sub>I</sub>∫<sub>t</sub><sup>T</sup>q<sub>u</sub>²du − λ<sub>D</sub>D<sub>T</sub> − λ<sub>O</sub>O<sub>T</sub>]</div>
          <p>π 是从状态 x 到动作的 policy，而不是单次动作；Π<sub>feas</sub> = {'{'}π：对每个 u∈[t,T]，π(x<sub>u</sub>)∈A(x<sub>u</sub>){'}'}，即 policy 在整条路径上都只能选择第 14 节的可行动作。E<sub>t</sub> 是给定 t 时信息的条件期望，T 是终点，W<sub>T</sub> 是终点总财富（美元）；q<sub>u</sub> 是库存单位数，因此 λ<sub>I</sub> 的单位是美元／（库存单位²×时间）。D<sub>T</sub> 与 O<sub>T</sub> 分别是累计义务违约和运营故障的无量纲严重度分数，λ<sub>D</sub> 与 λ<sub>O</sub> 以美元／分数单位把它们换成货币等价值。指定做市义务可进入可行集或罚项。该式只说明目标层次，不声称这些分数或任何公司的真实偏好可以直接观察。</p>
        </div>
        <p>
          λ 不是任意“调参”：它压缩资本成本、风险容忍、治理与义务，且会随压力状态改变。若把逐笔 spread capture 当唯一 reward，策略会偏好高 fill、忽略 inventory tail、撤单失效和系统事故；若惩罚库存过强，又可能在共同冲击时与其他 agent 同步撤退。<Cite n={2} /><Cite n={3} /><Cite n={12} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="ho-stoll">
        <p className="section-kicker">16 · Ho–Stoll：库存为何进入价格</p>
        <h2>随机客户到达使 dealer 在等待反向订单期间承担价格风险，因此库存偏离会改变保留价格和报价倾向。</h2>
        <p>
          Ho–Stoll 的核心贡献不是给出现代 HFT 的生产公式，而是把 dealer 的动态问题写清：当前成交改变库存，库存风险跨到未来，未来报价反过来影响订单到达。多头 dealer 倾向降低中心或减少 bid、增加 ask，吸引卖出库存的成交；但信息风险、竞争与场所规则也可同时改变 spread 和 size。<Cite n={1} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="glosten-milgrom">
        <p className="section-kicker">17 · Glosten–Milgrom：成交方向怎样更新信念</p>
        <h2>竞争性零利润并不要求 bid=ask；当买卖方向改变终值后验，价差就是不利选择的条件补偿。</h2>
        <div className="equation-card">
          <span>条件零利润报价 · 二状态思想</span>
          <div>a = E[V | buy]；　b = E[V | sell]</div>
          <p>Ask 是观察到买单后的条件价值，bid 是观察到卖单后的条件价值。若买单更可能来自高价值状态，则 a 高于无条件均值；该模型隔离信息成分，不包含库存、queue、latency、fees 或做市义务。</p>
        </div>
        <p>
          这里的 informed 不等于内幕交易者。任何能更早整合公共信息、相关市场或订单流状态的对手方，都可能使被动成交具有负 markout。第 2 题用 Bayes 把“20% 知情”与“买单后的 60% 高值后验”区分开。<Cite n={4} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="kyle">
        <p className="section-kicker">18 · Kyle：订单流与均衡 Price Impact</p>
        <h2>Kyle 的 λ 把净订单流如何进入价格压成一条均衡关系；它不是 market maker 的挂单控制律。</h2>
        <div className="equation-card">
          <span>线性价格冲击 · 模型压缩</span>
          <div>Δp = λy</div>
          <p>y 是明确窗口和符号下的净订单流，λ 的单位是“价格变化／净流量单位”，即该尺度的逆深度。把 y 从 shares 改成 contracts、dollars、OFI 或另一时间桶时，λ 的数值和量纲都必须一起改变。λ 越大，同样 y 对价格影响越大；它同时受信息与噪声结构影响，不能解释成每股固定机械冲击，也不能证明所有订单流都知情。</p>
        </div>
        <p>
          对 agent 来说，λ 是状态或成本输入：主动 hedge 会支付 impact，被动报价的撤退又可能提高局部 λ。经验估计必须冻结时间尺度、订单流分类和 simultaneity，否则价格变化也会反向生成订单。<Cite n={5} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="as-environment">
        <p className="section-kicker">19 · Avellaneda–Stoikov 的可解环境</p>
        <h2>A–S 用 Brownian mid、CARA utility 和随报价距离指数下降的独立到达，换来一个透明的库存—报价比较静态。</h2>
        <p>
          原模型设中间价扩散，买卖市场单以 Poisson 强度到达，agent 选择距离 mid 的报价并在有限期限最大化终端财富效用。CARA 表示绝对风险厌恶不随财富水平改变；Poisson 则把订单到达近似为独立、无记忆的随机事件。为避免与上一节 Kyle 的价格冲击系数 λ 混淆，本节把订单到达强度写成 λ<sub>arr</sub>(δ)=Ae<sup>−kδ</sup>：λ<sub>arr</sub> 的单位是每单位时间的预期到达次数，A 是 δ=0 时的基准到达强度，δ 是报价距 mid 的美元／股价格距离，k 是每“美元／股”的逆价格尺度。这里的 λ<sub>arr</sub> 与 Kyle λ 没有数学或经济上的同一关系。以下公式把“一个模型成交单位”设为一股，其单位计数 q 视为无量纲，γ 与 k 都按模型价格美元的逆数表示，使 γ/k 无量纲；若改用手、合约或不同货币价格单位，q、γ、σ 与 k 必须联合缩放，而不能只替换库存数字。透明性来自强假设，不来自它描述了真实撮合器全部细节。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="as-reservation-price">
        <p className="section-kicker">20 · A–S Reservation Price</p>
        <h2>库存风险先移动报价中心：多头使中心下移，空头使中心上移，效应随风险厌恶、波动与剩余期限增强。</h2>
        <div className="equation-card">
          <span>A–S Reservation Price · 原模型近似</span>
          <div>r<sub>t</sub> = s<sub>t</sub> − q<sub>t</sub>γσ²(T − t)</div>
          <p>在一股为模型成交单位的记号下，s 与 r 是该单位的美元价格，q 是无量纲的单位数，σ 是模型价格波动率/√时间，γ 是模型价格美元的逆数，因此乘积回到每单位价格。q&gt;0 时 r&lt;s，表示多头 agent 下移中心以减少继续买入并鼓励卖出；这不是未来价格预测。</p>
        </div>
        <p>
          同一个中心移动可以由 signal 或 inventory 产生，但经济含义不同：signal 上调表示对未来价值更乐观，inventory 下调表示即使价值信念不变也愿意用价格换取风险释放。研究若只看 quote center，不观察 inventory 与相关资产，就无法分辨两条机制。<Cite n={2} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="as-spread">
        <p className="section-kicker">21 · A–S Spread</p>
        <h2>在特殊指数到达设定下，总价差同时补偿持有期库存风险和对成交强度的价格弹性。</h2>
        <div className="equation-card">
          <span>A–S 总价差 · λ<sub>arr</sub>(δ)=Ae<sup>−kδ</sup></span>
          <div>w<sub>t</sub> = γσ²(T − t) + (2/γ) ln(1 + γ/k)</div>
          <p>w=ask−bid，单位为美元/股；第一项随风险、波动与期限扩大，第二项来自订单到达对报价距离的弹性 k。该库存独立形式依赖模型设定，不是“真实 spread 不随库存变化”的经验定律。</p>
        </div>
        <p>
          现实 agent 可以分别移动 center、width 和 size。Tick 约束会把连续解映射成离散价位，queue value 可能使最优订单停在旧价，fees 和 adverse selection 又会改写到达函数；所以第 1 题明确先求连续解、再 outward rounding。<Cite n={2} /><Cite n={3} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="as-boundaries">
        <p className="section-kicker">22 · A–S 的不能外推</p>
        <h2>一个漂亮闭式解最危险的误用，是把未进入模型的 queue、latency、impact 与硬约束误认为已经被“最优化”。</h2>
        <div className="table-scroll" role="region" aria-label="A-S 模型与现实系统边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">A-S 原模型包含与未包含的机制</caption>
            <thead><tr><th scope="col">原模型显式包含</th><th scope="col">原模型不显式包含</th><th scope="col">扩展时必须重估</th></tr></thead>
            <tbody>
              <tr><td>随机 mid、库存、风险厌恶、有限期限</td><td>tick、FIFO queue、hidden liquidity</td><td>离散动作与 queue option value</td></tr>
              <tr><td>报价距离影响 Poisson 到达</td><td>自身 impact、竞争 agent、跨 venue</td><td>fill/cancel 竞争与战略互动</td></tr>
              <tr><td>终端财富效用</td><td>fees、资本、消息、系统故障、义务</td><td>真实可行集与运营尾部风险</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因而 A–S 最适合充当解释器和 baseline：它给出库存、波动、期限的方向性比较静态；生产策略或论文必须明确新增状态、执行模型和 falsifier。表现优于一个遗漏关键现实的 baseline，不等于识别了真实市场因果。<Cite n={2} /><Cite n={3} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="quote-center">
        <p className="section-kicker">阶段四 · 报价动作　|　23 · Quote Center</p>
        <h2>中心价回答“整体愿意在哪一带交易”，应把价值信号、库存偏离和 hedge basis 分开记账。</h2>
        <p>
          Center、width、两侧 size、price level、order type 与 keep/cancel 是同一个 decision vector 的不同坐标，不是先后独立求解的六套策略。若相关期货上行使 fair-value signal 为 +4 tick，而多头库存惩罚为 −3 tick，最终中心可只上移 1 tick；观察者若只看到中心，会错把风险修正后的净动作当作纯预测。Agent 日志应保留 pre-risk fair value、inventory adjustment、manual/obligation override 与最终 rounded center，才能审计模型与风险谁在主导。
        </p>
      </section>

      <section className="lesson-section" id="quote-width">
        <p className="section-kicker">24 · Quote Width</p>
        <h2>Spread 变宽可能来自波动、毒性、竞争减弱、费用或系统不确定性；它不是“做市商更贪婪”的单一观测。</h2>
        <p>
          Width 应覆盖未对冲价格风险、conditional markout、fees、操作成本和资本占用，同时受 tick 与竞争压缩。公共新闻前、feed divergence 或 cancel latency 尾部上升时，即使历史波动未变，过时报价损失也会增大；相反，竞争加剧可压窄显示 spread，却把竞争推到 queue speed。<Cite n={4} /><Cite n={17} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="quote-size">
        <p className="section-kicker">25 · Quote Size</p>
        <h2>Agent 可以在不改价格时用 size 管理尾部库存和信息泄露；只看 NBBO 会漏掉这条关键反应边际。</h2>
        <p>
          减少 bid size 能限制最坏买入库存，增加 ask size 能加快多头释放；iceberg、reserve 与多 venue 分拆又使 displayed size 小于总意图。实证若只用 spread 判断“流动性未变”，可能错过 depth 先行下降；但显示量下降也未必意味着总容量等比例消失，因为其他价位与 venue 可替代。<Cite n={11} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="join-improve-wait">
        <p className="section-kicker">26 · Join、Improve 或 Wait</p>
        <h2>Improve 一个 tick 买到价格优先，却牺牲价差；join 保留价格却进入队尾；wait 则用机会成本换取信息。</h2>
        <p>
          决策取决于 tick 相对经济 spread、queue ahead、预期到达、toxicity、fees 和 signal decay。大 tick 下，领先一小步可能必须支付完整 tick，竞争转向排队；小 tick 下，price improvement 更便宜但旧队列租金下降。没有 queue 与未成交机会成本，简单比较 displayed prices 无法判断三者。<Cite n={7} /><Cite n={17} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="fifo-fill">
        <p className="section-kicker">27 · FIFO Queue Fill</p>
        <h2>在严格、冻结的 FIFO 环境中，只有击中该价位的主动量和本单前方撤单会推进本单成交。</h2>
        <div className="equation-card">
          <span>FIFO 首次通过 · 教学式</span>
          <div>F = min{'{'}Q, [M + C<sub>ahead</sub> − A<sub>0</sub>]<sub>+</sub>{'}'}</div>
          <p>A<sub>0</sub> 是进入时前方量，M 是随后击中该价位的主动成交，C<sub>ahead</sub> 是明确发生在本单前方的撤单，Q 是本单数量，[x]<sub>+</sub>=max(x,0) 表示负的可成交余量按零处理。事件顺序、hidden/reserve、优先级重置或新增前方订单存在时，必须用状态机而非累计式。</p>
        </div>
        <p>
          第 3 题特意把成交—撤单—成交按顺序展开，训练“队列是存量、事件是流量”。真实回测若把所有 level cancellation 都算作 ahead，会系统性高估 fill；若只看成交量，又会低估前方撤单带来的推进。<Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="queue-value">
        <p className="section-kicker">28 · Queue Position Value</p>
        <h2>更靠前的 queue position 是一项可丧失的期权：修改、撤单或 price improvement 都可能放弃它。</h2>
        <p>
          该期权的价值来自未来有效订单流带来的 spread capture，成本来自更早暴露于坏流量和库存风险。若 signal 小幅变化，保留旧价和优先级可能优于追随新 fair value；若 stale loss 跳升，放弃 queue 才合理。Queue-value 模型因此连接 keep/cancel，而不是只预测等待时间。<Cite n={7} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="fill-cancel-race">
        <p className="section-kicker">29 · Fill / Cancel Competing Risk</p>
        <h2>Cancel request 发出后，订单处于“仍可能成交”的在途状态；本地删除订单会制造幽灵仓位。</h2>
        <p>
          正确状态机至少包含 pending-new、live、pending-cancel、partially-filled、cancelled、filled 与 rejected，并按 venue sequence 处理回报。若策略在 send cancel 时立即释放库存 headroom，旧单随后 fill，新单又已用掉同一余量，就会出现 double use。系统必须等权威 ack／fill 更新，或为在途最坏 fill 预留容量。<Cite n={28} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="keep-cancel">
        <p className="section-kicker">30 · Keep / Cancel Threshold</p>
        <h2>撤单阈值比较的是保留旧报价的条件价值与撤单后的机会，而不是“价格一动就撤”。</h2>
        <div className="equation-card">
          <span>旧报价保留阈值 · 两状态教学式</span>
          <div>EV<sub>keep</sub> = (1 − p)g − pL；　p* = g / (g + L)</div>
          <p>g 是报价仍有效时每股净收益，L 是已过时时每股条件损失，p 是当前过时概率；在 cancel payoff=0 且无延迟的冻结题设下，p&gt;p* 才选择撤单。真实 cancel latency、queue option 与 nonfill cost 会移动阈值。</p>
        </div>
        <p>
          高频撤单本身不能证明 spoofing。正常 agent 在 fair value、toxicity、库存、价格带或系统状态变化时会合法撤单。美国期货 CEA §4c(a)(5)(C) 的 spoofing 要件聚焦“下单时意图在执行前取消”，CFTC 明确不另加一项独立的 manipulative-intent 要求；证券市场则应分别检验 FINRA Rule 5210 的 bona-fide quotation 以及适用的欺骗或操纵要件，不能把两条法源合成一个全球“取消意图且误导”的统一测试。部分成交不是自动 safe harbor，善意修改／撤单也不能仅凭频率变成违法；判断仍要回到产品、法域、下单当时意图与完整事件链。<Cite n={37} /><Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="markout">
        <p className="section-kicker">阶段五 · 场所与系统　|　31 · Fill Economics 与 Markout</p>
        <h2>成交时拿到半个 spread，不等于这笔流动性供给赚钱；必须把已有库存与新增 fill 的后续价值分开。</h2>
        <div className="equation-card">
          <span>成交后经济 P&amp;L · 统一期限分解</span>
          <div>ΔW<sub>h</sub> = q<sub>t−</sub>(m<sub>t+h</sub> − m<sub>t</sub>) + Σz<sub>i</sub>(m<sub>t+h</sub> − p<sub>i</sub>) + Reb − Fee − Cost<sub>hedge</sub> − Cost<sub>ops</sub></div>
          <p>q<sub>t−</sub> 是成交前库存，z&gt;0 表示新增买入数量、z&lt;0 表示新增卖出数量，p 是成交价；Reb、Fee、Cost<sub>hedge</sub>、Cost<sub>ops</sub> 都是与前两项相同的总美元金额。第一项是旧库存路径，第二项才是本批 fill 的统一 h-horizon markout。</p>
        </div>
        <p>
          Markout 必须声明 side convention、future benchmark、horizon 和是否含费用。卖方在未来 mid 上升时损失，买方在未来 mid 下跌时损失；不同 h 可以分别测量短期 latency、信息吸收和较慢库存回转。把 1ms、10s 与收盘 markout 混在一起，会把不同机制误叫同一个 execution quality。<Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="hedge">
        <p className="section-kicker">32 · Hedge Action</p>
        <h2>Hedge 能释放一阶库存风险，却会把风险迁移到相关资产、另一 venue、另一时钟和另一保证金账户。</h2>
        <p>
          同券主动单可以最直接回补库存，但支付 spread 与 impact；期货、ETF、相关股票或期权 hedge 可能更快、更深，却留下 basis、tracking、gamma、funding 与 settlement risk。真正的 policy 要比较“保留库存的边际风险成本”和“立即 hedge 的全成本”，并把在途 hedge 放入 worst-case exposure。<Cite n={8} /><Cite n={13} />
        </p>
        <p>
          若完整 quote fill 会突破硬限额，hedge 必须先成交并得到权威确认，再激活该 quote；只有市场机制确实保证原子执行时，才能把两腿当成同一可行动作。普通跨 venue hedge 没有这种保证，因而要让未对冲 worst-case fill 自身满足限额，或先 resize/cancel quote。第 6 题用整数 hedge lot 训练“先确认 hedge、再开放容量”的离散边界，而不把它伪装成真实资本公式。
        </p>
      </section>

      <section className="lesson-section" id="venue-routing">
        <p className="section-kicker">33 · Venue Routing</p>
        <h2>最优 venue 不一定有最低 displayed price，因为真实动作还交换费用、成交概率、队列、延迟与信息泄露。</h2>
        <div className="equation-card">
          <span>买入全成本 · 单 venue 教学桥</span>
          <div>C<sub>v</sub> = p<sub>v</sub> + f<sub>v</sub> − r<sub>v</sub> + E(slippage + latency move + hedge + nonfill opportunity | v)</div>
          <p>C 是美元/股；乘数量才是总美元成本。p 是成交价，f/r 是 fee/rebate，其余条件成本必须使用相同方向与 horizon。多 venue 拆单还有相互 impact、成交相关性和共享流动性，不能逐 venue 独立最小化后直接相加。</p>
        </div>
        <p>
          Smart order routing 还受 order protection、locked/crossed rules、venue access 与场所技术影响。美国 2026 年对 Rules 611 和 610(e) 的动作截至本课截点仍是撤销提案，不是已经废止；策略研究必须保存当时有效规则，而不能用未来政策想象重写历史路由。<Cite n={15} /><Cite n={46} /><Cite n={65} />
        </p>
      </section>

      <section className="lesson-section" id="cross-venue-sync">
        <p className="section-kicker">34 · Cross-venue Synchronization</p>
        <h2>一处 fill 会改变共享库存，触发其他 venue 撤单、改价或 hedge；跨场所显示深度因此不是独立承诺之和。</h2>
        <p>
          若同一 maker 在 A、B 各挂 500 股，A 成交后其风险上限只允许总共再承接 0 股，B 的 500 会合法撤销。观察者在成交前看到 1,000，却无法在同一状态同时执行 1,000。正确统计需要稳定 participant identity、同步时间和 message path，既不能把显示总量当 actionable，也不能把同步撤单自动叫 spoofing。<Cite n={16} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="order-anticipation">
        <p className="section-kicker">35 · Order Anticipation 的法律与经验边界</p>
        <h2>从公开订单流推断后续压力、利用受托客户订单信息抢先交易、以及用虚假订单诱导他人，是三种不同机制。</h2>
        <p>
          经验研究可以发现某类高速主动流量领先非 HFT 买卖压力，但这种 lead–lag 本身不能证明获取了机密客户信息。Front-running 要结合客户 block order、knowledge 与职责等规则要件；spoofing 又必须先冻结产品与法源：美国期货规则检验下单时是否意图在执行前取消，证券报价与操纵分析则另查 bona-fide intent、欺骗和适用规则。研究报告应分别使用“公开信号预测”“被禁止的客户订单前置交易”“按相应法域要件识别的欺骗性订单”三套词汇。<Cite n={21} /><Cite n={36} /><Cite n={37} /><Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="multi-strategy">
        <p className="section-kicker">36 · Multi-strategy Agent</p>
        <h2>同一公司同一秒可以在客户／现货腿供给流动性，在 hedge／期货腿需求流动性；单腿标签不能代表整体角色。</h2>
        <p>
          被动 fill 增加库存后，agent 可能立即在另一场所 take；跨市场套利则一腿先成交、另一腿补齐。实证若把 maker/taker flag 当 firm identity，会把库存修复误写成策略反转。应以 agent×strategy×instrument×event 为最小单位，再在公司层聚合。<Cite n={13} /><Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="market-data">
        <p className="section-kicker">37 · Market Data Architecture</p>
        <h2>Consolidated feed、direct feed 与本地订单状态回答不同问题；任何一条都不是完整“真实市场”。</h2>
        <p>
          交易所专有 feed 往往提供更细、直接的本场所事件；consolidated data 汇总指定字段并经过另一条处理路径；本地状态记录自己的在途订单、风险和回报。Agent 可因接收路径、packet loss、sequence repair 和 normalization 不同而在同一墙钟时刻拥有不同 information set。<Cite n={58} /><Cite n={61} /><Cite n={62} /><Cite n={64} />
        </p>
        <p>
          Direct feed 不保证在每个事件上永远更快，也不揭示其他参与者意图。研究应保存 source、sequence、exchange timestamp、receive timestamp 与 clock quality，而不是把 SIP/direct 标签直接当 latency treatment。
        </p>
      </section>

      <section className="lesson-section" id="colocation">
        <p className="section-kicker">38 · Colocation</p>
        <h2>Colocation 缩短并标准化部分物理路径，却不能保证先到、成交、盈利或市场质量改善。</h2>
        <p>
          速度优势取决于整条 pipeline 和相对竞争：更短网络若配上更慢 signal/risk path 仍可能失败，拥塞与 jitter 也会改变尾部。Colocation 的因果研究可利用技术接入或升级事件，但参加者选择往往内生，需要前趋势、未受影响证券和 spillover 检验。<Cite n={14} /><Cite n={17} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="serial-priority">
        <p className="section-kicker">39 · Matching 与 Allocation Rules</p>
        <h2>撮合器总要决定谁先成交，但价格—时间、pro-rata、size-priority 与 hybrid 会把同一批订单分配成不同结果。</h2>
        <p>
          FIFO 在价格相同后按到达先后分配；pro-rata 按可见数量比例分配；size-priority 与 hybrid 又把数量、时间或参与者类别组合。Hidden/iceberg replenishment、订单修改是否丢失优先级、self-trade prevention 与 auction order 还会改变 eligible queue。因此第 27 节公式是冻结规则下的教学式，不是所有 venue 的通用 fill law。<Cite n={6} /><Cite n={11} /><Cite n={19} />
        </p>
        <p>
          连续撮合还会把几乎同时的信息反应串成先后；当 allocation 奖励先到者时，微小速度差可获得离散 queue 或套利收益。Budish、Cramton 与 Shim 以 frequent batch auction 构造反事实；Aquilina 等用同时包含 race winner 与 loser 的交易所消息识别竞速。它们支持“市场设计可制造边际速度租金”，但不支持所有低延迟投入都无社会价值，或批量竞价在每个市场都最优。<Cite n={17} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="maker-taker">
        <p className="section-kicker">40 · Maker / Taker Economics</p>
        <h2>Rebate 会进入报价和 routing 的联合均衡；看到 maker 收费为负，不能直接得出它每股盈利。</h2>
        <p>
          Maker 可能用更差显示价换取 rebate，taker 则比较 price、access fee 与成交概率。费用改革后，名义 spread、净 spread、queue 和 venue share 可同时变化；研究必须使用 fee-inclusive cost，并区分 fee 对谁收、何时收和是否随价格／订单类型改变。<Cite n={20} /><Cite n={44} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="tick-size">
        <p className="section-kicker">41 · Tick Size 与竞争维度</p>
        <h2>Tick 太大时价格竞争被截断，队列和速度价值上升；tick 太小时队列租金下降，但显示深度也可能碎片化。</h2>
        <p>
          因而 tick 改革不是单向“更细更好”。美国 2024 年通过的 Rule 612 与 Rule 610(c) 修订不等于截至 2026-08-30 已全面进入强制合规：SEC 在 2026 年把这些修订及相关定义的 compliance date 延至 2027 年 11 月第一个营业日；这一延期不覆盖要求交易所费用与返佣在成交时可以确定的 Rule 610(d)，后者已按自己的时钟适用。教材必须同时保存 adopted text、effective date、compliance date 与豁免范围。<Cite n={19} /><Cite n={44} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="pretrade-controls">
        <p className="section-kicker">阶段六 · 控制与反馈　|　42 · Pre-trade Risk Controls</p>
        <h2>Price、size、notional、credit/capital 与 regulatory checks 是进入市场前的硬门，不是交易后报表。</h2>
        <p>
          美国 Rule 15c3-5 要求具有或提供 exchange/ATS market access 的 broker-dealer 建立规定的财务和监管风险控制，并原则上由该 broker-dealer 直接、排他控制。它适用证券 market access，不是 CME E-mini 的规则，也不是所有 proprietary HFT 统一的算法设计标准。<Cite n={29} /><Cite n={30} />
        </p>
        <p>
          一个可靠 control 应聚合跨 order／port／client 的暴露并使用权威状态；只检查单笔 size，会允许大量小单共同突破上限。Reject 也要回写策略，否则 agent 可能持续重试并耗尽消息、连接或市场容量。<Cite n={31} /><Cite n={32} />
        </p>
        <p>
          美国证券市场的控制栈应按主体分层：firm testing/governance 先定义可发布策略，market-access broker-dealer 运行 Rule 15c3-5 controls，venue 再提供 MPID／port 工具，LULD 管证券级价格带，Reg SCI 管特定核心基础设施。它们可以在一次事件中相继作用，却不是彼此替代的同一“总开关”；欧盟 RTS 与中国程序化交易制度又是平行法域，不能接成一条全球规则链。<Cite n={29} /><Cite n={30} /><Cite n={33} /><Cite n={40} /><Cite n={42} />
        </p>
      </section>

      <section className="lesson-section" id="message-throttles">
        <p className="section-kicker">43 · Message、Throttle 与 Order-to-trade Controls</p>
        <h2>消息上限把连续最优控制变成离散资源分配：保留哪些 quote、撤哪一侧、是否还能完成原子 reprice。</h2>
        <p>
          限制可能按 session、port、symbol、滚动窗口或比率定义，add、cancel、replace、reject 的计数、权重、burst、reset 与 breach response 也依 venue／法域不同。余量只有两条时，四消息的双边 reprice 不可“完成一半”；系统必须有优先级和安全降级，而不是等 throttle 拒绝后才发现旧报价无法撤。欧盟 Article 48 与 RTS 7 处理场所容量和 order-to-trade controls，RTS 6 则处理 investment firm 的算法阈值与治理，二者不能合成一项全球统一限额。<Cite n={50} /><Cite n={51} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="kill-mass-cancel">
        <p className="section-kicker">44 · Kill、Mass Cancel 与 Disconnect</p>
        <h2>Kill path 的目标是停止新增风险并尽可能撤销存量订单；它不能追回已成交或保证所有在途请求瞬间消失。</h2>
        <div className="table-scroll" role="region" aria-label="公司与市场级停止机制边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Kill switch、cancel on disconnect、LULD 与 Stop Logic 的区别</caption>
            <thead><tr><th scope="col">机制</th><th scope="col">主要层级</th><th scope="col">主要动作</th><th scope="col">不能保证</th></tr></thead>
            <tbody>
              <tr><th scope="row">Firm kill / mass cancel</th><td>策略、session、firm</td><td>阻止新单、发送批量撤单</td><td>已成交回滚、所有在途单零风险</td></tr>
              <tr><th scope="row">Cancel on disconnect</th><td>venue session</td><td>连接断开后按场所规则撤单</td><td>跨 venue 或断开前 fill 一并处理</td></tr>
              <tr><th scope="row">LULD／market halt</th><td>证券市场</td><td>价格带、暂停或重开流程</td><td>替代 firm inventory／credit control</td></tr>
              <tr><th scope="row">CME Stop Logic</th><td>特定期货撮合保护</td><td>在触发条件下短暂停止并重新发现价格</td><td>等同美国股票 LULD 或公司 kill</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Cboe 工具可按 port、MPID 或风险组运行，CME Globex 又按 SenderComp、Execution Firm 或 Legal Clearing Entity 等层级控制；这些产品的覆盖、延迟和订单类型并不相同，不存在一个可泛称为“美国交易所统一 kill switch”的装置。LULD 则是 NMS 股票计划机制。2026 年批准的隔夜 LULD 扩展仍有未来实施时点，不能写成截至截点已全面运行。<Cite n={40} /><Cite n={41} /><Cite n={42} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="testing-governance">
        <p className="section-kicker">45 · Testing 与 Change Governance</p>
        <h2>算法风险往往来自“正确代码被错误部署”或“旧状态与新版本共存”，因此发布流程本身属于市场机制。</h2>
        <p>
          完整治理链包括独立评审、单元与情景测试、conformance、容量／极端值测试、有限 symbol/size pilot、版本与配置一致性、回滚、生产权限分离和变更后监控。测试环境不能完全复制真实排队和对手方，但至少应证明输入—输出边界、硬限额、断连、乱序与 kill path。<Cite n={28} /><Cite n={32} /><Cite n={51} />
        </p>
        <p>
          Reg SCI 的 2014 最终规则仍适用于 SCI entities；SEC 在 2025 年撤回的是此前的扩围提案，而不是撤销现行 Reg SCI。把两者混写会错误判断哪些主体承担法定义务。<Cite n={33} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="monitoring-reconciliation">
        <p className="section-kicker">46 · Monitoring、Clock 与 Reconciliation</p>
        <h2>单一 P&amp;L 告警发现得太晚；更稳健的控制逐层对账“想发送什么、实际发送什么、场所接受什么、最终成交什么”。</h2>
        <p>
          输入／输出 reconciliation 要比较 parent intents、child messages、acks、rejects、fills、positions 与 clearing records，并按 sequence 修复重复和缺口。告警要有 ownership、语义和自动阻断路径；97 封无人理解的异常邮件不等于风险被监控。时钟同步还要报告偏差与失败，而不是只在字段里保存更多小数位。<Cite n={28} /><Cite n={32} /><Cite n={63} />
        </p>
      </section>

      <section className="lesson-section" id="negative-feedback">
        <p className="section-kicker">47 · 正常状态的负反馈</p>
        <h2>成交使库存偏离，报价倾斜吸引反向流量，竞争者补入深度，库存和价格冲击因而可能回归。</h2>
        <p>
          路径是：客户 sell→maker 买入并变多头→下移 center、缩 bid 或增 ask→后续买方更容易从 maker 买走库存→q 回到 target。若其他 liquidity providers 仍有风险容量，撤出的 size 会被补入，临时 price impact 也吸引耐心订单。这是状态依赖的稳定器，不是每次成交必然均值回归。<Cite n={1} /><Cite n={2} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="positive-feedback">
        <p className="section-kicker">48 · 局部流动性正反馈</p>
        <h2>坏 markout、库存累积与撤单延迟使被动 EV 变负时，多个相似 agent 的撤退会让剩余报价更加容易被挑中。</h2>
        <p>
          第一轮毒性信号→部分 agent 撤单／缩量→depth 下降→同样订单造成更大 impact→未来 markout 更差→更多 agent 撤退。共同模型、共同 hedge 市场和共同价格带会提高响应相关性。第 10 题只冻结局部 impact law 展示方向；若没有融资、margin 与跨资产资产负债表证据，不能直接升级为 7.11 的系统性 liquidity spiral。<Cite n={16} /><Cite n={24} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-mirage">
        <p className="section-kicker">49 · Liquidity Mirage</p>
        <h2>Mirage 的核心是显示承诺共享同一风险容量、不能在同一状态同时兑现，而不是“所有撤单都虚假”。</h2>
        <p>
          跨 venue 复制报价能提高任何单一场所遇到自然订单的概率，却使 naïve consolidated depth 双重计算同一 maker capacity。一处 fill 后快速撤掉其他腿可能是合法库存控制；只有结合下单意图和行为证据，才讨论 manipulation。研究应同时报告 displayed、unique-provider 与 same-state actionable depth。<Cite n={16} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="cross-market-boundary">
        <p className="section-kicker">50 · 跨 Venue／资产反馈边界</p>
        <h2>一个 agent 的 hedge 和套利把压力送到相邻市场，但本节只解释局部传导，不把它直接写成全系统危机。</h2>
        <p>
          现货 fill 可触发期货 take，ETF 报价可因成分股深度下降而撤出，跨 venue stale quote 会被套利先击中。要证明系统级循环，还需观察多主体融资、保证金、共同去杠杆与价格回写；本节停在“状态—动作—局部订单—相邻价格”的 agent 接口。<Cite n={13} /><Cite n={26} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="flash-crash">
        <p className="section-kicker">51 · CASE · 2010 Flash Crash</p>
        <h2>Flash Crash 不是“HFT 单独造成崩盘”，而是已有压力、机械 volume-targeting、短库存周期和跨市场反馈在极短时间耦合。</h2>
        <p>
          CFTC／SEC staff report 记载：市场本已承压时，一个大型基本面卖方约在 14:32 启动约 75,000 张 E-mini、名义价值约 41 亿美元的卖出程序，按前一分钟成交量约 9% 调速，却不读取价格或时间，并在约 20 分钟内完成。HFT 与其他中介最初吸收库存，随后因短库存周期又出售；成交量上升反过来加快原算法。14:45:13–14:45:27，HFT 相互成交超过 27,000 张、约占该段成交 49%，净买入只有约 200 张，出现高成交量而低方向承接的 hot-potato 状态。CME Stop Logic 的短暂停顿为重新发现价格提供时间。<Cite n={27} /><Cite n={26} />
        </p>
        <p>
          这些证据支持多主体反馈和有限库存吸收，不支持“一张大单充分解释一切”“所有 HFT 同时退出”或“Sarao 单独导致事件”。CFTC 起诉与 DOJ 认罪材料支持其 spoofing 行为事实与法律处置，但单一被告材料不能替代全市场因果分解。<Cite n={66} /><Cite n={67} />
        </p>
      </section>

      <section className="lesson-section" id="knight">
        <p className="section-kicker">52 · CASE · Knight Capital 2012</p>
        <h2>Knight 展示的不是一个“做市模型算错”，而是部署、旧代码、父子单状态、限额、告警、对账和人工处置同时失效。</h2>
        <p>
          SEC order 记载，八台服务器有一台漏部署，新代码复用了旧 Power Peg flag，旧功能在该服务器被激活；系统不知道 parent order 已完成，也缺少有效 input-output reconciliation 与充分聚合的风险阈值。约 45 分钟内，212 个 parent orders 触发数百万 child orders，并获得超过 400 万次 executions，涉及 154 只股票、超过 3.97 亿股，形成约 35 亿美元意外多头与 31.5 亿美元意外空头，损失超过 4.6 亿美元。<Cite n={28} />
        </p>
        <p>
          该命令是行政和解，应写作“SEC order 记载／认定”，不能扩写成 AI 失控或交易所故障。机制教训是：策略 objective 正确也不够；版本一致、生产权限、实时 position、聚合限额、语义化告警、独立 kill 与现场处置共同定义可安全运行的 agent。
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">阶段七 · 研究、法域与实验　|　53 · Event-level 识别协议</p>
        <h2>先选择观测单位，再谈“速度、撤单或做市改善市场质量”；message、order spell、quote episode 和 agent state 不是同一数据行。</h2>
        <div className="research-card">
          <span>EMPIRICAL DESIGN · OBSERVATION BEFORE REGRESSION</span>
          <h3>局部可证伪问题：一项事前确定的 latency／tick／fee／risk-control 变化，是否改变受影响 agent 的 keep/cancel、queue、fill markout 与同状态 actionable depth？</h3>
          <p>Message 级数据研究竞速和拒单；order spell 从 add 到 fill/cancel/expire，适合 competing-risk；quote episode 对齐固定 event time，适合 markout；agent×symbol×time 才能连接 inventory 与 policy；venue×symbol×event 才能研究 routing 与重复深度。不得把不同单位塞入一个不透明指数。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>冻结时钟与知识集：</b>exchange、receive、decision、send、ack 与 fill 分列；未来 book 或日终标签不得进入实时信号。</li>
          <li><b>保留失败尝试：</b>只看成功订单会看不到 race losers、rejects 与 cancel-too-late；数据缺失必须作为识别边界。</li>
          <li><b>定义处理：</b>colocation、gateway、tick、fee 或规则变更需有明确采用时点与未受影响对照，不能用“更快 firm”这一内生标签。</li>
          <li><b>处理选择偏误：</b>fill 与 cancel 是 competing risks；markout 比较需匹配当时仍 live 的报价并统一 side/horizon。</li>
          <li><b>观察 agent state：</b>inventory、live orders、hedge、risk headroom 与 message budget 缺失时，只能识别 reduced form，不能声称恢复 objective。</li>
          <li><b>检验外溢：</b>跨 venue 与相关资产响应可能污染对照；份额迁移不等于总深度恢复。</li>
          <li><b>预注册符号与 falsifier：</b>例如 latency 降低应先改变 cancel-too-late，再影响 markout；若第一阶段不存在，市场质量结果不应强行归因。</li>
        </ol>
        <p>
          SEC MIDAS 含交易所专有行情中的订单、修改、撤单和成交，却没有完整 participant intent 与所有失败入站消息；CAT 记录监管订单生命周期，但不是公共匿名 LOB 数据集；ITCH 适合按 sequence 重建单 venue order book，却不含交易者身份或未进入 feed 的请求。数据名称不能替代 capability audit。<Cite n={58} /><Cite n={59} /><Cite n={60} /><Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="jurisdiction-status">
        <p className="section-kicker">54 · 法域与当前状态 · 截至 2026-08-30</p>
        <h2>同一个算法动作在美国、欧盟和中国可能落入不同主体、产品、定义、报告和控制边界；技术相似不等于法律相同。</h2>
        <div className="table-scroll" role="region" aria-label="美国欧盟中国算法与高频交易规则边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">截至 2026 年 8 月 30 日的算法和高频交易法域边界</caption>
            <thead><tr><th scope="col">法域</th><th scope="col">核心边界</th><th scope="col">截至截点状态护栏</th></tr></thead>
            <tbody>
              <tr><th scope="row">美国证券</th><td>Rule 15c3-5 约束 market access broker-dealer；Reg SCI 约束 SCI entities；venue MM/DMM 另有规则</td><td>无统一 HFT 法定身份；Reg SCI 扩围提案已撤回但 2014 规则仍在；Rules 611/610(e) 只是拟撤销</td></tr>
              <tr><th scope="row">美国期货</th><td>CFTC/DCM/FCM 与 CME 控制属于另一产品和法源链</td><td>Stop Logic、Globex Kill Switch 与股票 LULD/15c3-5 不可互换</td></tr>
              <tr><th scope="row">欧盟</th><td>MiFID II Articles 4/17/48 与 RTS 6/7/8 分别处理定义、firm systems、venue systems 和 market-making arrangements</td><td>Directive 需转置；delegated regulations 直接适用；supervisory briefing 不是新法律</td></tr>
              <tr><th scope="row">中国证券</th><td>证监会 2024 规定与交易所 2025 实施细则处理报告、监测、系统和高频差异化管理</td><td>交易所 300 次/秒或 20,000 次/日等标准是本地监管识别口径，不是全球经济定义</td></tr>
              <tr><th scope="row">中国期货</th><td>期货市场程序化交易有独立规定、交易所与产品边界</td><td>不能把证券账户阈值直接套入期货策略</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国证券行并列的是不同触发主体和不同法律状态：Rule 15c3-5 是现行 market-access broker-dealer rule；2014 Reg SCI 仍在而 2023 扩围提案已于 2025 年撤回；2024 tick/access-fee amendments 已采用但部分合规延期；Rules 611/610(e) 截至截点仍只是拟撤销；LULD 与 venue kill tools 又属于不同层级。<Cite n={29} /><Cite n={30} /><Cite n={33} /><Cite n={34} /><Cite n={40} /><Cite n={42} /><Cite n={44} /><Cite n={45} /><Cite n={46} />
        </p>
        <p>
          美国 2024 年扩大 dealer 定义的规则已被联邦地区法院整体 vacate，因此不能把该被撤销规则当作截至截点仍然要求所有行为型 liquidity providers 注册的现行门槛。当前实务判断仍需从具体活动、法定 dealer 定义、注册例外和最新诉讼／规则状态开始。<Cite n={47} />
        </p>
        <p>
          欧盟 Article 17 与 RTS 6 要求 investment firm 的算法系统具备容量、阈值、测试、业务连续性、监控和记录；Article 48 与 RTS 7 约束 venue resiliency、order-to-trade、tick、DEA 与 colocation；RTS 8 则识别何时须建立 market-making agreement，并规定协议中的报价时段，同时保留 exceptional circumstances。它不要求每个 HFT 或 LP 在所有极端状态无限报价。<Cite n={48} /><Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={69} />
        </p>
        <p>
          中国《证券市场程序化交易管理规定（试行）》自 2024-10-08 施行，证券交易所实施细则自 2025-07-07 施行；证券市场以单一账户每秒申报加撤单最高达到 300 笔以上，或单日最高达到 20,000 笔以上等标准识别高频交易。这是额外报告、差异化收费与重点监控的分类入口，不是禁止线或操纵认定线。期货市场另有自 2025-10-09 施行的程序化交易规定，具体高频标准不能从证券阈值移植。任何研究都要保存账户、场所、产品、访问日和规则版本。<Cite n={54} /><Cite n={55} /><Cite n={56} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">55 · 互动实验</p>
        <h2>十题沿同一条链推进：先算信念和报价，再处理 queue、cancel、routing、硬约束与局部反馈。</h2>
        <p>
          题目不是策略建议，也不随机生成参数。每题冻结单位、事件顺序、取整、可行集与忽略项；只有在这些条件下存在唯一答案。若你答对数字却不能说明“哪项假设一变答案就失效”，仍未掌握机制。
        </p>
        <p className="print-only">打印／PDF 说明：本节十题互动实验只在网页中运行；第 56 节提供同一数据源的十道静态变式及完整答案，第 57 节提供十二道可展开的理解检查，打印版已强制显示全部答案。</p>
        <MarketMakerHftLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">56 · 主动练习 · 同数据静态变式</p>
        <h2>先离线写出状态、公式、事件顺序和边界，再展开答案；静态题与互动题共用同一冻结数据源。</h2>
        <div className="practice-grid">
          {marketMakerHftScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">57 · 理解检查</p>
        <h2>如果不能用自然语言重建以下边界，就不要急着把消息数据变成“流动性好坏”的单一因子。</h2>
        <details className="understanding-check"><summary>01 · 为什么 HFT、market maker、dealer 与 DMM 不能互换？</summary><p>它们分别可能描述技术／行为、经济功能、法律角色和场所指定身份；同一主体可跨列，一列也不推出其他列。</p></details>
        <details className="understanding-check"><summary>02 · 为什么 send cancel 后仍要为最坏 fill 预留风险？</summary><p>Cancel 是在途请求，撮合器可能先处理主动对手单；只有权威 cancel ack 或互斥 fill 状态才能释放订单风险。</p></details>
        <details className="understanding-check"><summary>03 · Fill probability 高为什么可能是坏消息？</summary><p>旧价最容易在价值刚变化时被更快对手方执行；高 fill 可与更差 conditional markout 同时出现。</p></details>
        <details className="understanding-check"><summary>04 · A–S 的 reservation price 下移是在预测下跌吗？</summary><p>不一定。它可只是多头库存的风险调整；必须与 pre-risk fair-value signal 分开记录。</p></details>
        <details className="understanding-check"><summary>05 · Queue position 为什么同时是资产和风险？</summary><p>靠前提高有效流量成交概率和价差收益，也让旧报价最先暴露于毒性订单。</p></details>
        <details className="understanding-check"><summary>06 · 为什么 rebate 不能单独判断被动订单盈利？</summary><p>还要合并成交价、future markout、fee、hedge、inventory 与 impact；rebate 只是其中一条现金流。</p></details>
        <details className="understanding-check"><summary>07 · Liquidity mirage 是否等于 spoofing？</summary><p>否。共享风险容量使跨 venue 报价不能同时兑现可以是合法控制。是否违法必须先冻结产品与法源：美国期货 spoofing 聚焦下单时是否意图在执行前取消；证券市场则另查 bona-fide quotation 以及适用的欺骗或操纵要件。</p></details>
        <details className="understanding-check"><summary>08 · 为什么低延迟研究需要失败消息？</summary><p>只记录成功进入撮合器的订单会看不见 race losers、过迟 cancel 和 rejects，从而错误选择样本。</p></details>
        <details className="understanding-check"><summary>09 · Flash Crash 为什么不能归因于“HFT 退出”一句话？</summary><p>官方与审计轨迹显示已有压力、机械卖出、短库存周期、hot-potato、跨市场和撮合保护共同作用，HFT 行为也并不完全同质。</p></details>
        <details className="understanding-check"><summary>10 · Knight 的核心为何是 control stack，而非价格模型？</summary><p>部署不一致、旧代码、父子单状态、对账、聚合限额、告警与人工处置共同失效，说明运行系统本身决定可行策略。</p></details>
        <details className="understanding-check"><summary>11 · Rule 15c3-5、Reg SCI 与 venue kill tool 有何不同？</summary><p>它们分别是特定主体的 market-access 风控规则、SCI entities 的系统规则和场所产品工具；适用主体与法律效力不同。</p></details>
        <details className="understanding-check"><summary>12 · 怎样把本节结果接到 7.11，而不过度外推？</summary><p>先证明局部共同撤单与跨资产 hedge flow，再补融资、margin、资产负债表和价格回写证据；否则只称局部流动性反馈。</p></details>
      </section>

      <section className="lesson-section" id="interfaces-map">
        <p className="section-kicker">58 · 课程接口</p>
        <h2>本节输出的是一套事件级 agent policy；上下游课程分别提供经济动机、机构约束、策略对手和系统反馈。</h2>
        <div className="table-scroll" role="region" aria-label="2.08 与课程其他单元接口，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">市场做市与高频 agent 的课程接口</caption>
            <thead><tr><th scope="col">接口</th><th scope="col">本节读取</th><th scope="col">本节输出</th></tr></thead>
            <tbody>
              <tr><th scope="row">1.12–1.14</th><td>immediacy、inventory、competition</td><td>event-state→quote/cancel/hedge policy</td></tr>
              <tr><th scope="row">2.07</th><td>legal entity、capital/funding/risk headroom</td><td>实时可行集与动作消耗</td></tr>
              <tr><th scope="row">2.09</th><td>相对价值 signal 与 hedge pair</td><td>leg risk、routing、queue 与 execution constraint</td></tr>
              <tr><th scope="row">1.24／2.14</th><td>Greeks 与 volatility exposure</td><td>hedge latency、cost 与报价状态</td></tr>
              <tr><th scope="row">7.11–7.14</th><td>融资、共同约束与网络</td><td>局部撤单、depth、impact 与跨市场订单</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="closing-diagnostic">
        <p className="section-kicker">59 · 最终诊断</p>
        <h2>面对一张陌生报价，不要先问“它是不是 HFT”；先重建谁在什么状态下对什么事件作出了哪项仍可能失败的承诺。</h2>
        <p className="closing-thesis">
          冻结 actor、法律／venue 身份、strategy、instrument、account 和 knowledge clock；把公共 LOB／成交／相关资产与私有 live orders、inventory、queue estimate、hedge、risk headroom、message budget、version 和 connection health 放进同一事件状态。先用硬限额筛可行集，再把短期 fair value、fill probability、conditional markout、queue option、fee-inclusive routing 和 hedge cost 分别映射到 center、width、size、keep/cancel、take/route 与 kill。请求发出后保留 pending 状态，等待权威 ack、fill 或 reject 更新仓位；用统一 side/horizon 的 markout 和输入—输出对账验证结果。最后观察其他 agent 是否共享信号、容量和 hedge 通道：余量充足时，库存 skew 与补单形成负反馈；毒性、延迟和共同约束变紧时，撤单—depth—impact 可形成局部正反馈。只有再获得融资、保证金和网络证据，才把局部机制接入系统性螺旋。这才是 Market Maker／HFT 作为 agent 的完整含义。
        </p>
      </section>
    </>
  );
}

export const lesson208: LessonRecord = {
  slug: '2-08',
  id: '2.08',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Market Maker / HFT 作为 Agent：事件、队列、延迟与受约束决策',
  subtitle: '从实时状态与订单生命周期出发，解释电子做市商怎样把信念、库存、queue、latency、fees、风险与系统健康转化为报价、撤单、对冲、路由及流动性反馈',
  readingTime: '核心阅读约 120–135 分钟；互动实验快速 25–30／含复盘 45–55，主动练习核对 25–30／完整书写 45–60，理解检查快速 10–12／完整复述 18–22，课程接口 4 分钟；快速路径约 184–211 分钟，完整学习约 232–276 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: '1.12–1.14；按需回看 1.03–1.05、1.08–1.10、1.18、2.07 与 T03、T05、T08',
  updatedAt: '2026-08-30',
  revision: '2.08-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.08-r4',
      summary: '独立复核 12 张公式卡、10 道互动题与 10 道静态变式、69 条来源与 197 个邻接引文，以及截至 2026-08-30 的美国、欧盟和中国法规状态；P0–P3 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.08-r4',
      summary: '独立复核零基础因果链、60 节顺序、公式白话、主动练习、无脚本与无障碍、打印回归及 5／6／9／10 分层阅读路径；P0–P3 均为 0。',
    },
  ],
  previous: { slug: '2-07', label: '2.07 Broker–Dealer / Securities Firms' },
  next: { slug: '2-09', label: '2.09 Statistical Arbitrage / Market Neutral' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整事件闭环' },
    { id: 'scope-prerequisite', label: '范围、先修与术语桥' },
    { id: 'functional-legal-technical', label: '三条分类轴' },
    { id: 'traditional-electronic', label: '传统与电子做市' },
    { id: 'dmm', label: 'Designated Market Maker' },
    { id: 'hft-strategy-taxonomy', label: 'HFT 策略分类' },
    { id: 'public-private-state', label: '公共信息与私有状态' },
    { id: 'fair-value-belief', label: '短期公允价值信念' },
    { id: 'inventory-state', label: 'Inventory State' },
    { id: 'queue-state', label: 'Queue State' },
    { id: 'latency-vector', label: 'Latency Vector' },
    { id: 'fill-toxicity', label: 'Fill Probability 与 Toxicity' },
    { id: 'venue-system-state', label: 'Venue Economics 与 System Health' },
    { id: 'feasible-action-set', label: 'Action Feasibility' },
    { id: 'objective-function', label: 'Objective Function' },
    { id: 'ho-stoll', label: 'Ho–Stoll' },
    { id: 'glosten-milgrom', label: 'Glosten–Milgrom' },
    { id: 'kyle', label: 'Kyle' },
    { id: 'as-environment', label: 'A–S 的可解环境' },
    { id: 'as-reservation-price', label: 'A–S Reservation Price' },
    { id: 'as-spread', label: 'A–S Spread' },
    { id: 'as-boundaries', label: 'A–S 的不能外推' },
    { id: 'quote-center', label: 'Quote Center' },
    { id: 'quote-width', label: 'Quote Width' },
    { id: 'quote-size', label: 'Quote Size' },
    { id: 'join-improve-wait', label: 'Join、Improve 或 Wait' },
    { id: 'fifo-fill', label: 'FIFO Queue Fill' },
    { id: 'queue-value', label: 'Queue Position Value' },
    { id: 'fill-cancel-race', label: 'Fill / Cancel Competing Risk' },
    { id: 'keep-cancel', label: 'Keep / Cancel Threshold' },
    { id: 'markout', label: 'Fill Economics 与 Markout' },
    { id: 'hedge', label: 'Hedge Action' },
    { id: 'venue-routing', label: 'Venue Routing' },
    { id: 'cross-venue-sync', label: 'Cross-venue Synchronization' },
    { id: 'order-anticipation', label: 'Order Anticipation 边界' },
    { id: 'multi-strategy', label: 'Multi-strategy Agent' },
    { id: 'market-data', label: 'Market Data Architecture' },
    { id: 'colocation', label: 'Colocation' },
    { id: 'serial-priority', label: 'Matching 与 Allocation Rules' },
    { id: 'maker-taker', label: 'Maker / Taker Economics' },
    { id: 'tick-size', label: 'Tick Size 与竞争维度' },
    { id: 'pretrade-controls', label: 'Pre-trade Risk Controls' },
    { id: 'message-throttles', label: 'Message 与 Throttle' },
    { id: 'kill-mass-cancel', label: 'Kill、Mass Cancel 与 Disconnect' },
    { id: 'testing-governance', label: 'Testing 与 Change Governance' },
    { id: 'monitoring-reconciliation', label: 'Monitoring 与 Reconciliation' },
    { id: 'negative-feedback', label: '正常状态的负反馈' },
    { id: 'positive-feedback', label: '局部流动性正反馈' },
    { id: 'liquidity-mirage', label: 'Liquidity Mirage' },
    { id: 'cross-market-boundary', label: '跨 Venue／资产反馈边界' },
    { id: 'flash-crash', label: 'CASE：2010 Flash Crash' },
    { id: 'knight', label: 'CASE：Knight Capital 2012' },
    { id: 'research-protocol', label: 'Event-level 识别协议' },
    { id: 'jurisdiction-status', label: '法域与当前状态' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'interfaces-map', label: '课程接口' },
    { id: 'closing-diagnostic', label: '最终诊断' },
  ],
  Content: Lesson208Content,
  references: [
    { id: 1, authors: 'Thomas Ho and Hans R. Stoll', year: '1981', accessedAt: '2026-08-30', title: 'Optimal Dealer Pricing under Transactions and Return Uncertainty', publication: 'Journal of Financial Economics 9(1), 47–73', url: 'https://doi.org/10.1016/0304-405X(81)90020-9', use: '支持随机订单到达、库存风险与动态 dealer pricing；不包含现代 queue、latency 或跨 venue 系统。' },
    { id: 2, authors: 'Marco Avellaneda and Sasha Stoikov', year: '2008', accessedAt: '2026-08-30', title: 'High-frequency Trading in a Limit Order Book', publication: 'Quantitative Finance 8(3), 217–224', url: 'https://doi.org/10.1080/14697680701381228', use: '支持 Brownian/CARA/Poisson 环境、reservation price 与 spread 公式；不是生产策略或经验定律。' },
    { id: 3, authors: 'Olivier Guéant, Charles-Albert Lehalle and Joaquin Fernandez-Tapia', year: '2013', accessedAt: '2026-08-30', title: 'Dealing with the Inventory Risk: A Solution to the Market Making Problem', publication: 'Mathematics and Financial Economics 7, 477–507', url: 'https://doi.org/10.1007/s11579-012-0087-0', use: '支持库存约束下的 HJB 与近似扩展；仍不自动包含真实 queue、latency 和跨 venue 竞争。' },
    { id: 4, authors: 'Lawrence R. Glosten and Paul R. Milgrom', year: '1985', accessedAt: '2026-08-30', title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders', publication: 'Journal of Financial Economics 14(1), 71–100', url: 'https://doi.org/10.1016/0304-405X(85)90044-3', use: '支持交易方向的 Bayes 更新与信息价差；不处理库存、queue、fees 或现代 HFT 控制。' },
    { id: 5, authors: 'Albert S. Kyle', year: '1985', accessedAt: '2026-08-30', title: 'Continuous Auctions and Insider Trading', publication: 'Econometrica 53(6), 1315–1335', url: 'https://doi.org/10.2307/1913210', use: '支持线性订单流 price impact 与逆深度 λ；不是挂单控制律，也不表示所有流量知情。' },
    { id: 6, authors: 'Rama Cont, Sasha Stoikov and Rishi Talreja', year: '2010', accessedAt: '2026-08-30', title: 'A Stochastic Model for Order Book Dynamics', publication: 'Operations Research 58(3), 549–563', url: 'https://doi.org/10.1287/opre.1090.0780', use: '支持 LOB birth–death、首次通过和等待时间机制；不包含战略 agent、hidden queue 与完整 latency。' },
    { id: 7, authors: 'Ciamac C. Moallemi and Kai Yuan', year: '2017', accessedAt: '2026-08-30', title: 'A Model for Queue Position Valuation in a Limit Order Book', publication: 'Columbia Business School Research Paper No. 17-70', url: 'https://doi.org/10.2139/ssrn.2996221', use: '支持 FIFO queue position 的价差收益、不利选择与动态期权价值；模型结论依赖规则和到达假设。' },
    { id: 8, authors: 'Álvaro Cartea, Sebastian Jaimungal and Jason Ricci', year: '2014', accessedAt: '2026-08-30', title: 'Buy Low, Sell High: A High Frequency Trading Perspective', publication: 'SIAM Journal on Financial Mathematics 5(1), 415–444', url: 'https://doi.org/10.1137/130911196', use: '支持短期信号、订单流与库存的联合控制；不定义法律意义 HFT。' },
    { id: 9, authors: 'Maureen O’Hara', year: '1995', accessedAt: '2026-08-30', title: 'Market Microstructure Theory', publication: 'Blackwell', url: 'https://www.wiley.com/en-us/Market+Microstructure+Theory-p-9781557864437', use: '提供 dealer、信息、spread 与微观结构理论基础；不支持当前法规状态。' },
    { id: 10, authors: 'Joel Hasbrouck', year: '2007', accessedAt: '2026-08-30', title: 'Empirical Market Microstructure: The Institutions, Economics, and Econometrics of Securities Trading', publication: 'Oxford University Press', url: 'https://global.oup.com/academic/product/empirical-market-microstructure-9780195301649', use: '支持订单流、价格发现和事件数据研究语言；不替代具体交易规则与数据规范。' },
    { id: 11, authors: 'Thierry Foucault, Marco Pagano and Ailsa Röell', year: '2013', accessedAt: '2026-08-30', title: 'Market Liquidity: Theory, Evidence, and Policy', publication: 'Oxford University Press', url: 'https://global.oup.com/academic/product/market-liquidity-9780199936243', use: '支持流动性供应、深度、制度与政策的连接；不提供当前法域结论。' },
    { id: 12, authors: 'Álvaro Cartea, Sebastian Jaimungal and José Penalva', year: '2015', accessedAt: '2026-08-30', title: 'Algorithmic and High-Frequency Trading', publication: 'Cambridge University Press', url: 'https://doi.org/10.1017/CBO9781316018327', use: '提供算法执行与控制的统一框架；不是任何公司的真实 objective 或策略披露。' },
    { id: 13, authors: 'Albert J. Menkveld', year: '2013', accessedAt: '2026-08-30', title: 'High Frequency Trading and the New-Market Makers', publication: 'Journal of Financial Markets 16(4), 712–740', url: 'https://doi.org/10.1016/j.finmar.2013.06.006', use: '支持可识别 HFT 的被动做市、跨市场库存与收益结构；单一公司和事件不能代表全部 HFT。' },
    { id: 14, authors: 'Joel Hasbrouck and Gideon Saar', year: '2013', accessedAt: '2026-08-30', title: 'Low-Latency Trading', publication: 'Journal of Financial Markets 16(4), 646–679', url: 'https://doi.org/10.1016/j.finmar.2013.05.003', use: '支持 linked-message 低延迟代理与市场质量关系；代理变量不是法律身份，也不证明普遍因果。' },
    { id: 15, authors: 'Thierry Foucault and Albert J. Menkveld', year: '2008', accessedAt: '2026-08-30', title: 'Competition for Order Flow and Smart Order Routing Systems', publication: 'Journal of Finance 63(1), 119–158', url: 'https://doi.org/10.1111/j.1540-6261.2008.01312.x', use: '支持特定市场进入背景下 fragmentation、routing 与合并深度；不能泛化所有市场。' },
    { id: 16, authors: 'Vincent van Kervel', year: '2015', accessedAt: '2026-08-30', title: 'Competition for Order Flow with Fast and Slow Traders', publication: 'Review of Financial Studies 28(7), 2094–2127', url: 'https://doi.org/10.1093/rfs/hhv023', use: '支持一处成交后跨 venue 快速撤单与重复流动性；不表示所有显示深度虚假。' },
    { id: 17, authors: 'Eric Budish, Peter Cramton and John Shim', year: '2015', accessedAt: '2026-08-30', title: 'The High-Frequency Trading Arms Race: Frequent Batch Auctions as a Market Design Response', publication: 'Quarterly Journal of Economics 130(4), 1547–1621', url: 'https://doi.org/10.1093/qje/qjv027', use: '支持连续 serial priority 的边际速度竞赛与 batch-auction 反事实；不证明所有低延迟投入无社会价值。' },
    { id: 18, authors: 'Matteo Aquilina, Eric Budish and Peter O’Neill', year: '2022', accessedAt: '2026-08-30', title: 'Quantifying the High-Frequency Trading “Arms Race”', publication: 'Quarterly Journal of Economics 137(1), 493–564', url: 'https://doi.org/10.1093/qje/qjab032', use: '支持用含成功与失败消息的完整交易所数据识别 race；英国样本和 race 定义不可无条件外推。' },
    { id: 19, authors: 'Chen Yao and Mao Ye', year: '2018', accessedAt: '2026-08-30', title: 'Why Trading Speed Matters: A Tale of Queue Rationing under Price Controls', publication: 'Review of Financial Studies 31(6), 2157–2183', url: 'https://doi.org/10.1093/rfs/hhy002', use: '支持相对 tick、time priority 与 queue rents；不以消息成交比定义全部 HFT。' },
    { id: 20, authors: 'Katya Malinova and Andreas Park', year: '2015', accessedAt: '2026-08-30', title: 'Subsidizing Liquidity: The Impact of Make/Take Fees on Market Quality', publication: 'Journal of Finance 70(2), 509–536', url: 'https://doi.org/10.1111/jofi.12230', use: '支持 fee 变化、报价调整和 fee-inclusive cost；特定市场事件不提供普遍福利结论。' },
    { id: 21, authors: 'Nicholas Hirschey', year: '2021', accessedAt: '2026-08-30', title: 'Do High-Frequency Traders Anticipate Buying and Selling Pressure?', publication: 'Management Science 67(6), 3321–3345', url: 'https://doi.org/10.1287/mnsc.2020.3608', use: '支持部分 HFT 主动流领先非 HFT 流量的经验模式；不证明非法 front-running 或所有 HFT 同质。' },
    { id: 22, authors: 'Jonathan Brogaard, Terrence Hendershott and Ryan Riordan', year: '2014', accessedAt: '2026-08-30', title: 'High-Frequency Trading and Price Discovery', publication: 'Review of Financial Studies 27(8), 2267–2306', url: 'https://doi.org/10.1093/rfs/hhu032', use: '支持 HFT liquidity demand/supply、价格发现与不利选择的异质作用；依赖样本分类与时期。' },
    { id: 23, authors: 'Matthew Baron, Jonathan Brogaard, Björn Hagströmer and Andrei Kirilenko', year: '2019', accessedAt: '2026-08-30', title: 'Risk and Return in High-Frequency Trading', publication: 'Journal of Financial and Quantitative Analysis 54(3), 993–1024', url: 'https://doi.org/10.1017/S0022109018001096', use: '支持 E-mini HFT 的速度、流动性角色、收益集中与风险差异；不提供统一法律定义。' },
    { id: 24, authors: 'Amber Anand and Kumar Venkataraman', year: '2016', accessedAt: '2026-08-30', title: 'Market Conditions, Fragility, and the Economics of Market Making', publication: 'Journal of Financial Economics 121(2), 327–349', url: 'https://doi.org/10.1016/j.jfineco.2016.03.006', use: '支持压力状态下流动性供应者缩量与指定做市制度的状态依赖作用；特定市场不可普遍外推。' },
    { id: 25, authors: 'Mario Bellia, Kim Christensen, Aleksey Kolokolov, Loriana Pelizzon and Roberto Renò', year: '2025', accessedAt: '2026-08-30', title: 'Do Designated Market Makers Provide Liquidity during Downward Extreme Price Movements?', publication: 'Journal of Financial Markets 76, Article 100988', url: 'https://doi.org/10.1016/j.finmar.2025.100988', use: '支持 DMM 在特质性与系统性下跌中可能采取不同流动性角色；特定制度与极端样本不改写法定义务。' },
    { id: 26, authors: 'Andrei Kirilenko, Albert S. Kyle, Mehrdad Samadi and Tugkan Tuzun', year: '2017', accessedAt: '2026-08-30', title: 'The Flash Crash: High-Frequency Trading in an Electronic Market', publication: 'Journal of Finance 72(3), 967–998', url: 'https://doi.org/10.1111/jofi.12498', use: '支持 Flash Crash 审计轨迹、交易者分类与短库存周期机制；不支持单一主体归因。' },
    { id: 27, authors: 'CFTC and SEC Staffs', year: '2010', accessedAt: '2026-08-30', title: 'Findings Regarding the Market Events of May 6, 2010', publication: 'Joint staff report, 30 September 2010', url: 'https://www.cftc.gov/sites/default/files/idc/groups/public/%40otherif/documents/ifdocs/staff-findings050610.pdf', use: '支持 Flash Crash 的事件序列、75,000 张程序、9% volume targeting、hot-potato 与 Stop Logic；不是唯一责任裁决。' },
    { id: 28, authors: 'U.S. Securities and Exchange Commission', year: '2013', accessedAt: '2026-08-30', title: 'In the Matter of Knight Capital Americas LLC', publication: 'Exchange Act Release No. 34-70694; administrative order', url: 'https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf', use: '支持 Knight 的部署、旧代码、订单状态、对账、限额、成交与损失事实；行政和解不支持 AI 或交易所故障归因。' },
    { id: 29, authors: 'U.S. Securities and Exchange Commission', year: '2010', accessedAt: '2026-08-30', title: 'Risk Management Controls for Brokers or Dealers with Market Access', publication: 'Exchange Act Release No. 34-63241; final rule', url: 'https://www.sec.gov/files/rules/final/2010/34-63241.pdf', use: '支持 Rule 15c3-5 的采用目的、聚合阈值、错误订单和监管控制；不规定统一 kill-switch 产品。' },
    { id: 30, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.15c3-5 — Risk Management Controls for Brokers or Dealers with Market Access', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-5', use: '核对现行 market-access broker-dealer 控制、direct and exclusive control 与 review；不适用于所有产品或主体。' },
    { id: 31, authors: 'SEC Staff', year: '2020', accessedAt: '2026-08-30', title: 'Staff Report on Algorithmic Trading in U.S. Capital Markets', publication: 'U.S. Securities and Exchange Commission staff report', url: 'https://www.sec.gov/files/Algo_Trading_Report_2020.pdf', use: '支持算法交易在正常期的市场质量作用与压力／运营风险并存；staff report 不是 Commission 法律裁决。' },
    { id: 32, authors: 'FINRA', year: '2015', accessedAt: '2026-08-30', title: 'Equity Trading Initiatives: Supervision and Control Practices for Algorithmic Trading Strategies', publication: 'Regulatory Notice 15-09', url: 'https://www.finra.org/rules-guidance/notices/15-09', use: '支持开发、测试、有限上线、监控、对账、消息阈值与快速禁用实践；指导不是新增规则或安全港。' },
    { id: 33, authors: 'U.S. Securities and Exchange Commission', year: '2014', accessedAt: '2026-08-30', title: 'Regulation Systems Compliance and Integrity', publication: 'Exchange Act Release No. 34-73639; final rule', url: 'https://www.sec.gov/files/rules/final/2014/34-73639.pdf', use: '支持 SCI entities 的系统容量、韧性、测试和事件要求；不自动覆盖每个 proprietary HFT。' },
    { id: 34, authors: 'U.S. Securities and Exchange Commission', year: '2025', accessedAt: '2026-08-30', title: 'Notice of Withdrawal of Proposed Regulatory Actions', publication: 'Release Nos. 33-11377; 34-103247; IA-6885; IC-35635, 12 June 2025', url: 'https://www.sec.gov/files/rules/final/2025/33-11377.pdf', use: '确认撤回的是包括 Reg SCI 扩围在内的提案；不能据此声称 2014 Reg SCI 被撤销。' },
    { id: 35, authors: 'U.S. Securities and Exchange Commission', year: '2010', accessedAt: '2026-08-30', title: 'Concept Release on Equity Market Structure', publication: 'Exchange Act Release No. 34-61358', url: 'https://www.sec.gov/files/rules/concept/2010/34-61358fr.pdf', use: '提供美国监管讨论中 HFT 的常见特征和策略分类；不是现行统一法律身份或因果结论。' },
    { id: 36, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'Rule 5270 — Front Running of Block Transactions', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5270', use: '支持客户 block-order front-running 的规则边界；公开流量预测不自动落入该规则。' },
    { id: 37, authors: 'Commodity Futures Trading Commission', year: '2013', accessedAt: '2026-08-30', title: 'Interpretive Guidance and Policy Statement on Disruptive Practices', publication: '78 FR 31890; anti-spoofing guidance', url: 'https://www.cftc.gov/LawRegulation/FederalRegister/FinalRules/2013-12365.html', use: '支持期货 spoofing 的取消意图与事实判断；高撤单率本身不充分，且不可自动移植到证券法域。' },
    { id: 38, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'Rule 5210 — Publication of Transactions and Quotations', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5210', use: '支持证券报价与 bona fide intent 等边界；不把所有短 quote life 或风险撤单定义为 manipulation。' },
    { id: 39, authors: 'New York Stock Exchange', year: '2026/current', accessedAt: '2026-08-30', title: 'NYSE Rule 104 — Dealings and Responsibilities of DMMs', publication: 'NYSE Rules', url: 'https://www.nyse.com/publicdocs/nyse/regulation/nyse/NYSE_Rules.pdf', use: '支持 NYSE DMM 的特定交易与责任结构；不适用于所有 venue 或 market makers。' },
    { id: 40, authors: 'Cboe Global Markets', year: '2026/current', accessedAt: '2026-08-30', title: 'Equities Risk Management Tools', publication: 'Cboe U.S. Equities trading documentation', url: 'https://www.cboe.com/us/equities/trading/offerings/risk_management/', use: '支持场所层 risk thresholds、cancel/block/disconnect 工具示例；产品功能不是统一联邦义务。' },
    { id: 41, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'CME Globex Kill Switch', publication: 'Globex Credit Controls documentation', url: 'https://www.cmegroup.com/tools-information/webhelp/globex-credit-controls/Content/Kill-Switch.html', use: '支持 CME 产品层阻断与订单取消机制；不保证在途成交回滚，也不等同股票 LULD。' },
    { id: 42, authors: 'LULD Plan Participants', year: '2026/current', accessedAt: '2026-08-30', title: 'Plan to Address Extraordinary Market Volatility', publication: 'Current Limit Up-Limit Down Plan materials', url: 'https://www.luldplan.com/plans', use: '支持美国 NMS 股票价格带和交易暂停机制；不是 firm inventory 或 kill-switch control。' },
    { id: 43, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'Order Granting Approval of the Twenty-Seventh Amendment to the National Market System Plan to Address Extraordinary Market Volatility to Establish Temporary Price Band Protections in Overnight Trading', publication: 'Exchange Act Release No. 34-106042; 5 August 2026', url: 'https://www.sec.gov/files/rules/sro/nms/2026/34-106042.pdf', use: '支持 overnight price-band amendment 已获批但有后续实施阶段；不能写成截点已全面运行。' },
    { id: 44, authors: 'U.S. Securities and Exchange Commission', year: '2024', accessedAt: '2026-08-30', title: 'Regulation NMS: Minimum Pricing Increments, Access Fees, and Transparency of Better Priced Orders', publication: 'Exchange Act Release No. 34-101070; final rule', url: 'https://www.sec.gov/files/rules/final/2024/34-101070.pdf', use: '支持 2024 已采用的 tick、access-fee 与 better-priced-order amendments；当前合规时点另引 2026 relief。' },
    { id: 45, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'Order Granting Temporary Exemptive Relief from Compliance with Certain Provisions of Regulation NMS', publication: 'Exchange Act Release No. 34-105656; 11 June 2026', url: 'https://www.sec.gov/files/rules/exorders/2026/34-105656.pdf', use: '支持 amended Rule 612、Rule 610(c) 及相关定义的 compliance date 延至 2027 年 11 月首个营业日，并核对未被该 order 延期的 Rule 610(d) 边界。' },
    { id: 46, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'The Trade-Through Rule and Locked and Crossed Markets Provisions of Regulation NMS', publication: 'Exchange Act Release No. 34-105655; proposed rule, 11 June 2026', url: 'https://www.sec.gov/files/rules/proposed/2026/34-105655.pdf', use: '确认 Rules 611 与 610(e) 截至截点处于拟撤销而非已废止状态；不支持预判最终结果。' },
    { id: 47, authors: 'U.S. District Court for the Northern District of Texas', year: '2024', accessedAt: '2026-08-30', title: 'National Association of Private Fund Managers et al. v. SEC, Order', publication: 'No. 4:24-cv-00250-O, Document 46, 21 November 2024', url: 'https://law.justia.com/cases/federal/district-courts/texas/txndce/4%3A2024cv00250/387652/46/', use: '支持法院将 SEC 2024 Dealer Rule 整体 vacate；该判决不重新定义所有当前 dealer 边界。' },
    { id: 48, authors: 'European Parliament and Council', year: '2014/current', accessedAt: '2026-08-30', title: 'Directive 2014/65/EU, Article 4 — Definitions', publication: 'MiFID II interactive single rulebook', url: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-4-definitions', use: '支持 EU algorithmic trading、high-frequency technique 等定义；Directive 与其他法域术语不可互换。' },
    { id: 49, authors: 'European Parliament and Council', year: '2014/current', accessedAt: '2026-08-30', title: 'Directive 2014/65/EU, Article 17 — Algorithmic Trading', publication: 'MiFID II interactive single rulebook', url: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-17-algorithmic-trading', use: '支持 investment-firm 算法治理、系统、控制、记录与 market-making strategy 要求；不提供最优策略。' },
    { id: 50, authors: 'European Parliament and Council', year: '2014/current', accessedAt: '2026-08-30', title: 'Directive 2014/65/EU, Article 48 — Systems Resilience, Circuit Breakers and Electronic Trading', publication: 'MiFID II interactive single rulebook', url: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-48-systems-resilience-circuit', use: '支持 trading venue 的韧性、order-to-trade controls、tick、DEA、colocation 和 fee/rebate 边界。' },
    { id: 51, authors: 'European Commission', year: '2016/2017', accessedAt: '2026-08-30', title: 'Commission Delegated Regulation (EU) 2017/589 (RTS 6)', publication: 'Official Journal of the European Union', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32017R0589', use: '支持算法治理、测试、部署、kill functionality、pre-trade limits、消息阈值、监控与对账；直接适用规则不等于 MiFID Directive。' },
    { id: 52, authors: 'European Commission', year: '2016/2017', accessedAt: '2026-08-30', title: 'Commission Delegated Regulation (EU) 2017/578 (RTS 8)', publication: 'Official Journal of the European Union', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32017R0578', use: '支持 market-making agreements/schemes 与 exceptional circumstances；不要求每个 LP 在任何压力状态无限报价。' },
    { id: 53, authors: 'European Securities and Markets Authority', year: '2026', accessedAt: '2026-08-30', title: 'Supervisory Briefing on Algorithmic Trading in the EU', publication: 'ESMA74-1505669079-10311, 26 February 2026', url: 'https://www.esma.europa.eu/sites/default/files/2026-02/ESMA74-1505669079-10311_Supervisory_Briefing_on_Algorithmic_Trading_in_the_EU.pdf', use: '支持治理、测试、outsourcing 和 pre-trade-control 监管趋同实践；该 non-binding briefing 不是新法律。' },
    { id: 54, authors: '中国证券监督管理委员会', year: '2024', accessedAt: '2026-08-30', title: '证券市场程序化交易管理规定（试行）', publication: '证监会公告〔2024〕8号；2024-10-08 起施行', url: 'https://www.csrc.gov.cn/csrc/c101954/c7480579/content.shtml', use: '支持中国证券程序化交易定义、报告、监测、系统和高频差异化监管框架；不直接给出交易所全部阈值。' },
    { id: 55, authors: '上海证券交易所', year: '2025/current', accessedAt: '2026-08-30', title: '上海证券交易所程序化交易管理实施细则', publication: '上证发〔2025〕52号；2025-07-07 起施行，现行有效', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/trade/universal/c/c_20250612_10781696.shtml', use: '支持上海证券市场报告、行为、系统与高频管理的现行实施边界；不能替代其他交易所规则。' },
    { id: 56, authors: '上海证券交易所', year: '2025', accessedAt: '2026-08-30', title: '上交所就正式发布程序化交易管理实施细则并就配套业务规则征求意见答记者问', publication: 'Official Q&A, 3 April 2025', url: 'https://star.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20250403_10776805.shtml', use: '支持 300 次/秒或 20,000 次/日等高频识别标准与实施时点说明；Q&A 不是全球经济定义。' },
    { id: 57, authors: '中国证券监督管理委员会', year: '2025/current', accessedAt: '2026-08-30', title: '期货市场程序化交易管理规定（试行）', publication: '证监会公告〔2025〕12号；2025-10-09 起施行，现行有效', url: 'https://neris.csrc.gov.cn/falvfagui/rdqsHeader/mainbody?navbarId=2&secFutrsLawId=3fb1d2836b6d40e6816d88a7ead4fafc', use: '支持中国期货程序化交易的独立产品和规则边界；不能套用证券账户阈值。' },
    { id: 58, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'MIDAS — Market Information Data Analytics System', publication: 'SEC market structure analytics documentation', url: 'https://www.sec.gov/securities-topics/market-structure-analytics/midas-market-information-data-analytics-system', use: '支持专有行情订单、修改、撤单和成交数据能力；不含完整 participant intent 与所有失败入站消息。' },
    { id: 59, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'Rule 613 — Consolidated Audit Trail', publication: 'SEC CAT overview and rule materials', url: 'https://www.sec.gov/about/divisions-offices/division-trading-markets/rule-613-consolidated-audit-trail', use: '支持 CAT 的监管订单生命周期与 reporting 架构；CAT 不是公共匿名 LOB 数据库。' },
    { id: 60, authors: 'CAT NMS Plan', year: '2026', accessedAt: '2026-08-30', title: 'CAT Reporting Technical Specifications for Industry Members, Version 4.2.0 r2', publication: 'Participant technical specifications, 24 February 2026', url: 'https://www.catnmsplan.com/sites/default/files/2026-02/02.24.2026-CAT_Reporting_Technical_Specifications_for_Participants_4.2.0-r2.pdf', use: '支持 CAT order lifecycle、route 与 timestamp 字段能力；不证明公共数据可获得性或交易者意图。' },
    { id: 61, authors: 'Nasdaq', year: '2026/current', accessedAt: '2026-08-30', title: 'Nasdaq TotalView-ITCH 5.0 Specification', publication: 'Official data-feed specification', url: 'https://nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf', use: '支持 sequenced add/delete/execute 消息与 LOB reconstruction；不含交易者身份、意图或未进 feed 的失败请求。' },
    { id: 62, authors: 'New York Stock Exchange', year: '2026/current', accessedAt: '2026-08-30', title: 'NYSE Integrated Feed', publication: 'Official market-data product documentation', url: 'https://www.nyse.com/data-products/catalog/integrated-feed', use: '支持 NYSE order-book、trade 与 reference-data feed 能力；不单独完成跨 venue 因果排序。' },
    { id: 63, authors: 'European Commission', year: '2016/2017', accessedAt: '2026-08-30', title: 'Commission Delegated Regulation (EU) 2017/574 (RTS 25)', publication: 'Official Journal of the European Union', url: 'https://eur-lex.europa.eu/legal-content/en/ALL/?uri=CELEX:32017R0574', use: '支持欧盟 business-clock accuracy 与 timestamp 颗粒度要求；字段精度不证明任意跨主体次序天然准确。' },
    { id: 64, authors: 'U.S. Securities and Exchange Commission', year: '2020', accessedAt: '2026-08-30', title: 'Market Data Infrastructure', publication: 'Exchange Act Release No. 34-90610; final rule', url: 'https://www.sec.gov/rules-regulations/2020/12/market-data-infrastructure', use: '支持美国 consolidated market-data 架构与定义演进；不证明 direct/SIP 在每个事件的固定速度排序。' },
    { id: 65, authors: 'SEC Division of Trading and Markets', year: '2026/current', accessedAt: '2026-08-30', title: 'Frequently Asked Questions about Rule 606 of Regulation NMS', publication: 'SEC staff guidance', url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/faq-rule-606-regulation', use: '支持 routing disclosure 字段和 staff interpretation 边界；FAQ 无独立法律效力且不定义最优 router。' },
    { id: 66, authors: 'Commodity Futures Trading Commission', year: '2015', accessedAt: '2026-08-30', title: 'CFTC v. Navinder Singh Sarao and Nav Sarao Futures Limited — Complaint', publication: 'Enforcement complaint, 17 April 2015', url: 'https://www.cftc.gov/sites/default/files/idc/groups/public/%40lrenforcementactions/documents/legalpleading/enfsaraocomplaint041715.pdf', use: '支持 CFTC 对 Sarao spoofing/layering 行为的指控；起诉状不证明其单独导致 Flash Crash。' },
    { id: 67, authors: 'U.S. Department of Justice', year: '2016', accessedAt: '2026-08-30', title: 'Futures Trader Pleads Guilty to Illegally Manipulating Futures Market in Connection with 2010 Flash Crash', publication: 'DOJ press release, 9 November 2016', url: 'https://www.justice.gov/archives/opa/pr/futures-trader-pleads-guilty-illegally-manipulating-futures-market-connection-2010-flash', use: '支持 Sarao 对操纵与 spoofing 行为认罪的程序事实；不提供全市场唯一因果归因。' },
    { id: 68, authors: 'European Commission', year: '2016/2017', accessedAt: '2026-08-30', title: 'Commission Delegated Regulation (EU) 2017/565, Article 19 — High Intra-day Message Rate', publication: 'Official Journal of the European Union', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32017R0565', use: '支持 MiFID II 高频技术定义中较高日内消息率的计算细节；该阈值不是策略、盈利或操纵定义。' },
    { id: 69, authors: 'European Commission', year: '2016/2017', accessedAt: '2026-08-30', title: 'Commission Delegated Regulation (EU) 2017/584 (RTS 7)', publication: 'Official Journal of the European Union', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32017R0584', use: '支持 trading venue 的系统韧性、容量、业务连续性、测试与 electronic-trading controls；不能与 investment-firm RTS 6 混写。' },
  ],
  readingList: [
    { title: 'Ho & Stoll (1981)', scope: 'dealer 的动态目标、库存风险、交易到达与最优报价', reason: '先建立“库存怎样改变报价”这条经典机制，再辨认现代电子市场新增了哪些状态。', url: 'https://doi.org/10.1016/0304-405X(81)90020-9', group: 'models', guide: '先修 T03 与第 16 节；先读模型设定和比较静态，再看证明；约 90–120 分钟。' },
    { title: 'Glosten & Milgrom (1985)', scope: '异质信息、交易方向的 Bayes 更新与信息价差', reason: '把 adverse selection 从库存成本和运营成本中分离出来。', url: 'https://doi.org/10.1016/0304-405X(85)90044-3', group: 'models', guide: '先修概率与条件期望；围绕 sequential trade、Bayes quote 和 spread 三段精读；约 90–120 分钟。' },
    { title: 'Kyle (1985)', scope: 'informed trading、noise flow、线性 price impact 与深度', reason: '理解订单流怎样进入价格，同时避免把 Kyle 的 λ 当成挂单策略。', url: 'https://doi.org/10.2307/1913210', group: 'models', guide: '先修 T05；先抓单期模型与 λ 的均衡含义，多期推导可后读；约 120–180 分钟。' },
    { title: 'Avellaneda & Stoikov (2008)', scope: 'CARA、Brownian mid、Poisson fills、reservation price 与 spread', reason: '完整推导本节的基准报价模型，并逐条标出生产环境里被省略的状态。', url: 'https://doi.org/10.1080/14697680701381228', group: 'models', guide: '先修 T03 与连续时间记号；先复算 reservation price、spread 和参数单位；约 120 分钟。' },
    { title: 'Guéant, Lehalle & Fernandez-Tapia (2013)', scope: 'HJB、库存风险与可计算近似', reason: '从 A–S 基准继续学习库存约束模型，而不把闭式解误当经验定律。', url: 'https://doi.org/10.1007/s11579-012-0087-0', group: 'models', guide: '先完成 A–S；重点读模型、近似和数值比较，HJB 证明按需；约 120–180 分钟。' },
    { title: 'Moallemi & Yuan (2017)', scope: 'FIFO queue position 的动态价值、不利选择与撤单决策', reason: '把“同价同量”进一步拆成不同 queue option value。', url: 'https://doi.org/10.2139/ssrn.2996221', group: 'models', guide: '先修 1.04、1.14 与本节 27–30；先读经济机制和数值结果；约 90–150 分钟。' },
    { title: 'O’Hara (1995) · Market Microstructure Theory', scope: 'dealer、信息、spread 与价格发现理论', reason: '获得不同经典模型之间的共同语言和明确假设。', url: 'https://www.wiley.com/en-us/Market+Microstructure+Theory-p-9781557864437', group: 'core', guide: '先修 1.12–1.14；先读第 1–3 章 Markets and Market-Making、Inventory Models、Information-Based Models；约 4–6 小时。' },
    { title: 'Hasbrouck (2007) · Empirical Market Microstructure', scope: '事件数据、订单流、price impact 与价格发现计量', reason: '把理论状态映射成可观察变量，并识别时间戳与数据覆盖边界。', url: 'https://global.oup.com/academic/product/empirical-market-microstructure-9780195301649', group: 'evidence', guide: '先修 T05、T08；按第 2、11–15 章读交易机制、库存、限价市场、深度与执行成本；约 6–8 小时。' },
    { title: 'Cartea, Jaimungal & Penalva (2015)', scope: 'algorithmic execution、market making、signals 与 stochastic control', reason: '把报价、主动交易、对冲和执行放进统一控制框架。', url: 'https://doi.org/10.1017/CBO9781316018327', group: 'core', guide: '先读第 1–2 章，再读第 10 章 10.1–10.4；第 5 章控制工具按需补；约 5–7 小时。' },
    { title: 'Menkveld (2013)', scope: '跨市场电子做市商的库存、交易角色与收益', reason: '用可识别公司的实证研究连接 agent 状态与市场足迹，同时保留外推边界。', url: 'https://doi.org/10.1016/j.finmar.2013.06.006', group: 'evidence', guide: '先修 T05；先读制度、识别和库存图，再读回归；约 90–120 分钟。' },
    { title: 'Hasbrouck & Saar (2013)', scope: 'linked messages、低延迟活动代理与市场质量', reason: '学习如何从消息链构造速度代理，而不把它误写成法律身份。', url: 'https://doi.org/10.1016/j.finmar.2013.05.003', group: 'evidence', guide: '先修 T05、T08；重点审计 linked-message proxy 与因果边界；约 90–120 分钟。' },
    { title: 'Foucault & Menkveld (2008)', scope: 'fragmentation、smart order routing 与 order-flow competition', reason: '理解跨 venue 深度为何取决于路由和连接，而非简单相加。', url: 'https://doi.org/10.1111/j.1540-6261.2008.01312.x', group: 'evidence', guide: '先修 1.21 与第 33–34 节；先读场所制度和自然实验，再读结构解释；约 120 分钟。' },
    { title: 'van Kervel (2015)', scope: 'fast/slow traders、重复流动性与跨 venue 撤单', reason: '建立 displayed depth 与 simultaneously actionable depth 的差异。', url: 'https://doi.org/10.1093/rfs/hhv023', group: 'evidence', guide: '先修第 34 节；围绕 shared liquidity、identity 与同步撤单证据精读；约 90–120 分钟。' },
    { title: 'Budish, Cramton & Shim (2015)', scope: 'continuous-time priority、latency arms race 与 frequent batch auctions', reason: '理解连续串行撮合怎样把微小时差转成离散队列价值。', url: 'https://doi.org/10.1093/qje/qjv027', group: 'evidence', guide: '先修 1.18 与第 39 节；先读机制和反事实设计，福利推导后读；约 120–180 分钟。' },
    { title: 'Aquilina, Budish & O’Neill (2022)', scope: 'latency-arbitrage races 的消息级识别与成本', reason: '观察理论竞速怎样被转化成逐事件、可证伪的经验设计。', url: 'https://doi.org/10.1093/qje/qjab032', group: 'evidence', guide: '先修 T05、T08；重点复原 race winner/loser 的数据定义与成本估计；约 120 分钟。' },
    { title: 'SEC Staff (2020) · Algorithmic Trading in U.S. Capital Markets', scope: '策略、正常期市场质量、压力风险与运营控制', reason: '获得官方综合图景，同时保持 staff report 与成文规则的效力区别。', url: 'https://www.sec.gov/files/Algo_Trading_Report_2020.pdf', group: 'core', guide: '先读 Executive Summary，再读策略、市场质量、压力与运营风险部分；约 90–120 分钟。' },
    { title: 'CFTC–SEC (2010) · May 6 Flash Crash Findings', scope: '事件时序、执行程序、流动性互动与 Stop Logic', reason: '用联合调查重建多主体反馈，避免把全程压成单一元凶。', url: 'https://www.cftc.gov/sites/default/files/idc/groups/public/%40otherif/documents/ifdocs/staff-findings050610.pdf', group: 'core', guide: '先读 Executive Summary 与 Findings，再按 14:32–14:45 时序回看证据；约 90–120 分钟。' },
    { title: 'SEC (2013) · Knight Capital Order', scope: '部署、旧代码、订单流、限额、告警与损失时序', reason: '理解软件版本和对账怎样成为交易 agent 的经济状态。', url: 'https://www.sec.gov/files/litigation/admin/2013/34-70694.pdf', group: 'core', guide: '先读 Findings 的部署、订单与控制事实，再读 violations；约 45–60 分钟。' },
    { title: '17 CFR § 240.15c3-5', scope: 'market-access broker-dealer 的财务与监管风险控制', reason: '从现行原文区分 broker-dealer 义务、策略公司控制和 venue 工具。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-5', group: 'rules', guide: '先修 2.07 与第 42 节；按主体、控制归属和例外逐款核对；约 30–45 分钟。' },
    { title: 'FINRA Regulatory Notice 15-09', scope: '算法开发、测试、部署、监控、消息阈值与快速禁用', reason: '把模型开发扩展成完整 change-governance 生命周期。', url: 'https://www.finra.org/rules-guidance/notices/15-09', group: 'rules', guide: '先修第 45–46 节；沿 development-to-production 生命周期读；约 45–60 分钟。' },
    { title: 'SEC (2014) · Regulation SCI', scope: 'SCI entities 的容量、韧性、测试、变更与事件处理', reason: '理解系统规则的主体边界，并避免把已撤回的扩围提案当现行法。', url: 'https://www.sec.gov/files/rules/final/2014/34-73639.pdf', group: 'rules', guide: '先查 SCI entity 适用范围，再读 capacity、integrity、testing 与 events；约 90–150 分钟。' },
    { title: 'NYSE Rule 104', scope: 'DMM 的交易、报价、auction 与 fair-and-orderly-market 职责', reason: '把 venue 指定身份与一般 proprietary market making 分开。', url: 'https://www.nyse.com/publicdocs/nyse/regulation/nyse/NYSE_Rules.pdf', group: 'rules', guide: '先修第 05 节；只读 Rule 104 并记录版本日期；约 30–45 分钟。' },
    { title: 'LULD Plan', scope: 'NMS 股票 price bands、暂停与重开机制', reason: '区分证券级市场保护、firm kill 和期货 Stop Logic。', url: 'https://www.luldplan.com/plans', group: 'rules', guide: '先修第 44 节；先读生效版本、bands 与 pause/reopen，再查实施通知；约 45–60 分钟。' },
    { title: 'MiFID II Article 17', scope: 'algorithmic-trading firm 的系统、控制、记录与做市安排', reason: '比较欧盟事前治理与美国分层规则，但不把 Directive 直接移植到其他法域。', url: 'https://www.esma.europa.eu/publications-and-data/interactive-single-rulebook/mifid-ii/article-17-algorithmic-trading', group: 'rules', guide: '先修第 54 节；先区分 investment firm、market-making strategy 与 DEA，再接 RTS；约 30–45 分钟。' },
    { title: 'EU RTS 6 · Regulation 2017/589', scope: '测试、部署、pre-trade limits、kill functionality、监控与对账', reason: '把技术控制连接到可核验的法定工程要求。', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32017R0589', group: 'rules', guide: '先读 Article 17；按 testing、limits、kill、monitoring、reconciliation 五组做控制表；约 90 分钟。' },
    { title: 'EU RTS 8 · Regulation 2017/578', scope: 'market-making agreements、schemes 与 exceptional circumstances', reason: '精确理解何时触发持续报价安排，而非假定所有 HFT 都有同一义务。', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32017R0578', group: 'rules', guide: '先读 Article 17；只围绕 agreement 触发、报价时段与 exceptional circumstances；约 45–60 分钟。' },
    { title: '证监会（2024）· 证券市场程序化交易管理规定（试行）', scope: '先报告后交易、系统、监测与高频差异化监管框架', reason: '建立中国证券市场的上位规则，不用境外 HFT 标签替代本地定义。', url: 'https://www.csrc.gov.cn/csrc/c101954/c7480579/content.shtml', group: 'rules', guide: '先修第 54 节；按报告、系统、监测、高频差异化与施行日期做摘录；约 45–60 分钟。' },
    { title: '上交所（2025）· 程序化交易管理实施细则', scope: '账户报告、高频识别、系统与交易行为管理', reason: '核对现行交易所操作边界，并把证券阈值与期货规则分开。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/trade/universal/c/c_20250612_10781696.shtml', group: 'rules', guide: '先读证监会上位规定；重点核对账户口径、高频阈值、报告与施行日期；约 45–60 分钟。' },
    { title: 'SEC MIDAS', scope: '订单、修改、撤单、成交数据的能力和公开分析入口', reason: '先做数据 capability audit，再设计 event-level 研究。', url: 'https://www.sec.gov/securities-topics/market-structure-analytics/midas-market-information-data-analytics-system', group: 'evidence', guide: '先修 T08 与第 53 节；先列字段覆盖和缺失，再设计问题；约 30–45 分钟。' },
    { title: 'Nasdaq TotalView-ITCH 5.0 Specification', scope: 'sequenced add、execute、cancel、delete 与 order-book reconstruction', reason: '从官方字段定义重建单 venue 事件流，同时明确它没有 participant intent。', url: 'https://nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf', group: 'evidence', guide: '先修 1.04 与 T08；按 system event、stock directory、add/execute/cancel/delete 字段读；约 60–90 分钟。' },
  ],
};
