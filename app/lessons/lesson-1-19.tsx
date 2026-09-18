import ShortSellingLab from '../components/ShortSellingLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson119Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>做空不是一张“看跌订单”，而是一条必须持续获得证券、现金与时间的履约链；它能把负面信息带进价格，也会因借券稀缺、召回、交收和规则约束而突然失去行动能力。</h2>
        <p>
          想象甲认为某股票 50 元高估。甲先借入 1,000 股，卖得 50,000 元，后来若以 40 元买回并向贷款人交还等量股票，价格腿毛利为 10,000 元。但这不是完整账本：借券可能从容易借突然变为年化数十个百分点，贷款人可能为投票或出售而召回，股票期间分红需要由甲补偿，价格上涨会增加保证金压力，买回还会冲击订单簿。方向判断即使最终正确，融资和履约时钟也可能先迫使策略退出。
        </p>
        <p>
          反过来，看到 short interest 上升、fail-to-deliver 增多或股价下跌，也不能立即推出“空头操纵”。空头交易可能携带新负面信息，也可能只是对已发生下跌作反应；失败交收既可能来自短卖，也可能来自长卖和处理差错；同一个负面观点还可经 put、期货、swap、ADR 或海外市场表达。可靠分析必须把 <b>经济空头、现金卖空、证券借贷、订单执行、净额交收、持仓报告与价格结果</b> 分成不同状态，再沿因果链逐项闭合。Diamond–Verrecchia 的经典模型尤其提醒：卖空约束会减慢私人信息、特别是坏消息进入价格，但在其模型中并不自动推出价格必然长期向上偏离。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>一笔现金股票空头要从观点走到价格，至少经过十一个可分别失败的节点。</h2>
        <div className="mechanism-flow">
          <span>负面信息或对冲需求</span><i>→</i><span>目标经济空头</span><i>→</i><span>账户准入与风险限额</span><i>→</i><span>Locate / 法域对应 covered assurance</span><i>→</i><span>Short order 标记与执行</span><i>↔</i><span>实际借券（可前置或后置）/ 其他可交付库存</span><i>→</i><span>证券交付</span><i>→</i><span>借券费、担保品与公司行动</span><i>→</i><span>召回 / 保证金 / 价格反馈</span><i>→</i><span>回补</span><i>→</i><span>返还等量同种证券</span>
        </div>
        <p>
          每个箭头都由不同主体和制度控制，而且中间两步不是全球统一的严格先后顺序：已经 pre-borrow 的交易在成交前就有贷款；美国规则下只依赖合规 locate 的订单，实际借券也可在成交后、交收前落实；香港 covered assurance 又有不同承诺门槛。研究者拥有负面信号，并不意味着 prime broker 愿意给额度；取得 locate 并不等于库存已经锁定；成交并不等于按期交付；借到股票也不保证贷款不会被召回；回补买单既是退出动作，也可能抬高价格并迫使其他空头继续回补。Duffie、Gârleanu 与 Pedersen 将借券市场建模为具有搜索摩擦与议价的分散市场，D’Avolio 则用美国股票贷款数据展示借券可得性与价格的显著横截面差异。二者共同说明，证券不是一个在统一利率下无限可借的同质库存。<Cite n={3} /><Cite n={4} />
        </p>
        <div className="boundary-box"><b>本节的主问题</b><p>不是“卖空好不好”，而是：哪些负面观点能够变成可交付订单；约束首先卡住哪一个节点；主体怎样替代、退出或被迫交易；这些行为如何进入价格发现、流动性与波动；观察数据又能识别链条中的哪一段。</p></div>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 范围与先修契约</p>
        <h2>本节研究“负面观点怎样获得可执行和可持续的证券供给”；不提前展开一般杠杆清算，也不把法域规则混成一套全球制度。</h2>
        <p>
          硬先修是 T07：知道股票、期货、期权是什么合约，并能区分现货所有权与衍生品敞口。建议回看 1.04 的订单簿、1.05 的 spread、1.09 的 price impact、1.14 的流动性供给竞争与 1.18 的价格网格。本节增加 locate、loan、collateral、rebate、recall、delivery 和 short-sale rule。账户净值、维持保证金、杠杆螺旋与 forced liquidation 的一般模型留给 1.20；本节只在它们改变空头可持续性时建立接口。
        </p>
        <p>
          “Short selling”还不是一套跨法域统一动作。美国 Regulation SHO 允许满足 locate 等条件的卖空并对触发证券施加价格测试；欧盟 Article 12 允许实际借入、可执行借券权利或足够强的第三方 locate 安排；香港交易所内的受规管卖空只限指定证券且要求 covered；中国内地则以券商融券为主要现金卖空通道，并自 2024 年 7 月暂停一般转融券供给。后文所有规则卡都会同时写 jurisdiction、venue、security、account、规则版本、法律时点与数据口径，不把一个市场的“naked”“locate”或“price test”原样移植到另一个市场。<Cite n={24} /><Cite n={31} /><Cite n={33} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="objects">
        <p className="section-kicker">03 · 九个不能互换的对象</p>
        <h2>多数卖空争论不是从数据开始错，而是先把九种对象叫成了同一个“空头”。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">对象</th><th scope="col">它真正记录什么</th><th scope="col">不能自动推出什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Economic short</th><td>资产价格下跌时通常获益的净经济敞口</td><td>一定发生现金股票卖空或借券</td></tr>
              <tr><th scope="row">Short sale order / trade</th><td>卖方在成交时并不拥有或将以借入证券交付的现金市场订单 / 成交</td><td>交付必然失败、持仓会长期保留</td></tr>
              <tr><th scope="row">Locate</th><td>接单前形成“可合理借得”的依据或法域对应安排</td><td>股票已预留、已借入或已交付</td></tr>
              <tr><th scope="row">Securities loan</th><td>法律所有权、担保品、费用、召回和返还等量证券的合约</td><td>借入证券已经卖出</td></tr>
              <tr><th scope="row">On-loan</th><td>某贷款数据池中尚未归还的借出数量</td><td>等于全市场 short interest</td></tr>
              <tr><th scope="row">Short interest</th><td>指定快照日尚未平仓的报告空头头寸</td><td>当日卖空成交量或实时回补压力</td></tr>
              <tr><th scope="row">Short-sale volume</th><td>某报告范围内标记为 short 的成交量</td><td>当天净新增空头</td></tr>
              <tr><th scope="row">Fail-to-deliver</th><td>适用交收系统中到期仍未交付的状态；公开数据还可能是净额聚合口径</td><td>必然来自违法 naked short</td></tr>
              <tr><th scope="row">Net short disclosure</th><td>按特定法域、账户聚合和工具净额规则算出的报告持仓</td><td>跨国家可直接比较的“真实空头”</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这些对象可以相关，但没有恒等关系。一次借券可为做市交付、套利、税务或投票安排服务而不形成长期方向性现金空头；一天可发生大量短卖和同日回补而 short interest 几乎不变；同一经济空头又可能完全由衍生品实现。后文每个公式和实证设计都会先指定分子、分母、时间戳与覆盖范围。
        </p>
      </section>

      <section className="lesson-section" id="economic-vs-cash-short">
        <p className="section-kicker">04 · 经济空头与现金卖空</p>
        <h2>“看跌”描述收益方向；“卖空”描述一条特定的所有权与交付路径。</h2>
        <div className="equation-card">
          <span>局部方向敞口</span>
          <div>Δ<sub>econ</sub>=∂V/∂S　；　cash short q 股时，Δ<sub>econ</sub>=−q</div>
          <p>V 是头寸价值，单位为货币；S 是标的每股价格，单位为货币/股；因此 Δ=∂V/∂S 的单位等价于股数，表示价格每变动 1 元/股时头寸价值约变动多少元。直接卖空 q 股的局部 delta 是 −q；put、期货、swap 或多腿组合也可令 Δ&lt;0，但其曲率、到期、融资、对手方和交割路径不同。直白说，同样“价格跌一元会赚钱”，不代表使用了同一工具。</p>
        </div>
        <p>
          这一区分有两个后果。第一，禁止或提高现金卖空成本，不会自动消灭负面观点；交易者可能迁往期权、期货、ADR、ETF 或海外场所。第二，衍生品替代仍可能绕回现货：卖出 put 或提供 swap 的中介会按自身净 delta 对冲，可能借券卖出现货，也可能以期货或其他库存抵消。Ofek、Richardson 与 Whitelaw 记录了卖空约束与股票期权价格偏离之间的联系，但这种联系依赖借券、期权流动性和套利资本，不能把 put volume 直接换算成固定数量的隐藏现金空头。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="parties-balance-sheets">
        <p className="section-kicker">05 · 主体与资产负债表</p>
        <h2>最终价格由“谁持有观点”与“谁愿意把可交付证券和资产负债表租给他”共同决定。</h2>
        <div className="interface-grid">
          <article><span>Beneficial owner</span><h3>养老金、基金、保险与其他持有人</h3><p>出借证券以获取增量收益，但承担担保品、代理、投票丧失与召回执行风险；投资授权可能限制可借比例和对手方。</p></article>
          <article><span>Lending agent / custodian</span><h3>库存聚合与代理执行</h3><p>寻找借方、协商价格、管理担保品和公司行动；代理分成和 indemnification（代理或中介按约承担特定损失的赔偿承诺）会改变真实净收益与风险归属。</p></article>
          <article><span>Prime broker / broker-dealer</span><h3>Locate、内部化与客户准入</h3><p>聚合内部库存和外部借券，设置客户费率、集中度与召回路径；同一股票对不同客户可能有不同 all-in 条款。</p></article>
          <article><span>Short seller</span><h3>观点、套利、对冲与资本约束</h3><p>比较预期下跌、借券与执行成本、被迫退出概率；其信息优势不代表能无限等待价格纠正。</p></article>
          <article><span>Venue / clearing / depository</span><h3>订单规则与最终交付</h3><p>控制订单标记、价格测试、净额、交割与 close-out 数据；交易层和贷款层不会天然共享同一标识。</p></article>
          <article><span>Regulator / reporting regime</span><h3>边界、披露与紧急干预</h3><p>选择谁报告、何时报告、净额哪些工具、何时禁限；公开数据是规则产物，不是全知账本。</p></article>
        </div>
        <p>
          因此，“市场上还有很多股票”不等于券源充足。指数基金可以持有大量股票却因投票、赎回、集中度、对手方额度或代理规则暂不出借；prime broker 即使观察到库存，也可能因客户信用或内部风险不愿分配。借券约束本质上是多张资产负债表与法律权利的交集。
        </p>
      </section>

      <section className="lesson-section" id="lifecycle">
        <p className="section-kicker">06 · 一笔空头的生命周期</p>
        <h2>开仓只占生命周期的一小段；研究若只保留成交记录，就会看不到多数导致空头退出的状态。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">时点</th><th scope="col">必须确认的状态</th><th scope="col">典型失败</th></tr></thead>
            <tbody>
              <tr><th scope="row">下单前</th><td>可卖空资格、账户额度、locate / covered assurance、价格规则</td><td>不可借、名单不符、额度或规则阻断</td></tr>
              <tr><th scope="row">成交后至交收</th><td>实际 borrow、证券与现金净额、交付路径</td><td>库存撤回、操作差错、fail-to-deliver</td></tr>
              <tr><th scope="row">持有期间</th><td>日度 market value、担保品、fee/rebate、分红与公司行动</td><td>费用跳升、担保品缺口、公司行动错配</td></tr>
              <tr><th scope="row">事件节点</th><td>召回、buy-in、投票、账户保证金和风险限额</td><td>替代借券失败、被迫回补、流动性冲击</td></tr>
              <tr><th scope="row">退出</th><td>回补成交、返还等量同种证券、费用与税务结算</td><td>价格跳升、订单冲击、残余敞口或迟延返还</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          英国 Money Markets Code 对典型股票贷款生命周期的描述包括证券与担保品交付、持续费用与盯市、manufactured payment（借方向原出借人支付的等值公司行动款）、recall 和返还等量证券；具体法律形式与市场惯例会变化，但“交易之后仍有持续现金流与交还义务”是普遍结构。<Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="locate-borrow">
        <p className="section-kicker">07 · Locate、Pre-borrow 与 Borrow</p>
        <h2>Locate 是一条有根据的可得性判断；pre-borrow 是提前取得或锁定；actual borrow 才创建贷款合约与返还义务。</h2>
        <p>
          美国 Rule 203(b)(1) 一般要求 broker-dealer 在执行或接受 short sale order 前，已经借入证券、安排借入，或有合理根据相信证券能够借到并按期交付，并记录该依据。这里的 locate 不是一张保证最终库存永远不变的保单。被多人依赖的 easy-to-borrow list、出借人撤回、内部净额和操作流程都可能使取得 locate 的订单随后仍出现交付缺口；反过来，出现 fail 也不能倒推出 locate 必然虚假。<Cite n={24} />
        </p>
        <div className="equation-card">
          <span>前置证据、正常持仓与失败交收必须分支</span>
          <div>L<sub>pretrade</sub> → Q<sub>sold</sub>　；　Q<sub>available by settlement</sub>=Q<sub>preborrow,allocated</sub>+Q<sub>post-trade borrow,allocated</sub>+Q<sub>inventory,allocated</sub></div>
          <div>0≤Q<sub>delivered</sub><sup>trade</sup>≤min(Q<sub>sold</sub>, Q<sub>available by settlement</sub>)　；　Q<sub>gap</sub><sup>trade</sup>=Q<sub>sold</sub>−Q<sub>delivered</sub><sup>trade</sup></div>
          <div>Q<sub>FTD</sub><sup>regime</sup>=N<sub>regime</sub>(trade gaps, receive obligations, allocations)</div>
          <div>正常持仓支：Q<sub>delivered</sub><sup>trade</sup> → holding → Q<sub>cover</sub> → Q<sub>returned</sub></div>
          <div>适用失败支：Q<sub>FTD</sub><sup>regime</sup> → Q<sub>closeout</sub><sup>FTD, applicable</sup> by purchase / borrow → delivery</div>
          <p>L<sub>pretrade</sub> 是下单前符合相应法域的 locate、borrow arrangement 或 covered evidence；全部 Q 均为股数。三个 available 来源必须是专门分配给本次交付义务、彼此互斥并已扣除其他占用的净股数：例如 preborrow 到达托管库存后不能再被 inventory 重复计算。实际贷款既可能已包含在 preborrow，也可能在成交后、交收前落实。Q<sub>gap</sub><sup>trade</sup> 只是在尚未中央净额化的隔离账本中，这笔卖出尚未对应到交付的差额；它不是法定 FTD 的另一个名字。N<sub>regime</sub> 表示适用法域和清算安排对全部相关交易缺口、应收证券义务与分配记录所作的净额和归集过程。美国 Rule 204 的法定对象是清算参与者—证券层在注册清算机构的 FTD position；在美国股票清算实践中，这类头寸通常由 NSCC 的 CNS（continuous net settlement，连续净额交收）系统净额处理。SEC 公开证券级总余额还会跨参与者汇总，因此不能恢复具体参与者或订单。只有规则层产生相应 Q<sub>FTD</sub><sup>regime</sup> 时才进入适用 close-out 分支，而期限与例外仍须逐项读取。正常交付后现金空头可继续存在，直到 buy-to-cover 并返还证券；以借入关闭 fail 也不必减少经济空头。研究数据只看到其中一层时，不能替其他状态作结论。</p>
        </div>
        <p>
          欧盟 Article 12 也说明为什么“禁止裸卖空”不能被简单翻译为“每笔必须 pre-borrow”：实际借入、具有绝对可执行的借券权利，或第三方确认 locate 并采取使按期交收具有合理预期的措施，均可能满足股票卖空条件。香港的交易所内 covered-short 要求则更强，卖方须拥有可立即行使、无条件交付证券的权利或相应合理依据。跨市场比较应编码合规门槛的实际承诺强度，而不是只记录一个 naked-ban 虚拟变量。<Cite n={31} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="loan-title-collateral">
        <p className="section-kicker">08 · 法律所有权、担保品与等量返还</p>
        <h2>证券贷款通常转移可处分的法律所有权；贷款人换得担保品与合约权利，而不是保留原来那张“同一证书”。</h2>
        <p>
          借方必须能够把股票交给空头买方，因此贷款安排通常让借方取得对证券的法律所有权和处分能力；到期返还的是同一发行人的等量同种证券。原 beneficial owner 在贷款期间以担保品、对手方承诺和合约现金流替代直接持有。担保品可能是现金，也可能是政府债等非现金资产，常按证券市值的一定比例超额覆盖并每日盯市。若借方违约，贷款人需要依规则处置担保品并重新取得证券；担保品价值、流动性、错向风险和法律可执行性因而是真实风险，而非后台细节。<Cite n={29} /><Cite n={30} />
        </p>
        <div className="equation-card">
          <span>贷款担保率</span>
          <div>h<sub>t</sub>=C<sub>t</sub><sup>L</sup> /(qS<sub>t</sub>)　；　ΔC<sub>t</sub><sup>L</sup>=h* qS<sub>t</sub>−C<sub>t−</sub><sup>L</sup></div>
          <p>C<sup>L</sup> 是证券贷款层担保品市值，qS 是在借证券当前市值，单位均为货币；h 是无单位担保率，h* 是合约目标，C<sub>t−</sub><sup>L</sup> 是本次追缴前按当前价格、汇率与应计收益重估后的担保品市值。若 q=10,000、S=20 元、目标 h*=102%，所需担保为 204,000 元。ΔC&gt;0 表示需追加，ΔC&lt;0 表示按合约可释放超额担保。真实合约还规定估值源、币种、门槛、最小转移额、日内调用和净额集合。</p>
        </div>
      </section>

      <section className="lesson-section" id="fees-rebates">
        <p className="section-kicker">09 · Fee、Rebate 与 Specialness</p>
        <h2>现金担保贷款常以 borrower rebate 报价，非现金担保更常以显式 loan fee 报价；负 rebate 不等于负成本。</h2>
        <p>
          现金担保下，贷款人或代理可将现金再投资，并向借方支付一条 rebate rate。易借股票的 rebate 往往接近一般担保基准；难借股票的 rebate 更低，甚至为负——此时借方不仅交付现金担保，还按负 rebate 的经济含义继续付费。研究常定义 specialness 为同日 general-collateral 基准 rebate 减去该股票实际 rebate。非现金担保没有同一现金收益链，通常直接报年化 loan fee。D’Avolio 与 Geczy–Musto–Reed 显示，借券成本和可得性在股票之间高度异质，且受机构持股与借贷供给影响。<Cite n={4} /><Cite n={5} />
        </p>
        <div className="equation-card">
          <span>相对稀缺价格</span>
          <div>σ<sub>i,t</sub>=r<sub>t</sub><sup>GC</sup>−r<sub>i,t</sub><sup>rebate</sup></div>
          <p>i 表示证券，t 表示观察时点；r<sup>GC</sup> 与 r<sup>rebate</sup> 必须是同币种、同现金担保类型、同年化和日数口径的利率。σ 以百分点或基点计，越大表示相对更 special。若 GC=4.8%、实际 rebate=−1.7%，σ=6.5 个百分点。它不是终端客户 all-in fee：经纪商加价、代理分成、现金再投资损益、融资和税务仍可能在数据外。</p>
        </div>
        <div className="boundary-box"><b>符号护栏</b><p>数据库中的 “fee”、borrow rate、rebate 和 specialness 可能方向相反。导入数据前必须保存 quote side、担保类型、benchmark、年化日数、代理或客户层级；绝不能看到 −1.7% 就自动解释成客户获得 1.7% 补贴。</p></div>
      </section>

      <section className="lesson-section" id="availability-utilization">
        <p className="section-kicker">10 · Availability、Utilization 与搜索</p>
        <h2>借券供给不是发行股数，而是特定代理网络在特定时点愿意、能够且获准出借的库存。</h2>
        <div className="equation-card">
          <span>贷款池利用率</span>
          <div>U<sub>i,t</sub>=Q<sub>i,t</sub><sup>on-loan</sup> / Q<sub>i,t</sub><sup>lendable</sup></div>
          <p>i 表示证券，t 表示观察时点；分子是该数据池已借出未归还股数，分母是同一时点、同一覆盖池定义的总 lendable inventory，二者单位均为股，U 在口径有效时介于 0 与 1。若 72 万股已借、总可供给 90 万股，U=80%。在普通实数算术中，0/0 与正分子/0 都未定义：前者记 NA，后者另标 denominator-invalid / “分母不一致或越界”，不能写成商值 +∞、当作有限 utilization，更不能填 0。该指标不表示全市场 80% 流通股被卖空，也不等于借方还能稳定取得剩余 18 万股。</p>
        </div>
        <p>
          同一只股票可以在代理 A 宽松、代理 B 紧张，因为 beneficial owner、客户名单、对手方额度和内部库存不同。搜索摩擦使借方需要逐个寻找供给者，议价权又取决于替代库存和关系；因此贷款费既是稀缺信号，也是市场结构和客户分层的结果。Duffie–Gârleanu–Pedersen 的搜索模型解释了为什么相同证券可同时存在价格分散与延迟匹配，现实数据中的 vendor coverage 也必须被视为抽样框，而不是全市场真值。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="fee-endogeneity">
        <p className="section-kicker">11 · 借券价格为什么内生</p>
        <h2>高借券费可能来自悲观看法需求，也可能来自供给撤回；它既不是纯粹信息分数，也不是外生交易成本。</h2>
        <div className="mechanism-flow">
          <span>负面信号更强</span><i>→</i><span>借券需求上升</span><i>→</i><span>utilization 与 fee 上升</span><i>→</i><span>边际空头退出</span><i>→</i><span>剩余 short 更被选择</span>
        </div>
        <div className="mechanism-flow">
          <span>出借人召回 / 风险限额收紧</span><i>→</i><span>lendable supply 下降</span><i>→</i><span>fee 上升</span><i>→</i><span>回补压力上升</span><i>→</i><span>价格与贷款条件反馈</span>
        </div>
        <p>
          两条链产生相同的“fee 上升”，但第一条更像需求和信息，第二条更像供给冲击。Cohen、Diether 与 Malloy 将借券市场的需求和供给变化结合起来预测收益；Engelberg、Reed 与 Ringgenberg 进一步把 short sellers 的信息与融资成本分开。它们支持把 loan quantity 和 loan price 联合使用，却不允许仅凭一个高费率把因果方向定为“聪明钱看空”。<Cite n={7} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="short-pnl">
        <p className="section-kicker">12 · 空头净损益账本</p>
        <h2>空头收益必须把价格、持有时间、证券贷款、公司行动、执行、融资与被迫退出分栏。</h2>
        <div className="equation-card">
          <span>教学净损益</span>
          <div>Π<sub>T</sub>=q(S<sub>0</sub>−S<sub>T</sub>)−q∫<sub>0</sub><sup>T</sup>b<sub>t</sub>S<sub>t</sub>dt−qD<sub>[0,T]</sub>−C<sub>exec</sub>−C<sub>fin</sub>−C<sub>forced</sub></div>
          <p>q 是股数；S 是货币/股；T 和积分时间 t 以年计；b<sub>t</sub> 是按本式定义的年化有符号净借券成本率；D 是持有期每股需补偿的累计现金分配；所有 C 都是货币，分别表示执行、其他融资和被迫退出成本。因此每一项最终都是货币。真实合约可能按日度贷款市值、360/365 日、现金或非现金担保及代理费计算，本式是研究账本，不是客户结单模板。</p>
        </div>
        <div className="worked-example">
          <span>方向正确仍不等于账本盈利</span>
          <p>卖空 500 股，40 元卖出、45 天后 34 元回补；若教学上按初始市值收年化 12% 借券费，期间每股现金分配 0.20 元，双边执行与滑点 0.08 元/股，则价格毛利 3,000 元，借券费约 295.89 元，分配补偿 100 元，执行成本 40 元，净利约 2,564.11 元。若费用突然跳升或回补冲击更大，结论可继续反转。</p>
        </div>
      </section>

      <section className="lesson-section" id="asymmetric-payoff">
        <p className="section-kicker">13 · 收益不对称与时间不对称</p>
        <h2>现金空头的价格腿最大毛利有限、理论损失无上界；而坏消息何时进入价格与融资何时到期并不同步。</h2>
        <div className="equation-card">
          <span>仅看价格腿的边界</span>
          <div>Π<sup>price</sup>=q(S<sub>0</sub>−S<sub>T</sub>)≤qS<sub>0</sub>　；　当 S<sub>T</sub>→∞ 时，Π<sup>price</sup>→−∞</div>
          <p>股票价格下限为 0，所以不计成本时最大价格毛利是初始卖出收入 qS<sub>0</sub>；上涨在理论上没有固定上限，因此价格腿损失无界。直白说，多头可以等“最终价值”，空头还必须活过中途上涨、费用和召回。</p>
        </div>
        <p>
          这会形成 timing risk。一个基本面判断可在两年后正确，但贷款可能明天被召回，保证金今天被追加，投资者本季度赎回。Jones 与 Lamont 的历史“loan crowd”数据表明，借券困难和高成本股票后来收益较低，但持有这些空头需要真实成本；这不是一项任何交易者都能无风险坚持到终点的套利。<Cite n={6} />
        </p>
        <div className="equation-card">
          <span>实际退出是多个时钟的最小值</span>
          <div>τ=min(T<sub>view</sub>,T<sub>recall</sub>,T<sub>margin</sub>,T<sub>buy-in</sub>,T<sub>risk</sub>)</div>
          <p>每个 T 都以时间计，分别是观点目标期、召回、保证金、buy-in 与内部风险限额触发时点；τ 是真正结束或缩减头寸的时点。直白说，终值回归发生在 T<sub>view</sub> 也没有用，如果其他时钟先到。本式不假定这些时钟彼此独立。</p>
        </div>
      </section>

      <section className="lesson-section" id="corporate-actions">
        <p className="section-kicker">14 · 分红、公司行动与投票权</p>
        <h2>贷款期间法律持有人获得发行人权利；原出借人通过 manufactured payment 与召回条款恢复经济结果，但并不自动保留投票。</h2>
        <p>
          股票分红时，发行人向登记持有人付款；空头借方通常依据贷款合约向出借人支付等值金额。拆股、要约、配股和其他公司行动还可能改变应返还的证券数量或选择权。由于法律所有权随贷款转移，投票权通常随登记持有人走；原出借人若要在记录日前投票，可能需要召回。SEC 对基金证券借贷的指导明确讨论了投票权转移、等值分配补偿与为重要投票召回的治理问题。<Cite n={29} />
        </p>
        <div className="boundary-box"><b>“经济上等价”不等于每个维度不变</b><p>Manufactured dividend 可以复制现金金额，却可能具有不同税务、时点或法律处理；召回可恢复投票能力，却会给借方造成融资冲击。研究公司行动窗时必须同时标记 record date、ex-date、payment date、loan recall 和实际返还。</p></div>
      </section>

      <section className="lesson-section" id="collateral-vs-margin">
        <p className="section-kicker">15 · Loan Collateral 与 Short Margin</p>
        <h2>证券贷款担保品保护出借人；交易账户保证金保护经纪商。它们可能同时上升，却不是同一笔钱、同一比例或同一触发器。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">层</th><th scope="col">保护谁</th><th scope="col">主要随什么变化</th><th scope="col">失败后的动作</th></tr></thead>
            <tbody>
              <tr><th scope="row">证券贷款 C<sup>L</sup></th><td>贷款人 / lending agent</td><td>在借证券市值、担保品价值、合约 haircut</td><td>补担保、替换担保、终止或处置</td></tr>
              <tr><th scope="row">交易账户 M<sup>S</sup></th><td>broker / clearing chain</td><td>空头市值、账户权益、集中度、波动与规则</td><td>追加保证金、降低额度、强制回补</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          同一上涨会同时提高 qS：贷款层需要更多担保，账户层空头负债增加并侵蚀权益。若借方通过 prime broker 把两层现金流内部化，外部观察者更容易误以为只有一个 margin call。1.20 将正式推导账户权益、维持保证金与 forced liquidation；本节只保留接口：贷款可得性冲击可以在尚未触发账户违约前迫使回补，账户风险限额也可在贷款仍有效时主动削减空头。
        </p>
      </section>

      <section className="lesson-section" id="term-recall">
        <p className="section-kicker">16 · Open Loan、Term Loan 与 Recall</p>
        <h2>Open loan 给双方灵活性，也把融资期限留在可随时改变的状态；term loan 提供期限承诺，却仍受公司行动、违约与合约条款约束。</h2>
        <p>
          许多股票贷款是 open：任何一方可依通知终止，费率也可重新议定。贷款人可能因出售证券、赎回、投票、风险或更高报价而召回；借方可以返还库存或在费用上升时退出。Term loan 则约定期限和价格条件，能降低普通召回风险，但不是“永不变化”：合约仍要处理抵押品、发行人事件、替代交付、违约与提前终止。
        </p>
        <div className="mechanism-flow">
          <span>Recall 数量 R</span><i>→</i><span>内部库存净额</span><i>→</i><span>替代借券 B</span><i>→</i><span>市场回补 C</span><i>→</i><span>按期返还</span>
        </div>
        <div className="equation-card">
          <span>召回闭合条件</span>
          <div>R≤B+C+I　；　Q<sub>short,new</sub>=Q<sub>short,old</sub>−C</div>
          <p>R、B、C 与内部可交付库存 I 均为股数。替代借券 B 只是更换贷款来源，不减少经济空头；市场回补 C 才降低现金空头。若 50 万股头寸收到 30 万股 recall，替代借 12 万、回补 18 万即可闭合，剩余经济空头为 32 万股。若不等式失败，才进入迟延交付、buy-in 或其他合约与监管路径。</p>
        </div>
      </section>

      <section className="lesson-section" id="delivery-closeout">
        <p className="section-kicker">17 · Delivery、Fail、Buy-in 与 Close-out</p>
        <h2>失败交收是交收日的未交付状态；close-out 是之后消除缺口的规则动作；buy-in 则是特定合约或基础设施下为取得证券而执行的购买。</h2>
        <p>
          美国 Rule 204 要求清算参与者在规定时限内通过购买或借入同种证券关闭 fail-to-deliver，并对未按规则关闭的情形施加进一步限制。美国标准证券交收周期自 2024 年 5 月 28 日缩短为 T+1，SEC 同时说明这会缩短 Rule 204 相关时间框架。由于 SEC FAQ 中仍可见与旧周期相关的历史例外文字，本节不把一切 fail 粗暴写成某个固定“T+几”；实证必须读取交易日当时有效的证券类型、原因、例外与相对交收日规则。<Cite n={24} /><Cite n={26} />
        </p>
        <p>
          SEC 公布的 FTD 数据是每个交收日中央净额结算系统的 aggregate net balance：它是存量净余额，不是当天新增 flow，也不能由连续出现的数值直接恢复同一笔 fail 的年龄；fail 可由长卖或短卖的多种原因产生。SEC 明确警告，FTD 本身不是存在 abusive 或 naked short selling 的证据。研究者至少应把 trade date、settlement date、netting、security identifier、corporate action、close-out clock 与 position data 对齐。<Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="naked-myths">
        <p className="section-kicker">18 · “Naked Short” 的六个常见误判</p>
        <h2>Naked 描述未由相应借入或可交付安排支持的卖空状态；它不是所有下跌、所有 fail、所有高 short volume 或所有合成空头的统称。</h2>
        <div className="counter-grid">
          <article><span>误判 01</span><h3>FTD = naked short</h3><p>Fail 可来自长卖、处理或净额问题；需要订单、locate、borrow、delivery 与 close-out 证据链。</p></article>
          <article><span>误判 02</span><h3>有 locate = 已借到</h3><p>Locate 只在相应规则下支持合理可得性；除非 pre-borrow / reservation，库存仍可能变化。</p></article>
          <article><span>误判 03</span><h3>Short volume = 新增空头</h3><p>日内做市、对冲与同日回补可使 gross short trades 很大而期末净头寸很小。</p></article>
          <article><span>误判 04</span><h3>Put = naked short</h3><p>Put 是衍生品负 delta；是否引发现金借券取决于中介净对冲和其他库存。</p></article>
          <article><span>误判 05</span><h3>借券突然收紧 = 原交易违法</h3><p>Recall 和供给撤回是贷款生命周期风险，不能反推最初订单动机与合规。</p></article>
          <article><span>误判 06</span><h3>禁止裸卖空 = 禁止一切卖空</h3><p>不同法域通常允许满足 borrow、locate 或 covered 条件的卖空，并另设豁免与价格规则。</p></article>
        </div>
        <p>
          这不是说违法裸卖空不存在，而是说指控强度必须与证据强度匹配。最弱数据只支持描述交收缺口；要识别规则违反，需建立适用法域、订单标记、locate 合理性、例外、借入与交付时钟；要识别操纵，还需额外证明欺骗或操纵性行为与因果影响。监管、民事责任和刑事标准也不可互换。<Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="marking-execution">
        <p className="section-kicker">19 · Order Marking 与执行</p>
        <h2>Short 标记首先服务规则路由和监管记录；它记录订单在当时账户与交付状态下的类别，不等于交易者最终方向观点。</h2>
        <p>
          美国 Regulation SHO Rule 200 要求相关订单标记 long、short 或 short exempt（依法豁免相应价格测试的卖空标记）；香港也要求受规管 short order 提供 covered assurance 并由中介和交易所参与者沿订单链标记。一个持有股票的做市商可因净头寸计算、期权对冲或不同账户而产生 short 标记；一个总体看跌的基金也可能用 put 而没有任何 short-marked 现货成交。标记规则的账户聚合、所有权、净头寸、例外与纠错路径决定了字段含义。<Cite n={24} /><Cite n={34} />
        </p>
        <div className="boundary-box"><b>交易数据的最小合同</b><p>保存原始 order side、long/short/short-exempt mark、account aggregation、route、venue、display/execution price、national best bid（NBB，全国最优买价）/本地报价、partial fill、cancel、trade correction 与 regulator-defined timestamp。只有成交级 short volume 而没有订单和账户链时，不得声称识别了“谁主动建立了多少净看空头寸”。</p></div>
      </section>

      <section className="lesson-section" id="price-tests">
        <p className="section-kicker">20 · Price Test 与 Circuit Breaker</p>
        <h2>价格测试不消灭空头观点，而是限制普通空头订单何时可以立即打到买价；它因此同时改变成交概率、排队和路由。</h2>
        <p>
          美国 Rule 201 以证券前一交易日收盘价为基准，盘中下跌 10% 时触发 circuit breaker；触发后，在当日剩余时间和下一交易日，普通 non-exempt short sale 一般不得在当前 national best bid 或更低价格显示或执行。若当前 NBB 为 44.80 美元，44.80 的普通空头订单不能通过该价格测试，而高于 NBB 的 44.81 在忽略其他规则并假定合法报价的题面下可以；NBB 变化后必须重新判断。它不是全面禁空，也不是把门槛永久固定在触发成交价。<Cite n={25} />
        </p>
        <p>
          香港的价格限制采用不同制度：受规管卖空只限指定证券，并在连续、开收市等环节按相应 reference price / current best ask 规则执行，另有规定豁免。沪深交易所现行细则均规定融券卖出一般不得低于最近成交价；当日尚无成交时不得低于前收盘价，交易所认可产品可有例外。研究“uptick rule”不能只放一个国家虚拟变量，至少要编码 trigger、reference price、duration、order mark、exception、venue state 与未成交路径。<Cite n={33} /><Cite n={36} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="measurement-stack">
        <p className="section-kicker">21 · 四层测量栈</p>
        <h2>一项卖空研究必须同时说明它测的是贷款、交易、持仓还是交收；四层时钟和分母不同。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">层</th><th scope="col">常见变量</th><th scope="col">正确读取</th><th scope="col">主要缺口</th></tr></thead>
            <tbody>
              <tr><th scope="row">Loan</th><td>lendable、on-loan、utilization、fee/rebate、recall</td><td>某数据池的证券融资状态</td><td>覆盖供应商、客户层级、未成交借券需求</td></tr>
              <tr><th scope="row">Trade</th><td>short order / trade volume、short-exempt、price test</td><td>报告范围内 gross 执行活动</td><td>净新增、跨场所与衍生品观点</td></tr>
              <tr><th scope="row">Position</th><td>short interest、net short disclosure、days to cover</td><td>指定快照与净额定义下的未平仓头寸</td><td>快照间路径、账户映射、工具覆盖</td></tr>
              <tr><th scope="row">Settlement</th><td>FTD、age/close-out（若可得）</td><td>净额交收与未交付状态</td><td>订单动机、逐笔来源与违法意图</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>两个常见比例</span>
          <div>SI<sub>float</sub>=Q<sup>SI</sup>/Q<sup>float</sup>　；　DTC=Q<sup>SI</sup>/ADV</div>
          <p>Q<sup>SI</sup> 是快照日 short interest，Q<sup>float</sup> 是同口径流通股，单位均为股；ADV 是预先冻结窗口的平均日成交股数，DTC 单位为“按历史平均速度计的天”。任一比率遇到 0/0 都记 NA；SI / float 的正分子除以零标 denominator-invalid。若 DTC 的正 short interest 遇到 ADV=0，普通实数商同样未定义；研究系统为排序而预先编码 +∞ 时，必须声明它只是扩展非负实数中的边界哨兵，含义是“按冻结口径没有有限覆盖速度”，不得混入有限值均值或冒充实际商。所有这些状态都绝不能填 0。DTC=3 不表示空头未来一定三天回补完，也不考虑买单冲击、可交易量占比或同步退出。</p>
        </div>
        <p>
          FINRA 明确区分每月两次报告的 short interest 快照与 daily short sale volume；后者只覆盖规定范围内的报告成交，不能用于恢复未平仓头寸。美国新的证券贷款与机构 short-position 透明度制度也尚未在 2026 年提供可直接使用的完整新面板：Rule 13f-2 / Form SHO 获豁免至 2028 年 1 月 2 日，Rule 10c-1a 的报告与公开传播被分别延后至 2028 年 9 月 28 日与 2029 年 3 月 29 日，FINRA SLATE 启动亦延至 2028 年 9 月 28 日。把已通过规则写成已上线数据会造成 look-ahead。<Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={42} />
        </p>
        <div className="boundary-box"><b>Short interest 超过 100% 不自动等于“假股票”</b><p>A 把股票借给 B，B 卖给 C；若 C 所在账户允许再次出借，同一股经济链上可以出现第二笔贷款与第二个开放空头，而最终买方各自拥有其买入证券，原出借者持有返还等量证券的合同请求权。开放空头合计因再借链可能超过估计 float；float 分母和公司行动误差也会放大比例。它提示拥挤和链条复杂度，却不能单独证明 naked short、FTD 或违法重复所有权。</p></div>
      </section>

      <section className="lesson-section" id="heterogeneity">
        <p className="section-kicker">22 · 约束异质性</p>
        <h2>“可卖空”不是零一属性；股票、账户、出借网络、时间、事件与替代工具共同决定边际约束。</h2>
        <div className="interface-grid">
          <article><span>Security</span><h3>市值、流通盘与机构持股</h3><p>大盘指数成分通常 lendable supply 更深；小盘、IPO、并购与高内部人持股股票更可能 special，但不存在无条件阈值。</p></article>
          <article><span>Owner</span><h3>谁愿意出借</h3><p>被动基金、主动基金、养老金和零售全额支付账户有不同授权、投票与风险政策。</p></article>
          <article><span>Borrower</span><h3>客户信用与关系</h3><p>额度、净额、集中度与经纪商关系使同一证券出现不同 locate 质量和 all-in price。</p></article>
          <article><span>Time</span><h3>事件与日内状态</h3><p>财报、除权、投票、指数调整、赎回和市场危机可同时移动需求、供给和交收风险。</p></article>
          <article><span>Jurisdiction</span><h3>名单、价格与报告</h3><p>法域定义哪些证券、账户与工具可用，何时需要 locate、covered assurance、披露或禁限。</p></article>
          <article><span>Substitute</span><h3>Put、future、swap 与海外证券</h3><p>替代品的深度、basis、保证金和中介对冲决定现金约束能否真正约束经济观点。</p></article>
        </div>
        <p>
          因而平均处理效应很容易掩盖核心机制。借券供给增加对原本 easy-to-borrow 股票可能几乎没有价格效应，对临界 special 股票却可改变边际交易者；价格测试对拥有被动挂单耐心的策略影响小，对必须立即对冲的 dealer 影响大。研究应预先按改革前状态分层，而不是事后挑出显著组。
        </p>
      </section>

      <section className="lesson-section" id="negative-information">
        <p className="section-kicker">23 · 负面信息怎样进入价格</p>
        <h2>卖空最直接的价格发现作用，是让没有现货库存的悲观知情者也能成为边际卖方；约束会降低其交易强度并延迟坏消息反映。</h2>
        <div className="mechanism-flow">
          <span>私有负面信号</span><i>→</i><span>目标空头规模</span><i>→</i><span>借券与规则过滤</span><i>→</i><span>可执行卖单</span><i>→</i><span>订单流与报价更新</span><i>→</i><span>价格吸收信息</span>
        </div>
        <p>
          Diamond–Verrecchia 预测，当知情者可能受到卖空约束时，缺少卖出并不容易被市场解释，因为它既可能表示“没有坏消息”，也可能表示“有坏消息但无法交易”；负面信息因此较慢进入价格。Boehmer、Jones 与 Zhang 发现不同类型的 short sellers 信息含量不同，机构空头交易与随后收益存在联系；Diether、Lee 与 Werner 也发现短卖者在短期价格上涨后更活跃并能预示负收益。它们支持“部分空头交易有信息”，不支持“每一笔 short-marked trade 都知道基本面真相”。<Cite n={2} /><Cite n={8} /><Cite n={9} />
        </p>
        <div className="boundary-box"><b>双向因果</b><p>坏消息可以引发卖空，卖空也可以使价格更快反映坏消息；价格下跌又会吸引趋势、套利、做市对冲或回补。没有时间顺序、工具变量或制度冲击，short activity 与未来收益的相关性不能拆出这些方向。</p></div>
      </section>

      <section className="lesson-section" id="disagreement-overvaluation">
        <p className="section-kicker">24 · 分歧、乐观者定价与高估</p>
        <h2>当观点分歧大而悲观者不能充分卖空，价格更可能由较乐观且能持有现货的人决定；但这一结论依赖持有与供给结构。</h2>
        <p>
          Miller 的经典直觉是：若不同投资者对价值判断分歧显著、股票供给有限且卖空受限，悲观者无法表达完整需求，价格可能偏向乐观者估值；随着新供给或观点收敛，价格回落。这个框架把“高分歧＋强约束”而不是单独高 short interest 视为高估风险。<Cite n={1} />
        </p>
        <p>
          需要三道边界。第一，Diamond–Verrecchia 的理性预期模型强调调整速度而非自动高估，两类模型的信念与信息结构不同。第二，实际可流通供给、机构借贷、期权和套利资本会削弱约束。第三，observed fee 和 dispersion 内生于同一风险事件。Hong 与 Stein 的差异意见模型把被压抑的坏消息和市场下跌联系到 crash dynamics，但这不是“任何高分歧股票都会崩”的单变量预言。<Cite n={2} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="supply-counterexample">
        <p className="section-kicker">25 · 供给冲击与零效应反例</p>
        <h2>借券供给增加会先降低贷款市场稀缺价格；它是否继续进入现金价格、波动和流动性，取决于原约束是否 binding。</h2>
        <div className="mechanism-flow">
          <span>Lendable supply ↑</span><i>→</i><span>fee ↓ / quantity ↑</span><i>→</i><span>边际空头是否进入？</span><i>→</i><span>现货 order flow 是否变化？</span><i>→</i><span>价格与市场质量</span>
        </div>
        <p>
          Kaplan、Moskowitz 与 Sensoy 随机决定机构股票是否进入可借池，得到了极少见的真实供给实验：供给冲击降低借券费、增加借出数量，却在其样本与统计精度下没有检测到股票收益、波动、偏度或 bid–ask spread 的影响。这不是证明证券借贷永远不重要，而是一个关键反例：第一阶段很强，并不保证下游价格阶段也强；若新增库存流向未受约束股票、边际借方没有新信息或数量相对市场很小，现货结果可以接近零。<Cite n={12} />
        </p>
        <p>
          因此，一项合格研究必须报告 first stage：名单资格是否真的提高 lendable、降低 fee 或增加 borrow；再报告现金 short activity 是否变化；最后才检验价格。只有“制度宣布扩大供给”而没有中间状态，不能把零价格效应解释成理论失败，也不能把显著价格效应自动归给借券通道。
        </p>
      </section>

      <section className="lesson-section" id="liquidity-quality">
        <p className="section-kicker">26 · 流动性与价格质量</p>
        <h2>允许更多卖空可增加悲观方和做市对冲的卖单，也可提高逆向选择；spread、depth 与 price discovery 不必同方向。</h2>
        <p>
          机制至少有三条。其一，更多交易者能在买价过高时卖出，报价更快向共同信息移动，定价误差和延迟可下降。其二，知情空头更容易交易时，流动性提供者面对的 adverse selection 上升，可能扩大 spread 或减少 depth。其三，做市商与套利者可借券对冲，库存风险下降又可能改善双边流动性。净结果取决于谁是边际借方、信息不对称和原来约束。
        </p>
        <p>
          Saffi 与 Sigurdsson 的跨国证券贷款数据将较弱卖空约束与较短价格响应延迟、市场冲击更快被吸收联系起来，并检验收益分布；香港名单纳入的 Chang–Cheng–Yu 研究与中国试点研究也利用资格变化识别价格和交易效果。但名单通常按市值、成交量与流动性选择，制度开放还可能伴随其他改革，所以跨国相关和名单事件都需要反事实设计。<Cite n={11} /><Cite n={18} /><Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="volatility-crash">
        <p className="section-kicker">27 · 波动、跳跃与崩盘风险</p>
        <h2>卖空既可能把坏消息平滑地提前带入价格，也可能在约束解除或累积信息集中释放时伴随大幅下跌；波动方向没有无条件答案。</h2>
        <div className="mechanism-flow">
          <span>持续可卖空</span><i>→</i><span>坏消息逐步交易</span><i>→</i><span>价格误差较早修正</span><i>→</i><span>未来集中跳跃或下降</span>
        </div>
        <div className="mechanism-flow">
          <span>约束压住悲观交易</span><i>→</i><span>坏消息与分歧积累</span><i>→</i><span>约束 / 信念状态突变</span><i>→</i><span>集中下修与相关性上升</span>
        </div>
        <p>
          但开放卖空也可提高当期信息交易和逐笔波动；危机时的卖空活动又是坏消息严重程度的内生反应。只比较开放前后 realized volatility，无法区分信息进入速度、微观结构噪声、基本面风险与制度选择。更好的结果向量同时包含日内价格效率、负收益偏度、jump、future crash、spread、depth、volatility decomposition 和信息公告后的 drift，而不是用单一波动率判定福利。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="squeeze-feedback">
        <p className="section-kicker">28 · Short Squeeze 的正反馈</p>
        <h2>Squeeze 不是“short interest 很高”的同义词，而是价格上涨、融资收紧与同步回补闭合成自我强化循环。</h2>
        <div className="mechanism-flow">
          <span>价格上涨 / fee 跳升 / recall / margin</span><i>→</i><span>可承受空头规模下降</span><i>→</i><span>回补买单</span><i>→</i><span>薄弱 ask depth 被吃掉</span><i>→</i><span>价格进一步上涨</span><i>→</i><span>更多账户越过约束</span>
        </div>
        <div className="equation-card">
          <span>同步回补压力代理</span>
          <div>Pressure<sub>t</sub>(Δp)=Q<sub>forced,t</sub>/D<sub>t</sub><sup>ask</sup>(Δp)</div>
          <p>t 是观察时点；Δp 是从当时参考价向上的预注册价格容忍区间，必须在同一币种/股或统一 bp 坐标表达。Q<sub>forced</sub> 是指定时窗内因 recall、风险限额或保证金必须购买的股数；D<sup>ask</sup> 是该 Δp 内可成交的卖方深度，二者单位均为股。0/0 记 NA；若 Q<sub>forced</sub>&gt;0 而 D<sup>ask</sup>=0，普通实数商未定义。研究系统若预先编码 +∞，必须声明它只是扩展非负实数的边界哨兵，表示“该容忍区间内没有可用卖方深度”，并与有限 Pressure 分开汇总。比值越高表示强制买量相对可用深度越大，但现实中 Q<sub>forced</sub> 通常不可直接观察，应以贷款召回、账户数据或预先定义的代理测量，不能用事后涨幅反推。</p>
        </div>
        <p>
          Brunnermeier–Pedersen 的 predatory trading 模型说明，知道他人被迫交易的主体可能顺势先行，使流动性需求进一步恶化；Jarrow 则从操纵与 squeeze 的价格动态讨论可支配供给的重要性。它们提供机制，不意味着每次剧烈上涨都由操纵造成。<Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="bans">
        <p className="section-kicker">29 · 危机卖空禁令</p>
        <h2>禁令直接压低受限现金市场的空头执行，却会同时改变做市对冲、选择偏差、场所迁移和信息进入；“价格得到支撑”不是可自动推断的结果。</h2>
        <p>
          2008 年危机提供了多国和多证券的禁令事件。Boehmer、Jones 与 Zhang 对美国金融股禁令、Beber 与 Pagano 对全球禁令、Marsh 与 Payne 对英国禁令的研究，大体发现流动性和价格发现恶化，并未得到稳定的价格支持证据；但受限证券往往正是风险最高、政策最密集的金融机构，救助、资本规则、名单选择与市场恐慌同时发生，因此结果应表述为特定“政策包与样本”的估计，而不是永恒福利定律。<Cite n={21} /><Cite n={22} /><Cite n={23} />
        </p>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">研究语言最低契约</th><th scope="col">直白问题</th><th scope="col">最小可信条件</th></tr></thead>
            <tbody>
              <tr><th scope="row">处理组 / 对照组</th><td>谁受到规则，谁用来近似“若未受规则会怎样”？</td><td>两组除处理外没有系统性不同冲击，对照没有被外溢污染。</td></tr>
              <tr><th scope="row">差分中的差分（DiD）</th><td>处理组前后变化，是否超过对照组同期变化？</td><td>若无处理，两组本应保持平行趋势；同期其他政策不能只击中一组。</td></tr>
              <tr><th scope="row">事件研究与 leads / lags</th><td>效果在事件前是否已出现，事件后怎样展开？</td><td>Leads（事件前系数）用于查预趋势和提前反应；lags（事件后系数）不能被并发事件冒充。</td></tr>
              <tr><th scope="row">Assignment、running variable 与断点设计（RD）</th><td>名单按什么分数分配，阈值两侧能否作局部对比？</td><td>Running variable（决定资格的连续排名或分数）在阈值附近不可被精准操纵，其他决定因素应连续。</td></tr>
              <tr><th scope="row">分批采用与 never / not-yet treated</th><td>不同证券在不同时间受处理时，谁在每个时点作对照？</td><td>Never-treated 是从未处理者，not-yet-treated 是尚未处理者；不能让已处理后的结果反向污染对照。</td></tr>
              <tr><th scope="row">Matching、bandwidth 与 cluster</th><td>怎样选相似对照、阈值看多宽、误差按何层相关？</td><td>Matching（匹配）只能平衡已观察特征；bandwidth（阈值窗口）须预定并做敏感性；cluster（分组相关误差）层级要覆盖共同冲击。</td></tr>
              <tr><th scope="row">合成控制</th><td>能否用多个未受限单位的加权组合复制单个处理单位原路径？</td><td>处理前拟合足够好、供体池未受外溢，权重和结果窗不得按事后显著性选择。</td></tr>
              <tr><th scope="row">Risk set 与 reduced form</th><td>哪些单位在每一时点仍可能发生事件；制度到最终结果的总差异是什么？</td><td>Risk set（风险集）排除已退出或从未可能发生事件者；reduced form（简约式总效应）不能替未测中介指定机制。</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>最小差分设计</span>
          <div>β̂<sup>DiD</sup>=(Y<sub>restricted,post</sub>−Y<sub>restricted,pre</sub>)−(Y<sub>control,post</sub>−Y<sub>control,pre</sub>)</div>
          <p>β̂<sup>DiD</sup> 是估计出的双重差分，帽号“̂”表示这是样本估计值；restricted 是受到禁令或限制的处理组，control 是未受该限制的比较组，pre / post 分别是处理前与处理后。Y 必须预先指定，例如 effective spread（bp）、价格延迟或成交量；β̂ 的单位与 Y 相同，1 bp（basis point，基点）=0.01 个百分点。若受限股 spread 20→45 bp、对照 12→22 bp，则描述性 DiD=+15 bp。因果解释还需要平行趋势、无差别同期政策、无对照污染和稳定处理边界；危机禁令通常会违反其中若干项。</p>
        </div>
      </section>

      <section className="lesson-section" id="substitution">
        <p className="section-kicker">30 · 工具、场所与主体替代</p>
        <h2>现金卖空被约束后，观点可能消失、延迟，也可能迁往衍生品、相关证券、海外场所或中介资产负债表；三种结果需要不同数据。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">替代路径</th><th scope="col">新增风险</th><th scope="col">需要同时测量</th></tr></thead>
            <tbody>
              <tr><th scope="row">Put / option</th><td>到期、波动率曲面、dealer 对冲与 early exercise</td><td>delta-adjusted volume、open interest、IV、现货对冲</td></tr>
              <tr><th scope="row">Future / swap</th><td>basis、保证金、对手方与净额</td><td>期现 basis、持仓、dealer inventory</td></tr>
              <tr><th scope="row">ETF / basket / peer</th><td>basis risk 与非目标成分暴露</td><td>成分权重、申赎、相关证券 short</td></tr>
              <tr><th scope="row">ADR / offshore venue</th><td>交易时区、汇率、转换与资本流动</td><td>跨场所 order flow、价格领先和可交割关系</td></tr>
              <tr><th scope="row">Do nothing / wait</th><td>信息无法表达和错价持续</td><td>搜索、报价请求、未成交订单或调查证据</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          替代会破坏“处理单位稳定”的简单假设。若受限股票的 put volume 上升，未受限 peer 的 short activity 也上升，对照组已经被 treatment 污染；若 dealer 为客户 put 对冲而卖出现货，现金 short volume 下降甚至可能小于经济负面暴露的变化。研究应构造 issuer-level total exposure map，而不是把单一交易所标签当总均衡。
        </p>
      </section>

      <section className="lesson-section" id="rule-cards">
        <p className="section-kicker">31 · 截至 2026-08-29 的四地规则卡</p>
        <h2>真正可比较的不是“允许 / 禁止卖空”，而是资格、交付承诺、价格、报告、例外和当前实施时钟组成的规则向量。</h2>
        <div className="rule-card-grid">
          <article>
            <span>United States</span><h3>Locate＋marking＋delivery close-out＋条件价格测试</h3>
            <p>Reg SHO 一般要求 Rule 200 标记、Rule 203 locate 和 Rule 204 close-out；Rule 201 在较前收盘跌 10% 后，于当日余下时间及下一日限制普通非豁免空头在 NBB 或以下成交 / 显示。标准交收已为 T+1。Rule 13f-2、10c-1a 与 SLATE 的新公开数据尚未按原时点上线，见 21 节延期时钟。<Cite n={24} /><Cite n={25} /><Cite n={26} /><Cite n={40} /></p>
          </article>
          <article>
            <span>European Union</span><h3>Article 12 三条交付保障路径＋两级净空头披露</h3>
            <p>股票可在已借入 / 同等法律安排、绝对可执行的借券权利，或第三方 locate 并采取足以形成按期交收合理预期的措施下卖空。净空头达到发行股本 0.1% 及每个 0.1% 变动向主管机关报告；达到 0.5% 及每个 0.1% 变动公开，另有第三国主市场和符合条件做市等边界。<Cite n={31} /><Cite n={32} /></p>
          </article>
          <article>
            <span>Hong Kong</span><h3>指定证券＋covered assurance＋价格限制＋持仓报告</h3>
            <p>交易所受规管卖空限 Designated Securities，要求可立即行使且无条件交付的 covered 状态并标记订单；连续交易一般受 current best ask 等相应 tick rule 约束，指定活动有豁免。普通股报告门槛为发行人市值 0.02% 或港币 3,000 万元孰低，正常按周报告；指定证券清单动态变化，复现必须保存当期版本。<Cite n={33} /><Cite n={34} /><Cite n={43} /></p>
          </article>
          <article>
            <span>中国内地</span><h3>普通融券制度仍在＋一般转融券供给暂停</h3>
            <p>券商可依现行规则向客户融券，沪深交易所现行细则均规定融券卖出一般不得低于最近成交价；2024-07-11 起暂停的是中证金融向券商提供证券的一般转融券，并非宣布整个客户融券制度取消。2024-07-22 起一般融券保证金最低 100%、私募证券基金 120%。截至本节访问日未在证监会、中证金融或交易所官方页面发现一般转融券恢复公告，此句是有截止日的检索判断；特定做市借券不可混为一般恢复。<Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={44} /></p>
          </article>
        </div>
        <div className="boundary-box"><b>规则卡不是法律意见</b><p>任何真实交易或研究都要回到当日正式文本，并核对证券、账户、场所、订单类型、豁免、公司行动与过渡安排。本卡用于建立可复现变量，不替代经纪商合规或法域法律判断。</p></div>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">32 · 互动实验</p>
        <h2>先闭合八个可计算状态，再判断一项数据或规则究竟识别了什么。</h2>
        <p>
          Mode A 训练净损益、rebate、三个分母和 recall 路由；Mode B 训练 locate 与交付、Rule 201 时钟、资格名单选择和禁令外溢。每题第一次提交前隐藏反馈，错误答案会指出错在对象、符号、时间还是识别强度；八题参数均为教学输入，不代表真实账户条款。
        </p>
        <ShortSellingLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">33 · 八个反例护栏</p>
        <h2>任何“一定上涨 / 下跌、一定改善 / 恶化”的卖空结论，都先用下列反例测试适用条件。</h2>
        <div className="counter-grid">
          <article><span>01 · Supply first stage</span><h3>供给增、费率降，价格仍不动</h3><p>Kaplan 等的随机供给实验说明，下游现货效应可以接近零；原约束不 binding 时尤其如此。</p></article>
          <article><span>02 · Informed but constrained</span><h3>最终判断正确，中途仍被迫退出</h3><p>上涨、recall、fee 与保证金时钟可能先到，有限资本不能等待基本面收敛。</p></article>
          <article><span>03 · Short after decline</span><h3>空头成交可跟随而非造成下跌</h3><p>趋势、做市对冲和坏消息共同驱动 activity；同期相关不能给出方向。</p></article>
          <article><span>04 · More shorts, tighter spread</span><h3>信息交易增而流动性也可改善</h3><p>若对冲能力释放 dealer 库存，更多 short 与更窄 spread 可共存；逆向选择并非唯一通道。</p></article>
          <article><span>05 · Ban, no price support</span><h3>现金卖压减少而价格继续跌</h3><p>基本面坏消息和替代工具仍在，禁令还可能损害价格发现与做市。</p></article>
          <article><span>06 · High SI, no squeeze</span><h3>头寸大但贷款稳定、深度充足</h3><p>Squeeze 需要同步约束与回补相对深度，而非一个静态 short-interest 阈值。</p></article>
          <article><span>07 · FTD without illegal short</span><h3>长卖与操作处理也能形成 fail</h3><p>净额交收结果不含动机；必须回到订单和交付链。</p></article>
          <article><span>08 · Cash restriction, synthetic shift</span><h3>现货 short volume 降而总看空敞口不降</h3><p>Put、future、swap、ETF 与海外证券承接观点，且中介对冲可重新进入现货。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="cases">
        <p className="section-kicker">34 · 四组真实证据</p>
        <h2>案例的价值不在于给出统一结论，而在于展示不同制度冲击分别切中了哪一个节点。</h2>
        <div className="case-stack">
          <article>
            <span>Case A · Regulation SHO Pilot</span>
            <h3>解除价格测试不等于解除全部借券与交收约束。</h3>
            <p>美国试点对部分证券暂停既有价格测试，Diether、Lee 与 Werner 比较试点与对照，发现卖空活动增加，日度收益与日度波动没有显著变化；但 NYSE 试点股的 quoted/effective spread 与日内、短期限波动小幅上升，订单流不对称下降，Nasdaq 影响较弱。识别对象是 price-test 这一执行约束，不是 locate、loan fee、margin、一般价格发现或全部 Reg SHO 的总效应；随机化与规则实施细节仍需按官方名单和日期复现。<Cite n={17} /></p>
          </article>
          <article>
            <span>Case B · Hong Kong eligibility</span>
            <h3>名单纳入同时是制度变化和选择机制。</h3>
            <p>Chang、Cheng 与 Yu 利用香港可卖空指定名单变化，发现约束解除与较低估值、较高回报波动及更有效价格发现相关。可卖空资格由市值、成交等条件决定，纳入股票并非随机；设计必须比较临界、相似或未来纳入证券，并检查公告预期和其他成分调整。<Cite n={18} /></p>
          </article>
          <article>
            <span>Case C · 中国内地分批试点</span>
            <h3>“可融资融券”与真实融券供给、实际空头活动不是同一 treatment。</h3>
            <p>Chang、Luo 与 Ren 研究早期试点，报告估值与价格效率变化；Li、Lin、Zhang 与 Chen 进一步研究中国卖空与价格发现。制度资格、券源和使用强度可能分叉，且融资买入与融券卖出常在同一政策包内；今日规则环境又经过多次收紧，不能把早期试点估计直接当作 2026 年结构参数。<Cite n={19} /><Cite n={20} /></p>
          </article>
          <article>
            <span>Case D · GameStop 2021</span>
            <h3>Short covering 是上涨的一条通道，却不是完整成交量与持续涨势的单一解释。</h3>
            <p>SEC staff report 认为空头回补在若干离散时段对上涨作出贡献，但回补买量占总买量的比例较小；数周价格升值还与广泛正面情绪和持续买盘相关。这个结论同时反驳“回补完全无关”和“整个事件只是一场 mechanical squeeze”：需要把 short interest、loan、options、retail flow、depth 和时序共同分析。<Cite n={38} /></p>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 从世界观到可证伪研究</p>
        <h2>好的研究不问“卖空是否有效”，而问一个明确约束变化先改变哪一层、通过什么中介、对谁产生什么可观察结果。</h2>
        <p>以下八张卡沿用 29 节的最低契约：先写 assignment（处理怎样被分配），再验证贷款或交易 first stage（第一阶段），最后才读价格结果；英文缩写只作为检索标签，不代替中文识别假设。</p>
        <div className="research-grid">
          <article><span>Design A</span><h3>随机 lendable supply</h3><p><b>处理：</b>证券被随机加入可借池。<b>第一阶段：</b>lendable、fee、on-loan。<b>结果：</b>short trade、return、spread、volatility。<b>失败：</b>spillover、代理不遵从、效应太小。以 Kaplan 等为基准。<Cite n={12} /></p></article>
          <article><span>Design B</span><h3>资格阈值附近的断点设计（RD）</h3><p><b>处理：</b>可卖空名单纳入。<b>分配变量：</b>预先公布、决定资格的市值 / 成交 / 排名分数（running variable）。<b>结果：</b>loan 与 price discovery。<b>失败：</b>阈值可被精准操纵、其他名单同步改变或参与者提前交易。</p></article>
          <article><span>Design C</span><h3>分批开放的事件研究差分</h3><p><b>处理：</b>不同批次进入融券框架（staggered adoption）。<b>检验：</b>事件前 leads、事件后 lags、批次异质性，并明确每期用从未处理或尚未处理者作对照。<b>失败：</b>已处理单位污染对照、资格选择与融资买入捆绑。</p></article>
          <article><span>Design D</span><h3>价格测试触发的局部研究</h3><p><b>处理：</b>Rule 201 生效后的订单约束。<b>数据：</b>NBB、order mark、short-exempt、未成交与路由。<b>失败：</b>10% 触发由下跌内生，不能把刚上 / 下阈值机械当随机。</p></article>
          <article><span>Design E</span><h3>Recall / voting supply shock</h3><p><b>处理：</b>可预先确定记录日的贷款召回。<b>第一阶段：</b>lendable、fee、recall。<b>结果：</b>cover、price impact。<b>失败：</b>公司事件本身带来信息与需求。</p></article>
          <article><span>Design F</span><h3>危机禁令与合成控制</h3><p><b>处理：</b>明确名单与实际生效时钟；用多个未受限单位的固定加权组合复制处理前路径。<b>结果：</b>spread、price delay、期权和海外迁移。<b>失败：</b>处理前拟合差、受限名单针对最危险公司、政策包或供体池污染。</p></article>
          <article><span>Design G</span><h3>Loan demand / supply decomposition</h3><p><b>观测：</b>quantity 与 fee 联合变化。<b>目标：</b>区分需求上升和供给下降。<b>失败：</b>报价层级变化、共同基本面信息与 vendor coverage。</p></article>
          <article><span>Design H</span><h3>Squeeze 的生存与状态模型</h3><p><b>风险集（risk set）：</b>每一时点仍持有现金空头、仍可能发生 recall / forced cover 的账户或证券日。<b>事件：</b>recall、forced cover 或 fee jump。<b>结果：</b>随后 impact。<b>失败：</b>只观察幸存头寸、纳入从未可能发生事件者，或用事后涨幅定义处理。</p></article>
        </div>
        <div className="equation-card">
          <span>分层中介链</span>
          <div>Z → (Lendable, Fee, Locate quality) → executable short intent → Short trade → sourcing before delivery → Position / Price quality</div>
          <p>Z 是制度或外生供给冲击；括号内是贷款第一阶段；实际 borrow 可以已经 pre-borrow，也可在成交后、交付前由 sourcing（寻找实际券源）落实，不能固定写成交易前必经节点。若只估计 Z→Price，得到的是 reduced form（制度到最终价格的简约式总效应）；任何中间箭头为零或被替代都可能产生同一总结果。出版级报告应逐级展示估计值、以误差范围表达的不确定性、样本覆盖与缺失机制。</p>
        </div>
      </section>

      <section className="lesson-section" id="measurement-protocol">
        <p className="section-kicker">36 · 可复现测量协议</p>
        <h2>先冻结“谁、什么、何时、在哪一层被测”，再看回归结果；否则变量名会替研究者偷换问题。</h2>
        <div className="protocol-list">
          <article><span>01</span><div><h3>冻结法律与规则快照</h3><p>Jurisdiction、venue、security、account、order type、exemption、发布日、生效日、合规日、延期命令与访问日；未来规则单列。</p></div></article>
          <article><span>02</span><div><h3>冻结证券主键与公司行动</h3><p>永久 issuer ID、当期 security ID、share class、ADR/ETF linkage、split、merger、delisting、record/ex/payment date。</p></div></article>
          <article><span>03</span><div><h3>冻结贷款数据合同</h3><p>Vendor、beneficial-owner coverage、cash/noncash collateral、fee direction、GC benchmark、day count、currency、lendable 与 on-loan 定义。</p></div></article>
          <article><span>04</span><div><h3>冻结交易与报价</h3><p>Order mark、short-exempt、route、venue、NBB/local book、partial fill、cancel、correction、Rule 201 trigger clock 与 auction 状态。</p></div></article>
          <article><span>05</span><div><h3>冻结持仓快照</h3><p>Reporting entity、aggregation、gross/net、instrument netting、as-of timestamp、publication lag、revision 和 denominator vintage。</p></div></article>
          <article><span>06</span><div><h3>冻结交收状态</h3><p>Trade / settlement date、cycle；若法域与清算安排适用，保存 CNS（continuous net settlement，连续净额交收）的净额口径；另存 FTD stock/flow 区分、close-out、buy-in、exception 与数据不可见字段。</p></div></article>
          <article><span>07</span><div><h3>冻结处理与信息集</h3><p>公告、法律生效、实际技术上线分别编码；只使用当时可知 eligibility、list、inventory 和价格，不以后修订回填。</p></div></article>
          <article><span>08</span><div><h3>冻结反事实和暴露图</h3><p>事件前趋势（pretrend）、分配规则、匹配、阈值窗口（bandwidth）、误差分组层级（cluster）、外溢网络、option/future/ADR 替代及对照污染。</p></div></article>
          <article><span>09</span><div><h3>冻结结果向量</h3><p>Loan first stage、short activity、price efficiency、return、spread、depth、fixed-Q cost、volatility/jump 和 distributional outcomes。</p></div></article>
          <article><span>10</span><div><h3>公开失败与缺失状态</h3><p>Locate 不可见、loan vendor coverage、订单—贷款不可链接、FTD 无年龄、reporting delay、退市 / 停牌与多重政策；不得以零填充未知。</p></div></article>
        </div>
        <div className="boundary-box"><b>2026 时间护栏</b><p>美国 Rule 10c1a、Form SHO 与 SLATE 的法律文本和实施延期必须分别保存；香港 Designated Securities 是动态名单；中国一般转融券暂停是否恢复必须在研究运行日重新查官方公告；欧盟阈值与豁免按当时 consolidated text 读取。规则网页访问日不是事件发生日。</p></div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">37 · 主动练习</p>
        <h2>五项练习分别训练现金流、状态机、测量、因果识别与系统反馈；题面已经给出唯一作答所需信息。</h2>
        <div className="practice-stack">
          <details>
            <summary>练习 01 · 计算一笔 60 日现金空头的净损益</summary>
            <p>卖空 2,000 股，S₀=25 元，60/365 年后 S₁=21 元；教学上借券费按平均市值 23 元、年化 8% 计算；期间每股现金分配 0.15 元，执行与融资成本合计 420 元。求价格毛利、借券费、分配补偿和净损益。</p>
            <p><b>核对：</b>毛利 8,000；借券费=2,000×23×8%×60/365≈604.93；分配补偿 300；净损益≈6,675.07 元。</p>
          </details>
          <details>
            <summary>练习 02 · 将六条记录放入正确状态</summary>
            <p>依次给出：easy-to-borrow list 命中、签署 80 万股 loan、short trade 65 万股、逐笔隔离账本交付 60 万股、清算后另行观察到参与者—证券层 FTD 3 万股、次日购买关闭该 FTD 3 万股。分别标记 locate、borrow、trade、delivery、制度净额 fail 和 close-out；计算逐笔 gap，并解释为什么不能用 65−60 推出 3 万股 FTD；再说明哪一条单独足以证明违法。</p>
            <p><b>核对：</b>六条分别对应六个状态；逐笔 Q<sub>gap</sub><sup>trade</sup>=65−60=5 万股，3 万股 Q<sub>FTD</sub><sup>regime</sup> 是清算后另行观察的制度层状态，须经过其他交易缺口、应收义务与分配的 N<sub>regime</sub>，不能由这笔差额恢复。没有任何一条单独足以证明违法；仍需适用规则、locate 合理性、例外和时钟等证据。</p>
          </details>
          <details>
            <summary>练习 03 · 解释三个看似矛盾的比例</summary>
            <p>某 vendor 的 on-loan=300 万、同池 lendable=400 万；官方 short interest=520 万，float=4,000 万，冻结 ADV=200 万。计算 utilization、SI/float、DTC，并解释为什么不能互换。</p>
            <p><b>核对：</b>75%、13%、2.6 天；分母分别是该贷款池总供给、全市场口径流通股和历史日成交速度。</p>
          </details>
          <details>
            <summary>练习 04 · 识别名单纳入的隐藏选择</summary>
            <p>交易所按季度市值前 300、过去 60 日成交额和停牌天数决定可卖空资格。研究发现新纳入股票随后收益低 2%。列出一份最小因果识别方案：怎样构造反事实、先验证什么中间状态、什么现象会推翻解释？</p>
            <p><b>核对：</b>保存完整资格排名、分配分数与阈值；检查阈值附近是否被精准操纵以及公司特征是否连续；画事件前系数（leads）与事件后系数（lags），同时报告每个事件前估计及其不确定范围，并说明样本能否发现事先规定、具有经济意义的提前差异——“未检出提前分化”不能证明它不存在；排除同日指数或其他规则调整；报告 lendable、fee、short order / trade activity 的分层第一阶段；评估 put、future 与同业证券外溢。</p>
          </details>
          <details>
            <summary>练习 05 · 判断 squeeze 是否已经闭环</summary>
            <p>股票 SI/float=30%，但借券费稳定 2%、lendable 尚余大量库存、无 recall，日均成交是 SI 的一半；价格一周涨 20%。题面是否足以认定 short squeeze？还缺什么？</p>
            <p><b>核对：</b>不足。静态 SI 和上涨只给脆弱性背景；还需 fee/availability 变化、recall、margin / forced-cover、实际 cover buy volume、同步性与 ask depth，且要检验基本面消息和广泛买盘。</p>
          </details>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">38 · 理解检查</p>
        <h2>如果能不看正文回答这十题，你已经能把“空头很多”拆回可验证的市场机制。</h2>
        <div className="check-grid">
          <details><summary>01 · Locate 为什么不等于 borrow？</summary><p>Locate 是规则要求下对可借性的有根据判断或安排；borrow 创建实际贷款、担保品和返还义务。除非预借或锁定，locate 不保证库存不变。</p></details>
          <details><summary>02 · 为什么 on-loan 不等于 short interest？</summary><p>贷款可能用于交付、做市或其他用途，也可能内部化和跨供应商重复 / 缺失；short interest 是另一报告边界的未平仓头寸快照。</p></details>
          <details><summary>03 · 负 rebate 表示什么？</summary><p>在现金担保报价中，借方不再收到 rebate，反而按其经济含义付费；必须与 GC 基准和客户 all-in 条款区分。</p></details>
          <details><summary>04 · 为什么空头判断正确仍可能亏损？</summary><p>价格在价值收敛前上涨、fee 跳升、recall、公司行动、保证金和 impact 都可能消耗资本或迫使提前回补。</p></details>
          <details><summary>05 · FTD 最强能直接说明什么？</summary><p>指定交收日存在未交付净余额；单独不能识别订单是长是短、locate 是否合理、fail 年龄、违法或操纵动机。</p></details>
          <details><summary>06 · Rule 201 触发后禁止什么？</summary><p>在规定时钟内，普通非豁免 short sale 不能于当前 NBB 或更低显示 / 执行；并非全面禁止所有空头或固定在触发价。</p></details>
          <details><summary>07 · 卖空约束为什么可能导致高估，也可能只导致反应变慢？</summary><p>结论取决于信念分歧、信息结构和供给。Miller 型框架强调悲观者缺席与乐观者定价；Diamond–Verrecchia 型模型强调信息到达速度。</p></details>
          <details><summary>08 · 高 short interest 为什么不充分构成 squeeze？</summary><p>还需要价格 / fee / recall / margin 冲击使多个空头同步回补，且强制买量相对 ask depth 足够大。</p></details>
          <details><summary>09 · 现金卖空禁令为什么可能被替代？</summary><p>负面观点可迁往 put、future、swap、ETF、ADR、peer 或海外场所，中介对冲还可能把部分暴露带回现金市场。</p></details>
          <details><summary>10 · 一项制度研究为何先看 loan first stage？</summary><p>规则资格未必真正改变 lendable、fee 或 borrow；若贷款中间节点不动，就不能把后续价格结果指定为 loan channel，但可信的制度分配仍可能识别 reduced-form 总效应。还应检查与处理定义对应的 short order / trade first stage、价格测试、执行路径与替代工具，才能判断“约束”究竟在哪一层改变。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-closing">
        <p className="section-kicker">39 · 课程接口与结课诊断</p>
        <h2>本节把“空头”交付为一组有时钟的合约和数据状态；下一节加入一般杠杆与强制清算，后续章节再处理套利边界和中国制度。</h2>
        <div className="interface-grid">
          <article><span>← 1.04 / 1.05 / 1.09</span><h3>Order Book、Spread 与 Impact</h3><p>输入订单执行、价格成本和深度；本节解释 borrow、price test 与 cover 怎样改变卖方能否进入及买回冲击。</p></article>
          <article><span>← 1.14 / 1.18</span><h3>流动性竞争与价格网格</h3><p>输入 maker / taker、queue 与合法报价；本节增加 short mark、NBB 测试、对冲需求和证券供给。</p></article>
          <article><span>→ 1.20</span><h3>Leverage、Margin 与 Forced Liquidation</h3><p>输出空头价格不对称、loan collateral、recall 和回补路径；1.20 再统一到账户权益、维持保证金与资产负债表螺旋。</p></article>
          <article><span>→ 2.15</span><h3>Arbitrage Capital 与 Limits to Arbitrage</h3><p>输出借券成本、期限错配、噪声交易者风险和资本中断，使“知道错价”与“能实现套利”正式分离。</p></article>
          <article><span>→ 5.18</span><h3>A股交易制度与投资者结构</h3><p>输出融券与转融券分层、价格和保证金规则、动态名单与数据边界；5.18 再置于涨跌幅、T+1 与投资者结构中。</p></article>
          <article><span>→ 7.25</span><h3>Research Design：从世界观到可证伪问题</h3><p>输出分层 first stage、阈值选择、禁令外溢、时间护栏和不可见状态；7.25 再系统化预注册与证伪。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“空头导致股价异常”的说法，先问经济负面敞口通过现金股票还是衍生品表达；现金交易是否需要 locate、covered assurance、实际 borrow 与哪种担保；借券费是 rebate、explicit fee 还是客户 all-in；贷出量、short trade、short interest 与 FTD 各自在哪个时点、哪个分母、哪个覆盖池被观察；价格测试、名单、交收和披露规则当日是否生效，哪些账户或做市活动豁免；负面信息先引发卖空，还是卖空推动价格发现，价格变化是否又反过来收紧 fee、recall、margin 与 depth；回补量相对卖方流动性是否足以闭合 squeeze；禁止现货后观点是否迁往 put、future、ETF、ADR、海外或中介账簿；实证处理是否真的改变 lendable 和 borrow，还是只改变法律资格；最后，结论衡量的是价格准确性、流动性、波动、交付可靠性、发行人融资还是某类交易者损益。只有把这些问题逐项落到账本和时钟，“空头”才从情绪化标签变成可以被证据支持、被反例推翻的市场机制。
        </p>
      </section>
    </>
  );
}

export const lesson119: LessonRecord = {
  slug: '1-19',
  id: '1.19',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Short Selling 与 Securities Lending',
  subtitle: '从经济空头、locate、证券贷款与交收状态出发，解释负面信息怎样进入价格、约束怎样形成套利边界，以及回补、禁令和替代工具如何反馈',
  readingTime: '约 113–122 分钟（核心阅读 72–76＋互动实验 14–16＋主动练习 16–18＋理解检查 8–9＋课程接口 3；参考文献与延伸阅读不计）',
  prerequisite: 'T07 · Bond / Equity / Futures / Options 最小基础；建议回看 1.04、1.05、1.09、1.14 与 1.18',
  updatedAt: '2026-08-29',
  revision: '1.19-r6',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r1',
      summary: '首轮逐项核对机制、公式、42 条来源、四地规则和实验后，要求纠正实际借券时序、正常持仓与 FTD close-out 分支、Reg SHO Pilot 经验结论，并修复单位、分母和若干引用元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r1',
      summary: '首轮确认 40 节主线与状态机成立；要求把重复正文数字的实验改为迁移题，增加零背景研究语言契约，并补齐术语首释、公式索引和正式课程接口标题。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r2',
      summary: '第二轮确认三项重大机制和全部算例、规则与来源均已修复；仅要求为借券来源恒等式增加互斥净分配与非净额账本条件，并纠正零分母的数学边界措辞。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r2',
      summary: '第二轮确认认知坡度、练习、检查、引用和交互状态机通过；要求移除机制实验提交前的答案线索，并闭合 DiD 符号、CNS 首释与阅读预算。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r3',
      summary: '第三轮确认借券净分配和零分母边界已关闭；要求把互动题的逐笔交付缺口与 CNS 净 fail 分离，并收窄预趋势及 loan first stage 的识别语言。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r3',
      summary: '第三轮确认实验中性化、DiD、阅读预算和完整教学结构通过；仅发现 CNS 的完整释义晚于新增的首次使用位置。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r4',
      summary: '第四轮确认互动题、预趋势和贷款通道的目标修订成立；仅要求正文公式也用分层符号彻底分开逐笔交付缺口、制度净额 FTD 与适用 close-out。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r4',
      summary: '第四轮确认 CNS 释义与其余教学结构通过；要求移除 B1 题面中复述提交后推断的线索，并把新增预趋势诊断改写为零统计先修可理解的语言。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r5',
      summary: '第五轮确认逐笔 gap、制度净额 FTD 和适用 close-out 的分层已成立；仅要求把 Rule 204 的法定 FTD 对象与通常使用 CNS 的美国清算实践分开表述。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.19-r5',
      summary: '第五轮确认实验不泄题、预趋势语言和全部教学结构通过；仅发现主动练习仍用相等数字模糊逐笔 gap 与另行观察的制度净额 FTD。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.19-r6',
      summary: '终审确认 40 节机制、13 张公式卡、全部算例、练习、互动、44 条来源与四地规则边界准确；逐笔 gap、制度净额 FTD、Rule 204 法律对象和 CNS 实务分层完全闭合。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.19-r6',
      summary: '终审确认零背景认知坡度、40 节目录、练习检查反例、八题状态机与可访问性、阅读预算、44 条引用和 22 张阅读卡均达到出版与教学要求。',
    },
  ],
  previous: { slug: '1-18', label: '1.18 Tick Size 与最小报价单位' },
  next: { slug: '1-20', label: '1.20 Leverage、Margin 与 Forced Liquidation' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整系统' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'objects', label: '九个对象' },
    { id: 'economic-vs-cash-short', label: '经济与现金空头' },
    { id: 'parties-balance-sheets', label: '主体与资产负债表' },
    { id: 'lifecycle', label: '生命周期' },
    { id: 'locate-borrow', label: 'Locate / Borrow' },
    { id: 'loan-title-collateral', label: '所有权与担保品' },
    { id: 'fees-rebates', label: 'Fee / Rebate' },
    { id: 'availability-utilization', label: '供给与利用率' },
    { id: 'fee-endogeneity', label: '费用内生性' },
    { id: 'short-pnl', label: '净损益账本' },
    { id: 'asymmetric-payoff', label: '收益不对称' },
    { id: 'corporate-actions', label: '公司行动与投票' },
    { id: 'collateral-vs-margin', label: '担保品与保证金' },
    { id: 'term-recall', label: 'Term / Recall' },
    { id: 'delivery-closeout', label: '交付与 Close-out' },
    { id: 'naked-myths', label: 'Naked 误判' },
    { id: 'marking-execution', label: '订单标记' },
    { id: 'price-tests', label: 'Price Test' },
    { id: 'measurement-stack', label: '测量栈' },
    { id: 'heterogeneity', label: '约束异质性' },
    { id: 'negative-information', label: '负面信息' },
    { id: 'disagreement-overvaluation', label: '分歧与高估' },
    { id: 'supply-counterexample', label: '供给反例' },
    { id: 'liquidity-quality', label: '流动性与价格质量' },
    { id: 'volatility-crash', label: '波动与崩盘' },
    { id: 'squeeze-feedback', label: 'Squeeze 反馈' },
    { id: 'bans', label: '危机禁令' },
    { id: 'substitution', label: '工具与场所替代' },
    { id: 'rule-cards', label: '四地规则卡' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例护栏' },
    { id: 'cases', label: '真实证据' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'measurement-protocol', label: '测量协议' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces-closing', label: '接口与诊断' },
  ],
  Content: Lesson119Content,
  references: [
    { id: 1, authors: 'Edward M. Miller', year: '1977', title: 'Risk, Uncertainty, and Divergence of Opinion', publication: 'Journal of Finance, 32(4), 1151–1168', url: 'https://doi.org/10.1111/j.1540-6261.1977.tb03317.x', use: '建立异质信念、受限悲观交易与乐观边际持有人定价的经典机制；只有分歧与有效约束同时存在时才支持高估推论。' },
    { id: 2, authors: 'Douglas W. Diamond & Robert E. Verrecchia', year: '1987', title: 'Constraints on Short-Selling and Asset Price Adjustment to Private Information', publication: 'Journal of Financial Economics, 18(2), 277–311', url: 'https://doi.org/10.1016/0304-405X(87)90042-0', use: '支持卖空约束使坏消息交易和价格调整变慢；理性预期模型并不自动推出向上价格偏误。' },
    { id: 3, authors: 'Darrell Duffie, Nicolae Gârleanu & Lasse Heje Pedersen', year: '2002', title: 'Securities Lending, Shorting, and Pricing', publication: 'Journal of Financial Economics, 66(2–3), 307–339', url: 'https://doi.org/10.1016/S0304-405X(02)00226-X', use: '建立证券借贷搜索、议价、价格分散与空头逐步建立的动态均衡；模型不等于现代集中数据中的直接结构估计。' },
    { id: 4, authors: 'Gene D’Avolio', year: '2002', title: 'The Market for Borrowing Stock', publication: 'Journal of Financial Economics, 66(2–3), 271–306', url: 'https://doi.org/10.1016/S0304-405X(02)00206-4', use: '展示美国借券可得性、specialness、费用和召回的横截面异质性；单一中介与 2000–2001 时段限制外推。' },
    { id: 5, authors: 'Christopher C. Geczy, David K. Musto & Adam V. Reed', year: '2002', title: 'Stocks Are Special Too: An Analysis of the Equity Lending Market', publication: 'Journal of Financial Economics, 66(2–3), 241–269', url: 'https://doi.org/10.1016/S0304-405X(02)00225-8', use: '说明多类策略的实际借券可得性和费用不同，并购套利等更易受约束；一家托管银行库存不代表全市场。' },
    { id: 6, authors: 'Charles M. Jones & Owen A. Lamont', year: '2002', title: 'Short-Sale Constraints and Stock Returns', publication: 'Journal of Financial Economics, 66(2–3), 207–239', url: 'https://doi.org/10.1016/S0304-405X(02)00224-6', use: '用 1926–1933 loan crowd 记录连接借券困难、高估与较低后续收益；历史制度与需求内生性限制现代外推。' },
    { id: 7, authors: 'Lauren Cohen, Karl B. Diether & Christopher J. Malloy', year: '2007', title: 'Supply and Demand Shifts in the Shorting Market', publication: 'Journal of Finance, 62(5), 2061–2096', url: 'https://doi.org/10.1111/j.1540-6261.2007.01269.x', use: '通过费率与数量联合变化区分贷款需求和供给移动，并连接未来收益；识别依赖局部排他假设且数据来自单一出借人。' },
    { id: 8, authors: 'Ekkehart Boehmer, Charles M. Jones & Xiaoyan Zhang', year: '2008', title: 'Which Shorts Are Informed?', publication: 'Journal of Finance, 63(2), 491–527', url: 'https://doi.org/10.1111/j.1540-6261.2008.01324.x', use: '支持空头交易的信息含量在机构、程序与零售类型间异质；预测关系不证明每笔空头拥有私人信息。' },
    { id: 9, authors: 'Karl B. Diether, Kuan-Hui Lee & Ingrid M. Werner', year: '2009', title: 'Short-Sale Strategies and Return Predictability', publication: 'Review of Financial Studies, 22(2), 575–607', url: 'https://doi.org/10.1093/rfs/hhn047', use: '显示短卖者常在短期上涨后交易且相对 short volume 预测负收益；成交流不等于净建仓，样本仅覆盖 2005。' },
    { id: 10, authors: 'Joseph E. Engelberg, Adam V. Reed & Matthew C. Ringgenberg', year: '2018', title: 'Short-Selling Risk', publication: 'Journal of Finance, 73(2), 755–786', url: 'https://doi.org/10.1111/jofi.12601', use: '说明未来借券费与召回不确定性本身会减少卖空并损害价格效率；short risk 仍是内生预测变量。' },
    { id: 11, authors: 'Pedro A. C. Saffi & Kari Sigurdsson', year: '2011', title: 'Price Efficiency and Short Selling', publication: 'Review of Financial Studies, 24(3), 821–852', url: 'https://doi.org/10.1093/rfs/hhq124', use: '跨 26 国连接可借供给、价格效率与极端收益；国际供给与制度选择内生，不是随机实验。' },
    { id: 12, authors: 'Steven N. Kaplan, Tobias J. Moskowitz & Berk A. Sensoy', year: '2013', title: 'The Effects of Stock Lending on Security Prices: An Experiment', publication: 'Journal of Finance, 68(5), 1891–1936', url: 'https://doi.org/10.1111/jofi.12051', use: '随机供给实验显示费率下降与借量增加可以不伴随可检测的收益、波动、偏度或价差变化；窗口和单一持有人限制外部效度。' },
    { id: 13, authors: 'Eli Ofek, Matthew Richardson & Robert F. Whitelaw', year: '2004', title: 'Limited Arbitrage and Short Sales Restrictions: Evidence from the Options Markets', publication: 'Journal of Financial Economics, 74(2), 305–342', url: 'https://doi.org/10.1016/j.jfineco.2003.05.008', use: '连接难借、期权价格偏离与套利限制；期权成交不能按固定比例还原隐藏现金卖空。' },
    { id: 14, authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen', year: '2005', title: 'Predatory Trading', publication: 'Journal of Finance, 60(4), 1825–1863', url: 'https://doi.org/10.1111/j.1540-6261.2005.00781.x', use: '说明预期他人被迫交易可诱发顺势交易和流动性恶化；模型不证明每次上涨均存在操纵。' },
    { id: 15, authors: 'Robert A. Jarrow', year: '1992', title: 'Market Manipulation, Bubbles, Corners, and Short Squeezes', publication: 'Journal of Financial and Quantitative Analysis, 27(3), 311–336', url: 'https://doi.org/10.2307/2331322', use: '提供可支配供给、corner 与 squeeze 的理论价格动态；不能由异常涨幅单独识别操纵。' },
    { id: 16, authors: 'Harrison Hong & Jeremy C. Stein', year: '2003', title: 'Differences of Opinion, Short-Sales Constraints, and Market Crashes', publication: 'Review of Financial Studies, 16(2), 487–525', url: 'https://doi.org/10.1093/rfs/hhg006', use: '解释被约束悲观信息在下跌时集中释放与负偏度的理论通道；不是单变量 crash 预测式。' },
    { id: 17, authors: 'Karl B. Diether, Kuan-Hui Lee & Ingrid M. Werner', year: '2009', title: 'It’s SHO Time! Short-Sale Price Tests and Market Quality', publication: 'Journal of Finance, 64(1), 37–73', url: 'https://doi.org/10.1111/j.1540-6261.2008.01428.x', use: 'Reg SHO 随机试点识别取消价格测试对 short flow 和市场质量的影响；不等于取消 locate、借券或全部监管。' },
    { id: 18, authors: 'Eric C. Chang, Joseph W. Cheng & Yinghui Yu', year: '2007', title: 'Short-Sales Constraints and Price Discovery: Evidence from the Hong Kong Market', publication: 'Journal of Finance, 62(5), 2097–2121', url: 'https://doi.org/10.1111/j.1540-6261.2007.01270.x', use: '利用香港指定名单变化研究估值、波动与价格发现；资格受市值和流动性选择，非随机。' },
    { id: 19, authors: 'Eric C. Chang, Yan Luo & Jinjuan Ren', year: '2014', title: 'Short-Selling, Margin-Trading, and Price Efficiency: Evidence from the Chinese Market', publication: 'Journal of Banking & Finance, 48, 411–424', url: 'https://doi.org/10.1016/j.jbankfin.2013.10.002', use: '研究中国早期融资融券试点与价格效率；融资与融券捆绑、资格选择及早期制度限制 2026 外推。' },
    { id: 20, authors: 'Zhisheng Li, Bingxuan Lin, Ting Zhang & Chen Chen', year: '2018', title: 'Does Short Selling Improve Stock Price Efficiency and Liquidity? Evidence from a Natural Experiment in China', publication: 'The European Journal of Finance, 24(15), 1350–1368', url: 'https://doi.org/10.1080/1351847X.2017.1307772', use: '补充中国卖空、价格效率与流动性的实证证据；分批资格和实际券源仍需分层识别。' },
    { id: 21, authors: 'Ekkehart Boehmer, Charles M. Jones & Xiaoyan Zhang', year: '2013', title: 'Shackling Short Sellers: The 2008 Shorting Ban', publication: 'Review of Financial Studies, 26(6), 1363–1400', url: 'https://doi.org/10.1093/rfs/hht017', use: '美国 2008 金融股禁令显著压低 short flow 并恶化市场质量，未见普遍托价；同期救助和名单内生限制因果。' },
    { id: 22, authors: 'Alessandro Beber & Marco Pagano', year: '2013', title: 'Short-Selling Bans Around the World: Evidence from the 2007–09 Crisis', publication: 'Journal of Finance, 68(1), 343–381', url: 'https://doi.org/10.1111/j.1540-6261.2012.01802.x', use: '30 国危机禁令显示流动性和价格发现恶化且普遍托价证据弱；政策内生于危机。' },
    { id: 23, authors: 'Ian W. Marsh & Richard Payne', year: '2012', title: 'Banning Short Sales and Market Quality: The UK’s Experience', publication: 'Journal of Banking & Finance, 36(7), 1975–1986', url: 'https://doi.org/10.1016/j.jbankfin.2012.03.005', use: '英国禁令提供市场质量和价格发现证据；危机风险差异与政策包限制外推。' },
    { id: 24, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-29', title: 'Trading and Markets Frequently Asked Questions: Regulation SHO', publication: 'Official staff guidance, updated 26 June 2026', url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions-8', use: '支持 Rule 200 标记、Rule 203 locate 与 Rule 204 close-out 的现行结构；历史周期括注须由当前 T+1 来源覆盖。' },
    { id: 25, authors: 'U.S. Securities and Exchange Commission', year: '2010/current', accessedAt: '2026-08-29', title: 'Rule 201 Alternative Uptick Rule: Compliance Guide', publication: 'Official Regulation SHO guide', url: 'https://www.sec.gov/files/rules/final/2010/34-61595-secg.htm', use: '支持 10% trigger、当日余下时间加下一交易日以及普通非豁免空头必须高于当前 NBB 的价格测试。' },
    { id: 26, authors: 'U.S. Securities and Exchange Commission', year: '2024', accessedAt: '2026-08-29', title: 'T+1 Settlement Cycle Compliance Guide', publication: 'Official guide for Rules 15c6-1, 15c6-2 and 204-2', url: 'https://www.sec.gov/investment/settlement-cycle-small-entity-compliance-guide-15c6-1-15c6-2-204-2', use: '支持 2024-05-28 起标准 T+1 及 Rule 204 时限相应缩短；具体 close-out 仍按证券与原因读取。' },
    { id: 27, authors: 'U.S. Securities and Exchange Commission', year: 'current', accessedAt: '2026-08-29', title: 'Regulation SHO: Key Points', publication: 'Official investor bulletin', url: 'https://www.sec.gov/investor/pubs/regsho.htm', use: '仅用于稳定的 short sale、naked short 与 threshold/FTD 概念边界；页面旧交收周期文字不作为当前时点来源。' },
    { id: 28, authors: 'U.S. Securities and Exchange Commission', year: 'current', accessedAt: '2026-08-29', title: 'Fails-to-Deliver Data', publication: 'SEC Markets Data', url: 'https://www.sec.gov/data-research/sec-markets-data/fails-deliver-data', use: '确认 FTD 是交收日中央净额累计余额而非日流量或年龄，且可来自长卖和短卖，不能单独证明 abusive naked shorting。' },
    { id: 29, authors: 'U.S. Securities and Exchange Commission', year: '2017', accessedAt: '2026-08-29', title: 'Securities Lending by U.S. Open-End and Closed-End Investment Companies', publication: 'Division of Investment Management guidance, 11 October 2017', url: 'https://www.sec.gov/investment/divisionsinvestmentsecurities-lending-open-closed-end-investment-companieshtm', use: '支持法律权利、分红等值补偿、投票权转移、召回与担保风险的基金治理边界。' },
    { id: 30, authors: 'Bank of England, UK Money Markets Committee', year: '2024', accessedAt: '2026-08-29', title: 'The UK Money Markets Code – June 2024', publication: 'Official market code, published 7 June 2024', url: 'https://www.bankofengland.co.uk/markets/money-markets-committee-and-uk-money-markets-code/the-uk-money-markets-code', use: '支持证券与担保品交付、持续盯市、manufactured payment、recall 和返还等量证券的贷款生命周期。' },
    { id: 31, authors: 'European Parliament and Council', year: '2012/2024 consolidated', accessedAt: '2026-08-29', title: 'Regulation (EU) No 236/2012 on Short Selling and Certain Aspects of Credit Default Swaps', publication: 'EUR-Lex consolidated text, 16 January 2024', url: 'https://eur-lex.europa.eu/eli/reg/2012/236/2024-01-16/eng', use: '支持 Article 12 三条交收保障路径、0.5% 公开披露及 Articles 10/16/17 的主体和豁免边界。' },
    { id: 32, authors: 'European Commission', year: '2022', accessedAt: '2026-08-29', title: 'Commission Delegated Regulation (EU) 2022/27', publication: 'EUR-Lex', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32022R0027', use: '支持欧盟主管机关净空头通知门槛永久降至 0.1%；后续每 0.1 个百分点变化仍依 SSR 读取。' },
    { id: 33, authors: 'Hong Kong Exchanges and Clearing', year: 'current', accessedAt: '2026-08-29', title: 'Regulated Short Selling and Designated Securities', publication: 'Official HKEX rules and dynamic lists', url: 'https://www.hkex.com.hk/services/trading/securities/overview/regulated-short-selling?sc_lang=en', use: '支持香港 designated、covered、自动撮合、各时段价格限制与特定豁免；清单必须按事件日版本保存。' },
    { id: 34, authors: 'Hong Kong Securities and Futures Commission', year: '2023', accessedAt: '2026-08-29', title: 'Guidance Note on Short Selling Reporting and Stock Lending Record Keeping Requirements', publication: 'Official SFC guidance, June 2023', url: 'https://www.sfc.hk/-/media/EN/assets/components/codes/files-current/web/guidance-note-on-short-selling-reporting-and-st/Guidance-Note-on-short-selling-reporting-and-stock-lending-record-keeping-requirementJun-2023-Eng.pdf', use: '支持 covered assurance、订单标记、交易链记录保存与股票借贷记录要求；净空头持仓门槛另见参考 43。' },
    { id: 35, authors: '中国证券监督管理委员会', year: '2024', accessedAt: '2026-08-29', title: '证监会依法批准中证金融公司暂停转融券业务', publication: '官方公告，2024-07-10', url: 'https://www.csrc.gov.cn/csrc/c100028/c7493852/content.shtml', use: '确认 2024-07-11 起暂停一般转融券及存量合约最晚了结日期；不等于取消券商普通融券。' },
    { id: 36, authors: '上海证券交易所', year: '2023', accessedAt: '2026-08-29', title: '上海证券交易所融资融券交易实施细则（2023年修订）', publication: '上证发〔2023〕41号，2023-02-17 发布，现行规则', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/trade/specific/margin/c/c_20250616_10782015.shtml', use: '支持上交所普通融资融券制度、标的和融券卖出不得低于最近成交价等当前交易边界。' },
    { id: 37, authors: '上海证券交易所', year: '2024/current', accessedAt: '2026-08-29', title: '关于调整融券交易保证金比例的通知（上证发〔2024〕98号）', publication: '官方现行有效通知', url: 'https://big5.sse.com.cn/site/cht/www.sse.com.cn/lawandrules/sselawsrules2025/trade/specific/margin/c/c_20250616_10782021.shtml', use: '支持 2024-07-22 起一般融券保证金不低于 100%、私募证券基金不低于 120% 及存量 / 展期边界。' },
    { id: 38, authors: 'U.S. Securities and Exchange Commission Staff', year: '2021', accessedAt: '2026-08-29', title: 'Staff Report on Equity and Options Market Structure Conditions in Early 2021', publication: 'Official SEC staff report', url: 'https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf', use: '支持 GameStop 回补在离散时段有贡献但只占总买量小部分，持续涨势还与广泛正面情绪相关。' },
    { id: 39, authors: 'U.S. Securities and Exchange Commission', year: '2023', accessedAt: '2026-08-29', title: 'Rule 10c-1a: Reporting of Securities Loans', publication: 'Final Rule, Release No. 34-98737', url: 'https://www.sec.gov/files/rules/final/2023/34-98737.pdf', use: '给出证券贷款报告制度、经济字段和传播框架；截至 2026 年不能据此声称公开贷款带已运行。' },
    { id: 40, authors: 'U.S. Securities and Exchange Commission', year: '2025', accessedAt: '2026-08-29', title: 'Temporary Exemptive Relief for Rule 13f-2 and Rule 10c-1a', publication: 'Release No. 34-104303, 3 December 2025', url: 'https://www.sec.gov/files/rules/exorders/2025/34-104303.pdf', use: '支持 Form SHO 至 2028-01-02、贷款报告至 2028-09-28、公开传播至 2029-03-29 的当前豁免时点。' },
    { id: 41, authors: 'Financial Industry Regulatory Authority', year: 'current', accessedAt: '2026-08-29', title: 'Short Interest — What It Is, What It Is Not', publication: 'FINRA investor education', url: 'https://www.finra.org/investors/insights/short-interest', use: '区分每月两次 short-interest 快照与日度 short-sale volume，强调二者不能互换。' },
    { id: 42, authors: 'Financial Industry Regulatory Authority', year: 'current', accessedAt: '2026-08-29', title: 'Securities Lending and Transparency Engine (SLATE)', publication: 'Official implementation page', url: 'https://www.finra.org/filing-reporting/slate', use: '确认 SLATE 当前计划 2028-09-28 上线；2026 年不得假设已存在公开逐笔贷款数据。' },
    { id: 43, authors: 'Hong Kong Securities and Futures Commission', year: 'current', accessedAt: '2026-08-29', title: 'Short Position Reporting', publication: 'Official SFC regulatory page and reporting guidance', url: 'https://www.sfc.hk/en/Regulatory-functions/Market/Short-position-reporting', use: '支持 Designated Securities 的周度净空头报告、普通股 0.02% 或港币 3,000 万元孰低门槛及 CIS 边界。' },
    { id: 44, authors: '深圳证券交易所', year: '2023', accessedAt: '2026-08-29', title: '关于发布《深圳证券交易所融资融券交易实施细则（2023年修订）》的通知', publication: '官方现行规则通知，2023-02-17', url: 'https://www.szse.cn/lawrules/rule/stock/trade/t20230217_598777.html', use: '支持深交所普通融资融券框架及融券卖出不得低于最近成交价、当日无成交不得低于前收盘价等交易边界。' },
  ],
  readingList: [
    { title: 'Miller (1977), Divergence of Opinion', scope: '分歧、约束与乐观边际持有人', reason: '建立“为什么可能高估”的条件，而不是把约束直接等同高估。', url: 'https://doi.org/10.1111/j.1540-6261.1977.tb03317.x' },
    { title: 'Diamond & Verrecchia (1987)', scope: '卖空约束与私人信息调整', reason: '理解坏消息入价变慢为何不必产生永久向上偏误。', url: 'https://doi.org/10.1016/0304-405X(87)90042-0' },
    { title: 'Duffie, Gârleanu & Pedersen (2002)', scope: '证券借贷搜索、议价与定价', reason: '把券源从一个固定费率升级为动态分散市场。', url: 'https://doi.org/10.1016/S0304-405X(02)00226-X' },
    { title: 'D’Avolio (2002), Market for Borrowing Stock', scope: '可得性、specialness 与 recall 的现实分布', reason: '建立借券数据的量级感，同时牢记单一中介边界。', url: 'https://doi.org/10.1016/S0304-405X(02)00206-4' },
    { title: 'Jones & Lamont (2002)', scope: '历史借券困难、估值与未来收益', reason: '观察显然错价为什么仍需要支付真实持有成本。', url: 'https://doi.org/10.1016/S0304-405X(02)00224-6' },
    { title: 'Cohen, Diether & Malloy (2007)', scope: '贷款供需联合识别', reason: '学习为什么只看 fee 无法区分需求与供给。', url: 'https://doi.org/10.1111/j.1540-6261.2007.01269.x' },
    { title: 'Boehmer, Jones & Zhang (2008)', scope: '不同空头主体的信息含量', reason: '防止把全部 short-marked trades 当作同一种知情交易。', url: 'https://doi.org/10.1111/j.1540-6261.2008.01324.x' },
    { title: 'Engelberg, Reed & Ringgenberg (2018)', scope: 'Short-selling risk 与融资不确定性', reason: '把未来 fee 和 recall 风险纳入可持续套利。', url: 'https://doi.org/10.1111/jofi.12601' },
    { title: 'Saffi & Sigurdsson (2011)', scope: '26 国贷款供给与价格效率', reason: '学习跨国证据的覆盖优势与内生选择局限。', url: 'https://doi.org/10.1093/rfs/hhq124' },
    { title: 'Kaplan, Moskowitz & Sensoy (2013)', scope: '随机证券出借供给实验', reason: '用强 first stage、零下游效应校准因果链。', url: 'https://doi.org/10.1111/jofi.12051' },
    { title: 'Diether, Lee & Werner (2009), It’s SHO Time!', scope: '价格测试的随机试点', reason: '精确区分 price-test treatment 与其他卖空约束。', url: 'https://doi.org/10.1111/j.1540-6261.2008.01428.x' },
    { title: 'Chang, Cheng & Yu (2007)', scope: '香港指定名单与价格发现', reason: '训练在真实 eligibility 选择下构造局部反事实。', url: 'https://doi.org/10.1111/j.1540-6261.2007.01270.x' },
    { title: 'Chang, Luo & Ren (2014)', scope: '中国早期融资融券试点', reason: '区分制度资格、实际融券与价格效率，并避免跨制度时点外推。', url: 'https://doi.org/10.1016/j.jbankfin.2013.10.002' },
    { title: 'Beber & Pagano (2013)', scope: '2008 全球卖空禁令', reason: '把危机名单、流动性、价格发现和内生政策放进同一研究。', url: 'https://doi.org/10.1111/j.1540-6261.2012.01802.x' },
    { title: 'Brunnermeier & Pedersen (2005)', scope: '被迫交易与 predatory feedback', reason: '理解 squeeze 怎样从融资压力升级为价格正反馈。', url: 'https://doi.org/10.1111/j.1540-6261.2005.00781.x' },
    { title: 'SEC Regulation SHO FAQ', scope: 'Rule 200 / 203 / 204 当前结构', reason: '以当前官方时点读取订单、locate 与 close-out，而不是沿用旧交收周期。', url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions-8' },
    { title: 'SEC Rule 201 Compliance Guide', scope: '10% trigger、NBB 与限制时钟', reason: '把“uptick rule”还原为可逐笔复现的订单测试。', url: 'https://www.sec.gov/files/rules/final/2010/34-61595-secg.htm' },
    { title: 'EUR-Lex Short Selling Regulation', scope: 'Article 12、披露与豁免', reason: '理解 borrow、可执行权利与 locate 三条合规路径。', url: 'https://eur-lex.europa.eu/eli/reg/2012/236/2024-01-16/eng' },
    { title: 'HKEX Regulated Short Selling', scope: '指定证券、covered 与价格限制', reason: '训练按动态名单和交易时段读取香港制度。', url: 'https://www.hkex.com.hk/services/trading/securities/overview/regulated-short-selling?sc_lang=en' },
    { title: '证监会 2024 暂停转融券公告', scope: '上游券源暂停的精确层级与日期', reason: '避免把转融券暂停误写成普通客户融券取消。', url: 'https://www.csrc.gov.cn/csrc/c100028/c7493852/content.shtml' },
    { title: 'SEC 2021 Equity and Options Staff Report', scope: 'GameStop 的回补、情绪与市场结构', reason: '学习用成交量和时序反驳单一 squeeze 故事。', url: 'https://www.sec.gov/files/staff-report-equity-options-market-struction-conditions-early-2021.pdf' },
    { title: 'SEC 2025 Temporary Exemptive Relief', scope: 'Rule 13f-2、10c-1a 与公开传播时钟', reason: '把已通过规则与 2026 年尚未上线的数据严格分开。', url: 'https://www.sec.gov/files/rules/exorders/2025/34-104303.pdf' },
  ],
};
