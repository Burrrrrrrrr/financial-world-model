import TickSizeLab from '../components/TickSizeLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson118Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Tick size 不是屏幕多显示几位小数，而是市场允许订单站在哪些价格上；它先改变取得价格优先权的最低代价，再把竞争在“改善报价”和“争夺同价队列”之间重新分配。</h2>
        <p>
          假设一只股票的最优买价为 9.99 元、最优卖价为 10.00 元。若最小报价单位是 0.01 元，卖方想以更优价格排到 10.00 元卖单之前，下一档只能报 9.99 元；那会与买价相遇而立即执行，不能作为新的公开卖价停在中间。若 tick 缩小到 0.005 元，9.995 元成为合法 resting ask，价格竞争重新开放。规则没有改变公司的现金流，却改变了交易者的行动集合、队列权利和成交概率；订单随后重排，spread、每档 depth、固定金额执行成本、消息流和价格发现才发生变化。Harris 的离散价差框架与 Cordella–Foucault 的动态竞争模型分别说明了价格网格和时间优先怎样进入报价结果，但都不支持“tick 越小越好”的无条件口号。<Cite n={1} /><Cite n={4} />
        </p>
        <p>
          这也是为什么同一分钱不是同一种市场设计。4 元股票的一分钱等于 25 个基点（basis points，bp；1 bp=0.01%），100 元股票的一分钱只有 1 bp；拆股、反向拆股或价格跨越分档边界，即使名义规则不变，也会改变网格相对于证券价格和自然交易成本的强弱。较粗 tick 可能抬高小单支付的最小价差，同时把被动订单集中到较深队列并增加流动性供给的潜在租金；较细 tick 可能让价差收窄，却把数量拆到更多档位、降低旧队列的保护并诱发更多微小改价。经验结果因此取决于改革前是否受约束、证券活跃度、订单规模、费用、优先规则和跨场所替代。<Cite n={6} /><Cite n={16} /><Cite n={25} /><Cite n={26} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>区分 tick、quote/order/trade increment、显示精度、lot size、price band 与 tick value。</li>
            <li>构造局部合法价格网格，计算 relative tick、spread ticks、inside-price 数量和时间加权 binding rate。</li>
            <li>用 join / improve / take / wait / cancel 的价值账本解释 tick 怎样改变价格优先与队列优先。</li>
            <li>同时报告 best depth、固定 bp depth 与固定数量执行成本，避免把重分桶误写成流动性变化。</li>
            <li>区分屏幕报价网格、cum-fee 经济网格与允许 midpoint、hidden 或 retail improvement 的成交网格。</li>
            <li>读取美国、中国、欧盟、香港和日本制度时冻结产品、价格/流动性档、生效与合规时点及例外。</li>
            <li>把 tick 改革转化为局部可证伪研究，并区分纯网格处理、组合政策和跨场所均衡反应。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>网格是制度输入，不是最终结果；规则先改变合法行动，主体响应后才共同生成新的市场质量。</h2>
        <div className="mechanism-chain" aria-label="Tick size 的完整传导链">
          {[
            ['外部状态', '价格水平、波动、订单到达、信息风险、投资者规模、公司行动与日内阶段'],
            ['规则版本', '局部 tick table、quote/order/trade increment、priority、fees、exceptions 与生效日期'],
            ['行动集合', 'join、improve、take、wait、cancel、reprice、隐藏执行或改走另一场所'],
            ['簿与队列', '合法价格档数量、同价 queue ahead、显示/隐藏 depth 和消息重排'],
            ['执行结果', 'quoted/effective cost、fill、等待、markout、固定数量 impact 与未成交成本'],
            ['反馈与再分配', '价格发现、波动测量、场所份额、做市参与和下一轮 tick 分类共同变化'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          反馈使“改革前订单簿固定不动，只把价格四舍五入到新网格”的计算只适合作为短时机械反事实。真实参与者知道规则改变，会撤掉旧订单、拆分数量、重选价格和场所；交易所又可能根据历史 spread 或活跃度重新分配未来 tick。最终观察到的是新均衡，而非旧簿的静态重编码。专业分析必须先隔离机械通道，再说明行为和跨市场反馈如何覆盖它。
        </p>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 范围契约</p>
        <h2>本节独占“离散价格网格怎样改变报价与排队竞争”；它调用既有机制，不重新讲一遍订单簿或价差理论。</h2>
        <div className="boundary-box">
          <b>输入、输出与不重复原则</b>
          <p>硬先修是 1.05：把 bid、ask、mid、quoted/effective/realized spread 与 spread 的逆向选择、库存和运营成本作为已知；建议回看 1.04 的 price level、queue ahead 与 price-time priority。本节从这些对象出发，只增加合法价格集合、relative tick、binding、改价成本和跨制度可比坐标。1.06/1.07 的流动性维度、1.09 的 impact、1.14 的通用订单竞争、1.17 的集合竞价清算均不重讲。本节只把机制状态交给 1.19；借券可得性、borrow fee、locate、recall 和 short-sale constraint 属于下一节。</p>
        </div>
        <p>
          这里的目标也不是替 5.05 决定一个“社会最优 tick”。要做福利裁决，必须给小单投资者、大单机构、流动性提供者、发行人、经纪商和场所结果赋权，并处理规则迁移与执法成本；本节只建立这些判断所需的机制与测量语言。研究设计部分只完成一个局部 tick 改革模板，一般识别、预注册和反证体系仍由 7.25 展开。
        </p>
      </section>

      <section className="lesson-section" id="objects">
        <p className="section-kicker">03 · 八个不能混用的对象</p>
        <h2>“一分钱一档”只有在对象、场所、产品和阶段都冻结后才有意义。</h2>
        <div className="table-scroll" role="region" aria-label="Tick size 八个对象，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>规则语言的最小对象账本</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">它约束什么</th><th scope="col">它不等于什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Tick size / minimum price variation</th><td>在给定规则范围内，相邻合法价格的最小增量</td><td>屏幕显示的小数位数</td></tr>
              <tr><th scope="row">Quote increment</th><td>公开报价可使用的价格粒度</td><td>所有订单和成交必然使用同一粒度</td></tr>
              <tr><th scope="row">Order increment</th><td>场所可接受、排序或保存订单的价格粒度</td><td>成交价的唯一可能集合</td></tr>
              <tr><th scope="row">Trade increment</th><td>若规则另设，成交价格允许的最小增量</td><td>Quote increment 的同义词</td></tr>
              <tr><th scope="row">Display precision</th><td>界面或数据字段能显示多少位</td><td>法律上可以提交 10.005</td></tr>
              <tr><th scope="row">Lot / trading unit</th><td>订单数量的单位、整手或 round lot 边界</td><td>每股价格的最小变化</td></tr>
              <tr><th scope="row">Price band / limit / collar</th><td>允许价格所在的区间或随价格变化的 tick 档</td><td>相邻合法价格之间的距离本身</td></tr>
              <tr><th scope="row">Tick value</th><td>价格移动一格对给定股数或合约乘数产生的货币金额</td><td>Relative tick 或市场总交易成本</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个系统完全可以显示三位小数，却拒绝不在一分钱网格上的订单；也可以禁止公开 sub-tick 报价，却允许满足条件的 midpoint 或零售改善成交。美国 Tick Size Pilot 更直接把 quote increment、trade increment 和 trade-at（限制非显示交易在公开价匹配的规则）处理分成不同测试组，证明“tick 变大”并不是一个足够精确的 treatment（实际施加的制度处理）名称。<Cite n={30} />
        </p>
        <p>
          数量单位同样需要单独保存。美国当前 round lot 会随证券价格档取 100、40、10 或 1 股，但这不会把每股报价 tick 自动改成对应数量；odd-lot（不足该证券相应 round lot 的非整手订单）的显示、保护和执行质量又是下一层规则。把“少于 100 股”永远当 odd lot，或用 round-lot 变化解释价格网格，会同时错置数量与价格两个维度。<Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="local-grid">
        <p className="section-kicker">04 · 手算一条价格阶梯</p>
        <h2>合法价格是离散集合；只有在局部 tick 恒定时，才能把它写成一条等距阶梯。</h2>
        <div className="equation-card">
          <span>局部价格网格</span>
          <div>𝒢(τ,p<sub>0</sub>)=&#123;p<sub>0</sub>+kτ : k∈ℤ，p<sub>0</sub>+kτ&gt;0&#125;</div>
          <p>τ 是局部价格带内的最小增量，单位可为元/股、美元/股或指数点；p<sub>0</sub> 是同单位锚点；k 是无单位整数；ℤ 表示所有整数。直白说，价格只能站在阶梯横档上。若 p<sub>0</sub>=0、τ=0.01，9.99、10.00、10.01 合法，10.005 不合法。本式只在当前价格带内成立；跨过一个 tick table 边界，必须按规则逐段枚举，不能继续用同一个 τ。</p>
        </div>
        <div className="worked-example">
          <span>合法性不是“保留几位小数”</span>
          <p>候选报价 24.99、25.00 与 25.005 都能被数据库保存为三位小数；在 τ=0.01 的网格上，前两者对应整数 k，25.005 对应非整数 2500.5，因而不是合法报价。把字段精度当 tick 会令订单回放凭空生成场所从未接受的价格。</p>
        </div>
      </section>

      <section className="lesson-section" id="tick-value">
        <p className="section-kicker">05 · 一格到底值多少钱</p>
        <h2>每股 tick、整张股票订单的一格金额与期货合约 tick value 是三个尺度。</h2>
        <div className="equation-card">
          <span>股票与衍生品的 tick value</span>
          <div>v<sub>tick</sub><sup>stock</sup>=τq　；　v<sub>tick</sub><sup>deriv</sup>=τκN</div>
          <p>股票式中 τ 是货币/股的一格，q 是股数；衍生品式中 τ 是报价点的一格，κ 是每点每份合约的货币价值，N 是合约份数；两个 v 都表示整笔头寸移动一格的货币金额。例如股票订单 q=2,000、τ=0.01 元/股，一格是 20 元；某期货 τ=0.25 点、κ=50 美元/点/份、N=3 时，一格是 37.50 美元。直白说，不能用同一个符号同时藏住数量与合约乘数。</p>
        </div>
        <p>
          这一区分防止产品间错误外推。股票 tick 通常以每股价格表达；ETF 还受净值与套利机制约束；期货和期权的合约乘数、到期日、报价档及做市义务不同。观察到“某期货缩小 tick 后市场质量改善”，不能仅凭数学单位相似就预测低活跃小盘股会有同样结果。
        </p>
      </section>

      <section className="lesson-section" id="relative-tick">
        <p className="section-kicker">06 · Absolute Tick 与 Relative Tick</p>
        <h2>绝对 tick 是规则输入；相对 tick 才说明一格占当前价格的多大比例。</h2>
        <div className="equation-card">
          <span>比例化网格</span>
          <div>ρ<sub>t</sub>=τ<sub>t</sub>/m<sub>t</sub>　；　ρ<sub>t</sub><sup>bp</sup>=10<sup>4</sup>τ<sub>t</sub>/m<sub>t</sub></div>
          <p>m<sub>t</sub>=(a<sub>t</sub>+b<sub>t</sub>)/2 是时点 t 的中间价，τ 与 m 都以货币/股计；ρ 无单位，ρ<sup>bp</sup> 以基点计，1 bp=0.01%。若缺少可靠 mid，应在研究前指定 last eligible quote、auction reference 或其他参考价，不能按结果方便临时替换。</p>
        </div>
        <div className="worked-example">
          <span>同一分钱的三种经济尺度</span>
          <p>价格 4 元时，0.01 元为 25 bp；价格 40 元时为 2.5 bp；价格 100 元时为 1 bp。因此固定绝对 tick 制度天然把较低价格证券放入更粗的比例网格。Angel、Easley–O’Hara–Saar 与 Schultz 从不同角度研究 share price、stock split 与交易结构，支持把公司行动视为 relative tick 的重要变化来源，同时也提醒拆股会改变交易单位、参与门槛与主体选择，不能当成只有一个通道的随机实验。<Cite n={6} /><Cite n={13} /><Cite n={14} /></p>
        </div>
      </section>

      <section className="lesson-section" id="spread-ticks">
        <p className="section-kicker">07 · Spread 有几格</p>
        <h2>Spread ticks 衡量当前报价之间跨过几段网格；inside-price 数量才表示还剩多少公开改价机会。</h2>
        <div className="equation-card">
          <span>Spread tick 数与内部合法价位</span>
          <div>n<sub>t</sub>=(a<sub>t</sub>−b<sub>t</sub>)/τ<sub>t</sub>　；　I<sub>t</sub>=max(n<sub>t</sub>−1,0)</div>
          <p>a、b 与 τ 单位相同；当 bid、ask 位于同一恒定网格时，n 是无单位整数，I 是两端点之间的合法价格数。bid=49.98、ask=50.01、τ=0.01 时 n=3，内部价为 49.99 和 50.00，共 I=2；n=1 时 I=0。若两侧跨越 tick table 边界，分母不再是单一 τ，必须实际枚举合法档位。</p>
        </div>
        <p>
          Spread-to-tick ratio 常被用作约束诊断，但“当前三格”不等于“自然 spread 正好三格”。报价包含信息风险、库存、等待、费用和策略；tick 只是其中一项制度约束。后文将把一格占比、relative tick 和改革前 spread 一起使用，而不是用单一阈值替代完整状态。
        </p>
      </section>

      <section className="lesson-section" id="binding">
        <p className="section-kicker">08 · 一格 Binding 的准确含义</p>
        <h2>一格状态只证明公开报价之间没有合法 inside price；它强烈提示网格约束，却不证明无网格反事实一定更窄。</h2>
        <div className="equation-card">
          <span>时间加权一格占比</span>
          <div>I<sub>j</sub>=#&#123;p∈𝒢<sub>j</sub>:b<sub>j</sub>&lt;p&lt;a<sub>j</sub>&#125;　；　n<sub>j</sub>=I<sub>j</sub>+1　；　B<sub>j</sub>=1&#123;I<sub>j</sub>=0&#125;　；　BR=Σ<sub>j=1</sub><sup>J</sup>Δt<sub>j</sub>B<sub>j</sub>/Σ<sub>j=1</sub><sup>J</sup>Δt<sub>j</sub></div>
          <p>𝒢<sub>j</sub> 是第 j 个报价状态适用规则下的完整有序合法报价集合；I<sub>j</sub> 是 bid 与 ask 之间合法公开价格的个数，n<sub>j</sub> 是两端间跨过的合法阶梯数，B<sub>j</sub> 在没有 inside price 时等于 1。这样，即使 bid 与 ask 跨越 tick-table 边界，也按实际合法集合逐段枚举；例如某分段规则规定 30.00 后下一合法价为 30.05 时，30.00/30.05 仍是一格。J 纳入连续交易中所有合法、双边且 bid&lt;ask 的报价区间；Δt<sub>j</sub> 是状态持续秒数，BR 是 0 到 1 的时间比例。停牌、auction、单边、locked（bid=ask）、crossed（bid&gt;ask）或规则无效报价应另编码，不进入分母；若全天没有任何有效持续时间，BR 记为 NA（缺失），不能写成 0。它回答“有效双边时间中有多少比例没有公开 inside quote”，而不是“一天多少条消息报成一格”。</p>
        </div>
        <div className="boundary-box"><b>必要条件与充分条件</b><p>BR 很高、relative tick 大、旧 spread 长期一格且新细档很快被使用，共同加强“旧网格 binding”的解释；但即使 n=1，若没有交易者愿意承担更差价格、信息风险或排队不确定性，新档也未必持续存在。因此一格是机械无 inside 状态，不是完整行为反事实。</p></div>
      </section>

      <section className="lesson-section" id="reservation-map">
        <p className="section-kicker">09 · 连续保留价怎样落到网格</p>
        <h2>最简单的机械映射是：卖方不低于最低接受价，买方不高于最高接受价，各自找最近合法格。</h2>
        <div className="equation-card">
          <span>不越过自身边界的取整</span>
          <div>a<sup>g</sup>=min&#123;p∈𝒢:p≥ã&#125;　；　b<sup>g</sup>=max&#123;p∈𝒢:p≤b̃&#125;</div>
          <p>ã 是连续价格世界中卖方最低接受价，b̃ 是买方最高接受价；a<sup>g</sup> 向上找最近合法卖价，b<sup>g</sup> 向下找最近合法买价，全部单位为货币/股。若 b̃=39.993、ã=40.007、τ=0.01，则机械报价为 39.99/40.01。这个取整只隔离离散约束，不含对手行为、queue、fees、库存、信息学习或策略性保守偏移（shading）；真实报价可以更保守。</p>
        </div>
        <p>
          Anshuman 与 Kalay 的离散做市模型说明，网格造成的楔子可以支持正的做市收益并改变有效交易成本，但模型结论依赖竞争结构和信息假设；它不能被简化成“显示 spread 减去 raw spread 就是无风险利润”。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="grid-wedge">
        <p className="section-kicker">10 · 网格楔子不等于经济租金</p>
        <h2>离散网格可以把显示 spread 推离连续目标，却不会免除成交后的逆向选择、库存、等待和技术成本。</h2>
        <div className="equation-card">
          <span>纯机械网格楔子</span>
          <div>W<sub>t</sub><sup>grid</sup>=(a<sub>t</sub><sup>g</sup>−b<sub>t</sub><sup>g</sup>)−(ã<sub>t</sub>−b̃<sub>t</sub>)≥0</div>
          <p>ã−b̃ 是连续保留价间距，a<sup>g</sup>−b<sup>g</sup> 是按上一节“卖方向上、买方向下”机械取整后的间距，全部单位为货币/股；因此 W<sup>grid</sup> 在这个取整反事实下非负。它只表示离散映射额外撑开的距离，不是实际均衡显示 spread 与某个模型目标的残差，更不是 maker 每股必得利润。真实报价还会受策略性偏移、成交概率、markout、费用、库存和竞争影响，实际显示价差可以偏离这个机械结果。</p>
        </div>
        <p>
          历史改革显示这些维度确实会分叉。NYSE 1997 年从八分之一美元降至十六分之一后，quoted spread 和整本累计 depth 都下降，小单流动性需求者总体受益，但低价、低成交股票中的大单未必受益；Jones 与 Lipson 的机构执行记录还显示，大额、主动和 momentum orders 的成本可以上升。2001 年 decimalization 后，Bessembinder 记录小单 quoted/effective cost 改善；Eaton、Irvine 与 Liu 后来发现，常用流动性代理与机构母单成本关系很弱，机构成本也没有出现与 inside spread 同量级的断崖式改善。Markout 是成交后固定期限的 mid 相对成交价变化，它和未成交成本仍不在屏幕 spread 中。它们共同否定“spread 变窄=所有交易者福利上升”的推理。<Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="price-to-queue">
        <p className="section-kicker">11 · 价格竞争何时转为队列竞争</p>
        <h2>Inside price 存在时，交易者可以牺牲一点价格换取价格优先；spread 只有一格时，公开竞争被推向同价队列。</h2>
        <p>
          在 price-time 市场中，价格优先先于同价时间优先。若 bid=50.00、ask=50.03、τ=0.01，新的卖单可以报 50.02 或 50.01，在不立即成交的情况下越过 50.03 队列；如果 ask 已是 50.01，下一档 50.00 会与 bid 相遇，公开 resting order 没有中间价可站。此时流动性提供者若仍要改善 fill，只能更早进入同价队列、增减显示量、选择具有不同费用或优先协议的场所、使用隐藏/中点机制，或转为主动成交。Tick 因而给价格改善设置最低门票，也改变时间优势的经济价值。<Cite n={3} /><Cite n={4} />
        </p>
        <p>
          “竞争转向队列”不是说价格永远不动。一格 best quote 仍会在订单耗尽、新信息和撤单后整体跳到下一格；也不是说所有队列只比速度。交易者还比较条件成交后的 markout、库存方向、数量优先和费用。中心结论更窄：当合法 inside price 被网格阻断时，微小的保留价值差异无法直接通过公开价格表达，其他优先和执行渠道相对更重要。
        </p>
      </section>

      <section className="lesson-section" id="depth-migration">
        <p className="section-kicker">12 · Depth 是消失还是搬家</p>
        <h2>Tick 变小会增加同一经济价格带中的档位；只比较 best quote 或前 K 档，会把容器变化误当数量变化。</h2>
        <div className="equation-card">
          <span>固定 bp 卖方深度</span>
          <div>D<sub>t</sub><sup>ask</sup>(x)=Σ<sub>m<sub>t</sub>≤p≤m<sub>t</sub>(1+x/10⁴)</sub>q<sub>t</sub><sup>ask</sup>(p)</div>
          <p>x 是离 mid 向上的基点距离；p、m 是货币/股，q(p) 是该价显示股数，D 与 q 同为股。买方对称地在 m(1−x/10⁴) 到 m 间求和。直白说，无论新规则把十个基点切成 2 档还是 20 档，都把相同经济区间的数量加总。隐藏量不在显示 D 中，应另报实际执行或可推断流动性。</p>
        </div>
        <div className="worked-example">
          <span>同一两分钱区间的重分桶</span>
          <p>改革前 τ=0.01，10.00/10.01/10.02 的卖量为 1,000/800/700，总计 2,500；改革后 τ=0.005，10.000 至 10.020 五档为 600/550/520/530/500，总计 2,700。Best depth 下降 40%，固定两分钱区间却增加 8%。这不证明改革全面改善，只证明“best depth 崩塌”也不是正确摘要；还要让固定数量订单实际 walk the book。</p>
        </div>
        <p>
          Goldstein–Kavajecz 发现 1997 NYSE 改革后 depth 不只是搬到邻档，而是在更深账本也下降，所以固定区间测量不是为了保证得到好结果，而是为了让结果有相同经济含义。东京与美国改革的现代模型和证据同样表明，liquid 与 illiquid books 的多档深度分层（这里的 layering 指订单分布，不是虚假申报）、微小抢价（undercutting）和迁移通道可以相反。<Cite n={10} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="queue-ahead">
        <p className="section-kicker">13 · Tick 怎样改变 Queue Ahead</p>
        <h2>较粗网格通常把更多保留价值压到同一价格，扩大 queue ahead；它既可能支撑显示深度，也可能把成交权变成稀缺队列租金。</h2>
        <p>
          假设许多卖方愿意在 100.001 至 100.009 之间成交。τ=0.01 时，这些意愿可能共同聚集在 100.01；τ=0.001 时，它们可以分散到多个价格。前者增加单档显示量，也让后到订单等待更久；若 spread 已是一格，旧订单不用担心被极小幅改价，先到地位更受保护。Yao 与 Ye 把统一一分钱 tick 理解为价格控制下的 queue rationing：较大的 relative tick 产生流动性供给租金，速度通过时间优先分配这些租金；其 ETF split/reverse-split 设计中，更大 relative tick 提高 HFT 流动性供给占比，却损害他们测量的流动性。该结果属于特定美国 ETF 与规则环境，不证明所有快交易或粗网格都降低质量。<Cite n={17} />
        </p>
        <div className="boundary-box"><b>Depth、rent 与 welfare 不是同义词</b><p>队列更深可能给立即成交者更多表面数量，却也可能来自较宽 spread 提供的租金；队尾提供者的 fill 变差，大单实际穿透成本仍可能上升。要同时看 queue position、fill、spread、fixed-Q cost 和成交后 markout。</p></div>
      </section>

      <section className="lesson-section" id="priority-rules">
        <p className="section-kicker">14 · Priority Rule 决定队列权利</p>
        <h2>大 tick 只有在具体优先协议下才强化“先到先得”；price-time、pro rata 与类别优先会把同一网格变成不同激励。</h2>
        <div className="table-scroll" role="region" aria-label="Tick 与优先规则交互，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同价竞争的三种简化协议</caption>
            <thead><tr><th scope="col">协议</th><th scope="col">粗 tick 下最值钱的权利</th><th scope="col">不能直接推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">Price–time / FIFO</th><td>同价中较早到达的 queue rank</td><td>先到订单一定成交或盈利</td></tr>
              <tr><th scope="row">Pro rata</th><td>同价显示数量及分配比例，可能再叠加优先层</td><td>时间完全无关；真实规则常有门槛和舍入</td></tr>
              <tr><th scope="row">类别 / designated priority</th><td>客户、做市商或场所指定类别的规则权利</td><td>同一 tick 在不同产品给出相同策略</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Cordella 与 Foucault 说明 time priority 可以改变竞争报价向更优价格收敛的速度；Foucault、Kadan 与 Kandel 则把耐心与订单到达带入动态流动性市场。两者都表明 tick 的效果不能脱离 priority 和 arrival process。把股票 FIFO 结论搬到期权 pro rata，或把一个 venue 的类别优先当成跨市场规律，都会把制度交互误写成 tick 主效应。<Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="join-improve">
        <p className="section-kicker">15 · Join 还是 Improve</p>
        <h2>价格改善不是“成交概率越高越好”；它用每股价格让步购买 fill，还可能改变条件成交后的信息风险。</h2>
        <div className="equation-card">
          <span>订单行动的统一价值账本</span>
          <div>ḡ<sub>j,h</sub>=E[s(m<sub>t+h</sub>−P<sub>j</sub>)−f<sub>j</sub> | F<sub>j</sub>=1,X<sub>t</sub>]　；　V<sub>j</sub>=π<sub>j</sub>qḡ<sub>j,h</sub>−(1−π<sub>j</sub>)C<sub>j</sub><sup>miss</sup>−C<sub>j</sub><sup>msg</sup></div>
          <p>j 是 join、improve、take 等行动；h 是预先固定的评价期限（例如 5 秒或 1 分钟），m<sub>t+h</sub> 是该期限后的 mid；ḡ 是“已经全额成交时每股平均净剩余”，横线表示条件平均，E[· | ·] 表示只在竖线右侧条件成立时取平均。s=+1 表示买、s=−1 表示卖；P<sub>j</sub> 是全部 q 股在期限内成交时的成交量加权平均价格（VWAP，即每个成交价格按该笔成交股数加权），m 与每股净费用 f 的单位为货币/股，费用为正、返佣为负；X<sub>t</sub> 是下单时信息状态。这里特意采用全成或零成的二元教学账本：F=1 表示期限内全部 q 股成交，F=0 表示一股未成交，π 是 full-fill probability（全额成交概率）；C<sup>miss</sup> 与 C<sup>msg</sup> 是每单零成交和消息成本，V 单位为货币/订单。直白说，这个特例比较的是全额成交概率、成交后质量、零成交代价与操作成本的总和。</p>
        </div>
        <div className="equation-card">
          <span>部分成交的一般账本</span>
          <div>Q<sub>j,h</sub><sup>fill</sup>=Σ<sub>ℓ∈ℒ<sub>j,h</sub></sub>q<sub>ℓ</sub>　；　G<sub>j,h</sub><sup>fill</sup>=Σ<sub>ℓ∈ℒ<sub>j,h</sub></sub>q<sub>ℓ</sub>[s(m<sub>t+h</sub>−P<sub>ℓ</sub>)−f<sub>ℓ</sub>]　；　V<sub>j</sub><sup>partial</sup>=E[G<sub>j,h</sub><sup>fill</sup>−C<sub>j</sub><sup>rem</sup>(q−Q<sub>j,h</sub><sup>fill</sup>) | X<sub>t</sub>]−C<sub>j</sub><sup>msg</sup></div>
          <p>ℒ<sub>j,h</sub> 是行动 j 在期限 h 内的实际成交集合；第 ℓ 笔成交的数量 q<sub>ℓ</sub> 以股计，价格 P<sub>ℓ</sub> 与每股净费用 f<sub>ℓ</sub> 以货币/股计。Q<sup>fill</sup> 是累计成交股数，介于 0 与原订单 q；G<sup>fill</sup> 把每笔成交的股数乘以该笔成交后净剩余再求和，单位为货币/订单。若没有任何成交，ℒ 是空集合，两个求和都按 0 定义，因此不存在“0 乘未定义 VWAP”的问题；若 Q<sup>fill</sup>&gt;0，成交 VWAP=Σq<sub>ℓ</sub>P<sub>ℓ</sub>/Q<sup>fill</sup>。C<sup>rem</sup>(r) 是剩余 r 股造成的每单货币成本，并规定 C<sup>rem</sup>(0)=0、C<sup>rem</sup>(q)=C<sup>miss</sup>。当 Q<sup>fill</sup> 只能取 0 或 q、全额成交时 E[G<sup>fill</sup> | F=1,X<sub>t</sub>]=qḡ 时，本式正好退化为上面的二元式。直白说，成交多少就只给多少股记收益，剩多少就只给剩余量记成本。</p>
        </div>
        <div className="worked-example">
          <span>Tick 是价格优先的最低购买单位</span>
          <p>每股成交前净剩余 g=0.030。留在队尾的 fill 概率 25%，期望为 0.0075；改善一档后 fill 为 60%。令 d 表示 improve 相对 join 的每股价格让步；若 d=0.010，改善后期望 0.60×(0.030−0.010)=0.012，改价占优；若 d=0.025，则为 0.003，留队占优。这里只隔离价格与 fill；真实 ḡ 还会因 queue、信息状态与场所费用随行动改变。</p>
        </div>
      </section>

      <section className="lesson-section" id="cancel-reprice">
        <p className="section-kicker">16 · Wait、Cancel 与 Reprice</p>
        <h2>更细网格增加可重报价状态，也让交易者更频繁比较旧 queue rank 与新价格优先；消息增加不等于经济波动或操纵增加。</h2>
        <p>
          订单等待时，新的最优报价、队列消耗、信息和库存会改变 V<sub>join</sub> 与 V<sub>improve</sub>。Tick 变小后，原来没有合法 inside price 的微小价值差可以触发 reprice；但改价会放弃旧同价时间优先，是否行动取决于新价格的 fill 提升是否足以覆盖价格让步和旧 rank。于是 add/cancel/replace 数量可能上升、报价寿命缩短，best quote 看起来更“闪烁”。这既可能是更精细的竞争，也可能是过度 undercutting，必须看执行与价格效率结果。
        </p>
        <p>
          Dyhrberg、Foley 与 Svec 在 tick 极小的加密货币场所观察到经济上几乎无成本的 undercutting；提高 tick 后 undercutting 下降、显示 depth 和他们测量的多种成本改善。证券类别、监管和市场成熟度都不同，因此该研究提供“tick 也可能太小”的反例，而非股票市场的直接政策参数。高 cancel rate 同样不能自动称 spoofing：合法更新、未成交撤退和 queue reset 都能产生撤单，操纵判断还需要订单意图、反复模式、收益和规则证据。<Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="maker-taker-ledger">
        <p className="section-kicker">17 · Maker / Taker 的完整账本</p>
        <h2>Taker 看立即成交相对决策时 mid 付出多少；maker 看成交后价格向哪走，再加减费用，返佣不是利润。</h2>
        <div className="equation-card">
          <span>方向统一的 bp 账本</span>
          <div>C<sub>take</sub><sup>bp</sup>=10⁴s(P<sub>fill</sub>−m<sub>0</sub>)/m<sub>0</sub>+f<sub>take</sub><sup>bp</sup></div>
          <div>G<sub>make,h</sub><sup>bp</sup>=10⁴s(m<sub>h</sub>−P<sub>fill</sub>)/m<sub>0</sub>−f<sub>make</sub><sup>bp</sup></div>
          <p>s=+1 为买、−1 为卖；P<sub>fill</sub> 是成交价，m<sub>0</sub> 是决策时 mid，m<sub>h</sub> 是 h 后 mid；f 为正费用、负返佣，输出均为 bp。对 maker 买单，若成交后 mid 下跌，第一项为负；0.2 bp 返佣也可能覆盖不了 1.4 bp adverse markout。若把 ḡ 已定义为含费净值，再代入 V<sub>j</sub> 时不得重复计费。</p>
        </div>
        <p>
          Tick 改变 quote 与 fill，fill 又选择哪些订单进入 maker markout 样本。只比较已成交 maker 的平均收益会有条件选择：改革可能让更多边缘订单成交，也可能把最不利状态留给队首。因此应同时报告下单时状态、fill rate、未成交机会成本和多个 h 的 markout，而不是把成交样本返佣当做供给激励全貌。
        </p>
      </section>

      <section className="lesson-section" id="fees-grid">
        <p className="section-kicker">18 · Tick 与 Fee / Rebate 必须联动</p>
        <h2>屏幕上一档只描述名义价格差；费用和返佣会在同一报价后面生成不同的 cum-fee（含费）经济价格层。</h2>
        <div className="worked-example">
          <span>一档跨场所最优报价不等于一档全额成本</span>
          <p>教学场所 bid=20.000、ask=20.010，主动成交每股费 0.003 且完全传递给客户。主动买入全额价为 20.013，主动卖出净收入为 19.997，两者距离 0.016，而非屏幕的 0.010。另一场所即使报同价，若 maker/taker 费不同，对自动路由系统和限价提供者就是另一条经济队列。</p>
        </div>
        <p>
          Cum-fee price 指把名义价格与每股 fee/rebate 合成后的净经济价格；smart order router 是自动比较各场所价格、费用与成交机会并选择去向的路由系统。美国 National Best Bid and Offer（NBBO）是跨场所合并后的最优买卖报价，却不把各场所费用纳入同一个屏幕价格。Chao、Yao 与 Ye 说明离散价格与场所 fee split 可以共同制造多个 cum-fee 层；Comerton-Forde、Grégoire 与 Zhong 研究的 inverted fee venue 是“被动提供者付费、主动者可能获返还”的反向收费场所。它们不证明反向收费无条件最优，而是说明只改显示网格、却把费用和跨场所路由当常数，会漏掉均衡反应。<Cite n={18} /><Cite n={21} />
        </p>
        <div className="boundary-box"><b>当前美国制度的时点盾牌</b><p>SEC 2024 年规则同时通过半美分报价档和较低 access-fee cap，但 2026 年 6 月命令把相关合规临时豁免进一步延至 2027 年 11 月首个工作日。截至本节日期，它们是已通过但尚未要求运行的制度包，不能拿 2026 行情当实施后样本。完整 Rule Card 见第 30 节。<Cite n={28} /><Cite n={29} /></p></div>
      </section>

      <section className="lesson-section" id="execution-grid">
        <p className="section-kicker">19 · 报价网格不等于成交网格</p>
        <h2>公开可见的 lit quote 受最小报价单位约束，不表示所有合法成交只能发生在同一档位。</h2>
        <p>
          Lit quote 指公开显示并进入可见订单簿的报价；midpoint order 按可见 bid/ask 的中点执行，hidden order 则不进入公开深度。零售价格改善或其他例外可以产生 sub-tick trade；反过来，某些制度会同时规定 quote 与 trade increment，或加入 trade-at rule——不展示流动性者若没有达到规定价格改善，就不能在受保护公开报价上匹配。因而一笔 10.005 成交既不能证明公开市场允许 0.005 报价，也不能单凭价格认定违规。研究数据必须分别保存订单是否显示、场所、例外标识、执行机制和当时 NBBO。美国 Rule 612 的 sub-penny 约束、Tick Size Pilot 三测试组与市场碎片化研究共同展示了这些层次。<Cite n={19} /><Cite n={28} /><Cite n={30} />
        </p>
        <p>
          Dark 或 off-book 交易也不是自动的“绕过坏规则”。它们可能提供中点改善、减少信息泄露，也可能削弱显示供给或分割订单流；效果随交易者和股票状态而异。Foley 与 Putniņš 的 dark-trading 研究强调活动类型和参与者信息性的异质性，本节只把它用作“不把成交网格等同报价网格”的证据边界。<Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="small-large-orders">
        <p className="section-kicker">20 · 小单与大单为什么会得出不同答案</p>
        <h2>小单可能主要支付 top-of-book spread；大单会穿过多个价格层，所以 depth 重排可以让两类投资者同时看到相反变化。</h2>
        <div className="table-scroll" role="region" aria-label="小单与大单评价坐标，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一改革的订单规模账本</caption>
            <thead><tr><th scope="col">订单</th><th scope="col">首要结果</th><th scope="col">必须配套</th></tr></thead>
            <tbody>
              <tr><th scope="row">小于 best depth</th><td>All-in effective spread、price improvement、fill latency</td><td>Fees、odd lot、retail/off-book routing</td></tr>
              <tr><th scope="row">跨多档中型单</th><td>固定 Q 的 VWAP shortfall 与 book walk</td><td>固定 bp depth、隐藏执行、订单拆分</td></tr>
              <tr><th scope="row">机构母单</th><td>Implementation shortfall、等待与泄露成本</td><td>执行期限、参与率、是否由交易台主动推进（worked / unworked）和市场共同收益</td></tr>
            </tbody>
          </table>
        </div>
        <p>VWAP 是按各笔成交数量加权的平均成交价；implementation shortfall 是从下单决策时的参考价到实际成交结果的总落差，并应把未成交部分的机会成本纳入。Q 表示研究前固定的股数或合约数。三者让“大单成本”落到一个明确订单、时间窗和基准，而不是用日均 spread 代替。</p>
        <p>
          Chung、Lee 与 Rösch 用美国 Tick Size Pilot 分析小单与大单流动性及价格信息，Eaton、Irvine 与 Liu 则强调机构交易成本的测量会影响金融研究结论。结合早期 decimalization 证据，最稳健的做法不是问“流动性升还是降”，而是预先冻结 Q 或母单规模、执行窗口与基准，分层报告成本分布。<Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="price-discovery">
        <p className="section-kicker">21 · 更细报价与 Price Discovery</p>
        <h2>更细网格能让较小信息差进入公开价格，也可能制造寿命很短的改价；价格变得更频繁不等于信息变得更多。</h2>
        <p>
          当某个信号只值 0.3 tick 时，交易者可能不愿为取得价格优先付出整整一格；细化网格后，信号可以通过较小改善进入 bid 或 ask。Foley、Meling 与 Ødegaard 研究 2009 年欧洲 venues 的 pricing-grid competition，发现采用更细网格的场所迅速获得报价和成交份额，市场层成本下降、depth 与 volume 上升，改善在原来一格约束股票中最强。该设计说明细网格可以释放价格竞争，同时也意味着单场所 before/after 会遗漏订单迁移。<Cite n={24} />
        </p>
        <p>
          但“报价改得更勤”不是 price discovery 的充分条件。研究应调用 1.11 的 information share、common-factor innovation、公共新闻响应或固定时间价格误差，检验新价格是否更早、更持久地接近共同有效价格；若 quote changes 增加而价格误差、逆向选择和跨场所同步没有改善，更细网格只提高了状态分辨率或重报频率。反过来，即使单一场所的领先份额下降，只要订单迁往新网格而全市场价格误差下降，也不能称价格发现恶化。
        </p>
      </section>

      <section className="lesson-section" id="discrete-volatility">
        <p className="section-kicker">22 · 离散价格怎样污染测得波动</p>
        <h2>Quote tick 规定相邻公开报价阶梯；它会改变零收益比例、短时 realized variance 和 bounce，而不必改变基本价值的不确定性。</h2>
        <div className="equation-card">
          <span>一 quote tick 的回报尺度</span>
          <div>r<sub>1tick</sub><sup>bp</sup>=10⁴τ/P</div>
          <p>P 是移动前公开报价，τ 与 P 同单位，结果以 bp 计。10 元股票的一分钱是 10 bp，100 元股票是 1 bp。若两者基本价值都只移动 3 bp，前者的公开 quote 更可能先不动、再跳 10 bp，后者能以更细档逐步调整；成交仍可能通过 midpoint 或例外落在 sub-tick 价格，所以本式不是所有 trade return 的硬下限。</p>
        </div>
        <p>
          Tick 变小后，zero-return share 下降、价格变更次数和超高频 realized variance 上升，可能只是观察尺变细；bid–ask bounce 的幅度又可能随 quoted spread 缩窄而下降。要讨论真实波动，应在固定 1/5/30 分钟与日频共同报告 midquote returns、对微观噪声较稳健的方差估计（noise-robust variance）、价格区间、相邻收益共同运动的 autocovariance，以及对公共信息的价格误差。只见 tick-time 波动上升，不能称市场更不稳定；只见零收益减少，也不能称价格发现改善。Harris 的 clustering 研究还说明，交易者会自愿使用比法定 tick 更粗的圆整数，因此“允许更细”也不保证每档被均匀使用。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="messages-resiliency">
        <p className="section-kicker">23 · 消息流与 Resiliency</p>
        <h2>更细网格改变 add、cancel 与 reprice 的计数机会，也改变“恢复一档”的经济距离；原始消息率和档位恢复不能跨规则直接比较。</h2>
        <p>
          若旧 tick 是 10 bp、新 tick 是 2 bp，从冲击价回到原 mid 需要的档位数会机械增加五倍；用“多少秒恢复三档”会把新制度误判更慢。应把 1.07 的 resiliency 改写到固定 bp、固定 quoted/effective spread 阈值或固定 Q cost：例如冲击后何时恢复到事前 spread 的 110%、何时补回 mid±10 bp 内 80% 深度。消息也应按可交易时间、成交量、价格机会或有效状态变化归一化，并区分新增、撤销、同价减量与真实 reprice。
        </p>
        <p>
          监管关心 message traffic 是因为过细网格可能增加系统负荷和队列重排；但 raw messages 增加本身既不是流动性恶化，也不是虚假行为。若新报价寿命更短却固定 Q 成本下降、价格误差缩小，系统看到的是更积极竞争；若 undercutting 大增、fill 下降、固定带 depth 变薄且价格误差不降，才更接近“复杂度成本超过报价贴近连续目标价值的精细度（pricing fidelity）收益”的机制。<Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="intraday-state">
        <p className="section-kicker">24 · 日内状态依赖</p>
        <h2>绝对 tick 一天内通常不变，natural spread、订单到达和信息风险却在变，所以约束强度会沿 phase 改变。</h2>
        <p>
          开盘附近信息不对称与波动较高，连续世界所需 spread 可能本来就宽于数个 ticks；午间波动和流量下降，spread 仍可能因等待成本而宽；收盘前流量聚集、竞争增强，一格状态可能上升。同一股票的 BR、queue length 与改价价值因此具有 1.16 已建立的日内季节性。改革研究不能把开盘后一小时和午间混在一起，再把时间构成变化归因于 tick。
        </p>
        <div className="boundary-box"><b>最小日内协议</b><p>在相同本地 time cell 内比较 relative tick、time-weighted BR、fixed-bp depth、fixed-Q cost、fill 和 markout；opening/closing auction 单独编码。若用全日加权，权重必须在改革前冻结，避免新制度把成交迁往某时段后又改变自己的汇总权重。</p></div>
      </section>

      <section className="lesson-section" id="price-thresholds">
        <p className="section-kicker">25 · 价格水平、拆股与分档门槛</p>
        <h2>价格进入 relative tick 的分母，也可能决定适用哪一档规则；价格变化既是状态，又可能改变 treatment。</h2>
        <p>
          二拆一把约 80 元价格变为 40 元，若绝对 tick 保持 0.01，relative tick 从 1.25 bp 加倍到 2.5 bp。Yao–Ye 利用 ETF split/reverse split 研究这个通道，O’Hara、Saar 与 Zhong 的 NYSE 订单级证据则显示更大 relative tick 与 HFT 做市订单停留更久、更积极交易和更高利润率相关。二者均不允许把“拆股后所有变化”叫 tick effect：股数单位、投资门槛、options 和投资者组成也可能变化。<Cite n={16} /><Cite n={17} />
        </p>
        <div className="boundary-box"><b>后文所需的最低研究语言</b><p>Treatment 是规则直接改变的处理，control 是未受同一直接改变、用来近似反事实的对照；assignment 是证券怎样被分到两组。Pretrend 是改革前两组结果路径，anticipation 是参与者在正式日期前预先响应，spillover 是处理又改变了对照组。Event study 按相对日期描绘路径，DiD 则用处理组前后变化减对照组前后变化。Intention-to-treat（ITT）按改革前冻结的资格分组，不因事后是否真正暴露而改组；actual treatment 按每日真实 tick 描述暴露，却可能由当日价格内生决定。Donut 做法是剔除最靠近阈值、最容易误分或被操纵的一小圈观察。这里先闭合语言，系统识别留给 7.25。</p></div>
        <p>
          Price-banded tick table 还制造动态 treatment。香港 0.50 与 10 港元边界、日本不同价段、欧盟价格行都可能切换 tick；一只股票因新闻跨过边界时，收益冲击同时改变 outcome 与规则，不是天然随机分配。较稳健的主分析按改革前价格或资格冻结 ITT 分组，并对边界附近使用预先规定的 donut；每日实际 tick 只用于 actual-treatment 的辅助描述或明确承认内生性的估计，不能反过来重写主分组。还要检查跨界频率、改革前趋势、提前响应和跨场所 spillover。
        </p>
      </section>

      <section className="lesson-section" id="heterogeneity">
        <p className="section-kicker">26 · 活跃度、波动与 Natural Spread</p>
        <h2>政策相关的不是 tick 单独大小，而是它相对于无网格竞争成本、订单到达和风险的大小。</h2>
        <div className="table-scroll" role="region" aria-label="Tick 效果的状态异质性，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>改革前状态与主要权衡</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">网格变细的主要机会</th><th scope="col">主要风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">高活跃、一格、长队列</th><td>释放 inside price、压缩 queue rent、改善小信号表达</td><td>Best depth 分散、消息与改价竞争增加</td></tr>
              <tr><th scope="row">低活跃、spread 很多格</th><td>机械 price fidelity 收益有限</td><td>便宜 undercutting 破坏本就稀少的显示供给</td></tr>
              <tr><th scope="row">高波动 / 高 adverse selection</th><td>允许更精细风险调整</td><td>Natural spread 本就宽，tick 可能非 binding</td></tr>
              <tr><th scope="row">低价但高成交</th><td>绝对小 tick 仍可能有很大比例收益</td><td>Relative tick、fees 与 odd-lot 共同约束</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          2026 年 Barardehi、Dixon、Liu 与 Lohr 对美国 Tick Size Pilot 的再研究把权衡表述为 pricing fidelity 对 undercutting：改革前 quoted spread 低于约 10 美分的股票，提高至 5 美分 tick 损害市场质量；spread 高于约 15 美分的股票则可能因抑制 undercutting 而改善。阈值来自该 pilot 与模型设定，不是全球监管公式；它最重要的贡献是证明把所有“非一格股票”合并，会让方向相反的处理效应相互抵消。<Cite n={26} />
        </p>
        <p>
          SEC 对 Pilot 数据与文献的官方归档，以及 Chung 等对合并十档簿的研究，在平均上记录了更宽 spread 与更厚显示 depth 可以并存；不同论文对大单成本、价格效率和受益群体的结果并不完全相同。把平均结果与新异质性证据并置后，正确结论不是选一个指标宣布胜负，而是检验改革前 spread、订单规模和交易渠道怎样分裂处理效应。<Cite n={22} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="products">
        <p className="section-kicker">27 · 产品异质性</p>
        <h2>股票、ETF、期货与期权都用“tick”这个词，却由不同价值锚、乘数、到期和做市协议生成结果。</h2>
        <p>
          股票的基础对象是每股价格与公司行动；ETF 有可观察的篮子价值、申赎套利与拆分；期货的 tick value 由合约点值乘数决定，现货—期货 price discovery 还受不同交易时钟影响；期权的最小报价可能随权利金水平、系列或项目资格变化，其价值对标的价格的方向敏感度、曲率和组合对冲需求又会改变做市价值，完整的期权敏感度留给 1.23。跨产品比较至少统一 relative tick、tick value、期限、名义本金（notional，即价格乘以数量或合约规模）、交易时段与费用，不能拿一份合约“一格 12.5 美元”与股票“一股一分钱”直接排序。
        </p>
        <p>
          Ahn、Cao 与 Choe 的 AMEX 低价股票改革、Bacidore 的 Toronto decimalization，以及 Dyhrberg、Foley 与 Svec 的加密资产极细网格改革，都支持在产品和初始状态内解释。它们给出的共同方法是：先冻结原生规则和适用证券，再寻找对照；共同结论绝不是某个绝对 tick 适用于所有资产。<Cite n={8} /><Cite n={9} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="auction-interface">
        <p className="section-kicker">28 · 与 Auction 的窄接口</p>
        <h2>Tick 改变集合竞价可用的价格粒度与并列机会；候选生成、tie-break 和 allocation 仍由 1.17 的场所算法决定。</h2>
        <p>
          在同一价格范围内，tick 减半通常增加潜在候选档，让买卖限价曲线可在更细位置变化；它可能减少因粗网格产生的多价并列，也可能让订单分散到更多价位。若竞价规则只以订单限价、参考价或边界生成候选，实际集合并不等于“区间内所有 ticks”；若输出允许中间价或特殊回退，最终价也未必是任一初始订单价。研究程序应先调用 1.17 的 candidate generation，再用当日 tick table 校验每个输入与输出。
        </p>
        <div className="boundary-box"><b>不重复清算</b><p>1.18 不重新推导 B(p)、S(p)、paired volume、imbalance 或 allocation；只测试“同一订单意愿在新旧合法网格上怎样重报”以及清算结果差异。把不同 tick 下订单固定不变是机械反事实，把参与者重报纳入才是制度均衡。</p></div>
      </section>

      <section className="lesson-section" id="quality-vector">
        <p className="section-kicker">29 · 市场质量必须是向量</p>
        <h2>“总流动性分数”会掩盖受益者、成本和时间尺度；tick 改革至少要在八个坐标上共同报告。</h2>
        <div className="research-grid">
          <article><span>01 · Tightness</span><h3>报价与小单成本</h3><p>Time-weighted quoted spread、size-weighted effective spread、fees 与 price improvement；同时报 bp 和 ticks。</p></article>
          <article><span>02 · Displayed supply</span><h3>可比深度</h3><p>Best depth、mid±固定 bp depth 与完整 shape；不能把前 K 档当固定距离。</p></article>
          <article><span>03 · Large-order cost</span><h3>固定 Q / notional</h3><p>Book-walk VWAP、implementation shortfall 与尾部分位；分开立即执行和耐心母单。</p></article>
          <article><span>04 · Execution chance</span><h3>Fill 与等待</h3><p>订单年龄、queue ahead、期限内 fill、取消与未成交机会成本，按 priority rule 分层。</p></article>
          <article><span>05 · Maker outcome</span><h3>Markout 与供给</h3><p>多个 h 的成交后 mid、fee/rebate 和未成交状态，避免只看已成交返佣。</p></article>
          <article><span>06 · Informativeness</span><h3>Price discovery</h3><p>固定时间价格误差、跨市场 lead–lag 与公共新闻反应；quote count 不作替代。</p></article>
          <article><span>07 · Noise & operations</span><h3>离散噪声和消息</h3><p>Zero returns、bounce、noise-robust variance、messages、quote life 与系统失败。</p></article>
          <article><span>08 · Equilibrium migration</span><h3>场所和渠道</h3><p>Lit/dark/off-exchange、maker-taker/inverted、market share 与订单组成的迁移。</p></article>
        </div>
        <p>
          一个改革完全可能同时产生：quoted spread 8→6 bp、best depth 1,000→550、固定 10 bp depth 2,400→2,520、1,500 股 all-in cost 10→10.4 bp、100 股被动单两秒 fill 48%→55%。专业摘要应写“小单 tightness/fill 改善、显示量分散、固定大单成本略恶化”，而不是选择一个指标宣布全面成功或失败。
        </p>
      </section>

      <section className="lesson-section" id="rule-cards">
        <p className="section-kicker">30 · 五地 Rule Cards</p>
        <h2>真实数字只能从日期化规则进入；adoption、effective、compliance 与实际运行必须分开。</h2>
        <div className="table-scroll" role="region" aria-label="五地 tick size 规则卡，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>访问日期 2026-08-29；只列本节使用的最小范围，不替代完整 rulebook</caption>
            <thead><tr><th scope="col">Rule Card</th><th scope="col">截至访问日的制度事实</th><th scope="col">关键边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">中国 · SSE/SZSE A 股</th><td>2026-07-06 起生效的两所交易规则均规定 A 股申报价格最小变动单位为人民币 0.01 元。</td><td>基金、债券、B 股和其他产品另有单位；固定一分钱导致 relative tick 随股价变化。</td></tr>
              <tr><th scope="row">美国 · 当前运行</th><td>在 2027 临时豁免期间，Rule 612 的一般操作基准仍是 ≥$1 报价/订单不得小于 $0.01，&lt;$1 不得小于 $0.0001，另有特定例外。</td><td>Sub-tick trades、venue retail programs、odd lots 与 fees 另查；不能把字段精度当合法订单档。</td></tr>
              <tr><th scope="row">美国 · 已通过未合规</th><td>2024 修法为价格 ≥$1 且三个月 time-weighted average quoted spread（TWAQS，时间加权平均报价价差）≤$0.015 的 National Market System stock（NMS stock，全国市场体系证券）分配 $0.005，否则 $0.01，并按半年更新；未采用统一 trade increment。2026-06-11 的 34-105656 把 Rule 612 与 610(c) 合规临时豁免延至 2027 年 11 月首个工作日。</td><td>截至本节日期不能称半美分已运行；旧豁免到 2026 的资料已被后续命令更新。</td></tr>
              <tr><th scope="row">欧盟 · MiFID II / RTS 11</th><td>Trading venues 对相关 shares/depositary receipts 应用不小于表格所定 tick；表格由订单价格行与最相关市场的 average daily number of transactions（ADNT，平均每日成交笔数）流动性档共同决定。</td><td>不是“欧洲统一一分钱”；工具范围、主管机构计算、年度适用期与豁免必须配套。</td></tr>
              <tr><th scope="row">香港 · Phase 1 / 2</th><td>适用证券于 2025-08-04 将 HK$10.00&lt;P≤HK$20.00 的 0.02 降至 0.01、HK$20.00&lt;P≤HK$50.00 的 0.05 降至 0.02；2026-08-03 又将 HK$0.50&lt;P≤HK$10.00 的 0.01 降至 0.005。</td><td>适用范围排除 exchange-traded product（ETP，交易所交易产品）、债券、交易所期权和结构性产品；恰为 HK$0.50 的旧 tick 已是 0.005。</td></tr>
              <tr><th scope="row">日本 · JPX/TSE</th><td>当前按证券类别与价格区间使用 tick table；例如 TOPIX500 成分股 ≤¥1,000 为 ¥0.1，其他股票 ≤¥3,000 为 ¥1。已公布 2027-03-01 起转向以 Spread-to-Tick Ratio（STR，报价价差所含 tick 数）衡量流动性的分类。</td><td>2027 方法尚未运行；current 与 future table 不得混在同一样本。</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中国规则由上交所与深交所原文分别支持；欧盟规则来自 Article 49 与当前 RTS 11；香港和日本数字来自交易所官方页面。美国时点尤其容易出错：2024 final rule 给出的最初时点已经被后续命令覆盖，2026 命令把相关临时合规豁免再延至 2027；研究必须让 later order 覆盖 earlier schedule。<Cite n={28} /><Cite n={29} /><Cite n={31} /><Cite n={32} /><Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="reform-types">
        <p className="section-kicker">31 · 改革不只有“变大 / 变小”</p>
        <h2>Treatment 名称必须把价格网格、成交约束、路由与费用拆开；否则回归系数没有清楚机制对象。</h2>
        <div className="table-scroll" role="region" aria-label="Tick 改革类型，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>六类常见制度处理</caption>
            <thead><tr><th scope="col">Treatment</th><th scope="col">直接改变</th><th scope="col">最小可识别表述</th></tr></thead>
            <tbody>
              <tr><th scope="row">Uniform quote tick</th><td>所有适用报价的最小档</td><td>报价网格变化；仍需查 trades 与 exceptions</td></tr>
              <tr><th scope="row">Price/liquidity schedule</th><td>特定档或动态分类</td><td>分档规则 effect，处理身份可能随状态变化</td></tr>
              <tr><th scope="row">Quote + trade increment</th><td>公开价格与成交价集合</td><td>组合的 quote/trade grid effect</td></tr>
              <tr><th scope="row">Trade-at addition</th><td>不展示者能否匹配公开价</td><td>Grid + routing restriction package</td></tr>
              <tr><th scope="row">Tick + fee cap</th><td>名义与 cum-fee 竞争同时变化</td><td>Pricing-and-fee package，除非另有错位识别</td></tr>
              <tr><th scope="row">Venue-specific grid</th><td>场所相对价格竞争力</td><td>含 market-share spillover 的跨 venue treatment</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国 Pilot 的 control 与三个 test groups 正是审计模板：Group 1 主要扩大 quoting increment，Group 2 再加入 trading increment 与例外，Group 3 还加入 trade-at。把三组一起标作 `large_tick=1` 会把不同机制平均；比较 G2−G1 或 G3−G2 也只有在随机化、无差异 spillover 和遵从成立时，才接近增量机制。<Cite n={21} /><Cite n={22} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">32 · 互动实验</p>
        <h2>先手算网格与成本，再为具体证券选择研究设计；每道题都要求说明结论边界。</h2>
        <p>
          实验分为“机制计算”和“制度识别”两组。前者检查分段合法网格、inside-price 数、固定价格窗口 depth 与含未成交成本的行动价值；后者检查条件预测、maker markout、价格跨档的内生 assignment 和组合政策 DiD。八题以重新组合的参数和新情境训练迁移，不靠逐字复述正文答案。完成后应能把“tick 变了”改写成一条可核查链：谁多了或少了哪个合法动作，队列和路由怎样响应，哪一个结果指标才对应所声称的机制。<Cite n={1} /><Cite n={17} /><Cite n={24} /><Cite n={30} />
        </p>
        <TickSizeLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">33 · 八个反例护栏</p>
        <h2>这些句子之所以危险，不是因为方向永远相反，而是因为它们跳过了约束状态、订单规模或制度接口。</h2>
        <div className="research-grid">
          <article><span>反例 01</span><h3>“Tick 越小，市场越有效”</h3><p>细网格可释放价格改善，也可使几乎无成本的 undercutting、撤单和深度分散占主导；初始 natural spread 与活跃度决定方向。<Cite n={15} /><Cite n={25} /><Cite n={27} /></p></article>
          <article><span>反例 02</span><h3>“一格价差证明 tick binding”</h3><p>它只证明当前公开价之间没有合法 inside quote；无网格反事实不可观察，还需 relative tick、时间占比和改革后新档采用共同支持。</p></article>
          <article><span>反例 03</span><h3>“Spread 下降，所有投资者都受益”</h3><p>小单可在 best quote 获益，大单却面对更薄或更分散的簿；机构母单还承担等待、泄露和未成交成本。<Cite n={10} /><Cite n={11} /><Cite n={23} /></p></article>
          <article><span>反例 04</span><h3>“Best depth 下降就是流动性下降”</h3><p>Tick 变细会把旧一档机械拆成多档；固定 bp depth 或固定 Q 成本可能不降反升，必须在相同经济距离比较。</p></article>
          <article><span>反例 05</span><h3>“消息率上升证明 HFT 损害市场”</h3><p>更多合法档本来就创造更多 reprice 机会。只有消息增加与 fill、resiliency、价格误差和系统负荷共同恶化，才支持净成本解释。<Cite n={17} /></p></article>
          <article><span>反例 06</span><h3>“Dark volume 是一个同质结果”</h3><p>Midpoint、fractional improvement、内部化与 block crossing 的价格改善、信息选择和显示供给外部性不同。<Cite n={19} /><Cite n={20} /></p></article>
          <article><span>反例 07</span><h3>“拆股是纯 tick 实验”</h3><p>拆股机械改变 relative tick，也改变股数、每手金额、投资者构成、期权与信号；它是多通道事件，除非设计能分解这些通道。<Cite n={6} /><Cite n={13} /></p></article>
          <article><span>反例 08</span><h3>“规则通过日就是实施后第一天”</h3><p>Adoption、legal effective、compliance 与实际运行可以不同；美国半美分规则和日本 2027 分类都必须按截止日标为尚未运行。<Cite n={28} /><Cite n={29} /><Cite n={40} /></p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">34 · 八个可证伪研究</p>
        <h2>把宏大的市场设计争论缩成局部反事实：谁因规则而改变网格，若机制成立，哪些结果应先变。</h2>
        <p>
          双重差分（difference-in-differences，DiD）不是“处理组改革前后做一次相减”，而是再减去同期对照组的变化。它依赖处理前趋势可比、没有差异化同期冲击、分组不由结果反向决定等条件；事件研究则把每个相对日期的系数画出，用于检查预趋势、提前反应和效应路径。组合政策只能先识别整包效果，除非存在分阶段、分组或阈值使各机制错位。
        </p>
        <div className="equation-card">
          <span>最小 DiD 估计量</span>
          <div>β̂<sub>DiD</sub>=(Ȳ<sub>T,post</sub>−Ȳ<sub>T,pre</sub>)−(Ȳ<sub>C,post</sub>−Ȳ<sub>C,pre</sub>)</div>
          <p>T 是处理组，C 是对照组，pre/post 是改革前后；Y 必须预先指定为 spread、固定 bp depth、固定 Q cost、fill 或其他单一结果。Y 上横线表示该组该时期的样本平均，β 上帽子表示它是由样本估计出来的量，β̂ 与 Y 单位相同。直白说，先算处理组前后差，再扣掉对照组同期变化；它不会自动排除处理组特有新闻、跨场所 spillover 或价格跨档造成的内生分组。</p>
        </div>
        <div className="research-grid">
          <article><span>研究 A · HKEX Phase 2</span><h3>HK$0.50&lt;P≤HK$10.00 档减半后，价格改善收益是否超过深度分散？</h3><p><b>设计：</b>以 2026-08-03 前冻结的价格和证券范围确定处理组，使用相邻未变区间或匹配证券；报告 spread bp、fixed-HKD/fixed-bp depth、fill、cancel/replace 与 fixed-Q cost，并分别审计 0.50 与 10 两个边界。<b>否证：</b>若只见 best depth 下降而固定带深度与执行成本不变，不能支持流动性恶化；事件后才跨档的证券不得反向定义处理。<Cite n={38} /></p></article>
          <article><span>研究 B · Tick Pilot 分解</span><h3>Quote grid、trade increment 与 trade-at 各自改变了什么？</h3><p><b>设计：</b>Control、G1、G2、G3 分开；G1−control 解释报价网格组合，G2−G1 检验成交网格增量，G3−G2 检验 trade-at 增量，同时按改革前 spread 分层。<b>失败：</b>把三组并成 large-tick dummy、忽略路由 spillover 或外推到高流动大盘股。<Cite n={21} /><Cite n={22} /><Cite n={26} /><Cite n={30} /></p></article>
          <article><span>研究 C · Venue Grid Competition</span><h3>更细场所获得份额，是改善全市场价格还是只重分订单？</h3><p><b>设计：</b>同时观察进入场所、原场所与合并市场的 quote、trade、depth 和 fee-adjusted cost；以改革前 binding 状态分层。<b>否证：</b>若单场所领先只来自订单迁移、全市场成本与价格误差不变，不能称整体 price discovery 改善。<Cite n={18} /><Cite n={24} /></p></article>
          <article><span>研究 D · Split / Reverse Split</span><h3>Relative tick 的机械变化是否预测队列和价差变化强度？</h3><p><b>设计：</b>分开公告日与除权日，用预先宣布的 ratio 预测 relative-tick change，匹配未拆分证券并控制每手名义金额、新闻与投资者构成。<b>失败：</b>若所谓 tick effect 只在公告日出现、除权日没有随机械幅度变化，纯网格解释受损。<Cite n={6} /><Cite n={13} /><Cite n={14} /></p></article>
          <article><span>研究 E · A 股低价交互</span><h3>固定 0.01 元在低价股中是否把竞争从价格推向队列？</h3><p><b>设计：</b>用事件前价格冻结高 relative-tick 组，按板块、日内 phase 和涨跌幅制度分层；结果包括 BR、queue ahead、fixed-bp depth、fill 与 price error。<b>失败：</b>涨跌停锁定时的低观察波动和单边厚队列不能被解释为低风险或双边流动性。<Cite n={36} /><Cite n={37} /></p></article>
          <article><span>研究 F · Queue Competing Risks</span><h3>粗 tick 是否提高队首租金，却降低后来订单的期限内成交？</h3><p><b>设计：</b>在预先固定的观察期限 h 内，把 full fill（全部成交）、主动撤回余量和真实的 time-in-force / session expire（订单时效或交易阶段到期）作为三种互斥 competing-risk 事件；截至 h 仍 live 且有余量的订单作 administrative right-censoring（行政右删失：只知道它在观察截止前尚未发生上述终点），不能记成 expire。部分成交不得删除，另存 filled fraction=Q<sup>fill</sup>/q、成交 VWAP 和剩余数量。由下单时可见事件构造 queue ahead，在改革前后联合估计三种事件，并比较净 markout。若研究改用“至少成交一股”而非 full fill，必须事前改写 endpoint，不能看结果切换。<b>否证：</b>只对已成交订单回归会选择队首和有利状态，不能估计全部提交者福利。<Cite n={4} /><Cite n={17} /></p></article>
          <article><span>研究 G · Future Rules</span><h3>尚未运行的美国与日本制度怎样在今天建立可审计基线？</h3><p><b>设计：</b>预注册样本、规则版本、处理分类、事件窗与主要结果；美国必须等待 2027-11-01 实际进入合规且未再改期，日本等待 2027-03-01 分类运行。<b>失败：</b>用 2026 行情写“half-cent post”或把未来 STR 分类当现行处理。<Cite n={29} /><Cite n={40} /></p></article>
          <article><span>研究 H · Welfare Vector</span><h3>谁获得窄价差，谁承担等待、深度与供给成本？</h3><p><b>设计：</b>预先冻结小单、大单、maker、issuer 与 venue 的结果权重，报告分布而非一个市场质量均值；长期再看流动性供给参与和资本成本。<b>边界：</b>没有明确权重时只能报告多维重分配，不能把某一群体成本下降称社会福利提高。<Cite n={3} /><Cite n={7} /><Cite n={22} /></p></article>
        </div>
      </section>

      <section className="lesson-section" id="measurement">
        <p className="section-kicker">35 · 数据与测量协议</p>
        <h2>Tick 研究最常见的假结果来自规则错版、距离单位变化、处理组回看和只保留已成交样本。</h2>
        <div className="table-scroll" role="region" aria-label="Tick size 研究数据协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每一条行情或订单事件都应能回到当时适用规则</caption>
            <thead><tr><th scope="col">层</th><th scope="col">必须冻结</th><th scope="col">典型错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Security master</th><td>证券、产品、币种、venue、价格、lot/round-lot、公司行动与板块</td><td>把合约乘数、数量单位或拆股变化当 tick 效果</td></tr>
              <tr><th scope="row">Rule version</th><td>规则号、发布日期、effective/compliance/relief、适用范围、历史版本</td><td>用今天规则重算历史订单，或把 adoption 当 operation</td></tr>
              <tr><th scope="row">Grid engine</th><td>逐价格档 tick、端点、quote/order/trade 差异与例外</td><td>全价格轴只用一个 τ，跨档仍以 spread/τ 计步</td></tr>
              <tr><th scope="row">Quotes & book</th><td>event time、bid/ask、逐档显示/隐藏量、queue ahead、priority 与状态持续时间</td><td>消息加权 BR；以“前五档”跨改革比较固定距离</td></tr>
              <tr><th scope="row">Orders & executions</th><td>parent/child、方向、决策 mid、partial/full fill、cancel、真实 expire、观察窗末 live/right-censored、VWAP、剩余量与多个期限 markout</td><td>只保留 fills；把观察截止时仍 live 的订单误标为 expire；以成交后才知道的状态标注下单时预测</td></tr>
              <tr><th scope="row">Fees & routing</th><td>venue fee/rebate、监管 cap、retail/dark/midpoint、protected 与 visible 状态</td><td>把屏幕 spread 当 all-in cost；把 dark 合成一个 dummy</td></tr>
              <tr><th scope="row">Clock & phase</th><td>本地时间、UTC、DST、opening/continuous/closing、停牌与特殊日</td><td>混合日内季节性，或把 auction price 当连续簿 quote</td></tr>
              <tr><th scope="row">Treatment lock</th><td>改革前价格/流动性分类、预趋势窗、对照、排除与主要 outcome</td><td>用改革后价格回填 treatment，或看完结果再选阈值</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最小输出不只是一张平均 spread 表。应同时给相对 tick 与 BR 的分布、time-weighted quoted spread、size-weighted effective spread、mid±固定 bp depth、固定 Q/notional book-walk cost、母单 implementation shortfall、期限内 partial/full fill、cancel、真实 expire 与 live/right-censored、多个期限 markout、noise-robust variance、price error、消息率与跨渠道份额。每个分母都要写明：按时间、成交、订单还是证券等权；否则 tick 改变消息和成交构成后，权重本身会成为结果。
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>每道答案都要区分机械计算、主体响应、可观察证据与不能推出的福利判断。</h2>
        <div className="practice-grid">
          <article><span>练习 01 · 一分钱的比例</span><h3>A 股 bid/ask=4.99/5.00 元，B 股 bid/ask=49.99/50.00 元，tick 都是 0.01 元且 displayed spread 都恰为一格。用各自精确 mid 求完整 relative tick 与 quoted half-spread。</h3><details className="practice-answer"><summary>展开参考答案</summary><p>A 的 mid=4.995，完整 tick 为 10⁴×0.01/4.995≈20.0200 bp，从 mid 到任一公开最优价为 10⁴×0.005/4.995≈10.0100 bp；B 的 mid=49.995，两者分别约为 2.0002 bp 与 1.0001 bp。完整 tick 与 quoted half-spread 不能混用；价格改善、midpoint 或特殊执行可以让 effective half-spread 小于半格，因此这不是有效成本硬下限，也不能推出 A 总成本正好是 B 的十倍。</p></details></article>
          <article><span>练习 02 · Join / Improve</span><h3>Bid/ask=20.00/20.02，tick=0.01，ask 队列已有 3,000 股。新卖方想挂 500 股：有哪些公开 resting 选择？若 tick 变成 0.005，行动集合怎样改变？</h3><details className="practice-answer"><summary>展开参考答案</summary><p>旧网格可 join 20.02，也可 improve 到已经合法的 20.01；报 20.00 会触及买价而成为可执行订单，不再是 inside resting ask。新网格保留 20.010，并新增 20.015 与 20.005 两个 inside 档，交易者可用更小价格让步购买价格优先。它不保证改价占优：每档的 queue、fill、markout、fee 与旧 20.02 时间优先都要进入 V<sub>j</sub>。</p></details></article>
          <article><span>练习 03 · 深度重分桶</span><h3>Mid=10.00。旧制 ask 10.01 有 4,000 股；新制 ask 10.005 有 1,800 股、10.010 有 2,500 股。比较 best depth、mid 上方 10 bp 内累计 depth，以及 4,000 股同步显示簿 VWAP。</h3><details className="practice-answer"><summary>展开参考答案</summary><p>Best depth 从 4,000 降至 1,800，下降 55%；10 bp=0.01 元，新制两档合计 4,300 股，比旧制多 7.5%。旧制 4,000 股 VWAP=10.010；新制 VWAP=[1,800×10.005+2,200×10.010]/4,000=10.00775，相对 mid 的显示簿成本由 10 bp 降至 7.75 bp。这只确定同步快照下的机械 displayed-book cost；真实 all-in 实现成本仍取决于费用、隐藏量、撤单、延迟和母单执行。</p></details></article>
          <article><span>练习 04 · Cum-fee 成本</span><h3>决策 mid=50.00，主动买在 50.01 成交，taker fee=0.002 元/股且完全传递。求相对 mid 的价格成本、费用与 all-in 成本。</h3><details className="practice-answer"><summary>展开参考答案</summary><p>价格成本为 10⁴×0.01/50=2 bp；费用为 10⁴×0.002/50=0.4 bp；all-in 为 2.4 bp。不能把 quoted full spread 0.02 元也全部加上，因为相对 mid 的主动买只支付半边；若执行基准、费用传递或成交价不同，需要重新计算。</p></details></article>
          <article><span>练习 05 · Venue 迁移</span><h3>只有 Venue X 把 tick 从 0.01 降至 0.005；其成交份额由 12% 升至 20%，X 自身 spread 收窄，但合并全市场 effective spread 仍为 5 bp。最弱可信结论是什么，还需怎样判断市场整体改善？</h3><details className="practice-answer"><summary>展开参考答案</summary><p>最弱结论是更细网格与订单/成交向 X 迁移相容，且 X 局部报价更紧；合并 effective spread 不变，尚无全市场执行改善证据。应同步观察各场所与合并市场的 fixed-bp depth、fixed-Q all-in cost、fill、price error、fee-adjusted routing 和 spillover。主对照应是预先冻结且未暴露于 X 改革的证券，或不与 X 共享路由体系的市场；交易同一受处理证券的其他 venue 是溢出结果，除非能证明没有跨场影响，否则不能充当干净 control。若份额只来自重路由而合并成本、深度与价格误差不变，就只能称竞争位置重分配，不能称社会福利提高。<Cite n={24} /></p></details></article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>能在“规则—行动—队列—执行—反馈”之间往返，而不是只背 tick 定义，才算掌握。</h2>
        <div className="check-grid">
          <details><summary>01 · Tick、显示精度与 lot size 为什么不能互换？</summary><p>Tick 约束合法价格间距，显示精度只决定字段能呈现多少位，lot size 约束数量或整手；三者可以独立变化。</p></details>
          <details><summary>02 · 为什么 relative tick 比绝对 tick 更适合跨股票比较？</summary><p>同一分钱占 5 元和 50 元价格的比例相差十倍；relative tick 把一格除以参考价格，表达可比的经济距离。</p></details>
          <details><summary>03 · 一格 spread 为什么只是 binding proxy？</summary><p>它证明没有公开 inside price，却不能观察无网格 natural spread；信息风险、费用和等待也可能让交易者不愿改善。</p></details>
          <details><summary>04 · 粗 tick 怎样提高速度与 queue rank 的价值？</summary><p>价格改善被整格门槛挡住后，竞争转到同价 FIFO、显示量或类别优先；较早位置获得更高成交机会，但未必盈利。</p></details>
          <details><summary>05 · 为什么 best depth 不能跨 tick 改革直接比较？</summary><p>档宽改变会机械重分数量；应补充固定 bp/货币窗口、完整 shape 和固定 Q 执行成本。</p></details>
          <details><summary>06 · Quote grid 与 execution grid 为什么可能不同？</summary><p>Midpoint、hidden、零售改善和规则例外可产生 sub-tick trade；反之，组合制度也可另设 trade increment。</p></details>
          <details><summary>07 · Fees 为什么形成经济上的亚 tick 差异？</summary><p>同一显示价格在不同 venue 的 fee/rebate 不同，主动者全额成本和被动者净收益因而不同；router 会比较 cum-fee 价格。</p></details>
          <details><summary>08 · 更细 tick 后消息增加，最弱能说明什么？</summary><p>合法 reprice 状态和竞争活动增加；没有 fill、成本、价格误差与系统负荷证据，不能判断是效率还是浪费。</p></details>
          <details><summary>09 · 为什么 stock split 不是干净的 tick 随机实验？</summary><p>它同时改变股价、股数、每手金额、投资者构成和可能的信号；必须分公告与除权并检验机械幅度。</p></details>
          <details><summary>10 · 真实 Rule Card 最少冻结什么？</summary><p>场所、产品、价格/流动性档、quote/order/trade increment、优先规则、费用、例外、发布日期、法律生效日、合规日、豁免和访问日。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节把 tick 交付为一个可计算制度状态；下一节加入借券约束，后续章节再评价规则与识别因果。</h2>
        <div className="interface-grid">
          <article><span>← 1.05</span><h3>Bid–Ask Spread</h3><p>输入 quoted/effective/realized spread 及其成本来源；1.18 只问价格网格怎样约束这些连续竞争结果。</p></article>
          <article><span>← 1.04 / 1.14</span><h3>Order Book 与竞争</h3><p>输入 queue ahead、price-time priority、join/improve/cancel 与流动性供给者价值；本节把 tick 变为这些行动的制度门槛。</p></article>
          <article><span>← 1.17</span><h3>Opening / Closing Auction</h3><p>输入候选价、tie-break 与 allocation；本节只改变合法候选网格，并区分机械重算与参与者重报。</p></article>
          <article><span>→ 1.19</span><h3>Short Selling 与 Securities Lending</h3><p>输出可比价格网格、queue 与执行成本；下一节加入 locate、borrow fee、recall 与卖空约束，解释卖方供给为何可能缺席。</p></article>
          <article><span>→ 5.05</span><h3>Financial Regulation 与 Market Design</h3><p>输出 Rule Card、利益相关者向量和组合政策边界；5.05 再处理社会权重、监管套利与风险迁移。</p></article>
          <article><span>→ 7.25</span><h3>Research Design：从世界观到可证伪问题</h3><p>输出动态 treatment、pretrend、spillover、固定信息集和失败状态；7.25 再系统展开识别与预注册。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="closing-diagnostic">
        <p className="section-kicker">39 · 结课诊断</p>
        <h2>看到一次 tick 改革，先不要问“流动性升还是降”；先还原它改变了谁的哪一种最小行动。</h2>
        <p className="closing-thesis">
          面对任何最小报价单位变化，应依次追问：适用的是哪一场所、产品、价格或流动性档；规则约束 quote、order 还是 trade，何时真正进入合规；当前一格占价格多少 bp，spread 有几格，一格状态占多少时间；改革前 natural spread 是否可能已宽于网格；交易者能否 join、improve、take、wait、cancel、隐藏执行或迁往另一场所；priority、queue ahead、fee/rebate 和例外怎样改变这些选择的价值；best depth 的变化是经济供给改变还是重分桶；小单、固定 Q 大单、maker 与未成交订单分别发生什么；价格变化是更细分辨率、bid–ask bounce 还是更准确的共同信息；订单和成交是否迁往 dark、retail 或其他 venue；结论识别的是单一网格、组合政策还是市场均衡；最后，哪些群体受益、哪些成本尚未被计量。只有沿这条链闭合，tick 才不再是一行交易所参数，而成为连接价格竞争、队列权利、执行成本与市场设计的可检验机制。
        </p>
      </section>
    </>
  );
}

export const lesson118: LessonRecord = {
  slug: '1-18',
  id: '1.18',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Tick Size 与最小报价单位',
  subtitle: '从合法价格网格与相对 tick 出发，解释价格改善、队列租金、深度重分桶、费用与场所迁移，并把真实制度改革转化为可证伪研究',
  readingTime: '约 108–115 分钟（核心阅读 66–69＋互动实验 14–15＋主动练习 17–19＋理解检查 8–9＋课程接口 3；参考文献与延伸阅读不计）',
  prerequisite: '1.05 · Bid–Ask Spread 为什么存在；建议回看 1.04 · Limit Order Book 的结构 与 1.14 · Liquidity Provider Competition 与 HFT',
  updatedAt: '2026-08-29',
  revision: '1.18-r7',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r1',
      summary: '首轮核对全文、公式、制度规则、引文与互动题后，要求修正分段网格跨界算法、若干当前规则时点与经验主张边界，并补全行动价值和研究设计中的定义域。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r1',
      summary: '确认机制主线与整体坡度成立；要求闭合术语首次解释、公式直译、练习独立可解性、互动反馈与章节接口，减少可能泄露答案的提示。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r2',
      summary: '确认首轮核心修订落位；继续要求区分报价、订单与成交网格，校准价格分档边界和官方规则时点，并闭合 partial-fill 与组合政策识别公式。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r2',
      summary: '确认定义、制度卡与主要算例改善；要求进一步降低认知跳跃，令反例、练习、研究任务和八题实验分别训练独立机制，且所有输入足以唯一作答。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r3',
      summary: '全量回归后要求把 grid wedge 明确限定为机械离散楔子而非均衡利润，并修正跨价格档 inside-price 计数、若干制度区间与外溢控制。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.18-r3',
      summary: '确认零背景坡度、因果链、术语、公式翻译、案例、练习、检查、互动状态机、阅读预算和网页结构在该版本均达到出版与教学要求。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r4',
      summary: '确认网格楔子和分档计数方向正确；要求补齐部分成交行动价值的数量、单位、空集合与未成交成本边界，并把 competing events 与行政右删失写成可复现协议。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r4',
      summary: '确认主要准确性修订没有破坏教学结构；要求让 partial-fill 公式完全自足，并清除互动 A1 中会直接提示合法价或当前 tick 的答案线索。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r5',
      summary: '确认 partial-fill 与竞争风险框架基本闭合；仅要求统一剩余数量成本的一般形式与二元退化条件，并确保 Research F 的完整成交、撤单、真实到期和存续样本互斥完备。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.18-r5',
      summary: '全量确认 40 节认知坡度、公式直译、五项练习、十项检查、八个反例、八个研究任务和八题实验均自足且不靠正文答案复刻。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r6',
      summary: '全文与规则时点回归通过；唯一遗留是 A1 下档只给步长而未给绝对网格锚点，合法价格集合因此不能从题面唯一推出。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.18-r6',
      summary: '其余教学与交互检查全部通过；同样仅要求为 A1 补充中性的下档网格锚点，同时不得重新泄露合法集合、当前 tick 或数值答案。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.18-r7',
      summary: '终审确认零锚点使 A1 唯一可解但不泄露答案；全部公式、单位、40 条来源、当前规则时点、练习检查、八题状态机和导航通过，blocker、major、minor 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.18-r7',
      summary: '终审确认 40 节坡度、术语首释、公式直译、案例与反例、五项练习、十项检查、八个研究任务、八题可访问实验、21 张阅读卡及 108–115 分钟预算全量通过，blocker、major、minor 均为 0。',
    },
  ],
  previous: { slug: '1-17', label: '1.17 Opening / Closing Auction' },
  next: { slug: '1-19', label: '1.19 Short Selling 与 Securities Lending' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整系统' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'objects', label: '八个对象' },
    { id: 'local-grid', label: '价格阶梯' },
    { id: 'tick-value', label: 'Tick Value' },
    { id: 'relative-tick', label: 'Relative Tick' },
    { id: 'spread-ticks', label: 'Spread Ticks' },
    { id: 'binding', label: 'Binding' },
    { id: 'reservation-map', label: '保留价映射' },
    { id: 'grid-wedge', label: '网格楔子' },
    { id: 'price-to-queue', label: '价格转队列' },
    { id: 'depth-migration', label: '深度重分桶' },
    { id: 'queue-ahead', label: 'Queue Ahead' },
    { id: 'priority-rules', label: 'Priority Rules' },
    { id: 'join-improve', label: 'Join / Improve' },
    { id: 'cancel-reprice', label: 'Cancel / Reprice' },
    { id: 'maker-taker-ledger', label: 'Maker / Taker' },
    { id: 'fees-grid', label: 'Fees 与经济网格' },
    { id: 'execution-grid', label: '成交网格' },
    { id: 'small-large-orders', label: '小单与大单' },
    { id: 'price-discovery', label: 'Price Discovery' },
    { id: 'discrete-volatility', label: '离散波动' },
    { id: 'messages-resiliency', label: '消息与恢复' },
    { id: 'intraday-state', label: '日内状态' },
    { id: 'price-thresholds', label: '门槛与拆股' },
    { id: 'heterogeneity', label: '状态异质性' },
    { id: 'products', label: '产品异质性' },
    { id: 'auction-interface', label: 'Auction 接口' },
    { id: 'quality-vector', label: '市场质量向量' },
    { id: 'rule-cards', label: '五地规则卡' },
    { id: 'reform-types', label: '改革类型' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例护栏' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'measurement', label: '测量协议' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
    { id: 'closing-diagnostic', label: '结课诊断' },
  ],
  Content: Lesson118Content,
  references: [
    { id: 1, authors: 'Lawrence E. Harris', year: '1994', title: 'Minimum Price Variations, Discrete Bid–Ask Spreads, and Quotation Sizes', publication: 'Review of Financial Studies, 7(1), 149–178', url: 'https://doi.org/10.1093/rfs/7.1.149', use: '建立最小价位、离散 spread 与报价量的理论和历史横截面联系；模拟结果不是实际改革的因果效应。' },
    { id: 2, authors: 'Lawrence Harris', year: '1991', title: 'Stock Price Clustering and Discreteness', publication: 'Review of Financial Studies, 4(3), 389–415', url: 'https://doi.org/10.1093/rfs/4.3.389', use: '区分交易者自愿 price clustering 与法定最小网格；分数报价时代样本限制现代外推。' },
    { id: 3, authors: 'Duane J. Seppi', year: '1997', title: 'Liquidity Provision with Limit Orders and a Strategic Specialist', publication: 'Review of Financial Studies, 10(1), 103–150', url: 'https://doi.org/10.1093/rfs/10.1.103', use: '支持正的最优 tick 可能来自订单规模与流动性供给权衡；specialist 模型不直接校准纯电子簿。' },
    { id: 4, authors: 'Tito Cordella & Thierry Foucault', year: '1999', title: 'Minimum Price Variations, Time Priority, and Quote Dynamics', publication: 'Journal of Financial Intermediation, 8(3), 141–173', url: 'https://doi.org/10.1006/jfin.1999.0266', use: '说明 tick 改变价格改善与同价时间优先的相对价值；不提供现代场所通用最优数值。' },
    { id: 5, authors: 'Thierry Foucault, Ohad Kadan & Eugene Kandel', year: '2005', title: 'Limit Order Book as a Market for Liquidity', publication: 'Review of Financial Studies, 18(4), 1171–1217', url: 'https://doi.org/10.1093/rfs/hhi029', use: '连接耐心、订单到达、spread、等待与 resiliency；不是 tick 改革的单独因果估计。' },
    { id: 6, authors: 'James J. Angel', year: '1997', title: 'Tick Size, Share Prices, and Stock Splits', publication: 'Journal of Finance, 52(2), 655–681', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb04817.x', use: '说明公司可经 share price 与 split 改变 relative tick 和做市激励；现实拆股仍有多重动机。' },
    { id: 7, authors: 'V. Ravi Anshuman & Avner Kalay', year: '1998', title: 'Market Making with Discrete Prices', publication: 'Review of Financial Studies, 11(1), 81–109', url: 'https://doi.org/10.1093/rfs/11.1.81', use: '说明离散网格可形成覆盖固定成本的租金，同时增加交易成本；结论依赖做市与信息假设。' },
    { id: 8, authors: 'Hee-Joon Ahn, Charles Q. Cao & Hyuk Choe', year: '1996', title: 'Tick Size, Spread, and Volume', publication: 'Journal of Financial Intermediation, 5(1), 2–22', url: 'https://doi.org/10.1006/jfin.1996.0002', use: '研究 AMEX 1992 低价股 tick 缩小，支持实际改革弹性可小于模型预测；旧市场结构限制外推。' },
    { id: 9, authors: 'Jeffrey M. Bacidore', year: '1997', title: 'The Impact of Decimalization on Market Quality: An Empirical Investigation of the Toronto Stock Exchange', publication: 'Journal of Financial Intermediation, 6(2), 92–120', url: 'https://doi.org/10.1006/jfin.1997.0213', use: 'TSE 1996 自然实验显示效果取决于原 tick 是否 binding；单一时代与市场限制外推。' },
    { id: 10, authors: 'Michael A. Goldstein & Kenneth A. Kavajecz', year: '2000', title: 'Eighths, Sixteenths, and Market Depth: Changes in Tick Size and Liquidity Provision on the NYSE', publication: 'Journal of Financial Economics, 56(1), 125–149', url: 'https://doi.org/10.1016/S0304-405X(99)00061-6', use: '用完整簿显示 1997 NYSE 改革后 top 与全簿 depth 下降、小单与大单结果分叉；制度背景较旧。' },
    { id: 11, authors: 'Charles M. Jones & Marc L. Lipson', year: '2001', title: 'Sixteenths: Direct Evidence on Institutional Execution Costs', publication: 'Journal of Financial Economics, 59(2), 253–278', url: 'https://doi.org/10.1016/S0304-405X(00)00087-8', use: '机构执行记录显示报价价差下降可与大额、主动订单成本上升并存；不能以成交级 spread 代替母单成本。' },
    { id: 12, authors: 'Hendrik Bessembinder', year: '2003', title: 'Trade Execution Costs and Market Quality after Decimalization', publication: 'Journal of Financial and Quantitative Analysis, 38(4), 747–777', url: 'https://doi.org/10.2307/4126742', use: '支持美国 decimalization 后小单 quoted/effective cost 改善；论文不直接回答大型机构交易程序成本。' },
    { id: 13, authors: 'David Easley, Maureen O’Hara & Gideon Saar', year: '2001', title: 'How Stock Splits Affect Trading: A Microstructure Approach', publication: 'Journal of Financial and Quantitative Analysis, 36(1), 25–51', url: 'https://doi.org/10.2307/2676196', use: '展示拆股后知情/非知情活动、限价执行与市价成本共同变化；拆股不是单一 tick treatment。' },
    { id: 14, authors: 'Paul Schultz', year: '2000', title: 'Stock Splits, Tick Size, and Sponsorship', publication: 'Journal of Finance, 55(1), 429–450', url: 'https://doi.org/10.1111/0022-1082.00211', use: '连接拆股、相对 tick、小买单与做市/推广激励；不证明 sponsorship 是全部动机。' },
    { id: 15, authors: 'David Bourghelle & Fany Declerck', year: '2004', title: 'Why Markets Should Not Necessarily Reduce the Tick Size', publication: 'Journal of Banking & Finance, 28(2), 373–398', url: 'https://doi.org/10.1016/S0378-4266(03)00136-5', use: 'Paris 分档改革显示 spread、depth 与 undercutting 非单调；不能把单一市场结果写成普遍方向。' },
    { id: 16, authors: 'Maureen O’Hara, Gideon Saar & Zhuo Zhong', year: '2019', title: 'Relative Tick Size and the Trading Environment', publication: 'Review of Asset Pricing Studies, 9(1), 47–90', url: 'https://doi.org/10.1093/rapstu/ray009', use: '说明 relative tick 与 HFT 做市行为、订单停留和深度的关系取决于是否受约束；交易者分类与 NYSE 样本有限。' },
    { id: 17, authors: 'Chen Yao & Mao Ye', year: '2018', title: 'Why Trading Speed Matters: A Tale of Queue Rationing under Price Controls', publication: 'Review of Financial Studies, 31(6), 2157–2183', url: 'https://doi.org/10.1093/rfs/hhy002', use: '支持统一绝对 tick 通过 queue rationing 提高速度价值；message-to-trade 不是可靠的通用 HFT 代理。' },
    { id: 18, authors: 'Yong Chao, Chen Yao & Mao Ye', year: '2019', title: 'Why Discrete Price Fragments U.S. Stock Exchanges and Disperses Their Fee Structures', publication: 'Review of Financial Studies, 32(3), 1068–1101', url: 'https://doi.org/10.1093/rfs/hhy073', use: '理论说明离散价格使 venue fee split 无法被连续报价完全抵消，连接 tick、费用与碎片化。' },
    { id: 19, authors: 'Amy Kwan, Ronald Masulis & Thomas H. McInish', year: '2015', title: 'Trading Rules, Competition for Order Flow and Market Fragmentation', publication: 'Journal of Financial Economics, 115(2), 330–348', url: 'https://doi.org/10.1016/j.jfineco.2014.09.010', use: '利用一美元阈值说明粗网格与长队列可推动亚 tick 暗场迁移；阈值附近公司和暗场类型限制外推。' },
    { id: 20, authors: 'Sean Foley & Tālis J. Putniņš', year: '2016', title: 'Should We Be Afraid of the Dark? Dark Trading and Market Quality', publication: 'Journal of Financial Economics, 122(3), 456–481', url: 'https://doi.org/10.1016/j.jfineco.2016.08.004', use: '利用最低价格改善规则区分 dark 类型及市场质量；不能把全部 dark volume 合并作单一福利判断。' },
    { id: 21, authors: 'Carole Comerton-Forde, Vincent Grégoire & Zhuo Zhong', year: '2019', title: 'Inverted Fee Structures, Tick Size, and Market Quality', publication: 'Journal of Financial Economics, 134(1), 141–164', url: 'https://doi.org/10.1016/j.jfineco.2019.03.005', use: 'Tick Pilot 中 inverted venue 份额与结果依 binding 状态变化；不支持 inverted fee 无条件最优。' },
    { id: 22, authors: 'Kee H. Chung, Albert J. Lee & Dominik Rösch', year: '2020', title: 'Tick Size, Liquidity for Small and Large Orders, and Price Informativeness: Evidence from the Tick Size Pilot Program', publication: 'Journal of Financial Economics, 136(3), 879–899', url: 'https://doi.org/10.1016/j.jfineco.2019.11.004', use: '用合并十档簿说明 Pilot 后小单成本与大单 depth/cost 可反向变化；仅适用于 Pilot 小盘低成交样本。' },
    { id: 23, authors: 'Gregory W. Eaton, Paul J. Irvine & Tingting Liu', year: '2021', title: 'Measuring Institutional Trading Costs and the Implications for Finance Research: The Case of Tick Size Reductions', publication: 'Journal of Financial Economics, 139(3), 832–851', url: 'https://doi.org/10.1016/j.jfineco.2020.09.003', use: '证明常用流动性代理与机构母单成本关联很弱；样本来自参与 Abel Noser 的机构。' },
    { id: 24, authors: 'Sean Foley, Tom G. Meling & Bernt Arne Ødegaard', year: '2023', title: 'Tick Size Wars: The Market Quality Effects of Pricing Grid Competition', publication: 'Review of Finance, 27(2), 659–692', url: 'https://doi.org/10.1093/rof/rfac032', use: 'Scandinavian venue tick war 显示更细网格可吸引份额并改善合并市场，尤其对原 binding 股票；非统一强制改革。' },
    { id: 25, authors: 'Ingrid M. Werner, Barbara Rindi, Sabrina Buti & Yuanji Wen', year: '2023', title: 'Tick Size, Trading Strategies, and Market Quality', publication: 'Management Science, 69(7), 3818–3837', url: 'https://doi.org/10.1287/mnsc.2022.4502', use: '模型与日美改革显示活跃度和 crossing network 改变 tick 效果；状态分组不是永久证券标签。' },
    { id: 26, authors: 'Yashar H. Barardehi, Peter Dixon, Qiyu Liu & Ariel Lohr', year: '2026', title: 'When Does the Tick Size Help or Harm Market Quality? Evidence from the Tick Size Pilot', publication: 'Journal of Financial Markets, 78, 101024', url: 'https://doi.org/10.1016/j.finmar.2025.101024', use: '按改革前 spread 识别 pricing fidelity 与 undercutting 的异质性；经验阈值不是全球政策常数。' },
    { id: 27, authors: 'Anne H. Dyhrberg, Sean Foley & Jiri Svec', year: '2023', title: 'When Bigger Is Better: The Impact of a Tiny Tick Size on Undercutting Behavior', publication: 'Journal of Financial and Quantitative Analysis, 58(6), 2387–2416', url: 'https://doi.org/10.1017/S0022109022001077', use: '加密市场极细 tick 上调后 undercutting 与多项成本下降，提供 tick 过小的反例；不可直接外推受监管股票。' },
    { id: 28, authors: 'U.S. Securities and Exchange Commission', year: '2024', title: 'Regulation NMS: Minimum Pricing Increments, Access Fees, and Transparency of Better Priced Orders · Release 34-101070', publication: 'Final Rule, 89 FR 81620', url: 'https://www.sec.gov/files/rules/final/2024/34-101070.pdf', use: '支持已通过的 $0.005/$0.01 TWAQS 分档、低价规则、半年分配及未采用统一 trade increment；实际合规时点须由后续命令更新。' },
    { id: 29, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-29', title: 'Order Granting Temporary Exemptive Relief · Release 34-105656', publication: 'SEC Order, 11 June 2026', url: 'https://www.sec.gov/files/rules/exorders/2026/34-105656.pdf', use: '把 Rule 612 与 Rule 610(c) 相关临时合规豁免延至 2027 年 11 月首个工作日；截至访问日半美分制度尚未要求运行。' },
    { id: 30, authors: 'U.S. Securities and Exchange Commission', year: '2015–2018', accessedAt: '2026-08-29', title: 'Tick Size Pilot Program', publication: 'Official program archive and Order 34-74892', url: 'https://www.sec.gov/data-research/tick-size-pilot-program', use: '支持 Pilot 证券范围、control 与三组 quote/trade/trade-at 处理及官方分析入口；不可外推到大盘高流动股票。' },
    { id: 31, authors: 'New York Stock Exchange', year: '2026', accessedAt: '2026-08-29', title: 'NYSE Rules · Rule 7.6 Minimum Price Variation', publication: 'Official rulebook', url: 'https://www.nyse.com/publicdocs/nyse/regulation/nyse/NYSE_Rules.pdf', use: '支持美国当前场所订单的一般 MPV 操作基准与场所例外；需与联邦 Rule 612 和后续豁免共同读取。' },
    { id: 32, authors: 'Nasdaq Stock Market', year: '2026', accessedAt: '2026-08-29', title: 'Nasdaq Equity 1 · Minimum Price Increment', publication: 'Official rulebook', url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/nasdaq-equity-1', use: '交叉核验美国当前 ≥$1 一分钱、<$1 万分之一美元的一般订单增量及场所规则范围。' },
    { id: 33, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-29', title: 'Market Activity Report Methodology', publication: 'Official market structure analytics methodology', url: 'https://www.sec.gov/featured-topics/market-structure-analytics/market-activity-report-methodology', use: '支持当前价格分档 round-lot 方法；提醒 round lot、odd lot、可见性与 tick 是不同对象。' },
    { id: 34, authors: 'European Parliament and Council', year: '2014/2026 consolidated', accessedAt: '2026-08-29', title: 'Directive 2014/65/EU · Article 49 Tick Sizes', publication: 'EUR-Lex consolidated text', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A02014L0065-20260606', use: '给出 MiFID II 对交易场所 tick-size regime 的上位法义务与工具范围。' },
    { id: 35, authors: 'European Commission', year: '2017/2023 consolidated', accessedAt: '2026-08-29', title: 'Delegated Regulation (EU) 2017/588 · RTS 11', publication: 'EUR-Lex consolidated text', url: 'https://eur-lex.europa.eu/eli/reg_del/2017/588/2023-06-05/eng', use: '支持按订单价格与 ADNT 流动性档交叉决定 tick 的表格及适用边界；不是欧盟统一单一 tick。' },
    { id: 36, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所交易规则（2026年修订）', publication: '官方规则，自 2026-07-06 施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml', use: '支持上交所 A 股人民币 0.01 元最小申报单位、价格优先时间优先及涨跌幅/动态申报范围边界。' },
    { id: 37, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '深圳证券交易所交易规则（2026年修订）', publication: '官方规则，自 2026-07-06 施行', url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf', use: '支持深交所 A 股人民币 0.01 元最小申报单位及板块、价格限制和动态申报范围边界。' },
    { id: 38, authors: 'Hong Kong Exchanges and Clearing', year: '2025–2026', accessedAt: '2026-08-29', title: 'Reduction of Minimum Spreads', publication: 'Official Phase 1 and Phase 2 implementation page', url: 'https://www.hkex.com.hk/Services/Trading/Securities/Overview/Trading-Mechanism/Reduction-of-Minimum-Spreads?sc_lang=en', use: '支持 2025-08-04 与 2026-08-03 分阶段区间、当前 spread table 与 Applicable Securities/排除范围。' },
    { id: 39, authors: 'Japan Exchange Group', year: '2026', accessedAt: '2026-08-29', title: 'Tick Size', publication: 'Official TSE current tick-size table', url: 'https://www.jpx.co.jp/english/equities/trading/domestic/07.html', use: '支持截至访问日按 TOPIX 500、one-unit ETF/ETN、other issues 与价格档使用的现行表。' },
    { id: 40, authors: 'Tokyo Stock Exchange', year: '2026', accessedAt: '2026-08-29', title: 'Revisions to Business Regulations and Other Rules in Connection With Revisions to Trading Rules to Further Enhance the Functionality of the Cash Equity Market', publication: 'Official rule revision outline, 6 August 2026', url: 'https://www.jpx.co.jp/english/rules-participants/rules/revise/vk0khi000001sdfo-att/Outline.pdf', use: '支持 2027-03-01 转向证券级 liquidity/STR 分类的正式生效日；截至本节日期不得列为现行制度。' },
  ],
  readingList: [
    { title: 'Harris (1994), Minimum Price Variations', scope: '离散价差、报价量与最小价格变化的经典框架', reason: '先建立价格网格怎样进入 spread 与显示量，而不是把 tick 当显示格式。', url: 'https://doi.org/10.1093/rfs/7.1.149' },
    { title: 'Cordella & Foucault (1999), Time Priority and Quote Dynamics', scope: 'Price improvement 与 queue priority 的动态权衡', reason: '理解本节最核心的“价格竞争转为队列竞争”。', url: 'https://doi.org/10.1006/jfin.1999.0266' },
    { title: 'Foucault, Kadan & Kandel (2005), LOB as a Market for Liquidity', scope: '耐心、到达率、等待与 resiliency', reason: '把静态价格阶梯升级为交易者持续响应的订单簿。', url: 'https://doi.org/10.1093/rfs/hhi029' },
    { title: 'Goldstein & Kavajecz (2000), Eighths, Sixteenths, and Depth', scope: 'NYSE 完整簿与订单规模异质性', reason: '训练同时读取 spread、top depth、全簿与大单成本。', url: 'https://doi.org/10.1016/S0304-405X(99)00061-6' },
    { title: 'Jones & Lipson (2001), Institutional Execution Costs', scope: '机构母单与窄 spread 的分叉', reason: '防止把屏幕报价改善直接等同所有投资者执行改善。', url: 'https://doi.org/10.1016/S0304-405X(00)00087-8' },
    { title: 'O’Hara, Saar & Zhong (2019), Relative Tick Size', scope: 'Binding 状态、HFT 做市与订单停留', reason: '学习为什么同一 relative tick 在 constrained 与 unconstrained 股票产生不同深度。', url: 'https://doi.org/10.1093/rapstu/ray009' },
    { title: 'Yao & Ye (2018), Queue Rationing under Price Controls', scope: '统一绝对 tick、速度与 queue rent', reason: '把速度价值定位为价格控制下的分配机制，而非技术标签。', url: 'https://doi.org/10.1093/rfs/hhy002' },
    { title: 'Chao, Yao & Ye (2019), Discrete Price and Exchange Fragmentation', scope: 'Tick、maker–taker 与 venue competition', reason: '理解同一屏幕价格怎样因费用形成不同经济队列。', url: 'https://doi.org/10.1093/rfs/hhy073' },
    { title: 'Foley & Putniņš (2016), Dark Trading and Market Quality', scope: 'Midpoint、fractional dark 与价格改善规则', reason: '避免把所有 sub-tick/dark execution 当成同一机制。', url: 'https://doi.org/10.1016/j.jfineco.2016.08.004' },
    { title: 'Chung, Lee & Rösch (2020), Small and Large Order Liquidity', scope: '美国 Pilot 的十档簿与大单成本', reason: '观察小单 spread 变差、累计 depth 与大单可执行性改善如何同时出现。', url: 'https://doi.org/10.1016/j.jfineco.2019.11.004' },
    { title: 'Eaton, Irvine & Liu (2021), Institutional Trading Costs', scope: '母单测量与流动性代理失配', reason: '学习为何结果变量选择本身会改变金融研究结论。', url: 'https://doi.org/10.1016/j.jfineco.2020.09.003' },
    { title: 'Foley, Meling & Ødegaard (2023), Tick Size Wars', scope: '跨 venue 价格网格竞争的 DiD', reason: '把场所份额迁移和合并市场质量放进同一反事实。', url: 'https://doi.org/10.1093/rof/rfac032' },
    { title: 'Werner et al. (2023), Tick Size, Strategies, and Quality', scope: '活跃度与 crossing network 的状态异质性', reason: '理解 tick 效果为何没有统一方向。', url: 'https://doi.org/10.1287/mnsc.2022.4502' },
    { title: 'Barardehi et al. (2026), When Does Tick Size Help or Harm?', scope: 'Pilot 的改革前 spread 分层', reason: '学习从平均处理效应转向可证伪的状态条件。', url: 'https://doi.org/10.1016/j.finmar.2025.101024' },
    { title: 'SEC 2024 Regulation NMS Final Rule', scope: '美国半美分 TWAQS 分档、fee cap 与半年分类', reason: '先读已通过的制度参数，再与下一张延期命令区分法律文本和实际运行。', url: 'https://www.sec.gov/files/rules/final/2024/34-101070.pdf' },
    { title: 'SEC 2026 Temporary Exemptive Relief Order', scope: 'Rule 612 / 610(c) 延至 2027 年 11 月首个工作日', reason: '训练让后续命令覆盖旧合规日，不把已生效法条写成已运行市场。', url: 'https://www.sec.gov/files/rules/exorders/2026/34-105656.pdf' },
    { title: 'SEC Tick Size Pilot Archive', scope: 'Control、TG1/TG2/TG3 与官方数据/分析', reason: '训练把 quote tick、trade increment 与 trade-at 组合拆开。', url: 'https://www.sec.gov/data-research/tick-size-pilot-program' },
    { title: 'EU RTS 11 · Delegated Regulation 2017/588', scope: '价格档 × ADNT 流动性档的动态表格', reason: '建立按工具和年度分类读取欧洲实施表的能力；上位法范围另见正文参考 34。', url: 'https://eur-lex.europa.eu/eli/reg_del/2017/588/2023-06-05/eng' },
    { title: 'HKEX Reduction of Minimum Spreads', scope: '2025/2026 两阶段改革、价格端点与产品范围', reason: '用最新真实改革练习冻结处理组并设计短期事件研究。', url: 'https://www.hkex.com.hk/Services/Trading/Securities/Overview/Trading-Mechanism/Reduction-of-Minimum-Spreads?sc_lang=en' },
    { title: 'JPX Tick Size', scope: '现行 TOPIX500/其他证券表与价格档', reason: '先冻结截至访问日实际运行的分类，并阅读同页标注的未来切换提示。', url: 'https://www.jpx.co.jp/english/equities/trading/domestic/07.html' },
    { title: 'TSE 2026 Rule Revision Outline', scope: '2027-03-01 STR 分类的正式生效日', reason: '把未来制度的法定切换与当前 tick table 分成两个单一来源。', url: 'https://www.jpx.co.jp/english/rules-participants/rules/revise/vk0khi000001sdfo-att/Outline.pdf' },
  ],
};
