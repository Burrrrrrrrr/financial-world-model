import OpeningClosingAuctionLab from '../components/OpeningClosingAuctionLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson117Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>集合竞价不是“大家报一个价格再取平均”，而是把某一规则版本下合格的一批订单，映射为一个统一清算价格、一组成交权和一组剩余状态；规则本身就是价格形成机制。</h2>
        <p>
          连续市场逐笔处理订单，当前最优报价、到达先后和局部深度会直接进入每次执行；集合竞价则暂缓执行，让更多买卖意愿先在同一账本中聚合，再按预先公布的清算与分配规则一次性相遇。它用等待换横截面流动性，用统一价格减少同一批次内的成交价离散，却同时带来等待风险、能否成交的不确定性、指示价格的策略互动，以及结束时剩余失衡如何处理的问题。Madhavan 的理论说明，周期拍卖在某些信息不对称状态下可以改善可交易性；这不是“auction 总比 continuous 好”，因为优势依赖信息结构、参与者到达和规则设计，代价则是即时性的丧失。<Cite n={1} />
        </p>
        <p>
          开盘与收盘即使使用相似的单一价格算法，也在解决不同经济问题。开盘聚合闭市期间累积的新闻、跨市场价格和未执行需求，信息性往往更强而可吸收的无信息流较少；收盘聚合基金净值、指数跟踪、衍生品结算和日终库存需求，数量更深，却可能包含时间刚性很强的基准流。于是同一笔失衡既可能是价值信息，也可能是暂时价格压力；同一条 indicative price 路径既可能反映学习，也可能被不承担最终执行风险的订单推动。判断它是什么，必须观察规则、订单承诺、后续价格路径和反事实，不能从“涨了”“量大”或“后来反转”单独下结论。<Cite n={10} /><Cite n={27} /><Cite n={28} /><Cite n={33} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>从逐笔订单构造累计买卖曲线，手算候选价、可成交量、失衡与统一清算价。</li>
            <li>区分 price determination、allocation 与 residual routing，解释相同清算价为何不保证相同个人成交。</li>
            <li>把指示价格、指示成交量和指示失衡理解为“当前账本若立刻结束”的条件状态，而非真实成交或基本价值。</li>
            <li>逐项分析撤单窗口、freeze、随机结束、collar、波动延长和透明度怎样改变策略与尾部结果。</li>
            <li>分别构造 opening price discovery 与 closing benchmark pressure 的机制链，并识别竞争解释。</li>
            <li>读取任一真实交易所规则时冻结 venue、产品、阶段、日期、时区、订单资格、并列规则、分配和剩余订单去向。</li>
            <li>用后续保留率、制度改革、指数调整与事件时间研究区分学习、暂时压力和潜在操纵，同时守住因果边界。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 先画完整系统</p>
        <h2>竞价结果从来不只由“买多少、卖多少”决定；资格、时间、价格保护、透明度和分配权会先改变订单，再由订单共同生成价格。</h2>
        <div className="mechanism-chain" aria-label="集合竞价的完整价格形成链">
          {[
            ['外部状态', '隔夜信息、指数调整、基金申赎、衍生品到期、库存与风险限额'],
            ['规则版本', '可用订单类型、输入/撤改窗口、freeze、随机结束、collar 与参考价'],
            ['主体选择', '是否参加、报市价或限价、何时提交、是否撤改、是否提供失衡抵消量'],
            ['动态竞价簿', '合格买卖订单不断加入、取消或修改，累计需求和供给曲线随之重画'],
            ['清算与分配', '候选集合、目标顺序、tie-break、统一价格、个人优先权与部分成交'],
            ['接口与反馈', '未成交订单取消或进入连续簿；竞价价、失衡与后续交易改变下一轮行为'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          因果方向同时是双向的。规则先塑造参与者能做什么，参与者预期别人如何利用规则后再选择订单，公开的 indicative state 又让所有人更新判断并撤改，最后形成的新价格会进入指数、净值、保证金和次日参考价。把竞价算法当作订单给定后的机械计算，只完成了中间一段；专业分析必须把订单如何内生生成、结果怎样反馈也纳入系统。
        </p>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 本节范围契约</p>
        <h2>本节独占“批量订单如何变成清算结果，以及这个制度怎样改变开收盘价格形成”；它不重复订单簿基础，也不把任何场所规则伪装成全球模板。</h2>
        <div className="boundary-box">
          <b>输入、输出与不重复原则</b>
          <p>从 1.01 输入买卖方向、限价可接受集合与 min(B,S)；从 1.02 输入 continuous/call 的架构差异；从 1.04 输入订单簿、优先级和深度；从 1.16 输入 opening call、continuous、closing call 必须分 phase 的时钟协议。本节从一张更丰富的订单账本开始，系统展开候选价、tie-break、allocation、indicative information、规则保护和实证识别。本节把最小报价单位当作给定价格网格；1.18 再研究 tick size 怎样改变候选价格、spread、depth 与竞争。</p>
        </div>
        <p>
          文中公式提供可迁移的共同语言，所有真实例子则以 Rule Card 冻结适用范围。只要 venue、产品、日期或交易阶段之一改变，就必须重新查官方规则；“纽约证券交易所集团”“中国市场”“欧洲竞价”都不是足够精确的规则对象。
        </p>
      </section>

      <section className="lesson-section" id="objects">
        <p className="section-kicker">03 · 先分清九个对象</p>
        <h2>订单、候选价、指示状态、最终价格、分配和官方收盘价是不同对象；混用它们会让计算与因果判断同时出错。</h2>
        <div className="table-scroll" role="region" aria-label="集合竞价九个对象，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从输入到账后结果的对象账本</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">它是什么</th><th scope="col">它不是什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Eligible order</th><td>按当前阶段、截止时间和产品规则可参加的订单</td><td>所有已提交订单</td></tr>
              <tr><th scope="row">Candidate set 𝒫</th><td>规则允许进入价格比较的有限集合</td><td>任意实数价格</td></tr>
              <tr><th scope="row">B(p), S(p)</th><td>在候选价 p 可执行的累计单边数量</td><td>只在 p 恰好报价的数量</td></tr>
              <tr><th scope="row">Paired volume V(p)</th><td>两侧可实际配对量 min(B,S)</td><td>买卖两侧相加后的双边统计</td></tr>
              <tr><th scope="row">Imbalance I(p)</th><td>在 p 的累计买量减累计卖量</td><td>未来价格方向保证</td></tr>
              <tr><th scope="row">Indicative state</th><td>若此刻结束，按当前簿与规则得到的条件结果</td><td>已经成交的价格或数量</td></tr>
              <tr><th scope="row">Clearing result</th><td>结束时冻结账本后得到 p*（星号表示规则最终选中的清算价）与 Q*（该价格的市场单边成交股数）</td><td>不等于每张订单实际成交多少</td></tr>
              <tr><th scope="row">Allocation</th><td>把 Q* 分给合格订单的优先协议；fill 指某张订单实际成交的股数或比例</td><td>价格选择的同义词</td></tr>
              <tr><th scope="row">Official open/close</th><td>交易所规则指定的正式基准结果</td><td>任何数据商的第一笔/最后一笔交易</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="ledger">
        <p className="section-kicker">04 · 从订单账本开始</p>
        <h2>一张订单不是一个点，而是一段可接受价格集合；累计曲线正是把这些集合叠加起来。</h2>
        <p>
          买入限价 101 元表示愿意在 101 元或更低成交，因此它会进入所有不高于 101 的候选价买量；卖出限价 100 元表示愿意在 100 元或更高成交，因此它会进入所有不低于 100 的候选价卖量。竞价市价型订单若按场所规则合格，则通常在所有候选价进入相应一侧，但其最终价格保护、优先和未成交处理仍取决于协议。普通连续市价单、开盘市价型订单（Market-on-Open，MOO）、收盘市价型订单（Market-on-Close，MOC）、开盘限价型订单（Limit-on-Open，LOO）、收盘限价型订单（Limit-on-Close，LOC），以及场所专有的仅抵消失衡订单（Imbalance-Only order，IO）不能因名字相似而互换。<Cite n={4} /><Cite n={6} />
        </p>
        <div className="equation-card">
          <span>累计可执行买量与卖量</span>
          <div>B<sub>t</sub>(p)=Σ<sub>i∈ℬ<sub>t</sub></sub> q<sub>i</sub>1&#123;l<sub>i</sub>≥p&#125;　；　S<sub>t</sub>(p)=Σ<sub>j∈𝒮<sub>t</sub></sub> q<sub>j</sub>1&#123;l<sub>j</sub>≤p&#125;</div>
          <p>t 是竞价中的事件时点，p 是一个合格候选价；ℬ<sub>t</sub>、𝒮<sub>t</sub> 是此刻合格的买单与卖单集合；q 是股数，l 是限价，1&#123;条件&#125; 在条件成立时取 1，否则取 0。B 与 S 的单位都是股。式子暂未写市价型订单；若协议允许，应把其数量加入每个候选价的对应一侧。随着 p 上升，B 不增；随着 p 上升，S 不减，这是后续清算曲线的几何基础。</p>
        </div>
      </section>

      <section className="lesson-section" id="candidate-set">
        <p className="section-kicker">05 · 候选集合不是整条实数轴</p>
        <h2>算法先决定“哪些价格值得比较”，再决定“怎样比较”；中间价、参考价或 collar 边界可能只在后续步骤进入。</h2>
        <p>
          教学推导常把所有不同限价组成 𝒫，这能避免在没有订单变化的连续区间重复计算。真实规则可能加入价格档位、参考价、价格带边界或特殊回退价格，也可能在多个申报价仍并列后输出一个非申报价的中间值。1.02 的两订单例子已经展示上交所最终中间价可以不等于任一初始申报价；本节不复述该算例，只强调研究程序必须把 candidate generation 与 final tie-break 分成两个函数。
        </p>
        <div className="boundary-box"><b>程序审计问题</b><p>若你把从最低卖价到最高买价之间每个最小 tick 都无条件塞进候选集合，可能改变并列集合；若只保留订单限价，又可能漏掉规则明确允许的参考价或边界值。先抄官方定义，再写代码，不能用“结果看起来合理”倒推规则。</p></div>
      </section>

      <section className="lesson-section" id="clearing-objective">
        <p className="section-kicker">06 · 第一层清算目标</p>
        <h2>最大成交量是最常见的共同骨架，但它只选出一组候选解；它既不保证供需完全相等，也不决定个人成交。</h2>
        <div className="equation-card">
          <span>可成交量、失衡与第一层解集</span>
          <div>V<sub>t</sub>(p)=min&#123;B<sub>t</sub>(p),S<sub>t</sub>(p)&#125;　；　I<sub>t</sub>(p)=B<sub>t</sub>(p)−S<sub>t</sub>(p)　；　𝒫<sub>1</sub>=arg max<sub>p∈𝒫</sub>V<sub>t</sub>(p)</div>
          <p>V 与 I 都以股计。I&gt;0 表示该价格上可执行买量多于卖量，I&lt;0 表示卖量更多；这只是冻结账本的剩余方向。arg max 返回所有使 V 达到最大值的候选价集合，而不是自动返回唯一数字。若 𝒫<sub>1</sub> 有多个元素，必须继续应用场所规定的次级目标；若只有一个，仍须再按 allocation 计算每张订单的 fill。</p>
        </div>
        <p>
          “最大化成交量”也不是社会福利的完整定义。它不直接衡量等待成本、信息泄露、尾部价格偏离、未成交机会成本或连续市场被挤出的流动性；这些维度会在规则比较中重新出现。
        </p>
      </section>

      <section className="lesson-section" id="worked-clear">
        <p className="section-kicker">07 · 完整手算：唯一清算价</p>
        <h2>先逐价重算累计量，再选择最大配对量；不能从“买单均价”“净订单数”或失衡方向猜价格。</h2>
        <div className="worked-example">
          <span>教学账本 · 数量单位均为股</span>
          <p>买方：竞价市价 30；限价 102×20、101×35、100×25。卖方：竞价市价 10；限价 99×15、100×30、101×45、102×20。为隔离共同骨架，本题令不同限价 99、100、101、102 构成初始候选集合，并令市价量进入每个候选价。</p>
          <div className="table-scroll" role="region" aria-label="唯一清算价手算表，可横向滚动" tabIndex={0}>
            <table className="auction-table">
              <caption>每行都从原始订单重算，而不是在上一行结果上凭直觉加减</caption>
              <thead><tr><th scope="col">p</th><th scope="col">B(p)</th><th scope="col">S(p)</th><th scope="col">V(p)</th><th scope="col">I(p)</th><th scope="col">判断</th></tr></thead>
              <tbody>
                <tr><th scope="row">99</th><td>110</td><td>25</td><td>25</td><td>+85</td><td>卖方约束</td></tr>
                <tr><th scope="row">100</th><td>110</td><td>55</td><td>55</td><td>+55</td><td>卖方仍较少</td></tr>
                <tr><th scope="row">101</th><td>85</td><td>100</td><td><b>85</b></td><td>−15</td><td>唯一最大</td></tr>
                <tr><th scope="row">102</th><td>50</td><td>120</td><td>50</td><td>−70</td><td>买方约束</td></tr>
              </tbody>
            </table>
          </div>
          <p>因此 p*=101、Q*=85。85 是单边成交量：买方成交 85、卖方也成交 85，但市场通常报告该次成交为 85，而不是把双方相加成 170。I(101)=−15 表示此价可执行卖量比买量多 15；它不保证开盘后继续下跌，因为最终未成交订单、连续簿新增流动性和新信息都会改变状态。</p>
        </div>
      </section>

      <section className="lesson-section" id="tie-breaks">
        <p className="section-kicker">08 · Tie-break 是制度选择</p>
        <h2>当多个价格同样最大化成交量，次级目标决定谁的限价成为统一价格、谁承担剩余，以及价格离参考状态多远。</h2>
        <p>
          常见次级组件包括最小化总未成交量或绝对失衡、利用失衡方向排除某侧价格、选择最接近参考价的候选、在仍并列时取中间值。它们不是可任意排序的工具箱：顺序改变，结果就可能改变。Nasdaq 当前 closing cross 以最大可成交量为起点，再依规则处理最小失衡、价格层剩余和参考中点距离；Euronext 的通用 uncrossing 骨架则依次关注最大执行量、最小剩余和最接近参考价。两者看似相似，但订单资格、参考价、价格保护与分配仍不同。<Cite n={4} /><Cite n={7} />
        </p>
        <div className="equation-card">
          <span>一个明确标注的教学式次级协议</span>
          <div>𝒫<sub>2</sub>=arg min<sub>p∈𝒫₁</sub>|I(p)|　；　𝒫<sub>3</sub>=arg min<sub>p∈𝒫₂</sub>|p−p<sub>ref</sub>|</div>
          <p>第一步只在最大成交量解集 𝒫₁ 内最小化绝对失衡；若仍并列，第二步返回离参考价 p<sub>ref</sub> 最近的价格集合 𝒫₃。价格单位必须一致。只有当 𝒫₃ 恰有一个元素，即 |𝒫₃|=1，教学协议才把该唯一价格记为 p*；若仍有多个同距价格，必须继续执行预先声明的场所兜底规则。这个式子不是全球通则；任何实证代码若没有 venue rule version，就无法知道这些步骤是否存在、顺序如何。</p>
        </div>
      </section>

      <section className="lesson-section" id="china-rules">
        <p className="section-kicker">09 · 上交所与深交所：同一第一层，不同并列路径</p>
        <h2>“中国集合竞价算法”不是一个足够精确的对象；两所当前股票规则在并列处理上明确不同。</h2>
        <div className="table-scroll" role="region" aria-label="上交所与深交所集合竞价规则比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>规则版本：2026 年 7 月 6 日生效；访问于 2026-08-28</caption>
            <thead><tr><th scope="col">Rule Card</th><th scope="col">上交所</th><th scope="col">深交所</th></tr></thead>
            <tbody>
              <tr><th scope="row">阶段</th><td>09:15–09:25 开盘；14:57–15:00 收盘</td><td>09:15–09:25 开盘；14:57–15:00 收盘</td></tr>
              <tr><th scope="row">不可撤单窗</th><td>09:20–09:25；14:57–15:00</td><td>09:20–09:25；14:57–15:00</td></tr>
              <tr><th scope="row">共同资格条件</th><td colSpan={2}>最大成交量；高于成交价的买单与低于成交价的卖单全部成交；成交价同侧至少一方全部成交</td></tr>
              <tr><th scope="row">多个价格仍合格</th><td>选择未成交量最小者；仍多个时取其中间价</td><td>比较高于该价的累计买量与低于该价的累计卖量之差；仍多个时，开盘取最接近前收盘价者，盘中/收盘取最接近最近成交价者</td></tr>
              <tr><th scope="row">竞价公开状态</th><td>虚拟参考价格、虚拟匹配量、虚拟未匹配量</td><td>参考价格、匹配量、未匹配量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这张表证明“同一订单簿能否产生同一价格”是制度命题，而非算术常识。上交所的中间价步骤与深交所的参考价距离步骤会在并列状态中产生不同映射；但不能把这一差异直接解释为某一市场质量更高，因为最终结果还取决于订单如何为规则而调整、价格档位、涨跌幅限制和样本状态。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="allocation">
        <p className="section-kicker">10 · Price Determination ≠ Allocation</p>
        <h2>清算价回答“在哪成交”，可成交量回答“市场总共成交多少”，分配才回答“你的订单成交多少”。</h2>
        <p>
          回到第 07 节的 p*=101、Q*=85。买方竞价市价 30 和更优限价 102×20 先提供 50，再由 101 元买单 35 补足 85，因此该买单全成；卖方在 101 以下已有市价 10、99×15、100×30，共 55，清算价上的 101×45 只有 30 能成交，余下 15 未成交。这就是“成交价同侧至少一方全部成交”与部分成交的具体含义。
        </p>
        <p>
          若 101 元的 45 股来自 A=20、B=25 两张卖单，time priority 可能让先到者先拿 20、后到者只拿 10；pro rata 则忽略先后，按 20:25 把 30 分为约 13.33 与 16.67，再按整手和舍入规则修正；某些人工/混合市场还可能使用 parity 或特殊优先。相同 p* 和 Q* 因此可以给个人完全不同的成交概率，进而反向改变“早报还是晚报、显露多少数量”的策略。<Cite n={6} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="allocation-rules">
        <p className="section-kicker">11 · 四类分配逻辑</p>
        <h2>更优价优先通常共同存在，真正分化策略的是清算价同价订单如何竞争。</h2>
        <div className="table-scroll" role="region" aria-label="竞价分配规则比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>分配规则会把时间、规模或身份变成经济权利</caption>
            <thead><tr><th scope="col">协议</th><th scope="col">奖励什么</th><th scope="col">潜在优点</th><th scope="col">潜在代价</th></tr></thead>
            <tbody>
              <tr><th scope="row">Price–time</th><td>更优价格、同价更早到达</td><td>规则直观，早期真实兴趣有队列价值</td><td>诱发抢先提交，早报需求更易泄露</td></tr>
              <tr><th scope="row">Pro rata</th><td>同价申报规模</td><td>大单按比例获得 fill</td><td>可能诱发夸大显示量和舍入博弈</td></tr>
              <tr><th scope="row">Parity / priority</th><td>场所定义的参与者身份或轮转权</td><td>可激励指定中介承担义务</td><td>复杂、竞争中性和公平性需单独评估</td></tr>
              <tr><th scope="row">Batch equivalence</th><td>同批订单视为同时到达</td><td>降低极短速度优势</td><td>仍需规模或随机方式处理同价剩余</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="residual-routing">
        <p className="section-kicker">12 · 未成交不是缺失值</p>
        <h2>竞价结束后，剩余订单可能取消、保留、改写或进入连续簿；这条接口决定开盘后的队列与收盘后的风险。</h2>
        <p>
          一张未成交 auction-market 型订单通常不能被想当然地带入连续市场，否则“无价格保护的只参加竞价意图”会被改写；一张仍有效的限价单则可能按场所规则转入连续簿，但其时间优先是否保留、是否重置以及 price collar 如何处理都要查协议。HKEX 允许合格连续限价订单进入 closing auction，JPX 的 pre-closing 又把不同来源订单放入最终 Itayose，并设置相应优先层级。<Cite n={8} /><Cite n={9} />
        </p>
        <div className="boundary-box"><b>数据工程边界</b><p>零 auction volume 可能表示没有交叉、证券停牌、价格保护阻断、延迟开盘或数据缺失；未成交量也可能在随后连续簿成交。删除这些状态会把“机制失败”误当作“没有观测”，并高估成功竞价的平均质量。</p></div>
      </section>

      <section className="lesson-section" id="indicative-state">
        <p className="section-kicker">13 · Indicative State 是条件反事实</p>
        <h2>指示价格的准确读法是：“若账本此刻冻结并按当前规则结束，将得到什么”；它不是已经发生的成交。</h2>
        <p>
          每次新增、撤销或修改订单都会改变 ℬ<sub>t</sub>、𝒮<sub>t</sub>，因此 B<sub>t</sub>(p)、S<sub>t</sub>(p)、V<sub>t</sub>(p)、I<sub>t</sub>(p) 与指示清算价要全部重算。即使没有一笔成交，indicative price 也能跳动；反过来，它接近昨日收盘也不表示没有新信息，因为相反方向的需求可能恰好抵消。上交所、深交所、NYSE、Nasdaq 等场所发布的字段和起始时点不同，数据商的字段名也不能替代官方定义。<Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={6} />
        </p>
        <div className="equation-card">
          <span>最终价格预测误差</span>
          <div>e<sub>t</sub>=10⁴[ln(P<sub>auc</sub>)−ln(P<sub>ind,t</sub>)]　log-bp</div>
          <p>P<sub>ind,t</sub> 是事件时点 t 的指示价，P<sub>auc</sub> 是最终竞价价；二者必须为同一证券、同一场竞价且为正。ln 表示自然对数，与有些文献写作 log 的记号同义；乘以 10⁴ 后得到以 log-bp 表示的对数价格差，在小变动下近似普通基点。若 |e<sub>t</sub>| 随结束临近而下降，说明当前公开状态对最终价格的预测改善；但这仍不能单独证明 fundamental learning，因为参与者可能共同追随同一可撤信号。</p>
        </div>
      </section>

      <section className="lesson-section" id="order-semantics">
        <p className="section-kicker">14 · 订单语义有两个轴</p>
        <h2>MOO/LOO/MOC/LOC 先指定参加哪一场竞价，再决定是否保留价格边界；名称不自动包含所有优先权和截止规则。</h2>
        <div className="table-scroll" role="region" aria-label="竞价订单语义比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先分 destination，再分 price protection</caption>
            <thead><tr><th scope="col">指令</th><th scope="col">目标阶段</th><th scope="col">价格约束</th><th scope="col">最小风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">MOO</th><td>Opening auction</td><td>通常无显式限价</td><td>价格不确定，且仍可能因规则无成交</td></tr>
              <tr><th scope="row">LOO</th><td>Opening auction</td><td>有买方上限/卖方下限</td><td>超出边界不成交</td></tr>
              <tr><th scope="row">MOC</th><td>Closing auction</td><td>通常无显式限价</td><td>更接近基准，但最终价格未知</td></tr>
              <tr><th scope="row">LOC</th><td>Closing auction</td><td>有价格边界</td><td>可能错过官方收盘成交</td></tr>
              <tr><th scope="row">Imbalance-only / offset</th><td>场所定义的失衡抵消阶段</td><td>资格和方向受规则限制</td><td>不是自由参加两侧的普通限价单</td></tr>
            </tbody>
          </table>
        </div>
        <p>Nasdaq 对 MOO、LOO、MOC、LOC 与 Imbalance-Only order 有专门定义；NYSE 又有指定做市商（Designated Market Maker，DMM）、代表客户在交易大厅执行的场内经纪人（floor broker），以及可由场内经纪人在特定收盘窗口提交或修改的专有 D-order 路径。把一个场所的缩写语义复制到另一个市场，会同时误判截止时间、可撤性、优先级和残余处理。<Cite n={4} /><Cite n={6} /></p>
      </section>

      <section className="lesson-section" id="commitment-window">
        <p className="section-kicker">15 · 撤改单与 Commitment</p>
        <h2>允许撤改提高对新信息和错误的适应，却也让大单能以很低执行承诺移动公开状态；freeze 正是在两者之间选边界。</h2>
        <p>
          在可撤阶段，交易者可以先提交以争取时间优先或测试别人反应，再根据信息和指示失衡撤改；因此 displayed quantity 不是不可撤销承诺。进入 freeze 后，既有订单的选择权收缩，最后一秒抽单更难，但真实录入错误和新消息也更难修正，策略还可能提前到 freeze 前。上交所与深交所当前开盘 09:20–09:25、收盘 14:57–15:00 禁止撤单；NYSE、Nasdaq、HKEX 的截止和例外则不同。<Cite n={2} /><Cite n={3} /><Cite n={6} /><Cite n={8} />
        </p>
        <p>
          Daures、Moinas 与 Boussetta 在 Euronext preopening 记录 J 形提交：慢客户可能较早提交以获得时间优先，专业自营者更晚进入以减少信息泄露。它说明“越早提交越诚实、越晚越可疑”都不是可防守的通则；提交时点由优先权、信息泄露和等待风险共同决定。<Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="random-end">
        <p className="section-kicker">16 · Random End 改变最后一秒博弈</p>
        <h2>随机结束让交易者不知道哪一刻是确定的最后机会，从而降低精确狙击边界的价值；它不会自动消灭欺骗或价格压力。</h2>
        <p>
          若结束时刻 T 固定且所有人知道，晚到交易者可以最大化利用别人已经暴露的订单，同时把自身暴露时间压到最短。把 T 改成区间内的随机变量，会使“再等一秒”带来一段正的条件结束概率：等待越久，信息优势可能越大，但被提前结束排除的概率也越高。Euronext 当前 uncrossing 在附录规定的随机窗口内发生；HKEX closing auction 也使用随机结束。<Cite n={7} /><Cite n={8} />
        </p>
        <div className="equation-card">
          <span>等待一小段时间的教学权衡</span>
          <div>ΔU≈信息收益 − Pr(T≤t+Δt | T&gt;t)×错失执行损失</div>
          <p>ΔU 是“继续等待 Δt 后，预期效用相对现在提交的变化”；U 只是统一的收益减损失尺度，不要求使用货币。t 是当前竞价时点，Δt 是准备继续等待的一小段正时间，T 是随机结束时刻。Pr(T≤t+Δt | T&gt;t) 是已知竞价在 t 尚未结束时、未来 Δt 内结束的无量纲区间条件概率；它不是单位为 1/时间的连续时间 hazard rate。直白地说，晚一点提交可多看信息，却要承担在此之前竞价已经结束的错失风险。这个方向式不是校准模型；若欺骗收益来自跨市场头寸、窗口太短或撤单仍便宜，异常策略仍可能存在。Hauser、Kedar-Levy 与 Milo 的以色列证据表明，短随机延长并未消除其识别的到期日异常模式。<Cite n={26} /></p>
        </div>
      </section>

      <section className="lesson-section" id="collars">
        <p className="section-kicker">17 · Collar 与 Volatility Extension</p>
        <h2>价格保护限制尾部清算结果，延长窗口让新流动性进入；二者控制完整性风险，却可能把交易迁移到边界之前或增加不成交。</h2>
        <p>
          Collar 通常把允许清算价限制在参考价附近；当无约束价格越界，场所可能夹到边界、延长竞价、进入波动机制、回退参考价、延迟开盘或取消，具体路径不能猜。Volatility extension 则在异常失衡或偏离出现时增加等待，让参与者补充对手量。Nasdaq Nordic 的改革证据与暂时波动和操纵代理下降、竞价量上升相容，但不能推出任意宽度和延长期限都最优。<Cite n={24} />
        </p>
        <p>
          保护越窄并非单调更安全：它可能降低已发生成交的尾部偏离，却提高无成交、部分成交、延迟、提前转去连续市场和价格堆积在边界的概率。完整评估必须同时报告成交率、延迟、边界触发、连续盘替代流和拍卖后价格，而不能只挑“成交样本的波动下降”。
        </p>
      </section>

      <section className="lesson-section" id="transparency">
        <p className="section-kicker">18 · 透明度既创造学习，也泄露需求</p>
        <h2>公开 indicative price、paired quantity 与 imbalance 能招来对手流动性，也会让其他人看见大单约束；净效果取决于谁能响应、订单能否撤和剩余时间。</h2>
        <p>
          透明度的正链是：失衡公开 → 外部流动性提供者评估执行机会 → 抵消单进入 → 配对量增加、尾部偏离下降。负链是：刚性大单被识别 → 其他人提前在连续市场或相关资产交易 → 大单面临更差价格；若公开订单可以廉价撤销，交易者还可能用它改变别人预期。Comerton-Forde 与 Rydge 对 ASX 2002 年算法和 indicative surplus 发布的联合改革发现价格效率改善，尤其在活跃股开盘；因为两项同时变化，不能把效应全部归给透明度。<Cite n={18} />
        </p>
        <div className="boundary-box"><b>透明度不是字段越多越好</b><p>更高频发布也会改变策略速度与逆向选择；只比较改革前后 displayed imbalance 的预测力，会把参与者适应当作固定环境。应同时观察成交量、fill、撤改单、连续盘抢跑、最终偏差和不同主体响应。</p></div>
      </section>

      <section className="lesson-section" id="opening-function">
        <p className="section-kicker">19 · Opening Auction 的经济任务</p>
        <h2>开盘要在没有同日连续成交基准的条件下，把隔夜信息、跨市场先行价格与积累订单压缩成第一个可执行公共价格。</h2>
        <div className="mechanism-chain" aria-label="开盘竞价价格形成链">
          {[
            ['闭市积累', '公司公告、宏观消息、海外市场和客户指令继续变化，本地连续簿却停止成交'],
            ['估值分散', '不同主体拥有不同信息和模型，对新价值、失衡与可吸收深度的判断更分散'],
            ['提交与试探', '早到订单争取优先并暴露需求，晚到专业者等待更多公开状态，撤改重画曲线'],
            ['统一清算', '规则聚合当下可执行意愿，形成首个官方价格与一组未成交状态'],
            ['连续验证', '后续报价、成交和跨市场价格检验竞价创新是持久信息还是暂时偏离'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Biais、Hillion 与 Spatt 对巴黎 preopening 的研究发现，早段价格更接近噪声，临近开盘时信息含量和效率提高；这支持订单公开状态中的逐步学习，却不表示所有早期撤单都是噪声或所有临近结束订单都是真实信息。Cao、Ghysels 与 Hatheway 又显示 Nasdaq preopening 即使没有交易，dealer quotes 也能发现价格，提醒我们把“无成交”与“无信息进入价格”分开。<Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="opening-intermediation">
        <p className="section-kicker">20 · 开盘中介：功能而非职业标签</p>
        <h2>指定中介可以用库存、订单簿演化和寻找对手盘稳定开盘，但参与本身通常是内生的，历史人工制度也不能直接外推。</h2>
        <p>
          Madhavan 与 Panchapagesan 使用 NYSE 的 Trades, Orders, Reports and Quotes（TORQ，成交、订单、报告与报价）数据中 144 只股票观察 specialist 如何参与开盘，发现其能从簿演化和库存中提取信息并改善相对机械清算的价格发现；Davies 的 Toronto preopening 研究也发现 registered trader 的参与与缓和隔夜价格变化和库存调整相容。两者说明指定中介可能在失衡和不确定状态中提供风险承载，却不证明其天生拥有私人信息或所有现代电子市场都需要同一种人工角色。<Cite n={12} /><Cite n={13} />
        </p>
        <p>
          更现代的 2020 年 NYSE floor closure 提供准实验：Brogaard、Ringgenberg 与 Rösch 发现大厅关闭后连续流动性与开收盘价格偏离恶化；但处理同时移除了面对面沟通、人工拍卖和特殊订单，且发生在疫情极端环境，不能把全部变化归因于单一 DMM 判断。<Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="closing-function">
        <p className="section-kicker">21 · Closing Auction 的经济任务</p>
        <h2>收盘不是简单记录最后一笔交易，而是把必须靠近官方基准完成的低弹性需求，与愿意承受剩余风险的流动性供给者集中到一个价格。</h2>
        <div className="mechanism-chain" aria-label="收盘竞价价格形成链">
          {[
            ['基准需求', '基金净值、指数跟踪、衍生品结算、业绩评估和客户指令把执行目标锁向 close'],
            ['需求变硬', '越接近截止，未完成风险与跟踪误差越大，剩余订单对价格更不敏感'],
            ['供给响应', '套利者、做市商、主动基金与 floor/DMM 评估失衡、库存和隔夜风险并提交对手量'],
            ['统一收盘', '大量同刻订单在官方价格成交，tick、collar、优先权和剩余失衡共同决定微小偏离'],
            ['后续分解', '盘后、隔夜与未来数日的保留或反转帮助区分持久信息与暂时风险补偿'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>Pagano 与 Schwartz 利用 Euronext Paris 分阶段引入 closing call，发现执行成本、价格同步和价格发现改善，并有较弱的次日开盘溢出；这说明设计良好的 closing call 可以把末段流动性更有效聚合，却不是“任何 call 都提高市场质量”的证明。<Cite n={14} /></p>
      </section>

      <section className="lesson-section" id="benchmark-pressure">
        <p className="section-kicker">22 · Benchmark Demand 与被动资金</p>
        <h2>被动资金不必“错误定价”也会制造暂时压力：它优化的是相对基准误差，而对手方定价的是吸收刚性流的库存和风险。</h2>
        <p>
          指数基金若在收盘前很早成交，会承担成交价相对最终 close 的跟踪误差；若等待到 closing auction，又可能在单边换仓中遇到有限对手量。对手方愿意吸收失衡，通常需要即期价格补偿；冲击若主要是库存与风险承载，随后在新流动性进入时会部分反转。这里的“暂时”不等于零成本：基金仍用价格让渡购买了基准同步性和完成概率。
        </p>
        <p>
          Bogousslavsky 与 Muravyev 的 2010–2018 年美国样本显示，2018 年 closing auction 日均约 152 亿美元、占日成交额 7.48%，高于 2010 年的 3.11%；竞价价相对 16:00 中点的平均绝对偏离约 8.1 bp，且偏离平均大体在隔夜反转。被动共同基金持仓与 auction turnover 的关联远强于最后五分钟连续成交，但没有账户级成交身份，因此不能说被动资金解释了全部收盘量。<Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="impact-path">
        <p className="section-kicker">23 · Impact、Pressure 与 Persistence</p>
        <h2>竞价冲击是订单规模、证券状态和机制的条件关系，不是固定的线性系数；后续保留率是诊断，不是主体身份。</h2>
        <div className="equation-card">
          <span>先冻结失衡信息集，再定义带方向的价格变化</span>
          <div>OI<sup>τ₀</sup><sub>i,d</sub>=Buy<sup>τ₀</sup><sub>i,d</sub>−Sell<sup>τ₀</sup><sub>i,d</sub>　；　x<sub>i,d</sub>=OI<sup>τ₀</sup><sub>i,d</sub>/ADV<sup>(10)</sup><sub>i,d−1</sub>　；　Δp<sup>bp</sup><sub>i,d</sub>=10⁴(P<sub>auc</sub>−P<sub>ref</sub>)/P<sub>ref</sub></div>
          <p>i 标记证券，d 标记交易日；τ₀ 是研究开始前按机制 m、交易场所 v 与规则时期 r(d) 冻结的失衡观测时点，完整地可写为 τ<sub>0,m,v,r(d)</sub>，并非所有竞价都取同一类时点。</p>
          <p><b>论文复现口径：</b>复现 Goyal–Jegadeesh–Wu 时，closing auction 的 τ₀ 取相应 venue/date regime 的首次收盘失衡披露；opening auction 对 NYSE 与 Nasdaq 都统一取美国东部时间 09:28 的 OI，并把 09:27–09:28 间 TAQ（Trades and Quotes，成交与报价数据库）记录的最后一笔盘前成交作为 P<sub>ref</sub>；continuous market 则另用 30 分钟内按主动买入记正、主动卖出记负的成交量（signed trades），不沿用公开的 auction OI。</p>
          <p>Buy<sup>τ₀</sup> 与 Sell<sup>τ₀</sup> 是该时点公开的买卖股数，OI（Order Imbalance，订单失衡）以股计、买方较多为正。ADV<sup>(10)</sup><sub>i,d−1</sub> 是截至 d−1 日的前十个交易日日均成交股数，因此 x 无量纲且没有偷看当日最终成交量。P<sub>auc</sub> 是竞价价，P<sub>ref</sub> 是预先指定的竞价前可交易参考价，Δp<sup>bp</sup> 是带方向的简单价格变化、单位为基点：买方推动上涨为正，卖方推动下跌为负。最终残余失衡若另有研究价值必须另设变量；它不能替代 τ₀ 时点 OI，因为 Nasdaq 最终残余可归零。</p>
        </div>
        <div className="equation-card">
          <span>非线性条件价格变化与后续保留率</span>
          <div>E(Δp<sup>bp</sup>|x,z)=α(z)+λ(z)sgn(x)√|x|　；　R<sub>h</sub>=[ln P<sub>h</sub>−ln P<sub>ref</sub>]/[ln P<sub>auc</sub>−ln P<sub>ref</sub>]</div>
          <p>E 表示在右侧条件给定时的平均价格变化；z 是市值、spread、波动、venue、开/收盘等预先定义状态，α(z) 是该状态的基准截距，λ(z) 是以 bp 计的状态斜率。sgn(x) 是符号函数：x 为正、零、负时分别取 +1、0、−1；因此卖方失衡对应负的预测价格变化，不会被二次翻转。平方根项表示绝对冲击随规模上升但边际斜率下降。h 是竞价结束后的观察期限，P<sub>h</sub> 是该期限的可比中间价；R<sub>h</sub>≈1 与价格差大体保留相容，R<sub>h</sub>≈0 与快速完全反转相容，负值表示过度反转，分母接近零时不应计算。直白地说，第一式问同方向失衡通常推动价格多少，第二式问这次价格变化后来留下多少；新消息、市场共同收益和 bid–ask bounce 仍需控制，所以二者都不是因果标签。</p>
        </div>
        <p>
          Goyal、Jegadeesh 与 Wu 对 2012–2021 年美国股票发现平方根规格显著优于线性规格；1% ADV 订单的 closing-auction 冲击平均约 17.7 bp、中位数 8.4 bp，而对照线性估计约 2.35 bp。两者差异不只来自函数形式：论文还说明，早期结果使用横截面回归，而该研究使用证券内时间序列估计，估计维度也会改变数值。收盘通常比连续市场冲击低，但 Nasdaq 微盘股是明确例外；开盘竞价薄且冲击更大，只有部分股票存在可用的 09:28 盘前参考价。<Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="continuous-comparison">
        <p className="section-kicker">24 · Auction 与 Continuous 的成本不可直接比</p>
        <h2>统一价格不等于低成本，多价格也不等于低效率；两种机制购买的是不同的即时性、信息暴露和完成概率。</h2>
        <div className="table-scroll" role="region" aria-label="集合竞价与连续交易条件比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一证券、同一规模、同一基准下才有最小可比性</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">Call auction</th><th scope="col">Continuous book</th></tr></thead>
            <tbody>
              <tr><th scope="row">时间</th><td>等待到统一结束</td><td>订单到达即尝试执行</td></tr>
              <tr><th scope="row">价格</th><td>同批成交统一 p*</td><td>可逐层穿越多个价格</td></tr>
              <tr><th scope="row">流动性</th><td>聚合一个窗口的对手量</td><td>依赖当前局部 spread 与 depth</td></tr>
              <tr><th scope="row">风险</th><td>等待、无成交、最终价未知、需求泄露</td><td>路径冲击、队列、速度与当前薄簿</td></tr>
              <tr><th scope="row">选择偏差</th><td>刚性基准单与大批次流更可能进入</td><td>需要即时性或能择时的订单更可能进入</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Ellul、Shin 与 Tonks 研究 LSE 上交易者可选择 call 或 dealer market 的环境，发现 call 的价格发现较好，却在高信息不对称、失衡与不确定状态中成本和 failure-to-open/close 上升，小股票使用率也较低。这是“集中流动性必然最好”的重要反例，同时路由选择内生，不能把观察到的机制差异直接当随机实验。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="interface">
        <p className="section-kicker">25 · Auction–Continuous 接口</p>
        <h2>竞价量上升可能是新增流动性，也可能只是从最后几分钟搬家；接口决定价格发现发生在哪个时段。</h2>
        <p>
          引入 closing call 后，原本在连续市场最后几分钟执行的订单可能迁入竞价。Aitken、Comerton-Forde 与 Frino 对 ASX 的证据显示末段成交发生迁移，而连续价差总体未必恶化；Kandel、Rindi 与 Bosetti 对 Paris 与 Milan 的比较又说明，官方参考价是否采用 call price 会显著影响订单吸引力；Pagano、Peng 与 Schwartz 则把 Nasdaq calls 的价格形成变化与 order routing 放在同一研究中。因而只看 auction share 上升，既不能说总流动性增加，也不能说连续市场被抽空。<Cite n={17} /><Cite n={22} /><Cite n={23} />
        </p>
        <p>
          最小研究要把最后 5/15 分钟连续成交、进入 auction 的订单、未成交后续命运和开/收盘后的 spread/depth 串成同一订单生命周期。若只保留最终成功成交记录，就无法观察迁移、等待和失败成本。
        </p>
      </section>

      <section className="lesson-section" id="manipulation">
        <p className="section-kicker">26 · 学习、廉价信号与操纵边界</p>
        <h2>撤单本身不是操纵，异常订单模式也不是法律认定；关键是订单是否承担执行风险、是否意图制造虚假供需，以及收益是否在关联头寸实现。</h2>
        <p>
          合法学习链可以是：新信息到达 → 真实限价调整 → indicative price 改变 → 其他人补充流动性 → 最终价更有效。廉价信号链则是：大额可撤订单移动公开状态 → 别人响应 → 原单在结束前撤销 → 最终或后续价格反向修正。要推进到操纵判断，还需证明欺骗性意图或满足相应法律规则，并寻找跨市场收益、重复模式、最后数秒撤单和不承担执行的证据。Hillion 与 Suominen 的理论和 Paris 模式说明 closing call 可降低部分收盘操纵诱因；Comerton-Forde 与 Rydge 先从六个市场的 25 宗案件归纳共性，再选其中两宗代表性真实案件，用五类设计和十二种实际匹配算法重算，说明算法对同一操纵订单的抵御可以显著不同。两者都不是市场总体操纵发生率估计。<Cite n={15} /><Cite n={19} />
        </p>
        <p>
          Duong 等人从超过 1,000 个已起诉 ASX opening auctions 提炼模式：部分 ASX 200 成分股 indicative price 被大额虚假卖单压低，订单在开盘前 5–10 秒撤销或大幅缩量，收益在 SPI futures 侧实现；他们随后构造的 2016–2021 年指数只表示潜在异常概率，不是新的法律认定。Hauser 等人的股票—期权 preopening 研究也发现到期日 lead–lag、撤单与反转相容于操纵。两类证据都要求我们严格区分 prosecuted case、consistent-with pattern 和 model score。<Cite n={26} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="welfare">
        <p className="section-kicker">27 · 市场质量不是单一排名</p>
        <h2>一项规则可以同时提高成交量、降低尾部偏离，却增加等待和信息泄露；“更好”必须先声明评价维度和受影响主体。</h2>
        <div className="table-scroll" role="region" aria-label="竞价市场质量维度，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>至少七个不可互相替代的结果</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">可观察量</th><th scope="col">常见误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">价格发现</th><td>相对后续可交易价格的误差、信息份额</td><td>把低波动当高效率</td></tr>
              <tr><th scope="row">执行成本</th><td>相对事前基准的 signed impact</td><td>用最终价自身作基准</td></tr>
              <tr><th scope="row">深度与完成</th><td>paired volume、fill rate、no-cross</td><td>只看成功成交样本</td></tr>
              <tr><th scope="row">完整性</th><td>尾部偏离、撤单异常、执法模式</td><td>把所有反转叫操纵</td></tr>
              <tr><th scope="row">即时性</th><td>等待、延迟开盘、extension</td><td>把等待成本记为零</td></tr>
              <tr><th scope="row">信息泄露</th><td>连续盘抢跑、相关资产先行</td><td>把透明度只视为公共品</td></tr>
              <tr><th scope="row">分配公平</th><td>不同订单类型/身份的 fill 与优先权</td><td>只比较总成交量</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="rule-cards">
        <p className="section-kicker">28 · 真实场所 Rule Cards</p>
        <h2>每一次跨市场比较都先冻结规则对象；以下卡片只提供当前阅读入口，不替代交易前核对。</h2>
        <div className="practice-grid">
          <article><span>SSE / SZSE · 股票 · 2026-07-06 版</span><h3>固定开收盘 call 与不可撤单窗</h3><p>共同以最大成交量和更优价全成为骨架，公开参考/匹配/未匹配状态；两所并列规则不同。时区为中国标准时间。研究必须再纳入板块、价格限制、停牌与异常状态。<Cite n={2} /><Cite n={3} /></p></article>
          <article><span>NYSE · Listed equities · 当前网页</span><h3>DMM、开盘时点弹性与收盘截止</h3><p>开盘失衡自 08:00 每秒发布，DMM 实际开盘可能晚于 09:30；普通 MOC/LOC 的 closing cutoff 为 15:50，D-order 可延至 15:59:50。NYSE Arca、American、Texas 规则不可合并。<Cite n={6} /></p></article>
          <article><span>Nasdaq · Equity 4 Rules 4752/4754</span><h3>Opening/Closing Cross 与净订单失衡指示</h3><p>净订单失衡指示（Net Order Imbalance Indicator，NOII）在开盘约 09:25–09:30、收盘约 15:50–16:00 发布；MOO/LOO、MOC/LOC 与 IO 有专门资格，价格选择、优先和阈值应按当前修订文本读取。<Cite n={4} /><Cite n={5} /></p></article>
          <article><span>Euronext · Trading Manual · 2025-12-08 版</span><h3>最大量、最小 surplus、参考价与随机窗口</h3><p>uncrossing 在附录规定的随机窗口发生；参考价依 opening 或后续 auction 而异，市场单、更优限价和同价时间优先共同进入分配。<Cite n={7} /></p></article>
          <article><span>HKEX · Closing Auction Session</span><h3>两阶段价格带、freeze 与随机结束</h3><p>16:01–16:06 可输入、修改、撤销，首段参考价 ±5%；16:06 后不可撤并收紧价格带，16:08–16:10 随机结束。合格连续订单可带入，产品覆盖需另查。<Cite n={8} /></p></article>
          <article><span>JPX / TSE · Cash equities · 2024-11-05 后</span><h3>15:25–15:30 pre-closing 与 Itayose</h3><p>连续交易后进入五分钟 pre-closing，最后以 Itayose 清算；continuous 的 Zaraba 与 call 的 Itayose 是两个协议，on-close、funari 和带入订单的优先需按官方方法表解释。<Cite n={9} /></p></article>
        </div>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">29 · 证据地图</p>
        <h2>不同论文测的是不同结果；把它们压成“auction 有效/无效”会制造伪冲突。</h2>
        <div className="table-scroll" role="region" aria-label="集合竞价证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先问识别对象，再比较结论</caption>
            <thead><tr><th scope="col">证据路径</th><th scope="col">主要结果</th><th scope="col">能支持</th><th scope="col">不能支持</th></tr></thead>
            <tbody>
              <tr><th scope="row">Preopen 订单/报价路径</th><td>预测误差、撤改单、到达时点</td><td>学习与策略提交怎样演化</td><td>仅凭撤单认定操纵</td></tr>
              <tr><th scope="row">引入/改算法事件</th><td>成本、同步、成交迁移、尾部</td><td>特定制度包前后变化</td><td>拆分同时变化的每个组件</td></tr>
              <tr><th scope="row">Floor/DMM 准实验</th><td>偏离、深度、反转、连续流动性</td><td>一组人工渠道被移除的总效应</td><td>“人类永远更好/更差”</td></tr>
              <tr><th scope="row">指数/到期日需求</th><td>失衡、冲击、多期限反转</td><td>刚性流与暂时压力相容性</td><td>无账户数据识别全部主体</td></tr>
              <tr><th scope="row">跨机制条件曲线</th><td>同规模 impact、分层异质性</td><td>现实条件成本基准</td><td>忽略路由内生性作强因果</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="empirical-cases">
        <p className="section-kicker">30 · 八个经验切片</p>
        <h2>案例的价值不是给一个赢家，而是展示机制怎样随信息、流动性与制度组件改变。</h2>
        <div className="practice-grid">
          <article><span>01 · Paris / Euronext</span><h3>Preopen learning 与 closing-call 改革</h3><p>早段噪声向临近开盘学习过渡；两次分阶段 closing call 每组 50 股、前后各 250 日，改善若干价格形成维度。改革结果不能外推到所有算法。<Cite n={10} /><Cite n={14} /></p></article>
          <article><span>02 · NYSE opening</span><h3>Specialist/DMM、库存与现代 floor 准实验</h3><p>历史 TORQ 揭示中介利用簿与库存；2020 floor closure 提供捆绑处理（bundled treatment：一次事件同时改变多条机制）的证据。两者相隔制度时代，不能合成一个恒定“人工效应”。<Cite n={12} /><Cite n={29} /></p></article>
          <article><span>03 · ASX</span><h3>算法透明度改革与 opening manipulation</h3><p>2002 联合改革改善部分效率；已起诉案件则显示跨期货收益、末秒撤单与虚假 indicative move 的可验证链。一个讲设计质量，一个讲完整性尾部。<Cite n={18} /><Cite n={30} /></p></article>
          <article><span>04 · HKEX 2002 / 2008 / 2016</span><h3>设计、流动性状态与保护组件都重要</h3><p>2002 opening call 后低活跃股质量恶化，反驳“只要聚合就更好”；2008 closing call 暂停、2016 加入随机结束、不可撤与两阶段价格带后，相关 sniping/反转模式消失。样本与多项组件共同变化，不能归因单一按钮。<Cite n={20} /><Cite n={25} /></p></article>
          <article><span>05 · LSE parallel mechanisms</span><h3>价格发现较好，不等于困难状态成本更低</h3><p>交易者自选 call 或 dealer；call 在高失衡和不确定时可能更贵且失败率更高，小股使用率较低。路由选择是结论边界。<Cite n={16} /></p></article>
          <article><span>06 · Singapore 2000</span><h3>全市场引入 opening/closing calls</h3><p>250 只活跃股、前后各 240 日显示若干价格发现、IPO 开盘量和收盘完整性改善；一次性全市场事件仍可能混入同期变化。<Cite n={21} /></p></article>
          <article><span>07 · NYSE versus Nasdaq close</span><h3>深度、tick、特殊订单与非线性冲击</h3><p>2019 年收盘量约占全日 10%，NYSE 深度更大、暂时冲击约 3–5 日消散；现代论文又显示 tick binding、被动持仓和 Nasdaq 微盘例外。<Cite n={27} /><Cite n={28} /><Cite n={32} /><Cite n={33} /></p></article>
          <article><span>08 · Tokyo</span><h3>被动持仓、流动性集中与 2024 新 pre-close</h3><p>2019 规则修订后，被动持仓高的股票更集中到收盘，连续 spread 改善而隔夜效率恶化；2024 新机制是未来研究对象，旧样本不能提前证明其效果。<Cite n={9} /><Cite n={34} /></p></article>
        </div>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">31 · 互动实验</p>
        <h2>先从冻结账本生成清算与个人 fill，再转入规则边界、价格路径和指数换仓反事实。</h2>
        <p>八题分成两个模式。Mode A 要逐价计算，不允许用方向直觉代替累计曲线；Mode B 要同时写出最弱可支持结论和仍未排除的机制。全部题目使用明确教学协议，真实市场前必须回到第 28 节 Rule Card。</p>
        <OpeningClosingAuctionLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">32 · 八个反例库</p>
        <h2>每个反例都拆掉一句看似合理、却越过条件边界的结论。</h2>
        <div className="practice-grid">
          <article><span>反例 01</span><h3>“统一价格，所以每个人成本相同”</h3><p>所有成交同价不等于机会成本相同：不同订单有不同限价、等待、信息泄露和未成交风险，allocation 还决定个人 fill。</p></article>
          <article><span>反例 02</span><h3>“最大成交量，所以供需相等”</h3><p>Q*=min(B,S) 只要求两侧较小者被配对，另一侧仍可有失衡；第 07 节就在唯一最大量价格留下 15 股卖量。</p></article>
          <article><span>反例 03</span><h3>“Indicative price 上升，就是有人买入成交”</h3><p>零成交状态下新增、撤销和修改订单也会重画曲线；指示价是条件清算结果，不是 trade print。</p></article>
          <article><span>反例 04</span><h3>“透明度越高，价格发现越好”</h3><p>透明度能招来抵消流，也会泄露刚性需求并让可撤订单影响信号；净效果取决于承诺和响应能力。</p></article>
          <article><span>反例 05</span><h3>“Freeze 越长，操纵越少”</h3><p>策略可提前到 freeze 前，真实错误更难纠正；结果要连同撤单迁移、无成交和尾部一起评估。</p></article>
          <article><span>反例 06</span><h3>“收盘量大，所以冲击必然小”</h3><p>大量对手流可以加深市场，刚性同向流也可压倒供给；Nasdaq 微盘就是收盘并不占优的经验边界。</p></article>
          <article><span>反例 07</span><h3>“反转证明操纵”</h3><p>反转也可能来自库存补偿、bid–ask bounce 或新消息；操纵还需要欺骗性行为、收益动机和规则/法律证据。</p></article>
          <article><span>反例 08</span><h3>“Auction share 上升等于新增流动性”</h3><p>成交可能从最后几分钟连续盘迁入；必须沿订单生命周期计算总量、替代与后续流动性。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">33 · 六个可证伪研究</p>
        <h2>世界观可以容纳多机制，研究问题必须让至少一种解释有机会被数据否证。</h2>
        <p>
          以下先给研究术语的最低共同语言。事件时间（event time）把规则改变、指数实施或竞价结束记为 0，再比较其前后相对位置；事件研究（event study）估计结果围绕该事件怎样演化。双重差分（difference-in-differences，DiD）用“处理组的前后变化减去对照组的前后变化”隔离共同时间变化，处理前趋势（pretrend）则检查两组在事件前是否已经沿不同方向移动。捆绑处理（bundled treatment）表示一次事件同时改变人工沟通、订单权限等多条机制，因而只能先识别整包效果。工具变量（instrumental variable）是一个能推动处理、却在所声明假设下不经其他通道直接推动结果的外部变化；假设不成立时，它不能创造因果识别。7.25 会系统讲估计方法，本节只用这些词冻结 auction-specific 的反事实、信息集和失败条件。
        </p>
        <div className="research-grid">
          <article><span>研究 A · Learning or cheap signal</span><h3>公开状态是否越接近随机/计划结束越准确，并在竞价后继续有效？</h3><p><b>设计：</b>只用每个 event time 当时真实公开的 indicative price、paired volume、imbalance、add/cancel/amend 预测最终价及后 5/30 分钟中点。<b>否证：</b>若未执行末段大单显著移动指示价却伴随最终和后续反向修正，单纯学习解释受损。最终价和最终撤单状态不得泄漏到早期特征。</p></article>
          <article><span>研究 B · Rule change</span><h3>Freeze、random end、collar 或 extension 改革降低了哪一种尾部，又转移了什么成本？</h3><p><b>设计：</b>有未覆盖证券/相近场所对照的 event study 或 DiD，先检验 pretrend。<b>共同结果：</b>尾部偏离、反转、fill、no-cross、延迟、触发、撤单时点与连续盘替代。只见成交样本波动下降而失败上升，不算无条件改善。</p></article>
          <article><span>研究 C · Opening manipulation</span><h3>衍生品到期日的末秒大单是否只移动指数成分股指示价，并在相关期货实现收益？</h3><p><b>设计：</b>指数成分股为处理组，相近非成分股为对照，交互 expiry day；用已起诉案件校准撤单/偏离阈值，再样本外验证。<b>边界：</b>模型输出必须叫“潜在异常”，不叫法律认定。</p></article>
          <article><span>研究 D · Human intermediation</span><h3>DMM/floor 改变的是深度、绝对偏离，还是随后反转？</h3><p><b>设计：</b>利用 closure、分阶段 reopening 或资格变化，分别测连续流动性、开收盘偏离、D-order 与多期限反转。<b>否证：</b>若改善只来自同期市场回稳或另一订单类型，人工判断主解释被削弱。</p></article>
          <article><span>研究 E · Benchmark pressure</span><h3>预先公告的指数换仓是否造成同向失衡、即期冲击和随后反转？</h3><p><b>设计：</b>阈值附近证券、预测误差或规则工具变量，控制公告至实施间抢跑；观察 auction、盘后、隔夜和 3–5 日。持久变化支持信息或永久需求，快速反转更支持暂时风险承载。</p></article>
          <article><span>研究 F · Auction versus continuous</span><h3>同一规范化订单规模在两种机制中的条件冲击曲线怎样变化？</h3><p><b>设计：</b>同证券同日、同参考基准，按市值、spread、波动、venue 与 opening/closing 分层拟合平方根曲线。<b>边界：</b>订单路由和规模内生，观察性差异只能称条件成本；强因果需要准随机路由冲击。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="measurement">
        <p className="section-kicker">34 · 数据与测量协议</p>
        <h2>竞价研究最危险的错误往往不在回归，而在时间对齐、规则版本、参考价和失败状态的定义。</h2>
        <div className="table-scroll" role="region" aria-label="集合竞价研究数据协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>最小可复现字段</caption>
            <thead><tr><th scope="col">层</th><th scope="col">必须冻结</th><th scope="col">常见泄漏/偏误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Calendar</th><td>venue local time、UTC、DST、半日市、延迟开盘、随机结束</td><td>把 16:00 当全球同一时点</td></tr>
              <tr><th scope="row">Rule</th><td>产品、版本、生效日、order type、cutoff、freeze、collar</td><td>用今天规则重算历史竞价</td></tr>
              <tr><th scope="row">Book events</th><td>add/cancel/amend、序号、价格、数量、资格状态</td><td>用最终撤单状态标注早期观测</td></tr>
              <tr><th scope="row">Auction output</th><td>p*、Q*、imbalance、allocation、no-cross/delay/extension</td><td>删除失败状态</td></tr>
              <tr><th scope="row">Reference prices</th><td>竞价前可比 mid、官方 ref、后 5/30 分钟、次日多时点</td><td>把最后一笔或 auction 自身当事前基准</td></tr>
              <tr><th scope="row">Scaling</th><td>shares、ADV、free float、bp、shares per bp</td><td>用当天最终 ADV 分母做实时特征</td></tr>
            </tbody>
          </table>
        </div>
        <p>所有事件特征都必须服从当时信息集。随机结束市场应以“距窗口起点/当前区间条件结束概率”而非事后真实剩余秒数建模；延迟开盘不能被强行对齐到计划 09:30；停牌、无交叉和 collar 阻断必须作为状态编码。开盘后中点、收盘前中点、盘后价格和下一交易日价格回答不同反事实，不能统称 fundamental value。</p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">35 · 主动练习</p>
        <h2>答案必须同时给出计算、规则范围、机制链与不能推出的结论。</h2>
        <div className="practice-grid">
          <article><span>练习 01 · 清算与分配</span><h3>买方：市价 20、51×40、50×30；卖方：市价 10、49×20、50×25、51×45，其中 51 元同价池完整地由 A=18 先到、B=27 后到组成。候选价 49/50/51。求 p*、Q*、I(p*)；比较 time priority 与 pro rata 的个人 fill。</h3><details className="practice-answer"><summary>展开参考答案</summary><p>p=49: B=90,S=30,V=30,I=+60；p=50: B=90,S=55,V=55,I=+35；p=51: B=60,S=100,V=60,I=−40，因此 p*=51、Q*=60。卖方更优量为市价10+49×20+50×25=55，清算价只需 5。time priority 给 A 5、B 0；pro rata 按 18:27 分配，A=5×18/45=2、B=5×27/45=3，恰为整数而无须舍入。这不说明真实场所必用某种分配，也不能从 I&lt;0 保证后续下跌。</p></details></article>
          <article><span>练习 02 · 动态指示路径</span><h3>09:24:30 的指示价为 100、paired 80、买方失衡 20。09:24:40 新增可撤卖单 60 使指示价降至 99；09:24:58 该单全撤，最终以 100、paired 82 开盘。最弱结论是什么？还需什么证据才能讨论操纵？</h3><details className="practice-answer"><summary>展开参考答案</summary><p>最弱结论是该卖单在不成交条件下显著改变了公开指示状态，随后撤销且最终价反向恢复，与廉价信号相容。还需订单所有者、重复模式、跨市场/衍生品头寸与收益、当时新信息、实际撤单原因、场所规则和法律标准。一次路径不能证明意图，也不能把所有大额末段撤单都归为操纵。</p></details></article>
          <article><span>练习 03 · Collar 改革</span><h3>改革后已成交 auction 的 99 分位偏离从 90 bp 降到 40 bp，但 no-cross 从 0.5% 升至 2.5%，最后五分钟连续成交提高 12%。怎样评价？</h3><details className="practice-answer"><summary>展开参考答案</summary><p>改革降低了成功清算样本的尾部偏离，却同时提高失败并把部分交易迁移到连续市场；不能称无条件质量改善。应把 no-cross 的机会成本、连续市场 impact、延迟、fill、边界堆积和后续价格加入共同福利表，并用未受改革证券/场所检查同期趋势。</p></details></article>
          <article><span>练习 04 · 开盘还是收盘</span><h3>同一股票 opening auction 为 1.2% ADV、冲击 45 bp、次日仍保留 90%；closing auction 为 8% ADV、冲击 10 bp、隔夜只保留 20%。构造最可信的两条机制链，并写出竞争解释。</h3><details className="practice-answer"><summary>展开参考答案</summary><p>开盘更符合隔夜信息在薄对手流中进入价格，较高持久性支持价格发现；竞争解释包括未控制的市场新闻和盘前参考价噪声。收盘更符合基准刚性流在深度更厚的竞价中被吸收，低单位冲击但大幅反转支持暂时压力；竞争解释包括 bid–ask bounce、盘后新消息和参考中点偏误。两者不是 auction 本身优劣，而是需求组成与状态不同。</p></details></article>
          <article><span>练习 05 · 指数阈值研究</span><h3>设计一个区分“指数纳入带来永久信息”与“被动收盘压力”的最小方案，明确时间轴、处理组、对照和失败条件。</h3><details className="practice-answer"><summary>展开参考答案</summary><p>以指数规则阈值附近、实施前可预测但最终一纳一不纳的证券构造处理/对照；时间轴分公告前、公告至实施、实施日连续尾段、closing auction、盘后、次日和 3–5 日。压力假说预测实施日同向失衡与即期冲击、随后显著反转；永久信息预测更持久。公告后提前交易、同期公司新闻、市场收益和不同流动性趋势必须控制。若处理前趋势不平行或阈值可被公司操控，设计失败。</p></details></article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">36 · 理解检查</p>
        <h2>能从一张指示价格图回到订单、规则、分配、主体约束和后续反事实，才算真正掌握。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么 B(p) 随 p 上升不增，S(p) 不减？</summary><p>更高买价筛掉限价较低的买单；更高卖价则允许更多限价较高的卖单进入可执行集合。二者来自限价的可接受方向。</p></details>
          <details><summary>02 · arg max V(p) 为什么可能不是唯一价格？</summary><p>累计曲线是阶梯函数，多个候选价可以共享同一最大配对量；真实算法需再应用场所特定 tie-break。</p></details>
          <details><summary>03 · I(p*)&gt;0 能否预测之后上涨？</summary><p>不能。它只描述冻结账本在该价格的买方剩余；未成交订单、后续供给、新信息与规则接口都会改变路径。</p></details>
          <details><summary>04 · 为什么清算价与 allocation 必须分开？</summary><p>p*、Q* 是市场总结果；同价 time priority、pro rata 或 parity 决定个人 fill，进而影响提交策略。</p></details>
          <details><summary>05 · Indicative price 是否是“预估基本价值”？</summary><p>它是当前合格账本按当前规则若立刻结束的条件清算价，包含信息、流动性需求和策略订单，不是无条件价值预测。</p></details>
          <details><summary>06 · Freeze、random end、collar 分别约束什么？</summary><p>Freeze 约束撤改选择权，random end 约束精确等待最后时点，collar 约束价格结果；三者都不自动创造对手量。</p></details>
          <details><summary>07 · 为什么 opening 与 closing 不能合并回归一个 auction dummy？</summary><p>开盘主要承接隔夜信息和较薄流，收盘主要承接基准刚性流和更深数量；同一机制的规模、信息性和后续路径不同。</p></details>
          <details><summary>08 · 反转最弱能支持什么？</summary><p>与暂时价格压力相容；仍要排除新消息、共同市场、参考价误差和 bid–ask bounce，不能单独证明无信息或操纵。</p></details>
          <details><summary>09 · 为什么只比较成功成交会偏误？</summary><p>Collar、失衡和低流动性会选择性制造 no-cross、延迟或部分成交；删掉失败状态只留下较容易成功的竞价。</p></details>
          <details><summary>10 · 读真实规则最少要冻结什么？</summary><p>Venue、产品、opening/closing、版本生效日、时区、订单资格、候选集合、目标顺序、tie-break、allocation、透明度、撤改/freeze/random/collar 和 residual routing。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">37 · 课程接口</p>
        <h2>本节把离散 phase 打开成完整清算系统；下一步研究 tick size 如何改变候选价格网格、队列和竞争，再把规则版本与失败状态交给研究设计。</h2>
        <div className="interface-grid">
          <article><span>← 1.01 / 1.02</span><h3>Matching 与 Market Architecture</h3><p>输入限价可接受集合、min(B,S) 和 call/continuous 区别；1.17 增加完整 tie-break、allocation、规则保护与制度反馈。</p></article>
          <article><span>← 1.16</span><h3>Intraday Seasonality</h3><p>1.16 只把 auction 冻结为离散 phase；本节解释为何 opening 与 closing 的相同钟表尖峰可以来自完全不同主体约束。</p></article>
          <article><span>→ 1.18</span><h3>Tick Size 与最小报价单位</h3><p>本节把 tick 当作给定的候选价格网格；下一节研究改变网格怎样重塑 spread、depth、队列竞争与市场质量。</p></article>
          <article><span>← 1.11</span><h3>Price Discovery</h3><p>输入“信息在哪里先进入价格”的识别边界；本节把它落实为 indicative prediction、auction innovation 与多期限 persistence。</p></article>
          <article><span>→ 2.04</span><h3>Passive Index Fund / ETF</h3><p>输出 benchmark demand、指数换仓失衡和暂时压力的市场接口；2.04 再展开被动资金目标、申赎与跟踪约束。</p></article>
          <article><span>→ 5.05 / 7.25</span><h3>Regulation & Research Design</h3><p>输出 Rule Card、制度包权衡、event time、失败状态和不泄漏信息集，作为规则评估的最小协议。</p></article>
        </div>
        <p className="closing-thesis">面对任何开盘或收盘异动，应依次追问：哪一批订单有资格参加；候选价怎样生成；B(p)、S(p)、V(p)、I(p) 如何计算；多个价格怎样破除并列；更优价和同价订单怎样分配；指示状态在何时发布且订单能否撤改；freeze、随机结束、collar 与延长分别约束什么；未成交订单去哪里；开盘是在吸收隔夜信息，还是收盘在吸收基准刚性流；价格变化在 5 分钟、隔夜和 3–5 日保留多少；证据识别的是价格发现、成本、深度、完整性还是等待。只有这些问题都被回答，auction print 才不再是一根神秘的大 K 线，而是一套可计算、可比较、可证伪的价格形成机制。</p>
      </section>
    </>
  );
}

export const lesson117: LessonRecord = {
  slug: '1-17',
  id: '1.17',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Opening / Closing Auction',
  subtitle: '从累计清算曲线、统一价格与个人分配出发，解释指示失衡、撤改承诺、随机结束、价格保护，以及开盘价格发现与收盘基准压力',
  readingTime: '约 106–113 分钟（核心阅读 64–68＋互动实验 14–15＋主动练习 18–19＋理解检查 8–9＋课程接口 2；参考文献与延伸阅读不计）',
  prerequisite: '1.01 · 价格究竟是什么；1.02 · Market Architecture：交易所怎样组织交易',
  updatedAt: '2026-08-29',
  revision: '1.17-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.17-r1',
      summary: '确认七个交易所规则卡、34 条来源、全部清算手算、五项练习与八题状态机大体成立；要求修正竞价冲击式的双重符号、把估计失衡从最终残余改为首次公开时点并冻结前十日 ADV，同时统一保留率口径、补充估计维度边界并校正文献元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.17-r1',
      summary: '确认 38 节主线、八案例、八反例、互动状态机、阅读预算与引用锚点成立；要求修正未来章节接口，闭合缩写、公式与研究术语的首次解释，补全练习 01 的同价分配池，并让合并交易所阅读卡与单一链接一致。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.17-r2',
      summary: '确认 r1 的方向符号、前十日 ADV、保留率、估计维度与元数据修订落位，并全量回归七所规则和全部计算；要求进一步区分 Goyal–Jegadeesh–Wu 的 closing 首次披露、opening 09:28 ET 与 continuous 30 分钟信息集，同时闭合 arg min 集合、log-bp、区间结束概率和 B4 对数收益口径。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.17-r2',
      summary: '确认 r1 的章节接口、首次术语、公式解释、练习分配池与阅读卡问题关闭；全量回归 38 节、案例、反例、练习、互动和阅读预算后，要求清除两处陈旧导航，令 tie-break 集合与 ln 记号闭合，并删除实验反馈中未定义的 OC。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.17-r3',
      summary: '全量终审确认 closing 首次披露、opening 09:28 ET、continuous 30 分钟 signed trades 的信息集，P3 集合、ln/log-bp、区间结束概率、B4 对数异常收益、七所规则、34 条来源、全部计算和路由均通过，blocker、major、minor 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.17-r3',
      summary: '确认 r2 全部教学遗留及 38 节、八案例、八反例、五练习、十检查、互动状态机、引用和阅读预算均通过；仅要求在论文复现说明中首次展开 TAQ，并直译 signed trades 与公开 auction OI 的区别。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.17-r4',
      summary: '终审确认一般 τ0 与 Goyal–Jegadeesh–Wu 的 closing 首次披露、opening 09:28 ET、TAQ 参考价和 continuous 30 分钟 signed trades 均准确；全部公式、七所规则、34 条来源、手算、练习、八题状态机和导航全量通过，blocker、major、minor 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.17-r4',
      summary: '终审确认 τ0 一般概念先于论文复现、TAQ 与 signed trades 首释闭合；38 节坡度、八案例、八反例、五练习、十检查、八题可访问状态机、18 张阅读卡、阅读预算与章节接口全量通过，blocker、major、minor 均为 0。',
    },
  ],
  previous: { slug: '1-16', label: '1.16 Intraday Seasonality' },
  next: { slug: '1-18', label: '1.18 Tick Size 与最小报价单位' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整系统' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'objects', label: '九个对象' },
    { id: 'ledger', label: '订单账本' },
    { id: 'candidate-set', label: '候选集合' },
    { id: 'clearing-objective', label: '第一层目标' },
    { id: 'worked-clear', label: '唯一清算价' },
    { id: 'tie-breaks', label: 'Tie-break' },
    { id: 'china-rules', label: '上交所 / 深交所' },
    { id: 'allocation', label: '价格与分配' },
    { id: 'allocation-rules', label: '分配逻辑' },
    { id: 'residual-routing', label: '剩余订单接口' },
    { id: 'indicative-state', label: 'Indicative State' },
    { id: 'order-semantics', label: '订单语义' },
    { id: 'commitment-window', label: '撤改与承诺' },
    { id: 'random-end', label: '随机结束' },
    { id: 'collars', label: 'Collar / Extension' },
    { id: 'transparency', label: '透明度权衡' },
    { id: 'opening-function', label: '开盘经济功能' },
    { id: 'opening-intermediation', label: '开盘中介' },
    { id: 'closing-function', label: '收盘经济功能' },
    { id: 'benchmark-pressure', label: 'Benchmark Pressure' },
    { id: 'impact-path', label: 'Impact 与保留率' },
    { id: 'continuous-comparison', label: 'Auction / Continuous' },
    { id: 'interface', label: '连续市场接口' },
    { id: 'manipulation', label: '操纵边界' },
    { id: 'welfare', label: '市场质量维度' },
    { id: 'rule-cards', label: '真实场所规则卡' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'empirical-cases', label: '八个经验切片' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'measurement', label: '数据协议' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson117Content,
  references: [
    { id: 1, authors: 'Ananth Madhavan', year: '1992', title: 'Trading Mechanisms in Securities Markets', publication: 'Journal of Finance, 47(2), 607–641', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04403.x', use: '提供 periodic auction 与 continuous mechanism 在信息不对称下的理论比较；结论依赖理性信息交易、进入和时间成本等模型假设。' },
    { id: 2, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-28', title: '上海证券交易所交易规则（2026年修订）', publication: '上交所官方规则 · 2026-07-06 生效', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml', use: '冻结股票开收盘集合竞价时段、不可撤单窗、竞价信息字段、成交价格确定与并列中间价规则；不外推至其他产品或历史版本。' },
    { id: 3, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-28', title: '深圳证券交易所交易规则（2026年修订）', publication: '深交所官方规则 · 2026-07-06 生效', url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf', use: '冻结股票开收盘时段、不可撤单窗、参考/匹配/未匹配信息和成交价并列规则；不替代板块与产品细则。' },
    { id: 4, authors: 'Nasdaq Stock Market', year: '2026', accessedAt: '2026-08-28', title: 'Nasdaq Equity 4 Rules 4752 and 4754: Opening and Closing Process', publication: 'Nasdaq official current rulebook', url: 'https://listingcenter.nasdaq.com/rulebook/Nasdaq/rules/Nasdaq%20Equity%204/block/EQUALS/', use: '冻结 current opening/closing cross 的订单资格、清算目标、tie-break、优先与 NOII 规则；规则持续修订，使用时必须复核有效版本。' },
    { id: 5, authors: 'Nasdaq Trader', year: '2025', accessedAt: '2026-08-28', title: 'The Nasdaq Opening and Closing Crosses: Frequently Asked Questions', publication: 'Nasdaq official market operations FAQ · 2025 copyright notice', url: 'https://www.nasdaqtrader.com/content/productsservices/trading/crosses/openclose_faqs.pdf', use: '辅助解释 NOII 发布、MOO/LOO/MOC/LOC 和 imbalance-only 订单的操作语义；若与规则正文冲突，以当前 rulebook 为准。' },
    { id: 6, authors: 'New York Stock Exchange', year: '2026', accessedAt: '2026-08-28', title: 'Auctions: Opening and Closing Auctions', publication: 'NYSE official market operations page', url: 'https://www.nyse.com/trade/auctions', use: '冻结 NYSE 当前失衡发布、DMM 开盘、MOC/LOC 与 D-order 收盘截止；不把 NYSE、Arca、American 与 Texas 合并为同一协议。' },
    { id: 7, authors: 'Euronext', year: '2025', accessedAt: '2026-08-28', title: 'Trading Manual for the Optiq Trading Platform', publication: 'Euronext official manual · effective 8 December 2025', url: 'https://www.euronext.com/sites/default/files/2026-06/Trading%20Manual%20-%20311025%20-%20AVD%20orders%2Bdark%20post-only%2Bhybrid%20model%20.pdf', use: '冻结 uncrossing 的最大量、最小 surplus、参考价、随机窗口和分配骨架；市场附录和产品差异仍需另查。' },
    { id: 8, authors: 'Hong Kong Exchanges and Clearing', year: '2026', accessedAt: '2026-08-28', title: 'Trading Mechanism: Closing Auction Session', publication: 'HKEX official securities trading reference', url: 'https://www.hkex.com.hk/Services/Trading/Securities/Overview/Trading-Mechanism?sc_lang=en', use: '冻结 CAS 的订单阶段、两阶段价格带、不可撤期和随机结束；覆盖证券与特殊日历须配合最新细则。' },
    { id: 9, authors: 'Japan Exchange Group / Tokyo Stock Exchange', year: '2024', accessedAt: '2026-08-28', title: 'Trading Methods: Zaraba and Itayose', publication: 'JPX official domestic equities reference', url: 'https://www.jpx.co.jp/english/equities/trading/domestic/04.html', use: '区分连续 Zaraba 与集合 Itayose，并冻结 2024-11-05 后 pre-closing、on-close/funari 和订单衔接的官方入口。' },
    { id: 10, authors: 'Bruno Biais, Pierre Hillion & Chester Spatt', year: '1999', title: 'Price Discovery and Learning during the Preopening Period in the Paris Bourse', publication: 'Journal of Political Economy, 107(6), 1218–1248', url: 'https://doi.org/10.1086/250095', use: '支持 Paris preopening 早段噪声、临近开盘学习与策略提交；不把所有撤单称为操纵。' },
    { id: 11, authors: 'Charles Cao, Eric Ghysels & Frank Hatheway', year: '2000', title: 'Price Discovery without Trading: Evidence from the Nasdaq Preopening', publication: 'Journal of Finance, 55(3), 1339–1365', url: 'https://doi.org/10.1111/0022-1082.00249', use: '说明 Nasdaq dealer quotes 在无成交时也能传递信息；该制度不是 call auction，不能证明批量清算算法效果。' },
    { id: 12, authors: 'Ananth Madhavan & Venkatesh Panchapagesan', year: '2000', title: 'Price Discovery in Auction Markets: A Look Inside the Black Box', publication: 'Review of Financial Studies, 13(3), 627–658', url: 'https://doi.org/10.1093/rfs/13.3.627', use: '用 144 只 NYSE TORQ 股票分析 specialist、订单簿与库存对开盘价格发现的作用；历史 1990 年制度限制外推。' },
    { id: 13, authors: 'Ryan J. Davies', year: '2003', title: 'The Toronto Stock Exchange Preopening Session', publication: 'Journal of Financial Markets, 6(4), 491–516', url: 'https://doi.org/10.1016/S1386-4181(02)00018-6', use: '支持 registered trader 参与、库存调整与缓和隔夜价格变化相容；不证明中介拥有私人信息。' },
    { id: 14, authors: 'Michael S. Pagano & Robert A. Schwartz', year: '2003', title: 'A Closing Call’s Impact on Market Quality at Euronext Paris', publication: 'Journal of Financial Economics, 68(3), 439–484', url: 'https://doi.org/10.1016/S0304-405X(03)00073-4', use: '利用两组各 50 股、前后各 250 日的分阶段改革，支持若干成本、同步与价格发现改善；不外推为任意 call 均有效。' },
    { id: 15, authors: 'Pierre Hillion & Matti Suominen', year: '2004', title: 'The Manipulation of Closing Prices', publication: 'Journal of Financial Markets, 7(4), 351–375', url: 'https://doi.org/10.1016/j.finmar.2004.04.002', use: '用模型与 Paris 收盘前模式说明 closing call 可降低部分操纵诱因；不是逐案意图或法律认定。' },
    { id: 16, authors: 'Andrew Ellul, Hyun Song Shin & Ian Tonks', year: '2005', title: 'Opening and Closing the Market: Evidence from the London Stock Exchange', publication: 'Journal of Financial and Quantitative Analysis, 40(4), 779–801', url: 'https://doi.org/10.1017/S0022109000001976', use: '比较可自选 call 与 dealer market，显示价格发现优势可与困难状态的高成本/失败率并存；路由选择内生。' },
    { id: 17, authors: 'Michael Aitken, Carole Comerton-Forde & Alex Frino', year: '2005', title: 'Closing Call Auctions and Liquidity', publication: 'Accounting & Finance, 45(4), 501–518', url: 'https://doi.org/10.1111/j.1467-629X.2005.00155.x', use: '支持 ASX 引入 closing call 后末段成交迁移且连续价差总体未必恶化；一次性市场改革限制因果外推。' },
    { id: 18, authors: 'Carole Comerton-Forde & James Rydge', year: '2006', title: 'The Influence of Call Auction Algorithm Rules on Market Efficiency', publication: 'Journal of Financial Markets, 9(2), 199–222', url: 'https://doi.org/10.1016/j.finmar.2006.02.001', use: '分析 ASX 2002 算法和 IAP/surplus 透明度联合改革；效率改善不能拆分为单一组件效应。' },
    { id: 19, authors: 'Carole Comerton-Forde & James Rydge', year: '2006', title: 'Call Auction Algorithm Design and Market Manipulation', publication: 'Journal of Multinational Financial Management, 16(2), 184–198', url: 'https://doi.org/10.1016/j.mulfin.2005.06.002', use: '先从六个市场 25 宗案件归纳共性，再对其中两宗代表性案件用五类设计和十二种实际算法重算；不估计市场总体操纵发生率。' },
    { id: 20, authors: 'Carole Comerton-Forde, James Rydge & Hayley Burridge', year: '2007', title: 'Not All Call Auctions Are Created Equal: Evidence from Hong Kong', publication: 'Review of Quantitative Finance and Accounting, 29(4), 395–413', url: 'https://doi.org/10.1007/s11156-007-0036-9', use: '记录 HKEX 2002 opening call 后低活跃股质量恶化，支持设计与流动性状态的重要性；不证明 call 本身有害。' },
    { id: 21, authors: 'Carole Comerton-Forde, Sie Ting Lau & Thomas H. McInish', year: '2007', title: 'Opening and Closing Behavior Following the Introduction of Call Auctions in Singapore', publication: 'Pacific-Basin Finance Journal, 15(1), 18–35', url: 'https://doi.org/10.1016/j.pacfin.2006.04.002', use: '用 250 只股票、前后各 240 日支持若干开收盘质量与完整性改善；全市场一次性改革仍有同期混淆。' },
    { id: 22, authors: 'Eugene Kandel, Barbara Rindi & Luca Bosetti', year: '2012', title: 'The Effect of a Closing Call Auction on Market Quality and Trading Strategies', publication: 'Journal of Financial Intermediation, 21(1), 23–49', url: 'https://doi.org/10.1016/j.jfi.2011.03.002', use: '比较 Paris 与 Milan，说明 closing reference price 的定义会改变订单路由和末段策略；跨市场差异不只这一项。' },
    { id: 23, authors: 'Michael S. Pagano, Lin Peng & Robert A. Schwartz', year: '2013', title: 'A Call Auction’s Impact on Price Formation and Order Routing: Evidence from the NASDAQ Stock Market', publication: 'Journal of Financial Markets, 16(2), 331–361', url: 'https://doi.org/10.1016/j.finmar.2012.11.001', use: '支持 Nasdaq 2004 calls 后若干开收盘质量变化及订单路由效应；事件研究不是单机制随机实验。' },
    { id: 24, authors: 'Ester Félez-Viñas & Björn Hagströmer', year: '2021', title: 'Do Volatility Extensions Improve the Quality of Closing Call Auctions?', publication: 'Financial Review, 56(3), 385–406', url: 'https://doi.org/10.1111/fire.12275', use: '支持 Nasdaq Nordic extension 后暂时波动、操纵代理和竞价量变化；不证明所有阈值与延长期限最优。' },
    { id: 25, authors: 'Seongkyu Gilbert Park, Wing Suen & Kam-Ming Wan', year: '2022', title: 'Call Auction Design and Closing Price Manipulation: Evidence from the Hong Kong Stock Exchange', publication: 'Journal of Financial Markets, 58, 100700', url: 'https://doi.org/10.1016/j.finmar.2021.100700', use: '比较 HKEX 旧制与带多项保护的新制，支持 expiry/sniping 反转模式消失；长间隔和多组件共同变化限制归因。' },
    { id: 26, authors: 'Shmuel Hauser, Haim Kedar-Levy & Orit Milo', year: '2022', title: 'Price Discovery during Parallel Stocks and Options Preopening: Information Distortion and Hints of Manipulation', publication: 'Journal of Financial Markets, 59, 100705', url: 'https://doi.org/10.1016/j.finmar.2022.100705', use: '以色列到期日 lead–lag、撤单和反转与操纵相容，短随机延长未消除模式；多数结论仍非逐单意图认定。' },
    { id: 27, authors: 'Narasimhan Jegadeesh & Yanbin Wu', year: '2022', title: 'Closing Auctions: Nasdaq versus NYSE', publication: 'Journal of Financial Economics, 143(3), 1120–1139', url: 'https://doi.org/10.1016/j.jfineco.2021.12.003', use: '支持 2019 年美国收盘量约 10%、NYSE 深度较大与暂时冲击 3–5 日消散；冲击和路由仍内生。' },
    { id: 28, authors: 'Vincent Bogousslavsky & Dmitriy Muravyev', year: '2023', title: 'Who Trades at the Close? Implications for Price Discovery and Liquidity', publication: 'Journal of Financial Markets, 66, 100852', url: 'https://doi.org/10.1016/j.finmar.2023.100852', use: '给出 2010–2018 美国收盘量、tick 约束、价格偏离/反转和被动持仓关联；无账户级成交身份，不能解释全部流量。' },
    { id: 29, authors: 'Jonathan Brogaard, Matthew C. Ringgenberg & Dominik Rösch', year: '2025', title: 'Does Floor Trading Matter?', publication: 'Journal of Finance, 80(1), 375–414', url: 'https://doi.org/10.1111/jofi.13401', use: '利用 2020 NYSE floor closure 与 reopening 研究连续及开收盘质量；疫情环境和 bundled treatment 限制单渠道外推。' },
    { id: 30, authors: 'Huu Nhan Duong, Sean Foley, Petko S. Kalev & Kin Soon Lim', year: '2025', title: 'Identifying and Characterizing Opening Auction Manipulation', publication: 'Journal of Financial Markets, advance article 101031', url: 'https://doi.org/10.1016/j.finmar.2025.101031', use: '从超过 1,000 个已起诉 ASX 开盘案件提炼模式并作样本外潜在异常识别；指数输出不是法律认定。' },
    { id: 31, authors: 'Laurence Daures, Sophie Moinas & Selma Boussetta', year: '2025', title: 'Click First or Last? Strategic Order Submission During the Euronext Preopening Session', publication: 'Management Science, 72(3), 2656–2679 · online 2025', url: 'https://doi.org/10.1287/mnsc.2023.03998', use: '支持 preopening J 形提交、时间优先与信息泄露权衡；关键 glitch 准实验只有一天，外推需谨慎。' },
    { id: 32, authors: 'Edwin Hu & Dermot Murphy', year: '2025', title: 'Vestigial Tails? Floor Brokers at the Close in Modern Electronic Markets', publication: 'Management Science, 72(5), 3974–3996 · online 2025', url: 'https://doi.org/10.1287/mnsc.2023.00884', use: '显示 NYSE 末段 D-order 灵活性与异常失衡和更强反转相关，floor closure 支持识别；不否定 floor 在其他维度供给流动性。' },
    { id: 33, authors: 'Amit Goyal, Narasimhan Jegadeesh & Yanbin Wu', year: '2026', title: 'Price Impact in Closing Auctions, Opening Auctions, and Continuous Markets: A Benchmark for Cost of Trading on Anomalies', publication: 'Journal of Financial and Quantitative Analysis, First View, 1–36 · published online 5 March 2026', url: 'https://doi.org/10.1017/S0022109026102592', use: '用 2012–2021 美国数据建立平方根冲击基准、开收盘与连续市场异质性；路由内生且 opening 参考价样本受限。' },
    { id: 34, authors: 'Kiichi Kitajima', year: '2022', title: 'Passive Investors and Concentration of Intraday Liquidity: Evidence from the Tokyo Stock Exchange', publication: 'Pacific-Basin Finance Journal, 74, 101812', url: 'https://doi.org/10.1016/j.pacfin.2022.101812', use: '支持 TSE 2019 规则修订后被动持仓高股票向收盘集中、连续 spread 与隔夜效率异向变化；被动持仓非随机。' },
  ],
  readingList: [
    { title: 'Madhavan (1992), Trading Mechanisms in Securities Markets', scope: '周期拍卖与连续机制的理论权衡', reason: '先理解等待、即时性和信息不对称怎样共同决定哪种机制可运行。', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04403.x' },
    { title: 'SSE 2026 Trading Rules', scope: '当前上交所股票开收盘时段、不可撤单窗与成交价算法', reason: '训练从单一官方规则逐字段写 Rule Card；再与正文参考文献 3 的深交所规则比较 tie-break。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml' },
    { title: 'Nasdaq Equity 4 Rules 4752 / 4754', scope: 'Opening/Closing Cross、NOII、订单资格与优先', reason: '观察共同最大量骨架怎样被场所特定阈值、参考价与分配扩展。', url: 'https://listingcenter.nasdaq.com/rulebook/Nasdaq/rules/Nasdaq%20Equity%204/block/EQUALS/' },
    { title: 'NYSE Auctions', scope: 'DMM opening、imbalance publication 与 closing cutoffs', reason: '理解混合市场中人工权限、电子订单和截止时间如何共同构成机制。', url: 'https://www.nyse.com/trade/auctions' },
    { title: 'Biais, Hillion & Spatt (1999), Price Discovery and Learning', scope: 'Paris preopening 的订单路径、噪声与学习', reason: '把 indicative state 从静态数值升级为参与者相互学习的动态过程。', url: 'https://doi.org/10.1086/250095' },
    { title: 'Madhavan & Panchapagesan (2000), Inside the Black Box', scope: 'NYSE opening book、specialist 与库存', reason: '理解中介怎样把订单簿信息和风险承载带入开盘价格。', url: 'https://doi.org/10.1093/rfs/13.3.627' },
    { title: 'Pagano & Schwartz (2003), A Closing Call’s Impact', scope: 'Euronext Paris 分阶段 closing-call 改革', reason: '学习怎样把执行成本、同步、价格发现和次日溢出分开评价。', url: 'https://doi.org/10.1016/S0304-405X(03)00073-4' },
    { title: 'Ellul, Shin & Tonks (2005), Opening and Closing the Market', scope: 'LSE call 与 dealer 的自选机制比较', reason: '建立“价格发现更好但困难状态成本更高”的条件性思维。', url: 'https://doi.org/10.1017/S0022109000001976' },
    { title: 'Comerton-Forde & Rydge (2006), Auction Algorithm Rules', scope: 'ASX 算法、透明度与效率', reason: '观察算法和信息发布作为制度包改变参与者行为。', url: 'https://doi.org/10.1016/j.finmar.2006.02.001' },
    { title: 'Félez-Viñas & Hagströmer (2021), Volatility Extensions', scope: '异常状态延长、尾部质量与成交量', reason: '理解价格完整性保护的收益与 no-cross、迁移等未观察代价。', url: 'https://doi.org/10.1111/fire.12275' },
    { title: 'Park, Suen & Wan (2022), Hong Kong Closing Design', scope: '旧制、暂停与带保护重启', reason: '训练识别多组件同时变化时的因果边界。', url: 'https://doi.org/10.1016/j.finmar.2021.100700' },
    { title: 'Hauser, Kedar-Levy & Milo (2022), Parallel Preopening', scope: '股票—期权到期日、撤单与随机结束', reason: '学习怎样把 learning、distortion 与 manipulation hints 分层表述。', url: 'https://doi.org/10.1016/j.finmar.2022.100705' },
    { title: 'Jegadeesh & Wu (2022), Nasdaq versus NYSE Close', scope: '深度、失衡与多日暂时冲击', reason: '建立现代美国 closing auction 的跨 venue 条件基准。', url: 'https://doi.org/10.1016/j.jfineco.2021.12.003' },
    { title: 'Bogousslavsky & Muravyev (2023), Who Trades at the Close?', scope: '被动持仓、tick 约束、偏离与隔夜反转', reason: '理解低平均成本、大规模基准流和暂时压力怎样同时存在。', url: 'https://doi.org/10.1016/j.finmar.2023.100852' },
    { title: 'Brogaard, Ringgenberg & Rösch (2025), Does Floor Trading Matter?', scope: 'NYSE floor closure 与 reopening 准实验', reason: '学习 bundled treatment 下如何限制人工中介的因果解释。', url: 'https://doi.org/10.1111/jofi.13401' },
    { title: 'Duong et al. (2025), Opening Auction Manipulation', scope: '已起诉案件、跨市场收益与样本外异常指数', reason: '建立法律认定、可疑模式与模型概率之间的证据等级。', url: 'https://doi.org/10.1016/j.finmar.2025.101031' },
    { title: 'Daures, Moinas & Boussetta (2025), Click First or Last?', scope: 'Euronext 提交时点、优先和信息泄露', reason: '理解早报和晚报为何都可能是理性策略，而不是诚信标签。', url: 'https://doi.org/10.1287/mnsc.2023.03998' },
    { title: 'Goyal, Jegadeesh & Wu (2026), Price Impact across Mechanisms', scope: '平方根冲击、opening/closing/continuous 与异质性', reason: '获得可复现的现代交易成本基准，同时守住路由内生性边界。', url: 'https://doi.org/10.1017/S0022109026102592' },
  ],
};
