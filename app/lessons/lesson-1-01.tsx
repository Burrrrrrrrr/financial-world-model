import MarginalPriceLab from '../components/MarginalPriceLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson101Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>屏幕上的价格，是一次可执行交换的结果，不是“全市场对价值的最终投票”。</h2>
        <p>
          当你看到某只股票最新价是 100 元，最容易产生的直觉是：市场已经计算出这家公司“值 100 元”。
          这个直觉只说对了一半。100 元确实是市场信息的一种高度压缩结果，但它首先是一个交易事实：
          在特定时刻、特定交易场所、特定规则与流动性条件下，至少一侧提交了可立即成交的订单，
          并与一个或多个对手方的存量订单完成了边际上的交换。市场并没有同时询问所有股东、所有潜在投资者，
          也没有直接观察一个客观存在的“真实价值”。
        </p>
        <p>
          市场微观结构研究的起点，正是把投资者心里的潜在需求，连接到屏幕上可观察的成交量与价格。
          Madhavan 对该领域的经典综述将其概括为：研究潜在交易需求如何通过具体交易机制转化成交易结果，
          并考察信息、规则、透明度与流动性如何共同影响价格形成。<Cite n={1} />
          因此，本节要建立的第一块地基不是“价值不重要”，而是一个更精确的判断：
          <strong>价值判断必须先经过主体、约束、订单和撮合规则，才会成为市场价格。</strong>
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>在看到“价格”时，先说明它究竟是报价、成交价、可执行价格、官方收盘价还是估值。</li>
            <li>从一组订单手算连续成交的逐档执行与集合竞价的候选清算价。</li>
            <li>沿着“信息—主体—约束—订单—制度—价格”的链条解释价格变化，并区分暂时交易摩擦与永久信息更新。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>术语精度</span>
          <p>
            在<strong>集合竞价</strong>中，交易所会按场所规则形成一个单一清算价；在<strong>连续竞价</strong>中，
            到达的可成交订单通常逐档匹配存量订单，一笔大单可能得到多个成交价。本节所说的
            “边际成交价”专指连续交易中最后触及的成交价位：连续市场不会在每个时刻收齐全体订单，
            再计算一个全市场统一清算价。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="five-prices">
        <p className="section-kicker">01 · 先拆开六类经常混用的价格信息</p>
        <h2>价值、保留价格、报价、成交价、可执行价与制度价格，不是同一个东西</h2>
        <p>
          初学者之所以容易把“价格”误解成“价值”，一个根本原因是日常语言把几种不同变量都叫作价格。
          专业分析必须先把它们拆开。否则，当新闻说“股价 100 元”、券商软件显示“买一 99.98、卖一 100.02”，
          估值模型又给出“合理价值 120 元”时，我们会误以为其中至少有一个数字必然错误。实际上，它们回答的是不同问题。
        </p>
        <div className="table-scroll" role="region" aria-label="六类价格信息对照表，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">六类经常被统称为价格的信息</caption>
            <thead><tr><th scope="col">概念</th><th scope="col">它回答的问题</th><th scope="col">能否直接观察</th></tr></thead>
            <tbody>
              <tr><th scope="row">估计的基本面或内在价值</th><td>未来现金流在某套概率、增长和折现假设下值多少？</td><td>不能；只能估计</td></tr>
              <tr><th scope="row">保留价格 Reservation Price</th><td>某个主体在当前信息、持仓与约束下，最高愿买或最低愿卖到哪里？</td><td>通常不能完整观察</td></tr>
              <tr><th scope="row">报价 Quote</th><td>当前有人公开愿意按什么价格、多少数量交易？</td><td>部分可观察</td></tr>
              <tr><th scope="row">成交价 Transaction Price</th><td>刚刚实际完成交换的价格是多少？</td><td>成交后可观察</td></tr>
              <tr><th scope="row">可执行价格 Executable Price</th><td>给定方向和订单规模，现在真正能成交到哪些价位？</td><td>只能由当时深度近似</td></tr>
              <tr><th scope="row">制度性价格家族</th><td>官方收盘价、涨跌幅参考价、账户标记价分别按什么规则生成？</td><td>可观察，但不是同一变量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “买一价”是当时最高的公开买价，“卖一价”是最低的公开卖价，两者之间是 bid–ask spread。
          Investor.gov 对 bid 与 ask 的官方解释强调，它们分别对应某一时刻买方愿付的最高价与卖方愿收的最低价。<Cite n={3} /><Cite n={17} />
          但<strong>报价不是成交</strong>：订单可能被撤销，显示数量可能只是总流动性的一部分，其他交易场所还可能存在不同报价。
          同样，<strong>上一笔成交价也不是下一笔保证成交价</strong>。SEC 对市价单的投资者说明明确提醒，
          市价单追求尽快成交而不保证执行价格，大单还可能在多个价位分批成交。<Cite n={2} />
        </p>
        <div className="equation-card">
          <span>个人估值不是市场观测值 · 最小贴现现金流表达</span>
          <div>V<sub>i,t</sub> = Σ<sub>k≥1</sub> E<sub>i,t</sub>[CF<sub>t+k</sub>] / (1 + r<sub>i,t,k</sub>)<sup>k</sup></div>
          <p>
            CF<sub>t+k</sub> 是未来第 k 期现金流，E<sub>i,t</sub> 表示主体 i 在 t 时点的条件预期，
            r<sub>i,t,k</sub> 是其对该期限和风险采用的贴现率。白话说，每个主体都在把自己预期的未来现金流折算回今天。
            现金流分布和贴现方式不同，估值就会不同；更一般的模型会采用其他风险调整方式，本节暂不展开。
            即使估值已形成，是否下单仍要经过资金、仓位、风险限额、交易成本与时间偏好。
          </p>
        </div>
      </section>

      <section className="lesson-section" id="causal-chain">
        <p className="section-kicker">02 · 从判断到价格的完整链条</p>
        <h2>市场价格不是信息的直接函数，而是行为经过交易制度后的输出</h2>
        <p>
          一条宏观新闻不会直接碰触交易所里的数字。它先被不同参与者接收：长期基金可能重估三年现金流，
          高频交易者可能只估计未来几秒的订单流，做市商首先关心自己的库存与被信息优势者交易的风险，
          被动基金甚至可能并不形成新的基本面观点。随后，每个主体把判断与约束合并，选择“不行动、撤单、挂限价单、
          提交市价单或在其他场所交易”。最后，交易协议决定哪些意愿能够相遇，以及以什么顺序成交。
        </p>
        <div className="mechanism-chain" aria-label="价格形成因果链">
          {[
            ['现实与信息', '盈利、政策、新闻、价格本身'],
            ['异质解释', '概率、期限、模型与信念不同'],
            ['目标与约束', '仓位、资金、风险限额、合规'],
            ['订单选择', '方向、价格、数量、时机与场所'],
            ['交易制度', '优先级、撮合、透明度与离散报价'],
            ['成交与报价', 'last、bid、ask、volume 与 depth'],
          ].map(([title, detail], index) => (
            <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>
          ))}
        </div>
        <p>
          这条链解释了一个看似反常的现象：即使所有人都读到同一份财报，价格反应也不会由财报文本唯一决定。
          一位投资者可以认为公司被低估，却因为已经满仓而无法买入；另一位投资者没有改变长期估值，
          却因客户赎回被迫卖出；做市商可能只因为库存过多而下调报价。真正进入价格的不是抽象观点，
          而是<strong>被转化为可执行订单并实际进入撮合的判断</strong>。Muranaga 与 Shimizu 对市场微观结构与流动性的研究也将过程拆为
          “主体决策形成订单”与“执行系统形成结果”两个相连阶段。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="visible-demand">
        <p className="section-kicker">03 · 订单簿只是可见的局部供需</p>
        <h2>“有人愿意买”与“订单已经在这里等待成交”，中间隔着一整套选择</h2>
        <p>
          经济学的需求曲线描述在其他条件不变时，不同价格对应的潜在购买数量；限价订单簿则只是某一瞬间、
          某一交易场所中已经提交且尚未成交或撤销的订单快照。两者可以画成相似的阶梯，却不能当成同一个对象。
          一位基金经理即使认为股票价值 120 元，也可能为了隐藏信息而只在 99 元挂一小笔买单，可能把大单拆开，
          也可能根本不在这个交易场所显示。订单簿因此不是全体投资者内心估值的透明投票箱，而是策略选择后的可见子集。
        </p>
        <div className="state-sequence" aria-label="报价和成交的四步状态变化">
          <article><span>T0</span><b>初始状态</b><p>last = 100.00；bid/ask = 99.98 / 100.02。成交事实与当前机会集已经不同。</p></article>
          <article><span>T1</span><b>新卖单进入</b><p>有人在 100.01 挂出限价卖单。ask 下移，但没有成交，last 仍是 100.00。</p></article>
          <article><span>T2</span><b>买单撤销</b><p>99.98 的买单被撤，best bid 退到 99.95。报价变差仍不需要发生交易。</p></article>
          <article><span>T3</span><b>可成交买单到达</b><p>它先吃掉 100.01，再触及 100.02；成交价、剩余深度与下一笔机会同时改变。</p></article>
        </div>
        <p>
          这个时间线揭示了两个不同通道。第一条是<strong>成交通道</strong>：主动订单与存量报价匹配，产生 transaction price。
          第二条是<strong>报价通道</strong>：新增挂单、撤单或改价直接改变 bid、ask 与 mid-quote，哪怕没有任何新成交。
          所以“没有交易就没有价格变化”只有在把价格严格限定为 last trade 时才成立；若研究当前可执行机会，报价变化同样重要。
        </p>
        <aside className="precision-note">
          <span>订单簿不包含什么</span>
          <p>
            它通常无法完整呈现尚未提交的意愿、隐藏或冰山数量、其他交易场所的流动性、会随新闻和他人订单即时改变的策略，
            以及信用、资本、库存和风险限额。我们可以把它称为“可见的局部供需阶梯”，不能称为稳定不变的全市场供需函数。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="continuous-auction">
        <p className="section-kicker">04 · 连续竞价中的边际成交</p>
        <h2>最有进攻性的订单，遇到最便宜的可用对手盘</h2>
        <p>
          在典型的订单驱动连续市场里，没有一个拍卖师在每秒钟收齐全体人的供需曲线再宣布均衡价。
          交易者持续提交、修改或撤销订单。未立即成交的限价买单按价格排列成买方队列，
          未立即成交的限价卖单形成卖方队列；许多场所遵循价格优先，再在同价位遵循时间优先。
          当新到达的买单愿意支付至少当前最低卖价，它就成为“可成交订单”，与卖方队列发生撮合。
          价格—时间优先并不是普遍定律；例如 NYSE Group 内部就同时存在 price/time 与 parity/priority，
          分析时必须回到具体场所规则。<Cite n={18} />
        </p>
        <div className="equation-card">
          <span>订单簿的一种最小化表达 · 只描述静态可见深度</span>
          <div>b<sub>t</sub> = max 买方限价　　a<sub>t</sub> = min 卖方限价　　通常 b<sub>t</sub> &lt; a<sub>t</sub></div>
          <p>
            b<sub>t</sub> 是 best bid，a<sub>t</sub> 是 best ask。定义卖方累计显示深度
            D<sup>A</sup><sub>t</sub>(p) = Σ<sub>j: a<sub>j,t</sub>≤p</sub> q<sub>j,t</sub>，也就是从最低卖价累加到 p 为止共有多少股。
            在执行期间订单簿近似静止、忽略隐藏流动性与跨场所路由，且订单规模 q 不超过可见总卖量时，
            最后触及价位可写成 P<sup>last</sup><sub>t</sub>(q) = inf {'{'}p : D<sup>A</sup><sub>t</sub>(p) ≥ q{'}'}。
            inf 在这里就是“累计卖量足以覆盖 q 的最低价格”。若 q 超过可见总量，剩余部分的价格无法由当前快照推出。
          </p>
        </div>
        <p>
          这个表达式的直觉是：小订单只取走最优卖价处的一点数量，大订单则可能“扫过”多个价位。
          所以价格冲击不仅取决于订单规模，也取决于当时订单簿的形状。完全相同的 1,000 股买单，
          在深厚市场里可能不改变最佳卖价，在流动性稀薄时却可能跨越多个档位。
          这也是为什么脱离流动性状态谈“某笔资金应该推动多少价格”通常没有确定答案。
        </p>
        <p>
          这里的“边际”有两层含义。第一，决定新 last price 的是订单最后触及的边际价位，而不是所有持有者估值的平均数。
          第二，只有极少一部分存量股票需要成交，新的成交价便可能被用来标记其余股份的账面价值。
          但这不意味着全部股份都能按该价同时卖出；一旦大量持有者试图兑现，供给曲线和订单簿本身就会改变。
        </p>
      </section>

      <MarginalPriceLab />

      <section className="lesson-section" id="auction">
        <p className="section-kicker">06 · 集合竞价才有更严格的“单一清算价”</p>
        <h2>连续成交与一次性清算，必须分开理解</h2>
        <p>
          在开盘、收盘或停牌重开等集合竞价中，系统先积累一段时间的买卖订单，再根据交易所规则选择一个价格，
          使可成交量最大，并使用预先规定的次级规则处理并列情形。NYSE Group 的官方资料将其部分市场的 indicative match price
          定义为：在竞价价格约束下，可使最大股份数量成交的最佳<strong>指示价格</strong>；它不是最终成交承诺，
          最终竞价成交价还要由对应市场规则和并列处理条款确定。<Cite n={4} />
          因此，集合竞价价格比一笔偶然的小额连续成交更接近“在这一批订单中集中清算”的概念。
        </p>
        <div className="equation-card">
          <span>候选价格 p 上的可成交量</span>
          <div>Q<sup>match</sup>(p) = min[B(p), S(p)]</div>
          <p>
            B(p) 是买入限价不低于 p 的累计买量，S(p) 是卖出限价不高于 p 的累计卖量。
            先对每个候选价计算两边累计量，再找出 Q<sup>match</sup>(p) 最大的价位；如果多个价位并列，不能自行取平均，
            而要使用该交易所规定的失衡、参考价距离或其他次级规则。
            这是只含限价单的最简表达；若竞价允许市场单，符合资格的市场买单和市场卖单应按该场所规则计入相应一侧的累计可成交量。
          </p>
        </div>
        <div className="worked-example">
          <div>
            <span>订单集合</span>
            <p><b>买单：</b>100 股 @ 10.10；100 股 @ 10.00；100 股 @ 9.90</p>
            <p><b>卖单：</b>100 股 @ 9.90；100 股 @ 10.00；100 股 @ 10.10</p>
          </div>
          <table className="auction-table">
            <caption>逐个候选价计算累计买量、累计卖量和可成交量</caption>
            <thead><tr><th scope="col">候选价 p</th><th scope="col">B(p)</th><th scope="col">S(p)</th><th scope="col">可成交量</th></tr></thead>
            <tbody>
              <tr><th scope="row">¥9.90</th><td>300</td><td>100</td><td>100</td></tr>
              <tr className="winner"><th scope="row">¥10.00</th><td>200</td><td>200</td><td>200 · 最大</td></tr>
              <tr><th scope="row">¥10.10</th><td>100</td><td>300</td><td>100</td></tr>
            </tbody>
          </table>
          <p>
            10.00 元使 200 股成交，是这个简化例子的唯一最大量候选价。注意：所有参与清算的成交都使用 10.00 元，
            而不是买方各自的最高愿付价格；买方高于清算价的限价表示价格保护边界，不表示其必须支付该上限。
          </p>
        </div>
        <p>
          但它仍然不是全社会对企业价值的终极共识。参与竞价的只是当时提交订单的人；
          没有下单的长期股东、受限资金、潜在投资者和其他场所的隐性意愿没有被完整纳入。
          竞价规则也会影响结果，例如价格笼子、订单类型、撤单截止时间与指定做市商的参与。
          Madhavan 与 Panchapagesan 对 NYSE 开盘竞价的研究直接显示，开盘价格发现取决于订单演化和制度安排，
          指定交易商观察订单簿并参与稳定的机制会改变价格发现过程。<Cite n={5} />
        </p>
        <aside className="precision-note">
          <span>不可跨市场套用规则</span>
          <p>
            本节用 NYSE 资料说明集合竞价的一般机制，用抽象价格限制说明市场无法继续出清的边界。
            具体的订单资格、撤单时点、优先级、并列规则和官方收盘价形成方式，必须回到相应交易所的现行规则。
          </p>
        </aside>
        <aside className="contrast-card">
          <div><span>连续竞价</span><b>订单逐笔到达、逐档成交</b><p>一笔订单可产生多个成交价；last price 持续更新。</p></div>
          <div><span>集合竞价</span><b>先汇集订单、再选单一价格</b><p>目标通常是最大化可成交量，并按规则处理不平衡与并列。</p></div>
        </aside>
      </section>

      <section className="lesson-section" id="market-cap">
        <p className="section-kicker">07 · 为什么少量成交能重估整家公司</p>
        <h2>市值是边际价格乘以存量，不是可以立即兑现的现金池</h2>
        <p>
          假设公司有 1 亿股已发行在外普通股，其中 6,000 万股可自由流通。价格为 100 元时，
          总市值是 100 亿元，流通市值是 60 亿元；前者使用全部已发行在外股份，后者只使用可自由流通股份。<Cite n={14} />
          如果只有 1,000 股在 101 元成交，数据系统改用 101 元标记，总市值会变成 101 亿元，流通市值变成 60.6 亿元。
          实际二级市场成交金额却只有约 10.1 万元。
        </p>
        <p>
          三种现金或财富变化必须分开。第一，买方向卖方支付的 10.1 万元是<strong>二级市场成交金额</strong>；
          除非这是公司发行新股，公司本身不会因为股东之间换手而收到这笔钱。第二，总市值增加 1 亿元、流通市值增加 6,000 万元，
          是<strong>用新边际价格重新标记存量股份</strong>后的账面变化。第三，每位股东真正可以变现多少，还取决于其卖出规模和届时流动性，
          不能由“持股数 × 当前 last price”无条件兑现。
        </p>
        <p>
          这种标记方法并非错误。它提供了一个统一、及时、可比较的估值基准，并且只要市场足够深，
          小额边际交易往往能合理反映更广泛的可交易条件。错误发生在把“按最后成交价标记的财富”
          当成“全体股东能够同时按该价变现的财富”。如果大股东真的抛售数千万股，
          可用买盘会逐档消耗，价格、其他主体的行为和基本面预期也可能同时变化。
        </p>
        <div className="number-story">
          <div><span>实际交换</span><strong>1,000 股 × ¥101</strong><p>约 10.1 万元成交额</p></div>
          <div><span>总市值标记</span><strong>1 亿股 × ¥101</strong><p>101 亿元；比原来增加 1 亿元</p></div>
          <div><span>流通市值标记</span><strong>6,000 万股 × ¥101</strong><p>60.6 亿元；比原来增加 6,000 万元</p></div>
        </div>
      </section>

      <section className="lesson-section" id="buyers-sellers">
        <p className="section-kicker">08 · 纠正“买的人比卖的人多”</p>
        <h2>每一笔成交的买入量都等于卖出量；不相等的是主动性与可用深度</h2>
        <p>
          对已经完成的每一笔交易，买方数量和卖方数量在股数上必然相等：没有卖方交出 500 股，
          买方就不可能得到 500 股。因此，“上涨因为买的人比卖的人多”若被理解为成交量一边多、一边少，
          在会计恒等式上是错误的。一个买家可以从十个卖家手里买入，也可以十个买家共同接走一个卖家的订单；
          人头数本身没有稳定解释力。
        </p>
        <p>
          暂时把订单簿视为固定时，更精确的说法是：愿意<strong>立即跨过价差</strong>的可成交买单会消耗卖方深度；
          如果最优卖价数量不足，它必须触及更高卖价。可成交卖单消耗买方深度时则相反。
          但现实中的价格变化也来自挂单、撤单和重新报价：卖方集体撤掉低价卖单，ask 与 mid 可以在没有成交时上移；
          一笔卖方发起的成交也可能恰好在高于上一笔成交的位置打印。因此，交易方向与逐笔价格变化不是机械的一一对应关系。
        </p>
        <p>
          “买方发起成交”只表示可成交订单来自买方，它仍然必须有卖方作为对手。很多逐笔数据甚至不直接提供真实发起方标签，
          研究者要根据成交价相对当时报价的位置推断；Lee 与 Ready 的经典方法就是这种分类，而不是一份无误差的真相标签。<Cite n={16} />
          更完整的机制应写成：主动订单、被动挂单、撤单和报价更新共同改变可执行机会集。
        </p>
        <div className="myth-grid">
          <div className="wrong"><span>不够精确</span><p>“买方数量超过卖方，所以股价上涨。”</p></div>
          <div className="right"><span>条件化机制</span><p>“在订单簿暂时固定时，主动买单消耗卖方深度；报价者也可能先撤单或上调卖价。”</p></div>
          <div className="right"><span>还要继续问</span><p>主动买入来自新信息、被迫交易、对冲、趋势规则，还是短暂流动性缺口？</p></div>
        </div>
      </section>

      <section className="lesson-section" id="discovery">
        <p className="section-kicker">09 · 价格发现：交易怎样把私人信息变成公共信号</p>
        <h2>订单流有信息含量，但成交并不会自动揭示“真相”</h2>
        <p>
          想象报价者面对两类来客：一类只是为了交房租、调仓或满足赎回而交易，另一类可能掌握尚未公开的信息。
          报价者看不见来客的真实类型，只看见订单。若他对所有买单都按旧价格卖出，就会更容易在好消息尚未公开时被知情买方挑中；
          若对所有卖单都按旧价格买入，又会在坏消息前承受损失。bid–ask spread 的一部分，正是对这种逆向选择的补偿。
        </p>
        <div className="model-glossary">
          <article><b>风险中性</b><p>模型里只比较期望利润，不额外惩罚利润波动；这是简化假设，不是现实做市商都不怕风险。</p></article>
          <article><b>零期望超额利润</b><p>竞争把长期可预期的超额利润压低，不表示每笔交易都不赚不亏。</p></article>
          <article><b>噪声 / 流动性交易者</b><p>交易原因不必来自新增资产信息；它也可能来自现金需求、对冲或规则约束。</p></article>
          <article><b>交易创新 Trade Innovation</b><p>无法由过去订单和报价预测的那部分交易，不是“发明新的交易方式”。</p></article>
        </div>
        <p>
          Glosten–Milgrom 模型把这个思想实验正式化：在其固定单位、顺序交易设定中，成交方向会改变做市商的条件价值判断；
          即使做市商风险中性且在竞争下只获得零期望超额利润，面对可能知情的交易者仍会形成正价差。<Cite n={7} />
          Kyle 的连续竞价模型则把知情交易者、噪声交易者和竞争性做市商放在同一动态系统中，
          竞争性做市商从混合订单流推断信息，私人信息因而逐步进入价格，而噪声交易为知情交易提供掩护。<Cite n={6} />
          这些模型解释机制，不是现代电子撮合引擎的逐条工程说明。
        </p>
        <p>
          这并不意味着每一笔买单都代表利好信息。交易可能来自指数调仓、客户赎回、风险限额、税务需求、
          做市库存或随机流动性需要。观察者无法直接看到动机，只能从后续订单与报价反应中学习。
          Hasbrouck 的经典实证框架因此把“交易的信息效应”定义为不可由既有历史预测的交易成分最终造成的价格影响，
          而不是把即时跳动全部当成永久信息。其早期 NYSE 样本显示，价格影响随交易规模上升但呈凹形，
          在较宽 spread 下更大，小公司中的信息不对称也更突出；这些是特定样本结果，不是现代所有市场的固定参数。<Cite n={8} />
        </p>
        <p>
          可以把观察到的成交价做一个概念性分解：
        </p>
        <div className="equation-card">
          <span>概念分解，不是可直接观测恒等式</span>
          <div>P<sub>t</sub> = m<sub>t</sub> + η<sub>t</sub></div>
          <p>
            m<sub>t</sub> 是给定研究者指定信息集后、模型所识别的潜在有效价格；它不是可直接观察的“客观内在价值”，
            也不等于某位分析师的估值。η<sub>t</sub> 是成交价相对潜在价格的偏离，可包含 bid–ask bounce、离散报价和暂时流动性冲击。
            如果订单带来新信息，其永久影响应当更新 m<sub>t</sub>，不能一概放进 η<sub>t</sub>。不同论文依赖不同识别假设，
            因而这是一种研究框架，不是可以从屏幕上直接读出的恒等分解。
          </p>
        </div>
        <div className="worked-example compact">
          <span>BID–ASK BOUNCE · 没有基本信息也能产生收益率</span>
          <p>
            假设潜在有效价格与 mid-quote 都保持 100.00 元，bid/ask 为 99.99 / 100.01。
            先有一笔交易在 bid 成交，下一笔在 ask 成交，last price 会从 99.99 升到 100.01，约上涨 2 bp。
            但 mid 完全没变。若只看逐笔成交收益率，你会看见“上涨”；若看报价中心，你会判断这主要是成交在价差两侧来回跳动。
          </p>
        </div>
        <p>
          Madhavan、Richardson 与 Roomans 的逐笔研究正是把公共信息冲击和微观结构效应放入同一价格形成模型，
          用以分析价差、波动、交易成本以及报价和收益的动态。<Cite n={9} />
          所以，价格发现不是“价格等于价值”的静态断言，而是<strong>信息在有摩擦的交易过程中逐步进入公共价格</strong>。
        </p>
      </section>

      <section className="lesson-section" id="fundamental">
        <p className="section-kicker">10 · 市场价格与基本面价值的关系</p>
        <h2>两者不是同义词，也不能被切断</h2>
        <p>
          如果市场价格完全只是随机边际成交，那么估值研究似乎毫无意义；如果价格永远等于唯一真实价值，
          市场微观结构又似乎多余。正确位置在两者之间：基本面分析为不同主体的保留价格提供锚，
          套利与学习<strong>可能</strong>对偏离形成纠正压力；但套利需要资本，还要承担价格进一步偏离、融资中断和委托代理风险，
          因此纠正速度与最终结果没有保证。<Cite n={15} /> 信息并非免费、估值模型并不唯一，交易制度还会制造短期噪声，
          所以实际成交价可以围绕不可直接观察的潜在有效价格波动，也可能在约束下持续偏离某些分析者的价值估计。
        </p>
        <p>
          Fama 将市场效率的核心命题概括为价格反映可获得信息，但也强调任何效率检验都必须与某个资产定价模型联合进行：
          当价格看似异常时，我们无法仅凭异常本身判断究竟是市场失效，还是用于定义“正确价格”的模型错误。<Cite n={10} />
          Grossman 与 Stiglitz 则指出，如果信息搜集有成本而价格已经完美揭示全部信息，
          任何人都没有动力付费搜集信息；因此完全信息效率本身存在逻辑张力。<Cite n={11} />
        </p>
        <div className="worked-example compact">
          <span>什么叫“联合假设”</span>
          <p>
            假设某资产定价模型说，一只股票在其风险下本期“正常收益”应为 8%，实际却得到 12%。
            多出的 4 个百分点既可能来自市场错误定价，也可能因为模型遗漏了某种风险，导致 8% 这个基准本身错误。
            效率检验必须同时检验“价格是否有效”和“用于定义正常收益的模型是否正确”，所以单凭异常收益不能把两者分开。
          </p>
        </div>
        <p>
          这带来一个重要的认识论纪律：<strong>市场价格是最重要的公共证据，但不是不容质疑的神谕；
          个人估值是可检验的模型判断，也不是隐藏在世界里的确定答案。</strong>
          当二者差异很大时，研究者不应立即宣布“市场错了”，而要继续问：
          自己掌握的信息是否真正增量？承担偏离收敛所需的时间和资金是否可行？是否存在做空、融资或治理障碍？
          表面低估是否是对尾部风险、流动性或控制权问题的补偿？
        </p>
      </section>

      <section className="lesson-section" id="diagnostic">
        <p className="section-kicker">11 · 完整诊断案例</p>
        <h2>同样是“价格上涨”，价差反弹、流动性缺口与信息更新留下的证据不同</h2>
        <p>
          现在把前面的概念放进一条真实研究风格的时间线。某股票在 10:00 前没有公开公司公告，
          last 为 99.99 元，bid/ask 为 99.99 / 100.01，mid 为 100.00。请不要先猜新闻，先观察市场状态怎样变化。
        </p>
        <div className="diagnostic-timeline">
          <article><span>10:00:00</span><b>一笔 100 股买单在 100.01 成交</b><p>last 从 bid 跳到 ask；ask 立即补回，bid/ask 和 mid 都不变。</p></article>
          <article><span>10:00:03</span><b>连续买单扫到 100.10</b><p>低档卖盘被消耗，补单明显变慢；best bid 也追到 100.06。</p></article>
          <article><span>10:00:20</span><b>订单停止后报价仍在 100.07 / 100.09</b><p>mid 没有退回 100.00；相关公司股票与行业期货开始同向变化。</p></article>
          <article><span>10:05:00</span><b>公司发布超预期经营数据</b><p>更广泛投资者重估现金流，成交和报价在更高区间继续形成。</p></article>
        </div>
        <p>
          第一笔上涨最接近 bid–ask bounce：它改变 last，却没有改变报价中心。第二步首先证明的是买单跨档与流动性消耗，
          还不能单独证明买方知情。第三步出现更强证据——订单停止后 mid 仍维持高位，买方报价跟随，相关市场也开始确认，
          暂时冲击的解释力下降。第四步公开信息为基本面更新提供了直接候选原因，但仍要检查时间戳：
          10:00 的交易是否真的提前反映了 10:05 的消息，还是另有共同信息源，不能仅凭事后顺序断言内幕交易。
        </p>
        <aside className="precision-note">
          <span>诊断不是贴标签</span>
          <p>
            “信息冲击”和“流动性冲击”不是从单笔成交直接观察到的字段，而是对一组动态证据的解释。
            报价是否跟随、冲击是否持续、其他资产是否确认、订单停止后是否回撤，都只能改变相对可信度，不能自动完成因果识别。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="edge-cases">
        <p className="section-kicker">12 · 边界条件与反例</p>
        <h2>不是所有屏幕数字都代表同一种“可交易价格”</h2>
        <p>
          在高流动性股票的连续交易中，用边际成交解释 last price 很有效；一旦离开这个语境，就必须检查制度。
          以下情形不会推翻本节机制，却会改变你应当读取的价格变量。
        </p>
        <div className="edge-list">
          <article><span>没有新成交</span><h3>last price 可能已经过时</h3><p>报价可以先变化，真正可执行价格已经移动，而软件仍显示上一笔成交。</p></article>
          <article><span>价格限制或停牌</span><h3>价格无法继续清除订单不平衡</h3><p>价格上限处可能堆积大量未成交买单；last 固定不表示供需已经平衡。</p></article>
          <article><span>集合竞价</span><h3>使用单一清算规则</h3><p>开盘、收盘和重开可能汇集订单后一次性定价，不等同逐笔扫单。</p></article>
          <article><span>场外 / 交易商市场（OTC / Dealer Market）</span><h3>价格来自双边报价与协商</h3><p>没有一个集中可见的完整订单簿，客户身份、规模和关系可能影响执行价。</p></article>
          <article><span>多交易场所</span><h3>屏幕只是一部分市场</h3><p>同一证券可能在多个场所交易，路由、延迟和隐藏流动性影响实际最佳执行。</p></article>
          <article><span>大宗或极不流动资产</span><h3>最近成交不等于可复制价格</h3><p>交易间隔很长或规模差异很大时，last price 对当前机会集的代表性下降。</p></article>
        </div>
        <p>
          Investor.gov 对 closing price 的说明也体现了“价格依赖规则”：在其美国股票语境中，它通常指常规交易时段的最后成交，
          盘后交易可以有自己的成交价，但不会改写该定义下的 regular-session closing price。<Cite n={13} />
          所以，在任何实证研究里，“价格”都必须进一步注明场所、时段、字段和形成规则。
        </p>
      </section>

      <section className="lesson-section" id="observe">
        <p className="section-kicker">13 · 把理论变成观察能力</p>
        <h2>以后看到价格跳动，按这个顺序追问</h2>
        <p>
          第一，不要直接从涨跌跳到新闻解释，先确认你看到的是 last、mid-quote、best bid/ask、集合竞价价还是估值指标。
          第二，查看价差与深度：同样幅度的价格变化，是深厚订单簿被持续订单推动，还是极薄市场被一笔小单跨越？
          第三，区分主动订单与被动挂单，观察买卖方向、成交规模与报价是否跟随。
          第四，把交易行为重新连接到主体：谁可能因为信息、风险约束、对冲、指数调整或赎回而必须行动？
          第五，再讨论该变化更可能是永久信息进入，还是暂时流动性冲击。
        </p>
        <div className="observation-card">
          <div><span>先看交易事实</span><p>last、bid、ask、spread、depth、volume、交易场所 venue、时间戳 timestamp</p></div>
          <div><span>再推行为机制</span><p>主动性、订单规模、补单速度、库存、强制交易与跨市场路由</p></div>
          <div><span>最后判断经济含义</span><p>信息更新、风险溢价、暂时冲击、制度约束或反馈循环</p></div>
        </div>
        <p>
          这个顺序能够抑制一种常见的事后叙事：价格先动了，观察者随后找到一条听起来合理的新闻，
          再把新闻当成唯一原因。微观结构视角要求你提供中间传导证据——新闻影响了哪些主体，
          他们为何获得或失去交易意愿，什么订单进入市场，流动性如何反应，价格变化是否得到后续订单与其他市场确认。
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">14 · 主动练习 · 建议 25–35 分钟</p>
        <h2>先写下答案，再展开解析；“看懂”不等于能够独立重建机制</h2>
        <p>
          下面三项练习分别检验机械撮合、制度清算与因果诊断。请准备纸笔或空白文档，先完成预测，
          再展开答案。若只是顺着答案阅读，你检验的是熟悉感，而不是能否把知识迁移到新情境。
        </p>
        <details className="practice-card">
          <summary><span>练习一 · 8–10 分钟</span>手算连续订单簿：成交路径、VWAP、last 与剩余深度</summary>
          <div>
            <p>
              卖盘依次为 100 股 @ 10.00、200 股 @ 10.02、300 股 @ 10.05；买一为 150 股 @ 9.98；
              上一笔成交价为 9.97。现在到达一笔 220 股可成交买单。先回答：它在哪些价位成交多少？
              本单 VWAP 和最后成交价分别是多少？执行后 10.02 档还剩多少？last 的上涨能否证明内在价值上升？
            </p>
            <p>
              <b>解析：</b>先取走 10.00 的 100 股，再取走 10.02 的 120 股。VWAP =
              (100 × 10.00 + 120 × 10.02) ÷ 220 = 10.0109；last = 10.02；10.02 档剩 80 股。
              220 股买入必然对应 220 股卖出。这个结果证明订单跨档和 last 更新，不足以单独证明永久信息或内在价值改变。
            </p>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习二 · 8–10 分钟</span>集合竞价出现并列候选价时，你还缺少什么信息？</summary>
          <div>
            <p>
              买单为 100 股 @ 10.10、100 股 @ 10.00；卖单只有 100 股 @ 9.90。候选价为 9.90、10.00、10.10。
              分别计算 B(p)、S(p) 与可成交量。哪个是清算价？在展开前，写下你是否拥有足够信息。
            </p>
            <p>
              <b>解析：</b>三个候选价都能成交 100 股，因此“最大化成交量”只给出三个并列候选，无法唯一确定清算价。
              你还必须知道具体交易场所的次级规则及所需参考字段，例如订单失衡方向、参考价或与连续市场报价的关系。
              直接取三者平均或任意选 10.00，都不是一般性规则。
            </p>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习三 · 10–15 分钟</span>把一次价格跳动画成可证伪的因果链</summary>
          <div>
            <p>
              选择你最近看到的一次股票跳涨，不要先写新闻标题。依次列出：你观察的价格字段；跳动前后的 bid、ask、mid、depth 和 volume；
              可能行动的主体；他们的约束与订单选择；成交后报价是否跟随；冲击是否持续；哪些证据会推翻你的首选解释。
            </p>
            <p>
              <b>解析标准：</b>合格答案必须至少同时保留“信息更新”“被迫或流动性交易”“报价撤回”三个候选机制，
              并为每个机制写出一项可观察的支持证据和一项反证。若答案从“价格上涨”直接跳到“因为某新闻”，中间没有主体、订单和制度，
              就尚未使用本节建立的机制模型。
            </p>
          </div>
        </details>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">15 · 理解检查</p>
        <h2>如果能解释下面六个问题，你才真正掌握了本节</h2>
        <details>
          <summary>1. 为什么“股票价格上涨是因为买的人比卖的人多”不够准确？</summary>
          <p>每笔成交的买卖股数必然相等。上涨可能来自可成交买单消耗卖盘，也可能来自卖方撤单、双方整体上调报价或其他订单簿变化；关键不是买卖人头数，而是保留价格、可用深度、订单主动性与报价修订。</p>
        </details>
        <details>
          <summary>2. 只有 1,000 股成交，为什么 1 亿股的市值都能改变？</summary>
          <p>总市值用当前市场价格标记全部已发行在外股份。它是统一的账面估值规则，不代表全部股份可以同时按该价变现；大规模出售会改变订单簿和价格。</p>
        </details>
        <details>
          <summary>3. 没有新成交，但 best bid 和 best ask 同时上移，价格变了吗？</summary>
          <p>上一笔 transaction price 没变，但当前可执行机会集和 mid-quote 已经变化。回答“价格是否变化”前必须说明使用哪个价格字段。</p>
        </details>
        <details>
          <summary>4. 连续竞价的边际成交价与集合竞价的单一清算价有何不同？</summary>
          <p>连续竞价按订单到达顺序逐笔、逐档匹配，一笔订单可产生多个价格；集合竞价先汇集订单，再按规则选择单一清算价，通常优先最大化可成交量。</p>
        </details>
        <details>
          <summary>5. 市场价格不等于内在价值，是否意味着价格没有信息？</summary>
          <p>不是。成交、报价与订单流可能聚合分散信息，套利和学习也可能对偏离形成纠正压力；但信息成本、模型差异、融资与交易约束以及微观结构摩擦，使市场价格既不能与内在价值简单等同，也不保证偏离必然或迅速消失。</p>
        </details>
        <details>
          <summary>6. 一笔买单推动价格上涨，能否证明买方拥有利好信息？</summary>
          <p>不能。买单可能来自信息、对冲、指数调整、赎回对手盘、风险规则或纯流动性需求。需要观察其永久价格影响、后续订单、报价更新和其他证据。</p>
        </details>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">16 · 与整套课程的接口</p>
        <h2>这一节给后续章节提供了什么</h2>
        <p>
          对 1.08「Order Flow」而言，本节建立了为什么未观察到的意愿必须通过订单才可能进入价格；
          对 2.01「Heterogeneous Agent」而言，它留下了一个核心问题：哪些主体的保留价格和约束正在决定边际订单；
          对 7.03「Endogeneity」而言，成交价一旦公开，又会立刻成为趋势策略、风险模型、保证金、媒体叙事和下一轮估值的新输入。
          因而，“价格是边际成交结果”不是把市场简化成机械撮合，而是为整套动态系统确定最核心的公共状态变量之一。
        </p>
        <blockquote>
          本节最终心智模型：价值判断分散在不同主体之中；订单让部分判断获得行动形式；
          交易制度选择哪些订单相遇；边际成交形成公共价格；公共价格随后重新改变判断、约束和订单。
        </blockquote>
      </section>
    </>
  );
}

export const lesson101: LessonRecord = {
  slug: '1-01',
  id: '1.01',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: '价格究竟是什么',
  subtitle: 'Marginal Transaction Price：从分散估值与订单选择，到边际成交与公共价格',
  readingTime: '约 65–90 分钟（含主动练习）',
  prerequisite: 'T01；公式部分按需调用 T02 Compounding & Discounting、T03 Expectation',
  updatedAt: '2026-08-28',
  revision: '1.01-r3',
  reviewStatus: 'double-reviewed',
  next: { slug: '1-02', label: '1.02 Market Architecture：交易所怎样组织交易' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.01-r1',
      summary: '首轮核验完成；要求修正术语、公式成立条件、市值口径和引用元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.01-r1',
      summary: '首轮核验完成；要求修正学习负荷、实验解释、先修知识与集合竞价练习。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.01-r2',
      summary: '第二轮复核确认首轮问题基本解决；要求收紧竞价适用域、优先规则来源与理解检查措辞。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.01-r2',
      summary: '第二轮复核确认主要教学问题解决；要求修复移动端表格语义和理解检查残留表述。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.01-r3',
      summary: '已批准 r3：事实、术语、公式、数值与引用均通过最终复核。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.01-r3',
      summary: '已批准 r3：教学结构、主动练习、交互解释与可访问性通过最终复核。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'five-prices', label: '六类价格信息' },
    { id: 'causal-chain', label: '从判断到价格' },
    { id: 'visible-demand', label: '可见的局部供需' },
    { id: 'continuous-auction', label: '连续竞价' },
    { id: 'price-lab', label: '互动订单簿实验' },
    { id: 'auction', label: '集合竞价' },
    { id: 'market-cap', label: '市值为何改变' },
    { id: 'buyers-sellers', label: '买方与卖方迷思' },
    { id: 'discovery', label: '价格发现' },
    { id: 'fundamental', label: '价格与基本面' },
    { id: 'diagnostic', label: '完整诊断案例' },
    { id: 'edge-cases', label: '边界与反例' },
    { id: 'observe', label: '观察方法' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '后续接口' },
  ],
  Content: Lesson101Content,
  references: [
    {
      id: 1,
      authors: 'Ananth Madhavan',
      year: '2000',
      title: 'Market microstructure: A survey',
      publication: 'Journal of Financial Markets, 3(3), 205–258',
      url: 'https://doi.org/10.1016/S1386-4181(00)00007-0',
      use: '市场微观结构的定义、价格形成与交易制度的总体框架。',
    },
    {
      id: 2,
      authors: 'U.S. Securities and Exchange Commission, Office of Investor Education and Advocacy',
      year: '2011',
      title: 'Trading Basics: Understanding the Different Ways to Buy and Sell Stock',
      publication: 'Investor Bulletin, Pub. No. 141',
      url: 'https://www.sec.gov/files/trading101basics.pdf',
      use: '市价单不保证执行价格，大额订单可能在多个价位成交。',
    },
    {
      id: 3,
      authors: 'Investor.gov',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Ask Price',
      publication: 'U.S. Securities and Exchange Commission',
      url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/ask-price',
      use: 'best ask 与 bid–ask spread 的官方基础定义；best bid 另见 Reference 17。',
    },
    {
      id: 4,
      authors: 'New York Stock Exchange',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Auctions',
      publication: 'NYSE Trading Documentation',
      url: 'https://www.nyse.com/trade/auctions',
      use: 'NYSE Group 部分市场的 indicative match price、paired quantity 与最终竞价规则语境。',
    },
    {
      id: 5,
      authors: 'Ananth Madhavan and Venkatesh Panchapagesan',
      year: '2000',
      title: 'Price Discovery in Auction Markets: A Look Inside the Black Box',
      publication: 'Review of Financial Studies, 13(3), 627–658',
      url: 'https://doi.org/10.1093/rfs/13.3.627',
      use: 'NYSE 开盘竞价中的订单演化、指定交易商与价格发现。',
    },
    {
      id: 6,
      authors: 'Albert S. Kyle',
      year: '1985',
      title: 'Continuous Auctions and Insider Trading',
      publication: 'Econometrica, 53(6), 1315–1335',
      url: 'https://www.jstor.org/stable/1913210',
      use: '知情交易、噪声交易、市场深度和信息逐步进入价格的经典模型。',
    },
    {
      id: 7,
      authors: 'Lawrence R. Glosten and Paul R. Milgrom',
      year: '1985',
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      publication: 'Journal of Financial Economics, 14(1), 71–100',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
      use: '异质信息、逆向选择、bid–ask spread 与成交的信息含量。',
    },
    {
      id: 8,
      authors: 'Joel Hasbrouck',
      year: '1991',
      title: 'Measuring the Information Content of Stock Trades',
      publication: 'Journal of Finance, 46(1), 179–207',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
      use: '以交易创新的长期价格影响衡量交易信息含量。',
    },
    {
      id: 9,
      authors: 'Ananth Madhavan, Matthew Richardson and Mark Roomans',
      year: '1997',
      title: 'Why Do Security Prices Change? A Transaction-Level Analysis of NYSE Stocks',
      publication: 'Review of Financial Studies, 10(4), 1035–1064',
      url: 'https://doi.org/10.1093/rfs/10.4.1035',
      use: '公共信息冲击与微观结构效应的逐笔价格形成模型。',
    },
    {
      id: 10,
      authors: 'Eugene F. Fama',
      year: '1991',
      title: 'Efficient Capital Markets: II',
      publication: 'Journal of Finance, 46(5), 1575–1617',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb04636.x',
      use: '信息效率命题与效率检验的联合假设问题。',
    },
    {
      id: 11,
      authors: 'Sanford J. Grossman and Joseph E. Stiglitz',
      year: '1980',
      title: 'On the Impossibility of Informationally Efficient Markets',
      publication: 'American Economic Review, 70(3), 393–408',
      url: 'https://www.aeaweb.org/aer/top20/70.3.393-408.pdf',
      use: '信息成本与完全信息效率之间的逻辑张力。',
    },
    {
      id: 12,
      authors: 'Jun Muranaga and Tokiko Shimizu',
      year: '1999',
      title: 'Market Microstructure and Market Liquidity',
      publication: 'In Market Liquidity: Research Findings and Selected Policy Implications, CGFS Papers No. 11, Bank for International Settlements',
      url: 'https://www.bis.org/publ/cgfs11mura_a.pdf',
      use: '从主体决策、订单到执行结果的两阶段价格发现框架。',
    },
    {
      id: 13,
      authors: 'Investor.gov',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Closing Price',
      publication: 'U.S. Securities and Exchange Commission',
      url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/closing-price',
      use: '常规时段收盘价与盘后成交标记的规则差异。',
    },
    {
      id: 14,
      authors: 'Investor.gov',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Market Capitalization',
      publication: 'U.S. Securities and Exchange Commission',
      url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/market-capitalization',
      use: '总市值等于当前市场价格乘以已发行在外股份总数，而非自由流通股数。',
    },
    {
      id: 15,
      authors: 'Andrei Shleifer and Robert W. Vishny',
      year: '1997',
      title: 'The Limits of Arbitrage',
      publication: 'Journal of Finance, 52(1), 35–55',
      url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x',
      use: '资本、融资与委托代理约束为何会限制套利纠偏。',
    },
    {
      id: 16,
      authors: 'Charles M. C. Lee and Mark J. Ready',
      year: '1991',
      title: 'Inferring Trade Direction from Intraday Data',
      publication: 'Journal of Finance, 46(2), 733–746',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
      use: '买方发起与卖方发起成交的含义，以及逐笔数据中交易方向的推断误差。',
    },
    {
      id: 17,
      authors: 'Investor.gov',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Bid Price',
      publication: 'U.S. Securities and Exchange Commission',
      url: 'https://www.investor.gov/introduction-investing/investing-basics/glossary/bid-price',
      use: 'best bid 的官方基础定义。',
    },
    {
      id: 18,
      authors: 'New York Stock Exchange',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Equities Trading',
      publication: 'NYSE Trading Documentation',
      url: 'https://www.nyse.com/trade/equities',
      use: '不同 NYSE Group 市场采用 price/time 或 parity/priority，说明同价位优先规则并非普遍一致。',
    },
  ],
  readingList: [
    {
      title: 'Larry Harris — Trading and Exchanges',
      scope: '重点读 Part I 的 Orders、Market Structures、Order-driven Markets，以及 Part II 的 Good Markets。',
      reason: '最适合从零基础建立“谁交易、为何交易、市场怎样组织”的实践语言。',
      url: 'https://doi.org/10.1093/oso/9780195144703.001.0001',
    },
    {
      title: 'Maureen O’Hara — Market Microstructure Theory',
      scope: '先读 Chapter 1 Markets and Market-Making；以后再进入信息与库存模型。',
      reason: '建立市场微观结构理论的正式地图，但数学密度高于本讲义。',
      url: 'https://www.wiley-vch.de/en/areas-interest/finance-economics-law/accounting-13ac/corporate-finance-13ac3/market-microstructure-theory-978-1-55786-443-7',
    },
    {
      title: 'Ananth Madhavan — Market microstructure: A survey',
      scope: '本节先读 Introduction、canonical model 与 price formation 概览。',
      reason: '把价格形成、市场设计、透明度和资产定价接口放进一套统一框架。',
      url: 'https://doi.org/10.1016/S1386-4181(00)00007-0',
    },
    {
      title: 'Joel Hasbrouck — Measuring the Information Content of Stock Trades',
      scope: '有时间序列基础后阅读模型设定与实证结果。',
      reason: '理解为什么即时成交跳动不等于永久信息，以及如何用数据分解影响。',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
    },
  ],
};
