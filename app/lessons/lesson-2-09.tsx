import StatArbLab from '../components/StatArbLab';
import { statArbScenarios } from '../components/statArbScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson209Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Statistical arbitrage 不是“发现价差后等待它必然回归”，而是把一个不确定的相对收益信号变成多空组合，并在暴露、成本、借券、融资、流动性与风险限额不断变化时决定还能否持有。</h2>
        <p>
          相对价值资本在正常状态下常形成负反馈：买入相对便宜资产、卖出相对昂贵资产，使偏离收窄并向市场提供对向流动性。但同一组合若使用杠杆、依赖稳定借券和外部融资，又被许多机构以相似信号、持仓和风险模型复制，那么亏损、波动上升、margin 收紧或赎回会缩小可行集。此时价差越宽不再意味着越能加仓，而可能意味着权益越少、可借证券越稀缺、必须卖出的数量越大。负反馈策略于是切换成共同减仓的正反馈。<Cite n={23} /><Cite n={24} /><Cite n={25} /><Cite n={34} />
        </p>
        <p>
          本节因此始终区分三件事：<b>统计关系是否存在、组合是否对声明的暴露中性、策略是否能沿现实路径融资和执行。</b>前两件事都成立，也不能推出第三件事；“market neutral”更不能推出零 gross、零 beta、零回撤或无风险。最终要解释的不是某个 z-score，而是一条完整链：相对信号怎样进入组合，组合怎样进入交易和资产负债表，损益怎样反过来改变仓位，许多主体的相似反应又怎样成为下一轮价格输入。<Cite n={4} /><Cite n={5} /><Cite n={22} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与排除项</p>
        <h2>硬先修是 T05；真正理解组合路径，还需要按需回看短卖、杠杆、冲击、做市执行与机构融资。</h2>
        <p>
          建议按需回看 T03 的方差与协方差、T08 的时间尺度、1.09 的 price impact、1.19 的 securities lending、1.20 的 margin 与 forced liquidation，以及 2.07–2.08 的融资和执行约束。本节只教授“相对价值 agent 怎样从信号走到受约束订单”，不提供可直接交易的 alpha 配方，不完整推导增广 Dickey–Fuller（ADF）单位根检验或 Johansen 协整检验，不把订单队列、repo 管道、税务或系统性网络模型重复搬进来；这些分别留在工具层、1.19–1.20、2.15、2.19 与 7.13。
        </p>
        <div className="learning-objectives">
          <span>八阶段学习路线 · 从相对关系到内生反馈</span>
          <ol>
            <li><b>定义边界（03–09）：</b>分开 relative value、行业 stat-arb、形式化 SAO、market neutral、pairs 与 residual strategy。</li>
            <li><b>反馈核心（10–11）：</b>先说明为什么收敛资本提供负反馈，再识别何时切换为共同减仓。</li>
            <li><b>信号生产（12–25）：</b>冻结股票池、复权、时间戳、价差、OU、z-score、因子残差与泄漏边界。</li>
            <li><b>组合可行域（26–33）：</b>区分 notional、dollar/beta/factor neutrality、gross、优化、误差与容量。</li>
            <li><b>实现与资产负债表（34–43）：</b>加入 turnover、执行、成本、borrow、融资、P&amp;L、路径、波动与 margin。</li>
            <li><b>内生动态（44–46）：</b>把共同约束、拥挤代理和共同持仓连接到真实订单。</li>
            <li><b>案例与识别（47–53）：</b>用 2007、GameStop、Treasury 与反例训练证据等级和法域边界。</li>
            <li><b>实验与闭环（54–57）：</b>用 10+10 题、理解检查和接口重建完整 world model。</li>
          </ol>
          <p><b>时间预算：</b>核心阅读约 125–145 分钟；互动实验快速 25–30 分钟、含复盘 45–55 分钟；静态练习核对 25–30 分钟、完整书写 45–60 分钟；理解检查快速 10–12 分钟、完整复述 18–22 分钟；接口 4 分钟。建议分三次完成，参考文献与延伸阅读不计。</p>
          <p><b>最小术语桥：</b>long 是正向价格暴露，short 是负向价格暴露；notional 是价格乘数量；gross 是绝对名义金额之和，net 是带符号之和；beta 是对某个声明因子的局部线性载荷；residual 是在给定模型和估计窗口下没有被解释的部分，不是可直接观察的“真实 alpha”。</p>
          <p><b>制度与状态桥：</b>borrow 是为了建立或维持 short 而实际借入证券，recall 是出借方按合同或适用规则要求返还证券；margin 是中介机构为覆盖头寸风险而要求占用的权益或抵押品，不是交易损失本身；mark-to-market 是用当前价格重估头寸并把未实现盈亏写入权益；risk headroom 是当前风险占用与上限之间还能承受的余量；as-of 表示“截至该时点当时可知的版本”，不能混入后来修订的数据。后文关于借券、保证金、逐日重估、风险余量与信息冻结的表述，均按这组含义读取。</p>
          <p><b>缩写桥：</b>SAO 是 statistical arbitrage opportunity；PCA 是 principal component analysis；ETF 是 exchange-traded fund；VaR 是 value at risk；P&amp;L 是 profit and loss；1 bp=0.01%=0.0001，所以 8 bp=0.08%=0.0008。缩写只节省版面，不改变它们各自的模型与制度前提。</p>
          <p><b>四个“不等同”：</b>relative value ≠ pure arbitrage；dollar neutral ≠ beta/factor neutral；cointegration ≠ 必然收敛获利；self-financing ≠ 无需资金、抵押品或借券。每个等号都需要额外假设。</p>
        </div>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">02 · 完整因果闭环</p>
        <h2>相对价值策略的最小分析单位是一条从 as-of 数据到下一次组合缩放的状态循环，而不是一条漂亮回测曲线。</h2>
        <div className="mechanism-chain" aria-label="统计套利从数据到反馈的七步因果链">
          <div><span>01</span><b>冻结信息集</b><p>股票池、复权、因子、价格、borrow、成本和时间戳只能使用当时已知版本。</p></div>
          <div><span>02</span><b>估计相对关系</b><p>得到 pair spread、因子暴露、残差、预期收益和参数不确定性。</p></div>
          <div><span>03</span><b>构造候选组合</b><p>把信号映射为多空名义、hedge ratio、持有期和中性目标。</p></div>
          <div><span>04</span><b>筛选可行域</b><p>gross、concentration、borrow、margin、liquidity 与 mandate 排除不可持有头寸。</p></div>
          <div><span>05</span><b>执行与融资</b><p>订单支付 spread、fee、impact、markout，并占用借券、抵押品和信用额度。</p></div>
          <div><span>06</span><b>更新损益与风险</b><p>价格、beta、相关性、波动、权益、borrow fee 和 recall 改变组合状态。</p></div>
          <div><span>07</span><b>缩放并反馈</b><p>加仓、维持或平仓成为市场订单；他人相似反应又改变价格和下一轮信号。</p></div>
        </div>
        <p>
          这条闭环提供一个简单的诊断：若研究只有“价差偏离→未来回归”，却没有可交易股票池、订单时钟、borrow、执行成本、权益路径和风险限制，它研究的是统计图形而不是现实 agent。反过来，现实压力也不能仅凭同步亏损认定为 crowded unwind；必须补上共同暴露、约束收紧、订单方向和价格回写证据。<Cite n={16} /><Cite n={17} /><Cite n={19} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="relative-value">
        <p className="section-kicker">阶段一 · 定义边界　|　03 · Relative Value</p>
        <h2>Relative value 是“交易相对差异”的上位策略语言，不是收益无风险的数学结论。</h2>
        <p>
          相对价值组合同时持有多头与空头，目标是减少某些共同方向暴露，把收益更多地集中在资产之间的相对变化。比较对象可以是两只股票、同一公司的不同证券、现货与期货、行业内横截面或因子残差。只要两腿现金流不是完全相同且可同时锁定，关系就可能继续扩大；此类交易是 convergence trade，而非 pure arbitrage。<Cite n={22} /><Cite n={23} /><Cite n={26} />
        </p>
        <p>
          “相对便宜”也必须声明基准：相对哪组因子、哪段历史、哪个估值变量、哪个 hedge ratio 和哪个时点。如果基准随样本调整，所谓偏离可能只是模型在追着价格移动。因而 relative value 先是一个比较设计，之后才可能成为信号。
        </p>
      </section>

      <section className="lesson-section" id="stat-arb-industry">
        <p className="section-kicker">04 · Statistical Arbitrage 的行业语义</p>
        <h2>行业中的 stat-arb 通常指系统化、统计驱动、分散化的相对价值流程；名称里的 arbitrage 不构成无风险保证。</h2>
        <p>
          典型流程从大股票池提取横截面或时间序列信号，建立大量小多空头寸，约束市场、行业和风格暴露，并以较高换手持续更新。盈利来自许多弱预测的聚合，而不是一笔锁定现金流。Avellaneda–Lee 的 PCA／ETF residual 设计和 Gatev 等的 pairs rule 展示了两种历史实现，但它们依赖特定样本、规则和成本，不能充当“stat-arb”唯一标准。<Cite n={4} /><Cite n={5} /><Cite n={11} />
        </p>
        <p>
          课程后文用“小写行业语义”讨论现实 agent；只有在第 05 节明确写出论文条件时，才使用形式化 SAO／statistical arbitrage definition。把两者混用，会把一个策略类别错误升级为定理。
        </p>
      </section>

      <section className="lesson-section" id="stat-arb-formal">
        <p className="section-kicker">05 · Statistical Arbitrage 的形式化语义</p>
        <h2>Bondarenko 的有限期 SAO 与 Hogan 等的长期收益过程是两套形式定义；都不能替现实基金出具“无风险认证”。</h2>
        <p>
          Bondarenko 在有限期经济中把 SAO 定义为零成本策略：无条件期望 payoff 为正，并且在每个最终经济状态下的条件期望 payoff 非负；单条路径仍可以亏损。Hogan、Jarrow、Teo 与 Warachka 的对象则是一项零初始成本、self-financing 策略的累计折现交易利润 V(t)，不是某只基金未折现的单期 return。其四项条件可复算地写为：<Cite n={1} /><Cite n={2} />
        </p>
        <ol className="diagnostic-list">
          <li><b>初始条件：</b>V(0)=0。</li>
          <li><b>长期期望：</b>lim<sub>t→∞</sub>E[V(t)]&gt;0。</li>
          <li><b>亏损概率：</b>lim<sub>t→∞</sub>P(V(t)&lt;0)=0。</li>
          <li><b>方差增长：</b>若每个有限 t 的亏损概率仍为正，则 lim<sub>t→∞</sub>Var[V(t)]/t=0；也就是方差不能以线性或更快速度长期增长。</li>
        </ol>
        <p>
          Jarrow 等随后修改并改进可检验条件。有限期条件期望与长期渐近条件回答不同问题，不能拼成一条“行业定义”，也不能从有限样本直接宣称极限已经实现。<Cite n={3} />
        </p>
        <p>
          这些论文的重要性在于给市场效率检验建立可证伪条件，而不是证明使用统计模型的任何多空策略都满足它们。有限样本拒绝或不拒绝还受收益过程设定、交易成本、候选搜索和检验功效影响；现实产品的 margin、borrow 与流动性也并未被一个术语消除。<Cite n={2} /><Cite n={3} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="pure-arbitrage-boundary">
        <p className="section-kicker">06 · Pure Arbitrage 与 Statistical Opportunity</p>
        <h2>一般意义的 pure arbitrage 是零净投入／self-financing、终值在所有状态非负且在正概率状态严格为正；相同现金流错价只是典型构造，不是定义本身。</h2>
        <div className="table-scroll" role="region" aria-label="纯套利、相对价值和统计套利边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">三类策略语言的前提和失效方式</caption>
            <thead><tr><th scope="col">语言</th><th scope="col">核心前提</th><th scope="col">允许亏损路径</th><th scope="col">主要边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Pure arbitrage</th><td>V(0)=0，P[V(T)≥0]=1 且 P[V(T)&gt;0]&gt;0</td><td>理论定义下不允许负终值状态</td><td>admissibility、同步、信用、结算和摩擦决定现实策略是否真满足定义</td></tr>
              <tr><th scope="row">Relative value</th><td>不同资产的关系有经济或统计锚</td><td>允许</td><td>锚会漂移，融资可先失效</td></tr>
              <tr><th scope="row">Industry stat-arb</th><td>许多统计信号扣费后有正期望</td><td>允许且常见</td><td>模型、拥挤、成本、borrow、margin</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          买低卖高两份完全相同且可同步锁定的现金流，是满足上述状态收益条件的一类 law-of-one-price 实现；在更一般的随机过程模型里，还需声明允许的策略集合，并常用 no-free-lunch-with-vanishing-risk 等更强条件建立资产定价基本定理。因而“arbitrage capital”在金融研究里常指愿意纠正相对错价的资本，而不是每笔都满足 pure-arbitrage 定义。2.15 会完整讨论 limits to arbitrage；本节只保留一个接口：价格看起来越错，不代表套利者此刻越有资本。<Cite n={22} /><Cite n={23} /><Cite n={24} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="market-neutral-definition">
        <p className="section-kicker">07 · Market Neutral 与三种中性轴</p>
        <h2>Market neutral 只能解释为“对事先声明的市场暴露近似中性”；不声明暴露矩阵，术语就没有可审计含义。</h2>
        <p>
          一项策略可以 dollar neutral、beta neutral、sector neutral 或对某组统计因子 neutral。每一种中性都需要选择暴露、估计窗口、更新频率、容忍带和优化约束。若只写“market neutral”，读者无法知道它消除了净名义方向、CAPM beta、行业权重，还是一个内部风险模型中的前几个主成分。<Cite n={12} /><Cite n={13} /><Cite n={14} /><Cite n={15} />
        </p>
        <p>
          中性还是状态变量而非永久标签：价格变化会改变权重，beta 会漂移，成交不同步会暂时留下单腿，borrow recall 会强迫空头缩小，风险模型更新也会重新定义因子。生产系统必须在每次成交后重算，而不是在建仓日盖一次“neutral”印章。
        </p>
        <h3>Dollar、beta 与 factor neutrality 是三个不同约束面；落在其中一个面上，不会自动落在另外两个面上。</h3>
        <div className="table-scroll" role="region" aria-label="三种组合中性约束比较，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Dollar、beta 与 factor neutrality 的对象与剩余风险</caption>
            <thead><tr><th scope="col">约束</th><th scope="col">归零对象</th><th scope="col">仍然保留</th></tr></thead>
            <tbody>
              <tr><th scope="row">Dollar neutral</th><td>带符号名义金额之和</td><td>beta、行业、波动、liquidity、gross 与非线性</td></tr>
              <tr><th scope="row">Beta neutral</th><td>对一个声明市场因子的线性暴露</td><td>净名义、其他因子、估计误差与特异风险</td></tr>
              <tr><th scope="row">Factor neutral</th><td>对选定 B 矩阵各列的线性投影</td><td>遗漏因子、载荷漂移、尾部共振与融资风险</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          第 1、2、5 题会分别计算 gross/net、beta hedge 与 dollar-neutral 后的剩余 beta。它们共同训练一个习惯：每次看到 neutral，都要问“相对什么、用什么单位、在什么时点、容许多大误差”。
        </p>
      </section>

      <section className="lesson-section" id="pairs-trading">
        <p className="section-kicker">08 · Pairs Trading</p>
        <h2>Pairs trading 是两资产相对价值的特例；选对、定义价差、入场与退出是四个独立决定。</h2>
        <p>
          两只资产可能因为经济联系、共同因子、历史路径相似或协整关系被配成一对。随后仍需选择价格水平还是对数价差、hedge ratio 怎样估计、何时开仓、何时止损／退出，以及公司行动和 borrow 怎样处理。Gatev 等的原始规则先按形成期标准化价格路径距离选对，再在交易期按偏离阈值开仓；它不是协整检验。<Cite n={4} /><Cite n={8} /><Cite n={9} />
        </p>
        <p>
          两资产结构透明，但集中度高：一次并购、资本结构变化、指数调整或永久盈利差异，就能让历史近邻失去经济含义。多资产残差策略用分散化缓解单一 pair 风险，却引入更大的模型与拥挤风险。
        </p>
      </section>

      <section className="lesson-section" id="cross-sectional-residual">
        <p className="section-kicker">09 · Cross-sectional Residual Strategy</p>
        <h2>多资产 stat-arb 先从收益中剥离选定共同因子，再交易残差的横截面差异；残差完全依赖模型。</h2>
        <p>
          一个典型流程用行业 ETF、风格因子或 PCA 解释股票收益，把未解释部分聚合为短期信号，然后做多最弱负残差、做空最强正残差，并在组合层约束因子、行业和 gross。Avellaneda–Lee 展示了这种历史实现；其结果支持“残差可构成研究对象”，不支持某组 PCA/ETF 因子在今天仍是正确风险模型。<Cite n={5} /><Cite n={14} /><Cite n={15} />
        </p>
        <p>
          如果因子集合遗漏了正在形成的共同风险，许多看似 idiosyncratic 的残差会在压力中一起移动。分散化降低单股噪声，却可能把组合集中到一个模型没有命名的 latent factor。
        </p>
      </section>

      <section className="lesson-section" id="negative-feedback">
        <p className="section-kicker">阶段二 · 反馈核心　|　10 · 负反馈流动性</p>
        <h2>当资本、borrow 和关系稳定时，收敛交易在偏离扩大时逆势下单，因而向价格施加负反馈。</h2>
        <p>
          假设 A 相对 B 下跌，而模型关系仍可信。策略买 A、卖 B；若许多有资本的套利者这样做，A 获得买盘、B 获得卖盘，价差被压回。这种“价格变化制造反向订单”的结构与趋势策略的正反馈相反，也解释了为什么相对价值资本能吸收暂时供需冲击。<Cite n={6} /><Cite n={24} /><Cite n={28} />
        </p>
        <p>
          负反馈不是主体美德，而是状态结果。它需要信号仍可信、头寸可融资、空头可借、risk headroom 充足、交易成本没有随压力跳升，并且投资者不会在账面亏损时撤资。少一个条件，偏离扩大都可能产生不同动作。
        </p>
      </section>

      <section className="lesson-section" id="feedback-switch">
        <p className="section-kicker">11 · 从收敛到被迫减仓</p>
        <h2>真正的状态切换发生在“最优加仓”撞上“不可继续持有”：价格信号仍指向收敛，可行集却要求平仓。</h2>
        <p>
          价差扩大先造成 mark-to-market 亏损，亏损侵蚀权益并推高实现波动；prime broker 可能提高 margin，投资者可能赎回，short borrow 可能变贵或被 recall。策略为了满足 gross、VaR、margin 或现金约束，只能卖出多头、买回空头。这一订单方向恰好继续压低原多头、抬高原空头，使价差更宽、下一批相似策略亏损更多。<Cite n={23} /><Cite n={25} /><Cite n={27} /><Cite n={34} /><Cite n={35} /><Cite n={36} />
        </p>
        <p>
          因果链应写成：<b>共同暴露 → 外生或内生亏损 → 权益／波动／融资状态恶化 → 可行集收缩 → 同方向去杠杆 → impact → 新亏损。</b>“模型错了”可能是起点，但不是解释共同平仓所需的全部机制；“拥挤”也只是潜在共同暴露，不是必然崩盘。<Cite n={30} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="universe">
        <p className="section-kicker">阶段三 · 信号生产　|　12 · 可交易股票池</p>
        <h2>Universe 不是研究前的清洁步骤；它决定哪些关系能被发现、哪些交易能被执行以及回测承受什么选择偏误。</h2>
        <p>
          股票池通常按上市状态、价格、成交额、市值、借券可得性、停牌和公司行动筛选。若今天的成分表回填到历史，就会产生 survivorship；若忽略退市回报，也会系统性扭曲历史收益。进一步说，用未来实现的流动性筛选“始终好交易”的证券，按定义就是把决策时点尚未知的信息放回过去，也会让成本和 capacity 过于乐观。每个决策日都应使用当时可获得的 eligibility snapshot。<Cite n={51} /><Cite n={52} />
        </p>
        <p>
          研究还要区分 formation universe、signal universe 与 executable universe：有价格数据不等于当时可 short，有 borrow quote 不等于能持续借到，有收盘成交额也不等于开盘可执行同等规模。
        </p>
      </section>

      <section className="lesson-section" id="corporate-actions">
        <p className="section-kicker">13 · 公司行动、复权与时间戳</p>
        <h2>拆股、分红、并购和代码变更会制造机械价差；如果复权信息使用了未来版本，模型会把数据清洗当成 alpha。</h2>
        <p>
          Pair spread 的两条价格必须使用一致的 corporate-action 处理，但“复权后价格”往往由事后数据库重建。实时研究要保存公告时间、除权日、支付日和当时可用 adjustment factor；空头股息补偿又是实际现金流，不能只修价格不修 P&amp;L。对退市或换股并购，经济关系和可交易合约可能同时终止。
        </p>
        <p>
          最稳妥的设计是把 raw price、as-of adjustment、当前持仓现金流和最终审计版分列。它们服务于交易、会计和数据质量三个不同问题。
        </p>
      </section>

      <section className="lesson-section" id="signal-vs-return">
        <p className="section-kicker">14 · Statistical Signal ≠ Expected Return</p>
        <h2>Z-score、残差或 rank 只是描述状态；必须经过收益校准、成本和约束，才成为组合优化中的 expected return。</h2>
        <p>
          原始 z-score 无量纲，而优化目标中的预期收益是每期收益。把二者直接等同会隐含一个未声明的比例系数、持有期和线性关系。更严谨的流程用严格样本外数据估计“当前信号→未来可交易净收益”的条件映射，并保留不确定性；信号很极端也可能代表结构断裂而非更强 alpha。<Cite n={17} /><Cite n={18} /><Cite n={19} />
        </p>
        <p>
          预测目标还要与执行时钟一致：收盘信号若只能次日开盘成交，就不能用当日收盘价回填；分钟残差也不能配上日终 borrow 和未来收盘 universe。时间尺度错位会制造无法实现的回测。
        </p>
      </section>

      <section className="lesson-section" id="distance-pairs">
        <p className="section-kicker">15 · Distance Pairs</p>
        <h2>Gatev 的 minimum-distance 方法寻找形成期标准化价格路径最相似的 pairs；它没有先假定两条价格协整。</h2>
        <p>
          原始设计把形成期价格标准化为从同一初值开始的累计收益路径，按两条路径平方距离选择近邻，再在交易期偏离超过历史阈值时建立等额多空。这种方法直观地捕捉共同历史走势，但 distance 是样本相似度，不是长期均衡关系证明。<Cite n={4} />
        </p>
        <p>
          后续研究发现简单 pairs 的毛利、风险与成本会随时期和选择法变化；交易成本可以显著削弱结果，cointegration 方法在某些样本更优也不构成普遍定理。<Cite n={8} /><Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="correlation">
        <p className="section-kicker">16 · Correlation 能说明什么</p>
        <h2>高相关表示某尺度的共同变动较强，不表示两条价格差平稳，更不表示偏离后必然收敛。</h2>
        <p>
          收益相关性对窗口、频率和状态敏感；两只都带趋势的价格甚至可能高度相关，但价差持续漂移。Correlation 也不提供 hedge ratio 的经济稳定性。它可以是筛选或风险输入，不能独立充当收敛定理。T05 的核心警告在这里具体化：共同运动既可能来自共同因子，也可能来自同步冲击或样本结构。
        </p>
        <p>
          Lo–MacKinlay 进一步说明 contrarian profit 不必全部来自投资者过度反应，lead–lag 和横截面协方差也可贡献。这提醒我们不要从短期反转收益直接倒推出唯一行为机制。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="cointegration">
        <p className="section-kicker">17 · Cointegration 的额外限制</p>
        <h2>Cointegration 约束非平稳变量的某个线性组合在长期保持稳定；它仍不保证参数不变、路径可融资或扣费后盈利。</h2>
        <p>
          Engle–Granger 表示定理把协整关系与误差修正联系起来：若价格存在稳定长期组合，短期偏离可能对未来变化产生修正力。它比“收益相关高”多了一层长期限制，但检验依赖阶数、窗口、结构稳定和临界值；样本内拒绝或不拒绝都不是现实交易承诺。<Cite n={7} />
        </p>
        <p>
          经济关系还可能在并购、技术替代、资本结构或监管变化后断裂。即使最终价差回归，途中 margin call、recall 或流动性缺口也能迫使策略先退出。因此 cointegration 回答统计关系，不能替代 agent 可行域。
        </p>
      </section>

      <section className="lesson-section" id="spread-units">
        <p className="section-kicker">18 · Pair Spread 与 Hedge Ratio</p>
        <h2>价格水平价差与归一化对数价差具有不同单位；h<sub>level</sub> 与 h<sub>log</sub> 的交易含义也不能混用。</h2>
        <div className="equation-card">
          <span>Pair spread · 两种记号不可混用</span>
          <div>s<sup>level</sup><sub>t</sub> = P<sup>A</sup><sub>t</sub> − α<sub>L</sub> − h<sub>L</sub>P<sup>B</sup><sub>t</sub>；　或　s<sup>log</sup><sub>t</sub> = ln(P<sup>A</sup><sub>t</sub>/P<sup>A</sup><sub>0</sub>) − α<sub>g</sub> − h<sub>g</sub>ln(P<sup>B</sup><sub>t</sub>/P<sup>B</sup><sub>0</sub>)</div>
          <p>价格水平式中 s<sup>level</sup> 与 α<sub>L</sub> 使用 A 的价格单位，h<sub>L</sub> 把 B 的每股价格映射到 A 的每股价格；若组合被定义为“1 股 A 对 h<sub>L</sub> 股 B”，它可作为该 synthetic spread 的相对股数系数，但最终规模仍要经过价格、beta/factor、lot 与整数约束。对数式要求 P<sup>A</sup><sub>t</sub>、P<sup>B</sup><sub>t</sub> 和两个事前冻结参考价 P<sub>0</sub> 全部为正；s<sup>log</sup>、α<sub>g</sub> 与 h<sub>g</sub> 无量纲，h<sub>g</sub> 是 log-move／elasticity coefficient，转成时点 t 的股数还需价格比，局部近似为 |q<sub>B</sub>/q<sub>A</sub>|≈|h<sub>g</sub>|P<sup>A</sup><sub>t</sub>/P<sup>B</sup><sub>t</sub>。后文 β 专指市场或因子 beta。换单位、参考基准或形式时，参数和阈值都必须重估。</p>
        </div>
        <p>
          第 3 题只使用价格水平式，因此为简洁把 α<sub>L</sub>、h<sub>L</sub> 写成 α、h，并冻结它们以及价差均值和标准差。现实 rolling estimate 会让 spread 历史被重新书写；研究必须保存每个决策时点实际使用的参数版本，而不是用最终全样本 h<sub>L</sub> 回算全部历史。
        </p>
      </section>

      <section className="lesson-section" id="ou-half-life">
        <p className="section-kicker">19 · OU 模型与 Half-life</p>
        <h2>OU 把偏离的条件期望写成连续时间回归；半衰期是模型尺度，不是“到期必回归”的日历。</h2>
        <div className="equation-card">
          <span>Ornstein–Uhlenbeck · 教学工作模型</span>
          <div>ds<sub>t</sub> = κ(μ − s<sub>t</sub>)dt + σdW<sub>t</sub>；　t<sub>1/2</sub> = ln2 / κ</div>
          <p>κ 的单位是 1/时间，所以半衰期是时间；若 s 是价格价差，σ 的单位是价差/√时间。κ&gt;0 才有该均值回归解释。Half-life 描述条件期望偏离衰减一半，不保证某条随机路径在该时点触及 μ；参数漂移和跳跃不在这个简化式中。</p>
        </div>
        <p>
          持有期若远短于 half-life，预期收敛可能不足以覆盖成本；持有期很长又占用更多资本、borrow 和 tail budget。因而 half-life 连接统计速度与资产负债表，而不是替代退出规则。
        </p>
      </section>

      <section className="lesson-section" id="zscore">
        <p className="section-kicker">20 · Z-score 与 Threshold</p>
        <h2>Z-score 只把偏离转换为某一估计窗口内的标准差单位；阈值是决策设计，不是自然常数。</h2>
        <div className="equation-card">
          <span>Z-score · 冻结 as-of 估计</span>
          <div>z<sub>t</sub> = (s<sub>t</sub> − μ̂<sub>t</sub>) / σ̂<sub>t</sub></div>
          <p>s、μ̂、σ̂ 必须来自同一价差定义和单位，因此 z 无量纲。估计窗口只能用 t 时已知数据；σ̂&gt;0。没有正态、独立和平稳假设时，z=2 不是确定的 2.5% 尾部概率。入场、退出和止损阈值还应由净收益、误判、turnover 与 capacity 共同决定。</p>
        </div>
        <p>
          阈值还会与选择偏误互动：在数千 pairs 中只报告最漂亮的 2σ 回归，会把数据搜索当成显著性。策略和阈值搜索必须纳入 multiple-testing 与 backtest-overfitting 审计。<Cite n={17} /><Cite n={18} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="factor-model">
        <p className="section-kicker">21 · Factor Model</p>
        <h2>因子模型把共同收益与残差分开；B 是估计映射，不是市场永恒的真实坐标系。</h2>
        <div className="equation-card">
          <span>线性因子分解 · 每期收益</span>
          <div>r<sub>t</sub> = α + Bf<sub>t</sub> + ε<sub>t</sub></div>
          <p>r、f、α 与 ε 都是同一期间的无量纲收益，B 为无量纲载荷矩阵。Fama–French、Carhart、行业 ETF 或 PCA 提供不同列空间；更换因子集、估计窗或标准化方式，残差就会变化。该式描述条件线性投影，不证明 ε 是因果 alpha。</p>
        </div>
        <p>
          Markowitz 与 Treynor–Black 提供从预期收益、风险和主动信号到组合的早期桥梁；Fama–French 与 Carhart 展示了常用共同因子。它们共同说明“先声明风险模型”，却不提供唯一正确的 B。<Cite n={12} /><Cite n={13} /><Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="residual-signal">
        <p className="section-kicker">22 · Residual Signal</p>
        <h2>残差信号衡量相对模型预期的异常路径；当模型漏掉共同冲击时，“特质”残差会突然共振。</h2>
        <p>
          实现可以把 ε 的累计值、短期反转或 OU 状态变成 signal，再估计其未来收益衰减。必须分开用于估计 B 的窗口、用于形成 signal 的窗口和用于评估未来收益的窗口，否则同一噪声会在两端重复利用。<Cite n={5} />
        </p>
        <p>
          残差策略的关键反例是 regime change：若新能源冲击、融资压力或指数资金流让一组股票出现新共同因子，旧 B 会把新系统风险误标为许多独立 alpha。组合看似分散，实则共同暴露。
        </p>
      </section>

      <section className="lesson-section" id="cross-sectional-ranking">
        <p className="section-kicker">23 · Cross-sectional Ranking</p>
        <h2>横截面排序把连续信号变成相对仓位；分位切割、权重和中性化共同决定真实暴露。</h2>
        <p>
          常见做法按 signal 从低到高排序，做多预期收益高的一端、做空低的一端。Equal weight、rank weight、volatility scaling 或 optimizer 会生成不同 concentration 与 turnover；同样 top/bottom decile，也可能因市值和行业分布产生完全不同 beta。Lo–MacKinlay 的结果提醒：contrarian payoff 可来自 lead–lag 和协方差结构，不能只凭排序收益宣称“过度反应”。<Cite n={6} />
        </p>
        <p>
          排名只保留相对次序，会丢掉信号幅度和不确定性。极端 rank 可能是强 alpha，也可能是数据错误、停牌复牌或公司行动；进入组合前仍需 validity 和 tradability gate。
        </p>
      </section>

      <section className="lesson-section" id="signal-decay">
        <p className="section-kicker">24 · Signal Decay 与 Holding Horizon</p>
        <h2>预测衰减和交易成本共同决定最佳持有期；最快回归的信号也可能因换手过高而没有净价值。</h2>
        <p>
          Horizon 太短，spread、fee、impact 与异步成交占比高；太长，信号衰减、因子漂移、borrow 和 capital charge 累积。真实目标不是最大化单期相关，而是比较不同 horizon 的可执行净收益和路径风险。Do–Faff 与 Novy-Marx–Velikov 分别说明 pairs 和广泛 anomaly 对成本假设敏感。<Cite n={8} /><Cite n={9} /><Cite n={16} />
        </p>
        <p>
          如果研究用未来实现 half-life 选择历史持有期，就发生第二层泄漏。Horizon 选择也必须嵌入 rolling、out-of-sample 协议。
        </p>
      </section>

      <section className="lesson-section" id="data-leakage">
        <p className="section-kicker">25 · 前视、存活与换仓泄漏</p>
        <h2>Stat-arb 最危险的幻觉不是公式错误，而是把日后才知道的 universe、因子、borrow、参数或收盘成交价放回当时决策。</h2>
        <ol className="diagnostic-list">
          <li><b>As-of universe：</b>保留退市、停牌与当时不可借证券，不能用今日成分回填。</li>
          <li><b>As-of fundamentals：</b>使用公告和修订时间，不用数据库最终值伪装实时信息。</li>
          <li><b>Lagged estimation：</b>μ、σ、pair coefficient h、market beta β、B、covariance 和阈值只能由决策前样本估计。</li>
          <li><b>Executable price：</b>信号时点之后的第一笔可达价格才是候选成交，不用同一收盘价两次。</li>
          <li><b>Search accounting：</b>股票池、pairs、因子、窗口和阈值的所有尝试都进入 multiple-testing 审计。</li>
        </ol>
        <p>
          White、Harvey–Liu–Zhu 与 Bailey 等分别从 data snooping、factor zoo 和 backtest overfitting 提供防护框架；它们不能修复错误时间戳或缺失 borrow 数据，只能在输入可信后约束搜索。<Cite n={17} /><Cite n={18} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="signed-notional">
        <p className="section-kicker">阶段四 · 组合可行域　|　26 · Signed Notional</p>
        <h2>先把股数转换成带方向名义金额，才能在同一货币尺度上讨论 net、gross 与 leverage。</h2>
        <div className="equation-card">
          <span>名义敞口、总敞口与总杠杆</span>
          <div>n<sub>i</sub> = q<sub>i</sub>P<sub>i</sub>；　N = Σn<sub>i</sub>；　G = Σ|n<sub>i</sub>|；　L<sub>G</sub> = G/E</div>
          <p>q 是带方向股数，P 是货币/股，因此 n、N、G 与权益 E 都是货币；要求 E&gt;0，L<sub>G</sub> 才是有意义的无量纲 gross leverage。若 E≤0，组合应被标记为资本不可行，而不是继续报告负或无限 leverage。N=0 只表示 dollar neutral；G 可很大。衍生品需要先按 delta、合约乘数或相应风险尺度映射，不能把 contracts 与股票 dollars 直接相加。</p>
        </div>
        <p>
          第 1 题展示净额为零而 gross leverage 为 8。Gross 连接交易成本、balance-sheet usage 和共同减仓规模，是“market neutral”标签最容易隐藏的状态。
        </p>
      </section>

      <section className="lesson-section" id="dollar-neutral">
        <p className="section-kicker">27 · Dollar Neutrality</p>
        <h2>Dollar neutrality 让多头与空头名义金额相等；它既不消除 gross，也不保证市场方向暴露为零。</h2>
        <p>
          约束 Σn=0 很容易审计，适合建立最小基准。但若多头 beta 1.2、空头 beta 0.8，等额组合仍有正 beta；行业和波动暴露也可能不平衡。Dollar neutrality 更像会计方向约束，而不是完整风险定义。
        </p>
        <p>
          现实策略还要声明 cash treatment：short proceeds 是否可自由使用、margin account 如何计息、股息和 corporate actions 如何入账。名义自融资不意味着没有抵押品占用。
        </p>
      </section>

      <section className="lesson-section" id="beta-neutral">
        <p className="section-kicker">28 · Beta-neutral Hedge</p>
        <h2>当 n<sub>A</sub>&gt;0 且 0&lt;β<sub>B</sub>&lt;β<sub>A</sub> 时，低 beta 的 B 空头需要更大名义才能抵消高 beta 的 A 多头。</h2>
        <div className="equation-card">
          <span>两资产 beta-neutral · 冻结载荷</span>
          <div>β<sub>A</sub>n<sub>A</sub> + β<sub>B</sub>n<sub>B</sub> = 0　⇒　n<sub>B</sub> = −(β<sub>A</sub>/β<sub>B</sub>)n<sub>A</sub></div>
          <p>n 是货币名义，beta 无量纲，所以 beta-notional 仍是货币尺度；一般解只要求 β<sub>B</sub>≠0。第 2 题进一步冻结两腿 beta 均为正且 β<sub>B</sub>&lt;β<sub>A</sub>，所以得到多 120 千元 A、空 180 千元 B，beta 为零但 net=−60 千元。若 β<sub>B</sub>&lt;0，同一个代数解会要求 B 与 A 同向而非做空；若 β<sub>B</sub>=0，B 不能用有限名义对冲 A 的非零 beta。载荷还是估计量，会随窗口和状态变化。</p>
        </div>
        <p>
          实盘成交若只完成一腿，会暂时破坏中性；价格变化也会改变 n。因而 hedge 是持续状态控制，不是一次静态代数。
        </p>
      </section>

      <section className="lesson-section" id="factor-neutral">
        <p className="section-kicker">29 · Multifactor、Sector 与 Style Neutrality</p>
        <h2>Factor-neutral portfolio 落在暴露矩阵 B 的零空间；用原始股数代替权益权重通常会产生量纲错误。</h2>
        <div className="equation-card">
          <span>中性约束 · 权重尺度</span>
          <div>1<sup>⊤</sup>w = 0；　B<sup>⊤</sup>w = 0；　S<sup>⊤</sup>w = 0</div>
          <p>要求 E&gt;0，w<sub>i</sub>=n<sub>i</sub>/E 才是有意义的无量纲权益权重；三式分别表示 dollar、factor 与 sector neutrality。B、S 的列必须声明含义和标准化。约束只消除列空间中的线性暴露；遗漏因子、估计误差、非线性和 tail dependence 仍存在。</p>
        </div>
        <p>
          约束越多，可用 alpha 空间越小、turnover 和 concentration 也可能上升。中性化不是免费清洁，而是在预期收益、稳定性和可执行性之间交换。
        </p>
        <h3>行业和风格中性防止组合把 residual signal 变成已知宏观押注，但分类本身会变化并存在边界公司。</h3>
        <p>
          行业约束可要求每个 sector 净权重为零或贴近 benchmark；style 约束则可控制 size、value 与 momentum 等已声明载荷。分类重构、公司业务迁移和因子定义差异会改变暴露，不能用今天的 sector code 回填历史。<Cite n={14} /><Cite n={15} />
        </p>
        <p>
          过度中性化还可能把经济信号本身消掉。例如若 alpha 来自行业内均值回归，sector neutral 合理；若来自行业间结构变化，强行清零可能把研究问题改写。约束必须服务于明确 hypothesis。
        </p>
      </section>

      <section className="lesson-section" id="gross-net-leverage">
        <p className="section-kicker">30 · Gross、Net 与 Leverage</p>
        <h2>Net 解释方向，gross 解释资产负债表和潜在交易量，leverage 解释同样价格变动怎样映射到权益。</h2>
        <p>
          两个 net=0 的基金，一个 gross=1×、一个 gross=8×，对 1% 相对错位、borrow fee 上调或 10% margin change 的敏感度完全不同。收益按权益报告时，高 gross 会同时放大 alpha、成本和尾部损失；short proceeds 又未必等同可自由投资现金。<Cite n={23} /><Cite n={25} />
        </p>
        <p>
          因而风险报告至少同时给出 net、gross、factor exposures、concentration、liquidity days 和 margin usage。只展示低 beta 会掩盖共同去杠杆所需的巨大双边订单。
        </p>
      </section>

      <section className="lesson-section" id="constrained-optimization">
        <p className="section-kicker">31 · Constrained Portfolio Optimization</p>
        <h2>Optimizer 不是把 z-score 排序包装成数学；它要在同一单位中权衡预期收益、协方差、成本和硬约束。</h2>
        <div className="equation-card">
          <span>风险—收益—成本 · 教学目标</span>
          <div>max<sub>w</sub>[a<sup>⊤</sup>w − (γ/2)w<sup>⊤</sup>Σw − c(Δw)]　s.t.　B<sup>⊤</sup>w=0，||w||<sub>1</sub>≤L<sub>max</sub></div>
          <p>Δw=w−w<sub>prev</sub>；a 是每期预期收益，Σ 是同一期、对称且 positive-semidefinite 的收益协方差，w 无量纲，c(Δw) 定义在可执行的权重变化上并表达为同一期间的权益收益。γ≥0；若把 return 当有明确收益单位的量，γ 具有 1/return 的尺度，以把 return² 方差转换回 return。L<sub>max</sub>≥0。原始 z-score 不能未经收益校准直接代替 a。现实还需单名、行业、borrow、turnover、margin 与整数约束。</p>
        </div>
        <p>
          目标函数中的小误差可能被求逆或边界放大，输出权重因此需要 shrinkage、turnover penalty、robustness 和可解释 exposure audit，而不是相信优化器天然分散。
        </p>
      </section>

      <section className="lesson-section" id="parameter-error">
        <p className="section-kicker">32 · Covariance 与参数误差</p>
        <h2>最优组合对 a、B、Σ 的估计误差高度敏感；样本内最平滑的权重可能只是最精确地拟合了噪声。</h2>
        <p>
          预期收益通常最难估，协方差在维度接近样本长度时也会不稳定。Small eigenvalues 会让优化器相信某些组合风险极低，正好把 gross 集中到估计最脆弱方向；Ledoit–Wolf 的 shrinkage 研究提供一类改善大维协方差条件数的方法，但不消除模型错设。Out-of-sample stress 应同时扰动 a、B、Σ、成本和 borrow，而不是只改价格。<Cite n={12} /><Cite n={17} /><Cite n={18} /><Cite n={53} />
        </p>
        <p>
          中性约束也有误差带：要求估计 beta 恰为 0 不等于真实 beta 为 0。用 exposure tolerance、worst-case bounds 和 turnover buffer，往往比追求小数点后的精确零更稳健。
        </p>
      </section>

      <section className="lesson-section" id="capacity-concentration">
        <p className="section-kicker">33 · Concentration 与 Capacity</p>
        <h2>分散头寸数量不等于分散可平仓性；许多小仓位可以集中在同一因子、borrow pool 和退出通道。</h2>
        <p>
          Capacity 取决于成交量、spread、impact、信号衰减、同方向竞争、short availability 和所需 liquidation horizon。若资本翻倍导致订单比市场深度增长更快，毛 alpha 不变也会被成本吃掉。Novy-Marx–Velikov 说明 anomaly 评价对实现成本和缓解交易的设计敏感。<Cite n={16} />
        </p>
        <p>
          单名 concentration、issuer/industry concentration、crowdedness 与 liquidity days 是不同维度。一个 500 股票组合也可能在“long value／short momentum”上高度集中，这正是 2007 案例需要观察的共同因子结构。<Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="turnover">
        <p className="section-kicker">阶段五 · 实现与资产负债表　|　34 · Turnover</p>
        <h2>Turnover 把信号更新频率转换成需要穿过市场的名义金额；口径不明时，成本比较没有意义。</h2>
        <div className="equation-card">
          <span>总绝对成交名义与简化交易成本</span>
          <div>V<sub>i,t</sub> = Σ<sub>fills j</sub>|P<sup>exec</sup><sub>ij,t</sub>Δq<sub>ij,t</sub>|；　TO<sup>abs</sup><sub>t</sub> = ΣV<sub>i,t</sub> / E<sup>den</sup><sub>t</sub>；　C<sub>t</sub> = Σ[c<sub>i</sub>V<sub>i</sub> + η<sub>i</sub>V<sub>i</sub><sup>1+δ</sup>]</div>
          <p>V 是把该期每笔真实 fill 的执行价乘成交股数后先取绝对值、再按资产汇总的非负成交名义，单位为货币；同一资产先买后卖不会在汇总前抵消，所以没有交易时 V=0，单纯价格漂移也不会伪造 turnover。E<sup>den</sup><sub>t</sub>&gt;0 是研究协议预先固定的权益分母，例如期初权益或期间平均权益；两种口径不能在样本中事后切换。TO<sup>abs</sup> 是全部买卖成交的总绝对名义除以这一权益分母，因此无量纲。它不是未经说明的“一边换手”；在买卖金额平衡时，有些机构把一边口径定义为该值的一半，比较研究时必须先对齐定义。C 和第一项都是货币，c 是无量纲单位名义成本率；取 δ&gt;0、η≥0 时，η 的单位为货币<sup>−δ</sup>，使非线性项仍为货币。真实 impact 还依赖成交方向、切片和时间，不能只由聚合 V 唯一决定。</p>
        </div>
        <p>
          Turnover penalty 会让组合在小信号变化时维持旧仓，形成 no-trade region。它降低成本，也使实时暴露偏离理论 target；风险系统必须观察 actual holdings，而不是只看 optimizer 输出。<Cite n={9} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="execution">
        <p className="section-kicker">35 · 执行方式</p>
        <h2>组合 alpha 与执行 alpha 属于两层问题：多空 target 正确，也可能因腿风险、延迟和 market impact 无法实现。</h2>
        <p>
          同步多腿订单很少真正原子：一腿先成交会留下 temporary beta 或 factor exposure，另一腿价格可能移动。Passive execution 降低 spread cost，却增加 nonfill 与 adverse selection；aggressive execution 提高完成确定性，却支付 impact。2.08 的 queue、markout 和 routing 因而在此作为实现接口，而不重复展开。
        </p>
        <p>
          研究应保存 parent target、child orders、fills、cancel/reject、未成交残差和完成时点。若只用目标权重回测，会把未成交和腿风险当成免费同步执行。
        </p>
      </section>

      <section className="lesson-section" id="transaction-costs">
        <p className="section-kicker">36 · Spread、Fee、Impact 与 Markout</p>
        <h2>实现成本不是一个固定 bp：spread、fee、impact、delay 和 post-trade markout 对规模与状态的反应不同。</h2>
        <p>
          Half-spread 近似小额即时 crossing；fee/rebate 是规则现金流；impact 来自本单与市场反应；delay cost 来自等待期间价格变化；markout 则在统一 horizon 诊断成交质量。如果压力状态同时出现显示深度下降与相关策略同向交易，成本就可能与策略亏损一起恶化，固定历史 bp 因而会低估这类状态的左尾。<Cite n={16} /><Cite n={25} />
        </p>
        <p>
          净 alpha 校准必须用与信号相同的 execution clock 和容量。日频信号不应直接套用全天平均 spread，分钟策略也不能用月度 turnover 模糊冲击。
        </p>
      </section>

      <section className="lesson-section" id="financing-collateral">
        <p className="section-kicker">37 · Financing 与 Collateral</p>
        <h2>多空名义可接近自融资，资产负债表却仍需要 equity、margin、collateral 和稳定信用额度。</h2>
        <p>
          Long leg 需要资金，short proceeds 通常受账户和抵押规则约束；prime broker 还会按风险、流动性和集中度要求 margin。现金利息、证券借贷、rehypothecation 与 haircut 共同决定 carry。Regulation T 和 FINRA Rule 4210 提供美国 broker-dealer 边界；Rule 4210 的日内保证金制度又处在 2026–2027 分阶段实施期，实际 house/portfolio margin 与合同权利仍可能更严格。<Cite n={45} /><Cite n={46} /><Cite n={48} />
        </p>
        <p>
          因而 self-financing 在理论里描述交易策略现金流，在机构现实里不能翻译成“无需外部资金”。最危险的路径常是价格最终正确、但抵押品先耗尽。
        </p>
      </section>

      <section className="lesson-section" id="locate-borrow">
        <p className="section-kicker">38 · Locate ≠ Borrow ≠ Close-out</p>
        <h2>Rule 203 locate 是下单前的三择一 gate：已借入、已作 bona-fide 借入安排，或有合理依据相信能按期借到；它不等于 Rule 204 的交收失败 close-out。</h2>
        <p>
          美国股票 Reg SHO Rule 203 的 locate 要求与 Rule 204 的 fail-to-deliver close-out 属于证券法域。Rule 204 现行原文以“settlement date 后第一个／第三个 settlement day”等方式表达不同行为和例外的时限；SEC staff FAQ 的总览仍保留 T+4/T+6 旧 trade-date shorthand，没有随 T+1 结算更新。当前分析应舍弃这些旧数字标签，直接按 Rule 204 的 settlement-date-relative 原文核对。规则原文优先，FAQ 仅代表 staff 观点、没有独立法律效力。Locate 是下单前的合规条件，也不保证整个持有期 borrow 不被 recall 或费率锁定。<Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={47} />
        </p>
        <p>
          因而研究至少要把 indicative availability、confirmed locate、order acceptance 与最终 short execution 分列；实际 stock-loan 的数量、费率和返还条款留到下一节。只用“最终成功做空”的样本会选择性删除最难进入可行集的信号。
        </p>
      </section>

      <section className="lesson-section" id="borrow-recall">
        <p className="section-kicker">39 · Stock-loan Lifecycle、Recall 与 Buy-in</p>
        <h2>Actual stock-loan lifecycle 从实际借入、费率和抵押品开始；返还是否在 notice、定日或 demand 后发生取决于书面合同与适用规则。</h2>
        <p>
          D’Avolio 记录了借券市场的供给、费用和 recall 异质性；Engelberg、Reed 与 Ringgenberg 将高 fee、recall 等短卖风险连接到资产价格。它们说明 short leg 有独立状态，不应把历史费率当今天常数。<Cite n={35} /><Cite n={36} />
        </p>
        <p>
          数据上应另外保存实际借入量、日内使用量、fee、collateral、lender concentration、contract notice 和 replacement availability。FINRA Rule 4314 对相关证券借贷协议的主体披露、书面协议与“upon notice／at a date certain／upon demand”返还结构给出边界，但不能替每份合同决定具体 notice period。第 7 题把 recall 比例先转成股数，再用当时价格和回补成本得到现金影响；为了得到唯一答案，它另外冻结“无法替借且合同要求立即返还”的条件。Recall 本身不等于所有法域、所有合同下都必须立即在市场回补，也不能与 unsettled-contract buy-in 混为一谈。真实后果还包括寻找替代 lender、部分返还、失去 hedge、提高 beta、触发其他中性化订单和可能的 squeeze；1.19 负责完整制度，本节只读取它对 stat-arb 可行性的约束。<Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="net-pnl">
        <p className="section-kicker">40 · Net P&amp;L Attribution</p>
        <h2>净损益必须同时保留多空价格路径、执行成本、borrow、融资和公司行动；只报告 spread convergence 会丢失 agent 现金流。</h2>
        <div className="equation-card">
          <span>净损益 · 同一货币尺度</span>
          <div>Π<sub>t</sub> = Σn<sub>i,t−1</sub>r<sup>TR</sup><sub>i,t</sub> − C<sub>t</sub> − Σ<sub>short</sub>|n̄<sub>i,t</sub>|b<sub>i,t</sub>Δt − F<sub>t</sub></div>
          <p>Π、C、F、n 与 n̄ 都是货币；这里把 C、b 与 F 的正数约定为成本流出，因此统一从损益中扣除，若某项是 rebate 或融资收入，则以负成本进入，不能再额外加一次。r<sup>TR</sup> 明确定义为当期无量纲 total return，因此包含普通分配对 long／short 方向的经济影响。若数据只提供 price return，就必须另加一项带方向的 dividend／corporate-action cash flow，不能两种口径混用或重复扣除。b 是年化借券费率，Δt 是按明确 day-count 计算的 year fraction。n̄ 是该计费区间冻结的收费名义或按合同约定计算的平均空头名义；若日内数量或费率变化显著，应按时间积分而不是用单一终值。该式仍省略税、动态 collateral interest 和非线性衍生品。</p>
        </div>
        <p>
          Attribution 应分别报告 alpha leg、factor drift、execution、borrow/funding、corporate actions 与 residual。否则一次利润可能只是 beta 漂移，一次亏损也可能来自 recall 而非关系失效。
        </p>
      </section>

      <section className="lesson-section" id="path-risk">
        <p className="section-kicker">41 · Mark-to-market Path Risk</p>
        <h2>终点收敛不能弥补途中破产：权益、赎回和 margin 对路径响应，策略没有无限等待权。</h2>
        <p>
          Shleifer–Vishny 的核心机制是投资者可能在 arbitrageur 表现最差、机会看似最好时撤资；Mitchell–Pulvino–Stafford 的有限套利案例同样说明明显错价可以在收敛前进一步恶化。路径风险把“最终价值”与“能否活到最终”分开。<Cite n={22} /><Cite n={23} />
        </p>
        <p>
          风险管理因此要看 drawdown speed、liquidity horizon、margin headroom、investor terms 与 stop rules。止损可能保护生存，也会在拥挤状态把反向策略转成趋势订单；这不是简单的“止损好或坏”，而是反馈设计。
        </p>
      </section>

      <section className="lesson-section" id="vol-correlation-limits">
        <p className="section-kicker">42 · Volatility 与 Correlation Risk Limits</p>
        <h2>实现波动和相关性变化会重新计算风险预算；观点不变也可能机械触发组合缩放。</h2>
        <p>
          Volatility-managed portfolios 提供一种按预测风险调整 exposure 的研究脉络，但目标波动与预测波动必须使用同一收益口径、期限和年化规则，分母也必须为正。证据并非普遍一致：Moreira–Muir 在若干历史组合发现改进，Cederburg 等在更广策略集合和实时设计下没有发现系统性胜出。课程只把 vol scaling 当 agent rule，不把它宣传为通用 alpha。<Cite n={20} /><Cite n={21} />
        </p>
        <p>
          如果压力中相关性上升，原本分散的 residuals 就可能共振，并提高由 Σ 估计得到的组合预测风险；只有在给定 VaR、volatility budget 或 risk-to-gross 映射下，这个预测风险上升才会进一步压低允许 gross。若多家使用相似窗口和限额规则，risk update 本身就成为同步订单的共同时钟。
        </p>
      </section>

      <section className="lesson-section" id="margin-scaling">
        <p className="section-kicker">43 · Vol / Gross / Margin Scaling</p>
        <h2>真实 scale 是多个上限中的最小值；最紧约束会在状态变化时突然切换。</h2>
        <div className="equation-card">
          <span>组合缩放 · 教学可行集</span>
          <div>k<sub>t</sub> = max&#123;0, min[k<sub>max</sub>, σ*/σ̂<sup>0</sup><sub>t</sub>, G<sub>max</sub>/G<sup>0</sup><sub>t</sub>, E<sub>t</sub>/Σm<sub>i</sub>|n<sup>0</sup><sub>i</sub>|]&#125;</div>
          <p>σ̂<sup>0</sup> 是未缩放基准头寸 n<sup>0</sup> 在同一收益口径、期限与年化规则下的预测波动；该比率使用“头寸同比例缩放时波动也同比例缩放”的一阶同质性。k 无量纲且不会因负权益翻转头寸方向；k<sub>max</sub>、σ*、G<sub>max</sub>、m<sub>i</sub>≥0，σ̂<sup>0</sup>、G<sup>0</sup> 和 margin denominator 在启用相应约束时必须为正。若 E≤0，该教学式返回零规模并把组合标记为不可行；若某分母为零，相应比率应由规则显式跳过或单独处理，不能直接相除。G 比率是 gross 上限，最后一项是可加 margin 教学式。真实 margin 有净额、跨品种抵扣、集中度、压力和 house add-on；该式只说明“最紧约束决定规模”。</p>
        </div>
        <p>
          第 8、9 题分别让波动与 margin 成为最紧上限。若价格下跌同时提高 σ̂、降低 E、提高 m，多条约束会共同收缩，线性单因子风险模型将低估减仓。
        </p>
      </section>

      <section className="lesson-section" id="common-deleveraging">
        <p className="section-kicker">阶段六 · 内生动态　|　44 · Common Deleveraging</p>
        <h2>共同约束把分散决策合成为同向订单；价格冲击又把这些订单写回所有相似组合的权益。</h2>
        <div className="equation-card">
          <span>共同订单与局部价格反馈 · 教学桥</span>
          <div>R<sub>t</sub> = ΛQ<sub>t</sub> + u<sub>t</sub></div>
          <p>若 R 是无量纲收益，约定 Q&gt;0 为净买入、Q&lt;0 为净卖出；Q 是货币订单流，标量教学情形取 Λ&gt;0，因此共同卖出得到负收益贡献。Λ 的单位是 1/货币，u 汇集同期其他冲击。Λ 不是跨市场、跨规模、跨状态固定常数，Q 也必须声明时间窗和聚合范围。该式只展示共同减仓怎样进入价格，不能凭相关性识别因果。</p>
        </div>
        <p>
          完整链为：共同持仓先产生共同 P&amp;L，P&amp;L 通过 vol、margin、赎回或 stop 转成 target reduction，执行把 reduction 变成 Q，impact 再改变尚未平仓资产。对 market-neutral 组合，完整 reduction 通常同时包含卖出多头腿和回补空头腿；两类订单作用于不同资产，不能因为最初净名义接近零就假定市场冲击相消。Gromb–Vayanos 与 Brunnermeier–Pedersen 分别从约束套利与 funding–market liquidity 描述这种状态依赖。<Cite n={24} /><Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="crowding-measurement">
        <p className="section-kicker">45 · Crowding 怎样被测量</p>
        <h2>Crowding 不可直接观察；持仓相似、收益 comovement、short interest、容量和交易相关性都是不同代理。</h2>
        <p>
          Brown 等用 hedge-fund crowdedness 研究尾部风险；Lou–Polk 以 momentum 股票异常共振推断套利活动；这些代理各自覆盖特定样本和机制。高共同持仓可能增加退出冲突，也可能意味着有耐心资本吸收冲击；一个指标不能替全部拥挤。<Cite n={30} /><Cite n={31} /><Cite n={32} />
        </p>
        <p>
          更可信的研究应同时观察 position overlap、trade overlap、liquidity-adjusted days-to-liquidate、leverage/margin 和资金流。只看到策略收益同步下跌，无法区分共同信息、共同持仓与共同强平。
        </p>
      </section>

      <section className="lesson-section" id="common-holdings">
        <p className="section-kicker">46 · 共同持仓与流动性共振</p>
        <h2>共同持仓让一个基金的赎回订单进入其他基金的 mark-to-market；市场连接由资产重叠而非直接合约建立。</h2>
        <p>
          Coval–Stafford 记录共同基金流量驱动的 fire-sale/purchase 压力，Greenwood–Thesmar 将集中所有权和相关流动性冲击连接到价格脆弱性；Chordia 等则显示流动性本身具有共同成分。它们支持“共同状态存在”，不等于能从公开持仓完整重建私有 hedge-fund 网络。<Cite n={28} /><Cite n={29} /><Cite n={33} />
        </p>
        <p>
          对 stat-arb 来说，多头重叠和空头重叠都重要；short buyback 会推高原空头，long liquidation 会压低原多头，两边同时行动使原 spread 沿错误方向扩张。
        </p>
      </section>

      <section className="lesson-section" id="quant-meltdown">
        <p className="section-kicker">阶段七 · 案例与识别　|　47 · August 2007 Quant Meltdown</p>
        <h2>2007 年 8 月是“共同策略—去杠杆—流动性撤退”的重要证据，但公开研究提供的是间接重建，不是已观测到的单一触发者账本。</h2>
        <div className="case-study">
          <div><span>PUBLICLY DOCUMENTED</span><h3>多类 long/short equity quant funds 在 8 月 6 日当周报告异常同步损失，公开价格与成交数据可检验当时的收益和流动性时序。</h3><p>这些公开结果建立事件窗口，却没有披露全部基金仓位、融资合同或逐笔决策。</p></div>
          <div><span>ESTIMATED / INFERRED</span><h3>共同因子仓位、潜在去杠杆与 market-making risk-capital 收缩来自模型和交易代理重建，不能升级为完整账本。</h3><p>Khandani–Lo 使用五类估值因子组合和交易数据重建 7–8 月潜在 unwind，并以 transaction proxy 推断 8 月 8 日起临时流动性撤退；作者明确把证据称为 suggestive/indirect。</p></div>
        </div>
        <p>
          最严谨的表述是：数据与“共同组合去杠杆叠加临时流动性撤退”的假说一致，并给出具体时序和可检验含义；它不证明某一家基金触发全部事件，也不证明每次 stat-arb 亏损都是同一机制。<Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="gamestop-boundary">
        <p className="section-kicker">48 · GameStop 与 Short Squeeze 边界</p>
        <h2>高 short interest 能制造回补脆弱性，却不能把持续价格上涨全部归因于 short covering，更不能自动证明 gamma squeeze。</h2>
        <p>
          SEC staff 对 2021 年初市场条件的报告识别了若干 buying-to-cover 时段，也解释重复出借可使 reported short interest 超过流通股；但其 CAT 分析认为持续数周上涨主要并非由 short covering 驱动，并未找到 gamma squeeze 的支持证据。它是防止单因果叙事的关键反例。<Cite n={38} />
        </p>
        <p>
          对 market-neutral agent，short squeeze 的机制是价格跳升、borrow/margin 恶化和强制回补共同作用；研究仍需把主动零售买盘、期权 dealer hedge、short covering 与一般风险减仓分开，而不是用一个标签吞掉全部订单。
        </p>
      </section>

      <section className="lesson-section" id="treasury-basis">
        <p className="section-kicker">49 · Treasury Cash–Futures Basis</p>
        <h2>Treasury basis 展示“很小相对价差＋很大杠杆＋repo/margin”怎样形成脆弱性，也展示事件归因为何必须保留反证。</h2>
        <p>
          对 2020 年 March turmoil，FSB 把 dash-for-cash、dealer 约束与多类非银行机构的同步反应放在同一系统，并将 basis unwind 视为可能贡献者而非唯一原因；Kruttli 等和 He–Nagel–Song 分别从 hedge-fund Treasury/repo 暴露、Treasury inconvenience、dealer balance sheet 与 repo 机制提供进一步证据。<Cite n={39} /><Cite n={40} /><Cite n={41} />
        </p>
        <p>
          Glicoes 等在 2024 年估计后续 basis trade 规模，Monin 在 2026 年把截至 2025 年 9 月的 Treasury 暴露近似分解为多类用途；这些研究展示当前代理估计的方法和限制，不是 March 2020 因果识别的追加证据。<Cite n={42} /><Cite n={43} />
        </p>
        <p>
          重要反例来自 Gousgounis 等：其 10 年期 Treasury futures 分析没有发现 basis traders 是该市场流动性恶化的主要驱动者，asset managers 影响更大。因而“basis funds 导致 March 2020”过于强；现金债、期货和 repo 的产品范围、数据覆盖和参与者分类必须分开。<Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="funding-liquidity-spiral">
        <p className="section-kicker">50 · Funding–Market Liquidity Spiral</p>
        <h2>融资流动性决定 agent 能否持有，市场流动性决定平仓成本；两者在 margin 和价格冲击中互相回写。</h2>
        <p>
          Brunnermeier–Pedersen 的机制是：市场流动性变差提高交易和清算风险，financiers 提高 margin；margin 上升压缩 trader 资本，迫使其减少流动性供给和头寸，市场流动性进一步恶化。Gârleanu–Pedersen 则把不同证券的 margin requirement 连接到 law-of-one-price 偏离。<Cite n={25} /><Cite n={26} />
        </p>
        <p>
          这不是所有波动冲击必然升级的定律。充足 cash、低 leverage、稳定投资者、替代套利资本和央行／dealer 中介都可能打断循环。第 7.11 才会把它扩展为系统级 liquidity spiral，本节只保留 agent 层接口。
        </p>
      </section>

      <section className="lesson-section" id="state-dependence">
        <p className="section-kicker">51 · 状态依赖与反例</p>
        <h2>拥挤、波动缩放和套利资本都没有单调效应；同一机制在不同资产负债表状态下可以改变符号。</h2>
        <div className="myth-grid">
          <div className="wrong"><span>过度结论</span><p>“拥挤必然增加 crash risk。”</p></div>
          <div className="right"><span>证据边界</span><p>Barroso 等发现其机构持仓拥挤代理并不普遍提高预期 momentum crash risk，说明参与者可内生调整。</p></div>
          <div className="right"><span>正确问题</span><p>拥挤是否与 leverage、liquidity、similar stops 和同步融资冲击同时出现？</p></div>
        </div>
        <p>
          Cederburg 等对 volatility-managed portfolios 的反证、SEC 对 GameStop 的分解以及 Fed 对 Treasury futures 的反例共同说明：不能从一个漂亮机制直接跨样本外推。开放 world model 可以容纳多重反馈，具体研究必须冻结资产、参与者、时间窗和可证伪第一阶段。<Cite n={21} /><Cite n={32} /><Cite n={38} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">52 · Empirical Identification Protocol</p>
        <h2>“相似策略一起失效”不能由收益相关直接证明；研究必须观察共同暴露、约束变化、订单和价格反馈的先后。</h2>
        <div className="research-card">
          <span>EMPIRICAL DESIGN · LOCAL AND FALSIFIABLE</span>
          <h3>局部问题：一项事前可识别的 margin、borrow、赎回或风险限额冲击，是否先改变受影响组合的可行 gross，再产生同方向平仓，并通过流动性状态改变相对价格？</h3>
          <p>第一阶段是 headroom/borrow/flow 变化；第二阶段是 actual orders；第三阶段才是 spread、impact 与恢复。若没有第一阶段，不应把同步收益直接命名为 forced deleveraging。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>冻结观察单位：</b>position、portfolio×day、order、fill 与 fund return 不能混成同一行。</li>
          <li><b>保存 as-of 暴露：</b>用当时 B、beta、universe、borrow 与价格，不用最终数据回算。</li>
          <li><b>识别共同状态：</b>position overlap、factor overlap、prime broker、margin 与 investor flows 分别建模。</li>
          <li><b>区分信息与强平：</b>共同新闻也会造成同向订单；约束通道需要独立 first-stage 或制度冲击。</li>
          <li><b>纳入未成交与退出成本：</b>目标减仓不等于成交，liquidity 和 timing 决定价格路径。</li>
          <li><b>预注册 falsifier：</b>若被称为 margin shock，就应先收缩 gross/headroom；若只见 spread widening，证据不足。</li>
          <li><b>报告不可见状态：</b>缺少私有持仓和融资合同时，只能称 reduced-form 或间接重建。</li>
        </ol>
        <p>
          Khandani–Lo 是很好的写作范例：他们把模拟 factor portfolios、交易数据和 market-making proxy 分开，并明确标示推测边界。研究质量来自对不可见状态的诚实，而不是把每条箭头写成已观察事实。<Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="jurisdiction-status">
        <p className="section-kicker">53 · 法域与当前状态 · 截至 2026-08-30</p>
        <h2>Stat-arb 不是统一法律身份；本节只冻结与本课直接相连的美国 equity short sale、stock-loan 与 margin 边界。</h2>
        <div className="table-scroll" role="region" aria-label="统计套利相关美国法规边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">截至 2026 年 8 月 30 日的美国股票 short sale 与 margin 边界</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">本课相关边界</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">Reg SHO Rule 203</th><td>美国股票 short sale 的 locate 等要求及例外</td><td>Locate 不保证持有期借券稳定或费率锁定</td></tr>
              <tr><th scope="row">Reg SHO Rule 204</th><td>特定 fail-to-deliver 的 close-out 要求</td><td>不能把旧结算周期 FAQ 时限当当前通用标签</td></tr>
              <tr><th scope="row">Regulation T</th><td>broker-dealer securities credit 的联邦基础边界</td><td>不能推算某基金真实 prime-broker house margin</td></tr>
              <tr><th scope="row">FINRA Rule 4210</th><td>FINRA member margin requirements；新 intraday margin standards 自 2026-06-04 生效</td><td>会员可分阶段实施至 2027-10-20，不能把旧 PDT 次数／25,000 美元门槛写成统一当前状态；也不排除更严格 house 要求</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          本节练习使用法域无关的合成参数。美国股票实务需回到现行 eCFR、SEC staff FAQ 的非约束性边界、FINRA rulebook／实施通知、stock-loan agreement 与具体合同；Rule 4210 新制度虽已生效，会员仍可在过渡期内分阶段实施，因此账户实际状态还取决于会员实施时间与 house policy。期货、Treasury repo、欧盟、中国和其他市场各有独立短卖、融资、报告和操纵框架，不能把 Reg SHO 或 FINRA 阈值移植。任何当前状态判断都应保存访问日、产品、主体和规则版本。<Cite n={37} /><Cite n={45} /><Cite n={46} /><Cite n={47} /><Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">54 · 互动实验</p>
        <h2>十题沿同一条约束链推进：先分清暴露与信号，再让成本、borrow、波动、margin 和共同订单改变结果。</h2>
        <p>
          题目不是策略建议，也不使用随机或市场校准参数。每题冻结货币、名义、时间、day-count、beta、成本口径与忽略项；只有在这些条件下存在唯一答案。答对数字后，还要指出哪个边界改变会让答案失效。
        </p>
        <p className="print-only">打印／PDF 说明：本节十题互动实验只在网页中运行；第 55 节提供同一数据源的十道静态变式及完整答案，第 56 节提供十二道理解检查，打印版会强制显示全部答案。</p>
        <StatArbLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">55 · 主动练习 · 同数据静态变式</p>
        <h2>先离线写出单位、公式、现金流与约束，再展开答案；静态题与互动题共用同一冻结数据源。</h2>
        <div className="practice-grid">
          {statArbScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">56 · 理解检查</p>
        <h2>如果不能脱离公式说明“中性相对什么、风险怎样回写仓位”，就还没有掌握这个 agent。</h2>
        <details className="understanding-check"><summary>01 · 为什么 relative value 不等于 pure arbitrage？</summary><p>两腿通常不是完全相同且可同时锁定的现金流；关系、路径、执行、信用和融资都可能变化，因此允许亏损。</p></details>
        <details className="understanding-check"><summary>02 · 行业 stat-arb 与 Bondarenko/Hogan 的形式定义有何不同？</summary><p>行业词描述统计驱动的策略流程；论文定义对零成本、条件期望或长期收益过程施加特定数学条件，不能互相替代。</p></details>
        <details className="understanding-check"><summary>03 · Dollar neutral 为什么不保证 beta neutral？</summary><p>等额多空只令名义和为零；若两腿 beta 不同，按 beta 加权后的暴露仍非零。</p></details>
        <details className="understanding-check"><summary>04 · Gatev 原始 pairs 为什么不能叫 cointegration strategy？</summary><p>它按形成期标准化价格路径的最小距离选对，没有先用协整限制选择 pairs。</p></details>
        <details className="understanding-check"><summary>05 · Z-score=2 为什么不是确定的做空信号或尾部概率？</summary><p>它只表示相对冻结窗口均值的两倍样本标准差；还缺分布、稳定性、净收益、结构断裂与可行域条件。</p></details>
        <details className="understanding-check"><summary>06 · Residual 为什么不是“真实 alpha”？</summary><p>Residual 是相对所选因子、窗口和估计法未解释的部分；更换模型或出现新共同因子，它会改变。</p></details>
        <details className="understanding-check"><summary>07 · Self-financing 为什么不等于无融资成本？</summary><p>多空现金流可近似相抵，仍需 equity、margin、collateral、borrow、利息和稳定信用额度。</p></details>
        <details className="understanding-check"><summary>08 · 价差扩大何时产生负反馈，何时产生正反馈？</summary><p>资本与约束宽松且关系可信时会逆势加仓；权益、vol、margin、赎回或 borrow 收紧时可能被迫沿错误方向平仓。</p></details>
        <details className="understanding-check"><summary>09 · 2007 Quant Meltdown 为什么只能写“间接重建”？</summary><p>公开研究使用模拟因子组合和交易 proxy，没有完整基金私有持仓、prime-broker 合同、真实订单和单一触发者账本。</p></details>
        <details className="understanding-check"><summary>10 · GameStop 案例反驳了什么单因果叙事？</summary><p>SEC 识别部分 short covering，却认为持续上涨主要不是 buying-to-cover，并未找到 gamma squeeze 支持。</p></details>
        <details className="understanding-check"><summary>11 · Crowding 为什么不是 crash 的充分条件？</summary><p>共同暴露还需与 leverage、流动性、融资冲击和相似退出规则结合；参与者也可能预先降规模或吸收冲击。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪“共同强平导致价差扩大”？</summary><p>应先看到 margin/borrow/flow 等约束收紧，再看到受影响组合缩 gross 和同向订单；若缺少第一阶段或订单，归因不足。</p></details>
      </section>

      <section className="lesson-section" id="glossary-interfaces">
        <p className="section-kicker">57 · Glossary、接口与闭环</p>
        <h2>本节最终产物不是一套信号，而是一张能区分统计关系、组合暴露、资产负债表和市场反馈的接口图。</h2>
        <div className="interface-grid">
          <article><span>回接 T05 / T08</span><h3>统计与时间</h3><p>Correlation、regression、as-of window 和 leakage 决定你是否真的测量了当时可知关系。</p></article>
          <article><span>回接 1.09 / 1.19 / 1.20</span><h3>冲击、借券与强平</h3><p>信号只有穿过 impact、borrow、margin 和现金路径后，才成为现实订单。</p></article>
          <article><span>连接 2.15 / 2.19</span><h3>有限套利与拥挤</h3><p>本节给出局部 agent 机制，后续再系统化资本限制与全市场 crowded positioning。</p></article>
          <article><span>连接 7.04 / 7.13</span><h3>反馈与传染</h3><p>负反馈何时切换为共同减仓，将在复杂系统章扩展为 fire sale 和 contagion。</p></article>
        </div>
        <p>
          最小复述应是：<b>数据产生相对信号；风险模型把信号变成声明中性的多空 target；执行、成本、borrow 与融资决定 target 是否可实现；损益改变权益和限制；相似主体的缩放订单又改变价差、波动和下一轮信号。</b>只要漏掉其中任何一个箭头，“market neutral”都可能从分析语言退化为营销标签。
        </p>
      </section>
    </>
  );
}

export const lesson209: LessonRecord = {
  slug: '2-09',
  id: '2.09',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Statistical Arbitrage / Market Neutral：相对信号、受约束组合与共同减仓',
  subtitle: '从价差、因子残差与中性约束出发，解释相对价值资本何时提供负反馈，又怎样经成本、借券、融资、margin 与拥挤切换为正反馈',
  readingTime: '核心阅读约 125–145 分钟；互动实验快速 25–30／含复盘 45–55，主动练习核对 25–30／完整书写 45–60，理解检查快速 10–12／完整复述 18–22，课程接口 4 分钟；快速路径约 189–221 分钟，完整学习约 237–286 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T05；按需回看 T03、T08、1.09、1.19–1.20、2.07–2.08',
  updatedAt: '2026-08-30',
  revision: '2.09-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.09-r3',
      summary: '独立复核 58 节、12 张公式卡、10 道互动题与 10 道静态变式、53 条来源与 134 个邻接引文，以及截至 2026-08-30 的 Reg SHO、Reg T、FINRA Rule 4210／RN 26-10 与 Rule 4314；P0–P3 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.09-r3',
      summary: '独立复核零基础术语与因果链、58 节顺序、公式白话、10+10 题、损坏记录恢复、无脚本与无障碍、打印回归及 6／8／11／3 分层阅读路径；P0–P3 均为 0。',
    },
  ],
  previous: { slug: '2-08', label: '2.08 Market Maker / HFT 作为 Agent' },
  next: { slug: '2-10', label: '2.10 CTA / Trend Following' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与排除项' },
    { id: 'system-loop', label: '完整因果闭环' },
    { id: 'relative-value', label: 'Relative Value' },
    { id: 'stat-arb-industry', label: 'Stat-arb 的行业语义' },
    { id: 'stat-arb-formal', label: 'Stat-arb 的形式化语义' },
    { id: 'pure-arbitrage-boundary', label: 'Pure Arbitrage 边界' },
    { id: 'market-neutral-definition', label: 'Market Neutral 与三种中性' },
    { id: 'pairs-trading', label: 'Pairs Trading' },
    { id: 'cross-sectional-residual', label: 'Cross-sectional Residual' },
    { id: 'negative-feedback', label: '负反馈流动性' },
    { id: 'feedback-switch', label: '从收敛到被迫减仓' },
    { id: 'universe', label: '可交易股票池' },
    { id: 'corporate-actions', label: '公司行动与复权' },
    { id: 'signal-vs-return', label: 'Signal ≠ Expected Return' },
    { id: 'distance-pairs', label: 'Distance Pairs' },
    { id: 'correlation', label: 'Correlation 边界' },
    { id: 'cointegration', label: 'Cointegration' },
    { id: 'spread-units', label: 'Pair Spread 与 Hedge Ratio' },
    { id: 'ou-half-life', label: 'OU 与 Half-life' },
    { id: 'zscore', label: 'Z-score 与 Threshold' },
    { id: 'factor-model', label: 'Factor Model' },
    { id: 'residual-signal', label: 'Residual Signal' },
    { id: 'cross-sectional-ranking', label: 'Cross-sectional Ranking' },
    { id: 'signal-decay', label: 'Signal Decay' },
    { id: 'data-leakage', label: '前视、存活与泄漏' },
    { id: 'signed-notional', label: 'Signed Notional' },
    { id: 'dollar-neutral', label: 'Dollar Neutrality' },
    { id: 'beta-neutral', label: 'Beta-neutral Hedge' },
    { id: 'factor-neutral', label: 'Multifactor / Sector / Style' },
    { id: 'gross-net-leverage', label: 'Gross、Net 与 Leverage' },
    { id: 'constrained-optimization', label: 'Constrained Optimization' },
    { id: 'parameter-error', label: 'Covariance 与参数误差' },
    { id: 'capacity-concentration', label: 'Concentration 与 Capacity' },
    { id: 'turnover', label: 'Turnover' },
    { id: 'execution', label: '执行方式' },
    { id: 'transaction-costs', label: '交易成本与 Markout' },
    { id: 'financing-collateral', label: 'Financing 与 Collateral' },
    { id: 'locate-borrow', label: 'Locate ≠ Borrow ≠ Close-out' },
    { id: 'borrow-recall', label: 'Stock-loan Lifecycle' },
    { id: 'net-pnl', label: 'Net P&L Attribution' },
    { id: 'path-risk', label: 'Mark-to-market Path Risk' },
    { id: 'vol-correlation-limits', label: 'Volatility 与 Correlation Limits' },
    { id: 'margin-scaling', label: 'Vol / Gross / Margin Scaling' },
    { id: 'common-deleveraging', label: 'Common Deleveraging' },
    { id: 'crowding-measurement', label: 'Crowding 测量' },
    { id: 'common-holdings', label: '共同持仓与流动性共振' },
    { id: 'quant-meltdown', label: 'August 2007 Quant Meltdown' },
    { id: 'gamestop-boundary', label: 'GameStop 边界' },
    { id: 'treasury-basis', label: 'Treasury Basis' },
    { id: 'funding-liquidity-spiral', label: 'Funding–Liquidity Spiral' },
    { id: 'state-dependence', label: '状态依赖与反例' },
    { id: 'research-protocol', label: 'Empirical Identification' },
    { id: 'jurisdiction-status', label: '法域与当前状态' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'glossary-interfaces', label: 'Glossary、接口与闭环' },
  ],
  Content: Lesson209Content,
  references: [
    { id: 1, authors: 'Oleg Bondarenko', year: '2003', accessedAt: '2026-08-30', title: 'Statistical Arbitrage and Securities Prices', publication: 'Review of Financial Studies 16(3), 875–919', url: 'https://doi.org/10.1093/rfs/hhg016', use: '支持有限期 statistical arbitrage opportunity 的零成本、正无条件期望与逐最终状态非负条件期望定义；不替现实基金提供无风险认证。' },
    { id: 2, authors: 'Steve Hogan, Robert Jarrow, Melvyn Teo and Mitch Warachka', year: '2004', accessedAt: '2026-08-30', title: 'Testing Market Efficiency Using Statistical Arbitrage with Applications to Momentum and Value Strategies', publication: 'Journal of Financial Economics 73(3), 525–565', url: 'https://doi.org/10.1016/j.jfineco.2003.10.004', use: '支持长期累计收益过程的 statistical arbitrage 定义与历史检验；与行业策略语义及 Bondarenko 有限期定义分开。' },
    { id: 3, authors: 'Robert Jarrow, Melvyn Teo, Yiu Kuen Tse and Mitch Warachka', year: '2012', accessedAt: '2026-08-30', title: 'An Improved Test for Statistical Arbitrage', publication: 'Journal of Financial Markets 15(1), 47–80', url: 'https://doi.org/10.1016/j.finmar.2011.08.003', use: '支持统计套利检验条件与功效改进；有限样本结果仍依赖收益过程和检验设计。' },
    { id: 4, authors: 'Evan Gatev, William Goetzmann and K. Geert Rouwenhorst', year: '2006', accessedAt: '2026-08-30', title: 'Pairs Trading: Performance of a Relative-Value Arbitrage Rule', publication: 'Review of Financial Studies 19(3), 797–827', url: 'https://doi.org/10.1093/rfs/hhj020', use: '支持以标准化历史价格路径最小距离选 pair 的原始规则与历史表现；该设计不是 cointegration strategy。' },
    { id: 5, authors: 'Marco Avellaneda and Jeong-Hyun Lee', year: '2010', accessedAt: '2026-08-30', title: 'Statistical Arbitrage in the U.S. Equities Market', publication: 'Quantitative Finance 10(7), 761–782', url: 'https://doi.org/10.1080/14697680903124632', use: '支持 PCA／ETF factor residual 的美股 stat-arb 历史实现；因子、样本和成本不可外推为当前普遍策略。' },
    { id: 6, authors: 'Andrew Lo and A. Craig MacKinlay', year: '1990', accessedAt: '2026-08-30', title: 'When Are Contrarian Profits Due to Stock Market Overreaction?', publication: 'Review of Financial Studies 3(2), 175–205', url: 'https://doi.org/10.1093/rfs/3.2.175', use: '支持 lead–lag 与横截面协方差也能产生 contrarian profits；反转收益不自动证明过度反应。' },
    { id: 7, authors: 'Robert Engle and C. W. J. Granger', year: '1987', accessedAt: '2026-08-30', title: 'Co-integration and Error Correction: Representation, Estimation, and Testing', publication: 'Econometrica 55(2), 251–276', url: 'https://doi.org/10.2307/1913236', use: '支持协整与误差修正理论；统计限制不保证经济关系永久稳定、可融资或扣费后盈利。' },
    { id: 8, authors: 'Binh Do and Robert Faff', year: '2010', accessedAt: '2026-08-30', title: 'Does Simple Pairs Trading Still Work?', publication: 'Financial Analysts Journal 66(4), 83–95', url: 'https://doi.org/10.2469/faj.v66.n4.1', use: '支持简单 pairs 收益随时期变化的证据；不推出策略永远失效。' },
    { id: 9, authors: 'Binh Do and Robert Faff', year: '2012', accessedAt: '2026-08-30', title: 'Are Pairs Trading Profits Robust to Trading Costs?', publication: 'Journal of Financial Research 35(2), 261–287', url: 'https://doi.org/10.1111/j.1475-6803.2012.01317.x', use: '支持 pairs 结果对现实交易成本敏感；成本口径与市场状态须明确。' },
    { id: 10, authors: 'Nicolas Huck and Komivi Afawubo', year: '2015', accessedAt: '2026-08-30', title: 'Pairs Trading and Selection Methods: Is Cointegration Superior?', publication: 'Applied Economics 47(6), 599–613', url: 'https://doi.org/10.1080/00036846.2014.975417', use: '支持在其样本中比较 distance 与 cointegration 选对；结果不是跨市场普遍定理。' },
    { id: 11, authors: 'Christopher Krauss', year: '2017', accessedAt: '2026-08-30', title: 'Statistical Arbitrage Pairs Trading Strategies: Review and Outlook', publication: 'Journal of Economic Surveys 31(2), 513–545', url: 'https://doi.org/10.1111/joes.12153', use: '提供 pairs 与 stat-arb 方法地图；综述不能替代各原始研究的识别边界。' },
    { id: 12, authors: 'Harry Markowitz', year: '1952', accessedAt: '2026-08-30', title: 'Portfolio Selection', publication: 'Journal of Finance 7(1), 77–91', url: 'https://doi.org/10.1111/j.1540-6261.1952.tb01525.x', use: '支持均值—方差组合框架；不解决预期收益、协方差估计误差和交易摩擦。' },
    { id: 13, authors: 'Jack Treynor and Fischer Black', year: '1973', accessedAt: '2026-08-30', title: 'How to Use Security Analysis to Improve Portfolio Selection', publication: 'Journal of Business 46(1), 66–86', url: 'https://doi.org/10.1086/295508', use: '支持在因子框架中连接主动信号与组合；其强假设不构成生产优化器。' },
    { id: 14, authors: 'Eugene Fama and Kenneth French', year: '1993', accessedAt: '2026-08-30', title: 'Common Risk Factors in the Returns on Stocks and Bonds', publication: 'Journal of Financial Economics 33(1), 3–56', url: 'https://doi.org/10.1016/0304-405X(93)90023-5', use: '支持共同因子与暴露归因；因子集合不是唯一真实风险模型。' },
    { id: 15, authors: 'Mark Carhart', year: '1997', accessedAt: '2026-08-30', title: 'On Persistence in Mutual Fund Performance', publication: 'Journal of Finance 52(1), 57–82', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03808.x', use: '支持四因子归因与费用重要性；不等于 stat-arb 信号定义。' },
    { id: 16, authors: 'Robert Novy-Marx and Mihail Velikov', year: '2016', accessedAt: '2026-08-30', title: 'A Taxonomy of Anomalies and Their Trading Costs', publication: 'Review of Financial Studies 29(1), 104–147', url: 'https://doi.org/10.1093/rfs/hhv063', use: '支持 turnover、成本与交易缓解设计对 anomaly 实现的重要性；结论受历史成本估计限制。' },
    { id: 17, authors: 'Halbert White', year: '2000', accessedAt: '2026-08-30', title: 'A Reality Check for Data Snooping', publication: 'Econometrica 68(5), 1097–1126', url: 'https://doi.org/10.1111/1468-0262.00152', use: '支持多模型搜索校正；无法修复前视、错误时间戳或错误数据。' },
    { id: 18, authors: 'Campbell Harvey, Yan Liu and Heqing Zhu', year: '2016', accessedAt: '2026-08-30', title: '… and the Cross-Section of Expected Returns', publication: 'Review of Financial Studies 29(1), 5–68', url: 'https://doi.org/10.1093/rfs/hhv059', use: '支持 factor zoo 与 multiple-testing 风险；不提供跨研究机械通用阈值。' },
    { id: 19, authors: 'David Bailey, Jonathan Borwein, Marcos López de Prado and Qiji Jim Zhu', year: '2017', accessedAt: '2026-08-30', title: 'The Probability of Backtest Overfitting', publication: 'Journal of Computational Finance 20(4), 39–69', url: 'https://doi.org/10.21314/JCF.2016.322', use: '支持 CSCV／PBO 评估候选策略搜索；依赖候选生成与切分条件。' },
    { id: 20, authors: 'Alan Moreira and Tyler Muir', year: '2017', accessedAt: '2026-08-30', title: 'Volatility-Managed Portfolios', publication: 'Journal of Finance 72(4), 1611–1644', url: 'https://doi.org/10.1111/jofi.12513', use: '支持若干历史组合的 volatility scaling 研究；不是普适实时结论。' },
    { id: 21, authors: 'Scott Cederburg, Michael O’Doherty, Feifei Wang and Xuemin Yan', year: '2020', accessedAt: '2026-08-30', title: 'On the Performance of Volatility-Managed Portfolios', publication: 'Journal of Financial Economics 138(1), 95–117', url: 'https://doi.org/10.1016/j.jfineco.2020.04.015', use: '提供关键反例：在更广策略与实时设计中，vol scaling 没有系统性胜出。' },
    { id: 22, authors: 'Mark Mitchell, Todd Pulvino and Erik Stafford', year: '2002', accessedAt: '2026-08-30', title: 'Limited Arbitrage in Equity Markets', publication: 'Journal of Finance 57(2), 551–584', url: 'https://doi.org/10.1111/1540-6261.00434', use: '支持明显相对错价仍受路径和有限套利资本约束；样本机制不可无限外推。' },
    { id: 23, authors: 'Andrei Shleifer and Robert Vishny', year: '1997', accessedAt: '2026-08-30', title: 'The Limits of Arbitrage', publication: 'Journal of Finance 52(1), 35–55', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x', use: '支持表现驱动资本在机会扩大时撤出、迫使 arbitrageur 收缩的理论机制。' },
    { id: 24, authors: 'Denis Gromb and Dimitri Vayanos', year: '2002', accessedAt: '2026-08-30', title: 'Equilibrium and Welfare in Markets with Financially Constrained Arbitrageurs', publication: 'Journal of Financial Economics 66(2–3), 361–407', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3', use: '支持受约束套利者既可提供流动性，也会在财富／margin 受限时放大偏离。' },
    { id: 25, authors: 'Markus Brunnermeier and Lasse Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '支持 funding 与 market liquidity 的状态依赖螺旋；不表示所有波动冲击必然升级。' },
    { id: 26, authors: 'Nicolae Gârleanu and Lasse Pedersen', year: '2011', accessedAt: '2026-08-30', title: 'Margin-Based Asset Pricing and Deviations from the Law of One Price', publication: 'Review of Financial Studies 24(6), 1980–2022', url: 'https://doi.org/10.1093/rfs/hhr027', use: '支持 margin 的影子成本与相对价差；模型与所选市场证据不能自动移植。' },
    { id: 27, authors: 'Lasse Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'When Everyone Runs for the Exit', publication: 'International Journal of Central Banking 5(4), 177–199', url: 'https://www.ijcb.org/journal/v5n4/when-everyone-runs-exit', use: '支持共同平仓、流动性和 2007 机制的概念框架；不是完整私有头寸证据。' },
    { id: 28, authors: 'Joshua Coval and Erik Stafford', year: '2007', accessedAt: '2026-08-30', title: 'Asset Fire Sales (and Purchases) in Equity Markets', publication: 'Journal of Financial Economics 86(2), 479–512', url: 'https://doi.org/10.1016/j.jfineco.2006.09.007', use: '支持资金流经共同持仓产生价格压力及外部流动性供应；样本为共同基金。' },
    { id: 29, authors: 'Robin Greenwood and David Thesmar', year: '2011', accessedAt: '2026-08-30', title: 'Stock Price Fragility', publication: 'Journal of Financial Economics 102(3), 471–490', url: 'https://doi.org/10.1016/j.jfineco.2011.06.003', use: '支持集中所有权、相关流动性冲击与价格脆弱性关系；代理不等于真实交易。' },
    { id: 30, authors: 'Gregory Brown, Philip Howard and Christian Lundblad', year: '2022', accessedAt: '2026-08-30', title: 'Crowded Trades and Tail Risk', publication: 'Review of Financial Studies 35(7), 3231–3271', url: 'https://doi.org/10.1093/rfs/hhab107', use: '支持其 hedge-fund crowdedness 代理与下行尾部风险关系；不等于拥挤必然导致 crash。' },
    { id: 31, authors: 'Dong Lou and Christopher Polk', year: '2022', accessedAt: '2026-08-30', title: 'Comomentum: Inferring Arbitrage Activity from Return Correlations', publication: 'Review of Financial Studies 35(7), 3272–3302', url: 'https://doi.org/10.1093/rfs/hhab117', use: '支持 momentum 特定拥挤状态代理与后续反转；不能代替全部 stat-arb crowding。' },
    { id: 32, authors: 'Pedro Barroso, Roger Edelen and Paul Karehnke', year: '2022', accessedAt: '2026-08-30', title: 'Crowding and Tail Risk in Momentum Returns', publication: 'Journal of Financial and Quantitative Analysis 57(4), 1313–1342', url: 'https://doi.org/10.1017/S0022109021000624', use: '提供关键反例：机构持仓拥挤代理不必增加预期 momentum crash risk。' },
    { id: 33, authors: 'Tarun Chordia, Richard Roll and Avanidhar Subrahmanyam', year: '2000', accessedAt: '2026-08-30', title: 'Commonality in Liquidity', publication: 'Journal of Financial Economics 56(1), 3–28', url: 'https://doi.org/10.1016/S0304-405X(99)00057-4', use: '支持市场流动性的共同成分；历史 NYSE 样本不等于现代全市场。' },
    { id: 34, authors: 'Amir Khandani and Andrew Lo', year: '2011', accessedAt: '2026-08-30', title: 'What Happened to the Quants in August 2007? Evidence from Factors and Transactions Data', publication: 'Journal of Financial Markets 14(1), 1–46', url: 'https://doi.org/10.1016/j.finmar.2010.07.005', use: '支持 2007 quant losses、模拟 factor unwind 与临时 market-making risk capital 收缩的间接重建；不证明单一触发者。' },
    { id: 35, authors: 'Gene D’Avolio', year: '2002', accessedAt: '2026-08-30', title: 'The Market for Borrowing Stock', publication: 'Journal of Financial Economics 66(2–3), 271–306', url: 'https://doi.org/10.1016/S0304-405X(02)00206-4', use: '支持借券供给、费用和 recall 异质性；历史样本费率不是当前常数。' },
    { id: 36, authors: 'Joseph Engelberg, Adam Reed and Matthew Ringgenberg', year: '2018', accessedAt: '2026-08-30', title: 'Short-Selling Risk', publication: 'Journal of Finance 73(2), 755–786', url: 'https://doi.org/10.1111/jofi.12601', use: '支持 fee、recall 等 short-selling risk 与持仓／价格关系；代理不等于每笔借券合同。' },
    { id: 37, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'Regulation SHO — 17 CFR §§ 242.203–204', publication: 'Electronic Code of Federal Regulations, current text', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-242', use: '支持美国股票 locate 与 fail-to-deliver close-out 的当前规则边界；具体例外和时限必须按当前文本核对，旧结算周期标签不可沿用。' },
    { id: 38, authors: 'U.S. Securities and Exchange Commission Staff', year: '2021', accessedAt: '2026-08-30', title: 'Staff Report on Equity and Options Market Structure Conditions in Early 2021', publication: 'SEC staff report, 14 October 2021', url: 'https://www.sec.gov/about/reports-publications/staff-report-equity-options-market-structure-conditions-early-2021', use: '支持 GameStop 的离散 short covering、高 short interest 机制与未发现 gamma squeeze；持续上涨主要并非 buying-to-cover。' },
    { id: 39, authors: 'Financial Stability Board', year: '2020', accessedAt: '2026-08-30', title: 'Holistic Review of the March Market Turmoil', publication: 'FSB official report', url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/', use: '支持 dash-for-cash、dealer 约束和 basis unwind 可能共同贡献；报告保留多重并发原因。' },
    { id: 40, authors: 'Mathias Kruttli, Phillip Monin, Lubomir Petrasek and Sumudu Watugala', year: '2021', accessedAt: '2026-08-30', title: 'Hedge Fund Treasury Trading and Funding Fragility: Evidence from the COVID-19 Crisis', publication: 'Federal Reserve FEDS 2021-038', url: 'https://doi.org/10.17016/FEDS.2021.038', use: '支持 hedge-fund Treasury／repo 暴露和流动性管理压力；作者研究不代表单因果官方结论。' },
    { id: 41, authors: 'Zhiguo He, Stefan Nagel and Zhaogang Song', year: '2022', accessedAt: '2026-08-30', title: 'Treasury Inconvenience Yields during the COVID-19 Crisis', publication: 'Journal of Financial Economics 143(1), 57–79', url: 'https://doi.org/10.1016/j.jfineco.2021.05.044', use: '支持 dealer balance sheet、repo 与 Treasury basis 的模型和数据联系；不排除其他并发冲击。' },
    { id: 42, authors: 'Jonathan Glicoes, Benjamin Iorio, Phillip Monin and Lubomir Petrasek', year: '2024', accessedAt: '2026-08-30', title: 'Quantifying Treasury Cash-Futures Basis Trades', publication: 'Federal Reserve FEDS Notes, 8 March 2024', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/quantifying-treasury-cash-futures-basis-trades-20240308.html', use: '支持 basis trade 的代理估计方法和规模变化；不是逐笔持仓账本。' },
    { id: 43, authors: 'Phillip Monin', year: '2026', accessedAt: '2026-08-30', title: 'Decomposing Hedge Funds’ U.S. Treasury Exposures', publication: 'Federal Reserve FEDS Notes, 22 June 2026', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/decomposing-hedge-funds-u-s-treasury-exposures-20260622.html', use: '支持截至 2025-09 的 hedge-fund Treasury exposure 近似分解；估计不可写成精确交易账本。' },
    { id: 44, authors: 'Eleni Gousgounis, Scott Mixon, Tugkan Tuzun and Clara Vega', year: '2025', accessedAt: '2026-08-30', title: 'Market Liquidity in Treasury Futures Market During March 2020', publication: 'Federal Reserve FEDS 2025-038', url: 'https://doi.org/10.17016/FEDS.2025.038', use: '提供反例：十年期 Treasury futures 中 basis traders 不是主要流动性驱动者，asset managers 影响更大。' },
    { id: 45, authors: 'Board of Governors of the Federal Reserve System', year: '2026/current', accessedAt: '2026-08-30', title: 'Regulation T — Credit by Brokers and Dealers', publication: '12 CFR Part 220, current eCFR', url: 'https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-220', use: '支持美国 broker-dealer securities credit 的联邦基础边界；不能推算单一基金真实 prime-broker margin。' },
    { id: 46, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'Rule 4210 — Margin Requirements', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210', use: '支持 FINRA member margin requirements；house、portfolio 和集中度要求可能更严格。' },
    { id: 47, authors: 'U.S. Securities and Exchange Commission, Division of Trading and Markets Staff', year: '2026/current', accessedAt: '2026-08-30', title: 'Responses to Frequently Asked Questions Concerning Regulation SHO', publication: 'SEC staff guidance, listed as updated 26 June 2026', url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions-8', use: '补充 locate 和 close-out 的 staff interpretation；FAQ 明示无独立法律效力，其总览仍保留未随 T+1 更新的 T+4/T+6 legacy trade-date shorthand，不能替代 Rule 204 的 settlement-date-relative 原文。' },
    { id: 48, authors: 'FINRA', year: '2026', accessedAt: '2026-08-30', title: 'FINRA Adopts New Intraday Margin Standards to Replace the Day Trading Margin Requirements', publication: 'FINRA Regulatory Notice 26-10, 20 April 2026', url: 'https://www.finra.org/rules-guidance/notices/26-10', use: '支持 Rule 4210 新 intraday margin standards 自 2026-06-04 生效、完整替代旧 day-trading/PDT 要求，并允许会员分阶段实施至 2027-10-20。' },
    { id: 49, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'Rule 4314 — Securities Loans and Borrowings', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4314', use: '支持证券借贷交易的 capacity disclosure、书面协议与按 notice／定日／demand 返还结构；不替具体合同给出统一 recall 时限。' },
    { id: 50, authors: 'Freddy Delbaen and Walter Schachermayer', year: '1994', accessedAt: '2026-08-30', title: 'A General Version of the Fundamental Theorem of Asset Pricing', publication: 'Mathematische Annalen 300, 463–520', url: 'https://doi.org/10.1007/BF01450498', use: '支持一般 no-arbitrage／no-free-lunch-with-vanishing-risk 边界；正文使用有限期零成本、非负终值且正概率严格为正的基础定义，并提醒连续时间还需 admissibility。' },
    { id: 51, authors: 'Stephen Brown, William Goetzmann, Roger Ibbotson and Stephen Ross', year: '1992', accessedAt: '2026-08-30', title: 'Survivorship Bias in Performance Studies', publication: 'Review of Financial Studies 5(4), 553–580', url: 'https://doi.org/10.1093/rfs/5.4.553', use: '支持只保留存续对象会系统性扭曲历史绩效；不替 stat-arb 数据库给出唯一修正法。' },
    { id: 52, authors: 'Tyler Shumway', year: '1997', accessedAt: '2026-08-30', title: 'The Delisting Bias in CRSP Data', publication: 'Journal of Finance 52(1), 327–340', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03818.x', use: '支持遗漏退市回报造成历史样本偏差；具体数据库和市场仍需逐项核对。' },
    { id: 53, authors: 'Olivier Ledoit and Michael Wolf', year: '2004', accessedAt: '2026-08-30', title: 'A Well-Conditioned Estimator for Large-Dimensional Covariance Matrices', publication: 'Journal of Multivariate Analysis 88(2), 365–411', url: 'https://doi.org/10.1016/S0047-259X(03)00096-4', use: '支持高维样本协方差的病态性与 shrinkage 改善条件数；不保证 portfolio inputs 或结构模型正确。' },
  ],
  readingList: [
    { title: 'Gatev, Goetzmann & Rouwenhorst (2006)', scope: 'distance pairs 的形成期、交易期、阈值与历史结果', reason: '先看一套透明规则怎样从相似路径变成多空交易，同时记住它不是协整策略。', url: 'https://doi.org/10.1093/rfs/hhj020', group: 'core', guide: '先修 T05；先读方法与样本构造，再读收益和风险；约 120 分钟。' },
    { title: 'Avellaneda & Lee (2010)', scope: 'PCA／ETF 因子残差、OU 信号与美股实现', reason: '把两资产 pairs 扩展为横截面 residual strategy，并审计因子和成本边界。', url: 'https://doi.org/10.1080/14697680903124632', group: 'core', guide: '先读本节 21–33；重点读模型、信号和样本外结果；约 120–180 分钟。' },
    { title: 'Khandani & Lo (2011)', scope: '2007 Quant Meltdown 的 factor、交易数据和流动性重建', reason: '学习如何把共同去杠杆写成审慎假说，而不是已观察的单一因果。', url: 'https://doi.org/10.1016/j.finmar.2010.07.005', group: 'core', guide: '先读 abstract、Sections 4–7 与 conclusion；约 120 分钟。' },
    { title: 'Shleifer & Vishny (1997)', scope: '投资者资金流、绩效路径与 limits to arbitrage', reason: '理解为什么机会扩大时，套利资本反而可能收缩。', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x', group: 'core', guide: '先修 1.20；先读机制和比较静态；约 60–90 分钟。' },
    { title: 'Brunnermeier & Pedersen (2009)', scope: 'funding liquidity、market liquidity 与 margin spiral', reason: '把 agent 资产负债表连接到市场深度和价格反馈。', url: 'https://doi.org/10.1093/rfs/hhn098', group: 'core', guide: '先修 T06 与 1.20；先读机制、再按需读证明；约 120–180 分钟。' },
    { title: 'SEC Staff (2021) · Early 2021 Market Structure', scope: 'GameStop、short covering、short interest 与 gamma-squeeze 边界', reason: '用官方订单与市场结构分析训练反单因果叙事。', url: 'https://www.sec.gov/about/reports-publications/staff-report-equity-options-market-structure-conditions-early-2021', group: 'core', guide: '先读 Executive Summary 和 GameStop 交易分析；约 60–90 分钟。' },
    { title: 'Bondarenko (2003)', scope: '有限期 statistical arbitrage opportunity 的形式定义', reason: '把数学 SAO 与行业策略语言严格分开。', url: 'https://doi.org/10.1093/rfs/hhg016', group: 'models', guide: '先修条件期望；先读定义与直觉，再按需读定理；约 120 分钟。' },
    { title: 'Hogan et al. (2004)', scope: '长期累计收益过程与 statistical arbitrage 检验', reason: '理解长期亏损概率与方差条件怎样不同于有限期 SAO。', url: 'https://doi.org/10.1016/j.jfineco.2003.10.004', group: 'models', guide: '先读 definition、testing methodology 与 robustness；约 120–180 分钟。' },
    { title: 'Engle & Granger (1987)', scope: 'cointegration、representation 与 error correction', reason: '获得“长期组合稳定”比相关性多出的严格统计限制。', url: 'https://doi.org/10.2307/1913236', group: 'models', guide: '先修 T05；重点读 representation theorem 与检验边界；约 150–240 分钟。' },
    { title: 'Markowitz (1952)', scope: '预期收益、协方差与组合选择', reason: '建立组合优化的共同语言，同时观察输入误差为何关键。', url: 'https://doi.org/10.1111/j.1540-6261.1952.tb01525.x', group: 'models', guide: '先修 T03；约 60–90 分钟。' },
    { title: 'Fama & French (1993)', scope: '股票与债券共同风险因子', reason: '理解 factor exposure 作为经验坐标系，而不是唯一真模型。', url: 'https://doi.org/10.1016/0304-405X(93)90023-5', group: 'models', guide: '先读因子构造和 regression evidence；约 120 分钟。' },
    { title: 'Gromb & Vayanos (2002)', scope: '受约束套利者、分割市场与福利', reason: '深化“套利资本既稳定价格也可能放大偏离”的均衡机制。', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3', group: 'models', guide: '先修资产负债表与一般均衡直觉；约 180–240 分钟。' },
    { title: 'Gârleanu & Pedersen (2011)', scope: 'margin requirement 与 law-of-one-price deviation', reason: '把不同保证金的影子成本连接到 relative-value basis。', url: 'https://doi.org/10.1093/rfs/hhr027', group: 'models', guide: '先读模型直觉和实证市场，再读推导；约 150–210 分钟。' },
    { title: 'D’Avolio (2002)', scope: '证券借贷供给、费用、specialness 与 recall', reason: '让 short leg 从符号变成有供给曲线和合同风险的市场。', url: 'https://doi.org/10.1016/S0304-405X(02)00206-4', group: 'models', guide: '先修 1.19；重点读制度与横截面证据；约 120 分钟。' },
    { title: 'Do & Faff (2012)', scope: '简单 pairs 的交易成本与时期稳健性', reason: '检验经典规则扣除实现成本后是否仍成立；2010 的时期变化研究见参考文献 8。', url: 'https://doi.org/10.1111/j.1475-6803.2012.01317.x', group: 'evidence', guide: '先读成本分解与不同阶段结果；再按需回到参考文献 8；约 90–120 分钟。' },
    { title: 'Novy-Marx & Velikov (2016)', scope: 'anomaly turnover、成本与缓解交易', reason: '把毛收益转成 implementable net return。', url: 'https://doi.org/10.1093/rfs/hhv063', group: 'evidence', guide: '先读成本框架和分类结果；约 120–180 分钟。' },
    { title: 'White (2000)', scope: 'data snooping reality check', reason: '为多 pair、多窗口和多阈值搜索建立统计防护。', url: 'https://doi.org/10.1111/1468-0262.00152', group: 'evidence', guide: '先修 bootstrap；先抓 null 与 candidate-set 逻辑；约 150 分钟。' },
    { title: 'Harvey, Liu & Zhu (2016)', scope: 'factor zoo 与 multiple testing', reason: '理解大量横截面信号为何需要更严格发现标准。', url: 'https://doi.org/10.1093/rfs/hhv059', group: 'evidence', guide: '先读 motivation、multiple tests 和 implications；约 120 分钟。' },
    { title: 'Cederburg et al. (2020)', scope: '103 个策略中的 volatility management 样本外反证', reason: '防止把风险缩放机制误写成普适绩效改进。', url: 'https://doi.org/10.1016/j.jfineco.2020.04.015', group: 'evidence', guide: '与 Moreira–Muir 对读；约 120–180 分钟。' },
    { title: 'Brown, Howard & Lundblad (2022)', scope: 'hedge-fund crowdedness 与 tail risk', reason: '学习拥挤代理怎样建立，也学习它不能直接还原真实订单。', url: 'https://doi.org/10.1093/rfs/hhab107', group: 'evidence', guide: '先读 proxy construction、identification 与 tails；约 120 分钟。' },
    { title: 'Lou & Polk (2022)', scope: 'comomentum 作为套利活动／拥挤代理', reason: '观察收益相关怎样被转化为 momentum 特定状态指标。', url: 'https://doi.org/10.1093/rfs/hhab117', group: 'evidence', guide: '先修 T05；约 120 分钟。' },
    { title: 'Barroso, Edelen & Karehnke (2022)', scope: 'momentum crowding 与 crash risk 的反例', reason: '强迫 world model 容纳参与者内生降风险，而非拥挤单调致灾。', url: 'https://doi.org/10.1017/S0022109021000624', group: 'evidence', guide: '与 Brown/Lou–Polk 对读；约 120 分钟。' },
    { title: 'FSB (2020) · March Market Turmoil', scope: 'dash-for-cash、dealer constraints 与 basis unwind', reason: '用系统级官方综述理解多重并发原因。', url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/', group: 'evidence', guide: '先读 Executive Summary 与 core funding/liquidity findings；约 90 分钟。' },
    { title: 'Monin (2026) · Hedge Fund Treasury Exposures', scope: 'Treasury gross 与 basis exposure 的近似分解', reason: '学习如何使用当前代理估计而不把它当精确账本。', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/decomposing-hedge-funds-u-s-treasury-exposures-20260622.html', group: 'evidence', guide: '先看 methodology 和 caveats；约 45–60 分钟。' },
    { title: 'Gousgounis et al. (2025)', scope: 'March 2020 十年期 Treasury futures 流动性与参与者', reason: '提供 basis-trader 单因果叙事的重要反证。', url: 'https://doi.org/10.17016/FEDS.2025.038', group: 'evidence', guide: '先冻结产品范围，再读 participant decomposition；约 90–120 分钟。' },
    { title: 'Regulation SHO · Rules 203–204', scope: '美国股票 locate 与 close-out 边界', reason: '从现行原文理解 short leg 的合规可行集。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-242', group: 'rules', guide: '先修 1.19；按当前版本核对主体、例外和时限；约 45–60 分钟。' },
    { title: 'Federal Reserve Regulation T', scope: 'broker-dealer securities credit 基础规则', reason: '区分联邦基础边界与真实 prime-broker house margin。', url: 'https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-220', group: 'rules', guide: '先修 1.20 与 2.07；按账户和交易类型检索；约 45–60 分钟。' },
    { title: 'FINRA Regulatory Notice 26-10', scope: '2026 intraday margin 改制、旧 PDT 要求替代与过渡期', reason: '理解规则已生效与会员可分阶段实施为何能同时成立，并与 Rule 4210／house margin 分层。', url: 'https://www.finra.org/rules-guidance/notices/26-10', group: 'rules', guide: '先读 Summary、Intraday Margin 与 Implementation；Rule 4210 原文见参考文献 46；约 60–90 分钟。' },
  ],
};
