import LimitOrderBookLab from '../components/LimitOrderBookLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson104Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>限价订单簿不是“市场想法”的静态清单，而是一套持续改写的执行权登记系统。</h2>
        <p>
          1.03 留下了一张处于 active-resting 状态的限价单：它已经通过验证，却因为价格不能立即与对手方成交而等待。
          本节从这里继续追问：它被放到哪个价格档？同价位已有许多订单时，下一笔主动交易先给谁？一张订单被新增、撤销或成交以后，
          屏幕上的 best bid、best ask 与 depth 为什么会随之改变？答案不是一条抽象的“供求曲线”，而是价格规则、优先规则与事件处理共同维护的一组有序队列。
          Harris 对 order-driven market 的制度分析以及现代限价簿综述都把订单优先级视为从交易意图走向成交的核心接口。<Cite n={1} /><Cite n={2} />
        </p>
        <p>
          这套机制有一个容易被忽略的含义：<strong>订单簿中的数量不是已经成交的数量，而是当前仍愿意在规定条件下成交的剩余承诺；
          队列位置则是有条件的执行权，而不是成交保证。</strong>主动订单消耗承诺，撤单收回承诺，新增订单补入承诺。最优报价、价差、中间价和多档深度都只是当前状态的不同投影。
          它们会在没有成交时改变，也可能在发生交易后保持不变。
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把单一场所订单簿表示成买卖两侧的 price level 与同价队列，并由它正确找出 best bid、best ask、spread、midquote 与指定口径的 depth。</li>
            <li>在明确优先规则的前提下，逐事件处理 ADD、CANCEL 与 EXECUTE，保持数量守恒并写出每一步 before / after 状态。</li>
            <li>区分某一价位的总显示数量、自己前方的 queue ahead，以及实际能够到达该价位的对手方数量。</li>
            <li>说明为什么 price-time priority 不是所有市场的同义词，也为什么 Level 1、Level 2 或 market-by-order 数据仍不是“全市场全部流动性”。</li>
            <li>把一档失衡和 queue-weighted mid 当作有边界的状态摘要，而不是内在价值、成交价格或方向保证。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节边界</span>
          <p>
            1.04 只研究<strong>存量订单怎样被组织成即时状态，以及单个事件怎样按规则改写状态</strong>。1.05 才解释 spread 为什么存在；1.06 与 1.07 才把 tightness、depth、immediacy 和 resiliency 组成完整流动性概念；
            1.08 才把大量新增、撤销与成交聚合成 Order Flow / OFI；1.09 才识别机械、暂时与永久价格冲击；1.17 再处理集合竞价。这里不会用一张静态订单簿直接预测价格。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="record">
        <p className="section-kicker">01 · 订单簿保存什么</p>
        <h2>只有已经进入特定撮合系统、仍然有效的交易承诺，才可能成为簿中状态</h2>
        <p>
          在最小化的连续限价簿中，一条挂单记录至少需要方向、价格、剩余数量与决定优先级的元数据；真实系统还可能保存显示属性、参与者类别、订单标识、时间戳、路由状态和其他限制。
          价格与方向决定订单属于哪一侧、哪一档；剩余数量告诉系统还有多少可以成交；优先级字段告诉系统同价位有多个合格订单时先处理谁。
          这些字段不是为了描述投资者“有多看好”，而是为了让撮合引擎在下一条消息到达时得到唯一或规则限定的处理结果。Gould 等人的综述与 Abergel 等人的专著都把 LOB 写成由离散价位和订单事件构成的动态对象。<Cite n={3} /><Cite n={4} />
        </p>
        <div className="market-stack">
          <article><span>ENGINE STATE</span><b>撮合引擎内部的合格挂单</b><p>包含系统处理下一事件所需的订单、优先级与属性；仍不代表其他场所或经纪商内部的意愿。</p></article>
          <article><span>VENUE FEED</span><b>场所发布的数据消息</b><p>可能是最优价、聚合多档或订单级事件；具体可见字段取决于产品与数据权限。</p></article>
          <article><span>USER VIEW</span><b>终端重建并展示的画面</b><p>受订阅、网络延迟、消息缺口、聚合方式与界面档数限制。</p></article>
          <article><span>ECONOMIC INTENT</span><b>尚未下单的潜在供需</b><p>保留价格可能只存在于人的计划里，不能因为它重要就假装已经在订单簿中。</p></article>
        </div>
        <p>
          因而，“我在交易软件中看到的五档报价”“交易所的内部集中申报簿”和“这只股票的全部潜在流动性”是三个不同集合。
          Nasdaq 的数据产品目录明确区分 BBO、按价位聚合深度与 market-by-order/full-depth 产品；CME 的订单级数据文档则要求以订单价格、数量与优先次序维护本地簿。<Cite n={15} /><Cite n={16} />
          数据更细可以减少观察损失，却不会把其他场所、未公开数量或尚未提交的意愿自动纳入。
        </p>
      </section>

      <section className="lesson-section" id="state">
        <p className="section-kicker">02 · 最小状态表示</p>
        <h2>先把每个合法价格上的订单排成队，再从队列聚合出价格档</h2>
        <p>
          设市场允许的离散价格集合为 𝒫。对每个价格 p，买方队列记为 𝒬<sup>b</sup><sub>t</sub>(p)，卖方队列记为 𝒬<sup>a</sup><sub>t</sub>(p)。
          队列中的元素不是一个总数，而是依场所规则排列的订单记录；把同价位尚未成交的合格数量相加，才得到该 price level 的数量 Q。
          若把优先规则本身记为 ℛ，订单簿状态可以用下面的记账式表示：
        </p>
        <div className="equation-card">
          <span>订单簿的状态记号 · 不是概率模型</span>
          <div>ℬ<sub>t</sub> = (&#123;𝒬<sup>b</sup><sub>t</sub>(p)&#125;<sub>p∈𝒫</sub>, &#123;𝒬<sup>a</sup><sub>t</sub>(p)&#125;<sub>p∈𝒫</sub>; ℛ)</div>
          <p>
            ℬ<sub>t</sub> 是时点 t 的簿；上标 b 与 a 分别表示 bid 和 ask；𝒬 是同价位的有序订单队列；ℛ 是价格、显示、时间或比例分配等规则。
            这只是告诉我们“完整状态至少需要哪些对象”，并未假定订单到达服从什么概率分布。把 ℛ 写进状态描述很关键：完全相同的订单集合，在 FIFO 与 pro-rata 下会分配出不同成交。
          </p>
        </div>
        <p>
          对某一侧、某一价格 p，若该档有 n 个符合当前统计口径的订单，聚合数量为 Q<sub>t</sub>(p)=Σ<sub>i=1</sub><sup>n</sup>q<sub>i,t</sub>。
          q<sub>i,t</sub> 是第 i 张订单的剩余数量。这里必须区分“订单数”和“标的数量”：一个 1,000 股订单与十个 100 股订单给出相同 level depth，却给出不同队列结构、撤单路径与信息暴露。
          只看聚合档位时，这些差异已经被压缩掉。
        </p>
      </section>

      <section className="lesson-section" id="levels">
        <p className="section-kicker">03 · Price Level 与价格网格</p>
        <h2>买方越高越优，卖方越低越优；同一价格才进入下一层优先比较</h2>
        <p>
          买方愿意支付 100.00 元，显然比只愿支付 99.99 元更接近立即成交，因此买方价位从高到低排序；卖方愿意以 100.01 元出售，比最低只接受 100.02 元更接近立即成交，因此卖方从低到高排序。
          这不是颜色或屏幕位置的习惯，而是“更有竞争力的价格先获得对手方”的规则表达。合法价格还受到最小变动单位（tick size）约束：若 tick 为 0.01 元，100.001 元通常不是同一规则下可提交的普通报价。
          Tick 怎样影响排队、价差和速度竞争将在 1.18 展开，本节只把它当作价格网格。
        </p>
        <div className="table-scroll" role="region" aria-label="三档订单簿与订单级队列示例，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一快照的两种视图：price level 是订单级队列的聚合投影；本表每侧按 best-to-worse 阅读，后文互动盘口则采用“远端卖盘在上、最优价靠近中线”的屏幕惯例</caption>
            <thead><tr><th scope="col">方向与价格</th><th scope="col">订单级队列（先 → 后）</th><th scope="col">订单数</th><th scope="col">聚合显示数量</th></tr></thead>
            <tbody>
              <tr><th scope="row">ASK 100.02</th><td>A1: 120 → A2: 180</td><td>2</td><td>300</td></tr>
              <tr><th scope="row">ASK 100.03</th><td>A3: 500</td><td>1</td><td>500</td></tr>
              <tr><th scope="row">BID 100.00</th><td>B1: 200 → B2: 300 → YOU: 250</td><td>3</td><td>750</td></tr>
              <tr><th scope="row">BID 99.99</th><td>B3: 800</td><td>1</td><td>800</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这个例子也解释了为什么“100.00 买档有 750 股”仍不足以回答你的成交顺序。如果 YOU 排在 B1 与 B2 后面，自己的 queue ahead 是 500 股，不是该档总量 750 股；
          其中自己的 250 股不能挡在自己前面。若公开数据只给出 750，订单身份与内部排序已经不可见，不能从聚合数量精确恢复自己的位置。
        </p>
      </section>

      <section className="lesson-section" id="bbo">
        <p className="section-kicker">04 · Best Bid、Best Ask、Spread 与 Mid</p>
        <h2>这些常用指标不是四种独立事实，而是从当前两侧最优非空价位推导出来的状态投影</h2>
        <p>
          若 Q<sup>b</sup><sub>t</sub>(p) 与 Q<sup>a</sup><sub>t</sub>(p) 表示选定口径下各价格的正剩余数量，最高非空买价是 best bid，最低非空卖价是 best ask。
          在普通未交叉的连续订单簿中，ask 高于 bid；二者之差是 quoted spread，算术平均是 midquote。<Cite n={1} /><Cite n={3} />
        </p>
        <div className="equation-card">
          <span>从订单簿状态派生最优报价</span>
          <div>b<sub>t</sub> = max&#123;p : Q<sup>b</sup><sub>t</sub>(p)&gt;0&#125;　；　a<sub>t</sub> = min&#123;p : Q<sup>a</sup><sub>t</sub>(p)&gt;0&#125;<br />s<sub>t</sub> = a<sub>t</sub> − b<sub>t</sub>　；　m<sub>t</sub> = (a<sub>t</sub> + b<sub>t</sub>)/2</div>
          <p>
            b 是当前最高买价，a 是当前最低卖价，s 是立即卖与立即买所面对报价之间的间隙，m 只是两个报价的中心。
            若某一侧为空，a、b、spread 与 mid 可能无法按此式定义。Mid 不是一张挂单、不是保证可成交价，也不要求历史上曾经以该价成交；spread 为什么为正属于 1.05。
          </p>
        </div>
        <div className="number-story">
          <div><span>当前 BBO</span><b>99.99 / 100.01</b><p>Best bid 99.99，best ask 100.01。</p></div>
          <div><span>派生结果</span><b>Spread 0.02<br />Mid 100.00</b><p>两者都由报价计算，不是新增成交记录。</p></div>
          <div><span>边界</span><b>Mid 不可执行</b><p>若 100.00 没有卖单，买方不能因为 mid 显示 100.00 就按该价买入。</p></div>
        </div>
        <p>
          “Best level”也不等于“最早的一张订单”。最优卖档 100.01 可以由几十张订单组成；其中一张部分成交或撤销，只会减少该档数量。
          只有这一档的全部合格数量都离开，best ask 才移到下一非空卖档。反过来，一张新的 100.00 卖单若仍高于 best bid 99.99，可以在没有任何成交时把 best ask 从 100.01 改写为 100.00。
        </p>
      </section>

      <section className="lesson-section" id="depth">
        <p className="section-kicker">05 · Depth 与订单簿形状</p>
        <h2>“深度有多少”必须同时回答方向、价位范围、显示口径与观察时刻</h2>
        <p>
          单档 depth 是某个价位上的聚合剩余量；best-ask depth 只看最低卖档；前 K 档累计卖方 depth 则把最接近市场的 K 个非空卖档相加。
          还可以按“离 mid 不超过 10 个基点”或“价格不高于某一上限”定义深度。它们都合理，却回答不同问题。若不写口径，把 depth 当成一只证券的固定属性，就会把可比较的状态变量变成含混标签。
        </p>
        <div className="equation-card">
          <span>前 K 档显示卖方深度</span>
          <div>D<sup>a,disp</sup><sub>t</sub>(K) = Σ<sub>k=1</sub><sup>K</sup> Q<sup>a,disp</sup><sub>t</sub>(p<sup>a</sup><sub>k</sub>)</div>
          <p>
            p<sup>a</sup><sub>1</sub>=a<sub>t</sub> 是 best ask，之后按价格从低到高排列；上标 disp 明确这只是显示数量。
            如果前三档分别为 300、600、900 股，D<sup>a,disp</sup>(3)=1,800 股。这个数字不包含第四档、隐藏量、其他场所和未来可能补入的订单，也不保证你抵达时仍然存在。
          </p>
        </div>
        <div className="contrast-card">
          <div><span>簿 A · 近端厚</span><b>300 / 600 / 900</b><p>数量集中在接近 best ask 的位置；给定静态簿时，中等买单较少跨档。</p></div>
          <div><span>簿 B · 近端薄</span><b>50 / 100 / 1,650</b><p>前三档总量同为 1,800，却有更多数量远离最优价；相同买单的静态执行路径不同。</p></div>
        </div>
        <p>
          因而总量相等不等于形状相等。离最优价很远的 1,000 股，与最优价上的 1,000 股对即时执行的作用不同；一边很厚也不自动表示完整流动性更好，因为挂单可能撤回、对手方可能不愿跨越价差，市场受到冲击后的补单速度也未知。
          Tightness、depth、immediacy 与 resiliency 的系统区分留在 1.06—1.07，本节只负责把“当前显示形状”定义清楚。
        </p>
        <aside className="precision-note">
          <span>A 股行情口径实例</span>
          <p>
            上交所 2026 年交易规则把集中申报簿定义为按买卖方向、价格优先与时间优先排列的未成交申报队列；连续竞价即时行情则公布最高五个买入申报价格与数量、最低五个卖出申报价格与数量。<Cite n={10} />
            因此常见“五档行情”是公开投影，不是撮合主机只保存五档。深交所现行规则也规定价格—时间优先与连续竞价行情口径，但条款编号和具体产品适用范围必须分别核对。<Cite n={11} />
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="queue">
        <p className="section-kicker">06 · Queue 与 Queue Ahead</p>
        <h2>同价位总量描述这档有多大；queue ahead 才描述在轮到你之前还要越过多少</h2>
        <p>
          在严格 price-time / FIFO 的教学市场里，系统先比较价格：更高买价或更低卖价优先；只有方向和价格相同，才比较撮合引擎接受时间。
          “我下得更早”不能让 99.99 元买单越过稍后抵达的 100.00 元买单。上交所现行规则的表述正是价格优先、同价时间优先，先后按交易主机接受申报的时间确定。<Cite n={10} />
          这也说明用户点击时间、券商收到时间与撮合主机接受时间不是同一个时点。
        </p>
        <div className="equation-card">
          <span>自己的同价前方数量</span>
          <div>A<sub>t</sub>(i) = Σ<sub>j: j ≻ i, p<sub>j</sub>=p<sub>i</sub></sub> q<sub>j,t</sub></div>
          <p>
            j ≻ i 表示订单 j 按当前场所规则排在订单 i 前面。A<sub>t</sub>(i) 只加总同价、同方向且优先于自己的剩余数量；自己与身后订单不计入。
            若规则还区分显示类别、参与者类别或比例分配，“前面”就不一定只由时间戳决定。
          </p>
        </div>
        <div className="worked-example">
          <span>手算 · 一笔主动卖单怎样进入同价买方队列</span>
          <p>
            100.00 元买档依次为 B1 120 股 → YOU 80 股 → B3 100 股，总 depth 300。你的 queue ahead 是 120，而不是 300。
            现在一笔真正到达该价位的 150 股主动卖单按 FIFO 执行：先完成 B1 的 120 股，再成交你的 30 股；你剩余 50 股，B3 尚未轮到。
            事件后该档 depth 为 150，自己的 queue ahead 归零。这个结果来自明确规则与已知事件，不需要猜“成交概率”。
          </p>
        </div>
        <p>
          Queue position 是有条件的执行权：只有对手方可执行数量真正到达该价位，且订单仍有效、没有失去优先级时，它才转化为成交。
          更优价位必须先被消耗；市场可能在轮到你之前反向移动；你也可能主动撤单。Parlour 的理论模型和 Biais、Hillion、Spatt 的实证研究都表明，订单选择、队列状态与后续订单到达彼此内生；
          不能把某个快照中的位置直接翻译成跨市场固定 fill probability。<Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="priority">
        <p className="section-kicker">07 · 优先规则不是全球常数</p>
        <h2>Price-time 是重要基准，却不是“限价订单簿”这个概念的必要同义词</h2>
        <p>
          所有限价簿都必须回答“多个合格挂单如何分配有限对手量”，但答案可以不同。严格 FIFO 把同价成交依时间顺序给最早订单；纯 pro-rata 按同价剩余量比例分配；
          真实系统还可能把显示状态、指定做市商、Top order（同价中按产品规则获得首笔优先的订单）、最小分配、阈值、取整与残余量规则结合起来。选择优先算法会改变交易者争取早到、展示大数量或维持报价的激励，因此它不是无关紧要的后台细节。
        </p>
        <div className="table-scroll" role="region" aria-label="不同订单优先规则及其含义，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>以下是规则家族，不是对所有场所的统一描述</caption>
            <thead><tr><th scope="col">规则</th><th scope="col">同价位怎样分配</th><th scope="col">主要激励</th><th scope="col">必须核对的边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Price–Time / FIFO</th><td>先比较价格；同价按有效优先时间逐张成交</td><td>尽早排队、避免失去时间戳</td><td>修改、刷新或特殊属性是否重置优先级</td></tr>
              <tr><th scope="row">Price–Display–Time</th><td>同价先给显示订单，再给不显示部分，各类别内按时间</td><td>以显示换取更高执行优先级</td><td>进入排序的价格、显示价格与限价可能不同；场所特定</td></tr>
              <tr><th scope="row">Pure Pro-Rata</th><td>同价数量按挂单规模比例分配</td><td>显示或维持更大数量</td><td>实际常含取整、阈值与残余分配</td></tr>
              <tr><th scope="row">Hybrid / Special Priority</th><td>FIFO、比例、Top、做市商或参与者类别组合</td><td>服务产品设计和报价义务</td><td>必须逐产品、逐交易阶段读取规则</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Nasdaq 当前股票规则给出一个清楚反例：其 Rule 4757 使用 price/display/time，同价显示订单先于不显示订单，之后各自按时间排序。<Cite n={12} />
          NYSE Rule 7.36 则把非可成交订单按 working price（系统实际用于排名的价格）、priority category、时间与 ranking restrictions（附加排名限制）维护；working price 还可能不同于订单的 limit price 或 display price。<Cite n={13} />
          CME 公开列出的 Globex 算法包括 FIFO、Pro-Rata、Threshold Pro-Rata、带 LMM（Lead Market Maker，指定流动性提供者）或 Top order 的算法及可配置组合，且适用算法依产品而异。<Cite n={14} />
          这些制度不是为了让初学者背缩写，而是为了证明：没有先声明 ℛ，就没有唯一的“谁先成交”。
        </p>
        <div className="worked-example compact">
          <span>同一队列、两种规则</span>
          <p>
            同价挂单为 A 200、B 300、YOU 250、C 250，总量 1,000；一笔 500 股对手单到达。严格 FIFO 下，A 与 B 合计 500 股先完成，你得到 0。
            教学式纯 pro-rata 下，忽略阈值、取整和残余分配，你占总量 25%，得到 500×25%=125 股。订单集合完全相同，仅优先规则不同，自己的成交就不同。
          </p>
        </div>
      </section>

      <section className="lesson-section" id="events">
        <p className="section-kicker">08 · Event-Sourced State</p>
        <h2>订单簿不是一张会自己移动的图片；每次变化都来自被系统接受并按规则处理的事件</h2>
        <p>
          对教学最有用的三类事件是 ADD、CANCEL 与 EXECUTE。ADD 把一张可挂簿订单加入相应价位和优先位置；CANCEL 在撤销成功后删除尚未成交的剩余量；
          EXECUTE 表示可成交对手兴趣按优先规则消耗存量队列。真实消息还包括修改、替换、到期、交易中断与系统管理事件，但它们最终也必须通过场所状态机改变或离开簿。
          Cont、Kukanov 与 Stoikov 的实证框架正是把限价新增、撤销和市场订单视为改变最优档供需的基本订单簿事件。<Cite n={9} />
        </p>
        <div className="equation-card">
          <span>事件驱动的确定性更新</span>
          <div>ℬ<sub>n+1</sub> = T<sub>ℛ</sub>(ℬ<sub>n</sub>, e<sub>n+1</sub>)</div>
          <p>
            e<sub>n+1</sub> 是下一条被接受的事件，T<sub>ℛ</sub> 是场所规则规定的状态转换。给定完整旧状态、事件与规则，教学撮合结果可以确定；
            未来哪类事件何时到来才是随机或策略性问题。下标 n 表示事件顺序，不要求相邻事件的物理时间间隔相同。
          </p>
        </div>
        <div className="state-sequence">
          <article><span>ADD · 新增</span><b>可以改变数量，也可以改变报价</b><p>同价新增通常只增加 depth；价差内新增非可成交订单可以在无交易时建立新的 best quote。</p></article>
          <article><span>CANCEL · 撤销</span><b>收回尚未成交的承诺</b><p>部分撤单减少 depth；撤空最优档会把 best quote 移到下一非空档，但不会生成成交。</p></article>
          <article><span>EXECUTE · 成交</span><b>按优先规则消耗队列</b><p>若最优档尚有剩余，depth 下降而报价不变；若该档耗尽，最优价才进入下一档。</p></article>
          <article><span>MODIFY / REPLACE</span><b>不是无条件原地改数字</b><p>增加数量、改价或改变属性可能生成新优先时间；保留哪些权利必须看场所确认与具体规则。</p></article>
        </div>
        <p>
          Nasdaq Rule 4756 明确说明系统为订单加时间戳，并列出修改后获得新时间戳的多种情形及有限例外。<Cite n={12} />
          所以专业执行不能靠“我先点了按钮”推断排队权，也不能把客户端显示的撤单请求当成已经从引擎移除；需要等待接收、拒绝、成交或撤销确认。
        </p>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">09 · 四个反例</p>
        <h2>成交、报价、深度与 last price 是相互连接但不等价的状态变量</h2>
        <div className="edge-list">
          <article><span>有成交 · 报价不变</span><h3>最优档没有被耗尽</h3><p>Ask 100.01 有 500 股，买入 100 股后还剩 400；last trade 更新，ask 与 mid 不变。</p></article>
          <article><span>无成交 · 报价改变</span><h3>撤空最优档或价差内新增</h3><p>Ask 最后一张订单撤销，下一档成为新 ask；没有 transaction，last price 不变。</p></article>
          <article><span>Depth 改变 · Mid 不变</span><h3>同一最优档内部增减</h3><p>Best bid 数量从 900 降到 300，但价格仍是 99.99；一档失衡改变，mid 可以不动。</p></article>
          <article><span>Mid 改变 · Last 不变</span><h3>报价重排而非新交易</h3><p>新的 inside-spread 买单改善 best bid，mid 随之上移；最近成交仍属于过去。</p></article>
        </div>
        <p>
          这些反例把“价格变动”拆成不同对象。新闻终端说的“价格”可能是 last transaction，做市系统监控的是 quotes，执行算法关心可用 depth 与队列，估值系统又可能用 mid。
          如果分析者没有先说明对象，就会把一张撤单造成的 quote move、主动交易造成的 fill 和资产价值变化混成同一种事件。
        </p>
      </section>

      <section className="lesson-section" id="stock-flow">
        <p className="section-kicker">10 · Snapshot 与 Event Flow</p>
        <h2>订单簿快照是存量；新增、撤销与成交是改变存量的流量</h2>
        <p>
          一张 snapshot 回答“这个观察时刻目前有什么”；事件序列回答“状态怎样走到这里”。二者不能互换。完全相同的聚合快照可能来自大量订单新增后又撤销，也可能来自几张长期挂单；
          若快照不含订单身份，即使最终 level depth 相同，同价队列历史也可能不同。反过来，只有事件消息而缺失了一个序列号，也可能让本地重建从此与交易所状态分叉。
        </p>
        <p>
          Cont、Stoikov 与 Talreja 把订单到达、撤销和执行构成的队列系统用于计算条件事件；Huang、Lehalle 与 Rosenbaum 的 queue-reactive 模型进一步把事件强度依赖当前队列状态。<Cite n={7} /><Cite n={8} />
          它们支持“状态影响未来事件、事件又改写状态”的建模思路，却不意味着任何市场都服从同一到达率，也不授权我们在没有估计与样本外验证时展示一个看似精确的成交概率。
        </p>
        <div className="mechanism-chain" aria-label="订单簿状态与事件的反馈链">
          {[
            ['当前簿面', '价位、显示量、队列与规则构成条件状态'],
            ['参与者观察', '不同主体看到不同数据，并形成自己的执行判断'],
            ['提交事件', '新增、撤销、主动订单或修改抵达场所'],
            ['规则处理', '价格、显示、时间或比例规则决定分配'],
            ['新簿面', 'depth、queue、BBO、mid 或 last 中部分变量改变'],
            ['下一轮输入', '新状态又改变等待、撤单和进攻的激励'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          本节只建立单个事件的状态转换。1.08 才会把许多事件按方向聚合，研究为什么撤销量和限价新增也能进入 Order Flow Imbalance；1.09 再问观察到的报价变化中哪些是机械耗尽、哪些会回补、哪些包含持久信息。
        </p>
      </section>

      <section className="lesson-section" id="observability">
        <p className="section-kicker">11 · 可观察性边界</p>
        <h2>公开 depth 既不是全市场库存，也不是你抵达时仍可成交的数量承诺</h2>
        <p>
          第一层缺口来自显示属性。Reserve order 可以只显示一部分数量，non-displayed order 则可能不进入公共档位；它们在撮合引擎内是否可执行、何时刷新、与显示订单怎样排序都取决于场所规则。
          Nasdaq 的具体规则把同价 displayed interest 排在 non-displayed interest 之前，但这只能作为 Nasdaq 场所案例，不能外推成全球隐藏订单定律。<Cite n={12} />
        </p>
        <div className="worked-example">
          <span>观察反例 · 同一个公共画面，两种引擎状态</span>
          <p>
            公共画面都显示 ask 100.02 有 100 股、ask 100.03 有 200 股。状态 A 没有隐藏量，180 股主动买单会成交 100@100.02 与 80@100.03。
            状态 B 在 100.02 另有 150 股可执行但不显示的数量；若事先声明的规则允许它在显示 100 股之后执行，180 股可以全部留在 100.02。
            在隐藏状态揭示前，单凭公共快照无法唯一判断执行路径。正确答案是“信息不足”，不是猜一个更常见结果。
          </p>
        </div>
        <p>
          第二层缺口来自市场碎片化。同一证券可以同时在多家交易所、另类交易系统、暗池和经纪商内部系统出现流动性；单一场所的 best bid/ask 是 local BBO，不一定等于跨市场的 national best bid and offer。
          美国 Regulation NMS 明确定义 NBB、NBO 与 protected quotation，也正因为市场并非只有一本统一订单簿。<Cite n={17} />
          跨场所路由、trade-through 保护、延迟和内部化属于 1.02 的架构与后续执行专题；本节只要求每次说“订单簿”时先指明哪个场所、哪个数据口径。
        </p>
        <div className="myth-grid">
          <div className="wrong"><span>错误推论</span><p>Level 2 上只有 1,000 股，所以全市场最多只有 1,000 股愿意卖。</p></div>
          <div className="wrong"><span>错误推论</span><p>屏幕显示 1,000 股，所以我的订单抵达时一定能成交这 1,000 股。</p></div>
          <div className="right"><span>条件化表述</span><p>在指定场所、订阅口径与时间戳下，当前消息报告了 1,000 股显示卖量；总量与到达时可用量仍未知。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="data-views">
        <p className="section-kicker">12 · Level 1、Level 2、MBP 与 MBO</p>
        <h2>数据产品展示的是不同分辨率，不是从“粗略”到“全知”的四级真相</h2>
        <div className="table-scroll" role="region" aria-label="订单簿数据视图比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>常见称呼会因供应商而异，实际字段必须回到数据规范</caption>
            <thead><tr><th scope="col">视图</th><th scope="col">通常能看见</th><th scope="col">通常失去什么</th><th scope="col">适合回答</th></tr></thead>
            <tbody>
              <tr><th scope="row">Level 1 / BBO</th><td>最优买卖价及其聚合显示量</td><td>更深价位、订单身份与同价排序</td><td>当前顶层报价与 quoted spread</td></tr>
              <tr><th scope="row">Level 2 / Depth</th><td>若干或全部公开价位的聚合量</td><td>同价订单身份、精确队列与隐藏量</td><td>显示簿形与多档静态执行路径</td></tr>
              <tr><th scope="row">Market by Price</th><td>按价位聚合的新增、更新和删除</td><td>单笔订单生命周期与内部排序</td><td>重建 level depth</td></tr>
              <tr><th scope="row">Market by Order</th><td>订单 ID、价格、数量与订单级事件</td><td>未发布属性、隐藏状态、其他场所与传输前事实</td><td>在规范允许时重建订单队列</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Nasdaq 数据产品目录把 market-by-order、market-by-price-level、BBO 与成交数据分别列示；CME 的 MBO 文档要求按订单优先次序确认价格和数量。<Cite n={15} /><Cite n={16} />
          但名称不能替代字段结构（schema）：有的“Level 2”只给固定档数，有的 full-depth 仍只含 displayed interest；有的 feed 直接提供 order ID，有的只能用聚合增减近似队列。
        </p>
        <p>
          严谨重建还需要序列号、初始快照、增量消息、交易时段和错误恢复。若消息序列缺口（sequence gap）未被发现，后续每个计算都可能在一张错误的本地簿上进行。
          因此研究中必须记录数据源、场所、消息类型、时区、事件时间与接收时间，并验证“从快照加事件重建的结果”能否与后续官方快照对齐。详细高频数据工程属于 T08，本节先建立为什么这些字段不可省略。
        </p>
      </section>

      <section className="lesson-section" id="queue-accounting">
        <p className="section-kicker">13 · Queue-Ahead 账本</p>
        <h2>前方成交与前方撤单帮助你；后方撤单改变总量，却不缩短你要等待的路</h2>
        <p>
          设订单 i 在某一 FIFO 价位的初始数量为 q<sub>i,0</sub>、初始 queue ahead 为 A<sub>0</sub>。考察期间，这张订单始终有效，既不撤销、改价、增量，也不因规则失去优先级。
          令 X 为扣除更优价位后真正到达本价位、并分配给这条 FIFO 队列的累计对手数量；令 C<sup>ahead</sup><sub>0</sub> 只统计 A<sub>0</sub> 中在被执行前已经确认撤销的数量。
          X 的执行消耗与 C<sup>ahead</sup><sub>0</sub> 的撤销必须互斥记账，不能把同一股前方数量扣两次。在没有隐藏优先、数量门槛与重新排序的简化环境中，自己的累计成交可写成：
        </p>
        <div className="equation-card">
          <span>严格 FIFO 的教学式成交账本</span>
          <div>F<sub>i</sub> = min&#123;q<sub>i,0</sub>, [X − (A<sub>0</sub> − C<sup>ahead</sup><sub>0</sub>)]<sub>+</sub>&#125;</div>
          <p>
            [z]<sub>+</sub>=max(z,0)。X 不是全市场成交量；C<sup>ahead</sup><sub>0</sub> 也不是该档全部撤单，只含初始前方数量中尚未被 X 消耗就确认离开的部分。
            若初始前方 500 股、前方撤 150、随后 X=430，则 F=min(250,430+150−500)=80 股。若同样 150 股撤在自己后方，F=min(250,430−500 的正部)=0。
          </p>
        </div>
        <p>
          这个公式的价值不是精确预测真实 fill，而是强迫分析者列明假设。公开聚合 feed 往往不能告诉你一笔撤单来自前方还是后方；隐藏订单、优先类别、交易所消息丢失和自己的延迟都会使 A<sub>0</sub> 估计错误。
          即使订单的“名义队列位置”已知，未来 X 与 C 仍由其他参与者行为产生。队列模型可以估计条件概率，但必须用对应市场数据校准并样本外验证。<Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="derived">
        <p className="section-kicker">14 · 从一档状态派生的摘要</p>
        <h2>不平衡可以压缩状态，却不能把未知未来变成确定方向</h2>
        <p>
          只看 best bid 与 best ask 的显示数量 Q<sup>b</sup>、Q<sup>a</sup>，可以构造一档 queue imbalance。下面同时给出对称失衡 I 与 queue-weighted mid w：
        </p>
        <p>
          先不看公式，设 bid 一档明显厚于 ask 一档。若其他条件暂时不变，较薄的 ask 队列更容易先被耗尽，因此这个静态摘要应从普通 mid 向 ask 一侧移动，而不是向更厚的 bid 一侧移动。
          交叉加权正是把较大的 bid 数量放到 ask 价格上、把较小的 ask 数量放到 bid 价格上，用代数实现这一方向；它压缩的是当前相对厚薄，不是在宣告下一笔价格。
        </p>
        <div className="equation-card">
          <span>L1 状态摘要 · 不是交易信号承诺</span>
          <div>I<sub>t</sub> = (Q<sup>b</sup><sub>t</sub> − Q<sup>a</sup><sub>t</sub>)/(Q<sup>b</sup><sub>t</sub> + Q<sup>a</sup><sub>t</sub>)<br />w<sub>t</sub> = (a<sub>t</sub>Q<sup>b</sup><sub>t</sub> + b<sub>t</sub>Q<sup>a</sup><sub>t</sub>)/(Q<sup>b</sup><sub>t</sub> + Q<sup>a</sup><sub>t</sub>) = m<sub>t</sub> + (s<sub>t</sub>/2)I<sub>t</sub></div>
          <p>
            当 bid 显示量大于 ask 显示量时，I 为正，w 位于 mid 与 ask 之间；直觉是卖方最优队列相对更容易先耗尽。
            但挂单可以撤销，隐藏量和其他价位未知，参与者也会响应同一个画面，所以 I&gt;0 不推出“下一笔一定上涨”。w 只是当前一档数量加权的中间价，不是可成交价或内在价值。
          </p>
        </div>
        <p>
          文献中的 micro-price 往往比这条代数加权更严格。Stoikov 把未来 mid 的短期条件变化与订单簿状态转移结合估计，并明确把模型化 micro-price 与简单 weighted mid 比较。<Cite n={18} />
          因此本节坚持称上式为 <strong>L1 queue-weighted mid</strong>；若未来要把它用于研究，必须指定场所、采样、预测时距、标签、费用和样本外基准，而不能靠更精致的名字获得有效性。
        </p>
      </section>

      <LimitOrderBookLab />

      <section className="lesson-section" id="rules">
        <p className="section-kicker">16 · 三组制度实例</p>
        <h2>同样叫“订单簿”，真正可执行的机制仍由市场、产品与交易阶段共同决定</h2>
        <div className="same-order-grid">
          <article><span>沪深连续竞价</span><b>价格优先、同价时间优先</b><p>现行规则以交易主机接受时间确定同价先后；公开连续行情提供规定档数的聚合价格与数量。集合竞价不是逐笔 FIFO 撮合，留给 1.17。</p></article>
          <article><span>NASDAQ STOCK BOOK</span><b>Price / Display / Time</b><p>同价显示兴趣先于不显示兴趣；订单类型、属性、重定价和修改可以影响入簿或排名价格、显示价格与时间排名。</p></article>
          <article><span>NYSE PILLAR</span><b>Working Price / Priority Category / Time</b><p>规则还包含 ranking restrictions 与特定参与者或订单类别；不能把屏幕同价顺序简化成纯到达时间。</p></article>
          <article><span>CME GLOBEX PRODUCTS</span><b>FIFO、Pro-Rata 与组合算法</b><p>适用算法依产品，且可能含 Top、LMM、阈值与残余分配；研究期货队列必须先识别产品算法。</p></article>
        </div>
        <p>
          上述实例的共同骨架仍是“价格上的合格性＋同价分配规则＋事件更新”，但规则参数不同。<Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={13} /><Cite n={14} />
          这正是 world model 应有的层次：一般机制提供提问框架，场所手册给出具体答案。只背一个市场的界面会误把实现当原理；只讲抽象原理又会在真实下单时忽略决定执行权的条款。
        </p>
      </section>

      <section className="lesson-section" id="system-case">
        <p className="section-kicker">17 · 系统案例</p>
        <h2>一次“无成交上涨”怎样从撤单开始，又怎样成为下一轮行为的输入</h2>
        <p>
          假设单一场所最优卖价 100.01 只剩 100 股，下一卖档为 100.05。新闻到来后，100.01 的挂单者先撤单而没有等待别人主动买入；于是 best ask 机械移到 100.05，mid 随之上升，last transaction 仍未变化。
          观察这个新状态的做市商可能上调自己的报价，执行算法可能缩小买单或改用更保守的限价，跨场所路由器也可能把订单送到别处。新行为又形成 ADD、CANCEL 或 EXECUTE，进一步改变簿。
        </p>
        <div className="mechanism-chain" aria-label="撤单导致报价变化并反馈到参与者的因果链">
          {[
            ['外部或私有信息', '挂单者重新评价等待风险'],
            ['撤销最优卖单', '原承诺离开订单簿，没有发生交易'],
            ['下一档成为 best ask', 'spread 与 mid 机械改变，last 不变'],
            ['其他主体观察', '他们看到的是新的公开状态，而非原挂单者动机'],
            ['订单策略调整', '重新定价、撤单、补单或主动交易'],
            ['状态反馈', '新事件形成下一张订单簿快照'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链能证明撤单可以先于成交改变报价，却不能仅凭一条行情判断原挂单者知道新闻、市场价值永久上升或后续一定继续上涨。
          观察数据只给出状态转换；信息动机、策略反应和价格持久性需要额外识别。Cont、Kukanov 与 Stoikov 的结果说明最优档新增、撤销和主动订单都与短期价格变化相关，
          但其 OFI 回归与深度关系属于特定样本和 1.08—1.09 的研究范围。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="failure-modes">
        <p className="section-kicker">18 · 边界与危险表述</p>
        <h2>订单簿最容易误导人的地方，是把一个条件化局部状态说成全市场确定事实</h2>
        <div className="order-myth-grid">
          <article><span>误解 01</span><b>“价格碰到我的限价，我就应当成交。”</b><p>还需知道场所、订单当时是否有效、优先类别、queue ahead、对手量和路由；历史成交价本身不足。</p></article>
          <article><span>误解 02</span><b>“更早下单永远先成交。”</b><p>先比较价格；同价后才进入时间或其他优先类别。更优价订单可以晚到却先执行。</p></article>
          <article><span>误解 03</span><b>“同价总 depth 就是我前方数量。”</b><p>它包含自己的订单与后方订单；聚合 feed 还可能无法恢复每笔身份。</p></article>
          <article><span>误解 04</span><b>“没有成交，报价不会动。”</b><p>最优档撤空或价差内新增都可以改变 BBO 与 mid，而 last 保持不变。</p></article>
          <article><span>误解 05</span><b>“Level 2 展示全部流动性。”</b><p>它可能只有部分价位与 displayed interest；隐藏、其他场所、内部化和未来补单不在其中。</p></article>
          <article><span>误解 06</span><b>“Bid 比 ask 厚，下一步必涨。”</b><p>一档数量会撤、会补，也可能被隐藏量与跨场所流量抵消；失衡不是方向保证。</p></article>
          <article><span>误解 07</span><b>“Price-time 是所有 LOB 的定义。”</b><p>Nasdaq、NYSE 和 CME 实例已经说明显示、类别、比例和产品算法可以进入优先排序。</p></article>
          <article><span>误解 08</span><b>“一张快照足以复原市场过程。”</b><p>相同聚合状态可以来自不同事件历史；没有连续消息与序列完整性，队列重建可能不可识别。</p></article>
        </div>
        <blockquote>
          看到订单簿时，先问五个限定词：哪一个场所、哪一个交易阶段、什么显示口径、什么优先规则、哪一个时间戳。缺少其中任何一个，“深度”“队列”和“最优价”都可能只是表面上精确。
        </blockquote>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">19 · 主动练习 · 约 24–26 分钟</p>
        <h2>不要只读懂图；必须能独立重建状态、计算排队权并指出无法识别之处</h2>
        <details className="practice-card">
          <summary><span>练习一 · 8 分钟</span>逐事件重建：哪些变量改变，哪些保持不变？</summary>
          <div>
            <p>
              以下是一张新的独立订单簿，数量刻意不同于互动实验，请重新读题。初始 bid：99.99 有 400、99.98 有 700；ask：100.01 有 300、100.02 有 500。依次处理：①新增买入限价 200@100.00；
              ②卖出限价 120@100.00；③撤销 100.00 买档余下 80；④买入市价 450。每一步写出成交、各档剩余量、BBO、spread、mid 与 last trade。
            </p>
            <details className="practice-answer">
              <summary>完成推演后查看解析</summary>
              <p>①无成交，bid=100.00、ask=100.01、spread=.01、mid=100.005；②成交120@100.00，100.00 买档余80，BBO不变，last=100.00；
                ③无成交，bid回99.99、ask仍100.01、spread=.02、mid=100.00、last不变；④成交300@100.01与150@100.02，100.02余350，ask=100.02、bid=99.99、spread=.03、mid=100.005、last=100.02。
                若只给最终图而没有中间账本，不算完成。</p>
            </details>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习二 · 6 分钟</span>Queue-ahead：五种事件中哪些真正帮助你？</summary>
          <div>
            <p>
              在严格 FIFO 的 50.00 买档，前方 600 股、你 200 股、后方 300 股。分别独立判断：A. 前方成交100；B. 前方撤100；C. 后方撤100；D. 新同价买单100；
              E. 新的更优买单100@50.01。写出自己的同价 queue ahead 是否变化，并说明“更接近成交”与“更可能很快成交”是否为同一命题。
            </p>
            <details className="practice-answer">
              <summary>完成判断后查看解析</summary>
              <p>A、B 都把 queue ahead 减至500；C 只把level depth降100，queue ahead仍600；D通常排在后方，queue ahead仍600；E不改变同价前方数量，
                却建立更优买档，之后主动卖量会先触及50.01，因此你的经济等待路径可能变差。Queue ahead 是规则状态，不是完整概率。</p>
            </details>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习三 · 5–6 分钟</span>观察边界：相同 Level 1 能否推出唯一执行结果？</summary>
          <div>
            <p>
              两个市场画面都显示 100.00/100.02，best ask 显示100股，下一 ask 100.03 显示500股。市场A没有隐藏量；市场B在100.02有200股 non-displayed interest，
              且规则明确显示100股之后可以执行隐藏量。问：在不知道自己面对A还是B时，180股主动买单的最差成交价是否可由公开快照唯一确定？分别给出两种状态的确定结果。
            </p>
            <details className="practice-answer">
              <summary>写出两种状态后查看解析</summary>
              <p>不能唯一确定。A中为100@100.02＋80@100.03，最差价100.03；B中180股都可在100.02完成。这个练习的合格答案必须包含“无法从给定观察识别”，不能选一个概率更高的故事代替证据。</p>
            </details>
          </div>
        </details>
        <details className="practice-card">
          <summary><span>练习四 · 5–6 分钟</span>状态摘要：计算以后，再写出每个指标不是什么</summary>
          <div>
            <p>
              Best bid=99.98、显示量900；best ask=100.02、显示量300。计算 spread、mid、I 与 queue-weighted mid w，并各写一句不能从它推出的结论。
            </p>
            <details className="practice-answer">
              <summary>完成计算与边界陈述后查看解析</summary>
              <p>spread=.04，mid=100.00，I=(900−300)/1200=.5，w=(100.02×900+99.98×300)/1200=100.01。
                Spread 不解释自身成因；mid与w都不是可执行价；I=.5不保证下一笔上涨；这些量只总结指定时点、指定场所的一档显示状态。</p>
            </details>
          </div>
        </details>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">20 · 理解检查</p>
        <h2>如果你能不看原文回答这些问题，才算真正掌握本节</h2>
        <details><summary>1. 为什么订单簿不是经济学需求曲线？</summary><p>需求曲线是其他条件不变下价格与潜在需求的理论关系；订单簿只包含特定场所、特定时点已经提交并仍有效的条件承诺。未下单意愿、隐藏量和其他场所都可能缺失，而且订单会策略性撤销。</p></details>
        <details><summary>2. Price level depth 与 queue ahead 有什么区别？</summary><p>Level depth 是该价位符合口径的全部剩余量；queue ahead 只加总按规则排在自己前面的同价数量。自己的数量和身后订单进入前者，却不进入后者。</p></details>
        <details><summary>3. 为什么交易发生后 best ask 可能不变？</summary><p>因为成交可以只消耗最优卖档的一部分。只要该档仍有合格剩余量，最低非空卖价没有改变。</p></details>
        <details><summary>4. 为什么没有交易，mid 也会改变？</summary><p>Mid 由best bid和best ask计算。价差内新增挂单或撤空某一最优档都会改写报价，因此mid可以改变而last transaction保持不变。</p></details>
        <details><summary>5. 在 FIFO 下，为什么后方撤单不帮助自己？</summary><p>它减少同价总depth，却没有减少自己前方必须先被消耗或撤销的数量。Queue ahead不变。</p></details>
        <details><summary>6. 为什么“price-time priority”必须带场所条件？</summary><p>不同市场可在价格之后加入显示类别、参与者类别、比例分配、Top/LMM、阈值或其他限制；Nasdaq、NYSE和CME的现行实例都不是同一套纯FIFO协议。</p></details>
        <details><summary>7. Market-by-order 是否等于看到全部流动性？</summary><p>不是。它提供更细的已发布订单级消息，但仍可能缺失隐藏属性、其他场所、内部化订单、未提交意愿，也受权限、延迟和消息完整性约束。</p></details>
        <details><summary>8. Bid depth 大于 ask depth 时，queue-weighted mid 为什么靠近 ask？</summary><p>公式把较大的bid数量作为ask价格的权重，表达“若其他条件不变，较薄一侧更容易先耗尽”的一档直觉；它不是方向保证，因为订单可以撤补，更多状态仍未知。</p></details>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">21 · 课程接口</p>
        <h2>订单簿给出了即时状态；后续章节将解释状态为何具有这种形状，又怎样被流量与反馈推动</h2>
        <p>
          1.03 把交易意图编码成 active-aggressive 或 active-resting 指令；本节把 resting interest 组织成 price level 与 priority queue，并用事件状态机说明它怎样变化。
          下一节 1.05 会解释 bid–ask spread 为什么不是任意缝隙，而会吸收订单处理、库存、逆向选择和竞争成本。1.06—1.07 会把本节定义的 depth 放回多维流动性与恢复速度；
          1.08 会把 ADD、CANCEL 与 EXECUTE 从单个事件提升为带方向的订单流；1.09 再问这些流量怎样改变价格，以及哪些关系只是机械、暂时或内生反馈。
        </p>
        <p>
          更外层的接口同样重要。2.08 的高频交易者会把 queue position 当作稀缺执行权；1.12 的做市商会在库存风险与排队优势之间调整报价；7.19 的 Market State 会把 spread、depth、imbalance、波动和事件强度组合成动态状态。
          但无论模型多复杂，都必须先回答本节的基础问题：<strong>你观察到的究竟是哪一本簿、哪一种状态、哪一套规则，以及哪些事实根本没有被观察到。</strong>
        </p>
      </section>
    </>
  );
}

export const lesson104: LessonRecord = {
  slug: '1-04',
  id: '1.04',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: '订单簿如何组织即时执行权',
  subtitle: 'Limit Order Book：Bid、Ask、Price Level、Queue、Depth 与事件状态机',
  readingTime: '约 82–90 分钟（核心阅读 48–52，含制度与数据进阶框＋互动 10–12＋练习 24–26）',
  prerequisite: '1.03 · 订单如何把意图变成行动；按需回看 T01 Price 与 Return、T08 Financial Data',
  updatedAt: '2026-08-28',
  revision: '1.04-r7',
  reviewStatus: 'double-reviewed',
  previous: { slug: '1-03', label: '1.03 订单如何把意图变成行动' },
  next: { slug: '1-05', label: '1.05 Bid–Ask Spread 为什么存在' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.04-r5',
      summary: '订单簿状态、Queue-Ahead 账本、Last 路径、练习算术、现行交易所规则与 18 条引用均通过；建议进一步消除 Nasdaq/CME 的两处场所术语歧义。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.04-r5',
      summary: '要求细分队列错误值诊断、修复事件与重算后的焦点路径、分离练习题干与解析，并提高桌面和平板文字可读性。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.04-r7',
      summary: '最终版的状态守恒、事件定价、Queue-Ahead 条件、BBO/weighted-mid 公式、练习、场所术语、现行规则与引用全部通过，0 Blocker、0 Major、0 Minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.04-r7',
      summary: '最终版的逐项诊断、先预测后揭示、键盘焦点、两层练习、术语释义、响应式字号、对比度与非颜色编码全部通过。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'record', label: '订单簿保存什么' },
    { id: 'state', label: '最小状态表示' },
    { id: 'levels', label: 'Price Level' },
    { id: 'bbo', label: 'BBO、Spread 与 Mid' },
    { id: 'depth', label: 'Depth 与簿形' },
    { id: 'queue', label: 'Queue Ahead' },
    { id: 'priority', label: '优先规则' },
    { id: 'events', label: '事件状态机' },
    { id: 'counterexamples', label: '四个状态反例' },
    { id: 'stock-flow', label: 'Snapshot 与 Flow' },
    { id: 'observability', label: '可观察性边界' },
    { id: 'data-views', label: '市场数据视图' },
    { id: 'queue-accounting', label: 'Queue-Ahead 账本' },
    { id: 'derived', label: '一档状态摘要' },
    { id: 'book-lab', label: '互动订单簿实验' },
    { id: 'rules', label: '制度实例' },
    { id: 'system-case', label: '系统案例' },
    { id: 'failure-modes', label: '边界与危险表述' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson104Content,
  references: [
    {
      id: 1,
      authors: 'Larry Harris',
      year: '2002',
      title: 'Order-Driven Markets (Chapter 6)',
      publication: 'Trading and Exchanges, Oxford University Press, pp. 112–138',
      url: 'https://doi.org/10.1093/oso/9780195144703.003.0006',
      use: '订单驱动市场、订单优先与成交定价的制度框架。出版较早，不用于代表任何现代场所的现行协议字段。',
    },
    {
      id: 2,
      authors: 'Thierry Foucault, Marco Pagano & Ailsa Röell',
      year: '2023',
      title: 'Limit Order Book Markets (Chapter 6)',
      publication: 'Market Liquidity, 2nd ed., Oxford University Press, pp. 201–248',
      url: 'https://doi.org/10.1093/oso/9780197542064.003.0006',
      use: '限价簿的价格层级、订单提交、执行等待、优先规则与流动性供给。理论模型不作为现实成交概率。',
    },
    {
      id: 3,
      authors: 'Martin D. Gould, Mason A. Porter, Stacy Williams, Mark McDonald, Daniel J. Fenn & Sam D. Howison',
      year: '2013',
      title: 'Limit Order Books',
      publication: 'Quantitative Finance, 13(11), 1709–1742',
      url: 'https://doi.org/10.1080/14697688.2013.803148',
      use: 'LOB 的定义、离散价格、订单事件、数据与经验/理论模型边界；综述中的跨市场现象不当作当前场所规则。',
    },
    {
      id: 4,
      authors: 'Frédéric Abergel, Marouane Anane, Anirban Chakraborti, Aymen Jedidi & Ioane Muni Toke',
      year: '2016',
      title: 'Limit Order Books',
      publication: 'Cambridge University Press',
      url: 'https://doi.org/10.1017/CBO9781316683040',
      use: '订单簿表示、price-time 基准、订单流与排队模型的系统处理。随机模型结果依赖假设与估计。',
    },
    {
      id: 5,
      authors: 'Christine A. Parlour',
      year: '1998',
      title: 'Price Dynamics in Limit Order Markets',
      publication: 'Review of Financial Studies, 11(4), 789–816',
      url: 'https://doi.org/10.1093/rfs/11.4.789',
      use: '订单提交选择与既有队列状态的内生互动；一 tick 理论模型不提供现代市场固定 fill probability。',
    },
    {
      id: 6,
      authors: 'Bruno Biais, Pierre Hillion & Chester Spatt',
      year: '1995',
      title: 'An Empirical Analysis of the Limit Order Book and the Order Flow in the Paris Bourse',
      publication: 'Journal of Finance, 50(5), 1655–1689',
      url: 'https://doi.org/10.1111/j.1540-6261.1995.tb05192.x',
      use: '订单进攻性、簿面状态与订单流的实证互动。早期巴黎制度和样本不外推成现代 A 股参数。',
    },
    {
      id: 7,
      authors: 'Rama Cont, Sasha Stoikov & Rishi Talreja',
      year: '2010',
      title: 'A Stochastic Model for Order Book Dynamics',
      publication: 'Operations Research, 58(3), 549–563',
      url: 'https://doi.org/10.1287/opre.1090.0780',
      use: '把订单新增、撤销与执行组织成连续时间排队系统并计算条件事件。模型到达率与概率不能跨样本照搬。',
    },
    {
      id: 8,
      authors: 'Weibing Huang, Charles-Albert Lehalle & Mathieu Rosenbaum',
      year: '2015',
      title: 'Simulating and Analyzing Order Book Data: The Queue-Reactive Model',
      publication: 'Journal of the American Statistical Association, 110(509), 107–122',
      url: 'https://doi.org/10.1080/01621459.2014.982278',
      use: '事件强度依赖当前订单簿状态的 queue-reactive 建模思路；本节不把估计模型隐藏成互动中的普遍概率。',
    },
    {
      id: 9,
      authors: 'Rama Cont, Arseniy Kukanov & Sasha Stoikov',
      year: '2014',
      title: 'The Price Impact of Order Book Events',
      publication: 'Journal of Financial Econometrics, 12(1), 47–88',
      url: 'https://doi.org/10.1093/jjfinec/nbt003',
      use: '新增、撤销与主动订单作为最优档事件的分类，以及它们与短期价格变化的实证联系；OFI 与冲击估计留给 1.08–1.09。',
    },
    {
      id: 10,
      authors: '上海证券交易所',
      year: '2026',
      accessedAt: '2026-08-28',
      title: '上海证券交易所交易规则（2026年修订）',
      publication: '自 2026-07-06 起施行；重点条款 3.5.1、5.2.2、11.5(五)',
      url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml',
      use: '价格优先、同价时间优先、交易主机接受时间、集中申报簿定义及连续竞价五档行情。只覆盖规则适用证券与阶段。',
    },
    {
      id: 11,
      authors: '深圳证券交易所',
      year: '2026',
      accessedAt: '2026-08-28',
      title: '深圳证券交易所交易规则（2026年修订）',
      publication: '自 2026-07-06 起施行；重点条款 3.4.2、5.2.2、10.4(四)–(五)',
      url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf',
      use: '深交所价格优先、同价时间优先与连续竞价规则边界；不把沪深条款编号、产品细则或交易阶段机械视为相同。',
    },
    {
      id: 12,
      authors: 'Nasdaq Stock Market',
      year: 'current rule',
      accessedAt: '2026-08-28',
      title: 'Nasdaq Equity 4 — Rules 4756 and 4757',
      publication: 'Nasdaq Rulebook',
      url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/nasdaq-equity-4',
      use: '订单时间戳、修改优先边界与 price/display/time 执行算法；是具体美国股票场所规则，不代表所有 LOB。',
    },
    {
      id: 13,
      authors: 'New York Stock Exchange',
      year: 'current rule',
      accessedAt: '2026-08-28',
      title: 'NYSE Rule 7.36 — Order Ranking and Display',
      publication: 'NYSE Rules',
      url: 'https://nyseguide.srorules.com/browse/52dd0a5c7d461000b8f7005056883b3a034',
      use: '非可成交订单按价格、priority category、时间与 ranking restrictions 排序，以及显示、工作和限价的区分。',
    },
    {
      id: 14,
      authors: 'CME Group',
      year: 'current product guidance',
      accessedAt: '2026-08-28',
      title: 'Matching Algorithm Overview',
      publication: 'CME Group Education',
      url: 'https://www.cmegroup.com/education/matching-algorithm-overview',
      use: 'Globex 的 FIFO、Pro-Rata、Threshold Pro-Rata、LMM/Top 与可配置算法家族；具体产品仍需查 Security Definition（证券/产品定义）消息、GCC Product Reference Sheet 与当前通知。',
    },
    {
      id: 15,
      authors: 'Nasdaq',
      year: 'current product catalog',
      accessedAt: '2026-08-28',
      title: 'Global Data Products — Market Data Product Matrix',
      publication: 'Nasdaq Trader',
      url: 'https://www.nasdaqtrader.com/Trader.aspx?id=MDDataProducts',
      use: 'BBO、按价位与 market-by-order/full-depth 数据产品的区分；产品目录不保证订阅者获得所有隐藏或跨场所流动性。',
    },
    {
      id: 16,
      authors: 'CME Group',
      year: 'current technical documentation',
      accessedAt: '2026-08-28',
      title: 'Book Management Messages — Market by Order (MBO)',
      publication: 'CME Group Market Data Platform Documentation',
      url: 'https://www.cmegroup.com/tools-information/webhelp/acp-brokertec-chicago-mdp-price-precision/Content/book-management-messages-mbo.html',
      use: '订单级簿重建中按优先次序确认订单价格与数量；技术文档仅用于对应数据平台与消息规范。',
    },
    {
      id: 17,
      authors: 'U.S. Electronic Code of Federal Regulations',
      year: 'current through 2026',
      accessedAt: '2026-08-28',
      title: '17 CFR § 242.600 — Definitions',
      publication: 'Regulation NMS',
      url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-242/section-242.600',
      use: '美国 NMS 股票中 national best bid/offer、protected quotation 与 trading center 等跨场所术语；不替代场所内部完整优先算法。',
    },
    {
      id: 18,
      authors: 'Sasha Stoikov',
      year: '2018',
      title: 'The Micro-Price: A High-Frequency Estimator of Future Prices',
      publication: 'Quantitative Finance, 18(12), 1959–1966',
      url: 'https://doi.org/10.1080/14697688.2018.1489139',
      use: '模型化 micro-price 与简单 mid、weighted mid 的区别；论文样本与短时距结果不外推成任意市场方向保证。',
    },
  ],
  readingList: [
    {
      title: 'Trading and Exchanges · Chapter 6',
      scope: '制度基础 · Harris, pp. 112–138；重点 order precedence 与 trade-pricing rules',
      reason: '用统一语言理解订单驱动市场如何把价格竞争、同价优先与成交定价连接起来；阅读时用现代规则手册校正具体实现。',
      url: 'https://doi.org/10.1093/oso/9780195144703.003.0006',
    },
    {
      title: 'Limit Order Books',
      scope: '综述地图 · Gould et al.；读 2–4 节定义与实证事实，再读模型限制',
      reason: '从订单簿结构进入数据、统计事实与模型家族，同时训练自己不把简化模型当成真实交易所复刻。',
      url: 'https://doi.org/10.1080/14697688.2013.803148',
    },
    {
      title: 'A Stochastic Model for Order Book Dynamics',
      scope: '排队进阶 · Cont, Stoikov & Talreja；读模型设定、条件事件与实证校准',
      reason: '看到 ADD、CANCEL、EXECUTE 如何从确定性状态转换进入可估计的随机队列模型，并理解概率依赖数据与假设。',
      url: 'https://doi.org/10.1287/opre.1090.0780',
    },
    {
      title: 'Nasdaq Equity 4 · Rules 4756–4757',
      scope: '规则实读 · 对照 price/display/time、时间戳与修改条款',
      reason: '把抽象优先规则映射到一套仍在变化的真实协议；特别观察 display、ranked/non-displayed price 与 timestamp 如何改变“同价先后”。',
      url: 'https://listingcenter.nasdaq.com/rulebook/nasdaq/rules/nasdaq-equity-4',
    },
  ],
};
