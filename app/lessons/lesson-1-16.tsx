import IntradaySeasonalityLab from '../components/IntradaySeasonalityLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson116Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>日内季节性不是“钟表自己推动价格”，而是交易制度、隔夜信息、参与者重叠、基准执行、库存约束与公告时点反复在相同钟表位置相遇，由此生成可预测的条件分布。</h2>
        <p>
          许多股票市场的成交量与波动在开、收盘附近较高，中段较低；spread 常在开盘较宽、随后收窄，depth 则可能呈相反形状。Jain–Joh、Wood–McInish–Ord、Harris、McInish–Wood 与 Foster–Viswanathan 在历史 NYSE 数据中记录了这些重复模式，但它们没有建立一条无条件自然法则。更准确的表述是：当隔夜信息在闭市期间积累、开盘前可执行价格尚未被连续交易检验、临近收盘又出现基准、再平衡与隔夜持仓需求时，多个状态变量会在相似时点共同变化；换成午休市场、全天候外汇、不同拍卖制度或重大公告日，曲线可以出现双峰、反 J、局部尖峰，甚至完全重排。<Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={6} /><Cite n={7} />
        </p>
        <p>
          因而，“去季节性”不是删掉无意义噪声。稳定时钟成分既是研究其他机制时必须隔离的混淆，也是交易制度和主体约束留下的经济结果。正确做法是先分别定义 volume、volatility、spread、depth、duration 与 order flow 的条件基准，再把连续交易、集合竞价、午休重开、公告窗口和跨时区重叠作为不同 phase 建模；最后用只在过去样本估计的基准，把实际值拆成“该时点通常如此”和“今天此刻异常如此”。Andersen–Bollerslev 说明，忽略确定性日内周期会把短周期重复误读为更强的随机持续性；Boudt–Croux–Laurent 又说明，跳跃会反过来污染普通季节性估计。<Cite n={10} /><Cite n={11} /><Cite n={27} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>区分日内季节性、随机持续性、事件时钟与制度断点，并说明它们为何不能互换。</li>
            <li>从隔夜信息、逆向选择、库存、参与者重叠、基准交易和收盘风险构造开—中—收盘机制链。</li>
            <li>分别描述 volume、volatility、spread、depth 与 duration 的条件曲线，而不把“U 型”强加给所有变量和市场。</li>
            <li>用乘法分解和条件基准构造无未来泄漏的 intraday surprise。</li>
            <li>正确处理 auction、午休、零成交、陈旧报价、DST、半日市与交易时段改革。</li>
            <li>设计可证伪研究，区分稳定本地时钟、跨市场重叠、公告冲击与主体策略聚集。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 先画完整系统</p>
        <h2>钟表位置先改变谁能交易、知道什么、必须何时完成以及愿意承担多少风险；这些主体状态再经订单与报价进入可观察曲线。</h2>
        <div className="mechanism-chain" aria-label="日内季节性的条件生成链">
          {[
            ['制度时钟', '开闭市、连续交易、集合竞价、午休、半日市、价格限制与交易时段版本'],
            ['信息时钟', '隔夜消息、预定公告、公司事件、跨时区新闻与同业市场先行变化'],
            ['参与者状态', '地区重叠、客户到达、基金基准、做市库存、风险限额与隔夜持仓意愿'],
            ['订单与报价', '主动单、限价供给、撤改、母单排程、指数/收盘执行与跨市场对冲'],
            ['市场统计量', 'volume、trade count、duration、spread、depth、OFI、returns 与 realized volatility'],
            ['反馈与次日状态', '价格发现降低不确定性，或波动与库存压力反过来触发撤单、对冲和风险压缩'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链同时包含稳定重复与每日创新。稳定部分来自交易所每天按相似规则开闭市、机构按相似基准执行；创新部分来自今天的消息、订单、流动性和风险状态。若只按分钟画平均曲线，二者会被叠在一起；若直接减去一条全样本平均线，又可能把未来制度和危机信息泄漏回过去。日内研究的核心不是“画一条漂亮 U 型”，而是给每个观测标注它属于哪个制度、哪个 phase、哪个信息集和哪个估计对象。
        </p>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 本节范围契约</p>
        <h2>1.16 独占的是重复时钟怎样形成条件基准、怎样与事件和制度断点分离；集合竞价的撮合规则与福利比较留给 1.17。</h2>
        <div className="boundary-box">
          <b>输入、输出与章节边界</b>
          <p>从 1.04 输入订单簿、spread 与 depth，从 T08 输入 calendar、event 与 transaction time，从 1.15 输入成交活动和 volatility 的口径。本节解释开盘、午间、收盘、跨时区与公告怎样共同塑造日内曲线，并输出可复现的 phase-aware 基准。1.17 将展开 opening/closing auction 的订单提交、价格最大化撮合、imbalance 信息、连续交易接口与制度权衡；本节只把 auction 作为必须单独标记的离散阶段，绝不把其成交点质量平滑进连续五分钟。</p>
        </div>
        <p>
          除非另有说明，“时间格”指同一市场本地时区内固定的 calendar interval，例如 09:35–09:40；“季节性”指条件于制度版本和日期类型后，在相同日内位置重复出现的分布特征，不表示每一天都遵循同一条确定曲线。“波动”优先指以 midquote 高频收益构造的路径变化强度，完整噪声稳健 RV 留给 7.24。
        </p>
      </section>

      <section className="lesson-section" id="definition">
        <p className="section-kicker">03 · 什么才叫日内季节性</p>
        <h2>季节性是一组按交易日位置重复的条件分布，不只是均值曲线；同一时点的中位数、尾部、零值概率与变量间关系都可能具有周期。</h2>
        <div className="equation-card">
          <span>条件季节曲线</span>
          <div>F<sup>x</sup><sub>i,r,c,φ,j</sub>(z) = Pr(x<sub>i,d,j</sub> ≤ z | r(d)=r, c(d)=c, phase<sub>d,j</sub>=φ)</div>
          <p>先固定证券 i：x 是待研究变量，d 是交易日，j 是日内时间格，r 是当天适用的交易制度/DST 版本，c 是预先定义的日期类型，c(d)=c 表示只同普通工作日、星期几、半日市、假日前后或公告日等同类日期比较；φ 是 opening call、连续交易、午休重开或 closing call 等阶段。日期分类必须服从研究问题且只用当时可得标签，不能看到结果后再造类别。z 是与 x 同单位的阈值；Pr 表示概率；竖线“|”读作“在右侧条件已经固定的情况下”。因此，若某股票普通周二连续交易 09:35 格的 F(50 万股)=0.80，直白含义是：在同制度、同日期类型和同 phase 的可比历史日里，80% 的该格成交量不超过 50 万股。F 描述整条条件分布，而不只是一条均值线。</p>
        </div>
        <p>
          “09:35 成交量通常高”是条件命题，不是因果解释。它可能由开盘价格发现、隔夜客户指令或供应商对 opening print 的归档方式生成。“09:35 高于 12:30”也不表示今天 09:35 更异常：若历史基准分别为 900 与 200 笔，今天两格均为 1,000 笔，则开盘只高约 11%，午间却高 400%。季节性标准化改变的是比较基准，不会自动识别异常来自信息、流动性还是执行排程。
        </p>
      </section>

      <section className="lesson-section" id="separate-variables">
        <p className="section-kicker">04 · 不存在一条万能 U 型</p>
        <h2>成交、spread、depth、duration 与 volatility 是不同状态变量；它们可以在同一时点反向变化，也可能在不同市场呈现不同形状。</h2>
        <div className="table-scroll" role="region" aria-label="日内变量与可能形状比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先冻结变量，再描述曲线</caption>
            <thead><tr><th scope="col">变量</th><th scope="col">最小口径</th><th scope="col">常见条件模式</th><th scope="col">主要混淆</th></tr></thead>
            <tbody>
              <tr><th scope="row">Volume / trade count</th><td>执行股数或笔数/时间格</td><td>开收盘高、中段低；午休市场可双 U</td><td>auction print、母单拆分、venue 覆盖</td></tr>
              <tr><th scope="row">Volatility</th><td>midquote return 的绝对值、平方或局部 RV</td><td>开盘高、午间低、公告时点尖峰</td><td>bid–ask bounce、闭市跨段收益、jumps</td></tr>
              <tr><th scope="row">Quoted / effective spread</th><td>(ask−bid)/mid；成交相对 mid 的成本</td><td>开盘较宽后收窄；收盘未必同向</td><td>tick binding、stale quote、auction 无连续 BBO</td></tr>
              <tr><th scope="row">Displayed depth</th><td>best level 或固定价格带内数量</td><td>有时开盘薄、中段厚，与 spread 反向</td><td>隐藏量、多档迁移、撤单和价格尺度</td></tr>
              <tr><th scope="row">Duration</th><td>相邻交易或报价事件的 calendar waiting time</td><td>活跃时更短；午间和闭市出现长间隔</td><td>零截断、批量时间戳、event clock 机械压平</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Ahn–Cheung 在没有指定做市商的香港订单驱动市场中记录 quoted/effective spread 的 U 型与 best depth 的倒 U 型，说明日内流动性形状不需要依赖单一 dealer 制度；但这也意味着不能把“做市商午间更愿意报价”当作所有市场的唯一解释。Lee–Mucklow–Ready 在公告时点发现成交与 effective spread 可以同时上升而 depth 只小幅下降：高活动既可能吸引供给，也可能提高逆向选择，净形状由两股力量共同决定。<Cite n={8} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="clock-ledger">
        <p className="section-kicker">05 · 三种时钟与一个制度版本</p>
        <h2>Calendar time 保留等待和闭市，event time 保留事件顺序，business time 描述潜在活动速度；制度版本决定“同一个 14:55”是否仍是相同经济位置。</h2>
        <div className="table-scroll" role="region" aria-label="三种市场时钟比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>时钟不是格式选择，而是估计对象的一部分</caption>
            <thead><tr><th scope="col">时钟</th><th scope="col">固定什么</th><th scope="col">保留什么</th><th scope="col">机械改变什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Calendar clock</th><td>每 1/5/30 分钟</td><td>等待时间、开闭市、公告与重叠</td><td>活跃格有更多事件</td></tr>
              <tr><th scope="row">Trade / event clock</th><td>每 N 笔成交或消息</td><td>事件序列与每事件反应</td><td>成交量季节性被设计上压平</td></tr>
              <tr><th scope="row">Business clock</th><td>潜在信息或风险调整进度</td><td>经济活动快慢的模型表示</td><td>通常不可直接观察，只能由代理推断</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          若开盘一分钟和午间二十分钟都恰有 100 笔成交，在 100-trade event clock 上它们长度相同，在 calendar clock 上却包含完全不同的等待与流动性供给环境。Engle–Russell 的 ACD（Autoregressive Conditional Duration，自回归条件持续时间）模型把“下一次事件还要等多久”写成过去等待时间和状态的函数，因此 duration 本身会聚集；Dufour–Engle 又显示短 duration 状态下价格冲击和调整速度可能更强。反过来，用交易时钟研究“每笔信息含量”是合法的，但不能再据此宣称全天成交到达率没有季节性。<Cite n={24} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="opening-chain">
        <p className="section-kicker">06 · 开盘机制链</p>
        <h2>闭市把新的可交易价格暂时冻结，却没有冻结信息、客户需求和替代市场；开盘因此要同时消化积累的价值不确定性与未执行头寸。</h2>
        <div className="mechanism-chain" aria-label="开盘日内季节性机制链">
          {[
            ['闭市期间', '新闻、海外价格、客户申赎与风险限额继续变化，本市场连续 BBO 却无法更新'],
            ['开盘前', '交易者对价值和订单不平衡的估计分散，愿意供给的限价量取决于逆向选择与库存风险'],
            ['首轮撮合', '积累订单在 auction 或连续簿相遇，交易和报价共同揭示新的可执行价格'],
            ['学习与吸收', '公共成交、报价和 imbalance 降低部分不确定性，更多流动性在价格附近重新出现'],
            ['条件回落', '若没有新公告或持续单边需求，spread、volatility 与到达强度逐步回到日内基准'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链同时解释“高成交、高波动、宽 spread、薄 depth”为何可能在开盘共存，却不要求四者每天同向。若一夜几乎没有信息但有大量被动申赎，开盘可以高量而永久价格变化不大；若公共新闻使所有报价在第一笔成交前整体跳变，则信息进入价格不以 executed volume 为前提。Madhavan–Panchapagesan 的 NYSE TORQ 样本显示 specialist 在开盘机制中频繁参与并处理 imbalance，但该历史制度事实不能外推为现代所有市场的必要条件。<Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="overnight-closure">
        <p className="section-kicker">07 · 隔夜信息与周期性闭市</p>
        <h2>开盘效应至少包含“间隔更长”和“市场不能连续更新”两部分；周末、午休重开与全天候替代市场可以帮助区分它们。</h2>
        <p>
          Brock–Kleidon 从周期性闭市出发：交易者在开盘和收盘附近对组合的需求弹性与中段不同，市场关闭本身会改变订单需求和流动性供给。Amihud–Mendelson 比较东京证券交易所早盘开盘与午休后的重开，发现早盘开盘价格更“noisy”，而午后重开并不更差；这与“只要有交易中断，重开就必然同样不确定”的简单说法不符。隔夜包含更长的信息累积、其他市场交易和组合约束变化，午休则主要是更短的制度性中断。<Cite n={2} /><Cite n={21} />
        </p>
        <div className="boundary-box">
          <b>可以支持的最弱结论</b>
          <p>早盘比午后重开更波动，与隔夜信息和非交易时长的重要性相容；它既不证明所有开盘噪声都来自私人信息，也不证明午休没有价格发现。要区分 calendar gap、闭市约束与外部市场先行，还需利用周末长度、节假日、夜盘、跨市场开放状态和制度改革分别改变这些条件。</p>
        </div>
      </section>

      <section className="lesson-section" id="opening-spread">
        <p className="section-kicker">08 · 开盘 Spread 为什么容易宽</p>
        <h2>当价值不确定性、订单不平衡和自身库存风险都高时，立即执行权更昂贵；随着公共订单流揭示状态，报价者才可能收窄保护垫。</h2>
        <p>
          1.05 已把 spread 分成 order-processing、inventory 与 adverse-selection compensation。本节只说明这些成分为何具有时间结构：开盘前缺少本市场当日连续交易历史，报价者更难判断来单是隔夜信息、客户流还是流动性需求；同时积累订单可能迅速改变库存。McInish–Wood 使用 1989 年上半年 NYSE specialist quotes 构造分钟级 time-weighted percentage quoted spread，在控制价格、风险和交易活动后仍发现开盘和收盘附近较宽的时点效应。它支持条件日内模式，却不是现代电子簿的结构参数。<Cite n={7} />
        </p>
        <p>
          Spread 也不一定在所有“高信息”时段上升。若同一时点参与者重叠显著增加、竞争性限价供给涌入，流动性供给效应可能压过逆向选择。Ito–Hashimoto 在 EBS 外汇数据中记录伦敦和纽约开市时交易与价格变化明显上升，而 spread 点估计反而收窄，提醒我们要把需求强度和供给竞争同时写入机制。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="opening-depth">
        <p className="section-kicker">09 · Depth 与 Resiliency 的时间结构</p>
        <h2>开盘 depth 薄不等于当天流动性一定差；关键是冲击前可见容量、成交后补单速度和价格发现完成后供给是否回归。</h2>
        <p>
          Depth 是某个价格范围内可立即成交的数量，resiliency 是冲击后恢复的速度。报价者可以在价值不确定时减少显示量，却在首轮价格形成后快速补单；也可能展示充足 best depth，但大订单一到就撤单。Lee–Mucklow–Ready 的年度 NYSE 初始样本含 230 家公司；过滤盘外公告及股利变动附近的混淆事件后，事件样本由 209 家公司、606 次日内盈利公告构成。他们把公告对齐到半小时格：公告格成交近乎翻倍、effective spread 上升，而 best depth 的平均下降较小。这说明单层 depth、成本和活动可以给出不同信号，不能用一个流动性指标替代整个供给曲线。<Cite n={8} />
        </p>
        <p>
          对开盘研究至少要同时报告 percentage spread、固定价格带内多档 depth、撤单率、冲击后的恢复半衰期，以及 auction 与连续簿之间的首个可比时点。把 auction clearing price 与开盘后第一条 BBO 混在同一序列，会制造不存在的“spread”和深度跳变。
        </p>
      </section>

      <section className="lesson-section" id="strategic-concentration">
        <p className="section-kicker">10 · 为什么交易者会主动聚集</p>
        <h2>高活动时段不只是外生客户到达的结果：当噪声或流动性交易者愿意在某些时点集中，知情者也更容易隐藏，二者可以形成自我强化的交易簇。</h2>
        <p>
          Admati–Pfleiderer 的理论关键不是预测一条固定 U 型，而是说明 discretionary liquidity traders 可以选择何时执行，informed traders 又偏好在噪声更厚、价格冲击较低的时段交易；这种策略互补使 volume 与 price variability 内生聚集。因果链是：更多流动性需求进入某格 → 知情交易更容易被聚合流掩护 → 市场深度和信息交易共同变化 → 该格进一步变得有吸引力。<Cite n={1} />
        </p>
        <div className="boundary-box">
          <b>理论边界</b>
          <p>这个机制需要一部分订单可以择时，且不同主体对活动密度作出策略反应。被强制在公告后立即对冲、必须按收盘基准成交或受客户截止时间约束的订单，并没有同等择时自由。观测到聚集与理论相容，不等于已经识别聚集中的 informed share。</p>
        </div>
      </section>

      <section className="lesson-section" id="persistent-information">
        <p className="section-kicker">11 · 聚集也可能来自持续私人信息</p>
        <h2>若私人信息跨日持续且逐步进入价格，低活动时段未必只是“没人有事做”；它可能伴随更高的每笔逆向选择和更谨慎的流动性供给。</h2>
        <p>
          Foster–Viswanathan 把 1988 年 NYSE 60 只股票按 45 个完整交易周组织，记录首半小时 volume、volatility 与 adverse-selection component 较高，并发现星期一的成交较低而逆向选择较高。他们的框架允许 informed trader 的信息跨日持续，liquidity demand 与信息优势在一周内以不同速度演化。经验含义不是“星期一必然危险”，而是活动密度与每笔信息含量可以反向变化：低量不能自动解释成低信息。<Cite n={3} />
        </p>
        <p>
          因而，Admati–Pfleiderer 与 Foster–Viswanathan 不是互相排斥的口号。前者强调可择时订单的策略性同刻聚集，后者强调持久私人信息、交易成本和星期结构的共同演化。研究需要用公告可预见性、订单可择时程度、价差成分、永久价格变化和星期/事件交互区分两类机制，而不是只用 U 型图形选择理论。
        </p>
      </section>

      <section className="lesson-section" id="midday-trough">
        <p className="section-kicker">12 · 午间低谷从何而来</p>
        <h2>午间活动低可以来自信息到达、客户到达与跨地区重叠同时下降，也可以是订单等待更厚市场的策略选择；低谷是均衡结果，不是“午饭时间”这一标签本身。</h2>
        <p>
          当开盘积累订单已被吸收、收盘基准需求尚未到来、预定公告较少、欧美或亚洲参与者重叠有限时，主动订单和价格创新都可能下降。可择时母单又会避开薄弱时点，进一步降低 activity。Jain–Joh 在 1979–1983 年 NYSE 六个小时的聚合数据中记录首小时 volume 最高、到第四小时下降后再回升；Wood–McInish–Ord 的历史交易数据也显示收益波动在端点较高。它们是描述性基准，不告诉我们每个午间低谷由哪类主体造成。<Cite n={4} /><Cite n={5} />
        </p>
        <p>
          反例同样重要：预定宏观公告、指数调仓或单只股票消息可以在午间制造尖峰；全天候外汇的“午间”取决于哪个本地时区；午休市场则在下午重开形成第二个局部开盘。因此实证模型应允许 smooth clock component 之外存在事件点质量、phase break 与制度交互。
        </p>
      </section>

      <section className="lesson-section" id="lunch-reopen">
        <p className="section-kicker">13 · 午休市场为什么常有第二个开盘</p>
        <h2>交易中断让订单和信息再次积累，下午重开把连续的一天切成两个 session；用欧美单一 U 型模板会把第二次边界误判成异常冲击。</h2>
        <p>
          Andersen–Bollerslev–Cai 使用 1994–1997 年 Nikkei 225 五分钟收益，观察到上午和下午各自呈 U 型。东京证券交易所的官方历史时段又显示，早盘、午休和午后收盘时间曾多次改变：2011 年延长早盘，2024 年 11 月 5 日又把现金股票收盘从 15:00 延至 15:30。相同本地时间在不同制度版本中因此可能具有不同“离边界距离”。<Cite n={18} /><Cite n={19} />
        </p>
        <p>
          Ito–Lyons–Melvin 利用 1994 年 12 月东京银行间外汇午间交易限制取消，发现原午休时段的方差上升；Andersen–Bollerslev–Das 用更长窗口重估后确认午间波动增加较稳健，却指出“整条日内曲线被重新塑造”的结论对样本窗敏感。这里真正可防守的推断是：开放交易把部分价格调整移入原闭市时段；更强的全日因果叙事必须经长期 regime 和事件稳健性检验。<Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="closing-chain">
        <p className="section-kicker">14 · 收盘机制链</p>
        <h2>临近收盘，交易目标从“今天何时都可以完成”变成“必须在剩余窗口或收盘基准附近完成”；需求弹性下降，库存与隔夜风险也同时变得不可推迟。</h2>
        <div className="mechanism-chain" aria-label="收盘日内季节性机制链">
          {[
            ['期限逼近', '当日母单、指数调仓、基金申赎、保证金和客户截止时间进入最后执行窗口'],
            ['基准约束', '以 close、VWAP 或官方净值评价的主体更在乎相对基准误差，而非单笔绝对成本'],
            ['库存选择', '做市商和套利者决定平掉、对冲或携带隔夜库存，风险承载弹性发生变化'],
            ['订单集中', '主动流、竞价订单与撤改变密，volume 可上升，spread/depth 取决于供给是否同步增加'],
            ['收盘定价', '连续簿最后交易或 closing call 聚合订单形成官方参考价，随后该场所常规时段结束并可能转入盘后；其他场所或相关资产仍可能交易'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Brock–Kleidon 的周期闭市框架允许高需求与较宽 spread 同时出现：交易者更急于在市场关闭前达到目标，流动性供给者却要为库存和闭市风险定价。高 volume 因而不保证低成本，也不证明收盘信息更多。收盘段的核心变量是执行截止、基准敏感度、净 order imbalance 与风险承载，而不只是日内分钟编号。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-demand">
        <p className="section-kicker">15 · Benchmark 怎样制造低弹性需求</p>
        <h2>当绩效以收盘价或日内基准衡量时，交易者最小化的是跟踪误差和未完成风险；即使边际价格变差，剩余订单也未必能够离开收盘窗口。</h2>
        <p>
          假设基金必须让收盘后权重贴近指数。过早成交会承担价格随后相对 close 移动的 benchmark risk，过晚成交又有未完成风险；越接近截止时点，剩余数量越难择时，需求曲线越不弹性。指数再平衡、ETF 申赎、共同基金现金流和衍生品对冲都可能沿不同路径产生这种集中，但仅凭末段 volume 不能区分它们。
        </p>
        <div className="equation-card">
          <span>教学式：执行目标的权衡</span>
          <div>L = C<sub>exec</sub> + λ<sub>B</sub>(P<sub>exec</sub>−P<sub>bench</sub>)² + λ<sub>U</sub>U²</div>
          <p>L 与 C<sub>exec</sub> 都以货币损失计；P<sub>exec</sub> 是成交均价，P<sub>bench</sub> 是评估基准，二者单位相同；U 是截止时未完成股数。为让三项能够相加，λ<sub>B</sub> 的单位必须是货币/价格²，λ<sub>U</sub> 的单位是货币/股数²；若先把各项标准化为“损失点数”，也必须冻结各自换算尺度。权重越大，订单越可能集中在基准附近；这只是机制表示，不是经验校准。</p>
        </div>
        <p>
          Heston–Korajczyk–Sadka 记录个股收益在相同日内时点存在跨日重复的横截面模式，提示机构执行与流动性需求可能留下可预测的时间指纹；但可预测收益也可能补偿提供流动性的风险，不能直接称为机械套利。<Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-overnight">
        <p className="section-kicker">16 · 库存与隔夜风险</p>
        <h2>同一库存临近收盘会改变经济含义：盘中仍可继续分散和对冲，闭市后却要承担跳空、融资与不可交易风险。</h2>
        <p>
          做市商、统计套利者和经纪商不会只看当前持仓 q，还看剩余可交易时间、夜间 hedge 可用性、资本限额与消息风险。若隔夜风险厌恶上升，流动性提供者可能在收盘前用更具侵略性的订单平仓，或减少会让库存继续偏离的报价；若跨市场期货仍开放，也可能把风险转移到另一场所。于是收盘的 volume、OFI、spread 与 depth 形状取决于净库存分布，而不是单一“大家都交易”的活动指标。
        </p>
        <div className="equation-card">
          <span>状态依赖的库存惩罚</span>
          <div>Penalty<sub>t</sub> = ½ γ<sub>t</sub> q<sub>t</sub>²　，　γ<sub>t</sub> = γ(horizon<sub>t</sub>, hedge<sub>t</sub>, capital<sub>t</sub>)</div>
          <p>q<sub>t</sub> 是当前净库存，单位为股或合约；Penalty 是选定的货币或标准化损失单位，因此 γ<sub>t</sub> 的单位必须是损失/库存²。γ 可能在离闭市更近、夜间对冲更弱或资本更紧时上升。公式只说明相同 q 的影子成本随状态变化；真实报价还受竞争、信息与客户流影响。</p>
        </div>
      </section>

      <section className="lesson-section" id="auction-boundary">
        <p className="section-kicker">17 · Auction 是离散 Phase，不是一根特别大的连续 K 线</p>
        <h2>集合竞价把一批订单在单一 clearing price 上撮合，成交量是时间点质量；连续交易则沿价格—时间路径逐笔成交，二者不能用同一 spread、duration 和 impact 公式直接比较。</h2>
        <p>
          Opening/closing call 的订单可能在竞价窗口内新增、修改或撤销，最终在某一撮合时点形成官方价格与成交通量。若把一千万股 closing call 塞入 15:55–16:00 的连续五分钟格，曲线会机械出现巨大 volume，且该格的“平均成交价差”混合了两套规则。更稳健的数据结构为每条记录附加 phase∈{'{'}pre-open, opening-call, continuous-AM, lunch-closure, continuous-PM, closing-call, post-close{'}'}，并分别构造统计量。
        </p>
        <p>
          Madhavan–Panchapagesan 的历史 NYSE 数据显示开盘 call、specialist participation 与 imbalance 具有独立信息；Pagano–Schwartz 利用巴黎市场分阶段引入 closing call，报告收盘价格同步性和执行成本改善，同时末段连续成交的一部分转移进 call。它们说明 auction 可以改变价格形成，而不是只把同样交易挪到某分钟；具体撮合算法、indicative price、订单优先与效率权衡留给 1.17。<Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="non-universal">
        <p className="section-kicker">18 · U 型不是普适定律</p>
        <h2>曲线形状是市场制度、参与者和变量口径的联合结果；“通常”必须附带资产、场所、时期、phase 与统计量。</h2>
        <div className="myth-grid">
          <article><span>边界 01</span><h3>订单驱动市场</h3><p>没有指定 dealer 仍可出现 spread U 型与 depth 倒 U 型；竞争性限价供给本身足以产生时间结构。<Cite n={9} /></p></article>
          <article><span>边界 02</span><h3>午休双 Session</h3><p>上午和下午各有局部开盘/收盘，单一全天 U 会平滑掉重开断点。<Cite n={18} /></p></article>
          <article><span>边界 03</span><h3>全天候 FX</h3><p>没有统一全球 close；东京、伦敦和纽约参与者交接与重叠构成多峰活动曲线。<Cite n={15} /></p></article>
          <article><span>边界 04</span><h3>公告日</h3><p>08:30、10:00 或其他预定发布时点可覆盖平滑本地时钟，形成狭窄事件尖峰。<Cite n={12} /><Cite n={13} /></p></article>
          <article><span>边界 05</span><h3>价格限制与停牌</h3><p>零成交可能代表不能交易，不是平静；重开格又包含积累订单和离散规则。</p></article>
          <article><span>边界 06</span><h3>市场技术变化</h3><p>tick、撮合、交易时长和 closing call 改革会改变旧曲线，历史平均不再是今天的基准。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="order-driven-evidence">
        <p className="section-kicker">19 · 没有指定做市商也会有季节性</p>
        <h2>逆向选择、库存与竞争不是某一职业标签的专属属性；任何提交限价单并等待成交的主体都在供给即时执行权。</h2>
        <p>
          Ahn–Cheung 研究 1996 年 10 月至 1997 年 3 月香港交易所全部 471 只股票，当时市场是没有 designated market maker 的订单驱动结构。他们记录 quoted/effective spread 的 U 型和 best depth 的倒 U 型。这个结果反驳“只有 specialist 午间调整报价才会产生日内流动性周期”的狭窄机制，却没有证明库存风险不重要：限价交易者同样承担被知情者挑选、价格移动和头寸偏离风险。<Cite n={9} />
        </p>
        <p>
          研究语言因此应从“做市商怎样做”提升为“流动性供给侧怎样在这一时点定价执行权”。指定做市、匿名限价交易者、HFT、经纪商 internalizer 与 auction participant 可能以不同身份承担同类经济功能；制度差异决定谁可观察 imbalance、谁有义务报价、谁能撤单以及风险如何分配。
        </p>
      </section>

      <section className="lesson-section" id="announcement-clock">
        <p className="section-kicker">20 · 公告构成第二只钟</p>
        <h2>本地交易时钟回答“现在离开闭市多远”，公告时钟回答“现在离新信息到达多远”；二者相遇时，平滑季节曲线会被离散尖峰覆盖。</h2>
        <p>
          Ederington–Lee 使用 1988–1991 年美国国债、德国马克与 Eurodollar 期货，将 19 类预定美国宏观公告对齐到发布时点；大量价格反应集中在第一分钟，波动在约十五分钟内仍明显较高，部分影响持续更久。Andersen–Bollerslev–Diebold–Vega 又在 1992–1998 年五种美元汇率五分钟数据中，把公告 surprise 而非简单新闻 dummy 纳入条件模型。核心含义是：同样的 08:30，announcement day 与 non-announcement day 不属于同一分布。<Cite n={12} /><Cite n={13} />
        </p>
        <div className="equation-card">
          <span>双时钟的条件表示</span>
          <div>g(x<sub>d,j</sub>) = α + f<sub>clock</sub>(j) + Σ<sub>k∈𝒦</sub>Σ<sub>ℓ∈𝓛ₖ</sub> β<sub>k,ℓ</sub>S<sub>d,k</sub>𝟙[t<sub>d,j</sub>−T<sub>d,k</sub>∈B<sub>ℓ</sub>] + η<sub>d,j</sub></div>
          <p>x<sub>d,j</sub> 是交易日 d、时间格 j 的目标变量；g 把原值映射到更适合比较和建模的尺度，并在训练期冻结，例如对非负量用 log1p(x/c)=log(1+x/c)，对可正可负量用 asinh(x/c)，其中 c&gt;0、与 x 同单位且只能由训练期确定。α 是共同截距；f<sub>clock</sub>(j) 是常规日内曲线。𝒦 是研究开始前登记的公告类型集合，k 是其中一种；𝓛<sub>k</sub> 是该类公告预先冻结的相对时点集合，ℓ 是其中一个 lag 标签，B<sub>ℓ</sub> 是以分钟或其他已声明单位表示的 lag 区间。先把当前格时点 t<sub>d,j</sub> 与公告发布时间 T<sub>d,k</sub> 映射到同一时间轴，再由 t−T 落入哪个 B<sub>ℓ</sub> 分箱；这比要求非整数发布时间与时间格精确相等更可复现。𝟙[·] 在括号条件成立时取 1，否则取 0。事件窗可如发布前 30 分钟至发布后 120 分钟，但边界必须在看结果前固定。</p>
          <p>S<sub>d,k</sub> 是 actual−consensus 等事前预期冻结后的 surprise。若保留原始 surprise 单位，β 的单位就是“g(x) 的单位/一单位 surprise”；若用训练期 forecast-error 尺度将 S 标准化为无量纲，β 就与 g(x) 同单位。β<sub>k,ℓ</sub> 是类型 k 在 lag 区间 B<sub>ℓ</sub> 的载荷，η 是未解释残差。无该类公告的日期令相应项为 0。实际 surprise 只有从发布时间起才可进入实时特征；发布前区间的系数只能用于事后事件研究和泄漏安慰剂，不能让未来公告值进入发布前预测。</p>
        </div>
      </section>

      <section className="lesson-section" id="announcement-liquidity">
        <p className="section-kicker">21 · 公告如何同时改变需求与供给</p>
        <h2>新闻到来后，重新配置头寸的需求上升；流动性提供者一面看到更多交易机会，一面担心来单更有信息，最终 spread 和 depth 的净反应并不由 volume 决定。</h2>
        <p>
          Lee–Mucklow–Ready 的 606 次日内盈利公告样本中，公告半小时 quoted spread 平均上升约 8.18%，effective spread 上升约 18.62%，volume 上升约 93.14%，best depth 平均下降约 4.37% 且显著性较弱；在伴随大价格变化的子样本中，volume 增幅更大。数字是历史 NYSE 样本的条件均值，不是今天任意市场的校准，但它清楚展示：高量、成本上升与可见深度小变可以同时发生。<Cite n={8} />
        </p>
        <p>
          识别时必须把“公告效应”和“公告通常安排在某个时点”分开。time-of-day fixed effect 是为每个日内时间格设置一个独立基准项，用来吸收该格在普通日稳定重复的平均差异；若所有公司公告都集中在午后，这个基准项也可能吸收一部分真实公告反应。若用全样本平均季节性去处理，又会让频繁公告把该格基准抬高。应先定义 non-event baseline，再以事件类型、surprise、预期不确定性和 phase 建立交互，并报告事件前负时点以检查信息泄漏。
        </p>
      </section>

      <section className="lesson-section" id="global-overlap">
        <p className="section-kicker">22 · 跨时区重叠是第三类状态</p>
        <h2>全球市场的活动不围绕一个统一午间变化，而围绕地区开闭市、参与者同时在线和相关资产可交易性变化；当地时间与 UTC 时间因此各回答不同问题。</h2>
        <p>
          Engle–Ito–Lin 在日元/美元数据中提出 meteor shower：波动可以从一个地理市场传到下一个，而非只在当地自我持续。Ito–Hashimoto 使用 1999–2001 年 EBS 一秒级 firm quotes 与 deals，分别处理夏令/冬令时间和不匹配周，记录伦敦与纽约开市附近价格变化和成交数跳升。机制链是：新地区参与者上线 → 客户与银行订单池扩张 → 跨资产/跨场所套利恢复 → 价格和流动性供给同时更新。<Cite n={14} /><Cite n={15} />
        </p>
        <div className="boundary-box">
          <b>两个合法但不同的 estimand</b>
          <p>以纽约本地 09:30 对齐，研究的是当地制度开盘效应；以固定 UTC 对齐，研究的是全球同一绝对时刻；以“伦敦—纽约重叠开始”对齐，研究的是参与者集合变化。三个图可以不同，并不互相矛盾。必须先声明希望固定的是本地制度还是全球重叠。</p>
        </div>
      </section>

      <section className="lesson-section" id="dst-identification">
        <p className="section-kicker">23 · DST 既是数据陷阱，也是识别机会</p>
        <h2>夏令时切换会让本地开盘相对 UTC 移动一小时；不同地区不同周切换，则暂时改变市场重叠而不改变各自墙上时钟。</h2>
        <p>
          若研究者把纽约 09:30 永久编码为固定 UTC 时点，夏冬样本会被错位；若只用纽约本地时间，又看不到伦敦—纽约重叠长度在 DST 不同步周的变化。Andersen–Bollerslev–Diebold–Vega 在清理汇率公告样本时明确处理美国 DST；Ito–Hashimoto 将夏冬分开并排除欧洲与美国 DST 错配周，说明时区不是数据展示细节。<Cite n={13} /><Cite n={15} />
        </p>
        <p>
          更进一步，DST mismatch 可作为机制诊断：若活动峰随纽约本地开盘移动而不随伦敦重叠移动，local institutional clock 更可信；若峰值在重叠开始改变时同步移动，participant overlap 更可信。它仍不是自动自然实验，因为季节、月底、假日和公告日也可能随日期变化；需要窄窗、多个年份、安慰剂时点与其他地区对照。
        </p>
      </section>

      <section className="lesson-section" id="calendar-event-clock">
        <p className="section-kicker">24 · Calendar 与 Event Clock 必须并报</p>
        <h2>Calendar clock 测“每分钟发生多少”，event clock 测“每个事件带来多少”；只看其中一个会把强度和每事件信息混在一起。</h2>
        <div className="equation-card">
          <span>事件强度与路径波动的精确起点</span>
          <div>RV<sub>j</sub> = Σ<sub>n=1</sub><sup>Nⱼ</sup>(δr<sub>j,n</sub>)²　；　R<sub>j</sub>² = RV<sub>j</sub> + 2Σ<sub>m&lt;n</sub>δr<sub>j,m</sub>δr<sub>j,n</sub></div>
          <p>N<sub>j</sub> 是时间格 j 的 midquote 更新事件数；n 是某个事件序号，m 是同一格内另一个事件序号。若 M<sub>j,n</sub> 是第 n 次更新后的 midquote，则 δr<sub>j,n</sub>=10⁴[log M<sub>j,n</sub>−log M<sub>j,n−1</sub>] 是单事件对数收益，单位为 bp；R<sub>j</sub>=Σδr 是整格净对数收益，单位同为 bp；RV<sub>j</sub> 是事件路径平方和，单位为 bp²。第二式说明净收益平方还包含不同事件收益之间的交叉项。只有在给定 j 后，事件平方收益可视为同分布、与 N 的停止规则独立且相互依赖足够弱时，期望才近似分成 E(RV<sub>j</sub>|j)≈E(N<sub>j</sub>|j)·E[(δr)²|event,j]；E 表示条件平均，右侧“事件数×每事件 bp²”与左侧同为 bp²。若活跃时每事件也更有信息，这个独立近似失效，应直接估计联合分布。开盘 calendar RV 高，因此可能来自事件更多、每事件更大，或两者兼有。</p>
        </div>
        <p>
          Dufour–Engle 的证据提示短 duration 状态下价格影响、调整速度与交易方向自相关都可能更强，所以不能假设“事件更多但每笔完全相同”。最低报告应包含每固定分钟的 volume/RV、每固定 N 笔的 price variation、duration 分布，以及从 event time 重新映射回 calendar time 的等待信息。<Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="multiplicative-decomposition">
        <p className="section-kicker">25 · 日尺度、时点尺度与异常项</p>
        <h2>一天整体活跃、某个时点通常活跃、今天此刻异常活跃是三个层次；乘法分解能保持非负量的比例含义，却必须处理零值和跳跃。</h2>
        <div className="equation-card">
          <span>按约定可复现的描述性分解</span>
          <div>x<sub>i,d,j</sub> = a<sup>x</sup><sub>i</sub> · s<sup>x</sup><sub>i,d</sub> · h<sup>x</sup><sub>i,r(d),j</sub> · u<sup>x</sup><sub>i,d,j</sub></div>
          <p>这不是脱离估计规则便自动唯一的结构分解。一个透明的历史描述约定是按 a→s→h→u 顺序定义：先令 𝒥<sub>r</sub> 为制度 r 下纳入比较的连续交易时间格集合，J<sub>r</sub>=|𝒥<sub>r</sub>| 是其格数，auction、午休和缺失格另行处理；再算每天的平均水平 A<sup>x</sup><sub>i,d</sub>=J<sub>r(d)</sub><sup>−1</sup>Σ<sub>j∈𝒥ᵣ</sub>x<sub>i,d,j</sub>。在训练日集合 𝒯 上，以算术平均 a<sup>x</sup><sub>i</sub>=mean<sub>d∈𝒯</sub>A<sup>x</sup><sub>i,d</sub> 定义证券长期尺度，并令 s<sup>x</sup><sub>i,d</sub>=A<sup>x</sup><sub>i,d</sub>/a<sup>x</sup><sub>i</sub>。因此 a 带有 x 的单位，而 s 无量纲；在等权且样本完整时，训练日的 s 平均恰为 1，直白说就是“平均训练日的一天整体倍率为 1”。</p>
          <p>接着固定证券 i：对每个 r 和 j，在其训练日集合 𝒯<sub>i,r,j</sub>={'{'}d∈𝒯:r(d)=r，且该格真实可观测{'}'} 上等权平均 x<sub>i,d,j</sub>/(a<sub>i</sub>s<sub>i,d</sub>)，得到原始季节因子 h̃<sub>i,r,j</sub>；停牌或数据缺失不作为 0 加入平均。再把 h̃<sub>i,r,j</sub> 除以 J<sub>r</sub><sup>−1</sup>Σ<sub>q∈𝒥ᵣ</sub>h̃<sub>i,r,q</sub>，得到 h<sub>i,r,j</sub>；q 只是遍历制度 r 有效时间格的索引。这个归一化表示“证券 i 在一个制度内所有有效连续交易格的季节因子平均为 1”。最后残差倍数按 u<sub>i,d,j</sub>=x<sub>i,d,j</sub>/(a<sub>i</sub>s<sub>i,d</sub>h<sub>i,r(d),j</sub>) 定义。只要样本纳入、日期权重、平均方法与顺序预先固定，四项就可复现；换用中位数、不同日期权重或跨证券池化 h 会得到另一套合法分解，不能把其中任何一项直接解释成结构因果。上述约定要求 a&gt;0 且 A<sub>i,d</sub>&gt;0；整日为零或高度零膨胀变量应采用后文 two-part model。volume 的 h 也不能用于 spread 或 RV。</p>
        </div>
        <p>
          对数必须作用于无量纲比率。先冻结一个与 x 同单位且为正的参考尺度 c<sub>x</sub>，仅当 x&gt;0 时才写 log(x<sub>i,d,j</sub>/c<sub>x</sub>)=α<sub>i</sub>+log s<sub>i,d</sub>+f<sub>i,r</sub>(j)+ξ<sub>i,d,j</sub>，其中 α<sub>i</sub>=log(a<sub>i</sub>/c<sub>x</sub>)、f<sub>i,r</sub>(j)=log h<sub>i,r,j</sub>、ξ=log u；改变 c<sub>x</sub> 只会平移 α，不改变 s、h 与 u。ξ 是对数异常，不与后文稳定常数共用符号。更重要的是，当天尺度 s 若用“当天最终平均水平”定义，那么 10:00 的异常值偷看了收盘后才知道的分母。研究历史描述可事后分解全日路径；实时检测和预测则必须以截至 d−1 的模型预测 s，或只用当时已经发生的累计信息更新对当日尺度的预测。
        </p>
      </section>

      <section className="lesson-section" id="estimating-curve">
        <p className="section-kicker">26 · 怎样估计一条可信基准曲线</p>
        <h2>均值适合稳定、近对称的数据；中位数、分位数、分段 spline、Fourier 与 functional curve 各解决不同问题，方法必须服从数据的零值、跳跃和 phase。</h2>
        <div className="table-scroll" role="region" aria-label="日内季节性估计方法比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>估计器选择取决于目标，不是复杂度竞赛</caption>
            <thead><tr><th scope="col">方法</th><th scope="col">优势</th><th scope="col">风险</th><th scope="col">适合</th></tr></thead>
            <tbody>
              <tr><th scope="row">Time-cell mean</th><td>透明、易复现</td><td>被 crisis/jump 拉高，格与格不平滑</td><td>厚样本的基准描述</td></tr>
              <tr><th scope="row">Median / quantile</th><td>对尾部稳健，可描述分布</td><td>稀疏格不稳定，均值守恒不自动成立</td><td>volume、spread 与 tail baseline</td></tr>
              <tr><th scope="row">Piecewise spline</th><td>允许开盘、午休、收盘分段平滑</td><td>结点和惩罚需训练期选择</td><td>有 phase discontinuity 的市场</td></tr>
              <tr><th scope="row">Flexible Fourier</th><td>紧凑表达平滑周期</td><td>会跨 auction/午休断点过度平滑</td><td>连续 FX 或平滑波动曲线</td></tr>
              <tr><th scope="row">Functional method</th><td>把每日整条曲线视为对象，可做曲线预测</td><td>解释与样本需求更高</td><td>重复路径与动态形状研究</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Andersen–Bollerslev 的 Flexible Fourier Form 把确定性周期与随机 volatility dynamics 分开；Müller–Sen–Stadtmüller 则把每日 volatility trajectory 当作函数对象；Cho–Daigler 进一步允许 seasonal variance 自身动态变化。Boudt–Croux–Laurent 显示 jumps 会严重偏置普通 periodicity estimator，因此用于 jump detection 的季节曲线本身应 jump-robust。方法的共同要求是：phase 分段、训练样本独立、超参数不看测试期。<Cite n={10} /><Cite n={27} /><Cite n={28} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="surprise-construction">
        <p className="section-kicker">27 · 从原始值到 Intraday Surprise</p>
        <h2>异常不是“比全日平均大”，而是相对同证券、同制度、同日期类型、同 phase、同时间格的可用历史分布偏离。</h2>
        <div className="equation-card">
          <span>只用历史的稳健标准化</span>
          <div>z<sup>x</sup><sub>i,d,j</sub> = [g(x<sub>i,d,j</sub>) − med<sub>𝒯(d)</sub>g(x<sub>i,·,j</sub>)] / [1.4826·MAD<sub>𝒯(d)</sub> + c₀]</div>
          <p>z 是无量纲的 intraday surprise；𝒯(d) 只包含 d 之前、与 i 的 regime、phase、日期类型和时间格 j 可比的训练日，点号“·”就是在这些历史日期上取值。med 是中位数；MAD=med|g(x)−med g(x)| 是绝对偏差中位数，乘 1.4826 后在正态基准下近似标准差；c₀&gt;0 与 g(x) 同单位，只为历史完全不变时避免除零，并须在训练期冻结。对非负 x，可取 log1p(x/c)=log(1+x/c)；对可正可负 x，可取 asinh(x/c)=log[x/c+√(1+(x/c)²)]。尺度 c&gt;0 与 x 同单位，使 x/c 无量纲，也只能由训练期决定。</p>
        </div>
        <p>
          这个 z 只表示“相对历史同格异常”，不自动表示 information surprise。对 announcement surprise，应另用 actual−consensus 并除以历史 forecast-error 尺度；对 volume surprise，应保留指数调仓、forced flow 与制度变化等竞争机制。若目标是实时预警，还应把当天截至 j 的 market-wide activity 作为可用状态输入，而不是用收盘后最终总量回填。
        </p>
      </section>

      <section className="lesson-section" id="zeros-missing">
        <p className="section-kicker">28 · 零值、陈旧报价与缺失不是一回事</p>
        <h2>“这一格没有价格变化”可能表示没有成交、成交但 midquote 不动、报价未刷新、停牌、闭市或数据丢失；把它们都写成 0 会改变季节曲线。</h2>
        <div className="table-scroll" role="region" aria-label="日内零值状态分类，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>零值必须带状态标签</caption>
            <thead><tr><th scope="col">观测状态</th><th scope="col">Volume</th><th scope="col">Return / quote</th><th scope="col">处理</th></tr></thead>
            <tbody>
              <tr><th scope="row">No trade, live quote</th><td>真实 0</td><td>midquote 可变或不变</td><td>保留零，并建模 no-trade 概率</td></tr>
              <tr><th scope="row">Trades, no mid change</th><td>&gt;0</td><td>真实 0</td><td>保留；说明活动未穿透价格</td></tr>
              <tr><th scope="row">Stale quote</th><td>可为 0 或 &gt;0</td><td>Carry-forward 不是新观测</td><td>记录 quote age，做 stale sensitivity</td></tr>
              <tr><th scope="row">Scheduled closure</th><td>不可交易</td><td>跨闭市收益属于单独 interval</td><td>标记 closure，不填普通 5 分钟 0</td></tr>
              <tr><th scope="row">Halt / data missing</th><td>不可观测或受约束</td><td>不可观测</td><td>分开 halt 与 feed failure，禁止静默删除</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          对稀疏成交量可用 two-part model：第一部分估计 Pr(x&gt;0)，第二部分在 x&gt;0 条件下估计规模；也可使用上一节已定义的 asinh(x/c) 或 log1p(x/c) 保留零值。午休收益从上午收盘到下午开盘包含整个闭市间隔，不能像普通五分钟收益那样“除以五分钟”后混入连续曲线。
        </p>
      </section>

      <section className="lesson-section" id="phase-breaks">
        <p className="section-kicker">29 · Phase Break 要显式建模</p>
        <h2>Opening call、连续交易、午休、下午重开与 closing call 之间存在规则和可交易集的不连续；平滑函数不能跨越制度断点假装经济过程连续。</h2>
        <p>
          一个最低数据表应为每条记录保存 local timestamp、UTC timestamp、IANA time zone、session_id、phase、lunch flag、half-day flag、holiday rule、DST state、announcement flag 与 regime_version。IANA zone 如 Asia/Shanghai 或 America/New_York 会保留历史时区规则，比固定 UTC offset 更安全。regime_version 需在交易时长、竞价窗口、tick、价格限制或 feed 定义改变时更新。
        </p>
        <p>
          东京交易时段与香港午休改革说明，版本控制不是附注。HKEX 在 2011 年 3 月把早盘改为 09:30–12:00、午后从 13:30 开始，2012 年 3 月再把午后提前至 13:00；把改革前后按同一格编号平均，会让“第 25 格”代表不同 wall-clock 和离边界距离。官方时段提供制度日期，但因果效应仍需对照、预趋势与其他同期变化；“预趋势”就是在改革真正发生前先比较处理组与对照组的路径是否已经朝不同方向移动，若已分化，改革后的差异就不能干净归因于改革。<Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="leakage">
        <p className="section-kicker">30 · 最常见的未来泄漏</p>
        <h2>全样本均值、当天最终总量、随机时间格切分和居中平滑都会把未来状态注入过去，使异常检测和预测看起来异常稳定。</h2>
        <div className="myth-grid">
          <article><span>泄漏 01</span><h3>全样本季节线</h3><p>用 2018–2026 全部日期估计 2020 年基准，把后续制度与危机分布送回训练期。</p></article>
          <article><span>泄漏 02</span><h3>Same-day final denominator</h3><p>10:00 的 volume share 除以当天收盘总量，实时当下并不知道分母。</p></article>
          <article><span>泄漏 03</span><h3>Centered smoother</h3><p>对时间序列用前后对称窗口平滑，当前值含未来分钟甚至未来日期。</p></article>
          <article><span>泄漏 04</span><h3>随机 cell split</h3><p>同一天相邻五分钟落入训练和测试，日尺度与共同冲击被模型间接识别。</p></article>
          <article><span>泄漏 05</span><h3>事后公告预期</h3><p>使用发布后修订的 consensus 或 final data，而非当时可得 vintage。</p></article>
          <article><span>泄漏 06</span><h3>Regime pooling</h3><p>用改革后交易时段替改革前缺失格填值，模型学到制度未来。</p></article>
        </div>
        <p>
          正确时间切分以完整日期为单位：对每个预测日 d，只用不晚于 d−1 的日期拟合季节曲线、变换和超参数；这里“变换”是把原始值映射到预先选择的建模尺度，“缩尾”是仅用训练期分位点把超过上下阈值的极端值截到边界，而不是删除这些观测。若参数选择需要验证集，应再在训练期内部做嵌套时间切分。跨证券面板也不能把同一天不同股票随机拆开，因为全市场日状态会跨标的泄漏。
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">31 · 证据地图</p>
        <h2>日内形状的“存在”、形成机制、制度因果与现代适用性来自不同证据；不能用一篇历史描述性研究完成全部推断。</h2>
        <div className="table-scroll" role="region" aria-label="日内季节性证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每种来源只承担它能承担的命题</caption>
            <thead><tr><th scope="col">证据层</th><th scope="col">代表来源</th><th scope="col">直接支持</th><th scope="col">仍未识别</th></tr></thead>
            <tbody>
              <tr><th scope="row">均衡理论</th><td>Admati–Pfleiderer；Brock–Kleidon</td><td>策略聚集与周期闭市可内生形成端点活动</td><td>现实中哪类主体和参数占主导</td></tr>
              <tr><th scope="row">历史交易描述</th><td>Jain–Joh；Wood et al.; Harris</td><td>特定 NYSE 时期的 volume、return 与时点模式</td><td>现代电子市场的无条件规律</td></tr>
              <tr><th scope="row">流动性分解</th><td>McInish–Wood；Lee et al.; Ahn–Cheung</td><td>spread、depth、activity 可有不同曲线与公告反应</td><td>单一流动性供给机制</td></tr>
              <tr><th scope="row">高频波动模型</th><td>Andersen–Bollerslev；Boudt et al.</td><td>周期未建模会扭曲持续性和 jump detection</td><td>季节曲线本身的结构因果</td></tr>
              <tr><th scope="row">制度变化</th><td>东京午间改革；巴黎 closing call；交易时长改革</td><td>规则改变后活动/定价怎样重新分配</td><td>若无对照和稳定趋势，改革的纯处理效应</td></tr>
              <tr><th scope="row">官方方法与规则</th><td>JPX、HKEX、SEC、FCA 委托报告</td><td>时段版本、过滤边界与现代市场制度事实</td><td>学术因果和跨市场福利结论</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          SEC 的 Market Activity Report 只纳入 09:35–16:00 的订单，以保守规避开盘相关的特异行为；方法还另行过滤标为 Special、盘中 cross 和 IPO halt 相关成交。这提醒研究者，官方统计为提高可比性也会主动放弃开盘五分钟这一估计对象。FCA 委托的 2024 年英国股票市场报告则把 closing call 与 periodic auction 分开，并记录 closing call 的重要性增长。两者是透明的方法与制度材料，不能替代成交级复现或自然实验。<Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="empirical-cases">
        <p className="section-kicker">32 · 六个经验切片</p>
        <h2>真正稳健的综合不是“所有市场都有 U 型”，而是不同数据在改变一个关键条件后，揭示哪条机制链仍然成立。</h2>
        <div className="case-study">
          <span>Case A · 经典 NYSE 端点</span>
          <h3>首半小时可以同时具有高 volume、高 volatility 与高 adverse selection；星期结构却能让低量与高逆向选择共存。</h3>
          <p>Foster–Viswanathan 从 1988 年 ISSM 中选取 60 只股票、45 个完整周共 225 日，将首半小时与后续小时格比较。开盘活动与成本较高，而星期一成交较低、adverse-selection component 较高。该设计支持“活动强度与每笔信息含量不是同一变量”，不提供现代全市场因果参数。<Cite n={3} /></p>
        </div>
        <div className="case-study">
          <span>Case B · 无指定做市商的香港</span>
          <h3>Spread U 型与 depth 倒 U 型在订单驱动市场同样出现，说明日内流动性周期位于供需功能层，而非特定职业标签。</h3>
          <p>Ahn–Cheung 使用 1996 年 10 月至 1997 年 3 月 SEHK 全部 471 只股票，比较 quoted/effective spread 与 best depth。结果把“指定 market maker 是季节性必要条件”排除，却不能区分匿名限价交易者的库存、逆向选择与竞争各贡献多少。<Cite n={9} /></p>
        </div>
        <div className="case-study">
          <span>Case C · 东京外汇午间开放</span>
          <h3>取消交易限制后，原午休时段的价格变化增加；较长样本确认局部效应，却削弱“全日形状永久重排”的强结论。</h3>
          <p>Ito–Lyons–Melvin 使用 1994 年改革前后 Reuters 一分钟数据，在 20/60 日窗中发现午间 variance 约翻倍；Andersen–Bollerslev–Das 重新检验 20 日、60 日与两年窗口，两年样本显示非午休时段的日内形状相当稳定，改革后的变化主要集中在原午休段。这是“更长复现收紧结论边界”的经典例子。<Cite n={16} /><Cite n={17} /></p>
        </div>
        <div className="case-study">
          <span>Case D · 预定宏观公告</span>
          <h3>平滑 U 型上叠着分钟级事件尖峰；若只做日内平均，公告时钟会被错误归给本地时钟。</h3>
          <p>Ederington–Lee 对 775 个交易日和 19 类美国公告进行事件对齐，发现很多价格调整发生在首分钟，volatility 随后仍短暂升高。Andersen–Bollerslev–Diebold–Vega 再用 actual−expectation 的 surprise 与五种汇率检验，说明“有公告”不如“公告意外多少”接近经济状态。<Cite n={12} /><Cite n={13} /></p>
        </div>
        <div className="case-study">
          <span>Case E · 巴黎 Closing Call</span>
          <h3>引入 closing call 后，末段交易并非简单消失，而是在连续簿和单价撮合之间重新分配；收盘价格质量也随机制改变。</h3>
          <p>Pagano–Schwartz 利用巴黎在 1996 与 1998 年分阶段引入 closing call，对两组各 50 只股票分别使用合计 500 个交易日的窗口（改革前后各 250 日），报告收盘同步性、beta/R² 与执行成本改善；call 吸收约 2%–3% 日成交，连续尾段份额下降。它支持制度改变价格形成，但仍可能受同期技术和市场变化影响。<Cite n={23} /></p>
        </div>
        <div className="case-study">
          <span>Case F · 交易时长版本</span>
          <h3>同一交易所的“下午末段”会随时长改革移动；按固定 clock time 或固定 close-distance 对齐，研究对象不同。</h3>
          <p>JPX 官方资料显示现金股票在 1991–2011 年为 09:00–11:00、12:30–15:00；2011–2024 年早盘延至 11:30；自 2024 年 11 月 5 日午后延至 15:30。若曲线峰随新 close 移动，deadline mechanism 更可信；若仍固定在旧 clock time，则需寻找公告、参与者或数据处理机制。官方日期只提供设计入口，不保证没有其他同期变化。<Cite n={19} /></p>
        </div>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先判断观测属于哪只钟、哪个 phase 与哪个信息集，再计算异常值；每道题都让一个常见错误推断显形。</h2>
        <p>
          Mode A 处理同格基准、共同季节性、auction 点质量和午休第二开盘；Mode B 处理公告第二时钟、DST/参与者重叠、same-day final denominator 泄漏与 calendar/event clock。八题全部以教学参数构造，不给交易建议；作答后才揭示计算和最弱可防守结论。
        </p>
        <IntradaySeasonalityLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 反例库</p>
        <h2>只要一句日内规律无法通过这些反例，它就还不是可迁移的机制知识。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>高开盘量、低永久变化</h3><p>隔夜申赎订单在深 auction 中交叉，成交巨大但共同信息中心几乎不动；高量不等于高信息。</p></article>
          <article><span>反例 02</span><h3>零成交、报价先跳</h3><p>公共消息让所有限价单撤改，BBO 在第一笔成交前更新；价格发现不以成交为必要条件。</p></article>
          <article><span>反例 03</span><h3>午间尖峰</h3><p>重要数据恰在 12:30 发布，事件时钟覆盖平滑低谷；去 U 型不能替代 announcement control。</p></article>
          <article><span>反例 04</span><h3>两次 U 型</h3><p>有午休的市场上午、下午各自开收盘；把全天拟合成一条 U 会抹去重开断点。</p></article>
          <article><span>反例 05</span><h3>Event clock 假平坦</h3><p>每 100 笔一个 bar 时，volume 被构造为恒定；这不证明 calendar arrival intensity 没有季节性。</p></article>
          <article><span>反例 06</span><h3>同量、不同异常</h3><p>两个时间格的原始活动相同；若一格本来就繁忙、另一格通常安静，它们相对条件分布的位置仍可完全不同。</p></article>
          <article><span>反例 07</span><h3>收盘高量、spread 也宽</h3><p>deadline 让需求更不弹性，库存承载却更昂贵；高活动不必带来低成本。</p></article>
          <article><span>反例 08</span><h3>DST 让峰值“漂移”</h3><p>固定 UTC 图上的纽约开盘每年移动一小时；若未保存 IANA zone，数据错误会伪装成结构变化。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 把世界观压成可证伪研究</p>
        <h2>好的日内研究不问“U 型为什么存在”，而选择一个会改变某只时钟、某个 phase 或某类主体约束的局部反事实。</h2>
        <div className="table-scroll" role="region" aria-label="日内研究术语与实际动作翻译，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>看到方法名时，先翻译成研究者实际做了什么</caption>
            <thead><tr><th scope="col">术语</th><th scope="col">直白含义</th><th scope="col">最低检查</th></tr></thead>
            <tbody>
              <tr><th scope="row">Fixed effect</th><td>为每只证券、交易日或时间格设置自己的基准，先吸收稳定平均差异</td><td>被吸收的是混淆还是目标机制本身？</td></tr>
              <tr><th scope="row">Event study</th><td>把日期/分钟改写成“离事件还有或已经过多久”，逐个相对时点画反应</td><td>事件前系数是否已经异常？</td></tr>
              <tr><th scope="row">DiD</th><td>Difference-in-differences：处理组的前后变化减去对照组的前后变化</td><td>改革前两组趋势是否近似平行，是否有同期冲击？</td></tr>
              <tr><th scope="row">Pretrend</th><td>事件前的相对时点系数；用来检查结果是否在“处理”前已经发生</td><td>不显著不是平行趋势的证明，还需置信区间与经济量级</td></tr>
              <tr><th scope="row">Winsorization</th><td>把训练样本中超过预设上下阈值的极端值截到阈值，而不是删除整条记录</td><td>阈值是否只用训练期估计，极端值是否本来就是研究对象？</td></tr>
              <tr><th scope="row">QLIKE / MSE</th><td>QLIKE 比较正方差预测的比例误差；MSE 是预测误差平方的平均</td><td>新模型是否在同一测试日、同一目标上稳定降低损失？</td></tr>
              <tr><th scope="row">PR-AUC / Calibration</th><td>PR-AUC 汇总稀有事件下 precision 与 recall 的权衡；校准比较预测概率与真实发生频率</td><td>类别基准率、概率分箱和不确定性是否报告？</td></tr>
            </tbody>
          </table>
        </div>
        <div className="research-card">
          <span>研究题 A · 午休与第二开盘</span>
          <h3>缩短或取消午休，究竟把闭市期间的价格调整移入原午间，还是改变全天信息生成与流动性供给？</h3>
          <p><b>设计：</b>以交易时段改革为 treatment（被研究的规则改变），建立受影响市场与未同期改革的可比市场/资产，按事件日期做 DiD 与分钟事件研究，并用改革前系数检查平行趋势。<b>结果链：</b>原午休格 volume、quote updates、RV、spread、depth → 下午重开跳跃 → 全日 RV 与收盘效率。<b>可证伪：</b>若只出现原午休活动增加、下午重开等量下降而全日不变，支持时间重分配；若全日价格创新、参与者和成本都改变，才支持更强结构变化。制度同时改变算法排程是总效应的一部分。<Cite n={16} /><Cite n={17} /><Cite n={20} /></p>
        </div>
        <div className="research-card">
          <span>研究题 B · Local Clock 还是 Global Overlap</span>
          <h3>外汇活动峰究竟跟随当地开盘，还是跟随伦敦—纽约参与者重叠？</h3>
          <p><b>设计：</b>利用美国与欧洲 DST 不同步的窄日期窗，在 local time、UTC 与 overlap event time 三套坐标上估计同一 volume、spread、depth 与 volatility 曲线；加入星期、月底、公告和假日控制，并设置无关小时安慰剂。<b>可证伪：</b>若峰随 local open 而非 overlap 移动，重叠机制变弱；反之，本地制度时钟解释变弱。<b>边界：</b>DST 不是随机化，必须跨年复现并报告季节共同变化。<Cite n={13} /><Cite n={15} /></p>
        </div>
        <div className="research-card">
          <span>研究题 C · 实时 Intraday Surprise</span>
          <h3>去除稳定时钟后，异常 OFI、depth 与 volume 是否为未来 30 分钟波动扩张提供严格样本外增量？</h3>
          <p><b>协议：</b>按完整日期 walk-forward；每个 d 只用 d−1 以前数据拟合证券×regime×phase×time-cell 的中位数/MAD、变换和日尺度模型。基准依次为 clock only → lagged RV/return → market-wide state → 加 volume surprise → 加 OFI/depth/quote age。<b>损失：</b>QLIKE、MSE、PR-AUC（若目标为扩张事件）与校准；分别报告开盘、午间、收盘、公告日。<b>可证伪：</b>增量若只在随机 cell split、当天最终分母或全样本季节线下存在，就判定失败。该设计识别预测增量，不识别 do(volume)。</p>
        </div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>每题先写时钟、phase、可得信息与估计对象，再计算；答案必须同时写出不能推出的结论。</h2>
        <div className="practice-grid">
          <article>
            <span>练习 01 · 同量开盘的竞争机制</span>
            <h3>A、B 两日 opening call 都成交 150 万股。A 日公共隔夜新闻后，首笔成交前 BBO 已上移 60 bp，call 后 30 分钟价格仍高 58 bp；B 日没有新闻，call 后先涨 25 bp、30 分钟后只剩 2 bp。分别构造最可信机制链，并写出还需观察什么。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>A 更符合公共信息先让报价重定价、auction 聚合积累订单、连续交易确认新水平：报价先动和 58/60≈96.7% 的持续幅度支持价格发现，但仍需排除跨市场先行与时钟误差。B 更符合暂时 order imbalance 或流动性需求经有限 depth 推高价格、随后流动性恢复而回撤；应检查 indicative imbalance、OFI、depth、spread、参与者终点库存和后续反转。同样 150 万股没有识别相同机制，也不能把两日差异归因于 volume。</p></details>
          </article>
          <article>
            <span>练习 02 · 午间连续阶段的两条机制链</span>
            <h3>某市场上午连续交易为 09:30–11:30。普通无公告日中，隔夜公共信息通常到 10:00 已被吸收，海外参与者尚未大规模上线，离 15:00 收盘也仍远。X=10:55–11:00 的成交笔数为相邻普通格三倍、spread 只有一半、单笔永久价格反应较小；Y=11:10–11:15 的成交较少、spread 较宽、单笔永久反应更大。两格均为 continuous phase。分别写出“主体状态→择时或等待→订单与报价→活动、spread、永久反应”的机制链，并给出可否证证据。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>X 更接近午间前可择时订单的策略性聚集：开盘信息已吸收、海外重叠尚低且收盘 deadline 尚远，使固定开盘、全球重叠和收盘基准机制都较弱；若一批可等待的流动性需求者预期 11:00 附近更厚，便共同选择该窗，知情交易也可能为掩护而进入，更多订单和报价竞争使成交增多、spread 收窄，单笔永久反应较小。若账户/母单数据显示这些订单其实不能择时，峰值仅来自强制预定算法且移除该类订单后消失，策略互补解释就被削弱。Y 更接近持续私人信息状态：潜在流动性需求者因担心被选择而等待，供给者提高逆向选择补偿并减少暴露，于是成交少、spread 宽，但少数成交携带的永久价格反应大。若 Y 的变化可由 stale quote、隐藏公共公告、跨市场先行价格或单次机械跳价解释，私人信息链就被否证。两条链都还应比较 OFI、depth、quote age、账户可择时性和后续回撤；题中相关模式本身不是唯一识别。</p></details>
          </article>
          <article>
            <span>练习 03 · 收盘 Benchmark 权衡</span>
            <h3>两种执行方案都能在收盘前完成，且损失已统一为“loss points”。早执行的 C<sub>exec</sub>=2、相对 close 偏差=3 bp；晚执行的 C<sub>exec</sub>=5、偏差=0.5 bp。令 λ<sub>B</sub>=1 loss point/bp²、U=0。分别求 L；若晚执行成本因收盘库存紧张升至 12，选择怎样改变？</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>早执行 L=2+1×3²=11；晚执行 L=5+1×0.5²=5.25，因此基准误差权重足以补偿更高即时成本。若晚执行 C<sub>exec</sub>=12，则 L=12.25，早执行的 11 更低。这个算例展示 benchmark demand 与收盘流动性供给共同决定聚集；它不是对真实基金 λ 或成本的校准。</p></details>
          </article>
          <article>
            <span>练习 04 · 午休改革的局部与全日结论</span>
            <h3>取消午休后，原闭市 12:00–13:00 的 RV 上升 8 单位，13:00 重开格 RV 下降 7 单位，全日 RV 仅上升 1 单位且区间包含 0。哪种机制最受支持？怎样设计对照？</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>最直接支持“价格调整从重开点移入原午休时段”的时间重分配；证据不足以声称改革创造了更多全日信息或波动。设计上用未同期改革但资产和全球暴露相近的市场作对照，比较处理组与对照组的前后差，并画改革前 event-time 系数检查 pretrend；同时控制交易总时长、公告、DST/重叠和其他规则变化。还应分别报告 volume、spread、depth 和下午重开跳跃。</p></details>
          </article>
          <article>
            <span>练习 05 · 收盘延时的机制检验</span>
            <h3>交易所把 close 从 15:00 延到 15:30。写出一个能区分“固定墙上时钟”与“离收盘 deadline”机制的研究，并给出两种互斥预测。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>同时在 wall-clock time 与 minutes-to-close 坐标上估计改革前后 volume、OFI、spread、depth、RV 和 auction imbalance，并用未改时段/市场作对照。Deadline 机制预测峰值从旧的 14:45–15:00 移到新的 15:15–15:30，按 minutes-to-close 对齐后形状较稳定；固定时钟或公告机制预测峰仍留在旧时点，按 wall clock 更稳定。若两处都出现峰，可能同时存在旧客户排程和新截止需求。季节曲线必须按 regime 分开、只用各期过去数据估计。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>能够把一张 U 型图重新拆回制度、主体、时钟、phase、测量与反事实，才算真正掌握本节。</h2>
        <div className="check-grid">
          <details><summary>01 · 日内季节性为什么不是钟表因果？</summary><p>钟表只标记重复位置；交易规则、信息到达、参与者重叠、截止需求、库存和风险约束在这些位置反复变化，才生成可观察分布。</p></details>
          <details><summary>02 · 为什么不能说 volume、spread、depth 与 volatility 都是 U 型？</summary><p>它们测不同供需结果，可反向变化；形状还依赖市场制度、phase、tick、资产与样本时期。必须逐变量、逐状态估计。</p></details>
          <details><summary>03 · 开盘高波动的完整机制链是什么？</summary><p>隔夜信息和订单积累 → 价值/imbalance/库存不确定 → 报价保护与供给减少 → 首轮订单/报价揭示信息 → 流动性恢复；公共报价也可能先于成交跳变。</p></details>
          <details><summary>04 · 午间低谷为什么不等于没有信息？</summary><p>公告可制造局部尖峰，低成交也可能有高每笔信息含量；跨时区和午休制度还会改变“午间”的参与者与可交易性。</p></details>
          <details><summary>05 · 收盘高 volume 为什么不保证低 spread？</summary><p>deadline 和 benchmark 让需求更不弹性，同时库存和隔夜风险让供给更昂贵；需求与供给都增强时净 spread 不确定。</p></details>
          <details><summary>06 · Auction 为什么必须单独建模？</summary><p>它在单一 clearing time/price 聚合撮合，volume 是点质量；连续交易沿路径逐笔执行。两者的 BBO、duration、impact 和优先规则不同。</p></details>
          <details><summary>07 · Calendar 与 event clock 各回答什么？</summary><p>Calendar clock 回答每分钟到达多少及等待多久；event clock 回答每 N 个事件的价格反应。后者会机械压平成交到达率。</p></details>
          <details><summary>08 · 为什么 same-day final total 会泄漏？</summary><p>实时窗口尚不知道收盘总量；使用它做分母把未来成交和消息写入当前特征，夸大异常检测与预测表现。</p></details>
          <details><summary>09 · DST 怎样帮助机制识别？</summary><p>不同地区 DST 错配暂时改变 UTC 和参与者重叠、却保留当地墙上开盘，可比较峰值跟随 local open 还是 overlap；仍需控制季节与公告。</p></details>
          <details><summary>10 · 去季节性后 residual 可以被叫作冲击吗？</summary><p>不能。Residual 只是相对所选历史基准未解释的部分，仍可能含公告、强制流、制度变化、测量误差和遗漏状态；因果需额外设计。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节把重复时钟从“图形规律”升级为 phase-aware 条件基准；下一步进入 auction 的规则本身，并把无泄漏时钟交给研究设计。</h2>
        <div className="interface-grid">
          <article><span>← 1.04</span><h3>Limit Order Book</h3><p>输入 BBO、spread、best/multi-level depth、订单事件和连续交易结构；本节只研究这些变量的条件时间变化。</p></article>
          <article><span>← 1.15</span><h3>Volume 与 Volatility</h3><p>输入 Q、trade count、OFI 与 RV 的口径；1.16 解释它们为何共享时钟，以及怎样构造同格异常而不把相关误作因果。</p></article>
          <article><span>→ 1.17</span><h3>Opening / Closing Auction</h3><p>本节只把 auction 冻结为离散 phase；下一节展开 clearing rule、indicative price、imbalance、订单策略、连续簿接口与制度福利。</p></article>
          <article><span>→ 7.25</span><h3>Research Design</h3><p>输出日期切分、regime version、local/UTC/event clocks、训练期季节曲线和 leakage audit，作为高频研究的共同协议。</p></article>
          <article><span>→ 7.24</span><h3>Volatility System</h3><p>这里只用局部 RV 和 jump-robust seasonality 建立最小边界；微观结构噪声、连续/跳跃分解与多尺度估计留给 7.24。</p></article>
        </div>
        <p className="closing-thesis">看到任何日内 U 型、反 J 型或尖峰时，应依次追问：变量究竟是 volume、spread、depth、duration 还是 RV；坐标是 local、UTC、calendar 还是 event clock；观测属于 opening call、连续交易、午休重开还是 closing call；当天适用哪个交易时段和 DST 版本；开盘是否承接隔夜信息，收盘是否受 benchmark、库存和 deadline 约束；公告与跨市场重叠是否构成第二只钟；零值是无交易、陈旧报价、闭市、停牌还是缺失；基准是否只用过去日期估计，是否偷看当天最终总量。完成这些审计后，季节性才既能作为有经济含义的结果被解释，也能作为不污染后续研究的条件基准被移除。</p>
      </section>
    </>
  );
}

export const lesson116: LessonRecord = {
  slug: '1-16',
  id: '1.16',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Intraday Seasonality',
  subtitle: '从交易制度、隔夜信息、参与者重叠、公告时钟、基准执行与库存约束出发，解释开盘—午间—收盘曲线如何形成，并建立 phase-aware、无未来泄漏的日内条件基准',
  readingTime: '约 105–115 分钟（核心阅读 64–69＋互动 14–15＋主动练习 17–19＋理解检查 8–10＋课程接口 2；参考文献与延伸阅读不计）',
  prerequisite: '1.04 · Limit Order Book 的结构；T08 · Time Scale 与 Financial Data',
  updatedAt: '2026-08-28',
  revision: '1.16-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.16-r1',
      summary: '确认整体理论、八道互动题、五项练习、时区/auction/泄漏边界与导航成立；要求删除 Andersen–Bollerslev–Das 不存在的十年窗口，并修正 Lee–Mucklow–Ready 事件样本、Pagano–Schwartz 窗口、SEC 方法日期/过滤口径，以及条件分布、双时钟、事件强度、乘法分解、稳健标准化和损失函数的索引、单位与成立条件。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.16-r1',
      summary: '确认 39 节主线、阅读预算、18 张阅读卡、目录导航和八题可访问状态机成立；要求为零背景读者闭合公式逐符号解释和研究术语首释，消除同格算例在正文、互动、反例与练习间的复述，并把主动练习改造成开盘—午间—收盘机制的生成式迁移。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.16-r2',
      summary: '确认 31 条来源、六个经验案例、八道互动题、五项练习、目录与接口均无回归；仅要求在条件分布中加入日期类型，在双时钟式冻结时间轴、lag 分箱与 surprise 单位，在事件路径式改用收益及 bp/bp²，并按明确估计顺序识别乘法分解。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.16-r2',
      summary: '确认主线、阅读量、目录、引用、实验状态机及开盘、收盘、午休改革和收盘延时练习均成立；要求补齐公式的日期状态、求和集合、事件窗口与归一化直译，把 fixed effect、预趋势、变换和缩尾前移至首次出现处，并让练习 02 显式调用午间 phase 与参与者状态。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.16-r3',
      summary: '确认 31 条来源、六案例、公式单位、八道互动题、五项练习、边界和导航均通过；仅要求把共同季节因子 h 的证券集合与权重显式绑定，或统一改为证券专属 h，以消除估计步骤中的自由证券索引。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.16-r3',
      summary: '确认 r2 的全部实质性教学遗留以及目录、引用、案例、交互、练习和接口均关闭；仅要求绑定季节因子的证券维度，并在双时钟首次给出 log1p/asinh 时同时声明尺度 c 为正且只由训练期冻结。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.16-r4',
      summary: '终审确认条件分布、双时钟、事件路径及证券专属 a→s→h→u 分解的索引、单位、训练集与实时信息边界全部闭合；31 条来源、六案例、八道互动题、五项练习、章节接口和导航全量回归通过，blocker、major、minor 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.16-r4',
      summary: '终审确认 39 节认知坡度、公式首释、18 张阅读卡、六案例、八反例、五项主动练习、十项检查及八题可访问状态机全部成立；阅读预算与 1.15/1.17/7.24/7.25 接口通过，blocker、major、minor 均为 0。',
    },
  ],
  previous: { slug: '1-15', label: '1.15 Trading Volume 与 Volatility 的关系' },
  next: { slug: '1-17', label: '1.17 Opening / Closing Auction' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '条件生成系统' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'definition', label: '季节性的定义' },
    { id: 'separate-variables', label: '变量曲线分离' },
    { id: 'clock-ledger', label: '三种时钟' },
    { id: 'opening-chain', label: '开盘机制链' },
    { id: 'overnight-closure', label: '隔夜与闭市' },
    { id: 'opening-spread', label: '开盘 Spread' },
    { id: 'opening-depth', label: 'Depth 与恢复' },
    { id: 'strategic-concentration', label: '策略性聚集' },
    { id: 'persistent-information', label: '持续私人信息' },
    { id: 'midday-trough', label: '午间低谷' },
    { id: 'lunch-reopen', label: '午休第二开盘' },
    { id: 'closing-chain', label: '收盘机制链' },
    { id: 'benchmark-demand', label: 'Benchmark Demand' },
    { id: 'inventory-overnight', label: '库存与隔夜风险' },
    { id: 'auction-boundary', label: 'Auction Phase' },
    { id: 'non-universal', label: '非普适边界' },
    { id: 'order-driven-evidence', label: '订单驱动证据' },
    { id: 'announcement-clock', label: '公告第二时钟' },
    { id: 'announcement-liquidity', label: '公告与流动性' },
    { id: 'global-overlap', label: '跨时区重叠' },
    { id: 'dst-identification', label: 'DST 识别' },
    { id: 'calendar-event-clock', label: 'Calendar / Event' },
    { id: 'multiplicative-decomposition', label: '乘法分解' },
    { id: 'estimating-curve', label: '估计基准曲线' },
    { id: 'surprise-construction', label: 'Intraday Surprise' },
    { id: 'zeros-missing', label: '零值与缺失' },
    { id: 'phase-breaks', label: 'Phase 与 Regime' },
    { id: 'leakage', label: '未来泄漏' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'empirical-cases', label: '六个经验切片' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson116Content,
  references: [
    { id: 1, authors: 'Anat R. Admati & Paul Pfleiderer', year: '1988', title: 'A Theory of Intraday Patterns: Volume and Price Variability', publication: 'Review of Financial Studies, 1(1), 3–40', url: 'https://doi.org/10.1093/rfs/1.1.3', use: '提供 discretionary liquidity traders 与 informed traders 策略互补、交易和波动内生聚集的理论基准；不把其均衡形状外推为普适事实。' },
    { id: 2, authors: 'William A. Brock & Allan W. Kleidon', year: '1992', title: 'Periodic Market Closure and Trading Volume: A Model of Intraday Bids and Asks', publication: 'Journal of Economic Dynamics and Control, 16(3–4), 451–489', url: 'https://doi.org/10.1016/0165-1889(92)90045-G', use: '说明周期闭市怎样改变开收盘组合需求弹性、交易量与 bid/ask；模型机制不直接识别现实主体。' },
    { id: 3, authors: 'F. Douglas Foster & S. Viswanathan', year: '1993', title: 'Variations in Trading Volume, Return Volatility, and Trading Costs: Evidence on Recent Price Formation Models', publication: 'Journal of Finance, 48(1), 187–211', url: 'https://doi.org/10.1111/j.1540-6261.1993.tb04706.x', use: '支持历史 NYSE 首半小时 volume/volatility/adverse selection 与星期结构共同变化；样本和成本分解具有制度边界。' },
    { id: 4, authors: 'Prem C. Jain & Gun-Ho Joh', year: '1988', title: 'The Dependence between Hourly Prices and Trading Volume', publication: 'Journal of Financial and Quantitative Analysis, 23(3), 269–283', url: 'https://doi.org/10.2307/2331067', use: '提供 1979–1983 年 NYSE 聚合小时成交的首高—中降—尾升描述；不作主体机制因果。' },
    { id: 5, authors: 'Robert A. Wood, Thomas H. McInish & J. Keith Ord', year: '1985', title: 'An Investigation of Transactions Data for NYSE Stocks', publication: 'Journal of Finance, 40(3), 723–739', url: 'https://doi.org/10.1111/j.1540-6261.1985.tb04996.x', use: '提供历史 NYSE 分钟收益均值和标准差端点较高的描述性证据；交易制度与采样时期不可忽略。' },
    { id: 6, authors: 'Lawrence Harris', year: '1986', title: 'A Transaction Data Study of Weekly and Intradaily Patterns in Stock Returns', publication: 'Journal of Financial Economics, 16(1), 99–117', url: 'https://doi.org/10.1016/0304-405X(86)90044-9', use: '支持星期效应集中在开盘早段与 last-print 偏差等历史事实；提醒交易价格与中间价口径不同。' },
    { id: 7, authors: 'Thomas H. McInish & Robert A. Wood', year: '1992', title: 'An Analysis of Intraday Patterns in Bid/Ask Spreads for NYSE Stocks', publication: 'Journal of Finance, 47(2), 753–764', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04408.x', use: '支持 1989 年 NYSE 百分比 quoted spread 的条件端点模式；不把 specialist 制度外推为电子簿必然形状。' },
    { id: 8, authors: 'Charles M. C. Lee, Belinda Mucklow & Mark J. Ready', year: '1993', title: 'Spreads, Depths, and the Impact of Earnings Information: An Intraday Analysis', publication: 'Review of Financial Studies, 6(2), 345–374', url: 'https://doi.org/10.1093/rfs/6.2.345', use: '支持公告格 volume、spread 与 depth 可异向变化；初始 230 家公司中过滤混淆事件后，209 家贡献 606 次日内公告，均值不作现代校准。' },
    { id: 9, authors: 'Hee-Joon Ahn & Yan-Leung Cheung', year: '1999', title: 'The Intraday Patterns of the Spread and Depth in a Market without Market Makers: The Stock Exchange of Hong Kong', publication: 'Pacific-Basin Finance Journal, 7(5), 539–556', url: 'https://doi.org/10.1016/S0927-538X(99)00023-2', use: '说明无指定做市商的订单驱动市场也可出现 spread U 型与 depth 倒 U 型；不唯一识别供给动机。' },
    { id: 10, authors: 'Torben G. Andersen & Tim Bollerslev', year: '1997', title: 'Intraday Periodicity and Volatility Persistence in Financial Markets', publication: 'Journal of Empirical Finance, 4(2–3), 115–158', url: 'https://doi.org/10.1016/S0927-5398(97)00004-2', use: '提供 FX 与股指期货高频周期、Flexible Fourier Form 和持续性失真证据；确定性周期与随机动态需分开。' },
    { id: 11, authors: 'Torben G. Andersen & Tim Bollerslev', year: '1998', title: 'Deutsche Mark–Dollar Volatility: Intraday Activity Patterns, Macroeconomic Announcements, and Longer Run Dependencies', publication: 'Journal of Finance, 53(1), 219–265', url: 'https://doi.org/10.1111/0022-1082.85732', use: '把日尺度 volatility、日内 harmonic 与公告效应联合建模，支持多尺度而非单一 U 型的条件表示。' },
    { id: 12, authors: 'Louis H. Ederington & Jae Ha Lee', year: '1993', title: 'How Markets Process Information: News Releases and Volatility', publication: 'Journal of Finance, 48(4), 1161–1191', url: 'https://doi.org/10.1111/j.1540-6261.1993.tb04750.x', use: '支持预定美国宏观公告后的首分钟价格调整和短暂高波动；事件样本与历史期货制度限制外推。' },
    { id: 13, authors: 'Torben G. Andersen, Tim Bollerslev, Francis X. Diebold & Clara Vega', year: '2003', title: 'Micro Effects of Macro Announcements: Real-Time Price Discovery in Foreign Exchange', publication: 'American Economic Review, 93(1), 38–62', url: 'https://doi.org/10.1257/000282803321455151', use: '支持用实时预期 surprise、五分钟汇率和 DST 清理识别公告路径；公告方向和幅度不可用 dummy 替代。' },
    { id: 14, authors: 'Robert F. Engle, Takatoshi Ito & Wen-Ling Lin', year: '1990', title: 'Meteor Showers or Heat Waves? Heteroskedastic Intra-Daily Volatility in the Foreign Exchange Market', publication: 'Econometrica, 58(3), 525–542', url: 'https://doi.org/10.2307/2938189', use: '提供外汇波动跨地理市场传递的 meteor-shower 证据和本地 heat-wave 对照；支持跨时区状态而非全球单一时钟。' },
    { id: 15, authors: 'Takatoshi Ito & Yuko Hashimoto', year: '2006', title: 'Intraday Seasonality in Activities of the Foreign Exchange Markets: Evidence from the Electronic Broking System', publication: 'Journal of the Japanese and International Economies, 20(4), 637–664', url: 'https://doi.org/10.1016/j.jjie.2006.06.005', use: '支持 EBS 交易、报价、spread 与地区开市/重叠模式，并示范夏冬时制和 DST 错配周处理。' },
    { id: 16, authors: 'Takatoshi Ito, Richard K. Lyons & Michael T. Melvin', year: '1998', title: 'Is There Private Information in the FX Market? The Tokyo Experiment', publication: 'Journal of Finance, 53(3), 1111–1130', url: 'https://doi.org/10.1111/0022-1082.00045', use: '利用 1994 年东京银行间外汇午间限制取消，支持原闭市时段 variance 上升；短窗口不证明全日永久重排。' },
    { id: 17, authors: 'Torben G. Andersen, Tim Bollerslev & Ashish Das', year: '2001', title: 'Variance-Ratio Statistics and High-Frequency Data: Testing for Changes in Intraday Volatility Patterns', publication: 'Journal of Finance, 56(1), 305–327', url: 'https://doi.org/10.1111/0022-1082.00326', use: '以更长样本复核东京午间改革，区分稳健局部增加与对样本窗敏感的全日曲线结论。' },
    { id: 18, authors: 'Torben G. Andersen, Tim Bollerslev & Jun Cai', year: '2000', title: 'Intraday and Interday Volatility in the Japanese Stock Market', publication: 'Journal of International Financial Markets, Institutions and Money, 10(2), 107–130', url: 'https://doi.org/10.1016/S1042-4431(99)00029-3', use: '支持午休市场上午和下午各自的日内 volatility 形状；提醒单一全天 U 型会抹去 session 断点。' },
    { id: 19, authors: 'Japan Exchange Group / Tokyo Stock Exchange', year: '2024', title: 'Transition of Trading Hours and Trading Holidays', publication: 'JPX official market-rule reference', url: 'https://www.jpx.co.jp/english/equities/trading/domestic/tvdivq0000006blj-att/tradinghours_eg.pdf', use: '冻结 1991、2011 与 2024 年 TSE 早午盘时段版本；官方规则提供制度事实，不独立识别改革因果。' },
    { id: 20, authors: 'Hong Kong Exchanges and Clearing', year: '2010', title: 'HKEx Decides to Extend Trading Hours to Strengthen Competitiveness', publication: 'HKEX official news release, 23 November 2010', url: 'https://www.hkex.com.hk/News/News-Release/2010/101123news?sc_lang=en', use: '冻结 2011 与 2012 年香港交易时段延长的官方安排，支持 regime version 与午休研究设计。' },
    { id: 21, authors: 'Yakov Amihud & Haim Mendelson', year: '1991', title: 'Volatility, Efficiency, and Trading: Evidence from the Japanese Stock Market', publication: 'Journal of Finance, 46(5), 1765–1789', url: 'https://doi.org/10.1111/j.1540-6261.1991.tb04643.x', use: '比较东京早盘开盘与午后重开，支持隔夜信息和闭市长度不能由“重开”标签替代。' },
    { id: 22, authors: 'Ananth Madhavan & Venkatesh Panchapagesan', year: '2000', title: 'Price Discovery in Auction Markets: A Look Inside the Black Box', publication: 'Review of Financial Studies, 13(3), 627–658', url: 'https://doi.org/10.1093/rfs/13.3.627', use: '提供 NYSE TORQ 开盘 call、specialist participation 与 imbalance 的内部证据；历史人工制度不作现代必要条件。' },
    { id: 23, authors: 'Michael S. Pagano & Robert A. Schwartz', year: '2003', title: 'A Closing Call’s Impact on Market Quality at Euronext Paris', publication: 'Journal of Financial Economics, 68(3), 439–484', url: 'https://doi.org/10.1016/S0304-405X(03)00073-4', use: '利用巴黎分阶段 closing call 改革支持末段成交重分配、同步性与成本变化；同期制度变化仍需纳入边界。' },
    { id: 24, authors: 'Robert F. Engle & Jeffrey R. Russell', year: '1998', title: 'Autoregressive Conditional Duration: A New Model for Irregularly Spaced Transaction Data', publication: 'Econometrica, 66(5), 1127–1162', url: 'https://doi.org/10.2307/2999632', use: '提供交易 duration 聚集与确定性日内成分去除的模型基准；event arrival 本身是随机状态。' },
    { id: 25, authors: 'Alfonso Dufour & Robert F. Engle', year: '2000', title: 'Time and the Price Impact of a Trade', publication: 'Journal of Finance, 55(6), 2467–2498', url: 'https://doi.org/10.1111/0022-1082.00297', use: '支持短 duration 状态下价格冲击、调整和交易方向动态变化；calendar intensity 与 per-event information 需并报。' },
    { id: 26, authors: 'Steven L. Heston, Robert A. Korajczyk & Ronnie Sadka', year: '2010', title: 'Intraday Patterns in the Cross-Section of Stock Returns', publication: 'Journal of Finance, 65(4), 1369–1407', url: 'https://doi.org/10.1111/j.1540-6261.2010.01573.x', use: '支持相同日内时点跨日重复的横截面收益模式；可预测性不直接等于无风险套利或单一执行机制。' },
    { id: 27, authors: 'Kris Boudt, Christophe Croux & Sébastien Laurent', year: '2011', title: 'Robust Estimation of Intraweek Periodicity in Volatility and Jump Detection', publication: 'Journal of Empirical Finance, 18(2), 353–367', url: 'https://doi.org/10.1016/j.jempfin.2010.11.005', use: '说明 jumps 会偏置普通 periodicity estimator，jump-robust 周期估计能改善日内 jump detection。' },
    { id: 28, authors: 'Hans-Georg Müller, Rituparna Sen & Ulrich Stadtmüller', year: '2011', title: 'Functional Data Analysis for Volatility', publication: 'Journal of Econometrics, 165(2), 233–245', url: 'https://doi.org/10.1016/j.jeconom.2011.08.002', use: '提供把每日 volatility trajectory 当作函数对象、识别重复形状和预测整条曲线的方法路线。' },
    { id: 29, authors: 'Jang Hyung Cho & Robert T. Daigler', year: '2012', title: 'An Unbiased Autoregressive Conditional Intraday Seasonal Variance Filtering Process', publication: 'Quantitative Finance, 12(2), 231–247', url: 'https://doi.org/10.1080/14697688.2010.531281', use: '说明日内 seasonal variance 本身可随时间动态变化，并提供 ARCSV 过滤与固定季节线的比较。' },
    { id: 30, authors: 'U.S. Securities and Exchange Commission', year: '2021', accessedAt: '2026-08-28', title: 'Market Activity Report Methodology', publication: 'SEC Market Structure Analytics methodology · published 5 February 2021', url: 'https://www.sec.gov/featured-topics/market-structure-analytics/market-activity-report-methodology', use: '说明官方报告仅纳入 09:35–16:00 订单以保守规避开盘特异行为，并另行过滤 Special、盘中 cross 与 IPO halt 相关成交。' },
    { id: 31, authors: 'Europe Economics for the Financial Conduct Authority', year: '2024', title: 'Pre-Trade Equities Consolidated Tape: Final Report', publication: 'FCA external research report, 13 December 2024', url: 'https://www.fca.org.uk/publication/external-research/europe-economics-pre-trade-equities-final-report.pdf', use: '提供现代英国市场 closing call、periodic auction 和连续 CLOB 的制度区分；委托报告用于市场结构背景，不作独立因果证据。' },
  ],
  readingList: [
    { title: 'Admati & Pfleiderer (1988), A Theory of Intraday Patterns', scope: '可择时流动性需求、知情交易与内生活动聚集', reason: '理解高活动时段为什么可以由策略互补生成，而不只是外生客户到达。', url: 'https://doi.org/10.1093/rfs/1.1.3' },
    { title: 'Brock & Kleidon (1992), Periodic Market Closure and Trading Volume', scope: '周期闭市、开收盘需求弹性与 bid/ask', reason: '把“边界效应”连接到组合约束和流动性定价。', url: 'https://doi.org/10.1016/0165-1889(92)90045-G' },
    { title: 'Foster & Viswanathan (1993), Variations in Volume, Volatility, and Trading Costs', scope: '开盘、星期结构、逆向选择与持续私人信息', reason: '学习活动强度和每笔信息含量为什么可能反向变化。', url: 'https://doi.org/10.1111/j.1540-6261.1993.tb04706.x' },
    { title: 'Lee, Mucklow & Ready (1993), Spreads, Depths, and Earnings Information', scope: '公告、volume、spread 与 depth 的半小时联合反应', reason: '观察供需两侧同时变化时，单一流动性指标为何不充分。', url: 'https://doi.org/10.1093/rfs/6.2.345' },
    { title: 'Ahn & Cheung (1999), Intraday Spread and Depth without Market Makers', scope: '香港订单驱动市场的 spread/depth 曲线', reason: '把机制从指定做市商职业身份提升到流动性供给功能。', url: 'https://doi.org/10.1016/S0927-538X(99)00023-2' },
    { title: 'Andersen & Bollerslev (1997), Intraday Periodicity and Volatility Persistence', scope: 'Flexible Fourier Form、确定性周期与随机持续性', reason: '理解不去季节性为什么会扭曲高频 volatility dynamics。', url: 'https://doi.org/10.1016/S0927-5398(97)00004-2' },
    { title: 'Andersen & Bollerslev (1998), DM–Dollar Volatility', scope: '日尺度、日内 harmonic 与公告的联合模型', reason: '建立多尺度 volatility 分解而非单一平均 U 型。', url: 'https://doi.org/10.1111/0022-1082.85732' },
    { title: 'Ederington & Lee (1993), How Markets Process Information', scope: '预定宏观公告后的分钟级价格与波动路径', reason: '理解公告时钟怎样覆盖平滑本地时钟。', url: 'https://doi.org/10.1111/j.1540-6261.1993.tb04750.x' },
    { title: 'Andersen et al. (2003), Micro Effects of Macro Announcements', scope: '实时预期 surprise、汇率反应与 DST 清理', reason: '学习用 event surprise 而非简单 dummy 构造可检验事件设计。', url: 'https://doi.org/10.1257/000282803321455151' },
    { title: 'Ito & Hashimoto (2006), FX Intraday Seasonality', scope: 'EBS quotes/deals、地区开市、重叠与夏冬时制', reason: '系统学习全球市场 local/UTC/overlap 三套坐标。', url: 'https://doi.org/10.1016/j.jjie.2006.06.005' },
    { title: 'Ito, Lyons & Melvin (1998), The Tokyo Experiment', scope: '午间交易限制取消的短窗证据', reason: '理解制度开放怎样把价格调整移入原闭市时段。', url: 'https://doi.org/10.1111/0022-1082.00045' },
    { title: 'Andersen, Bollerslev & Das (2001), Testing Intraday Pattern Changes', scope: '更长样本对东京午间改革的复核', reason: '学习为何局部稳健效应与全日强叙事必须分开。', url: 'https://doi.org/10.1111/0022-1082.00326' },
    { title: 'Andersen, Bollerslev & Cai (2000), Japanese Stock Volatility', scope: '午休市场的上午/下午双 session 曲线', reason: '避免把欧美连续交易模板强加给分段市场。', url: 'https://doi.org/10.1016/S1042-4431(99)00029-3' },
    { title: 'Amihud & Mendelson (1991), Volatility, Efficiency, and Trading', scope: '东京早盘 open 与午后 reopen 的比较', reason: '区分隔夜信息、闭市时长和重开机制。', url: 'https://doi.org/10.1111/j.1540-6261.1991.tb04643.x' },
    { title: 'Madhavan & Panchapagesan (2000), Price Discovery in Auction Markets', scope: '开盘 call、imbalance 与 specialist participation', reason: '为 1.17 进入 auction 内部订单与定价机制建立桥梁。', url: 'https://doi.org/10.1093/rfs/13.3.627' },
    { title: 'Pagano & Schwartz (2003), A Closing Call’s Impact', scope: '巴黎 closing call 改革、同步性与执行成本', reason: '观察连续尾段和离散 call 怎样重新分配收盘价格形成。', url: 'https://doi.org/10.1016/S0304-405X(03)00073-4' },
    { title: 'Boudt, Croux & Laurent (2011), Robust Periodicity and Jump Detection', scope: 'jump-robust 日内/周内周期估计', reason: '防止极端事件污染基准，又让错误基准制造假 jumps。', url: 'https://doi.org/10.1016/j.jempfin.2010.11.005' },
    { title: 'Müller, Sen & Stadtmüller (2011), Functional Data Analysis for Volatility', scope: '每日曲线作为函数对象、重复形状与预测', reason: '从固定 time-cell 平均升级到整条动态曲线研究。', url: 'https://doi.org/10.1016/j.jeconom.2011.08.002' },
  ],
};
