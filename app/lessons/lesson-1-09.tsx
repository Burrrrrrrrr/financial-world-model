import PriceImpactLab from '../components/PriceImpactLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson109Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>订单推动价格，不是因为“数量天然带有力量”，而是因为它消耗当下承诺、暴露未来需求，并诱发其他参与者重新报价。</h2>
        <p>
          一笔主动买单首先接受当前 ask；若最优档数量不足，它会沿卖方订单簿向上成交，机械地抬高平均成交价，并可能使最优卖价和 mid 上移。这个第一步很直观，却不是完整的 market impact。看到买单后，卖方可能补单、撤单或把报价移远，套利者可能从其他场所搬运流动性，执行算法可能继续拆出同向 child orders，公共新闻也可能同时改变所有人的估值。订单、市场状态与后续价格因此共同演化：<strong>同样的 10,000 股，在深厚而快速恢复的市场里可能几乎无痕，在薄弱、拥挤或信息敏感的市场里却可能跨越多个价位。</strong>
        </p>
        <p>
          本节的中心机制是：<strong>交易路径先穿过当时可执行的流动性，形成 spread 与 book-walking 成本；订单的方向、速度和持续性随后改变其他参与者对库存、毒性与未来流量的判断，促使可见和潜在供给调整；价格路径又反过来改变执行者的速度、其他订单的进入及研究者所观察到的样本。</strong>因此，price impact 是“有这条交易路径”相对“同一状态下没有它”的反事实差异；现实数据直接给我们的通常只是成交成本或交易后的 price response。三者相关，但不能互换。<Cite n={2} /><Cite n={3} /><Cite n={5} /><Cite n={8} /><Cite n={11} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>严格区分成交 VWAP、implementation shortfall、signed markout、条件 price response 与因果 market impact。</li>
            <li>在单笔成交、child order、metaorder 和聚合 order flow 四种尺度间保持清晰边界。</li>
            <li>解释 temporary / permanent 在执行模型、事件研究和信息分解中的三套不同含义。</li>
            <li>推导简化 Almgren–Chriss 成本—风险权衡，并理解 transient impact 与 resiliency 如何改变最优路径。</li>
            <li>正确读取 Kyle λ、平方根规格、impact surface、propagator 与 no-dynamic-arbitrage 的适用对象。</li>
            <li>把观察到的价格路径改写成可证伪、能处理选择偏差与同期流量的识别问题。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="object-map">
        <p className="section-kicker">01 · 先分清五个对象</p>
        <h2>同一笔订单会留下五类数字；只有先给数字命名，后续公式才不会彼此冒充。</h2>
        <div className="table-scroll" role="region" aria-label="价格冲击相关对象比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从最直接的成交记录，逐步走向需要假设的因果对象</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">最小定义</th><th scope="col">直接可见？</th><th scope="col">回答什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Execution price / VWAP</th><td>真实成交价格的数量加权平均</td><td>在完整成交记录中可见</td><td>实际以什么平均价格成交</td></tr>
              <tr><th scope="row">Implementation shortfall</th><td>真实组合相对决策时纸面组合的财富差</td><td>需决策价、成交、未成交与费用</td><td>整个执行决定损失了多少价值</td></tr>
              <tr><th scope="row">Signed markout</th><td>按订单方向对齐的未来参考价变化</td><td>给定起点、终点与参考价可算</td><td>交易前后价格路径怎样变化</td></tr>
              <tr><th scope="row">Price response</th><td>给定交易事件后的平均 signed markout</td><td>可由样本估计</td><td>这类事件之后通常发生什么</td></tr>
              <tr><th scope="row">Causal market impact</th><td>交易世界与无交易反事实世界的价格差</td><td>不能同时直接观察</td><td>这条交易路径本身改变了多少价格</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “我的买单后价格上涨 30 bp”只确定了一条 signed markout。若交易本来就是因为模型预测会涨 20 bp 才启动，那么这 30 bp 同时含有订单选择、公共信息、其他交易者的同向需求和自身影响。反过来，即使未来价格回到原位，也不代表执行没有付出 spread 或在交易期间没有暂时推高价格。把五个对象分开，是本节最重要的语言纪律。<Cite n={1} /><Cite n={6} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="causal-estimand">
        <p className="section-kicker">02 · Impact 是反事实</p>
        <h2>真正的问题不是“下单后价格怎样走”，而是“若同一时刻不沿这条路径下单，价格本来会怎样走”。</h2>
        <p>
          令 a 表示一条完整交易路径，而不只是总数量：它包含方向、child-order 时间、每一步速度、主动或被动方式、场所和停止规则。令 m<sub>t+h</sub>(a) 表示在这条路径下，时点 t+h 的某个参考价；m<sub>t+h</sub>(0) 表示保持其他条件相同但不执行该路径时的价格。方向 s 对买入取 +1、卖出取 −1，则状态 z 下、期限 h 的因果冲击目标可写为：
        </p>
        <div className="equation-card">
          <span>条件因果 market impact</span>
          <div>I<sub>causal</sub>(a,h|z)=E[s·{'{'}m<sub>t+h</sub>(a)−m<sub>t+h</sub>(0){'}'} / m<sub>t</sub> | Z<sub>t</sub>=z]</div>
          <p>分子比较同一初始状态下两个潜在世界；h 可以是执行中、执行结束、结束后十分钟或更长。只有把 a、h、参考价、状态 z 和统计尺度固定，impact 才是一个确定的 estimand。</p>
        </div>
        <p>
          同一笔订单不可能同时出现在两个世界，所以 m(a) 与 m(0) 至少有一个不可见。这就是识别问题。随机化、可信外生工具、准实验或带明确限制的结构模型，可以帮助构造反事实；按规模分箱画平均路径，只能给出条件 response。更棘手的是市场存在干扰：你的订单会改变其他人的选择，其他同期订单也改变你的执行，这些反馈不是“需要清除的噪声”，而正是总 market impact 的一部分。研究设计必须决定要估计直接机械效应，还是包含市场反应的总效应。
        </p>
      </section>

      <section className="lesson-section" id="units-of-analysis">
        <p className="section-kicker">03 · 四种尺度</p>
        <h2>单笔成交、child order、metaorder 与聚合订单流处在不同层级，不能把一条曲线的参数搬到另一层。</h2>
        <div className="market-stack">
          <article><span>TRADE</span><b>一次匹配或成交消息</b><p>适合研究下一次报价更新、trade sign response 与局部 book depletion；同一主动指令可能生成多笔。</p></article>
          <article><span>CHILD ORDER</span><b>执行算法的一次提交</b><p>可被拆分、改价或跨场所路由；其数量和时点已由母级策略选择。</p></article>
          <article><span>METAORDER</span><b>同一交易决定的完整执行</b><p>由同向 child orders 组成，具有总量 Q、持续时间 T 与参与率；最接近机构交易成本问题。</p></article>
          <article><span>AGGREGATE FLOW</span><b>多个主体的窗口净流</b><p>适合研究市场价格形成；聚合后不再等于任何单一执行者的 self-impact。</p></article>
        </div>
        <p>
          单笔成交后的平均响应可以是凹的，母单层面的成本或峰值也可以近似平方根，但两者的横轴、终点和选择过程完全不同。Lillo、Farmer 与 Mantegna 的经典 NYSE 结果研究的是单笔成交后下一次报价更新，并按该股票的平均单笔金额归一化。Tóth 等在导论中用母单第一笔到最后一笔的相对价格变化概述常见平方根规格，但其 Figure 1 的专有期货母单实证实际测量 average execution shortfall；两种端点必须分开。标题里都出现 “price impact”，并不意味着测量的是同一个对象。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="benchmarks-horizons">
        <p className="section-kicker">04 · 基准、符号与时钟</p>
        <h2>没有明确的起点、参考价、终点和方向，所谓 “impact 20 bp” 没有可复核含义。</h2>
        <p>
          对买入订单，常见起点包括投资决定时的 decision price、订单释放到市场时的 arrival mid、第一笔成交前的 mid 或当时 ask；终点包括每笔 execution price、订单结束时 mid、固定物理时间后的 mid、相对订单时长 T 的 hT 后 mid、收盘价或数日后的风险调整价格。卖出订单通常乘 s=−1，使“价格向不利方向移动”仍记为正成本或正 impact。算术收益、对数收益和基点也必须固定。
        </p>
        <div className="equation-card">
          <span>可观察的有符号路径量</span>
          <div>M(h)=s·[m(t<sub>e</sub>+h)−m(t<sub>s</sub>)] / m(t<sub>s</sub>)<br />Peak=M(0)　；　ResidualRatio(h)=M(h)/M(0), if M(0)≠0</div>
          <p>t<sub>s</sub> 是预先定义的开始，t<sub>e</sub> 是结束。M(0) 是结束时 signed markout；M(h) 是有限期限残留。ResidualRatio 只是路径比例，不能自动命名为“永久占比”。</p>
        </div>
        <p>
          物理时间与交易时间会给出不同图形：午间十分钟可能几乎没有事件，开盘十分钟却经历大量成交；以 h/T 对齐又会让短单的“一倍时长”与长单对应完全不同的日内环境。跨越收盘还引入隔夜信息。可靠研究至少同时说明 calendar time、volume time 或 normalized metaorder time、交易阶段、是否剔除隔夜，以及参考价来自单场所还是全市场。
        </p>
      </section>

      <section className="lesson-section" id="book-walking">
        <p className="section-kicker">05 · 机械 Book Walking</p>
        <h2>主动订单先购买现有承诺；当近端数量不足，它支付的不是一个价格，而是一条供给曲线。</h2>
        <p>
          假设下单前 bid/ask 为 99.99/100.01，ask 三档分别是 100.01×300、100.02×500、100.04×400。立即买入 900 股会依次成交 300、500、100 股。最后一笔价格是 100.04，但成交 VWAP 只有约 100.0189；若第三档尚有 300 股，新的 best ask 可能仍是 100.04。于是同一动作至少留下三个不同结果：平均支付价格、最差成交价格和交易后 quote/mid。
        </p>
        <div className="equation-card">
          <span>数量加权成交价格</span>
          <div>VWAP=Σ<sub>j</sub>q<sub>j</sub>p<sub>j</sub> / Σ<sub>j</sub>q<sub>j</sub><br />Buy slippage<sub>arrival-mid</sub>=10,000·(VWAP/m<sub>0</sub>−1) bp</div>
          <p>本例 VWAP=(300×100.01+500×100.02+100×100.04)/900≈100.0189，相对 m₀=100.00 的滑点约 1.89 bp。它包含半个 spread 和扫过深度的成本；若市场同时移动，还会混入 timing 与其他流量。</p>
        </div>
        <p>
          这个机械通道与 1.07 的 depth 直接相连：在给定静态簿上，累计供给曲线决定完成 Q 需要走多远。但真实执行不是在冻结簿上一次性取货。你开始买入后，hidden quantity 可能补显，卖方可能撤回，套利者可能跨场所补给，自己也可能减速。因此静态 book walk 是一个有用的条件机械基准，也就是“其余状态冻结”的簿上反事实；hidden liquidity、补单、撤单、跨场所供给与等待期间价格移动都可能使真实动态成本更低或更高，所以它一般既不是下界也不是上界，更不是完整动态 impact 模型。<Cite n={8} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="fill-quote-separation">
        <p className="section-kicker">06 · 成交成本与报价变化</p>
        <h2>支付更差的成交价不要求 mid 一定移动；mid 移动也不告诉你平均成交成本。</h2>
        <p>
          若一笔小买单只在 100.01 成交，而 bid/ask 仍是 99.99/100.01，买方已经相对 mid 支付 1 bp，却没有观察到 quote impact。反过来，一笔交易结束后相关期货先上涨，本地做市者把 bid 与 ask 同时上移 5 bp，即使你的订单全部在一档成交，mid markout 也可能很大。VWAP 记录你获得的执行，quote/mid 记录市场公开机会集；二者通过订单簿连接，却不应相减后随意命名。
        </p>
        <div className="table-scroll" role="region" aria-label="成交与报价测量对象比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一路径中的不同测量面</caption>
            <thead><tr><th scope="col">结果</th><th scope="col">受什么直接决定</th><th scope="col">常见误读</th></tr></thead>
            <tbody>
              <tr><th scope="row">VWAP−arrival mid</th><td>spread、各档成交量、执行期间市场路径</td><td>全部称为自身 impact</td></tr>
              <tr><th scope="row">Last fill−arrival mid</th><td>最后一个 child fill 所在价位</td><td>当作全部数量的平均成本</td></tr>
              <tr><th scope="row">Post-trade mid−arrival mid</th><td>报价重建、其他流量、信息与自己的交易</td><td>当作已识别永久冲击</td></tr>
              <tr><th scope="row">Spread paid</th><td>主动/被动方式与当时 quote</td><td>从 impact 中完全独立且恒定</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Spread 与 impact 在概念上可以区分：spread 是下单前两侧可执行价格的间隔，impact 是交易路径改变市场状态的反事实效应。但在数据里，两者会互动。持续主动买入可能使 spread 扩大，换成被动单又会改变成交选择与未成交风险。成本归因是一套模型，不是把总 shortfall 做简单减法就能得到的自然事实。
        </p>
      </section>

      <section className="lesson-section" id="implementation-shortfall">
        <p className="section-kicker">07 · Implementation Shortfall</p>
        <h2>执行的真正机会成本从“决定交易”开始，而不是从第一笔成交开始。</h2>
        <p>
          Perold 提出的 implementation shortfall 比单纯 VWAP 更接近投资决定：比较一个在决策价立即、完整、无费用成交的纸面组合，与真实执行后的组合财富。对目标买入 Q、决策价 P<sub>d</sub>、成交 q<sub>j</sub>@p<sub>j</sub>，未成交数量在评估时点价值为 P<sub>T</sub>，买入方向的美元 shortfall 可写为：<Cite n={1} />
        </p>
        <div className="equation-card">
          <span>买入目标的实现缺口</span>
          <div>IS=Σ<sub>j</sub>q<sub>j</sub>(p<sub>j</sub>−P<sub>d</sub>)+(Q−Σ<sub>j</sub>q<sub>j</sub>)(P<sub>T</sub>−P<sub>d</sub>)+fees</div>
          <p>第一项是已成交部分相对决策价的成本；第二项是未成交机会成本。若目标 1,000 股、Pᵈ=50，成交 600@50.10 与 200@50.20，余下 200 股在 Pᵀ=50.40 评估，则 IS=$60+$40+$80=$180，等于目标名义金额的 36 bp，尚未加费用。</p>
        </div>
        <p>
          Shortfall 是总结果，不是 market impact 的同义词。它可包含 delay（决定到释放）、spread、fees、timing、已实现 impact、机会成本与交易者 alpha（交易决策使用的预期收益信号）。若只保留完整成交的订单，会系统性删除最难执行、机会成本最高的案例；若把未成交部分按零成本处理，又会奖励消极不成交。Arrival-price benchmark 适合评价从订单释放之后的执行，而 decision-price benchmark 才保留决定到释放的延迟；选择哪一个取决于要问谁对哪段过程负责。
        </p>
      </section>

      <section className="lesson-section" id="cost-decomposition">
        <p className="section-kicker">08 · 总成本不是天然可分</p>
        <h2>Spread、timing、impact 与 opportunity cost 是有用的归因坐标，但每一项都依赖反事实或执行模型。</h2>
        <p>
          常见交易成本分析会把 implementation shortfall 写成 delay、trading、opportunity 与 explicit fees；也会进一步把 trading cost 拆成 spread、market movement 与 impact。这个做法便于管理，却有一个隐藏前提：必须规定“如果我没有这样交易，市场本来怎样走”。例如用同日指数收益扣除 market movement，默认指数足以代表无交易反事实；用订单结束后的价格回落估计 temporary impact，则默认期间没有新信息和后续同向需求。
        </p>
        <div className="mechanism-chain" aria-label="从决策到总执行结果的归因链">
          {[
            ['投资决定', '信号、目标数量与最迟完成时间形成'],
            ['等待与释放', '决策价到 arrival price 之间产生 delay'],
            ['选择执行路径', '主动/被动、速度、场所与参与率被共同决定'],
            ['市场响应', '深度消耗、补单、撤单、信息更新与其他流量叠加'],
            ['真实组合形成', '成交、未成交、费用与期末机会共同决定 shortfall'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          因而成本分解不应追求“各项永远唯一”，而应追求口径守恒与决策用途：各部分相加必须回到总 shortfall；benchmark、窗口和符号必须固定；模型误差要保留；不同归因模型应做敏感性比较。对执行者而言，总 shortfall 决定结果；对机制研究者而言，因果 impact 才是要识别的局部对象。
        </p>
      </section>

      <section className="lesson-section" id="response-vs-impact">
        <p className="section-kicker">09 · Price Response ≠ Causal Impact</p>
        <h2>Response 是“这类交易之后平均发生什么”；impact 是“如果移除这条交易路径，结果会相差多少”。</h2>
        <p>
          在单笔成交尺度，常见 response function 令 ε<sub>t</sub> 为主动成交方向，m<sub>t</sub> 为成交前后统一定义的 mid，以事件滞后 ℓ 衡量平均有符号变化：
        </p>
        <div className="equation-card">
          <span>经验 price response</span>
          <div>R(ℓ)=E[ε<sub>t</sub>·(m<sub>t+ℓ</sub>−m<sub>t</sub>)]</div>
          <p>R(ℓ)&gt;0 表示买方发起成交之后平均价格更高、卖方发起之后平均更低。它是一个联合分布的条件矩，不会单独告诉你交易是否外生、后续流量是否由同一母单产生。</p>
        </div>
        <p>
          交易符号通常高度持续：大型投资决定被拆分后，同方向 child orders 会连续出现。若某笔买入之后还有更多买入，R(ℓ) 会包含后续流量；若交易者因为私人或公共信号选择买入，它也会包含信号本来带来的收益。Hasbrouck 用交易与报价的向量自回归，把不可预测的 trade innovation 与预期成分区分，再用累计冲击响应衡量信息含量；这比原始 markout 更结构化，但长期响应仍依赖变量、滞后、创新排序与模型识别。<Cite n={6} /><Cite n={19} />
        </p>
        <aside className="precision-note">
          <span>响应函数仍然非常有用</span>
          <p>不能直接称为因果，不等于没有信息价值。R(ℓ) 能描述市场如何消化带符号事件、冲击是否快速回落、不同状态下的条件路径是否不同，并为结构模型提供需要解释的事实。错误发生在把“条件平均”悄悄改名为“自己的因果足迹”。</p>
        </aside>
      </section>

      <section className="lesson-section" id="mechanical-information">
        <p className="section-kicker">10 · Mechanical 与 Informational</p>
        <h2>机械冲击描述交易如何改变可执行状态；信息冲击描述市场如何从交易中更新价值判断，两者在观察路径上同时发生。</h2>
        <p>
          最窄的 mechanical effect 是冻结其他行为时，订单按价格—时间优先规则消耗簿上数量造成的成交和 quote 变化。更宽的“机械总效应”还可能包括其他交易者对可见流量的策略性反应，但不包含原交易者事前信息本来会带来的价值变化。Informational component 则来自订单揭示了私人信号，或执行决定与未来基本价值共同受某个信号驱动。现实中无法给每一笔成交贴上一个纯机械或纯信息标签：无信息的指数再平衡也会被市场误判为有毒，知情者也会选择在深度较好时慢慢交易。
        </p>
        <p>
          Glosten–Milgrom 与 Kyle 展示了订单方向如何进入做市者的条件价值更新；Madhavan、Richardson 与 Roomans 在交易级框架中把公共信息、交易创新和微观结构效应共同放入价格形成。它们提供了清晰的理论分解，却不意味着实证中的某个“结束后未回落部分”天然等于信息价值。结构分解成立，要靠模型假设、可观测变量和样本拟合共同支撑。<Cite n={5} /><Cite n={7} /><Cite n={21} />
        </p>
        <div className="table-scroll" role="region" aria-label="机械与信息解释证据比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一个交易后上涨现象，可以由不同机制生成</caption>
            <thead><tr><th scope="col">候选机制</th><th scope="col">首先改变什么</th><th scope="col">需要的额外证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">静态 book walk</th><td>可见 ask 档位与成交 VWAP</td><td>逐消息订单簿和执行映射</td></tr>
              <tr><th scope="row">流动性提供者撤退</th><td>spread、depth 与补单强度</td><td>交易后的 add/cancel/quote response</td></tr>
              <tr><th scope="row">私人信息更新</th><td>条件价值和持续报价中心</td><td>交易信号、后续基本面或可信结构识别</td></tr>
              <tr><th scope="row">公共新闻</th><td>多个资产与所有参与者估值</td><td>新闻时间、相关市场和无订单对照</td></tr>
              <tr><th scope="row">后续同向母单</th><td>未来 order flow</td><td>母单身份、重叠与去卷积（从叠加路径中模型化分离各次流量响应）</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="temporary-permanent-map">
        <p className="section-kicker">11 · Temporary / Permanent 的三套语言</p>
        <h2>同一个词在执行模型、母单事件研究和信息分解中指向不同对象；不声明语境，就会制造伪争论。</h2>
        <div className="table-scroll" role="region" aria-label="暂时与永久冲击的三种口径，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>三个研究语境中的 temporary 与 permanent</caption>
            <thead><tr><th scope="col">语境</th><th scope="col">Temporary</th><th scope="col">Permanent / persistent</th><th scope="col">关键边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">执行模型</th><td>只进入当期成交价、停止交易即消失的 h(v)</td><td>累计交易使模型 mid 持续平移的 g(v)</td><td>是模型部件，不是从一条路径直接读出</td></tr>
              <tr><th scope="row">母单事件研究</th><td>有些论文把完成时 peak 本身称 temporary impact</td><td>完成后某期限的 residual，或拟合的长期极限</td><td>必须写清结束、日终、次日或数周</td></tr>
              <tr><th scope="row">信息分解</th><td>无信息的机械/流动性让步，预期会回落</td><td>交易揭示信息后进入有效价值的部分</td><td>需要信号、结构模型或识别，不能用“没回去”替代</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Almgren 等 2005 的 “temporary impact” 又是其执行成本模型中的 J−I/2：J 是实现成本，I 是以最后一笔至少 30 分钟后首个 mid 定义的永久项；它既不是母单结束时 peak，也不是“所有后来回落的部分”。Zarinelli、Bacry 等母单文献常把开始到结束的变化称 temporary / peak impact。只有把论文自己的等式、端点和样本放在一起，数字才可比较。<Cite n={4} /><Cite n={14} /><Cite n={16} />
        </p>
        <aside className="precision-note">
          <span>本节统一用词</span>
          <p>“Peak”只指预先定义的执行结束时 signed markout；“decay”指从 peak 到有限期限的回落；“residual”指该期限仍存在的 signed markout；“permanent”只用于明确模型中的非衰减状态变量，或已声明识别假设与长期极限的估计。</p>
        </aside>
      </section>

      <section className="lesson-section" id="spread-identity">
        <p className="section-kicker">12 · Effective、Realized Spread 与有限期响应</p>
        <h2>三项可以构成代数恒等式，但“信息”“做市收入”和“永久影响”仍是经济解释，不是恒等式本身。</h2>
        <p>
          对成交价 p<sub>t</sub>、成交前统一定义的 mid m<sub>t</sub>、未来期限 Δ 的 mid m<sub>t+Δ</sub>，令主动买 s=+1、主动卖 s=−1。采用 full-spread 美元口径，可以定义 effective spread、有限期 price component 和 realized spread：
        </p>
        <div className="equation-card">
          <span>同一参考价与同一期限下的精确分解</span>
          <div>ES<sub>t</sub>=2s<sub>t</sub>(p<sub>t</sub>−m<sub>t</sub>)<br />PI<sub>t</sub>(Δ)=2s<sub>t</sub>(m<sub>t+Δ</sub>−m<sub>t</sub>)<br />RS<sub>t</sub>(Δ)=2s<sub>t</sub>(p<sub>t</sub>−m<sub>t+Δ</sub>)<br />ES<sub>t</sub>=PI<sub>t</sub>(Δ)+RS<sub>t</sub>(Δ)</div>
          <p>恒等式只是加减同一个 mₜ₊Δ。若买在 100.03、成交前 mid=100.00、未来 mid=100.02，则 ES=$0.06、PI=$0.04、RS=$0.02；若以 100 为分母，它们约为 6、4、2 bp。</p>
        </div>
        <p>
          把 PI(Δ) 叫“信息成分”、把 RS(Δ) 叫“流动性提供者收入”，需要假设 Δ 足以消化信息、报价基准准确且没有库存、费用和对冲成本等遗漏。换一个 Δ，二者就会变化；RS 也不是已实现利润，因为做市者未必在 p<sub>t</sub> 取得相反仓位，更未必在 m<sub>t+Δ</sub> 平仓。这个恒等式适合训练口径，却不能绕开反事实识别。<Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="ac-model">
        <p className="section-kicker">13 · Almgren–Chriss 的最小状态模型</p>
        <h2>把复杂市场压缩成“剩余库存、交易速度、价格风险与两类冲击”，才能看清执行者为何既不能太快，也不能太慢。</h2>
        <p>
          考虑在固定期限 [0,T] 内买入 Q。令 u(t)≥0 为买入速度，累计完成 X(t)=∫<sub>0</sub><sup>t</sup>u(s)ds，剩余 r(t)=Q−X(t)。用买入方向的符号写一个简化连续模型：未受自己交易影响的价格 m<sup>0</sup>(t) 随市场波动；累计买入通过 g(u) 推动参考 mid；当前速度又通过 h(u) 使实际成交价比当前 mid 更差。
        </p>
        <div className="equation-card">
          <span>教学化的永久—暂时执行模型</span>
          <div>m(t)=m<sup>0</sup>(t)+∫<sub>0</sub><sup>t</sup>g(u(s))ds<br />p<sub>exe</sub>(t)=m(t)+h(u(t))+c<sub>spread</sub>(t)+c<sub>fee</sub>(t)<br />X(0)=0,　X(T)=Q</div>
          <p>g 改变之后仍用于定价的模型 mid；h 只改变当前成交价。c<sub>spread</sub> 与 c<sub>fee</sub> 都先换算成与 p<sub>exe</sub> 相同的每股价格单位；若费用只按美元总额记录，就应留在总成本公式中，不能直接加到单股成交价。原模型可用卖出库存和相反符号书写，经济内容相同。边界 X(T)=Q 把“必须完成”与机会成本问题分开。</p>
        </div>
        <p>
          这类模型的价值不是声称真实市场只有两个函数，而是把决策矛盾显式化：提高 u 会增加即时成本，降低 u 会延长暴露于 m<sup>0</sup> 随机变化的时间。Bertsimas–Lo 在基础线性、固定期限、期望成本设定中得到等额切片特例；Almgren–Chriss 加入成本方差，构造一条执行成本—风险有效前沿。等额切片不是所有市场中 TWAP（time-weighted average price，按时间等距、等量切片的执行基准）永远最优的定理。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="temporary-channel">
        <p className="section-kicker">14 · 模型里的 Temporary Channel</p>
        <h2>速度越高，单位时间索取的流动性越多；即时成交让步通常因此以非线性方式增加。</h2>
        <p>
          在简化线性规格 h(u)=η<sub>temp</sub>u 中，一段 dt 内买入 u·dt，速度成本约为 u·h(u)dt=η<sub>temp</sub>u²dt。总 temporary cost 因而是 η<sub>temp</sub>∫u²dt。固定 Q 与 T 时，凸性意味着把数量均匀分布可最小化这一项；把同样数量压缩到一半时间，恒定速度翻倍，η<sub>temp</sub>∫u²dt 约翻倍，而不是不变。
        </p>
        <div className="equation-card">
          <span>线性速度冲击下的总即时成本</span>
          <div>C<sub>temp</sub>=∫<sub>0</sub><sup>T</sup>u(t)h(u(t))dt=η<sub>temp</sub>∫<sub>0</sub><sup>T</sup>u(t)<sup>2</sup>dt<br />If u(t)=Q/T,　C<sub>temp</sub>=η<sub>temp</sub>Q<sup>2</sup>/T</div>
          <p>η<sub>temp</sub> 专指 temporary-cost 系数，其单位取决于价格与速度单位；更换从 shares/second 到 ADV（average daily volume，平均日成交量）/minute 会改变数值。若 h 是幂律或状态依赖函数，时间缩放也会改变，不能保留这个比例。</p>
        </div>
        <p>
          “Temporary”在这里表示 h(u) 不进入下一时刻的模型 mid，并不表示现实中所有由速度产生的价格变化会在一毫秒内消失。真实市场的撤单、补单和其他执行者反应具有记忆；把它们压成当期 h 是建模选择。Almgren 等用真实机构订单估计的临时交易率指数约为 0.600±0.038，并在其样本内拒绝精确 1/2；这已经说明方便的线性或平方根函数都必须由数据审计。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="permanent-channel">
        <p className="section-kicker">15 · 模型里的 Permanent Channel</p>
        <h2>若每一单位净交易对参考价格留下不衰减的线性位移，执行路径会改变何时支付，但不会随意改变总永久成本。</h2>
        <p>
          取 g(u)=γu，则执行结束时模型 mid 相对未受影响价格平移 γQ。买入过程中，每一单位成交面对此前累计量 X 造成的位移 γX；忽略噪声和边界项，永久部分的总成本是 ∫<sub>0</sub><sup>Q</sup>γX dX=γQ²/2。它只取决于 Q，不取决于具体速度。这一性质使速度决策主要在 temporary cost 与风险之间权衡。
        </p>
        <div className="equation-card">
          <span>线性永久冲击的路径不变部分</span>
          <div>Δm<sub>perm,end</sub>=γQ<br />C<sub>perm</sub>=∫<sub>0</sub><sup>Q</sup>γX dX=γQ<sup>2</sup>/2</div>
          <p>这是模型内结论。现实里同向其他订单、恢复、alpha、日内状态和非线性供给都会让观测成本依赖路径；γQ 也不是从“结束后仍涨了多少”直接读出的事实。</p>
        </div>
        <p>
          为什么经典模型偏好线性永久冲击？一条原因来自内部一致性：若时间不变的永久 impact 对累计净量任意非线性，可能通过先把价格推向有利方向、再反向交易构造 quasi-arbitrage。Huberman–Stanzl 证明在其永久冲击环境中，排除这类机会会强烈限制函数形状。这个结果约束的是模型，不说明真实市场在所有数量区间都呈线性观测响应。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="risk-speed-tradeoff">
        <p className="section-kicker">16 · 成本—风险有效前沿</p>
        <h2>慢执行减少流动性索取，却让未完成库存更久暴露于价格风险；风险厌恶把最优路径向前推。</h2>
        <p>
          在线性 temporary cost、常数波动率 σ 与均值—方差目标下，可以把要最小化的路径依赖部分写成：
        </p>
        <div className="equation-card">
          <span>简化连续时间目标</span>
          <div>Minimize　η<sub>temp</sub>∫<sub>0</sub><sup>T</sup>u(t)<sup>2</sup>dt + λσ<sup>2</sup>∫<sub>0</sub><sup>T</sup>r(t)<sup>2</sup>dt<br />ṙ(t)=−u(t),　r(0)=Q,　r(T)=0</div>
          <p>第一项惩罚快交易，第二项惩罚持有未完成库存；λ 是风险权重。在线性常参数近似中，r(t)=Q·sinh[κ<sub>AC</sub>(T−t)]/sinh(κ<sub>AC</sub>T)，κ<sub>AC</sub>≈√(λσ²/η<sub>temp</sub>)。sinh 是双曲正弦函数，精确推导可暂时跳过；λ→0 时路径趋近直线，κ<sub>AC</sub> 越大，执行越前置。</p>
        </div>
        <p>
          这个解是一张因果结构图，不是可直接下单的参数表。若存在可预测 alpha，等待本身可能有收益；若流动性随机、限价单可能不成交、市场会暂停、风险限额会跳变，状态空间必须扩展。最重要的直觉仍成立：impact 使快交易昂贵，价格与完成风险使慢交易昂贵，执行算法是在两类损失之间移动，而不是单纯追求最低即时滑点。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="transient-resilience">
        <p className="section-kicker">17 · Resiliency 让冲击拥有记忆</p>
        <h2>订单簿会在两次 child orders 之间恢复；因此相同总量的成本取决于间隔、恢复速度和路径顺序。</h2>
        <p>
          1.07 已经说明 depth 不是静态库存，而是 add、cancel、execution 与重新定价共同生成的动态状态。若一次买入把 ask 侧推高，随后新的卖单以恢复率 κ<sub>rec</sub> 回填，那么下一次 child order 面对的价格让步取决于两次交易之间的等待。一个最小 transient 状态可写为 D：交易使 D 跳升，恢复使其向零衰减，执行价包含当前 D。
        </p>
        <div className="equation-card">
          <span>教学化 transient-impact 状态</span>
          <div>dD(t)=−κ<sub>rec</sub>D(t)dt+χ<sub>D</sub>u(t)dt<br />p<sub>exe</sub>(t)=m<sup>0</sup>(t)+D(t)+instantaneous terms</div>
          <p>κ<sub>rec</sub> 越大，给定间隔后留下的 D 越小；χ<sub>D</sub> 越大，单位速度注入的位移越大。真实恢复未必指数、对称或平稳，这只是把“冲击会积累也会消散”写进状态。</p>
        </div>
        <p>
          Obizhaeva–Wang 在具有供需动态和恢复力的订单簿模型中展示了这一点：最优策略可包含初始、持续和终点交易块，形状取决于深度与恢复。它与 Almgren–Chriss 的即时 h(u) 不同，因为过去交易的影响会进入当前状态；也与静态 book walk 不同，因为等待本身改变下一次可执行曲线。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="peak-decay-residual">
        <p className="section-kicker">18 · Peak、Decay 与 Residual</p>
        <h2>执行结束只是动态路径的一个转折点；观察到回落多少，要与“回落到哪里、用了多久”一起报告。</h2>
        <p>
          对买入母单，以开始 mid 为 100.00，结束 mid 为 100.30，结束后 30 分钟 mid 为 100.12。可直接报告 peak=30 bp、有限期 residual=12 bp、从 peak 已回落 18 bp、residual ratio=40%。不能直接写“temporary=18 bp、permanent=12 bp”，因为 30 分钟后的价格仍可能继续变化，也可能已被新闻、其他订单和交易者信号改变。
        </p>
        <div className="equation-card">
          <span>描述路径，不越界命名</span>
          <div>I<sub>peak</sub>=M(0)<br />Decay(h)=I<sub>peak</sub>−M(h)<br />ResidualRatio(h)=M(h)/I<sub>peak</sub></div>
          <p>若 peak 接近零，比例会爆炸或失去意义，应报告绝对路径并预先规定排除规则。卖出订单先乘方向符号再聚合，避免买卖路径互相抵消。</p>
        </div>
        <p>
          相对时间 h/T 便于比较不同持续时间，但会混合不同物理时长；固定十分钟便于业务解释，却让短单和长单经历不同的相对恢复。日终、次日收盘或第十个交易日又分别暴露于隔夜新闻和风险因子。没有单一“正确永久时点”，只有与研究问题匹配、公开边界的多个 horizon。
        </p>
      </section>

      <section className="lesson-section" id="decay-identification">
        <p className="section-kicker">19 · 衰减曲线为什么会骗人</p>
        <h2>后续同向母单与交易信号能制造平台；只看订单结束后的平均价格，不足以识别孤立冲击如何衰减。</h2>
        <p>
          大型投资者常把同一信号分散到多日，同一 broker 数据中又可能同时存在多个客户。若今天买入之后明天仍因相同 alpha 买入，条件平均价格会继续上涨；这既可能是首日交易的持久作用，也可能是信号实现与后续交易的新作用。订单符号长记忆还意味着“结束后没有自己的 child order”不等于市场中没有相关同向需求。<Cite n={15} /><Cite n={17} /><Cite n={19} />
        </p>
        <div className="table-scroll" role="region" aria-label="冲击衰减识别偏差清单，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>表观 residual 的主要来源</caption>
            <thead><tr><th scope="col">偏差</th><th scope="col">怎样抬高或压低路径</th><th scope="col">最低审计</th></tr></thead>
            <tbody>
              <tr><th scope="row">交易 alpha</th><td>本来会上涨的订单更可能被买入</td><td>保存决策信号或可用预测代理</td></tr>
              <tr><th scope="row">后续同向订单</th><td>把新的 impact 叠在旧路径上</td><td>观察完整参与者流并做去卷积</td></tr>
              <tr><th scope="row">同期重叠母单</th><td>其他机构共同推价</td><td>报告重叠、crowding 与市场流量</td></tr>
              <tr><th scope="row">完成选择</th><td>不利订单更可能取消，完整样本被筛选</td><td>保留取消、部分成交与停止规则</td></tr>
              <tr><th scope="row">收盘与隔夜</th><td>公共信息和日内季节性进入端点</td><td>多 horizon、风险调整与 placebo</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Brokmann 等拥有同一管理人的预测信号和交易流，控制后续订单与预期收益后，估计的孤立母单影响在多日尺度显著衰减；Bucci 等对更广 ANcerno 数据的长期去卷积则给出高度依赖规格的非零极限，某些替代规格又与零相容。这些结果不是简单冲突：它们的可见参与者集合、信号信息和核函数约束不同，所识别的对象也不同。<Cite n={15} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="kyle-lambda">
        <p className="section-kicker">20 · Kyle λ</p>
        <h2>λ 是一个均衡中的订单流价格敏感度与 inverse depth，不是任意市场订单的通用“每股冲击成本”。</h2>
        <p>
          在单期 Kyle 模型中，知情交易者观察价值 v，噪声交易为 u，做市者只看总订单流 y=x+u 并设价格 p=p<sub>0</sub>+λy。正态、线性、风险中性和竞争定价条件下，知情者隐藏在噪声里，做市者从 y 更新价值。若基本价值创新标准差为 σ<sub>v</sub>、噪声数量标准差为 σ<sub>u</sub>，该单期规格的线性均衡给出：<Cite n={5} />
        </p>
        <div className="equation-card">
          <span>单期 Kyle 线性均衡</span>
          <div>y=x+u　；　p=p<sub>0</sub>+λy<br />λ=σ<sub>v</sub>/(2σ<sub>u</sub>)　；　Depth=1/λ</div>
          <p>λ 的单位是价格/数量。价值不确定性越大，做市者对同量 flow 越敏感；噪声交易越多，知情单越容易隐藏，同量总 flow 的信息含量越低。连续拍卖版本的归一化与动态信息释放不同，不能把参数公式混写。</p>
        </div>
        <p>
          实证中把短窗 return 对 signed volume 或 OFI 回归得到的斜率也常被口头叫 Kyle lambda，但它可能包含同窗机械变化、深度状态和测量误差。只有变量与结构假设匹配时，它才对应理论 λ。把一个股票昨日的回归斜率直接乘自己的母单 Q，既忽略非线性与执行路径，也把市场总流量响应误写成 self-impact。
        </p>
      </section>

      <section className="lesson-section" id="hasbrouck-response">
        <p className="section-kicker">21 · Hasbrouck 的 Ultimate Response</p>
        <h2>价格应当响应订单流中“未被预期的创新”；累计响应来自动态系统，而不是一笔原始成交的静态系数。</h2>
        <p>
          若交易方向可由过去预测，预期买单本身不应带来与意外买单相同的价值更新。Hasbrouck 把 quote return 与交易变量组成向量 z<sub>t</sub>，先估计 VAR，再写成由创新 e 驱动的移动平均。单位 trade innovation 对未来累计 quote return 的响应可概念化为：
        </p>
        <div className="equation-card">
          <span>从交易创新到累计价格响应</span>
          <div>z<sub>t</sub>=Σ<sub>k≥0</sub>Ψ<sub>k</sub>e<sub>t−k</sub><br />I(h)=Σ<sub>k=0</sub><sup>h</sup>(Ψ<sub>k</sub>)<sub>return,trade</sub></div>
          <p>I(h) 描述在所选 VAR、滞后与创新识别下，一次不可预测交易冲击到 h 的累计响应。h 很大时的极限有时被解释为交易的信息含量，但估计稳定性和结构含义取决于整个系统。</p>
        </div>
        <p>
          这比把成交后的全部 markout 归给当前交易更严谨，因为可预测流量被单独处理，报价与交易的反馈也进入动态方程。但它仍不是随机实验：变量遗漏、跨市场公共信息、trade-sign 测量误差和创新排序都会改变 IRF（impulse response function，脉冲响应函数）。论文的 1989 年第一季度、80 只 NYSE/AMEX 股票结果支持响应具有延迟、随规模增加但呈凹性、并在宽 spread 状态更大；这些是特定数据与模型下的证据。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="mrr-surprise">
        <p className="section-kicker">22 · MRR 的交易意外</p>
        <h2>若下一笔方向已有部分可预测，只有超出预期的部分进入模型化价值修正；成交摩擦则留在交易价格附近。</h2>
        <p>
          Madhavan–Richardson–Roomans 用一个交易级结构说明“订单方向”与“订单方向创新”的差异。令 x<sub>t</sub>∈{'{'}−1,0,+1{'}'}，并用 ρ<sub>sign</sub>x<sub>t−1</sub> 表示对本期方向的简化预测；下标 sign 强调它是交易方向持续系数。一个常见写法是：
        </p>
        <div className="equation-card">
          <span>价值修正与交易摩擦的模型分层</span>
          <div>μ<sub>t</sub>=μ<sub>t−1</sub>+θ(x<sub>t</sub>−ρ<sub>sign</sub>x<sub>t−1</sub>)+ε<sub>public,t</sub><br />p<sub>t</sub>=μ<sub>t</sub>+φx<sub>t</sub>+ξ<sub>micro,t</sub></div>
          <p>θ 乘交易方向的意外部分，φ 使成交价格偏离模型化有效价值。ε<sub>public</sub> 是公共信息创新，ξ<sub>micro</sub> 表示其他短暂误差。参数含义由该结构和正交条件共同定义。</p>
        </div>
        <p>
          θ 不能直接称为母单 permanent impact，φ 也不能直接称为母单 temporary impact：模型对象是逐笔交易，交易方向过程被特定方式参数化，且价格观测包含噪声。它的真正贡献是说明市场会对“相对预期的订单”定价，而非对每个可预测 child trade 重复做同样更新；这也为 1.10 的 adverse selection 留下接口，而不在本节提前展开做市商完整报价问题。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="state-dependence">
        <p className="section-kicker">23 · 冲击是条件分布</p>
        <h2>数量相同不代表冲击相同；pre-trade depth、spread、volatility、tick、时段和流量历史共同决定边际承接。</h2>
        <p>
          1.06–1.08 已经给出一组必要状态：多档 cumulative depth 决定即时 book walk；resiliency 决定 child orders 之间恢复多少；spread 和 tick 决定离散报价边界；queue imbalance、OFI 与最近方向持续性影响下一次耗尽和其他人的毒性判断。价格 impact 因而更适合写成条件函数，而不是证券上的常数：
        </p>
        <div className="equation-card">
          <span>状态依赖的执行路径</span>
          <div>I=F(Q, u(t), T, depth<sub>0</sub>, spread<sub>0</sub>, resiliency, volatility, order-flow history, venue, news)+noise</div>
          <p>F 的参数可随日内时点和制度改变。只用 Q 的曲线是把其余状态在样本分布上平均掉，不代表它们没有作用。</p>
        </div>
        <p>
          Impact 与 volatility 也不能互换。Impact 是按订单方向对齐的一阶条件均值；volatility 是价格变化幅度或二阶矩。高波动通常意味着更大价格尺度，也可能促使流动性提供者撤远，但一段高波动路径可以对买卖方向完全对称、signed impact 接近零。平方根规格用 σ 做尺度归一化，不是声称“冲击就是波动”。CKS 在短窗中发现 OFI—price-change 斜率随 depth 增加而下降；Hasbrouck 也发现宽 spread 状态响应更大，均支持状态依赖而非单量定律。<Cite n={6} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="concavity">
        <p className="section-kicker">24 · 为什么常见曲线是凹的</p>
        <h2>“数量翻倍、冲击少于翻倍”是稳健经验形状之一，却不能单独识别潜在流动性、策略执行或样本选择中的哪一种机制。</h2>
        <p>
          若 I(Q)=AQ<sup>δ</sup> 且 0&lt;δ&lt;1，则 I 对 Q 递增但边际斜率 AδQ<sup>δ−1</sup> 下降。可能机制包括：价格离当前价值越远，更多 latent supply 愿意进入；执行者观察到更好流动性才选择更大 Q；大母单用更长时间执行，让恢复吸收部分压力；其他参与者逐渐判断流量可预测，从而做出非对称补给；跨股票聚合与归一化也可能塑造曲率。观察到 δ≈1/2 不会在这些机制中自动选出一个。
        </p>
        <div className="equation-card">
          <span>凹的响应与凸的总成本可以共存</span>
          <div>I(Q)=AQ<sup>δ</sup>,　0&lt;δ&lt;1<br />If average concession≈I(Q),　C(Q)=Q·I(Q)=AQ<sup>1+δ</sup></div>
          <p>I 的增长低于线性，但 C 的指数 1+δ&gt;1，仍是超线性。于是“边际价格响应下降”绝不等于“大单每增加一股更便宜”，更不等于总执行成本凹。</p>
        </div>
        <p>
          还要区分横截面导数与因果边际成本。大 Q 订单由不同信号、资产和算法选择，dE[I|Q]/dQ 是条件均值曲线的斜率，不必等于在同一订单路径上额外增加一小份数量的反事实效应。要解释边际决策，需保持状态和执行策略不变，或明确结构模型。<Cite n={12} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="square-root-law">
        <p className="section-kicker">25 · Square-root 是尺度规格，不是自然常数</p>
        <h2>用波动率和日成交占比归一化后，母单峰值常在有限机构订单区间近似平方根；每个词都带条件。</h2>
        <p>
          一个广泛使用的教学基线是：
        </p>
        <div className="equation-card">
          <span>母单指定端点的平方根规格</span>
          <div>I<sub>e</sub>=Y<sub>e</sub>·σ<sub>D</sub>·(Q/V<sub>D</sub>)<sup>δ<sub>e</sub></sup>,　δ<sub>e</sub>≈1/2</div>
          <p>下标 e 表示预先指定的 endpoint：它可以是结束时 signed markout、average execution shortfall 或另一种明确定义的结果，但这些对象不能混称 peak；只有 e 明确取执行结束时参考价，才写 I<sub>peak</sub>。σᴰ 是同口径日波动率，Vᴰ 是日成交量，Q/Vᴰ 无量纲，Y<sub>e</sub> 与 δ<sub>e</sub> 由资产、样本与端点共同决定。若指定 peak 端点且 Y=.8、σ=.02、Q/V=.01，则 δ=.5 时 I=.0016=16 bp。</p>
        </div>
        <p>
          平方根不能外推到 Q→0：tick、spread、最小手数和单笔成交会使连续曲线失效；也不能无条件外推到接近整日成交量的极端 Q，执行者会跨日、改变参与率，市场容量和风险状态也可能内生崩塌。Zarinelli 等在 2007–2009 ANcerno 样本约两个数量级的常见区间看到接近 0.47 的幂律，但跨更宽范围时对数形式拟合更好；Bucci 等又发现极小母单从近线性向较大母单的平方根区间过渡。<Cite n={14} /><Cite n={24} />
        </p>
        <p>
          一个直觉机制来自潜在流动性：若当前价格附近的 latent supply 密度近似随距离线性增加，累计可吸收数量 Q 约与价格位移 Δ² 成正比，于是 Δ∝√Q。Tóth 等用理论、数值模型和专有期货数据支持这条机制；其中 Figure 1 的经验端点是 average execution shortfall，而非结束时 mid。论文本身也强调不同市场、端点与区间会给出不同指数。平方根是需要被解释的经验 regularity，不是已经唯一识别的微观基础。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="impact-surface">
        <p className="section-kicker">26 · Size–Participation–Duration Surface</p>
        <h2>日成交占比相同的两笔单，可以因为速度与执行窗完全不同而面对不同恢复和信息暴露。</h2>
        <p>
          为避免不同论文符号冲突，本节定义：q<sub>D</sub>=Q/V<sub>D</sub> 是日成交占比；POV（percentage of volume，占执行窗市场成交量的参与率）=Q/V<sub>[0,T]</sub>；φ=V<sub>[0,T]</sub>/V<sub>D</sub> 是执行窗市场成交量占全日比例；τ=T/T<sub>D</sub> 是物理时长占比。精确恒等式是 q<sub>D</sub>=POV·φ，而一般不是 q<sub>D</sub>=POV·τ，因为日内成交并不均匀。
        </p>
        <div className="equation-card">
          <span>从单变量曲线到 impact surface</span>
          <div>q<sub>D</sub>=Q/V<sub>D</sub>　；　POV=Q/V<sub>[0,T]</sub>　；　φ=V<sub>[0,T]</sub>/V<sub>D</sub><br />q<sub>D</sub>=POV·φ<br />I/σ<sub>D</sub>=f(q<sub>D</sub>,POV,φ,τ,pre-state)</div>
          <p>两笔单都占日量 1%，一笔十分钟内以 50% 参与率执行，另一笔两小时以 5% 执行；只用 qᴰ 的模型会给相同预测，这只是模型无法区分，不是现实 impact 必然相同。</p>
        </div>
        <p>
          高 POV 表示你在执行窗流量中占比大，其他参与者更容易感知持续方向，恢复也更难在 child orders 之间完成；更长 T 则提供更多恢复时间，却暴露于更多公共信息和 alpha。Zarinelli 的联合结果表明 size、participation 与 duration 形成一张曲面，简单乘积 q<sub>D</sub> 未必吸收全部差异；Bacry 等也发现日参与率之外仍有 duration 因子，短母单的执行轨迹更接近线性、长母单更凹。<Cite n={14} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="average-marginal-peak">
        <p className="section-kicker">27 · Average、Marginal 与 Peak</p>
        <h2>一条冲击曲线可以同时生成三个不同数字；“三分之二”最常见的错误，就是把路径积分误写成长期残留。</h2>
        <p>
          假设母单执行进度 x∈[0,1]，结束时 peak 为 I<sub>peak</sub>，执行中的预期 mid 路径为 I(x)=I<sub>peak</sub>x<sup>δ</sup>，且在 volume time 中均匀成交。仅由这条假设，impact 部分的平均成交让步为：
        </p>
        <div className="equation-card">
          <span>路径平均，而不是永久比例</span>
          <div>I<sub>avg,path</sub>=∫<sub>0</sub><sup>1</sup>I<sub>peak</sub>x<sup>δ</sup>dx=I<sub>peak</sub>/(1+δ)<br />If δ=1/2,　I<sub>avg,path</sub>=2I<sub>peak</sub>/3</div>
          <p>2/3 来自对平方根执行轨迹积分。它没有使用任何执行后的价格，所以不能说明日终、次日或无限期 residual 是 peak 的 2/3。</p>
        </div>
        <p>
          Peak 是结束时参考价位移；average 是所有成交单位面对的平均让步；marginal 是在已给路径和状态下增加一个微小执行单位的成本变化。若总成本 C(q)=2q<sup>3/2</sup>，q=4 时 average C/q=4，而 marginal C′(q)=3√q=6。把 cross-sectional average impact 曲线直接求导并称“边际因果成本”，仍需订单选择和状态可比的额外假设。
        </p>
      </section>

      <section className="lesson-section" id="overlap-coimpact">
        <p className="section-kicker">28 · Overlap 与 Co-impact</p>
        <h2>当多家机构同时交易，自己的成本取决于市场净拥挤；单笔订单的稳定处理假设会被共同价格打破。</h2>
        <p>
          一家机构在买入时，若其他机构也因指数调整、共同因子信号或同一新闻买入，市场看到的是叠加方向压力。你的成交路径会影响他们的报价和速度，他们的流量也会影响你的 VWAP；因此每笔母单并非互不干扰的独立样本。Zarinelli 等报告一个母单平均与多个其他母单重叠，并存在同向倾向；这会让结束后的平台看起来更持久。<Cite n={14} />
        </p>
        <p>
          Bucci 等用 institutional metaorders 研究 co-impact，核心问题是同一资产上同期其他机构的净方向如何改变 focal metaorder 的成本。这仍不同于 cross-impact：co-impact 可以发生在同一资产、多参与者之间；cross-impact 则是资产 j 的流量进入资产 i 的价格。完整跨资产矩阵、共同新闻和套利链留到 7.18；本节只保留一个结论：<strong>估计 self-impact 时若看不到其他人的订单，残差中会混入 crowding，而且误差与自己的交易方向可能相关。</strong><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="propagator">
        <p className="section-kicker">29 · Propagator 与长记忆</p>
        <h2>每个订单事件留下一个随时间变化的核；观测 response 是这个核与未来相关订单流共同卷积后的结果。</h2>
        <p>
          一个离散事件时间 propagator 可以写成：
        </p>
        <div className="equation-card">
          <span>Bare impact kernel</span>
          <div>m<sub>n</sub>=m<sub>0</sub>+Σ<sub>k&lt;n</sub>G(n−k)ε<sub>k</sub>f(q<sub>k</sub>)+ν<sub>exo,n</sub></div>
          <p>εₖ 是事件方向，f(qₖ) 是即时幅度，G(ℓ) 描述该事件在 ℓ 个事件后留下多少模型化影响，ν<sub>exo</sub> 汇总未由该订单流解释的外生价格创新。G 是模型中的 bare kernel；经验 R(ℓ) 还包含未来 ε 与当前 ε 的相关性，通常不等于 G。</p>
        </div>
        <p>
          订单拆分使交易符号自相关缓慢衰减。若 G 永不衰减、每个可预测同向订单都叠加同样影响，价格会呈超扩散趋势；真实价格却在许多尺度上更接近扩散。Bouchaud 等展示了一种协调：订单方向越持久，单事件影响核必须相应衰减，或流动性对可预测方向做非对称调整。在特定线性、平稳 propagator 中，若符号相关 C(ℓ)∼ℓ<sup>−γ</sup>、核 G(ℓ)∼ℓ<sup>−β</sup>，扩散条件可写为 2β+γ=1；它是模型条件，不是跨市场物理恒等式。<Cite n={11} /><Cite n={19} />
        </p>
        <p>
          这解决了一个表面悖论：下一笔订单方向可以相当可预测，价格却不必同样可预测。市场可能通过较小的边际影响、更深的同方向承接、快速反向补单或衰减核吸收预期 flow。要从 R 反推出 G，需要显式去卷积并处理事件类型、数量、状态和模型误设。
        </p>
      </section>

      <section className="lesson-section" id="no-dynamic-arbitrage">
        <p className="section-kicker">30 · No-dynamic-arbitrage</p>
        <h2>Impact 的非线性与 decay 的速度不能各自随意挑选；组合后必须禁止零净仓位路径凭模型自我造利。</h2>
        <p>
          在 transient model 中，可以把价格写成历史交易速度经 impact function f 与 decay kernel G 的卷积。对任何允许的 round trip v(t)，若起点与终点仓位相同，即 ∫v(t)dt=0，模型至少应满足预期执行成本非负：
        </p>
        <div className="equation-card">
          <span>零净仓位路径的内部一致性</span>
          <div>For every admissible v with ∫<sub>0</sub><sup>T</sup>v(t)dt=0,<br />E[C(v)]≥0</div>
          <p>若某条买入—等待—卖出路径在模型里有负成本，交易者可以靠自己先推价再反向交易获利；这叫 price manipulation / dynamic arbitrage。检查的是完整路径，不是单笔方向是否与价格同号。</p>
        </div>
        <p>
          Gatheral 证明在其单资产 transient-impact 设定下，instantaneous impact 的形状与 decay kernel 必须满足联合限制；对 f(v)∝sign(v)|v|<sup>δ</sup>、G(t)∝t<sup>−γ</sup> 的一类规格，一个必要条件是 δ+γ≥1。这个不等式不能脱离模型假设当成普适经验定律，但它清楚说明：拟合很好的凹曲线与很快衰减若机械拼接，可能形成内在矛盾。Huberman–Stanzl 对时间不变永久冲击的线性限制则是同一审计思想的另一版本。<Cite n={9} /><Cite n={10} />
        </p>
        <aside className="precision-note">
          <span>模型套利不等于现实免费午餐</span>
          <p>发现规格允许负期望 round-trip cost，首先证明模型不能同时描述执行与价格路径；现实 spread、fees、仓位约束、其他参与者响应和参数误差仍可能阻止实施。无动态套利是必要的模型卫生检查，不是交易推荐。</p>
        </aside>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">31 · 经典证据地图</p>
        <h2>文献没有给出一条跨尺度常数，而是从不同数据窗口照亮同一动态系统的不同切面。</h2>
        <div className="table-scroll" role="region" aria-label="市场冲击经典实证证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先读对象、样本和端点，再读指数或比例</caption>
            <thead><tr><th scope="col">研究</th><th scope="col">样本与对象</th><th scope="col">主要端点</th><th scope="col">可支持 / 不可外推</th></tr></thead>
            <tbody>
              <tr><th scope="row">Lillo–Farmer–Mantegna 2003</th><td>1995–1998 NYSE TAQ；1000 只大市值股票；约 1.13 亿笔成交</td><td>单笔成交到下一 quote 的响应</td><td>支持单笔即时响应凹及跨股票重标度；不支持母单平方根或衰减比例</td></tr>
              <tr><th scope="row">Almgren et al. 2005</th><td>2001–2003 Citigroup 美股客户单；原始 682,562，严格过滤后 29,509 个 S&amp;P 500 订单</td><td>实现成本 J 与至少 30 分钟后 mid 定义的 I</td><td>临时交易率指数约 .600；对象不是结束时 peak，且样本集中于当时大盘机构单</td></tr>
              <tr><th scope="row">Tóth et al. 2011</th><td>多种期货的近 50 万条 proprietary metaorders，并有理论与数值模型</td><td>Figure 1 以 average execution shortfall 为经验端点；导论另用 first-to-last relative price change 概述常见规格</td><td>支持常见区间的强凹/近平方根和潜在流动性机制；不估计长期 residual</td></tr>
              <tr><th scope="row">Zarinelli et al. 2015</th><td>2007–2009 ANcerno 美股；约 2839 万原始、6,944,883 条过滤后母单</td><td>由一分钟市场价格构造、按日波动率归一化的 start-to-end log-price change，以及最多约数倍 T 的有限期路径</td><td>平方根在局部区间有用，广域对数拟合更好；participation、duration 和 overlap 重要</td></tr>
              <tr><th scope="row">Brokmann et al. 2015</th><td>2011–2013 CFM；约 160 万日度母单及 10–100 日预测信号</td><td>控制后续流量与 alpha 后的多日响应</td><td>孤立冲击显著衰减；依赖完整管理人流量、信号与去卷积假设</td></tr>
              <tr><th scope="row">Bacry et al. 2015</th><td>2010 年大型 broker 在欧洲市场的 398,812 条单日母单</td><td>结束时、日内衰减与日度风险调整路径</td><td>支持 participation–duration 联合作用；不同分析过滤样本不同，日内衰减窗有限</td></tr>
              <tr><th scope="row">Bucci et al. 2018</th><td>2007–2010 ANcerno；约 800 万美国股票母单</td><td>start-to-end、start-to-close 与多日去卷积</td><td>日终平均约 peak 的 2/3，但随规模变；长期估计约 peak 的三成且对规格高度敏感</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          表中最值得记住的不是某个指数，而是<strong>测量对象怎样决定结论</strong>。Lillo 的 Q 是单笔成交规模，Almgren 的 temporary 是 J−I/2；Tóth 的导论规格谈 first-to-last price change，但 Figure 1 的专有期货结果用 average execution shortfall；Zarinelli 的 peak 是用一分钟市场价格构造并按日波动率归一化的 start-to-end log-price change，不是 quote mid；Brokmann 的“孤立”需要交易信号与后续流量去卷积。把它们画在同一张 “impact vs Q” 图上而不保留端点，会产生一种并不存在的统一定律。<Cite n={4} /><Cite n={12} /><Cite n={13} /><Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} />
        </p>
        <div className="research-card">
          <span>READ THE ESTIMAND</span>
          <h3>“短期约 2/3、数周约 1/3、孤立机械影响趋零”可以同时成立</h3>
          <p><strong>原因：</strong>它们可能分别指某些条件下日终相对 peak 的残留、多日去卷积后的长期量、以及控制交易 alpha 与后续同向流后的孤立分量；分母、终点和识别假设不同。</p>
          <p><strong>禁止改写：</strong>“所有订单完成后永久留下峰值的 2/3”。没有任何上述研究支持这条无条件常数。</p>
        </div>
      </section>

      <section className="lesson-section" id="data-estimation">
        <p className="section-kicker">32 · 数据与估计协议</p>
        <h2>母单重建、端点时间、当日尺度和完成样本只要错一层，漂亮 impact curve 就可能是选择偏差与前视信息的合成物。</h2>
        <p>
          最理想的数据直接提供 parent-order identifier、投资者或 broker、方向、目标量、decision/arrival/end timestamps、每笔成交、取消/剩余、算法参数和决策信号。公开逐笔成交通常没有母单身份；把同一 broker—股票—方向—日期的成交聚成一单，会把不同客户合并，也会把跨日同一决定拆开。交易方向若由 Lee–Ready 等算法推断，又引入与价差位置和时间戳相关的分类误差；因此分类规则、quote lag 与无法分类比例都应作为测量协议报告，而不能把推断符号当成真值。<Cite n={25} />
        </p>
        <div className="table-scroll" role="region" aria-label="价格冲击数据审计清单，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>在拟合任何 impact curve 前固定的协议</caption>
            <thead><tr><th scope="col">层</th><th scope="col">必须预先固定</th><th scope="col">典型失败</th></tr></thead>
            <tbody>
              <tr><th scope="row">母单</th><td>grouping key、跨日规则、买卖符号、target 与 executed Q</td><td>把多名客户合并，或只保留完成订单</td></tr>
              <tr><th scope="row">基准</th><td>decision / arrival / first-trade mid；单场所或全市场</td><td>把订单释放前 alpha 算入执行 impact</td></tr>
              <tr><th scope="row">终点</th><td>end、hT、固定分钟、close、next-day；quote 对齐</td><td>选择最漂亮的平台再命名 permanent</td></tr>
              <tr><th scope="row">尺度</th><td>价格单位、σ、ADV、volume-time 与日内季节性</td><td>用当日收盘后才知道的最终 σ、V 做 ex ante 模型</td></tr>
              <tr><th scope="row">并发</th><td>其他母单、市场 OFI、新闻、相关资产和 auction</td><td>把 crowding 与公共信息全归给 focal order</td></tr>
              <tr><th scope="row">验证</th><td>日期切分、资产切分、状态分层、残差和容量</td><td>随机拆分重叠路径，训练测试共享同一订单</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Ex ante 模型只能使用决策时可得的预测 ADV、波动率和流动性；用整日最终 V<sub>D</sub> 或 σ<sub>D</sub> 训练实时调度会泄漏未来。Ex post 交易成本分析可以使用实现日量做描述，但必须明确这是事后归一化。市场 VWAP 还包含自己的成交，高参与率订单会机械改变 benchmark；相对 VWAP 的优秀表现不等于没有 impact。
        </p>
        <aside className="precision-note">
          <span>价格单位与数量单位必须成对报告</span>
          <p>回归系数可以是美元/股、bp/千股、波动率单位/√ADV fraction 或 tick/contract。任何“λ 下降 20%”都必须连同 reference price、lot multiplier、公司行动、货币、日量口径和时钟一起解释。</p>
        </aside>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先算可观察成本，再决定证据是否足以命名为 impact。</h2>
        <p>
          第一组从扫簿 VWAP、部分成交 shortfall、peak–decay 路径和平均—边际成本开始；第二组转向反事实、平方根尺度、size–participation–duration surface 与无动态套利。每题提交前只显示原始事实，作答后才显示计算和识别边界。
        </p>
        <PriceImpactLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 反例库</p>
        <h2>大单可以几乎不动价格，小单也可以伴随巨幅价格变化；这不是理论失效，而是条件与反事实在起作用。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>大 Q、低 impact</h3><p>订单在深厚市场中低参与率执行，期间 latent supply 和跨场所套利持续补给；绝对数量大但相对容量小。</p></article>
          <article><span>反例 02</span><h3>小 Q、大 markout</h3><p>交易恰逢盈利预警或期货先跳，未来价格大幅变化主要来自共同信息；observed response 不等于 self-impact。</p></article>
          <article><span>反例 03</span><h3>Mid 不动、成本为正</h3><p>小买单在 ask 成交但 quote 不变；买方支付半个 spread，VWAP slippage 存在，post-trade mid impact 为零。</p></article>
          <article><span>反例 04</span><h3>价格回原位、执行仍昂贵</h3><p>母单执行中一路向上成交，结束后流动性恢复使 mid 回落；temporary path cost 已经真实支付。</p></article>
          <article><span>反例 05</span><h3>残留平台不是永久</h3><p>同一 alpha 驱动次日继续买入，其他机构也拥挤在同方向；有限窗平台由后续 flow 和信号共同维持。</p></article>
          <article><span>反例 06</span><h3>平方根拟合好、执行模型仍错</h3><p>曲线拟合的是结束时 mid，却被算法当作平均成交成本；端点错位会系统性低估或高估总成本。</p></article>
        </div>
        <p>
          反例还揭示 impact 与信息的双向因果：交易者根据预期价格和流动性选择 Q、T 与 POV，市场又根据观测到的路径更新信念；价格一变，执行算法可能加速、减速或停止。于是 Q 不是外生剂量，T 也不是事后无害的控制变量。把它们直接放进回归，得到的是均衡选择后的条件关系，除非额外设计能隔离一条方向明确的变化。
        </p>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 可证伪研究设计</p>
        <h2>把“这笔单造成多少 impact”改写成一个指定路径、期限、状态、对照与失败条件的问题。</h2>
        <p>
          一个可执行的第一阶段问题可以写成：对某一资产—场所—交易阶段的完整机构母单，以 arrival mid 为起点、end mid 与 end+30min mid 为两个结果，q<sub>D</sub>、POV、φ、T、pre-depth、spread、volatility、过去 OFI 和其他同期机构净流为输入，能否在严格更晚日期中稳定解释 signed peak 与 finite-horizon residual？这仍是条件 response 模型，但它先建立变量、样本和外推边界，再讨论因果。
        </p>
        <div className="table-scroll" role="region" aria-label="市场冲击可证伪研究协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从描述到因果的分层协议</caption>
            <thead><tr><th scope="col">模块</th><th scope="col">预先固定</th><th scope="col">失败条件</th></tr></thead>
            <tbody>
              <tr><th scope="row">Estimand</th><td>完整路径 a、方向、参考价、end 与 h、总效应或直接效应</td><td>研究结束后更换端点以获得平台</td></tr>
              <tr><th scope="row">样本</th><td>目标单、取消/部分成交、auction/news、资产与日期范围</td><td>只保留完成、盈利或可成功重建的订单</td></tr>
              <tr><th scope="row">状态</th><td>决策时可得的 depth、spread、σ、ADV、OFI、信号代理</td><td>使用执行后或当日结束才知道的尺度</td></tr>
              <tr><th scope="row">并发</th><td>重叠母单、市场总流量、相关资产与公共新闻</td><td>focal order 方向与遗漏流量仍系统相关</td></tr>
              <tr><th scope="row">验证</th><td>按日期 walk-forward、母单级 group split、状态分层、校准与残差</td><td>换时期、资产或参与率区间即崩溃</td></tr>
              <tr><th scope="row">Placebo</th><td>伪开始时点、未来订单、方向错位、无交易 matched windows</td><td>placebo 得到同样“impact curve”</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因果层需要额外变化源。最强情形是在风险和合规允许的执行域内，对等价 child-order timing 或参与率做预先随机的小扰动，比较相同初始状态的结果；但市场干扰意味着其他参与者会响应，估计的是包含诱发反应的总效应。准实验可以利用预定指数再平衡、机械资金流或执行系统的外生延迟，却必须证明它们不通过其他渠道直接影响价格。Matching、propensity score（倾向得分，即给定已观测状态后接受某种执行策略的估计概率）与灵活回归只能平衡已观测状态，不能消除未观测 alpha。
        </p>
        <div className="equation-card">
          <span>一个最小的局部因果问题：ATE（average treatment effect，平均处理效应）</span>
          <div>ATE<sub>h</sub>(POV<sub>H</sub>,POV<sub>L</sub>|z)=E[s·{'{'}m<sub>t+h</sub>(POV<sub>H</sub>)−m<sub>t+h</sub>(POV<sub>L</sub>){'}'} | Z<sub>t</sub>=z]</div>
          <p>比较的是同一合格状态 z 下两种执行参与率策略，而不是“有单”对“整个世界无单”。结果只对该策略差、该 h 和该合格样本成立；更大的 Q、危机状态或另一场所都需要重新验证。</p>
        </div>
        <p>
          研究结论要按证据等级书写：路径图说明 observed response；样本外模型说明条件关系可迁移；自然实验或随机扰动在假设下支持局部因果；无动态套利只说明模型内部一致；成本后执行改进才说明业务价值。前一级成立不会自动推出后一级。
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>先独立复算与判断口径，再展开答案。</h2>
        <div className="exercise-list">
          <article className="practice-problem">
            <span>练习一 · 扫簿、VWAP 与新 mid</span>
            <p><strong>题目。</strong>初始 bid=100.00；ask 为 400@100.01、600@100.02、1,000@100.04。立即买入 1,200 股。计算 VWAP、相对初始 mid 的 slippage，以及成交后的 best ask 与 mid。忽略补单、撤单和费用。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>成交 400@100.01、600@100.02、200@100.04。总现金额为 40,004+60,012+20,008=120,024，所以 VWAP=120,024/1,200=100.02。初始 mid=(100.00+100.01)/2=100.005，slippage=(100.02/100.005−1)×10,000≈1.4999 bp。100.04 档余 800 股，best ask=100.04；bid 若不变，新 mid=(100.00+100.04)/2=100.02，同样比初始 mid 高约 1.4999 bp。这个相等只属于本题簿形，不是一般规律。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习二 · 部分成交 Implementation Shortfall</span>
            <p><strong>题目。</strong>计划买 10,000 股，decision price=50.00；成交 6,000 股、均价 50.08，余下 4,000 股在评价时点价格为 50.20。忽略费用。计算美元 shortfall、每目标股成本和相对目标名义金额的 bp；指出只看已成交部分会漏掉什么。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>已成交成本=6,000×0.08=$480；未成交机会成本=4,000×0.20=$800；总 IS=$1,280。每目标股=$0.128；相对 $500,000 目标名义金额为 1,280/500,000×10,000=25.6 bp。只看已成交会报告 $480，并删除 $800 机会成本，错误奖励未完成。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习三 · Spread 恒等式与解释边界</span>
            <p><strong>题目。</strong>主动买在 100.03，成交前 mid=100.00，固定未来期限的 mid=100.02。按 full-spread 口径计算 ES、PI、RS，并说明哪一步只是代数、哪一步需要经济假设。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>ES=2×(100.03−100.00)=$0.06≈6 bp；PI=2×(100.02−100.00)=$0.04≈4 bp；RS=2×(100.03−100.02)=$0.02≈2 bp，所以 ES=PI+RS 是精确代数。把 PI 解释为信息、RS 解释为做市利润，则需要期限足以消化信息、mid 可实现、且忽略库存、费用、对冲和其他价格变化等假设。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习四 · Size、POV 与平方根尺度</span>
            <p><strong>题目。</strong>Q=100,000，V<sub>D</sub>=5,000,000，执行窗市场成交量=300,000，T=30 分钟、交易日 390 分钟。计算 q<sub>D</sub>、POV、φ、τ，验证 q<sub>D</sub>=POV·φ，并检查 q<sub>D</sub> 是否等于 POV·τ。若明确的 peak model 使用 Y=.5、σ<sub>D</sub>=2%、δ=.5，再算 peak。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>qᴰ=100,000/5,000,000=.02；POV=100,000/300,000=1/3；φ=300,000/5,000,000=.06；τ=30/390≈.076923。POV·φ=(1/3)×.06=.02=qᴰ；POV·τ≈.02564，不等于 qᴰ，因为成交量并非按物理时间均匀。Iₚₑₐₖ=.5×.02×√.02≈.0014142=14.14 bp。它只属于给定 peak 规格。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习五 · Average、Peak 与有限期 Residual</span>
            <p><strong>题目。</strong>假设母单执行中 I(x)=30√x bp，x 是完成比例。计算均匀 volume-time 成交的平均路径 impact。若结束后某固定时点 residual=18 bp，再算已回落幅度和 residual ratio；能否据此称永久冲击为 18 bp？</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>平均路径 impact=∫₀¹30√x dx=30×2/3=20 bp。Peak=30 bp，有限期已回落 30−18=12 bp，residual ratio=18/30=60%。18 bp 只能称该固定期限的 residual；不知道更长期路径、后续 flow 与反事实，不能称永久冲击。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>能够回答这些问题，才算真正掌握定义、模型与证据边界。</h2>
        <div className="check-grid">
          <details><summary>01 · Execution cost、price response 与 causal impact 的核心差异是什么？</summary><p>Execution cost 比较真实成交组合与某个基准；response 是给定交易事件后的条件平均路径；causal impact 比较同一初始状态下有这条交易路径与无它的潜在价格。前两者可观测或估计，第三个需要反事实识别。</p></details>
          <details><summary>02 · 为什么单笔成交的 impact curve 不能直接用于机构母单？</summary><p>母单由持续、内生选择的 child orders 组成，期间有恢复、其他订单和策略调整；单笔成交的数量、端点与选择过程均不同。</p></details>
          <details><summary>03 · 结束后 30 分钟仍有 70% residual，为何不能叫 70% permanent？</summary><p>有限窗口不能证明无限期极限；残留还可能包含交易 alpha、公共新闻、后续同向订单和 crowding。</p></details>
          <details><summary>04 · 为什么 qᴰ=POV·φ，而一般不等于 POV·τ？</summary><p>POV 的分母是执行窗市场成交量，φ 是该成交量占全日成交量的比例，两者乘积代数上等于 Q/Vᴰ；τ 是物理时间占比，只有成交量均匀时才与 φ 相同。</p></details>
          <details><summary>05 · 凹的 impact curve 为什么不意味着总成本凹？</summary><p>若平均让步 I(Q)∝Qᵟ、0&lt;δ&lt;1，总成本 QI(Q)∝Q¹⁺ᵟ，仍超线性。边际响应下降与总支出增长是不同命题。</p></details>
          <details><summary>06 · Kyle λ 为什么不是通用母单成本系数？</summary><p>它来自特定知情者—噪声流—竞争做市者均衡，是总订单流的价格敏感度；实证回归斜率与个人母单 self-impact 需要不同变量和结构假设。</p></details>
          <details><summary>07 · Propagator 中的 G(ℓ) 为什么不等于经验 R(ℓ)？</summary><p>G 是单事件的模型化 bare kernel；R 还卷入未来订单符号与当前符号的相关性、数量和其他事件，所以是 dressed response。</p></details>
          <details><summary>08 · 无动态套利最低要求是什么？</summary><p>所有允许的期末净仓位为零的 round trips，其模型预期执行成本不得为负；这会联合约束 impact 形状与 decay kernel。</p></details>
          <details><summary>09 · 同样 Q/Vᴰ 为什么不保证相同 impact？</summary><p>参与率、持续时间、日内时点、depth、spread、resiliency、volatility、同期流量和信息状态都可能不同；size-only model 把这些差异平均掉。</p></details>
          <details><summary>10 · “文献发现日终约为 peak 的 2/3”最容易被怎样误写？</summary><p>被误写成所有订单的永久冲击恒等于 peak 的 2/3。正确表述必须带上样本、规模/参与率条件、日终端点、重叠母单和后续去卷积边界。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节解释“压力怎样进入价格路径”；下一步才把信念更新、报价主体和更外层反馈分别展开。</h2>
        <div className="interface-grid">
          <article><span>← 1.08</span><h3>Order Flow / OFI</h3><p>上一节构造带方向事件账本；本节把 flow、状态与执行路径连接到价格、成本和恢复。</p></article>
          <article><span>→ 1.10</span><h3>Adverse Selection</h3><p>将完整推导流动性提供者怎样从交易方向更新后验价值，以及为何担心 informed trader。</p></article>
          <article><span>→ 2.08</span><h3>Market Maker / HFT Agent</h3><p>把速度、延迟、排队和冲击放进具体参与者的目标函数、技术能力与策略反应。</p></article>
          <article><span>→ 7.11</span><h3>Liquidity Spiral</h3><p>把局部 impact 扩展到抛售、价格下跌、保证金、资产负债表收缩与更多抛售的正反馈。</p></article>
        </div>
        <p className="closing-thesis">看到“某订单推动价格”时，应依次追问：对象是 trade、child order、metaorder 还是 aggregate flow；结果是 VWAP、shortfall、markout、response 还是反事实 impact；起点与终点是什么；Q 相对哪种容量；速度、参与率、持续时间和 pre-state 如何；同期流量与交易 alpha 是否可见；temporary / permanent 属于哪套语言；模型是否允许自我操纵；证据能否跨样本成立。只有这些问题有明确答案，market impact 才从一句市场直觉变成可测量、可识别、可用于执行又不会越界的机制。</p>
      </section>
    </>
  );
}

export const lesson109: LessonRecord = {
  slug: '1-09',
  id: '1.09',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Price Impact：订单为什么推动价格',
  subtitle: '从机械扫簿、执行成本与反事实定义出发，区分 response、temporary、persistent 与 causal impact，并把规模、速度、恢复、信息和模型一致性放回同一动态系统',
  readingTime: '约 85–90 分钟（核心阅读 54–56＋互动 12–14＋主动练习与检查 19–20）',
  prerequisite: '1.06 · Liquidity、1.07 · Market Depth 与 Resiliency、1.08 · Order Flow；按需回看 T06 Balance Sheet 与 T08 Time Scale',
  updatedAt: '2026-08-28',
  revision: '1.09-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.09-r1',
      summary: '要求纠正 Tóth 自有期货实证与 Zarinelli 母单研究的测量端点，修正冻结簿边界和 Bucci 期刊年份，统一 temporary、恢复、方向持续、参与率与外生噪声的符号，并补充 Lee–Ready 来源。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.09-r1',
      summary: '要求补齐 aggregate-flow 第四尺度卡、统一参与率符号、移除互动题预提交答案泄露，并为 alpha、TWAP、sinh、去卷积、IRF、ADV、propensity score、ATE 与 POV 补首见释义。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.09-r2',
      summary: '确认 r1 的端点、年份、符号与引用问题均已解决；要求把通用平方根式从 I_peak 改成显式 endpoint 记号，并把成交价中的 spread 与 fee 写成同量纲的独立加项。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.09-r2',
      summary: '四尺度地图、术语首见、统一 POV 符号、prediction-first 互动、39 节教学坡度、练习检查、可访问性与课程边界全部回归通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.09-r3',
      summary: '因果对象、执行成本、AC 与 transient 模型、Tóth/Zarinelli 端点、平方根 endpoint 记号、符号量纲、25 条来源、5 道练习与 8 道互动数值全部回归通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.09-r3',
      summary: '39 节机制坡度、四尺度地图、首见术语、公式白话、统一符号、prediction-first 互动、练习检查、可访问性与相邻课程边界全部回归通过，未发现 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-08', label: '1.08 Order Flow 与 Order Flow Imbalance' },
  next: { slug: '1-10', label: '1.10 Adverse Selection 与 Informed Trading' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'object-map', label: '五个对象' },
    { id: 'causal-estimand', label: '因果 Estimand' },
    { id: 'units-of-analysis', label: '四种尺度' },
    { id: 'benchmarks-horizons', label: '基准与时钟' },
    { id: 'book-walking', label: '机械 Book Walking' },
    { id: 'fill-quote-separation', label: '成交与报价' },
    { id: 'implementation-shortfall', label: 'Implementation Shortfall' },
    { id: 'cost-decomposition', label: '成本归因' },
    { id: 'response-vs-impact', label: 'Response ≠ Impact' },
    { id: 'mechanical-information', label: 'Mechanical / Information' },
    { id: 'temporary-permanent-map', label: 'Temporary / Permanent' },
    { id: 'spread-identity', label: 'Spread 恒等式' },
    { id: 'ac-model', label: 'AC 状态模型' },
    { id: 'temporary-channel', label: 'Temporary Channel' },
    { id: 'permanent-channel', label: 'Permanent Channel' },
    { id: 'risk-speed-tradeoff', label: '成本—风险前沿' },
    { id: 'transient-resilience', label: 'Transient & Resilience' },
    { id: 'peak-decay-residual', label: 'Peak / Decay / Residual' },
    { id: 'decay-identification', label: '衰减识别' },
    { id: 'kyle-lambda', label: 'Kyle λ' },
    { id: 'hasbrouck-response', label: 'Hasbrouck Response' },
    { id: 'mrr-surprise', label: 'MRR 交易意外' },
    { id: 'state-dependence', label: '状态依赖' },
    { id: 'concavity', label: '凹性' },
    { id: 'square-root-law', label: 'Square-root' },
    { id: 'impact-surface', label: 'Impact Surface' },
    { id: 'average-marginal-peak', label: 'Average / Marginal / Peak' },
    { id: 'overlap-coimpact', label: 'Overlap & Co-impact' },
    { id: 'propagator', label: 'Propagator' },
    { id: 'no-dynamic-arbitrage', label: 'No-dynamic-arbitrage' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'data-estimation', label: '数据与估计协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson109Content,
  references: [
    {
      id: 1,
      authors: 'André F. Perold',
      year: '1988',
      title: 'The Implementation Shortfall: Paper versus Reality',
      publication: 'Journal of Portfolio Management, 14(3), 4–9',
      url: 'https://doi.org/10.3905/jpm.1988.409150',
      use: 'Implementation shortfall 的原始 paper-versus-reality 框架；总 shortfall 包含已成交成本、未成交机会与执行延迟，不等于纯 impact。',
    },
    {
      id: 2,
      authors: 'Dimitris Bertsimas & Andrew W. Lo',
      year: '1998',
      title: 'Optimal Control of Execution Costs',
      publication: 'Journal of Financial Markets, 1(1), 1–50',
      url: 'https://doi.org/10.1016/S1386-4181(97)00012-8',
      use: '固定期限执行成本的动态控制与等额切片基础特例；不支持在随机流动性、alpha 与限价执行下无条件使用 TWAP。',
    },
    {
      id: 3,
      authors: 'Robert Almgren & Neil Chriss',
      year: '2001',
      title: 'Optimal Execution of Portfolio Transactions',
      publication: 'Journal of Risk, 3(2), 5–39',
      url: 'https://doi.org/10.21314/JOR.2001.041',
      use: 'Permanent / temporary model impact、库存风险、执行成本—方差有效前沿与线性常参数轨迹。',
    },
    {
      id: 4,
      authors: 'Robert Almgren, Chee Thum, Emmanuel Hauptmann & Hong Li',
      year: '2005',
      title: 'Equity Market Impact',
      publication: 'Risk, 18(7), 57–62',
      url: 'https://www.risk.net/derivatives/structured-products/1500270/equity-market-impact',
      use: 'Citigroup 美股机构订单的实现成本、模型永久项与 J−I/2 临时项；过滤样本和 3/5 交易率指数不能外推为普适常数。',
    },
    {
      id: 5,
      authors: 'Albert S. Kyle',
      year: '1985',
      title: 'Continuous Auctions and Insider Trading',
      publication: 'Econometrica, 53(6), 1315–1335',
      url: 'https://doi.org/10.2307/1913210',
      use: '知情交易、噪声流与竞争做市者均衡中的线性价格响应和 inverse depth；理论 λ 不是通用母单成本系数。',
    },
    {
      id: 6,
      authors: 'Joel Hasbrouck',
      year: '1991',
      title: 'Measuring the Information Content of Stock Trades',
      publication: 'Journal of Finance, 46(1), 179–207',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
      use: '交易与报价 VAR、trade innovation 和累计响应；IRF 的结构含义依赖变量、滞后与创新识别。',
    },
    {
      id: 7,
      authors: 'Ananth Madhavan, Matthew Richardson & Mark Roomans',
      year: '1997',
      title: 'Why Do Security Prices Change? A Transaction-Level Analysis of NYSE Stocks',
      publication: 'Review of Financial Studies, 10(4), 1035–1064',
      url: 'https://doi.org/10.1093/rfs/10.4.1035',
      use: '逐笔交易方向创新、公共信息、模型化有效价值与交易摩擦的分层；θ、φ 不等于母单 permanent / temporary。',
    },
    {
      id: 8,
      authors: 'Anna A. Obizhaeva & Jiang Wang',
      year: '2013',
      title: 'Optimal Trading Strategy and Supply/Demand Dynamics',
      publication: 'Journal of Financial Markets, 16(1), 1–32',
      url: 'https://doi.org/10.1016/j.finmar.2012.09.001',
      use: '动态订单簿深度与恢复速度进入 transient impact 和最优执行；模型簿形不是所有市场的经验事实。',
    },
    {
      id: 9,
      authors: 'Jim Gatheral',
      year: '2010',
      title: 'No-Dynamic-Arbitrage and Market Impact',
      publication: 'Quantitative Finance, 10(7), 749–759',
      url: 'https://doi.org/10.1080/14697680903373692',
      use: 'Transient impact 的即时函数与衰减核必须联合排除动态操纵；幂律不等式只属于论文设定。',
    },
    {
      id: 10,
      authors: 'Gur Huberman & Werner Stanzl',
      year: '2004',
      title: 'Price Manipulation and Quasi-Arbitrage',
      publication: 'Econometrica, 72(4), 1247–1275',
      url: 'https://doi.org/10.1111/j.1468-0262.2004.00531.x',
      use: '时间不变永久冲击下排除 quasi-arbitrage 对线性形状的限制；这是模型一致性，不是经验线性定律。',
    },
    {
      id: 11,
      authors: 'Jean-Philippe Bouchaud, Yuval Gefen, Marc Potters & Matthieu Wyart',
      year: '2004',
      title: 'Fluctuations and Response in Financial Markets: The Subtle Nature of “Random” Price Changes',
      publication: 'Quantitative Finance, 4(2), 176–190',
      url: 'https://doi.org/10.1088/1469-7688/4/2/007',
      use: 'Propagator、bare kernel、订单符号长记忆与近扩散价格之间的协调；指数关系是模型条件。',
    },
    {
      id: 12,
      authors: 'Fabrizio Lillo, J. Doyne Farmer & Rosario N. Mantegna',
      year: '2003',
      title: 'Master Curve for Price-Impact Function',
      publication: 'Nature, 421, 129–130',
      url: 'https://doi.org/10.1038/421129a',
      use: 'NYSE 单笔成交到下一报价响应的凹性与跨股票尺度塌缩；不能改写为机构母单平方根。',
    },
    {
      id: 13,
      authors: 'Bence Tóth, Yves Lempérière, Cyril Deremble, Joachim de Lataillade, Julien Kockelkoren & Jean-Philippe Bouchaud',
      year: '2011',
      title: 'Anomalous Price Impact and the Critical Nature of Liquidity in Financial Markets',
      publication: 'Physical Review X, 1, 021006',
      url: 'https://doi.org/10.1103/PhysRevX.1.021006',
      use: '潜在流动性在现价附近变薄所生成的平方根机制、模型与期货母单证据；不提供长期永久比例。',
    },
    {
      id: 14,
      authors: 'Elia Zarinelli, Michele Treccani, J. Doyne Farmer & Fabrizio Lillo',
      year: '2015',
      title: 'Beyond the Square Root: Evidence for Logarithmic Dependence of Market Impact on Size and Participation Rate',
      publication: 'Market Microstructure and Liquidity, 1(2), 1550004',
      url: 'https://doi.org/10.1142/S2382626615500045',
      use: 'ANcerno impact surface、平方根局部适用域、广域对数拟合、participation / duration 与有限窗 residual。',
    },
    {
      id: 15,
      authors: 'Xavier Brokmann, Emmanuel Sérié, Julien Kockelkoren & Jean-Philippe Bouchaud',
      year: '2015',
      title: 'Slow Decay of Impact in Equity Markets',
      publication: 'Market Microstructure and Liquidity, 1(2), 1550007',
      url: 'https://doi.org/10.1142/S2382626615500070',
      use: '用单一管理人的多日交易流与预测信号去卷积表观平台；孤立响应衰减结论依赖完整流量和 alpha。',
    },
    {
      id: 16,
      authors: 'Emmanuel Bacry, Adrian Iuga, Matthieu Lasnier & Charles-Albert Lehalle',
      year: '2015',
      title: 'Market Impacts and the Life Cycle of Investors Orders',
      publication: 'Market Microstructure and Liquidity, 1(2), 1550009',
      url: 'https://doi.org/10.1142/S2382626615500094',
      use: '欧洲 broker 母单的 peak、轨迹、duration 与日内/日度衰减；各分析使用不同过滤样本。',
    },
    {
      id: 17,
      authors: 'Frédéric Bucci, Michael Benzaquen, Fabrizio Lillo & Jean-Philippe Bouchaud',
      year: '2018',
      title: 'Slow Decay of Impact in Equity Markets: Insights from the ANcerno Database',
      publication: 'Market Microstructure and Liquidity, 4(03n04), 1950006',
      url: 'https://doi.org/10.1142/S2382626619500060',
      use: '约 800 万 ANcerno 母单的日终与多日衰减、订单符号记忆和长期极限的规格敏感性。',
    },
    {
      id: 18,
      authors: 'Frédéric Bucci, Iacopo Mastromatteo, Zoltán Eisler, Fabrizio Lillo, Jean-Philippe Bouchaud & Charles-Albert Lehalle',
      year: '2020',
      title: 'Co-Impact: Crowding Effects in Institutional Trading Activity',
      publication: 'Quantitative Finance, 20(2), 193–205',
      url: 'https://doi.org/10.1080/14697688.2019.1660398',
      use: '同一资产上同期机构母单的 crowding / co-impact；不可见其他流量会污染个人 self-impact 估计。',
    },
    {
      id: 19,
      authors: 'Fabrizio Lillo & J. Doyne Farmer',
      year: '2004',
      title: 'The Long Memory of the Efficient Market',
      publication: 'Studies in Nonlinear Dynamics & Econometrics, 8(3), 1–35',
      url: 'https://doi.org/10.2202/1558-3708.1226',
      use: 'LSE 订单方向长记忆与流动性适应；可预测 flow 不自动推出可预测 return。',
    },
    {
      id: 20,
      authors: 'Rama Cont, Arseniy Kukanov & Sasha Stoikov',
      year: '2014',
      title: 'The Price Impact of Order Book Events',
      publication: 'Journal of Financial Econometrics, 12(1), 47–88',
      url: 'https://doi.org/10.1093/jjfinec/nbt003',
      use: '短窗 OFI 与价格变化、inverse-depth scaling 和全事件账本；同窗斜率不是个人母单因果冲击。',
    },
    {
      id: 21,
      authors: 'Lawrence R. Glosten & Paul R. Milgrom',
      year: '1985',
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      publication: 'Journal of Financial Economics, 14(1), 71–100',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
      use: '订单方向怎样进入流动性提供者的条件价值更新；不意味着每一笔交易都含私人信息。',
    },
    {
      id: 22,
      authors: 'Marc Potters & Jean-Philippe Bouchaud',
      year: '2003',
      title: 'More Statistical Properties of Order Books and Price Impact',
      publication: 'Physica A, 324(1–2), 133–140',
      url: 'https://doi.org/10.1016/S0378-4371(02)01896-4',
      use: '订单簿与成交响应的早期经验形状，支持凹性与流动性尺度讨论；样本结果不是母单因果曲线。',
    },
    {
      id: 23,
      authors: 'Terrence Hendershott, Charles M. Jones & Albert J. Menkveld',
      year: '2011',
      title: 'Does Algorithmic Trading Improve Liquidity?',
      publication: 'Journal of Finance, 66(1), 1–33',
      url: 'https://doi.org/10.1111/j.1540-6261.2010.01624.x',
      use: 'Effective spread、realized spread 与有限期 price impact 的统一口径，以及算法交易与流动性的因果识别边界。',
    },
    {
      id: 24,
      authors: 'Frédéric Bucci, Michael Benzaquen, Fabrizio Lillo & Jean-Philippe Bouchaud',
      year: '2019',
      title: 'Crossover from Linear to Square-Root Market Impact',
      publication: 'Physical Review Letters, 122, 108302',
      url: 'https://doi.org/10.1103/PhysRevLett.122.108302',
      use: '机构母单在较小规模的近线性与较大规模的平方根区间之间出现 crossover；反对从零到极端数量使用单一幂律。',
    },
    {
      id: 25,
      authors: 'Charles M. C. Lee & Mark J. Ready',
      year: '1991',
      title: 'Inferring Trade Direction from Intraday Data',
      publication: 'Journal of Finance, 46(2), 733–746',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
      use: '由成交价与报价推断主动买卖方向的经典规则；trade-sign 分类依赖 quote 对齐和数据时间戳，推断结果不能当作无误真值。',
    },
  ],
  readingList: [
    {
      title: 'The Implementation Shortfall: Paper versus Reality',
      scope: '成本起点 · Perold（1988），读 paper portfolio、real portfolio 与短缺来源',
      reason: '先把总执行结果和纯 market impact 分开，并理解未成交为什么不是零成本。',
      url: 'https://doi.org/10.3905/jpm.1988.409150',
    },
    {
      title: 'Optimal Execution of Portfolio Transactions',
      scope: '执行模型 · Almgren–Chriss（2001），读 permanent / temporary functions、成本方差与 efficient frontier',
      reason: '亲自核对模型术语为何不能直接等同于事件研究中的 peak / residual。',
      url: 'https://doi.org/10.21314/JOR.2001.041',
    },
    {
      title: 'Equity Market Impact',
      scope: '机构实证 · Almgren、Thum、Hauptmann、Li（2005），读定义、过滤、J−I/2 与参数表',
      reason: '理解经典 3/5 指数属于哪个成本对象、哪些订单和哪个历史制度。',
      url: 'https://www.risk.net/derivatives/structured-products/1500270/equity-market-impact',
    },
    {
      title: 'Continuous Auctions and Insider Trading',
      scope: '均衡基础 · Kyle（1985），重点读单期线性均衡、λ、noise trading 与 continuous auction',
      reason: '把 inverse depth、信息吸收和经验执行成本系数严格区分。',
      url: 'https://doi.org/10.2307/1913210',
    },
    {
      title: 'Measuring the Information Content of Stock Trades',
      scope: '动态响应 · Hasbrouck（1991），读 VAR/VMA、trade innovations 与 cumulative response',
      reason: '理解 raw markout、预期订单流和模型化 ultimate response 的差异。',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
    },
    {
      title: 'Anomalous Price Impact and the Critical Nature of Liquidity in Financial Markets',
      scope: '平方根机制 · Tóth et al.（2011），读 latent-liquidity V 形、metaorder definition 与 empirical figures',
      reason: '理解平方根如何从近价潜在供给生成，同时保留 tick、小 Q 与终点边界。',
      url: 'https://doi.org/10.1103/PhysRevX.1.021006',
    },
    {
      title: 'Beyond the Square Root',
      scope: '规格审计 · Zarinelli et al.（2015），读 filters、power / log fits、impact surface 与 decay',
      reason: '看清一个有用经验定律怎样在更广尺度与 participation / duration 条件下系统偏离。',
      url: 'https://doi.org/10.1142/S2382626615500045',
    },
    {
      title: 'Slow Decay of Impact in Equity Markets',
      scope: '衰减识别 · Brokmann et al.（2015），读 alpha control、later trades 与 deconvolution',
      reason: '理解表观平台怎样由预测收益和后续 flow 生成，以及“孤立冲击”需要什么数据。',
      url: 'https://doi.org/10.1142/S2382626615500070',
    },
    {
      title: 'No-Dynamic-Arbitrage and Market Impact',
      scope: '模型卫生 · Gatheral（2010），读 round trip cost、impact nonlinearity 与 decay constraints',
      reason: '学会在拟合之外审计 impact 模型是否允许凭自身交易制造负成本路径。',
      url: 'https://doi.org/10.1080/14697680903373692',
    },
  ],
};
