import GlobalMacroLab from '../components/GlobalMacroLab';
import { globalMacroScenarios } from '../components/globalMacroScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson213Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Global macro 不是“读懂新闻后押注涨跌”，而是把经理对未来状态的条件分布与市场已经计价的基准相比较，再把差异压缩成具有因子、方向、期限、工具、规模、成本与失效条件的跨资产仓位。</h2>
        <p>
          一条“通胀仍高”的判断没有交易含义：它可能低于公布前共识，可能已完全进入利率曲线，也可能同时提高企业名义收入与折现率。基金必须先冻结当时可得的信息和市场基准，说明自己究竟在哪个状态、哪个期限上持有不同概率，再选择最能表达该分歧的利率、外汇、股指或商品工具。最终损益还要经过 carry、roll、basis、FX、融资、执行与退出，宏观看对只完成了链条的一部分。<Cite n={8} /><Cite n={9} /><Cite n={10} />
        </p>
        <p>
          本节的最小对象因此不是一条新闻，也不是一个著名交易，而是一份可复现的 <b>view ledger</b>：截至何时知道什么，市场如何定价，经理分歧是什么，什么证据会使它失效，仓位怎样归一化，target 与 actual 的差额怎样进入订单，事后又应把 forecast、mapping、sizing 和 execution error 分开。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与术语桥</p>
        <h2>硬先修是 T01–T03 与 T07–T08；2.11 提供 target–actual–order–fill 语法，2.12 提供 covariance 与 risk-budget 接口。本节只建立“宏观分歧怎样变成仓位”的最小翻译层，不提前证明完整宏观模型。</h2>
        <div className="learning-objectives">
          <span>导论＋六阶段学习路线 · 从条件分歧到可证伪仓位</span>
          <ol>
            <li><b>导论与主体边界（00–07）：</b>定义 global macro、策略形态和四道不能跳过的翻译缝隙。</li>
            <li><b>把直觉写成假设（08–15）：</b>冻结信息时钟、共识、surprise、催化剂和失效条件。</li>
            <li><b>映射风险因子（16–32）：</b>用最小宏观桥进入 rates、FX、equity、commodity 与 cross-asset factor。</li>
            <li><b>选择交易表达（33–36）：</b>比较方向、相对价值、曲线、币对、工具、期限与 nuisance hedge。</li>
            <li><b>进入组合和订单（37–44）：</b>构造情景损益、归一化暴露、风险接口和 target−actual。</li>
            <li><b>归因、更新与证伪（45–51）：</b>拆分 P&amp;L 与四类错误，更新 belief，审计 crowding／funding，并用反例与研究协议证伪。</li>
            <li><b>实验与闭环（52–55）：</b>完成 10+10 道题、12 道检查并接回后续课程。</li>
          </ol>
          <p><b>单位桥：</b>1 bp（basis point）=0.01 个百分点=0.0001；“利率从 3% 升至 4%”是上升 1 个百分点或 100 bp，不是上升 1%。DV01 是收益率移动 1 bp 的一阶货币敏感度；notional 是合约名义量；margin 是履约抵押，不是最大损失。</p>
          <p><b>状态桥：</b>t− 是决策前截止；state 是不可完全观察的经济状态；observation 是带滞后与修订的数据；price-implied quantity 是特定模型从价格提取的量；target、post-shock actual、order 与 fill 是四个账户状态。</p>
          <p><b>排除项：</b>2.10 已讲价格趋势输入，2.12 已讲给定协方差与预算时怎样配置；2.14 才系统讲 options／volatility，2.16 才讲 VaR／ES、授权与 breach。Chapter 3 解释增长、通胀、央行和信用怎样形成，Chapter 4 解释跨国传导，Chapter 7 才聚合拥挤、反身性和系统反馈。</p>
          <p><b>首读分层：</b>主线先掌握每节的因果结论与边界；21、23、25–26、28–29 的工具推导可按实际交易品种回读，18 与 47 的进阶分解也可留到第二遍。</p>
        </div>
      </section>

      <section className="lesson-section" id="state-chain">
        <p className="section-kicker">02 · 完整状态闭环</p>
        <h2>从宏观研究到价格反馈至少经过十一步；任何一处被一句“所以做多”抹掉，都会把推断、模型对象或目标仓位误写成真实交易。</h2>
        <div className="mechanism-chain" aria-label="Global macro 从信息到更新的十一步状态链">
          <div><span>01</span><b>冻结信息集</b><p>记录数据 vintage、政策文本、价格和决策时间。</p></div>
          <div><span>02</span><b>识别市场基准</b><p>声明 survey、curve、forward 或 option-implied 的口径。</p></div>
          <div><span>03</span><b>形成条件分歧</b><p>比较完整概率分布，不只比较一句方向观点。</p></div>
          <div><span>04</span><b>写 catalyst</b><p>说明什么事件在什么期限可能让价格重新评估。</p></div>
          <div><span>05</span><b>写 invalidation</b><p>事前声明什么观察会推翻机制而非只触发止损。</p></div>
          <div><span>06</span><b>映射风险因子</b><p>把增长、通胀与政策路径转成 duration、FX 等暴露。</p></div>
          <div><span>07</span><b>选择工具期限</b><p>比较 cash、future、forward、swap 的 carry 与 basis。</p></div>
          <div><span>08</span><b>构造情景损益</b><p>在互斥状态下核算净 payoff、成本和尾部。</p></div>
          <div><span>09</span><b>生成 target</b><p>在 covariance、margin、liquidity 与 limit 下定规模。</p></div>
          <div><span>10</span><b>进入订单执行</b><p>Target−actual 才是候选订单；fill 才改变仓位。</p></div>
          <div><span>11</span><b>归因并更新</b><p>分开预测、映射、规模和执行错误后再更新信念。</p></div>
        </div>
        <p>
          这条链允许 discretionary、systematic 与 hybrid 使用不同模型，却要求它们留下同一种审计痕迹。Dynamic trading 的历史收益往往不能被静态 buy-and-hold exposure 完整描述，因此基金标签或回报回归也不能反推出某日真实策略。<Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="definition">
        <p className="section-kicker">阶段一 · 主体边界　|　03 · Global Macro 的最小定义</p>
        <h2>Global macro 是以总体经济、政策与跨国相对状态组织多空仓位的一族策略，不是一种资产、单一模型、共同持仓清单或保证“全球分散”的产品类型。</h2>
        <p>
          IMF 的早期分类把 macro fund 描述为依据总体宏观与金融条件在国家股票、债券和货币市场采取方向仓位，同时明确行业内部异质；学术证据也显示 hedge fund style 是动态暴露而非固定资产权重。这个最小定义足以解释其角色，但不能由“macro”标签推断具体杠杆、持有期、是否使用 options 或是否做相对价值。<Cite n={1} /><Cite n={2} /><Cite n={3} />
        </p>
        <p>
          本节把 agent 定义为一套决策系统：它接收带时间戳的信息，用显式或隐式模型更新分布，选择跨资产表达并受账户约束。基金可能集中持有一个高确信度观点，也可能同时运行多个低相关主题；“go anywhere”描述工具许可，不等于风险无边界。
        </p>
      </section>

      <section className="lesson-section" id="discretionary-systematic">
        <p className="section-kicker">04 · Discretionary、Systematic 与 Hybrid</p>
        <h2>三者的差异在于信息怎样被压缩为规则与谁有最终裁量，不在“人类有故事、机器有事实”；只要无法重建输入、阈值和 override，任何一种都不可审计。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="discretionary systematic hybrid 对照表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>形态</th><th>常见输入</th><th>决策压缩</th><th>主要盲点</th></tr></thead>
            <tbody>
              <tr><td>Discretionary</td><td>数据、政策沟通、制度与访谈</td><td>经理综合判断并批准仓位</td><td>叙事漂移、事后改写、规模不一致</td></tr>
              <tr><td>Systematic macro</td><td>可版本化的宏观、估值与价格变量</td><td>预设模型输出信号和规模</td><td>结构断点、数据修订、目标泄漏</td></tr>
              <tr><td>Hybrid</td><td>模型＋政策／制度信息</td><td>模型基线加有记录的 override</td><td>override 无规则、责任边界模糊</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          若一个 systematic 模块只读取自身滞后价格并做跨资产趋势，它的核心机制仍属于 2.10；宏观标签不会改变输入来源。反过来，discretionary thesis 也可以用情景、阈值和 invalidation 严格记录，不能用“艺术”豁免证伪。跨市场趋势证据支持可版本化规则能形成一种系统化宏观输入，却不把所有 systematic macro 缩减为 trend following。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="directional-relative-value">
        <p className="section-kicker">05 · Directional 与 Relative-value</p>
        <h2>Directional trade 保留某个市场共同方向；relative-value 用第二条腿削弱已定义的共同暴露，以便突出曲线、国家或期限分歧，但它从未自动变成无风险。</h2>
        <p>
          “政策路径高于定价”可表达为做空本国短端利率，也可表达为本国对另一国的 rate spread；后者降低共同全球 duration，却增加跨国 basis、币种、信用、抵押和政策相关性假设。DV01-neutral curve trade 对小幅平行移动近似中性，仍暴露于 slope、curvature、carry、roll 与流动性。
        </p>
        <p>
          所谓 neutral 必须带对象：beta-neutral、DV01-neutral、dollar-neutral 或 FX-hedged。若没有写被中和的 factor、估计方法与容差，“相对价值”只是策略名，不是风险证明。
        </p>
      </section>

      <section className="lesson-section" id="four-ledgers">
        <p className="section-kicker">06 · State、Observation、Price 与 Trade</p>
        <h2>真实经济状态、统计观测、边际价格和账户交易位于四个不同账本；把它们合成一句“市场在交易通胀”，会同时丢失测量误差、预期差与订单证据。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="宏观状态四层账本，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>层</th><th>对象</th><th>能观察什么</th><th>不能直接推出</th></tr></thead>
            <tbody>
              <tr><td>State</td><td>增长、通胀压力、政策约束</td><td>只能通过多源信号推断</td><td>唯一实时真值</td></tr>
              <tr><td>Observation</td><td>GDP、CPI、就业、调查</td><td>特定口径、发布时间与 vintage</td><td>当前完整状态</td></tr>
              <tr><td>Price</td><td>curve、FX forward、equity、commodity</td><td>边际交易与风险补偿后的价格</td><td>全体参与者纯平均信念</td></tr>
              <tr><td>Trade</td><td>target、order、fill、position</td><td>账户级状态与执行记录</td><td>仅由公开价格识别的真实流量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          公开价格把信息、风险厌恶、融资约束和供需压缩为一个数；即使价格具有信息，也不能在无模型条件下拆出唯一 belief。信息有效性与获取信息的成本之间本就存在均衡张力。<Cite n={35} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="four-gaps">
        <p className="section-kicker">07 · “知道新闻”到“赚到钱”的四道缝隙</p>
        <h2>经济状态不等于最新数据，数据不等于 relative surprise，surprise 不等于单一价格方向，价格方向也不等于具体工具扣除全部成本后的净收益。</h2>
        <ol className="diagnostic-list">
          <li><b>State → observation：</b>数据带抽样误差、滞后、季调和修订，单次公布可能误测潜在状态。</li>
          <li><b>Observation → surprise：</b>市场反应相对于公布前信息集；“高但低于预期”仍是负 surprise。</li>
          <li><b>Surprise → price：</b>同一消息可同时改变现金流、政策路径、风险溢价和央行信息，净方向依状态而定。</li>
          <li><b>Price → trade P&amp;L：</b>工具还包含 maturity、carry、roll、basis、FX、funding、optionality 和 execution。</li>
        </ol>
        <p>
          宏观公告研究发现 surprise 会造成快速价格跳跃，却也发现影响依公告类型、时点、符号和经济周期而变；这支持“预期差重要”，不支持“固定方向查表”。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="decision-clock">
        <p className="section-kicker">阶段二 · 可失效假设　|　08 · Decision Clock 与 Data Vintage</p>
        <h2>每个 thesis 都必须封存 t− 时刻真正可得的数据版本、政策文本和价格；把后来修订值送回历史，会创造现实中不可能拥有的知识。</h2>
        <p>
          一个季度 GDP 初值可能数月后大幅修订，政策制定者和交易者却只能根据当时 vintage 决策。Real-time policy research 与专门的 real-time macro database 工作都表明，使用事后修订数据会改变历史可得信息集及由此产生的判断；对投资研究同理。<Cite n={5} /><Cite n={46} />
        </p>
        <p>
          最小审计字段包括 source、release timestamp、reference period、vintage、timezone、decision cutoff 与 order eligibility。对于预先公布时点的事件，应另存事件前最后可交易快照；日线 close 不能假装是公告前价格。
        </p>
      </section>

      <section className="lesson-section" id="mixed-frequency">
        <p className="section-kicker">09 · Publication Lag、Revision 与 Mixed Frequency</p>
        <h2>季度产出、月度就业、周度申请和实时市场价格处于不同采样时钟；“最新”只表示最后发布，不表示都在测量同一个当前时点。</h2>
        <p>
          用三个月前的产出、上月的 CPI 与此刻的 FX 拼成 state vector 时，模型需要 nowcast 或明确缺口，而不是把列名对齐就称 contemporaneous。跨时区还要声明哪些市场已经消化消息、哪些仍未开盘。
        </p>
        <p>
          数据修订也不是普通噪声：修订规则可能与周期状态相关。训练系统化宏观模型时，必须用 vintage database 或保存快照；回测中使用 final release 会产生 look-ahead bias。
        </p>
      </section>

      <section className="lesson-section" id="prior-consensus-distribution">
        <p className="section-kicker">10 · Prior、Consensus 与完整分布</p>
        <h2>点预测只压缩了一个中心位置；交易规模还取决于分歧、尾部、状态相关性和损益非对称，因此“经理均值高于共识”远不是完整 thesis。</h2>
        <div className="equation-card">
          <span>经理的离散情景分布</span>
          <div>E<sup>G</sup>[x]=Σ<sub>s=1</sub><sup>S</sup> p<sub>s</sub>x<sub>s</sub>；　p<sub>s</sub>≥0，Σp<sub>s</sub>=1</div>
          <p>s 是互斥且尽可能穷尽的状态，p_s 是经理在 t− 的主观概率，x_s 是该状态下变量值。相同均值可以来自窄分布或双峰分布，二者需要完全不同的风险与 option expression；p 不是客观真值，也不能用事后状态重估。</p>
        </div>
        <p>
          共识中位数忽略受访者分布内部差异，市场价格又包含非信念成分。严格做法是并列保存 survey distribution、price-implied baseline 和 manager distribution，而非强迫三者合成一个“市场认为”。
        </p>
      </section>

      <section className="lesson-section" id="survey-vs-price">
        <p className="section-kicker">11 · Survey Expectation 与 Market-implied Pricing</p>
        <h2>调查回答“受访者愿意报告什么”，价格隐含量回答“在某个定价模型和合约规则下当前边际价格对应什么”；两者都不是无需调整的纯信念。</h2>
        <p>
          纽约联储的市场预期调查本身把调查、价格和其他市场情报作为互补输入；利率期货研究进一步显示，risk premium 会使未调整期货利率成为有偏的政策路径预测。<Cite n={6} /><Cite n={7} />
        </p>
        <p>
          读取任何 implied path 时先问：结算是单日还是期间平均，使用 simple 还是 compounded rate，是否含期限／风险溢价、凸性、cross-currency basis 或技术供需。没有这些条件，只能称“price-implied quantity”，不能宣称已恢复 representative agent belief。
        </p>
      </section>

      <section className="lesson-section" id="level-change-surprise">
        <p className="section-kicker">12 · Level、Change 与 Standardized Surprise</p>
        <h2>指标处在高位、相对上期继续上升、以及高于公布前预期，是三个不同问题；只有第三个对象直接对应 event-time 的新信息。</h2>
        <div className="equation-card">
          <span>标准化宏观 surprise</span>
          <div>e<sub>t</sub>=A<sub>t</sub>−E<sub>t−</sub>[A<sub>t</sub>]；　z<sub>t</sub>=e<sub>t</sub>/σ̂<sub>e</sub></div>
          <p>A_t 是公布值，E_t− 是公布前冻结的同口径预期，σ̂_e 是使用历史事前预测误差估计的尺度。z 让不同单位的公告可比较，却不决定价格必然方向；若 survey 与 actual 的季调、reference period 或发布时间不匹配，z 没有意义。</p>
        </div>
        <p>
          跨资产实时研究正是用 actual−expectation 并按历史误差标准化，再观察股票、债券与外汇响应；其结果是条件关系，而非不随 regime 改变的结构常数。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="horizon-catalyst">
        <p className="section-kicker">13 · Horizon 与 Catalyst</p>
        <h2>观点必须同时声明经济发生期限、市场重新定价期限和工具到期期限；三者错位时，即使终局判断正确，仓位也可能在到达终局前失效或被迫退出。</h2>
        <p>
          Catalyst 可以是数据公布、央行会议、预算表决、供给扰动或渐进的盈利修订。没有 catalyst 的“最终会回归价值”必须付出 carry 与资金占用；只有日期没有机制的事件押注，则无法解释结果为何应改变相对定价。
        </p>
        <p>
          到期也是状态：期货需要 roll，option 会衰减，债券曲线会 roll-down，FX forward 会重置。Thesis horizon 应写成区间并配 refresh rule，不能无限延长以逃避证伪。
        </p>
      </section>

      <section className="lesson-section" id="conditional-thesis">
        <p className="section-kicker">14 · Conditional Thesis 与 Counterfactual</p>
        <h2>可交易 thesis 不是“我认为通胀顽固”，而是“若哪些观测出现且哪些替代机制不出现，相对于什么基准，哪条路径的概率将在什么期限上升”。</h2>
        <div className="equation-card">
          <span>最小条件分歧</span>
          <div>Edge<sub>h</sub>=E<sup>G</sup><sub>t</sub>[x<sub>t+h</sub>|I<sub>t</sub>]−E<sup>M</sup><sub>t</sub>[x<sub>t+h</sub>|price<sub>t</sub>, model]</div>
          <p>E^G 是经理基于信息集 I_t 的条件均值，E^M 是从指定市场价格和提取模型得到的基准。只有两者使用相同 probability measure、horizon、settlement 与单位时，差值才可解释为 belief edge；否则它只是依赖模型的 pricing gap。即使可比，Edge 也不是可直接兑现的 alpha，因为 market baseline 可能含风险溢价，且相同均值差可对应不同 payoff distribution。</p>
        </div>
        <p>
          Counterfactual 要问：“若我的机制不存在，什么其他机制仍能产生同样数据与价格？”例如长端收益率上升可能来自政策路径、期限溢价、供给或流动性；只看到价格结果无法选择其中一个。
        </p>
      </section>

      <section className="lesson-section" id="invalidation-competing">
        <p className="section-kicker">15 · Invalidation 与 Competing Explanations</p>
        <h2>失效条件应针对机制而非损益：账户盈利时 thesis 也可能被新证据推翻，账户亏损时 thesis 也可能仍成立但风险边界要求退出。</h2>
        <p>
          每项 thesis 至少写三类 invalidator：state evidence 反向，传导环节没有出现，以及市场基准已追上、剩余 edge 不再覆盖成本。还要列 competing explanations，并声明怎样用额外观测区分。
        </p>
        <p>
          Price stop 管理生存，time stop 管理资本占用，thesis invalidation 管理认识论；把三者合并会造成两种偏差：亏损时不断改故事，盈利时忽略机制已消失。
        </p>
      </section>

      <section className="lesson-section" id="macro-minimum-bridge">
        <p className="section-kicker">阶段三 · 风险因子映射　|　16 · Growth、Inflation 与 Policy 最小桥</p>
        <h2>本节只把增长、通胀与政策当作待检验状态变量，不提供“象限—资产方向”速查表；完整生成机制和反应函数留给 Chapter 3。</h2>
        <p>
          增长改善可提高企业 cash flow，也可抬升实际利率和风险承担；通胀上行可来自需求或供给，二者对增长和政策的含义不同；政策收紧还可能同时传递央行掌握的正面经济信息。因而任何资产符号都必须通过具体通道而非象限标签得到。
        </p>
        <p>
          最小因果语言是：state shock → 对现金流／政策路径／风险溢价的条件修正 → 因子价格变化 → 具体工具 P&amp;L。Chapter 3 将分别展开 state shock 怎样形成，本节只要求翻译过程可见。
        </p>
      </section>

      <section className="lesson-section" id="reaction-path">
        <p className="section-kicker">17 · Reaction Function 与 Expected Policy Path</p>
        <h2>市场常在本次政策决定前已完成定价；真正的新信息可能是未来路径、速度、终点、资产负债表或央行对经济状态的信号，而非 headline 加息／降息本身。</h2>
        <p>
          Kuttner 用期货把 anticipated 与 unanticipated policy action 分开，发现债券对预期内变化的响应很小；Gürkaynak、Sack 与 Swanson 又把 target surprise 与 future-path factor 分开，说明声明中的路径信息可以支配更长期资产。<Cite n={8} /><Cite n={11} />
        </p>
        <p>
          但窄窗“政策 surprise”也可能混入央行信息效应与 risk-premium shock。后续研究发现紧缩型利率变化有时伴随更高增长预期，并质疑简单把所有窄窗变动解释成外生政策冲击；近期 SOFR 期货研究又说明不同合约期限可承载不同政策路径 surprise。交易者必须把“价格反应”与“结构因果”分开。<Cite n={12} /><Cite n={13} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="nominal-real-breakeven">
        <p className="section-kicker">18 · Nominal Yield、Real Yield 与 Breakeven（进阶）</p>
        <h2>名义国债与通胀保值债券收益率之差可称 inflation compensation，却不能无条件改名为纯预期通胀，因为流动性和风险溢价也进入价格。</h2>
        <div className="equation-card">
          <span>Breakeven 的会计入口与经济分解</span>
          <div>BE<sub>n</sub>=y<sup>nom</sup><sub>n</sub>−y<sup>TIPS</sup><sub>n</sub>≈E[π̄<sub>n</sub>]+IRP<sub>n</sub>+(LP<sup>nom</sup><sub>n</sub>−LP<sup>TIPS</sup><sub>n</sub>)</div>
          <p>n 是期限，π̄_n 是未来平均通胀，IRP 是 inflation-risk premium，最后一项是名义券与 TIPS 的相对流动性楔子，符号可以为正或负。左边是同期限收益率差，右边是依赖期限结构模型的解释性分解；税务、指数滞后、供需与可比券选择还会改变映射。<Cite n={50} /></p>
        </div>
        <p>
          因此 “long breakeven” 是名义与实际 duration 的相对表达，需要 DV01 配平和 basis 审计；它不等同于无摩擦下注 CPI。完整通胀预期机制留给 3.04。
        </p>
      </section>

      <section className="lesson-section" id="bond-price-yield">
        <p className="section-kicker">19 · Bond Price 与 Yield</p>
        <h2>普通固定现金流债券的价格是未来现金流的折现和；其他条件相同时收益率上升会降低现值，但“其他条件相同”排除了信用、流动性、可赎回性和曲线形状变化。</h2>
        <div className="equation-card">
          <span>固定现金流债券的教学定价</span>
          <div>P(y)=Σ<sub>j=1</sub><sup>m</sup> CF<sub>j</sub>/(1+y/k)<sup>kt<sub>j</sub></sup></div>
          <p>CF_j 是第 j 笔确定现金流，t_j 是距支付的年数，k 是年内复利次数，y 是与该 convention 一致的到期收益率。y 上升使每个分母变大，因而普通正现金流债券价格下降；单一 YTM 只是把整条折现曲线压成一个内部报酬率，不是所有利率风险的完整状态。</p>
        </div>
        <p>
          Global macro 不应把“做空债券”写成一个抽象方向。它要指定哪个国家、曲线点、现金／期货／swap、币种和 settlement convention；信用债价格还会同时响应 spread，带嵌入期权工具的现金流会随利率改变。<Cite n={15} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="duration-dv01">
        <p className="section-kicker">20 · Duration 与 DV01</p>
        <h2>Modified duration 把收益率小幅变化翻译成价格百分比斜率，DV01 再把 1 bp 翻译成货币损益；它们是局部敏感度，不是到期日、notional 或最大亏损。</h2>
        <div className="equation-card">
          <span>一阶利率敏感度</span>
          <div>D<sub>mod</sub>=−(1/P)·∂P/∂y；　DV01=P·D<sub>mod</sub>·10<sup>−4</sup>；　ΔP≈−DV01·Δy<sub>bp</sub></div>
          <p>P 必须是同一面值口径下的货币全价或持仓价值；若输入每 100 面值报价，所得 DV01 也只对应每 100 面值。本节把 DV01 报为正的损失幅度：长仓收益率上升 1 bp，价格约减少一个 DV01。Δy_bp 必须以 bp 输入；若用 decimal Δy，则使用 −P·D_mod·Δy。Desk 也可能保存带符号 PV01，使用前必须核对 convention。</p>
        </div>
        <p>
          DV01 会随价格、收益率、时间、coupon 和工具改变。多条曲线或非平行移动应使用 key-rate／bucket sensitivities；仅用一条总 DV01 会隐藏哪个期限真正承担风险。<Cite n={15} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="convexity">
        <p className="section-kicker">21 · Convexity</p>
        <h2>Duration 是价格—收益率曲线在当前点的切线；当利率变动较大或现金流会改变时，曲率与重新定价后的敏感度决定线性近似误差。</h2>
        <div className="equation-card">
          <span>二阶价格近似</span>
          <div>ΔP/P≈−D<sub>mod</sub>Δy+½C(Δy)<sup>2</sup>；　C=(1/P)·∂<sup>2</sup>P/∂y<sup>2</sup></div>
          <p>Δy 使用 decimal，C 是与同一收益率 convention 对应的 convexity。普通无嵌入期权债券通常正凸：等幅降息带来的价格上涨大于加息损失；可赎回债或 mortgage exposure 可出现负 convexity，不能套用这个直觉。</p>
        </div>
        <p>
          Curve spread 即使一开始 DV01-neutral，两腿 convexity 不同也会在大幅波动后产生方向风险；期权表达的 gamma／vega 与 surface 风险留到 2.14，本节只保留“线性 sensitivity 会失真”的接口。<Cite n={15} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="curve-trades">
        <p className="section-kicker">22 · Curve Level、Slope 与 Curvature</p>
        <h2>“利率上升”只描述 level；steepener／flattener 交易的是期限之间的相对变化，必须按单位 DV01 配腿，等名义金额或等合约数通常不具有平行移动中性。</h2>
        <div className="equation-card">
          <span>多腿曲线的一阶 P&amp;L 与平行中性</span>
          <div>ΔV≈−Σ<sub>i</sub> N<sub>i</sub>·DV01<sub>i</sub>·Δy<sub>i,bp</sub>；　Σ<sub>i</sub>N<sub>i</sub>DV01<sub>i</sub>=0</div>
          <p>N_i 是带符号头寸数量：多债券为正、空债券为负；单位 DV01_i 报正值。第二式只使所有期限同升同降相同 bp 时的一阶 P&amp;L 抵消，仍保留 slope、curvature、carry、roll、basis、convexity 和 liquidity risk。</p>
        </div>
        <p>
          Long 2y／short 10y 的等 DV01 组合在 10y 收益率升得更多时盈利，通常称 bear steepener；若 2y 降得更多也可盈利，通常称 bull steepener。名称描述 curve move，不应替代每条腿的价格与 P&amp;L 符号。
        </p>
      </section>

      <section className="lesson-section" id="rates-instruments">
        <p className="section-kicker">23 · Cash Bond、Futures 与 Swap</p>
        <h2>同一个政策路径分歧通过 cash、futures 或 swap 表达，会获得不同的融资、交割、basis、保证金与对手方风险；“同样是 short duration”不等于同一交易。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="利率工具比较，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>工具</th><th>主要敏感度</th><th>现金／融资</th><th>特有残差</th></tr></thead>
            <tbody>
              <tr><td>Cash bond</td><td>券与曲线的 DV01、spread</td><td>全价、repo、coupon</td><td>specific issue、repo specialness、liquidity</td></tr>
              <tr><td>Bond future</td><td>CTD／conversion factor 映射的 DV01</td><td>initial＋variation margin</td><td>CTD switch、delivery option、cash-futures basis</td></tr>
              <tr><td>Interest-rate swap</td><td>fixed／floating cash-flow PV01</td><td>collateralized derivative</td><td>swap spread、discounting、counterparty／CSA</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>Treasury futures 的局部 DV01 近似</span>
          <div>DV01<sub>future</sub>≈DV01<sub>CTD, contract</sub>/CF</div>
          <p>DV01_CTD,contract 已按一份期货合约对应的可交割面值计算，CF 是 conversion factor，因此不能再重复乘 contract multiplier；若手头只有每 100 面值的 CTD DV01，必须先转换到一份合约口径。该式假设局部 CTD 不切换，忽略交割选择权与 basis 变化。</p>
        </div>
        <p>
          CME 的交割教育材料支持 CTD、conversion factor 与 BPV mechanics，但产品规格和 CTD 会变化；教材公式不是当前合约查询页。<Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="fx-quote">
        <p className="section-kicker">24 · FX Quote 与相对价格</p>
        <h2>汇率没有脱离报价方向的“上涨”：若 S 表示一单位外币值多少本币，S 上升是外币升值；反转报价后数值变化和 P&amp;L 语言都要反转。</h2>
        <div className="equation-card">
          <span>海外资产的本币总回报</span>
          <div>1+R<sub>D</sub>=(1+R<sub>F</sub>)·S<sub>T</sub>/S<sub>0</sub></div>
          <p>S 是 domestic currency per one foreign currency，R_F 是外币计价资产回报，R_D 是本币回报。若外币资产涨 10%、外币又升值 5%，本币回报是 1.10×1.05−1=15.5%，不是简单 15%；现金流时点、hedge 与成本另计。</p>
        </div>
        <p>
          一个币对也是相对交易：long EUR/USD 同时表达 euro 与 dollar 的相对路径，还可能混入全球避险、美元融资和风险溢价。选择 funding／quote currency 已经选择了部分宏观因子。本文的 domestic-per-foreign 约定是计算约定；真实市场报价与参考汇率必须逐币对核对。<Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="cip-forward">
        <p className="section-kicker">25 · CIP、Forward Points 与 Cross-currency Basis</p>
        <h2>Covered interest parity 连接同期限、已对冲的两种货币融资回报；它是无摩擦基准，不是对未来 spot 的无偏预测，也不是现实资产负债表没有价格。</h2>
        <div className="equation-card">
          <span>简化 CIP 与外币远期多头 payoff</span>
          <div>F<sub>0,T</sub>/S<sub>0</sub>=(1+r<sub>D</sub>T)/(1+r<sub>F</sub>T)；　Π<sub>T</sub>=N<sub>F</sub>(S<sub>T</sub>−F<sub>0,T</sub>)</div>
          <p>S 与 F 都是 domestic per foreign，r_D／r_F 是相同期限、simple annual rates，N_F 是外币 notional。第一式忽略 basis、信用、抵押、税和成本；第二式是到期以本币结算的 long-foreign forward payoff，若需现值还要按结算规则折现。</p>
        </div>
        <p>
          全球金融危机后系统性的 cross-currency basis 说明 dealer balance sheet 与对冲需求可使简单 CIP 偏离；这不表示每个客户都能无成本套利，也不等于未对冲 carry 的收益已锁定。<Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="fx-carry">
        <p className="section-kicker">26 · FX Carry、Forward Premium 与 Crash Risk</p>
        <h2>Currency carry 在即期不逆向变化时从利差／远期折价获得收益；它不是 covered arbitrage，历史平均溢价与低概率大幅逆转必须同时进入情景。</h2>
        <div className="equation-card">
          <span>未对冲外币存款相对本币融资的简化收益</span>
          <div>Π/N<sub>D</sub>=(1+r<sub>F</sub>T)·S<sub>T</sub>/S<sub>0</sub>−(1+r<sub>D</sub>T)</div>
          <p>N_D 是初始借入并换汇的本币本金；在 simple-rate、无 basis、无成本且所有现金流同到期的假设下，上式为等式。若 S_T=S_0，收益近似为 (r_F−r_D)T；外币贬值、basis、funding 与成本可完全覆盖利差。使用 forward 实现时，利差已进入入场 F，不能在 (S_T−F) payoff 之外再加同一份 carry。</p>
        </div>
        <p>
          Fama 的 forward-premium 分解、全球 FX volatility 风险以及 carry crash／funding unwind 文献共同说明：positive carry 可是风险补偿或可预测成分，却不是收益保证，高息货币在压力状态中可能负偏。<Cite n={21} /><Cite n={22} /><Cite n={23} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="equity-channels">
        <p className="section-kicker">27 · Equity：Cash Flow、Discount Rate 与 Risk Premium</p>
        <h2>股票同时对盈利／股息、无风险折现率与 equity risk premium 定价；增长“更好”可以抬高现金流，也可以抬高利率或降低降息概率，净方向没有固定符号。</h2>
        <div className="equation-card">
          <span>股票价格的状态依赖现值语言</span>
          <div>P<sub>t</sub>=E<sub>t</sub>[Σ<sub>j≥1</sub> M<sub>t,t+j</sub>·CF<sub>t+j</sub>]</div>
          <p>CF 是未来股东现金流，M 是把时间价值与风险状态一起折现的 stochastic discount factor。宏观消息可以同时改变 CF 的分布和 M；本式是资产定价语言，不给出可直接回测的唯一 forecast，也不要求读者先掌握完整 SDF 理论。</p>
        </div>
        <p>
          因此同一就业 surprise 在衰退与扩张阶段可通过不同政策与 cash-flow 通道产生不同反应。现值分解研究也提醒，价格变化可以来自预期现金流与折现率的不同组合；用“risk-on／risk-off”描述结果可以简写，不能替代传导假设。<Cite n={10} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="equity-futures">
        <p className="section-kicker">28 · Equity-index Futures Fair Value 与 Basis</p>
        <h2>股指期货相对现货的理论差异首先反映融资成本与预期股息；期货高于现货不等于市场更看多，低于现货也不等于市场预测下跌。</h2>
        <div className="equation-card">
          <span>连续股息率下的教学 fair value</span>
          <div>F<sub>0,T</sub>=S<sub>0</sub>e<sup>(r−q)T</sup></div>
          <p>S_0 是可复制现货篮子价值，r 是同期限融资率，q 是预期连续股息率。实际还需离散股息、税、borrow、交易成本、时钟与可执行套利带；observed F−model F 是 basis gap，不自动是无风险利润。</p>
        </div>
        <p>
          经典研究与 CME fair-value 说明均把融资、股息和期限纳入 index-futures 定价；前者的历史制度与后者的简化示例都不能替代当前合约、股息预测和真实交易成本。<Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="commodity-futures">
        <p className="section-kicker">29 · Commodity Spot、Futures 与 Inventory</p>
        <h2>可储存商品的期限价格把融资、储存与持有实物的便利价值放在一起；现货、近月与远月会对同一供需冲击作出不同反应。</h2>
        <div className="equation-card">
          <span>可储存商品的简化 cost of carry</span>
          <div>F<sub>0,T</sub>=S<sub>0</sub>e<sup>(r+u−y)T</sup></div>
          <p>u 是 storage 等持有成本，y 是 convenience yield，即持有可用库存带来的隐含服务价值。库存紧张可抬高 y、推高 spot 相对 futures；电力等不可储存品、地点／质量约束和交割摩擦不能机械套用本式。</p>
        </div>
        <p>
          Storage theory 与商品期货实证把库存、basis、便利收益和风险溢价相连，却不支持把期货曲线直接当作未来现货无偏预测。<Cite n={27} /><Cite n={28} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="carry-roll-basis">
        <p className="section-kicker">30 · Carry、Roll、Basis 与 Repricing</p>
        <h2>总收益必须用互不重叠的账本分解；尤其不能把 backwardation 的远近月差在换月日写成凭空到账的现金券息，也不能在 forward payoff 外重复加利差。</h2>
        <div className="equation-card">
          <span>先冻结会计恒等式，再选择解释性归因</span>
          <div>Π=ΔMTM+CF<sub>contract</sub>−C<sub>fund</sub>−C<sub>exe</sub>；　ΔMTM=Π<sub>theme</sub>+Π<sub>curve/basis</sub>+Π<sub>FX</sub>+Π<sub>nonlinear</sub>+residual</div>
          <p>ΔMTM 是价格重估，CF_contract 是 coupon、dividend 等合约现金流；variation margin 只是已累计 MTM 的结算，不能再加一次。Carry 与 roll 是对 ΔMTM＋现金流的解释性切法，不是天然额外加项；只有冻结模型、路径和不重叠规则后才能列入子账。不同 desk 可用不同 convention，但 30 与 45 节必须沿用同一版。</p>
        </div>
        <p>
          关于“roll yield”的纠错文献强调，连续合约收益分解不等于换月交易瞬间收到远近月差；真实持有回报由合约价格路径、roll rule、collateral 与成本共同形成。<Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="currency-hedging">
        <p className="section-kicker">31 · Currency Translation 与 Hedging</p>
        <h2>海外资产观点与币种观点可以分开，也可以故意叠加；是否 hedge 会改变 forward carry、basis、现金需求和尾部，不能只在回报表末尾减一列 FX。</h2>
        <p>
          买外国股指期货可能只需 margin，却仍有该合约结算币种与 NAV 币种之间的 translation。若另用 FX forward hedge，新的合约又带利差、basis、roll 和 collateral；“fully hedged”必须声明 hedge ratio、rebalance frequency 和 cash flows。
        </p>
        <p>
          Currency overlay 还可能抵消经理原本想保留的宏观分歧。正确顺序是先定义 base-currency objective，再决定 FX 是 nuisance exposure 还是 thesis factor，而不是默认所有海外资产都该 hedge 或都不该 hedge。
        </p>
      </section>

      <section className="lesson-section" id="factor-map">
        <p className="section-kicker">32 · Cross-asset Factor Map</p>
        <h2>资产标签不是风险源：长债、成长股与某些高估值货币可以在同一实际利率上升情景中共同亏损；跨资产分散必须先检查共同 factor sensitivity。</h2>
        <div className="equation-card">
          <span>局部 factor P&amp;L 映射</span>
          <div>ΔV≈J′Δz+½Δz′HΔz</div>
          <p>z 可包含 policy path、real yield、inflation compensation、USD、equity risk premium、commodity convenience yield 与 liquidity；J 是一阶 dollar sensitivity，H 是二阶项。因子选择、标准化和交互是模型假设；若同一 FX 已进入 z，就不能在 attribution 再加一次。</p>
        </div>
        <p>
          这也是 2.12 的接口：Risk parity 可以让资产标签贡献更均衡，macro factor map 却可能揭示它们共享同一 duration 或 liquidity state。Macro manager 可改变方向、预算或 overlay，但应分开记录哪一层发生变化。
        </p>
      </section>

      <section className="lesson-section" id="view-ledger">
        <p className="section-kicker">阶段四 · 交易表达　|　33 · View Ledger</p>
        <h2>一项 thesis 只有在状态、基准、分歧、传导、期限、catalyst、invalidation、工具、敏感度、规模和归因口径全部登记后，才从叙事变成可管理对象。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="Global macro view ledger 模板，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>字段</th><th>必须回答</th><th>最常见的伪完整</th></tr></thead>
            <tbody>
              <tr><td>Information / baseline</td><td>截至何时知道什么，市场怎样计价</td><td>只写最新数据和主观 target</td></tr>
              <tr><td>Conditional mechanism</td><td>哪个状态经哪个节点影响何因子</td><td>把相关词排成箭头</td></tr>
              <tr><td>Horizon / catalyst / invalidation</td><td>何时应发生，什么会推翻</td><td>“中长期”“价格不利就止损”</td></tr>
              <tr><td>Instrument / sensitivity</td><td>quote、maturity、DV01/delta、carry、basis</td><td>只写 long／short asset</td></tr>
              <tr><td>Account / evidence</td><td>target、actual、order、fill 与 attribution</td><td>把 target 当成交</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Discretionary memo 和 systematic model snapshot 都应填同一总账；区别只在字段怎样产生。这样事后才能判断 thesis 是否改变，而不是用最新故事覆盖原记录。
        </p>
      </section>

      <section className="lesson-section" id="directional-expression">
        <p className="section-kicker">34 · Absolute Directional Expression</p>
        <h2>Outright 仓位通常最直接、流动性最好，却同时承担共同市场 beta；选择它意味着经理愿意让主题分歧与全局 duration、USD 或 equity risk 一起进入账户。</h2>
        <p>
          若经理认为某国未来 policy path 高于曲线，可做空该国短端；若认为美元风险溢价上升，可做多美元篮子；若认为增长上修超过折现率冲击，可做多股指。每种表达都需写清真正盈利节点，而不是事后用任何有利通道解释。
        </p>
        <p>
          Directional 不等于无限集中。其优势是 payoff 与流动性透明，代价是容易与 book 其他主题重叠；规模必须在 portfolio sensitivity、funding 和 invalidation loss 上统一审计。
        </p>
      </section>

      <section className="lesson-section" id="relative-value-expression">
        <p className="section-kicker">35 · Relative-value 与 Nuisance Neutrality</p>
        <h2>Relative-value 用多腿结构压低不想交易的 factor，使收益更依赖相对分歧；中性只是对模型中列出的 exposure 成立，遗漏的 basis、liquidity 与 jump risk 全部保留。</h2>
        <div className="equation-card">
          <span>声明因子的一阶中性</span>
          <div>B′w=0；　Π=w′R−C(w)</div>
          <p>w 是带符号工具 exposure，B 是每项工具对希望中和因子的 sensitivity matrix。B′w=0 只消除列入 B 的局部一阶变化；factor estimation error、nonlinearity、country spread、currency、funding、leg risk 和 cost 仍进入 Π。</p>
        </div>
        <p>
          Fixed-income arbitrage 的历史模型组合仍承担经济风险，limits-of-arbitrage 理论更说明错价扩大时资本约束可迫使退出；relative value 不应与 guaranteed convergence 同义。<Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="instrument-selection">
        <p className="section-kicker">36 · Instrument、Maturity 与 Implementation Choice</p>
        <h2>最优表达不是理论 beta 最大的工具，而是在 exposure purity、liquidity、carry、basis、convexity、funding、capacity、legal access 与 operational burden 之间最适合当前 thesis 的载体。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="宏观交易工具选择清单，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>维度</th><th>审计问题</th><th>失败方式</th></tr></thead>
            <tbody>
              <tr><td>Exposure purity</td><td>工具对目标因子和 nuisance factor 的 J 是什么</td><td>看对 state、选错价格节点</td></tr>
              <tr><td>Horizon / maturity</td><td>到期、roll 与 catalyst 是否匹配</td><td>终局正确、合约先到期</td></tr>
              <tr><td>Carry / basis / convexity</td><td>等待成本和非线性是否可承受</td><td>方向收益被持有成本吞没</td></tr>
              <tr><td>Liquidity / funding</td><td>压力状态能否补 margin 和退出</td><td>在 thesis 验证前被迫减仓</td></tr>
              <tr><td>Operations / law</td><td>交易、清算、税务和账户是否允许</td><td>理论工具不可实施</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Options 可以把双峰或尾部 belief 变成非对称 payoff，却新增 theta、gamma、vega、skew 与 path dependence；本节只保留 instrument-selection 接口，详细 volatility trade 归 2.14。
        </p>
      </section>

      <section className="lesson-section" id="scenario-payoff">
        <p className="section-kicker">阶段五 · 组合与订单　|　37 · Scenario Payoff Matrix</p>
        <h2>在讨论 notional 前，先把每个互斥宏观状态下各工具的完整净损益写成矩阵；这会暴露“主情景盈利、邻近情景却因 basis 或 currency 亏损”的表达缺陷。</h2>
        <div className="equation-card">
          <span>工具—情景损益</span>
          <div>Π<sub>s</sub>(w)=w′r<sub>s</sub>−C<sub>s</sub>(w)，　s=1,…,S</div>
          <p>r_s 是每单位工具在状态 s 的 total return 或 dollar P&amp;L vector，必须已冻结 carry、roll、basis、FX 与 convexity convention；C_s(w) 是可随状态和规模变化的 funding／execution cost。状态应互斥且尽量穷尽，不能遗漏最不利尾部后再称“expected P&amp;L”。</p>
        </div>
        <p>
          Running case 可以有“通胀持续、软着陆、衰退、供应冲击”四行，以及短端、curve spread、FX、equity 四列。先验证每一格的传导，再组合；不要让一条故事同时决定概率和 payoff 而无人检查。
        </p>
      </section>

      <section className="lesson-section" id="expected-value">
        <p className="section-kicker">38 · Expected P&amp;L、Asymmetry 与 Break-even Probability</p>
        <h2>最可能发生的状态可以亏损而交易仍有正期望，最可能状态盈利也可能被尾部损失反转；概率、损益非对称和成本必须一起决定。</h2>
        <div className="equation-card">
          <span>主观期望与两状态 break-even</span>
          <div>EV(w)=Σ<sub>s</sub>p<sub>s</sub>Π<sub>s</sub>(w)；　p*= (L+C)/(G+L)</div>
          <p>在两状态下，G&gt;0 与 L&gt;0 分别是单列成本 C 之前的成功收益和失败损失，EV=pG−(1−p)L−C；只有主观成功概率 p 超过 p* 才为正。概率是经理 belief，不是事实，成本通常随规模非线性，正 EV 也不保证能承受路径 drawdown。</p>
        </div>
        <p>
          应另报告最坏状态、expected shortfall 或 survival constraint，但正式 VaR／ES 与组织限额留给 2.16。本节的目的只是阻止“方向确信度高，所以 notional 大”这一跳步。
        </p>
      </section>

      <section className="lesson-section" id="exposure-normalization">
        <p className="section-kicker">39 · Sensitivity-normalized Exposure</p>
        <h2>利率合约数、FX notional、股指 notional、商品手数与 margin 不能直接相加比较；必须先转成共同因子 sensitivity 或相同情景下的 dollar loss。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="跨资产风险单位对照表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>资产／工具</th><th>至少保存</th><th>不能充当风险的量</th></tr></thead>
            <tbody>
              <tr><td>Rates</td><td>bucket DV01、convexity、currency</td><td>face value 或合约数</td></tr>
              <tr><td>FX</td><td>base／quote notional、delta、settlement</td><td>只写“long currency”</td></tr>
              <tr><td>Equity index</td><td>index delta／beta、currency、dividend basis</td><td>initial margin</td></tr>
              <tr><td>Commodity</td><td>contract multiplier、month、curve／inventory state</td><td>未注明月份的美元 notional</td></tr>
              <tr><td>Cross-asset book</td><td>J、scenario P&amp;L、covariance 与 liquidity</td><td>原始 notional 总和</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          统一为 J 后仍不是“真实风险”：非线性、jump、basis 和 model misspecification 会留在 residual。归一化只是让组合问题可比较，而不是把现实压成一个万能数字。
        </p>
      </section>

      <section className="lesson-section" id="portfolio-interface">
        <p className="section-kicker">40 · Portfolio Covariance 与 Risk-parity 接口</p>
        <h2>单笔 thesis 的正期望不代表可以叠进 book；经理还要检查与现有主题的 covariance、factor overlap 和尾部共振，再决定 overlay、预算或资产宇宙怎样改变。</h2>
        <div className="equation-card">
          <span>从主题暴露到组合局部风险</span>
          <div>σ<sub>book</sub>=√(w′Σw)；　Δσ≈(Σw)′Δw/σ<sub>book</sub></div>
          <p>w 是用可比较风险单位表达的现有 exposure，Σ 是截至决策前、同口径的 covariance。第二式是小幅增加 Δw 时组合波动变化的一阶近似；它不包含 jump、liquidity 或 scenario invalidation loss，也不自动给出最优规模。</p>
        </div>
        <p>
          2.12 在给定 universe、Σ 与 b 时求相对配置；2.13 解释 macro thesis 为什么可能改变 signed direction、b、universe 或独立 overlay。若只因 covariance 更新而变权，不应事后改称“macro view”。
        </p>
      </section>

      <section className="lesson-section" id="gross-net">
        <p className="section-kicker">41 · Gross、Net、Notional 与 Economic Risk</p>
        <h2>Gross 描述多空两边展开了多少，net 描述带符号方向；低 net 可以与高 gross、basis、margin 和 tail risk 同时存在，二者都不是统一经济风险。</h2>
        <div className="equation-card">
          <span>同口径 exposure 下的 gross 与 net</span>
          <div>Gross=Σ<sub>i</sub>|E<sub>i</sub>|/NAV；　Net=Σ<sub>i</sub>E<sub>i</sub>/NAV</div>
          <p>E_i 必须先转换为可比较的 signed economic exposure。若直接把 bond face、futures notional、FX notional 和 option notional 相加，结果没有统一单位；gross／net 也不包含 covariance、convexity、basis 或 liquidity。</p>
        </div>
        <p>
          Hedge-fund leverage 的实证研究使用多种口径，并发现 leverage 会随融资成本、市场价值和波动状态变化；其 2004–09 特定样本不是当前行业平均倍数。<Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="margin-funding">
        <p className="section-kicker">42 · Margin、Collateral 与 Funding Liquidity</p>
        <h2>Initial margin 是履约抵押，不是购买价格或最大损失；variation margin、collateral currency、haircut、融资期限和可续作性决定基金能否把观点持有到 catalyst。</h2>
        <div className="equation-card">
          <span>失效损失与约束共同决定规模</span>
          <div>n<sub>loss</sub>=⌊B<sub>loss</sub>/ℓ<sub>inv</sub>⌋；　n*=min(n<sub>loss</sub>,n<sub>margin</sub>,n<sub>liq</sub>,n<sub>mandate</sub>)</div>
          <p>ℓ_inv 是每单位在事前定义 invalidation state 下的净损失，B_loss 是该 thesis 的损失预算。最终数量取损失、margin、liquidity 和 mandate 上限的最小值；这是透明 sizing policy，不是普适最优解，跳空与执行可使真实损失超过 B_loss。</p>
        </div>
        <p>
          在单账户层，本节到 sizing 和 collateral sufficiency 为止：每日重估 available cash、eligible collateral、margin headroom、融资期限与可续作性。现行非银杠杆政策报告把杠杆识别、监测与跨境数据缺口视为治理问题，而非给出一个适用于所有基金的杠杆常数；跨主体的 market-liquidity feedback 留到 49。<Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="target-actual-order-fill">
        <p className="section-kicker">43 · Target、Post-shock Actual、Order 与 Fill</p>
        <h2>观点先产生目标 exposure；价格、P&amp;L、FX、现金流和 margin 先更新 actual，二者的差才是候选订单，成交又可能因净额、整数、容量和部分执行而不同。</h2>
        <div className="equation-card">
          <span>从目标到真实仓位</span>
          <div>o<sup>des</sup><sub>t</sub>=x*<sub>t</sub>−x<sup>actual</sup><sub>t−</sub>；　x<sup>actual</sup><sub>t+</sub>=x<sup>actual</sup><sub>t−</sub>+f<sub>t</sub></div>
          <p>x* 是新目标，x_actual,t− 是执行前已完成 mark-to-market 的实际 exposure，o_des 是候选订单，f 是 signed fill。f 可以小于、晚于或异于 o_des；多腿执行还可能暂时恢复本来要中和的方向暴露。</p>
        </div>
        <p>
          因而“仍看空 duration”也可能今天买债券：若实际空头比新 target 更大，买入只是减小空头。公开 thesis 或 target 不足以识别订单，更不能识别 aggregate market flow。
        </p>
      </section>

      <section className="lesson-section" id="entry-exit-invalidation">
        <p className="section-kicker">44 · Entry、Scaling、Stop、Invalidation 与 Path Dependency</p>
        <h2>建仓、加减规模、退出旧观点和建立反向观点是四种状态转换；price stop、time stop、evidence invalidation 与 constraint liquidation 又是四种不同触发器。</h2>
        <div className="equation-card">
          <span>多触发退出时刻</span>
          <div>τ=inf{'{'}t: L<sub>t</sub>≥L̄　or　g(I<sub>t</sub>)≤0　or　t≥T<sub>cat</sub>　or　constraint binds{'}'}</div>
          <p>L̄ 是账户损失阈值，g(I_t)≤0 表示 thesis 证据失效，T_cat 是 catalyst／time horizon。τ 只是触发最早时刻，不保证能在阈值价成交；跳空、stop clustering、market depth 和多腿 leg risk 会决定 fill。</p>
        </div>
        <p>
          FX stop-order 研究提供了止损聚集与价格 cascade 的条件证据；它支持“stop 可能反馈”，不表示每次跳跃都由 stop-loss 引起。<Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="pnl-ledger">
        <p className="section-kicker">阶段六 · 归因与证伪　|　45 · Realized P&amp;L Ledger</p>
        <h2>最终盈利不是预测正确的同义词，最终亏损也不自动证伪宏观机制；只有先用会计恒等式复算总额，再按 30 节冻结的互斥规则解释 MTM 与现金流，才能知道钱从哪里来。</h2>
        <div className="equation-card">
          <span>可复算的事后归因</span>
          <div>Π<sup>real</sup>=ΔMTM+CF<sub>contract</sub>−C<sub>fund</sub>−C<sub>exe</sub>；　ΔMTM=Π<sub>theme</sub>+Π<sub>curve/basis</sub>+Π<sub>FX</sub>+Π<sub>nonlinear</sub>+residual</div>
          <p>第二层的各项必须与 30 节事前 convention 相同且不重叠；若另报 carry／roll，它只能是对第一层既有项目的重分类，不得再加回总额。Residual 不应被强行分配给“skill”；多资产 book 还要保存因子重估、合约现金流、实际 fills 与 P&amp;L timestamp。</p>
        </div>
        <p>
          例如 theme MTM +420k、curve／basis MTM −260k、FX MTM −90k、合约现金流 +40k、funding／execution −30k，净值是 +80k；既不能把 +80k 全归为 forecast skill，也不能因 basis 亏损否定政策方向信息。
        </p>
      </section>

      <section className="lesson-section" id="error-taxonomy">
        <p className="section-kicker">46 · Forecast、Mapping、Sizing 与 Execution Error</p>
        <h2>“这笔 macro trade 错了”至少可能指四种不同错误；如果不拆开，团队会在错误层修补正确环节，并把偶然盈利当作模型验证。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="Global macro 错误分类，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>错误层</th><th>诊断问题</th><th>可见反例</th></tr></thead>
            <tbody>
              <tr><td>Forecast</td><td>经理的 state probability 是否校准</td><td>状态根本未出现</td></tr>
              <tr><td>Mapping</td><td>状态到 price factor 的条件符号是否正确</td><td>增长上修却被 discount-rate 通道压过</td></tr>
              <tr><td>Sizing</td><td>factor overlap、tail 与 funding 是否低估</td><td>终局正确但先被 margin 迫退</td></tr>
              <tr><td>Execution</td><td>工具、期限、basis、成本和 fill 是否偏离</td><td>方向正确却 roll／basis 亏损</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          预测评估应与简单基准做 real-time、out-of-sample 比较；经典 FX 与 equity-premium 文献都显示看似有经济逻辑的 predictor 很容易在样本外失效。<Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="belief-update">
        <p className="section-kicker">47 · Bayesian-style Belief Update（进阶）</p>
        <h2>新数据应按它在不同候选状态下有多可能来重新分配概率，而不是每次公布都把 prior 清零；但形式化 Bayes 也不能挽救错误的状态空间。</h2>
        <div className="equation-card">
          <span>离散状态的 Bayes 更新</span>
          <div>p<sup>+</sup><sub>s</sub>=p<sup>−</sup><sub>s</sub>L(y|s)/Σ<sub>j</sub>p<sup>−</sup><sub>j</sub>L(y|j)</div>
          <p>p− 是公布前概率，L(y|s) 是在状态 s 下观察 y 的 likelihood，分母使 posterior p+ 加总为 1。Discretionary manager 可用情景权重近似，systematic model 可显式估计；likelihood、结构断点和遗漏状态仍是模型风险。</p>
        </div>
        <p>
          更新后要同时重算 market gap、scenario payoff、target 与 constraints。Probability 变动不一定改变订单：若价格已经移动更多、actual 漂移或风险上限收紧，订单方向甚至可能反向。
        </p>
      </section>

      <section className="lesson-section" id="crowding-consensus">
        <p className="section-kicker">48 · Consensus、Crowding 与 Positioning Proxy</p>
        <h2>观点广泛共享可能减少边际买家并增加共同退出风险，但 survey consensus、风格 beta、COT 分类和公开持仓都只是不同代理；“很多人相信”不等于“今天有同向订单”。</h2>
        <p>
          Crowding 至少包含信念相似、持仓重叠、融资来源相似和退出规则相似四层。Return-based style exposure 可以提示共同因子，却不能识别哪家基金、哪笔合约或逐笔 flow；concentrated ownership 对价格脆弱性的证据也不能直接外推为 global macro 的实时因果。<Cite n={42} /><Cite n={43} />
        </p>
        <p>
          本节只要求给 positioning evidence 分级：自报 thesis、target proxy、actual position、submitted order、fill 与 aggregate public proxy。完整 crowding 与共同平仓机制留给 2.19 和 Chapter 7。
        </p>
      </section>

      <section className="lesson-section" id="funding-feedback">
        <p className="section-kicker">49 · Funding、Liquidity 与 Policy-reversal Feedback</p>
        <h2>当损失、variation margin、haircut 与 dealer capacity 同时收紧时，基金可在观点未变时减仓，价格冲击又恶化损益与约束；这是条件性正反馈，不是 macro fund 的必然行为。</h2>
        <p>
          Funding liquidity 与 market liquidity 可以形成条件性正反馈：loss／margin／haircut 收紧融资，desired deleveraging 进入订单，成交压低价格并恶化下一轮 collateral 与 market depth。机制存在不表示每次亏损都进入 spiral，必须观察约束、订单、成交与 dealer absorption。<Cite n={32} />
        </p>
        <p>
          2020 年 3 月 Treasury dislocation 提供边界案例：BIS 记录 leveraged cash-futures relative-value unwind、margin call、债券出售与 dealer balance-sheet constraint 的共同作用，并明确事件是多因素汇合，不能简化为某一策略单因果。<Cite n={33} />
        </p>
        <p>
          单一基金层的链是 loss → margin／limit → desired deleveraging → orders → fills；系统层还需聚合 cohort、market depth 与 dealer absorption。没有 position 和 fill 证据，只能提出反馈假设，不能从价格图倒推出宏观基金流量。
        </p>
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">50 · 五组反例：看对事实仍可能做错交易</p>
        <h2>反例不是边角料，而是检验机制是否真的条件化：只要一个简短反事实能推翻固定符号，正文就不能再用“X 所以 Y”作普遍定律。</h2>
        <ol className="diagnostic-list">
          <li><b>热数据、债券反涨：</b>数据虽高却低于预期，或央行信息／risk-premium 通道压过 headline。</li>
          <li><b>加息、货币反跌：</b>本次动作已计价，future path 较预期更鸽，或全球美元／避险状态主导。</li>
          <li><b>增长判断正确、股票下跌：</b>盈利上修小于实际利率或 equity risk premium 上升。</li>
          <li><b>方向正确、账户亏损：</b>maturity 错位、negative carry、basis、FX、convexity 或 margin 先触发。</li>
          <li><b>宏观判断错误、交易盈利：</b>carry、意外 beta 或另一条腿贡献掩盖了 forecast error。</li>
        </ol>
        <p>
          这些反例不表示映射完全任意，而是要求估计 P(Δprice|surprise,state,positioning)，而非只估计 P(Δprice|headline)。高频公告研究的状态依赖正支持这种条件化。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">51 · 可证伪研究协议</p>
        <h2>研究 macro surprise、strategy target 或 fund flow 时先声明研究对象；price response、目标仓位、真实成交与成交的价格影响是四个不同 estimand。</h2>
        <div className="equation-card">
          <span>状态条件化的 event-response 模板</span>
          <div>r<sub>i,e,w</sub>=α<sub>i</sub>+β<sub>i</sub>z<sub>e</sub>+γ<sub>i</sub>(z<sub>e</sub>×State<sub>e−</sub>)+δ′X<sub>e</sub>+ε<sub>i,e</sub></div>
          <p>r 是资产 i 在事件 e 的预注册窗口 w 内回报，z 是事前标准化 surprise，State_e− 只能由事件前数据定义，X 控制重叠新闻。回归估计条件平均响应；只有在预期测量可靠、窗口相对外生、污染受控和结构假设成立时，才可进一步讨论因果。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>冻结信息：</b>vintage、consensus source、price snapshot、timezone 与 release calendar。</li>
          <li><b>冻结 shock：</b>headline、revision、target／path／information factor 及 sign convention。</li>
          <li><b>冻结 state：</b>只用 e− 数据定义 regime，禁止结果后切样本。</li>
          <li><b>冻结工具：</b>quote、contract、maturity、CTD、roll、DV01／delta 与交易时段。</li>
          <li><b>冻结结果：</b>方向、horizon、cost、alternative mechanism 与 invalidation。</li>
          <li><b>证据分层：</b>target、actual、order、fill 和 aggregate proxy 不得互换。</li>
          <li><b>做反例：</b>替代 expectation、window、state、baseline 与未见样本；处理 data snooping。</li>
        </ol>
        <p>
          Event-study 方法与 reality-check 文献分别提供窗口设计和多重搜索警告；二者都不能弥补错误时钟或不存在的订单数据。<Cite n={44} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">52 · Global-macro Translation Lab</p>
        <h2>用十组冻结参数把 data、surprise、price-implied baseline 翻译为 DV01、curve、FX、carry、equity、commodity 与账户状态，再审计哪些结论仍不可识别。</h2>
        <p>
          先独立计算，再提交答案。错误项分别代表把 level 当 surprise、把价格隐含量当纯信念、写反 bond／FX 符号、把 neutral 当无风险、把 carry 当套利、把 basis 当方向、把 margin 当风险和把 target 当 fill。
        </p>
        <GlobalMacroLab />
        <div className="print-only">互动实验在打印版中隐藏。请改做下一节“主动练习”的十道同源静态变式；打印时答案会展开。浏览器无 JavaScript 时也可直接使用静态题与理解检查。</div>
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">53 · 主动练习 · 十道静态变式</p>
        <h2>同一机制换一组报价、期限或账户状态：脱离选项重算，才能确认你掌握了单位与边界，而不是记住前一题的答案位置。</h2>
        <div className="practice-grid">
          {globalMacroScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id + '-static'}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">54 · 理解检查</p>
        <h2>如果不能不看公式复述以下边界，就还没有真正掌握“宏观观点怎样成为交易”。</h2>
        <details className="understanding-check"><summary>01 · Global macro 的最小分析单位是什么？</summary><p>不是一条新闻，而是信息截止、市场基准、条件分歧、传导、工具、情景损益、目标、实际仓位、订单、成交和更新构成的闭环。</p></details>
        <details className="understanding-check"><summary>02 · 为什么经济判断正确仍可能亏损？</summary><p>判断可能已计价，或映射、工具、期限、carry、basis、FX、规模、融资、执行和退出时点错误；宏观看对只验证 forecast 链的一部分。</p></details>
        <details className="understanding-check"><summary>03 · State、observation 与 surprise 有什么区别？</summary><p>State 是不可完全观察的经济状态；observation 是带滞后和修订的统计观测；surprise 是公布值相对公布前同口径 expectation 的差。</p></details>
        <details className="understanding-check"><summary>04 · 为什么 survey consensus 不等于 market-implied expectation？</summary><p>调查的样本、激励、期限与聚合不同；价格还包含风险溢价、流动性、合约结算和供需。二者都是不同代理，不是唯一真信念。</p></details>
        <details className="understanding-check"><summary>05 · 央行加息为什么不保证长债下跌或本币升值？</summary><p>本次动作可能已计价；future path、央行信息、期限／风险溢价与全球融资状态可能同时变化，净价格反应依这些 surprise component 与 regime 而定。</p></details>
        <details className="understanding-check"><summary>06 · Duration、DV01 与 convexity 分别解决什么？</summary><p>Modified duration 是收益率变化的局部价格百分比斜率；DV01 把 1 bp 变成货币损益；convexity 修正曲率和大幅移动。三者都不是最大损失。</p></details>
        <details className="understanding-check"><summary>07 · Relative-value 为什么不等于无风险？</summary><p>它只中和 B 中声明的一阶因子，仍保留 curve、basis、currency、convexity、liquidity、funding、leg 和模型风险。</p></details>
        <details className="understanding-check"><summary>08 · 为什么 FX forward payoff 不能再机械加一次利差 carry？</summary><p>CIP 下利差已进入入场 forward price；到期 long-foreign payoff 是 N(S_T−F)。再加同一利差会双重计算，现实 basis 与成本应另列。</p></details>
        <details className="understanding-check"><summary>09 · 不同资产的 notional 为什么不能直接相加比较风险？</summary><p>相同 notional 对 yield、spot、index、curve 与 jump 的敏感度不同；必须先转换为 DV01、delta、factor J 或统一 scenario loss。</p></details>
        <details className="understanding-check"><summary>10 · 为什么看空观点可能生成买单？</summary><p>若 post-shock actual 比新的空头 target 更负，target−actual 为正，候选订单就是买入减仓；观点符号、目标符号和订单符号不是同一对象。</p></details>
        <details className="understanding-check"><summary>11 · Stop-loss 与 thesis invalidation 有何不同？</summary><p>Stop 管理账户损失与生存，invalidation 判断因果假设是否仍成立；二者可分别触发，且 stop trigger 不保证成交价。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪“宏观基金买盘推动了本次上涨”？</summary><p>若只有 thesis、公开持仓 proxy 或收益相关而没有同钟的 actual gap、target change、signed orders／fills 与价格深度，就不能识别 flow；若共同新闻或其他主体先行，也应拒绝单因果归因。</p></details>
      </section>

      <section className="lesson-section" id="glossary-interfaces">
        <p className="section-kicker">55 · Glossary、课程接口与闭环</p>
        <h2>本节最终产物不是一张“数据—资产方向表”，而是一份能说明信息、分歧、工具、风险、账户、损益与证据分别处在哪一层的 macro decision map。</h2>
        <div className="interface-grid">
          <article><span>回接 2.10</span><h3>Price path ≠ Macro thesis</h3><p>Trend 从滞后价格路径产生方向；macro 从 state、baseline 与条件分歧产生方向，两者可共用 futures 和执行语法。</p></article>
          <article><span>回接 2.12</span><h3>Risk allocation</h3><p>2.12 给定 Σ 与 b 求 q；本节解释观点为何改变 signed overlay、预算或资产宇宙，并要求分层记录。</p></article>
          <article><span>连接 2.14 / 2.16</span><h3>Nonlinearity 与 Limits</h3><p>2.14 展开 asymmetric option payoff；2.16 把 scenario loss、margin 与 gross 输入升级为 VaR／ES、limit 和治理。</p></article>
          <article><span>连接 Chapters 3–4</span><h3>Macro formation 与 transmission</h3><p>后续解释增长、通胀、央行、收益率、美元融资和商品冲击怎样形成；本节只编译为交易输入。</p></article>
          <article><span>连接 2.19 / Chapter 7</span><h3>Crowding 与 feedback</h3><p>后续才聚合共同 thesis、融资、订单、market depth 与 price impact，识别系统性正反馈。</p></article>
        </div>
        <div className="precision-note">
          <span>术语回查</span>
          <p>State／observation／price／trade 回到 06；vintage、consensus 与 surprise 回到 08–12；conditional thesis 回到 13–15；rates／FX／equity／commodity mechanics 回到 19–31；factor map 与 view ledger 回到 32–36；scenario、normalization、gross／margin 与 orders 回到 37–44；attribution、update、crowding 与 research 回到 45–51。</p>
        </div>
        <p>
          最小复述应是：<b>截至决策前的信息和数据 vintage 先与明确来源的 survey／price-implied baseline 比较，形成对状态概率或传导系数的条件分歧；分歧再经 cash flow、policy path、discount rate、risk premium、inventory 等节点映射为带报价、币种、期限、DV01／delta、carry、roll、basis 与 convexity 的工具情景损益；经理用 factor overlap、invalidation loss、covariance、margin、liquidity 和 mandate 形成 target，价格与现金流先更新 actual，target−actual 才是候选订单，fill 才改变仓位；事后必须分开 forecast、mapping、sizing 与 execution error。没有 actual、order、fill 和匹配时钟，不能从宏观观点推出 signed flow，更不能把同期价格变化归因于 global macro fund。</b>
        </p>
      </section>
    </>
  );
}

export const lesson213: LessonRecord = {
  slug: '2-13',
  id: '2.13',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Global Macro Fund：从宏观分歧与市场定价到可失效、可归因的跨资产仓位',
  subtitle: '冻结实时信息与市场基准，把条件化的增长、通胀和政策分歧翻译为利率、外汇、股指与商品暴露，再经情景损益、约束、账户差额、成交与归因完成可审计闭环',
  readingTime: '主线首读约 95–110 分钟（资产机制按所需工具选读，并跳过标注的进阶推导），完整正文约 140–170；互动实验首次完成 30–40／含复盘 45–55，主动练习核对 20–25／完整书写 35–45，理解检查快速 10–12／完整复述 18–22，课程接口约 4 分钟；快速路径约 159–191 分钟，完整学习约 242–296 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T01–T03、T07–T08；按需回看 1.09、1.20、1.22、2.10–2.12；本节内置 Chapter 3 的最小操作性预览',
  updatedAt: '2026-08-30',
  revision: '2.13-r1',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.13-r1',
      summary: '独立复核 56 节、28 张公式卡、10 道互动题与 10 道静态变式、50 条来源和 62 个引文落点，并逐项核验 surprise／政策路径、DV01／CTD、CIP／carry、股指 fair value、商品 curve／roll、P&L 会计、target–actual–order–fill 与事件识别边界；类型、规范、构建、HTTP 与冻结哈希均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.13-r1',
      summary: '独立复核零基础单位／状态桥、导论＋六阶段递进、56 项目录、主线／进阶分层、10+10 题、12 道理解检查与 6+7+7 阅读路径，并检查无默认答案、本地保存与损坏恢复、焦点／ARIA、无脚本、打印、移动端及 reduced-motion 降级；构建、HTTP 与冻结哈希均一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-12', label: '2.12 Risk Parity' },
  next: { slug: '2-14', label: '2.14 Options / Volatility Trader' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与术语桥' },
    { id: 'state-chain', label: '完整状态闭环' },
    { id: 'definition', label: 'Global Macro 定义' },
    { id: 'discretionary-systematic', label: 'Discretionary / Systematic' },
    { id: 'directional-relative-value', label: 'Directional / Relative-value' },
    { id: 'four-ledgers', label: '四层账本' },
    { id: 'four-gaps', label: '新闻到收益的四道缝隙' },
    { id: 'decision-clock', label: 'Decision Clock 与 Vintage' },
    { id: 'mixed-frequency', label: 'Mixed Frequency' },
    { id: 'prior-consensus-distribution', label: 'Prior、Consensus 与分布' },
    { id: 'survey-vs-price', label: 'Survey 与 Price-implied' },
    { id: 'level-change-surprise', label: 'Level、Change 与 Surprise' },
    { id: 'horizon-catalyst', label: 'Horizon 与 Catalyst' },
    { id: 'conditional-thesis', label: 'Conditional Thesis' },
    { id: 'invalidation-competing', label: 'Invalidation 与替代解释' },
    { id: 'macro-minimum-bridge', label: 'Growth / Inflation / Policy 桥' },
    { id: 'reaction-path', label: 'Reaction Function 与 Path' },
    { id: 'nominal-real-breakeven', label: 'Nominal / Real / Breakeven' },
    { id: 'bond-price-yield', label: 'Bond Price 与 Yield' },
    { id: 'duration-dv01', label: 'Duration 与 DV01' },
    { id: 'convexity', label: 'Convexity' },
    { id: 'curve-trades', label: 'Curve Trades' },
    { id: 'rates-instruments', label: 'Cash / Futures / Swap' },
    { id: 'fx-quote', label: 'FX Quote' },
    { id: 'cip-forward', label: 'CIP、Forward 与 Basis' },
    { id: 'fx-carry', label: 'FX Carry 与 Crash Risk' },
    { id: 'equity-channels', label: 'Equity 定价通道' },
    { id: 'equity-futures', label: 'Equity-index Futures' },
    { id: 'commodity-futures', label: 'Commodity Curve' },
    { id: 'carry-roll-basis', label: 'Carry、Roll、Basis 与 Repricing' },
    { id: 'currency-hedging', label: 'Currency Translation 与 Hedging' },
    { id: 'factor-map', label: 'Cross-asset Factor Map' },
    { id: 'view-ledger', label: 'View Ledger' },
    { id: 'directional-expression', label: 'Directional Expression' },
    { id: 'relative-value-expression', label: 'Relative-value Expression' },
    { id: 'instrument-selection', label: 'Instrument 与 Maturity' },
    { id: 'scenario-payoff', label: 'Scenario Payoff Matrix' },
    { id: 'expected-value', label: 'Expected P&L 与 Asymmetry' },
    { id: 'exposure-normalization', label: 'Sensitivity Normalization' },
    { id: 'portfolio-interface', label: 'Portfolio Interface' },
    { id: 'gross-net', label: 'Gross、Net 与 Economic Risk' },
    { id: 'margin-funding', label: 'Margin 与 Funding' },
    { id: 'target-actual-order-fill', label: 'Target、Actual、Order、Fill' },
    { id: 'entry-exit-invalidation', label: 'Entry、Stop 与 Invalidation' },
    { id: 'pnl-ledger', label: 'Realized P&L Ledger' },
    { id: 'error-taxonomy', label: '四类错误' },
    { id: 'belief-update', label: 'Belief Update' },
    { id: 'crowding-consensus', label: 'Crowding 与 Positioning Proxy' },
    { id: 'funding-feedback', label: 'Funding Feedback' },
    { id: 'counterexamples', label: '五组反例' },
    { id: 'research-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: 'Global-macro Translation Lab' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'glossary-interfaces', label: 'Glossary 与课程接口' },
  ],
  Content: Lesson213Content,
  references: [
    { id: 1, authors: 'Barry J. Eichengreen and Donald J. Mathieson', year: '1999', accessedAt: '2026-08-30', title: 'Hedge Funds: What Do We Really Know?', publication: 'IMF Economic Issues, No. 19', url: 'https://doi.org/10.5089/9781557758491.051', use: '支持早期全球宏观型基金的策略描述、行业异质性与数据局限；不得把其中的基金数量、规模、杠杆或监管状态外推为当前事实。' },
    { id: 2, authors: 'William Fung and David A. Hsieh', year: '1997', accessedAt: '2026-08-30', title: 'Empirical Characteristics of Dynamic Trading Strategies: The Case of Hedge Funds', publication: 'The Review of Financial Studies 10(2), 275–302', url: 'https://doi.org/10.1093/rfs/10.2.275', use: '支持动态交易策略产生非线性且随状态变化的收益暴露；不能由此反推某只基金的实时持仓、判断过程或当前风险。' },
    { id: 3, authors: 'William Fung and David A. Hsieh', year: '1999', accessedAt: '2026-08-30', title: 'A Primer on Hedge Funds', publication: 'Journal of Empirical Finance 6(3), 309–331', url: 'https://doi.org/10.1016/S0927-5398(99)00006-7', use: '支持对冲基金的组织特征、交易风格与历史分类；旧样本中的行业统计不能描述今天的基金结构或表现。' },
    { id: 4, authors: 'Tobias J. Moskowitz, Yao Hua Ooi and Lasse Heje Pedersen', year: '2012', accessedAt: '2026-08-30', title: 'Time Series Momentum', publication: 'Journal of Financial Economics 104(2), 228–250', url: 'https://doi.org/10.1016/j.jfineco.2011.11.003', use: '支持时间序列动量是一类可跨资产实施的系统化方向策略；它不是全部 systematic macro 的定义，也不保证新样本净收益。' },
    { id: 5, authors: 'Athanasios Orphanides', year: '2001', accessedAt: '2026-08-30', title: 'Monetary Policy Rules Based on Real-Time Data', publication: 'American Economic Review 91(4), 964–985', url: 'https://doi.org/10.1257/aer.91.4.964', use: '支持实时数据与事后修订数据可能显著不同；美国货币政策结果不能机械推广到所有经济体或制度时期。' },
    { id: 6, authors: 'Federal Reserve Bank of New York', year: '2025–present', accessedAt: '2026-08-30', title: 'Survey of Market Expectations', publication: 'Federal Reserve Bank of New York, Markets Group survey archive', url: 'https://www.newyorkfed.org/markets/market-intelligence/survey-of-market-expectations', use: '展示政策、经济与市场预期调查可和价格信息互补；该调查不是全部投资者的代表性纯信念，也不是可直接交易的政策路径。' },
    { id: 7, authors: 'Monika Piazzesi and Eric T. Swanson', year: '2008', accessedAt: '2026-08-30', title: 'Futures Prices as Risk-Adjusted Forecasts of Monetary Policy', publication: 'Journal of Monetary Economics 55(4), 677–691', url: 'https://doi.org/10.1016/j.jmoneco.2008.04.003', use: '支持短期利率期货同时包含政策预期与时变风险溢价；不得把隐含利率无条件解释为未来政策利率的均值预测。' },
    { id: 8, authors: 'Kenneth N. Kuttner', year: '2001', accessedAt: '2026-08-30', title: 'Monetary Policy Surprises and Interest Rates: Evidence from the Fed Funds Futures Market', publication: 'Journal of Monetary Economics 47(3), 523–544', url: 'https://doi.org/10.1016/S0304-3932(01)00055-1', use: '支持区分已预期的政策行动与期货识别出的意外成分；估计依赖当时制度，不能直接套用于 SOFR 时代。' },
    { id: 9, authors: 'Torben G. Andersen, Tim Bollerslev, Francis X. Diebold and Clara Vega', year: '2003', accessedAt: '2026-08-30', title: 'Micro Effects of Macro Announcements: Real-Time Price Discovery in Foreign Exchange', publication: 'American Economic Review 93(1), 38–62', url: 'https://doi.org/10.1257/000282803321455151', use: '支持外汇对宏观数据相对预期的意外部分进行快速且非对称的价格发现；历史响应并非所有时期的固定系数。' },
    { id: 10, authors: 'Torben G. Andersen, Tim Bollerslev, Francis X. Diebold and Clara Vega', year: '2007', accessedAt: '2026-08-30', title: 'Real-Time Price Discovery in Global Stock, Bond and Foreign Exchange Markets', publication: 'Journal of International Economics 73(2), 251–277', url: 'https://doi.org/10.1016/j.jinteco.2007.02.004', use: '支持标准化宏观意外在股票、债券与外汇产生不同且状态依赖的即时反应；经验响应不是跨制度结构常数。' },
    { id: 11, authors: 'Refet S. Gürkaynak, Brian Sack and Eric T. Swanson', year: '2005', accessedAt: '2026-08-30', title: 'Do Actions Speak Louder Than Words? The Response of Asset Prices to Monetary Policy Actions and Statements', publication: 'International Journal of Central Banking 1(1), 55–93', url: 'https://www.ijcb.org/journal/ijcb05q2a2.pdf', use: '支持政策公告可分解为当前目标与未来路径等信息因子；不能预设所有央行、样本与公告制度都服从相同双因子结构。' },
    { id: 12, authors: 'Emi Nakamura and Jón Steinsson', year: '2018', accessedAt: '2026-08-30', title: 'High-Frequency Identification of Monetary Non-Neutrality: The Information Effect', publication: 'The Quarterly Journal of Economics 133(3), 1283–1330', url: 'https://doi.org/10.1093/qje/qjy004', use: '支持央行公告可能同时披露关于基本面的信息；信息效应依赖模型与事件窗口，不能解释所有公告日共动。' },
    { id: 13, authors: 'Michael D. Bauer and Eric T. Swanson', year: '2023', accessedAt: '2026-08-30', title: 'A Reassessment of Monetary Policy Surprises and High-Frequency Identification', publication: 'NBER Macroeconomics Annual 37, 87–155', url: 'https://doi.org/10.1086/723574', use: '提供对信息效应和高频识别解释的系统再评估；该论文参与仍有争议的识别讨论，而非终结性定论。' },
    { id: 14, authors: 'Miguel Acosta, Connor M. Brennan and Margaret M. Jacobson', year: '2024', accessedAt: '2026-08-30', title: 'Constructing High-Frequency Monetary Policy Surprises from SOFR Futures', publication: 'Finance and Economics Discussion Series 2024-034, Board of Governors of the Federal Reserve System', url: 'https://doi.org/10.17016/FEDS.2024.034', use: '支持在 SOFR 期货制度下构造美国货币政策高频意外；这是测量方法，不是每次价格变化的唯一结构因果解释。' },
    { id: 15, authors: 'Refet S. Gürkaynak, Brian Sack and Jonathan H. Wright', year: '2007', accessedAt: '2026-08-30', title: 'The U.S. Treasury Yield Curve: 1961 to the Present', publication: 'Journal of Monetary Economics 54(8), 2291–2304', url: 'https://doi.org/10.1016/j.jmoneco.2007.06.029', use: '支持从美国国债价格估计零息曲线与远期利率的方法；该曲线不是任意债券组合的完整风险模型。' },
    { id: 16, authors: 'Bruce Tuckman and Angel Serrat', year: '2022', accessedAt: '2026-08-30', title: 'Fixed Income Securities: Tools for Today’s Markets', publication: '4th ed., Wiley', url: 'https://doi.org/10.1002/9781119835622', use: '支持债券价格、久期、DV01、凸性、曲线和固定收益相对价值工具；教材公式不构成盈利或模型适用性的经验证据。' },
    { id: 17, authors: 'Nicholas Johnson, John Kerpel and Jonathan Kronstein', year: '2017', accessedAt: '2026-08-30', title: 'Understanding Treasury Futures', publication: 'CME Group, November 2017', url: 'https://www.cmegroup.com/content/dam/cmegroup/education/files/understanding-treasury-futures.pdf', use: '支持美国国债期货的交割、转换因子和最便宜可交割机制；合约规格、交割篮子与规则必须另以当前文件复核。' },
    { id: 18, authors: 'European Central Bank', year: '1998', accessedAt: '2026-08-30', title: 'Determination and Publication of Euro Foreign Exchange Reference Rates', publication: 'ECB press release, 8 July 1998', url: 'https://www.ecb.europa.eu/press/pr/date/1998/html/pr980708_2.en.html', use: '支持欧元参考汇率的直接报价约定与发布性质；参考汇率不是可成交价格，也不能替代其他币对惯例的逐一确认。' },
    { id: 19, authors: 'Claudio Borio, Robert N. McCauley, Patrick McGuire and Vladyslav Sushko', year: '2016', accessedAt: '2026-08-30', title: 'Covered Interest Parity Lost: Understanding the Cross-Currency Basis', publication: 'BIS Quarterly Review, September 2016, 45–64', url: 'https://www.bis.org/publications/covered-interest-parity-lost-understanding-cross-currency-basis', use: '支持跨币种基差可由银行资产负债表约束和对冲需求持续推动；观察到的基差不是人人可获得的无资本约束套利利润。' },
    { id: 20, authors: 'Wenxin Du, Alexander Tepper and Adrien Verdelhan', year: '2018', accessedAt: '2026-08-30', title: 'Deviations from Covered Interest Rate Parity', publication: 'The Journal of Finance 73(3), 915–957', url: 'https://doi.org/10.1111/jofi.12620', use: '支持主要货币的 CIP 偏离具有系统性并与中介约束相关；不能把所有远期点或 FX carry 解释为可锁定的平价偏离。' },
    { id: 21, authors: 'Eugene F. Fama', year: '1984', accessedAt: '2026-08-30', title: 'Forward and Spot Exchange Rates', publication: 'Journal of Monetary Economics 14(3), 319–338', url: 'https://doi.org/10.1016/0304-3932(84)90046-1', use: '支持远期汇率变化可分解为预期即期变化与风险溢价；历史结果不是 CIP 检验，也不保证现代货币具有相同系数。' },
    { id: 22, authors: 'Markus K. Brunnermeier, Stefan Nagel and Lasse H. Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Carry Trades and Currency Crashes', publication: 'NBER Macroeconomics Annual 23, 313–347', url: 'https://doi.org/10.1086/593088', use: '支持货币 carry 的负偏度、崩盘风险与融资条件联系；不能将所有汇率跳跃或 carry 亏损归于同一去杠杆机制。' },
    { id: 23, authors: 'Lukas Menkhoff, Lucio Sarno, Maik Schmeling and Andreas Schrimpf', year: '2012', accessedAt: '2026-08-30', title: 'Carry Trades and Global Foreign Exchange Volatility', publication: 'The Journal of Finance 67(2), 681–718', url: 'https://doi.org/10.1111/j.1540-6261.2012.01728.x', use: '支持 currency carry 组合暴露于全球 FX volatility risk；它不表示每次回撤由波动率单独驱动，也不是稳定实时信号。' },
    { id: 24, authors: 'Ralph S. J. Koijen, Tobias J. Moskowitz, Lasse Heje Pedersen and Evert B. Vrugt', year: '2018', accessedAt: '2026-08-30', title: 'Carry', publication: 'Journal of Financial Economics 127(2), 197–225', url: 'https://doi.org/10.1016/j.jfineco.2017.11.002', use: '比较多资产由价格不变条件下收益定义的 carry；构造并不完全同质，历史横截面结果也不保证未来净收益。' },
    { id: 25, authors: 'A. Craig MacKinlay and Krishna Ramaswamy', year: '1988', accessedAt: '2026-08-30', title: 'Index-Futures Arbitrage and the Behavior of Stock Index Futures Prices', publication: 'The Review of Financial Studies 1(2), 137–158', url: 'https://doi.org/10.1093/rfs/1.2.137', use: '支持股指期货偏离需结合股息、成本与套利边界理解；历史结构与成本不能作为今天的可执行套利阈值。' },
    { id: 26, authors: 'CME Group', year: 'n.d.', accessedAt: '2026-08-30', title: 'Calculating Fair Value', publication: 'CME Group Equity Index Education', url: 'https://www.cmegroup.com/trading/equity-index/fairvalue.html', use: '展示股指期货由现货、融资、股息和到期时间构成的简化 fair-value 公式；示例不是实时报价，也未计入全部摩擦。' },
    { id: 27, authors: 'Holbrook Working', year: '1949', accessedAt: '2026-08-30', title: 'The Theory of Price of Storage', publication: 'American Economic Review 39(6), 1254–1262', url: 'https://www.jstor.org/stable/1816601', use: '建立库存、仓储服务与商品期限结构的经典联系；框架主要适用于可储存商品，不能原样套用于电力等资产。' },
    { id: 28, authors: 'Eugene F. Fama and Kenneth R. French', year: '1987', accessedAt: '2026-08-30', title: 'Commodity Futures Prices: Some Evidence on Forecast Power, Premiums, and the Theory of Storage', publication: 'The Journal of Business 60(1), 55–73', url: 'https://doi.org/10.1086/296385', use: '支持区分商品基差中的预期现货、风险溢价与储存因素；不同商品不能以统一系数解释。' },
    { id: 29, authors: 'Gary B. Gorton, Fumio Hayashi and K. Geert Rouwenhorst', year: '2013', accessedAt: '2026-08-30', title: 'The Fundamentals of Commodity Futures Returns', publication: 'Review of Finance 17(1), 35–105', url: 'https://doi.org/10.1093/rof/rfs019', use: '支持库存、基差和风险溢价与商品期货收益存在经验联系；特定历史样本不能变成当前实时预测规则。' },
    { id: 30, authors: 'Hendrik Bessembinder', year: '2018', accessedAt: '2026-08-30', title: 'The “Roll Yield” Myth', publication: 'Financial Analysts Journal 74(2), 41–53', url: 'https://doi.org/10.2469/faj.v74.n2.5', use: '纠正把期货换月机械解释为额外现金收益的说法；并不否认期限结构与合约选择影响持仓总回报。' },
    { id: 31, authors: 'Andrew Ang, Sergiy Gorovyy and Gregory B. van Inwegen', year: '2011', accessedAt: '2026-08-30', title: 'Hedge Fund Leverage', publication: 'Journal of Financial Economics 102(1), 102–126', url: 'https://doi.org/10.1016/j.jfineco.2011.02.020', use: '支持区分 gross、net 与衍生品暴露并测量危机前后杠杆；2004–2009 样本不是当前 global macro 平均杠杆。' },
    { id: 32, authors: 'Markus K. Brunnermeier and Lasse Heje Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Market Liquidity and Funding Liquidity', publication: 'The Review of Financial Studies 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '解释融资与市场流动性在 margin 收紧时形成互相强化的螺旋；机制是条件性的，不能等同所有价格下跌。' },
    { id: 33, authors: 'Andreas Schrimpf, Hyun Song Shin and Vladyslav Sushko', year: '2020', accessedAt: '2026-08-30', title: 'Leverage and Margin Spirals in Fixed Income Markets during the Covid-19 Crisis', publication: 'BIS Bulletin No. 2, 2 April 2020', url: 'https://www.bis.org/publications/bulletin-2-leverage-and-margin-spirals-fixed-income-markets-during-covid-19-crisis', use: '支持 2020 年 3 月固定收益市场的杠杆、margin 与被动卖出反馈；不能写成事件唯一原因或所有压力的通则。' },
    { id: 34, authors: 'Financial Stability Board', year: '2025', accessedAt: '2026-08-30', title: 'Leverage in Nonbank Financial Intermediation: Final report', publication: 'Financial Stability Board policy report, 9 July 2025', url: 'https://www.fsb.org/2025/07/leverage-in-nonbank-financial-intermediation-final-report/', use: '支持 NBFI 杠杆可通过核心市场和机构互联放大稳定风险及相应治理建议；不提供特定基金的仓位、杠杆或违约概率。' },
    { id: 35, authors: 'Eugene F. Fama', year: '1970', accessedAt: '2026-08-30', title: 'Efficient Capital Markets: A Review of Theory and Empirical Work', publication: 'The Journal of Finance 25(2), 383–417', url: 'https://doi.org/10.2307/2325486', use: '定义不同信息集下的市场效率与检验逻辑；联合假设约束意味着不能称价格揭示唯一真信念或所有市场始终完全有效。' },
    { id: 36, authors: 'Sanford J. Grossman and Joseph E. Stiglitz', year: '1980', accessedAt: '2026-08-30', title: 'On the Impossibility of Informationally Efficient Markets', publication: 'American Economic Review 70(3), 393–408', url: 'https://www.aeaweb.org/aer/top20/70.3.393-408.pdf', use: '解释有信息成本时价格无法无条件反映全部信息的均衡张力；理论本身不是具体资产存在可交易错价的证据。' },
    { id: 37, authors: 'John Y. Campbell and Robert J. Shiller', year: '1988', accessedAt: '2026-08-30', title: 'Stock Prices, Earnings, and Expected Dividends', publication: 'The Journal of Finance 43(3), 661–676', url: 'https://doi.org/10.1111/j.1540-6261.1988.tb04598.x', use: '支持以未来现金流预期与贴现率变化理解股票价格；aggregate historical decomposition 不识别唯一 SDF，也不是个股短期预测模型。' },
    { id: 38, authors: 'Richard A. Meese and Kenneth Rogoff', year: '1983', accessedAt: '2026-08-30', title: 'Empirical Exchange Rate Models of the Seventies: Do They Fit Out of Sample?', publication: 'Journal of International Economics 14(1–2), 3–24', url: 'https://doi.org/10.1016/0022-1996(83)90017-X', use: '支持结构汇率模型在该样本中难以稳定超越简单基准；特定年代与设定不证明汇率在任何期限都不可预测。' },
    { id: 39, authors: 'Ivo Welch and Amit Goyal', year: '2008', accessedAt: '2026-08-30', title: 'A Comprehensive Look at the Empirical Performance of Equity Premium Prediction', publication: 'The Review of Financial Studies 21(4), 1455–1508', url: 'https://doi.org/10.1093/rfs/hhm014', use: '支持许多经典 equity-premium predictor 缺乏稳健样本外表现；不能外推为任何变量、市场、频率或方法都不可预测。' },
    { id: 40, authors: 'Amit Goyal, Ivo Welch and Athanasse Zafirov', year: '2024', accessedAt: '2026-08-30', title: 'A Comprehensive 2022 Look at the Empirical Performance of Equity Premium Prediction', publication: 'The Review of Financial Studies 37(11), 3490–3557', url: 'https://doi.org/10.1093/rfs/hhae044', use: '更新复核 equity-premium prediction；结论仍依变量、数据版本、基准、损失函数与评估期，不是普遍不可能性定理。' },
    { id: 41, authors: 'Francis X. Diebold and Roberto S. Mariano', year: '1995', accessedAt: '2026-08-30', title: 'Comparing Predictive Accuracy', publication: 'Journal of Business & Economic Statistics 13(3), 253–263', url: 'https://doi.org/10.1080/07350015.1995.10524599', use: '支持比较指定损失函数下的平均预测准确度；需处理误差依赖，且统计显著不等于经济上可交易或净收益显著。' },
    { id: 42, authors: 'Robin Greenwood and David Thesmar', year: '2011', accessedAt: '2026-08-30', title: 'Stock Price Fragility', publication: 'Journal of Financial Economics 102(3), 471–490', url: 'https://doi.org/10.1016/j.jfineco.2011.06.003', use: '支持集中且相关的基金持有可使股票价格对资金流更脆弱；美国共同基金证据不能量化 global macro 跨资产冲击。' },
    { id: 43, authors: 'Momtchil Pojarliev and Richard M. Levich', year: '2011', accessedAt: '2026-08-30', title: 'Detecting Crowded Trades in Currency Funds', publication: 'Financial Analysts Journal 67(1), 26–39', url: 'https://doi.org/10.2469/faj.v67.n1.2', use: '支持由共同因子暴露构造 currency-fund crowding proxy；收益相关性不是持仓数据，不能识别方向、规模、执行或清算风险。' },
    { id: 44, authors: 'A. Craig MacKinlay', year: '1997', accessedAt: '2026-08-30', title: 'Event Studies in Economics and Finance', publication: 'Journal of Economic Literature 35(1), 13–39', url: 'https://www.jstor.org/stable/2729691', use: '支持标准事件窗口与异常收益方法；事件不清洁、基准错误或同期冲击存在时不能建立结构因果。' },
    { id: 45, authors: 'Halbert White', year: '2000', accessedAt: '2026-08-30', title: 'A Reality Check for Data Snooping', publication: 'Econometrica 68(5), 1097–1126', url: 'https://doi.org/10.1111/1468-0262.00152', use: '支持校正从大量候选规则中择优造成的数据窥探偏差；不能修复未来泄漏、不可交易价格或错误候选集合。' },
    { id: 46, authors: 'Dean Croushore and Tom Stark', year: '2001', accessedAt: '2026-08-30', title: 'A Real-Time Data Set for Macroeconomists', publication: 'Journal of Econometrics 105(1), 111–130', url: 'https://doi.org/10.1016/S0304-4076(01)00072-0', use: '支持 macro data vintage、revision 与当时信息集对实时预测的重要性；仍需按变量和时期检验每类修订的经济意义。' },
    { id: 47, authors: 'Carol L. Osler', year: '2005', accessedAt: '2026-08-30', title: 'Stop-Loss Orders and Price Cascades in Currency Markets', publication: 'Journal of International Money and Finance 24(2), 219–241', url: 'https://doi.org/10.1016/j.jimonfin.2004.12.002', use: '支持 FX stop 聚集可在跨越关键区间后形成交易级联；特定样本不证明所有突破或跳跃均由 stop 触发。' },
    { id: 48, authors: 'Jefferson Duarte, Francis A. Longstaff and Fan Yu', year: '2007', accessedAt: '2026-08-30', title: 'Risk and Return in Fixed-Income Arbitrage: Nickels in Front of a Steamroller?', publication: 'The Review of Financial Studies 20(3), 769–811', url: 'https://doi.org/10.1093/rfs/hhl026', use: '支持 fixed-income relative value 仍承受尾部、流动性与模型残差；模型组合不是实际基金业绩，也不等于无风险套利。' },
    { id: 49, authors: 'Andrei Shleifer and Robert W. Vishny', year: '1997', accessedAt: '2026-08-30', title: 'The Limits of Arbitrage', publication: 'The Journal of Finance 52(1), 35–55', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x', use: '解释委托资本、短期亏损与赎回怎样限制套利者；不提供特定交易的错价幅度、收敛期限或安全杠杆。' },
    { id: 50, authors: 'Don H. Kim, Cait Walsh and Min Wei', year: '2019', accessedAt: '2026-08-30', title: 'Tips from TIPS: Update and Discussions', publication: 'FEDS Notes, Board of Governors of the Federal Reserve System, 21 May 2019', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/tips-from-tips-update-and-discussions-20190521.html', use: '支持 inflation compensation 可分解为预期通胀、inflation-risk premium 与 TIPS liquidity premium；分解依赖期限结构模型，且流动性楔子的符号与大小不能先验固定。' },
  ],
  readingList: [
    { title: 'Fung & Hsieh (1997) · Empirical Characteristics of Dynamic Trading Strategies', scope: '动态 hedge-fund style、非线性暴露与静态回归边界', reason: '先理解基金标签和历史收益为何不能反推出固定权重或某日订单。', url: 'https://doi.org/10.1093/rfs/10.2.275', group: 'core', guide: '先读策略分类、factor construction 与结论；约 120–180 分钟。' },
    { title: 'Croushore & Stark (2001) · A Real-Time Data Set for Macroeconomists', scope: 'Macro data vintage、初值、修订与 real-time information set', reason: '为 decision clock 建立不可用事后终值回填的证据基础。', url: 'https://doi.org/10.1016/S0304-4076(01)00072-0', group: 'core', guide: '重点读数据结构、vintage triangle 与研究示例；约 90–120 分钟。' },
    { title: 'Kuttner (2001) · Monetary Policy Surprises and Interest Rates', scope: '以 Fed funds futures 区分 anticipated 与 unanticipated action', reason: '建立“政策动作不等于政策 surprise”的最短实证入口。', url: 'https://doi.org/10.1016/S0304-3932(01)00055-1', group: 'core', guide: '重点读 surprise construction、窗口与期限响应；约 90–120 分钟。' },
    { title: 'Gürkaynak, Sack & Swanson (2005) · Do Actions Speak Louder Than Words?', scope: 'Target factor、future-path factor 与跨期限资产响应', reason: '理解市场可能主要交易声明中的未来路径，而非本次政策利率。', url: 'https://www.ijcb.org/journal/ijcb05q2a2.pdf', group: 'core', guide: '配合本节 17 与 51 阅读识别和 factor rotation；约 120–180 分钟。' },
    { title: 'Tuckman & Serrat (2022) · Fixed Income Securities, 4th Edition', scope: 'Yield、duration、DV01、curve、Treasury futures、repo 与 swaps', reason: '把利率最小桥扩张为完整工具、现金流和对冲语言。', url: 'https://doi.org/10.1002/9781119835622', group: 'core', guide: '先读 yield、duration／convexity、curve 与 futures／swap；约 4–6 小时。' },
    { title: 'Koijen et al. (2018) · Carry', scope: '跨 rates、FX、equity index 与 commodity 的统一 carry 语言', reason: '把价格不变时收益与 repricing、roll 和最终净收益分开。', url: 'https://doi.org/10.1016/j.jfineco.2017.11.002', group: 'core', guide: '先读统一定义和四类构造，再读风险解释；约 120–180 分钟。' },
    { title: 'Grossman & Stiglitz (1980) · On the Impossibility of Informationally Efficient Markets', scope: '信息成本、价格信息含量与完全效率的不可能性', reason: '防止把边际价格直接解释为全体参与者的纯平均信念。', url: 'https://www.aeaweb.org/aer/top20/70.3.393-408.pdf', group: 'models', guide: '先读模型直觉、信息激励与均衡结论；约 120–180 分钟。' },
    { title: 'Nakamura & Steinsson (2018) · High-Frequency Identification of Monetary Non-Neutrality', scope: 'Policy surprise、央行信息效应与增长预期', reason: '理解紧缩型窄窗利率变动可能同时传递基本面信息。', url: 'https://doi.org/10.1093/qje/qjy004', group: 'models', guide: '重点区分 policy shock 与 information effect；约 150–210 分钟。' },
    { title: 'Bauer & Swanson (2023) · A Reassessment of Monetary Policy Surprises', scope: '高频识别、公开信息与 competing explanations', reason: '给单一政策冲击解释提供严肃再评估，并训练替代机制。', url: 'https://doi.org/10.1086/723574', group: 'models', guide: '与 Nakamura–Steinsson 对读时钟和识别条件；约 150–210 分钟。' },
    { title: 'Du, Tepper & Verdelhan (2018) · Deviations from Covered Interest Rate Parity', scope: 'Cross-currency basis、dealer balance sheet 与 CIP 偏离', reason: '理解公式套利边界为何不能自动变成客户可执行的无风险利润。', url: 'https://doi.org/10.1111/jofi.12620', group: 'models', guide: '先读 CIP、basis 数据与中介解释；约 150–210 分钟。' },
    { title: 'Brunnermeier, Nagel & Pedersen (2009) · Carry Trades and Currency Crashes', scope: 'Carry positioning、funding unwind、负偏与 crash state', reason: '解释 positive carry 为何可能是条件风险补偿而非锁定收益。', url: 'https://doi.org/10.1086/593088', group: 'models', guide: '重点读拥挤、融资与 crash evidence；约 120–180 分钟。' },
    { title: 'Campbell & Shiller (1988) · Stock Prices, Earnings, and Expected Dividends', scope: '股票价格的 cash-flow、discount-rate 与预期关系', reason: '为“好增长新闻也可能压低股票”建立现值与条件映射。', url: 'https://doi.org/10.1111/j.1540-6261.1988.tb04598.x', group: 'models', guide: '先掌握 present-value intuition，再读经验关系；约 150–210 分钟。' },
    { title: 'Brunnermeier & Pedersen (2009) · Market Liquidity and Funding Liquidity', scope: 'Margin、funding liquidity、market liquidity 与条件螺旋', reason: '把单账户约束连接到价格—流动性反馈，同时保留发生条件。', url: 'https://doi.org/10.1093/rfs/hhn098', group: 'models', guide: '先修 T06、1.20；重点读机制和比较静态；约 150–210 分钟。' },
    { title: 'Andersen et al. (2003) · Micro Effects of Macro Announcements', scope: '实时 macro surprise 与 FX event-time price discovery', reason: '观察 actual−expectation、公告时间和状态怎样进入实证。', url: 'https://doi.org/10.1257/000282803321455151', group: 'evidence', guide: '重点读同步、surprise 标准化与公告响应；约 120–180 分钟。' },
    { title: 'Menkhoff et al. (2012) · Carry Trades and Global Foreign Exchange Volatility', scope: 'Global FX volatility risk 与 carry 回报横截面', reason: '为 carry 风险补偿提供独立证据，拒绝把高息写成免费收益。', url: 'https://doi.org/10.1111/j.1540-6261.2012.01728.x', group: 'evidence', guide: '重点读 factor、portfolio sorts 与危机表现；约 120–180 分钟。' },
    { title: 'Gorton, Hayashi & Rouwenhorst (2013) · Commodity Futures Returns', scope: '库存、basis、便利收益与 commodity risk premium', reason: '把商品曲线连接到库存状态，同时拒绝把曲线当 future spot 的无偏预测。', url: 'https://doi.org/10.1093/rof/rfs019', group: 'evidence', guide: '配合 29–30 阅读库存代理、曲线与回报分解；约 150–210 分钟。' },
    { title: 'Meese & Rogoff (1983) · Empirical Exchange Rate Models of the Seventies', scope: '结构 FX 模型的样本外预测检验', reason: '建立宏观解释力不自动转化为样本外预测增量的经典警告。', url: 'https://doi.org/10.1016/0022-1996(83)90017-X', group: 'evidence', guide: '重点读预测设定、基准与 horizon；约 90–150 分钟。' },
    { title: 'Welch & Goyal (2008) · Equity Premium Prediction', scope: 'Predictors、历史均值基准与样本外失效', reason: '训练任何 macro equity signal 先战胜简单、冻结的预测基准。', url: 'https://doi.org/10.1093/rfs/hhm014', group: 'evidence', guide: '重点读 OOS design、基准和稳定性；约 150–210 分钟。' },
    { title: 'BIS Bulletin No. 2 (2020)', scope: 'Treasury cash–futures unwind、margin 与 dealer capacity', reason: '用压力案例区分 relative-value 观点、融资强平与系统反馈。', url: 'https://www.bis.org/publications/bulletin-2-leverage-and-margin-spirals-fixed-income-markets-during-covid-19-crisis', group: 'evidence', guide: '逐项记录证据、推断与未知量；约 45–60 分钟。' },
    { title: 'White (2000) · A Reality Check for Data Snooping', scope: '多模型搜索、benchmark 与 data-snooping-adjusted inference', reason: '为多国家、多指标、多期限 macro research 建立统计防护。', url: 'https://doi.org/10.1111/1468-0262.00152', group: 'evidence', guide: '配合 51 预注册候选集；推导可后读，约 180–240 分钟。' },
  ],
};
