import TradingConstraintLab from '../components/TradingConstraintLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson125Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>熔断、涨跌停与 T+1 都不会自动消灭信息或风险转移需求；它们首先改变的是“谁能在什么时点、以什么价格、用什么资产完成交易”，随后才可能稳定市场，也可能把调整迁到队列、复牌、次日或关联市场。</h2>
        <p>
          同样一段价格不动，可以对应完全不同的系统状态。误单被拦下后，交易意愿可能真的消失；重大新闻后的跌停价不动，却可能只是卖单排队而没有买方；停牌期间，期货、交易所交易基金（ETF）、美国存托凭证（ADR）或同业股票仍在更新价格；当日新买股票不能卖时，投资者也可能卖掉组合中原有仓位。因而评价规则不能只问“当日实现波动率是否下降”，而要追踪规则之前的意愿、规则之内的可执行路径，以及规则之后仍未完成的价格发现和风险承担。<Cite n={24} /><Cite n={30} /><Cite n={39} />
        </p>
        <p>
          本节的条件性结论是：如果冲击主要来自操作错误、短暂流动性真空、尚未同步的公开信息或无序开盘，暂停和价格带可能给核验、协调、补充流动性与集合竞价留下时间；如果冲击来自永久信息、赎回、保证金追缴或必须完成的库存调整，规则更可能改变调整的时间、地点和承担者，而不是取消调整。这里的“压力迁移”是一张可检验的机制地图，不是物理守恒定律——信息可能被纠正，订单也可能因新对手方出现而消散。<Cite n={26} /><Cite n={27} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整因果回路</p>
        <h2>规则作用于订单进入价格的中间层；没有把“潜在意愿—可执行订单—成交—残余压力—下一状态”连成闭环，就无法判断稳定还是延期。</h2>
        <div className="mechanism-chain" aria-label="交易约束影响价格发现的八步闭环">
          <div><span>01</span><b>冲击与目标仓位</b><p>新闻、误单、赎回或保证金改变主体想持有的数量。</p></div>
          <div><span>02</span><b>制度状态</b><p>参考价、阈值、交易时钟、账户资格和规则版本共同生效。</p></div>
          <div><span>03</span><b>可执行集合</b><p>一部分价格、订单、证券或时段被允许，另一部分被拒绝或等待。</p></div>
          <div><span>04</span><b>行为前置与替代</b><p>参与者可能加速成交、撤单、排队或转向衍生品和其他资产。</p></div>
          <div><span>05</span><b>成交与未成交</b><p>已撮合订单形成观察价格，剩余失衡进入队列或账户库存。</p></div>
          <div><span>06</span><b>暂停期生产信息</b><p>公告、关联市场和订单重新聚合可能降低，也可能继续扩大分歧。</p></div>
          <div><span>07</span><b>复牌与跨期释放</b><p>集合竞价、次日价格带重置或结算资格改变，使残余需求重新出现。</p></div>
          <div><span>08</span><b>反馈到约束</b><p>新价格改变保证金、可售数量、流动性与下一轮触发概率。</p></div>
        </div>
        <div className="equation-card">
          <span>把规则写成执行映射，而不是波动开关</span>
          <div>x<sub>i,t</sub>=G(x*<sub>i,t</sub>, A<sub>t</sub>, e<sub>i,t</sub>, L<sub>t</sub>)，　u<sub>i,t</sub>=x*<sub>i,t</sub>−x<sub>i,t</sub></div>
          <p>x* 是主体希望完成的有符号交易，A_t 是当时允许的价格和时段，e 是账户或证券的交易资格，L 是可用流动性；x 是实际成交，u 是尚未完成的数量。u 不是永远保存的“压力”：它可以被撤销、由新订单抵消，也可以迁到复牌、次日或另一资产。</p>
        </div>
        <p>
          这条回路跨越毫秒到数日。毫秒至分钟内，报价保护、撤单和订单簿深度决定能否成交；十五分钟至数小时内，暂停与复牌拍卖决定协调质量；隔夜至数日内，日价格边界重置、当日回转资格和融资期限决定未完成调整如何释放。只比较触发前后五分钟，会遗漏跨日外溢；只看日收益，又会错过盘中磁吸和排队。<Cite n={25} /><Cite n={27} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与六阶段路线</p>
        <h2>本节研究规则怎样重写交易路径，不讨论某一市场“应该采用”什么阈值，也不把 2016 年历史制度或已批准未上线的机制冒充现行规则。</h2>
        <p>
          硬先修是 1.02：要能区分订单、报价、成交、深度、价差和价格发现；1.04 的限价订单簿、1.06 的流动性四维、1.17 的集合竞价、1.20 的杠杆与保证金、1.22 的现金—期货套利会被按需调用。正文以 2026-08-29 为规则快照日：沪深 2026 修订交易规则已于 7 月 6 日生效并废止 2023 版；美国夜间 Limit Up–Limit Down（LULD，单股动态价格带）虽于 8 月获批，预计 12 月 6 日才启动，故本节标记为 approved-not-operative，而非现行。<Cite n={7} /><Cite n={16} /><Cite n={17} />
        </p>
        <div className="learning-objectives">
          <span>六阶段学习路线 · 从制度分类到可证伪研究</span>
          <ol>
            <li><b>制度语法（03–12）：</b>分清全市场熔断、个股停牌、LULD、静态日限价、波动中断、结算 T+1 与当日回转限制。</li>
            <li><b>可能的稳定机制（13–18）：</b>拆解冷静期、信息生产、协调复牌、流动性补充与误单控制。</li>
            <li><b>压力迁移机制（19–32）：</b>识别限界删失、磁吸、排队、延迟发现、跨市场和杠杆传染。</li>
            <li><b>现行规则与历史案例（33–40）：</b>复算美国 market-wide circuit breaker（MWCB，市场级熔断）与 LULD、沪深 2026 规则及 2016 历史熔断。</li>
            <li><b>证据与识别（41–44）：</b>比较经典实证，建立事件时钟、反事实、安慰剂和外部价格代理。</li>
            <li><b>迁移与诊断（45–49）：</b>完成互动、独立练习、十项检查和跨章节接口。</li>
          </ol>
          <p><b>时间预算：</b>第一轮读 00–32，约 100–120 分钟，建立机制主线；第二轮读 33–49，约 75–95 分钟，完成现行规则、案例、识别、互动与练习。参考文献和延伸阅读不计入。</p>
        </div>
      </section>

      <section className="lesson-section" id="taxonomy">
        <p className="section-kicker">阶段一 · 制度语法　|　03 · 七类机制不能共用“熔断”这个名字</p>
        <h2>分类不是术语洁癖：参考价、作用范围、直接动作和恢复条件不同，会把相同冲击送进完全不同的因果链。</h2>
        <div className="table-scroll" role="region" aria-label="七种交易约束制度对比，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">交易约束的作用对象、参考量、直接动作和非等价概念</caption>
            <thead><tr><th scope="col">机制</th><th scope="col">参考量 / 触发</th><th scope="col">直接动作</th><th scope="col">不能混同</th></tr></thead>
            <tbody>
              <tr><th scope="row">市场级熔断</th><td>广义指数相对固定基准</td><td>跨市场协调暂停</td><td>个股日涨跌停</td></tr>
              <tr><th scope="row">消息 / 监管停牌</th><td>重大消息、资格或秩序判断</td><td>特定证券暂停至批准复牌</td><td>机械百分比阈值</td></tr>
              <tr><th scope="row">LULD</th><td>单股滚动参考价带</td><td>先限制带外成交，再可能 pause</td><td>以前收为基准的日限价</td></tr>
              <tr><th scope="row">静态日涨跌幅</th><td>通常为前收×固定比例</td><td>限制全天成交价格集合</td><td>触边即停止交易</td></tr>
              <tr><th scope="row">波动中断 / 价格笼子</th><td>开盘价、盘口基准或短窗参考</td><td>临停或拒绝过激申报</td><td>日累计回报上限</td></tr>
              <tr><th scope="row">T+1 结算</th><td>成交日后的合同期限</td><td>下一营业日交券付款</td><td>统一禁止同日反向交易</td></tr>
              <tr><th scope="row">当日回转限制</th><td>证券批次是否已交收及产品例外</td><td>限制新买批次的当日卖出资格</td><td>账户原有持仓全部冻结</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国 MWCB、LULD 和新闻停牌已经展示三种不同层级；沪深又把日价格边界、连续竞价申报价格笼子、无日限价股票的 ±30%/±60% 临停与证券回转资格叠在一起。研究变量若只写一个 <code>circuit_breaker=1</code>，就把制度作用对象和事件时间全部丢掉。<Cite n={1} /><Cite n={4} /><Cite n={8} /><Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="order-quote-trade-queue">
        <p className="section-kicker">04 · Order、quote、trade 与 queue</p>
        <h2>“不能越界成交”“订单无效”“暂时停止撮合”和“边界缺少对手方”是四种不同状态；不先分开，波动与流动性就会被同时误读。</h2>
        <p>
          一张高于申报保护上限的买单可能在入口被拒绝；一张位于日涨停价的买单可以合法进入并排队；若卖方愿意在涨停价成交，交易仍能发生；若全市场暂停，即使订单被接受或允许撤销，也没有连续成交。美国 LULD 的 Limit State 又处在中间：当全国最优买价等于上带或最优卖价等于下带时先启动 15 秒状态，若报价成交或撤销而解除，就不进入五分钟暂停。<Cite n={4} />
        </p>
        <p>
          因而“价格没动”至少要配四个观测：成交量与最后成交、best quote 与 spread、边界队列或 imbalance、以及规则状态时钟。日跌停时没有新成交，最后价仍可能是 90，但潜在卖方数量、期货价格和复牌清算价都在变化；把 last price 当作充分市场状态，会把不可成交误判为稳定。Madhavan 对交易机制的理论比较也说明，价格形成依赖何时聚合订单、谁能提交以及交易前信息，而不是只由最终成交数字决定。<Cite n={46} />
        </p>
      </section>

      <section className="lesson-section" id="market-wide-breaker">
        <p className="section-kicker">05 · Market-wide circuit breaker</p>
        <h2>市场级熔断的第一目标是把碎片化场所同时带入一个共同暂停与复牌协议；它没有给所有股票规定同一个“合理价格”。</h2>
        <p>
          当广义指数触发阈值，股票交易场所、相关期权与监管系统按规则协调暂停，减少某些场所仍在陈旧报价上成交、另一些已经停止的实施风险。暂停期间，新闻仍可发布，机构仍可重新估值，订单可按场所规则提交或撤销；恢复时由主上市市场通过拍卖聚合新的供需。因此一个成功执行的熔断可以做到“所有场所共同停、按规则重新开”，即使复牌后价格继续下跌。美国的协调框架源自 1987 崩盘后对跨市场超负荷与异步停牌的反思。<Cite n={1} /><Cite n={2} /><Cite n={13} />
        </p>
        <p>
          其代价是阈值可预见。若 Level 触发意味着失去十五分钟甚至当日的退出权，尚未交易者可能在阈值前加速卖出，流动性供给者也可能撤掉逆势深度；部分风险又会转到仍可交易的期货或海外市场。Subrahmanyam 的理论模型和 1997 年美国事件都把这种 magnet / satellite-market channel 写得很清楚，但净福利仍取决于被提前的是风险分担交易、噪声投机还是操作错误。<Cite n={12} /><Cite n={24} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="security-halt">
        <p className="section-kicker">06 · Single-security news / regulatory halt</p>
        <h2>消息停牌是在信息条件不完整时停止特定证券交易；它不必有固定价格阈值，复牌也取决于信息传播与市场秩序判断。</h2>
        <p>
          重大公司公告、上市资格问题、外国监管动作、系统中断或维持公平有序市场的需要，都可能触发监管停牌。与五分钟机械波动暂停相比，消息停牌可能持续更久，目标是让信息公开、被处理并进入订单。关联证券却可能继续交易：期权、ADR、同业、信用工具或行业 ETF 会在停牌期形成外部价格代理。<Cite n={8} />
        </p>
        <p>
          Lee–Ready–Seguin 在历史纽约证券交易所（NYSE）停牌样本中发现复牌后成交量和波动仍显著更高；Corwin–Lipson 的订单数据又显示，停牌期间提交与撤单大量发生，复牌清算价含有信息，但报价附近深度未必充足。这些事实同时支持“停牌期有价格发现”和“停牌没有消灭不确定性”，却不能仅凭复牌高波动断言停牌造成了冲击，因为触发停牌的消息本来就是内生极端事件。<Cite n={26} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="luld">
        <p className="section-kicker">07 · LULD：动态价格带、Limit State 与 Trading Pause</p>
        <h2>LULD 先保护单只 National Market System（NMS，全国市场系统）股票不在滚动参考价带外成交；只有边界报价状态持续，才从价格约束升级为时间暂停。</h2>
        <div className="equation-card">
          <span>冻结参考价时的最小价格带</span>
          <div>Lower<sub>t</sub>=R<sub>t</sub>(1−b)，　Upper<sub>t</sub>=R<sub>t</sub>(1+b)</div>
          <p>R_t 通常是此前五分钟合格成交的算术均价，满足 30 秒与至少 1% 偏离条件后才更新；b 取决于 Tier、前收价格桶和时段。R_t 是滚动量，不是前收。</p>
        </div>
        <p>
          对前收高于 3 美元的 Tier 1 股票，正常带宽通常为 ±5%；Tier 2 为 ±10%。National Best Bid / Offer（NBB/NBO，全国最优买价/卖价）分别等于上带或下带且未穿越时进入 Limit State，十五秒内解除则继续；未解除才由主上市市场宣布通常五分钟的 Trading Pause，并通过其复牌程序恢复。Straddle State、最后二十五分钟倍宽和最后十分钟收盘处理又是不同状态。<Cite n={4} /><Cite n={5} />
        </p>
        <p>
          LULD 对极端错价和陈旧报价的保护能力较强，却不会把永久信息锁在旧参考价附近：参考价可以随成交滚动，暂停后也可在新价格复牌。其可检验问题应是极端成交是否减少、逆势深度是否被保护、总价格发现是否更准确，而不是把“五分钟内波动下降”当作福利本身。Hautsch–Horvath 的准实验发现暂停前存在磁吸，暂停能保护逆势流动性，但复牌后波动、价差与不稳定性仍可能升高，正说明两类作用可以同时存在。<Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="daily-price-limit">
        <p className="section-kicker">08 · Static daily price limit</p>
        <h2>静态日涨跌幅限制把当天可成交价格限定在以前收为基准的集合中；触边不等于停牌，单边排队才可能造成事实上的不可成交。</h2>
        <div className="equation-card">
          <span>忽略价格单位取整的日价格集合</span>
          <div>P<sub>t</sub>∈[P<sub>t−1</sub>(1−L), P<sub>t−1</sub>(1+L)]</div>
          <p>若从 t 到 t+k 每日都恰好收于同一跌停比例 L，且忽略价格单位取整、公司行动和规则变化：</p>
          <div>P<sub>t+k</sub><sup>floor</sup>=P<sub>t−1</sub>(1−L)<sup>k+1</sup></div>
          <p>L 是当日限制比例。连续两日 −10% 的累计下跌是 1−0.9²=19%，不是把 10% 简单相加成 20%。每日以前收重置，使价格可逐日接近更远的潜在价值。</p>
        </div>
        <p>
          当消息把潜在价值从 100 降到 82、当日下限为 90 时，第一日的 −10% 只是观察价格被限界删失在边界；第二日以下限 81 重新开放，82 才进入可执行集合。若第一日 90 有足够买方，仍可成交大量股票；若卖方远多于买方，则排队、撤单、等待时间和次日缺口比 last price 更能描述风险。Kim–Rhee、Chan–Kim–Rhee 以及中国交叉上市证据普遍要求把延期发现、波动外溢和交易干扰分开测量。<Cite n={30} /><Cite n={32} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="volatility-interruption">
        <p className="section-kicker">09 · Dynamic order collar 与 volatility interruption</p>
        <h2>日边界约束“今天最远能成交到哪里”，价格笼子约束“这一刻的激进限价单能报多远”，盘中临停则改变撮合时钟；三者可以叠加。</h2>
        <p>
          沪深 2026 规则中，主板和深交所股票连续竞价的买入限价一般不得高于“买入基准价×102%”与“买入基准价+10×最小价位”两个价格上界中较高者；卖出限价一般不得低于“卖出基准价×98%”与“卖出基准价−10×最小价位”两个价格下界中较低者。上交所科创板仍采用纯 ±2%。一张价格低于日涨停却偏离即时盘口过大的买单，仍可能因价格笼子无效。这是 order validation，不是成交后暂停。<Cite n={16} /><Cite n={17} />
        </p>
        <p>
          无日涨跌幅股票若先首次触及相对当日开盘价的 ±30%，复牌后又首次触及同方向 ±60%，两档分别暂停十分钟；若第一笔触发价格直接达到或越过 ±60%，该方向只暂停一次，之后不再重复触发。于是“首次公开发行（IPO）后前五日无涨跌幅”并不表示没有波动控制：它只是取消以前收为中心的静态日边界，同时保留动态申报保护和盘中时间中断。研究者必须保存 reference type、trigger timestamp、order accepted/rejected 和 actual reopen，而不是只标注“hit limit”。<Cite n={16} /><Cite n={17} /><Cite n={58} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="settlement-t1">
        <p className="section-kicker">10 · T+1 settlement：交易后的交付时钟</p>
        <h2>结算周期回答“成交合同何时交券付款”，不是“投资者何时获准反向交易”；美国 T+1 因此不能被翻译成买入后当天禁卖。</h2>
        <p>
          美国标准结算周期自 2024-05-28 起由 T+2 缩短为 T+1，大多数经纪商证券交易通常在成交后的下一个营业日完成资金和证券交付。缩短窗口可降低对手方暴露和部分抵押品需求，却压缩交易确认、证券借贷、外汇与运营修正时间。美国金融业监管局（FINRA）明确说明，现金账户用已付清资金买入证券后可以同日卖出；unsettled proceeds、good-faith violation、free riding、保证金和经纪商限制是另外的账户规则。<Cite n={14} /><Cite n={15} />
        </p>
        <p>
          因此研究美国 T+1 的直接结果应先放在 fail rate、margin、融资、trade affirmation 和运营成本上，而不是把日内成交量变化直接归因于统一持有期。交易资格、合同结算和资金可用性必须分别建表；它们可能相互作用，却不是同一个二元变量。
        </p>
      </section>

      <section className="lesson-section" id="holding-t1">
        <p className="section-kicker">11 · 中国普通 A 股的当日回转限制</p>
        <h2>“买入证券交收前不得卖出”作用于新买批次的可售资格；它不冻结昨日持仓，也不覆盖规则列出的全部回转交易产品。</h2>
        <div className="equation-card">
          <span>最小可售数量账本</span>
          <div>Sellable<sub>t</sub>=PriorEligibleInventory<sub>t</sub>+SameDayTurnaroundEligibleBuys<sub>t</sub></div>
          <p>普通 A 股今日买入通常不进入当日可售数量。若昨日已有 1,000 股、今日新买 400 股，忽略其他冻结与融券时，当日最多卖出原有 1,000 股，而不是 0 或 1,400 股。</p>
        </div>
        <p>
          沪深规则同时列出债券 ETF、货币市场基金、黄金 ETF、商品期货 ETF 以及符合条件的跨境 ETF/上市型开放式基金（LOF）等回转例外，不能简写成“所有证券 T+1”或“所有 ETF T+0”。中国结算的证券记账、可售交收锁定和资金多批次处理又属于参与人交收管道；深圳现行指南显示证券与资金并非在一个 T+1 时点整齐同步，进一步证明交易资格与清算流程不能混写。<Cite n={16} /><Cite n={17} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="two-t1s">
        <p className="section-kicker">12 · 两种 T+1 为什么产生不同经济机制</p>
        <h2>结算 T+1 缩短的是合同暴露时间；当日回转限制拿走的是新增买方的即时退出选择权，后者会直接改变买入定价、纠错速度和日内库存。</h2>
        <p>
          对美国结算 T+1，首要链条是：成交→确认与分配→融资/借券准备→次营业日交付→fail、margin 和运营风险反馈。对中国股票回转约束，链条则是：今日买入→新增批次不可卖→错误判断无法当日反转→买方要求流动性折价或延后买入→次日释放潜在卖盘。名称相同，受约束主体、状态变量与结果指标都不同。<Cite n={40} /><Cite n={42} /><Cite n={43} />
        </p>
        <p>
          Guo–Li–Tu 的 B 股制度比较在特定趋势交易模型与历史样本中发现 T+1 降低成交量和波动；Qiao–Dam 估计一日卖出锁定带来约 14 bp 的开盘流动性折价（bp 是基点，1 bp=0.01 个百分点）；Bian–Su–Wang 用可日内交易权证与受限股票比较，发现不可出售性折价随收盘临近而缩小。它们共同说明退出权有价格，却不能推出所有时期的净福利：B 股开放政策、权证估值和跨资产差异都限制因果外推。<Cite n={40} /><Cite n={42} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="cooling-off">
        <p className="section-kicker">阶段二 · 规则何时真正稳定　|　13 · Cooling-off channel</p>
        <h2>冷静期只有在冲击包含可消散的噪声、短暂流动性真空或认知协调失败时，才可能减少后续需要完成的交易；对永久信息，时间本身不会恢复旧价格。</h2>
        <p>
          假设一张误单扫过浅薄订单簿，几秒后操作者撤销意图。价格带阻止带外成交，或暂停让更多反向限价单进入，未完成的 x* 可能真的降到零；这不是压力迁移，而是非基本面需求被取消。相反，若盈利预警把企业现金流永久下修，卖方目标仓位仍然存在，十五分钟只能改变它何时成交。Greenwald–Stein 强调暂停可以降低交易机制失灵风险，但无法替代对基本价值的重新配置。<Cite n={44} />
        </p>
        <div className="precision-note"><span>可证伪预测</span><p>真正的 cooling-off 应表现为：外部基本面代理不再继续同向移动、复牌价格误差缩小、订单失衡衰减，而且结果不只是转到次日或衍生品。单纯“暂停期间成交波动为零”不构成证据。</p></div>
      </section>

      <section className="lesson-section" id="information-production">
        <p className="section-kicker">14 · Information production</p>
        <h2>交易暂停不等于信息暂停；公告、分析与关联资产可在停牌期缩小共同不确定性，也可暴露更远的均衡价格。</h2>
        <p>
          消息停牌给公司发布完整材料、交易所询问、分析师更新模型和投资者比较来源留下时间。如果公告从“传闻”变成可量化现金流冲击，分歧可能下降；但期货或 ADR 若在此期间继续下跌，停牌市场只是失去自身成交价格，并没有阻止外部价格发现。停牌期订单的提交、撤销和复牌清算价预测力，正说明信息可以通过非连续成交渠道进入价格。<Cite n={27} />
        </p>
        <p>
          研究中应把有信息公告停牌、纯机械波动暂停和运营故障分层；再使用 ADR、H 股、期权隐含价格或行业篮子估计潜在价值。如果复牌跳跃只是追赶外部市场，证据更支持延期；如果外部价格先分散、随后在公告澄清后收敛，才更支持信息生产。
        </p>
      </section>

      <section className="lesson-section" id="coordination-reopening">
        <p className="section-kicker">15 · Coordination 与 reopening auction</p>
        <h2>暂停最稳健的制度价值往往不是“让价格少跌”，而是让碎片化场所共享时钟，并在复牌时用一次集中拍卖聚合不平衡。</h2>
        <p>
          连续市场极端时，某些场所深度耗尽，另一些仍显示陈旧报价，跨市场路由会把市价单送入错误价格。协调暂停切断这种异步状态；复牌拍卖把停牌期间累积的买卖意愿放在同一清算问题中，选择最大可成交量和规则允许的价格。2020 美国四次 MWCB 使九千多只股票同步暂停并逐步恢复，是运行协调的证据，但不是“若不停牌会怎样”的因果反事实。<Cite n={11} />
        </p>
        <p>
          “十五分钟后复牌”也不是保证整点成交。主上市市场可能因 auction collar、market-order imbalance 或运营问题延长；其他市场通常等待主上市市场先开。实证数据必须同时存 scheduled resume 和 actual resume，否则会把制度最短时钟误写成真实不可交易时长。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-replenishment">
        <p className="section-kicker">16 · Liquidity replenishment</p>
        <h2>暂停给流动性供给者重新估值和提交订单的机会，但也会让他们因库存、信息劣势或再次触发风险而减少承诺；深度恢复不是自动结果。</h2>
        <p>
          在短暂订单簿真空中，做市商需要时间核对外部价格、风险限额和 hedge 路径；集合竞价又能让被动订单看到集中 imbalance。Corwin–Lipson 发现停牌期间进入的订单构成复牌簿的重要部分，说明时间可生成流动性；但复牌附近深度仍可能低，Hautsch–Horvath 也发现复牌后价差更宽、稳定性更差。暂停既提供补充窗口，也提高知情交易和跳跃风险，两条力量必须在同一订单簿上比较。<Cite n={27} /><Cite n={29} />
        </p>
        <p>
          因此有效性指标应包括复牌 auction depth、imbalance、首笔成交价误差、随后 spread/depth、成交等待与撤单，而不是只看成交是否恢复。若复牌立即再次触边，说明暂停完成了协调，却没有找到足够风险承受者。
        </p>
      </section>

      <section className="lesson-section" id="operational-error">
        <p className="section-kicker">17 · Operational error containment</p>
        <h2>价格带最有说服力的用例，是阻止陈旧报价、算法故障和流动性真空把一笔有限需求翻译成离谱成交；这里“少成交”本身可以是改进。</h2>
        <p>
          2010 Flash Crash 中，标普 500 E-mini 股指期货与跟踪该指数的 SPY ETF 在数分钟内快速下跌，流动性供给者退出，大量个股出现极端打印，随后许多异常成交被取消。事件既包含真实去风险，也暴露了碎片化路由和陈旧报价如何放大执行错误。其后单股暂停试点和 LULD 的设计，重点之一就是让极端订单先遇到价格带和状态时钟，而不是立即穿透稀薄深度。<Cite n={9} /><Cite n={10} />
        </p>
        <p>
          这类保护仍有边界：若真实均衡价确实跨越旧带，规则应允许参考价更新和在新水平复牌；若永远把“没成交”视为成功，就会把拒绝价格发现与避免错误成交混为一谈。可检验结果应是被阻止成交相对可验证外部价格更错误，而不是仅仅更远离前收。
        </p>
      </section>

      <section className="lesson-section" id="stabilization-conditions">
        <p className="section-kicker">18 · 稳定作用的充分条件不是“有暂停”</p>
        <h2>规则要真正减少而非搬移调整，至少需要暂时性冲击、可生产的信息、愿意补充的风险承担者，以及能把新订单转成可执行复牌价的机制同时出现。</h2>
        <div className="table-scroll" role="region" aria-label="交易暂停稳定与延期的状态条件，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">什么条件更支持稳定，什么条件更支持压力迁移</caption>
            <thead><tr><th scope="col">状态维度</th><th scope="col">更可能真正稳定</th><th scope="col">更可能延期或迁移</th></tr></thead>
            <tbody>
              <tr><th scope="row">冲击性质</th><td>误单、谣言、短暂错配</td><td>永久现金流新闻、赎回、强平</td></tr>
              <tr><th scope="row">暂停期信息</th><td>可核实公告减少分歧</td><td>外部市场继续同向重定价</td></tr>
              <tr><th scope="row">风险承接</th><td>新做市与逆势资本进入</td><td>融资紧、库存同向、卖方拥挤</td></tr>
              <tr><th scope="row">重开机制</th><td>深度拍卖、透明失衡、跨场协调</td><td>薄拍卖、反复触带、不同步复牌</td></tr>
              <tr><th scope="row">替代市场</th><td>同步规则减少陈旧套利</td><td>风险流迁到期货、ETF、海外或他股</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Bao 等的随机实验给出了有用边界：在固定基本面、参与者缺乏经验时，价格限制或 T+1 有时改善定价；当基本价值随机变化时，规则并不普遍改善错误定价，且价格限制真正绑定时可能放大动量。Kodres–O’Brien 也只是在特定信息与风险分担结构中证明可能存在 Pareto 改善的价格限制，而非给出通用最优带宽。实验和理论共同说明“稳定”是状态与主体结构的函数。<Cite n={45} /><Cite n={52} />
        </p>
        <div className="precision-note"><span>本阶段结论</span><p>操作有序、波动较低、价格更准确和福利更高是四个不同命题。规则可以成功协调暂停，却不改变最终跌幅；也可以减少错误打印，却增加排队和价格延迟。任何“有效”判断都必须先指定结果变量。</p></div>
      </section>

      <section className="lesson-section" id="latent-observed-volatility">
        <p className="section-kicker">阶段三 · 压力怎样迁移　|　19 · Latent price 与 observed price</p>
        <h2>受限成交价是潜在清算状态经过制度和流动性共同过滤后的观测；它不是一个可直接看见却被规则遮住的唯一“真价”。</h2>
        <div className="equation-card">
          <span>受限价格的观测方程</span>
          <div>p<sub>t</sub>=H(p*<sub>t</sub>, A<sub>t</sub>, D<sub>t</sub>, q<sub>t</sub>)</div>
          <p>p* 表示若没有当前约束、在指定市场结构下可能形成的清算价格；A 是允许价格集合，D 是买卖需求，q 是实际可用深度。p* 不是自然常数：外部市场、交易成本、卖空与风险厌恶都会改变它，研究者只能用模型或关联资产估计。</p>
        </div>
        <p>
          当价格跌停且最后成交为 90，数据并没有告诉我们潜在价格是 89、82 还是已经因新买方进入回到 90。要估计潜在调整，可结合涨跌停队列、集合竞价虚拟价格、期货/ETF/H 股、公司公告和随后可交易窗口。Lehmann 对早期限价研究的评论正指出：触限后反转和较低观测波动都不足以区分暂时误价、永久信息与被压抑波动。<Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="censoring-truncation">
        <p className="section-kicker">20 · Censoring（限界删失）：边界内仍有观测，不等于尾部风险变小</p>
        <h2>硬价格边界会机械改变收益分布的可见部分；若仍用普通波动率和正态模型比较制度前后，会把测量规则当成经济稳定。</h2>
        <p>
          对下限 L，潜在回报 r* 小于 −L 时，当日可成交收益至多显示约 −L；多个不同严重程度的冲击被压成同一个跌停观察。这个教学观测式属于限界删失：超出边界的潜在回报仍对应样本中的一条记录，只是统一记在边界；它不同于把超界观测直接排除在样本外的 truncation（截断）。样本方差、极差和偏度因此被机械改变，而队列长度、次日开盘和关联资产可能变得更极端。若用受限 close-to-close return 训练波动模型，它会在最需要区分尾部状态时丢失幅度信息。
        </p>
        <div className="equation-card">
          <span>教学用单边限界删失</span>
          <div>r<sub>t</sub><sup>obs</sup>=max(r*<sub>t</sub>, −L)　（忽略上限、取整与跨日重置）</div>
          <p>当 r* 分别为 −12%、−20% 与 −35%，L=10% 时，三者当日都可能观察为 −10%。这只是观测模型，不等于每个事件的未成交量或次日路径相同。</p>
        </div>
        <p>
          创业板从 10% 放宽到 20% 后，研究报告流动性改善，同时开高低收（OHLC）价格构造的波动和基于成交量同步概率的知情交易代理（VPIN）上升。更宽区间允许永久信息更快进入当日价格，也可能增加暂时冲击；因此“观测波动上升”本身不能判定市场质量下降，必须与价差、价格延迟、次日外溢和永久成分共同解释。<Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="magnet-effect">
        <p className="section-kicker">21 · Magnet effect：阈值改变阈值之前的行为</p>
        <h2>如果触发意味着失去交易机会，等待的期权价值会随距阈值缩小而下降；部分主体因此提前成交，规则尚未触发就已进入价格。</h2>
        <p>
          潜在卖方原本可以等待更多信息，却担心市场一旦暂停就无法退出；持有保证金仓位者又面对确定截止时间，于是把卖单前置。流动性提供者预期暂停后复牌跳跃，可能撤掉逆势报价。两者共同造成成交强度、同向订单和价格速度在阈值附近上升。Subrahmanyam 给出理论机制，Cho 等在台湾涨停侧、Goldstein–Kavajecz 在 1997 美国事件、Wong 等在上海触限路径中找到相容证据。<Cite n={24} /><Cite n={28} /><Cite n={31} /><Cite n={33} />
        </p>
        <p>
          但 proximity 不是外生运行变量。强新闻自然同时造成更快下跌和更接近阈值，研究若只保留最终触限路径，还使用了未来状态筛选样本。Wan 等报告的触限前 cooling 与 Cho/Wong 的 magnet 采用不同概率分母和条件样本，不能简单宣布谁“证明”了真相。合格设计应使用规则变化、影子价格、风险集匹配和伪阈值，检验真实阈值是否出现额外离散变化。<Cite n={35} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="execution-race">
        <p className="section-kicker">22 · Execution race：为什么“先卖掉”可能成为自我实现</p>
        <h2>可预见暂停把连续的价格风险变成离散的交易机会风险；当很多主体同时优化退出顺序，个体合理的前置执行会集体消耗深度。</h2>
        <p>
          一名投资者若预计阈值后仍可低成本交易，可以等待；若预计将暂停、早收盘或封死队列，其目标函数会增加“未执行”的惩罚。算法因此提高 participation rate，风险经理减少限价等待，做市商扩大价差。真实信息冲击没有变，执行时间却被压缩，导致每分钟订单量相对可用深度更大。
        </p>
        <p>
          1997 年旧版美国点数阈值在第一层停牌后很快触发第二层并提前收市，美国证券交易委员会（SEC）事后报告担心阈值过低和早收盘激励提前成交；中国证监会 2016 年答问也承认 5% 与 7% 距离过近、7% 后直接收市所产生的磁吸。两者都是监管者对机制的事后判断，不是随机化因果证明，却提供了清晰的制度设计反例。<Cite n={12} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="limit-queue">
        <p className="section-kicker">23 · Limit queue 与 shadow imbalance</p>
        <h2>涨跌停价上的最后成交只记录愿意配对的边际数量；同向未成交队列才显示多少交易意愿被留在价格之外。</h2>
        <p>
          假设跌停价 90 有 10 万股买单、500 万股卖单。成交可持续到买单耗尽，随后 last price 停在 90；如果只看成交量或收盘价，剩余 490 万股卖出需求不可见。队列还不是确定卖压：订单可撤销、重复、拆分，主体可能用期货对冲或因新信息改变目标。但 queue imbalance、撤单率、等待时间和次日再次提交比“封板=停牌”更准确。
        </p>
        <div className="equation-card">
          <span>边界上的最小未成交量</span>
          <div>Q<sub>residual</sub>=max(Q<sub>same-side</sub>−Q<sub>opposite-executable</sub>, 0)</div>
          <p>这只是给定订单快照的机械下界；隐藏单、撤单、跨市场 hedge 和新到订单会让未来真实需求变化。研究应保存逐笔委托、撤单和队列，而不是用一个 limit-hit dummy 替代。</p>
        </div>
      </section>

      <section className="lesson-section" id="liquidity-interference">
        <p className="section-kicker">24 · Trading interference 与 liquidity illusion</p>
        <h2>价格被固定在边界时，名义价差可能看起来不再扩大，真实可成交深度和等待成本却可能急剧恶化。</h2>
        <p>
          跌停侧卖方只能在下限或更高价格成交；若买方撤退，市场不是“低波动高流动性”，而是没有足够反向风险承担者。接近跌停时，上海历史数据中成交量和单笔规模下降、价差扩大；东京和马来西亚证据也发现交易干扰或知情订单延迟。边界使传统 quoted spread、realized volatility 和 turnover 的含义发生变化，需增加 fill probability、time-to-execution 和 queue depth。<Cite n={30} /><Cite n={32} /><Cite n={33} />
        </p>
        <p>
          反方向也可能成立：涨停吸引注意力买盘，成交量暂时上升，却不表示流动性更有信息效率。Seasholes–Wu 发现个人投资者在涨停附近买入此前未持有股票，先行资金次日卖出，之后价格反转；Chen 等的账户数据也显示大户在涨停日净买、次日卖。高成交量可以是协调和注意力交易，而不是低摩擦价格发现。<Cite n={36} /><Cite n={54} />
        </p>
      </section>

      <section className="lesson-section" id="price-discovery-delay">
        <p className="section-kicker">25 · Price-discovery delay</p>
        <h2>若边界比永久信息冲击更窄，第一日价格只能走完部分距离；未完成调整会在价格带重置、复牌或替代市场中继续。</h2>
        <p>
          延期发现的可检验预测不是“第二天同方向”这么简单，而是受限价格相对外部基本面代理存在误差，误差在下一可交易窗口收敛。东京价格限制研究记录跨日延续和交易干扰；A/H 交叉上市研究则发现结果依新闻与方向而异。因为外部资产的币种、时区、卖空和投资者不同，它只能提供有噪声的 shadow price，仍优于把受限收盘当作完整价值。<Cite n={30} /><Cite n={34} />
        </p>
        <p>
          次日延续也可能来自新新闻，次日反转也可能来自流动性反弹或过度反应。研究应在公告可量化时构造 cash-flow surprise，使用 H 股、ADR、期货或行业篮子控制共同信息，并分别估计开盘 gap、盘中吸收和一至五日累计调整。
        </p>
      </section>

      <section className="lesson-section" id="volatility-spillover">
        <p className="section-kicker">26 · Volatility spillover</p>
        <h2>当日被压低的可观察波动可以在复牌、次日或未受限资产中重新出现；总风险评价必须跨时间与跨市场积分。</h2>
        <div className="equation-card">
          <span>机制核算表，而非统计恒等式</span>
          <div>Adjustment = immediate trades + queue + reopen/next-day + cross-market + balance-sheet transfer</div>
          <p>五项可能互相抵消，也没有共同量纲；式子用于提醒研究者不要只保留第一项。若信息被纠正，后四项可同时收缩；若强平持续，它们可能扩大。</p>
        </div>
        <p>
          Kim–Rhee 的经典比较支持价格发现延迟、波动外溢和交易干扰；Hautsch–Horvath 也观察到 pause 后额外波动与价差。相反，Ma–Rao–Sears 在期货触限事件中报告短期波动下降和反转，解释为冷静期；Lehmann 随即指出缺少未处理反事实和潜在波动测量。看似冲突的结果很大一部分来自时间窗、处理机制和 estimand 不同。<Cite n={29} /><Cite n={30} /><Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="reopen-next-day">
        <p className="section-kicker">27 · Reopening、next open 与 path dependence</p>
        <h2>暂停结束不是把旧市场重新启动，而是用暂停期间形成的新信息、订单和资产负债表开启另一个状态；路径依赖因此从复牌第一笔就开始。</h2>
        <p>
          复牌 auction 的 clearing price 取决于停牌期间仍在簿上的订单，而这些订单可被撤销；实际复牌时间也可能因失衡延长。日涨跌幅的次日边界又以前一日受限收盘为基准，使连续触限产生乘法路径。T+1 新买库存则在下一交易日获得卖出资格，可能集中到开盘。三种制度都把“下一窗口”变成新的状态变量，而不是简单延后固定分钟数。
        </p>
        <p>
          研究事件时间应至少覆盖触发前、暂停/封板期、复牌拍卖、当日余下、次日开盘与一至五日；分别报告延续、反转、外部价格误差和流动性恢复。只比较触发前后等长五分钟，会把没有交易的区间机械当成零波动，也看不到次日资格解锁。
        </p>
      </section>

      <section className="lesson-section" id="cross-market-migration">
        <p className="section-kicker">28 · Cross-market migration</p>
        <h2>一个市场停止价格发现时，信息和风险承担会寻找仍开放的替代坐标；主市场越难交易，卫星市场的信息份额越可能临时上升。</h2>
        <p>
          现金股票受限时，投资者可交易指数期货、ETF、期权、ADR/H 股或相关行业；市场级熔断若不同步覆盖期货，又可能把活动集中到仍开放场所。Subrahmanyam 的理论明确预测卫星市场迁移，1997 美国事件也观察到订单从电子簿向场内裁量渠道转移。迁移既提供连续价格信号，也把冲击和保证金需求带到其他资产。<Cite n={24} /><Cite n={28} />
        </p>
        <p>
          识别应估计停牌窗口内的成交份额、Hasbrouck 或 Gonzalo–Granger 信息份额、lead–lag 和 basis，并在复牌后观察价格领导是否回流。若未停市场只在另一市场暂停的窗口内离散获得领导力，才更符合迁移机制；若它在事件前已经领先，可能只是共同新闻或固有交易时段差异。
        </p>
      </section>

      <section className="lesson-section" id="derivatives-basis">
        <p className="section-kicker">29 · Derivatives、basis 与 hedge substitution</p>
        <h2>现货价格被边界限制时，期货可能更快表达潜在调整；负基差既是价格发现信号，也包含融资、股息、卖空和资产负债表摩擦。</h2>
        <div className="equation-card">
          <span>教学用现货—期货基差</span>
          <div>b<sub>t</sub>=F<sub>t</sub>−S<sub>t</sub></div>
          <p>若现货停在 90、期货交易到 86，则 b=−4。不能直接把 86 宣称为现货“真价”：期限、融资、股息、保证金、交易时段和风险溢价都进入期货价格。</p>
        </div>
        <p>
          做空期货可以替代无法出售的现货，降低一部分方向风险，却增加基差、逐日盯市和保证金现金需求；期货卖压又可能通过套利和指数对冲反馈现货。Grossman 对程序交易和动态对冲的分析、以及 2010 Flash Crash 的现金—期货联动，都说明跨市场 hedge 既传播信息也传播机械订单，不能只看一个交易所。<Cite n={9} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="leverage-margin">
        <p className="section-kicker">30 · Leverage、margin 与 fire-sale substitution</p>
        <h2>最危险的组合不是“价格限制”或“杠杆”单独存在，而是保证金截止时间到来时，被锁资产不能出售，主体只好卖掉仍有流动性的其他资产。</h2>
        <p>
          因果链是：受限资产下跌→权益与抵押品价值下降→margin call 上升→该资产跌停、停牌或今日新买批次不可卖→投资者出售组合中可交易股票/期货→其他价格下跌→更多账户接近强平线。局部规则由此通过共同资产负债表转成跨股票传染。Brunnermeier–Pedersen 的 funding–market liquidity 螺旋提供一般理论，账户级中国保证金数据则显示接近平仓线提高卖出倾向并形成跨股票冲击。<Cite n={39} /><Cite n={47} />
        </p>
        <p>
          “跌停股票停止交易”在制度上不准确：它仍可在边界成交，只是单边队列可能造成事实不可售。研究应使用组合中无法成交或受限资产占比、距平仓线和其他未受限股票净卖出，负对照包括无杠杆账户、涨停而非跌停、以及不在同一账户组合中的相似股票。
        </p>
      </section>

      <section className="lesson-section" id="t1-trapped-inventory">
        <p className="section-kicker">31 · T+1 trapped inventory 与纠错延迟</p>
        <h2>当日新买方发现判断错误却不能卖出，负面信息无法通过该批次的反向订单立即进入价格；退出选择权的缺失会在买入时提前定价。</h2>
        <p>
          一日锁定至少产生三条通道。第一，买方承担不可避免的隔夜新闻和开盘流动性风险，要求折价；第二，日内纠错和做市库存调整受限，价格效率可能下降；第三，投资者把买入推迟到收盘附近，因为剩余锁定时间更短。Qiao–Dam 的 14 bp 估计与 Bian–Su–Wang 的股票—权证配对都与这些预测一致，但不是所有股票时期的随机改革。<Cite n={42} /><Cite n={43} />
        </p>
        <p>
          T+1 也机械压低可完成的双边换手，尤其抑制趋势追逐者的当日反复交易；在某些模型和历史 B 股样本中，成交量与观测波动下降。相反，A/B 股双重差分（difference-in-differences，DiD）和 ETF 对比发现更高价差、更低效率或 T+0 产品更快修复偏离。两组结果并不矛盾：被阻止的交易同时包含投机、止损、套利和流动性供给，净效应取决于其组成。<Cite n={40} /><Cite n={41} /><Cite n={51} />
        </p>
      </section>

      <section className="lesson-section" id="heterogeneity-asymmetry">
        <p className="section-kicker">32 · Heterogeneity 与上下行不对称</p>
        <h2>同一规则对涨停、跌停，散户、机构，现金账户、杠杆账户，以及有无替代市场的证券，不会产生同一个平均效果。</h2>
        <p>
          涨停可能吸引注意力买盘，形成高成交和次日延续后反转；跌停更容易遇到卖空约束、T+1 锁定、保证金截止与逆势买方撤退，表现为成交塌缩和事实不可售。台湾磁吸证据在上限侧更强，中国研究也发现涨跌两侧的成交、延续和反转并不对称。把两侧合并会让相反机制互相抵消。<Cite n={31} /><Cite n={33} /><Cite n={36} />
        </p>
        <p>
          同样，拥有期货与跨境通道的机构可以迁移 hedge，纯现金散户只能等待；做市商有库存和资本约束，长期投资者可能愿意吸收折价；低价证券的 tick（最小报价变动单位）和 LULD 参数又与大盘股不同。中国早期样本也显示牛熊市和涨跌方向会给相同限制不同结果。实证必须预先分层 security type、board、investor type、leverage、shortability、substitute availability 和 news class，而不是事后挑出显著组。<Cite n={56} />
        </p>
      </section>

      <section className="lesson-section" id="us-mwcb-current">
        <p className="section-kicker">阶段四 · 现行规则与历史案例　|　33 · 美国 MWCB 现行规则快照</p>
        <h2>7%、13%、20% 是相对前一交易日 S&amp;P 500 收盘的固定日内阈值；前两级是有尾盘边界的初始暂停，第三级在任何时点结束当日交易。</h2>
        <div className="table-scroll" role="region" aria-label="美国市场整体熔断等级，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">美国现行 MWCB 的阈值、时段和直接动作</caption>
            <thead><tr><th scope="col">等级</th><th scope="col">相对前收</th><th scope="col">正常时段动作</th><th scope="col">日内重复</th></tr></thead>
            <tbody>
              <tr><th scope="row">Level 1</th><td>−7%</td><td>尾盘边界前初始暂停 15 分钟</td><td>同级一次</td></tr>
              <tr><th scope="row">Level 2</th><td>−13%</td><td>尾盘边界前初始暂停 15 分钟</td><td>同级一次</td></tr>
              <tr><th scope="row">Level 3</th><td>−20%</td><td>任何时点停至当日结束</td><td>不再复牌</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          若前收 5,000，三级点位分别是 4,650、4,350 与 4,000。14:00 触及 Level 1 后，同日再次穿越 4,650 不会重复触发，但后来到 4,350 仍可触发 Level 2。Level 1/2 的十五分钟是初始时钟；上市市场通过 reopening auction 恢复，价格 collar 或 market-order imbalance 可造成延长，接近收盘时还可能转入 closing auction。<Cite n={1} /><Cite n={2} /><Cite n={3} />
        </p>
        <div className="precision-note"><span>15:25 整点警示</span><p>Nasdaq Rule 4121 的正文使用“up to and including 3:25”，而 2026 Nasdaq/NYSE 常见问题说明（FAQ）将边界简写为“before 3:25 / at or after 3:25”。本节不把精确 15:25:00 做成唯一答案；互动和研究编码应使用明确无争议的 15:24:59 或 15:25:01，并保存具体 venue rule version。法律/规则正文层级高于教学 FAQ。</p></div>
      </section>

      <section className="lesson-section" id="us-luld-current">
        <p className="section-kicker">34 · 美国 LULD 现行规则快照</p>
        <h2>Tier 由证券范围和前收价格桶决定参数，滚动五分钟成交均价决定当下美元价格带；报价在边界停留十五秒，才可能升级为单股暂停。</h2>
        <p>
          Tier 1 包括 S&amp;P 500、Russell 1000 和指定交易所交易产品（ETP），Tier 2 是其他符合范围的 NMS 股票。参考价为此前五分钟 Eligible Reported Transactions 的算术平均；通常至少经过三十秒且新均价偏离当前参考价达到 1%，才更新。对前收高于 3 美元的证券，日间 Tier 1 通常 ±5%，Tier 2 ±10%；低价桶有不同参数。最后二十五分钟，全部 Tier 1 与部分低价 Tier 2 的带宽加倍，不能把一张“±5%/±10%”表外推到所有价格和时段。<Cite n={4} /><Cite n={5} />
        </p>
        <p>
          触带也要按状态机读：NBB 等于上带或 NBO 等于下带且未穿越→Limit State；十五秒内相关报价成交或撤销→解除；未解除→主上市市场宣布通常五分钟 pause；pause 可延长，最后十分钟通常转向收盘处理。SEC 经济与风险分析部（DERA）的 2017 白皮书和计划年度报告显示事件在 Tier、价格和时段上高度异质，很多 limit state 是短暂流动性缺口并在十五秒内反转；描述性结果不能等于普遍福利。<Cite n={6} /><Cite n={53} />
        </p>
        <p>
          截至 2026-08-29，标准 LULD 仍以美国东部时间（ET）9:30–16:00 的正常交易时段为现行范围。SEC 8 月 5 日批准的夜间静态价格带预计 12 月 6 日启动，访问日状态是 <code>approved_not_operative</code>；“已经批准”不能被数据或教材改写成“已经上线”。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="flash-crash">
        <p className="section-kicker">35 · 2010 Flash Crash：高成交量不等于高风险承接</p>
        <h2>持续机械卖压、有限库存承接、快速回转和跨市场反馈可以同时出现；极端成交既可能是信息，也可能是流动性真空中的执行错误。</h2>
        <p>
          2010-05-06，一项约 41 亿美元的 E-mini 卖出算法按前一分钟成交量比例执行而不根据价格或时间调整；高频主体先吸收、随后快速卖回，形成 hot-potato turnover。官方重建记录期货与股票流动性迅速下降，三百多只证券出现偏离 60% 以上、随后被撤销的交易。成交笔数很多，却没有等量的长期库存承担能力。<Cite n={9} />
        </p>
        <p>
          芝加哥商业交易所（CME）的 Stop Logic 短暂停顿、事后单股暂停试点和后来 LULD 都回应了一个相对窄而重要的问题：在价格带外缺乏可靠对手方时，不要让路由继续击穿陈旧报价。但事件不是 LULD 的随机实验，不能证明“暂停造成恢复”，也不能把单一大单或高频交易（HFT）写成唯一原因。更稳健的链条是机械卖压→中介库存耗尽→快速再卖→跨市场信号互相放大→极端打印。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="march-2020">
        <p className="section-kicker">36 · March 2020：运行有序不等于因果稳定</p>
        <h2>四次 Level 1 说明全市场暂停和复牌协议能在危机中执行；它们不能提供“若没有熔断”的价格路径，也不能证明 7/13/20 是最优阈值。</h2>
        <p>
          2020 年 3 月 9、12、16、18 日分别触发 Level 1，九千多只股票同步暂停。3 月 9 日约 09:34 触发，3 月 16 日几乎开盘即触发；各日恢复后市场继续吸收疫情、经济停摆、赎回和去杠杆信息，收盘仍可大幅下跌。自律组织（SRO）工作组报告认为机制按设计运行、复牌总体有序并建议保留框架。<Cite n={11} />
        </p>
        <p>
          可靠结论是 operational coordination 成功，而非价格因果反事实。四天都由极端共同冲击选择出来，没有随机未处理日；熔断期间的均值回归、政策新闻和跨资产反应也会影响复牌。研究若用这四天估计“稳定效果”，应采用合成对照或随机化推断，并承认极低统计功效和行业报告的利益边界。
        </p>
      </section>

      <section className="lesson-section" id="china-current-limits">
        <p className="section-kicker">37 · 沪深 2026 日涨跌幅与价格笼子</p>
        <h2>当前主板（包括主板风险警示股）通常为 ±10%，科创板和创业板通常为 ±20%；连续竞价申报保护又按即时基准另算。</h2>
        <p>
          2026-07-06 生效的沪深规则废止 2023 版。沪深主板普通股票为 ±10%；主板 ST、*ST 已从旧 ±5% 调整为 ±10%；科创板和创业板及其风险警示股通常为 ±20%。限制价格以前收乘比例并按最小价位取整。前收 10.03 元、比例 10%、最小价位 0.01 元时，理论 9.027/11.033 取为 9.03/11.03；触边仍可成交，失衡才会排队。<Cite n={16} /><Cite n={17} /><Cite n={18} />
        </p>
        <p>
          日涨停价不是所有限价单都能报到的即时上限。上交所主板与深交所股票连续竞价买入一般不得高于 <code>max(买入基准价×102%, 买入基准价+10×tick)</code>，卖出一般不得低于 <code>min(卖出基准价×98%, 卖出基准价−10×tick)</code>；这里比较的是两个同量纲的价格边界，深交所条文覆盖创业板。上交所科创板仍是纯 ±2%。基准价 0.50 元时，十个 0.01 元价位可使主板/深市股票买入上限为 0.60，而科创板纯 2% 为 0.51；这正说明“板块同为 20% 日限价”不意味着盘中订单路径相同。<Cite n={16} /><Cite n={17} />
        </p>
        <p>
          北交所普通股票通常为 ±30%，上市首日无静态限价，而不是沪深的“前五日”；本节只把它作为边界提醒，完整 A 股联合微观结构留到 1.26A–B。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="china-ipo-pause">
        <p className="section-kicker">38 · 沪深 IPO 前五日与 ±30% / ±60% 临停</p>
        <h2>“无日涨跌幅”只移除以前收为中心的静态边界；相对开盘价的波动中断、申报价格保护和集合竞价规则仍然存在。</h2>
        <p>
          沪深股票首次上市后前五个交易日、重新上市首日及若干规则列明情形不设静态涨跌幅。无日限价股票若价格路径先首次触及相对开盘价的 ±30%，复牌后又首次触及同方向 ±60%，两档分别临停十分钟；若第一笔触发价格直接达到或超过 ±60%，该方向只临停一次，之后不再重复触发。开盘 20 元对应下行 14/8 元、上行 26/32 元；上下两个方向若四档都依次触发，全日最多四次。参考量是当日开盘价，不是发行价或前收。<Cite n={16} /><Cite n={17} /><Cite n={58} /><Cite n={59} />
        </p>
        <p>
          若临停跨越 14:57，按规则在 14:57 复牌并进入相应集合竞价/收盘程序。事件数据要同时保存 opening price、trigger-observed time、venue-declared time、scheduled resume 与 actual resume；把十分钟写成固定成交空窗会遗漏延长、跨午休和收盘特殊处理。
        </p>
      </section>

      <section className="lesson-section" id="china-current-t1">
        <p className="section-kicker">39 · 沪深 2026 回转交易与交收层级</p>
        <h2>普通 A 股当日新买批次不能卖；规则列明的回转产品可能 T+0；参与人证券与资金交收又有自己的批次和锁定逻辑。</h2>
        <p>
          两所第 3.1.4 条都规定买入证券在交收前不得卖出，但实行回转交易的除外。第 3.1.5 条列出债券 ETF、上市/交易型货币市场基金、黄金 ETF、商品期货 ETF，以及满足标的回转条件的部分跨境 ETF/LOF 等；不能说“所有 ETF 都 T+0”。B 股又是次交易日起回转。数据必须给每个 instrument 保存 turnaround category 和生效规则，而不是按“股票/基金”粗分。<Cite n={16} /><Cite n={17} />
        </p>
        <p>
          中国结算深圳分公司现行指南展示了 T 日日终证券处理、资金不足时的可售交收锁定，以及 T+1 多批次资金交收；它不能被压缩成“所有证券与现金都到 T+1 才一次性交收”。投资者卖出资格由交易所条款和产品规则决定，结算参与人的违约管理则是后交易层。<Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="china-2016">
        <p className="section-kicker">40 · 中国 2016 指数熔断：历史规则，不是现行制度</p>
        <h2>沪深 300 相对前收达到 ±5% 通常停十五分钟、±7% 停至收盘；阈值过近与早收盘激励在四个政策日内迅速暴露。</h2>
        <p>
          当时规则方向对称：14:45 前首次达到 ±5% 通常暂停十五分钟，较晚触发则停至收盘；达到 ±7% 直接停至收盘。2016-01-04 13:12 触及 −5%，13:27 恢复，13:33 触及 −7%；1 月 7 日 09:42 触及 −5%，09:57 恢复，09:58 即触及 −7%。机制自 1 月 8 日起暂停，不能写进 2026 现行规则。<Cite n={21} /><Cite n={22} />
        </p>
        <p>
          证监会事后认为 5% 与 7% 距离较近、7% 后直接收市等安排使负面与磁吸作用超过预期正面作用。高频研究也报告触发前收益、订单和报价失衡加速，但只有四个政策交易日，且人民币、宏观与风险偏好冲击重叠；Lasso-IV 或相似极端日都不能把它变成干净自然实验。最可靠用途是机制诊断，而非“一切熔断必然失败”的外推。<Cite n={23} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-comparison">
        <p className="section-kicker">阶段五 · 证据与识别　|　41 · 为什么文献会得出相反结论</p>
        <h2>表面冲突通常来自不同 treatment、不同时间窗、不同波动定义和不同选择条件；先统一 estimand，才能比较论文。</h2>
        <div className="table-scroll" role="region" aria-label="交易约束研究结论差异的来源，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">研究对象、常见结果与主要识别边界</caption>
            <thead><tr><th scope="col">研究对象</th><th scope="col">可支持的较强事实</th><th scope="col">仍不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">触限事件</th><td>触发前订单、触发后延续/反转的条件动态</td><td>规则造成事件的净因果</td></tr>
              <tr><th scope="row">近触限对照</th><td>不同接近路径的差异</td><td>随机阈值实验</td></tr>
              <tr><th scope="row">规则前后</th><td>制度与市场质量共同变化</td><td>排除同期改革与成熟度</td></tr>
              <tr><th scope="row">A/H、股票/衍生品</th><td>外部 shadow price 与相对误差</td><td>完全相同的资产与投资者</td></tr>
              <tr><th scope="row">危机案例</th><td>运行时序、订单与协调机制</td><td>无规则时的反事实福利</td></tr>
              <tr><th scope="row">随机实验室</th><td>给定环境的内部因果</td><td>现实机构、杠杆与跨场外推</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Kim–Liu–Yang 用中国长期制度期报告更快价格发现与较低暂时波动，Kim–Rhee 与多项订单簿研究却支持延迟和干扰；Guo–Li–Tu 报告 T+1 后更低成交量与波动，Wu–Qin 的 A/B DiD 和 ETF 研究则发现更宽价差或较低效率。前者常跨越重大共同制度变化，后者也有平行趋势、产品结构与外部效度限制。专业结论应保留“在哪个样本、对什么结果、相对什么反事实”，不能以票数决定监管真伪。<Cite n={30} /><Cite n={40} /><Cite n={41} /><Cite n={51} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="data-protocol">
        <p className="section-kicker">42 · Rule-version 与 event-time 数据协议</p>
        <h2>规则是带生效区间的状态，不是证券的永久属性；最小数据必须把参考价、订单资格、触发、停复牌、可售库存与结算分开。</h2>
        <div className="learning-objectives">
          <span>可复算最小 schema</span>
          <ol>
            <li><b>Rule snapshot：</b>rule_id、venue、mechanism、section、version、effective_from/to、operative / approved / suspended / repealed、source URL 与访问日。</li>
            <li><b>Instrument scope：</b>asset、board、Tier、risk-warning、IPO day、tick、previous close、turnaround category 与公司行动。</li>
            <li><b>Reference state：</b>prior close、rolling window、open 或 book benchmark，reference timestamp、band、rounding rule 与 distance-to-trigger。</li>
            <li><b>Event clock：</b>trigger observed、venue declared、证券信息处理器（SIP）disseminated、halt start、scheduled resume、actual resume、extension 与 reopen method。</li>
            <li><b>Order / queue：</b>side、price、accept/reject reason、逐笔委托撤单成交、至少 20 档深度、indicative clearing price 与 imbalance。</li>
            <li><b>Eligibility / settlement：</b>prior inventory、same-day buys、sellable quantity、contract settlement date、cash/securities delivery、lock 与 fail。</li>
            <li><b>External state：</b>期货、ETF、A/H/ADR、期权映射，消息 surprise、融资、保证金、账户组合与可卖空性。</li>
          </ol>
        </div>
        <p>
          时间戳要同时保存本地时间、互联网号码分配机构（IANA）标准时区名称与协调世界时（UTC）；美国不能固定写 UTC−5，因为夏令时会变化。2016 中国事件使用 Asia/Shanghai，MWCB 使用 America/New_York。尤其要分开 scheduled 与 actual resume，否则“初始十五分钟”会被错误编码为所有证券真实停牌十五分钟。
        </p>
      </section>

      <section className="lesson-section" id="identification-designs">
        <p className="section-kicker">43 · 五类可证伪识别设计</p>
        <h2>阈值本身由价格和订单共同生成，普通断点回归设计（RDD）往往无效；更可信的设计利用规则变化、影子价格、库存批次和同步性差异。</h2>
        <div className="table-scroll" role="region" aria-label="交易约束的因果识别设计，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">五类研究设计、识别对象和关键安慰剂</caption>
            <thead><tr><th scope="col">设计</th><th scope="col">处理 variation</th><th scope="col">核心 outcome</th><th scope="col">Placebo / 威胁</th></tr></thead>
            <tbody>
              <tr><th scope="row">影子价格工具</th><td>H 股/期货等预测是否越界</td><td>队列、误差、跨日发现</td><td>伪阈值；弱映射与币种差异</td></tr>
              <tr><th scope="row">价格带改革三重差分（DDD）</th><td>板块×前后×改革前绑定概率</td><td>价差、延迟、永久/暂时波动</td><td>伪日期；同期注册制</td></tr>
              <tr><th scope="row">LULD 风险集</th><td>相似路径中 15 秒解除 vs pause</td><td>错误成交、深度、复牌稳定</td><td>pseudo bands；撤单内生决定处理</td></tr>
              <tr><th scope="row">T+1 库存事件</th><td>同一账户今日新买 vs 既有可售</td><td>折价、纠错、次日解锁卖出</td><td>昨日库存；买入选择性</td></tr>
              <tr><th scope="row">跨市场同步差</th><td>主市场/卫星市场单独或同步暂停</td><td>信息份额、basis、活动迁移</td><td>假时点；固有 lead–lag</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          2016 中国熔断只有四个政策日，适合预先选定的合成对照、精确时序与随机化推断，不适合依赖大样本标准误。创业板 10%→20% 同时遇到注册制改革，必须用动态预趋势、改革前 binding propensity 和多重负对照。LULD 是否暂停又由十五秒内撤单和成交共同决定，直接在阈值两侧做普通断点回归会把参与者行为当随机 assignment。
        </p>
      </section>

      <section className="lesson-section" id="falsification">
        <p className="section-kicker">44 · 竞争机制与反例库</p>
        <h2>一条合格结论必须提前说明什么结果会使它失败；否则任何延续、反转、低波动或高波动都能被事后解释。</h2>
        <div className="table-scroll" role="region" aria-label="稳定与压力迁移机制的证伪预测，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">机制、预测和推翻它的观测</caption>
            <thead><tr><th scope="col">机制</th><th scope="col">应观察到</th><th scope="col">使其变弱的反例</th></tr></thead>
            <tbody>
              <tr><th scope="row">Cooling-off</th><td>外部误差缩小、失衡消散、低迁移</td><td>外部市场继续同向、次日追赶</td></tr>
              <tr><th scope="row">Magnet</th><td>真实阈值附近额外加速</td><td>伪阈值同样强、规则前也存在</td></tr>
              <tr><th scope="row">Delay</th><td>影子价格先动、受限价随后收敛</td><td>影子价格同步反转且队列消失</td></tr>
              <tr><th scope="row">Liquidity protection</th><td>错误成交少、逆势 fill/depth 改善</td><td>只减少成交，复牌 impact 更大</td></tr>
              <tr><th scope="row">T+1 lockup</th><td>只在今日新买批次、次日解锁释放</td><td>既有库存和 T+0 产品同样表现</td></tr>
              <tr><th scope="row">Margin contagion</th><td>受限资产占比×距强平线预测他股卖出</td><td>无杠杆账户出现相同组合通道</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最可证伪的总命题是：<b>规则若真正消除暂时性错误，受限市场相对外部价值的误差、未成交失衡和后续迁移应一起下降；规则若主要延期永久调整，观测即时波动会下降，但队列、复牌/次日追赶、外部信息份额或资产负债表转移至少一项上升。</b>两种结果都未出现时，应放弃“规则是原因”，转而检查共同新闻、样本选择与测量错误。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">阶段六 · 迁移与诊断　|　45 · 互动实验</p>
        <h2>Mode A 先复算规则引擎；Mode B 再追踪观察价格之外的队列、跨日、账户资格和跨市场资产负债表。</h2>
        <p>
          八个冻结情境依次检验：美国 MWCB 三级阈值与复牌边界；Tier 1 LULD 正常/尾盘带宽和 Limit State；沪深主板价格单位取整与“触边仍可成交”；IPO 前五日 ±30%/±60% 临停；潜在价值在日限价下的跨日限界删失；中国回转限制与美国结算 T+1；2016 历史熔断；以及现货受限后期货基差与保证金传染。答案先锁定后揭示，刷新或离开页面会清空当前进度。
        </p>
        <TradingConstraintLab />
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">46 · 六道独立复算题</p>
        <h2>这些题不复用互动答案；它们把规则参数迁移到新的价格、时点、账户和识别设计，检验你是否真正掌握状态变量。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · 尾盘 MWCB</span><p>S&amp;P 500 前收 6,000。15:26:00 ET 首次跌到 5,220，15:50 又跌到 4,800。按交易所 FAQ 的无争议时点口径，分别判断动作，并说明为何不能把两个阈值都写成十五分钟暂停。</p><details className="practice-answer"><summary>展开核对答案</summary><p>5,220=6,000×(1−13%)，但 15:26 已在 Level 1/2 尾盘窗口之后，不触发 Level 2 暂停；4,800=6,000×(1−20%)，Level 3 在任何时点触发并结束当日交易。Level 3 从来不是十五分钟暂停。15:25:00 的文本冲突被题目刻意避开。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 低价 LULD</span><p>某证券前收 0.60 美元，午间滚动 Reference Price=0.80 美元，适用低价桶：带宽为 0.15 美元与参考价 75% 中较小者。求价格带；若 NBO=0.65 持续 12 秒后撤销，是否进入五分钟 pause？</p><details className="practice-answer"><summary>展开核对答案</summary><p>带宽=min(0.15,0.80×75%)=0.15，因此下/上带为 0.65/0.95。NBO 等于下带可进入下限 Limit State，但 12 秒即撤销、未持续满 15 秒，按题设不进入五分钟 Trading Pause。触带、Limit State 与 pause 是三个不同事件。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 日涨停与价格笼子并行</span><p>沪深主板股票前收 10 元，故日涨停 11 元；连续竞价买入基准价也是 10 元，tick=0.01 元。买入有效申报上限取 max(102%×基准价，基准价+10×tick)。10.21 元买单为什么仍会无效？</p><details className="practice-answer"><summary>展开核对答案</summary><p>价格笼子上限=max(10×1.02,10+0.10)=10.20。10.21 虽低于日涨停 11，却高于即时有效申报上限，因此无效。日边界回答“今日最远成交价”，价格笼子回答“此刻可提交多激进的限价单”。</p></details></article>
          <article className="practice-problem"><span>练习 04 · 低价股票的板块差异</span><p>买入基准价 0.50 元、tick=0.01，且日涨跌幅不是更紧约束。求上交所主板/深交所股票采用“2%或十个价位孰宽”时的上限，以及上交所科创板纯 2% 时的上限。</p><details className="practice-answer"><summary>展开核对答案</summary><p>主板/深市股票：max(0.50×1.02,0.50+0.10)=max(0.51,0.60)=0.60。科创板纯 2% 为 0.51。创业板属于深交所统一条文，不能凭旧印象把它和科创板一起写成纯 ±2%。</p></details></article>
          <article className="practice-problem"><span>练习 05 · 可售库存与产品例外</span><p>账户开盘有普通 A 股可售 800 股和一只符合当日回转条件的跨境 ETF 500 份；今日又买 A 股 300 股、ETF 400 份。忽略其他冻结，求两种证券当日最多可卖数量。</p><details className="practice-answer"><summary>展开核对答案</summary><p>普通 A 股今日新买批次不能当日卖，最多卖原有 800 股；题设跨境 ETF 明确符合回转条件，最多可卖 500+400=900 份。不能把“ETF”名称本身当作 T+0，必须有具体产品资格。</p></details></article>
          <article className="practice-problem"><span>练习 06 · 改革 DiD 只是起点</span><p>价格带放宽后，处理板块价差从 12 bp 降到 9 bp，对照板块从 10 bp 降到 9 bp。求简化 DiD；再写出两个不能立即称为价格带因果的理由。</p><details className="practice-answer"><summary>展开核对答案</summary><p>DiD=(9−12)−(9−10)=−2 bp，表示处理组相对多收窄 2 bp。仍需验证改革前平行趋势；若同期有注册制、tick、投资者准入或做市变化，它们会共同影响；处理强度还应集中在改革前常触及旧边界的证券，否则平均结果缺少机制。</p></details></article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">47 · 十项理解检查</p>
        <h2>如果任何一题只能用“规则降低波动”回答，就说明仍需退回作用对象、参考价、直接动作与残余压力四个接口。</h2>
        <div className="check-grid">
          <details><summary>01 · 涨跌停为什么不等于停牌？</summary><p>日价格限制禁止越界成交，但边界价内和边界价本身仍可撮合；只有缺少反向对手方时才形成事实不可成交。停牌则暂时停止撮合。</p></details>
          <details><summary>02 · 当日实现波动下降为何不能直接说明尾部风险下降？</summary><p>硬边界把超界潜在收益限界删失为边界观察；未完成调整可能进入队列、复牌、次日或关联市场。要同时估计影子价格误差、等待和外溢。</p></details>
          <details><summary>03 · MWCB 与 LULD 的核心区别是什么？</summary><p>MWCB 由广义指数相对前收触发并协调全市场；LULD 围绕单只 NMS 股票的滚动参考价设带，先有 Limit State，持续后才暂停。</p></details>
          <details><summary>04 · “十五分钟熔断”为何不保证第十五分钟成交？</summary><p>十五分钟是初始制度时钟；主上市市场还要通过复牌拍卖，价格 collar、订单失衡、系统和尾盘程序都可能推迟实际复牌。</p></details>
          <details><summary>05 · 美国与中国语境中的 T+1 为什么不同？</summary><p>美国标准 T+1 是成交合同的次营业日交付期限；中国普通 A 股约束的是新买批次交收前的卖出资格。资金可用性和产品例外还需另查。</p></details>
          <details><summary>06 · 怎样区分真正 cooling 与单纯 delay？</summary><p>真正 cooling 应伴随外部价值误差和订单失衡收缩、后续迁移较少；若外部市场先动、复牌或次日追赶，更符合延期发现。</p></details>
          <details><summary>07 · 为什么距阈值的普通 RDD 不可靠？</summary><p>价格、撤单和订单失衡共同决定是否触发，交易者还会预见阈值；运行变量与处理都内生。应结合影子价格、规则变化、风险集和伪阈值。</p></details>
          <details><summary>08 · 价格笼子与日涨跌幅分别限制什么？</summary><p>日涨跌幅限制全天可成交价格集合；价格笼子限制一笔新限价申报相对即时盘口基准的激进程度。二者可同时约束同一订单。</p></details>
          <details><summary>09 · 现货受限后做空期货为何可能增加系统风险？</summary><p>它替代现货卖出并提供 hedge，却引入基差、逐日盯市和保证金现金需求；缺现金者可能出售其他流动资产，形成跨资产传染。</p></details>
          <details><summary>10 · 评价一项交易规则的最小证据链是什么？</summary><p>先识别规则版本和作用对象，再观察目标交易、可执行/未成交部分、暂停期信息与订单、复牌/次日路径、替代市场和资产负债表反馈，并构造可信反事实。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">48 · 课程接口</p>
        <h2>本节把市场微观结构中的“规则”从背景条件变成动态状态；下一步要把这些状态嵌入 A 股联合制度、监管目标和系统脆弱性。</h2>
        <div className="interface-grid">
          <article><span>← 1.02</span><h3>交易如何变成价格</h3><p>输入订单、报价、成交、深度与价格发现的基本语言；本节加入可执行集合和交易时钟。</p></article>
          <article><span>← 1.17</span><h3>Opening / Closing Auction</h3><p>输入最大成交量、失衡和清算价；本节用于熔断、临停和消息停牌后的复牌。</p></article>
          <article><span>← 1.20</span><h3>Leverage / Margin</h3><p>输入维持保证金、强制平仓和共同持仓反馈；本节说明交易受限如何转化成组合级现金压力。</p></article>
          <article><span>← 1.22</span><h3>Futures Basis / Cash–Futures Arbitrage</h3><p>输入期货、ETF、现货与 basis；本节说明主市场受限后价格发现和 hedge 怎样迁移。</p></article>
          <article><span>→ 1.26A–B</span><h3>A 股微观结构特征</h3><p>输出沪深 2026 日限价、价格笼子、IPO 临停、回转资格和板块差异，供联合制度分析。</p></article>
          <article><span>→ 5.05</span><h3>Regulation</h3><p>输出“操作有序、错误成交、价格效率、流动性和福利”五类不同监管目标与测量边界。</p></article>
          <article><span>→ 7.14</span><h3>Fragility</h3><p>输出队列、复牌、保证金、不可售资产与跨市场迁移，解释局部规则如何进入系统传染。</p></article>
        </div>
        <div className="precision-note"><span>给 1.26A–B 的边界</span><p>本节只建立共同机制并核对必要的沪深现行规则；1.26A–B 将系统整合 A 股板块、竞价时段、申报保护、卖空/融资融券、北交所和投资者结构，不在这里重复展开。</p></div>
      </section>

      <section className="lesson-section" id="closing-thesis">
        <p className="section-kicker">49 · 结课诊断</p>
        <h2>面对任何“某项交易制度是否稳定市场”的问题，先问它改变了哪一种自由，再追踪被阻止的边际交易究竟是错误、信息、流动性供给还是被迫风险转移。</h2>
        <p className="closing-thesis">
          第一步，重建规则语法。写明作用对象是全市场还是单证券，参考量是前收、滚动成交均价、开盘价还是盘口基准，直接动作是拒绝申报、禁止带外成交、暂停撮合、限制新买批次卖出，还是把交券付款缩短到下一营业日。没有这一步，“熔断”“涨停”和“T+1”只是会混淆因果的标签。
          <br /><br />
          第二步，重建执行与残余状态。观察实际成交、边界队列、撤单、复牌拍卖、次日价格带重置、可售库存、期货/ETF/海外价格与保证金。规则可能消灭误单，也可能只是把永久信息从即时价格迁到队列、复牌、次日或另一资产；“压力迁移”必须用这些中介量证明，不能从一段低波动倒推。
          <br /><br />
          第三步，建立反事实和证伪。触限事件是极端冲击内生选择出来的，复牌高波动不证明停牌造成波动，复牌有序也不证明熔断稳定价格。只有当真实阈值相对伪阈值、处理规则相对可信对照、今日新买库存相对既有库存、受限市场相对外部影子价格呈现机制一致的差异，才能把制度从故事变成可检验的因果模型。做到这一步，监管不再是“稳定或扭曲”的二选一，而是一个随信息、流动性、杠杆、替代市场和时间尺度变化的动态控制问题。
        </p>
      </section>
    </>
  );
}

export const lesson125: LessonRecord = {
  slug: '1-25',
  id: '1.25',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Circuit Breaker、Price Limit 与 T+1',
  subtitle: '从全市场熔断、Limit Up–Limit Down（LULD）单股动态价格带、静态日涨跌幅与盘中波动中断出发，严格区分结算 T+1 和当日回转限制，并追踪规则如何通过队列、复牌、次日、关联市场与资产负债表稳定或迁移交易压力',
  readingTime: '主线首读约 100–120 分钟；零背景完整学习建议分两次，共约 175–215 分钟（含互动实验与练习；参考文献和延伸阅读不计）',
  prerequisite: '硬先修：1.02 · Market Architecture；按需回看：1.04 · Limit Order Book、1.06 · Liquidity、1.17 · Opening / Closing Auction、1.20 · Leverage / Margin、1.22 · Futures Basis / Cash–Futures Arbitrage',
  updatedAt: '2026-08-29',
  revision: '1.25-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.25-r1',
      summary: '首轮教学终审确认 50 单元因果链、互动、练习、检查和阅读时长成立；要求修正三处课程接口与卖出价格笼子量纲，补足多日跌停公式条件、限界删失术语、首见缩写和单链接阅读卡。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.25-r1',
      summary: '首轮准确性终审复算美国与中国规则、八个互动和六道练习；要求写清无日限价股票直接越过 60% 时同方向仅临停一次，并纠正五条官方文件或论文元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.25-r2',
      summary: '回归教学终审确认全部 P1 和 IPO 路径边界闭合；仅要求将互动中的 censoring 中文统一为限界删失，并补齐 NYSE、IPO、SEC、FAQ、DERA、ET、IANA/UTC、RD、DiD 与 PSM-DiD 的首次桥接。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.25-r2',
      summary: '回归准确性终审确认 IPO 直接越过 60% 的临停路径、五条元数据、价格笼子量纲、多日公式条件、59 条来源、133 个引用、六道练习和八个互动全部准确，无 P0/P1/P2。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.25-r3',
      summary: '终审确认互动与正文的限界删失术语一致，首见缩写桥接完整；50 节认知坡度、24 张阅读卡、六道练习、十项检查、八题互动、课程接口和版本账本均达到出版要求，无 P0/P1/P2。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.25-r3',
      summary: '终审确认规则、公式、IPO 路径、互动唯一答案、练习、识别边界及 59 条来源与 133 个引用均无回归；术语与缩写编辑没有改变技术含义，无 P0/P1/P2。',
    },
  ],
  previous: { slug: '1-24', label: '1.24 Delta / Gamma Hedging 的反馈机制' },
  next: { slug: '1-26', label: '1.26A A 股交易时钟、价格边界与库存约束' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整因果回路' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'taxonomy', label: '七类制度语法' },
    { id: 'order-quote-trade-queue', label: 'Order / Quote / Trade / Queue' },
    { id: 'market-wide-breaker', label: 'Market-wide Breaker' },
    { id: 'security-halt', label: 'Single-security Halt' },
    { id: 'luld', label: 'LULD State Machine' },
    { id: 'daily-price-limit', label: 'Static Daily Limit' },
    { id: 'volatility-interruption', label: 'Price Collar / Interruption' },
    { id: 'settlement-t1', label: 'T+1 Settlement' },
    { id: 'holding-t1', label: '当日回转限制' },
    { id: 'two-t1s', label: '两种 T+1' },
    { id: 'cooling-off', label: 'Cooling-off' },
    { id: 'information-production', label: 'Information Production' },
    { id: 'coordination-reopening', label: 'Coordination / Reopening' },
    { id: 'liquidity-replenishment', label: 'Liquidity Replenishment' },
    { id: 'operational-error', label: 'Operational Error' },
    { id: 'stabilization-conditions', label: '稳定的状态条件' },
    { id: 'latent-observed-volatility', label: 'Latent vs Observed' },
    { id: 'censoring-truncation', label: 'Censoring（限界删失）' },
    { id: 'magnet-effect', label: 'Magnet Effect' },
    { id: 'execution-race', label: 'Execution Race' },
    { id: 'limit-queue', label: 'Limit Queue' },
    { id: 'liquidity-interference', label: 'Liquidity Interference' },
    { id: 'price-discovery-delay', label: 'Price-discovery Delay' },
    { id: 'volatility-spillover', label: 'Volatility Spillover' },
    { id: 'reopen-next-day', label: 'Reopen / Next Day' },
    { id: 'cross-market-migration', label: 'Cross-market Migration' },
    { id: 'derivatives-basis', label: 'Derivatives / Basis' },
    { id: 'leverage-margin', label: 'Leverage / Margin' },
    { id: 't1-trapped-inventory', label: 'T+1 Trapped Inventory' },
    { id: 'heterogeneity-asymmetry', label: 'Heterogeneity / Asymmetry' },
    { id: 'us-mwcb-current', label: '美国 MWCB 现行规则' },
    { id: 'us-luld-current', label: '美国 LULD 现行规则' },
    { id: 'flash-crash', label: '2010 Flash Crash' },
    { id: 'march-2020', label: 'March 2020' },
    { id: 'china-current-limits', label: '沪深 2026 价格边界' },
    { id: 'china-ipo-pause', label: 'IPO ±30% / ±60%' },
    { id: 'china-current-t1', label: '沪深回转与交收' },
    { id: 'china-2016', label: '2016 历史熔断' },
    { id: 'evidence-comparison', label: '证据为何冲突' },
    { id: 'data-protocol', label: '数据与事件时钟' },
    { id: 'identification-designs', label: '识别设计' },
    { id: 'falsification', label: '反例与证伪' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice', label: '六道复算题' },
    { id: 'checks', label: '十项理解检查' },
    { id: 'interfaces', label: '课程接口' },
    { id: 'closing-thesis', label: '结课诊断' },
  ],
  Content: Lesson125Content,
  references: [
    { id: 1, authors: 'New York Stock Exchange', year: '2026', accessedAt: '2026-08-29', title: 'Market-Wide Circuit Breakers Frequently Asked Questions, Version 4.0', publication: 'NYSE Official FAQ, February 2026', url: 'https://www.nyse.com/publicdocs/nyse/NYSE_MWCB_FAQ.pdf', use: '核验美国 MWCB 7/13/20% 阈值、尾盘处理、同级单日一次及 NYSE 复牌拍卖；FAQ 与 Nasdaq 条文在 15:25 整点措辞有冲突，不能替代具体规则文本。' },
    { id: 2, authors: 'Nasdaq, Inc.', year: '2026', accessedAt: '2026-08-29', title: 'Market-Wide Circuit Breakers Frequently Asked Questions', publication: 'Nasdaq Trader Official FAQ', url: 'https://m.nasdaqtrader.com/content/marketregulation/mwcb_faq.pdf', use: '核验 Nasdaq MWCB 停复牌、拍卖延长和尾盘流程；实务应与 Rule 4121 共同读取。' },
    { id: 3, authors: 'The Nasdaq Stock Market LLC', year: 'current', accessedAt: '2026-08-29', title: 'Nasdaq Equity 4, Rule 4121: Trading Halts Due to Extraordinary Market Volatility', publication: 'Official Nasdaq Rulebook', url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/Nasdaq%20Equity%204', use: '提供 MWCB 正式规则层级、15:25 条文、初始停牌、延长和复牌条件；页面会随规则修订。' },
    { id: 4, authors: 'Operating Committee of the National Market System Plan to Address Extraordinary Market Volatility', year: 'current', accessedAt: '2026-08-29', title: 'Limit Up-Limit Down Plan: Official Overview', publication: 'LULD Plan Official Site', url: 'https://www.luldplan.com/', use: '核验 Tier、五分钟滚动参考价、价格桶、Limit/Straddle State、十五秒时钟、pause 与尾盘倍宽。' },
    { id: 5, authors: 'Participants in the LULD Plan', year: 'current', accessedAt: '2026-08-29', title: 'Plan to Address Extraordinary Market Volatility, as Amended through the Twenty-Third Amendment', publication: 'Official NMS Plan Text', url: 'https://cdn.luldplan.com/plans/LULD-Plan-23rd-Amendment.pdf', use: '提供 LULD 法定计划文本及状态定义；具体附录、证券名单和后续修订必须按事件日版本保存。' },
    { id: 6, authors: 'LULD Plan Operating Committee', year: '2025', accessedAt: '2026-08-29', title: '2024 Annual Report of the Plan to Address Extraordinary Market Volatility', publication: 'Official Annual Report', url: 'https://cdn.luldplan.com/reports/LULD-2024-Annual-Report.pdf', use: '提供 LULD 事件分布和运行数据背景；年度描述不能单独识别规则因果福利。' },
    { id: 7, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-29', title: 'Release No. 34-106042: Order Approving Amendment No. 27 to the LULD Plan', publication: 'SEC, 5 August 2026', url: 'https://www.sec.gov/files/rules/sro/nms/2026/34-106042.pdf', use: '核验夜间价格带已批准但预计 2026-12-06 才启动；访问日不得标记为 operative。' },
    { id: 8, authors: 'The Nasdaq Stock Market LLC', year: 'current', accessedAt: '2026-08-29', title: 'Nasdaq Equity 4, Rule 4120: Limit Up-Limit Down and Trading Halts', publication: 'Official Nasdaq Rulebook', url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/Nasdaq%20Equity%204', use: '区分 LULD pause 与重大消息、上市资格、监管和运营类停牌，并核验复牌依赖交易所判断。' },
    { id: 9, authors: 'CFTC & SEC Staff', year: '2010', title: 'Findings Regarding the Market Events of May 6, 2010', publication: 'Joint Official Staff Report, 30 September 2010', url: 'https://www.sec.gov/news/studies/2010/marketevents-report.pdf', use: '重建 Flash Crash 的机械卖压、库存快速回转、流动性撤出、跨市场反馈与极端成交；事件研究不提供 LULD 反事实。' },
    { id: 10, authors: 'U.S. Securities and Exchange Commission', year: '2010', title: 'SEC Approves Rules to Expand Stock-by-Stock Circuit Breakers and Clarify Process for Breaking Erroneous Trades', publication: 'SEC Press Release 2010-216', url: 'https://www.sec.gov/news/press/2010/2010-216.htm', use: '记录 Flash Crash 后单股暂停和异常成交处理的制度响应；不是现行 LULD 全部规则。' },
    { id: 11, authors: 'Market-Wide Circuit Breaker Working Group', year: '2021', title: 'Report Regarding the March 2020 Market-Wide Circuit Breaker Events', publication: 'SRO Working Group Report filed with SEC', url: 'https://www.sec.gov/files/rules/sro/nyse/2021/34-92428-ex3.pdf', use: '提供 2020 四次 Level 1 时序、覆盖与操作复牌结果；行业工作组报告没有无熔断反事实。' },
    { id: 12, authors: 'U.S. Securities and Exchange Commission', year: '1998', title: 'Trading Analysis of October 27 and 28, 1997', publication: 'Division of Market Regulation Official Report', url: 'https://www.sec.gov/news/studies/tradrep.htm', use: '支持旧点数阈值首次触发、提前收市、前置交易和压力迁移的官方历史讨论；市场结构已显著变化。' },
    { id: 13, authors: 'Federal Reserve History', year: '2013', accessedAt: '2026-08-29', title: 'Stock Market Crash of 1987', publication: 'Federal Reserve History', url: 'https://www.federalreservehistory.org/essays/stock-market-crash-of-1987', use: '提供 1987 崩盘、系统超负荷和后来协调熔断框架的历史背景；不是现行阈值依据。' },
    { id: 14, authors: 'U.S. Securities and Exchange Commission', year: '2024', accessedAt: '2026-08-29', title: 'T+1 Settlement Cycle: Frequently Asked Questions', publication: 'SEC Division of Trading and Markets', url: 'https://www.sec.gov/exams/educationhelpguidesfaqs/t1-faq', use: '核验美国标准结算自 2024-05-28 缩短为 T+1，并区分合同结算与交易资格。' },
    { id: 15, authors: 'Financial Industry Regulatory Authority', year: '2024', accessedAt: '2026-08-29', title: 'Regulatory Notice 24-13: FINRA Requests Comment on the Effectiveness and Efficiency of its Requirements Relating to Day Trading', publication: 'FINRA Official Notice', url: 'https://www.finra.org/rules-guidance/notices/24-13', use: '第 14 问明确现金账户用已付清资金买入的证券可同日卖出；账户资金、freeriding 与 margin 仍另受规则约束。' },
    { id: 16, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所交易规则（2026年修订）', publication: '上证发〔2026〕41号，2026-07-06施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml', use: '核验上交所日涨跌幅、无日限价情形、临停、价格笼子、回转交易与版本废止；规则随修订时变。' },
    { id: 17, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '深圳证券交易所交易规则（2026年修订）', publication: '深证上〔2026〕551号，2026-07-06施行', url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf', use: '核验深市主板/创业板涨跌幅、IPO前五日、±30/±60临停、全股票价格笼子及回转品种。' },
    { id: 18, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上交所修订发布《上海证券交易所交易规则》', publication: 'Official Policy Explanation, 24 April 2026', url: 'https://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20260424_10816474.shtml', use: '核验主板风险警示股票自 2026-07-06 由 5% 调整为 10%；旧资料已失效。' },
    { id: 19, authors: '北京证券交易所', year: 'current', accessedAt: '2026-08-29', title: '北京证券交易所交易规则与交易管理', publication: 'Official Current Rules Portal', url: 'https://www.bse.cn/jygl_list/200028217.html', use: '支持北交所普通股票通常 ±30%、上市首日无静态限制等边界；具体产品与事件日应读取当期正式规则。' },
    { id: 20, authors: '中国证券登记结算有限责任公司深圳分公司', year: '2026', accessedAt: '2026-08-29', title: '中国结算深圳分公司关于修订并发布《中国证券登记结算有限责任公司深圳分公司证券资金结算业务指南》的通知', publication: 'Official Notice and Guide, effective 10 August 2026', url: 'https://www.chinaclear.cn/zdjs/szfgsgg/202607/88b2e21f07e1417da56150f04bcff839.shtml', use: '支持深圳参与人证券处理、可售交收锁定与 T+1 多批次资金交收；不能外推成所有中国业务的单一时点。' },
    { id: 21, authors: '深圳证券交易所', year: '2015', title: '关于修订《深圳证券交易所交易规则》新增第四章第六节的通知', publication: '深证会〔2015〕389号，历史规则', url: 'https://www.szse.cn/aboutus/trends/news/t20151204_518655.html', use: '核验 2016 历史沪深300 ±5%/±7%、十五分钟、尾盘与跨午休安排；该机制现已暂停。' },
    { id: 22, authors: '上海证券交易所', year: '2016', title: '关于暂停实施指数熔断机制的通知', publication: '上证发〔2016〕4号', url: 'https://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20160107_4033450.shtml', use: '核验指数熔断自 2016-01-08 暂停，不能作为现行规则。' },
    { id: 23, authors: '中国证券监督管理委员会', year: '2016', title: '证监会新闻发言人邓舸就指数熔断机制相关问题答记者问', publication: 'CSRC Official Q&A, 7 January 2016', url: 'https://www.csrc.gov.cn/csrc/c100028/c1001795/content.shtml', use: '记录监管者对阈值过近、提前交易与磁吸效应的事后判断；不是严格因果识别。' },
    { id: 24, authors: 'Avanidhar Subrahmanyam', year: '1994', title: 'Circuit Breakers and Market Volatility: A Theoretical Perspective', publication: 'Journal of Finance, 49(1), 237–254', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb04427.x', use: '形式化可预见停市导致交易前置和卫星市场迁移；理论模型不证明现实磁吸的净福利。' },
    { id: 25, authors: 'Hui Chen, Anton Petukhov, Jiang Wang & Hao Xing', year: '2024', title: 'The Dark Side of Circuit Breakers', publication: 'Journal of Finance, 79(2), 1405–1455', url: 'https://doi.org/10.1111/jofi.13310', use: '结合跨期均衡和 E-mini 高频数据研究距阈值状态、交易活动与福利；结构结论依赖风险分担和投机参数。' },
    { id: 26, authors: 'Charles M. C. Lee, Mark J. Ready & Paul J. Seguin', year: '1994', title: 'Volume, Volatility, and New York Stock Exchange Trading Halts', publication: 'Journal of Finance, 49(1), 183–214', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb04425.x', use: '历史 pseudohalt 匹配显示复牌后成交量与波动仍高；消息停牌内生，不能直接归因。' },
    { id: 27, authors: 'Shane A. Corwin & Marc L. Lipson', year: '2000', title: 'Order Flow and Liquidity around NYSE Trading Halts', publication: 'Journal of Finance, 55(4), 1771–1801', url: 'https://doi.org/10.1111/0022-1082.00267', use: '用订单级数据显示停牌期提交撤单、复牌清算价信息与有限近价深度；历史 specialist 市场限制外推。' },
    { id: 28, authors: 'Michael A. Goldstein & Kenneth A. Kavajecz', year: '2004', title: 'Trading Strategies during Circuit Breakers and Extreme Market Movements', publication: 'Journal of Financial Markets, 7(3), 301–333', url: 'https://doi.org/10.1016/j.finmar.2003.11.003', use: '1997 单一事件订单簿揭示提前交易、场所迁移和次日深度恢复不足；现代电子结构不同。' },
    { id: 29, authors: 'Nikolaus Hautsch & Akos Horvath', year: '2019', title: 'How Effective Are Trading Pauses?', publication: 'Journal of Financial Economics, 131(2), 378–403', url: 'https://doi.org/10.1016/j.jfineco.2017.12.011', use: 'Nasdaq 准实验显示暂停保护逆势流动性但有事前磁吸和复牌后不稳定；跨时期对照仍非随机。' },
    { id: 30, authors: 'Kenneth A. Kim & S. Ghon Rhee', year: '1997', title: 'Price Limit Performance: Evidence from the Tokyo Stock Exchange', publication: 'Journal of Finance, 52(2), 885–901', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb04827.x', use: '经典近触限比较支持延迟发现、波动外溢和交易干扰；触限选择仍内生。' },
    { id: 31, authors: 'David D. Cho, Jeffrey S. Russell, George C. Tiao & Ruey S. Tsay', year: '2003', title: 'The Magnet Effect of Price Limits: Evidence from High-Frequency Data on Taiwan Stock Exchange', publication: 'Journal of Empirical Finance, 10(1–2), 133–168', url: 'https://doi.org/10.1016/S0927-5398(02)00024-5', use: '发现上限附近条件速度加快、下限较弱；路径条件和市场制度限制普遍外推。' },
    { id: 32, authors: 'Soon H. Chan, Kenneth A. Kim & S. Ghon Rhee', year: '2005', title: 'Price Limit Performance: Evidence from Transactions Data and the Limit Order Book', publication: 'Journal of Empirical Finance, 12(2), 269–290', url: 'https://doi.org/10.1016/j.jempfin.2004.01.001', use: '马来西亚订单簿证据支持知情交易延迟和订单失衡；宽价格带与早期市场限制外推。' },
    { id: 33, authors: 'Woon K. Wong, Bo Liu & Yong Zeng', year: '2009', title: 'Can Price Limits Help When the Price Is Falling? Evidence from Transactions Data on the Shanghai Stock Exchange', publication: 'China Economic Review, 20(1), 91–102', url: 'https://doi.org/10.1016/j.chieco.2008.09.002', use: '上海逐笔数据揭示触限前加速、跌停侧量降和价差扩大；条件样本不能独立识别磁吸因果。' },
    { id: 34, authors: 'Huimin Li, Dazhi Zheng & Jun Chen', year: '2014', title: 'Effectiveness, Cause and Impact of Price Limit—Evidence from China’s Cross-Listed Stocks', publication: 'Journal of International Financial Markets, Institutions & Money, 29, 217–241', url: 'https://doi.org/10.1016/j.intfin.2013.12.007', use: '用 A/H/N 外部价格代理研究延期、外溢和交易干扰；币种、时区、投资者和卖空差异使对照不完美。' },
    { id: 35, authors: 'Yu-Lei Wan et al.', year: '2015', title: 'Statistical Properties and Pre-Hit Dynamics of Price Limit Hits in the Chinese Stock Markets', publication: 'PLOS ONE, 10(4), e0120312', url: 'https://doi.org/10.1371/journal.pone.0120312', use: '报告 A 股触限前条件动态与显著跨日延续；描述性路径不能等同于福利或规则因果。' },
    { id: 36, authors: 'Ting Chen, Zhenyu Gao, Jibao He, Wenxi Jiang & Wei Xiong', year: '2019', title: 'Daily Price Limits and Destructive Market Behavior', publication: 'Journal of Econometrics, 208(1), 249–264', url: 'https://doi.org/10.1016/j.jeconom.2018.09.014', use: '账户级证据显示大户涨停日买、次日卖及长期反转；ST 指定、注意力和策略协调仍是识别边界。' },
    { id: 37, authors: 'Steven Shuye Wang, Kuan Xu & Hao Zhang', year: '2019', title: 'A Microstructure Study of Circuit Breakers in the Chinese Stock Markets', publication: 'Pacific-Basin Finance Journal, 57, 101174', url: 'https://doi.org/10.1016/j.pacfin.2019.101174', use: '2016 四日高频证据报告订单与报价失衡磁吸、无明显降温；极短政策窗口和工具有效性限制结论。' },
    { id: 38, authors: 'Xiaotao Zhang, Ziqiao Wang, Jing Hao & Feng He', year: '2022', title: 'Price Limit and Stock Market Quality: Evidence from a Quasi-Natural Experiment in the Chinese Stock Market', publication: 'Pacific-Basin Finance Journal, 74, 101778', url: 'https://doi.org/10.1016/j.pacfin.2022.101778', use: '创业板 10%→20% 与流动性改善、观测波动和 VPIN 上升相关；注册制同期改革是主要威胁。' },
    { id: 39, authors: 'Jiangze Bian, Zhi Da, Zhiguo He, Dong Lou, Kelly Shue & Hao Zhou', year: '2026', title: 'The Drivers and Implications of Retail Margin Trading', publication: 'Journal of Finance, 81, 2217–2270', url: 'https://doi.org/10.1111/jofi.70049', use: '账户级证据连接平仓线、卖出倾向与跨股票传染；不可售队列应解释为事实流动性限制而非正式停牌。' },
    { id: 40, authors: 'Ming Guo, Zhan Li & Zhiyong Tu', year: '2012', title: 'A Unique “T+1 Trading Rule” in China: Theory and Evidence', publication: 'Journal of Banking & Finance, 36(2), 575–583', url: 'https://doi.org/10.1016/j.jbankfin.2011.09.002', use: 'B 股前后和趋势模型报告 T+1 下较低量与波动；开放政策同期变化和模型福利假设限制因果。' },
    { id: 41, authors: 'Xinyun Chen, Yan Liu & Tao Zeng', year: '2017', title: 'Does the T+1 Rule Really Reduce Speculation? Evidence from Chinese Stock Index ETF', publication: 'Accounting & Finance, 57(5), 1287–1313', url: 'https://doi.org/10.1111/acfi.12330', use: '两只沪深300 ETF 对比显示常态流动性下部分 T+0 产品价格修复更快；产品规模、申赎与做市不同。' },
    { id: 42, authors: 'Kenan Qiao & Lammertjan Dam', year: '2020', title: 'The Overnight Return Puzzle and the “T+1” Trading Rule in Chinese Stock Markets', publication: 'Journal of Financial Markets, 50, 100534', url: 'https://doi.org/10.1016/j.finmar.2020.100534', use: '估计约 14 bp T+1 开盘不可交易折价与隔夜风险；多市场比较不是随机改革。' },
    { id: 43, authors: 'Jiangze Bian, Tie Su & Jun Wang', year: '2022', title: 'Non-Marketability and One-Day Selling Lockup', publication: 'Journal of Empirical Finance, 65, 1–23', url: 'https://doi.org/10.1016/j.jempfin.2021.10.006', use: '股票—深度实值权证等配对显示不可出售折价随收盘临近缩小；衍生品估值和微观结构差异限制外推。' },
    { id: 44, authors: 'Bruce C. Greenwald & Jeremy C. Stein', year: '1991', title: 'Transactional Risk, Market Crashes, and the Role of Circuit Breakers', publication: 'Journal of Business, 64(4), 443–462', url: 'https://doi.org/10.1086/296547', use: '说明交易机制失灵、市场深度与暂停协调的理论角色；不能代替阈值实证。' },
    { id: 45, authors: 'Laura E. Kodres & Daniel P. O’Brien', year: '1994', title: 'The Existence of Pareto-Superior Price Limits', publication: 'American Economic Review, 84(4), 919–932', url: 'https://www.jstor.org/stable/2118034', use: '说明特定信息与交易者结构下价格限制可能改善风险分担；不存在无条件最优带宽。' },
    { id: 46, authors: 'Ananth Madhavan', year: '1992', title: 'Trading Mechanisms in Securities Markets', publication: 'Journal of Finance, 47(2), 607–641', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04403.x', use: '提供连续与集合机制、透明度和价格发现的理论比较；支持把交易时钟作为状态变量。' },
    { id: 47, authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen', year: '2009', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies, 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '形式化保证金、市场流动性和资产负债表螺旋；需要具体头寸与融资条件才会触发。' },
    { id: 48, authors: 'Sanford J. Grossman', year: '1988', title: 'An Analysis of the Implications for Stock and Futures Price Volatility of Program Trading and Dynamic Hedging Strategies', publication: 'Journal of Business, 61(3), 275–298', url: 'https://doi.org/10.1086/296433', use: '连接动态 hedge、现金—期货市场与价格波动；风格化模型不是 Flash Crash 的单因解释。' },
    { id: 49, authors: 'Christopher K. Ma, Ramesh P. Rao & R. Stephen Sears', year: '1989', title: 'Volatility, Price Resolution, and the Effectiveness of Price Limits', publication: 'Journal of Financial Services Research, 3, 165–199', url: 'https://doi.org/10.1007/BF00122800', use: '期货触限事件报告短期波动下降与反转；没有无价格限制反事实且当日回报被机械限界删失。' },
    { id: 50, authors: 'Bruce N. Lehmann', year: '1989', title: 'Commentary: Volatility, Price Resolution, and the Effectiveness of Price Limits', publication: 'Journal of Financial Services Research, 3, 205–209', url: 'https://doi.org/10.1007/BF00122802', use: '指出反转和低观测波动不足以证明限价有效，要求区分永久信息、暂时误价和潜在未成交波动。' },
    { id: 51, authors: 'Yu Wu & Fang Qin', year: '2015', title: 'Do We Need to Recover T+0 Trading? Evidence from the Chinese Stock Market', publication: 'Emerging Markets Finance and Trade, 51(6), 1084–1098', url: 'https://doi.org/10.1080/1540496X.2015.1080495', use: 'A/B 股 DiD 将 T+1 与更高波动/价差、较低成交和效率关联；B 股开放与平行趋势仍是威胁。' },
    { id: 52, authors: 'Zhengyang Bao, Kenan Kalaycı, Andreas Leibbrandt & Carlos Oyarzun', year: '2020', title: 'Do Regulations Work? A Comprehensive Analysis of Price Limits and Trading Restrictions in Experimental Asset Markets with Deterministic and Stochastic Fundamental Values', publication: 'Journal of Economic Behavior & Organization, 178, 59–84', url: 'https://doi.org/10.1016/j.jebo.2020.07.012', use: '随机实验比较无限制、价格限价、T+1 和组合制度；内部识别强但学生市场、无机构做市限制外部效度。' },
    { id: 53, authors: 'Paul Moise & Lauren Flaherty / SEC DERA', year: '2017', title: 'Limit Up-Limit Down Pilot Plan and Associated Events', publication: 'SEC Division of Economic and Risk Analysis White Paper', url: 'https://www.sec.gov/files/dera-luld-white-paperpdf', use: '描述 LULD 分阶段事件、开盘与 Tier 异质性以及十五秒内回归；撤销成交代理和前后比较不能识别总体福利。' },
    { id: 54, authors: 'Mark S. Seasholes & Guojun Wu', year: '2007', title: 'Predictable Behavior, Profits, and Attention', publication: 'Journal of Empirical Finance, 14(5), 590–610', url: 'https://doi.org/10.1016/j.jempfin.2007.03.002', use: '支持涨停吸引个人注意力买入、先行资金次日退出与随后反转；不是有无限价的外生比较。' },
    { id: 55, authors: 'Yu-Lei Wan, Gang-Jin Wang, Zhi-Qiang Jiang, Wen-Jie Xie & Wei-Xing Zhou', year: '2018', title: 'The Cooling-off Effect of Price Limits in the Chinese Stock Markets', publication: 'Physica A, 505, 153–163', url: 'https://doi.org/10.1016/j.physa.2018.03.066', use: '用条件概率报告触限前 cooling；与 magnet 文献的样本分母和 estimand 不同。' },
    { id: 56, authors: 'Gong-meng Chen, Oliver Meng Rui & Steven Shuye Wang', year: '2005', title: 'The Effectiveness of Price Limits and Stock Characteristics: Evidence from the Shanghai and Shenzhen Stock Exchanges', publication: 'Review of Quantitative Finance and Accounting, 25(2), 159–182', url: 'https://doi.org/10.1007/s11156-005-4247-7', use: '显示涨跌方向与牛熊状态的效果不对称；事件选择和市场状态划分影响结论。' },
    { id: 57, authors: 'Kenneth A. Kim, Haixiao Liu & J. Jimmy Yang', year: '2013', title: 'Reconsidering Price Limit Effectiveness', publication: 'Journal of Financial Research, 36(4), 493–518', url: 'https://doi.org/10.1111/jfir.12021', use: '比较中国长期无价格限制与限制时期并报告部分正面结果；市场成熟与制度共同变化削弱因果解释。' },
    { id: 58, authors: '深圳证券交易所', year: '2023', accessedAt: '2026-08-29', title: '新股上市后的前五个交易日，出现什么情形将导致盘中临时停牌？临时停牌时间为多长？', publication: '深交所投资者教育问答，14 June 2023', url: 'https://investor.szse.cn/index/update/t20230614_601141.html', use: '明确依次穿越 30%/60% 时分档临停、直接达到 60% 时同方向仅临停一次及全日最多四次；现行适用状态仍以 2026 正式规则为准。' },
    { id: 59, authors: '上海证券交易所', year: '2019', accessedAt: '2026-08-29', title: '科创板投教下午茶（三十八）：科创板上市初期交易，划重点', publication: '上交所投资者教育，23 July 2019', url: 'https://edu.sse.com.cn/tib/ysptj/c/4868130.shtml', use: '明确无日限价股票直接达到 60% 与依次达到 30%/60% 的不同临停次数；当前正式条文与适用板块须另按 2026 规则核对。' },
  ],
  readingList: [
    { title: 'NYSE · MWCB FAQ v4.0', scope: '读三级阈值、尾盘、同级重复与 reopening auction。', reason: '把“十五分钟”还原为初始制度时钟，并看到跨上市市场复牌并非同一毫秒。', url: 'https://www.nyse.com/publicdocs/nyse/NYSE_MWCB_FAQ.pdf' },
    { title: 'Nasdaq · Rule 4121', scope: '读正式条文的 15:25 边界、初始停牌、延长和次日恢复条件。', reason: '训练正式规则层级审计，并与上一张 NYSE FAQ 的实务摘要分开读取。', url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/Nasdaq%20Equity%204' },
    { title: 'LULD Plan · Official Overview', scope: '读 Reference Price、Tier/price buckets、Limit/Straddle State 与 Trading Pause。', reason: '完整理解单股动态带的状态机，避免把触带写成立即停牌。', url: 'https://www.luldplan.com/' },
    { title: 'SEC DERA · LULD Events', scope: '读开盘、Tier 1/2、十五秒内回归和错误成交代理。', reason: '观察一套正式规则如何在数据中分化成异质事件，并审计描述性证据。', url: 'https://www.sec.gov/files/dera-luld-white-paperpdf' },
    { title: 'CFTC–SEC · May 6, 2010', scope: '读机械卖压、HFT inventory turnover、期货—股票联动与极端打印。', reason: '理解高成交量与真实风险承接能力为何可以背离。', url: 'https://www.sec.gov/news/studies/2010/marketevents-report.pdf' },
    { title: 'MWCB Working Group · March 2020', scope: '读四次触发、暂停覆盖、复牌过程和建议。', reason: '区分操作有序的证据与熔断因果稳定效果。', url: 'https://www.sec.gov/files/rules/sro/nyse/2021/34-92428-ex3.pdf' },
    { title: '上交所 · 2026 交易规则', scope: '读 3.1、3.3、4.2 与科创板特别规定。', reason: '核对日限价、价格笼子、临停和回转资格的同场叠加。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml' },
    { title: '深交所 · 2026 交易规则', scope: '读 3.1.4–3.1.5、3.3.13–3.3.19 与 4.3.4。', reason: '掌握创业板也适用“2%或十个价位孰宽”及 IPO 临停基准。', url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf' },
    { title: '中国结算深圳分公司 · 2026 结算指南', scope: '读证券处理、可售交收锁定和 T+1 资金批次。', reason: '把投资者回转资格与结算参与人的后交易管道彻底分开。', url: 'https://www.chinaclear.cn/zdjs/szfgsgg/202607/88b2e21f07e1417da56150f04bcff839.shtml' },
    { title: 'Subrahmanyam (1994)', scope: '读可预见暂停怎样改变阈值前交易和卫星市场。', reason: '建立 magnet 与 cross-market migration 的理论机制。', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb04427.x' },
    { title: 'Greenwald & Stein (1991)', scope: '读 transactional risk 与 circuit breaker 的协调角色。', reason: '看清暂停最可能处理的是交易机制失灵，而非永久基本面冲击。', url: 'https://doi.org/10.1086/296547' },
    { title: 'Lee, Ready & Seguin (1994)', scope: '读 pseudohalt 匹配、复牌成交量和波动。', reason: '学习为何复牌高波动既是事实又不是停牌因果。', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb04425.x' },
    { title: 'Corwin & Lipson (2000)', scope: '读停牌期间订单提交撤销、复牌清算价和近价深度。', reason: '把“暂停期信息生产”落到可观察订单簿。', url: 'https://doi.org/10.1111/0022-1082.00267' },
    { title: 'Hautsch & Horvath (2019)', scope: '读 Nasdaq 暂停的历史对照、事前磁吸和复牌后状态。', reason: '观察保护流动性与增加复牌不稳定如何同时成立。', url: 'https://doi.org/10.1016/j.jfineco.2017.12.011' },
    { title: 'Kim & Rhee (1997)', scope: '读 volatility spillover、delayed discovery 与 trading interference 检验。', reason: '建立评价日涨跌幅的经典三分法，同时审计近触限对照。', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb04827.x' },
    { title: 'Cho et al. (2003)', scope: '读台湾上限/下限的条件速度和无价格限制对照。', reason: '理解 magnet 证据为何方向不对称且仍受路径选择影响。', url: 'https://doi.org/10.1016/S0927-5398(02)00024-5' },
    { title: 'Chen et al. (2019) · Destructive Market Behavior', scope: '读账户级涨停日买入、次日卖出和 ST 制度 variation。', reason: '将注意力、协调和大户行为接到价格边界，而不是只看收益。', url: 'https://doi.org/10.1016/j.jeconom.2018.09.014' },
    { title: 'Zhang et al. (2022)', scope: '读创业板 10%→20% 的倾向得分匹配—双重差分（PSM-DiD）、流动性与波动结果。', reason: '练习区分更快信息吸收与更差市场质量，并处理同期注册制。', url: 'https://doi.org/10.1016/j.pacfin.2022.101778' },
    { title: 'Guo, Li & Tu (2012)', scope: '读趋势交易模型和 B 股 T+0/T+1 前后证据。', reason: '理解 T+1 抑制换手的条件，以及为何同期开放政策削弱识别。', url: 'https://doi.org/10.1016/j.jbankfin.2011.09.002' },
    { title: 'Wu & Qin (2015)', scope: '读 A/B 股 DiD 对波动、价差、成交和效率的结果。', reason: '与 Guo 等相反结果对照，训练平行趋势和 treatment 定义审计。', url: 'https://doi.org/10.1080/1540496X.2015.1080495' },
    { title: 'Qiao & Dam (2020)', scope: '读历史 T+0、多资产比较与约 14 bp 开盘折价。', reason: '把当日出售选择权连接到隔夜风险，同时保留模型估计边界。', url: 'https://doi.org/10.1016/j.finmar.2020.100534' },
    { title: 'Bian, Su & Wang (2022)', scope: '读股票—深度实值权证配对和日内折价衰减。', reason: '观察不可出售选择权如何在价格和买入时点中显现。', url: 'https://doi.org/10.1016/j.jempfin.2021.10.006' },
    { title: 'Bian et al. (2026)', scope: '读账户平仓线、卖出与跨股票传染。', reason: '把跌停/不可售资产接入融资约束和组合级火售。', url: 'https://doi.org/10.1111/jofi.70049' },
    { title: 'Bao et al. (2020)', scope: '读价格限制、T+1、组合制度的随机实验与状态依赖。', reason: '用内部识别强、外部效度有限的证据检验“规则总是稳定”的直觉。', url: 'https://doi.org/10.1016/j.jebo.2020.07.012' },
  ],
};
