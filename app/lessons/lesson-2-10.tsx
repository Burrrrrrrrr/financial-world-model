import TrendFollowingLab from '../components/TrendFollowingLab';
import { trendFollowingScenarios } from '../components/trendFollowingScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson210Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Trend following 的 agent 机制不是“过去上涨，所以未来一定上涨”，而是把截至决策时点可见的自身价格路径转换成受风险约束的目标头寸，再把目标与现仓之差变成真实订单。</h2>
        <p>
          一条完整趋势策略至少经历四次转换：可交易合约的历史收益先变成方向信号，方向信号再经合约规格、波动和相关性变成目标合约数，目标合约数与当前持仓之差才成为订单，订单成交后的逐日损益、成本、抵押品和权益状态又反过来改变下一轮规模。于是“信号为多”不等于“今天买入”：如果现仓已经等于目标，订单可以为零；如果方向仍为多但波动上升或权益下降，今天反而可能卖出减仓。<Cite n={10} /><Cite n={11} /><Cite n={16} />
        </p>
        <p>
          这条规则在个体层面只是状态依赖的风险政策，在群体层面却可能成为价格反馈。许多参与者若在同一方向逐步加仓，订单可能延续已有移动；若价格突然反转、预测波动上升或风险资本收缩，同一规则又会生成平仓、翻向和共同去杠杆。正反馈并不自动证明价格偏离基本面，更不能把任何趋势都归因于 CTA；要完成因果识别，仍需共同持仓、时点一致的约束变化、订单方向与价格回写证据。<Cite n={6} /><Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与排除项</p>
        <h2>硬先修只有 T01；本节解释从 policy 到 order 的机制，不提供可直接交易的指标配方，也不把 2.11 的 vol-control 系统或 6.13 的行为信念提前重讲。</h2>
        <p>
          T01 负责 price、return 与 log return；按需回看 T03 的方差与协方差、T07 的 futures 最小基础、T08 的时间尺度、1.09 的 price impact、1.20 的 margin 与 forced liquidation，以及 2.09 对 signal、target、actual holdings 的区分。本节以期货作为主要实现载体，因为跨股票指数、利率、外汇和商品的标准化合约能把方向信号连接到 multiplier、settlement、margin 与 roll；这不表示所有 CTA 只交易期货，也不表示所有期货策略都是趋势跟踪。
        </p>
        <div className="learning-objectives">
          <span>八阶段学习路线 · 从滞后路径到内生订单</span>
          <ol>
            <li><b>身份与策略边界（03–09）：</b>分开 CTA、managed futures、trend following、time-series momentum 与 cross-sectional momentum。</li>
            <li><b>趋势与反馈（10–14）：</b>区分趋势持续的候选机制、规则性正反馈、长期反转与因果识别。</li>
            <li><b>信号生产（15–24）：</b>冻结信息截止、可交易收益链、lookback、速度、饱和、转折和 carry 污染。</li>
            <li><b>目标组合（25–36）：</b>把合约规格、单位风险、取整、波动、相关性与 sector budget 接入目标仓位。</li>
            <li><b>期货现金流（37–44）：</b>闭合逐日损益、margin、collateral、NAV、basis、calendar spread、roll 和连续合约。</li>
            <li><b>实现与反馈（45–52）：</b>从 turnover、成本、容量和 ΔN 走到共同加仓、whipsaw 与权益去杠杆。</li>
            <li><b>案例与识别（53–58）：</b>条件化 crisis alpha，并用 2008、2022、2018／2020 和 2010s 弱期训练证据等级。</li>
            <li><b>实验与接口（59–62）：</b>用 10+10 题、理解检查和课程接口重建完整状态循环。</li>
          </ol>
          <p><b>主体与订单术语桥：</b>agent 是会根据自身目标和约束采取行动的市场主体；policy 是把可见状态映射成行动的规则。Signal 是规则对已知数据的压缩；target position 是规则希望持有的仓位；actual position 是当前真实持仓；order 是二者之差经过取整和可行性过滤后的交易指令；fill 是 order 中真正成交的部分。只有 fill 会直接改变该账户持仓并进入本文按成交定义的 turnover 与成本账本；未成交限价单的提交、修改或撤销虽不进入该 fill 账本，仍可能改变 best quote、mid、depth 与其他参与者行为，必须作为 order-book event 另行记录。</p>
          <p><b>期货与账户术语桥：</b>contract multiplier 把一个报价点转换成现金；notional 是合约数、乘数与价格水平组合出的名义规模；roll 是在到期风险到来前平掉旧月份合约并建立后续月份合约；FX 是 foreign exchange，这里主要指报价币现金向账户基准币的汇率换算；FCM 是 futures commission merchant，即承接客户期货账户、保证金与清算流程的中介。Variation margin 是逐日结算现金流；initial margin requirement 是开仓所需合格抵押品要求，maintenance margin 是持仓期间最低权益门槛，二者都不是买入价款或最大损失，为满足要求提交的 collateral 也不能与要求本身混为一谈。</p>
          <p><b>组合术语桥：</b>gross 是多空头寸绝对规模之和，不保留净方向；sleeve 是大组合中的一个子组合。后文的 DV01 指利率每变动 1 bp 所对应的近似现金价值变化；quanto 指标的资产与结算币种不同、汇率关系由合约预先规定的衍生结构；Greeks 是期权或其他非线性衍生品价值对价格、波动和时间等输入的局部敏感度。这些都是风险换算语言，不是收益预测。</p>
          <p><b>缩写桥：</b>CTA 是 commodity trading advisor；CPO 是 commodity pool operator；TSMOM 是 time-series momentum；MA 是 moving average；NAV 是 net asset value；IM／MM 分别是 initial／maintenance margin；COT 是 Commitments of Traders；ADV／OI 是 average daily volume／open interest；AUM 是 assets under management（管理资产规模）；OTC 是 over-the-counter（场外交易）；GFC 是 global financial crisis（全球金融危机）；1 bp=0.01%=0.0001。</p>
          <p><b>五个“不等同”：</b>CTA ≠ trend follower；managed futures ≠ 单一策略；trend signal ≠ 未来价格点预测；futures notional ≠ margin ≠ 最大损失；crisis alpha ≠ 每次股灾都会获利。</p>
        </div>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">02 · 完整状态闭环</p>
        <h2>趋势 agent 的最小分析单位是一条“信息集—信号—目标仓位—订单—结算—风险再缩放”的循环，而不是一条回测收益曲线。</h2>
        <div className="mechanism-chain" aria-label="趋势策略从信息到反馈的八步因果链">
          <div><span>01</span><b>冻结信息集</b><p>只读截至 t−1 可知的合约、规格、roll、价格和汇率版本。</p></div>
          <div><span>02</span><b>生成方向信号</b><p>自身历史收益、MA 或线性 filter 输出有界的方向与强度。</p></div>
          <div><span>03</span><b>换算单位风险</b><p>multiplier、tick、FX、波动和相关性决定每张合约的风险。</p></div>
          <div><span>04</span><b>构造目标仓位</b><p>风险预算、sector cap、margin、容量和整数合约限定可行目标。</p></div>
          <div><span>05</span><b>得到真实订单</b><p>ΔN=target−actual；roll、重估和信号变化分别记录。</p></div>
          <div><span>06</span><b>执行与结算</b><p>spread、fee、impact 与每日 settlement variation 进入现金流。</p></div>
          <div><span>07</span><b>更新权益与风险</b><p>NAV、collateral、波动、相关性和 margin headroom 改变可行集。</p></div>
          <div><span>08</span><b>聚合并反馈</b><p>加仓、减仓或翻向成为价格输入，再改变下一轮信号与风险。</p></div>
        </div>
        <p>
          任一环缺失都会制造幻觉：把 back-adjusted 连续价格当可成交价格，会伪造 roll 现金流；用今日收盘生成信号并按同一收盘成交，会制造前视；只看 signal 而忽略 actual holdings，会把“持有”误当“买入”；只按单市场波动配仓而忽略相关性，会把分散化当成常数。<Cite n={5} /><Cite n={16} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="cta-identity">
        <p className="section-kicker">阶段一 · 身份与策略边界　|　03 · CTA 是什么</p>
        <h2>CTA 首先是美国商品利益咨询活动的法律与业务身份，不是一条“均线交叉”或“趋势跟踪”的策略标签。</h2>
        <p>
          CFTC 与 NFA 对 CTA 的入口围绕“为报酬或利润，就 commodity interests 的交易价值或可取性向他人提供建议”等活动，并伴随注册或适用豁免；具体主体仍须按业务事实和现行规则判断。本节只需要一个边界：注册身份描述谁在提供何种商品利益建议，不能从身份直接推断模型、速度、持仓或风险预算。<Cite n={1} /><Cite n={2} />
        </p>
        <p>
          因而“CTA 买入了债券”这类新闻语句常把监管身份、产品包装和策略风格压成一个词。一个 CTA 可以运行趋势、carry、relative value 或多模型组合；一个趋势模型也可能存在于不以 CTA 身份对外经营的自营或多策略机构。分析订单之前必须先问：这里的 CTA 指注册主体、经理指数成分、透明规则代理，还是媒体对系统化宏观资金的泛称？
        </p>
      </section>

      <section className="lesson-section" id="managed-futures">
        <p className="section-kicker">04 · Managed Futures</p>
        <h2>Managed futures 是行业产品标签，通常指主要以期货及产品授权允许的其他衍生品实施的管理型投资；它不等同于美国法规中对 commodity interests 的完整法律范围。</h2>
        <p>
          投资者可能通过 separately managed account 或 commingled pool 获得此类暴露：以业务方式向他人提供有偿商品利益交易建议或裁量账户进入 CTA 分析，经营并募集共同资金池则进入 CPO 分析；多个独立账户采用相同策略本身不会把它们自动合并成 pool，具体身份仍取决于事实与现行规则。产品的流动性、费用、估值、现金管理和赎回条款必须从各自文件读取，不能由“managed futures”这一名称推断。<Cite n={1} /><Cite n={2} /><Cite n={41} />
        </p>
        <p>
          截至 2026-08-30 可取得、但未标可见修订日的 sponsor-posted Index methodology，把 SG Trend Index 定义为合格大型趋势经理的等权、定期重构、费后回报指数；同一 sponsor 的 ©2016 Indicator summary 则定义了一条使用 20／120 日均线、55 个市场、15% 波动目标和预设执行成本的假设性透明模型。前者能描述一组经理的历史结果，后者能拆解一条历史公开规则；两者不能互相冒充，这些年份也不表示参数在 2026 年重新确认。<Cite n={4} /><Cite n={5} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="trend-following-definition">
        <p className="section-kicker">05 · Trend Following</p>
        <h2>Trend following 的最小定义是：目标方向和强度随资产自身已实现价格路径调整，而不是先判断“公允价值”再赌回归。</h2>
        <p>
          若近期上涨使规则倾向多头、近期下跌使规则倾向空头，这是一类方向跟随 policy。它可以用 MA、breakout、回归斜率、滤波器或多速度 ensemble 实现；持有期可以从数日到数月。共同结构是滞后路径进入方向权重，而非某个特定技术指标。Fung–Hsieh 进一步说明，动态趋势策略的收益暴露可能呈现类似 lookback straddle 的非线性，但“类似”不等于拥有固定行权价和保证赔付的静态期权。<Cite n={9} /><Cite n={10} />
        </p>
        <p>
          规则可以在上涨中维持多头而不继续买入，也可以在趋势仍正时因波动缩放卖出。因此研究趋势 agent 时，最重要的变量不是 signal 本身，而是 target position 的变化率以及它与 actual position 的差。
        </p>
      </section>

      <section className="lesson-section" id="time-series-momentum">
        <p className="section-kicker">06 · Time-series Momentum</p>
        <h2>TSMOM 问的是“这个市场自己的过去收益是否决定下一期方向”，不是“它相对其他市场排第几”。</h2>
        <p>
          Moskowitz、Ooi 与 Pedersen 在 58 个流动期货和远期市场中研究过去 1–12 个月自身收益与未来收益，并把方向信号、逆波动缩放和跨市场聚合组合成可投资策略。这支持特定样本和构造下的时间序列动量证据，却不能把组合 Sharpe 全部归因于一条纯粹价格预测：缩放、分散、资产长期均值、现金收益和成本也在结果里。<Cite n={11} /><Cite n={12} /><Cite n={13} />
        </p>
        <p>
          本节因而把 TSMOM 分成三层：逐市场条件关系、信号到目标仓位的实现、聚合组合的最终收益。任何一层成立，都不能自动推出另外两层同样成立。
        </p>
      </section>

      <section className="lesson-section" id="cross-sectional-momentum">
        <p className="section-kicker">07 · Cross-sectional Momentum 边界</p>
        <h2>Cross-sectional momentum 买相对赢家、卖相对输家；TSMOM 则允许所有市场同时为多或同时为空。</h2>
        <p>
          横截面策略在同一时点比较多个资产的相对排名，组合通常通过多空排序压低共同方向；时间序列策略逐资产与自身历史比较，不要求多空数量平衡。若全球债券、股票和商品都处于各自正趋势，TSMOM 可以同时做多；横截面策略仍必须识别相对赢家和输家。两者可能持有相似头寸，也可能完全相反，不能因为都被称为 momentum 就共享同一因果解释。
        </p>
        <p>
          这一区分也决定订单反馈：横截面再平衡主要交易相对排名变化，TSMOM 则交易每个市场自身信号、风险缩放和现仓偏差。后文讨论 CTA 聚合订单时，只能对明确声明的 time-series rule 作推断。
        </p>
      </section>

      <section className="lesson-section" id="linear-filters">
        <p className="section-kicker">08 · Linear Filters</p>
        <h2>MA crossover、过去收益符号和更一般的线性滤波器可以写成同一“对滞后收益加权”的结构，但权重形状决定速度和 turnover。</h2>
        <div className="equation-card">
          <span>滞后收益滤波与有界信号</span>
          <div>z<sub>i,t</sub> = Σ<sub>h=1…L</sub>a<sub>h</sub>x<sub>i,t−h</sub>；　s<sub>i,t</sub> = tanh(z<sub>i,t</sub>/c)</div>
          <p>x、z 与尺度 c 使用同一无量纲收益口径，a<sub>h</sub> 是在样本外使用前冻结的无量纲权重；c&gt;0，故 s∈(−1,1)。Binary sign rule 是另一种映射，不是 tanh 的数值等价物。任何 filter 都只能使用 t 决策前已经完整可知的滞后输入；缺失值、合约换月和不同交易日历必须先定义。</p>
        </div>
        <p>
          快权重把质量放在近期，能较早识别转折，却更易在噪声里来回翻向；慢权重平滑噪声，却在跳变后保留旧方向更久。SG 的 ©2016 Indicator summary 所定义的 20／120 日 MA 是透明归因工具，不是所有经理的共同模型或 2026 年重新确认的参数；SG 后续报告还记录了 Indicator 与经理 Index 的相关性会显著下降。<Cite n={5} /><Cite n={10} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="no-point-forecast">
        <p className="section-kicker">09 · “不预测价格”是什么意思</p>
        <h2>趋势规则不需要输出下一期价格点估计，但它仍隐含一个可检验的条件判断：给定状态下，某个方向暴露的预期净收益足以覆盖风险与成本。</h2>
        <p>
          说“我不预测，只跟随”若被理解成无需统计假设，是偷换概念。任何有方向的 target 都意味着规则认为持有该方向比零仓位更可取；区别只是输出可以是 sign、rank 或仓位，而不是价格点。研究应检验该 policy 在冻结成本、时间戳和风险预算后是否具有样本外增量，而不能用“模型没有价格预测值”逃避证伪。
        </p>
        <p>
          Huang 等对简单固定回看期 TSMOM 的逐资产和 pooled 识别提出质疑；Kim、Tse 与 Wald 又表明 inverse-vol scaling 会显著影响归因。正确结论不是“趋势存在”或“趋势不存在”的二选一，而是把方向关系、缩放贡献和组合实现逐层分解。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="external-persistence">
        <p className="section-kicker">阶段二 · 趋势为何存在　|　10 · 外生持续机制</p>
        <h2>价格趋势可以来自持续基本面冲击、信息渐进扩散、套保需求或资金流惯性；同一收益图形并不能识别是哪一种。</h2>
        <p>
          Hong–Stein 模型把信息逐步到达与动量交易者反应连接到先 underreaction、后可能 overreaction；Vayanos–Woolley 则展示委托管理和资金流如何让价格缓慢调整并最终反转。对具体宏观事件，还可以另行提出政策路径、库存调整或通胀持续性等候选假设，但这些不由两篇模型自动证明，必须寻找事件级中间变量。所有候选机制都在解释“为什么价格可能有持续性”，却没有任何一个能由收益自相关单独确认。<Cite n={7} /><Cite n={8} />
        </p>
        <p>
          识别时要寻找机制对应的中间变量：信息发布时间、套保者持仓、基金流、库存或政策路径。若只有“过去涨、后来还涨”，最多证明条件关系，不能决定外生冲击、行为延迟与规则性订单各占多少。
        </p>
      </section>

      <section className="lesson-section" id="positive-feedback">
        <p className="section-kicker">11 · 内生正反馈</p>
        <h2>当价格上涨提高后续目标多头、目标与现仓之差又生成买单时，规则会把自身输入的一部分写回价格。</h2>
        <p>
          De Long 等说明正反馈交易者与试图抢跑的理性投机者可能共同放大价格变化。对趋势策略而言，关键不是持有多头，而是目标多头继续上升：新高、信号增强、波动下降、权益增长或相关性下降都可能提高 N*，于是 ΔN&gt;0。若这些买单有价格冲击，下一期 signal 又更正，形成闭环。<Cite n={6} />
        </p>
        <p>
          但闭环的增益取决于策略规模、信号速度、饱和上限、其他参与者承接和市场深度。价格上涨也会提高每张合约 notional、降低给定风险预算下的合约数，或吸引价值卖盘；因此“趋势资金存在”不等于系统必然爆炸。
        </p>
      </section>

      <section className="lesson-section" id="reversal">
        <p className="section-kicker">12 · 反转与负反馈资本</p>
        <h2>趋势延续若把价格推离缓慢变化的基本面，价值资本、供给反应和信号翻向会把长期正反馈切换成反转。</h2>
        <p>
          Hong–Stein 与 Vayanos–Woolley 都包含“短中期持续、长期反转”的条件机制：先前反应不足给趋势资本盈利空间，后续过度反应或资金流逆转又为反向资本创造机会。现实中趋势也可能因政策转向、库存释放、拥挤退出或一次跳跃式新闻直接中断。<Cite n={7} /><Cite n={8} />
        </p>
        <p>
          趋势策略的脆弱点是滞后：转折发生时，旧 signal、旧仓位和新价格同时存在。快模型可能迅速翻向并增加当日 turnover，慢模型则继续持有旧方向；两者的聚合顺序决定 whipsaw 是分散还是同步。
        </p>
      </section>

      <section className="lesson-section" id="evidence-causality">
        <p className="section-kicker">13 · 收益证据 ≠ 价格因果</p>
        <h2>策略在趋势期赚钱、收益具有自相关、CTA 订单制造趋势，是三个不同强度的命题。</h2>
        <p>
          Moskowitz、Ooi 与 Pedersen（下称 MOP）的组合证据回答其历史构造是否产生 time-series momentum 与组合收益；Kim、Tse 与 Wald（下称 KTW）认为 MOP 的较大 alpha 对 volatility scaling 敏感；Huang 等则质疑简单固定回看期在逐资产与 bootstrap pooled 层面的增量预测证据，并提出历史均值异质性的竞争解释。三者检验的估计量不同，结论也不一致；无论站在哪一边，都不能仅凭经理收益或 COT 净仓证明其订单推动价格。CFTC 的 Managed Money 只出现在农产品与自然资源等 physical-commodity 市场的 Disaggregated COT；金融期货的 Traders in Financial Futures 使用 Dealer、Asset Manager、Leveraged Funds 等另一套分类，两套报告都不标识逐笔 trend strategy。<Cite n={3} /><Cite n={11} /><Cite n={12} /><Cite n={13} /><Cite n={42} />
        </p>
        <p>
          一个可证伪的订单反馈研究至少需要四种对齐数据：共同方向暴露、目标规则或约束变化、真实或高质量代理订单、订单后的价格与深度响应。同步收益只能作为线索，不能作为机制证明。
        </p>
      </section>

      <section className="lesson-section" id="stability-boundary">
        <p className="section-kicker">14 · 正反馈何时不会失稳</p>
        <h2>正反馈的存在不等于失稳；deadband、signal saturation、风险上限、异质速度和反向流动性都会降低闭环增益。</h2>
        <p>
          如果信号在弱趋势区不交易、强趋势区饱和，价格的小变化不会无限提高 target；如果经理使用不同 lookback、roll 日和波动估计，订单会分散到不同时间；如果 market maker、hedger 和 fundamental investor 愿意承接，price impact 也可能很小。De Long 模型提供“可能失稳”的理论边界，而不是对所有现实市场的单向判决。<Cite n={6} />
        </p>
        <p>
          后文会把稳定性拆成可观察量：目标仓位对价格的敏感度、目标与现仓差、聚合资本、执行时间窗、冲击斜率和反向资金供给。只有这些量的乘积足够大，规则才可能从趋势使用者变成趋势放大器。
        </p>
      </section>

      <section className="lesson-section" id="information-cutoff">
        <p className="section-kicker">阶段三 · 从数据到信号　|　15 · Information Cutoff</p>
        <h2>信号的最后一个输入何时完整可知，决定它最早何时能成交；“用收盘价算、也按同一收盘价成交”通常是前视而非速度。</h2>
        <div className="equation-card">
          <span>因果方向信号 · 正值 return index</span>
          <div>R<sup>(L)</sup><sub>i,t−1</sub> = I<sub>i,t−1</sub>/I<sub>i,t−L−1</sub> − 1；　s<sub>i,t</sub> = sign(R<sup>(L)</sup><sub>i,t−1</sub>)</div>
          <p>I 是由当时可交易合约的实际持有期收益链接出的正值 index，I&gt;0；R 与 s 无量纲，s∈&#123;−1,0,+1&#125;，并约定 sign(0)=0。L 是正整数且为事前冻结的回看期。t 决策只能使用 t−1 及以前已完整形成的数据；若最后输入是 t−1 收盘，执行必须使用事前声明的 t 或更晚可成交时点。该式不直接用于可能为零或负的原始期货价格。</p>
        </div>
        <p>
          第 1 题把这一点做成最小实验。现实中还要声明 timezone、holiday、结算价发布时间、跨市场同步和数据修订：纽约收盘时已知的价格，对亚洲市场同一“日期”未必已知。T08 的时间尺度因此不是数据清洗细节，而是因果边界。<Cite n={11} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="tradable-return-chain">
        <p className="section-kicker">16 · 可交易收益链</p>
        <h2>期货市场没有一条永不到期的可交易价格；研究序列必须由事前 roll rule 下实际持有的合约收益链接，而不是把合约价格硬拼起来。</h2>
        <p>
          Front contract 会到期，流动性会迁移，下一张合约价格又可能因期限结构不同而跳开。Back-adjustment 能画出平滑历史，但调整后的旧价格从未成交；直接对这条 synthetic level 算 P&amp;L，会把人为调整当现金收益。可投资回测应保存每一天实际持有的 contract ID、roll 决策时点、两腿成交价、multiplier 和交易成本，再用真实合约收益构造 return chain。<Cite n={16} /><Cite n={20} />
        </p>
        <p>
          价格图用于信号时也必须声明构造：difference-adjusted series 保留价格差而改变比例；ratio-adjusted series 试图保留比例而改变价格差，但只有换月两腿价格都非零且比率具有经济意义时才可定义，通常还要求两者同号或均为正，穿零或变号会使比例调整失效或极不稳定；return-linked index 则只保留累积收益。它们能回答的问题不同，没有一种 synthetic series 同时是“无跳空、可成交、保留绝对价格和保留收益”的免费数据。
        </p>
      </section>

      <section className="lesson-section" id="negative-price-domain">
        <p className="section-kicker">17 · 零价、负价与 Return 定义域</p>
        <h2>原始期货价格可能接近零甚至为负，因此 log return 不是跨全部合约无条件成立的语言。</h2>
        <p>
          log(F<sub>t</sub>/F<sub>t−1</sub>) 要求两个价格同号且比值为正；simple return 又在分母接近零时爆炸。对存在负价可能的产品，更稳健的底层现金流是合约数乘 multiplier 乘价格变化，再按账户权益或事前风险尺度转换；方向信号则可建立在正值 return index、价格差、标准化 P&amp;L 或明确的 domain switch 上。CME 在 2020 年已为部分 NYMEX 能源合约测试零或负的期货交易／结算价格，以及零或负的期权行权价；文件并没有说期权 premium 本身可为负。这不是纯理论边界，也不能看到异常值后才临时更换定义。<Cite n={24} /><Cite n={25} /><Cite n={37} />
        </p>
        <p>
          这也是为什么第 3 题把 v$=|F|Mσ 明确限定在正价格、线性报价的教学合约。利率、能源或非线性报价产品应采用 exchange tick value、DV01（利率每变动 1 bp 的近似现金敏感度）或历史价格变化分布，不能用统一公式掩盖规格差异。
        </p>
      </section>

      <section className="lesson-section" id="lookback-horizon">
        <p className="section-kicker">18 · Lookback Horizon</p>
        <h2>Lookback 不是“越长越稳”的旋钮，而是在决定策略能看见哪种持续尺度、多久后承认旧趋势已经结束。</h2>
        <p>
          短窗口对新信息敏感，能更早翻向，却放大 bid–ask bounce、roll 噪声和假突破；长窗口抑制高频噪声，却把数月前的状态带入今天。MOP 研究 1–12 个月持续性，SG 的 ©2016 Indicator summary 使用 20／120 日 MA，实际经理又可能混合多种速度；这些是不同 policies，不是同一趋势的不同画法。<Cite n={5} /><Cite n={11} /><Cite n={28} />
        </p>
        <p>
          选择窗口还改变危机叙事：快速、V 形的冲击可能在慢模型翻空前结束；缓慢、多市场持续的冲击则给中慢速策略积累方向的时间。因而 crisis alpha 必须连同 pre-crisis position、signal speed 和事件长度一起分析。
        </p>
      </section>

      <section className="lesson-section" id="signal-speed">
        <p className="section-kicker">19 · Signal Speed</p>
        <h2>速度决定“响应延迟—噪声交易—容量”三角：更快不是单向改进，更慢也不是免费稳健。</h2>
        <p>
          快模型更早捕捉 turning point，却需要频繁穿过 spread、承担更强 impact 和更低 capacity；慢模型 turnover 较低，却在反转初期继续持有旧风险。若多个经理都因相同冲击从慢仓位向快方向翻转，交易还会集中在少数窗口。<Cite n={16} /><Cite n={17} /><Cite n={18} />
        </p>
        <p>
          因此速度评估要同时报告 gross signal response、target change、actual fills、cost 和 post-trade exposure。只比较毛 Sharpe，会奖励无法成交的快速模型；只比较 turnover，又会奖励对转折反应太迟的模型。
        </p>
      </section>

      <section className="lesson-section" id="multi-speed-ensemble">
        <p className="section-kicker">20 · Multi-speed Ensemble 与 Data Snooping</p>
        <h2>多速度组合可以分散单一滞后误差，但事后从几十个窗口挑出最好者，会把噪声包装成“稳健 ensemble”。</h2>
        <p>
          一个可验证 ensemble 要在训练样本外冻结候选窗口、权重、相关性处理和再训练日程，并把所有尝试纳入 multiple-testing 记录。多速度输出若高度相关，简单平均也不会创造同等数量的独立信号；它只是平滑目标路径。<Cite n={31} /><Cite n={32} /><Cite n={33} />
        </p>
        <p>
          研究报告应同时展示每个速度 sleeve、聚合前后 turnover、选择协议和未被选中的候选。否则“多模型”只是把研究自由度藏进一个最终曲线。
        </p>
      </section>

      <section className="lesson-section" id="signal-shapes">
        <p className="section-kicker">21 · Binary、Continuous 与 Hysteresis</p>
        <h2>同一历史路径可以输出 ±1、连续强度或带记忆的状态；输出形状直接决定目标仓位是否跳跃。</h2>
        <p>
          Binary sign 在零点附近会频繁翻向；continuous score 让仓位随信号渐变，却需要定义尺度和极端值；hysteresis 要求进入阈值高于退出阈值，使刚刚翻多的仓位不会因微小回落立即翻空。三者不是预测精度的装饰，而是 order-generation design。
        </p>
        <p>
          比较时必须把信号强度与最终风险缩放分开。Continuous s=0.5 可能因低波动得到比 binary s=1 更大的名义金额；只看 signal 图无法推断真实订单。
        </p>
      </section>

      <section className="lesson-section" id="saturation-deadband">
        <p className="section-kicker">22 · Saturation 与 Deadband</p>
        <h2>Saturation 限制强趋势继续提高 target，deadband 则让小信号变化不交易；两者共同降低正反馈增益与无效 turnover。</h2>
        <p>
          前面的 tanh 映射把任意 z 压到 (−1,1)，使极端历史走势不产生无限仓位；deadband 在 |s| 小于阈值时保持旧 target 或归零。它们牺牲对细微信号变化的敏感度，换取成本、稳定性和可解释性。
        </p>
        <p>
          阈值必须在成本和风险模型内校准，而不是用完整样本最大化回报。压力状态中 spread 和 impact 上升，最优 no-trade region 也会变宽；用固定平静期阈值可能在最差时刻过度交易。
        </p>
      </section>

      <section className="lesson-section" id="turning-point">
        <p className="section-kicker">23 · Turning Point</p>
        <h2>任何只读过去的趋势规则在真正转折处都必然慢一步；风险管理能改变损失路径，却不能事前消除所有滞后。</h2>
        <p>
          在旧趋势结束的第一个时点，过去窗口仍由旧方向主导。价格先反转，P&amp;L 先恶化，之后信号才减弱或翻向；若波动同时上升，风险缩放又会在方向翻转前生成减仓。Goulding、Harvey 与 Mazzoleni 对 turning points 和 bad trends 的研究适合解释这一边界，但其识别方法也不能回填成事前知道转折。<Cite n={17} /><Cite n={18} />
        </p>
        <p>
          所以 turning-point attribution 应拆成四项：旧方向损益、signal delay、vol-scaling order 与真正 direction flip。把它们合并成“趋势失效”，会丢掉下一次可改进的机制。
        </p>
      </section>

      <section className="lesson-section" id="carry-contamination">
        <p className="section-kicker">24 · Carry Contamination</p>
        <h2>期货趋势收益可能同时包含价格方向、期限结构 carry、现金抵押品收益和波动缩放；它们必须分别记账。</h2>
        <p>
          Koijen 等把 carry 定义为价格不变时的预期收益成分，并展示跨资产统一结构。趋势信号可能与 carry 同向，例如 backwardated 商品上涨时做多，也可能反向。若研究只看 continuous-futures total return，carry 与 roll adjustment 可能被误称为 price trend alpha。<Cite n={19} /><Cite n={20} />
        </p>
        <p>
          一个干净分解至少报告 raw direction signal、unscaled futures P&amp;L、vol-scaled P&amp;L、collateral income、transaction cost 与最终 NAV return。组合获利不要求每一层都有正 alpha，但归因必须知道钱从哪里来。
        </p>
      </section>

      <section className="lesson-section" id="ex-ante-universe">
        <p className="section-kicker">阶段四 · 从信号到合约数　|　25 · Ex-ante Universe</p>
        <h2>可交易市场池必须在每个决策时点事前可知；用今天的流动性和存续记录回选过去合约，会制造存活与容量幻觉。</h2>
        <p>
          Universe protocol 应冻结上市日、足够历史、合约规格、当时可观察的 ADV／OI、可接受 roll、报价币、交易时段与数据质量门槛。后来退市、迁移或缺失的市场仍要保留其历史可交易期；今天最流动的 front contract 也不能反向决定过去应该持有哪一张。
        </p>
        <p>
          多市场分散尤其容易被 universe growth 污染：后期加入的新合约提高样本外观上的市场数量，却未必在早期可交易。回测应报告每期 active markets、缺失处理和风险重新分配规则。
        </p>
      </section>

      <section className="lesson-section" id="contract-specification">
        <p className="section-kicker">26 · Contract Specification</p>
        <h2>一张“合约”不是统一风险单位；multiplier、tick、报价币、到期和交割规则共同决定它怎样进入现金流。</h2>
        <p>
          Price 4,000 只有与 “每点 50 美元”组合后才产生每张 200,000 美元名义；tick size 决定最小价格变化，tick value 决定最小现金 P&amp;L。外汇、利率和商品合约还可能使用不同报价惯例。CME 的教育材料能说明通用换算，但不能替代特定日期、特定产品的官方 rulebook 和 FCM house margin。<Cite n={23} /><Cite n={24} />
        </p>
        <p>
          生产系统应把 contract ID 与版本化规格绑定，不能在历史全样本套用今天 multiplier。任何规格变化、合约迁移或 currency redenomination 都要进入 as-of 数据。
        </p>
      </section>

      <section className="lesson-section" id="notional-risk-margin">
        <p className="section-kicker">27 · Notional ≠ Risk ≠ Margin</p>
        <h2>Notional 描述价格水平对应的名义暴露，risk 描述价格变化对权益的分布，margin 则是清算与中介要求的抵押品；三者不能互换。</h2>
        <div className="equation-card">
          <span>普通线性、正价格合约的绝对名义</span>
          <div>Q<sub>i,t</sub> = |N<sub>i,t</sub>| M<sub>i,t</sub> |F<sub>i,t</sub>| X<sub>i,t</sub></div>
          <p>N 的单位是 contracts，M 是报价币／价格点／contract，F 是价格点，X 是报价币换算为基准币的汇率，因此 Q 是基准货币。绝对值只用于规模；方向另由 signed N 保存。该式不等于最大损失，也不适合无解释地套在非线性或特殊报价合约上；若 F 接近零，notional 也不能代表价格变化风险。</p>
        </div>
        <p>
          第 2 题把 $600,000 notional、$45,000 required initial margin 和 $3,000 当日 P&amp;L 放在同一题中：它们单位相同，却回答三个不同问题。用 P&amp;L/required margin 得到的百分比不是基金 NAV return。<Cite n={23} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="contract-pnl-fx">
        <p className="section-kicker">28 · Unit P&amp;L、Direction 与 FX</p>
        <h2>期货现金损益由合约数、multiplier 和结算价变化决定；价格水平只在 notional 与某些风险近似中出现。</h2>
        <div className="equation-card">
          <span>逐日 settlement P&amp;L · 基准币近似</span>
          <div>ΔΠ<sub>i,t</sub> = N<sub>i,t−1</sub>M<sub>i,t</sub>(F<sup>settle</sup><sub>i,t</sub> − F<sup>settle</sup><sub>i,t−1</sub>)X<sup>cash</sup><sub>i,t</sub></div>
          <p>N 带方向，M 把价格点变成报价币现金，ΔF 是价格点，X<sup>cash</sup> 把实际 settlement cash flow 换算为基准币；结果是基准币。多头在 ΔF&gt;0 时盈利，空头符号相反。严格跨币实现必须使用现金流实际发生与换汇时点的汇率，而不是无条件用期末 FX。交易当日仓位变化还要声明 close-to-close、open-to-close 或逐笔持仓区间。</p>
        </div>
        <p>
          Settlement variation 把未实现价格变化转成每日现金流；它与证券持仓只在平仓时实现损益的路径不同。CME 资料提供通用计算框架，但不同清算产品、币种和 intraday variation 仍需逐规则核对。<Cite n={24} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="dollar-vol-position">
        <p className="section-kicker">29 · Dollar-vol Position Sizing</p>
        <h2>方向信号只有与每张合约的现金风险相除，才能变成可比较的跨市场合约数。</h2>
        <div className="equation-card">
          <span>单位合约风险与未取整目标</span>
          <div>v<sup>$</sup><sub>i,t</sub> = M<sub>i,t</sub>X<sub>i,t</sub>σ̂<sub>ΔF,i,t</sub> ≈ |F<sub>i,t</sub>|M<sub>i,t</sub>X<sub>i,t</sub>σ̂<sub>r,i,t</sub>；　Ñ<sub>i,t</sub> = s<sub>i,t</sub>B<sup>$</sup><sub>i,t</sub>/v<sup>$</sup><sub>i,t</sub></div>
          <p>σ̂<sub>ΔF</sub> 是与风险预算同期限的价格变化波动，故首式在零价、负价下仍有现金量纲；右侧 return-vol 近似只在 F&gt;0、线性报价且收益定义良好时使用。v$ 与 B$ 都是基准币风险，Ñ 的单位是 contracts；要求 M、X&gt;0，B$≥0，v$&gt;0，s∈[−1,1]。利率合约若更适合 DV01，或产品具有非线性／quanto（资产与结算币种不同且汇率关系由合约规定）条款，应改用交易所 money convention、Greeks（对价格、波动、时间等输入的局部价值敏感度）或完整情景 P&amp;L。</p>
        </div>
        <p>
          Inverse-vol sizing 让低波动市场获得更多名义金额，目标是平衡局部风险而不是预测收益更高。估计误差、跳跃和相关性仍会使真实 risk contribution 偏离预算。<Cite n={11} /><Cite n={12} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="integer-rounding">
        <p className="section-kicker">30 · Integer Rounding 与 Small Account</p>
        <h2>目标 0.4 张不能成交；整数合约使小账户的方向、风险与 sector budget 出现离散跳跃。</h2>
        <p>
          四舍五入、向零取整或最小风险误差优化会产生不同实际仓位。对大账户，一张合约可能只是微小误差；对小账户，一张就可能超过整个市场风险预算。系统必须保存 continuous target、rounded target 和 actual fills，才能区分模型意图与可实现结果。
        </p>
        <p>
          取整也会与 deadband 互动：目标从 0.49 到 0.51 可能突然生成一整张订单。若多个小账户使用相同规则，离散跳跃会集中在共同阈值附近。
        </p>
      </section>

      <section className="lesson-section" id="feasibility-caps">
        <p className="section-kicker">31 · Margin、Liquidity 与 Concentration Caps</p>
        <h2>Raw target 只是风险意愿；margin、ADV、OI、position limit、集中度与授权范围共同定义可行集。</h2>
        <p>
          一个低波动但不流动的合约可能在 inverse-vol 公式中得到巨大仓位，却无法在合理 horizon 成交；一个当前公布 margin 较低的合约，也可能在市场条件变化或 FCM 提高要求后占用更多抵押品。可行性过滤应在订单前应用，并保存是哪条约束成为 binding cap。<Cite n={26} />
        </p>
        <p>
          约束还会内生改变组合：某市场被 cap 后，剩余风险是否按比例分配给其他市场，决定 sector 和方向暴露是否漂移。简单删掉目标而不重新计算协方差，会让最终组合失去声明的风险预算。
        </p>
      </section>

      <section className="lesson-section" id="volatility-estimator">
        <p className="section-kicker">32 · Volatility Estimator</p>
        <h2>波动率估计不是背景统计量，而是订单生成器；lookback、衰减、年化和缺失处理都会改变今天的 N*。</h2>
        <div className="equation-card">
          <span>有限窗口指数加权年化方差</span>
          <div>μ̂<sup>λ</sup><sub>t</sub> = Σλ<sup>h−1</sup>x<sub>t−h</sub>/Σλ<sup>h−1</sup>；　σ̂²<sub>t</sub> = D·Σλ<sup>h−1</sup>(x<sub>t−h</sub>−μ̂<sup>λ</sup><sub>t</sub>)²/Σλ<sup>h−1</sup></div>
          <p>两组求和都从 h=1 到 H；0&lt;λ≤1，D 是与数据频率一致的年化期数，x 是无量纲收益，因此 σ̂² 是年化无量纲方差。公式是描述性加权二阶矩，不声称有限样本无偏。生产规则还须冻结 H、λ、最小样本、holiday、stale price、jump 和 contract-roll 处理；σ̂&gt;0 才能用于相除。</p>
        </div>
        <p>
          快衰减在冲击后迅速提高 σ̂、生成减仓，却也会在单次异常点后过度收缩；慢衰减更平滑，但低估新 regime 的时间更长。Baltas–Kosowski 与 KTW 都说明 estimator 与 scaling 会显著改变测得策略表现。<Cite n={12} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="inverse-vol-boundary">
        <p className="section-kicker">33 · Inverse-vol 的边界</p>
        <h2>每市场按 1/σ 配仓只能平衡单变量风险近似，不能自动得到 equal-risk portfolio，也不能处理共同跳跃。</h2>
        <p>
          若两个市场各自波动相同但高度相关，它们合在一起的 portfolio risk 大于零相关情形；若一个合约在危机中跳跃、另一个平滑，历史 σ 相同也不表示尾部风险相同。Inverse-vol 是第一层 normalizer，下一层仍需协方差、sector、liquidity 和 stress constraints。
        </p>
        <p>
          这也是 KTW 争论的重要部分：缩放会改变组合暴露和统计显著性，因此“信号收益”与“风险管理收益”必须分别报告。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="portfolio-vol-target">
        <p className="section-kicker">34 · Portfolio Volatility Target</p>
        <h2>资产级配仓后仍要在组合层读取协方差；最紧的波动、gross、margin 或容量约束决定最终同比例尺度。</h2>
        <div className="equation-card">
          <span>组合预测波动与公共缩放因子</span>
          <div>V<sup>$,0</sup><sub>p,t</sub> = √(N<sup>0⊤</sup><sub>t</sub>Ĉ<sup>$</sup><sub>t</sub>N<sup>0</sup><sub>t</sub>)；　σ̂<sup>0</sup><sub>p,t</sub> = V<sup>$,0</sup><sub>p,t</sub>/E<sub>t</sub>；　k<sub>t</sub> = max&#123;0,min[k<sub>max</sub>,σ*/σ̂<sup>0</sup><sub>p,t</sub>,G<sub>max</sub>/G<sup>0</sup><sub>t</sub>,k<sub>other</sub>]&#125;</div>
          <p>Ĉ<sup>$</sup> 是“一张合约基准币 P&amp;L”的同频、同年化协方差矩阵且应对称半正定，N<sup>0</sup> 是未缩放带符号合约数，因此 V$ 是基准币风险；E&gt;0 后 σ̂ 无量纲。要求 σ*≥0、σ̂&gt;0，k<sub>max</sub>、G<sub>max</sub>、G<sup>0</sup>≥0，启用 gross 比率时 G<sup>0</sup>&gt;0。k<sub>other</sub> 代表事前定义的 margin／capacity 等非负比率。该写法兼容负价；只有正价线性合约才可等价改写为收益权重 w<sup>⊤</sup>Σw。公式依赖方向和协方差冻结、风险对头寸一阶同质；非线性衍生品需重估。</p>
        </div>
        <p>
          第 4 题只有 volatility 成为 binding cap；现实多个 cap 会同时变化。Moreira–Muir 展示了波动管理可能改善历史风险调整后收益，Cederburg 等又在更广策略集合中发现效果并不普适；目标规则应作为状态依赖 exposure 报告，而不是免费 alpha。<Cite n={21} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="correlation-risk-contribution">
        <p className="section-kicker">35 · Correlation 与 Risk Contribution</p>
        <h2>市场数量只有经协方差映射后才变成分散；相关性上升会让原先独立的 sleeve 同时占用风险预算。</h2>
        <div className="equation-card">
          <span>组件与百分比风险贡献</span>
          <div>RC<sup>$</sup><sub>i</sub> = N<sub>i</sub>(Ĉ<sup>$</sup>N)<sub>i</sub>/V<sup>$</sup><sub>p</sub>；　PCR<sub>i</sub> = N<sub>i</sub>(Ĉ<sup>$</sup>N)<sub>i</sub>/(V<sup>$</sup><sub>p</sub>)²；　ΣRC<sup>$</sup><sub>i</sub> = V<sup>$</sup><sub>p</sub>，ΣPCR<sub>i</sub>=1</div>
          <p>要求 V$&gt;0，Ĉ$ 与 N 使用同一基准币、频率和年化口径；RC$ 是基准币波动贡献，PCR 无量纲。存在 hedge 时某个贡献可以为负，不能强制取绝对值。该分解是局部二阶模型，不保证尾部、跳跃或流动性贡献可加；把每个市场单独 inverse-vol 不能推出贡献相等。</p>
        </div>
        <p>
          第 5 题显示两个 8% sleeve 在 ρ=0 时组合波动约 5.657%，ρ=0.5 时升到约 6.928%。若风险系统继续使用旧相关性，下一次重估就会集中减仓。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="sector-risk-budget">
        <p className="section-kicker">36 · Sector Aggregation</p>
        <h2>市场等权、每市场风险等权和 sector risk budget 是三种不同组合；市场数量多的 sector 不应因合约列表更长就自动支配全局风险。</h2>
        <p>
          若商品有 30 个市场、股票指数只有 8 个，简单给每市场相同风险会让商品自然占据更多组合预算。Sector budget 先在 equities、rates、FX、commodities 等组间分配，再在组内分配；但跨 sector 相关性仍需全局协方差层检查。
        </p>
        <p>
          SG 的 ©2016 Indicator summary 所设四部门各 25% 风险是一种透明设计选择，不是行业定律或当前全行业参数。实际经理的资产池、cap 与速度不同，Indicator 因而只能作为 attribution proxy。<Cite n={5} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="daily-settlement">
        <p className="section-kicker">阶段五 · 期货现金流与展期　|　37 · Daily Settlement</p>
        <h2>期货损益按结算价逐日变成现金 variation；昨日盈利不是只存在于图表中的浮盈，昨日亏损也会立即压缩现金和 margin headroom。</h2>
        <p>
          第 28 节的 ΔΠ 是价格路径到现金路径的桥。清算层每日 mark-to-market 会把 settlement variation 记入账户；若持仓在日内变化，还要把期初仓位的昨结至今结、每笔新成交的成交价至今结分别核算，不能用期末合约数乘全天价差。<Cite n={25} />
        </p>
        <p>
          逐日现金化使路径约束比终点更重要：长期趋势最终获利，也可能先经历足以触发 margin call、风险缩放或赎回的逆向波动。趋势策略的“能否等到趋势恢复”因此取决于账户而不只取决于信号。
        </p>
      </section>

      <section className="lesson-section" id="margin-types">
        <p className="section-kicker">38 · Initial、Maintenance 与 House Margin</p>
        <h2>Initial margin requirement 规定建立仓位需要提交多少合格抵押品，maintenance margin 是持续最低门槛，FCM house requirement 又可能更高；这些要求都不是最大损失。</h2>
        <div className="table-scroll" role="region" aria-label="期货保证金层级，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">期货保证金、逐日结算与账户权益的区别</caption>
            <thead><tr><th scope="col">状态量</th><th scope="col">回答的问题</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">Initial margin requirement</th><td>新仓位要求提交多少合格 performance-bond collateral</td><td>不是买入价款，也不是损失上限</td></tr>
              <tr><th scope="row">Maintenance margin</th><td>持仓期间账户必须维持的最低门槛</td><td>不等于每日 variation cash flow</td></tr>
              <tr><th scope="row">House margin</th><td>FCM 可在交易所最低值之上设定的客户要求</td><td>不能只由交易所最低值推算</td></tr>
              <tr><th scope="row">Variation margin</th><td>结算价格变化带来的每日现金收付（借记或贷记）</td><td>不是另一笔可重复计入的 P&amp;L</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          CME 的通用说明把 performance bond 与每日结算分开；真实要求还会随产品、市场条件和 FCM 政策改变。低交易所 margin 不等于低经济风险，用 P&amp;L/IM 得到的高百分比也不能冒充 NAV return。<Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="collateral-return">
        <p className="section-kicker">39 · Collateral Return</p>
        <h2>期货方向 P&amp;L 与现金抵押品收益是两条现金流；最终投资者回报取决于哪些资产可计息、币种和 haircut。</h2>
        <p>
          期货无需支付完整 notional，使账户可以持有现金、短债或其他合格 collateral；它们产生的利息可能在高利率时期显著影响总回报。为满足 initial margin requirement 而提交的 collateral 是否计息、哪些资产合格、haircut 与 segregated／FCM 安排、利率按何种基准以及外币现金如何重估，都取决于具体制度与账户条款。
        </p>
        <p>
          因而比较长期趋势研究时要区分 futures excess return、collateral-inclusive return 与经理净费 NAV。早期历史回测若使用现代现金利率、今天可用合约和当前成本，会把不同时代的实现条件混在一起。<Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="nav-update">
        <p className="section-kicker">40 · NAV Update</p>
        <h2>账户权益把方向损益、利息、成本、外币现金和申赎统一到同一货币尺度；同一现金流只能进入一次。</h2>
        <div className="equation-card">
          <span>逐日 NAV 现金流恒等式</span>
          <div>E<sub>t</sub> = E<sub>t−1</sub> + VM<sub>t</sub> + I<sub>t</sub> − C<sub>t</sub> + FX<sup>cash</sup><sub>t</sub> + CF<sup>ext</sup><sub>t</sub></div>
          <p>E、VM、I、C、FX 和 CF 都是基准币金额；VM、利息、外币现金重估和外部申赎带符号，C≥0 约定为成本流出并只扣一次。若第 28 节的 futures P&amp;L 已通过 VM 进入，就不能再加一遍同段 ΔΠ。Initial margin 是风险要求或要求金额；为满足它而提交的合格 collateral 通常仍属于账户权益，不应当作购买价款从 E 再扣一次，但 eligibility、haircut、segregation、FCM 控制、资金成本和不计息余额必须另列。要求 E<sub>t−1</sub>&gt;0 才能计算常规 NAV return。</p>
        </div>
        <p>
          第 7 题明确冻结“全部账户权益都按同一利率计息”，只是为了唯一答案；它不是一般合同事实。生产 attribution 要保存每日 eligible cash、collateral type、币种、VM 时点、fee 与外部流。<Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="basis-calendar-spread">
        <p className="section-kicker">41 · Basis 与 Calendar Spread</p>
        <h2>Spot basis 比较期货与现货，calendar spread 比较两个到期月；它们单位相同，却不是同一个经济对象。</h2>
        <div className="equation-card">
          <span>本文冻结的期限结构符号</span>
          <div>B<sub>t</sub> = F<sup>near</sup><sub>t</sub> − S<sub>t</sub>；　C<sub>t</sub> = F<sup>far</sup><sub>t</sub> − F<sup>near</sup><sub>t</sub></div>
          <p>B 与 C 都使用同一标的、质量、地点、报价单位和可比时点，允许为正、零或负。B 衡量近月相对现货，C 衡量远月相对近月；利率、债券、电力等市场可能有不同惯例，必须另行声明。期限结构含有融资、便利收益、库存与预期等信息，但本式本身不完成因果分解。</p>
        </div>
        <p>
          Contango／backwardation 是期限结构状态，不是保证获利的标签。趋势 signal 可能与 carry 同向或反向；研究若不分别保存 B、C 和方向，就无法知道收益来自价格移动还是期限结构。<Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="roll-mechanics">
        <p className="section-kicker">42 · Roll Mechanics</p>
        <h2>多头换月是卖近月、买远月的两笔交易；远近月价差不会在换月瞬间凭空成为现金收益或损失。</h2>
        <p>
          旧合约从上一结算或实际建仓价到平仓价产生 P&amp;L，新合约从自己的成交基准开始产生后续 P&amp;L；换月当日另有两腿 spread、fee、slippage 与可能的 impact。Bessembinder 的核心纠错是反对把 N×M×(F<sup>far</sup>−F<sup>near</sup>) 再记作一笔独立 cash flow，而不是说期限结构与收益无关。<Cite n={20} />
        </p>
        <p>
          第 6 题刻意把旧腿此前损益和两腿成本设为零，只隔离价格缺口。真实 roll attribution 必须把 signal rebalance、risk rebalance 和 expiry roll 分列，但相同成交只能计费一次。
        </p>
      </section>

      <section className="lesson-section" id="continuous-futures">
        <p className="section-kicker">43 · Continuous Futures</p>
        <h2>连续期货是研究构造，不是交易所挂牌证券；它可以服务信号，却不能替代逐合约现金账本。</h2>
        <p>
          承接第 16 节已经定义的三类序列，本节不再重复构造方法，而是建立对账关系：每次信号计算都应保存所读 synthetic series 的版本、观察值与截止时点；现金账本则保存当日 actual contract、旧腿与新腿 fills、各自成交价、结算价、multiplier、FX 和成本。前者回答“规则当时看见了什么”，后者回答“账户实际持有什么、赚亏多少”。<Cite n={16} /><Cite n={20} />
        </p>
        <p>
          换月附近 signal series 的连续变动与 actual-contract ledger 的两腿现金结果本来就可能不同；差异本身不是 bug。诊断顺序应先把 synthetic adjustment、旧腿 mark-to-market、新腿建仓、spread／fee／slippage 和 FX 分列，再检查是否存在重复记账、错误合约 ID 或把调整后旧价当成交价。只有无法由这些已声明项目解释的差异，才进入数据或代码错误调查。
        </p>
      </section>

      <section className="lesson-section" id="expiry-delivery">
        <p className="section-kicker">44 · Expiry、First Notice 与 Delivery</p>
        <h2>换月日不是全市场统一规则；last trade、first notice、delivery period、现金结算和 FCM 强平政策都随产品而异。</h2>
        <p>
          现金结算合约与实物交割合约的到期风险不同；能源、农产品和国债又有各自交割机制。生产 roll rule 应从 product rulebook、calendar 与当时流动性出发，并设置足够 buffer，不能把“第三个星期五”或固定提前五天移植到所有市场。<Cite n={27} /><Cite n={38} /><Cite n={39} />
        </p>
        <p>
          规则版本也会改变：新合约月份、乘数、交割地点或最后交易日调整都要 as-of 保存。回测用今天的 expiry calendar 解释过去，会产生隐蔽的制度前视。
        </p>
      </section>

      <section className="lesson-section" id="turnover-cost">
        <p className="section-kicker">阶段六 · 实现与反馈　|　45 · Turnover 与 Cost</p>
        <h2>Target 与 actual position 之差先生成订单，只有实际 fill 才进入本文的成交名义、按成交成本与 turnover；order submission、cancel 和 depth change 另建事件账本。</h2>
        <div className="equation-card">
          <span>总绝对成交 turnover 与不重叠成本</span>
          <div>ΔN<sup>order</sup><sub>i,t</sub>=N*<sub>i,t</sub>−N<sup>actual</sup><sub>i,t−</sub>；　V<sup>abs</sup><sub>t</sub> = Σ|ΔN<sup>fill</sup><sub>i,t</sub>|U<sub>i,t</sub>；　TO<sup>abs</sup><sub>t</sub> = V<sup>abs</sup><sub>t</sub>/E<sub>t−</sub>；　C<sub>t</sub> = c<sub>bp</sub>10<sup>−4</sup>V<sup>abs</sup><sub>t</sub> + Σf<sub>i</sub>|ΔN<sup>fill</sup><sub>i,t</sub>|</div>
          <p>目标差只定义 order；ΔN<sup>fill</sup> 是执行后真实成交的带符号合约数。完全未成交的数量、撤单时仍未成交的数量，以及部分成交订单的未成交余量，都不能进入本文的 fill-based turnover 与按成交计 fee；部分成交中已经真实成交的数量则必须进入。若场所另收报单／撤单费，或研究报价与深度响应，应在 order-book-event 账本另列。U&gt;0 的量纲是“基准币／contract”，是按事前声明规则用成交时点价格、multiplier 与 FX 冻结的正值交易尺度；它度量成交规模，不能让负价格改变买卖方向。E<sub>t−</sub>&gt;0 是交易前权益，故 TO<sup>abs</sup> 无量纲。c<sub>bp</sub>≥0，f≥0，C 是正成本金额并在 NAV 中扣除。该值是全部买卖的总绝对成交，不自动等于 one-way；若要买／卖侧，应分别用 max(±ΔN<sup>fill</sup>,0)。若 bp 已含 spread、fee 或 impact，就不能再重复相加；roll 与信号换仓可分标签，但同一 fill 只计费一次。</p>
        </div>
        <p>
          第 8 题另外冻结“目标差全部成交”，因此两项 ΔN<sup>fill</sup> 都是卖出、TO<sup>abs</sup>=19%；把它静默除以二会制造不存在的买入侧。真实成本还依赖 order type、slice、time、depth 与 markout，聚合 bp 只是最小近似。<Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="capacity">
        <p className="section-kicker">46 · Capacity</p>
        <h2>低波动不等于高容量；在信号强度相同时，inverse-vol 倾向配置最大绝对名义的市场，可能恰好最难在期限内成交。</h2>
        <p>
          Capacity 取决于订单相对 ADV／OI 的规模、spread、depth、roll concentration、market hours 与可接受 liquidation horizon；SG 的 ©2016 Indicator summary 所列 OI／ADV caps 是一种历史公开示例，不是 2026 年参数或行业统一阈值。信号规模翻倍若让订单占深度比例更快上升，毛 alpha 不变也会被 impact 吃掉；在交割月附近，roll 还可能集中。<Cite n={5} /><Cite n={34} /><Cite n={35} />
        </p>
        <p>
          研究至少要报告每市场 target contracts、实际 fills、participation、days-to-liquidate 和未成交 residual。使用收盘价假设无限成交，会让快模型、冷门合约和危机反转得到虚假优势。
        </p>
      </section>

      <section className="lesson-section" id="target-order-impact">
        <p className="section-kicker">47 · Target、Order、Fill 与 Signed Impact</p>
        <h2>Signal 先决定 target，target 与 actual 才决定 order；fills 进入本文的成交净流 Q，而 submission、cancel 与 depth change 需要另一组订单簿事件变量。</h2>
        <div className="equation-card">
          <span>从目标差到聚合成交与价格桥</span>
          <div>ΔN<sup>order</sup><sub>a,i,t</sub> = N*<sub>a,i,t</sub> − N<sup>actual</sup><sub>a,i,t−</sub>；　Q<sup>fill</sup><sub>i,t</sub> = Σ<sub>a∈𝒜_focal</sub>ΔN<sup>fill</sup><sub>a,i,t</sub>U<sub>i,t</sub>；　Δp<sub>i,t</sub> = Λ<sub>i,t</sub>Q<sup>fill</sup><sub>i,t</sub> + u<sub>i,t</sub></div>
          <p>𝒜_focal 是被研究的 CTA／trend cohort，a 索引所有按事前规则属于该集合的 agent，成交方向从每个成员自身的仓位变化视角记号。不属于 𝒜_focal 的对手方不会仅因与 cohort 成交而被纳入；若交易对手本身也属于 𝒜_focal，它的带符号 fill 必须同样进入求和，群组内部成交因而可以自然抵消。不能为了构造 cohort 净流而机械加入全市场每笔交易的双方，否则所有成交会恒等抵消。i 是市场，t 是对齐的成交—价格窗口。U&gt;0 的量纲是“基准币／contract”，按事前声明规则用成交时点价格、multiplier 与 FX 冻结；因此 Q 的量纲是基准币。增加多头或回补空头使 Q&gt;0，卖出多头或增加空头使 Q&lt;0，负价格不能把 U 的符号翻转。u 是与 Δp 同量纲的其他价格变化残差，可包含新闻、𝒜_focal 外主体的订单簿事件、跨市场冲击和测量误差；第 10 题只为得到唯一算术答案冻结 u=0。若 Δp 是无量纲收益，Λ 的单位是 1／基准币；若输出是价格点或 ticks，Λ 则分别是价格点／基准币或 ticks／基准币。标量教学情形取 Λ&gt;0；真实 Λ 随深度、时间、方向和对手方反应变化，且 target order 未成交部分不能进入 Q<sup>fill</sup>。若 u 与 Q 相关，估得的 Λ 只是条件相关斜率；要解释为因果 fill impact，还需条件外生性、有效工具变量或等价的识别设计。多市场还需 cross-impact 矩阵，不能直接把不同合约名义相加。</p>
        </div>
        <p>
          这张卡把“趋势资金的成交流可能推动价格”缩成可检验箭头：先预测谁会改 target，再观察该 cohort 的实际成交，最后测量对齐窗口的价格与深度。没有 fills 只能排除这条 Q<sup>fill</sup> 成交流通道，不能排除未成交限价单、撤单或深度变化经订单簿改变报价；研究后者必须另外保存 add、modify、cancel、queue 与 depth 事件，不能塞进 Q<sup>fill</sup>。<Cite n={35} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-amplification">
        <p className="section-kicker">48 · Trend Amplification</p>
        <h2>若价格上涨同时提高 signal、降低单位风险或增加权益，多个通道可能共同提高目标多头；但它们也可能互相抵消。</h2>
        <p>
          方向通道使 s 上升，盈利通道使 E 上升，平静通道使 ν 下降；三者都可能提高 N*。另一边，价格水平上升会提高每张正价合约 notional，margin 或 concentration cap 也可能收紧。总订单方向取决于这些约束的最小值，而不是“价格涨—CTA 必买”的口号。
        </p>
        <p>
          聚合反馈还要求参与者足够同质。不同速度、不同 sector budget 和离散 roll 日能摊开订单；相同数据供应、共同风险模型和同一事件时钟则会集中订单。<Cite n={6} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="whipsaw">
        <p className="section-kicker">49 · Reversal、Flip 与 Whipsaw</p>
        <h2>突然反转先伤害旧仓，再触发风险减仓，最后才可能令方向翻转；若价格又反向，三层订单会形成 whipsaw。</h2>
        <p>
          旧仓 P&amp;L、vol-scaling 和 signal flip 使用不同状态变量与时钟。把它们混成一笔“止损单”，无法解释为什么方向信号仍为多却已卖出一半，或为什么翻空后又迅速回补。<Cite n={17} /><Cite n={18} />
        </p>
        <p>
          快模型在第一段反转就翻向，慢模型稍后跟随；若价格随后恢复，快模型先遭第二次错误，慢模型可能尚未翻转。速度多样性有时分散冲击，有时也会让卖单分波次到来。
        </p>
      </section>

      <section className="lesson-section" id="vol-scaling-feedback">
        <p className="section-kicker">50 · Vol-scaling Feedback</p>
        <h2>波动缩放是一条独立于方向信号的机械链：价格冲击提高预测风险，风险预算不变时 target contracts 会下降。</h2>
        <p>
          如果下跌与波动上升同时发生，多头趋势资金可能在 signal 尚未翻空时减仓；空头趋势资金也可能因风险上升回补一部分。因而 vol-control 不是天然顺周期卖压，它的订单方向还取决于现仓符号；但 gross 通常会收缩。KTW 说明缩放显著影响 TSMOM 归因，Moreira–Muir 与 Cederburg 又展示了绩效效果的条件性。<Cite n={12} /><Cite n={21} /><Cite n={22} />
        </p>
        <p>
          本节只说明趋势 agent 内部的缩放；2.11 会把独立 vol-control 产品的资产配置与股票减仓机制系统展开。
        </p>
      </section>

      <section className="lesson-section" id="drawdown-deleveraging">
        <p className="section-kicker">51 · Drawdown 与 Equity × Vol Deleveraging</p>
        <h2>权益损失降低可承受 dollar risk，单位 gross 风险上升又降低每单位资本可持有规模；两个比率会乘法式收缩。</h2>
        <div className="equation-card">
          <span>路径状态与不重复缩放的 gross 规则</span>
          <div>Peak<sub>t</sub>=max<sub>u≤t</sub>E<sub>u</sub>；　DD<sub>t</sub>=1−E<sub>t</sub>/Peak<sub>t</sub>；　G*<sub>t</sub>=min&#123;G<sub>limits</sub>,d(DD<sub>t</sub>)G<sub>ref</sub>(E<sub>t</sub>/E<sub>ref</sub>)(ν<sub>ref</sub>/ν<sub>t</sub>)&#125;</div>
          <p>E 与 Peak 是扣除并正确处理外部申赎后的正值 NAV，因此 DD∈[0,1)。G<sub>ref</sub>≥0 是在参考权益 E<sub>ref</sub> 和参考“每单位 gross 风险”ν<sub>ref</sub>&gt;0 下已校准的规模；ν<sub>t</sub>&gt;0，G<sub>limits</sub>≥0，d(DD)∈[0,1] 是事前冻结的回撤降杠杆函数。若输入已经是当前仓位按当前 NAV 计算的组合波动 σ<sub>p</sub>，只应把当前仓位乘 σ*/σ<sub>p</sub>，不能再乘 E/E<sub>ref</sub>，否则会重复去杠杆。</p>
        </div>
        <p>
          第 10 题为了得到唯一映射，明确把每家基金简化为同一市场的一只正向多头篮子：40m gross 全部是该篮子的正值名义，缩到 24m 后才可把 16m gross 减少逐家映射为同窗口卖单。真实跨资产多空组合的 gross 收缩同时包含减多头的卖单与回补空头的买单，必须逐市场保留符号，不能从组合 gross 直接推出单一 Q。这是一条风险订单，不是新的价值判断；融资流动性与市场流动性若同时恶化，还会形成更广的 deleveraging spiral。<Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="crowding-identification">
        <p className="section-kicker">52 · Crowding 与 COT 识别边界</p>
        <h2>共同经理收益、COT managed money 净仓和相似技术指标都只是代理；没有策略标签与订单时点，不能证明 CTA trend crowding。</h2>
        <p>
          截至 2026-08-30，CFTC Disaggregated COT 只覆盖农产品与自然资源等 physical-commodity 市场，其中 Managed Money 混合注册 CTA、CPO 与被识别的未注册基金，依据主体主要业务分类，而非逐笔策略；金融期货另用 Traders in Financial Futures 的参与者分类。两类报告通常在周五发布此前周二的持仓快照，都不提供 trend 策略标签、完整 AUM、现金、OTC 暴露、账户级 roll 或真实 intraperiod flow。<Cite n={3} /><Cite n={40} /><Cite n={42} />
        </p>
        <p>
          因此研究 CTA crowded order 至少要把 COT 与透明 rule proxy、经理收益、期货价格、OI 和可观察 flow 交叉验证，并明确不可见状态。周度净仓变化不是该周净成交，更不是价格冲击的 first stage。
        </p>
      </section>

      <section className="lesson-section" id="crisis-alpha">
        <p className="section-kicker">阶段七 · 案例与证据　|　53 · Crisis Alpha 的条件性</p>
        <h2>Trend following 只有在危机变成足够持久、可做多也可做空的跨市场趋势时，才可能表现得像 crisis alpha；它不是保险合同。</h2>
        <p>
          Fung–Hsieh 的非线性暴露与 Hurst、Ooi、Pedersen 的长期回测解释了为什么趋势策略在部分大幅、持续走势中可能获利；后者在其定义的十个最大 60/40 危机中有八次表现良好，而不是十次全胜。早期历史又是构造性回测，不能当成从 1880 年开始的真实可投资净费 track record。<Cite n={9} /><Cite n={14} />
        </p>
        <p>
          危机表现由 pre-crisis position、冲击方向、持续时间、signal speed、跨资产同步、vol scaling、collateral 和执行共同决定。股票急跌若伴随债券、美元或商品的旧趋势反转，组合仍可能亏损。
        </p>
      </section>

      <section className="lesson-section" id="gfc-case">
        <p className="section-kicker">54 · 2007–2009 GFC · 条件化案例</p>
        <h2>Man 的事件窗口显示 BTOP50 趋势代理在 2007-07-01 至 2009-02-28 约 +17%，同期美元对冲全球股票约 −49%；这支持“持久危机可能给趋势建仓时间”，不证明 CTA 制造危机。</h2>
        <p>
          这里必须保留代理与窗口：BTOP50 不是 SG Trend Index，事件端点由作者选择，且经理间可能高度分散。多月股票下跌、利率和外汇移动为中慢速模型提供了识别与持有时间，是与结果一致的机制推断；要证明实际贡献，仍需逐市场持仓和 attribution。<Cite n={30} />
        </p>
        <p>
          不能把年度图表目测的“SG 2008 约 +21%”写成精确事实，也不能由指数正收益认定每位 CTA 盈利。案例的价值是训练证据等级：观察到的是代理指数回报，推断的是持续趋势通道，未观察的是每家订单和价格因果。
        </p>
      </section>

      <section className="lesson-section" id="inflation-2022-case">
        <p className="section-kicker">55 · 2022 Inflation Shock</p>
        <h2>截至 2022-09-30，AQR 页面记录 SG Trend Index 约 +36%、其定义的全球 60/40 约 −20%；窗口必须写成“前三季度”，不能改成全年。</h2>
        <p>
          该 60/40 由 60% MSCI World 与 40% Barclays Global Aggregate Hedged USD、按月再平衡构成。同期利率、债券、美元和部分商品的持续移动提供了潜在跨资产方向机会，与多市场趋势机制相容；但仅凭 SG Index 这条经理费后收益序列，不能证明实际收益来自哪些市场，更不能反推统一信号、杠杆或持仓。<Cite n={29} />
        </p>
        <p>
          Man 在同一 2022-01-01 至 2022-09-30 窗口对 BTOP50 记录约 +19%、股票约 −21%。不同代理、成分和费用产生不同结果，两个数字不能拼成一条业绩序列。<Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="fast-crisis-counterexample">
        <p className="section-kicker">56 · Q4 2018 与 Feb–Mar 2020 · 反例</p>
        <h2>股票下跌不保证趋势策略获利：Man 的 BTOP50 代理在 Q4 2018 约 −2%、同期股票约 −13%；2020-02 至 2020-03 也约 −2%，同期股票约 −20%。</h2>
        <p>
          这些条件化事件足以反驳“股灾=CTA 保险”的无条件叙事。快速冲击可能在慢模型建立新方向前完成，危机前的旧仓也可能与新冲击同向亏损；随后 V 形反弹又会惩罚刚翻向的快模型。Man 还提示趋势模型通常需要数月建立方向，但具体经理速度不可由代理指数恢复。<Cite n={30} />
        </p>
        <p>
          反例不是证明 trend 无效，而是确定适用条件：危机需要在可交易资产上持续足够久，组合还要有容量、抵押品和执行能力把信号变成仓位。
        </p>
      </section>

      <section className="lesson-section" id="weak-trend-regime">
        <p className="section-kicker">57 · 2010s 弱趋势期</p>
        <h2>没有足够大、足够持久的市场移动时，趋势策略可以多年贫瘠；这与一次危机中的保护能力并不矛盾。</h2>
        <p>
          Babu 等记录 SG Trend Index 从 2015-04-13 峰值至 2018-12-31 累计约 −19.7%，2010–2018 年化 Sharpe 约 0.05，而 2000–2018 约 0.28；其假设策略分解把弱期主要连接到市场绝对移动／趋势幅度不足，而不是简单宣布所有趋势效率消失。<Cite n={15} />
        </p>
        <p>
          这是特定指数与回测分解，不是所有 CTA 的共同原因。经理速度、非趋势模型、费用、现金收益和市场池不同，最终体验也不同；制度性结论应停在证据支持的层级。
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">58 · 可证伪研究协议</p>
        <h2>研究“趋势订单放大价格”时，必须先冻结谁、何时、因何改变 target，再观察 fills 与价格；仅用策略收益回归无法完成。</h2>
        <ol className="diagnostic-list">
          <li><b>冻结主体与代理：</b>注册 CTA、SG Index 成分、Indicator、COT managed money 与自建 rule 各自回答不同问题。</li>
          <li><b>冻结信息时点：</b>合约选择、roll、价格、FX、vol 和 COT 发布滞后全部按 as-of 保存。</li>
          <li><b>拆分订单来源：</b>signal change、vol scaling、equity change、roll、margin 与申赎分别生成 ΔN。</li>
          <li><b>观察实际实现：</b>target、order、fill、cancel、participation、cost 与 markout 不能混成一列。</li>
          <li><b>识别反向供给：</b>hedger、dealer、discretionary macro 和 value capital 可能吸收或强化订单。</li>
          <li><b>预注册 falsifier：</b>若称 CTA feedback，就应先见共同 target／约束变化，再见同向 fills；若只有价格和经理收益，证据不足。</li>
          <li><b>报告所有研究自由度：</b>市场池、lookback、速度、vol estimator、cost 和危机窗口都纳入 multiple-testing 账本。</li>
        </ol>
        <p>
          White、Bailey 等与 Harvey–Liu–Zhu 分别提供 data snooping、回测过拟合和 factor discovery 的防护。世界观可以承认多种机制，具体研究却必须局部、可观察、可证伪。<Cite n={31} /><Cite n={32} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">阶段八 · 实验与闭环　|　59 · 互动实验</p>
        <h2>十题沿同一条状态链推进：先冻结信息与合约风险，再让协方差、roll、现金结算、成本、回撤和共同去杠杆改变订单。</h2>
        <p>
          题目使用抽象教学合约，不冒充当前产品规格。每题冻结币种、multiplier、FX、波动、相关性、margin、成本口径与忽略项；只有在这些条件下存在唯一答案。答对数值后，还要指出哪个边界变化会让公式失效。
        </p>
        <p className="print-only">打印／PDF 说明：本节十题互动实验只在网页中运行；第 60 节提供同一数据源的十道静态变式及完整答案，第 61 节提供十二道理解检查，打印版会强制显示全部答案。</p>
        <TrendFollowingLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">60 · 主动练习 · 同数据静态变式</p>
        <h2>先离线写出时点、单位、方向、现金流与约束，再展开答案；静态题与互动题共用同一冻结数据源。</h2>
        <div className="practice-grid">
          {trendFollowingScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">61 · 理解检查</p>
        <h2>如果不能脱离指标说明“信号怎样变成 target、target 怎样变成 order”，就还没有理解 trend-following agent。</h2>
        <details className="understanding-check"><summary>01 · 为什么 CTA 不等于 trend follower？</summary><p>CTA 是美国商品利益咨询活动的法律与业务身份；趋势只是可能采用的一类策略。身份不能推出模型、速度或持仓。</p></details>
        <details className="understanding-check"><summary>02 · Trend signal 为多，为什么今天仍可能卖出？</summary><p>真实订单是 target−actual。波动上升、权益下降、margin 或容量收紧都可能降低正 target，使策略在仍看多时减仓。</p></details>
        <details className="understanding-check"><summary>03 · TSMOM 与 cross-sectional momentum 的核心区别是什么？</summary><p>TSMOM 把每个市场与自身历史比较，可全部同向；横截面 momentum 比较相对排名，通常同时买赢家、卖输家。</p></details>
        <details className="understanding-check"><summary>04 · 为什么同一收盘价算信号并成交通常是前视？</summary><p>完整收盘值只有收盘形成后才可知；除非有可验证的预先计算与成交机制，否则最早应使用下一可交易时点。</p></details>
        <details className="understanding-check"><summary>05 · 负价格为什么破坏统一 log-return 管道？</summary><p>log price 在非正值无定义，simple return 在零附近发散；应改用价格变化 P&amp;L、正值 return index 或事前定义的 domain switch。</p></details>
        <details className="understanding-check"><summary>06 · Futures notional、margin 和 risk 为什么不能互换？</summary><p>Notional 是价格水平规模，margin 是抵押门槛，risk 是价格变化对权益的分布；它们即使同为货币也回答不同问题。</p></details>
        <details className="understanding-check"><summary>07 · Roll 当天为什么没有一笔等于远近月价差的独立损益？</summary><p>卖旧、买新只是两笔交易；旧腿按此前价格变化结算，新腿从自身成交价开始计后续损益，另有两腿成本。</p></details>
        <details className="understanding-check"><summary>08 · Inverse-vol 为什么不等于 equal risk？</summary><p>它只按各市场单变量波动缩放；协方差、对冲、sector 数量、跳跃和尾部风险仍会使组件贡献不同。</p></details>
        <details className="understanding-check"><summary>09 · 为什么 vol scaling 与 direction flip 必须分开？</summary><p>波动上升会缩小 gross，无论现仓多空；方向翻转则改变持仓符号。两者时钟、订单方向和因果含义不同。</p></details>
        <details className="understanding-check"><summary>10 · Crisis alpha 为什么不是 put option？</summary><p>趋势模型需要时间建立方向，路径、速度和跨资产状态会改变结果；它没有固定行权价或每次股灾必赔的合同义务。</p></details>
        <details className="understanding-check"><summary>11 · COT managed money 为什么不能直接当 CTA trend 仓位？</summary><p>它是主体主要业务分类，混合 CTA、CPO 与未注册基金，没有逐笔策略、完整 AUM、现金或实时订单。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪“CTA 共同去杠杆推动价格”？</summary><p>应先看到共同 target 或约束收缩，再看到该 cohort 的同向 fills，或明确识别其 add／modify／cancel 等订单簿事件，并观察随后价格／深度响应；若只有同步收益或价格，归因不足。</p></details>
      </section>

      <section className="lesson-section" id="glossary-interfaces">
        <p className="section-kicker">62 · Glossary、接口与闭环</p>
        <h2>本节最终产物不是一组均线，而是一张能把趋势方向、期货现金流、风险政策和市场反馈分层的 agent map。</h2>
        <div className="interface-grid">
          <article><span>回接 T01 / T08</span><h3>收益与时钟</h3><p>正值 return index、负价边界、as-of cutoff 与可交易时点决定信号是否因果。</p></article>
          <article><span>回接 1.09 / 1.20</span><h3>冲击与生存</h3><p>Target 只有穿过订单簿事件、fills、impact、margin、collateral 与 NAV 路径后才成为现实市场行为。</p></article>
          <article><span>连接 2.11</span><h3>Vol-control</h3><p>本节把缩放作为 trend 内部约束，下一节将独立研究机械波动目标资金。</p></article>
          <article><span>连接 6.13 / 7.04</span><h3>信念与反馈</h3><p>后续把规则性 momentum order 与人的趋势信念、正反馈和复杂系统稳定性重新组合。</p></article>
        </div>
        <div className="precision-note">
          <span>术语回查不是背单词，而是定位状态变量</span>
          <p>主体、policy、signal、target、actual、order 与 fill 回到 01–02；CTA／CPO 回到 03–04；MOP／KTW 回到 13；DV01、quanto 与 Greeks 回到 17、29；roll 与连续合约回到 16、41–44；FCM、margin、collateral 与 NAV 回到 38–40；gross、sleeve、AUM、OTC 与 GFC 分别回到 20、35、51–54。遇到陌生词时先确定它属于主体、信息、目标、约束、订单、成交还是结算，不要把不同层的词当成同一变量。</p>
        </div>
        <p>
          最小复述应是：<b>截至决策前的实际合约收益生成有界方向信号；合约规格、每张现金风险、协方差与约束把信号变成 target；target 与 actual 的差经取整、成交和每日结算改变 NAV；价格、波动、相关性与权益又重写下一轮 target；多个主体的相似 fills 可能成为价格反馈，但只有时点一致的共同持仓、约束和订单证据才能识别。</b>
        </p>
      </section>
    </>
  );
}

export const lesson210: LessonRecord = {
  slug: '2-10',
  id: '2.10',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'CTA / Trend Following：从滞后价格路径到目标合约与反馈订单',
  subtitle: '区分监管身份、趋势信号与真实订单，解释期货规格、逐日结算、展期、波动缩放、相关性和权益路径怎样共同塑造趋势资本的反馈',
  readingTime: '核心阅读约 125–145 分钟；互动实验快速 25–30／含复盘 45–55，主动练习核对 25–30／完整书写 45–60，理解检查快速 10–12／完整复述 18–22，课程接口 4 分钟；快速路径约 189–221 分钟，完整学习约 237–286 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T01；按需回看 T03、T07–T08、1.09、1.20、2.09',
  updatedAt: '2026-08-30',
  revision: '2.10-r6',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.10-r6',
      summary: '独立复核 63 节、13 张公式卡、10 道互动题与 10 道静态变式、43 条来源与 119 个邻接引文，并逐项核验 CTA／CPO／COT、期货结算与 margin／collateral、roll、focal-cohort 成交净流、partial fill、订单簿事件及因果识别边界；P0–P3 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.10-r6',
      summary: '独立复核零基础术语桥、63 节递进、连续期货信号与现金账本分工、10+10 题、损坏记录恢复、无默认答案、无脚本／打印降级、键盘焦点与语义无障碍及 6／7／10／5 分层阅读路径；P0–P3 均为 0。',
    },
  ],
  previous: { slug: '2-09', label: '2.09 Statistical Arbitrage / Market Neutral' },
  next: { slug: '2-11', label: '2.11 Volatility Targeting / Vol-control' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与排除项' },
    { id: 'system-loop', label: '完整状态闭环' },
    { id: 'cta-identity', label: 'CTA 是什么' },
    { id: 'managed-futures', label: 'Managed Futures' },
    { id: 'trend-following-definition', label: 'Trend Following' },
    { id: 'time-series-momentum', label: 'Time-series Momentum' },
    { id: 'cross-sectional-momentum', label: 'Cross-sectional Momentum 边界' },
    { id: 'linear-filters', label: 'Linear Filters' },
    { id: 'no-point-forecast', label: '不预测价格的含义' },
    { id: 'external-persistence', label: '外生持续机制' },
    { id: 'positive-feedback', label: '内生正反馈' },
    { id: 'reversal', label: '反转与负反馈资本' },
    { id: 'evidence-causality', label: '收益证据与价格因果' },
    { id: 'stability-boundary', label: '正反馈的稳定边界' },
    { id: 'information-cutoff', label: 'Information Cutoff' },
    { id: 'tradable-return-chain', label: '可交易收益链' },
    { id: 'negative-price-domain', label: '零价、负价与定义域' },
    { id: 'lookback-horizon', label: 'Lookback Horizon' },
    { id: 'signal-speed', label: 'Signal Speed' },
    { id: 'multi-speed-ensemble', label: 'Multi-speed Ensemble' },
    { id: 'signal-shapes', label: 'Binary、Continuous 与 Hysteresis' },
    { id: 'saturation-deadband', label: 'Saturation 与 Deadband' },
    { id: 'turning-point', label: 'Turning Point' },
    { id: 'carry-contamination', label: 'Carry Contamination' },
    { id: 'ex-ante-universe', label: 'Ex-ante Universe' },
    { id: 'contract-specification', label: 'Contract Specification' },
    { id: 'notional-risk-margin', label: 'Notional、Risk 与 Margin' },
    { id: 'contract-pnl-fx', label: 'Unit P&amp;L 与 FX' },
    { id: 'dollar-vol-position', label: 'Dollar-vol Position Sizing' },
    { id: 'integer-rounding', label: 'Integer Rounding' },
    { id: 'feasibility-caps', label: 'Feasibility Caps' },
    { id: 'volatility-estimator', label: 'Volatility Estimator' },
    { id: 'inverse-vol-boundary', label: 'Inverse-vol 边界' },
    { id: 'portfolio-vol-target', label: 'Portfolio Vol Target' },
    { id: 'correlation-risk-contribution', label: 'Correlation 与 Risk Contribution' },
    { id: 'sector-risk-budget', label: 'Sector Risk Budget' },
    { id: 'daily-settlement', label: 'Daily Settlement' },
    { id: 'margin-types', label: 'Margin Types' },
    { id: 'collateral-return', label: 'Collateral Return' },
    { id: 'nav-update', label: 'NAV Update' },
    { id: 'basis-calendar-spread', label: 'Basis 与 Calendar Spread' },
    { id: 'roll-mechanics', label: 'Roll Mechanics' },
    { id: 'continuous-futures', label: 'Continuous Futures' },
    { id: 'expiry-delivery', label: 'Expiry 与 Delivery' },
    { id: 'turnover-cost', label: 'Turnover 与 Cost' },
    { id: 'capacity', label: 'Capacity' },
    { id: 'target-order-impact', label: 'Target、Order 与 Fill' },
    { id: 'feedback-amplification', label: 'Trend Amplification' },
    { id: 'whipsaw', label: 'Reversal 与 Whipsaw' },
    { id: 'vol-scaling-feedback', label: 'Vol-scaling Feedback' },
    { id: 'drawdown-deleveraging', label: 'Drawdown 与 Deleveraging' },
    { id: 'crowding-identification', label: 'Crowding 与 COT' },
    { id: 'crisis-alpha', label: 'Crisis Alpha' },
    { id: 'gfc-case', label: '2007–2009 GFC' },
    { id: 'inflation-2022-case', label: '2022 Inflation Shock' },
    { id: 'fast-crisis-counterexample', label: '2018／2020 反例' },
    { id: 'weak-trend-regime', label: '2010s 弱趋势期' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'glossary-interfaces', label: 'Glossary 与接口' },
  ],
  Content: Lesson210Content,
  references: [
    { id: 1, authors: 'U.S. Commodity Futures Trading Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'Commodity Trading Advisors (CTAs)', publication: 'CFTC official intermediary page', url: 'https://www.cftc.gov/IndustryOversight/Intermediaries/CTAs/index.htm', use: '支持 CFTC 将 CTA 作为受监管 intermediary 并将注册职能委托 NFA；CTA 活动定义和事实特定注册边界由 NFA 原文另行支持，不能从身份推断策略。' },
    { id: 2, authors: 'National Futures Association', year: '2026/current', accessedAt: '2026-08-30', title: 'Commodity Trading Advisor Registration', publication: 'NFA official registration guidance', url: 'https://www.nfa.futures.org/registration-membership/who-has-to-register/cta.html', use: '支持 CTA 注册入口和事实特定豁免边界；本节不是法律意见，也不枚举易变的全部豁免。' },
    { id: 3, authors: 'U.S. Commodity Futures Trading Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'Disaggregated Commitments of Traders: Explanatory Notes', publication: 'CFTC official market report documentation', url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/DisaggregatedExplanatoryNotes/index.htm', use: '支持 Managed Money 是主体主要业务分类并混合 CTA、CPO 与未注册基金；不能识别逐笔趋势策略或实时订单。' },
    { id: 4, authors: 'Société Générale Prime Services', year: 'undated', accessedAt: '2026-08-30', title: 'SG Trend Index Construction Methodology', publication: 'Sponsor-posted methodology PDF without visible revision date', url: 'https://wholesale.banking.societegenerale.com/fileadmin/indices_feeds/SG_Trend_Index_Methodology.pdf', use: '支持截至访问日可取得版本中的十家大型合格经理、等权、费后回报和非可投资同业指数构造；访问日期不是修订年份，文件也不揭示经理真实信号。' },
    { id: 5, authors: 'Société Générale Prime Services', year: '2016', accessedAt: '2026-08-30', title: 'SG Trend Indicator Construction Methodology Summary', publication: 'Sponsor-posted ©2016 hypothetical model methodology summary', url: 'https://wholesale.banking.societegenerale.com/fileadmin/indices_feeds/SG_Trend_Indicator_Methodology_Summary.pdf', use: '支持该 2016 摘要所定义的 20／120 日均线、55 个市场、15% 波动目标和四部门风险分配；不能冒充 SG Trend Index 成分经理，也不证明参数在 2026 年重新确认。' },
    { id: 6, authors: 'J. Bradford De Long, Andrei Shleifer, Lawrence Summers and Robert Waldmann', year: '1990', accessedAt: '2026-08-30', title: 'Positive Feedback Investment Strategies and Destabilizing Rational Speculation', publication: 'Journal of Finance 45(2), 379–395', url: 'https://doi.org/10.1111/j.1540-6261.1990.tb03695.x', use: '支持正反馈交易者与抢跑者可能放大价格变化的理论机制；不能证明现实 CTA 是任何具体趋势的原因。' },
    { id: 7, authors: 'Harrison Hong and Jeremy Stein', year: '1999', accessedAt: '2026-08-30', title: 'A Unified Theory of Underreaction, Momentum Trading, and Overreaction in Asset Markets', publication: 'Journal of Finance 54(6), 2143–2184', url: 'https://doi.org/10.1111/0022-1082.00184', use: '支持信息渐进扩散、动量资本进入和后续过度反应的条件链；不能直接证明期货趋势组合收益。' },
    { id: 8, authors: 'Dimitri Vayanos and Paul Woolley', year: '2013', accessedAt: '2026-08-30', title: 'An Institutional Theory of Momentum and Reversal', publication: 'Review of Financial Studies 26(5), 1087–1145', url: 'https://doi.org/10.1093/rfs/hht014', use: '支持委托管理和资金流导致缓慢调整与反转的理论；不能把全部价格趋势归因于基金流。' },
    { id: 9, authors: 'William Fung and David Hsieh', year: '2001', accessedAt: '2026-08-30', title: 'The Risk in Hedge Fund Strategies: Theory and Evidence from Trend Followers', publication: 'Review of Financial Studies 14(2), 313–341', url: 'https://doi.org/10.1093/rfs/14.2.313', use: '支持趋势跟随收益具有类似 lookback straddle 的动态非线性暴露；不表示存在固定行权价或危机必赔。' },
    { id: 10, authors: 'Ari Levine and Lasse Pedersen', year: '2016', accessedAt: '2026-08-30', title: 'Which Trend Is Your Friend?', publication: 'Financial Analysts Journal 72(3), 51–66', url: 'https://doi.org/10.2469/faj.v72.n3.3', use: '支持不同 trend filter、速度和组合构造的比较；不是实际 CTA 的统一配方。' },
    { id: 11, authors: 'Tobias Moskowitz, Yao Hua Ooi and Lasse Pedersen', year: '2012', accessedAt: '2026-08-30', title: 'Time Series Momentum', publication: 'Journal of Financial Economics 104(2), 228–250', url: 'https://doi.org/10.1016/j.jfineco.2011.11.003', use: '支持 58 个期货／远期市场中过去 1–12 个月收益持续性及缩放聚合组合；组合结果不能全归因于增量价格预测。' },
    { id: 12, authors: 'Abby Y. Kim, Yiuman Tse and John K. Wald', year: '2016', accessedAt: '2026-08-30', title: 'Time Series Momentum and Volatility Scaling', publication: 'Journal of Financial Markets 30, 103–124', url: 'https://doi.org/10.1016/j.finmar.2016.05.003', use: '支持 inverse-vol scaling 对 TSMOM 收益归因和显著性的影响；不能推出趋势经理没有技能。' },
    { id: 13, authors: 'Dashan Huang, Jiangyuan Li, Liyao Wang and Guofu Zhou', year: '2020', accessedAt: '2026-08-30', title: 'Time Series Momentum: Is It There?', publication: 'Journal of Financial Economics 135(3), 774–794', url: 'https://doi.org/10.1016/j.jfineco.2019.08.004', use: '支持对简单固定回看期 TSMOM 的逐资产、bootstrap pooled 与历史均值混淆质疑；不能否定全部多速度趋势策略。' },
    { id: 14, authors: 'Brian Hurst, Yao Hua Ooi and Lasse Pedersen', year: '2017', accessedAt: '2026-08-30', title: 'A Century of Evidence on Trend-Following Investing', publication: 'Journal of Portfolio Management 44(1), 15–29', url: 'https://doi.org/10.3905/jpm.2017.44.1.015', use: '支持长期构造性回测及作者定义的十次 60/40 危机中八次良好表现；不是 1880 年以来真实可投资净费记录。' },
    { id: 15, authors: 'Abhilash Babu, Brendan Hoffman, Ari Levine, Yao Hua Ooi, Sarah Schroeder and Erik Stamelos', year: '2020', accessedAt: '2026-08-30', title: 'You Can’t Always Trend When You Want', publication: 'Journal of Portfolio Management 46(4), 52–68', url: 'https://doi.org/10.3905/jpm.2020.1.133', use: '支持 SG Trend 2015–2018 回撤、2010–2018 弱 Sharpe 和市场移动幅度分解；假设策略不等于基金实盘回报。' },
    { id: 16, authors: 'Nick Baltas and Robert Kosowski', year: '2020', accessedAt: '2026-08-30', title: 'Demystifying Time-Series Momentum Strategies: Volatility Estimators, Trading Rules and Pairwise Correlations', publication: 'Market Momentum: Theory and Practice, Wiley, Chapter 3, 30–67', url: 'https://doi.org/10.1002/9781119599364.ch3', use: '支持趋势实现对波动估计、速度、相关性、换月和成本的敏感性；书章不是全行业生产标准。' },
    { id: 17, authors: 'Christian L. Goulding, Campbell R. Harvey and Michele G. Mazzoleni', year: '2023', accessedAt: '2026-08-30', title: 'Momentum Turning Points', publication: 'Journal of Financial Economics 149(3), 378–406', url: 'https://doi.org/10.1016/j.jfineco.2023.05.007', use: '支持动量策略在趋势转折处的路径脆弱性；事后 turning-point 分类不能冒充实时预知。' },
    { id: 18, authors: 'Christian L. Goulding, Campbell R. Harvey and Michele G. Mazzoleni', year: '2024', accessedAt: '2026-08-30', title: 'Breaking Bad Trends', publication: 'Financial Analysts Journal 80(1), 84–98; online 2023', url: 'https://doi.org/10.1080/0015198X.2023.2270084', use: '支持坏趋势和转折风险管理的讨论；不能证明所有趋势回撤可被事前消除。' },
    { id: 19, authors: 'Ralph Koijen, Tobias Moskowitz, Lasse Pedersen and Evert Vrugt', year: '2018', accessedAt: '2026-08-30', title: 'Carry', publication: 'Journal of Financial Economics 127(2), 197–225', url: 'https://doi.org/10.1016/j.jfineco.2017.11.002', use: '支持跨资产 carry 的统一结构及其与价格不变收益的关系；不能把 carry 静默归入趋势方向 alpha。' },
    { id: 20, authors: 'Hendrik Bessembinder', year: '2018', accessedAt: '2026-08-30', title: 'The “Roll Yield” Myth', publication: 'Financial Analysts Journal 74(2), 41–53', url: 'https://doi.org/10.2469/faj.v74.n2.5', use: '支持远近月价差不是换月瞬间的独立现金流；不表示期限结构没有信息或收益含义。' },
    { id: 21, authors: 'Alan Moreira and Tyler Muir', year: '2017', accessedAt: '2026-08-30', title: 'Volatility-Managed Portfolios', publication: 'Journal of Finance 72(4), 1611–1644', url: 'https://doi.org/10.1111/jofi.12513', use: '支持部分历史组合中 volatility management 改善风险调整后收益的证据；不是普适实时定理。' },
    { id: 22, authors: 'Scott Cederburg, Michael O’Doherty, Feifei Wang and Xuemin Yan', year: '2020', accessedAt: '2026-08-30', title: 'On the Performance of Volatility-Managed Portfolios', publication: 'Journal of Financial Economics 138(1), 95–117', url: 'https://doi.org/10.1016/j.jfineco.2020.04.015', use: '提供更广策略和实时设计下 volatility management 不普遍胜出的反例。' },
    { id: 23, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'About Contract Notional Value', publication: 'CME Group Education', url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/about-contract-notional-value', use: '支持普通线性期货的价格、乘数与名义价值换算；不能替代具体产品当前 rulebook。' },
    { id: 24, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'Calculating Futures Contract Profit or Loss', publication: 'CME Group Education', url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/calculating-futures-contract-profit-or-loss', use: '支持合约数、乘数和价格变化的通用期货 P&L 计算；特殊报价与跨币结算须另核规则。' },
    { id: 25, authors: 'CME Clearing', year: '2015', accessedAt: '2026-08-30', title: 'Money Calculations for CME-cleared Futures and Options', publication: 'CME Clearing technical guide, updated 11 June 2015', url: 'https://www.cmegroup.com/clearing/files/CME-Money-Calculations-Futures-and-Options.pdf', use: '支持 settlement variation、逐日现金结算和 money calculation 框架；客户入账及换汇仍受产品与 FCM 流程约束。' },
    { id: 26, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'The Benefits of Futures Margins', publication: 'CME Group Education', url: 'https://www.cmegroup.com/education/courses/understanding-the-benefits-of-futures/the-benefits-of-futures-margins', use: '支持 initial／maintenance performance bond 与每日损益的区分；交易所最低 margin 不等于 FCM house requirement 或最大损失。' },
    { id: 27, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'Physical Delivery vs. Cash Settlement', publication: 'CME Group Education', url: 'https://www.cmegroup.com/education/courses/master-the-trade-futures/expanding-your-futures-knowledge/master-the-trade-physical-delivery-vs-cash-settlement', use: '支持现金结算与实物交割的制度区别；具体 first notice、last trade 和 FCM 平仓规则须逐产品核对。' },
    { id: 28, authors: 'Société Générale Prime Services', year: '2025', accessedAt: '2026-08-30', title: 'Keeping Up with the Trend Followers', publication: 'Société Générale CTA research report', url: 'https://content.sgmarkets.com/CTA_UPDATE_KEEPING_UP_WITH_THE_TRENDFOLLOWERS_2025', use: '支持 Indicator 是假设性归因工具、经理速度更复杂及 Index／Indicator 相关性会断裂；属于机构材料而非独立因果证据。' },
    { id: 29, authors: 'AQR Capital Management', year: '2022', accessedAt: '2026-08-30', title: 'Trend-Following: Why Now? A Macro Perspective', publication: 'AQR white-paper page', url: 'https://www.aqr.com/Insights/Research/White-Papers/Trend-Following-Why-Now-A-Macro-Perspective', use: '支持截至 2022-09-30 SG Trend 约 +36% 与所定义全球 60/40 约 −20% 的同窗数字；不能改写为全年或因果结论。' },
    { id: 30, authors: 'Man Group', year: '2023', accessedAt: '2026-08-30', title: 'What’s Trending: Trend-Following—What’s Not to Like?', publication: 'Man Institute article', url: 'https://www.man.com/insights/trend-following-what-not-to-like', use: '支持 BTOP50 在 GFC、Q4 2018、Feb–Mar 2020 与 2022 前三季度的条件化事件窗口；BTOP50 不能冒充 SG Trend。' },
    { id: 31, authors: 'Halbert White', year: '2000', accessedAt: '2026-08-30', title: 'A Reality Check for Data Snooping', publication: 'Econometrica 68(5), 1097–1126', url: 'https://doi.org/10.1111/1468-0262.00152', use: '支持对候选模型搜索进行 data-snooping 校正；不能修复前视、错误时钟或错误数据。' },
    { id: 32, authors: 'David Bailey, Jonathan Borwein, Marcos López de Prado and Qiji Jim Zhu', year: '2017', accessedAt: '2026-08-30', title: 'The Probability of Backtest Overfitting', publication: 'Journal of Computational Finance 20(4), 39–69', url: 'https://doi.org/10.21314/JCF.2016.322', use: '支持 CSCV／PBO 对候选策略搜索过拟合的评估；结果依赖候选生成与切分设计。' },
    { id: 33, authors: 'Campbell Harvey, Yan Liu and Heqing Zhu', year: '2016', accessedAt: '2026-08-30', title: '… and the Cross-Section of Expected Returns', publication: 'Review of Financial Studies 29(1), 5–68', url: 'https://doi.org/10.1093/rfs/hhv059', use: '支持 factor zoo 与 multiple-testing 风险；不提供对每个研究都相同的机械显著性阈值。' },
    { id: 34, authors: 'Robert Almgren and Neil Chriss', year: '2001', accessedAt: '2026-08-30', title: 'Optimal Execution of Portfolio Transactions', publication: 'Journal of Risk 3(2), 5–39', url: 'https://doi.org/10.21314/JOR.2001.041', use: '支持执行成本、临时／永久冲击和执行风险的框架；教学线性成本不是生产 impact model。' },
    { id: 35, authors: 'Albert Kyle', year: '1985', accessedAt: '2026-08-30', title: 'Continuous Auctions and Insider Trading', publication: 'Econometrica 53(6), 1315–1335', url: 'https://doi.org/10.2307/1913210', use: '支持净订单流与价格响应斜率的经典桥梁；现实冲击具有非线性、时变和内生性。' },
    { id: 36, authors: 'Markus Brunnermeier and Lasse Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '支持融资流动性与市场流动性可形成状态依赖螺旋；不表示每次趋势减仓都会升级。' },
    { id: 37, authors: 'CME Clearing', year: '2020', accessedAt: '2026-08-30', title: 'Testing Opportunities in CME’s “New Release” Environment for Negative Prices and Strikes for Certain NYMEX Energy Contracts', publication: 'CME Clearing Advisory 20-160', url: 'https://www.cmegroup.com/notices/clearing/2020/04/Chadv20-160.pdf', use: '支持部分 NYMEX 能源期货可测试零／负交易或结算价格及零／负期权行权价；不表示期权 premium 或所有合约可为负。' },
    { id: 38, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'Understanding Futures Expiration and Contract Roll', publication: 'CME Group Education', url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/understanding-futures-expiration-contract-roll', use: '支持到期前平旧建新的通用换月机制；换月时点和交割风险仍须使用产品规则。' },
    { id: 39, authors: 'CME Group', year: '2026/current', accessedAt: '2026-08-30', title: 'Expiration Calendar', publication: 'CME Group official calendar', url: 'https://www.cmegroup.com/tools-information/calendars/expiration-calendar.html', use: '支持到期日期必须按产品和月份核对；当前日历不能反向替代历史 as-of 规则。' },
    { id: 40, authors: 'U.S. Commodity Futures Trading Commission', year: '2026', accessedAt: '2026-08-30', title: 'Commitments of Traders Release Schedule for 2026', publication: 'CFTC official release schedule', url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/ReleaseSchedule/index.htm', use: '支持 COT 通常周五发布前一周二持仓快照及节假日例外；周度仓位变化不等于区间成交流。' },
    { id: 41, authors: 'National Futures Association', year: '2026/current', accessedAt: '2026-08-30', title: 'Commodity Pool Operator Registration', publication: 'NFA official registration guidance', url: 'https://www.nfa.futures.org/registration-membership/who-has-to-register/cpo.html', use: '支持经营并募集 commodity pool 进入 CPO 身份分析；不能从 CPO 身份推断底层趋势策略或产品条款。' },
    { id: 42, authors: 'U.S. Commodity Futures Trading Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'Commitments of Traders', publication: 'CFTC official report-family overview', url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/index.htm', use: '支持 Disaggregated COT 与 Traders in Financial Futures 的市场范围和分类体系不同；两者都不提供 CTA trend 策略标签。' },
    { id: 43, authors: 'Rama Cont, Arseniy Kukanov and Sasha Stoikov', year: '2014', accessedAt: '2026-08-30', title: 'The Price Impact of Order Book Events', publication: 'Journal of Financial Econometrics 12(1), 47–88', url: 'https://doi.org/10.1093/jjfinec/nbt003', use: '支持限价单提交、撤销和成交都可通过订单簿事件与报价变化相关；不能把其 order-flow-imbalance 斜率直接当作本文 CTA cohort 的结构因果系数。' },
  ],
  readingList: [
    { title: 'Moskowitz, Ooi & Pedersen (2012)', scope: '58 个期货／远期市场的 time-series momentum、缩放与聚合', reason: '从最常引用的 TSMOM 实证出发，同时辨认方向信号、风险缩放和组合分散各自做了什么。', url: 'https://doi.org/10.1016/j.jfineco.2011.11.003', group: 'core', guide: '先读 Sections 1–3 与结论，再核对组合构造；约 120–180 分钟。' },
    { title: 'Fung & Hsieh (2001)', scope: '趋势跟随的动态交易暴露与 lookback-straddle 表示', reason: '理解“危机凸性”为什么是路径生成的非线性，而不是一张静态保险合同。', url: 'https://doi.org/10.1093/rfs/14.2.313', group: 'core', guide: '先修 T07；先读机制直觉和实证因子，再按需读推导；约 120 分钟。' },
    { title: 'Levine & Pedersen (2016)', scope: '不同趋势定义、速度与组合构造', reason: '把 trend following 从单一均线扩展成一族可比较 policies。', url: 'https://doi.org/10.2469/faj.v72.n3.3', group: 'core', guide: '先读信号定义和实现比较；约 90–120 分钟。' },
    { title: 'Baltas & Kosowski (2020)', scope: '波动估计、交易规则、相关性、换月与成本', reason: '把信号真正连接到合约数、风险预算和实施摩擦。', url: 'https://doi.org/10.1002/9781119599364.ch3', group: 'core', guide: '先读本节 25–52，再逐项核对 estimator 与 portfolio construction；约 150–210 分钟。' },
    { title: 'Bessembinder (2018)', scope: 'roll yield 语义、期货与现货收益分解', reason: '彻底纠正“远近月价差在换月时立刻变成现金损益”的常见错误。', url: 'https://rpc.cfainstitute.org/research/financial-analysts-journal/2018/faj-v74-n2-5', group: 'core', guide: '先读本节 41–44；官方页公开摘要，全文可能需要会员或机构访问；约 45–60 分钟。' },
    { title: 'SG Trend Indicator Methodology · ©2016 Summary', scope: '该历史摘要中的 20／120 日均线、55 个市场、风险配置、执行与成本假设', reason: '观察一个透明归因模型如何把信号变成组合，同时训练“不把 proxy 或历史参数当真实经理当前规则”的边界。', url: 'https://wholesale.banking.societegenerale.com/fileadmin/indices_feeds/SG_Trend_Indicator_Methodology_Summary.pdf', group: 'core', guide: '与未标可见修订日的 SG Trend Index 方法学对照阅读；约 45–75 分钟。' },
    { title: 'De Long et al. (1990)', scope: 'positive-feedback traders 与 destabilizing speculation', reason: '为“趋势规则何时可能成为价格反馈”建立可计算的理论边界。', url: 'https://doi.org/10.1111/j.1540-6261.1990.tb03695.x', group: 'models', guide: '先读模型参与者、均衡直觉与比较静态；约 120–180 分钟。' },
    { title: 'Hong & Stein (1999)', scope: '信息渐进扩散、underreaction、momentum 与 overreaction', reason: '理解短中期持续和长期反转为何可以在同一模型里共存。', url: 'https://doi.org/10.1111/0022-1082.00184', group: 'models', guide: '先抓 newswatcher／momentum trader 的分工，再读命题；约 120–180 分钟。' },
    { title: 'Vayanos & Woolley (2013)', scope: '委托管理、资金流、momentum 与 reversal', reason: '把趋势从纯心理叙事连接到机构资金流与慢速均衡调整。', url: 'https://doi.org/10.1093/rfs/hht014', group: 'models', guide: '先读模型直觉和实证含义；约 150–210 分钟。' },
    { title: 'Kim, Tse & Wald (2016)', scope: 'TSMOM 与 volatility scaling 的收益归因', reason: '训练把方向预测与风险缩放贡献拆开，而不是只看最终 Sharpe。', url: 'https://doi.org/10.1016/j.finmar.2016.05.003', group: 'models', guide: '与 MOP 同读，重点比较 unscaled 与 scaled portfolios；约 90–120 分钟。' },
    { title: 'Koijen et al. (2018)', scope: '跨资产 carry 的统一定义', reason: '识别趋势收益中可能混入的期限结构、利差与现金收益成分。', url: 'https://doi.org/10.1016/j.jfineco.2017.11.002', group: 'models', guide: '先修债券／期货最小基础；先读定义与资产案例；约 120–180 分钟。' },
    { title: 'Moreira & Muir (2017)', scope: 'volatility-managed portfolios 的理论与历史证据', reason: '理解风险缩放为什么可能改变平均暴露和风险调整后收益。', url: 'https://doi.org/10.1111/jofi.12513', group: 'models', guide: '与 Cederburg et al. 对读；约 120–180 分钟。' },
    { title: 'Brunnermeier & Pedersen (2009)', scope: 'funding liquidity、market liquidity 与 margin spiral', reason: '把 CTA 局部减仓接入更广的资产负债表—流动性反馈，但不预设螺旋必然发生。', url: 'https://doi.org/10.1093/rfs/hhn098', group: 'models', guide: '先修 T06 与 1.20；约 150–210 分钟。' },
    { title: 'Hurst, Ooi & Pedersen (2017)', scope: '长期跨资产趋势回测与历史危机', reason: '学习如何使用长样本证据，同时保留可交易性、数据构造和危机选择边界。', url: 'https://doi.org/10.3905/jpm.2017.44.1.015', group: 'evidence', guide: '重点读数据、危机定义与局限；约 90–120 分钟。' },
    { title: 'Babu et al. (2020)', scope: '2010s 弱趋势期、趋势幅度、效率与分散度分解', reason: '理解多年贫瘠如何与危机期潜在收益共存。', url: 'https://doi.org/10.3905/jpm.2020.1.133', group: 'evidence', guide: '重点复算 2010–2018 指数统计并区分经理指数与假设策略；约 90–120 分钟。' },
    { title: 'Huang et al. (2020)', scope: '简单 TSMOM 的逐资产、pooled 与历史均值质疑', reason: '为经典证据提供严肃反方，防止把一个组合曲线写成机制定论。', url: 'https://doi.org/10.1016/j.jfineco.2019.08.004', group: 'evidence', guide: '与 MOP、KTW 对读；约 120–180 分钟。' },
    { title: 'Goulding, Harvey & Mazzoleni (2023)', scope: 'momentum turning points 与回撤路径', reason: '研究趋势最脆弱的状态，同时避免把事后转折标签当实时信号。', url: 'https://doi.org/10.1016/j.jfineco.2023.05.007', group: 'evidence', guide: '先读 turning-point 定义、识别与交易含义；约 120–180 分钟。' },
    { title: 'Goulding, Harvey & Mazzoleni (2024)', scope: 'bad trends、转折风险与可能的风险管理', reason: '把趋势失效拆成可诊断状态，并审计任何事前改进的可实现性。', url: 'https://doi.org/10.1080/0015198X.2023.2270084', group: 'evidence', guide: '与 Momentum Turning Points 连续阅读；约 90–120 分钟。' },
    { title: 'Cederburg et al. (2020)', scope: '更广策略集合中的 volatility management 反证', reason: '防止把缩放机制误写成普遍改善收益的免费规则。', url: 'https://doi.org/10.1016/j.jfineco.2020.04.015', group: 'evidence', guide: '与 Moreira–Muir 对读，重点看实时设计与异质结果；约 120–180 分钟。' },
    { title: 'SG (2025) · Keeping Up with the Trend Followers', scope: '经理 Index 与透明 Indicator 的相关性、速度和归因差异', reason: '用一方资料学习 proxy audit：它能说明设计差异，却不能证明因果。', url: 'https://content.sgmarkets.com/CTA_UPDATE_KEEPING_UP_WITH_THE_TRENDFOLLOWERS_2025', group: 'evidence', guide: '先读方法与相关性断裂，再核对利益相关方身份；约 45–60 分钟。' },
    { title: 'AQR (2022) · Trend-Following: Why Now?', scope: '2022 前三季度 SG Trend 与全球 60/40 的同窗表现', reason: '练习保留窗口、基准定义、代理与材料性质，拒绝把前三季度写成全年。', url: 'https://www.aqr.com/Insights/Research/White-Papers/Trend-Following-Why-Now-A-Macro-Perspective', group: 'evidence', guide: '先核对截至日期和 60/40 构造；约 30–45 分钟。' },
    { title: 'Man (2023) · Trend-Following—What’s Not to Like?', scope: 'BTOP50 的 GFC、Q4 2018、Covid 与 2022 条件案例', reason: '把正例和反例放在同一代理、同一文章中，训练危机 alpha 的条件性。', url: 'https://www.man.com/insights/trend-following-what-not-to-like', group: 'evidence', guide: '逐一记录代理、窗口、股票基准和作者 caveat；约 45–60 分钟。' },
    { title: 'White (2000) · Data-snooping Reality Check', scope: '多候选搜索下的检验与 benchmark data snooping', reason: '先为多市场、多速度、多阈值搜索建立候选全集与统计防护。', url: 'https://doi.org/10.1111/1468-0262.00152', group: 'evidence', guide: '读完本篇后，再通过参考文献 32 进入 Bailey et al. 的 PBO；约 210–300 分钟。' },
    { title: 'CFTC · Commodity Trading Advisors', scope: 'CTA 的官方身份入口', reason: '从监管原文建立“身份不等于策略”的第一条边界。', url: 'https://www.cftc.gov/IndustryOversight/Intermediaries/CTAs/index.htm', group: 'rules', guide: '与 NFA 注册页对照，实际业务须按当前规则和事实判断；约 30–45 分钟。' },
    { title: 'CFTC · Disaggregated COT Explanatory Notes', scope: 'Managed Money 分类、报告对象和局限', reason: '避免把周频主体分类误当 CTA trend 实时仓位或净订单。', url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/DisaggregatedExplanatoryNotes/index.htm', group: 'rules', guide: '再读发布日程，记录周二快照与周五发布的时间差；约 30–45 分钟。' },
    { title: 'CME · About Contract Notional Value', scope: '普通线性合约的价格、乘数与名义价值', reason: '先把一张合约从价格符号转换成货币规模，同时守住 notional≠risk≠margin。', url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/about-contract-notional-value', group: 'rules', guide: '再通过参考文献 24–26 读 P&L、结算和 margin，并对真实产品查当期 rulebook；约 60–90 分钟。' },
    { title: 'CME Clearing · Money Calculations', scope: '每日 settlement variation 与 money conventions', reason: '理解期货损益如何进入现金和 NAV，而非只停留在未实现价格变化。', url: 'https://www.cmegroup.com/clearing/files/CME-Money-Calculations-Futures-and-Options.pdf', group: 'rules', guide: '先读通用结算结构，再按具体产品查报价与换汇；约 60–90 分钟。' },
    { title: 'CME · Understanding Futures Expiration and Contract Roll', scope: '到期前平旧建新的通用换月机制', reason: '先建立产品特定 roll policy 的入口，拒绝统一“第三个星期五”规则。', url: 'https://www.cmegroup.com/education/courses/introduction-to-futures/understanding-futures-expiration-contract-roll', group: 'rules', guide: '再通过参考文献 27、39 读交割类型与日历；实盘判断须查当前 rulebook 与 FCM policy；约 60–90 分钟。' },
  ],
};
