import VolatilityTraderLab from '../components/VolatilityTraderLab';
import { volatilityTraderScenarios } from '../components/volatilityTraderScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson214Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Volatility trader 不是在押注一个叫“波动率”的单一数字，而是在比较未来价格路径、跳跃、曲面与相关性的条件分布同期权市场已经收费的状态价格，再用带 hedge policy 的非线性合约把差异变成可核算、可执行且可失效的组合。</h2>
        <p>
          “未来会很波动”没有完整交易含义。交易员还要说明：衡量的是哪个标的、哪段时钟和哪种 realized measure；市场基准是某一 strike 的 implied volatility、整条 option strip 的 implied variance，还是指数与成分之间的 implied correlation；观点准备由哪一组 option、variance instrument 或 relative-value legs 表达；delta 怎样对冲，曲面怎样重估，成本、保证金与退出又怎样进入净损益。Implied volatility 是把权利金反演成的模型坐标，不是定义上的物理世界预测；variance risk premium 则是风险中性价格与物理预期之间的差，不等同于一次事后预测误差。<Cite n={11} /><Cite n={15} /><Cite n={18} />
        </p>
        <p>
          本节的最小产物因此是一份 <b>volatility book ledger</b>：在 t− 冻结 forecast、surface、合约与情景，明确 trade object、Greek units、hedge rule、target、actual、order 和 fill；事后把 direction、realized path、surface repricing、carry、hedging、execution 与 funding 分开归因。只有完成这条链，long vol、short vol、skew、calendar 或 dispersion 才是可检验策略，而不只是标签。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与术语桥</p>
        <h2>硬先修是 1.23；建议回看 1.24 与 2.01、2.07、2.13。本节不重讲期权合同、BSM、Greeks 与 dealer 对冲反馈，而是把这些工具放入 volatility-trader 的目标、组合、约束与研究闭环。</h2>
        <div className="learning-objectives">
          <span>导论＋六阶段学习路线 · 从“波动观点”到真实 option book</span>
          <ol>
            <li><b>导论与对象边界（00–08）：</b>定义 agent，分开 option claim、volatility、variance、path、surface、tail 与 correlation，并锁定单位。</li>
            <li><b>价格与预测（09–17）：</b>构造 realized measure，读取 model-free implied variance，区分 P／Q、VRP、forecast 与 event variance。</li>
            <li><b>路径损益（18–25）：</b>由 delta-hedged book 进入 Gamma–Theta、realized-minus-implied 边界、离散对冲、surface full repricing 与 attribution。</li>
            <li><b>交易表达（26–39）：</b>逐一建立 long／short vol、event、calendar、skew、tail、overwrite、variance／volatility swap、dispersion 与 VIX derivatives 的残余账本。</li>
            <li><b>账户约束（40–47）：</b>聚合 Greeks，用 full-reprice stress、margin、liquidity 和 mandate 定规模，再把 target−actual 变成候选订单与成交。</li>
            <li><b>证据与闭环（48–55）：</b>审查 VRP、option demand、tail compensation 与 hedging feedback 的证据，完成 10+10 道题、研究协议和课程接口。</li>
          </ol>
          <p><b>单位桥：</b>Volatility 是收益率标准差的年化值，也等于同口径年化方差的平方根，常以 20% 或 20 vol points 表示；variance 是其平方，20%²=0.04，也可写作 400 percentage-points-squared。Vega 必须注明“每 1.00 volatility”还是“每 1 vol point”；Gamma 必须说明每一单位标的变动、合约乘数和头寸方向。Variance notional 与 vega notional 不是同一单位。</p>
          <p><b>概率桥：</b>P 表示物理世界／主观概率，Q 表示由无套利状态价格与风险补偿组织的风险中性测度。Q 不是市场对真实频率的直接投票；“model-free”通常是相对某个定价模型族而言，仍依赖无套利、报价筛选、有限 strike、尾部、利率和执行近似。<Cite n={3} /><Cite n={12} /><Cite n={13} /></p>
          <p><b>边界桥：</b>1.23 已建立 payoff、BSM、Greeks、IV 与静态曲面；1.24 已建立 dealer inventory、delta/gamma hedge 与价格反馈。本节只在需要定义交易者 hedge policy 时调用它们，不由 open interest 或成交量猜测 dealer 净 Gamma。4.18 才系统讨论 implied-volatility transmission，7.08–7.15 才聚合多主体反馈，7.24 则统一 volatility、liquidity、flow 与 position 的测量。</p>
          <p><b>首读分层：</b>核心路径约 75–90 分钟：先掌握 00–17、18–25、26–39 和 40–47 的因果结论，再快速阅读 48–52 的证据边界；12、20、33–39 的复制／相对价值推导与论文识别可在第二遍精读。</p>
        </div>
      </section>

      <section className="lesson-section" id="decision-chain">
        <p className="section-kicker">02 · 完整决策闭环</p>
        <h2>从“预期波动上升”到真实成交至少经过十二个状态；省略任何一步，都可能把方向观点、价格坐标、局部 Greek、目标组合或成交事实误写成同一个对象。</h2>
        <div className="mechanism-chain" aria-label="波动率交易从预测到更新的十二步状态链">
          <div><span>01</span><b>冻结时钟</b><p>记录 t−、事件、期限、采样与可交易快照。</p></div>
          <div><span>02</span><b>定义 realized object</b><p>声明 return、annualization、jump 与 sampling rule。</p></div>
          <div><span>03</span><b>形成 P 分布</b><p>预测路径、尾部、相关性而不只报一个均值。</p></div>
          <div><span>04</span><b>读取 Q price</b><p>从权利金、surface 或 option strip 提取价格坐标。</p></div>
          <div><span>05</span><b>写相对分歧</b><p>比较 forecast 与 price，注明风险溢价定义。</p></div>
          <div><span>06</span><b>选择表达</b><p>比较 option、variance、calendar、skew 或 dispersion。</p></div>
          <div><span>07</span><b>冻结 hedge policy</b><p>定义 delta 频率、阈值、工具与 surface convention。</p></div>
          <div><span>08</span><b>Full repricing</b><p>在 spot、surface、time、jump、correlation 情景下重估。</p></div>
          <div><span>09</span><b>施加约束</b><p>检查 loss、Greeks、margin、liquidity、mandate。</p></div>
          <div><span>10</span><b>生成 target</b><p>得到带单位的目标 book，而非市场订单事实。</p></div>
          <div><span>11</span><b>Order 与 fill</b><p>Target−actual 经过批准和执行，fill 才改变仓位。</p></div>
          <div><span>12</span><b>归因与更新</b><p>区分 forecast、pricing、hedging、execution 和 funding。</p></div>
        </div>
        <p>
          这条链故意把定价模型与收益模型分开：无套利复制解释某个价格如何在假设下与动态 hedge 相容，却不保证该价格等于 physical expectation，更不保证买方或卖方获得正期望净收益。<Cite n={1} /><Cite n={2} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="agent-definition">
        <p className="section-kicker">阶段一 · 对象边界　|　03 · Volatility Trader 的最小定义</p>
        <h2>Volatility trader 是围绕未来分布与当前衍生品价格之差管理非线性 claim 的决策主体；工具可以相同，真正区分策略的是预测对象、组合 legs、hedge policy、持有期和约束。</h2>
        <p>
          同一 ATM straddle 可以被事件交易者持有到公告后，可以被 market maker 因客户订单暂时库存，也可以被 relative-value fund 每日 delta hedge 并与另一期限对冲。三者合同相同，却有不同 objective、actual inventory、退出条件和 P&amp;L。因而“买了期权”不能识别 agent，“期权成交量上升”也不能识别是 long volatility、方向下注还是库存转移。
        </p>
        <p>
          本节关注主动选择 volatility risk 的 buy-side／proprietary agent。Dealer 的报价、库存与 hedge flow 只作为 execution interface；只有账户级 signed positions、实际 hedge 和成交记录才能进入因果识别。Option demand 可以携带方向或波动率信息，也可能通过中介约束改变价格，但这些竞争通道必须分开。<Cite n={31} /><Cite n={32} /><Cite n={42} /><Cite n={44} />
        </p>
        <div className="equation-card">
          <span>Agent 的最小可审计状态</span>
          <div>z<sub>t</sub>=(B<sup>P</sup><sub>t</sub>, 𝒮<sup>Q</sup><sub>t</sub>, q<sup>opt</sup><sub>t</sub>, H<sub>t</sub>, C<sub>t</sub>, G<sub>t</sub>, ℒ<sub>t</sub>, ℳ<sub>t</sub>, κ<sub>t</sub>, T<sub>t</sub>)</div>
          <p>B^P 是 physical belief，𝒮^Q 是可执行曲面，q^opt 与 H 分别是 option／hedge book，C 是 cash/collateral，G 是分桶 Greeks 与 stress，ℒ 是 mandate/limits，ℳ 是 margin/funding，κ 是流动性通道，T 是 thesis、合同、对冲与融资时钟。Agent 指拥有统一预算和控制权的风险簿，不等于某一法律标签。</p>
        </div>
      </section>

      <section className="lesson-section" id="strategy-map">
        <p className="section-kicker">04 · 策略标签是一张暴露地图，不是一项资产分类</p>
        <h2>Long vol、short vol、relative-value 与 correlation 是对组合主要风险来源的压缩描述；每个标签都必须展开为 legs、净 Greeks、tail payoff、hedging 与 funding。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="波动率策略族与主要对象对照表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>策略族</th><th>试图保留</th><th>常见表达</th><th>不能由标签排除</th></tr></thead>
            <tbody>
              <tr><td>Directional vol</td><td>Realized path 相对 option price</td><td>Delta-hedged straddle、variance</td><td>Skew、jump、cost、hedge timing</td></tr>
              <tr><td>Surface relative value</td><td>Term、strike 或 asset misalignment</td><td>Calendar、risk reversal、butterfly</td><td>Spot、forward、cross-Greeks、basis</td></tr>
              <tr><td>Tail / event</td><td>特定状态或时点的不对称 payoff</td><td>Put spread、straddle、VIX option</td><td>Carry、timing、settlement、gap</td></tr>
              <tr><td>Dispersion</td><td>Index covariance 相对成分 variance</td><td>Long components / short index</td><td>Weights、skew、jump、liquidity</td></tr>
              <tr><td>Overwrite / yield</td><td>出售部分上行或下行保险</td><td>Covered call、put-writing</td><td>Opportunity cost、tail、tax、assignment</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “Market-neutral”同样需要对象：delta-neutral 不等于 vega-neutral，vega-neutral 不等于 variance-neutral，平均 correlation-neutral 也不等于对完整相关矩阵中性。Relative-value 的价值正在于明确削弱什么共同因素，同时承认残余风险。
        </p>
      </section>

      <section className="lesson-section" id="claim-versus-volatility">
        <p className="section-kicker">05 · Option Claim 不等于 Volatility</p>
        <h2>Option 是状态依赖现金流；volatility 是对路径离散程度的统计压缩。买入一个正 vega option 取得的是一组随 spot、time 与 surface 改变的敏感度，而不是一单位“纯波动率”。</h2>
        <p>
          未对冲 long call 同时包含正 delta、正 gamma、通常正 vega 和时间衰减；即便标的 realized volatility 很高，若方向、路径、IV repricing、到期位置和权利金不利，买方仍可亏损。Buy-and-hold straddle 的到期 payoff 主要看终点离 strike 的距离，而频繁 delta-hedged straddle 才把更多路径波动转成 hedge P&amp;L；两者不能共享一句“long vol”而省略 hedge rule。
        </p>
        <div className="precision-note">
          <span>最小命名规则</span>
          <p>写“long 1m ATM straddle，daily close delta hedge，持有至 event+1，按 mid 建仓、可执行 bid/ask 平仓”比写“long vol”多出的每个字段都会改变可证伪 payoff。</p>
        </div>
      </section>

      <section className="lesson-section" id="four-ledgers">
        <p className="section-kicker">06 · 四本账：Path、Claim、Price Coordinate 与 Account</p>
        <h2>未来路径、合同现金流、由价格反演的 IV／Q 分布和账户仓位是四个不同对象；它们相关，却不存在无需模型、期限与成交证据的一一对应。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="波动交易四层账本，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>账本</th><th>记录什么</th><th>能回答</th><th>不能单独回答</th></tr></thead>
            <tbody>
              <tr><td>Path ledger</td><td>Returns、jumps、sampling、correlations</td><td>某口径 realized outcome</td><td>Option 净收益</td></tr>
              <tr><td>Claim ledger</td><td>Strike、expiry、style、settlement、multiplier</td><td>合同状态现金流</td><td>市场为何给出当前 premium</td></tr>
              <tr><td>Price-coordinate ledger</td><td>IV、total variance、Q density、skew</td><td>当前相对价格结构</td><td>唯一 physical belief</td></tr>
              <tr><td>Account ledger</td><td>Position、Greeks、cash、margin、orders、fills</td><td>谁实际持有什么</td><td>仅由公开 OI 识别的持仓方向</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          共同到期 option prices 在足够平滑、无套利等条件下可以映射 state-price density；那仍是由边际效用与风险补偿加权的价格，不是客观频率直方图。现实中的有限 strikes、bid–ask、插值和尾部外推又引入第二层不确定性。<Cite n={3} /><Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="five-gaps">
        <p className="section-kicker">07 · “波动判断”到净收益的五道缝隙</p>
        <h2>Forecast 不等于 market price，price 不等于可成交组合，组合不等于固定暴露，target 不等于 fill，gross attribution 也不等于投资者最终净收益。</h2>
        <ol className="diagnostic-list">
          <li><b>Forecast → price gap：</b>IV／implied variance 包含 Q weighting、tail insurance、供需和中介约束，不是无偏 P forecast 的定义。</li>
          <li><b>Price → expression gap：</b>有限 strike、期限、skew、合约乘数和 bid–ask 决定实际能买到什么。</li>
          <li><b>Expression → exposure gap：</b>Greeks 会随 spot、surface 和 time 漂移，局部 neutral 不是全情景 neutral。</li>
          <li><b>Target → transaction gap：</b>现仓、限额、margin、combo execution 与 partial fill 决定真实变化。</li>
          <li><b>Gross → net gap：</b>Hedge slippage、transaction cost、funding、tax、settlement 与 model residual 改变净收益。</li>
        </ol>
        <p>
          可执行 option cost 可能小于只看 quoted spread 得出的机械估计，却从来不等于零；访问方式、订单选择和腿间风险本身就是策略的一部分。<Cite n={37} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="unit-ledger">
        <p className="section-kicker">08 · Volatility、Variance、Total Variance 与 Greek 单位</p>
        <h2>绝大多数致命错误不是不会算，而是把开平方前后的对象、年度化时钟、百分数显示与合约 notional 放进同一个算式。</h2>
        <div className="equation-card">
          <span>点式曲面坐标与 strip 方差坐标必须分开</span>
          <div>v=σ²；　w<sub>smile</sub>(T,k)=σ<sub>imp</sub>(T,k)²T；　W<sub>var</sub>(T)=T·K<sub>var</sub>(0,T)</div>
          <p>σ 是年化 volatility，v 是年化方差率；w_smile 是固定 log-forward-moneyness k 的点式 implied total-variance 曲面坐标，用于 smile／static-arbitrage 分析。W_var 则由整条 option strip 对应的 variance-swap fair strike 构造，forward/event variance 的严格可加对象是对齐结算口径的 W_var；只有 point IV 时，w_smile 的期限差必须明确称 heuristic proxy。</p>
        </div>
        <p>
          若 σ=20%=0.20，则 v=0.04；在 percentage-point-squared 显示中又可写 20²=400。真实 variance product 可能以 variance points、decimal variance 或 vega notional 报价；必须从 term sheet 读取转换。Option vega 若定义为 IV 上升 1 vol point 的货币变化，就不能再把 Δσ=0.01 乘一次；若定义为对 decimal volatility 的导数，才使用 0.01。<Cite n={25} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="realized-variance">
        <p className="section-kicker">阶段二 · 价格与预测　|　09 · Realized Variance 是带规则的路径函数</p>
        <h2>Realized variance 不是自然界直接显示的一个数，而是由 return definition、采样时点、年度化、缺失值、corporate action 与结算规则共同定义的路径函数。</h2>
        <div className="equation-card">
          <span>等间隔日收益的教学实现量</span>
          <div>RV<sub>t,T</sub> = A/N · Σ<sub>i=1</sub><sup>N</sup> r<sub>i</sub>²；　σ<sub>realized</sub> = √RV</div>
          <p>r_i 是按事先冻结口径计算的对数或简单收益，N 是区间数，A 是每年区间数。公式不去均值是很多短期限 variance convention 的常见教学写法，但真实产品可能规定 observation day、holiday、disruption、cap 与价格来源。</p>
        </div>
        <p>
          同一个标的用 close-to-close、open-to-close、五分钟、包含或排除 overnight 得到不同 RV；这些不是谁“算错”，而是不同 estimand。研究 forecast 时必须让预测对象与 option／swap 的结算对象对齐，否则所谓 forecast edge 可能只是 measurement mismatch。
        </p>
      </section>

      <section className="lesson-section" id="sampling-jumps-noise">
        <p className="section-kicker">10 · Sampling、Jump 与 Microstructure Noise</p>
        <h2>提高采样频率可以捕捉更多日内路径，也会放大 bid–ask bounce、stale quote 和异步交易；jump 又使连续扩散下的复制直觉出现不可由普通 delta hedge 消除的残差。</h2>
        <p>
          对液态资产，适当高频 realized measure 可以提高信息利用；但当价格在买卖盘间跳动、不同成分不同步或夜间没有连续报价时，机械把频率推到 tick 级会制造虚假方差。产品结算通常用清晰、较低频的官方价格以保证可复制和可审计，研究测量则可用 noise-robust 方法；二者不可偷偷互换。<Cite n={23} />
        </p>
        <p>
          Jump 对 tail risk 尤其重要：它同时改变 realized variance、option payoff、hedging error 与 margin。VRP 的动态可被连续波动和 jump risk 分解，但这种分解依测量与模型，不能由“当天大跌”直接识别唯一价格。<Cite n={17} /><Cite n={20} /><Cite n={21} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="iv-versus-implied-variance">
        <p className="section-kicker">11 · Single-option IV 与 Option-strip Implied Variance</p>
        <h2>单份 option IV 是把一个 premium 输入选定定价模型后的反演根；model-free implied variance 则用跨 strikes 的 option strip 近似一个方差 claim，二者不是同一个观测。</h2>
        <p>
          BSM IV 把 strike、forward、expiry、rate 和 option price 压缩成 σ，使模型价格等于市场价格。因为真实市场有 skew，同一期限不同 strikes 会给出不同 IV；任何“市场 IV=20%”都必须说明 strike／delta、call-put、报价时点与插值。Stochastic-vol、local-vol 与 implied-tree 模型可以拟合同一静态 surface，却产生不同未来 surface dynamics 与 hedging。<Cite n={1} /><Cite n={4} /><Cite n={5} /><Cite n={6} /><Cite n={7} />
        </p>
        <p>
          Option-strip variance 用多个 OTM puts/calls 对 log-contract／variance payoff 近似复制，因此更接近整个风险中性分布的加权价格。它减少了对单一 diffusion model 的依赖，却增加对 strike coverage、tail extrapolation、forward、interest rate 和 quote filter 的依赖。<Cite n={12} /><Cite n={13} /><Cite n={24} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="model-free-variance-vix">
        <p className="section-kicker">12 · Model-free Variance、VIX 与可交易性边界</p>
        <h2>VIX 是把 SPX option strip 得到的年化方差先插值到恒定 30 天、再开平方乘 100 并以 volatility points 发布的指数；它不是过去 realized volatility、不是 physical forecast，也不是能够直接买卖的 spot asset。</h2>
        <div className="equation-card">
          <span>离散 option strip 的方法骨架</span>
          <div>σ²(T) ≈ 2/T · Σ<sub>i</sub> [ΔK<sub>i</sub>/K<sub>i</sub>²]e<sup>RT</sup>Q(K<sub>i</sub>) − 1/T(F/K₀−1)²；　VIX = 100√σ²<sub>30d</sub></div>
          <p>在 VIX-specific 口径中，K&lt;K₀ 使用 put midpoint，K&gt;K₀ 使用 call midpoint，K₀ 的 Q(K₀) 使用该 strike 的 put/call midpoint 平均；各期限 σ² 先按正式方法转成 total variance 并插值到恒定 30 天，再开平方乘 100。ΔK、F、K₀、报价筛选、利率和 disseminated index 均服从当期 methodology。</p>
        </div>
        <p>
          截至本节更新时间，Cboe 的 2026 年 VIX 数学与产品方法分别规定 option strip 计算和 VIX-specific 30-day interpolation；FAQ 用于解释产品，但正式方法与规则优先。VIX futures 与 options 是具有自身到期、报价和结算对象的独立合约，spot VIX 与某一 futures price 的差不是可直接锁定的无风险套利。<Cite n={26} /><Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="vrp-sign">
        <p className="section-kicker">13 · Variance Risk Premium 的定义与符号</p>
        <h2>VRP 必须先声明“谁减谁”；本节固定 seller-compensation convention：VRP<sub>t,T</sub>=E<sup>Q</sup><sub>t</sub>[RV]−E<sup>P</sup><sub>t</sub>[RV]，正值表示方差保护的风险中性价格高于 physical expectation。</h2>
        <div className="equation-card">
          <span>Ex ante premium 与 ex post payoff</span>
          <div>VRP<sub>t,T</sub> = K<sub>var,t,T</sub> − E<sup>P</sup><sub>t</sub>[RV<sub>t,T</sub>]；　Π<sub>short-var,T</sub> = N<sub>var</sub>(K<sub>var</sub>−RV<sub>T</sub>)</div>
          <p>第一式是条件期望差，第二式是一次实现损益。即使 ex ante VRP 为正，某期 RV 超过 strike 仍会使 short variance 亏损；以 realized RV 替代 E^P 后得到的是事后差，不再是决策时可知 premium。</p>
        </div>
        <p>
          有些文献使用相反符号，因此阅读前必须核对。IV²−forecast variance 只是可操作 proxy：single-option IV 不等于 variance-swap strike，forecast 也有误差；只有同期限、同结算与同单位的 Q/P 对象才能构成严谨比较。<Cite n={14} /><Cite n={15} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="physical-risk-neutral">
        <p className="section-kicker">14 · Physical P 与 Risk-neutral Q</p>
        <h2>P 描述交易员对现实频率的条件判断，Q 用状态价格对不利状态重新加权以支持无套利定价；二者的差正是风险价格，而不是需要被“纠正掉”的统计误差。</h2>
        <p>
          若崩盘时边际财富价值很高，投资者愿意为在该状态支付的 put 付出超过其平均 physical loss probability 的价格，于是 Q 左尾可以显著重于 P 左尾。Option prices 在条件下恢复的是 state-price density；要从 Q 反推 P 必须增加 stochastic discount factor 或偏好／均衡限制，不能把 normalized option density 直接称为“市场认为的真实概率”。<Cite n={3} /><Cite n={20} /><Cite n={21} />
        </p>
        <div className="precision-note">
          <span>语言护栏</span>
          <p>“Option prices imply a 5% risk-neutral probability”可以成立；“市场认为真实概率是 5%”需要额外模型。类似地，VIX 高于未来 RV 既可能体现 risk premium，也可能含 forecast error、quote/measurement 与 event composition。</p>
        </div>
      </section>

      <section className="lesson-section" id="distribution-tails">
        <p className="section-kicker">15 · 均值波动率不足以描述 Skew、Tail 与 Jump</p>
        <h2>两条路径可以具有相同方差，却有完全不同的偏度、尾部、跳跃时点和流动性损失；volatility trader 需要预测分布形状，而不是把所有风险压进一个 σ。</h2>
        <p>
          ATM straddle 更集中地加载常规位移，OTM put 更直接加载左尾状态，risk reversal 比较两侧 skew，variance claim 对极端收益平方敏感。1987 年后的指数 option skew 与 crash-fear 研究表明，尾部和 jump-risk pricing 是曲面重要成分；但从单一 skew 形状恢复“崩盘概率”仍依结构模型、尾部外推和风险溢价。<Cite n={20} /><Cite n={21} /><Cite n={22} />
        </p>
        <p>
          所以“forecast RV=20%”必须配套至少一个 scenario distribution：普通状态、上行 jump、下行 jump、vol-of-vol 与 correlation shift 的概率和损益。若策略的主要亏损来自 1% 尾部，优化平均 variance forecast 并不会自动改善资金生存率。
        </p>
      </section>

      <section className="lesson-section" id="forecast-benchmark">
        <p className="section-kicker">16 · Forecast、Benchmark 与 Calibration</p>
        <h2>一个 volatility forecast 的最低门槛不是“与未来 RV 正相关”，而是在严格实时、同期限、同损失函数下稳定改进简单基准，并能在可执行 option price 与成本后改善条件净收益。</h2>
        <p>
          历史研究显示 IV 对未来 realized volatility 具有信息，但这不使 IV 成为定义上的无偏 P forecast；model-free implied measure 也会受到有限 strike 与实现误差影响。一个可审计预测至少应与预注册的简单历史基准、当前 IV、简单组合和 no-change benchmark 比较，报告事前选定且与目标一致的统计损失，也另报 trade P&amp;L、turnover、tail loss 和 capacity。<Cite n={11} /><Cite n={13} />
        </p>
        <p>
          不能用完整样本挑选 delta、strike、holding period 和 hedge frequency 后再称样本外。所有 option quotes 要保留 t− bid/ask、staleness、zero bids、corporate actions 和可成交时间；short-leg 回测还要证明当时允许卖出并计入 margin 与 assignment。Option-return signals 的历史证据对数据清洗、交易成本和样本外衰减敏感。<Cite n={35} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="event-clock">
        <p className="section-kicker">17 · Event Clock、Total Variance 与 Invalidation</p>
        <h2>事件交易不是猜“公告后 IV 会跌”，而是在事件前冻结普通日方差、事件 jump distribution、跨事件 option total variance、post-event surface 与退出成本，再说明哪一项判断产生 edge。</h2>
        <div className="equation-card">
          <span>两期限事件方差的 strip-based 教学提取</span>
          <div>W<sub>event</sub> ≈ T<sub>across</sub>K<sub>var</sub>(0,T<sub>across</sub>) − T<sub>pre</sub>K<sub>var</sub>(0,T<sub>pre</sub>) − W<sub>extra ordinary days</sub></div>
          <p>严格相减对象是同起点、同结算口径的 variance-swap total variance W_var=T·K_var。只有 ATM／固定 moneyness IV 时可用 IV²T 作 heuristic proxy；普通日方差、期限 risk premium、surface coordinate 与额外日数都必须另扣，余项不能自动全部归给事件。</p>
        </div>
        <p>
          Scheduled information 往往在公布前已进入 option prices，宏观与政治事件也可能同时改变 belief、risk aversion 和 liquidity；event-study 的窄窗关联不自动给出结构因果。可失效条件应事前写成：实际公布分布、event move、post-event IV、hedge slippage 或 relative leg 任何哪一项超出何阈值就否定哪段机制。<Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={54} />
        </p>
      </section>

      <section className="lesson-section" id="delta-hedged-book">
        <p className="section-kicker">阶段三 · 路径损益　|　18 · Delta-hedged Book 仍是完整资产负债表</p>
        <h2>Delta hedge 不是把 option 变成一张“纯波动率券”，而是在某一时刻、某套曲面和一个标的坐标下移除一阶 spot sensitivity；option、hedge、cash、financing 与 costs 必须合账。</h2>
        <div className="equation-card">
          <span>会计优先的净资产账</span>
          <div>NAV<sub>t</sub> = Cash<sub>t</sub> + Σ<sub>j</sub>q<sub>j,t</sub>m<sub>j</sub>V<sup>opt</sup><sub>j,t</sub> + Σ<sub>k</sub>h<sub>k,t</sub>m<sub>k</sub>V<sup>hedge</sup><sub>k,t</sub> + OtherAssets<sub>t</sub> − Liabilities<sub>t</sub></div>
          <p>q_j/h_k 是有符号 option/hedge positions，m 是各自 multiplier。Cash-underlier shares 是 V^hedge=S、m=1 的特例；futures、forwards 与 swaps 必须按各自 mark、variation margin 和 cash-flow convention 入账。Premium、fills、dividend、interest、borrow、fees、exercise、assignment 与 settlement 先进入 cash／NAV。</p>
        </div>
        <p>
          对冲标的也可能与 option underlying 不同：index option 用 futures hedge 会留下 basis 与期限，single-stock option 会遇到 dividend、borrow 和 trading halt，VIX option 又对应自身 futures-style forward coordinate。所谓 delta-neutral 必须同时写 valuation model、surface rule、hedge instrument、rebalance trigger 和时间戳。
        </p>
      </section>

      <section className="lesson-section" id="gamma-theta-local">
        <p className="section-kicker">19 · Gamma–Theta 是局部交换，不是收益保证</p>
        <h2>正 Gamma 使曲率项从足够大的 spot move 获益，Theta 反映在其他输入局部不变时的时间变化；二者的常见对价关系只在选定模型、时钟与小步长内成立。</h2>
        <div className="equation-card">
          <span>组合的二阶局部展开</span>
          <div>ΔV ≈ ΔΔS + ½Γ(ΔS)² + 𝒱Δσ + ΘΔt + Vanna·ΔSΔσ + ½Volga(Δσ)²</div>
          <p>Vanna 是价值对 spot 与 volatility 同时变化的交叉敏感度；Volga 是价值对 volatility 的曲率，因此两者分别捕捉“标的与曲面一起动”和“曲面大幅移动”时一阶 Vega 漏掉的非线性。所有 Greeks 都应先按 signed contracts 与 multiplier 聚合，并声明 σ 使用 decimal 还是 vol point、t 使用年还是日。展开忽略更高阶项和 Greek 漂移，spot 或 surface 大幅移动时必须 full reprice。</p>
        </div>
        <p>
          对 long option 而言，正 Gamma 与常见负 calendar-time Theta 经无套利复制相连，却不意味着每天固定支付一笔现金“租金”。Theta 是模型偏导；真实 carry 还包括 skew roll、forward movement、financing、dividend 和 hedge P&amp;L。Black–Scholes–Merton 的复制是理解该交换的基准，不是对离散有摩擦市场的描述性承诺。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="realized-implied-identity">
        <p className="section-kicker">20 · Realized-minus-implied 身份及其边界</p>
        <h2>“Long Gamma 赚 realized、付 implied”是一个有用的局部恒等式，但其权重随路径变化，且只在连续、正确融资、共同模型、细密对冲和曲面受控的基准下接近成立。</h2>
        <div className="equation-card">
          <span>多腿 book 的单步 delta-hedged 教学近似</span>
          <div>ΔΠ<sup>dh</sup><sub>t</sub> ≈ Σ<sub>j</sub>½Γ<sup>pos</sup><sub>j,t</sub>S²<sub>u(j),t</sub>[(ΔS<sub>u(j),t</sub>/S<sub>u(j),t</sub>)² − σ²<sub>imp,j,t</sub>Δt] + Σ<sub>j</sub>𝒱<sup>pos</sup><sub>j,t</sub>Δσ<sub>j,t</sub> − Costs<sub>t</sub> + Residual<sub>t</sub></div>
          <p>j 是 option leg，u(j) 是其 underlying，Γ^pos 与 𝒱^pos 已含 signed contracts 和 multiplier；跨币种 book 还须先用同一时点 FX 转成统一 reporting currency，Costs 亦同。每条腿以自己的 strike/tenor IV 与 Gamma 权重进入；跨 strike、期限或标的时不能先聚合 Gamma 再乘一个“全书 IV”。多期中各权重继续漂移，jump、discrete hedge、cross-Greeks、funding、FX 与 model error 留在 residual。</p>
        </div>
        <p>
          Variance swap 通过跨 strikes 的近似复制更接近固定权重的 realized-variance claim；单个 vanilla option 的 Gamma 权重则集中于价格接近 strike 的时段。Delta-hedged option return 的实证结果因此依 hedge frequency、option selection、jumps 与成本。<Cite n={14} /><Cite n={24} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="discrete-hedge-jump">
        <p className="section-kicker">21 · Discrete Hedge、Jump 与 No-trade Policy</p>
        <h2>连续复制是极限基准；现实 hedge 在离散时点、有限流动性和价格跳跃下成交，因此更频繁不必然更优，最优策略是在 residual risk 与交易成本之间做条件权衡。</h2>
        <p>
          每次 rebalance 都支付 spread、fees、impact 和可能的 tax／borrow；过少对冲又保留 directional drift 和 jump gap。No-trade band、calendar schedule、delta threshold 与 event override 是不同政策，必须在回测前冻结。Transaction-cost option models 说明复制误差与成本不可同时被无限压低，但其参数化结果仍不是任何市场的通用最优频率。<Cite n={48} />
        </p>
        <p>
          Jump 会跨越连续 hedge 可交易的中间状态：long gamma 可能获益于大位移，short gamma 可能遭受缺口，但 surface、liquidity 和 hedge fill 同时变化，符号仍要由 full book 决定。交易暂停或 limit move 使理论 hedge target 无法成为 fill；这是一项 execution state，不应被回测当作即时成交。
        </p>
      </section>

      <section className="lesson-section" id="vega-surface">
        <p className="section-kicker">22 · Vega 是曲面坐标的局部偏导</p>
        <h2>Vega 衡量在 spot、time 和其他模型输入局部固定时，选定 volatility parameter 改变对价值的影响；它不等于对未来 realized variance 的直接暴露，也不定义真实 surface 怎样移动。</h2>
        <p>
          一份 six-month ATM option 的 long vega 可能在 IV 上升时获益，但如果 spot 下跌使 option 沿 skew 移动、forward 改变、时间过去且 smile 同时扭转，单一 parallel-vega attribution 会留下巨大 residual。Sticky-strike 与 sticky-delta 是 desk 用来冻结局部曲面移动的情景启发式，不是自然定律；local-vol 与 stochastic-vol 则给同一静态 surface 配上不同动态，因此会产生不同有效 delta、vanna 与未来 smile。<Cite n={4} /><Cite n={5} /><Cite n={7} />
        </p>
        <p>
          组合 vega 也必须分桶：按 underlying、expiry、moneyness 和 factor 分开。总净 vega 为零，只表示对指定平行 shock 的一阶金额近似为零；front/back 不同变化、skew rotation、volga 和各腿 vega 漂移仍会产生损益。
        </p>
      </section>

      <section className="lesson-section" id="surface-full-repricing">
        <p className="section-kicker">23 · Surface Dynamics、Cross-Greeks 与 Full Repricing</p>
        <h2>曲面不是静止背景，而是随 spot、time、order flow 与状态改变的价格对象；大情景中应直接重建可行 surface 并逐腿重估，而不是把一串当前 Greeks 无限外推。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="曲面压力情景矩阵，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>Shock</th><th>直接坐标</th><th>常漏残差</th><th>最低审计</th></tr></thead>
            <tbody>
              <tr><td>Spot gap</td><td>Delta、Gamma</td><td>Skew roll、jump hedge</td><td>新 spot 下 full surface</td></tr>
              <tr><td>Level up</td><td>Vega</td><td>Volga、term rotation</td><td>各 expiry 独立 bump</td></tr>
              <tr><td>Skew steepen</td><td>Risk reversal</td><td>Vanna、strike migration</td><td>Put/call 分侧 bump</td></tr>
              <tr><td>Time/event pass</td><td>Theta、Charm（Delta 随时间流逝的局部变化）</td><td>Event variance removal</td><td>生命周期与新期限</td></tr>
              <tr><td>Liquidity stress</td><td>Executable price</td><td>Spread、impact、margin</td><td>Bid/ask 与 exit size</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Static arbitrage-aware parameterization 可帮助避免 butterfly／calendar 违约，却不决定未来 surface dynamics。模型不确定性应表现为多个可行 surface rule 下的 valuation range，而不是选择拟合最好的一条后把其 Greeks 当真值。<Cite n={8} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="carry-theta-roll">
        <p className="section-kicker">24 · Theta、Carry、Roll 与 Repricing</p>
        <h2>“赚 theta”只是局部定价归因；真实持有收益还取决于曲面沿期限与 moneyness 的移动、forward、financing 和 hedge，因此不能把 option carry 当成债券 coupon。</h2>
        <p>
          若整条 surface 和 spot 都冻结，option 随时间接近到期产生模型 theta；但真实市场中短期限 event premium 会被移除、moneyness 因 forward 与 spot 变化、skew 可能均值回复。Rolling short option 还要以新 premium 平旧 option 并重建仓位，前一期收到权利金不代表已实现利润。
        </p>
        <p>
          一个高正 theta、负 gamma 的 book 可能在许多平静日小赚、少数跳跃日大亏；反之 tail hedge 可长期支付 carry、在坏状态保护整个 portfolio。判断经济价值必须看联合资产负债表与状态效用，而不是单腿平均收益。
        </p>
      </section>

      <section className="lesson-section" id="pnl-attribution">
        <p className="section-kicker">25 · 会计 P&amp;L、Greek Attribution 与 Residual</p>
        <h2>先用现金和逐腿市值复算唯一总 P&amp;L，再用冻结顺序做方向、曲率、surface、time、hedge、cost 与 funding 归因；解释项相加不等于总账时，差额必须保留为 residual。</h2>
        <div className="equation-card">
          <span>动态账户恒等式与归因闭环</span>
          <div>P&amp;L<sub>0,T</sub> = NAV<sub>T</sub>−NAV<sub>0</sub>−ExternalNetContributions<sub>0,T</sub>；　Residual = P&amp;L<sub>accounting</sub>−Σ<sub>k</sub>Attribution<sub>k</sub></div>
          <p>ExternalNetContributions 定义为外部净入金减净出金；NAV 已通过 18 的 cash/position ledger 吸收 trade cash、premium、exercise、assignment、settlement、interest、dividend、borrow、collateral 与 fees。非线性 bump 顺序会改变各桶归属，Residual 可能来自 cross-Greeks、marks、corporate actions 或 missing cash flow，不能自动命名为 alpha。</p>
        </div>
        <p>
          事后复盘还要把四类错误分开：forecast error 是 P 分布错，pricing error 是错误理解 Q／risk premium，expression error 是 legs 与 hedge 没有隔离目标，execution error 是实际 fill／cost 偏离假设。只看最终盈利会把运气奖励为模型正确。
        </p>
      </section>

      <section className="lesson-section" id="long-vol">
        <p className="section-kicker">阶段四 · 交易表达　|　26 · Long Volatility 的四种不同含义</p>
        <h2>Long option、long Gamma、long Vega、long variance 与 long tail 可能重叠，却不是同义词；严谨策略必须指明保留哪一种暴露以及怎样中和其余暴露。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="long volatility 不同表达对照，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>表达</th><th>主要对象</th><th>典型优势</th><th>关键残余</th></tr></thead>
            <tbody>
              <tr><td>Long short-dated ATM</td><td>High local Gamma</td><td>对近期大位移敏感</td><td>Theta、jump timing、hedge cost</td></tr>
              <tr><td>Long back-month option</td><td>Vega / future uncertainty</td><td>期限较长、Gamma 较低</td><td>Term、volga、surface roll</td></tr>
              <tr><td>Long variance</td><td>Squared realized returns</td><td>更接近方向对称 path claim</td><td>Jump、sampling、OTC/cap</td></tr>
              <tr><td>Long OTM put</td><td>Downside tail state</td><td>与坏状态组合损失对齐</td><td>Skew premium、timing、carry</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “Long vol 亏损，因为 realized vol 低”最多解释一条路径。即便 realized measure 低，若 IV 上升、skew 变陡或方向有利，option 仍可能盈利；即便 RV 高，Gamma 权重、IV 下移和成本也可能令 delta-hedged vanilla 亏损。
        </p>
      </section>

      <section className="lesson-section" id="short-vol">
        <p className="section-kicker">27 · Short Volatility：Risk Premium、负凸性与生存约束</p>
        <h2>Short vol 的经济来源可以是出售坏状态保险、吸收需求压力或承担库存与尾部风险；正平均 premium 若存在，也不能消除单期 jump、负凸性、margin 与强制退出。</h2>
        <p>
          Naked short call 的合同损失无有限上界，short put 的到期损失虽有限却可相对 premium 极大。Daily delta hedge 不能锁定最大损失，因为 gap、trading halt、spread widening 和 surface jump 发生在最难成交时。正 theta 是局部模型量，不是现金收益保证；“胜率高”也可能与极负 skew 共存。Index option return 的历史异常需要 jump／volatility risk、rare events、benchmark 与交易摩擦共同理解。<Cite n={33} /><Cite n={34} /><Cite n={36} />
        </p>
        <p>
          规模必须由 full-reprice tail、available collateral、liquidation horizon 和 mandate 决定。若策略只有在忽略 crisis bid/ask、margin call 或无法继续 hedge 时才显得稳定，其期望收益没有被可执行地证明。
        </p>
      </section>

      <section className="lesson-section" id="event-vol">
        <p className="section-kicker">28 · Event Volatility：Move、Crush 与 Timing</p>
        <h2>买事件不是押注“IV 会升”，卖事件也不是押注“公告后 IV 会跌”；真正对象是事件实际位移与事件前 option price、post-event residual surface、hedge path 和退出价之间的差。</h2>
        <p>
          Earnings straddle 可在公告前 IV 上升但因时间损耗仍无利润，也可在公告后发生所谓 crush 而因 spot move 足够大获利。事件前后期限的 total variance 差提供 event premium proxy，却同时含普通日方差、risk premium 与曲面 basis。政治和宏观事件 option 研究显示不确定性可被提前定价，但不能由平均模式替代本次发行、选举或政策的条件分布。<Cite n={52} /><Cite n={53} /><Cite n={54} />
        </p>
        <p>
          最小 event ledger 应保存 consensus distribution、event window、option snapshot、expected move、break-even、post-event exit rule 和 alternative explanations。若实际 move 小但 post-event IV 未如预期下降，错误可能在 surface mapping，不一定在 event forecast。
        </p>
      </section>

      <section className="lesson-section" id="calendar-forward-variance">
        <p className="section-kicker">29 · Calendar、Total Variance 与 Forward-vol Proxy</p>
        <h2>Option calendar 试图表达两个期限价格的相对变化；要读取后段方差先相减同口径 total variance，但 vanilla legs 仍不是纯 forward-variance contract。</h2>
        <div className="equation-card">
          <span>Forward variance 的一致单位</span>
          <div>K<sub>fwd</sub>(T₁,T₂) = [T₂K<sub>var</sub>(0,T₂) − T₁K<sub>var</sub>(0,T₁)]/(T₂−T₁)</div>
          <p>K_var 是同口径 variance-swap fair strike。若用 ATM IV² 代替，只能称 proxy；直接用 IV(T₂)−IV(T₁) 既丢失期限权重，也混淆 volatility 与 variance。</p>
        </div>
        <p>
          Long back／short front 的 vega-neutral calendar 只对指定平行 surface shock 局部中性；front event、Gamma、Theta、skew、forward moneyness 与两腿不同幅度变化都保留。实证 term structure 的形状依状态与样本，不存在“contango 必卖、backwardation 必买”的无条件规则。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="skew-trades">
        <p className="section-kicker">30 · Skew：Risk Reversal、Butterfly 与符号约定</p>
        <h2>Skew trade 比较同期限不同 moneyness 的相对价格；只有先冻结 put-minus-call、delta/strike 坐标、vega weights 与 forward，所谓“skew steepened”才有确定方向。</h2>
        <p>
          25-delta risk reversal 可定义为 σ_put−σ_call，也有市场使用相反符号；本节一律显式写公式。Vega-matched long put／short call 降低平行 level 暴露，却保留 delta、vanna、jump asymmetry 和 strike migration。Butterfly 试图区分 wing curvature，同样需要静态无套利与可执行 wing quotes。
        </p>
        <p>
          Skew 可能反映 crash／jump risk premium，也可能受净买压和中介库存影响；观察形状不能唯一识别是哪条机制。Demand-pressure 与 demand-based pricing 研究支持供需可以进入曲面，却不允许把每次 put skew 上升归因于同一类买方。<Cite n={20} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="tail-structures">
        <p className="section-kicker">31 · Tail Hedge：Put、Put Spread、Collar 与 Crash Convexity</p>
        <h2>Tail hedge 的目标函数是改善整个 portfolio 在坏状态的现金流与生存，而不一定让独立 option leg 具有正平均 P&amp;L；降低 premium 往往同时截断最需要的 payoff。</h2>
        <p>
          Long OTM put 保留下行凸性但支付 skew premium；put spread 卖出更低 strike 以降成本，也为保护设上限；collar 再出售上行以融资，改变机会成本。比较结构不能只看 premium，应在资产组合下报告 expected utility、drawdown、liquidity need、rebalance rule 和 protection gap。
        </p>
        <p>
          若 hedge 在危机时 option mark 上升却无法按所需规模平仓，账面保护不等于现金保护；若 underlier 下跌同时相关性上升，单资产 hedge 还可能错配整体损失。Tail premium 的历史存在提供定价背景，不证明任何 strike／tenor 的保险“太贵”或“值得卖”。<Cite n={22} /><Cite n={38} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="overwrite">
        <p className="section-kicker">32 · Covered Call 与 Put-writing：Income Label 的错觉</p>
        <h2>收到 premium 是融资现金流，不是已经赚得的收益；covered call 交换部分上行，put-writing 承担下行购买义务，两者的风险必须与基准持仓共同比较。</h2>
        <p>
          Covered call 的 short call 有现货覆盖交割，却仍可能在上涨中显著落后纯持股；它不是“多一层免费收益”。Cash-secured put 在下跌时相当于以 strike 买入，现金抵押限制融资杠杆但不消除资产损失。策略评估应使用同 beta／downside exposure 的 benchmark，拆开 equity premium 与 option-writing premium。
        </p>
        <p>
          American-style option 的 early exercise／assignment、dividend date、交易费用和 roll convention 会影响结果；税务还取决于投资者与司法辖区，不能由 payoff 图直接推出。把 premium annualize 成“yield”尤其危险，因为分母、持有期与未实现 liability 不同于债券 coupon。<Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="variance-swap">
        <p className="section-kicker">33 · Variance Swap：更直接，但仍不是无摩擦纯方差</p>
        <h2>Variance swap 以 realized annualized variance 相对预定 strike 的线性差结算，减少单一 vanilla 的 Gamma-weighting 问题；sampling、cap、OTC credit、collateral 与有限 strike replication 仍必须入账。</h2>
        <div className="equation-card">
          <span>本节固定的 long-variance payoff</span>
          <div>Π<sub>long var</sub> = N<sub>var</sub>[RV<sup>ann</sup>−K<sub>var</sub>]</div>
          <p>N_var 定义为每 1.00 decimal annual variance 的货币金额；若 term sheet 使用 variance points 或 vega notional，必须按其 strike 和 conversion 另算。K_var=20%²=0.04，而不是 0.20。</p>
        </div>
        <p>
          理想化复制使用 log contract 与跨 strikes option strip；现实只有有限 strikes 和带价差 quotes，深翼可能无报价，jump 与离散监测也留下误差。Listed variance futures 还有 accrued realized variance、forward component、marking 和规则差异，不能与 OTC swap 共用一个简化 term sheet。<Cite n={24} /><Cite n={25} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="volatility-swap">
        <p className="section-kicker">34 · Volatility Swap 与 Convexity Adjustment</p>
        <h2>Volatility swap 对 √RV 线性，variance swap 对 RV 线性；因为平方根是凹函数，fair volatility strike 一般不等于 variance strike 的平方根。</h2>
        <div className="equation-card">
          <span>Jensen 边界</span>
          <div>K<sub>vol</sub> = E<sup>Q</sup>[√RV] ≤ √E<sup>Q</sup>[RV] = √K<sub>var</sub></div>
          <p>不等号差距随 vol-of-vol 与分布形状扩大，常称 convexity adjustment。精确值需要 RV 分布或动态 hedge；因此 volatility swap 不能像 variance swap 那样仅靠静态 option strip 完整复制。</p>
        </div>
        <p>
          在接近 strike 的小变化下，两者可用 vega-notional 转换比较，但尾部 payoff 不同：variance 对高波动状态增长更快。交易员必须说明自己希望线性化的是 volatility points 还是 variance units。<Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="index-variance">
        <p className="section-kicker">35 · Index Variance 是成分方差与协方差的组合</p>
        <h2>指数波动率低于平均成分波动率通常来自分散化；当成分 vol 不变而相关性上升，covariance 项仍会抬高指数 variance。</h2>
        <div className="equation-card">
          <span>固定权重教学恒等式</span>
          <div>σ²<sub>I</sub> = Σ<sub>i</sub>w²<sub>i</sub>σ²<sub>i</sub> + 2Σ<sub>i&lt;j</sub>w<sub>i</sub>w<sub>j</sub>ρ<sub>ij</sub>σ<sub>i</sub>σ<sub>j</sub></div>
          <p>第一项是成分自身方差贡献，第二项是共同运动。真实指数有权重变化、dividend、corporate action 和跳跃；公式是风险分解，不是 option portfolio 自动复制等式。</p>
        </div>
        <p>
          Index option 又常比 individual options 含更强 downside skew，因为系统性下跌时分散化减弱。由 index 与 components 的 Q variances 比较，可以研究 correlation risk premium，却必须对齐期限、报价时间与 variance convention。<Cite n={38} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="implied-correlation">
        <p className="section-kicker">36 · Implied Correlation 是压缩代理，不是完整矩阵</p>
        <h2>在共同相关性近似下，可以从 index variance 与 component variances 反解一个加权平均 ρ；它是模型坐标，不是每一对股票的真实未来相关系数。</h2>
        <div className="equation-card">
          <span>Equicorrelation-style plug-in</span>
          <div>ρ̄<sub>imp</sub> = [σ²<sub>I</sub>−Σw²<sub>i</sub>σ²<sub>i</sub>] / [2Σ<sub>i&lt;j</sub>w<sub>i</sub>w<sub>j</sub>σ<sub>i</sub>σ<sub>j</sub>]</div>
          <p>这是把一组已声明 volatility coordinates 压成共同 ρ 的代数式。研究 strip-based dispersion 时，输入应来自同一时点、期限和 variance-swap-equivalent coordinates；混用 ATM IV、不同 deltas 或 stale components 可能产生不可行数值，多资产 correlation matrix 还必须正半定。</p>
        </div>
        <p>
          另一类对象是产品化的 ATM plug-in index：Cboe 当前 implied-correlation hub 说明其指标用 top-50 value-weighted components 与 ATM delta-relative constant-maturity IV 构造。它不使用上述 strip-based K_var 输入，因此不能与 variance-swap implied correlation 混称同一 estimand，也不能替代 full matrix 或真实 dispersion payoff。<Cite n={39} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="dispersion">
        <p className="section-kicker">37 · Dispersion：近似 Short Correlation 的多腿组合</p>
        <h2>常见 dispersion 做多成分 variance、做空指数 variance，希望 realized correlation 低于 implied correlation；策略 P&amp;L 仍由每条腿相对自身 strike 的差、权重与成本共同生成。</h2>
        <p>
          只有在 component variance weights 与 index leg 一致、vol forecasts 准确、jump 与 skew 可控时，净结果才主要映射 correlation。若成分 RV 普遍低于各自高价 strike，long component legs 可亏；若单股 jump、index rebalancing 或 wing liquidity 不利，即使 realized average correlation 下降，组合也可能亏损。<Cite n={38} /><Cite n={39} />
        </p>
        <div className="precision-note">
          <span>不可省略的账</span>
          <p>逐腿记录 K_var、RV、N_var、weights、bid/ask、sampling、corporate actions 和 fill；最后才用相关性做解释。不能先看到 correlation 下降，再反向宣称任何 dispersion 组合都应赚钱。</p>
        </div>
      </section>

      <section className="lesson-section" id="dispersion-residuals">
        <p className="section-kicker">38 · Dispersion Residual：Weights、Skew、Jump、Basis 与 Liquidity</p>
        <h2>Vega-neutral 或 variance-notional-balanced 只能消除选定的一阶共同 shock；多腿组合仍可能在最相关的压力状态同时暴露于 residual。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="dispersion 残余风险表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>Residual</th><th>来源</th><th>可能后果</th></tr></thead>
            <tbody>
              <tr><td>Weight / rebalance</td><td>Index 动态权重与静态 legs 不同</td><td>Exposure drift</td></tr>
              <tr><td>Skew / strike</td><td>Index 与 single names smile 不同</td><td>非平行 surface P&amp;L</td></tr>
              <tr><td>Jump / event</td><td>成分 idiosyncratic gap</td><td>Component variance 激增</td></tr>
              <tr><td>Basis / dividend</td><td>Forward 与 corporate action</td><td>Moneyness 与 settlement 偏移</td></tr>
              <tr><td>Liquidity / legs</td><td>数十条 option 无法同步成交</td><td>Partial fill 与 impact</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因此最严谨的命名是“correlation-sensitive dispersion portfolio”，而非 correlation swap。Research 中要同时报告 implied-correlation gap 与真实 package return；若前者有预测力而后者在成本后失效，表达方式而非经济假设可能是瓶颈。
        </p>
        <p>
          更广义的 cross-asset relative volatility 也遵循同一规则：比较 equity、rates、FX 或 commodity vol 前，先统一期限、event window、return clock、variance measure、currency、liquidity 与可交易 instrument。两类资产的 IV level 看似异常，并不自动说明哪边“便宜”；不同 tail、skew、jump 与 risk-premium structure 可能使绝对数值不可直接横比。
        </p>
      </section>

      <section className="lesson-section" id="vix-derivatives-vol-of-vol">
        <p className="section-kicker">39 · VIX Futures、VIX Options 与 Vol-of-vol 边界</p>
        <h2>Spot VIX 是指数计算值；VIX future 交易未来结算值，VIX option 又以相应 forward coordinate 定价。三者不能用同日点位直接相减后称为持有收益或套利。</h2>
        <p>
          VIX futures curve 是一组不同到期合约的价格，不能仅凭曲线形状唯一分解出预期、风险补偿或供需；long future 的收益来自该合约价格到退出／结算的变化，不是 spot VIX 的 daily percentage change。VIX options 还有自身的 strike surface 与 settlement risk；用它们对冲 SPX option book 时存在合约对象和时钟的 basis。<Cite n={27} /><Cite n={28} />
        </p>
        <p>
          本节只建立 agent 选择与账本接口。4.18 将深入 implied-volatility index、期限结构与 transmission；多主体 feedback 在 7.08–7.15 聚合，7.24 则统一 volatility、liquidity、flow 与 position 的测量有效性。这里不能从 VIX 上升反推出某类 trader 已买入，亦不能从 VIX futures 持仓推断 underlying hedge flow。
        </p>
      </section>

      <section className="lesson-section" id="greek-aggregation">
        <p className="section-kicker">阶段五 · 账户约束　|　40 · Position Greeks、分桶与单位验收</p>
        <h2>组合 Greek 必须由逐腿有符号仓位、合约 multiplier 与统一模型单位聚合，再按 underlying、expiry、moneyness 和 risk factor 分桶；屏幕上的单份 Greek 不能直接当账户风险。</h2>
        <div className="equation-card">
          <span>逐腿到组合</span>
          <div>G<sub>P</sub> = Σ<sub>j</sub> n<sub>j</sub>m<sub>j</sub>g<sub>j</sub>；　Vega<sub>1pt</sub> = 0.01·∂V/∂σ<sub>decimal</sub></div>
          <p>n_j 是 signed contracts，m_j 是 contract multiplier，g_j 是单单位模型 Greek。若系统已经显示 currency per 1 vol point，就不可再乘 0.01；这是常见 100 倍错误。</p>
        </div>
        <p>
          最低 unit test 应用有限差分检查：spot 上下 bump 复核 delta/gamma，surface 每 1 point bump 复核 vega，日期推进复核 theta，并在 contract split、special dividend 与 multiplier adjustment 后重做。总 net vega／delta 还要与 gross legs 并列，因为两条大而相反的 legs 会保留 liquidity、basis 与 nonlinear risk。
        </p>
      </section>

      <section className="lesson-section" id="scenario-matrix">
        <p className="section-kicker">41 · Full-repricing Scenario Matrix</p>
        <h2>Option book 定规模不能只靠线性 Greeks 或单一 historical VaR；必须在联合 spot、level、skew、term、correlation、time、liquidity 与 lifecycle 情景下逐腿重估。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="波动率组合 full repricing 情景，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>状态</th><th>Spot / path</th><th>Surface</th><th>Execution / funding</th><th>要回答</th></tr></thead>
            <tbody>
              <tr><td>Quiet carry</td><td>窄幅、低 jump</td><td>Level 缓降</td><td>正常 spread</td><td>净 carry 能否覆盖成本</td></tr>
              <tr><td>Fast selloff</td><td>Gap down</td><td>Level up、put skew 陡</td><td>Spread / margin 上升</td><td>能否 hedge 与存活</td></tr>
              <tr><td>Relief rally</td><td>Gap up</td><td>IV crush、skew flatten</td><td>Front liquidity 分化</td><td>Tail book 的反向损失</td></tr>
              <tr><td>Single-name event</td><td>Idiosyncratic jump</td><td>Component crush</td><td>Leg risk</td><td>Dispersion residual</td></tr>
              <tr><td>Expiry / settlement</td><td>Strike crossing</td><td>Front disappears</td><td>Assignment / Special Opening Quotation（SOQ）basis</td><td>生命周期现金流</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Stress surface 必须保持基本无套利并反映可执行 bid/ask；只给 IV 全面 +5 points 可能漏掉最危险的 skew rotation。Scenario loss 不是概率预测，却为 margin、liquidity 和 invalidation 提供生存约束。
        </p>
        <div className="equation-card">
          <span>Physical expected net P&amp;L</span>
          <div>EV(q)=Σ<sub>s=1</sub><sup>S</sup>p<sup>P</sup><sub>s</sub>Π<sup>net</sup><sub>s</sub>(q)；　p<sup>P</sup><sub>s</sub>≥0，Σp<sup>P</sup><sub>s</sub>=1</div>
          <p>p_s 是决策时对互斥状态的 physical probabilities，Π_s 必须来自包含 option、hedge、cost、funding、margin liquidation 与 exit 的 full repricing。IV 高低不能代替 p_s，正 EV 也不能替代 tail、liquidity 与 mandate constraints。</p>
        </div>
      </section>

      <section className="lesson-section" id="margin-funding">
        <p className="section-kicker">42 · Premium、Margin、Collateral 与 Maximum Loss</p>
        <h2>Premium 是合同价格现金流，margin 是履约资源，collateral 是被占用资产，maximum loss 是 payoff 与后续交易共同决定的尾部；四者不能互换。</h2>
        <p>
          Long premium-style vanilla 单看合同且不发生后续 exercise／hedge 时，损失通常受已付 premium 限制；其账户仍可能因 hedge、融资和行权后的 underlying position 产生额外风险。Short option 的 margin 只是风险模型要求的资源缓冲，绝不等于最大损失。Equity-style premium 与 futures-style variation settlement 的现金时序不同，产品规则必须逐一冻结。<Cite n={30} />
        </p>
        <p>
          OCC 的 STANS 是面向 clearing-member portfolio 的 Monte Carlo／Expected Shortfall 框架并叠加压力、依赖与集中组件；它不等于 broker 对终端客户的 house margin，也不等于基金自身 liquidation trigger。资金流动性与市场流动性可能在压力中相互强化，但是否发生取决于仓位、融资条款、可售资产和交易深度。<Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-execution">
        <p className="section-kicker">43 · Liquidity、Package Execution 与 Leg Risk</p>
        <h2>多腿策略的理论净价只有在所有 legs 能以一致时间和规模成交时才成立；partial fill、pre-hedge、wing staleness 与 underlying slippage 会把 relative-value thesis 改写成方向风险。</h2>
        <p>
          RFQ／combo order 可以降低 leg risk，却不保证每个市场和规模都可用；legging 可能改善一条腿价格，也可能在等待期间暴露 delta、vega 与 event jump。研究应记录 bid、ask、actual fill、size、timestamp、venue、order type 和 hedge fill，不能把每条腿都放在各自最有利 mid。
        </p>
        <p>
          深 OTM wings 对 model-free variance 权重重要，却常最缺流动性；zero／stale quotes 与 strike truncation 会改变 implied measure。现行 Cboe 方法已有明确 series-level 和 zero bid-or-ask 筛选，私有研究若采用另一规则，必须另命名而不能称“官方 VIX”。<Cite n={13} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="sizing">
        <p className="section-kicker">44 · Sizing 是多个上限的交集</p>
        <h2>Expected edge 只决定是否值得考虑，不能单独决定规模；可行 package 数取 scenario loss、Greeks、margin、liquidity、concentration 与 mandate 上限中的最小值，并在每个新增单位后重算。</h2>
        <div className="equation-card">
          <span>透明而非普适的规模规则</span>
          <div>n* = floor min(B<sub>loss</sub>/L<sub>stress,1</sub>, B<sub>vega</sub>/|𝒱<sub>1</sub>|, B<sub>margin</sub>/M<sub>1</sub>, n<sub>liquidity</sub>, n<sub>mandate</sub>)</div>
          <p>B 是各项预算，分母是每个 package 的增量占用。真实 margin 与 market impact 非线性，portfolio offsets 也会随组合改变，所以公式每加入一批都要 full recompute，不是一次除法完成最优化。</p>
        </div>
        <p>
          Tail hedge 的 sizing 还可由被保护组合在坏状态的 marginal benefit 约束；short-vol 的 sizing 则尤其要按无法继续 hedge 的 gap scenario，而不是按平均每日 theta。若一个小概率损失足以触发赎回或清算，Kelly-like 平均增长答案也可能不符合机构效用与 mandate。
        </p>
      </section>

      <section className="lesson-section" id="target-order-fill">
        <p className="section-kicker">45 · Target、Post-lifecycle Actual、Option Order 与 Fill</p>
        <h2>模型输出的是目标账户状态；先让到期、行权、结算与已有成交更新 signed-contract actual，再用 target−actual 形成候选 option order，只有生命周期或真实 fill 才改变合同数量。</h2>
        <div className="equation-card">
          <span>Option 仓位状态机</span>
          <div>o<sup>opt,des</sup><sub>t</sub> = q*<sub>t</sub> − q<sup>actual,post-life</sup><sub>t−</sub>；　q<sup>actual</sup><sub>t+</sub> = q<sup>actual,post-life</sup><sub>t−</sub> + f<sup>opt</sup><sub>t</sub></div>
          <p>q* 是目标 signed contracts；post-life actual 只包含 expiry／exercise／assignment／settlement 等生命周期变化，以及已经真实成交的先前或 roll fills。新的 roll 仍是交易，必须经过独立 order/fill；o_des 是候选数量，f_opt 是 signed fill，批准、发送、partial fill、cancel 与 reject 均保留独立状态。</p>
        </div>
        <p>
          价格、时间、曲面与 margin 会改变同一 q 的 market value、Greeks 和资源占用，却不会自行改变 signed contracts；因此风险 target 必须先翻译成合同 target。若 surface move 已让 actual vega 超过不变 risk target，翻译后的 q* 可能要求反向卖出；没有账户级 q、risk state 与 fill，不能从 target rule 推出 signed option flow。
        </p>
      </section>

      <section className="lesson-section" id="hedge-order-ledger">
        <p className="section-kicker">46 · Option Fill 与 Hedge Fill 必须分成两条链</p>
        <h2>标准流程应在真实 option fill 后重算 portfolio Delta，再形成 hedge target；按尚未成交的 option target 先行对冲会产生额外 directional exposure，必须标记为 pre-hedging policy。</h2>
        <div className="equation-card">
          <span>单一 hedge instrument 的一般状态</span>
          <div>H*<sub>t</sub> = [Δ*<sub>t</sub>−Δ<sub>P</sub>(q<sup>actual</sup><sub>t+</sub>)]/δ<sup>hedge</sup><sub>t</sub>；　o<sup>hedge,des</sup><sub>t</sub> = H*<sub>t</sub> − H<sup>actual,post-life</sup><sub>t−</sub>；　H<sup>actual</sup><sub>t+</sub>=H<sup>actual,post-life</sup><sub>t−</sub>+f<sup>hedge</sup><sub>t</sub></div>
          <p>Δ* 是目标 portfolio Delta，δ^hedge 是每一 hedge unit/contract 的同口径 Delta-equivalent；post-life hedge baseline 已吸收 expiry、settlement、contract adjustment 与此前真实 fills，新的 futures roll 仍须经过 order/fill。只有目标为 0 且一单位标的 δ=1 时，才化成 H*=−Δ_P；多标的或 futures/basis hedge 应以 hedge-instrument Jacobian 求解，不可把合约张数直接当 underlying units。</p>
        </div>
        <p>
          如果 desk 有意在公告前先 hedge 预期成交，那是独立 decision rule，需要 pre-hedge limit、unwind condition 与 attribution。不能把它悄悄放进“delta neutral”假设后在回测中享受不存在的同步成交。
        </p>
      </section>

      <section className="lesson-section" id="lifecycle-operations">
        <p className="section-kicker">47 · Entry、Roll、Expiry、Settlement 与 Operational Risk</p>
        <h2>期权仓位会通过时间和合同规则离开账户；忘记 lifecycle 不只是数据错误，还会产生意外 underlying、现金和 margin 状态。</h2>
        <p>
          American exercise／assignment、European cash settlement、AM／PM settlement、special dividend、contract adjustment、pin risk 与 trading disruption 都可能改变最终 cash flow。VIX derivatives 的 settlement 与 disseminated spot index 不同；single-stock option assignment 可能在 dividend 前发生。1.23 已讲合同机制，本节要求把每次状态转换写入 actual ledger。<Cite n={28} /><Cite n={40} />
        </p>
        <p>
          数据审计需保存 symbology、root、expiration、strike scale、call/put、multiplier、exercise style、settlement source、corporate-action lineage 和 timezone。若历史 series 无法重建当日真实合约，宁可删除样本，也不应把后来的标准合同回填。
        </p>
      </section>

      <section className="lesson-section" id="vrp-evidence">
        <p className="section-kicker">阶段六 · 证据与闭环　|　48 · VRP 与 Option Returns：历史平均不是产品保证</p>
        <h2>大量研究记录了 index variance／option protection 的高价格与 delta-hedged 或 option-writing return patterns；这些结果支持 volatility risk 被定价，不证明任何时点、strike、asset 或成本后的 short-vol trade 必为正期望。</h2>
        <p>
          Delta-hedged gains 与 variance trading 文献把负方差风险价格／正 seller-compensation VRP 与市场状态联系；后续工作还发现 VRP 与未来 stock returns 存在预测关联。但定义、forecast、sample、jump decomposition 和 regime 均会改变估计。<Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} /><Cite n={19} />
        </p>
        <p>
          Option-return research 中极端均值常伴随高杠杆、负偏、rare-event exposure 与 bid–ask 问题。策略证据必须报告完整分布、crisis subsamples、margin survival、可执行报价和容量，而不是把平均 premium／theta 年化后称为稳健收益。<Cite n={33} /><Cite n={34} /><Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="demand-information">
        <p className="section-kicker">49 · Option Demand 可以是信息、保险、库存或约束</p>
        <h2>同一 signed option flow 可能来自方向信息、volatility information、tail insurance、structured-product hedge 或 dealer inventory；价格与成交量本身无法唯一识别动机。</h2>
        <p>
          学术证据显示 informed traders 会在 stock 与 option market 之间选择，signed option demand 对未来 stock return 或 volatility 具有信息；另一些研究显示 buying pressure 与中介 risk-bearing capacity 会改变 IV function。它们支持多条机制并存，而不是给出“call volume=看涨、put volume=恐慌”的固定字典。<Cite n={31} /><Cite n={32} /><Cite n={42} /><Cite n={43} /><Cite n={44} />
        </p>
        <p>
          Gross open interest 每张同时有 long 与 short，不能给出最终谁持有哪一侧；gross volume 也不等于 position change。要识别 volatility supply，至少需要账户／客户类别、开平仓、方向、dealer inventory 与 hedge records；否则只能构造有明确误差的 proxy。
        </p>
      </section>

      <section className="lesson-section" id="crowding-feedback">
        <p className="section-kicker">50 · Short-vol Crowding 与 Underlying Feedback 的证据门槛</p>
        <h2>许多主体共同 short vol 可以使坏状态损失与 margin 同时集中，但要断言其放大 underlying move，还必须观察 dealer 净 inventory、真实 hedge order／fill、market depth 与竞争信息通道。</h2>
        <p>
          Market-maker inventory 与 hedging cost 会进入 option liquidity，option hedging 也可能在某些市场状态影响 spot volatility；然而这些关系具有内生性与市场依赖，不能由 OI、volume 或 GEX（Gamma exposure，按特定持仓假设汇总的 Gamma 暴露）proxy 单独识别。已有研究对 option trading 是否普遍冲击 underlying 也强调证据边界。<Cite n={45} /><Cite n={46} /><Cite n={47} />
        </p>
        <p>
          系统链应写为：共同 target → 实际 option orders／fills → dealer post-trade inventory → hedge target → hedge orders／fills → price impact；任何中间节点缺失，最多支持风险情景而非已发生因果。1.24 已完整讲这条 feedback，本节只把 volatility trader 的第一段输出接入它。
        </p>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">51 · 反例库：固定符号为何会失败</p>
        <h2>真正理解不是记住“IV 高就卖、RV 高就买”，而是能构造一个满足合同和账本的反例，指出缺失变量在哪一层改变了结论。</h2>
        <ul className="diagnostic-list">
          <li><b>RV 高但 long option 亏：</b>未对冲 straddle 的终点回到 strike，或 delta-hedged book 遭遇 Gamma 权重、IV 下移、成本与跳跃残差。</li>
          <li><b>IV 升但 long option 亏：</b>不利 delta、Theta、skew rotation 或 hedge slippage 超过 vega 收益。</li>
          <li><b>Short vol 在高 RV 期盈利：</b>出售价格更高且路径、hedge 与 margin 足以存活；一次例子不证明长期安全。</li>
          <li><b>Vega-neutral calendar 亏：</b>前后期限不是平行移动，front IV 上升更多。</li>
          <li><b>Correlation 下降但 dispersion 亏：</b>component strikes、jump、weights、skew 或 execution residual 压过 correlation leg。</li>
          <li><b>Tail hedge 单腿负 EV 仍理性：</b>它在组合最坏状态提供现金和降低清算概率。</li>
          <li><b>Target 增加却没有买单：</b>actual 因 surface／lifecycle 已超过 target，或审批、margin 与流动性阻止成交。</li>
        </ul>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">52 · 可证伪研究：VRP 能否预测可执行 Short-variance 净收益？</p>
        <h2>把世界观压缩成一个局部假设：事前估计的 Q/P variance gap 是否在严格样本外、真实 bid/ask、固定 margin 与 sampling rule 下，预测预注册 short-variance strategy 的净收益。</h2>
        <div className="equation-card">
          <span>信号与可证伪预测</span>
          <div>z<sub>t</sub>=K<sup>Q</sup><sub>var,t</sub>−Ê<sup>P</sup><sub>t</sub>[RV<sub>t,T</sub>]；　H₁: z<sub>t</sub>&gt;c ⇒ E<sup>P</sup><sub>t</sub>[Π<sup>short,net</sup><sub>t,T</sub>]&gt;0</div>
          <p>在 t− 冻结 surface、forecast、threshold c、maturity、notional、bid/ask side、margin budget、collateral rate、stop、capacity 与 benchmark。结果必须同时报告 net P&amp;L、drawdown、tail loss、margin use、liquidation 与是否存活至结算。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>实时性：</b>只用当时可得 quotes、curve、underlying 与 forecast features；同日不同 contracts 不能随机拆 train/test。</li>
          <li><b>可执行性：</b>使用方向正确的 bid/ask；option strip 近似 variance swap 时公开有限 strikes、tail 与 hedge error。</li>
          <li><b>推断：</b>重叠 30 日持有期必须使用事前选定、能够处理时间依赖的推断方法；预注册模型、阈值与搜索空间，并对重复尝试造成的选择偏差作明确调整。</li>
          <li><b>基准：</b>比较 no-trade、无信号 short variance、historical forecast、current IV 与简单组合。</li>
          <li><b>否证：</b>若只依不可成交 wings、忽略 margin 后成立，或扣成本后失效，应削弱或否定假设，而非改口称“长期价值”。</li>
        </ol>
        <p>
          没有真实账户 order／fill 数据时，研究只能声称 hypothetical strategy return；不能从回测跨越到“vol traders 导致市场变化”。事件研究亦只能在清洁时钟下建立反应关联，结构因果还需制度冲击、工具变量或更强设计。<Cite n={51} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">53 · Volatility-trader Book Lab</p>
        <h2>用十组冻结参数分开 volatility／variance、realized path、option 与 event total variance，再核算 variance swap、calendar、dispersion、target–fill 和 short-vol 生存约束。</h2>
        <p>
          每题先写对象、单位和符号，再计算。错误项分别代表把 volatility 当 variance、把累计收益当路径方差、把 long option 当纯 long vol、把 delta-neutral 当无风险、把 event IV 当单日波动、把 variance notional 当 vega notional、把 calendar／dispersion 当纯因子，以及把 target 当 fill 或正 theta 当收益保证。
        </p>
        <VolatilityTraderLab />
        <div className="print-only">互动实验在打印版中隐藏。请改做下一节十道同源静态变式；打印时答案会展开。浏览器无 JavaScript 时也可直接使用静态题与理解检查。</div>
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">54 · 主动练习 · 十道静态变式</p>
        <h2>换一组 returns、vol points、期限、Greeks 或账户状态后脱离选项重算，确认你掌握的是可迁移机制，而不是互动题的答案位置。</h2>
        <div className="practice-grid">
          {volatilityTraderScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id + '-static'}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-interfaces">
        <p className="section-kicker">55 · 理解检查、Glossary 与课程接口</p>
        <h2>如果不能在不看公式时复述以下边界，并指出它们位于价格、组合、账户还是证据层，就还没有真正掌握“波动率交易者在交易什么”。</h2>
        <details className="understanding-check"><summary>01 · 为什么 IV 不是定义上的未来 realized-volatility forecast？</summary><p>IV 是把 option premium 输入模型后的反演坐标；它还受 Q 状态价格、风险溢价、skew、需求、库存、报价和模型影响。只有在增加模型并对齐期限后，才可把 IV 作为 P forecast 的一个输入。</p></details>
        <details className="understanding-check"><summary>02 · Volatility、variance 与两类 total variance 怎样区分？</summary><p>Volatility σ 是收益标准差的年化值，variance v=σ²。点式 w_smile=IV(T,k)²T 是 smile 坐标；strip-based W_var=T·K_var 才是 forward/event variance 严格相减的合约坐标。20% annualized volatility 平方后对应 0.04 annual variance；二者相关但量纲不同，ATM IV²T 也只能作为显式 proxy。</p></details>
        <details className="understanding-check"><summary>03 · 为什么 long option 不等于 pure long volatility？</summary><p>Option 同时带 delta、gamma、vega、theta、skew 和 higher-order exposures；Greeks 还随 spot、surface 和 time 漂移。只有声明 legs、hedge policy 与归因，才能说主要表达哪一种 volatility coordinate。</p></details>
        <details className="understanding-check"><summary>04 · Delta-hedged option P&amp;L 为什么不是简单 RV−IV²？</summary><p>Vanilla 的 Gamma-dollar 权重沿路径改变；P&amp;L 还含 surface movement、jump、discrete hedge、cross-Greeks、financing、cost 与 model residual。Realized-minus-implied 只是受条件约束的局部基准。</p></details>
        <details className="understanding-check"><summary>05 · Ex-ante VRP 与 ex-post variance gap 有何不同？</summary><p>本节 VRP=Kvar^Q−E^P_t[RV]，是决策时的条件期望差；Kvar−最终 RV 是一次 short-variance 实现收益的核心项。后者事前未知，不能回填后冒充 premium estimate。</p></details>
        <details className="understanding-check"><summary>06 · 为什么 calendar 要先用 total variance？</summary><p>期限增加时可比较的是 w(T)=variance rate×T；直接相减 IV 忽略平方与时间。即便 forward variance 算对，vanilla calendar 仍保留 Gamma、Vega、Theta、skew 与 forward-moneyness residual。</p></details>
        <details className="understanding-check"><summary>07 · Dispersion 为什么只是 correlation-sensitive proxy？</summary><p>Index variance 含 component variances 与 covariance；long components／short index 通常受益于相关性下降，但真实腿还受 strikes、weights、skew、jumps、dividend、rebalancing、basis 与 leg execution 影响。</p></details>
        <details className="understanding-check"><summary>08 · 正 theta 为什么不是 short-vol 的现金收益保证？</summary><p>Theta 是模型在其他输入局部不变时的时间偏导；spot path、IV／skew、jumps、hedging、margin 和 costs 会覆盖它。收到 premium 也只是负债合同的初始现金流，不是最终利润。</p></details>
        <details className="understanding-check"><summary>09 · Premium、margin 与 maximum loss 为什么必须分开？</summary><p>Premium 是价格现金流；margin 是履约缓冲；maximum loss 由 payoff 与后续 hedge／exercise 决定。Short-option margin 绝不封顶损失，long option 之外的 hedge 与账户融资也可增加风险。</p></details>
        <details className="understanding-check"><summary>10 · 为什么 option order 与 hedge order 不能合成一步？</summary><p>Option target 先减 post-lifecycle actual 得候选订单，只有 option fill 改变真实 contracts；随后以实际 fill 重算 Delta 才得到 hedge target，underlying fill 又是第二个执行状态。</p></details>
        <details className="understanding-check"><summary>11 · OI 或 volume 为什么不能识别 dealer net Gamma？</summary><p>每张 OI 同时有 long 与 short，volume 不说明开平仓或最终持仓，公开数据通常也缺客户类别与 signed inventory。要识别 feedback 还需 dealer position、hedge order/fill 与 market depth。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪“高 VRP 可以稳定变现”？</summary><p>在 t− 冻结 Q strike、P forecast、阈值、期限、bid/ask、sampling、margin、capacity 和基准；做 walk-forward、处理重叠期与多重搜索。若优势只来自不可执行 wings、忽略 margin 或扣成本后消失，假设就被削弱。</p></details>

        <div className="interface-grid">
          <article><span>回接 1.23</span><h3>Contract / Price / Greeks</h3><p>1.23 定义合同、定价和局部风险坐标；本节把它们变成带 P/Q 分歧、hedge policy、约束与成交的 agent book。</p></article>
          <article><span>回接 1.24</span><h3>Dealer Hedge Feedback</h3><p>本节输出 trader option fills；1.24 才由 dealer post-trade inventory、真实 hedge fill 与 market depth 判断 underlying feedback。</p></article>
          <article><span>连接 2.16 / 2.19</span><h3>Limits 与 Crowding</h3><p>2.16 将 scenario、Greeks 和 margin 升级为 VaR／ES、limit 与 breach；2.19 聚合共同 short-vol／tail positions 与强制退出。</p></article>
          <article><span>连接 4.18</span><h3>Implied-vol Transmission</h3><p>4.18 深入 VIX、model-free variance、risk premium 与跨市场状态；本节只建立交易者怎样使用这些价格坐标。</p></article>
          <article><span>连接 7.24</span><h3>Measurement</h3><p>7.24 统一 realized、implied、liquidity、position 与 flow 的测量有效性；本节保留单一账户、冻结口径的可复算协议。</p></article>
        </div>
        <div className="precision-note">
          <span>术语回查</span>
          <p>对象与单位回到 05–13；P/Q、VRP 与事件回到 14–17；delta-hedged P&amp;L 与 surface 回到 18–25；策略结构回到 26–39；Greeks、margin、orders 与 lifecycle 回到 40–47；证据、反例与研究回到 48–52。</p>
        </div>
        <p>
          最小复述应是：<b>Volatility trader 先冻结未来 path、tail、term 与 correlation 的 P 分布和当前可执行 Q surface，确认 volatility、variance、total variance 与 Greek units 一致；再选择 option／variance／calendar／skew／dispersion legs 和明确 hedge policy，用 full repricing、scenario loss、margin、liquidity 与 mandate 定 target。价格与生命周期先更新 actual，target−actual 只是候选 option order，实际 option fill 后才重算独立 hedge order；总收益先由 cash／NAV 合账，再拆 direction、Gamma、surface、time、hedge、execution、funding 与 residual。IV 不是定义上的 forecast，long option 不是纯 long vol，dispersion 不是纯 correlation，target 不是 fill；没有账户级 inventory、hedge fill 与 market depth，就不能从 OI／volume 跨越到 underlying feedback。</b>
        </p>
      </section>
    </>
  );
}

export const lesson214: LessonRecord = {
  slug: '2-14',
  id: '2.14',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Options / Volatility Trader：从分布分歧到可执行、可归因的非线性仓位',
  subtitle: '分开 P 路径判断与 Q 曲面价格，把 volatility、variance、tail、term 和 correlation 的相对分歧翻译成带 hedge policy、full repricing、保证金、真实成交与证据边界的 option book',
  readingTime: '核心首读路径约 75–90 分钟（先读因果结论与证据边界，复制、曲面和 dispersion 推导第二遍精读），完整正文约 145–180；互动实验首次完成 30–40／含复盘 45–60，主动练习核对 20–30／完整书写 35–50，理解检查快速 12–15／完整复述 20–25，课程接口约 5 分钟；核心学习约 142–180 分钟，完整学习约 250–320 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: '1.23；建议回看 1.24、2.01、2.07 与 2.13；按需调用 T01–T03、T07–T08',
  updatedAt: '2026-08-30',
  revision: '2.14-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.14-r2',
      summary: '独立复核 56 节、21 张公式卡、10 道互动题与 10 道静态变式、55 条来源和 117 个引文落点，并逐项核验 P／Q 与 VRP、两类 total variance、VIX 现行方法、逐腿 delta-hedged P&L、事件／远期方差、variance／volatility swap、dispersion、NAV、保证金及 target–actual–order–fill 状态机；类型、规范、构建、HTTP 与冻结哈希均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.14-r2',
      summary: '独立复核零背景术语桥、P 分布到 Q 曲面再到组合／约束／成交／归因的六阶段递进、56 项目录、75–90 分钟核心路线、10+10 题、12 道理解检查与 6+7+7 阅读路径，并检查键盘／ARIA／焦点、本地保存与损坏恢复、无脚本、打印、移动端及 reduced-motion 降级；构建、HTTP 与冻结哈希均一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-13', label: '2.13 Global Macro Fund' },
  next: { slug: '2-15', label: '2.15 Arbitrage Capital 与 Limits to Arbitrage' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与术语桥' },
    { id: 'decision-chain', label: '完整决策闭环' },
    { id: 'agent-definition', label: 'Volatility Trader 定义' },
    { id: 'strategy-map', label: '策略暴露地图' },
    { id: 'claim-versus-volatility', label: 'Option Claim ≠ Volatility' },
    { id: 'four-ledgers', label: '四本账' },
    { id: 'five-gaps', label: '波动判断到收益的缝隙' },
    { id: 'unit-ledger', label: 'Vol / Variance / Total Variance' },
    { id: 'realized-variance', label: 'Realized Variance' },
    { id: 'sampling-jumps-noise', label: 'Sampling、Jump 与 Noise' },
    { id: 'iv-versus-implied-variance', label: 'IV 与 Implied Variance' },
    { id: 'model-free-variance-vix', label: 'Model-free Variance 与 VIX' },
    { id: 'vrp-sign', label: 'VRP 定义与符号' },
    { id: 'physical-risk-neutral', label: 'Physical P 与 Q' },
    { id: 'distribution-tails', label: 'Skew、Tail 与 Jump' },
    { id: 'forecast-benchmark', label: 'Forecast 与 Benchmark' },
    { id: 'event-clock', label: 'Event Clock 与 Total Variance' },
    { id: 'delta-hedged-book', label: 'Delta-hedged Book' },
    { id: 'gamma-theta-local', label: 'Gamma–Theta' },
    { id: 'realized-implied-identity', label: 'Realized-minus-implied 边界' },
    { id: 'discrete-hedge-jump', label: 'Discrete Hedge 与 Jump' },
    { id: 'vega-surface', label: 'Vega 与 Surface' },
    { id: 'surface-full-repricing', label: 'Surface Full Repricing' },
    { id: 'carry-theta-roll', label: 'Theta、Carry 与 Roll' },
    { id: 'pnl-attribution', label: 'P&L Attribution' },
    { id: 'long-vol', label: 'Long Volatility' },
    { id: 'short-vol', label: 'Short Volatility' },
    { id: 'event-vol', label: 'Event Volatility' },
    { id: 'calendar-forward-variance', label: 'Calendar 与 Forward Variance' },
    { id: 'skew-trades', label: 'Skew Trades' },
    { id: 'tail-structures', label: 'Tail Structures' },
    { id: 'overwrite', label: 'Overwrite / Put-writing' },
    { id: 'variance-swap', label: 'Variance Swap' },
    { id: 'volatility-swap', label: 'Volatility Swap' },
    { id: 'index-variance', label: 'Index Variance' },
    { id: 'implied-correlation', label: 'Implied Correlation' },
    { id: 'dispersion', label: 'Dispersion' },
    { id: 'dispersion-residuals', label: 'Dispersion Residual' },
    { id: 'vix-derivatives-vol-of-vol', label: 'VIX Derivatives / Vol-of-vol' },
    { id: 'greek-aggregation', label: 'Position Greeks' },
    { id: 'scenario-matrix', label: 'Full-repricing Scenarios' },
    { id: 'margin-funding', label: 'Margin 与 Funding' },
    { id: 'liquidity-execution', label: 'Liquidity 与 Leg Risk' },
    { id: 'sizing', label: 'Sizing' },
    { id: 'target-order-fill', label: 'Target–Actual–Fill' },
    { id: 'hedge-order-ledger', label: 'Hedge Order Ledger' },
    { id: 'lifecycle-operations', label: 'Lifecycle 与 Operations' },
    { id: 'vrp-evidence', label: 'VRP 与 Option Returns' },
    { id: 'demand-information', label: 'Demand 与 Information' },
    { id: 'crowding-feedback', label: 'Crowding 与 Feedback' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'checks-interfaces', label: '理解检查与课程接口' },
  ],
  Content: Lesson214Content,
  references: [
    { id: 1, authors: 'Fischer Black and Myron Scholes', year: '1973', accessedAt: '2026-08-30', title: 'The Pricing of Options and Corporate Liabilities', publication: 'Journal of Political Economy 81(3), 637–654', url: 'https://doi.org/10.1086/260062', use: '支持连续时间动态复制、Black–Scholes PDE 与 European option 定价；连续交易、扩散过程及无摩擦假设限制现实外推，论文不是期权收益或波动率预测模型。' },
    { id: 2, authors: 'Robert C. Merton', year: '1973', accessedAt: '2026-08-30', title: 'Theory of Rational Option Pricing', publication: 'The Bell Journal of Economics and Management Science 4(1), 141–183', url: 'https://doi.org/10.2307/3003143', use: '支持无套利复制、价格界限、股息与 American option 等扩展；结论仍依赖市场、融资和交易假设，不能直接解释经验期权回报。' },
    { id: 3, authors: 'Douglas T. Breeden and Robert H. Litzenberger', year: '1978', accessedAt: '2026-08-30', title: 'Prices of State-Contingent Claims Implicit in Option Prices', publication: 'The Journal of Business 51(4), 621–651', url: 'https://doi.org/10.1086/296025', use: '支持 European call price 对 strike 的二阶导数与 risk-neutral state-price density 的关系；需要共同到期、平滑、无套利和正确 carry，恢复的不是物理概率。' },
    { id: 4, authors: 'Steven L. Heston', year: '1993', accessedAt: '2026-08-30', title: 'A Closed-Form Solution for Options with Stochastic Volatility with Applications to Bond and Currency Options', publication: 'The Review of Financial Studies 6(2), 327–343', url: 'https://doi.org/10.1093/rfs/6.2.327', use: '支持 stochastic variance 与 spot–variance correlation 生成 smile、skew 和动态风险；参数模型校准成功不表示它是真实价格过程。' },
    { id: 5, authors: 'Bruno Dupire', year: '1994', accessedAt: '2026-08-30', title: 'Pricing with a Smile', publication: 'Risk 7(1), 18–20', url: 'https://www.risk.net/derivatives/1496713/legacy-dupire', use: '支持由无套利 option surface 推导 local volatility 的思路；静态拟合不唯一决定未来 surface dynamics，也不保证样本外 hedge 表现。' },
    { id: 6, authors: 'Mark Rubinstein', year: '1994', accessedAt: '2026-08-30', title: 'Implied Binomial Trees', publication: 'The Journal of Finance 49(3), 771–818', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb00079.x', use: '支持由 European option prices 构造与 smile 一致的 implied tree 与 state prices；离散化、报价噪声和非唯一动态限制解释。' },
    { id: 7, authors: 'Bernard Dumas, Jeff Fleming and Robert E. Whaley', year: '1998', accessedAt: '2026-08-30', title: 'Implied Volatility Functions: Empirical Tests', publication: 'The Journal of Finance 53(6), 2059–2106', url: 'https://doi.org/10.1111/0022-1082.00083', use: '支持 implied-volatility functions 的样本内定价与样本外 pricing／hedging 检验；历史 SPX 样本与具体参数化不能外推为普遍模型排序。' },
    { id: 8, authors: 'Jim Gatheral and Antoine Jacquier', year: '2014', accessedAt: '2026-08-30', title: 'Arbitrage-Free SVI Volatility Surfaces', publication: 'Quantitative Finance 14(1), 59–71', url: 'https://doi.org/10.1080/14697688.2013.819986', use: '支持以 total variance 和 SVI 构造无 butterfly／calendar static arbitrage 的曲面；无静态套利 snapshot 仍不提供真实 surface dynamics。' },
    { id: 9, authors: 'Scott Mixon', year: '2007', accessedAt: '2026-08-30', title: 'The Implied Volatility Term Structure of Stock Index Options', publication: 'Journal of Empirical Finance 14(3), 333–354', url: 'https://doi.org/10.1016/j.jempfin.2006.06.003', use: '支持股票指数期权 implied-volatility term structure 的经验特征和风险因素；特定市场与样本结果不是跨时期定律。' },
    { id: 10, authors: 'Rama Cont', year: '2006', accessedAt: '2026-08-30', title: 'Model Uncertainty and Its Impact on the Pricing of Derivative Instruments', publication: 'Mathematical Finance 16(3), 519–547', url: 'https://doi.org/10.1111/j.1467-9965.2006.00281.x', use: '支持多个校准相近模型可能对其他 claims、Greeks 与 hedges 给出不同结果；框架量化 model risk，但不识别唯一真实模型。' },
    { id: 11, authors: 'Bent Jesper Christensen and Nagpurnanand R. Prabhala', year: '1998', accessedAt: '2026-08-30', title: 'The Relation Between Implied and Realized Volatility', publication: 'Journal of Financial Economics 50(2), 125–150', url: 'https://doi.org/10.1016/S0304-405X(98)00034-8', use: '支持 IV 对随后 realized volatility 的信息含量及预测检验；IV 不因含有信息便成为定义上的无偏物理预测。' },
    { id: 12, authors: 'Mark Britten-Jones and Anthony Neuberger', year: '2000', accessedAt: '2026-08-30', title: 'Option Prices, Implied Price Processes, and Stochastic Volatility', publication: 'The Journal of Finance 55(2), 839–866', url: 'https://doi.org/10.1111/0022-1082.00228', use: '支持由 option prices 推断 integrated variance、减少对特定 stochastic-volatility 参数模型的依赖；连续 strike、无套利和实施假设仍存在。' },
    { id: 13, authors: 'George J. Jiang and Yisong S. Tian', year: '2005', accessedAt: '2026-08-30', title: 'The Model-Free Implied Volatility and Its Information Content', publication: 'The Review of Financial Studies 18(4), 1305–1342', url: 'https://doi.org/10.1093/rfs/hhi027', use: '支持 model-free implied volatility 的有限 strike 实施及信息含量；实际估计仍受 strike truncation、插值、报价和尾部处理影响。' },
    { id: 14, authors: 'Gurdip Bakshi and Nikunj Kapadia', year: '2003', accessedAt: '2026-08-30', title: 'Delta-Hedged Gains and the Negative Market Volatility Risk Premium', publication: 'The Review of Financial Studies 16(2), 527–566', url: 'https://doi.org/10.1093/rfs/hhg002', use: '支持 delta-hedged option gains 与负 market volatility risk premium 的经验联系；具体 P&L 仍依 hedge rule、跳跃、成本、离散再平衡和样本。' },
    { id: 15, authors: 'Peter Carr and Liuren Wu', year: '2009', accessedAt: '2026-08-30', title: 'Variance Risk Premiums', publication: 'The Review of Financial Studies 22(3), 1311–1341', url: 'https://doi.org/10.1093/rfs/hhn038', use: '支持 variance swap 与 VRP 的期限和动态结构；VRP 是 risk-neutral 与 physical 方差预期之差，不能简化成普通预测误差。' },
    { id: 16, authors: 'Tim Bollerslev, George Tauchen and Hao Zhou', year: '2009', accessedAt: '2026-08-30', title: 'Expected Stock Returns and Variance Risk Premia', publication: 'The Review of Financial Studies 22(11), 4463–4492', url: 'https://doi.org/10.1093/rfs/hhp008', use: '支持 aggregate VRP 与随后股票收益的经验预测关系；关系可能受样本、状态与模型选择影响，不自动构成可交易因果信号。' },
    { id: 17, authors: 'Viktor Todorov', year: '2010', accessedAt: '2026-08-30', title: 'Variance Risk-Premium Dynamics: The Role of Jumps', publication: 'The Review of Financial Studies 23(1), 345–383', url: 'https://doi.org/10.1093/rfs/hhp035', use: '支持 jumps 在 VRP dynamics 中的重要作用；jump 与 continuous variance 的识别依赖高频数据、测度和分解假设。' },
    { id: 18, authors: 'Geert Bekaert and Marie Hoerova', year: '2014', accessedAt: '2026-08-30', title: 'The VIX, the Variance Premium and Stock Market Volatility', publication: 'Journal of Econometrics 183(2), 181–192', url: 'https://doi.org/10.1016/j.jeconom.2014.05.008', use: '支持将 VIX 信息分解为预期方差与 variance premium；VIX 不是纯 realized-volatility forecast。' },
    { id: 19, authors: 'Oleg Bondarenko', year: '2014', accessedAt: '2026-08-30', title: 'Variance Trading and Market Price of Variance Risk', publication: 'Journal of Econometrics 180(1), 81–97', url: 'https://doi.org/10.1016/j.jeconom.2014.02.001', use: '支持 variance trading returns 与 variance risk price 的经验分析；结果仍依赖方差定义、合约实现、报价与样本。' },
    { id: 20, authors: 'David S. Bates', year: '2000', accessedAt: '2026-08-30', title: 'Post-’87 Crash Fears in the S&P 500 Futures Option Market', publication: 'Journal of Econometrics 94(1–2), 181–238', url: 'https://doi.org/10.1016/S0304-4076(99)00021-4', use: '支持 1987 年后 S&P 500 futures options 中 crash fears、jump risk 与 skew 的结构估计；参数模型和历史制度限制外推。' },
    { id: 21, authors: 'Jun Pan', year: '2002', accessedAt: '2026-08-30', title: 'The Jump-Risk Premia Implicit in Options: Evidence from an Integrated Time-Series Study', publication: 'Journal of Financial Economics 63(1), 3–50', url: 'https://doi.org/10.1016/S0304-405X(01)00088-5', use: '支持从期权和标的联合时间序列识别 jump-risk premia；结论依赖参数化过程、测度转换与估计设定。' },
    { id: 22, authors: 'Tim Bollerslev and Viktor Todorov', year: '2011', accessedAt: '2026-08-30', title: 'Tails, Fears, and Risk Premia', publication: 'The Journal of Finance 66(6), 2165–2211', url: 'https://doi.org/10.1111/j.1540-6261.2011.01695.x', use: '支持极端 tail risk、投资者 fear 与风险溢价的经验联系；尾部外推、jump 识别与测度转换存在显著不确定性。' },
    { id: 23, authors: 'Peter R. Hansen and Asger Lunde', year: '2006', accessedAt: '2026-08-30', title: 'Realized Variance and Market Microstructure Noise', publication: 'Journal of Business & Economic Statistics 24(2), 127–161', url: 'https://doi.org/10.1198/073500106000000071', use: '支持高频 realized variance 的 sampling trade-off、market-microstructure noise 与 noise-robust measurement；研究估计量不能替换产品的正式结算规则。' },
    { id: 24, authors: 'Anthony Neuberger', year: '1994', accessedAt: '2026-08-30', title: 'The Log Contract', publication: 'The Journal of Portfolio Management 20(2), 74–80', url: 'https://doi.org/10.3905/jpm.1994.409478', use: '支持 log contract 与 variance exposure replication 的核心直觉；连续路径、strike continuum、跳跃和实际合约定义决定实施误差。' },
    { id: 25, authors: 'Kresimir Demeterfi, Emanuel Derman, Michael Kamal and Joseph Zou', year: '1999', accessedAt: '2026-08-30', title: 'A Guide to Volatility and Variance Swaps', publication: 'The Journal of Derivatives 6(4), 9–32', url: 'https://doi.org/10.3905/jod.1999.319129', use: '支持 variance-swap replication、volatility 与 variance 合约差异及 convexity adjustment；现实 OTC convention、有限 strikes、跳跃、信用和资金成本仍重要。' },
    { id: 26, authors: 'Cboe Global Indices', year: '2026', accessedAt: '2026-08-30', title: 'Cboe Volatility Index Mathematics Methodology', publication: 'Official Index Methodology, Version 5.0, revised 26 February 2026', url: 'https://cdn.cboe.com/resources/indices/Cboe_Volatility_Index_Mathematics_Methodology.pdf', use: '支持当前 1/K² weighting、term/strike selection、Treasury-rate interpolation、index 与 series filtering；须与 VIX-specific 方法合读，2025 年后 zero bid 或 zero ask 均影响筛选。' },
    { id: 27, authors: 'Cboe Global Indices', year: '2026', accessedAt: '2026-08-30', title: 'Volatility Index Methodology: Cboe Volatility Index', publication: 'Official Index Methodology, Version 6.0, revised 26 February 2026', url: 'https://cdn.cboe.com/resources/indices/Volatility_Index_Methodology_Cboe_Volatility_Index.pdf', use: '支持当前 VIX 30-day bracket、week-ending SPX/SPXW、C1 source、15 秒发布及 spot/SOQ 差异；spot VIX 不可直接交易，也不是 P 下 RV 的定义预测。' },
    { id: 28, authors: 'Cboe Global Markets', year: 'current', accessedAt: '2026-08-30', title: 'VIX FAQs', publication: 'Official VIX Product FAQ', url: 'https://www.cboe.com/tradable-products/vix/faqs', use: '支持 VIX constituent-expiry window、spot calculation、VIX futures/options 与 settlement 的产品说明；FAQ 是解释入口，正式 methodology 与 exchange rules 优先。' },
    { id: 29, authors: 'Cboe Exchange, Inc.', year: '2024', accessedAt: '2026-08-30', title: 'S&P 500 Variance Futures Variance Calculator User Guide', publication: 'Official Technical User Guide, Version 1.0.0, 25 June 2024', url: 'https://www.cboe.com/document/tech-spec/document/technical-specifications/sp-500-variance-futures-variance-calculator-user-guide/', use: '支持 VA Futures 的 variance-unit 报价与清算、accrued realized plus forward variance 及 volatility/vega translation；listed futures 不等同 OTC swap，正式 specs 优先。' },
    { id: 30, authors: 'CME Group', year: 'current', accessedAt: '2026-08-30', title: 'A Primer on Margining Styles for Options', publication: 'CME Group Clearing Education', url: 'https://www.cmegroup.com/education/articles-and-reports/a-primer-on-margining-styles-for-options', use: '支持 premium-paid equity-style 与 futures-style variation settlement、NOV 和 SPAN 的现金时序差异；这是清算约定，不是价值理论，具体产品规则优先。' },
    { id: 31, authors: 'Nicholas P. B. Bollen and Robert E. Whaley', year: '2004', accessedAt: '2026-08-30', title: 'Does Net Buying Pressure Affect the Shape of Implied Volatility Functions?', publication: 'The Journal of Finance 59(2), 711–753', url: 'https://doi.org/10.1111/j.1540-6261.2004.00647.x', use: '支持 option net buying pressure 与 IV-function shape 的经验联系；需求和价格共同内生，不能单独识别信息、库存或对冲渠道。' },
    { id: 32, authors: 'Nicolae Gârleanu, Lasse Heje Pedersen and Allen M. Poteshman', year: '2009', accessedAt: '2026-08-30', title: 'Demand-Based Option Pricing', publication: 'The Review of Financial Studies 22(10), 4259–4299', url: 'https://doi.org/10.1093/rfs/hhp005', use: '支持有限风险承受能力的中介库存与 end-user demand 进入 option prices 和 smiles；模型与 inventory proxy 不能证明每次变动均由 dealer hedging 引起。' },
    { id: 33, authors: 'Joshua D. Coval and Tyler Shumway', year: '2001', accessedAt: '2026-08-30', title: 'Expected Option Returns', publication: 'The Journal of Finance 56(3), 983–1009', url: 'https://doi.org/10.1111/0022-1082.00352', use: '支持 put/call option returns 的经验风险补偿特征；高杠杆、非线性、极端偏度、报价和交易成本限制简单均值比较。' },
    { id: 34, authors: 'Mark Broadie, Mikhail Chernov and Michael Johannes', year: '2009', accessedAt: '2026-08-30', title: 'Understanding Index Option Returns', publication: 'The Review of Financial Studies 22(11), 4493–4529', url: 'https://doi.org/10.1093/rfs/hhp032', use: '支持以 jump、volatility risk 和有限样本解释 index-option return evidence；结论依赖过程、尾部事件与实施，不能把高均值称作无风险异常。' },
    { id: 35, authors: 'Amit Goyal and Alessio Saretto', year: '2009', accessedAt: '2026-08-30', title: 'Cross-Section of Option Returns and Volatility', publication: 'Journal of Financial Economics 94(2), 310–326', url: 'https://doi.org/10.1016/j.jfineco.2009.01.001', use: '支持 implied 与 historical volatility 差异和横截面 option returns 的经验关系；数据过滤、bid–ask、shorting、组合形成与样本外衰减决定可实施性。' },
    { id: 36, authors: 'George M. Constantinides, Jens Carsten Jackwerth and Alexi Savov', year: '2013', accessedAt: '2026-08-30', title: 'The Puzzle of Index Option Returns', publication: 'Review of Asset Pricing Studies 3(2), 229–257', url: 'https://doi.org/10.1093/rapstu/rat004', use: '支持 index-option return puzzle 对若干解释的检验；benchmark、rare-event exposure 与 microstructure 仍限制异常解释。' },
    { id: 37, authors: 'Dmitriy Muravyev and Neil D. Pearson', year: '2020', accessedAt: '2026-08-30', title: 'Options Trading Costs Are Lower than You Think', publication: 'The Review of Financial Studies 33(11), 4973–5014', url: 'https://doi.org/10.1093/rfs/hhaa010', use: '支持利用实际可执行交易改进 option cost 测量；结论不是零成本假设，订单选择、市场接入、冲击与容量仍须单独测量。' },
    { id: 38, authors: 'Joost Driessen, Pascal J. Maenhout and Grigory Vilkov', year: '2009', accessedAt: '2026-08-30', title: 'The Price of Correlation Risk: Evidence from Equity Options', publication: 'The Journal of Finance 64(3), 1377–1406', url: 'https://doi.org/10.1111/j.1540-6261.2009.01467.x', use: '支持由 index 与 component options 识别 correlation risk premium；dispersion 同时暴露于 variance、skew、jump、权重、流动性和执行误差。' },
    { id: 39, authors: 'Adrian Buss and Grigory Vilkov', year: '2012', accessedAt: '2026-08-30', title: 'Measuring Equity Risk with Option-Implied Correlations', publication: 'The Review of Financial Studies 25(10), 3113–3140', url: 'https://doi.org/10.1093/rfs/hhs087', use: '支持 option-implied correlations 的构造与风险测量；average/equicorrelation proxy 不等于完整相关矩阵，也不直接给出 correlation-swap payoff。' },
    { id: 40, authors: 'The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-30', title: 'Characteristics and Risks of Standardized Options', publication: 'Official Options Disclosure Document page', url: 'https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document', use: '支持 standardized options 的 exercise、assignment、settlement、adjustment 与 strategy risk disclosures；具体交易、税务和 broker 操作仍须核对当期规则与账户条款。' },
    { id: 41, authors: 'Cboe Global Markets', year: 'current', accessedAt: '2026-08-30', title: 'Implied Correlation Indices', publication: 'Official Cboe Index Hub', url: 'https://www.cboe.com/us/indices/implied/', use: '支持 Cboe 以 SPX 与 top-50 value-weighted components 的 ATM delta-relative constant-maturity IV 构造产品化 implied-correlation indices；该 ATM plug-in 不是 strip-based variance-swap implied correlation、完整矩阵或精确 dispersion P&L。' },
    { id: 42, authors: 'David Easley, Maureen O’Hara and P. S. Srinivas', year: '1998', accessedAt: '2026-08-30', title: 'Option Volume and Stock Prices: Evidence on Where Informed Traders Trade', publication: 'The Journal of Finance 53(2), 431–465', url: 'https://doi.org/10.1111/0022-1082.194060', use: '支持 informed traders 在股票与期权市场间选择及 option volume 的信息作用；信息解释不能自动证明标的变化来自做市商机械对冲。' },
    { id: 43, authors: 'Jun Pan and Allen M. Poteshman', year: '2006', accessedAt: '2026-08-30', title: 'The Information in Option Volume for Future Stock Prices', publication: 'The Review of Financial Studies 19(3), 871–908', url: 'https://doi.org/10.1093/rfs/hhj024', use: '支持 buyer-initiated opening option volume 与随后股票收益的信息关系；专有分类、样本与内生交易选择限制外推。' },
    { id: 44, authors: 'Sophie X. Ni, Jun Pan and Allen M. Poteshman', year: '2008', accessedAt: '2026-08-30', title: 'Volatility Information Trading in the Option Market', publication: 'The Journal of Finance 63(3), 1059–1091', url: 'https://doi.org/10.1111/j.1540-6261.2008.01352.x', use: '支持 non-market-maker volatility demand 对未来 RV 的信息含量及 earnings 周期变化；预测证据不等于 dealer-hedging 因果效应。' },
    { id: 45, authors: 'Sophie X. Ni, Neil D. Pearson, Allen M. Poteshman and Joshua White', year: '2021', accessedAt: '2026-08-30', title: 'Does Option Trading Have a Pervasive Impact on Underlying Stock Prices?', publication: 'The Review of Financial Studies 34(4), 1952–1986', url: 'https://doi.org/10.1093/rfs/hhaa082', use: '检验 option trading 是否普遍影响 underlying prices，并约束机械对冲叙事；gross OI 或 volume 不能确定 dealer net gamma、方向或 hedge flow。' },
    { id: 46, authors: 'Wei-Shao Wu, Yu-Jane Liu, Yi-Tsung Lee and Robert C. W. Fok', year: '2014', accessedAt: '2026-08-30', title: 'Hedging Costs, Liquidity, and Inventory Management: The Evidence from Option Market Makers', publication: 'Journal of Financial Markets 18, 25–48', url: 'https://doi.org/10.1016/j.finmar.2013.05.007', use: '支持 option market-maker inventory、delta-neutral rebalancing cost 与 spreads 的关系；台湾指数期权市场与内生库存限制跨市场外推。' },
    { id: 47, authors: 'Benjamin Anderegg, Florian Ulmann and Didier Sornette', year: '2022', accessedAt: '2026-08-30', title: 'The Impact of Option Hedging on the Spot Market Volatility', publication: 'Journal of International Money and Finance 124, 102627', url: 'https://doi.org/10.1016/j.jimonfin.2022.102627', use: '支持用 FX repository positions 研究 market-maker gamma、delta hedge 与 spot-vol feedback；结果依净仓位、对冲差异、冲击模型与样本，不能推广成固定符号。' },
    { id: 48, authors: 'Hayne E. Leland', year: '1985', accessedAt: '2026-08-30', title: 'Option Pricing and Replication with Transactions Costs', publication: 'The Journal of Finance 40(5), 1283–1301', url: 'https://doi.org/10.1111/j.1540-6261.1985.tb02383.x', use: '支持 proportional costs 下离散 replication 与 hedge adjustment；stylized approximation 不能覆盖跳跃、冲击、融资和现代保证金规则。' },
    { id: 49, authors: 'Markus K. Brunnermeier and Lasse Heje Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Market Liquidity and Funding Liquidity', publication: 'The Review of Financial Studies 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '支持 funding constraints、margin 与 market liquidity 的条件性强化循环；一般机制不能替代具体期权账户、CCP 或 broker margin engine。' },
    { id: 50, authors: 'The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-30', title: 'Margin Methodology', publication: 'Official OCC Clearing Margin Methodology', url: 'https://www.theocc.com/risk-management/margin-methodology', use: '支持当前 STANS full-portfolio Monte Carlo、99% Expected Shortfall base、stress、dependence、concentration 与 intraday calls；是 clearing-member 方法，不等于 customer margin。' },
    { id: 51, authors: 'A. Craig MacKinlay', year: '1997', accessedAt: '2026-08-30', title: 'Event Studies in Economics and Finance', publication: 'Journal of Economic Literature 35(1), 13–39', url: 'https://www.jstor.org/stable/2729691', use: '支持标准 event window、expected-return benchmark 与 abnormal-return inference；同期事件、选择、重叠窗口和错误 benchmark 下不能单独建立结构因果。' },
    { id: 52, authors: 'Alessandro Beber and Michael W. Brandt', year: '2006', accessedAt: '2026-08-30', title: 'The Effect of Macroeconomic News on Beliefs and Preferences: Evidence from the Options Market', publication: 'Journal of Monetary Economics 53(8), 1997–2039', url: 'https://doi.org/10.1016/j.jmoneco.2006.05.013', use: '支持 macro announcements 对 option-implied distributions、beliefs 与 risk preferences 的事件证据；surprise measurement、事件重叠和结构分解限制因果解释。' },
    { id: 53, authors: 'Bryan Kelly, Ľuboš Pástor and Pietro Veronesi', year: '2016', accessedAt: '2026-08-30', title: 'The Price of Political Uncertainty: Theory and Evidence from the Option Market', publication: 'The Journal of Finance 71(5), 2417–2480', url: 'https://doi.org/10.1111/jofi.12406', use: '支持政治事件不确定性进入 index 与 firm option prices 的理论及选举证据；具体 setting、模型与 treatment interpretation 限制外推。' },
    { id: 54, authors: 'James M. Patell and Mark A. Wolfson', year: '1979', accessedAt: '2026-08-30', title: 'Anticipated Information Releases Reflected in Call Option Prices', publication: 'Journal of Accounting and Economics 1(2), 117–140', url: 'https://doi.org/10.1016/0165-4101(79)90003-X', use: '支持 scheduled releases 前 option prices 对预期不确定性的反映；早期市场结构与样本限制今天的定量外推，结果主要是事件关联。' },
    { id: 55, authors: 'Stewart Mayhew, Atulya Sarin and Kuldeep Shastri', year: '1995', accessedAt: '2026-08-30', title: 'The Allocation of Informed Trading Across Related Markets: An Analysis of the Impact of Changes in Equity-Option Margin Requirements', publication: 'The Journal of Finance 50(5), 1635–1653', url: 'https://doi.org/10.1111/j.1540-6261.1995.tb05191.x', use: '支持利用 option-margin changes 研究 informed trading 在股票与期权间的重新配置；制度冲击的非对称反应、排除限制与市场特定性约束因果外推。' },
  ],
  readingList: [
    { title: 'Black & Scholes (1973) · The Pricing of Options and Corporate Liabilities', scope: '动态复制、Black–Scholes PDE、连续对冲与定价假设', reason: '建立 option risk 被拆为标的与剩余 convexity exposure 的理论起点。', url: 'https://doi.org/10.1086/260062', group: 'core', guide: '先读复制组合、PDE 直觉、公式和 assumptions；约 120–180 分钟。' },
    { title: 'Breeden & Litzenberger (1978) · Prices of State-Contingent Claims', scope: 'Strike curvature、state prices 与 risk-neutral density', reason: '把单个 IV 扩展成整条 option surface 所编码的状态价格。', url: 'https://doi.org/10.1086/296025', group: 'core', guide: '重点读 call-price derivatives 与 state-price interpretation；约 120–180 分钟。' },
    { title: 'Christensen & Prabhala (1998) · Implied and Realized Volatility', scope: 'IV 预测信息、realized-volatility benchmark 与统计检验', reason: '建立“IV 含未来信息”与“IV 是无偏 physical forecast”的边界。', url: 'https://doi.org/10.1016/S0304-405X(98)00034-8', group: 'core', guide: '重点读 measurement、forecast regressions 与 conclusions；约 120–180 分钟。' },
    { title: 'Neuberger (1994) · The Log Contract', scope: 'Log payoff、dynamic trading 与 variance exposure replication', reason: '从 vanilla options 进入 variance products 与 model-free variance 的最短机制桥。', url: 'https://doi.org/10.3905/jpm.1994.409478', group: 'core', guide: '先掌握 replication intuition，再记录连续路径与实施假设；约 90–120 分钟。' },
    { title: 'Demeterfi et al. (1999) · A Guide to Volatility and Variance Swaps', scope: 'Variance-swap replication、strike、vega units 与 convexity', reason: '把“交易波动率”还原为合约 payoff、option strip、hedging 和结算。', url: 'https://doi.org/10.3905/jod.1999.319129', group: 'core', guide: '重点读 replication、fair strike 与 volatility-versus-variance；约 180–240 分钟。' },
    { title: 'Hansen & Lunde (2006) · Realized Variance and Market Microstructure Noise', scope: 'Sampling frequency、microstructure noise 与 realized-measure robustness', reason: '理解提高采样频率为何既增加路径信息，也可能放大报价噪声和测量偏差。', url: 'https://doi.org/10.1198/073500106000000071', group: 'core', guide: '重点读 sampling trade-off、noise diagnostics 与 empirical results；约 150–210 分钟。' },
    { title: 'Heston (1993) · Stochastic Volatility', scope: 'Stochastic variance、spot–variance correlation、smile 与 dynamic Greeks', reason: '理解 skew 可来自变化的 variance state，而不是一张静态 IV 曲线。', url: 'https://doi.org/10.1093/rfs/6.2.327', group: 'models', guide: '重点读 setup、correlation mechanism 与 pricing structure；约 180–240 分钟。' },
    { title: 'Dupire (1994) · Pricing with a Smile', scope: '由 option surface 推导 local volatility', reason: '区分精确拟合当前 surface 与正确描述未来 surface movement。', url: 'https://www.risk.net/derivatives/1496713/legacy-dupire', group: 'models', guide: '先读 local-vol 直觉，再与 Heston 比较 dynamics；约 90–150 分钟。' },
    { title: 'Gatheral & Jacquier (2014) · Arbitrage-Free SVI Volatility Surfaces', scope: 'Total variance、SVI、butterfly 与 calendar arbitrage', reason: '从 desk smile parameterization 进入可审计的 static no-arbitrage surface。', url: 'https://doi.org/10.1080/14697688.2013.819986', group: 'models', guide: '重点读 SVI conditions 与 surface construction；约 180–240 分钟。' },
    { title: 'Cboe (2026) · VIX Mathematics v5.0 + VIX Methodology v6.0', scope: '当前 strike/term selection、1/K² weighting、30-day interpolation、filtering 与 SOQ', reason: '以现行官方规则校准 VIX，避免使用旧方法或把 spot VIX 当可交易 physical forecast。', url: 'https://cdn.cboe.com/resources/indices/Cboe_Volatility_Index_Mathematics_Methodology.pdf', group: 'models', guide: '先读 #26 数学方法，再读 #27 产品方法与 spot/SOQ 差异；约 120–180 分钟。' },
    { title: 'Britten-Jones & Neuberger (2000) · Implied Price Processes', scope: 'Option prices、integrated variance 与 model-free identification', reason: '理解“model-free”减少哪类参数假设，又保留哪些市场条件。', url: 'https://doi.org/10.1111/0022-1082.00228', group: 'models', guide: '重点读 identification result、assumptions 与 implementation；约 180–240 分钟。' },
    { title: 'Carr & Wu (2009) · Variance Risk Premiums', scope: 'Variance swaps、Q/P variance expectations 与 VRP dynamics', reason: '把 IV–RV spread 从 forecast error 改写为风险补偿与预期共同作用。', url: 'https://doi.org/10.1093/rfs/hhn038', group: 'models', guide: '先读 VRP definition 与 term structure，再读 dynamics；约 180–240 分钟。' },
    { title: 'Gârleanu, Pedersen & Poteshman (2009) · Demand-Based Option Pricing', scope: 'End-user demand、dealer inventory 与 price pressure', reason: '建立 volatility trader、做市商风险承受与 surface shape 的均衡接口。', url: 'https://doi.org/10.1093/rfs/hhp005', group: 'models', guide: '重点读 intermediary mechanism、inventory 与 implications；约 180–240 分钟。' },
    { title: 'Bakshi & Kapadia (2003) · Delta-Hedged Gains', scope: 'Delta-hedged P&L、realized versus implied variance 与 VRP evidence', reason: '把 long/short vol 收益还原为明确 hedge rule 和经验 P&L。', url: 'https://doi.org/10.1093/rfs/hhg002', group: 'evidence', guide: '重点读 return construction、结果与 robustness；约 150–210 分钟。' },
    { title: 'Broadie, Chernov & Johannes (2009) · Understanding Index Option Returns', scope: 'Index option returns、jump risk、volatility risk 与 rare events', reason: '看到高 short-option historical return 时先检查尾部和样本。', url: 'https://doi.org/10.1093/rfs/hhp032', group: 'evidence', guide: '重点读 puzzle、model comparison 与 rare-event interpretation；约 180–240 分钟。' },
    { title: 'Driessen, Maenhout & Vilkov (2009) · The Price of Correlation Risk', scope: 'Index/component options、correlation premium 与 dispersion', reason: '理解核心 correlation exposure，同时保留 variance、skew、jump 和 execution legs。', url: 'https://doi.org/10.1111/j.1540-6261.2009.01467.x', group: 'evidence', guide: '先读 index-variance decomposition，再读 empirical premium；约 180–240 分钟。' },
    { title: 'Ni, Pan & Poteshman (2008) · Volatility Information Trading', scope: 'Non-market-maker volatility demand、future RV 与 earnings', reason: '建立 informed volatility demand 与 dealer mechanical hedging 的竞争解释。', url: 'https://doi.org/10.1111/j.1540-6261.2008.01352.x', group: 'evidence', guide: '重点读 demand construction、earnings design 与 price impact；约 150–210 分钟。' },
    { title: 'Ni et al. (2021) · Does Option Trading Have a Pervasive Impact?', scope: 'Option-to-stock pressure、hedging hypothesis 与识别边界', reason: '约束由 OI 或 volume 推断 dealer gamma 和标的必然走势的叙事。', url: 'https://doi.org/10.1093/rfs/hhaa082', group: 'evidence', guide: '重点读 hypotheses、identification tests 与 limits；约 180–240 分钟。' },
    { title: 'Anderegg, Ulmann & Sornette (2022) · Option Hedging and Spot Volatility', scope: 'FX option positions、market-maker gamma、hedge flow 与 feedback', reason: '提供净仓位型证据并展示 hedge feedback 所需的可观察条件。', url: 'https://doi.org/10.1016/j.jimonfin.2022.102627', group: 'evidence', guide: '重点读 position reconstruction、impact model 与 window；约 150–210 分钟。' },
    { title: 'Kelly, Pástor & Veronesi (2016) · The Price of Political Uncertainty', scope: 'Election events、political uncertainty 与 option-implied pricing', reason: '示范把事件前 uncertainty、firm exposure 与 option prices 连接成可检验研究。', url: 'https://doi.org/10.1111/jofi.12406', group: 'evidence', guide: '先读 predictions，再审查 event design 与 causal boundary；约 180–240 分钟。' },
  ],
};
