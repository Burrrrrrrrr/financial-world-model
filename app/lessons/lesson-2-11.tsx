import VolControlLab from '../components/VolControlLab';
import { volControlScenarios } from '../components/volControlScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson211Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Volatility targeting 不是“波动一升就看空股票”，而是把截至决策前估计的风险放进目标暴露的分母；只有目标低于冲击后的实际多头、规则允许且订单真实成交时，它才成为股票卖压。</h2>
        <p>
          最小规则可以写成“目标风险 ÷ 单位组合预测风险”。预测风险上升会压低理论倍率，但目标倍率不是订单：价格冲击已经改变资产价值、账户权益和实际权重，杠杆上限、最低暴露、再平衡阈值、执行滞后、现金流与其他 hedge 又可能阻断或反转交易。多头降低绝对暴露通常卖出，空头降低绝对暴露却要买入回补；目标不变时，单纯权重漂移甚至可能要求逆势买入。<Cite n={5} /><Cite n={6} /><Cite n={14} />
        </p>
        <p>
          因而本节真正研究的不是一个漂亮的回测比率，而是一条可核对的状态链：风险怎样被测量，测量怎样进入目标，目标怎样与实际仓位相减，成交怎样改变现金与价格，价格和流动性又怎样回写下一轮风险。单个 agent 的政策可能稳定自身风险；很多相似 agent 在同一薄弱窗口执行时，却可能共同制造它们试图回避的风险。这正是“内生风险”的入口，但不是先验结论。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与排除项</p>
        <h2>硬先修只有 T03；本节建立一套从风险估计到真实订单的通用语法，不提供产品推荐，也不把 risk parity、VaR 治理或期权波动交易提前重讲。</h2>
        <p>
          T03 提供 expectation、variance 与 covariance；按需回看 T01 的 return、T08 的信息时钟、1.09 的 price impact、1.20 的 leverage／margin、2.09 的 cohort flow，以及 2.10 的 target—actual—order—fill 区分。这里的 risky basket 可以是一只股票指数、固定构成的多资产篮子或带符号 overlay；只有在定义、单位和时点均冻结后，公式才有意义。
        </p>
        <div className="learning-objectives">
          <span>七阶段学习路线 · 从风险数字到市场反馈</span>
          <ol>
            <li><b>定义与测量（03–13）：</b>分开实现、预测、目标与最终实现波动，并建立可因果运行的估计时钟。</li>
            <li><b>目标规则（14–19）：</b>由单位篮子风险得到倍率，再处理 cap、floor、fallback、现金与融资腿。</li>
            <li><b>订单生成（20–29）：</b>先更新冲击后 actual，再计算带符号订单、成交、成本、容量与外部现金流。</li>
            <li><b>多资产与策略边界（30–35）：</b>让 covariance 进入组合风险，并区分同比缩放、inverse-vol、inverse-variance 与 risk parity。</li>
            <li><b>产品与制度对象（36–40；学术层见 34）：</b>拆开规则指数、weight／flow 边界、真实基金、保险合同与保险公司 hedge book；学术研究组合已在 34 建模。</li>
            <li><b>反馈、证据与案例（41–51）：</b>区分三种顺周期、稳定化力量、危机案例和可证伪识别。</li>
            <li><b>实验与闭环（52–55）：</b>用 10+10 道题、理解检查与课程接口重建整条机制。</li>
          </ol>
          <p><b>术语桥：</b>realized volatility 是对已经发生收益的统计描述；forecast volatility 是决策时对未来持有期风险的条件估计；target volatility 是政策输入；ex-post outcome 是策略随后真正实现的风险。Exposure multiplier 是 risky basket 相对账户权益的目标规模，risky weight 是某项资产的带符号权重，cash／funding leg 是使总权重闭合的剩余腿。它们不能用一个“波动率”或“仓位”概括。</p>
          <p><b>缩写与单位桥：</b>NAV（net asset value）是账户或基金的净资产价值；EWMA 是 exponentially weighted moving average（指数加权移动平均）；ARCH 是 autoregressive conditional heteroskedasticity（自回归条件异方差），GARCH 是它的 generalized 扩展；bp 是 basis point（基点），1 bp=0.01 个百分点=0.0001 的收益率。ETF 是 exchange-traded fund（交易所交易基金）；AUM 是 assets under management（管理资产规模）。本节若用 ADV 做金额容量约束，专指以基础货币计的 average daily dollar volume（平均日成交额）；若数据源只有股数或合约张数的 average daily volume，必须另行标注并换算，二者不得混写。</p>
          <p><b>产品与制度缩写桥：</b>FIA 是 fixed indexed annuity（固定指数年金），RILA 是 registered index-linked annuity（注册指数挂钩年金）；VIX 是 Cboe Volatility Index；SWES 是英国央行的 System-wide Exploratory Scenario；LDI 是 liability-driven investment（负债驱动投资）。PR／TR／ER 分别指 price return、total return 与 excess return；后文会在它们第一次进入账户计算时再说明差异。</p>
          <p><b>执行桥：</b>target 是规则希望持有的状态；post-shock actual 是下单前真实状态；order=target−actual；fill 是实际成交部分；未成交订单的新增、修改与撤销仍可能改变 quote 与 depth，应在订单簿事件账本中另记。只有 fill 进入本文的成交成本、账户现金与 focal-cohort 成交流。</p>
          <p><b>排除项：</b>2.12 将处理风险贡献相等与资产间基础权重优化；2.14 处理 implied volatility、Greeks 与期权策略；2.16 处理 VaR、限额与组织治理；本节不把最低波动因子、完整 GARCH 模型族或单一保险产品设计扩张成主线。</p>
        </div>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">02 · 完整状态闭环</p>
        <h2>Vol-control 的最小分析单位是“as-of 风险估计—目标倍率—冲击后实际仓位—成交—价格回写”的循环，而不是“波动与股票收益负相关”这一个箭头。</h2>
        <div className="mechanism-chain" aria-label="波动目标策略从测量到反馈的八步因果链">
          <div><span>01</span><b>冻结时钟</b><p>声明收益频率、年化因子、截止时点、执行滞后与数据版本。</p></div>
          <div><span>02</span><b>估计单位风险</b><p>截至 t−1 的收益、波动与协方差形成 t 的预测。</p></div>
          <div><span>03</span><b>生成理论倍率</b><p>目标风险除以单位篮子风险，再过 cap、floor 与 fallback。</p></div>
          <div><span>04</span><b>更新实际状态</b><p>先让价格、现金收益、申赎与成本改变 NAV 和 actual weight。</p></div>
          <div><span>05</span><b>形成带符号订单</b><p>Target amount 减 actual amount；多头减仓卖，空头减仓买。</p></div>
          <div><span>06</span><b>执行并结算</b><p>Buffer、participation、partial fill、融资和费用决定真实变化。</p></div>
          <div><span>07</span><b>聚合市场输入</b><p>只汇总研究 cohort 的 fills，并同时观察 depth 与其他承接者。</p></div>
          <div><span>08</span><b>价格反馈风险</b><p>Impact、相关性与流动性变化进入下一轮信息集和风险估计。</p></div>
        </div>
        <p>
          任何跳步都会产生错误因果：直接从预测波动推卖出，会漏掉持仓符号；从理论指数权重推真实资金流，会漏掉跟踪资产规模与复制方式；从同日价格下跌和基金减仓推 impact，会漏掉共同新闻、赎回和市场深度。后文每一层都保留自己的可观察量和证伪条件。<Cite n={11} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="definition">
        <p className="section-kicker">阶段一 · 定义与测量　|　03 · Volatility Targeting 的最小定义</p>
        <h2>Volatility targeting 是一类状态依赖的暴露政策：当单位组合的预测风险变化时，调整风险资产规模，试图让事前组合波动围绕一个目标运行。</h2>
        <p>
          它不要求预测下一期收益方向，也不保证亏损受限。若一个固定构成的 risky basket 预测波动为 20%，目标为 10%，最朴素规则给出 0.5 倍暴露；若预测波动降为 5%，理论倍率升为 2 倍。现实方法还会加入最大杠杆、最低参与、短长窗口择高、交易阈值和滞后。S&amp;P、MSCI 与 FTSE 的规则展示的是一组具体实现，而不是唯一行业标准。<Cite n={14} /><Cite n={16} /><Cite n={17} />
        </p>
        <p>
          “目标 10%”描述政策如何响应估计值，不是未来一年波动一定等于 10% 的承诺。估计误差、价格跳跃、相关性突变、执行延迟、cap／floor 绑定和现金腿风险都能让结果偏离目标；只要把 target 当 outcome，后续所有绩效和风险判断都会错位。
        </p>
      </section>

      <section className="lesson-section" id="risk-budget-return-forecast">
        <p className="section-kicker">04 · 风险预算不是收益观点</p>
        <h2>同一个多头方向可以由乐观收益预测产生，也可以只是被动保留风险资产；vol-control 只决定规模，不自动决定方向。</h2>
        <p>
          设基础篮子 composition 为 q。q 可以来自长期战略配置、指数、外部 alpha 或 hedge mandate；vol-control 接收 q，再按预测风险同比放大或缩小。它回答“给定方向和构成，持有多少”，不是“应该买哪一只”或“未来会上涨吗”。Moreira–Muir 的学术组合通常在既定因子回报上做风险缩放；规则指数则把一条基础指数与现金或债券腿组合。对象不同，收益含义也不同。<Cite n={7} /><Cite n={14} />
        </p>
        <p>
          因此价格下跌后出现卖单，并不表示模型看空未来现金流；它可能只是预测风险提高、风险预算未变。反过来，若基础篮子本来是空头，风险上升会减少负暴露并生成买入。方向与规模必须分两列记录。
        </p>
      </section>

      <section className="lesson-section" id="four-volatilities">
        <p className="section-kicker">05 · 四种“波动率”</p>
        <h2>历史样本、事前预测、政策目标与事后结果处在不同时间位置；把它们混用，会把描述、决策和评价压成同一个数字。</h2>
        <p>
          Historical realized measure 用过去收益构造，是可观察输入；forecast 是在时点 t、基于当时信息对未来持有期的条件风险判断；target 是管理者或指数规则事先设定的政策参数；outcome 则只能在未来路径发生后计算。一个 10% target 策略可能在冲击周实现 30% 波动，也可能因 leverage cap 在平静期只实现 6%。
        </p>
        <p>
          ARCH／GARCH 文献的关键贡献，是让条件方差随过去冲击和自身历史变化；它们从未把“过去平方收益”与“未来真实波动”宣称为同一个量。实证报告应保存 forecast vintage：若回测用后来修订或包含未来数据的波动估计，即使公式正确，政策也不可交易。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="units-annualization">
        <p className="section-kicker">06 · Variance、Volatility 与年化单位</p>
        <h2>方差按时间尺度线性聚合、标准差按平方根聚合，只在题设的时钟与依赖假设下成立；单位必须先统一，倍率才有意义。</h2>
        <div className="equation-card">
          <span>冻结时钟下的年化</span>
          <div>v<sub>ann</sub> = Dv<sub>Δ</sub>；　σ<sub>ann</sub> = √D σ<sub>Δ</sub></div>
          <p>v<sub>Δ</sub> 是单期方差，σ<sub>Δ</sub>=√v<sub>Δ</sub> 是同频标准差，D&gt;0 是事前冻结的一年同频观测数。收益与波动无量纲，方差是无量纲的平方。该转换采用平方根时间约定；自相关、日内季节性、缺失交易日或跳跃显著时，它不是无条件恒等式。</p>
        </div>
        <p>
          1% 日波动不是 252% 年波动，而约为 15.875%；错误地把标准差乘 252，会把目标倍率压低约十六倍。跨市场组合还必须决定各地交易日和同步收益区间，不能给股票用 252、给另一项资产用日历 365 后直接装入同一协方差矩阵。
        </p>
      </section>

      <section className="lesson-section" id="information-cutoff">
        <p className="section-kicker">07 · Information Cutoff 与执行滞后</p>
        <h2>截至 t−1 的收盘冲击可以更新 t 的风险目标，却不能让策略按 t−1 的收盘回到过去成交。</h2>
        <p>
          必须同时记录四个时点：最后一笔输入何时完整形成，估计何时计算，理论权重何时生效，真实组合最早何时交易。不同指数方法可能使用一日或多日滞后；S&amp;P 的某类期货风险控制指数明确规定从倍率计算到实施存在三日滞后，这说明“当天波动—当天流量”不能由家族名称推断。<Cite n={14} />
        </p>
        <p>
          对研究而言，滞后既是防前视边界，也是识别工具。若真实订单集中出现在公开规则规定的实施窗口，而不是波动首次出现的时刻，机制证据更强；若只在价格下跌当天观察到成交，仍可能是新闻、赎回或 dealer hedge。
        </p>
      </section>

      <section className="lesson-section" id="rolling-window">
        <p className="section-kicker">08 · Rolling Sample Volatility</p>
        <h2>等权滚动窗口把最近 L 个已知收益视为同等相关；窗口长度决定冲击进入和离开估计器的速度。</h2>
        <div className="equation-card">
          <span>因果滚动方差</span>
          <div>v̂<sub>t|t−1</sub> = [1/(L−1)] Σ<sub>h=1…L</sub>(r<sub>t−h</sub>−r̄<sub>t−1,L</sub>)²</div>
          <p>L≥2；r 使用同频、同口径且截至 t−1 已完整可知的数据，r̄ 是同一窗口样本均值。若策略选择分母 L 或把均值冻结为零，必须事前声明；两种约定数值不同，但都不能使用 r<sub>t</sub> 后再假装在 t 开始前已知。</p>
        </div>
        <p>
          短窗口反应快、估计噪声和 turnover 高；长窗口反应慢，会让一次旧冲击在窗口内维持很久，并在它离开窗口时产生离散变化。高频收益聚合提供了另一类 realized-volatility 测量与预测路径，但仍受采样和微观结构边界约束；规则指数采用多个窗口或取短长估计的较大值，通常是在速度与稳定性之间做设计选择，而不是发现“真实波动”的唯一公式。<Cite n={14} /><Cite n={17} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="ewma">
        <p className="section-kicker">09 · Causal EWMA</p>
        <h2>EWMA 让最新平方冲击逐步进入风险状态；衰减参数越接近 1，记忆越长、反应越慢。</h2>
        <div className="equation-card">
          <span>下一可执行时点的条件方差</span>
          <div>v̂<sub>t|t−1</sub> = λv̂<sub>t−1|t−2</sub> + (1−λ)(r<sub>t−1</sub>−μ̂)²</div>
          <p>0≤λ&lt;1；本节实验冻结 μ̂=0。v̂ 和平方收益必须使用同一频率；新估计在 t 或更晚使用。负收益先平方，不能把带符号 r 直接塞进方差递推，也不能把 λ 与 1−λ 对新旧信息的权重倒置。</p>
        </div>
        <p>
          EWMA 是风险状态更新器，不是方向模型。+4% 与 −4% 在对称版本中贡献相同平方冲击；若需要坏消息与好消息不同的反应，应显式使用非对称模型或另加状态，而不是口头把负号塞回公式。S&amp;P 的规则还可取短、长 EWMA 中的较大值，这会令降风险比重新加风险更敏感。<Cite n={1} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="volatility-clustering">
        <p className="section-kicker">10 · Volatility Clustering</p>
        <h2>大波动后仍较可能出现大波动，使风险估计具有持续性；这正是风险倍率不会在一次冲击后立刻恢复的统计基础。</h2>
        <p>
          ARCH 与 GARCH 用条件方差动态形式化“波动聚集”：冲击平方提高下一期方差，过去方差又把影响延续。对 vol-control 而言，一次冲击可能先触发减仓，随后几天即使收益方向反复，较高预测风险仍会压低目标暴露。<Cite n={1} /><Cite n={2} />
        </p>
        <p>
          但持续性不是自然常数。采样频率、资产、制度状态和估计器都会改变半衰期；在结构突变后用固定 λ，可能反应过慢，也可能把一次临时跳跃误当长期状态。策略设计必须把 estimator risk 与 market risk 分开。
        </p>
      </section>

      <section className="lesson-section" id="asymmetry-leverage-effect">
        <p className="section-kicker">11 · Asymmetry、Leverage Effect 与 Feedback</p>
        <h2>股票下跌后波动常比同幅上涨后上升更多，但“公司杠杆效应”和“波动反馈”是相邻而非相同的解释。</h2>
        <p>
          Christie 的 leverage-effect 解释强调股权价值下降会提高企业财务杠杆，使股权风险上升；Campbell–Hentschel 的 volatility-feedback 机制则强调预期波动提高所需回报并压低当期价格。二者都能产生收益—波动负相关，却对应不同状态变量和反事实。<Cite n={3} /><Cite n={4} />
        </p>
        <p>
          Vol-control 又增加第三条订单反馈：下跌提高风险估计，目标多头下降，成交卖单可能进一步压价。这条链不能从负收益与高波动的同期相关直接识别，必须观察规则、持仓和订单。把三种机制统称“杠杆效应”，会把公司资产负债表、均衡折现率和交易流混为一谈。
        </p>
      </section>

      <section className="lesson-section" id="estimator-speed">
        <p className="section-kicker">12 · Estimator Speed 与双时标</p>
        <h2>快速估计器更早降风险，却更容易在噪声中来回交易；慢速估计器降低 turnover，却可能在真正跳变后暴露过久。</h2>
        <p>
          快、慢窗口取最大值是一种不对称治理：只要任一尺度显示高风险，倍率就按更保守者计算；重新加风险则要等待两者都下降。另一种设计是显式规定 fast de-risk／slow re-risk。两者都可能减少“刚平静一天就重新加杠杆”的震荡，却也会在反弹期长期低配。
        </p>
        <p>
          速度必须与执行和市场容量一起判断。每日更新但分五日成交的策略，其真实暴露路径不是每日理论指数；不同 agent 若共享数据却使用不同半衰期，订单可能被摊开，也可能按快慢两波集中。<Cite n={11} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="jumps-stale-data">
        <p className="section-kicker">13 · Jumps、Stale Prices 与 Missing Data</p>
        <h2>最需要降风险的状态，往往也是估计与执行最不可靠的状态：价格跳跃、市场休市、估值滞后和相关性突变会同时出现。</h2>
        <p>
          收盘到开盘跳空在交易前已造成损失和权重漂移，策略只能从新权益出发；若某项资产停牌或用 stale price，样本波动可能被机械压低，反而给出过高倍率。缺失值不能静默填零，跨时区非同步收益也会低估 covariance。
        </p>
        <p>
          稳健实现应事前冻结 fallback：沿用上次有效风险、使用更保守代理、禁止加风险、降低上限或暂停重平衡。Fallback 是 policy 的组成部分，不是代码报错后的临时决定；不同选择会产生不同订单与尾部风险。<Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="target-multiplier">
        <p className="section-kicker">阶段二 · 目标规则　|　14 · Target Multiplier</p>
        <h2>在固定基础篮子下，目标风险进入分子，单位篮子预测风险进入分母；风险升高首先改变的是理论倍率，而不是订单。</h2>
        <div className="equation-card">
          <span>单位篮子风险与理论倍率</span>
          <div>ν<sub>t</sub>(q)=√(q′<sub>t</sub>Σ̂<sub>t</sub>q<sub>t</sub>)；　g<sup>raw</sup><sub>t</sub>=σ* / ν<sub>t</sub>(q)</div>
          <p>q 是事前冻结、带符号的 risky composition，可约定 Σ|q<sub>i</sub>|=1；Σ̂ 是与 q 同资产顺序、同币种、同频率和同年化口径的条件协方差矩阵；ν&gt;0，目标 σ*≥0。g 无量纲。风险翻倍只在其他输入不变时令 raw multiplier 减半，尚未说明实际订单。</p>
        </div>
        <p>
          单资产 long-only 的特例是 q=1、ν=预测波动。多资产时，不能把各项波动简单相加；对冲和相关性会改变单位篮子风险。如果 q 本身也随风险改变，必须先说明是哪个基础配置层更新，再说明是否有第二层同比缩放，否则会重复调整。<Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="clip-cap-floor">
        <p className="section-kicker">15 · Clip、Leverage Cap 与 Exposure Floor</p>
        <h2>目标比率只有穿过可行域才成为最终倍率；cap 防止低估风险时无限加杠杆，floor 则可能阻止高波动时完全退出。</h2>
        <div className="equation-card">
          <span>可行倍率与目标权重</span>
          <div>g*<sub>t</sub>=clip(g<sup>raw</sup><sub>t</sub>;g<sub>min</sub>,g<sub>max</sub>)；　w*<sub>i,t</sub>=g*<sub>t</sub>q<sub>i,t</sub></div>
          <p>要求 0≤g<sub>min</sub>≤g<sub>max</sub>。若上限绑定，预测组合风险可低于 target；若下限绑定，预测风险可高于 target。实际方法还可能限制单日权重变化、只允许 0–100%，或允许特定产品到 150%；必须逐指数、逐版本读取，不能把一个参数推广到整个家族。</p>
        </div>
        <p>
          截至 2026-08-30，S&amp;P 参数表、MSCI 方法与 FTSE Futures ground rules 展示了不同窗口、衰减、滞后、buffer 与 cap 组合。它们共同证明“规则细节决定路径”，却不支持一条统一的行业倍率。<Cite n={15} /><Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="zero-risk-fallback">
        <p className="section-kicker">16 · Zero-risk、Bad Matrix 与 Fallback</p>
        <h2>当预测风险为零、协方差矩阵失效或数据过期时，除法没有经济含义；系统必须进入事前定义的保守分支。</h2>
        <p>
          ν=0 时 raw multiplier 无定义；ν 极小时，即使可计算也会要求巨大杠杆。协方差矩阵若因非同步数据或数值误差不是半正定，q′Σq 甚至可能出现负值。生产系统应检查有限值、样本数、价格新鲜度、矩阵性质和倍率跳变，再决定冻结旧仓、禁止加风险、使用替代估计或降到安全上限。
        </p>
        <p>
          这不是工程边角，而是尾部行为。平静时期的 tiny-vol estimate 决定危机前累积多少暴露；危机中的 missing quote 又决定策略是减仓、停留还是误加仓。回测若把异常日删除，等于删除了 policy 最需要被评价的状态。
        </p>
      </section>

      <section className="lesson-section" id="target-not-guarantee">
        <p className="section-kicker">17 · Target 不是保证</p>
        <h2>目标波动只约束模型眼中的事前风险；它不保证本金、最大回撤、尾部损失或下一期实现波动。</h2>
        <p>
          设目标为 10%，若隔夜直接跳跌 12%，策略不能在跳跃发生前用事后波动减仓；若 cap 绑定，平静期又可能达不到目标；若波动估计低估相关性，组合风险会高于模型值。目标与 outcome 的偏差应被当作待报告结果，而不是“异常值”删除。
        </p>
        <p>
          S&amp;P 的投资者教育材料用基础指数与理论现金配置解释 volatility-controlled index 怎样调整市场参与度，并强调上涨与下跌参与都会随暴露变化；实施 lag 与 target 非保证边界则要回到正式数学方法。任何产品合同还会叠加费用、信用、流动性和法律条款，教育页面不能替代命名产品的方法或招募书。<Cite n={14} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="cash-funding-leg">
        <p className="section-kicker">18 · Cash、Funding 与 Bond Leg</p>
        <h2>风险资产权重的另一面不是“什么都没有”，而是现金、融资、债券、期货保证金或方法指定的另一项资产。</h2>
        <div className="equation-card">
          <span>权重闭合</span>
          <div>w*<sub>cash,t</sub> = 1 − Σ<sub>i</sub>w*<sub>i,t</sub></div>
          <p>若 risky weights 合计小于 1，剩余通常获得方法指定的 cash／bond return；若大于 1，负 cash 表示理论融资敞口或等价衍生实现，但不自动证明实际基金借入同额现金。期货型 excess-return 指数还可能没有与现货股指相同的现金腿定义。</p>
        </div>
        <p>
          S&amp;P Risk Control 2.0 把标准策略的现金部分替换为流动性债券指数；MSCI 在低于 100% 时计 cash return、高于 100% 时计短期融资成本；FTSE Futures 系列可包含 cash、cost 与 decrement components。于是“从股票转现金”只是一个可能实现，不能代表所有 vol-control。<Cite n={16} /><Cite n={17} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="return-conventions">
        <p className="section-kicker">19 · PR、TR 与 ER</p>
        <h2>Price return、total return 与 excess return 回答不同现金流问题；名字相近的两个 risk-control 指数也可能不是同一可比资产。</h2>
        <p>
          PR 只记录价格变化；TR 包含股息再投资，并可能有 gross／net withholding-tax 差异；risk-control TR 还可能加入方法规定的 cash 或 bond leg。ER 表示相对于方法指定基准的超额口径：MSCI 此方法以 risk-control TR 减 cash-component return，而期货 ER、decrement 与 cost component 必须逐 provider、逐指数确认。指数理论回报不是基金扣除管理费、交易冲击与税后的投资者回报。
        </p>
        <p>
          比较策略前应建立 return-convention ledger：underlying 是 PR、gross TR、net TR 还是 futures ER；现金基准是什么；融资 spread、decrement、fee 与税在哪一层扣除。若分母不同，不能把两条 Sharpe 或回撤直接归因于“波动控制更好”。<Cite n={14} /><Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="post-shock-state">
        <p className="section-kicker">阶段三 · 订单生成　|　20 · Post-shock Actual State</p>
        <h2>下单前必须先让价格冲击改变资产金额和账户权益；上一期 target 不是本期 actual。</h2>
        <div className="equation-card">
          <span>冲击后的权益与漂移权重</span>
          <div>E<sub>t−</sub>=E<sub>t−1</sub>(1+Σ<sub>i</sub>w<sub>i,t−1</sub>r<sub>i,t</sub>)；　w<sub>i,t−</sub>=w<sub>i,t−1</sub>(1+r<sub>i,t</sub>)/(1+Σ<sub>j</sub>w<sub>j,t−1</sub>r<sub>j,t</sub>)</div>
          <p>E 是不含本窗口外部现金流与新成本的交易前权益，要求 E<sub>t−</sub>&gt;0；w 可带符号，现金收益若非零应作为一项资产进入求和。先更新金额与权益，再归一化；不能把 −20% 资产收益直接当成权重减少 20 个百分点。</p>
        </div>
        <p>
          一个 60% risky／40% cash 组合在 risky 下跌 20% 后，NAV 从 10m 变成 8.8m，risky weight 是 54.545%，不是 40%。若新 target 仍为 60%，策略需要买回 0.48m；这条反例足以推翻“价格下跌必然令定权重或定波动策略卖出”的口号。
        </p>
      </section>

      <section className="lesson-section" id="target-actual-order">
        <p className="section-kicker">21 · Target、Actual 与 Order</p>
        <h2>只有新目标金额低于冲击后实际多头金额，才出现候选卖单；比较两个百分比或两个 target 都不够。</h2>
        <div className="equation-card">
          <span>从政策到带符号订单</span>
          <div>A<sub>i,t−</sub>=E<sub>t−</sub>w<sub>i,t−</sub>；　A*<sub>i,t</sub>=E<sub>t−</sub>w*<sub>i,t</sub>；　ΔA<sup>order</sup><sub>i,t</sub>=A*<sub>i,t</sub>−A<sub>i,t−</sub></div>
          <p>A 与 ΔA 使用同一基础货币；正订单是买入，负订单是卖出。目标金额以当前交易前权益计算，除非产品文件另有冻结名义规则。若订单受整数、buffer、capacity 或合规过滤，最终 order 还需经过可行性映射。</p>
        </div>
        <p>
          这给出“波动上升导致股票卖出”的完整必要条件：基础或当前暴露是股票多头；新目标金额低于 actual；规则没有被 floor、buffer 或暂停机制阻断；实际工具是股票、ETF 或股票期货；且真实成交没有被申购或其他 hedge 抵消。少任一项，都只能说理论 risky exposure 下调。
        </p>
      </section>

      <section className="lesson-section" id="signed-exposure">
        <p className="section-kicker">22 · Signed Exposure 与空头边界</p>
        <h2>Gross risk 收缩描述绝对规模，不能直接翻译成“卖”：多头缩小是卖出，空头缩小是买入回补。</h2>
        <p>
          若 signed risky weight 从 −40% 调到 −20%，target−actual 为正，订单是买入。多资产 long／short overlay 的同一次去风险，可能同时卖出多头腿、买回空头腿；组合 gross 降低而市场净方向接近零，也完全可能。英国央行 2024 年 SWES 的压力情景报告也记录：已有 gilt／futures 空头的参与者可通过买回完成去风险，这是一条直接反驳“deleveraging 必为卖出”的制度证据。<Cite n={28} />
        </p>
        <p>
          新闻叙事常把“系统性资金 deleveraging”直接写成股指卖盘，实际上还需要知道该 cohort 在该市场的 signed position。2.10 的趋势策略可能在同一风险冲击前已有空头；2.11 的缩放模块只改变绝对规模，不负责猜方向。
        </p>
      </section>

      <section className="lesson-section" id="price-direction-counterexamples">
        <p className="section-kicker">23 · 价格方向的三个反例</p>
        <h2>下跌后可以买、上涨后可以卖、波动不变也可以交易；订单由完整状态差决定，而非由最后一根 K 线决定。</h2>
        <p>
          第一，target 不变而 risky 下跌，权重漂移低于 target，定权重回补会买入。第二，上涨也可能通过大幅平方收益提高预测风险，同时 actual risky weight 上漂；两股力量都可能要求卖出。第三，即使单项波动不变，相关性上升也会提高组合风险、压低总倍率。
        </p>
        <p>
          反过来，价格下跌但预测风险因长窗口尚未上升、actual 已漂移到 target 以下，订单可能为零或买入；价格反弹但高风险估计尚未衰减，策略可能继续低配。只有带着 estimator state、actual holdings 与 policy 复盘，方向才可判定。
        </p>
      </section>

      <section className="lesson-section" id="external-flows-netting">
        <p className="section-kicker">24 · External Flows 与跨账户净额</p>
        <h2>申购、赎回、分红、费用和其他 sleeve 的交易会改变实际金额；观察到的总订单不等于 vol-control 模块单独生成的订单。</h2>
        <p>
          若基金在降目标暴露的同日收到大额申购，新资金可能部分吸收减仓，真实卖单小于模型 gap；若发生赎回，即使 target weight 不变也要筹资卖出。保险公司可能在多个产品和对手方之间净额管理风险，单份合同的指数选择不能一对一映射成 hedge flow。
        </p>
        <p>
          研究数据库应把 strategy-order、flow-order、margin-order、roll-order 与 discretionary override 分列，再在账户或 execution desk 层汇总。若只见最终成交而看不到来源，最多识别“该载体卖出”，不能把全部成交归因于波动规则。
        </p>
      </section>

      <section className="lesson-section" id="rebalance-frequency">
        <p className="section-kicker">25 · Rebalance Frequency 与 Lag</p>
        <h2>每日计算、每日决定、每日成交是三个不同频率；周频或月频策略还可能在阈值触发时临时重平衡。</h2>
        <p>
          高频更新能更快接近新目标，却提高 turnover 和共同执行风险；低频更新让 actual 在两次重平衡间漂移，并把多日变化集中到一个窗口。S&amp;P 的框架允许动态阈值触发与最大单日权重变化，MSCI、FTSE 的具体系列也有自己的 lag 和 buffer。<Cite n={14} /><Cite n={16} /><Cite n={17} />
        </p>
        <p>
          实证中应以实施日而非估计日对齐 order；若用周末可见的权重变更解释周中价格，时钟已经错位。对于真实基金，还要区分基准指数的生效时点、经理接收文件的时点和实际分批成交时点。
        </p>
      </section>

      <section className="lesson-section" id="buffer-hysteresis">
        <p className="section-kicker">26 · Buffer、Deadband 与 Hysteresis</p>
        <h2>只有理论倍率与现倍率差超过阈值才交易，可以抑制小噪声；代价是 actual 长期偏离理论 target。</h2>
        <div className="equation-card">
          <span>最小变更阈值</span>
          <div>若 |g<sup>th</sup><sub>t</sub>−g<sub>last</sub>|≤θ，则 g<sub>t</sub>=g<sub>last</sub>；否则按规则更新</div>
          <p>θ≥0；g<sup>th</sup> 是今日已经过 clip、但尚未通过 buffer 的理论倍率，g<sub>last</sub> 是上次实际采用的规则倍率，不是今日 raw target。某些方法另设最大单日变动。Deadband 降低微小来回交易，却让“预测风险上升”在阈值内不产生订单；跨过边界时则可能形成离散跳变。</p>
        </div>
        <p>
          MSCI 方法的 5% turnover buffer 与 FTSE 特定系列的 exposure buffer 是具体规则实例，不应外推为所有产品。研究若忽略阈值，会在每个小波动变化日虚构连续流量。<Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="asymmetric-rebalancing">
        <p className="section-kicker">27 · Fast De-risk、Slow Re-risk</p>
        <h2>同一策略可以在风险上升时快速减仓、风险下降时缓慢加仓；这是路径治理，不是对涨跌方向的预测。</h2>
        <p>
          设计者担心低波动短暂回归诱发过早杠杆，可能令加风险需要更多确认，而减风险只需快估计器触发。这样能减少急跌后的 V 形反弹中立刻重新加仓，却也会在市场恢复时保持较多现金，产生 opportunity cost。
        </p>
        <p>
          非对称规则改变 cohort flow 的时间形状：卖单可能在冲击后集中，买单则分散。若只用最终月度权重变化，可能看不见这一日内或日际不对称；若把不对称当作“风险厌恶上升”，又会混淆固定算法与人的信念变化。
        </p>
      </section>

      <section className="lesson-section" id="fills-cash-cost">
        <p className="section-kicker">28 · Fill、Cash 与交易成本</p>
        <h2>Target 不支付费用，order 也未必成交；只有 fill 改变账户并进入本文的 turnover 与成本账本。</h2>
        <div className="equation-card">
          <span>成交后的现金闭合</span>
          <div>V<sup>abs</sup><sub>t</sub>=Σ|ΔA<sup>fill</sup><sub>i,t</sub>|；　C<sub>t</sub>=cV<sup>abs</sup><sub>t</sub>+fees；　Cash<sup>+</sup><sub>t</sub>=Cash<sub>t−</sub>−ΣΔA<sup>fill</sup><sub>i,t</sub>−C<sub>t</sub></div>
          <p>c≥0 是按成交金额计的成本率；卖出 fill 为负，因此会增加现金，随后成本减少现金。若成交期间无价格变化、无外部流，E<sup>+</sup>=E<sub>t−</sub>−C。该现金本金式只适用于全额付款的现货／基金份额，或题设明确定义的完全融资头寸；期货、掉期与期权必须改用 premium、variation margin、collateral 和合约特定现金流账本，不能从 notional 全额扣现金。Partial fill 只按实际成交计。</p>
        </div>
        <p>
          交易成本还会令成交后权重略偏离交易前计算的 target。可以在成本后迭代重算，也可以不迭代；两种政策都必须预先声明。把回测权重变化直接当成无摩擦成交，会高估频繁调整在题设成本下的净价值；这是账户恒等式与成本设定的条件推论，不借此声称所有高频 estimator 必然较差。
        </p>
      </section>

      <section className="lesson-section" id="capacity-depth">
        <p className="section-kicker">29 · Capacity、Depth 与 Execution Horizon</p>
        <h2>同样的目标缺口在深市场可以被吸收，在稀薄窗口却会显著移动价格；规模、速度与流动性共同决定反馈增益。</h2>
        <p>
          真实执行要在 tracking error 与 impact 之间取舍：立刻成交能更快贴近风险目标，却可能穿透订单簿；分批成交降低瞬时冲击，却在高风险状态继续暴露。Participation cap、ADV、bid–ask spread、depth、volatility interruption 与交易时段都是可行性约束。
        </p>
        <p>
          未成交并不等于无市场作用。大额限价单、撤单或报价修改会改变可见 depth 和其他人的最优回应；若研究只拿 fills 解释价格，必须明确 estimand 是成交净流的影响，而非全部订单簿行为。1.09 的 impact 与 1.07 的 resiliency 在这里重新接入。<Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="multi-asset-risk">
        <p className="section-kicker">阶段四 · 多资产与策略边界　|　30 · Multi-asset Basket</p>
        <h2>固定 composition 的多资产篮子可以用一个共同倍率同比缩放；这保留相对构成，却不保证每项资产风险贡献相等。</h2>
        <p>
          若 q=(0.5,0.5)，共同倍率 g 同时乘两项权重；资产间比例不变，组合总风险随 g 线性缩放。这个框架适合解释一条既定 60/40、股票／债券或多市场 overlay 怎样整体降风险，但不回答基础权重为什么是 50/50。
        </p>
        <p>
          如果一项资产休市、另一项开盘，组合风险和实际订单时钟会分裂；若用期货实现，还要处理 multiplier、FX、margin 与 roll。Vol-control 的“一个倍率”只有在所有腿能按相容时点和规模执行时才是近似。
        </p>
      </section>

      <section className="lesson-section" id="covariance-correlation">
        <p className="section-kicker">31 · Covariance、Correlation Shock</p>
        <h2>个体波动不变时，相关性上升仍可提高组合风险、触发同比减仓；分散化不是静态常数。</h2>
        <div className="equation-card">
          <span>两资产组合方差</span>
          <div>ν² = q₁²σ₁² + q₂²σ₂² + 2q₁q₂ρσ₁σ₂</div>
          <p>使用相关系数表示时要求 σ₁、σ₂&gt;0，ρ∈[−1,1]；若任一波动为零，应直接使用 covariance 形式而不定义 ρ。q 可带符号，所有波动与 covariance 必须使用同一持有期、频率和年化口径。对两个同为正权重的 sleeve，ρ 上升通常提高风险；若一多一空，符号可能相反。</p>
        </div>
        <p>
          两个各 10% 波动、各占基础篮子一半的多头，在 ρ=0 时单位风险为 7.071%，ρ=1 时为 10%。若目标同为 10%，倍率从 √2 降至 1；即使价格与权益瞬间未变，也会产生候选卖单。2020 与 2022 的机构材料都提醒股债相关性上升可能同时破坏分散与触发风险约束，但这仍不等于已识别真实 vol-control 流量。<Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="risk-parity-boundary">
        <p className="section-kicker">32 · 与 Risk Parity 的边界</p>
        <h2>Vol-control 调整组合总倍率；risk parity 还要改变资产间基础权重，使风险贡献满足某种平衡条件。</h2>
        <p>
          在本节，q 先冻结，g 再同比缩放。Risk parity 则需计算每项资产对组合方差或波动的边际贡献，并求解基础权重；相关性变化不仅改变总 gross，还可能改变各项相对权重。两层同时存在时，应先记录 q-update，再记录 g-update，避免把同一风险变化计算两次。
        </p>
        <p>
          2.12 将专门处理 marginal risk contribution、equal-risk contribution、杠杆和股债相关状态。本节只保留一个接口：即使固定 q，covariance 已足以令总体 vol target 产生跨资产共同订单。
        </p>
      </section>

      <section className="lesson-section" id="taxonomy">
        <p className="section-kicker">33 · 策略 Taxonomy</p>
        <h2>“低波动”“波动管理”“风险控制”“波动目标”可能指不同目标函数；研究前必须先识别规则对象。</h2>
        <p>
          Minimum-volatility portfolio 通过选择资产权重降低组合方差；low-volatility factor 倾向持有历史低波动股票；volatility-managed factor 按因子自身历史方差改变时间暴露；risk-control index 在基础指数与现金／债券／期货组件间按规则调权；fund overlay 则把类似政策施加到真实资产账本。名称相近，不代表公式、方向、费用或流量相同。
        </p>
        <p>
          最稳妥的分类问五个问题：基础篮子是什么，风险估计是什么，缩放用 inverse-vol 还是 inverse-variance，cap／buffer／lag 是什么，现金与成本怎样记。若这五项没有答案，就不应对订单方向或绩效来源作精确判断。
        </p>
      </section>

      <section className="lesson-section" id="academic-vol-managed">
        <p className="section-kicker">34 · Academic Volatility-managed Portfolio</p>
        <h2>Moreira–Muir 的主规格是对既定因子按上一期 realized variance 的倒数缩放，并用常数对齐非条件风险；它不是一只固定 10% target 的真实基金。</h2>
        <div className="equation-card">
          <span>学术 inverse-variance policy</span>
          <div>f<sup>σ</sup><sub>t+1</sub> = [c / σ̂²<sub>t</sub>] f<sub>t+1</sub></div>
          <p>f 是基础因子回报，σ̂² 是截至 t 可知的同频方差估计；M&amp;M 主规格中的 c 事后选取，使 managed 与 unmanaged portfolio 的全样本非条件标准差相同，并与 σ̂² 使用相容方差尺度，使 c/σ̂² 为无量纲权重。它与商业 risk-control 常见的 target/σ 倍率不是同一弹性，也不自动包含实时交易成本、融资限制或基金申赎。</p>
        </div>
        <p>
          该研究在多类资产定价因子中报告了有意义的风险调整后表现，并把效果连接到高波动时期风险补偿没有同比上升；后续研究强调长期投资者的效用与时点问题。它提供“为什么可能有经济价值”的证据，不提供所有资产、时期和实时实现都改善的定理。<Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="inverse-vol-vs-variance">
        <p className="section-kicker">35 · Inverse-vol 与 Inverse-variance</p>
        <h2>1/σ 与 1/σ² 对高风险状态的反应强度不同；把二者都叫“波动缩放”，会掩盖完全不同的 turnover 和尾部路径。</h2>
        <div className="equation-card">
          <span>两种归一化基础权重</span>
          <div>q<sup>IV</sup><sub>i</sub>=(1/σ<sub>i</sub>)/Σ(1/σ<sub>j</sub>)；　q<sup>IVar</sup><sub>i</sub>=(1/σ²<sub>i</sub>)/Σ(1/σ²<sub>j</sub>)</div>
          <p>要求每项 σ&gt;0，且全部 σ 使用同一持有期与年化口径。若两项波动为 10% 与 20%，inverse-vol 权重为 66.67%／33.33%，inverse-variance 为 80%／20%。二者都尚未使用 covariance，也都不能无条件称为 risk parity。</p>
        </div>
        <p>
          Fleming 等研究了波动时点与 realized volatility 的经济价值；Moreira–Muir 使用 inverse-variance 学术政策。商业 target-vol 规则常见 target/σ。比较论文或产品时，必须先把 exponent 写出来，再谈表现。<Cite n={5} /><Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="risk-control-index">
        <p className="section-kicker">阶段五 · 产品与制度对象（学术组合见 34）　|　36 · Risk-control Index</p>
        <h2>指数管理人计算的是一条透明规则下的理论指数水平和目标敞口；指数本身没有资产负债表，也不会提交订单。</h2>
        <p>
          一条具名 risk-control index 需要逐项读取 underlying、return convention、vol estimator、target、cap、lag、buffer、rebalance frequency、cash／bond／futures leg、cost component、base date 与 launch date。S&amp;P 的通用数学、参数表和单项 factsheet 分工不同；MSCI 与 FTSE 也把通用方法和具体指数参数分开。<Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} />
        </p>
        <p>
          所以合格表述是“该指数规则把理论风险敞口从 x 调到 y”，而不是“该指数卖出股票”。只有存在实际跟踪载体，并知道规模、复制工具、actual exposure、滞后与成交，权重变化才可能被翻译成候选市场流。
        </p>
      </section>

      <section className="lesson-section" id="index-weight-vs-flow">
        <p className="section-kicker">37 · Index Weight ≠ Actual Flow</p>
        <h2>理论权重乘一个假定 AUM，最多得到目标名义金额情景；从这里到真实成交还隔着至少六个不可见状态。</h2>
        <p>
          必须依次知道：真实跟踪规模、当前实际敞口、复制载体、申赎与跨账户净额、rebalance buffer／lag、订单完成率与成交窗口。基金可能用股指期货而不是现货股票调节 beta；保险公司可能用期权或掉期对冲；部分资金只把指数用于合同记账而不复制其每一步。
        </p>
        <div className="precision-note">
          <span>流量推断的最短合格链</span>
          <p>规则 target → 识别真实载体 → 观察 current actual → 计算 target−actual gap → 生成 order → 观察 partial／full fill → 才进入账户现金、成本与 focal-cohort flow。任何一步只能用假设替代时，结果必须标成 scenario estimate，而不是 observed sale。</p>
        </div>
        <p>
          指数提供商也明确区分指数计算与资产管理，并说明发布前历史可能是 hypothetical back-tested。把指数历史当基金实盘、再用指数权重反推订单，会连续跨越两次证据层级。<Cite n={16} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="fund-overlay">
        <p className="section-kicker">38 · 真实基金与 Overlay</p>
        <h2>真实基金可以把 volatility overlay 施加在基础基金之上，并通过股指期货、现金与短债实现；这时才存在可落到账户的订单。</h2>
        <p>
          一份 2026 年 SEC 文件中的 NVIT Managed American Funds Growth-Income Fund 例示：core sleeve 持有 underlying fund，volatility overlay 使用 stock-index futures，并保留现金或短债支持 margin；经理也可能因目标变化或赎回买卖基金份额。该文件证明一种真实实现可能产生期货和基金份额订单，却不能代表所有 vol-control 产品。<Cite n={20} />
        </p>
        <p>
          Overlay 还可能失败、放大损失或无法命中目标。期货 notional、posted collateral 与基金 NAV 必须分开；一笔降低 beta 的期货卖单未必要求同步出售现金股票，而到期换月又会产生与方向 target 无关的双腿成交。
        </p>
      </section>

      <section className="lesson-section" id="annuity-contract">
        <p className="section-kicker">39 · FIA／RILA 合同</p>
        <h2>年金持有人拥有的是对保险公司的合同权利，而不是参考指数、成分股票或 risk-control 策略的直接持仓。</h2>
        <p>
          FIA 的利息通常由保险公司按 benchmark 表现和 participation rate、cap、spread 等公式记入；RILA 可以通过 buffer／floor 等结构让账户承受一定负收益，并作为证券注册。SEC 2024 年的专门披露规则对 RILA 与 registered market value adjustment annuity 采用调整后的 Form N-4，但不能外推到普通 FIA；产品分类、费用、退保调整和州法边界仍须读具体合同。Investor.gov 明确把年金界定为保险合同并说明收益可部分连接 benchmark，NAIC 则进一步明确 FIA 买方并非直接投资市场或指数。<Cite n={21} /><Cite n={22} /><Cite n={29} />
        </p>
        <p>
          因而“客户选择某个 10% risk-control index”不能翻译成“客户持有该指数的股票权重”；指数只可能是合同信用公式的一个输入。即使 FIA 的 term-end credited-interest floor 为 0%，退保费用与合同调整仍可能降低领取价值；RILA 的 buffer／floor 只在具体条款与计量时点内生效。两者都受税务与 insurer claims-paying ability 约束。<Cite n={21} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="insurer-hedge-book">
        <p className="section-kicker">40 · Insurer Asset／Hedge Book</p>
        <h2>保险公司可能用固定收益资产、期权、期货、掉期、抵押品与再保险管理合同义务，但公开文件通常不支持逐户、一比一、当日复制。</h2>
        <p>
          Allianz 的具体产品文件说明投保人不持有指数或成分证券；其 Index Options 对应的 Separate Account IANA 是未注册、非单位化、非隔离账户，可持现金、固收和期权等 hedge assets，不能与产品内注册且隔离的 Variable Options separate account 混同。RiverSource 的公司财报把 structured variable-annuity indexed account 义务视为 embedded derivative，并描述公司级独立股票／利率衍生品经济对冲、netting 与 collateral。两者支持“存在公司级 hedge book”，不支持从一份合同反推逐日 delta flow。<Cite n={33} /><Cite n={34} />
        </p>
        <p>
          保险人可跨产品、到期日和交易对手净额风险，也可容忍短期 basis 或利用再保险。市场研究若没有公司头寸或 dealer flow，只能把“可能的 hedge demand”列为候选通道，不能把它当已观察到的股票卖盘。
        </p>
      </section>

      <section className="lesson-section" id="three-procyclicality">
        <p className="section-kicker">阶段六 · 反馈、证据与案例　|　41 · 三种 Procyclicality</p>
        <h2>“顺周期”至少有三种含义：风险估计随冲击上升、目标 gross 反向收缩、真实订单与当期价格同向放大；前两层成立不保证第三层成立。</h2>
        <p>
          统计层：大冲击提高条件方差；政策层：固定风险预算把较高方差映射为较低 gross；市场层：若 agent 当前是多头并实际卖出、规模集中且承接不足，成交可能继续压价。空头回补、target 不变的漂移买入、外部申购或深度恢复都能切断最后一层。
        </p>
        <p>
          这种分层也防止把“volatility targeting 是顺周期的”误读成价值判断。策略可在单个账户上减少后续损失方差，却把一部分风险转移到成交窗口；系统稳定性取决于其他主体、流动性和规则同步，而非个体目标本身。<Cite n={11} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="destabilizing-feedback">
        <p className="section-kicker">42 · Destabilizing Feedback</p>
        <h2>当共同卖出降低价格、提高后续波动和相关性、再压低目标暴露时，风险控制会从被动响应变成自我强化回路。</h2>
        <div className="equation-card">
          <span>Focal-cohort 成交流与价格响应</span>
          <div>Q<sup>fill</sup><sub>i,t</sub>=Σ<sub>a∈A<sub>focal</sub></sub>ΔA<sup>fill</sup><sub>a,i,t</sub>；　R<sup>win</sup><sub>i,t</sub>=Λ<sub>i,t</sub>Q<sup>fill</sup><sub>i,t</sub>+u<sub>i,t</sub></div>
          <p>i 冻结同一资产／合约、基础货币和执行窗口；Q 只汇总研究 cohort 的带符号成交。R<sup>win</sup><sub>i,t</sub> 是该冻结执行窗口内的带符号价格收益，不是两个收益率之差。若 Q 用基础货币、R<sup>win</sup> 用收益或 bp，Λ 的单位是每单位货币的收益，u 与 R<sup>win</sup> 使用同一收益／bp 口径。结构冲击约定“正买入推高收益”时可冻结 Λ≥0；若 Λ 只是回归斜率，则不预设符号，u 与 Q 相关时也不能称为因果 impact。</p>
        </div>
        <p>
          正反馈需要足够大的“风险估计敏感度 × 目标弹性 × 同步资本 × 完成率 × impact”。Danielsson 等对风险监管和价格动态的模型说明市场敏感约束可能放大波动；Danielsson、Shin 与 Zigrand 又把这种由应对风险行为生成的系统风险概括为内生风险。两者都是条件理论，不是对现实 vol-control 的自动定罪。<Cite n={12} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="stabilizing-forces">
        <p className="section-kicker">43 · Stabilizing Forces 与负反馈</p>
        <h2>异质时钟、buffer、cap、低杠杆起点、空头回补、价值买盘、dealer inventory 与深度恢复都能降低或反转反馈。</h2>
        <p>
          若 agent 分散使用 1 日、20 日与 60 日估计器，订单不会完全同步；若 leverage cap 已绑定，波动从 4% 降到 3% 也不再加风险；若卖盘令价格相对价值显著折价，长期资本可能承接。策略还可能先前已经降到低仓位，后续波动再升时几乎没有可卖规模。
        </p>
        <p>
          因此稳定性必须状态化：相同波动冲击在高 leverage、窄 depth、同质规则和弱承接状态下危险，在低 exposure、宽 depth 和异质资本状态下影响有限。只以 VIX 或 realized vol 一个指标代理系统脆弱性，会遗漏最关键的库存与容量分布。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="causal-identification">
        <p className="section-kicker">44 · Causal Identification Ladder</p>
        <h2>从“波动升、市场跌”到“vol-control 卖盘放大下跌”，至少要跨过规则、持仓、订单、成交和价格反应五道证据门槛。</h2>
        <ol className="diagnostic-list">
          <li><b>规则证据：</b>冻结 estimator、lag、cap、buffer 与生效时点，证明理论 target 确实变化。</li>
          <li><b>暴露证据：</b>识别载体、AUM、signed actual exposure 与外部现金流，计算可执行 gap。</li>
          <li><b>订单证据：</b>分开 vol-order、申赎、margin、roll 与 discretionary flow。</li>
          <li><b>成交证据：</b>观察 fill、时间窗、工具、对手方、partial fill 与未成交订单簿事件。</li>
          <li><b>价格证据：</b>控制共同新闻和其他 flow，检验成交后的价格、depth 与 resiliency 响应。</li>
          <li><b>反馈证据：</b>验证由该价格响应引起的新风险估计和第二轮 target，而非事后循环叙事。</li>
        </ol>
        <p>
          指数权重是第一层的规则证据，经理收益最多是暴露的噪声代理，市场同期下跌是第五层的混合 outcome。缺少中间层时，应把结论降级为“与机制相容”，而不是用流畅故事补齐不可见数据。
        </p>
      </section>

      <section className="lesson-section" id="backtest-launch-boundary">
        <p className="section-kicker">45 · Backtest、Launch 与 Live Track Record</p>
        <h2>一条指数可以有很长的 base history，却在多年后才发布；launch 之前的数据是规则回算，不是当时可投资资金的真实成交。</h2>
        <p>
          每个案例应同时记录 base／backtest start、launch date 与 post-launch period。S&amp;P 500 Daily Risk Control 15% 指数的现行参数表列示 2009-09-10 launch；因此宣传材料中的 2008 数字是发布前回测。MSCI USA 10% Volatility Target 指数 2024-11-29 才 launch，其 2022 表现同理不能写成 live product history。<Cite n={15} /><Cite n={31} /><Cite n={38} />
        </p>
        <p>
          Backtest 仍可用于机制演示和反事实比较，但必须保留指数版本、回报口径、成本假设和 hindsight 风险。更不能由回测表现推断当时有相应 AUM、订单或市场冲击。<Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="feb-2018-case">
        <p className="section-kicker">46 · February 2018 · 规则例示而非流量识别</p>
        <h2>ECB 的 2018 图表比较标准化的 S&amp;P 500 与 15% risk-control 指数水平，邻接文字说明理论 exposure 在波动跃升后降至 1 以下；它展示政策顺周期，却没有观察实际基金订单。</h2>
        <p>
          ECB 记录 2018 年 2 月初美股一周约跌 6.5%、估计波动约 25%、VIX 到 32；Chart 2.5 画的是两条标准化指数水平，理论 exposure 低于 1 的判断来自邻接文字。观察到的是市场状态与规则指数结果，不是 risk-control fund 的 AUM、order 或 fill。<Cite n={23} />
        </p>
        <p>
          同期更直接的放大讨论主要涉及 inverse-VIX／short-vol 产品的损失和对冲。那是波动衍生品结构，不应被改名为 vol-targeting。这个案例最适合训练证据降级：规则与邻接文字可以支持“可能产生卖压”，不能支持“该 cohort 导致 Volmageddon”。<Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="march-2020-case">
        <p className="section-kicker">47 · March 2020 · Stylized Counterfactual</p>
        <h2>ECB 的“约 225% 初始资本出售”来自四资产、8% target、日频 equal-risk 模型的反事实需要量，不是观察到的行业成交或因果估计。</h2>
        <p>
          该模型在危机前杠杆可接近 2 倍，随后波动与相关性上升令多资产共同去杠杆；它说明高初始 gross 与相关性冲击怎样放大所需交易。ECB 同时强调行业规模、初始 leverage、校准与真实贡献不确定，所有数字都必须随模型条件出现。<Cite n={24} />
        </p>
        <p>
          RBA 的 2020 复盘判断 volatility-targeting funds 快速减仓并促成价格急跌，也指出股债相关转正带来附加出售；这是机构诊断而非订单级识别，且行业规模估计跨度很大。合格结论是“多份官方材料认为该通道可能重要”，不是“已证明出售了某个统一金额”。<Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="correlation-2022-case">
        <p className="section-kicker">48 · 2022 股债同跌 · 相关性反例</p>
        <h2>股债相关性转正会削弱分散、提高组合风险并增加触及限额的可能；现有官方材料不支持把 2022 跌市归因于 vol-targeting。</h2>
        <p>
          ECB 2022 的材料讨论 2021–2022 股债相关性上升及其对风险测量和再平衡的潜在影响，使用的是“可能”通道，而非识别出某类基金的销售量。S&amp;P 或 MSCI 指数的 2022 历史也只是规则结果：是否发布后、PR／TR／ER 口径和是否存在跟踪资金都要另查。<Cite n={26} />
        </p>
        <p>
          英国 LDI 事件则是有用的邻接反例：collateral call、gilt forced sale、价格下跌／收益率上升与进一步 call 构成真实反馈，但核心机制是负债久期 hedge、repo／derivative margin 与流动性缓冲，不是 risk-control index。相似的“卖出—风险上升”图形不等于同一 agent。<Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-debate">
        <p className="section-kicker">49 · 绩效证据为什么不统一</p>
        <h2>Volatility management 是否改善投资结果，取决于基础资产的条件收益—风险关系、估计器、缩放指数、融资、成本、样本与实时可用性。</h2>
        <p>
          Moreira–Muir 在历史因子样本中报告 inverse-variance 管理的 spanning alpha；Cederburg 等把范围扩到 103 个 equity strategies，并在实时与样本外设计中发现改善并不普遍，基础设定下多数策略的 OOS certainty-equivalent return 更低。DeMiguel、Martín-Utrera 与 Uppal 又用条件多因子权重和股票级净额成本，在其设定下得到样本外、扣成本仍有价值的反证。<Cite n={7} /><Cite n={9} /><Cite n={10} />
        </p>
        <p>
          三篇并非简单互相否定：M&amp;M 是 c/σ² 的单因子缩放，Cederburg 比较更广策略与实时构造，DeMiguel 是含 a+b/σ 成分的条件多因子配置。正确问题不是“vol targeting 永远有效吗”，而是“哪条 policy、对哪类回报、在何种信息与成本约束下提供样本外增量”。
        </p>
      </section>

      <section className="lesson-section" id="failure-modes">
        <p className="section-kicker">50 · Failure Modes</p>
        <h2>Vol-control 最常见的失败不是公式算错，而是低波动加杠杆、跳跃来不及、反弹追不上、成本吃掉收益，以及所有人同时使用同一风险输入。</h2>
        <p>
          平静期估计风险下降，倍率上升，系统在看似安全时累积 exposure；突发跳空先造成损失，策略只能事后降风险；快速 V 形恢复时，较高风险估计让组合保持低仓，可能错过反弹；噪声期则反复 target change，产生 spread、impact 与税费。Target 还可能因 cap、floor、buffer 或错误 covariance 长期偏离 outcome。<Cite n={11} />
        </p>
        <p>
          群体层面，同一数据供应、相似 EWMA 和共同收盘时钟会同步订单；个体层面的风险稳定可能以系统层面的流动性需求为代价。反之，若资产风险溢价在高波动期没有同比上升，减少高风险状态 exposure 又可能改善长期效用。两面必须在同一框架中评价。
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">51 · 可证伪研究协议</p>
        <h2>研究“vol-control 放大市场波动”时，先冻结 agent、policy 与时钟，再寻找从 target 到 fill 的中间证据；不要从价格结局倒推故事。</h2>
        <ol className="diagnostic-list">
          <li><b>冻结对象：</b>学术组合、指数、基金、合同和 insurer hedge book 分开建表。</li>
          <li><b>冻结 policy：</b>估计器、年化、target、exponent、cap、floor、buffer、lag 与 cash leg 版本化。</li>
          <li><b>保存 as-of：</b>只使用决策前可知的收益、参数、AUM、持仓和产品文件。</li>
          <li><b>重建 actual：</b>先更新价格、NAV、申赎、margin 与其他 sleeve，再计算 target−actual。</li>
          <li><b>区分意图与实现：</b>target、order、fill、cancel、cost 和 participation 分列。</li>
          <li><b>构造 focal cohort：</b>保留内部相互成交，排除 cohort 外对手方；逐资产保留多空符号。</li>
          <li><b>识别冲击：</b>控制共同新闻和其他资金流，使用规则阈值、实施滞后或外生参数变化寻找设计。</li>
          <li><b>预注册 falsifier：</b>若预测的 target 未变、actual gap 不存在或成交时点不符，就拒绝该机制解释。</li>
          <li><b>报告边界：</b>发布前回测、不可见净额、区间估计、容量和未成交订单簿效应全部显式披露。</li>
        </ol>
        <p>
          最有价值的产出不一定是一个显著系数，而可能是把“理论卖压”分解成可观察、不可观察与被数据否定的三部分。世界观允许多个反馈并存，具体研究则必须让某一局部链条可能被证伪。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">阶段七 · 实验与闭环　|　52 · 互动实验</p>
        <h2>十题沿同一状态链推进：先校准年化与 EWMA，再让漂移、空头、相关性、现金、成本和 cohort flow 改写订单。</h2>
        <p>
          每题都冻结单位、信息时点、忽略项与执行约定；答案唯一只在这些条件内成立。答对数值后，还要说明哪一个边界改变会令订单方向反转或让公式失效。
        </p>
        <p className="print-only">打印／PDF 说明：网页中的十题互动实验不会在无脚本环境运行；第 53 节提供同一冻结数据源的十道静态变式及完整答案，第 54 节的理解检查在打印时会展开。</p>
        <VolControlLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">53 · 主动练习 · 同数据静态变式</p>
        <h2>先写出 as-of 时点、单位、actual、target、带符号 order 与 cash，再展开答案；不要只凭方向直觉选择。</h2>
        <div className="practice-grid">
          {volControlScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">54 · 理解检查</p>
        <h2>如果不能从 forecast risk 一直走到 signed fill，并指出证据在哪一层中断，就还没有真正理解 vol-control agent。</h2>
        <details className="understanding-check"><summary>01 · 为什么 target volatility 不是结果保证？</summary><p>它是把估计风险映射到目标暴露的政策参数；估计误差、跳跃、lag、cap、floor、buffer、现金腿和执行偏差都会令事后波动偏离目标。</p></details>
        <details className="understanding-check"><summary>02 · 波动上升为什么不必产生股票卖单？</summary><p>还需当前为股票多头、新目标金额低于冲击后 actual、规则触发、使用股票或股指工具并实际成交；空头去风险反而买入。</p></details>
        <details className="understanding-check"><summary>03 · 为什么先算 post-shock actual？</summary><p>价格和现金回报已经改变资产金额与 NAV；订单是新 target amount 减当前 actual amount，不是新旧两个 target 之差。</p></details>
        <details className="understanding-check"><summary>04 · Inverse-vol 与 inverse-variance 有何不同？</summary><p>前者权重与 1/σ 成正比，后者与 1/σ² 成正比；后者对高波动变化更敏感，两者都不自动等于 risk parity。</p></details>
        <details className="understanding-check"><summary>05 · 个体波动不变为何仍可能减仓？</summary><p>多资产风险包含 covariance；正权重资产相关性上升会提高单位篮子风险并压低共同倍率。</p></details>
        <details className="understanding-check"><summary>06 · 为什么卖出增加 cash 却减少 NAV？</summary><p>在全额付款现货／基金份额的本金式账本中，卖出本金只是在 risky 与 cash 间转移，spread、fee 和 impact 等成本才减少 NAV；期货、掉期与期权必须按 premium、variation margin、collateral 和合约现金流另行记账，不能把 notional 当现金本金。</p></details>
        <details className="understanding-check"><summary>07 · Buffer 的收益与代价是什么？</summary><p>它过滤小幅 target 变化、减少 turnover，却让 actual 偏离理论目标，并可能在越过阈值时形成离散订单。</p></details>
        <details className="understanding-check"><summary>08 · Risk-control index weight 为什么不是 flow？</summary><p>指数只计算理论规则；还需真实跟踪规模、载体、current exposure、申赎、净额、lag、order 和 fill 才能推断成交。</p></details>
        <details className="understanding-check"><summary>09 · 年金客户是否持有参考指数？</summary><p>通常不是。客户持有对保险公司的合同权利，收益按与 benchmark 部分挂钩的公式记入；保险公司的资产与 hedge book 是另一层。</p></details>
        <details className="understanding-check"><summary>10 · 2020 的“225%”为何不能写成实际卖盘？</summary><p>它是 ECB 风格化四资产、8% target、日频模型在特定校准下的反事实 gross sale，不是行业 order 或 fill 数据。</p></details>
        <details className="understanding-check"><summary>11 · 如何区分统计顺周期与市场顺周期？</summary><p>平方冲击提高风险估计是统计层，目标 gross 下降是政策层；只有带符号成交在有限深度中进一步推动价格，才进入市场反馈层。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪“vol-control 放大了这次下跌”？</summary><p>若规则 target 未在正确 as-of 时点下降、cohort 没有相应多头 actual gap、没有同向 fills，或价格变化先于实施窗口且由共同新闻解释，就应拒绝该归因。</p></details>
      </section>

      <section className="lesson-section" id="glossary-interfaces">
        <p className="section-kicker">55 · Glossary、接口与闭环</p>
        <h2>本节最终产物不是一句“高波动减仓”，而是一张把测量、政策、账户、产品、成交与系统反馈逐层分开的 agent map。</h2>
        <div className="interface-grid">
          <article><span>回接 T03 / T08</span><h3>风险与时钟</h3><p>Variance、covariance、年化和 as-of cutoff 决定估计是否同量纲、可因果执行。</p></article>
          <article><span>回接 1.09 / 2.10</span><h3>订单与冲击</h3><p>Target 必须穿过 post-shock actual、order、fill、cash、cost 与 depth 才能成为市场输入。</p></article>
          <article><span>连接 2.12 / 2.16</span><h3>组合与治理</h3><p>下一节改变资产间 risk contribution；2.16 再引入 VaR、限额、授权与组织性强制交易。</p></article>
          <article><span>连接 7.08 / 7.24</span><h3>内生风险与测量</h3><p>后续把同步风险政策、流动性和反馈整合成系统状态，并转化成可检验指标。</p></article>
        </div>
        <div className="precision-note">
          <span>术语回查</span>
          <p>Realized／forecast／target／outcome 回到 05；EWMA、λ 与 estimator speed 回到 09–12；g、cap、floor 与 fallback 回到 14–17；cash、funding、PR／TR／ER 回到 18–19；post-shock actual、signed order 与 fill 回到 20–29；inverse-vol／inverse-variance／risk parity 回到 32–35；index、fund、annuity 与 hedge book 回到 36–40；procyclicality、focal cohort 与 causal ladder 回到 41–44。</p>
        </div>
        <p>
          最小复述应是：<b>截至决策前的收益与协方差形成单位篮子风险；目标风险除以该风险并经过 cap、floor、buffer 与 lag 得到理论倍率；价格和现金流先改变 actual 与 NAV，target−actual 才生成带符号订单；只有真实 fill 会改变该账户仓位并进入 focal-cohort 成交流；成交若在有限深度中推动价格和相关性，才可能把新的风险写回下一轮，而指数降权、合同记账或同步下跌本身都不足以证明这条因果链。</b>
        </p>
      </section>
    </>
  );
}

export const lesson211: LessonRecord = {
  slug: '2-11',
  id: '2.11',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Volatility Targeting / Vol-control：从风险估计到带符号订单与内生反馈',
  subtitle: '纠正“波动上升必然卖股”的直觉，追踪 estimator、target、post-shock actual、fill、现金腿、产品载体与市场反馈怎样闭合成可证伪机制',
  readingTime: '核心阅读约 110–130 分钟；互动实验快速 22–28／含复盘 40–50，主动练习核对 20–25／完整书写 35–45，理解检查快速 8–10／完整复述 15–20，课程接口 4 分钟；快速路径约 164–197 分钟，完整学习约 204–249 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T03；按需回看 T01、T08、1.07、1.09、1.20、2.09–2.10',
  updatedAt: '2026-08-30',
  revision: '2.11-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.11-r4',
      summary: '独立复核 56 节、14 张公式卡、10 道互动题与 10 道静态变式、38 条来源与 88 个邻接引文，并逐项核验风险估计与带符号订单、现金／衍生品账本、群体成交净流、现行指数规则、基金／年金／保险对冲分层及 2018／2020／2022 证据边界；P0–P3 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.11-r4',
      summary: '独立复核零基础术语与单位桥、56 节递进、公式白话与边界、10+10 题、12 道理解检查、损坏记录恢复、无默认答案、无脚本／打印降级、焦点与语义无障碍，以及 6／6／8／5 分层阅读路径和页内／外链行为；P0–P3 均为 0。',
    },
  ],
  previous: { slug: '2-10', label: '2.10 CTA / Trend Following' },
  next: { slug: '2-12', label: '2.12 Risk Parity' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与排除项' },
    { id: 'system-loop', label: '完整状态闭环' },
    { id: 'definition', label: 'Volatility Targeting 定义' },
    { id: 'risk-budget-return-forecast', label: '风险预算不是收益观点' },
    { id: 'four-volatilities', label: '四种波动率' },
    { id: 'units-annualization', label: 'Variance、Vol 与年化' },
    { id: 'information-cutoff', label: 'Information Cutoff' },
    { id: 'rolling-window', label: 'Rolling Volatility' },
    { id: 'ewma', label: 'Causal EWMA' },
    { id: 'volatility-clustering', label: 'Volatility Clustering' },
    { id: 'asymmetry-leverage-effect', label: 'Asymmetry 与 Leverage Effect' },
    { id: 'estimator-speed', label: 'Estimator Speed' },
    { id: 'jumps-stale-data', label: 'Jumps 与 Stale Data' },
    { id: 'target-multiplier', label: 'Target Multiplier' },
    { id: 'clip-cap-floor', label: 'Clip、Cap 与 Floor' },
    { id: 'zero-risk-fallback', label: 'Zero-risk 与 Fallback' },
    { id: 'target-not-guarantee', label: 'Target 不是保证' },
    { id: 'cash-funding-leg', label: 'Cash 与 Funding Leg' },
    { id: 'return-conventions', label: 'PR、TR 与 ER' },
    { id: 'post-shock-state', label: 'Post-shock Actual' },
    { id: 'target-actual-order', label: 'Target、Actual 与 Order' },
    { id: 'signed-exposure', label: 'Signed Exposure' },
    { id: 'price-direction-counterexamples', label: '价格方向反例' },
    { id: 'external-flows-netting', label: 'External Flows 与 Netting' },
    { id: 'rebalance-frequency', label: 'Rebalance Frequency' },
    { id: 'buffer-hysteresis', label: 'Buffer 与 Hysteresis' },
    { id: 'asymmetric-rebalancing', label: '非对称再平衡' },
    { id: 'fills-cash-cost', label: 'Fill、Cash 与 Cost' },
    { id: 'capacity-depth', label: 'Capacity 与 Depth' },
    { id: 'multi-asset-risk', label: 'Multi-asset Basket' },
    { id: 'covariance-correlation', label: 'Covariance 与 Correlation' },
    { id: 'risk-parity-boundary', label: 'Risk Parity 边界' },
    { id: 'taxonomy', label: '策略 Taxonomy' },
    { id: 'academic-vol-managed', label: 'Academic Vol-managed Portfolio' },
    { id: 'inverse-vol-vs-variance', label: 'Inverse-vol 与 Inverse-variance' },
    { id: 'risk-control-index', label: 'Risk-control Index' },
    { id: 'index-weight-vs-flow', label: 'Index Weight 与 Flow' },
    { id: 'fund-overlay', label: '真实基金与 Overlay' },
    { id: 'annuity-contract', label: 'FIA／RILA 合同' },
    { id: 'insurer-hedge-book', label: 'Insurer Hedge Book' },
    { id: 'three-procyclicality', label: '三种 Procyclicality' },
    { id: 'destabilizing-feedback', label: 'Destabilizing Feedback' },
    { id: 'stabilizing-forces', label: 'Stabilizing Forces' },
    { id: 'causal-identification', label: 'Causal Identification' },
    { id: 'backtest-launch-boundary', label: 'Backtest 与 Launch' },
    { id: 'feb-2018-case', label: 'February 2018' },
    { id: 'march-2020-case', label: 'March 2020' },
    { id: 'correlation-2022-case', label: '2022 股债同跌' },
    { id: 'evidence-debate', label: '绩效证据争论' },
    { id: 'failure-modes', label: 'Failure Modes' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'glossary-interfaces', label: 'Glossary 与接口' },
  ],
  Content: Lesson211Content,
  references: [
    { id: 1, authors: 'Robert F. Engle', year: '1982', accessedAt: '2026-08-30', title: 'Autoregressive Conditional Heteroscedasticity with Estimates of the Variance of United Kingdom Inflation', publication: 'Econometrica 50(4), 987–1007', url: 'https://doi.org/10.2307/1912773', use: '支持 ARCH 条件方差随历史平方冲击更新及信息时点；不支持股票特有不对称、固定目标规则或真实交易流。' },
    { id: 2, authors: 'Tim Bollerslev', year: '1986', accessedAt: '2026-08-30', title: 'Generalized Autoregressive Conditional Heteroskedasticity', publication: 'Journal of Econometrics 31(3), 307–327', url: 'https://doi.org/10.1016/0304-4076(86)90063-1', use: '支持 GARCH 冲击项、滞后方差与持续性；不表示任何具名指数采用 GARCH 或固定半衰期。' },
    { id: 3, authors: 'Andrew A. Christie', year: '1982', accessedAt: '2026-08-30', title: 'The Stochastic Behavior of Common Stock Variances: Value, Leverage and Interest Rate Effects', publication: 'Journal of Financial Economics 10(4), 407–432', url: 'https://doi.org/10.1016/0304-405X(82)90018-6', use: '支持公司价值下降、财务杠杆上升与股权方差不对称的证据；不能识别 vol-control 流量。' },
    { id: 4, authors: 'John Y. Campbell and Ludger Hentschel', year: '1992', accessedAt: '2026-08-30', title: 'No News Is Good News: An Asymmetric Model of Changing Volatility in Stock Returns', publication: 'Journal of Financial Economics 31(3), 281–318', url: 'https://doi.org/10.1016/0304-405X(92)90037-X', use: '支持 volatility-feedback 均衡机制和收益—波动不对称；模型不是观察到的基金卖盘。' },
    { id: 5, authors: 'Jeff Fleming, Chris Kirby and Barbara Ostdiek', year: '2001', accessedAt: '2026-08-30', title: 'The Economic Value of Volatility Timing', publication: 'Journal of Finance 56(1), 329–352', url: 'https://doi.org/10.1111/0022-1082.00327', use: '支持多资产 volatility timing 与 conditional covariance 对配置价值的历史证据；不提供普适、无成本的固定目标规则。' },
    { id: 6, authors: 'Jeff Fleming, Chris Kirby and Barbara Ostdiek', year: '2003', accessedAt: '2026-08-30', title: 'The Economic Value of Volatility Timing Using “Realized” Volatility', publication: 'Journal of Financial Economics 67(3), 473–509', url: 'https://doi.org/10.1016/S0304-405X(02)00259-3', use: '支持 realized-volatility forecast 在特定资产配置设计中的经济价值；估计器与真实交易成本仍须单独评估。' },
    { id: 7, authors: 'Alan Moreira and Tyler Muir', year: '2017', accessedAt: '2026-08-30', title: 'Volatility-Managed Portfolios', publication: 'Journal of Finance 72(4), 1611–1644', url: 'https://doi.org/10.1111/jofi.12513', use: '支持 c/预测方差的学术因子缩放及历史 spanning alpha；不是固定 target/vol 规则、实时产品或实际流量。' },
    { id: 8, authors: 'Alan Moreira and Tyler Muir', year: '2019', accessedAt: '2026-08-30', title: 'Should Long-Term Investors Time Volatility?', publication: 'Journal of Financial Economics 131(3), 507–527', url: 'https://doi.org/10.1016/j.jfineco.2018.09.011', use: '支持长期投资者在特定模型与历史数据中进行 volatility timing 的效用讨论；不保证短期尾部保护。' },
    { id: 9, authors: 'Scott Cederburg, Michael S. O’Doherty, Feifei Wang and Xuemin Yan', year: '2020', accessedAt: '2026-08-30', title: 'On the Performance of Volatility-Managed Portfolios', publication: 'Journal of Financial Economics 138(1), 95–117', url: 'https://doi.org/10.1016/j.jfineco.2020.04.015', use: '提供 103 个 equity strategies 的实时与样本外反证，说明 volatility management 并不普遍改善结果；不证明永远无效。' },
    { id: 10, authors: 'Victor DeMiguel, Alberto Martín-Utrera and Raman Uppal', year: '2024', accessedAt: '2026-08-30', title: 'A Multifactor Perspective on Volatility-Managed Portfolios', publication: 'Journal of Finance 79(6), 3859–3891', url: 'https://doi.org/10.1111/jofi.13395', use: '支持条件多因子配置在论文设定下的样本外及扣成本表现；其 a+b/σ 型权重既非 M&M 纯逆方差，也非标准固定目标指数。' },
    { id: 11, authors: 'Campbell R. Harvey, Edward Hoyle, Russell Korgaonkar, Sandy Rattray, Matthew Sargaison and Otto Van Hemert', year: '2018', accessedAt: '2026-08-30', title: 'The Impact of Volatility Targeting', publication: 'Journal of Portfolio Management 45(1), 14–33', url: 'https://doi.org/10.3905/jpm.2018.45.1.014', use: '支持 volatility targeting 的暴露、绩效与市场反馈通道讨论；行业规模与冲击结论依赖模型和代理。' },
    { id: 12, authors: 'Jón Daníelsson, Hyun Song Shin and Jean-Pierre Zigrand', year: '2012', accessedAt: '2026-08-30', title: 'Endogenous Extreme Events and the Dual Role of Prices', publication: 'Annual Review of Economics 4, 111–129', url: 'https://doi.org/10.1146/annurev-economics-080511-110930', use: '支持风险测量与应对行为可把风险内生化的系统框架；不是现实 vol-control 因果估计。' },
    { id: 13, authors: 'Markus K. Brunnermeier and Lasse Heje Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '支持融资约束、市场流动性与 margin spiral 的条件反馈；不能把所有 risk-control 减仓称为流动性螺旋。' },
    { id: 14, authors: 'S&P Dow Jones Indices', year: '2026', accessedAt: '2026-08-30', title: 'Index Mathematics Methodology', publication: 'Official methodology, August 2026', url: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-index-math.pdf', use: '支持 S&P risk-control 通用倍率、估计器、现金／融资、dynamic rebalance、lag 与 target 非保证边界；具体指数参数须另查。' },
    { id: 15, authors: 'S&P Dow Jones Indices', year: '2026', accessedAt: '2026-08-30', title: 'S&P Risk Control Indices — Parameters', publication: 'Official parameter table, July 2026', url: 'https://www.spglobal.com/spdji/en/documents/additional-material/sp-risk-control-indices-parameters.pdf', use: '支持具名 S&P risk-control 指数的 target、cap、decay、lag、rebalance 与 launch date；一个 ticker 的参数不能推广全家族。' },
    { id: 16, authors: 'MSCI', year: '2024', accessedAt: '2026-08-30', title: 'MSCI Risk Control Indexes Methodology', publication: 'Official methodology, December 2024', url: 'https://www.msci.com/documents/10199/538a16c6-6fa7-3244-e438-1eb09f8e2609', use: '支持标准方法的 20/60 日估计择高、150% cap、t−2 lag、5% buffer 及 TR/ER 现金与融资口径；Appendix III 另允许定制 EWMA、费用与交易成本，不能推广到每条具名指数。' },
    { id: 17, authors: 'FTSE Russell', year: '2026', accessedAt: '2026-08-30', title: 'FTSE Futures Volatility Target Index Series Ground Rules, v1.2', publication: 'Official ground rules, July 2026', url: 'https://www.lseg.com/content/dam/ftse-russell/en_us/documents/ground-rules/ftse-futures-volatility-target-index-series-ground-rules.pdf', use: '支持期货型目标波动系列的 buffer、lag、cash、cost／decrement 与具名参数；TC=0 的指数输入不等于现实无成本。' },
    { id: 18, authors: 'S&P Dow Jones Indices', year: 'n.d.', accessedAt: '2026-08-30', title: 'Risk Control Indices', publication: 'Official index family page', url: 'https://www.spglobal.com/spdji/en/index-family/multi-asset/managed-volatility/risk-control/', use: '支持 launch 前数据为 hypothetical back-tested 及其 hindsight 等局限；指数历史不是基金实盘或成交。' },
    { id: 19, authors: 'S&P Dow Jones Indices', year: '2025', accessedAt: '2026-08-30', title: 'S&P Risk Control 2.0 Indices Methodology', publication: 'Official methodology, November 2025', url: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-risk-control-2-indices.pdf', use: '支持 Risk Control 2.0 用流动性债券指数替代标准 cash portion，反驳所有 risk-control 都只是股票／现金。' },
    { id: 20, authors: 'Nationwide Variable Insurance Trust', year: '2026', accessedAt: '2026-08-30', title: 'NVIT Managed American Funds Growth-Income Fund — Summary Prospectus', publication: 'Summary prospectus dated 30 April 2026; filed with the SEC 24 April 2026', url: 'https://www.sec.gov/Archives/edgar/data/353905/000119312526177199/d120368d497k.htm', use: '真实基金实例：core fund、stock-index futures overlay、现金／短债与 margin；不能推广成全部产品或保证命中目标。' },
    { id: 21, authors: 'U.S. Securities and Exchange Commission, Investor.gov', year: 'n.d.', accessedAt: '2026-08-30', title: 'Annuities', publication: 'Official investor education page', url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/annuities', use: '支持 FIA 与 RILA 的产品分类、保险合同性质及收益／损失边界；不单独支持“直接投资指数”的否定，也不能替代具体合同或州法。' },
    { id: 22, authors: 'National Association of Insurance Commissioners', year: '2022', accessedAt: '2026-08-30', title: 'Buyer’s Guide to Fixed Deferred Annuities', publication: 'NAIC consumer guide', url: 'https://content.naic.org/sites/default/files/publication-anb-lp-consumer-annuities-fixed.pdf', use: '支持 FIA 买方并非直接投资市场或指数及合同风险；2026 修订草案不能冒充已生效规则。' },
    { id: 23, authors: 'European Central Bank', year: '2018', accessedAt: '2026-08-30', title: 'Financial Stability Review, May 2018', publication: 'ECB Financial Stability Review, Chapter 2, Chart 2.5', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/html/ecb.fsr201805.en.html', use: '支持 2018-02 市场状态及 risk-control 指数理论 leverage 下调的规则例示；不提供实际 RC 资金成交或因果贡献。' },
    { id: 24, authors: 'European Central Bank', year: '2020', accessedAt: '2026-08-30', title: 'Volatility-targeting Strategies and the Market Sell-off', publication: 'ECB Financial Stability Review, May 2020, Box 2', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2020/html/ecb.fsrbox202005_02~f6616db9be.en.html', use: '支持四资产、8% target 风格化反事实及约 225% gross sale 机制；数字不是观察成交或因果估计。' },
    { id: 25, authors: 'Reserve Bank of Australia', year: '2020', accessedAt: '2026-08-30', title: 'Risks from Investment Funds and the COVID-19 Pandemic', publication: 'Financial Stability Review, October 2020, Box A', url: 'https://www.rba.gov.au/publications/fsr/2020/oct/box-a-risks-from-investment-funds-and-the-covid-19-pandemic.html', use: '支持 RBA 对快速去杠杆与股债相关转正附加出售的机构诊断；不是订单级识别且规模估计不确定。' },
    { id: 26, authors: 'Benjamin Mosk, Lorenzo Pangallo and Sebastiano Michele Zema', year: '2022', accessedAt: '2026-08-30', title: 'Cross-asset Correlations in a More Inflationary Environment and Challenges for Diversification Strategies', publication: 'ECB Financial Stability Review, November 2022, Box 2', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2022/html/ecb.fsrbox202211_02~7abb48e333.en.html', use: '支持股债相关上升、分散弱化与触及风险限额的可能通道；不支持 vol-targeting 导致 2022 跌市。' },
    { id: 27, authors: 'Bank of England', year: '2022', accessedAt: '2026-08-30', title: 'Financial Stability Report — December 2022', publication: 'Bank of England official report', url: 'https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022', use: '支持英国 LDI 的 collateral-call—forced gilt sale—进一步 call 反馈；这是 margin／liquidity 机制，不是 risk-control index 案例。' },
    { id: 28, authors: 'Bank of England', year: '2024', accessedAt: '2026-08-30', title: 'System-wide Exploratory Scenario — Final Report', publication: 'Bank of England, 29 November 2024', url: 'https://www.bankofengland.co.uk/-/media/boe/files/financial-stability/system-wide-exploratory-scenario/boe-swes-final-report.pdf', use: '支持压力情景下风险限额、volatility 与带符号去杠杆；已有空头可通过买回减仓，且情景结果不是历史因果估计。' },
    { id: 29, authors: 'U.S. Securities and Exchange Commission', year: '2024', accessedAt: '2026-08-30', title: 'Registration for Index-Linked Annuities and Registered Market Value Adjustment Annuities; Amendments to Form N-4 for Index-Linked Annuities, Registered Market Value Adjustment Annuities, and Variable Annuities; Other Technical Amendments', publication: 'SEC Release No. 33-11294', url: 'https://www.sec.gov/files/rules/final/2024/33-11294.pdf', use: '支持 RILA／registered MVA annuity 的披露与注册框架；不能外推到普通 FIA 或取代州保险法。' },
    { id: 30, authors: 'Torben G. Andersen, Tim Bollerslev, Francis X. Diebold and Paul Labys', year: '2003', accessedAt: '2026-08-30', title: 'Modeling and Forecasting Realized Volatility', publication: 'Econometrica 71(2), 579–625', url: 'https://doi.org/10.1111/1468-0262.00418', use: '支持基于高频收益构造 realized volatility 及其预测研究；本节只调用测量直觉，不展开微观结构噪声全套模型。' },
    { id: 31, authors: 'S&P Dow Jones Indices', year: '2025', accessedAt: '2026-08-30', title: 'S&P 500 Engle 15% VT TCA Index', publication: 'Official brochure, ©2025; data through 30 June 2025', url: 'https://www.spglobal.com/spdji/en/documents/brochure/brochure-sp-500-engle-15-vt-tca-index.pdf', use: '支持命名指数材料中的历史比较及 return-convention 检查；2008 数字为发布前回测，且比较栏口径不能无条件视为一致。' },
    { id: 32, authors: 'MassMutual Ascend Life Insurance Company', year: '2026', accessedAt: '2026-08-30', title: 'Index Frontier 5 Plus — Summary Prospectus', publication: 'Summary prospectus dated and effective 1 May 2026; filed with the SEC 29 April 2026', url: 'https://www.sec.gov/Archives/edgar/data/723258/000119312526191124/d59347dex9927o1.htm', use: '具体 RILA 合同实例：不直接投资指数、buffer/floor 仍允许损失、义务依赖保险人偿付能力；不能推广全行业条款。' },
    { id: 33, authors: 'Allianz Life Insurance Company of North America', year: '2026', accessedAt: '2026-08-30', title: 'Index Advantage NF Variable Annuity Prospectus', publication: 'Prospectus dated and effective 1 May 2026; filed with the SEC 22 April 2026 (accession header; preprint cover states 21 April)', url: 'https://www.sec.gov/Archives/edgar/data/72499/000007249926000030/indadvnf485b.htm', use: '支持投保人不持有指数、无成分证券权利，以及 Index Options 对应的未注册、非单位化、非隔离 Separate Account IANA hedge assets；不支持逐户一比一对冲。' },
    { id: 34, authors: 'RiverSource Life Insurance Company', year: '2026', accessedAt: '2026-08-30', title: 'RiverSource Guaranteed Term Annuity — Post-Effective Amendment No. 4 to Form N-4', publication: 'File No. 333-286516; filed 27 April 2026, effective 1 May 2026; incorporates RiverSource Life financial statements', url: 'https://www.sec.gov/Archives/edgar/data/727892/000119312526181635/d122959d485bpos.htm', use: '公司财报支持 structured variable-annuity indexed-account embedded derivatives、独立股票／利率衍生品经济对冲、netting 与 collateral；不能反推单份合同逐日 flow。' },
    { id: 35, authors: 'Rama Cont, Arseniy Kukanov and Sasha Stoikov', year: '2014', accessedAt: '2026-08-30', title: 'The Price Impact of Order Book Events', publication: 'Journal of Financial Econometrics 12(1), 47–88', url: 'https://doi.org/10.1093/jjfinec/nbt003', use: '支持 limit-order、market-order 与 cancellation 等订单簿事件都可能影响价格；本文仍把 fill 成本账本与未成交事件账本分开。' },
    { id: 36, authors: 'Sara Pollock', year: '2025', accessedAt: '2026-08-30', title: 'Demystifying Volatility-Controlled Indices', publication: 'S&P Dow Jones Indices Education, 26 August 2025', url: 'https://www.spglobal.com/spdji/en/education/article/demystifying-volatility-controlled-indices/', use: '支持 volatility-controlled index 的基础机制、理论现金配置及暴露变化带来的上下行参与差异；教育文章不替代具体产品方法。' },
    { id: 37, authors: 'Jón Daníelsson, Hyun Song Shin and Jean-Pierre Zigrand', year: '2004', accessedAt: '2026-08-30', title: 'The Impact of Risk Regulation on Price Dynamics', publication: 'Journal of Banking & Finance 28(5), 1069–1087', url: 'https://doi.org/10.1016/S0378-4266(03)00113-4', use: '支持市场敏感风险约束与价格反馈可能形成正反馈的模型；不是 fixed-target vol-control 或现实因果识别。' },
    { id: 38, authors: 'MSCI', year: '2026', accessedAt: '2026-08-30', title: 'MSCI USA 10% Volatility Target Index (USD) — Factsheet', publication: 'Official factsheet, 31 March 2026', url: 'https://www.msci.com/documents/10199/6f2f7b7e-97a1-522c-525b-8f87f7d01100', use: '支持 2024-11-29 launch date 及早期年份属于 backtest 的边界；指数历史不是基金或客户实盘。' },
  ],
  readingList: [
    { title: '本节 03–29 · Mechanism Core', scope: '四种波动、EWMA、target multiplier、actual drift、signed order、cash 与 fill', reason: '先闭合从 estimator 到账户的主链，再进入产品和案例。', url: '#definition', group: 'core', guide: '按顺序精读并手算公式卡；约 90–120 分钟。' },
    { title: 'Moreira & Muir (2017)', scope: '§I.B、eqs.(1)–(2)、Table I 与识别逻辑', reason: '理解 academic inverse-variance policy，并守住它与 fixed target/vol 的边界。', url: 'https://doi.org/10.1111/jofi.12513', group: 'core', guide: '先读本节 34–35；约 120–180 分钟。' },
    { title: 'S&P Index Mathematics · Risk Control', scope: 'pp.39–52 的倍率、波动、现金、动态阈值与多资产扩展', reason: '从官方数学看一条规则如何落到指数值，而非停留在营销描述。', url: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-index-math.pdf', group: 'core', guide: '与 July 2026 参数表并读；约 90–120 分钟。' },
    { title: 'MSCI Risk Control Methodology · December 2024', scope: '20/60 日择高、t−2 lag、5% buffer、TR/ER、融资与 Appendix III 定制项', reason: '比较另一套现行规则，看到标准方法与 custom options 怎样改变路径。', url: 'https://www.msci.com/documents/10199/538a16c6-6fa7-3244-e438-1eb09f8e2609', group: 'core', guide: '先读 §§3–7 和附录；约 60–90 分钟。' },
    { title: 'FTSE Futures Volatility Target Ground Rules', scope: '期货型 exposure、buffer、lag、cost／cash components 与 launch dates', reason: '理解期货实现不能被简化为卖出现货股票。', url: 'https://www.lseg.com/content/dam/ftse-russell/en_us/documents/ground-rules/ftse-futures-volatility-target-index-series-ground-rules.pdf', group: 'core', guide: '重点读 §4 与 Appendix B；约 60–90 分钟。' },
    { title: 'Cederburg et al. (2020)', scope: '103 个 equity strategies、实时设计与 OOS CER', reason: '为“vol management 普遍提高表现”建立严肃反证。', url: 'https://doi.org/10.1016/j.jfineco.2020.04.015', group: 'core', guide: '与 Moreira–Muir 对读；约 150–210 分钟。' },
    { title: 'Engle (1982)', scope: 'ARCH 条件方差的定义、信息集与估计', reason: '理解波动为什么是状态变量，而非固定常数。', url: 'https://doi.org/10.2307/1912773', group: 'models', guide: '先读 §2 与 eqs.(1)–(3)；约 120–180 分钟。' },
    { title: 'Bollerslev (1986)', scope: 'GARCH(1,1)、持续性与平稳条件', reason: '理解冲击为什么会通过方差状态延续。', url: 'https://doi.org/10.1016/0304-4076(86)90063-1', group: 'models', guide: '重点读 §§2–3；约 120–180 分钟。' },
    { title: 'Campbell & Hentschel (1992)', scope: 'volatility feedback 与坏消息不对称', reason: '把均衡折现率机制与 vol-control 订单反馈分开。', url: 'https://doi.org/10.1016/0304-405X(92)90037-X', group: 'models', guide: '先抓模型因果方向，再读实证；约 150–210 分钟。' },
    { title: 'Fleming, Kirby & Ostdiek (2003)', scope: 'realized-volatility timing 与经济价值', reason: '把波动测量连接到配置，同时审计估计和成本边界。', url: 'https://doi.org/10.1016/S0304-405X(02)00259-3', group: 'models', guide: '先修 T03；约 150–210 分钟。' },
    { title: 'Daníelsson, Shin & Zigrand (2004)', scope: '风险约束—价格动态的正反馈模型', reason: '理解个体风险规则怎样可能转成系统风险，又为何不是必然。', url: 'https://doi.org/10.1016/S0378-4266(03)00113-4', group: 'models', guide: '与本节 41–44 对读；约 150–210 分钟。' },
    { title: 'Brunnermeier & Pedersen (2009)', scope: 'funding liquidity、market liquidity 与 margin spiral', reason: '把局部 vol-control flow 接入更广的资产负债表反馈。', url: 'https://doi.org/10.1093/rfs/hhn098', group: 'models', guide: '先修 T06、1.20；约 180–240 分钟。' },
    { title: 'DeMiguel, Martín-Utrera & Uppal (2024)', scope: '条件多因子权重、OOS 与股票级净额成本', reason: '看到 Cederburg 之后的反证，并区分第三类 policy。', url: 'https://doi.org/10.1111/jofi.13395', group: 'evidence', guide: '重点读 §I 与成本构造；约 150–210 分钟。' },
    { title: 'ECB May 2018 FSR', scope: 'Chart 2.5 的市场状态与 RC 理论 leverage', reason: '练习把规则例示与真实流量识别分开。', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/html/ecb.fsr201805.en.html', group: 'evidence', guide: '只读图表邻接文字并记录证据层级；约 30–45 分钟。' },
    { title: 'ECB May 2020 Box 2', scope: '四资产、8% target 与 225% stylized gross sale', reason: '学习怎样使用系统反事实而不把模型数字写成观察成交。', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2020/html/ecb.fsrbox202005_02~f6616db9be.en.html', group: 'evidence', guide: '逐项抄录假设与不确定性；约 45–60 分钟。' },
    { title: 'RBA October 2020 Box A', scope: '基金去杠杆、股债相关转正与规模不确定性', reason: '把监管判断、二手规模估计和因果识别分层。', url: 'https://www.rba.gov.au/publications/fsr/2020/oct/box-a-risks-from-investment-funds-and-the-covid-19-pandemic.html', group: 'evidence', guide: '与 ECB 2020 对读；约 45–60 分钟。' },
    { title: 'ECB (2022) · Cross-asset Correlations in a More Inflationary Environment', scope: '股债相关性、分散失效与风险限额可能通道', reason: '训练拒绝把“可能再平衡”升级成“已识别卖压”。', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2022/html/ecb.fsrbox202211_02~7abb48e333.en.html', group: 'evidence', guide: '读原文模态词与图表边界；约 30–45 分钟。' },
    { title: 'Bank of England SWES (2024)', scope: '风险限额、volatility 与长短仓去杠杆', reason: '用参与者压力情景直接检验“deleveraging 总是卖出”的错误直觉。', url: 'https://www.bankofengland.co.uk/-/media/boe/files/financial-stability/system-wide-exploratory-scenario/boe-swes-final-report.pdf', group: 'evidence', guide: '重点读 Appendix 4；约 60–90 分钟。' },
    { title: 'NVIT 2026 Summary Prospectus', scope: '真实 fund sleeve、stock-index futures overlay、cash／short bonds 与 margin', reason: '观察指数规则之外，真实载体怎样产生可执行订单。', url: 'https://www.sec.gov/Archives/edgar/data/353905/000119312526177199/d120368d497k.htm', group: 'evidence', guide: '重点读 pp.1–4 与风险披露；约 45–60 分钟。' },
    { title: 'RiverSource 2026 Filing', scope: 'embedded derivative、economic hedge、netting 与 collateral', reason: '理解保险公司 hedge book 不能由单份合同逐户反推。', url: 'https://www.sec.gov/Archives/edgar/data/727892/000119312526181635/d122959d485bpos.htm', group: 'evidence', guide: '重点读 Notes 17–18；约 45–75 分钟。' },
    { title: 'S&P Risk Control Parameters · July 2026', scope: '具名指数 target、cap、decay、lag 与 launch', reason: '建立参数版本与 backtest／live 分界。', url: 'https://www.spglobal.com/spdji/en/documents/additional-material/sp-risk-control-indices-parameters.pdf', group: 'rules', guide: '不要把单个 ticker 参数推广到全家族；约 45–60 分钟。' },
    { title: 'Investor.gov · Annuities', scope: 'FIA、RILA、合同收益与损失边界', reason: '从官方入口建立“合同持有人不是指数投资者”的边界。', url: 'https://www.investor.gov/introduction-investing/investing-basics/investment-products/annuities', group: 'rules', guide: '再按具体产品读取 prospectus 与州法；约 30–45 分钟。' },
    { title: 'NAIC Buyer’s Guide', scope: 'fixed deferred annuity、indexed crediting 与消费者风险', reason: '补足州保险制度与合同语义，同时避免把 model guidance 当全国统一法律。', url: 'https://content.naic.org/sites/default/files/publication-anb-lp-consumer-annuities-fixed.pdf', group: 'rules', guide: '核对版本，2026 草案不作已生效规则；约 45–60 分钟。' },
    { title: 'SEC Release 33-11294', scope: 'RILA 与 registered MVA annuity 的 Form N-4 披露', reason: '精确区分注册证券型年金与普通 FIA。', url: 'https://www.sec.gov/files/rules/final/2024/33-11294.pdf', group: 'rules', guide: '重点读 scope、effective 与 compliance dates；约 60–90 分钟。' },
    { title: 'MSCI USA 10% Volatility Target Factsheet', scope: 'underlying、return type、base、launch 与 live period', reason: '把通用方法落实到一个命名对象，防止历史回测冒充实盘。', url: 'https://www.msci.com/documents/10199/6f2f7b7e-97a1-522c-525b-8f87f7d01100', group: 'rules', guide: '建立一页 version ledger；约 30–45 分钟。' },
  ],
};
