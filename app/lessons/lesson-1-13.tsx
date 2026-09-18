import InventoryQuoteLab from '../components/InventoryQuoteLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson113Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>库存风险并不机械地要求做市商“把 spread 全部拉宽”；它首先改变下一单位买入或卖出的主观价值与 reservation price，并在策略选择围绕该内部价值报价时移动实际报价中心，再通过价格、数量、对冲和是否参与改变下一期状态。</h2>
        <p>
          上一节说明，做市商为了把未来的自然对手方提前到现在，必须让订单失衡暂时进入自己的资产负债表。本节追问紧接着发生的事：当先前成交使库存偏离可接受状态后，下一轮 bid 与 ask 为什么会改变？最小答案是一条闭环。旧报价与外部订单共同生成成交，成交改变库存；库存让未来价格波动变成持仓损益；风险厌恶的做市商因而降低继续增加同向库存的意愿、提高减少库存的意愿；新的报价与 size 又改变下一轮两侧成交强度，库存于是可能向目标回归。Garman、Amihud–Mendelson 与 Ho–Stoll 奠定了库存型 dealer 定价的经典主线；O’Hara 提供了库存与信息模型的系统综合；Avellaneda–Stoikov 则把有限期限、指数效用和随报价距离下降的成交强度组合成一个广为使用的可解基准。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={21} />
        </p>
        <p>
          但“库存偏多所以降低报价”只有在对象、时间与反事实都固定时才有意义。实际库存 q、目标 q*、相对目标偏离 x=q−q*、公共参考 mid m、内部 reservation price r、实际报价中心 c、full width w、两侧显示数量以及外部 hedge 是不同变量；公共坏消息也会让报价下移，信息风险会让 width 变化，未观察到的 hedge 会让 raw q 与残余风险不同。因而本节既推导库存控制机制，也解释为什么屏幕上的 quote 与历史相关性不能自动证明这条因果链。
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>区分实际库存 q、目标 q* 与控制偏离 x，并说明 target 为什么不会凭定义消除实际价格暴露。</li>
            <li>从价格风险、风险厌恶与剩余期限推出 reservation price 的方向，而不把它误作价格预测。</li>
            <li>用 quote center / skew 与 full width 两套坐标解释“整体下移”为什么不等于“spread 变宽”。</li>
            <li>从报价距离到成交强度，再到库存转移，重建局部负反馈链。</li>
            <li>正确使用 Avellaneda–Stoikov 的显式近似，并列出它不是一般最优报价公式的原因。</li>
            <li>把 price、size、hedge 与 participation 当作不同控制接口，并为库存因果效应设计可证伪研究。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="object-map">
        <p className="section-kicker">01 · 先把对象分开</p>
        <h2>从资产负债表状态到屏幕报价至少经过六层映射；把任何相邻两层当成同一个量，都会制造错误结论。</h2>
        <div className="table-scroll" role="region" aria-label="库存报价控制对象地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>库存状态、内部价值、报价与行动不是同义词</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">记号 / 对象</th><th scope="col">它回答什么</th><th scope="col">不能替代</th></tr></thead>
            <tbody>
              <tr><th scope="row">物理头寸</th><td>q</td><td>价格每变一单位，现有标的头寸怎样盯市？</td><td>目标偏离或净 hedge</td></tr>
              <tr><th scope="row">控制基准</th><td>q* 与 x=q−q*</td><td>相对业务目标偏多还是偏空？</td><td>实际 q 的价格暴露</td></tr>
              <tr><th scope="row">公共参考</th><td>m</td><td>此刻用什么同步参考价定位 quote？</td><td>无误的 fundamental value</td></tr>
              <tr><th scope="row">内部估值</th><td>r</td><td>给定状态，增加或减少一单位的无差异价值是多少？</td><td>对未来 mid 的预测</td></tr>
              <tr><th scope="row">报价几何</th><td>c（中心）、y（中心偏移）、w（全宽）、h（半宽）</td><td>整体中心偏移多少、两侧距离多宽？</td><td>真实成交概率</td></tr>
              <tr><th scope="row">控制动作</th><td>a、b、L、hedge、participation</td><td>报什么价、多少量、怎样对冲、是否继续供给？</td><td>单一“库存系数”</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这张地图也给出了研究顺序：先确认 pre-quote 状态，再说明内部目标和风险模型，然后观察 quote 与 size，最后等待成交和库存更新。直接从某个 ask 变动跳到“做市商库存风险上升”，等于越过了公共价值、信息风险、竞争、队列、制度义务和未观察 hedge 等多条替代路径。
        </p>
      </section>

      <section className="lesson-section" id="state-timeline">
        <p className="section-kicker">02 · 事件时钟先于回归</p>
        <h2>解释一笔报价时只能使用它提交前已知的库存；用本次成交后的库存解释本次成交前报价，会把结果倒灌成原因。</h2>
        <div className="mechanism-chain" aria-label="报价与库存的事件时间线">
          {[
            ['状态冻结', '记录 qₜ₋、q*ₜ、hedge、限额、公共信息与同步 mid mₜ'],
            ['控制计算', '形成 reservation price、center / width、两侧 size 与参与决策'],
            ['报价提交', 'bid bₜ 与 ask aₜ 进入具体 venue、tick 与 queue'],
            ['外部选择', '主动买单、卖单或撤单机会决定哪一侧及多少量成交'],
            ['状态跳变', 'ask fill 使 q 下降，bid fill 使 q 上升；费用与现金同步更新'],
            ['下一轮输入', '用新的 qₜ、markout、hedge 与风险状态生成下一次报价'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          记号 q<sub>t−</sub> 表示报价或成交事件发生前一瞬间的库存。研究“库存是否改变报价”时，右侧变量至少要滞后到 quote decision 之前；研究“报价是否纠正库存”时，结果则是随后成交和 q 的变化。两条方向都存在，所以库存与报价构成动态系统，而不是一条可以凭同期相关系数解决的单向关系。Madhavan–Smidt 的库存—报价系统正是因为同时处理动态调整，才比一条静态回归更接近问题结构。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-exposure">
        <p className="section-kicker">03 · Inventory exposure</p>
        <h2>库存风险的原点不是“库存数字很大”，而是价格变化会按持仓方向和数量进入下一期 wealth。</h2>
        <p>
          令 q<sub>t</sub> 为持有的标的单位数，Δm<sub>t+1</sub>=m<sub>t+1</sub>−m<sub>t</sub> 为下一控制窗口内参考价格变化。忽略期间的新成交、现金利息和 hedge，现有库存的盯市变化近似为：
        </p>
        <div className="equation-card">
          <span>单资产库存的局部价格暴露</span>
          <div>ΔW<sub>inv,t+1</sub> ≈ q<sub>t</sub> · Δm<sub>t+1</sub></div>
          <p>long q&gt;0 时价格下跌产生损失、上涨产生收益；short q&lt;0 时相反。这个式子描述实际 q 的 mark-to-market exposure，不会因为内部设了 target 而自动改变。</p>
        </div>
        <p>
          若条件均值 E<sub>t</sub>[Δm]=0，预期持有损益可以为零，但风险并不为零：在局部同方差近似下，Var<sub>t</sub>(ΔW<sub>inv</sub>)≈q²σ²τ。正负库存的均值都可能是零，方差却随 |q| 放大。风险厌恶者因此愿意牺牲一部分预期 spread capture，换取更小的尾部和资本占用；这正是 quote adjustment 的经济起点，而不是“做市商知道价格将下跌”。Ho–Stoll 与 Amihud–Mendelson 分别从风险和库存持有成本建立了这类机制。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="target-inventory">
        <p className="section-kicker">04 · Target inventory 的条件含义</p>
        <h2>目标库存是控制基准或业务授权，不是一个可以通过减法凭空生成的 hedge。</h2>
        <p>
          现实 desk 未必以 q=0 为唯一目标。客户 facilitation book 可能需要维持计划性头寸；期权 desk 的股票持仓可能在抵消已计入的 delta liability；指数与成分股组合可能以某个基准篮子为中性；指定做市制度和内部风险预算也可能给出非零 operating target。此时用 q* 表示明确的目标，并以 x=q−q* 描述控制偏离是合理的。
        </p>
        <div className="boundary-box">
          <b>必须同时报告 actual exposure 与 control deviation</b>
          <p>实际标的价格变化首先作用于 q。只有当 q* 对应已经纳入同一账本的反向客户负债、hedge、benchmark 或明确业务效用时，围绕 x 的残余风险解释才有经济闭合。仅仅宣布“我的 target 是 +100”不会让 +100 的实际价格风险消失。</p>
        </div>
        <p>
          因此本节有意使用两种语言：物理盯市暴露写 q；教学性库存控制罚函数可以围绕 x 写，但必须把 q* 的来源和其他资产负债表项列出。把两者混为一谈会导致一种危险错觉：只要移动 target，就能让风险指标改善，而不需要任何真实交易或对冲。
        </p>
      </section>

      <section className="lesson-section" id="inventory-deviation">
        <p className="section-kicker">05 · Inventory deviation</p>
        <h2>偏离的符号决定纠偏方向：x&gt;0 表示相对目标偏多，x&lt;0 表示相对目标偏空。</h2>
        <div className="equation-card">
          <span>控制状态</span>
          <div>x<sub>t</sub> = q<sub>t</sub> − q*<sub>t</sub></div>
          <p>q=+8、q*=+3 时 x=+5：实际 long 8，控制上相对目标偏多 5。q=−2、q*=+3 时 x=−5：实际 short 2，但相对一个 long 3 的业务目标少了 5。</p>
        </div>
        <p>
          这一例子说明“long/short”必须标明参照物。实际头寸的符号回答标的价格变化怎样盯市；target deviation 的符号回答当前控制希望哪一类成交更多。若明确的目标政策因客户流、时间或 hedge 状态而重设 q*，x 也会在没有标的成交时改变；外部 hedge 交易本身并不自动重设 q*。实证中未观察 q*，用 raw q 代替 x，等于附加了“目标固定且相同”的强假设。
        </p>
      </section>

      <section className="lesson-section" id="endogenous-inventory">
        <p className="section-kicker">06 · 库存是内生状态</p>
        <h2>过去报价、标的成交、客户流与同一标的主动交易形成今天的 q；公共消息和外部 hedge 决定这个 q 怎样映射为价值与残余风险，却不直接制造或消除标的库存。</h2>
        <p>
          若做市商把 bid 报得更积极，它更可能买入；把 ask 报得更积极，它更可能卖出。信息型卖方也可能只在做市商 bid 过高时成交，于是同一个坏消息同时造成 q 上升、公共价值下降与 bid/ask 下移。做市商还可能主动建立方向性头寸，或者在另一市场对冲却只在本市场数据里显示大 q。Manaster–Mann 在期货场内交易者数据中发现的库存—价格关系甚至可与简单被动纠偏方向相反，提醒研究者 dealer 也会有意选择持仓。<Cite n={14} />
        </p>
        <p>
          因此 q 高后 center 低，最多先说“与库存渠道一致”。要说“库存导致报价下移”，需要一种只改变特定做市商库存偏离、却不直接改变公共价值、订单毒性、目标或 hedge cost 的可信变动。后文将把这个识别问题重新写成明确的潜在结果与事件设计。
        </p>
      </section>

      <section className="lesson-section" id="mean-variance-risk">
        <p className="section-kicker">07 · 教学性二次风险代价</p>
        <h2>在短窗口、局部正态和常绝对风险厌恶近似下，库存偏离的风险收费可以写成一个便于推导的二次函数；它是模型选择，不是会计恒等式。</h2>
        <p>
          假设未来 τ 时间内标的价格创新条件方差为 σ²τ，风险厌恶系数为 γ，并暂时把控制目标定义为 x=0。一个常用的 CARA–Normal 局部近似把 CARA（constant absolute risk aversion，常绝对风险厌恶）效用与条件正态价格创新结合；对应的 certainty-equivalent（确定性等价，即让决策者对随机结果无差异的确定金额）风险扣减是：
        </p>
        <div className="equation-card">
          <span>CARA–Normal / mean–variance 局部近似</span>
          <div>R<sub>t</sub>(x) = (γ / 2) · x² · σ² · τ</div>
          <p>偏离翻倍，局部方差收费变成四倍；波动、持有窗口或风险厌恶越高，同一偏离越昂贵。若 x 是 target-centered 状态，这等于假设业务目标已被效用或其他账本项合理吸收。</p>
        </div>
        <p>
          二次形式的价值不在于声称尾部正态，而在于把“边际一单位库存”的成本变成线性、方向清楚的局部基准。真实损失可厚尾、跳跃、受限额和保证金非线性放大；大库存、压力期和临近硬限额时，R 往往不再是平滑抛物线。
        </p>
      </section>

      <section className="lesson-section" id="risk-aversion">
        <p className="section-kicker">08 · 风险厌恶决定斜率</p>
        <h2>报价对库存的敏感度来自风险代价的边际变化，而不是库存总风险本身。</h2>
        <p>
          对上式求导得到 ∂R/∂x=γxσ²τ。它衡量在当前偏离 x 上再增加一个单位，确定性等价风险代价大约增加多少。x&gt;0 时边际代价为正，继续在 bid 买入会更昂贵；在 ask 卖出一个单位则减少偏离。x&lt;0 时符号反转。
        </p>
        <div className="equation-card">
          <span>边际库存收费</span>
          <div>∂R / ∂x = γ · x · σ² · τ</div>
          <p>γ 不是可直接从屏幕读取的“心理恐惧”。在结构模型中，它与目标、波动模型、需求弹性和约束共同决定可观察报价；换一种规格，估出的 γ 可能改变。</p>
        </div>
        <p>
          这也解释为何同样 q 对不同 desk 含义不同：资本更稀缺、损失函数更陡或限额更近时，有效风险斜率更大；有可靠自然反向流、低成本 hedge 或更宽风险预算时，斜率可能较小。经验研究若只回归 quote 对 q，估到的往往是这些机制的合成 reduced-form coefficient（约化式系数，即多项机制共同决定的观察关系参数），而不是纯粹偏好参数。
        </p>
      </section>

      <section className="lesson-section" id="time-horizon">
        <p className="section-kicker">09 · 剩余期限不是时钟装饰</p>
        <h2>同一库存要承担多久，决定价格方差能累积多少；但“越临近终点越急于清仓”只有在终点真的惩罚未平仓时才成立。</h2>
        <p>
          在常方差扩散近似下，风险项与 τ 成正比，所以更长持有窗口使 reservation adjustment 更大。Avellaneda–Stoikov 原始有限期限目标在 T 以 mid 对终端库存盯市，即 X<sub>T</sub>+q<sub>T</sub>S<sub>T</sub>；它没有强制把库存按有成本的市场订单清算。因此其近似库存 skew 随 τ=T−t 接近零而减弱，并不自动产生临近收盘的强制 liquidation。<Cite n={5} />
        </p>
        <p>
          若现实业务在收盘、合约到期或风险窗口末端有硬库存罚金、保证金跳变或必须买卖清算，终端条件改变，临近 T 的行为可以相反：越接近终点越积极卸载。比较模型与数据时，不能只看“有限期限”四个字，必须查看 terminal objective 到底是 mid mark、清算价值、二次罚金还是硬约束。Guéant 及后续做市控制文献系统展示了终端罚金、库存边界和更一般强度怎样改变解。<Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="reservation-price">
        <p className="section-kicker">10 · Reservation price</p>
        <h2>Reservation price 是给定当前风险状态时，对边际库存的内部无差异中心；它不是对下一笔公共成交价的预测。</h2>
        <p>
          在上一节二次风险代价的局部教学模型中，把继续增加一单位库存的边际风险收费从公共参考 m 中扣除，可得到：
        </p>
        <div className="equation-card">
          <span>教学性 reservation center</span>
          <div>r<sub>t</sub> = m<sub>t</sub> − γ · x<sub>t</sub> · σ² · τ</div>
          <p>x&gt;0 时 r&lt;m：做市商对再多持有一单位的内部价值更低；x&lt;0 时 r&gt;m：买回一单位能减少 short deviation，内部愿付价格更高。</p>
        </div>
        <p>
          “内部愿付价降低”不等于预测 m 会下降。即使 E[Δm]=0，风险厌恶也会让随机 wealth 的确定性等价低于其均值。更一般的动态规划模型中，reservation bid 与 reservation ask 是 value function 在 q 与 q±1 相邻状态之间的差，不必重合为单一 r；显式线性中心只是特定假设和近似下的结果。Avellaneda–Stoikov 原文先给出相邻状态价值差与隐式最优距离，随后才对库存和订单到达项做渐近/线性近似。<Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="worked-reservation">
        <p className="section-kicker">11 · Reservation 算例</p>
        <h2>方向、单位和解释必须同时正确，数值才有经济意义。</h2>
        <p>
          假设 m=$100，实际 q=8，明确业务目标 q*=3，所以 x=5；γ=0.5/$，且 σ²τ=0.01 $²。则 γxσ²τ=(0.5/$)×5×0.01$²=$0.025，r=$99.975。单位检查很重要：γ 把 wealth 方差转成确定性等价金额，最终调整必须是价格单位。
        </p>
        <div className="equation-card">
          <span>数值结果</span>
          <div>r = $100.000 − $0.025 = $99.975</div>
          <p>这个 $0.025 是在给定模型、目标、波动与期限下的内部库存折价。它没有说市场会跌 2.5 美分，也没有说实际 q=8 的全部风险只剩 x=5。</p>
        </div>
        <p>
          若 x 改为 −5，其余不变，r=$100.025；若期限或条件方差减半，调整也减半。该线性 comparative statics 只属于局部基准。真实 desk 可能因硬限额、跳跃风险或执行约束产生非线性，甚至在不同库存区间采用分段控制。
        </p>
      </section>

      <section className="lesson-section" id="quote-coordinate-system">
        <p className="section-kicker">12 · 报价坐标系</p>
        <h2>要判断报价怎样变，至少同时计算 center、full width、half-width 与相对 mid 的两侧距离。</h2>
        <p>
          令 bid 为 b、ask 为 a、公共参考 mid 为 m。定义实际 quote center c=(a+b)/2，full width w=a−b，half-width h=w/2，center skew y=c−m。于是两侧报价可唯一写为：
        </p>
        <div className="equation-card">
          <span>中心—宽度坐标</span>
          <div>a = m + y + h　；　b = m + y − h</div>
          <p>相对 mid 的 ask 距离 δ<sup>a</sup>=a−m=h+y；bid 距离 δ<sup>b</sup>=m−b=h−y。y 控制整体平移，h 控制两侧间距；二者在几何上独立。</p>
        </div>
        <div className="equation-card">
          <span>从内部 r 到屏幕 c 需要一条控制规则</span>
          <div>若 a=r+h、b=r−h　⇒　c=r　；　y=r−m=−γxσ²τ</div>
          <p>只有当策略选择在 r 两侧等距报价时，实际 quote center 才等于 reservation price。这个等式是控制假设，不是 c 或 r 的定义；tick、queue、竞争、制度义务、费用和 clipping 都可能使真实 c 偏离 r。</p>
        </div>
        <p>
          例：m=100、b=99.94、a=100.02，则 c=99.98、w=0.08、h=0.04、y=−0.02；ask 距离 0.02，bid 距离 0.06。虽然 full spread 仍是 8 美分，ask 已比 bid 更靠近 mid。这是典型的 downward skew：更愿卖、更不愿买。
        </p>
      </section>

      <section className="lesson-section" id="center-vs-width">
        <p className="section-kicker">13 · Center ≠ Width</p>
        <h2>库存偏多首先降低内部 reservation value；在围绕 r 等距报价的最小控制规则下，center 随之下移，而 spread 是否同时扩大由另一组风险和成交权衡决定。</h2>
        <div className="table-scroll" role="region" aria-label="报价中心与宽度的四种变化，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一句“报价更保守”可能对应不同几何</caption>
            <thead><tr><th scope="col">动作</th><th scope="col">center y</th><th scope="col">width w</th><th scope="col">最直接作用</th></tr></thead>
            <tbody>
              <tr><th scope="row">两侧同幅下移</th><td>下降</td><td>不变</td><td>提高 ask 相对吸引力、降低 bid 相对吸引力</td></tr>
              <tr><th scope="row">bid 下移、ask 上移</th><td>可不变</td><td>扩大</td><td>同时减少两侧 fill、提高每笔毛 capture</td></tr>
              <tr><th scope="row">ask 下移更多</th><td>下降</td><td>可缩窄</td><td>更强促卖，但承受更低卖价</td></tr>
              <tr><th scope="row">两侧向内</th><td>可不变</td><td>缩窄</td><td>提高两侧成交，增加 turnover 与选择风险</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因此“long inventory 导致 wider spread”不是库存模型的必然第一结论。库存偏离提供方向性动机，最干净的局部表现是 center skew；波动、信息毒性、队列、固定成本、竞争和 hedge liquidity 可另行改变 width。Comerton-Forde 等发现极端库存与较差做市收入状态同更宽 spread 相关，是重要的非线性经验结果，却不把所有库存效应化约成对称 widening。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="price-skew">
        <p className="section-kicker">14 · Price skew 的传导</p>
        <h2>中心下移之所以能纠正 long deviation，是因为它同时改变了卖出与继续买入的相对机会，而不是命令市场替做市商清仓。</h2>
        <p>
          保持 h 不变，令 y 从 0 变成负数。Ask 距离 δ<sup>a</sup>=h+y 变短，报价更接近甚至优于公共 mid，主动买方更容易击中 ask，做市商卖出后 x 下降；bid 距离 δ<sup>b</sup>=h−y 变长，主动卖方更难击中 bid，继续买入的概率下降。两侧变化共同推动条件期望中的库存回归。
        </p>
        <div className="equation-card">
          <span>long deviation 的局部方向</span>
          <div>x&gt;0 → r&lt;m；若围绕 r 对称报价、c=r，则 y&lt;0 → δ<sup>a</sup>↓、δ<sup>b</sup>↑ → E[Δx | state] 相对无 skew 反事实下降</div>
          <p>这只说明纠偏方向：仅当调整后的净漂移跨过零时，才有 E[Δx | state]&lt;0。若基准 bid 成交强度或规模仍占主导，条件期望甚至仍可上升，更不用说单条样本路径。</p>
        </div>
        <p>
          Hasbrouck–Sofianos、Madhavan–Smidt 及后续历史 specialist 研究提供了库存调整和 quote/trade 动态的证据，但不同样本中的速度、工具与方向并不统一。把机制写成“相对成交机会改变”比写成“做市商必定迅速清零”更忠于数据。<Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="long-short-signs">
        <p className="section-kicker">15 · 多空符号必须镜像</p>
        <h2>能否在 short deviation 上得到完全相反的方向，是检查库存逻辑是否写反的最快方法。</h2>
        <div className="table-scroll" role="region" aria-label="库存多空偏离与报价方向，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>在选择 c=r，并固定 m、h 与其他渠道时的最小预测</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">Reservation；若 c=r 时的 center</th><th scope="col">Ask</th><th scope="col">Bid</th><th scope="col">目标</th></tr></thead>
            <tbody>
              <tr><th scope="row">x&gt;0，相对目标偏多</th><td>下移</td><td>更靠近 mid，促卖</td><td>更远离 mid，抑制买</td><td>使 x 下降</td></tr>
              <tr><th scope="row">x=0，在目标上</th><td>库存项为零</td><td colSpan={2}>仍受 spread、信息、竞争与 tick 影响</td><td>不是 zero spread</td></tr>
              <tr><th scope="row">x&lt;0，相对目标偏空</th><td>上移</td><td>更远离 mid，抑制卖</td><td>更靠近 mid，促买</td><td>使 x 上升</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          注意“更积极”要从做市商希望发生的成交方向解释：long 时 ask 更积极，bid 更保守；short 时 bid 更积极，ask 更保守。若两侧都远离 mid，只是在减少总成交；若两侧都靠近，则增加总成交。没有 center/width 坐标，“积极”这个词很容易失去可检验含义。
        </p>
      </section>

      <section className="lesson-section" id="arrival-intensity">
        <p className="section-kicker">16 · 从报价距离到成交强度</p>
        <h2>报价调整只有通过 fill function 改变真实成交，才能影响库存；没有这座桥，reservation price 只是内部数字。</h2>
        <p>
          一个常用可解假设是：给定其他状态，主动买单击中 ask 的条件强度随 ask 距离下降，主动卖单击中 bid 的强度同理。对两侧分别写：
        </p>
        <div className="equation-card">
          <span>指数到达强度基准</span>
          <div>λ<sup>a</sup>(δ<sup>a</sup>)=A<sup>a</sup>e<sup>−κᵃδᵃ</sup>　；　λ<sup>b</sup>(δ<sup>b</sup>)=A<sup>b</sup>e<sup>−κᵇδᵇ</sup></div>
          <p>A 是报价位于参考位置时的基准到达尺度；κ 描述强度对距离的敏感度。距离越远，模型中的成交强度越低。</p>
        </div>
        <p>
          指数形式和独立 Poisson arrival 是为得到清晰动态控制而设的函数规格，不是订单簿经验定律。真实 fill 依赖 queue position、前方数量、显示 size、撤单、隐单、撮合优先级、tick、latency、主动单大小、市场状态和竞争者报价。Cartea–Jaimungal–Ricci 与后续模型把 order-flow imbalance、adverse selection 或更丰富控制引入问题，说明可部署模型不能只估 κ。<Cite n={8} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="fill-probability">
        <p className="section-kicker">17 · 强度不是概率</p>
        <h2>λ 表示单位时间事件率；只有固定报价、固定状态和 Poisson 假设下，才能把它转成给定窗口内的成交概率。</h2>
        <div className="equation-card">
          <span>固定窗口的至少一次成交概率</span>
          <div>P(N<sub>Δt</sub>≥1 | quote unchanged)=1−e<sup>−λΔt</sup></div>
          <p>λΔt 很小时概率约为 λΔt；窗口越长，状态越可能变化，固定 λ 假设越不可信。这个式子也不告诉你成交多少单位。</p>
        </div>
        <p>
          例如 λ=2 次/秒、报价保持 0.1 秒，至少一次到达概率为 1−e<sup>−0.2</sup>≈18.1%，而不是 20% 的精确值。若做市商在窗口内改价、丢失 queue、只部分成交或市场中断，需要使用事件级 hazard（条件瞬时发生率）、competing risks（多个相互竞争事件）或订单级仿真，而不能继续套固定 Poisson 窗口。
        </p>
      </section>

      <section className="lesson-section" id="risk-neutral-distance">
        <p className="section-kicker">18 · Risk-neutral 也不会报 zero spread</p>
        <h2>即使删除库存风险，只要报价距离同时提高每笔毛 capture、降低成交强度，最优距离仍可严格为正。</h2>
        <p>
          考虑单侧教学问题：每笔在距 mid 为 δ 的位置成交获得毛 capture δ，强度 λ(δ)=Ae<sup>−κδ</sup>，忽略信息、费用、库存和竞争。单位时间预期毛收入为 δAe<sup>−κδ</sup>。求导得到 Ae<sup>−κδ</sup>(1−κδ)：当 δ&lt;1/κ 时斜率为正，报远一点仍提高收入；当 δ&gt;1/κ 时斜率为负，成交损失压过单笔 capture，因此最大值位于 δ*=1/κ。
        </p>
        <div className="equation-card">
          <span>成交价格—频率权衡</span>
          <div>max<sub>δ≥0</sub> δAe<sup>−κδ</sup>　⇒　δ*=1/κ</div>
          <p>风险中性只删除风险惩罚，不删除“报得越远每笔赚得多、但越难成交”的商业权衡。A 等比例放大所有候选收入，因此不进入这个简化一阶条件，却仍决定成交量和总价值。</p>
        </div>
        <p>
          对称两侧的基准 full width 是 2/κ。它完全依赖指数强度和每次单位成交的设定；若 fill function、size、fees 或价格改善规则改变，结果也改变。因而 1/κ 是模型内基准，不是交易所应观察到的自然 spread。
        </p>
      </section>

      <section className="lesson-section" id="as-model-ingredients">
        <p className="section-kicker">19 · Avellaneda–Stoikov 的假设账本</p>
        <h2>经典模型的力量来自把每项复杂性关掉后得到可解释基准；使用公式前必须把被关掉的部分重新列出来。</h2>
        <div className="protocol-grid">
          <article><span>01</span><h3>Mid process</h3><p>算术 Brownian motion（算术布朗运动：价格增量连续、零漂移、常方差且条件正态），常数 σ；mid 用于终端盯市，但不可无成本直接成交。</p></article>
          <article><span>02</span><h3>Preference</h3><p>CARA 指数效用与有限期限 T，使 wealth 水平可从 reservation valuation 中分离。</p></article>
          <article><span>03</span><h3>Order arrivals</h3><p>两侧独立 Poisson 到达，强度随距 mid 的 δ 指数下降；每次成交一个单位。</p></article>
          <article><span>04</span><h3>Controls</h3><p>连续选择 bid/ask 距离；没有 tick、queue priority、latency、最小 size 与改单成本。</p></article>
          <article><span>05</span><h3>Omitted channels</h3><p>没有成交反馈至 mid 的内生或永久 impact；temporary-impact mapping 只用于外生构造成交强度。模型也没有信息型价值更新、fees/rebates、外部 hedge、融资或竞争者策略。</p></article>
          <article><span>06</span><h3>Terminal condition</h3><p>终端 wealth 为现金加 q<sub>T</sub>S<sub>T</sub> 的 mid mark；不是强制按 spread/impact 清算。</p></article>
        </div>
        <p>
          原文的一般 Hamilton–Jacobi–Bellman（HJB，动态规划的连续时间方程）问题先以 value function 的相邻库存状态差定义 reservation bid/ask，再通过隐式一阶条件决定最优距离；文章随后对库存与到达项展开近似，才得到最常被引用的线性中心和显式 width。把后者称为“Avellaneda–Stoikov 精确一般解”会删掉原文最重要的层级。<Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="as-optimal-quotes">
        <p className="section-kicker">20 · 显式报价公式及其边界</p>
        <h2>在对称指数强度、单位成交与原文渐近/线性近似下，库存项移动中心，风险与到达弹性共同决定 full width。</h2>
        <p>
          令 τ=T−t，并先在原始零库存基准中用 q。广为使用的近似写为 r=m−qγσ²τ，full width 为 w*=γσ²τ+(2/γ)ln(1+γ/κ)，ask 与 bid 分别是 r±w*/2。为延续本节控制语言，下式把 q 替成 x；这是一个明确标注的 target-adjusted 教学扩展，只有 q* 已被业务目标或其他账本项合理吸收时才有残余风险含义。
        </p>
        <div className="equation-card">
          <span>Avellaneda–Stoikov 常用近似（target-adjusted teaching form）</span>
          <div>r=m−xγσ²τ　；　w*=γσ²τ+(2/γ)ln(1+γ/κ)　；　a*=r+w*/2　；　b*=r−w*/2</div>
          <p>第一项让偏多时中心下移；width 包含库存价格风险基准与成交距离—强度权衡。它不是包含 queue、tick、信息和 hedge 后的现实最优报价。</p>
        </div>
        <p>
          等价地，令 L=(1/γ)ln(1+γ/κ)，可得 δ<sup>a</sup>=(1/2−x)γσ²τ+L、δ<sup>b</sup>=(1/2+x)γσ²τ+L；这里 x 必须以“一次成交改变一个库存单位”的尺度对齐。极端 |x| 可使某侧 δ 变负，表示模型愿意跨过 mid 以强力纠偏；真实系统常有 clipping、market order、hard limit 或停止报价，这些都是原近似之外的新增约束。<Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="comparative-statics">
        <p className="section-kicker">21 · Comparative statics 不能只看一个符号</p>
        <h2>参数改变会同时作用于中心、宽度与成交价值；“γ 更高所以 spread 必然更宽”甚至在这个近似里也不是无条件结论。</h2>
        <p>
          库存中心斜率 |∂r/∂x|=γσ²τ，随 γ、σ²、τ 增大而变陡。风险中性极限 γ→0 时，利用 ln(1+γ/κ)≈γ/κ，可得 w*→2/κ，而不是零。A 不出现在显式 quote 中，是因为对称设定下它按同一比例缩放所有候选强度；A 仍决定 fills、价值和 P&amp;L，不能说“到达水平无关”。
        </p>
        <div className="table-scroll" role="region" aria-label="经典近似的参数比较静态，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>每个参数先问影响哪条通道</caption>
            <thead><tr><th scope="col">参数上升</th><th scope="col">Center sensitivity</th><th scope="col">Width / fills</th><th scope="col">关键限制</th></tr></thead>
            <tbody>
              <tr><th scope="row">|x|</th><td>中心偏离 m 更多</td><td>该近似下 total width 不变</td><td>依赖指数对称强度与线性近似</td></tr>
              <tr><th scope="row">σ²τ</th><td>库存 skew 更强</td><td>风险项扩大 width</td><td>终端罚金可改变时间方向</td></tr>
              <tr><th scope="row">κ</th><td>不直接进入 r</td><td>流动性项缩小</td><td>κ 单位与价格尺度必须一致</td></tr>
              <tr><th scope="row">γ</th><td>skew 斜率上升</td><td>γσ²τ 上升、log 项下降</td><td>总 width 未必对 γ 单调</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这类比较静态用于训练“哪一个状态通过哪一个项进入决策”，不是校准完成的策略。Guéant 证明并推广了更一般的做市控制结构；多资产、一般 intensity、订单规模和终端约束会改变可解形式。<Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="size-adjustment">
        <p className="section-kicker">22 · Displayed size 是第二个控制接口</p>
        <h2>即使价格不动，减少风险增加侧的挂单量、增加纠偏侧的量，也能改变每次成交后的库存跳幅。</h2>
        <p>
          令 ask 显示量为 L<sup>a</sup>、bid 显示量为 L<sup>b</sup>，并假设一次全部成交。做市商在 ask 卖出，所以 x<sub>after,a</sub>=x−L<sup>a</sup>；在 bid 买入，所以 x<sub>after,b</sub>=x+L<sup>b</sup>。long deviation 时，可在风险与收入允许的范围内缩小 bid size、提高 ask size；short 时反向。显示量只是最大承诺，真实 partial fill 必须用实际成交量替代。
        </p>
        <div className="equation-card">
          <span>成交后的控制状态</span>
          <div>x′<sub>ask</sub>=x−L<sup>a</sup>　；　x′<sub>bid</sub>=x+L<sup>b</sup></div>
          <p>Price skew 改变“哪侧更可能成交”；size 调整改变“成交时库存跳多少”。对 x&gt;0，ask 实际成交量只有在 0&lt;L<sup>a</sup>&lt;2x 时才降低 x²；L<sup>a</sup>=x 恰好回到目标，L<sup>a</sup>&gt;x 会越过目标，L<sup>a</sup>&gt;2x 反而增加平方风险。二者还受义务和 queue priority 约束。</p>
        </div>
        <p>
          Madhavan–Sofianos 对历史 NYSE specialist 的证据表明，库存控制不必主要表现为显著 price quote 变化，参与选择和交易规模同样重要。Kavajecz–Odders-White 在 TORQ 数据中对 inventory 影响 price schedule 的证据较弱，也提示研究者若只看 center，可能漏掉 size、参与和其他场所调整。<Cite n={12} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="size-risk-example">
        <p className="section-kicker">23 · Size 风险算例</p>
        <h2>同样的四单位成交，在 long deviation 的两侧会产生完全不同的边际风险变化。</h2>
        <p>
          当前 x=+10，使用 x² 作为省略共同系数 γσ²τ/2 后的风险分数。若 ask 成交 4，x′=6，分数从 100 降到 36，变化 −64；若 bid 成交 4，x′=14，分数升到 196，变化 +96。风险函数凸性意味着在已经偏多时，继续买入四单位造成的恶化，大于卖出四单位带来的对称线性数量直觉。
        </p>
        <div className="equation-card">
          <span>凸风险下的两侧不对称</span>
          <div>Ask fill: (10−4)²−10²=−64　；　Bid fill: (10+4)²−10²=+96</div>
          <p>这不是说 ask 一定应挂 4、bid 一定不挂；还要比较成交概率、每笔 capture、信息风险、义务和跨市场 hedge。它只隔离 size 对库存风险的边际作用。</p>
        </div>
      </section>

      <section className="lesson-section" id="hedge-decision">
        <p className="section-kicker">24 · Hedge 是第三个控制接口</p>
        <h2>做市商可以保留客户流与本市场报价，同时用相关工具改变残余风险；屏幕上 raw inventory 大，不等于公司净风险一定大。</h2>
        <p>
          设标的库存为 q，hedge 工具头寸为 z，下一窗口价格变化分别为 ΔS 与 ΔH。组合价格变化的条件方差为：
        </p>
        <div className="equation-card">
          <span>线性两资产风险</span>
          <div>V(z)=q²Var(ΔS)+z²Var(ΔH)+2qzCov(ΔS,ΔH)</div>
          <p>对 z 求最小值得 z*=−q·Cov(ΔS,ΔH)/Var(ΔH)。正协方差时，long 标的用负 hedge 头寸降低方差；名义一比一通常不是最小方差比率。</p>
        </div>
        <p>
          对冲决策还要扣 execution cost、spread、impact、basis risk、相关性漂移、margin、borrow 与对冲工具自身流动性。Naik–Yadav 发现历史 LSE 的股票层库存对定价比公司层等价库存更有解释力，可能反映组织分工、风险共享不完全与不同 desk 的控制边界；它并不推翻协方差风险理论，而是在提醒“理论上可净额”不等于“组织上即时净额”。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="hedge-residual-risk">
        <p className="section-kicker">25 · 最小方差对冲不等于风险归零</p>
        <h2>只有相关性绝对值为一且执行、基差与资金条件稳定时，线性 hedge 才可能消除这一维局部方差。</h2>
        <p>
          令 q=10、Var(ΔS)=4、Var(ΔH)=1、Cov(ΔS,ΔH)=1.5。则 z*=−15；未对冲方差为 10²×4=400，对冲后 V=400+225+2×10×(−15)×1.5=175。风险下降 225，但仍不为零，因为相关系数为 1.5/(2×1)=0.75。
        </p>
        <div className="equation-card">
          <span>算例</span>
          <div>z*=−15　；　V(z*)=175　；　reduction=225</div>
          <p>最小方差是给定估计 covariance 的局部答案。结构变化会让 hedge ratio 失效；交易成本和 margin 甚至可能使方差最小方案不是经济最优方案。</p>
        </div>
        <p>
          这也解释为什么研究库存报价时应尽量观察 firm-wide 或 desk-relevant hedge，而不能把单证券 q 当作完整风险状态。若无法观察，结论应限定为 raw-inventory association，并将 hedge measurement error 列为核心替代解释。
        </p>
      </section>

      <section className="lesson-section" id="multi-asset-inventory">
        <p className="section-kicker">26 · 多资产库存看协方差方向</p>
        <h2>一个证券的边际风险不只由自身仓位决定，还取决于它与组合中所有其他头寸的协方差。</h2>
        <p>
          令库存偏离向量为 <strong>x</strong>，条件协方差矩阵为 Σ。教学性组合风险收费写作 R(<strong>x</strong>)=(γτ/2)<strong>x</strong>′Σ<strong>x</strong>，其梯度为 γτΣ<strong>x</strong>。第 i 个分量 (Σ<strong>x</strong>)<sub>i</sub> 是再增加一单位资产 i 对组合方差的边际贡献。
        </p>
        <div className="equation-card">
          <span>组合库存风险</span>
          <div>R(<b>x</b>)=(γτ/2)<b>x</b>′Σ<b>x</b>　；　∇R=γτΣ<b>x</b></div>
          <p>单名义头寸很大但与其他仓位负相关时，边际风险可能小；每只股票仓位都不大但共同暴露同一市场因子时，组合风险可能大。</p>
        </div>
        <p>
          同样的 target caveat 仍成立：围绕 <strong>x</strong>=<strong>q</strong>−<strong>q</strong>* 写风险，是业务效用或残余风险建模选择，不会改变实际标的向量 <strong>q</strong> 的物理盯市。Bergault 等的多资产做市模型展示了协方差与跨资产订单怎样共同塑造报价，但现实还要加入离散 tick、执行和组织净额边界。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="adverse-selection-separation">
        <p className="section-kicker">27 · Inventory 与 Adverse Selection 分开</p>
        <h2>库存渠道问“持有随机价值有什么成本”，信息渠道问“为什么对手方恰在你的报价过时时选择成交”；二者会同时改变 quote，却不是同一个机制。</h2>
        <div className="table-scroll" role="region" aria-label="库存与逆向选择渠道比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一报价变化的两条因果路径</caption>
            <thead><tr><th scope="col">维度</th><th scope="col">Inventory channel</th><th scope="col">Adverse-selection channel</th></tr></thead>
            <tbody>
              <tr><th scope="row">状态</th><td>q、q*、hedge、Σ、限额与期限</td><td>私有/公共信息、订单毒性与 stale quote</td></tr>
              <tr><th scope="row">直接问题</th><td>再增一单位组合风险多大？</td><td>成交是否意味着参考价值已经改变？</td></tr>
              <tr><th scope="row">典型控制</th><td>方向性 skew、size、hedge、participation</td><td>更新 fair value、widen、cancel、降 size</td></tr>
              <tr><th scope="row">可见结果</th><td>中心与两侧成交不对称</td><td>markout、永久价格更新与毒性状态</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          公共坏消息可在 q=0 时让 center 下移；高信息风险可在 x=0 时扩大 width。反过来，完全没有知情交易者，风险厌恶 dealer 仍会因为随机价格风险而 skew。Cartea–Jaimungal–Ricci 把 adverse selection 显式纳入做市策略，说明经验模型若只用 inventory 项，容易把订单流信息错误吸收到库存系数。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-loop">
        <p className="section-kicker">28 · 局部负反馈闭环</p>
        <h2>库存控制的稳定机制不是“报价一次就回归”，而是状态依赖的多轮随机反馈。</h2>
        <div className="mechanism-chain" aria-label="库存报价局部负反馈链">
          {[
            ['偏离生成', '过去 quotes、标的 fills、同一标的主动交易与 q* 修订形成 xₜ=qₜ−q*ₜ'],
            ['边际风险改变', 'γ、Σ、τ 与限额把 xₜ 转成增量库存收费'],
            ['控制响应', '调整 center / width、两侧 size、hedge 或 participation'],
            ['成交分布改变', '相对报价、queue 与外部流改变 ask/bid fill 强度和规模'],
            ['状态更新', 'ask fill 降低 q 与 x，bid fill 提高 q 与 x；q* 修订也会改变 x'],
            ['反馈再估计', '外部 hedge z 改变给定 q 的残余风险但不直接改变 x；新状态进入下一次控制'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <div className="equation-card">
          <span>小窗口内的期望库存偏离漂移</span>
          <div>E[Δx | state] ≈ λ<sup>b</sup>E[L<sup>b</sup><sub>fill</sub>]Δt − λ<sup>a</sup>E[L<sup>a</sup><sub>fill</sub>]Δt + E[Δq<sup>active</sup> | state] − E[Δq* | state]</div>
          <p>Δq<sup>active</sup> 是同一标的主动交易造成的有符号库存变化：主动买入为正、卖出为负；固定 q* 时最后一项为零。相关资产 hedge z 只改变残余风险和下一轮控制参数，不直接改变 x；若用同一标的主动 hedge，就必须进入 Δq<sup>active</sup> 项。</p>
        </div>
        <p>
          只要 long 时净期望成交使 E[x<sub>t+1</sub>−x<sub>t</sub>|x<sub>t</sub>]&lt;0，short 时相反，这就是局部 mean reversion（均值回归）。但外部订单流可以比控制反应更强，目标会移动，价格冲击与信息也会改变参与；所以“存在负反馈”不等于每条样本路径单调回零，更不等于当日收盘必须为零。Hasbrouck–Sofianos 甚至观察到部分股票库存调整可持续一到两个月。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="stress-nonlinearity">
        <p className="section-kicker">29 · 压力状态中的非线性</p>
        <h2>当库存接近硬限额、波动跳升或 hedge 失灵时，平滑 skew 可能被 widen、削量、主动对冲甚至退出所替代。</h2>
        <p>
          二次风险和线性 reservation slope 适合解释目标附近的小偏离。接近 position limit 时，再增加一单位的资本收费可能骤升；若波动跳升同时伴随相关结构突变或 basis 扩大，组合 hedge 的有效性可能下降；订单毒性上升又让纠偏侧成交未必安全；margin 和 funding 约束会把未来风险转成当下现金需求。此时控制函数可呈分段、非对称、状态跳变甚至 no-quote region。
        </p>
        <p>
          Hansch–Naik–Viswanathan 在 pre-SETS LSE dealer 市场中发现库存调整与 interdealer trading 在极端库存处更明显；Comerton-Forde 等用十一年 NYSE specialist 数据把极端库存、亏损和流动性变化联系起来；Garriott、van Kervel 与 Zoican 对 TMX 加拿大主权期货的研究又表明 queue position 会约束风险共享，其模型反事实中，优化风险共享的排队顺序会使 quoted depth 最多下降 8.4%。这个数字只属于该设计与样本。它们共同反驳“单一线性 q 系数在所有状态稳定”，但不能拼成一个跨制度通用参数。<Cite n={13} /><Cite n={19} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="identification-boundary">
        <p className="section-kicker">30 · 从机制一致到因果识别</p>
        <h2>正确时序只是最低门槛；要识别库存冲击，必须阻断同时决定 q 与 quote 的共同原因。</h2>
        <p>
          理想因果量可以写成：在同一公共价值、订单流机会、风险状态、目标与 hedge 条件下，让某做市商的 pre-quote inventory deviation 外生增加一单位，对随后 center、width、两侧 size、hedge、fills 与 x 回归速度的局部影响。现实无法同时看到两个潜在结果，只能寻找近似这个反事实的 variation。
        </p>
        <div className="boundary-box">
          <b>普通固定效应回归仍然不够</b>
          <p>Dealer fixed effects 能删除不随时间变化的平均差异，time fixed effects 能吸收共同冲击，却不能删除时变私有信息、过去主动报价选择、移动 q*、未观察 hedge、风险限额或 dealer-specific client flow。它们都可能同时改变 q 与 quote。</p>
        </div>
        <p>
          Hendershott–Seasholes 的库存组合与后续收益关系与库存压力相容，也与信息解释相容；Hendershott–Menkveld 使用 state-space（状态空间模型：用不可直接观察的有效价格状态解释可见价格）与结构模型，把永久信息创新和暂时价格压力分开。在 1994–2005 年 697 只 NYSE 股票中，他们估计平均压力为 49 bp（basis points，基点；1 bp=0.01%），半衰期为 0.92 日，即模型中的暂时压力平均约 0.92 日衰减一半。后一结果更有结构解释力，但数值仍依赖历史 specialist 制度、状态空间规格和模型识别，不是现代电子做市的校准常数。<Cite n={18} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">31 · 经验文献不是一张投票表</p>
        <h2>不同研究观察到的是不同主体、市场制度、时间尺度与控制动作；看似冲突的结果常是在回答不同问题。</h2>
        <div className="table-scroll" role="region" aria-label="库存报价经验研究地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>证据必须连同样本与识别边界一起读</caption>
            <thead><tr><th scope="col">研究</th><th scope="col">对象 / 样本</th><th scope="col">主要启示</th><th scope="col">不能外推</th></tr></thead>
            <tbody>
              <tr><th scope="row">Hasbrouck–Sofianos (1993)</th><td>TORQ，144 只 NYSE 股票，1990-11 至 1991-01</td><td>库存调整速度跨股票差异大，部分达一两个月</td><td>不是 universal intraday reset 或纯因果 skew</td></tr>
              <tr><th scope="row">Madhavan–Smidt (1993)</th><td>一个 specialist firm、16 只股票、1987</td><td>raw inventory 调整慢；估计 target 后半衰期约 7.3 日</td><td>target 是模型估计，不是直接观察；不能跨制度套数值</td></tr>
              <tr><th scope="row">Madhavan–Sofianos (1998)</th><td>NYSE SPETS，1993-07，广样本及逐笔子样本</td><td>选择是否参与与 size 是重要库存工具</td><td>price quote 不是唯一控制，也不代表现代算法簿</td></tr>
              <tr><th scope="row">Manaster–Mann (1996)</th><td>期货场内交易者</td><td>正库存—reservation 关系可反映主动头寸</td><td>被动 dealer 线性符号并非所有中介定律</td></tr>
              <tr><th scope="row">Comerton-Forde et al. (2010)</th><td>十一年 NYSE specialist 数据</td><td>极端库存与收入状态同流动性恶化相关</td><td>观察性、历史制度、可能非线性</td></tr>
              <tr><th scope="row">Hendershott–Menkveld (2014)</th><td>697 股、1994–2005 日频 specialist 状态</td><td>结构模型分离暂时压力与永久创新</td><td>49 bp / 0.92 日是样本—模型结果</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          还有三类边界证据尤其重要：Kavajecz–Odders-White 对 price schedule 的库存结果较弱，提示控制可能走 size 或其他渠道；Naik–Yadav 发现组织层级改变哪些库存聚合有解释力；Panayides 比较不同 NYSE 时期，说明 specialist obligation 会让库存—报价关系受制度状态约束。证据不是简单“支持/反对库存模型”，而是在定位机制在哪种主体、动作和制度下更可见。<Cite n={15} /><Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="data-estimation">
        <p className="section-kicker">32 · 数据与估计协议</p>
        <h2>要从事件数据估计库存控制，必须把状态、动作、机会与结果放在同一可审计时钟上。</h2>
        <div className="protocol-grid">
          <article><span>01</span><h3>识别主体与账户</h3><p>确认 participant、desk、firm 或推断 maker；报告无法观察的跨场所与客户内部化边界。</p></article>
          <article><span>02</span><h3>重建 pre-quote q</h3><p>按 maker sign 逐笔更新，使用 q<sub>t−</sub> 解释 quote；处理 overnight、corporate action、assignment 与初始库存。</p></article>
          <article><span>03</span><h3>版本化 q*</h3><p>记录目标来源、更新时间、限额与业务 mandate；看不到 q* 时分别报告 raw q、估计 target 与敏感性。</p></article>
          <article><span>04</span><h3>同步参考价值</h3><p>定义 venue/consolidated mid、lead–lag、locked/crossed 与 stale quote；加入相关市场和公共消息创新。</p></article>
          <article><span>05</span><h3>拆开控制变量</h3><p>分别测 center y、width w、δ<sup>a</sup>/δ<sup>b</sup>、size、cancel、hedge 与 participation，不用“quote”单列吞并。</p></article>
          <article><span>06</span><h3>测量成交机会</h3><p>记录 queue ahead、tick、竞争报价、主动单方向与规模；未成交订单也属于风险集。</p></article>
          <article><span>07</span><h3>多 horizon 结果</h3><p>估计 fill hazard、成交量、后续 x、markout、P&amp;L 与 tail；不要只看下一次 quote。</p></article>
          <article><span>08</span><h3>识别与安慰剂</h3><p>检查预趋势、反方向、未受影响 dealer/asset、伪冲击时点和公共价值通道，报告标准误聚类层级。</p></article>
        </div>
        <p>
          参数单位也必须审计：q 是股、手、合约还是风险单位；σ² 是每秒、每日还是期限内方差；κ 是每美元、每 tick 还是每 basis point；γ 的货币单位是否与 wealth 一致。若一次成交 size 不为一，直接把 A–S 的 unit-inventory 公式套在股数上会产生量纲和尺度错误。Hasbrouck 的经验市场微观结构框架可作为事件时钟、交易方向与 quote 数据处理的系统参考。<Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先在原始状态上判断方向和计算，再揭示模型边界，避免把公式看熟误当成真正会用。</h2>
        <p>
          Mode A 训练 target deviation、reservation price、center/width 与 long/short 符号；Mode B 训练到达权衡、size 凸风险、最小方差 hedge 与因果证据等级。每题提交前只给事实，不显示解题桥。
        </p>
        <InventoryQuoteLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 反例库</p>
        <h2>每个简化命题都应当经受一个只改变关键条件的反例。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>q 高但 center 不动</h3><p>实际 q 已被指数期货或客户负债抵消，残余风险接近目标；raw q 大不等于边际风险大。</p></article>
          <article><span>反例 02</span><h3>q=0 但 center 下移</h3><p>公共坏消息让 fair-value proxy 下调；这是价值更新，不是库存 skew。</p></article>
          <article><span>反例 03</span><h3>x=0 但 width 扩大</h3><p>波动、订单毒性或 hedge liquidity 恶化；库存中性不会删除其他 spread 组件。</p></article>
          <article><span>反例 04</span><h3>没有 price skew 也回到目标</h3><p>自然反向客户流、调整两侧 size 后产生的成交、同一标的主动减仓或明确的 q* 修订都可让 x 下降，center 可以近似不变；相关资产 hedge 可在 x 不变时降低残余风险。</p></article>
          <article><span>反例 05</span><h3>center 下移后 q 仍上升</h3><p>共同卖压强到足以连续击中较远 bid；负反馈存在却被外部冲击暂时压过。</p></article>
          <article><span>反例 06</span><h3>单票都小但组合风险大</h3><p>许多头寸共同暴露市场因子，Σx 的边际风险很高；逐票限额漏掉共振。</p></article>
          <article><span>反例 07</span><h3>临近 T 反而更积极清仓</h3><p>加入终端 liquidation penalty 或硬约束后，原 A–S mid-mark 终点的时间方向可以逆转。</p></article>
          <article><span>反例 08</span><h3>库存—报价符号相反</h3><p>Dealer 主动建立方向性头寸、移动 target 或先看见信息；观察相关性没有隔离被动纠偏渠道。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 把机制压缩成可证伪研究</p>
        <h2>研究问题不应是“库存是否重要”，而应明确哪一种外生偏离、通过哪一个控制接口、在多长时间内改变什么。</h2>
        <div className="research-card">
          <span>研究题 A · Dealer-specific allocation shock</span>
          <h3>不可预测且不含公共价值信息的被动成交分配，是否使中签 dealer 的下一轮 center 向纠偏方向移动？</h3>
          <p><b>处理：</b>规则决定、事前不可预测的 dealer-specific allocation 或 queue tie-break。<b>对照：</b>同一证券同一时刻未中签但事前状态相近的 dealer。<b>结果：</b>pre-specified horizon 的 y、w、两侧 size、hedge 与 x。<b>失败：</b>allocation 取决于隐藏 queue skill、私有信息或同时改变声誉/义务。</p>
        </div>
        <div className="research-card">
          <span>研究题 B · Inventory limit kink</span>
          <h3>接近预先设定且事后不可操纵的内部风险阈值时，quote response 是否出现可检测的非线性拐点？</h3>
          <p><b>设计：</b>比较阈值两侧窄窗口，先检验 q 是否在阈值处被精确操纵。<b>结果：</b>skew slope、size、cancel、hedge 和 participation。<b>机制：</b>资本或限额的边际收费跳升。<b>失败：</b>阈值随信息状态移动，或管理者在接近阈值前主动选择样本。</p>
        </div>
        <div className="research-card">
          <span>研究题 C · Hedge outage / cost shock</span>
          <h3>不直接改变标的 fundamental 的 hedge-venue 技术中断或费用跳变，是否放大相同 raw q 对 quote 的敏感度？</h3>
          <p><b>设计：</b>受影响库存暴露与低相关暴露的差异比较，并排除同步市场新闻。<b>预测：</b>|∂y/∂q|、width 与降 size 上升，主动 hedge 下降。<b>证伪：</b>冲击前已有分化，或中断也直接阻断标的流动性与价格发现。</p>
        </div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>每题都要求先固定对象和条件，再计算或设计证据。</h2>
        <div className="practice-grid">
          <article>
            <span>练习 01 · 报价几何</span>
            <h3>m=100、b=99.94、a=100.02。计算 c、w、h、y、δ<sup>a</sup> 与 δ<sup>b</sup>，并判断哪一侧更积极。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>c=(99.94+100.02)/2=99.98；w=0.08；h=0.04；y=99.98−100=−0.02；δ<sup>a</sup>=100.02−100=0.02；δ<sup>b</sup>=100−99.94=0.06。Ask 更接近 mid，做市商相对更积极卖出；这是中心下移，不是 width 改变。</p></details>
          </article>
          <article>
            <span>练习 02 · A–S 近似</span>
            <h3>m=$100、x=5、γ=0.5/$、σ²τ=0.01$²、κ=20/$。计算 r、w*、a*、b*，并列出至少四项适用条件。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>r=100−5×0.5×0.01=$99.975。w*=0.5×0.01+(2/0.5)ln(1+0.5/20)=0.005+4ln(1.025)≈$0.10377。a*=99.975+0.05189≈$100.02689；用未舍入的 w*/2 计算，b*≈$99.92311。条件包括对称指数到达、单位库存尺度、CARA、Brownian mid、有限期限 mid-mark、渐近/线性近似，并忽略 tick、queue、信息、费用、impact 和 hedge。用 x 替 q 还要求 target 已有明确经济闭合。</p></details>
          </article>
          <article>
            <span>练习 03 · Size 与凸风险</span>
            <h3>x=12、ask size L<sup>a</sup>=5、bid size L<sup>b</sup>=3。两侧分别完全成交后 x 与 x² 怎样变化？</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>Ask fill 后 x=12−5=7，平方分数从 144 降至 49，变化 −95；bid fill 后 x=12+3=15，分数升至 225，变化 +81。数量不同，所以不能只比较两侧方向；实际决策还需乘成交概率并加入收入与其他风险。</p></details>
          </article>
          <article>
            <span>练习 04 · 最小方差 hedge</span>
            <h3>q=10、Var(S)=4、Var(H)=1、Cov(S,H)=1.5。求 z*、未对冲与对冲后方差，并解释为何不是完全对冲。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>z*=−10×1.5/1=−15；未对冲方差 400；对冲后 400+225−450=175。相关系数只有 0.75，因而存在 basis/residual risk；估计协方差、交易成本、margin 与相关性漂移也未进入。</p></details>
          </article>
          <article>
            <span>练习 05 · 内生性设计</span>
            <h3>你观察到 q<sub>t−</sub> 高的 dealer 随后 center 较低。写出可支持的最弱结论、五个混淆因素，以及一种更可信的研究设计。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>最弱结论是关系与 inventory channel 一致。混淆至少包括过去报价选择、公共/私有价值更新、移动 q*、未观察 hedge、主动方向头寸、客户流、限额和 queue。更可信设计可利用同一证券同一时刻、规则造成且不含价值信息的 dealer-specific 被动 allocation，比较中签与未中签 dealer 的下一轮 y、w、size、hedge 与 x，并做预趋势、伪时点和反方向检验。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>能够脱离公式说明“状态怎样经过控制改变下一状态”，才算真正理解。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么 target q* 不能自动消除实际 q 的风险？</summary><p>标的价格变化首先产生 qΔm。只有 q* 对应已计入的反向负债、hedge、benchmark 或业务效用时，围绕 x 的残余风险才有闭合解释；改名字不会改变物理现金流。</p></details>
          <details><summary>02 · E[Δm]=0 时为何仍会有 inventory adjustment？</summary><p>均值为零不等于方差为零。风险厌恶者在确定性等价中扣除持仓方差，边际库存因此有风险收费。</p></details>
          <details><summary>03 · Long deviation 在最小模型里怎样移动两侧？</summary><p>内部 reservation price 下移；若策略围绕 r 对称报价、令 c=r 且 width 固定，实际 ask 才更靠近 mid、bid 更远离 mid，从而相对鼓励卖出、抑制继续买入。</p></details>
          <details><summary>04 · 为什么 center 下移不等于 spread widening？</summary><p>Center y 与 half-width h 是独立坐标。两侧同幅下移会改变 y，但 a−b 保持不变。</p></details>
          <details><summary>05 · λ 与成交概率有什么区别？</summary><p>λ 是单位时间条件强度；固定状态的 Poisson 窗口内，至少一次概率才是 1−e<sup>−λΔt</sup>。真实改价、queue 和部分成交会破坏简单转换。</p></details>
          <details><summary>06 · 风险中性为什么不意味着 zero spread？</summary><p>即使没有风险罚金，报得远会提高每笔 capture、降低成交率。指数强度基准下单侧最优距离为 1/κ。</p></details>
          <details><summary>07 · A–S 显式公式为什么不是一般 HJB 精确解？</summary><p>一般问题先用 value-function 相邻库存状态差和隐式一阶条件求解；常用线性 center 与显式 width 来自对称指数强度及库存/到达项的渐近和线性近似。</p></details>
          <details><summary>08 · Price skew、size 与 hedge 分别控制什么？</summary><p>Skew 改变两侧相对成交机会；size 改变成交后的库存跳幅；hedge 改变给定 q 的组合残余风险。三者不是同一个动作。</p></details>
          <details><summary>09 · 为什么 q 高、center 低仍不足以证明因果？</summary><p>q 由过去 quote、成交与信息内生生成，公共价值、移动 target、主动头寸和未观察 hedge 可同时决定 q 与 center。需要可信的 dealer-specific variation。</p></details>
          <details><summary>10 · 局部负反馈为何不保证样本路径单调回零？</summary><p>控制只改变条件成交分布；外部单边 flow、目标变化、信息冲击和约束可压过纠偏。均值回归是条件期望性质，不是每一步确定下降。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节完成单一流动性提供者的局部库存控制；竞争、非线性期权风险、一般 agent 优化与系统性流动性螺旋留给各自章节。</h2>
        <div className="interface-grid">
          <article><span>← 1.12</span><h3>Market Maker 为什么存在</h3><p>1.12 建立即时性服务和现金—库存账本；本节把成交后的库存状态映射成下一轮报价与控制。</p></article>
          <article><span>← 1.10</span><h3>Adverse Selection</h3><p>1.10 解释信息如何选择并淘汰过时报价；本节把信息渠道作为库存识别必须控制的独立路径。</p></article>
          <article><span>→ 1.14</span><h3>Liquidity Provider Competition 与 HFT</h3><p>下一节加入多个提供者、速度、queue 与竞争；本节不把单主体最优反应外推成市场均衡。</p></article>
          <article><span>→ 1.24 / 2.08 / 7.11</span><h3>Greeks、Agent 与 Liquidity Spiral</h3><p>分别处理期权非线性对冲、完整主体目标与策略，以及多个中介同步收缩形成的系统正反馈。</p></article>
        </div>
        <p className="closing-thesis">面对“库存偏离后为什么改报价”，应依次追问：实际 q 与目标 q* 分别是什么，target 是否对应真实对冲或业务基准；使用的是 pre-quote 还是 post-fill 库存；价格风险通过 qΔm 怎样进入 wealth；风险函数和终端条件为何使边际库存有成本；reservation price 是内部无差异价值还是公共价格预测；center/skew 与 width 是否分开；报价距离如何通过可检验的 fill function 改变两侧成交；size、hedge 与 participation 是否另行记录；经典显式公式用了哪些近似；历史证据观察的是哪类中介、制度和控制动作；共同消息、过去报价、移动 target 与未观察 hedge 是否被阻断。只有这条闭环完整，inventory risk 才从一个相关变量变成可解释、可操作又可证伪的动态机制。</p>
      </section>
    </>
  );
}

export const lesson113: LessonRecord = {
  slug: '1-13',
  id: '1.13',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Inventory Risk 与 Quote Adjustment',
  subtitle: '从内生库存状态与目标库存偏离出发，用风险调整确定性等价推导 reservation price，再把 quote center / skew、spread width、size、arrival probability 与 hedge 分开，建立报价—成交—库存的动态反馈和因果识别边界',
  readingTime: '约 105–115 分钟（核心阅读 62–66＋互动 14–15＋主动练习 18–20＋理解检查 8–10＋课程接口 3；参考文献与延伸阅读不计）',
  prerequisite: '1.12 · Market Maker 为什么存在；建议回看 1.10 的 Adverse Selection ≠ Inventory Risk',
  updatedAt: '2026-08-28',
  revision: '1.13-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.13-r1',
      summary: '要求修正一处作者名，区分 A–S 用于构造成交强度的 temporary-impact mapping 与其真正省略的 mid 内生/永久冲击，把压力期相关性改为条件陈述，并精确表述 queue 论文 8.4% 的风险共享排序反事实。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.13-r1',
      summary: '要求显式补上 reservation price r 到实际 quote center c 的条件控制桥，拆开 external hedge 与 x=q−q* 的状态更新，并补齐零背景术语、size 过度纠偏边界、压力条件句和更诚实的学习时间预算。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.13-r2',
      summary: '确认 r1 四项准确性意见全部关闭；要求把 skew 对 E[Δx] 的作用写成相对无 skew 反事实下降而非必然负漂移，并删除相关资产 hedge 会直接降低 x 的残余表述。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.13-r2',
      summary: '确认核心 r→c 桥、漂移式、术语、size 边界、压力条件与时间预算已经解决；要求在内生性标题、反例、Price Skew、理解检查和互动中全局统一 x 与 external hedge 的边界及条件性 center 传导。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.13-r3',
      summary: '确认 r2 的 skew 反事实与 external-hedge 边界已全局关闭；要求在 E[Δx] 漂移式中显式加入同一标的主动交易项，并修正 A–S 练习 bid 的末位舍入。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.13-r3',
      summary: '39 节认知坡度、r→c 条件桥、q/q*/x/hedge 分离、skew 反事实、零背景术语、105–115 分钟预算、互动/练习/checks、反例、研究设计、可访问性与移动端源码全量回归通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.13-r4',
      summary: '确认同一标的主动交易项与 A–S bid 舍入修正完整关闭 r3 意见；公式、单位、模型边界、经验数字、23 条来源、39 个引用及全部练习互动全量回归通过，无 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.13-r4',
      summary: '独立重审 r4，确认新增主动交易漂移项与舍入修正未引入教学回归；对象边界、因果链、39 节结构、零背景桥、互动练习、时间预算及可访问性全部通过，无 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-12', label: '1.12 Market Maker 为什么存在' },
  next: { slug: '1-14', label: '1.14 Liquidity Provider Competition 与 HFT' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'object-map', label: '对象地图' },
    { id: 'state-timeline', label: '事件时钟' },
    { id: 'inventory-exposure', label: '实际库存暴露' },
    { id: 'target-inventory', label: '目标库存' },
    { id: 'inventory-deviation', label: '目标偏离' },
    { id: 'endogenous-inventory', label: '库存内生性' },
    { id: 'mean-variance-risk', label: '二次风险代价' },
    { id: 'risk-aversion', label: '风险厌恶斜率' },
    { id: 'time-horizon', label: '剩余期限' },
    { id: 'reservation-price', label: 'Reservation Price' },
    { id: 'worked-reservation', label: 'Reservation 算例' },
    { id: 'quote-coordinate-system', label: '报价坐标系' },
    { id: 'center-vs-width', label: 'Center / Width' },
    { id: 'price-skew', label: 'Price Skew' },
    { id: 'long-short-signs', label: '多空符号' },
    { id: 'arrival-intensity', label: '成交强度' },
    { id: 'fill-probability', label: '成交概率' },
    { id: 'risk-neutral-distance', label: '风险中性距离' },
    { id: 'as-model-ingredients', label: 'A–S 假设' },
    { id: 'as-optimal-quotes', label: 'A–S 报价近似' },
    { id: 'comparative-statics', label: '比较静态' },
    { id: 'size-adjustment', label: 'Size 调整' },
    { id: 'size-risk-example', label: 'Size 风险算例' },
    { id: 'hedge-decision', label: 'Hedge 决策' },
    { id: 'hedge-residual-risk', label: '残余风险' },
    { id: 'multi-asset-inventory', label: '多资产库存' },
    { id: 'adverse-selection-separation', label: '信息风险边界' },
    { id: 'feedback-loop', label: '负反馈闭环' },
    { id: 'stress-nonlinearity', label: '压力非线性' },
    { id: 'identification-boundary', label: '因果识别边界' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'data-estimation', label: '数据与估计协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson113Content,
  references: [
    {
      id: 1,
      authors: 'Mark B. Garman',
      year: '1976',
      title: 'Market Microstructure',
      publication: 'Journal of Financial Economics, 3(3), 257–275',
      url: 'https://doi.org/10.1016/0304-405X(76)90006-4',
      use: '从随机订单到达和 dealer inventory 出发解释交易连续性与库存控制；其制度和过程假设不是现代订单簿的完整描述。',
    },
    {
      id: 2,
      authors: 'Yakov Amihud & Haim Mendelson',
      year: '1980',
      title: 'Dealership Market: Market-Making with Inventory',
      publication: 'Journal of Financial Economics, 8(1), 31–53',
      url: 'https://doi.org/10.1016/0304-405X(80)90020-3',
      use: '建立库存持有成本与 dealer 报价/库存策略的经典模型；不作为无约束现代算法的直接校准。',
    },
    {
      id: 3,
      authors: 'Thomas S. Y. Ho & Hans R. Stoll',
      year: '1981',
      title: 'Optimal Dealer Pricing under Transactions and Return Uncertainty',
      publication: 'Journal of Financial Economics, 9(1), 47–73',
      url: 'https://doi.org/10.1016/0304-405X(81)90020-9',
      use: '从风险厌恶、交易不确定性和价格风险推出 inventory-dependent reservation valuation；模型结论须连同单 dealer 假设读取。',
    },
    {
      id: 4,
      authors: 'Thomas S. Y. Ho & Hans R. Stoll',
      year: '1983',
      title: 'The Dynamics of Dealer Markets Under Competition',
      publication: 'Journal of Finance, 38(4), 1053–1074',
      url: 'https://doi.org/10.1111/j.1540-6261.1983.tb02282.x',
      use: '说明竞争 dealer 的库存与 reservation prices 相互作用；本节只取其作为下一节多主体竞争的边界。',
    },
    {
      id: 5,
      authors: 'Marco Avellaneda & Sasha Stoikov',
      year: '2008',
      title: 'High-Frequency Trading in a Limit Order Book',
      publication: 'Quantitative Finance, 8(3), 217–224',
      url: 'https://doi.org/10.1080/14697680701381228',
      use: '支持有限期限 CARA–Brownian–Poisson 基准、相邻 value-state reservation prices、隐式最优距离及其渐近显式近似；不把近似公式称为一般精确解。',
    },
    {
      id: 6,
      authors: 'Olivier Guéant, Charles-Albert Lehalle & Joaquin Fernandez-Tapia',
      year: '2013',
      title: 'Dealing with the Inventory Risk: A Solution to the Market Making Problem',
      publication: 'Mathematics and Financial Economics, 7, 477–507',
      url: 'https://doi.org/10.1007/s11579-012-0087-0',
      use: '扩展库存风险做市问题并澄清可解结构、终端条件与近似边界。',
    },
    {
      id: 7,
      authors: 'Olivier Guéant',
      year: '2017',
      title: 'Optimal Market Making',
      publication: 'Applied Mathematical Finance, 24(2), 112–154',
      url: 'https://doi.org/10.1080/1350486X.2017.1342552',
      use: '提供一般成交强度、风险限制和多种做市控制的系统框架；用于限定简单指数强度与线性近似。',
    },
    {
      id: 8,
      authors: 'Álvaro Cartea, Sebastian Jaimungal & Jason Ricci',
      year: '2014',
      title: 'Buy Low, Sell High: A High Frequency Trading Perspective',
      publication: 'SIAM Journal on Financial Mathematics, 5(1), 415–444',
      url: 'https://doi.org/10.1137/130911196',
      use: '把 order-flow imbalance 和 adverse-selection cost 纳入高频做市控制，支持库存与信息渠道必须分开。',
    },
    {
      id: 9,
      authors: 'Philippe Bergault, David Evangelista, Olivier Guéant & Douglas Vieira',
      year: '2021',
      title: 'Closed-Form Approximations in Multi-Asset Market Making',
      publication: 'Applied Mathematical Finance, 28(2), 101–142',
      url: 'https://doi.org/10.1080/1350486X.2021.1949359',
      use: '说明多资产协方差与订单到达怎样进入组合做市报价，并为 x′Σx 的教学扩展提供正式接口。',
    },
    {
      id: 10,
      authors: 'Joel Hasbrouck & George Sofianos',
      year: '1993',
      title: 'The Trades of Market Makers: An Empirical Analysis of NYSE Specialists',
      publication: 'Journal of Finance, 48(5), 1565–1593',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05121.x',
      use: '用 TORQ 的 144 股历史 specialist 数据展示库存调整跨股票差异及部分长达一两个月；不支持统一日内清零或单向因果解释。',
    },
    {
      id: 11,
      authors: 'Ananth Madhavan & Seymour Smidt',
      year: '1993',
      title: 'An Analysis of Changes in Specialist Inventories and Quotations',
      publication: 'Journal of Finance, 48(5), 1595–1628',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05122.x',
      use: '在一个 firm、16 股、1987 年样本中联合分析库存与报价，并区分 raw inventory 与估计 target；半衰期严格限于该设计。',
    },
    {
      id: 12,
      authors: 'Ananth Madhavan & George Sofianos',
      year: '1998',
      title: 'An Empirical Analysis of NYSE Specialist Trading',
      publication: 'Journal of Financial Economics, 48(2), 189–210',
      url: 'https://doi.org/10.1016/S0304-405X(98)00008-7',
      use: '用 1993 年 SPETS 数据显示 specialist 可通过参与选择与交易规模管理库存；price skew 不是唯一可观察接口。',
    },
    {
      id: 13,
      authors: 'Oliver Hansch, Narayan Y. Naik & S. Viswanathan',
      year: '1998',
      title: 'Do Inventories Matter in Dealership Markets? Evidence from the London Stock Exchange',
      publication: 'Journal of Finance, 53(5), 1623–1656',
      url: 'https://doi.org/10.1111/0022-1082.00067',
      use: '提供 pre-SETS LSE dealer inventory、报价和 interdealer trading 的非线性证据；电话/报价型制度限制外推。',
    },
    {
      id: 14,
      authors: 'Steven Manaster & Steven C. Mann',
      year: '1996',
      title: 'Life in the Pits: Competitive Market Making and Inventory Control',
      publication: 'Review of Financial Studies, 9(3), 953–975',
      url: 'https://doi.org/10.1093/rfs/9.3.953',
      use: '以期货场内数据提供简单被动库存控制符号的反例，提示 dealer 可能主动选择方向性头寸。',
    },
    {
      id: 15,
      authors: 'Kenneth A. Kavajecz & Elizabeth R. Odders-White',
      year: '2001',
      title: 'An Examination of Changes in Specialists’ Posted Price Schedules',
      publication: 'Review of Financial Studies, 14(3), 681–704',
      url: 'https://doi.org/10.1093/rfs/14.3.681',
      use: '提供历史 TORQ price-schedule 调整中库存效应较弱的边界证据，提醒控制可通过 size、参与或其他渠道发生。',
    },
    {
      id: 16,
      authors: 'Narayan Y. Naik & Pradeep K. Yadav',
      year: '2003',
      title: 'Do Dealer Firms Manage Inventory on a Stock-by-Stock or a Portfolio Basis?',
      publication: 'Journal of Financial Economics, 69(2), 325–353',
      url: 'https://doi.org/10.1016/S0304-405X(03)00115-6',
      use: '用 1994 年 LSE 20 股数据比较股票层与 firm-equivalent inventory，说明协方差风险与组织净额边界；不把特定聚合结果当跨机构定律。',
    },
    {
      id: 17,
      authors: 'Marios Panayides',
      year: '2007',
      title: 'Affirmative Obligations and Market Making with Inventory',
      publication: 'Journal of Financial Economics, 86(2), 513–542',
      url: 'https://doi.org/10.1016/j.jfineco.2006.11.002',
      use: '比较历史 NYSE specialist 环境并说明 affirmative obligation 会约束库存依赖报价；不能外推为当前所有 DMM 规则。',
    },
    {
      id: 18,
      authors: 'Terrence Hendershott & Mark S. Seasholes',
      year: '2007',
      title: 'Market Maker Inventories and Stock Prices',
      publication: 'American Economic Review, 97(2), 210–214',
      url: 'https://doi.org/10.1257/aer.97.2.210',
      use: '把历史 NYSE specialist inventory 与未来回报联系起来；结果同时可能包含库存压力和信息，不能单独识别因果。',
    },
    {
      id: 19,
      authors: 'Carole Comerton-Forde, Terrence Hendershott, Charles M. Jones, Pamela C. Moulton & Mark S. Seasholes',
      year: '2010',
      title: 'Time Variation in Liquidity: The Role of Market-Maker Inventories and Revenues',
      publication: 'Journal of Finance, 65(1), 295–331',
      url: 'https://doi.org/10.1111/j.1540-6261.2009.01530.x',
      use: '以十一年 NYSE specialist 数据把极端 inventories、revenues 与 spread 状态联系起来；用于非线性边界而非恒定因果系数。',
    },
    {
      id: 20,
      authors: 'Terrence Hendershott & Albert J. Menkveld',
      year: '2014',
      title: 'Price Pressures',
      publication: 'Journal of Financial Economics, 114(3), 405–423',
      url: 'https://doi.org/10.1016/j.jfineco.2014.08.001',
      use: '在 697 股、1994–2005 NYSE 数据中用 state-space 与结构模型分离暂时压力和永久创新；49 bp 与 0.92 日只属于该样本规格。',
    },
    {
      id: 21,
      authors: 'Maureen O’Hara',
      year: '1995',
      title: 'Market Microstructure Theory',
      publication: 'Blackwell Publishers',
      url: 'https://www.wiley.com/en-us/Market+Microstructure+Theory-p-9780631207610',
      use: '用于库存、信息与 dealer 市场理论的二手系统综合；关键公式与经验数字仍回到原始论文。',
    },
    {
      id: 22,
      authors: 'Corey Garriott, Vincent van Kervel & Marius A. Zoican',
      year: '2025',
      title: 'Queuing and Inventories in Limit Order Markets',
      publication: 'Journal of Financial Markets, 75, 100982',
      url: 'https://doi.org/10.1016/j.finmar.2025.100982',
      use: '以 TMX 加拿大主权期货说明 queue position 会约束做市风险共享；“优化风险共享的排序使 quoted depth 最多下降 8.4%”严格限于其模型反事实与样本。',
    },
    {
      id: 23,
      authors: 'Joel Hasbrouck',
      year: '2007',
      title: 'Empirical Market Microstructure: The Institutions, Economics, and Econometrics of Securities Trading',
      publication: 'Oxford University Press',
      url: 'https://doi.org/10.1093/oso/9780195301649.001.0001',
      use: '提供交易方向、事件数据、quote/trade 同步与经验识别的系统工具；本节数据协议据此组织。',
    },
  ],
  readingList: [
    {
      title: 'Ho & Stoll (1981), Optimal Dealer Pricing under Transactions and Return Uncertainty',
      scope: '模型设定、reservation valuation、库存与价格风险的 comparative statics；推导作为进阶',
      reason: '建立库存为何进入 dealer 内部边际价值的经典经济学起点。',
      url: 'https://doi.org/10.1016/0304-405X(81)90020-9',
    },
    {
      title: 'Avellaneda & Stoikov (2008), High-Frequency Trading in a Limit Order Book',
      scope: '第 2–3 节，重点区分一般 HJB、reservation bid/ask、隐式距离与第 3.2 节近似',
      reason: '学会使用最常见公式，同时准确说出它从哪些假设和近似而来。',
      url: 'https://math.nyu.edu/inmemoriam/avellaneda/HighFrequencyTrading.pdf',
    },
    {
      title: 'Guéant, Lehalle & Fernandez-Tapia (2013), Dealing with the Inventory Risk',
      scope: '模型变换、可解结构、terminal penalty 与近似解',
      reason: '从课堂式 A–S 公式走向更稳健的库存控制数学框架。',
      url: 'https://doi.org/10.1007/s11579-012-0087-0',
    },
    {
      title: 'Guéant (2017), Optimal Market Making',
      scope: '一般 intensity、风险限制、订单规模与多资产扩展',
      reason: '看清哪些结论属于做市控制的一般结构，哪些只是指数到达特例。',
      url: 'https://doi.org/10.1080/1350486X.2017.1342552',
    },
    {
      title: 'Hasbrouck & Sofianos (1993) + Madhavan & Smidt (1993)',
      scope: '两篇全文，重点比较库存调整时间尺度、target 估计与 quote/trade 动态',
      reason: '用同一期历史 NYSE 证据修正“库存日内清零”和“raw q 就是偏离”的直觉。',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05121.x',
    },
    {
      title: 'Madhavan & Sofianos (1998), An Empirical Analysis of NYSE Specialist Trading',
      scope: '参与选择、交易规模、库存与 specialist 行为',
      reason: '理解库存控制为何可能主要出现在 size 和 participation，而非可见 price skew。',
      url: 'https://doi.org/10.1016/S0304-405X(98)00008-7',
    },
    {
      title: 'Manaster & Mann (1996) + Kavajecz & Odders-White (2001)',
      scope: '重点阅读与简单库存符号不一致或较弱的经验结果及作者解释',
      reason: '主动学习反例，避免把经典单 dealer 模型误当跨市场经验定律。',
      url: 'https://doi.org/10.1093/rfs/9.3.953',
    },
    {
      title: 'Hendershott & Menkveld (2014), Price Pressures',
      scope: 'state-space 识别、结构模型、697 股样本与异质性结果',
      reason: '观察如何把永久信息创新与暂时库存压力分离，同时审计模型依赖。',
      url: 'https://doi.org/10.1016/j.jfineco.2014.08.001',
    },
    {
      title: 'Cartea, Jaimungal & Ricci (2014), Buy Low, Sell High',
      scope: 'order-flow imbalance、adverse selection 与最优控制部分',
      reason: '把库存状态与信息/订单流状态放进同一策略问题，却保持机制分解。',
      url: 'https://doi.org/10.1137/130911196',
    },
    {
      title: 'Hasbrouck (2007), Empirical Market Microstructure',
      scope: '交易数据、market design、quote/trade measurement 与时间序列方法相关章节',
      reason: '为未来亲自重建 dealer inventory、报价坐标和事件研究建立数据方法基础。',
      url: 'https://doi.org/10.1093/oso/9780195301649.001.0001',
    },
  ],
};
