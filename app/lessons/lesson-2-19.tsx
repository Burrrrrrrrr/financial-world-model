import CrowdingLab from '../components/CrowdingLab';
import { crowdingScenarios } from '../components/crowdingScenarios';
import { lesson219ReadingList, lesson219References } from './lesson-2-19-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson219Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>拥挤不是“有多少人观点相同”，而是相似经济暴露、相关触发器、必要清算、真实执行和有限承接能力在同一时段对齐后的系统状态。</h2>
        <p>
          很多理性、专业且彼此独立的资金可以同时持有同一种风险：它们可能使用同一 benchmark、数据、因子库和风险模型，接受相似的客户评价与融资条款，也可能只是对同一公开信息作出相近判断。到这一步，系统只有静态趋同，没有自动产生踩踏。真正的危险来自另一组变量：亏损或赎回是否同时使约束生效，主体是否必须在相近窗口减仓，订单能否被不同期限的资本承接，以及成交造成的价格变化会不会反过来提高波动、保证金和下一轮销售。<Cite n={18} /><Cite n={43} /><Cite n={69} />
        </p>
        <div className="equation-card">
          <span>教学用脆弱性乘积，不是可直接估计的结构公式</span>
          <div>Fragility ∝ (Position Alignment × Trigger Correlation × Required Liquidation × Feedback Sensitivity) / (Market Depth × Alternative Risk-bearing Capacity)</div>
          <p>各项必须先按研究对象归一化，式子只表达互补关系：共同持仓、共同触发、必须成交和反馈敏感度构成分子；即时深度与替代承接资本构成分母。任何一项接近零，都可能让高 overlap 无法演化成失稳；因此不能把某个 crowding score 读成危机概率。</p>
        </div>
        <div className="causal-chain" aria-label="从共同输入到拥挤反馈的完整状态链" role="list">
          <div role="listitem"><span>01</span><b>Common inputs</b><p>基准、信号、模型、客户与融资。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Positions</b><p>现货与合成经济暴露。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Trigger</b><p>消息、赎回、margin、limit 或 recall。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Target</b><p>希望减少的风险与筹资缺口。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Order / fill</b><p>真实指令、成交与未完成量。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Price / depth</b><p>冲击、spread、库存与承接。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>07</span><b>Mark-to-market</b><p>权益、NAV、抵押品与风险重估。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>08</span><b>Feedback</b><p>新的约束、赎回与跨资产传播。</p></div>
        </div>
        <p>
          本节的中心纪律是：<b>相似信号不等于相同持仓，持仓重叠不等于同步交易，同向交易不等于 herding，价格下跌不等于 fire sale，共同下跌也不等于 contagion。</b>每一次推断都必须说明链条当前走到哪一层、还缺什么状态以及什么条件能让链条断裂。<Cite n={33} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、先修与六阶段路线</p>
        <h2>本节研究“共同暴露怎样变成共同退出风险”，不提前替 Chapter 6 解释心理从众，也不把 Chapter 7 的系统传染全部压进一个指标。</h2>
        <div className="learning-objectives">
          <span>六阶段路线 · 从对象定义到可证伪的拥挤研究</span>
          <ol>
            <li><b>概念边界（00–10）：</b>分开 crowded position、crowded trade、herding、共同因子、集中、流动性错配、fire sale 与 contagion。</li>
            <li><b>趋同来源（11–20）：</b>解释 benchmark、信号、模型、类别、职业激励、资金流、优化器、规则化需求与共同融资怎样塑造持仓。</li>
            <li><b>Metrics ledger（21–30）：</b>冻结时间戳与经济暴露，计算 overlap、cosine、网络、HHI、LSV、factor crowding、flow fragility 与 exit days。</li>
            <li><b>动态反馈（31–40）：</b>由 trigger 进入 target、order、fill、dealer capacity、margin、赎回、short squeeze、跨资产传播与断链条件。</li>
            <li><b>识别与案例（41–55）：</b>从相关指标推进到 forced-flow、自然实验、网络压力测试，并审计 2007、2018、Archegos、GameStop、2020、LDI 与 LTCM。</li>
            <li><b>迁移（56–59）：</b>完成 10+10 道实验、14 道检查、术语桥、课程接口与四层阅读路径。</li>
          </ol>
        </div>
        <p>
          硬先修是 2.09–2.18；建议重点回看 1.09、1.20–1.21、2.15–2.18 与 T03、T05、T06、T08。85–90 分钟核心首读统一走 00–10 → 11、16、21、23、26、30 → 31–36、40–41 → 46–52 → 56–59；其中只读实验说明，不完成全部题。完整第二遍再补 12–15、17–20、22、24–25、27–29、37–39、42–45、53–55 以及 Lab 全量。本节把 2.18 输出的 common benchmark、active positions、trigger、target 与 fills 接成重叠持仓网络；心理模仿留给 6.10，多轮系统传染和临界预警留给 7.13–7.15。<Cite n={18} /><Cite n={38} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="crowded-position">
        <p className="section-kicker">02 · Crowded Position</p>
        <h2>Crowded position 是多个经济独立主体的同方向经济暴露相对可退出容量过大，而不是某只热门证券出现在很多账户里。</h2>
        <p>
          定义里的三个词都不能省略。“经济暴露”要求把现货、期货、期权、total-return swap 和对冲统一到可比较的风险单位；“独立主体”要求穿透同一管理集团内部重复账户、master–feeder 与代持；“相对退出容量”则要求把合计可能出售量与正常及压力状态下的深度、dealer inventory 和替代风险承受资本比较。若只数持有人数量，十万名各持一股的长期投资者可能看起来比一个高杠杆、每日盯市的大账户更拥挤，结论显然失真。<Cite n={16} /><Cite n={18} /><Cite n={63} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="拥挤持仓定义字段，可横向滚动">
          <table className="concept-table">
            <caption>Crowded position 的最小 passport</caption>
            <thead><tr><th scope="col">字段</th><th scope="col">必须回答</th><th scope="col">缺失时的误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">Exposure</th><td>证券、标的、方向、delta/notional、因子与币种</td><td>看见不同证券却漏掉同一风险</td></tr>
              <tr><th scope="row">Holder</th><td>legal entity、manager、fund、investor base 与融资来源</td><td>把同一集团重复账户当独立资金</td></tr>
              <tr><th scope="row">Scale</th><td>AUM、gross/net、free float、issue size 与 ownership coverage</td><td>持仓数目替代经济规模</td></tr>
              <tr><th scope="row">Exit capacity</th><td>ADV、spread、depth、dealer capacity、borrow 与压力情景</td><td>把正常成交量当危机可用深度</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          多个大型指数基金共同持有一只极深、自然买家众多的股票，可以有很高 raw overlap，却未必具有高退出脆弱性；反过来，数个基金通过不同 TRS 对同一低流动性标的建立方向一致的杠杆暴露，公开持仓重叠可能接近零，真实 crowding 却很高。定义必须先于指标。<Cite n={16} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="crowded-trade">
        <p className="section-kicker">03 · Crowded Trade</p>
        <h2>Crowded trade 是多个主体在相近执行窗口争夺同一方向的流动性；它是流量状态，可以由不同初始持仓产生。</h2>
        <p>
          Position 是存量，trade 是期间流量。两只基金可能都持有 X，却因一只收到申购、另一只收到赎回而反向交易；也可能初始持仓完全不同，却同时为了满足现金缺口卖出最液态的国债，从而形成 crowded trade。研究必须分别保存 beginning position、target change、submitted order、cancel、fill 和 ending position，不能用季末持仓变化替代期内交易路径。<Cite n={18} /><Cite n={23} /><Cite n={43} />
        </p>
        <div className="precision-note">
          <span>Stock–flow discipline</span>
          <p>高 overlap 是“如果发生共同触发，谁可能一起受损”的暴露诊断；高同向 order flow 才是“谁正在争夺流动性”的交易诊断。二者结合后仍需市场深度和成交证据，才能讨论价格冲击。</p>
        </div>
        <p>
          时间窗口也决定指标含义。日内 crowded trade 关注秒到小时的订单同步和 dealer capacity；季度持仓 crowding 关注资金流和组合迁移；长期 style crowding 则可能跨越多年。把不同尺度混成一个排名，会让一个长期稳定的大持仓与一次短暂抢跑显示为同一风险。<Cite n={23} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="herding-boundary">
        <p className="section-kicker">04 · Herding</p>
        <h2>只有当主体的决策因为观察、推断或预期他人的行为而改变，才进入 herding；共同响应同一事实并不够。</h2>
        <p>
          Herding 是决策依赖关系，不是结果相似度。声誉型 herding 中，经理担心独自犯错比共同犯错更伤害职业；informational cascade 中，先行者行动改变后续者信念，使私人信号被公共行动序列压倒；报酬外部性则让跟随者的回报直接取决于其他人是否也采取同一行动。这些机制都可以由理性主体产生，不需要先假设心理缺陷。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="共同交易与羊群行为的边界，可横向滚动">
          <table className="concept-table">
            <caption>观察到“大家都买”以后仍需追问</caption>
            <thead><tr><th scope="col">候选机制</th><th scope="col">决策为何相同</th><th scope="col">识别所需额外证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">Common information</th><td>独立读取同一盈利、政策或价格信息</td><td>信息时点与个体反应，无需他人行动</td></tr>
              <tr><th scope="row">Common constraint</th><td>同一 benchmark、limit、margin 或赎回规则</td><td>合同、风险与资金流触发器</td></tr>
              <tr><th scope="row">Reputational herding</th><td>职业评价取决于相对同行表现</td><td>可见同行、薪酬与职业风险</td></tr>
              <tr><th scope="row">Information cascade</th><td>由先行动作推断信息并放弃私人信号</td><td>行动顺序、私人信号与信息集</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因此，“持仓相似”“同向交易”“收益一起跌”和“herding”是四个不同命题。前两个可以测量，第三个是结果，第四个需要关于决策依赖的识别。Chapter 6 会进一步讨论心理模仿；本节只保留机构合同和可观察状态。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="common-factor">
        <p className="section-kicker">05 · Common Factor Exposure</p>
        <h2>没有共同证券也可能挤在同一种风险上；资产名称是法律载体，因子暴露才描述共同损益来源。</h2>
        <div className="equation-card">
          <span>证券层持仓映射到共同因子</span>
          <div>r<sub>i,t</sub>=β<sub>i</sub>′f<sub>t</sub>+ε<sub>i,t</sub>；　B<sub>fund,f</sub>=Σ<sub>i</sub>x<sub>fund,i</sub>β<sub>i,f</sub></div>
          <p>r 是证券收益，f 是共同因子收益，β 是证券因子暴露，ε 是残差；x 必须是同一经济暴露口径的持仓。B 汇总基金对因子 f 的方向暴露。模型遗漏、非线性和压力期相关性变化会使估计失真，因此它是条件映射，不是永恒属性。</p>
        </div>
        <p>
          一只基金做多价值股、另一只通过行业期货和个股空头得到相似 value beta，证券 overlap 可以很低，因子 P&amp;L 却高度相关。Momentum、carry、short-volatility、duration、美元融资和流动性 beta 都可能跨资产出现。2007 年 8 月量化事件之所以重要，正是因子与交易数据揭示了多个看似 market-neutral 策略共享风险来源；这不等于所有模型和具体持仓相同。<Cite n={14} /><Cite n={15} /><Cite n={19} /><Cite n={42} />
        </p>
        <p>
          反过来，共同证券也不必意味着共同净风险。一方持有股票并买入保护性 put，另一方裸多；或者两家都持有可转债，但一方 delta hedge、另一方方向性持有。这里是由合约现金流直接得到的构造性反例，不把 comomentum 文献误作期权或可转债证据。故系统应并列保存 legal position、delta/notional、factor exposure 和 stress P&amp;L，不能选择一本账冒充全部事实。
        </p>
      </section>

      <section className="lesson-section" id="concentration-levels">
        <p className="section-kicker">06 · Concentration 的三个层次</p>
        <h2>组合集中、所有权集中与系统策略集中分别回答“一个账户”“一项资产”和“整个市场”哪里缺少分散。</h2>
        <p>
          Portfolio concentration 衡量单一基金的资本或风险是否集中于少数头寸；ownership concentration 衡量一项资产由多少、何种持有人控制；strategy concentration 则衡量许多主体是否依赖相同因子、融资渠道或退出规则。三个层次可以方向相反：一只高度分散的指数基金并不集中，但全市场若都复制相同权重，系统策略仍可能趋同；一只债券由单一大型长期基金持有，ownership HHI 很高，却可能比许多高赎回基金分散持有更稳定。<Cite n={16} /><Cite n={17} /><Cite n={29} />
        </p>
        <div className="precision-note">
          <span>集中不是脆弱性的单调函数</span>
          <p>大持有人若非被迫清算，会内生考虑卖出对剩余头寸的价格伤害；许多小持有人若遭遇高度相关赎回，反而可能同时卖出。集中度必须与 holder type、flow covariance、leverage、horizon 和 governance 合读。</p>
        </div>
      </section>

      <section className="lesson-section" id="liquidity-mismatch">
        <p className="section-kicker">07 · Liquidity Mismatch</p>
        <h2>当投资者能按近似当日 NAV 迅速退出，而底层资产只能缓慢且有冲击地出售，负债承诺就比资产变现能力更快。</h2>
        <p>
          开放式基金的 fragility 不只来自资产“难卖”，还来自退出价格、支付时钟和成本分摊。若当日 NAV 没有完全计入未来清算冲击，先赎回者可以按较高价格退出，把成本留给剩余持有人；这种 payoff complementarity 又提高其他投资者尽早退出的激励。公司债基金的证据显示，流动性较差资产与可赎回份额的组合会形成状态依赖的 flow response。<Cite n={25} /><Cite n={26} /><Cite n={27} />
        </p>
        <p>
          但 mismatch 不是必然挤兑。现金缓冲、流动性分层、swing pricing、anti-dilution levy、赎回通知期、in-kind redemption、稳定的养老金负债或可信流动性工具都能改变成本归属和时间选择。只有实际 redemption request 穿过 2.17 的现金瀑布，形成 sale target 并最终成交，才会进入价格。<Cite n={25} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="leverage-funding">
        <p className="section-kicker">08 · Leverage 与 Funding</p>
        <h2>杠杆把价格变化映射为权益变化，融资条款再决定这项损失是可以等待的账面波动，还是必须立刻行动的现金义务。</h2>
        <p>
          Gross leverage、net leverage、delta leverage 和 balance-sheet leverage 回答不同问题。真正靠近强制交易的是 margin schedule、haircut、variation margin、融资到期、净额集合、可替代抵押品和 lender discretion。相同五倍经济暴露，一家拥有长期、无逐日盯市的锁定资本，另一家使用可每日提高 haircut 的短期融资；价格下跌后的行为完全不同。<Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} />
        </p>
        <div className="equation-card">
          <span>Trigger distance 比单一杠杆倍数更接近行动阈值</span>
          <div>TriggerDistance<sub>i,s</sub>=Available Equity or Collateral Buffer<sub>i</sub> / Loss under Stress s<sub>i</sub></div>
          <p>分子是指定时点可用于吸收 margin、haircut 或资本要求的非负缓冲，分母是同一计价口径下严格为正的压力损失幅度。若该情景没有损失，指标记为 N/A 而不是强行除以零；比率低于 1 表示损失超过缓冲，但实际是否清算仍取决于净额、补资能力、时钟、合同裁量和资产替代，它不是违约概率。</p>
        </div>
      </section>

      <section className="lesson-section" id="fire-sale-contagion">
        <p className="section-kicker">09 · Fire Sale 与 Contagion</p>
        <h2>Fire sale 是约束而非观点改变驱动的出售；contagion 则要求这次出售或损失把冲击传给原本未受初始事件直接影响的节点。</h2>
        <p>
          一家公司盈利预警后股价下跌，是基本面重估；一只基金因赎回被迫卖出该公司，且价格暂时低于有弹性买家愿意承接的水平，才接近 fire sale；若跌价使另一家持有人违反 margin 或风险限额并继续出售其他资产，才进入 price-mediated contagion。三个过程可以同时出现，却必须用不同反事实识别。<Cite n={22} /><Cite n={30} /><Cite n={38} /><Cite n={39} />
        </p>
        <div className="causal-chain" aria-label="从约束性出售到价格传染的识别链" role="list">
          <div role="listitem"><span>01</span><b>Initial shock</b><p>外生消息、流量或融资变化。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Constraint binds</b><p>现金、margin、capital 或 limit。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Forced target</b><p>并非单纯价值判断改变。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Actual sale</b><p>成交而非意图。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Price effect</b><p>相对可信反事实的冲击。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Second node</b><p>损失激活新的约束与交易。</p></div>
        </div>
        <p>
          网络模型可以展示重叠持仓、杠杆和冲击函数怎样产生传播，但模型输出仍取决于 margin、liquidation rule、dealer response 和替代资本参数。共同下跌只是待解释现象，不能自动证明传染。<Cite n={40} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="four-layer-state">
        <p className="section-kicker">10 · 四层 Crowding State</p>
        <h2>一个不误导的拥挤诊断至少要把 position、trigger、execution 与 feedback 四层并列；缺一层就只能回答局部问题。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="拥挤诊断四层状态，可横向滚动">
          <table className="concept-table">
            <caption>单一 crowding score 隐藏了哪些状态</caption>
            <thead><tr><th scope="col">层</th><th scope="col">核心变量</th><th scope="col">能回答</th><th scope="col">不能回答</th></tr></thead>
            <tbody>
              <tr><th scope="row">Position</th><td>direction、size、overlap、factor、holder</td><td>共同暴露在哪里</td><td>何时会行动</td></tr>
              <tr><th scope="row">Trigger</th><td>flow、margin、limit、recall、horizon</td><td>哪些约束可能同时生效</td><td>是否会成交</td></tr>
              <tr><th scope="row">Execution</th><td>target、order、fill、ADV、depth、dealer</td><td>出售相对承接容量多大</td><td>二轮损失如何传播</td></tr>
              <tr><th scope="row">Feedback</th><td>impact、NAV、collateral、vol、new flow</td><td>价格是否成为下一轮输入</td><td>结构参数是否正确</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Dashboard 应为每层同时显示 as-of time、data age、coverage、model version 与 uncertainty。一个 overlap 排名最多描述 position；只有加入相关触发、实际成交容量和反馈敏感度，才接近压力诊断。即使如此，它仍是情景工具，不是确定性预警。<Cite n={16} /><Cite n={18} /><Cite n={40} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="common-benchmark">
        <p className="section-kicker">11 · Common Benchmark 与 Habitat</p>
        <h2>共同 benchmark 会让许多组合共享一层被动底座和相似风险坐标，却不会自动规定相同 active weights 或相同退出动作。</h2>
        <p>
          被动产品按指数规则形成目标；benchmark-aware 主动经理则围绕同一指数管理行业、国家、因子和 tracking risk。相对 benchmark 的均值—方差目标会直接改变组合选择，因此两类资金都可能集中在 benchmark universe 内，原始持仓 cosine 因而很高。类别化投资和委托流量还会让资金在相同 style habitat 内移动，使不同证券因共同持有人而产生额外共同运动。<Cite n={14} /><Cite n={15} /><Cite n={69} /><Cite n={70} />
        </p>
        <p>
          但 2.18 已经建立了关键断点：共同 benchmark 先形成 benchmark state，再经各自 alpha、实际库存、风险预算、税务、融资和成本生成 target；target 经不同执行才成为 actual fill。因此研究共同主动观点要使用 active weights，而不是 raw holdings；研究共同卖压还要继续观察 trigger 与 fill。Roll 直接支持 benchmark-relative 目标改变组合选择，却不支持“同 benchmark 必然同持仓”；后半条链是本节基于 2.09–2.18 账本作出的机制综合。<Cite n={70} />
        </p>
      </section>

      <section className="lesson-section" id="signal-position">
        <p className="section-kicker">12 · Similar Signal ≠ Same Position</p>
        <h2>预测只提供希望承担的边际方向；现仓、基准、风险、融资和成本共同决定最终组合，因而同一信号可以生成买入、少卖或不交易。</h2>
        <div className="equation-card">
          <span>Signal-to-position 是一个受约束映射</span>
          <div>x<sub>i,t</sub><sup>*</sup>=G(s<sub>i,t</sub>, x<sub>i,t</sub><sup>actual</sup>, b<sub>i,t</sub>, Σ<sub>i,t</sub>, limits<sub>i,t</sub>, funding<sub>i,t</sub>, cost<sub>i,t</sub>)</div>
          <p>s 是信号，actual 是当前持仓，b 是 benchmark，Σ 是风险模型；limits、funding 与 cost 分别代表授权、融资和实施条件。G 不是通用闭式公式，而是提醒：观察到 signal 仍未观察 target，更未观察 order 或 fill。</p>
        </div>
        <p>
          两名量化经理都预测 X 相对 Y 上涨，一名已经受 X concentration cap 约束，只能减少原计划卖出；另一名当前低配 X，可能主动买入。相同模型标签也不能证明相同输入：训练窗、survivorship cleaning、交易时钟、borrow filter 与估值方式会改变信号和可执行仓位。August 2007 说明共同因子损失与快速去杠杆是有力解释，但不能据此重建每家基金的完整头寸。<Cite n={18} /><Cite n={19} /><Cite n={42} />
        </p>
      </section>

      <section className="lesson-section" id="model-monoculture">
        <p className="section-kicker">13 · Data and Model Monoculture</p>
        <h2>当数据供应商、特征工程、协方差模型和回测选择过程趋同，竞争可能筛选出看似不同、实则共享隐藏风险的策略。</h2>
        <p>
          共同数据使错误、延迟和 corporate-action 处理同步；共同因子库使许多团队用同一维度解释风险；共同 optimizer 又把不同 alpha 压入相似可行域。更隐蔽的是 selection effect：行业会保留近期表现好的模型，而这些模型可能只是共同受益于同一 regime。Comomentum 试图从策略腿内部的异常高频相关性寻找套利活动痕迹，August 2007 的交易数据则揭示了相关去杠杆，但两者都不是完整实时持仓数据库。<Cite n={19} /><Cite n={42} />
        </p>
        <p>
          收益型拥挤指标还会受陈旧定价与收益平滑影响。非流动基金的低表面波动可能不是风险很小，而是价格反应被摊到多个期间；在冲击时，隐藏共性才一次暴露。模型名称相同也不够：不同估计窗、shrinkage、风险下限、执行和治理可以显著改变组合。<Cite n={46} />
        </p>
      </section>

      <section className="lesson-section" id="style-categories">
        <p className="section-kicker">14 · Style Investing 与类别化需求</p>
        <h2>投资者常先决定“价值、成长、低波或 ESG 配多少”，再在类别内部选证券；类别资金流因而可以创造跨公司共同需求。</h2>
        <p>
          Style investing 把复杂证券压缩成可交易类别，降低认知和治理成本，却也让同类证券共享申购、赎回和再平衡。证券一旦被重新分类，可能在基本面没有同步变化时改变它的共同持有人和价格共振对象。市场层 herding 研究有时用横截面收益离散度在极端市场中的收缩来寻找共同方向，但 beta、波动和宏观消息也会改变离散度，不能由收益形态直接反推账户动机。<Cite n={9} /><Cite n={10} /><Cite n={14} />
        </p>
        <p>
          类别化既可能延迟个股信息，也可能把新信息快速扩散到相关资产。要判断是哪一种，必须比较类别资金流、证券基本面、持仓变化和之后的反转，而不是把“相关性上升”直接命名为非理性拥挤。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="information-cascade">
        <p className="section-kicker">15 · Informational Cascade</p>
        <h2>当先行者的可见行动携带的信息超过后续者的私人信号，理性主体也可能放弃自己的证据并加入错误级联。</h2>
        <p>
          在顺序模型中，每个人先观察私人信号，再看到前人行动。若早期几次行动恰好同向，后续者会推断公共信息很强；当自己的信号不足以推翻这个推断时，最优行动不再反映私人信息，新的行动又几乎不增加信息，却进一步强化外观一致性。级联因此脆弱：一段很小的早期随机序列可以决定后来许多人的行动。<Cite n={2} /><Cite n={3} />
        </p>
        <p>
          现实金融市场同时有价格、研究、持仓披露和反向交易，远比二元顺序模型丰富。强而可验证的私人信息、独立收益、看不见他人动作、反向激励或价格迅速吸收订单，都可能打断 cascade。模型提供一种可能机制，不授权我们把共同交易直接称为信息级联。<Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="career-herding">
        <p className="section-kicker">16 · Career Concern 与 Reputational Herding</p>
        <h2>当能力由相对同行结果推断时，“独自犯错”可能比“和大家一起犯错”更昂贵，经理因而愿意牺牲部分私人观点。</h2>
        <p>
          声誉模型的关键不是经理喜爱一致，而是委托人无法直接观察能力，只能从结果推断。一个偏离共识的失败同时伤害收益和能力评价；共同失败更容易被解释为市场冲击。职业顾虑、短考核期和同业可见度因此能使理性管理人趋同。实证和结构研究还表明，herding 与技能、职业阶段和价格效果的关系具有异质性，不能给所有管理人贴统一标签。<Cite n={1} /><Cite n={12} /><Cite n={13} />
        </p>
        <p>
          高 manager ownership、长期锁定合约、明确 absolute-return mandate、容忍短期偏离的治理或对独立研究过程的评价，都能降低这种激励。反过来，改用一个 benchmark 并不只会增加 herding：恰当的 benchmark 也能改善问责，限制经理把市场 beta 包装成技能。这里存在治理收益与系统外部性之间的权衡，而非单向结论。<Cite n={1} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="flow-performance">
        <p className="section-kicker">17 · Flow–Performance Feedback</p>
        <h2>近期表现吸引资金，新增资金继续购买原策略，价格压力又改善表现；反转时同一链条可以倒转为赎回与减仓。</h2>
        <p>
          委托资金不是被动背景。若投资者根据近期排名追逐策略，流入会按基金既有权重或新 target 配置，推高共同持仓并延续收益；经理看到风险预算扩大，又可能增加规模。价格上涨、绩效、流量和仓位形成正反馈。Vayanos–Woolley 与 flow-based return predictability 研究提供了不同层次的理论和实证解释，但都不能把所有 momentum 归因于基金流量。<Cite n={15} /><Cite n={23} /><Cite n={24} />
        </p>
        <p>
          链条可以在入口处断裂：基金关闭申购、保留现金、把新资金配置到未拥挤资产，或投资者基于长期而非短期结果分配；也可以在反转处被 swing pricing 和稳定资本削弱。只有真实 flow 穿过组合与执行账本，才改变市场。<Cite n={23} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="optimizer-convergence">
        <p className="section-kicker">18 · Portfolio Construction 的同质化</p>
        <h2>不同 alpha 可以被相同协方差矩阵、benchmark 与约束压入相似的风险组合；可行域往往比预测本身更决定实际仓位。</h2>
        <p>
          如果许多经理都限制 sector active weight、beta、tracking error、turnover 和 single-name risk，优化器会优先选择少数成本低、模型相关性高的 hedge 和表达工具。组合约束会改变 alpha 向实际持仓的 transfer；当 covariance、约束与成本输入也相似时，不同 alpha 可能被压入相近角点。共同风险模型若遗漏 liquidity、crowding 或非线性，大家又会同时把同一暴露误认作已被对冲。这是条件机制而非“相同优化器必然同解”。<Cite n={70} /><Cite n={71} />
        </p>
        <div className="precision-note">
          <span>相同 optimizer 不保证相同解</span>
          <p>Risk aversion、benchmark、现仓、tax lot、borrow、capacity、covariance vintage 与 transaction-cost surface 任何一项不同，都可能改变角点。判断同质化必须比较输入、约束和输出，而不是软件名称。</p>
        </div>
      </section>

      <section className="lesson-section" id="passive-mechanical">
        <p className="section-kicker">19 · Passive、Index 与 Mechanical Demand</p>
        <h2>规则化产品会产生可预测目标变化，但可预测不等于价格必然失稳；主动套利者既可能抢跑，也可能提供承接。</h2>
        <p>
          指数纳入、剔除、free-float 更新和 reconstitution 会改变跟踪产品的 target；ETF 与被动基金的现金流也会沿指数权重分配。这种需求不以个股估值为首要条件，因此能改变共同持有人网络与流动性共性。现行 MSCI 方法论提供一套具体、版本化的 eligibility、free-float 与重构规则；历史指数研究则记录了可预测再平衡的执行与价格压力。主动管理人又可能因 benchmark risk 或预期事件提前交易，使机械需求的经济影响早于生效日出现。<Cite n={17} /><Cite n={20} /><Cite n={61} /><Cite n={72} /><Cite n={73} /><Cite n={74} />
        </p>
        <p>
          但公开规则也给套利资本准备时间。若事件充分预期、替代资本充足、跟踪者分散执行且证券深度高，目标变化可以主要通过持有人转移被吸收。要识别价格效应，仍需适用 AUM、事前持仓、目标缺口、actual fills、对照资产和反转路径；指数标签本身不是冲击系数，历史 reconstitution 结果也不是跨时期常数。<Cite n={20} /><Cite n={61} /><Cite n={73} /><Cite n={74} />
        </p>
      </section>

      <section className="lesson-section" id="common-investor-funding">
        <p className="section-kicker">20 · Common Investors、Prime Brokers 与 Funding Conditions</p>
        <h2>策略即使没有共同模型，也会因相似投资者、共同 prime broker 或同一 dealer 资产负债表而获得相关触发器。</h2>
        <p>
          Investor-base similarity 使赎回在宏观冲击下相关；短期限投资者更可能在压力中同步退出。共同 prime broker 可以在内部风险模型、集中限额或自身资本收紧时同时提高多个客户的 margin；dealer 受损又会降低融资和承接能力，把原本不相关的策略连接起来。对冲基金危机交易与流动性共性研究都说明，主体连接不仅在“持有同一证券”，也存在于负债和中介网络。<Cite n={20} /><Cite n={21} /><Cite n={44} /><Cite n={45} />
        </p>
        <p>
          Archegos 进一步展示了一个不同结构：不是许多经理独立拥挤在同一交易，而是一个客户通过多个 prime brokers 建立不透明的合成集中，银行分别对冲并在违约后竞速退出。多元融资来源只有在 exposures 真正可见、collateral pools 独立、limits 被执行且资本锁定时才降低相关触发；名义上的多家融资方可能反而隐藏总集中。<Cite n={63} />
        </p>
      </section>

      <section className="lesson-section" id="data-clocks">
        <p className="section-kicker">21 · Data Clocks 与 Knowable-when</p>
        <h2>持仓发生、报告期结束、申报、公开和研究者取得数据是五个不同时间；只有最后一个不晚于信号时点，回测才没有偷看未来。</h2>
        <div className="equation-card">
          <span>研究可用性约束</span>
          <div>positionAsOf（期末报告中通常 = periodEnd） → filedAt → publicAt → observedAt；　Available(record,t) ⇔ observedAt(record) ≤ decisionAt(t)</div>
          <p>这些字段是不同语义的时钟，不是假定所有数据源都具有完全相同的严格不等式；现实中 filedAt 与 publicAt 可能接近，修订数据又可能使 observedAt 晚于首次公开。用于历史决策的记录必须满足 observedAt≤decisionAt，并保存当时版本；把 3 月末持仓从 3 月末直接回填，会使用后来才知道的信息。</p>
        </div>
        <p>
          截至 2026-08-31，Form 13F 仍是季度报告并通常在季末后 45 日内提交，主要覆盖规定证券的 long positions，不提供股票短仓；SEC 的相关 FAQ 是 staff views。Form N-PORT 的 2024 修订已被正式延期，2026 年关于申报与公开安排的进一步修改仍标为 proposed rule，不能把提案字段当作已经存在的实时数据。<Cite n={52} /><Cite n={53} /><Cite n={54} /><Cite n={55} />
        </p>
        <p>
          FINRA short interest 是每月两次的结算日存量，short-sale volume 是特定场所的期间交易流；Rule 13f-2/Form SHO 又处于自 2026-01-02 至 2028-01-02 的临时豁免期。CFTC COT 一般将周二聚合持仓在周五发布，分类基于申报的主要业务，不能识别单一基金或真实动机。数据频率、身份覆盖和时间延迟必须与 crowding 指标同屏。<Cite n={56} /><Cite n={57} /><Cite n={58} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="exposure-mapping">
        <p className="section-kicker">22 · Physical 与 Synthetic Exposure</p>
        <h2>法律持仓说明合同归属，经济暴露说明价格变化怎样影响 P&amp;L；拥挤系统必须保留两本账并在明确 netting set 内连接。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="现货与合成暴露映射，可横向滚动">
          <table className="concept-table">
            <caption>从法律头寸到经济风险的最小字段</caption>
            <thead><tr><th scope="col">工具</th><th scope="col">至少保存</th><th scope="col">不能只看</th></tr></thead>
            <tbody>
              <tr><th scope="row">Cash security</th><td>quantity、market value、currency、issuer/underlying</td><td>证券名称或份额数</td></tr>
              <tr><th scope="row">Future / forward</th><td>notional、multiplier、FX、maturity、margin</td><td>账面市值</td></tr>
              <tr><th scope="row">Option</th><td>delta notional、gamma、vega、strike、expiry、scenario P&amp;L</td><td>premium 或单点 delta</td></tr>
              <tr><th scope="row">TRS / swap</th><td>underlying、direction、notional、counterparty、netting set、collateral</td><td>公开股票 long holdings</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          线性工具可先用每合约经济名义暴露统一；期权的 delta 只在局部价格变化下有效，压力研究还需要 gamma、vega 和跳跃情景。对手方净额只有在同一可执行 netting set 内成立，不能跨法律实体或抵押池随意抵消。Archegos 表明，仅凭公开 long positions 或单家银行视角，可能看不见跨 prime broker 汇总后的 TRS 集中。<Cite n={52} /><Cite n={53} /><Cite n={63} />
        </p>
      </section>

      <section className="lesson-section" id="minimum-overlap">
        <p className="section-kicker">23 · Minimum Overlap</p>
        <h2>Minimum overlap 回答较小 long-only 组合有多少资本也存在于另一组合中；它不读取方向以外的风险、流动性或触发器。</h2>
        <div className="equation-card">
          <span>非负长期经济暴露的重叠率</span>
          <div>O<sub>ij</sub><sup>min</sup>=Σ<sub>k</sub>min(l<sub>ik</sub>,l<sub>jk</sub>) / min(Σ<sub>k</sub>l<sub>ik</sub>,Σ<sub>k</sub>l<sub>jk</sub>)</div>
          <p>l 是统一币种与同一时点上的非负长期经济暴露。若较小组合总长期暴露为零，比例未定义；若两边都全额 long-only，O 位于 0 与 1。分母选择意味着指标以较小组合为参照，和按平均规模或并集归一化的指标不可直接比较。</p>
        </div>
        <p>
          逐证券取 minimum 能直观回答共同资本，但相同 50% 可以来自一个巨大共同头寸，也可以来自数百个微小头寸；前者更受单一事件影响，后者可能更受共同因子和流量影响。指标还会被公开数据覆盖、衍生品缺失和 issuer mapping 改写，必须同时报告规模分布和 coverage。<Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="cosine-overlap">
        <p className="section-kicker">24 · Signed、Gross 与 Active Cosine</p>
        <h2>Cosine 比较暴露向量的方向和形状；保留符号、去掉符号或减去 benchmark，会得到三个回答不同问题的相似度。</h2>
        <div className="equation-card">
          <span>三种向量必须分别命名</span>
          <div>Cos(x<sub>i</sub>,x<sub>j</sub>)=(x<sub>i</sub>′x<sub>j</sub>)/(‖x<sub>i</sub>‖‖x<sub>j</sub>‖)；　a<sub>ik</sub>=w<sub>ik</sub>−b<sub>i,k</sub></div>
          <p>Signed cosine 对有符号经济暴露 x 计算，+1/−1 分别表示同向/反向形状；gross cosine 对 |x| 计算，识别是否使用相同风险载体；active cosine 对 a=w−b 计算，剔除共同 benchmark 底座。任一向量范数为零时 cosine 未定义，不能强行填 0。</p>
        </div>
        <p>
          两个 market-neutral 组合可以 gross cosine 很高、signed cosine 为 −1：它们交易同一证券，却方向相反，可能在正常价格风险上互相抵消，但仍共享 borrow、liquidity 和 counterparty infrastructure。两个 long-only 基金 raw cosine 接近 1，也可能只是因为共同 benchmark；active cosine 才更接近主动拥挤。<Cite n={18} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="bipartite-network">
        <p className="section-kicker">25 · Fund–Security Bipartite Network</p>
        <h2>基金和证券天然构成二部图；过早投影为“基金彼此相连”或“证券彼此相连”，会丢掉连接由谁、以多大方向暴露造成。</h2>
        <div className="equation-card">
          <span>保留原始持仓矩阵 H</span>
          <div>Fund projection ∝ HH′；　Security projection ∝ H′H</div>
          <p>H 的行是 holder，列是 security，元素需声明是市场价值、ownership share、signed notional 还是 stress loss。HH′ 强调共同证券，H′H 强调共同持有人；未经归一化的乘积会被大基金和大证券支配，也会掩盖 long/short 方向。</p>
        </div>
        <p>
          网络 stress test 应从二部图出发：先对某基金施加 loss、flow 或 margin shock，生成真实或规则化出售，再由 price-impact function 重估其他节点。只看投影 centrality 不能得知某连接是小额多头、方向相反的 hedge，还是占流通量很大的强制卖出通道。<Cite n={17} /><Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="ownership-hhi">
        <p className="section-kicker">26 · HHI、Top-k 与 Coverage</p>
        <h2>HHI 把持有人份额平方后相加，强调大持有人；只有分母和未观察部分都明确时，它才是可比较的所有权集中度。</h2>
        <div className="equation-card">
          <span>证券 k 的持有人集中度</span>
          <div>HHI<sub>k</sub>=Σ<sub>i</sub>s<sub>ik</sub>²；　s<sub>ik</sub>=observable holding<sub>ik</sub>/chosen ownership denominator<sub>k</sub></div>
          <p>分母可以是流通股、发行量或可观察基金持仓，但必须在产品间一致。若只覆盖 60% 所有权，剩余 40% 应作为 residual 或以区间呈现；把已观察持有人重新归一到 100% 会机械抬高 HHI。</p>
        </div>
        <p>
          HHI 应与 Top-1、Top-5、holder type、flow covariance 和 data coverage 并列。0.38 可以来自 50/30/20 三家持有人，但不能说明这三家的赎回或 margin 是否相关；后面还会看到，大型持有人有时会因内部化 price impact 而更少出售。<Cite n={16} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="lsv-measure">
        <p className="section-kicker">27 · LSV Herding Measure</p>
        <h2>LSV 指标测某证券当期机构买方比例偏离总体买方概率多少，并扣除有限样本下随机一致也会产生的偏离。</h2>
        <div className="equation-card">
          <span>同期方向一致性，而非动机识别</span>
          <div>HM<sub>k,t</sub>=|p<sub>k,t</sub>−p<sub>t</sub>|−AF<sub>k,t</sub></div>
          <p>p_k,t 是当期交易证券 k 的机构中买方比例，p_t 是该期全样本买方基准概率；AF 是在给定交易机构数和 p_t 下，随机二项买卖造成的期望绝对偏离。不同文献会进一步区分 buy/sell herding，不能在未声明时混用。</p>
        </div>
        <p>
          指标高说明 co-trading pattern 超过随机基准，却无法区分经理相互模仿、共同盈利信息、同一指数调整、共同流量或被迫分批执行。价格影响也不是由名称保证：共同买入可以包含信息并加速价格发现，也可能在之后反转。<Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="sias-measure">
        <p className="section-kicker">28 · Sias Dynamic Herding</p>
        <h2>Sias 框架把问题从“这一期是否一起买”推进到“本期机构需求为何延续上期需求”，并区分追随自己与追随别人。</h2>
        <p>
          一个动态实现通常先按证券—季度标准化机构买方比例，再检验本期标准化需求与上期的横截面相关，并把贡献拆成同一机构重复自己的交易与不同机构跟随其他人的交易。这比单期 LSV 更接近行动序列，但仍需控制过去收益、benchmark changes、资金流和大订单分批执行。<Cite n={7} /><Cite n={8} /><Cite n={11} /><Cite n={12} />
        </p>
        <p>
          如果一只基金把一个大 target 分三个月执行，数据会显示自身交易持续；如果许多基金依次读取同一盈利信息，也会显示跨机构持续。动态相关能排除一部分纯同期巧合，却不自动揭示声誉、信息 cascade 或执行算法。<Cite n={7} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="factor-comomentum">
        <p className="section-kicker">29 · Factor Crowding 与 Comomentum</p>
        <h2>当完整持仓不可得时，可以从共同因子风险和策略腿异常相关寻找拥挤痕迹，但 proxy 不能被升级为账户事实。</h2>
        <div className="equation-card">
          <span>净方向与共同载体要分开</span>
          <div>C<sub>f</sub><sup>net</sup>=Σ<sub>i</sub>AUM<sub>i</sub>β<sub>i,f</sub>；　C<sub>f</sub><sup>gross</sup>=Σ<sub>i</sub>AUM<sub>i</sub>|β<sub>i,f</sub>|</div>
          <p>若 β 为无量纲因子 beta，C 的单位是货币暴露，而不是已经计算好的 factor risk。要转成风险，必须先固定预测期 H，并让保留方向的净因子暴露向量 C<sup>net</sup> 进入协方差式 √[(C<sup>net</sup>)′Σ<sub>f</sub>(H)C<sup>net</sup>]，再按明确方法分解 marginal 或 component risk；只有在单因子且忽略协方差的简化中，|C<sub>f</sub><sup>net</sup>|σ<sub>f</sub>(H) 才是一阶货币波动代理，其中 σ<sub>f</sub>(H)=√Σ<sub>f,f</sub>(H)。C<sup>gross</sup> 已对方向取绝对值，只用于描述共同使用某因子的规模，不能直接代入组合损益协方差式。Risk budget 是用来比较、分配或约束风险的额度，不能与暴露机械相乘。Net 与 gross 都依赖估计模型和 AUM coverage。</p>
        </div>
        <p>
          Comomentum 使用典型 momentum long/short 腿股票之间、经市场和基本因素调整后的高频异常相关性推断套利活动。当策略更拥挤时，共同交易可能让腿内证券额外共动；但全市场波动上升也会普遍提高相关性，所以必须使用异常基准、时间结构和之后的反转验证。它特别适合一种策略，不是通用 crowding score。<Cite n={18} /><Cite n={19} /><Cite n={42} />
        </p>
      </section>

      <section className="lesson-section" id="fragility-exit-days">
        <p className="section-kicker">30 · Flow Fragility 与 Exit Days</p>
        <h2>持仓重叠只有与相关资金冲击和市场容量连接后，才开始回答“同一资产可能承受多大的共同出售”。</h2>
        <div className="equation-card">
          <span>两个互补的教学诊断</span>
          <div>Fragility<sub>k</sub>=h<sub>k</sub>′Ω<sub>flow</sub>h<sub>k</sub>；　ExitDays<sub>k</sub>=Σ<sub>i</sub>Q<sub>ik</sub><sup>required sale</sup>/(ρ·ADV<sub>k</sub>)</div>
          <p>第一式是标准化教学形式：h_k 是各持有人对证券 k 的统一暴露向量，Ω_flow 是同一频率下的资金流冲击协方差，单位随标准化而定；它表达相同 HHI 下相关流量更脆弱。第二式中 Q≥0 是尚未成交的必要出售量，0&lt;ρ≤1 是允许参与率，ADV&gt;0 且与 Q 同为股数或货币量；Q=0 时 exit days=0，若 Q&gt;0 而可用容量为零，则没有有限 exit days，不能报告为 0。</p>
        </div>
        <p>
          Exit days 是执行时间代理，不是价格冲击模型。压力中屏幕成交量可能下降，也可能因强制交易而激增；与此同时 spread、可成交深度、dealer inventory 和自然买家都可能恶化。因此正常 ADV 既可能高估也可能低估表面成交量，却无论如何不能替代压力状态下的可执行容量。Block buyer、交叉交易、in-kind transfer 或政策 backstop 又能增加承接。最好报告正常、压力和极端三套容量，而不是一个精确小数。<Cite n={16} /><Cite n={20} /><Cite n={22} /><Cite n={23} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="trigger-taxonomy">
        <p className="section-kicker">31 · Trigger Taxonomy</p>
        <h2>同一持仓只有在约束开始生效时才生成行动；不同触发器决定方向、紧迫度、可替代资产和执行时钟。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="拥挤退出触发器分类，可横向滚动">
          <table className="concept-table">
            <caption>从事件到必须行动之间还隔着什么</caption>
            <thead><tr><th scope="col">Trigger</th><th scope="col">先影响</th><th scope="col">候选行动</th><th scope="col">断链条件</th></tr></thead>
            <tbody>
              <tr><th scope="row">Information</th><td>估值与预期收益</td><td>主动改 target</td><td>信息已计价或观点异质</td></tr>
              <tr><th scope="row">Redemption</th><td>现金义务</td><td>现金瀑布与 sale target</td><td>buffer、in-kind、LMT</td></tr>
              <tr><th scope="row">Margin / haircut</th><td>抵押品与可用权益</td><td>补资、换抵押品或去杠杆</td><td>long-term funding、netting</td></tr>
              <tr><th scope="row">Risk / vol limit</th><td>模型 risk usage</td><td>校验、hedge、减仓或例外</td><td>治理裁量与替代对冲</td></tr>
              <tr><th scope="row">Borrow recall</th><td>维持空头的法律能力</td><td>寻找替代借券或回补</td><td>stable supply、term borrow</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          触发器还可能内生：价格下跌提高波动率，波动率提高 margin 和 risk usage；赎回预期又促使投资者提前赎回。时间戳必须覆盖 event、calculation、notice、deadline、decision、order 与 fill，才能判断多主体约束是否真的同步。<Cite n={43} /><Cite n={45} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="target-order-fill">
        <p className="section-kicker">32 · Target Reduction ≠ Actual Fills</p>
        <h2>压力情景给出 desired liquidation，治理才批准 target，交易台再决定 order；只有 fill 直接进入价格和实际持仓。</h2>
        <p>
          Crowding dashboard 常把“若全部主体按规则减仓”的估计量画成待售规模，但这不是已发生的订单。经理可以用现金、卖出更液态的替代资产、用期货 hedge、向 prime broker 补 collateral、申请 limit exception，或等待自然流量；order 又可能被拆分、撤销、拒绝和部分成交。故每层都需要独立时间与数量字段。<Cite n={22} /><Cite n={42} /><Cite n={60} />
        </p>
        <div className="causal-chain" aria-label="从拥挤触发到实际价格影响的执行链" role="list">
          <div role="listitem"><span>01</span><b>Stress estimate</b><p>规则或情景下的候选缺口。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Validate</b><p>持仓、价格、margin、flow 与 model。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Authorize</b><p>target、deadline、例外和责任人。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Route</b><p>资产选择、限价、参与率和 venue。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Fill</b><p>成交量、价格、未成交和费用。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Revalue</b><p>新持仓、权益、风险与下一轮约束。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="dealer-capacity">
        <p className="section-kicker">33 · Dealer Capacity 与 Nonlinear Impact</p>
        <h2>同样的出售量在正常与压力状态可以产生完全不同的价格路径，因为承接者的库存、资本、融资和风险限额本身也在变化。</h2>
        <div className="equation-card">
          <span>用于压力情景的状态依赖冲击曲线</span>
          <div>ΔP<sub>H</sub>/P<sub>0</sub>=−η<sub>s</sub>·sign(Q)·|Q/V<sub>s</sub>(H)|<sup>δ<sub>s</sub></sup>；　V<sub>s</sub>(H)=ADV<sub>s</sub>·H</div>
          <p>先把执行窗口 H 固定为交易日数：若 ADV_s 是每日股数或每日货币成交率，V_s(H) 就是该窗口内与 Q 同单位的预期市场成交量，因此 Q/V_s(H) 与 η_s 都是无量纲量。约定 Q&gt;0 为净卖出、Q&lt;0 为净买入；s 表示市场状态，η_s≥0 是冲击尺度，δ_s&gt;0 是曲率，H&gt;0 且 V_s(H)&gt;0。若交易台另设 0&lt;ρ≤1 的参与率上限，它是可执行性约束 |Q|≤ρV_s(H)：不满足时应延长 H、减少 Q 或改变路径，不能在固定 Q 与 H 后又把 ρ 放进分母机械放大总冲击。成交率与冲击参数都可能随状态及窗口改变。该式只是可校准情景函数，不是跨资产普适定律；若数据采用相反订单符号，公式也必须同步改写。</p>
        </div>
        <p>
          Dealer 若能暂时持有库存，销售会在时间上平滑；若自身因损失、VaR、capital 或融资收紧而退出，订单会直接寻找更低价格的终端买家。2020 年 3 月的官方复盘说明，广泛现金需求、杠杆非银出售与 dealer capacity 共同作用，不能用正常时期 ADV 或单一主体解释。<Cite n={30} /><Cite n={32} /><Cite n={66} />
        </p>
      </section>

      <section className="lesson-section" id="funding-liquidity">
        <p className="section-kicker">34 · Funding-Liquidity Spiral</p>
        <h2>市场难卖会提高融资方的损失和保证金担忧，融资收紧又迫使更多销售，使 market liquidity 与 funding liquidity 双向恶化。</h2>
        <p>
          第一轮价格冲击降低持仓和抵押品价值；lender 提高 haircut、要求 variation margin 或缩减额度；交易者为获得现金出售资产，dealer 同时因库存风险扩大 spread；新的成交价格又成为下一轮 mark-to-market。这个正反馈解释了为何“基本面冲击不大”仍可能产生大幅短期价格偏离，也解释了为何在错价最深时套利资本反而最稀缺。<Cite n={33} /><Cite n={34} /><Cite n={35} />
        </p>
        <div className="precision-note">
          <span>螺旋需要闭环，而不是一条箭头</span>
          <p>若 margin 固定、融资期限足够长、可替代抵押品充足、资本可及时注入或长期买家愿意承接，价格下跌不必返回为新的强制销售。研究必须观察反馈箭头，而不是只观察两项同时恶化。</p>
        </div>
      </section>

      <section className="lesson-section" id="leverage-haircut">
        <p className="section-kicker">35 · Leverage 与 Haircut Cycle</p>
        <h2>好时期低波动与低 haircut 允许更高杠杆，坏时期相反；融资条件的顺周期性会在两个方向放大资产需求。</h2>
        <p>
          当价格稳定、模型风险低、抵押品容易出售时，融资方愿意降低 initial margin，交易者可以用相同权益持有更多资产；需求和流动性改善又验证低风险表象。冲击发生后，估计波动和相关性上升，haircut 提高，净资产同时因损失缩小；去杠杆需要卖资产或补充权益，销售进一步压低价格。Leverage cycle 与 liquidity black hole 模型把这种互补性写成内生状态。<Cite n={35} /><Cite n={36} /><Cite n={37} />
        </p>
        <p>
          静态 leverage ratio 不能给出触发时点。真正要保存的是 margin schedule、threshold、minimum transfer amount、netting、eligible collateral、maturity 与 lender discretion。长期、无追索或没有逐日盯市的融资能让高经济杠杆暂时不产生 forced sale；即时可撤融资则相反。<Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="redemption-nav">
        <p className="section-kicker">36 · Redemption–NAV Spiral</p>
        <h2>当赎回成本没有完全由退出者承担，低 NAV、预期稀释和下一轮赎回会把共同持仓网络转化为重复销售。</h2>
        <p>
          投资者先提交 redemption request，基金按规则确认份额与金额，再由现金、到期资产、借贷、流动性工具和 sale target 支付。若清算冲击在退出价格之后才实现，剩余持有人承担更高成本，理性投资者会更早退出；多个持有相似资产的基金若拥有相似 investor base，flow shock 便会相关。<Cite n={24} /><Cite n={25} /><Cite n={26} />
        </p>
        <p>
          2020 年公司债基金研究与 fire-sale spillover 证据说明，流动性错配、共同持仓和政策 backstop 可以在同一事件中作用。但产品可用 swing pricing、anti-dilution levy、redemption fee、in-kind、gate 或现金缓冲改变成本和时钟；这些工具的法定条件与 2.17 已详述，本节只追踪它们怎样改变 trigger correlation 与 actual sale。<Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="volatility-etp">
        <p className="section-kicker">37 · Volatility ETP 与 Mechanical Rebalancing</p>
        <h2>每日维持杠杆或反向目标的产品会在标的已经大幅变化后集中再平衡，使价格变化成为同向订单的新输入。</h2>
        <p>
          反向 volatility ETP 在 VIX futures 上涨后，为恢复每日目标可能需要买入更多合约；杠杆产品也会因目标 notional 相对 NAV 改变而交易。如果多只产品使用相同收盘窗口，目标量相对期货深度过大，买入会进一步推高期货与波动率指标，造成新的再平衡需求。这里是规则、状态和执行共同形成的 positive feedback。<Cite n={60} /><Cite n={61} />
        </p>
        <p>
          该机制不能外推成“所有 vol-control、CTA 和 risk-parity 都在卖股票”，也不能解释整个股票跌幅。不同产品持仓、重置规则、期货期限、对冲和执行窗口不同；BIS 材料支持它是 2018 年 2 月尾盘 VIX spike 的关键放大器，而非全市场唯一原因。<Cite n={60} />
        </p>
      </section>

      <section className="lesson-section" id="short-squeeze">
        <p className="section-kicker">38 · Short Squeeze、Borrow Recall 与数据边界</p>
        <h2>空头只有在价格损失、margin、借券费用或召回使维持头寸不可行时才被迫买回；高 short interest 本身不是倒计时。</h2>
        <div className="equation-card">
          <span>至少并列三类 short crowd 指标</span>
          <div>SI/Float；　DaysToCover=Short Interest/ADV；　Utilization=Shares on Loan/Lendable Supply</div>
          <p>SI 是结算日未平仓存量，ADV 是成交流量，utilization 读取可借供给；三个比例分别要求 float&gt;0、ADV&gt;0 与 lendable supply&gt;0，分母为零或不可观察时应记为未定义，而不是填 0。还需 borrow fee、供给集中、recall terms、margin buffer、自然买盘和衍生品 hedge；指标频率与来源不同，不能先拼成无误差的单分数。</p>
        </div>
        <p>
          价格上涨消耗空头权益，借券供给收缩或费用上升提高 carry，召回迫使寻找新券或回补；回补买盘又可能推高价格并触发更多 cover。与此同时，卖空也可能来自做市、可转债套利、pair hedge 或有信息的负面研究，高 short interest 不必代表非理性。公开 short-sale volume 不是 short interest，13F 又缺股票短仓；截至 2026-08-31，Form SHO 处于临时豁免期。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={56} /><Cite n={57} /><Cite n={58} />
        </p>
        <p>
          Options dealer 的 gamma hedging 是另一条机制：需要期权持仓、dealer 净 gamma、标的成交和时间对应，不能由 call volume 或价格上涨推断。GameStop 的 SEC staff report 发现 short covering 在若干时段有贡献，但没有数据支持把持续上涨写成 gamma squeeze。<Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="cross-asset-propagation">
        <p className="section-kicker">39 · Cross-asset 与 Common-collateral Propagation</p>
        <h2>一个市场的损失会促使主体出售另一个更液态的资产、补充共同抵押池或收缩中介额度，因此传染不要求卖出原始受冲击资产。</h2>
        <p>
          基金可能保留最想持有但难卖的资产，转而出售国债、股指期货或大型股票筹资；prime broker 在组合净额层提高要求，又会把一个策略损失传给其他仓位；dealer 自身资本受损后同时降低多个市场的库存。二部持仓网络、融资网络和对手方网络叠加，才能描述这种跨资产传播。<Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={44} /><Cite n={45} />
        </p>
        <p>
          资产隔离、独立 collateral pool、non-recourse funding、中央清算净额或未受损长期资本可以阻断路径。相反，“卖最液态资产”的行为会使原本基本面安全的证券短期承压；安全资产下跌不自动表示其信用恶化，必须检查现金与抵押品通道。<Cite n={40} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="resilience">
        <p className="section-kicker">40 · Resilience 与 Shock Absorbers</p>
        <h2>脆弱性研究不能只列放大器；谁能等待、承接、内部化成本或提供可信 backstop，决定反馈是否闭环。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="拥挤反馈断链条件，可横向滚动">
          <table className="concept-table">
            <caption>可能打断拥挤反馈的六类容量</caption>
            <thead><tr><th scope="col">容量</th><th scope="col">作用节点</th><th scope="col">失效风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">Cash / liquid buffer</th><td>赎回与 margin 前</td><td>缓冲也可能很快耗尽</td></tr>
              <tr><th scope="row">Heterogeneous horizon</th><td>自然承接</td><td>长期买家也可能共同受损</td></tr>
              <tr><th scope="row">Stable funding</th><td>避免强制去杠杆</td><td>合同含 discretion 或到期集中</td></tr>
              <tr><th scope="row">Cost internalization</th><td>swing、fee、large-holder restraint</td><td>估值和实施不精确</td></tr>
              <tr><th scope="row">Dealer / arbitrage capital</th><td>库存与跨期平滑</td><td>资本和融资与卖方同受冲击</td></tr>
              <tr><th scope="row">Policy backstop</th><td>恢复需求弹性与市场功能</td><td>覆盖错误、启动太晚或缺乏可信度</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          集中持有人内生考虑 price impact、专业套利资本在有稳定资金时入场、FSB 所述政策工具以及 BoE 在 LDI 压力中的临时购债，都展示了不同断链方式。它们不保证没有损失，也可能带来道德风险和政策边界；但若教材只写正反馈，不写负反馈和容量补充，就会把条件机制误作必然灾难。<Cite n={29} /><Cite n={31} /><Cite n={32} /><Cite n={66} /><Cite n={67} />
        </p>
      </section>

      <section className="lesson-section" id="indicator-causality">
        <p className="section-kicker">41 · Crowding Indicator ≠ Cause</p>
        <h2>“指标很高，后来价格下跌”最多是条件相关；共同基本面、反向因果和指标自身的价格成分都可能制造同一表象。</h2>
        <p>
          假设许多基金在盈利恶化前都降低某行业权重，而该行业随后下跌。持仓一致性可能只是专业投资者独立处理同一信息的结果；若指标使用收益相关、波动或成交量，价格下跌本身还会机械抬高指标。再进一步，经理可能因为预期流动性恶化而提前离场，市场脆弱性是持仓变化的原因而非结果。这三条路径分别对应 omitted common cause、mechanical construction 与 reverse causality，单靠预测回归不能排除。<Cite n={4} /><Cite n={9} /><Cite n={10} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="从拥挤指标到因果结论的竞争解释，可横向滚动">
          <table className="concept-table">
            <caption>观察到 high crowding → low future return 后仍需审计</caption>
            <thead><tr><th scope="col">竞争路径</th><th scope="col">同时解释什么</th><th scope="col">优先反事实</th></tr></thead>
            <tbody>
              <tr><th scope="row">共同基本面</th><td>相似持仓变化与后续盈利／价格</td><td>无相同基本面冲击但遭遇资金流的证券</td></tr>
              <tr><th scope="row">价格进入指标</th><td>相关性、波动与 crowding 同时上升</td><td>使用冲击前冻结持仓、剔除同期收益构件</td></tr>
              <tr><th scope="row">反向因果</th><td>预期流动性恶化导致预先去仓</td><td>不可预见的外生 flow、制度 cutoff</td></tr>
              <tr><th scope="row">真正 forced flow</th><td>预先持仓 × 外生资金缺口 → 销售</td><td>未持有证券 placebo、成交与事后反转</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因此，LSV、收益离散度、comomentum 与 overlap 首先是 measurement／state proxies，不是 treatment。因果设计必须另行定义处理：例如外生 fund flow、制度 cutoff、融资约束冲击，或主体对这类冲击的事前暴露。较强主张需要在指标形成之前冻结信息集，观察处理怎样改变 target 与 fill，并检验价格冲击是否集中于事前持有、难承接的证券。<Cite n={5} /><Cite n={9} /><Cite n={16} /><Cite n={17} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="holdings-identification">
        <p className="section-kicker">42 · Holdings-based Herding 的识别边界</p>
        <h2>离散持仓快照能看到两个端点之间的净变化，却看不到期间的往返交易、订单顺序、未成交量、衍生品对冲和交易动机。</h2>
        <p>
          若基金在季度内先买 10、再卖 10，期末净变化为零；另一基金一直不动，公开快照完全相同。反过来，两家基金都净买入，也可能一家具备新信息，另一家只是收到申购。LSV measure 对证券—期间买方比例做有限样本机会修正，Sias 方法研究机构需求的跨期相关，并可区分重复自身交易与追随其他机构；这些改进使“方向一致性”更可靠，却仍不直接观察模仿动机。<Cite n={5} /><Cite n={6} /><Cite n={7} /><Cite n={8} />
        </p>
        <div className="precision-note">
          <span>Endpoint data 的合法结论</span>
          <p>可以说“在覆盖样本与该期间定义下，机构净持仓变化更同向”；不能直接说“机构在同一日争抢流动性”“基金看见同行后跟随”或“该行为造成价格偏离”。要升级结论，需更高频交易、共同信息控制、benchmark／flow 分组和可验证的先后顺序。</p>
        </div>
        <p>
          持仓披露还漏掉被平仓后不再存在的仓位，并可能把分批执行造成的交易持续性误作跨机构 herding。研究应同时报告 coverage、报告时滞、最小可见仓位、manager 与 fund 的聚合层级，以及证券在期内是否进入或退出报告全集。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="forced-flow-design">
        <p className="section-kicker">43 · Forced-flow Design</p>
        <h2>较强识别从“谁先持有什么”出发，用与单只证券基本面相对分离的基金资金流预测必须出售的方向，再寻找成交、冲击和反转。</h2>
        <div className="equation-card">
          <span>预先持仓映射出的证券销售压力</span>
          <div>PredictedSale$<sub>a,t</sub>=Σ<sub>f</sub>w<sub>f,a,t−1</sub>·max(−Flow$<sub>f,t</sub>,0)</div>
          <p>w 是冲击前冻结的基金 f 对资产 a 的无量纲权重，Flow$ 是同一币种的净申赎金额，正数表示申购、负数表示赎回；因此输出是预测销售金额。若原始 flow 是相对 TNA 的流量率，必须先乘冻结的 lagged TNA；若需要预测股数，再除以预先冻结且可得的价格。这个量预测“若按原组合融资会卖多少”，不是实际成交；现金缓冲、选择性处置和 flow 本身的信息含量仍需处理。</p>
        </div>
        <p>
          一个可复核设计至少按顺序保存：事前持仓 → 投资者 flow 到达 → 基金现金缺口 → 预测 sale exposure → 实际持仓或交易变化 → 短期价格压力 → 中期反转或基本面结果。未被遭遇流量基金持有的相似证券构成 placebo；同一基金持有但流动性更高或更低的证券检验处置选择；事件前趋势则检查资金流是否已经追随即将发生的基本面消息。<Cite n={22} /><Cite n={23} /><Cite n={28} />
        </p>
        <p>
          即使看到价格反转，也不能自动把全部跌幅命名为 fire sale：flow 可能包含投资者信息，经理可能主动卖出信息较差的资产，赎回也可能由基金已知但研究者遗漏的风险驱动。结论应随工具变量、极端流量、基金固定效应、未来现金流控制和成交证据的强弱分级。<Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="natural-experiments">
        <p className="section-kicker">44 · Natural Experiments 与外生边界</p>
        <h2>自然实验不是“事件很突然”，而是某条规则或冲击改变了部分持有人的交易压力，同时尽量不直接改变处理组资产的基本面。</h2>
        <p>
          可用边界包括指数或政策资格 cutoff、基金家族或中介受到的外部冲击、投资者丑闻导致的非绩效赎回，以及产品合并或规则变更。关键不是事件名称，而是四项可检验条件：边界附近资产在冲击前连续；处理概率确实跳变；没有同时发生的另一条价格通道；主体不能精确操纵分组。若政策资格本身传递信用质量信息，就必须把 demand backstop 与 information signal 分开。<Cite n={20} /><Cite n={28} /><Cite n={29} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="自然实验有效性检查，可横向滚动">
          <table className="concept-table">
            <caption>从准外生 variation 到 crowding 机制的最小检查</caption>
            <thead><tr><th scope="col">检查</th><th scope="col">失败意味着什么</th><th scope="col">可做的诊断</th></tr></thead>
            <tbody>
              <tr><th scope="row">Relevance</th><td>事件没有改变 target 或 actual trade</td><td>第一阶段、成交和持仓差</td></tr>
              <tr><th scope="row">Continuity</th><td>处理组本来就不同</td><td>预趋势、协变量平衡、带宽敏感性</td></tr>
              <tr><th scope="row">Exclusion</th><td>事件直接改变现金流或折现率</td><td>替代通道、公告内容、无持仓对照</td></tr>
              <tr><th scope="row">No sorting</th><td>主体围绕阈值选择归组</td><td>密度与操纵检验</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="network-stress">
        <p className="section-kicker">45 · Structural Network Stress Test</p>
        <h2>没有足够危机样本时，可以显式规定冲击、清算与价格冲击规则逐轮重估网络；输出是条件情景，不是无条件预测。</h2>
        <div className="equation-card">
          <span>最小 long-only 迭代：持仓 → 销售 → 价格与现金 → 权益 → 下一轮销售</span>
          <div>Q<sub>ia</sub><sup>(k)</sup>=λ<sub>ia</sub><sup>(k)</sup>q<sub>ia</sub><sup>(k)</sup>；　p<sub>a</sub><sup>(k+1)</sup>=p<sub>a</sub><sup>(k)</sup>−g<sub>a</sub>(Σ<sub>i</sub>Q<sub>ia</sub><sup>(k)</sup>)；　q<sub>ia</sub><sup>(k+1)</sup>=q<sub>ia</sub><sup>(k)</sup>−Q<sub>ia</sub><sup>(k)</sup></div>
          <div>c<sub>i</sub><sup>(k+1)</sup>=c<sub>i</sub><sup>(k)</sup>+Σ<sub>a</sub>Q<sub>ia</sub><sup>(k)</sup>p̄<sub>ia,fill</sub><sup>(k)</sup>−ExternalCashOut<sub>i</sub><sup>(k)</sup>−CollateralPosted<sub>i</sub><sup>(k)</sup>；　m<sub>i</sub><sup>(k+1)</sup>=m<sub>i</sub><sup>(k)</sup>+CollateralPosted<sub>i</sub><sup>(k)</sup></div>
          <div>E<sub>i</sub><sup>(k+1)</sup>=c<sub>i</sub><sup>(k+1)</sup>+m<sub>i</sub><sup>(k+1)</sup>+Σ<sub>a</sub>q<sub>ia</sub><sup>(k+1)</sup>p<sub>a</sub><sup>(k+1)</sup>−L<sub>i</sub><sup>(k+1)</sup></div>
          <p>这里 q≥0 是每轮开始的长期持仓，0≤λ_ia≤1 是由杠杆、margin、赎回和资产选择规则决定的出售比例，所以 0≤Q≤q。价格冲击须限制为 0≤g_a(ΣQ)≤p_a^(k)，避免负价格；p̄_fill≥0，在本轮价格单调下降的最小设定中还要求 p^(k+1)≤p̄_fill≤p^(k)。ExternalCashOut 只含赎回、费用或已结算损失等净流出；仍归主体所有的追加抵押品从现金移入按市值记录的受限资产 m，不机械减少权益。用新权益与新约束重新计算下一轮 λ，反馈才闭合；空头、衍生品、净额、抵押品 haircut 与违约需要额外账本，不能直接塞进这个最小式。</p>
        </div>
        <p>
          每个结果都依赖未直接观察的选择：主体按比例出售还是先卖流动资产，impact 是线性还是凸性，margin 同步还是分散，dealer 是否承接，违约是否跨实体净额。可靠报告应展示无反馈的一轮基准、不同 liquidation rule、impact 参数区间、网络缺边、替代买家和政策 backstop 的敏感性，而不是只给一个“系统损失”点估计。<Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="quant-2007">
        <p className="section-kicker">46 · August 2007 Quant Unwind</p>
        <h2>2007 年 8 月的可靠证据支持“若干量化策略共享因子风险并发生快速去杠杆”，但不能恢复每个账户的发起者、约束和完整持仓。</h2>
        <p>
          Khandani 与 Lo 使用因子及交易数据记录到 2007 年 8 月初多种 long–short equity 策略出现异常同步损失，随后又快速反转；Pedersen 则把这类现象放入多人争夺退出流动性的动态框架。与单纯基本面重估相比，快速、跨策略的损失与短期反转更符合 constrained unwinding 和 price pressure，但这仍是由可见数据支持的结构推断，而不是全部基金账本的直接观察。<Cite n={42} /><Cite n={43} />
        </p>
        <div className="precision-note">
          <span>案例最多支持到哪里</span>
          <p>可以讨论共同因子、交易拥挤、去杠杆与暂时价格冲击；不能说所有量化基金使用同一个模型、持有完全相同证券，或某一家机构被公开证明确为唯一触发者。案例的价值在于展示隐藏 exposure overlap，而非提供完整法证重建。</p>
        </div>
      </section>

      <section className="lesson-section" id="vol-2018">
        <p className="section-kicker">47 · February 2018 Volatility Event</p>
        <h2>2018 年 2 月 5 日展示了规则化产品怎样把当日价格变化转成收盘前的大额同向 VIX 期货需求；证据边界停在这个局部放大器。</h2>
        <p>
          BIS 复盘指出，当日 S&amp;P 500 大幅下跌、VIX 急升，杠杆和反向 volatility ETP 为恢复每日目标暴露，需要在波动已上升后买入 VIX futures；需求集中于流动性较薄的窗口，看来是尾盘 VIX spike 的关键因素。后续研究也给出 ETF-induced trading 可以影响高度 ETF 化资产类别价格的证据。这里最清楚的链条是 rule → target rebalance → futures order → price amplification。<Cite n={60} /><Cite n={61} />
        </p>
        <p>
          该证据不证明 ETP 造成了当日全部股票跌幅，也不证明所有 CTA、risk parity 或 vol-control 同时卖股。产品方向、期限和交易标的不同，VIX 衍生品的局部反馈不能被改写成“所有系统资金”的统一行为；BIS 对机制的限定措辞本身就是案例研究应保留的认识论边界。<Cite n={60} />
        </p>
      </section>

      <section className="lesson-section" id="archegos">
        <p className="section-kicker">48 · Archegos</p>
        <h2>Archegos 更适合说明单一客户的隐藏合成集中、共同对手方和竞速退出，而不是多个经理彼此模仿的 herding。</h2>
        <p>
          SEC 的 2022 complaint 指控 Archegos 通过 total-return swaps 建立高度集中暴露，并就组合和流动性向交易对手作出误导性陈述；这些尚未裁判的部分必须称为“指控”。Credit Suisse 特别委员会报告提供了该行与客户关系、margin、限额、升级失败和 unwind 的内部重建，但它是特定机构委托的调查。FINMA 后来的 enforcement conclusion 则构成对 Credit Suisse 风险治理严重缺陷的监管认定。三种材料的证据身份不能合并。<Cite n={62} /><Cite n={63} /><Cite n={64} />
        </p>
        <p>
          机制上，一个客户通过多家 prime broker 持有相似经济暴露；各银行分别看见自己的 swap 与 hedge，却未必看见客户总量。价格下跌和 margin failure 发生后，对手方为减少 hedge inventory 竞速出售，共同标的价格继续下跌并扩大剩余损失。这里的 coupling 来自同一客户、合成不透明和对手方处置，而非多个独立基金对公开信息形成同一判断。<Cite n={63} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="gamestop">
        <p className="section-kicker">49 · GameStop 与 Short Crowd</p>
        <h2>高 short interest 提供 squeeze 的燃料，却不能单独解释 2021 年 GameStop 的整段上涨；存量、交易流与期权叙事必须分账。</h2>
        <p>
          SEC staff 的市场结构报告认为，short covering 在部分时段对上涨有贡献，但回补买量相对总买量较小；价格在直接回补影响减弱后仍维持高位，持续上升更与广泛正面情绪和持续买盘一致。该报告也没有发现支持把事件解释为 gamma squeeze 的数据证据。最稳健的结论因此是“局部 short-cover feedback 存在”，而不是“空头回补或 dealer gamma 独自造成全部上涨”。<Cite n={68} />
        </p>
        <p>
          Short interest 是结算日未平仓存量，short-sale volume 是带标记的交易流量，borrow fee 与 utilization 又反映借券供需；fails-to-deliver 或 naked short 还有不同法律与数据定义。借券研究进一步说明 supply、demand、specialness、recall 和信息型卖空会共同影响这些指标。把任一指标替代其他指标，会在链条尚未闭合时制造“必然 squeeze”的假确定性。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={56} /><Cite n={57} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="march-2020">
        <p className="section-kicker">50 · March 2020 Dash for Cash</p>
        <h2>2020 年 3 月是基本面冲击、普遍现金需求、基金赎回、杠杆交易、margin 与 dealer capacity 同时作用的多渠道事件，不能压缩成一个 mutual-fund overlap 故事。</h2>
        <p>
          FSB 的综合复盘记录了疫情不确定性下对现金和近现金资产的全球性需求、开放式基金流出、非银行杠杆头寸调整、保证金需求和核心市场中介容量压力；公司债基金研究又显示，流动性错配与 fire-sale spillover 在局部市场具有可识别作用。多个机制共享“筹现金”结果，却有不同的发起者、时钟和资产选择。<Cite n={27} /><Cite n={28} /><Cite n={45} /><Cite n={66} /><Cite n={69} />
        </p>
        <div className="precision-note">
          <span>多渠道不是“什么都重要”</span>
          <p>研究仍应固定一条局部链，例如 bond-fund outflow → 预先持仓 → 实际售债 → 同一债券在其他基金的 NAV 损失；或 Treasury basis loss → margin → 期现减仓。宏观事件允许世界模型复杂，经验设计仍必须选择单一 treatment、结果和反事实。</p>
        </div>
      </section>

      <section className="lesson-section" id="ldi-2022">
        <p className="section-kicker">51 · UK LDI 2022</p>
        <h2>负债对冲本来用于降低养老金利率风险，却在长端 gilt 急跌、杠杆和抵押品时钟对齐后，转化为售债—收益率上升—追加抵押的反馈。</h2>
        <p>
          许多 defined-benefit pension schemes 使用 LDI funds 和利率衍生品，使资产对长期负债折现率变化更敏感地匹配。2022 年 9 月长端英国国债收益率急升、价格下跌后，杠杆 LDI 的净值和 collateral buffer 下降，counterparties 发出 margin calls；基金需要养老金追加现金、出售 gilts 或降低 hedge。多家主体在相近期限售债，收益率进一步上升，又加大下一轮 collateral 需求。BoE 的临时长期国债购买通过恢复承接和降低失序风险打断了这条局部反馈。<Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={67} />
        </p>
        <p>
          这个案例不支持“所有英国养老金资不抵债”，也不能把 liability hedge 等同于单纯押注利率下跌。利率上升可能改善按市场利率折现的长期 funded position，同时在短时钟上制造现金抵押品缺口；solvency 与 liquidity、长期经济状态与即时支付能力必须分开。<Cite n={67} />
        </p>
      </section>

      <section className="lesson-section" id="ltcm-1998">
        <p className="section-kicker">52 · LTCM 1998</p>
        <h2>高杠杆 convergence trade 的危险不在“最终价值判断必然错误”，而在价差先扩大时净资本、融资和对手方承接能力同时消失。</h2>
        <p>
          LTCM 持有跨市场、复杂且常需融资维持的相对价值头寸。俄罗斯危机后的 flight to liquidity 使多项 convergence spreads 朝不利方向移动；账面损失侵蚀权益，对手方又更关心 collateral、敞口和潜在清算。若各方同时缩减融资或抢先平仓，复杂头寸只能由少数专门资本承接，而这些潜在买家往往承受相似损失。错价扩大于是先削弱最可能纠正它的资本。<Cite n={30} /><Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={43} />
        </p>
        <p>
          President’s Working Group 的联合报告支持高杠杆、对手方风险、市场流动性与快速清算威胁，也记录了由纽约联储促成谈判、私人金融机构实施的资本重组；这不是使用联邦资金无条件救助。案例不能证明所有 convergence funds 拥有同样交易，也无法观察未发生的无协调清算反事实，但足以说明慢资本、融资时钟和共同对手方如何限制套利。<Cite n={65} />
        </p>
      </section>

      <section className="lesson-section" id="overlap-not-sale">
        <p className="section-kicker">53 · Overlap 不推出同步卖出</p>
        <h2>从共同持仓走到共同出售，至少还要观察损失方向、触发器、目标函数、可替代资产、执行窗口和真实成交。</h2>
        <p>
          想象保险账户与每日可赎回基金持有同一债券。价格下跌时，前者可能因久期负债匹配而继续持有甚至买入，后者却为支付赎回而出售；若保险账户同时遭遇资本或 collateral constraint，角色才可能反转。投资期限、负债性质与资金流协方差决定共同损失之后谁成为卖方、买方或旁观者。实证研究也显示，短期限持有人更可能放大冲击，而某些集中持有人会内部化价格影响。<Cite n={21} /><Cite n={29} /><Cite n={44} />
        </p>
        <div className="causal-chain" aria-label="从持仓重叠到同步出售仍需通过的条件" role="list">
          <div role="listitem"><span>01</span><b>Overlap</b><p>同一经济风险。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Common loss</b><p>同向 mark-to-market。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Binding trigger</b><p>赎回、margin、limit。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Same target</b><p>选择卖同一风险。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Same window</b><p>时钟真正重合。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Fills</b><p>成交争夺有限深度。</p></div>
        </div>
      </section>

      <section className="lesson-section" id="concentration-stability">
        <p className="section-kicker">54 · Concentration Can Stabilize</p>
        <h2>所有权越集中并不总使 fire sale 越严重：大持有人会承担自己销售对剩余仓位的价格损失，因而可能更谨慎地清算。</h2>
        <p>
          若一名投资者持有某债券很大比例，今天压价卖出不仅降低成交价，也让未售余仓 mark down；这个内部化效应会促使其使用现金、卖其他资产、分期退出或等待承接者。许多小基金各自只考虑本基金赎回时，反而可能忽视对其他持有人的外部性。债券基金结构的研究给出集中持有人在特定条件下能够减弱价格脆弱性的证据，提醒我们 HHI 与 fragility 不应被设成机械正相关。<Cite n={29} />
        </p>
        <p>
          反例也同样重要：若大持有人违约、被监管要求按比例清算、融资方接管 collateral，或其仓位大到任何正常承接都不足，集中会放大单点故障。故 ownership HHI 需要与 holder constraint、内部化能力、governance、退出选择和替代买家联合解释。<Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="informed-herding">
        <p className="section-kicker">55 · Herding Can Be Informed</p>
        <h2>机构共同买入可能反映信息逐步进入价格，也可能产生过度价格压力；“一致”本身既不证明噪声，也不证明技能。</h2>
        <p>
          经理可以从公开事实独立得出相同结论，也可以从其他机构的交易推断其私人信息；知情卖空同样可能加速负面信息进入价格。持仓研究发现机构交易具有跨期延续性，并进一步讨论 herding 与后续表现、经理技能之间的异质关系。此时共同交易可能改善 price discovery，而非必然破坏效率。<Cite n={6} /><Cite n={7} /><Cite n={13} /><Cite n={51} />
        </p>
        <p>
          区分 informed aggregation 与 destabilizing flow，至少要看公告前后现金流或盈利信息、交易后的永久价格成分、短期冲击是否反转、参与者是否真的观察他人以及控制共同 benchmark 后结果是否仍在。若长期基本面改善支持价格，不能因“很多机构都买”就命名为泡沫；若无信息变化、成交集中且随后反转，price-pressure 解释更强。<Cite n={6} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">56 · Crowding, Exit Capacity &amp; Evidence Lab</p>
        <h2>十道唯一答案题分别审计持仓账本与证据边界，使静态 overlap 不会在计算结束后被误读成同步踩踏。</h2>
        <p>
          Mode A 的五题依次计算 minimum overlap、signed／gross cosine、ownership HHI、flow fragility 与 exit days；Mode B 的五题区分共同 benchmark 与 herding、LSV 的有限样本边界、公开持仓时钟、short-sale volume 与 short interest，以及三个著名案例能支持的最强命题。每题冻结单位、时点和信息集，三个选项只有一个同时满足定义与证据。提交后才显示诊断，本设备记录经过 schema 校验、损坏恢复和两步重置。<Cite n={5} /><Cite n={16} /><Cite n={18} /><Cite n={40} />
        </p>
        <CrowdingLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">57 · 主动练习 · 十道无脚本迁移题</p>
        <h2>静态孪生更换数字或机制场景；先写 position、trigger、execution 与 feedback 四层，再展开答案。<Cite n={16} /><Cite n={52} /><Cite n={56} /><Cite n={60} /><Cite n={63} /><Cite n={68} /></h2>
        <div className="practice-grid">
          {crowdingScenarios.map((scenario, index) => (
            <details className="understanding-check" key={scenario.id + '-static'}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>答案：</b>{scenario.staticTwin.answer}</p>
              <p><b>本题依据：</b>{' '}{scenario.staticSourceIds.map((sourceId) => <Cite key={sourceId} n={sourceId} />)}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">58 · 十四道理解检查与最小术语桥</p>
        <h2>真正掌握拥挤，是能指出链条走到了哪一层、缺了哪项证据，并为每个放大叙事找到一个可观察的断链条件。<Cite n={4} /><Cite n={16} /><Cite n={33} /><Cite n={40} /><Cite n={69} /></h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="拥挤研究证据等级护照，可横向滚动">
          <table className="concept-table">
            <caption>Evidence passport：先标材料身份，再选择结论动词</caption>
            <thead><tr><th scope="col">标签</th><th scope="col">材料</th><th scope="col">允许的表述</th><th scope="col">仍然不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">A · Direct record</th><td>合同、账户、order、fill、cash 与 margin 记录</td><td>“记录显示该状态／行动发生”</td><td>未记录动机与无事件反事实</td></tr>
              <tr><th scope="row">B · Formal finding</th><td>生效裁判或监管正式认定</td><td>“该机关在特定程序与范围内认定”</td><td>其他主体、时期和法域的一般规律</td></tr>
              <tr><th scope="row">C · Allegation</th><td>complaint、charge 或尚未裁判指控</td><td>“文件指控／alleges”</td><td>把指控写成既定事实或责任终局认定</td></tr>
              <tr><th scope="row">D · Internal review</th><td>董事会、机构或受托委员会调查</td><td>“该报告重建／认为”</td><td>监管裁决、独立全市场事实或无选择样本</td></tr>
              <tr><th scope="row">E · Causal design</th><td>外生 flow、cutoff、RDD、placebo 与反转</td><td>“在识别假设与局部样本下估计”</td><td>超出 treatment、样本和 exclusion 的普遍参数</td></tr>
              <tr><th scope="row">F · Structural scenario</th><td>网络、impact、margin 与清算规则模型</td><td>“在给定规则和参数下，情景产生”</td><td>现实主体必然遵循该规则或危机概率</td></tr>
              <tr><th scope="row">U · Unknown</th><td>媒体叙事、缺失仓位、未观察订单或动机</td><td>“未知／待验证”</td><td>用故事补齐证据链</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这些标签不是把不同材料机械排成一条总分：direct fill 对“成交是否发生”最强，正式认定对特定法律事实更强，因果设计才处理反事实，结构模型则负责没有足够危机样本时的条件传播。每条主张都应同时保存 source identity、as-of time、适用对象、允许动词与仍未知字段；Archegos、基金 fire-sale 识别和网络模型分别展示了 C/D/B、E 与 F 的不同用法。<Cite n={22} /><Cite n={28} /><Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={62} /><Cite n={63} /><Cite n={64} />
        </p>
        <details className="understanding-check"><summary>01 · 很多基金持有同一热门股票，为什么仍不能直接称为危险 crowding？</summary><p>还需统一经济暴露、相对退出容量、holder 独立性、共同触发、必要销售和反馈敏感度。深度充足且期限异质时，高 raw overlap 可以长期稳定。</p></details>
        <details className="understanding-check"><summary>02 · Crowded position 与 crowded trade 的最小区别是什么？</summary><p>前者是某时点的存量共同暴露，后者是指定窗口内同方向争夺流动性的交易流；完全重叠的持仓可以反向交易，不同持仓也可同时卖最液态资产。</p></details>
        <details className="understanding-check"><summary>03 · 多家机构同时买入为什么不自动构成 herding？</summary><p>Herding 要求决策因观察或推断他人行为而改变；共同新闻、benchmark、资金流或约束也会产生相同结果，却没有这种决策依赖。</p></details>
        <details className="understanding-check"><summary>04 · 证券 overlap 很低，为什么因子 crowding 仍可能很高？</summary><p>不同证券、期货、期权和 swap 可以映射到相同 value、momentum、duration、carry 或 short-vol beta；应比较共同损益来源，而非只比较名称。</p></details>
        <details className="understanding-check"><summary>05 · Minimum overlap 为 80% 是否表示 80% 仓位会同时卖出？</summary><p>否。它只描述冻结口径下的静态共同暴露；出售还需要共同损失、绑定触发、同向 target、相近时钟和 actual fills。</p></details>
        <details className="understanding-check"><summary>06 · Signed cosine 为 −1、gross cosine 为 +1 应怎样解释？</summary><p>两组合使用相同风险载体和绝对规模形状，但方向完全相反；它们共享市场容量，却不是同方向价格风险。</p></details>
        <details className="understanding-check"><summary>07 · HHI 很高为什么既可能危险又可能稳定？</summary><p>被迫清算的大持有人会形成单点冲击；能等待的大持有人又会内部化销售对余仓的损失。必须与 holder constraint、期限和治理合读。</p></details>
        <details className="understanding-check"><summary>08 · LSV 值经过 chance adjustment 后，能否证明经理在模仿同行？</summary><p>不能。它改进了方向一致性的有限样本基准，但共同信息、指数事件、共同资金流和相似约束仍可能生成高值。</p></details>
        <details className="understanding-check"><summary>09 · 用季末 13F 解释季内价格，最关键的时间错误是什么？</summary><p>13F 在季末之后申报并公开；把后来可见的持仓从季初或季末当作当时信息会前视，而且报告不含股票短仓与完整衍生品。</p></details>
        <details className="understanding-check"><summary>10 · 高 daily short-sale volume 为什么不等于 short interest 上升？</summary><p>前者是特定场所的期间交易流，可能含日内平仓、做市和对冲；后者是结算日未平仓存量。没有开平仓与借券账本，不能互换。</p></details>
        <details className="understanding-check"><summary>11 · Exit days 为 12 天是否预测价格会连续跌 12 天？</summary><p>否。它是在冻结 forced quantity、ADV 与 participation rate 下的容量比率；实际成交、深度、替代资产、买家与冲击函数都会改变价格路径。</p></details>
        <details className="understanding-check"><summary>12 · 价格下跌与基金卖出同时出现，什么时候才更接近 fire sale？</summary><p>需要先证明销售由赎回、margin 或其他约束驱动，而非新基本面；再观察 actual fills、有限承接、相对价格冲击与可能反转。</p></details>
        <details className="understanding-check"><summary>13 · Archegos 为什么不是干净的多基金 herding 案例？</summary><p>核心是单一客户通过多家 prime broker 建立隐藏合成集中，margin failure 后各对手方竞速处置；共同交易来自同一客户和处置网络，不是独立经理互相模仿。</p></details>
        <details className="understanding-check"><summary>14 · 一个合格的 crowding 研究最小应怎样被证伪？</summary><p>预先规定 exposure、trigger、forced action、actual fill、price response 和 feedback；若触发未绑定、没有成交、深度充足、对照同样下跌或没有预期异质性，就必须降低或放弃机制结论。</p></details>

        <div className="glossary-grid">
          <article><span>Crowded position</span><p>多个独立主体同方向经济暴露相对可退出容量过大的存量状态。</p></article>
          <article><span>Crowded trade</span><p>多个主体在同一窗口争夺同方向流动性的流量状态。</p></article>
          <article><span>Herding</span><p>主体因观察、推断或预期他人行为而改变自身决策的依赖关系。</p></article>
          <article><span>Economic exposure</span><p>合并现货与衍生品后，对同一标的、因子或情景损益的真实敏感度。</p></article>
          <article><span>Minimum overlap</span><p>逐资产较小同向暴露之和，相对预先声明组合规模的共同资本比例。</p></article>
          <article><span>Signed cosine</span><p>保留多空方向的暴露向量夹角相似度。</p></article>
          <article><span>Gross cosine</span><p>对暴露取绝对值后衡量是否使用相同风险载体的相似度。</p></article>
          <article><span>Ownership HHI</span><p>各持有人份额平方和；结果依赖分母、聚合层级与未观察 residual。</p></article>
          <article><span>Flow fragility</span><p>预先持仓与持有人资金流协方差结合后的潜在共同需求敏感度。</p></article>
          <article><span>Exit days</span><p>候选出售量除以允许参与率乘压力成交容量的情景比率。</p></article>
          <article><span>Trigger distance</span><p>可用权益或抵押品缓冲相对于指定压力损失的距离，不是违约概率。</p></article>
          <article><span>Liquidity mismatch</span><p>投资者退出承诺快于底层资产低冲击变现能力的资产—负债错配。</p></article>
          <article><span>Fire sale</span><p>主要由约束而非投资观点改变驱动、并在有限承接下成交的出售。</p></article>
          <article><span>Contagion</span><p>初始冲击经持仓、融资、对手方或行为通道改变其他节点状态。</p></article>
          <article><span>Price-mediated contagion</span><p>一方出售压低共同资产价格，继而损害其他持有人的资产负债表并触发行动。</p></article>
          <article><span>Alternative risk-bearing capacity</span><p>未受损且愿意在相关期限承接风险的资本、库存和融资能力。</p></article>
          <article><span>PositionAsOf / PublicAt</span><p>持仓代表的时点与外部实际可见时点；两者之间的间隔是研究时滞。</p></article>
          <article><span>Evidence grade</span><p>将直接记录、监管认定、诉状指控、内部调查和模型推断分层的证据标签。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">59 · 课程接口、复述与四层精选阅读路径</p>
        <h2>2.19 在“共同暴露怎样进入共同退出风险”的可观察链条处停止；公司自身流量、心理模仿和多轮系统临界性分别交给 2.20、Chapter 6 与 Chapter 7。</h2>
        <div className="interface-grid">
          <article><span>回接 2.09</span><h3>Statistical Arbitrage</h3><p>接收共同因子、long–short book、borrow、funding 与 actual fills，聚合为策略拥挤和量化 unwind。</p></article>
          <article><span>回接 2.11</span><h3>Volatility Target</h3><p>接收滞后波动、目标倍率与成交，只有多主体规则和窗口对齐后才升级为 crowded trade。</p></article>
          <article><span>回接 2.15</span><h3>Limits to Arbitrage</h3><p>专业资本的路径损失、融资与客户流解释了为何错价越深，替代承接反而越少。</p></article>
          <article><span>回接 2.16</span><h3>Risk Governance</h3><p>VaR、ES 与 limit 只是触发候选；本节聚合各主体 validation、target、order、fill 和共同反馈。</p></article>
          <article><span>回接 2.17</span><h3>Redemption</h3><p>接收 request、现金缺口和 actual sale，把相关投资者流与重叠资产连接成 NAV feedback。</p></article>
          <article><span>回接 2.18</span><h3>Benchmark</h3><p>共同 benchmark 只是趋同输入；active books、约束、flow 和执行仍可使持仓与交易分化。</p></article>
          <article><span>连接 2.20</span><h3>Corporate Flow</h3><p>发行人也是交易主体；回购、增发、员工股权与融资约束会提供或吸收股票供给。</p></article>
          <article><span>连接 6.10</span><h3>Herding</h3><p>本节只建立信息与职业机制的边界；心理模仿、协调和社会学习将在行为层展开。</p></article>
          <article><span>连接 7.13–7.15</span><h3>Contagion / Resilience</h3><p>输出二部网络、trigger、liquidation rule、impact、断链条件和可证伪假设，供多轮系统模型使用。</p></article>
        </div>
        <div className="precision-note">
          <span>85–90 分钟核心首读</span>
          <p>统一按 00–10 → 11、16、21、23、26、30 → 31–36、40–41 → 46–52 → 56–59 阅读；在 56 只读实验说明，不完成全部题。第二遍补 12–15、17–20、22、24–25、27–29、37–39、42–45、53–55，并完成 Lab 与十道静态迁移。</p>
        </div>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="四层精选延伸阅读路径，可横向滚动">
          <table className="concept-table">
            <caption>20 组精选阅读逐层增加推导与识别负担；完整来源仍见下方参考文献</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">先读什么</th><th scope="col">完成标准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Core</th><td>Herding、共同持仓、flow 与 funding 的五组基础材料</td><td>能按 position→trigger→fill→feedback 复述模型</td></tr>
              <tr><th scope="row">Models</th><td>委托管理、有限套利、margin、网络与赎回模型</td><td>为每篇列明状态、约束、均衡与断链假设</td></tr>
              <tr><th scope="row">Evidence</th><td>comomentum、holder horizon、fire sale、基金压力与借券证据</td><td>区分 proxy、treatment、outcome、反事实与外推边界</td></tr>
              <tr><th scope="row">Rules / Cases</th><td>13F、N-PORT、short/COT 数据及七个官方事件材料</td><td>冻结 as-of/public 时钟，并标注 allegation、finding 与 inference</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这是一条精选而非穷尽的路线：它有意把若干相邻或互为反例的论文合并成一组，并不逐项覆盖本节全部 74 条参考文献。若要复核某个公式、案例或规则，应从正文引文跳到完整 reference ledger；若要建立长期阅读计划，再按 Core → Models → Evidence → Rules / Cases 的顺序使用这 20 组。<Cite n={4} /><Cite n={69} /><Cite n={70} /><Cite n={71} /><Cite n={72} />
        </p>
        <p>
          最小复述应是：<b>共同数据、benchmark、模型、激励、投资者和融资条件先塑造相似经济暴露；但静态 overlap 只有在共同损失触发绑定约束、主体选择同向 target、订单在相近窗口真实成交且替代风险承受能力不足时，才转化为 crowded trade。成交引起的价格与深度变化若再恶化 NAV、margin、borrow 或 dealer capacity，fire-sale feedback 才闭环；若冲击由此传给原本未直接受影响的节点，才进入 contagion。每一步都可以被现金、异质期限、稳定融资、成本内部化、长期买家或可信 backstop 打断，因此指标必须分层，案例必须按证据等级表述，研究必须预先规定能使机制失败的反事实。</b><Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={69} />
        </p>
      </section>
    </>
  );
}

export const lesson219: LessonRecord = {
  slug: '2-19',
  id: '2.19',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Crowded Positioning：从共同暴露到触发器、退出容量与拥挤反馈',
  subtitle: '把 crowded position、crowded trade、herding、共同因子、重叠持仓、流量相关、融资约束、真实成交、fire sale 与 contagion 严格分层',
  readingTime: '核心首读约 85–90 分钟；完整正文含逐式复算约 175–215 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习核对 20–30／完整书写 35–45，理解检查与术语 20–28，建议分三次完成；参考文献与延伸阅读不计',
  prerequisite: '2.09–2.18；建议重点回看 T03、T05、T06、T08、1.09、1.20–1.21 与 2.15–2.18',
  updatedAt: '2026-08-31',
  revision: '2.19-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.19-r2',
      summary:
        '独立复核 60 个机制单元、74 条来源与 287 个正文引文落点，并核验因子暴露与协方差风险、flow fragility、exit days、窗口归一化 price impact、融资与网络压力公式的符号、单位和边界，以及持仓数据时钟、监管规则、七个历史案例、证据等级和 10+10 道题的来源映射；冻结哈希与类型、规范、构建、HTTP、结构及引用不变量均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.19-r2',
      summary:
        '独立复核零背景入口、六阶段组织、85–90 分钟核心路线、共同暴露—触发器—target—order—fill—反馈因果链、公式直白解释、反例与证据边界、10 道互动题与 10 道静态孪生、14 道检查、18 个术语、evidence passport、20 组精选阅读和课程接口，并检查键盘／ARIA／焦点、本地保存、损坏恢复、无脚本、打印与响应式体验；冻结哈希和全部运行验证一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-18', label: '2.18 Benchmark、Active Risk 与 Tracking Error' },
  next: { slug: '2-20', label: '2.20 Corporate Buyback / Issuance Flow' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、先修与路线' },
    { id: 'crowded-position', label: 'Crowded Position' },
    { id: 'crowded-trade', label: 'Crowded Trade' },
    { id: 'herding-boundary', label: 'Herding Boundary' },
    { id: 'common-factor', label: 'Common Factor' },
    { id: 'concentration-levels', label: 'Concentration Levels' },
    { id: 'liquidity-mismatch', label: 'Liquidity Mismatch' },
    { id: 'leverage-funding', label: 'Leverage / Funding' },
    { id: 'fire-sale-contagion', label: 'Fire Sale / Contagion' },
    { id: 'four-layer-state', label: 'Four-layer State' },
    { id: 'common-benchmark', label: 'Common Benchmark' },
    { id: 'signal-position', label: 'Signal ≠ Position' },
    { id: 'model-monoculture', label: 'Model Monoculture' },
    { id: 'style-categories', label: 'Style / Categories' },
    { id: 'information-cascade', label: 'Information Cascade' },
    { id: 'career-herding', label: 'Career Herding' },
    { id: 'flow-performance', label: 'Flow / Performance' },
    { id: 'optimizer-convergence', label: 'Optimizer Convergence' },
    { id: 'passive-mechanical', label: 'Passive / Mechanical' },
    { id: 'common-investor-funding', label: 'Common Funding' },
    { id: 'data-clocks', label: 'Data Clocks' },
    { id: 'exposure-mapping', label: 'Exposure Mapping' },
    { id: 'minimum-overlap', label: 'Minimum Overlap' },
    { id: 'cosine-overlap', label: 'Signed / Gross Cosine' },
    { id: 'bipartite-network', label: 'Bipartite Network' },
    { id: 'ownership-hhi', label: 'Ownership HHI' },
    { id: 'lsv-measure', label: 'LSV Measure' },
    { id: 'sias-measure', label: 'Sias Measure' },
    { id: 'factor-comomentum', label: 'Factor / Comomentum' },
    { id: 'fragility-exit-days', label: 'Fragility / Exit Days' },
    { id: 'trigger-taxonomy', label: 'Trigger Taxonomy' },
    { id: 'target-order-fill', label: 'Target / Order / Fill' },
    { id: 'dealer-capacity', label: 'Dealer Capacity' },
    { id: 'funding-liquidity', label: 'Funding-liquidity Spiral' },
    { id: 'leverage-haircut', label: 'Leverage / Haircut' },
    { id: 'redemption-nav', label: 'Redemption / NAV' },
    { id: 'volatility-etp', label: 'Volatility ETP' },
    { id: 'short-squeeze', label: 'Short Squeeze' },
    { id: 'cross-asset-propagation', label: 'Cross-asset Propagation' },
    { id: 'resilience', label: 'Resilience' },
    { id: 'indicator-causality', label: 'Indicator ≠ Cause' },
    { id: 'holdings-identification', label: 'Holdings Identification' },
    { id: 'forced-flow-design', label: 'Forced-flow Design' },
    { id: 'natural-experiments', label: 'Natural Experiments' },
    { id: 'network-stress', label: 'Network Stress Test' },
    { id: 'quant-2007', label: 'Quant Unwind 2007' },
    { id: 'vol-2018', label: 'Volatility Event 2018' },
    { id: 'archegos', label: 'Archegos' },
    { id: 'gamestop', label: 'GameStop' },
    { id: 'march-2020', label: 'March 2020' },
    { id: 'ldi-2022', label: 'UK LDI 2022' },
    { id: 'ltcm-1998', label: 'LTCM 1998' },
    { id: 'overlap-not-sale', label: 'Overlap ≠ Sale' },
    { id: 'concentration-stability', label: 'Concentration Stability' },
    { id: 'informed-herding', label: 'Informed Herding' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'active-practice', label: 'Static Practice' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson219Content,
  references: lesson219References,
  readingList: lesson219ReadingList,
};
