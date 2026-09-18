import RiskLimitLab from '../components/RiskLimitLab';
import { riskLimitScenarios } from '../components/riskLimitScenarios';
import { lesson216ReadingList, lesson216References } from './lesson-2-16-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson216Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>风险度量 ≠ 风险授权 ≠ 交易指令：VaR 或 ES 把一个冻结条件下的损失分布压缩成数字，risk budget 分配组织愿意使用的风险空间，risk limit 划出有权边界；任何一项都不会自动生成卖单。</h2>
        <p>
          一家机构可以没有改变对资产价值的判断，却因为价格、波动率、相关性、曲面、模型、数据、净额资格或限额版本变化而出现更高的 risk usage。可这只完成了“状态变了”的第一步。本节的综合机制框架要求系统先确认仓位与时间戳、识别适用边界、区分 warning 与 breach，再由有权限的人在修复数据、停止增险、对冲、风险转移、补资本或流动性、减仓、重配限额和临时例外之间选择；不同制度只允许其中适用且获授权的行动。即使最终选择降低头寸，多头通常卖出，空头通常买回，期权组合也可能通过<b>买入</b>保护来降险。把“超限”直接翻译成“被迫抛售”，会跳过整个治理与执行系统。<Cite n={2} /><Cite n={3} /><Cite n={32} /><Cite n={34} /><Cite n={59} />
        </p>
        <div className="precision-note">
          <span>先用五个最小定义进入本节</span>
          <p><b>VaR</b> 是模型损失分布的一处分位门槛；<b>ES</b> 是最坏那段概率质量的平均损失；<b>risk budget</b> 是组织计划分给某业务的风险空间；<b>risk limit</b> 是带权限和处置后果的正式边界；<b>usage</b> 是当前状态按批准口径对这条边界的占用。后文会逐一严格化，现在只需先把“测得多少、允许多少、已经用了多少”分开。</p>
        </div>
        <p>
          本节因此建立一套可审计的 <b>risk-control ledger</b>。每个风险数字必须携带 position、valuation、data/model vintage、horizon、confidence、currency、legal entity、netting set 和 limit version；每次处置必须从 alert 走到 validation、authority、target、order、fill、revaluation 与 closure。你最终获得的不是一个“VaR 计算器”，而是一张解释风险数字如何进入组织、怎样约束行为、何时又反过来改变市场状态的完整地图。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与学习路线</p>
        <h2>硬先修是 T03；建议回看 T06、1.20、2.11–2.12、2.14–2.15。这里研究单一机构怎样计量、授权、监控和处置市场风险，不重新教授波动目标、ERC 优化、保证金生存或系统性杠杆循环。</h2>
        <div className="learning-objectives">
          <span>导论＋六阶段路线 · 从损失随机变量到可验证治理闭环</span>
          <ol>
            <li><b>对象与语言（00–11）：</b>冻结状态、P&amp;L 符号、条件分布、quantile、confidence、horizon 与 VaR 边界。</li>
            <li><b>计量方法（12–24）：</b>区分参数、历史、Monte Carlo、full repricing、聚合、ES、liquidity horizon 与 model risk。</li>
            <li><b>授权结构（25–36）：</b>由 capacity、appetite、budget 进入完整 limit、usage、headroom、多约束和法律实体。</li>
            <li><b>治理状态机（36–44）：</b>由 authority、alert、validation、remediation、exception 走到真实 order、fill 与 retest。</li>
            <li><b>验证与压力（45–53）：</b>回测 exceedance、P&amp;L 口径、stress、reverse stress、模型治理、顺周期与历史失败。</li>
            <li><b>迁移与研究（54–57）：</b>完成 10+10 道练习、12 道理解检查、可证伪协议、术语和章节接口。</li>
          </ol>
        </div>
        <p>
          2.11 已拥有 volatility estimate → target multiplier → actual order/fill；2.12 已拥有组合风险贡献和预算权重；2.15 已拥有 NAV、haircut、funding 与 survival capacity。2.16 只接收这些状态，回答“哪一种损失度量在什么口径下占用多少正式授权，以及越界后如何闭环”。赎回现金瀑布留给 2.17，benchmark 与 tracking 留给 2.18，crowding 留给 2.19，多机构同步反馈留给 7.08 与 7.12。
        </p>
      </section>

      <section className="lesson-section" id="control-ledger">
        <p className="section-kicker">02 · Risk-control Ledger</p>
        <h2>“VaR 是 800 万”不是完整陈述；只有能重建对象、口径、版本和权限的数字，才可能成为有效控制。</h2>
        <div className="precision-note">
          <span>30 秒账户例子 · 先读数字，再读符号</span>
          <p>某账户实际持有 20m 多头；批准口径算出的 VaR usage 为 4.6m；warning 为 4.5m，hard limit 为 5.0m。因此 hard-limit headroom=5.0−4.6=0.4m，当前是 <b>warning</b> 而不是 breach。仓位、市场或模型变化后 usage 才会重算；4.6m 既不是已经亏掉的钱，也不是最大可能损失。</p>
        </div>
        <div className="equation-card">
          <span>风险状态元组</span>
          <div>S<sub>t</sub>=(q<sub>t</sub>, z<sub>t</sub>, V, θ<sub>t</sub>, D<sub>t</sub>, h, α, c, e, N<sub>t</sub>, Λ<sub>t</sub>, G<sub>t</sub>)</div>
          <p><b>这是第二遍形式化表示。</b>q 是实际仓位，z 是市场状态，V 是定价引擎，θ 与 D 是模型参数和数据版本，h 与 α 是持有期和置信水平，c 是报告币种，e 是法律实体，N 是可执行净额规则，Λ 是有效限额集合，G 是治理规则。任一字段变化，都可能使同一仓位得到不同 usage。</p>
        </div>
        <p>
          账本还要同时保留 <b>forecast vintage</b> 和 <b>realization vintage</b>。昨天收盘生成的一日 VaR 必须与今天按预先定义口径产生的损失比较，不能用今天重估后的参数回写昨天预测；限额也不能在超限后回溯提高，从而让历史 breach 消失。BCBS 239 把准确性、完整性、及时性、适应性与治理放在同一数据聚合框架内，而 2023 年实施评估仍记录显著缺口，说明“有风险报表”和“能可靠重建风险状态”并非同一件事。<Cite n={29} /><Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="state-chain">
        <p className="section-kicker">03 · 完整状态转移链</p>
        <h2>风险控制不是 position → VaR → sell 的三步捷径，而是从估值与情景生成，经授权判断、原因诊断和可行处置，最终回到新仓位与新风险数字的闭环。</h2>
        <div className="causal-chain" aria-label="风险计量、治理与交易的完整状态链" role="list">
          <div role="listitem"><span>01</span><b>Actual state</b><p>仓位、合约、市场、曲面与现金流。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Risk engine</b><p>数据、模型、情景、估值与版本。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Usage vector</b><p>VaR、ES、stress、Greeks、集中度、流动性。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Control state</b><p>normal、warning、alert 或 confirmed breach。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Validation</b><p>核对数据、模型、限额、范围与严重度。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Authority</b><p>升级、时钟、候选行动与批准。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>07</span><b>Execution</b><p>target → order → fill、成本与冲击。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>08</span><b>Retest</b><p>新仓位、新 usage、headroom 与 closure。</p></div>
        </div>
        <p>
          链条刻意把<b>风险事实</b>与<b>组织选择</b>分开。模型可以计算“如果状态保持这样，损失分布怎样”；它不能回答董事会愿意承担多少风险。限额可以规定“谁不得越过哪条边界”；它不能保证市场里有足够深度完成修复。在依赖交易的处置中，订单只表达意图，只有成交才改变 actual position；到期、行权和现金流等非交易合约事件则要另行入账。每一个箭头都有失败模式，因而每一步都需要时间戳和证据。
        </p>
      </section>

      <section className="lesson-section" id="loss-sign">
        <p className="section-kicker">04 · P&amp;L、Loss 与现金流符号</p>
        <h2>VaR 的第一个常见错误不是高深统计，而是把盈利和损失的符号、carry 与期间现金流混在一起。</h2>
        <div className="equation-card">
          <span>全文统一符号</span>
          <div>Y<sub>t,h</sub>=V<sub>t+h</sub>−V<sub>t</sub>+CF<sub>t,t+h</sub>；　L<sub>t,h</sub>=−Y<sub>t,h</sub></div>
          <p>Y 是 P&amp;L，正数为盈利；L 是 loss，正数为亏损。V 必须使用一致币种和估值范围，CF 包括票息、分红、费用、融资、期权行权和其他期间现金流。若先在 P&amp;L 上算下分位，再报告正 VaR，必须明确进行符号转换。</p>
        </div>
        <p>
          “风险期限 h”同时决定哪些价格变化和现金流进入随机变量。期权离到期还有三日，却用十日静态持仓损益；债券收到票息却只比较 dirty/clean price；跨币种仓位用本币资产变动但遗漏 FX——这些都会让一个形式正确的分位数对应错误经济对象。Jorion 与 RiskMetrics 的工程框架都有价值，但任何实现都必须先冻结本机构的 valuation/P&amp;L convention。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="valuation-map">
        <p className="section-kicker">05 · 从持仓到情景 P&amp;L</p>
        <h2>风险模型至少由两层组成：先生成联合风险因子情景，再把每个情景映射成组合损益；“历史、参数、Monte Carlo”与“delta、full repricing”并非同一维度上的四选一。</h2>
        <div className="equation-card">
          <span>冻结组合的情景损失</span>
          <div>L<sub>s</sub>=V(q,z<sub>t</sub>,t)−[V(q,z<sub>t</sub>⊕Δz<sub>s</sub>,t+h)+CF<sub>s</sub>]</div>
          <p>情景 s 指定联合因子冲击 Δz；⊕ 表示按预注册规则施加绝对或相对冲击。V 对冲击后的曲线、波动曲面、FX 和时间流逝重估同一 actual position。随后才对一组 L_s 求分位数或尾部平均。</p>
        </div>
        <p>
          因此可以有“历史情景 + full repricing”“Monte Carlo 路径 + full repricing”或“参数分布 + delta-gamma”。Full repricing 改善非线性估值映射，却不能修复错误的情景分布、漏掉的风险因子、错误的定价模型或不可信现金流。反过来，完美模拟联合因子也救不了一套把 barrier option 当线性债券的估值映射。
        </p>
      </section>

      <section className="lesson-section" id="conditional-distribution">
        <p className="section-kicker">06 · 条件损失分布</p>
        <h2>风险数字描述的是“在 t 时的信息、模型与持仓条件下，未来 h 的损失怎样分布”，不是一张关于未来真相的完整地图。</h2>
        <div className="equation-card">
          <span>条件对象</span>
          <div>F<sub>t,h</sub>(ℓ)=P(L<sub>t,h</sub>≤ℓ | 𝓕<sub>t</sub>, q<sub>t</sub>, θ<sub>t</sub>, D<sub>t</sub>)</div>
          <p>𝓕_t 是决策时可用信息。模型以历史样本、参数或模拟近似 F，但 F 本身不是可直接观察的屏幕字段。明天只实现一个损失，而不是整条分布；重复样本、回测与压力证据才可能逐步检验模型。</p>
        </div>
        <p>
          “99% VaR”中的 99% 不是模型有 99% 概率正确，也不是账户有 99% 概率盈利。它只是在冻结的条件分布上指定一个切点。若市场制度、仓位策略、流动性或相关性结构改变，旧分布不再是新状态的无条件真理。模型风险既来自错误模型，也来自把合理模型用于错误对象、错误期限或错误决策。<Cite n={21} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="quantile">
        <p className="section-kicker">07 · Quantile：先定位尾部入口</p>
        <h2>分位数回答“损失分布走到哪里累计了 α 的概率质量”，不回答越过门槛后会损失多少，也不保证门槛点上没有概率质量。</h2>
        <div className="equation-card">
          <span>左分位（generalized inverse）</span>
          <div>Q<sub>α</sub>(L)=inf&#123;ℓ∈ℝ : P(L≤ℓ)≥α&#125;</div>
          <p>inf 表示满足累计概率至少为 α 的最小损失值。这个定义适用于连续、离散与混合分布；经验样本中的取整与插值必须另行固定。</p>
        </div>
        <p>
          若 96% 情景损失为 0、4% 情景损失为 10，那么 95% quantile 是 0，而 P(L&gt;0)=4%，并非机械等于 5%。有质量点时一般只能保证 P(L&gt;Q_α)≤1−α；精确等号的关键是 F(Q<sub>α</sub>)=α。对 α∈(0,1) 的有限左分位，F 在 Q<sub>α</sub> 处连续已经足够，局部严格递增是更强但非必要的条件；平坦区间本身也不破坏等式。真正需要直接核对 F(Q<sub>α</sub>) 的是原子／跳跃等不连续情形。这个细节决定了为什么离散信用、违约或情景集合里不能用连续直觉偷换定义。<Cite n={5} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="confidence-level">
        <p className="section-kicker">08 · Confidence Level</p>
        <h2>提高 α 会把门槛推向更坏尾部，却同时减少可用于估计和验证的有效尾部观测；“更保守”与“更精确”不是同义词。</h2>
        <div className="equation-card">
          <span>有限样本的尾部信息量</span>
          <div>Expected tail observations ≈ N(1−α)</div>
          <p>250 个等权日损失下，95% 尾部约有 12.5 个观测，99% 尾部只有 2.5 个。经验分位数还需决定取整或插值；数据频率更高也不自动提供独立同分布的更多极端状态。</p>
        </div>
        <p>
          99% 一日 VaR 与 97.5% 十日 ES不是“保守程度几乎相同”的通用陈述：度量函数、期限与分布都不同。标准正态下两个系数偶然接近——z<sub>.99</sub>≈2.326，而 ES<sub>.975</sub> 的尾部系数约 2.338——离开正态后差异可以很大。现行 Basel IMA 使用 97.5% 单尾 ES，同时仍保留 99% VaR backtesting 用于模型资格与资本乘数；这是特定监管架构，不是定义上的等价。<Cite n={25} /><Cite n={26} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="holding-period">
        <p className="section-kicker">09 · Holding Period</p>
        <h2>一日、十日和二十日 VaR 描述不同随机变量；期限应连接治理反应、仓位变化、退出能力和估值现金流，而不是作为数字旁的装饰。</h2>
        <p>
          一日 VaR 适合频繁重算，不代表机构一定能在一天内退出；二十个交易日 VaR 可以服务某项规则，也不代表仓位必须静态持有二十天。短期限容易遗漏不能及时退出的风险，长期限若机械冻结组合则又可能偏离实际对冲与现金流。严谨报告必须同时说明 risk horizon、rebalancing assumption、liquidity horizon 和 monitoring frequency。
        </p>
        <div className="precision-note">
          <span>规则实例而非普遍定义</span>
          <p>美国 Rule 18f-4 对须遵守该规则 paragraph (c)(2) VaR test 的基金规定模型使用 99% 置信水平、20 个交易日期限与至少三年历史数据，并至少每个营业日判断合规；limited derivatives users 等另有豁免或例外，不能把参数推广到所有 Rule 18f-4 基金。这些参数只属于该规则的具体控制设计。Basel IMA 则以十日为基础期限并按风险因子的 liquidity horizon 聚合。两套制度都不能被改写成“所有 VaR 都应取某个期限”。<Cite n={27} /><Cite n={59} /></p>
        </div>
      </section>

      <section className="lesson-section" id="var-definition">
        <p className="section-kicker">10 · Value at Risk 的正式定义</p>
        <h2>VaR 是损失分布的分位点：在冻结口径下，它给出达到指定累计概率所需的最小损失门槛。</h2>
        <div className="equation-card">
          <span>VaR</span>
          <div>VaR<sub>α,t,h</sub>(L)=inf&#123;ℓ∈ℝ : P<sub>t</sub>(L<sub>t,h</sub>≤ℓ)≥α&#125;</div>
          <p>下标必须至少含 α、生成时点 t 和持有期 h；实际系统还要携带币种、范围、模型与数据版本。若将负 VaR 截断为零作为 usage，需要把 floor rule 作为治理转换披露，而不能伪装成数学定义。</p>
        </div>
        <p>
          在某些低风险或预期盈利分布下，VaR 可以为负，含义是在该模型的 α 分位点上仍是盈利，而不是“风险不存在”。VaR 也不自动等于资本、保证金、最大损失或可接受损失；这些是另外的授权、资源或合约对象。RiskMetrics 推动了 VaR 的工程化，Jorion 系统化了其机构使用，但两者都不能替代当前适用法律、内部治理和产品特定估值。<Cite n={1} /><Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="var-not">
        <p className="section-kicker">11 · VaR 没有承诺什么</p>
        <h2>VaR 不告诉你尾部平均严重度、最坏可能损失、事件路径、可退出价格或模型外状态；它也不能凭自己决定风险是否值得承担。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="VaR 常见误读修复表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>误读</th><th>为什么错</th><th>需要补什么</th></tr></thead>
            <tbody>
              <tr><td>“99% VaR 是最大损失”</td><td>剩余尾部仍可无限或非常大</td><td>ES、stress、极端情景和 exposure caps</td></tr>
              <tr><td>“VaR 低就是安全”</td><td>遗漏因子、错误净额与过期数据会压低数字</td><td>数据、模型验证与独立约束栈</td></tr>
              <tr><td>“VaR 是止损”</td><td>一项是分布函数，一项是交易/治理规则</td><td>明确 trigger、authority、order 与 fill</td></tr>
              <tr><td>“没 breach 就不会亏”</td><td>limit 是授权边界，不是损失保险</td><td>实际 P&amp;L、capacity 与 stress state</td></tr>
              <tr><td>“VaR 降低就一定降总风险”</td><td>对冲可能增加 basis、liquidity 或 concentration</td><td>多指标 post-trade revaluation</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          风险指标的价值来自压缩复杂度，使组织能在时间压力下比较、分配和升级；它的危险也来自同一压缩。一旦使用者忘记被丢弃的信息，精确到小数点后的数字会制造虚假确定性。因此任何 VaR 看板都应与假设、数据 freshness、模型局限、stress 与关键暴露并列。
        </p>
      </section>

      <section className="lesson-section" id="parametric-var">
        <p className="section-kicker">12 · Parametric / Delta-normal VaR</p>
        <h2>参数法用少量分布参数概括联合损失；在线性正态世界里计算透明，但其效率来自强假设，而不是来自更接近真实尾部。</h2>
        <div className="equation-card">
          <span>正态损失的 VaR 与 ES</span>
          <div>L∼N(μ<sub>L</sub>,σ²)，σ&gt;0：　VaR<sub>α</sub>=μ<sub>L</sub>+z<sub>α</sub>σ；　ES<sub>α</sub>=μ<sub>L</sub>+σφ(z<sub>α</sub>)/(1−α)</div>
          <p>z_α 是标准正态 α 分位，φ 是密度函数。若输入的是 P&amp;L 均值 μ_Y，则 μ_L=−μ_Y。短期系统常把均值近似为零，这是一项可检验近似，不是定义。</p>
        </div>
        <div className="equation-card">
          <span>线性因子映射</span>
          <div>ΔV≈δ<sup>⊤</sup>Δz，　Δz∼N(μ,Σ)，　σ<sub>L</sub>=√(δ<sup>⊤</sup>Σδ)</div>
          <p>δ 的单位把因子冲击映射成货币 P&amp;L；Σ 必须与因子单位、频率和时间戳一致。近似适用于局部平滑、固定 Greeks、没有显著跳跃和非线性尾部的组合。</p>
        </div>
        <p>
          RiskMetrics 的 variance–covariance 与 EWMA 是经典工程范式：低维、快速、容易分解。代价是相关性与波动率被少数参数概括，正态尾部、线性映射和动态稳定性都可能在压力中失效。使用它并不错误；错误是隐藏假设，或在 options、credit jumps 与 illiquid positions 上仍把局部公式当完整损失引擎。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="historical-simulation">
        <p className="section-kicker">13 · Historical Simulation</p>
        <h2>历史模拟保留历史日的联合冲击与非正态形状，但把“过去窗口里出现过什么”当作“当前组合下一期会怎样”的样本代理。</h2>
        <div className="equation-card">
          <span>一种透明的经验分位约定</span>
          <div>L<sub>(1)</sub>≤…≤L<sub>(N)</sub>；　VaR̂<sub>α</sub>=L<sub>(⌈Nα⌉)</sub></div>
          <p>先用每个历史联合因子变化重估当前组合，再对 N 个损失排序。⌈·⌉ 是向上取整；其他软件可能插值，因此实现、回测和限额系统必须使用同一分位约定。</p>
        </div>
        <p>
          方法避免预设正态，却没有消除模型：窗口长度、历史时期、权重、数据清洗、缺失日、当前/历史波动映射和估值函数仍是选择。长窗口含更多危机却可能混入旧制度，短窗口更“当前”却可能没有尾部。Filtered historical simulation 试图先标准化波动再按当前状态缩放，可能改善适应性，也可能通过快速提高 usage 增强顺周期。相关实证比较依赖市场、样本与估计器，不能变成普适排名。<Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="monte-carlo">
        <p className="section-kicker">14 · Monte Carlo Simulation</p>
        <h2>Monte Carlo 扩大的是由指定模型生成的情景样本，不是现实尾部本身；更多路径能降低模拟噪声，却不能消除错误分布、参数、定价和使用方式。</h2>
        <div className="equation-card">
          <span>模拟估计器</span>
          <div>z<sup>(m)</sup><sub>t+h</sub>∼M(θ<sub>t</sub>) → L<sup>(m)</sup>=ℒ(q<sub>t</sub>,z<sup>(m)</sup>) → Quantile / Tail mean，m=1,…,M</div>
          <p>M 是模拟路径数，M(θ) 是真实世界风险因子或路径模型，ℒ 是损失映射。风险管理分布通常使用 physical/real-world 视角；衍生品定价引擎可在每个状态内使用风险中性定价，两者不能混为一个概率。</p>
        </div>
        <p>
          路径模拟适合复杂期限结构、动态障碍和多因子非线性，也带来更难的依赖建模、校准、计算与验证。把路径从十万增加到一百万，可能使 Monte Carlo standard error 缩小约 √10，却不会让遗漏违约、错误 copula 或错误行为规则自行出现。模型库存、版本、独立验证和使用限制因此与计算精度同等重要。<Cite n={21} /><Cite n={36} /><Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="full-repricing">
        <p className="section-kicker">15 · Full Repricing 与非线性</p>
        <h2>期权和结构产品的风险不在一个固定 delta 中；大冲击会改变 delta、gamma、vega、相关性与现金流状态，因此需要在情景内重新估值。</h2>
        <div className="equation-card">
          <span>局部二阶展开</span>
          <div>ΔV≈δ<sup>⊤</sup>Δz + ½Δz<sup>⊤</sup>ΓΔz + Θh</div>
          <p>delta-gamma 比线性近似多保留局部曲率和时间衰减，但仍是当前点附近的 Taylor 展开；大跳跃、barrier crossing、离散行权、信用事件和路径依赖可能使展开失真。</p>
        </div>
        <p>
          Full repricing 对每个情景重新构造曲线与 surface，并以产品模型计算 V。它解决“同一情景怎样进入价格”的问题，不解决“情景概率是否正确”。此外必须说明 smile dynamics、volatility interpolation、exercise policy、default/recovery、market close synchronization 与模型 fallback；否则所谓“完全重估”仍可能只是在不完整状态空间上更精确地计算错误答案。2.14 的 Greeks 是这里的输入，不在本节重新展开交易者的 volatility thesis。
        </p>
      </section>

      <section className="lesson-section" id="horizon-scaling">
        <p className="section-kicker">16 · 平方根时间缩放</p>
        <h2>√h 不是金融自然法则，而是独立同分布、零均值、稳定方差、静态线性持仓下方差随时间相加的结果。</h2>
        <div className="equation-card">
          <span>条件性缩放</span>
          <div>Var(Σ<sup>h</sup><sub>k=1</sub>Y<sub>k</sub>)=hσ²　⇒　σ<sub>h</sub>=√h σ<sub>1</sub></div>
          <p>只有交叉协方差为零且每日方差相同，才得到 hσ²。若均值不可忽略，还要按 h 缩放均值；VaR 的均值项与波动项并非同一速度。</p>
        </div>
        <p>
          波动聚集、自相关、跳跃、期权凸性、到期现金流、动态对冲、止损、交易冲击与流动性成本都会破坏缩放。更长的 horizon 也可能允许管理层交易，使“静态持仓风险”与“动态策略实际 P&amp;L”分离。严谨做法是优先直接模拟目标期限；若因数据和算力使用 √h，应把条件和敏感性作为数字的一部分披露。<Cite n={1} /><Cite n={2} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="aggregation">
        <p className="section-kicker">17 · Portfolio Aggregation 与依赖</p>
        <h2>组合风险来自同一情景下各头寸的联合损益，不能通过独立算完再随意相加、相减或套一个恒定 diversification benefit 得到。</h2>
        <div className="equation-card">
          <span>线性组合方差</span>
          <div>σ²<sub>P</sub>=x<sup>⊤</sup>Σx=Σ<sub>i</sub>x²<sub>i</sub>σ²<sub>i</sub>+2Σ<sub>i&lt;j</sub>x<sub>i</sub>x<sub>j</sub>Cov(i,j)</div>
          <p>x 保留暴露方向与单位，Σ 是同频率、同时间戳的联合协方差。相关性只是在二阶椭圆世界里的依赖摘要；尾部共振、非线性和状态切换需要共同情景或更完整联合模型。</p>
        </div>
        <p>
          Stand-alone VaR 相加既不等于组合 VaR，也不保证总是保守，因为 VaR 一般不具备次可加性。组合聚合还必须尊重法律实体、close-out netting、币种和会计/监管范围：经济上负相关的两个头寸若不能在同一法律净额集合中抵销，就不能把统计分散化改写为可用 collateral。相反，在同一组合内硬加 stand-alone 数字会忽略真实对冲。Basel CRE50/CRE52 对 netting set 与监管认可条件的定义提供银行资本语境下的正式实例，但不能替代本机构对适用合同与当地法的法律意见。<Cite n={4} /><Cite n={8} /><Cite n={9} /><Cite n={10} /><Cite n={60} /><Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="incremental-risk">
        <p className="section-kicker">18 · Incremental Risk</p>
        <h2>候选动作的风险不是它独立存在时的 stand-alone 数字，而是把它放进当前组合后，整个 usage 真实改变了多少。</h2>
        <div className="equation-card">
          <span>指定候选动作的增量</span>
          <div>ΔU(a)=U(q+a;θ,D)−U(q;θ,D)</div>
          <p>a 是带方向、规模和工具的候选交易。先对当前 q 算 usage，再把 a 加入同一组合、以同一数据和模型重算；二者之差才是这笔动作的 incremental usage。</p>
        </div>
        <p>
          新增一项 hedge 的 stand-alone VaR 可以为正，组合 incremental VaR 却为负；反过来，一笔名义很小的 option 也可能在当前 gamma/vega 集中下显著提高 stress。用无穷小 marginal risk×交易规模作近似时，必须验证步长、局部线性和风险函数平滑性；正式 pre-trade control 应优先重估完整 post-trade portfolio。
        </p>
      </section>

      <section className="lesson-section" id="var-nonsubadditivity">
        <p className="section-kicker">19 · VaR 非次可加：可复算反例</p>
        <h2>两个单独看似“95% 不亏”的离散头寸合在一起，可能在 95% 分位出现正损失；这证明 VaR 可能违反分散化公理，却不证明所有市场风险 VaR 都违反。</h2>
        <div className="equation-card">
          <span>两个独立 Bernoulli 损失</span>
          <div>P(L<sub>i</sub>=10)=0.04，P(L<sub>i</sub>=0)=0.96；　VaR<sub>.95</sub>(L<sub>1</sub>)=VaR<sub>.95</sub>(L<sub>2</sub>)=0</div>
          <p>单个头寸的零损失概率 96% 已超过 95%，所以分位点为 0。组合零损失概率只有 0.96²=0.9216；损失不超过 10 的概率为 0.9984，因此 VaR_.95(L₁+L₂)=10&gt;0+0。</p>
        </div>
        <p>
          同一例中，按最坏 5% 概率质量计算，单个 ES 各为 8，组合 ES 为 10.32，满足 10.32≤16。反例揭示分位数对阈值附近概率质量敏感，也说明“stand-alone VaR 相加一定保守”并非定理。另一方面，在某些椭圆分布或特定高分位厚尾条件下 VaR 可以次可加；正确结论是<b>不存在无条件保证</b>，而不是“VaR 永远不次可加”。<Cite n={4} /><Cite n={8} /><Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="es-definition">
        <p className="section-kicker">20 · Expected Shortfall 的严格定义</p>
        <h2>对 E|L|&lt;∞ 的损失变量，ES 对最坏的 1−α 概率质量求平均；若上尾期望不有限，ES 可以是 +∞，不能把它呈现成必然有限的风险数字。</h2>
        <div className="equation-card">
          <span>分位积分与优化表示</span>
          <div>ES<sub>α</sub>(L)=1/(1−α) ∫<sub>α</sub><sup>1</sup>VaR<sub>u</sub>(L)du<br />ES<sub>α</sub>(L)=min<sub>ζ∈ℝ</sub>[ζ+E(L−ζ)<sub>+</sub>/(1−α)]</div>
          <p>第一式按概率质量平均最坏尾部；第二式把 ES 写成可优化的凸辅助函数。连续且分位点无质量点时，ES 才可简化为相应尾部条件均值。</p>
        </div>
        <p>
          若大量概率恰好落在 VaR 阈值，用 E[L|L≥VaR] 会把阈值上的全部质量都纳入，超过所需的 1−α 尾部。正确做法是只取足够的阈值质量完成尾部。ES 比 VaR 多描述越界后的平均严重度，却仍不是最大损失，也不自动包含市场冲击、融资枯竭、模型外事件和路径依赖。<Cite n={5} /><Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="var-vs-es">
        <p className="section-kicker">21 · VaR、ES 与 Coherence</p>
        <h2>VaR 与 ES 不是“旧指标和新指标”的简单替换：VaR 给出门槛，ES给出尾部平均；ES 具有 coherent 风险度量的分散一致性，但仍不保证估计稳健或决策正确。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="VaR 与 ES 的机制比较，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>维度</th><th>VaR</th><th>ES</th></tr></thead>
            <tbody>
              <tr><td>统计对象</td><td>α 分位门槛</td><td>最坏 1−α 概率质量的平均</td></tr>
              <tr><td>尾部严重度</td><td>门槛以外不区分</td><td>保留尾部均值，不保留完整形状</td></tr>
              <tr><td>次可加性</td><td>一般无保证</td><td>可积损失下 coherent</td></tr>
              <tr><td>估计难度</td><td>高分位样本稀少</td><td>更依赖极端尾部观测</td></tr>
              <tr><td>验证</td><td>可检验覆盖与独立性</td><td>可与 VaR 联合评价及做校准/比较检验</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Coherence 的四个词可以直译成四条一致性：损失逐状态更大时风险不能反而更小（monotonicity）；确定增加 m 的损失会让风险也增加 m（cash invariance）；在模型与市场冲击不随规模改变时，仓位放大 λ 倍、风险也放大 λ 倍（positive homogeneity）；合并组合的风险不应高于分别计量后相加（subadditivity）。它是风险函数的数学一致性，不等于对真实数据可精确估计、对所有决策可用或对所有主体公平。ES 的尾部信息更多，恰恰也意味着少量极端值与模型设定对估计影响更大。最稳健的控制不是押注一个“完美指标”，而是让不同度量覆盖彼此盲区。<Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-horizon">
        <p className="section-kicker">22 · Liquidity Horizon</p>
        <h2>市场风险不仅取决于价格会动多少，也取决于机构在压力中需要多久、以什么成本才能退出或对冲；liquidity horizon 不是承诺成交时间，也不是普通预测期限。</h2>
        <div className="equation-card">
          <span>带退出成本的情景损失</span>
          <div>L<sup>liq</sup><sub>s</sub>=L<sup>mark</sup><sub>s</sub>+SpreadCost<sub>s</sub>+Impact<sub>s</sub>+Funding/Carry<sub>s</sub></div>
          <p>mark loss 先重估经济价值，随后再加入为执行处置真实发生且未被价格损失重复包含的成本。Spread、impact 与 funding 应随规模、时间和状态变化，不能永远用正常日常数。</p>
        </div>
        <p>
          现行 Basel IMA 将风险因子分配到 10、20、40、60、120 日 liquidity horizons，并在十日基础上聚合 ES；这是压力市场下风险退出/对冲时间的监管近似，不能解释为某头寸保证在相应天数内无价格影响地成交。集中度、市场深度、交易限制与产品复杂度仍需单独控制。<Cite n={24} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="model-risk">
        <p className="section-kicker">23 · Model Risk</p>
        <h2>模型风险不只意味着公式可能错；合理模型被错误地开发、验证、解释、组合或用于超出适用域的决策，同样会产生损失。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="模型风险来源表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>层</th><th>典型问题</th><th>控制证据</th></tr></thead>
            <tbody>
              <tr><td>Concept</td><td>遗漏机制、错误概率或错误损失对象</td><td>理论依据、替代模型、适用域</td></tr>
              <tr><td>Data / parameter</td><td>陈旧、偏差、结构变化、单位错误</td><td>血缘、质量检验、敏感性</td></tr>
              <tr><td>Implementation</td><td>代码、映射、净额、版本或接口错误</td><td>测试、reconciliation、变更控制</td></tr>
              <tr><td>Validation</td><td>缺乏独立挑战或检验功效不足</td><td>benchmark、outcome analysis、限制</td></tr>
              <tr><td>Use</td><td>把指标当最大损失或绕过 overlay</td><td>使用政策、培训、监控与升级</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          五层可以各自失效，也会互相放大：错误 mapping 使 outcome test 看似异常，使用者再以“模型已验证”为由忽略限制；反过来，合理模型若被用于错误法律实体、期限或决策，也会制造高风险。模型库存和独立挑战的目的不是给公式盖章，而是让假设、用途、依赖、限制和不确定性在决策前可见。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="measure-stack">
        <p className="section-kicker">24 · Risk Measure Stack</p>
        <h2>单一指标压缩得越强，盲区越集中；有效限额体系用一组互补指标分别约束日常波动、尾部、情景、方向、集中、流动性和可执行性。</h2>
        <p>
          这里的 <b>Greeks</b> 是衍生品价值对价格、波动率、时间等风险因子的局部敏感度；<b>DV01</b> 是利率曲线移动一个基点时债券／利率组合的局部价值变化，<b>CS01</b> 是信用利差移动一个基点时的局部价值变化。它们的正负号与 bump convention 必须在制度中固定，且都只是局部近似，不是极端情景损失。
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="风险度量栈，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>控制</th><th>主要回答</th><th>典型盲区</th></tr></thead>
            <tbody>
              <tr><td>Notional / gross / net</td><td>规模和方向有多大</td><td>不同工具敏感度不可比</td></tr>
              <tr><td>Greeks / DV01 / CS01</td><td>局部因子冲击怎样进入 P&amp;L</td><td>大冲击与路径非线性</td></tr>
              <tr><td>VaR</td><td>指定分位门槛在哪里</td><td>门槛外严重度</td></tr>
              <tr><td>ES</td><td>指定尾部平均多严重</td><td>模型外状态和最大损失</td></tr>
              <tr><td>Stress</td><td>特定极端联合状态损失多少</td><td>情景之外与发生概率</td></tr>
              <tr><td>Concentration</td><td>损失是否依赖少数名字/因子</td><td>动态流动性与 hedge breakdown</td></tr>
              <tr><td>Liquidity / exit</td><td>能否在时间与成本内处置</td><td>未知冲击和合同障碍</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这些指标不能互相“转账”：VaR 有 20% headroom 不会抵消 concentration 超限；压力损失下降也不保证日常 delta 合规。约束栈的目标不是让所有数字永远低，而是让不同失败机制各有可观测触发器，并在冲突时明确哪一个是 binding constraint。
        </p>
      </section>

      <section className="lesson-section" id="risk-capacity">
        <p className="section-kicker">25 · Risk Capacity</p>
        <h2>Capacity 是在资本、流动性、运营条件、监管要求和利益相关者义务下能够承受的风险外层边界；它是多维且状态依赖的，不是一条固定 VaR 线。</h2>
        <p>
          同一机构可能有充足会计权益却缺乏日内 collateral，也可能在总资本充足时受某法律实体、币种、market depth 或 client mandate 限制。Capacity 因损失、融资条件、运营能力和制度变化而移动；2.15 已解释 NAV、haircut 与 survival，本节只把它们汇入可授权的外层集合。FSB 的风险偏好框架将 capacity 与 willingness 分离：能承担多少，不等于愿意为了战略主动承担多少。<Cite n={32} /><Cite n={33} /><Cite n={34} />
        </p>
        <div className="equation-card">
          <span>向量边界而非标量漏斗</span>
          <div>𝓒<sub>t</sub>=&#123;q : Capital(q), Liquidity(q), Legal(q), Operational(q), Stakeholder(q) 均可行&#125;</div>
          <p>Capacity 是可行集合。只有在相同范围、单位、期限和情景下，才可逐项说 appetite 不应超过 capacity；不能把不同维度压成一个无口径的“capacity ≥ appetite”数字。</p>
        </div>
      </section>

      <section className="lesson-section" id="risk-appetite">
        <p className="section-kicker">26 · Risk Appetite</p>
        <h2>Appetite 是机构在 capacity 内、为实现战略与商业计划愿意主动承担的风险类型和总量；它是治理选择，不是模型预测。</h2>
        <p>
          董事会可以在相同经济 capacity 下选择更低 appetite，因为声誉、客户承诺、战略不确定性或风险文化不同；也可在正常时期分配较高 appetite，同时为压力状态保留 buffer。风险偏好声明需要定性边界和定量指标相互解释：禁止某类活动不能被“低 VaR”绕过，一项金额 limit 也无法替代产品、地域和法律风险的定性约束。FSB 与 BCBS 的治理原则分别强调董事会、高级管理层、CRO 和业务责任，但它们不给出通用数值算法。<Cite n={32} /><Cite n={33} /><Cite n={34} />
        </p>
        <div className="precision-note">
          <span>Risk profile 不是 appetite</span>
          <p>Risk profile 是某时点实际暴露和缓释后的风险状态。Profile 低于 appetite 可能意味着有 headroom，也可能只是数据漏报；profile 高于 appetite 可能需要行动，却仍要看具体 limit、例外和时钟。愿意承担什么与已经承担什么必须分列。</p>
        </div>
      </section>

      <section className="lesson-section" id="organizational-budget">
        <p className="section-kicker">27 · Organizational Risk Budget</p>
        <h2>本节把 organizational risk budget 定义为：将 appetite 或限额空间计划分配给业务、desk、策略或风险类别的内部 envelope；它可以是规划目标，也可以进一步固化为硬限额。</h2>
        <p>
          “Budget”没有跨行业完全统一的法律含义。有的机构用它表示软性年度风险资本计划，有的用它表示可动态调配的 VaR 空间，还有的系统字段虽然叫 budget，超过后却自动阻断交易——从控制功能看，最后一种已在扮演 limit。分类应看授权后果、可否越过、谁能批准和是否有时限，而不是只看字段名称。
        </p>
        <div className="equation-card">
          <span>计划分配的一致性检查</span>
          <div>Budget<sub>firm</sub> → &#123;B<sub>business</sub>&#125; → &#123;B<sub>desk</sub>&#125; → &#123;B<sub>strategy</sub>&#125;；　ΣB<sub>i</sub> 不必等于 firm risk</div>
          <p>因为分散化、非线性与不同指标，子预算不能机械相加成企业组合风险。组织可以分配 stand-alone envelopes，再在总层做联合重估；分配规则与企业 limit 必须分别保存。</p>
        </div>
        <p>
          Risk capital allocation 文献说明怎样在给定风险函数下分配资本或评价绩效，但不能替董事会作战略授权；一个数学上“公平”的 contribution 也不等于业务有权使用同额风险。<Cite n={11} /><Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="math-budget-boundary">
        <p className="section-kicker">28 · 与 2.12 数学 Risk Budget 的边界</p>
        <h2>2.12 的 b<sub>i</sub> 是组合中希望各单元承担的事前风险份额；2.16 的 budget/limit 是组织授权。二者可以连接，却不能互相替代。</h2>
        <div className="equation-card">
          <span>组合贡献目标</span>
          <div>RC<sub>i</sub>(w)/ρ(w)=b<sub>i</sub>，　ρ(w)&gt;0，　b<sub>i</sub>≥0，　Σb<sub>i</sub>=1</div>
          <p>这是一种 portfolio construction 目标。ρ(w)=0 时贡献比例无定义，不能用零除“分配”风险。该目标要求选择风险函数、协方差/情景和可行权重；并不说明谁批准仓位、limit 是多少、何时构成 breach 或如何处置。</p>
        </div>
        <div className="equation-card">
          <span>Marginal 与 Euler contribution 的成立条件</span>
          <div>MRC<sub>i</sub>=∂ρ/∂q<sub>i</sub>；　RC<sub>i</sub>=q<sub>i</sub>MRC<sub>i</sub>；　若 ρ(λq)=λρ(q) 且可微，则 ρ(q)=Σ<sub>i</sub>RC<sub>i</sub></div>
          <p>正齐次性 ρ(λq)=λρ(q)（所有 λ&gt;0）与可微性才保证 Euler 加总。Payoff 对风险因子非线性，与风险函数对持仓数量是否齐次是两个问题：若每份合约损益可线性相加且情景分布固定，期权组合仍可能对 q 正齐次。外生 position cap 只收缩可行域，并不自动改变 ρ；只有当规模相关 impact、liquidation/funding cost、容量成本或随仓位变化的模型输入进入 ρ 本身时，才会破坏完全加总。对冲头寸的 RC 可以为负；离散或非光滑 VaR 下梯度也可能不存在或不唯一。</p>
        </div>
        <p>
          组织可以先给 desk 5m ES budget，再由 desk 用 ERC 在策略间配置；也可以先设 notional、stress 与 concentration limits，使精确 ERC 根本不可行。一个对冲资产 RC 为负，并不意味着组织应给它“负限额”；一项低 contribution 也可能因法律或流动性被禁止。Risk-allocation 与 RORAC 文献提供数学一致性，仍不能替董事会授权。Roncalli 的组合预算框架与 FSB 的 risk appetite framework 应对读，而不是同名即合并。<Cite n={11} /><Cite n={12} /><Cite n={13} /><Cite n={14} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="limit-specification">
        <p className="section-kicker">29 · 完整 Risk Limit 规格</p>
        <h2>一条可执行限额必须回答“什么指标、对谁、在哪个时点、用哪一版本、谁负责、越过后怎样”；只有金额没有口径的 limit 只是一个无法审计的数字。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="完整限额规格字段，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>字段</th><th>必须冻结的内容</th><th>遗漏后果</th></tr></thead>
            <tbody>
              <tr><td>Metric</td><td>VaR/ES/stress/Greek/position 及公式</td><td>同名不同算法</td></tr>
              <tr><td>Scope</td><td>法律实体、desk、book、product、netting</td><td>错误聚合或越权抵销</td></tr>
              <tr><td>Convention</td><td>币种、horizon、α、scenario、P&amp;L 口径</td><td>不同对象直接比较</td></tr>
              <tr><td>Version</td><td>数据、模型、limit 生效/到期时间</td><td>历史回写与争议</td></tr>
              <tr><td>Thresholds</td><td>warning、hard、buffer 与精度</td><td>预警和 breach 混淆</td></tr>
              <tr><td>Governance</td><td>owner、monitor、approver、escalation、clock</td><td>有告警无人负责</td></tr>
              <tr><td>Exception</td><td>权限、期限、补偿控制、退出条件</td><td>临时越界永久化</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Limit 还要说明上限、下限或双边边界。对称边界 −Λ≤U≤Λ 可以用 Λ−|U| 报告离最近边界的最小空间，但必须同时保留 signed usage 以及上、下方向 headroom；对一般边界 Λ<sup>−</sup>≤U≤Λ<sup>+</sup>，应分别计算 H<sup>+</sup>=Λ<sup>+</sup>−U 与 H<sup>−</sup>=U−Λ<sup>−</sup>。Concentration limit 的百分比分母、币种和换算也要版本化。<Cite n={32} /><Cite n={33} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="warning-hard">
        <p className="section-kicker">30 · Warning Threshold 与 Hard Limit</p>
        <h2>Warning 是在授权边界前预留反应时间的状态；超过 warning 不等于 hard-limit breach，但绝不是“什么都没发生”。</h2>
        <div className="equation-card">
          <span>单边上限的最小状态</span>
          <div>U≤W：normal；　W&lt;U≤Λ：warning；　U&gt;Λ：limit alert / 待验证 breach</div>
          <p>W 是预警线，Λ 是 hard limit。比较应使用政策规定的底层精度，不能因报表四舍五入制造或消灭状态；若数据尚未验证，应保留 alert 标签。</p>
        </div>
        <p>
          Warning 可以触发加密监控、暂停某类新增风险、要求书面计划或提前对冲。Hard limit 则代表正式授权边界，但越过后仍需按制度核对数据与版本并启动升级。把 warning 当 breach 会过度交易，把 breach 当 warning 会弱化授权；两者必须有不同颜色以外的明确治理后果。
        </p>
      </section>

      <section className="lesson-section" id="usage">
        <p className="section-kicker">31 · Usage</p>
        <h2>Usage 是当前状态在批准测量约定下对某条限额的占用，不是持仓名义金额本身，也不是真实未来损失。</h2>
        <div className="equation-card">
          <span>限额函数</span>
          <div>U<sub>j,t</sub>=U<sub>j</sub>(q<sub>t</sub>,z<sub>t</sub>;V,θ<sub>t</sub>,D<sub>t</sub>,h,α,c,e,N<sub>t</sub>)</div>
          <p>同一 q 在波动、相关性、FX、曲面或净额资格变化后可以产生不同 usage；这就是为什么没有新交易也可能越界。每个 j 表示一个独立 metric/scope。</p>
        </div>
        <p>
          Usage 的可信度不能高于输入与聚合质量。重复仓位可制造虚假超限，漏掉对冲可夸大风险，错误净额可虚假降低风险，过期价格可使非线性暴露失真。风险团队应同时报告 raw alert、validated usage、data-quality flags 和 uncertainty/add-on，而不是用一个干净数字掩盖未解决问题。<Cite n={29} /><Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="headroom">
        <p className="section-kicker">32 · Headroom 与 Utilization</p>
        <h2>对“越大越危险”的单边上限，headroom 是限额减 usage；它只在同指标、同范围、同时点、同版本下有意义，不能当作可自由消费的资本。</h2>
        <div className="equation-card">
          <span>上限用量</span>
          <div>H<sub>j</sub>=Λ<sub>j</sub>−U<sub>j</sub>；　r<sub>j</sub>=U<sub>j</sub>/Λ<sub>j</sub>，Λ<sub>j</sub>&gt;0</div>
          <p>H&gt;0 表示尚有数值空间，H=0 表示正好在边界，H&lt;0 表示超限；r 是 utilization。负限额、双边限额、允许负 usage 或不同比例尺度要另写规则。</p>
        </div>
        <p>
          0.5m VaR headroom 不等于可以买入任何带 0.5m stand-alone VaR 的资产，因为新增交易会改变组合相关性、曲率和其他约束。Headroom 还可能因日内波动上升而消失，即使 target 尚未成交。因此它是当前控制状态的余额，不是无条件承诺的购买力。
        </p>
      </section>

      <section className="lesson-section" id="pretrade-capacity">
        <p className="section-kicker">33 · Pre-trade Feasible Action Size</p>
        <h2>候选交易能做多大，取决于所有适用限额在 post-trade 状态下是否仍可行；“headroom ÷ 单位风险”只是一种局部单调线性近似。</h2>
        <div className="equation-card">
          <span>多限额可行集</span>
          <div>𝓠=&#123;u∈[0,ū] : U<sub>j</sub>(q+ua;θ,D)≤Λ<sub>j</sub>，∀j&#125;</div>
          <p>a 是单位候选方向，u 是规模，ū 还可含 liquidity、borrow 或 mandate 上限。系统应在同一 actual portfolio 上重估每个适用 j。</p>
        </div>
        <div className="equation-card">
          <span>只在局部线性时的简式</span>
          <div>若 H<sub>j</sub>≥0、U<sub>j</sub>(q+ua)=U<sub>j</sub>(q)+uc<sub>j</sub> 且 c<sub>j</sub>&gt;0，则 u<sub>max</sub>=min&#123;ū，min<sub>j</sub>H<sub>j</sub>/c<sub>j</sub>&#125;</div>
          <p>该式只适用于当前组合已合规、规模连续且所有相关 usage 对 u 单调线性的情形。离散手数需向下取整；若当前已超限、c_j≤0 或 usage 非单调，应直接求完整可行集，不能使用 headroom 除法。</p>
        </div>
        <p>
          Pre-trade approval 仍不是 fill。市场移动、部分成交和其他账户同时交易会改变 post-trade 状态；大单应在实际成交后再次计量。一个订单也可能降低 VaR 却增加 stress 或 concentration，因此 approval 必须基于整个约束栈。
        </p>
      </section>

      <section className="lesson-section" id="constraint-stack">
        <p className="section-kicker">34 · Binding Constraint Stack</p>
        <h2>机构可行域是所有适用约束的交集；决定边际行动的不是最受关注的指标，而是当前最先被碰到、且不能合法抵销的 binding constraint。</h2>
        <div className="equation-card">
          <span>可行域交集</span>
          <div>𝓕<sub>t</sub>=𝓕<sup>VaR</sup>∩𝓕<sup>ES</sup>∩𝓕<sup>stress</sup>∩𝓕<sup>conc</sup>∩𝓕<sup>liq</sup>∩𝓕<sup>legal</sup>∩𝓕<sup>mandate</sup></div>
          <p>候选 post-trade position 必须落在每个适用集合内。某项 headroom 不能补偿另一项违反，除非治理文件明确允许并由有权限的人修改约束本身。</p>
        </div>
        <p>
          例如 VaR 从 4.10 增至 4.55、仍低于 5.00，但 stress 从 11.50 增至 12.50、超过 12.00，原交易就不可按原方案批准。可以重构 hedge、缩小规模或申请例外，却不能用 VaR 剩余 0.45“抵消”stress 超出 0.50。Shadow price 可以衡量放松某一约束的边际价值，但它仍不是放松授权。
        </p>
      </section>

      <section className="lesson-section" id="legal-netting">
        <p className="section-kicker">35 · Legal Entity、Currency 与 Netting Scope</p>
        <h2>经济相关性不能创造法律净额：在 legal／CCR／collateral 聚合中，只有合约、对手方、实体、币种与 close-out 条款允许的 offset 才能形成净额义务；经济 hedge 仍可能降低 market VaR，却不会因此取得法律净额资格。</h2>
        <p>
          母公司的一条 hedge 可能无法抵销受监管子公司的 limit；两个 desk 的相反头寸在不同 CCP、prime broker 或 bankruptcy estate 中仍需分别融资；跨币种净额还要计入 FX 和 settlement timing。风险聚合系统应同时保留 gross exposure、经济 hedge、可执行 legal netting 与 collateral set，不能只报告净后最小数字。
        </p>
        <div className="precision-note">
          <span>Scope 先于算术</span>
          <p>“A + B = 0”只有在 A、B 用相同单位、时间、概率口径且有权在同一控制范围聚合时成立。Netting opinion 失效或实体迁移可造成 aggregation/legal-driven usage 上升；对手方降级则通常经 credit parameter、CVA、collateral 或 margin 进入另一条 usage 链。两者都可能在 actual positions 不变时收紧约束，却不能混成同一根因。银行监管资本对 close-out netting 的认可本身也附带法律有效性、单一净额义务和持续审查等条件；这些是适用域明确的制度例子，不是所有投资机构的统一合同规则。<Cite n={60} /><Cite n={61} /></p>
        </div>
      </section>

      <section className="lesson-section" id="authority-matrix">
        <p className="section-kicker">36 · Authority Matrix</p>
        <h2>有效限额必须把“谁承担风险、谁独立监控、谁批准例外、谁验证模型、谁审计流程”分开；同一个人既制造、计量又豁免风险，会使边界失去意义。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="风险治理权限矩阵，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>角色</th><th>主要责任</th><th>不应单独拥有</th></tr></thead>
            <tbody>
              <tr><td>Board / committee</td><td>批准 appetite、重大边界与监督</td><td>日常模型参数和逐笔交易</td></tr>
              <tr><td>Senior management</td><td>把 appetite 转成业务资源与控制</td><td>隐瞒重大 breach</td></tr>
              <tr><td>Business / portfolio</td><td>在授权内承担并主动管理风险</td><td>单方面改自己的 hard limit</td></tr>
              <tr><td>Independent risk / CRO</td><td>计量挑战、监控、升级与建议处置</td><td>用风险数字替代业务所有权</td></tr>
              <tr><td>Model validation</td><td>独立验证、限制与持续监控</td><td>验证自己负责开发的模型</td></tr>
              <tr><td>Internal audit</td><td>独立评价治理与控制有效性</td><td>经营日常风险流程</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          FSB RAF 与 BCBS 治理原则强调角色清晰、independent challenge 与董事会信息。Rule 18f-4 的文字更精确：若只指定一名 derivatives risk manager，该人不得是基金的 portfolio manager；若指定多人，portfolio managers 不得占多数。具体组织图可以不同，核心是风险承担者不能通过改模型、改数据或追认 limit 自行抹去越界。<Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="control-state-machine">
        <p className="section-kicker">37 · Normal → Warning → Alert → Breach 状态机</p>
        <h2>一次系统告警先是待核验事件；只有在适用 limit、数据、模型和范围均确认后，才成为 confirmed breach，并进入带责任人与时钟的处置状态。</h2>
        <div className="causal-chain" aria-label="风险告警与超限状态机" role="list">
          <div role="listitem"><span>01</span><b>Normal</b><p>所有适用指标在 warning 内。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Warning</b><p>靠近边界，提前干预。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Alert</b><p>系统显示越界，待验证。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Confirmed</b><p>口径正确且真实超限。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Remediation</b><p>行动已批准或执行中。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Retested</b><p>按 actual state 重新计量。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>07</span><b>Closed</b><p>恢复合规且证据完整。</p></div>
        </div>
        <p>
          状态机不要求所有机构用同名字段，但必须防止三种跳跃：从未验证 alert 直接下经济订单；从“计划减仓”直接标记 closed；从临时例外直接删除原 breach。每次转换需记录决定人、时间、证据和下一截止点。
        </p>
      </section>

      <section className="lesson-section" id="cause-taxonomy">
        <p className="section-kicker">38 · Breach Cause Taxonomy</p>
        <h2>“是否超限”与“为什么超限”是两列字段；新交易、市场变化、模型更新、数据缺陷、限额变化和聚合范围变化需要不同处置。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="超限原因分类表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>原因</th><th>最小机制</th><th>首要核验</th></tr></thead>
            <tbody>
              <tr><td>Trade-driven</td><td>新 fill 增加 post-trade usage</td><td>预交易批准、成交和 booking</td></tr>
              <tr><td>Market-driven</td><td>价格/波动/相关性/曲面变化</td><td>market data 与 actual position</td></tr>
              <tr><td>Model-driven</td><td>参数、方法或估值版本更新</td><td>change approval 与 parallel run</td></tr>
              <tr><td>Data-driven</td><td>重复、遗漏、过期、单位/FX 错</td><td>source lineage 与 reconciliation</td></tr>
              <tr><td>Limit-driven</td><td>limit 下调、到期或重分配</td><td>生效时间、批准人与通知</td></tr>
              <tr><td>Aggregation-driven</td><td>实体、netting、范围或币种改变</td><td>legal opinion 与 mapping</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          原因可能并存。例如波动上升先制造 market-driven breach，随后 stale FX 又高估一部分 usage。关闭经济超限不代表数据事件已修复；反过来，修正重复仓位使 usage 回到限额内，也不能删除数据控制失败。Root-cause analysis 要区分触发原因、放大因素和控制失效。
        </p>
      </section>

      <section className="lesson-section" id="validation-gate">
        <p className="section-kicker">39 · Validation Gate</p>
        <h2>验证门不是拖延风险处置，而是防止错误数据和错误版本制造真实订单；高严重度事件可以一边实施临时保护，一边并行核验。</h2>
        <ol className="diagnostic-list">
          <li><b>Position：</b>actual fill 是否正确 booking，是否重复、遗漏、错 book 或错法律实体？</li>
          <li><b>Market：</b>价格、curve、surface、FX 与时间戳是否同步，是否 stale 或越过 fallback？</li>
          <li><b>Model：</b>批准版本、参数、risk factor mapping 与 valuation 是否一致，变更是否生效？</li>
          <li><b>Limit：</b>适用 threshold、币种、范围、生效/到期与 exception 是否正确？</li>
          <li><b>Aggregation：</b>netting、对手方、实体和 hierarchy mapping 是否仍有效？</li>
          <li><b>Materiality：</b>超出多少、持续多久、离下一触发器多远、市场能否执行？</li>
        </ol>
        <p>
          若重复仓位使 alert usage 为 5.2m，而删除重复项后 validated usage 为 2.6m、limit 为 4.0m，经济 breach 可以关闭，但 data incident 必须保留审计轨迹、影响范围和修复证明。若市场快速恶化，治理可先冻结新增风险或买保护，不能因为核验未完就放任扩张；临时动作也必须标为 provisional，不得冒充最终 root cause。
        </p>
      </section>

      <section className="lesson-section" id="severity-clock">
        <p className="section-kicker">40 · Severity、Remediation Clock 与 Escalation</p>
        <h2>同样是 1m 超限，若发生在流动市场、可快速对冲，与发生在跳空、交易暂停或多项约束同时恶化的状态，治理优先级完全不同。</h2>
        <div className="equation-card">
          <span>严重度记录向量，不是假定存在通用评分函数</span>
          <div>Severity record=(excess, duration, criticality, liquidity, concentration, correlation, control failure, contagion)</div>
          <p>Excess 记录超限幅度，但还要并列记录持续时间、指标含义、退出可行性、多项约束是否共振、数据或权限是否失效，以及是否可能向其他实体或客户传播。每家机构再由预注册政策把这些字段映射到 escalation level 与 remediation clock；这里没有一个跨机构通用的数学 f。</p>
        </div>
        <p>
          Remediation clock 应从制度规定的识别或确认时点开始，包含中间里程碑：谁在何时完成验证、谁批准计划、何时下单、何时预期成交、何时重测。Deadline 不是“到点前可以不做事”；风险越大，越需要先采取可逆保护并提高更新频率。持续越界则升级到更高 authority，并重新评估计划是否因流动性和价格冲击失效。
        </p>
      </section>

      <section className="lesson-section" id="response-choice">
        <p className="section-kicker">41 · Response Choice</p>
        <h2>确认 breach 后，治理目标是以可执行、获授权且副作用可控的方式恢复风险边界；最佳动作取决于原因、组合、时间和市场，而不是固定为“卖掉超额部分”。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="超限处置选项，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>候选响应</th><th>适用机制</th><th>必须验证</th></tr></thead>
            <tbody>
              <tr><td>Fix data / implementation</td><td>虚假或错误 usage</td><td>重算、影响范围、审计轨迹</td></tr>
              <tr><td>Freeze incremental risk</td><td>阻止状态继续恶化</td><td>哪些订单被阻断、hedge carve-out</td></tr>
              <tr><td>Hedge / transfer</td><td>保留经济头寸但降低特定风险</td><td>basis、liquidity、counterparty、post-trade usage</td></tr>
              <tr><td>Reduce / close positions</td><td>直接降低相关暴露</td><td>方向、impact、partial fill、其他约束</td></tr>
              <tr><td>Capital / liquidity action</td><td>资源边界而非观点触发</td><td>资源可用时间、法律实体与成本</td></tr>
              <tr><td>Reallocate limit</td><td>风险值得由其他单元让出空间</td><td>权限、企业总限额、被挤出风险</td></tr>
              <tr><td>Temporary exception</td><td>立即修复比短暂越界危害更大</td><td>期限、补偿控制、退出计划</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          处置需要比较完整 post-action state，而不是只优化被突破的指标。例如卖出流动性最好资产可能降低 VaR，却恶化现金 buffer 与集中度；买入指数 put 可能降低 equity tail risk，却增加 premium、vega、counterparty 和 basis；把 limit 从 A desk 转给 B desk 可能恢复局部合规，却使企业 appetite 超支。每个候选动作都应重跑约束栈和 stress。
        </p>
      </section>

      <section className="lesson-section" id="temporary-exception">
        <p className="section-kicker">42 · Temporary Exception / Waiver</p>
        <h2>例外不是把错误变正确，而是在更高权限下、为有限范围和时间接受一段被显式记录的越界，同时配置补偿控制和退出条件。</h2>
        <p>
          一份合格 exception 至少写明：原 limit 与 confirmed usage、原因、风险实质、批准人及权限依据、开始/到期时间、最大容忍幅度、禁止事项、监控频率、补偿 hedge 或资本、修复里程碑和撤销条件。它应保留 breach 历史，不能通过 retroactive limit change 把事件改写成从未发生。
        </p>
        <div className="precision-note">
          <span>何时不应批准</span>
          <p>若根因未知、数据不可信、市场风险正在非线性扩大、例外超过批准人权限、没有可信退出计划，或 repeated exception 已把 hard limit 变成软建议，就不应仅为避免报告而批准。London Whale 个案中的模型变更，以及在未充分分析 breach 根因时批准临时提高限额，说明形式上“处理了 limit”不等于控制实质有效。<Cite n={54} /><Cite n={55} /></p>
        </div>
      </section>

      <section className="lesson-section" id="breach-not-sale">
        <p className="section-kicker">43 · Breach ≠ Sale：现行规则反例</p>
        <h2>越过限额首先改变的是治理状态；只有当经验证、获授权的修复方案包含卖出且订单真实成交，才会出现卖压。</h2>
        <div className="equation-card">
          <span>从超限到市场流的必要链</span>
          <div>Validated breach → binding policy → chosen action → signed target → executable order → actual fill → market impact</div>
          <p>任一箭头缺失，都不能从 breach 推出卖出。多头减仓的 signed order 为负，空头减仓为正；买保护、收期权 delta、跨资产 hedge 或停止新增风险都可能降低 usage。</p>
        </div>
        <p>
          现行美国 Rule 18f-4（制度状态截至 2026-08-31）提供清晰反例：须遵守 paragraph (c)(2) VaR test 的基金至少每个营业日判断 relative/absolute VaR test；若不合规，规则要求以符合基金及股东最佳利益的方式及时恢复，而不是规定立即清仓。持续五个营业日后仍未恢复时，还会叠加 derivatives risk manager 向董事会提交书面报告和预计恢复日程、分析原因并视情况更新相关风险管理项目要素；随后须按规则时钟继续向董事会报告恢复状态，并按 Form N-RN 的适用要求向 SEC 报告。Limited derivatives users 与特定 grandfathered leveraged/inverse funds 有另外条件，不能被这段概括吞掉。这里的结论只说明“具体规则也保留治理与行动选择”，不代表该规则适用于银行、对冲基金或所有投资基金。<Cite n={59} />
        </p>
        <p>
          “Forced selling”仍然可能真实发生：当限额绑定、政策禁止例外、替代 hedge 不可行、deadline 很短、机构持有多头且成交方向为卖出时，观点不变也会产生卖压。严谨的市场研究必须逐一观察这些中间变量，而不是只用 volatility spike 与价格下跌倒推 VaR funds 已经卖出。
        </p>
      </section>

      <section className="lesson-section" id="order-fill-retest">
        <p className="section-kicker">44 · Target → Order → Fill → Retest → Closure</p>
        <h2>对依赖交易的 remediation，target 和未成交 order 不改变 actual position；actual fill 以及另行记录的到期、行权等合约事件进入真实状态后，才能重算并判断 breach 是否关闭。</h2>
        <div className="equation-card">
          <span>闭环状态</span>
          <div>q<sup>actual</sup><sub>t+</sub>=q<sup>actual</sup><sub>t</sub>+fill<sub>t</sub>；　U<sup>post</sup><sub>j</sub>=U<sub>j</sub>(q<sup>actual</sup><sub>t+</sub>,z<sub>t+</sub>;θ,D)</div>
          <p>fill 含方向、数量、价格、时间与费用。若只部分成交，未成交 target 不能进入 q_actual；z、相关性与曲面在执行中也可能变化，因此 post-trade usage 不等于 pre-trade estimate。</p>
        </div>
        <p>
          一笔预计降低 ES 2m 的 hedge，在 actual fill 后只降 0.7m，可能仍超限；另一笔直接出售因相关性改变，反而使组合 VaR 上升。Closure 标准应是：行动完成、validated usage 回到适用边界、其他 hard limits 未被突破、剩余风险已接受、审计证据和 root-cause 修复均满足制度。若临时 exception 仍有效，事件是“accepted under exception”，不应冒充 normal closure。
        </p>
      </section>

      <section className="lesson-section" id="forecast-vintage">
        <p className="section-kicker">45 · Forecast Vintage 与 P&amp;L Object</p>
        <h2>回测必须比较当时真正可用、冻结版本生成的 ex-ante 风险预测与随后实现的同口径损失；用未来数据重估历史预测，或混用 APL、HPL 与 RTPL，会改变被检验的对象。</h2>
        <div className="equation-card">
          <span>VaR exception</span>
          <div>I<sub>t</sub>=1&#123;L<sub>t</sub>&gt;VaR<sub>α,t|t−1</sub>&#125;；　若条件 F<sub>t−1</sub>(VaR<sub>α,t|t−1</sub>)=α，则 E[I<sub>t</sub>|𝓕<sub>t−1</sub>]=1−α</div>
          <p>VaR<sub>t|t−1</sub> 必须保留预测时模型、参数、数据与仓位口径；L<sub>t</sub> 也必须按预定义 APL/HPL 口径构造。条件 CDF 在该有限左分位处连续已经足以推出等号；若分位点有原子／跳跃，则必须直接核对 F<sub>t−1</sub>(VaR)，不能机械使用 1−α。</p>
        </div>
        <p>
          若条件分位被精确校准，即每期 P(L&gt;VaR|𝓕)=1%，则 250 天 exception 数量的条件期望合计约为 2.5；这不要求每日独立。对有跳跃的一般有效广义分位，逐期 exceedance probability 只保证不大于 1%，期望数也相应不大于 2.5。零 exception 不一定优秀，可能是模型过度保守；几次 exception 也不自动证明模型错误。要看覆盖率、时间聚集、超损严重度、P&amp;L 对齐、样本功效和结构变化。银行实际 VaR 的历史实证既发现模型能够提供信息，也记录动态失配与机构差异，不能归结为“VaR 全部无用”或“通过监管即正确”。<Cite n={19} /><Cite n={20} /><Cite n={21} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="APL HPL RTPL 口径对比，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>P&amp;L</th><th>最小对象</th><th>主要用途</th></tr></thead>
            <tbody>
              <tr><td>APL</td><td>实际业务 P&amp;L，含实际交易及规则指定调整</td><td>与现实结果对照</td></tr>
              <tr><td>HPL</td><td>冻结头寸的一日 hypothetical P&amp;L</td><td>隔离市场变动并回测</td></tr>
              <tr><td>RTPL</td><td>风险模型估值引擎和风险因子产生的 P&amp;L</td><td>与 HPL 做 PLA</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          现行 MAR32 用一日 VaR 分别对比 APL 与 HPL；PLA 比较 RTPL 与 HPL，识别缺失风险因子和估值简化是否实质重要。PLA 不是 ES 尾部校准的同义词。也不应说“ES 不能回测”：ES 单独在广泛分布类上不具备传统可引出性，但 VaR–ES 可以联合评价，已有 calibration 与 comparative backtesting；采用相关理论时还应连同 2021 年勘误阅读。<Cite n={17} /><Cite n={18} /><Cite n={26} /><Cite n={62} />
        </p>
      </section>

      <section className="lesson-section" id="coverage-test">
        <p className="section-kicker">46 · Kupiec Unconditional Coverage</p>
        <h2>Coverage test 检查 exception 比例是否与目标尾部概率相容；它不能检验异常是否聚集、超损多严重，也不能把“未拒绝”解释成模型认证。</h2>
        <div className="equation-card">
          <span>Proportion-of-failures likelihood ratio</span>
          <div>LR<sub>uc</sub>=−2log[((1−p<sub>0</sub>)<sup>T−x</sup>p<sub>0</sub><sup>x</sup>)/((1−p̂)<sup>T−x</sup>p̂<sup>x</sup>)]，　p<sub>0</sub>=1−α，p̂=x/T</div>
          <p>T 是预测次数，x 是 exception 数；常规大样本下与 χ²(1) 比较。本式检验的是 exact unconditional coverage，常见推导把 exceptions 作为同一概率 p<sub>0</sub> 的 Bernoulli 序列；含原子的广义分位、随机化边界或随时间变化的 exceedance probabilities 需要另定 null 与检验方法。高置信度、短样本时尾部事件少，渐近近似和检验功效也需谨慎。</p>
        </div>
        <p>
          250 日 99% VaR 出现 0、1、2 或 3 次异常，样本差异很大，却仍可能无法有力区分多个错误模型。拒绝原假设可以提示覆盖失配，却不能单凭统计量确定是 volatility forecast、tail shape、遗漏因子、P&amp;L 数据还是制度变化造成；未拒绝更不表示所有这些层都正确。<Cite n={15} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="exception-counts">
        <p className="section-kicker">47 · Exception Count、Power 与现行 Basel 乘数</p>
        <h2>监管区间是特定资本制度的决策规则，不是统计学对任意内部 VaR 的普遍合格线；旧交通灯与现行 Basel MAR32 也不能混用。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="截至 2026-08-31 的当前 Basel 银行层回测乘数表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>最近 250 交易日 exceptions</th><th>当前 MAR32 zone</th><th>Backtesting-dependent multiplier</th></tr></thead>
            <tbody>
              <tr><td>0–4</td><td>Green</td><td>1.50</td></tr>
              <tr><td>5 / 6 / 7 / 8 / 9</td><td>Amber</td><td>1.70 / 1.76 / 1.83 / 1.88 / 1.92</td></tr>
              <tr><td>10+</td><td>Red</td><td>2.00</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          上表是截至 2026-08-31 现行 Basel IMA bank-wide 99% 一日 VaR backtesting 的特定乘数，并可叠加 qualitative add-on；MAR32 还规定 APL 与 HPL 分别计数、总体取两者较大值，并对 desk-level tests 有另外门槛与 PLA 要求。1996 年原始 traffic-light 文本只适合解释制度史，不能把其旧基础因子/附加因子表写成 2026 当前规则。监管者也会调查 exception 的实质，某些有严格条件的 non-modellable-risk-factor 情形可另行处理。<Cite n={22} /><Cite n={23} /><Cite n={26} /><Cite n={28} />
        </p>
        <p>
          对一般机构而言，最重要的不是照抄 zone，而是预先规定统计窗口、exception 定义、P&amp;L 口径、missing day、模型变更和 response。一个内部 limit breach 与一个 VaR backtesting exception 是两类事件：前者是 usage 超授权边界，后者是 realised loss 越过先前预测分位；名称相似却不能互相替代。
        </p>
      </section>

      <section className="lesson-section" id="clustering-pnl">
        <p className="section-kicker">48 · Exception Clustering 与 Conditional Coverage</p>
        <h2>异常总数正确仍可能连续爆发；coverage 与 independence 必须分开检验，才能识别“平均频率看似正确、动态状态却持续失配”的模型。</h2>
        <p>
          Christoffersen 类检验把 coverage 与 independence 分开：十次异常均匀散布和十次集中在危机一周，对风险控制含义完全不同。Exception clustering 常提示条件波动、相关性、尾部或 regime adaptation 不足；但也可能来自 P&amp;L 时间戳和数据错误。覆盖率、独立性、超损严重度与 regime 切片应并列报告；通过 conditional-coverage test 仍不证明估值、数据和模型用途全部正确。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="stress-testing">
        <p className="section-kicker">49 · Stress Testing</p>
        <h2>Stress test 不是给极端情景贴一个精确发生概率，而是问：若某组严重且相关的状态发生，组合、资本、流动性和治理会怎样失效。</h2>
        <div className="equation-card">
          <span>带处置成本的压力损失</span>
          <div>SL<sub>s</sub>=V(q,z<sub>0</sub>)−[V(q,z<sub>s</sub>)+CF<sub>s</sub>]+LiquidationCost<sub>s</sub>+FundingCost<sub>s</sub></div>
          <p>s 可以是 historical、hypothetical、sensitivity 或组合情景。max_s SL_s 只是有限情景集内最坏结果，不是最大可能损失；scenario set 与二阶反馈都要披露。</p>
        </div>
        <p>
          好情景从脆弱性出发：哪些风险因子共同移动，basis 和 correlation 怎样破裂，counterparty 和 margin 如何反应，市场是否仍能成交，管理行动在时间与法律实体上是否可信。报告应分开“静态总损失”与“计入可执行管理行动后的净损失”，避免用事后完美对冲掩盖真实风险。BCBS 2018 原则与 2026 合并指南强调 governance、resources、second-order effects 与风险管理整合；PRA 的压力模型指引有自己的适用范围。<Cite n={39} /><Cite n={40} /><Cite n={41} />
        </p>
        <div className="precision-note">
          <span>官方压力测试也不是预测</span>
          <p>2026 Fed stress test 与 ECB geopolitical reverse-stress exercise 都是特定监督工具：前者使用假设严重情景，后者让受监督银行从自身脆弱性设计达到指定资本损耗的情景。它们不能被解读为官方认为这些事件会按该概率发生，也不能把当年政策安排推广成永久制度。<Cite n={42} /><Cite n={43} /></p>
        </div>
      </section>

      <section className="lesson-section" id="reverse-stress">
        <p className="section-kicker">50 · Reverse Stress</p>
        <h2>普通 stress 从冲击推损失，reverse stress 从失败状态反推哪些联合冲击能把机构推过生存或授权边界，因此特别适合发现“未曾想象”的脆弱组合。</h2>
        <div className="equation-card">
          <span>失败边界搜索</span>
          <div>min<sub>z∈𝓩</sub>d(z,z<sub>0</sub>)　subject to　G(q,z)≤0</div>
          <p>G≤0 表示预注册失败，如 capital buffer 耗尽、liquidity shortfall 或无法在期限内恢复合规；d 定义情景离当前状态有多“近”。𝓩、d 和可行性都是模型输入，不是概率。</p>
        </div>
        <p>
          最小数学距离可能给出经济上不可能的冲击，因此还要加入市场机制、时间顺序、政策反应和联合约束。Reverse stress 的产出不是一句“最坏会怎样”，而是 failure pathway、早期指标、contingency action 和现有限额是否在失败前足够早触发。它应与常规 stress、recovery planning 和研究假设相连。<Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="governance-current">
        <p className="section-kicker">51 · Data、Scenario 与 Model Governance</p>
        <h2>风险系统只有在数据血缘、模型库存、情景版本、变更审批、独立验证和使用限制共同可追踪时才真正存在；一张每日 PDF 不是治理系统。以下制度状态截至 2026-08-31。</h2>
        <ol className="diagnostic-list">
          <li><b>Inventory：</b>模型、非模型工具、scenario、overlay、用途、owner、materiality 与依赖关系完整登记。</li>
          <li><b>Development：</b>经济逻辑、数据、估计、benchmark、限制、适用范围与预期使用有证据。</li>
          <li><b>Validation：</b>由足够独立且有能力的主体做 conceptual soundness、process verification 与 outcome analysis。</li>
          <li><b>Monitoring：</b>性能、data drift、override、limit effect、exception、用户行为和环境变化持续监控。</li>
          <li><b>Change：</b>参数、代码、mapping、vendor、fallback、overlay 和 limit 变化有影响评估、批准及回滚。</li>
          <li><b>Use：</b>决策人知道模型回答什么、遗漏什么、哪些情况下不得使用或必须加 add-on。</li>
        </ol>
        <p>
          BCBS 239 与 ECB RDARR 聚焦数据聚合；Basel MAR30、MAR32 与 MAR33 又针对 IMA 资本模型提出额外验证和使用条件。Fed、FDIC 与 OCC 于 2026 年 4 月联合发布修订指引，Fed 以 SR 26-2 发布，并取代 SR 11-7 与 SR 21-8；新指引强调风险为本、materiality、概念合理性、结果分析、持续监控、模型库存、第三方模型和 aggregate model risk，预计对总资产超过 300 亿美元的受监管银行最相关，且指引本身不是可执行的强制标准。SR 11-7 只能作为历史沿革引用。OCC 2026-13 与 PRA SS1/23 的 2026 有效版本各有自己的机构范围。<Cite n={25} /><Cite n={26} /><Cite n={27} /><Cite n={29} /><Cite n={31} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} />
        </p>
        <div className="precision-note">
          <span>Current guidance 是制度实例，不是通用模型定义</span>
          <p>SR 26-2 对两类边界采取了不同制度动作：简单算术以及无统计、经济或金融理论支撑的确定性规则式流程／软件，不属于本指引的 model 定义；生成式或 agentic AI 则因新颖且快速演进而暂不在本指引适用范围内，非生成、非 agentic 的 AI models 仍可能适用。无论是“不属于定义”还是“暂不在范围”，都不表示工具无风险或无需治理；数据、算法、信息安全、合规和决策使用仍须放进相称控制。上述材料相互补充，却不构成一套对所有机构自动适用的统一法律；实施主体仍应核对本地法、机构类型和后续修订。<Cite n={36} /></p>
        </div>
      </section>

      <section className="lesson-section" id="procyclicality">
        <p className="section-kicker">52 · 顺周期接口：本节止于第一阶 Market Impact</p>
        <h2>本节只给出一条条件性、可检验的单机构接口：usage 上升可能经 binding control、授权与 actual fill 接到第一阶市场冲击；它不证明现实中该渠道已经发生或具有特定效应量。多机构同步与后续闭环留给 7.08 与 7.12。</h2>
        <div className="equation-card">
          <span>条件正态、零均值、单一线性暴露、α&gt;1/2、σ&gt;0，且 B 为同口径 VaR limit 的局部模型</span>
          <div>U<sub>t</sub>=z<sub>α</sub>σ̂<sub>t</sub>|X<sub>t</sub>|≤B　⇒　|X<sub>t</sub>|<sub>max</sub>=B/(z<sub>α</sub>σ̂<sub>t</sub>)</div>
          <p>这里冻结 Δz|𝓕<sub>t</sub>∼N(0,σ̂²<sub>t</sub>)，线性 P&amp;L=X<sub>t</sub>Δz，z<sub>α</sub> 是正的标准正态分位。固定 B 下，估计波动翻倍会使允许的绝对敞口减半。但这只是局部 target bound，不适用于含均值、偏斜／厚尾、非线性或多重约束的一般组合；要出现市场订单，还需某项规则实际 binding、无可行替代、治理要求调整仓位和 actual fill。</p>
        </div>
        <div className="causal-chain" aria-label="单一机构风险约束到第一阶市场冲击接口" role="list">
          <div role="listitem"><span>01</span><b>Shock</b><p>价格下跌、波动/相关性上升。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Usage rises</b><p>VaR、ES 或 stress 吃紧。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Binding trigger</b><p>Warning、pre-trade denial、target rule 或 confirmed breach 真正约束行动。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Authorized action</b><p>选择对冲、减仓或其他修复。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Actual fill</b><p>真实买卖方向进入市场。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Impact interface</b><p>由深度决定第一阶价格反应。</p></div>
        </div>
        <h3 className="grid-caption" id="risk-limit-counterexamples-title">断链条件／反例库</h3>
        <div aria-labelledby="risk-limit-counterexamples-title" className="glossary-grid">
          <article><span>Buffer 存在</span><p>Usage 上升但未到 warning/limit，不触发强制处置。</p></article>
          <article><span>Limit 不 binding</span><p>其他约束或业务选择决定仓位，VaR 不是边际原因。</p></article>
          <article><span>替代 Hedge</span><p>买入保护或跨资产对冲可降险，不产生原资产卖单。</p></article>
          <article><span>Exception 获批</span><p>有期限接受越界，短期内可能没有交易。</p></article>
          <article><span>无 Actual Fill</span><p>Target、未成交或撤销订单不足以证明 actual position／usage 已改变或事件已闭环；挂单与撤单仍可能改变可见深度、报价或信息，订单簿渠道回接 Chapter 1。</p></article>
          <article><span>异质时钟</span><p>机构不同步更新，难形成共同订单峰值。</p></article>
          <article><span>外部承接</span><p>其他资本吸收 flow，净冲击可以很小。</p></article>
          <article><span>反向时序</span><p>价格先跌、波动后升时，usage 是结果链的一环而非初因。</p></article>
        </div>
        <p>
          理论与政策研究给出 risk measurement、leverage、funding liquidity 与 market liquidity 的潜在放大条件；initial-margin 和 filtered-historical-simulation 研究也展示状态敏感度。但从多个机构同步到价格—抵押品—融资—风险用量的闭环，是后续章节的待检验系统，不是本节已证明的结果。<Cite n={44} /><Cite n={45} /><Cite n={46} /><Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="cases-counterexamples">
        <p className="section-kicker">53 · 历史案例：指标存在为何仍会失控</p>
        <h2>Barings、LTCM、London Whale 与 Archegos 不证明“VaR 必然失败”；它们共同证明风险指标必须嵌入授权、数据、独立挑战、集中度、融资和及时升级，才能成为真实控制。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="历史风险治理案例与边界，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>案例</th><th>可支持的机制</th><th>不能推出</th></tr></thead>
            <tbody>
              <tr><td>Barings</td><td>前后台冲突、未经授权交易、报告与管理控制失效</td><td>单一 VaR 公式造成倒闭</td></tr>
              <tr><td>LTCM / 1998</td><td>高杠杆、集中、对手方信息缺口、共同流动性撤离</td><td>所有 convergence trade 或 VaR 都会崩溃</td></tr>
              <tr><td>London Whale</td><td>模型变更、limit handling、估值、升级与治理失效</td><td>所有模型变更都为操纵或一个限额能解释全部损失</td></tr>
              <tr><td>Archegos / Credit Suisse</td><td>集中 counterparty exposure、重复警告/超限、margin 与治理失败</td><td>所有 prime brokers 或 family offices 都有同一机制</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Barings 官方调查把组织隔离和授权失效放在中心；LTCM 与 1998 官方报告把 leverage、market liquidity、counterparty exposure 与信息不完整拼成多因果链。它们提醒我们，限制模型不是增加一个更大 VaR 数字，而是让可能绕过数字的 booking、funding 与 authority 也可观察。<Cite n={51} /><Cite n={52} /><Cite n={53} />
        </p>
        <p>
          London Whale 的国会与 FCA 材料涉及 62 亿美元损失、风险模型与限额调整、估值及控制；Archegos 的 FINMA、PRA 与 Fed 文件则从不同法人/监管角度记录集中度、重复 warning/breach、margin、数据与升级不足。个案最有价值的读法是重建时间链并寻找控制何时失灵，而不是用结局选择一个喜欢的单因果故事。<Cite n={54} /><Cite n={55} /><Cite n={56} /><Cite n={57} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">54 · 可证伪研究：Risk Constraint Shock 是否产生同向实际成交？</p>
        <h2>最小研究问题不是“VaR 会不会加剧波动”，而是在可比持仓中，预先可识别的 constraint tightening 是否先压缩 headroom／可行交易集合，再产生真实的风险缩减成交，最后经有限深度进入价格。</h2>
        <div className="precision-note">
          <span>零公式版本 · 先证明三件事</span>
          <p>第一，约束冲击必须真的减少该账户可批准的规模，而不是只让报表数字变化；第二，可行空间缩小必须随后产生可观察的 actual fills，而不是只有 target 或 cancelled orders；第三，这些 fills 必须在控制公开新闻和普通流量后，与有限深度中的价格变化相连。任一步失败，都不能把结果命名为“VaR forced selling”。</p>
        </div>
        <details className="understanding-check">
          <summary>研究者第二遍 · 展开三阶段形式化与符号</summary>
          <div className="equation-card">
            <span>第一阶段：约束必须先收紧 headroom / feasible size</span>
            <div>Tightening<sup>k</sup><sub>i,t</sub>=−ΔH<sup>pre,k</sup><sub>i,t</sub>=a<sub>i</sub>+d<sub>t</sub>+πZ<sup>constraint,k</sup><sub>i,t</sub>+ΓW<sub>i,t−</sub>+u<sub>i,t</sub></div>
            <p>先预注册同一 metric、scope 与单位的约束 k；Tightening^k&gt;0 表示处理前口径下该项 headroom 机械收紧。跨账户比较可再除以 limit 或预先固定的基准尺度，不能把不同 j 的货币、Greek 与比例 headroom 直接相加。Z_constraint,k 可以是预先宣布且异质暴露的 limit、模型或风险参数变化；W 只用处理前信息。若 π≤0 或对应可行规模未降，就不能把后续订单归因于该渠道。</p>
          </div>
          <div className="equation-card">
            <span>行为阶段：把多头卖出与空头回补统一成“风险缩减为正”</span>
            <div>RRFill<sup>k</sup><sub>i,t:t+h</sub>=U<sub>k</sub>(q<sup>pre</sup><sub>i</sub>;S̄<sub>t</sub>)−U<sub>k</sub>(q<sup>post</sup><sub>i</sub>;S̄<sub>t</sub>)<br />RRFill<sup>k</sup><sub>i,t:t+h</sub>=α<sub>i</sub>+δ<sub>t</sub>+βTightening<sup>k</sup><sub>i,t</sub>+ΘW<sub>i,t−</sub>+ε<sub>i,t</sub></div>
            <p>S̄_t 冻结市场、数据与模型状态，使 RRFill^k&gt;0 表示 actual fills 降低同一预注册指标 k 的 usage；机制预期 β&gt;0。在固定、对称且每单位风险相同的单资产简式中，可用 RRQty=|q_pre|−|q_post|：卖多头和买回空头为正，穿越零并建立更大反向仓位会正确记为负。实际 buy/sell flow 必须另行保留。</p>
          </div>
          <div className="equation-card">
            <span>市场阶段：再把风险缩减映回真实买卖方向</span>
            <div>Δp<sub>m,t:t+h</sub>=η MarketSignedFill<sub>m,t:t+h</sub>+ΞControls<sub>m,t−</sub>+ν<sub>m,t</sub></div>
            <p>MarketSignedFill 按实际市场方向编码并聚合到同一工具；控制公开信息、fundamental shock 与普通流量。η 依赖深度和状态。若其他资本承接、fills 未同向或价格先动后约束，机制应被削弱。a_i 与 d_t 分别表示对象和时间效应；IV、DiD 与 pre-trends 只是有条件的识别工具，不是因果保证。</p>
          </div>
        </details>
        <ol className="diagnostic-list">
          <li><b>时序：</b>使用 forecast/limit vintage，证明 constraint shock 先于 target、order、fill 与 price。</li>
          <li><b>对象：</b>观察 actual positions/fills、有效 limits、usage 与 headroom；单用 volatility 或基金收益只是弱代理。</li>
          <li><b>对照：</b>利用不同 headroom、法律实体、模型更新日、buffer 和可用 hedge 的异质性。</li>
          <li><b>排除：</b>margin call、redemption、benchmark、fundamental news 和 dealer hedge 可能同时产生订单，应分渠道而非统称 VaR。</li>
          <li><b>否证：</b>若 limit 不 binding、headroom／可行集合未收紧、没有风险缩减 fill、买方完全吸收，或价格变化早于状态变化，就不支持完整反馈链。</li>
          <li><b>边界：</b>Event study、IV 或 DiD 只有在冲击外生、排除限制和 pre-trends 等条件下才获得因果含义。</li>
        </ol>
        <p>
          这一研究协议向 7.08 交付可观察的微观箭头，而不在本节声称完成系统一般均衡。理论上的 endogenous-risk 与 liquidity spiral 是机制地图；实际效应量仍需 trade-level、limit-level 与市场深度证据。<Cite n={45} /><Cite n={47} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">55 · Risk Measure &amp; Limit Governance Lab</p>
        <h2>十组冻结状态先计算 VaR、期限、相关性、ES 与多限额可行规模，再处理 market、data、warning、hedge 和未经授权 limit change；每题都必须从口径走到治理闭环。</h2>
        <p>
          Mode A 检查“数值怎样生成”：你需要保留损失符号、单位、置信水平、期限和联合分布。Mode B 检查“数字怎样进入行为”：你需要区分 alert、confirmed breach、warning、exception、target、order、actual fill 和 retest。互动题不会预选答案，错误选择会保留供逐题复盘；进度只存本机浏览器。
        </p>
        <RiskLimitLab />
        <div className="print-only">互动实验在打印版中隐藏。请改做下一节十道同源静态变式；打印时答案会展开。浏览器禁用 JavaScript 时也可直接使用静态题与理解检查。</div>
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">56 · 主动练习 · 十道静态变式</p>
        <h2>替换名义金额、期限、相关性、尾部、limit 与处置状态后独立重算，确认你掌握的是风险对象和控制状态，而不是互动题答案位置。</h2>
        <div className="practice-grid">
          {riskLimitScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id + '-static'}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-interfaces">
        <p className="section-kicker">57 · 理解检查、Glossary、接口与阅读路线</p>
        <h2>如果你仍会从“VaR 上升”直接跳到“机构卖出”，就还没有掌握本节；最小复述必须同时包含损失口径、授权状态、候选响应、actual fill 与 post-trade retest。</h2>
        <details className="understanding-check"><summary>01 · VaR、risk budget 与 risk limit 的最短区别？</summary><p>VaR 是冻结条件损失分布的分位函数；organizational risk budget 是 appetite/空间的计划分配；risk limit 是有范围、版本、责任和超限后果的正式授权边界。三者都不自动生成订单。</p></details>
        <details className="understanding-check"><summary>02 · 99% VaR 是否意味着损失超过 VaR 的概率一定等于 1%？</summary><p>条件 CDF 在该有限左分位处连续时可以；有原子／跳跃的离散或混合分布通常只能保证超过 VaR 的概率不大于1%。VaR 定义用累计概率达到至少99%的最小阈值。</p></details>
        <details className="understanding-check"><summary>03 · 为什么 ES 不能总写成 E[L | L≥VaR]？</summary><p>若 VaR 阈值上有大量概率质量，把全部阈值观测纳入会超过最坏的1−α概率质量。分位积分或阈值质量的分数加权才适用于一般分布。</p></details>
        <details className="understanding-check"><summary>04 · Historical、Monte Carlo 与 full repricing 是三种互斥方法吗？</summary><p>不是。历史/参数/Monte Carlo 主要生成联合因子情景；delta/full repricing 把情景映射为组合P&amp;L。可以同时使用历史情景与full repricing。</p></details>
        <details className="understanding-check"><summary>05 · Stand-alone VaR 相加为什么不一定保守？</summary><p>VaR 一般不保证次可加。Bernoulli 反例中两个单项95% VaR均为0，组合95% VaR却为10。是否次可加依赖分布和分位条件。</p></details>
        <details className="understanding-check"><summary>06 · 2.12 的 risk contribution budget 为什么不是 2.16 的 organizational limit？</summary><p>前者是在指定风险函数下配置组合贡献份额；后者还需要战略授权、范围、金额/指标、版本、责任、监控、breach与处置规则。数学贡献可以是负的，组织limit不因此成为负授权。</p></details>
        <details className="understanding-check"><summary>07 · 没有新交易，为什么会出现 confirmed breach？</summary><p>实际仓位不变时，价格、波动、相关性、曲面、模型参数、数据、FX、netting资格或limit版本变化都能提高usage。确认仍需核对这些输入。</p></details>
        <details className="understanding-check"><summary>08 · Warning 与 hard-limit breach 的差别？</summary><p>Warning 是边界前的提前干预状态，可触发监控或限制增险；只有validated usage超过适用hard limit才是confirmed breach。两者都要行动，但权限和后果不同。</p></details>
        <details className="understanding-check"><summary>09 · Breach 为什么不等于卖出？</summary><p>Breach 是治理状态；可能的响应包括修数据、冻结增险、买保护、对冲、风险转移、减仓、资本/流动性行动、重配limit或有期限例外。只有选定卖出且实际成交，才出现卖压。</p></details>
        <details className="understanding-check"><summary>10 · 发出 hedge order 后为什么还不能关闭事件？</summary><p>Order不改变actual position；partial fill、滑点与市场变化会使预期降险失效。必须按actual fill与最新状态重算全部适用usage，再判断closure。</p></details>
        <details className="understanding-check"><summary>11 · 正确的99% VaR模型为什么仍会有exception？</summary><p>分位预测本来就允许尾部事件；连续正确模型平均约1%的观测超过阈值。需要检验覆盖、聚集、严重度和P&amp;L口径，而不是把一次exception当模型自动失效。</p></details>
        <details className="understanding-check"><summary>12 · 从 VaR 顺周期模型到“市场被迫抛售”还缺哪些证据？</summary><p>必须证明limit或另一项风险规则确实binding、headroom／可行行动集合收紧、无可行替代或例外、治理要求及时缩减、机构原仓为多头、生成同向actual sell fills，并在有限深度中产生价格影响；还要排除新闻、赎回、margin等竞争渠道。</p></details>

        <div className="precision-note">
          <span>五道进阶核对 · 检验正文支柱，而非背术语</span>
          <p>先独立写出损失分布、风险函数或约束状态，再展开答案。它们分别覆盖 VaR 非次可加、Euler contribution、Basel 乘数、reverse stress 和组织层级分类；不计入上面的 12 道核心概念检查。</p>
        </div>
        <details className="understanding-check"><summary>A · 两个独立头寸各以 4% 概率损失 10、否则损失 0：单项与组合的 95% VaR、组合 95% ES 各是多少？</summary><p>每个单项 95% VaR=0。组合损失为 0、10、20 的概率分别是 92.16%、7.68%、0.16%，所以组合 95% VaR=10。最坏 5% 概率质量由全部 0.16% 的 20 和 4.84% 的 10 组成，ES=(0.0016×20+0.0484×10)/0.05=10.32。这给出 VaR 非次可加的具体反例。</p></details>
        <details className="understanding-check"><summary>B · 若 ρ(q)=√(q₁²+q₂²)，q=(3,4)，Euler risk contributions 是多少？</summary><p>ρ=5，梯度为 (3/5,4/5)。RC₁=q₁∂ρ/∂q₁=1.8，RC₂=q₂∂ρ/∂q₂=3.2，合计 5，正好还原总风险。这个加总依赖可微与一阶正齐次；它不是组织授权的 budget 或 limit。</p></details>
        <details className="understanding-check"><summary>C · 截至 2026-08-31，Basel MAR32 的 bank-wide 250 日回测中，overall count=max(APL count,HPL count)=7，表内 zone 与乘数是多少？</summary><p>属于 Amber zone，backtesting-dependent multiplier 为 1.83。APL 与 HPL 分别计数后取较大者，不是把两列相加；它是特定 IMA 资本规则，不是任意基金或内部 risk limit 的通用处置线。</p></details>
        <details className="understanding-check"><summary>D · Reverse stress 为什么不能把“在情景库里挑最大损失”当成同义词？</summary><p>普通 stress 在给定冲击集合中向前计算损失；reverse stress 先预注册 failure boundary，再寻找能到达该边界的可行联合冲击与路径。若搜索只在已有有限情景里取最大值，就可能永远发现不了未被预想却更接近失败的组合。</p></details>
        <details className="understanding-check"><summary>E · 在同一币种、期限与明确 market-risk 维度上，firm-level capacity bound=20、appetite ceiling=12；同一业务／指标的 budget=4、warning=4.5、hard limit=5、usage=4.6。各数字分别是什么状态？</summary><p>20 是机构该维度的外层可承受边界，12 是机构愿意主动承担的上限，4 是给业务的计划分配，4.5 是该业务预警线，5 是正式授权边界，4.6 是当前占用。因此业务 budget 已超用，当前是 warning，但仍有 0.4 hard-limit headroom，尚未 hard breach。Firm-level capacity/appetite 与 business-level budget/limit 处在不同聚合层级，不能脱离其他业务占用直接做一条 20≥12≥5≥4 的标量链；budget 超用也不必自动等于 hard-limit breach。</p></details>

        <h3 className="grid-caption" id="risk-limit-glossary-title">核心术语表</h3>
        <div aria-labelledby="risk-limit-glossary-title" className="glossary-grid">
          <article><span>P&amp;L</span><p>给定期间的盈利与亏损对象；本文约定盈利为正，loss 为其相反数。</p></article>
          <article><span>Loss distribution</span><p>在冻结信息、仓位、数据和模型条件下，未来损失可能值及其概率的表示。</p></article>
          <article><span>Quantile</span><p>累计概率首次达到至少 α 的最小损失门槛；门槛之外的严重度不由它描述。</p></article>
          <article><span>Confidence level</span><p>风险分位使用的累计概率 α，不是“模型正确的概率”。</p></article>
          <article><span>Holding period</span><p>风险随机变量覆盖的未来期限，必须与现金流、持仓和管理行动假设一并说明。</p></article>
          <article><span>VaR</span><p>指定信息、期限和置信水平下，条件损失分布的分位门槛。</p></article>
          <article><span>Expected Shortfall</span><p>最坏 1−α 概率质量的平均损失；不是最大可能损失。</p></article>
          <article><span>Full repricing</span><p>在每个情景中以产品定价模型重新估值；它不保证情景分布正确。</p></article>
          <article><span>Incremental risk</span><p>候选动作加入当前组合后，整个组合 usage 的真实变化。</p></article>
          <article><span>Liquidity horizon</span><p>压力中退出或对冲风险所需时间的控制近似，不是无冲击成交承诺。</p></article>
          <article><span>Model risk</span><p>模型、数据、实现、验证或使用不当使决策产生不利结果的可能性。</p></article>
          <article><span>Risk capacity</span><p>资本、流动性、法律、运营与义务共同决定的多维可承受外边界。</p></article>
          <article><span>Risk appetite</span><p>机构为战略目标愿意在 capacity 内主动承担的风险选择。</p></article>
          <article><span>Risk budget</span><p>本节指将 appetite/风险空间计划分给业务或策略的内部 envelope。</p></article>
          <article><span>Risk limit</span><p>具有指标、范围、版本、责任、阈值和后果的正式授权边界。</p></article>
          <article><span>Usage</span><p>当前状态按批准口径对某项限额的占用，不是未来真实损失。</p></article>
          <article><span>Headroom</span><p>对单边上限，limit 减 usage；只在同口径下可解释。</p></article>
          <article><span>Warning</span><p>按本节冻结规则，usage 越过预警阈值但尚未越过 hard limit 的提前干预状态；其他机构可另定等号归属。</p></article>
          <article><span>Alert</span><p>系统显示可能越界、仍待核验数据、模型、范围和有效限额的事件。</p></article>
          <article><span>Confirmed breach</span><p>经验证的 usage 超过适用 hard limit 的治理事件，不是自动交易指令。</p></article>
          <article><span>Limit exception / waiver</span><p>经有权批准、范围有限、带期限与补偿控制的越界接受；不删除历史 breach。</p></article>
          <article><span>Backtest exceedance</span><p>实现损失超过先前 VaR 预测的统计事件，与授权 limit breach 不同。</p></article>
          <article><span>Remediation</span><p>为恢复有效控制而采取的修数据、冻结、对冲、转移、减仓或资源行动。</p></article>
          <article><span>Authority</span><p>谁有权确认、升级、批准行动或例外，以及权限的范围和时钟。</p></article>
          <article><span>Target</span><p>获批准的目标仓位或风险状态；尚未成为市场交易。</p></article>
          <article><span>Order</span><p>送往执行场所的交易指令；未成交前不改变 actual position。</p></article>
          <article><span>Fill</span><p>已经真实成交的方向、数量、价格和时间，是交易型处置进入仓位的节点。</p></article>
          <article><span>APL</span><p>Actual P&amp;L，包含规则口径下的实际交易及相关调整。</p></article>
          <article><span>HPL</span><p>Hypothetical P&amp;L，以冻结头寸隔离市场变化形成的回测对象。</p></article>
          <article><span>RTPL</span><p>Risk-theoretical P&amp;L，由风险模型的估值引擎和风险因子产生。</p></article>
          <article><span>PLA</span><p>P&amp;L attribution，把 RTPL 与 HPL 比较以识别风险因子或估值缺口。</p></article>
          <article><span>Close-out netting</span><p>违约或终止时把适用交易合并为单一净额义务的法律安排；经济对冲不自动获得该资格。</p></article>
          <article><span>Reverse stress</span><p>从预定义失败状态反推可行联合冲击，不是事件概率预测。</p></article>
        </div>

        <div className="interface-grid">
          <article><span>回接 2.11</span><h3>Volatility Targeting</h3><p>σ̂ 可以同时改变目标倍率与VaR usage；两条规则的target、order和fill必须分别识别。</p></article>
          <article><span>回接 2.12</span><h3>Portfolio Risk Budget</h3><p>RC与b_i提供数学贡献；本节添加组织授权、limit、breach与责任链。</p></article>
          <article><span>回接 2.15</span><h3>Capital Survival</h3><p>NAV、margin与funding是并行capacity；risk-limit breach不等于margin call。</p></article>
          <article><span>连接 2.17</span><h3>Redemption</h3><p>本节输出position、liquidity与风险处置；2.17再加入投资者现金流和赎回瀑布。</p></article>
          <article><span>连接 2.18–2.19</span><h3>Benchmark / Crowding</h3><p>Tracking limit与相似模型可进入约束栈；后续解释激励和共同退出。</p></article>
          <article><span>连接 7.08 / 7.12</span><h3>Endogenous Risk / Leverage Cycle</h3><p>本节止于单机构 actual fills；Chapter 7 聚合价格、抵押品、融资和多主体反馈。</p></article>
          <article><span>连接 7.17</span><h3>Causal Identification</h3><p>交付 constraint → headroom／feasible action set → fill → price 的可证伪分阶段协议。</p></article>
        </div>

        <div className="precision-note">
          <span>85–90 分钟核心首读</span>
          <p>按 00–05（约 10 分钟）→ 06–12（15 分钟）→ 16–17、20–24（14 分钟）→ 25–36（18 分钟）→ 37–44（18 分钟）→ 49、52 与本节检查 01、07、09、10、12（10–12 分钟）阅读。这样保留 Authority 与 Mode A 的必要公式，同时把 13–15、18–19、45–48、50–51、53–54 和进阶计算放到第二遍；互动与静态练习在主线首读后完成。</p>
        </div>
        <p>
          最小复述应是：<b>机构先把 actual position、市场、现金流、数据和模型版本映射成条件损失分布或压力情景，再以 VaR、ES、stress、Greeks、集中度和流动性形成一组 usage，与带完整范围和权限的 warning/hard limits 比较。Alert 经数据、模型、limit 与法律实体核验后才成为 confirmed breach；有权主体在多种处置中选择，target 只有通过 actual order/fill 才改变仓位，随后必须重测所有约束。只有当约束 binding、替代方案不可行、多头产生同向卖出成交且市场深度有限时，观点不变的风险控制才会转化为卖压；聚合反馈属于后续系统层。</b>
        </p>
      </section>
    </>
  );
}

export const lesson216: LessonRecord = {
  slug: '2-16',
  id: '2.16',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'VaR、Risk Budget 与 Risk Limit：从损失分布到授权、超限与真实交易',
  subtitle: '严格区分风险度量、组织预算与正式限额，把数据/模型版本、usage、warning、breach、authority、exception、target、order、fill 和 retest 接成闭环，解释观点未变时风险约束何时会、何时不会转化为市场订单',
  readingTime: '核心首读路径约 85–90 分钟（先读度量—授权—行动主线，方法推导、回测规则、案例与研究协议第二遍精读），完整正文约 165–205；互动实验首次完成 25–35／含复盘 40–50，主动练习核对 20–30／完整书写 35–45，核心与进阶理解检查快速 18–22／完整复述 28–35，课程接口约 5 分钟；核心学习约 153–182 分钟，完整学习约 273–340 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T03；建议回看 T01、T04、T06、T08、1.20、2.11–2.12、2.14–2.15；按需回看 1.09 与 2.07',
  updatedAt: '2026-08-31',
  revision: '2.16-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.16-r2',
      summary:
        '独立复核 58 个单元、62 条来源与 129 个引文落点、10 道互动题及 10 道静态变式、12+5 道理解检查，并逐项核验 VaR/ES、离散分位、非次可加、Euler、pre-trade 可行集、Kupiec、legal netting、Rule 18f-4、Basel MAR/CRE、SR 26-2、PRA 与研究协议；类型、规范、构建、HTTP、静态不变量与冻结哈希均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.16-r2',
      summary:
        '独立复核零背景入口、85–90 分钟核心路线、58 项目录、度量—授权—行动因果链、断链反例、10+10 练习、12+5 检查与 6+7+7 阅读路径，并检查唯一答案、键盘/ARIA/焦点、本地保存与损坏恢复、无脚本、打印、移动端和真实 SSR；构建、HTTP 与冻结哈希均一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-15', label: '2.15 Arbitrage Capital 与 Limits to Arbitrage' },
  next: { slug: '2-17', label: '2.17 Redemption、Flow 与 Liquidity Mismatch' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与路线' },
    { id: 'control-ledger', label: 'Risk-control Ledger' },
    { id: 'state-chain', label: '完整状态转移链' },
    { id: 'loss-sign', label: 'P&L 与 Loss 符号' },
    { id: 'valuation-map', label: '持仓到情景 P&L' },
    { id: 'conditional-distribution', label: '条件损失分布' },
    { id: 'quantile', label: 'Quantile' },
    { id: 'confidence-level', label: 'Confidence Level' },
    { id: 'holding-period', label: 'Holding Period' },
    { id: 'var-definition', label: 'VaR 定义' },
    { id: 'var-not', label: 'VaR 没有承诺什么' },
    { id: 'parametric-var', label: 'Parametric VaR' },
    { id: 'historical-simulation', label: 'Historical Simulation' },
    { id: 'monte-carlo', label: 'Monte Carlo' },
    { id: 'full-repricing', label: 'Full Repricing' },
    { id: 'horizon-scaling', label: 'Horizon Scaling' },
    { id: 'aggregation', label: 'Portfolio Aggregation' },
    { id: 'incremental-risk', label: 'Incremental Risk' },
    { id: 'var-nonsubadditivity', label: 'VaR 非次可加' },
    { id: 'es-definition', label: 'Expected Shortfall' },
    { id: 'var-vs-es', label: 'VaR、ES 与 Coherence' },
    { id: 'liquidity-horizon', label: 'Liquidity Horizon' },
    { id: 'model-risk', label: 'Model Risk' },
    { id: 'measure-stack', label: 'Risk Measure Stack' },
    { id: 'risk-capacity', label: 'Risk Capacity' },
    { id: 'risk-appetite', label: 'Risk Appetite' },
    { id: 'organizational-budget', label: 'Organizational Budget' },
    { id: 'math-budget-boundary', label: '数学 Budget 边界' },
    { id: 'limit-specification', label: '完整 Limit 规格' },
    { id: 'warning-hard', label: 'Warning 与 Hard Limit' },
    { id: 'usage', label: 'Usage' },
    { id: 'headroom', label: 'Headroom' },
    { id: 'pretrade-capacity', label: 'Pre-trade Feasible Size' },
    { id: 'constraint-stack', label: 'Constraint Stack' },
    { id: 'legal-netting', label: 'Legal / Netting Scope' },
    { id: 'authority-matrix', label: 'Authority Matrix' },
    { id: 'control-state-machine', label: '治理状态机' },
    { id: 'cause-taxonomy', label: 'Breach Causes' },
    { id: 'validation-gate', label: 'Validation Gate' },
    { id: 'severity-clock', label: 'Severity 与时钟' },
    { id: 'response-choice', label: 'Response Choice' },
    { id: 'temporary-exception', label: 'Temporary Exception' },
    { id: 'breach-not-sale', label: 'Breach 不等于卖出' },
    { id: 'order-fill-retest', label: 'Order、Fill 与 Retest' },
    { id: 'forecast-vintage', label: 'Forecast Vintage / P&L' },
    { id: 'coverage-test', label: 'Coverage Test' },
    { id: 'exception-counts', label: 'Exception Count' },
    { id: 'clustering-pnl', label: 'Exception Clustering' },
    { id: 'stress-testing', label: 'Stress Testing' },
    { id: 'reverse-stress', label: 'Reverse Stress' },
    { id: 'governance-current', label: 'Data / Model Governance' },
    { id: 'procyclicality', label: '顺周期反馈' },
    { id: 'cases-counterexamples', label: '历史案例与反例' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: 'Risk Limit Lab' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'checks-interfaces', label: '检查、接口与阅读' },
  ],
  Content: Lesson216Content,
  references: lesson216References,
  readingList: lesson216ReadingList,
};
