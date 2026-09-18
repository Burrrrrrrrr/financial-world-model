import ArchitectureComparator from '../components/ArchitectureComparator';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson102Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>市场架构不是交易发生的背景，而是把交易意图变成价格、成交与风险分配的规则机器。</h2>
        <p>
          两位投资者即使拥有完全相同的买卖意愿，只要把它们放进不同市场架构，结果就可能不同。
          在公开订单簿里，买单会按规则与存量卖单匹配；在交易商市场里，客户先向愿意使用自己资产负债表的中介询价；
          在经纪撮合市场里，经纪商寻找自然对手方；在集合竞价里，订单先被暂时汇集，再以一个统一价格集中成交。
          因此，架构会决定谁先看见交易意图、谁承担库存、谁有权报价、什么信息公开、交易何时发生，以及失败时风险停在哪里。
        </p>
        <p>
          市场微观结构把潜在交易需求如何转化为价格和成交量作为核心问题；市场架构就是这条转化链中的制度函数。
          Madhavan 的综述与早期交易机制研究都强调，交易规则并非中性的管道：它会改变信息揭示、流动性、交易成本和价格形成。<Cite n={1} /><Cite n={4} />
          本节的中心问题因而不是“哪一种市场最高级”，而是：<strong>给定资产和交易意图的特征，某套架构把什么优势放大，又把什么成本转移给谁？</strong>
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把 order-driven、dealer、brokered、continuous、call、exchange 与 OTC 放回不同分类轴，不再把它们当成互斥市场名称。</li>
            <li>沿着一笔交易的路径指出：谁提供即时性、价格如何形成、哪些信息向谁公开、库存与信用风险由谁先承担。</li>
            <li>面对陌生市场时，用资产标准化程度、交易规模、频率、紧迫度、信息敏感度与信用约束解释其架构，而不是只凭“场内/场外”贴标签。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节的边界</span>
          <p>
            本节只建立市场架构的总地图。具体订单类型留给 1.03，限价订单簿内部结构留给 1.04，开收盘集合竞价的规则与价格发现留给 1.17，
            一般清算、中央对手方和结算风险留给后续基础设施单元；1.19 只在卖空链条中处理借券交付、FTD 与 close-out 的局部接口。这里会指出这些层之间的接口，但不提前压缩成一节。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="machine">
        <p className="section-kicker">01 · 把市场理解成映射函数</p>
        <h2>交易所不是一栋楼，也不是替所有人决定价格的单一主体</h2>
        <p>
          日常语言中的“交易所”经常同时指一家法律实体、一套电子系统、一个交易场所和整个市场。
          为了理解机制，我们需要把它拆开：投资者或机构形成交易意图；经纪商、会员或直接参与者把意图转成合格消息；
          交易场所依据准入、透明度、优先级和时间规则组织互动；成交后，报告系统传播交易信息；清算和结算基础设施再处理履约。
          这些环节可以由同一集团运营，也可能属于不同机构，不能因为品牌相同就视为一个功能。
          Harris 与 O&apos;Hara 分别从交易实践和微观结构理论说明了这些角色与制度接口为何必须分开识别。<Cite n={2} /><Cite n={3} />
        </p>
        <div className="market-stack">
          <article><span>01</span><b>意图与订单管理</b><p>投资者目标、经纪商风控、订单拆分与路由决定什么消息真正进入市场。</p></article>
          <article><span>02</span><b>交易与执行</b><p>订单簿、交易商报价、询价或经纪搜索决定谁与谁、何时、以何价格成交。</p></article>
          <article><span>03</span><b>成交报告与市场数据</b><p>报价和成交何时向谁披露，决定其他参与者能够从市场中学习什么。</p></article>
          <article><span>04</span><b>清算与结算</b><p>成交成立后，中央对手方、存管与结算系统管理履约、交付和最终性。</p></article>
        </div>
        <p>
          CPSS–IOSCO（CPSS 后更名为 CPMI）对金融市场基础设施的定义明确区分中央对手方、证券结算系统、中央证券存管和交易信息库等功能。<Cite n={14} />
          所以“在交易所成交”不自动回答谁承担结算对手风险；同样，“TRACE 有债券成交数据”也不表示 TRACE 是撮合债券的交易所。
        </p>
        <div className="equation-card">
          <span>市场架构作为制度映射 · 概念表达</span>
          <div>Y<sub>t</sub> = 𝓜(H<sub>t</sub>; R, A, τ, Θ)</div>
          <p>
            H<sub>t</sub> 是截至 t 时刻进入系统的订单、报价、撤单和询价历史；R 是匹配与优先规则，A 是谁可以接入，
            τ 是连续还是批量处理的时间结构，Θ 是参与者能够观察的信息。输出 Y<sub>t</sub> 包括成交价格、数量、等待时间、未成交订单和公开数据。
            这不是用于估计参数的结构模型，而是一项思维纪律：观察到同样的交易意图，也必须先知道 𝓜 才能推断结果。
          </p>
        </div>
      </section>

      <section className="lesson-section" id="axes">
        <p className="section-kicker">02 · 先纠正分类方式</p>
        <h2>常见市场名称混合了不同设计轴，现实架构因此经常是“同时成立”</h2>
        <p>
          “订单驱动市场、交易商市场、拍卖市场、连续市场、场内市场、场外市场”听起来像六个互斥选项，实际上并不处在同一层。
          order-driven 与 dealer-driven 主要描述谁提交可执行价格、谁先提供流动性；continuous 与 call 描述订单在时间上逐笔还是批量处理；
          exchange 与 OTC 描述组织与监管关系；lit（成交前显示交易兴趣）与 dark（成交前不向公众显示交易兴趣）描述成交前透明度。
          一个市场完全可以同时是订单驱动、连续、电子、匿名且多场所碎片化。
        </p>
        <div className="table-scroll" role="region" aria-label="市场架构六个分类轴，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>不要用一个标签替代六个不同问题</caption>
            <thead><tr><th scope="col">设计轴</th><th scope="col">端点示例</th><th scope="col">它真正决定什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">价格与流动性来源</th><td>订单驱动 ↔ 交易商驱动 ↔ 经纪搜索</td><td>谁公开或双边承诺可执行价格，谁先承担库存或搜索成本。</td></tr>
              <tr><th scope="row">时间组织</th><td>连续逐笔 ↔ 定时集合 ↔ 高频批量</td><td>订单按到达顺序竞争，还是先等待并在同一批次竞争价格。</td></tr>
              <tr><th scope="row">场所组织</th><td>集中 ↔ 多场所碎片化 ↔ 双边 OTC</td><td>交易意图在哪里相遇，是否需要路由和跨场所价格连接。</td></tr>
              <tr><th scope="row">成交前透明度</th><td>完全显示 ↔ 部分隐藏 ↔ 仅受邀询价</td><td>谁能在成交前看到方向、价格、数量与身份。</td></tr>
              <tr><th scope="row">身份与关系</th><td>匿名 ↔ 对手方披露 ↔ 关系型交易</td><td>信用、信息泄露和关系资本是否进入报价。</td></tr>
              <tr><th scope="row">中介角色</th><td>代理 Agent ↔ 自营 Principal</td><td>中介只是替客户寻找交易，还是先用自己的资产负债表成为对手方。</td></tr>
            </tbody>
          </table>
        </div>
        <aside className="precision-note">
          <span>Auction 的术语陷阱</span>
          <p>
            英文文献有时把让多方订单直接竞争的订单驱动市场统称 auction market，于是 continuous double auction 也是一种“拍卖”；
            另一些语境中的 auction 专指 call auction，即先收集订单再集中清算。看到 auction 时必须继续问：订单是逐笔连续匹配，还是按批次统一定价？
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="order-driven">
        <p className="section-kicker">03 · 订单驱动市场</p>
        <h2>交易场所组织订单竞争，但可执行流动性来自提交订单的人</h2>
        <p>
          在订单驱动市场中，参与者提交愿意买卖的价格和数量，交易系统把兼容订单按预先公开的规则匹配。
          交易所的核心作用是验证消息、维护优先级并执行算法，而不是必然用自己的资本站在每笔交易另一边。
          提供限价订单的人可能是普通投资者、基金、专营做市商或高速交易公司；“订单驱动”描述制度接口，不表示市场里没有 dealer 或 market maker。
        </p>
        <p>
          公开中央限价订单簿（central limit order book，CLOB）的优势是把多方交易意愿放进相对统一的价格竞争，参与者不必先找到指定交易商。
          Glosten 的经典模型研究了开放电子限价订单簿如何形成价格阶梯、价差和流动性供给。<Cite n={5} />
          但订单簿不是免费的公共品：挂单者承担被知情交易者选择、排队等待、撤单失败和价格变化风险；大额投资者公开展示完整规模还可能先暴露意图。
        </p>
        <div className="mechanism-chain" aria-label="订单驱动市场的价格形成链">
          {[
            ['多方提交消息', '买卖、价格、数量、时间与可见性'],
            ['两层验证', '会员检查客户余额与风控；场所检查接入、格式、价格范围与申报资格'],
            ['规则排序', '价格优先及场所规定的同价分配'],
            ['订单相遇', '可成交消息与存量对手方匹配'],
            ['更新市场状态', '成交、剩余量、bid、ask 与深度'],
            ['其他主体反应', '补单、撤单、路由与重新估值'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          沪深交易所 2026 年交易规则提供了现行实例：股票竞价交易的主流程都同时采用开收盘集合竞价与盘中连续竞价，并按价格优先、时间优先组织订单。<Cite n={8} /><Cite n={16} />
          这个例子本身就证明“订单驱动”不是“连续交易”的同义词——同一交易所可以在开收盘按批次集中清算，在盘中逐笔连续匹配。
          但两所集合竞价的最终并列处理并不完全相同，A 股还存在大宗交易、盘后定价和特定板块做市等接口；因此“订单驱动”只是竞价主流程的机制概括，不能覆盖全部交易路径。
        </p>
      </section>

      <section className="lesson-section" id="dealer">
        <p className="section-kicker">04 · 交易商与询价市场</p>
        <h2>即时性来自交易商愿意先接住风险，而不是来自一张完整公开的订单簿</h2>
        <p>
          dealer 以自营主体身份成为客户对手方：客户想卖时，dealer 可以先买入库存；客户想买时，dealer 可以从库存卖出或先承诺再对冲。
          因而，交易商市场的核心资产不是撮合算法，而是资本、库存管理、信用关系、定价能力与寻找对冲的网络。
          客户支付的价差不仅补偿操作成本，还可能包含库存风险、逆向选择、融资、对冲困难和特定规模的资本占用。
        </p>
        <div className="dealer-chain">
          <article><span>客户需要即时交易</span><b>不等待自然对手方出现</b><p>交易紧迫度越高，越重视现在能够成交多少，而不只是屏幕参考价。</p></article>
          <article><span>交易商用资产负债表承接</span><b>先成为 principal</b><p>报价前要评估库存、信用、客户信息与后续对冲成本。</p></article>
          <article><span>风险被重新分发</span><b>内部化、对冲或转卖</b><p>dealer 可能等待反向客户流，也可能到其他 dealer、订单簿或衍生品市场对冲。</p></article>
        </div>
        <p>
          RFQ（request for quote，询价）是交易协议，不是与 dealer market 完全等同的资产类别。客户可以只问一家交易商，也可以让多家 dealer 同时竞争；
          报价可以通过电话、聊天系统、单交易商平台或多交易商电子平台返回。电子化也不等于订单驱动：如果可执行价格仍由 dealer 针对询价作出，
          经济机制依旧以交易商资本为中心。
        </p>
        <div className="equation-card dealer-quote-equation">
          <span>把库存偏斜与交易补偿分开 · 教学分解</span>
          <div>
            m<sub>d</sub> = P<sub>reference</sub> + s<sub>inventory</sub><br />
            bid<sub>d</sub> = m<sub>d</sub> − h<sub>bid</sub>　；　ask<sub>d</sub> = m<sub>d</sub> + h<sub>ask</sub>
          </div>
          <p>
            m<sub>d</sub> 是 dealer 自己的报价中心：库存过多时，它可能通过有符号的 s<sub>inventory</sub> 把买卖报价一起向下移动，以鼓励客户买走库存；库存不足时则可能向上移动。
            客户把资产卖给 dealer 时成交在 dealer bid，客户从 dealer 买入时成交在 dealer ask。h<sub>bid</sub> 与 h<sub>ask</sub> 是两侧分别要求的补偿幅度，均不小于零，
            会随规模、对冲困难、资本占用、信用和信息风险而改变。可内部匹配的反向客户流降低的是所需补偿，不是把某项真实成本机械变成负数。这是机制图，不是可从账簿直接读出的定价恒等式。
          </p>
        </div>
        <p>
          多 dealer RFQ 还包含一组结构性权衡：询问更多 dealer 往往扩大报价竞争，却也让更多潜在对手知道方向和规模。
          Hendershott 与 Madhavan 对电子公司债询价的研究把这种协议解释为双边搜索与连续订单簿之间的折中；其经验背景不能外推到所有产品，但“竞争集合扩大—意图暴露扩大”的机制具有一般诊断价值。<Cite n={18} />
        </p>
        <p>
          交易商架构常见于交易频率较低、单笔规模较大、合约条款复杂或信用关系重要的市场，但不能把它概括为“落后、人工、不透明”。
          BIS 对外汇市场的研究显示，现代 OTC 外汇同时存在双边交易商流、电子 RFQ、单交易商平台和匿名订单簿；技术升级改变接口，却没有消除信用、库存与分层流动性。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="brokered">
        <p className="section-kicker">05 · 经纪撮合市场</p>
        <h2>broker 帮助找到对手方；dealer 则先用自己的资本成为对手方</h2>
        <p>
          经纪商与交易商最容易在中文语境中混淆。纯代理 broker 代表客户搜索、沟通和谈判，赚取佣金或服务费，但不必把交易先放进自己的资产负债表；
          dealer 以 principal 身份买入或卖出，直接承担库存与价格风险。现实大型机构可能同时拥有两种业务，判断一笔交易时必须问它在该笔成交中扮演什么法律和经济角色。
        </p>
        <div className="table-scroll" role="region" aria-label="订单簿、交易商与经纪撮合角色对照表，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix role-table">
            <caption>三种互动机制并不只是“有没有中介”的区别</caption>
            <thead><tr><th scope="col">机制</th><th scope="col">谁先提供另一侧</th><th scope="col">主要成本</th><th scope="col">典型约束</th></tr></thead>
            <tbody>
              <tr><th scope="row">公开订单簿</th><td>已经挂单的市场参与者</td><td>spread、排队、冲击与信息泄露</td><td>标准化、可自动匹配、足够参与密度</td></tr>
              <tr><th scope="row">交易商 / RFQ</th><td>用资本报价的 dealer</td><td>dealer markup、库存与信用补偿</td><td>交易商资本、对冲能力和报价竞争</td></tr>
              <tr><th scope="row">经纪搜索</th><td>最终找到的自然对手方</td><td>等待、佣金、谈判和泄露风险</td><td>对手方是否存在及 broker 网络质量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          经纪搜索特别适合大宗或非标准交易：把十万股完整扔进公开订单簿可能先推动价格，而 broker 可以低调寻找恰好想买入的大型机构。
          但“隐藏”并不等于没有信息成本。询问更多潜在对手方会提高找到好价格的概率，也会让更多人知道市场上存在一个大卖家；
          搜索时间越长，基本面与整体市场还可能先变化。这里没有免费的最佳执行，只有搜索广度、速度和保密性之间的交换。
        </p>
      </section>

      <section className="lesson-section" id="time">
        <p className="section-kicker">06 · 时间也是市场设计变量</p>
        <h2>连续市场用顺序换即时性；集合市场用等待换订单聚合</h2>
        <p>
          连续交易把新订单立即与现有状态比较，谁先到达、谁先修改就可能获得不同队列位置。它提供较强即时性和持续价格信号，
          但同一瞬间本来想竞争的订单会被人为排成先后；极短延迟因此可能具有经济价值。集合竞价则让订单等待到指定时点，
          把同一批订单放在统一价格规则下竞争，减少顺序的重要性，却牺牲等待期间的执行机会。
        </p>
        <aside className="contrast-card">
          <div><span>Continuous</span><b>立即处理、逐笔更新</b><p>优势是即时性；代价是队列、速度竞争和薄时点流动性。</p></div>
          <div><span>Call / Batch</span><b>先积累、再统一处理</b><p>优势是聚合同时意愿；代价是等待、失衡与批次间价格风险。</p></div>
        </aside>
        <div className="equation-card">
          <span>集合竞价的第一层规则 · 先限定可比较价格</span>
          <div>Q(p) = min[D(p), S(p)]　；　p* ∈ arg max<sub>p∈𝒫</sub> Q(p)</div>
          <p>
            D(p) 是愿意在价格 p 或更高价格买入的累计数量，S(p) 是愿意在 p 或更低价格卖出的累计数量；两者较小值就是该候选价最多能配对的数量。
            𝒫 不是任意连续价格，而是场所规则允许进入比较的有效申报价格集合。最大化 Q(p) 还不是完整算法：更优价订单必须全部成交，成交价上的买方或卖方至少一侧必须全部成交；
            若多个申报价格仍同时合格，还要应用交易所各自的并列处理规则。公式只把共同的第一步显式化，不能替代规则文本。
          </p>
        </div>
        <div className="worked-example compact architecture-rule-example">
          <span>规则反事实 · 相同订单不保证相同开盘价</span>
          <p>
            仅有两笔申报：买入 1,000 股、限价 10.02 元；卖出 1,000 股、限价 10.00 元。先区分“申报候选价”和“最后算出的成交价”：
            10.00 与 10.02 是进入规则比较的两档申报价；10.01 虽然在经济上位于双方可接受区间内，却不是新增的一笔申报，它只可能在最后的中间价步骤中产生。
          </p>
          <div className="table-scroll" role="region" aria-label="集合竞价两档申报价的配对结果，可横向滚动" tabIndex={0}>
            <table className="auction-table architecture-auction-table">
              <caption>教学计算：10.01 行只显示区间内任意价格也能机械配对，并非把它加入初始申报候选集合</caption>
              <thead><tr><th scope="col">价格 p</th><th scope="col">初始申报候选</th><th scope="col">D(p)</th><th scope="col">S(p)</th><th scope="col">Q(p)</th><th scope="col">规则角色</th></tr></thead>
              <tbody>
                <tr><th scope="row">10.00</th><td>是 · 卖方申报价</td><td>1,000</td><td>1,000</td><td>1,000</td><td>进入两所并列筛选</td></tr>
                <tr><th scope="row">10.01</th><td>否</td><td>1,000</td><td>1,000</td><td>1,000</td><td>可由上交所最终中间价步骤产生</td></tr>
                <tr><th scope="row">10.02</th><td>是 · 买方申报价</td><td>1,000</td><td>1,000</td><td>1,000</td><td>进入两所并列筛选</td></tr>
              </tbody>
            </table>
          </div>
          <p>
            上交所先比较两档合格申报价的未成交量；两者都为零，仍并列，于是取中间值 10.01 元。
            深交所先比较“该价以上买入累计量”与“该价以下卖出累计量”之差：在 10.00 元时为 |1,000−0|=1,000，在 10.02 元时为 |0−1,000|=1,000；
            差值仍相等，开盘时才选择更接近前收盘价的候选价。若前收盘价为 9.99 元，结果为 10.00 元。<Cite n={8} /><Cite n={16} />
            数值答案不同，不是因为某一所“算错”，而是完整的候选集合、资格条件和破除并列规则共同构成制度映射。1.17 会再系统推导集合竞价，本节只借它证明这一点。
          </p>
        </div>
        <p>
          Budish、Cramton 与 Shim 把连续时间本身视为可改变的制度选择，并提出高频批量竞价来让订单在离散时间内按价格而非极短速度竞争。<Cite n={7} />
          这是一项影响深远但依赖模型与实施条件的设计主张，不意味着所有资产都应改成相同批次长度；它最重要的启发是：
          当速度竞赛出现时，不要只责怪参与者“太快”，还要追问规则为什么奖励这种行为。
        </p>
      </section>

      <section className="lesson-section" id="hybrid">
        <p className="section-kicker">07 · 混合与分层市场</p>
        <h2>现实资产通常没有唯一架构，而是在多个协议、场所和中介层之间流动</h2>
        <p>
          纯粹分类适合建立因果机制，现实市场则倾向混合。NYSE 把高速电子交易、交易大厅、指定做市商（Designated Market Maker，DMM）和代表客户在场内执行的 floor broker 组合在同一市场模型中，
          并用 parity/priority 规则让同一最优价上的特定场内与电子流动性按制度分享或优先获得成交。<Cite n={9} /> 这不是“人工市场与电子市场二选一”，
          而是把电子匹配、指定流动性责任和人工判断分配到不同状态。
        </p>
        <p>
          Nasdaq 则提醒我们不要让历史标签替代现行规则。它早期以 dealer market 闻名，但当前 Nasdaq Book 按 price/display/time 等规则处理订单，
          做市商报价进入系统后也作为可归属订单参与共同撮合。<Cite n={17} /> 因而“有注册做市商”并不自动等于 quote-driven；必须继续问做市商是双边面对客户报价，还是把报价提交到统一订单竞争机制。
        </p>
        <p>
          美国股票订单还可能被路由到国家证券交易所、另类交易系统，或由 internalizer——以自有账户在内部承接客户订单、而不先送往公开场所的 broker-dealer——执行；
          SEC 的现行 Rule 605 指引把这些主体都放入 market center 的执行质量框架，并明确不同场所规则会影响执行结果。<Cite n={10} /><Cite n={15} />
          所以一张股票代码只有一个“全国价格”的直觉并不完整：价格连接需要数据、路由和监管规则，流动性本身分布在多个中心。
        </p>
        <p>
          外汇更能显示分层结构。BIS 的研究将其描述为去中心化、碎片化的 OTC 市场，同时存在 dealer-customer 与 inter-dealer 层、
          匿名中央限价订单簿（CLOB）、披露身份的 RFQ、单一交易商平台以及语音交易。2025 年调查显示，电子交易约占总体的 59%，dealer 还在内部流动性池中匹配超过 80% 的客户交易。<Cite n={13} />
          这些数字描述调查口径下的全球 FX 执行结构，不能外推成每个币种、产品和客户群的固定比例。
        </p>
        <div className="system-insight">
          <span>ARCHITECTURE AS A NETWORK</span>
          <p>客户订单 → 经纪商路由 → 公开订单簿 / 暗池 / internalizer / dealer RFQ → 对冲到其他现货或衍生品场所 → 成交数据返回公共市场</p>
          <strong>架构的真实单位往往不是单一 venue，而是相互连接的执行网络。</strong>
        </div>
      </section>

      <section className="lesson-section" id="transparency">
        <p className="section-kicker">08 · 透明度与匿名性</p>
        <h2>更多信息可以改善竞争，也可能让大额交易者在成交前先被市场识别</h2>
        <p>
          成交前透明度回答谁能看到报价、深度、询价和订单失衡；成交后透明度回答成交价格、规模和时间何时向谁报告。
          两者不能混为“市场是否透明”。一个债券市场可以在成交前主要通过私下 RFQ 定价，却在成交后把交易报告给公共系统；
          一个暗池可以隐藏成交前订单，但成交后仍按监管要求报告。
        </p>
        <p>
          Pagano 与 Röell 在几种风格化 auction 与 dealer 模型中比较透明度，得到的结论不是“越透明永远越好”，而是更高透明度平均降低无信息交易者成本，
          但不保证对每种交易规模都有相同效果。<Cite n={6} /> 对小额客户，更多公开价格通常便于比较；对准备出售巨大头寸的机构，过早公开方向与规模可能使其他人先撤单或下调报价。
        </p>
        <div className="transparency-grid">
          <article><span>成交前公开</span><b>增强价格竞争</b><p>参与者更容易比较 bid、ask 与深度，但大单意图更容易被推断。</p></article>
          <article><span>成交前限制披露</span><b>保护搜索与大单</b><p>减少公开冲击，却增加双边信息不对称和报价比较成本。</p></article>
          <article><span>成交后报告</span><b>形成公共历史</b><p>帮助估价和监督，但披露速度与规模上限仍可能影响 dealer 风险。</p></article>
        </div>
        <p>
          FINRA 的 TRACE 是这个区分的现实例子：它收集并传播合格 OTC 固定收益交易的价格、规模等成交信息，但没有撮合或接受报价的执行功能。<Cite n={11} />
          “能查到成交”不等于“成交发生在公开交易所”，理解数据来源时必须先区分 execution venue 与 reporting facility。
        </p>
      </section>

      <section className="lesson-section" id="same-order">
        <p className="section-kicker">09 · 同一笔交易意图的四种命运</p>
        <h2>“卖出十万股”不是完整策略；执行结果取决于它被送进哪一种互动机制</h2>
        <p>
          假设一家机构必须在今天出售十万股，而当前公开订单簿最优买价只显示一万股。基本面判断和总规模保持不变，
          我们只改变架构。下面不是预测某条路径必然最好，而是列出每条路径把成本放在哪里。
        </p>
        <div className="same-order-grid">
          <article><span>公开连续订单簿</span><b>立即扫单或拆分执行</b><p>价格竞争可见、执行可自动化；完整扫单可能产生冲击，拆单则增加时间与被识别风险。</p></article>
          <article><span>单家 / 多家 dealer RFQ</span><b>用报价换资产负债表即时性</b><p>可能一次成交更大规模，但 dealer 会把库存、对冲与信息风险写入报价。</p></article>
          <article><span>经纪搜索自然对手方</span><b>用等待换潜在低冲击</b><p>若找到恰好想买的机构，可能减少公开冲击；找不到就会延误且泄露意图。</p></article>
          <article><span>等待集合竞价</span><b>与同一时点的大量订单竞争</b><p>统一价格减少先后顺序作用，但卖方失衡仍可能让部分数量无法成交。</p></article>
        </div>
        <p>
          真正的执行策略经常组合多条路径：先用暗盘或 broker 寻找大额对手，再把剩余数量交给算法在订单簿执行；
          或由 dealer 承接客户后，dealer 自己再分散到期货、ETF 与现货市场对冲。观察到最终一笔成交，不能把中间风险转移链省略掉。
        </p>
      </section>

      <ArchitectureComparator />

      <section className="lesson-section" id="fit">
        <p className="section-kicker">11 · 为什么不存在对所有交易都最优的架构</p>
        <h2>架构优劣取决于它要解决的摩擦，而不是取决于“电子化程度”</h2>
        <p>
          一套架构若想让所有订单公开竞争，需要合约足够标准化、参与者足够多、信用与结算关系能够被统一处理；
          若资产极少交易或条款高度定制，公开订单簿可能只剩空壳。相反，dealer 可以定制条款并承接大单，却会引入资本约束和报价不透明；
          broker 能搜索自然对手方，却牺牲即时性。评价架构必须从需要解决的摩擦出发。
        </p>
        <div className="fit-grid">
          <article><span>标准化程度</span><b>订单能否互换</b><p>同一代码、单位和结算条件越统一，自动多边匹配越可行。</p></article>
          <article><span>参与频率与密度</span><b>对手方是否持续出现</b><p>高频小额流适合连续簿；低频大额流更依赖 dealer 或搜索。</p></article>
          <article><span>规模与紧迫度</span><b>等不等得起</b><p>立即执行需要消耗存量流动性；等待可换取更多对手方和更少冲击。</p></article>
          <article><span>信息敏感度</span><b>公开会否先改变市场</b><p>意图越容易传递私人信息，大单越重视匿名、隐藏和分阶段执行。</p></article>
          <article><span>信用与定制</span><b>价格之外还有什么条款</b><p>对手信用、抵押品、期限和法律条款可能使双边关系不可被一个价格替代。</p></article>
          <article><span>系统与监管目标</span><b>谁承担外部性</b><p>竞争、透明、韧性、最佳执行与公平接入可能彼此冲突，需要制度取舍。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="failures">
        <p className="section-kicker">12 · 每种架构都有自己的失败模式</p>
        <h2>平静时期的流动性来源，往往就是压力时期的脆弱点</h2>
        <div className="edge-list">
          <article><span>订单簿变薄</span><h3>公开不等于有深度</h3><p>挂单者同时撤回时，自动市场仍在运行，却可能几乎没有可执行数量。</p></article>
          <article><span>dealer 收缩资产负债表</span><h3>报价还在，规模消失</h3><p>融资、库存或风险限额收紧会让价差扩大，甚至只剩参考性的指示价，而非承诺可按给定条件成交的 firm quote。</p></article>
          <article><span>经纪搜索失败</span><h3>保密与成交不可兼得</h3><p>扩大询问能提高找到对手方概率，也让更多人获知大额交易意图。</p></article>
          <article><span>集合竞价失衡</span><h3>统一价格不保证全部成交</h3><p>一侧订单占优时，单一清算价只能分配现有对手量，不能创造需求。</p></article>
          <article><span>市场碎片化</span><h3>竞争场所也分散流动性</h3><p>路由失灵、行情延迟或不同规则会让“最佳价格”与真正可执行结果分离。</p></article>
          <article><span>交易系统与清算层分离</span><h3>成交不等于最终履约</h3><p>撮合成功后仍有信用、保证金、交付、结算与操作风险；1.19 只沿卖空与借券处理证券交付和失败平仓，一般清算体系另由后续单元展开。</p></article>
        </div>
        <p>
          这也是为什么监管者不能只比较平均 spread。市场架构还要在大额成交能力、压力韧性、价格发现、操作稳定、接入公平与风险外溢之间权衡。
          “正常日交易成本最低”只是评价函数中的一个维度。
        </p>
      </section>

      <section className="lesson-section" id="diagnostic">
        <p className="section-kicker">13 · 完整诊断案例</p>
        <h2>看到一笔公司债成交后，先别把 TRACE 当成交易所</h2>
        <p>
          一家基金需要卖出某只不活跃公司债。屏幕没有连续公开的完整订单簿，它向五家 dealer 发出 RFQ，三家回复；基金接受其中一家报价，
          该 dealer 买入债券并承担库存。成交后，受监管成员把交易报告到 TRACE，市场随后看到价格和一定口径的规模信息。
        </p>
        <div className="diagnostic-timeline architecture-diagnostic">
          <article><span>01 · PRE-TRADE</span><b>客户限制询价范围</b><p>减少向全市场公开大卖单，但五家 dealer 仍能从询价中推断卖压。</p></article>
          <article><span>02 · EXECUTION</span><b>dealer 成为 principal</b><p>成交价格包含参考市场、规模、信用、库存和未来对冲成本。</p></article>
          <article><span>03 · RISK TRANSFER</span><b>风险没有消失</b><p>dealer 可能等待反向客户，也可能通过其他债券、信用违约互换（credit default swap，CDS）或利率工具对冲。</p></article>
          <article><span>04 · POST-TRADE</span><b>TRACE 传播成交事实</b><p>后续参与者获得公共参考，但报告系统并没有替原交易寻找对手方。</p></article>
        </div>
        <p>
          如果只看到第四步，很容易误以为债券在一个类似股票交易所的公开系统里自动成交；如果只看到第二步，又可能误以为 dealer 独自“创造”了价格。
          完整链条是：客户约束选择协议 → dealer 竞争报价并承担库存 → 成交后风险再分配 → 报告提高后续透明度。
          架构分析的价值，就是把执行、风险承担和信息传播重新拆开。
        </p>
      </section>

      <section className="lesson-section" id="observe">
        <p className="section-kicker">14 · 面对陌生市场的观察顺序</p>
        <h2>不要先问“它是不是交易所”，先问六个可验证问题</h2>
        <div className="observation-card architecture-observation">
          <div><span>谁能接入</span><p>散户、会员、机构、dealer、做市商，还是仅受邀对手方？</p></div>
          <div><span>谁给出可执行价</span><p>公开订单、单家 dealer、多家 RFQ，还是经纪协商？</p></div>
          <div><span>何时匹配</span><p>到达即处理、定时 call，还是协商完成后双边成交？</p></div>
          <div><span>谁看见什么</span><p>成交前报价与规模、身份、成交后报告分别向谁开放？</p></div>
          <div><span>谁先承担风险</span><p>自然对手方、dealer 资产负债表，还是中央对手方只在成交后介入？</p></div>
          <div><span>失败时卡在哪里</span><p>深度、dealer 资本、搜索、网络路由、竞价失衡或结算？</p></div>
        </div>
        <p>
          回答完这六个问题，再使用 order-driven、dealer、OTC 或 exchange 等缩写，标签才有证据基础。
          如果只能说“它是场外市场，所以不透明”，却无法指出谁报价、报告何时发生、客户能否多家询价，就还没有真正识别架构。
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">15 · 主动练习 · 建议 25–35 分钟</p>
        <h2>把市场名称还原成参与者、规则、信息与风险</h2>
        <details className="practice-card">
          <summary><span>练习一 · 5–7 分钟</span>四段描述分别用了哪些设计轴？</summary>
          <div>
            <p>
              A：多方匿名限价订单按到达顺序连续匹配；B：客户向三家银行同时询价并选择一家成交；
              C：所有订单等待到 15:00，以一个价格成交；D：大宗卖方委托 broker 私下寻找自然买方。
              对每段分别标注流动性来源、时间组织、透明度、代理/自营角色。不要只写一个市场名称。
            </p>
            <p>
              <b>解析：</b>A 是订单驱动、连续、匿名且以自动规则匹配；B 是多 dealer RFQ，交易商以 principal 报价；
              C 只确定了 call/batch 时间轴，仍需知道订单来自客户还是 dealer、是否公开；D 是代理型经纪搜索，最终流动性来自自然对手方。
              关键是 C 无法仅凭“集合竞价”推断其余设计轴。
            </p>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习二 · 7–9 分钟</span>为十万股卖单选择路径，并写出会推翻你选择的证据</summary>
          <div>
            <p>
              已知公开最优买盘只有一万股，任务必须在今天完成，但基金不希望市场过早知道完整规模。
              在订单簿拆单、dealer RFQ、broker 搜索和等待收盘竞价之间设计一条组合路径，并说明每一步解决什么约束。
            </p>
            <p>
              <b>解析标准：</b>没有唯一答案。高质量方案会先说明紧迫度、可接受冲击和保密边界，再比较 dealer 一次承接的报价、broker 找自然对手的时间、
              订单簿拆分的泄露和竞价失衡。还要写反证：如果 dealer 报价极差、自然对手不存在、盘尾预期失衡或波动突然上升，原路径应怎样调整。
            </p>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习三 · 8–10 分钟</span>为一种低频、非标准资产设计市场，而不是照搬股票交易所</summary>
          <div>
            <p>
              假设某类资产每天只有十几笔交易，合约期限和信用条款各异。请决定是否标准化部分条款、是否允许公开订单簿、dealer 是否承担报价义务、
              是否采用 RFQ、成交后何时报告，以及压力时谁提供流动性。每个选择至少写一个收益和一个代价。
            </p>
            <p>
              <b>解析标准：</b>若直接要求全天连续公开订单簿，却没有解释如何获得持续双边订单，设计并不完整。
              可行方案通常把可标准化部分放入电子多边竞争，把定制与信用部分留给 dealer/RFQ，并用适度成交后报告改善参考价格；
              但 dealer 资本约束、报告造成的库存暴露和客户比较报价能力仍需单独治理。
            </p>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习四 · 5–7 分钟</span>哪一个架构参数使相同订单得到不同结果？</summary>
          <div>
            <p>
              回到 10.02 元买单与 10.00 元卖单的例子。先解释为什么两档申报候选价的最大成交量相同，再指出：两所在哪一个并列处理参数上不同，
              这种差异为什么足以使同一订单集合得到不同结果？无需脱离示例背诵完整条文，完整推导留到 1.17。
            </p>
            <p>
              <b>解析：</b>两所都能配对 1,000 股，但上交所以未成交量筛选后仍并列便取中间价；深交所先比较高价买量与低价卖量之差，仍并列时，开盘再使用前收盘价作锚。
              从机制效果看，深交所规则可被理解为更强调与既有价格锚的连续性，上交所中间价步骤则落在并列可接受申报价的中心；这是对规则效果的经济解释，不是交易所对规则制定目的的正式陈述。
            </p>
          </div>
        </details>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">16 · 理解检查</p>
        <h2>如果不能解释“谁承担了什么”，就还没有理解架构</h2>
        <details><summary>1. order-driven market 是否意味着市场里没有做市商？</summary><p>不是。它表示可执行价格主要通过订单按规则竞争形成。做市商、机构和普通投资者都可以向同一订单簿提交流动性；身份与制度接口是不同维度。</p></details>
        <details><summary>2. 电子化的 RFQ 是否已经变成订单驱动市场？</summary><p>不一定。若客户发出询价、dealer 针对该询价用自有资本报价，核心仍是交易商架构；电子化只改变通信与竞争速度。</p></details>
        <details><summary>3. broker 与 dealer 的最关键区别是什么？</summary><p>纯代理 broker 帮客户寻找和协商对手方，不必把头寸放入自身资产负债表；dealer 以 principal 身份成交并先承担库存风险。现实机构可能兼营两者，必须按具体交易识别。</p></details>
        <details><summary>4. 为什么 continuous 和 call 不能与 order-driven 和 dealer-driven 放在同一互斥分类？</summary><p>前一组描述订单在时间上逐笔还是批量处理，后一组描述谁提供价格和即时性。一个订单驱动市场可以同时拥有连续盘中交易和开收盘 call auction。</p></details>
        <details><summary>5. TRACE 为什么提高债券透明度，却不是债券交易所？</summary><p>TRACE 收集并传播合格 OTC 固定收益成交报告，不寻找对手方、接受报价或执行交易。成交后数据设施与成交前执行场所是不同层。</p></details>
        <details><summary>6. 为什么不存在对所有资产和订单都最优的市场架构？</summary><p>资产在标准化、交易频率、规模、信用、信息敏感度和紧迫度上不同。公开订单竞争、dealer 即时性、经纪搜索与批量聚合分别解决不同摩擦，也制造不同成本。</p></details>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">17 · 与整套课程的接口</p>
        <h2>架构先规定游戏，再由订单和参与者在游戏中行动</h2>
        <p>
          1.03 将研究参与者如何在既定架构中选择 market、limit、stop 等订单；1.04 会进入限价订单簿的 queue、depth 与状态变量；
          1.17 会把 call auction 的统一定价和失衡信息单独展开；1.19 会解释卖空订单之后的借券交付、FTD 与 close-out，但不替代一般 clearing、CCP 与 settlement 单元；
          5.05 则重新从监管和社会目标出发，问市场设计如何改变竞争、透明度与系统风险。
        </p>
        <blockquote>
          本节最终心智模型：资产与交易意图带来一组摩擦；市场架构选择由谁报价、何时互动、公开什么和谁先承担风险；
          参与者随后适应规则，形成流动性、价格发现与新的脆弱性。规则不是市场之外的约束，而是市场行为的生成条件。
        </blockquote>
      </section>
    </>
  );
}

export const lesson102: LessonRecord = {
  slug: '1-02',
  id: '1.02',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: '交易所怎样组织交易',
  subtitle: 'Market Architecture：从订单竞争、交易商资本到混合执行网络',
  readingTime: '约 65–90 分钟（含互动与主动练习）',
  prerequisite: '1.01 · 价格究竟是什么；按需回看 T06 Balance Sheet 基础',
  updatedAt: '2026-08-28',
  revision: '1.02-r2',
  reviewStatus: 'double-reviewed',
  previous: { slug: '1-01', label: '1.01 价格究竟是什么' },
  next: { slug: '1-03', label: '1.03 Order Types：Market / Limit / Stop Order' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.02-r1',
      summary: '要求补全深交所集合竞价并列筛选、限定候选价格集合，并校正执行层职责与 PFMI 术语。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.02-r1',
      summary: '要求重写 dealer 报价公式、增强交互主动预测，并改善术语首次解释与移动端可读性。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.02-r2',
      summary: '已核验沪深并列规则、候选价域、公式、数值、现行制度边界与 18 条来源，批准 1.02-r2。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.02-r2',
      summary: '已核验零背景解释、因果闭环、主动预测交互、练习边界、移动端可读性与无障碍，批准 1.02-r2。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'machine', label: '市场作为规则机器' },
    { id: 'axes', label: '六个分类轴' },
    { id: 'order-driven', label: '订单驱动市场' },
    { id: 'dealer', label: '交易商与 RFQ' },
    { id: 'brokered', label: '经纪撮合市场' },
    { id: 'time', label: '连续与批量' },
    { id: 'hybrid', label: '混合与分层市场' },
    { id: 'transparency', label: '透明度与匿名性' },
    { id: 'same-order', label: '同一意图四种路径' },
    { id: 'architecture-lab', label: '互动架构比较器' },
    { id: 'fit', label: '架构适配条件' },
    { id: 'failures', label: '失败模式' },
    { id: 'diagnostic', label: '完整诊断案例' },
    { id: 'observe', label: '观察方法' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '后续接口' },
  ],
  Content: Lesson102Content,
  references: [
    {
      id: 1,
      authors: 'Ananth Madhavan',
      year: '2000',
      title: 'Market Microstructure: A Survey',
      publication: 'Journal of Financial Markets, 3(3), 205–258',
      url: 'https://doi.org/10.1016/S1386-4181(00)00007-0',
      use: '市场微观结构的总定义，以及交易制度、透明度和价格形成的统一框架。',
    },
    {
      id: 2,
      authors: 'Larry Harris',
      year: '2003',
      title: 'Trading and Exchanges: Market Microstructure for Practitioners',
      publication: 'Oxford University Press',
      url: 'https://doi.org/10.1093/oso/9780195144703.001.0001',
      use: '订单驱动、报价驱动、经纪市场、交易者角色和市场设计的实践分类。',
    },
    {
      id: 3,
      authors: "Maureen O'Hara",
      year: '1995',
      title: 'Market Microstructure Theory',
      publication: 'Blackwell',
      url: 'https://www.wiley-vch.de/en/areas-interest/finance-economics-law/accounting-13ac/corporate-finance-13ac3/market-microstructure-theory-978-1-55786-443-7',
      use: '市场、做市与交易机制理论的正式基础。',
    },
    {
      id: 4,
      authors: 'Ananth Madhavan',
      year: '1992',
      title: 'Trading Mechanisms in Securities Markets',
      publication: 'Journal of Finance, 47(2), 607–641',
      url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04403.x',
      use: '交易机制如何改变信息聚合、价格与成交结果。',
    },
    {
      id: 5,
      authors: 'Lawrence R. Glosten',
      year: '1994',
      title: 'Is the Electronic Open Limit Order Book Inevitable?',
      publication: 'Journal of Finance, 49(4), 1127–1161',
      url: 'https://doi.org/10.1111/j.1540-6261.1994.tb02450.x',
      use: '开放电子限价订单簿的均衡价格阶梯、价差与流动性供给。',
    },
    {
      id: 6,
      authors: 'Marco Pagano and Ailsa Röell',
      year: '1996',
      title: 'Transparency and Liquidity: A Comparison of Auction and Dealer Markets with Informed Trading',
      publication: 'Journal of Finance, 51(2), 579–611',
      url: 'https://doi.org/10.1111/j.1540-6261.1996.tb02695.x',
      use: '成交前透明度在风格化 auction 与 dealer 市场中对无信息交易者成本的影响及其规模边界。',
    },
    {
      id: 7,
      authors: 'Eric Budish, Peter Cramton and John Shim',
      year: '2015',
      title: 'The High-Frequency Trading Arms Race: Frequent Batch Auctions as a Market Design Response',
      publication: 'Quarterly Journal of Economics, 130(4), 1547–1621',
      url: 'https://doi.org/10.1093/qje/qjv027',
      use: '连续时间、顺序处理与速度竞赛，以及频繁批量竞价的市场设计主张。',
    },
    {
      id: 8,
      authors: '上海证券交易所',
      year: '2026',
      title: '上海证券交易所交易规则（2026年修订）',
      publication: '上海证券交易所现行规则，2026年7月6日起施行',
      url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml',
      use: '集合与连续竞价、价格优先和时间优先的现行 A 股规则实例。',
    },
    {
      id: 9,
      authors: 'New York Stock Exchange',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'NYSE Parity: Why Trading on the NYSE Is Different',
      publication: 'NYSE Trading Documentation',
      url: 'https://www.nyse.com/trade/parity-priority-explainer',
      use: 'NYSE 电子交易、floor broker、DMM 与 parity/priority 的混合市场自述；其质量主张不作为独立实证证据。',
    },
    {
      id: 10,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2005',
      title: 'ECNs / Alternative Trading Systems',
      publication: 'Division of Trading and Markets, modified November 4, 2005',
      url: 'https://www.sec.gov/divisions/marketreg/mrecn.shtml',
      use: 'ECN 自动匹配订单、订阅者接入及其作为 ATS 而非国家证券交易所的历史性机构说明；当前执行质量框架另由参考文献 15 支持。',
    },
    {
      id: 11,
      authors: 'Financial Industry Regulatory Authority',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'About Corporate and Agency Trade Activity Data',
      publication: 'FINRA Fixed Income Data',
      url: 'https://www.finra.org/finra-data/fixed-income/about-cna-trade',
      use: 'TRACE 发布已执行的 OTC 固定收益交易数据，但没有执行能力，也不接受报价。',
    },
    {
      id: 12,
      authors: 'Alain Chaboud, Dagfinn Rime and Vladyslav Sushko',
      year: '2023',
      title: 'The Foreign Exchange Market',
      publication: 'BIS Working Papers No. 1094',
      url: 'https://www.bis.org/publ/work1094.htm',
      use: 'OTC 外汇的 dealer intermediation、电子化、场所分层和价格发现结构。',
    },
    {
      id: 13,
      authors: 'Ingomar Krohn, Andreas Schrimpf and Vladyslav Sushko',
      year: '2025',
      title: 'The FX Trade Execution Landscape through the Prism of the 2025 BIS Triennial Survey',
      publication: 'BIS Quarterly Review, December 2025',
      url: 'https://www.bis.org/publ/qtrpdf/r_qt2512v.htm',
      use: '2025 全球外汇执行方式、电子交易、internalisation、CLOB 与 RFQ 的最新调查快照。',
    },
    {
      id: 14,
      authors: 'CPSS and IOSCO',
      year: '2012',
      title: 'Principles for Financial Market Infrastructures',
      publication: 'Bank for International Settlements and IOSCO',
      url: 'https://www.bis.org/cpmi/publ/d101a.htm',
      use: '中央对手方、中央存管、证券结算系统和交易信息库等成交后基础设施的功能边界。',
    },
    {
      id: 15,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2026',
      title: 'Frequently Asked Questions: Rule 605 of Regulation NMS',
      publication: 'SEC Trading and Markets Staff Guidance, updated April 1, 2026',
      url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-605-regulation-nms',
      use: 'market center 的范围，以及交易所、ATS 和 broker-dealer 执行规则差异需要分别衡量。',
    },
    {
      id: 16,
      authors: '深圳证券交易所',
      year: '2026',
      title: '深圳证券交易所交易规则（2026年修订）',
      publication: '深圳证券交易所现行规则，2026年7月6日起施行',
      url: 'https://www.szse.cn/lawrules/rule/trade/current/t20260424_620190.html',
      use: '集合与连续竞价的现行主流程、价格时间优先，以及先比较高价买量与低价卖量之差、再在开盘并列时接近前收盘价的处理链。',
    },
    {
      id: 17,
      authors: 'Nasdaq Stock Market',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Nasdaq Equity 4: Equity Rules',
      publication: 'Nasdaq Listing Center Rulebook, Rules 4756–4757',
      url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/nasdaq-equity-4',
      use: 'Nasdaq Book 的订单处理与 price/display/time 执行规则，以及做市商报价作为可归属订单进入系统。',
    },
    {
      id: 18,
      authors: 'Terrence Hendershott and Ananth Madhavan',
      year: '2015',
      title: 'Click or Call? Auction versus Search in the Over-the-Counter Market',
      publication: 'Journal of Finance, 70(1), 419–447',
      url: 'https://doi.org/10.1111/jofi.12164',
      use: '多 dealer 电子询价作为双边搜索与连续订单簿之间的协议折中，以及协议选择的内生性。',
    },
  ],
  readingList: [
    {
      title: 'Larry Harris — Trading and Exchanges',
      scope: '先读关于 trading industry、orders and order properties、market structures 与 brokers 的章节，再回到后续 LOB 单元。',
      reason: '用参与者、订单和制度三条线建立最完整的实践型市场架构语言。',
      url: 'https://doi.org/10.1093/oso/9780195144703.001.0001',
    },
    {
      title: "Maureen O'Hara — Market Microstructure Theory",
      scope: '本节先读 Chapter 1 Markets and Market-Making，暂不强求后续信息模型推导。',
      reason: '把交易商、做市和交易机制放进严格理论框架，适合作为教材后的正式进阶。',
      url: 'https://www.wiley-vch.de/en/areas-interest/finance-economics-law/accounting-13ac/corporate-finance-13ac3/market-microstructure-theory-978-1-55786-443-7',
    },
    {
      title: 'Ananth Madhavan — Market Microstructure: A Survey',
      scope: '重点读 institutional issues、information and the price formation process、market structure and design。',
      reason: '把本节分类与价格形成、透明度和监管研究连接起来。',
      url: 'https://doi.org/10.1016/S1386-4181(00)00007-0',
    },
    {
      title: 'Budish, Cramton & Shim — Frequent Batch Auctions',
      scope: '先读 Introduction 和连续时间市场设计直觉，再按数学基础选择是否进入模型。',
      reason: '训练自己把参与者的速度行为重新解释为规则激励，而不是道德标签。',
      url: 'https://doi.org/10.1093/qje/qjv027',
    },
  ],
};
