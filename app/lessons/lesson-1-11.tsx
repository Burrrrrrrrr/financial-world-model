import PriceDiscoveryLab from '../components/PriceDiscoveryLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson111Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>价格发现不是“哪个市场先跳了一下”，而是新信息首先在哪个可交易接口改变报价，以及哪些创新最终留在多个相连价格共享的长期成分中。</h2>
        <p>
          同一条关于股票指数的消息可以同时面对期货、ETF、成分股篮子和期权。期货也许仍在交易、保证金占用较低；ETF 可以一笔表达整篮子；现货成分股直接承载公司现金流，却可能异步成交；期权能高杠杆表达方向、波动率和尾部风险。信息拥有者会选择成本较低、速度较快、约束较少且最适合该信息类型的接口。该市场的报价先更新，套利者与做市者再调整其他相连价格，局部差价逐步回到长期关系。
        </p>
        <p>
          这条链至少产生四个不同问题：谁先动；谁较少对长期偏离纠错；谁的意外变化对共同长期创新方差贡献更大；若移除某市场的变化，其他市场是否仍会同样调整。它们分别对应 timing、error correction、statistical price-discovery share 与 causal transmission，不能互换。Hasbrouck information share 和 Gonzalo–Granger component share就是为不同层次设计的统计分解；它们不是“知情交易占比”，也不是信息在经济上由谁创造的百分比。<Cite n={3} /><Cite n={4} /><Cite n={5} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>把信息事件、潜在有效价格、可观察合约价格、共同随机趋势与局部噪声分开。</li>
            <li>判断期货、ETF、现货篮子和期权何时表达同一经济 claim，以及进入模型前需怎样对齐。</li>
            <li>用 I(0)、I(1)、cointegration 与 VECM 解释“分开漂移却不会无限分家”。</li>
            <li>读取 adjustment loading、共同创新、Hasbrouck IS bounds 与 Gonzalo–Granger CS。</li>
            <li>解释 IS、CS 与 information leadership share 为什么可能给出不同排序。</li>
            <li>识别 previous-tick、feed latency、闭市、陈旧 NAV（net asset value，基金净资产价值）、宽期权价差与同期公共新闻制造的伪领先。</li>
            <li>把“期货/ETF/期权领先”改写成带对象、时段、时钟、指标、对照和失败条件的可证伪命题。</li>
          </ol>
        </div>
        <aside className="precision-note">
          <span>相邻章节边界</span>
          <p>1.09 已区分 response 与 causal impact，1.10 已解释订单方向如何更新共同价值。本节研究同一或紧密等价经济暴露的多个价格怎样共享长期创新；不重讲订单冲击或知情身份。1.21 再完整展开 ETF creation/redemption，1.22 再推导 futures basis 与 cash-and-carry，4.12 再讨论跨资产、跨国家的广义 lead–lag、预测与传导。</p>
        </aside>
      </section>

      <section className="lesson-section" id="object-map">
        <p className="section-kicker">01 · 六层对象地图</p>
        <h2>“信息进入价格”至少跨过六层；屏幕上的第一个数字只是传导链的一次观测，不是信息本身。</h2>
        <div className="table-scroll" role="region" aria-label="价格发现六层对象地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从现实事件到研究结论</caption>
            <thead><tr><th scope="col">层</th><th scope="col">对象</th><th scope="col">是否可直接观察</th><th scope="col">最常见误读</th></tr></thead>
            <tbody>
              <tr><th scope="row">信息事件</th><td>宏观、公司、订单流、波动率或约束变化</td><td>只在有明确时间戳时部分可见</td><td>把所有同步变化归给某个市场</td></tr>
              <tr><th scope="row">潜在有效价格 v*</th><td>相关信息在无摩擦环境中被吸收后的理论 log price</td><td>不可直接观察</td><td>把某个 future mid 当成无误真值</td></tr>
              <tr><th scope="row">Instrument / venue</th><td>具有现金流规则的合约，以及交易它的具体场所</td><td>合约与场所可见，完整参与者集不可见</td><td>把同一 ticker 与同一经济 claim 混为一谈</td></tr>
              <tr><th scope="row">Quote / trade price</th><td>带 spread、tick、队列、库存和时钟的可观察价格</td><td>取决于 feed 与深度覆盖</td><td>把接收时间当成报价生成时间</td></tr>
              <tr><th scope="row">Common trend m</th><td>从相连价格统计提取的共享非平稳趋势</td><td>由模型估计</td><td>把统计共同成分自动等同 v*</td></tr>
              <tr><th scope="row">研究结论</th><td>timing、CS、IS、ILS、预测或因果效应</td><td>依估计协议产生</td><td>把不同 estimand 合成一个“发现冠军”</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Engle–Granger 提供的是长期共同约束的统计语言；Hasbrouck 再将 reduced-form innovations 映射到共同价格创新方差。它们都要求研究者先定义哪些价格在经济上应共享趋势。公式再精确，也不能修复一开始比较错对象的问题。<Cite n={1} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="question-index">
        <p className="section-kicker">02 · “谁发现”必须带下标</p>
        <h2>没有信息类型、经济暴露、时段、期限、价格口径和指标，“谁在发现价格”不是一个完整问题。</h2>
        <p>
          一个可检验问题至少写成：对哪条信息——市场整体、公司特定、方向、波动率还是尾部；比较哪种 claim——同一股票多 venue、carry-adjusted futures/spot、ETF/basket 或 parity-implied option price；在哪些共同交易时段和制度状态；用 quote midpoint、可执行 bid/ask 还是成交价；在毫秒、分钟还是日内期限；最后用 first response、lead–lag、CS、IS、ILS 还是局部因果效应作结果。
        </p>
        <p>
          因此不存在脱离条件的永久总冠军。宏观公告可能先进入指数期货，公司特定消息可能先进入个股，境外底层闭市时 ETF 可能成为唯一实时接口，尾部风险又可能先进入期权隐含分布。全样本平均份额把这些状态混在一起，只能描述样本权重下的平均，不是 instrument 的自然属性。
        </p>
      </section>

      <section className="lesson-section" id="linked-claims">
        <p className="section-kicker">03 · 一个暴露，多种合约</p>
        <h2>只有最终被同一经济价值约束的价格，才有资格进入同一个 common-trend 系统。</h2>
        <p>
          Instrument 是具有特定现金流、结算和权利义务的合约；venue 是该合约被交易的场所。同一股票在多个交易所的 claim 几乎相同，是最干净的价格发现问题。股指期货、ETF 和成分股篮子表达相近指数风险，却分别含期限、融资、分红、基金费用和篮子单位；期权 payoff（到期收益结构）非线性，单只 call 的价格水平并不与股票一对一同趋势。
        </p>
        <p>
          “同一指数名称”也不保证同一对象。官方 cash index 是计算值，不一定可交易；成分股篮子可执行但异步；ETF 是基金份额；期货是未来结算合约。Fleming–Ostdiek–Whaley 比较股票、期货与期权时已经强调交易成本和信息类型会影响交易场所选择；SEC 的 ETF 材料则说明基金份额与篮子通过制度机制相连，却不证明分钟级调整方向。<Cite n={12} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="economic-normalization">
        <p className="section-kicker">04 · 先放到同一经济单位</p>
        <h2>直接把原始 futures、ETF、index 和 option 价格放进 VECM，会把合约差异误当成长期偏离。</h2>
        <p>
          令 P<sub>i,t</sub> 为原始价格，d<sub>i,t</sub> 包含当时可得的 multiplier、货币、篮子单位、期限和必要 carry 信息。统一后的 log price 可抽象写成 p<sub>i,t</sub>=log g<sub>i</sub>(P<sub>i,t</sub>;d<sub>i,t</sub>)。这个 g 不是装饰：若期货未换成 spot-equivalent，合约到期会系统改变差价；若 ETF 每份对应篮子单位不一致，线性组合也没有经济含义。
        </p>
        <div className="equation-card">
          <span>期货的教学性 spot-equivalent 映射</span>
          <div>S<sup>F</sup><sub>t</sub>=F<sub>t,T</sub>·e<sup>−(r<sub>t</sub>−q<sub>t</sub>)(T−t)</sup></div>
          <p>在连续融资率 r 与分红率 q 的简化下，将期货换成当前现货单位。本节只用它完成可比性门禁；预期分红、交易成本带、逐日结算、换月和完整 basis 套利留给 1.22。</p>
        </div>
        <p>
          所有映射都必须只使用当时可得信息。用收盘后确认的分红、最终指数成分或日终 NAV 回填日内序列，会把未来信息泄漏进“共同价格”。Hasbrouck 的指数市场比较之所以有解释力，正因为它先把不同指数工具置于可比系统；结论仍严格属于特定产品和制度。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="frictionless-benchmark">
        <p className="section-kicker">05 · 无摩擦同步基准</p>
        <h2>若所有接口同时看见同一信息、没有交易摩擦且套利即时完成，价格同步更新，数据无法识别唯一发现者。</h2>
        <p>
          在基准世界里，期货、ETF 和可执行篮子已被换成同一 claim；参与者同时收到新闻，能无限低成本做多、做空和套利，交易场所时钟完全同步。任何一个价格偏离都会被瞬间消除，于是观测到的是相同时间戳上的共同跳跃。经济上信息已经被发现，统计上却没有理由把这次共同创新唯一分配给某个市场。
        </p>
        <p>
          Leader 只在摩擦与异质性中出现：谁先开放、谁更便宜、谁能做空、谁有更深订单簿、谁的 feed 更快、哪个 payoff 最适合表达该信息。同期创新相关也不是估计失败，而是无摩擦共同冲击在有限采样桶中的残影；后面的 IS ordering bounds 正是诚实保留这种未识别性。
        </p>
      </section>

      <section className="lesson-section" id="friction-routing">
        <p className="section-kicker">06 · 信息路由到最合适接口</p>
        <h2>信息不会抽签选择市场；参与者依据交易成本、资本效率、速度、约束和信息类型内生选择表达位置。</h2>
        <div className="mechanism-chain" aria-label="跨市场价格发现的路由链">
          {[
            ['信息到达', '宏观、公司、订单流、波动率或约束状态改变'],
            ['选择表达接口', '比较 spread、depth、杠杆、做空、时段、延迟与 payoff'],
            ['首个 quote/trade innovation', '某个 instrument 或 venue 先出现无法由过去解释的变化'],
            ['套利与再定价', '做市、对冲、路由和相对价值交易调整相连价格'],
            ['长期关系恢复', '局部 wedge 均值回复，共同创新留在共享趋势'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          低成本与高杠杆常使衍生品适合表达市场整体消息，但这只是条件假说。Fleming 等发现指数衍生品常领先现金指数，而个股往往领先自身期权，正说明信息类型与相对交易成本共同决定路由。成交量、流动性或杠杆任何单一指标都不足以排出永久名次。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="instrument-comparator">
        <p className="section-kicker">07 · Futures / ETF / Spot / Options</p>
        <h2>四类接口各有先动理由，也各有伪领先来源；比较必须围绕共同 target，而不是 ticker 名称。</h2>
        <div className="table-scroll" role="region" aria-label="四类价格发现接口比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>条件性领先假说与测量防线</caption>
            <thead><tr><th scope="col">接口</th><th scope="col">为何可能先吸收</th><th scope="col">伪领先来源</th><th scope="col">合法比较目标</th></tr></thead>
            <tbody>
              <tr><th scope="row">Futures</th><td>延长时段、资本效率、易做空、集中指数流量</td><td>carry、roll、price limit、cash closed</td><td>carry-adjusted spot-equivalent</td></tr>
              <tr><th scope="row">ETF</th><td>一笔交易表达篮子、连续报价、跨境可访问</td><td>NAV / IIV（intraday indicative value，盘中参考价值）陈旧、底层闭市、停牌与外汇</td><td>同步 ETF 与可执行/公允篮子</td></tr>
              <tr><th scope="row">Spot / basket</th><td>直接承载现金流，公司特定信息可先入个股</td><td>官方指数不可交易、成分股异步、卖空约束</td><td>同步可交易篮子或成分股聚合</td></tr>
              <tr><th scope="row">Options</th><td>高杠杆表达方向、波动率与尾部事件</td><td>非线性 premium、宽 spread、strike K（行权价）稀疏、IV（implied volatility，由期权价格反推的隐含波动率参数）混合</td><td>parity-implied forward 或独立 volatility target</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Hasbrouck 2003 的同一时期结果已经否定“期货天然领先”：S&P 500 与 Nasdaq-100 中 E-mini 的 IS 很高，而 MidCap 400 系统中 MDY ETF 却占主导。Madhavan–Sobczyk 还表明，在债券等底层报价陈旧时，ETF 可能比官方 NAV 更及时。Instrument 名称不决定 leader，制度与目标决定。<Cite n={14} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="venue-fragmentation">
        <p className="section-kicker">08 · 同一证券的多 Venue</p>
        <h2>即使 claim 完全相同，费用、参与者、队列、feed 与报告延迟也会让各 venue 暂时偏离并承担不同纠偏角色。</h2>
        <p>
          同一股票在多个交易所交易，是最接近“纯价格发现”的场景：无需估计分红或期权模型，长期价差应被套利限制。但订单路由会选择费用、maker–taker、队列位置、隐藏深度和速度；某些参与者只能访问部分场所。Consolidated quote 又是多个 feed 的聚合结果，不等于无延迟、无遗漏的统一市场。
        </p>
        <p>
          Harris 等用 1990 年 IBM 多场所交易并显式修正报告延迟，发现各市场存在双向纠偏；Hasbrouck 1995 用 30 只 Dow 股票的一秒报价估计 NYSE 当时的高信息份额。两项结果都属于历史制度，不能当作现代 venue 的常数，却清楚展示了：先处理时间戳与报告机制，再讨论贡献。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="latent-efficient-price">
        <p className="section-kicker">09 · 潜在有效价格不可直接看见</p>
        <h2>理论有效价格是所有相关信息被无摩擦吸收后的对象；现实 quote 还带反应延迟与平稳微观结构噪声。</h2>
        <div className="equation-card">
          <span>一个最小的 latent-price 教学模型</span>
          <div>v<sup>*</sup><sub>t</sub>=v<sup>*</sup><sub>t−1</sub>+η<sub>t</sub><br />p<sub>i,t</sub>=v<sup>*</sup><sub>t−δᵢ</sub>+u<sub>i,t</sub></div>
          <p>η 是不会快速消失的共同信息创新；δᵢ 是市场 i 的响应延迟；uᵢ 是 spread、tick、库存、离散报价等会回归的局部偏离。市场可以快而噪，也可以慢而平滑。</p>
        </div>
        <p>
          v* 无法直接观察。将某个市场、下一分钟 mid 或收盘价指定为真值，会预先把 leader 写进研究。状态空间与 common-factor 方法只能在假设下分离永久与暂时成分；Yan–Zivot 进一步说明传统 IS 与 CS 都可能同时混合信息速度和暂时噪声。<Cite n={3} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="common-stochastic-trend">
        <p className="section-kicker">10 · 统计共同趋势</p>
        <h2>Common price 是从多个观测价格中提取的共享、非均值回复路线；只有额外经济假设成立时，它才代理 latent efficient price。</h2>
        <div className="equation-card">
          <span>共同趋势加局部偏离</span>
          <div>p<sub>t</sub>=a+ℓm<sub>t</sub>+u<sub>t</sub>　；　u<sub>t</sub>≈I(0)</div>
          <p>p 是 n 个标准化 log prices 的向量，m 是统计 common stochastic trend，ℓ 是各价格对共同趋势的 loading；同单位、同 claim 时常标准化为全 1。u 是会回到有限范围的 venue-specific deviation。</p>
        </div>
        <p>
          这里的 m 不是简单平均，也不是 1.09 的“永久因果 impact”。若合约映射错误、系统有多条长期风险趋势，或局部偏离并不平稳，就不能把 m 解释为统一有效价值。Gonzalo–Granger 的永久—暂时分解给出一种统计构造，而不是无需假设的基本面发现。<Cite n={1} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="integration-stationarity">
        <p className="section-kicker">11 · Levels 漂移，Spread 可回归</p>
        <h2>价格水平常近似 I(1)，差分近似 I(0)；只有先确认 integration order，cointegration 与 VECM 才有正确语义。</h2>
        <p>
          Stationary 或 I(0) 表示均值、方差和依赖结构在研究窗内相对稳定，冲击不会让序列永久远离其范围。I(1) 表示 level 含一个随机趋势，一阶差分 Δp<sub>t</sub>=p<sub>t</sub>−p<sub>t−1</sub>近似 I(0)。两个 I(1) 价格可以高度相关，也可以偶然看起来同步；相关系数不检验它们的差价是否会回归。
        </p>
        <p>
          单位根与 rank 检验会受短样本、结构断点、期货换月、价格限制、确定性趋势和采样频率影响。若价格 levels 已经 I(0)，I(1) common-trend 语言不适用；若 integration order 不一致，强行 VECM 会生成伪长期关系。Engle–Granger 的贡献正是把长期约束和短期误差修正建立在明确阶数上。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="cointegration">
        <p className="section-kicker">12 · 分开漂移但不会无限分家</p>
        <h2>Cointegration 不是高相关，而是多个 I(1) 价格存在一个或多个 I(0) 线性组合。</h2>
        <div className="equation-card">
          <span>长期约束与 rank</span>
          <div>p<sub>i,t</sub>≈I(1)　；　β′p<sub>t</sub>−c≈I(0)</div>
          <p>β 给出 cointegrating relation，c 允许稳定常数差。若 n 个价格只共享一条 stochastic trend，独立长期约束数应为 rank r=n−1；r=0 留下 n 条趋势，不能分配一个统一 common price。</p>
        </div>
        <p>
          两市场同单位特例常用 β′=(1,−1)，于是 z<sub>t</sub>=p<sub>1,t</sub>−p<sub>2,t</sub>−c。Futures/spot 的 β 和 c 也可能随期限、carry 与 roll 改变；ETF/basket 还受费用、现金和篮子单位影响。看到 spread 回来只是候选证据，仍需正式 rank、残差稳定和结构断点审计。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="equilibrium-error">
        <p className="section-kicker">13 · Equilibrium Error 是纠偏压力</p>
        <h2>Cointegrating residual 描述相连价格相对长期关系的偏离；它不是扣除成本后可无风险实现的套利利润。</h2>
        <p>
          令 z<sub>t−1</sub>=β′p<sub>t−1</sub>−c。若二市场特例中 z&gt;0，市场 1 相对市场 2 和长期关系偏高。下一期可以由市场 1 下跌、市场 2 上涨或两者共同修复。偏离为何存在，可能来自 bid–ask、异步更新、库存、carry 估计、限价、闭市或真实交易成本带；z 并不是可以无限量、无延迟锁定的现金流。
        </p>
        <p>
          这一步把 price discovery 与 arbitrage 区分开。价格发现研究问谁承载长期创新、谁纠偏；套利研究还要证明买卖两侧可执行、规模足够、融资和借贷可得、现金流匹配。完整 cash-and-carry 和 ETF creation/redemption 因此留给后续章节。
        </p>
      </section>

      <section className="lesson-section" id="vecm">
        <p className="section-kicker">14 · VECM：长期约束与短期动态</p>
        <h2>Vector Error Correction Model 同时回答“谁修复长期偏离”和“短期变化怎样相互领先”，但系数本身不是结构因果。</h2>
        <div className="equation-card">
          <span>向量误差修正模型</span>
          <div>Δp<sub>t</sub>=α(β′p<sub>t−1</sub>−c)+Σ<sub>k=1</sub><sup>K−1</sup>Γ<sub>k</sub>Δp<sub>t−k</sub>+ν<sub>t</sub></div>
          <p>α 是各价格对 equilibrium error 的 adjustment loadings；β 固定长期关系；Γ 保存短期自身和跨市场 lag；ν 是给定这些历史后仍未预测到的 reduced-form innovation。</p>
        </div>
        <p>
          估计前要固定 deterministic terms（截距、确定性趋势、时段虚拟变量等非随机项）、lag order、采样频率和窗口；估计后检查残差自相关、rank 与参数稳定性。Harris 等用 VECM 研究信息相连证券市场，展示双向修复，但“某 α 不显著”最多说明该价格在所设模型中对该长期误差较弱响应，不证明经济信息从它单向因果产生。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="adjustment-loadings">
        <p className="section-kicker">15 · α：谁在纠偏</p>
        <h2>Adjustment loading 的绝对值越大，说明该价格越主动修复长期偏离；纠偏更多通常不是“发现更多”。</h2>
        <p>
          取 z=p<sub>F</sub>−p<sub>S</sub>=+10 bp，α<sub>F</sub>=−0.10、α<sub>S</sub>=+0.40，忽略 lag 和 innovation。则 futures 由长期误差触发 −1 bp 修正，spot 触发 +4 bp，偏离缩小到约 5 bp。Spot 承担更多 correction；futures 的 |α<sub>F</sub>| 点估计较小，只能说明它在此样本中纠偏较少。是否 weakly exogenous，必须在指定系统中检验 H<sub>0</sub>: α<sub>F</sub>=0。
        </p>
        <p>
          Weak exogeneity 是相对于 β 参数和指定系统的统计性质，不等于“从不受另一市场影响”。Γ 中仍可存在短期响应，公共新闻仍同时进入两边，换状态后 α 也会改变。Gonzalo–Granger component share 正是利用“谁较少纠偏”构造永久共同成分的价格权重。<Cite n={2} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="common-trend-representation">
        <p className="section-kicker">16 · 从 VECM 到共同创新</p>
        <h2>当系统只有一条共同趋势，每个 reduced-form innovation 经过未来所有纠偏后，只有一个线性组合留在长期路线中。</h2>
        <div className="equation-card">
          <span>长期 impact 与 common-price innovation</span>
          <div>Ψ(1)=ℓψ′　；　Δm<sub>t</sub>=ψ′ν<sub>t</sub></div>
          <p>Ψ(1) 是 VECM 的长期 impact matrix；ℓ 把唯一共同趋势装载到各价格，ψ 把当期 reduced-form innovations 映射成不会均值回复的共同创新。Normalization 改变 ψ 的数值表示，但不能改变完整系统的长期方差。</p>
        </div>
        <p>
          ψ 依赖 α、β、Γ 和系统 normalization，不是某个单期回归斜率。Hasbrouck 用它把各市场 innovation 对共同长期价格的贡献连接起来；Baillie 等进一步比较 common-factor 与 IS/CS 指标的关系。<Cite n={3} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="innovation-covariance">
        <p className="section-kicker">17 · 方差里还有共同项</p>
        <h2>两个市场在同一采样桶里共同响应新闻时，common innovation variance 含 covariance cross-term，而这部分没有天然主人。</h2>
        <div className="equation-card">
          <span>共同创新方差</span>
          <div>Σ=Var(ν<sub>t</sub>)<br />Var(Δm<sub>t</sub>)=ψ′Σψ=Σ<sub>i</sub>ψ<sub>i</sub><sup>2</sup>σ<sub>ii</sub>+2Σ<sub>i&lt;j</sub>ψ<sub>i</sub>ψ<sub>j</sub>σ<sub>ij</sub></div>
          <p>Variance 描述单一 innovation 的离散程度；covariance 描述两者是否同刻共同偏离。若 σᵢⱼ≠0，交叉项不能靠原始数据唯一分给 i 或 j。</p>
        </div>
        <p>
          同期相关可能来自同一公共新闻，也可能是采样太粗、区间内跨市场传导已经完成，或时钟对齐不足。将 Σ 强行看成 diagonal 会制造精确却错误的份额；承认相关并报告 ordering bounds，是 Hasbrouck 方法的识别纪律。<Cite n={3} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="hasbrouck-is">
        <p className="section-kicker">18 · Hasbrouck Information Share</p>
        <h2>IS 分配的是 reduced-form innovation 对共同长期价格创新方差的贡献，不是信息内容、知情身份或因果来源的直接比例。</h2>
        <p>
          若 Σ 为 diagonal，各市场 innovation 彼此不相关，贡献可唯一相加：
        </p>
        <div className="equation-card">
          <span>不相关 innovations 下的 IS</span>
          <div>IS<sub>i</sub>=ψ<sub>i</sub><sup>2</sup>σ<sub>ii</sub> / (ψ′Σψ)</div>
          <p>ψᵢ 衡量该 innovation 留在长期共同路线中的 loading，σᵢᵢ 衡量它自身方差；平方乘方差后再除以总共同创新方差。所有份额加总为 1。</p>
        </div>
        <p>
          Hasbrouck 1995 在多 venue 同一证券中提出这一解释框架。数值高表示在所选 VECM、采样、价格口径与 innovation 分解下，该市场意外变化解释较多长期共同方差；它不表示同等比例的新闻由该场所产生。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="is-diagonal-example">
        <p className="section-kicker">19 · Diagonal Σ 的唯一分配</p>
        <h2>只有当 contemporaneous innovations 不相关时，IS 才无需正交化顺序而成为唯一点估计。</h2>
        <p>
          取 ψ=(0.8,0.2)′，Σ=diag(1,4)。市场 1 的贡献为 0.8²×1=0.64；市场 2 虽然长期 loading 小，却有四倍 innovation variance，贡献为 0.2²×4=0.16。总共同方差为 0.80，所以 IS=(80%,20%)。
        </p>
        <div className="equation-card">
          <span>不能只归一化 ψ</span>
          <div>0.64 / (0.64+0.16)=0.80　；　0.16 / 0.80=0.20</div>
          <p>若只平方 ψ，会得到约 94%/6%，错误遗漏第二市场的更大创新方差。IS 同时读取长期 loading 和 shock scale。</p>
        </div>
        <p>
          Diagonal 条件在高频共同新闻下并不常见。它是理解公式的透明基准，不是应当通过预处理强行制造的现实事实。Baillie 等展示了 residual correlation 如何让 IS 与 common-factor weights 分离。<Cite n={3} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="is-ordering-bounds">
        <p className="section-kicker">20 · 相关创新只能给区间</p>
        <h2>当 reduced-form innovations 同期相关，Cholesky 顺序决定把共同变化先归给谁；完整报告应保留所有合理排序形成的 bounds。</h2>
        <div className="equation-card">
          <span>给定排序的正交化 IS</span>
          <div>Σ=MM′　；　IS<sub>j</sub><sup>(order)</sup>=([ψ′M]<sub>j</sub>)<sup>2</sup> / (ψ′Σψ)</div>
          <p>M 将相关 innovations 重写成一组不相关的人工 shocks。排在前面的变量会先吸收 contemporaneous covariance；这个统计排序不是经济世界天然给出的事件顺序。</p>
        </div>
        <p>
          取 ψ=(0.5,0.5)′，Σ=[[1,0.8],[0.8,1]]，总共同方差为 0.9。市场 1 排前时，M=[[1,0],[0.8,0.6]]，ψ′M=(0.9,0.3)，平方后份额为 90%/10%；反向排序交换二者。于是每个市场的 IS bounds 都是 10%–90%。报告中点 50% 可以压缩表格，却不能消除 80% 的识别宽度。<Cite n={3} /><Cite n={5} />
        </p>
        <aside className="precision-note">
          <span>Bounds 不是普通置信区间</span>
          <p>抽样不确定性会再产生标准误或置信区间；ordering bounds 来自 contemporaneous covariance 的归属未被结构识别。增加样本可能缩小标准误，却不会自动决定共同 shock 属于哪个市场。</p>
        </aside>
      </section>

      <section className="lesson-section" id="gg-decomposition">
        <p className="section-kicker">21 · Gonzalo–Granger 永久—暂时分解</p>
        <h2>GG 从“哪些价格不响应 equilibrium error”构造共同永久成分，而不是把 innovation variance 正交分配给市场。</h2>
        <p>
          一个 common trend 时，寻找 α 的正交补 α<sub>⊥</sub>，使 α′α<sub>⊥</sub>=0。再按共同 loading ℓ 标准化，γ=α<sub>⊥</sub>/(α<sub>⊥</sub>′ℓ)，得到 m<sub>t</sub><sup>GG</sup>=γ′p<sub>t</sub>。直观上，若某个价格几乎不对长期偏离纠错，它在永久共同成分中的权重更高；承担修复的价格更像追随者。
        </p>
        <div className="equation-card">
          <span>GG common factor</span>
          <div>α′α<sub>⊥</sub>=0　；　γ=α<sub>⊥</sub>/(α<sub>⊥</sub>′ℓ)<br />m<sub>t</sub><sup>GG</sup>=γ′p<sub>t</sub></div>
          <p>γ′ℓ=1 保证共同趋势的单位被正确归一化。γ 是 price-level combination，不读取 innovation covariance，因此不回答 IS 的方差贡献问题。</p>
        </div>
        <p>
          Gonzalo–Granger 原论文估计的是 cointegrated systems 的 common long-memory components，并非为市场贴“信息百分比”标签。将 γ 解释为 discovery component share 需要合约可比、唯一共同趋势和稳定 error-correction 结构。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="gg-component-share">
        <p className="section-kicker">22 · Component Share</p>
        <h2>二市场 CS 的权重由对方的 adjustment loading 决定：谁较少纠偏，谁更进入共同价格水平。</h2>
        <div className="equation-card">
          <span>二市场、ℓ=(1,1)′、β′=(1,−1)</span>
          <div>CS<sub>1</sub>=α<sub>2</sub>/(α<sub>2</sub>−α<sub>1</sub>)　；　CS<sub>2</sub>=−α<sub>1</sub>/(α<sub>2</sub>−α<sub>1</sub>)</div>
          <p>取 α₁=−0.10、α₂=+0.40，CS₁=.40/.50=.80，CS₂=.10/.50=.20。市场 2 纠偏更多，所以市场 1 的 permanent-component weight 更高。</p>
        </div>
        <p>
          CS 加总为 1，但不必总落在 0–1；若 adjustment signs 与简单纠偏直觉不一致，权重可能为负或超过 1。此时不能强行当概率，应先检查 β normalization、短期动态、样本稳定和模型错设。Baillie 等强调 CS 与 IS 在 residual correlation、noise 和速度不同的系统中可以系统分离。<Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="is-vs-cs">
        <p className="section-kicker">23 · IS、CS 与 Information Leadership</p>
        <h2>CS 衡量共同价格水平权重，IS 衡量共同创新方差贡献；ILS 再尝试分离速度与噪声，但也依赖更窄的结构。</h2>
        <div className="table-scroll" role="region" aria-label="IS CS ILS 比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>三个指标不能相互冒充</caption>
            <thead><tr><th scope="col">指标</th><th scope="col">主要输入</th><th scope="col">回答什么</th><th scope="col">关键边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">CS</th><td>α 与 common loading</td><td>各 price level 进入 GG permanent factor 的权重</td><td>可能混合速度与暂时噪声</td></tr>
              <tr><th scope="row">IS</th><td>长期 ψ 与 innovation Σ</td><td>共同长期 innovation variance 的分配</td><td>相关残差产生 ordering bounds</td></tr>
              <tr><th scope="row">ILS</th><td>IS ratio 与反向 CS ratio</td><td>在特定模型中校正相对噪声后的 leadership</td><td>二市场理论、零/负 CS 与宽 bounds 时不稳定</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>Putniņš 的二市场 information leadership</span>
          <div>IL<sub>1</sub>=|(IS<sub>1</sub>/IS<sub>2</sub>)(CS<sub>2</sub>/CS<sub>1</sub>)|<br />IL<sub>2</sub>=|(IS<sub>2</sub>/IS<sub>1</sub>)(CS<sub>1</sub>/CS<sub>2</sub>)|<br />ILS<sub>i</sub>=IL<sub>i</sub>/(IL<sub>1</sub>+IL<sub>2</sub>)</div>
          <p>若 IS=(.5,.5)、CS=(.8,.2)，则 IL₁=.25、IL₂=4，ILS≈5.88%/94.12%。在该识别框架里，market 1 的高 CS 被解释为更少暂时噪声，而非更快吸收永久创新。</p>
        </div>
        <p>
          Yan–Zivot 说明 IS 与 CS 都可能混合信息速度和 noise；Putniņš 用模拟提出 ILS 改善区分，但没有证明它对任意多市场、任意数据生成过程都是真值。可靠报告应并列 IS bounds、CS、ILS、采样与噪声诊断，不把它们平均成一个看似精确的冠军分数。<Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="lead-lag">
        <p className="section-kicker">24 · “先动”只是时间矩</p>
        <h2>Lead–lag 说明一个序列当前变化与另一个序列未来变化相关；它不自动等于共同长期创新，更不等于经济因果传导。</h2>
        <div className="equation-card">
          <span>一个最小 timing statistic</span>
          <div>ρ<sub>i→j</sub>(h)=Corr(Δp<sub>i,t</sub>,Δp<sub>j,t+h</sub>)　, h&gt;0</div>
          <p>ρ&gt;0 表示 i 当前变化与 j 在 h 之后的变化同向。它可能因为 i 更快，也可能因为 j 交易稀疏、报价粘滞、时钟错位或两个市场共同面对持续新闻。</p>
        </div>
        <p>
          Stoll–Whaley 与 Chan 的历史五分钟股指结果常发现期货领先现金，但两者都面对成分股非同步成交与指数陈旧问题；Chan 对现金指数收益的 infrequent / non-synchronous trading 作修正后仍发现期货领先，并把成分股同向运动更强时的结果与市场整体信息联系起来。安全结论是历史制度下的条件预测领先，而不是期货的永恒信息主权。<Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="clocks-staleness">
        <p className="section-kicker">25 · 时钟可以制造 Leader</p>
        <h2>Exchange event time、feed receive time、calendar grid 和 refresh time 对齐不同；carried-forward 旧价会机械制造领先。</h2>
        <p>
          假设 A 在真实时点 0 从 100 更新到 101，B 也立即改变意愿，却因交易稀疏或 feed 延迟到 2 秒才显示 101。用一秒 previous-tick sampling，B 在前两个格子都被填为旧价 100，A 自动“领先两秒”。研究者观察的时间等于交易所生成时间、传输、聚合与接收延迟之和；只看本机到达时点无法分开这些部分。
        </p>
        <p>
          Refresh-time sampling（刷新时钟采样）会等到每条序列自上个同步点后都至少出现一次新观测，再形成下一组同步向量；它减少 previous-tick 的陈旧价，却也改变实际采样时点。Harris 等已在早期多场所研究中显式校正报告延迟；Lee–Ready 也说明成交与报价记录顺序会改变交易方向推断。现代研究仍需比较 exchange timestamp、交易所 direct feed（直接行情源）与 SIP（Securities Information Processor，综合行情源）、previous-tick、refresh-time 和多个网格，并做人工时间位移 placebo。时间戳分辨率高不等于经济时钟准确。<Cite n={2} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="event-time-news">
        <p className="section-kicker">26 · 围绕同一新闻重新对齐</p>
        <h2>预先确定的公共事件让所有市场共享一个 τ，但仍要同时测 first reaction、累计吸收和事后反转。</h2>
        <div className="equation-card">
          <span>事件时点后的累计 response</span>
          <div>R<sub>i</sub>(h;τ)=p<sub>i</sub>(τ+h)−p<sub>i</sub>(τ<sup>−</sup>)</div>
          <p>τ⁻ 是新闻前的同步基准，h 是多个预注册期限。第一笔变化最早回答速度；最终靠近新平台回答吸收；先跳后反转可能只是噪声或流动性过冲。</p>
        </div>
        <p>
          公告研究要用 exchange time、同一可比价格、共同交易时段，并报告 quote 与可执行 sides、深度和 stale filters。Fleming 等的跨工具结果表明市场整体信息与公司特定信息可能选择不同接口；事件类型必须成为分层变量，而不是把所有新闻混成平均路径。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="common-shock-vs-transmission">
        <p className="section-kicker">27 · Common Shock ≠ A→B Transmission</p>
        <h2>A 先变化、B 后变化可以由共同新闻和不同反应速度生成；要声称传导，还需隔离只改变 A 的可信 variation。</h2>
        <p>
          公共宏观新闻同时进入所有参与者信息集，A 的低 latency 让其报价先更新，B 的成本或闭市让其晚更新。观察顺序并不说明 B 因为看见 A 才变化；即使套利者确实从 A 向 B 搬运信息，同一新闻仍是共同原因。VECM innovation、lead–lag 与 IS 都描述联合分布，不能单独区分“共同响应”与“经 A 传输”。
        </p>
        <p>
          更强设计需要只改变 A 的接入、规则或交易能力，且不通过其他渠道直接改变 B，并检查预趋势、并发新闻与参与者替代。部分重叠交易时段研究还显示，overlap-only 与 full-day 的份额会不同：闭市市场无法更新，日历日贡献和共同开盘竞争不是同一 estimand。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="options-target">
        <p className="section-kicker">28 · 期权究竟发现什么</p>
        <h2>Raw option premium 同时编码方向、波动率、期限和利率；只有先重定义 target，才能与 spot 做价格发现比较。</h2>
        <p>
          单只 call 上涨可能因为标的上涨，也可能因为 implied volatility 或尾部需求上升。若有同步、同 strike K（行权价）、同 maturity T（到期日）的 European call C 与 put P，put–call parity 可构造 implied forward：
        </p>
        <div className="equation-card">
          <span>European parity-implied forward</span>
          <div>F<sub>t,T</sub><sup>impl</sup>=K+e<sup>r(T−t)</sup>(C<sub>t</sub>−P<sub>t</sub>)</div>
          <p>这是由 C−P=e<sup>−r(T−t)</sup>(F−K) 重排得到的方向性 target。必须匹配 K/T、同步可执行 sides，并给定贴现因子和 European 合约约定；若再把 forward 映射为 spot-equivalent，才另外需要分红/carry 假设。美式提前行权与借券约束需要额外修正。</p>
        </div>
        <p>
          早期 Manaster–Rendleman 用日度 call 反演发现预测力，但非同步收盘与模型误差是边界；Chan–Chung–Johnson 证明，改用 quote midpoint 后，成交价数据中的股票领先期权可以消失。Muravyev 等用可执行股票与 parity-implied option quotes，发现多数主要分歧由股票移动触发、期权随后纠偏。正确结论不是“期权无信息”，而是方向、波动率与预测/结构份额必须分开。<Cite n={20} /><Cite n={22} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="state-dependence">
        <p className="section-kicker">29 · Leader 随状态切换</p>
        <h2>交易时段、新闻类型、波动、限制、底层流动性和技术制度改变信息路由，price-discovery share 不是常参数。</h2>
        <p>
          Cash 闭市时，futures 或 ETF 可能是唯一实时接口；共同开盘后，直接篮子与个股恢复竞争。境外或债券 ETF 面对陈旧 NAV 时可能发现公允价值，国内流动股票 ETF 同时开盘时却常由篮子带动。价格限制、停牌、卖空禁令、到期换月、开收盘 auction、宏观公告和压力状态都会改变 α、Σ 与 lead–lag。
        </p>
        <p>
          Hasbrouck 2003 的 E-mini 与 MDY 对比、Dimpfl–Schweikert 的 overlap/full-day 差异、Madhavan–Sobczyk 的底层流动性分层，都说明“谁领先”必须带状态。模型应滚动估计或预先分段，并报告参数断点；全样本 70% 可能只是某个高成交时段占比更大。<Cite n={14} /><Cite n={15} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="identification-ladder">
        <p className="section-kicker">30 · 描述、分解与因果</p>
        <h2>越往“信息起源”靠近，所需假设越强；更复杂的 metric 不会自动跨越证据等级。</h2>
        <div className="table-scroll" role="region" aria-label="价格发现识别阶梯，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>证据能停在哪里</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">典型方法</th><th scope="col">支持什么</th><th scope="col">不能自动支持</th></tr></thead>
            <tbody>
              <tr><th scope="row">First response</th><td>事件时间、首个 quote/trade</td><td>给定时钟下谁先可见变化</td><td>永久吸收或因果传导</td></tr>
              <tr><th scope="row">Conditional timing</th><td>lead–lag / Granger prediction</td><td>谁的过去改善另一方预测</td><td>经济因果与共同趋势贡献</td></tr>
              <tr><th scope="row">Common-factor decomposition</th><td>VECM、CS、IS bounds、ILS</td><td>在模型下的纠偏、水平权重与方差份额</td><td>信息由哪个主体或新闻创造</td></tr>
              <tr><th scope="row">Event attribution</th><td>明确新闻、同步多市场 response</td><td>某类事件下的条件吸收速度</td><td>A→B 而非共同 shock</td></tr>
              <tr><th scope="row">Local causal design</th><td>规则/接入变化、准实验或随机化</td><td>在排除限制下的局部传导效应</td><td>跨制度、时段和资产无条件外推</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Yan–Zivot 与 Putniņš 的工作不是说传统指标无用，而是精确说明它们同时读取速度与 noise 的条件。模型分解应被当作证据坐标，而不是事实终点；下一层结论必须由新的 variation 与反事实设计支持。<Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">31 · 经典证据地图</p>
        <h2>期货、ETF 与期权文献给出的是制度—样本—方法条件下的结果；彼此冲突往往来自对象和测量不同。</h2>
        <div className="table-scroll" role="region" aria-label="跨市场价格发现证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>不能把不同样本拼成无条件冠军榜</caption>
            <thead><tr><th scope="col">来源与样本</th><th scope="col">主要发现</th><th scope="col">写作边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Garbade–Silber 1983，多类商品</th><td>多数商品期货较强，现金也有反馈</td><td>不能直接外推电子股指与现代交易制度</td></tr>
              <tr><th scope="row">Stoll–Whaley 1990；Chan 1992</th><td>历史五分钟股指期货通常预测领先 cash</td><td>现金指数陈旧与成分股异步必须审计</td></tr>
              <tr><th scope="row">Chu–Hsieh–Tse 1999</th><td>S&amp;P futures 近似弱外生，SPDR/cash 纠偏</td><td>旧制度、官方指数与可执行篮子不同</td></tr>
              <tr><th scope="row">Hasbrouck 2003</th><td>E-mini 在两大指数约 86%–89% IS；MDY 在 MidCap 约 66%–68%</td><td>说明最优接口依产品设计，不是期货定律</td></tr>
              <tr><th scope="row">Madhavan–Sobczyk 2016</th><td>底层陈旧时 ETF 可比 NAV 更及时</td><td>状态空间模型、作者与资产类型需披露</td></tr>
              <tr><th scope="row">Box et al. 2021</th><td>美国国内股票 ETF 同开时通常由篮子带动</td><td>不外推债券、境外或底层闭市 ETF</td></tr>
              <tr><th scope="row">Stephan–Whaley 1990；Chan et al. 1993</th><td>成交价显示股票领先；quote midpoint 后领先消失</td><td>价格口径可改变结论</td></tr>
              <tr><th scope="row">Chakravarty et al. 2004</th><td>修改 Hasbrouck 方法下 options 平均约 17%</td><td>1988–1992、隐含股票价构造与旧市场制度</td></tr>
              <tr><th scope="row">Muravyev et al. 2013；Patel et al. 2020</th><td>可执行报价下股票通常领先；ILS/ILI 又提高部分期权 leadership</td><td>指标、筛选样本与目标不同，不能拼成同一百分比</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Garbade–Silber、Chu 等和 Hasbrouck 共同展示了从简单价格移动到 cointegration/IS 的方法演化；ETF 证据还提醒一级市场套利与分钟级调整方向不是一回事。Ben-David 等发现 ETF 持有可影响成分股中低频波动和反转，这与 Box 的分钟级篮子领导并不矛盾，因为 estimand 与尺度不同。<Cite n={9} /><Cite n={13} /><Cite n={14} /><Cite n={17} /><Cite n={18} /><Cite n={19} /><Cite n={21} /><Cite n={23} /><Cite n={24} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="data-estimation">
        <p className="section-kicker">32 · 数据协议先于份额</p>
        <h2>Price-discovery metric 的可信度由合约映射、可执行价格、时钟、rank、lag 和稳定性共同决定，而不是由采样频率单独决定。</h2>
        <div className="table-scroll" role="region" aria-label="价格发现数据估计协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>拟合前必须冻结的最小协议</caption>
            <thead><tr><th scope="col">模块</th><th scope="col">必须记录</th><th scope="col">常见失败</th></tr></thead>
            <tbody>
              <tr><th scope="row">Economic mapping</th><td>multiplier、currency、basket、carry、K/T、roll 与当时可得输入</td><td>用日后数据回填或比较不同 claim</td></tr>
              <tr><th scope="row">Price object</th><td>bid/ask、mid、trade、depth、official index 或 executable basket</td><td>成交 bounce、微小 stale quote 或不可交易指数冒充价格</td></tr>
              <tr><th scope="row">Clock</th><td>exchange/receive time、SIP/direct、grid、previous-tick、refresh time</td><td>feed latency 被写成经济领先</td></tr>
              <tr><th scope="row">Sample state</th><td>overlap hours、closed market、auction、halt、limit、news 与 regime</td><td>把无法更新的市场判为永久 follower</td></tr>
              <tr><th scope="row">Time-series model</th><td>I(0)/I(1)、rank、deterministic terms、lag、window、residual tests</td><td>结构断点、serial correlation 和 rank 错设</td></tr>
              <tr><th scope="row">Robustness</th><td>IS all orderings、CS/ILS、multiple grids、quote/trade、placebo shifts</td><td>只报告一个排序、频率或最漂亮指标</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          过细频率增加零回报、tick 和 quote flicker；过粗频率把区间内已完成的传播压成同期 covariance。Lee–Ready 的五秒修正属于历史报告机制，不是现代固定规则；部分重叠时段还需明确 overlap 与 full-day estimand。数据协议不是附录，而是决定 leader 的生成机制。<Cite n={8} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先在模型内部算对 correction、IS 与 CS，再判断时间路径最多支持到哪一层。</h2>
        <p>
          第一组从 cointegration 候选、VECM correction、diagonal IS 和 GG CS 开始；第二组转向 correlated innovations、异步 feed、期权 target 与 cash closed。每题提交前只显示事实与候选结论，作答后才揭示计算和识别边界。
        </p>
        <PriceDiscoveryLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 非蕴含反例库</p>
        <h2>First、volume、volatility、IS 或 CS 任一项都可以很高，却仍不足以单独证明该市场“发现了更多基本面信息”。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>先动但立即反转</h3><p>薄市场一档 quote flicker 最先跳动，随后撤回；速度快，却没有进入共同长期成分。</p></article>
          <article><span>反例 02</span><h3>慢但平滑</h3><p>市场 B 更新频率低、noise 小，CS 高；它可能只是少纠偏，不是先吸收创新。</p></article>
          <article><span>反例 03</span><h3>高 volume、低 discovery</h3><p>大量被动换手围绕陈旧 price 发生，成交量高却没有新共同 innovation。</p></article>
          <article><span>反例 04</span><h3>ETF “溢价”是 fair value</h3><p>境外底层闭市、公共新闻后 ETF 报 102、昨日 NAV 仍 100；偏离可能是实时发现而非错价。<Cite n={17} /></p></article>
          <article><span>反例 05</span><h3>期权 premium 先涨</h3><p>IV 同时跳升且缺少匹配 put；不能据 raw call 推出 spot direction 先被发现。</p></article>
          <article><span>反例 06</span><h3>IS 高、bounds 也极宽</h3><p>选择一个 Cholesky 排序得到 90%，反向只剩 10%；点数是 normalization，不是唯一归属。</p></article>
        </div>
        <p>
          Box 等的国内股票 ETF 结果也提供尺度反例：分钟级篮子通常带动 ETF，创建赎回存在却不保证 ETF 订单流先推动成分股。当 authorized participant（获准参与创建赎回的机构）、融资、借券和底层交易均可执行时，creation/redemption 通常会约束可交易偏离，却不保证任意状态下存在硬边界；调整方向仍由信息、流动性与当时可交易性决定。<Cite n={16} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 可证伪 Price-Discovery 研究</p>
        <h2>把“期货领先现货”改写成一套会因对象、时钟、状态或指标失效而被推翻的协议。</h2>
        <p>
          一个局部问题可以写成：对某指数的近月 futures、ETF 与可执行 basket，在两者共同开盘且无 roll/auction/limit 的窗口，用当时可得 carry 对齐 log prices；在 100 ms、1 s 与 1 min 三种网格和 refresh-time 下检验 rank=2 的单一 common trend；滚动估计 VECM，报告 α、CS、全部 IS orderings/ bounds、ILS 与公告事件 response；比较更晚日期和高/低波动状态。结论只覆盖所定义 exposure、hours、clock 和 metric。
        </p>
        <div className="table-scroll" role="region" aria-label="价格发现可证伪研究协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>研究结束前不能悄悄更换的对象</caption>
            <thead><tr><th scope="col">模块</th><th scope="col">预注册</th><th scope="col">失败条件</th></tr></thead>
            <tbody>
              <tr><th scope="row">Claim</th><td>经济 exposure、映射函数与实时可得 inputs</td><td>换 mapping 才出现 cointegration</td></tr>
              <tr><th scope="row">State</th><td>overlap/closed、news、volatility、limit 与 roll</td><td>领导只由某市场无法交易生成</td></tr>
              <tr><th scope="row">Clock</th><td>exchange time、feed、grid 与 refresh rule</td><td>换延迟或网格即反转</td></tr>
              <tr><th scope="row">Model</th><td>rank、lag、deterministic terms、window 与 residual tests</td><td>rank/参数在样本外不稳定</td></tr>
              <tr><th scope="row">Metrics</th><td>first response、CS、IS bounds、ILS 各自 estimand</td><td>只挑支持叙事的一个指标</td></tr>
              <tr><th scope="row">Placebos</th><td>time shifts、伪事件、non-linked asset、quote/trade 切换</td><td>伪时点和不相关市场同样“领先”</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          若要升级到 A→B 因果传导，还需可信地只改变 A 的接入或交易规则，并证明没有共同新闻和直接 B 通道。即使设计成立，参与者路由会随规则改变，估计仍是局部均衡效应。价格发现的开放 world model 可以复杂，具体研究必须把这一复杂性压缩成可观察失败条件。
        </p>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>先独立完成经济对齐、VECM、IS bounds 与事件审计，再展开答案。</h2>
        <div className="exercise-list">
          <article className="practice-problem">
            <span>练习一 · 可比性门禁</span>
            <p><strong>题目。</strong>你有 index futures、同指数 ETF、官方 cash index 和一只近月 call 的 raw prices。哪些可以直接进入同一 VECM？分别还需补什么转换或替代对象？</p>
            <details className="practice-answer"><summary>展开参考答案</summary><p>四个 raw prices 都不应直接塞入。Futures 要按期限、融资与分红换成 spot-equivalent，并处理 roll；ETF 要按每份篮子、现金/费用和货币对齐；官方 index 需判断是否同步可交易，最好构造可执行 basket 或明确它只是计算值；单只 call 同时含方向与 volatility，需用同步同 K/T 的 call/put 构造 parity-implied forward，或把研究 target 改成 volatility discovery。所有输入必须在当时可得。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习二 · VECM Correction 与 GG CS</span>
            <p><strong>题目。</strong>二市场 z=p₁−p₂=+8 bp，α₁=−0.15、α₂=+0.45，短期 lag 和 innovation 为零。计算下一步 corrections 与 CS，并解释谁承担更多纠偏。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>Δp₁=−.15×8=−1.2 bp；Δp₂=.45×8=+3.6 bp，偏离约缩到 3.2 bp。CS₁=.45/[.45−(−.15)]=.45/.60=.75；CS₂=.15/.60=.25。Market 2 当期纠偏更大，market 1 在 GG common component 中权重更高；这不等于 75% 的新闻经济来源。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习三 · Diagonal IS 的反直觉打平</span>
            <p><strong>题目。</strong>ψ=(.6,.4)′，Σ=diag(1,2.25)。计算两个 innovation 对共同方差的贡献、总方差和 IS。为什么 ψ₁更大却没有更高 IS？</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>市场 1 贡献=.6²×1=.36；市场 2 贡献=.4²×2.25=.16×2.25=.36；总共同方差=.72，IS=50%/50%。第二市场较大的 innovation variance 恰好抵消较小长期 loading。IS 读取 ψ²与 shock variance 的乘积。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习四 · Correlated IS Bounds</span>
            <p><strong>题目。</strong>ψ=(.5,.5)′，Σ=[[1,.8],[.8,1]]。复算两个 Cholesky orderings 的 IS；解释为什么用 bounds 中点 50% 不等于识别出真实份额。</p>
            <details className="practice-answer"><summary>展开分步答案</summary><p>总方差=.25+.40+.25=.90。顺序 1→2 的 L=[[1,0],[.8,.6]]，ψ′L=(.9,.3)，平方为 .81/.09，所以 90%/10%；反向排序交换份额。每个市场 bounds 为 [10%,90%]。中点 50% 只是区间摘要，未说明 covariance cross-term 的经济主人；标准误再小也不会消除这个结构未识别。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习五 · 公共新闻事件协议</span>
            <p><strong>题目。</strong>公共数据发布后，futures feed 先 ETF feed 2 ms 更新，但两条 receive latency 不同，ETF 有一次短暂停牌且 quotes 异步。写出最低可信的 timing study，并限定结论。</p>
            <details className="practice-answer"><summary>展开参考答案</summary><p>预先固定官方 τ；使用 exchange timestamps 与同步可比的 futures spot-equivalent/ETF price；分别报告 direct 与 consolidated feed，审计 latency；设置多个 h 的 first/cumulative response；剔除或单独分析 halt；用 previous-tick 与 refresh-time、多个 grids、quote midpoint 与 executable sides 做稳健性；设置伪事件和人工 time-shift。没有只改变某一市场的外生 variation，结论最多是该时钟和状态下的 timing response，不能称 A→B causal transmission。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>答案应说明对象、机制与不能推出的结论；单报一个指标名称不算掌握。</h2>
        <div className="check-grid">
          <details><summary>01 · First move、persistent common innovation 与 causal transmission 为什么是三个问题？</summary><p>它们分别描述给定时钟下的时间顺序、经过纠偏后仍留在共同趋势中的统计创新，以及移除 A 变化后的反事实 B 路径。前一层成立不会自动推出后一层。</p></details>
          <details><summary>02 · Latent efficient price 与 estimated common price 有什么不同？</summary><p>前者是相关信息无摩擦吸收后的理论对象，不可直接观察；后者是模型从多个价格提取的统计因子，只有 claim 对齐、共同趋势唯一和局部偏离平稳等假设下才可代理前者。</p></details>
          <details><summary>03 · 高 correlation 为什么不等于 cointegration？</summary><p>Correlation 衡量共同变化强弱；cointegration 要求各 level 的 integration order 合适，且某个线性组合为 stationary。两个随机趋势也能在有限样本高度相关。</p></details>
          <details><summary>04 · n 个价格只有一个 common trend 时，为什么 rank 应为 n−1？</summary><p>n−1 个独立长期约束消除 n 个价格中的 n−1 个漂移方向，只留下一个共享随机趋势；rank 0 则留下 n 条独立趋势。</p></details>
          <details><summary>05 · αᵢ≈0 最多说明什么？</summary><p>点估计只显示该价格在指定 VECM 中较少响应所选 cointegrating error；只有在该系统中检验 H₀: αᵢ=0 后，才可讨论 weak exogeneity。它仍可在短期 Γ 中响应，也不证明信息从它因果起源。</p></details>
          <details><summary>06 · Correlated innovations 下 IS 为什么不唯一？</summary><p>共同创新方差含 covariance cross-term，reduced-form 数据没有给这部分天然主人；Cholesky 顺序把共同项先分给不同市场，所以应报告 bounds。</p></details>
          <details><summary>07 · GG CS 与 Hasbrouck IS 分别回答什么？</summary><p>CS 是观测 price levels 进入 GG permanent factor 的权重，来自 adjustment loadings；IS 是 reduced-form innovations 对共同长期 innovation variance 的分配，读取 ψ 和 Σ。</p></details>
          <details><summary>08 · 一个市场 IS 高但 first reaction 经常反转，应怎样解释？</summary><p>先检查采样、noise、rank 和窗口稳定性；first speed、短时过冲和长期方差贡献可以不同。单一 IS 不能替代事件路径或因果识别。</p></details>
          <details><summary>09 · Raw option price 为什么不能与 spot 排同一方向性 discovery 榜？</summary><p>Option premium 同时编码方向、volatility、期限和利率；方向比较需匹配 K/T 的 call/put 构造 implied forward，或把目标明确改成 volatility/tail discovery。</p></details>
          <details><summary>10 · 怎样区分 common news 与 A→B transmission？</summary><p>时间先后不足；需控制共同事件，并找到只改变 A、且不通过其他渠道直接影响 B 的可信 variation，再验证预趋势、并发冲击和参与者替代。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节建立多个价格共享长期创新的测量语言；后续章节再分别打开做市主体、ETF 套利、期货 basis 与广义跨市场传导。</h2>
        <div className="interface-grid">
          <article><span>← 1.08–1.10</span><h3>Flow、Impact、Adverse Selection</h3><p>前置章节解释单一市场中交易和后验；本节把已进入价格的创新放进多 instrument / venue 系统。</p></article>
          <article><span>→ 1.12</span><h3>Market Maker 为什么存在</h3><p>把抽象价格接口换成具体流动性提供者，研究其收入、义务、信息、库存与技术风险。</p></article>
          <article><span>→ 1.21–1.22</span><h3>ETF 与 Futures Arbitrage</h3><p>完整展开 creation/redemption、NAV、basis、carry、融资、分红和可执行套利带。</p></article>
          <article><span>→ 4.12</span><h3>Cross-market Lead–Lag</h3><p>扩展到不同资产、国家、时区与风险因子，研究预测、spillover、网络与更强因果设计。</p></article>
        </div>
        <p className="closing-thesis">面对“谁在发现价格”，应依次追问：价格是否代表同一经济 claim；转换是否只用当时信息；交易时段和时钟是否可比；levels 是否 I(1)、rank 是否支持一条 common trend；谁在 α 中纠偏；ψ 与 Σ 怎样形成 IS，correlated innovations 的 bounds 多宽；CS、IS、ILS 与 first response 是否回答同一问题；NAV、official index、options premium 或 carried-forward quote 是否陈旧；公共新闻能否与 A→B transmission 分开。只有这些门禁通过，份额才是可解释的统计证据，而不是精确包装的市场神话。</p>
      </section>
    </>
  );
}

export const lesson111: LessonRecord = {
  slug: '1-11',
  id: '1.11',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Price Discovery：信息在哪里先进入价格',
  subtitle: '从潜在有效价格与共同随机趋势出发，用 cointegration、VECM、Hasbrouck information share、Gonzalo–Granger component share 和严格事件时钟区分“先动”“纠偏”“贡献长期创新”与“因果传导”',
  readingTime: '约 90–95 分钟（核心阅读 57–59＋互动 13–14＋主动练习 12–13＋理解检查 7–8＋课程接口 1）',
  prerequisite: '1.08 · Order Flow、1.09 · Price Impact、1.10 · Adverse Selection；按需回看 T08 Time Scale',
  updatedAt: '2026-08-28',
  revision: '1.11-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.11-r1',
      summary: '要求统一 put–call parity 的剩余期限记号并分开 forward 与 spot 映射输入，补全 IL₂，按 H₀: αᵢ=0 严格表述 weak exogeneity，限定 ETF 创建赎回约束的可执行条件，并准确描述 Chan 对非同步交易的修正。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.11-r1',
      summary: '要求删除 correlated-innovation 题干的答案泄露并打破正确选项位置循环，补释 NAV/IIV、refresh-time、direct/SIP feed、deterministic terms、payoff、IV、K/T，并统一 put–call parity 的期限记号。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.11-r2',
      summary: '39 节、25 条来源与 66 个引用标记回归通过；VECM、长期 impact、IS bounds、GG CS、IL/ILS、parity、事件响应、5 道练习、10 项检查及 8 道互动全部复算正确，r1 的六组准确性意见均已解决，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.11-r2',
      summary: '39 节认知坡度、零背景术语、8 道 prediction-first 互动、5 道练习、10 项检查、焦点与 ARIA、阅读预算及相邻课程边界全部回归通过；r1 的 2 major 与 5 minor 均已解决，未发现 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-10', label: '1.10 Adverse Selection 与 Informed Trading' },
  next: { slug: '1-12', label: '1.12 Market Maker 为什么存在' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'object-map', label: '六层对象' },
    { id: 'question-index', label: '问题下标' },
    { id: 'linked-claims', label: '经济 Claim' },
    { id: 'economic-normalization', label: '经济对齐' },
    { id: 'frictionless-benchmark', label: '无摩擦基准' },
    { id: 'friction-routing', label: '信息路由' },
    { id: 'instrument-comparator', label: '四类接口' },
    { id: 'venue-fragmentation', label: '多 Venue' },
    { id: 'latent-efficient-price', label: '潜在有效价格' },
    { id: 'common-stochastic-trend', label: '共同随机趋势' },
    { id: 'integration-stationarity', label: 'I(0) / I(1)' },
    { id: 'cointegration', label: 'Cointegration' },
    { id: 'equilibrium-error', label: 'Equilibrium Error' },
    { id: 'vecm', label: 'VECM' },
    { id: 'adjustment-loadings', label: 'Adjustment α' },
    { id: 'common-trend-representation', label: '共同创新' },
    { id: 'innovation-covariance', label: 'Innovation Covariance' },
    { id: 'hasbrouck-is', label: 'Hasbrouck IS' },
    { id: 'is-diagonal-example', label: 'Diagonal IS' },
    { id: 'is-ordering-bounds', label: 'IS Bounds' },
    { id: 'gg-decomposition', label: 'GG 分解' },
    { id: 'gg-component-share', label: 'Component Share' },
    { id: 'is-vs-cs', label: 'IS / CS / ILS' },
    { id: 'lead-lag', label: 'Lead–Lag' },
    { id: 'clocks-staleness', label: '时钟与陈旧价' },
    { id: 'event-time-news', label: '事件时间' },
    { id: 'common-shock-vs-transmission', label: 'Common Shock / Transmission' },
    { id: 'options-target', label: 'Options Target' },
    { id: 'state-dependence', label: '状态依赖' },
    { id: 'identification-ladder', label: '识别阶梯' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'data-estimation', label: '数据与估计协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson111Content,
  references: [
    {
      id: 1,
      authors: 'Robert F. Engle & Clive W. J. Granger',
      year: '1987',
      title: 'Co-Integration and Error Correction: Representation, Estimation, and Testing',
      publication: 'Econometrica, 55(2), 251–276',
      url: 'https://doi.org/10.2307/1913236',
      use: 'Cointegration、error-correction representation 与检验的理论地基；不替研究者决定哪些经济 claim 应共享趋势。',
    },
    {
      id: 2,
      authors: 'Frederick H. deB. Harris, Thomas H. McInish, Gary L. Shoesmith & Robert A. Wood',
      year: '1995',
      title: 'Cointegration, Error Correction, and Price Discovery on Informationally Linked Security Markets',
      publication: 'Journal of Financial and Quantitative Analysis, 30(4), 563–579',
      url: 'https://doi.org/10.2307/2331277',
      use: '把 cointegration 与 error correction 用于信息相连市场的价格发现；经验排序依赖样本、价格口径和模型设定。',
    },
    {
      id: 3,
      authors: 'Joel Hasbrouck',
      year: '1995',
      title: 'One Security, Many Markets: Determining the Contributions to Price Discovery',
      publication: 'Journal of Finance, 50(4), 1175–1199',
      url: 'https://doi.org/10.1111/j.1540-6261.1995.tb04054.x',
      use: 'Information share 将 reduced-form innovations 分解为共同有效价格创新方差贡献；相关 innovations 下通常只部分识别为 ordering bounds。',
    },
    {
      id: 4,
      authors: 'Jesús Gonzalo & Clive W. J. Granger',
      year: '1995',
      title: 'Estimation of Common Long-Memory Components in Cointegrated Systems',
      publication: 'Journal of Business & Economic Statistics, 13(1), 27–35',
      url: 'https://doi.org/10.1080/07350015.1995.10524576',
      use: '用 adjustment loadings 识别 cointegrated system 的永久共同成分；component share 不是创新方差份额。',
    },
    {
      id: 5,
      authors: 'Richard T. Baillie, G. Geoffrey Booth, Yiuman Tse & Tatyana Zabotina',
      year: '2002',
      title: 'Price Discovery and Common Factor Models',
      publication: 'Journal of Financial Markets, 5(3), 309–321',
      url: 'https://doi.org/10.1016/S1386-4181(02)00027-7',
      use: '比较 information share 与 common-factor/component-share 方法，说明两类指标的概念差异及一致条件。',
    },
    {
      id: 6,
      authors: 'Bingcheng Yan & Eric Zivot',
      year: '2010',
      title: 'A Structural Analysis of Price Discovery Measures',
      publication: 'Journal of Financial Markets, 13(1), 1–19',
      url: 'https://doi.org/10.1016/j.finmar.2009.09.003',
      use: '结构化区分 information share 与 component share 对噪声、速度和信息的混合敏感性；支持避免把任一指标称为纯速度或纯信息。',
    },
    {
      id: 7,
      authors: 'Tālis J. Putniņš',
      year: '2013',
      title: 'What Do Price Discovery Metrics Really Measure?',
      publication: 'Journal of Empirical Finance, 23, 68–83',
      url: 'https://doi.org/10.1016/j.jempfin.2013.05.004',
      use: '展示常用价格发现指标可能混合信息领导与流动性噪声，并提出 information leadership 的校正视角；不是因果传导识别。',
    },
    {
      id: 8,
      authors: 'Charles M. C. Lee & Mark J. Ready',
      year: '1991',
      title: 'Inferring Trade Direction from Intraday Data',
      publication: 'Journal of Finance, 46(2), 733–746',
      url: 'https://doi.org/10.1111/j.1540-6261.1991.tb02683.x',
      use: '成交方向推断与成交—报价时间对齐的经典方法；支持把 trade sign 当作估计量并审计 timestamp，而非无误标签。',
    },
    {
      id: 9,
      authors: 'Kenneth D. Garbade & William L. Silber',
      year: '1983',
      title: 'Price Movements and Price Discovery in Futures and Cash Markets',
      publication: 'Review of Economics and Statistics, 65(2), 289–297',
      url: 'https://doi.org/10.2307/1924495',
      use: '早期 futures–cash 价格发现与短期调整框架；其市场排序属于特定样本和制度，不能外推为恒定定律。',
    },
    {
      id: 10,
      authors: 'Hans R. Stoll & Robert E. Whaley',
      year: '1990',
      title: 'The Dynamics of Stock Index and Stock Index Futures Returns',
      publication: 'Journal of Financial and Quantitative Analysis, 25(4), 441–468',
      url: 'https://doi.org/10.2307/2331010',
      use: '研究股指现货与期货收益的动态领先及 non-synchronous trading；支持把观测领先与时钟、交易摩擦共同解释。',
    },
    {
      id: 11,
      authors: 'Kalok Chan',
      year: '1992',
      title: 'A Further Analysis of the Lead–Lag Relationship between the Cash Market and Stock Index Futures Market',
      publication: 'Review of Financial Studies, 5(1), 123–152',
      url: 'https://doi.org/10.1093/rfs/5.1.123',
      use: '检验 cash–futures lead–lag，并讨论 nonsynchronous trading 与信息作用；lead–lag 仍不自动等于结构性因果。',
    },
    {
      id: 12,
      authors: 'Jeff Fleming, Barbara Ostdiek & Robert E. Whaley',
      year: '1996',
      title: 'Trading Costs and the Relative Rates of Price Discovery in Stock, Futures, and Option Markets',
      publication: 'Journal of Futures Markets, 16(4), 353–387',
      url: 'https://doi.org/10.1002/(SICI)1096-9934(199606)16:4%3C353::AID-FUT1%3E3.0.CO;2-H',
      use: '把股票、期货、期权的相对价格发现速度与交易成本和信息类型联系起来；不是所有状态下的固定排名。',
    },
    {
      id: 13,
      authors: 'Quentin C. Chu, Wen-Liang Gideon Hsieh & Yiuman Tse',
      year: '1999',
      title: 'Price Discovery on the S&P 500 Index Markets',
      publication: 'International Review of Financial Analysis, 8(1), 21–34',
      url: 'https://doi.org/10.1016/S1057-5219(99)00003-4',
      use: '在 S&P 500 现货、期货与 SPDR 市场应用 common-factor 方法；结果受样本年代、交易制度与价格同步约束。',
    },
    {
      id: 14,
      authors: 'Joel Hasbrouck',
      year: '2003',
      title: 'Intraday Price Formation in U.S. Equity Index Markets',
      publication: 'Journal of Finance, 58(6), 2375–2400',
      url: 'https://doi.org/10.1046/j.1540-6261.2003.00609.x',
      use: '以 common-factor / information-share 框架比较美国股指相关市场，并展示数据聚合、交易时段和市场结构的重要性。',
    },
    {
      id: 15,
      authors: 'Thomas Dimpfl & Karsten Schweikert',
      year: '2023',
      title: 'Information Shares for Markets with Partially Overlapping Trading Hours',
      publication: 'Journal of Banking & Finance, 154, 106970',
      url: 'https://doi.org/10.1016/j.jbankfin.2023.106970',
      use: '为部分重叠交易时段的 information share 提供方法；支持把闭市和 overnight information 当作模型结构，而非简单补值。',
    },
    {
      id: 16,
      authors: 'U.S. Securities and Exchange Commission',
      year: '2012',
      accessedAt: '2026-08-28',
      title: 'Investor Bulletin: Exchange-Traded Funds',
      publication: 'Official investor bulletin',
      url: 'https://www.sec.gov/files/etfs.pdf',
      use: '说明 ETF 份额、篮子与 creation/redemption 的制度连接；不支持特定分钟级领先方向或套利无风险。',
    },
    {
      id: 17,
      authors: 'Ananth Madhavan & Aleksander Sobczyk',
      year: '2016',
      title: 'Price Dynamics and Liquidity of Exchange-Traded Funds',
      publication: 'Journal of Investment Management, 14(2), 86–102',
      url: 'https://joim.com/article/price-dynamics-and-liquidity-of-exchange-traded-funds/',
      use: '讨论 ETF price、NAV、流动性与价格动态，支持把 NAV 陈旧性和底层交易状态纳入解释；不是 ETF 领先的普遍定律。',
    },
    {
      id: 18,
      authors: 'Itzhak Ben-David, Francesco Franzoni & Rabih Moussawi',
      year: '2018',
      title: 'Do ETFs Increase Volatility?',
      publication: 'Journal of Finance, 73(6), 2471–2535',
      url: 'https://doi.org/10.1111/jofi.12727',
      use: '研究 ETF ownership、套利与底层证券波动的关联和机制；不将 ETF price discovery 自动解释为纯信息效率改善。',
    },
    {
      id: 19,
      authors: 'Travis Box, Ryan Davis, Richard Evans & Andrew Lynch',
      year: '2021',
      title: 'Intraday Arbitrage between ETFs and Their Underlying Portfolios',
      publication: 'Journal of Financial Economics, 141(3), 1078–1095',
      url: 'https://doi.org/10.1016/j.jfineco.2021.04.023',
      use: '研究 ETF 与底层组合的日内错价及可执行套利约束；支持区分 raw premium、陈旧 basket 与可实现套利。',
    },
    {
      id: 20,
      authors: 'Steven Manaster & Richard J. Rendleman Jr.',
      year: '1982',
      title: 'Option Prices as Predictors of Equilibrium Stock Prices',
      publication: 'Journal of Finance, 37(4), 1043–1057',
      url: 'https://doi.org/10.1111/j.1540-6261.1982.tb03597.x',
      use: '早期研究 option-implied stock prices 的预测信息；其结论依赖定价模型、同步与交易成本，不能把 raw option premium 直接当方向价格。',
    },
    {
      id: 21,
      authors: 'Jens A. Stephan & Robert E. Whaley',
      year: '1990',
      title: 'Intraday Price Change and Trading Volume Relations in the Stock and Stock Option Markets',
      publication: 'Journal of Finance, 45(1), 191–220',
      url: 'https://doi.org/10.1111/j.1540-6261.1990.tb05087.x',
      use: '提供股票与股票期权的日内价格和成交量 lead–lag 证据；结果同时暴露 nonsynchronous quotes 与市场摩擦问题。',
    },
    {
      id: 22,
      authors: 'Kalok Chan, Y. Peter Chung & Herb Johnson',
      year: '1993',
      title: 'Why Option Prices Lag Stock Prices: A Trading-Based Explanation',
      publication: 'Journal of Finance, 48(5), 1957–1967',
      url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05136.x',
      use: '说明 option quote staleness 与交易强度可制造表观 lag；支持先审计可交易报价和同步，再解释信息路由。',
    },
    {
      id: 23,
      authors: 'Sugato Chakravarty, Huseyin Gulen & Stewart Mayhew',
      year: '2004',
      title: 'Informed Trading in Stock and Option Markets',
      publication: 'Journal of Finance, 59(3), 1235–1257',
      url: 'https://doi.org/10.1111/j.1540-6261.2004.00661.x',
      use: '研究股票与期权市场的知情交易及价格贡献；经模型映射后的方向信息不能简化为 raw option price 先动。',
    },
    {
      id: 24,
      authors: 'Dmitriy Muravyev, Neil D. Pearson & John Paul Broussard',
      year: '2013',
      title: 'Is There Price Discovery in Equity Options?',
      publication: 'Journal of Financial Economics, 107(2), 259–283',
      url: 'https://doi.org/10.1016/j.jfineco.2012.09.003',
      use: '以可交易 stock/option quotes 审计 equity-option price discovery，并强调期权报价的交易性与同步；结果不支持无条件期权领先。',
    },
    {
      id: 25,
      authors: 'Vineet Patel, Tālis J. Putniņš, David Michayluk & Sean Foley',
      year: '2020',
      title: 'Price Discovery in Stock and Options Markets',
      publication: 'Journal of Financial Markets, 47, 100524',
      url: 'https://doi.org/10.1016/j.finmar.2019.100524',
      use: '用更细的价格发现视角比较股票与期权，并展示信息类型和市场状态的异质性；支持条件化结论而非单一总冠军。',
    },
  ],
  readingList: [
    {
      title: 'Engle & Granger (1987), Co-Integration and Error Correction',
      scope: '重点读 representation theorem、cointegrating relation 与 error-correction 部分。',
      reason: '建立“共享长期关系、短期允许偏离”的原始统计语言。',
      url: 'https://doi.org/10.2307/1913236',
    },
    {
      title: 'Hasbrouck (1995), One Security, Many Markets',
      scope: '重点读 efficient-price innovation、information share 定义和 correlated innovations 的 bounds。',
      reason: '理解 IS 究竟分配什么，以及为什么 Cholesky ordering 不是无关技术细节。',
      url: 'https://doi.org/10.1111/j.1540-6261.1995.tb04054.x',
    },
    {
      title: 'Gonzalo & Granger (1995), Common Long-Memory Components',
      scope: '重点读 permanent–transitory decomposition 与 adjustment coefficients 的角色。',
      reason: '从 α 出发理解 component share，并与创新方差份额分开。',
      url: 'https://doi.org/10.1080/07350015.1995.10524576',
    },
    {
      title: 'Baillie et al. (2002), Price Discovery and Common Factor Models',
      scope: '重点比较 information share 与 common-factor weights。',
      reason: '看见两类指标何时接近、何时因不同 estimand 而分叉。',
      url: 'https://doi.org/10.1016/S1386-4181(02)00027-7',
    },
    {
      title: 'Yan & Zivot (2010), A Structural Analysis of Price Discovery Measures',
      scope: '重点读结构模型、信息与噪声对常用指标的影响。',
      reason: '避免把 IS 或 CS 误读成纯粹的信息速度。',
      url: 'https://doi.org/10.1016/j.finmar.2009.09.003',
    },
    {
      title: 'Putniņš (2013), What Do Price Discovery Metrics Really Measure?',
      scope: '重点读 metric comparison 与 information leadership 的构造。',
      reason: '学习如何诊断“快但噪”市场为何可能在传统指标中被高估。',
      url: 'https://doi.org/10.1016/j.jempfin.2013.05.004',
    },
    {
      title: 'Hasbrouck (2003), Intraday Price Formation in U.S. Equity Index Markets',
      scope: '重点读数据构造、市场比较、aggregation 与经验结果的条件。',
      reason: '把抽象 common-factor 方法放进真实股指多市场系统。',
      url: 'https://doi.org/10.1046/j.1540-6261.2003.00609.x',
    },
    {
      title: 'Box et al. (2021), Intraday Arbitrage between ETFs and Their Underlying Portfolios',
      scope: '重点读 basket valuation、可执行交易成本与日内套利检验。',
      reason: '理解 ETF premium 与可实现错价之间为什么隔着陈旧价格和执行约束。',
      url: 'https://doi.org/10.1016/j.jfineco.2021.04.023',
    },
    {
      title: 'Muravyev, Pearson & Broussard (2013), Is There Price Discovery in Equity Options?',
      scope: '重点读 option/stock quote construction、可交易性与 empirical tests。',
      reason: '学习为什么期权研究必须先处理宽价差、陈旧报价和非线性 payoff。',
      url: 'https://doi.org/10.1016/j.jfineco.2012.09.003',
    },
    {
      title: 'Patel et al. (2020), Price Discovery in Stock and Options Markets',
      scope: '重点读信息类型、市场状态与 stock/options discovery 的异质性。',
      reason: '把“谁领先”改写为条件化、可反驳的经验问题。',
      url: 'https://doi.org/10.1016/j.finmar.2019.100524',
    },
  ],
};
