import DepthResiliencyLab from '../components/DepthResiliencyLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson107Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Depth 是冲击前的承接库存；resiliency 是冲击后由参与者共同生成的状态转移规律。</h2>
        <p>
          想象两个市场在卖方前 5 bp 都显示 10,000 股。一笔立即买单各自成交 6,000 股后，两边都只剩 4,000 股；到这一瞬间，它们的机械损失完全相同。接下来，市场 A 的交易者判断这只是暂时需求：更宽的价差提高补偿，更短的队列改善优先权，尚有风险容量的人迅速挂出新卖单。市场 B 的交易者却怀疑买方掌握新信息：原报价更容易被“挑中”，撤单和后续买单同时增加。十秒后，A 可能恢复，B 可能继续变薄。静态 depth 没有错，但它没有包含这条条件响应。
        </p>
        <p>
          因而本节的中心机制是：<strong>冲击先通过成交或撤单机械地改变显示订单簿；参与者再依据冲击的信息含量、库存风险、排队收益与自身容量，选择新增、撤回、改价或继续主动交易；这些动作形成恢复性的负反馈，或形成自我强化的正反馈，最终产生补充、重新定价、超调或级联。</strong>
          Resiliency 不是证券身上的常数，也不等于“价格回到原位”；它是给定冲击、前状态、观察坐标、结果变量与时间尺度之后的条件分布。<Cite n={1} /><Cite n={6} /><Cite n={7} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把订单簿表示为有方向、有单位、有价格坐标的累计深度曲线，而不是一个含义不明的“挂单量”。</li>
            <li>用 add−cancel−execution 的消息账本分解固定价格区域的显示深度变化，并识别移动坐标造成的假恢复。</li>
            <li>解释同一机械损失为什么会通过参与者的策略反应走向负反馈恢复或正反馈级联。</li>
            <li>区分 displayed、hidden 与 latent liquidity，区分日历时间、订单簿事件时间和成交时间。</li>
            <li>联合报告恢复概率、条件时间、持续阈值、路径损失、进一步恶化与超调，而不是只报一个半衰期。</li>
            <li>识别事件研究中的择时、共同冲击、均值回归与重叠事件，并把描述性响应同因果效应分开。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节边界</span>
          <p>
            1.06 已定义流动性的四个维度、静态累计深度和冻结订单簿扫单成本；本节只深入 depth 的动态变化与 resiliency。1.08 才系统构造 signed order flow 与 OFI，1.09 才研究价格冲击的暂时和持久成分。7.04 会把局部反馈推广为一般动态系统，7.15 才检验恢复变慢能否成为样本外预警信号。这里会建立接口，但不会把订单事件的条件关联直接称为因果冲击，也不会制定危机阈值。
          </p>
        </aside>
      </section>

      <section className="lesson-section" id="transition-law">
        <p className="section-kicker">01 · 从快照到运动</p>
        <h2>一张订单簿只能告诉你“现在有什么”；resiliency 研究“受到怎样的扰动后，下一步会变成什么”。</h2>
        <p>
          在时点 t，订单簿是一组尚未成交的限价承诺。把它拍成快照，可以看到各价位的数量、最优报价和队列；把它拍成影片，才会看到新订单加入、旧订单撤销、主动订单成交、隐藏数量重新显露，以及最优价格改变后各档位的重新排序。市场的动态不是由交易所替参与者“自动恢复”，而是由许多具有不同目标、信息和约束的交易者在规则内不断重写这组承诺。<Cite n={2} /><Cite n={3} />
        </p>
        <div className="mechanism-chain" aria-label="深度冲击后的动态机制链">
          {[
            ['冲击前状态', '两侧曲线、队列、波动、活动率与参与者容量'],
            ['机械耗尽', '成交吃掉数量，或撤单直接收回承诺'],
            ['风险再判断', '交易者更新信息毒性、库存、对冲和执行概率'],
            ['策略响应', '新增、撤单、改价、隐藏量显露或继续主动交易'],
            ['反馈形成', '净补充形成负反馈；净撤回与持续消耗形成正反馈'],
            ['新市场状态', '恢复、重新定价、超调、复发或级联成为下一轮输入'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链要求把“状态”与“转移规律”分开。很深的市场可以因为报价高度可撤而脆弱；很浅的显示簿也可能因为隐藏储备与快速新单而恢复。更严谨的提问不是“哪个市场 depth 大”，而是“在相同前状态和相同归一化冲击下，各类订单事件的条件分布如何改变，哪些交易条件在多久以后恢复”。
        </p>
      </section>

      <section className="lesson-section" id="depth-curve">
        <p className="section-kicker">02 · 有方向的深度曲线</p>
        <h2>Depth 不是一个总数，而是买卖两侧各自的价格—数量函数。</h2>
        <p>
          令 ℓ∈{'{'}a,b{'}'} 分别代表 ask 与 bid。先只研究围绕<strong>当前中价</strong> m<sub>t</sub> 的即时曲线：由于当前 bid≤m<sub>t</sub>≤当前 ask，可分别把 ask 与 bid 到中价的距离写成下式，两者都非负。这个 x<sup>cur</sup> 只回答“从此刻订单簿中心向外走多远”，不能原样套到可能已经落在整张新订单簿之外的旧中价。
        </p>
        <div className="equation-card">
          <span>当前中价坐标下的累计显示深度与逆曲线</span>
          <div>x<sup>a,cur</sup><sub>t</sub>(p)=10⁴(p−m<sub>t</sub>)/m<sub>t</sub>　；　x<sup>b,cur</sup><sub>t</sub>(p)=10⁴(m<sub>t</sub>−p)/m<sub>t</sub><br />D<sup>ℓ,cur</sup><sub>t</sub>(x) = Σ<sub>p: 0≤x<sup>ℓ,cur</sup><sub>t</sub>(p)≤x</sub> q<sup>ℓ,disp</sup><sub>t</sub>(p)<br />x<sup>ℓ,cur</sup><sub>t</sub>(Q) = inf {'{'}x : D<sup>ℓ,cur</sup><sub>t</sub>(x) ≥ Q{'}'}</div>
          <p>第一式问“从参考价向外不超过 x bp，共显示多少数量”；第二式问“取得 Q 单位数量至少要走多远”。所有报告都必须注明 side、数量单位、参考价、价格窗口、场所集合与时间戳。</p>
        </div>
        <p>
          单一 best-level size、前 K 档数量、固定 bp 带数量和完整累计曲线并不等价。前 K 档会随 tick 改变经济距离；固定 bp 带更便于跨时点比较，却仍受参考价移动影响；只报总量又会丢掉形状。经验研究常发现深度并非随价格距离平滑增加，但具体形状依证券、市场制度和样本而变，不能把某个历史市场的“平均驼峰”当成普遍定律。<Cite n={21} /><Cite n={22} />
        </p>
        <div className="contrast-card">
          <div><span>近端厚、远端空</span><b>小中型订单便宜，大型冲击后可能突然断层</b><p>Best depth 很好看，却不能保证更大数量仍有连续承接。</p></div>
          <div><span>近端薄、远端厚</span><b>入口脆弱，但较大价格范围内仍有库存</b><p>一次小单可能改变最优价，整条曲线却未必已经崩塌。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="coordinates">
        <p className="section-kicker">03 · 坐标决定你看见哪种恢复</p>
        <h2>当前中价坐标衡量围绕新状态的可交易性；冻结坐标衡量旧价格区域是否重新得到承诺。</h2>
        <p>
          Current-mid 距离会随 m<sub>t</sub> 改变：一张完全未改动的卖单可能从 +8 bp 自动进入 +5 bp 价格带，动态带内 depth 因此增加，但没有任何新订单加入。若要追踪冲击前价格区域，不能把旧中价 m<sub>0</sub> 继续塞进“必为非负”的 side-distance；重定价后，新 ask 甚至可能低于 m<sub>0</sub>。应改用有符号全局坐标 y<sub>0</sub>(p)=10⁴(p−m<sub>0</sub>)/m<sub>0</sub>，再明确旧 ask 区和旧 bid 区。
        </p>
        <div className="equation-card">
          <span>冻结旧中价的有符号价格网格</span>
          <div>y<sub>0</sub>(p)=10⁴(p−m<sub>0</sub>)/m<sub>0</sub><br />D<sup>a,old</sup><sub>t,0</sub>(x)=Σ<sub>p∈askₜ</sub>q<sup>a,disp</sup><sub>t</sub>(p)·1[0≤y<sub>0</sub>(p)≤x]<br />D<sup>b,old</sup><sub>t,0</sub>(x)=Σ<sub>p∈bidₜ</sub>q<sup>b,disp</sup><sub>t</sub>(p)·1[−x≤y<sub>0</sub>(p)≤0]</div>
          <p>新 ask 若已低于旧中价，或新 bid 已高于旧中价，不会被误计入旧侧价格带；应把这些跨越旧参考价的数量另报为 cross-reference mass。旧区恢复、围绕新 mid 的再中心化和跨旧中价重定价因此是三个不同结果。</p>
        </div>
        <div className="table-scroll" role="region" aria-label="深度坐标口径比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一条消息流在不同坐标下可以产生不同的深度路径</caption>
            <thead><tr><th scope="col">坐标</th><th scope="col">主要问题</th><th scope="col">优势</th><th scope="col">主要误读</th></tr></thead>
            <tbody>
              <tr><th scope="row">Current mid · 动态</th><td>围绕此刻中心价有多少可交易量？</td><td>贴近新进入者的即时机会集</td><td>把价格再中心化当成新增流动性</td></tr>
              <tr><th scope="row">Pre-shock mid · 冻结</th><td>旧价格区域重新得到多少承诺？</td><td>便于做消息守恒和旧区修复</td><td>把信息性重估当成失去韧性</td></tr>
              <tr><th scope="row">Tick / rank</th><td>最优档和队列结构怎样变化？</td><td>保留撮合优先与微观位置</td><td>跨证券、跨 tick 制度不可直接比</td></tr>
              <tr><th scope="row">Quantity coordinate</th><td>同一数量需要走多远？</td><td>直接连接执行规模</td><td>隐藏量和动态反应仍未观测</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最稳妥的动态研究通常同时报告 current-mid 曲线、frozen signed grid 上的旧侧价格带，以及 cross-reference mass，并明确“恢复”是围绕新价格的市场质量重建，还是旧价格处承诺的返回。坐标不是作图软件的细节，而是反事实问题的一部分。
        </p>
      </section>

      <section className="lesson-section" id="liquidity-layers">
        <p className="section-kicker">04 · 三层流动性</p>
        <h2>Displayed 是可见承诺，hidden 是已提交但未全显示的承诺，latent 是尚未提交的条件意愿。</h2>
        <p>
          Displayed liquidity 是公开订单簿里可见的未成交数量；它最容易测量，也最容易撤回。Hidden liquidity 已经作为订单提交到市场，却因 reserve / iceberg 或完全隐藏规则未全部公开；显示部分成交后，同一订单的储备可能重新显露。Latent liquidity 则尚未成为订单，只表示某些交易者在价格、风险或时间条件满足时愿意进场。Hidden 是不可见的存量承诺，latent 是未来状态到订单到达的响应函数，二者不能与 displayed depth 简单相加成一个“真实库存”。<Cite n={8} /><Cite n={23} />
        </p>
        <div className="market-stack">
          <article><span>DISPLAYED · OBSERVED</span><b>当前公开、可排队也可撤销</b><p>能够直接进入可见深度账本；并不保证下一毫秒仍在。</p></article>
          <article><span>HIDDEN · COMMITTED</span><b>已提交但没有全部公开</b><p>成交量可能超过事前显示量；补显不等于新参与者突然出现。</p></article>
          <article><span>LATENT · CONDITIONAL</span><b>尚未提交的潜在交易意愿</b><p>只有状态变化触发新订单时才成为可执行流动性。</p></article>
        </div>
        <p>
          Bessembinder、Panayides 与 Venkataraman 在特定历史 Euronext 样本中发现隐藏数量使用与订单执行及实施成本存在系统差异；这证明可见簿并非全部承诺，却不能把该样本比例外推为现代市场常数。更重要的是，屏幕快速回填可能只是 iceberg 刷新，也可能是真正的新风险承担；没有订单标识和交易所规则，就不能从图形单独区分。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="conservation">
        <p className="section-kicker">05 · 先做会计账本</p>
        <h2>固定物理价格带内，显示深度只能由新增、撤销与执行改变。</h2>
        <p>
          选定某一侧 ℓ 和固定价格集合 B，例如“99.95 至 100.00 的全部显示买单”。在没有数据遗漏且把改单拆成 cancel+add 时，两个时点间的<strong>可见</strong>深度变化满足消息级恒等式。这个式子不解释参与者为什么行动，却强迫我们先把实际发生了什么记清楚，再讨论机制。
        </p>
        <div className="equation-card">
          <span>固定坐标下的显示深度守恒</span>
          <div>D<sup>ℓ,disp</sup><sub>t₂</sub>(B) − D<sup>ℓ,disp</sup><sub>t₁</sub>(B) = A<sup>ℓ,disp</sup>(B) − C<sup>ℓ,disp</sup>(B) − E<sup>ℓ,disp</sup>(B)</div>
          <p>A<sup>disp</sup> 是新显示或 reserve redisplay 的数量；C<sup>disp</sup> 是以非成交方式从显示簿移除的数量；E<sup>disp</sup> 只扣除成交前确实计入 D<sup>disp</sup> 的部分。完全隐藏订单的成交不减少显示 D，不能塞进 E<sup>disp</sup>。若显示深度从 1,000 降到 400，随后显示新增 700、显示撤销 100、再成交其中 50，最终为 950。</p>
        </div>
        <p>
          <strong>数据工程检查。</strong>不同 feed 的消息语义与可见范围由各自数据字典决定；若数据不能区分成交删除、非成交删除、订单到期或聚合档位变化，研究者不能假装精确识别每一项，而应公开分类规则、序列号处理、重复/丢包检查和隐藏量边界。这是使用具体数据源前必须完成的协议审计。订单簿模型与实证研究则说明，规范化后的 limit add、cancel 与 marketable execution 可以构成状态演化的基本事件。<Cite n={12} /><Cite n={13} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="migration">
        <p className="section-kicker">06 · 移动坐标的迁移项</p>
        <h2>若价格带跟着 mid 移动，订单可以在没有任何消息时跨越边界。</h2>
        <p>
          对动态集合 B<sub>t</sub>，上面的三项账本还不完整。参考价变化会使原订单进入或离开观察带，因此必须加入 M：由坐标重分类造成的净迁移。M 不是参与者新增或撤回的经济行为；它只是研究者改变量尺后，样本成员发生变化。
        </p>
        <div className="equation-card">
          <span>动态价格带的完整账本</span>
          <div>ΔD<sup>ℓ,disp</sup>(B<sub>t</sub>) = A<sup>ℓ,disp</sup> − C<sup>ℓ,disp</sup> − E<sup>ℓ,disp</sup> + M<sup>ℓ</sup><sub>coordinate</sub></div>
          <p>若 current-mid 带内 depth 从 400 变成 900，但 A<sup>disp</sup>=C<sup>disp</sup>=E<sup>disp</sup>=0，则这 500 只能来自坐标迁移，而不能写成“市场补充了 500”。固定原始价带应仍显示 400。</p>
        </div>
        <p>
          这也是为什么恢复图至少要有一个固定坐标审计面板。否则价格移动本身会同时改变“被测对象”和“测量结果”，研究者可能把 repricing 写成 replenishment。互动实验会让你在两种坐标间切换，亲自看到同一订单消息流如何产生两种表观结论。
        </p>
      </section>

      <section className="lesson-section" id="shock-taxonomy">
        <p className="section-kicker">07 · 冲击不是同一种东西</p>
        <h2>成交耗尽、撤单撤回、公共信息、制度技术、容量收缩与跨市场冲击需要不同反事实。</h2>
        <div className="table-scroll" role="region" aria-label="订单簿冲击分类，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>相同的深度下降，可以来自不同动作并携带不同信息</caption>
            <thead><tr><th scope="col">冲击</th><th scope="col">机械表现</th><th scope="col">主要行为含义</th><th scope="col">关键识别风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">主动交易耗尽</th><td>成交直接吃掉一侧</td><td>需求急迫，也可能携带私人信息</td><td>交易者择时、订单拆分与信息选择</td></tr>
              <tr><th scope="row">撤单撤回</th><td>无成交却减少显示承诺</td><td>风险评估、改价或队列重排</td><td>撤单本身可能已响应新闻</td></tr>
              <tr><th scope="row">公共信息</th><td>两侧同时撤改并重新定价</td><td>基本价值和毒性判断改变</td><td>旧价格不回归可能是有效发现</td></tr>
              <tr><th scope="row">制度 / 技术</th><td>暂停、数据异常、优先权或 tick 改变</td><td>可行动集合和协调条件改变</td><td>预期效应、同时政策和跨场所外溢</td></tr>
              <tr><th scope="row">风险容量</th><td>报价规模与库存上限收缩</td><td>中介无法或不愿继续承接</td><td>真实容量通常不可直接观测</td></tr>
              <tr><th scope="row">跨市场</th><td>相关期货、ETF 或场所先动</td><td>套利可吸收价差，也可传递压力</td><td>共同新闻与领先市场难分</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因而一项可复核的冲击定义至少包括 type、side、归一化规模、冲击前状态、venue、时钟时间和 news state。把所有“depth 突降”堆在一起平均，会让完全不同的反事实互相抵消：无信息大单后回到旧状态，与盈利公告后围绕新价值重建，并不是同一个恢复问题。
        </p>
      </section>

      <section className="lesson-section" id="normalized-shock">
        <p className="section-kicker">08 · 相同数量不等于相同冲击</p>
        <h2>冲击规模要相对冲击前可承接能力归一化，并保留“存量下降”与“累计流量”的不同口径。</h2>
        <p>
          10,000 股可能只占大型股票近端深度的 2%，却足以吃空小型股票同一价格带。若直接按绝对股数分组，所谓“恢复更慢”可能只反映研究对象原本更薄。令 t<sub>0−</sub> 和 t<sub>0+</sub> 分别为冲击紧前与紧后的快照、B 为冻结价格带，最干净的即时机械量是显示存量下降率 χ<sub>D</sub>。
        </p>
        <div className="equation-card">
          <span>即时显示存量下降，与窗口内累计流量负荷</span>
          <div>χ<sup>ℓ</sup><sub>D</sub>(B) = [D<sup>ℓ,disp</sup><sub>t₀−</sub>(B)−D<sup>ℓ,disp</sup><sub>t₀+</sub>(B)]<sub>+</sub> / D<sup>ℓ,disp</sup><sub>t₀−</sub>(B)<br />φ<sup>ℓ</sup><sub>E</sub> = Q<sup>ℓ</sup><sub>E,total</sub> / D<sup>ℓ,disp</sup><sub>t₀−</sub>(B)　；　φ<sup>ℓ</sup><sub>C</sub> = Q<sup>ℓ</sup><sub>C,total</sub> / D<sup>ℓ,disp</sup><sub>t₀−</sub>(B)</div>
          <p>χ<sub>D</sub>=0.60 才表示指定冻结带的显示存量瞬时净少了 60%。φ<sub>E</sub> 与 φ<sub>C</sub> 是观察窗内累计执行量、累计非成交移除量相对初始显示存量的流量负荷；补单、reserve redisplay 或 hidden execution 存在时，它们不等于初始显示库存的耗尽率，且完全可能超过 1。</p>
        </div>
        <p>
          因此报告必须同时给出分母、侧别、冻结坐标、两个快照的采样规则、冲击持续时间，以及 execution 与 cancellation 的累计流量。一次瞬时 60% 存量下降与一分钟内反复补充后累计执行初始深度的 160%，给参与者留下的反应机会完全不同；按上一分钟 volume 加速的算法又会把市场活动反馈回冲击速度。归一化让规模可比，却不能替代事件类型和时间结构。
        </p>
      </section>

      <section className="lesson-section" id="three-phases">
        <p className="section-kicker">09 · 三个阶段不能混写</p>
        <h2>机械结果、策略响应与信息更新发生在同一屏幕上，却属于不同解释层。</h2>
        <div className="market-stack">
          <article><span>PHASE 1 · MECHANICAL</span><b>哪些数量被执行或撤回？</b><p>由消息账本回答；不需要推测动机。</p></article>
          <article><span>PHASE 2 · STRATEGIC</span><b>其他参与者随后选择了什么？</b><p>新增、撤单、改价、继续主动交易与等待共同改变路径。</p></article>
          <article><span>PHASE 3 · INFORMATION</span><b>大家从事件和价格中学到了什么？</b><p>对毒性与基本价值的更新会改变第二阶段的选择。</p></article>
        </div>
        <p>
          一笔买单执行 600 股使 ask depth 从 1,000 降到 400，是机械事实。随后卖方新增 700 是策略响应；交易者是否因为认为买单无信息而愿意补单，是对策略的机制解释。若买单来自公告前的知情交易，新卖单不出现、旧卖单撤回，则信息更新通过行为进入订单簿。把三层压成“买单造成市场不稳定”，既丢掉账本，也丢掉反事实。
        </p>
      </section>

      <section className="lesson-section" id="event-intensity">
        <p className="section-kicker">10 · 从事件数到条件强度</p>
        <h2>恢复不是“后来出现过补单”，而是各种事件的到达率和数量分布相对基线如何改变。</h2>
        <p>
          令 e 表示 affected-side displayed add、non-trade display removal、displayed execution、reserve redisplay 或其他明确事件。条件强度 λ<sub>e</sub>(u|ℱ<sub>u−</sub>) 表示给定事件发生前历史时，下一极短时间内事件到达的瞬时速率；它的单位是 events/second。若还关心数量，应把到达率乘以“该类事件发生时”的条件平均事件规模，得到 shares/second 或 contracts/second 的数量强度 ν<sub>e</sub>。
        </p>
        <div className="equation-card">
          <span>事件强度、数量强度与局部净补充</span>
          <div>λ<sub>e</sub>(u|ℱ<sub>u−</sub>) = lim<sub>Δu→0</sub> Pr[N<sub>e</sub>(u,u+Δu)&gt;0 | ℱ<sub>u−</sub>] / Δu<br />ν<sub>e</sub>(u)=λ<sub>e</sub>(u)·E[q<sub>e</sub> | dN<sub>e</sub>(u)=1,ℱ<sub>u−</sub>]　；　μ<sub>D</sub>(u)=ν<sub>A,disp</sub>(u)−ν<sub>C,disp</sub>(u)−ν<sub>E,disp</sub>(u)</div>
          <p>标记数量的条件均值要以“此刻确有 e 类事件发生”为条件。事件变多不代表数量补得更多：100 个一股新单可以小于一次 5,000 股撤单。μ<sub>D</sub>&gt;0 只是指定坐标、指定侧别的局部净显示补充率，不自动等于价格恢复或因果效应；完全隐藏成交也不能误扣为 E<sup>disp</sup>。</p>
        </div>
        <p>
          Hawkes、VAR 或 queue-reactive 模型可以描述订单事件之间的条件激发与状态依赖，Large 也用多变量点过程把恢复概率与等待时间分开。它们提供严谨的动态描述，但“冲击后 add intensity 上升”仍可能来自共同新闻、日内季节性或交易者择时；没有额外外生性或结构假设，impulse response 不能自动命名为因果响应。<Cite n={6} /><Cite n={7} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="participant-calculus">
        <p className="section-kicker">11 · 参与者在权衡什么</p>
        <h2>深度缺口同时提高“补单的回报”和“被挑中的危险”，这正是恢复不确定性的来源。</h2>
        <p>
          对潜在流动性提供者而言，冲击后的更宽 spread 可能提高每次成交的毛补偿，较短队列可能提高成交优先权，价格偏离个人估值又可能带来更好买卖机会；这些力量鼓励新限价单。与此同时，剧烈同向流量可能意味着对手方知道得更多，快速价格变化提高陈旧报价风险，已有库存和对冲敞口又会占用风险限额；这些力量鼓励撤单、缩量或把报价移远。
        </p>
        <p>
          Parlour 的排队模型、Foucault—Kadan—Kandel 的动态流动性市场以及巴黎订单簿实证都说明，订单类型不是外生标签，而会随队列、价差、深度和执行概率改变。因而 resiliency 是均衡结果：它取决于谁仍有能力行动、谁认为当前价格有吸引力、谁担心信息劣势，以及同向需求是否继续到达。<Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={9} />
        </p>
        <aside className="precision-note">
          <span>不要把“做市商”当成单一角色</span>
          <p>同一时刻可能有指定做市商、自动流动性提供者、跨市场套利者、方向性投资者和隐藏订单共同供给数量。它们的持有期、资本约束、信息集和退出规则不同；总深度恢复并不告诉你究竟是谁承担了净库存。</p>
        </aside>
      </section>

      <section className="lesson-section" id="negative-feedback">
        <p className="section-kicker">12 · 恢复性负反馈</p>
        <h2>缺口越大，若补偿与闲置容量带来的新增越强于撤回和继续消耗，系统就把自己拉回可交易区间。</h2>
        <p>
          负反馈更可能在冲击被判断为暂时性、同向订单不再持续、价差与队列收益足以补偿风险、参与者仍有库存和对冲容量、估值异质性较高，以及 hidden orders 能继续成交或 reserve redisplay、latent 意愿能迅速转化为新提交的可执行订单时成立。此时深度下降提高边际供给意愿，新限价单增加；随着缺口缩小，额外补偿消失，新增强度也回落。
        </p>
        <div className="mechanism-chain" aria-label="恢复性负反馈链">
          {[
            ['深度被耗尽', '队列缩短、价差或价格让步扩大'],
            ['供给回报提高', '排队优先、spread capture、相对估值机会改善'],
            ['风险仍可承担', '库存、资本、对冲与技术容量没有绑定'],
            ['净新增转正', 'adds 与补显超过 cancels 和继续 executions'],
            ['交易条件修复', '曲线、价差与完成能力回到条件基线附近'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          “回来”不一定是原参与者重新挂单，也不一定发生在原价格。新的交易者可能在更低 bid 或更高 ask 处进入，市场围绕新 mid 重建。因而负反馈的证据应是受影响侧的净新增、完成能力或完整曲线损失缩小，而不是仅凭成交价格反向移动。
        </p>
      </section>

      <section className="lesson-section" id="positive-feedback">
        <p className="section-kicker">13 · 放大型正反馈</p>
        <h2>缺口越大，若风险感知、共同约束和持续同向流量让更多人撤回，深度损失就会成为下一轮损失的输入。</h2>
        <p>
          正反馈更可能在冲击具有信息性或高度模糊、价格与数据快速异常、多个中介接近共同风险限额、对冲市场同步变薄、执行算法因成交量或价格信号加速、止损与保证金约束被触发，以及个别流动性提供者的风控系统自停时出现。个体自停会直接减少可用报价，可能放大同步撤回；venue-wide 暂停则是另一种制度动作，它暂时停止撮合、提供重新协调窗口，其净效果不能与个体停机预先画等号。此时同一笔后续订单面对更薄的簿，会造成更大价格变动；更大变动又提高毒性与波动判断，引发更多撤单和远移报价。
        </p>
        <div className="mechanism-chain" aria-label="流动性级联正反馈链">
          {[
            ['深度下降', '同样流量跨越更多价位，成交价格变化加大'],
            ['风险信号增强', '参与者担心信息、陈旧报价、库存和系统异常'],
            ['供给同步退缩', '撤单、缩量、远移、停机或转为主动减仓'],
            ['后续订单更有破坏力', '薄簿把持续流量转成更大状态变化'],
            ['级联成为新状态', '恶化本身触发下一轮策略与约束反应'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链与“价格下跌导致更多卖出”有关，却不是同一概念：本节只追踪局部订单簿供给与消耗。资金约束、保证金和资产负债表如何把它闭合成 liquidity spiral，要到 7.11；一般反馈增益、时滞和非线性稳定性则在 7.04。机制模型确实能产生稳定与不稳定区间，但不能把某个模型的临界参数当作所有市场的经验常数。<Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-model">
        <p className="section-kicker">14 · 一个局部教学模型</p>
        <h2>用“有效恢复系数”组织逻辑，但不要把它误当成结构定律。</h2>
        <p>
          令 g<sub>n</sub>=D<sup>0</sup><sub>n</sub>−D<sub>n</sub> 为第 n 个订单簿事件时、相对条件基线的深度缺口。本课程用一个局部一阶近似把多种策略响应压缩为 κ<sub>evt</sub>。它的用途是说明反馈符号，而不是从真实市场直接读取一个固定常数。
        </p>
        <div className="equation-card">
          <span>深度缺口的局部状态转移 · 教学近似</span>
          <div>g<sub>n+1</sub> = (1 − κ<sub>evt</sub>(z))g<sub>n</sub> + ε<sub>n+1</sub></div>
          <p>κ<sub>evt</sub> 是每个订单簿事件的无量纲系数。在无噪声局部模型中，0&lt;κ<sub>evt</sub>&lt;1 给出单调几何收敛；κ<sub>evt</sub>=1 使缺口下一步直接归零；1&lt;κ<sub>evt</sub>&lt;2 给出正负交替但幅度收敛的超调；κ<sub>evt</sub>≤0 或 κ<sub>evt</sub>≥2 不收敛。真实时滞与多变量耦合还会改变这些局部边界。z 包括冲击类型、波动、信息状态、容量和制度。</p>
        </div>
        <p>
          日历时间必须另设有量纲的衰减率 γ<sub>cal</sub>：若真实路径近似 g(u)=g(0)e<sup>−γ<sub>cal</sub>u</sup>，且 u 以秒计，则 γ<sub>cal</sub> 的单位是 s<sup>−1</sup>，半衰期才是 ln2/γ<sub>cal</sub> 秒。κ<sub>evt</sub> 与 γ<sub>cal</sub> 不能混用。现实订单簿常有复发、双阶段恢复、基线漂移和未恢复样本，因此半衰期只在条件成立时是摘要，而不是 resiliency 的定义。Obizhaeva 与 Wang 的动态供需框架说明恢复速度会改变最优执行，但模型化回补也不能直接等同于实证事件路径。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="vector-outcomes">
        <p className="section-kicker">15 · 恢复对象是一个向量</p>
        <h2>价格、价差、受影响侧深度、另一侧深度与完成能力可能用不同速度、向不同方向变化。</h2>
        <p>
          一次立即买入先消耗 ask。新的 ask 限价单会直接修复受影响侧深度；反向主动卖单可能把成交价格推回，却会消耗 bid，并没有补回 ask。极小的新 inside quote 可以让 spread 重新变窄，而其后整条卖方曲线仍为空。公开新闻后 mid 可以永久停在新水平，spread、depth 与 fill probability 却已恢复。
        </p>
        <div className="table-scroll" role="region" aria-label="恢复变量及其含义，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先指定 Y，再谈 Y 的恢复；不同 Y 不能互相代替</caption>
            <thead><tr><th scope="col">结果变量</th><th scope="col">恢复意味着什么</th><th scope="col">不能自动推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">Affected-side curve</th><td>被耗尽一侧的可见容量重建</td><td>另一侧、隐藏量或执行成本同时正常</td></tr>
              <tr><th scope="row">Spread</th><td>最优买卖入口重新靠近</td><td>后续价位已有足够数量</td></tr>
              <tr><th scope="row">Mid / transaction price</th><td>价格回到某个明确基准</td><td>信息性冲击下应回到旧价值</td></tr>
              <tr><th scope="row">Fill ability</th><td>给定任务的完成概率与成本修复</td><td>屏幕上的显示深度完全解释结果</td></tr>
              <tr><th scope="row">Order-event balance</th><td>净新增相对撤销和执行转正</td><td>已经达到稳定或具有因果解释</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="clocks">
        <p className="section-kicker">16 · 两个主时钟与一个旁路时钟</p>
        <h2>日历时间回答“等了多久”；订单簿事件时间回答“经历多少次反应”；成交时间会漏掉撤补单。</h2>
        <p>
          冲击后 u 秒内实际发生的订单簿事件数可写为 n(u)=N(t<sub>0</sub>+u)−N(t<sub>0</sub>)。条件强度的积分 Λ(u)=∫<sub>0</sub><sup>u</sup>λ(s)ds 是这一计数过程的 compensator，也就是给定历史的条件期望累计强度；它不是每条已实现路径都必须等于的实际事件数。日历时间路径 Y(t<sub>0</sub>+u) 关系到真实等待、库存暴露和执行截止；事件时间路径 Y<sub>n₀+n</sub> 关系到市场需要多少次消息反应才能改变状态。一个市场两秒恢复、另一个十秒恢复，可能只是前者在两秒内已经发生同样数量的事件。
        </p>
        <p>
          Event time 也不是天然“清除了活动率”：冲击后事件强度本身就是内生响应。研究还必须声明事件字母表；若只按 trades 计数，危机中最重要的 cancels 和 adds 会消失。Lo 与 Hall 同时处理日历 duration 和订单事件，并显示最优档与远端深度的恢复可以不同；这正说明时钟和价格位置都属于估计对象。<Cite n={7} />
        </p>
        <div className="contrast-card">
          <div><span>Calendar time</span><b>交易者实际暴露了多少秒</b><p>适合执行、风控和等待成本；混合了每事件作用与事件到达速度。</p></div>
          <div><span>Book-event time</span><b>市场经历多少次有效簿更新</b><p>适合比较每次反应；不能忽略冲击改变了事件速度。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="baseline">
        <p className="section-kicker">17 · 恢复必须相对反事实</p>
        <h2>冲击前最后一个快照不一定是“如果没有冲击，本来会怎样”。</h2>
        <p>
          深度有强烈的日内季节性、新闻周期、活动状态和共同市场因子。午盘本来较薄，收盘前本来更活跃；压力日里即使没有目标大单，整个市场也可能继续恶化。若直接把 t<sub>0−</sub> 当作永恒基线，随后的正常均值回归会被算成冲击造成的补充，公共趋势则会被算成目标事件造成的损失。
        </p>
        <p>
          理想对象是条件反事实 X<sup>0</sup>(t<sub>0</sub>+u)：同一证券在相同冲击前状态、时段、市场活动、新闻环境和共同因子下，没有发生目标冲击时的路径。实践中可用匹配的无事件窗口、同类证券、另一 venue、局部预测模型或制度阈值附近对照来逼近。基线方法必须预先写明，并用 pre-trend 和伪事件检查它是否已经在冲击前偏离。
        </p>
      </section>

      <section className="lesson-section" id="recovery-core">
        <p className="section-kicker">18 · 恢复比例、概率与持续时间</p>
        <h2>先标准化“还剩多少损害”，再把是否恢复与恢复者用了多久分开。</h2>
        <p>
          对任一指标 X，令 σ<sub>X</sub>=+1 表示数值越高越坏（如 spread、成本），σ<sub>X</sub>=−1 表示数值越低越坏（如 depth、fill probability）。冲击瞬间相对条件基线的损害为 Δ<sub>X</sub>=σ<sub>X</sub>[X(t<sub>0+</sub>)−X<sup>0</sup>(t<sub>0+</sub>)]&gt;0。随后可把未恢复损害 h 与恢复比例 r 写成无量纲路径。
        </p>
        <div className="equation-card">
          <span>标准化路径</span>
          <div>h<sub>X</sub>(u) = σ<sub>X</sub>[X(t₀+u)−X<sup>0</sup>(t₀+u)] / Δ<sub>X</sub>　；　r<sub>X</sub>(u)=1−h<sub>X</sub>(u)</div>
          <p>冲击瞬间 h=1、r=0；回到条件基线 h=0、r=1；h&gt;1 是进一步恶化，h&lt;0 是超过基线的有利超调。若 Δ 很小，比例会不稳定，应设置最小冲击门槛并同时报告原单位。</p>
        </div>
        <p>
          对目标恢复比例 ρ、要求连续保持的时长 δ，可定义持续恢复时间 τ<sub>ρ,δ</sub>。若整段观察只到 H，候选起点必须限制在 0≤u≤H−δ；只有维持窗口也在 H 内结束，才算得到确认。到 H 仍未确认的事件视为右删失，并同时报告 Pr(τ<sub>ρ,δ</sub>+δ≤H)。只在已确认样本中计算平均时间会删除最脆弱的右尾；把未恢复事件强行记为 H 又会低估真实等待。Large 的重要贡献正是把“是否可靠补充”与“发生时有多快”分开。<Cite n={6} />
        </p>
        <div className="equation-card">
          <span>持续阈值时间与恢复概率</span>
          <div>τ<sub>ρ,δ</sub><sup>(H)</sup> = inf {'{'}u∈[0,H−δ] : sup<sub>v∈[u,u+δ]</sub> h<sub>X</sub>(v) ≤ 1−ρ{'}'}<br />P<sub>ρ,δ</sub>(H|z)=Pr(τ<sub>ρ,δ</sub>+δ≤H | shock,z)</div>
          <p>若集合为空，τ 记为未在 H 内确认。“首次碰到 80%”可能一秒后复发；“达到并连续保持 30 秒且确认窗口完整落在 H 内”才符合持续恢复。概率与条件时间必须成对出现。</p>
        </div>
      </section>

      <section className="lesson-section" id="path-metrics">
        <p className="section-kicker">19 · 非单调路径需要更多摘要</p>
        <h2>First crossing、half-life 和终点值都可能错过二次恶化、路径损失与超调。</h2>
        <p>
          两条路径都在第 60 秒达到 90% 恢复：路径 A 平滑靠近基线；路径 B 在前 50 秒一直比冲击瞬间更差，最后才突然补回。只看终点会把它们判为相同。另一条路径在第 8 秒越过 80%，第 10 秒再次坍塌；只看首次穿越会宣布“快速恢复”。因此应补充平均未恢复损失、最大进一步恶化、超调和复发率。
        </p>
        <div className="equation-card">
          <span>归一化路径损失、级联幅度与超调</span>
          <div>AUC<sup>loss</sup><sub>X</sub>(H) = (1/H)∫<sub>0</sub><sup>H</sup>[h<sub>X</sub>(u)]<sub>+</sub>du<br />C<sub>X</sub>(H)=sup<sub>u≤H</sub>[h<sub>X</sub>(u)−1]<sub>+</sub>　；　O<sub>X</sub>(H)=sup<sub>u≤H</sub>[−h<sub>X</sub>(u)]<sub>+</sub></div>
          <p>这里的 AUC 已除以 H，因此是 horizon 内平均的无量纲缺口；越大表示整个窗口承受的未恢复损失越重。C 衡量冲击后还恶化多少；O 衡量超过基线多少。三者与恢复概率、条件时间共同描述路径，而不是互相替代。</p>
        </div>
        <p>
          只有当路径近似单调指数衰减、基线稳定且绝大多数事件会恢复时，半衰期才具有清晰摘要意义。否则应展示中位路径与分位带，并把未恢复事件保留在概率或 survival 分析中，而不是通过条件样本把它们隐藏起来。
        </p>
      </section>

      <section className="lesson-section" id="curve-loss">
        <p className="section-kicker">20 · 从单点扩展到整条曲线</p>
        <h2>一个极小 inside quote 可以修复 spread，却不能修复大单需要的容量。</h2>
        <p>
          若只观察 best depth，远端曲线仍可能空洞；若只观察总深度，近端可执行量又可能没有回来。Current-mid 曲线使用非负侧内距离 x；frozen-mid 曲线则使用有符号坐标 y<sub>0</sub>，ask 只在 [0,y<sub>max</sub>]、bid 只在 [−y<sub>max</sub>,0] 上积分，并把越过旧 mid 的 cross-reference mass 另报。权重可以让近端容量更重要，但权重必须在看结果前定义并接受敏感性检验。
        </p>
        <div className="equation-card">
          <span>受影响侧的加权曲线损失 · 以 current ask 为例</span>
          <div>L<sup>a,cur</sup><sub>D</sub>(u)= ∫<sub>0</sub><sup>xmax</sup>w(x)[D<sup>0,a,cur</sup>(x,u)−D<sup>a,cur</sup>(x,u)]<sub>+</sub>dx / ∫<sub>0</sub><sup>xmax</sup>w(x)D<sup>0,a,cur</sup>(x,u)dx</div>
          <p>L=0 表示选定坐标域内没有正向深度缺口；L 越大，整条曲线的未恢复容量越多。Frozen ask 把同式的积分变量和上下限改为 y<sub>0</sub>∈[0,y<sub>max</sub>]；frozen bid 改为 y<sub>0</sub>∈[−y<sub>max</sub>,0]。它仍只测 displayed liquidity，不能自动包含 hidden、跨场所和实际成交概率。</p>
        </div>
        <p>
          完整报告应至少分开 bid/ask、best/near/far、current/frozen coordinates。先平均两侧或先把所有价位相加，可能把“ask 已恢复、bid 继续变薄”这种方向性脆弱掩盖掉。
        </p>
      </section>

      <section className="lesson-section" id="identification">
        <p className="section-kicker">21 · 事件路径不等于因果响应</p>
        <h2>大单往往选择流动性异常充足的时刻；冲击后回到常态，未必是大单“创造了恢复”。</h2>
        <p>
          交易者会观察簿再决定订单类型、规模和时机。若大型订单专门在 depth 高、spread 窄、活动率强时执行，事件前就是一个被选择出来的异常状态；事件后即使什么机制都没有，指标也可能自然向常态回归。Gomber、Schweickert 与 Theissen 的大单研究正提醒，流动性时机选择会让简单事件平均产生错误因果故事。订单簿状态影响订单激进度的实证与理论也说明反向因果不是边缘问题。<Cite n={3} /><Cite n={9} /><Cite n={10} />
        </p>
        <div className="table-scroll" role="region" aria-label="Resiliency 识别风险与处理，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每一条漂亮的平均恢复曲线，都需要先回答“若事件不发生会怎样”</caption>
            <thead><tr><th scope="col">威胁</th><th scope="col">怎样制造假结论</th><th scope="col">最低审计</th></tr></thead>
            <tbody>
              <tr><th scope="row">流动性择时</th><td>交易前异常深，事后均值回归</td><td>匹配 pre-state，检查更长事件前路径</td></tr>
              <tr><th scope="row">公共新闻</th><td>冲击与全市场撤单同时发生</td><td>同步新闻、市场因子与对照证券</td></tr>
              <tr><th scope="row">日内季节性</th><td>事件集中在本来会变化的时段</td><td>同证券、同时间匹配与伪事件</td></tr>
              <tr><th scope="row">重叠冲击</th><td>上一事件尚未恢复，下一事件到达</td><td>预定重叠规则、竞争风险或状态模型</td></tr>
              <tr><th scope="row">移动坐标</th><td>价格迁移伪装成订单新增</td><td>固定带账本与双坐标报告</td></tr>
              <tr><th scope="row">Feed / 时间戳</th><td>丢包、聚合与乱序改变事件先后</td><td>序列号、时钟同步、消息重建测试</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因果目标可写成 θ<sub>Y</sub>(u,z)=E[Y<sub>t₀+u</sub>(1)−Y<sub>t₀+u</sub>(0)|Z<sub>t₀−</sub>=z]。实践中可按前状态匹配，使用预定公告 surprise、规则阈值附近的局部比较、制度变更的差分设计，或带充分控制的 local projections；但每种设计都有自己的平行趋势、操纵和外溢假设。MacKinlay 的事件研究框架提供基准逻辑，高频订单簿还要额外处理内生时钟、消息重叠与微观数据误差。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="empirical-evidence">
        <p className="section-kicker">22 · 两项经验研究教会我们的不是“20 秒定律”</p>
        <h2>恢复概率、条件速度、价格位置和时钟必须分开；样本数字必须留在样本里。</h2>
        <p>
          Large 研究 2002 年 1 月伦敦证券交易所 SETS 上的 Barclays 股票，把订单与撤单建模为多变量连续时间点过程。其样本中，超过 60% 的相关耗尽没有产生可可靠识别的补充；在出现补充的条件下，响应半衰期较短、约为 20 秒。正确结论是“是否补回”与“补回者多快”是两个维度，而不是“电子订单簿通常 20 秒恢复”。<Cite n={6} />
        </p>
        <p>
          Lo 与 Hall 研究澳大利亚股票的交易和撤单冲击，用高频 VAR 同时刻画 event time 与 calendar duration，并发现最优价格附近的 spread/depth 与远离最优处的 depth 具有不同动态，证券规模间也存在差异；Degryse 等人的 event-time 研究也显示激进订单后的 spread 与 depth 会沿不同更新步数调整。它们支持全曲线、多时钟测量，却不把动态响应自动变成外生因果效应。多项研究共同说明：resiliency 是条件分布，不是可从一个市场搬到另一个市场的常数。<Cite n={7} /><Cite n={15} />
        </p>
        <aside className="precision-note">
          <span>学术数字的使用规则</span>
          <p>每个经验结果都要连同证券、市场、时期、事件定义、坐标、时钟和模型报告。引用“约 20 秒”时若删除 Barclays、LSE、2002 年 1 月、条件于可识别补充等限定，就已经改变了原命题。</p>
        </aside>
      </section>

      <section className="lesson-section" id="lab">
        <DepthResiliencyLab />
      </section>

      <section className="lesson-section" id="flash-prestate">
        <p className="section-kicker">24 · 真实案例：脆弱的前状态</p>
        <h2>2010 Flash Crash 不是从平静市场中突然出现的一张孤立卖单。</h2>
        <p>
          CFTC 与 SEC 工作人员的最终报告显示，2010 年 5 月 6 日下午 2:30 前，市场已受欧洲债务危机消息和广泛负面情绪影响：VIX 较开盘上升约 22.5%，DJIA 下跌约 2.5%；E-mini 买方深度从早盘接近 60 亿美元降至约 26.5 亿美元，下降 55%。报告中的“liquidity”在这一部分主要指 resting orders 构成的市场深度，并对 SPY 等证券采用距离 mid 500 bp 内的特定口径。<Cite n={16} />
        </p>
        <p>
          约 2:32，一家大型基本面交易者开始用自动算法卖出 75,000 张 2010 年 6 月 E-mini，名义金额约 41 亿美元，用于对冲已有股票头寸。算法把提交速度设为上一分钟成交量的 9%，但不考虑价格或时间；此前类似规模的前 75,000 张用了五个多小时，当日程序则在约 20 分钟完成。这个对比不是“算法必然有害”的证明，而是表明执行规则如何在脆弱前状态中把市场自己生成的 volume 反馈为更高卖出速度。<Cite n={16} />
        </p>
        <div className="case-study">
          <div><span>PRE-STATE</span><b>深度已下降 55%</b><p>冲击发生前的承接能力和风险感知已与平静期不同。</p></div>
          <div><span>PROGRAM</span><b>75,000 张 · 约 41 亿美元</b><p>速度目标绑定上一分钟成交量，不带价格/时间约束。</p></div>
          <div><span>IDENTIFICATION</span><b>背景状态不是控制变量之外的噪声</b><p>同一规模订单在不同前状态下可能走向不同反馈。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="flash-feedback">
        <p className="section-kicker">25 · 从吸收到正反馈</p>
        <h2>高 gross volume 没有等同于净风险吸收，反而被执行算法用作加速输入。</h2>
        <p>
          卖压最初由高频交易者与其他期货中介、基本面买方和跨市场套利者吸收。HFT 一度累计约 3,300 张净多头；2:41 至 2:44 又主动卖出约 2,000 张以减少临时库存，同时交易近 140,000 张、超过同期成交量的 33%。2:45:13 至 2:45:27，HFT 交易超过 27,000 张、约占成交量 49%，净买入却只有约 200 张。高换手说明头寸高速传递，不等于有人愿意持续扩大净承接。后续审计轨迹研究同样要求区分 gross trading pattern 与 net inventory。<Cite n={16} /><Cite n={17} />
        </p>
        <p>
          同期，volume-targeting 算法因成交量升高而加快卖出；据官方报告的审慎判断，此前订单可能尚未被基本面买方或套利者充分吸收。报告明确提醒，尤其在高波动期，高成交量未必是可靠的流动性指标。2:45:13 至 2:45:27，E-mini 买方深度降至约 5,800 万美元、不到早盘 1%，价格在 15 秒内再跌 1.7%；到 2:45:28，买方 resting orders 已少于 1,050 张，也不到开盘深度的 1%。<Cite n={16} />
        </p>
        <div className="mechanism-chain" aria-label="2010 Flash Crash 的局部反馈链">
          {[
            ['持续卖压', '算法卖单、其他基本面卖方与库存反转并存'],
            ['短期吸收', '中介与套利者暂时增加库存并跨市场转移压力'],
            ['容量与意愿下降', '临时库存回吐，报价者担心风险、数据和极端事件'],
            ['Volume 反馈加速', '高换手被算法解释为更快卖出的许可'],
            ['深度极端耗尽', '同样的后续卖单面对更少买方承诺'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
      </section>

      <section className="lesson-section" id="flash-recovery">
        <p className="section-kicker">26 · 暂停、回填与因果边界</p>
        <h2>五秒暂停提供了重新协调的时间，但一个历史事件不能识别暂停政策的平均因果效果。</h2>
        <p>
          2:45:28，CME Stop Logic 触发五秒暂停。官方报告记录，期间 E-mini 卖压部分缓解、买方兴趣增加，订单簿迅速回填；2:45:33 恢复交易后，主动买单抬升价格，E-mini 稳定并开始反弹，随后 SPY 跟随。不同市场的恢复时钟并不一致：SPY 距 mid 500 bp 内的买方 depth 在 2:50–2:51 才降至约 225,000 股的低点，即使 E-mini 和 SPY 价格已经回升。价格恢复、期货簿回填和 ETF 深度低点不是同一事件。<Cite n={16} />
        </p>
        <p>
          这个案例提供了强过程证据：脆弱前状态、持续机械卖出、库存短暂吸收、成交量反馈、报价退缩、深度级联和暂停期补单在明确时间线上相接。但它不支持三种单因果写法：不能说一家卖方单独“造成”全部崩盘，不能说 HFT 单独造成崩盘，也不能由一次阈值触发断言暂停普遍有效。报告封面明确说明，CFTC 与 SEC 两个监管委员会并未对工作人员的分析、发现或结论表达立场；从研究设计看，这一历史案例也不是随机或准实验。后续 SEC 算法交易综述把 HFT 的作用写为“没有导致、但流动性撤回可能加剧”等更审慎的文献总结。<Cite n={16} /><Cite n={18} />
        </p>
        <div className="contrast-card">
          <div><span>案例能支持</span><b>一条有事件证据的多主体反馈机制</b><p>谁先吸收、何时回吐、深度怎样耗尽、暂停期间发生何种回填。</p></div>
          <div><span>案例不能单独支持</span><b>单一主体归因或暂停政策的平均处理效应</b><p>需要跨事件阈值设计、对照组与可重复结果才能回答政策因果问题。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">27 · 反例库</p>
        <h2>以下八种情况专门用来击穿看似顺手、实则越界的推论。</h2>
        <div className="myth-grid">
          <article><span>01</span><b>相同静态 depth，不同恢复</b><p>一边把冲击视为暂时需求并补单，另一边视为私人信息并撤单。</p></article>
          <article><span>02</span><b>Spread 恢复，容量未恢复</b><p>一股 inside quote 让入口变窄，后续整条曲线仍然空。</p></article>
          <article><span>03</span><b>价格不回，市场已恢复</b><p>真实新闻改变基本价值，交易条件在新价格附近迅速正常化。</p></article>
          <article><span>04</span><b>显示很深，未来很脆</b><p>大量可撤报价在风险上升时同步消失；显示不是不可撤销保证。</p></article>
          <article><span>05</span><b>显示较浅，实际可吸收</b><p>Reserve order 持续补显；但补显不证明新风险资本进入。</p></article>
          <article><span>06</span><b>按秒更快，按事件相同</b><p>差异只是消息到达速度，而不是每次响应更有恢复性。</p></article>
          <article><span>07</span><b>首次过线，立即复发</b><p>First crossing 宣布成功，持续阈值和 loss AUC 显示仍脆弱。</p></article>
          <article><span>08</span><b>动态坐标恢复，固定带没变</b><p>价格再中心化把旧订单移入窗口，没有发生真实新增。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">28 · 从世界观到可证伪研究</p>
        <h2>“市场会恢复或恶化”只是框架；研究必须锁定冲击、状态、结果、对照和失败条件。</h2>
        <p>
          一个可执行设计可以这样写：在同一证券—时段内，识别冲击前固定 5 bp 卖方带的显示深度被单次主动买入瞬时净耗尽 40%–60% 的事件；排除公开公告窗口，按冲击前曲线、spread、波动与全部 book-message intensity 匹配对照；同时测量 frozen/current 两套坐标下的 affected-side loss curve；主要终点为观察至第 60 秒时，80% 恢复已连续维持 10 秒并得到完整确认的概率——所以最迟合格起点是第 50 秒；次要终点为删失调整后的条件时间、归一化 loss AUC、最大进一步恶化与另一侧结果。
        </p>
        <p>
          可证伪命题随后才有意义。例如：在相同机械耗尽下，较低的冲击前 cancel/add 比和较高的中介容量代理，应对应更高持续恢复概率；若 calendar-time 差异只由活动率造成，转成统一 book-event time 后路径应基本对齐；若 current-mid 曲线恢复而 frozen band 无新增，所谓恢复应主要归于 repricing；若远端曲线始终慢于 best-level，单看 spread 会系统性高估容量修复。每项命题都给出了可能失败的观察结果，而不是把任何结果都解释成“复杂系统”。
        </p>
        <div className="research-card">
          <span>RESEARCH CONTRACT</span>
          <h3>Shock stratum 𝒮 = type × side × normalized size × pre-state × venue × clock × news</h3>
          <p>先冻结事件定义和主要终点，再看结果；按事件日或证券聚类不确定性；报告未恢复比例、缺失/乱序消息、重叠处理和多个窗口的稳健性。只有在滚动样本外仍能改善校准与判别，恢复变慢才有资格进入 7.15 的 early-warning 候选集。</p>
        </div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">29 · 主动练习</p>
        <h2>先自己推导，再展开参考路径。</h2>
        <div className="exercise-list">
          <article className="practice-problem">
            <span>练习一 · 固定价格带账本</span>
            <p><strong>题目。</strong>冲击前 bid band 有 2,000 股；一次成交先移除 900，随后显示新增 650、非成交撤回 300、又成交显示量 150。计算即时冲击后深度、期末显示深度、后续净响应，以及相对最初 900 股缺口的恢复比例。若 current-mid 带期末显示 1,700，坐标迁移项是多少，能否把它称作补单？</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>即时冲击后为 2,000−900=1,100 股。期末为 2,000−900+650−300−150=1,300 股；冲击后的净响应为 +200，因此修复了最初 900 股缺口的 200/900=22.2%。Current-mid 口径比固定带多 400 股，故 M<sub>coordinate</sub>=+400；它是重新分箱，不是参与者新增，不能把从 1,100 到 1,700 的全部 600 股都称为补单。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习二 · 判断是哪一种恢复</span>
            <p><strong>题目。</strong>公告后 mid 永久上移 3%，旧价格带没有订单返回，但新 mid 两侧的 spread、5 bp displayed depth 与给定任务的完成概率在一分钟内回到各自条件基线。分别判断价格发现、frozen-band depth 与 current-mid 市场质量是否恢复，并说明为何不能只看价格是否回归。</p>
            <details className="practice-answer"><summary>展开机制答案</summary><p>价格永久上移与真实公告相容，因此更像有效 repricing，而不是应被“修复”的错误。Frozen old-side band 没有数量返回，所以旧价格区域的显示深度没有恢复；围绕新 mid 的 spread、5 bp depth 与完成概率回到条件基线，则支持新状态下的市场质量恢复。价格水平、旧带深度与新 mid 交易条件是三个不同结果，不能互相替代。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习三 · 分开比较两个时钟</span>
            <p><strong>题目。</strong>A 在 4 秒、80 个 book events 后达到同一持续恢复标准；B 在 12 秒、40 个 events 后达到。请分别写出 calendar-time 结论与 event-time 结论，并指出现有信息不能支持的总排名。</p>
            <details className="practice-answer"><summary>展开双时钟答案</summary><p><strong>Calendar time：</strong>A 的真实等待和风险暴露更短，若 deadline 介于 4 与 12 秒之间，A 满足而 B 不满足。<strong>Event time：</strong>B 用更少 book events 达标，说明按事件计的状态转移更集中；但没有事件大小、类型和完整路径，不能把它直接称为更高“每事件净修复效率”。两种时钟排序相反，因此不能断言谁无条件“本质上更有韧性”。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习四 · 审计一个大单事件研究</span>
            <p><strong>题目。</strong>研究只挑选“冲击前 depth 处于该证券日内前 5%”时发生的大单，并发现事后 depth 先下降、再回到均值。指出最主要的选择机制，提出最低限度的对照与诊断，并说明什么结果会推翻“大单激发补单”的解释。</p>
            <details className="practice-answer"><summary>展开识别答案</summary><p>大单可能主动选择异常深、活动率高的时点，事后回到均值即使没有大单也会发生。最低限度应匹配同证券、同时间、同样高 depth、spread、波动和 message intensity 但没有目标大单的窗口，并检查更长 pre-trend、共同市场新闻和重叠事件。若伪事件或匹配对照也出现同样回落，或目标事件相对对照没有额外 add intensity 与持续恢复概率增量，“大单激发补单”的因果解释就失败。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">30 · 理解检查</p>
        <h2>如果不能脱离原文回答这些问题，就还没有掌握机制。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么“前五档深度”不是跨证券自然可比量？</summary><p>因为档位的经济价格距离由 tick、价格水平和订单分布决定。五档在一只证券可能覆盖 1 bp，在另一只覆盖 20 bp；还要统一侧别、单位和场所。</p></details>
          <details><summary>02 · A−C−E 为什么只在固定坐标下完整？</summary><p>动态参考价会让未改动订单跨越观察带边界，需要 migration term。否则价格变化会被误记为新增或撤回。</p></details>
          <details><summary>03 · Hidden 与 latent liquidity 最本质的区别是什么？</summary><p>Hidden 已经提交，只是没有全部公开；latent 尚未成为订单，是状态触发后才可能转化的意愿。前者是不可见承诺存量，后者是条件响应。</p></details>
          <details><summary>04 · 为什么同一机械耗尽可能走向相反结局？</summary><p>参与者对信息毒性、库存风险、排队收益和自身容量的判断不同，导致 adds、cancels 与后续 aggressive flow 的净方向不同。</p></details>
          <details><summary>05 · 价格回升为什么不证明受影响侧 depth 已恢复？</summary><p>反向主动单可以推动价格，却消耗另一侧；新价格也可能来自信息更新。必须直接检查受影响侧的新增和完整曲线。</p></details>
          <details><summary>06 · Calendar time 和 event time 各回答什么？</summary><p>前者回答真实等待和风险暴露，后者回答经历多少次订单簿反应。任何一个都不能替代另一个。</p></details>
          <details><summary>07 · 为什么恢复概率必须与条件恢复时间一起报？</summary><p>只看恢复者的时间会删除未恢复的右尾；只看概率又不知道成功者多快。二者共同描述可靠性和速度。</p></details>
          <details><summary>08 · First crossing 的主要缺陷是什么？</summary><p>路径可能短暂过线后马上复发。持续阈值、loss AUC 和 relapse rate 才能识别这种假恢复。</p></details>
          <details><summary>09 · 大单后快速恢复为什么可能是选择偏差？</summary><p>交易者会在异常高流动性时提交大单；事后回到常态可能是均值回归，不是大单引发供给。</p></details>
          <details><summary>10 · Flash Crash 案例最稳妥的因果表述是什么？</summary><p>它提供脆弱前状态、持续卖压、库存反转、volume feedback、报价撤回、深度崩塌和暂停期回填的过程证据；不能单独识别某一主体或暂停政策的平均因果效应。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">31 · 课程接口</p>
        <h2>本节把“深度会动”变成可测状态转移，下一步才研究订单流信息与价格反应。</h2>
        <div className="interface-grid">
          <article><span>→ 1.08</span><h3>Order Flow 与 OFI</h3><p>本节把 add、cancel、execution 当作守恒与反馈动作；下一节研究如何带符号聚合，以及为什么不平衡携带短期信息。</p></article>
          <article><span>→ 1.09</span><h3>Price Impact</h3><p>本节只把价格作为一个恢复结果；下一节区分机械、暂时、持久与信息相关的价格反应。</p></article>
          <article><span>→ 7.04</span><h3>Feedback</h3><p>本节给出局部正负反馈；以后系统处理增益、时滞、非线性阈值、稳定性和多变量耦合。</p></article>
          <article><span>→ 7.15</span><h3>Early Warning</h3><p>本节输出恢复概率、持续时间、loss AUC 与级联幅度；以后检验它们是否在条件化后具有样本外预警价值。</p></article>
        </div>
        <p className="closing-thesis">当你看到“市场深度恢复”时，第一反应不应是问用了几秒，而应依次追问：哪一侧、哪条曲线、哪个坐标、什么冲击、相对什么反事实、由哪些订单事件对账、是否持续、谁仍在承担风险，以及这条路径是描述还是因果。做到这一步，resiliency 才从一个模糊形容词变成可检验的动态机制。</p>
      </section>
    </>
  );
}

export const lesson107: LessonRecord = {
  slug: '1-07',
  id: '1.07',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Market Depth 与 Resiliency',
  subtitle: '从静态承接库存出发，追踪冲击如何经由新增、撤单、继续成交与风险再判断，形成恢复性负反馈或流动性级联',
  readingTime: '约 85–90 分钟（核心阅读 52–54＋互动 13–14＋主动练习与检查 20–22）',
  prerequisite: '1.06 · Liquidity 的四个维度；建议按需回看 1.04 Limit Order Book 与 T08 Time Scale',
  updatedAt: '2026-08-28',
  revision: '1.07-r4',
  reviewStatus: 'double-reviewed',
  previous: { slug: '1-06', label: '1.06 Liquidity 的四个维度' },
  next: { slug: '1-08', label: '1.08 Order Flow 与 Order Flow Imbalance' },
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.07-r1',
      summary: '要求修正冻结坐标的侧别域、显示深度账本、即时耗尽与累计流量口径、持续阈值观察窗、归一化 AUC、事件时间系数与点过程数量强度，并区分个体风控停机和全市场暂停。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.07-r1',
      summary: '要求消除互动实验提交前的计算结果与派生标签泄露，把四道练习改成题面常显、答案折叠的结构，提高核心文字字号与对比度，并统一归一化 AUC 和坐标迁移符号。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.07-r2',
      summary: 'r1 的主要公式与口径问题均已解决；终审仍要求分开 hidden order 与 latent 意愿，补列 κ_evt=1，保留 Flash Crash 原报告的审慎限定，避免 horizon 符号冲突，并准确标明 CFTC/SEC 免责声明主体。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.07-r2',
      summary: 'r1 的答案泄露、练习结构、AUC 与迁移符号问题均已解决；终审仍要求提高表格、图轴、图例和账本标签字号，加深浅色界面的强调红，并让每个单选组拥有当前题目的读屏名称。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.07-r3',
      summary: 'hidden/latent、κ_evt=1、Flash Crash 审慎限定、Shock stratum 符号和两监管委员会免责声明均已修正；全章公式、案例数字、23 条引用、8 个互动任务、4 道练习与 10 个检查通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.07-r3',
      summary: 'r2 的字号、对比度与单选组读屏名称均已修正；但固定 520-unit viewBox 在窄屏被 width:100% 整体缩小，导致声明为 16px 的 SVG 轴文字实际仅约 8–9px，要求改为保持图宽并提供可聚焦横向滚动。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.07-r4',
      summary: 'r4 仅增加恢复图的滚动、聚焦与最小宽度并登记 r3 审稿记录；全章公式、8 个互动任务、4 道练习、10 个检查、Flash Crash 数字与 23 条引用全部回归通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.07-r4',
      summary: '恢复图在 360–390px 窄屏保持 520px 最小宽度并可触摸或键盘横向浏览，焦点与读屏标签完整；全部既往教学、可读性、答案泄露、无障碍和响应式问题回归通过，未发现 blocker、major 或 minor。',
    },
  ],
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'transition-law', label: '从快照到运动' },
    { id: 'depth-curve', label: '有方向的深度曲线' },
    { id: 'coordinates', label: '坐标与恢复' },
    { id: 'liquidity-layers', label: '三层流动性' },
    { id: 'conservation', label: '深度守恒账本' },
    { id: 'migration', label: '坐标迁移项' },
    { id: 'shock-taxonomy', label: '冲击分类' },
    { id: 'normalized-shock', label: '归一化冲击' },
    { id: 'three-phases', label: '三个解释阶段' },
    { id: 'event-intensity', label: '事件条件强度' },
    { id: 'participant-calculus', label: '参与者权衡' },
    { id: 'negative-feedback', label: '恢复性负反馈' },
    { id: 'positive-feedback', label: '放大型正反馈' },
    { id: 'feedback-model', label: '局部反馈模型' },
    { id: 'vector-outcomes', label: '恢复结果向量' },
    { id: 'clocks', label: '多个恢复时钟' },
    { id: 'baseline', label: '条件反事实基线' },
    { id: 'recovery-core', label: '概率与持续时间' },
    { id: 'path-metrics', label: '完整路径度量' },
    { id: 'curve-loss', label: '整条曲线损失' },
    { id: 'identification', label: '因果识别' },
    { id: 'empirical-evidence', label: '经验研究边界' },
    { id: 'lab', label: '互动冲击实验' },
    { id: 'flash-prestate', label: 'Flash Crash 前状态' },
    { id: 'flash-feedback', label: 'Flash Crash 反馈' },
    { id: 'flash-recovery', label: '暂停与因果边界' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究设计' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson107Content,
  references: [
    {
      id: 1,
      authors: 'Albert S. Kyle',
      year: '1985',
      title: 'Continuous Auctions and Insider Trading',
      publication: 'Econometrica, 53(6), 1315–1335',
      url: 'https://doi.org/10.2307/1913210',
      use: 'Tightness、depth 与 resiliency 的经典概念起点；“无信息随机冲击后的恢复”限定提醒我们不能要求信息性价格变化回到旧水平。',
    },
    {
      id: 2,
      authors: 'Martin D. Gould, Mason A. Porter, Stacy Williams, Mark McDonald, Daniel J. Fenn & Sam D. Howison',
      year: '2013',
      title: 'Limit Order Books',
      publication: 'Quantitative Finance, 13(11), 1709–1742',
      url: 'https://doi.org/10.1080/14697688.2013.803148',
      use: '限价订单簿结构、事件、统计规律与模型的系统综述；经验形状和模型性质不能当成所有市场的自然定律。',
    },
    {
      id: 3,
      authors: 'Bruno Biais, Pierre Hillion & Chester Spatt',
      year: '1995',
      title: 'An Empirical Analysis of the Limit Order Book and the Order Flow in the Paris Bourse',
      publication: 'Journal of Finance, 50(5), 1655–1689',
      url: 'https://doi.org/10.1111/j.1540-6261.1995.tb05192.x',
      use: '订单簿状态与后续订单选择的经验联系，以及订单事件分类；特定巴黎市场样本的关联不自动识别外生因果。',
    },
    {
      id: 4,
      authors: 'Christine A. Parlour',
      year: '1998',
      title: 'Price Dynamics in Limit Order Markets',
      publication: 'Review of Financial Studies, 11(4), 789–816',
      url: 'https://doi.org/10.1093/rfs/11.4.789',
      use: '排队、执行概率和订单类型选择的动态理论联系；模型比较静态不作为真实市场恢复参数。',
    },
    {
      id: 5,
      authors: 'Thierry Foucault, Ohad Kadan & Eugene Kandel',
      year: '2005',
      title: 'Limit Order Book as a Market for Liquidity',
      publication: 'Review of Financial Studies, 18(4), 1171–1217',
      url: 'https://doi.org/10.1093/rfs/hhi029',
      use: '交易者耐心、到达率、spread、执行时间和 resiliency 的均衡联系；理论参数不能直接外推为普遍经验常数。',
    },
    {
      id: 6,
      authors: 'Jeremy Large',
      year: '2007',
      title: 'Measuring the Resiliency of an Electronic Limit Order Book',
      publication: 'Journal of Financial Markets, 10(1), 1–25',
      url: 'https://doi.org/10.1016/j.finmar.2006.09.001',
      use: '用连续时间点过程分开补充概率与条件等待，并提供 Barclays / LSE 2002 年样本的“低可靠性、条件快速”结果；约 20 秒不是市场常数。',
    },
    {
      id: 7,
      authors: 'Danny K. Lo & Anthony D. Hall',
      year: '2015',
      title: 'Resiliency of the Limit Order Book',
      publication: 'Journal of Economic Dynamics and Control, 61, 222–244',
      url: 'https://doi.org/10.1016/j.jedc.2015.09.012',
      use: '交易与撤单冲击、日历 duration 与订单事件时钟，以及最优档和远端深度的异质恢复；VAR 响应本身不保证因果解释。',
    },
    {
      id: 8,
      authors: 'Hendrik Bessembinder, Marios Panayides & Kumar Venkataraman',
      year: '2009',
      title: 'Hidden Liquidity: An Analysis of Order Exposure Strategies in Electronic Stock Markets',
      publication: 'Journal of Financial Economics, 94(3), 361–383',
      url: 'https://doi.org/10.1016/j.jfineco.2009.02.001',
      use: 'Displayed 与 hidden order exposure、执行结果和实施成本的历史 Euronext 证据；样本比例不能外推为现代市场常数。',
    },
    {
      id: 9,
      authors: 'Angelo Ranaldo',
      year: '2004',
      title: 'Order Aggressiveness in Limit Order Book Markets',
      publication: 'Journal of Financial Markets, 7(1), 53–74',
      url: 'https://doi.org/10.1016/S1386-4181(02)00069-1',
      use: 'Spread、两侧 depth、波动与订单激进度之间的状态依赖关系；用于说明订单选择内生于订单簿而非随机分配。',
    },
    {
      id: 10,
      authors: 'Peter Gomber, Uwe Schweickert & Erik Theissen',
      year: '2015',
      title: 'Liquidity Dynamics in an Electronic Open Limit Order Book: An Event Study Approach',
      publication: 'European Financial Management, 21(1), 52–78',
      url: 'https://doi.org/10.1111/j.1468-036X.2013.12006.x',
      use: '大额交易周围的流动性动态和交易择时，支持对简单事件均值中的选择偏差与均值回归进行审计。',
    },
    {
      id: 11,
      authors: 'Anna A. Obizhaeva & Jiang Wang',
      year: '2013',
      title: 'Optimal Trading Strategy and Supply/Demand Dynamics',
      publication: 'Journal of Financial Markets, 16(1), 1–32',
      url: 'https://doi.org/10.1016/j.finmar.2012.09.001',
      use: '动态供求恢复与最优执行的理论联系；模型中的线性恢复是结构化近似，不等于所有订单簿的真实路径。',
    },
    {
      id: 12,
      authors: 'Rama Cont, Sasha Stoikov & Rishi Talreja',
      year: '2010',
      title: 'A Stochastic Model for Order Book Dynamics',
      publication: 'Operations Research, 58(3), 549–563',
      url: 'https://doi.org/10.1287/opre.1090.0780',
      use: '以限价单、市场单和撤单到达构造订单簿状态演化；模型事件过程用于组织账本，不作为本节合成实验的校准。',
    },
    {
      id: 13,
      authors: 'Rama Cont, Arseniy Kukanov & Sasha Stoikov',
      year: '2014',
      title: 'The Price Impact of Order Book Events',
      publication: 'Journal of Financial Econometrics, 12(1), 47–88',
      url: 'https://doi.org/10.1093/jjfinec/nbt003',
      use: '新增、撤单和市场单共同构成订单簿事件流；本节只借用事件账本边界，OFI 与价格映射留待 1.08–1.09。',
    },
    {
      id: 14,
      authors: 'Weibing Huang, Charles-Albert Lehalle & Mathieu Rosenbaum',
      year: '2015',
      title: 'Simulating and Analyzing Order Book Data: The Queue-Reactive Model',
      publication: 'Journal of the American Statistical Association, 110(509), 107–122',
      url: 'https://doi.org/10.1080/01621459.2014.982278',
      use: '订单到达强度依赖当前队列状态的统计建模；模拟器是状态依赖机制工具，不是外生自然实验。',
    },
    {
      id: 15,
      authors: 'Hans Degryse, Frank de Jong, Maarten van Ravenswaaij & Gunther Wuyts',
      year: '2005',
      title: 'Aggressive Orders and the Resiliency of a Limit Order Market',
      publication: 'Review of Finance, 9(2), 201–242',
      url: 'https://doi.org/10.1007/s10679-005-7590-6',
      use: '激进订单后 spread 与 depth 的 event-time 调整；具体更新次数属于该市场样本，不是普遍恢复常数。',
    },
    {
      id: 16,
      authors: 'Staffs of the U.S. Commodity Futures Trading Commission & U.S. Securities and Exchange Commission',
      year: '2010',
      accessedAt: '2026-08-28',
      title: 'Findings Regarding the Market Events of May 6, 2010',
      publication: 'Report to the Joint Advisory Committee on Emerging Regulatory Issues, September 30, 2010',
      url: 'https://www.sec.gov/files/marketevents-report.pdf',
      use: 'Flash Crash 的脆弱前状态、75,000 张卖出程序、volume feedback、HFT gross/net 数量、E-mini 与 SPY 深度、五秒暂停和回填时间线；报告是工作人员 findings，CFTC 与 SEC 两监管委员会未对其分析、发现或结论表达立场。',
    },
    {
      id: 17,
      authors: 'Andrei Kirilenko, Albert S. Kyle, Mehrdad Samadi & Tugkan Tuzun',
      year: '2017',
      title: 'The Flash Crash: High-Frequency Trading in an Electronic Market',
      publication: 'Journal of Finance, 72(3), 967–998',
      url: 'https://doi.org/10.1111/jofi.12498',
      use: '以 E-mini 审计轨迹研究 Flash Crash 期间市场中介、交易模式与库存动态，支持区分高 gross turnover 与净风险吸收；不支持 HFT 单因归因。',
    },
    {
      id: 18,
      authors: 'Staff of the U.S. Securities and Exchange Commission',
      year: '2020',
      accessedAt: '2026-08-28',
      title: 'Staff Report on Algorithmic Trading in U.S. Capital Markets',
      publication: 'U.S. SEC Staff Report to Congress, August 5, 2020',
      url: 'https://www.sec.gov/file/algo_trading_report_2020pdf',
      use: '算法交易和 HFT 对市场质量与压力事件的官方文献综述；支持对 Flash Crash 采用“未造成但撤回或加剧可能存在”的审慎归因边界。',
    },
    {
      id: 19,
      authors: 'A. Craig MacKinlay',
      year: '1997',
      title: 'Event Studies in Economics and Finance',
      publication: 'Journal of Economic Literature, 35(1), 13–39',
      url: 'https://www.jstor.org/stable/2729691',
      use: '事件研究的反事实、估计窗口与统计推断基准；高频订单簿应用还需额外处理内生事件、消息时钟和重叠。',
    },
    {
      id: 20,
      authors: 'Antoine Fosset, Jean-Philippe Bouchaud & Michael Benzaquen',
      year: '2020',
      title: 'Endogenous Liquidity Crises',
      publication: 'Journal of Statistical Mechanics: Theory and Experiment, 2020(6), 063401',
      url: 'https://doi.org/10.1088/1742-5468/ab7c64',
      use: '流动性供给对波动和趋势响应时产生稳定/不稳定区间的机制模型；不能把模型临界值写成所有真实市场的通用阈值。',
    },
    {
      id: 21,
      authors: 'Frédéric Abergel, Marouane Anane, Anirban Chakraborti, Aymen Jedidi & Ioane Muni Toke',
      year: '2016',
      title: 'Limit Order Books',
      publication: 'Cambridge University Press',
      url: 'https://doi.org/10.1017/CBO9781316683040',
      use: '订单簿表示、统计事实、事件过程和建模的系统教材背景；用于深度曲线与消息层的概念核对。',
    },
    {
      id: 22,
      authors: 'Jean-Philippe Bouchaud, Marc Mézard & Marc Potters',
      year: '2002',
      title: 'Statistical Properties of Stock Order Books: Empirical Results and Models',
      publication: 'Quantitative Finance, 2(4), 251–256',
      url: 'https://doi.org/10.1088/1469-7688/2/4/301',
      use: '历史巴黎股票订单簿平均形状的经验与模型讨论；样本驼峰不能冒充跨市场自然定律。',
    },
    {
      id: 23,
      authors: 'Lorenzo Dall’Amico, Antoine Fosset, Jean-Philippe Bouchaud & Michael Benzaquen',
      year: '2019',
      title: 'How Does Latent Liquidity Get Revealed in the Limit Order Book?',
      publication: 'Journal of Statistical Mechanics: Theory and Experiment, 2019(1), 013404',
      url: 'https://doi.org/10.1088/1742-5468/aaf10e',
      use: '潜在流动性向可见订单簿转化的机制建模，用于区分尚未提交的条件意愿与已提交 hidden orders；不是潜在存量的直接测量。',
    },
  ],
  readingList: [
    {
      title: 'Measuring the Resiliency of an Electronic Limit Order Book',
      scope: '核心实证 · Large（2007），重点读 event taxonomy、intensity response、replenishment probability 与 conditional delay',
      reason: '亲自看到为什么“是否补回”和“补回者多快”必须分开，并核对约 20 秒结果的严格样本边界。',
      url: 'https://doi.org/10.1016/j.finmar.2006.09.001',
    },
    {
      title: 'Resiliency of the Limit Order Book',
      scope: '多时钟与多价位 · Lo & Hall（2015），读 trading/cancellation shocks、calendar duration 与 depth responses',
      reason: '理解同一市场在 best、far depth 和不同时间坐标上为什么没有一个统一恢复速度。',
      url: 'https://doi.org/10.1016/j.jedc.2015.09.012',
    },
    {
      title: 'Limit Order Books',
      scope: '综述地图 · Gould et al.（2013），选择 order-book state、event flow、stylized facts 与 model 部分',
      reason: '把本节的消息守恒、曲线和条件强度放回整个 LOB 研究脉络，并识别哪些事实只属于特定数据。',
      url: 'https://doi.org/10.1080/14697688.2013.803148',
    },
    {
      title: 'Hidden Liquidity',
      scope: '不可见承诺 · Bessembinder、Panayides、Venkataraman（2009），读 exposure choice、execution 与 implementation shortfall',
      reason: '校正“屏幕深度就是全部可执行供给”的直觉，同时学习怎样把历史制度样本保留在边界内。',
      url: 'https://doi.org/10.1016/j.jfineco.2009.02.001',
    },
    {
      title: 'Liquidity Dynamics in an Electronic Open Limit Order Book: An Event Study Approach',
      scope: '识别审计 · Gomber、Schweickert、Theissen（2015），重点读交易前流动性和事件后路径',
      reason: '训练自己从“事件后恢复”中识别流动性择时与均值回归，而不急于作因果归因。',
      url: 'https://doi.org/10.1111/j.1468-036X.2013.12006.x',
    },
    {
      title: 'Findings Regarding the Market Events of May 6, 2010',
      scope: '官方时间线 · CFTC/SEC Staffs（2010），重点读 Executive Summary、I.3–I.5 与 order-book analysis',
      reason: '用一手报告重建脆弱前状态、volume feedback、深度耗尽、跨市场时钟和暂停期回填，同时保持 staff-report 边界。',
      url: 'https://www.sec.gov/files/marketevents-report.pdf',
    },
    {
      title: 'The Flash Crash: High-Frequency Trading in an Electronic Market',
      scope: '审计轨迹 · Kirilenko、Kyle、Samadi、Tuzun（2017），读参与者分类、库存与交易模式',
      reason: '把高成交量与净风险吸收分开，并比较官方过程重建与同行评审微观数据研究可以分别支持什么。',
      url: 'https://doi.org/10.1111/jofi.12498',
    },
  ],
};
