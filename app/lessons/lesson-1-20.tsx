import LeverageMarginLab from '../components/LeverageMarginLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson120Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>价格下跌不会凭空生成卖单；它先改写杠杆主体的账本，再由合同阈值、现金时钟与市场深度把一部分损失转换成不得不执行的交易。</h2>
        <p>
          一只没有负债、没有赎回、没有风险限额的股票账户，价格下跌首先只是财富损失。要让这一下跌制造更多卖盘，至少还需要四个节点：资产按新价格重估后，权益或可用现金缓冲缩小；账户碰到维护保证金、repo haircut（回购融资中的抵押折扣）、variation margin（VM，把已发生的盯市盈亏转成须及时交付的结算资源）、信用限额或其他硬约束；补款必须在有限时间内完成；主体又不能用外部现金、合格抵押品、信用额度、净额收益或对冲调整化解缺口。只有这些替代路径不足时，call 才会变成出售、平仓或不再续作融资。
        </p>
        <p>
          危险之处在于，出售不是链条终点。若多个账户持有同一资产、使用相近阈值并同时去杠杆，卖盘会压低清算价格；剩余仓位随即在更低价格上重新计价，权益再次下降，市场深度也可能因做市资本受损而收缩。于是“价格下跌 → 约束收紧 → 被迫出售 → 价格再跌”形成反馈。Brunnermeier 与 Pedersen 将融资流动性和市场流动性的这种相互强化形式化；Geanakoplos 的 leverage cycle 则强调可接受抵押比例本身也会随状态变化。两者都没有说每次下跌都来自杠杆，而是说明在约束已经接近临界点时，小冲击为何可能被内生放大。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>从价格到强平是一条“重估—约束—补救—成交—再重估”的闭环，而不是从红色 K 线直接跳到爆仓。</h2>
        <div className="mechanism-flow">
          <span>价格 / 波动 / haircut / 融资期限冲击</span><i>→</i><span>资产与衍生品按市值重估</span><i>→</i><span>权益、保证金缓冲与可用现金改变</span><i>→</i><span>监管、合同或内部约束触发</span><i>→</i><span>现金 / 抵押品 call</span><i>→</i><span>注资、借款、净额、换抵押品、减仓</span><i>→</i><span>仍有缺口才被迫交易</span><i>→</i><span>订单冲击与深度变化</span><i>→</i><span>下一轮价格和约束</span>
        </div>
        <p>
          这条链上有三个不同方向。融资多头在下跌中可能卖出；融券空头在上涨中可能买回；衍生品一方交付 variation margin 时，收到现金或其他合格抵押品的另一方未必同步买入风险资产。还要区分触发与执行：账户低于维持线会产生 deficiency，却可能在截止前补足；券商拥有处置权，也不代表它一定立即或完全处置；卖盘实际成交后，价格影响又取决于流动性供给。后文每个公式都只解决链上的一个箭头，不能跨越未观察节点作因果结论。
        </p>
        <div className="boundary-box"><b>本节真正回答的问题</b><p>给定一个主体的头寸、负债、合同规则与流动性资源，如何重建“价格变化首先改变哪个账本量，哪条阈值被触发，缺口可以怎样治愈，需要交易多少，交易又如何成为下一轮输入”；并进一步判断公开数据能否区分强制出售、自愿降险与基本面卖出。</p></div>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 范围与先修契约</p>
        <h2>本节统一的是约束传导语言，不是把所有机构都塞进一条“保证金率”公式。</h2>
        <p>
          硬先修是 T06：能够读出资产、负债与权益。建议回看 1.09 的 price impact、1.14 的流动性供给竞争与 1.19 的融券担保和召回。本节会分别建立证券融资多头、融券空头、repo、期货、中央及非中央清算衍生品的最小账本，再解释它们如何通过共同现金池和共同持仓连接。企业破产法、银行完整资本监管、基金赎回、期权 gamma 对冲与宏观信用周期只在需要划清边界时出现，分别留给后续主体、宏观与复杂系统章节深入。
        </p>
        <p>
          术语也先冻结。这里的 <b>call</b> 是合同或规则要求补充现金、证券或合格抵押品；<b>forced liquidation</b> 是主体因无法在期限内用其他路径恢复合规而被迫缩减头寸；<b>default</b> 是未履行约定义务；<b>insolvency</b> 则可能指资产负债表或法定破产意义上的资不抵债。四者可以相继发生，却不是同义词。研究写作若只看到价格与卖量，应使用“与去杠杆一致”；只有观察到约束、期限、缺口和实际处置，才称为被识别的强制清算。
        </p>
        <div className="boundary-box"><b>缩写先于公式的最小词典</b><p><b>Repo（回购融资）</b>是以证券换取短期现金并约定未来回购；本节若无另说，<b>haircut</b> 指“抵押品市值减可借现金”占抵押品市值的比例，市场另有以现金为分母的 repo margin 报价。<b>VM（变动保证金）</b>把已经发生的盯市盈亏转成合同要求及时交付的结算资源；本节的线性期货模型把它记作现金，非中央清算双边安排则须按适用法域与抵押品附件判断可否交付其他合格抵押品。<b>IM（初始保证金）</b>覆盖违约后到组合平仓期间的潜在未来敞口。<b>FCM（期货佣金商）</b>连接期货客户与清算链，<b>CCP（中央对手方）</b>则介于交易双方之间集中净额并管理会员违约。后文第一次出现这些缩写时仍会说明它们在具体账本中的位置。</p></div>
        <div className="boundary-box"><b>公式阅读协议</b><p>后文每个公式都会在出现处说明变量、单位和有效范围。现在先记一条：当权益已经为零或负、价格没有正值，或市场没有可测的正成交容量时，常规杠杆以及“卖到恢复某比例”的解释会失效；此时应转入违约和处置分析，不能把全清仓写成已经恢复合规。</p></div>
      </section>

      <section className="lesson-section" id="parties">
        <p className="section-kicker">03 · 主体与债权链</p>
        <h2>同一头寸可同时面对客户层、经纪商层、清算层和融资层约束；“市场要求追加保证金”必须先回答究竟是谁向谁催缴。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">层</th><th scope="col">主要债权关系</th><th scope="col">典型控制量</th><th scope="col">不合规后的动作</th></tr></thead>
            <tbody>
              <tr><th scope="row">证券客户—broker</th><td>客户以证券和现金支持 debit（证券账户借款余额）或空头义务</td><td>initial / maintenance / house margin（初始、维持及券商附加保证金）、集中度</td><td>补款、限制新单、卖出多头或回补空头</td></tr>
              <tr><th scope="row">期货客户—FCM</th><td>客户通过期货佣金商进入清算链</td><td>performance bond（履约担保）、maintenance、daily / intraday VM</td><td>补回规定水平、close-to-fit 或清仓</td></tr>
              <tr><th scope="row">清算会员—CCP</th><td>CCP 以净额集合管理会员违约风险</td><td>IM、VM、default fund（违约基金）、附加保证金</td><td>资源调用、违约管理与组合处置</td></tr>
              <tr><th scope="row">Repo 双方</th><td>现金贷款与证券抵押 / title transfer 安排</td><td>haircut、margin ratio、每日补差、期限</td><td>补现金或抵押品、部分 unwind、不续作</td></tr>
              <tr><th scope="row">基金 / 银行内部</th><td>投资授权、风险预算、资本和流动性治理</td><td>杠杆上限、VaR / ES（两类基于潜在损失分布的风险度量）、集中度、资本限额</td><td>自愿或强制降险，但未必有统一强平价</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          每层拥有不同净额集合、合格抵押品、时钟与处置权。CCP 降低双边对手方网络复杂度，不会让客户 house margin 自动消失；客户在一家主经纪商（prime broker，向基金提供融资、衍生品及相关中介服务）处有余量，也不能未经法律与操作安排直接抵扣另一家 prime 的 call。Archegos 后的银行指引正是因为“每家对手方都有抵押”仍不足以观察跨行总敞口、集中度与潜在未来损失。<Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="stock-flow">
        <p className="section-kicker">04 · Stock 与 Flow</p>
        <h2>资产、负债和权益是某一时点的存量；margin call、variation margin 与卖出所得是跨时点流量，二者不能直接相减而不写清过账路径。</h2>
        <div className="equation-card">
          <span>最小资产负债表</span>
          <div>E<sub>t</sub>=A<sub>t</sub>−D<sub>t</sub></div>
          <p>A、D 与 E 均以同一货币、同一法律实体、同一净额范围和同一估值时点计量，分别表示资产、债务与权益。直白说，权益不是另一个装现金的罐子，而是资产扣除债务后的剩余索取权。若衍生品、担保品或应付款在账本外，恒等式仍成立，但你记录的 A 和 D 不完整。</p>
        </div>
        <div className="equation-card">
          <span>到期流动性预算</span>
          <div>H<sub>τ</sub>=Cash<sub>free,τ</sub>+Collateral<sub>eligible,τ</sub>+Lines<sub>committed,τ</sub>+Inflows<sub>nettable,τ</sub>−VM<sub>due,τ</sub>−ΔIM<sub>due,τ</sub>−OtherCalls<sub>τ</sub></div>
          <p>所有项都是在期限 τ 前能够实际交付的货币价值，H 是到期后的剩余流动性。正的净资产不能保证 H≥0：一栋价值很高但无法当天出售的建筑，可以让主体偿付能力良好，却不能支付下午两点到期的现金 VM。反之，短期现金充足也不代表最终资产价值覆盖债务。</p>
        </div>
      </section>

      <section className="lesson-section" id="leverage-identities">
        <p className="section-kicker">05 · 杠杆恒等式</p>
        <h2>“十倍杠杆”没有分子就没有意义；资产杠杆与债务杠杆只在同一完整账本中相差一。</h2>
        <div className="equation-card">
          <span>资产杠杆与债务杠杆</span>
          <div>L<sub>A</sub>=A/E　；　L<sub>D</sub>=D/E=L<sub>A</sub>−1</div>
          <p>两个杠杆都是无量纲比率，定义域要求 E&gt;0，并要求 A、D、E 属于同一实体、货币、估值时点和净额集合。例如 A=100、D=80、E=20 时，资产杠杆为 5 倍、债务杠杆为 4 倍。若 E=0，比率没有有限值；若 E&lt;0，负号不表示“负风险”，而是原有杠杆口径已经失效。</p>
        </div>
        <p>
          资产杠杆适合回答资产价格对权益的机械放大，债务杠杆适合描述债权融资相对资本。监管报表、基金报告和媒体还会使用 gross notional / NAV（基金净资产价值）、net exposure / NAV、risk-weighted assets（风险加权资产）/ capital 等口径。它们回答不同问题，不能因都带“倍”就直接比较。Adrian 与 Shin 对 broker-dealer 的研究说明资产负债表会随价格和融资条件顺周期扩张或收缩，但聚合机构杠杆不等于某个客户账户的强平距离。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="gross-net-exposure">
        <p className="section-kicker">06 · Gross、Net 与 Exposure</p>
        <h2>净方向接近零的相对价值组合，仍可能占用很大的融资、保证金与平仓容量。</h2>
        <div className="equation-card">
          <span>同一风险单位下的 gross 与 net</span>
          <div>G=Σ<sub>i</sub>|e<sub>i</sub>|　；　N=Σ<sub>i</sub>e<sub>i</sub>　；　L<sub>G</sub>=G/E</div>
          <p>e<sub>i</sub> 必须先换成同一货币、同一价格敏感度和同一时点的有符号敞口；G、N 和 E 的单位是货币，L<sub>G</sub> 无量纲且只在 E&gt;0 时解释为杠杆。一条 +100 的现金债券腿和一条 −98 的期货等价腿给出净方向约 +2，却有 198 的 gross。两腿的基差、结算时钟和抵押品账户可分别变化，所以“小净敞口”不能保证“小现金需求”。</p>
        </div>
        <p>
          Gross 也不是预计损失。它不自动考虑相关性、期权非线性、法律净额、抵押品和 close-out。研究者应同时保存原始头寸、可执行净额集合、风险因子映射与现金流时钟，而不是从一个 gross ratio 反推破产概率。Gârleanu 与 Pedersen 的 margin-based asset pricing 说明，在资本稀缺时占用更多 margin 的资产可能要求更高回报；模型的核心是约束资源，而不是说高 gross 必然表现差。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="risk-units">
        <p className="section-kicker">07 · 风险单位</p>
        <h2>Notional 只告诉你合约尺度；真正的短期损益和保证金敏感度还取决于 delta、DV01（利率变化 1 个基点时的价值变化；1bp=0.01 个百分点）、vega、曲率与基差。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">量</th><th scope="col">单位</th><th scope="col">适合回答</th><th scope="col">不能单独回答</th></tr></thead>
            <tbody>
              <tr><th scope="row">Market value</th><td>货币</td><td>现金资产当前账面规模</td><td>衍生品风险、期限与方向</td></tr>
              <tr><th scope="row">Notional</th><td>货币或合约单位</td><td>合约基准规模与某些规则门槛</td><td>期权实际价格敏感度或最大损失</td></tr>
              <tr><th scope="row">Delta exposure</th><td>标的单位 / 货币</td><td>小幅标的价格变动的一阶损益</td><td>大幅跳跃下的 gamma 与波动变化</td></tr>
              <tr><th scope="row">DV01</th><td>货币 / 1bp</td><td>利率曲线小幅平移的一阶损益</td><td>非平行曲线、凸性与流动性</td></tr>
              <tr><th scope="row">Vega</th><td>货币 / 波动率点</td><td>隐含波动率变化的一阶损益</td><td>价格方向、skew 和高阶风险</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因而“1600 亿美元 exposure”不能自动翻译成“借了 1600 亿美元”，期货 10 亿元 notional 也不等于今天会支付 10 亿元 VM。正确做法是先冻结工具、方向、乘数、风险因子、净额集合、估值时点和抵押品，再计算约束。缺少这些字段时，宁可报告多个有标签的口径，也不要制造一个看似精确的统一杠杆数。
        </p>
      </section>

      <section className="lesson-section" id="mark-to-market">
        <p className="section-kicker">08 · Mark-to-Market</p>
        <h2>债务在短时钟内固定时，资产的每一元损失先由权益吸收；这就是价格变化被杠杆放大的最小机制。</h2>
        <div className="equation-card">
          <span>单资产、固定债务的一期重估</span>
          <div>A<sub>1</sub>=A<sub>0</sub>(1+r)　；　E<sub>1</sub>=E<sub>0</sub>+A<sub>0</sub>r=E<sub>0</sub>(1+L<sub>0</sub>r)</div>
          <div>r<sub>E</sub>=(E<sub>1</sub>−E<sub>0</sub>)/E<sub>0</sub>=L<sub>0</sub>r　；　L<sub>1</sub>=L<sub>0</sub>(1+r)/(1+L<sub>0</sub>r)</div>
          <p>r 与 r<sub>E</sub> 是收益率，L<sub>0</sub>=A<sub>0</sub>/E<sub>0</sub>。若初始资产 100、债务 80、权益 20，资产跌 10% 后资产 90、权益 10：资产收益 −10%，权益收益 −50%，资产杠杆由 5 倍升到 9 倍。公式只在债务和其他现金流于这一时钟内固定、且 1+L<sub>0</sub>r&gt;0 时使用；零权益点是 r=−1/L<sub>0</sub>。</p>
        </div>
        <p>
          “杠杆放大收益”并不是凭空创造损失，而是把同一资产损失集中到更小的权益垫上。价格上涨时权益也被放大；但下跌会同时缩小未来承受能力，使融资约束变得内生。He 与 Krishnamurthy 以及 Brunnermeier 与 Sannikov 的中介模型进一步说明，当专业中介资本稀缺时，风险承受和风险溢价的变化会高度非线性；这属于均衡反馈，不能从单账户恒等式直接估计。<Cite n={16} /><Cite n={17} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="three-liquidities">
        <p className="section-kicker">09 · 三种不同状态</p>
        <h2>Solvency、funding liquidity 与 market liquidity 相互连接，但任何一个都不能替代另外两个。</h2>
        <div className="interface-grid">
          <article><span>Solvency</span><h3>最终资产是否覆盖义务</h3><p>关注资产的经济价值与全部负债。净值为正仍可能因今天缺现金而违约；净值为负也不意味着每份合同已经即时终止。</p></article>
          <article><span>Funding liquidity</span><h3>能否按时取得合格支付资源</h3><p>关注现金、未设押抵押品、融资续作、信用额度、结算与操作时滞。它由金额和期限共同定义。</p></article>
          <article><span>Market liquidity</span><h3>多快、以多大冲击完成交易</h3><p>关注 spread、depth、resilience 与 price impact。账面上“可出售”的资产，在压力状态下未必能按模型价格变现。</p></article>
        </div>
        <p>
          三者的耦合构成火售：资金流动性恶化迫使交易，交易消耗市场流动性并压低价格，低价格再损害偿付能力和抵押价值。Shleifer 与 Vishny 早已指出，最懂一项资产的潜在买家往往与卖方同时受困，使危机中的清算价值低于正常使用价值；Kiyotaki–Moore、Cifuentes 等模型再把抵押价格、借款能力和共同持仓连接成动态反馈。<Cite n={1} /><Cite n={2} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="long-account">
        <p className="section-kicker">10 · 融资多头账本</p>
        <h2>多头保证金账户的核心不是“借了买股票”，而是证券市值随价格变、debit 在短时钟内近似固定，因此权益率会向下穿越维护线。</h2>
        <div className="equation-card">
          <span>融资多头的账户状态</span>
          <div>A=nP　；　E=nP−b　；　μ=E/(nP)=1−b/(nP)</div>
          <p>定义域取 n&gt;0、P&gt;0、b≥0。n 是股数，P 是货币/股，b 是账户 debit，A、E 与 b 都是货币，μ 是权益占证券市值的比例。以 1,200 股、50 元、借款 36,000 元为例，A=60,000、E=24,000、μ=40%。若价格跌到 42 元且 b 暂时不变，A=50,400、E=14,400、μ≈28.57%。</p>
        </div>
        <p>
          上述 40% 初始权益率是用于统一后续算例的教学快照，不代表它能够作为美国普通 margin equity security 的新开仓状态。美国此类证券的联邦初始要求一般为 50%，来自 Regulation T；普通多头的 FINRA maintenance floor 一般为 25%，但会员可以设置更高、随集中度和波动变化的 house requirement。两者分别处理开仓信用与存量维持，不能把 50% 写成永远不变的强平线，也不能把美国地板当作全球规则。<Cite n={33} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="maintenance-trigger">
        <p className="section-kicker">11 · 维持线与催缴价</p>
        <h2>催缴价由存量债务和适用维护比例共同决定；规则比例上调可以在价格不再下跌时制造新的缺口。</h2>
        <div className="equation-card">
          <span>多头维护缓冲与触发边界</span>
          <div>s=(1−m)nP−b　；　P<sub>call</sub>=b/[n(1−m)]</div>
          <p>本式要求 n&gt;0、P&gt;0、b≥0、0≤m&lt;1。m 是适用维护比例，s 是以货币计的合规缓冲：s≥0 表示满足 E≥mnP，s&lt;0 表示存在 deficiency。上例若 m=30%，P<sub>call</sub>=36,000/[1,200×0.70]≈42.86 元；价格 42 元时 s=0.70×50,400−36,000=−720 元。若经纪商把 m 提高，触发价会在债务不变时上移。</p>
        </div>
        <p>
          真实账户还可能按组合抵扣、证券适格性、集中度、低价股规则、波动附加和日内风险计算，而非逐只股票的单线公式。FINRA 的客户披露明确提醒，经纪商可提高 house requirements，并可按协议在不等待客户选择的情况下处置资产。规则给出权利和最低线，却不告诉我们特定券商何时实际行权；实证必须取得账户协议、历史参数与 call 时间戳。<Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="cash-cure">
        <p className="section-kicker">12 · 现金补救</p>
        <h2>Margin call 是缺口，不是已发生卖盘；外部现金偿还债务或增加账户权益时，可以在证券数量与价格不变的情况下恢复合规。</h2>
        <div className="equation-card">
          <span>恢复到目标维护比例的现金量</span>
          <div>X*= [b−(1−m<sub>t</sub>)nP]<sub>+</sub></div>
          <p>[z]<sub>+</sub>=max(z,0)，0&lt;m<sub>t</sub>≤1，m<sub>t</sub> 是题面规定的恢复目标。若现金 X 存入后立即偿还 debit，则 b&apos;=b−X、证券市值不变，权益增加 X。上例在 P=42、目标 30% 时 X*=36,000−0.70×50,400=720 元。若合同要求补回 initial、house 或另一金额，必须用那个目标，而不是自行套用 maintenance floor；若补款后 E&lt;0，账户仍未被治愈。</p>
        </div>
        <p>
          补救也可以是追加适格证券、把未设押抵押品调入、从另一净额腿取得现金、动用承诺额度或由母公司注资。关键不是“账面上有多少资产”，而是它们能否在 call deadline 前到账、是否合格、是否已被设押以及转移本身会不会触发另一处约束。FSB 针对 margin 与 collateral calls 的 2024 建议因此把治理、压力测试、操作能力、多元流动性资源与对手方沟通放在同一框架内，而不是只要求持有一个静态现金比例。<Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="sell-to-delever">
        <p className="section-kicker">13 · Sell-to-Delever</p>
        <h2>不注入资本而卖资产还债时，固定价格下权益暂时不变；去杠杆来自资产与债务同步缩小，而不是卖出本身创造了权益。</h2>
        <div className="equation-card">
          <span>固定价格、无费用的一阶卖出量</span>
          <div>S*= [A−E/m<sub>t</sub>]<sub>+</sub> = [A−L̄E]<sub>+</sub>　；　x*= [n−E/(m<sub>t</sub>P)]<sub>+</sub></div>
          <p>本式取 P&gt;0、0&lt;m<sub>t</sub>≤1；将结果解释成保留正规模头寸并恢复目标比例还要求卖出前 E&gt;0。若 E=0，公式给出全清仓，卖后 A&apos;=E&apos;=0、权益率未定义，只能解释为关闭空账户；若 E&lt;0，全清仓后仍可能留下未偿债务。S* 是应卖出的货币市值，x* 是股数，L̄=1/m<sub>t</sub>。卖出 S 并全部还债后，A&apos;=A−S、D&apos;=D−S，所以在无费用且成交价等于标记价时 E&apos;=E。若 A=84,000、D=60,000、E=24,000，目标资产杠杆 2.5 倍，即 m<sub>t</sub>=40%，则 S*=24,000 元。</p>
        </div>
        <p>
          这只是第一轮计划量。若卖出所得没有全部偿债、资产不可分割、存在税费或多个仓位使用不同 margin rate，结果都要改写。更重要的是，它把成交价格当作外生常数；一旦主体的交易本身压低剩余资产价格，权益会在执行中继续减少，原来“刚好达标”的 S* 就不再够用。
        </p>
      </section>

      <section className="lesson-section" id="impact-recalculation">
        <p className="section-kicker">14 · Impact 后的二次缺口</p>
        <h2>固定价格算出的去杠杆量只是计划；真正成交会改变剩余仓位的标记价，所以必须按“卖出—冲击—再重估”递归计算。</h2>
        <div className="worked-example">
          <span>从刚好合规到再次不足</span>
          <p>假设某账户 120 股、价格 60 元、债务 3,600 元、目标维护率 25%。固定价下 E=3,600 元，账户本来合格。若另一项 call 迫使它先卖出 40 股并还债 2,400 元，剩 80 股和债务 1,200 元；倘若共同卖压把价格从 60 压到 57 元，新权益变为 80×57−1,200=3,360 元，权益率约 73.68%，仍充足。相反，若使用经典缺口账户：120 股、价格 60、债务 6,000，先按固定价卖 40 股还债，剩余债务 3,600；价格再到 57 后权益 960 元、权益率约 21.05%，必须重新出售约 12.63 股才回到 25%。同样的“卖 40 股”，是否产生二次缺口取决于完整初始账本。</p>
        </div>
        <p>
          Price impact 不是手续费：手续费只消耗卖方财富，冲击还会重估所有仍持有该资产的账户，并可能让原本未交易者越过阈值。Coval–Stafford、Ellul 等实证研究分别在共同基金赎回和保险监管压力中记录与强制流量一致的价格压力与反转，但机制来自不同约束，不能统一称为 margin call。<Cite n={22} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="three-lines">
        <p className="section-kicker">15 · 三条线</p>
        <h2>Margin call、liquidation 与 insolvency 分别是规则状态、行为状态与资产负债表状态；它们可以重合，也可以彼此分离。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">状态</th><th scope="col">最小证据</th><th scope="col">常见误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">Call / deficiency</th><td>适用公式、当前参数、账户状态、通知金额与期限</td><td>把低于某条公开地板直接当作实际通知</td></tr>
              <tr><th scope="row">Forced liquidation</th><td>补救失败、处置权被行使、真实减仓和时间顺序</td><td>把任何亏损后的自愿卖出称作强平</td></tr>
              <tr><th scope="row">Default</th><td>约定义务到期未履行及适用合同后果</td><td>把短暂流动性缺口等同整体破产</td></tr>
              <tr><th scope="row">Insolvency</th><td>完整资产、负债、估值和适用法律测试</td><td>用某一账户负权益推断整个集团法定资不抵债</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          例如，长期资产的经济价值可能超过全部债务，但主体当天拿不出 VM，因而先违约；也可能账户触发 call，却由母公司及时补资而无卖盘；还可能风险经理在阈值前主动降险。Shleifer–Vishny 的 limits of arbitrage 强调资本提供者会在表现差时撤资，使正确的长期观点也无法坚持；这是一种委托代理和融资约束，不必等同 broker 的机械强平。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="short-account">
        <p className="section-kicker">16 · 融券空头账本</p>
        <h2>空头是方向性反例：价格上涨侵蚀权益并可能制造买单；价格下跌通常释放保证金，而不是制造更多卖盘。</h2>
        <div className="equation-card">
          <span>教学空头账户</span>
          <div>E=C−nP　；　μ<sub>s</sub>=E/(nP)　；　P<sub>call</sub>=C/[n(1+m<sub>s</sub>)]</div>
          <p>定义域取 n&gt;0、P&gt;0、C≥0、m<sub>s</sub>≥0。C 是卖空所得与额外担保形成的信用余额，nP 是回购义务的当前市值，m<sub>s</sub> 是要求的空头权益比例。合规条件 C−nP≥m<sub>s</sub>nP，整理即得催缴价。若卖空 120 股、C=9,000 元、m<sub>s</sub>=30%，催缴价约 57.69 元；价格越过它时，空头需要补现金或减少回购义务。</p>
        </div>
        <p>
          空头账户现实中还叠加借券担保、借券费、召回、buy-in 和标的集中度，C 也可能包含受限卖出所得而非自由现金。1.19 已建立这些合约时钟；本节只强调方向：上涨—call—buy-to-cover 可以形成 short squeeze，所以下跌与被迫卖出的同向关系绝不是“杠杆”的普遍定律。
        </p>
      </section>

      <section className="lesson-section" id="short-cover">
        <p className="section-kicker">17 · 空头补救与回补</p>
        <h2>空头的现金补救提高 C；减仓补救则是买回股票，虽然会消耗现金，却减少未来回购义务与方向风险。</h2>
        <div className="equation-card">
          <span>空头现金缺口</span>
          <div>X<sub>s</sub>*=[(1+m<sub>s</sub>)nP−C]<sub>+</sub></div>
          <p>X<sub>s</sub>* 是在股票数量不变时恢复要求的现金。若不补现金而买回，必须同时重算买回成本、剩余 C 的合同处理、借券返还和价格冲击，不能机械把多头 sell-to-delever 公式换一个符号。直白说，多头靠卖出缩表，空头靠买回缩小负的证券头寸。</p>
        </div>
        <p>
          可预见的大额回补还可能吸引其他交易者提前买入，恶化空头成交价格。Brunnermeier 与 Pedersen 的 predatory trading 模型说明，被迫交易的可预测性如何使市场价格在清算前进一步移动；它提供一种可能机制，却不能让我们从异常上涨直接断言存在操纵或强平。<Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="repo-ledger">
        <p className="section-kicker">18 · Repo 账本</p>
        <h2>Repo 在经济上把证券抵押融资与未来回购承诺连接起来；它的关键状态是抵押品价值、现金本金、期限、补差与可续作性。</h2>
        <p>
          在典型 repo 中，现金借方交付证券并承诺在未来以约定价格回购；法律形式常是 title transfer，而经济分析把它视为有抵押融资。设抵押品市值 V、现金本金 B。价格下跌会减少 V；每日 margining 可要求补证券或归还部分现金；到期时即使没有当日缺口，贷款人也可能拒绝续作。短期 repo 因而同时包含 <b>mark-to-market risk</b> 与 <b>rollover risk</b>。
        </p>
        <p>
          Gorton 与 Metrick 记录特定双边证券化 repo 市场危机中的 haircut 上升与融资收缩；Copeland、Martin 与 Walker 对美国 tri-party repo 的研究却发现 Lehman 前多数交易并未出现同样普遍的 haircut 挤兑。两项证据并不矛盾，而是提醒我们按抵押品、对手方、清算结构与细分市场作结论，不能把“repo run”写成所有 repo 同步采用同一过程。<Cite n={27} /><Cite n={28} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="haircut-conventions">
        <p className="section-kicker">19 · Haircut 与 Repo Margin</p>
        <h2>同一经济条款可用不同分母报价；不保存原始抵押品价值与现金本金，就可能把 2% 和 102% 当成两个风险状态。</h2>
        <div className="equation-card">
          <span>两种常见口径</span>
          <div>h=(V−B)/V=1−B/V　；　M=V/B=1/(1−h)</div>
          <p>换算要求 V&gt;0、B&gt;0、h&lt;1；h 在实际市场中可以为负，不能默认 h≥0。h 以抵押品市值 V 为分母，M 以现金本金 B 为分母，二者都无量纲。若 V=102、B=100，则 h≈1.9608%，M=102%。市场资料可能把后者称作 repo margin。实证导入必须保存 V、B、币种、估值时点和报价方向，再做换算；直接拼接名为 “margin” 的字段会制造虚假的跳变。</p>
        </div>
        <div className="boundary-box"><b>零 haircut 的护栏</b><p>在单资产、全部通过 repo 融资、没有资本、流动性、期限、集中度和再抵押限制的玩具模型里，自有资金份额 h 对应约 1/h 的资产杠杆；h=0 使这个玩具比率没有有限上界。真实机构仍受 VM、续作、信用限额、资本、净额和操作约束，因此“零 haircut”不等于可以获得无限真实杠杆。ICMA 的定义也要求先确认交易采用哪种 margin / haircut 报价惯例。<Cite n={53} /></p></div>
      </section>

      <section className="lesson-section" id="repo-margin">
        <p className="section-kicker">20 · Repo Margin Call</p>
        <h2>抵押品跌价会缩小可支持的现金本金；即使价格不动，目标 haircut 上调也会产生相同方向的融资缺口。</h2>
        <div className="equation-card">
          <span>保持本金时的 repo 缺口</span>
          <div>Gap<sub>repo</sub>=[B−(1−h*)qP]<sub>+</sub></div>
          <p>qP 是当前抵押品市值，B 是未偿现金本金，h* 是新目标 haircut，Gap 以货币计。若债券市值 2,000 万元、旧 h=4%、故 B=1,920 万元；价格不变但新 h*=7%，新融资上限只有 1,860 万元，借方需归还 60 万元现金或追加足够抵押品。若 P 同时下降，两种冲击会叠加。</p>
        </div>
        <p>
          实际 margining 还受 minimum transfer amount、估值争议、货币 haircut、抵押品替换、净额和结算时间制约。一个按公式出现的 10 万元差额，如果低于合约转移门槛，可能暂不形成当天现金流；同样的差额若在多个交易上聚集，也可能突然超过门槛。研究必须保存原始 call、due、settled 和 dispute 状态，不能从日末 haircut 反推日内真实现金路径。
        </p>
      </section>

      <section className="lesson-section" id="haircut-unwind">
        <p className="section-kicker">21 · Haircut 上升与 Unwind</p>
        <h2>融资条款收紧时，借方可以补现金、追加抵押品、缩小融资或更换对手方；只有替代路径失败，haircut shock 才转化为现货出售。</h2>
        <div className="mechanism-flow">
          <span>抵押品波动 / 对手方风险上升</span><i>→</i><span>haircut 上调或不续作</span><i>→</i><span>同一资产可借现金下降</span><i>→</i><span>现金与抵押品瀑布</span><i>→</i><span>部分 repo unwind</span><i>→</i><span>出售腾出的证券</span><i>→</i><span>抵押品价格与融资容量再下降</span>
        </div>
        <p>
          这条链的强度取决于期限。隔夜融资每一天都要重新获得同意，长期融资则把再定价推迟到未来，但可能设置触发条款。Acharya 与 Viswanathan 的模型说明短期债务无法续作时，金融机构会在低价环境中去杠杆；Fostel 与 Geanakoplos 则强调“哪种抵押品仍被信任”也会变化。两者是机制模型，不提供任一真实 repo 的自动强平价。<Cite n={14} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="derivatives-notional">
        <p className="section-kicker">22 · 期货 Notional</p>
        <h2>期货用相对较小的 performance bond 承载较大价格敞口，但 notional、保证金余额和当日现金损益是三个不同数字。</h2>
        <div className="equation-card">
          <span>线性期货的教学尺度</span>
          <div>Notional=|nkF|=|n|k|F|　；　ΔV≈nkΔF</div>
          <p>n 是有符号合约张数，k&gt;0 是每点货币乘数，F 是可正可负的期货点位；notional 与 ΔV 都是货币。15 张多头、每点 50 元、点位 4,500，对应 notional 3,375,000 元；点位下降 68 点的一阶损失是 15×50×(−68)=−51,000 元。保证金余额不等于 notional，也不是合约购买价。</p>
        </div>
        <p>
          CFTC 与 CME 都把期货 margin / performance bond 描述为履约担保，而不是股票融资购买中的首付款。交易所或清算机构设定最低水平，FCM 可以要求更多；产品、波动和集中度变化会改变要求。任何教材数字都只能是题面参数，实时交易必须读取当日产品规则。<Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="variation-margin">
        <p className="section-kicker">23 · Variation Margin</p>
        <h2>在线性期货的逐日结算模型中，VM 把已经发生的按市值损益转成高频现金转移；更广泛的双边安排须按协议判断合格抵押品。它不等于为未来风险预先准备的 IM。</h2>
        <div className="equation-card">
          <span>线性期货的逐期 VM</span>
          <div>VM<sub>t</sub>=nk(F<sub>t</sub>−F<sub>t−1</sub>)　；　C<sub>t</sub>=C<sub>t−1</sub>+VM<sub>t</sub>−OtherOutflows<sub>t</sub>+OtherInflows<sub>t</sub></div>
          <p>从账户持有者视角，VM&gt;0 是收到现金，VM&lt;0 是支付现金；符号约定必须明确，OtherOutflows 与 OtherInflows 明确排除已经单列的 VM，避免同一笔结算被过账两次。若上节 15 张多头损失 51,000 元，而截止前只有 38,000 元自由现金，缺口是 13,000 元。平掉合约可以降低未来价格敏感度和未来 IM，却不会把已经结算出去的 51,000 元自动拿回来。</p>
        </div>
        <p>
          PFMI 将 CCP 的 VM 与当前敞口、IM 与违约到平仓期间的潜在未来敞口分开。2020 年极端波动后，国际政策重点也从单纯增加保证金转向提高调用可预测性、操作流程与参与者流动性准备。<Cite n={38} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="im-mm-close">
        <p className="section-kicker">24 · IM、Maintenance 与 Close-to-Fit</p>
        <h2>Initial margin 决定进入或维持头寸所需的风险缓冲，maintenance 决定何时需要补足；触发后究竟补回哪条线必须读取具体规则。</h2>
        <p>
          客户期货账户常在余额低于 maintenance 时收到 call，并被要求补回 initial；另一些组合型或 house 规则可能要求恢复到不同目标。若账户不能注资，FCM 可 close-to-fit：平掉足够头寸，使剩余组合所需保证金不高于可用余额。这个数量不是 “现金缺口 ÷ 当前 IM” 的普遍恒等式，因为平仓本身会结算损益、释放的 IM 随组合和风险抵扣变化，市场移动还会继续产生 VM。
        </p>
        <p>
          风险敏感 IM 会在波动上升时增加保护，也可能在最缺现金时上升。Glasserman 与 Wu 说明持续波动估计如何产生保证金顺周期性，并讨论缓冲设计；但“顺周期”不等于“保证金应取消”。Biais、Heider 与 Hoerova 显示 VM 虽可能诱发火售，仍可能因为改善激励和风险分担而具有约束下的有效性。政策问题是如何权衡违约保护、激励和流动性外部性，而不是把较低 margin 当作无成本稳定器。<Cite n={32} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="cleared-uncleared">
        <p className="section-kicker">25 · Cleared 与 Uncleared</p>
        <h2>中央清算把双边网络变成面向 CCP 的净额与违约管理体系；非中央清算则依赖双边净额集合、阈值、抵押品和托管安排。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">结构</th><th scope="col">主要优点</th><th scope="col">主要剩余约束</th></tr></thead>
            <tbody>
              <tr><th scope="row">CCP cleared</th><td>多边净额、标准化 margin、集中违约管理与透明规则</td><td>CCP 集中度、会员与客户附加、集中 VM 现金需求、可移植性</td></tr>
              <tr><th scope="row">Bilateral uncleared</th><td>可定制合约与对手方安排</td><td>双边净额碎片、估值争议、门槛、托管、跨对手方总敞口不可见</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          BCBS–IOSCO 的非中央清算框架把 VM 用于当前敞口、IM 用于潜在未来敞口，并规定适用主体、阈值、抵押品与隔离原则；它是国际基准，经各法域落实后具体数值和豁免可能不同。中央清算也不必然增加总抵押品需求：多边净额可节省抵押品，风险模型与客户附加又可能增加需求，净效果依赖原网络和产品组合。<Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="netting-collateral">
        <p className="section-kicker">26 · 净额、Cross-Margin 与 Collateral</p>
        <h2>经济上相互对冲的两条腿，只有在法律、账户、币种、结算和风险模型都允许时，才会转化为可用的保证金节省。</h2>
        <p>
          <b>Netting</b> 回答违约或日常结算时哪些应收应付可以合并；<b>cross-margin</b> 回答风险模型是否承认不同产品的对冲；<b>segregation</b> 回答抵押品是否与中介自有资产隔离；<b>rehypothecation</b> 回答接收方能否再次使用抵押品；<b>house add-on</b> 则是中介在最低模型之上追加的客户要求。五者彼此相关，却不是同一个开关。
        </p>
        <p>
          因此，即使题面规定一笔利率 swap 的 VM 以现金交付，预计收到的 1,000 万元也不一定能在同一时刻抵销股票 prime 账户的 1,000 万元 call：法律实体可能不同，现金尚未结算，币种不合格，或对手方不允许跨产品使用。Gromb 与 Vayanos 的受限套利模型把分割市场中的资本约束与价格偏离联系起来；现实的净额和跨保证金安排可以缓和分割，却不会自动消除基差、时钟与法律边界。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="constraint-map">
        <p className="section-kicker">27 · 六类约束地图</p>
        <h2>同样表现为“卖出”，背后可能是客户 margin、repo、CCP、银行资本、基金赎回或风险预算；机制诊断必须先分类，再比较反馈。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">约束</th><th scope="col">首先变化的状态</th><th scope="col">典型行动</th><th scope="col">识别所需额外证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">Broker margin</th><td>账户权益率 / house requirement</td><td>补款、卖多头、回补空头</td><td>账户级 debt、规则版本、call 与 liquidation 标记</td></tr>
              <tr><th scope="row">Repo / SFT（证券融资交易）</th><td>抵押价值、haircut、续作意愿</td><td>补抵押、还现金、unwind</td><td>V、B、期限、haircut、margin transfer 与续作</td></tr>
              <tr><th scope="row">CCP / derivatives</th><td>VM 结算资源（本节期货分支为现金流）、IM 模型、附加项</td><td>调现金或合格抵押品、压缩组合、close-to-fit</td><td>净额集合、模型参数、call / settlement 时点</td></tr>
              <tr><th scope="row">Bank capital</th><td>资本率、RWA（风险加权资产）、总暴露和限额</td><td>发资本、留收益、对冲、缩减资产</td><td>监管口径与管理行动；不存在统一证券强平价</td></tr>
              <tr><th scope="row">Fund redemption</th><td>投资者提取基金负债</td><td>用现金、借款、卖出资产</td><td>流量、现金、流动性分层与反稀释规则</td></tr>
              <tr><th scope="row">VaR / ES / risk budget</th><td>波动、相关性与尾部风险估计</td><td>缩 gross、对冲或改变组合</td><td>模型、窗口、限额和真实风险指令</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Hameed、Kang 与 Viswanathan 发现市场下跌后流动性恶化在资本约束更紧时更明显；Ben-David 等记录 2008 年对冲基金在赎回与 margin 压力下减持。它们支持“资金约束会影响交易能力”，却不允许把所有危机卖盘都归入同一种 broker 强平。<Cite n={23} /><Cite n={25} />
        </p>
        <div className="boundary-box"><b>截至 2026 年的政策边界</b><p>FSB 对非银金融中介杠杆的最终建议采用“识别与数据—活动或实体工具—银行对手方管理—披露与跨境协调”的工具箱，而不是为全球所有 hedge fund 规定一个统一杠杆上限。规则事实与单账户数学都不能替代具体法域、机构和日期的核对。<Cite n={42} /></p></div>
      </section>

      <section className="lesson-section" id="forced-sale-function">
        <p className="section-kicker">28 · 第一轮被迫卖出函数</p>
        <h2>个体卖量是价格、债务、阈值与可用替代流动性的分段函数；阈值附近的账户分布比平均杠杆更重要。</h2>
        <div className="equation-card">
          <span>多账户、固定价格的教学卖量</span>
          <div>d̃<sub>i</sub>=d<sub>i</sub>−X<sub>i</sub>　；　q<sub>i</sub>(P)=clip([n<sub>i</sub>−(n<sub>i</sub>P−d̃<sub>i</sub>)/(m<sub>i</sub>P)]<sub>+</sub>, 0, n<sub>i</sub>)</div>
          <p>定义域取 P&gt;0、n<sub>i</sub>≥0、0&lt;m<sub>i</sub>≤1、0≤X<sub>i</sub>≤d<sub>i</sub>。i 表示账户，d̃<sub>i</sub> 是外部现金 X<sub>i</sub> 实际到账并偿还债务后的有效债务，q<sub>i</sub> 是随后按固定价卖出并还债的股数；clip 把结果限制在 0 到可卖股数之间。若 n<sub>i</sub>P−d<sub>i</sub>+X<sub>i</sub>&lt;0，q=n 后仍有未偿债务；若该式恰等于 0，q=n 关闭空账户，但目标权益率是 0/0。两者都不能称为恢复到 m<sub>i</sub>。直白说，价格下降不会让所有人平滑多卖一点：远离阈值者卖量仍为零，刚越线者进入卖出区，现金更充足者又可能退出卖出区。</p>
        </div>
        <p>
          因而市场脆弱性不由平均 L 决定。两个市场平均杠杆相同，但若一个市场大量账户集中在相同维护线附近，另一个分布分散，前者会在小冲击下出现更同步的订单。中国账户级研究显示，接近 margin call 的融资交易者更可能减仓并通过共同持仓造成跨股票溢出；其中一部分可能是阈值前的预防性出售，不能全部改称 broker 已机械执行的强平。<Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="impact-units">
        <p className="section-kicker">29 · Price Impact 的单位</p>
        <h2>卖量只有相对于可吸收容量才有价格含义；把金额、股数与 ADV 混用，会让反馈系数失去可解释单位。</h2>
        <div className="equation-card">
          <span>局部对数冲击映射</span>
          <div>ΔlnP=−η(Q/ADV)</div>
          <p>ADV 必须大于 0；Q 与 ADV 必须同为股数或同为货币成交额，并使用一致时间窗，故 Q/ADV 无量纲；η 表示单位成交量占比对应的局部对数价格变化，也是无量纲。本式是压力测试映射，不是普遍结构定律。真实 impact 可能非线性、依交易速度和订单簿状态变化，买方深度也会在压力中撤退。</p>
        </div>
        <p>
          若将 Q 定义为计划卖量而非真实成交，模型会夸大冲击；若 ADV 使用危机前日均量，又可能高估危机当日可吸收深度；若价格下跌本身增加成交量，使用同期 ADV 还会产生内生分母。研究应同时报告股数、货币金额、参与率、执行窗口、实现冲击与基准价格，并用 1.09 的订单簿机制解释 η 为什么随状态变化。
        </p>
      </section>

      <section className="lesson-section" id="recursive-spiral">
        <p className="section-kicker">30 · 多轮 Mark–Sell–Impact</p>
        <h2>强平螺旋不是一句叙事，而是一组必须按相同账本顺序反复更新的状态方程。</h2>
        <div className="equation-card">
          <span>教学递归</span>
          <div>Q<sub>k</sub>=Σ<sub>i</sub>q<sub>i,k</sub>　；　P<sub>k+1</sub>=P<sub>k</sub>exp[−ηQ<sub>k</sub>/ADV]</div>
          <div>n<sub>i,k+1</sub>=n<sub>i,k</sub>−q<sub>i,k</sub>　；　d<sub>i,k+1</sub>=d<sub>i,k</sub>−X<sub>i,k</sub>−q<sub>i,k</sub>P<sub>k</sub>+Costs<sub>i,k</sub></div>
          <div>E<sub>i,k+1</sub>=E<sub>i,k</sub>+X<sub>i,k</sub>−n<sub>i,k+1</sub>(P<sub>k</sub>−P<sub>k+1</sub>)−Costs<sub>i,k</sub></div>
          <p>本式要求 ADV&gt;0、P<sub>k</sub>&gt;0。第 k 轮先让尚未计入 E<sub>i,k</sub> 的外部现金 X<sub>i,k</sub> 到账并偿债，再按 P<sub>k</sub> 计算卖量。本分支把 Costs 定义为以货币计、从本轮卖出所得中支付的非负执行成本，并要求 0≤Costs<sub>i,k</sub>≤q<sub>i,k</sub>P<sub>k</sub>；它等额减少实际偿债额并留在下一轮 d 中，由此仍有 E<sub>i,k+1</sub>=n<sub>i,k+1</sub>P<sub>k+1</sub>−d<sub>i,k+1</sub>。若成本超过卖出所得、由独立现金账户支付，或已经通过成交价折让体现，就必须另设现金或融资状态并避免重复计量。X 只能过账一次；下一轮的 E 与 d 都使用本轮结束后的状态。</p>
        </div>
        <p>
          Kiyotaki–Moore 的抵押反馈、Lorenzoni 的火售外部性与 Brunnermeier–Pedersen 的流动性螺旋分别突出不同层次：抵押价格改变借款能力，私人出售忽视对他人资产负债表的价格外部性，融资与市场流动性共同恶化。它们构成一张机制地图，不是可以随意相加的三个经验系数。<Cite n={2} /><Cite n={10} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="loop-gain">
        <p className="section-kicker">31 · 局部 Loop Gain</p>
        <h2>局部反馈有多强，取决于“价格跌多少会新增多少卖量”与“这些卖量又会附加多少价格冲击”的乘积。</h2>
        <div className="equation-card">
          <span>特定线性化下的局部增益</span>
          <div>−∂q<sub>i</sub>/∂lnP=(d<sub>i,k</sub>−X<sub>i,k</sub>)/(m<sub>i</sub>P<sub>k</sub>)　，i∈interior</div>
          <div>𝒢=(η/ADV)Σ<sub>i∈interior</sub>(d<sub>i,k</sub>−X<sub>i,k</sub>)/(m<sub>i</sub>P<sub>k</sub>)</div>
          <p>interior 严格指 0&lt;q<sub>i,k</sub>&lt;n<sub>i,k</sub>。位于 q=0 或 q=n 的截断区内部时，局部导数为零；恰在进入或离开截断区的折点，双侧导数不存在，只能考察单侧变化。这里假定 X 已在卖量确定前到账、0≤X≤d，且在局部扰动中固定；因此 (d−X)/(mP) 具有股数单位，与 ADV 抵消，η 和 𝒢 都无量纲。𝒢 是初始 log-price 变化经新增卖量产生的<b>附加</b>价格冲击与初始变化之比，即开环反馈增益。</p>
        </div>
        <div className="worked-example"><span>不会微积分也能读</span><p>把 −∂q<sub>i</sub>/∂lnP 读成“价格按比例再跌一点，该账户会新增多少卖股”。若内部卖出区账户的合计敏感度为 80,000 股、ADV 为 1,000,000 股、η=1，那么 𝒢=0.08。一次约 1% 的初始跌幅会先新增约 800 股卖量；800/1,000,000=0.0008，所以本轮再附加约 0.08% 的价格跌幅。随后仓位、债务和活跃账户会改变，因此这仍不是最终多轮结果。</p></div>
        <p>
          𝒢 不是上一节完整价格映射的导数，更不能单独充当多轮收敛判据。对 P<sub>k+1</sub>=P<sub>k</sub>exp[−ηQ(P<sub>k</sub>)/ADV]，若暂时固定 n、d、X、η、ADV 与 interior 集合，则 ∂lnP<sub>k+1</sub>/∂lnP<sub>k</sub>=1+𝒢；若 η/ADV 对价格或订单状态内生变化，导数还包含 −Q∂(η/ADV)/∂lnP 项。真正的多轮稳定性还要联合线性化 n、d、现金、规则和活跃账户集合的更新。这个区别防止把一个有清晰单位的局部压力指标误写成跨市场通用的“危机临界值”。
        </p>
        <p>
          临界性还可能来自策略互补：交易者预期别人触发就先卖，导致阈值前市场变薄。Morris 与 Shin 的 liquidity black holes 展示这类共同反应如何形成单边市场；Xiong、Kyle 与 Xiong 则说明套利者财富损失可使价差扩大并把冲击传到另一市场。模型支持“可能出现非线性”，但不能用事后大跌倒推 𝒢 事前必然大于某个固定数字。<Cite n={7} /><Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="cross-asset">
        <p className="section-kicker">32 · 共同持仓与跨资产传染</p>
        <h2>主体遭受 A 资产损失后，常常出售最容易变现的 B，而不是继续卖最先下跌的 A；传染来自共同资产负债表，不要求基本面相同。</h2>
        <div className="equation-card">
          <span>多资产压力测试映射</span>
          <div>ΔlnP<sub>a</sub>=−Σ<sub>b</sub>Λ<sub>ab</sub>(Sales<sub>b</sub>/ADV<sub>b</sub>)</div>
          <p>a 是被重估资产，b 是被出售资产；Sales 与 ADV 必须在每个 b 上采用同一股数或货币口径，Λ<sub>ab</sub> 描述 b 的出售怎样影响 a。对角项是直接冲击，非对角项可以来自共同持有人、替代关系、dealer 资产负债表或信息推断。Λ 是给定窗口的简化映射，不是永久结构参数。</p>
        </div>
        <p>
          资金瀑布决定卖什么：未设押、结算快、spread 小且不承担关键 hedge 功能的资产，可能最先被卖。Jotikasthira、Lundblad 与 Ramadorai 记录基金资金冲击通过海外持仓传递，说明共同投资者可跨国传播卖压；但基金流量并非完全外生，相关性上升也可能来自共同宏观新闻。<Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="stabilizers-counterexamples">
        <p className="section-kicker">33 · 稳定器与八个反例</p>
        <h2>同一条反馈链上的每个箭头都可能被缓冲、反转或截断；这正是判断“下跌会不会制造更多卖盘”的条件集合。</h2>
        <div className="check-grid">
          <details><summary>01 · 全额付款多头</summary><p>资产下跌降低财富，却没有 debit、margin call 或机械卖出义务；投资者仍可能因观点变化自愿卖出。</p></details>
          <details><summary>02 · 有充分现金或合格抵押品</summary><p>账户产生 call，但可在期限内补足，因此没有现货卖单。Call 数据不能直接换算 forced-flow。</p></details>
          <details><summary>03 · 空头在下跌中盈利</summary><p>回购义务变小、权益上升，约束通常放松；若无其他组合 call，方向与“下跌—卖出”相反。</p></details>
          <details><summary>04 · 长 gamma 对冲者</summary><p>标的下跌使其 delta 更负时，可能需要买入标的；短 gamma 才常在下跌中继续卖出。衍生品头寸符号不可省略。</p></details>
          <details><summary>05 · Call 低于转移门槛</summary><p>Repo 或双边衍生品虽出现估值差额，却未超过 minimum transfer amount，今天不发生现金转移。</p></details>
          <details><summary>06 · 可执行净额产生同步流入</summary><p>另一腿在同一法律净额集合、同币种和同结算时点产生等额 VM 收入，外部卖资需求被抵消。</p></details>
          <details><summary>07 · 深口袋逆向买家</summary><p>存在 forced sale，却被资本充足的买方吸收，价格不再下跌。强制卖量与大幅冲击不是同一事实。</p></details>
          <details><summary>08 · 其他约束冒充 margin</summary><p>赎回、VaR、stop-loss、趋势跟随或银行资本也能制造顺势卖盘，但其触发器、时钟和政策含义不同。</p></details>
        </div>
        <p>
          稳定器包括预先现金缓冲、承诺额度、多元抵押品、中央或双边净额、分散阈值、较长期融资、反周期 margin buffer、做市资本和最终买家。Plantin、Sapra 与 Shin 说明在非流动长期资产上逐市计价可能诱发低效反馈，却不支持“公允价值总是有害”；Biais 等进一步说明保证金的激励收益可与火售成本并存。反例的作用不是否定杠杆反馈，而是规定它何时成立。<Cite n={11} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="cases">
        <p className="section-kicker">34 · 三个真实案例</p>
        <h2>LDI、2020 Treasury 与 Archegos 都出现“损失—现金需求—去杠杆”，但初始冲击、融资工具、数据口径和可作结论完全不同。</h2>
        <div className="interface-grid">
          <article><span>UK · 2022</span><h3>LDI：偿付能力与即时现金分离</h3><p>LDI（负债驱动投资）用长期 gilt（英国政府债券）和利率衍生品匹配 DB（固定给付）养老金的长期负债。财政与宏观重新定价推动长期 gilt 收益率急升；杠杆 LDI 的净资产价值（NAV）下降、repo 与利率衍生品 calls 上升，养老金向基金调拨抵押品又有操作时滞，迫使部分主体出售长期国债。BoE 报告 30 年期收益率四个工作日约升 140bp；2022-09-23 至 10-14，DB schemes 净售约 £14bn gilts、LDI funds 约 £23bn，估计 calls 超过 £70bn。其中，超过 £70bn 的 calls 衡量现金或抵押品需求，不等于投资损失；LDI 是放大器，不应被写成最初宏观冲击的唯一来源。<Cite n={44} /><Cite n={45} /></p></article>
          <article><span>US Treasury · 2020</span><h3>Dash for cash：basis trade 是多条卖压之一</h3><p>Cash–futures basis trade 通常买入现货美国国债（Treasury）、卖出相近的期货，押注两腿价格收敛；现货腿常以 repo 融资。疫情引发全球现金需求，外国官方机构、共同基金等同时出售 Treasury，券商用于承接库存和中介交易的资产负债表容量（dealer capacity）承压；basis 异常又使高杠杆相对价值基金面对损失、期货 VM 与 repo 续作压力。Fed 后续估计 2020 年 3 月 hedge fund Treasury holdings 减少 $141bn，其中 basis-trade-likely funds 为 $127bn；这些数字不可与衍生品腿变化相加。FSB 将 basis unwind 视为贡献因素而非唯一原因；Fed 的期货细分研究又发现 basis traders 不是期货市场失灵的重要驱动，说明结论依市场分段而变。<Cite n={46} /><Cite n={47} /><Cite n={48} /></p></article>
          <article><span>Archegos · 2021</span><h3>合成杠杆与跨对手方盲区</h3><p>Total return swap（TRS）让银行把股票总回报的经济效果转给基金，而基金不必以现金股票持有人身份公开持仓；使用多家 prime 时，每家还可能只看见总组合的一部分。SEC 2022 民事诉状指称，Archegos 从 2020-03-31 约 $1.6bn invested capital、$10.2bn gross exposure 扩张至 2021-03-22 超过 $36bn capital、$160bn gross exposure；集中标的下跌、无法满足 calls 与同步处置令多家银行受损。诉状数字必须标成 allegations，gross exposure 不是债务；2024 年刑事定罪与判刑才确认欺诈和操纵核心事实。Fed 与 FINMA 的事后材料分别记录银行体系损失超过 $10bn、Credit Suisse 超过 $5bn 损失及风险治理缺陷。杠杆机制、跨行信息碎片与法律归责必须分层。<Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={52} /></p></article>
        </div>
        <div className="boundary-box"><b>案例阅读协议</b><p>每个案例都按“初始外生或信息冲击 → 首个受损账本 → call 的债权人与期限 → 可用补救 → 真实出售 → 市场影响 → 干预”重建；同时单列哪些数字是估计、诉状指称、司法确认或监管结论。相似的反馈形状不等于同一法律责任，也不允许把不同口径金额相加。</p></div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 如何识别“被迫”</p>
        <h2>价格下跌与卖量同期相关几乎没有识别力；最强证据来自冲击前已确定的头寸和条款、距阈值距离、真实 call 以及处置标记。</h2>
        <div className="equation-card">
          <span>账户级 distance-to-call</span>
          <div>Slack<sub>it</sub>=E<sub>it</sub>−m<sub>it</sub>A<sub>it</sub></div>
          <p>Slack 以货币计；i 是账户，t 是时点。可检验卖出概率或数量是否在 Slack 穿越 0 附近离散上升。但价格同时进入 E、A 与卖出决定，m 还可能因波动内生上调，所以简单断点图仍会混入机械相关和政策选择。</p>
        </div>
        <p>
          更强设计先冻结冲击前持仓、债务与合同，用对账户共同资产 A 的外生冲击预测其对未受消息影响资产 B 的出售；或利用可信的 margin eligibility / broker policy discontinuity，并验证处理确实改变融资、距阈值和真实处置。Kahraman 与 Tookes 利用印度 margin eligibility 阈值发现杠杆交易在平时改善流动性、危机时作用反转；Bian 等的中国账户数据能够直接观测账户距 call 的距离，但两者都只识别特定制度和局部样本，不能外推成全球常数。<Cite n={30} /><Cite n={31} />
        </p>
        <p>
          还要控制共同基本面新闻、赎回、VaR、趋势策略和自愿降险，画出事件前账户行为，报告模型能否发现预先规定的经济上重要差异。事后短期反转可与流动性卖压一致，却不能单独证明强平；公共融资余额下降更看不到账户分布、现金补救和 broker 行权，只能作为辅助状态变量。
        </p>
      </section>

      <section className="lesson-section" id="measurement-protocol">
        <p className="section-kicker">36 · 测量协议</p>
        <h2>要复原这条因果链，最小观测单位应是“法律实体—账户—对手方 / CCP—产品—时间戳”，而不是日末市场总余额。</h2>
        <div className="table-wrap">
          <table>
            <thead><tr><th scope="col">层</th><th scope="col">最低字段</th><th scope="col">必须保存的口径</th></tr></thead>
            <tbody>
              <tr><th scope="row">头寸与风险</th><td>数量、方向、价格、market value、notional、delta、DV01、vega</td><td>币种、乘数、估值源、时点、风险因子</td></tr>
              <tr><th scope="row">资产负债表</th><td>现金、debit、借款、权益、应计利息、未实现损益</td><td>实体、账户、净额集合和会计边界</td></tr>
              <tr><th scope="row">抵押与保证金</th><td>required / posted IM、MM、VM、haircut、add-on、house rate</td><td>原始分子分母、合格性、币种、threshold、MTA</td></tr>
              <tr><th scope="row">时钟</th><td>call、due、settled、disputed、default、liquidated 时间</td><td>时区、日内截止、结算延迟与规则版本</td></tr>
              <tr><th scope="row">行动与成交</th><td>注资、换抵押品、额度使用、repo 续作、真实订单和成交</td><td>计划量与执行量分开，保存基准价、冲击与费用</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          推荐派生量包括 Slack、到期流动性覆盖、未设押高流动性资产、gross / net / risk-unit exposure、call-to-cure time、forced sales / ADV 和共同持仓网络。所有比率都应保留原始分子分母；所有规则都应版本化；所有跨账户聚合都应记录法律是否允许净额。只有这样，研究者才能把“冲击存在”“约束触发”“补救失败”“订单执行”和“价格影响”分别检验，而不是让一个模糊的 deleveraging 指标替整条链作证。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">37 · 互动实验</p>
        <h2>先在单账户账本中精确计算，再切换到系统模式判断触发来源、资金瀑布、反馈与证据边界。</h2>
        <p>
          模式 A 的四题分别训练融资多头现金缺口、固定价卖出降杠杆、haircut 单独上调与期货 VM；模式 B 则要求判断 house rule 变化、跨资产筹资、共同持仓反馈与 Archegos 的有限结论。每题只有在提交后才显示计算和诊断；请先写出资产、负债、权益、规则与时钟，再选择答案。
        </p>
        <LeverageMarginLab />
      </section>

      <section className="lesson-section" id="practice-checks">
        <p className="section-kicker">38 · 主动练习与理解检查</p>
        <h2>先完成五道可复算练习，再用十个问题检查自己是否仍会把 call、卖盘与破产混成同一事件。</h2>
        <div className="practice-list">
          <details><summary>练习 01 · 融资多头的三个量</summary><p>150 股、初价 80 元、借款 6,000 元、维护率 25%，价格跌到 50 元。分别求催缴价、现金补救和若不能注资时的第一轮固定价卖出补救。</p><p><b>核对：</b>P<sub>call</sub>=6,000/[150×0.75]=53.33 元；当前 A=7,500、E=1,500，现金补救为 1,875−1,500=375 元；固定价卖出市值 S=7,500−1,500/0.25=1,500 元，即卖 30 股并等额还债。</p></details>
          <details><summary>练习 02 · 空头方向</summary><p>卖空 120 股、信用余额 C=9,000 元、空头维护率 30%，价格涨到 60 元。求催缴价和现金补救；解释为什么减仓是买回。</p><p><b>核对：</b>P<sub>call</sub>=9,000/[120×1.3]=57.69 元；X=[1.3×120×60−9,000]=360 元。买回减少 nP 的回购义务；真实买回量还需按 C 的合同过账与冲击重算。</p></details>
          <details><summary>练习 03 · Repo 双重冲击</summary><p>抵押品 100 单位、初价 100 元、现金本金 9,000 元。价格跌到 95 元，同时目标 haircut 从 10% 升到 15%。求保持全部本金和抵押品时的缺口。</p><p><b>核对：</b>新抵押市值 9,500 元，新可支持本金 0.85×9,500=8,075 元，缺口 925 元。不能只算价格变化或 haircut 变化中的一项。</p></details>
          <details><summary>练习 04 · Futures VM 与未来风险</summary><p>10 张期货多头、乘数 50 元/点，结算价下降 80 点；账户原现金 100,000 元，每张 maintenance / initial 为 7,000 / 9,000 元。按题面规则，跌破 maintenance 后补回 initial。求 VM、余额和现金 call。</p><p><b>核对：</b>VM=10×50×(−80)=−40,000 元；余额 60,000 元，低于 70,000 元 maintenance；若保留 10 张，需补到 90,000 元，即 call 30,000 元。平仓只降低未来要求，不退回已结算损失。</p></details>
          <details><summary>练习 05 · 第二轮反馈与证据</summary><p>练习 01 中按固定价卖出 30 股后，市场冲击使价格从 50 跌到 48 元。求剩余账户的新权益率与第二轮固定价卖出股数；再说明为什么这个算例仍不能证明真实市场发生强平。</p><p><b>核对：</b>剩 120 股、债务 4,500 元，A=5,760、E=1,260、权益率 21.875%；恢复 25% 需留下 E/(0.25×48)=105 股，故再卖 15 股。现实识别仍需冲击前账户、适用阈值、call、补救失败、真实处置和外生价格冲击。</p></details>
        </div>
        <div className="check-grid">
          <details><summary>01 · 为什么下跌时资产杠杆上升？</summary><p>短时钟内债务近似固定，权益先吸收全部资产损失；分母 E 缩得比资产 A 更快。</p></details>
          <details><summary>02 · 为什么 call 不等于卖盘？</summary><p>可用现金、合格抵押品、承诺额度、可执行净额或外部注资都可能在期限内治愈缺口。</p></details>
          <details><summary>03 · 何时 D/E=A/E−1？</summary><p>仅在 A、D、E 属于同一实体、净额集合、货币与估值时点且 E&gt;0 时。</p></details>
          <details><summary>04 · 为什么 net exposure 不能代表平仓风险？</summary><p>对冲腿仍占 gross funding，基差会变化，且保证金与结算账户可能分裂。</p></details>
          <details><summary>05 · 空头提供什么方向性反例？</summary><p>股票下跌通常改善空头权益；上涨才可能触发 call 和 buy-to-cover。</p></details>
          <details><summary>06 · Haircut 与 repo margin 为什么会有 2% 和 102%？</summary><p>前者常以抵押品 V 为分母，后者以现金 B 为分母；必须保存原始 V 与 B 后换算。</p></details>
          <details><summary>07 · VM 与 IM 的本质区别？</summary><p>VM 转移当前已发生的按市值损益，IM 覆盖违约到平仓期间的潜在未来敞口。</p></details>
          <details><summary>08 · 为什么卖出还债后仍会再次不足？</summary><p>固定价下权益暂不变，但卖盘冲击会把剩余仓位标到更低价格并再次侵蚀权益。</p></details>
          <details><summary>09 · 平均杠杆为何不足以预测螺旋？</summary><p>还需知道账户距阈值分布、阈值是否同质、现金缓冲、共同持仓和市场吸收容量。</p></details>
          <details><summary>10 · 同期下跌与卖量为何不能识别强平？</summary><p>基本面新闻、赎回、VaR、趋势策略和自愿降险都产生同一相关；必须闭合规则、缺口、期限、补救失败与执行。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-closing">
        <p className="section-kicker">39 · 课程接口与结课诊断</p>
        <h2>本节把“价格下跌制造卖盘”拆成可审计的账户链；下一节转向 ETF 一级市场套利，后续再把风险约束与 leverage cycle 放回参与者和复杂系统。</h2>
        <div className="interface-grid">
          <article><span>← T06</span><h3>Balance Sheet 基础</h3><p>输入 A、D、E 的同一实体恒等式；本节加入按市值重估、期限流动性、抵押品和处置动作。</p></article>
          <article><span>← 1.09 / 1.14</span><h3>Price Impact 与流动性供给</h3><p>输入卖量如何形成价格冲击，以及做市资本为何会撤退；本节把冲击重新送回账户约束。</p></article>
          <article><span>← 1.19</span><h3>Short Selling 与 Securities Lending</h3><p>输入空头担保、借券、召回和回补时钟；本节统一多空账户的权益与强制交易方向。</p></article>
          <article><span>→ 1.21</span><h3>ETF Creation / Redemption 与套利机制</h3><p>输出融资、库存、保证金和冲击约束，用来解释授权参与人为何不总能把 ETF 与篮子价差即时压平。</p></article>
          <article><span>→ 2.16</span><h3>Risk Constraint</h3><p>输出 maintenance、house margin、VaR、资本和流动性边界的分类，使不同参与者的行为函数可以分别建模。</p></article>
          <article><span>→ 7.12</span><h3>Leverage Cycle</h3><p>输出 mark–call–sale–impact 的局部递归、loop gain、稳定器和证伪条件，供复杂系统层研究内生风险。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“杠杆盘爆仓导致大跌”的解释，先固定法律实体和净额集合，写出资产、债务、权益与风险单位；确认最初变化的是价格、波动、haircut、VM、融资期限、赎回还是内部限额；查明债权人、适用规则、恢复目标、call 金额和截止时间；枚举现金、抵押品、净额、额度、注资、对冲与换仓等补救，只有在这些路径失败后才计算被迫交易；区分多头卖出、空头买回、repo unwind 和衍生品压缩；以真实成交量和市场深度估计冲击，再把新价格只重估剩余仓位；检查共同持仓、阈值聚集与流动性供给者是否把个体降险变成系统放大；最后把规则事实、机制模型、案例估计、诉讼指称和司法确认分层。完成这组诊断，“价格下跌制造更多卖盘”才不是循环叙事，而是可以逐节点观察、计算、反驳和比较的因果命题。
        </p>
      </section>
    </>
  );
}

export const lesson120: LessonRecord = {
  slug: '1-20',
  id: '1.20',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Leverage、Margin 与 Forced Liquidation',
  subtitle: '从资产负债表、维持保证金、repo haircut 与衍生品结算资源需求出发，解释价格冲击何时会转化为被迫交易，以及个体降险如何通过市场深度和共同持仓形成反馈',
  readingTime: '约 108–120 分钟（核心阅读 72–78＋互动实验 14–16＋主动练习 12–14＋理解检查 7–8＋课程接口 3–4；参考文献与延伸阅读不计）',
  prerequisite: 'T06 · Balance Sheet 基础；建议回看 1.09、1.14 与 1.19',
  updatedAt: '2026-08-29',
  revision: '1.20-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.20-r1',
      summary: '首轮逐项核对 40 节、公式、算例、规则、案例及 53 条来源后，要求统一外部补资在卖量、权益递推与 loop gain 中的账本，补足定义域，并收紧 VM、LDI、Archegos、FINMA 和官方来源元数据边界。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.20-r1',
      summary: '首轮确认整体因果链成立，但要求把重复正文答案的互动与练习改为迁移题，补齐零背景术语和三案例定义，纠正 Archegos 双下限比率，并闭合 Retry 与 ARIA 语义。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.20-r2',
      summary: '第二轮确认核心账本、互动数值、案例与引用已闭合；仅要求区分线性期货现金 VM 与双边合格抵押品、处理负价格 notional、冻结完整映射导数条件，并限定 Costs 的单位与过账范围。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.20-r2',
      summary: '第二轮确认互动迁移、状态机、练习、案例、引用和可访问性通过；要求以无符号阅读协议替代入口符号墙，为偏导数增加数值桥，并完成专业缩写的首次中文同位解释。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.20-r3',
      summary: '终审确认 40 节账本、分段卖量、递归、开环增益、全部定义域与数值准确；VM、负价格期货、Costs、三案例、53 条来源和 24 张阅读卡的边界均完全闭合。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.20-r3',
      summary: '终审确认零背景认知坡度、40 节因果链、偏导数数值桥、三案例、五练习、十项检查、八题状态机、可访问性、53 条引用和 24 张阅读卡达到出版与教学要求。',
    },
  ],
  previous: { slug: '1-19', label: '1.19 Short Selling 与 Securities Lending' },
  next: { slug: '1-21', label: '1.21 ETF Creation / Redemption 与套利机制' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整系统' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'parties', label: '主体与债权链' },
    { id: 'stock-flow', label: 'Stock 与 Flow' },
    { id: 'leverage-identities', label: '杠杆恒等式' },
    { id: 'gross-net-exposure', label: 'Gross / Net' },
    { id: 'risk-units', label: '风险单位' },
    { id: 'mark-to-market', label: 'Mark-to-Market' },
    { id: 'three-liquidities', label: '三种流动性状态' },
    { id: 'long-account', label: '融资多头账本' },
    { id: 'maintenance-trigger', label: '维持线与触发' },
    { id: 'cash-cure', label: '现金补救' },
    { id: 'sell-to-delever', label: 'Sell-to-Delever' },
    { id: 'impact-recalculation', label: 'Impact 后重算' },
    { id: 'three-lines', label: 'Call / 清算 / 资不抵债' },
    { id: 'short-account', label: '融券空头账本' },
    { id: 'short-cover', label: '空头补救与回补' },
    { id: 'repo-ledger', label: 'Repo 账本' },
    { id: 'haircut-conventions', label: 'Haircut 口径' },
    { id: 'repo-margin', label: 'Repo Margin Call' },
    { id: 'haircut-unwind', label: 'Haircut 与 Unwind' },
    { id: 'derivatives-notional', label: '期货 Notional' },
    { id: 'variation-margin', label: 'Variation Margin' },
    { id: 'im-mm-close', label: 'IM / MM / Close' },
    { id: 'cleared-uncleared', label: 'Cleared / Uncleared' },
    { id: 'netting-collateral', label: '净额与抵押品' },
    { id: 'constraint-map', label: '六类约束' },
    { id: 'forced-sale-function', label: '被迫卖出函数' },
    { id: 'impact-units', label: 'Impact 单位' },
    { id: 'recursive-spiral', label: '多轮递归' },
    { id: 'loop-gain', label: 'Loop Gain' },
    { id: 'cross-asset', label: '跨资产传染' },
    { id: 'stabilizers-counterexamples', label: '稳定器与反例' },
    { id: 'cases', label: '三个真实案例' },
    { id: 'research-design', label: '因果识别' },
    { id: 'measurement-protocol', label: '测量协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice-checks', label: '练习与检查' },
    { id: 'interfaces-closing', label: '接口与诊断' },
  ],
  Content: Lesson120Content,
  references: [
    { id: 1, authors: 'Andrei Shleifer & Robert W. Vishny', year: '1992', title: 'Liquidation Values and Debt Capacity: A Market Equilibrium Approach', publication: 'Journal of Finance, 47(4), 1343–1366', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04661.x', use: '建立行业受困买家、内生清算折价与债务容量的联系；实物资产均衡不能直接给出证券账户强平线。' },
    { id: 2, authors: 'Nobuhiro Kiyotaki & John Moore', year: '1997', title: 'Credit Cycles', publication: 'Journal of Political Economy, 105(2), 211–248', url: 'https://doi.org/10.1086/262072', use: '建立抵押价格、借款能力与需求的动态放大；宏观生产性抵押品模型不等于日内 margin call 算法。' },
    { id: 3, authors: 'Andrei Shleifer & Robert W. Vishny', year: '1997', title: 'The Limits of Arbitrage', publication: 'Journal of Finance, 52(1), 35–55', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x', use: '说明表现敏感资本会在亏损时撤出，使长期正确的套利也可能提前中断；机制不必是 broker 强平。' },
    { id: 4, authors: 'Wei Xiong', year: '2001', title: 'Convergence Trading with Wealth Effects: An Amplification Mechanism in Financial Markets', publication: 'Journal of Financial Economics, 62(2), 247–292', url: 'https://doi.org/10.1016/S0304-405X(01)00078-2', use: '支持套利者财富损失、去杠杆与价差继续扩大的机制；代表性套利者设定限制外推。' },
    { id: 5, authors: 'Albert S. Kyle & Wei Xiong', year: '2001', title: 'Contagion as a Wealth Effect', publication: 'Journal of Finance, 56(4), 1401–1440', url: 'https://doi.org/10.1111/0022-1082.00373', use: '解释共同中介的财富与风险厌恶变化如何跨市场传播冲击；风格化模型不单独识别现实传染。' },
    { id: 6, authors: 'Denis Gromb & Dimitri Vayanos', year: '2002', title: 'Equilibrium and Welfare in Markets with Financially Constrained Arbitrageurs', publication: 'Journal of Financial Economics, 66(2–3), 361–407', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3', use: '建立分割抵押账户、受限套利与流动性外部性；现实 cross-margin 可改变但不会自动消除分割。' },
    { id: 7, authors: 'Stephen Morris & Hyun Song Shin', year: '2004', title: 'Liquidity Black Holes', publication: 'Review of Finance, 8(1), 1–18', url: 'https://doi.org/10.1023/B:EUFI.0000022155.98681.25', use: '展示基于触发的风险规则与策略互补怎样形成单边市场；全球博弈框架不是账户级系数估计。' },
    { id: 8, authors: 'Rodrigo Cifuentes, Gianluigi Ferrucci & Hyun Song Shin', year: '2005', title: 'Liquidity Risk and Contagion', publication: 'Journal of the European Economic Association, 3(2–3), 556–566', url: 'https://doi.org/10.1162/jeea.2005.3.2-3.556', use: '连接 mark-to-market、资本约束、共同持仓与迭代火售；银行模型不可直接替代客户 margin。' },
    { id: 9, authors: 'Ana Fostel & John Geanakoplos', year: '2008', title: 'Leverage Cycles and the Anxious Economy', publication: 'American Economic Review, 98(4), 1211–1244', url: 'https://doi.org/10.1257/aer.98.4.1211', use: '说明内生抵押约束、flight to collateral 与传染；异质信念均衡不提供现实 repo 的规则值。' },
    { id: 10, authors: 'Guido Lorenzoni', year: '2008', title: 'Inefficient Credit Booms', publication: 'Review of Economic Studies, 75(3), 809–833', url: 'https://doi.org/10.1111/j.1467-937X.2008.00494.x', use: '建立火售价格的 pecuniary externality 与过度借款；宏观福利结论依模型环境。' },
    { id: 11, authors: 'Guillaume Plantin, Haresh Sapra & Hyun Song Shin', year: '2008', title: 'Marking-to-Market: Panacea or Pandora’s Box?', publication: 'Journal of Accounting Research, 46(2), 435–460', url: 'https://doi.org/10.1111/j.1475-679X.2008.00281.x', use: '解释非流动长期资产逐市计价可能诱发反馈；不支持公允价值会普遍造成危机。' },
    { id: 12, authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen', year: '2009', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies, 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '建立 loss spiral 与 margin spiral 以及融资—市场流动性反馈；失稳需要特定约束与状态。' },
    { id: 13, authors: 'John Geanakoplos', year: '2010', title: 'The Leverage Cycle', publication: 'NBER Macroeconomics Annual, 24, 1–66', url: 'https://doi.org/10.1086/648285', use: '强调 haircut、边际买家与资产价格的内生共同变化；理论 leverage cycle 不是实际规则表。' },
    { id: 14, authors: 'Viral V. Acharya & S. Viswanathan', year: '2011', title: 'Leverage, Moral Hazard, and Liquidity', publication: 'Journal of Finance, 66(1), 99–138', url: 'https://doi.org/10.1111/j.1540-6261.2010.01627.x', use: '说明短债无法续作会触发去杠杆与低价转售；金融机构结构模型不提供任一合同的自动处置量。' },
    { id: 15, authors: 'Nicolae Gârleanu & Lasse Heje Pedersen', year: '2011', title: 'Margin-based Asset Pricing and Deviations from the Law of One Price', publication: 'Review of Financial Studies, 24(6), 1980–2022', url: 'https://doi.org/10.1093/rfs/hhr027', use: '说明资本稀缺时高 margin 资产与价格偏离的均衡关系；不把 gross exposure 等同预期损失。' },
    { id: 16, authors: 'Zhiguo He & Arvind Krishnamurthy', year: '2012', title: 'A Model of Capital and Crises', publication: 'Review of Economic Studies, 79(2), 735–777', url: 'https://doi.org/10.1093/restud/rdr036', use: '说明中介资本稀缺使风险承受能力和价格非线性变化；属于校准均衡模型。' },
    { id: 17, authors: 'Zhiguo He & Arvind Krishnamurthy', year: '2013', title: 'Intermediary Asset Pricing', publication: 'American Economic Review, 103(2), 732–770', url: 'https://doi.org/10.1257/aer.103.2.732', use: '连接中介权益资本、风险溢价与危机状态；不适用于所有资产和投资者结构。' },
    { id: 18, authors: 'Markus K. Brunnermeier & Yuliy Sannikov', year: '2014', title: 'A Macroeconomic Model with a Financial Sector', publication: 'American Economic Review, 104(2), 379–421', url: 'https://doi.org/10.1257/aer.104.2.379', use: '支持小冲击在脆弱区经内生风险持续放大；结论依连续时间结构与校准。' },
    { id: 19, authors: 'Bruno Biais, Florian Heider & Marie Hoerova', year: '2021', title: 'Variation Margins, Fire Sales, and Information-constrained Optimality', publication: 'Review of Economic Studies, 88(6), 2654–2686', url: 'https://doi.org/10.1093/restud/rdaa083', use: '说明 VM 可诱发火售，却可能因激励约束仍属有效安排；反驳“有火售就应取消 margin”。' },
    { id: 20, authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen', year: '2005', title: 'Predatory Trading', publication: 'Journal of Finance, 60(4), 1825–1863', url: 'https://doi.org/10.1111/j.1540-6261.2005.00781.x', use: '说明可预测强制交易会吸引抢先交易并恶化成交价格；模型不证明异常价格必然是操纵。' },
    { id: 21, authors: 'Tobias Adrian & Hyun Song Shin', year: '2010', title: 'Liquidity and Leverage', publication: 'Journal of Financial Intermediation, 19(3), 418–437', url: 'https://doi.org/10.1016/j.jfi.2008.12.002', use: '记录 broker-dealer 资产负债表的顺周期调整；聚合会计杠杆不能识别单账户 call。' },
    { id: 22, authors: 'Joshua Coval & Erik Stafford', year: '2007', title: 'Asset Fire Sales (and Purchases) in Equity Markets', publication: 'Journal of Financial Economics, 86(2), 479–512', url: 'https://doi.org/10.1016/j.jfineco.2006.09.007', use: '识别共同基金流量造成的价格压力与反转；核心约束是赎回而非 margin，流量仍可能含信息。' },
    { id: 23, authors: 'Allaudeen Hameed, Wenjin Kang & S. Viswanathan', year: '2010', title: 'Stock Market Declines and Liquidity', publication: 'Journal of Finance, 65(1), 257–293', url: 'https://doi.org/10.1111/j.1540-6261.2009.01529.x', use: '显示下跌后的市场流动性恶化在资本约束紧时更强；观察性证据不能锁定 margin channel。' },
    { id: 24, authors: 'Andrew Ellul, Chotibhak Jotikasthira & Christian T. Lundblad', year: '2011', title: 'Regulatory Pressure and Fire Sales in the Corporate Bond Market', publication: 'Journal of Financial Economics, 101(3), 596–620', url: 'https://doi.org/10.1016/j.jfineco.2011.03.020', use: '展示保险监管压力与降级债券火售；银行 / 保险资本约束不应改称客户保证金。' },
    { id: 25, authors: 'Itzhak Ben-David, Francesco Franzoni & Rabih Moussawi', year: '2012', title: 'Hedge Fund Stock Trading in the Financial Crisis of 2007–2009', publication: 'Review of Financial Studies, 25(1), 1–54', url: 'https://doi.org/10.1093/rfs/hhr114', use: '记录赎回与 margin 压力下的对冲基金减持；13F 看不到空头、衍生品与日内清算。' },
    { id: 26, authors: 'Chotibhak Jotikasthira, Christian Lundblad & Tarun Ramadorai', year: '2012', title: 'Asset Fire Sales and Purchases and the International Transmission of Funding Shocks', publication: 'Journal of Finance, 67(6), 2015–2050', url: 'https://doi.org/10.1111/j.1540-6261.2012.01780.x', use: '展示基金资金冲击经海外持仓传播；基金流量不完全外生，不能排除共同新闻。' },
    { id: 27, authors: 'Gary Gorton & Andrew Metrick', year: '2012', title: 'Securitized Banking and the Run on Repo', publication: 'Journal of Financial Economics, 104(3), 425–451', url: 'https://doi.org/10.1016/j.jfineco.2011.03.016', use: '记录特定双边证券化 repo 的 haircut 上升与融资收缩；不能外推到全部 Treasury 或 tri-party repo。' },
    { id: 28, authors: 'Adam Copeland, Antoine Martin & Michael Walker', year: '2014', title: 'Repo Runs: Evidence from the Tri-Party Repo Market', publication: 'Journal of Finance, 69(6), 2343–2380', url: 'https://doi.org/10.1111/jofi.12205', use: '显示 Lehman 前多数 tri-party repo 未普遍提高 haircut，是对单一 repo-run 叙事的细分市场反例。' },
    { id: 29, authors: 'Arvind Krishnamurthy, Stefan Nagel & Dmitry Orlov', year: '2014', title: 'Sizing Up Repo', publication: 'Journal of Finance, 69(6), 2381–2417', url: 'https://doi.org/10.1111/jofi.12168', use: '测量 repo 总量、抵押品构成与金融危机收缩，提示净额、覆盖与市场分段的重要性。' },
    { id: 30, authors: 'Bige Kahraman & Heather E. Tookes', year: '2017', title: 'Trader Leverage and Liquidity', publication: 'Journal of Finance, 72(4), 1567–1610', url: 'https://doi.org/10.1111/jofi.12507', use: '利用印度 margin eligibility 的 RDD 识别融资对流动性的状态依赖效应；是阈值附近局部效应。' },
    { id: 31, authors: 'Jiangze Bian, Zhi Da, Zhiguo He, Dong Lou, Kelly Shue & Hao Zhou', year: '2026', title: 'The Drivers and Implications of Retail Margin Trading', publication: 'Journal of Finance, 81(4), 2217–2270', url: 'https://doi.org/10.1111/jofi.70049', use: '以中国账户级数据连接距 call 距离、减仓与跨股票溢出；预防性卖出不可全部称为 broker 机械强平。' },
    { id: 32, authors: 'Paul Glasserman & Qi Wu', year: '2018', title: 'Persistence and Procyclicality in Margin Requirements', publication: 'Management Science, 64(12), 5705–5724', url: 'https://doi.org/10.1287/mnsc.2017.2915', use: '解释持续波动估计导致风险敏感 margin 顺周期上升及缓冲设计；属于模型与校准证据。' },
    { id: 33, authors: 'Board of Governors of the Federal Reserve System', year: 'current', accessedAt: '2026-08-29', title: '12 CFR § 220.12 — Supplement: Margin Requirements', publication: 'Electronic Code of Federal Regulations, Regulation T', url: 'https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-220/section-220.12', use: '支持美国 margin equity security 一般 50% 初始要求及不同证券类别；不是全球或持续维护线。' },
    { id: 34, authors: 'Financial Industry Regulatory Authority', year: 'current', accessedAt: '2026-08-29', title: 'FINRA Rule 4210 — Margin Requirements', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210?page=1', use: '支持普通多头 25% maintenance floor 及会员信用、集中度与更高要求；实际账户还受 house rules。' },
    { id: 35, authors: 'Financial Industry Regulatory Authority', year: 'current', accessedAt: '2026-08-29', title: 'FINRA Rule 2264 — Margin Disclosure Statement', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/2264', use: '支持经纪商可提高 house margin、按协议不预先联系而处置及客户无权指定出售资产等风险披露。' },
    { id: 36, authors: 'U.S. Commodity Futures Trading Commission', year: 'current', accessedAt: '2026-08-29', title: 'Futures Glossary', publication: 'Official investor education glossary', url: 'https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm', use: '支持期货 initial、maintenance 与 variation margin 的官方概念边界；具体产品金额随规则变化。' },
    { id: 37, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Performance Bonds / Margins FAQ', publication: 'Official clearing risk-management guidance', url: 'https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html', use: '支持期货 margin 是 performance bond、维护线以下通常补回初始水平及 FCM 可加收 house margin。' },
    { id: 38, authors: 'CPSS-IOSCO', year: '2012/current', accessedAt: '2026-08-29', title: 'Principles for Financial Market Infrastructures', publication: 'Bank for International Settlements', url: 'https://www.bis.org/cpmi/publ/d101.htm', use: 'Principle 6 支持 CCP 风险敏感保证金、IM 的潜在未来敞口与 VM 的当前敞口框架。' },
    { id: 39, authors: 'BCBS & IOSCO', year: '2020', accessedAt: '2026-08-29', title: 'Margin Requirements for Non-centrally Cleared Derivatives', publication: 'International standard, BCBS d499', url: 'https://www.bis.org/bcbs/publ/d499.htm', use: '支持非中央清算衍生品 IM、VM、适用范围、阈值、抵押品和隔离的国际基准；各法域落实不同。' },
    { id: 40, authors: 'Financial Stability Board', year: '2024', accessedAt: '2026-08-29', title: 'Liquidity Preparedness for Margin and Collateral Calls: Final Report', publication: 'Official international policy report, 10 December 2024', url: 'https://www.fsb.org/2024/12/liquidity-preparedness-for-margin-and-collateral-calls-final-report/', use: '支持治理、压力测试、操作与多元流动性准备；是国际建议而非直接改写客户合同的全球法规。' },
    { id: 41, authors: 'BCBS, CPMI & IOSCO', year: '2025', accessedAt: '2026-08-29', title: 'Transparency and Responsiveness of Initial Margin in Centrally Cleared Markets — Review and Policy Proposals', publication: 'Final report, BCBS d590, 15 January 2025', url: 'https://www.bis.org/bcbs/publ/d590.htm', use: '支持提升 CCP IM 模拟器、模型响应、override 治理及 clearing member 客户透明度的政策方向。' },
    { id: 42, authors: 'Financial Stability Board', year: '2025', accessedAt: '2026-08-29', title: 'Leverage in Nonbank Financial Intermediation: Final Report', publication: 'Official final report, 9 July 2025', url: 'https://www.fsb.org/2025/07/leverage-in-nonbank-financial-intermediation-final-report/', use: '确认国际政策采取数据、市场与实体工具组合，而非设定全球统一非银杠杆上限。' },
    { id: 43, authors: 'Basel Committee on Banking Supervision', year: '2024', accessedAt: '2026-08-29', title: 'Final Guidelines for Counterparty Credit Risk Management', publication: 'BCBS d588, 11 December 2024', url: 'https://www.bis.org/bcbs/publ/d588.htm', use: '支持银行对手方尽调、风险敏感 margin、集中度、限额、压力测试和治理要求，回应 Archegos 类盲区。' },
    { id: 44, authors: 'Bank of England', year: '2022', accessedAt: '2026-08-29', title: 'Financial Stability Report — December 2022', publication: 'Official financial stability report', url: 'https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022', use: '支持 2022 LDI 事件的收益率变动、gilt 销售与 calls，并区分流动性放大与初始冲击。' },
    { id: 45, authors: 'Gabor Pinter', year: '2023', accessedAt: '2026-08-29', title: 'An Anatomy of the 2022 Gilt Market Crisis', publication: 'Bank of England Staff Working Paper No. 1,019', url: 'https://www.bankofengland.co.uk/working-paper/2023/an-anatomy-of-the-2022-gilt-market-crisis', use: '提供 LDI 资产负债表、卖出时序与 gilt 市场功能的细化分析；工作论文不把 LDI 定为唯一初始原因。' },
    { id: 46, authors: 'Financial Stability Board', year: '2020', accessedAt: '2026-08-29', title: 'Holistic Review of the March Market Turmoil', publication: 'Official final report, 17 November 2020', url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/', use: '支持 2020 dash for cash 的多主体卖压与 basis unwind 作为贡献渠道，而非唯一原因。' },
    { id: 47, authors: 'Ayelen Banegas, Phillip J. Monin & Lubomir Petrasek', year: '2021', accessedAt: '2026-08-29', title: 'Sizing Hedge Funds’ Treasury Market Activities and Holdings', publication: 'Federal Reserve FEDS Notes, 6 October 2021', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/sizing-hedge-funds-treasury-market-activities-and-holdings-20211006.html', use: '支持 2020 年 3 月 hedge fund Treasury holdings 减少 $141bn、basis-likely funds $127bn 的特定口径。' },
    { id: 48, authors: 'Eleni Gousgounis, Scott Mixon, Tugkan Tuzun & Clara Vega', year: '2025', accessedAt: '2026-08-29', title: 'Market Liquidity in Treasury Futures Market During March 2020', publication: 'Federal Reserve Finance and Economics Discussion Series 2025-038', url: 'https://www.federalreserve.gov/econres/feds/market-liquidity-in-treasury-futures-market-during-march-2020.htm', use: '提供期货细分市场证据，显示 basis traders 并非该分段失灵的重要驱动；不能推翻现金 Treasury 与整体融资渠道。' },
    { id: 49, authors: 'U.S. Securities and Exchange Commission', year: '2022', accessedAt: '2026-08-29', title: 'Complaint: SEC v. Archegos Capital Management, LP et al.', publication: 'Civil Action No. 1:22-cv-03402, filed 27 April 2022', url: 'https://www.sec.gov/files/litigation/complaints/2022/comp-pr2022-70.pdf', use: '提供 Archegos invested capital、gross exposure、TRS、margin calls 与多 prime 结构的诉状指称；诉状不是司法定案。' },
    { id: 50, authors: 'U.S. Department of Justice, Southern District of New York', year: '2024', accessedAt: '2026-08-29', title: 'Founder and Head of Archegos Capital Management Bill Hwang Sentenced to 18 Years in Prison', publication: 'Official sentencing release, 19 December 2024', url: 'https://www.justice.gov/usao-sdny/pr/founder-and-head-archegos-capital-management-bill-hwang-sentenced-18-years-prison', use: '支持陪审团定罪、刑事欺诈和操纵事实及判刑；与 SEC 诉状中的风险数字分层使用。' },
    { id: 51, authors: 'Board of Governors of the Federal Reserve System', year: '2021/revised 2026', accessedAt: '2026-08-29', title: 'SR 21-19: Supervisory Guidance on Counterparty Credit Risk Management', publication: 'Supervision and Regulation Letter, revised 9 January 2026', url: 'https://www.federalreserve.gov/supervisionreg/srletters/SR2119.htm', use: '支持 Archegos 造成银行体系超过 $10bn 损失及对手方风险管理教训；不是完整账户重建。' },
    { id: 52, authors: 'Swiss Financial Market Supervisory Authority FINMA', year: '2023', accessedAt: '2026-08-29', title: 'Archegos: FINMA Concludes Proceedings Against Credit Suisse', publication: 'Official release, 24 July 2023', url: 'https://www.finma.ch/en/news/2023/07/20230724-mm-archegos/', use: '支持 Credit Suisse 对 Archegos 集中暴露、限额与附加不足及超过 $5bn 损失的监管结论。' },
    { id: 53, authors: 'International Capital Market Association', year: 'current', accessedAt: '2026-08-29', title: 'What Is a Haircut?', publication: 'ICMA European Repo and Collateral Council FAQ', url: 'https://www.icmagroup.org/market-practice-and-regulatory-policy/repo-and-collateral-markets/icma-ercc-publications/frequently-asked-questions-on-repo/21-what-is-a-haircut/', use: '支持 repo haircut 的抵押品分母定义及与 repo margin 报价的区分；具体合同仍须保留原始 V 与 B。' },
  ],
  readingList: [
    { title: 'Brunnermeier & Pedersen (2009)', scope: '融资流动性—市场流动性螺旋', reason: '整节最核心的反馈模型；重点阅读 loss spiral、margin spiral 与稳定条件。', url: 'https://doi.org/10.1093/rfs/hhn098' },
    { title: 'Geanakoplos (2010), The Leverage Cycle', scope: '内生 haircut、边际买家与周期', reason: '理解为什么可接受杠杆本身会随市场状态变化。', url: 'https://doi.org/10.1086/648285' },
    { title: 'Kiyotaki & Moore (1997)', scope: '抵押价格与信用周期', reason: '建立价格—借款能力—需求的跨期反馈原型。', url: 'https://doi.org/10.1086/262072' },
    { title: 'Shleifer & Vishny (1992)', scope: '内生清算价值与债务容量', reason: '理解为什么最合适的买家在危机中也可能缺资本。', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04661.x' },
    { title: 'Gromb & Vayanos (2002)', scope: '受限套利、分割账户与外部性', reason: '把“有错价”与“资本能否跨市场使用”分开。', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3' },
    { title: 'Brunnermeier & Sannikov (2014)', scope: '中介资本与内生风险', reason: '深入理解危机区非线性和波动悖论。', url: 'https://doi.org/10.1257/aer.104.2.379' },
    { title: 'Biais, Heider & Hoerova (2021)', scope: 'VM、火售与激励约束', reason: '用关键反例理解 margin 的稳定收益与流动性成本为何并存。', url: 'https://doi.org/10.1093/restud/rdaa083' },
    { title: 'Glasserman & Wu (2018)', scope: '保证金持续性与顺周期性', reason: '理解风险模型、波动记忆与 buffer 设计。', url: 'https://doi.org/10.1287/mnsc.2017.2915' },
    { title: 'Kahraman & Tookes (2017)', scope: '杠杆资格与市场流动性的 RDD', reason: '学习如何把制度阈值转化为可信的局部因果设计。', url: 'https://doi.org/10.1111/jofi.12507' },
    { title: 'Bian et al. (2026)', scope: '中国零售保证金账户与共同持仓', reason: '观察距 call 距离、预防性减仓和价格溢出的账户级证据。', url: 'https://doi.org/10.1111/jofi.70049' },
    { title: 'Coval & Stafford (2007)', scope: '基金流量火售与反转', reason: '区分 redemption fire sale 与 broker margin liquidation。', url: 'https://doi.org/10.1016/j.jfineco.2006.09.007' },
    { title: 'Gorton & Metrick (2012)', scope: '双边证券化 repo 与 haircut', reason: '理解特定 repo 市场的融资挤兑，同时保留细分市场边界。', url: 'https://doi.org/10.1016/j.jfineco.2011.03.016' },
    { title: 'Copeland, Martin & Walker (2014)', scope: 'Tri-party repo 的反例证据', reason: '防止把一种 repo 的 haircut 机制外推到全部 repo。', url: 'https://doi.org/10.1111/jofi.12205' },
    { title: 'FINRA Rule 4210', scope: '美国证券账户维护要求', reason: '从规则原文区分监管地板、证券类别和会员 house requirements。', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210?page=1' },
    { title: 'CME Performance Bond FAQ', scope: '期货 initial、maintenance 与 FCM add-on', reason: '把期货履约担保与股票购买首付款严格分开。', url: 'https://www.cmegroup.com/solutions/risk-management/performance-bonds-margins/faq-performance-bonds-margins.html' },
    { title: 'CPSS-IOSCO PFMI', scope: 'CCP margin 与违约管理原则', reason: '建立 IM、VM、覆盖和风险模型的制度底座。', url: 'https://www.bis.org/cpmi/publ/d101.htm' },
    { title: 'BCBS–IOSCO Uncleared Margin Standard', scope: '双边衍生品保证金', reason: '理解适用主体、阈值、隔离和合格抵押品，而非只记一个数字。', url: 'https://www.bis.org/bcbs/publ/d499.htm' },
    { title: 'FSB Margin Liquidity Preparedness (2024)', scope: '现金、抵押品、操作与压力测试', reason: '把 call 是否变成卖盘还原为流动性治理问题。', url: 'https://www.fsb.org/2024/12/liquidity-preparedness-for-margin-and-collateral-calls-final-report/' },
    { title: 'BCBS Counterparty Credit Risk Guidelines (2024)', scope: '尽调、集中度、限额与治理', reason: '理解为什么当前抵押品不能替代潜在未来敞口和跨对手方视角。', url: 'https://www.bis.org/bcbs/publ/d588.htm' },
    { title: 'Bank of England FSR, December 2022', scope: 'LDI、gilt 销售与临时操作', reason: '按官方时序区分初始宏观冲击、流动性放大和政策干预。', url: 'https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022' },
    { title: 'FSB March Market Turmoil Review (2020)', scope: 'Dash for cash 的多主体结构', reason: '避免把 Treasury 失灵归因于单一 basis trade。', url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/' },
    { title: 'Fed: Sizing Hedge Funds’ Treasury Activities', scope: '现金与衍生品头寸口径', reason: '训练不把 $141bn、$127bn 和衍生品腿变化重复相加。', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/sizing-hedge-funds-treasury-market-activities-and-holdings-20211006.html' },
    { title: 'SEC Archegos Civil Complaint', scope: '合成 gross exposure 与多 prime 结构', reason: '学习将诉状指称、风险机制和司法确认分层。', url: 'https://www.sec.gov/files/litigation/complaints/2022/comp-pr2022-70.pdf' },
    { title: 'FINMA Archegos Enforcement Findings', scope: 'Credit Suisse 对手方风险治理', reason: '观察集中度、限额突破、附加不足和处置损失怎样连接。', url: 'https://www.finma.ch/en/news/2023/07/20230724-mm-archegos/' },
  ],
};
