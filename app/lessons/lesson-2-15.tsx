import ArbitrageCapitalLab from '../components/ArbitrageCapitalLab';
import { arbitrageCapitalScenarios } from '../components/arbitrageCapitalScenarios';
import { lesson215ReadingList, lesson215References } from './lesson-2-15-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson215Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Limits to arbitrage 的本质不是“套利者没有看见错价”，而是收敛收益在未来、资本约束在今天：同一价差扩大既提高潜在收益，也会通过账面亏损、haircut、借券、赎回和共同退出削弱最专业资本的持有能力。</h2>
        <p>
          价格偏离价值并不会自动召唤一支无限资产负债表。现实中的专业套利者持有有风险、需要融资、常用他人资金且必须按市价报告的仓位；当错价先向不利方向扩大，终点 thesis 可能更有吸引力，actual account 却同时失去 equity、collateral 和投资者耐心。于是“机会更大”与“需求更弱”可以在同一状态出现，套利资本从价格收敛的负反馈切换为被迫减仓的正反馈。<Cite n={1} /><Cite n={2} /><Cite n={21} />
        </p>
        <p>
          本节把最小分析单位固定为一份 <b>arbitrage-capital survival ledger</b>：先证明 claims 是否等价，把 raw price gap 改写成可执行、扣 carry 的 basis；再冻结 anchor、catalyst、终点与四个时钟，记录 actual positions、path P&amp;L、NAV、margin、borrow、flow 和 liquidity；最后才判断资金是在增持、减持还是根本没有成交，以及这些 fills 怎样使 gap 收敛、过冲或继续扩大。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与相邻章节边界</p>
        <h2>硬先修是 1.19；建议回看 1.09、1.20、1.21、2.07 与 2.09，概率式读不顺时按需调用 T04。本节不再发明信号，也不完整教授 VaR、赎回、benchmark 或 crowding，而是研究已有 convergence position 能否得到资本并活到收敛。</h2>
        <div className="learning-objectives">
          <span>导论＋六阶段学习路线 · 从“看见价差”到资本反馈</span>
          <ol>
            <li><b>对象边界（00–09）：</b>区分纯套利、convergence trade、候选错价、contract anchor、资本主体与四个时钟。</li>
            <li><b>风险与带宽（10–22）：</b>逐一放入 fundamental、noise、同步、模型、实施、借券、跳跃、深度与路径风险。</li>
            <li><b>资本账本（23–34）：</b>由 NAV、gross/net、haircut、funding、delegated flow 进入目标需求、capacity 和两类资产负债表。</li>
            <li><b>反馈符号（35–46）：</b>把正常收敛、wealth effect、margin、redemption、crowding、forced liquidation 和异质资本放入同一动态系统。</li>
            <li><b>证据与研究（47–51）：</b>用 carve-out、Treasury basis、GameStop 与跨市场证据约束单因果叙事，形成可证伪协议。</li>
            <li><b>迁移与接口（52–55）：</b>完成 10+10 道题、12 道理解检查、术语复述和后续课程交付。</li>
          </ol>
        </div>
        <p>
          2.09 已经完成 signal → target → order → fill；本节只接受 actual position 与 actual fill。2.16 将建立 VaR／ES 与 breach governance，2.17–2.19 分别展开 redemption、benchmark 和 crowded positioning；这里把它们作为外生约束输入，避免一个小节吞掉整个机构资产管理课程。
        </p>
      </section>

      <section className="lesson-section" id="state-chain">
        <p className="section-kicker">02 · 完整状态转移链</p>
        <h2>“错价存在”只描述起点；真正的因果对象是 gap 怎样进入目标风险承担、真实成交、路径损益、资本状态和下一轮订单。</h2>
        <div className="causal-chain" aria-label="套利资本从价差到反馈的完整链条">
          <div><span>01</span><b>Executable gap</b><p>合同调整、bid/ask、carry 后的 x_t。</p></div>
          <i>→</i><div><span>02</span><b>Expected payoff</b><p>收敛分布、catalyst 与失败状态。</p></div>
          <i>→</i><div><span>03</span><b>Target risk</b><p>风险偏好与多项 capacity 上限。</p></div>
          <i>→</i><div><span>04</span><b>Actual fill</b><p>两腿订单、部分成交与 leg risk。</p></div>
          <i>→</i><div><span>05</span><b>Path P&amp;L</b><p>gap、carry、borrow、funding 和 impact。</p></div>
          <i>→</i><div><span>06</span><b>Capital state</b><p>NAV、margin、flow、free collateral。</p></div>
          <i>→</i><div><span>07</span><b>Next orders</b><p>增持、等待、减持或被迫退出。</p></div>
          <i>→</i><div><span>08</span><b>Feedback</b><p>收敛、过冲、持久或发散。</p></div>
        </div>
        <p>
          这条链强制分开 <b>belief、target、actual、order、fill 和 price impact</b>。经理认为 gap 扩大是更好机会，不代表 risk committee 批准加仓；批准 target 不代表 prime broker 提供融资；候选订单不代表成交；成交也不保证价格按线性模型变化。任何缺失节点都不能用一句“套利资本进场”代替。
        </p>
      </section>

      <section className="lesson-section" id="textbook-arbitrage">
        <p className="section-kicker">03 · Textbook Arbitrage 的严格定义</p>
        <h2>纯套利不是“胜率很高”，而是一份自融资或带正初始流入、未来各状态不亏且至少一处严格获利的可实施组合。</h2>
        <div className="equation-card">
          <span>有限期基础定义</span>
          <div>V<sub>0</sub> ≤ 0；　V<sub>T</sub> ≥ 0 almost surely；　P(V<sub>T</sub>&gt;0)&gt;0</div>
          <p>V 是从“需要投入的净成本”视角记账：V₀≤0 表示不需要正的自有净投入，终值在所有允许状态不为负并有正概率严格为正。连续时间还需 admissibility 等条件；本节只用有限期直觉。</p>
        </div>
        <p>
          Market neutral、relative value、high Sharpe、positive expected return 这些标签或性质本身，都不足以推出上述严格套利定义；某个组合可以同时拥有其中一项并且是严格套利，但必须另行证明逐状态 payoff 与可实施条件。现实研究和行业把 merger arbitrage、convertible arbitrage、basis trade 也称“arbitrage”，通常只是因为两腿有经济连接与收敛 anchor；它们仍承受断链、路径、融资与执行风险。Shleifer–Vishny 正是从这种 textbook／real-world 区分出发。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="convergence-trade">
        <p className="section-kicker">04 · Convergence Trade：行业套利的真实对象</p>
        <h2>Convergence trade 做多 cheap、做空 rich，收益来自标准化 gap 收窄；若 anchor 改变、gap 先扩大或资本时钟先到，它就不是无风险套利。</h2>
        <div className="equation-card">
          <span>本节统一的 gap 与方向</span>
          <div>x<sub>t</sub> = Price<sub>rich,t</sub> − βPrice<sub>cheap,t</sub> − Adjustments<sub>t</sub>；　Π<sup>gross</sup><sub>t,T</sub>=q<sub>t</sub>(x<sub>t</sub>−x<sub>T</sub>)</div>
          <p>进入损益式的 x 统一换算为“货币/标准化套利包”，q 的单位是包；若交易屏以 bp 报价，先用该包的 ν（货币／包／bp）换算为 x=νb。q&gt;0 始终表示 short rich、long cheap；gap 收窄产生正收益，扩大产生负收益。β、adjustments 与 ν 必须在 t− 冻结，不能事后改到盈利。</p>
        </div>
        <p>
          这个符号统一了 negative stub、closed-end fund discount、dual-listed share、merger spread 和 cash–futures basis，却不声称它们有相同风险。Liu–Longstaff 表明，即使 terminal convergence 很强，margin 约束也能显著限制最优套利仓位；所以“终点确定”仍不推出“路径可承受”。<Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="mispricing-latent">
        <p className="section-kicker">05 · Mispricing 是潜变量，不是屏幕字段</p>
        <h2>理论上的 price−fundamental value 不可直接观察；研究者实际看到的是相对某个合同、NAV、复制组合或模型的 residual，因此“错价”总带联合假设。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="错价观测强度表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>观测对象</th><th>Anchor 强度</th><th>主要剩余误差</th><th>合适语言</th></tr></thead>
            <tbody>
              <tr><td>同一确定索赔跨场所</td><td>强</td><td>同步、成本、交收</td><td>Executable arbitrage gap</td></tr>
              <tr><td>换股／分拆／交割关系</td><td>较强</td><td>deal break、optionality</td><td>Contract-anchored basis</td></tr>
              <tr><td>Closed-end fund / NAV</td><td>中等</td><td>费用、税、控制、流动性</td><td>Discount / premium</td></tr>
              <tr><td>Factor / valuation residual</td><td>弱</td><td>模型、风险溢价、制度变化</td><td>Model-relative residual</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Carve-out 与 closed-end fund 研究提供比单纯估值倍数更强的约束，却仍需要 shortability、费用与关系存续假设。越弱的 anchor，越应把结果写成“候选错价或预期收益信号”，不能把模型 residual 重新命名为已知 fundamental error。<Cite n={10} /><Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="anchor-catalyst">
        <p className="section-kicker">06 · Anchor 与 Catalyst 决定终点强度</p>
        <h2>Anchor 回答“为什么两条价格最终应靠拢”，catalyst 回答“什么事件、在哪个时钟迫使关系兑现”；二者缺一，均值回复只是历史描述。</h2>
        <p>
          同一现金流的交割、强制换股、到期清算、creation／redemption 和 tender offer 能提供不同强度的合同锚；盈利均值、估值分位或 pair correlation 只是统计锚。Catalyst 也可能失败：deal break、合约调整、交易暂停、监管变化或 fund liquidation 会在收敛前切断关系。Equity carve-out 的历史证据说明，即使结构关系看似清晰，也有相当部分交易在 gap 修复前改变或终止。<Cite n={10} /><Cite n={11} />
        </p>
        <div className="precision-note">
          <span>时间护栏</span>
          <p>“最终会收敛”必须写成一个可审计 distribution：最早/最晚时点、成功概率、break 状态、cash flow、margin path 和退出价格。没有期限的价值判断不能与有到期日的资金负债直接比较。</p>
        </div>
      </section>

      <section className="lesson-section" id="agent-objective">
        <p className="section-kicker">07 · Arbitrage-capital Agent 的目标函数</p>
        <h2>套利者没有“让市场有效”的义务；它要在生存、授权和资金负债约束内最大化风险调整后的财富，因此可以理性地放弃社会上有益的纠偏交易。</h2>
        <div className="equation-card">
          <span>从期望收益到生存效用</span>
          <div>max<sub>q</sub>　E[W<sub>T</sub>] − (γ/2)Var(W<sub>T</sub>) − Penalty<sub>liquidation</sub>　subject to funding, borrow, mandate</div>
          <p>W 与 penalty 都以货币计量，γ 的单位是 1/货币，因而三项可相加；liquidation penalty 把“中途出局”与普通终点方差分开。真实机构还会考虑 drawdown、career、client concentration 和 option-like fees，本式只是透明骨架。</p>
        </div>
        <p>
          专业知识与资本常分离：经理理解局部市场，外部投资者只看到带噪的短期收益；资本提供者可以在经理认为机会更好时撤资。受约束套利模型因此不是假设套利者愚蠢，而是把 agency 和资本稀缺正式纳入价格形成。<Cite n={1} /><Cite n={17} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="capital-state">
        <p className="section-kicker">08 · Capital State 不是一个 AUM 数字</p>
        <h2>AUM、净清算权益、自由现金、eligible collateral、gross exposure、借券可得量和 dry powder 处在不同账本；把它们都写成“资本”会产生数量级错误。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="套利资本状态变量表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>State</th><th>最小定义</th><th>决定什么</th><th>不可替代</th></tr></thead>
            <tbody>
              <tr><td>AUM</td><td>基金管理资产</td><td>费基与总规模</td><td>自由 collateral</td></tr>
              <tr><td>Equity / NAV</td><td>资产减负债</td><td>损失承受与赎回基数</td><td>现金余额</td></tr>
              <tr><td>Free collateral</td><td>未质押且合格的资源</td><td>新增 margin capacity</td><td>全部 NAV</td></tr>
              <tr><td>Gross exposure</td><td>绝对多空敞口之和</td><td>融资、流动性与 leverage</td><td>净方向</td></tr>
              <tr><td>Borrow capacity</td><td>可借数量与合同条件</td><td>short leg 上限</td><td>现金购买力</td></tr>
              <tr><td>Dry powder</td><td>为未来状态保留的可部署资本</td><td>adverse deepening 后的增持能力</td><td>期初未投资现金的全部</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中介资产定价研究强调风险承受能力是状态变量，但任何宏观 leverage proxy 都不是某个 fund/trade 的精确账本。必须从具体法律实体、netting set、collateral eligibility 和期限读取可部署资本。<Cite n={29} /><Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="four-clocks">
        <p className="section-kicker">09 · 四个时钟：最短负债决定最长耐心</p>
        <h2>一笔交易同时活在收敛、融资/借券、投资者评价和合同 catalyst 四个时钟中；先到期的约束可能在经济 thesis 兑现前终止仓位。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="套利交易四个时钟，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>时钟</th><th>典型触发</th><th>失败后果</th></tr></thead>
            <tbody>
              <tr><td>Convergence</td><td>价格／现金流关系修复</td><td>预期收益尚未实现</td></tr>
              <tr><td>Funding / borrow</td><td>repo roll、margin、recall</td><td>补现金或平仓</td></tr>
              <tr><td>Investor evaluation</td><td>月/季业绩、赎回窗口</td><td>AUM 与资本供给下降</td></tr>
              <tr><td>Contract / catalyst</td><td>expiry、vote、deal close</td><td>关系兑现或断裂</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “长期资本”也不能只靠 lock-up 标签判断：融资腿可能隔夜续作，借券可按通知召回，risk limit 每日重估。Slow-moving-capital 文献反过来说明，外部有钱也不等于能立刻迁入一个需要专门系统、尽调和授权的 niche trade。<Cite n={1} /><Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="fundamental-risk">
        <p className="section-kicker">阶段二 · 风险与带宽　|　10 · Fundamental Risk</p>
        <h2>Cheap asset 可能不是被错误低估，而是它的未来现金流、法律优先级、流动性或事件概率真的比 rich hedge 更差；配对只能消除共同部分。</h2>
        <p>
          一对公司、两类股份、母子公司或并购双方都可能在持有期发生不同新闻。即使历史 beta=1，cash-flow innovation、default、dilution、tax、dividend 和 corporate action 仍使 x 的终点随机。Fundamental risk 无法仅靠等额美元 long/short 消除；真正需要的是 state-by-state claim map 与情景 P&amp;L。<Cite n={1} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="noise-trader-risk">
        <p className="section-kicker">11 · Noise-trader Risk：错误可以先变得更错</p>
        <h2>即使 fundamental anchor 不变，非基本面需求、异质信念和受限悲观交易仍能让 gap 在收敛前扩大；套利者面对的是路径分布，不是一个已知终点。</h2>
        <p>
          Noise trader 不是“随机愚蠢的人”，而是任何使需求偏离套利者估计的状态过程。其信念可能继续恶化，也可能由新乐观者接力；异质信念和卖空约束又会让乐观边际持有人主导价格。De Long 等人的核心贡献是：noise-trader beliefs 的不可预测变化本身成为理性套利者必须补偿的风险。<Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="path-loss-probability">
        <p className="section-kicker">12 · 正期望与下一期亏损概率可以同时很高</p>
        <h2>均值回复参数只控制条件均值；当 shock 相对预期收窄足够大，short-basis 仓位下一期亏损的概率仍可接近一半。</h2>
        <div className="equation-card">
          <span>透明的 reduced-form 教学模型</span>
          <div>x<sub>t+1</sub>=ρx<sub>t</sub>+ε<sub>t+1</sub>， ε<sub>t+1</sub>|𝓕<sub>t</sub>∼N(0,σ²)；　x<sub>t</sub>&gt;0，0≤ρ&lt;1，σ&gt;0；　P(Π<sup>gross</sup>&lt;0|𝓕<sub>t</sub>)=1−Φ(((1−ρ)x<sub>t</sub>)/σ)</div>
          <p>q&gt;0 时下一期亏损等价于 x<sub>t+1</sub>&gt;x<sub>t</sub>。𝓕_t 是时点 t 已知的信息集；条件分布假定 innovation 在该信息集下均值为零、方差为 σ² 且呈正态，因此才可推出右侧条件概率。Φ 是标准正态累积分布函数；分式 (1−ρ)x_t/σ 是“预期收窄”除以“一期冲击标准差”，1−Φ 就是冲击超过预期收窄的右尾概率。本教学例同时把 x_t、ρ 和 σ 的域显式冻结；0≤ρ&lt;1 既给出一期条件均值收窄，也满足无冲击 AR(1) 的 |ρ|&lt;1 稳定条件，而 σ&gt;0 使标准化概率有定义。本式不是 De Long 等人的原结构模型，只是可复算的路径风险翻译。</p>
        </div>
        <p>
          例如 x=8bp、ρ=0.75、σ=6bp，预期收窄只有2bp，下一期亏损概率约36.9%。若融资/评价时钟只容许一期，这个概率比远期均值更直接决定仓位。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="synchronization-risk">
        <p className="section-kicker">13 · Synchronization Risk 与延迟套利</p>
        <h2>多个理性套利者可以同时看见泡沫，却因不知道其他资本何时反向交易而等待；太早做空的个人可能在集体纠偏前先被 squeeze 出局。</h2>
        <p>
          Synchronization risk 不等于 fundamental risk：每个人可以同意价格偏离价值，分歧只在集体行动时点。也不等于普通 noise shock：关键是套利者对其他套利者觉醒和执行时间缺乏共同知识。Abreu–Brunnermeier 展示这种协调问题怎样延迟纠偏；它不能被简化成“聪明钱也相信泡沫”。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="horizon-mismatch">
        <p className="section-kicker">14 · Horizon Mismatch：谁能等到谁</p>
        <h2>终点收益属于 trade，持有期限属于 capital provider；若投资者、lender 或 risk committee 的耐心更短，经理面对的是资本截止日前的 payoff。</h2>
        <div className="equation-card">
          <span>两个时钟下的期望值</span>
          <div>EV=pG−(1−p)L−C；　p*=(L+C)/(G+L)</div>
          <p>p 是资本截止日前成功收敛的概率，G 是成功净收入前的收益，L 是未收敛被迫退出损失，C 是确定成本。只有 p&gt;p* 时，本教学二状态交易才有正 EV。</p>
        </div>
        <p>
          长期期望价值正确但短期 p 太低，仍然不足以支持开放式、每日 margin 的结构。基金 flow 与 skill 学习又会让资本提供者根据近期收益更新，而不是直接观察交易真实 value。<Cite n={1} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="model-anchor-risk">
        <p className="section-kicker">15 · Model / Anchor Risk</p>
        <h2>历史均值、factor-neutral residual、estimated NAV 与 implied parity 都是模型坐标；参数漂移或遗漏状态会把所谓 convergence 重新解释成风险溢价。</h2>
        <p>
          模型应输出 estimate distribution，而不是一条确定 fair value。最低审计包括 parameter vintage、confidence band、alternative specifications、structural break 与 contract-level sanity check。若 price 只偏离 point estimate 却仍在不确定区间内，正确操作可能是不交易，而不是把置信区间当“市场非理性”。<Cite n={10} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="implementation-leg-risk">
        <p className="section-kicker">16 · Implementation、Synchronization 与 Leg Risk</p>
        <h2>理论 package 只有在两腿以同一时钟和规模成交时存在；partial fill、stale quote、不同 venue 和 settlement 让 relative value 暂时变成方向仓位。</h2>
        <p>
          研究要保存逐腿 bid、ask、size、timestamp、order type、fill、cancel、reject、FX 与 hedge fill。买 cheap 在 ask、卖 rich 在 bid；不能把两条腿都放在各自最有利 midpoint。若一腿被拒绝，另一腿的 unwind 不是“执行误差小数项”，而是实际风险事件。Option-market limited-arbitrage 证据也依赖 borrow 与可执行报价，不是 screen parity 的机械利润。<Cite n={9} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="no-trade-region">
        <p className="section-kicker">17 · No-trade Region：摩擦把一价定律扩成带宽</p>
        <h2>只有预期 gap 收窄穿透 spread、impact、funding、borrow、tax、settlement 和模型缓冲后，候选错价才进入可交易集合。</h2>
        <div className="equation-card">
          <span>全成本净收敛收益</span>
          <div>Π<sup>net</sup>=q(x<sub>entry</sub>−x<sub>exit</sub>)+CF<sup>asset</sup>−C<sup>exec</sup>−C<sup>borrow</sup>−C<sup>fund</sup>−C<sup>fail/default</sup></div>
          <p>全部项目先转成同一 reporting currency；若 x 已是 after-carry basis，就不能再次扣同一 carry。成本随规模和状态变化，因此 no-trade band 也会内生扩张。</p>
        </div>
        <p>
          Closed-end fund、short-sale 与 margin 文献都显示“看得见的 gap”可以被真实交易成本和资本占用吃掉。最强的实证对象不是 mid-price residual，而是 direction-correct executable return after borrow and funding。<Cite n={7} /><Cite n={8} /><Cite n={9} /><Cite n={12} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="borrow-fee-risk">
        <p className="section-kicker">18 · Borrow Availability 与 Fee Risk</p>
        <h2>Short leg 的可借数量、费率、collateral、rebate 和期限是随机状态；建仓时拿到 locate 不代表能以同一成本持有至 catalyst。</h2>
        <div className="equation-card">
          <span>固定名义计费的教学借券成本</span>
          <div>C<sup>borrow</sup>=N<sub>s</sub>f<sub>b</sub>(d/B)</div>
          <p>N_s 是计费名义金额，f_b 是 decimal/year，d/B 是 year fraction。真实合约可能每日按市值重算、改变 rebate、collateral 与费率，必须读取协议。</p>
        </div>
        <p>
          Securities-lending 搜索、议价和供给集中使价格与 loan fee 共同内生；高 fee 可以既反映强 short demand，也反映稀缺 supply。Hanson–Sunderam 等研究尝试从 shorting demand/supply 推断套利活动，但代理不能恢复每笔基金仓位。<Cite n={6} /><Cite n={7} /><Cite n={8} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="recall-squeeze">
        <p className="section-kicker">19 · Recall、Buy-in 与 Short Squeeze</p>
        <h2>空头可能在价格最不利时同时遭遇 mark loss、maintenance 上升、borrow 收回和回补冲击；但高 short interest 本身仍不能证明 squeeze 已发生。</h2>
        <p>
          1.19 已给出 locate、recall 与 current rules，本节只接入资本链：price up → equity down / required resources up → cover order → price impact。要从“可能”升级为“发生”，必须观察 loan/recall、buy-to-cover、actual fill 与 depth。Short interest&gt;100% 也不自动证明 naked short；股票被重新出借可以产生超过 float 的 gross short claims。<Cite n={7} /><Cite n={8} /><Cite n={51} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="jump-default-settlement">
        <p className="section-kicker">20 · Jump、Default、Settlement 与 Counterparty Risk</p>
        <h2>连续相关的两腿会在 merger break、default、trading halt、special dividend、deliverable change 或 counterparty failure 中离散断裂，普通 beta hedge 无法穿越不存在的中间价格。</h2>
        <p>
          Event-driven trade 必须列出每个法律状态下的 deliverable、priority、cash flow 和 close-out。多腿均为正市值也可能被不同 netting set 分开收取 collateral；一边 settlement fail 又会制造 buy-in、funding 和 replacement cost。Equity carve-out 与 constrained-arbitrage 模型都显示，合同 anchor 较强不等于关系不会提前断裂。<Cite n={11} /><Cite n={23} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="depth-capacity">
        <p className="section-kicker">21 · Market Depth 与 Strategy Capacity</p>
        <h2>策略容量取决于最差一腿的可成交深度、退出时钟和冲击曲线；signal strength 变大时，最优 notional 不会线性放大。</h2>
        <div className="equation-card">
          <span>线性只作第一道容量体检</span>
          <div>C<sup>impact</sup>(Q)≈½λQ²；　Marginal impact≈λQ</div>
          <p>Q 是有方向的交易量，λ 是 price impact slope；真实 depth 非线性、状态依赖且两腿不同。公式用于提醒边际成本随规模上升，不是通用最优执行模型。</p>
        </div>
        <p>
          Arbitrageurs 平时向分割市场提供流动性，但其总 capital 与局部 market depth 有限。索引纳入、需求曲线与受约束套利证据说明，边际需求不是无限弹性；仓位越集中，exit price 越应由 stress depth 而非 entry midpoint 估计。<Cite n={13} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="path-survival">
        <p className="section-kicker">22 · “先更错、后收敛”的 Survival Condition</p>
        <h2>终点 expected profit 只有在所有中途状态的 cash、margin、borrow 和 mandate 都可行时才属于当前投资者；否则 liquidation time 取代 catalyst time 成为真实终点。</h2>
        <div className="equation-card">
          <span>最小生存条件</span>
          <div>Survive ⇔ min<sub>τ≤T</sub>&#123;FreeLiquidity<sub>τ</sub>−Calls<sub>τ</sub>−Redemption<sub>τ</sub>&#125; ≥ 0</div>
          <p>这是路径约束，不是概率模型。Calls 包括 variation margin、haircut、borrow 与 settlement demand；若任一时点为负，就需外部融资、减仓或违约处理。</p>
        </div>
        <p>
          Liu–Longstaff 与 Kondor 分别从 collateral-constrained dynamic portfolio choice 与 dynamic convergence-trading price effects 说明，最终收敛前的中途损失会约束仓位和价格路径。把 FreeLiquidity 跌破零视为 absorbing liquidation boundary，是本节账户状态机的推论，不是两篇论文共同识别出的现实清算事件；研究也不能从最终价格回归倒推所有中途持有者都获利。<Cite n={23} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="nav-ledger">
        <p className="section-kicker">阶段三 · 资本账本　|　23 · NAV Mark-to-market 先于观点更新</p>
        <h2>账户按实际持仓和可用 mark 记账，不按 manager 的 fair value；gap 扩大造成的损失会先改变权益，再影响下一轮 capacity。</h2>
        <div className="equation-card">
          <span>资本演化的会计骨架</span>
          <div>E<sub>t+</sub>=E<sub>t−</sub>+Π<sup>actual</sup><sub>t</sub>+ExternalNetContributions<sub>t</sub></div>
          <p>Π 使用 actual positions、fills、cash flows 和 costs；ExternalNetContributions 是外部净入金减净赎回。Margin call 只是现金/抵押品需求，若已通过 marks 进入 NAV，不能再把同一经济损失扣第二次。</p>
        </div>
        <p>
          对一笔 q&gt;0 的 short-basis trade，x 从4扩大到9会产生 q(4−9) 的损失，即使 manager 上调终点期望收益。价值观点、会计净值和可用 collateral 因此必须分开显示。
        </p>
      </section>

      <section className="lesson-section" id="gross-net-leverage">
        <p className="section-kicker">24 · Gross、Net 与 Leverage</p>
        <h2>多空净额接近零只说明选定方向 exposure 小，不表示 gross financing、两腿流动性、basis jump 或 margin requirement 小。</h2>
        <div className="equation-card">
          <span>三个不能互换的比例</span>
          <div>Gross=Σ|MV<sub>j</sub>|；　Net=ΣMV<sub>j</sub>；　Balance-sheet leverage=Assets/Equity</div>
          <p>Derivatives 还需报告 gross notional、delta equivalent 和 potential future exposure。不同研究中的“leverage”分母不同，必须保留原始定义。</p>
        </div>
        <p>
          一个 long 100／short 100 的 trade net=0，却有200 gross legs；两边 spread 扩大、funding 断裂或 netting 失效时，全部 gross 都可能需要资源。官方与学术中介数据只能在既定报告口径下度量 leverage，不能直接推算某账户的 liquidation trigger。<Cite n={30} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="margin-haircut">
        <p className="section-kicker">25 · Haircut、Initial Margin 与 Variation Margin</p>
        <h2>Haircut 决定融资时需要自有资本的比例，initial margin 提供违约缓冲，variation margin 结算价格变化；三者共同制造流动性需求，却不是同一种经济损失。</h2>
        <div className="equation-card">
          <span>最小 collateral capacity</span>
          <div>RequiredCapital=Σh<sub>j</sub>|Exposure<sub>j</sub>|+IM+Add-ons ≤ EligibleResources</div>
          <p>h、IM、netting 和 add-on 均依 counterparty、portfolio、产品与状态。2.16 将展开 VaR／ES 和 limit governance；此处只把当期 required resources 作为 capacity 输入。</p>
        </div>
        <p>
          Margins 可以因 volatility、liquidity 和 counterparty concern 上升，并与市场流动性形成反馈。它们同时具有事前韧性作用：更高 initial margin 会降低正常时期 leverage，所以“提高 margin 一定加剧长期脆弱性”同样错误。<Cite n={27} /><Cite n={28} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="funding-rollover">
        <p className="section-kicker">26 · Funding Tenor 与 Rollover</p>
        <h2>一笔六个月后收敛的交易若依赖隔夜 repo、每日 futures VM 或可召回 stock loan，它的真正负债期限远短于资产 anchor。</h2>
        <p>
          融资账必须记录 lender、maturity、rate、haircut、eligible collateral、rehypothecation、netting set、termination 与 close-out。Term funding 降低 rollover risk 但可能更贵；overnight funding 便宜却把每天的续借决定变成新的状态。Gârleanu–Pedersen 将不同 margin 的 shadow cost 连接到 law-of-one-price deviation；这不是保证所有高-margin asset 都被低估。<Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="delegated-management">
        <p className="section-kicker">27 · Delegated Management：专业知识与资本分离</p>
        <h2>经理观察交易细节，外部投资者观察带噪的业绩；合理的 skill learning 仍会把短期亏损转成资金撤回，使正确但太早的交易失去资本。</h2>
        <p>
          这不是简单假设投资者短视。若投资者无法区分“好经理遇到 noise shock”和“坏经理估错 value”，近期 return 就含 skill 信息；赎回可以是其条件决策。Berk–Green 的均衡进一步说明，fund size 与 performance flow 可以使 skill 存在却不表现为持久超额收益。<Cite n={1} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="performance-based-arbitrage">
        <p className="section-kicker">28 · Shleifer–Vishny 的 Performance-based Arbitrage</p>
        <h2>原模型的关键不是“fund flows 永远 destabilizing”，而是 fully invested、underpricing 继续恶化且资本对业绩足够敏感时，套利者会在机会最大处失去资金并减持。</h2>
        <div className="equation-card">
          <span>原模型资金供给的精确简化</span>
          <div>F₂=F₁G[(D₁/F₁)(P₂/P₁)+(F₁−D₁)/F₁]；　若 G(r)=ar+1−a，则 F₂=F₁−aD₁(1−P₂/P₁)</div>
          <p>F 是 fund capital，D₁ 是期初投入 risky asset 的金额，括号是 gross portfolio return。a=1 表示亏掉的资本不补充；a&gt;1 才表示亏损之外还有净撤资。原模型把供给归一化并研究悲观 noise demand 下的 underpricing。</p>
        </div>
        <p>
          若价格已反转、业绩转正，performance flow 也可能流入并加快后续收敛；若经理保留 dry powder，也可在第二期增持。因此稳健结论是资本供给具有状态依赖和 corner，不是“投资者资金流必然把任何 mispricing 越推越远”。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="slow-moving-capital">
        <p className="section-kicker">29 · Slow-moving Capital：外部有钱也不能瞬间迁移</p>
        <h2>不同市场需要专门模型、数据、法律、prime-broker 与风控授权；当 incumbent specialists 亏损时，outsider capital 要经过识别、尽调和组织摩擦才会进入。</h2>
        <div className="equation-card">
          <span>教学资本迁移</span>
          <div>K<sub>t+1</sub>=K<sub>t</sub>+ν(K*−K<sub>t</sub>)−L<sub>t</sub>，　0≤ν≤1</div>
          <p>K* 是长期愿意进入的资本，ν 是每期迁移速度，L 是同期损失/退出。ν 小意味着 opportunity 出现后 capital gap 仍可持续；它不是文献的唯一结构式。</p>
        </div>
        <p>
          Convertible、merger 与其他 niche markets 的证据显示，specialized arbitrageurs 受损后，价格相对 fundamentals 的偏离可以持续数月；multi-strategy outsiders 也可能因内部信息壁垒而卖出而非接盘。<Cite n={19} /><Cite n={20} /><Cite n={33} /><Cite n={38} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="capital-supply-curve">
        <p className="section-kicker">30 · State-dependent Capital Supply Curve</p>
        <h2>正常状态下 gap 越大，单位预期收益越高、套利需求越强；受损状态下 equity、borrow 和 margin capacity 同时下降，需求曲线可以向后弯折。</h2>
        <div className="boundary-box"><b>非单调</b><p>同一个 x 对不同 capital state E、haircut h、borrow Q 和 investor flow F 会产生完全不同的 q。Limits to arbitrage 不是一条永久较低的直线需求，而是状态向量改变了曲线的斜率、上限甚至交易方向。</p></div>
        <p>
          Shleifer–Vishny、slow-moving capital 与 financially constrained arbitrageur 模型从 agency、迁移和 collateral 三个角度得到同一世界观：专业资本有限且内生。它们不是同一模型，也不能把一个市场的参数移植到另一个市场。<Cite n={1} /><Cite n={19} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="unconstrained-demand">
        <p className="section-kicker">31 · Unconstrained Optimal Demand</p>
        <h2>先计算没有硬约束时的风险调整目标，再与各类 capacity 取交集；否则无法区分“观点变弱”和“资本上限收紧”。</h2>
        <div className="equation-card">
          <span>一包净收益 Y 的均值–方差基准</span>
          <div>max<sub>q≥0</sub>&#123;qE[Y]−(γ/2)q²Var(Y)&#125;；　若 γ&gt;0、Var(Y)&gt;0，q<sup>uc</sup>=max(0,E[Y]/(γVar(Y)))</div>
          <p>Y 单位为货币/包，γ 单位为1/货币，q 的结果为包。若 Var(Y)=0 且 E[Y]&gt;0，未受约束问题没有有限最优仓位，真实解只能由 capacity 截断；若 E[Y]≤0，非负仓位基准取 q=0。若风险来自多腿，应以 wᵀΣw 计算；除非协方差明确为零，不能直接相加各腿方差。</p>
        </div>
        <p>
          q_uc 是教学 benchmark，不是 universal Kelly rule。尾部、parameter uncertainty、liquidation utility 和 nonlinear impact 都会改变最优解；但它提供了一个干净对照：若 E[Y] 上升而 actual q 下降，原因必须在 risk、constraint 或 execution 链中寻找。
        </p>
      </section>

      <section className="lesson-section" id="capacity-shadow-price">
        <p className="section-kicker">32 · Capacity 与 Capital Shadow Price</p>
        <h2>实际目标取 free capital、borrow、risk、mandate 和 liquidity 上限中的最小值；binding constraint 的乘子衡量多一单位资源能增加多少目标价值。</h2>
        <div className="equation-card">
          <span>多个上限的交集</span>
          <div>m<sup>unit</sup>&gt;0 时，q<sup>cap</sup>=max(0,min(C<sup>free</sup>/m<sup>unit</sup>, Q<sup>borrow</sup>, Q<sup>risk</sup>, Q<sup>mandate</sup>, Q<sup>liquidity</sup>))；　q*=min(q<sup>uc</sup>,q<sup>cap</sup>)</div>
          <p>m_unit 是每包正的增量 margin/collateral，各 Q 也定义为非负剩余上限；外层 max 防止 negative free capital 生成负 capacity。若 portfolio offsets 使 m_unit≤0，不能相除或宣称无限容量：应移除这一线性分支，用完整组合重算 margin，再由 borrow、risk、mandate 与 liquidity 等其余上限截断。Q_risk 由2.16输入，不能在本式内假装已解释。</p>
        </div>
        <p>
          Margin-based asset pricing 和 CDS market concentration 研究说明，资本供给者的 shadow cost 可以进入相对价格；但 observed basis 仍混合风险、流动性与需求，不能从一个 spread 唯一反推乘子。<Cite n={21} /><Cite n={28} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="treasury-basis-balance-sheet">
        <p className="section-kicker">33 · Treasury Cash–Futures Basis 是资产负债表，不是两条价格相减</p>
        <h2>一份 basis package 同时包含 cash Treasury、repo liability、haircut equity、short futures、initial/variation margin、CTD 与 delivery-option exposure。</h2>
        <div className="equation-card">
          <span>初始资源与冲击流动性需求</span>
          <div>K₀=hN+IM+B；　L<sup>call</sup>=NΔh+ΔIM+VM⁺；　Shortfall=max(0,L<sup>call</sup>−B)</div>
          <p>N 是 cash Treasury 市值，h 是 repo haircut，IM 是 futures initial margin，B 是预留流动性，VM⁺ 是需支付的 variation margin。Shortfall 是现金需求，不等于经济损失。</p>
        </div>
        <p>
          可交易 basis 必须处理 cheapest-to-deliver、conversion factor、delivery option、coupon、term-repo carry 与执行；raw futures−cash 没有共同单位和交割含义。Form PF／CFTC／repo 的组合只能估计 likely basis activity，不能把全部 leveraged-fund futures shorts 认定为该交易。<Cite n={44} /><Cite n={45} /><Cite n={48} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="short-book-balance-sheet">
        <p className="section-kicker">34 · Short-book Capital：价格上涨同时打击分子与分母</p>
        <h2>Short squeeze 状态中，价格上涨既造成空头损失、减少 equity，也可提高按市值计算的 maintenance resource；同一 shock 因此双重压缩 capacity。</h2>
        <div className="equation-card">
          <span>简化教学账本</span>
          <div>E₁=E₀−q(S₁−S₀)；　M₁=μqS₁；　Deficit=max(0,M₁−E₁)</div>
          <p>q 是 short shares 的绝对数量，μ 是题设 maintenance ratio。μqS 不是通用于所有 broker、账户与司法辖区的规则，只用来分开 mark loss、required resource 和 deficit。</p>
        </div>
        <p>
          实际账户还包括 short proceeds、其他 collateral、house add-ons、borrow、options 和 netting。只有 deficit 变成 cover order 并获得 fill，才进入价格冲击；maintenance calculation 本身不是市场卖买流。
        </p>
      </section>

      <section className="lesson-section" id="normal-convergence">
        <p className="section-kicker">阶段四 · 反馈符号　|　35 · 正常状态下的收敛负反馈</p>
        <h2>若 capital intact、gap 可执行且 convergence demand 随 x 增加，套利者买 cheap／卖 rich 的 fills 会吸收 imbalance，使 gap 收窄。</h2>
        <div className="equation-card">
          <span>从实际成交到 gap</span>
          <div>Δq<sup>fill</sup><sub>t</sub>=η<sub>t</sub>x<sub>t</sub>；　x<sub>t+1</sub>=x<sub>t</sub>+u<sub>t+1</sub>−λ<sub>t</sub>Δq<sup>fill</sup><sub>t</sub></div>
          <p>η 是每单位 gap 对应的实际成交弹性，不是 target 弹性；在 x 以货币/包、q 以包计量时，η 的单位是包²/货币，λ 的单位是货币/包²，因此 κ=λη 无量纲。u 是其他需求/价值冲击；η&gt;0 表示沿收敛方向成交。</p>
        </div>
        <p>
          这就是套利稳定价格的条件性含义，不是定理保证。若 order 未成交、rich leg 禁止卖空、cheap leg 深度不足或价值 anchor 改变，η 和 λ 都会不同。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="convergence-speed">
        <p className="section-kicker">36 · Convergence Speed、Overshoot 与稳定域</p>
        <h2>资本弹性与 market impact 的乘积决定局部动力；“反应很强”既可能一步闭合，也可能过冲，只有越过稳定域才发散。</h2>
        <div className="equation-card">
          <span>离散收敛系数</span>
          <div>x<sub>t+1</sub>=(1−κ<sub>t</sub>)x<sub>t</sub>+u<sub>t+1</sub>；　κ<sub>t</sub>=λ<sub>t</sub>η<sub>t</sub>；　冻结 κ 且令 u=0 时，x<sub>t+h</sub>=(1−κ)<sup>h</sup>x<sub>t</sub></div>
          <p>以下分类只属于冻结常数 κ、齐次无冲击的局部系统：κ&lt;0 同向发散；κ=0 保持不变；0&lt;κ&lt;1 单调收敛；κ=1 一步闭合；1&lt;κ&lt;2 换号过冲但衰减；κ=2 无衰减振荡；κ&gt;2 换号发散。时变 κ_t 的齐次部分只有在 ∏|1−κ_s|→0 时才消失；加入 u 后还需另给冲击过程和稳定性条件，不能把这张分类表无条件外推。</p>
        </div>
        <p>
          真实 η 随 capital、risk limit、expected return 与执行变化，λ 随深度和时钟变化，所以 κ 是状态变量。估计一个全样本平均 speed 会把危机符号翻转平滑掉。
        </p>
      </section>

      <section className="lesson-section" id="wealth-effect">
        <p className="section-kicker">37 · Wealth Effect：错价扩大侵蚀下一轮需求</p>
        <h2>Existing arbitrageurs 已经持有 q&gt;0 时，gap 扩大造成 dE=−q·dx；即使其目标函数更想买，wealth loss 也会降低下一轮可行仓位。</h2>
        <p>
          在共享同一套利资本池时，wealth decline 可以同时提高其持有多种资产的 required returns 与 illiquidity，使这些资产的偏离共动；这不证明任意两个 gap 共用资本池，更不能从相关性反推传导。这个渠道不要求投资者 irrational，但需要专门资本有限、mark-to-market 且不能无摩擦补充。<Cite n={24} /><Cite n={25} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="margin-feedback">
        <p className="section-kicker">38 · Margin / Haircut Feedback</p>
        <h2>压力 shock 可以同时令 basis widening、equity loss、haircut/IM 上升和 market depth 下降；所需减仓又把同一 shock 重新输入价格。</h2>
        <div className="causal-chain" aria-label="保证金反馈链">
          <div><span>01</span><b>Gap widens</b><p>Actual position 出现 mark loss。</p></div>
          <i>→</i><div><span>02</span><b>Resources fall</b><p>Equity 与 free collateral 下降。</p></div>
          <i>→</i><div><span>03</span><b>Terms tighten</b><p>Haircut、IM、add-on 上升。</p></div>
          <i>→</i><div><span>04</span><b>Capacity drops</b><p>Target 被硬上限截断。</p></div>
          <i>→</i><div><span>05</span><b>Forced fill</b><p>卖 cheap／买 rich。</p></div>
          <i>→</i><div><span>06</span><b>Gap widens</b><p>Market impact 进入下一轮。</p></div>
        </div>
        <p>
          Brunnermeier–Pedersen 与 margins-and-deviations 研究给出不同层级的理论连接。本节只建立单一资本池局部环，7.11 才处理全系统 funding–market-liquidity spiral。<Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="redemption-interface">
        <p className="section-kicker">39 · Redemption 是外部现金流接口</p>
        <h2>本节把已知净赎回作为 ExternalNetContributions 的负项，观察其怎样减少资本与 capacity；为何赎回发生、资产是否流动性错配，留给2.17。</h2>
        <div className="equation-card">
          <span>不重复计损失的顺序</span>
          <div>E<sub>post</sub>=E<sub>pre</sub>+P&amp;L<sub>actual</sub>−Redemption；　q<sup>cap</sup><sub>post</sub>=Capacity(E<sub>post</sub>,h,borrow,depth)</div>
          <p>先让市场损益进入 NAV，再扣真实赎回；不能把 performance loss、赎回和随后减仓损失混成同一个百分比。减仓后的 impact 再进入下一期 P&amp;L。</p>
        </div>
        <p>
          Performance-based flow 与 slow-moving capital 说明赎回可以在机会改善时到来，但 inflow 也可能在反转后加快收敛。这个符号取决于 timing、liability design 与 manager state。<Cite n={1} /><Cite n={17} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="evaluation-interface">
        <p className="section-kicker">40 · Benchmark / Evaluation 是资本分配规则接口</p>
        <h2>相对业绩、career 和 fee contract 会改变资本提供者怎样解读同一 absolute loss；本节只输入由此产生的资本变化，不重建 tracking-error optimization。</h2>
        <p>
          一笔 trade 对 fundamental 最终正确，却可能连续数季落后 benchmark，使 manager 被撤换或 mandate 缩减。Flow-based asset-pricing 模型又说明委托资金需求可产生价格压力与后续 reversal；这不是所有 momentum 的单一解释。完整 benchmark 与 institutional herding 留给2.18和第6章。<Cite n={1} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="crowding-interface">
        <p className="section-kicker">41 · Crowding 只在共同损失与共同退出时改变反馈</p>
        <h2>多人持有同一 convergence trade 在正常时可以提高纠偏能力；只有共同 state shock 同时击中 capacity，并生成同向 actual orders，crowding 才转成 liquidation amplifier。</h2>
        <p>
          “持仓相似”不是价格冲击。最低链条是 overlap → common loss → binding constraints → signed orders/fills → depleted depth → price response。2.19 将研究 crowding 的形成和 proxy；本节把已知 overlap 与 forced quantity 作为输入。Hedge-fund holdings 与 arbitrage-capital-usage 研究也提醒，公开 position proxy 不等于实时订单。<Cite n={15} /><Cite n={16} /><Cite n={19} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="endogenous-liquidation">
        <p className="section-kicker">42 · Endogenous Liquidation 与 Fire-sale Price</p>
        <h2>Forced sale 不只是压力结果；它以不利 impact 改变剩余仓位的 mark、其他基金 collateral 与下一轮 margin，成为新的状态输入。</h2>
        <div className="equation-card">
          <span>实际清算量，而非目标，进入价格</span>
          <div>Q<sup>unwind,fill</sup><sub>t</sub>:=-Δq<sup>fill</sup><sub>t</sub>≥0；　Δx<sup>impact</sup><sub>t</sub>=λ<sub>t</sub>Q<sup>unwind,fill</sup><sub>t</sub>；　Q<sup>unwind,fill</sup>≤Q<sup>unwind,order</sup></div>
          <p>全章 q&gt;0 是 convergence 仓位，所以退出成交 Δq&lt;0；这里把其绝对量 Q_unwind 定义为正数，故 λ&gt;0 时 gap 扩大。Q 仍须分腿记录；部分成交会留下未完成 deficit，不能假设 constraint 已解决。λ 随 depth、venue、time 和其他 order flow 改变。</p>
        </div>
        <p>
          受约束套利者本来是边际买方，却可能在坏状态成为 liquidity demander；中介资本受损还会跨资产传导。局部模型说明可能性，具体市场必须观察成交。<Cite n={21} /><Cite n={27} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-denominator">
        <p className="section-kicker">43 · Opportunity Effect 与 Wealth Effect 的反馈分母</p>
        <h2>同一个 gap 扩大既通过 Dₓ 提高目标需求，也通过 dE=−qdx 和 Dᴇ 降低资本能力；两者净额决定冲击被缓冲还是放大。</h2>
        <div className="equation-card">
          <span>局部教学均衡</span>
          <div>q=D(x,E)，dE=−qdx，dx=du−λdq　⇒　dx=du/[1+λ(D<sub>x</sub>−qD<sub>E</sub>)]</div>
          <p>x 为货币/包，q 为包，D_x 与 qD_E 均为包²/货币，λ 为货币/包²，分母无量纲。D_x&gt;qD_E 时分母大于1、资本反应缓冲冲击；若 D_x&lt;qD_E 但分母仍在0与1之间，wealth effect 才在该局部正分支放大冲击。</p>
        </div>
        <p>
          若分母≤0，只能说这个局部静态分支不稳定，不能把除法结果解释为现实中的无限价格。动态 wealth effect、financing friction 与 market liquidity 需要显式时序。<Cite n={24} /><Cite n={25} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="predatory-reentry">
        <p className="section-kicker">44 · Overshooting、Predatory Trading 与 Re-entry</p>
        <h2>若其他交易者预见某基金必须清算，他们可能先向同一方向交易，使价格超越 fundamental；只有更耐心、未受损且具备基础设施的资本随后进入，gap 才可能反转。</h2>
        <p>
          Predatory trading 需要被迫交易的可预测性、有限深度和战略时序，不能由一次快速下跌单独识别。Re-entry 也有门槛：外部资本需要验证 anchor、获得授权、安排 borrow/funding 并承担在 knife-catching 后继续亏损的风险。<Cite n={19} /><Cite n={20} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="heterogeneous-capital">
        <p className="section-kicker">45 · Heterogeneous Capital：谁的资产负债表在边际上有效</p>
        <h2>自有资金、长期锁定资本、开放式基金、dealer balance sheet 与高杠杆 relative-value fund 面对相同 x 会给出不同需求弹性；“全市场还有现金”不是充分对手盘。</h2>
        <p>
          Locked capital 更能承受 performance flow，却仍可能有 margin 和 mandate；dealer 能做 market making，却受 balance-sheet shadow cost；multi-strategy fund 有跨策略资金，却可能受内部 risk budget 和信息壁垒。金融中介和 market-specific supply 证据支持异质性，但宏观 proxy 不能替代逐机构账本。<Cite n={29} /><Cite n={30} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">46 · 反例库：Limits 不等于“价格永不收敛”</p>
        <h2>成熟 world model 必须同时容纳套利稳定市场和套利资本放大压力；哪种状态占主导取决于 anchor、leverage、liability、capital damage、depth 与实际成交。</h2>
        <ul className="diagnostic-list">
          <li><b>Gap 扩大后更多资本进入：</b>长期锁定、低杠杆且合同 anchor 透明的基金保留 dry powder。</li>
          <li><b>Higher margin 提高长期韧性：</b>当下它降低 capacity，但事前减少 leverage 和 future fire-sale risk。</li>
          <li><b>Large spread 不是 mispricing：</b>default、liquidity、tax、optionality 或 risk premium 同时改变。</li>
          <li><b>Crowding 初期加快收敛：</b>只有共同损失和共同退出才使符号翻转。</li>
          <li><b>Performance flow 加快反转：</b>价格开始修复、业绩转正后，inflow 可提供更多 convergence capital。</li>
          <li><b>Arbitrageurs 长期盈利仍可在危机放大价格：</b>平均 stabilization 与状态性 liquidation 并不矛盾。</li>
        </ul>
        <p>
          因而“存在 limits”不是任何偏离的免解释口号。必须展示哪项约束 binding、何时 binding、怎样改变 actual position，以及是否有更强的 competing explanation。<Cite n={1} /><Cite n={21} /><Cite n={27} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="carveout-evidence">
        <p className="section-kicker">阶段五 · 证据与研究　|　47 · Equity Carve-out / Negative Stub</p>
        <h2>母子公司结构给出较强的相对价值 anchor，历史上却出现母公司隐含其他业务价值为负；借券、分配时点和关系断裂使“加减法错误”仍难无风险消除。</h2>
        <p>
          Lamont–Thaler 的技术股 carve-out 案例和 Mitchell–Pulvino–Stafford 的更广样本说明，子公司 short constraint、交易成本与 deal break 共同限制套利；后者报告部分关系在 gap 纠正前即被切断。这个证据支持“合同较强也有路径限制”，不证明任何 negative stub 都是可获利 irrationality。<Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="treasury-basis-case">
        <p className="section-kicker">48 · Treasury Basis：同一案例中的稳定与放大</p>
        <h2>Basis capital 平时购买 cash Treasuries、卖 futures，使两市场更一致；压力期 basis widening、futures VM 与 liquidity demand 可能促成 unwind，但2020年3月不能被写成单一 basis-trader 故事。</h2>
        <p>
          FSB、BIS 与官方跨机构综述把 dash-for-cash、dealer balance sheet、mutual-fund sales、foreign flows、relative-value deleveraging 等列为并发渠道；Fed/OFR 研究支持 hedge-fund basis exposure、margin pressure 与减仓，却也指出 aggregate dealer financing 并未统一消失，且 unwind 更可能是压力后果而非首因。因而 repo funding cutoff 或 basis trader 任一项都不能单独解释整场 Treasury dysfunction。<Cite n={41} /><Cite n={42} /><Cite n={43} /><Cite n={44} /><Cite n={45} /><Cite n={46} /><Cite n={47} /><Cite n={48} />
        </p>
        <p>
          截至 May 2026 Financial Stability Report（报告信息截止 2026-04-23；综合 hedge-fund 数据至 2025Q3），官方数据仍把 basis exposure 视为估计而非逐笔账本；规模与集中度可以用于监测脆弱性，却不能反向证明未来 shock 必然触发同一路径。FSB 的 2025 NBFI leverage 框架与这份稳定报告用于当前风险边界，不替代具体 event identification。<Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="short-squeeze-case">
        <p className="section-kicker">49 · GameStop：Short Squeeze 机制存在，但不是完整单因果</p>
        <h2>2021年1月的账户级证据支持部分离散窗口内 short covering 形成显著买压；持续多周的上涨却主要伴随更广泛 positive sentiment 与普通买盘，不能全部归给 covering 或 gamma squeeze。</h2>
        <p>
          SEC staff report 区分 short covering 与总买量，并指出可得数据不支持把持续上涨解释成单一 gamma squeeze。高 short interest 确实提高 squeeze vulnerability，却不给出回补时点、规模或影响系数。Pedersen 的 equilibrium framing 进一步展示 long demand、short constraint 与 price dynamics 的共同作用；它是结构解释，不是对每笔成交动机的直接观察。<Cite n={51} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-ladder">
        <p className="section-kicker">50 · Evidence Ladder：从合同错价到资本 proxy</p>
        <h2>越接近同一索赔与实际账户，limits-to-arbitrage 的证据越强；从 return anomaly、AUM 或 aggregate leverage 直接跳到具体 forced trade，证据最弱。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="套利限制证据阶梯，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>Evidence</th><th>能观察什么</th><th>主要限制</th></tr></thead>
            <tbody>
              <tr><td>Closed-end fund discount</td><td>NAV 相对价格</td><td>费用、税、控制和赎回缺失</td></tr>
              <tr><td>Carve-out / stub</td><td>结构性换股或分配关系</td><td>shortability、deal break</td></tr>
              <tr><td>Convertible / merger capital</td><td>specialist loss 与 price pressure</td><td>策略识别、样本选择</td></tr>
              <tr><td>LTCM</td><td>高杠杆 convergence 与系统协商</td><td>不完整持仓、危机多因果</td></tr>
              <tr><td>Treasury regulatory data</td><td>repo、cash、futures 的近似组合</td><td>不是 trade-level basis book</td></tr>
              <tr><td>Aggregate intermediary capital</td><td>宏观风险承受状态</td><td>无法识别单一 order/fill</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Closed-end fund sentiment、convertible arbitrage 与 LTCM 文献分别提供持久偏离、specialized-capital loss 和高杠杆路径案例；它们不能被拼成一条无条件规律。当前资本与市场流动性的研究也必须标注 proxy、覆盖机构和 reporting lag。<Cite n={12} /><Cite n={33} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">51 · 可证伪研究：Capital Shock 是否降低收敛概率？</p>
        <h2>最干净的问题不是“limits 是否存在”，而是在初始 executable gap 相同的 at-risk entries 中，外生 capacity loss 是否先减少实际 convergence position，再降低竞争事件发生前、固定窗口内的收敛累计发生率；绝对 gap 只作为 anchor 存续样本的辅助诊断。</h2>
        <div className="precision-note">
          <span>先用一笔 object-entry 分清三种结果</span>
          <p>假设某价差在 t 时为 8bp，预先规定“降到 ε=2bp 内算收敛”、观察 h=5 天。若第 3 天降到 1.5bp、而 deal break 到第 4 天才发生，这是“竞争事件之前成功收敛”；若第 2 天 deal 已终止，则原收敛命题先失效，记录为竞争事件，而不是继续比较一条已换含义的 gap；若数据只到第 3 天且两种事件都未发生，结果仍未知，属于右删失，不能偷偷填成失败。只有完整看到第 5 天且没有收敛，才是已观察到的窗口内未收敛。</p>
        </div>
        <div className="equation-card" role="group" aria-labelledby="research-step-a">
          <span id="research-step-a">步骤 A · 先定义风险集、成功与竞争事件</span>
          <div>𝓡:=&#123;(i,t):g<sub>i,t</sub>=|x<sub>i,t</sub>|&gt;ε，且 t 时 anchor 有效&#125;<br />τ<sup>conv</sup><sub>i,t,ε</sub>=inf&#123;s≥1:g<sub>i,t+s</sub>≤ε&#125;；　τ<sup>comp</sup><sub>i,t</sub>=inf&#123;s≥1:J<sub>i,t+s</sub>∈竞争事件&#125;<br />C<sub>i,t,h</sub>:=1&#123;τ<sup>conv</sup><sub>i,t,ε</sub>≤h，τ<sup>conv</sup><sub>i,t,ε</sub>&lt;τ<sup>comp</sup><sub>i,t</sub>&#125;</div>
          <p>i 是价差对象，t 是进入观察的起点，g 是绝对可执行 gap，ε 是容忍带，h 是预先固定的窗口。inf 表示“满足条件的最早正整数步”；J 是每一步的事件标签。C=1 只表示在 h 内且先于竞争事件进入容忍带；同一时间粒度内两种事件并发时，也必须预先写定排序规则。</p>
        </div>
        <div className="equation-card" role="group" aria-labelledby="research-step-b">
          <span id="research-step-b">步骤 B · 主结果只回答累计收敛发生率</span>
          <div>C<sub>i,t,h</sub>=α<sub>i</sub>+δ<sub>t</sub>+b<sub>h</sub>Z<sup>cap</sup><sub>i,t</sub>+θ<sub>h</sub>g<sub>i,t</sub>+Γ<sub>h</sub>W<sub>i,t</sub>+e<sub>i,t,h</sub></div>
          <p>Z_cap&gt;0 表示标准化的 capacity loss，W 只放入进入观察前已确定的混杂因素，α 与 δ 分别吸收可识别的对象和起点效应。b_h&lt;0 才表示在同一起点 gap 下，h 内且竞争事件之前的累计收敛发生率较低；它不等于“价差在 h 时平均更大”，也不自动建立外生因果。</p>
        </div>
        <div className="equation-card" role="group" aria-labelledby="research-survivor-diagnostic">
          <span id="research-survivor-diagnostic">辅助诊断 · 只在原 Anchor 存续的窗口比较 Gap</span>
          <div>𝓡<sup>surv</sup><sub>h</sub>:=&#123;(i,t)∈𝓡:τ<sup>comp</sup><sub>i,t</sub>&gt;h，且完整观测至 t+h&#125;<br />在 𝓡<sup>surv</sup><sub>h</sub> 上：　g<sub>i,t+h</sub>−g<sub>i,t</sub>=a<sub>i</sub>+d<sub>t</sub>+β<sub>h</sub>Z<sup>cap</sup><sub>i,t</sub>+ϑ<sub>h</sub>g<sub>i,t</sub>+G<sub>h</sub>W<sub>i,t</sub>+ε<sub>i,t,h</sub></div>
          <p>β_h&gt;0 只描述“原 anchor 存续且完整观测至 h”的 entries 中，平均绝对 gap 增加。若 capacity shock 会改变 break／revision 概率，这个存续集合已经经过处理后选择，所以 β_h 只能作辅助诊断，不能冒充总体 gap effect、总体收敛概率或 duration。</p>
        </div>
        <div className="precision-note">
          <span>进阶边界 · 第二遍再处理估计方法</span>
          <p>右删失不能编码成“未收敛”，需采用与删失机制相容的 IPCW、离散时间 hazard 或 cumulative-incidence 方法；各类竞争事件的累计发生率必须并列报告。Deal break 与 anchor revision 会终止原收敛命题；强制清算若被定义为另一事件就进入 competing-risk／multistate 设计，若被定义为 capacity shock 的中介就不能当普通控制变量。若要估计总体 gap effect，需另行预注册 composite endpoint、restricted-mean gap burden、principal-stratum 或 multistate estimand。α_i 只有在同一对象有多个合格 entry t 时才可识别；每个对象只有一次事件时，应移除对象固定效应并改用匹配、分层或预处理协变量设计。任何这些方法名都不能自动解决 shock endogeneity。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>对象：</b>优先用 contract anchor 较强的 carve-out、ETF/NAV、deliverable basis 或明确换股事件；使用 executable bid/ask。</li>
          <li><b>第一阶段：</b>证明 Z_cap → q_target下降 → actual fill沿退出方向，而不是只有价格与资本 proxy 同期变化。</li>
          <li><b>时间：</b>capital shock 必须先于 position 和 gap；fundamental news、halt、deal break 与 anchor revision 分开编码。</li>
          <li><b>对照：</b>未持有该 trade、不同 funding tenor 或不同 capital stickiness 的主体提供异质处理。</li>
          <li><b>否证：</b>若实际仓位未降、gap 同速收敛、结果只存在 midpoint/stale quote，或 anchor revision 完全解释 gap，应削弱或否定机制。</li>
        </ol>
        <p>
          Event study、difference-in-differences 与 multiple-rule search 都有条件；需要检验 pre-trends、composition、serial dependence 和 data snooping，而不是用方法名代替识别。<Cite n={53} /><Cite n={54} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">52 · Arbitrage-capital Survival Lab</p>
        <h2>十组冻结参数先区分严格套利、claims equivalence、no-arbitrage band、路径与 short carry，再核算 haircut、delegated flow、共同清算、paired fills 和 short-squeeze 证据。</h2>
        <p>
          每题先写对象、方向、单位和时钟。错误项分别对应把相似证券当同一索赔、把 screen spread 当净利润、把终点正确当路径无风险、把 margin 当损失、把 target 当 fill，以及从 short interest／volume 跨越到唯一因果。
        </p>
        <ArbitrageCapitalLab />
        <div className="print-only">互动实验在打印版中隐藏。请改做下一节十道同源静态变式；打印时答案会展开。浏览器无 JavaScript 时也可直接使用静态题与理解检查。</div>
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">53 · 主动练习 · 十道静态变式</p>
        <h2>换一组 claims、cost、basis、haircut、capital、depth 或 paired fills 后脱离选项重算，确认你掌握的是账本和反馈，而不是互动题答案位置。</h2>
        <div className="practice-grid">
          {arbitrageCapitalScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id + '-static'}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-interfaces">
        <p className="section-kicker">54 · 理解检查、Glossary 与误区修复</p>
        <h2>如果不能在不看公式时分开终点收益、路径生存、资本 capacity 和实际成交，就还没有真正理解“为什么明显错价可以持续”。</h2>
        <details className="understanding-check"><summary>01 · 纯套利与 convergence trade 的最短区别？</summary><p>纯套利在允许状态下不亏并至少一处严格获利；convergence trade 只有条件期望或合同关系支持收敛，仍有 fundamental、path、implementation 和 funding risk。</p></details>
        <details className="understanding-check"><summary>02 · 为什么 mispricing 不能直接观察？</summary><p>Fundamental value 或正确复制组合依赖模型、合同调整和信息集；屏幕上只能观察 price、NAV、basis 或 model residual。越弱的 anchor，语言越应保守。</p></details>
        <details className="understanding-check"><summary>03 · Noise-trader risk 不要求终点永不回归吗？</summary><p>不要求。关键是 gap 可以在资本时钟到期前先扩大，使正确终点的持仓者被 margin、赎回或风险限额迫使退出。</p></details>
        <details className="understanding-check"><summary>04 · No-trade region 怎样形成？</summary><p>Raw gap 必须穿透 bid/ask、impact、borrow、funding、tax、settlement、model buffer 与 tail loss；这些成本随规模和状态变化，所以带宽不是常数。</p></details>
        <details className="understanding-check"><summary>05 · Margin call 为什么不等于经济损失？</summary><p>经济损失由 marks 和 cash flows进入NAV；margin call 是需要交付现金/抵押品的流动性需求。若同一 mark loss已计入NAV，再把call扣作损失会重复计量。</p></details>
        <details className="understanding-check"><summary>06 · Shleifer–Vishny 何时最可能产生 liquidation？</summary><p>套利者已 fully invested、gap继续向不利方向扩大、资金供给对近期业绩足够敏感时。部分反转后的正业绩与inflow反而可能加快收敛。</p></details>
        <details className="understanding-check"><summary>07 · 1&lt;κ&lt;2 为什么不是必然发散？</summary><p>只在冻结常数κ、齐次无冲击的局部系统中，离散系数1−κ落在−1到0之间，gap会换号过冲但绝对值衰减；κ=2是不衰减振荡，κ&gt;2才换号发散。时变κ与外部冲击需要另行检验。</p></details>
        <details className="understanding-check"><summary>08 · Treasury basis 为什么不能用 futures−cash 原始相减？</summary><p>必须对齐CTD、conversion factor、delivery option、coupon、term-repo carry、期限和执行；官方仓位数据也只能近似识别likely basis trades。</p></details>
        <details className="understanding-check"><summary>09 · Crowding 何时从稳定器变成放大器？</summary><p>共同持仓先提高纠偏资本；只有common loss击中binding constraints并产生同向actual fills，才经有限depth放大价格。</p></details>
        <details className="understanding-check"><summary>10 · Target、order 与 fill 为什么必须分开？</summary><p>Target是模型期望状态，order是候选/发送数量，fill才改变actual position并可能冲击价格；两腿partial fill还留下真实leg risk。</p></details>
        <details className="understanding-check"><summary>11 · 高 short interest 能推出什么、不能推出什么？</summary><p>它可以提示squeeze vulnerability；不能给出何时回补、回补买量占比、dealer净Gamma或价格变化的唯一原因。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪 capital-loss persistence 机制？</summary><p>若capital shock没有导致actual convergence position/fill下降，或gap变化完全由anchor revision解释，或可执行价格上没有结果，机制就被削弱。</p></details>
        <div className="glossary-grid">
          <article><span>Claim equivalence</span><p>每个状态、时点、货币、法律优先级和交割下相同的现金流索赔。</p></article>
          <article><span>Executable basis</span><p>完成合同、carry、bid/ask 与实施调整后，可按方向成交的标准化gap。</p></article>
          <article><span>Noise-trader risk</span><p>非基本面需求在收敛前继续恶化并制造路径亏损的风险。</p></article>
          <article><span>Haircut</span><p>融资资产价值中必须由自有/合格资本承担的比例。</p></article>
          <article><span>Dry powder</span><p>为未来 adverse state 保留且真实可部署的资本，不等于全部未投资现金。</p></article>
          <article><span>Shadow price</span><p>放松一单位 binding capital/borrow/risk constraint 带来的边际目标价值。</p></article>
          <article><span>Slow-moving capital</span><p>因专业化、尽调、授权和组织摩擦而不能瞬间跨市场迁移的资本。</p></article>
          <article><span>Forced liquidation</span><p>由约束而非观点改变驱动、并经真实fills减少仓位的交易。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">55 · 课程接口、核心首读路线与最小复述</p>
        <h2>本节向后续课程交付的不是“市场总会无效”，而是一套条件状态机：候选错价何时吸引稳定资本，何时因资本受损转成反向订单，以及需要什么证据区分两者。</h2>
        <div className="interface-grid">
          <article><span>连接 2.16</span><h3>VaR / Risk Limit</h3><p>输出 q_risk 作为 capacity 上限；2.16 展开模型、threshold、breach 与 governance。</p></article>
          <article><span>连接 2.17</span><h3>Redemption</h3><p>输出 performance loss 与资本需求；2.17 解释投资者赎回和 liquidity mismatch。</p></article>
          <article><span>连接 2.18–2.19</span><h3>Benchmark / Crowding</h3><p>输出评价规则与共同退出接口；后续拆 formation、measurement 和 overlap。</p></article>
          <article><span>连接 6.12</span><h3>Mispricing Persistence</h3><p>本节条件于候选gap存在；6.12解释信念、叙事与制度怎样持续生成它。</p></article>
          <article><span>连接 7.11</span><h3>Funding Constraint</h3><p>本节是单trade／单capital pool；7.11聚合成跨主体 funding–market-liquidity loop。</p></article>
          <article><span>连接 7.17</span><h3>Causal Identification</h3><p>把capital shock→position fill→gap写成可证伪第一阶段，而不是同期proxy相关。</p></article>
        </div>
        <div className="precision-note">
          <span>75–90 分钟核心首读</span>
          <p>第一遍按 00–09 → 17 → 22–30 → 33–38 → 42–43 → 46–50 → 51 的自然语言例子与步骤 A → 54，先掌握对象、资本账本和反馈符号；31–32 的优化、36 与 43 的稳定域、51 的回归与进阶边界、完整案例和文献放到第二遍。</p>
        </div>
        <p>
          最小复述应是：<b>套利先要证明索赔和时钟等价，再把 raw gap 改写成可执行、扣 carry 的 basis。专业资本以 actual position 按市价承受路径损益，NAV、free collateral、borrow、margin、flows、depth 和 mandate 共同限制 q；正常状态下 gap 扩大吸引 convergence fills 并形成负反馈，受损状态下 wealth effect 与 capacity loss 可能迫使卖 cheap／买 rich，形成正反馈。Mispricing、capital 和 crowding 都是带误差的代理；没有 constraint hit、actual order/fill 与 price response，就不能把价格持久或危机写成套利资本的已证因果。</b>
        </p>
      </section>
    </>
  );
}

export const lesson215: LessonRecord = {
  slug: '2-15',
  id: '2.15',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Arbitrage Capital 与 Limits to Arbitrage：从“看见错价”到能活到收敛',
  subtitle: '先证明索赔等价并构造可执行 basis，再把路径亏损、borrow、haircut、funding、delegated flows、实际成交与有限深度放进同一本资本状态机，解释套利何时稳定价格、何时反而放大偏离',
  readingTime: '核心首读路径约 75–90 分钟（先读对象、资本账本与反馈符号，复杂稳定域和案例第二遍精读），完整正文约 145–180；互动实验首次完成 25–35／含复盘 40–50，主动练习核对 20–30／完整书写 35–45，理解检查快速 12–15／完整复述 20–25，课程接口约 5 分钟；核心学习约 137–175 分钟，完整学习约 245–305 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: '1.19；建议回看 1.09、1.20–1.21、2.07 与 2.09；按需调用 T01、T03–T04、T06–T08',
  updatedAt: '2026-08-30',
  revision: '2.15-r6',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.15-r6',
      summary: '独立复核 56 节、26 张公式卡、10 道互动题与 10 道静态变式、55 条来源和 135 个引文落点，并逐项核验严格套利与 convergence trade、统一 gap／P&L 单位、AR 与 κ 稳定域、均值—方差需求及 capacity 边界、资本账本、Treasury basis／GameStop 因果边界，以及 competing-risk、右删失与 survivor estimand；类型、规范、构建、HTTP、静态不变量与冻结哈希均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.15-r6',
      summary: '独立复核零背景对象／单位／时钟桥、从候选错价到资本反馈的六阶段递进、56 项目录、分层首读路线、收敛事件自然语言案例与分步研究协议、10+10 题、12 道理解检查及 6+7+7 阅读路径，并检查无默认答案、键盘／ARIA／焦点、本地保存与损坏恢复、无脚本、打印、移动端和 reduced-motion 降级；构建、HTTP 与冻结哈希均一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-14', label: '2.14 Options / Volatility Trader' },
  next: { slug: '2-16', label: '2.16 VaR、Risk Budget 与 Risk Limit' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与边界' },
    { id: 'state-chain', label: '完整状态链' },
    { id: 'textbook-arbitrage', label: 'Textbook Arbitrage' },
    { id: 'convergence-trade', label: 'Convergence Trade' },
    { id: 'mispricing-latent', label: 'Mispricing 是潜变量' },
    { id: 'anchor-catalyst', label: 'Anchor 与 Catalyst' },
    { id: 'agent-objective', label: 'Agent Objective' },
    { id: 'capital-state', label: 'Capital State' },
    { id: 'four-clocks', label: '四个时钟' },
    { id: 'fundamental-risk', label: 'Fundamental Risk' },
    { id: 'noise-trader-risk', label: 'Noise-trader Risk' },
    { id: 'path-loss-probability', label: '路径亏损概率' },
    { id: 'synchronization-risk', label: 'Synchronization Risk' },
    { id: 'horizon-mismatch', label: 'Horizon Mismatch' },
    { id: 'model-anchor-risk', label: 'Model / Anchor Risk' },
    { id: 'implementation-leg-risk', label: 'Implementation / Leg Risk' },
    { id: 'no-trade-region', label: 'No-trade Region' },
    { id: 'borrow-fee-risk', label: 'Borrow 与 Fee Risk' },
    { id: 'recall-squeeze', label: 'Recall 与 Short Squeeze' },
    { id: 'jump-default-settlement', label: 'Jump / Settlement' },
    { id: 'depth-capacity', label: 'Depth 与 Capacity' },
    { id: 'path-survival', label: 'Path Survival' },
    { id: 'nav-ledger', label: 'NAV Ledger' },
    { id: 'gross-net-leverage', label: 'Gross / Net / Leverage' },
    { id: 'margin-haircut', label: 'Margin 与 Haircut' },
    { id: 'funding-rollover', label: 'Funding 与 Rollover' },
    { id: 'delegated-management', label: 'Delegated Management' },
    { id: 'performance-based-arbitrage', label: 'Performance-based Arbitrage' },
    { id: 'slow-moving-capital', label: 'Slow-moving Capital' },
    { id: 'capital-supply-curve', label: 'Capital Supply Curve' },
    { id: 'unconstrained-demand', label: 'Unconstrained Demand' },
    { id: 'capacity-shadow-price', label: 'Capacity / Shadow Price' },
    { id: 'treasury-basis-balance-sheet', label: 'Treasury Basis Ledger' },
    { id: 'short-book-balance-sheet', label: 'Short-book Capital' },
    { id: 'normal-convergence', label: '正常收敛负反馈' },
    { id: 'convergence-speed', label: 'Convergence Speed' },
    { id: 'wealth-effect', label: 'Wealth Effect' },
    { id: 'margin-feedback', label: 'Margin Feedback' },
    { id: 'redemption-interface', label: 'Redemption 接口' },
    { id: 'evaluation-interface', label: 'Evaluation 接口' },
    { id: 'crowding-interface', label: 'Crowding 接口' },
    { id: 'endogenous-liquidation', label: 'Endogenous Liquidation' },
    { id: 'feedback-denominator', label: '反馈分母' },
    { id: 'predatory-reentry', label: 'Predatory / Re-entry' },
    { id: 'heterogeneous-capital', label: 'Heterogeneous Capital' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'carveout-evidence', label: 'Carve-out Evidence' },
    { id: 'treasury-basis-case', label: 'Treasury Basis Case' },
    { id: 'short-squeeze-case', label: 'GameStop Case' },
    { id: 'evidence-ladder', label: 'Evidence Ladder' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'checks-interfaces', label: '理解检查与 Glossary' },
    { id: 'interfaces-reading', label: '课程接口与首读路线' },
  ],
  Content: Lesson215Content,
  references: lesson215References,
  readingList: lesson215ReadingList,
};
