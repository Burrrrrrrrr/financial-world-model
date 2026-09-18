import AdverseSelectionLab from '../components/AdverseSelectionLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson110Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>流动性提供者真正害怕的，不是对手“知道得更多”这一静态事实，而是知道得更多的人会有选择地接受那些对报价者最不利的价格。</h2>
        <p>
          想象你先承诺“100 元愿意卖、99.90 元愿意买”，对手随后才决定是否成交。如果资产其实更值钱，拥有更好信息的人更愿意立刻按 100 元买走；如果资产其实更便宜，他更愿意按 99.90 元卖给你。于是成交不是从所有时刻随机抽出的样本，而是被对手的信息和策略筛选过的样本：<strong>你卖出的时刻，真实共同价值更可能偏高；你买入的时刻，真实共同价值更可能偏低。</strong>这就是 adverse selection，也就是逆向选择。它把“对手选择何时成交”转化为被动一方的条件预期损失。<Cite n={1} /><Cite n={2} />
        </p>
        <p>
          本节沿一条严格的因果链展开：信息优势改变交易者对状态的判断；判断改变方向、规模、时机和场所；报价者从已经发生的成交反推状态；后验价值改变 bid、ask、深度与参与意愿；新的报价又改变知情者隐藏信息的方式。逆向选择因此既是价差形成的微观机制，也是订单流进入价格发现的入口，但它不等于“买后涨”、不等于纯机械 price impact，也不等于违法内幕交易。Kyle、PIN、VPIN 与成交后 markout 都只在各自假设下投影这条链的一部分。<Cite n={2} /><Cite n={7} /><Cite n={12} /><Cite n={14} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把共同价值、私人信号、交易者类型、行动和可观察订单流严格分开。</li>
            <li>从 Bayes 定理推导买卖方向后的后验价值，并计算竞争性 bid 与 ask。</li>
            <li>解释为何零库存风险、风险中性和零平均利润仍可支持正的信息型价差。</li>
            <li>区分 adverse selection、inventory risk、机械冲击、信念分歧与事后盈利。</li>
            <li>说明规模、序列、时机、公共新闻延迟和战略拆单如何改变订单的信息含量。</li>
            <li>正确读取 Kyle λ、signed markout、spread decomposition、PIN 与 VPIN 的估计对象和边界。</li>
            <li>把“有毒订单流”改写成带期限、对照、代理与失败条件的可证伪研究问题。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>本节与相邻单元的边界</span>
          <p>1.05 已解释价差口径，1.08 已建立成交方向与 OFI，1.09 已区分 response、markout 与 causal impact。本节只回答：成交方向为什么会改变被动报价者对共同价值的后验。1.11 再讨论信息先在哪个市场进入价格，1.12–1.13 再完整展开做市商目标与库存控制，6.03 再研究同一信息下的信念分歧。</p>
        </aside>
      </section>

      <section className="lesson-section" id="object-map">
        <p className="section-kicker">01 · 五层对象地图</p>
        <h2>信息、交易者、行动、订单流和价格更新是五个不同对象；把它们压成“知情买单”会制造几乎所有后续误判。</h2>
        <div className="table-scroll" role="region" aria-label="逆向选择五层对象比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从潜在共同价值到可观察数据</caption>
            <thead><tr><th scope="col">层</th><th scope="col">本节定义</th><th scope="col">能否直接观察</th><th scope="col">最常见错位</th></tr></thead>
            <tbody>
              <tr><th scope="row">共同价值 V</th><td>选定未来时点、相关信息最终进入后，各方共同面对的参考价值</td><td>通常只能事后以有噪声结果近似</td><td>把任意未来 mid 当成无误的“真值”</td></tr>
              <tr><th scope="row">信号 s<sub>t</sub></th><td>行动前观察到、会改变状态概率判断的信息</td><td>研究者通常看不到完整信号</td><td>把公开新闻、私人研究和违法信息视为同一法律对象</td></tr>
              <tr><th scope="row">信息集与类型</th><td>主体当时可使用的信息，以及相对于报价者是否更有预测力</td><td>只能由设计、身份数据或模型间接判断</td><td>把 informed 当成永久身份</td></tr>
              <tr><th scope="row">行动 A<sub>t</sub></th><td>方向、规模、时机、场所、主动/被动和是否交易</td><td>完整消息数据中可部分观察</td><td>只观察成交，忽略撤单、限价单和不交易</td></tr>
              <tr><th scope="row">流量与价格</th><td>由多主体行动聚合出的成交、订单事件、报价和后续路径</td><td>取决于数据覆盖与签名精度</td><td>把 OFI、markout 或涨跌直接当成私人信息</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “共同价值”不是声称资产存在一个永恒、可精确读取的内在价值，而是为给定预测期限固定一个所有人最终共同面对的随机结果。若交易只来自不同税率、风险承受、持有期限或消费偏好，双方的私人持有价值不同，即使成交也未必产生经典共同价值逆向选择。后面的每个概率都必须相对于一个明确的 V、期限和信息集定义。<Cite n={2} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="informed-not-insider">
        <p className="section-kicker">02 · Informed ≠ 违法内幕</p>
        <h2>“知情交易者”是相对信息优势的经济学角色；“违法内幕交易”是依司法辖区、信息性质、义务与行为判断的法律结论。</h2>
        <p>
          在市场微观结构模型里，只要某主体相对于当前报价者拥有能改善相关期限内条件预测的信息，他就在那一刻扮演 informed trader。优势可以来自更深入的公开数据研究、更快解析刚发布的公告、跨资产领先信号、专有订单流预测，也可能来自重大非公开信息。它可以只持续几毫秒，也可以持续数月；同一家算法还可能在一笔订单中提供流动性，在下一笔中索取流动性。经济模型关心的是信息集和行动的条件相关性，不先给主体贴道德或法律标签。
        </p>
        <p>
          以美国为例，内幕交易执法涉及重大非公开信息、信义或信赖义务、交易时的知悉以及规则规定的抗辩等具体要素；其他司法辖区并不必然相同。本节不能据成交、盈利、PIN 或 markout 判断违法行为，也不构成法律意见。准确的语言是“相对于报价者具有信息优势”或“模型隐含的知情流量”，而不是“已确认内幕盘”。<Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="asymmetry-vs-disagreement">
        <p className="section-kicker">03 · 信息不对称 ≠ 信念分歧</p>
        <h2>参与者看到不同信息，与参与者看到相同信息却使用不同模型，是两条不同的交易生成机制。</h2>
        <p>
          Information asymmetry 指交易前的信息集或信号精度不同：甲看到了会改变 V 分布的信号，乙没有。Heterogeneous beliefs 则允许双方拥有相同事实，却因为先验、模型、期限或解释不同而形成不同预期。经典 adverse-selection 报价依赖前者，因为对手是否成交会透露其私有信号；单纯分歧也能产生交易量和价格压力，却不必意味着一方从另一方的选择中学习到未见信息。
        </p>
        <p>
          二者在现实里可以叠加。公开财报发布后，所有人都看见数字，但一部分投资者拥有更好的行业模型；此时“原始事实公开”不等于“有效信息完全对称”。反过来，若双方只是效用或风险暴露不同，成交甚至可能完全不更新共同价值。无交易定理与信息生产悖论提醒我们：交易能否发生、价格能否完全揭示信息，还取决于噪声需求、信息成本、共同知识和可接受的投机条件。<Cite n={3} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="selection-timeline">
        <p className="section-kicker">04 · 选择发生的时间线</p>
        <h2>逆向选择的关键不是“有人更聪明”，而是报价先承诺、信息占优者后选择是否执行。</h2>
        <div className="mechanism-chain" aria-label="逆向选择的五步时间线">
          {[
            ['报价先出现', '被动方在尚不知道下一位对手类型时承诺 bid 与 ask'],
            ['对手观察信息', '交易者根据现金需求、约束或信号形成条件价值'],
            ['对手选择行动', '方向、数量、时间、场所和是否成交被内生决定'],
            ['成交筛选样本', 'ask 更容易在高价值状态被击中，bid 更容易在低价值状态被击中'],
            ['报价者重新学习', '成交方向改变后验价值，下一轮报价随之调整'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          Copeland–Galai 把限价报价直观地理解为向更有信息的对手写出选择权：对手只会在行权对自己有利时接受。Glosten–Milgrom 则把同一选择过程放进逐笔到达和 Bayes 更新中。若对手的信息完全不影响其是否买卖，即 P(B|H)=P(B|L)，成交样本就没有这种状态筛选；仅有信息差但无人据此选择交易，也不会自动形成信息型价差。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="symmetric-benchmark">
        <p className="section-kicker">05 · 无信息基准</p>
        <h2>先建立一个方向与价值独立的世界，才能看见价差究竟由哪一步生成。</h2>
        <p>
          令 H/L 表示高/低价值状态，B/S 表示主动买/主动卖事件。设共同价值 V 以相同概率取 99 或 101，所有交易者都因流动性需求而等概率买卖。于是 P(B|H)=P(B|L)=1/2，买单的似然比为 1；观察买单后，高状态概率仍为 1/2，条件价值仍是 100。若报价者风险中性、竞争充分，同时没有库存惩罚、处理成本、tick 和市场势力，则 ask=bid=100。
        </p>
        <div className="equation-card">
          <span>方向无信息的反事实</span>
          <div>P(H|B)=P(H)=1/2　；　E[V|B]=E[V|S]=E[V]=100</div>
          <p>买或卖只有在两个状态下的发生概率不同，才会改变后验。方向不是天然利多或利空；它的含义来自生成方向的策略。</p>
        </div>
        <p>
          这个基准故意拿掉现实中的其他价差来源，因此不是说真实零信息市场必然零价差。它的用途是隔离机制：接下来只加入“部分到达者根据状态选择方向”，便可以在不借助库存风险的情况下生成正价差。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="gm-ingredients">
        <p className="section-kicker">06 · Glosten–Milgrom 世界</p>
        <h2>四个最小元件足以把“被更知情的人挑中”变成可手算的竞争性报价。</h2>
        <div className="market-stack">
          <article><span>VALUE</span><b>二状态共同价值</b><p>V∈{'{'}v<sub>L</sub>,v<sub>H</sub>{'}'}，成交时尚未公开，但最终对双方相同。</p></article>
          <article><span>TYPE</span><b>知情与非知情到达</b><p>以概率 π<sub>I</sub> 到达完美知情者，其余是方向与状态独立的流动性交易者。</p></article>
          <article><span>ACTION</span><b>单位买或单位卖</b><p>知情者高状态买、低状态卖；非知情者等概率选择方向。</p></article>
          <article><span>QUOTE</span><b>竞争性条件零利润</b><p>风险中性报价者以成交方向为条件，使 ask 和 bid 等于条件共同价值。</p></article>
        </div>
        <p>
          这里的 liquidity/noise trader 不是“愚蠢资金”，而是因为现金、对冲、再平衡或模型外效用而交易，其方向在这个简化环境中与 V 独立。单位交易、单一报价者、完美信号和外生类型让推导透明，却省略了规模选择、拆单、限价单、库存、处理成本、延迟、订单簿和跨场所路由。结论应读作机制基准，而不是现实市场的完整生成器。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="bayes-direction">
        <p className="section-kicker">07 · 方向怎样进入 Bayes</p>
        <h2>报价者不是因为“买单看起来强”而上调价值，而是因为高状态比低状态更容易生成买单。</h2>
        <p>
          令 H 表示 V=v<sub>H</sub>，L 表示 V=v<sub>L</sub>，B 表示主动买事件。Prior（先验）是观察成交前的 P(H)；likelihood（似然）是某状态生成买单的 P(B|H) 或 P(B|L)；posterior（后验）是买单发生后的 P(H|B)。Bayes 定理把三者连接为：
        </p>
        <div className="equation-card">
          <span>买单后的状态后验</span>
          <div>P(H|B)=P(B|H)P(H) / [P(B|H)P(H)+P(B|L)P(L)]</div>
          <p>分子是“高状态且出现买单”的联合概率；分母是买单可以由高、低两种状态生成的总概率。只有似然比 P(B|H)/P(B|L) 大于 1，买单才提高高状态后验。</p>
        </div>
        <p>
          在等先验、完美信号的教学特例中，P(B|H)=(1+π<sub>I</sub>)/2，P(B|L)=(1−π<sub>I</sub>)/2，因此 P(H|B)=(1+π<sub>I</sub>)/2；卖单后的高状态后验则是 (1−π<sub>I</sub>)/2。这一对称简化来自特定到达规则，不能外推为“任意市场买单都按固定比例提升价值”。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="conditional-quotes">
        <p className="section-kicker">08 · 条件零利润报价</p>
        <h2>竞争性 ask 是“买单已经到达”后的价值；竞争性 bid 是“卖单已经到达”后的价值。</h2>
        <div className="equation-card">
          <span>风险中性竞争报价</span>
          <div>a=E[V|B]　；　b=E[V|S]</div>
          <p>报价必须在成交事件上条件化。ask 若低于 E[V|B]，报价者在被买走的样本中平均卖便宜；bid 若高于 E[V|S]，则在被卖给自己的样本中平均买贵。</p>
        </div>
        <p>
          对一般高状态先验 π<sub>H</sub>=P(H)，完美知情到达概率为 π<sub>I</sub> 时，P(B|H)=(1+π<sub>I</sub>)/2，P(B|L)=(1−π<sub>I</sub>)/2。把这两个似然代入上一节 Bayes 公式，再用 E[V|B]=v<sub>L</sub>+(v<sub>H</sub>−v<sub>L</sub>)P(H|B)，即可得到 ask；bid 用卖单似然反向计算。报价不是给无条件均值任意加减半个 spread，而是两种不同成交条件下的后验均值。<Cite n={2} />
        </p>
        <aside className="precision-note">
          <span>“零利润”没有说什么</span>
          <p>它没有说现实做市商没有资本成本、库存目标或市场势力，也没有说每一笔成交都盈亏为零。它只说明在这个竞争基准的指定成交混合上，没有报价者能长期以更差条件留在市场。</p>
        </aside>
      </section>

      <section className="lesson-section" id="gm-ledger">
        <p className="section-kicker">09 · 完整手算账本</p>
        <h2>同一个正价差，一侧记录知情交易损失，另一侧记录流动性交易收益；竞争把两者的条件平均压到零。</h2>
        <p>
          取 V∈{'{'}99,101{'}'}、等先验、π<sub>I</sub>=0.20。买单似然为 P(B|H)=0.60、P(B|L)=0.40，所以买单后高状态后验为 0.60，ask=100.20；卖单后后验为 0.40，bid=99.80，spread=0.40。在这个对称特例中，spread=π<sub>I</sub>(v<sub>H</sub>−v<sub>L</sub>)。<Cite n={2} />
        </p>
        <div className="table-scroll" role="region" aria-label="Glosten Milgrom 条件盈亏账本，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>以买单成交、报价者按 ask 卖出为例</caption>
            <thead><tr><th scope="col">买单来源</th><th scope="col">买单样本权重</th><th scope="col">条件价值</th><th scope="col">报价者利润 a−V</th><th scope="col">加权贡献</th></tr></thead>
            <tbody>
              <tr><th scope="row">知情买单</th><td>20%</td><td>101</td><td>−0.80</td><td>−0.16</td></tr>
              <tr><th scope="row">非知情买单</th><td>80%</td><td>平均 100</td><td>+0.20</td><td>+0.16</td></tr>
              <tr><th scope="row">条件合计</th><td>100%</td><td>100.20</td><td>—</td><td>0</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          表中的“买单样本权重”恰好等于 20%/80%，是等先验、完美信号和对称噪声下的特殊结果；换先验或信号精度后必须重算。账本揭示真正的转移：报价者在流动性需求上获得补偿，用来承担被知情者挑中的损失。Copeland–Galai 的静态报价直觉与 Glosten–Milgrom 的动态条件报价都指向这条交叉补贴。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="informed-share">
        <p className="section-kicker">10 · 知情到达概率</p>
        <h2>知情流量越常到达，成交方向越能区分状态；信息型价差扩大，是似然变化的结果而不是风险厌恶的结果。</h2>
        <p>
          在其他条件固定时，提高 π<sub>I</sub> 会提高 P(B|H)、降低 P(B|L)，使买单似然比变大；卖单的相反似然也更极端。因此 ask 向 v<sub>H</sub> 靠近、bid 向 v<sub>L</sub> 靠近。对称完美信号特例给出 spread=π<sub>I</sub>(v<sub>H</sub>−v<sub>L</sub>)：共同价值范围不变，价差仍可因对手构成变化而线性扩大。
        </p>
        <p>
          但 π<sub>I</sub> 是模型里的到达概率，不是屏幕上可见的“知情标签”。真实市场里，参与者会在看到报价、深度和事件状态后选择是否到达，非知情流量也会在特定时段集中；估计到的比例因此同时受信息生产、交易机会、路由和模型错设影响。比较静态说明方向，不提供无假设的计量方法。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="signal-precision">
        <p className="section-kicker">11 · 信号精度</p>
        <h2>“知情者更多”与“信号更准确”都能增强方向信息，但它们改变的是不同的生成参数。</h2>
        <p>
          允许知情信号只以概率 κ 正确，并假设知情者按信号方向交易。把信号标签定义为至少不劣于随机猜测，即 κ∈[1/2,1]；若原始信号 κ&lt;1/2，理性交易者会反转标签，使有效正确率变为 1−κ。等先验、非知情者等概率买卖时：
        </p>
        <div className="equation-card">
          <span>不完美信号的教学特例</span>
          <div>P(B|H)=π<sub>I</sub>κ+(1−π<sub>I</sub>)/2<br />P(B|L)=π<sub>I</sub>(1−κ)+(1−π<sub>I</sub>)/2<br />a−b=π<sub>I</sub>(2κ−1)(v<sub>H</sub>−v<sub>L</sub>)</div>
          <p>πᴵ 决定有多少到达者使用信号，κ 决定信号方向与真实状态多一致。κ=1/2 时信号毫无诊断力；κ&gt;1/2 时 ask≥bid。若不反转一个 κ&lt;1/2 的标签，公式会给出 ask&lt;bid，说明行动规则与“高信号就买”的命名自相矛盾。</p>
        </div>
        <p>
          取 V∈{'{'}90,110{'}'}、π<sub>I</sub>=0.25、κ=0.80，则 P(B|H)=0.575、P(B|L)=0.425。由于两者和为 1，等先验下 P(H|B)=0.575，ask=101.50；bid=98.50，spread=3。若误把 κ=0.8 当成完美信号，就会高估报价分离。现实中信号还会有连续强度、相关误差和过期速度，这个公式只是最小比较静态。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="noise-camouflage">
        <p className="section-kicker">12 · 噪声流与伪装</p>
        <h2>非信息流量不是可以删掉的“脏数据”；它让订单方向无法完全揭示信号，也让知情交易的信息租金得以存在。</h2>
        <p>
          如果每一笔买单都只可能来自高状态知情者，第一笔买单就会完全揭示 V=v<sub>H</sub>，ask 立即跳到 v<sub>H</sub>，后续知情者不再有低价买入机会。非知情流量把相同方向的行动混入多个状态，使策略形成 pooling（不同类型选择相同可观察行动）。知情者因此可以 camouflage，也就是隐藏在流动性需求中；报价者只能进行概率更新而非身份识别。<Cite n={4} /><Cite n={7} />
        </p>
        <p>
          这也是信息效率不可能免费的原因之一。若价格无需任何噪声或交易就完全反映昂贵信息，生产信息的人无法获得回报，信息生产本身会消失。<Cite n={4} />现实中的再平衡、现金需求、风险转移和指数调整虽然在终值模型里被称为 noise，却有真实经济目的；在价差模型中，它们提供知情者的掩护，并通过与报价者成交承担交叉补贴的一部分。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="zero-profit">
        <p className="section-kicker">13 · 零利润与正价差</p>
        <h2>竞争消灭的是可预见的平均超额利润，不是不同对手类型之间的实现盈亏，也不是信息本身造成的条件差异。</h2>
        <p>
          对 ask 一侧，竞争性条件写作 E[a−V|B]=0；对 bid 一侧写作 E[V−b|S]=0。报价者事前不知道下一位对手属于哪类，因此只能选择使整个成交混合平均为零的价格。成交后，他仍会在知情买单上卖便宜、在知情卖单上买贵，并在与非知情者成交时取得补偿。零利润是分布约束，不是逐笔保险。
        </p>
        <p>
          若竞争者把 ask 压到 E[V|B] 以下，他吸引来的恰是条件价值更高的买单样本，平均亏损；若把 ask 抬得更高，则可能被更低报价取代。于是正 spread 并不要求报价者风险厌恶或拥有市场势力。它可以纯粹来自“被成交”改变了价值分布。现实总 spread 还包含订单处理、tick、库存、资本与租金，本节只隔离信息通道。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="common-value">
        <p className="section-kicker">14 · Common Value 与 Winner’s Curse</p>
        <h2>只有当对手的选择会透露一个双方共同面对的价值时，“赢得成交”本身才会成为坏消息。</h2>
        <p>
          在 common-value 环境里，成交后双方最终面对同一个 V。你愿意以 100 卖出并成功成交，可能意味着对方知道 V 更可能是 101；因此“成功卖出”反而说明价格对你不利，这就是 winner’s curse。私人价值环境不同：同一张票对需要对冲的人可能值 101，对需要释放资本的人只值 99，交易能创造双方效用，却未必包含谁对共同终值判断更准。
        </p>
        <p>
          现实资产往往兼有两者。股票有共同未来现金流，也有投资者特定的税收、风险预算、融资约束和组合价值。研究者若把所有成交后的价格修订都归为共同价值信息，会把风险转移需求误写成逆向选择；若完全忽略共同价值，又无法解释为何被动成交后价格系统性朝主动方有利方向移动。无交易与投机定理的成立条件同样依赖偏好、信息、共同知识和可接受交易规则。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="size-sequence">
        <p className="section-kicker">15 · 规模、序列与沉默</p>
        <h2>方向只是行动的一维；数量、连续同向事件、等待时间和“没有交易”都可能改变状态似然。</h2>
        <p>
          Easley–O’Hara 的规模模型说明，在其均衡设定里，知情者可能更偏好大额交易，报价者因而按数量 Q 调整条件价格；但一旦允许拆单、限价单和路由，“大单必知情”就不成立。Stealth-trading 证据甚至显示，知情者可能把需求拆成不显眼的中等规模成交。规模的信息含量来自不同状态和类型选择该规模的相对概率，而不是数量本身携带固定毒性。<Cite n={5} /><Cite n={21} />
        </p>
        <p>
          序列可以用赔率递推：若 O=P(H)/P(L)，新事件使 O 乘以该事件的高低状态似然比，最后用 P(H)=O/(1+O) 还原概率。π<sub>I</sub>=0.20、完美信号时，每个买单把赔率乘以 0.60/0.40=1.5；等先验的初始赔率为 1，连续三笔买单后变为 1.5³=3.375，因此 P(H|B,B,B)=3.375/(1+3.375)≈0.7714，V∈{'{'}99,101{'}'} 时条件均值约 100.5429。但若连续买单只是同一 metaorder 的可预测 child orders，不能把每笔都当成独立新信号。无成交同样可能有信息：若高低状态的到达强度不同，等待本身会更新后验；更新方向取决于模型，绝不是“沉默总是坏消息”。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="trade-surprise">
        <p className="section-kicker">16 · 可预测流量与交易意外</p>
        <h2>价格应当主要响应订单流中超出历史可预测部分的创新，而不是机械地把每笔同向成交重复当作新信息。</h2>
        <p>
          令 D<sub>t</sub> 为买 +1、卖 −1，历史信息为 ℐ<sub>t−1</sub>。Trade-sign innovation 可写为 η<sub>t</sub>=D<sub>t</sub>−E[D<sub>t</sub>|ℐ<sub>t−1</sub>]。若过去十笔买单使下一笔买单概率已达 80%，则 E[D<sub>t</sub>|ℐ<sub>t−1</sub>]=0.8×1+0.2×(−1)=0.6；实际出现买单只包含 1−0.6=+0.4 的方向意外，出现卖单则包含 −1−0.6=−1.6 的强烈意外。把原始符号与创新分开，才能避免将拆单产生的可预测持续性全部重复记入信息修订。
        </p>
        <div className="equation-card">
          <span>Madhavan–Richardson–Roomans（MRR）的最小动态语言</span>
          <div>V<sup>e</sup><sub>t</sub>=V<sup>e</sup><sub>t−1</sub>+θ[D<sub>t</sub>−E(D<sub>t</sub>|D<sub>t−1</sub>)]+ε<sub>public,t</sub><br />p<sub>t</sub>=V<sup>e</sup><sub>t</sub>+φD<sub>t</sub>+ξ<sub>micro,t</sub></div>
          <p>Vᵉ 是模型中的潜在有效价值，θ 是方向创新对应的价值修订，ε_public 是公共信息创新；φ 是当期流动性成本，ξ_micro 是短暂微观结构误差。它们与下一节 Kyle 的噪声订单 u 不是同一对象；整套分解仍依赖一阶预测、固定规模和噪声结构。</p>
        </div>
        <p>
          Hasbrouck 用交易与报价的动态系统估计不可预测成交创新对未来报价的累计响应；Madhavan–Richardson–Roomans 则把方向创新、公共信息与流动性摩擦放在同一逐笔框架里。它们比原始买后 markout 更接近信息学习，却仍受滞后、变量覆盖、交易签名、遗漏场所和结构排序影响。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="learning-feedback">
        <p className="section-kicker">17 · 学习—策略反馈</p>
        <h2>订单流不是外生药量：报价者从流量学习，知情者又根据学习速度改变自己的流量。</h2>
        <p>
          一笔买单提高报价者的高状态后验，ask 随之上移；这减少了继续买入的信息租金。知情者因此在“迅速交易以免信号过期”与“慢慢交易以免价格过快追上”之间权衡。流动性交易者也会选择更厚、更便宜或更活跃的时段；他们的集中反过来提供 camouflage，吸引知情者进入。订单—报价—参与者构成于是形成双向系统，而非固定 π<sub>I</sub> 下的单向 Bayes 机器。<Cite n={6} /><Cite n={20} />
        </p>
        <p>
          这条反馈解释了为什么经验代理可能反直觉：知情者最活跃时，价差或 markout 未必最高，因为他们会选择深度更好、流量更厚的时段，使用限价单或降低参与率。Schedule 13D 建仓证据发现，一些常用 illiquidity 与 adverse-selection 指标在知情投资者交易日反而下降，表明交易方式的内生选择可以遮蔽潜在信息优势。<Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="kyle-strategy">
        <p className="section-kicker">18 · Kyle 的战略隐藏</p>
        <h2>当知情者可以选择连续数量，他不会简单地“知道高就全仓买入”，而会把信号强度与暴露成本一起放进最优订单。</h2>
        <p>
          单期线性—正态 Kyle 模型令 p<sub>0</sub>=E[V] 表示成交前共同价值均值，知情订单 x=β(V−p<sub>0</sub>)；噪声订单 u 与信号独立，做市商只看见总流量 y=x+u，并给出条件期望价格 P=p<sub>0</sub>+λ<sub>K</sub>y。知情者的订单越大，越能利用价值差，却也使总流量更明显地暴露信号、推动成交价格向 V 靠近。β 是这项权衡后的策略斜率，不是固定参与率。<Cite n={7} />
        </p>
        <div className="equation-card">
          <span>Kyle 的最小接口</span>
          <div>x=β(V−p<sub>0</sub>)　；　y=x+u　；　P=E[V|y]=p<sub>0</sub>+λ<sub>K</sub>y</div>
          <p>报价者看不到 x 和 u 的分解，只从聚合流量 y 推断 V。噪声流越能掩护信号，知情者越可能交易；多期模型中信息因此逐步进入价格。</p>
        </div>
        <p>
          Kyle 与 Glosten–Milgrom回答同一核心问题的不同版本：前者让数量和战略强度内生，后者用离散方向展示逐笔后验。二者都不允许研究者从单笔订单直接读取交易者身份，也都不是现实订单簿、延迟与路由的完整模型。
        </p>
      </section>

      <section className="lesson-section" id="kyle-lambda">
        <p className="section-kicker">19 · Kyle λ 的边界</p>
        <h2>λ<sub>K</sub> 是特定均衡中总订单流创新对应的价格更新斜率，不是知情交易概率，也不是个人订单的纯因果冲击。</h2>
        <p>
          在线性—正态单期特例里，λ<sub>K</sub> 由价值不确定性与噪声流容量共同决定；经典解可写为 λ<sub>K</sub>=σ<sub>V</sub>/(2σ<sub>u</sub>)。价值不确定性越大、可伪装的噪声流越少，同样总流量越有诊断力，价格更新越陡。这个 λ 同时反映信息结构、知情者最优 β 和做市商推断，不是静态订单簿“每股走几档”的机械参数。<Cite n={7} />
        </p>
        <p>
          经验回归里，订单流—收益斜率还会混入流动性状态、同期公共新闻、遗漏场所和交易选择；Hasbrouck 的累计响应又依赖动态系统与创新识别。因而把估计斜率命名为 inverse depth 可以用于描述，把它直接写成“知情比例”“违法概率”或某个人 metaorder 的 causal impact 则跨越了估计对象。这里仅把 λ 作为 1.09 的接口，不重新展开执行冲击模型。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-separation">
        <p className="section-kicker">20 · Adverse Selection ≠ Inventory Risk</p>
        <h2>前者问“与我成交的人为什么选择此刻成交”，后者问“成交后我自己的仓位暴露变成了什么”。</h2>
        <div className="table-scroll" role="region" aria-label="逆向选择与库存风险比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>两条报价路径可以同时出现，但状态变量和反事实不同</caption>
            <thead><tr><th scope="col">机制</th><th scope="col">核心状态变量</th><th scope="col">首先改变什么</th><th scope="col">干净隔离基准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Adverse selection</th><td>对手类型、信号与条件共同价值</td><td>成交后 posterior，进而改变 bid/ask 中心和间隔</td><td>令库存惩罚 q<sub>inv</sub> 为零，仍可有正 spread</td></tr>
              <tr><th scope="row">Inventory risk</th><td>自身仓位 q<sub>inv</sub>、风险厌恶、波动与融资</td><td>为控制继续累积同向仓位而偏移报价</td><td>令对手方向与 V 独立，仍可因仓位偏离调价</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          被主动买单击中后，报价者一方面可能上调共同价值后验，另一方面也因卖出而库存减少。前者通常推动 bid 与 ask 的估值中心同向上移；后者可能通过不对称调整鼓励买入、抑制继续卖出。只看成交后报价变化，很难把两者分开。Glosten–Harris 和 Huang–Stoll 等结构分解正是通过交易符号、规模、相邻反转和特定价格过程来识别这些成分；结果是模型输出，不是原始数据中的会计栏目。<Cite n={8} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="public-news-latency">
        <p className="section-kicker">21 · 公共新闻、Stale Quote 与速度优势</p>
        <h2>信息已经公开，不等于每个报价者已经同时接收、解释并撤掉旧报价；短暂时间差也会制造经济上的选择性损失。</h2>
        <p>
          Stale quote 是新信息出现后尚未更新的旧报价。若宏观数据在 10:00:00.000 发布，算法 A 在 200 微秒内判断应涨并击中旧 ask，而报价者 B 在 600 微秒后才撤单，那么 A 的信息来源是公共的，B 却仍被更快的对手选择性成交。对 B 而言，这笔 flow 具有 toxicity：在被动成交条件下，未来参考价更可能朝主动方有利方向移动。它说明 informed 是相对信息集和时钟的角色，而不是只指长期私人基本面研究。
        </p>
        <p>
          HFT 证据也显示角色随订单变化：主动 HFT 成交与永久价格变化和公开宏观新闻相关，被动 HFT 同时会承受 adverse selection。因而“HFT 固定是知情者”与“HFT 固定是做市商”都不准确。公开新闻上的速度优势与基于重大非公开信息的交易在经济学上都可让旧报价被挑中，却不是相同法律问题；法律判断仍需独立证据和司法辖区规则。<Cite n={23} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="participation-feedback">
        <p className="section-kicker">22 · 参与者构成反馈</p>
        <h2>信息风险上升会改变报价，报价变化又会筛选下一轮参与者；局部逆向选择可能因此变成流动性状态反馈。</h2>
        <div className="mechanism-chain" aria-label="信息风险与流动性参与反馈">
          {[
            ['条件损失上升', '事件窗口、单边流量或速度差使被动成交更不利'],
            ['供给者防御', '扩大价差、减少 displayed depth、缩短 quote lifetime 或撤单'],
            ['交易成本上升', '对价格敏感的流动性需求延后、换场所或放弃成交'],
            ['样本构成改变', '剩余立即成交者中，信息敏感或时间敏感流量占比可能更高'],
            ['后验进一步恶化', '按主动方方向取正的成交后损失上升，促使供给继续收缩'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这是一条可能的正反馈，不是所有 Glosten–Milgrom 参数下都会自动爆发的定理。更宽的报价也可能吸引新的风险资本，公共信息一旦被消化，条件不确定性会下降；交易者还会转向被动单或其他场所。Flow-toxicity 指标试图捕捉这类状态，但任何指标都必须与成交量、波动、分类方法和报价反应共同验证。VPIN 文献及其争论尤其说明，经济直觉与可靠预警能力是两个不同命题。<Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="directional-asymmetry">
        <p className="section-kicker">23 · 买卖两侧不必对称</p>
        <h2>等先验、对称信号与等概率流动性方向只是教学特例；改变任何一项，ask 与 bid 都可能以不同幅度更新。</h2>
        <p>
          取 V∈{'{'}80,120{'}'}、P(H)=0.30、π<sub>I</sub>=0.20、完美信号。P(B|H)=0.60、P(B|L)=0.40，所以 P(H|B)=0.18/(0.18+0.28)≈0.3913，ask≈95.65。卖单下 P(S|H)=0.40、P(S|L)=0.60，P(H|S)=0.12/(0.12+0.42)≈0.2222，bid≈88.89。交易前均值是 92；ask 上移约 3.65，bid 下移约 3.11，价差不再围绕先验均值完全对称。
        </p>
        <p>
          坏消息到达频率、卖空约束、非知情买卖需求、状态价值间距与知情者交易倾向都能制造侧向不对称。无成交也可能在某些结构中偏向坏消息，因为受约束的知情卖方无法表达信号；在另一些结构中，沉默则说明没有信息事件。正确问题始终是“高低状态分别如何生成这个事件”，而不是给买卖方向预先指定固定含义。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="impact-separation">
        <p className="section-kicker">24 · 信息学习 ≠ 机械 Impact</p>
        <h2>成交后价格朝主动方向移动，既可能因为市场从订单学习，也可能因为订单消耗深度、公共新闻到达或其他流量继续同向。</h2>
        <p>
          信息通道改变的是条件共同价值 E[V|A<sub>t</sub>]；机械通道改变的是当下可执行订单簿、队列和风险承载。指数基金没有私人信号，也能用大额市价单扫过多档；知情投资者可以使用被动限价单缓慢建仓，短期机械足迹反而很小。持续变化也不等于信息，短期反转也不等于纯机械：相关 metaorders、库存回补、公共新闻和流动性恢复会共同塑造期限路径。
        </p>
        <p>
          Glosten–Harris 把持久价值修订与暂时交易成本放进特定价格方程，Hasbrouck 用交易创新的累计动态响应描述信息含量，MRR 将方向创新、公共信息和流动性成本分层。三者都比“买后涨就是知情”更严格，但三种 information component 的 estimand 并不相同，也都依赖交易签名、状态过程和模型限制。<Cite n={8} /><Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="proxy-map">
        <p className="section-kicker">25 · 从潜在风险到可观察代理</p>
        <h2>研究者看不到交易者的完整信号，通常只能用有限期限 markout、价差恒等式和报价反应观察逆向选择的投影。</h2>
        <p>
          令 D<sub>t</sub>=+1 表示主动买、−1 表示主动卖，成交前 mid 为 m<sub>t</sub>，成交价为 p<sub>t</sub>，未来 h 的 mid 为 m<sub>t+h</sub>。常用 full-spread 口径为：
        </p>
        <div className="equation-card">
          <span>描述性价差—markout 恒等式</span>
          <div>ES<sub>t</sub>=2D<sub>t</sub>(p<sub>t</sub>−m<sub>t</sub>)<br />PI<sub>t,h</sub>=2D<sub>t</sub>(m<sub>t+h</sub>−m<sub>t</sub>)<br />RS<sub>t,h</sub>=2D<sub>t</sub>(p<sub>t</sub>−m<sub>t+h</sub>)<br />ES<sub>t</sub>=PI<sub>t,h</sub>+RS<sub>t,h</sub></div>
          <p>ES 是有效价差，PI 是该期限的有符号 mid 变化，RS 是有限期实现价差。恒等式是代数；把 PI 全称为信息、把 RS 全称为做市利润则需要额外结构假设。</p>
        </div>
        <p>
          另一个代理是主动方 markout、等价地说被动方 adverse-selection loss：L<sup>AS</sup><sub>t,h</sub>=D<sub>t</sub>(m<sub>t+h</sub>−p<sub>t</sub>)。L<sup>AS</sup>&gt;0 时，主动方相对未来 mid 占优，被动方在该基准上受损；若要写“maker 盈亏”则必须反号。未来 mid 还包含公共新闻、机械影响、其他场所和后续流量。报价 add/cancel、depth 恢复、成交后的两侧调整也能补充证据；成交方向本身还需从报价与价格推断，Lee–Ready 类型规则存在时间戳和分类误差。<Cite n={8} /><Cite n={10} /><Cite n={11} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="horizons-clocks">
        <p className="section-kicker">26 · 期限与时钟</p>
        <h2>同一笔成交在 1 毫秒、1 秒、5 分钟和收盘时的 markout 回答不同问题；更长不等于更接近无误真值。</h2>
        <p>
          极短期限更接近报价延迟、队列消耗和近端补单，却容易受 bid–ask bounce 与时间戳误差影响；秒级可覆盖高频反应与同一 child-order 序列；分钟级混入公共新闻、相关市场和库存调整；更长期还会叠加基本面与其他投资者订单。Calendar time 固定自然时间，event time 固定消息数，volume time 固定累计成交量；三者在开盘、午间和危机状态下对应完全不同的信息集。
        </p>
        <p>
          因此代理应画成多期限曲线，而不是挑一个最显著 h 命名为“永久信息”。预注册事件起点、quote 对齐、跨场所参考价、公告排除窗和方向签名规则，再报告 h 的敏感性；否则期限本身会变成事后选择。Hasbrouck 与 MRR 的动态估计之所以重要，正是因为它们把滞后和可预测流量显式纳入，但最终响应仍属于选定系统。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="identification-ladder">
        <p className="section-kicker">27 · 识别阶梯</p>
        <h2>“看见条件损失”“用模型分解信息成分”与“识别私人信息的因果贡献”是三个证据等级。</h2>
        <div className="table-scroll" role="region" aria-label="逆向选择识别等级，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每上一层，都需要新的可辨识限制</caption>
            <thead><tr><th scope="col">证据层</th><th scope="col">典型输出</th><th scope="col">能支持什么</th><th scope="col">仍不能支持什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">描述代理</th><td>signed markout、RS、quote revision、cancel response</td><td>某类被动成交在给定期限更不利</td><td>对手身份、私人信息纯贡献</td></tr>
              <tr><th scope="row">Reduced form</th><td>状态控制、面板回归、样本外条件预测</td><td>哪些可观测状态与条件损失稳定相关</td><td>未观测选择和同因冲击已消除</td></tr>
              <tr><th scope="row">结构模型</th><td>Glosten–Harris、MRR、Huang–Stoll、PIN 参数</td><td>在生成模型成立时分解潜在成分</td><td>模型错设下仍是真实账本</td></tr>
              <tr><th scope="row">准实验/随机化</th><td>公告、规则、路由或延迟变化的局部效应</td><td>在排除限制下识别局部因果链</td><td>自动外推到所有资产与状态</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Latent variable 是无法直接观察、必须通过模型与数据关系推断的对象；structural model 明确写出类型、信号、到达和定价过程；identification 则回答为何可观察分布足以把目标参数与替代机制区分。更多方程不自动产生识别：Glosten–Harris、Hasbrouck、MRR 与 Huang–Stoll 对“信息成分”的定义和限制各不相同，估计数字不能横向当作同一真值。<Cite n={8} /><Cite n={9} /><Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="pin-model">
        <p className="section-kicker">28 · PIN 的生成模型</p>
        <h2>PIN 不是先数出知情成交再除以总成交，而是用日度买卖笔数拟合一个带潜在信息事件的 Poisson 混合。</h2>
        <p>
          Poisson intensity 是模型中单位时间的平均到达速度。设一天以概率 α<sub>event</sub> 发生信息事件；发生后以概率 δ 是坏消息，否则是好消息。非知情买卖强度分别为 ε<sub>B</sub>、ε<sub>S</sub>，知情流量强度为 μ<sub>I</sub>：好消息日把 μ<sub>I</sub> 加到买侧，坏消息日加到卖侧，无信息日两侧只有 ε。对每日买卖笔数 B<sub>d</sub>、S<sub>d</sub>，似然是三种潜在日状态的加权和。<Cite n={12} />
        </p>
        <div className="equation-card">
          <span>PIN 的日状态混合与最终 estimand</span>
          <div>L<sub>d</sub>=(1−α<sub>event</sub>)L<sub>0</sub>+α<sub>event</sub>(1−δ)L<sub>G</sub>+α<sub>event</sub>δL<sub>B</sub><br />PIN̂=α̂<sub>event</sub>μ̂<sub>I</sub> / (α̂<sub>event</sub>μ̂<sub>I</sub>+ε̂<sub>B</sub>+ε̂<sub>S</sub>)</div>
          <p>L₀、Lᴳ、Lᴮ 分别是无信息、好消息、坏消息日下买卖 Poisson 计数的联合似然。最大化整个样本的混合似然后，PIN̂ 是该模型隐含的无条件知情成交占比估计。</p>
        </div>
        <p>
          对称非知情到达 ε<sub>B</sub>=ε<sub>S</sub>=ε 时，分母写成 αμ+2ε。α 描述信息日频率，μ 描述信息日的知情到达强度，ε 描述普通流量基座；同一个 PIN 数值可以由不同参数组合产生。它既不标记某一笔成交，也不等于信息导致的收益比例，更不包含违法行为的法律要件。
        </p>
      </section>

      <section className="lesson-section" id="pin-boundaries">
        <p className="section-kicker">29 · PIN 的规格边界</p>
        <h2>PIN 把不可见类型映射到可见计数，但这条映射要求“一日事件、Poisson 到达、稳定参数和可靠签名”等强限制。</h2>
        <p>
          经典模型假设一天至多一个信息事件、知情者只在正确一侧交易、非知情到达相对稳定、买卖笔数足以代表订单、日内到达近似独立 Poisson。真实拆单会制造聚集和过度离散，开收盘季节性会改变强度，限价与撤单使未成交策略消失在计数外，窗口内参数也会随新闻和制度切换。Lee–Ready 方向分类若与 quote 时间错位，还会把测量误差写入似然。<Cite n={12} /><Cite n={19} />
        </p>
        <p>
          原始研究的“高成交量股票 PIN 更低”应读作分母中非信息流更厚，而不是知情事件绝对更少。后续允许对称订单流冲击的研究发现，原 PIN 可能混合与流动性有关的成分，资产定价结果也会随分解改变。正确陈述必须包含样本、计数构造、参数约束、初始化、收敛、多起点、非平稳与替代到达模型敏感性；“优化器收敛”不等于潜在类型已被真实识别。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="vpin-construction">
        <p className="section-kicker">30 · VPIN 的构造</p>
        <h2>VPIN 把时间改为累计成交量，用固定量桶内的买卖量失衡构造滚动统计；它不是把经典 PIN 换成高频数据重新估计。</h2>
        <p>
          Volume clock 以累计成交量而非自然分钟推进。先把交易切成总量近似固定的 volume buckets；再用逐笔签名或 bulk-volume classification 估算每桶买方量 V<sub>i</sub><sup>B</sup> 与卖方量 V<sub>i</sub><sup>S</sup>；最后在 n 个桶上平均绝对失衡并除以桶量：
        </p>
        <div className="equation-card">
          <span>VPIN 的滚动量失衡</span>
          <div>VPIN<sub>τ</sub>=(1/n)Σ<sub>i=τ−n+1</sub><sup>τ</sup>|V<sub>i</sub><sup>B</sup>−V<sub>i</sub><sup>S</sup>| / V<sub>bucket</sub></div>
          <p>量桶让活跃市场更快产生新观测；绝对值忽略方向，只保留两侧量不平衡程度。结果由分类规则、桶宽、窗口 n 和成交量共同定义。</p>
        </div>
        <p>
          Bulk-volume classification 是用聚合价格变化等规则把一段成交量概率性分配到买卖两侧，而不是观察真实交易者身份。经典 PIN 来自日度潜在事件—Poisson 到达似然；VPIN 来自 volume-time 失衡构造。名字相似不表示两者拥有同一生成模型或估计对象。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="vpin-boundaries">
        <p className="section-kicker">31 · VPIN 的解释争议</p>
        <h2>VPIN 有清晰经济动机，却不能被写成“知情比例”或“崩盘概率”；其分类、交易强度关联和增量预测能力存在实质争论。</h2>
        <p>
          原研究把高 VPIN 解释为流动性提供者面对更不平衡、更可能不利的流量状态，并用 E-mini 数据讨论 Flash Crash。Andersen–Bondarenko 指出，VPIN 与成交强度和波动可能存在机械关系，闪崩前并非历史上独特极值，结果还对成交分类、桶和起点敏感；原作者回应说目标是 flow toxicity 而非通用波动预测，volume clock 与 BVC 正是设计核心。随后反驳与扩展检验继续质疑其作为普遍预警器的稳健性。<Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} /><Cite n={18} />
        </p>
        <p>
          最稳健结论不是“VPIN 已被彻底证伪”，也不是“VPIN 能预测下一次崩盘”，而是：它是具有经济动机、参数敏感的量失衡代理。研究时应与直接成交签名、主动方 markout（即被动方 adverse-selection loss）、成交量、波动和简单 imbalance 基准做严格样本外比较，并报告不同 bucket、window、classification 和事件起点。VPIN=0.82 最多说明所选构造下近期归一化失衡较高，绝不等于 82% 知情交易或 82% 崩盘概率。
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">32 · 理论与证据地图</p>
        <h2>经典文献不是都在测量同一个“信息成分”；每一组只照亮传导链中的特定接口。</h2>
        <div className="table-scroll" role="region" aria-label="逆向选择经典证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>文献能够支持什么，以及不能被外推成什么</caption>
            <thead><tr><th scope="col">来源簇</th><th scope="col">核心贡献</th><th scope="col">不可越界的结论</th></tr></thead>
            <tbody>
              <tr><th scope="row">Copeland–Galai；Glosten–Milgrom</th><td>被挑中风险、逐笔 Bayes 与零库存正价差</td><td>现实全部 spread 都来自信息</td></tr>
              <tr><th scope="row">Grossman–Stiglitz；Kyle</th><td>信息生产激励、噪声伪装与战略数量</td><td>经验 λ 是私人信息比例或个人纯 impact</td></tr>
              <tr><th scope="row">Easley–O’Hara；Admati–Pfleiderer</th><td>规模、时间、沉默与交易时机的信号选择</td><td>大单、活跃时段或无交易拥有固定方向</td></tr>
              <tr><th scope="row">Glosten–Harris；Hasbrouck；MRR；Huang–Stoll</th><td>价差/报价响应的不同结构分解</td><td>不同论文的 information component 可直接互换</td></tr>
              <tr><th scope="row">Easley et al.；Duarte–Young</th><td>PIN 到达似然及流动性混合边界</td><td>逐笔身份或违法概率</td></tr>
              <tr><th scope="row">VPIN 论文与争议</th><td>量时钟失衡代理及分类/预测审计</td><td>校准的危机概率或已公认预警器</td></tr>
              <tr><th scope="row">13D、HFT 与跨场所研究</th><td>交易方式、角色和 venue 选择的内生性</td><td>单一代理、主体或场所代表全市场真值</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          读文献时先问 estimand，再看样本和识别。Collin-Dufresne–Fos 表明知情建仓可以伴随常见代理下降；Brogaard–Hendershott–Riordan 表明 HFT 的主动与被动角色不同；Hoffmann 表明 smart routing 会让各 venue 看到选择后的不同流量。现代证据不是推翻 Bayes 机制，而是提醒我们：参与者、行动和数据覆盖都是均衡内生的。<Cite n={22} /><Cite n={23} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先在模型内部算对后验，再练习把观测证据停在它真正能够支持的层级。</h2>
        <p>
          第一组四题从方向事件、信号精度、条件盈亏和非对称先验推导竞争报价；第二组四题隔离库存、公共公告、PIN 与 VPIN 的归因边界。每题提交前只显示事实和候选判断，作答后才揭示计算、错误诊断与机制解释。
        </p>
        <AdverseSelectionLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 非蕴含反例库</p>
        <h2>观察到“买、涨、大单、高 PIN 或高 VPIN”时，首先应寻找替代生成机制，而不是急着给交易者贴身份标签。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>大单、无私人信号</h3><p>指数基金被迫调仓并扫过订单簿，机械 impact 很大，却没有关于共同价值的私人信号。</p></article>
          <article><span>反例 02</span><h3>知情、低代理</h3><p>长期知情投资者选择深厚时段、限价单和慢速建仓，常见价差与 markout 指标反而下降。<Cite n={22} /></p></article>
          <article><span>反例 03</span><h3>买后涨、公共新闻</h3><p>预定公告紧随成交发布，跨场所同时上移；路径有正 markout，却不能证明买方提前拥有私人信息。</p></article>
          <article><span>反例 04</span><h3>零库存、正价差</h3><p>风险中性且库存惩罚为零的 Glosten–Milgrom 报价者，仍因条件价值不同而报正 spread。</p></article>
          <article><span>反例 05</span><h3>盈利、非知情</h3><p>随机买入恰逢市场上涨可以事后盈利；ex-post profit 不证明 ex-ante 信息优势。</p></article>
          <article><span>反例 06</span><h3>单场所高毒性</h3><p>Smart routing 把信息敏感流量送往某 venue，使主动方 markout、也就是被动方条件损失更高，但这不等于全市场知情比例同步上升。<Cite n={24} /></p></article>
        </div>
        <p>
          反例不是说逆向选择无法研究，而是规定了证据责任：必须解释行动如何由信息选择、为何替代机制不能生成相同观测、代理在何种期限和场所有效，以及参与者改变策略后关系是否仍成立。只有把失败条件写出来，world model 才能收缩成可证伪研究。
        </p>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 可证伪研究设计</p>
        <h2>不要把目标设为“识别每一笔真正知情交易”；先检验某个可观察状态是否稳定预测被动成交的条件损失，并逐层升级识别。</h2>
        <p>
          一个可执行的局部问题可以写成：在指定资产、场所与交易阶段，对所有被动成交，以 5 ms、1 s、1 min、5 min 的 L<sup>AS</sup>=D<sub>active</sub>(m<sub>future</sub>−p<sub>trade</sub>) 为结果——正值表示主动方 markout、也表示被动方 adverse-selection loss——再以交易方向创新、规模、成交前 spread/depth、公告距离、相关市场先动、venue、订单类型和可观察参与者类别为事前变量，检验某个 toxicity proxy 能否在严格更晚日期和未见资产中，相对于 OFI、成交量和波动基准提供稳定增量。这首先是条件预测，不冒充私人信息因果识别。
        </p>
        <div className="table-scroll" role="region" aria-label="逆向选择可证伪研究协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从变量定义到失败条件</caption>
            <thead><tr><th scope="col">模块</th><th scope="col">必须预先固定</th><th scope="col">关键失败条件</th></tr></thead>
            <tbody>
              <tr><th scope="row">Estimand</th><td>主动方 markout 或反号后的 maker 盈亏、参考价、h、平均或尾部损失</td><td>混用方向视角，或事后挑最显著期限改称信息真值</td></tr>
              <tr><th scope="row">事件账本</th><td>交易签名、quote 对齐、取消/修改、跨场所与公告时间</td><td>时间戳或 odd-lot 缺失使方向与状态系统错配</td></tr>
              <tr><th scope="row">候选机制</th><td>信息、机械、库存、公共新闻与相关流量代理</td><td>遗漏机制同时决定特征与未来 mid</td></tr>
              <tr><th scope="row">模型协议</th><td>滚动训练、日期/主体分组、参数与分类敏感性</td><td>随机打散造成未来或同一 metaorder 泄漏</td></tr>
              <tr><th scope="row">Placebo</th><td>伪方向、伪时点、公告外窗口、无成交 matched windows</td><td>placebo 获得相同“毒性”改善</td></tr>
              <tr><th scope="row">外推边界</th><td>资产、场所、制度、波动状态与预测期限</td><td>换 venue、新闻状态或参数即失效</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因果升级需要能改变信息可见性或订单选择、却不直接改变结果的外生变化，例如公告披露制度、可验证的接入延迟变化或路由规则冲击；每个设计都必须证明排除限制。参与者会响应制度，估计往往是局部均衡效应。单一 venue 的结果尤其不能直接外推全市场，因为路由会内生筛选订单。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>先独立写出似然、账本和证据边界，再展开分步答案。</h2>
        <div className="exercise-list">
          <article className="practice-problem">
            <span>练习一 · 非对称先验与不完美信号</span>
            <p><strong>题目。</strong>P(H)=0.40，V∈{'{'}80,120{'}'}，π<sub>I</sub>=0.30，κ=0.75；非知情者等概率买卖，知情者按信号方向交易。求 P(H|B)、P(H|S)、ask、bid 与 spread，并写出四个方向似然。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>P(B|H)=.30×.75+.70×.50=.575，P(B|L)=.30×.25+.70×.50=.425；相反地 P(S|H)=.425、P(S|L)=.575。P(H|B)=.575×.40/(.575×.40+.425×.60)=.23/.485≈.474227；P(H|S)=.425×.40/(.425×.40+.575×.60)=.17/.515≈.330097。a=80+40×.474227≈98.9691；b=80+40×.330097≈93.2039；spread≈5.7652。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习二 · 零利润条件账本</span>
            <p><strong>题目。</strong>V∈{'{'}99,101{'}'}、等先验、完美信号、π<sub>I</sub>=0.30。计算 ask；在已发生买单的样本中，分别算报价者对知情买单和非知情买单的平均利润，并验证条件加权为零。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>P(H|B)=.65，所以 ask=.65×101+.35×99=100.30。买单样本中知情权重为 .30、非知情权重为 .70。知情买单只在 V=101，报价者利润=100.30−101=−.70；非知情方向与状态独立，条件平均 V=100，利润=+.30；.30×(−.70)+.70×.30=0。零的是混合平均，不是每笔实现利润。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习三 · 六种机制分类</span>
            <p><strong>题目。</strong>分别审计：优质公开数据研究、重大非公开信息、公告后低延迟击中旧报价、同一公告下的模型分歧、dealer 库存超限、指数机械调仓。哪些属于信息优势、可能的法律问题、belief disagreement、inventory 或 mechanical flow？</p>
            <details className="practice-answer"><summary>展开参考答案</summary><p>公开研究可形成合法的信息优势；重大非公开信息既可能形成经济信息优势，也需按司法辖区、义务和证据独立做法律判断；公告后低延迟是公开信息上的相对速度优势，可对旧报价造成 adverse selection，但不因“快”自动违法；相同信息不同模型主要是 belief disagreement；库存超限是自身 position risk；指数调仓是可预测机械/流动性流量，能有 impact 却不必有共同价值私人信号。现实案例可同时落入多个经济标签，法律结论不能由经济标签替代。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习四 · 多期限 Markout 审计</span>
            <p><strong>题目。</strong>某主动买单后的主动方 markout（等价于被动方 adverse-selection loss）为：5 ms +1 bp、1 s +4 bp、1 min +18 bp、5 min +6 bp；成交后 20 秒有公共公告，相关期货先涨，1 分钟后本地深度恢复。逐个期限说明可能混入什么，能否把 18 bp 命名为私人信息成分？</p>
            <details className="practice-answer"><summary>展开参考答案</summary><p>5 ms 主要受 quote latency、队列和签名误差影响；1 s 加入短时订单序列与跨场所反应；1 min 已跨越公告和相关期货跳变，18 bp 同时混入共同新闻；5 min 的回落又可能含深度恢复、库存回补与新流量。没有无公告、无交易反事实和更强识别，任何一点都只是给定期限的条件 markout，不能把最大值挑为私人信息真值。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习五 · 重写 PIN / VPIN 命题</span>
            <p><strong>题目。</strong>把“PIN 高说明内幕多”和“VPIN 能预报崩盘”分别改写成可证伪研究命题，至少列出构造、假设、对照、placebo、参数敏感性与失败条件。</p>
            <details className="practice-answer"><summary>展开参考答案</summary><p>PIN 命题可改为：在预先固定的一日三状态 Poisson 混合、交易签名和滚动窗口下，PIN̂ 是否在更晚样本稳定预测主动方 markout、也就是被动方 adverse-selection loss，并相对成交量、spread 与简单 imbalance 有增量；对过度离散、季节性、拆单和替代到达模型做敏感性，伪方向或伪窗口不应复制结果。VPIN 命题可改为：在固定 BVC、bucket、window 下，VPIN 是否对预定义市场动荡结果提供样本外校准与增量预测；必须与直接签名、volume、volatility 基准比较，并报告全部参数网格。任一关系在换参数、日期或 venue 后消失，或 placebo 同样显著，都构成失败。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>答案必须包含完整因果链；只说一个术语不算掌握。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么 adverse selection 的核心是“选择成交”，而不是静态知识差？</summary><p>因为报价者的损失来自成交样本被信息占优者筛选：高价值状态更容易击中 ask、低价值状态更容易击中 bid。若信息差不改变行动似然，成交不会改变后验，也不会生成这条信息型损失。</p></details>
          <details><summary>02 · Informed trader 为什么不等于违法 insider？</summary><p>前者是相对于报价者和预测期限拥有更好条件信息的经济角色，来源可为公开研究、速度或私人数据；后者是依司法辖区、信息重大性与非公开性、义务和行为判断的法律结论。</p></details>
          <details><summary>03 · Information asymmetry 与 heterogeneous beliefs 的最小区别是什么？</summary><p>前者是信息集或信号精度不同；后者允许信息相同但先验、模型或解释不同。经典 Bayes 型逆向选择首先依赖行动透露未共享信息。</p></details>
          <details><summary>04 · 为什么库存惩罚为零后仍可能有正 spread？</summary><p>买单后的条件共同价值高于卖单后的条件共同价值；竞争性 ask=E[V|B]、bid=E[V|S]，两者因成交方向的状态似然不同而分离，无需库存风险。</p></details>
          <details><summary>05 · 买单如何通过 likelihood ratio 改变 ask？</summary><p>先将先验赔率乘以 P(B|H)/P(B|L) 得到后验赔率，再把后验高低状态概率映射为 E[V|B]。似然比若等于 1，买单不改变 ask 的共同价值部分。</p></details>
          <details><summary>06 · 竞争与零预期利润为什么不消灭信息型价差？</summary><p>零利润发生在条件成交混合上：报价者对知情成交亏损、对非知情成交获利，两者加权抵消。竞争压低平均租金，却不能让 E[V|B] 与 E[V|S] 变成相同。</p></details>
          <details><summary>07 · “买后涨”为什么不能证明知情，也不能测出纯信息 impact？</summary><p>后续涨幅还可由机械扫簿、公共新闻、其他同向流量、跨场所先动和交易选择生成；缺少无交易与无新闻反事实，也看不到交易者事前信息集。</p></details>
          <details><summary>08 · 为什么可预测 flow 与 trade-sign innovation 应区别定价？</summary><p>拆单使同向订单高度持续，下一笔预期买单已部分写进报价；真正新增的状态证据是实际方向减去历史条件预期的意外成分。</p></details>
          <details><summary>09 · PIN 的 α、μ、ε 和最终概率分别是什么；哪一项可直接观察？</summary><p>α 是潜在信息日概率，μ 是信息日知情到达强度，ε 是非知情买卖基座，PIN 是它们组合出的模型隐含成交占比。直接观察的是按规则签名的日买卖计数，参数和日状态都需由模型估计。</p></details>
          <details><summary>10 · VPIN=0.8 最多能说明什么，绝不能说明什么？</summary><p>最多说明在指定量桶、买卖量分类和滚动窗口下，近期归一化绝对量失衡较高；它不表示 80% 成交知情、80% 崩盘概率，也不自动证明增量预警能力。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节完成“成交怎样改变共同价值后验”；接下来的章节分别把信息位置、报价主体、库存状态和信念差异展开。</h2>
        <div className="interface-grid">
          <article><span>← 1.08–1.09</span><h3>Flow 与 Impact</h3><p>前两节提供交易方向、OFI、markout 与 response；本节说明只有在行动似然模型下，流量才进入共同价值后验。</p></article>
          <article><span>→ 1.11</span><h3>Price Discovery</h3><p>把单一交易环境中的后验更新扩展到期货、ETF、现货与多场所，研究信息先在哪里进入公共价格。</p></article>
          <article><span>→ 1.12–1.13</span><h3>Market Maker / Inventory</h3><p>将抽象竞争报价者换成具有收入、义务、资本、库存、排队和对冲约束的真实流动性提供者。</p></article>
          <article><span>→ 6.03</span><h3>Belief Heterogeneity</h3><p>进一步区分“看到不同信息”与“看到相同信息却形成不同信念”，并研究分歧、叙事与学习反馈。</p></article>
        </div>
        <p className="closing-thesis">面对所谓“有毒订单流”，应依次追问：共同价值和期限是什么；谁相对于谁更有信息；报价是否先于对手选择；高低状态怎样生成方向、规模、时间和场所；观察到的是 raw flow 还是 innovation；成交后路径是 markout、结构分解还是因果效应；库存、机械冲击、公共新闻和信念分歧是否已隔离；PIN 或 VPIN 的生成模型、分类、参数与样本外基准是什么。只有这些接口被固定，adverse selection 才从一句“别和聪明钱交易”变成可推导、可测量、可反驳的市场机制。</p>
      </section>
    </>
  );
}

export const lesson110: LessonRecord = {
  slug: '1-10',
  id: '1.10',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Adverse Selection 与 Informed Trading',
  subtitle: '从被选择成交的 winner’s curse 出发，用 Bayes 推导条件报价，再把战略隐藏、订单流创新、经验代理、PIN 与 VPIN 放回各自的估计对象和证据边界',
  readingTime: '约 90–95 分钟（核心阅读 57–60＋互动 13–14＋主动练习 12–13＋理解检查 8）',
  prerequisite: '1.05 · Bid–Ask Spread、1.08 · Order Flow；按需回看 1.09 的 Response ≠ Impact、MRR 与 Kyle λ',
  updatedAt: '2026-08-28',
  revision: '1.10-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.10-r1',
      summary: '要求修正 ±1 交易符号下的 innovation 数值，限定 κ 的有效域，消除高状态先验、Kyle 先验价格、MRR 有效价值与可观察 mid 的符号复用，统一主动方 markout / 被动方损失视角，并收紧 Grossman–Stiglitz 的引用边界。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.10-r1',
      summary: '要求修正 trade-sign surprise 尺度，前移 H/L/B/S 与赔率释义，并为 MRR 全称、潜在有效价值、公共信息创新和微观结构误差建立不与 Kyle 混淆的符号。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.10-r2',
      summary: '确认 r1 的五项准确性问题均已解决；要求把公告互动题中 D·(future mid−current mid) 从 signed markout 准确改称 signed mid response，因为题目未提供成交价。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.10-r2',
      summary: '39 节认知坡度、术语首见、公式白话、修正后的 innovation 与 MRR 符号、κ/markout 新增表述、8 题互动、5 道练习、10 项检查、无障碍和课程边界全部回归通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.10-r3',
      summary: 'GM、信号精度、非对称先验、序列赔率、trade-sign innovation、MRR、Kyle、spread 恒等式、PIN、VPIN、5 道练习与 8 道互动全部复算通过；25 条来源、78 个引用标记、法律边界和主动方 markout / 被动方损失视角均无 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.10-r3',
      summary: '39 节教学坡度、零背景术语、公式白话、signed mid response / markout 区分、8 题 prediction-first 互动、5 道练习、10 项检查、无障碍、90–95 分钟预算和相邻课程边界全部回归通过，未发现 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-09', label: '1.09 Price Impact：订单为什么推动价格' },
  next: { slug: '1-11', label: '1.11 Price Discovery：信息如何进入价格' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'object-map', label: '五层对象' },
    { id: 'informed-not-insider', label: 'Informed ≠ Insider' },
    { id: 'asymmetry-vs-disagreement', label: '信息不对称 ≠ 分歧' },
    { id: 'selection-timeline', label: '选择时间线' },
    { id: 'symmetric-benchmark', label: '无信息基准' },
    { id: 'gm-ingredients', label: 'GM 世界' },
    { id: 'bayes-direction', label: 'Bayes 方向更新' },
    { id: 'conditional-quotes', label: '条件报价' },
    { id: 'gm-ledger', label: '完整账本' },
    { id: 'informed-share', label: '知情到达概率' },
    { id: 'signal-precision', label: '信号精度' },
    { id: 'noise-camouflage', label: '噪声与伪装' },
    { id: 'zero-profit', label: '零利润与价差' },
    { id: 'common-value', label: 'Common Value' },
    { id: 'size-sequence', label: '规模与序列' },
    { id: 'trade-surprise', label: '交易意外' },
    { id: 'learning-feedback', label: '学习—策略反馈' },
    { id: 'kyle-strategy', label: 'Kyle 战略隐藏' },
    { id: 'kyle-lambda', label: 'Kyle λ' },
    { id: 'inventory-separation', label: 'Adverse / Inventory' },
    { id: 'public-news-latency', label: '公共新闻与延迟' },
    { id: 'participation-feedback', label: '参与者反馈' },
    { id: 'directional-asymmetry', label: '方向不对称' },
    { id: 'impact-separation', label: '信息 ≠ 机械 Impact' },
    { id: 'proxy-map', label: '可观察代理' },
    { id: 'horizons-clocks', label: '期限与时钟' },
    { id: 'identification-ladder', label: '识别阶梯' },
    { id: 'pin-model', label: 'PIN 模型' },
    { id: 'pin-boundaries', label: 'PIN 边界' },
    { id: 'vpin-construction', label: 'VPIN 构造' },
    { id: 'vpin-boundaries', label: 'VPIN 争议' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson110Content,
  references: [
    {
      id: 1,
      authors: 'Thomas E. Copeland & Dan Galai',
      year: '1983',
      title: 'Information Effects on the Bid-Ask Spread',
      publication: 'Journal of Finance, 38(5), 1457–1469',
      url: 'https://doi.org/10.1111/j.1540-6261.1983.tb03834.x',
      use: '把报价解释为向更知情对手写出的选择权，并以流动性交易收益补偿知情成交损失；不提供逐笔 Bayes 或竞争零利润结论。',
    },
    {
      id: 2,
      authors: 'Lawrence R. Glosten & Paul R. Milgrom',
      year: '1985',
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      publication: 'Journal of Financial Economics, 14(1), 71–100',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
      use: '顺序成交、交易方向的 Bayes 更新、风险中性竞争报价与零库存条件下的正信息型价差；不是现实总价差分解。',
    },
    {
      id: 3,
      authors: 'Paul Milgrom & Nancy Stokey',
      year: '1982',
      title: 'Information, Trade and Common Knowledge',
      publication: 'Journal of Economic Theory, 26(1), 17–27',
      url: 'https://doi.org/10.1016/0022-0531(82)90046-1',
      use: '共同先验、共同知识与理性投机交易的无交易条件；用来限定共同价值、私人价值和交易发生条件，不作无条件无交易断言。',
    },
    {
      id: 4,
      authors: 'Sanford J. Grossman & Joseph E. Stiglitz',
      year: '1980',
      title: 'On the Impossibility of Informationally Efficient Markets',
      publication: 'American Economic Review, 70(3), 393–408',
      url: 'https://www.jstor.org/stable/1805228',
      use: '昂贵信息生产、噪声供给与价格不能免费完全揭示信息的均衡逻辑；不是价差或逐笔知情识别模型。',
    },
    {
      id: 5,
      authors: 'David Easley & Maureen O’Hara',
      year: '1987',
      title: 'Price, Trade Size, and Information in Securities Markets',
      publication: 'Journal of Financial Economics, 19(1), 69–90',
      url: 'https://doi.org/10.1016/0304-405X(87)90029-8',
      use: '交易规模作为信号与按规模定价的理论机制；不支持在允许拆单和路由后把大单固定标记为知情。',
    },
    {
      id: 6,
      authors: 'David Easley & Maureen O’Hara',
      year: '1992',
      title: 'Time and the Process of Security Price Adjustment',
      publication: 'Journal of Finance, 47(2), 577–605',
      url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04402.x',
      use: '交易间隔、成交量和无成交如何在特定到达结构下进入价格与价差；无成交的更新方向不是普遍规律。',
    },
    {
      id: 7,
      authors: 'Albert S. Kyle',
      year: '1985',
      title: 'Continuous Auctions and Insider Trading',
      publication: 'Econometrica, 53(6), 1315–1335',
      url: 'https://doi.org/10.2307/1913210',
      use: '知情数量策略、噪声伪装、聚合流量推断和 Kyle λ；λ 不是 PIN、违法概率或个人订单的纯机械 impact。',
    },
    {
      id: 8,
      authors: 'Lawrence R. Glosten & Lawrence E. Harris',
      year: '1988',
      title: 'Estimating the Components of the Bid/Ask Spread',
      publication: 'Journal of Financial Economics, 21(1), 123–142',
      url: 'https://doi.org/10.1016/0304-405X(88)90034-7',
      use: '有符号规模下持久价值修订与暂时交易成本的结构分解；“永久”与“信息”均属于模型条件。',
    },
    {
      id: 9,
      authors: 'Joel Hasbrouck',
      year: '1991',
      title: 'Measuring the Information Content of Stock Trades',
      publication: 'Journal of Finance, 46(1), 179–207',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb03749.x',
      use: '交易与报价 VAR、trade innovation 和累计报价响应；信息解释依赖变量、滞后、签名与创新识别。',
    },
    {
      id: 10,
      authors: 'Ananth Madhavan, Matthew Richardson & Mark Roomans',
      year: '1997',
      title: 'Why Do Security Prices Change? A Transaction-Level Analysis of NYSE Stocks',
      publication: 'Review of Financial Studies, 10(4), 1035–1064',
      url: 'https://doi.org/10.1093/rfs/10.4.1035',
      use: '交易方向创新、公共信息、有效价值修订和流动性成本的逐笔模型；θ 与 φ 是结构参数而非直接真值。',
    },
    {
      id: 11,
      authors: 'Roger D. Huang & Hans R. Stoll',
      year: '1997',
      title: 'The Components of the Bid-Ask Spread: A General Approach',
      publication: 'Review of Financial Studies, 10(4), 995–1034',
      url: 'https://doi.org/10.1093/rfs/10.4.995',
      use: '订单处理、库存与逆向选择的结构分解及订单反转识别；样本占比对模型限制敏感，不能写成市场常数。',
    },
    {
      id: 12,
      authors: 'David Easley, Nicholas M. Kiefer, Maureen O’Hara & Joseph B. Paperman',
      year: '1996',
      title: 'Liquidity, Information, and Infrequently Traded Stocks',
      publication: 'Journal of Finance, 51(4), 1405–1436',
      url: 'https://doi.org/10.1111/j.1540-6261.1996.tb04074.x',
      use: '日度三状态 Poisson 混合似然、PIN 公式和 90 只 NYSE 股票证据；PIN 是模型隐含占比而非逐笔标签。',
    },
    {
      id: 13,
      authors: 'Jefferson Duarte & Lance Young',
      year: '2009',
      title: 'Why Is PIN Priced?',
      publication: 'Journal of Financial Economics, 91(2), 119–138',
      url: 'https://doi.org/10.1016/j.jfineco.2007.10.008',
      use: '允许对称订单流冲击后分离 PIN 的信息与流动性部分，说明原 PIN 可能混合非信息流动性因素。',
    },
    {
      id: 14,
      authors: 'David Easley, Marcos M. López de Prado & Maureen O’Hara',
      year: '2012',
      title: 'Flow Toxicity and Liquidity in a High-Frequency World',
      publication: 'Review of Financial Studies, 25(5), 1457–1493',
      url: 'https://doi.org/10.1093/rfs/hhs053',
      use: 'Volume bucket、bulk-volume classification、VPIN 构造与 flow-toxicity 动机；不是逐笔知情或危机概率。',
    },
    {
      id: 15,
      authors: 'Torben G. Andersen & Oleg Bondarenko',
      year: '2014',
      title: 'VPIN and the Flash Crash',
      publication: 'Journal of Financial Markets, 17, 1–46',
      url: 'https://doi.org/10.1016/j.finmar.2013.05.005',
      use: 'VPIN 的交易强度关联、Flash Crash 时点、分类与参数敏感性批评；支持审计，不等于单篇彻底证伪。',
    },
    {
      id: 16,
      authors: 'David Easley, Marcos M. López de Prado & Maureen O’Hara',
      year: '2014',
      title: 'VPIN and the Flash Crash: A Rejoinder',
      publication: 'Journal of Financial Markets, 17, 47–52',
      url: 'https://doi.org/10.1016/j.finmar.2013.06.007',
      use: '澄清 VPIN 的 toxicity 目标、volume clock 与 BVC 设计，并回应波动预测和 Flash Crash 证据批评。',
    },
    {
      id: 17,
      authors: 'Torben G. Andersen & Oleg Bondarenko',
      year: '2014',
      title: 'Reflecting on the VPIN Dispute',
      publication: 'Journal of Financial Markets, 17, 53–64',
      url: 'https://doi.org/10.1016/j.finmar.2013.08.002',
      use: '继续审计 BVC 失真、成交量机械关联和分类敏感性；与原文及 rejoinder 成组呈现争议。',
    },
    {
      id: 18,
      authors: 'Torben G. Andersen & Oleg Bondarenko',
      year: '2015',
      title: 'Assessing Measures of Order Flow Toxicity and Early Warning Signals for Market Turbulence',
      publication: 'Review of Finance, 19(1), 1–54',
      url: 'https://doi.org/10.1093/rof/rfu041',
      use: '用更精确成交分类评估 toxicity 与市场动荡预警，支持以直接签名、波动和成交量做增量基准。',
    },
    {
      id: 19,
      authors: 'Charles M. C. Lee & Mark J. Ready',
      year: '1991',
      title: 'Inferring Trade Direction from Intraday Data',
      publication: 'Journal of Finance, 46(2), 733–746',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
      use: '用成交价与报价推断主动方向的经典规则；quote 对齐和时间戳使签名成为估计而非无误真值。',
    },
    {
      id: 20,
      authors: 'Anat R. Admati & Paul Pfleiderer',
      year: '1988',
      title: 'A Theory of Intraday Patterns: Volume and Price Variability',
      publication: 'Review of Financial Studies, 1(1), 3–40',
      url: 'https://doi.org/10.1093/rfs/1.1.3',
      use: '流动性交易者集中与知情者选择厚市场进行伪装的交易时机均衡；不把活跃时段固定等同高毒性。',
    },
    {
      id: 21,
      authors: 'Michael J. Barclay & Jerold B. Warner',
      year: '1993',
      title: 'Stealth Trading and Volatility: Which Trades Move Prices?',
      publication: 'Journal of Financial Economics, 34(3), 281–305',
      url: 'https://doi.org/10.1016/0304-405X(93)90029-B',
      use: '公告前中等规模交易与累计价格变化的证据，和 stealth trading 一致；不能逐笔认定中单知情。',
    },
    {
      id: 22,
      authors: 'Pierre Collin-Dufresne & Vyacheslav Fos',
      year: '2015',
      title: 'Do Prices Reveal the Presence of Informed Trading?',
      publication: 'Journal of Finance, 70(4), 1555–1582',
      url: 'https://doi.org/10.1111/jofi.12260',
      use: 'Schedule 13D 建仓下知情者的时机与订单选择会使常用 adverse-selection / illiquidity 代理下降。',
    },
    {
      id: 23,
      authors: 'Jonathan Brogaard, Terrence Hendershott & Ryan Riordan',
      year: '2014',
      title: 'High-Frequency Trading and Price Discovery',
      publication: 'Review of Financial Studies, 27(8), 2267–2306',
      url: 'https://doi.org/10.1093/rfs/hhu032',
      use: '主动/被动 HFT、公开宏观新闻、订单簿失衡与价格发现；HFT 角色随订单状态变化而非固定身份。',
    },
    {
      id: 24,
      authors: 'Peter Hoffmann',
      year: '2016',
      title: 'Adverse Selection, Market Access, and Inter-Market Competition',
      publication: 'Journal of Banking & Finance, 65, 108–119',
      url: 'https://doi.org/10.1016/j.jbankfin.2015.10.009',
      use: 'Smart routing 与市场接入如何让不同 venue 面对选择后的不同信息含量；单场所不能直接代表全市场。',
    },
    {
      id: 25,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2022',
      accessedAt: '2026-08-28',
      title: 'Insider Trading Arrangements and Related Disclosures',
      publication: 'SEC Final Rule, Release Nos. 33-11138; 34-96492',
      url: 'https://www.sec.gov/files/rules/final/2022/33-11138.pdf',
      use: '美国 Rule 10b5-1 相关的交易时知悉、义务与抗辩规则背景；仅用于区分经济学 informed 与美国法律结论，不构成法律意见。',
    },
  ],
  readingList: [
    {
      title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders',
      scope: '核心推导 · Glosten–Milgrom（1985），读序贯成交、条件报价与动态后验',
      reason: '亲自核对正价差为何可在风险中性、零库存和竞争条件下由信息选择生成。',
      url: 'https://doi.org/10.1016/0304-405X(85)90044-3',
    },
    {
      title: 'Continuous Auctions and Insider Trading',
      scope: '战略数量 · Kyle（1985），读单期线性均衡与多期信息释放',
      reason: '理解知情者为何利用噪声流伪装，以及 λ 为什么是均衡价格更新斜率。',
      url: 'https://doi.org/10.2307/1913210',
    },
    {
      title: 'Price, Trade Size, and Information in Securities Markets',
      scope: '行动维度 · Easley–O’Hara（1987），读规模选择和按量定价',
      reason: '从二元方向扩展到交易规模，同时看清“大单知情”的模型条件。',
      url: 'https://doi.org/10.1016/0304-405X(87)90029-8',
    },
    {
      title: 'Why Do Security Prices Change?',
      scope: '动态分解 · Madhavan–Richardson–Roomans（1997），读交易创新、公共信息与成本项',
      reason: '将可预测订单流与 surprise 分开，并审计结构参数为何不是直接可见的真值。',
      url: 'https://doi.org/10.1093/rfs/10.4.1035',
    },
    {
      title: 'The Components of the Bid-Ask Spread: A General Approach',
      scope: '成分识别 · Huang–Stoll（1997），读 α、β、订单反转与结构限制',
      reason: '比较 adverse selection、inventory 与 processing 的识别方式和样本占比边界。',
      url: 'https://doi.org/10.1093/rfs/10.4.995',
    },
    {
      title: 'Liquidity, Information, and Infrequently Traded Stocks',
      scope: 'PIN 原模型 · Easley et al.（1996），读三状态似然、参数与 90 股样本',
      reason: '从完整生成模型理解 PIN，而不是只记最终比率公式。',
      url: 'https://doi.org/10.1111/j.1540-6261.1996.tb04074.x',
    },
    {
      title: 'Why Is PIN Priced?',
      scope: 'PIN 修正 · Duarte–Young（2009），读对称流量冲击与 adjusted PIN',
      reason: '理解结构指标怎样混入非信息流动性，以及资产定价结论如何随分解改变。',
      url: 'https://doi.org/10.1016/j.jfineco.2007.10.008',
    },
    {
      title: 'Flow Toxicity and Liquidity in a High-Frequency World',
      scope: 'VPIN 原构造 · Easley–López de Prado–O’Hara（2012），读 volume buckets、BVC 与目标变量',
      reason: '先公平理解统计量为何被提出，再进入分类和预测争议。',
      url: 'https://doi.org/10.1093/rfs/hhs053',
    },
    {
      title: 'VPIN and the Flash Crash',
      scope: '争议审计 · Andersen–Bondarenko（2014），与 rejoinder 和 counterreply 成组阅读',
      reason: '训练对参数敏感、机械关联、事件时点和增量预测的完整证据审计。',
      url: 'https://doi.org/10.1016/j.finmar.2013.05.005',
    },
    {
      title: 'Do Prices Reveal the Presence of Informed Trading?',
      scope: '现代内生选择 · Collin-Dufresne–Fos（2015），读 Schedule 13D 样本与交易方式选择',
      reason: '理解真正的知情交易为何可能让常见逆向选择代理下降。',
      url: 'https://doi.org/10.1111/jofi.12260',
    },
  ],
};
