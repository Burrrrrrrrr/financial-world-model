import OptionHedgingFeedbackLab from '../components/OptionHedgingFeedbackLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson124Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>期权对冲不是“做市商看涨就买、看跌就卖”，而是一条内生控制回路：期权净仓位决定局部 Delta/Gamma，价格和曲面变化改写目标 hedge，实际执行形成订单，订单经过有限流动性影响价格，新价格又重新改变 Greeks。</h2>
        <p>
          对同一份期权账簿，正 Gamma 通常意味着标的上涨后需要卖出、下跌后需要买入，形成逆势的目标对冲量；负 Gamma 则通常意味着上涨后买入、下跌后卖出，形成顺势目标对冲量。但“目标”还不是“成交”，成交也还不是“价格结果”。做市商可能跨合约净额、设置无交易带、延迟执行、使用被动限价单，或在股票、ETF、期货和其他期权之间转移风险；即使订单真的成交，它造成多大价格变化仍取决于当时 depth、市场冲击、自然反向订单和其他主体的反应。因而专业结论必须是条件句：<b>Gamma 给出局部对冲方向，库存与执行规则决定净订单，流动性与市场结构决定反馈强度。</b><Cite n={1} /><Cite n={11} /><Cite n={13} /><Cite n={18} />
        </p>
        <p>
          本节会从可复算的组合账本开始，随后加入离散对冲、交易成本、跳跃和曲面运动，再用一个最小价格冲击模型解释何时出现阻尼或放大。最后我们会拆解公开 open interest（OI，未平仓合约数）与常见 Gamma exposure（GEX，Gamma 暴露）指标；供应商对 GEX 的公式和量纲并不统一。OI 的每一张合约同时有一多一空，公开数据通常不知道哪一边属于 dealer（交易商/做市商），因此“dealer net gamma”不是从 OI 直接观测到的事实，而是依赖库存归属、成交方向、开平仓与跨产品抵消假设的估计量。<Cite n={42} /><Cite n={43} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整内生回路</p>
        <h2>价格先改变对冲者，随后对冲者可能改变价格；只有把两条箭头同时写出，才能讨论反馈而不是相关性。</h2>
        <div className="mechanism-chain" aria-label="期权对冲反馈的八步闭环">
          <div><span>01</span><b>期权流与存量</b><p>客户、dealer 与其他主体形成有符号仓位。</p></div>
          <div><span>02</span><b>聚合风险簿</b><p>逐腿乘方向、张数、乘数和模型 Greek。</p></div>
          <div><span>03</span><b>市场状态改变</b><p>Spot、IV surface、时间、利率和股息共同移动。</p></div>
          <div><span>04</span><b>目标 Delta 改写</b><p>Gamma、Vanna、Charm 等改变所需 hedge。</p></div>
          <div><span>05</span><b>执行策略过滤</b><p>净额、阈值、速度、工具和订单类型决定成交。</p></div>
          <div><span>06</span><b>流动性吸收订单</b><p>Depth、自然反向流与冲击函数决定价格反应。</p></div>
          <div><span>07</span><b>反馈或被缓冲</b><p>逆势流可能阻尼，顺势流可能放大，也可能被抵消。</p></div>
          <div><span>08</span><b>重新估值</b><p>新价格重算 Greeks、资金与限额，开启下一轮。</p></div>
        </div>
        <p>
          这条回路至少跨越三种时间尺度。毫秒到分钟内，Delta 变化、执行延迟与订单簿冲击主导；日内到数日内，曲面、客户流、到期和仓位净额重新塑形；更长时间里，融资、资本和参与者结构决定谁愿意承受剩余风险。Frey–Stremme、Platen–Schweizer 与 Sircar–Papanicolaou 等模型说明，动态对冲需求进入市场均衡后，波动率和定价方程本身会内生改变；这些理论提供可能机制，却不等于现实 dealer 的仓位、冲击或因果强度已经被观测。<Cite n={13} /><Cite n={14} /><Cite n={15} />
        </p>
        <div className="precision-note"><span>本节最终解决的问题</span><p>给定一张期权账簿，能够把每单位 Greeks 转成有符号组合 Delta/Gamma 和目标 hedge；能够说明正负 Gamma 的再平衡方向、离散误差与完整损益；能够把对冲需求接入价格冲击并识别反馈成立条件；能够逐项审计 shares-per-dollar、1% hedge notional、curvature P&amp;L 与供应商 GEX；能够解释为什么 OI、0DTE 成交量、价格靠近 strike 或 GEX 与波动的相关性都不足以单独证明 dealer hedging 因果。</p></div>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与六阶段路线</p>
        <h2>本节研究“已有期权风险怎样转成订单并反馈价格”，不重新教授期权定价，也不预设 dealer 永久站在哪一边。</h2>
        <p>
          硬先修是 1.23：掌握 Delta、Gamma、Vega、Theta、乘数、局部 Taylor 与 full repricing；还要回看 1.12 的做市商资产负债表、hedge 账本和 market impact（市场冲击）边界。本节中的 dealer 是承担 principal inventory risk（自营库存风险）的功能角色，不等于所有经纪商，也不意味着其总是 short options。为了保持可证伪性，我们把“仓位符号”“目标对冲”“实际订单”“价格冲击”分成四个可独立失败的接口。<Cite n={21} /><Cite n={28} />
        </p>
        <div className="learning-objectives">
          <span>六阶段学习路线 · 从风险簿到内生反馈</span>
          <ol>
            <li><b>组合账本（03–09）：</b>统一 Delta/Gamma 符号、乘数、张数、Delta-neutral hedge 与参与者库存。</li>
            <li><b>动态对冲损益（10–17）：</b>建立自融资基准，加入 Gamma–Theta、realized–implied、离散、成本和 jump。</li>
            <li><b>订单与反馈（18–25）：</b>从正负 Gamma 方向进入执行过滤、价格冲击、流动性和跨市场 hedge。</li>
            <li><b>GEX 量纲审计（26–33）：</b>区分每美元、每 1%、美元名义和曲率损益，并检查 OI 与 dealer-side 假设。</li>
            <li><b>曲面与到期（34–41）：</b>处理 Gamma 集中、0DTE、Vanna、Charm、surface dynamics、pinning 与争议证据。</li>
            <li><b>识别与迁移（42–49）：</b>重建 inventory、排除信息与反向因果，完成研究设计、互动、练习和跨课接口。</li>
          </ol>
          <p><b>时间预算：</b>第一轮读 00–25，约 90–105 分钟，建立“仓位→目标订单→冲击”的机制主线；第二轮读 26–49，约 70–85 分钟，完成单位、数据、0DTE、识别、互动与练习。参考文献和延伸阅读不计入。</p>
        </div>
      </section>

      <section className="lesson-section" id="delta-gamma-recap">
        <p className="section-kicker">阶段一 · 从单份期权到风险簿　|　03 · Delta 与 Gamma 的控制含义</p>
        <h2>Delta 是当前点的标的等价斜率，Gamma 是这条斜率随标的变化的速度；对冲反馈来自“Delta 会变”，而不是来自 Delta 本身。</h2>
        <div className="equation-card">
          <span>每单位期权的局部地图</span>
          <div>Delta=∂V/∂S，　Gamma=∂²V/∂S²=∂Delta/∂S</div>
          <p>V 是每单位标的对应的期权价值，S 是模型中的 underlying coordinate。Delta 的单位是期权价格单位/标的价格单位；Gamma 的单位是 Delta/标的价格单位。两者都隐含模型和“其他输入暂时冻结”的条件。</p>
        </div>
        <p>
          若一份 call 的 Delta 从 0.50 变为 0.55，问题不是“它现在更可能价内”这么简单，而是复制或风险控制所需的标的数量增加了。Gamma 把现货变化转换成下一轮 Delta 变化，因此它是动态对冲订单的局部生成器。Black–Scholes 的连续复制把这条关系写入定价；OIC 的 Gamma 定义则适合核对 desk convention，但二者都没有承诺大行情、跳跃或曲面移动时旧 Gamma 仍精确。<Cite n={1} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="gamma-sign">
        <p className="section-kicker">04 · Gamma 符号来自多空，不来自 call / put</p>
        <h2>标准 vanilla 的 long call 与 long put 都是正 Gamma；short call 与 short put 都是负 Gamma，不能用“call 正、put 负”给仓位贴符号。</h2>
        <p>
          对同 strike、expiry 和模型输入的 European vanilla，call 与 put 的 Gamma 相同。Long option 拥有凸性：标的上涨时其 Delta 向更正方向移动，标的下跌时向更负方向移动，所以 Gamma 为正；short position 的价值是 long 的相反数，Gamma 因而翻转。Put 的 Delta 本身通常为负，但 long put 的 Delta 会在下跌时变得更负，这仍然是正 Gamma。<Cite n={39} />
        </p>
        <div className="table-scroll" role="region" aria-label="期权方向与 Delta Gamma 符号，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">标准 vanilla 期权仓位的典型 Delta 与 Gamma 符号</caption>
            <thead><tr><th scope="col">仓位</th><th scope="col">典型 Delta</th><th scope="col">Gamma</th><th scope="col">上涨后的 Delta 变化</th></tr></thead>
            <tbody>
              <tr><th scope="row">Long call</th><td>正</td><td>正</td><td>更正</td></tr>
              <tr><th scope="row">Short call</th><td>负</td><td>负</td><td>更负</td></tr>
              <tr><th scope="row">Long put</th><td>负</td><td>正</td><td>较不负</td></tr>
              <tr><th scope="row">Short put</th><td>正</td><td>负</td><td>更正</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="portfolio-delta">
        <p className="section-kicker">05 · 有符号组合 Delta</p>
        <h2>屏幕 Greek 必须先乘仓位方向、合约张数和乘数；只有组合净 Delta 才能决定同一坐标上的第一阶 hedge。</h2>
        <div className="equation-card">
          <span>股票/ETF 期权的 share-equivalent Delta</span>
          <div>Delta<sub>P</sub>=Σ<sub>i</sub> n<sub>i</sub>m<sub>i</sub>Delta<sub>i</sub></div>
          <p>n_i 是有符号合约张数：long 为正、short 为负；m_i 是每张合约对应的标的单位；Delta_i 是每单位期权 Greek。对股票/ETF，Delta_P 的单位是股数。指数或期货期权要改成相应 underlying units，再映射到实际 hedge instrument。</p>
        </div>
        <p>
          例：乘数 100，long 20 张 call、每单位 Delta=0.55；short 10 张 put、每单位 Delta=−0.35。组合 Delta=20×100×0.55+(−10)×100×(−0.35)=1,450 股。Short put 的负仓位方向与 put 的负 Delta 相乘，贡献正 Delta；若凭“put 是看跌”直接填负号，会把风险方向算反。组合 Greek 是模型化风险坐标，仍要保存 surface snapshot、exercise treatment 和单位。<Cite n={40} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="portfolio-gamma">
        <p className="section-kicker">06 · 有符号组合 Gamma</p>
        <h2>组合 Gamma 是每条腿的局部曲率净额；gross Gamma 很大而 net Gamma 接近零，是完全可能的风险状态。</h2>
        <div className="equation-card">
          <span>Portfolio spot Gamma</span>
          <div>Gamma<sub>P</sub>=Σ<sub>i</sub> n<sub>i</sub>m<sub>i</sub>Gamma<sub>i</sub></div>
          <p>在股票/ETF 口径下，Gamma_P 的单位是“股数/标的价格单位”。它说明 spot 每移动 1 元，组合 Delta 在 frozen-surface 局部近似下改变多少股。</p>
        </div>
        <p>
          延续上例：call Gamma=0.04/元，put Gamma=0.03/元，则 Gamma_P=20×100×0.04+(−10)×100×0.03=50 股/元。虽然两条腿的 gross absolute Gamma 为 110 股/元，净额只有 50；若另一期限或 strike 的 short Gamma 再抵消，实际标的再平衡需求会更小。风险控制可同时报告 gross 与 net，但反馈方向由相关坐标和时段中的净变化决定，不能用总期权成交量代替。<Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="delta-neutral-hedge">
        <p className="section-kicker">07 · Delta-neutral hedge</p>
        <h2>若 H 表示同一标的坐标上的有符号 hedge units，局部 Delta 中性的目标是 H=−Delta_P；这是一阶抵消，不是永久仓位。</h2>
        <div className="equation-card">
          <span>Target hedge 与再平衡</span>
          <div>H*=−Delta<sub>P</sub></div>
          <div>ΔH*≈−Gamma<sub>P</sub>ΔS　（IV、时间与其他输入冻结）</div>
          <p>Delta_P=+1,450 股时，目标 H* 是 short 1,450 股。若 Gamma_P=+50 股/元且 spot 上涨 2 元，组合 Delta 约增加 100 股，因此目标 hedge 还要卖出约 100 股。</p>
        </div>
        <p>
          这个 H* 是模型目标，不代表市场上已经成交的头寸。实际 desk 可能用期货而非股票，可能因为现有库存、现金、borrow、保证金或订单簿状态而保留 residual Delta，也可能将多条期权腿先净额。连续复制理论解释了目标从何而来；现实执行必须另建现金、时间和工具账本。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="neutral-not-riskless">
        <p className="section-kicker">08 · Delta 中性不等于风险中性</p>
        <h2>把当前一阶斜率归零，只冻结了一个点、一个模型和一个瞬间；Gamma、Vega、Theta、jump、basis 与成本仍然留在组合中。</h2>
        <p>
          Delta-neutral portfolio 在一个足够小、其他输入不变的 spot move 下减少一阶损益，却仍会因价格路径的平方项、IV surface、时间流逝、利率股息、提前行权和标的跳跃而变化。若 hedge 用 ES futures 对冲 SPX option，还要面对 futures–index basis、合约乘数、交易时段和保证金；若用 SPY 对冲单股篮子，又有 tracking 与相关性。Boyle–Emanuel 证明即使 BSM 路径正确，离散调整也留下误差；Merton 的 jump 框架则说明无法交易的 gap 不能靠提高连续对冲频率消除。<Cite n={3} /><Cite n={8} />
        </p>
        <div className="precision-note"><span>一句合格的风险表述</span><p>“截至 t、使用模型 M 和曲面版本 v、在 underlying coordinate X 上，组合 Delta 约为零。”这比“已经 hedged，所以没有方向风险”多写了条件，却避免把局部控制状态误当成永久无风险。</p></div>
      </section>

      <section className="lesson-section" id="position-ownership">
        <p className="section-kicker">09 · 谁持有 Gamma：仓位归属先于反馈方向</p>
        <h2>每张未平仓合约都有一个 long 和一个 short；只有知道哪一方属于 dealer、是否跨产品抵消，才能谈 dealer net Gamma。</h2>
        <p>
          客户买入 call 可能由 dealer 卖出，也可能由另一客户卖出、dealer 只短暂中介；客户也可以 sell to open，使 dealer 成为 long option。成交后头寸还可能在其他 strike、expiry、SPY、ES、OTC（over-the-counter，场外）option 或 structured product 上被抵消。Gârleanu–Pedersen–Poteshman 使用独特 dealer/end-user position data 说明需求与中介风险承载会影响 option prices，但这类数据之所以有价值，正因为普通价格、成交量和 OI 没有给出同样的所有权信息。<Cite n={28} />
        </p>
        <p>
          因此，“客户通常买期权，所以 dealer 通常 short gamma”只能作为待测的市场叙事，不能作为定义。公开 OPRA（Options Price Reporting Authority，美国期权价格报告机构）消息中的 participant 标识通常是交易场所/处理器，不是持仓者身份；Cboe 的专有 open–close 数据虽然按 customer、firm、broker-dealer、market-maker 等 capacity 分桶，覆盖范围和开平仓字段仍受具体交易所规格限制。<Cite n={42} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="self-financing">
        <p className="section-kicker">阶段二 · 动态对冲与损益来源　|　10 · 自融资组合</p>
        <h2>对冲损益必须把期权、标的、现金账户、股息、融资和交易成本放进同一账本；只看 option mark 或 stock trade 都会漏掉现金流。</h2>
        <div className="equation-card">
          <span>最小 delta-hedged wealth</span>
          <div>Π=V+HS+B，　H≈−Delta</div>
          <div>dΠ=dV+H·dS+carry / financing flows−costs</div>
          <p>V 是有符号期权组合价值，H 是标的 hedge units，B 是现金/融资账户。若标的支付股息、期权 cash-settled、hedge 用期货或存在保证金，现金流必须按合同重新写，不能只把 H×S 当成通用财富。</p>
        </div>
        <p>
          Self-financing（自融资）不是“策略不需要资本”，而是所有仓位调整都由组合内部借贷、出售或追加资产完成，没有把外部现金注入伪装成投资收益。Black–Scholes 与 Merton 的复制论证以自融资组合为核心；现实 desk 还需把 borrow、margin、fees 和 execution price 写入。只有所有腿共享同一事件时钟，才能避免把 stock hedge P&amp;L 既计入 combined wealth、又作为“对冲成本”重复扣除。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="continuous-ideal">
        <p className="section-kicker">11 · 连续复制的理想极限</p>
        <h2>连续 Delta hedge 是一个定价基准，不是一项可以在现实中以无限频率、零成本执行的操作说明。</h2>
        <p>
          在连续扩散、可连续交易、无摩擦、模型输入按假设演化的世界中，hedger 可以在每个无穷小时点更新 H，使一阶随机项局部抵消。这个极限让 option price 不依赖股票的真实预期收益率，却要求任何价格变化之间都有可交易时点。现实行情按离散 tick 到达，订单有 latency、spread、queue 和 impact，交易成本若随 turnover 为正，无限频繁调整反而使成本发散。<Cite n={1} /><Cite n={4} />
        </p>
        <p>
          连续模型仍然有巨大价值：它提供一张可比较的风险地图和误差基准。Bertsimas–Kogan–Lo 研究离散时间如何逼近连续策略，说明跟踪误差率依赖模型、网格和策略，而不是一个跨市场固定常数。研究对冲表现时应明确 rebalancing schedule、触发阈值、可成交价格和 latency，不能用事后高频数据假设 desk 在每个中间价都成交。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="local-pnl">
        <p className="section-kicker">12 · Delta-hedged 局部 P&amp;L</p>
        <h2>把 Delta 一阶项抵消后，剩余局部损益首先来自 Gamma 的路径曲率、Theta 的时间推进与曲面的变化。</h2>
        <div className="equation-card">
          <span>冻结当前 Greeks 的短步长近似</span>
          <div>ΔΠ≈Theta<sub>P</sub>Δt+½Gamma<sub>P</sub>(ΔS)²+Vega<sub>P</sub>Δσ+cross terms+explicit hedge/cash carry−costs</div>
          <p>这里假设初始 H=−Delta_P，且所有 Greek 已转换成同一组合金额单位。Δσ 必须和 Vega 的 vol-decimal/vol-point convention 一致，Δt 与 Theta convention 一致；explicit carry 只记录尚未包含在模型价格归因中的 hedge、现金、借券和股息现金流，绝不能把 PDE 已经计入的融资或股息再算一次。</p>
        </div>
        <p>
          Gamma 项使用价格变动的平方，因此正 Gamma 在上、下两种方向的小幅移动中都贡献正曲率；Theta 常在 long vanilla 上为负，表示复制这种凸性需要付出时间价值。但 observed P&amp;L 不是“Gamma 钱加 Theta 钱”这么简单：IV、skew、funding、dividend、spread、hedge slippage 和 Greek 重算都会进入。Bakshi–Kapadia 的 delta-hedged gain 研究将这类损益与波动率风险溢价联系起来，也明确依赖模型与数据口径。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="gamma-theta">
        <p className="section-kicker">13 · Gamma 收益与 Theta 成本</p>
        <h2>在 BSM 基准里，Gamma 与 Theta 不是两笔互不相关的礼物和费用；它们由同一复制 PDE 连接。</h2>
        <div className="equation-card">
          <span>含连续股息 q 的 BSM PDE</span>
          <div>Theta+½σ²S²Gamma+(r−q)SDelta−rV=0</div>
          <p>把利率、股息和融资现金流一致地放回自融资组合后，long Gamma 对实现路径的曲率收益与按定价波动率支付的 carry/Theta 形成交换。只报“正 Gamma 会赚钱”漏掉了购买凸性的价格。</p>
        </div>
        <p>
          若市场完全不动且 IV、曲线也冻结，long option 常因 Theta 变得更便宜；若标的在持有期内来回移动，动态再平衡可能把曲率变成 trading gains。是否覆盖 Theta 取决于 realized path、买入时的 implied level、执行成本和曲面变化，而不是仅看最终 S 是否回到起点。Black–Scholes 的 PDE 是这一交换的基准，不是“每天 gamma scalp 必赚”的策略保证。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="realized-implied">
        <p className="section-kicker">14 · Realized-minus-implied variance 身份的边界</p>
        <h2>“Delta-hedged P&amp;L 等于 realized variance 减 implied variance”只在严格局部基准下成立，不是任意期权组合的会计恒等式。</h2>
        <div className="equation-card">
          <span>连续路径、同一 BSM 口径下的逐腿局部式</span>
          <div>dΠ≈½S²Σ<sub>i</sub>Gamma<sub>P,i</sub>(σ²<sub>realized</sub>−σ²<sub>implied,i</sub>)dt</div>
          <p>Gamma_P,i 是第 i 条腿已经乘入方向、张数和乘数后的有符号 position Gamma；这里 (dS/S)²=σ²_realized dt，Delta 连续重平衡、没有跳跃和成本，融资股息已一致处理。每条腿要使用其复制 PDE 对应的 σ_implied,i，并共享同一 underlying coordinate。</p>
        </div>
        <p>
          只有单一期权、所有腿共用同一 implied volatility，或另行定义且稳定的 Gamma-weighted implied variance 时，才可把求和约成 ½Gamma_P S²(σ²_realized−σ²_implied)dt。若各腿 IV 不同、Gamma 有正有负或净 Gamma 接近零，强行求一个标量 implied variance 会失稳。现实中 IV surface 还会移动，Gamma 本身沿路径变化，期权可能 American、离散股息、illiquid 或有 jump。El Karoui–Jeanblanc-Picqué–Shreve 给出的某些凸性稳健结果也需要局部波动率支配等条件，不能被简化成“用更高波动率定价就一定赚钱”。Bakshi–Kapadia 的实证进一步说明 delta-hedged gains 会混合波动率风险溢价和模型状态；研究必须报告 residual，而不是先把所有剩余损益命名为 realized–implied。<Cite n={1} /><Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="discrete-hedging">
        <p className="section-kicker">15 · 离散再平衡与路径误差</p>
        <h2>实际 hedge 只在有限时点调整，因此两个起终点相同的路径也可能因中间波动、触发次数和成交价格不同而产生不同损益。</h2>
        <p>
          固定每分钟、每小时或每日再平衡，是 calendar schedule；当 Delta 偏离超过阈值才交易，是 state-dependent rule。前者在高波动时可能暴露更大 gap，后者会在波动上升时机械增加 turnover。Boyle–Emanuel 说明即使无成本 BSM 世界，离散 hedge error 也非零且分布可偏；Bertsimas–Kogan–Lo 则把误差与时间粒度连接。比较策略时必须使用同一信息集和可执行时钟，不能让一项策略事后选择更有利的 rebalance 点。<Cite n={3} /><Cite n={7} />
        </p>
        <div className="precision-note"><span>误差不是纯噪声</span><p>Hedge residual 会随 Gamma、路径、时间间隔、跳跃、曲面运动和执行成本系统变化。若 residual 在近到期、低深度或事件窗口集中，它本身就是模型或执行机制失效的证据。</p></div>
      </section>

      <section className="lesson-section" id="cost-no-trade-band">
        <p className="section-kicker">16 · 交易成本与 no-trade band</p>
        <h2>只要每次调整有成本，最优控制通常不是追逐每一个微小 Delta 变化，而是在目标周围容忍一段 residual risk。</h2>
        <p>
          比例成本使交易频率出现内生权衡：更频繁调整降低部分离散风险，却增加 spread、fees、impact 和 adverse execution。Leland 展示固定频率和比例成本下的经典近似；Davis–Panas–Zariphopoulou 把有成本定价写成控制/效用问题；Whalley–Wilmott 的小成本渐近则产生与 Gamma 和风险偏好相关的 no-transaction region（无交易区间）。这些模型参数化不同，不能合并成全行业唯一的 band 公式。<Cite n={4} /><Cite n={5} /><Cite n={6} />
        </p>
        <p>
          对反馈而言，这个区间非常关键。价格先移动并不保证马上出现 hedge order；多个小变化可能先累积，跨过阈值后再集中成交。相同 Gamma 在低成本、严格 Delta limit 下可能快速进入市场，在高成本、宽 band 或已有反向客户流时则可能几乎不交易。用 continuous target flow 预测实际逐笔成交，会系统高估频率并错配时点。
        </p>
      </section>

      <section className="lesson-section" id="jump-residual">
        <p className="section-kicker">17 · Jump residual</p>
        <h2>价格跳跃跨过了中间可交易状态；旧 Delta 只能抵消跳前斜率，局部 Gamma 二阶项也不再是大跳跃的精确损益。</h2>
        <div className="equation-card">
          <span>跳跃瞬间的精确 delta-hedged option residual</span>
          <div>R<sub>jump</sub>=V(S+J)−V(S)−Delta<sup>−</sup>J</div>
          <p>J 是不可在中间价成交的 spot jump，Delta⁻ 是跳前 Delta。½Gamma·J² 只是对小 J 的二阶 Taylor 近似；若跨越 strike、曲面同时重塑或 Delta 不光滑，误差可以很大。</p>
        </div>
        <p>
          提高常规时段的 hedge frequency 无法在隔夜 gap、停牌或瞬时新闻跳跃中补出缺失交易点。Merton 的 discontinuous-return 模型说明，仅用 underlying 与 bond 一般不能完整复制 jump risk；现实 desk 可能用其他期权、事件限额或资本缓冲管理，却只是把不可复制风险重新分配。任何“负 Gamma 导致追涨杀跌”的连续反馈模型也必须另设 jump state，因为 jump 先发生、hedge order 后到达。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="target-versus-execution">
        <p className="section-kicker">阶段三 · 从对冲需求到价格反馈　|　18 · Target、order 与 fill</p>
        <h2>模型计算出的目标仓位、desk 提交的订单和市场最终成交是三个不同对象；反馈只能由实际进入市场的净成交产生。</h2>
        <div className="table-scroll" role="region" aria-label="目标对冲到市场成交的过滤层，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">对冲目标、订单和成交的差别</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">由什么决定</th><th scope="col">可观测证据</th><th scope="col">不能直接推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">Target hedge</th><td>模型、净 Greeks、limit、surface</td><td>内部风险簿或重建</td><td>已提交订单</td></tr>
              <tr><th scope="row">Submitted order</th><td>band、netting、urgency、tool、venue</td><td>订单级审计数据</td><td>全部成交</td></tr>
              <tr><th scope="row">Fill</th><td>价格、queue、depth、对手方</td><td>成交与账户数据</td><td>永久价格影响</td></tr>
              <tr><th scope="row">Net market flow</th><td>所有主体买卖相抵</td><td>全市场 signed flow</td><td>dealer 单独造成结果</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Option market maker 还可能先用新客户流自然抵消旧风险，而不是主动打入 underlying。Wu 等人的台湾指数期权数据表明真实库存与 hedge cost 会进入做市经济，但样本和工具特定；Kaeck–van Kervel–Seeger 对 SPX 订单流的估计则提醒，统计影响可以存在而经济量级很小。把 theoretical hedge demand 全部当作 aggressive market orders，是从风险模型跨越到市场结果时最常见的逻辑跳跃。<Cite n={21} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="positive-gamma-flow">
        <p className="section-kicker">19 · 正 Gamma 的逆势目标流</p>
        <h2>在 frozen-surface 局部基准下，正 Gamma 账簿上涨后卖、下跌后买；它可能提供阻尼，但前提是这一目标流被及时执行。</h2>
        <div className="equation-card">
          <span>Gamma-only rebalance</span>
          <div>ΔH*=−Gamma<sub>P</sub>ΔS</div>
          <p>Gamma_P&gt;0：若 ΔS&gt;0，则 ΔH*&lt;0，目标是卖出标的；若 ΔS&lt;0，则 ΔH*&gt;0，目标是买入。这个符号来自维持 Delta neutral，不来自对未来回报的主观看法。</p>
        </div>
        <p>
          若逆势成交在外生冲击之后提供反向需求，价格偏离可能更快被吸收，形成 negative feedback（负反馈/阻尼）。Anderegg–Ulmann–Sornette 在特定 OTC FX 数据与库存重建中发现正 gamma 状态与较低 spot volatility 相关；Dim–Eraker–Vilkov 的 0DTE 工作论文也报告类似反转证据。但产品、样本和识别方法都有限，不能把“正 Gamma”写成任何市场中的稳定器身份。<Cite n={18} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="negative-gamma-flow">
        <p className="section-kicker">20 · 负 Gamma 的顺势目标流</p>
        <h2>负 Gamma 账簿上涨后买、下跌后卖，使已有价格变化生成同方向 hedge demand；这是潜在正反馈，不是崩盘的充分条件。</h2>
        <div className="equation-card">
          <span>同一公式，符号翻转</span>
          <div>Gamma<sub>P</sub>&lt;0 ⇒ sign(ΔH*)=sign(ΔS)</div>
          <p>例如 Gamma_P=−8,000 股/元，spot 上涨 0.50 元时，目标 hedge 增加约 +4,000 股；下跌 0.50 元则目标卖出约 4,000 股。</p>
        </div>
        <p>
          顺势 demand 只有在规模相对 market depth 足够大、执行及时、其他流量未抵消时才放大波动。Baltussen 等将期权 gamma proxy 与可直接测量的 leveraged-ETF rebalance demand 同日内动量联系，但期权仓位仍是估计；Gennotte–Leland 的组合保险模型说明市场无法识别技术流时，规则化交易可能与信息更新互动并造成不连续，却不证明任何负 Gamma 都会引发 crash。<Cite n={12} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="impact-lambda">
        <p className="section-kicker">21 · Price impact λ</p>
        <h2>Gamma 告诉我们可能交易多少，market depth 才把交易量翻译成价格变化；两者的乘积决定反馈尺度。</h2>
        <div className="equation-card">
          <span>最小局部线性冲击</span>
          <div>dS=dS<sup>0</sup>+λ·dH</div>
          <p>dS⁰ 是没有该 hedge flow 时的外生价格变化；dH 是 hedger 的净买入 units；λ 的单位是“价格变化/买入 unit”，λ 越大代表相同订单造成更大冲击、市场越薄。</p>
        </div>
        <p>
          Kyle 的经典模型使 λ 成为信息与流动性共同决定的线性价格冲击参数。这里借用它作为教学局部斜率，不声称现实订单在任意规模下具有常数永久冲击。实际 λ 会随时段、波动、spread、depth、订单大小、执行速度和对手方改变；同一个 Gamma number 在午间深市场和事件后的薄市场中，反馈完全不同。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-denominator">
        <p className="section-kicker">22 · 反馈分母</p>
        <h2>把 hedge rule 与 price impact 闭合后，正负 Gamma 分别进入阻尼或放大分母；这一步才把“方向”变成系统反馈。</h2>
        <div className="equation-card">
          <span>局部同时反馈模型</span>
          <div>dH=−Gamma<sub>P</sub>dS，　dS=dS<sup>0</sup>+λdH</div>
          <div>dS=dS<sup>0</sup>/(1+λGamma<sub>P</sub>)</div>
          <p>λGamma_P 是无量纲 feedback gain。Gamma_P&gt;0 时分母大于 1，外生冲击被压小；Gamma_P&lt;0 时分母缩小，冲击被放大。</p>
        </div>
        <p>
          例：λ=0.00002 元/股、Gamma_P=+8,000 股/元，1 元外生冲击变成 1/1.16≈0.8621 元；若 Gamma_P=−8,000，则变成 1/0.84≈1.1905 元。分母接近零不是“市场必然无限波动”的预测，而是常数 λ、即时连续执行和线性近似已经进入病态区，必须改用非线性 impact、容量、时间延迟和其他主体模型。Illiquid-hedging 文献正是通过这种策略—价格互相改变建立非线性定价。<Cite n={13} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-state">
        <p className="section-kicker">23 · 流动性状态依赖</p>
        <h2>Gamma 是账簿状态，λ 是市场状态；风险集中往往发生在负 Gamma 与高冲击同时出现，而不是任一变量单独极端。</h2>
        <p>
          在 calm market 中，tight spread、深 depth 和自然反向流使 λ 较小，数千股 hedge 可能被吸收；在新闻、临停附近、融资压力或多主体同步减仓时，depth 撤回、λ 上升，同样数量会穿透更多价格层。若波动上升又提高 margin、压缩 dealer capacity，市场流动性和 funding liquidity 可以互相强化。Brunnermeier–Pedersen 提供这一螺旋的经典理论，但形成螺旋仍需要融资约束、头寸方向和共同反应等条件。<Cite n={17} />
        </p>
        <p>
          因此实务风险指标不应只画一条 net Gamma。至少应同时观察可用 depth、spread、近期 impact、hedge instrument basis、资金/保证金和潜在执行 horizon。Barbon–Buraschi 的工作论文把 gamma imbalance proxy 与流动性交互，正是因为“同一 gamma 在不同 liquidity state 下作用不同”；其结果仍联合检验 proxy、冲击和识别假设。<Cite n={29} />
        </p>
        <p>
          O&apos;Donovan、Yu 与 Zhang 使用专有参与者数据的工作论文进一步报告：做市商净 short option exposure 时，推断出的对冲需求更可能消耗标的流动性；净 long exposure 时则可能供给流动性，而且差异在外部流动性供给有限时更强。这与“仓位状态 × 市场容量”而非单一 Gamma 决定市场质量的命题一致，但论文仍处于工作稿阶段，参与者流量和推断对冲也不等于全市场完整库存与逐笔实际 hedge fill。<Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="execution-policy">
        <p className="section-kicker">24 · 净额、阈值、延迟与订单类型</p>
        <h2>Desk 的执行控制器决定 theoretical flow 何时、以什么速度和哪种 aggressiveness 进入市场，甚至可能暂时改变观测到的符号。</h2>
        <p>
          风险系统可以先跨客户、strike 和 expiry 净额，再对剩余 Delta 设置 limit；小偏离留在 no-trade band，接近限额才执行。被动限价单可能等待自然流，主动 market order 则立即消耗 depth；算法还可以把大单切片、选择流动性更好的时段或使用 correlated hedge。Whalley–Wilmott 的无交易带说明成本为何内生地产生“不动区”，但现实 band 还包含 capital、latency、adverse selection 和风控。<Cite n={6} />
        </p>
        <p>
          这使成交与 Gamma 的时间关系非线性：价格在 band 内移动时没有 hedge flow，突破后可能出现一批同向订单；若客户新流恰好减少 Delta，desk 甚至无需进入 underlying。研究若只将每个 tick 的 −Gamma·dS 当作当刻 market order，会把潜在需求错记为实际交易，并忽略执行选择本身对冲击的反应。
        </p>
        <p>
          “做市商一定持续在标的上做标准 Delta hedge”还有直接反例。Hu、Kirilova、Muravyev 与 Ryu 的 KOSPI 200 账户级工作论文发现，多数样本 OMM（option market maker，期权做市商）主要在数分钟内通过其他期权迅速抵消风险，只有少数持续采用标准 Delta hedge。这不能直接外推到 SPX、SPY 或美国单股，却足以证明 risk target 与 underlying order 之间必须保留“在期权内部净额/转移”的分支。<Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="hedge-instrument">
        <p className="section-kicker">25 · Hedge instrument 与跨市场传导</p>
        <h2>同一 Delta 可以在股票、ETF、期货或其他期权中被管理；订单落在哪个市场，决定最初冲击与后续传导路径。</h2>
        <p>
          Single-stock option 常以股票为主要 hedge；SPX option desk 可能用 ES futures、SPY 或篮子；futures option 则围绕 underlying futures 管理。若工具不是与 option coordinate 完全相同的标的，必须加入 hedge ratio、multiplier、basis、tracking、交易时段和 margin。Chung 等利用台湾 covered warrants 的较清晰发行/hedge 结构识别股票市场效应，Wu 等则发现台湾指数期权做市商以期货对冲时库存与成本进入报价；二者都说明合约制度决定可见通道。<Cite n={20} /><Cite n={21} />
        </p>
        <p>
          Schlag–Stoll 对 DAX 的历史研究还发现期权成交影响较多呈暂时性、期货成交影响更持久，提示“期权流先发生”与“价格最终在哪里发现”可以分离。跨市场 hedge 可能先冲击最深的 futures，再通过 arbitrage 传回 index/ETF/stock；这条链会在 4.24 Derivative Linkage 中系统展开。本节只要求风险报告注明真正执行的工具，不能把 index-point Gamma 直接称为股票买卖股数。<Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="spot-gamma-units">
        <p className="section-kicker">阶段四 · Gamma、Dollar Gamma 与 GEX　|　26 · Spot Gamma 的量纲</p>
        <h2>单份模型 Gamma 本身不是订单金额；先说明“每单位 option、每一 underlying price unit”，才能进入仓位和市场容量。</h2>
        <div className="equation-card">
          <span>Per-unit spot Gamma</span>
          <div>Gamma<sub>i</sub>=∂Delta<sub>i</sub>/∂S</div>
          <p>若 option premium 与 S 都按每股美元报价，Delta_i 是股/股的无量纲斜率，Gamma_i 的单位是 1/美元。乘合约乘数 m_i 后，才得到每张合约的“股数 Delta 变化/美元 spot move”。</p>
        </div>
        <p>
          例如 Gamma_i=0.04/元、乘数 100，一张 long option 的 position Gamma 是 4 股/元：spot 小幅上涨 1 元，Delta-equivalent 约增加 4 股。指数期权的“underlying unit”不是可直接交割的一股指数，期货期权又围绕 futures quote；单位标签必须随产品改变。OIC 的单份 Gamma 定义不包含 position sign、contracts、multiplier 或 1% scaling，不能直接复制成 GEX dashboard。<Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="position-gamma-units">
        <p className="section-kicker">27 · Position Gamma：乘数与方向只放一次</p>
        <h2>从屏幕 Gamma 到风险簿的唯一安全路径，是逐腿乘有符号合约数与乘数；重复乘 100 或漏掉 short sign 都会制造虚假反馈。</h2>
        <div className="equation-card">
          <span>逐腿到账簿</span>
          <div>Gamma<sub>P</sub>=Σ n<sub>i</sub>m<sub>i</sub>Gamma<sub>i</sub></div>
          <p>若 vendor 已提供 position Gamma，就要确认其中是否已经包含 contracts 与 multiplier，再决定能否直接相加。报告应保存原生 per-unit Greek、n、m 和聚合结果，避免黑箱重复缩放。</p>
        </div>
        <p>
          同一 chain 中，某 strike 有 10,000 张 OI、单份 Gamma=0.02，并不意味着组合 Gamma 是 20,000 股/元：这还需要合约乘数、某一主体位于 long 还是 short 一侧，以及其在其他 legs 的净额。若使用 index option，聚合单位可能是“标的等价单位/指数点”，随后还需映射为 futures contracts 或美元 notional。把所有产品都标成 shares，会让跨资产容量比较失去含义。<Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="one-percent-hedge-units">
        <p className="section-kicker">28 · 每 1 元与每 1% 的对冲单位</p>
        <h2>“Spot 变动一个单位”与“Spot 变动 1%”相差一个当前价格因子 S；这一步是多数 GEX 数量级差异的来源。</h2>
        <div className="equation-card">
          <span>Frozen-Gamma hedge quantity：数量与方向分开</span>
          <div>每 1 元变动的 |ΔH|=|Gamma<sub>P</sub>|</div>
          <div>每 1% 变动的 |ΔH|=0.01S·|Gamma<sub>P</sub>|</div>
          <div>若 ΔS=+0.01S，则有符号 ΔH=−0.01S·Gamma<sub>P</sub></div>
          <p>前两式只给数量绝对值；任意冲击下的实际方向由 −Gamma_PΔS 决定，即 −sign(Gamma_PΔS)，不能只看涨跌方向。若 S=5,000、Gamma_P=+0.8 units/元，+1% 是 +50 元，所以目标是卖出 40 units；若 Gamma_P=−0.8，同一上涨则目标买入 40 units。</p>
        </div>
        <p>
          百分比 scaling 允许跨价格水平做相对比较，却仍不是跨产品标准化的终点：一个 SPX equivalent unit、一个 SPY share 和一张 ES futures 的美元价值不同。若 dashboard 标注“GEX per 1%”，必须追问它返回 underlying units、contracts 还是 dollars，以及 option multiplier 是否已经包含。没有公式的单位标签不具备可审计性。
        </p>
      </section>

      <section className="lesson-section" id="hedge-notional">
        <p className="section-kicker">29 · 每 1% 的对冲美元名义</p>
        <h2>把对冲单位变成当前美元名义，还要再乘一次 S；因此常见 cash gamma 与 raw Gamma 之间可能相差 S²。</h2>
        <div className="equation-card">
          <span>1% move 的 hedge-notional magnitude 与有符号目标</span>
          <div>|Notional<sub>hedge,1%</sub>|=0.01S²|Gamma<sub>P</sub>|</div>
          <div>若 ΔS=+0.01S，则有符号 ΔNotional<sub>H</sub>=−0.01S²Gamma<sub>P</sub></div>
          <p>第一式回答“恢复原 Delta-neutral target 需要改变多少当前价值的标的仓位”，单位是美元名义/1% move；第二式才给 +1% shock 后买入为正、卖出为负的目标方向。两者都不是预计实际成交额。</p>
        </div>
        <p>
          S=5,000、Gamma_P=+0.8 units/元时，+1% move 的目标是卖 40 units，名义绝对值为 40×5,000=200,000，有符号目标变化为 −200,000。若实际 hedge instrument 是 futures，必须再用 futures multiplier 和 hedge ratio 换成合约张数；若执行分散于多个市场，还应报告各工具分配。用当前 S 计算的 notional 也会随价格变化，需要说明 evaluation point。
        </p>
      </section>

      <section className="lesson-section" id="curvature-not-flow">
        <p className="section-kicker">30 · Curvature P&amp;L 不是 hedge notional</p>
        <h2>二阶曲率损益含有 1/2 和价格变动平方；对冲名义则是 Delta 变化乘当前 spot，两者量纲和经济问题都不同。</h2>
        <div className="equation-card">
          <span>同一 1% shock 的两个美元量</span>
          <div>Hedge-notional magnitude=0.01S²|Gamma<sub>P</sub>|</div>
          <div>+1% 后的 signed target change=−0.01S²Gamma<sub>P</sub></div>
          <div>Curvature P&amp;L=½Gamma<sub>P</sub>(0.01S)²=0.00005S²Gamma<sub>P</sub></div>
          <p>第一式是重新中和 Delta 所需仓位的名义绝对值，第二式给上涨 1% 后的买卖方向，第三式是有符号 option-value 局部二阶变化。S=5,000、Gamma_P=+0.8 时，名义绝对值为 200,000 美元、目标卖出 200,000 美元名义，曲率 P&amp;L 为 +1,000 美元。</p>
        </div>
        <p>
          有些供应商把有符号 +0.01S²Gamma_P 叫 dollar gamma 或 GEX；它描述 Gamma exposure convention，却不是 +1% 后的目标 hedge flow，后者符号相反。另一些供应商把 S²Gamma、½S²Gamma 或 1% curvature P&amp;L 叫 cash gamma。结果可能相差符号、2、100、10,000 或一个乘数，却都贴着“GEX”。专业比较必须先把每个指标还原为公式、position sign、underlying coordinate、spot scaling 与 shock size，再讨论数值高低；名称相同不是定义相同。
        </p>
      </section>

      <section className="lesson-section" id="open-interest-identity">
        <p className="section-kicker">31 · Open interest 的双边恒等式</p>
        <h2>每一张 OI 同时对应一个 long 与一个 short；OI 只计未平仓合约总量，不提供哪一边是 dealer，也不直接提供净 Gamma。</h2>
        <div className="table-scroll" role="region" aria-label="成交开平仓组合如何改变未平仓量，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">买卖双方开平仓状态与 open interest 变化</caption>
            <thead><tr><th scope="col">成交双方</th><th scope="col">OI 变化</th><th scope="col">能知道什么</th><th scope="col">仍不知道什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">双方都开仓</th><td>+1</td><td>新增一份未平仓合同</td><td>dealer 在哪一边</td></tr>
              <tr><th scope="row">双方都平仓</th><td>−1</td><td>一份合同消失</td><td>此前库存所有者</td></tr>
              <tr><th scope="row">一开一平</th><td>0</td><td>合同从一方转给另一方</td><td>净 dealer position</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          OIC 对 OI 的官方解释明确了这三种变化；OCC 发布的系列 OI 报表同样是总量而非账户持仓。例：某 call OI=20,000，只说明有 20,000 份 long claims 与对应 20,000 份 short obligations 存在，不能把全部 20,000 乘 Gamma 后自动冠名为 dealer short Gamma。OI 对容量和到期集中仍有信息价值，但必须与持仓归属分开。<Cite n={43} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="dealer-sign-identification">
        <p className="section-kicker">32 · Dealer-side 符号的识别</p>
        <h2>要估计 dealer net Gamma，至少需要起始库存与带方向、身份、开平仓的流量；价格、成交量和 OI 不能补出缺失的账户归属。</h2>
        <p>
          理想重建逐 series 保存：初始 dealer position、每笔 dealer buy/sell、open/close、exercise/assignment、转仓与调整，再乘当时有效 multiplier 和模型 Gamma。若系列从挂牌时零库存开始、能完整观察 dealer signed flow，累计买入减卖出可重建该系列库存；若数据从中途开始，初始状态未知会永久留在结果中。跨 venue、OTC、structured product、SPY/ES 和其他 expiry 的 offset 又使“单系列准确”不等于“机构净风险准确”。
        </p>
        <p>
          OPRA 公开 last-sale/OI 消息不含完整 trader capacity、position open/close 或 dealer inventory；其中 `OPEN/OPNL` 是系列首笔成交/迟报状态，不能误读成客户开仓。Cboe DataShop 的专有 open–close 产品增加 capacity buckets，但当前规格的 market-maker 字段与交易所覆盖仍有限。CFTC（U.S. Commodity Futures Trading Commission，美国商品期货交易委员会）的 COT（Commitments of Traders，交易商持仓报告）把 futures-and-options combined 仓位用 Delta 转成 futures-equivalent，却不覆盖 OCC 清算的 SPX/SPXW，且 Dealer/Intermediary 分类也不等于 option market maker net Gamma。<Cite n={42} /><Cite n={45} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="gex-proxy-audit">
        <p className="section-kicker">33 · GEX proxy、Gamma wall 与 Zero Gamma</p>
        <h2>公开链条构造的 GEX 是“在一组 dealer-side 假设下的 OI-weighted Gamma proxy”，不是清算机构直接公布的 dealer position。</h2>
        <div className="equation-card">
          <span>一个可审计的通用 proxy</span>
          <div>GEX-hat(S)=Σ a<sub>i</sub>·OI<sub>i</sub>·m<sub>i</sub>·Gamma<sub>i</sub>(S,σ<sub>i</sub>,T<sub>i</sub>)</div>
          <p>a_i 取 −1 或 +1，是研究者对 dealer 位于 long/short 一侧的假设，不是 OI 字段。若把有符号 proxy 乘 0.01S²，得到的是一种 1% Gamma-exposure convention；+1% shock 后的有符号目标 hedge change 还要取相反号，若只报名义绝对值则取绝对值。若报告 curvature P&amp;L，还要明确 1/2 与 0.0001。</p>
        </div>
        <p>
          所谓 gamma wall 常指 proxy 在某些 strikes 集中，zero-gamma level 则是随假定 spot 重算后 proxy 穿越零的根。二者都依赖 a_i、IV surface 如何随 spot 移动、OI 是否冻结、时间与股息，以及跨产品遗漏；它们不是价格不能穿越的实体墙，也不是 dealer 必然在该点改变行为。Cboe 的公开分析曾用特定重建口径说明 gross 0DTE notional 与 net market-maker position 可能相差很大，这正支持先审计净额，而不是把商业图表当成账户真值。<Cite n={46} />
        </p>
        <div className="precision-note"><span>发布 GEX 的最小字段</span><p>公式、underlying coordinate、spot/forward、valuation timestamp、IV/Greek model、multiplier、OI date、dealer-side sign rule、call/put treatment、1 元或 1% scaling、是否含 1/2、跨 expiry/product 范围，以及无法观测的初始和 OTC inventory。</p></div>
      </section>

      <section className="lesson-section" id="expiry-gamma-concentration">
        <p className="section-kicker">阶段五 · 曲面运动、0DTE 与到期　|　34 · ATM Gamma 的期限集中</p>
        <h2>在 BSM ATM 附近，Gamma 随剩余期限缩短大致按 1/√τ 集中；但离开 strike 后它又迅速衰减，聚合风险还必须乘实际净仓位。</h2>
        <div className="equation-card">
          <span>BSM spot Gamma</span>
          <div>Gamma=e<sup>−qτ</sup>φ(d<sub>1</sub>)/(Sσ√τ)</div>
          <p>在 S、σ 和 forward moneyness 近似固定且接近 ATM 时，分母 √τ 使 Gamma 随到期临近上升。对深 ITM/OTM，φ(d₁) 会趋近零；到期点的 payoff kink 不能被理解成所有 strikes 的 Gamma 同时爆炸。</p>
        </div>
        <p>
          临近到期时，几分钱 spot move 可能让 Delta 快速跨越，旧 Greek 的有效时间缩短；tick、spread、settlement fixing 和 gap 的相对重要性上升。OIC 的 Gamma 教育页支持 ATM、短期限通常更高的局部规律，却不含 position size 和 dealer sign。高单份 Gamma × 零净仓位仍接近零；低单份 Gamma × 巨大同向净仓位也可能重要。<Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="zero-dte-contract">
        <p className="section-kicker">35 · 0DTE 是合同状态，不是新上市标签</p>
        <h2>0DTE（zero days to expiration）只表示当前交易日到期；同一系列可能更早挂牌，且行权、结算、乘数和最后交易时点仍由具体产品决定。</h2>
        <p>
          Cboe 将 0DTE 定义为当日结束时到期的 option。SPX/SPXW 是 European-style、cash-settled、乘数 100 的指数期权，但标准 SPX 与 SPXW 的 AM/PM settlement 和交易时点存在差异；single-stock/ETF option 可能 American、physical delivery，futures option 又可能形成 futures position。0DTE 缩短风险时钟，却不会统一这些合同字段。<Cite n={37} /><Cite n={38} />
        </p>
        <p>
          当前产品日历、交易时段、可挂牌到期和 settlement procedure 会更新，教材不写死永久的“每天有哪些到期”矩阵。研究数据库必须保存 series-level specification 与 effective date；否则同样标为 0DTE 的 SPX、SPY 和 equity option 会被错误合并，Gamma 与账户后果也会错位。
        </p>
      </section>

      <section className="lesson-section" id="zero-dte-volume-net">
        <p className="section-kicker">36 · 0DTE 成交量不等于 dealer net Gamma</p>
        <h2>Gross volume 可以巨大，同时 market-maker buys 与 sells、不同 strikes 和到期、其他产品的风险在净额后很小。</h2>
        <p>
          一天内 100 万张成交会重复换手同一未平仓合同；买卖双方可能都在减仓，也可能新旧仓互换。即使识别了 market-maker side，calls、puts、long、short 与跨 strike 的 Gamma 还要逐腿相加。Cboe 的 0DTE 市场影响分析显示，在其特定数据与重建口径中 gross notional 与 net market-maker position 可以显著不同；它是交易所研究且样本历史化，不能被外推成“当前 dealer 总是净多 Gamma”。<Cite n={46} />
        </p>
        <p>
          更稳健的实时问题不是“0DTE volume 今天多大”，而是：从何时开始重建 inventory，signed market-maker flow 是否全市场覆盖，哪些 legs/产品被纳入，当前每腿 Gamma 如何计算，目标 hedge 有多少进入有冲击的市场。若任何一环缺失，报告就应称为 proxy 或 scenario，而不是观测事实。
        </p>
      </section>

      <section className="lesson-section" id="vanna-channel">
        <p className="section-kicker">37 · Vanna：IV 变化也会生成 Delta hedge</p>
        <h2>即使 spot 不动，隐含波动率和 skew 的变化也会通过 Vanna 改变 Delta；把所有 hedge flow 归因于 Gamma 会遗漏重要通道。</h2>
        <div className="equation-card">
          <span>本节 convention</span>
          <div>Vanna<sub>P</sub>=∂Delta<sub>P</sub>/∂σ</div>
          <div>ΔDelta<sub>P</sub>≈Gamma<sub>P</sub>ΔS+Vanna<sub>P</sub>Δσ+…</div>
          <p>σ 使用小数单位：IV 从 20% 到 18% 是 Δσ=−0.02。若供应商按 1 vol point 报 Vanna，数值会相差 100 倍。</p>
        </div>
        <p>
          Equity selloff 常伴随 downside skew 和 IV 上升；同一 fixed-strike option 的 Delta 既沿 spot 维度移动，也因曲面变化改变。OIC 的 2026 FAQ 将 Vanna 解释为 Delta 对 IV 的敏感度，但没有消除 vendor convention 差异。实务需保存使用的是 frozen surface、parallel vol bump、sticky-strike 还是完整 surface refit；否则所谓“Gamma hedge demand”可能混入 Vanna。<Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="charm-channel">
        <p className="section-kicker">38 · Charm：时间本身会改变目标 hedge</p>
        <h2>在没有 spot move 的周末、隔夜或到期日，Delta 仍会随剩余期限变化；Charm 把时间推进转换成新的对冲需求。</h2>
        <div className="equation-card">
          <span>避免符号歧义的 calendar-time 定义</span>
          <div>Charm<sub>P</sub>=∂Delta<sub>P</sub>/∂t，　t 向未来增加</div>
          <div>ΔH≈−(Gamma<sub>P</sub>ΔS+Vanna<sub>P</sub>Δσ+Charm<sub>P</sub>Δt)</div>
          <p>若另一个系统用剩余期限 τ=T−t 定义 ∂Delta/∂τ，时间项符号相反。报告必须说明每年、每天或实际 day-count。</p>
        </div>
        <p>
          Charm 在 near-expiry、near-money 区域可以很大，使 desk 即使在平静价格下也需调整 hedge；但实际订单仍可被客户流、band 与跨期限净额吸收。将所有收盘前或开盘后的再平衡归因于 Gamma，会漏掉时间和隔夜曲面变化。OIC 将 Charm 作为 Delta 随时间变化的 Greek 入口，教材进一步固定 calendar-time convention，避免符号混用。<Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="surface-feedback">
        <p className="section-kicker">39 · Surface dynamics 与 full repricing</p>
        <h2>Sticky-strike、sticky-delta 与实际曲面重塑会给同一 spot shock 不同 Delta；反馈预测因此必须连同 surface rule 一起发布。</h2>
        <p>
          Frozen-IV screen Delta 只取 price function 对 S 的偏导。若 fixed strike 的 IV 随 spot 改变，有效总导数还包含 Vega×∂IV/∂S；若整张 smile 旋转、期限结构重估，Vanna、Volga 和 cross terms 也会变化。Derman 的 sticky regimes 是经验性情景，不是市场定律；不同 regime 下相同期权链会生成不同 hedge orders。<Cite n={36} />
        </p>
        <p>
          压力测试应并列三项：旧 Greeks 的 local attribution、指定 surface shock 下的 full repricing，以及实际 hedge instrument 的成交/impact simulation。Platen–Schweizer 和 Sircar–Papanicolaou 展示 hedge feedback 可以反过来改变 volatility dynamics 与定价方程；但校准曲面与识别真实联合过程仍是不同问题。只把 OI 乘静态 BSM Gamma，会把市场反馈最重要的状态变化冻结掉。<Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="pinning-expiry">
        <p className="section-kicker">40 · Expiry、pinning 与 strike crossing</p>
        <h2>到期价格靠近 strike 可以与正 Gamma 逆势对冲一致，也可能来自行权、流动性、信息或操纵；“pin”不是 dealer Gamma 的唯一指纹。</h2>
        <p>
          若 dealer 在某 strike 附近净 long Gamma，上涨卖、下跌买可能产生向 strike 的均值回复；Avellaneda–Lipkin 在给定持仓符号和冲击函数下建立了这种 market-induced pinning 机制。若 dealer 净 short Gamma，顺势 hedge 反而可能把价格推离 strike。OI 大、价格临近 strike 仍不足以知道是哪一种，因为净持仓符号没有被 OI 观察。<Cite n={31} />
        </p>
        <p>
          Ni 等在历史单股期权到期日发现 strike clustering，并讨论 hedging 与 option writer manipulation 等解释；Golez–Jackwerth 在 S&amp;P 500 futures 中同时发现 pinning 和 crossing-related 反向效应。合同的 exercise、cash/physical settlement、cut-off 和最后交易时点又改变账户行为。因此 pinning 应作为多机制结果变量，用 dealer position、signed hedge flow 和对照组进一步识别。<Cite n={30} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="zero-dte-evidence">
        <p className="section-kicker">41 · 0DTE 实证为何尚未收敛</p>
        <h2>当前研究对“0DTE 是否增加波动”给出设计敏感的不同答案；专业教材应比较识别方法，而不是挑一个结果写成定律。</h2>
        <p>
          Amaya 等使用 Cboe SPX/SPXW 全量成交并从系列挂牌起累积有符号 market-maker flow，报告样本中 OMM 通常正 Gamma、负 Gamma 状态与更高波动相关；Dim–Eraker–Vilkov 也重建正 Gamma 与反转/较低波动的关系。两者截至访问日仍是工作论文，库存起点、跨产品抵消和反事实模型仍有限。<Cite n={33} /><Cite n={34} />
        </p>
        <p>
          Brogaard–Han–Won 的当前工作论文利用 weekly options 分期引入作为工具变量，估计更高 0DTE trading share 增加短周期波动，即使控制估算 Gamma 后仍存在；其排除限制可能受产品成熟度和同期结构变化影响。相反结果并不意味着至少一篇“必然错误”，而说明 volume treatment、inventory channel 和 market-structure change 是不同对象。教材结论只能是：0DTE 的净影响必须随仓位、流动性与研究设计条件化。<Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-data-protocol">
        <p className="section-kicker">阶段六 · 从相关性到内生风险识别　|　42 · Inventory 重建协议</p>
        <h2>一条 dealer Gamma time series 若不能从初始仓位、流量、公司行动和跨产品净额重建，就只是不可审计的标签。</h2>
        <div className="learning-objectives">
          <span>最小数据 schema</span>
          <ol>
            <li><b>Contract state：</b>underlying、K、expiry timestamp、style、settlement、multiplier、adjustment、venue。</li>
            <li><b>Position state：</b>期初账户/capacity 库存、long/short、transfers、OTC 与结构化产品映射。</li>
            <li><b>Flow state：</b>buyer/seller initiator、dealer side、open/close、quantity、price、timestamp、venue。</li>
            <li><b>Lifecycle：</b>exercise、assignment、expiry、cash settlement、corporate action 与 contract adjustment。</li>
            <li><b>Risk model：</b>spot/forward、curve、dividend、surface、model/version、Greek units 与 timestamp。</li>
            <li><b>Hedge ledger：</b>tool、target、submitted order、fill、cost、impact、basis、funding 与 residual。</li>
          </ol>
        </div>
        <p>
          OPRA、OCC OI、Cboe open–close 与 CFTC COT 各覆盖不同字段，没有单一公开表同时给出完整美国 listed-option dealer inventory。公开 OI 是清算后发布的存量字段，不会随当天每笔成交实时改写；对 0DTE 而言，它尤其不能代表当天盘中不断建立、平仓和转移的库存。研究者应列出“实际拥有”和“通过假设补齐”的字段，并给初始库存、跨 venue 和跨产品的 sensitivity bounds。公开 OI 构造的结果应命名为 OI-weighted gamma proxy；只有账户或完整 capacity flow 支持时，才可更接近 dealer net Gamma。<Cite n={42} /><Cite n={43} /><Cite n={44} /><Cite n={45} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="informed-flow-channel">
        <p className="section-kicker">43 · Informed option flow 是竞争通道</p>
        <h2>期权成交领先股票变化，既可能因为 dealer hedge，也可能因为交易者先在期权中表达信息；相同时间顺序不能区分两条因果链。</h2>
        <p>
          Easley–O&apos;Hara–Srinivas 发现期权成交可能包含随后进入股票价格的信息；Pan–Poteshman 使用买方发起的 opening transactions 发现 option volume 对未来回报有预测力；Ni–Pan–Poteshman 还发现非做市商净 volatility demand 预测 realized volatility，财报前更强。Hu 进一步把有符号期权订单流按 Delta 转成 option-induced stock imbalance，发现它预测次日股票回报，而且在信息不对称较高和财报期更强。该构造假设做市商完全对冲、客户不对冲，不能直接观察实际 hedge，却说明同向期权流、对冲需求与持久回报可能共同传递客户信息。这些结果共同表明“option flow → stock move”并不自动是非信息型机械 Delta hedge。<Cite n={25} /><Cite n={26} /><Cite n={27} /><Cite n={48} />
        </p>
        <p>
          识别需要把两条链同时写进设计：信息交易者因预期新闻买期权，dealer 随成交建立 hedge；新闻随后实现又推动股票。若回归只看期权成交和后续回报，hedge flow、private information 与共同公共冲击会混合。Ni 等 2021 的专有参与者分类证据与既有仓位 rehedging 的非信息渠道一致，但仍不是所有股票、日期和产品的永久结构。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="reverse-causality">
        <p className="section-kicker">44 · 反向因果与机械内生性</p>
        <h2>高 Gamma proxy 可能影响波动；低波动、短期限和价格靠近 strike 也会机械提高模型 Gamma，因此相关方向本身无法确定箭头。</h2>
        <p>
          BSM ATM Gamma 含 1/(Sσ√τ)：IV 较低、τ 较短、价格停留在 strike 附近时，计算值会更大。若市场先进入低波动均值回复状态，GEX proxy 可能随后升高；若波动冲击把 spot 推离大 OI strikes，Gamma 又机械下降。由此观察到“高 GEX、低波动”既可能是正 Gamma 阻尼，也可能是低波动生成高 Gamma，或两者共同由第三状态驱动。
        </p>
        <p>
          Barbon–Buraschi 的 gamma fragility 工作论文通过 proxy 与 liquidity interaction 提供有价值的联合证据，却仍同时检验 inventory sign、Greek model、impact 和反向因果控制。0DTE 研究中从挂牌起累积 signed flow 能改善仓位识别，也不能自动解决产品选择、跨市场 offset 和 volatility state selection。实证报告应展示 leads/lags、placebo strikes、预趋势和替代 surface assumptions。<Cite n={29} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="identification-designs">
        <p className="section-kicker">45 · 从账本到因果识别</p>
        <h2>最强设计直接观察仓位与 hedge；次强设计利用制度或产品变化；只用公开 OI 横截面则必须承认识别的是 proxy 的联合假设。</h2>
        <div className="table-scroll" role="region" aria-label="期权对冲反馈的研究设计与识别边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">不同实证设计能识别的对象及主要威胁</caption>
            <thead><tr><th scope="col">设计</th><th scope="col">核心 variation</th><th scope="col">最接近识别</th><th scope="col">主要威胁</th></tr></thead>
            <tbody>
              <tr><th scope="row">账户/做市商数据</th><td>真实 position 与 hedge fills</td><td>库存→订单→冲击</td><td>样本主体与外推</td></tr>
              <tr><th scope="row">发行/制度事件</th><td>hedge demand 外生变化</td><td>处理前后市场反应</td><td>同期产品与参与者变化</td></tr>
              <tr><th scope="row">工具变量</th><td>预测 0DTE/hedge、排除直接价格通道</td><td>local treatment effect</td><td>排除限制</td></tr>
              <tr><th scope="row">OI/GEX panel</th><td>strike、expiry、time variation</td><td>proxy 与结果的条件关系</td><td>dealer sign、反向因果、遗漏产品</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Chung 等的 covered-warrant 制度提供较清晰的发行与 hedge shock，Ni 等 2021 使用历史参与者分类识别 rehedging channel，Brogaard 等则尝试以 weekly introduction 构造 0DTE instrument。三者的对象和外推边界不同。一个合格预注册应冻结：position estimator、Greek/surface model、hedge window、liquidity controls、news exclusions、placebo expiry/strike、跨产品范围和主要 outcome。<Cite n={20} /><Cite n={24} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="falsification">
        <p className="section-kicker">46 · 反例库与可证伪预测</p>
        <h2>“负 Gamma 一定放大波动”只要遇到一个缺失接口就可能失败；成熟框架应提前列出能推翻自己的状态。</h2>
        <div className="table-scroll" role="region" aria-label="Gamma 对冲反馈失效的反例，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">从 Gamma 到波动反馈各接口的反例与观测</caption>
            <thead><tr><th scope="col">失败接口</th><th scope="col">反例</th><th scope="col">应观察到什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">仓位</th><td>公开 OI 大，但 dealer 跨腿净 Gamma≈0</td><td>高 OI、低净 signed inventory</td></tr>
              <tr><th scope="row">目标→订单</th><td>宽 band 或新客户流自然抵消</td><td>Delta 改变但无 underlying fill</td></tr>
              <tr><th scope="row">订单→冲击</th><td>深市场或自然反向单吸收</td><td>有 fill、低 λ、短暂 markout</td></tr>
              <tr><th scope="row">Gamma-only</th><td>Vanna/Charm 主导 Delta 变化</td><td>Flow 与 −GammaΔS 不一致</td></tr>
              <tr><th scope="row">Hedge channel</th><td>Informed option flow 同时预测新闻</td><td>控制 hedge 后仍有永久 price discovery</td></tr>
              <tr><th scope="row">连续路径</th><td>先发生 jump，之后才追 hedge</td><td>旧 Gamma 无法解释 gap residual</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Anderegg 等的 OTC FX 结果支持净 Gamma 符号与 spot volatility 的条件关系，Kaeck 等却显示 SPX option order-flow impact 的经济量级可以很小，Ni 等则发现 stock-level rehedging channel 更广泛。把这些证据放在一起，最可证伪的预测不是“负 Gamma 日波动更高”，而是：<b>在能识别 dealer net negative Gamma、实际顺势 hedge fills 且 λ 较高的窗口，控制信息与共同冲击后，价格延续和短时波动相对匹配对照更强；任一中介量缺失都应削弱效果。</b><Cite n={18} /><Cite n={23} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">47 · 互动实验</p>
        <h2>Mode A 先把期权风险簿转成可复算 hedge；Mode B 再把单位、曲面和库存假设接入反馈。</h2>
        <p>
          八个冻结情境依次检验：组合 Delta/Gamma 与 neutral hedge；正负 Gamma 的对称方向；Gamma scalp、Theta 与成本；jump 精确残差和 Taylor；feedback denominator；GEX 四种量纲；Gamma/Vanna/Charm 联合 hedge；以及为什么完整 signed market-maker flow 可以重建单系列库存，而公开 OI 单独不能识别 dealer sign。所有答案先锁定后揭示；完成状态只在当前页面持续打开时保留，刷新或离开会清空。
        </p>
        <OptionHedgingFeedbackLab />
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">48 · 主动练习与理解检查</p>
        <h2>六道复算题检验符号、损益、反馈、单位、Cross-Greeks 和识别；十个诊断问题检验你能否在故事失效时退回正确接口。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · Portfolio Delta / Gamma 迁移</span><p>乘数 100；long 10 calls，Delta=0.60、Gamma=0.04/元；short 20 puts，Delta=−0.30、Gamma=0.025/元。求组合 Delta、Gamma、初始 stock hedge，并求 spot 下跌 3 元后的局部再平衡量。</p><details className="practice-answer"><summary>展开核对答案</summary><p>Delta_P=10×100×0.60+(−20)×100×(−0.30)=1,200 股；Gamma_P=40−50=−10 股/元；初始 H=−1,200 股。下跌 3 元后 Delta 约增加 (−10)×(−3)=30 股，所以 ΔH=−30 股，即再卖约 30 股。这个结果同时检验了 short put 与负 Gamma 的双重符号。</p></details></article>
          <article className="practice-problem"><span>练习 02 · Gamma scalp 与成本迁移</span><p>组合 Gamma=320 股/元，整日 Theta=−900 元。标的先 +1.5、重平衡，再 −1.5、重平衡；每股交易成本 0.04 元。冻结 Greeks，求局部净 P&amp;L。</p><details className="practice-answer"><summary>展开核对答案</summary><p>曲率 P&amp;L=½×320×[1.5²+(−1.5)²]=720。两次各交易 480 股，turnover=960，成本=38.4。净额=720−900−38.4=−218.4 元。融资、曲面、spread、jump 与 Greek 重算仍被忽略。</p></details></article>
          <article className="practice-problem"><span>练习 03 · Feedback gain 迁移</span><p>λ=0.00003 元/股、外生 dS⁰=−0.8 元。分别令 Gamma_P=+5,000 与 −5,000 股/元，求反馈后 dS 与 hedge change。</p><details className="practice-answer"><summary>展开核对答案</summary><p>正 Gamma：dS=−0.8/(1+0.15)=−0.69565，dH=−5,000×(−0.69565)=+3,478.26 股。负 Gamma：dS=−0.8/(1−0.15)=−0.94118，dH=−(−5,000)×(−0.94118)=−4,705.88 股。下跌时正 Gamma 买、负 Gamma 卖；结果仍依赖即时全额执行和常数 λ。</p></details></article>
          <article className="practice-problem"><span>练习 04 · 1% Gamma 量纲迁移</span><p>S=250，Gamma_P=+120 units/元。对 +1% move，求目标 hedge units 的绝对值与方向、hedge-notional magnitude，以及 curvature P&amp;L。</p><details className="practice-answer"><summary>展开核对答案</summary><p>1% move=+2.5；ΔH=−120×2.5=−300 units，即卖出 300；notional magnitude=300×250=75,000；curvature=½×120×2.5²=+375。目标 hedge flow 与有符号 Gamma exposure 的符号相反。</p></details></article>
          <article className="practice-problem"><span>练习 05 · Gamma / Vanna / Charm 迁移</span><p>Gamma_P=−24 股/元、ΔS=−2；Vanna_P=600 股/vol decimal、Δσ=+0.015；Charm_P=+5 股/calendar day、Δt=1。求组合 Delta change 与 hedge change。</p><details className="practice-answer"><summary>展开核对答案</summary><p>ΔDelta_P≈(−24)×(−2)+600×0.015+5×1=48+9+5=+62 股；为恢复中性，ΔH=−62 股。若 Charm 按剩余期限 τ 定义，必须先统一符号。</p></details></article>
          <article className="practice-problem"><span>练习 06 · Difference-in-differences 只是起点</span><p>某 0DTE 产品引入前后，处理组短周期波动由 12 升至 13，对照组由 11.5 升至 12.0。求简化 DiD，并列出至少两项不能立即称为因果的理由。</p><details className="practice-answer"><summary>展开核对答案</summary><p>DiD=(13−12)−(12.0−11.5)=0.5 个波动率点。仍需检验平行趋势；产品引入可能同时改变流动性、参与者、新闻暴露或其他到期结构；处理强度、跨产品替代和 dealer position 也可能测错。</p></details></article>
        </div>
        <div className="check-grid">
          <details><summary>01 · 为什么 long put 也是正 Gamma？</summary><p>Put Delta 虽为负，但价格上涨时它变得较不负、下跌时变得更负；Delta 对 S 的导数仍为正。Gamma 符号由 option 多空方向决定。</p></details>
          <details><summary>02 · Delta neutral 为什么不是风险消失？</summary><p>它只抵消当前点、指定模型和坐标的一阶 spot exposure；Gamma、IV、time、jump、basis、funding 与成本仍在。</p></details>
          <details><summary>03 · 正 Gamma 为什么通常上涨卖、下跌买？</summary><p>上涨使组合 Delta 增加，为维持 H=−Delta 必须减少 H；下跌使 Delta 减少，必须增加 H。实际成交还受执行过滤。</p></details>
          <details><summary>04 · 负 Gamma 为什么不必然放大波动？</summary><p>目标顺势订单可能被净额、band、客户流或深度吸收；只有实际成交并在较高 λ 下影响价格，才形成放大反馈。</p></details>
          <details><summary>05 · Dollar hedge notional 与 curvature P&amp;L 有何不同？</summary><p>对冲名义绝对值是 0.01S²|Gamma_P|；若 spot 上涨 1%，有符号目标变化是 −0.01S²Gamma_P。曲率 P&amp;L 则是 ½Gamma_P(0.01S)²，是有符号局部二阶价值变化，不能把三者混成一个 GEX。</p></details>
          <details><summary>06 · 为什么 OI 不能给 dealer sign？</summary><p>每份 OI 同时有一名 long 和一名 short，只记录未平仓合同总量；缺少账户身份、买卖方向、开平仓和跨产品净额。</p></details>
          <details><summary>07 · Vanna 与 Charm 为什么会污染 Gamma 归因？</summary><p>IV 和时间也会改变 Delta；真实 hedge change 是 Gamma、Vanna、Charm 及更高项的合成，且 convention 必须统一。</p></details>
          <details><summary>08 · Pinning 为什么不是 dealer long Gamma 的充分证据？</summary><p>价格聚集还可由行权、流动性、信息或操纵产生；OI 不提供 dealer 持仓符号，short Gamma 甚至可能产生相反方向。</p></details>
          <details><summary>09 · 高 GEX 与低波动为何有反向因果？</summary><p>低 IV、短期限和价格靠近 strike 会机械提高模型 Gamma；因此低波动状态本身可能生成更高 proxy。</p></details>
          <details><summary>10 · 最接近因果的证据链是什么？</summary><p>直接观察或可信重建 dealer position，验证价格/曲面变化后 target 改变，再看到同方向 hedge fills，并在控制信息冲击后测得与 λ 一致的价格反应。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">49 · 课程接口与结课诊断</p>
        <h2>本节把 1.23 的局部 Greeks 转成了“仓位—控制—订单—冲击—新价格”回路；后续章节将分别展开参与者目标、跨市场传导和复杂系统反馈。</h2>
        <div className="interface-grid">
          <article><span>← 1.12</span><h3>Market Maker 资产负债表</h3><p>输入 principal inventory、hedge ledger、execution cost 与有限流动性；本节把期权风险落到真实订单。</p></article>
          <article><span>← 1.23</span><h3>Option Prices &amp; Greeks</h3><p>输入 Delta、Gamma、Vanna/Charm 边界、position units、surface 与 full repricing。</p></article>
          <article><span>→ 2.14</span><h3>Options / Volatility Trader</h3><p>输出 gamma–theta、realized–implied、执行成本与风险预算，供策略目标和损益账本使用。</p></article>
          <article><span>→ 4.24</span><h3>Derivative Market Linkage</h3><p>输出股票、ETF、期货和期权之间的 hedge route、basis 与冲击起点。</p></article>
          <article><span>→ 7.04</span><h3>Positive / Negative Feedback</h3><p>输出 λGamma feedback gain、阻尼/放大条件、延迟和非线性失效边界。</p></article>
          <article><span>→ 7.08</span><h3>Endogenous Risk</h3><p>输出仓位反向因果、代理变量、流动性状态、同步对冲与可证伪识别设计。</p></article>
        </div>
        <p className="closing-thesis">
          面对“dealer hedging 会怎样影响市场”这个问题，第一步不是看成交量或一张 GEX 图，而是重建有符号风险簿：逐腿乘 long/short、contracts、multiplier 和同一模型的 Greek，得到组合 Delta 与 Gamma，再确认 dealer-side 符号是否真正可观测。H=−Delta 只给当前目标，−Gamma·ΔS 只给 frozen-surface 的局部变化。
          <br /><br />
          第二步把目标转换成真实执行：加入 Vanna、Charm、surface dynamics、净额、无交易带、延迟、订单类型、工具和成本。只有实际净成交进入有限深度市场，才可用 λ 把 order flow 翻译成价格反馈。正 Gamma 通常产生逆势目标流、负 Gamma 通常产生顺势目标流，但反馈强度由 λGamma、执行份额和其他主体共同决定。
          <br /><br />
          最后把证据边界写进结论。OI 每份同时有一多一空，0DTE volume 不等于 dealer net Gamma，价格靠近 strike 与低 IV 又会机械提高 Gamma。成熟研究必须观察或可信重建 position→target→fill→impact 四个中介量，并排除 informed flow、共同新闻和反向因果。做到这一步，Gamma 不再是一句市场神话，而成为一条可以量纲审计、状态条件化并被数据反驳的内生反馈机制。
        </p>
      </section>
    </>
  );
}

export const lesson124: LessonRecord = {
  slug: '1-24',
  id: '1.24',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Delta / Gamma Hedging 的反馈机制',
  subtitle: '从有符号期权风险簿、自融资与离散对冲出发，把正负 Gamma 的目标再平衡接入真实订单、价格冲击、流动性与曲面状态，并严格审计 Gamma exposure（GEX）、0DTE 与 dealer inventory 的识别边界',
  readingTime: '主线首读约 95–110 分钟；零背景完整学习建议分两次，共约 160–190 分钟（含互动实验与练习；参考文献和延伸阅读不计）',
  prerequisite: '1.23 · 期权价格与 Greeks 的市场含义；1.12 · Market Maker 为什么存在',
  updatedAt: '2026-08-29',
  revision: '1.24-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.24-r1',
      summary: '首轮教学终审确认 50 单元主线、互动状态机与跨课接口成立；要求将复用互动答案的前五道书面题改成新参数迁移题，补齐 GEX、OTC、OMM、CFTC/COT 的首次解释，统一学习时长，并使 OI 阅读卡与唯一链接严格对应。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.24-r1',
      summary: '首轮准确性终审复算全部公式、八个互动、六道练习、十项检查与 50 条来源；要求严格区分有符号 Gamma exposure、对冲数量绝对值和目标 flow 方向，将 realized-minus-implied 改为多腿逐项式，并补齐 0DTE 库存重建的合同与生命周期条件。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.24-r2',
      summary: '回归终审确认 50 个单元的认知坡度、160–190 分钟双轮结构、术语桥接、23 张阅读卡、六道迁移练习、十项诊断、八题互动状态机和跨课接口均达到出版要求；首轮教学问题全部闭合且无新增 P0/P1/P2。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.24-r2',
      summary: '回归终审确认逐腿 realized-minus-implied、Gamma/GEX/目标 flow 全部符号与量纲、0DTE 生命周期条件、五道迁移题和原八题互动数值准确；50 条来源、数据边界、识别设计及相邻课程接口均通过且无 P0/P1/P2。',
    },
  ],
  previous: { slug: '1-23', label: '1.23 期权价格与 Greeks 的市场含义' },
  next: { slug: '1-25', label: '1.25 Circuit Breaker、Price Limit 与 T+1' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整内生回路' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'delta-gamma-recap', label: 'Delta / Gamma 控制含义' },
    { id: 'gamma-sign', label: 'Gamma 符号' },
    { id: 'portfolio-delta', label: 'Portfolio Delta' },
    { id: 'portfolio-gamma', label: 'Portfolio Gamma' },
    { id: 'delta-neutral-hedge', label: 'Delta-neutral Hedge' },
    { id: 'neutral-not-riskless', label: 'Neutral ≠ Riskless' },
    { id: 'position-ownership', label: '仓位归属' },
    { id: 'self-financing', label: '自融资组合' },
    { id: 'continuous-ideal', label: '连续复制极限' },
    { id: 'local-pnl', label: '局部对冲 P&L' },
    { id: 'gamma-theta', label: 'Gamma / Theta' },
    { id: 'realized-implied', label: 'Realized vs Implied' },
    { id: 'discrete-hedging', label: '离散再平衡' },
    { id: 'cost-no-trade-band', label: 'No-trade Band' },
    { id: 'jump-residual', label: 'Jump Residual' },
    { id: 'target-versus-execution', label: 'Target / Order / Fill' },
    { id: 'positive-gamma-flow', label: '正 Gamma 目标流' },
    { id: 'negative-gamma-flow', label: '负 Gamma 目标流' },
    { id: 'impact-lambda', label: 'Price Impact λ' },
    { id: 'feedback-denominator', label: '反馈分母' },
    { id: 'liquidity-state', label: '流动性状态' },
    { id: 'execution-policy', label: '执行控制器' },
    { id: 'hedge-instrument', label: 'Hedge Instrument' },
    { id: 'spot-gamma-units', label: 'Spot Gamma 单位' },
    { id: 'position-gamma-units', label: 'Position Gamma' },
    { id: 'one-percent-hedge-units', label: '每 1% Hedge Units' },
    { id: 'hedge-notional', label: 'Hedge Notional' },
    { id: 'curvature-not-flow', label: 'Curvature ≠ Flow' },
    { id: 'open-interest-identity', label: 'Open Interest' },
    { id: 'dealer-sign-identification', label: 'Dealer Sign' },
    { id: 'gex-proxy-audit', label: 'GEX Proxy Audit' },
    { id: 'expiry-gamma-concentration', label: 'Expiry Gamma' },
    { id: 'zero-dte-contract', label: '0DTE Contract' },
    { id: 'zero-dte-volume-net', label: '0DTE Volume vs Net' },
    { id: 'vanna-channel', label: 'Vanna Channel' },
    { id: 'charm-channel', label: 'Charm Channel' },
    { id: 'surface-feedback', label: 'Surface Feedback' },
    { id: 'pinning-expiry', label: 'Pinning / Expiry' },
    { id: 'zero-dte-evidence', label: '0DTE Evidence' },
    { id: 'inventory-data-protocol', label: 'Inventory Protocol' },
    { id: 'informed-flow-channel', label: 'Informed Flow' },
    { id: 'reverse-causality', label: '反向因果' },
    { id: 'identification-designs', label: '识别设计' },
    { id: 'falsification', label: '反例与证伪' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice', label: '练习与检查' },
    { id: 'interfaces', label: '接口与诊断' },
  ],
  Content: Lesson124Content,
  references: [
    { id: 1, authors: 'Fischer Black & Myron Scholes', year: '1973', title: 'The Pricing of Options and Corporate Liabilities', publication: 'Journal of Political Economy, 81(3), 637–654', url: 'https://doi.org/10.1086/260062', use: '提供连续动态复制、Delta hedge 与 BSM PDE 基准；连续路径、无摩擦和连续交易是假设，不是现实执行承诺。' },
    { id: 2, authors: 'Robert C. Merton', year: '1973', title: 'Theory of Rational Option Pricing', publication: 'Bell Journal of Economics and Management Science, 4(1), 141–183', url: 'https://doi.org/10.2307/3003143', use: '支持自融资复制、股息、无套利边界与期权风险控制；理想融资和连续交易条件限制外推。' },
    { id: 3, authors: 'Phelim P. Boyle & David Emanuel', year: '1980', title: 'Discretely Adjusted Option Hedges', publication: 'Journal of Financial Economics, 8(3), 259–282', url: 'https://doi.org/10.1016/0304-405X(80)90003-3', use: '证明即使 BSM 过程正确，离散再平衡仍产生非零且可偏的 hedge error；不含现实成本与跳跃。' },
    { id: 4, authors: 'Hayne E. Leland', year: '1985', title: 'Option Pricing and Replication with Transactions Costs', publication: 'Journal of Finance, 40(5), 1283–1301', url: 'https://doi.org/10.1111/j.1540-6261.1985.tb02383.x', use: '支持比例交易成本下频率与复制误差的权衡；其 volatility adjustment 依赖特定成本和固定频率。' },
    { id: 5, authors: 'Mark H. A. Davis, Vassilios G. Panas & Thaleia Zariphopoulou', year: '1993', title: 'European Option Pricing with Transaction Costs', publication: 'SIAM Journal on Control and Optimization, 31(2), 470–493', url: 'https://doi.org/10.1137/0331022', use: '说明交易成本使完美复制失效并把问题转为控制/效用定价；结论依赖效用和成本结构。' },
    { id: 6, authors: 'A. E. Whalley & P. Wilmott', year: '1997', title: 'An Asymptotic Analysis of an Optimal Hedging Model for Option Pricing with Transaction Costs', publication: 'Mathematical Finance, 7(3), 307–324', url: 'https://doi.org/10.1111/1467-9965.00034', use: '支持小比例成本下与 Gamma 有关的 no-transaction region；不是全行业统一执行带。' },
    { id: 7, authors: 'Dimitris Bertsimas, Leonid Kogan & Andrew W. Lo', year: '2000', title: 'When Is Time Continuous?', publication: 'Journal of Financial Economics, 55(2), 173–204', url: 'https://doi.org/10.1016/S0304-405X(99)00049-5', use: '刻画连续模型在离散交易下的跟踪误差和时间粒度；误差率依赖模型和策略。' },
    { id: 8, authors: 'Robert C. Merton', year: '1976', title: 'Option Pricing When Underlying Stock Returns Are Discontinuous', publication: 'Journal of Financial Economics, 3(1–2), 125–144', url: 'https://doi.org/10.1016/0304-405X(76)90022-2', use: '支持 jump 破坏仅靠 underlying 与 bond 的连续完美复制；特定定价结论依赖跳跃分布与风险假设。' },
    { id: 9, authors: 'Nicole El Karoui, Monique Jeanblanc-Picqué & Steven E. Shreve', year: '1998', title: 'Robustness of the Black and Scholes Formula', publication: 'Mathematical Finance, 8(2), 93–126', url: 'https://doi.org/10.1111/1467-9965.00047', use: '在特定局部波动率支配条件下给出凸性 claim 的单边稳健结果；不支持“高估波动率就普遍盈利”。' },
    { id: 10, authors: 'Gurdip Bakshi & Nikunj Kapadia', year: '2003', title: 'Delta-Hedged Gains and the Negative Market Volatility Risk Premium', publication: 'Review of Financial Studies, 16(2), 527–566', url: 'https://doi.org/10.1093/rfs/hhg002', use: '将 delta-hedged option gain 与 volatility risk premium 联系并提供 SPX 证据；损益仍混合模型、跳跃、曲面和成本。' },
    { id: 11, authors: 'Albert S. Kyle', year: '1985', title: 'Continuous Auctions and Insider Trading', publication: 'Econometrica, 53(6), 1315–1335', url: 'https://doi.org/10.2307/1913210', use: '提供线性价格冲击和市场深度参数 λ 的经典均衡基础；常数 λ 只作局部教学近似。' },
    { id: 12, authors: 'Gerard Gennotte & Hayne Leland', year: '1990', title: 'Market Liquidity, Hedging, and Crashes', publication: 'American Economic Review, 80(5), 999–1021', url: 'https://www.jstor.org/stable/2006758', use: '说明市场无法区分技术性交易与信息时，规则化 hedge 可与流动性互动并产生不连续；不证明负 Gamma 必然造成崩盘。' },
    { id: 13, authors: 'Rüdiger Frey & Alexander Stremme', year: '1997', title: 'Market Volatility and Feedback Effects from Dynamic Hedging', publication: 'Mathematical Finance, 7(4), 351–374', url: 'https://doi.org/10.1111/1467-9965.00036', use: '将动态对冲需求内生进均衡，连接 Gamma、参与占比与波动率；模型结果不是现实库存的直接估计。' },
    { id: 14, authors: 'Eckhard Platen & Martin Schweizer', year: '1998', title: 'On Feedback Effects from Hedging Derivatives', publication: 'Mathematical Finance, 8(1), 67–84', url: 'https://doi.org/10.1111/1467-9965.00045', use: '说明技术性 hedge demand 可内生产生随机波动率和 smile；是均衡模型而非 dealer position 因果估计。' },
    { id: 15, authors: 'K. Ronnie Sircar & George Papanicolaou', year: '1998', title: 'General Black-Scholes Models Accounting for Increased Market Volatility from Hedging Strategies', publication: 'Applied Mathematical Finance, 5(1), 45–82', url: 'https://doi.org/10.1080/135048698334727', use: '把动态对冲反馈写入非线性定价并展示潜在 volatility effect；依赖特定主体与冲击设定。' },
    { id: 16, authors: 'Paul Wilmott & Philipp J. Schönbucher', year: '2000', title: 'The Feedback Effect of Hedging in Illiquid Markets', publication: 'SIAM Journal on Applied Mathematics, 61(1), 232–272', url: 'https://doi.org/10.1137/S0036139996308534', use: '支持有限流动性下策略—价格互相改变与非线性复制；简化永久冲击模型不能直接当现实预测器。' },
    { id: 17, authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen', year: '2009', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies, 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '提供 market liquidity、funding constraint 与 margin 的相互强化机制；螺旋需要具体融资和头寸条件。' },
    { id: 18, authors: 'Benjamin Anderegg, Florian Ulmann & Didier Sornette', year: '2022', title: 'The Impact of Option Hedging on the Spot Market Volatility', publication: 'Journal of International Money and Finance, 124, 102627', url: 'https://doi.org/10.1016/j.jimonfin.2022.102627', use: '在特定 OTC FX 数据中连接 market-maker 净 Gamma、真实 hedge flow 与 spot volatility；不能外推至全部股票、SPX 或 0DTE。' },
    { id: 19, authors: 'Guido Baltussen, Zhi Da, Sten Lammers & Martin Martens', year: '2021', title: 'Hedging Demand and Market Intraday Momentum', publication: 'Journal of Financial Economics, 142(1), 377–403', url: 'https://doi.org/10.1016/j.jfineco.2021.04.029', use: '连接短 Gamma/杠杆 ETF 再平衡需求与跨资产日内动量、随后反转；期权 Gamma 部分依赖 proxy。' },
    { id: 20, authors: 'San-Lin Chung, Wen-Rang Liu & Wei-Che Tsai', year: '2014', title: 'The Impact of Derivatives Hedging on the Stock Market: Evidence from Taiwan’s Covered Warrants Market', publication: 'Journal of Banking & Finance, 42, 123–133', url: 'https://doi.org/10.1016/j.jbankfin.2014.01.027', use: '利用台湾 covered-warrant 发行与 hedge 结构识别股票市场效应；制度不同于美国 listed options。' },
    { id: 21, authors: 'Wei-Shao Wu, Yu-Jane Liu, Yi-Tsung Lee & Robert C. W. Fok', year: '2014', title: 'Hedging Costs, Liquidity, and Inventory Management: The Evidence from Option Market Makers', publication: 'Journal of Financial Markets, 18, 25–48', url: 'https://doi.org/10.1016/j.finmar.2013.05.007', use: '用台湾指数期权真实做市商库存分解初始与再平衡成本；主要解释期权报价而非标的波动因果。' },
    { id: 22, authors: 'Christian Schlag & Hans R. Stoll', year: '2005', title: 'Price Impacts of Options Volume', publication: 'Journal of Financial Markets, 8(1), 69–87', url: 'https://doi.org/10.1016/j.finmar.2004.06.001', use: '区分历史 DAX 期权与期货成交的暂时/较持久影响；样本与成交分类限制外推。' },
    { id: 23, authors: 'Andreas Kaeck, Vincent van Kervel & Norman J. Seeger', year: '2022', title: 'Price Impact versus Bid–Ask Spreads in the Index Option Market', publication: 'Journal of Financial Markets, 59, 100675', url: 'https://doi.org/10.1016/j.finmar.2021.100675', use: '显示 SPX option order flow 的统计影响可具有很小经济量级；未直接观察 dealer Gamma inventory。' },
    { id: 24, authors: 'Sophie X. Ni, Neil D. Pearson, Allen M. Poteshman & Joshua White', year: '2021', title: 'Does Option Trading Have a Pervasive Impact on Underlying Stock Prices?', publication: 'Review of Financial Studies, 34(4), 1952–1986', url: 'https://doi.org/10.1093/rfs/hhaa082', use: '提供与既有期权仓位 rehedging 影响股票波动和大变动概率一致的参与者分类证据；不是所有产品的永久因果。' },
    { id: 25, authors: 'David Easley, Maureen O’Hara & P. S. Srinivas', year: '1998', title: 'Option Volume and Stock Prices: Evidence on Where Informed Traders Trade', publication: 'Journal of Finance, 53(2), 431–465', url: 'https://doi.org/10.1111/0022-1082.194060', use: '支持期权订单流可包含随后进入股票价格的信息，是 hedge channel 的重要竞争解释。' },
    { id: 26, authors: 'Jun Pan & Allen M. Poteshman', year: '2006', title: 'The Information in Option Volume for Future Stock Prices', publication: 'Review of Financial Studies, 19(3), 871–908', url: 'https://doi.org/10.1093/rfs/hhj024', use: '显示 buyer-initiated opening option volume 对未来 stock returns 有信息；依赖非公开开平仓分类数据。' },
    { id: 27, authors: 'Sophie X. Ni, Jun Pan & Allen M. Poteshman', year: '2008', title: 'Volatility Information Trading in the Option Market', publication: 'Journal of Finance, 63(3), 1059–1091', url: 'https://doi.org/10.1111/j.1540-6261.2008.01352.x', use: '显示非做市商净 volatility demand 预测 realized volatility；不能把 IV/flow 与波动关系全部归因于 Gamma hedge。' },
    { id: 28, authors: 'Nicolae Gârleanu, Lasse Heje Pedersen & Allen M. Poteshman', year: '2009', title: 'Demand-Based Option Pricing', publication: 'Review of Financial Studies, 22(10), 4259–4299', url: 'https://doi.org/10.1093/rfs/hhp005', use: '利用独特 dealer/end-user 持仓连接需求、不可完全对冲风险与 option prices；不是标的 Gamma feedback 的直接估计。' },
    { id: 29, authors: 'Andrea Barbon & Andrea Buraschi', year: '2021 working-paper version', accessedAt: '2026-08-29', title: 'Gamma Fragility', publication: 'University of St. Gallen School of Finance Research Paper 2020/05', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3725454', use: '将 stock-level gamma imbalance proxy、liquidity、日内动量/反转与 flash-crash 风险连接；仍是工作论文且联合检验 proxy 假设。' },
    { id: 30, authors: 'Sophie X. Ni, Neil D. Pearson, Allen M. Poteshman & Joshua White', year: '2005', title: 'Stock Price Clustering on Option Expiration Dates', publication: 'Journal of Financial Economics, 78(1), 49–87', url: 'https://doi.org/10.1016/j.jfineco.2004.08.005', use: '提供历史单股到期日 strike clustering 证据并讨论 hedging 与 manipulation；pinning 不是 Gamma 的唯一识别。' },
    { id: 31, authors: 'Marco Avellaneda & Michael D. Lipkin', year: '2003', title: 'A Market-Induced Mechanism for Stock Pinning', publication: 'Quantitative Finance, 3(6), 417–425', url: 'https://doi.org/10.1088/1469-7688/3/6/301', use: '在给定净仓位与价格弹性下建立 delta-hedging pinning 机制；高 OI 本身不足以推出 pin。' },
    { id: 32, authors: 'Benjamin Golez & Jens Carsten Jackwerth', year: '2012', title: 'Pinning in the S&P 500 Futures', publication: 'Journal of Financial Economics, 106(3), 566–585', url: 'https://doi.org/10.1016/j.jfineco.2012.06.010', use: '显示指数期权到期附近可同时出现 pinning 与 crossing-related 反向效应；历史合同结构限制外推。' },
    { id: 33, authors: 'Diego Amaya, Pedro A. Garcia-Ares, Neil D. Pearson & Aurelio Vasquez', year: '2025 working paper', accessedAt: '2026-08-29', title: '0DTE Index Options and Market Volatility: How Large Is Their Impact?', publication: 'Cboe Research-Grant Working Paper, 25 January 2025', url: 'https://cdn.cboe.com/resources/education/research_publications/gammasqueezes.pdf', use: '从 SPX/SPXW signed market-maker flow 重建 Gamma 并研究波动；工作论文、Cboe 资助、初始库存和跨产品遗漏限制结论。' },
    { id: 34, authors: 'Chukwuma Dim, Bjorn Eraker & Grigory Vilkov', year: '2025 revision', accessedAt: '2026-08-29', title: '0DTEs: Trading, Gamma Risk and Volatility Propagation', publication: 'Working Paper', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190', use: '重建 market-maker Gamma 并报告正 Gamma、较低波动与反转关系；版本和库存识别仍在演化。' },
    { id: 35, authors: 'Jonathan Brogaard, Jaehee Han & Peter Y. Won', year: '2026 revision', accessedAt: '2026-08-29', title: 'Does 0DTE Options Trading Increase Volatility?', publication: 'Working Paper', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4426358', use: '利用 weekly-option 分期引入的工具变量研究 0DTE 与短周期波动；排除限制可能受同期市场结构变化影响。' },
    { id: 36, authors: 'Emanuel Derman', year: '1999', title: 'Regimes of Volatility: Some Observations on the Variation of S&P 500 Implied Volatilities', publication: 'Goldman Sachs Quantitative Strategies Research Notes; Risk, April 1999', url: 'https://emanuelderman.com/wp-content/uploads/1999/03/risk-regimes_of_volatility.pdf', use: '区分 sticky-strike、sticky-delta 等 surface motion 情景；历史经验规则不是市场定律。' },
    { id: 37, authors: 'Cboe Exchange, Inc.', year: 'current', accessedAt: '2026-08-29', title: '0DTE Trading Resources', publication: 'Official Product Education', url: 'https://www.cboe.com/tradable-products/0dte', use: '支持 0DTE 是当前交易日到期而非当天才挂牌；页面产品统计和覆盖会更新。' },
    { id: 38, authors: 'Cboe Exchange, Inc.', year: '2026', accessedAt: '2026-08-29', title: 'SPX Index Options: Tools to Manage Large-Cap U.S. Equity Exposure', publication: 'Official Product Fact Sheet', url: 'https://cdn.cboe.com/resources/spx/spx-fact-sheet.pdf', use: '支持 SPX/SPXW European、cash-settled、100 multiplier 与 AM/PM 结算边界；具体日历和时段以当期规则为准。' },
    { id: 39, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Gamma', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/gamma', use: '支持 Gamma 是 Delta 对标的变化率、long call/put 正 Gamma 及 ATM/短期限集中；不含仓位和 dealer sign。' },
    { id: 40, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Understanding Options Greeks', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/understanding-options-greeks', use: '支持 Greeks 是局部理论 guideposts、组合看净暴露；模型输出不是实际订单或保证损益。' },
    { id: 41, authors: 'Options Industry Council / The Options Clearing Corporation', year: '2026', accessedAt: '2026-08-29', title: 'May Office Hours FAQs: Implied Volatility, Greek Exposure, and Market Maker Activity', publication: 'OIC News, June 2026', url: 'https://www.optionseducation.org/news/may-office-hours-faqs', use: '支持 Vanna、Charm 与 market-maker Greek exposure 的教育入口；Charm 的 t/τ convention 仍须教材自行固定。' },
    { id: 42, authors: 'Options Price Reporting Authority', year: '2026', accessedAt: '2026-08-29', title: 'Binary Data Recipient Interface Specification, Version 6.4b', publication: 'OPRA Technical Specification, 25 August 2026', url: 'https://cdn.opraplan.com/documents/OPRA_Pillar_Output_Specification.pdf', use: '核验公开 last-sale/OI 字段与 participant/open 状态含义；不含完整 trader capacity、dealer inventory 或 position open/close。' },
    { id: 43, authors: 'Options Industry Council / The Options Clearing Corporation', year: '2025', accessedAt: '2026-08-29', title: 'Open Interest: Why It Matters', publication: 'OIC News, October 2025', url: 'https://www.optionseducation.org/news/open-interest-why-it-matters', use: '支持双方开仓/平仓如何改变 OI 及一开一平时 OI 不变；OI 不给持仓者身份。' },
    { id: 44, authors: 'The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Open Interest', publication: 'OCC Market Data Reports', url: 'https://www.theocc.com/market-data/market-data-reports/volume-and-open-interest/open-interest', use: '提供官方 series-level OI 报告入口；发布的是未平仓总量而非 dealer-side position。' },
    { id: 45, authors: 'Cboe DataShop', year: '2025', accessedAt: '2026-08-29', title: 'Open-Close C1, C2, BZX, EDGX Exchange EOD Specification, Version 1.3', publication: 'Official Data Product Specification, 10 November 2025', url: 'https://datashop.cboe.com/documents/Open_Close_EOD_Spec_v1.3.pdf', use: '支持按 customer/firm/broker-dealer/market-maker capacity 分桶的专有字段及其覆盖限制；不是全市场完整 dealer inventory。' },
    { id: 46, authors: 'Mandy Xu / Cboe Global Markets', year: '2023', accessedAt: '2026-08-29', title: 'Volatility Insights: Much Ado About 0DTEs—Evaluating the Market Impact of SPX 0DTE Options', publication: 'Cboe Insights, 8 September 2023', url: 'https://www.cboe.com/insights/posts/volatility-insights-evaluating-the-market-impact-of-spx-0-dte-options', use: '说明特定样本中 gross 0DTE volume/notional 与 net market-maker position 可显著不同；交易所有商业利益且结果不可永久外推。' },
    { id: 47, authors: 'U.S. Commodity Futures Trading Commission', year: 'current', accessedAt: '2026-08-29', title: 'Commitments of Traders—Explanatory Notes', publication: 'Official Market Report Documentation', url: 'https://www.cftc.gov/MarketReports/CommitmentsofTraders/ExplanatoryNotes/index.htm', use: '支持 futures-and-options combined COT 的 Delta-equivalent 与业务分类；不覆盖 OCC SPX/SPXW，也不等于 option dealer net Gamma。' },
    { id: 48, authors: 'Jianfeng Hu', year: '2014', title: 'Does Option Trading Convey Stock Price Information?', publication: 'Journal of Financial Economics, 111(3), 625–645', url: 'https://doi.org/10.1016/j.jfineco.2013.12.004', use: '显示 option-induced stock imbalance 可预测股票回报且在信息环境中更强；其构造假设做市商完全对冲，不能把结果单独解释为非信息型机械压力。' },
    { id: 49, authors: 'James O\'Donovan, Gloria Yang Yu & Jinyuan Zhang', year: '2023 working paper', accessedAt: '2026-08-29', title: 'Option Market Maker Hedging and Stock Market Liquidity', publication: 'Working Paper', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4567604', use: '用专有参与者数据连接做市商 option exposure、推断对冲与标的流动性供给；仍是工作论文且未观察全市场完整库存和全部实际 fills。' },
    { id: 50, authors: 'Jianfeng Hu, Antonia Kirilova, Dmitriy Muravyev & Doojin Ryu', year: '2026 revision', accessedAt: '2026-08-29', title: 'Options Market Makers', publication: 'Working Paper', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4633451', use: 'KOSPI 账户级证据显示多数做市商主要通过其他期权快速抵消风险，只有少数持续标准 Delta hedge；市场制度和工作稿状态限制外推。' },
  ],
  readingList: [
    { title: 'Black & Scholes (1973)', scope: '读动态复制、hedged portfolio 与 PDE 的机制段落。', reason: '建立 Delta hedge 是无套利复制控制，而不是方向预测。', url: 'https://doi.org/10.1086/260062' },
    { title: 'Boyle & Emanuel (1980)', scope: '读离散再平衡误差的分布和步长依赖。', reason: '理解连续模型与现实 hedge schedule 之间第一层缺口。', url: 'https://doi.org/10.1016/0304-405X(80)90003-3' },
    { title: 'Leland (1985)', scope: '读交易成本为何与 hedge frequency 冲突。', reason: '看清“更频繁”并不无条件更接近完美复制。', url: 'https://doi.org/10.1111/j.1540-6261.1985.tb02383.x' },
    { title: 'Whalley & Wilmott (1997)', scope: '读小成本渐近和 no-transaction region。', reason: '把目标 Delta 与实际订单之间的执行 band 形式化。', url: 'https://doi.org/10.1111/1467-9965.00034' },
    { title: 'Merton (1976) · Discontinuous Returns', scope: '读 jump 到来时复制为何不完备。', reason: '明确旧 Delta/Gamma 无法跨越不可交易 gap。', url: 'https://doi.org/10.1016/0304-405X(76)90022-2' },
    { title: 'Bakshi & Kapadia (2003)', scope: '读 delta-hedged gains 与 volatility risk premium 的模型和 SPX 证据。', reason: '避免把所有 hedge P&L 简化成纯 realized-minus-implied variance。', url: 'https://doi.org/10.1093/rfs/hhg002' },
    { title: 'Kyle (1985)', scope: '读 λ 如何连接 signed order flow 与 price impact。', reason: '给 Gamma demand 接入有限市场深度的最小桥。', url: 'https://doi.org/10.2307/1913210' },
    { title: 'Gennotte & Leland (1990)', scope: '读技术交易、信息推断、流动性与 price discontinuity。', reason: '理解顺势 hedge 何时可能变成系统反馈，而非机械定律。', url: 'https://www.jstor.org/stable/2006758' },
    { title: 'Frey & Stremme (1997)', scope: '读 dynamic hedging demand 如何进入均衡 volatility。', reason: '从局部 hedge rule 进入价格反过来改变策略的内生系统。', url: 'https://doi.org/10.1111/1467-9965.00036' },
    { title: 'Wilmott & Schönbucher (2000)', scope: '读 illiquid-market feedback 与非线性复制。', reason: '理解 λGamma 接近病态区时线性模型为何需要升级。', url: 'https://doi.org/10.1137/S0036139996308534' },
    { title: 'Anderegg, Ulmann & Sornette (2022)', scope: '读 OTC FX inventory reconstruction、hedge flow 与 volatility 结果。', reason: '观察相对完整 position→flow→market evidence，同时保留产品外推边界。', url: 'https://doi.org/10.1016/j.jimonfin.2022.102627' },
    { title: 'Baltussen et al. (2021)', scope: '读 option gamma proxy、leveraged ETF demand、intraday momentum 与 reversal。', reason: '比较估计的期权需求与可直接测量的再平衡需求。', url: 'https://doi.org/10.1016/j.jfineco.2021.04.029' },
    { title: 'Ni et al. (2021)', scope: '读参与者分类、既有仓位 rehedging 与 underlying-price 证据。', reason: '建立 informed flow 之外的非信息对冲通道。', url: 'https://doi.org/10.1093/rfs/hhaa082' },
    { title: 'Barbon & Buraschi · Gamma Fragility', scope: '读 Gamma proxy×liquidity、日内动量/反转与识别策略。', reason: '把 proxy、市场深度和 fragility 联合起来，同时审计工作论文状态。', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=3725454' },
    { title: 'Hu et al. · Options Market Makers', scope: '读账户级 OMM 如何在期权内部抵消风险，以及持续 Delta hedger 的异质性。', reason: '用直接反例打破“所有做市商都把 Gamma 立即转成标的订单”的默认假设。', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4633451' },
    { title: 'Ni et al. (2005) · Expiration Clustering', scope: '读 pinning 事实、hedging 与 competing mechanisms。', reason: '防止把价格靠近 strike 当作 dealer Gamma 的唯一指纹。', url: 'https://doi.org/10.1016/j.jfineco.2004.08.005' },
    { title: 'Amaya et al. (2025) · 0DTE Index Options', scope: '读从系列挂牌起累计 signed OMM flow 的仓位重建。', reason: '理解 0DTE Gamma 证据如何依赖起始库存和跨产品范围。', url: 'https://cdn.cboe.com/resources/education/research_publications/gammasqueezes.pdf' },
    { title: 'Dim, Eraker & Vilkov · 0DTEs', scope: '读正 Gamma、reversal 与 volatility propagation 的当前版本。', reason: '与其他 0DTE 设计对照，避免把工作论文结果写成定论。', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4692190' },
    { title: 'Brogaard, Han & Won · Does 0DTE Increase Volatility?', scope: '读 weekly introductions 的工具变量设计与排除限制。', reason: '理解相反结果可能来自不同 treatment 与识别对象。', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4426358' },
    { title: 'Derman (1999) · Regimes of Volatility', scope: '读 sticky-strike、sticky-delta 与 surface motion。', reason: '把 screen Gamma 扩展到 Vanna/Charm 和有效 Delta。', url: 'https://emanuelderman.com/wp-content/uploads/1999/03/risk-regimes_of_volatility.pdf' },
    { title: 'OIC/OCC · Open Interest: Why It Matters', scope: '读 OI 如何产生、何时变化，以及为何不提供持仓者多空方向。', reason: '用官方基础材料审计 OI 双边恒等式与 dealer-side 误读。', url: 'https://www.optionseducation.org/news/open-interest-why-it-matters' },
    { title: 'OPRA · Binary Data Recipient Specification', scope: '核对 last-sale/OI、participant 与 OPEN/OPNL 字段。', reason: '准确知道公开 tape 能和不能识别哪些库存信息。', url: 'https://cdn.opraplan.com/documents/OPRA_Pillar_Output_Specification.pdf' },
    { title: 'Cboe DataShop · Open-Close EOD Specification', scope: '读 capacity buckets、market-maker 字段和交易所覆盖。', reason: '理解专有数据为何改善 proxy，却仍不是全市场完整 inventory。', url: 'https://datashop.cboe.com/documents/Open_Close_EOD_Spec_v1.3.pdf' },
  ],
};
