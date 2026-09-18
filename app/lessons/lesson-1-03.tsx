import OrderInstructionLab from '../components/OrderInstructionLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson103Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>订单不是对未来价格的预测，而是交易者授权市场在什么状态下、以什么边界替自己行动。</h2>
        <p>
          你决定“买入一只股票”时，市场还无法执行这句话。系统必须知道买多少、何时开始、愿意支付到什么价格、没有立刻完成时继续等待还是撤销。
          订单就是把经济意图翻译成机器能够验证和执行的规则。Larry Harris 因而把订单理解为实施交易策略的指令，而不是一张只写方向和数量的申请表。<Cite n={1} />
          这一区分很重要：观点可以模糊，交易授权却必须明确；你没有写进指令的保护，撮合系统不会替你猜。
        </p>
        <p>
          市价、限价和 Stop 的差异，归根到底不是“快按钮、慢按钮与止损按钮”，而是它们允许不同坏结果发生。
          市价单把即时执行置于显式价格边界之前，因此允许成交价偏离预期；限价单禁止越过价格边界，因此允许等待或不成交；
          Stop-Market 在触发后允许滑点以换取退出机会；Stop-Limit 保留价格边界，却允许仓位在最需要退出时仍然留在账上。
          订单类型不会消灭风险，只会把风险从一个维度重新分配到另一个维度。
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把一张订单拆成激活条件、价格边界、有效期、数量条件与其他属性，而不是把所有缩写混成一列“订单类型”。</li>
            <li>从给定报价与深度计算市价单和可成交限价单的逐档成交、VWAP、剩余数量及可能状态。</li>
            <li>用条件前缀与子单解释 Stop-Market 和 Stop-Limit，清楚区分触发价、触发时刻、子单验证、限价与最终成交价。</li>
            <li>把已成交成本与未成交后的追价、等待、逆向选择和信息暴露放进同一决策框架，并说明何时结论会改变。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节边界</span>
          <p>
            本节研究单个交易者怎样把意图编码为指令。Bid、ask、queue 与 depth 的完整状态空间属于 1.04；订单新增、撤销和成交怎样汇总成 Order Flow 属于 1.08；
            滑点中哪些是机械扫簿、暂时冲击或永久信息影响属于 1.09。这里会使用最小订单簿案例，但不会提前替代后续三节。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="anatomy">
        <p className="section-kicker">01 · 从意图到可执行消息</p>
        <h2>先问交易必须满足什么，再问菜单里哪个名字最接近</h2>
        <p>
          一个完整的交易意图至少包含六个经济变量：方向、目标数量、保留价格（买方最高愿付或卖方最低愿收的价格）、完成期限、紧迫度，
          以及交易者愿意承担的信息暴露（有多少方向、数量与价格意图会被他人看见）。
          交易系统不会直接接收这些抽象偏好，它只接收合格字段。于是经纪商或交易者必须把偏好编码成一组条件：现在激活还是等待事件；
          激活后有无最高买价或最低卖价；未成交部分可以活多久；是否允许部分成交；显示多少；允许路由到哪里。
          订单类型只是这份授权中最醒目的部分，而不是全部。
        </p>
        <div className="mechanism-chain" aria-label="交易意图转化为订单结果的因果链">
          {[
            ['经济目标', '方向、数量、保留价格、期限与风险暴露'],
            ['编码指令', '激活条件、价格边界、有效期与数量条件'],
            ['抵达市场', '经纪商检查、传输延迟、场所验证与当前状态'],
            ['判断可成交性', '立即索取流动性，或进入等待状态'],
            ['状态转换', '全部成交、部分成交、休眠、挂单、撤销、到期或拒绝'],
            ['经济结果', '成交成本、未成交成本、风险暴露与新的交易决策'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链解释了为什么同一订单名称不能脱离场所与经纪商政策理解。客户看到的“止损单”可能由券商保存触发条件，达到阈值后才生成交易所接受的普通订单；
          一张“市价单”在某些场所可能受价格保护区间约束；同样写着 DAY 的订单，也会在停牌、开收盘阶段或不同产品上遇到不同处理。
          专业分析必须区分客户委托语义、经纪商订单管理逻辑和交易所原生消息三层，而不能把应用程序按钮直接当成撮合规则。
        </p>
      </section>

      <section className="lesson-section" id="dimensions">
        <p className="section-kicker">02 · 五个需要区分的控制维度</p>
        <h2>Market、Limit、Stop 回答“何时激活、接受什么价格”；DAY、IOC、FOK 回答另一组问题</h2>
        <p>
          初学材料经常把 Market、Limit、Stop、DAY、GTC、IOC、FOK 全部列在同一个“订单类型”标题下，结果让人误以为它们彼此互斥。
          更清楚的做法是在分析上把订单拆成多个控制维度，同时承认具体协议可能把几个条件耦合在同一字段中。Nasdaq 现行规则也明确把决定定价、执行或挂簿方式的 Order Type 与进一步限制行为的 Order Attribute 分开；
          FINRA 则把 IOC、FOK 等归入时间参数或限定条件。<Cite n={17} /><Cite n={18} /> 这种分类不是为了背术语，而是为了定位每个字段究竟控制哪一种失败方式。
        </p>
        <div className="table-scroll" role="region" aria-label="订单指令五个维度，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix order-dimension-table">
            <caption>一张订单 = 多个条件的组合，而不是一个名称</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">它回答的问题</th><th scope="col">示例</th><th scope="col">本节处理范围</th></tr></thead>
            <tbody>
              <tr><th scope="row">激活条件</th><td>订单通过验证后直接进入 ACTIVE，还是先等事件再生成并验证子单？</td><td>普通订单直接 ACTIVE；Stop 先 DORMANT</td><td>完整解释</td></tr>
              <tr><th scope="row">价格约束</th><td>买入最高愿付多少、卖出最低愿收多少？</td><td>无显式限价；买入限价 100</td><td>完整解释</td></tr>
              <tr><th scope="row">有效期</th><td>没有立即完成时，订单继续存在多久？</td><td>DAY、GTC、IOC</td><td>建立最小地图</td></tr>
              <tr><th scope="row">数量条件</th><td>是否允许部分成交？</td><td>普通 IOC 可部分；FOK 要么全成要么全撤</td><td>建立最小地图</td></tr>
              <tr><th scope="row">显示与路由</th><td>谁能看到多少，订单可以去哪些市场？</td><td>Displayed、Hidden、Pegged、Route</td><td>只标接口，留给后续</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>订单的结构分解 · 不是数值模型</span>
          <div>Order = Activation × Price Boundary × Time-in-Force × Quantity Constraint × Other Attributes</div>
          <p>
            乘号只是分析记号，表示这些条件共同决定状态路径；它不表示数值相乘，也不表示协议字段可以任意做笛卡尔积。
            比如“买入限价 100 元”规定价格边界；若使用 IOC，可得部分立即成交、余量撤销；若改用 FOK，则必须立即完整成交，否则整张撤销。
            FOK 本身已经把“立即”与“完整数量”耦合起来，互相矛盾或场所不支持的属性组合会被拒绝、移除或改写，必须回到具体规则手册。
          </p>
        </div>
        <div className="unified-state-intro">
          <span>统一状态语法</span>
          <h3>Stop 不是另一套执行世界；它只是在普通订单激活之前增加条件与再次验证的分支</h3>
          <p>
            CREATED 表示指令已被创建，随后必须通过券商与场所验证；验证失败直接进入 REJECTED，不能先假装成 ACTIVE。普通 Market 或 Limit 被接受后可进入 ACTIVE；
            条件 Stop 被接受后先进入 DORMANT（休眠）。触发事件只生成 Market 或 Limit 子单，子单仍须再次验证，成功后才进入 ACTIVE，失败则被拒绝。
            已激活且能立刻与当前对手报价成交的订单称为 active-aggressive 或 marketable；已激活但价格条件不允许立即成交、并在场所允许时等待的订单称为 active-resting。
            这是本节为 Market、Limit 与 Stop 建立的统一教学语法，不试图穷尽开收盘专用订单、暂停等待等所有场所状态。后文、互动与练习都复用这套词汇。
          </p>
        </div>
        <div className="state-sequence unified-order-states" aria-label="Market、Limit 与 Stop 的统一教学状态语法">
          <div><span>01</span><b>CREATED</b><p>方向、数量与字段已形成，尚不代表市场已经接受。</p></div>
          <div><span>02</span><b>VALIDATION</b><p>券商与场所检查权限、资金、字段和市场状态；失败即 REJECTED。</p></div>
          <div><span>03</span><b>ACCEPTED → ACTIVE / DORMANT</b><p>普通订单进入 ACTIVE；被接受的条件单进入 DORMANT。</p></div>
          <div><span>04</span><b>TRIGGER → CHILD VALIDATION</b><p>Stop 生成子单并再次验证；子单可能被拒绝，也可能进入 ACTIVE。</p></div>
          <div><span>05</span><b>AGGRESSIVE / RESTING</b><p>ACTIVE 后，能立即成交则主动索取；否则在规则允许时等待。</p></div>
          <div><span>06</span><b>EXECUTION / EXIT</b><p>全部或部分成交；余量依规则等待、撤销或到期。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="market">
        <p className="section-kicker">03 · Market Order</p>
        <h2>市价单购买的是较高的即时执行机会，不是屏幕价格的承诺</h2>
        <p>
          在常见连续市场语境中，市价单要求以当时可获得的最好价格尽快买入或卖出，并且不由交易者主动填写一个显式成交上限或下限。
          Investor.gov 用“保证成交、不保证价格”帮助初学者理解优先级，同时明确提醒最近成交价不等于实际执行价。<Cite n={3} />
          出版级表述还要再加一层限定：市价单通常提供最高的即时执行机会，但停牌、无对手方、价格带、场所价格保护带（collar）、风控拒绝或流动性不足仍可能导致等待、部分成交、撤销或拒绝；
          它不是跨越一切市场状态的无条件完整成交保证。
        </p>
        <p>
          为什么价格不能保证？因为屏幕上的 last price 是过去发生的交易，而新的买入市价单面对的是订单抵达时尚未被别人拿走的卖盘。
          从你按下按钮到订单抵达，报价可能已经变化；即使没有变化，最优卖价上的数量也可能小于你的订单。系统会先消耗最便宜的可用卖单，再进入更高一档，直到数量完成、流动性耗尽或规则停止继续执行。
          一张大订单因而可能得到多个成交回报，而不是一个“市场价”。
        </p>
        <div className="number-story three-column">
          <div><span>01 · 看到的报价</span><b>Best ask = 100.00</b><p>它只说明最便宜一档的价格，不说明该档能承接全部数量。</p></div>
          <div><span>02 · 买入 600 股</span><b>200 @ 100.00<br />400 @ 100.02</b><p>订单按价格顺序消耗两档卖单。</p></div>
          <div><span>03 · 实际均价</span><b>VWAP ≈ 100.0133</b><p>最优卖价、最差成交价 100.02 与成交均价是三个不同对象。</p></div>
        </div>
        <div className="equation-card">
          <span>成交量加权平均价 · VWAP</span>
          <div>P̄ = Σ q<sub>i</sub>P<sub>i</sub> / Σ q<sub>i</sub> = (200×100.00 + 400×100.02) / 600 = 100.013333… ≈ 100.0133</div>
          <p>
            q<sub>i</sub> 是每一档实际成交数量，P<sub>i</sub> 是对应成交价。这里的 0.0133 元只是相对最初最优卖价的逐档执行差异；
            它不能被直接命名为永久价格冲击，因为订单抵达前的报价变化、费用、暂时冲击和信息反应还没有被识别，完整分解属于 1.09。
          </p>
        </div>
      </section>

      <section className="lesson-section" id="limit">
        <p className="section-kicker">04 · Limit Order</p>
        <h2>限价是最差可接受边界，不是目标价，更不是“只有等到价格刚好等于它才成交”</h2>
        <p>
          买入限价 L 表示成交价不得高于 L；卖出限价 L 表示成交价不得低于 L。只要市场能给出更有利价格，订单就可以价格改善：
          100.03 元的买入限价面对 100.00 元卖单，会先以 100.00 元成交，而不会主动多付 0.03 元。监管机构的投资者材料也把限价定义为“限价或更好”，并明确说明执行不受保证。<Cite n={3} /><Cite n={4} />
        </p>
        <p>
          因此，限价单真正控制的是已成交结果的价格边界；它放弃控制的是在期限内能否完成。未达到边界的对手方订单可能从未出现，排在同价前方的数量可能始终没有被消耗，
          订单也可能因到期、撤销或风控失效而离开。甚至市场上出现过等于限价的成交，也不能单凭这一事实断定你的订单“本应成交”：还需要知道成交发生在哪个场所、你的队列位置、对手流量、隐藏数量和路由路径。
          Lo、MacKinlay 与 Zhang 的实证研究也区分首次成交时间与完整成交时间，并显示执行等待与限价、价差、市场状态等共同相关。<Cite n={14} />
        </p>
        <aside className="contrast-card">
          <div><span>买入限价 L</span><b>最高愿付价格</b><p>成交条件为 P≤L；可能在更低价格成交，也可能完全不成交。</p></div>
          <div><span>卖出限价 L</span><b>最低愿收价格</b><p>成交条件为 P≥L；可能在更高价格成交，也可能长期等待。</p></div>
        </aside>
        <p>
          被动等待还带来一种直觉上不明显的风险：订单往往不是随机成交，而是在对手方愿意主动与你交易时成交。
          如果新的负面信息让旧买价变得过高，知情卖方会优先击中这张买单；好消息发生时，卖方却可能撤走或不来。
          这种条件性成交造成 picked-off risk 或 winner&apos;s curse：你拿到了原先想要的价格，却可能恰好在它已经不再便宜时成交。
          Foucault 的动态限价市场模型把价格改善、不成交与旧报价被挑中的风险放在同一均衡中。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="marketability">
        <p className="section-kicker">05 · Marketability</p>
        <h2>Market 与 Limit 之间不是“立即/等待”的二元开关；可成交限价单连接了两端</h2>
        <p>
          一张限价单是否立即行动，取决于限价相对订单抵达时最优对手报价的位置。若当前最优买价为 b<sub>t</sub>、最优卖价为 a<sub>t</sub>，
          买入限价达到或高于 a<sub>t</sub>，或卖出限价达到或低于 b<sub>t</sub>，它就在抵达时具有可立即成交性（marketability）：可以立刻跨越价差索取流动性。
          美国 Regulation NMS 的定义也使用买入限价相对全国最优卖价（national best offer，NBO）、卖出限价相对全国最优买价（national best bid，NBB）来界定 marketable limit。<Cite n={7} />
        </p>
        <div className="equation-card">
          <span>连续簿中的最小可成交性条件</span>
          <div>Buy limit is marketable ⇔ L ≥ a<sub>t</sub>　；　Sell limit is marketable ⇔ L ≤ b<sub>t</sub></div>
          <p>
            对买方来说，L 越高，允许触及的卖盘范围越大；对卖方方向相反。这里的 a<sub>t</sub>、b<sub>t</sub> 必须先说明是单一场所报价还是跨市场最优报价。
            集合竞价、锁定或交叉市场、没有有效报价以及多场所路由还需要另外的规则，公式不是跨架构的完整执行协议。
          </p>
        </div>
        <div className="aggression-ladder" aria-label="买入订单进攻性的连续阶梯">
          <article><span>等待更低价格</span><b>Buy limit 99.98</b><p>低于 100.00 / 100.02 市场的 best bid，通常在更远位置等待。</p></article>
          <article><span>改善本方报价</span><b>Buy limit 100.01</b><p>高于 best bid、低于 best ask，成为新的买方最优报价但不立即成交。</p></article>
          <article><span>有边界地进攻</span><b>Buy limit 100.03</b><p>吃掉 100.02 以内卖盘，超过 100.03 的部分停止。</p></article>
          <article><span>无自设限价地进攻</span><b>Buy market</b><p>尽快接受可获得卖盘，但仍受场所与市场状态约束。</p></article>
        </div>
        <p>
          这条阶梯纠正两个常见错误。第一，限价单不天然提供流动性；marketable limit 与市价单一样会主动消耗已有挂单。
          第二，订单名称没有独立于抵达状态的固定经济含义：100.03 元买入限价在 ask 为 100.02 时主动，在 ask 已跳到 100.05 时却转为等待。
          现代综述以及 Parlour 与 Biais、Hillion、Spatt 的研究都强调订单选择会响应既有簿面、价差与深度，因此订单流与市场状态彼此内生。<Cite n={2} /><Cite n={12} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="total-cost">
        <p className="section-kicker">06 · 完整执行成本</p>
        <h2>只比较已经成交的价格，会系统性遗漏限价单最重要的失败结果</h2>
        <p>
          假设现在可以在 100.02 元立即买入，也可以在 100.00 元挂限价单。若我们只观察成功成交样本，限价单看起来永远节省 0.02 元；
          但真正必须完成交易的人还要处理未成交。设一个纯教学情景：限价单有 60% 概率在 100.00 元完成，40% 概率没有成交，期限末只能在 100.30 元追买。
          完整策略的情景平均买价是 100.12 元，反而高于立即支付的 100.02 元。
        </p>
        <div className="equation-card">
          <span>把未成交放回样本 · 情景计算</span>
          <div>E[P<sub>strategy</sub>] = 0.60×100.00 + 0.40×100.30 = 100.12</div>
          <p>
            60% 与 40% 是人为给定的教学假设，不是市场统计估计。这个例子只证明比较方法：对“今日必须买到”的交易者，未成交后的追价属于策略成本；
            对“价格不够便宜就可以放弃”的投资者，未成交可能只是继续持有现金；他对未成交与追价结果赋予的损失权重不同，结论也可能反转。
          </p>
        </div>
        <p>
          Perold 提出的 implementation shortfall 框架正是为了把纸面决策与真实实施结果放在同一基准下。<Cite n={15} />
          对目标买入数量 Q、决策时基准价 P<sub>0</sub>、实际成交 q<sub>i</sub> 与成交价 P<sub>i</sub>、期限末未成交数量的估值或补单价 P<sub>T</sub>，可以写成：
        </p>
        <div className="equation-card">
          <span>买入任务的实施缺口 · 教学分解</span>
          <div>IS = Σ q<sub>i</sub>(P<sub>i</sub>−P<sub>0</sub>) + (Q−Σq<sub>i</sub>)(P<sub>T</sub>−P<sub>0</sub>) + fees</div>
          <p>
            第一项记录已经成交部分相对决策价的差异，第二项把没有完成的数量按期限末机会成本计入，最后加费用。
            它不是说明所有人都必须追单，而是迫使分析者先写清“如果没成交，经济任务是否仍然存在”。
          </p>
        </div>
        <p>
          更一般地，一张订单的预期损失包含成交时的价差、滑点和费用，也包含未成交后的放弃或追价、等待期间风险、被新信息挑中成交以及意图暴露。
          Harris 与 Hasbrouck 的订单策略研究特别区分必须交易的 precommitted trader 与可以选择不交易的主体：若没有先定义任务，所谓“最佳订单类型”就没有统一答案。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="stop-machine">
        <p className="section-kicker">07 · Stop 的条件前缀与子单</p>
        <h2>Stop price 只负责开门；门打开以后，真正执行的是另一张 Market 或 Limit Order</h2>
        <p>
          Stop order 通过初始验证后，在触发前通常处于休眠或条件状态，不参与普通订单簿竞争。达到规定事件后，它尝试生成候选子单：
          Stop-Market 生成市价子单，Stop-Limit 生成带有限价 L 的限价子单；子单通过当时的券商与场所验证后才进入 ACTIVE，验证失败则被拒绝。
          FINRA Rule 5350 对标准 stop 的交易触发定义非常清楚：买入 stop 在一笔交易达到或高于 stop price 时触发，
          卖出 stop 在一笔交易达到或低于 stop price 时触发；规则也允许会员设计采用报价等其他触发事件的替代指令，但不得把它继续标成标准 stop，且须事先披露。<Cite n={5} />
        </p>
        <div className="state-sequence stop-state-sequence" aria-label="Stop 订单通过初始验证后的四阶段路径">
          <div><span>01</span><b>ACCEPTED → DORMANT</b><p>条件指令已通过初始验证；托管方观察规定参考变量 R<sub>t</sub>。</p></div>
          <div><span>02</span><b>TRIGGER EVENT</b><p>触发条件满足，启动子单生成；触发本身不是子单已被市场接受。</p></div>
          <div><span>03</span><b>CHILD VALIDATION</b><p>生成 Market 或 Limit 候选子单；验证失败即 REJECTED。</p></div>
          <div><span>04</span><b>ACTIVE → OUTCOME</b><p>验证通过后，子单才按当时流动性执行或等待。</p></div>
        </div>
        <div className="equation-card">
          <span>触发时刻 · 用公式分开条件满足与子单接受</span>
          <div>τ<sub>buy</sub> = inf&#123;t : R<sub>t</sub> ≥ S&#125;　；　τ<sub>sell</sub> = inf&#123;t : R<sub>t</sub> ≤ S&#125;</div>
          <p>
            S 是 stop threshold，R<sub>t</sub> 是合同规定的触发参考，inf 表示“第一次满足条件的时刻”。公式只确定何时启动子单生成，完全没有说子单已通过验证，更没有说成交价等于 S。
            R<sub>t</sub> 可能是合格成交，也可能按经纪商披露使用报价；是否覆盖盘前盘后、触发条件存放在哪里、延迟多长，都必须查产品条款。
          </p>
        </div>
        <p>
          Buy stop 也不能被遗漏。空头可以把买入 stop 用作风险控制，突破策略也可能在价格上穿阈值后建立多头。
          所以 Stop 描述的是状态依赖的子单生成条件，不等于“卖出止损”。它既不判断突破是真是假，也不评估基本面，只在观测条件满足后尝试执行预先承诺的转换。
        </p>
      </section>

      <section className="lesson-section" id="stop-risk">
        <p className="section-kicker">08 · Stop 的两种失败方式</p>
        <h2>Stop-Market 会错在价格；Stop-Limit 会错在退出——“更安全”必须先说明安全在哪个维度</h2>
        <p>
          假设投资者持有股票，设置卖出 stop 100 元，并采用标准成交触发。市场在 100.20 元后出现 97.10 元的合格成交，条件由此满足；
          假设生成的市价子单通过验证时，最高可执行买价为 97 元。Stop-Market 子单可能在 97 元附近或更差价格执行；100 元从来不是损失上限。
          FINRA 对波动市场的风险说明明确指出，短暂波动可以触发 stop，实际执行价可能显著偏离触发价，而价格之后甚至可能反弹。<Cite n={6} />
        </p>
        <p>
          若改成 stop 100、sell limit 99.50，触发后生成一张最低卖价 99.50 的候选限价子单；假设它通过验证，面对 97 元最高买价仍不会立即成交；
          如果价格继续下跌，投资者仍持有全部风险。Stop-Limit 不是全面升级版，它只是用不成交风险替换触发后的价格风险。
          做选择前应问：我的硬约束是“今天必须解除仓位”，还是“低于某价格宁愿继续持有”？答案不同，不能共享同一张默认订单。
        </p>
        <div className="table-scroll" role="region" aria-label="Stop-Market 与 Stop-Limit 在跳空中的比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix stop-risk-table">
            <caption>同一触发价，不同的候选子单与验证后授权</caption>
            <thead><tr><th scope="col">指令</th><th scope="col">触发后生成</th><th scope="col">优先保护</th><th scope="col">跳空时的主要失败</th></tr></thead>
            <tbody>
              <tr><th scope="row">Sell Stop-Market @ 100</th><td>市价卖单</td><td>尽快退出的机会</td><td>成交价可远低于 100</td></tr>
              <tr><th scope="row">Sell Stop-Limit @ 100 / L=99.50</th><td>99.50 元卖出限价单</td><td>最低可接受卖价</td><td>97 元市场中可能完全不成交</td></tr>
            </tbody>
          </table>
        </div>
        <aside className="precision-note">
          <span>不要从 Stop 的个体机制直接跳到“止损必然制造暴跌”</span>
          <p>
            许多同方向 Stop 在相近阈值触发，确实可能生成额外主动订单并消耗深度，形成价格下跌—更多触发—更多卖出的正反馈。
            Osler 结合 1996–1998 年 Reuters 分钟报价与 1999–2000 年 Royal Bank of Scotland 条件订单聚集证据，得到与 stop 促成价格级联假说一致的结果；
            作者同时明确说明统计设计不能单独证明因果，更不能证明所有资产、所有时期都存在同样强度。<Cite n={16} />
            这里把它作为 1.08 Order Flow 与 1.09 Price Impact 的接口，而不是普遍规律。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="tif">
        <p className="section-kicker">09 · Time-in-Force 与数量约束</p>
        <h2>价格条件决定“能以什么价格成交”，生存条件决定“没有成交以后怎么办”</h2>
        <p>
          同一张买入限价 100.01 元、数量 600 股的订单，如果当下只有 200 股可在 100 元成交，剩余 400 股的命运取决于额外属性。
          DAY 通常让剩余部分在当日继续有效；GTC（good-til-cancelled）试图跨日保留，实际最长存续、公司行动处理与定期取消取决于经纪商和场所；
          IOC（immediate-or-cancel）允许当下能成交的部分完成，余量立即撤销；FOK（fill-or-kill）要求立即完整成交，否则整张撤销。<Cite n={18} />
        </p>
        <div className="modifier-grid">
          <article><span>DAY</span><b>当日有效</b><p>未成交部分通常留到本交易日规则规定的到期点；不等于跨日保留。</p></article>
          <article><span>GTC</span><b>撤销前有效</b><p>名称不代表无限寿命；券商可以设最长期间或定期确认机制。</p></article>
          <article><span>IOC</span><b>立即成交，否则撤余</b><p>允许部分成交，故完成量可以处于 0 与目标数量之间。</p></article>
          <article><span>FOK</span><b>立即全成，否则全撤</b><p>不允许部分成交，故完成量只能是 0 或全部数量。</p></article>
        </div>
        <p>
          IOC 与 FOK 的差异尤其容易被抹平：两者都不等待，但 IOC 允许部分成交，FOK 不允许。
          现实中还存在 All-or-None、minimum quantity、opening/closing-only 等数量或时段条件；它们的定义、可见性和兼容组合并不跨市场统一。
          深交所把“即时成交剩余撤销”和“全额成交或撤销”列入特定市价申报形态，其经济效果分别近似 IOC 与 FOK，仍不应假定字段实现与美国市场完全相同。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="layers">
        <p className="section-kicker">10 · 同名订单的三层语义</p>
        <h2>客户按钮、券商订单管理系统与交易所撮合消息必须分开审查</h2>
        <p>
          客户先与经纪商建立订单合同，经纪商再决定如何验证、托管条件、分拆、内部化或路由；交易所只接收其规则允许的原生消息。
          因而，券商提供 Stop 不等于 Stop 原样驻留在交易所订单簿，券商把 GTC 展示给客户也不等于一条永不过期的交易所消息持续存在。
          这一层级区分可以用三问固定下来：谁观察触发条件？触发后生成什么消息？最终哪个场所按哪套规则处理？
        </p>
        <div className="market-stack order-layer-stack">
          <article><span>01</span><b>客户委托</b><p>表达目标、触发阈值、限价、有效期与授权范围；受券商合同和适当性规则约束。</p></article>
          <article><span>02</span><b>券商订单管理</b><p>执行风控、条件监测、智能路由、拆分、内部撮合或转换为场所可接受字段。</p></article>
          <article><span>03</span><b>交易场所原生订单</b><p>按自身类型、属性、价格保护、优先级和交易阶段验证、挂簿或撮合。</p></article>
          <article><span>04</span><b>成交与回报</b><p>部分或全部成交、取消和拒绝回传后，客户看到的是多层处理的最终结果。</p></article>
        </div>
        <p>
          这也解释了跨资产语义为何容易出错。CME Globex 的 Market with Protection 只在系统预设保护区间内扫取流动性，未成交数量会在保护边界转为限价兴趣；
          Stop with Protection 触发后也有系统计算的保护范围。<Cite n={10} /> 这种机制不能套用“市价单会无限扫完整本订单簿”的教科书想象，
          也不能反过来推断所有股票市场都采用同样保护参数。产品、接入方式和交易场所才是规则的作用域。
        </p>
      </section>

      <section className="lesson-section" id="china-rules">
        <p className="section-kicker">11 · 2026 沪深规则边界</p>
        <h2>A 股“市价申报”是一组制度化指令，不等于没有任何价格或数量保护的抽象 Market Order</h2>
        <p>
          自 2026 年 7 月 6 日施行的上交所交易规则同时接受限价与市价申报，并列出最优五档即时成交剩余撤销、最优五档即时成交剩余转限价、
          本方最优和对手方最优等市价形态。每笔市价申报还须包含买入最高或卖出最低保护限价，成交价与转限价价格不得越过保护边界；市价申报原则上用于连续竞价期间。<Cite n={8} />
          尤其是“本方最优价格申报”可能按本方报价形成等待兴趣，这证明法规标签中的“市价申报”不能机械翻译为无价、立刻扫簿。
        </p>
        <p>
          同期深交所规则也接受限价与市价申报，但列举的市价形态与控制方式并不完全相同，包括对手方最优、本方最优、最优五档即时成交剩余撤销、
          即时成交剩余撤销和全额成交或撤销；市价申报限于有涨跌幅限制证券的连续竞价，缺少相应对手或本方申报时，部分类型会自动撤销。<Cite n={9} />
          深交所一般规则没有照抄上交所对每张市价申报填写统一保护限价字段的安排，不能把“沪深规则一致”当成默认前提。
        </p>
        <div className="table-scroll" role="region" aria-label="沪深市价申报机制边界，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix china-order-table">
            <caption>这里比较的是一般股票竞价规则，不覆盖所有证券品种</caption>
            <thead><tr><th scope="col">问题</th><th scope="col">上交所 2026</th><th scope="col">深交所 2026</th></tr></thead>
            <tbody>
              <tr><th scope="row">基本申报分类</th><td>限价申报与规则列举的市价申报</td><td>限价申报与规则列举的市价申报</td></tr>
              <tr><th scope="row">连续竞价限制</th><td>市价原则上适用于连续竞价</td><td>限有涨跌幅限制证券的连续竞价</td></tr>
              <tr><th scope="row">统一保护限价字段</th><td>规则明确要求市价申报填写保护限价</td><td>一般规则没有同样的统一字段要求</td></tr>
              <tr><th scope="row">无对手流动性</th><td>依具体类型撤销或按规则转为限价</td><td>依具体类型与报价状态自动撤销</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          本节查阅的两所现行一般股票竞价规则，在明示申报类型中均未列出普通 Stop/Stop-Limit；但规则保留交易所另行规定其他类型或方式的空间，
          仅凭基础规则不能穷尽全部专项规则与接口。<Cite n={8} /><Cite n={9} /> 券商软件中的“条件单、止盈止损”究竟由客户端、券商系统还是其他设施监测，必须查具体产品合同。
          只有当某项条件单在阈值满足后才生成沪深交易主机可接受的限价或市价申报时，它才不等同于休眠在交易主机中的原生 stop。
          这一边界只针对本节查阅的沪深 A 股一般竞价规则，不能外推到期货、期权、港股通、其他证券品种或特定券商实现。
        </p>
        <aside className="precision-note">
          <span>涨跌停限制价格，不承诺流动性</span>
          <p>
            股票跌到允许价格下限时，如果卖方已有巨量排队、买方为空，新卖单只能等待或按所选市价类型被撤销，不能因“已经触及止损位”就获得买方。
            价格边界回答能以什么价格成交；是否存在对手方回答能不能成交。把两者混在一起，是 A 股风险管理中最危险的误解之一。
          </p>
        </aside>
      </section>

      <OrderInstructionLab />

      <section className="lesson-section" id="feedback">
        <p className="section-kicker">13 · 从个体选择到系统反馈</p>
        <h2>订单类型是个人控制规则，也是其他参与者看到的市场状态变化</h2>
        <p>
          对单个交易者来说，订单选择是在自己的价格、时间与完成约束之间分配风险；对整个市场来说，它同时改变下一位参与者面对的状态。
          主动订单消耗已有深度、产生交易记录并可能移动 best bid 或 ask；被动限价单增加可见或隐藏的等待流动性；撤单又移除原先看似可用的承诺。
          后来的交易者观察到价差、深度与成交变化，再重新决定自己应当主动还是等待。于是，订单选择不是彼此独立的静态偏好，而是状态—行为—新状态的反馈循环。
        </p>
        <div className="mechanism-chain" aria-label="订单类型选择形成系统反馈的因果链">
          {[
            ['市场状态', '价差、深度、队列与波动'],
            ['交易者约束', '紧迫度、保留价格与完成期限'],
            ['订单选择', '主动索取、被动等待或条件触发'],
            ['直接结果', '成交、部分成交、挂单、撤销或失败'],
            ['状态更新', '深度减少或补充，报价与成交历史变化'],
            ['他人适应', '重新报价、追单、撤单、路由或推迟交易'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          但这里必须维持研究纪律。观察到市价卖单后价格下跌，不足以证明市价单“造成了全部下跌”：同一条信息可能同时引发估值下调、撤销买单和主动卖出；
          执行还可能发生在多个场所。1.08 会把订单事件聚合为 order flow，1.09 再区分机械消耗、选择效应与信息影响。本节只建立单个指令怎样进入这条链。
        </p>
      </section>

      <section className="lesson-section" id="failure-modes">
        <p className="section-kicker">14 · 边界、反例与危险表述</p>
        <h2>真正理解订单类型，意味着能识别一句话在哪个条件下才成立</h2>
        <p>下面是一份可快速浏览的复盘索引，不要求再次逐条精读；遇到真实订单时，用它检查自己是否把触发、价格边界、市场状态与场所实现混成了一个概念。</p>
        <div className="myth-grid order-myth-grid">
          <article><span>误解 01</span><b>“市价单按 last price 成交。”</b><p>Last price 是历史；新订单面对抵达时仍可用的对手报价与深度。</p></article>
          <article><span>误解 02</span><b>“市价单无条件保证全部成交。”</b><p>它优先即时性，但停牌、无流动性、保护机制与拒绝仍可能阻止完成。</p></article>
          <article><span>误解 03</span><b>“限价单只能在限价成交。”</b><p>限价是最差边界；买入可以更低、卖出可以更高。</p></article>
          <article><span>误解 04</span><b>“限价单都在提供流动性。”</b><p>Marketable limit 会立即消耗对手挂单；只有等待的限价兴趣典型地提供流动性。</p></article>
          <article><span>误解 05</span><b>“市场触及限价，我就一定成交。”</b><p>还取决于场所、队列、对手流量、隐藏量、路由、撤销与有效期。</p></article>
          <article><span>误解 06</span><b>“Stop price 是保证离场价。”</b><p>它是状态触发阈值；最终成交取决于触发后的子单与当时流动性。</p></article>
          <article><span>误解 07</span><b>“Stop-Limit 总比 Stop-Market 安全。”</b><p>它减少越价，却可能在需要退出时完全不成交；安全维度不同。</p></article>
          <article><span>误解 08</span><b>“券商有 Stop，交易所就原生保存 Stop。”</b><p>条件可能由券商托管；触发后才生成候选普通子单，并须通过场所当时的验证。</p></article>
          <article><span>误解 09</span><b>“IOC 与 FOK 都不能部分成交。”</b><p>IOC 允许当下部分成交后撤余；FOK 要么立即全成，要么全撤。</p></article>
          <article><span>误解 10</span><b>“触及涨跌停就能执行止损。”</b><p>价格限制不创造对手方；空买盘下，允许价格上的卖单仍无法成交。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="decision">
        <p className="section-kicker">15 · 决策框架</p>
        <h2>不要先选订单名称；先写清自己最不能接受哪一种失败</h2>
        <p>
          面对真实交易，最有用的起点不是“市价还是限价”，而是把任务写成可审计约束：交易是否必须完成；最晚何时完成；最高买价或最低卖价是否硬约束；
          允许多大部分成交；若不成交，放弃任务还是之后追价；意图可以公开多久；在哪个产品、时段与场所执行。
          只有这些问题回答清楚，订单字段才能与经济目标一一对应。
        </p>
        <div className="fit-grid decision-grid">
          <article><span>约束 A</span><b>完成是否硬性</b><p>对冲或强制再平衡的未成交会留下风险；可选择投资的未成交可能只是保留现金。</p></article>
          <article><span>约束 B</span><b>价格是否硬性</b><p>若越过保留价格会破坏策略价值，应使用可验证边界；但要接受不成交。</p></article>
          <article><span>约束 C</span><b>时间是否硬性</b><p>几秒、当日与数周的等待成本完全不同，决定被动策略是否可行。</p></article>
          <article><span>约束 D</span><b>最坏状态是什么</b><p>薄簿、跳空、停牌、跌停无买盘和触发延迟，才是检验指令是否一致的情景。</p></article>
        </div>
        <blockquote>
          一个好的订单选择，不是平均情形下看起来最聪明，而是在最坏可行状态中仍然忠实执行你的硬约束。先写“我宁愿承受什么”，再把它翻译成订单。
        </blockquote>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">16 · 主动练习 · 约 30 分钟</p>
        <h2>先独立写出状态与失败方式，再展开解析</h2>

        <div className="practice-card">
          <span>练习一 · 状态分类 · 7 分钟</span>
          <p>
            当前 bid/ask = 99.98 / 100.02。假设以下订单均通过券商与场所初始验证；对于两张 Stop，另假设采用标准成交触发，且从订单创建起从未出现不高于 98.50 的合格成交。
            分别判断它们被接受后的状态属于 dormant、active-aggressive 还是 active-resting，并写出核心剩余风险：
            Buy market 200；Buy limit 100.05；Buy limit 100.00；Sell stop-market 98.50；Sell stop-limit，stop 98.50、limit 98.20。
          </p>
          <details><summary>查看解析</summary><div>
            <p>
              初始验证通过后，Buy market 与 Buy limit 100.05 都进入 active-aggressive，前者承担价格不确定性，后者只允许成交到 100.05；Buy limit 100.00 低于 ask，进入 active-resting，承担等待与不成交风险。
              两张 sell stop 被接受后进入 dormant，因为从创建起尚无合格成交触发；Stop-Market 触发并生成通过验证的子单后承担成交价风险，Stop-Limit 子单还要看 98.20 限价是否可执行。98.50 是 trigger，98.20 才是卖价下限。
            </p>
          </div></details>
        </div>

        <div className="practice-card">
          <span>练习二 · 订单簿算术 · 8 分钟</span>
          <p>
            卖盘为 200 股 @100.00、500 股 @100.02、1,000 股 @100.05。比较买入 600 股的 Market、Limit 100.03 与 Limit 100.01：
            分别计算成交数量、VWAP、最差成交价和余量。再说明 DAY 与 IOC 会怎样改变 Limit 100.01 的剩余部分。
          </p>
          <details><summary>查看解析</summary><div>
            <p>
              Market 与 Limit 100.03 都可先成交 200@100.00 和 400@100.02，合计 600 股，VWAP 约为 100.0133，最差成交价 100.02；
              差别是后者明确禁止超过 100.03。Limit 100.01 只能成交 200@100.00，剩余 400 股不能接受 100.02：DAY 通常让余量以 100.01 等待，IOC 则立即撤销余量。
            </p>
          </div></details>
        </div>

        <div className="practice-card">
          <span>练习三 · 跳空反事实 · 7 分钟</span>
          <p>
            你持有股票并设置 sell stop 95，或 sell stop-limit：stop 95、limit 94.50。隔夜后第一笔符合触发定义的成交为 90，当前最高买价 89.80。
            假设两张条件单已通过初始验证并处于 DORMANT，触发后生成的候选子单也通过验证。从 DORMANT 开始写出两张订单的后续完整状态路径。
            如果任务是当日必须解除风险，哪一种失败更不可接受？若你宁愿持有也绝不低于 94.50 卖出，答案是否改变？
          </p>
          <details><summary>查看解析</summary><div>
            <p>
              两条完整路径都从 DORMANT → TRIGGER EVENT → CHILD VALIDATION 开始，并在本题假设子单通过验证。Sell stop 的市价子单随后进入 ACTIVE-AGGRESSIVE，可能在 89.80 或之后可得价格成交，95 不是执行保证；
              Sell stop-limit 的最低卖价 94.50 子单进入 ACTIVE-RESTING，面对 89.80 不能立即成交并继续等待。
              必须当日退出的任务更不能接受后者的不成交；把 94.50 设为不可突破保留价的任务则应接受继续持仓。订单没有改变，对不同结果赋予的损失权重与硬约束改变了选择。
            </p>
          </div></details>
        </div>

        <div className="practice-card">
          <span>练习四 · 执行备忘录提纲 · 8 分钟</span>
          <p>
            从三个任务任选一个：今日必须完成的指数对冲；只有折价足够大才愿意建立的价值仓位；突破某一价格才建立的多头。
            写下完成期限、最高/最低可接受价格、是否允许不成交、是否允许部分成交、触发依据、最坏可能状态，以及你选择的激活条件、价格边界与 TIF。
          </p>
          <details><summary>查看评价标准</summary><div>
            <p>
              本题没有唯一订单名称。合格答案必须让每个字段都能追溯到一个经济约束，并主动写出被牺牲的维度。
              若只写“对冲用市价、价值投资用限价、突破用 stop”而没有讨论规模、深度、价格保护、有效期与失败状态，仍然只是标签匹配。
            </p>
          </div></details>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">17 · 理解检查</p>
        <h2>如果你能解释订单的状态转换，就不需要靠背诵菜单</h2>
        <details><summary>1. 为什么“市价单换成交确定性、限价单换价格确定性”仍然不够精确？</summary><p>因为两者都没有无条件保证。市价单只是把即时执行放在自设价格边界之前，仍可能受停牌、无流动性和保护机制影响；限价单只保证已成交价格不越界，不保证在期限内成交。更准确的说法是它们提高不同维度的控制并允许不同失败。</p></details>
        <details><summary>2. 买入限价 100.03 为什么可能是流动性需求，也可能是流动性供给？</summary><p>若抵达时 best ask≤100.03，它会立即与卖盘成交，属于主动索取；若 best ask 已高于 100.03，它不能成交，可能进入等待并提供买方报价。经济角色由限价相对抵达状态决定。</p></details>
        <details><summary>3. Stop price、limit price 与 execution price 的区别是什么？</summary><p>Stop price 决定何时启动子单生成；Stop-Limit 的 limit price 约束候选限价子单通过验证后的成交边界；execution price 是子单最终获得的实际成交价。三者可以不同，子单也可能被拒绝或完全不成交。</p></details>
        <details><summary>4. IOC 与 FOK 最关键的区别是什么？</summary><p>两者都要求立即处理，但 IOC 允许能成交的部分完成后撤销余量，FOK 则要求立即完整成交，否则整张撤销。</p></details>
        <details><summary>5. 为什么价格触及限价仍不能证明你的订单应当成交？</summary><p>成交还要满足同一场所实际存在对手流量并轮到你的优先级；碎片化市场、队列前方数量、隐藏单、路由、撤销、延迟和订单有效期都可能改变结果。</p></details>
        <details><summary>6. 为什么券商软件显示 Stop 不能证明交易所原生接受 Stop？</summary><p>券商可以在自身系统保存条件，达到阈值后才生成交易所允许的 market 或 limit 消息。客户合同、券商订单管理与场所原生订单处于不同层。</p></details>
        <details><summary>7. A 股跌停价为什么不是“保证退出价”？</summary><p>涨跌停规定允许成交的价格区间，不创造买方。若跌停卖队巨大且无买盘，卖出指令只能排队或按具体类型撤销，仍无法完成。</p></details>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">18 · 与整套课程的接口</p>
        <h2>订单定义了行动规则；订单簿、订单流和价格冲击决定这些行动怎样汇合</h2>
        <p>
          1.04 会接过本节留下的 waiting state，解释 bid、ask、price level、queue、depth 与 price-time priority 怎样决定限价单的执行权；
          1.08 会把新增、撤销和成交从单个事件聚合成方向性 order flow，并研究其信息含量；1.09 再区分逐档执行、暂时冲击、永久影响与识别问题。
          2.08 HFT 会重新讨论延迟为何让“提交时可成交”与“抵达时可成交”分离，7.19 则把订单指令放回完整 market state 中。
        </p>
        <blockquote>
          本节最终心智模型：交易意图先被编码成状态依赖授权；订单抵达后与市场状态共同决定其激活、可成交性和剩余命运；每一种价格保护都对应某种执行风险，
          每一种即时性要求也对应某种价格或信息成本。没有无风险订单，只有与任务约束一致或不一致的订单。
        </blockquote>
      </section>
    </>
  );
}

export const lesson103: LessonRecord = {
  slug: '1-03',
  id: '1.03',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: '订单如何把意图变成行动',
  subtitle: 'Order Types：Market、Limit、Stop 与状态依赖的风险交换',
  readingTime: '约 80–90 分钟（核心阅读 45–50＋互动 10＋练习 25–30）',
  prerequisite: '1.02 · 交易所怎样组织交易；按需回看 T07 证券与衍生品最小基础',
  updatedAt: '2026-08-28',
  revision: '1.03-r5',
  reviewStatus: 'double-reviewed',
  previous: { slug: '1-02', label: '1.02 交易所怎样组织交易' },
  next: { slug: '1-04', label: '1.04 Limit Order Book 的结构' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.03-r1',
      summary: '要求拆分 Stop 触发成交、激活后买价与执行，收窄 A 股制度推论，并校正协议耦合、书目年份、Osler 样本及 CME 引用。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.03-r1',
      summary: '要求统一 Market、Limit 与 Stop 的状态语法，重构双预测交互，补足术语、辅助功能、薄簿反例与可验证学习时长。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.03-r2',
      summary: 'r1 问题均已解决；进一步要求把验证与拒绝放在 ACTIVE 之前，并纠正 VWAP 四位舍入的文案与约等号。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.03-r2',
      summary: '统一状态语法、双预测交互、术语、薄簿反例、辅助功能、练习时长和阅读路径均通过教学复核。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.03-r3',
      summary: '初始与子单验证分支、VWAP 精度已修正；要求 Stop 专节同步区分触发、子单验证与 ACTIVE。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.03-r3',
      summary: '要求 Stop 正文、状态练习、跳空练习和普通订单互动全部复用新增的 VALIDATION 分支。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.03-r4',
      summary: 'Stop 专节、验证分支、风险案例、互动变量和两条路径算术均通过最终事实复核。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.03-r4',
      summary: '要求在 Stop 预测前明示子单通过验证的情景假设，并限定跳空练习完整路径的起点。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.03-r5',
      summary: '现行规则、状态语义、公式、VWAP、两组订单簿计算及 Stop 连续/跳空路径均通过最终事实复核。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.03-r5',
      summary: '统一状态语法、双预测、验证前提、零基础术语、主动练习、移动端与辅助功能均通过最终教学复核。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'anatomy', label: '从意图到消息' },
    { id: 'dimensions', label: '订单的五个维度' },
    { id: 'market', label: 'Market Order' },
    { id: 'limit', label: 'Limit Order' },
    { id: 'marketability', label: 'Marketability' },
    { id: 'total-cost', label: '完整执行成本' },
    { id: 'stop-machine', label: 'Stop 状态机' },
    { id: 'stop-risk', label: 'Stop 的失败方式' },
    { id: 'tif', label: 'TIF 与数量条件' },
    { id: 'layers', label: '同名订单三层语义' },
    { id: 'china-rules', label: '沪深规则边界' },
    { id: 'order-lab', label: '互动指令实验' },
    { id: 'feedback', label: '系统反馈接口' },
    { id: 'failure-modes', label: '边界与危险表述' },
    { id: 'decision', label: '决策框架' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson103Content,
  references: [
    {
      id: 1,
      authors: 'Larry Harris',
      year: '2002',
      title: 'Orders and Order Properties (Chapter 4)',
      publication: 'Trading and Exchanges, Oxford University Press, pp. 68–88',
      url: 'https://doi.org/10.1093/oso/9780195144703.003.0004',
      use: '订单作为交易策略的机器指令；Market、Limit、Stop 与订单属性的基础分类。旧版专著不用于代表任何现代场所的现行参数。',
    },
    {
      id: 2,
      authors: 'Thierry Foucault, Marco Pagano & Ailsa Röell',
      year: '2023',
      title: 'Limit Order Book Markets (Chapter 6)',
      publication: 'Market Liquidity, 2nd ed., Oxford University Press, pp. 201–248',
      url: 'https://doi.org/10.1093/oso/9780197542064.003.0006',
      use: '执行概率、主动与被动订单、等待成本、流动性供给和被挑中风险的现代综述。模型比较静态不作为现实市场的固定系数。',
    },
    {
      id: 3,
      authors: 'U.S. Securities and Exchange Commission, Investor.gov',
      year: 'current investor guidance',
      accessedAt: '2026-08-28',
      title: 'Types of Orders',
      publication: 'Investor.gov',
      url: 'https://www.investor.gov/introduction-investing/investing-basics/how-stock-markets-work/types-orders',
      use: '美国零售语境下 Market、Limit、Stop 与 Stop-Limit 的标准入门定义，以及最近成交价不等于市场单执行价。正文对“保证成交”作了跨场所专业限定。',
    },
    {
      id: 4,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2011',
      accessedAt: '2026-08-28',
      title: 'Investor Bulletin: Trading Basics — Understanding the Different Ways to Buy and Sell Stock',
      publication: 'SEC Office of Investor Education and Advocacy',
      url: 'https://www.sec.gov/files/trading101basics.pdf',
      use: '市场单多价成交、限价作为最差边界、Stop 触发价并非执行价、Stop-Limit 的不成交风险，以及 DAY/GTC/IOC/FOK 的投资者教育定义。',
    },
    {
      id: 5,
      authors: 'Financial Industry Regulatory Authority',
      year: 'current rule',
      accessedAt: '2026-08-28',
      title: 'FINRA Rule 5350 — Stop Orders',
      publication: 'FINRA Rulebook',
      url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/5350',
      use: '标准 Stop 与 Stop-Limit 的交易触发定义，以及采用替代触发事件时必须区分名称并披露的规则边界。',
    },
    {
      id: 6,
      authors: 'Financial Industry Regulatory Authority',
      year: '2025',
      accessedAt: '2026-08-28',
      title: 'Stop Orders: Factors to Consider During Volatile Markets',
      publication: 'FINRA Investor Insights',
      url: 'https://www.finra.org/investors/insights/stop-orders-factors-consider-during-volatile-markets',
      use: '波动环境中 Stop 可能被短暂波动触发、成交价偏离触发价，以及 Stop-Limit 以不成交风险换取价格边界。',
    },
    {
      id: 7,
      authors: 'U.S. Electronic Code of Federal Regulations',
      year: 'current through 2026',
      accessedAt: '2026-08-28',
      title: '17 CFR § 242.600 — Definitions',
      publication: 'Regulation NMS',
      url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-242/section-242.600',
      use: '美国股票监管语境中 marketable limit 相对 NBB/NBO 的定义。该统计与监管口径不替代具体场所完整撮合协议。',
    },
    {
      id: 8,
      authors: '上海证券交易所',
      year: '2026',
      accessedAt: '2026-08-28',
      title: '上海证券交易所交易规则（2026年修订）',
      publication: '自 2026-07-06 起施行；重点条款 3.2.8、3.3.3–3.3.6',
      url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml',
      use: '上交所限价与市价委托定义、市价申报形态、保护限价以及连续竞价适用边界。只用于对应证券与本规则版本。',
    },
    {
      id: 9,
      authors: '深圳证券交易所',
      year: '2026',
      accessedAt: '2026-08-28',
      title: '深圳证券交易所交易规则（2026年修订）',
      publication: '自 2026-07-06 起施行；重点条款 3.2.5、3.3.3–3.3.7、3.3.16',
      url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf',
      use: '深交所市价申报形态、适用时段、无报价处理与限价有效申报范围；用于说明沪深规则不可机械视为相同。',
    },
    {
      id: 10,
      authors: 'CME Group',
      year: 'current product guidance',
      accessedAt: '2026-08-28',
      title: 'CME Glossary — Market with Protection and Stop with Protection',
      publication: 'CME Group glossary',
      url: 'https://www.cmegroup.com/education/glossary',
      use: 'Market with Protection 与 Stop with Protection 的保护区间、余量转为限价以及产品可用性边界；具体范围仍须逐产品核实。',
    },
    {
      id: 11,
      authors: 'Thierry Foucault',
      year: '1999',
      title: 'Order Flow Composition and Trading Costs in a Dynamic Limit Order Market',
      publication: 'Journal of Financial Markets, 2(2), 99–134',
      url: 'https://doi.org/10.1016/S1386-4181(98)00012-3',
      use: '限价单在价格改善、不成交和报价过时后被挑中之间的结构性权衡。理论假设不当作任意市场的实证参数。',
    },
    {
      id: 12,
      authors: 'Christine A. Parlour',
      year: '1998',
      title: 'Price Dynamics in Limit Order Markets',
      publication: 'Review of Financial Studies, 11(4), 789–816',
      url: 'https://doi.org/10.1093/rfs/11.4.789',
      use: '订单选择与订单簿状态、执行概率的内生互动；不从简化的一 tick 理论市场直接估计现实 fill probability。',
    },
    {
      id: 13,
      authors: 'Lawrence Harris & Joel Hasbrouck',
      year: '1996',
      title: 'Market vs. Limit Orders: The SuperDOT Evidence on Order Submission Strategy',
      publication: 'Journal of Financial and Quantitative Analysis, 31(2), 213–231',
      url: 'https://doi.org/10.2307/2331180',
      use: '必须交易与可以不交易的主体需要不同的未成交惩罚；早期 NYSE 样本结论不外推为现代普遍最优策略。',
    },
    {
      id: 14,
      authors: 'Andrew W. Lo, A. Craig MacKinlay & June Zhang',
      year: '2002',
      title: 'Econometric Models of Limit-Order Executions',
      publication: 'Journal of Financial Economics, 65(1), 31–71',
      url: 'https://doi.org/10.1016/S0304-405X(02)00134-4',
      use: '首次成交与完成时间的区别，以及限价执行时间对价格与市场状态的依赖。历史美国样本不用于给出现代 A 股概率。',
    },
    {
      id: 15,
      authors: 'André F. Perold',
      year: '1988',
      title: 'The Implementation Shortfall: Paper versus Reality',
      publication: 'Journal of Portfolio Management, 14(3), 4–9',
      url: 'https://doi.org/10.3905/jpm.1988.409150',
      use: '把真实成交与未成交机会成本放在同一决策价格基准下；该框架不宣称某种订单普遍占优。',
    },
    {
      id: 16,
      authors: 'Carol L. Osler',
      year: '2005',
      title: 'Stop-loss Orders and Price Cascades in Currency Markets',
      publication: 'Journal of International Money and Finance, 24(2), 219–241',
      url: 'https://doi.org/10.1016/j.jimonfin.2004.12.002',
      use: '1996–1998 年 Reuters 分钟报价与 1999–2000 年 RBS 条件订单聚集证据，与 stop 促成级联的假说一致；统计设计不能单独证明因果。',
    },
    {
      id: 17,
      authors: 'Nasdaq Stock Market',
      year: 'current rule',
      accessedAt: '2026-08-28',
      title: 'Nasdaq Equity 4 — Rules 4702 and 4703',
      publication: 'Nasdaq Rulebook',
      url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/nasdaq-equity-4',
      use: 'Order Type 与 Order Attribute 的规则分层，以及 Time-in-Force 等属性的场所语义；不用于概括其他交易所。',
    },
    {
      id: 18,
      authors: 'Financial Industry Regulatory Authority',
      year: '2024',
      accessedAt: '2026-08-28',
      title: 'Time Parameters and Qualifiers for Stock Orders',
      publication: 'FINRA Investor Insights',
      url: 'https://www.finra.org/investors/insights/time-parameters-qualifiers-stock-orders',
      use: 'DAY、GTC、IOC 与 FOK 的时间和数量限定含义，以及可用选项取决于经纪商与市场。',
    },
    {
      id: 19,
      authors: 'Bruno Biais, Pierre Hillion & Chester Spatt',
      year: '1995',
      title: 'An Empirical Analysis of the Limit Order Book and the Order Flow in the Paris Bourse',
      publication: 'Journal of Finance, 50(5), 1655–1689',
      url: 'https://doi.org/10.1111/j.1540-6261.1995.tb05192.x',
      use: '订单进攻性、价差、深度和既有订单簿状态的实证互动；早期巴黎制度样本不代表现代碎片化市场参数。',
    },
  ],
  readingList: [
    {
      title: 'Trading and Exchanges · Chapter 4',
      scope: '基础 · Harris, pp. 68–88；先读 4.1–4.5，再对照本节状态机',
      reason: '最适合建立订单、订单属性与交易策略之间的统一术语；阅读时主动标注哪些定义是一般机制、哪些实现已经随市场演变。',
      url: 'https://doi.org/10.1093/oso/9780195144703.003.0004',
    },
    {
      title: 'Market Liquidity · Chapter 6',
      scope: '理论进阶 · Foucault, Pagano & Röell；重点 6.4 Limit Order Submission',
      reason: '把主动/被动选择、执行概率、等待和被挑中风险放入现代限价订单簿理论，是从入门定义走向机制模型的桥梁。',
      url: 'https://doi.org/10.1093/oso/9780197542064.003.0006',
    },
    {
      title: 'Econometric Models of Limit-Order Executions',
      scope: '实证方法 · Lo, MacKinlay & Zhang；读引言、制度背景、模型目标与结论',
      reason: '帮助你理解“触及价格”为什么不是执行，以及首次成交、完整成交与删失观测为何要分开。',
      url: 'https://doi.org/10.1016/S0304-405X(02)00134-4',
    },
    {
      title: 'Stop-loss Orders and Price Cascades in Currency Markets',
      scope: '系统反馈 · Osler；先读引言、数据边界与结论',
      reason: '展示个体条件单怎样可能进入系统反馈，也训练你区分特定样本证据、机制解释与跨市场因果外推。',
      url: 'https://doi.org/10.1016/j.jimonfin.2004.12.002',
    },
  ],
};
