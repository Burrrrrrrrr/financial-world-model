import CorporateFlowChart from '../components/CorporateFlowChart';
import CorporateFlowLab from '../components/CorporateFlowLab';
import { corporateFlowScenarios } from '../components/corporateFlowScenarios';
import { lesson220ReadingList, lesson220References } from './lesson-2-20-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson220Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>公司不是股票市场外部的静态“基本面”：它可以吸收股份、创造股份、改变现金与债务，也会被价格、融资条件和投资机会反向塑造。</h2>
        <p>
          “回购利好、增发利空”把至少四种不同问题压成了一个方向标签：董事会是否允许行动、公司是否真正成交、成交怎样改变现金与股本、市场又如何解释这一选择。一个高额授权可能一股未买；一次 secondary offering 可以给市场带来大量可售股份，却不增加发行人现金或 outstanding；股票并购和员工股权会增加股份而没有普通现金融资；回购也可能只抵消同期员工股权薪酬，或以新债换取更高的财务风险。因此，本节不预测涨跌，而是重建公司流量进入价格前必须经过的状态链。<Cite n={44} /><Cite n={69} />
        </p>
        <div className="causal-chain" aria-label="公司股本流量从外部状态到反馈的完整链条" role="list">
          <div role="listitem"><span>01</span><b>External state</b><p>估值、现金流、利率、税与投资机会。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Decision</b><p>董事会授权与管理层条件选择。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Mechanism</b><p>open market、tender、ASR、ATM 或 rights。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Order / sale</b><p>实际订单、配售、认购或交付。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Fill / closing</b><p>价格、数量、结算与费用。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Three ledgers</b><p>现金融资、股数状态、市场流量。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>07</span><b>Market state</b><p>价格、深度、float、所有权与估值。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>08</span><b>Feedback</b><p>投资、资本成本、评级与下一轮决策。</p></div>
        </div>
        <p>
          本节的中心纪律是：<b>意图不等于法律容量，法律容量不等于订单，订单不等于成交，成交不等于结算后的股数，股数变化不等于公司现金流，EPS 上升不等于价值创造，公告反应也不等于实际订单冲击。</b>只有逐层说明对象、时点、单位和反事实，才能把“公司自身是交易主体”从口号变成可验证机制。
        </p>
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、先修与六阶段路线</p>
        <h2>本节建立一套可复核的 corporate-flow language；它不把公司金融、会计、证券法和市场微观结构各讲一遍，而只保留它们在同一传导链上的接口。</h2>
        <div className="learning-objectives">
          <span>六阶段路线 · 从“计划回购”到可识别的现金、股数与成交</span>
          <ol>
            <li><b>对象与状态（00–10）：</b>分开 authorization、primary／secondary、gross／net、issued／treasury／outstanding／float、WASO 与 diluted shares。</li>
            <li><b>决策约束（11–20）：</b>把现金、债务、投资、股息、税、信息、市场时机、代理、EPS 与 share-based compensation（SBC，股份支付）放回同一资本配置问题。</li>
            <li><b>合约与执行（21–35）：</b>逐项拆解 open-market、10b5-1、tender、ASR、follow-on、rights、ATM、private investment in public equity（PIPE，上市公司私募融资）、convertible、SBC 与股票并购。</li>
            <li><b>账本与市场反馈（36–45）：</b>由 fill／closing 进入会计、现金、float、指数、EPS、每股价值、流动性与资本成本。</li>
            <li><b>数据与识别（46–55）：</b>冻结 knowable-when、filing map、flow reconstruction、denominator 与五类 estimand，并以压力案例和断链反例审计。</li>
            <li><b>迁移（56–59）：</b>完成 10 道互动题、10 道静态孪生、14 道检查、18 个术语、evidence passport 与 20 组阅读。</li>
          </ol>
        </div>
        <p>
          硬先修是 T06；建议回看 T01–T03、T07–T08、1.09、1.20、2.15–2.19。85–90 分钟核心首读统一走 00–10 → 11、16、20 → 21–23、25、27、30–31、35 → 36–39、43–44 → 46、48、50–52、55 → 56–59，并在 56 只读实验说明。第二遍再补其余机制和全部练习。IAS 33/32、Fed 的定义和数据字典只在它们能固定分母、权益处理或聚合口径时进入主线。<Cite n={23} /><Cite n={24} /><Cite n={27} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="endogenous-corporate-flow">
        <p className="section-kicker">02 · Corporate Flow 是内生流量</p>
        <h2>公司回购或发行不是凭空出现的外生买卖盘，而是经营现金流、估值、投资机会、融资条件和治理共同选择出的动作。</h2>
        <p>
          若现金流强、短期投资机会弱、债务容量充足且管理层认为股份便宜，回购概率和规模可能上升；若亏损、到期债务、监管资本、并购资金或增长投资需要现金，公司可能暂停回购并发行股权。价格又同时改变两端：高估值让相同融资金额需要交付更少股份，也会降低以现金回购高价股份的静态吸引力；低估值反过来增加回购的潜在财富转移，却可能与现金流恶化和融资收紧同时发生。<Cite n={51} /><Cite n={58} /><Cite n={59} /><Cite n={69} />
        </p>
        <p>
          因此，观察到“回购公司后来表现不同”时，selection 已经写进样本：能回购、选择回购和实际执行的公司状态本来就不同。Fed 部门数据进一步把众多公司和 M&amp;A 退休汇成宏观净流量，但聚合线仍是公司状态与市场状态共同决定的结果，不是一个单向冲击变量。<Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="transaction-state-machine">
        <p className="section-kicker">03 · Transaction State Machine</p>
        <h2>每一种 corporate action 都必须沿“容量—目标—指令—成交—结算—账本—披露”推进；跳过任何状态都会制造虚构流量。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="公司股本交易状态机，可横向滚动">
          <table className="concept-table">
            <caption>同一新闻在不同状态下代表完全不同的经济事实</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">最小证据</th><th scope="col">此时还不能写</th></tr></thead>
            <tbody>
              <tr><th scope="row">Capacity</th><td>董事会授权、股东批准、authorized shares、shelf registration</td><td>已下单、已发行、已收到现金</td></tr>
              <tr><th scope="row">Target / contract</th><td>管理层目标、10b5-1 安排、sales agreement、tender terms</td><td>全部数量必然成交</td></tr>
              <tr><th scope="row">Order / subscription</th><td>broker instruction、认购申请、承销 allocation</td><td>最终 fill 或 closing</td></tr>
              <tr><th scope="row">Fill / delivery</th><td>数量、价格、trade date、share delivery</td><td>所有现金与登记已经完成</td></tr>
              <tr><th scope="row">Settlement / accounting</th><td>cash、fees、treasury／retirement、cap table</td><td>市场价格变化的单一原因</td></tr>
              <tr><th scope="row">Disclosure</th><td>period、filedAt、publicAt、revision vintage</td><td>外部在成交时已经知道</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          当前 Item 703、Rule 415 和公司年报分别观察状态机的不同截面；Apple 年报能对账年度授权与实际购买，却仍不是逐日订单簿。一个合格数据库因此保存状态迁移，而不是用一列 `buyback=true` 或 `offering=true` 抹平全部过程。<Cite n={6} /><Cite n={13} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="authorization-announcement-actual">
        <p className="section-kicker">04 · Authorization、Announcement 与 Actual</p>
        <h2>授权是可行动上限，公告是市场获得的信息，actual flow 才是已经发生的数量；三者既可能接近，也可能长期分离。</h2>
        <p>
          董事会通常先决定或同时公开授权，随后管理层依据价格、现金、material nonpublic information（MNPI，重大非公开信息）、融资和合规选择是否执行。Berkshire 2011 文件明确没有最低购买义务，2012 年才在不同渠道出现实际购买；Apple 2025 年报同样把新增授权与年度实际回购分别列示。历史研究也发现 open-market program 的完成率高度异质。<Cite n={50} /><Cite n={65} /><Cite n={81} /><Cite n={82} /><Cite n={83} />
        </p>
        <div className="precision-note"><span>Announcement return 的正确语言</span><p>公告窗口价格变化是市场对未来执行概率、管理层信息、资本配置、融资风险与其他同期消息的联合更新。没有 actual fill 与可信反事实时，不能把它命名为发行人订单造成的冲击。</p></div>
      </section>

      <section className="lesson-section" id="capital-allocation-counterfactual">
        <p className="section-kicker">05 · Capital Allocation Counterfactual</p>
        <h2>评价回购或发行的起点不是“股数变多还是变少”，而是公司本可把同一资源用于什么，以及替代路径会改变什么。</h2>
        <p>
          现金可以留在资产负债表、偿债、投资、收购、分红或回购；股权融资所得又可以填补亏损、降低违约风险、投资正 NPV 项目，也可能被低效使用。无摩擦基准告诉我们：投资政策给定、没有税与信息问题时，单纯改变 payout 形式不能凭空创造价值；现实中的结论来自被打破的假设，而不是来自“每股指标”的算术。<Cite n={44} /><Cite n={69} />
        </p>
        <p>
          一个在低于内在价值时回购的公司，若因此放弃更高 NPV 投资或使融资风险陡升，净效果仍可能为负；一次低价发行若避免昂贵 distress 或资助高回报项目，也可能增加原股东价值。成熟与投资机会下降、信号、代理成本和杠杆目标常常共存，研究必须指定真正比较的反事实。<Cite n={51} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="primary-secondary">
        <p className="section-kicker">06 · Primary 与 Secondary</p>
        <h2>Primary 回答“公司是否交付股份并取得对价”；secondary 回答“既有持有人是否转让股份”，二者对现金、股数和市场供给的影响不同。</h2>
        <p>
          新发普通股或库存股再发行通常让发行人获得对价，并提高 outstanding；既有股东的 secondary sale 通常不改变公司总 outstanding，也不给公司现金。混合 follow-on 必须把两个 tranche 拆行：研究市场短期吸收量时可合计 marketed shares，研究机械稀释或 issuer proceeds 时只能读取 primary 部分。真实 prospectus 会明确公司与 selling shareholder 各自出售数量和资金归属。<Cite n={71} /><Cite n={72} /><Cite n={96} />
        </p>
        <p>
          信息不对称模型解释为何外部股权融资可能被市场解读为管理层认为证券昂贵，但这只是条件机制，不是每次发行的事实标签；secondary block 还可能把战略持股转为公众持股，使 free float 上升而 outstanding 不变。<Cite n={70} />
        </p>
      </section>

      <section className="lesson-section" id="gross-net-flow">
        <p className="section-kicker">07 · Gross 与 Net Flow</p>
        <h2>Net number 只有在先保存每一条 gross leg 后才有意义；不同净额公式回答不同问题，不能跨账本互换。</h2>
        <div className="equation-card">
          <span>三种常见净额必须带单位和对象</span>
          <div>NEF<sub>shares</sub> = gross shares delivered − shares repurchased；　NEF<sub>cash</sub> = gross issuance cash − repurchase cash；　Fed net issuance = gross issuance − repurchases − cash M&amp;A retirements</div>
          <p>第一式是股份流，第二式是发行人现金股本融资流，第三式是特定美国非金融公司部门的美元聚合口径。SBC、股票并购或转股可进入股份流却没有普通现金 proceeds；secondary sale 不进入前两式；Fed 的 cash M&amp;A retirement 又不是普通回购。</p>
        </div>
        <CorporateFlowChart />
        <p>
          FRED Z.1 系列以百万美元、季度、季调年率呈现，EFA CSV 则是十亿美元季度流量，并将 gross retirement 拆成回购和现金并购；未经单位转换不能拼接。净发行文献还提醒，股数变化估算会混入股票薪酬与并购，因此 cash、shares 和市场 order flow 必须并存。<Cite n={25} /><Cite n={26} /><Cite n={27} /><Cite n={28} /><Cite n={29} /><Cite n={60} /><Cite n={63} /><Cite n={78} />
        </p>
      </section>

      <section className="lesson-section" id="share-states">
        <p className="section-kicker">08 · Authorized、Issued、Treasury、Outstanding 与 Float</p>
        <h2>“股本”不是一个数字：法律容量、已发行状态、公司持有状态、外部在外状态和公众可交易状态各有独立分母。</h2>
        <div className="equation-card">
          <span>最小股本恒等式与状态转移</span>
          <div>O<sub>t</sub> = I<sub>t</sub> − T<sub>t</sub>；　I<sub>1</sub> = I<sub>0</sub> + newly issued − retired；　T<sub>1</sub> = T<sub>0</sub> + acquired − reissued − retired from treasury</div>
          <p>I 是 issued，T 是 treasury，O 是 outstanding。回购进库存股令 T 上升、O 下降；之后注销同量库存股会同时降低 I 与 T，O 不再下降。直接回购并注销则在取得时降低 I 与 O。Retired 是事件流，不是要从 I−T 再扣一次的库存量。</p>
        </div>
        <p>
          库存股在 IAS 32 下是权益抵减而非资产；注销后能否恢复 authorized-but-unissued capacity 取决于公司法和章程，本节用 Delaware 只作法域示例。Float 还要声明方法 m：F<sup>(m)</sup>=O−X<sup>(m)</sup>，其中 X 可按指数方法排除战略、关联、政府或受限持股，因此 public float 与 index free float 不可互换。单一股份类别下 A、I、T、O、X、F 均须非负，且 0≤T≤I≤A、0≤X≤O；违反约束就是账本错误。<Cite n={24} /><Cite n={93} /><Cite n={94} /><Cite n={97} />
        </p>
      </section>

      <section className="lesson-section" id="weighted-average-shares">
        <p className="section-kicker">09 · Weighted-average Basic Shares</p>
        <h2>Basic EPS 的分母是股份在报告期内实际在外的时间加权平均，不是授权金额换算股数，也不是期末 outstanding。</h2>
        <div className="equation-card">
          <span>日权重教学写法</span>
          <div>W<sub>basic</sub> = (1 / D<sub>period</sub>) Σ<sub>d=1…Dperiod</sub> O<sub>d</sub>；　Basic EPS = income available to common / W<sub>basic</sub></div>
          <p>D<sub>period</sub>≥1 是报告期天数，O<sub>d</sub> 是每一天实际在外普通股。4 月发行只从实际发行日进入分母，10 月回购也只从取得日起减少分母；拆股、红股和 rights issue 的 bonus element 还可能要求追溯调整。W<sub>basic</sub>=0 时 EPS 为 N/A，而不是 0。</p>
        </div>
        <p>
          期末股数下降 10% 并不表示全年 EPS 分母下降 10%；若交易发生在最后一天，当期影响接近零。只有把 eventAt、deliveryAt 与会计政策冻结，EPS bridge 才可复算。<Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="diluted-shares">
        <p className="section-kicker">10 · Diluted Shares 不是实际股本</p>
        <h2>Diluted EPS 是“若潜在普通股按准则视为发生”的条件计算；它必须与调整后的利润分子配套，不能被当作 float 或实际 outstanding。</h2>
        <div className="equation-card">
          <span>简化 treasury-stock method 只用于边界教学</span>
          <div>Incremental option shares = Q<sub>opt</sub> × (1 − K / P<sub>avg</sub>)，仅当 K &lt; P<sub>avg</sub> 且工具具有稀释性；　EPS<sub>dil</sub> = (NI + ΔNI<sub>dil</sub>) / (W<sub>basic</sub> + ΔS<sub>dil</sub>)</div>
          <p>Q<sub>opt</sub>≥0 是期权数量，K≥0 是行权价，P<sub>avg</sub>&gt;0 是期间平均市价；P<sub>avg</sub>≤0 或缺失时该简式为 N/A，K≥P<sub>avg</sub> 时简式增量为 0，并仍须做反摊薄检验。真实准则还处理未确认薪酬等调整。可转债通常用 if-converted 方法，同时加回税后利息并增加股份；任何在 EPS 计算中具有反摊薄效果的潜在普通股都应排除。</p>
        </div>
        <p>
          SBC grant、vesting、exercise、share delivery 与 net withholding 可能位于不同日期；mandatory convertible 又可能在发行时形成潜在稀释、在未来才交付普通股。把 diluted share count 当作实际市场供给，会把会计反事实误写成订单流。<Cite n={23} /><Cite n={54} /><Cite n={55} /><Cite n={75} /><Cite n={90} /><Cite n={98} />
        </p>
      </section>

      <section className="lesson-section" id="cash-buffer">
        <p className="section-kicker">11 · Cash 与 Liquidity Buffer</p>
        <h2>账面现金不是全部可自由回购的现金：税、运营、抵押、地域、最低流动性与未来融资可得性共同定义真正余量。</h2>
        <p>
          管理层面对的不是“现金大于零就回购”，而是现金瀑布：经营支出、利息、到期债务、税、承诺投资、监管或契约缓冲之后，剩余现金才与股息、回购、偿债和新投资竞争。回购的灵活性使它适合吸收暂时现金流，但灵活并不消除市场预期、评级或未来融资成本。<Cite n={52} /><Cite n={59} /><Cite n={69} />
        </p>
        <p>
          反例是现金虽多却高度受限，或行业突然进入高投资期；此时不回购可能是保存期权，而非管理层认为股票昂贵。研究应使用可动用 liquidity、未来 committed outflow 与 state-contingent access，而不是把 cash/assets 一列直接解释为“excess cash”。
        </p>
      </section>

      <section className="lesson-section" id="debt-covenant-rating">
        <p className="section-kicker">12 · Debt、Covenant、Rating 与 Maturity</p>
        <h2>债务融资回购把同一份股权风险分配给更少股份，却同时提高固定索取、再融资与契约压力；对股东和债权人的效果可能相反。</h2>
        <div className="equation-card">
          <span>忽略税费的两步资产负债表</span>
          <div>A<sub>1</sub> = A<sub>0</sub> + Debt<sub>new</sub> − C；　L<sub>1</sub> = L<sub>0</sub> + Debt<sub>new</sub>；　E<sub>1</sub> = E<sub>0</sub> − C</div>
          <p>Debt<sub>new</sub> 是新债，C 是回购现金。若 Debt<sub>new</sub>=C，总资产回到期初水平，负债上升、权益下降、净债务增加；未来税后利息再降低利润。若公司本已接近 covenant、rating 或 maturity wall，较小冲击就可能把资本配置反馈变成融资约束。</p>
        </div>
        <p>
          经典证据提示回购可能在股票与债券持有人之间重新分配风险；多动机研究也把杠杆目标列为解释之一。2020 年美联储对大型银行的暂时限制则提供更直接的状态反例：即使公司有授权和现金，监管资本韧性仍可禁止回购，限制退出后也不意味着每家银行采取同一路径。<Cite n={46} /><Cite n={51} /><Cite n={56} /><Cite n={84} /><Cite n={85} />
        </p>
      </section>

      <section className="lesson-section" id="investment-opportunity">
        <p className="section-kicker">13 · Investment Opportunity 与 Opportunity Cost</p>
        <h2>回购与投资并非天然替代，也不是天然互补；关键是边际项目的 NPV、实施容量和融资约束是否同时生效。</h2>
        <p>
          若公司没有可扩展的正 NPV 项目，保留现金可能增加代理成本，返还资本可以提高效率；若公司为了达到短期 EPS 目标而削减维护、研发或就业，回购的真实代价会晚于分母下降出现。临界 EPS 设计发现局部样本中回购与真实投资、就业变化相关，但这是特定阈值附近的局部效应，不应变成“所有回购挤出投资”。<Cite n={58} /><Cite n={67} />
        </p>
        <p>
          发行也需同样反事实：折价融资若支持高回报项目或避免 distress，原股东可能从更大分子受益；若资金被低效扩张或只掩盖持续现金消耗，更多股份会放大代理问题。无摩擦基准再次提醒，先固定投资政策，才能把融资形式的效应单独拿出来。<Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="dividend-repurchase">
        <p className="section-kicker">14 · Dividend 与 Repurchase 的替代</p>
        <h2>股息按持股比例把现金交给所有登记股东；回购只与愿意出售者交易，因此在灵活性、所有权和信号上都不相同。</h2>
        <p>
          股息常被视为更持续的承诺，削减可能传递负面信号；open-market repurchase 更容易随现金流、估值和投资机会调整。美国历史证据显示回购在 payout 中的重要性上升，并与股息形成部分替代，但税制、公司生命周期和样本制度共同塑造结果。<Cite n={52} /><Cite n={53} /><Cite n={63} />
        </p>
        <p>
          回购还会选择交易对手：不卖者的所有权比例上升，卖者退出；股息则不改变相对持股。若回购价偏离内在价值，会在卖者与继续持有者之间转移财富。因此“同样返还 100 元”并不代表相同持有人、税负、控制权和信息效果。管理者调查是动机证据，却不代替实际行为。<Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="tax-excise">
        <p className="section-kicker">15 · Tax 与 Excise-tax Ledger</p>
        <h2>税务净额是第四本、法域特定的账；它不能代替股数、发行人现金或市场订单流。</h2>
        <p>
          美国 §4501 对 covered corporation 的特定回购征收 1% excise tax，并规定发行净额和法定例外；2025 final computational regulations 与 2024 procedure rules又分别处理税基、适用期和申报。公司财报中的现金回购额乘 1% 不能自动得到最终税额，SBC、并购、ASR 与例外需要按规则分类。<Cite n={18} /><Cite n={19} /><Cite n={20} /><Cite n={21} />
        </p>
        <p>
          税会改变回购与股息、国内与跨境、时点与机制的相对成本，却不直接告诉我们公司当天买了多少股。研究应保存 `tax-base flow`，并与 `shares delivered`、`issuer gross cash`、`exchange fills` 分列；任何净额只在自己的法规目的内有效。
        </p>
      </section>

      <section className="lesson-section" id="information-signaling">
        <p className="section-kicker">16 · Information 与 Signaling</p>
        <h2>公司选择回购可能传递低估、现金流或风险承受信息；选择发行也可能传递融资需要或高估信息，但市场观察到的是混合信号。</h2>
        <p>
          管理层若比外部投资者更了解现金流，可用成本较高、数量更确定的 tender 传递信念；open-market authorization 因执行可选性更高，信号承诺较弱。机制比较研究发现 fixed-price tender、Dutch auction 与 open-market announcement 反应不同，但公司自选机制，差异同时包含公司状态。<Cite n={45} /><Cite n={47} />
        </p>
        <p>
          另一种解释是成熟：回购宣布公司缺少投资机会、风险下降并把多余资本返还，而非单纯低估。长期收益研究、实际完成率和信息内容证据各自回答不同 estimand；不能把同一个正公告收益同时称为 signal、order impact 和价值创造。<Cite n={49} /><Cite n={50} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="market-timing-hierarchy">
        <p className="section-kicker">17 · Market Timing 与 Financing Hierarchy</p>
        <h2>高估值可以使股权融资更便宜，低估值可以使回购更具静态吸引力；但“公司在择时”与“公司成功创造价值”仍是两层命题。</h2>
        <p>
          信息不对称模型产生融资顺序和发行折价，market-timing 证据则显示历史估值状态可能在资本结构中留下持久痕迹；new-issue 长期收益也曾被解释为发行时机。但长期 abnormal return 对基准、匹配、样本和生存偏差敏感，管理层可能只对相对价格或融资窗口作出合理选择，而不掌握不可观察内在价值。<Cite n={70} /><Cite n={76} /><Cite n={77} />
        </p>
        <p>
          用实际回购价格研究 timing 比只看公告更接近执行，却仍不能从“平均买价低于期间均价”推出正 NPV：风险、资金机会成本、后续经营变化和没有回购的反事实仍未知。<Cite n={66} />
        </p>
      </section>

      <section className="lesson-section" id="agency-governance">
        <p className="section-kicker">18 · Agency、Governance 与 Control</p>
        <h2>同一回购既可能减少自由现金流代理成本，也可能巩固控制、转移风险或迎合短期指标；治理决定谁选择、谁监督、谁承担尾部。</h2>
        <p>
          当管理层缺少好项目却继续扩张，返还现金能限制 empire building；但管理层也可能在高价回购、低价授予股权，或通过向特定股东购买改变控制权。股东供给曲线、反收购和私募股权集中研究提醒我们：价格、投票权和监督者身份都可能随 corporate flow 变化。<Cite n={48} /><Cite n={51} /><Cite n={73} />
        </p>
        <p>
          董事会程序、独立审议、利益冲突、薪酬结构和剩余授权应与交易数据一起保存。管理层 survey 能揭示其自述目标，却可能受表达、样本和事后合理化影响；综述用于建立假设空间，不能给个案定性。<Cite n={59} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="eps-compensation-incentive">
        <p className="section-kicker">19 · EPS、Compensation 与 Threshold</p>
        <h2>回购可以机械提高 EPS，薪酬或指引阈值又会使这种算术成为行为激励；但“有激励”不等于每笔回购都为操纵。</h2>
        <div className="equation-card">
          <span>保留分子成本和时间权重的机械桥</span>
          <div>EPS<sub>1</sub> = (NI<sub>0</sub> − w r<sub>period</sub> P q) / (S − w q)；　当 NI<sub>0</sub>,P,q&gt;0 且 0&lt;wq&lt;S 时，EPS<sub>1</sub>&gt;EPS<sub>0</sub> ⇔ r<sub>period</sub> &lt; NI<sub>0</sub>/(SP)</div>
          <p>NI<sub>0</sub> 是无交易利润，S 是基准加权股数，q 是回购股数，P 是价格，w 是交易影响本期的权重。r<sub>period</sub> 是与 NI<sub>0</sub> 同一报告期的简单税后有效资金成本；该式假定全部对价 Pq 以同一边际成本融资，并按 w 线性计提。只有资金成本低于按回购价计算的 earnings yield，EPS 才机械增厚；亏损公司应展示完整分子分母而不使用“增厚／摊薄”标签。</p>
        </div>
        <p>
          实证研究发现 option dilution、EPS forecast threshold 与回购相关，也有局部设计连接到真实投资变化；这些结果支持可检验的激励机制，不支持把所有接近阈值的公司归为操纵。<Cite n={55} /><Cite n={61} /><Cite n={67} />
        </p>
      </section>

      <section className="lesson-section" id="sbc-offset">
        <p className="section-kicker">20 · SBC Dilution 与 Offsetting Buyback</p>
        <h2>“回购抵消员工股权稀释”仍然包含一条发行流和一条回购流；只看净股数会删除薪酬成本、成交量与财富分配。</h2>
        <p>
          Option／restricted stock unit（RSU，限制性股票单位）的 grant、vesting、exercise、share delivery、tax withholding 与公司回购属于不同事件。Restricted stock 有时在授予时已 legally outstanding，净额结算又使 gross award 与实际交付股数不同；必须读取计划、适用股份支付准则和公司披露。A 股 2025 修正规则则分别规范授予、解除限售／行权、回购注销与处置等法律状态。<Cite n={23} /><Cite n={42} /><Cite n={98} />
        </p>
        <p>
          公司若发行 10 股给员工又回购 10 股，期末 outstanding 可不变，但公司支付了现金、员工获得了薪酬、市场发生了 gross buying，所有权也可能迁移。经典研究把 options、diluted EPS 与回购联系起来；Apple 年报则展示真实发行与回购可以在同一年度并存。<Cite n={54} /><Cite n={55} /><Cite n={61} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="board-authorization">
        <p className="section-kicker">21 · Board Authorization、Delegation 与 Capacity</p>
        <h2>董事会授权回答“谁可以在什么上限和期限内行动”，管理层 delegation 再决定条件；authorized shares 与 repurchase authorization 不是同一个 authorized。</h2>
        <p>
          回购授权通常以金额、股份数、期限或价格条件表示；新股发行还受公司章程中的 authorized shares、股东批准、证券发行注册和交易所程序约束。Apple、Berkshire 文件可直接证明授权可以没有最低义务；中国公司法与 2025 回购规则、沪深交易所指引又规定各自的决议、目的、交易与披露框架。<Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={81} /><Cite n={82} />
        </p>
        <p>
          数据表至少保存 `authorizationDate`、`cap`、`increment`、`remainingCap`、`expiry`、`purpose`、`delegatedAuthority` 与 `minimumObligation`。Remaining capacity 也不是未来需求：价格、现金、MNPI、合规和更优用途都可令它停留为未用容量。
        </p>
      </section>

      <section className="lesson-section" id="open-market-10b18">
        <p className="section-kicker">22 · Open-market Repurchase 与 Rule 10b-18</p>
        <h2>Open-market program 给管理层较高时点弹性；Rule 10b-18 只为特定美国公开市场购买提供非排他安全港，不是普遍回购许可证。</h2>
        <p>
          安全港按 manner、timing、price 与 volume 四类条件在执行时评估；常见 25% ADTV（average daily trading volume，按 Rule 10b-18 指定期间与交易口径计算的日均成交量）是其中一个 volume condition，并有 block exception。未进入安全港不产生操纵推定，进入安全港也不替代 MNPI、其他反操纵规则或交易事实审查。私人协商回购、issuer tender、ASR 合同和 dealer covering 需要分别处理。<Cite n={1} /><Cite n={2} /><Cite n={3} />
        </p>
        <p>
          EU MAR Article 5 与 Delegated Regulation 2016/1052 有自己的目的、预披露、价格、数量和报告结构，不能拿美国 25% ADTV 作为全球规则。任何合规陈述都必须附 jurisdiction、security、venue、tradeAt 与 applicable version。<Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="rule-10b5-1">
        <p className="section-kicker">23 · Rule 10b5-1、MNPI 与 Good Faith</p>
        <h2>10b5-1 安排试图把交易参数与后来获得的 MNPI 分离；它不是回购数量承诺，也不会自动满足 10b-18。</h2>
        <p>
          预先采用的合同、指令或计划可在规则条件下支持 affirmative defense，但采用时的信息状态、预设公式、修改、终止与 good faith 都重要。2022 修订提高了若干安排和披露要求；对个人适用的 cooling-off 与重叠计划限制不能未经核对全部外推给发行人。<Cite n={4} /><Cite n={5} />
        </p>
        <p>
          即使计划有效，价格条件、交易窗口或资金约束仍可能令某日无成交。研究应保存 `planAdoptionDate`、`publicAt`、`tradeWindow`、`amendmentAt` 与 actual fills，并把 10b5-1 的 MNPI 防御问题与 10b-18 的市场行为安全港分列。
        </p>
      </section>

      <section className="lesson-section" id="broker-execution">
        <p className="section-kicker">24 · Broker Algorithm、Limit、POV 与 Execution</p>
        <h2>董事会的金额上限只有经过 broker mandate、日度风险参数、订单和成交，才成为市场中的买盘。</h2>
        <p>
          执行可使用 limit price、participation-of-volume、VWAP/TWAP、收盘约束、venue selection 或 discretionary block。令 q<sub>d</sub> 为策略在交易日 d 的实际成交股数，V<sub>d</sub> 为同一股票、同一 venue／时段口径的市场成交股数，两者单位均为股；实际参与率 π<sub>d</sub>=|q<sub>d</sub>|/V<sub>d</sub> 无量纲，V<sub>d</sub>=0 时记为 N/A。再令 ρ 为 0&lt;ρ≤1 的目标参与率，ADV 为事先冻结回看窗口与市场口径后算得的平均 V<sub>d</sub>，单位为股／交易日；它是执行研究口径，不得未经重算替代上一节 Rule 10b-18 的法规 ADTV。把待执行 gross shares 定义为 Q<sub>gross</sub>≥0，固定容量下的近似天数为 Days<sub>exec</sub>≈Q<sub>gross</sub>/(ρ·ADV)，单位为交易日；它是执行容量，不是价格冲击模型。Q<sub>gross</sub>=0 先定义 Days<sub>exec</sub>=0；Q<sub>gross</sub>&gt;0 时还要求 ADV&gt;0，否则没有有限解；需要完整交易日时向上取整。
        </p>
        <p>
          Rule 10b-18 条件在 execution 时点判断，真实交易研究也显示 timing、成本和价格影响具有异质性；T+1 只是多数美国证券的普通结算周期，tender、ASR、境外市场与特殊合约另有时钟。即使回购平均改善流动性，也不能保证大规模或压力状态下同样成立。<Cite n={1} /><Cite n={3} /><Cite n={57} /><Cite n={68} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="fixed-price-tender">
        <p className="section-kicker">25 · Fixed-price Issuer Tender</p>
        <h2>Fixed-price tender 在明确期限内以给定价格征集股份，数量和溢价更可见，因此与可随时暂停的 open-market program 不同。</h2>
        <p>
          发行人通过 Schedule TO 等材料说明价格、目标数量、条件、withdrawal 与 proration；若投标超过目标，通常按规则比例接受。较高溢价和更确定的数量可能传递更强信号，也可能为迅速改变资本结构或所有权服务。<Cite n={11} /><Cite n={12} /><Cite n={45} /><Cite n={47} />
        </p>
        <p>
          但溢价不是“免费价值”：公司支付的现金来自全体剩余资本，是否有利取决于相对内在价值、融资成本和卖方构成。公告收益又可能反映交易确定性、信号和控制权，而非 tender orders 在公告日已经成交。
        </p>
      </section>

      <section className="lesson-section" id="dutch-auction">
        <p className="section-kicker">26 · Dutch-auction Tender</p>
        <h2>Dutch auction 让股东在价格区间内报出愿售数量，最终 clearing price 协调目标量；它提供价格发现，却不会消除信息与选择问题。</h2>
        <p>
          股东供给可能向上倾斜：更高价格吸引更多持有人出售，发行人据此选择能购得目标量的单一或规则化价格，并对同价超额部分 proration。与 fixed-price 相比，它把一部分定价交给持有人，但投标者仍可能基于税、流动性、控制权和私人估值自选。<Cite n={11} /><Cite n={12} /><Cite n={47} /><Cite n={48} />
        </p>
        <p>
          研究不能把不同公告收益直接归因于拍卖形式，因为选择 Dutch auction 的公司状态不同。需要控制目的、规模、财务状况与同期消息，并把 announced range、tendered shares、accepted shares、clearing price 与 settlement 分别保存。
        </p>
      </section>

      <section className="lesson-section" id="asr">
        <p className="section-kicker">27 · Accelerated Share Repurchase</p>
        <h2>ASR 把发行人快速降低 outstanding 与 dealer 延后在市场买股连接起来；初始借股交付、后续 covering 和最终 true-up 是三个不同流量。</h2>
        <div className="causal-chain" aria-label="ASR 三阶段状态链" role="list">
          <div role="listitem"><span>01</span><b>Prepayment</b><p>发行人一次支付合同现金。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Initial delivery</b><p>dealer 借股交付，outstanding 快速下降。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Market covering</b><p>dealer 在 valuation window 买股并管理风险。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Final price</b><p>按合约 VWAP、折价与 cap/floor 确定。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>True-up</b><p>现金或股份最终结算。</p></div>
        </div>
        <p>
          只有在明确无 cap/floor/费用，且 C≥0、P<sub>ASR</sub>&gt;0、Q<sub>0</sub>≥0 的教学条件下，才能写 Q<sub>final</sub>=C/P<sub>ASR</sub>、Q<sub>true-up</sub>=Q<sub>final</sub>−Q<sub>0</sub>；否则简式不定义。Southwest 年报披露约 80% initial delivery 与按折价 VWAP 结算的公司实例，借股和 dealer covering 的一般机制由专门研究支持；税务材料也把 ASR 单列。SEC FAQ 明确 dealer covering 不自动落入发行人 10b-18 安全港。<Cite n={3} /><Cite n={21} /><Cite n={64} /><Cite n={91} />
        </p>
      </section>

      <section className="lesson-section" id="primary-follow-on">
        <p className="section-kicker">28 · Underwritten Primary Follow-on</p>
        <h2>承销 primary follow-on 把公司融资需求在较短窗口转成新股交付；承销商提供分销与价格承诺，却不会消除信息折价和市场吸收。</h2>
        <p>
          公司先具备公司法与证券法容量，再通过 registration statement、prospectus supplement、定价、allocation 与 closing 获得 gross proceeds；fees 和 expenses 后才是 net proceeds。美国 S-3／offering reform 与中国 2025 发行注册、交易所审核规则各自定义程序，任何审核、注册或 shelf 生效都不是实际售出。<Cite n={10} /><Cite n={14} /><Cite n={15} /><Cite n={36} /><Cite n={37} /><Cite n={38} />
        </p>
        <p>
          Boeing 2024 招股文件并列普通股发行条款与拟并行的 depositary shares（代表 mandatory convertible preferred stock）发售，展示文件层面应把当前普通股的拟交付与未来潜在稀释分开；但该文件不单独证明两项均已 closing，实际现金和股数变化仍须由完成披露确认。经典 SEO 研究记录负公告反应，却不能把全部跌幅等同于机械稀释；信息、融资需要、发行折价和使用资金都在窗口内更新。<Cite n={71} /><Cite n={72} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="secondary-mixed-follow-on">
        <p className="section-kicker">29 · Secondary 与 Mixed Follow-on</p>
        <h2>二级配售可以显著增加可售股份、改变控制权和 float，却通常不增加公司现金或 outstanding；混合发行必须拆成两条。</h2>
        <p>
          Selling shareholder 的计划、交易和 proceeds 属于持有人账；发行人只在自己交付新股或库存股时取得资金。中国减持办法与沪深交易所指引把股东减持列为独立监管对象，真实美国 mixed prospectus 也明确 selling shareholder 款项不归公司。<Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={96} />
        </p>
        <p>
          对市场微观结构，primary 与 secondary 都可能在短窗口要求买家吸收；对机械 EPS 与公司现金，只能记录 primary。早期 SEO 证据还显示 composition 与公告反应相关，但制度年代、选择和定价过程限制外推。<Cite n={72} />
        </p>
      </section>

      <section className="lesson-section" id="rights-offering">
        <p className="section-kicker">30 · Rights Offering</p>
        <h2>Rights offering 先把按比例认购权交给既有股东；折价决定权利价值和参与激励，却不等于按比例参与者被经济稀释。</h2>
        <div className="equation-card">
          <span>完全认购、忽略费用的理论除权价</span>
          <div>TERP = (P<sub>0</sub> + rK) / (1+r)</div>
          <p>每一旧股可认购 r 股，认购价 K，除权前价格 P<sub>0</sub>。本式适用于 P<sub>0</sub>&gt;0、K≥0、r&gt;0 的同类普通股完全认购基准，因此 1+r&gt;0；若单位不一致、r 无效或交易条件不满足，TERP 记为 N/A，而不是强行代入。按比例行权者保持所有权比例；若权利可转让，不愿出资者可出售权利。只有放弃有价值权利、认购不足、控制权变化或交易摩擦，才出现相应财富转移。</p>
        </div>
        <p>
          Actual outstanding 在股份交付时增加，announcement、record date 与 entitlement 本身不增加股数。美国 rights-offer paradox 与不参与研究显示制度和参与行为重要；中国公司法等法域规则又可能给予不同优先权结构，不能全球化单一结果。<Cite n={32} /><Cite n={74} /><Cite n={80} />
        </p>
      </section>

      <section className="lesson-section" id="atm-offering">
        <p className="section-kicker">31 · At-the-market Offering</p>
        <h2>ATM 让发行人在既有市场中按市场价格持续、小批量售股；shelf 和 sales agreement 只是容量，只有 fills 才是发行流。</h2>
        <div className="equation-card">
          <span>实际 ATM 账本</span>
          <div>Q<sub>ATM</sub> = Σ q<sub>i</sub>；　Gross cash = Σ P<sub>i</sub>q<sub>i</sub>；　Net cash = gross cash − agent commissions − expenses</div>
          <p>每一项 i 必须是实际销售。Prospectus 上限、S-3 shelf 或 sales agreement 不得提前进入数量或现金；若报告只给期间合计，就不能伪造逐笔路径。</p>
        </div>
        <p>
          Rule 415、offering reform 与 Form S-3 定义制度入口；ATM 研究描述其 dribble-out 与选择性时点。GameStop 2021 文件将 program 与之后完成 5m 股、约 11.26 亿美元 gross proceeds 分开，是“容量→实际”的干净案例，但不识别价格变化的单一原因。<Cite n={13} /><Cite n={14} /><Cite n={15} /><Cite n={79} /><Cite n={86} /><Cite n={87} />
        </p>
      </section>

      <section className="lesson-section" id="private-placement-pipe">
        <p className="section-kicker">32 · Private Placement 与 PIPE</p>
        <h2>私募以较少投资者、协商条款和较低公开分销成本换取折价、锁定、治理权或再售限制；它既是融资，也是所有权重组。</h2>
        <p>
          Form D 等通知只是制度入口，不是 SEC 对估值或质量的批准。PIPE（private investment in public equity）可能发行普通股、优先股、可转债或认股权证；实际稀释取决于 closing、conversion、exercise 与反稀释条款，而不是 headline principal。<Cite n={17} />
        </p>
        <p>
          信息不对称可能使公开发行昂贵，特定投资者的 monitoring 又可能有价值；但私募折价也可能转移财富或集中控制。经典 private-placement 证据支持所有权与治理机制，不证明任何折价融资都创造价值。<Cite n={70} /><Cite n={73} />
        </p>
      </section>

      <section className="lesson-section" id="convertibles">
        <p className="section-kicker">33 · Convertible、Warrant 与 Hedge</p>
        <h2>可转债发行时通常先形成债务或复合工具，普通股只有在转换和交付时才实际增加；潜在稀释、市场对冲和最终股数有三条时钟。</h2>
        <p>
          在会计 EPS 中，符合条件的潜在股份可能更早进入 diluted denominator，并按 if-converted 方法调整利息分子；实际 cap table 则等待 conversion、exercise 或 mandatory settlement。现金结算、cap/call、提前赎回、反稀释和到期未转股都可能打断“本金÷转股价”的简单推断。<Cite n={23} /><Cite n={75} />
        </p>
        <p>
          Convertible-arbitrage investor 还可能在发行附近卖空股票对冲 delta，形成不是发行人直接出售的 secondary market flow。S-4 处理部分交换交易，Boeing 的 mandatory convertible 又展示未来强制交付与即时普通股融资并行；具体条款必须从合同读取。<Cite n={16} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="employee-equity-events">
        <p className="section-kicker">34 · Grant、Vest、Exercise、Withholding 与 Warrant</p>
        <h2>员工股权或认股权证从合约承诺到实际股票供给要经过多个门槛；grant size 不是本期发行量。</h2>
        <p>
          Option grant 建立权利但未必在外；vesting 消除服务条件却可能仍待 exercise；RSU settlement 才交付股份，net-share withholding 又会减少实际流向员工的数量。Restricted stock 可能从授予日起已 legally outstanding，必须按计划与适用法律判定。Warrant 还受行权价、现金或净额结算影响；会计确认和法律股数并非同一状态。<Cite n={23} /><Cite n={42} /><Cite n={98} />
        </p>
        <p>
          研究应并列 gross award、vested、exercised/delivered、withheld、forfeited 与 company repurchase。Option 与回购文献说明企业可能用回购吸收股权薪酬导致的供给；这不抹去薪酬费用，也不证明回购由单一 EPS 目标驱动。<Cite n={54} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="stock-ma">
        <p className="section-kicker">35 · Stock-financed M&amp;A</p>
        <h2>股票并购在 closing 交付收购方股份并取得另一家企业；股数增加没有普通现金 proceeds，分子、资产、控制权与风险同时变化。</h2>
        <p>
          Agreement 公布 exchange ratio 与条件，股东/监管批准和其他先决条件满足后才 closing。Exxon–Pioneer 文件先记录每股 Pioneer 换 2.3234 股 Exxon 的协议，后续文件再记录完成；announcement 不是交付日。Form S-4 提供此类交易的注册入口。<Cite n={16} /><Cite n={88} /><Cite n={89} />
        </p>
        <p>
          将新股全部计为 cash gross issuance 会虚构公司现金流；只看分母并称“稀释”又忽略取得资产和未来收益。广义 share-change 数据会把股票并购混入发行，因此必须给每条股份新增标记 consideration type。<Cite n={78} />
        </p>
      </section>

      <section className="lesson-section" id="trade-settlement-closing">
        <p className="section-kicker">36 · Order、Fill、Trade、Settlement 与 Closing</p>
        <h2>市场订单、证券法出售、股份交付、现金结算和并购 closing 不是同一时点；账本必须声明哪一时刻改变哪一个状态。</h2>
        <p>
          普通公开市场回购有 order、execution/trade date 和 settlement；issuer tender 有投标、expiration、acceptance、proration 和 payment；ATM 有 fill 与 settlement；ASR 另有 prepayment、initial delivery、valuation window 与 final settlement；股票并购则以 closing 触发股份交付。T+1 只是多数美国 broker-dealer 证券交易的普通周期，不应覆盖特殊机制。<Cite n={11} /><Cite n={13} /><Cite n={92} />
        </p>
        <p>
          研究表至少保存 `decisionAt`、`orderAt`、`fillAt`、`settleAt`、`closingAt`、`asOf` 和 `publicAt`。Item 703 披露月份不能被当作精确成交日；只有文件提供的粒度才是可用事实。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="treasury-retirement-accounting">
        <p className="section-kicker">37 · Treasury、Retirement 与 Accounting</p>
        <h2>公司取得自家股份时，经济上已减少外部 outstanding；之后选择持有还是注销影响 issued 与 treasury，却不能再次创造同一减少。</h2>
        <p>
          回购入 treasury：ΔI=0、ΔT=+q、ΔO=−q；注销已有 treasury：ΔI=−q、ΔT=−q、ΔO=0；库存股再发行：ΔI=0、ΔT=−q、ΔO=+q。若直接取得并注销，则 ΔI=−q、ΔO=−q。IAS 32 把 treasury shares 作为权益抵减，并不在出售或注销时确认损益。<Cite n={24} />
        </p>
        <p>
          Delaware §243 只是注销后股本状态的一个法域示例；公司章程、其他州法和中国公司法可能不同。SEC 报表示例有助于看 issued、outstanding 与 treasury 的呈现，却不替代准则。<Cite n={94} /><Cite n={97} />
        </p>
      </section>

      <section className="lesson-section" id="issuance-accounting">
        <p className="section-kicker">38 · Gross Proceeds、Fees、Additional Paid-in Capital（APIC）与 Net Cash</p>
        <h2>发行价格乘实际交付股数得到 gross proceeds；发行费用以后才是 net cash，面值与 additional paid-in capital（APIC，超出面值的缴入资本）是权益列报，不是第二次融资。</h2>
        <div className="equation-card">
          <span>Primary cash bridge</span>
          <div>Gross proceeds = ΣP<sub>i</sub>q<sub>i</sub>；　Net proceeds = gross proceeds − Σ(non-overlapping issuer-paid offering costs)</div>
          <p>只有发行人实际交付的 primary 或 treasury-reissued shares 进入 q。Underwriting discount 与 agent commission 按机制择用，只有来源明确为互斥项目时才分别扣除，不能重复计算同一费用。Secondary tranche 的 proceeds 归 selling shareholder；股票并购对价和无现金转换也不进入普通现金 gross proceeds。</p>
        </div>
        <p>
          Prospectus 常同时给 maximum、gross、费用估算与 use of proceeds，closing 后还需与现金流量表、权益变动表和 cap table 勾稽。Boeing 与 mixed-offering 文件说明一份交易中可以有不同证券和不同收款人；S-3 capacity 不能提前入账。<Cite n={15} /><Cite n={24} /><Cite n={90} /><Cite n={96} />
        </p>
      </section>

      <section className="lesson-section" id="corporate-order-flow">
        <p className="section-kicker">39 · Corporate Order Flow、Depth 与 Price Impact</p>
        <h2>实际回购是方向性买盘，实际发行分销是供给，但价格效果取决于参与率、订单类型、库存、信息和替代买家，而非只由符号决定。</h2>
        <p>
          在相同股数下，深度较薄、执行更集中、信息更单一和 dealer capacity 更弱时，短期影响可能更大；分散 ATM 可以减少瞬时冲击，却延长供给 overhang。回购也可能在正常状态补充 limit-order liquidity，而在压力中因公司暂停或自身融资受限而消失。实际交易研究发现 timing 与 liquidity 效果异质。<Cite n={57} /><Cite n={68} />
        </p>
        <p>
          Rule 10b-18 的 25% ADTV condition 不是冲击函数。研究应分别估计 announcement effect、actual-flow impact、temporary reversal 与 permanent information component，并保存未成交量；没有订单级数据时，不能由季度现金额反推日内买盘。<Cite n={1} /><Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="balance-sheet-feedback">
        <p className="section-kicker">40 · Cash、Debt、Interest 与 Investment Feedback</p>
        <h2>交易完成后的新资产负债表会改变下一轮融资、投资和回购能力，corporate flow 因而具有跨期反馈。</h2>
        <p>
          现金回购 C 在忽略税费时令 A 与 E 同减 C；债务融资回购令负债上升、权益下降，并在未来产生利息。发行先提高现金和权益，若用于偿债则降低固定索取，若用于投资则把现金变成经营资产，若持续补亏则可能只延长 runway。每一步都改变 rating、covenant headroom、liquidity buffer 和未来资本成本。<Cite n={44} /><Cite n={51} /><Cite n={67} />
        </p>
        <p>
          Tender 与 ATM 只是把资本结构调整以不同速度实施；契约或监管又可能覆盖管理层选择。故下一期回购/发行不是上一期符号的简单延续，而是由成交后的状态重新计算。<Cite n={12} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="float-ownership-borrow">
        <p className="section-kicker">41 · Float、Ownership、Borrow 与 Concentration</p>
        <h2>Outstanding 变化只告诉外部股份总量；谁卖、谁买以及何种股份变成可交易，才决定 float、控制权、借券与集中度。</h2>
        <p>
          回购公众流通股通常降低某一 free-float 口径，回购关联方非流通股却可能几乎不动 float；大股东 secondary sale 可以在 O 不变时提高 float。Private placement 可能引入监督型大股东，也可能增加锁定和集中；tender 又会因股东供给异质改变继续持有者的所有权比例。<Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={48} /><Cite n={73} />
        </p>
        <p>
          借券可供给常来自机构持股，float 下降不必一比一降低 lendable supply，且新持有人是否出借取决于政策。指数方法还会排除战略持股；因此任何 `float change` 必须附方法标签和 holder mapping。<Cite n={93} />
        </p>
      </section>

      <section className="lesson-section" id="index-passive-reweight">
        <p className="section-kicker">42 · Index Free Float 与 Passive Reweight</p>
        <h2>公司流量先改变指数方法使用的 shares 或 free-float factor，只有在评审、生效和基金执行后，才可能变成被动订单。</h2>
        <p>
          不同指数采用不同 float、缓冲、review frequency 与 implementation rule；公司回购、secondary sale、股票并购或大型发行可能改变 investable weight，也可能因规模太小或仍被战略持有人锁定而暂不生效。MSCI free-float 方法说明分母是规则产物，不是 outstanding 的同义词。<Cite n={93} />
        </p>
        <p>
          被动资金的 target 还取决于基金 AUM、复制方法、现金、衍生品与跟踪容忍度，实际 fill 又受市场深度约束。Exxon–Pioneer 这类股票并购增加收购方股份和合并资产，不能只用分母变化推断指数需求；广义 share issuance 数据同样需要事件分类。<Cite n={78} /><Cite n={89} />
        </p>
      </section>

      <section className="lesson-section" id="mechanical-eps-bridge">
        <p className="section-kicker">43 · Mechanical EPS Bridge</p>
        <h2>EPS 的机械变化来自利润分子和加权股数分母共同改变；价格、价值、现金流和风险都不在这个比率里自动出现。</h2>
        <p>
          回购减少 WASO，却可能损失现金利息、增加债务利息、产生税费或挤出经营收益；发行增加 WASO，却可能降低利息、避免 distress 或让新投资增加利润。只有先写 `no-transaction earnings`，再逐项加入 financing、tax、investment 和 timing，才知道分子是否足以抵消分母。<Cite n={23} />
        </p>
        <p>
          Option dilution、EPS thresholds 与真实投资研究说明管理层可能回应这个机械桥；但 accretion 既不是低估证明，也不是价值创造证明。亏损时 EPS 从更负变得较不负是否叫“增厚”高度误导，应直接展示 numerator/denominator bridge。<Cite n={55} /><Cite n={61} /><Cite n={67} />
        </p>
      </section>

      <section className="lesson-section" id="valuation-wealth-transfer">
        <p className="section-kicker">44 · Valuation、Wealth Transfer 与 NPV Boundary</p>
        <h2>在经营资产与融资风险固定的静态边界中，回购价低于原每股内在价值才提高继续持有者的每股价值；发行是镜像关系。</h2>
        <div className="equation-card">
          <span>静态、不可直接观测的每股价值边界</span>
          <div>v<sub>buy</sub> = (V − Pq)/(S − q)，v<sub>buy</sub>−v<sub>0</sub> = q(v<sub>0</sub>−P)/(S−q)；　v<sub>issue</sub> = (V + Pq)/(S + q)，v<sub>issue</sub>−v<sub>0</sub> = q(P−v<sub>0</sub>)/(S+q)</div>
          <p>V 是交易前已含现金的内在股权价值，v<sub>0</sub>=V/S。回购式定义域为 S&gt;0、0≤q&lt;S；发行式为 S&gt;0、q≥0。q=0 是 no-op，两项价值差都为零；只有 q&gt;0 时才可用价格符号判断：回购价 P 低于 v<sub>0</sub> 时继续持有者受益，高于则受损；发行价高于 v<sub>0</sub> 时原股东静态受益，低于则发生反向财富转移。P=v<sub>0</sub> 时两种交易在此静态边界中都中性。公式假定经营资产、信号、税、投资机会和融资风险不变，现实中这些项通常一起变化。</p>
        </div>
        <p>
          无摩擦基准、债权人财富、回购收益来源、融资顺序、SEO 和 private-placement 证据分别补充不同现实偏离。内在价值本身不可观察，所以该式只能生成条件判断，不能把当日市价与事后上涨倒推为公司已知真值。<Cite n={44} /><Cite n={46} /><Cite n={56} /><Cite n={70} /><Cite n={71} /><Cite n={73} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-cost-capital">
        <p className="section-kicker">45 · Liquidity、Spread 与 Cost of Capital 的双向性</p>
        <h2>回购可以提供经常性买盘并改善正常流动性，也可以缩小 float 或在最需要时暂停；发行可扩大 float，也可能造成短期库存压力。</h2>
        <p>
          实际回购的 limit-order 证据支持某些样本中的流动性改善，执行研究也记录成本与 timing；但平均结果不保证大额集中订单、压力状态或低 float 股票同样改善。ATM 将供给分散，underwritten deal 则让承销商承担短期库存和分销，两者的 spread 与 impact 路径不同。<Cite n={57} /><Cite n={68} />
        </p>
        <p>
          长期资本成本又通过风险、信息、融资灵活性、所有权和市场质量反馈：更高杠杆可能提高股权风险，更多 float 可能拓宽投资者基础，可信资本配置可能降低代理折价。综述只能给出通道，不提供“回购必降资本成本”的单调结论。<Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="knowable-clocks">
        <p className="section-kicker">46 · Knowable-when Clocks</p>
        <h2>经济事件发生、公司记账、官方公开、数据库抓取和历史修订是五个时点；实时研究只允许使用当时已经公开并可获得的版本。</h2>
        <p>
          一笔 June 回购可在 June 成交、T+1 结算、quarter-end 汇总、August 的 10-Q 才公开，数据库翌日抓取；用它预测 July 就是前视。Fed 数据又可能在后来 vintage 修订。每条记录至少保存 `eventAt/fillAt`、`settleAt`、`periodStart/End`、`filedAt/publicAt`、`observedAt` 和 `revisionVintage`。<Cite n={6} />
        </p>
        <p>
          2023 SEC 逐日回购披露规则已被法院撤销并由 2024 技术修订恢复旧状态；2026 SEC registered-offering reform 和深交所后续修订仍是 proposal，就不能作为已生效时钟。<Cite n={7} /><Cite n={8} /><Cite n={9} /><Cite n={22} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="filing-map">
        <p className="section-kicker">47 · Filing Map 与 Observability</p>
        <h2>没有一张表同时给出董事会意图、逐日回购、所有发行机制、现金到账和最终股数；研究必须把文件按状态拼接。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="公司流量文件地图，可横向滚动">
          <table className="concept-table">
            <caption>文件告诉你什么，也明确它没有告诉你什么</caption>
            <thead><tr><th scope="col">材料</th><th scope="col">可观察</th><th scope="col">主要缺口</th></tr></thead>
            <tbody>
              <tr><th scope="row">8-K／公告／董事会决议</th><td>authorization、purpose、部分合约</td><td>后续 actual fills</td></tr>
              <tr><th scope="row">10-Q／10-K Item 703</th><td>按月购买量、均价、plan 与余额</td><td>逐日路径与完整交易条件</td></tr>
              <tr><th scope="row">S-3／shelf／ATM supplement</th><td>容量、证券、代理、最大金额</td><td>未来实际售出量</td></tr>
              <tr><th scope="row">424(b) prospectus</th><td>定价条款、tranche、拟售数量与预计 proceeds</td><td>不能单独证明 closing、delivery 或实际到账</td></tr>
              <tr><th scope="row">Closing 8-K／完成公告</th><td>完成日、实际售股／交付及已披露到账</td><td>未披露费用、资金用途与二级市场冲击分解</td></tr>
              <tr><th scope="row">S-4／merger filing</th><td>exchange ratio、条件、交付结构</td><td>closing 前不是实际股数</td></tr>
              <tr><th scope="row">A 股计划／进展／结果公告</th><td>目的、上限、实施进展与结果</td><td>计划额不等于成交额</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          SEC forms、Rule 415、S-3/S-4/Form D 与中国回购、发行、减持、激励规则各自覆盖不同状态。Current Item 703 只提供 periodic monthly aggregates；424(b) 可冻结发售条款，却必须与明确的 completion filing 分开。研究者应保留未知，而不是用“合理推断”补成逐日 tape 或已完成交易。<Cite n={6} /><Cite n={10} /><Cite n={13} /><Cite n={15} /><Cite n={16} /><Cite n={17} /><Cite n={33} /><Cite n={36} /><Cite n={39} /><Cite n={42} /><Cite n={87} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="reconstruct-ledger">
        <p className="section-kicker">48 · Reconstructing the Corporate-flow Ledger</p>
        <h2>重建从 gross events 开始，再分别勾稽现金、股数和市场流量；从期末净变化倒推只在没有其他事件时才安全。</h2>
        <p>
          第一步列出 primary issuance、treasury reissue、SBC delivery、conversion、stock M&amp;A、repurchase、retirement 与 secondary transfer；第二步给每条标记 cash/noncash、issuer/holder、actual/capacity；第三步沿 issued、treasury 与 outstanding 对账；第四步再与现金流、权益表和披露金额勾稽。<Cite n={62} /><Cite n={78} />
        </p>
        <p>
          用 `Δshares × price` 估算发行现金会把并购和薪酬错记为融资，用现金流量表回购项估股数又会受到价格与分类影响。Fed EFA 采用多源方法构造部门 gross legs，数据字典把回购和 cash M&amp;A 分开；即使如此仍需保存范围与 revision。<Cite n={27} /><Cite n={28} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="flow-intensity">
        <p className="section-kicker">49 · Flow Intensity 与 Denominator Choice</p>
        <h2>“回购强度”没有天然分母：相对市值、ADV、outstanding、现金流或资产衡量的是不同能力与影响。</h2>
        <div className="equation-card">
          <span>先命名再计算</span>
          <div>Buyback yield = repurchase cash / M<sub>0</sub>；　Gross repurchase share rate = shares reacquired / O<sub>0</sub>；　Participation = actual shares / matched market volume</div>
          <p>M<sub>0</sub>&gt;0 用观察窗起点总普通股市值，O<sub>0</sub>&gt;0 用同一证券范围的起点 outstanding，matched market volume 也必须大于 0。任一分母为 0 或缺失时显示 N/A；只有分子为 0 且分母有效时结果才为 0。Participation 必须用实际成交与同口径市场成交量；授权金额、期末市值或 free-float 市值不能悄悄替换分母。</p>
        </div>
        <p>
          Net payout yield 可写为 (common dividends + repurchase cash − gross issuance cash)/M<sub>0</sub>，可以为负或超过 100%，不应截断；非现金股份仍须另列。S&amp;P buyback methodology 提供一种起点市值口径，payout 研究则说明加入 issuance 后含义会改变。<Cite n={60} /><Cite n={95} />
        </p>
      </section>

      <section className="lesson-section" id="announcement-event-study">
        <p className="section-kicker">50 · Announcement Event Study</p>
        <h2>公告事件研究估计市场对一组新信息的即时联合反应；它不是实际股数变化、订单冲击或长期价值创造的直接测量。</h2>
        <p>
          研究先定义 expected-return model、event time 与 window，再计算 abnormal return；若同日有 earnings、guidance、融资、并购或管理层变动，回购/发行消息不能单独分离。不同回购机制和 primary/secondary composition 的经典结果有启发，却受自选与历史制度限制。<Cite n={45} /><Cite n={46} /><Cite n={47} /><Cite n={71} /><Cite n={72} />
        </p>
        <p>
          长期 event study 还受到 benchmark、rebalancing、survivorship 与 overlapping returns 影响；公告后收益不自动证明 underreaction 或成功择时。可证伪设计应检查 bundled news、未执行授权、不同完成率与实际成交时点。<Cite n={49} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="actual-repurchase-identification">
        <p className="section-kicker">51 · Actual Repurchase Identification</p>
        <h2>要研究实际回购，必须比公告向后走：观察公司何时、以何价、买多少，并处理只有执行者才进入样本的选择。</h2>
        <p>
          交易级自愿样本能研究 timing、成本与日内影响，却可能偏向愿意提供数据的公司；月均回购价格和 Item 703 aggregates 扩大覆盖，却失去逐日路径；现金流和库存股估算法覆盖更广，又带来分类误差。任何结果都应同时报告 coverage、frequency、lag 与 imputation。<Cite n={50} /><Cite n={57} /><Cite n={62} /><Cite n={66} />
        </p>
        <p>
          历史完成率和声誉可以预测执行，但也可能代理公司稳定性；Apple 的年报是直接年度对账，却不能证明每笔交易按哪个安全港或造成多少价格影响。Actual-flow study 与 event study 互补，不可互相冒充。<Cite n={65} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="issuance-identification">
        <p className="section-kicker">52 · Issuance-effect Identification</p>
        <h2>发行影响至少分成 announcement、offer pricing、allocation/closing、secondary-market absorption 和资金使用；不同设计估计不同层。</h2>
        <p>
          SEO 公告研究受信息与融资需求混合；discount 研究要区分承销、流动性和风险；ATM 的选择性销售使 quantity 内生于价格；rights 的参与和权利可转让性改变财富转移；长期新发行收益又依赖 benchmark。<Cite n={70} /><Cite n={71} /><Cite n={72} /><Cite n={74} /><Cite n={76} /><Cite n={79} />
        </p>
        <p>
          可信研究要先拆 primary/secondary、cash/noncash 和 capacity/actual，再指定 estimand：例如“每新增 1% outstanding 的短期 price pressure”与“公告导致的信念更新”不同。Use of proceeds 也是中介变量，不能在交易尚未发生时假定项目已经产生收益。
        </p>
        <div className="learning-objectives">
          <span>Identification ladder · 从问题到可证伪设计</span>
          <ol>
            <li><b>冻结 treatment：</b>分别选择 actual shares、actual cash、announcement 或 rule exposure；除非能从当时可见文件直接验证，不把 10b5-1 等外部不可见安排当作已观察处理。</li>
            <li><b>冻结单位、时钟与 estimand：</b>说明观测单位是 issuer、security 还是 event，分开 eventAt 与 publicAt，并明确估计公告更新、实际流量冲击还是长期融资结果。</li>
            <li><b>构造反事实：</b>选择可比的尚未处理者、制度阈值或外生资格变化，并解释为什么它们在没有 treatment 时会给出可比路径。</li>
            <li><b>执行诊断：</b>检查 pre-trend、anticipation、bundled news、placebo dates／outcomes，以及 measurement、coverage 与 vintage 是否改变结论。</li>
            <li><b>声明边界：</b>逐项讨论 exclusion restriction、遵从与替代行为、local effect、external validity，并预先写出会证伪机制的观察结果。</li>
          </ol>
        </div>
        <p>
          这条阶梯不保证识别成功；它只把“处理究竟是什么、何时可知、与谁比较、靠什么假设、在哪些条件下放弃结论”变成可审计对象。若实际成交由未观测价格路径内生选择，或规则同时改变其他融资工具，研究就应缩小 estimand，而不是用更多控制变量掩盖处理定义错误。<Cite n={57} /><Cite n={62} /><Cite n={67} /><Cite n={71} /><Cite n={79} />
        </p>
      </section>

      <section className="lesson-section" id="rule-tax-experiment">
        <p className="section-kicker">53 · Rule／Tax Natural Experiment 与 Lifecycle</p>
        <h2>制度变化可提供外生变动，但 treatment 必须按生效、适用对象、过渡和遵从反应定义，而不是用公告年份切一刀。</h2>
        <p>
          §4501 需要区分 statute、2024 procedure、2025 final computation 与各自 applicability；EU MAR、美国安全港与中国 2025 回购/发行规则覆盖的法域、证券和目的又不同。研究者应检验 treated/control 是否真正受相同阈值之外的规则影响，并排除同期税、利率和市场制度变化。<Cite n={18} /><Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={30} /><Cite n={31} /><Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} />
        </p>
        <p>
          Event date、effective date、covered period、filed/public date 与 first-enforced date 都可能不同。制度还会改变机制选择：公司可在回购、股息、SBC、M&amp;A、境外主体和发行净额之间调整，所以只看回购总额可能漏掉替代反应。
        </p>
      </section>

      <section className="lesson-section" id="stress-switch-cases">
        <p className="section-kicker">54 · Stress Switch：回购暂停与紧急发行</p>
        <h2>压力状态最能揭示 corporate flow 的内生性：平时的回购买盘可以突然消失，平时不愿稀释的公司也会把融资生存置于每股指标之前。</h2>
        <p>
          2020 年美联储限制覆盖大型银行回购以保留资本，2021 年再按压力资本条件退出，说明监管约束可切断 authorization→order。GameStop 2021 ATM 则展示高市场价格和融资窗口怎样把 shelf capacity 变成 5m 股实际销售与约 11.26 亿美元 gross proceeds。<Cite n={84} /><Cite n={85} /><Cite n={86} /><Cite n={87} />
        </p>
        <p>
          Boeing 2024 招股文件并列普通股发售与拟并行的 depositary shares（代表 mandatory convertible preferred stock）发售，说明压力融资计划可以同时设计当前普通股与未来潜在稀释两条腿；但这份文件本身只证明条款和拟议结构，不证明两项均已交割。实际 closing、现金、股数以及之后的价格与经营结果，都须由相应完成披露和反事实另行确认。<Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="chain-break-counterexamples">
        <p className="section-kicker">55 · Chain-break Counterexamples</p>
        <h2>每一种“回购买、发行卖”的叙事都必须主动寻找能使链条中断、反向或净额消失的条件。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="公司流量常见断链条件，可横向滚动">
          <table className="concept-table">
            <caption>观察到左侧事实时，至少检查右侧反例</caption>
            <thead><tr><th scope="col">表面事实</th><th scope="col">可能断链</th><th scope="col">需要的证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">大额回购授权</th><td>未买、少买、暂停、价格条件未满足</td><td>actual shares、cash、period 与 remaining cap</td></tr>
              <tr><th scope="row">回购现金很高</th><td>SBC、转股或股票并购使净股数不降</td><td>全部 gross share events</td></tr>
              <tr><th scope="row">EPS 上升</th><td>纯分母效应、利息未计、投资被削减</td><td>分子桥、WASO 与投资反事实</td></tr>
              <tr><th scope="row">Offering 规模很大</th><td>secondary 不给公司现金，shelf 尚未成交</td><td>tranche、fill 与 use of proceeds</td></tr>
              <tr><th scope="row">Rights 折价</th><td>按比例认购或出售权利者未受财富损失</td><td>参与、转让和控制权</td></tr>
              <tr><th scope="row">负 net issuance</th><td>含 cash M&amp;A retirement，不全是回购</td><td>gross issuance、repurchase 与 M&amp;A</td></tr>
              <tr><th scope="row">公告后上涨／下跌</th><td>同期 earnings、guidance、risk 与 financing news</td><td>完整信息集和可信反事实</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          反例不是削弱分析，而是给机制设置可证伪门槛：只要 authorization 未进入 fill、股数和现金不同步、深度足以吸收、融资成本抵消 EPS、或对照组同样变动，就必须降低结论。最终目标是让每条因果链既能闭环，也能被证据打断。<Cite n={27} /><Cite n={50} /><Cite n={57} /><Cite n={62} /><Cite n={67} /><Cite n={79} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">56 · Corporate Flow Three-ledger Lab</p>
        <h2>十道唯一答案题把股数、现金、市场流量与证据时钟放在同一张工作台上，使“净额看起来合理”不再掩盖错误分类。</h2>
        <p>
          Mode A 的五题依次核算 issued／treasury／outstanding／float、WASO 与 diluted EPS、primary／secondary 与 payout、债务融资回购、ASR 与 ADV 容量；Mode B 的五题审计 authorization、mixed offering、Rule 10b-18、publicAt 和 event-study estimand。每题冻结单位、法域、条款与时点；本实验使用的除法均冻结为正分母，正文公式的定义域与零值／N/A 处理则以各机制单元明确写出的条件为准。三个选项只有一个同时满足账本与证据。<Cite n={1} /><Cite n={6} /><Cite n={23} /><Cite n={24} /><Cite n={60} /><Cite n={91} />
        </p>
        <CorporateFlowLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">57 · 主动练习 · 十道无脚本迁移题</p>
        <h2>静态孪生更换数字或机制；先写“谁交付、谁收钱、何时可知、哪本账变化”，再展开答案。</h2>
        <div className="practice-grid">
          {corporateFlowScenarios.map((scenario, index) => (
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
        <p className="section-kicker">58 · 十四道理解检查、Evidence Passport 与最小术语桥</p>
        <h2>真正掌握 corporate flow，是能在任何“公司买回／公司发股”的标题下恢复状态机、三本账、双时间轴和反事实。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="公司流量研究证据等级护照，可横向滚动">
          <table className="concept-table">
            <caption>Evidence passport：标签表示材料对某类命题的角色，不是一条总可信度排名</caption>
            <thead><tr><th scope="col">标签</th><th scope="col">材料</th><th scope="col">允许的表述</th><th scope="col">仍不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">A · Direct record</th><td>董事会决议、合同、prospectus、fill、cash、cap table</td><td>“记录显示容量／交易／状态发生”</td><td>未记录动机与无交易反事实</td></tr>
              <tr><th scope="row">B · Formal rule/finding</th><td>生效法规、裁判、正式监管认定</td><td>“该规则／机关在适用范围内要求／认定”</td><td>其他法域、历史版本或经济因果</td></tr>
              <tr><th scope="row">C · Allegation/assertion</th><td>诉状、公司动机陈述、管理层评论</td><td>“文件指控／管理层表示”</td><td>把陈述写成已证实动机</td></tr>
              <tr><th scope="row">D · Internal/staff review</th><td>董事会、机构或 staff 报告</td><td>“报告重建／认为”</td><td>法院终局认定或全市场事实</td></tr>
              <tr><th scope="row">E · Causal design</th><td>threshold、instrument、natural experiment、placebo</td><td>“在识别假设与局部样本下估计”</td><td>超出 treatment、时期和样本的普遍参数</td></tr>
              <tr><th scope="row">F · Structural scenario</th><td>EPS、价值、impact、capital-allocation 模型</td><td>“给定参数与假设时产生”</td><td>现实内在价值或主体必然遵循</td></tr>
              <tr><th scope="row">U · Unknown</th><td>未观察订单、逐日路径、动机或反事实</td><td>“未知／待验证”</td><td>用故事补齐状态机</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Direct filing 对“交易是否完成”最强，法规对“当时适用什么”最强，因果设计才处理“若没有交易会怎样”，结构模型负责条件推导；它们不是互相替代。2023 规则撤销是 B 级法律状态，Apple 年报是 A 级年度记录，EPS 价值式是 F 级条件推导，管理层声称低估则仍是 C 级 motive assertion。<Cite n={7} /><Cite n={8} /><Cite n={44} /><Cite n={67} /><Cite n={81} />
        </p>
        <div className="precision-note">
          <span>可复用 Evidence Passport · 每一条 claim 的最小字段</span>
          <p><code>claimId · sourceClass · claimRole · jurisdiction/version/effectiveAt · actionStage · transactionForm · primary/secondary · shares/cash/FMV · gross/net definition · eventAt/fillAt/settleAt/asOf/publicAt/observedAt/vintage · sourceIds · estimand/counterfactual · coverage/unknowns</code></p>
          <p>字段不是装饰性元数据：它们分别固定命题、证据角色、适用规则、交易状态、三本账、双时间轴和识别边界。任何缺失值都显式记为 <b>U · Unknown</b>，不得用估算、管理层叙事或事后价格路径静默补齐。</p>
        </div>

        <details className="understanding-check"><summary>01 · 为什么 100 亿美元 authorization 不能换算成将回购的股数？</summary><p>授权只是上限，没有价格、执行义务和真实成交；只有 actual fills 才能按各自价格求股数。</p></details>
        <details className="understanding-check"><summary>02 · Primary 与 secondary 最小区别是什么？</summary><p>Primary 由发行人交付新股或库存股并取得对价；secondary 通常由既有持有人转让，发行人不收款、outstanding 不变。</p></details>
        <details className="understanding-check"><summary>03 · 为什么 treasury stock retirement 不会再降低 outstanding？</summary><p>回购入库时 treasury 已上升并令 issued−treasury 下降；注销同时降低 issued 与 treasury，差额保持不变。</p></details>
        <details className="understanding-check"><summary>04 · 期末 outstanding 为什么不能直接算全年 basic EPS？</summary><p>EPS 使用期间加权平均普通股数；发行或回购只从实际在外状态变化时按时间权重进入。</p></details>
        <details className="understanding-check"><summary>05 · Diluted shares 为什么不是市场中的真实股份供给？</summary><p>它是准则下对潜在普通股的条件分母，还可能配套调整利润分子；实际供给等待 exercise、conversion 或 delivery。</p></details>
        <details className="understanding-check"><summary>06 · EPS accretion 为什么不证明价值创造？</summary><p>分母可以在高估价格回购后机械下降；价值还取决于回购价相对内在价值、资金成本、机会成本、税和风险。</p></details>
        <details className="understanding-check"><summary>07 · ASR initial delivery 为什么不是当日公开市场买盘？</summary><p>dealer 通常先借股交付，随后在 valuation window 内买股覆盖，最终再按合同 true-up；三者时钟不同。</p></details>
        <details className="understanding-check"><summary>08 · 25% ADTV 为什么不是普遍法定上限？</summary><p>它是美国 Rule 10b-18 非排他安全港的一项 volume condition，并有 block exception；未满足不自动等于违法。</p></details>
        <details className="understanding-check"><summary>09 · Rights 折价为什么不自动使按比例认购者变穷？</summary><p>其旧股价格下降对应获得的有价值权利；按比例认购维持持股，或出售可转让权利，可保留经济价值。</p></details>
        <details className="understanding-check"><summary>10 · ATM agreement 为什么不能计作当日发行？</summary><p>Agreement 和 shelf 提供容量；只有实际销售数量、价格和结算才进入股数与现金账。</p></details>
        <details className="understanding-check"><summary>11 · Fed net issuance 为负为什么不等于回购金额？</summary><p>其 gross retirement 同时包含 issuer repurchases 和 cash-financed M&amp;A；净值还要减去 gross issuance。</p></details>
        <details className="understanding-check"><summary>12 · 回购公告上涨为什么不是 actual order impact？</summary><p>公告可能在成交前发生，窗口还更新信号、资本配置、融资和其他消息；需要 actual fills 与反事实才能分解。</p></details>
        <details className="understanding-check"><summary>13 · 同期回购和 SBC 净股数为零，为什么仍不能说“没有流量”？</summary><p>公司有现金买盘、员工获得 gross shares，所有权和费用也变化；净额只隐藏了两条方向相反的 gross leg。</p></details>
        <details className="understanding-check"><summary>14 · 一个合格的 corporate-flow 研究怎样被证伪？</summary><p>预先规定 capacity、actual transaction、cash/share ledger、market channel 与 outcome；若未成交、属于 secondary、分母口径错、同期消息解释结果或对照组同变，就降低或放弃机制结论。</p></details>

        <div className="glossary-grid">
          <article><span>Authorization</span><p>董事会或适格机关允许在条件和上限内行动的容量，不是最低执行承诺。</p></article>
          <article><span>Authorized shares</span><p>章程或公司法允许发行的股份容量，与回购 authorization 是不同概念。</p></article>
          <article><span>Issued shares</span><p>公司已经发行且尚未按适用法注销的股份，通常含 outstanding 与 treasury。</p></article>
          <article><span>Treasury shares</span><p>公司已取得但未注销的自有股份，在权益中抵减而非公司资产。</p></article>
          <article><span>Outstanding shares</span><p>Issued 减 treasury 后由外部持有的实际股份。</p></article>
          <article><span>Free float</span><p>按指定方法认定可供公众投资的 outstanding 子集，必须带方法标签。</p></article>
          <article><span>WASO</span><p>报告期内按实际在外时间加权的 basic shares，不是期末股数。</p></article>
          <article><span>Diluted shares</span><p>EPS 准则下潜在普通股的条件分母，不是 actual outstanding 或 float。</p></article>
          <article><span>Primary issuance</span><p>发行人交付股份并取得对价的发行腿，通常增加 outstanding 与公司资金。</p></article>
          <article><span>Secondary sale</span><p>既有持有人之间的股份转让，通常不增加发行人现金或 outstanding。</p></article>
          <article><span>Gross issuance</span><p>在声明的现金或股份口径下，不先与回购相抵的全部发行腿。</p></article>
          <article><span>Net equity flow</span><p>必须随账本定义：股份账为 gross shares delivered 减 shares reacquired；现金账为 gross primary issuance cash 减 repurchase cash；Fed 部门口径另减 cash M&amp;A retirements。Legal retirement 不作为同一次回购的第二次 outstanding 减少。</p></article>
          <article><span>Open-market repurchase</span><p>发行人经市场逐步购买股份的机制，授权与实际成交可长期分离。</p></article>
          <article><span>Issuer tender</span><p>发行人在限定期限与条款下向股东公开征集股份的回购机制。</p></article>
          <article><span>ASR</span><p>预付款、初始借股交付、dealer 市场 covering 与最终 true-up 组成的加速回购。</p></article>
          <article><span>ATM offering</span><p>发行人通过代理在既有市场中按市场价格持续或分批售股的 primary 机制。</p></article>
          <article><span>Retired shares</span><p>已经按适用公司法注销的事件状态；从 treasury 注销同时减少 issued 与 treasury，不会再次减少 outstanding。</p></article>
          <article><span>PublicAt / Vintage</span><p>材料首次外部可见时点与数据库版本；共同决定实时研究能否使用。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">59 · 课程接口、复述与四层精选阅读路径</p>
        <h2>2.20 在“公司选择怎样变成真实股份、现金与市场流量”处停止；下一节把公司与其他异质主体重新组合成内生动态系统。</h2>
        <div className="interface-grid">
          <article><span>回接 1.09</span><h3>Price Impact</h3><p>actual issuer order 与发行分销只有进入有限深度，才产生暂时或永久价格成分。</p></article>
          <article><span>回接 1.20</span><h3>Leverage &amp; Forced Liquidation</h3><p>债务融资回购或压力发行改变杠杆缓冲；价格、抵押品与契约反馈只有经过约束和真实处置，才形成强迫流量。</p></article>
          <article><span>回接 2.15</span><h3>Limits to Arbitrage</h3><p>发行折价或回购信号能否被套利，取决于融资、时间、借券与路径风险。</p></article>
          <article><span>回接 2.16</span><h3>Risk Governance</h3><p>资本、liquidity、covenant 与监管决定 management target 能否成为授权行动。</p></article>
          <article><span>回接 2.18</span><h3>Benchmark</h3><p>free-float 与 shares update 经指数 review 才进入被动 target，不能由公司公告直接推导订单。</p></article>
          <article><span>回接 2.19</span><h3>Crowding</h3><p>发行人买盘、发行供给与持有人 secondary flow 改变共同退出容量和市场承接。</p></article>
          <article><span>连接 2.21</span><h3>Heterogeneous Agents</h3><p>把公司、dealer、套利者、被动基金、员工与既有股东的不同规则合成内生价格动态。</p></article>
          <article><span>连接 3.13</span><h3>Financial Conditions</h3><p>利率、信用利差、银行信贷和估值怎样改变 cash/debt/equity 的相对成本。</p></article>
          <article><span>连接 5.07</span><h3>Tax System</h3><p>税制改变股息、回购、发行净额与跨法域组织，但税务账不替代市场账。</p></article>
          <article><span>连接 6.01／6.15</span><h3>Expectations &amp; Narrative</h3><p>公告先改变信念与叙事；管理层关于低估或用途的表述仍是待验证主张，actual order、现金用途与结果属于另一层事实。</p></article>
          <article><span>连接 7.17</span><h3>Causal Identification</h3><p>输出状态机、event/public clocks、gross legs、estimand 与断链条件，供可证伪研究使用。</p></article>
        </div>
        <div className="precision-note">
          <span>85–90 分钟核心首读</span>
          <p>按 00–10 → 11、16、20 → 21–23、25、27、30–31、35 → 36–39、43–44 → 46、48、50–52、55 → 56–59 阅读；第二遍补全其余机制、完成 Lab 与静态孪生，并亲手重建至少一家公司的三本账。</p>
        </div>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="四层精选阅读路径，可横向滚动">
          <table className="concept-table">
            <caption>20 组阅读在页面下方完整列出；这里说明如何使用</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">阅读任务</th><th scope="col">完成标准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Core</th><td>无摩擦 payout、EPS/treasury、Fed gross/net</td><td>能手算三本账并指出每个净额的对象与单位</td></tr>
              <tr><th scope="row">Models</th><td>信号、融资顺序、代理、rights、ASR、convertible</td><td>为每个模型写出状态、约束、预测和反例</td></tr>
              <tr><th scope="row">Evidence</th><td>公告、actual flow、阈值、长期收益与真实 filing</td><td>区分 estimand、selection、publicAt 与外推边界</td></tr>
              <tr><th scope="row">Rules</th><td>US／EU／China、10b-18、10b5-1、税与发行</td><td>冻结 jurisdiction、version、effective/applicability 与 proposal</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          20 组精选阅读有意把法条、经典模型、实证设计和直接案例配对，而不是把 98 条来源逐篇平均阅读。先用 payout 基准、EPS 与 Fed 数据建立对象，再进入安全港、actual-flow 识别和跨法域规则；遇到个案时回到完整 reference ledger，而不是用综述替代原始文件。<Cite n={1} /><Cite n={6} /><Cite n={23} /><Cite n={27} /><Cite n={44} /><Cite n={69} /><Cite n={70} /><Cite n={81} />
        </p>
        <p>
          最小复述应是：<b>外部经营状态、估值、投资机会、税与融资条件先进入董事会和管理层的资本配置选择；选择必须经过法定容量、具体机制、订单或认购、成交与结算，才分别改变公司现金、issued／treasury／outstanding／float 以及市场真实供求。价格与流动性变化随后反向改变融资成本、投资、评级、所有权和下一轮行动。授权、公告、成交、现金、股数、EPS 与价值属于不同层，任何 net 指标都必须保留 gross legs，任何规则都必须带法域和版本，任何价格结论都必须声明 estimand 与能使链条失败的反事实。</b>
        </p>
      </section>
    </>
  );
}

export const lesson220: LessonRecord = {
  slug: '2-20',
  id: '2.20',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Corporate Buyback / Issuance Flow：从董事会授权到真实成交、股本供给与资产负债表反馈',
  subtitle: '把 authorization、primary／secondary、回购与发行机制、现金融资、股数状态、市场订单流、EPS、价值、披露时钟和因果识别严格分层',
  readingTime: '核心首读约 85–90 分钟；完整正文含逐式复算约 180–220 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习核对 20–30／完整书写 35–45，理解检查与术语 20–28，建议分三次完成；参考文献与延伸阅读不计',
  prerequisite: 'T06；建议回看 T01–T03、T07–T08、1.09、1.20、2.15–2.19；会计与研究部分按需调用 T05',
  updatedAt: '2026-08-31',
  revision: '2.20-r5',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.20-r5',
      summary:
        '独立复核 60 个机制单元、98 条来源与 292 个正文引文落点，并逐项核验授权—订单—成交—结算状态机、现金／股份／市场三本账、EPS 与价值公式的符号、单位和定义域、美国／欧盟／中国规则版本、真实案例阶段、Fed 25 季度数据、双时间轴、识别边界及 10+10 道题的唯一答案与来源映射；冻结哈希与类型、规范、构建、HTTP、结构、引用及算术不变量均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.20-r5',
      summary:
        '独立复核零背景入口、六阶段组织、85–90 分钟核心路线、公司约束—机制—成交—三本账—市场反馈因果链、公式逐项解释、反例、Evidence Passport、identification ladder、10 道互动题与 10 道静态孪生、14 道检查、18 个术语、20 组阅读和跨章节接口，并检查缩写展开、键盘／ARIA／焦点、本地保存与损坏恢复、无脚本、响应式和打印体验；冻结哈希和全部运行验证一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-19', label: '2.19 Crowded Positioning' },
  next: { slug: '2-21', label: '2.21 Heterogeneous Agents → Endogenous Dynamics' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、先修与路线' },
    { id: 'endogenous-corporate-flow', label: 'Endogenous Corporate Flow' },
    { id: 'transaction-state-machine', label: 'Transaction State Machine' },
    { id: 'authorization-announcement-actual', label: 'Authorization / Actual' },
    { id: 'capital-allocation-counterfactual', label: 'Capital Allocation' },
    { id: 'primary-secondary', label: 'Primary / Secondary' },
    { id: 'gross-net-flow', label: 'Gross / Net Flow' },
    { id: 'share-states', label: 'Share States' },
    { id: 'weighted-average-shares', label: 'Weighted-average Shares' },
    { id: 'diluted-shares', label: 'Diluted Shares' },
    { id: 'cash-buffer', label: 'Cash Buffer' },
    { id: 'debt-covenant-rating', label: 'Debt / Covenant / Rating' },
    { id: 'investment-opportunity', label: 'Investment Opportunity' },
    { id: 'dividend-repurchase', label: 'Dividend / Repurchase' },
    { id: 'tax-excise', label: 'Tax / Excise' },
    { id: 'information-signaling', label: 'Information / Signaling' },
    { id: 'market-timing-hierarchy', label: 'Market Timing' },
    { id: 'agency-governance', label: 'Agency / Governance' },
    { id: 'eps-compensation-incentive', label: 'EPS / Compensation' },
    { id: 'sbc-offset', label: 'SBC / Offsetting Buyback' },
    { id: 'board-authorization', label: 'Board Authorization' },
    { id: 'open-market-10b18', label: 'Open Market / 10b-18' },
    { id: 'rule-10b5-1', label: '10b5-1 / MNPI' },
    { id: 'broker-execution', label: 'Broker Execution' },
    { id: 'fixed-price-tender', label: 'Fixed-price Tender' },
    { id: 'dutch-auction', label: 'Dutch Auction' },
    { id: 'asr', label: 'ASR' },
    { id: 'primary-follow-on', label: 'Primary Follow-on' },
    { id: 'secondary-mixed-follow-on', label: 'Secondary / Mixed' },
    { id: 'rights-offering', label: 'Rights Offering' },
    { id: 'atm-offering', label: 'ATM Offering' },
    { id: 'private-placement-pipe', label: 'Private Placement / PIPE' },
    { id: 'convertibles', label: 'Convertibles' },
    { id: 'employee-equity-events', label: 'Employee Equity Events' },
    { id: 'stock-ma', label: 'Stock-financed M&A' },
    { id: 'trade-settlement-closing', label: 'Trade / Settlement / Closing' },
    { id: 'treasury-retirement-accounting', label: 'Treasury / Retirement' },
    { id: 'issuance-accounting', label: 'Issuance Accounting' },
    { id: 'corporate-order-flow', label: 'Corporate Order Flow' },
    { id: 'balance-sheet-feedback', label: 'Balance-sheet Feedback' },
    { id: 'float-ownership-borrow', label: 'Float / Ownership / Borrow' },
    { id: 'index-passive-reweight', label: 'Index / Passive Reweight' },
    { id: 'mechanical-eps-bridge', label: 'Mechanical EPS Bridge' },
    { id: 'valuation-wealth-transfer', label: 'Valuation / Wealth Transfer' },
    { id: 'liquidity-cost-capital', label: 'Liquidity / Cost of Capital' },
    { id: 'knowable-clocks', label: 'Knowable-when Clocks' },
    { id: 'filing-map', label: 'Filing Map' },
    { id: 'reconstruct-ledger', label: 'Reconstructing Ledger' },
    { id: 'flow-intensity', label: 'Flow Intensity' },
    { id: 'announcement-event-study', label: 'Announcement Study' },
    { id: 'actual-repurchase-identification', label: 'Actual Repurchase' },
    { id: 'issuance-identification', label: 'Issuance Identification' },
    { id: 'rule-tax-experiment', label: 'Rule / Tax Experiment' },
    { id: 'stress-switch-cases', label: 'Stress Switch Cases' },
    { id: 'chain-break-counterexamples', label: 'Chain-break Cases' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'active-practice', label: 'Static Practice' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson220Content,
  references: lesson220References,
  readingList: lesson220ReadingList,
};
