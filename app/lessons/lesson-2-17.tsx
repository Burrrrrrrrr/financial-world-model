import RedemptionLab from '../components/RedemptionLab';
import { redemptionScenarios } from '../components/redemptionScenarios';
import { lesson217ReadingList, lesson217References } from './lesson-2-17-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson217Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>赎回请求 ≠ 现金缺口 ≠ 卖出目标 ≠ 订单 ≠ 成交 ≠ Fire Sale：投资者退出只有穿过定价、支付、流动性管理与真实执行，才可能成为市场卖压。</h2>
        <p>
          开放式基金给投资者的不是“随时把某只证券卖回给基金经理”的权利，而是按照基金文件与适用规则提交份额赎回、取得现金或证券的权利。请求是否有效、采用哪一个 NAV、何时形成确定支付义务、申购能否净额、基金已有多少未受限现金、资产出售何时结算，都是赎回和市场交易之间不可跳过的状态。基金也可能用现金、同期申购、到期本金、获授权融资、实物交付、价格型或数量／时间型流动性管理工具吸收冲击。只有剩余现金缺口促使管理人选择资产处置，目标又变成真实成交，并在有限承接深度中产生超出基本面变化的额外价格压力时，才有资格讨论 fire sale。<Cite n={31} /><Cite n={32} /><Cite n={33} />
        </p>
        <div className="precision-note">
          <span>先记住六个不能互换的名词</span>
          <p><b>Redemption request</b> 是投资者提交的请求；<b>confirmed cash obligation</b> 是基金在特定支付日已确定的现金责任；<b>cash gap</b> 是可用现金来源之后仍未覆盖的金额；<b>sale target</b> 是管理选择；<b>fill</b> 是真实成交；<b>fire sale</b> 还要求约束性出售在有限承接能力下造成可识别的额外价格折让。每一次把六层压成一层，都会把一个条件命题误写成自动机制。</p>
        </div>
        <p>
          本节要建立的是一套可核算的 <b>redemption-to-market ledger</b>。它同时保存 gross subscriptions、gross redemptions、份额、NAV、支付时钟、结算时钟、现金来源、处置决策、订单、成交、成本归属与剩余组合。读完后，你不应只会说“流动性错配很危险”，而应能指出错配位于哪一个期限、谁有退出权、哪一笔现金何时到期、哪种工具改变数量、价格或时点，以及哪一个箭头仍缺证据。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与两条学习路线</p>
        <h2>主模型是以现金赎回为主的普通开放式基金；硬先修是 2.03，建议回看 T01、T06、T08、1.09、1.20–1.21、2.04、2.15–2.16。</h2>
        <div className="learning-objectives">
          <span>六阶段路线 · 从份额请求到可证伪的价格反馈</span>
          <ol>
            <li><b>对象与时钟（00–12）：</b>分开产品载体、参与者、request、cut-off、NAV、payment、settlement、gross/net flow 与 mismatch。</li>
            <li><b>现金与执行（13–27）：</b>重建支付义务、现金瀑布、cash gap、处置策略、order/fill/settlement 与完整 NAV 账本。</li>
            <li><b>激励与放大（28–36）：</b>区分外生退出、performance-to-flow、first-mover advantage、run、cash hoarding 与 fire sale。</li>
            <li><b>工具与治理（37–47）：</b>按“改变价格、数量、时间、资产交付或融资”分类 LMT，并核对当前法域差异。</li>
            <li><b>证据与研究（48–54）：</b>从 request、flow、fill 到 matched-security price response，逐级提高因果语言门槛。</li>
            <li><b>迁移（55–59）：</b>完成 10+10 道练习、12 道检查、术语桥、课程接口与阅读路径。</li>
          </ol>
        </div>
        <p>
          85–90 分钟核心首读只要求掌握 00–18、20–28、30–43、48、54 与 57–59；当前法域细节、全部论文识别和完整练习可放到第二遍。1.21 已拥有 ETF creation/redemption 与 authorized participant（授权参与者，AP）篮子，2.03 已拥有公募 mandate—AUM—目标—订单，2.16 已拥有 limit—authority—fill。这里不重复它们，而是在这些接口之间加入投资者退出权、现金时钟、成本转移和剩余持有人激励。
        </p>
      </section>

      <section className="lesson-section" id="product-boundaries">
        <p className="section-kicker">02 · 产品边界</p>
        <h2>“投资者能退出”不足以定义同一种机制：普通开放式基金、ETF、货币市场基金、私募基金、封闭式基金、银行存款与保险退保的权利和资产负债表不同。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="不同退出载体的机制边界，可横向滚动">
          <table className="concept-table">
            <caption>退出载体、基金现金义务与本节处理边界</caption>
            <thead><tr><th scope="col">载体</th><th scope="col">投资者通常怎样退出</th><th scope="col">基金／发行人是否立即需要现金</th><th scope="col">本节边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">普通开放式基金</th><td>按规则向基金赎回份额</td><td>现金赎回通常形成支付义务；也可能允许实物</td><td>主模型</td></tr>
              <tr><th scope="row">ETF 二级市场</th><td>把既有份额卖给另一投资者</td><td>若无 AP creation/redemption，在外份额与基金资产可不变</td><td>只作边界，机制归 1.21</td></tr>
              <tr><th scope="row">货币市场基金（money market fund，MMF）</th><td>按专门规则赎回</td><td>受专门期限、流动性、NAV 与费用规则约束</td><td>不可把债券基金模型直接外推</td></tr>
              <tr><th scope="row">私募开放式基金</th><td>依合同 notice、lock-up、gate 等退出</td><td>高度取决于合同与投资者级条款</td><td>只说明差异</td></tr>
              <tr><th scope="row">封闭式基金</th><td>通常在二级市场卖出份额</td><td>折价扩大本身不等于基金赎回</td><td>不使用本节份额注销账本</td></tr>
              <tr><th scope="row">银行／保险</th><td>存款支取或保险退保</td><td>对应存款、保证、准备金、资本和合同费用</td><td>不是共同基金按 NAV 注销份额</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          特别要避免把 ETF 屏幕上的“资金净流入”直接翻译成基金经理买入。零售投资者之间的二级交易只改变份额所有者；只有 AP 在一级市场实际创建或赎回 creation unit，基金份额与资产篮子才发生变化，而且这笔交付可以是实物而非基金公开卖出。美国 Rule 22e-4 也对 in-kind ETF 与普通开放式基金的若干流动性项目作不同处理，说明制度本身不把它们视为同一个现金瀑布。<Cite n={35} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="actors-rights">
        <p className="section-kicker">03 · 参与者、权利与治理分工</p>
        <h2>份额持有人提出退出，基金承担资产与份额账本，管理人选择组合响应，托管／过户与销售渠道验证并结算，交易台只执行获授权订单。</h2>
        <p>
          这条分工解释了为什么“投资者赎回”不是交易台收到卖单。销售渠道或过户代理先判断订单是否在 cut-off 前、资料是否完整、份额是否可用；基金会计按适用时点计算 NAV；管理人和流动性治理主体汇总当日 gross subscriptions/redemptions、预测支付和其他现金流，再决定是否使用某项 LMT、借款或组合处置；交易台随后把 sale target 拆成 parent/child orders。托管行或结算系统最终提供可支付现金。不同机构会合并其中角色，但逻辑责任仍应分列。
        </p>
        <div className="precision-note">
          <span>经济“负债端”不等于统一会计分类</span>
          <p>本节说开放式基金提供 liability-side liquidity，是在描述投资者的赎回权怎样向基金资产端传递现金需求；不同会计准则、基金结构和份额条款可能把可赎回份额列为权益或负债。不要把经济传导语言写成跨法域统一的会计定理。</p>
        </div>
      </section>

      <section className="lesson-section" id="state-chain">
        <p className="section-kicker">04 · 完整状态转移链</p>
        <h2>赎回压力必须沿着一条带时间戳的状态机进入市场；每个节点都可能断链、延迟或改变成本承担者。</h2>
        <div className="causal-chain" aria-label="从赎回请求到下一轮资金流的完整状态链" role="list">
          <div role="listitem"><span>01</span><b>Investor decision</b><p>现金需要、业绩、信息与预期。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Valid request</b><p>good order、cut-off 与取消。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Priced flow</b><p>gross 申赎、适用 NAV 与形式。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Cash obligation</b><p>净额范围、支付币种与期限。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Cash waterfall</b><p>现金、回款、融资与工具。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Portfolio response</b><p>sale target、风险与授权。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>07</span><b>Execution</b><p>order、partial fill 与成本。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>08</span><b>Settlement</b><p>成交款到位与投资者支付。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>09</span><b>New state</b><p>NAV、份额、现金与组合流动性。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>10</span><b>Feedback</b><p>下一轮业绩、预期与资金流。</p></div>
        </div>
        <p>
          链条有两个经常被遗漏的停顿。第一，资产已经成交却尚未结算，基金仍可能没有可用于赎回支付的现金；第二，赎回者已经按某一 NAV 定价，基金后来执行资产出售的成本却可能进入剩余持有人 NAV。前者是时间错配，后者是成本分配。把二者都压进“赎回当天卖资产”，就无法解释融资桥、swing pricing 或 first-mover advantage 为什么存在。
        </p>
      </section>

      <section className="lesson-section" id="four-clocks">
        <p className="section-kicker">05 · 四只时钟</p>
        <h2>Order cut-off、NAV strike、redemption payment 与 asset-sale settlement 是四个时点；同一自然日标签不能证明现金已经到位。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="赎回四只时钟，可横向滚动">
          <table className="concept-table">
            <caption>赎回与资产交易的四个时点</caption>
            <thead><tr><th scope="col">时钟</th><th scope="col">回答的问题</th><th scope="col">常见错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Cut-off</th><td>请求属于哪一个处理批次，是否为 good order？</td><td>把盘中意向当已接受订单</td></tr>
              <tr><th scope="row">NAV strike</th><td>按哪一个前瞻计算的 NAV 或调整价定价？</td><td>把赎回价等同于后来资产成交价</td></tr>
              <tr><th scope="row">Payment</th><td>基金何时必须向投资者交付现金或证券？</td><td>把确认日当现金已支付</td></tr>
              <tr><th scope="row">Sale settlement</th><td>资产成交款何时成为可用现金？</td><td>把 fill 当作已结算现金</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Forward pricing 的基本逻辑是：订单在规定时点前进入后，采用随后计算的 NAV，而不是让投资者用已知旧价格选择性交易。美国现行 Rule 22c-1 继续把下一次计算的 NAV 作为核心，并允许适用基金在治理政策下使用 swing pricing；它没有把 2022 年曾提出的强制 swing/hard-close 方案变成现行统一义务。<Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="nav-ledger">
        <p className="section-kicker">06 · 基金、份额与 NAV 账本</p>
        <h2>赎回首先注销对净资产的比例索取权；在价格、成本和估值都无摩擦时，它只缩小基金，不改变剩余每份价值。</h2>
        <div className="equation-card">
          <span>最小基金账本</span>
          <div>V<sub>t</sub>=A<sub>t</sub>−L<sub>t</sub>；　NAV<sub>t</sub>=V<sub>t</sub>/N<sub>t</sub></div>
          <p>A 是资产市值，L 是不属于份额持有人的其他负债，V 是净资产，N 是在外份额。全文金额单位必须一致；若有多个份额类别，还要分开类别费用、币种和换汇安排。</p>
        </div>
        <div className="equation-card">
          <span>无摩擦赎回恒等式</span>
          <div>v=V/N；　V′=V−uv；　N′=N−u；　NAV′=(V−uv)/(N−u)=v</div>
          <p>投资者赎回 u 份、每份支付 v。只要没有交易成本、估值偏差或额外转移，分子和分母按同一比例缩小，所以剩余 NAV 不变。赎回规模大不自动等于剩余持有人受损。</p>
        </div>
        <p>
          这条恒等式是后文所有放大机制的基准反事实。若实际 NAV 下降，必须追问差额来自证券市场本身、资产出售成本、未出售库存被重新标价、税务／费用、陈旧估值，还是错误地把赎回支付重复扣了一次。账本不平时，任何“稀释”或“fire sale”结论都没有可解释对象。
        </p>
      </section>

      <section className="lesson-section" id="redemption-states">
        <p className="section-kicker">07 · Request、Accepted、Priced 与 Paid</p>
        <h2>同一笔赎回至少有四种状态；只有保存状态、数量、币种和时间戳，才能知道哪一笔会进入现金预测。</h2>
        <p>
          <b>Requested</b> 表示投资者提交；<b>accepted/good order</b> 表示通过身份、份额、文件与 cut-off 验证；<b>priced</b> 表示适用 NAV、swing factor、费用或 levy 已确定；<b>paid/settled</b> 表示现金或证券完成交付。撤单、拒绝、gate 后排队、deferred redemption 和 suspension 会使请求与本期支付分离。风险系统若只保存最终净现金，就无法重建渠道压力、待处理队列和未来支付波峰。
        </p>
        <div className="precision-note">
          <span>“已确认”仍需带口径</span>
          <p>已确认 1 亿元赎回若混合不同法律基金、币种、份额类别和支付日，不能作为一笔净现金义务。确认字段至少要带 fund/entity、share class、currency、redemption form、pricing vintage、payment due 与是否可被 gate/deferral 调整。</p>
        </div>
      </section>

      <section className="lesson-section" id="gross-net-flow">
        <p className="section-kicker">08 · Gross Subscriptions、Gross Redemptions 与 Net Flow</p>
        <h2>净流量回答同一可净额范围内的方向，gross 活动回答运营负荷、投资者异质性与未来队列；一个数字不能替代另一个。</h2>
        <div className="equation-card">
          <span>同一支付口径内的净额</span>
          <div>NetFlow<sub>h</sub>=GrossSubscriptions<sub>h</sub>−GrossRedemptions<sub>h</sub></div>
          <p>例如同日申购 700 万、赎回 1,200 万，净流出为 500 万，但 gross transaction activity 为 1,900 万。若两者币种、实体、时点或法律可用性不同，连这 500 万也不能直接作为现金缺口。</p>
        </div>
        <p>
          只观察净流出还会遮蔽两种完全不同的状态：100 个小投资者退出、另有稳定申购，与一个大客户退出、另一渠道同时申购，可能得到同一净额，却有不同取消概率、集中度、运营负荷和下一期风险。反过来，gross redemption 很大也不等于必须出售；同期确认申购可以在适用范围内吸收现金需求，但不能消灭退出行为本身。
        </p>
      </section>

      <section className="lesson-section" id="flow-estimator">
        <p className="section-kicker">09 · 从 TNA 反推 External Net Flow</p>
        <h2>AUM 下降包含投资损失与资金流；用收益剥离重估后得到的仍只是 net-flow proxy，不是 gross redemption、请求或当日现金。</h2>
        <div className="equation-card">
          <span>常用隐含净流量估计</span>
          <div>F<sub>t</sub><sup>$</sup>≈TNA<sub>t</sub>−TNA<sub>t−1</sub>(1+r<sub>t</sub>)；　f<sub>t</sub>=F<sub>t</sub><sup>$</sup>/TNA<sub>t−1</sub></div>
          <p>TNA 是期末净资产，r 是与其范围一致的期间总回报。期初 100、回报 −5%、期末 87 时，隐含净流量是 −8，不是规模变化 −13；它可能来自赎回 8／申购 0，也可能来自赎回 18／申购 10。</p>
        </div>
        <p>
          这个近似通常隐含流量发生在期末。若流量在月中发生，流量本身也经历部分期间收益；分配、费用、基金合并／清盘、份额拆并、跨币种 share class、陈旧 NAV 与缺失值都会改变结果。Sirri 与 Tufano 的经典 flow-performance 研究帮助建立经验口径，但任何数据实现都必须说明 timing convention，不能把反推净额包装成投资者逐笔行为。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="asset-liquidity">
        <p className="section-kicker">10 · 资产流动性的四个维度</p>
        <h2>“这只债券流动”不是永久属性；可变现金额、所需时间、价格成本与完成确定性都随规模和市场状态变化。</h2>
        <p>
          同一资产在 50 万元和 5,000 万元卖出规模下可能属于不同流动性层；一笔交易可以报价很紧却缺乏深度，也可以价格折让不大却 T+3 才结算。压力期 dealer 风险资本、库存、融资和客户方向改变，正常日的日均成交量无法保证压力日容量。美国现行 Rule 22e-4 正因如此要求在正常与可合理预见压力条件下考虑市场深度、基金合理预期交易规模、现金流预测和融资来源，并把“convertible to cash”定义到出售完成结算，而不只到订单成交。<Cite n={35} />
        </p>
        <div className="equation-card">
          <span>状态依赖执行成本</span>
          <div>NetCash<sub>j</sub>(q,h,Ω)=q[1−c<sub>j</sub>(q,h,Ω)]</div>
          <p>q 是按决策价值计的出售金额，h 是可用期限，Ω 是市场状态，c 包含在题设中没有被资产市值变化重复计入的 spread、impact、fees 与税费。q 越大、h 越短或 Ω 越紧张，c 往往越高，但这不是无条件线性规律。</p>
        </div>
      </section>

      <section className="lesson-section" id="mismatch-definition">
        <p className="section-kicker">11 · Liquidity Mismatch 的严格定义</p>
        <h2>错配不是“不流动资产占比高”的同义词，而是赎回条款与资产在给定规模、期限和压力状态下变现能力之间的联合状态差。</h2>
        <p>
          若基金允许每日赎回并很快支付，而资产需要更长时间才能在不显著折价的条件下变现，基金就在进行 liquidity transformation。但是否构成严重错配，还取决于 cash buffer、投资者集中、到期现金流、借款、可用 LMT、币种和当前市场深度。持有同一组公司债的封闭式基金与日赎回开放式基金，资产流动性相同，负债端时钟却不同；同一开放式基金在正常日与 dealer 撤退的压力日也可能从可覆盖变成不可覆盖。FSB 2023 因此把赎回条款与正常／压力资产流动性的协调放在结构性脆弱性框架中心。<Cite n={31} />
        </p>
        <div className="precision-note">
          <span>错配是条件判断，不是道德标签</span>
          <p>Liquidity transformation 能让投资者共享长期、较不流动资产，同时获得比底层资产更便捷的退出权，具有经济价值。问题不是“开放式基金不应持有不流动资产”，而是退出承诺、成本归属、工具、治理和市场容量是否让该转换在压力中可持续。</p>
        </div>
      </section>

      <section className="lesson-section" id="mismatch-matrix">
        <p className="section-kicker">12 · 用矩阵而不是单一比例测量错配</p>
        <h2>一个可审计的错配画像至少同时观察赎回 horizon、资产变现 horizon、交易规模、现金来源可靠性与投资者集中度。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="流动性错配测量矩阵，可横向滚动">
          <table className="concept-table">
            <caption>流动性错配的五个测量维度</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">需要冻结</th><th scope="col">不能用什么替代</th></tr></thead>
            <tbody>
              <tr><th scope="row">Redemption</th><td>频率、notice、cut-off、payment、gate/suspension</td><td>产品名称</td></tr>
              <tr><th scope="row">Asset sale</th><td>规模、time-to-cash、spread、impact、settlement</td><td>正常日 average daily volume（平均每日成交量，ADV）单点</td></tr>
              <tr><th scope="row">Cash sources</th><td>可自由使用、到达时点、币种、质押与法律实体</td><td>总现金或总流动资产</td></tr>
              <tr><th scope="row">Investor base</th><td>集中度、渠道、共同触发器、取消与排队行为</td><td>投资者人数</td></tr>
              <tr><th scope="row">Market state</th><td>dealer capacity、相关出售、波动、融资与政策工具</td><td>历史平均冲击</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          监管流动性桶、内部 time-to-liquidate 和压力覆盖率都只是对这个矩阵的压缩。压缩指标有治理价值，却可能把同一桶内的异质性遮掉：两只都标为“highly liquid”的证券，在极端规模、停牌、结算失败或相关市场关闭时仍会分化。专业分析应保存原始口径与模型版本，而不是只报告一个漂亮比例。
        </p>
      </section>

      <section className="lesson-section" id="cash-obligation">
        <p className="section-kicker">13 · 赎回何时成为现金义务</p>
        <h2>只有已接受、已定价且按条款应以现金支付的部分，才进入对应 payment horizon 的确定现金流出；请求总额不是同一对象。</h2>
        <div className="equation-card">
          <span>从已定价赎回到现金形式</span>
          <div>D<sub>h</sub><sup>cash</sup>=D<sub>h</sub><sup>priced</sup>−X<sub>h</sub><sup>in-kind</sup>−Q<sub>h</sub><sup>deferred</sup></div>
          <p>D<sup>priced</sup> 是在期限 h 应处理的已定价总额；X 是依适用条款以证券交付的部分；Q 是依法、依合同或工具规则延期到未来的部分。Gate、queue 与 suspension 的处理不能凭空假设，必须以当时有效文件和决策记录为准。</p>
        </div>
        <p>
          Price-based LMT 改变每份赎回价或费用，所以也会改变最终现金金额；它的主要经济目的仍是把流量引起的成本分配给交易投资者，而不是生成新的市场现金。数量／时间型工具改变本期执行量或支付时点，却可能留下队列与信号效应。实物赎回则改变交付形式：基金不必先卖证券取现，但出售风险可能转移给收到证券的投资者。
        </p>
      </section>

      <section className="lesson-section" id="cash-waterfall">
        <p className="section-kicker">14 · Cash Waterfall</p>
        <h2>在讨论卖什么之前，先把同一 payment horizon 内所有可用现金来源按确定性、权限与时钟排成瀑布。</h2>
        <div className="equation-card">
          <span>支付期 h 的教学版现金缺口</span>
          <div>G<sub>h</sub>=max&#123;0, D<sub>h</sub><sup>cash</sup>+O<sub>h</sub>+Floor<sub>h</sub>−C<sub>0</sub><sup>free</sup>−S<sub>h</sub><sup>confirmed</sup>−Z<sub>h</sub><sup>receipts</sup>−B<sub>h</sub><sup>usable</sup>&#125;</div>
          <p>D 是本期现金赎回，O 是保证金、费用与其他现金用途，Floor 是支付后运营现金底线；C 是已结算、未质押、可自由使用的现金，S 是同范围确认申购，Z 是付款前实际结算的本金／利息／股息等，B 是获授权且当时可提款的融资。G 是尚需获得的净现金，不是自动卖出指令。</p>
        </div>
        <p>
          例如 T+1 需支付 600 万元赎回，基金现有自由现金 200 万、T+1 确认申购 100 万、要求支付后留 50 万运营现金；一笔 300 万票息到 T+2 才结算，不能提前使用。于是 T+1 缺口是 600+50−200−100=350 万元。若把 T+2 回款放进 T+1 分母，模型会在最需要现金时虚构流动性。
        </p>
      </section>

      <section className="lesson-section" id="eligible-cash">
        <p className="section-kicker">15 · 哪些现金来源可以相减</p>
        <h2>只有在同一法律实体、币种、支付期限内可自由使用且具有足够确定性的现金，才有资格覆盖赎回；“集团有钱”不是基金有现金。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="现金来源资格判断，可横向滚动">
          <table className="concept-table">
            <caption>进入 cash waterfall 前的资格门</caption>
            <thead><tr><th scope="col">候选来源</th><th scope="col">纳入条件</th><th scope="col">高频误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">账面现金</th><td>已结算、未质押、非受限、币种匹配</td><td>把 margin collateral 或 pending cash 当自由现金</td></tr>
              <tr><th scope="row">同期申购</th><td>已确认、同实体、同支付窗口且运营上可用</td><td>用预测申购抵消确定赎回</td></tr>
              <tr><th scope="row">票息／到期本金</th><td>在赎回付款前完成结算</td><td>按应计收入而非 cash date 纳入</td></tr>
              <tr><th scope="row">借款／额度</th><td>基金获授权、额度承诺有效、可提款且 covenant 满足</td><td>把未承诺额度当确定现金</td></tr>
              <tr><th scope="row">其他基金／管理人现金</th><td>法律、合同与监管明确允许转移</td><td>跨基金、跨实体或跨币种无条件净额</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          预测层可以为来源赋概率并做情景，但支付控制不能把概率 70% 的申购当作 100% 已结算现金。相反，过度保守地把所有到期回款都排除，也会高估卖出。最好的账本不是简单“算或不算”，而是同时保存 amount、available-at、currency、entity、encumbrance、certainty 与 owner，让基础情景和压力情景使用不同但可追溯的 eligibility rule。
        </p>
      </section>

      <section className="lesson-section" id="gap-not-target">
        <p className="section-kicker">16 · Cash Gap 不是 Sale Target</p>
        <h2>现金缺口只是待解决的资金约束；管理人仍要在借款、实物交付、时间型工具、出售、对冲或组合方案中选择获授权路径。</h2>
        <p>
          若 (G_h=400) 万元，它并不告诉你“卖出 400 万元资产”。资产出售有交易成本，按决策价值卖 400 万可能只净得 396 万；某些证券结算太晚，某些持仓不能因 mandate、税务、集中度或最小交易单位而出售；管理人也可能为支付后重建 buffer 而多卖，或用借款把出售推迟到更深的市场。2.16 的语言在这里继续适用：constraint state 先进入 authority 与 response choice，随后才形成 target。
        </p>
        <div className="precision-note">
          <span>三种规模不要混写</span>
          <p><b>Cash gap</b> 是需要获得的净现金；<b>marked-value sale target</b> 是计划处置的资产决策价值；<b>executed notional/proceeds</b> 是真实成交数量和结算所得。成本、部分成交、价格移动与失败结算会让三者不同。</p>
        </div>
      </section>

      <section className="lesson-section" id="coverage-ratio">
        <p className="section-kicker">17 · Scenario Redemption Coverage</p>
        <h2>覆盖率可以把期限内资源与压力现金流放在同一分数里，但它是情景诊断，不是银行监管 Liquidity Coverage Ratio（流动性覆盖率，LCR），也不证明不存在 run。</h2>
        <div className="equation-card">
          <span>本节教学用覆盖率</span>
          <div>Coverage(h,s)=AvailableStressedCashResources(h,s) / StressedCashOutflowsDue(h,s)</div>
          <p>h 是期限，s 是赎回、市场深度、成本和融资可用性共同组成的情景。分子只放在 h 内可变现并结算的资源，分母放同一时点到期的赎回和其他现金用途。不得把已有现金又包含在可售资产里，也不得把质押资产、错误币种或跨实体不可转移资金重复计算。</p>
        </div>
        <p>
          Coverage≥1 只表示在该情景和 liquidation policy 下有足够资源；它没有告诉你成本由谁承担、支付后组合是否更不流动、投资者是否会因工具启动而提前退出。Coverage&lt;1 则是压力假设下的短缺信号，需要更改产品条款、工具、融资、资产配置或治理，而不是从分数直接推出违约。为避免与银行 LCR 混淆，本节不把它缩写为 RCR/LCR，也不声称存在全球统一阈值。<Cite n={31} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="target-order-fill">
        <p className="section-kicker">18 · Sale Target → Order → Fill → Settlement</p>
        <h2>卖出目标是组合层决策，母订单是执行授权，成交才改变持仓，结算所得才改变可用现金；四层必须分别留证。</h2>
        <div className="causal-chain" aria-label="从卖出目标到赎回支付的执行链" role="list">
          <div role="listitem"><span>01</span><b>Sale target</b><p>希望从哪些资产获得多少净现金。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Parent order</b><p>方向、数量、期限、限制与执行授权。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Child orders</b><p>场所、算法、限价和分批执行。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Actual fills</b><p>真实数量、价格、费用与未完成量。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Settlement</b><p>现金可用、fail 管理与币种转换。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Payment</b><p>向投资者交付并注销份额。</p></div>
        </div>
        <p>
          一张 flow-induced trading proxy 可以推测基金可能卖了什么，却不是交易台成交记录；持仓从月末到月末减少，也可能来自到期、违约、公司行动、衍生品敞口变化或估值。若研究只能看到 target 或持仓推断，结论应写为“与赎回驱动出售一致”；只有 order/fill 数据才可以更直接地识别执行节点。Lou 的代理和 Coval–Stafford 的共同持仓设计极具启发性，但都需要保留这一观察边界。<Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="sale-optimization">
        <p className="section-kicker">19 · Liquidation 不是固定比例</p>
        <h2>管理人要在取得足够净现金的同时权衡显性成本、market impact、tracking、风险、税务、剩余流动性与授权约束；不存在无条件最优的销售顺序。</h2>
        <div className="equation-card">
          <span>教学版处置问题</span>
          <div>min<sub>&#123;q<sub>j</sub>&#125;</sub> Σ<sub>j</sub>[Cost<sub>j</sub>(q<sub>j</sub>)+λ<sub>1</sub>Drift<sub>j</sub>+λ<sub>2</sub>Risk<sub>j</sub>+λ<sub>3</sub>FutureMismatch<sub>j</sub>]</div>
          <p>约束是 Σq_j[1−c_j(q_j,h,Ω)]≥G，且每个 q_j 受持仓、settlement、mandate、risk limit、整手、税务和市场容量限制。λ 只是把组织偏好写入教学模型的权重，不代表现实有一套全球统一目标函数。</p>
        </div>
        <p>
          该式揭示两个经常冲突的目标：降低今天的交易成本，往往意味着先卖最流动资产；保存明天的流动性缓冲，可能要求按比例或有意识出售较不流动资产。若成本函数随总市场出售量上升，单只基金眼中的便宜选择还可能对其他基金形成外部性。2.17 只处理单基金选择与一阶价格回写，多基金固定点留给 Chapter 7。
        </p>
      </section>

      <section className="lesson-section" id="cash-buffer">
        <p className="section-kicker">20 · Cash Buffer：断开当期卖出，不消灭未来错配</p>
        <h2>充足现金可以让赎回在本期不产生任何市场订单；代价是支付后的缓冲下降，下一轮相同冲击可能更快触及资产出售。</h2>
        <p>
          若赎回支付 500 万、自由现金 800 万、floor 200 万，支付后仍有 300 万，当前无需卖出。研究若从 outflow 直接推断 sale，就会制造不存在的交易。但这并不意味着赎回“无影响”：现金占比下降、剩余组合资产构成改变，下一期 coverage 与管理选择都不同。现金还有机会成本，过高 buffer 会稀释策略敞口或相对基准表现；因此最优现金不是越多越好。
        </p>
        <p>
          现金也可能触发相反行为。管理人若担心未来继续赎回，可能不是消耗全部现金，而是卖出超过当前 gap 的资产来重建 buffer，即 cash hoarding。Morris、Shim 与 Shin 在特定全球债券基金样本中记录了这种模式；它说明现金既可吸收冲击，也可通过预防动机放大当前出售，但不能外推为所有基金的固定策略。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="liquid-first">
        <p className="section-kicker">21 · Liquidity Waterfall / Liquid-first</p>
        <h2>先卖成本低、结算快的资产能保护当前 NAV，却会提高剩余组合中不流动资产占比，把风险从今天的价格成本转移到明天的组合状态。</h2>
        <p>
          假设基金持有国债与公司债，当前国债成本 10bp、公司债成本 100bp，缺口 400 万元。只卖国债需处置约 (400/(1-0.001)=400.4004) 万元，成本约 0.4004 万元，显著低于卖公司债。这个策略在当前交易上合理，但国债 buffer 被消耗后，留下的公司债占比上升；下一轮赎回可能需要触碰更昂贵的资产，剩余持有人承受 composition dilution。
        </p>
        <p>
          2020 年压力期研究发现部分债券基金集中出售美国国债和高质量债券，Ma、Xiao 与 Zeng 将其称为 reverse flight to liquidity；这能解释为何最流动市场也会出现大额出售，却是特定事件、样本和识别模型下的结果，不是“债券基金永远先卖国债”的自然法则。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="vertical-slice">
        <p className="section-kicker">22 · Pro-rata / Vertical Slice</p>
        <h2>按持仓比例缩小组合能较好保存风险和流动性构成，却可能迫使基金交易大量小额、昂贵或难以结算的头寸。</h2>
        <p>
          若每项资产按同一比例 α 出售，理想化后新组合权重接近原权重，tracking 与信用／久期结构较稳定。这是很多 flow-induced trading 代理的直观基础，也适合作为反事实。但真实组合含整手、税 lot、停牌、受限证券、衍生品、负现金、不同结算日和最小交易成本，严格 vertical slice 可能不可执行；压力中交易不流动资产还会显著提高当期 dilution。
        </p>
        <p>
          Jiang、Li 与 Wang 的公司债基金证据显示，基金在较平静状态更可能消耗流动资产，而在高不确定性状态更接近同比例削减流动与不流动债券。研究与 liquid-first 证据并不必然冲突：出售策略会随不确定性、流量规模、现金、市场状态和样本定义切换。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="hybrid-sale">
        <p className="section-kicker">23 · Hybrid、Targeted 与 Least-liquid-first</p>
        <h2>现实处置常是混合优化：先使用自然现金，再在流动资产与结构保护之间分层；“先卖最不流动资产”只在承接与授权允许时才可能保护未来 buffer。</h2>
        <p>
          Hybrid policy 可以给每类资产设最大 liquid-first 额度，超过后转为近似 pro-rata；也可出售最偏离目标、信用观点最弱或对风险贡献最低的资产，同时用 futures/FX hedge 暂时控制 beta、duration 或 currency exposure。Least-liquid-first 理论上避免把最差资产永久留给剩余人，却可能因报价稀疏、price impact、settlement 与公平估值不可行，甚至立即把未实现折价变成已实现成本。
        </p>
        <div className="precision-note">
          <span>Hedge 不是赎回现金</span>
          <p>卖出期货可以快速降低市场 beta 或久期，却通常不会生成等于名义金额的可用于赎回支付现金；还会改变 margin 与 collateral。组合风险修复和现金融资必须在两本账上分别核算。</p>
        </div>
      </section>

      <section className="lesson-section" id="borrowing-fx">
        <p className="section-kicker">24 · Borrowing、Settlement Bridge 与 FX Cash</p>
        <h2>借款可以跨过资产成交与赎回付款之间的时间缝隙，却增加利息、抵押品、杠杆、续作与偿还风险；桥接不是永久消除缺口。</h2>
        <p>
          若资产 T+2 结算、赎回 T+1 支付，一日 committed line 可能避免急售；但额度必须为该基金获授权、当时可提款，且不能在压力中因 covenant、抵押品或银行风险偏好失效。借款到期前仍需有资产结算、申购或其他偿还来源。若支付币种与资产币种不同，还要加入 FX spot/forward 的成交、cut-off、settlement 与 basis；“总现金足够”不能掩盖单币种短缺。
        </p>
        <p>
          因此 borrowing 的正确标签是 <b>timing bridge</b>。它可能把低深度时点的出售移到更有序的窗口，也可能延迟确认损失、提高 leverage，或在多家基金同时提款时挤压银行／dealer capacity。后一层融资—市场流动性反馈由 7.11–7.12 展开。
        </p>
      </section>

      <section className="lesson-section" id="in-kind-boundary">
        <p className="section-kicker">25 · Redemption in Kind</p>
        <h2>实物赎回把证券交给赎回者，能降低基金即时现金和公开出售需要，却可能把执行成本与价格压力转移到基金之外。</h2>
        <p>
          普通开放式基金是否可、何时可、怎样公平地使用 in-kind redemption，取决于法域、基金文件、持有人条件、估值与资产可转让性。它不等于 ETF AP 的标准篮子流程：ETF 一级市场围绕 creation unit、AP 与 basket 运行，普通持有人通常没有相同机制。Rule 22e-4 对实际从事实物赎回或保留该权利的基金，以及 In-Kind ETF，要求建立关于何时、如何进行实物赎回的政策与程序；不能据此声称所有基金都必须保留该权利，或能对所有投资者无条件实物支付。<Cite n={35} />
        </p>
        <p>
          Agarwal、Ren、Shen 与 Zhao 的研究支持实物赎回能减轻基金自身 run 与业绩损害，同时显示收到证券者会承担处置成本，相关证券仍可能受影响。机制上它改变的是<b>谁持有并可能出售证券</b>，而不是让整个系统的资产流动性凭空提高。<Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="worked-ledger">
        <p className="section-kicker">26 · 完整可复算账本</p>
        <h2>用同一个 1 亿元基金同时核对现金缺口、出售规模、交易成本、支付、份额注销与剩余 NAV。</h2>
        <div className="precision-note">
          <span>冻结参数</span>
          <p>初始净资产 1 亿元，在外 100 万份，NAV=100 元；资产由现金 400 万、较流动债券 3,600 万、较不流动债券 6,000 万组成。投资者有效赎回 6 万份，题设采用未调整 NAV，需支付 600 万；支付后现金 floor 为 200 万；没有同期申购、到期回款或借款。</p>
        </div>
        <div className="equation-card">
          <span>第一步：现金缺口</span>
          <div>G=6m+2m−4m=4m</div>
          <p>基金不是缺 600 万，因为已有 400 万现金；也不能把 400 万全部付掉，因为题设要求支付后留 200 万。所以需要新增净现金 400 万。</p>
        </div>
        <div className="equation-card">
          <span>第二步：出售、成本与剩余 NAV</span>
          <div>Marked sale=4.04m；　Net proceeds=4.00m；　Cost=0.04m</div>
          <p>成交后现金从 400 万升至 800 万，支付 600 万后剩 200 万。净资产由 1 亿元减去 4 万交易成本与 600 万赎回支付，剩 9,396 万；份额剩 94 万，所以 NAV′=93.96m/940,000=99.9574468 元。</p>
        </div>
        <p>
          账本只扣一次成本。卖出债券的 404 万不是额外从净资产扣除：资产先从债券转为 400 万现金，并实现 4 万成本；随后 600 万支付减少资产和份额。若同时写“卖出 404 万导致资产减少 404 万”再扣支付，就会重复计算。剩余每份约损失 0.042553 元，正是 4 万成本除以 94 万剩余份额。
        </p>
      </section>

      <section className="lesson-section" id="dilution-ledger">
        <p className="section-kicker">27 · Dilution 与 Anti-dilution Ledger</p>
        <h2>稀释不是“基金变小”，而是流量相关成本没有由引发交易的投资者承担，进入剩余份额价值或未来组合风险。</h2>
        <div className="equation-card">
          <span>成本与价格调整后的剩余 NAV</span>
          <div>NAV′=v+(D−C)/(N−u)</div>
          <p>v 是赎回前 NAV，u 是赎回份额，C 是基金因该流量承担且未重复计入的总成本，D 是通过赎回价调整、levy 或费用留在基金内用于抵补成本的金额。D&lt;C 时剩余持有人承担差额；D=C 时在这个最简账本中成本中性；D&gt;C 时发生反向转移。</p>
        </div>
        <p>
          在主案例中 C=4 万、u=6 万份。若恰好把 4 万计入赎回者，每份调整 (4万/6万=0.666667) 元，赎回价为 99.333333 元，支付 596 万。剩余净资产为 (1亿−4万−596万=9,400万)，除以 94 万份，NAV 回到 100 元。现实 swing factor 在交易发生前或定价时只能估计 spread、impact 与其他成本，不可能总是等于事后真值；这个等式是成本归属基准，不是完美保险。<Cite n={7} /><Cite n={8} />
        </p>
        <div className="precision-note">
          <span>Swing pricing 不创造现金或收益</span>
          <p>它通过改变交易投资者的执行价格，把预期交易成本更多分配给其本人。调整后基金支付较少现金并保留补偿，但若实际成本同样发生，净经济效果是减少对剩余人的转移；不能把保留金额写成无代价利润。</p>
        </div>
      </section>

      <section className="lesson-section" id="composition-dilution">
        <p className="section-kicker">28 · NAV 不变也可能发生 Composition Dilution</p>
        <h2>如果基金只用现金或只卖最流动资产，当前交易成本可能很小，剩余持有人却持有更不流动、更集中或更偏离目标的组合。</h2>
        <p>
          主案例若初始现金 800 万、赎回 600 万且 floor 200 万，可以恰好不卖资产，支付后 NAV 仍为 100。但剩余基金几乎没有自由现金，下一轮冲击更容易触发处置。若只卖流动债券，未实现损失可能很小，较不流动债券在剩余净资产中的占比却上升。这种损害未必立即显示在 NAV 上，因此只比较赎回前后每份价格会漏掉状态转移。
        </p>
        <p>
          Composition dilution 不是一个跨法规统一术语，而是本节的教学标签：用来提醒读者把<b>价值转移</b>与<b>组合质量转移</b>分开。后者需要观察 cash ratio、liquidity buckets、concentration、duration／credit drift、time-to-liquidate 和下一期 coverage，不能用一个交易成本数字概括。
        </p>
      </section>

      <section className="lesson-section" id="exogenous-motives">
        <p className="section-kicker">29 · 外生赎回动机</p>
        <h2>投资者可能因为消费、税务、资产配置、渠道迁移、风险承受力或流动性需要退出；共同外部冲击可以制造大额赎回，却不自动构成 run。</h2>
        <p>
          一个养老金计划再平衡、家庭支付购房款、机构 mandate 改变或基金并购，都能带来与基金未来质量无关的流量。这些动机对基金而言仍是现金冲击，却没有“别人先赎回使我也更想赎回”的战略互补。研究若把所有 outflow 都解释为恐慌，会把投资者异质性抹掉；反过来，完全把流量当外生，也会漏掉成本外部性与业绩反馈。
        </p>
        <p>
          因果研究最好寻找与所持证券基本面相对独立的投资者冲击，例如渠道、账户或其他资产上的外部流动性需要，再检查它是否先进入确认赎回、现金缺口和实际成交。没有这条顺序，只看基金回报和流量的同期关系，很难区分“价格下跌导致赎回”与“赎回出售影响价格”。
        </p>
      </section>

      <section className="lesson-section" id="performance-flow">
        <p className="section-kicker">30 · Performance-to-flow 与信息更新</p>
        <h2>坏业绩后的赎回可以是投资者对管理能力、风险或产品适配性的理性更新；只有当他人退出改变我的等待收益时，才进入 run 机制。</h2>
        <div className="equation-card">
          <span>分段 flow–performance 经验式</span>
          <div>f<sub>i,t+1</sub>=α<sub>i</sub>+β<sub>−</sub>p<sub>i,t</sub><sup>−</sup>+β<sub>+</sub>p<sub>i,t</sub><sup>+</sup>+ΓX<sub>i,t</sub>+ε<sub>i,t+1</sub></div>
          <p>f 是下一期净流量，采用正数为净流入口径；α_i 是基金自身的基线项，p<sup>−</sup>=min(p,0) 与 p<sup>+</sup>=max(p,0) 分别保留负、正业绩，β<sub>−</sub> 与 β<sub>+</sub> 是两段业绩斜率；X 是规模、费用、年龄等控制变量组成的向量，Γ 是对应系数，ε 是这些已列变量仍未解释的流量。坏业绩区间斜率更陡表示负区间更敏感；它可以与 run 机制相容，却不能单独证明投资者之间存在战略互补。</p>
        </div>
        <p>
          Goldstein、Jiang 与 Ng 在美国公司债共同基金中记录了坏业绩侧更敏感、且流动性较差时更明显的 concave relation。它支持流动性与流量激励有关，但论文自身没有用这一回归证明系统级价格影响。Sirri–Tufano 对股票基金则强调好业绩侧的凸性与搜索成本／营销等机制。两者样本、时期、资产和因变量口径不同，不能压成“基金流量只对一种方向敏感”的统一定律。<Cite n={1} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="first-mover">
        <p className="section-kicker">31 · First-mover Advantage</p>
        <h2>先动优势不是“早卖总会赚”，而是后续赎回成本未完全由交易者内部化时，早退出者能避免留给剩余人的那部分成本。</h2>
        <div className="equation-card">
          <span>赎回与留下的期望财富差</span>
          <div>Δ<sub>i</sub>(x;τ)=P<sub>i,τ</sub><sup>redeem,gross</sup>−E[V<sub>i,τ</sub><sup>stay</sup>|x]−C<sub>i,τ</sub><sup>redeem</sup></div>
          <p>τ 是预先选定的共同评价时点，三项都必须按同一币种折现或滚动到 τ。P<sup>redeem,gross</sup> 是基金按今天赎回价格计算、但尚未扣除本式另列投资者级成本的赎回所得，并按预先声明的现金持有或再投资规则换算到 τ；E[V<sup>stay</sup>|x] 是在其他投资者赎回规模为 x 时，选择留下并在同一 τ 计量的预期财富；C<sup>redeem</sup> 汇总同样换算到 τ 的赎回费、税负和转换／再投资成本，但不得再次计入已经由前两项财富差捕捉的放弃市场敞口。若别人赎回会提高未来未补偿交易成本、现金耗尽、陈旧估值损失或剩余组合脆弱性，Δ 可能上升；个人现金需要和这些成本也会改变选择。</p>
        </div>
        <p>
          浮动 NAV 只让基金价值随资产变动，并不保证赎回者承担其引发的未来交易成本。陈旧或平滑估值还可能让早赎回者按高于可实现价值的价格退出。Choi、Kronlund 与 Oh 在固定收益基金中研究了 stale pricing 路径；它与交易成本 dilution 是可叠加但不同的机制，不能把所有先动优势都归结为 market impact。<Cite n={56} />
        </p>
      </section>

      <section className="lesson-section" id="strategic-complementarity">
        <p className="section-kicker">32 · Strategic Complementarity</p>
        <h2>只有当他人赎回越多，我自己的赎回相对留下越有吸引力，投资者行动才具有相互强化的 payoff complementarity。</h2>
        <div className="equation-card">
          <span>最小条件</span>
          <div>∂Δ<sub>i</sub>(x)/∂x &gt; 0</div>
          <p>这表示别人退出会提高我退出相对等待的收益。它可能来自成本外部性、剩余组合恶化、cash buffer 耗尽或价格先后次序；若 swing/levy 充分内部化边际成本，导数可能下降甚至改变符号。</p>
        </div>
        <p>
          Chen、Goldstein 与 Jiang 的经典研究在持有更不流动资产的美国股票开放式基金中发现，坏业绩后的资金流敏感度更强，且零售导向基金更明显；模型和证据支持 payoff complementarity，而不是宣布每一次流出都是 run。大投资者可能因内部化自身冲击而降低互补性，也可能因单笔规模巨大制造更厚尾的现金需求，所以“投资者越集中越稳定”也不是单调结论。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="fund-run">
        <p className="section-kicker">33 · Fund Run 的严格边界</p>
        <h2>Fund run 是退出决定之间存在自我强化的协调问题，不是“大额净流出”的同义词，也不要求基金像银行一样承诺固定面值。</h2>
        <p>
          一个外生养老金再平衡可以造成 20% 流出而没有战略互补；相反，投资者开始预期别人会抢先退出，即使最初实际流量不大，也可能已出现 run incentive。经验识别至少要证明流量对流动性、投资者结构或成本归属具有与 payoff complementarity 一致的异质反应，并尽可能排除共同信息和基本面更新。把所有坏业绩流出称为 run，会让概念失去可证伪性。
        </p>
        <div className="precision-note">
          <span>Run、insolvency 与 suspension 不等同</span>
          <p>开放式基金可以在资产价值为正时遭遇协调性赎回，也可以因估值不确定暂停而并未资不抵债。反过来，资产损失很大也不必出现 run。价值、现金、权利与投资者策略是四条轴。</p>
        </div>
      </section>

      <section className="lesson-section" id="sale-not-fire-sale">
        <p className="section-kicker">34 · Asset Sale 不等于 Fire Sale</p>
        <h2>基金为赎回卖出资产可以是有序、低成本且被深度市场完全吸收；fire sale 需要约束性速度、有限承接与相对反事实的额外折价。</h2>
        <p>
          本节采用操作性定义：<b>因现金或约束而在有限时间内发生的真实出售，在承接资本有限时造成超出同期基本面与共同风险因子所能解释的价格压力</b>。亏损卖出不充分，因为价格可能正确反映坏消息；大额成交也不充分，因为市场可能有深度；暂时下跌是辅助证据，却不必完全反转，也可能由流动性以外信息造成。Shleifer–Vishny 的清算价值框架强调“最佳使用者资本有限”这一承接约束，2.15 则已解释套利资本为何不能无限吸收折价。<Cite n={20} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="赎回、出售与火售证据区别，可横向滚动">
          <table className="concept-table">
            <caption>不同结论需要的最小证据</caption>
            <thead><tr><th scope="col">结论</th><th scope="col">最低观察</th><th scope="col">仍不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">有赎回</th><td>有效／已确认份额请求或支付</td><td>基金卖了资产</td></tr>
              <tr><th scope="row">有赎回驱动出售</th><td>现金缺口、处置决策与 actual sell fills</td><td>成交造成额外价格压力</td></tr>
              <tr><th scope="row">有 fire-sale pressure</th><td>约束冲击、真实成交、有限深度、可信价格反事实</td><td>所有基金／时期的普遍效应</td></tr>
              <tr><th scope="row">有 contagion</th><td>其他持有人被 mark、流量或约束触发后再行动</td><td>系统固定点与总福利结论</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="fire-sale-identification">
        <p className="section-kicker">35 · Fire-sale 识别门槛</p>
        <h2>最强设计把“谁因非证券基本面原因被迫获得现金”与“哪些预先持有的证券被真实卖出”连接，再寻找相对价格压力与后续反转。</h2>
        <ol className="research-protocol">
          <li><b>预先持仓：</b>使用冲击前 holdings，避免把出售后的组合当暴露。</li>
          <li><b>约束冲击：</b>寻找平台变更、外部流动性需要或 leave-one-out flow shock，并验证其与证券新闻相对独立。</li>
          <li><b>状态链：</b>观察 accepted flow、payment gap、target、actual fills 与 settlement，而非只用 TNA。</li>
          <li><b>价格反事实：</b>匹配同发行人不同证券、相似但未暴露证券，或采用可信自然实验。</li>
          <li><b>动态证据：</b>检查预趋势、出售窗口、后续反转、placebo 与基本面控制。</li>
        </ol>
        <p>
          Coval–Stafford 在股票共同基金极端流量中发现共同持仓价格压力与后续反转；Lou 建立 flow-induced trading 代理；Jiang、Li、Sun 与 Wang 在公司债中把基金流动性和债券价格脆弱性连接起来。它们共同提高了机制可信度，却使用不同代理、频率和样本，效应量不能直接相加或视为普遍常数。<Cite n={10} /><Cite n={11} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">36 · 断链条件与反例库</p>
        <h2>专业机制解释必须主动寻找“有赎回却没有卖出”“有卖出却没有火售”以及“当前成本低但未来组合更脆弱”的状态。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="赎回到火售链条的断链反例，可横向滚动">
          <table className="concept-table">
            <caption>状态链上的断点</caption>
            <thead><tr><th scope="col">观察</th><th scope="col">断链机制</th><th scope="col">保留的风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">大额请求</th><td>无效、取消、gate、defer 或 suspension</td><td>队列与公告效应</td></tr>
              <tr><th scope="row">确认赎回</th><td>同期申购、自由现金、到期回款足够</td><td>buffer 下降</td></tr>
              <tr><th scope="row">现金缺口</th><td>借款或 in-kind bridge</td><td>偿还、抵押或下游出售</td></tr>
              <tr><th scope="row">Sale order</th><td>未成交或仅部分成交</td><td>支付失败与后续急售</td></tr>
              <tr><th scope="row">Actual sale</th><td>市场深度充足、成本已内部化</td><td>持仓结构变化</td></tr>
              <tr><th scope="row">价格下跌</th><td>发行人新闻或共同风险因子</td><td>赎回可能只是反应而非原因</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Choi、Hoseinzade、Shin 与 Tehranian 在控制同一发行人的信息后，只发现很少公司债基金赎回引发 fire-sale price pressure 的证据，并强调现金与选择性出售流动资产的作用。这不是对所有放大研究的否定，而是要求我们把样本期、资产、持仓推断和识别设计写进结论。反例不是脚注，而是机制边界的一部分。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="lmt-map">
        <p className="section-kicker">37 · LMT 总图</p>
        <h2>Liquidity management tools 必须按“改变哪一个状态”分类：产品设计、成本分配、数量／时间、资产交付与融资并不是同一种流动性来源。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="流动性管理工具分类，可横向滚动">
          <table className="concept-table">
            <caption>LMT 的作用节点与主要代价</caption>
            <thead><tr><th scope="col">工具族</th><th scope="col">直接改变</th><th scope="col">不自动改变</th><th scope="col">主要代价／风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">产品设计</th><td>频率、notice、settlement 与资产流动性匹配</td><td>已有市场深度</td><td>投资者便利和竞争力</td></tr>
              <tr><th scope="row">Price-based anti-dilution tools（反稀释工具，ADT）</th><td>交易价格与成本归属</td><td>外部现金和成交容量</td><td>估计误差、阈值与公平性</td></tr>
              <tr><th scope="row">Quantity / time</th><td>本期可执行数量或支付时点</td><td>底层资产价值</td><td>排队、抢跑、信号与法律风险</td></tr>
              <tr><th scope="row">In kind / side pocket</th><td>交付形式或资产隔离</td><td>系统最终处置成本</td><td>公平估值、可转让与复杂性</td></tr>
              <tr><th scope="row">Cash / borrowing</th><td>当前可支付现金或时点</td><td>长期错配</td><td>机会成本、杠杆与续作</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          FSB 2023 与 IOSCO 2025 都反对 one-size-fits-all：工具要与基金资产、投资者、渠道、运营和法域相适配，anti-dilution 工具重点处理成本归属，数量型工具需要清晰的流程与权力。它们是面向监管者的国际政策标准，不是直接对每只基金生效的全球法律。<Cite n={31} /><Cite n={32} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="product-design">
        <p className="section-kicker">38 · 产品设计先于压力处置</p>
        <h2>最根本的流动性工具不是危机当天选择卖哪只债券，而是在募集时让 dealing frequency、notice、payment 与资产变现能力相互协调。</h2>
        <p>
          每日申赎、短支付期限和高不流动资产可以同时存在，但需要更厚现金、可靠 LMT、投资者结构管理与压力治理来支持；延长 notice 或降低 dealing frequency 能把处置时间与资产市场对齐，却降低投资者便利。投资者集中也要与产品设计一起看：少数大客户可能更能理解并内部化冲击，也可能在一次退出中制造跳跃式现金需求。
        </p>
        <p>
          设计阶段应先做 reverse stress：什么最小赎回与市场深度冲击会使付款、成本、公平或治理边界失效？如果答案依赖在所有同类基金同时出售时仍能独占正常市场 ADV，设计已经把系统容量重复计算。基金级压力和系统级容量必须分层。
        </p>
      </section>

      <section className="lesson-section" id="swing-pricing">
        <p className="section-kicker">39 · Swing Pricing</p>
        <h2>Swing pricing 在净流量越过政策阈值时调整适用 NAV，把预估流动性成本更直接分配给交易投资者；阈值和 factor 都是治理对象。</h2>
        <p>
          Partial swing 只在流量超过 threshold 时调整，full swing 可在每个 dealing date 按净流方向调整。Factor 可包含 spread、佣金、税费，并在适用框架和可靠估计下包含显著 market impact。净流量阈值降低了日常小流量的运营负担，却可能在阈值附近产生离散激励；factor 过低留下 dilution，过高则反向转移价值并可能抑制有益交易。管理员的独立性、数据 cut-off、模型 vintage、override 与事后检验都应可审计。
        </p>
        <p>
          Jin、Kacperczyk、Kahraman 与 Suntheim 在 2006–2016 年英国公司债基金中发现 alternative pricing 与压力期较低 outflow、较弱 flow–performance concavity 和较小 dilution 相关。制度选择并非完全随机、样本早于当前全球框架，因此适合支持机制和情境证据，不适合宣称 swing 在所有基金中产生同一效应。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="dual-levy-fee">
        <p className="section-kicker">40 · Dual Pricing、Anti-dilution Levy 与 Redemption Fee</p>
        <h2>三者都可把流量成本交给交易者，却通过不同价格或收费路径实现；费用名称不能替代经济归属检验。</h2>
        <p>
          Dual pricing 使用买入／卖出侧价格或独立的 creation/redemption price；anti-dilution levy 在交易价外收取并留在基金；redemption fee 可能按持有期、规模或产品规则收取。判断是否降低 dilution，要看金额是否进入基金、是否与边际成本有可解释联系、是否由交易者承担，而不是只看“fee”字段。销售渠道收费若支付给中介而不进入基金，未必补偿剩余人。
        </p>
        <p>
          价格型工具还会改变现金义务：主案例中赎回价下调使基金少支付 4 万。但“少支付”是交易者承担成本，不是外部创造 4 万资产。设计需避免双重收费，把已含在 NAV、spread 或 levy 的成本重复计入；也要说明税务、会计和披露差异。
        </p>
      </section>

      <section className="lesson-section" id="gates">
        <p className="section-kicker">41 · Redemption Gates</p>
        <h2>Gate 限制某期实际执行的赎回数量，可以降低即时 cash gap，却把未满足请求变成队列、未来义务或取消权；它不创造资产。</h2>
        <p>
          Gate 可以是 fund-level 或 investor-level，也可能按比例处理所有请求；基数、阈值、谁有决定权、未执行部分是否自动递延以及何时重开，都必须来自基金文件与适用规则。收到 25% NAV 的请求、执行 8% gate，不应记成“只有 8% 投资者想赎回”，而应同时保存 gross request 25%、本期 payable 8% 和 deferred 17%。
        </p>
        <p>
          可预测 gate 还可能引发 anticipatory redemption：投资者担心未来被排队，反而提前提交。是否稳定取决于触发可预见性、成本工具、投资者结构和可信沟通，不能先验写成“gate 防止 run”。IOSCO 2025 把数量型工具的治理、披露和操作准备纳入完整框架，正是因为工具也会改变行为。<Cite n={32} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="notice-deferral">
        <p className="section-kicker">42 · Notice、Deferral 与 Settlement Extension</p>
        <h2>延长通知或支付时间把现金需求向后移动，为有序处置争取 horizon；区别在于投资者何时失去撤回权、采用哪一个 NAV、何时承担市场风险。</h2>
        <p>
          Notice period 要求投资者提前告知；deferral 把超过当期处理能力的有效请求排到以后；settlement extension 则在已处理后延后付款。三者看似都“争取时间”，但价格风险和优先级分配不同。若投资者在通知后仍暴露于未来 NAV，他们承担更多市场风险；若价格已锁定而付款延后，基金与剩余人承担的时点风险不同。
        </p>
        <p>
          队列数据因此必须保存 request time、pricing time、priority rule、partial execution、cancellation 与 payment due。只看最终付款会漏掉积压；只看请求又会夸大当前 cash gap。工具的法律可用性和对投资者公平要求因法域与文件而异。
        </p>
      </section>

      <section className="lesson-section" id="suspension-side-pocket">
        <p className="section-kicker">43 · Suspension 与 Side Pocket</p>
        <h2>Suspension 暂停申赎或支付以保护公平估值与有序管理；side pocket 隔离特定难估／不流动资产。二者都不等于基金已资不抵债。</h2>
        <p>
          Suspension 可在市场关闭、无法公平估值、资产处置不合理可行或其他规定情形下使用，具体触发和权力依法律与文件；它停止即时兑现，却保留投资者潜在退出需求，并可能释放关于资产状态的信号。Side pocket 把受影响资产与主袋分开，通常限制侧袋申赎，让主袋继续运作；公平分配、估值、费用和信息披露是核心难点。
        </p>
        <p>
          中国 2020 年公募侧袋指引、欧盟 2024/927 及后续 regulatory technical standards（监管技术标准，RTS）都将 side pocket 放在特定／异常条件中，而非日常现金工具。美国 §22(e) 对暂停与延付设定一般禁令和列举例外，也不能简化为“任何情况下七天内必须付款”。<Cite n={46} /><Cite n={39} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="tool-tradeoffs">
        <p className="section-kicker">44 · 工具组合、Announcement Effect 与公平性</p>
        <h2>有效 LMT 组合不是工具越多越安全，而是每项工具的触发、估计、权限、投资者待遇、运营容量和退出条件能够共同闭环。</h2>
        <p>
          Swing 需要及时 gross/net flow 与成本模型；gate 需要比例处理和队列；in-kind 需要可转让证券与公平篮子；borrowing 需要授权、collateral 和偿还计划；side pocket 需要资产隔离、估值和费用规则。工具之间也会相互作用：swing 可能降低抢跑，gate 的可预测阈值可能提高抢跑；借款延迟出售却提高未来偿还压力；in-kind 减少基金卖出，却可能把卖压推给赎回人。
        </p>
        <p>
          Governance 因而要回答六个问题：谁计算、谁挑战、谁决定、依据哪个数据 vintage、多久复核、怎样退出。公告本身可能改变流量，工具启动前后的信息披露和利益冲突也应被视为机制变量。任何“该工具解决流动性风险”的句子，都应补上它改变的节点、仍保留的风险和适用条件。
        </p>
      </section>

      <section className="lesson-section" id="governance">
        <p className="section-kicker">45 · Authority、Data Vintage 与审计闭环</p>
        <h2>流动性治理不是一张工具菜单，而是一套把数据、模型、权限、触发、执行和退出条件接起来的状态机。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="流动性工具治理字段，可横向滚动">
          <table className="concept-table">
            <caption>每次 LMT 或处置决策的最小审计字段</caption>
            <thead><tr><th scope="col">字段</th><th scope="col">必须保存</th><th scope="col">遗漏后的风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">Flow vintage</th><td>gross request、接受／取消、pricing 与支付批次</td><td>用事后净额回写当时决策</td></tr>
              <tr><th scope="row">Liquidity model</th><td>规模、horizon、market state、cost/depth 版本</td><td>正常日容量冒充压力容量</td></tr>
              <tr><th scope="row">Authority</th><td>owner、challenger、approver、override 与时钟</td><td>工具可用但无人有权启动</td></tr>
              <tr><th scope="row">Execution</th><td>target、order、fill、settlement 与失败量</td><td>计划被报告成结果</td></tr>
              <tr><th scope="row">Investor treatment</th><td>价格、比例、优先级、费用与披露</td><td>不公平转移和法律争议</td></tr>
              <tr><th scope="row">Exit / review</th><td>解除工具条件、队列处理、事后成本与模型检验</td><td>临时措施永久化</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          决策时可用的信息与事后实现必须分开。Swing factor 应保存估计时的 spread、market impact 与流量，不可用事后成交成本回写成“模型当时准确”；gate 启动要保存当时 request 与基数，不能用支付后 NAV 重新计算；压力报告也应显示 base、adverse 与 reverse stress，而不是只留最终红灯。
        </p>
      </section>

      <section className="lesson-section" id="stress-testing">
        <p className="section-kicker">46 · Fund-level Stress 与 Reverse Stress</p>
        <h2>压力测试要把 gross redemption、市场深度、结算、融资、处置策略与剩余组合放进同一路径；只把历史最大净流出乘二不构成完整测试。</h2>
        <ol className="research-protocol">
          <li><b>冻结对象：</b>基金、份额类别、币种、法律实体、赎回条款、payment horizon 与可用工具。</li>
          <li><b>生成 flow：</b>分别设 gross subscriptions/redemptions、取消、gate queue 与投资者集中，而非只设净额。</li>
          <li><b>重估资源：</b>自由现金、到期回款、借款、抵押品、FX 与 settlement fail。</li>
          <li><b>运行策略：</b>cash drawdown、liquid-first、pro-rata、hybrid、in-kind 与 buffer rebuild。</li>
          <li><b>计算结果：</b>付款覆盖、显性／隐性成本、剩余 NAV、composition、concentration 与下一期 coverage。</li>
          <li><b>反向求解：</b>寻找最小使 coverage&lt;1、公平估值失效或必须启动特定工具的冲击组合。</li>
        </ol>
        <p>
          系统层测试还要把所有基金的 sale targets 汇总后重新压缩 market capacity；不能让每只基金都独立使用同一笔 ADV 或同一 dealer balance sheet。FSB/IOSCO 将基金级与系统级测试分开，BIS 与 IMF 的 2020 压力研究也显示市场承接和政策反应会改变基金行为。2.17 到单基金与一阶 peer mark 为止，固定点和多轮 contagion 留给 Chapter 7。<Cite n={31} /><Cite n={33} /><Cite n={51} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="current-rules">
        <p className="section-kicker">47 · 截至 2026-08-31 的规则地图</p>
        <h2>国际标准、美国法规、欧盟指令／技术标准与中国公募规则处于不同法律层级；“某处可用”从不等于“全球基金必须使用”。</h2>
        <h3>美国：7 日法定底线、Rule 22e-4 与自愿 swing</h3>
        <p>
          Investment Company Act §22(e) 原则上禁止注册投资公司暂停可赎回证券的 redeemability 或在 tender 后超过七日付款，但列有交易所关闭／受限、紧急状态使处置不合理可行或 NAV 无法公平确定、以及 SEC 为保护持有人而命令的例外，不能简化成“所有基金任何情况下七日内卖完资产”。Rule 22e-4 要求适用开放式基金建立书面 liquidity risk management program，在正常与可合理预见压力条件下评估现金流、融资、合理预期交易规模和市场深度；“convertible to cash”包括出售完成结算。其分类、highly liquid investment minimum（高度流动投资最低额，HLIM）与 15% illiquid limit 都是治理框架，不是超阈值当天自动抛售命令。MMF 和 in-kind ETF 的适用边界需单列。<Cite n={34} /><Cite n={35} /><Cite n={37} />
        </p>
        <p>
          Rule 22c-1 维持 forward pricing，并允许符合范围的注册开放式基金在董事会批准的政策下<b>选择</b> swing pricing；MMF 与 ETF 排除。SEC 2022 年曾提出强制 swing 与统一 hard close，但 2024 final 明确当时未采纳这两部分；2025 行动只延后 N-PORT 修订日期，不能写成 swing/hard close 已实施、已延期或已正式撤回。本次官方核验未发现其被正式撤回，最安全表述是“proposed but not adopted; not current law”。<Cite n={36} /><Cite n={38} />
        </p>
        <h3>欧盟：Directive 2024/927、2026 RTS 与既有基金过渡</h3>
        <p>
          Directive (EU) 2024/927 为 UCITS 与 open-ended AIF 建立经修订 LMT 框架，通常要求在相应清单中选择至少两种适当工具，并有 MMF 等特定安排；指令仍需成员国转置。Commission Delegated Regulations (EU) 2026/465（AIF）与 2026/466（UCITS）已在 2026 年公布并生效，对 2026-04-16 后设立的新基金自该日适用；此前基金有至 2027-04-16 的一年过渡。ESMA 2026 Guidelines 与硬法层级不同，依 comply-or-explain／最大努力遵从机制落地。不得再把 2025 draft RTS 写成仍等待欧委会采纳，也不得把 Annex V 与 Annex IIA 混用。<Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={42} />
        </p>
        <h3>中国：2017 流动性专规仍是核心，费用与侧袋另有现行文件</h3>
        <p>
          《基金法》和 2014《运作管理办法》提供申购赎回、现金／一年期以内政府债券、支付与巨额赎回的上位与基础框架。证监会公告〔2017〕12号《公开募集开放式证券投资基金流动性风险管理规定》仍是公募开放式基金的核心专规；截至基准日的官方定向检索未发现已生效的全面修订／废止，搜索结果中的征求意见稿不能当现行法。该规定允许合同预先约定下的延期巨额赎回、暂停、延缓支付、短期赎回费、暂停估值、摆动定价等工具，并分别处理 15% 流动性受限资产、七工作日可变现价值和特定产品边界。<Cite n={43} /><Cite n={44} /><Cite n={45} />
        </p>
        <p>
          2020 侧袋指引用于特定资产和流动性风险情形，不是日常现金工具；证监会公告〔2025〕22号销售费用规定自 2026-01-01 起施行，并给存量基金 12 个月合同调整期，所以 2026-08-31 不能假设所有存量产品均已完成变更。具体基金仍需核对合同、招募说明书、产品类型和过渡状态。<Cite n={46} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-ladder">
        <p className="section-kicker">48 · Evidence Ladder</p>
        <h2>数据越靠近 request，越能解释投资者意图；越靠近 fill 与 matched price，越能解释市场影响。任何单一层都不能替代整条链。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="赎回与火售证据阶梯，可横向滚动">
          <table className="concept-table">
            <caption>从弱到强的机制证据</caption>
            <thead><tr><th scope="col">层</th><th scope="col">典型数据</th><th scope="col">可说什么</th><th scope="col">主要缺口</th></tr></thead>
            <tbody>
              <tr><th scope="row">AUM / return</th><td>月度 TNA、基金收益</td><td>估算净外部流量</td><td>gross、时点、现金形式</td></tr>
              <tr><th scope="row">Request / payment</th><td>申赎记录、队列、支付</td><td>确认投资者行为与义务</td><td>基金如何筹资</td></tr>
              <tr><th scope="row">Holdings</th><td>期初／期末证券数量</td><td>推断组合调整</td><td>订单、到期、公司行动</td></tr>
              <tr><th scope="row">Orders / fills</th><td>母单、子单、成交与结算</td><td>识别真实出售和成本</td><td>价格反事实</td></tr>
              <tr><th scope="row">Matched prices</th><td>同发行人／相似证券、预趋势、反转</td><td>检验额外价格压力</td><td>外生性与一般化</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “Fund flow”在商业数据库、学术研究和基金运营中可能分别指 estimated net flow、subscriptions-minus-redemptions 或已结算现金。研究协议必须把字段定义写在模型之前；若只有月度 proxy，就应降低结论语言，而不是用更复杂回归掩盖缺失状态。
        </p>
      </section>

      <section className="lesson-section" id="flow-sale-evidence">
        <p className="section-kicker">49 · Flow-driven Sales 的经验基础</p>
        <h2>经典研究支持资金流会进入基金交易并产生暂时价格压力，但样本多来自股票或推断持仓，不能直接当作每次债券赎回的成交记录。</h2>
        <p>
          Edelen 早期研究把开放式基金外部流量与流动性交易成本连接；Coval–Stafford 利用极端股票基金流量和共同持仓识别火售／购买压力；Lou 进一步构造 flow-induced trading，解释短期延续与长期反转。这一脉络的重要贡献是把“投资者流量”从基金层推进到证券层，但也依赖基金按持仓缩放、持仓披露频率与价格反转等代理。<Cite n={2} /><Cite n={10} /><Cite n={11} />
        </p>
        <p>
          公司债的场外交易、估值稀疏和 dealer 中介使机制更难直接观察。Choi 等在同发行人不同债券控制后得到有限火售证据，Jiang 等与 Jotikasthira 等则在不同设计中发现流量暴露与价格脆弱性。专业综合不是投票，而是解释为何控制组、市场状态、基金 liquidity、成交可见性与持有人结构会使识别结果不同。<Cite n={12} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="fragility-evidence">
        <p className="section-kicker">50 · Fragility、Run 与投资者结构证据</p>
        <h2>流量对坏业绩和资产不流动性的异质反应支持先动优势，却仍需与信息更新、渠道差异和大投资者冲击分开。</h2>
        <p>
          Chen–Goldstein–Jiang 的股票基金证据、Goldstein–Jiang–Ng 的公司债基金证据与 Falato–Goldstein–Hortaçsu 对 2020 年公司债基金的研究，共同表明资产流动性、现金和投资者结构会改变 outflow sensitivity。但三者覆盖不同资产与时期，且只有部分研究利用危机或制度差异。它们更适合支持“payoff complementarity 是可观测且状态依赖的”，而不是给出一条全球 run 阈值。<Cite n={4} /><Cite n={5} /><Cite n={19} />
        </p>
        <p>
          现金缓冲的证据也有双面性：它能吸收流量、减少出售；持有过高现金或 cash hoarding 又改变资产配置、收益与未来赎回激励。欧洲基金研究进一步发现 liquidity buffers 可能同时影响 outflow containment 与 fire-sales。因而“现金越多越安全”应改写为：在给定成本、投资者行为和下一期状态下，现金改变哪些路径？<Cite n={14} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="pricing-evidence">
        <p className="section-kicker">51 · Pricing Tools 的证据与识别边界</p>
        <h2>摆动定价的理论机制清晰：内部化边际成本能削弱先动激励；现实效果仍依赖 factor、threshold、数据、执行与制度选择。</h2>
        <p>
          Capponi–Glasserman–Weber 在模型中展示充分状态依赖的 swing 如何打断 redemption–fire-sale feedback；Jin 等提供英国公司债基金的制度证据；Dunne 等工作论文比较爱尔兰基金不同 LMT。理论告诉我们应测量哪些参数，经验告诉我们某些制度下发生了什么，却都不能替代当前法条或证明其他法域采用同一工具会复制相同数量效应。<Cite n={7} /><Cite n={8} /><Cite n={30} />
        </p>
        <p>
          最有价值的检验不是“采用 swing 的基金回报更好”，而是分阶段比较：成本是否更多进入交易价格、剩余 NAV dilution 是否下降、flow–performance 互补是否变弱、基金出售是否减少、证券价格压力是否下降。选择采用工具的基金可能本来就更重视风险治理，识别必须处理 self-selection。
        </p>
      </section>

      <section className="lesson-section" id="march-2020">
        <p className="section-kicker">52 · 2020 年 3 月：相容证据而非普遍系数</p>
        <h2>疫情压力同时包含赎回、现金争夺、保证金、dealer capacity、国债市场失灵与政策介入，是观察反馈的天然实验，也是最容易过度归因的时期。</h2>
        <p>
          FSB 的 holistic review、BIS 对债券基金出售的分析、IMF fixed-income fund 研究与 Ma–Xiao–Zeng 的 reverse flight to liquidity 共同记录了现金需求、基金流出和高流动性资产出售。美联储 2026 update 进一步比较 2020 年 3 月与 2025 年 4 月的美国 bank-loan/high-yield fund 状态，发现流量与流动性的关系并非每次压力都相同。<Cite n={16} /><Cite n={50} /><Cite n={51} /><Cite n={53} /><Cite n={54} />
        </p>
        <p>
          因果语言必须保留三个限制：疫情同时改变基本面和风险偏好；美联储等政策介入改变承接和反事实；部分基金数据只能观察月末持仓或流量。2020 案例最适合展示“多个机制如何同时工作”，不适合把某个出售比例当作常态压力参数。
        </p>
      </section>

      <section className="lesson-section" id="cross-product-boundary">
        <p className="section-kicker">53 · 跨产品边界诊断</p>
        <h2>同样出现“退出”与“卖压”，也可能来自完全不同的权利、时钟和治理；研究前先冻结法律载体。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="跨产品机制边界诊断，可横向滚动">
          <table className="concept-table">
            <caption>不能直接套用普通开放式基金账本的机制</caption>
            <thead><tr><th scope="col">观察标签</th><th scope="col">首先核对</th><th scope="col">真正可能形成卖压的节点</th></tr></thead>
            <tbody>
              <tr><th scope="row">ETF outflow</th><td>二级成交还是 AP 一级赎回；现金还是篮子</td><td>AP／做市库存与下游篮子出售</td></tr>
              <tr><th scope="row">MMF redemption</th><td>专门 NAV、fees、liquidity 与资产期限规则</td><td>专门现金／证券处置链</td></tr>
              <tr><th scope="row">Private-fund exit</th><td>lock-up、notice、investor/fund gate、side pocket</td><td>合同约定付款与处置窗口</td></tr>
              <tr><th scope="row">Insurance surrender</th><td>保证、退保价值、费用、准备金与资本</td><td>保险资产负债管理与现金行动</td></tr>
              <tr><th scope="row">Bank withdrawal</th><td>存款负债、准备金、融资与保险</td><td>银行流动性与资产负债表响应</td></tr>
              <tr><th scope="row">Risk-limit breach</th><td>metric、usage、authority 与候选 response</td><td>获批 order 的 actual fill</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">54 · 可证伪研究协议</p>
        <h2>不要用一条 flow–return 回归代替整个机制；把每个箭头分别做成可观察、可否证的中间结果。</h2>
        <ol className="research-protocol">
          <li><b>冻结制度：</b>基金、份额类别、cut-off、pricing、payment、工具与当时有效法律／文件。</li>
          <li><b>保存 gross：</b>分开 subscriptions、redemptions、cancellations、gated/queued 与 actual payments。</li>
          <li><b>剥离重估：</b>用一致总回报估计 net-flow proxy，并明确分配、费用、合并和 timing adjustment。</li>
          <li><b>重建冲击前状态：</b>现金、应收应付、到期流入、借款、质押、pending orders 与预定持仓。</li>
          <li><b>证明 cash gap：</b>按币种、实体和 settlement horizon 运行 waterfall。</li>
          <li><b>观察执行：</b>分开 target、parent/child orders、fills、未完成量、价格、费用与 settlement proceeds。</li>
          <li><b>测量成本：</b>显性成本、spread、impact、未售库存 mark 与剩余组合 liquidity，不重复计量。</li>
          <li><b>识别动机：</b>区分外生 liquidity need、信息更新、performance、战略互补和共同冲击。</li>
          <li><b>建立反事实：</b>预趋势、同发行人／相似证券、placebo、基本面控制、事件后反转。</li>
          <li><b>限制语言：</b>只有 shock→gap→actual fills→relative price pressure 均成立，才使用赎回驱动 fire-sale 因果语言。</li>
        </ol>
        <div className="precision-note">
          <span>最小可证伪问题</span>
          <p>在产品条款和冲击前持仓相同的现金赎回 open-end fund（开放式基金，OEF）中，一项与证券基本面相对独立的投资者流动性冲击，是否先提高已确认赎回和 payment-horizon cash gap，再提高受影响基金的 actual sell fills；高预持仓暴露证券是否相对对照证券出现额外价格压力，并在流量消退后部分反转？采用 anti-dilution pricing 的基金是否表现出更低剩余持有人稀释和更弱后续赎回互补？</p>
        </div>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">55 · Redemption Ledger &amp; Evidence Lab</p>
        <h2>十道唯一答案题强迫你在同一数字里分开 request、现金、目标、成交、成本归属和因果证据。</h2>
        <p>Mode A 的五题从 gross/net 走到 settlement gap、actual proceeds、剩余 NAV 和 buffer rebuild；Mode B 的五题区分 anti-dilution、first-mover、gate、fire-sale evidence 与 ETF/AP。题目不预选答案，提交后进入诊断；本设备记录带 schema 校验、损坏恢复和两步重置。</p>
        <RedemptionLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">56 · 主动练习 · 十道无脚本迁移题</p>
        <h2>每道静态题与 Lab 共用同一数据源，却更换数字或产品载体；先写状态和单位，再展开答案。</h2>
        <div className="practice-grid">
          {redemptionScenarios.map((scenario, index) => (
            <details className="understanding-check" key={scenario.id + '-static'}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>答案：</b>{scenario.staticTwin.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-interfaces">
        <p className="section-kicker">57 · 十二道理解检查</p>
        <h2>如果你仍会从“基金净流出”直接跳到“市场被迫抛售”，就还没有掌握本节。</h2>
        <details className="understanding-check"><summary>01 · 为什么 redemption request 不是基金卖单？</summary><p>请求还要经过有效性、cut-off、定价、现金／实物形式、净额、可用现金来源、治理选择、order、fill 与 settlement。任何一个中间节点都可能断链。</p></details>
        <details className="understanding-check"><summary>02 · Gross 与 net 为什么必须同时保存？</summary><p>Net 描述同一适用范围和时钟内的方向性现金差；gross 描述双向活动、运营负荷、持有人行为、取消和队列。Net 不能重建 gross。</p></details>
        <details className="understanding-check"><summary>03 · AUM 下跌 13%、基金回报 −5%，为什么不能说赎回 13%？</summary><p>在简化期末流量约定下，隐含净流量约为 −8%，其余是资产损失；还要检查分配、费用、流量时点、份额类别和合并。</p></details>
        <details className="understanding-check"><summary>04 · Cash gap、sale target、order、fill 与 settlement 的区别？</summary><p>Gap 是资金约束，target 是管理选择，order 是交易指令，fill 才改变持仓，settlement 才把成交债权变成可用现金。</p></details>
        <details className="understanding-check"><summary>05 · Cash buffer 为什么能断开当前卖出，却不能消灭 mismatch？</summary><p>现金可以直接支付，但会降低下一期 buffer、提高不流动资产相对占比并改变未来 coverage；它把路径推迟或改变，不一定终结。</p></details>
        <details className="understanding-check"><summary>06 · 未收费交易成本怎样进入剩余 NAV？</summary><p>若总成本 C、留在基金的 adjustment D、剩余份额 N−u，则最简每份转移为 (C−D)/(N−u)。必须避免把资产出售金额与支付重复扣除。</p></details>
        <details className="understanding-check"><summary>07 · First-mover advantage 需要什么？</summary><p>后续赎回会产生由剩余人承担的未内部化成本，而且早退出能避免该成本；个人现金需求或共同坏消息本身不构成这一条件。</p></details>
        <details className="understanding-check"><summary>08 · 大额净流出为什么不自动叫 fund run？</summary><p>Run 还要求退出决策之间的战略互补或自我强化；大额流出可以来自共同外部现金需要、再平衡或理性信息更新。</p></details>
        <details className="understanding-check"><summary>09 · Swing pricing 与 gate 的核心差别？</summary><p>Swing 改变交易价格和成本归属；gate 改变本期数量或时点。前者不提供市场深度，后者不创造现金，也可能留下队列。</p></details>
        <details className="understanding-check"><summary>10 · Fire sale 至少需要哪些证据？</summary><p>与证券基本面相对独立的约束／现金冲击、actual sell fills、有限承接下相对可信反事实的额外价格压力，并最好有预趋势、基本面控制与后续反转。</p></details>
        <details className="understanding-check"><summary>11 · ETF 零售卖出为什么不能套普通 OEF 赎回账本？</summary><p>零售二级卖出通常只是份额在投资者间转手；只有 AP 一级 creation/redemption 才改变 ETF 份额与篮子，且可为实物，不必形成基金现金出售。</p></details>
        <details className="understanding-check"><summary>12 · 中国、美国、欧盟和 IOSCO 的工具清单可以互换吗？</summary><p>不能。IOSCO/FSB 是国际标准，美国是联邦法和 SEC rules，欧盟包含需转置指令、直接适用 RTS 与 ESMA guidelines，中国有基金法、运作办法和专规；适用产品、日期、过渡与法律效果都不同。</p></details>
      </section>

      <section className="lesson-section" id="glossary">
        <p className="section-kicker">58 · 最小术语桥</p>
        <h2>先把十二个词放回状态链，再阅读论文或法规，术语才不会变成相互替代的标签。</h2>
        <div className="glossary-grid">
          <article><span>Open-end fund</span><p>投资者可依产品规则向基金申购或赎回份额；不同于单纯在二级市场找另一投资者。</p></article>
          <article><span>Redemption request</span><p>投资者提交的退出请求；尚未必成为已定价、本期应付的现金义务。</p></article>
          <article><span>Redemption price</span><p>按基金定价和 LMT 规则确定的每份支付价格，不等于资产后来真实成交价格。</p></article>
          <article><span>Gross / net flow</span><p>Gross 保存两个方向全部活动；net 是同一适用范围和时钟内的方向差。</p></article>
          <article><span>Cash buffer / floor</span><p>当前自由现金与希望支付后保留的运营下限；二者不是同一金额。</p></article>
          <article><span>Liquidity mismatch</span><p>赎回条款与资产变现时间、成本、规模和压力可靠性之间的状态差。</p></article>
          <article><span>Dilution</span><p>流量相关成本未由交易投资者承担，进入剩余 NAV 或未来组合状态。</p></article>
          <article><span>Anti-dilution tool</span><p>通过价格或收费把合理估计的流动性成本更多交给交易投资者。</p></article>
          <article><span>First-mover advantage</span><p>早退出者能避免未来由剩余人承担的未内部化成本；不是“先卖必赚”。</p></article>
          <article><span>Gate / suspension</span><p>前者限制数量，后者暂停处理／支付；具体权利和队列依文件与法律。</p></article>
          <article><span>Redemption in kind</span><p>以证券而非现金交付，减少基金即时卖出，但可把处置转移给赎回人。</p></article>
          <article><span>Fire sale</span><p>约束驱动的快速真实出售在有限深度中造成相对反事实的额外价格压力。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">59 · 课程接口、复述与阅读路径</p>
        <h2>2.17 在单基金的份额—现金—成交—剩余状态闭环处停止；多基金共同出售、dealer capacity 与系统固定点交给后续章节。</h2>
        <div className="interface-grid">
          <article><span>回接 2.03</span><h3>Active Mutual Fund</h3><p>接收法律产品、AUM、确认申赎、现金、目标与交易台；本节加入付款和成本归属。</p></article>
          <article><span>回接 1.21 / 2.04</span><h3>ETF / Passive</h3><p>区分普通现金赎回、ETF 二级交易与 AP 现金／实物篮子。</p></article>
          <article><span>回接 2.15</span><h3>Arbitrage Capital</h3><p>承接资本能否吸收折价由 2.15 提供；本节不重讲 limits to arbitrage。</p></article>
          <article><span>回接 2.16</span><h3>Risk Governance</h3><p>Cash gap 与 LMT 也是治理状态；target 经 actual fill 才进入持仓与现金。</p></article>
          <article><span>连接 2.18</span><h3>Benchmark</h3><p>处置后的 tracking drift 与相对业绩激励留给下一节。</p></article>
          <article><span>连接 2.19</span><h3>Crowding</h3><p>输出共同持仓、流量冲击与 sale fills，后续解释为何多家机构同向退出。</p></article>
          <article><span>连接 7.11–7.14</span><h3>System Feedback</h3><p>dealer absorption、融资螺旋、多基金 fire sale、contagion 与系统压力在复杂系统层闭合。</p></article>
          <article><span>连接 7.17</span><h3>Causal Identification</h3><p>交付 request→gap→fill→relative price 的分阶段、可证伪研究协议。</p></article>
        </div>
        <div className="precision-note">
          <span>85–90 分钟核心首读</span>
          <p>按 00–06（约 12 分钟）→ 07–18（约 18 分钟）→ 20–28（约 15 分钟）→ 30–36（约 14 分钟）→ 37–43（约 13 分钟）→ 48、54、57–59（约 15–18 分钟）阅读。把 19、29、44–47、49–53、Lab 全量与静态练习放到第二遍。</p>
        </div>
        <p>
          最小复述应是：<b>投资者请求先经过有效性、定价与 gross/net 处理，只有同一 payment horizon 的现金义务在自由现金、确认申购、到期回款、融资和适用 LMT 后仍留下 gap，管理人才需要选择组合响应；sale target 只有经 order、actual fill 与 settlement 才提供现金。交易成本若未由交易投资者内部化，会稀释剩余 NAV 或组合流动性并产生先动激励；只有约束驱动的真实出售在有限深度中造成可识别的额外价格压力，才称 fire sale。工具和规则因产品与法域而异，多基金反馈属于后续系统层。</b>
        </p>
      </section>
    </>
  );
}

export const lesson217: LessonRecord = {
  slug: '2-17',
  id: '2.17',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Redemption、Flow 与 Liquidity Mismatch：从投资者退出到账本、稀释与实际资产出售',
  subtitle: '把赎回请求、gross/net flow、定价与支付时钟、现金瀑布、LMT、sale target、order、fill、settlement 和 fire-sale 证据严格分层，解释何时出现成本转移、先动优势与可识别的价格压力',
  readingTime: '核心首读约 85–90 分钟；完整正文约 155–190 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习核对 20–30／完整书写 35–45，理解检查 18–25，建议分三次完成；参考文献与延伸阅读不计',
  prerequisite: '2.03；建议回看 T01、T06、T08、1.09、1.20–1.21、2.04、2.15–2.16；研究部分按需 T03、T05',
  updatedAt: '2026-08-31',
  revision: '2.17-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.17-r3',
      summary:
        '独立复核 60 个单元、58 条来源与 74 个引文落点、10 道互动题及 10 道静态孪生，并逐项核验 NAV 与份额账本、现金瀑布、target/order/fill/settlement、稀释、first-mover、gate、fire-sale 识别以及美欧中英现行规则边界；类型、规范、构建、HTTP、静态不变量与冻结哈希均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.17-r3',
      summary:
        '独立复核零背景入口、85–90 分钟核心路线、60 项目录、请求—义务—缺口—目标—成交—反馈因果链、15 个公式卡、10+10 练习、12 道检查、12 个术语与四组阅读路径，并检查唯一答案、键盘/ARIA/焦点、本地保存、无脚本、打印、移动端及真实 SSR；冻结哈希与全部运行验证一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-16', label: '2.16 VaR、Risk Budget 与 Risk Limit' },
  next: { slug: '2-18', label: '2.18 Benchmark、Active Risk 与 Tracking Error' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与路线' },
    { id: 'product-boundaries', label: '产品边界' },
    { id: 'actors-rights', label: '参与者与权利' },
    { id: 'state-chain', label: '完整状态转移链' },
    { id: 'four-clocks', label: '四只时钟' },
    { id: 'nav-ledger', label: 'NAV 与份额账本' },
    { id: 'redemption-states', label: '赎回状态' },
    { id: 'gross-net-flow', label: 'Gross / Net Flow' },
    { id: 'flow-estimator', label: 'External Flow 估计' },
    { id: 'asset-liquidity', label: '资产流动性' },
    { id: 'mismatch-definition', label: 'Mismatch 定义' },
    { id: 'mismatch-matrix', label: 'Mismatch 矩阵' },
    { id: 'cash-obligation', label: '现金义务' },
    { id: 'cash-waterfall', label: 'Cash Waterfall' },
    { id: 'eligible-cash', label: '现金来源资格' },
    { id: 'gap-not-target', label: 'Gap 不等于 Target' },
    { id: 'coverage-ratio', label: 'Scenario Coverage' },
    { id: 'target-order-fill', label: 'Target / Order / Fill' },
    { id: 'sale-optimization', label: 'Liquidation Optimization' },
    { id: 'cash-buffer', label: 'Cash Buffer' },
    { id: 'liquid-first', label: 'Liquid-first' },
    { id: 'vertical-slice', label: 'Vertical Slice' },
    { id: 'hybrid-sale', label: 'Hybrid Sale' },
    { id: 'borrowing-fx', label: 'Borrowing / FX' },
    { id: 'in-kind-boundary', label: 'Redemption in Kind' },
    { id: 'worked-ledger', label: '完整账本' },
    { id: 'dilution-ledger', label: 'Dilution Ledger' },
    { id: 'composition-dilution', label: 'Composition Dilution' },
    { id: 'exogenous-motives', label: '外生退出动机' },
    { id: 'performance-flow', label: 'Performance-to-flow' },
    { id: 'first-mover', label: 'First-mover Advantage' },
    { id: 'strategic-complementarity', label: 'Strategic Complementarity' },
    { id: 'fund-run', label: 'Fund Run' },
    { id: 'sale-not-fire-sale', label: 'Sale 不等于 Fire Sale' },
    { id: 'fire-sale-identification', label: 'Fire-sale 识别' },
    { id: 'counterexamples', label: '断链与反例' },
    { id: 'lmt-map', label: 'LMT 总图' },
    { id: 'product-design', label: '产品设计' },
    { id: 'swing-pricing', label: 'Swing Pricing' },
    { id: 'dual-levy-fee', label: 'Dual / Levy / Fee' },
    { id: 'gates', label: 'Redemption Gates' },
    { id: 'notice-deferral', label: 'Notice / Deferral' },
    { id: 'suspension-side-pocket', label: 'Suspension / Side Pocket' },
    { id: 'tool-tradeoffs', label: '工具组合与权衡' },
    { id: 'governance', label: 'Governance' },
    { id: 'stress-testing', label: 'Stress Testing' },
    { id: 'current-rules', label: '现行规则地图' },
    { id: 'evidence-ladder', label: 'Evidence Ladder' },
    { id: 'flow-sale-evidence', label: 'Flow-driven Sales' },
    { id: 'fragility-evidence', label: 'Fragility Evidence' },
    { id: 'pricing-evidence', label: 'Pricing-tool Evidence' },
    { id: 'march-2020', label: 'March 2020' },
    { id: 'cross-product-boundary', label: '跨产品边界' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: 'Redemption Lab' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'checks-interfaces', label: '理解检查' },
    { id: 'glossary', label: '术语桥' },
    { id: 'interfaces-reading', label: '接口与阅读路径' },
  ],
  Content: Lesson217Content,
  references: lesson217References,
  readingList: lesson217ReadingList,
};
