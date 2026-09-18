import MarketMakerLab from '../components/MarketMakerLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson112Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>做市商之所以存在，不是因为市场缺少最终买方或卖方，而是因为他们的方向、数量与到达时间通常不匹配；有人必须用自己的资产负债表，把“以后可能出现的对手方”提前变成“现在可以成交的报价”。</h2>
        <p>
          假设长期看有同样多的人想买和卖，也不能保证此刻恰好有等量、同价格、同速度的反向需求。急于买入者面对的经济问题不是“世界上有没有卖家”，而是“愿不愿意等到卖家出现”。做市商持续摆出 bid（愿意买入的价格）与 ask（愿意卖出的价格），以自身现金接住先到的卖单、以自身库存满足先到的买单，先吸收时间错配，再等待自然反向订单或主动对冲。因此它出售的核心服务是 <em>immediacy</em>（即时性）与 <em>continuity</em>（连续可交易性），而库存、资本、融资和技术系统是生产这项服务所需的投入。Demsetz、Garman、Stoll 与 Grossman–Miller 从交易成本、订单到达、dealer 服务供给和即时性资本供给等不同角度建立了这条主线。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={7} />
        </p>
        <p>
          这立即修正一句常见但危险的话：“做市商赚 bid–ask spread（ask 与 bid 之差）。”成交在有利于 mid（买卖报价中点）的一侧，只是第一条毛收入；成交后留下的库存会随价格变化，知情交易者可能只在做市商报价过时的一侧成交，对冲会产生 basis（库存与对冲工具之间的相对价格偏离）与执行成本，资金、借券、保证金、数据、机房、合规和尾部资本也都有价格。完整问题不是 spread 多宽，而是这些收入扣除同一风险路径上的全部成本后，风险调整剩余是否足以让资本继续留下。后文将用一个精确的自融资现金—库存恒等式，把每一美元放回唯一账本位置。
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>从订单到达的时间、方向与规模错配推出即时性需求，而不是把做市商解释成交易所的装饰。</li>
            <li>区分 functional market maker、registered / designated market maker、dealer/principal 与 broker/agent。</li>
            <li>用现金 C、库存 q 与 mid m 建立自融资账本，严格区分 entry spread capture 和 inventory holding P&amp;L。</li>
            <li>把 fees/rebates、hedging、funding、borrow、margin、operations、capital 与 outside option（资本用于其他业务的机会价值）放进完整经济利润。</li>
            <li>判断制度义务为何只能设置服务下限，不能保证成交、利润或压力状态下无限流动性。</li>
            <li>把本节的“为何存在”与 1.13 的最优 quote adjustment、1.14 的竞争/HFT 和 2.08 的 agent strategy 分开。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="object-map">
        <p className="section-kicker">01 · 先把对象分成六层</p>
        <h2>“做市商”同时指一种需求、一项服务、一组行为、一个资产负债表主体、一种制度身份和一门生意；混在一起就会把报价义务误当盈利保证。</h2>
        <div className="table-scroll" role="region" aria-label="做市问题的六层对象，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从经济需求到制度标签的层级</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">核心对象</th><th scope="col">可观察问题</th><th scope="col">不能自动推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">需求</th><td>Immediacy demand</td><td>谁不愿等待自然对手方？</td><td>必须由某一家指定机构满足</td></tr>
              <tr><th scope="row">服务</th><td>连续可交易报价</td><td>给定规模下此刻能否买卖？</td><td>报价一定成交或盈利</td></tr>
              <tr><th scope="row">行为</th><td>Passive two-sided quoting</td><td>谁反复提供可执行 bid / ask？</td><td>拥有正式 market-maker 身份</td></tr>
              <tr><th scope="row">主体</th><td>Principal / dealer balance sheet</td><td>谁持有成交后库存和残余风险？</td><td>只为客户代理执行</td></tr>
              <tr><th scope="row">制度</th><td>Registered / designated role</td><td>适用哪些证券、时段、义务和激励？</td><td>跨场所通用的统一规则</td></tr>
              <tr><th scope="row">经济</th><td>Risk-adjusted participation</td><td>完整收益是否覆盖全部成本与机会成本？</td><td>Gross spread 等于经济利润</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          本节沿这六层逐级下行：先证明服务为何有需求，再说明谁用资产负债表生产它，最后才讨论制度安排和商业可持续性。这能避免用 SEC 或某一交易所的定义反向解释所有时代、所有资产的经济功能。SEC 的 broker-dealer 注册指南把 broker 的“为他人账户从事证券交易业务”与 dealer 的“作为经常性业务为自有账户买卖”区分开；其 security-futures 指引又展示产品与活动会怎样改变适用边界。具体法律判断仍须结合当时事实，不能由一张行为截图完成分类。<Cite n={25} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="asynchronous-arrivals">
        <p className="section-kicker">02 · 自然订单不会同步到达</p>
        <h2>最终买卖意愿可以长期平衡，短期订单流却仍然单边；正是这个时间错配创造了做市服务的需求。</h2>
        <p>
          设买卖订单各自随机到达。即使二者长期平均强度相同，也几乎不会在每个瞬间一一配对：可能先连续到达五个卖单，买方半小时后才出现；也可能买方要 10,000 股，而此刻卖方只愿出 800 股。Garman 用随机订单到达建立 dealer inventory 问题，说明在没有同步对手方时，交易连续性必须由库存缓冲。Poisson 到达是使模型可解的假设，不是“真实订单必然服从 Poisson”的经验定律。<Cite n={2} />
        </p>
        <div className="mechanism-chain" aria-label="自然订单错配如何产生做市需求">
          {[
            ['需求异步到达', '方向、时间、规模与耐心不同'],
            ['自然交叉不足', '此刻没有足量反向意愿处在同一可接受价格'],
            ['等待成本出现', '价格风险、机会成本与执行不确定性随等待上升'],
            ['中介先承接', '现金或库存替代尚未到达的自然对手方'],
            ['库存留在中介', '未来订单、价格和融资状态决定最终结果'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这里的关键不是撮合技术本身。即使中央限价订单簿能自动匹配，若此刻只有急迫买单、没有愿意被动卖出的自然投资者，算法也不能凭空创造对手方；必须有人愿意提交卖价并在成交后持有减少的库存或空头风险。电子订单簿改变了服务的组织方式，却没有消除资产负债表缓冲的经济功能。
        </p>
      </section>

      <section className="lesson-section" id="search-to-quotes">
        <p className="section-kicker">03 · 从搜索对手方到可执行报价</p>
        <h2>做市把一场不确定的双边搜索，压缩成面对屏幕上条件报价的即时选择。</h2>
        <p>
          在纯搜索市场里，买方要寻找卖方、协商价格并承受对方离开；搜索时间本身是一种交易成本。公开或可访问的 bid 与 ask 则把问题改写为：买方现在是否接受 ask，卖方现在是否接受 bid。Demsetz 把 quoted spread 解释为组织即时交易所需的成本补偿之一；他的历史讨论包含当时制度背景，不能把某个“人工价格地板”直接搬成现代电子市场利润公式。<Cite n={1} />
        </p>
        <p>
          Quote 的经济意义是条件承诺：在报价仍有效、订单满足场所和规模条件时，做市者愿意按该价格成为 principal。它降低搜索与谈判成本，也让其他交易者能预先比较执行价格。但承诺有边界：数量有限、可修改或撤销，且受 tick、优先级、风控、消息延迟和本地规则约束。于是报价质量至少含 width、size、depth、presence 与 resilience，而不是只看屏幕最窄 spread。
        </p>
      </section>

      <section className="lesson-section" id="immediacy-service">
        <p className="section-kicker">04 · 即时性是一项可定价服务</p>
        <h2>主动交易者支付的并非“进入市场门票”，而是把执行时间从不确定的未来搬到现在。</h2>
        <p>
          一个不急的卖方可以在 ask 挂限价单，等待买方到达，但要承担排队、未成交、价格下跌和信息过时风险。一个急于降低头寸的卖方选择击中 bid，接受相对 mid 较差的价格，以换取数量和时间的确定性。Stoll 把 dealer service 理解为可供给的交易服务；Grossman–Miller 进一步把立即承接临时订单失衡所需的资本视为流动性的核心。<Cite n={3} /><Cite n={7} />
        </p>
        <div className="equation-card">
          <span>交易者的最小选择</span>
          <div>立即成交成本　vs.　等待中的价格风险＋未成交风险＋机会成本</div>
          <p>若立即执行的确定性价值高于等待成本，交易者愿意跨 spread；做市者获得一项潜在毛收入，同时接走等待风险。两方不是必然一赢一输，而是在交换不同种类的风险。</p>
        </div>
        <p>
          因而 spread 的福利含义不是越接近零越好、也不是越宽越合理。过宽意味着即时性昂贵；过窄若不能覆盖风险和固定投入，资本会退出，规模与连续性下降。可持续竞争要在使用者成本与供给者参与约束之间形成内生平衡。
        </p>
      </section>

      <section className="lesson-section" id="continuity-service">
        <p className="section-kicker">05 · 连续性来自跨时点搬运订单</p>
        <h2>做市商不是消灭买卖失衡，而是先把失衡装进库存，使交易可以在自然反向需求出现之前继续。</h2>
        <p>
          第一个卖方击中 bid 后，做市商现金减少、库存增加；后来买方击中 ask 时，库存才释放。两位客户没有同时见面，却通过做市商的资产负债表跨时点连接。Grossman–Miller 所谓“供给即时性”的资本，正是愿意在订单失衡期间持有暂时头寸、并在未来订单恢复时卸载的能力。该机制可以改善交易连续性，却不保证所有失衡都是暂时的，也不证明均衡库存能在任意价格上被吸收。<Cite n={7} />
        </p>
        <p>
          Continuity 与 depth 也不同。屏幕持续有一股报价是 presence，能以有限 price impact 承接大额交易才接近 depth；遭遇冲击后多快重新补单则是 resilience。一家机构可以在正常时段高度连续，却在波动、资本收紧或订单流更有毒时同时扩大 spread、减少 size。这不是概念矛盾，而是服务供给曲线随状态移动。
        </p>
      </section>

      <section className="lesson-section" id="two-sided-commitment">
        <p className="section-kicker">06 · 双边报价是两份条件承诺</p>
        <h2>同时显示 bid 与 ask，不等于两侧会成对成交；市场只会选择当下对自己有利或有需要的一侧。</h2>
        <p>
          令 bid 为 b、ask 为 a、mid 为 m=(a+b)/2、full quoted spread 为 S=a−b、half-spread 为 h=S/2。做市商在 b 愿意买、在 a 愿意卖，但下一笔订单可能只击中 bid，随后价格继续下跌；也可能连续十笔都买走 ask，使做市商库存越来越短。做市商无法要求“既然我买了你的卖单，你现在也必须按 ask 买回去”。
        </p>
        <div className="equation-card">
          <span>对称报价的记号，不是利润承诺</span>
          <div>b=m−h　；　a=m+h　；　S=a−b=2h</div>
          <p>这些等式只描述报价几何。只有同一做市商、同一数量、两侧随后都成交、期间 mid 不变且没有成本时，Q·S 才等于一轮毛 capture。</p>
        </div>
        <p>
          真实报价还常不对称：库存、信息风险、竞争和 tick 会让 bid 与 ask 相对参考价值不同。这里先解释为什么双边承诺有经济价值以及怎样记账；下一节 1.13 才研究库存 q 如何移动 reservation price、skew 与 size，避免把本节偷渡成最优报价策略课。
        </p>
      </section>

      <section className="lesson-section" id="functional-provider">
        <p className="section-kicker">07 · Functional Market Maker</p>
        <h2>只要一个主体反复以被动报价、用自身资本承接订单并管理库存，它就在执行做市功能，即使没有正式指定称号。</h2>
        <p>
          功能定义关注行为和风险归属：是否经常向到来的主动单供给可执行流动性；成交是否进入自有账户；是否留下 inventory、hedge 与 funding exposure。现代电子市场中，自营公司、银行 dealer、专业流动性提供者乃至某些策略性限价单交易者，都可能在部分时间执行这项功能。Menkveld 对一个新型高频做市者的个案研究显示，现代做市可由跨市场高速系统组织，但那是一个主体与制度样本，不能把其数字外推为所有 HFT。<Cite n={15} />
        </p>
        <p>
          这个定义也不意味着任何一次被动成交都足以把散户称作 market maker。偶尔挂单可能只是执行自身投资观点；稳定做市功能要求持续供给、双边或可重复的风险承接、库存管理和规模化基础设施。研究时应报告行为阈值，而不是根据订单类型直接贴永久身份标签。
        </p>
      </section>

      <section className="lesson-section" id="designated-maker">
        <p className="section-kicker">08 · Registered / Designated Market Maker</p>
        <h2>正式做市身份是一组本地化权利义务，不是“功能做市”的同义词，更不是跨市场统一职业证书。</h2>
        <p>
          某些场所为特定证券指定 DMM 或 market maker，要求在规定时段满足报价存在率、最小规模、最大宽度或连续性标准，并可能提供费用优惠、优先权或其他激励。NYSE Rule 104、Nasdaq Equity 2 以及 Cboe EDGX Options 的现行规则分别展示了不同股票和期权场所的本地安排；截至 2026-08-28 核验时，它们在对象、阈值、例外和职责上并不相同。<Cite n={19} /><Cite n={20} /><Cite n={21} />
        </p>
        <p>
          欧盟 MiFID II Article 17(3) 与 RTS 8 又以算法做市策略及书面协议规定特定连续性要求，同样需要结合 instrument、trading hours、exceptional circumstances 与具体协议解释。不能把这些规则概括成“做市商永远站在 NBBO（美国全国市场体系汇总的最佳买价与卖价）”“必须无限量接盘”或“任何被动算法都是注册做市商”。本节的制度陈述均核验至 2026-08-28；未来使用时仍应重新查看当时版本。<Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="role-boundaries">
        <p className="section-kicker">09 · Principal、Dealer 与 Broker</p>
        <h2>做市功能的经济核心是 principal risk bearing；broker 的核心则是代表客户行动，二者可以存在于同一机构，却不能在同一笔账上含混。</h2>
        <p>
          Principal 以自身账户成为交易对手：买入后资产与库存增加，卖出后库存减少或形成空头，盈亏归自己。Broker/agent 主要接受、路由或执行客户指令，收入可能是佣金，客户保留头寸经济风险。Dealer 通常描述经常以自营账户进行买卖的业务，但精确法律分类受司法辖区、产品和活动影响。SEC 的 broker-dealer 注册指南可用于理解美国证券语境，却不能替代个案法律意见。<Cite n={25} />
        </p>
        <div className="table-scroll" role="region" aria-label="Principal dealer 与 broker agent 的比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先问风险在谁的资产负债表上</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">Principal / dealer 式做市</th><th scope="col">Broker / agent 式执行</th></tr></thead>
            <tbody>
              <tr><th scope="row">交易账户</th><td>Own account</td><td>On behalf of client</td></tr>
              <tr><th scope="row">主要收入</th><td>Capture、fees/rebates、相对价值等</td><td>Commission、routing / execution fee</td></tr>
              <tr><th scope="row">核心风险</th><td>Inventory、adverse selection、funding、hedge</td><td>Agency、best execution、operational 与合规</td></tr>
              <tr><th scope="row">识别证据</th><td>账户、持仓、成交与对冲账本</td><td>客户协议、订单归属与代理义务</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="principal-balance-sheet">
        <p className="section-kicker">10 · 资产负债表生产流动性</p>
        <h2>每一次“立即成交”都必须落到现金与库存上；没有资本容量的报价，只是无法履约的文字。</h2>
        <p>
          做市商以 bid 买入时，现金 C 减少、库存 q 增加；以 ask 卖出时，现金增加、库存减少。若允许做空，还需要证券借贷或其他交付安排；若用期货、期权或相关资产对冲，会新增保证金、basis、vega（期权价值对隐含波动率的敏感度）或相关性风险。资本限额决定能承接多大单边流，融资条件决定能持有多久，风险系统决定何时缩小 size 或撤回报价。
        </p>
        <p>
          Amihud–Mendelson 与 Ho–Stoll 的 dealer 模型把库存和价格不确定性带入报价决策；竞争模型又说明多个 dealer 会互相影响。它们提供机制基准，不意味着现实公司只优化一个单资产库存，也不意味着最优 quote 能脱离队列、信息、手续费和风控直接套用。具体 reservation price 与 quote adjustment 留到 1.13。<Cite n={4} /><Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="quote-inventory-cycle">
        <p className="section-kicker">11 · 报价—成交—库存—再报价循环</p>
        <h2>做市不是一次买低卖高，而是一个会改变自身状态的循环：每笔成交都重写下一次可承担的风险。</h2>
        <div className="mechanism-chain" aria-label="做市商的状态循环">
          {[
            ['估计参考价值', '从订单簿、关联市场、新闻与模型形成 mid / fair-value proxy'],
            ['提交条件报价', '选择 bid、ask、size、venue 与有效时间'],
            ['外部订单选择一侧', '成交方向并非由做市商单独控制'],
            ['现金与库存更新', 'principal balance sheet 接受即时性风险'],
            ['持有、对冲或卸载', '自然反向流、主动交易或跨市场 hedge 改变暴露'],
            ['风险与信息重估', '新 q、markout、funding 与毒性状态进入下一轮'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这个反馈使“同样一笔 1,000 股卖单”在不同状态下产生不同反应：库存接近上限、融资变贵或连续订单高度同向时，新增库存的边际成本更高；库存偏空且随后自然买单概率高时，同一卖单也许反而帮助恢复目标。只看成交当刻的 spread，无法知道这笔交易改善还是恶化了整个资产负债表。
        </p>
      </section>

      <section className="lesson-section" id="gross-spread-capture">
        <p className="section-kicker">12 · Gross Spread Capture 只是第一行</p>
        <h2>成交价格相对成交前 mid 的有利差额，是可以精确定义的毛 capture；它既不是已实现往返利润，也不是公司净利润。</h2>
        <p>
          规定做市商库存变化 Δq&gt;0 表示买入、Δq&lt;0 表示卖出，成交价为 P，成交前 mid 为 m。单笔 entry spread capture 定义为 (m−P)Δq：买在 mid 下方时两个因子都为正；卖在 mid 上方时二者都为负，乘积仍为正。若在错误一侧成交，它也可以为负。这个符号约定让 bid 与 ask 使用同一个公式。
        </p>
        <div className="equation-card">
          <span>单笔 entry capture</span>
          <div>G<sub>t</sub>=(m<sub>t</sub>−P<sub>t</sub>)Δq<sub>t</sub></div>
          <p>它把成交与成交前参考 mid 比较。G&gt;0 只说明进入价格有利；成交之后 mid 怎样走、库存怎样对冲、费用怎样发生，都还没有进入。</p>
        </div>
        <p>
          若买入 Q 股正好发生在 b=m−h，G=Qh；若卖出 Q 股发生在 a=m+h，因 Δq=−Q，G=(m−a)(−Q)=Qh。两侧都能产生正 capture，但并不保证由同一做市商按同一数量得到，也不保证中间没有库存损失。
        </p>
      </section>

      <section className="lesson-section" id="paired-fill-illusion">
        <p className="section-kicker">13 · “买 bid、卖 ask”错觉</p>
        <h2>Q(a−b) 是一个需要五项条件同时成立的理想往返，不是看到 quoted spread 后可以直接认领的收益。</h2>
        <p>
          理想例子中，同一做市商先按 bid 买 Q，再按 ask 卖 Q；两笔之间 mid 不变、数量完全配对、没有费用、返佣、融资、借券、对冲或延迟成本。此时现金增加 Q(a−b)，库存回到原点，毛利润恰好是 Q 个 full spread。这个例子适合解释服务收入从何而来，却故意删掉了现实中最重要的风险。
        </p>
        <div className="boundary-box">
          <b>只有以下条件同时满足，才可写 Q(a−b)</b>
          <p>同一做市商；同一数量；先后两侧都真实成交；期间参考价值不变；没有遗漏成本。若只看到公开 tape，通常甚至不知道两侧是否属于同一 liquidity provider。</p>
        </div>
        <p>
          连续买单还会让做市商不断卖出并变短；知情交易者会选择旧 ask 过低时买、旧 bid 过高时卖；竞争者可能在有利一侧抢走成交。Quoted spread 是可见机会集合，不是任何单个主体的可兑现年金。
        </p>
      </section>

      <section className="lesson-section" id="per-fill-capture">
        <p className="section-kicker">14 · 每笔成交怎样进入账本</p>
        <h2>先在成交发生前固定 mid，再用库存变化决定符号，才能避免 hindsight benchmark 与买卖方向混乱。</h2>
        <p>
          对成交 t，应先选定 m<sub>t</sub>：通常是同一场所报价，或明确定义 consolidated quote（跨场所汇总报价）的成交前 mid，并记录它的时间戳、陈旧性，以及 locked/crossed（最佳买卖价相等/倒挂）时怎样处理。随后从做市商视角编码 Δq<sub>t</sub>。若用成交后的 mid 当进入基准，会把紧随成交的信息反应倒灌进 spread capture；若沿用主动方 sign，又不改公式，收益符号会整体翻转。
        </p>
        <div className="table-scroll" role="region" aria-label="做市商视角的成交符号与 capture，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一公式覆盖 bid 与 ask</caption>
            <thead><tr><th scope="col">做市商动作</th><th scope="col">Δq</th><th scope="col">典型成交价</th><th scope="col">(m−P)Δq</th></tr></thead>
            <tbody>
              <tr><th scope="row">在 bid 买入 Q</th><td>+Q</td><td>P=b=m−h</td><td>+Qh</td></tr>
              <tr><th scope="row">在 ask 卖出 Q</th><td>−Q</td><td>P=a=m+h</td><td>+Qh</td></tr>
              <tr><th scope="row">买在 mid 上方</th><td>+Q</td><td>P&gt;m</td><td>负 capture</td></tr>
              <tr><th scope="row">卖在 mid 下方</th><td>−Q</td><td>P&lt;m</td><td>负 capture</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          研究者还要区分 quoted、effective 与 realized spread。Stoll 和 Huang–Stoll 的经验分解说明 spread 组件可以被系统估计，但具体比例依赖模型、样本与交易制度，不能把某个历史百分比当作所有市场的成本表。<Cite n={10} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="self-financing-ledger">
        <p className="section-kicker">15 · 自融资现金—库存恒等式</p>
        <h2>精确账本把一段 wealth 变化唯一拆成成交进入优势、旧库存持有损益以及返佣与费用；这不是近似的经济故事，而是按给定事件顺序成立的会计恒等式。</h2>
        <p>
          定义成交后现金 C<sub>t</sub>、库存 q<sub>t</sub>、用于盯市的 mid m<sub>t</sub>，wealth 为 W<sub>t</sub>=C<sub>t</sub>+q<sub>t</sub>m<sub>t</sub>。规定事件顺序为：上一状态位于 m<sub>t−1</sub>；mid 先更新到成交前 m<sub>t</sub>；随后按 P<sub>t</sub> 成交 Δq<sub>t</sub>，并确认返佣 R<sub>t</sub> 与费用 F<sub>t</sub>。现金和库存更新为：
        </p>
        <div className="equation-card">
          <span>状态更新</span>
          <div>C<sub>t</sub>=C<sub>t−1</sub>−P<sub>t</sub>Δq<sub>t</sub>+R<sub>t</sub>−F<sub>t</sub><br />q<sub>t</sub>=q<sub>t−1</sub>+Δq<sub>t</sub></div>
          <p>买入时 Δq&gt;0，所以现金减少；卖出时 Δq&lt;0，所以 −PΔq 使现金增加。R 与 F 在这里各出现一次。</p>
        </div>
        <div className="equation-card">
          <span>精确 wealth decomposition</span>
          <div>ΔW<sub>t</sub>=(m<sub>t</sub>−P<sub>t</sub>)Δq<sub>t</sub>+q<sub>t−1</sub>(m<sub>t</sub>−m<sub>t−1</sub>)+R<sub>t</sub>−F<sub>t</sub></div>
          <p>第一项是本次成交的 entry capture；第二项是成交前已有库存随 mid 变化产生的 holding P&amp;L。使用其他事件排序也可以，但公式必须相应改变，不能混用。</p>
        </div>
        <p>
          这里的“精确”是相对于选定 mid 的 mark-to-market（盯市）恒等式；q·m 不是大额库存可以按 mid 无冲击清算的承诺。若研究 liquidation wealth（实际清仓价值），还须另计退出 spread、可用 depth、market impact 与费用。恒等式最重要的作用是防止重复计算：若 inventory markout 已包含成交后价格朝不利方向移动，就不能再把同一段 adverse-selection markout 作为独立成本相加；若 hedge 的现金流已并入合并 wealth，也不能在“hedge cost”栏再次扣完整盈亏。经济标签可以多种，现金流位置只能有一个。
        </p>
      </section>

      <section className="lesson-section" id="worked-round-trip">
        <p className="section-kicker">16 · 两个 Half-spread 仍可亏损</p>
        <h2>买入和卖出各自都成交在有利一侧，只要持有期间 mid 下跌超过毛 capture，完整往返仍然亏损。</h2>
        <p>
          初始现金与库存都取零。做市商在成交前 m=100 时买 100 股、P=99.98：entry capture 为 +2，库存变 100。随后 mid 从 100 跌到 99.90，旧库存 holding P&amp;L 为 100×(−0.10)=−10。最后做市商在成交前 m=99.90 时以 99.92 卖出 100 股：第二次 entry capture 又是 +2，库存回到零。
        </p>
        <div className="equation-card">
          <span>逐项对账</span>
          <div>Gross entry capture = +$2+$2=+$4<br />Inventory holding P&amp;L = −$10<br />Total ΔW = +$4−$10=−$6</div>
          <p>现金核对得到同一答案：100×($99.92−$99.98)=−$6。两次“赚 half-spread”和最终亏损并不矛盾，因为它们描述不同时间段的价值变化。</p>
        </div>
        <p>
          若 mid 下跌源于卖单携带的信息，可以在机制解释上称为 adverse selection；若源于无关公共新闻，也可能只是 inventory exposure。这里的 markout 是成交后参考价格相对先前参考价的移动。账本只记录发生了多少，因果归因还需交易方向、公共事件、关联市场和反事实证据。不要把一个数值同时记入“库存损失”和“知情交易成本”。
        </p>
      </section>

      <section className="lesson-section" id="realized-spread-bridge">
        <p className="section-kicker">17 · 从 Effective Spread 到 Maker Markout</p>
        <h2>Realized spread 可把成交时的进入优势与固定 horizon 后的价格移动连接起来，但它是一笔交易的测量桥，不是公司的完整 P&amp;L。</h2>
        <p>
          沿用 1.05 的 full-spread return 口径，令 ES 为 effective spread、PI(h) 为从成交前参考 mid m<sub>0</sub> 到 h 时点同口径参考 mid m<sub>h</sub> 的方向化变化，则 RS(h)=ES−PI(h)。对名义规模 Qm<sub>0</sub> 的一笔孤立成交，做市方 horizon-h markout 可写成 Qm<sub>0</sub>RS(h)/2。除以二是因为 ES、PI 与 RS 用 full-spread 口径，而单侧成交只对应 half-spread。
        </p>
        <div className="equation-card">
          <span>仅限孤立成交的 bridge</span>
          <div>G=Qm<sub>0</sub>·ES/2<br />Π<sub>maker</sub>(h)=Qm<sub>0</sub>·RS(h)/2=Qm<sub>0</sub>[ES−PI(h)]/2</div>
          <p>例：Q=1,000、m₀=$100、ES=4 bp、PI=6 bp，则 RS=−2 bp，maker markout 为 −$10。它不含其他库存、hedge、固定成本或资本收费。</p>
        </div>
        <p>
          Horizon 会改变解释：数秒可能测量 quote update，数分钟可能混入公共新闻，日终又加入库存处置和时段效应。Huang–Stoll 的 spread decomposition 提供经典框架，但其 61.76% order-processing、28.65% inventory、9.59% adverse-information 是特定模型与样本的估计，绝不是市场常数。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="fees-rebates">
        <p className="section-kicker">18 · Fees 与 Rebates 会改写毛边际</p>
        <h2>相同的成交价格路径，在 maker rebate、taker fee、清算费和 tier 门槛不同的场所，能产生不同的净贡献。</h2>
        <p>
          返佣 R 是场所为提供流动性支付的收入，费用 F 包括交易、清算、监管或其他按量收费；不同产品还可能采用 inverted fee。它们会影响被动报价的最低可持续 edge、跨场所路由和月末达到 volume tier 的动机。研究者若只用价格 tape 而没有 participant fee schedule，最多得到 gross capture，不能声称净盈利。
        </p>
        <p>
          返佣也不是免费午餐。高 rebate 的队列可能更拥挤，成交概率和 adverse markout 可能不同；为了达成 tier 而增加的边际成交可能质量更差。Menkveld 个案显示 spread revenue、费用安排、库存与资本成本需要共同看待，但其观察到的一个 HFT 参与率约 8.1%/64.4%、约五分之四交易为被动等数字，只属于该主体与两市场环境，不代表 HFT 的普遍结构。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="hedge-ledger">
        <p className="section-kicker">19 · Hedge 改变风险，不会让风险消失</p>
        <h2>对冲把一部分直接价格暴露换成另一组基差、相关性、执行、保证金和流动性暴露；它应在账本中作为独立组合腿出现。</h2>
        <p>
          股票做市商可用指数期货对冲 beta（股票对市场整体变动的敏感度），ETF 做市商可用篮子、期货或相近 ETF，期权做市商还要管理 delta（期权价格对标的价格的敏感度）、gamma（delta 随标的价格变化的速度）与 vega（对隐含波动率的敏感度）。若 hedge 与库存价值完全同标的、同数量、同时间且无成本，净方向风险可大幅下降；现实中 hedge ratio 有估计误差，价格之间存在 basis，成交不同步，且压力状态相关性会变化。因此“已对冲”只说明选定风险因子被压低，不等于组合无风险。
        </p>
        <div className="equation-card">
          <span>一个最小的合并 wealth 视角</span>
          <div>W<sup>combined</sup>=C<sup>combined</sup>+qm+V<sub>H</sub>(x,H)</div>
          <p>Ccombined 已包含库存与对冲腿的交易现金流；V<sub>H</sub> 是按该工具合约乘数、估值和结算规则计算的对冲头寸价值。现金现货可简化为 xH；期货、期权不能不加调整地用“持仓×价格”。若对冲损益已计入 combined wealth，就只另扣尚未入账的执行费或融资，不能重复扣完整 hedge P&amp;L。</p>
        </div>
        <p>
          Hendershott–Menkveld 的历史 NYSE 研究把中介库存与暂时价格压力连接起来，在 1994–2005 年 697 只股票样本的特定模型中估得平均 price pressure 约 49 bp、半衰期约 0.92 日。它支持“库存由价格让步和时间吸收”的机制，却不是现代逐笔对冲成本或所有资产的固定参数。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="funding-capital-operations">
        <p className="section-kicker">20 · Funding、Capital 与 Operations</p>
        <h2>一项策略在交易层面有正 contribution，仍可能因为持仓融资、保证金、固定基础设施和资本稀缺而没有经济价值。</h2>
        <p>
          Long inventory 消耗现金或融资容量；short inventory 可能需要借券、支付 borrow fee，并承担 recall（出借方要求收回证券）的风险。衍生品的 initial margin（开仓时占用的初始抵押品）会占用资本，variation margin（随价格变化结算的盈亏）则会造成现金流与流动性需求；跨场所头寸还可能在结算时间上错位。资本限额不是抽象惩罚：同一美元被这项做市占用，就不能支持另一项业务；尾部损失和压力追加保证金又使平均融资成本不足以描述真实约束。
        </p>
        <p>
          做市还依赖低延迟行情、共址、网络、风控、监控、清算、合规、人力和灾备。部分成本随成交变化，部分是进入后即发生的固定成本，另一些会在极端容量需求下非线性跳升。Stoll 的“dealer services supply”视角因此应被理解为一套生产函数：spread 与其他收入购买的不只是库存风险，也购买了持续报价所需的组织与技术。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="risk-map">
        <p className="section-kicker">21 · 风险不是一张平铺清单</p>
        <h2>做市风险沿“成交如何选择报价—头寸怎样留存—约束如何反馈到下一轮报价”形成一条动态因果链。</h2>
        <div className="table-scroll" role="region" aria-label="做市商风险地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>风险来源、第一落点与反馈</caption>
            <thead><tr><th scope="col">风险</th><th scope="col">首先改变什么</th><th scope="col">账本位置</th><th scope="col">典型反馈</th></tr></thead>
            <tbody>
              <tr><th scope="row">Inventory</th><td>已有 q 对 m 变化的敏感度</td><td>Holding P&amp;L / capital</td><td>Skew、size、hedge、退出</td></tr>
              <tr><th scope="row">Adverse selection</th><td>哪一侧被有信息地选择</td><td>未来 markout</td><td>重估 fair value、扩大保护</td></tr>
              <tr><th scope="row">Funding / borrow</th><td>持仓可持续时间与规模</td><td>Interest、borrow、margin</td><td>压缩 balance-sheet capacity</td></tr>
              <tr><th scope="row">Hedge / basis</th><td>残余因子和跨资产偏离</td><td>Hedge P&amp;L 与成本</td><td>改 hedge ratio 或工具</td></tr>
              <tr><th scope="row">Operational</th><td>报价是否仍正确、可撤、可交付</td><td>错误成交、罚款、修复</td><td>Kill switch、降级、停报</td></tr>
              <tr><th scope="row">Tail / model</th><td>状态判断和损失分布</td><td>极端损失 / capital charge</td><td>限额骤降与同步撤流动性</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这些风险会互相放大：有毒单边流造成库存积累，价格继续不利移动触发保证金，融资余量下降迫使对冲或减仓，多个做市者若同时反应，市场 depth 下降、price impact 上升，又让卸载更贵。这是一条融资流动性—市场流动性正反馈；Brunnermeier–Pedersen 给出了经典理论机制，但它不是任何一次危机的单因解释。竞争、反向自然订单、资本充足和指定义务则可能形成缓冲。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-risk-boundary">
        <p className="section-kicker">22 · Inventory Risk：本节只划边界</p>
        <h2>库存风险不是“持仓可能亏钱”这么简单，而是当前 q 改变未来价格冲击、融资和下一笔成交的边际价值。</h2>
        <p>
          若 q&gt;0，mid 下跌直接降低 wealth；即使预期价格变化为零，风险厌恶、资本约束与尾部损失也使大库存有成本。Amihud–Mendelson、Ho–Stoll 分别用不同模型展示 dealer 会借助报价吸引减少库存的订单并抑制继续增加库存的成交；多个 dealer 竞争又会改变单体选择。<Cite n={4} /><Cite n={5} /><Cite n={6} />
        </p>
        <p>
          经验上，Hasbrouck–Sofianos 在历史 NYSE specialist 数据中发现库存调整可跨相当长时段，某些 adjustment 约一至两个月，同时 specialist 在较短期具有交易利润；Madhavan–Smidt 对 1987 年 16 只股票、一个 specialist firm 的受控模型估得目标库存半衰期约 7.3 日。两组结果都提醒库存不必日内归零，却因样本窄且制度历史化，不能转化成“所有做市商的最优持有期”。<Cite n={11} /><Cite n={12} />
        </p>
        <p>
          本节到此只建立 q 进入账本与参与约束的必要性。下一节 1.13 才回答 reservation price 如何随 q、风险承受、时间和订单到达改变，以及 quote skew 是否真能识别库存管理。
        </p>
      </section>

      <section className="lesson-section" id="adverse-selection-boundary">
        <p className="section-kicker">23 · Adverse Selection：同一 Markout 的因果解释</p>
        <h2>做市商最怕的不是每次价格变化，而是对手方在报价过时时有选择地只成交错误一侧；信息优势通过成交选择进入未来 markout。</h2>
        <p>
          Copeland–Galai 把限价报价理解为向交易者提供的一组期权，信息更好的交易者会在报价相对新价值有利时执行；Glosten–Milgrom 则说明观察到买卖会更新 market maker 对资产价值的信念，形成信息型 spread。二者解释了为何订单方向与后续价格同向可能使 entry capture 被吞噬。<Cite n={8} /><Cite n={9} />
        </p>
        <p>
          但账本和因果标签必须分开。成交后 mid 下跌造成 long inventory 的 −$10 markout，这是一次 holding loss；若证据显示卖方在坏消息前有信息优势，可把这段损失解释为 adverse selection channel。不能再在总 P&amp;L 中额外扣“adverse-selection cost −$10”。1.10 已系统讨论 Bayes 更新、PIN/VPIN 与识别边界，本节只说明信息风险如何进入做市经济。
        </p>
      </section>

      <section className="lesson-section" id="operational-obligation-risk">
        <p className="section-kicker">24 · Operational 与 Obligation Risk</p>
        <h2>连续报价要求系统在最不适合出错的时候仍能更新、撤单、限额与交付；制度义务又可能让退出速度慢于纯自愿供给者。</h2>
        <p>
          行情延迟会使 fair value 过时，网络抖动会让撤单晚于市场，错误参数会把 size 放大，账户同步失败会隐藏真实 q，kill switch 误触发又会中断服务。损失可能先表现为有毒成交，随后才成为合规、清算、客户与声誉问题。技术风险因此不是“IT 部门成本”，而是直接决定两边条件承诺是否真实可控。
        </p>
        <p>
          正式计划增加另一层：在正常状态下，最低 presence、width 或 size 可以提高可预期服务；在 exceptional circumstances、halt 或技术故障下，规则通常另设例外和程序。截至 2026-08-28 核验的 NYSE、Nasdaq、Cboe 和欧盟文件都必须按本地条文解读，不能用一句“有义务所以不能撤”取代适用条件审计。<Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="full-daily-ledger">
        <p className="section-kicker">25 · 完整日度账本</p>
        <h2>从 +$12,000 gross capture 到 +$1,800 accounting P&amp;L，再到 −$300 economic surplus，差别来自同一业务的完整成本边界。</h2>
        <div className="table-scroll" role="region" aria-label="做市商完整日度损益账本，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>教学性单日账本，单位：美元</caption>
            <thead><tr><th scope="col">账本项目</th><th scope="col">金额</th><th scope="col">口径说明</th></tr></thead>
            <tbody>
              <tr><th scope="row">Gross entry capture</th><td>+12,000</td><td>逐笔成交前 mid 与 maker Δq 计算</td></tr>
              <tr><th scope="row">Rebates</th><td>+1,000</td><td>按实际 fee tier 归属</td></tr>
              <tr><th scope="row">Inventory markout</th><td>−6,000</td><td>已包含公共信息、adverse selection 与其他价格移动的合计结果</td></tr>
              <tr><th scope="row">Hedge net / execution cost</th><td>−1,500</td><td>合并口径未在别处重复</td></tr>
              <tr><th scope="row">Trading / clearing fees</th><td>−800</td><td>扣除 rebate 后仍需单列的费用</td></tr>
              <tr><th scope="row">Funding / borrow / margin</th><td>−500</td><td>持仓与对冲资金成本</td></tr>
              <tr><th scope="row">Operations / data / compliance</th><td>−2,400</td><td>分摊至当日的基础设施与组织成本</td></tr>
              <tr><th scope="row"><b>Accounting P&amp;L</b></th><td><b>+1,800</b></td><td>12,000+1,000−6,000−1,500−800−500−2,400</td></tr>
              <tr><th scope="row">Risk / capital charge</th><td>−1,200</td><td>对尾部与稀缺资本的内部收费</td></tr>
              <tr><th scope="row">Outside option</th><td>−900</td><td>同一资本用于其他业务可获得的最低回报</td></tr>
              <tr><th scope="row"><b>Base economic surplus</b></th><td><b>−300</b></td><td>1,800−1,200−900</td></tr>
              <tr><th scope="row">Designated incentive</th><td>+700</td><td>计划带来的增量收入</td></tr>
              <tr><th scope="row">Obligation cost</th><td>−200</td><td>满足计划最低服务标准的增量成本</td></tr>
              <tr><th scope="row"><b>Program economic surplus</b></th><td><b>+200</b></td><td>−300+700−200</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这个例子不是行业利润率，而是一张防错模板。Inventory markout 已经包含价格路径的全部结果，不能再扣一遍 adverse selection；hedge 栏采用净口径，不能再把同一 hedge P&amp;L 并入 inventory；risk charge 不是已经实现损失，而是对尾部和资本占用的经济定价。改变会计边界会改变小计，但所有现金流和风险成本必须恰好出现一次。
        </p>
      </section>

      <section className="lesson-section" id="accounting-economic-profit">
        <p className="section-kicker">26 · Accounting P&amp;L 不等于 Economic Profit</p>
        <h2>正的会计收益只说明已记录收入大于已记录费用；资本若承担了没有得到补偿的尾部风险，股东仍可能选择退出。</h2>
        <p>
          Accounting P&amp;L 通常依据既定报告规则确认交易、mark-to-market 和费用。Economic profit 还要扣稀缺资本的机会成本、风险承受成本和可替代业务回报。两家公司使用同样策略、得到同样 +$1,800，会因资本结构、融资渠道、风控限额和 outside option 不同而作出相反的参与决定。
        </p>
        <p>
          Risk charge 不能随意设成“让策略看起来不赚钱”的残差。它应与可解释的损失分布、压力情景、margin liquidity、资本预算或风险偏好相连，并与已经实现的 markout 分开。Comerton-Forde 等把 market-maker inventories 与 revenues 的时间变化联系起来，支持资本与库存状态影响市场流动性的观点；这仍不意味着某个通用资本乘数适用于所有市场。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="participation-constraint">
        <p className="section-kicker">27 · 参与约束</p>
        <h2>做市资本只有在预期完整剩余不低于零时才会进入或留下；这解释“为何有人供给”，却不直接给出下一档 quote。</h2>
        <div className="equation-card">
          <span>风险调整参与条件</span>
          <div>𝒫=E[Π<sub>acct</sub>]+I<sub>des</sub>−C<sub>obl</sub>−ρ(Π)−π̄ ≥ 0</div>
          <p>E[Πacct] 是预期会计损益；I_des 是指定计划激励；C_obl 是履行义务的增量成本；ρ(Π) 是风险/资本收费；π̄ 是外部机会回报。小于零时，长期应缩减、重组或退出。</p>
        </div>
        <p>
          参与约束回答“是否进入或退出”，不是“进入后下一档怎样报价”的一阶条件。它不能告诉你 bid 应下调 2 ticks 还是 3 ticks，也不能替代包含库存状态的动态优化模型。它能解释的是：spread、rebate、规模、成本与风险状态如何共同决定这门服务是否有人愿意生产。
        </p>
        <p>
          Grossman–Miller 的框架强调愿意在临时失衡时投入资本的中介数量会影响流动性；这并不证明市场自动达到社会最优中介数量。进入成本、外部性、制度激励与信息优势都可能使私人参与和社会流动性需求不一致。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="scale-break-even">
        <p className="section-kicker">28 · 规模、固定成本与盈亏平衡</p>
        <h2>正的单位贡献可以靠规模覆盖固定成本；负的单位贡献则会被规模放大，成交越多亏得越多。</h2>
        <p>
          令每笔或每单位名义量扣除 entry capture、预期 markout、返佣、费用、hedge 与边际 funding 后的平均 contribution 为 c̄，固定技术、人员、合规和接入成本为 F<sub>fixed</sub>。若 c̄&gt;0，简单盈亏平衡成交量为 N*=F<sub>fixed</sub>/c̄；若 c̄≤0，不存在正的 N*，增加 volume 无法修复商业模型。
        </p>
        <div className="equation-card">
          <span>最小规模基准</span>
          <div>Π(N)=N·c̄−F<sub>fixed</sub>　；　N*=F<sub>fixed</sub>/c̄，仅当 c̄&gt;0</div>
          <p>这是假设 c̄ 不随规模变化的教学基准。现实中更大规模会改变 queue position、market impact、fee tier、库存风险和容量，所以应估计 c̄(N, state)。</p>
        </div>
        <p>
          高固定成本会推动集中和技术竞赛，但竞争又压缩 gross edge；规模同时带来分散、净额结算和更好数据，也带来容量、尾部共振与更大资本需求。因此“最大参与者必然成本最低”与“小参与者必然更灵活”都只是待检验命题。
        </p>
      </section>

      <section className="lesson-section" id="designated-program-economics">
        <p className="section-kicker">29 · 指定计划的交换关系</p>
        <h2>做市计划的经济设计，是用可验证的义务购买额外流动性供给；激励只有在改变边际参与或报价质量时才产生增量效果。</h2>
        <p>
          场所可能用费用优惠、返佣、分配优势或其他权利，交换特定证券/时段的 presence、width、size 或连续性。对企业而言，计划增量价值是 I<sub>des</sub>−C<sub>obl</sub>，并可能通过更多成交、不同毒性和更高资本占用间接改变 Π<sub>acct</sub> 与 ρ。第 25 节例子中，基础剩余 −$300，计划净增量 +$500，才把参与转成 +$200。
        </p>
        <p>
          对政策评估而言，看到加入计划者 spread 更窄不足以证明因果，因为本来更有能力的公司更可能自选加入，场所也可能把计划放在特定证券。可信设计需要规则阈值、分阶段上线、合资格边界或其他外生变化，并检查 volume、depth、effective/realized spread、outage、压力状态和退出，而不只是平均 quoted spread。具体规则仍需按当地版本核验。<Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="service-fragility">
        <p className="section-kicker">30 · 流动性供给是内生且脆弱的</p>
        <h2>做市商在市场最需要流动性时也可能最不愿供给，因为订单毒性、波动、库存相关性与融资需求会同时上升。</h2>
        <p>
          压力状态下，reference price 更新更快，旧 quote 更容易被选择；单边 flow 使多个做市商持有相似库存，hedge 市场也可能变浅；波动抬高 margin 与资本收费。参与约束在短时间内恶化，于是理性的单体反应是扩大 width、减小 size、提高撤单速度或退出。若许多主体同时执行，市场 depth 下降、price impact 上升，反过来让库存处置更贵，形成融资流动性—市场流动性的正反馈；这是理论上的放大机制，不是对某次事件的唯一归因。<Cite n={24} />
        </p>
        <p>
          2010 年 5 月 6 日联合 CFTC–SEC 报告记录，在极端事件中一些流动性提供者扩大 spread、减少或停止交易，但不能概括成所有做市商同时退出，也不能把事件单因归结为 HFT。官方报告支持的谨慎结论是：流动性供给会随市场状态内生改变，自动化参与者的行为亦非同质。<Cite n={17} />
        </p>
        <p>
          正式义务和资本缓冲可以减弱退出，但不能废除风险约束。制度设计真正的问题不是要求一个标签“永远提供流动性”，而是正常与异常状态下哪些最低服务可验证、承担者得到什么补偿、例外如何触发，以及风险是否被转移到更不透明的环节。
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">31 · 证据地图</p>
        <h2>理论、账本、经验数据与规则文件回答不同问题；专业结论必须把证据停在它真正覆盖的层级。</h2>
        <div className="table-scroll" role="region" aria-label="做市商研究证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>证据能说什么，不能说什么</caption>
            <thead><tr><th scope="col">证据</th><th scope="col">最适合支持</th><th scope="col">主要边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">经典理论模型</th><td>订单到达、库存、信息与参与约束的机制</td><td>可解假设不是普遍经验事实</td></tr>
              <tr><th scope="row">自有逐笔账本</th><td>真实 capture、markout、fees、hedge 与 q 路径</td><td>难观察竞争者与反事实</td></tr>
              <tr><th scope="row">公开 quote / trade</th><td>市场级 width、depth、成交与 markout</td><td>难识别同一做市商、真实费用与库存</td></tr>
              <tr><th scope="row">历史 specialist 样本</th><td>库存与报价关系的制度内经验</td><td>时代、场所、公司和样本外推受限</td></tr>
              <tr><th scope="row">当前规则与协议</th><td>正式身份、最低义务、例外和激励</td><td>不能证明实际执行效果或盈利</td></tr>
              <tr><th scope="row">事件 / 准实验</th><td>规则、费用或冲击改变服务供给的因果效应</td><td>处理前变化趋势可比、无同期制度变化、无跨组影响</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Hasbrouck–Sofianos、Madhavan–Smidt、Comerton-Forde 等提供难得的 dealer / specialist 库存证据；Menkveld 展示一个现代 HFT 做市个案；它们共同支持“库存、收入、资本和市场状态相互关联”，却不提供跨时代常数。引用它们时应把样本、年份、主体和模型与数字放在同一句话附近。<Cite n={11} /><Cite n={12} /><Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="data-estimation">
        <p className="section-kicker">32 · 数据与估计协议</p>
        <h2>要估计做市经济，第一步不是回归，而是明确视角、时钟、参考价和每一笔成本的唯一归属。</h2>
        <div className="protocol-grid">
          <article><span>01</span><h3>固定研究视角</h3><p>自有 dealer、推断的 liquidity provider，还是全市场？公开数据通常无法重建 firm P&amp;L。</p></article>
          <article><span>02</span><h3>统一 maker sign</h3><p>Δq&gt;0 为 maker buy，记录成交价、数量、venue、order id 与 fee tier；不要混用 aggressor sign。</p></article>
          <article><span>03</span><h3>冻结 pre-trade mid</h3><p>定义 direct feed（交易所直连行情）/ consolidated feed（跨场所汇总行情）、时间戳、locked/crossed、stale quote 与延迟处理，禁止后验参考价。</p></article>
          <article><span>04</span><h3>逐事件更新账本</h3><p>按固定顺序更新 m、C、q、R、F；用 C+qm 独立回算并定位舍入或重复项。</p></article>
          <article><span>05</span><h3>多 horizon markout</h3><p>报告 1s、10s、1m、5m 或经济合理窗口，分开公共新闻、成交后 drift 与处置期。</p></article>
          <article><span>06</span><h3>合并 hedge 与 funding</h3><p>保留 instrument、ratio、basis、execution、margin、borrow 和净额规则，明确 gross / net 口径。</p></article>
          <article><span>07</span><h3>状态分层</h3><p>按 volatility、flow imbalance、inventory bucket、news、open/close、halt 与 stress 分组。</p></article>
          <article><span>08</span><h3>制度版本化</h3><p>保存 rule effective date、security assignment、obligation、incentive 与 exception；不要用当前规则解释历史样本。</p></article>
        </div>
        <p>
          最低质量控制包括：每个成交的现金守恒、库存守恒、wealth decomposition、费用总额与 clearing statement（清算机构的结算对账单）核对；同一成交在 entry capture 与 horizon markout 的符号一致；自有数据与公共 tape 的时钟差异可解释；任何绩效图同时给出成交量、名义金额、库存、tail loss 与资本占用，而不只给平均每股收益。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先在不知道答案的位置完成损益与身份判断，再查看计算桥和制度边界。</h2>
        <p>
          Mode A 要求把 entry capture、holding P&amp;L、fees 与 realized-spread bridge 放进正确位置；Mode B 要求只根据可观察行为判断功能角色，并用参与约束审计指定计划。每题提交前不会显示推导，避免把阅读变成对答案的被动确认。
        </p>
        <MarketMakerLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 反例库</p>
        <h2>任何一句关于做市商的概括，都应先尝试用一个可执行反例击穿。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>“有买有卖就不需要做市商”</h3><p>买方上午到达、卖方下午到达；总量平衡，上午仍无自然对手方。做市库存桥接时间。</p></article>
          <article><span>反例 02</span><h3>“两边报价就赚 full spread”</h3><p>只有 bid 被击中，mid 随后下跌；另一侧既未成交，库存还发生损失。</p></article>
          <article><span>反例 03</span><h3>“每笔 capture 为正就会盈利”</h3><p>第 16 节两笔 capture 共 +$4，库存持有 −$10，最终 −$6。</p></article>
          <article><span>反例 04</span><h3>“对冲后没有风险”</h3><p>指数 hedge 消除 beta，却留下 single-name、basis、gap、execution 与 margin liquidity。</p></article>
          <article><span>反例 05</span><h3>“被动成交者都是做市商”</h3><p>长期投资者挂一次限价单，只是在执行自身头寸，没有持续服务或库存生产函数。</p></article>
          <article><span>反例 06</span><h3>“正式做市商必须无限接盘”</h3><p>真实规则按证券、时段、规模、宽度、presence 与例外限定；身份不是无限资产负债表。</p></article>
          <article><span>反例 07</span><h3>“正会计 P&amp;L 就值得继续”</h3><p>+$1,800 扣除资本风险和 outside option 后为 −$300，长期参与条件失败。</p></article>
          <article><span>反例 08</span><h3>“压力时 spread 宽所以利润更高”</h3><p>宽度同时伴随更少成交、更毒 flow、更大 gap、margin 与退出风险，净剩余可以更低。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 把世界观压缩成可证伪研究</p>
        <h2>“做市商提供流动性”太宽，真正可研究的问题必须指定冲击、主体、状态、账本结果和反事实。</h2>
        <div className="research-card">
          <span>研究题 A · Fee change 是否改变供给？</span>
          <h3>某场所 maker rebate 的离散变化，是否在合资格证券中提高正常时段 depth，却在高毒性时段恶化 realized spread？</h3>
          <p><b>处理：</b>预先公布的费用阈值或分阶段变更。<b>对照：</b>未受影响但事前特征相近的证券/场所。<b>结果：</b>quoted/effective/realized spread、depth、cancel、volume、markout。<b>证伪：</b>变更前已有差异趋势，或同步 routing/rule 改动解释结果。</p>
        </div>
        <div className="research-card">
          <span>研究题 B · Inventory 是否因果改变报价？</span>
          <h3>在控制公共价值创新后，外生造成的 dealer inventory shock 是否使减少库存一侧的 quote 更有吸引力？</h3>
          <p><b>困难：</b>q 本身由信息型成交和报价共同决定，普通回归高度内生。<b>候选 variation：</b>不可预测的被动 allocation、外部组合再平衡或制度性 assignment，但必须排除其直接信息通道。<b>结果：</b>skew、size、fill 与后续 q mean reversion。<b>证伪：</b>placebo 时点和未受影响方向同样变化。</p>
        </div>
        <div className="research-card">
          <span>研究题 C · 指定义务是否提高压力流动性？</span>
          <h3>达到 obligation threshold 的证券，在波动冲击中是否比邻近未纳入证券保留更多可执行 size 与更快 resilience？</h3>
          <p><b>设计：</b>利用合资格阈值或分期上线，比较处理组与可比对照组在制度前后的变化（difference-in-differences，双重差分）。<b>结果：</b>presence、width、depth、price impact、halt 与恢复。<b>机制：</b>激励、资本和例外触发。<b>边界：</b>不得把选择进入计划的能力误作义务效果。</p>
        </div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>练习的目标是重建账本和识别边界，而不是背诵“做市商赚 spread”。</h2>
        <div className="practice-grid">
          <article>
            <span>练习 01 · 状态账本</span>
            <h3>从 C₀=$50,000、q₀=200、m₀=$25.00 出发。mid 先升至 $25.10，做市商再以 $25.08 买 100 股，rebate $0.20、fee $0.05。计算 C₁、q₁、W₀、W₁ 与分解。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>C₁=50,000−25.08×100+0.20−0.05=$47,492.15；q₁=300；W₀=50,000+200×25=$55,000；W₁=47,492.15+300×25.10=$55,022.15，ΔW=+$22.15。Entry capture=(25.10−25.08)×100=+$2；旧库存 holding=200×(25.10−25)=+$20；rebate−fee=+$0.15，合计 +$22.15。</p></details>
          </article>
          <article>
            <span>练习 02 · 不重复记账</span>
            <h3>报告写着“inventory markout −$4,000，其中知情流造成 −$2,500；adverse-selection cost 再扣 −$2,500”。指出错误并给两种合法呈现。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>第二次扣除重复计算。合法呈现 A：总账只记 inventory markout −$4,000，在注释中把其中 −$2,500 归因于知情流；合法呈现 B：把 markout 互斥拆成 identified adverse-selection −$2,500 与 residual/public −$1,500，两项合计仍为 −$4,000。</p></details>
          </article>
          <article>
            <span>练习 03 · 盈亏平衡</span>
            <h3>固定成本 $2,000,000，平均单位 contribution 为 $0.008。求 N*；若 stress state 的 c̄=−$0.003，增加成交量能否修复？</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>正常状态 N*=2,000,000/0.008=250,000,000 单位。Stress 中 c̄&lt;0，不存在正盈亏平衡量；每多一单位都会扩大损失，应改变价格、规模、对冲、参与状态或成本结构。</p></details>
          </article>
          <article>
            <span>练习 04 · 身份审计</span>
            <h3>公开数据看到一家机构 70% 成交为被动、经常双边报价。写出能够支持的结论、仍需的制度证据和禁止外推的三项结论。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>可说其在样本中大规模执行 functional liquidity provision；仍需注册、指定协议、security assignment、适用时段、义务、例外和激励文件。不能直接说它是正式指定做市商、必须始终处在 NBBO、或其被动成交必然盈利。</p></details>
          </article>
          <article>
            <span>练习 05 · 研究设计</span>
            <h3>设计一个评估指定计划的最小研究方案，必须包含要估计的因果量、处理组、对照组、市场状态、结果指标与至少三个会使结论失效的条件。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>要估计的因果量：加入计划对高波动状态下可执行深度的平均影响；处理组：按明确日期或阈值纳入的证券；对照组：阈值附近或事前特征相近的未纳入证券；状态：正常与压力分别估计；结果：报价存在率、宽度、规模、effective/realized spread 和冲击后恢复速度。失败条件至少包括处理前变化趋势不可比、同期费用/路由/涨跌停规则改变、市场提前预期资格、处理影响扩散到对照证券，以及规则实际执行或例外时点记录错误。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>每个答案都应连接“谁承担什么风险—哪一项进入哪里—结论停在哪个证据层级”。</h2>
        <div className="check-grid">
          <details><summary>01 · 长期买卖量相等，为什么仍需要做市？</summary><p>总量平衡不意味着方向、时间、规模与价格同时匹配。做市商用现金和库存把未来自然对手方提前到现在，出售即时性。</p></details>
          <details><summary>02 · Immediacy 与 continuity 有什么区别？</summary><p>Immediacy 是某位交易者现在获得执行；continuity 是市场跨时点持续可交易。库存缓冲把一连串个体即时执行连接成连续服务。</p></details>
          <details><summary>03 · 双边报价为何不保证 full-spread 利润？</summary><p>市场可能只成交一侧、两侧可能属于不同提供者、数量不配、mid 会移动且存在多类成本。Q(a−b) 只在理想配对条件下成立。</p></details>
          <details><summary>04 · Functional 与 designated market maker 怎样区分？</summary><p>前者由持续被动供给、principal 成交和库存风险等行为识别；后者是当地规则或合同授予的正式身份，带特定证券、时段、义务、例外和激励。</p></details>
          <details><summary>05 · Principal 与 broker 的核心分界是什么？</summary><p>Principal 用自有账户成为交易对手并承担库存盈亏；broker/agent 代表客户路由或执行。一个机构可兼具业务，但每笔交易的角色应单独识别。</p></details>
          <details><summary>06 · 自融资恒等式中的两项市场收益分别是什么？</summary><p>(mₜ−Pₜ)Δqₜ 是本次成交进入优势；qₜ₋₁(mₜ−mₜ₋₁) 是成交前旧库存的持有损益。再加返佣减费用得到该事件 wealth 变化。</p></details>
          <details><summary>07 · 为何 inventory loss 与 adverse-selection cost 不能总是相加？</summary><p>Adverse selection 常是同一未来 markout 的因果标签。如果 inventory markout 已记全部价格路径，再扣同一数额会重复计算；只有互斥分解才可相加。</p></details>
          <details><summary>08 · 对冲后还剩哪些风险？</summary><p>Basis、相关性、执行延迟、流动性、模型、保证金和资金风险仍在；对冲工具本身也会改变现金与资本路径。</p></details>
          <details><summary>09 · 正 accounting P&amp;L 为什么可能不满足参与约束？</summary><p>还需补偿尾部/资本风险和 outside option。若扣除后经济剩余为负，长期资本会缩减、改造或退出。</p></details>
          <details><summary>10 · 为什么压力状态下 liquidity supply 会同时下降？</summary><p>订单毒性、波动、相关库存、hedge cost、margin 与资本收费共同上升，多个主体的参与约束同步恶化；各自减仓会提高 market impact，形成正反馈。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节证明做市是一项由资产负债表生产的即时性服务，并建立完整 P&amp;L 账本；后续章节才打开最优控制、竞争结构与 agent 行为。</h2>
        <div className="interface-grid">
          <article><span>← 1.05</span><h3>Bid–Ask Spread</h3><p>1.05 定义 quoted/effective/realized spread 与成本来源；本节把它们放进某个实际流动性提供者的现金和库存账本。</p></article>
          <article><span>← 1.10</span><h3>Adverse Selection</h3><p>1.10 解释信息如何选择报价；本节只追踪其 markout 如何进入 maker P&amp;L，并防止和库存损失重复计算。</p></article>
          <article><span>→ 1.13</span><h3>Inventory Risk 与 Quote Adjustment</h3><p>在当前自融资状态上研究 q、风险厌恶、时间与订单到达如何改变 reservation price、skew 与 size。</p></article>
          <article><span>→ 1.14 / 2.08</span><h3>Competition、HFT 与 Agent</h3><p>分别研究多做市者竞争和速度结构，以及参与者目标、信息、约束与策略选择。</p></article>
        </div>
        <p className="closing-thesis">面对“做市商赚什么、为什么存在”，应依次追问：自然订单是否在同一时刻、方向、规模和价格上匹配；谁以 principal 身份用现金与库存补上时间缺口；双边 quote 是功能行为还是正式身份；每笔 (m−P)Δq capture 与旧库存 qΔm 是否按固定事件顺序分开；fees/rebates、hedge、funding、borrow、operations 与 capital 是否恰好记一次；adverse selection 是新增现金流还是同一 markout 的因果标签；会计收益扣除风险和 outside option 后是否满足参与约束；制度义务适用于哪个证券、时段、规模、宽度和例外；压力状态下多个主体的最优退缩是否会相互强化。只有这条链闭合，quoted spread 才从屏幕上的距离变成一门可验证、可持续或会失败的流动性生产业务。</p>
      </section>
    </>
  );
}

export const lesson112: LessonRecord = {
  slug: '1-12',
  id: '1.12',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Market Maker 为什么存在',
  subtitle: '从自然买卖需求的时间错配出发，把即时性与连续双边报价还原为一项需要资产负债表承诺的服务，再用自融资现金—库存恒等式、完整 P&L 账本和风险调整参与约束解释 gross spread capture 为什么不等于利润',
  readingTime: '约 100–110 分钟（核心阅读 58–62＋互动 13–15＋主动练习 18–22＋理解检查 9–10＋课程接口 1；练习仅口答可缩短约 10 分钟）',
  prerequisite: '1.05 · Bid–Ask Spread、1.10 · Adverse Selection；按需回看 1.11 的多市场价格接口',
  updatedAt: '2026-08-28',
  revision: '1.12-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.12-r1',
      summary: '要求限定 mid-marked wealth 与清算价值的区别，用通用合约价值函数修正 hedge wealth，分开 initial 与 variation margin，补入融资流动性—市场流动性反馈的原始理论来源，并让一般 broker/dealer 定义对齐更直接的 SEC 指南。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.12-r1',
      summary: '要求在首次出现处解释 bid/ask/mid/basis/NBBO、Greeks、保证金与研究设计术语，消除 Mode B 的 B–A–B–A 正确项循环，并把主动练习与理解检查的时间预算调到可真实作答的范围。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.12-r2',
      summary: '确认 r1 的五项准确性意见全部解决且全量回归无新账本或来源错误；仅要求把 price impact 的文字起点从成交价改为成交前 mid，使其与 ES=RS+PI 的公式及 1.05 定义一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.12-r2',
      summary: '确认 r1 的三项 major 与时间预算意见均已解决，术语、互动、练习和可访问性全量回归通过；仅要求在 vega 第一次出现处立即补上中文解释。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.12-r3',
      summary: '39 节、25 条来源、53 个引用标记、核心符号、自融资恒等式、对冲估值、两类保证金、全部账本数字、5 道练习及 8 道互动全量回归通过；r1 与 r2 的准确性意见全部解决，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.12-r3',
      summary: '39 节认知坡度、零背景术语、100–110 分钟预算、8 道 prediction-first 互动、5 道练习、10 项检查、焦点与 ARIA、课程边界及审稿历史全量回归通过；全部教学意见关闭，未发现 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-11', label: '1.11 Price Discovery：信息在哪里先进入价格' },
  next: { slug: '1-13', label: '1.13 Inventory Risk 与 Quote Adjustment' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'object-map', label: '六层对象' },
    { id: 'asynchronous-arrivals', label: '异步到达' },
    { id: 'search-to-quotes', label: '搜索到报价' },
    { id: 'immediacy-service', label: '即时性服务' },
    { id: 'continuity-service', label: '连续性服务' },
    { id: 'two-sided-commitment', label: '双边承诺' },
    { id: 'functional-provider', label: '功能做市商' },
    { id: 'designated-maker', label: '指定做市商' },
    { id: 'role-boundaries', label: 'Principal / Agent' },
    { id: 'principal-balance-sheet', label: '资产负债表' },
    { id: 'quote-inventory-cycle', label: '状态循环' },
    { id: 'gross-spread-capture', label: 'Gross Capture' },
    { id: 'paired-fill-illusion', label: '配对成交错觉' },
    { id: 'per-fill-capture', label: '逐笔 Capture' },
    { id: 'self-financing-ledger', label: '自融资账本' },
    { id: 'worked-round-trip', label: '往返算例' },
    { id: 'realized-spread-bridge', label: 'Realized Spread' },
    { id: 'fees-rebates', label: 'Fees / Rebates' },
    { id: 'hedge-ledger', label: 'Hedge 账本' },
    { id: 'funding-capital-operations', label: '资金与固定投入' },
    { id: 'risk-map', label: '风险地图' },
    { id: 'inventory-risk-boundary', label: 'Inventory 边界' },
    { id: 'adverse-selection-boundary', label: '信息风险边界' },
    { id: 'operational-obligation-risk', label: '技术与义务风险' },
    { id: 'full-daily-ledger', label: '完整日度账本' },
    { id: 'accounting-economic-profit', label: '会计 / 经济利润' },
    { id: 'participation-constraint', label: '参与约束' },
    { id: 'scale-break-even', label: '规模盈亏平衡' },
    { id: 'designated-program-economics', label: '指定计划经济学' },
    { id: 'service-fragility', label: '流动性脆弱性' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'data-estimation', label: '数据与估计协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson112Content,
  references: [
    {
      id: 1,
      authors: 'Harold Demsetz',
      year: '1968',
      title: 'The Cost of Transacting',
      publication: 'Quarterly Journal of Economics, 82(1), 33–53',
      url: 'https://doi.org/10.2307/1882244',
      use: '把 quoted spread 与组织即时交易的成本联系起来；其历史制度讨论不能直接外推成现代电子市场的利润公式。',
    },
    {
      id: 2,
      authors: 'Mark B. Garman',
      year: '1976',
      title: 'Market Microstructure',
      publication: 'Journal of Financial Economics, 3(3), 257–275',
      url: 'https://doi.org/10.1016/0304-405X(76)90006-4',
      use: '用随机订单到达与 dealer inventory 解释交易连续性；Poisson 假设是建模装置，不是订单流的普遍经验定律。',
    },
    {
      id: 3,
      authors: 'Hans R. Stoll',
      year: '1978',
      title: 'The Supply of Dealer Services in Securities Markets',
      publication: 'Journal of Finance, 33(4), 1133–1151',
      url: 'https://doi.org/10.1111/j.1540-6261.1978.tb02053.x',
      use: '把做市理解为需要库存、资本和组织投入的 dealer service 供给，支持参与约束与成本边界。',
    },
    {
      id: 4,
      authors: 'Yakov Amihud & Haim Mendelson',
      year: '1980',
      title: 'Dealership Market: Market-Making with Inventory',
      publication: 'Journal of Financial Economics, 8(1), 31–53',
      url: 'https://doi.org/10.1016/0304-405X(80)90020-3',
      use: '建立 dealer 库存与报价行为的理论联系；具体最优政策依赖模型假设。',
    },
    {
      id: 5,
      authors: 'Thomas S. Y. Ho & Hans R. Stoll',
      year: '1981',
      title: 'Optimal Dealer Pricing under Transactions and Return Uncertainty',
      publication: 'Journal of Financial Economics, 9(1), 47–73',
      url: 'https://doi.org/10.1016/0304-405X(81)90020-9',
      use: '展示风险厌恶 dealer 如何在订单到达和价格不确定性下定价库存风险；不作为现代多资产 quote 的即插即用公式。',
    },
    {
      id: 6,
      authors: 'Thomas S. Y. Ho & Hans R. Stoll',
      year: '1983',
      title: 'The Dynamics of Dealer Markets Under Competition',
      publication: 'Journal of Finance, 38(4), 1053–1074',
      url: 'https://doi.org/10.1111/j.1540-6261.1983.tb02282.x',
      use: '把多个 dealer 的竞争带入动态报价，限定单一做市商模型的外推边界。',
    },
    {
      id: 7,
      authors: 'Sanford J. Grossman & Merton H. Miller',
      year: '1988',
      title: 'Liquidity and Market Structure',
      publication: 'Journal of Finance, 43(3), 617–633',
      url: 'https://doi.org/10.1111/j.1540-6261.1988.tb04594.x',
      use: '把愿意承接临时订单失衡的资本与即时性供给连接起来；不证明私人中介数量自动达到社会最优。',
    },
    {
      id: 8,
      authors: 'Thomas E. Copeland & Dan Galai',
      year: '1983',
      title: 'Information Effects on the Bid-Ask Spread',
      publication: 'Journal of Finance, 38(5), 1457–1469',
      url: 'https://doi.org/10.1111/j.1540-6261.1983.tb03834.x',
      use: '从报价被选择性执行的期权视角解释信息型交易风险。',
    },
    {
      id: 9,
      authors: 'Lawrence R. Glosten & Paul R. Milgrom',
      year: '1985',
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      publication: 'Journal of Financial Economics, 14(1), 71–100',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
      use: '说明做市商如何从成交方向更新价值信念并形成信息型 spread；模型不是知情交易占比的直接观测器。',
    },
    {
      id: 10,
      authors: 'Hans R. Stoll',
      year: '1978',
      title: 'The Pricing of Security Dealer Services: An Empirical Study of NASDAQ Stocks',
      publication: 'Journal of Finance, 33(4), 1153–1172',
      url: 'https://doi.org/10.1111/j.1540-6261.1978.tb02054.x',
      use: '提供历史 NASDAQ dealer service 的经验分解；估计值受样本和当时制度约束。',
    },
    {
      id: 11,
      authors: 'Joel Hasbrouck & George Sofianos',
      year: '1993',
      title: 'The Trades of Market Makers: An Empirical Analysis of NYSE Specialists',
      publication: 'Journal of Finance, 48(5), 1565–1593',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05121.x',
      use: '记录历史 specialist 的交易、利润与较慢库存调整；不能推出统一的日内归零规则。',
    },
    {
      id: 12,
      authors: 'Ananth Madhavan & Seymour Smidt',
      year: '1993',
      title: 'An Analysis of Changes in Specialist Inventories and Quotations',
      publication: 'Journal of Finance, 48(5), 1595–1628',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05122.x',
      use: '在 1987 年 16 只股票、一个 firm 的样本中估计 specialist 库存与报价调整；半衰期结果严格限于该设计。',
    },
    {
      id: 13,
      authors: 'Roger D. Huang & Hans R. Stoll',
      year: '1997',
      title: 'The Components of the Bid–Ask Spread: A General Approach',
      publication: 'Review of Financial Studies, 10(4), 995–1034',
      url: 'https://doi.org/10.1093/rfs/10.4.995',
      use: '提供 spread component 的联合估计框架；文中比例是特定规格与样本结果，不是普遍参数。',
    },
    {
      id: 14,
      authors: 'Carole Comerton-Forde, Terrence Hendershott, Charles M. Jones, Pamela C. Moulton & Mark S. Seasholes',
      year: '2010',
      title: 'Time Variation in Liquidity: The Role of Market-Maker Inventories and Revenues',
      publication: 'Journal of Finance, 65(1), 295–331',
      url: 'https://doi.org/10.1111/j.1540-6261.2009.01530.x',
      use: '把 market-maker inventories、revenues 与流动性时间变化联系起来；不提供跨市场固定资本系数。',
    },
    {
      id: 15,
      authors: 'Albert J. Menkveld',
      year: '2013',
      title: 'High Frequency Trading and the New-Market Makers',
      publication: 'Journal of Financial Markets, 16(4), 712–740',
      url: 'https://doi.org/10.1016/j.finmar.2013.06.006',
      use: '展示一个跨市场 HFT 做市者的参与、被动成交、spread revenue 与库存损失；个案数字不代表所有 HFT。',
    },
    {
      id: 16,
      authors: 'Terrence Hendershott & Albert J. Menkveld',
      year: '2014',
      title: 'Price Pressures',
      publication: 'Journal of Financial Economics, 114(3), 405–423',
      url: 'https://doi.org/10.1016/j.jfineco.2014.08.001',
      use: '估计历史 NYSE 中介库存与暂时价格压力；49 bp 与 0.92 日属于其 1994–2005 样本和模型。',
    },
    {
      id: 17,
      authors: 'Joint CFTC–SEC Staff',
      year: '2010',
      accessedAt: '2026-08-28',
      title: 'Findings Regarding the Market Events of May 6, 2010',
      publication: 'U.S. Commodity Futures Trading Commission & U.S. Securities and Exchange Commission, Official Staff Report',
      url: 'https://www.cftc.gov/sites/default/files/idc/groups/public/%40otherif/documents/ifdocs/staff-findings050610.pdf',
      use: '记录极端事件中部分流动性提供者扩大 spread、减少或停止交易；不支持“所有做市者退出”或 HFT 单因叙事。',
    },
    {
      id: 18,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2002',
      accessedAt: '2026-08-28',
      title: 'Commission Guidance on the Application of Certain Provisions of the Securities Act of 1933, the Securities Exchange Act of 1934, and Rules Thereunder to Trading in Security Futures Products',
      publication: 'SEC Official Guidance',
      url: 'https://www.sec.gov/rules-regulations/2002/06/commission-guidance-application-certain-provisions-securities-act-1933-securities-exchange-act-1934',
      use: '提供美国证券语境中 broker/dealer 与自营交易活动的官方分类背景；不能替代个案法律判断。',
    },
    {
      id: 19,
      authors: 'New York Stock Exchange',
      year: 'current rulebook',
      accessedAt: '2026-08-28',
      title: 'NYSE Rule 104: Dealings and Responsibilities of DMMs',
      publication: 'NYSE Rules, Official Rulebook',
      url: 'https://www.nyse.com/publicdocs/nyse/regulation/nyse/NYSE_Rules.pdf',
      use: '核验 NYSE DMM 的本地职责与适用边界；不得外推为其他场所或未来版本的统一义务。',
    },
    {
      id: 20,
      authors: 'The Nasdaq Stock Market',
      year: 'current rulebook',
      accessedAt: '2026-08-28',
      title: 'Nasdaq Equity 2, Sections 4–5 and 10',
      publication: 'Nasdaq Official Rulebook',
      url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/nasdaq-equity-2',
      use: '核验 Nasdaq market-maker registration、quoting 与相关职责；阈值和例外必须按适用版本读取。',
    },
    {
      id: 21,
      authors: 'Cboe EDGX Exchange',
      year: 'current rulebook',
      accessedAt: '2026-08-28',
      title: 'EDGX Options Rules 22.5–22.6',
      publication: 'Cboe EDGX Official Rulebook',
      url: 'https://cdn.cboe.com/resources/regulation/rule_book/EDGX_Rulebook.pdf',
      use: '核验期权 market maker 的本地注册与持续报价框架；不可概括为所有市场的无限双边义务。',
    },
    {
      id: 22,
      authors: 'European Parliament & Council of the European Union',
      year: '2014',
      accessedAt: '2026-08-28',
      title: 'Directive 2014/65/EU (MiFID II), Article 17(3)',
      publication: 'Official Journal of the European Union',
      url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A32014L0065',
      use: '规定特定算法做市策略的协议与连续性框架；解释须结合适用主体、时段与后续技术标准。',
    },
    {
      id: 23,
      authors: 'European Commission',
      year: '2017',
      accessedAt: '2026-08-28',
      title: 'Commission Delegated Regulation (EU) 2017/578 (RTS 8)',
      publication: 'Official Journal of the European Union',
      url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32017R0578',
      use: '细化 market-making agreements、schemes 与 exceptional circumstances；只支持欧盟适用范围内的版本化制度陈述。',
    },
    {
      id: 24,
      authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen',
      year: '2009',
      title: 'Market Liquidity and Funding Liquidity',
      publication: 'Review of Financial Studies, 22(6), 2201–2238',
      url: 'https://doi.org/10.1093/rfs/hhn098',
      use: '建立融资约束、保证金与市场流动性相互强化的理论机制；不能单独解释任何一场现实危机。',
    },
    {
      id: 25,
      authors: 'U.S. Securities and Exchange Commission',
      year: 'current guidance',
      accessedAt: '2026-08-28',
      title: 'Guide to Broker-Dealer Registration',
      publication: 'SEC Division of Trading and Markets Compliance Guide',
      url: 'https://www.sec.gov/about/divisions-offices/division-trading-markets/division-trading-markets-compliance-guides/guide-broker-dealer-registration',
      use: '以 Exchange Act 定义说明美国证券语境下 broker、dealer 与 trader exception 的一般边界；个案仍需结合具体活动判断。',
    },
  ],
  readingList: [
    {
      title: 'Demsetz (1968), The Cost of Transacting',
      scope: '全文，重点读 spread 作为组织即时交易成本的论证与历史制度背景',
      reason: '建立“即时性有价格”的最早直觉，同时练习把历史制度与现代机制分开。',
      url: 'https://doi.org/10.2307/1882244',
    },
    {
      title: 'Garman (1976), Market Microstructure',
      scope: '订单到达、dealer inventory 与交易连续性相关部分',
      reason: '从异步订单流严格推出为什么必须有库存缓冲，并识别可解假设的边界。',
      url: 'https://doi.org/10.1016/0304-405X(76)90006-4',
    },
    {
      title: 'Stoll (1978), The Supply of Dealer Services in Securities Markets',
      scope: '全文，重点读 dealer service 的供给、成本与均衡',
      reason: '把 spread 从价格距离转成一项由资本与组织生产的服务。',
      url: 'https://doi.org/10.1111/j.1540-6261.1978.tb02053.x',
    },
    {
      title: 'Grossman & Miller (1988), Liquidity and Market Structure',
      scope: '全文，重点读临时订单失衡、即时性资本和中介进入',
      reason: '最直接回答“为何即使最终买卖双方都存在，仍需要做市中介”。',
      url: 'https://doi.org/10.1111/j.1540-6261.1988.tb04594.x',
    },
    {
      title: 'Brunnermeier & Pedersen (2009), Market Liquidity and Funding Liquidity',
      scope: '融资约束、margin 与市场流动性螺旋的理论部分',
      reason: '把正常期做市参与约束扩展到压力状态，并理解多个中介同步收缩为何形成反馈。',
      url: 'https://doi.org/10.1093/rfs/hhn098',
    },
    {
      title: 'Ho & Stoll (1981), Optimal Dealer Pricing under Transactions and Return Uncertainty',
      scope: '模型设定、dealer objective 与 comparative statics；公式推导可作为进阶',
      reason: '为 1.13 的库存依赖报价建立正式桥梁，但先保留模型假设意识。',
      url: 'https://doi.org/10.1016/0304-405X(81)90020-9',
    },
    {
      title: 'Glosten & Milgrom (1985), Bid, Ask and Transaction Prices',
      scope: '序贯交易、belief update 与 spread 形成部分',
      reason: '理解为什么报价会被更有信息的交易者选择，以及信息风险如何吞噬 entry capture。',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
    },
    {
      title: 'Huang & Stoll (1997), The Components of the Bid–Ask Spread',
      scope: '模型、识别与经验结果，特别注意 specification dependence',
      reason: '学习把 order processing、inventory 与 information component 变成可估计对象，同时避免把比例当常数。',
      url: 'https://doi.org/10.1093/rfs/10.4.995',
    },
    {
      title: 'Hasbrouck & Sofianos (1993), The Trades of Market Makers',
      scope: '库存路径、交易利润和调整速度的经验部分',
      reason: '用真实历史 dealer 数据修正“库存必须日内归零”的直觉。',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05121.x',
    },
    {
      title: 'Menkveld (2013), High Frequency Trading and the New-Market Makers',
      scope: '市场结构、个案识别、spread revenue、inventory 与 capital cost',
      reason: '观察电子化做市怎样跨市场组织，同时训练个案结果不向所有 HFT 外推。',
      url: 'https://doi.org/10.1016/j.finmar.2013.06.006',
    },
    {
      title: 'Official market-maker rule bundle and May 6, 2010 staff report',
      scope: 'NYSE Rule 104、Nasdaq Equity 2、Cboe EDGX Options 22.5–22.6、MiFID II 17(3)、RTS 8，以及联合 CFTC–SEC 报告的流动性部分',
      reason: '把“正式身份、义务、例外、激励和压力行为”从抽象标签还原为可核验的制度文本。',
      url: 'https://www.nyse.com/publicdocs/nyse/regulation/nyse/NYSE_Rules.pdf',
    },
  ],
};
