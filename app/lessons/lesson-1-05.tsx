import SpreadMechanismLab from '../components/SpreadMechanismLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson105Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Bid–ask spread 是“要求别人现在成交”的价格，不是交易所凭空划出的缝，也不是做市商无风险落袋的利润。</h2>
        <p>
          1.04 已经告诉我们，best bid 是当前最高的非空买价，best ask 是当前最低的非空卖价；两者相减便得到 quoted spread。
          但这个定义仍没有解释：为什么愿意等待的一方不会无限竞争，直到买卖报价重合？更深层的答案是，立即成交权不是免费物品。
          一个参与者若持续站在 bid 上承诺买入、站在 ask 上承诺卖出，就向未来到达的交易者交出了一项选择权：对方可以在自己最想交易的时刻决定是否击中旧报价，
          而挂单者要承担连接、处理与资本占用，要在未知等待期里管理库存，还可能恰好只在旧报价已经变差时成交。Demsetz 将 spread 解释为有组织市场中“立即交换”的可观察价格；
          后来的库存与信息模型分别揭示了这种价格为何会随风险和交易者构成变化。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <p>
          这也要求先修正标题中的一个隐藏前提：<strong>任何时刻都“必须”有严格正价差，并不是市场制度的逻辑定律。</strong>
          跨场所合并报价或特殊状态可以短暂 locked（bid 等于 ask）、crossed（bid 高于 ask），某些交易也能在 midpoint 成交；单一连续订单簿中，可相互执行的交叉兴趣通常会立即撮合，不能把 consolidated quote 与静态 resting book 混为一谈。
          若价格连续、信息完全对称、等待与处理成本为零、竞争者无限且资本没有约束，理论目标价差甚至可以逼近零。
          真正需要解释的是：在现实市场里，为什么一组成本、条件性损失、风险约束与制度网格通常支持正的可观察价差，以及竞争为何只能压缩可避免的租金，不能自动消灭所有补偿要求。
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把 spread 解释为流动性索取者与提供者之间关于即时性、等待权和风险的交换，而不是把它等同于经纪佣金或做市商利润。</li>
            <li>区分毛增量处理/成交成本、单列 rebate、等待/未成交成本、库存与资本风险、逆向选择、竞争后残余加价，以及 tick 网格所处的不同逻辑层。</li>
            <li>正确计算 absolute / relative quoted spread、effective spread、realized spread 与方向化 price impact，并说明各自回答什么问题。</li>
            <li>说明为什么 ES = RS(τ) + PI(τ) 只有在基准时点、方向与价格口径对齐时才是可直接使用的恒等式。</li>
            <li>面对“波动上升所以 spread 扩大”这类描述时，补出谁的约束变化、怎样改价或撤单、竞争者为何没有立刻填补的完整因果链。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节边界</span>
          <p>
            本节建立价差的统一经济地图与测量语言。1.06 才把 spread 放在 liquidity 的 tightness、depth、immediacy 与 resiliency 四个维度中；
            1.10 才完整推导 informed trading 如何进入报价；1.12—1.14 才分别处理做市商、库存调整与流动性提供者竞争；1.18 再研究 tick size 的市场设计。
            这里会预览这些机制，但不会把一个教学加总式冒充通用均衡模型。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="immediacy">
        <p className="section-kicker">01 · Immediacy 的交换</p>
        <h2>跨越价差的人购买执行确定性；留下挂单的人出售一项有条件的立即成交权</h2>
        <p>
          在一个普通未交叉的连续订单簿中，想立刻买入的人必须接受当前 ask，想立刻卖出的人必须接受当前 bid；愿意等待的人则可以在某个价格提交限价单，争取未来成交。
          因而 bid 与 ask 不只是两个预测，而是两种可立即执行的方向性合约。主动买方支付的不是“股票本身比一分钟前更贵”这一条事实，而是无需等待新卖方出现就获得数量的机会；主动卖方作出对称选择。
          Harris 把这种选择描述为交易者在 immediacy 与价格改善之间的权衡，现代 LOB 理论则把耐心与不耐心交易者的相遇看成流动性的市场。<Cite n={5} /><Cite n={6} />
        </p>
        <div className="mechanism-chain" aria-label="即时性交易形成价差的机制链">
          {[
            ['需求不同步', '买卖双方并不在同一时刻、以同一数量到达'],
            ['有人先承诺', '被动订单预先公布愿意成交的价格与数量'],
            ['对手保留时机', '主动方只在此刻对自己有利或足够紧迫时执行'],
            ['挂单承担条件性风险', '等待、库存、资本和被挑中损失集中在提供者'],
            ['报价要求补偿', '提供者改善价格，直到边际收益不足以补偿边际风险'],
            ['形成状态价差', '竞争、价格网格与当时订单流共同决定可见 bid / ask'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这里的“出售选择权”是经济类比，不表示普通限价单就是交易所上市期权。相似之处在于决策时机不对称：挂单者先锁定条件，后来的主动方决定是否接受；差异在于限价单通常可撤、队列位置会变、成交量受簿面限制，且不存在固定到期支付函数。
          这个类比的作用，是提醒我们等待者并没有免费得到一个更好价格：他用不成交、晚成交和只在坏状态成交的风险来交换价格改善。
        </p>
      </section>

      <section className="lesson-section" id="zero-spread-world">
        <p className="section-kicker">02 · 先构造零价差世界</p>
        <h2>只有先知道哪些理想条件能把 spread 压到零，才能看清现实中的每一道楔子来自哪里</h2>
        <p>
          想象所有交易者同时知道同一个可执行价值 v；提交、清算和资本均无成本；等待不会错过机会；价格不会在持仓期间变化；任何库存都能立刻无成本对冲；进入者无限、没有市场势力，而且价格可以连续改善。
          在这个基准中，任何 ask&gt;v 都会被竞争者略微压低，任何 bid&lt;v 都会被略微抬高，直到两侧目标报价逼近 v。这里的 bid=ask=v 是理论保留价极限，不声称同一场所能把两张可相互执行的 locked resting orders 永久留在簿中；
          真实撮合系统会执行、拒绝或按规则处理它们。若有人以偏离 v 的旧报价留下，交易者只会在它对自己有利时接受，竞争者又能无风险替代他，所以正的经济目标价差没有稳定支撑。
        </p>
        <div className="state-sequence">
          <article><span>共同信息</span><b>E[V | buy] = E[V | sell] = v</b><p>订单方向不改变对未来价值的条件判断。</p></article>
          <article><span>零执行摩擦</span><b>处理、等待、费用均为零</b><p>提供即时性不消耗额外资源，也没有未成交机会成本。</p></article>
          <article><span>无限风险容量</span><b>库存可即时无成本消除</b><p>报价者不要求资本或持仓风险补偿。</p></article>
          <article><span>连续充分竞争</span><b>任何正 markup 都可被微幅改善</b><p>没有 tick 阻止改善，也没有市场力量保护租金。</p></article>
        </div>
        <p>
          现实中的每个价差理论，实质上都在放松其中一组条件：处理成本模型放松“零执行摩擦”，库存模型放松“无限风险容量”，信息模型放松“共同信息”，竞争模型放松“可自由替代”，tick 与费用模型放松“连续且中性的制度”。
          这些机制可能同时存在，但从零基准逐项放松能防止循环解释：我们不能用“有 spread 所以存在成本，再用存在成本所以有 spread”来证明自己。
        </p>
      </section>

      <section className="lesson-section" id="suppliers">
        <p className="section-kicker">03 · 谁在提供价差内外的流动性</p>
        <h2>有无挂牌做市商会改变制度角色，却不改变“谁先承诺、谁后选择”的经济结构</h2>
        <p>
          在 dealer market 中，dealer 以自己的库存报出愿意买入的 bid 与愿意卖出的 ask，客户跨越报价与其交易；在 order-driven market 中，任何合格参与者提交的被动限价单都可能成为最优报价。
          因此“spread 是做市商收费”只适用于一部分制度外观，不能作为普遍解释。没有指定做市商的市场仍可能存在正价差，因为流动性提供这项功能仍由被动订单承担；反过来，有做市商义务也不保证报价永远窄，因为义务范围、最小规模、库存、对冲与极端状态都受规则限制。<Cite n={5} /><Cite n={6} />
        </p>
        <div className="table-scroll" role="region" aria-label="Dealer 市场与订单驱动市场的流动性提供对照，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>制度身份不同，经济功能可以相同；同一机构也可能在不同订单上切换角色</caption>
            <thead><tr><th scope="col">市场安排</th><th scope="col">谁先给出可执行承诺</th><th scope="col">谁索取即时性</th><th scope="col">价差不能直接解释为什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Dealer / quote-driven</th><td>dealer 用自有资产负债表报 bid / ask</td><td>客户或其他 dealer 接受报价</td><td>报价宽度不是每笔都被同一 dealer 同时赚到</td></tr>
              <tr><th scope="row">Limit order book</th><td>排在簿中的被动买卖订单</td><td>可成交限价单或市价单跨越报价</td><td>最佳 bid 与 ask 可能来自不同主体，且任一侧都可先撤</td></tr>
              <tr><th scope="row">混合与多场所</th><td>做市商、普通限价单、隐藏或中点机制共同存在</td><td>订单可路由、内部化或分拆执行</td><td>单一屏幕 spread 不是完整可得成本或全市场利润</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="layers">
        <p className="section-kicker">04 · 三个逻辑层</p>
        <h2>先区分“必须补偿什么”“竞争留下多少”“屏幕允许显示什么”，再讨论价差宽度</h2>
        <p>
          解释 spread 最常见的错误，是把所有可能因素写成一列相加项，然后声称观察到的 4 bp 可以被精确切成处理 1 bp、库存 1 bp、信息 2 bp。
          经典模型确实分别构造了可识别机制，但现实数据中的机制往往共同决定订单提交、撤销、成交方向和未来价格；同一笔后续 mid 变化既可能反映私人信息，也可能反映公共新闻、机械扫簿或其他订单。
          Huang 与 Stoll、Madhavan 等人的结构分解之所以需要明确的订单流与价格动态假设，正说明“成分”不是从一条报价直接读出的会计事实。<Cite n={7} /><Cite n={8} />
        </p>
        <div className="market-stack spread-layer-stack">
          <article><span>LAYER 1 · REQUIREMENT</span><b>资源成本、条件性损失与风险约束</b><p>毛增量处理/成交成本、单列补贴、等待、资本占用、库存波动与逆向选择共同决定盈亏平衡（break-even）报价；不同模型的对象可能重叠，具体账本必须防止重复计量。</p></article>
          <article><span>LAYER 2 · EQUILIBRIUM</span><b>进入、竞争与市场势力</b><p>更多可替代报价者通常压缩残余租金，但竞争者面对共同风险时可能一起后退；零经济利润仍可与正价差并存。</p></article>
          <article><span>LAYER 3 · IMPLEMENTATION</span><b>Tick、费用与优先规则</b><p>连续经济要求必须映射到离散可报价格；maker–taker（对流动性提供方与索取方差异收费或返还）和队列规则改变订单激励与屏幕报价。</p></article>
          <article><span>OBSERVATION</span><b>Quoted、Effective 与 Realized 指标</b><p>研究者看到的是不同时间、数量、场所与基准下的投影；测量值不能在没有模型时自动还原结构原因。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="conditional-quotes">
        <p className="section-kicker">05 · 条件零利润报价</p>
        <h2>报价者面对的不是无条件价值，而是“这一侧恰好被执行以后”的条件价值</h2>
        <p>
          设 B 表示主动买单击中 ask，S 表示主动卖单击中 bid，V<sub>t+τ</sub> 是选定评估时点的参考价值。E[V|B] 的直白含义是：<strong>只保留买单确实到达并执行这一侧的状态，再对未来价值求平均</strong>；
          它不是所有时刻未来价值的无条件平均。一个风险可分离的教学脚手架可以先写竞争性 break-even 报价，再把市场势力允许的残余加价放到第二层。
          这比“mid 加减若干成本”更重要，因为 E[V|B] 与 E[V|S] 可以在报价前 mid 相同的情况下彼此不同。<Cite n={4} /><Cite n={15} />
        </p>
        <div className="equation-card">
          <span>先 break-even、后 residual markup · 非经验恒等式</span>
          <div>a<sub>BE</sub> = E<sub>t</sub>[V<sub>t+τ</sub> | B] + C<sup>a</sup><sub>gross</sub> + ρ<sup>a</sup> − r<sup>a</sup><br />b<sub>BE</sub> = E<sub>t</sub>[V<sub>t+τ</sub> | S] − C<sup>b</sup><sub>gross</sub> − ρ<sup>b</sup> + r<sup>b</sup><br />a<sub>target</sub> = a<sub>BE</sub> + μ<sup>a</sup>　；　b<sub>target</sub> = b<sub>BE</sub> − μ<sup>b</sup></div>
          <p>
            C<sub>gross</sub> 是<strong>不含下方 maker rebate</strong>、与执行相关的毛增量成本，ρ 是库存/资本等风险补偿，r 是单列的 maker 净补贴，μ 是 break-even 之外、竞争后仍能保留的残余租金。
            等待的“免费期权”、stale-quote risk 与 adverse selection 常是同一选择性成交风险的不同建模语言，可能已经进入条件期望 E[V|fill] 或 ρ；在任何具体账本中，同一预期损失只能归入一次。固定基础设施成本也可能主要通过进入和市场集中度起作用，而非逐笔进入 C。
          </p>
        </div>
        <p>
          这组式子只提供问题语法：如果 E[V|B] 上升，是因买方订单更有信息、公共新闻与买单同步，还是订单自身机械推动报价？如果 ρ 增加，是库存偏离、波动、对冲市场变薄还是资本限额收紧？
          没有额外数据与结构假设，观察到的 a−b 无法唯一反推出这些对象。
        </p>
      </section>

      <section className="lesson-section" id="processing">
        <p className="section-kicker">06 · 处理、连接与费用口径</p>
        <h2>有些成本在成交前已经发生，有些只随成交发生；二者都不能简单等同于投资者看到的佣金</h2>
        <p>
          流动性提供者需要连接交易场所、接收行情、维护订单与风控、清算结算，并支付人员、技术、监管与资本基础设施成本。部分成本是固定的，只有在足够成交量上摊薄；部分成本随消息、成交或持仓增长。
          交易所还可能采用 maker–taker（分别向流动性提供方与索取方返还或收费）或相反的 inverted fee 结构。Stoll 的 dealer-service 框架把订单处理作为价差来源之一，但现实中的逐笔成本应当按参与者、场所、订单类型与成交概率计算，而不能拿零售客户佣金替代。<Cite n={2} />
        </p>
        <p>
          费用对显示价差的影响也不是简单的一比一传递。若 maker 获得 rebate，他可能愿意显示更窄报价，却也可能更重视队列优先并吸引更多撤改单；若 taker 费用较高，屏幕 quoted spread 看似很窄，真正跨越报价的 all-in cost 仍更大。
          因此跨市场比较至少要区分 quoted price、execution price、显式费用与返佣，不能因为“免佣交易”就推断 spread 已失去经济意义。
        </p>
      </section>

      <section className="lesson-section" id="waiting">
        <p className="section-kicker">07 · 等待、未成交与承诺的机会成本</p>
        <h2>一张未成交挂单没有支付交易费，却可能占用风险额度、暴露意图，并错过另一处机会</h2>
        <p>
          被动订单的经济成本不能只在成交后计量。挂单等待期间，资金与库存可用性受到约束，交易者要持续监控状态；若市场朝有利方向离开，订单可能永远不成交，之后追价的代价属于 opportunity cost；
          若为了避免暴露而频繁撤改，又要承担丢失队列优先和技术开销。Copeland 与 Galai 用期权视角分析固定报价的选择性执行，Foucault 则把波动、winner&apos;s curse（“赢得成交”却恰好接到已变差旧报价的赢家诅咒）与限价/市价选择放进动态 LOB；
          Foucault、Kadan 与 Kandel 进一步把耐心程度、交易者到达率、tick 与订单选择共同放进“流动性的市场”。<Cite n={15} /><Cite n={16} /><Cite n={6} />
        </p>
        <div className="contrast-card">
          <div><span>已成交条件成本</span><b>付出 half-spread、费用与可能冲击</b><p>可由实际成交和同时点报价直接构造一部分指标，但因果归因仍需研究设计。</p></div>
          <div><span>未成交条件成本</span><b>等待、追价、机会损失与风险暴露</b><p>没有成交记录不等于没有经济成本；只看 fills 会产生选择偏差。</p></div>
        </div>
        <p>
          这也是为什么“永远挂在 mid 以避免支付 spread”不是通用策略。Mid 可能没有对手方，你的订单可能因价格变化变得不再有竞争力；即使最终成交，成交事件也不是随机抽样。
          真正的选择是在执行价格、等待时间、成交概率、条件性损失和信息暴露之间重新分配风险，而不是在“有成本”和“无成本”之间切换。
        </p>
      </section>

      <section className="lesson-section" id="inventory">
        <p className="section-kicker">08 · Inventory 与 Capital Risk · 预览</p>
        <h2>流动性提供者不是在真空中同时买卖；先成交的一侧会把方向性风险留在资产负债表上</h2>
        <p>
          若一名 dealer 报出双边价格，客户可能连续卖给他，使库存不断增加；也可能连续向他买入，使库存转为过度做空。在等待相反订单或完成对冲前，标的价格变化会造成损益，库存还占用融资、保证金和风险限额。
          Ho 与 Stoll 的动态模型说明，dealer 的最优报价取决于库存、风险厌恶、价格不确定性与交易到达；spread 是补偿的一部分，reservation price（基于库存和风险形成的内部保留价值）及报价中心的偏移则用于引导下一笔订单帮助恢复库存。<Cite n={3} />
        </p>
        <div className="equation-card">
          <span>局部风险直觉 · 不是完整最优报价公式</span>
          <div>q<sub>post</sub> = q<sub>before</sub> ± Q<sub>fill</sub>　；　Inventory P&amp;L over Δt ≈ q<sub>post</sub> × ΔP<br />risk scale ∝ |q<sub>post</sub>| × σ × √Δt</div>
          <p>
            q<sub>before</sub> 是成交前库存，Q<sub>fill</sub> 是候选成交数量，方向决定成交后 q<sub>post</sub> 增加还是减少；ΔP 是随后等待或对冲期间的价格变化，σ√Δt 只是给定波动标度下的不确定性近似。
            即使 q<sub>before</sub>=0，下一笔成交仍会产生非零 q<sub>post</sub>。成交后库存越偏、预期等待越长、波动越高或资本越紧，边际风险通常越大；
            但 dealer 不一定只把双边报价等量向外扩，也可能整体移动 reservation price、减少数量或只撤一侧。完整状态依赖策略留给 1.13。
          </p>
        </div>
      </section>

      <section className="lesson-section" id="adverse-selection">
        <p className="section-kicker">09 · Adverse Selection · 最小推导</p>
        <h2>最危险的不是“有人知道得更多”这个静态事实，而是更有信息者能够选择何时与你成交</h2>
        <p>
          假设旧 mid 为 100，流动性提供者在 100.01 卖出。如果到来的买方只是急需调整现金，交易后合理价值仍在 100 附近，1 分钱补偿可能被保留；
          如果买方掌握尚未进入报价的好消息，交易一发生，其他人也会把中间价上调到 100.05，旧 ask 立刻显得太低。提供者无法事前准确识别来者，只能在所有成交上设置足以覆盖条件性损失的报价。
          Glosten–Milgrom 的关键结果正是：即使 specialist 风险中性、竞争使预期利润为零，只要订单可能来自知情交易者，bid 与 ask 之间仍可存在正差。<Cite n={4} />
        </p>
        <div className="worked-example">
          <span>二状态 Glosten–Milgrom 教学特例 · 不是实证估计式</span>
          <p>
            令 V∈&#123;v<sub>H</sub>,v<sub>L</sub>&#125; 且先验各为 1/2。到达者以概率 π 知情：高价值时买、低价值时卖；以 1−π 为流动性交易者，并各以 1/2 概率买卖。
            贝叶斯更新给出 P(H|B)=(1+π)/2、P(H|S)=(1−π)/2。风险中性、竞争性报价者按条件期望报 a=E[V|B]、b=E[V|S]，于是 a−b=π(v<sub>H</sub>−v<sub>L</sub>)。
            若 v<sub>H</sub>=101、v<sub>L</sub>=99、π=0.20，则 a=100.20、b=99.80，spread=0.40。π 是无量纲概率，不是后文以 bp/侧计量的逆向选择损失。模型里没有库存、处理成本或垄断利润，正价差完全来自订单方向改变了价值的条件分布。<Cite n={4} />
          </p>
        </div>
        <p>
          “未来 mid 沿交易方向移动”常被用作逆向选择的经验代理，却不能无条件等同于私人信息。公共新闻可能在成交后到达，大单机械消耗可见深度，其他主体还可能追随订单流；时间窗越长，混入的冲击越多。
          1.10 会正式区分信号、交易者类型、后验信念与零利润报价；本节只保留一个结论：成交样本的条件分布不同于无条件价格变化。
        </p>
      </section>

      <section className="lesson-section" id="competition">
        <p className="section-kicker">10 · Competition 与残余租金</p>
        <h2>竞争压缩“比必要补偿更宽”的部分，却不能保证所有报价者在共同冲击下仍愿意留下</h2>
        <p>
          当更多资本、技术和风险承受能力相近的提供者争夺同一订单流时，任何人若报得过宽，都可能失去队列和成交，因而 bid 被抬高、ask 被压低。进入与报价竞争可以降低残余 markup，也能推动处理成本下降。
          但这不意味着观察到的正 spread 必然是垄断租金：在 Glosten–Milgrom 一类零利润均衡里，逆向选择本身就支持正价差；在库存模型里，资本与风险补偿也不会因名义参与者数量增加而自动归零。<Cite n={3} /><Cite n={4} />
        </p>
        <p>
          更重要的是，参与者数量不等于独立的风险容量。若所有流动性提供者依赖相似信号、风控阈值、融资来源或低延迟基础设施，同一公告或波动冲击会同时提高他们的被挑中概率与库存 VaR（Value at Risk，在险价值风险限额）；大家可能一起撤单或减少显示量。
          此时“平时有许多竞争者”并不能推出“压力状态仍有许多独立买方”。真正决定价差能否迅速收窄的，是冲击后是否有未受损且愿意承担边际风险的替代资本进入。
        </p>
      </section>

      <section className="lesson-section" id="grid">
        <p className="section-kicker">11 · Tick、费用与可显示报价</p>
        <h2>经济上愿意改善多少，与交易系统允许报出多少，是两个不同问题</h2>
        <p>
          假设竞争后某参与者愿意把完整价差从 1.00 bp 改善到 0.74 bp，但合法报价网格只允许 0.50 bp 的离散步长。若进一步改善必须一次跳到 0.50 bp，他会比较取得更高队列优先的收益与额外让价；若不值得，屏幕仍显示 1.00 bp。
          Tick 因而可以把连续的经济意愿离散化，并在某些价格区间形成一 tick 的显示下限。Harris 的模型和经验分析说明，最小价格变动会同时影响 spread、quotation size 与队列竞争，不能把它当作纯粹的小数位格式。<Cite n={9} />
        </p>
        <div className="number-story three-column">
          <div><span>经济要求</span><b>Raw spread 0.74 bp</b><p>这是教学模型里连续价格下的边际要求，不可直接显示。</p></div>
          <div><span>报价网格</span><b>Tick 0.50 bp</b><p>可行完整价差为 0.50、1.00、1.50… bp。</p></div>
          <div><span>可见结果</span><b>Displayed 1.00 bp</b><p>向可行网格对齐产生 0.26 bp 离散楔子；不代表底层信息风险为 1 bp。</p></div>
        </div>
        <p>
          费用、rebate 与优先规则又会改变这一步的收益。较大 tick 可能让排在队首的挂单获得较高经济租金，却让新进入者只能以速度争队列而不能以更细价格竞争；较小 tick 可以降低显示价差，也可能分散深度、降低展示大数量的回报。
          这些是市场设计的条件性权衡，1.18 会结合更完整证据展开。当前制度尤其需要按实施日期核对：规则文本已经出现的新参数，不等于它在观察样本期已经进入实际合规。
        </p>
      </section>

      <section className="lesson-section" id="heuristic">
        <p className="section-kicker">12 · 一个透明但受限的整合式</p>
        <h2>可以用 break-even 账本组织问题，但必须把它标成启发式边界，而不是经验分解结果</h2>
        <p>
          为了把机制接起来，我们可以站在一侧报价者的局部决策上写出一个最低补偿不等式。它回答“在给定成交概率、状态与竞争环境时，这张订单至少需要多大每侧价格缓冲才愿意留下”，
          不回答真实市场中每一项究竟是多少，也不声称现实中的库存、信息与等待彼此独立；只有在教学账本内，它们才被人为分配成不重复的增量栏。
        </p>
        <div className="equation-card">
          <span>教学式两层报价账本</span>
          <div>h<sup>BE</sup><sub>t</sub> := max(0, c<sup>gross</sup><sub>t</sub> + ℓ<sup>wait</sup><sub>t</sub> + ι<sup>inv</sup><sub>t</sub> + ℓ<sup>AS</sup><sub>t</sub> − r<sub>t</sub>)<br />h<sup>target</sup><sub>t</sub> := h<sup>BE</sup><sub>t</sub> + μ<sub>t</sub>　；　S<sup>raw</sup><sub>t</sub> = 2h<sup>target</sup><sub>t</sub><br />bid / ask ∈ feasible tick grid</div>
          <p>
            h<sup>BE</sup> 是不含残余租金的每侧盈亏平衡缓冲；c<sup>gross</sup> 是不含 r 的毛增量处理/成交成本，ℓ<sup>wait</sup> 表示等待与未成交补偿，ι<sup>inv</sup> 表示库存与资本风险，ℓ<sup>AS</sup> 表示逆向选择预期损失，r 表示单列净补贴。
            μ 是 break-even 之外、竞争后仍能保留的残余加价，因此只进入 h<sup>target</sup>。本式规定每项为 bp/侧，且同一经济损失只能分配给一个项目。对称乘 2 只为构造互动实验；真实 bid 与 ask 可由不同主体给出，库存和方向性信息可使两侧不对称，报价中心也会移动。
          </p>
        </div>
        <p>
          这个式子的正确用法，是生成可检验的比较静态：若公共公告提高 ℓ<sup>AS</sup> 与 ι<sup>inv</sup>，而其他报价者面临同一冲击，break-even 与可见价差应怎样变化？如果竞争进入只降低 μ，为何它未必抵消共同信息风险？
          错误用法，是把六个符号分别赋值后声称已经“测出真实成分”，或把 observed spread 减去交易费就叫作 adverse selection。结构识别需要额外数据、动态方程、工具变量或制度冲击，以及对模型错设的稳健性检验。
        </p>
      </section>

      <section className="lesson-section" id="comparative-statics">
        <p className="section-kicker">13 · Comparative Statics</p>
        <h2>同一证券的 spread 会变，是因为边际流动性提供者的条件损益与替代资本在变</h2>
        <p>
          观察到价差在公告前后从 2 bp 扩到 8 bp，只说“市场恐慌”仍没有解释机制。需要继续追问：公共信息是否提高了旧报价被挑中的概率？短时价格不确定性是否增加库存对冲风险？
          风险限额是否使可用资本下降？已有报价者是外移价格、减少数量，还是直接撤掉一侧？其他竞争者为何没有立刻进入？只有把状态冲击、主体约束、订单行为与新报价连接起来，价差变化才成为可检验的因果链。
        </p>
        <div className="table-scroll" role="region" aria-label="不同冲击通过何种机制影响价差，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>箭头表示在其他条件不变下的常见方向，不是无条件定律</caption>
            <thead><tr><th scope="col">起始冲击</th><th scope="col">首先改变什么</th><th scope="col">报价者可能怎样反应</th><th scope="col">为何观察结果可能不同</th></tr></thead>
            <tbody>
              <tr><th scope="row">计划外新闻</th><td>条件价值分布与信息型订单占比</td><td>外移报价、缩量或暂时撤单</td><td>信息清晰且新资本快速进入时，价差可很快恢复</td></tr>
              <tr><th scope="row">短时波动上升</th><td>库存持有与对冲误差</td><td>扩大风险缓冲、降低承诺数量</td><td>若订单流高度双向且对冲市场深，spread 反应可较小</td></tr>
              <tr><th scope="row">库存单边累积</th><td>reservation price 与剩余风险容量</td><td>先做 quote skew，引导平仓方向</td><td>不必对称扩大；另一提供者可能接替最优报价</td></tr>
              <tr><th scope="row">竞争者进入</th><td>失去成交与队列的机会成本</td><td>改善价格或增加显示数量</td><td>共同风险未变、tick 绑定或进入者相关时，价差未必继续收窄</td></tr>
              <tr><th scope="row">Tick 缩小</th><td>最小可改善幅度与队列租金</td><td>以更细价格争夺订单流</td><td>显示 spread 可缩小，同时每档 depth 与队列行为也会变化</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          价差还具有多时间尺度。毫秒级变化可来自最优档撤补和短暂队列竞争；日内 U 形可能反映开盘信息不确定、午间稳定与收盘库存管理；危机期的持续扩张则可能涉及资本、融资和跨市场对冲约束。
          把日频波动率直接回归 tick-level spread 而不处理共同日内周期、交易状态与内生订单流，很容易把同步相关误写成单向因果。
        </p>
      </section>

      <section className="lesson-section" id="quoted-measures">
        <p className="section-kicker">14 · Quoted Spread 的四种口径</p>
        <h2>同一组 bid / ask 可以产生绝对、半边、相对与基点指标；不先声明口径，数字就不能比较</h2>
        <p>
          设时点 t 的 best bid 为 b<sub>t</sub>、best ask 为 a<sub>t</sub>，midquote 为 m<sub>t</sub>=(a<sub>t</sub>+b<sub>t</sub>)/2。
          Full quoted spread 是两侧完整间距；half-spread 是从 mid 到任一侧的对称距离；relative spread 用 mid 标准化价格水平；乘 10,000 后得到 basis points。
          文献和数据产品有时省略 full / half 字样，因此专业写作必须在公式、单位和表头同时声明。
        </p>
        <div className="equation-card">
          <span>报价状态的四个投影</span>
          <div>S<sup>Q,$</sup><sub>t</sub> = a<sub>t</sub> − b<sub>t</sub>　；　h<sup>Q,$</sup><sub>t</sub> = (a<sub>t</sub> − b<sub>t</sub>)/2<br />S<sup>Q,rel</sup><sub>t</sub> = (a<sub>t</sub> − b<sub>t</sub>)/m<sub>t</sub>　；　S<sup>Q,bp</sup><sub>t</sub> = 10,000 × S<sup>Q,rel</sup><sub>t</sub></div>
          <p>
            若报价为 99.99 / 100.01，则 full absolute spread 为 0.02 元，half-spread 为 0.01 元，mid 为 100 元，full relative spread 为 0.02%，即 2 bp。
            绝对 0.02 元对 10 元股票是 20 bp，对 1,000 元资产却只有 0.2 bp，所以跨证券或跨拆股时期通常需要相对口径。
          </p>
        </div>
        <p>
          Quoted spread 描述的是给定场所、时点和最低显示数量下的可见 tightness，不是某位投资者必然支付的成本。成交可能得到 price improvement、在 midpoint 或隐藏价格执行，也可能因订单大于最优档数量而跨越多档；多场所市场还要决定使用本地 BBO 还是合并后的基准。
          因此 quoted spread 是交易前状态指标，不能替代成交级测量。
        </p>
      </section>

      <section className="lesson-section" id="effective">
        <p className="section-kicker">15 · Effective Spread</p>
        <h2>把实际成交价与严格同步的成交前 mid 比较，才能看到这笔交易真正跨出了多远</h2>
        <p>
          定义主动交易方向 D<sub>t</sub>：买方主动为 +1，卖方主动为 −1；P<sub>t</sub> 为成交价，m<sub>t</sub> 为订单可执行或成交前按研究设计规定的 midpoint。
          Full effective spread 用一个方向变量把买卖两种情形写成同一公式。美国 SEC 的执行质量框架长期使用这种方向化、两倍化距离来衡量成交相对报价中心的执行成本，并允许价格改善反映在指标中。<Cite n={10} /><Cite n={11} />
        </p>
        <div className="equation-card">
          <span>Full effective spread · 方向统一口径</span>
          <div>ES<sub>t</sub> = 2D<sub>t</sub>(P<sub>t</sub> − m<sub>t</sub>)<br />ES<sup>bp</sup><sub>t</sub> = 10,000 × ES<sub>t</sub> / m<sub>t</sub></div>
          <p>
            买方在 mid 上方成交时 P−m 为正，D=+1；卖方在 mid 下方成交时 P−m 为负，D=−1，乘积仍为正。乘 2 表示 full-spread convention。
            若报价 99.99 / 100.01、买方正好以 ask 成交，ES=0.02 元，与 quoted spread 相等；若以 100.005 获得价格改善，ES 只有 0.01 元。
          </p>
        </div>
        <div className="contrast-card">
          <div><span>Quoted spread</span><b>成交前可见报价之间的距离</b><p>不使用实际成交价；会受显示、场所、tick 和报价时点影响。</p></div>
          <div><span>Effective spread</span><b>实际成交相对指定 mid 的方向化距离</b><p>能反映价格改善，却仍不含佣金、费用、等待、未成交和完整市场冲击。</p></div>
        </div>
        <p>
          Effective spread 甚至可以为零或负：midpoint 成交给出零；若被分类为主动买的成交发生在所用 mid 下方，方向化距离为负。负值可能来自真实价格改善、隐藏/中点机制，也可能暴露时间同步或方向分类错误。
          因而“异常值”不能在理解生成机制前被机械删除。
        </p>
      </section>

      <section className="lesson-section" id="realized-impact">
        <p className="section-kicker">16 · Realized Spread 与 Price Impact</p>
        <h2>成交时的距离可以被重新表达为“未来仍保留多少”与“mid 沿交易方向移动多少”</h2>
        <p>
          仅知道买方在 mid 上方 1 bp 成交，还不能判断流动性提供者是否真正获得这 1 bp。如果随后 mid 沿买方方向上升，旧 ask 可能只是补偿了后来显现的价值变化。
          选定未来时距 τ 和同一报价口径的 m<sub>t+τ</sub>，可以把 effective spread 分成 realized spread 与方向化 price impact。Madhavan、Richardson 与 Roomans 以及 Hasbrouck 的交易级研究提供了把订单流、报价修正和信息内容联系起来的经典框架，但具体经济解释仍依赖动态模型。<Cite n={8} /><Cite n={12} />
        </p>
        <div className="equation-card">
          <span>同一交易、同一初始基准、同一 full-spread 口径</span>
          <div>RS<sub>t</sub>(τ) = 2D<sub>t</sub>(P<sub>t</sub> − m<sub>t+τ</sub>)<br />PI<sub>t</sub>(τ) = 2D<sub>t</sub>(m<sub>t+τ</sub> − m<sub>t</sub>)<br />ES<sub>t</sub> = RS<sub>t</sub>(τ) + PI<sub>t</sub>(τ)</div>
          <p>
            第一项比较成交价与未来 mid，表示按这个未来基准仍留在成交价和报价中心之间的方向化距离；第二项比较未来与初始 mid，表示观察窗内沿主动交易方向的报价中心变化。
            把两式相加时 m<sub>t+τ</sub> 抵消，恰好回到 2D(P−m<sub>t</sub>)，所以在口径严格对齐时这是代数恒等式。
          </p>
        </div>
        <div className="worked-example">
          <span>同一 ES 怎样随时间窗重新分配</span>
          <p>
            买方主动成交 P=100.03，成交前 m<sub>0</sub>=100.01，故 ES=2×(0.02)=0.04 元。五分钟后 m<sub>5</sub>=100.025：RS<sub>5</sub>=0.01，PI<sub>5</sub>=0.03；
            三十分钟后 m<sub>30</sub>=100.04：RS<sub>30</sub>=−0.02，PI<sub>30</sub>=0.06。Effective spread 没变，未来基准改变使两部分重新分配；负 RS 并非算术错误。
          </p>
        </div>
        <p>
          Realized spread 不是 dealer 的会计利润。真实损益还取决于谁提供流动性、何时对冲、库存路径、另一侧成交、费用、融资与资本成本。Price impact 也不是“这笔交易因果造成的永久信息冲击”：它只是选定窗口内的方向化 mid 变化，可能混入公共新闻、其他订单、机械深度消耗与流动性恢复。
          τ 改变时两项可以显著变化；研究者必须报告时距并解释为何与问题匹配。
        </p>
      </section>

      <section className="lesson-section" id="measurement-boundaries">
        <p className="section-kicker">17 · 测量恒等式的边界</p>
        <h2>公式看似简单，真正困难的是交易方向、基准时点、报价来源、权重与样本状态全部对齐</h2>
        <p>
          若研究者用成交后的 quote 当作 m<sub>t</sub>，快市场里会把已经发生的报价反应放进“成交前成本”；若用本地成交配全国报价，或一项用到单场所 midpoint、另一项用 consolidated midpoint，恒等式就失去共同基准。
          Lee–Ready 一类方向推断还会误分类部分交易，尤其在报价和成交时间戳错位、midpoint execution 或价格快速变化时；其历史数据使用的固定滞后不能机械移植到现代行情。<Cite n={17} />
          最稳妥的顺序是先定义事件时钟和报价选择规则，再计算指标，最后才做经济解释。
        </p>
        <div className="table-scroll" role="region" aria-label="价差测量审计清单，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每一行都可能改变数值或使不同研究无法复现</caption>
            <thead><tr><th scope="col">审计对象</th><th scope="col">必须写明</th><th scope="col">典型错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">交易方向 D</th><td>场所原生 aggressor flag 或具体分类算法</td><td>把所有成交都当 D=+1，卖方结果整体反号</td></tr>
              <tr><th scope="row">初始 mid</th><td>订单到达、变为可执行或成交前的哪个时点</td><td>使用成交后报价，引入 look-ahead</td></tr>
              <tr><th scope="row">报价来源</th><td>本地 BBO、NBBO 或其他 consolidated feed</td><td>成交与报价来自不一致市场集合</td></tr>
              <tr><th scope="row">未来时距 τ</th><td>50 ms、1 s、15 s、1 min、5 min 等明确窗口</td><td>把不同 τ 的 RS 或 PI 混成同一指标</td></tr>
              <tr><th scope="row">单位与倍数</th><td>absolute / relative / bp，full / half</td><td>把半边结果与完整价差比较</td></tr>
              <tr><th scope="row">聚合权重</th><td>逐笔、股数、订单或时长加权</td><td>分别取中位数后仍要求三个统计量严格相加</td></tr>
              <tr><th scope="row">异常市场状态</th><td>locked/crossed、停牌、缺失/陈旧报价处理</td><td>无声明地删除或强行修复，制造选择偏差</td></tr>
            </tbody>
          </table>
        </div>
        <aside className="precision-note">
          <span>Rule 605 的重要时点差异</span>
          <p>
            SEC 修订后的 Rule 605 已在 2026-08-01 进入合规期，并要求多个 realized-spread 时间窗。其监管报告中的 effective spread 通常以订单收到或变为可执行时的 midpoint 为基准，
            realized spread 则以执行价与执行后指定时距的 midpoint 构造。若订单收到与成交之间报价已变，这两项并不共享本节教学恒等式所用的同一 m<sub>t</sub>，因此不能机械要求监管报表中的 ES、RS 与自行计算的 PI 逐笔严格相加。<Cite n={10} /><Cite n={13} /><Cite n={18} />
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="spread-lab">
        <SpreadMechanismLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">19 · 反例实验</p>
        <h2>同一个“spread 变宽”观察，可以由不同机制产生；同一个机制也不必只改变 spread</h2>
        <div className="state-sequence">
          <article><span>反例 01</span><b>零利润仍有正价差</b><p>竞争消灭期望经济租，却没有消灭与信息型订单成交时的条件性损失。</p></article>
          <article><span>反例 02</span><b>库存增加但 spread 不变</b><p>过多多头可使 bid 与 ask 同时下移，先改变 quote center，而非对称扩大宽度。</p></article>
          <article><span>反例 03</span><b>Quoted 很窄但交易不便宜</b><p>最优档数量很小、大单跨档，或 taker fee 较高，all-in execution cost 仍可很大。</p></article>
          <article><span>反例 04</span><b>一 tick 不等于完美竞争</b><p>价格改善被网格绑定后，竞争可转向速度、队列、数量、返佣与隐藏执行。</p></article>
          <article><span>反例 05</span><b>Price impact 为正但无人拥有私有信息</b><p>公共新闻、其他订单流或机械扫簿都能让未来 mid 沿交易方向移动。</p></article>
          <article><span>反例 06</span><b>Realized spread 为正但 dealer 仍亏损</b><p>对冲价格、库存路径、费用和资本成本未进入这个基准指标。</p></article>
        </div>
        <p>
          这些反例共同指出一种研究纪律：观察量不是机制标签。Quoted spread 宽并不自动证明“知情者更多”，也不自动证明“做市商垄断”；effective spread 低不证明等待者没有机会成本；realized spread 高不证明商业模式高利润。
          任何机制判断都需要说明它相对哪些替代解释产生不同的可观察预测。
        </p>
      </section>

      <section className="lesson-section" id="identification">
        <p className="section-kicker">20 · 从解释到可验证研究</p>
        <h2>要识别 spread 的成因，不能只回归 contemporaneous volatility（同期波动率）；必须寻找机制特有的状态、时序或制度变化</h2>
        <p>
          假设我们想判断某市场公告后的价差扩张主要来自信息不确定还是库存资本约束。两者都可能与波动、成交量和 spread 同时上升，单一相关性无法区分。
          信息机制更直接的证据可能包括交易方向与后续报价修正的条件关系、公告类型和信息消化速度；库存机制则需要参与者级或代理变量所揭示的头寸偏离、对冲成本、资本限制与 quote skew。
          制度变化如 tick、费用或做市义务可提供外生变化，但仍要检查同期事件、处理组可比性与行为适应。
        </p>
        <div className="mechanism-chain" aria-label="从价差世界观转化为可验证研究问题">
          {[
            ['定义观察量', 'Quoted / effective / realized；场所、时点、数量与单位'],
            ['提出竞争机制', '信息、库存、成本、竞争、网格至少保留可反驳替代项'],
            ['写出差异预测', '哪一状态、方向、时距或参与者上结果应不同'],
            ['寻找识别来源', '制度断点、事件时钟、工具变量或可观测资产负债表约束'],
            ['先做数据审计', '同步、方向、异常报价、权重、样本选择与可复现性'],
            ['报告边界', '结果支持哪个局部机制，不能推出哪些更大因果结论'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Huang–Stoll 与 Madhavan–Richardson–Roomans 的模型值得学习，恰恰不是因为它们给出可跨市场背诵的固定成分比例，而是因为它们把假设、订单流动态、报价修正和估计量写成一套可检验系统。<Cite n={7} /><Cite n={8} />
          复现时应比较不同模型、时距和样本处理是否改变结论，并把无法识别的成分保留为不确定性，而不是用一个名称填补空白。
        </p>
      </section>

      <section className="lesson-section" id="current-rules">
        <p className="section-kicker">21 · 现行制度实例</p>
        <h2>监管指标与市场设计规则必须按“测量什么、何时合规”分别阅读</h2>
        <p>
          截至本节校订日，修订后的美国 Rule 605 主要执行质量披露要求已在 2026-08-01 进入合规期。SEC 的现行 FAQ 明确说明 realized spread 包含 50 milliseconds、1 second、15 seconds、1 minute 与 5 minutes 五个时距，并按 executed shares 等规定方式汇总；
          但基于 best available displayed price 的特定 price-improvement 统计仍按安排到 2026-11-01 才进入合规，不能把整套修订写成同一天一次性完成。<Cite n={13} />
          这些窗口并不是五种“真实信息半衰期”，而是标准化报告口径；研究者仍需解释自己为何选择某个窗口，以及监管字段与学术公式的时间基准是否一致。
        </p>
        <p>
          同一时期的 Regulation NMS 市场结构改革还涉及更细的最小报价单位与较低 access-fee cap，但合规日期经历延期。因而教材不能看到 eCFR 中已有条文就写成“2026 年市场已经全面按半美分 tick 和新费率运行”。
          规则采用、法典文本、豁免/延期与实际合规是四个不同状态；任何制度事件研究都必须以样本期内真实约束为准，并保存当时公告与技术实施证据。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">22 · 主动练习</p>
        <h2>先独立写下定义、方向和时点，再展开答案</h2>
        <details>
          <summary>练习一 · 一笔有价格改善的主动买入怎样分解？</summary>
          <div>
            <p><strong>题目。</strong>成交前报价为 99.98 / 100.02，mid=100.00；一笔买方主动订单以 100.015 成交，一分钟后同口径 mid=100.010。忽略费用，使用 full-spread 与 bp 口径。计算 quoted、effective、realized spread 和 price impact。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>Quoted spread=(100.02−99.98)/100×10,000=4 bp。D=+1，ES=2×(100.015−100)/100×10,000=3 bp，说明实际成交得到 0.005 元价格改善。RS=2×(100.015−100.010)/100×10,000=1 bp；PI=2×(100.010−100)/100×10,000=2 bp；因此 3=1+2。</p></details>
          </div>
        </details>
        <details>
          <summary>练习二 · 库存偏离首先应扩大 spread，还是移动报价中心？</summary>
          <div>
            <p><strong>题目。</strong>初始报价 99.99 / 100.01。某提供者积累了过多多头，但价格波动、资本约束和信息风险暂时不变。比较“两个报价同时下调 0.01”“只把 ask 上调 0.01”“两侧对称外扩 0.01”，哪一种最直接鼓励减少库存？什么额外变化才更支持 spread 同时扩大？</p>
            <details className="practice-answer"><summary>展开机制答案</summary><p>两个报价同时下调最直接：较低 bid 减少继续买入的吸引力，较低 ask 提高卖出成交机会，spread 可保持 0.02。只上调 ask 会降低卖出机会，方向相反；对称外扩只减少两侧成交，未专门引导去库存。若持仓同时使风险限额更紧、边际库存风险非线性上升，或波动/对冲成本上升，才更支持在 skew 之外扩大宽度。</p></details>
          </div>
        </details>
        <details>
          <summary>练习三 · 同一笔交易为什么会有两个不同的 realized spread？</summary>
          <div>
            <p><strong>题目。</strong>买方主动成交 P=100.03，成交前 m<sub>0</sub>=100.01；5 分钟后 m<sub>5</sub>=100.025，30 分钟后 m<sub>30</sub>=100.04。用分/股的 full-spread 口径计算 ES、两个 RS 与两个 PI。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>ES=2×(100.03−100.01)=0.04 元，即 4 分。5 分钟：RS=2×(100.03−100.025)=1 分，PI=2×(100.025−100.01)=3 分。30 分钟：RS=2×(100.03−100.04)=−2 分，PI=2×(100.04−100.01)=6 分。两个窗口都满足 ES=RS+PI；窗口改变的是未来基准，不是初始成交成本。</p></details>
          </div>
        </details>
        <details>
          <summary>练习四 · 审计“price impact 就是知情交易造成的永久冲击”</summary>
          <div>
            <p><strong>题目。</strong>一份研究使用分钟成交价和同分钟最后一条 midpoint，计算平均 ES 减去五分钟 RS，并把差值命名为“知情交易造成的永久冲击”。它没有报告方向算法、报价来源、locked/crossed 处理、费用或权重。请从定义、同步、样本和因果四层提出审计问题。</p>
            <details className="practice-answer"><summary>展开参考答案</summary><p>定义层要问 full/half、absolute/relative、D 的来源和未来窗口；同步层要问 m<sub>0</sub> 是否严格在成交前、交易与报价时钟是否校准、五分钟 mid 如何取得；样本层要问本地/NBBO、锁定交叉与缺失报价、价格改善、成交量权重、费用和多笔拆分；因果层要问公共新闻、其他订单、机械扫簿、短暂恢复与选择性成交。差值在口径一致时是描述性 PI，不足以单独识别私人信息、永久性或该交易的因果效应。</p></details>
          </div>
        </details>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">23 · 理解检查</p>
        <h2>真正掌握的标准，是能够说明结论在哪些条件下会改变</h2>
        <details><summary>1. 为什么竞争充分、预期利润为零时仍可能有正价差？</summary><p>竞争可以压缩残余租金，却不能让真实处理成本、库存风险和与知情订单成交的条件性损失凭空消失。零利润报价必须先补偿这些期望负担。</p></details>
        <details><summary>2. 为什么 quoted spread 不是主动交易者实际支付的全部成本？</summary><p>实际成交可能获得价格改善、在 midpoint 或隐藏价格执行，也可能因数量较大而跨档；佣金、费用、等待、未成交机会成本和订单冲击也不在单一 quoted spread 中。</p></details>
        <details><summary>3. 库存增加为什么不必立刻扩大 spread？</summary><p>库存水平首先改变报价者希望下一笔交易发生在哪一侧，因此可能让 bid 与 ask 同方向移动，即 quote skew。只有边际风险、波动、资本约束等同时变化时，宽度才更可能扩大。</p></details>
        <details><summary>4. 一 tick spread 是否证明信息风险为零、竞争已经完美？</summary><p>不能。Tick 可能绑定价格改善，使竞争转向队列、速度、数量和其他执行质量；底层风险可以小于、等于或大于观察到的离散网格楔子。</p></details>
        <details><summary>5. Effective spread 是否等于投资者总交易成本？</summary><p>不是。它只量化成交价相对指定成交前 midpoint 的方向化距离，不包括显式费用、等待与未成交成本、完整执行路径和机会成本。</p></details>
        <details><summary>6. 若 ES=4、PI=5，RS 能否为 −1？</summary><p>可以。只要使用同一口径，RS=ES−PI=−1。负 realized spread 表示未来 midpoint 已沿主动交易方向移动到足以反超成交价的程度，不是公式错误。</p></details>
        <details><summary>7. 同一笔交易改变 τ 时，哪一个指标保持不变？</summary><p>在初始基准、方向和定义不变时，ES 不使用未来 midpoint，因此保持不变；RS 与 PI 会随 m<sub>t+τ</sub> 改变，但始终重新相加为 ES。</p></details>
        <details><summary>8. 正的 price impact 是否证明主动交易者拥有私有信息？</summary><p>不能。公共新闻、其他订单流、机械深度消耗、报价恢复和方向分类都可能产生同方向 mid 变化；从描述性指标到信息因果需要额外识别。</p></details>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">24 · 课程接口</p>
        <h2>价差只回答“立即跨越两侧报价有多贵”；完整流动性与价格冲击还需要更多状态维度</h2>
        <p>
          1.04 给出生成 b、a、mid 与 quoted spread 的订单簿状态，本节解释为何流动性提供通常要求补偿，并建立成交后的 ES、RS 与 PI 测量语言。下一节 1.06 会指出 spread 只代表 tightness：
          两个市场可以有相同 2 bp spread，却在 depth、完成给定数量所需时间和冲击后恢复速度上完全不同。1.07 会研究 resiliency，1.08 会把订单事件聚合为 order flow，1.09 才把机械、暂时与更持久的冲击置于动态系统中。
        </p>
        <p>
          理论线索随后分开深化。1.10 会把本节的条件性损失变成 informed / uninformed order flow 下的后验定价；1.12—1.13 会把代表性“报价者”还原成有库存、资本与对冲约束的 market maker；1.14 会研究竞争与高频技术；1.18 再把 tick 从网格参数提升为市场设计变量。
          因而本节最重要的能力不是背诵“四种价差来源”，而是看到任何 spread 时都能追问：<strong>它是哪一种测量、由谁的条件损益支持、竞争在哪一层发挥作用、制度怎样把意愿映射成报价，以及数据允许我们识别到哪一步。</strong>
        </p>
      </section>
    </>
  );
}

export const lesson105: LessonRecord = {
  slug: '1-05',
  id: '1.05',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Bid–Ask Spread 为什么存在',
  subtitle: '即时成交的价格：成本、库存、逆向选择、竞争、Tick 与成交后测量',
  readingTime: '约 82–90 分钟（核心阅读 50–54＋互动 12–14＋主动练习 20–22）',
  prerequisite: '1.04 · Limit Order Book 的结构；T03 · Expectation 基础；按需回看 T01 Price / Return 与 T08 Time Scale',
  updatedAt: '2026-08-28',
  revision: '1.05-r3',
  reviewStatus: 'double-reviewed',
  previous: { slug: '1-04', label: '1.04 订单簿如何组织即时执行权' },
  next: { slug: '1-06', label: '1.06 Liquidity 的四个维度' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.05-r1',
      summary: '要求分开 break-even 与残余租金，消除费用/返佣及重叠风险的重复计量，修复零补偿时错误制造一 tick 的边界，并校正三条政府来源元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.05-r1',
      summary: '要求补足条件期望先修并消除符号冲突，区分零价差与非锁定约束，补齐两个实验的顺向键盘重试路径、tick 非颜色标记及移动端细节。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.05-r2',
      summary: 'r1 的 Major 均已解决；仅要求把 SEC Release 34-105656 的书目标题替换为官方完整标题。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.05-r2',
      summary: 'r1 的 Major 与移动端问题均已解决；仅要求 break-even 与 maker–taker 在首次出现处立即给出中文释义。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.05-r3',
      summary: '最终版的两层报价账本、互斥费用口径、零目标边界、Tick 映射、QS/ES/RS/PI 算术、Rule 605 分阶段合规与 18 条引用全部通过。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.05-r3',
      summary: '最终版的条件期望先修、符号系统、首次术语释义、双模式预测闭环、顺向焦点路径、非颜色标记、练习与移动端可读性全部通过。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'immediacy', label: 'Immediacy 的交换' },
    { id: 'zero-spread-world', label: '零价差基准' },
    { id: 'suppliers', label: '谁提供流动性' },
    { id: 'layers', label: '三个逻辑层' },
    { id: 'conditional-quotes', label: '条件零利润报价' },
    { id: 'processing', label: '处理与费用口径' },
    { id: 'waiting', label: '等待与未成交' },
    { id: 'inventory', label: 'Inventory 预览' },
    { id: 'adverse-selection', label: 'Adverse Selection 最小推导' },
    { id: 'competition', label: 'Competition' },
    { id: 'grid', label: 'Tick 与报价网格' },
    { id: 'heuristic', label: 'Break-even 账本' },
    { id: 'comparative-statics', label: '状态比较' },
    { id: 'quoted-measures', label: 'Quoted Spread 口径' },
    { id: 'effective', label: 'Effective Spread' },
    { id: 'realized-impact', label: 'Realized 与 Impact' },
    { id: 'measurement-boundaries', label: '测量边界' },
    { id: 'spread-lab', label: '双模式互动实验' },
    { id: 'counterexamples', label: '反例实验' },
    { id: 'identification', label: '识别与研究设计' },
    { id: 'current-rules', label: '现行制度实例' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson105Content,
  references: [
    {
      id: 1,
      authors: 'Harold Demsetz',
      year: '1968',
      title: 'The Cost of Transacting',
      publication: 'Quarterly Journal of Economics, 82(1), 33–53',
      url: 'https://doi.org/10.2307/1882244',
      use: '把 bid–ask spread 解释为有组织市场提供立即交换的价格，并讨论交易规模、参与者和竞争如何关联交易成本。历史制度不代表现代电子市场细节。',
    },
    {
      id: 2,
      authors: 'Hans R. Stoll',
      year: '1978',
      title: 'The Supply of Dealer Services in Securities Markets',
      publication: 'Journal of Finance, 33(4), 1133–1151',
      url: 'https://doi.org/10.1111/j.1540-6261.1978.tb02053.x',
      use: 'Dealer 服务供给、订单处理、持仓与价差的经典理论框架；不把 dealer 身份外推为所有 LOB 挂单者。',
    },
    {
      id: 3,
      authors: 'Thomas Ho & Hans R. Stoll',
      year: '1981',
      title: 'Optimal Dealer Pricing under Transactions and Return Uncertainty',
      publication: 'Journal of Financial Economics, 9(1), 47–73',
      url: 'https://doi.org/10.1016/0304-405X(81)90020-9',
      use: '库存、风险厌恶、价格不确定性与交易到达如何进入 dealer 的动态报价。用于机制预览，不提供本节互动参数。',
    },
    {
      id: 4,
      authors: 'Lawrence R. Glosten & Paul R. Milgrom',
      year: '1985',
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      publication: 'Journal of Financial Economics, 14(1), 71–100',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
      use: '异质信息与选择性订单流怎样使风险中性、零预期利润的 specialist 仍报出正价差。模型假设不等于现代市场真实交易者比例。',
    },
    {
      id: 5,
      authors: 'Larry Harris',
      year: '2002',
      title: 'Bid/Ask Spreads (Chapter 14)',
      publication: 'Trading and Exchanges, Oxford University Press, pp. 297–321',
      url: 'https://doi.org/10.1093/oso/9780195144703.003.0014',
      use: 'Immediacy、流动性供给/索取、价差与交易成本的制度语言；具体规则须由当前场所文件更新。',
    },
    {
      id: 6,
      authors: 'Thierry Foucault, Ohad Kadan & Eugene Kandel',
      year: '2005',
      title: 'Limit Order Book as a Market for Liquidity',
      publication: 'Review of Financial Studies, 18(4), 1171–1217',
      url: 'https://doi.org/10.1093/rfs/hhi029',
      use: '耐心与不耐心交易者、到达率、tick、spread 与 resiliency 的策略互动；模型比较静态不外推为所有市场常数。',
    },
    {
      id: 7,
      authors: 'Roger D. Huang & Hans R. Stoll',
      year: '1997',
      title: 'The Components of the Bid–Ask Spread: A General Approach',
      publication: 'Review of Financial Studies, 10(4), 995–1034',
      url: 'https://doi.org/10.1093/rfs/10.4.995',
      use: '订单处理、库存与逆向选择成分的结构估计及其假设依赖性；用于说明 observed spread 不是可直接读取的会计分项。',
    },
    {
      id: 8,
      authors: 'Ananth Madhavan, Matthew Richardson & Mark Roomans',
      year: '1997',
      title: 'Why Do Security Prices Change? A Transaction-Level Analysis of NYSE Stocks',
      publication: 'Review of Financial Studies, 10(4), 1035–1064',
      url: 'https://doi.org/10.1093/rfs/10.4.1035',
      use: '交易级订单流、信息、成本与价格动态的结构框架；历史 NYSE 样本估计不当作当前跨市场比例。',
    },
    {
      id: 9,
      authors: 'Lawrence E. Harris',
      year: '1994',
      title: 'Minimum Price Variations, Discrete Bid–Ask Spreads, and Quotation Sizes',
      publication: 'Review of Financial Studies, 7(1), 149–178',
      url: 'https://doi.org/10.1093/rfs/7.1.149',
      use: 'Tick 对离散价差、报价数量与竞争激励的作用；历史美国制度证据不替代当前实施评估。',
    },
    {
      id: 10,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2024',
      accessedAt: '2026-08-28',
      title: 'Disclosure of Order Execution Information — Final Rule, Release No. 34-99679',
      publication: 'Federal Register / SEC Final Rule',
      url: 'https://www.sec.gov/files/rules/final/2024/34-99679.pdf',
      use: '修订 Rule 605 的 effective / realized spread、时间基准、报告字段与五个 realized-spread 时距，并明确不同基准可使简单分解不精确。',
    },
    {
      id: 11,
      authors: 'U.S. Securities and Exchange Commission',
      year: '1997',
      accessedAt: '2026-08-28',
      title: 'Report on the Practice of Preferencing',
      publication: 'SEC Market Structure Report · published April 15, 1997',
      url: 'https://www.sec.gov/reports/report-practice-preferencing',
      use: '以买卖方向统一解释 effective spread、quoted spread 与 price improvement，包括指标可为负的边界；不用其历史市场结论代表当前质量。',
    },
    {
      id: 12,
      authors: 'Joel Hasbrouck',
      year: '1991',
      title: 'Measuring the Information Content of Stock Trades',
      publication: 'Journal of Finance, 46(1), 179–207',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
      use: '交易创新、报价修正与信息内容的动态识别思想；用于强调 price impact 的经济归因需要模型。',
    },
    {
      id: 13,
      authors: 'U.S. Securities and Exchange Commission, Division of Trading and Markets',
      year: '2026',
      accessedAt: '2026-08-28',
      title: 'Frequently Asked Questions: Rule 605 of Regulation NMS (April 1, 2026)',
      publication: 'SEC Staff Guidance · updated April 1, 2026',
      url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms',
      use: '现行修订报告的合规解释、股数加权与 50 ms、1 s、15 s、1 min、5 min realized-spread 时间点。Staff guidance 不是新增法律规则。',
    },
    {
      id: 14,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2026',
      accessedAt: '2026-08-28',
      title: 'Order Granting Temporary Exemptive Relief, Pursuant to Section 36(a)(1) of the Securities Exchange Act of 1934 and Rules 610(f) and 612(d) of Regulation NMS, from Compliance with Rule 600(b)(89)(i)(F), Rule 610(c) and Rule 612 of Regulation NMS, as Amended',
      publication: 'SEC Order · June 11, 2026',
      url: 'https://www.sec.gov/files/rules/exorders/2026/34-105656.pdf',
      use: '核对新 tick 与 access-fee 等 Regulation NMS 修订的延期合规状态，防止把已入规则文本的参数误写成 2026 年已全面实施。',
    },
    {
      id: 15,
      authors: 'Thomas E. Copeland & Dan Galai',
      year: '1983',
      title: 'Information Effects on the Bid–Ask Spread',
      publication: 'Journal of Finance, 38(5), 1457–1469',
      url: 'https://doi.org/10.1111/j.1540-6261.1983.tb03834.x',
      use: '以期权视角分析固定报价被选择性执行的信息成本；该类比不把可撤限价单等同于法律或支付结构上的标准期权。',
    },
    {
      id: 16,
      authors: 'Thierry Foucault',
      year: '1999',
      title: 'Order Flow Composition and Trading Costs in a Dynamic Limit Order Market',
      publication: 'Journal of Financial Markets, 2(2), 99–134',
      url: 'https://doi.org/10.1016/S1386-4181(98)00012-3',
      use: '波动、winner’s curse、限价/市价选择与动态交易成本；模型结果用于边界化等待和被挑中机制。',
    },
    {
      id: 17,
      authors: 'Charles M. C. Lee & Mark J. Ready',
      year: '1991',
      title: 'Inferring Trade Direction from Intraday Data',
      publication: 'Journal of Finance, 46(2), 733–746',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
      use: '无原生 aggressor side 时的经典成交方向推断与历史报告延迟问题；原论文滞后设置不能直接套用现代数据。',
    },
    {
      id: 18,
      authors: 'U.S. Electronic Code of Federal Regulations',
      year: 'current through 2026',
      accessedAt: '2026-08-28',
      title: '17 CFR § 242.605 — Disclosure of Order Execution Information',
      publication: 'Regulation NMS',
      url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-242/section-242.605',
      use: 'Rule 605 当前具有法律效力的执行质量披露定义与要求；与 SEC staff FAQ 的解释性地位分开。',
    },
  ],
  readingList: [
    {
      title: 'Trading and Exchanges · Chapter 14',
      scope: '制度起点 · Harris；重点 immediacy、liquidity supplier/demander 与 transaction-cost language',
      reason: '把 spread 放回交易者为何愿意等待或跨越报价的选择中，而不是先从抽象成分表开始背诵。',
      url: 'https://doi.org/10.1093/oso/9780195144703.003.0014',
    },
    {
      title: 'Bid, Ask and Transaction Prices in a Specialist Market',
      scope: '信息理论 · Glosten & Milgrom；读零利润报价、交易者类型与后验更新',
      reason: '理解“竞争充分仍有正价差”的严格逻辑，并训练自己区分条件成交分布与无条件价值分布。',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
    },
    {
      title: 'Optimal Dealer Pricing under Transactions and Return Uncertainty',
      scope: '库存理论 · Ho & Stoll；读状态变量、库存路径与动态报价',
      reason: '看到库存不仅影响宽度，也会移动报价中心；为 1.13 的 reservation price 与 quote adjustment 打基础。',
      url: 'https://doi.org/10.1016/0304-405X(81)90020-9',
    },
    {
      title: 'Rule 605 Final Rule + 2026 FAQ',
      scope: '测量实读 · 先读 Final Rule 的定义与时点，再用 FAQ 核对当前报告窗口',
      reason: '把学术公式映射到真实监管数据字段，并亲自观察“相似指标名称但初始基准不同”怎样改变恒等式使用。',
      url: 'https://www.sec.gov/files/rules/final/2024/34-99679.pdf',
    },
  ],
};
