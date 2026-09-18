import EndogenousDynamicsLab from '../components/EndogenousDynamicsLab';
import EndogenousLoopChart from '../components/EndogenousLoopChart';
import { endogenousDynamicsScenarios } from '../components/endogenousDynamicsScenarios';
import { lesson221ReadingList, lesson221References } from './lesson-2-21-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson221Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>异质性本身不会制造复杂市场；只有当市场结果不对称地改写主体状态，并重新进入下一轮行动时，差异才闭合成内生动力。</h2>
        <p>
          Chapter 2 前二十节分别回答了“谁在交易、追求什么、受什么约束、怎样形成订单”。本节把这些横截面描述接成时间递归：主体以财富、持仓、负债、信念、风险估计和授权为起点，形成目标，经约束投影与执行才成为真实成交；成交改变价格、波动、流动性和资产负债表，结果又改变下一轮的目标、约束、策略采用率与资本份额。于是，价格不再只是系统输出，也是下一轮输入。<Cite n={4} /><Cite n={28} /><Cite n={30} />
        </p>
        <div className="causal-chain" aria-label="异质主体形成内生动力的完整递归链" role="list">
          <div role="listitem"><span>01</span><b>State</b><p>财富、持仓、负债、信念与规则。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Target</b><p>目标敞口与期限。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Projection</b><p>融资、风险、授权与通道。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Order / fill</b><p>提交、撮合、成交与残余。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Market outcome</b><p>价格、深度、波动与相关性。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Update</b><p>P&amp;L、保证金、得分与构成。</p></div>
          <i aria-hidden="true">↺</i><div role="listitem"><span>07</span><b>Next round</b><p>更新状态重新生成需求。</p></div>
        </div>
        <p>
          必须同时保留两个反例。第一，一百名观点不同但永不交易、权重不变且价格不反馈的主体，只构成静态异质性；第二，一群规则完全相同的杠杆账户，也可能因“下跌—保证金—卖出—再下跌”的递归产生内生动态。因此，<b>异质性既不是内生动力的充分条件，也不是必要条件</b>。它之所以重要，是因为同一结果通常以不同方向和强度改变不同主体，使聚合需求函数本身随历史路径变化。<Cite n={68} /><Cite n={70} /><Cite n={71} />
        </p>
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、先修与六阶段路线</p>
        <h2>本节不是再列一遍主体，而是把 2.01 与 2.02–2.20 的接口压成一台可审计的递归引擎。</h2>
        <div className="learning-objectives">
          <span>六阶段路线 · 从静态主体差异到可证伪的动态闭环</span>
          <ol>
            <li><b>闭环语言（00–09）：</b>区分异质性、系统内生性、计量内生性、状态、存量、流量、冲击、时钟和市场交互。</li>
            <li><b>递归引擎（10–23）：</b>沿目标—投影—订单—成交—市场结果，依次更新财富、持仓、融资、风险、信念和构成。</li>
            <li><b>反馈与稳定性（24–35）：</b>只用 fixed point、局部 gain、二维耦合、延迟和阈值建立动力直觉。</li>
            <li><b>构成演化（36–47）：</b>解释 forced flow、同步、战略互补、财富选择、规则切换、学习、进入退出与内生 regime。</li>
            <li><b>案例与识别（48–55）：</b>重建 Flash Crash、2020 Treasury、LDI 与 GME，并用数据地图、识别阶梯和断链反证限制归因。</li>
            <li><b>迁移（56–59）：</b>完成 10 道互动题、10 道静态孪生、14 道检查、18 个术语、Evidence Passport 与 20 组阅读。</li>
          </ol>
        </div>
        <p>
          硬先修是 2.01；建议重点回看 T01、T03、T05–T08、1.08–1.09、1.20、2.07–2.20。85–90 分钟核心首读走 00–09 → 10–23 → 24–30、33–35 → 39–47 → 48、51–55 → 56 仅读说明、58–59；第二遍补 31–32、36–38、49–50 及全部练习。完整 agent-based model（ABM，主体建模）、网络拓扑、校准、模拟不确定性和政策反事实留给 Chapter 7。<Cite n={30} /><Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="two-endogeneity-meanings">
        <p className="section-kicker">02 · “Endogenous”的两种含义</p>
        <h2>系统内生性问“变量是否由系统内部递归产生”；计量内生性问“解释变量是否与未观测误差相关”，二者不能互换。</h2>
        <p>
          在本节的动力学语言里，若价格、财富或波动由主体行为共同生成，又反过来改变主体行为，它就是系统内生变量。在经验研究里，即使研究者把一个变量称为“外生新闻”，它仍可能因反向因果、共同冲击、选择或测量误差而与结果方程的误差相关。前者描述模型边界，后者描述因果估计失败的风险。一个变量“在模型内求解”绝不等于它的现实效应已经被识别。<Cite n={47} /><Cite n={48} /><Cite n={105} />
        </p>
        <div className="precision-note"><span>最小语言纪律</span><p>“市场内生地放大了冲击”是一条机制主张；“基金卖出对价格的回归系数有内生性”是一条识别警告。前一句需要闭环状态证据，后一句需要工具、阈值、制度差异或其他可信反事实，不能用同一个 endogenous 标签代替两套论证。</p></div>
      </section>

      <section className="lesson-section" id="closure-tests">
        <p className="section-kicker">03 · 动力闭环的四项测试</p>
        <h2>一组主体只有同时通过“状态依赖、市场交互、结果回写、重复进入”四项测试，才形成内生动力系统。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="内生动力闭环的四项测试，可横向滚动">
          <table className="concept-table">
            <caption>缺一项时，最多得到静态差异、一次传播或外生驱动过程</caption>
            <thead><tr><th scope="col">测试</th><th scope="col">必须观察或建模</th><th scope="col">未通过时</th></tr></thead>
            <tbody>
              <tr><th scope="row">State dependence</th><td>行为规则读取价格、财富、风险、库存等内生状态</td><td>只是固定计划或外生序列</td></tr>
              <tr><th scope="row">Interaction</th><td>一个主体的行动经清算、深度、库存或信息影响共同结果</td><td>只是彼此独立的账户模拟</td></tr>
              <tr><th scope="row">State update</th><td>结果改变下一期主体状态、约束或有效权重</td><td>只有一次冲击传导</td></tr>
              <tr><th scope="row">Recurrence</th><td>更新后的状态再次进入行动规则</td><td>只有会计重估，没有行为反馈</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这四项也解释为何“大家意见不同”不是答案。若不同意见恰好生成抵消订单、价格对净流不响应、财富权重固定，系统可以平静；反之，一个单一机械风控规则若反复读取自身造成的波动，也可形成强递归。研究应逐项指出哪一箭头存在，而不是以“复杂性”填补缺失机制。<Cite n={4} /><Cite n={25} /><Cite n={72} />
        </p>
      </section>

      <section className="lesson-section" id="agent-rule-bundle">
        <p className="section-kicker">04 · Agent 是规则束，不是机构标签</p>
        <h2>“基金、散户、银行”只描述法律或组织外壳；进入动力系统的是状态、目标、约束、信息与时钟共同构成的规则束。</h2>
        <p>
          同一基金可在某账户中逆向承接，在另一个账户中按 benchmark 被动再平衡；两家法律实体不同的机构也可能共享同一风险模型、收盘数据和执行算法。只有会改变目标函数、可行域、执行路径或状态更新的差异才是经济上相关的 heterogeneity。职业名称若不能预测这些箭头，就不应直接当作模型 type。<Cite n={30} /><Cite n={55} /><Cite n={92} />
        </p>
        <p>
          本节因此使用“fundamentalist、trend、market maker、margin-constrained fund”等原型规则，但每次都说明它们只是局部机制，不是现实主体的永久身份。一名主体可以同时持有多条规则，一条规则也可被多类机构采用；类型归属本身还会随表现、组织和环境变化。<Cite n={25} /><Cite n={26} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="dynamic-state-vector">
        <p className="section-kicker">05 · Dynamic State Vector</p>
        <h2>真正携带系统记忆的不是“过去价格”四个字，而是足以决定下一轮规则输出的一组状态。</h2>
        <div className="equation-card">
          <span>单资产教学状态</span>
          <div>S<sub>t</sub> = (p<sub>t</sub>, v<sub>t</sub>, {'{'}q<sub>i,t</sub>, C<sub>i,t</sub>, B<sub>i,t</sub>, W<sub>i,t</sub>, U<sub>i,t</sub>, θ<sub>i</sub>{'}'}<sub>i=1…N</sub>, I<sup>M</sup><sub>t</sub>)</div>
          <p>p 与参考价值 v 的单位是货币/股；q 与 dealer 库存 Iᴹ 是股；现金 C、债务 B、财富 W 是货币；规则得分 U 建议无量纲；θ 是在研究区间内冻结或另有转移式的参数。状态必须足以复原下一步，但是否满足 Markov 性是建模选择，不是现实市场没有更长记忆的事实。</p>
        </div>
        <p>
          预测窗口、未完成订单、赎回申请、结算应收应付或期权到期，若会改变下一期行动，也必须进入状态。把这些省略后，模型可能把真正的路径依赖误装进误差项，再事后称之为“不可预测冲击”。<Cite n={30} /><Cite n={34} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="stock-flow-shock-outcome">
        <p className="section-kicker">06 · Stock、Flow、Shock 与 Outcome</p>
        <h2>持仓、订单、成交、收益、财富和策略份额属于不同对象；若单位与状态转移不闭合，再精致的反馈图也只是叙事。</h2>
        <div className="equation-card">
          <span>最小存量—流量恒等式</span>
          <div>q<sub>i,t+1</sub> = q<sub>i,t</sub> + y<sub>i,t</sub> + corporate / derivative events；　W<sub>i,t</sub> = C<sub>i,t</sub> + q<sub>i,t</sub>p<sub>t</sub> − B<sub>i,t</sub></div>
          <p>q 是期末持仓存量，y 是期间实际成交流量；拆股、行权、到期和公司行动另列。价格变化可在没有成交的情况下重估财富，成交也可以只是现金换资产而不等于同额财富损失。外生 shock ξ 改变转移式中的一个输入，market outcome 则是主体互动共同生成的结果。</p>
        </div>
        <p>
          最常见的单位错误，是把“货币目标敞口”直接加到“股份持仓”、把“日波动”输入分钟参数，或把“人数占比”当成“AUM 占比”。所有系数都必须带对象、单位、频率、定义域与零值处理。<Cite n={13} /><Cite n={25} /><Cite n={80} />
        </p>
      </section>

      <section className="lesson-section" id="clocks-information-set">
        <p className="section-kicker">07 · 事件、决策、成交与信息时钟</p>
        <h2>反馈强弱不只由方向决定；观察、估计、决策、下单、成交、结算和披露之间的延迟会改变整个路径。</h2>
        <div className="equation-card">
          <span>主体信息集与研究回测信息集必须分开</span>
          <div>I<sup>agent</sup><sub>i,t</sub> = {'{'}z : availableAt<sub>i</sub>(z) ≤ τ<sub>t</sub> 且 observedAt<sub>i</sub>(z) ≤ τ<sub>t</sub>{'}'}</div>
          <div>I<sup>research</sup><sub>t</sub> = {'{'}z : publicAt(z) ≤ τ<sub>t</sub> 且 observedAt<sub>system</sub>(z) ≤ τ<sub>t</sub>{'}'}</div>
          <p>τₜ 是决策截止时点。对公共材料，availableAtᵢ=publicAt；对私人、客户或专有数据，应使用 receivedAtᵢ 或 accessGrantedAtᵢ，而不能假装人人同时公开可见。研究者做可复现实盘回测时则采用第二式，并保存 event/measurement、decision、order、fill、settlement、public、observed 与 revision vintage。</p>
        </div>
        <p>
          同一负反馈若使用过时风险估计并在多日内机械执行，可能在价格已经反向后继续交易，形成 overshoot；同一正反馈若主体时钟分散、执行缓慢，反而可能被承接。因此，日频共同持仓与日收益的相关性通常不能恢复盘中谁先行动、谁跟随、谁只是同时响应新闻。<Cite n={34} /><Cite n={83} /><Cite n={89} />
        </p>
      </section>

      <section className="lesson-section" id="market-interaction-operator">
        <p className="section-kicker">08 · Market Interaction Operator</p>
        <h2>主体行动只有经过清算、有限深度、dealer 库存或订单簿，才成为共同市场结果；这一步不是一条永恒不变的乘数。</h2>
        <div className="equation-card">
          <span>两种互斥的局部实现</span>
          <div>Walrasian：Σ<sub>i</sub>q<sup>d</sup><sub>i</sub>(p<sub>t+1</sub>; S<sub>t</sub>) = Q̄；　有限深度：r<sub>t+1</sub> = Λ<sub>t</sub>D<sub>t</sub> − Ψ<sub>t</sub>I<sup>M</sup><sub>t</sub> + ε<sub>t+1</sub></div>
          <p>第一式由价格使计划需求等于供给；若无解或多解，还需选择规则。第二式允许客户净成交 D 由 dealer 反向承接，Λ、Ψ 的单位为 log-price/股。它们是不同市场实现，不应同时要求 D=0 又让 ΛD≠0。</p>
        </div>
        <p>
          现实冲击常呈凹形且随深度、订单簿 gap、时段和方向变化。线性式只用于冻结状态附近的算术；历史估计的 Λ 不是跨股票、跨规模、跨频率或跨压力状态的结构常数。<Cite n={25} /><Cite n={80} /><Cite n={81} /><Cite n={84} /><Cite n={86} />
        </p>
      </section>

      <section className="lesson-section" id="exogenous-endogenous-decomposition">
        <p className="section-kicker">09 · 外生触发与内生传播</p>
        <h2>现实事件通常不是“外生或内生”二选一，而是外部触发进入不同主体状态后，被吸收、放大、转向或反转。</h2>
        <p>
          财政公告、疫情新闻、指数调整或保证金规则变化可以是初始 trigger；它首先改变价格、现金需求、估值或合规状态。随后，谁接近约束、谁必须按规则行动、市场当时有多少承接能力，决定同样冲击的路径。若后续订单在没有新外部信息时继续由已发生的价格和损益生成，传播部分就是内生的。<Cite n={68} /><Cite n={73} /><Cite n={78} />
        </p>
        <p>
          仅凭价格序列很难把两者唯一拆开：ARCH/GARCH 等纯约化式也能描述波动持久，异质主体模拟同样能生成厚尾和波动簇。统计形状是需要解释的现象，不是某一机制的指纹。<Cite n={38} /><Cite n={40} /><Cite n={97} /><Cite n={98} /><Cite n={99} />
        </p>
      </section>

      <section className="lesson-section" id="state-dependent-target">
        <p className="section-kicker">10 · 状态依赖的目标头寸</p>
        <h2>目标不是固定偏好的直接翻译，而是信息、价格、风险、财富、负债和规则在当前状态下的联合输出。</h2>
        <div className="equation-card">
          <span>兼容基本面与趋势规则的局部预测</span>
          <div>μ̂<sub>h,t</sub> = b<sub>h</sub> + φ<sub>hF</sub>(f<sub>t</sub>−x<sub>t</sub>) + φ<sub>hC</sub>(x<sub>t</sub>−x<sub>t−Lh</sub>)/L<sub>h</sub></div>
          <p>x=log(p/Pref)，f=log(v/Pref)，Pref&gt;0 只用于消除价格单位；μ̂ 与 bₕ 都是同一 h 预测期的预期超额 log return（log-point / h-horizon）。φₕF 是对当前 log mispricing 的无量纲反应；趋势信号是每个基础步的平均 log return，因此 φₕC 是把该信号映射到 h 期预测的基础步数倍率。Lₕ 必须为正整数且历史足够。v 缺失或非正时基本面项为 N/A；线性规则只在校准点附近解释。</p>
        </div>
        <p>
          即便预测相同，目标仍可因风险厌恶、负债期限、benchmark 和财富而不同。这里的规则只把 Chapter 2 各主体目标压进同一接口，不重新证明某一 rule 正确，也不把不可观测参考价值当作事后真值。<Cite n={21} /><Cite n={23} /><Cite n={25} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="constraint-projection">
        <p className="section-kicker">11 · Constraint Projection 是非线性变换</p>
        <h2>同一无约束目标经过不同可行域后，可以变成加仓、零订单或被迫反向减仓；阈值因此进入聚合动力。</h2>
        <div className="equation-card">
          <span>单资产均值—方差教学近似与投影</span>
          <div>A*<sub>i,t</sub> = W<sub>i,t</sub> μ̂<sub>i,t</sub> /(γ<sub>i</sub>σ̂²<sub>i,t</sub>)；　A<sup>tar</sup><sub>i,t</sub> = clip(A*<sub>i,t</sub>, −ℓ<sup>short</sup><sub>i</sub>W<sub>i,t</sub>, ℓ<sup>long</sup><sub>i</sub>W<sub>i,t</sub>)</div>
          <p>A 是货币敞口，目标股数 qᵗᵃʳ=Aᵗᵃʳ/p；ℓˢʰᵒʳᵗ、ℓˡᵒⁿᵍ≥0。μ̂ 与 σ̂² 必须是同一预测期的 log-return 均值与方差；把它们直接放入标准均值—方差式，采用的是小收益下 simple return≈log return 的局部近似，本节数字题按该教学式定义。还要求 W&gt;0、p&gt;0、γ&gt;0、σ̂²&gt;0；方差为零或缺失时结果为 N/A，不是无限仓位。W≤0 时应进入违约/处置规则。</p>
        </div>
        <p>
          clip 说明为何“平均状态的代表主体”会失败：一部分主体触顶、另一部分未触顶时，先求平均再投影不等于逐主体投影后相加。观察到低头寸也不能识别到底是低预期、高风险、borrow、资本还是 mandate 在绑定。<Cite n={1} /><Cite n={4} /><Cite n={67} /><Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="target-to-order-path">
        <p className="section-kicker">12 · 从目标差额到订单轨迹</p>
        <h2>可行目标与当前持仓之间的差额，只是待执行需求；紧迫度、参与率、市场状态和期限决定它怎样分期进入市场。</h2>
        <div className="equation-card">
          <span>目标差额与提交容量</span>
          <div>d<sub>i,t</sub> = q<sup>tar</sup><sub>i,t</sub> − q<sub>i,t</sub>；　z<sub>i,t</sub> = clip(d<sub>i,t</sub>, −ρ<sub>i</sub>V̂<sub>t|t−</sub>, ρ<sub>i</sub>V̂<sub>t|t−</sub>)</div>
          <p>d 是目标订单，z 是本期提交量，单位都是股；0≤ρ≤1，V̂ 是下单前可用的预测或滞后容量。若 V̂=0，提交容量为零；参与率的真实事后分母为零时记 N/A。</p>
        </div>
        <p>
          执行算法还可根据价格偏离、deadline、排队概率和 adverse selection 动态改变 z。把同周期最终成交量 V 倒填为实时容量会偷看未来；把目标差额当成一笔立即成交，则同时省略了执行选择和市场反应。<Cite n={25} /><Cite n={83} /><Cite n={86} />
        </p>
      </section>

      <section className="lesson-section" id="fill-residual-state">
        <p className="section-kicker">13 · Fill 与残余订单状态</p>
        <h2>提交订单只有与队列、对手方和价格条件相遇才成为成交；未成交部分不是消失，而是下一轮决策必须处理的状态。</h2>
        <div className="equation-card">
          <span>最小成交与残余账</span>
          <div>y<sub>i,t</sub> = ϕ<sub>i,t</sub>z<sub>i,t</sub>；　q<sub>i,t+1</sub> = q<sub>i,t</sub> + y<sub>i,t</sub>；　u<sub>i,t+1</sub> = q<sup>tar</sup><sub>i,t</sub> − q<sub>i,t+1</sub></div>
          <p>ϕ∈[0,1] 是题内简化 fill ratio；真实 limit order 还可能部分成交、撤单或价格改善。u 是尚未完成的目标差额，不自动等于下一期订单，因为主体会用新价格和新状态重新优化。</p>
        </div>
        <p>
          成交样本本身有选择：只有愿意在当时价格与队列交易的订单被观察。用 fills 反推全部 latent demand，会把未提交、撤单和受约束需求误当成不存在。<Cite n={82} /><Cite n={85} /><Cite n={87} />
        </p>
      </section>

      <section className="lesson-section" id="market-outcome-update">
        <p className="section-kicker">14 · Market Outcome Update</p>
        <h2>实际成交和报价变化共同更新价格、spread、depth 与波动；可见净流既不是全部需求，也不是价格变化的唯一原因。</h2>
        <div className="equation-card">
          <span>归一化凹冲击的备选近似</span>
          <div>r<sup>impact</sup><sub>t+1</sub> = η · sign(D<sub>t</sub>) · (|D<sub>t</sub>| / ADV<sub>t</sub>)<sup>δ</sup></div>
          <p>要求 ADV&gt;0、η≥0、0&lt;δ≤1，并定义 sign(0)=0。D 与 ADV 同为该交易期的股数，比例无量纲；η 与 r 都是同一时间跨度的 log return（log-point）。D=0 时内生冲击为 0，ADV=0 时比例和冲击式为 N/A。它与线性冲击式是备选经验近似，不能未经重新估计叠加。</p>
        </div>
        <p>
          同样规模的成交在空薄订单簿中可跨越更大 gap；价格也会因报价撤回和信息更新而移动，不必等待大额成交。长期价格响应、临时冲击和信息发现还是不同 estimand。<Cite n={81} /><Cite n={83} /><Cite n={84} /><Cite n={85} /><Cite n={86} />
        </p>
      </section>

      <section className="lesson-section" id="wealth-pnl-update">
        <p className="section-kicker">15 · Wealth 与 P&amp;L Update</p>
        <h2>同一市场收益通过方向、规模、对冲、成交价、融资和费用产生不同损益，从而改变不同规则下一轮的有效权重。</h2>
        <div className="equation-card">
          <span>同周期结算的简化财富检查式</span>
          <div>ΔW<sub>i</sub> = q<sub>i,t</sub>(p<sub>t+1</sub>−p<sub>t</sub>) + y<sub>i,t</sub>(p<sub>t+1</sub>−p̄<sub>i,t</sub>) − fee − interest + F<sub>i,t</sub></div>
          <p>p̄ 是真实成交均价；只有题目明确线性路径且成交均匀时才能用首尾中点。F 是股息等外部现金收入。购买资产支付现金并不等于同额财富损失；新增借款同时增加现金和负债，也不创造净权益。</p>
        </div>
        <p>
          若衍生品、short borrow、抵押品或结算周期重要，就必须扩展账本。仅用标的收益乘“方向标签”判断谁赚钱，会错过 hedge、basis、option convexity 和 carry。财富权重更新之前，还应将外部申赎与投资收益分开。<Cite n={56} /><Cite n={58} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="position-inventory-update">
        <p className="section-kicker">16 · Position 与 Inventory Update</p>
        <h2>数量状态必须与财富状态分开：价格重估能改变资本却不改变股数，成交能改变股数却未必代表观点变化。</h2>
        <p>
          客户实际净买 D 时，若没有发行或注销，dealer 或其他外部部门必须成交 −D。dealer 库存更新可写为 I<sup>M</sup><sub>t+1</sub>=I<sup>M</sup><sub>t</sub>−D<sub>t</sub>；若模型只看客户而省略对手方，客户净头寸可非零，但全市场股份账不能凭空增长。衍生品到期、公司行动和证券借贷另有数量腿。<Cite n={25} /><Cite n={81} /><Cite n={82} />
        </p>
        <p>
          成交动机也不能由数量变化反推：买入可能是看多、short cover、delta hedge、benchmark rebalance 或被动申购。只有把期初头寸、合约、触发规则和同期其他 legs 合并，数量变化才进入因果解释。<Cite n={11} /><Cite n={13} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="funding-collateral-update">
        <p className="section-kicker">17 · Funding 与 Collateral Update</p>
        <h2>不利价格只有在资本缓冲不足、抵押品或融资条件绑定时，才从账面损失转化为强迫订单。</h2>
        <div className="equation-card">
          <span>单资产对称杠杆上限近似</span>
          <div>G<sub>i,t</sub>=|q<sub>i,t</sub>|p<sub>t</sub>；　ℓ<sub>i,t</sub>=G<sub>i,t</sub>/W<sub>i,t</sub>；　q<sup>cap</sup><sub>i,t</sub>=sign(q<sub>i,t</sub>)min(|q<sub>i,t</sub>|, ℓ̄W<sub>i,t</sub>/p<sub>t</sub>)</div>
          <p>要求 p&gt;0、ℓ̄≥0，并定义 sign(0)=0；W&gt;0 时才定义 leverage，G=0 且 W&gt;0 时 ℓ=0，W≤0 时为 N/A 并进入处置状态。qᶜᵃᵖ只在保留当前方向的前提下缩小超限头寸，不是允许反向建仓、替换资产或优化现金腿的一般目标函数，也不是 option、short borrow 或真实 portfolio margin 的通用公式。</p>
        </div>
        <p>
          Margin call 也不等于即时全额出售：主体可交现金、卖其他资产、降低 hedge、获得融资或与对手方协商；即使决定卖出，成交容量仍限制速度。反馈成立需要“约束绑定—缓冲不足—实际订单—承接有限”四个连续证据。<Cite n={67} /><Cite n={68} /><Cite n={70} /><Cite n={75} />
        </p>
      </section>

      <section className="lesson-section" id="risk-estimator-update">
        <p className="section-kicker">18 · Risk Estimator Update</p>
        <h2>收益路径通过波动、相关性和流动性估计器进入下一轮目标或限额，使“过去的市场结果”成为机械需求的输入。</h2>
        <p>
          Vol-control、VaR 和 risk parity 都读取风险估计，但它们的目标、资产腿和约束不同。估计器还有窗口、衰减、频率、缺失处理和版本：快速估计先反应但更噪，慢估计滞后且可能延长执行。多时钟的 reduced-form 波动级联能描述持久性，却不能自动映射成具体主体。<Cite n={34} /><Cite n={72} /><Cite n={97} />
        </p>
        <p>
          “波动上升导致卖出”只有在主体原本持有正风险敞口、目标风险下降、约束绑定并真实成交时成立；short、option、现金缓冲和再平衡方向都可能改变符号。若用本期收盘后才计算出的 realized volatility 解释同一收盘前订单，同样发生时间旅行。<Cite n={68} /><Cite n={69} /><Cite n={72} />
        </p>
      </section>

      <section className="lesson-section" id="belief-update">
        <p className="section-kicker">19 · Belief Update</p>
        <h2>价格既是交易结果也是含噪信息；主体可据新闻、价格、他人行动和预测误差更新信念，但交易数据通常不能唯一恢复更新规则。</h2>
        <p>
          在理性信息模型中，价格部分聚合私人信号；在行为模型中，近期路径可能被当作趋势、代表性样本或他人信息的代理；在职业环境中，价格还影响声誉和相对排名。相同的买入因此可能来自 Bayesian 更新、技术规则、信息扩散或高阶信念。<Cite n={6} /><Cite n={7} /><Cite n={18} /><Cite n={19} /><Cite n={62} />
        </p>
        <p>
          账户匹配调查显示信念与组合有关，却也提示信念变化并不总能强预测“何时交易”。实验市场能观察受试者预期和聚合路径，但受控反馈结构不等于现实市场。研究应直接测量预期、冻结信息时点，并保留“信念改变但因约束没有成交”的可能。<Cite n={92} /><Cite n={100} /><Cite n={101} /><Cite n={104} />
        </p>
      </section>

      <section className="lesson-section" id="fitness-update">
        <p className="section-kicker">20 · Performance 与 Fitness Update</p>
        <h2>规则下一轮是否更有吸引力，取决于怎样定义“表现”；预测准确、风险调整收益、效用和职业评价不是同一个分数。</h2>
        <div className="equation-card">
          <span>有记忆的预测误差得分</span>
          <div>U<sub>h,t+1</sub> = (1−α<sub>U</sub>)U<sub>h,t</sub> + α<sub>U</sub>[−(r<sub>t+1</sub>−r̂<sub>h,t+1|t</sub>)²/s²<sub>r</sub> − c<sub>h</sub>]</div>
          <p>0≤αU≤1，sr&gt;0；预测与实现必须属于同一时间区间，cₕ 是无量纲信息/使用成本。用平方误差只是一个选择；若真实主体按 P&amp;L、drawdown、benchmark 或职业风险行动，应改写 score。</p>
        </div>
        <p>
          时序必须是先用 t 时点规则生成预测与订单，再观察 r<sub>t+1</sub>，最后更新 U<sub>t+1</sub>。若先用实现收益更新权重，再让新权重解释同一期成交，模型已经读取未来。Brock–Hommes 的重要贡献正是把规则表现和选择强度变成状态，而不是宣称所有市场按同一 logit 学习。<Cite n={27} /><Cite n={28} /><Cite n={31} /><Cite n={103} />
        </p>
      </section>

      <section className="lesson-section" id="delegated-capital-flow-update">
        <p className="section-kicker">21 · 委托资本流更新</p>
        <h2>价格先改变基金表现与排名，投资者申赎再改变 AUM 与可执行资本；这条慢反馈能延长动量，也可能在亏损时抽走稳定资本。</h2>
        <p>
          委托账户的资本不是固定权重。相对表现、排名、注意力、流动性条款和投资者负债共同形成流入/流出；管理人再用现金缓冲、交易成本和授权把流量转成资产订单。资金流可能滞后过去收益，从而让价格—表现—流入—买入—价格闭环持续；极端流出则可能迫使管理人出售原本仍看好的资产。<Cite n={66} /><Cite n={79} /><Cite n={88} /><Cite n={89} /><Cite n={90} />
        </p>
        <p>
          但流量不是过去收益的确定函数：主动再平衡、退休缴款、渠道营销和资产配置都会改变它；流量也可能含投资者信息。经验研究的“flow-induced trading”估计只在特定基金覆盖、冲击构造和反事实下成立。<Cite n={88} /><Cite n={89} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="composition-four-legs">
        <p className="section-kicker">22 · 构成变化的四条腿</p>
        <h2>“趋势资本占比上升”必须分解为相对收益、外部流量、规则切换与进入退出；否则同一个权重变化可以承载四种不同因果故事。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="策略构成变化四腿分解，可横向滚动">
          <table className="concept-table">
            <caption>策略权重还必须注明是人数、财富、成交还是风险贡献</caption>
            <thead><tr><th scope="col">构成腿</th><th scope="col">状态转移</th><th scope="col">需要的证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">Relative return</th><td>既有资本因不同净收益改变财富份额</td><td>期初资本、真实净 P&amp;L、无申赎 bridge</td></tr>
              <tr><th scope="row">External flow</th><td>投资者给策略净申购或赎回</td><td>申赎现金及分配时点</td></tr>
              <tr><th scope="row">Switching</th><td>同一主体改用另一条规则</td><td>规则身份、切换时点与成本</td></tr>
              <tr><th scope="row">Entry / exit</th><td>新主体出现或原主体关闭</td><td>数据库出生、死亡与存续者偏差</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          人数占比 n、财富/AUM 份额 ω、单位资本头寸 x 与可执行约束 Ω 不能统一写成“市场份额”。二十个小账户采用趋势规则，并不等于它们比一个大型 dealer 控制更多风险；同一 AUM 也可因杠杆和衍生品形成不同风险贡献。<Cite n={29} /><Cite n={52} /><Cite n={54} /><Cite n={56} />
        </p>
      </section>

      <section className="lesson-section" id="recursive-state-machine">
        <p className="section-kicker">23 · 主递归状态机</p>
        <h2>把一轮市场写成明确的先后顺序，才能判断结果在哪一步重新成为原因，以及哪一本账没有闭合。</h2>
        <EndogenousLoopChart />
        <div className="equation-card">
          <span>最小递归写法</span>
          <div>(S<sub>t</sub>, ω<sub>t</sub>, ξ<sub>t</sub>) → targets → projected orders → fills → Y<sub>t+1</sub> → (S<sub>t+1</sub>, ω<sub>t+1</sub>)</div>
          <p>ξ 是外部冲击，Y 是价格、波动、流动性等共同结果。状态 S 和有效权重 ω 更新后，才进入下一轮。此图是解释协议，不是已经校准、验证或可用于政策反事实的现实数字孪生。</p>
        </div>
        <p>
          Santa Fe 人工市场和后续主体模型展示了如何将规则、学习和市场机制程序化，但“能生成类似厚尾”只表明 generative possibility。完整 ABM 还要处理初始化、warm-up、参数识别、随机种子、校准、验证、样本外和政策不变性，留到 7.20 与 7.25–7.27。<Cite n={43} /><Cite n={44} /><Cite n={45} /><Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="fixed-point-stability">
        <p className="section-kicker">24 · Fixed Point 不等于 Dynamic Stability</p>
        <h2>每一期有清算价格，只说明当期方程有解；它不保证从附近状态出发的跨期路径会回到同一点。</h2>
        <p>
          固定点 S* 满足 S*=F(S*)。动态稳定则问：对 S* 加一个小扰动，反复应用 F 后偏离是收缩、保持还是扩张。一个市场可以每期清算，却在各期清算价之间振荡；也可以存在多个清算解，需要历史和选择规则决定走向哪一个。<Cite n={21} /><Cite n={23} /><Cite n={28} />
        </p>
        <div className="precision-note"><span>三个不等号</span><p>存在 fixed point ≠ 从现实初值会到达；局部稳定 ≠ 全局稳定；确定性稳定 ≠ 带噪系统具有有限尾部风险。政策、约束或策略权重变化还会让转移函数 F 本身改变。</p></div>
      </section>

      <section className="lesson-section" id="scalar-loop-gain">
        <p className="section-kicker">25 · 一维 Local Loop Gain</p>
        <h2>Loop gain 把“当前偏离经过整条链后，下一轮留下多少偏离”压成一个局部数字；符号说明方向，绝对值说明局部放大程度。</h2>
        <div className="equation-card">
          <span>一维局部线性化</span>
          <div>e<sub>t+1</sub> ≈ G e<sub>t</sub>；　G = F′(e*)</div>
          <p>只有一条标量、可微、串联的路径，且没有直接项或并行路径时，链式法则才给出 G=(∂target/∂e)×(∂fill/∂target)×(∂outcome/∂fill)×(∂next state/∂outcome)。多条并行路径要把各路径导数乘积相加；多状态系统则进入下一节的 Jacobian。|G|&lt;1 时小偏离局部衰减，|G|&gt;1 局部放大，G=±1 是边界；每段量纲必须先闭合。</p>
        </div>
        <p>
          这个数字只适用于明确状态、频率和线性化点。若冲击改变深度、触发 margin 或让策略切换，链上的导数也随状态变化；不能把某段历史估出的 G 当成普适危机阈值。正反馈 G&gt;0 也不自动失稳，只要总增益仍小于一。<Cite n={23} /><Cite n={25} /><Cite n={102} />
        </p>
      </section>

      <section className="lesson-section" id="coupled-local-stability">
        <p className="section-kicker">26 · 耦合状态的局部稳定性</p>
        <h2>当价格、财富、波动、margin 与策略权重同时更新，逐条看箭头正负可能判断错误；系统稳定取决于它们共同组成的反馈矩阵。</h2>
        <div className="equation-card">
          <span>多变量局部条件</span>
          <div>s<sub>t+1</sub> − s* ≈ J(s*)(s<sub>t</sub> − s*)；　J<sub>ab</sub> = ∂F<sub>a</sub>/∂s<sub>b</sub></div>
          <p>离散时间下，固定点局部渐近稳定的标准条件是 Jacobian J 的全部特征根模长小于 1，即谱半径 ρ(J)&lt;1。单个相关系数不是 J 的元素；约束拐点处还需分段或单侧分析。</p>
        </div>
        <p>
          本节只保留直觉：一条弱正反馈可被另一条负反馈抵消，两条各自稳定的回路也可能因耦合和延迟失稳。正式特征值、分岔、随机稳定与相变分析属于 Chapter 7。<Cite n={28} /><Cite n={29} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="delay-overshoot">
        <p className="section-kicker">27 · Delay 与 Overshoot</p>
        <h2>负反馈并不天然平滑：若它依据旧状态、执行太慢或修正太强，系统可能越过目标并反复振荡。</h2>
        <p>
          设价值交易者按昨日误价下单，今日价格已因其他资本回归，但旧订单仍在执行；或风险模型用长窗口估计，波动下降后仍持续去杠杆。此时行动方向在决策时合理，却对成交时状态过度修正。相反，分散的时钟、较低参与率和新信息可提供阻尼。<Cite n={23} /><Cite n={34} /><Cite n={85} />
        </p>
        <p>
          研究延迟必须区分 signal lag、decision lag、execution lag、settlement lag 和 disclosure lag。把所有滞后塞进一个 AR 项，只能描述路径，不能告诉你究竟谁还在执行旧目标。<Cite n={14} /><Cite n={83} /><Cite n={97} />
        </p>
      </section>

      <section className="lesson-section" id="threshold-nonlinearity">
        <p className="section-kicker">28 · Threshold 与 Piecewise Nonlinearity</p>
        <h2>平静期的小相关可能在主体跨过 margin、limit、赎回或流动性阈值后突变，因为规则本身换了分支。</h2>
        <p>
          约束未绑定时，价格下跌只是财富重估；绑定后，同一额外跌幅会生成强制减仓。Dealer 库存在资本范围内可通过报价吸收订单，接近 limit 后则可能扩大 spread 或撤回。连续的外部状态因此可以产生离散的行为跳变，并让历史平均系数失效。<Cite n={67} /><Cite n={68} /><Cite n={71} /><Cite n={73} />
        </p>
        <p>
          事后看到非线性并不能自动指出阈值来自哪项约束。可信解释应在事前测量 buffer 或 eligibility，预测效应集中于接近阈值的主体，并观察 target、order 与 fill 的中间状态。<Cite n={76} /><Cite n={78} /><Cite n={89} />
        </p>
      </section>

      <section className="lesson-section" id="fundamentalist-feedback">
        <p className="section-kicker">29 · Fundamentalist Negative Feedback</p>
        <h2>价值型需求只有在估值可行动、资本未受限且成交足以影响价格时，才把误价拉回；“价值投资者存在”不是稳定性保证。</h2>
        <div className="equation-card">
          <span>冻结价值与权重的局部误价动力</span>
          <div>m<sub>t</sub>=x<sub>t</sub>−f；　D<sup>F</sup><sub>t</sub>=−K<sub>F</sub>m<sub>t</sub>；　m<sub>t+1</sub>=(1−ΛK<sub>F</sub>)m<sub>t</sub></div>
          <p>KF≥0 是误价到订单的局部反应，Λ≥0 是订单到 log-price 的局部冲击。0&lt;ΛKF&lt;2 时局部收敛；等于 2 时等幅交替，大于 2 时线性近似发散。</p>
        </div>
        <p>
          参考价值 v 有测量误差，收敛期限未知，short 和融资也可能受限。若价值资本在偏离扩大时亏损、遭赎回或提高 margin，它可从逆向买方翻为同向卖方；这个符号翻转在 31 节展开。<Cite n={21} /><Cite n={23} /><Cite n={25} /><Cite n={66} />
        </p>
      </section>

      <section className="lesson-section" id="trend-feedback">
        <p className="section-kicker">30 · Trend / Chartist Positive Feedback</p>
        <h2>过去上涨只有在趋势信号提高目标、形成净买入并遇到有限承接时，才制造下一轮上涨；任何一环不足都可让闭环衰减。</h2>
        <div className="equation-card">
          <span>冻结权重的纯趋势局部式</span>
          <div>D<sup>C</sup><sub>t</sub>=K<sub>C</sub>r<sub>t</sub>；　r<sub>t+1</sub>=ΛK<sub>C</sub>r<sub>t</sub></div>
          <p>|ΛKC|&lt;1 时收益反馈局部衰减；大于 1 才局部放大。这一条件不保证价格回到基本价值，因为系统甚至没有价值锚。</p>
        </div>
        <p>
          现实趋势资本的窗口、持仓、风险缩放和执行时钟不同；价格上涨还可能让 short covering 或理性投机者提前进入。技术分析在部分市场真实存在，但观察到 momentum 不能识别 chartist 份额或排除信息缓慢扩散。<Cite n={17} /><Cite n={19} /><Cite n={24} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="arbitrage-sign-switch">
        <p className="section-kicker">31 · Contrarian / Arbitrage 的符号翻转</p>
        <h2>稳定价格的逆向资本，可能因路径亏损、赎回、haircut 或 risk limit 在偏离最深时被迫成为同向卖方。</h2>
        <p>
          初始阶段，价值或相对价值策略在价格低于估值时买入，提供负反馈；若错价继续扩大，mark-to-market 损失降低财富，外部投资者撤资，borrow/haircut 恶化，策略只能减仓。于是“下跌—逆向加仓”在约束点切成“下跌—平仓卖出”，price elasticity 突然下降。<Cite n={15} /><Cite n={66} /><Cite n={67} /><Cite n={68} />
        </p>
        <p>
          亏损并不证明观点错误，平仓也不证明管理人改变信念；这是 horizon mismatch 与 financing constraint 的作用。相反，新资本、内部资金或更长负债期限可在压力中承接，因此不能把所有反转都归因“套利者终于回来”。<Cite n={59} /><Cite n={75} /><Cite n={77} />
        </p>
      </section>

      <section className="lesson-section" id="market-maker-sign-switch">
        <p className="section-kicker">32 · Market-maker Inventory 的符号翻转</p>
        <h2>做市库存控制通常通过逆向报价吸收客户流；当资本、adverse selection 或技术边界绑定时，同一主体会扩大点差、减量或撤单。</h2>
        <p>
          正常状态下，客户连续买入使 dealer 库存下降，dealer 提高 ask、提高 bid 以吸引卖方或外部对冲，库存反馈具有稳定成分。压力状态下，库存限额、净资本、融资成本、信息不对称和系统负荷同时恶化，dealer 不再以旧深度承接；同样流量便产生更大 impact。<Cite n={25} /><Cite n={73} /><Cite n={75} /><Cite n={82} />
        </p>
        <p>
          交易量大不等于流动性充足：同一份风险可以在算法间快速转手，却没有长期风险承接者。2010 Flash Crash 提供这一动态案例，但不能被简化为“所有 HFT 都撤退”或“一个坏算法单独造成崩盘”。<Cite n={113} /><Cite n={114} />
        </p>
      </section>

      <section className="lesson-section" id="risk-control-feedback">
        <p className="section-kicker">33 · Risk-control Feedback</p>
        <h2>风险估计上升只是在目标或限额方程中改变一个输入；订单方向仍取决于原始暴露、现金腿、规则类型、约束与真实成交。</h2>
        <p>
          Long-only vol-control 可能降低正风险资产敞口，risk-parity 可能在多资产间重新分配，VaR breach 可能先触发升级审批而非自动卖出，option book 还可能通过对冲买入标的。把它们统一称为“波动卖家”，会丢掉符号与状态。<Cite n={69} /><Cite n={72} /><Cite n={75} />
        </p>
        <p>
          反馈成立的顺序是 realized path → estimator update → risk usage/target gap → authorized action → submitted order → fill → market state update。风险模型若被很多主体以相近窗口使用会同步，但不同模型、缓冲和执行期限也能去同步。<Cite n={34} /><Cite n={71} /><Cite n={72} />
        </p>
      </section>

      <section className="lesson-section" id="gamma-feedback">
        <p className="section-kicker">34 · Gamma Hedging 的反馈符号</p>
        <h2>Option activity 只有在知道 dealer 的净 gamma、客户方向、期限与实际 delta hedge 后，才能判断对冲是追涨杀跌还是逆向稳定。</h2>
        <p>
          令 Δ<sup>opt</sup> 表示计入买卖方向、合约数量与合约乘数后，整本期权仓位以“标的股数等价”计量的 delta；q<sup>hedge</sup> 是实际持有的标的对冲股数，近似 delta-neutral 时 q<sup>hedge</sup>≈−Δ<sup>opt</sup>。Γ<sup>opt</sup>=∂Δ<sup>opt</sup>/∂S，表示标的价格 S 每变动一货币单位时，整本 delta 改变多少股数等价。因此 Γ<sup>opt</sup>&lt;0 且 S↑ → Δ<sup>opt</sup>↓ → q<sup>hedge</sup>↑ → 买入标的；S↓ 时方向相反，形成同向反馈。正 gamma 的再平衡方向通常相反。这个符号链以实际持有净 gamma、确实用标的或期货再平衡、对冲时点与容量为条件；跨 strike、maturity、客户和自营头寸的净额、离散阈值、交易成本与 margin 都会改变真实订单。<Cite n={131} />
        </p>
        <p>
          因此，“期权成交量大”“call volume 高”或“零售买 call”都不能单独识别 dealer 的净仓位和对冲流。SEC staff 对 2021 年 1 月 GME 的数据审查没有发现 gamma squeeze 证据：individual-customer 期权交易虽大幅增加，却主要由 put buying 增长驱动，而且 market makers 是 call buyers 而非 call writers；这些观察与典型 gamma-squeeze 链条不一致。<Cite n={122} />
        </p>
      </section>

      <section className="lesson-section" id="funding-market-liquidity-loop">
        <p className="section-kicker">35 · Funding–Market Liquidity Loop</p>
        <h2>价格损失、波动与流动性恶化提高融资压力；去杠杆又压低价格和深度，只有约束绑定与承接不足时才闭合成螺旋。</h2>
        <div className="equation-card">
          <span>一侧局部保证金反馈</span>
          <div>D<sup>M</sup><sub>t</sub>≈−K<sub>M</sub>(−r<sub>t</sub>)<sub>+</sub>；　r<sup>M</sup><sub>t+1</sub>≈−ΛK<sub>M</sub>(−r<sub>t</sub>)<sub>+</sub></div>
          <p>(x)+=max(x,0)。Dᴹ 以股计，r 是该步 log return，因此 Kᴹ 的单位是 股/log-return，Λ 的单位是 log-return/股，连续下跌一侧的幅度乘数 gᴹ=ΛKᴹ 无量纲。gᴹ&lt;1 局部衰减，gᴹ&gt;1 局部放大，gᴹ=1 是线性边界；容量、破产、价格边界、新资本和政策都会改变路径。</p>
        </div>
        <p>
          共同下跌不能证明 liquidity spiral；必须看到 margin/haircut、融资额度、损失、实际处置和深度之间的时序。理论提供条件机制，中介杠杆证据与危机报告提供不同层级的现实锚点。<Cite n={68} /><Cite n={69} /><Cite n={70} /><Cite n={73} /><Cite n={75} />
        </p>
      </section>

      <section className="lesson-section" id="forced-flow-cascade">
        <p className="section-kicker">36 · Forced-flow Cascade</p>
        <h2>赎回、margin、负债现金流和监管限额看似不同，但都可沿“必须筹资或降风险—实际出售—价格恶化—新现金需求”形成级联。</h2>
        <p>
          第一阶段是 obligation：投资者赎回、对手方 collateral call、养老金支付或资本规则要求一个现金/风险结果；第二阶段才是 management response，主体可用现金、融资、hedge、gating 或卖出；第三阶段是 execution 与承接；第四阶段才可能通过价格回写形成新 obligation。跳过选择集合，就会把“有赎回”直接写成“卖出某资产”。<Cite n={68} /><Cite n={74} /><Cite n={88} /><Cite n={89} />
        </p>
        <p>
          断链者包括充足现金缓冲、外部融资、liquidity-management tools、资产替代、政策买方和未受损资本。Cascade 是条件路径，不是每一次负债现金流的自然结局。<Cite n={67} /><Cite n={75} /><Cite n={115} />
        </p>
      </section>

      <section className="lesson-section" id="rule-synchronization">
        <p className="section-kicker">37 · Rule Synchronization</p>
        <h2>主体可以在偏好上异质，却因共同数据、窗口、benchmark、收盘时钟或资格规则突然像同一个人那样行动。</h2>
        <p>
          若大量账户读取相同收盘价、同一波动窗口、同一指数调整日或同一 margin schedule，触发器会相关；共同执行又通过价格成为所有人的新输入。异质阈值平时分散订单，但大冲击可能一次跨过分布尾部，使同步突然上升。<Cite n={34} /><Cite n={72} /><Cite n={78} /><Cite n={79} />
        </p>
        <p>
          指数纳入与权重变化提供共同交易需求的经验入口，但 excess-comovement 结果对 benchmark、matched control 和 time-varying beta 敏感；正证据必须与反证并读。同步也可能只是共同新闻反应，不需要主体相互模仿。<Cite n={94} /><Cite n={95} /><Cite n={96} />
        </p>
      </section>

      <section className="lesson-section" id="endogenous-risk-bearing-capacity">
        <p className="section-kicker">38 · 风险承接能力的内生撤回</p>
        <h2>市场最需要买方时，dealer、套利基金、资管人和公司可能因同一价格变化同时失去资本，使聚合需求弹性内生下降。</h2>
        <p>
          承接能力不是固定“市场深度”。价格下跌损害中介权益，波动提高 margin，赎回抽走套利资本，相关性上升使分散化失效；原本愿意逆向买入者提高要求回报、缩小尺寸或完全退出。相同的外部卖单于是产生更大价格变化，价格再进一步减少承接能力。<Cite n={66} /><Cite n={68} /><Cite n={75} /><Cite n={77} /><Cite n={78} />
        </p>
        <p>
          需求系统和 inelastic-markets 研究尝试量化聚合持仓与价格敏感度，但函数形式、工具、覆盖与工作论文状态必须保留；“一美元流入带来固定多美元市值”不是跨市场结构常数。新资本与政策承接还会让弹性反向上升。<Cite n={80} /><Cite n={91} />
        </p>
      </section>

      <section className="lesson-section" id="strategic-complementarity">
        <p className="section-kicker">39 · Strategic Complementarity</p>
        <h2>当别人先卖会降低我等待的收益时，“预期别人行动”本身进入最佳反应，协调反馈可在完全理性主体之间出现。</h2>
        <div className="equation-card">
          <span>标量最佳反应教学式</span>
          <div>ā = b̄ + χā；　a* = b̄/(1−χ)，χ≠1；　迭代 a<sup>(k+1)</sup>=b̄+χa<sup>(k)</sup> 稳定需 |χ|&lt;1</div>
          <p>a 是无量纲行动强度，b 是私人/基本状态，χ 是对他人平均行动的反应。有代数固定点不等于朴素动态会收敛；加入 clip 后可能出现多解。</p>
        </div>
        <p>
          在流动性 run 中，预期别人卖出会让未来退出价更差，因此提前卖有私利；在 beauty contest 中，短期价格取决于高阶预期。共同信号也能让行动相关，所以识别 complementarity 必须证明 payoff interdependence，而不能只看同步。<Cite n={62} /><Cite n={63} /><Cite n={64} /><Cite n={74} />
        </p>
      </section>

      <section className="lesson-section" id="reflection-problem">
        <p className="section-kicker">40 · Common Shock、Interaction 与 Reflection</p>
        <h2>观察到主体同步，不足以区分共同信息、共同约束、直接模仿、战略互补或价格中介；这些机制在聚合数据中可以观察等价。</h2>
        <p>
          同一宏观公告会让彼此毫无联系的账户同时交易；同一 risk model 会造成共同规则反应；主体也可能观察他人、担心他人先卖，或只是共同读取价格。最终都表现为相关订单和价格移动。若研究者用“平均同伴行为”解释个体行为，个体又同时构成这个平均值，内生同伴效应、共同群体环境与相关个体特征就会混在一起，这正是 Manski 意义上的 reflection/identification problem。<Cite n={11} /><Cite n={12} /><Cite n={62} /><Cite n={65} /><Cite n={130} />
        </p>
        <p>
          区分机制需要额外变化：谁先收到信号、谁暴露于某网络边、谁接近预定阈值、谁因制度或时区无法行动，以及效应是否只在高 interaction exposure 中增强。成交相关性最多是起点，不是 herding 的终点证据。<Cite n={63} /><Cite n={64} /><Cite n={78} />
        </p>
      </section>

      <section className="lesson-section" id="heterogeneity-double-sign">
        <p className="section-kicker">41 · 异质性的双重符号</p>
        <h2>差异可以通过分散阈值和相反期限稳定市场，也可以让分布尾部积累脆弱性并在大冲击下突然同步；只有“异质程度”无法判断方向。</h2>
        <p>
          若价值、趋势、做市和负债驱动资本在不同时钟、不同资产和不同约束下行动，一方卖出可被另一方承接，聚合订单较平滑。但若许多主体虽阈值不同，却共享同一价格与融资渠道，大冲击会依次跨过阈值；承接者也在过程中损失资本，原本分散的反应最终收敛为同向交易。<Cite n={29} /><Cite n={37} /><Cite n={42} /><Cite n={76} />
        </p>
        <p>
          因此要问异质性位于哪里：信念、财富、方向、期限、阈值、执行时钟，还是资产替代集合？两个样本有相同平均杠杆和相同横截面方差，也可能因靠近 margin 边界的质量不同而产生完全不同 forced flow。<Cite n={4} /><Cite n={68} /><Cite n={71} />
        </p>
      </section>

      <section className="lesson-section" id="wealth-selection">
        <p className="section-kicker">42 · Wealth Selection</p>
        <h2>即使每条策略从不改变规则，相对收益也会改变它们控制的资本，从而让下一期聚合需求函数内生演化。</h2>
        <div className="equation-card">
          <span>剔除外部流量后的财富份额更新</span>
          <div>ω<sub>h,t+1</sub> = ω<sub>h,t</sub>G<sup>W</sup><sub>h,t+1</sub> / Σ<sub>g</sub>ω<sub>g,t</sub>G<sup>W</sup><sub>g,t+1</sub></div>
          <p>GW 是 pre-flow gross wealth growth；参与更新的财富应非负且总财富严格为正，总财富为零时为 N/A。外部申赎、策略转移和进入退出必须另列。</p>
        </div>
        <p>
          市场选择并不保证“真信念必胜”：结果依市场完备性、贴现、储蓄、风险厌恶、杠杆和尾部状态；财富趋零的主体仍可能在此前长期影响价格。短期幸运和卖尾部风险也会获得资本，直到罕见状态出现。<Cite n={15} /><Cite n={56} /><Cite n={57} /><Cite n={58} /><Cite n={59} /><Cite n={60} /><Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="strategy-switching">
        <p className="section-kicker">43 · Strategy Switching</p>
        <h2>主体可以在规则之间切换；相对表现、信息成本、切换成本与选择强度共同决定采用率，而不是市场自动选择“正确模型”。</h2>
        <div className="equation-card">
          <span>多项 logit 教学式</span>
          <div>n<sub>h,t+1</sub> = exp(βU<sub>h,t+1</sub>) / Σ<sub>g</sub>exp(βU<sub>g,t+1</sub>)</div>
          <p>β≥0；β=0 给均匀采用率，β 较大表示对得分差更敏感。计算时应减去最大 U 以防数值溢出。U、β 的单位必须相容；n 是采用率，不是财富份额。</p>
        </div>
        <p>
          选择强度上升可让主体快速追逐近期赢家，使规则权重本身成为正反馈状态；高信息成本又可能使便宜的偏误规则获得份额。实验与估计支持“切换是可行解释”，却没有直接观察自然市场中每个账户的 utility 或固定类型。<Cite n={27} /><Cite n={28} /><Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={103} />
        </p>
      </section>

      <section className="lesson-section" id="within-rule-learning">
        <p className="section-kicker">44 · Within-rule Learning</p>
        <h2>主体无需更换“价值”或“趋势”标签，也可通过更新参数、注意权重、窗口和执行方式改变行为；这与财富选择和主体替换是不同状态转移。</h2>
        <p>
          一条趋势规则可把窗口从 20 日延长到 100 日，一名价值投资者可降低对某估值信号的置信度，一家 dealer 可在异常流中改变 adverse-selection 模型。预测误差先更新规则内部 θ，再由同一 rule family 生成不同目标；若研究只看粗标签，就会误把行为变化称为新类型进入。<Cite n={32} /><Cite n={43} /><Cite n={44} /><Cite n={45} />
        </p>
        <p>
          学习不保证校正：短样本会追逐噪声，竞争会让已公开 edge 衰减，环境改变又使旧经验过时。学习预测实验提供可观测预期与受控反馈，但真实主体还面对交易成本、财富、授权和市场影响。<Cite n={51} /><Cite n={53} /><Cite n={101} /><Cite n={102} /><Cite n={103} /><Cite n={104} />
        </p>
      </section>

      <section className="lesson-section" id="entry-exit-survival">
        <p className="section-kicker">45 · Entry、Exit 与 Organizational Survival</p>
        <h2>盈利机会与资本募集让新策略进入，亏损、赎回、监管或运营成本让旧组织退出；数据库若只保留存续者，会重写生态史。</h2>
        <p>
          Entry 可以是新基金、新 desk、新算法或现有机构增加授权；exit 可以是清算、并购、策略停用或数据停止报告。进入者往往追随近期高收益，退出者的最后阶段又最容易缺失，造成 survivor bias 和 backfill bias。组织退出还可能来自治理、人才或合规，而非规则预测错误。<Cite n={52} /><Cite n={53} /><Cite n={56} /><Cite n={60} />
        </p>
        <p>
          研究必须保存 entity lineage、launchAt、firstObservedAt、liquidationAt、lastObservedAt 与原因；将“未再报告”直接填成零仓位，会把测量缺失当作退出。<Cite n={47} /><Cite n={48} /><Cite n={111} />
        </p>
      </section>

      <section className="lesson-section" id="capacity-crowding-loop">
        <p className="section-kicker">46 · Capacity 与 Crowding 的内生循环</p>
        <h2>成功吸引资本和模仿，扩大相同交易的规模与冲击，最终侵蚀 edge、降低退出容量并改变策略自身的收益分布。</h2>
        <p>
          好表现提高 AUM 与采用率；相似信号使持仓重叠，建仓抬高价格并压低未来预期收益；当触发器反转，所有人想在有限深度中退出，交易成本和相关性骤升。收益因此依赖“多少资本正在采用同一规则”，这正是生态密度依赖，而非固定 alpha。<Cite n={52} /><Cite n={54} /><Cite n={76} /><Cite n={78} />
        </p>
        <p>
          但 crowded position 只有结合共同触发、必须交易和低承接能力才变成 crowded unwind。对手策略、新发行、做市资本或更慢资金可以扩容；持仓重叠本身仍不是危机。<Cite n={67} /><Cite n={77} /><Cite n={78} /><Cite n={89} />
        </p>
      </section>

      <section className="lesson-section" id="endogenous-regime">
        <p className="section-kicker">47 · Endogenous Regime</p>
        <h2>Regime 不只是事后给收益序列贴标签；它可以是财富、规则份额、约束和承接能力逐步变化后，主导反馈符号发生转换的构成状态。</h2>
        <p>
          在 fundamentalist 资本充足、dealer 有库存空间时，偏离触发逆向需求；随着趋势规则获利、资金流入、波动估计改变、套利资本受损，边际需求弹性下降，系统可从均值回归转为趋势放大。Day–Huang、Brock–Hommes、Lux–Marchesi 与人工市场展示这种“权重变化—动力变化”的生成可能。<Cite n={22} /><Cite n={28} /><Cite n={33} /><Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} />
        </p>
        <p>
          但现实 regime 也可由政策、增长、通胀或制度的外生变化造成。匹配厚尾、波动簇或 attractor 不能选择唯一机制；ABM 的模拟矩、Bayesian 和结构验证方法各有参数等价与摘要统计边界。<Cite n={45} /><Cite n={47} /><Cite n={48} /><Cite n={105} /><Cite n={106} /><Cite n={107} /><Cite n={108} /><Cite n={109} /><Cite n={110} /><Cite n={111} />
        </p>
      </section>

      <section className="lesson-section" id="event-reconstruction-protocol">
        <p className="section-kicker">48 · 八格事件重建协议</p>
        <h2>将“市场发生了内生放大”改写成八个可审计格子，逐格标注直接事实、推断、模型生成与缺失证据。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="八格事件重建协议，可横向滚动">
          <table className="concept-table">
            <caption>时序正确只是必要条件；每格还需对象、单位、来源与反事实</caption>
            <thead><tr><th scope="col">格</th><th scope="col">问题</th><th scope="col">最小证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">1 Initial state</th><td>谁在冲击前脆弱或有承接能力？</td><td>持仓、资本、buffer、流动性与时点</td></tr>
              <tr><th scope="row">2 Trigger</th><td>哪一外部变化先进入系统？</td><td>公告/价格/规则的 eventAt 与 publicAt</td></tr>
              <tr><th scope="row">3 First affected</th><td>谁首先出现损失、现金需求或信号？</td><td>异质暴露与准确时间顺序</td></tr>
              <tr><th scope="row">4 Rule / constraint</th><td>为何目标必须改变？</td><td>合约、margin、risk rule、授权</td></tr>
              <tr><th scope="row">5 Target / order</th><td>想做什么、实际提交什么？</td><td>目标与订单分层</td></tr>
              <tr><th scope="row">6 Fill / counterparty</th><td>谁成交、谁承接？</td><td>数量、价格、venue、dealer 状态</td></tr>
              <tr><th scope="row">7 Outcome</th><td>价格、深度和波动如何变化？</td><td>同步市场数据与 estimand</td></tr>
              <tr><th scope="row">8 Feedback / break</th><td>结果更新了什么，谁断开循环？</td><td>新 margin/flow/wealth 与干预</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一份事件报告可以完整描述 chronology，却未必给出随机因果；一篇模型可以生成相似路径，却未必对应事件主体。合格结论必须把两者连接而不混为一层。<Cite n={48} /><Cite n={113} /><Cite n={115} /><Cite n={119} /><Cite n={122} />
        </p>
      </section>

      <section className="lesson-section" id="flash-crash-case">
        <p className="section-kicker">49 · 2010 Flash Crash</p>
        <h2>这不是“一笔大单直接打崩市场”的单跳故事，而是卖出程序、跨市场执行、快速转手、库存与流动性供给相互作用的动态事件。</h2>
        <p>
          CFTC–SEC staff 报告从 E-mini 大型卖出程序进入市场开始，记录算法按成交量比例执行、high-frequency traders 等迅速承接又转售、风险在市场内高速循环，随后流动性提供下降、价格在期货与股票/ETF 间剧烈移动并恢复。关键不是给每类参与者贴善恶标签，而是区分初始卖方、短暂中介、最终风险承接者和订单簿状态。<Cite n={113} />
        </p>
        <p>
          交易者分类研究进一步刻画 HFT 同时供给和消耗流动性的行为，但样本是 E-mini 单事件，不能推出“HFT 通常导致崩盘”。本案例只把 2.08 的微观结构接入本节递归，不把单一大型程序外推为所有闪崩原因。<Cite n={114} />
        </p>
      </section>

      <section className="lesson-section" id="treasury-2020-case">
        <p className="section-kicker">50 · March 2020 U.S. Treasury</p>
        <h2>安全资产也会在全球现金需求、基金流、杠杆调整与 dealer 容量同时受压时失去流动性；但不同市场细分的主体贡献不能被一条 basis-trade 叙事抹平。</h2>
        <p>
          疫情冲击引发广泛风险重估与 dash for cash。官方材料记录外国机构、共同基金、mortgage REIT、leveraged funds、PTF 和 dealer 的差异行为；销售与保证金需求遇到中介容量限制，Treasury 与 MBS 流动性显著恶化，Federal Reserve 大规模购买等措施改变了承接状态。<Cite n={115} /><Cite n={117} /><Cite n={128} /><Cite n={129} />
        </p>
        <p>
          早期 BIS 材料提出 Treasury basis leverage 和 margin spiral 候选机制；后续保密类别数据则显示，在十年期 Treasury futures 这一细分市场，PTF 仍是主要流动性供应者，且未发现 basis traders 是重要 disruption driver。反证只限制该市场和 estimand，不能否定现金券或跨市场渠道；同样，早期机制候选也不能被升级为全事件单因裁决。<Cite n={116} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="ldi-2022-case">
        <p className="section-kicker">51 · 2022 UK LDI</p>
        <h2>财政消息与收益率重定价是外部触发，collateral call—资产销售—gilt yield—新 collateral demand 才是内生放大；央行介入改变承接并断开循环。</h2>
        <p>
          Bank of England 报告显示，2022 年 9 月长期 gilt 收益率迅速上升，杠杆 LDI 基金面临大额 margin/collateral calls，需要从 sponsor 筹资或出售资产；急迫 gilt 销售进一步推高收益率，引发更多 collateral 需求。BoE 的临时购买计划以恢复市场功能为目标，给基金去杠杆时间，改变了第六至第八格。<Cite n={119} />
        </p>
        <p>
          交易级研究把事前 LDI 暴露与危机销售、流动性恶化和折价连接，并指出 pooled fund 的协调摩擦与 slow-moving capital；这些估计比宏观 chronology 更接近 price-pressure estimand，但仍依事件设计。利率上升还可能改善 defined-benefit scheme 的负债折现状态，所以短期流动性压力不能改写为所有养老金长期资不抵债。<Cite n={120} /><Cite n={121} />
        </p>
      </section>

      <section className="lesson-section" id="gme-2021-case">
        <p className="section-kicker">52 · 2021 GME</p>
        <h2>零售注意、买盘、极高 short interest、期权、清算保证金、券商限制和流动性共同演化，正说明为什么复杂事件最不适合单因归因。</h2>
        <p>
          SEC staff report 区分持续成交、short covering、期权活动、broker-dealer/clearing 资本需求和平台限制，并明确 Commission 未对 staff 分析表达法律裁决。报告发现 short covering 对某些阶段有贡献，却不足以单独解释持续高价；对 gamma 链条，staff 更具体地指出期权交易增长主要来自买 put，market makers 又是 call buyers 而非 writers，因此没有发现 2021 年 1 月 GME 存在 gamma squeeze 的证据。<Cite n={122} />
        </p>
        <p>
          数据字段同样会误导：short-sale volume 是期间成交流，不是 short interest 存量；call volume 不给 dealer 净 gamma；社交文本不等于实际账户订单。可接受结论应按时段和市场分解机制，并允许不同 feedback 在不同阶段主导。<Cite n={122} /><Cite n={126} />
        </p>
      </section>

      <section className="lesson-section" id="dynamic-data-map">
        <p className="section-kicker">53 · Dynamic State Data Map</p>
        <h2>验证反馈至少需要主体、状态、规则触发、目标/订单/成交和市场结果的时间对齐；公开数据通常只覆盖其中一个投影。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="动态状态数据地图，可横向滚动">
          <table className="concept-table">
            <caption>任何“未知”都不能自动填为 0、无约束或无交易</caption>
            <thead><tr><th scope="col">数据</th><th scope="col">可观察</th><th scope="col">不可直接观察</th></tr></thead>
            <tbody>
              <tr><th scope="row">Form N-PORT</th><td>部分注册基金月度持仓、风险与结构字段</td><td>当日仓位、完整主体、下单动机</td></tr>
              <tr><th scope="row">CFTC COT</th><td>报告交易者类别的周度持仓快照</td><td>个体身份、逐笔动机、未报告头寸</td></tr>
              <tr><th scope="row">SEC public MIDAS metrics</th><td>按证券或交易所聚合的 trade-to-order、cancel-to-trade、odd-lot、hidden-rate 与 quote-life 等市场结构指标</td><td>逐条订单生命周期、最终受益人、财富、信念与完整跨 venue 路径</td></tr>
              <tr><th scope="row">Nasdaq TotalView-ITCH</th><td>经许可取得的 Nasdaq 单一 venue、message-level add/cancel/execute 与全深度订单簿重放</td><td>通常不含 ultimate beneficiary；少数 attributable message 的 MPID 也只是市场参与者代码，不等于经济行为主体</td></tr>
              <tr><th scope="row">FINRA short-sale volume</th><td>部分 off-exchange 日短售成交流</td><td>short-interest 存量和完整市场 short</td></tr>
              <tr><th scope="row">Survey + account</th><td>报告信念与匹配组合/交易</td><td>全部注意与实时决策过程</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          所有观测都应保存 market、population、coverage、unit、frequency、eventAt、publicAt、observedAt 与 revisionVintage。FI-2010 可复现十日 LOB 基准，适合测试中价模型，却不能验证长期财富选择；SEC 的公开 MIDAS 下载是聚合指标，而 TotalView-ITCH 才是商业许可下的 Nasdaq message-level feed。后者可重放单一 venue 的微观路径，却通常不能恢复 ultimate beneficiary；即便 attributable order 带 MPID，也不能把参与者代码直接当成最终经济主体。<Cite n={92} /><Cite n={112} /><Cite n={123} /><Cite n={124} /><Cite n={125} /><Cite n={126} /><Cite n={127} />
        </p>
      </section>

      <section className="lesson-section" id="identification-ladder">
        <p className="section-kicker">54 · Identification Ladder</p>
        <h2>从“看见波动”到“识别反馈”至少跨六级：标签、时序、中间状态、条件预测、规则变化与可信反事实。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="反馈机制识别阶梯，可横向滚动">
          <table className="concept-table">
            <caption>阶梯不是方法排行榜；每一级识别的对象和假设不同</caption>
            <thead><tr><th scope="col">级别</th><th scope="col">新增证据</th><th scope="col">仍未解决</th></tr></thead>
            <tbody>
              <tr><th scope="row">L0 · Label</th><td>波动、同步、反转或厚尾</td><td>谁、为何、哪个方向</td></tr>
              <tr><th scope="row">L1 · Chronology</th><td>trigger → order → outcome 的先后</td><td>共同冲击与反向因果</td></tr>
              <tr><th scope="row">L2 · State</th><td>wealth、margin、flow、inventory、risk usage</td><td>状态是否真正驱动行动</td></tr>
              <tr><th scope="row">L3 · Conditional</th><td>效应集中于高暴露、低 buffer 或低深度</td><td>暴露选择与遗漏变量</td></tr>
              <tr><th scope="row">L4 · Rule variation</th><td>预定阈值、错位时钟、资格/制度边界</td><td>操纵、外溢与局部外推</td></tr>
              <tr><th scope="row">L5 · Counterfactual</th><td>干预、可信准实验或外部验证结构反事实</td><td>跨状态、跨市场与政策不变性</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          反馈系统尤其违反“主体互不影响”的无干扰直觉：处理一个主体的约束会经价格影响对照组。订单冲击、基金流、需求系统和交易级事件研究各识别不同 estimand，不能按一个等级合并。模型校准则必须另报参数等价、摘要统计、先验和样本外。<Cite n={47} /><Cite n={48} /><Cite n={80} /><Cite n={83} /><Cite n={89} /><Cite n={90} /><Cite n={105} /><Cite n={107} /><Cite n={108} />
        </p>
      </section>

      <section className="lesson-section" id="chain-break-falsification">
        <p className="section-kicker">55 · Chain-break Falsification</p>
        <h2>真正有信息量的机制必须允许被拒绝：为每条箭头写出必要中间状态、方向和时钟，并说明哪一缺失会使结论降级。</h2>
        <div className="claim-ladder">
          <article><span>01</span><h3>约束未绑定</h3><p>若高、低 buffer 主体反应相同，margin/VaR 机制失去关键条件预测。</p></article>
          <article><span>02</span><h3>没有目标变化</h3><p>价格变化后规则输出不变，则不能说该规则生成了下一轮订单。</p></article>
          <article><span>03</span><h3>没有真实成交</h3><p>目标或 margin call 未转成 fill，不能归因实际 price pressure。</p></article>
          <article><span>04</span><h3>承接未恶化</h3><p>深度与 dealer capacity 稳定，则相同流量乘数上升的叙事受损。</p></article>
          <article><span>05</span><h3>干预后未断链</h3><p>改变 collateral、时钟或承接后路径不变，应寻找其他机制。</p></article>
        </div>
        <p>
          “没有观测到”还可能只是数据覆盖不足，所以反证报告必须同时给 detection power、缺失机制和替代解释。ABM 若只复现厚尾却不能预测暴露异质、阈值反应或干预后的链条变化，也只是生成可能，不是被证真的机制。<Cite n={39} /><Cite n={40} /><Cite n={48} /><Cite n={97} /><Cite n={106} /><Cite n={109} /><Cite n={111} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">56 · Interactive Closed-loop Lab</p>
        <h2>十道题先核算状态与守恒，再判断固定点、信息时钟、非线性聚合和局部稳定，训练“完整闭环”而不是背反馈标签。</h2>
        <p>
          Mode A 从目标投影、执行容量、dealer/财富账、采用率与财富份额，走到一轮保证金反馈；Mode B 检查全市场成交守恒、战略互补、publicAt、代表主体失效和稳定性外推。每题提交前记录置信度，系统保留首次答案、首次置信度与提交次数；高置信但答错比低置信猜对更值得优先复盘。题目参数只为唯一答案冻结，不是实盘系数。<Cite n={25} /><Cite n={28} /><Cite n={68} /><Cite n={80} />
        </p>
        <EndogenousDynamicsLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">57 · 十道无脚本静态孪生</p>
        <h2>每道题与 Lab 同构但更换数字或边界；先在纸上写对象、单位和时序，再展开答案。</h2>
        <div className="practice-grid">
          {endogenousDynamicsScenarios.map((scenario, index) => (
            <details key={scenario.id}>
              <summary><span>{String(index + 1).padStart(2, '0')}</span>{scenario.staticTwin.title}</summary>
              <p>{scenario.staticTwin.prompt}</p>
              <div className="practice-answer"><b>自校验答案</b><p>{scenario.staticTwin.answer}</p></div>
              <p className="impact-source-links"><b>依据：</b>{' '}{scenario.staticSourceIds.map((id) => <Cite key={id} n={id} />)}</p>
            </details>
          ))}
        </div>
        <div className="precision-note"><span>练习纪律</span><p>算对数值后仍要回答：这是 target、order 还是 fill？是人数权重还是财富权重？输入在当时可知吗？结果只说明局部一轮还是完整 cascade？若四问中有一项答不出，计算尚未转化为机制理解。</p></div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">58 · Checks、Glossary 与 Evidence Passport</p>
        <h2>十四道检查确认你能重建闭环，十八个术语固定对象，Evidence Passport 则把每条因果主张变成可追踪、可反驳的证据单元。</h2>
        <div className="understanding-checks">
          <details><summary>01 · 系统内生性与计量内生性有什么不同？</summary><p>前者说变量由系统内部互动与递归共同生成；后者说经验解释变量与误差项相关，导致因果估计失真。模型内生不等于现实效应已识别。</p></details>
          <details><summary>02 · 构造“有异质性但没有内生动力”的反例。</summary><p>观点不同的主体各自提交永久固定、总和为零的订单，价格不响应、财富和权重也不更新。差异存在，却没有结果回写和递归。</p></details>
          <details><summary>03 · 构造“无异质性但有内生动力”的反例。</summary><p>所有杠杆账户规则完全相同；下跌触发保证金卖出，卖出再次压低价格并触发下一轮。异质性不是必要条件。</p></details>
          <details><summary>04 · State、parameter、shock 与 outcome 怎样区分？</summary><p>State 携带下一轮所需记忆；parameter 定义规则且在分析区间冻结或另有转移；shock 从模型外进入；outcome 由互动生成并可回写为新 state。</p></details>
          <details><summary>05 · 为什么 target、order、fill 和 position change 不能互换？</summary><p>目标先经约束成为可行差额，再经执行形成提交订单，只有与对手方成交才成为 fill；公司行动、到期等还可在没有交易时改变头寸。</p></details>
          <details><summary>06 · 写出一轮最小闭环。</summary><p>State → target → constraint projection → submitted order → fill/counterparty → price/liquidity → wealth/margin/belief/weight update → next target。</p></details>
          <details><summary>07 · 为什么每一期出清不保证动态稳定？</summary><p>出清只说明当期价格满足数量条件；跨期状态转移仍可能使对固定点的扰动扩大或振荡。</p></details>
          <details><summary>08 · Loop gain 的符号与绝对值各说明什么？</summary><p>符号表示偏离经闭环后是同向还是交替；绝对值在局部线性化下表示衰减或放大。它不是跨状态不变的危机常数。</p></details>
          <details><summary>09 · 负反馈为何也会振荡？</summary><p>若使用旧状态、执行滞后或修正太强，行动会在系统已越过目标后继续，造成 overshoot 和交替修正。</p></details>
          <details><summary>10 · 一种稳定主体怎样翻为正反馈？</summary><p>价值基金初期逆向买入；偏离扩大造成损失、赎回和 margin binding 后，被迫卖出，交易方向从负反馈翻为正反馈。</p></details>
          <details><summary>11 · Wealth selection、switching、learning 与 entry/exit 怎样区分？</summary><p>分别是既有规则因相对收益改变资本份额、主体改用另一规则、同一规则内部参数变化、组织出生或死亡。四者需要不同数据。</p></details>
          <details><summary>12 · 同步订单为何不能证明 herding 或 complementarity？</summary><p>共同新闻、共同数据窗口和共同约束也会造成同步；还需识别模仿或他人行动改变自身收益的 interaction。</p></details>
          <details><summary>13 · 识别反馈至少需要什么中间证据？</summary><p>正确时序、初始暴露/buffer、规则或约束变化、target/order/fill、承接状态、市场结果和结果回写；再用异质预测或外部变化限制共同冲击。</p></details>
          <details><summary>14 · 给 LDI 写一个断链反事实。</summary><p>若同样收益率冲击下基金有充足可交 collateral、sponsor 及时注资且不需卖 gilt，则 collateral–sale–yield 回路在订单前断开；价格仍可能因基本面重估变化。</p></details>
        </div>

        <div className="glossary-grid" aria-label="十八个核心术语">
          <article><b>Agent / Type</b><p>Agent 是有状态和行动规则的决策单元；type 是研究者对规则束的降维，不等同职业标签。</p></article>
          <article><b>State vector</b><p>足以生成下一步的一组记忆变量；不是所有历史原样堆积，也不是永久参数。</p></article>
          <article><b>Parameter</b><p>定义规则形状的量；若随历史学习，它必须升格为状态并写转移式。</p></article>
          <article><b>Exogenous shock</b><p>在模型边界外给定的输入；现实中“外生”仍需经验识别。</p></article>
          <article><b>Endogenous variable</b><p>由系统内部方程和互动共同求得的量；不意味着其因果效应已识别。</p></article>
          <article><b>Endogenous dynamics</b><p>系统结果回写状态并再次改变行动所形成的递归路径；不是“复杂”的同义词。</p></article>
          <article><b>Transition law</b><p>从当前状态、行动和冲击到下一状态的映射；必须固定时序和单位。</p></article>
          <article><b>Decision rule</b><p>把信息与状态映射为目标行动的规则；不等于实际成交。</p></article>
          <article><b>Constraint projection</b><p>把无约束目标映射到可行域；clip、margin 和 mandate 会制造非线性。</p></article>
          <article><b>Market interaction</b><p>个体订单经清算、深度、库存与信息形成共同结果的算子。</p></article>
          <article><b>Feedback loop</b><p>结果沿可说明的状态更新重新影响原因；相关往返箭头不是自动反馈。</p></article>
          <article><b>Fixed point</b><p>转移后保持不变的状态；存在不等于可达或稳定。</p></article>
          <article><b>Local stability</b><p>固定点附近小扰动是否衰减；不能外推全局、阈值外或带噪尾部。</p></article>
          <article><b>Loop gain</b><p>一维局部状态映射在固定点的导数 G=F′(e*)；仅在无直接项、无并行路径的单串联可微链中，才等于各段导数乘积。符号和绝对值分别描述方向与局部放大。</p></article>
          <article><b>Delay / Path dependence</b><p>过去状态因决策、执行或结算滞后继续影响现在；同一冲击因路径不同可到不同状态。</p></article>
          <article><b>Nonlinearity / Threshold</b><p>响应不再按比例变化，或跨点后规则切换；事后断点不自动识别约束。</p></article>
          <article><b>Strategic complementarity</b><p>他人更强行动提高自身同向行动收益；不同于只接收相同信息。</p></article>
          <article><b>Composition dynamics</b><p>财富选择、流量、规则切换、学习与进入退出共同改变有效主体权重。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="反馈因果主张的 Evidence Passport，可横向滚动">
          <table className="concept-table">
            <caption>每条机制主张至少保存的字段；LDI 是推荐的第一份完整练习</caption>
            <tbody>
              <tr><th scope="row">Claim</th><td>claimId、方向明确的机制句、object / market / population</td></tr>
              <tr><th scope="row">Agent state</th><td>identity/rule、initial wealth/position/buffer、外部 trigger、required threshold</td></tr>
              <tr><th scope="row">Action</th><td>target、submitted order、fill、counterparty 与缺失腿</td></tr>
              <tr><th scope="row">Outcome / feedback</th><td>价格/深度/波动结果、更新后的 margin/wealth/belief/weight、下一轮预测</td></tr>
              <tr><th scope="row">Clocks / measure</th><td>event、decision、trade、settlement、public、observed、单位、频率、分母、vintage</td></tr>
              <tr><th scope="row">Inference</th><td>estimand、counterfactual、design、assumptions、alternatives、chain-break、coverage</td></tr>
              <tr><th scope="row">Evidence status</th><td>direct / inferred / model-generated / illustrative，附 DOI 或官方 URL</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Passport 的作用不是把叙事填成表格，而是强迫每条箭头暴露证据层级。模型论文、实验、账户数据、匿名订单簿与官方事件报告回答不同问题，不能用引用数量掩盖缺失的中间状态。<Cite n={47} /><Cite n={48} /><Cite n={92} /><Cite n={100} /><Cite n={112} /><Cite n={113} /><Cite n={119} /><Cite n={122} />
        </p>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">59 · Chapter 2 闭环、后续接口与 20 组阅读</p>
        <h2>Chapter 2 到此给出“谁—状态—目标—约束—订单—成交—结果—更新”的完整主体层；Chapter 3 接入宏观状态，Chapter 7 才构造和验证完整复杂系统。</h2>
        <div className="interface-grid">
          <article><span>回到 1.08–1.09</span><h3>Order Flow / Impact</h3><p>2.21 输出带身份、状态和时钟的订单；Chapter 1 提供它进入价格、深度和成交的微观算子。</p></article>
          <article><span>闭合 2.01–2.20</span><h3>Agent Layer</h3><p>每类主体不再是静态目录，而成为共享状态机中不同规则、约束、时钟和更新方程。</p></article>
          <article><span>连接 Chapter 3</span><h3>Macro State</h3><p>增长、通胀、央行、信用和金融条件作为外部/共同状态，先改变不同主体，再经本节闭环反馈。</p></article>
          <article><span>连接 Chapter 4</span><h3>Cross-market Transmission</h3><p>财富、融资、抵押品和共同资本怎样把一个市场结果写入另一个市场主体状态。</p></article>
          <article><span>连接 6.20–6.22</span><h3>Learning / Expectations</h3><p>信念、叙事与策略学习怎样改变规则内部参数和主体构成。</p></article>
          <article><span>连接 7.01–7.20</span><h3>Complex Adaptive System / ABM</h3><p>正式展开涌现、反馈、阈值、网络、agent 粒度、模拟和复杂系统方法。</p></article>
          <article><span>连接 7.24–7.27</span><h3>Measurement / Validation</h3><p>将 Evidence Passport 压缩为可观察、可证伪、无泄漏、样本外的局部研究。</p></article>
        </div>
        <div className="precision-note"><span>Chapter 7 边界</span><p>本节只定义闭环语言并演示极简局部动力，不展开 agent 粒度、初始化、warm-up、网络拓扑、参数校准、间接推断、Bayesian estimation、ensemble/random seed、敏感性、不确定性、政策反事实、Lucas critique 或多智能体强化学习。能运行的人工市场还必须被数据约束、验证并允许失败。<Cite n={46} /><Cite n={48} /><Cite n={49} /><Cite n={105} /><Cite n={106} /><Cite n={107} /><Cite n={108} /><Cite n={109} /><Cite n={110} /><Cite n={111} /></p></div>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="四层二十组精选阅读路径，可横向滚动">
          <table className="concept-table">
            <caption>页面下方列出 20 个 A→B 阅读单元；括号延伸在正文 reference ledger 中继续</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">五组主题</th><th scope="col">完成标准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Core</th><td>聚合；信息；分歧；理论价格冲击；订单流与流动性冲击</td><td>能说清状态、单位、市场交互和代表主体边界</td></tr>
              <tr><th scope="row">Models</th><td>噪声生存；Brock–Hommes；招募群聚；人工市场；战略互补</td><td>为每个模型写出状态、转移、预测和不可识别处</td></tr>
              <tr><th scope="row">Evidence</th><td>实验反馈；订单簿；基金流；需求系统；共振正反证</td><td>区分模型拟合、实验处理、代理、准实验和结构 estimand</td></tr>
              <tr><th scope="row">Systems</th><td>生态；财富选择；融资螺旋；四事件；ABM 验证</td><td>能重建闭环、指出断链并划清 Chapter 7 方法边界</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          阅读时不要追求“一篇论文证明整个市场”。精确聚合条件与 Kirman 的批评应成对读；noise-trader 生存要与财富选择边界成对读；指数共振的初始证据要与后续稳健性反证成对读；Flash Crash、March 2020、LDI 和 GME 只支持各自事件中的阶段机制，不验证某个统一 ABM。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={6} /><Cite n={8} /><Cite n={9} /><Cite n={10} /><Cite n={15} /><Cite n={16} /><Cite n={20} /><Cite n={35} /><Cite n={36} /><Cite n={42} /><Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={54} /><Cite n={91} /><Cite n={93} /><Cite n={94} /><Cite n={95} /><Cite n={96} /><Cite n={113} /><Cite n={115} /><Cite n={119} /><Cite n={122} /></p>
        <p>
          最小复述应是：<b>外部信息与共同市场状态先进入不同主体的信念、财富、负债、风险与授权；主体由此形成目标，目标必须经过约束、执行和对手方才成为真实成交。成交与报价共同形成价格、波动和流动性，结果再更新财富、保证金、风险估计、信念、委托资金、规则采用率与进入退出，使下一轮聚合需求函数本身发生变化。稳定或失稳不由“主体异质”四个字决定，而由反馈符号、总增益、延迟、阈值和承接能力决定；同步、厚尾或事件叙事都不是机制指纹，只有中间状态、正确时钟、异质预测、可信反事实和断链检验，才能把可能机制提升为有边界的解释。</b>
        </p>
      </section>
    </>
  );
}

export const lesson221: LessonRecord = {
  slug: '2-21',
  id: '2.21',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Heterogeneous Agents → Endogenous Dynamics：从异质规则、市场交互到财富选择与内生状态转换',
  subtitle: '把 Chapter 2 中分散的主体、约束与交易机制闭合成同一递归系统，解释价格怎样改变财富、风险、融资、信念与策略构成',
  readingTime: '核心首读约 85–90 分钟；完整正文含逐式复算约 190–235 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习 25–35，理解检查与术语 22–30，建议分三次完成；参考文献与延伸阅读不计',
  prerequisite: '2.01；建议回看 T01、T03、T05–T08、1.08–1.09、1.20、2.07–2.20；动力系统与研究识别按需调用基础代数及 T05',
  updatedAt: '2026-08-31',
  revision: '2.21-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.21-r3',
      summary:
        '独立复核 60 个机制单元、131 条来源及全部引用落点，逐式检查主体／研究信息集、目标投影、成交与证券守恒、财富和杠杆账、局部 gain／Jacobian、Gamma 对冲符号、四个事件案例、数据层级与识别边界，并复算 10 道互动题和 10 道静态孪生；冻结哈希、来源身份、类型、规范、生产构建、HTTP 与结构不变量全部通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.21-r3',
      summary:
        '独立复核零背景入口、六阶段路线、状态—目标—约束—订单—成交—结果—更新因果链、公式对象与单位、反例、Evidence Passport、14 道检查、18 个术语、四层各五组阅读及多来源链接，并验证作答历史组合、损坏恢复、键盘／ARIA、无脚本、移动端和打印边界；冻结哈希与全部运行检查一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-20', label: '2.20 Corporate Buyback / Issuance Flow' },
  next: { slug: '3-01', label: '3.01 Real Growth' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、先修与路线' },
    { id: 'two-endogeneity-meanings', label: 'Two Endogeneity Meanings' },
    { id: 'closure-tests', label: 'Closure Tests' },
    { id: 'agent-rule-bundle', label: 'Agent as Rule Bundle' },
    { id: 'dynamic-state-vector', label: 'Dynamic State Vector' },
    { id: 'stock-flow-shock-outcome', label: 'Stock / Flow / Shock' },
    { id: 'clocks-information-set', label: 'Clocks / Information Set' },
    { id: 'market-interaction-operator', label: 'Market Interaction' },
    { id: 'exogenous-endogenous-decomposition', label: 'Trigger / Propagation' },
    { id: 'state-dependent-target', label: 'State-dependent Target' },
    { id: 'constraint-projection', label: 'Constraint Projection' },
    { id: 'target-to-order-path', label: 'Target → Order Path' },
    { id: 'fill-residual-state', label: 'Fill / Residual' },
    { id: 'market-outcome-update', label: 'Market Outcome' },
    { id: 'wealth-pnl-update', label: 'Wealth / P&L' },
    { id: 'position-inventory-update', label: 'Position / Inventory' },
    { id: 'funding-collateral-update', label: 'Funding / Collateral' },
    { id: 'risk-estimator-update', label: 'Risk Estimator' },
    { id: 'belief-update', label: 'Belief Update' },
    { id: 'fitness-update', label: 'Fitness Update' },
    { id: 'delegated-capital-flow-update', label: 'Delegated Flow' },
    { id: 'composition-four-legs', label: 'Composition Four Legs' },
    { id: 'recursive-state-machine', label: 'Recursive State Machine' },
    { id: 'fixed-point-stability', label: 'Fixed Point / Stability' },
    { id: 'scalar-loop-gain', label: 'Local Loop Gain' },
    { id: 'coupled-local-stability', label: 'Coupled Stability' },
    { id: 'delay-overshoot', label: 'Delay / Overshoot' },
    { id: 'threshold-nonlinearity', label: 'Threshold / Nonlinearity' },
    { id: 'fundamentalist-feedback', label: 'Fundamentalist Feedback' },
    { id: 'trend-feedback', label: 'Trend Feedback' },
    { id: 'arbitrage-sign-switch', label: 'Arbitrage Sign Switch' },
    { id: 'market-maker-sign-switch', label: 'Market-maker Switch' },
    { id: 'risk-control-feedback', label: 'Risk-control Feedback' },
    { id: 'gamma-feedback', label: 'Gamma Feedback' },
    { id: 'funding-market-liquidity-loop', label: 'Funding / Liquidity Loop' },
    { id: 'forced-flow-cascade', label: 'Forced-flow Cascade' },
    { id: 'rule-synchronization', label: 'Rule Synchronization' },
    { id: 'endogenous-risk-bearing-capacity', label: 'Risk-bearing Capacity' },
    { id: 'strategic-complementarity', label: 'Strategic Complementarity' },
    { id: 'reflection-problem', label: 'Common Shock / Reflection' },
    { id: 'heterogeneity-double-sign', label: 'Heterogeneity Double Sign' },
    { id: 'wealth-selection', label: 'Wealth Selection' },
    { id: 'strategy-switching', label: 'Strategy Switching' },
    { id: 'within-rule-learning', label: 'Within-rule Learning' },
    { id: 'entry-exit-survival', label: 'Entry / Exit' },
    { id: 'capacity-crowding-loop', label: 'Capacity / Crowding' },
    { id: 'endogenous-regime', label: 'Endogenous Regime' },
    { id: 'event-reconstruction-protocol', label: 'Event Protocol' },
    { id: 'flash-crash-case', label: '2010 Flash Crash' },
    { id: 'treasury-2020-case', label: 'March 2020 Treasury' },
    { id: 'ldi-2022-case', label: '2022 UK LDI' },
    { id: 'gme-2021-case', label: '2021 GME' },
    { id: 'dynamic-data-map', label: 'Dynamic Data Map' },
    { id: 'identification-ladder', label: 'Identification Ladder' },
    { id: 'chain-break-falsification', label: 'Chain-break Falsification' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'active-practice', label: 'Static Practice' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson221Content,
  references: lesson221References,
  readingList: lesson221ReadingList,
};
