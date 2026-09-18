import OrderFlowLab from '../components/OrderFlowLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson108Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>价格不会因为“买家比卖家多”而上涨；它会因为带方向的订单事件持续重写两侧可执行承诺而变化。</h2>
        <p>
          每一笔成交都同时有买方和卖方，所以成交人数永远不能解释方向。真正不对称的是<strong>谁先要求成交、哪一侧队列被消耗、哪一侧新增承诺、哪一侧撤回承诺，以及这些事件相对于当时承接容量有多大</strong>。一位急于买入的交易者接受 ask，卖方显示队列减少；另一位交易者即使一股未成交，只要撤掉 ask，也会让买方冲击更容易推动价格。Order flow 的任务，就是把这段状态变化翻译成带方向的事件序列。
        </p>
        <p>
          本节的中心机制是：<strong>不同参与者把信息、库存、对冲需求和执行约束转化为主动成交、限价新增与撤单；交易规则把这些动作映射为带符号事件；聚合后的不平衡改变两侧队列接近耗尽的相对概率，并被其他参与者观察和响应，于是短期价格变化、流动性调整与后续订单流共同演化。</strong>Order flow 因此既可能携带私人信息，也可能只是分拆、库存再平衡、机械对冲或公共新闻后的共同反应；统计关联本身不能识别动机或因果。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={8} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>解释为什么 trade sign 标记主动方，而不是把一笔交易误写成“只有买没有卖”。</li>
            <li>区分 signed trade flow、trade imbalance、best-level OFI、queue imbalance 与 multi-level OFI。</li>
            <li>从最优 bid/ask 的价格与数量更新中，逐事件计算 Cont–Kukanov–Stoikov OFI。</li>
            <li>理解限价新增与撤单为何即使没有成交，也能形成有方向的供需压力。</li>
            <li>选择 event、calendar 或 volume clock，并使用在预测时点已经可得的尺度做归一化。</li>
            <li>把同窗价格解释、真正向前预测、结构因果和成本后可交易性分成四个不同命题。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节边界</span>
          <p>
            1.03–1.04 已给出订单类型、撮合规则和订单簿状态，1.07 已说明 add、cancel 与 execution 怎样改变深度和恢复；本节只负责<strong>把事件定方向、聚合并判断它包含什么信息</strong>。1.09 才系统区分机械、暂时与持久 price impact，7.18 才研究一个市场的 order flow 是否领先另一个市场。本节出现价格回归只是为了辨认测量与预测边界，不会把回归系数直接命名为永久冲击或跨市场因果。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="from-intention-to-event">
        <p className="section-kicker">01 · 从意愿到事件</p>
        <h2>“想买”不可观测；提交、撤销、改价和成交才进入数据。</h2>
        <p>
          交易者先有一个潜在目标：获得风险敞口、减仓、对冲、提供流动性或利用信息。随后他在价格、数量、时限和场所之间作选择。只有指令到达撮合系统并被接受，才成为可观测事件；一笔未提交的购买意愿不属于 order flow，一张仍静止在簿上的限价单也属于当前 state，而不是本观察窗的新 flow。这个区分与 1.07 的 displayed / hidden / latent 三层一致：order flow 记录状态如何被重写，而不是猜测所有尚未表达的需求。
        </p>
        <div className="mechanism-chain" aria-label="从参与者意愿到订单流与市场结果的机制链">
          {[
            ['目标与信息', '方向观点、库存、对冲、执行期限与风险限额'],
            ['指令选择', '主动成交、限价新增、撤单、改价、数量与场所'],
            ['撮合与消息', '规则决定排队、成交、删除和最优报价更新'],
            ['带符号事件', '按经济方向把不同消息映射为正、负或零贡献'],
            ['窗口聚合', '选择时钟、价格层级、权重和归一化尺度'],
            ['状态与反馈', '队列耗尽概率、价格、流动性和后续行为改变'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          “订单流预测价格”这句话因而省略了四层映射：行为怎样成为消息、消息怎样被签名、事件怎样被聚合、聚合量怎样进入特定时间尺度的结果。任何一层改变，变量的含义都会改变。Biais、Hillion 与 Spatt 对巴黎订单簿的研究早已显示，后续订单类型会依赖当前簿状态；订单流不是从外部随机倒入市场的独立输入。<Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="aggressor">
        <p className="section-kicker">02 · 每笔成交都有两边</p>
        <h2>Buy-initiated 不是“只有人买”，而是买方接受了当时可得的卖方条款。</h2>
        <p>
          假设 best bid 为 99.99、best ask 为 100.01。一位交易者提交可立即执行的买单并在 100.01 成交，另一位卖方限价单提供了对手方。两人一买一卖，成交量会同时计入双方，但主动买方跨过 spread、决定了成交此刻发生，因此通常记作 ε=+1 的 buyer-initiated trade。反之，在 bid 成交通常记作 ε=−1 的 seller-initiated trade。符号描述<strong>发起方向或流动性索取方向</strong>，不是社会中买卖人数之差。
        </p>
        <div className="contrast-card">
          <div><span>BUY-INITIATED</span><b>主动方接受 ask</b><p>常记 ε=+1；ask queue 被执行量消耗。被动卖方仍然是交易不可缺少的另一边。</p></div>
          <div><span>SELL-INITIATED</span><b>主动方接受 bid</b><p>常记 ε=−1；bid queue 被执行量消耗。它不等于市场中“卖家人数更多”。</p></div>
        </div>
        <p>
          在 dealer market 的经典信息模型中，报价者会从交易方向更新对手方可能知情的概率；Kyle 模型则把不可观测的知情需求混在噪声订单中，使净订单流成为价格形成的统计载体。这些理论说明方向为什么可能含信息，却不意味着每个主动买单都“知道利好”。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="terminology-map">
        <p className="section-kicker">03 · 名词地图</p>
        <h2>同样被译成“订单不平衡”的量，可能是成交流、订单簿事件流或静态队列状态。</h2>
        <div className="table-scroll" role="region" aria-label="订单流相关指标的概念比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先问对象、时间和单位，再看指标名称</caption>
            <thead><tr><th scope="col">变量</th><th scope="col">输入对象</th><th scope="col">时间性质</th><th scope="col">典型单位</th><th scope="col">不等于</th></tr></thead>
            <tbody>
              <tr><th scope="row">Signed trade flow</th><td>已成交交易及主动方</td><td>窗口内流量</td><td>股、张、金额或笔数</td><td>全部订单事件</td></tr>
              <tr><th scope="row">Trade imbalance</th><td>买方发起与卖方发起成交</td><td>窗口内净额或比例</td><td>数量或 [−1,1]</td><td>当前队列差</td></tr>
              <tr><th scope="row">Best-level OFI</th><td>best bid/ask 价格与数量更新</td><td>窗口内事件流</td><td>队列数量</td><td>仅成交不平衡</td></tr>
              <tr><th scope="row">Queue imbalance</th><td>某时点 bid/ask queue</td><td>快照状态</td><td>通常 [−1,1]</td><td>一段事件历史</td></tr>
              <tr><th scope="row">MLOFI</th><td>多个相对价位的事件贡献</td><td>窗口内向量流</td><td>每层队列数量</td><td>天然唯一的标量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          文献中的 order imbalance 还可能按交易笔数、股数或美元金额定义，按证券、市场或全市场聚合，并使用未归一化净额或比例。读到一个实证结论时，不能只摘取“imbalance 显著”；必须追问它属于表中哪一行、窗口多长、符号如何识别、是否包含撤单、分母是什么以及预测目标何时开始。<Cite n={8} /><Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="signed-trade-flow">
        <p className="section-kicker">04 · Signed trade flow</p>
        <h2>给成交量乘上主动方符号，才保留净方向。</h2>
        <p>
          对观察区间 I 内的成交 i，令 v<sub>i</sub>&gt;0 为成交数量，ε<sub>i</sub>∈{'{'}−1,+1{'}'} 为主动方符号。最基本的成交方向流量与归一化成交不平衡可以写为：
        </p>
        <div className="equation-card">
          <span>成交方向净额与比例</span>
          <div>STF<sub>I</sub> = Σ<sub>i∈I</sub> ε<sub>i</sub>v<sub>i</sub><br />TI<sub>I</sub> = [Σ<sub>i∈I</sub> ε<sub>i</sub>v<sub>i</sub>] / [Σ<sub>i∈I</sub> v<sub>i</sub>]</div>
          <p>STF 保留“净多少股”；只有当 gross volume&gt;0 时，TI 才有定义并位于 −1 到 +1。零成交窗会产生 0/0，应记为 NA 或按预注册规则处理，不得默认为 0。若 400 股在 ask 成交、250 股在 bid 成交，则 STF=+150 股、gross volume=650 股、TI≈+0.231。三者都不能告诉你未成交的新增与撤单。</p>
        </div>
        <p>
          用笔数而非数量时，公式会把一笔 10 股与一笔 10,000 股赋予相同权重；用金额时又会引入价格水平。不存在脱离问题的“正确版本”：研究执行压力可能更关心数量或金额，研究交易到达序列可能关心符号与笔数。关键是预先固定口径，并同时保留 gross activity，防止净额抵消掩盖高强度双向交易。
        </p>
      </section>

      <section className="lesson-section" id="trade-classification">
        <p className="section-kicker">05 · 主动方未必直接可见</p>
        <h2>若数据没有 aggressor flag，trade sign 是一次测量推断，而不是原始事实。</h2>
        <p>
          最理想的数据会由撮合消息或交易所字段直接标明哪张订单先在簿中、哪张订单后来执行。只有成交与报价快照时，研究者常把成交价靠近 ask 的交易判为买方发起、靠近 bid 的交易判为卖方发起；若成交在 midpoint，则用最近非零价格变化的 tick test。Lee–Ready 方法就是在特定历史 NYSE/AMEX 报告延迟背景下组织这些规则，并讨论当时 quote 与 trade 时间戳错位的问题。<Cite n={5} />
        </p>
        <div className="equation-card">
          <span>Quote test 的最小形式</span>
          <div>m<sup>q</sup><sub>i</sub>=(a<sub>i</sub>+b<sub>i</sub>)/2<br />ε̂<sub>i</sub>=+1 if p<sub>i</sub>&gt;m<sup>q</sup><sub>i</sub>；　ε̂<sub>i</sub>=−1 if p<sub>i</sub>&lt;m<sup>q</sup><sub>i</sub></div>
          <p>成交价在 quote midpoint 上时还需要补充规则；更重要的是，m<sup>q</sup> 必须真的是成交发生时可用的报价。报告时间、跨场所、price improvement 与聚合成交都会让这个条件失效。</p>
        </div>
        <p>
          Ellis、Michaely 与 O’Hara 用带真实方向的 Nasdaq 专有数据发现，Lee–Ready 在其样本总体正确率约 81%，但对价差内部成交的表现有限；Chakrabarty 等人在 2005 年 INET ECN 样本也发现现有算法对 inside-quote trades 的成功率显著较弱。这里的数字只描述各自制度、样本和时间，不能充当现代任一 feed 的固定误差率。真正的结论是：<strong>用推断符号构造的 imbalance 含有测量误差，而且误差可能随成交位置、规模、波动和场所系统变化。</strong><Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="event-alphabet">
        <p className="section-kicker">06 · 订单簿事件字母表</p>
        <h2>价格压力不只来自成交，还来自承诺的增加、撤回和跨价位移动。</h2>
        <p>
          一段最优报价消息可以规范化为四类经济动作：bid-side quantity 增加或减少，ask-side quantity 增加或减少；最优价格改善或恶化时，又有整条新队列进入或旧队列离开 best level。改单通常应拆成旧位置 cancel 与新位置 add。执行是队列因交易而减少，非成交删除是承诺撤回；二者对显示深度的机械结果可能相同，经济动机却不同。
        </p>
        <div className="market-stack market-stack-three">
          <article><span>LIMIT ADD</span><b>新增被动承诺</b><p>Bid add 倾向正向；ask add 倾向负向。它改变未来冲击需要消耗的库存。</p></article>
          <article><span>CANCEL / DELETE</span><b>撤回已有承诺</b><p>Bid cancel 倾向负向；ask cancel 倾向正向。没有成交也会改变可执行机会。</p></article>
          <article><span>EXECUTION</span><b>主动方消耗队列</b><p>Ask execution 对应主动买入，bid execution 对应主动卖出；应避免与非成交删除混淆。</p></article>
        </div>
        <p>
          因此“没有大单成交，所以没有买压”可能完全错误：大量 ask 撤单会让卖方承接消失；新增 bid 会缩短向上移动所需的相对路径。Cont、Kukanov 与 Stoikov 的核心贡献之一，就是把市场单、限价单和撤单统一投影到 best bid/ask 的净供需变化，而不是只用交易量代理全部活动。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="why-nontrades-matter">
        <p className="section-kicker">07 · 为什么未成交事件有方向</p>
        <h2>方向来自“哪一侧更接近耗尽”，而不是来自这一刻有没有交换所有权。</h2>
        <p>
          设 spread 仍为一 tick，best bid 与 ask 各有 500 股。若 ask 被撤掉 400 股，下一笔 150 股主动买单可能推动 ask 上移；若相同数量被加到 ask，价格上移需要更强的买单。两种情形都没有即时成交，却改变了未来状态转移的条件概率。相反，bid 增加使向下耗尽更难，bid 撤销使向下耗尽更容易。OFI 的正负号正是围绕这种相对承接变化定义。
        </p>
        <div className="table-scroll" role="region" aria-label="最优报价事件方向表，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>本节约定：正值代表买方一侧净压力，负值代表卖方一侧净压力</caption>
            <thead><tr><th scope="col">事件</th><th scope="col">Best-level 机械变化</th><th scope="col">OFI 方向</th><th scope="col">直白解释</th></tr></thead>
            <tbody>
              <tr><th scope="row">Bid add / improve</th><td>买方承接增加或抬高</td><td>正</td><td>向下耗尽更难</td></tr>
              <tr><th scope="row">Bid cancel / worsen / execution</th><td>买方承接减少、旧 best bid 消失或被吃掉</td><td>负</td><td>向下耗尽更容易</td></tr>
              <tr><th scope="row">Ask add / improve</th><td>卖方承接增加，或更低的新 ask 进入</td><td>负</td><td>向上耗尽更难</td></tr>
              <tr><th scope="row">Ask cancel / worsen / execution</th><td>卖方承接减少、旧 best ask 消失或被吃掉</td><td>正</td><td>向上耗尽更容易</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “倾向”不等于单事件必然引发价格变化。新增订单可能立刻撤掉，隐藏量可能补显，另一侧可能同步变化，相关市场可能先行，且大 spread 与多 tick 跳跃需要更完整状态。方向表只建立一致的局部会计语言。<Cite n={8} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="ofi-definition">
        <p className="section-kicker">08 · Best-level OFI 的精确定义</p>
        <h2>每次最优报价更新都比较“旧 best”与“新 best”，价格变化时不能只做数量差。</h2>
        <p>
          令第 n 次更新后的最优买价、买量为 P<sup>B</sup><sub>n</sub>、q<sup>B</sup><sub>n</sub>，最优卖价、卖量为 P<sup>A</sup><sub>n</sub>、q<sup>A</sup><sub>n</sub>。用 1[·] 表示条件成立时取 1、否则取 0。按 Cont–Kukanov–Stoikov 的 best-level 构造，一次更新的 bid 与 ask 贡献为：
        </p>
        <div className="equation-card">
          <span>单次最优报价事件贡献</span>
          <div>e<sup>B</sup><sub>n</sub>=1[P<sup>B</sup><sub>n</sub>≥P<sup>B</sup><sub>n−1</sub>]q<sup>B</sup><sub>n</sub>−1[P<sup>B</sup><sub>n</sub>≤P<sup>B</sup><sub>n−1</sub>]q<sup>B</sup><sub>n−1</sub><br />e<sup>A</sup><sub>n</sub>=1[P<sup>A</sup><sub>n</sub>≤P<sup>A</sup><sub>n−1</sub>]q<sup>A</sup><sub>n</sub>−1[P<sup>A</sup><sub>n</sub>≥P<sup>A</sup><sub>n−1</sub>]q<sup>A</sup><sub>n−1</sub><br />e<sub>n</sub>=e<sup>B</sup><sub>n</sub>−e<sup>A</sup><sub>n</sub></div>
          <p>Bid 改善时计入新 best bid 队列，bid 恶化时移除旧 best bid 队列；ask 改善时计入新 best ask 队列，但总 OFI 要减去 ask 贡献，ask 恶化时移除旧 best ask 队列并因此形成正向贡献。同价时两个指示项都为 1，公式自然退化为新旧数量差。</p>
        </div>
        <p>
          对窗口 I<sub>k</sub> 内全部更新求和，就得到 OFI<sub>k</sub>=Σ<sub>n∈Iₖ</sub>e<sub>n</sub>。它的单位仍是队列数量，而不是百分比或价格；正值表示在该定义下，bid 侧净承诺增加和/或 ask 侧净承诺减少占优。公式是带方向的 best-quote 账本，不是交易者意图的直接观测。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="branch-intuition">
        <p className="section-kicker">09 · 四个价格分支</p>
        <h2>等价、改善、恶化三种报价变化，对数量的处理逻辑完全不同。</h2>
        <div className="table-scroll" role="region" aria-label="OFI 价格分支逐项解释，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>将公式展开成可人工审计的事件规则</caption>
            <thead><tr><th scope="col">Best quote 变化</th><th scope="col">事件贡献</th><th scope="col">为何不是简单 Δq</th></tr></thead>
            <tbody>
              <tr><th scope="row">Bid 不变</th><td>q<sup>B</sup><sub>n</sub>−q<sup>B</sup><sub>n−1</sub></td><td>同一价格队列可直接比较</td></tr>
              <tr><th scope="row">Bid 上升</th><td>+q<sup>B</sup><sub>n</sub></td><td>新价格整条队列进入 best；旧队列仍可能留在第二档</td></tr>
              <tr><th scope="row">Bid 下降</th><td>−q<sup>B</sup><sub>n−1</sub></td><td>旧 best 整条队列离开；新 best 原本可能已在更低档</td></tr>
              <tr><th scope="row">Ask 不变</th><td>−(q<sup>A</sup><sub>n</sub>−q<sup>A</sup><sub>n−1</sub>)</td><td>同价 ask 增加是负向，减少是正向</td></tr>
              <tr><th scope="row">Ask 下降</th><td>−q<sup>A</sup><sub>n</sub></td><td>更积极的新 ask 整条进入 best，卖方压力增强</td></tr>
              <tr><th scope="row">Ask 上升</th><td>+q<sup>A</sup><sub>n−1</sub></td><td>旧 best ask 整条离开，卖方近端承接消失</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这套分支与“逐条原始订单消息做全簿守恒”不是同一对象。它只观察 best bid/ask，价格移动时用进入或离开最优档的整条队列表示边界变化；深层队列内部的新增、撤销若没有成为 best，不会进入 best-level OFI。理解这一边界，是下一步扩展到 MLOFI 的前提。
        </p>
      </section>

      <section className="lesson-section" id="worked-ledger">
        <p className="section-kicker">10 · 手算一段事件账本</p>
        <h2>同一窗口的正向压力，可以由主动买入、bid 新增和 ask 撤销共同组成。</h2>
        <p>
          初始 best bid 为 99.99×500，best ask 为 100.01×600。接下来依次发生：① bid 同价新增 200；② ask 同价撤销 150；③ 100 股在 ask 成交；④ 一张 250 股新买单挂到 100.00，成为新 best bid。忽略其他消息，四次贡献分别为 +200、+150、+100、+250，窗口 OFI=+700 股。
        </p>
        <div className="table-scroll" role="region" aria-label="OFI 手算事件账本，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每一步都先判断价格分支，再判断数量贡献</caption>
            <thead><tr><th scope="col">事件</th><th scope="col">原始变化</th><th scope="col">贡献</th><th scope="col">累积 OFI</th></tr></thead>
            <tbody>
              <tr><th scope="row">01</th><td>Bid 99.99：500→700</td><td>+200</td><td>+200</td></tr>
              <tr><th scope="row">02</th><td>Ask 100.01：600→450</td><td>+150</td><td>+350</td></tr>
              <tr><th scope="row">03</th><td>Ask execution：450→350</td><td>+100</td><td>+450</td></tr>
              <tr><th scope="row">04</th><td>Bid：99.99×700→100.00×250</td><td>+250</td><td>+700</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最后一步最容易错：不能算 250−700=−450，因为这两个数量位于不同价格。99.99 的 700 股可能仍在第二档；成为新 best 的是 100.00 的 250 股。OFI 把“价格改善带来的新近端承诺”记作正向边界流入。若 feed 只给聚合快照而遗漏中间事件，这个重建可能不唯一，因此数据频率必须与研究对象匹配。
        </p>
      </section>

      <section className="lesson-section" id="price-jumps">
        <p className="section-kicker">11 · 最优价跳变与边界</p>
        <h2>Best-level OFI 处理一档边界流动，但不会自动描述跳过的全部深度。</h2>
        <p>
          若一笔订单吃空 100.01 的 ask，并继续吃到 100.03，最优卖价可能跨过多个 tick。Best-level 公式会把旧 best queue 的离开记入事件，却不恢复每个被跳过价位的逐笔轨迹；若输入只是相邻快照，期间 add、cancel 与 execution 的先后甚至可能不可辨认。市场处于宽 spread、离散 tick、拍卖或深度断层时，这种信息损失更明显。
        </p>
        <p>
          因此研究者要先决定问题：若关心极短期 best-quote 价格形成，best-level OFI 是有解释力的压缩；若关心大型执行、多个价位的承接与空档，就应保留逐层消息、成交路径和 spread change。任何标量都不可能同时保存方向、层级、事件类型和时间顺序。Cont–de Larrard 的队列模型说明，best queues 的耗尽能够内生地产生价格变化；这是一种有用的局部机制模型，不代表深层订单簿永远可以忽略。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="net-gross-composition">
        <p className="section-kicker">12 · Net、gross 与 composition</p>
        <h2>净额回答“哪一边占优”，总量回答“市场被重写多剧烈”，构成回答“通过什么动作实现”。</h2>
        <p>
          两个窗口都可能 OFI=0。窗口 A 没有任何事件；窗口 B 先有 +50,000 再有 −50,000。方向净额相同，信息处理、库存周转、撤单风险和执行负担完全不同。同样是 +1,000 的 OFI，也可能来自稳定新增 bid，或来自突然撤空 ask；前者增加显示承诺，后者减少显示承诺，其韧性含义不同。
        </p>
        <div className="equation-card">
          <span>至少保留三个互补投影</span>
          <div>NetOFI<sub>I</sub>=Σe<sub>n</sub>　；　GrossOFI<sub>I</sub>=Σ|e<sub>n</sub>|<br />Composition<sub>I</sub>=(Add<sup>±</sup>, Cancel<sup>±</sup>, Execute<sup>±</sup>, QuoteMove<sup>±</sup>)</div>
          <p>Net 允许相消，gross 不允许；composition 再把相同方向拆回动作来源。三者共同报告，才不会把安静市场与剧烈双向重写混为一谈，也不会把供给新增与供给撤回赋予相同机制。</p>
        </div>
        <p>
          若还关心事件顺序，应保留序列或路径特征。+1,000 后 −1,000 与 −1,000 后 +1,000 具有相同窗口净额与 gross，却可能先后触发不同价格、排队和策略响应。这正是后续模型使用 order-flow history 而非单一窗口总数的理由之一。<Cite n={19} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="clocks">
        <p className="section-kicker">13 · 聚合时钟</p>
        <h2>十个事件、一秒和一万股不是同一个观察窗口。</h2>
        <p>
          Calendar-time bucket 固定真实时间，适合对齐公告、交易期限和跨资产数据，却让活跃时段包含更多事件；event-time bucket 固定消息或成交数量，更接近“经历多少次状态更新”，却把一分钟的风险暴露与一毫秒压成同样长度；volume-time bucket 固定累计成交量，便于比较交易活动尺度，却通常无法完整容纳未成交的 add/cancel flow。没有一个时钟无条件优越。
        </p>
        <div className="table-scroll" role="region" aria-label="订单流聚合时钟比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>时钟选择必须由目标决定</caption>
            <thead><tr><th scope="col">时钟</th><th scope="col">固定什么</th><th scope="col">适合回答</th><th scope="col">主要混淆</th></tr></thead>
            <tbody>
              <tr><th scope="row">Calendar time</th><td>秒、分、日</td><td>真实等待、公告反应、跨市场同步</td><td>活动率与日内季节性</td></tr>
              <tr><th scope="row">Book-event time</th><td>消息条数</td><td>每次簿更新后的状态转移</td><td>真实延迟与事件大小</td></tr>
              <tr><th scope="row">Trade time</th><td>成交笔数</td><td>成交序列与符号持续性</td><td>删除未成交信息</td></tr>
              <tr><th scope="row">Volume time</th><td>累计成交量</td><td>按经济活动尺度比较执行</td><td>无法自然计量撤单与新增</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          稳健研究通常报告至少一个真实时间与一个事件时钟，并在训练/测试中保持同一构造。若窗口按“直到价格变化”为止自适应结束，标签已经参与定义特征边界；这可以研究 hitting time（首次到达指定状态所需的时间）机制，却不能伪装成普通固定时点预测。
        </p>
      </section>

      <section className="lesson-section" id="normalization">
        <p className="section-kicker">14 · 归一化</p>
        <h2>一千股的方向压力只有放回当时容量、价格与活动率中才可比较。</h2>
        <p>
          Raw OFI 保留可解释的队列数量，但跨证券、跨时段甚至同一证券不同状态不可直接比较。常见尺度包括窗口开始时或此前滚动估计的相关 depth、日内同时段的典型 depth、流通股本、成交量、事件数和波动。分母选择其实在陈述机制：除以 depth 是问“相对可见承接有多强”，除以 volume 是问“相对成交活动有多偏”，二者不应被写成同一个指标。
        </p>
        <div className="equation-card">
          <span>一个可审计的容量归一化示例</span>
          <div>nOFI<sub>t,h</sub> = OFI<sub>(t−h,t]</sub> / D<sup>pre</sup><sub>t</sub></div>
          <p>D<sup>pre</sup><sub>t</sub> 必须在特征截止时点 t 已经可得，并明确是 best depth、前 K 档、固定 bp 带还是历史条件均值。用整日平均、目标窗末状态或事后筛选出的“正常深度”都会泄漏未来。</p>
        </div>
        <p>
          Cont–Kukanov–Stoikov 使用 NYSE TAQ consolidated quotes / trades，在从当月 S&amp;P 500 成分股中随机抽取的 50 只美国股票样本中发现，同一 OFI 对价格的回归斜率与平均市场深度大致成反比，这提供了容量归一化的经验动机；但比例关系、系数和最佳分母都受样本、时间尺度与市场结构限制。它不是“除以 depth 后所有资产共用一个阈值”的定律。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="queue-imbalance">
        <p className="section-kicker">15 · Queue imbalance 是状态</p>
        <h2>它比较此刻两侧库存，不记录这些库存怎样到达。</h2>
        <p>
          对最优买卖队列 Q<sup>B</sup><sub>t</sub>、Q<sup>A</sup><sub>t</sub>，常见的归一化 queue imbalance 为：
        </p>
        <div className="equation-card">
          <span>Top-of-book queue imbalance</span>
          <div>QI<sub>t</sub> = [Q<sup>B</sup><sub>t</sub>−Q<sup>A</sup><sub>t</sub>] / [Q<sup>B</sup><sub>t</sub>+Q<sup>A</sup><sub>t</sub>] ∈ [−1,1]</div>
          <p>在两侧数量之和大于零时，若 bid=800、ask=200，则 QI=0.6；若分母为零，QI 不定义。它只说当前 best bid 相对更厚；没有前一快照或消息序列，就无法知道观察窗 OFI。相同 QI 可以由 bid 新增、ask 执行、ask 撤单或价格移动等不同路径产生。</p>
        </div>
        <p>
          Gould 与 Bonart 在 10 只高流动性 Nasdaq 股票上检验 queue imbalance 对下一次 mid-price 方向的预测，发现相对简单基准的改善在 large-tick 股票更强、small-tick 股票较温和。这个结果建立了“局部队列状态—下一跳方向”的特定样本证据，不保证固定日历时间收益、成本后利润，也不能把 QI 改名成 OFI。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="microprice">
        <p className="section-kicker">16 · Weighted mid 与 micro-price</p>
        <h2>队列不对称可以把中价向较薄一侧调整，但这是状态估值，不是事件流。</h2>
        <p>
          一个常见的 queue-weighted mid 把更大的 bid queue 赋予 ask 更高权重，把更大的 ask queue 赋予 bid 更高权重：
        </p>
        <div className="equation-card">
          <span>Queue-weighted mid 的简单形式</span>
          <div>m<sup>w</sup><sub>t</sub> = [a<sub>t</sub>Q<sup>B</sup><sub>t</sub> + b<sub>t</sub>Q<sup>A</sup><sub>t</sub>] / [Q<sup>B</sup><sub>t</sub>+Q<sup>A</sup><sub>t</sub>]</div>
          <p>Bid queue 越厚，m<sup>w</sup> 越靠近 ask，表达“向上耗尽相对更可能”的局部直觉。它由当前报价与队列构造，不是 OFI，也不是对所有市场都无偏的基本价值估计。</p>
        </div>
        <p>
          Stoikov 的 micro-price 更一般：它把 order-book imbalance 和未来 mid-price 状态转移纳入条件期望，并在其高频数据中优于 mid 与简单 weighted mid 的短期预测。实务中人们有时把上述简单式也口语称为 microprice，但严谨写作应明确是 heuristic weighted mid 还是经状态转移估计的 micro-price。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="mlofi">
        <p className="section-kicker">17 · Multi-level OFI</p>
        <h2>深层事件不是“更多同一种数字”，而是一组有位置的方向流。</h2>
        <p>
          Best-level OFI 看不到第二档以下的新增与撤回，也看不到即将成为 best 的深度形状。MLOFI 对相对 mid 或相对 best 的多个占据档位分别计算事件贡献，形成向量 <strong>OFI</strong><sub>t</sub>=(OFI<sup>(1)</sup>,…,OFI<sup>(M)</sup>)。当 M=1 时才退化为 best-level 版本；当 M&gt;1 时，不能在没有经济或统计理由的情况下直接求和，因为不同层的价格距离、tick 与进入 best 的概率不同。
        </p>
        <div className="equation-card">
          <span>多层信息进入模型的三种透明方式</span>
          <div>Δm<sub>t</sub> = α + Σ<sub>r=1</sub><sup>M</sup>β<sub>r</sub>OFI<sup>(r)</sup><sub>t</sub> + ε<sub>t</sub><br />或　z<sub>t</sub>=w′<strong>OFI</strong><sub>t</sub>　；　或直接保留 <strong>OFI</strong><sub>t</sub> 进入非线性模型</div>
          <p>逐层回归保留每层系数；线性投影必须说明权重 w 是预先设定、训练估计还是主成分；非线性模型仍需样本外验证。无论哪种方式，都不能把训练后权重倒写成先验市场定律。</p>
        </div>
        <p>
          Xu、Gould 与 Howison 在六只流动性较高的 Nasdaq 股票样本中发现，加入多个价位的 OFI 能改善相对于 best-level OFI 的拟合，但效果与股票的平均 spread 等特征有关。这是“深层流量有增量信息”的证据，同时也是明确的样本与规格边界。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="mechanism-mixture">
        <p className="section-kicker">18 · 为什么 order flow 携带信息</p>
        <h2>它不是一个纯粹信息信号，而是多种动机经过同一市场接口后的混合结果。</h2>
        <p>
          第一条路径是<strong>私人信息</strong>：知情者不愿直接公开估值，而通过交易逐步进入；做市者从意外方向流更新价值判断。第二条是<strong>公共信息反应</strong>：新闻同时改变许多人的估值，订单流记录谁先行动和流动性如何撤回，但不是新闻本身的独立原因。第三条是<strong>库存与风险转移</strong>：中介或投资者需要卸载已有风险，即使没有新信息也会产生方向压力。第四条是<strong>机械约束</strong>：指数调仓、保证金、期权 delta 对冲、基金申赎和执行算法会把外部规则转化为持续订单。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <p>
          这些路径会在同一观测量中叠加。正 OFI 后价格上涨，可能因为买方拥有信息，也可能因为 ask 被库存受限的报价者撤掉，还可能因为公共新闻先同时推高估值和买单。Order flow 是价格形成的近端 sufficient-looking statistic，却不是远端动机的标签。要识别动机，必须引入参与者身份、新闻时间、库存代理、制度变化或更强结构假设。
        </p>
        <div className="interface-grid">
          <article><span>INFORMATION</span><h3>估值更新</h3><p>意外订单让报价者修正对基本价值或对手方知情概率的判断。</p></article>
          <article><span>INVENTORY</span><h3>风险再分配</h3><p>承接一侧流量后，报价者改价、缩量或吸引反向交易以恢复库存。</p></article>
          <article><span>MECHANICAL</span><h3>约束执行</h3><p>对冲、申赎、强平与基准跟踪产生可预测的需求，却未必包含新基本面信息。</p></article>
          <article><span>STRATEGIC</span><h3>拆分与隐藏</h3><p>大目标被拆成小订单，过去流量因未完成的母单而包含未来行为线索。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="endogeneity">
        <p className="section-kicker">19 · 订单流是内生的</p>
        <h2>参与者根据订单簿选择何时交易，订单簿又被这些选择改变。</h2>
        <p>
          若一位大买家只在 ask depth 较厚时执行，那么“买单后深度高”可能反映择时，而不是买单创造了流动性；若价格先因相关期货上升，股票买单随后追随，那么 order flow 是价格发现的响应；若做市者看到持续买流就撤 ask，OFI 与价格的关系又包含策略反馈。把 order flow 当成外生冲击会切断这条双向链。
        </p>
        <div className="mechanism-chain" aria-label="订单流内生反馈链">
          {[
            ['前状态', 'spread、depth、波动、新闻与相关市场'],
            ['交易择时', '参与者选择方向、激进度、数量和场所'],
            ['订单流出现', '成交、新增、撤单和报价移动被带符号聚合'],
            ['他人观察', '做市、套利与执行算法更新风险和策略'],
            ['流动性响应', '队列补充、撤回、改价与跨场所迁移'],
            ['新前状态', '结果再次决定下一批订单的选择'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Hasbrouck 用交易与 quote revision 的 VAR 把“意外交易”与后续价格响应放进同一动态系统，正是为了避免把所有可预测订单都当作新信息；Madhavan、Richardson 与 Roomans 则在交易级结构模型中同时表示公共信息和微观结构效应。模型能在假设下分解响应，却不免除对时间顺序、遗漏变量和结构稳定性的检查。<Cite n={3} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="persistence">
        <p className="section-kicker">20 · 为什么同方向流会持续</p>
        <h2>大目标被拆分，是短周期 order-sign persistence 的核心候选机制之一。</h2>
        <p>
          一家机构若需要买入远大于近端深度的数量，一次暴露全部需求会迅速推高价格并泄露意图。它通常把母单拆成许多子单，跨时间和场所执行。只要目标尚未完成，过去出现买单就提高未来继续出现买单的概率。另一种解释是 herding：不同主体因共同信号、模仿或同类约束而同向行动。两者都产生符号自相关，却对应不同主体结构。
        </p>
        <p>
          Tóth、Palit、Lillo 与 Farmer 利用伦敦证券交易所 member identifiers，将同一成员与不同成员的订单流相关分开；在其数据与模型假设下，短于数小时的持续性主要来自同一成员的分拆，而非不同成员间 herding。成员并不等于最终投资者，broker choice 仍需建模；该结论也不否认较慢频率上的机构群体行为。<Cite n={15} />
        </p>
        <aside className="precision-note">
          <span>可预测的是行为概率，不是无成本套利承诺</span>
          <p>即使下一单方向可预测，市场也可能早已通过更薄的同侧流动性、更小的单笔冲击、更宽的 spread 或更快的报价调整吸收这份可预测性。方向持续与收益持续不是同一命题。</p>
        </aside>
      </section>

      <section className="lesson-section" id="efficiency-puzzle">
        <p className="section-kicker">21 · 长记忆与近似随机价格</p>
        <h2>若买单符号长期可预测，为什么价格没有同样显著的单向可预测性？</h2>
        <p>
          Lillo 与 Farmer 在其 LSE 样本中发现订单符号具有长记忆：自相关随滞后缓慢衰减。若每个买单产生相同且永久的正冲击，持续买流会让收益呈明显正自相关，形成容易利用的趋势。但真实市场会适应：当买单已经可预期，ask 侧可能补得更深、单笔价格反应变小，或相反方向的限价流提供均值回复；只有订单流的意外成分获得较大边际响应。<Cite n={13} />
        </p>
        <div className="equation-card">
          <span>“意外流量”而非“全部流量”的直觉表达</span>
          <div>Surprise<sub>t</sub> = ε<sub>t</sub> − E[ε<sub>t</sub> | 𝓘<sub>t−</sub>]<br />Δm<sub>t</sub> ≈ λ<sub>t</sub>·Surprise<sub>t</sub> + liquidity response + noise</div>
          <p>若连续买单已经高度可预期，第二项 E[ε|𝓘] 会吸收其中一部分；λ 还会随 depth、spread 和状态改变。这个式子是机制示意，不是本节要估计的唯一结构模型。</p>
        </div>
        <p>
          Bouchaud、Gefen、Potters 与 Wyart 用交易符号的持续性与随时间衰减的影响核讨论价格近似扩散的精细平衡；不同理论可以通过“非对称流动性”或“影响逐步衰减”解释同一宏观现象。关键不是背诵唯一答案，而是看到反馈约束：<strong>市场若长期容纳可预测订单流，流动性响应和边际影响就不能保持不变。</strong><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="contemporaneous-model">
        <p className="section-kicker">22 · 同窗价格形成关系</p>
        <h2>OFI 与同一短窗价格变化的线性关系首先是解释模型，不是预测模型。</h2>
        <p>
          令 Δm<sub>k</sub> 为窗口 I<sub>k</sub> 从起点到终点的 mid-price 变化，Cont–Kukanov–Stoikov 研究的核心简化可以写成：
        </p>
        <div className="equation-card">
          <span>短窗口的 contemporaneous price-formation regression</span>
          <div>Δm<sub>k</sub> = α + β·OFI<sub>k</sub> + ε<sub>k</sub>，　β&gt;0<br />β ≈ c / AverageDepth</div>
          <p>同一窗口里，正 OFI 与正 mid change 通常同向；较薄市场的同量 OFI 对价格更敏感。这里 OFI 与 Δm 共享终点，β 描述窗口内共同变化，不能直接读取为在窗口开始时已知的交易信号。</p>
        </div>
        <p>
          在其 TAQ 50 只股票样本和短时间尺度上，作者发现这条关系近似线性、对深度具有反比例尺度，并且比单用 trade volume 的关系更稳健。文中约 65% 的平均 R²（决定系数，即回归在该样本内解释的同窗价格变动比例）属于特定 10 秒同窗回归结果；它不是“提前十秒预测 65% 价格变化”，也不是所有市场的参数常数。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="cks-evidence">
        <p className="section-kicker">23 · 经典经验结果怎样读</p>
        <h2>最重要的不是记住一个 R²，而是理解为何全事件不平衡比单看成交量更贴近订单簿守恒。</h2>
        <p>
          Cont、Kukanov 与 Stoikov 使用 2010 年 4 月的 TAQ consolidated quotes / trades，从当月 S&amp;P 500 成分股中随机选取 50 只股票，比较短窗口 mid-price change 与 OFI。其结果支持三个相互连接的判断：第一，best bid/ask 的供需变化包含 market orders、limit orders 与 cancellations，因而比无方向 volume 更接近近端队列变化；第二，短窗价格变化与 OFI 在样本中近似线性；第三，价格敏感度随平均 depth 增加而下降。<Cite n={8} />
        </p>
        <div className="research-card">
          <span>READ THE ESTIMAND</span>
          <h3>论文回答的是“同一短窗内，价格变化与净队列事件如何共同变化”</h3>
          <p><strong>支持：</strong>在指定样本、时间尺度和 best-level 构造下，OFI 对 contemporaneous price changes 有高解释力，且在股票—半小时子样本中估计的 OFI–price-change 回归斜率与平均 depth 有系统关系。</p>
          <p><strong>不支持：</strong>窗口起点可无成本预测终点；每一单位 OFI 都是外生冲击；系数可原样迁移到期货、A 股、加密资产或其他年份；约 65% 同窗 R² 等于方向命中率或利润率。</p>
        </div>
        <p>
          这也是科学阅读的关键：一个测量构造可以非常成功，同时只解决价格形成链上的一段。在该样本、best-level 构造和同窗设定中，结果支持“带方向的队列事件流比仅看成交量更有解释力”，却仍把事件动机、未来可预测性、持久影响和执行价值留给新的研究设计。
        </p>
      </section>

      <section className="lesson-section" id="forecast-boundary">
        <p className="section-kicker">24 · Explanation、forecast、causality 与 trading</p>
        <h2>四个命题必须逐级验证，前一级成立不会自动推出后一级。</h2>
        <div className="table-scroll" role="region" aria-label="订单流研究四种命题比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一个 OFI 变量可以进入四种完全不同的研究问题</caption>
            <thead><tr><th scope="col">命题</th><th scope="col">时间结构</th><th scope="col">最低证据</th><th scope="col">仍不能声称</th></tr></thead>
            <tbody>
              <tr><th scope="row">同窗解释</th><td>X[t,t+h] 与 Y[t,t+h]</td><td>定义一致、稳健回归与残差审计</td><td>t 时点可预测</td></tr>
              <tr><th scope="row">向前预测</th><td>X≤t → Y(t,t+h]</td><td>严格样本外、时间切分、无重叠泄漏</td><td>X 是外生原因</td></tr>
              <tr><th scope="row">因果效应</th><td>对 order flow 的可识别干预</td><td>可信反事实、自然实验或结构假设</td><td>现实可交易</td></tr>
              <tr><th scope="row">交易价值</th><td>预测→下单→成交→退出</td><td>spread、fee、latency、queue、impact 后 P&amp;L</td><td>容量无限或长期稳定</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个干净的 forecast 在时点 t 冻结信息集 𝓘<sub>t</sub>，只使用时间戳不晚于 t 的事件、报价和过去滚动尺度，目标从 t 之后才开始。若样本由重叠窗口构成，训练和测试边界还要 purging（移除标签窗口与边界重叠的样本）与 embargo（在切分边界留出缓冲期）；随机拆分相邻毫秒窗口会让几乎相同的事件历史出现在两边。模型选择、标准化和阈值也必须只在训练期完成。
        </p>
        <div className="equation-card">
          <span>真正的向前目标</span>
          <div>x<sub>t</sub>=f(events≤t, state≤t)　；　y<sub>t,h</sub>=g(price on (t,t+h])<br />Estimate on train　→ tune on validation　→ report once on later test</div>
          <p>特征与标签不重叠只是第一关；还要处理相邻样本共享未来路径、日内季节性、类别不平衡、价格离散化、跨证券分组和交易成本。</p>
        </div>
      </section>

      <section className="lesson-section" id="predictive-evidence">
        <p className="section-kicker">25 · 预测证据的层级</p>
        <h2>从单一队列状态到深层序列模型，增量信息增加，过拟合与可解释性成本也同步增加。</h2>
        <p>
          最简单的预测问题使用 QI<sub>t</sub> 预测下一次 mid move；Gould–Bonart 的 Nasdaq 结果显示强度依赖 tick regime。MLOFI 将多个层级的事件向量加入线性模型；Xu–Gould–Howison 的结果说明深层流量在其六股样本中可带来增量拟合。再往上，Sirignano–Cont 使用数十亿条美国股票报价与交易，把订单簿与 order-flow history 输入深度网络，并在不同股票与时期做样本外方向预测；历史路径的加入改善表现，且 pooled model 能迁移到训练外股票。<Cite n={10} /><Cite n={12} /><Cite n={19} />
        </p>
        <p>
          Kolm、Turiel 与 Westray 在 115 只 Nasdaq 股票上比较原始订单簿状态与基于 order flow 的平稳化输入，发现后者在其多期限预测设计中表现更好；作者同时报告，股票特定预测的有效期限大约集中在两个平均价格变化。这个结论恰好提醒我们：高频信号半衰期很短，统计模型必须和实际延迟、成交概率与退出规则一起评估。<Cite n={21} />
        </p>
        <aside className="precision-note">
          <span>“Deep OFI”不是一条公认唯一公式</span>
          <p>它通常指由多层订单流、历史窗口和神经网络组成的一类特征与模型。论文中的输入张量、标签、归一化、抽样时钟和损失函数共同定义模型；不能把这个名称当作像 best-level OFI 那样唯一的微观结构统计量。</p>
        </aside>
      </section>

      <section className="lesson-section" id="data-engineering">
        <p className="section-kicker">26 · 数据协议先于统计模型</p>
        <h2>消息语义、序列顺序与场所范围错一层，精美 OFI 就只是错误账本的总和。</h2>
        <p>
          构造事件流前要回答：时间戳来自交易所还是接收端；同一纳秒怎样排序；replace 是单独事件还是 delete+add；partial execution 与 full deletion 如何区分；隐藏订单补显是否有标记；开盘、收盘、停牌和交易纠错消息怎样处理；quote 是单场所还是 NBBO（全美最优买卖报价）；odd lot（小于标准整手的零股交易）、off-exchange（交易所外成交）与 auction 是否在可见范围内。Nasdaq TotalView-ITCH 规范就明确区分 add order、order executed、order cancel、order delete、order replace 与 trade 等消息；具体研究必须按所用版本解析，而不是凭字段名猜测。<Cite n={20} />
        </p>
        <div className="table-scroll" role="region" aria-label="订单流数据质量审计清单，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>在计算任何 OFI 之前应通过的消息级检查</caption>
            <thead><tr><th scope="col">层</th><th scope="col">检查</th><th scope="col">失败时的后果</th></tr></thead>
            <tbody>
              <tr><th scope="row">顺序</th><td>sequence gap、重复、乱序、同时间戳规则</td><td>凭空出现负队列或错误价格跳变</td></tr>
              <tr><th scope="row">生命周期</th><td>add→partial fill→cancel/delete/replace</td><td>成交与撤单重复扣减</td></tr>
              <tr><th scope="row">可见范围</th><td>场所、odd lot、hidden、off-book、auction</td><td>把局部可见流写成全市场需求</td></tr>
              <tr><th scope="row">单位</th><td>股/张、lot multiplier、价格精度、公司行动</td><td>跨日或跨合约尺度断裂</td></tr>
              <tr><th scope="row">重建</th><td>每条消息后 best quote 与独立快照核对</td><td>OFI 公式正确但输入状态错误</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          多场所市场还存在 observation boundary：A 场所的正 OFI 可能只是流动性迁往 B，NBBO 改变也可能由另一场所先更新。若数据只覆盖单场所，结论应写成“该场所可见 order flow”，不能写成“全市场真实买压”。
        </p>
        <aside className="precision-note">
          <span>Resting side 不等于 aggressor side</span>
          <p>某些重建数据的 Direction 字段描述簿上被执行的限价单：若它是 sell limit order，经济成交反而是 buyer-initiated。LOBSTER 还把 hidden execution 单列为 event type 5；此时可见订单簿快照可以与上一行相同，但成交确实发生，隐藏剩余量仍不可见。一个扫过多档的主动指令又可能生成多条 execution messages。研究者必须明确自己聚合的是消息级队列变化、经济成交，还是推断出的母级决定，不能把字段符号直接复制成 trade sign。<Cite n={23} /></p>
        </aside>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">27 · 互动实验</p>
        <h2>先预测符号与研究结论，再揭示公式。</h2>
        <p>
          第一组训练逐事件方向：同价新增与撤单、最优价改善、signed trades，以及净额抵消。第二组训练研究边界：queue state 与 flow、容量归一化、同窗泄漏，以及准确率与成本后收益。每题都故意保留一个常见误区，提交后才显示计算与诊断。
        </p>
        <OrderFlowLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">28 · 反例库</p>
        <h2>强正 imbalance 不必上涨，价格上涨也不必由本地正 imbalance 引起。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>正 OFI，价格不动</h3><p>Ask 侧隐藏量持续补显，或远端深度迅速进入 best；显示事件压力被潜在/隐藏承接吸收。</p></article>
          <article><span>反例 02</span><h3>正 OFI，随后下跌</h3><p>相关期货先因负面新闻下跌，本地买单只是旧价上的抄底或做市库存回补；跨市场信息支配本地流量。</p></article>
          <article><span>反例 03</span><h3>OFI 为零，波动很大</h3><p>巨大正负事件在窗口内抵消，或先上后下；净额删除了 gross activity 与顺序。</p></article>
          <article><span>反例 04</span><h3>QI 很正，下一跳仍向下</h3><p>厚 bid 可瞬间撤回、被隐藏卖单穿透，或价格在另一场所先变；QI 只给条件概率，不给确定结果。</p></article>
          <article><span>反例 05</span><h3>同窗 R² 高，未来方向分类的 ROC AUC≈0.5</h3><p>在该二分类设定下，ROC AUC 约 0.5 接近随机；它是分类性能指标，与 1.07 的恢复损失面积 loss AUC 不同。输入虽然很好解释已经发生的同窗价格形成，却在 t 时点不可得。</p></article>
          <article><span>反例 06</span><h3>命中率 56%，策略亏损</h3><p>微弱 gross edge 被 spread、fee、排队失败、slippage、latency 与自身 impact 吞噬。</p></article>
        </div>
        <p>
          日频证据也说明可迁移性有限。Chordia、Roll 与 Subrahmanyam 在 1988–1998 NYSE 全市场样本中发现 contemporaneous imbalance、流动性与市场收益关系，但没有一般的一日后市场收益预测；Chordia–Subrahmanyam 对个股建立了带订单拆分与库存的日频关系。Shenoy–Zhang 在 2004 年沪深样本看到强同日关系，却没有随后收益预测。不同市场与频率的结果并不互相否定，而是在提醒：变量定义、制度和时间尺度共同决定 estimand。<Cite n={16} /><Cite n={17} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">29 · 可证伪研究设计</p>
        <h2>把“OFI 有用”改写成一组会失败的、按时间封存的检验。</h2>
        <p>
          一个最低限度的研究问题可以写成：在单一证券—场所—交易阶段内，仅使用 t 前 500 个 book events 构造 best-level OFI、gross flow、QI 与 pre-state depth，能否相对于只含 spread、depth、volatility 与 time-of-day 的基线，提高下一次 mid-price movement 的概率预测？增量必须在更晚日期、不同日与不同事件的严格样本外数据上成立，并分别报告 large-tick / small-tick、活跃/安静、新闻/非新闻状态。
        </p>
        <div className="table-scroll" role="region" aria-label="OFI 可证伪研究协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从问题到失败条件的预注册骨架</caption>
            <thead><tr><th scope="col">模块</th><th scope="col">预先固定</th><th scope="col">失败条件</th></tr></thead>
            <tbody>
              <tr><th scope="row">数据</th><td>venue、feed version、消息过滤、交易阶段</td><td>重建无法通过 sequence 与 snapshot 对账</td></tr>
              <tr><th scope="row">特征</th><td>截止时点、层级、时钟、分母、缺失处理</td><td>任何分母或分类器使用目标后的信息</td></tr>
              <tr><th scope="row">标签</th><td>next move / 固定 horizon、mid/quote、零变化处理</td><td>特征窗与目标窗重叠</td></tr>
              <tr><th scope="row">基线</th><td>prior probability、QI、state-only、简单线性模型</td><td>复杂模型未稳定超过简单基线</td></tr>
              <tr><th scope="row">验证</th><td>walk-forward（始终用较早时期训练、较晚时期检验）、purging、股票分组、校准</td><td>收益只存在于随机切分或单一时期</td></tr>
              <tr><th scope="row">交易层</th><td>延迟、队列、手续费、滑点、仓位与退出</td><td>成本后净优势≤0 或容量不可接受</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          反驳比漂亮图更重要：若打乱窗口内事件方向后表现不降，模型可能只学到活动率；若只用 QI 就达到同样结果，复杂 OFI 没有增量；若结果仅在同窗标签成立，所谓预测是时间泄漏；若换一个 venue、tick regime 或月份即失效，模型捕捉的是制度局部关系而非稳定机制。
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">30 · 主动练习</p>
        <h2>先独立计算与设计，再展开参考答案。</h2>
        <div className="exercise-list">
          <article className="practice-problem">
            <span>练习一 · 完整 best-level OFI</span>
            <p><strong>题目。</strong>初始 bid 50.00×600、ask 50.02×500。依次发生：bid 同价撤 150；ask 同价加 200；新 bid 50.01×300 成为 best；旧 ask 50.02 的 250 股被执行后，ask 仍为 50.02×450。逐项计算贡献与净 OFI。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>Bid 同价 600→450，贡献 −150。Ask 同价 500→700，ask 增加使总 OFI 贡献 −200。Bid 从 50.00 改善到 50.01，新 best queue 整体贡献 +300。Ask execution 使 700→450，ask 减少 250，贡献 +250。净 OFI=−150−200+300+250=+200 股。最后的 ask 数量 450 已含本次执行后的状态，不能再扣第二次。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习二 · State 与 flow 可以相反</span>
            <p><strong>题目。</strong>t₀ 时 bid=900、ask=100；下一秒 bid 撤 700、ask 加 300，价格均不变。计算 t₀ 的 QI、该秒 OFI 和 t₁ 的 QI，并解释为何单看 t₁ 快照会丢失什么。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>t₀ QI=(900−100)/1000=0.8。Bid 撤 700 贡献 −700，ask 加 300 贡献 −300，所以 OFI=−1,000。t₁ bid=200、ask=400，QI=(200−400)/600=−1/3。t₁ 快照保留最终卖方偏厚状态，却不告诉你它由大量 bid cancel 与 ask add 共同生成，也看不到过程的 gross rewriting。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习三 · 长记忆不等于价格趋势</span>
            <p><strong>题目。</strong>某市场下一单方向可由过去符号以 65% 准确率预测，但 mid-return 几乎无自相关。给出至少两种相容机制，并说明哪一种额外数据能帮助区分。</p>
            <details className="practice-answer"><summary>展开机制答案</summary><p>机制一是非对称流动性：可预测买单到来前 ask 更深或补单更快，使同方向单笔冲击变小；可用逐事件 depth、cancel/add response 与条件 price impact 检验。机制二是 impact decay：初始冲击逐渐回撤，持续流与衰减影响共同形成近似扩散；可估计不同滞后的 response kernel。还可分解 same-member 与 cross-member flow，以判断 order splitting 和 herding。仅有方向命中率不能区分这些机制。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习四 · 设计无泄漏预测</span>
            <p><strong>题目。</strong>你有逐消息订单簿数据，想预测未来 5 秒 mid-price 方向。写出特征截止、标签、归一化、拆分、基线、成本评估和一个 placebo；指出最可能的泄漏点。</p>
            <details className="practice-answer"><summary>展开研究方案</summary><p>在 t 冻结数据，用 (t−10s,t] 或固定过去事件数构造 OFI、gross、composition、QI、spread、pre-depth 和日内时点；标签只看 (t,t+5s]。归一化尺度只用 t 前滚动样本。按日期 walk-forward，并 purging 掉跨边界的五秒标签；基线至少含无条件概率、state-only QI 和简单 logistic。成本层加入信号延迟后的可成交报价、queue fill、fee、spread、slippage 与退出。Placebo 可随机翻转或在日内块内错位 OFI direction。最常见泄漏是用目标窗内事件构造 OFI、用整日 depth 标准化，或让重叠标签跨训练测试。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">31 · 理解检查</p>
        <h2>能够回答这些问题，才算真正掌握定义与边界。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么“一笔买单”仍然有卖方？</summary><p>因为每笔成交都由买卖双方共同完成；“买方发起”只表示买方接受当时报价、索取流动性并触发成交。</p></details>
          <details><summary>02 · Trade imbalance 与 OFI 的最大差异是什么？</summary><p>前者只聚合买卖方向成交；best-level OFI 还包含最优报价处限价新增、撤单及价格边界变化。</p></details>
          <details><summary>03 · 为什么 ask cancel 对 OFI 是正贡献？</summary><p>卖方近端承接减少，向上耗尽相对更容易；正号表示买方侧净压力，不表示市场总挂单增加。</p></details>
          <details><summary>04 · Bid price 改善时为何只计新队列？</summary><p>新旧数量位于不同价格；新 best 整体进入边界，旧 best 可能仍在第二档，不能用新减旧。</p></details>
          <details><summary>05 · QI=0.6 为什么不能推出 OFI=0.6？</summary><p>QI 是当前存量比例；OFI 是窗口内事件流。没有历史就不知道当前状态通过什么路径形成。</p></details>
          <details><summary>06 · Net OFI=0 为什么不等于无活动？</summary><p>巨大正负事件可以抵消。还需 gross absolute flow、事件构成和顺序识别市场重写强度。</p></details>
          <details><summary>07 · 同窗 OFI 回归为什么不是向前预测？</summary><p>特征包含了价格变化期间发生的事件；窗口起点并不知道这些未来事件。预测必须用 ≤t 信息指向 (t,t+h]。</p></details>
          <details><summary>08 · Order-sign persistence 为何不保证收益趋势？</summary><p>市场可通过状态依赖深度、非对称流动性、较小边际影响或 impact decay 吸收可预测方向。</p></details>
          <details><summary>09 · 多层 OFI 为什么不能无条件相加？</summary><p>不同层距 mid 不同、进入 best 的概率和经济含义不同；聚合需要明确权重或保留向量。</p></details>
          <details><summary>10 · 预测准确率显著为何仍可能亏损？</summary><p>方向优势还要穿过 latency、spread、fee、queue fill、slippage、自身 impact、仓位和退出规则。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">32 · 课程接口</p>
        <h2>本节完成“事件怎样成为方向信号”，下一步才追问这份信号怎样进入价格并跨市场传播。</h2>
        <div className="interface-grid">
          <article><span>← 1.07</span><h3>Depth &amp; Resiliency</h3><p>上一节把 add、cancel、execution 记成深度账本；本节给它们方向并聚合成订单流。</p></article>
          <article><span>→ 1.09</span><h3>Price Impact</h3><p>将区分即时机械冲击、库存压力、信息成分、暂时与持久影响，并处理交易规模的非线性。</p></article>
          <article><span>→ Chapter 2</span><h3>Participant Constraints</h3><p>把匿名事件重新连接到做市、机构执行、对冲、套利与强制交易的目标和约束。</p></article>
          <article><span>→ 7.18</span><h3>Lead–Lag</h3><p>检验一个场所或资产的流量是否在严格时间顺序下增量预测另一个市场，而非共同新闻的同步反应。</p></article>
        </div>
        <p className="closing-thesis">看到“买卖不平衡”时，不要先问它是否看涨；先问：谁被定义为主动方，输入是成交还是全部簿事件，变量是 state 还是 flow，观察了哪些价位与场所，用什么时钟和分母，特征何时可得，关系是同窗、预测还是因果，以及微弱优势能否穿过真实执行成本。只有这些问题有清晰答案，order flow 才从市场黑话变成可验证的价格形成语言。</p>
      </section>
    </>
  );
}

export const lesson108: LessonRecord = {
  slug: '1-08',
  id: '1.08',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Order Flow 与 Order Flow Imbalance',
  subtitle: '从成交主动方与订单簿事件出发，构造可审计的方向压力，并把同窗解释、向前预测、因果识别与交易价值严格分开',
  readingTime: '约 85–90 分钟（核心阅读 53–54＋互动 12–14＋主动练习与检查 20–22）',
  prerequisite: '1.03 · Order Type、1.04 · Limit Order Book；建议先完成 1.07 · Market Depth 与 Resiliency，并按需回看 T08 Time Scale',
  updatedAt: '2026-08-28',
  revision: '1.08-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.08-r1',
      summary: '要求补全 TI 零成交窗的定义域，修正 CKS 样本、斜率估计设计与证据强度表述，校正阅读时长算术，并将动态 ITCH 规范年份改为 n.d.。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.08-r1',
      summary: '要求打破八题答案的机械循环，修复揭示、重试与下一题的键盘/读屏焦点，区分 ROC AUC 与 1.07 loss AUC，并补充术语释义、分组语义、非颜色当前态和标签字号。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.08-r2',
      summary: '要求将动态更新的 Nasdaq ITCH 规范年份改为 n.d.，并恢复 Tóth、Palit、Lillo 与 Farmer 论文正式卷期的 2015 出版年。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.08-r2',
      summary: '要求将事件字母表中 LIMIT ADD、CANCEL / DELETE 与 EXECUTION 三个核心语义标签从 8px 提高至 12px。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.08-r3',
      summary: '通过：TI 定义域、CKS 样本与估计边界、全部公式与单位、4 道练习、8 道互动及 23 条引用均复核无误，Tóth et al. 与动态 ITCH 规范年份已准确区分。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.08-r3',
      summary: '通过：答案位置无机械循环，prediction-first 与逐项诊断完整，键盘/读屏焦点、非颜色当前态、语义标签字号、响应式布局与术语解释均无回归。',
    },
  ],
  previous: { slug: '1-07', label: '1.07 Market Depth 与 Resiliency' },
  next: { slug: '1-09', label: '1.09 Price Impact：订单为什么推动价格' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'from-intention-to-event', label: '从意愿到事件' },
    { id: 'aggressor', label: '成交主动方' },
    { id: 'terminology-map', label: '名词地图' },
    { id: 'signed-trade-flow', label: 'Signed trade flow' },
    { id: 'trade-classification', label: '成交方向推断' },
    { id: 'event-alphabet', label: '事件字母表' },
    { id: 'why-nontrades-matter', label: '未成交事件方向' },
    { id: 'ofi-definition', label: 'OFI 精确定义' },
    { id: 'branch-intuition', label: '价格分支' },
    { id: 'worked-ledger', label: '手算事件账本' },
    { id: 'price-jumps', label: '最优价跳变' },
    { id: 'net-gross-composition', label: 'Net 与 gross' },
    { id: 'clocks', label: '聚合时钟' },
    { id: 'normalization', label: '归一化' },
    { id: 'queue-imbalance', label: 'Queue imbalance' },
    { id: 'microprice', label: 'Weighted mid' },
    { id: 'mlofi', label: 'Multi-level OFI' },
    { id: 'mechanism-mixture', label: '信息机制混合' },
    { id: 'endogeneity', label: '内生反馈' },
    { id: 'persistence', label: '订单流持续性' },
    { id: 'efficiency-puzzle', label: '长记忆悖论' },
    { id: 'contemporaneous-model', label: '同窗价格关系' },
    { id: 'cks-evidence', label: '经典经验证据' },
    { id: 'forecast-boundary', label: '四种研究命题' },
    { id: 'predictive-evidence', label: '预测证据层级' },
    { id: 'data-engineering', label: '数据协议审计' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究设计' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson108Content,
  references: [
    {
      id: 1,
      authors: 'Albert S. Kyle',
      year: '1985',
      title: 'Continuous Auctions and Insider Trading',
      publication: 'Econometrica, 53(6), 1315–1335',
      url: 'https://doi.org/10.2307/1913210',
      use: '知情交易、噪声流量、价格对净订单流的均衡响应与 market depth；模型 order flow 不能与现实 CKS OFI 直接等同。',
    },
    {
      id: 2,
      authors: 'Lawrence R. Glosten & Paul R. Milgrom',
      year: '1985',
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      publication: 'Journal of Financial Economics, 14(1), 71–100',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
      use: '交易方向如何改变报价者对条件价值和逆向选择的判断；不意味着每笔主动交易都包含私人信息。',
    },
    {
      id: 3,
      authors: 'Joel Hasbrouck',
      year: '1991',
      title: 'Measuring the Information Content of Stock Trades',
      publication: 'Journal of Finance, 46(1), 179–207',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
      use: '交易与报价修订的 VAR、trade innovation 及其长期价格响应；结构解释依赖变量、滞后与冲击识别。',
    },
    {
      id: 4,
      authors: 'Ananth Madhavan, Matthew Richardson & Mark Roomans',
      year: '1997',
      title: 'Why Do Security Prices Change? A Transaction-Level Analysis of NYSE Stocks',
      publication: 'Review of Financial Studies, 10(4), 1035–1064',
      url: 'https://doi.org/10.1093/rfs/10.4.1035',
      use: '在交易级模型中联合表示公共信息、微观结构效应和日内价格形成；模型分解不等同于自然实验。',
    },
    {
      id: 5,
      authors: 'Charles M. C. Lee & Mark J. Ready',
      year: '1991',
      title: 'Inferring Trade Direction from Intraday Data',
      publication: 'Journal of Finance, 46(2), 733–746',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
      use: 'Quote test、tick test、价差内部成交和 1988 年数据报告延迟；历史五秒规则不是跨市场常数。',
    },
    {
      id: 6,
      authors: 'Katrina Ellis, Roni Michaely & Maureen O’Hara',
      year: '2000',
      title: 'The Accuracy of Trade Classification Rules: Evidence from Nasdaq',
      publication: 'Journal of Financial and Quantitative Analysis, 35(4), 529–551',
      url: 'https://doi.org/10.2307/2676254',
      use: '用 Nasdaq 真值方向量化分类误差及 inside-quote 难题；约 81.05% 的 Lee–Ready 准确率只属于该样本。',
    },
    {
      id: 7,
      authors: 'Bidisha Chakrabarty, Bingguang Li, Vanthuan Nguyen & Robert A. Van Ness',
      year: '2007',
      title: 'Trade Classification Algorithms for Electronic Communications Network Trades',
      publication: 'Journal of Banking & Finance, 31(12), 3806–3821',
      url: 'https://doi.org/10.1016/j.jbankfin.2007.03.003',
      use: 'INET ECN 中既有分类规则对价差内部成交的有限成功及场所特异误差；不能外推固定准确率。',
    },
    {
      id: 8,
      authors: 'Rama Cont, Arseniy Kukanov & Sasha Stoikov',
      year: '2014',
      title: 'The Price Impact of Order Book Events',
      publication: 'Journal of Financial Econometrics, 12(1), 47–88',
      url: 'https://doi.org/10.1093/jjfinec/nbt003',
      use: 'Best-level 单事件 OFI、10 秒同窗线性关系、约 65% 平均解释力、trade volume 对照与 inverse-depth scaling；不是提前预测结果。',
    },
    {
      id: 9,
      authors: 'Rama Cont & Adrien de Larrard',
      year: '2013',
      title: 'Price Dynamics in a Markovian Limit Order Market',
      publication: 'SIAM Journal on Financial Mathematics, 4(1), 1–25',
      url: 'https://doi.org/10.1137/110856605',
      use: '在明确 Markov 队列假设下，由两侧队列耗尽内生产生价格变化及条件方向概率；不是无条件经验定律。',
    },
    {
      id: 10,
      authors: 'Martin D. Gould & Julius Bonart',
      year: '2016',
      title: 'Queue Imbalance as a One-Tick-Ahead Price Predictor in a Limit Order Book',
      publication: 'Market Microstructure and Liquidity, 2(2), 1650006',
      url: 'https://doi.org/10.1142/S2382626616500064',
      use: '十只 Nasdaq 股票的下一次 mid-price 方向预测，以及 large-tick 与 small-tick 预测强度差异。',
    },
    {
      id: 11,
      authors: 'Sasha Stoikov',
      year: '2018',
      title: 'The Micro-Price: A High-Frequency Estimator of Future Prices',
      publication: 'Quantitative Finance, 18(12), 1959–1966',
      url: 'https://doi.org/10.1080/14697688.2018.1489139',
      use: '以 imbalance 和状态转移构造 micro-price，并与 mid、简单 weighted mid 做短期预测比较；样本结果不是普遍无偏价值。',
    },
    {
      id: 12,
      authors: 'Ke Xu, Martin D. Gould & Sam D. Howison',
      year: '2020',
      title: 'Multi-Level Order-Flow Imbalance in a Limit Order Book',
      publication: 'Market Microstructure and Liquidity, 4(3–4), 1950011',
      url: 'https://doi.org/10.1142/S2382626619500114',
      use: 'MLOFI 向量、多个占据档位、共线性与六只 Nasdaq 股票的增量同窗拟合；不能改写成严格未来 alpha。',
    },
    {
      id: 13,
      authors: 'Fabrizio Lillo & J. Doyne Farmer',
      year: '2004',
      title: 'The Long Memory of the Efficient Market',
      publication: 'Studies in Nonlinear Dynamics & Econometrics, 8(3), Article 1',
      url: 'https://doi.org/10.2202/1558-3708.1226',
      use: 'LSE 订单符号长记忆与流动性、数量适应使收益更接近白噪声的经验；指数值属于特定样本。',
    },
    {
      id: 14,
      authors: 'Jean-Philippe Bouchaud, Yuval Gefen, Marc Potters & Matthieu Wyart',
      year: '2004',
      title: 'Fluctuations and Response in Financial Markets: The Subtle Nature of Random Price Changes',
      publication: 'Quantitative Finance, 4(2), 176–190',
      url: 'https://doi.org/10.1080/14697680400000022',
      use: '持续交易符号与随时间衰减的影响共同形成近似扩散价格的 propagator 解释；不是唯一已识别机制。',
    },
    {
      id: 15,
      authors: 'Bence Tóth, Imon Palit, Fabrizio Lillo & J. Doyne Farmer',
      year: '2015',
      title: 'Why Is Equity Order Flow So Persistent?',
      publication: 'Journal of Economic Dynamics and Control, 51, 218–239',
      url: 'https://doi.org/10.1016/j.jedc.2014.10.007',
      use: '用 LSE 成员标识分解同成员与跨成员相关，在短周期把主要持续性归于订单拆分；成员不等于最终投资者。',
    },
    {
      id: 16,
      authors: 'Tarun Chordia, Richard Roll & Avanidhar Subrahmanyam',
      year: '2002',
      title: 'Order Imbalance, Liquidity, and Market Returns',
      publication: 'Journal of Financial Economics, 65(1), 111–130',
      url: 'https://doi.org/10.1016/S0304-405X(02)00136-8',
      use: '1988–1998 NYSE 日频市场不平衡、流动性与当日收益关系，以及一般不能预测下一日市场收益的边界。',
    },
    {
      id: 17,
      authors: 'Tarun Chordia & Avanidhar Subrahmanyam',
      year: '2004',
      title: 'Order Imbalance and Individual Stock Returns: Theory and Evidence',
      publication: 'Journal of Financial Economics, 72(3), 485–518',
      url: 'https://doi.org/10.1016/S0304-405X(03)00175-2',
      use: '个股日频订单拆分、库存承接与滞后不平衡关系；频率、估计方向和佣金边界不能迁移到高频常数。',
    },
    {
      id: 18,
      authors: 'Catherine Shenoy & Ying Jenny Zhang',
      year: '2007',
      title: 'Order Imbalance and Stock Returns: Evidence from China',
      publication: 'Quarterly Review of Economics and Finance, 47(5), 637–650',
      url: 'https://doi.org/10.1016/j.qref.2007.09.004',
      use: '2004 年沪深样本的强同日关系与缺少随后收益预测，为跨制度外推提供直接反例。',
    },
    {
      id: 19,
      authors: 'Justin Sirignano & Rama Cont',
      year: '2019',
      title: 'Universal Features of Price Formation in Financial Markets: Perspectives from Deep Learning',
      publication: 'Quantitative Finance, 19(9), 1449–1459',
      url: 'https://doi.org/10.1080/14697688.2019.1622295',
      use: '大规模美国股票订单簿历史、跨股票 pooling 与样本外下一次价格方向预测；universal 受样本、标签和制度约束。',
    },
    {
      id: 20,
      authors: 'Nasdaq',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Nasdaq TotalView–ITCH 5.0 Data Format Specification',
      publication: 'Official Technical Specification',
      url: 'https://www.nasdaqtrader.com/content/technicalsupport/specifications/dataproducts/NQTVITCHSpecification.pdf',
      use: 'Add、Execute、Cancel、Delete、Replace、Trade、Cross 与 Broken Trade 等消息语义；历史研究必须匹配当日协议版本。',
    },
    {
      id: 21,
      authors: 'Petter N. Kolm, Jeremy Turiel & Nicholas Westray',
      year: '2023',
      title: 'Deep Order Flow Imbalance: Extracting Alpha at Multiple Horizons from the Limit Order Book',
      publication: 'Mathematical Finance, 33(4), 1044–1081',
      url: 'https://doi.org/10.1111/mafi.12413',
      use: '115 只 Nasdaq 股票中 order-flow 特征的多期限样本外预测表现及约两个平均价格变化的有效尺度；不直接证明成本后盈利。',
    },
    {
      id: 22,
      authors: 'Bruno Biais, Pierre Hillion & Chester Spatt',
      year: '1995',
      title: 'An Empirical Analysis of the Limit Order Book and the Order Flow in the Paris Bourse',
      publication: 'Journal of Finance, 50(5), 1655–1689',
      url: 'https://doi.org/10.1111/j.1540-6261.1995.tb05192.x',
      use: '订单簿状态与后续订单选择的内生关系；特定巴黎市场样本的事件模式不能外推为普遍因果。',
    },
    {
      id: 23,
      authors: 'LOBSTER',
      year: 'n.d.',
      accessedAt: '2026-08-28',
      title: 'Data Structure: Message and Orderbook Files',
      publication: 'Official LOBSTER Data Documentation',
      url: 'https://data.lobsterdata.com/info/DataStructure.php',
      use: 'Event type、resting-order Direction、hidden execution 与占据档位数据语义；字段方向不能直接当作主动成交方向。',
    },
  ],
  readingList: [
    {
      title: 'The Price Impact of Order Book Events',
      scope: '核心定义 · Cont、Kukanov、Stoikov（2014），重点读 Sections 2–4、OFI 事件公式、10 秒回归和 depth scaling',
      reason: '亲自核对为什么 limit add、cancel 与 market order 必须统一进入 best-level 供需账本，并识别约 65% R² 的同窗边界。',
      url: 'https://arxiv.org/abs/1011.6402',
    },
    {
      title: 'Inferring Trade Direction from Intraday Data',
      scope: '测量基础 · Lee & Ready（1991），读 quote/tick tests、inside-spread trades 与时间对齐问题',
      reason: '理解 trade sign 在缺少订单身份时是估计量，以及历史五秒规则为何不能机械搬到现代 feed。',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
    },
    {
      title: 'Measuring the Information Content of Stock Trades',
      scope: '动态识别 · Hasbrouck（1991），重点读 VAR 表示、trade innovation 与 cumulative impulse response',
      reason: '把 raw order flow 与不可预测创新分开，并理解当期回归系数为何不等于长期信息响应。',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
    },
    {
      title: 'Queue Imbalance as a One-Tick-Ahead Price Predictor in a Limit Order Book',
      scope: '状态预测 · Gould & Bonart（2016），读标签、logistic design 与 large/small-tick 分组',
      reason: '看清 queue state 与 event flow 的区别，并学习把“下一次价格变化”保留为精确预测对象。',
      url: 'https://arxiv.org/abs/1512.03492',
    },
    {
      title: 'Multi-Level Order-Flow Imbalance in a Limit Order Book',
      scope: '空间扩展 · Xu、Gould、Howison（2020），读 MLOFI 定义、层级重编号、Ridge 与样本边界',
      reason: '理解深层信息为何是向量、共线性为何出现，以及同窗 out-of-sample fit 仍不等于未来 alpha。',
      url: 'https://ora.ox.ac.uk/objects/uuid%3A9b7d0422-4ef1-48e7-a2d4-4eaa8a0a7ec1',
    },
    {
      title: 'The Long Memory of the Efficient Market',
      scope: '持续性悖论 · Lillo & Farmer（2004），读 order-sign autocorrelation、liquidity 与 return efficiency',
      reason: '理解可预测订单方向与近似不可预测收益如何通过流动性适应共存。',
      url: 'https://arxiv.org/abs/cond-mat/0311053',
    },
    {
      title: 'Why Is Equity Order Flow So Persistent?',
      scope: '主体分解 · Tóth、Palit、Lillo、Farmer（2015），读 same-member / cross-member decomposition 与 brokerage caveat',
      reason: '区分 order splitting 与 herding，并训练自己把成员标识和最终投资者身份分开。',
      url: 'https://doi.org/10.1016/j.jedc.2014.10.007',
    },
    {
      title: 'Deep Order Flow Imbalance',
      scope: '现代预测 · Kolm、Turiel、Westray（2023），读 data split、stationary flow inputs、multi-horizon labels 与 horizon results',
      reason: '把微观结构变量进入机器学习的全过程连起来，同时保留延迟、样本期与成本后可交易性边界。',
      url: 'https://doi.org/10.1111/mafi.12413',
    },
  ],
};
