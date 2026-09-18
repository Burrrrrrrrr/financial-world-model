import EtfArbitrageLab from '../components/EtfArbitrageLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson121Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>ETF 的价格并不是被一根看不见的绳索钉在 NAV 上；真正约束价差的，是一条有成本、有容量、有时钟、也可能暂时失灵的可执行套利回路。</h2>
        <p>
          普通投资者在交易所买卖 ETF 份额，成交价格由二级市场订单决定；基金本身则按持仓资产减负债计算每份净资产价值（net asset value，NAV）。两者来自不同市场，所以短时偏离并不奇怪。ETF 的特殊之处，是少数与基金或其服务商签有协议的授权参与人（authorized participant，AP）可以按一整份 creation unit，把规定篮子与基金交换成 ETF 份额，或把 ETF 份额换回篮子。若 ETF 相对可执行篮子过贵，交易者可买篮子、卖 ETF 并通过申购取得份额；若 ETF 过便宜，则可买 ETF、卖篮子并赎回取得资产。交易一边改变 ETF 份额供给，一边给 ETF 与底层资产施加相反方向的订单压力，价差因此通常收敛。美国现行 Rule 6c-11 正是把 creation unit、basket、AP、market price 与 premium / discount 分别定义，而没有规定二级市场价格必须等于某个静态 NAV。<Cite n={1} /><Cite n={2} />
        </p>
        <p>
          但“存在套利通道”不等于“存在无风险、无限容量且立即执行的套利”。AP 有申赎权限而无持续申赎义务；ETF 做市商与 AP 也不一定是同一机构。交易者必须跨过 ETF 与篮子的买卖价差、整份 creation unit、基金固定费用、融资和借券、库存资本、市场冲击、订单截止、结算及失败风险。更关键的是，日终 NAV、盘中 indicative value 与此刻真正能成交的同步篮子价值并非同一个数。因此，本节的中心问题不是“ETF 为什么等于 NAV”，而是：<b>给定此刻可取得的报价、篮子、合同、资本和时钟，哪一方向的闭环交易有正的风险调整后利润，能做多大，它又会把 ETF、底层资产或两者推向哪里？</b><Cite n={3} /><Cite n={4} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>套利不是看到两条价格线就结束，而是“估值—执行—申赎—供给—冲击—再估值”的闭环。</h2>
        <div className="mechanism-chain" aria-label="ETF 申赎套利的八步反馈链">
          <div><span>01</span><b>识别价差</b><p>比较 ETF 与同一时钟下的可执行篮子。</p></div>
          <div><span>02</span><b>扣除成本</b><p>用两腿 bid / ask、费用、融资与预期冲击检验净利润。</p></div>
          <div><span>03</span><b>取得容量</b><p>确认借券、库存、资本、整份 unit 与 AP 通道均可用。</p></div>
          <div><span>04</span><b>锁定两腿</b><p>执行 ETF 腿与 basket、期货或其他代理对冲腿。</p></div>
          <div><span>05</span><b>提交申赎</b><p>按 creation unit 向基金申购或赎回，而非逐股交换。</p></div>
          <div><span>06</span><b>改写账本</b><p>基金资产与流通份额同步增加或减少。</p></div>
          <div><span>07</span><b>产生冲击</b><p>ETF 与底层订单共同缩小、重定价或暂时扩大价差。</p></div>
          <div><span>08</span><b>形成下一状态</b><p>新报价、库存、资本占用和风险成为下一轮输入。</p></div>
        </div>
        <p>
          溢价方向通常增加 ETF 份额供给，并买入 creation basket；折价方向通常吸收 ETF 份额，并卖出 redemption basket。于是收敛不必只靠 ETF 价格移动：溢价可由 ETF 下跌、篮子上涨或两者共同完成；折价也可由 ETF 上涨、篮子下跌或共同完成。债券市场尤其重要，因为 ETF 报价可能比单只债券估值更新更快；此时所谓“折价”可能部分是旧 NAV 追赶新的可成交价格，而不是 ETF 偏离真正价值。BIS 对债券 ETF 的机制分析明确展示 AP 行为既可能压缩价差，也可能服务自身 dealer inventory；所以 creation / redemption 流量不是纯粹的误定价传感器。<Cite n={9} />
        </p>
        <div className="precision-note"><span>本节真正解决的问题</span><p>从任意一只交易所交易产品出发，先识别法律结构、资产、份额、篮子与参与者；再在同一时钟下重建 ETF 和底层两腿的可执行价格、成本与容量；最后判断观察到的折溢价究竟来自交易错位、估值滞后、一级市场约束、底层流动性、产品路径依赖，还是多个机制共同作用。</p></div>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围与先修</p>
        <h2>本节以美国开放式 ETF 为制度主轴，但公式先写成通用账本；任何跨法域结论都必须重新核对产品文件。</h2>
        <p>
          硬先修是 T07：知道股票、债券、期货与基金份额代表不同合约；以及 1.11：理解价格发现可能发生在多个相关市场。建议同时回看 1.20，因为 AP 是否执行并不只取决于价差，还取决于融资、haircut、借券、保证金、现金时钟、库存与冲击。本节用美国 Rule 6c-11 解释最常见的开放式 management company ETF，但不会把它冒充全球统一法。香港、欧盟或中国市场的申赎代理、交易时钟、现金替代、税费与披露规范都可能不同；实际操作必须以当地规则、基金 prospectus、statement of additional information（SAI）、AP agreement 与当日 basket file 为准。<Cite n={1} /><Cite n={2} />
        </p>
        <p>
          “套利”在这里也不是承诺利润，而是一组同时或近同时执行的相对价值交易。只有把可成交 bid / ask、数量、费用、融资、结算和尾部失败写入后，才称为可执行套利；仅用收盘价减日终 NAV 得到的图表变量，称为报告折溢价。前者是行为触发量，后者是披露和诊断量。二者可以相关，却不能互换。
        </p>
        <div className="learning-objectives">
          <span>六阶段学习路线 · 先建主线，再读变体</span>
          <ol>
            <li><b>身份与估值（03–10）：</b>先分清产品、主体、两级市场与三只时钟，再比较 NAV、iNAV 与同步可执行价值。</li>
            <li><b>申赎账本（11–18）：</b>闭合 creation / redemption 的资产、份额、报价方向与价值中性条件。</li>
            <li><b>成本与篮子（19–26）：</b>把固定费、cash balance、四张组合清单、custom basket 和 dealer inventory 放进同一执行账本。</li>
            <li><b>容量与反馈（27–36）：</b>解释融资、冲击、结算、AP 网络与两层流动性怎样决定套利带的宽度和稳定性。</li>
            <li><b>产品边界与压力案例（37–44）：</b>用国际、债券、非证券底层及杠杆产品检验模型，再用三个真实压力窗口寻找反例。</li>
            <li><b>研究与练习（45–48）：</b>把完整世界观压缩成可观察、可证伪的测量协议和迁移任务。</li>
          </ol>
          <p><b>时间预算：</b>第一次只读主线 00–21、27–34、42 与 45–48，约 80–95 分钟；第二轮补齐篮子变体、产品边界和其余案例。零背景完整学习建议拆成两次，而不是一次追求“读完”。</p>
        </div>
      </section>

      <section className="lesson-section" id="product-boundary">
        <p className="section-kicker">阶段一 · 身份与估值　|　03 · 产品边界</p>
        <h2>ETF 是法律结构，不是所有带交易代码、追踪资产价格的 ETP 的统称。</h2>
        <div className="table-scroll" role="region" aria-label="四类交易所交易产品的法律与一级市场边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">开放式 ETF、UIT ETF、商品池或信托 ETP 与 ETN 的法律及申赎边界</caption>
            <thead><tr><th scope="col">产品</th><th scope="col">投资者持有什么</th><th scope="col">一级市场核心</th><th scope="col">本节能否直接套用</th></tr></thead>
            <tbody>
              <tr><th scope="row">开放式管理公司 ETF</th><td>注册投资公司的比例份额</td><td>AP 以 basket＋cash balancing amount 交换 creation unit</td><td>本节主模型；美国通常以 Rule 6c-11 为起点</td></tr>
              <tr><th scope="row">Unit investment trust ETF</th><td>单位投资信托权益</td><td>也可有 creation / redemption，但治理与表格规则不同</td><td>经济机制相近，法律细节不可自动继承</td></tr>
              <tr><th scope="row">Commodity pool / grantor trust ETP</th><td>商品池或信托权益</td><td>可能交换期货、现货商品、现金或其他资产</td><td>只可复用通用账本；不能称 Rule 6c-11 ETF</td></tr>
              <tr><th scope="row">Exchange-traded note（ETN）</th><td>发行人的无担保债务</td><td>发行与回购受票据条款控制</td><td>NAV、信用风险和申赎逻辑均不同</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          SEC 的投资者公告明确把 1940 Act 下的开放式 ETF / UIT 与 commodity fund、ETN 等其他 ETP 分开。这个边界会决定投资者究竟拥有资产池份额还是发行人债权，基金是否受投资公司法保护，以及 “NAV” 代表资产账本、指示价值还是票据条款下的参考价值。2020 年 USO 案例尤其容易被误写：USO 是公开上市 commodity pool，不是 Rule 6c-11 下的注册投资公司；它能说明 creation 暂停与估值时钟怎样放大溢价，却不能证明所有 ETF 受同一发行注册限制。<Cite n={3} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="actors-markets">
        <p className="section-kicker">04 · 六类主体</p>
        <h2>基金、AP、做市商与套利者是四种角色；同一机构可以兼任，却不能因此把职责混成一个“ETF 庄家”。</h2>
        <div className="table-scroll" role="region" aria-label="ETF 六类主体的动作、目标与约束，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">ETF sponsor、基金服务机构、AP、做市商、套利者与终端投资者的职责对照</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">控制的动作</th><th scope="col">主要目标与约束</th></tr></thead>
            <tbody>
              <tr><th scope="row">Sponsor / adviser</th><td>设计产品、管理持仓、确定或接受 basket</td><td>追踪 / 投资目标、股东利益、流动性、税务与合规</td></tr>
              <tr><th scope="row">Fund、custodian、transfer agent</th><td>持有资产、保管、过户、计算 NAV、结算申赎</td><td>账本准确、资产安全、订单截止与交付</td></tr>
              <tr><th scope="row">Authorized participant</th><td>直接提交 creation / redemption order</td><td>套利或客户服务利润、库存、融资、操作和资本</td></tr>
              <tr><th scope="row">ETF market maker</th><td>在交易所持续或选择性提供双边报价</td><td>spread 收益、对冲误差、库存和 adverse selection</td></tr>
              <tr><th scope="row">非 AP 套利者 / dealer</th><td>交易 ETF、底层、期货、掉期或相近 ETF</td><td>价差收敛；通常需通过 AP 代理完成一级市场腿</td></tr>
              <tr><th scope="row">终端投资者</th><td>在二级市场买卖单份或任意数量 ETF</td><td>资产配置、流动性、成本、税务与风险暴露</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Rule 6c-11 将 AP 定义为清算机构的会员或参与者，并要求其有书面协议可提交 creation unit 的购买或赎回订单；它没有把 AP 定义为必须持续报价的做市商。行业与监管材料也反复指出，AP 不必是某只 ETF 的做市商，做市商也不必是 AP；非 AP 可以把申赎订单交给 AP 代理。把所有角色都叫“做市商”会让研究者错误地从报价撤退推断申赎通道消失，或从 AP 名单数量推断实际日内流动性。<Cite n={1} /><Cite n={5} /><Cite n={6} />
        </p>
        <div className="model-glossary" aria-label="本节必要术语">
          <article><b>Sponsor / adviser</b><p>产品发起人与投资顾问：前者组织产品，后者按授权管理组合；同一集团可兼任。</p></article>
          <article><b>Custodian / transfer agent</b><p>托管人保管基金资产；过户代理登记份额并协助处理大额申赎。</p></article>
          <article><b>Adverse selection</b><p>逆向选择：报价者担心对手比自己更早掌握会改变价值的信息。</p></article>
          <article><b>NAV strike</b><p>NAV 的正式估值时点；不是期权执行价，也不保证该时点能按 NAV 成交。</p></article>
          <article><b>Cash-in-lieu</b><p>本应交付某项证券时改用现金替代，常伴随额外执行成本或费用。</p></article>
          <article><b>Evaluated price</b><p>对稀疏成交资产按模型和可比信息评出的估值，不等于当下真实 bid。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="two-markets">
        <p className="section-kicker">05 · 两级市场</p>
        <h2>二级市场转移既有份额，一级市场改变份额总数；只有第二种交易直接改写基金资产负债表。</h2>
        <p>
          当甲投资者在交易所把 100 股 ETF 卖给乙，基金没有收到乙的钱，也没有向甲交付底层资产；只是既有份额换了持有人。只有 AP 向基金交付 basket 并取得新 creation unit，或交回 creation unit 并取得 redemption basket 时，基金净资产与流通份额才同步改变。因此，巨大的二级成交量可以没有任何当日净 creation；反过来，一笔客户驱动的大额 creation 也可能先在场外由 AP 组织，未表现为同等的交易所主动买量。SEC 2019 年规则经济分析所引行业调查显示，creation / redemption 只发生在一部分交易日，ETF 大多数成交发生在二级市场；这正是 ETF 份额可以提供一层独立流动性的原因。<Cite n={2} /><Cite n={5} />
        </p>
        <div className="precision-note"><span>不要把“资金流入”当作一笔钱穿过 ETF 流进公司</span><p>净 creation 表示 ETF 份额净增加，并不自动等于同额底层净买盘；in-kind basket 可能来自 AP 已有库存，custom basket 可能不是指数权重，现金 creation 才更可能让基金随后直接交易。研究必须逐层观察订单、库存、篮子和基金成交。</p></div>
      </section>

      <section className="lesson-section" id="three-clocks">
        <p className="section-kicker">06 · 三只时钟</p>
        <h2>ETF 交易时钟、底层资产时钟与基金估值 / 申赎时钟不同步时，一张“收盘折溢价”图会混入机械时差。</h2>
        <p>
          第一只时钟是 ETF 交易所的报价与成交；第二只是每项底层资产、期货与外汇的当地交易和结算；第三只是基金的 NAV strike、basket 发布、订单 cut-off 与最终结算。国内股票 ETF 的三只时钟可能高度重叠，海外股票 ETF 在美国交易时底层市场可能已关闭，商品 ETP 的期货结算又可能早于 ETF 收盘。若把 16:00 的 ETF close 与 14:30 的期货 settlement 直接相减，得到的“溢价”既包含产品需求，也包含 90 分钟的新信息。
        </p>
        <p>
          申赎订单本身还可能在 NAV 未知时提交，之后按 next-calculated NAV 结算；跨境证券交付可因当地假日延长。Rule 6c-11 对含 foreign investment 的 ETF 在特定条件下允许赎回交付延至最迟 15 个日历日，说明“看见价差、今日成交、立即取得每项底层资产”并非通用时序。时钟差越长，AP 需要对冲的不确定区间越长，套利带也越宽。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="fund-balance-sheet">
        <p className="section-kicker">07 · 基金账本与 NAV</p>
        <h2>NAV 是某一估值时点下基金净资产除以已发行份额，不是盘中任何数量都能成交的保证价格。</h2>
        <div className="equation-card">
          <span>每份净资产价值</span>
          <div>NAV<sub>t</sub>=[Σ<sub>i</sub>q<sub>i,t</sub>v<sub>i,t</sub>+Cash<sub>t</sub>−Liabilities<sub>t</sub>]/N<sub>t</sub></div>
          <p>q 是基金持有的资产数量，v 是估值政策在时点 t 采用的价格，Cash 和 Liabilities 以基金计价货币计量，N 是在外流通份额。分子与 NAV 的单位是货币，N 是份额数。公式要求持仓、外汇、应收应付、费用与份额数属于同一估值截面；若底层报价陈旧或使用 fair-value adjustment，NAV 仍是规则化估值，而非无限深度的可执行清算价。</p>
        </div>
        <p>
          假设基金持有市值 2.02 亿元资产、现金 300 万、负债 500 万，共 400 万份，NAV 为 50 元。二级市场买盘把 ETF 推到 50.30 元，不会自动让基金账本多出 0.30×400 万元；只有基金持仓价格、现金、负债或份额数变化，NAV 才变化。反过来，基金管理费、组合换仓成本、股息预提和税费会逐渐进入 NAV，即使 ETF 二级市场一笔交易都没有。这是后文区分 premium、tracking difference 与 spread 的地基。<Cite n={3} /><Cite n={17} /><Cite n={53} />
        </p>
      </section>

      <section className="lesson-section" id="official-premium">
        <p className="section-kicker">08 · 官方折溢价</p>
        <h2>披露口径把同一 NAV 计算时点的市场价格与 NAV 比较；它是有定义的统计量，却不是自动可交易的利润。</h2>
        <div className="equation-card">
          <span>Rule 6c-11 折溢价口径</span>
          <div>d<sub>reported,t</sub>=[P<sub>market,t</sub>−NAV<sub>t</sub>]/NAV<sub>t</sub></div>
          <p>P 是规则定义的官方收盘价；若 NBBO 中点在 NAV 时点更准确反映市场价值，也可采用该中点。d 无量纲：正值称 premium，负值称 discount。NAV 必须非零；当 NAV 接近零，百分比可极大且失去稳定解释。该量没有扣除两腿 spread、费用和冲击，也没有说明 AP 能否按显示价格成交 creation unit。</p>
        </div>
        <p>
          现行规则要求基金网站披露前一营业日 NAV、market price、折溢价、年度 / 季度天数统计、折溢价折线图与过去 30 日 median bid-ask spread；折溢价超过 2% 且持续超过七个连续交易日时，还需说明被合理认为有重大贡献的因素。这些阈值是披露触发，不是“2% 以内无风险、2% 以外一定套利”或价格涨跌限制。研究者应保存 market price 采用 close 还是 NBBO midpoint，以及其时间戳。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="indicative-values">
        <p className="section-kicker">09 · NAV、iNAV、IIV 与 IOPV</p>
        <h2>盘中指示价值是用可得价格更新持仓文件的估计器，不是基金承诺交易的第二个 NAV。</h2>
        <div className="equation-card">
          <span>典型 portfolio-based indicative value</span>
          <div>iNAV<sub>t</sub>=[Σ<sub>i</sub>P<sub>i,t</sub>q<sub>i,d</sub>M<sub>i</sub>FX<sub>i,t</sub>+CashComponent<sub>d</sub>]/N<sub>d</sub></div>
          <p>d 表示先前提供的组合截面，P 是实时、理论或最后可得价格，M 是期货 / 期权乘数，FX 是换算汇率，N 是对应份额数。iNAV、IIV 与 IOPV 常是相近服务名称；具体字段和频率由产品与计算服务决定，不能仅凭代码后缀推断方法。</p>
        </div>
        <p>
          Cboe 的现行计算指南说明其 indicative value 通常约每 15 秒发布，依赖客户提供的日度 portfolio file；停牌时可能采用最后价格，尚未开盘时可能采用前一日收盘，数据不全时也可能保留 stale price。这使它适合作为观察盘中组合估值的参考，却不能保证每项资产此刻可按该价成交。SEC 在 2019 年最终规则中没有保留一项普遍强制 IIV 的拟议条件；NYSE Arca 2026 年一份产品规则备案也明确说明，该文件所述 IIV 虽每 15 秒发布，却不应被视为每日只计算一次的 NAV 的实时更新。后者是特定产品的官方示例，不是所有产品共享的计算承诺。因而“屏幕有 IIV”与“法律上可按 IIV 申赎”都不是正确命题。<Cite n={2} /><Cite n={4} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="synchronized-value">
        <p className="section-kicker">10 · 同步可执行价值</p>
        <h2>判断套利要构造此刻可成交的 basket value；报告折价可由真实交易偏离与估值时钟偏离共同组成。</h2>
        <div className="equation-card">
          <span>价格差的精确分解</span>
          <div>P<sub>ETF,t</sub>−NAV<sub>reported,t</sub>=[P<sub>ETF,t</sub>−V*<sub>t</sub>]+[V*<sub>t</sub>−NAV<sub>reported,t</sub>]</div>
          <p>V* 是同一时点、对应实际 basket 与数量、按可执行或可合理对冲价格估出的每份价值。第一项是 ETF 相对同步价值的交易偏离，第二项是同步价值相对报告 NAV 的时钟 / 估值偏离，三者单位均为每份货币。若分别改用不同分母算百分比，两个百分比不能再机械相加。</p>
        </div>
        <p>
          例如某海外股票 ETF 在美国午盘报 47.20，昨夜当地收盘形成的 NAV 为 49.00，但可交易股指期货和外汇映射出的同步篮子中点只有 47.05。对报告 NAV 是 −3.67% 折价，对同步估值却是约 +0.32% 溢价；贸然买 ETF、卖已经闭市且无法按 49 元成交的底层，并没有锁定 3.67%。V* 也不是“真正价值”的神谕：它依赖可成交深度、对冲基差、模型与时钟，必须报告区间和敏感性，而不只是一个小数点很多的点估计。March 2020 债券 ETF 的经验正说明旧或不可执行的债券 marks 会把价格发现误读为折价。<Cite n={8} /><Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="creation-unit">
        <p className="section-kicker">阶段二 · 申赎账本　|　11 · Creation Unit 与不可分割性</p>
        <h2>一级市场入口不是一股 ETF，而是指定数量的大块份额；固定费用和最小交易单位因此具有强烈的规模效应。</h2>
        <p>
          Creation unit 是基金向 AP 发行、或从 AP 赎回的一组指定 ETF 份额，常见规模可达数万股，但实际数值由产品文件决定。散户持有 37 股不能直接要求基金交付 37 份底层；AP 或其客户必须先聚合到整数 creation units。若一份为 U 股、观察到每股毛价差 g，一级市场固定费用为 F、其余可变成本每股 c，那么一份的税前边际净收益约为 U(g−c)−F。U 越大，固定费用摊薄越充分；但所需篮子、ETF 借券与融资也同步放大。
        </p>
        <div className="equation-card">
          <span>整数容量</span>
          <div>K=⌊min(Capital/R<sub>CU</sub>, Borrow<sub>ETF</sub>/U, BasketCapacity/B<sub>CU</sub>, OperationalLimit)⌋</div>
          <p>K 是可执行 creation units 数，向下取整；Capital 与每份资本占用 R<sub>CU</sub> 用同一货币，Borrow/U 与 BasketCapacity/B<sub>CU</sub> 都先换算成份数。任一资源小于一份即 K=0，即使屏幕上的每股价差为正。</p>
        </div>
      </section>

      <section className="lesson-section" id="ap-option">
        <p className="section-kicker">12 · AP 是权利持有人</p>
        <h2>AP agreement 提供申赎权限，不提供在危机中替全市场接盘的义务。</h2>
        <p>
          AP 可以为自身账户申赎，也可代理做市商、对冲基金或客户；是否行动取决于预期利润、风险和资源。BIS 直接指出 AP 并无法律义务扮演压平价差的角色。SEC 规则只要求有书面协议并保存记录，也没有规定每只基金至少配置多少活跃 AP；2019 年最终规则基于当时 Form N-CEN 数据拒绝设定最低数量。于是“名单上有十家 AP”只说明十家机构具有合同入口，不说明十家此刻都有交易意愿、借券、资本、系统和当日篮子处理能力。<Cite n={1} /><Cite n={2} /><Cite n={9} />
        </p>
        <p>
          这形成一个状态依赖的实物期权：价差扩大提高行权收益，波动、相关性破裂、融资成本、对手方限额和结算风险却同时提高行权成本。正常期价差大一点便吸引多家交易者；压力期同样的名义价差可能仍不足以补偿尾部风险，报价者甚至会先扩大 spread 或退出。因而 AP “step away” 不一定是协调失败，也可能是私人最优、但系统上削弱负反馈的结果。<Cite n={6} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="creation-ledger">
        <p className="section-kicker">13 · Creation 账本</p>
        <h2>实物申购同时增加基金净资产与份额；只有交付价值与新份额对应 NAV 相等时，旧股东才不被稀释。</h2>
        <div className="equation-card">
          <span>一份 creation unit 的状态转移</span>
          <div>Q′=Q+B<sub>C</sub>　；　N′=N+U　；　NAV′=(Q+B<sub>C</sub>)/(N+U)</div>
          <p>Q=A−L 是申购前基金净资产，N 是原份额，U 是新增 creation unit 股数，B<sub>C</sub> 是基金实际收到 basket 加 cash balancing amount、扣除直接归属调整后的价值。若 B<sub>C</sub>=U·Q/N，则 NAV′=Q/N，旧份额与新份额的每份净资产均不变。</p>
        </div>
        <p>
          例如 Q=1.48 亿元、N=400 万股，NAV 为 37 元；AP 交付价值 370 万元的篮子取得 10 万股后，Q′=1.517 亿元、N′=410 万，NAV 仍为 37 元。若篮子因错误估值只值 369.5 万而基金仍发行 10 万股，NAV 会降至约 36.9988 元，微小差额由全部旧股东承受。真实制度用指定 basket、cash balance、fees、估值和 policies 降低这类 value transfer；“in-kind”本身并不神奇地保证无稀释。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="redemption-ledger">
        <p className="section-kicker">14 · Redemption 账本</p>
        <h2>赎回同时减少基金资产与份额；它是把一大块 ETF 份额转换为资产组合，不是基金按交易所价格回购散户。</h2>
        <div className="equation-card">
          <span>一份 redemption unit 的状态转移</span>
          <div>Q′=Q−B<sub>R</sub>　；　N′=N−U　；　NAV′=(Q−B<sub>R</sub>)/(N−U)</div>
          <p>B<sub>R</sub> 是基金交出的 redemption basket 与现金净值，要求 N&gt;U。若 B<sub>R</sub>=U·Q/N，赎回前后 NAV 不变；若交出价值超过对应净资产，留下的股东被稀释，反之可能获得价值。等式只描述基金账本，不包含 AP 在二级市场买 ETF、卖篮子及融资的利润。</p>
        </div>
        <p>
          基金可以交付持仓的代表性切片、非代表 custom basket、现金或混合组合，具体以当日文件和接受政策为准。AP 拿到资产后可能立即卖出，也可能用它满足已有客户订单或修复 dealer inventory；因此 redemption 不必等于同一时刻对全部底层资产的公开市场卖单。债券 ETF 中，这个区别尤其大；Finnerty、Reisel 与 Zhong 对进入实际 creation / redemption baskets 的债券及其后续流动性提供了进一步证据。<Cite n={1} /><Cite n={9} /><Cite n={23} /><Cite n={42} />
        </p>
      </section>

      <section className="lesson-section" id="dilution-neutrality">
        <p className="section-kicker">15 · 价值中性条件</p>
        <h2>一级市场“按 NAV”真正要求的是价值等价，而非篮子必须逐项复制基金或指数。</h2>
        <div className="equation-card">
          <span>旧份额 NAV 的一阶变化</span>
          <div>NAV′−NAV=[B<sub>C</sub>−U·NAV]/(N+U)</div>
          <p>这是 creation 的精确恒等式：新篮子相对 U·NAV 的价值差，被新总份额 N+U 分摊。Redemption 的对应式为 NAV′−NAV=[U·NAV−B<sub>R</sub>]/(N−U)。因此篮子可以非同比例，只要估值、现金平衡和费用使交换对基金价值中性；反过来，一模一样的证券名单若使用错误价格也会转移价值。</p>
        </div>
        <p>
          这解释 Rule 6c-11 为什么把 custom basket 治理放在核心条件：基金必须有书面 policies，规定构造与接受的详细参数、偏离流程和负责审核的岗位。Custom basket 可改善税务、交易、组合与 dealer inventory，却也增加挑选有利资产、估值偏差和关联方利益冲突的空间。监管逻辑不是禁止差异，而是让差异在可复核、以股东利益为标准的过程内发生。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="premium-creation">
        <p className="section-kicker">16 · 溢价方向</p>
        <h2>ETF 过贵时，真正可锁定的是 ETF bid 减去 basket ask 与全成本，而不是 close 减 NAV。</h2>
        <div className="equation-card">
          <span>Creation arbitrage 的可执行利润</span>
          <div>π<sub>C</sub>=U·P<sub>ETF,bid</sub>−C<sub>basket,ask</sub>−F<sub>create</sub>−C<sub>finance</sub>−C<sub>borrow</sub>−C<sub>impact</sub>−C<sub>settle</sub></div>
          <p>所有项都是一整份 creation unit 的同一货币价值。ETF 腿按可卖出的 bid；篮子腿按取得规定数量的真实 ask 和深度；若先卖空 ETF，还要计借券与召回；若不能同步锁定，settle 项应包括基差和失败风险的期望损失。只有风险调整后的 π<sub>C</sub>&gt;0 且容量 K≥1，价差才触发这条回路。</p>
        </div>
        <p>
          典型时序是：交易者买入或对冲 creation basket，同时卖出 / 卖空 ETF；向 AP 通道提交申购；基金收到 basket 后发行 U 股；交易者用新股交付先前 ETF 卖单或补回空头。做市商也可能先 operationally short ETF、随后用 creation 完成交付，但这不是把所有 short interest 或 fail-to-deliver 都归为流动性供给。ETF 卖压与新增供给倾向压低 ETF，篮子买盘倾向抬高底层。若 ETF 无法借到、申购暂停或 cut-off 已过，报告溢价可继续存在。<Cite n={2} /><Cite n={6} /><Cite n={19} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="discount-redemption">
        <p className="section-kicker">17 · 折价方向</p>
        <h2>ETF 过便宜时，交易者要按 ETF ask 买够份额，再按 redemption basket 的真实 bid 处置资产。</h2>
        <div className="equation-card">
          <span>Redemption arbitrage 的可执行利润</span>
          <div>π<sub>R</sub>=C<sub>basket,bid</sub>−U·P<sub>ETF,ask</sub>−F<sub>redeem</sub>−C<sub>finance</sub>−C<sub>short-basket</sub>−C<sub>impact</sub>−C<sub>settle</sub></div>
          <p>ETF 腿按买入 ask，篮子腿按实际收到资产可卖出的 bid；若交易者先卖空篮子以锁价，需计每项 borrow、buy-in 与 corporate action 风险。只有 π<sub>R</sub>&gt;0 且能凑齐 U 股、取得 AP 通道并按时结算，折价才形成可锁定交易。</p>
        </div>
        <p>
          标准时序是买入 ETF、同时卖出或对冲预计收到的 redemption basket、交回 U 股、取得资产后完成交付。ETF 买盘和流通份额减少倾向抬高 ETF，篮子卖盘倾向压低底层，二者共同缩小折价。若 redemption basket 含难卖债券、受限证券或与预期不同的 custom basket，C<sub>basket,bid</sub> 会低于账面估值，折价看起来很大却未必覆盖真实 liquidation cost。Pan 与 Zeng 对债券 ETF 的研究正把 AP inventory 与 redemption basket 流动性置于折价形成中心，而不是假设每项债券都有无摩擦价格。<Cite n={9} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="secondary-arbitrage">
        <p className="section-kicker">18 · 无一级市场的相对价值交易</p>
        <h2>非 AP 也能买便宜、卖昂贵，但它能否退出仍依赖某处最终恢复锚定。</h2>
        <p>
          对冲基金、高频交易者或 dealer 可以在二级市场直接做多 ETF、做空期货或底层篮子，反向亦然，无需当天亲自提交 creation / redemption。若两个价格随后收敛，平掉两腿即可获利；也可把头寸交给 AP 代理申赎。BIS 将这类交易与直接一级市场套利分开，并指出其持有期收益仍取决于一级市场机制最终能消除偏离。若 creation 长期暂停、借券召回、底层停牌或产品将清算，所谓相对价值头寸可能没有可靠终点。<Cite n={9} />
        </p>
        <p>
          这类交易还暴露于 basis risk：ETF 持仓、当日 basket、指数期货和对冲组合不是完全相同，相关性可在压力期断裂。于是“同时买卖”只冻结已成交价格，不会冻结未完全匹配风险的未来价值。研究者应写出 hedge ratio、残余因子、再平衡规则和退出事件，不能把统计共整合直接改称无风险套利。Engle 与 Sarkar、Petajisto 以及 Box 等研究分别从折溢价与日内可执行报价说明，收敛速度和可交易机会本身是待测量变量。<Cite n={19} /><Cite n={21} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="arbitrage-band">
        <p className="section-kicker">阶段三 · 成本与篮子　|　19 · 状态依赖套利带</p>
        <h2>无摩擦模型只有一个锚；真实执行给出的是由两侧 bid / ask 和成本共同决定的区间。</h2>
        <div className="equation-card">
          <span>两条触发不等式</span>
          <div>Creation：P<sub>ETF,bid</sub>&gt;V<sub>basket,ask</sub>+c<sub>C</sub>　；　Redemption：P<sub>ETF,ask</sub>&lt;V<sub>basket,bid</sub>−c<sub>R</sub></div>
          <p>V 是每股 ETF 对应的可执行 basket value，c<sub>C</sub>、c<sub>R</sub> 是将固定费用按可执行 unit 数摊薄后，加上融资、借券、冲击、税务、操作与风险资本的每股成本。若两式均不成立，当前 quote 位于交易者的 no-trade region；这不是法律保证的价格边界，而是给定主体、数量和状态下的执行阈值。</p>
        </div>
        <div className="equation-card">
          <span>教学用中点近似带</span>
          <div>P<sub>ETF</sub>∈[V<sub>basket,bid</sub>−c<sub>R</sub>, V<sub>basket,ask</sub>+c<sub>C</sub>]</div>
          <p>只有在 ETF quote 很窄、以一个代表价格概括时才使用这条简写。严格交易判断必须回到上一式：creation 收到 ETF bid，redemption 支付 ETF ask。篮子越难交易、波动越高、creation unit 越大或资本越稀缺，区间越宽。</p>
        </div>
        <p>
          因而没有一条适用于所有 ETF 的有限“最大折溢价”。若 NAV 接近零，百分比本身可爆炸；若底层不能交易、creation 被暂停、ETF 无券可借或市场关闭，正常套利通道可能没有有限容量。平静期历史分位数可以描述常态，却不能当作危机期硬边界。Hilliard 与 Piccotti 的模型和实证都把交易成本、离散申赎与价格发现纳入折溢价，而非强行设 P= NAV。<Cite n={28} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="fixed-costs">
        <p className="section-kicker">20 · 固定费用与 Unit Lumpiness</p>
        <h2>同样每股价差，对一份整数 unit 可盈利，对半份却可能根本没有一级市场动作。</h2>
        <div className="equation-card">
          <span>单份与多份的成本摊薄</span>
          <div>π(k)=kU·g−kU·c<sub>var</sub>−F(k)　；　k∈{'{'}0,1,2,…{'}'}</div>
          <p>g 是每股毛价差，c<sub>var</sub> 是每股可变成本，F(k) 是订单、transfer、custody 或基金层固定 / 分段费用。若一笔固定费可覆盖多个 units，平均成本 F(k)/(kU) 随 k 下降；若 market impact 随数量凸增，规模扩大后总成本又可能上升。</p>
        </div>
        <p>
          例如 U=50,000、每股毛价差 0.09、可变成本 0.035、每单固定费 3,200 元，则一份毛收益 4,500、扣可变成本 1,750 后只剩 2,750，不足固定费，k=1 不执行；若两份仍只收一笔固定费，净收益变为 2×2,750−3,200=2,300 元。但这并不保证应做两份，因为第二份可能穿透更差的篮子 ask 或 ETF bid。最优数量来自离散 units 与非线性深度的联合优化，而不是价差除以一项平均成本。
        </p>
      </section>

      <section className="lesson-section" id="cash-balancing">
        <p className="section-kicker">21 · Basket Quote 与 Cash Balancing Amount</p>
        <h2>证券篮子价值不必恰好等于 creation unit NAV；现金平衡项负责连接离散证券数量、应计项目与基金净值。</h2>
        <div className="equation-card">
          <span>一份申购交换价值</span>
          <div>BasketExchangeValue=Σ<sub>i</sub>q<sub>i</sub>P<sub>i</sub>FX<sub>i</sub>+CashBalancingAmount+OtherValueAdjustments</div>
          <p>证券数量 q 往往按整股、面值或合约单位给定，无法连续调整到恰好 U·NAV；现金平衡项补足篮子价值与 creation unit 净值之间的差，也可反映应计股息、利息和其他项目。Rule 6c-11 将它明确界定为用于解释两者价值差的现金金额。Transaction fee 另列：在 AP 利润账本中是成本；在基金价值中性检验里，应按基金实际收到的费用减去其承担的直接交易成本计算，不能预先假定统一正负号。</p>
        </div>
        <p>
          交易者不能只下载证券名单后用 midpoint 相加。真正的 creation cost 要按每项可买数量穿过 ask 和深度，加入 FX hedge、应计、cash-in-lieu、税费与基金当日 transaction fee；redemption value 则按收到资产的 bid 和可处置性计算。同一 basket 的“会计价值”“基金接受价值”“AP 获取成本”和“即时清算价值”可以不同，研究必须给每个数加标签。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="four-portfolios">
        <p className="section-kicker">22 · 四张不同清单</p>
        <h2>指数成分、基金实际持仓、creation basket 与 redemption basket 是四个对象；把它们视为同一组合会制造虚假套利。</h2>
        <div className="table-scroll" role="region" aria-label="指数、持仓、申购篮子与赎回篮子的用途和差异，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Benchmark index、基金实际持仓、creation basket 与 redemption basket 对照</caption>
            <thead><tr><th scope="col">清单</th><th scope="col">作用</th><th scope="col">为何可能不同</th></tr></thead>
            <tbody>
              <tr><th scope="row">Benchmark index</th><td>定义被追踪的规则化回报目标</td><td>指数不持有现金、不支付基金费用，成分变化也有生效时点</td></tr>
              <tr><th scope="row">Portfolio holdings</th><td>构成基金 NAV 的实际资产与负债</td><td>抽样复制、现金、衍生品、应收应付、公司行动与换仓</td></tr>
              <tr><th scope="row">Creation basket</th><td>AP 为取得新份额交付的组合</td><td>代表性子集、custom basket、易取得证券、现金替代</td></tr>
              <tr><th scope="row">Redemption basket</th><td>AP 交回份额后收到的组合</td><td>税基管理、流动性、maturity、dealer inventory 与风险治理</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一只抽样复制的债券 ETF 可能追踪数千只债券的指数，实际只持有其中一部分；当日 creation basket 又只含可取得的代表性债券，redemption basket 可能倾向即将到期或 dealer 有需求的券。此时买“指数”并不能完成 creation，卖指数期货也不完全对冲收到的 redemption basket。Brogaard、Heath 与 Huang 对被动组合管理的研究表明，抽样本身就是 tracking cost 与执行成本之间的优化问题；BIS 则说明 basket–holdings wedge 会减弱 AP 订单对每只底层债券的直接压力，同时让申赎成为基金与 dealer 双方的库存管理工具。<Cite n={9} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="custom-baskets">
        <p className="section-kicker">23 · Custom Basket</p>
        <h2>定制篮子把“机械复制”变成受治理的组合交换，可提升效率，也把估值和利益冲突带进一级市场。</h2>
        <p>
          Rule 6c-11 把 custom basket 定义为非代表性持仓选择，或与同日最初代表性篮子不同的代表篮子。基金可用它处理难买证券、流动性、税基、公司行动、组合迁移和 AP inventory；AP 也可提出更容易交付或更符合客户流量的证券。若替代资产保持风险和价值，交易成本可能低于强迫所有 AP 追逐同一 illiquid bond，最终有利于基金股东。<Cite n={1} /><Cite n={2} /><Cite n={9} />
        </p>
        <p>
          风险在于基金可能接收过高估值或不合适资产，或向特定 AP 提供更有利的篮子。现行规则因此要求书面参数、偏离流程、岗位审核与逐篮子五年记录，而不是仅在网站发布一张示意篮子。Koont 等进一步把篮子设计放进中介资产负债表与风险转移框架：篮子并非被动披露，而可能是基金与 dealer 交换库存的工具。研究 custom basket 应比较实际交换、基金持仓变化、估值和后续交易；从 public daily basket 看不到全部已接受 custom baskets，便不能断言基金只按那一张清单操作。<Cite n={1} /><Cite n={2} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="in-kind">
        <p className="section-kicker">24 · In-Kind Creation / Redemption</p>
        <h2>实物申赎把组合交易和一部分交易成本放在 AP 账本上，从而减少基金为每次流量主动买卖资产的需要。</h2>
        <p>
          Creation 时 AP 交付证券、资产或其他 positions，基金发行份额；redemption 时方向相反。若交付组合已经符合目标持仓，基金无需先收现金再逐项买入，也不必为赎回先出售证券筹钱。交易成本主要进入 AP 的套利报价和申赎费用，未参与交易的股东较少承担流量冲击。Poterba 与 Shoven 早期比较 ETF 与共同基金的税后结构，后续研究则强调这种成本外部化是 ETF 与传统开放式现金申赎基金的重要差异。<Cite n={18} />
        </p>
        <p>
          但 in-kind 不等于“没有市场交易”。AP 为构建 basket 可能买入底层，收到 basket 后也可能卖出；custom basket 还会改变成交位置与时间。它也不自动免税、免 spread 或免冲击：税务取决于法域和产品，证券转移有 custody / settlement 成本，难交付资产仍需 cash substitution。正确命题是“交易选择权和成本归属改变”，而不是“成本消失”。
        </p>
      </section>

      <section className="lesson-section" id="cash-hybrid">
        <p className="section-kicker">25 · Cash 与 Hybrid 申赎</p>
        <h2>现金申赎把组合执行交回基金或其代理，因此价差、现金替代费与股东稀释风险必须一起看。</h2>
        <p>
          Cash creation 中 AP 交现金，基金再买资产；cash redemption 中基金交现金，可能需要出售资产。Hybrid basket 则混合证券与现金。现金形式适合无法实物转移、受限、零碎或衍生品资产，也可降低 AP 取得特定证券的困难；代价是基金承担真实执行与市场冲击。合理的 transaction fee / variable charge 应把预期成本归到发起申赎者，否则现有股东可能为新流量买单。<Cite n={2} /><Cite n={3} />
        </p>
        <p>
          对套利者而言，cash amount 往往按 NAV 和最终基金执行确定，而提交订单时仍有不确定性；它需要用期货、掉期或代理篮子 hedge，留下 tracking basis。2025 年 SEC 批准一批 crypto asset ETP 使用 in-kind creation / redemption，并明确这是相对最初 spot bitcoin 与 ether ETP 仅 cash 模式的改变；这个当前事实说明申赎形式是产品与批准条件，不应从“加密 ETP”类别一概推断。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-hedge">
        <p className="section-kicker">26 · AP Inventory 与 Hedge</p>
        <h2>申赎可以是套利闭环，也可以是 dealer 在客户流、库存与资产负债表之间换形。</h2>
        <p>
          假设客户持续买 ETF，做市商先卖出库存或尚未创建的份额，库存变短后再买 basket 并 creation 补回；creation 时间可能晚于客户成交。另一情形是 bond dealer 收到客户抛售的债券，便把这些债券放入 creation basket 换成更易交易的 ETF 份额，以减少单券库存；即使 ETF 没有显著溢价，申购仍有库存价值。Pan 与 Zeng、BIS 都强调 AP 作为主要 bond dealer 的双重身份会改变 creation / redemption 目的；Evans、Moussawi、Pagano 与 Sedunov 对 operational shorting 的研究则直接说明，客户流与非同期的后续 creation 可以由份额库存连接。<Cite n={9} /><Cite n={23} /><Cite n={45} />
        </p>
        <p>
          因而观察到 creation 并不能独立证明 ETF 被高估，redemption 也不能独立证明 ETF 被低估。Brown、Davies 与 Ringgenberg 把 creation / redemption activity 作为非基本面需求信号研究，恰好说明 flow 可以承载需求信息，却不自动识别某一笔做市库存或误价套利。识别需要把申赎时点与 ETF–basket executable gap、dealer inventory、客户流、篮子构成和随后价格调整相连；若只用日度 net flows 回归未来回报，系数可能混合套利、需求、库存、基金换仓与信息交易。<Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="balance-sheet-constraints">
        <p className="section-kicker">阶段四 · 容量与反馈　|　27 · 融资、借券与资本</p>
        <h2>价差越大通常越想套利；但波动上升也会同时扩大保证金、haircut、借券和风险资本，使可做数量反而下降。</h2>
        <div className="equation-card">
          <span>状态依赖可执行容量</span>
          <div>q*<sub>t</sub>=min(q<sub>profit</sub>, q<sub>funding</sub>, q<sub>borrow</sub>, q<sub>inventory</sub>, q<sub>risk</sub>, q<sub>basket</sub>, q<sub>settlement</sub>)</div>
          <p>各 q 都先换算为 ETF 份额或 creation units；任何一项为零，总容量即为零。q<sub>profit</sub> 是价差覆盖边际成本的数量，其他项分别受现金 / repo、ETF 或底层借券、dealer 库存、VaR / capital、可取得篮子和操作结算限制。</p>
        </div>
        <p>
          这正是 1.20 的接口。Creation arbitrage 若先卖空 ETF，需要借券和 short margin；买 basket 需要现金或 repo，未结算期间占用资产负债表。Redemption arbitrage 若先做空多项底层，需逐项 borrow；收到 illiquid basket 后也可能占库存。压力期 volatility、haircut、spread 与 correlation risk 常一同上升，所以名义折溢价扩大不必意味着实际利润扩大。受限套利理论从 Shleifer–Vishny 到 ETF 专门研究，都提醒“看见误价的人”未必拥有在错误最深时扩表的资本；Raddatz 对 AP 资产负债表渠道的证据进一步表明，约束会沿其服务的 ETF 网络传递。<Cite n={21} /><Cite n={22} /><Cite n={32} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="two-sided-impact">
        <p className="section-kicker">28 · 两腿 Price Impact</p>
        <h2>套利者不是在两条外生价格线上取钱；它的订单本身会移动 ETF 与 basket，利润随数量递减。</h2>
        <div className="equation-card">
          <span>局部溢价收敛</span>
          <div>g(q)=g<sub>0</sub>−I<sub>ETF,sell</sub>(q)−I<sub>basket,buy</sub>(q)−c(q)</div>
          <p>g<sub>0</sub> 是交易前 ETF 相对 basket 的每股可执行溢价；I 分别是卖 ETF 和买 basket 对两边价格差的收敛贡献，c 是其他边际成本，均以每股货币计。最优 q 停在边际 g(q)=0、整数 unit 边界或容量约束，而不是把初始价差乘无限数量。</p>
        </div>
        <p>
          若 ETF 很深而底层浅，creation 主要通过篮子上涨缩小溢价；若底层由活跃期货高效定价而 ETF 浅，ETF 卖压承担更多收敛。债券 ETF 压力期甚至可能由 ETF 先发现价格，篮子 marks 随后下修。Da 与 Shive、Ben-David 等关于 ETF 活动、共动和波动的研究提示，这条连接不仅传递信息，也会把非基本面流量投射到底层；Shim 与 Todorov 则表明，债券 ETF 使用局部篮子和 dealer inventory buffer 时，份额流量不会机械地一比一落到全部持仓。方向与经济量必须依据真实 basket、对冲和冲击估计，而不能仅以 ETF ownership 推断。<Cite n={25} /><Cite n={26} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="settlement-risk">
        <p className="section-kicker">29 · Settlement、Custody 与 Fail Risk</p>
        <h2>账面毛差在 t 时点可见，真正闭环却要跨越订单截止、清算、跨境交付和失败补救。</h2>
        <div className="equation-card">
          <span>含失败状态的期望利润</span>
          <div>E[π]=p<sub>ok</sub>π<sub>closed</sub>−(1−p<sub>ok</sub>)L<sub>fail</sub>−CapitalCharge·Δt</div>
          <p>p<sub>ok</sub> 是所有腿按合同结算的概率，π<sub>closed</sub> 是成功闭环后的利润，L<sub>fail</sub> 包括 buy-in、replacement cost、罚金、borrow recall、基差与法律争议损失，CapitalCharge·Δt 是未结算期间的资本时间成本。单位均为一笔订单的货币价值。</p>
        </div>
        <p>
          跨国证券、公司行动、市场假日、受限资产、失败交付和 custodian cut-off 会让某一腿晚于另一腿；AP 即使锁住期货，也可能无法完全锁住 cash security basis。Rule 6c-11 的 foreign investment 交付延长和五年 recordkeeping 要求，恰好说明一级市场是法律与操作流程，不是一个瞬时公式。真实套利系统需要订单状态机：submitted、accepted、priced、matched、delivered、failed、cured，而不是只有 trade date 和最终 net shares。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-stability">
        <p className="section-kicker">30 · 负反馈与稳定条件</p>
        <h2>Creation / redemption 通常提供负反馈，但反馈过慢、容量不足或对冲冲击反向时，价差会持续甚至振荡。</h2>
        <div className="equation-card">
          <span>距套利带边界的局部递推</span>
          <div>x<sub>t+1</sub>≈(1−κα)x<sub>t</sub>+ε<sub>t</sub></div>
          <p>x 是价差越过最近执行边界的距离，α 是交易者对一单位越界的申赎 / 套利数量响应，κ 是两腿合计每单位订单使价差收敛的价格反应，ε 是新需求、信息和估值冲击。在局部线性、参数短期固定且方向正确的教学模型中，0&lt;κα&lt;2 才收敛；κα 接近 0 表示反馈太弱，κα&gt;1 可出现过冲，κα≥2 则线性系统不稳定。</p>
        </div>
        <p>
          这不是拿公开数据直接估出的结构定律，而是一张诊断图。α 会因资本、borrow、unit 和 cut-off 断崖式改变；κ 会因深度与市场开闭变化；ε 还可能与 AP 行为相关。稳定器包括多家独立 AP、替代对冲、透明持仓、可靠估值、充足借券和深度；放大器包括共同风险限额、同质篮子、集中 AP、交易暂停和底层停牌。于是一级市场是通常有效的纠偏机制，却不是任何状态都拥有相同增益的自动控制器。<Cite n={2} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="two-liquidity-layers">
        <p className="section-kicker">31 · 两层流动性</p>
        <h2>ETF 成交量描述份额转手能力，底层篮子流动性决定大额申赎的最终边际成本；两层既相连又不能相加。</h2>
        <p>
          小额投资者通常只使用 ETF 二级 order book，其交易可由另一投资者或做市商库存吸收，不必触碰底层。大额持续单边流若耗尽库存，做市商才通过 AP creation / redemption 把压力传到底层。因此 ETF 的“屏幕流动性”可在一段时间内高于单项底层；但长期可扩展容量仍受 basket 执行约束。用 ETF ADV 加所有成分股 ADV 会重复计算两个不同层的容量，也忽略组合同时交易的相关冲击。
        </p>
        <p>
          BIS 对样本的估计显示，债券 ETF 持仓证券的 bid-ask spreads 平均约为 ETF 份额 spread 的 17 倍，而股票 ETF 对应比率约为 5 倍；这是一项特定样本统计，不是每只产品固定倍数。它支持“ETF 份额可成为较易交易的价格发现层”，却不证明 ETF 制造了无成本流动性。Khomyn、Putniņš 与 Zoican 研究的是追踪同一指数的 ETF 如何因二级流动性产生客户分层、费用租金与先发优势；这支持“份额层本身存在有经济价值的异质性”，但不直接检验 basket liquidation cost。底层成本在压力期通过更宽 ETF quote、更大折价或更低套利容量返回的命题，仍由债券篮子与 AP 证据支持。<Cite n={9} /><Cite n={46} />
        </p>
      </section>

      <section className="lesson-section" id="ap-network">
        <p className="section-kicker">32 · AP 网络与集中度</p>
        <h2>合同 AP 数、活跃 AP 数和真正独立的风险资本数是三种网络宽度。</h2>
        <p>
          一只基金可能与很多 AP 签约，只有少数当年真正申赎；多个 AP 又可能依赖同一家 custodian、clearing member、borrow source 或相同风险模型。SEC 2019 年经济分析基于当时数据报告，中位 ETF 有 23 份 AP agreements、4 家 active APs；大基金通常更多，小基金更少。该历史截面不能当作 2026 年当前行业数字，也不能从“四家”推导失灵概率，却说明名单与活跃度必须分开。<Cite n={2} />
        </p>
        <p>
          集中度有两面：专业 AP 与 sponsor 的长期关系可降低操作成本、支持 custom baskets；共同 shock 却可能让多家名义 AP 同时减少容量。合适指标包括 active AP share、最大一家申赎占比、替代 AP 上线时间、共同融资 / 清算节点、每家到资本限额距离，以及 step-away 后 ETF spread、折溢价与 creation latency 的变化。只有“AP 数量”而无容量与依赖网络，无法判断韧性。<Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="flow-measurement">
        <p className="section-kicker">33 · Primary Flow 测量</p>
        <h2>Shares outstanding 的变化识别净申赎，却看不到 gross 双向活动、代理关系和篮子真实成交。</h2>
        <div className="equation-card">
          <span>份额存量与一级流量</span>
          <div>N<sub>t</sub>−N<sub>t−1</sub>=U·(Creations<sub>t</sub>−Redemptions<sub>t</sub>)+OtherAdjustments<sub>t</sub></div>
          <p>左边是流通份额存量变化，右边是整数 units 的净额和 split、merger 等调整。若同日 creation 20 units、redemption 18 units，净份额只显示 +2，却掩盖 38 units 的 gross 操作和可能很大的 basket turnover。</p>
        </div>
        <p>
          资金流数据库常用 Δshares×NAV 近似净 creation value，这适合规模描述，却不是现金流、投资者需求或底层净买盘的直接观测。In-kind 交换没有同额现金进入基金；AP 可能代理客户；净额还会抹掉双向申赎。研究至少保存 gross creates、gross redeems、unit size、basket IDs、cash / in-kind、AP identity、order / acceptance / settlement timestamps 和基金之后的真实交易。若拿不到，只能把估计称为 implied net primary flow。<Cite n={2} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="four-metrics">
        <p className="section-kicker">34 · 四种误差</p>
        <h2>Premium、bid-ask spread、tracking difference 与 tracking error 分别回答价格层、交易层和回报层的问题。</h2>
        <div className="table-scroll" role="region" aria-label="折溢价、报价价差、跟踪差异与跟踪误差的定义和用途，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Premium、bid-ask spread、tracking difference 与 tracking error 对照</caption>
            <thead><tr><th scope="col">指标</th><th scope="col">最小定义</th><th scope="col">回答的问题</th></tr></thead>
            <tbody>
              <tr><th scope="row">Premium / discount</th><td>(Market price−NAV)/NAV</td><td>同一披露时点市场价偏离基金 NAV 多少</td></tr>
              <tr><th scope="row">Relative spread</th><td>(Ask−Bid)/Mid</td><td>立即买入再卖出的报价摩擦有多大</td></tr>
              <tr><th scope="row">Tracking difference</th><td>R<sub>fund,NAV</sub>−R<sub>benchmark</sub></td><td>给定期间基金净值回报落后 / 领先目标多少</td></tr>
              <tr><th scope="row">Tracking error</th><td>SD(R<sub>fund,NAV</sub>−R<sub>benchmark</sub>)</td><td>主动差回报随时间有多不稳定</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一只 ETF 可以零折价但 spread 很宽，也可以 spread 很窄却因 NAV 时钟陈旧显示大折价；管理费会造成稳定负 tracking difference，却未必产生高 tracking error；抽样复制或换仓则可能提高 tracking error。套利机制主要约束市场价相对可执行组合价值，不会消除基金费用、税、现金拖累或指数复制误差。Elton 等对 SPDR 的早期研究和 Lettau–Madhavan 的综述都说明，只有把这几个层次分开，才不会把产品管理表现误写成市场微观结构失灵。<Cite n={17} /><Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="securities-lending">
        <p className="section-kicker">35 · Securities Lending 的两本账</p>
        <h2>基金把持仓借出去取得收入，与套利者借 ETF 或底层建立空头，是两条方向相反但可能相连的借券链。</h2>
        <div className="equation-card">
          <span>两侧借券净额</span>
          <div>Income<sub>fund</sub>=Fee<sub>gross</sub>−AgentShare−Costs−Losses　；　Cost<sub>arb</sub>=BorrowFee+RecallRisk+BuyInRisk</div>
          <p>第一式进入基金 NAV 和 tracking difference，第二式进入 creation / redemption 套利成本；两者的证券、期限、借款人和分成可以不同，不能相减成一个“ETF 借券收益”。抵押品收益、税务和违约处理还依赖合同与法域。</p>
        </div>
        <p>
          基金证券出借可部分抵消管理费，却带来 borrower default、collateral reinvestment、召回和投票权等风险。套利者在溢价方向可能借 ETF 先卖，在折价方向可能逐项借底层先卖；hard-to-borrow fee 上升或 recall 会直接扩大套利带。Karmaziene 与 Sokolovski 研究 ETF shorting 对成分股流动性的替代渠道，Katagiri 等研究基金持仓进入证券借贷供给；两者都提醒经济方向必须看谁借了哪种证券：基金出借底层增加可借供给，AP 借 ETF 则是另一市场的需求。<Cite n={34} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="tax-mechanism">
        <p className="section-kicker">36 · 美国 In-Kind 税务机制</p>
        <h2>美国 ETF 的税务效率来自特定基金资格、实物赎回与税基选择的组合，不是“ETF 永不交税”。</h2>
        <p>
          对符合条件的美国 regulated investment company（RIC），26 U.S.C. §852(b)(6) 规定，在股东要求赎回基金股份时，Section 311(b) 不适用于相应分配。实务上，ETF 可在 in-kind redemption 中交付内含未实现升值、低税基证券，而不必像先在基金内出售那样确认同一基金层资本利得；剩余股东未来收到资本利得分配的概率因而可能下降。Poterba–Shoven 与后续研究将其视为美国 ETF 税后效率的重要来源。<Cite n={14} /><Cite n={18} />
        </p>
        <p>
          边界至少有四层：法规只对适用基金和交易生效；AP 收到资产后的出售有自己的税务；二级市场投资者出售 ETF 仍可能产生应税资本利得；现金赎回、衍生品、商品池、grantor trust、UIT、退休账户和非美国投资者规则均不同。基金选择低税基证券也要满足 basket policy、估值与股东利益。Moussawi、Shen 与 Velthuis 的实证研究把 ETF 的资本利得管理进一步连接到赎回篮子的税基选择，但这种平均机制不能替代对具体产品和投资者税务的判断。正确表述是“某些美国 in-kind 赎回可减少基金层实现利得与分配”，而不是把 tax efficiency 解释为法律保证或 NAV 套利利润。<Cite n={3} /><Cite n={14} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="international-etfs">
        <p className="section-kicker">阶段五 · 产品边界与压力案例　|　37 · International ETF</p>
        <h2>底层市场闭市后，ETF 不只是偏离旧 NAV；它还可能成为仍在交易的新信息和外汇风险的价格发现地点。</h2>
        <div className="equation-card">
          <span>跨境同步价值的最小更新</span>
          <div>V*<sub>t</sub>≈NAV<sub>d</sub>+β<sub>F</sub>ΔFutures<sub>t</sub>+β<sub>FX</sub>ΔFX<sub>t</sub>+β<sub>ADR</sub>ΔADR<sub>t</sub>−ExpectedCosts</div>
          <p>NAV<sub>d</sub> 是底层最近可得估值，期货、汇率和 ADR 是仍在交易的代理；β 必须用事前数据或结构头寸估计，单位经换算后均为每份基金货币。公式给的是 model-implied V*，不是保证可交付的 basket liquidation value。</p>
        </div>
        <p>
          若当地市场在美国 ETF 开盘前已关闭，AP 可能用指数期货、跨上市股票和 FX hedge 管理隔夜风险，待底层重开后完成 basket；hedge basis、当地涨跌停、资本管制、税、假日和 T+结算都会进入成本。Engle–Sarkar 与 Ackert–Tian 等研究发现国际 ETF 折溢价与交易时钟、资产类别和套利限制相关；不能把大报告折价自动解释成“免费买一篮子已知价值的股票”。<Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="bond-etfs">
        <p className="section-kicker">38 · Bond ETF</p>
        <h2>债券 ETF 的份额可以比单券更易交易；这既支持价格发现，也让 NAV、篮子和 dealer inventory 之间出现更大楔子。</h2>
        <p>
          企业债多在 dealer-intermediated OTC 市场交易，单券成交稀疏、最小面额大、期限会缩短、同一发行人也有多个券。基金 NAV 常依赖 evaluated prices，而 creation / redemption basket 只能选择有限且可交付的证券。AP 本身又常是 bond dealer，会用 custom basket 管理客户库存。于是 ETF 折价可能同时包含底层 marks 滞后、预期清算成本、redemption basket 风险、dealer 资产负债表约束与真正 ETF 卖压。<Cite n={6} /><Cite n={9} /><Cite n={23} />
        </p>
        <p>
          这也推翻一个常见直觉：ETF 价格低于 NAV 不必证明 ETF 结构“失灵”；如果 ETF 份额连续成交而单券估值没有真实 bid，ETF 可能先反映可执行 liquidation value。反方向同样不能绝对化：折价也可能含流动性超调、AP inventory 成本或篮子选择问题。Dannhauser 发现 ETF 在公司债定价中具有信息作用，Pan–Zeng 与 BIS 强调篮子和 dealer incentives；Aramonte 与 Avalos 则从压力期的 ETF–底层流动性关系讨论潜在脆弱性。需要把价格发现、库存缓冲与受限套利作为可竞争解释，而不是二选一口号。<Cite n={9} /><Cite n={24} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="commodity-crypto-etps">
        <p className="section-kicker">39 · 非证券底层 ETP 的套利锚</p>
        <h2>期货型商品池与现货加密信托虽都在交易所形成份额价格，其可交换资产、NAV 和套利边界仍由底层合约与法律结构决定。</h2>
        <p>
          Futures-based ETP 的资产可能主要是期货保证金、现金和短期证券；其回报取决于期货曲线、每日盯市与 roll，而不是现货价格本身。Creation 增加基金规模时，产品可能要建立更多期货 exposure，碰到 exchange / CFTC position limits、FCM margin、可交易月份和风险限额；若无法按目标持仓扩张，sponsor 可改篮子、改变 benchmark exposure、暂停 creation 或拒绝订单。此时溢价约束与产品 tracking mechanism 同时变化。
        </p>
        <p>
          Spot crypto ETP 还涉及合格 custodian、交易场所、资产转移与现金 / in-kind 模式。SEC 2025 年批准若干 crypto ETP 采用 in-kind，并不把这些 ETP 变成 Rule 6c-11 开放式基金，也不保证所有未来产品同样获批。分析任何商品或加密产品应先读法律结构和当期 order：投资者拥有 pool / trust interest 还是债权，AP 交付现金还是资产，NAV 用哪一市场和时点，creation 是否开放。<Cite n={3} /><Cite n={11} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="leveraged-etfs">
        <p className="section-kicker">40 · Leveraged / Inverse ETF</p>
        <h2>每日杠杆 ETF 的申赎套利约束份额价格，却不会把多日回报变成指数累计回报的固定倍数。</h2>
        <div className="equation-card">
          <span>每日目标的复利路径</span>
          <div>V<sub>T</sub>=V<sub>0</sub>∏<sub>t=1</sub><sup>T</sup>[1+Lr<sub>t</sub>−f<sub>t</sub>]</div>
          <p>L 是产品声明的每日倍数，r<sub>t</sub> 是标的当日回报，f<sub>t</sub> 汇总费用、融资和当日跟踪偏差。除 T=1 或特殊路径外，该乘积不等于 1+L[(Index<sub>T</sub>/Index<sub>0</sub>)−1]。方向交替可产生 volatility drag，持续趋势也可能产生超出简单倍数的复利。</p>
        </div>
        <p>
          为维持每日目标，基金通常在收盘附近按 NAV 和当日市场变动重置 swaps、futures 或其他 exposure；资产增长、申赎与市场回报共同决定 rebalance flow。Avellaneda–Zhang 与 Charupat–Miu 分别从连续复利和离散回报路径刻画这种长期偏离，但它们并没有把产品未来回报变成只由“波动率”决定的确定公式。AP 仍可在份额与 creation / redemption value 之间套利，却不能套利掉产品目标本身的路径依赖。美国现行 Rule 6c-11 并非沿用 2019 年最初对 leveraged / inverse ETF 的静态排除文本；经 2020 年衍生品规则修订，现行 §270.6c-11(c)(4) 要求这类产品遵守适用的 Rule 18f-4。投资者适用性与多日风险仍应依据当前 prospectus 和监管资料。<Cite n={1} /><Cite n={15} /><Cite n={16} /><Cite n={29} /><Cite n={40} /><Cite n={54} />
        </p>
      </section>

      <section className="lesson-section" id="market-linkage">
        <p className="section-kicker">41 · 多产品与跨市场连接</p>
        <h2>同一风险可以由 ETF、期货、现金篮子和相近 ETF 同时定价；套利把局部订单变成网络冲击。</h2>
        <p>
          一只 broad-market ETF 出现买压，做市商可用 index futures 立即 hedge，之后以 creation basket 换回份额；期货先响应、ETF 随后调价、现金成分股在申购执行时接收买盘。若两只 ETF 持有大量共同证券，交易者还会卖昂贵 ETF、买便宜 ETF，并以共同因子或 residual basket 对冲。于是价格发现的领先市场会随交易时段、深度、费用和新闻类型变化，不存在永远由 NAV 单向锚定 ETF 的固定层级。<Cite n={31} /><Cite n={38} />
        </p>
        <p>
          网络也产生外部性：同质 ETF 调仓、申赎和对冲可把指数层需求投射到同一成分股，增加共动；另一方面，多条替代路径又能分散单一 AP 或单一产品失灵。Da–Shive、Israeli 等研究对 ETF ownership、共动、流动性和价格效率提出了不同证据，Bhattacharya 与 O’Hara 则从市场分割和信息连接角度给出理论框架；识别上必须处理内生产品选择与共同需求。这里输出的是传导图，后续 4.24 才系统研究跨市场 linkage。<Cite n={26} /><Cite n={27} /><Cite n={33} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="case-2015">
        <p className="section-kicker">42 · 案例一：2015-08-24</p>
        <h2>开盘价格发现、交易暂停和流动性撤退可以在几分钟内让相似股票 ETF 出现完全不同的路径。</h2>
        <p>
          SEC staff 对 2015 年 8 月 24 日美国市场的事后研究报告：在 499 只美国股票 ETP 中，41.9% 至少经历一次 limit up–limit down（LULD）暂停，日内 high–low range 的均值为 19.2%；在全部 ETP 中，19.2% 当日下跌至少 20%，相比之下 corporate stocks 为 4.7%。这些是该日特定样本的描述统计，不是“ETF 平时有 41.9% 概率停牌”。<Cite n={7} />
        </p>
        <p>
          同一报告显示，SPY 在 9:37 前相对 NAV 有溢价；IVV 则相对 SPY、E-mini 和 SPY NAV 出现显著折价直到约 9:43；QQQ 也有显著折价直到约 9:37。大量成分股延迟开盘，ETF 与底层 LULD / reopening 流程、极低开盘深度和 market order imbalance 共同使可执行 basket value 与 hedge 变得不确定。教训不是“creation mechanism 永久失效”，而是当底层价格尚未形成、交易暂停切断两腿、做市者难以估值时，α 和 κ 会短时塌缩；正常套利回路在价格发现和市场开放恢复后才重新工作。报告本身不能把每一异常成交唯一归因于 AP step-away。<Cite n={7} /><Cite n={38} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="case-2020-bonds">
        <p className="section-kicker">43 · 案例二：2020-03 Bond ETFs</p>
        <h2>大折价既可能包含套利摩擦，也可能是 ETF 比陈旧单券估值更快发现可成交价格。</h2>
        <p>
          Bank of England 在 2020 年 5 月报告中指出，3 月中旬一些最大的美国 investment-grade 与 high-yield corporate bond ETFs 相对 NAV 的折价超过 5%，而 1 月最大不超过 0.1%；同一时期 ETF 份额成交显著增加，部分产品 3 月日成交量超过 1 月均值三倍。报告据此认为价格发现常经 ETF 发生，但使用“appear”“may”并保留 NAV 估值滞后的解释。<Cite n={8} />
        </p>
        <p>
          BIS 随后将机制拆成三层：底层债券 spread 远大于 ETF share spread；最小交易单位与到期结构使篮子不能复制全部持仓；AP 兼任 dealer 时会按库存动机选择申赎。BoE 2021 年回归又发现，在 stress period，1% ETF NAV discount 与下一日开放式基金预期 NAV 下降 0.28% 相关；作者控制若干债券价格，但明确是 association，不是随机实验。综合结论是：折价中有信息，也可能有流动性 premium 和受限套利；仅凭事后 NAV 追赶不能证明全部折价“正确”，仅凭大折价也不能证明 ETF 结构失败。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="case-uso">
        <p className="section-kicker">44 · 案例三：2020-04 USO</p>
        <h2>Creation 暂停会移除溢价方向的新增供给，但 36% 报告溢价还混入 90 分钟估值时差。</h2>
        <p>
          USO 因可发行的 SEC-registered shares 耗尽，于 2020 年 4 月 21 日暂停 Creation Baskets。其后续 prospectus 披露：当日收盘市场价比报告日终每份 NAV 高 36%；次日溢价降至 8.66%，到 5 月 1 日为 1.45%。同一文件明确指出，USO 的 NAV 使用 14:30 ET oil futures settlement，而份额 16:00 收盘；这 90 分钟内的期货盘后信息解释了差异的重要部分，creation 暂停、创纪录波动和份额成交量也有贡献。<Cite n={11} /><Cite n={12} />
        </p>
        <p>
          这个案例同时给出三个边界。第一，creation 侧中断使卖出新份额的标准闭环容量接近零，溢价可以扩大；第二，二级卖盘、替代对冲和预期恢复仍可让溢价在 creation 未恢复前快速收窄，所以“暂停后溢价必持续”不成立；第三，USO 是商品池，且 NAV 与 ETF close 时钟不同，不能把 36% 全部称为可套利误价，也不能把个案法律原因外推给开放式 ETF。USO 后续恢复 creation 的备案与 SEC 针对其披露和内部控制发布的执法命令，还说明“机制恢复”和“治理是否充分”是两个问题。研究必须保存产品结构、注册份额、creation status、期货曲线、NAV strike 与每一时点可得信息。<Cite n={11} /><Cite n={50} /><Cite n={51} />
        </p>
      </section>

      <section className="lesson-section" id="research-measurement">
        <p className="section-kicker">阶段六 · 研究与练习　|　45 · 因果识别与测量协议</p>
        <h2>要检验“申赎套利稳定价格”，必须分别观察触发价差、可执行容量、真实动作与两边价格响应。</h2>
        <div className="table-scroll" role="region" aria-label="ETF 申赎套利研究的最低字段和常见误判，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">ETF 申赎研究从产品账本、同步估值、一级市场、AP 约束到动作结果的数据协议</caption>
            <thead><tr><th scope="col">节点</th><th scope="col">最低字段</th><th scope="col">常见误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">产品与账本</th><td>法律结构、NAV policy、A/L/N、benchmark、holdings、currency</td><td>把 ETF、ETN、commodity pool 和 UIT 合并</td></tr>
              <tr><th scope="row">同步估值</th><td>ETF NBBO、每项 basket bid/ask/depth、FX、期货、stale flags</td><td>用 last price 或昨夜 NAV 构造虚假价差</td></tr>
              <tr><th scope="row">一级市场</th><td>U、basket ID、cash balance、fees、cut-off、create/redeem status</td><td>把 public basket 当成实际 custom basket</td></tr>
              <tr><th scope="row">AP 约束</th><td>funding、borrow、inventory、capital、risk limits、settlement capacity</td><td>用 AP 名单数量替代实际容量</td></tr>
              <tr><th scope="row">动作与结果</th><td>订单、接受、pricing、交付、fail、gross / net units、两腿成交与 impact</td><td>由 shares outstanding 直接推断底层买卖</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个可信事件研究可利用预先已知的 creation suspension / resumption、市场时钟错位、AP outage、basket policy change 或结算规则变化，比较受影响产品与具有相似资产、规模、spread 和需求的对照组。结果变量不只看报告折溢价，还应看 executable gap、ETF spread/depth、basket cost、creation latency、gross units、两腿 impact 和恢复半衰期。需要控制共同基本面新闻、指数再平衡、客户流、基金费用、底层停牌与 LULD；并以事件前趋势、安慰剂时点和替代 V* 估计检验。
        </p>
        <p>
          单纯观察“折价后发生 redemption、随后价差收窄”仍有反向因果：价差本身触发 redemption，新信息又同时移动价格。可识别的局部问题应写成“在已冻结同步价值和需求冲击后，一项外生改变 AP 可执行成本 / 容量的制度事件，是否改变价差收敛斜率与两腿订单传导”。世界观可以包含完整网络，实证设计却必须只承诺能观察的箭头。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">46 · 互动实验</p>
        <h2>Mode A 先闭合基金与双向套利账本；Mode B 再判断价差是否可做、哪一侧承担收敛，以及混合证据能识别什么。</h2>
        <p>
          八道题使用与正文例子不同的数字。Mode A 要先把所有量放进同一资产范围、货币、时点和 creation unit，再决定该用 ETF bid 还是 ask、basket bid 还是 ask；Mode B 则加入没有可执行套利的报告溢价、陈旧 NAV、两侧深度与 AP 容量，以及债券 ETF 的竞争解释。提交后才会显示诊断，单靠套用 P−NAV 或背诵一个公式无法完成第二模式。
        </p>
        <EtfArbitrageLab />
      </section>

      <section className="lesson-section" id="practice-checks">
        <p className="section-kicker">47 · 主动练习与理解检查</p>
        <h2>六道可复算练习检验执行账本，十个问题检验你能否解释边界、反例与传导。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · Creation 是否稀释</span><p>某 ETF 净资产 Q=7,800 万元、流通 300 万股，NAV=26 元。基金发行 U=75,000 股，收到证券篮子 193 万元与 cash balance 1.5 万元。忽略费用，求申购后 NAV，并判断价值转移方向。</p><details className="practice-answer"><summary>展开核对答案</summary><p>收到总价值 194.5 万元；中性价值应为 75,000×26=195 万元，少 5,000 元。新 NAV=(78,000,000+1,945,000)/(3,075,000)=25.998374 元，旧股东每份约被稀释 0.001626 元。差额很小，也不能称“完全无稀释”。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 双侧执行门槛</span><p>每股 basket bid/ask 为 31.72/31.80；redemption / creation 全成本分别 0.09/0.11。ETF quote 为 31.61/31.66。判断哪侧可执行，并求每股边际净差。</p><details className="practice-answer"><summary>展开核对答案</summary><p>Redemption：basket bid−ETF ask−c<sub>R</sub>=31.72−31.66−0.09=−0.03，不执行。Creation：ETF bid−basket ask−c<sub>C</sub>=31.61−31.80−0.11=−0.30，也不执行。报告价可能显得便宜，但 quote 未越过成本带。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 固定费与整数 unit</span><p>U=60,000，每股溢价毛差 0.12、可变成本 0.055；一笔订单固定费 5,000 元，可覆盖至多 3 units。忽略冲击，最少做几份才使净利润为正？三份利润多少？</p><details className="practice-answer"><summary>展开核对答案</summary><p>每份扣可变成本后的收益=60,000×0.065=3,900 元；一份净亏 1,100，两份净赚 2,800，因此最少 2 份；三份净赚 11,700−5,000=6,700 元。</p></details></article>
          <article className="practice-problem"><span>练习 04 · 报告折价分解</span><p>ETF 为 82.40，官方 NAV 为 85.00；用同步期货、FX 和真实 basket depth 得到 V*=82.10。分别求报告折溢价与相对 V* 偏离，并说明百分比为何不能直接相加。</p><details className="practice-answer"><summary>展开核对答案</summary><p>报告折价=82.40/85−1=−3.0588%；同步偏离=82.40/82.10−1=+0.3654%。两者分母不同，不能把 +0.3654% 与某个时钟百分比直接相加；货币差可精确分解：−2.60=+0.30−2.90。</p></details></article>
          <article className="practice-problem"><span>练习 05 · Capacity 与底层传导</span><p>某 AP 可用资本 2,750 万元，每份 unit 资本占用 420 万元；ETF borrow 可支持 8 units，篮子深度只支持 5 units，操作限额为 10。U=25,000，每份需买入成分 A 3,200 股。求最大容量及对应数量。</p><details className="practice-answer"><summary>展开核对答案</summary><p>资本支持 floor(27.5/4.2)=6 units，取 min(6,8,5,10)=5；最多新增 125,000 ETF 股，并产生至多 16,000 股 A 的题面 basket 买入需求。真实成交仍可能由库存抵消。</p></details></article>
          <article className="practice-problem"><span>练习 06 · 每日反向产品</span><p>标的第一天 −8%，第二天 +8.695652%，两日约回到原点。每日 −2× ETF 从 100 开始，忽略费用，求两日价值。</p><details className="practice-answer"><summary>展开核对答案</summary><p>第一天 ETF 回报 +16%，价值 116；第二天回报 −17.391304%，价值约 95.8261，累计约 −4.1739%。多日偏离来自每日复利，不是份额相对 NAV 的折溢价。</p></details></article>
        </div>
        <div className="check-grid">
          <details><summary>01 · 为什么 ETF 市场价不必每刻等于 NAV？</summary><p>两者在不同市场、不同时间尺度形成；只有当可执行价差覆盖成本且有容量时，套利交易才施加纠偏压力。</p></details>
          <details><summary>02 · AP 与 market maker 最关键的区别？</summary><p>AP 有权直接提交 creation / redemption；market maker 提供二级报价。角色可兼任，但一种身份不自动产生另一种义务。</p></details>
          <details><summary>03 · Creation 为什么通常不稀释旧股东？</summary><p>基金收到的 basket＋cash 若等于新增 U 股对应 NAV，净资产和份额同比例增加；是否价值中性取决于估值与成本，而非“in-kind”标签本身。</p></details>
          <details><summary>04 · 为什么溢价套利看 ETF bid？</summary><p>交易者在 creation 方向要卖出 ETF，实际收到的是 bid；用 ask 或 last 会夸大可实现收入。</p></details>
          <details><summary>05 · 为什么大报告折价可能没有 redemption arbitrage？</summary><p>NAV 可能陈旧，ETF ask 可能仍高于同步 basket bid 减全成本，或赎回、borrow、资本和结算容量为零。</p></details>
          <details><summary>06 · Index、holdings 与 baskets 为什么必须分开？</summary><p>指数定义目标，holdings 构成 NAV，creation / redemption baskets 定义实际交换；抽样、现金、custom basket 与库存会使四者不同。</p></details>
          <details><summary>07 · 为什么净 creation 不等于底层同额净买盘？</summary><p>In-kind 可来自 AP 库存，gross 双向活动会在净额中抵消，custom basket 也不等于完整持仓；只有真实 basket 和成交能闭合传导。</p></details>
          <details><summary>08 · Bond ETF 折价的两个竞争解释？</summary><p>ETF 可能先发现陈旧债券 NAV 应下调，也可能因底层处置成本、dealer inventory 与受限套利而超调；两者可同时存在。</p></details>
          <details><summary>09 · Creation 暂停为何不保证溢价永久存在？</summary><p>二级卖压、替代产品、期货对冲、需求变化和对恢复的预期仍能推动收敛；一级通道只是重要反馈之一。</p></details>
          <details><summary>10 · 每日杠杆路径为何不是套利误价？</summary><p>产品合同目标就是逐日倍数，复利使多日结果依赖路径；只要份额贴近当日 creation value，路径损益仍可完全符合设计。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-closing">
        <p className="section-kicker">48 · 课程接口与结课诊断</p>
        <h2>本节把“ETF 会被套利拉回 NAV”改写成一条可审计的执行链；下一节把同样方法移到 futures basis。</h2>
        <div className="interface-grid">
          <article><span>← T07</span><h3>资产合约最小基础</h3><p>输入基金份额、股票、债券、期货和 ETN 的法律与现金流差异，防止把所有 ETP 当同一资产。</p></article>
          <article><span>← 1.11</span><h3>跨市场价格发现</h3><p>输入相关市场可以同时生产信息；本节说明 ETF、期货和 basket 的领先关系怎样随时钟与深度变化。</p></article>
          <article><span>← 1.20</span><h3>Leverage、Margin 与 Liquidation</h3><p>输入融资、借券、库存资本、保证金与冲击约束，解释 AP 为什么有权却不总有能力立即申赎。</p></article>
          <article><span>→ 1.22</span><h3>Futures Basis 与 Cash–Futures Arbitrage</h3><p>输出同步可执行价值、双侧报价、carry、容量与结算风险语言，供下一节拆解 cash–futures basis。</p></article>
          <article><span>→ 2.04</span><h3>Passive Funds</h3><p>输出 fund、AP、market maker、终端投资者与 index provider 的分工，以及申赎流如何连接被动配置。</p></article>
          <article><span>→ 4.24</span><h3>Market Linkage</h3><p>输出 ETF–basket–futures–FX 的多市场传导、共同持仓网络、稳定器与状态依赖反馈。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“这只 ETF 偏离净值，所以有无风险套利”的判断，先确认它是开放式 ETF、UIT、商品池、grantor trust 还是 ETN；冻结基金资产、负债、份额、NAV policy 和时点；把官方 NAV、indicative value 与同步可执行 V* 分开；区分 AP、做市商、套利者和终端投资者。
          <br /><br />
          然后取得真实 creation / redemption basket、cash balance、unit、fees、cut-off 与开放状态。Creation 用 ETF bid 对 basket ask，redemption 用 ETF ask 对 basket bid，再加入融资、借券、库存、资本、冲击、税务和结算失败；计算整数容量而非只看每股价差；允许 ETF、底层或两边共同收敛。
          <br /><br />
          最后把 index、holdings、两类 basket 和 dealer inventory 分开，观察 gross 申赎、真实成交与时钟，而不从 net shares 反推全部流量；再用国际 ETF、债券 ETF、非证券底层 ETP 和每日杠杆产品检查边界。完成这套诊断，NAV 不再是一块神秘磁铁，而成为一条在正常期强、在压力期会变宽、会转向、也可以被证伪的市场机制。
        </p>
      </section>
    </>
  );
}

export const lesson121: LessonRecord = {
  slug: '1-21',
  id: '1.21',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'ETF Creation / Redemption 与套利机制',
  subtitle: '从基金账本、同步可执行篮子、AP 申赎权限与状态依赖套利带出发，解释 ETF 价格为何通常贴近资产价值、何时合理偏离，以及价差如何连接 ETF 与底层市场',
  readingTime: '主线首读约 80–95 分钟；零背景完整学习建议分两次，共约 145–175 分钟（含全部产品变体、案例、互动实验与练习；参考文献和延伸阅读不计）',
  prerequisite: 'T07 · Bond / Equity / Futures / Options 最小基础；1.11 · 跨市场价格发现；建议回看 1.20',
  updatedAt: '2026-08-29',
  revision: '1.21-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.21-r1',
      summary: '首轮确认 49 节、核心法规、三案例、全部公式和数值均成立；要求纠正 inventory 段的论文归因、收紧二级流动性论文的支持范围、修正一条标题元数据，并消除互动事实卡重复 React key。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.21-r1',
      summary: '首轮认可因果主线与课程接口；要求将未接入样式的表格、机制图和练习改用现有可访问组件，使题面与答案分离，增加六阶段认知导航和术语桥，并把至少两道互动题升级为系统迁移。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.21-r2',
      summary: '终审确认 49 节、55 条来源、现行法规、三案例、全部公式与数值无误；论文归因与支持范围已闭合，两道新系统题及互动状态回归通过。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.21-r2',
      summary: '终审确认六阶段认知坡度、术语桥、双轮时长、可访问表格、先答后揭示练习和系统迁移互动达到出版要求；49 节接口与全部交互状态通过。',
    },
  ],
  previous: { slug: '1-20', label: '1.20 Leverage、Margin 与 Forced Liquidation' },
  next: { slug: '1-22', label: '1.22 Futures Basis 与 Cash–Futures Arbitrage' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整系统' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'product-boundary', label: '产品边界' },
    { id: 'actors-markets', label: '六类主体' },
    { id: 'two-markets', label: '两级市场' },
    { id: 'three-clocks', label: '三只时钟' },
    { id: 'fund-balance-sheet', label: '基金账本与 NAV' },
    { id: 'official-premium', label: '官方折溢价' },
    { id: 'indicative-values', label: '盘中指示价值' },
    { id: 'synchronized-value', label: '同步可执行价值' },
    { id: 'creation-unit', label: 'Creation Unit' },
    { id: 'ap-option', label: 'AP 是权利持有人' },
    { id: 'creation-ledger', label: 'Creation 账本' },
    { id: 'redemption-ledger', label: 'Redemption 账本' },
    { id: 'dilution-neutrality', label: '价值中性条件' },
    { id: 'premium-creation', label: '溢价方向' },
    { id: 'discount-redemption', label: '折价方向' },
    { id: 'secondary-arbitrage', label: '二级相对价值' },
    { id: 'arbitrage-band', label: '状态依赖套利带' },
    { id: 'fixed-costs', label: '固定费与离散性' },
    { id: 'cash-balancing', label: 'Cash Balance' },
    { id: 'four-portfolios', label: '四张组合清单' },
    { id: 'custom-baskets', label: 'Custom Basket' },
    { id: 'in-kind', label: 'In-Kind 申赎' },
    { id: 'cash-hybrid', label: 'Cash / Hybrid' },
    { id: 'inventory-hedge', label: 'AP Inventory' },
    { id: 'balance-sheet-constraints', label: '融资与资本约束' },
    { id: 'two-sided-impact', label: '两腿 Price Impact' },
    { id: 'settlement-risk', label: '结算与失败风险' },
    { id: 'feedback-stability', label: '反馈稳定条件' },
    { id: 'two-liquidity-layers', label: '两层流动性' },
    { id: 'ap-network', label: 'AP 网络' },
    { id: 'flow-measurement', label: 'Primary Flow' },
    { id: 'four-metrics', label: '四种误差' },
    { id: 'securities-lending', label: 'Securities Lending' },
    { id: 'tax-mechanism', label: '美国税务机制' },
    { id: 'international-etfs', label: 'International ETF' },
    { id: 'bond-etfs', label: 'Bond ETF' },
    { id: 'commodity-crypto-etps', label: '非证券底层 ETP' },
    { id: 'leveraged-etfs', label: 'Leveraged ETF' },
    { id: 'market-linkage', label: '跨市场连接' },
    { id: 'case-2015', label: '案例：2015-08-24' },
    { id: 'case-2020-bonds', label: '案例：2020 Bond ETFs' },
    { id: 'case-uso', label: '案例：2020 USO' },
    { id: 'research-measurement', label: '因果识别与测量' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice-checks', label: '练习与检查' },
    { id: 'interfaces-closing', label: '接口与诊断' },
  ],
  Content: Lesson121Content,
  references: [
    { id: 1, authors: 'U.S. Securities and Exchange Commission', year: 'current', accessedAt: '2026-08-29', title: '17 CFR § 270.6c-11 — Exchange-Traded Funds', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-270/section-270.6c-11', use: '定义 Rule 6c-11 ETF、AP、creation unit、basket、cash balancing amount、custom basket、market price 与折溢价披露；不覆盖 UIT、ETN 或商品池。' },
    { id: 2, authors: 'U.S. Securities and Exchange Commission', year: '2019', accessedAt: '2026-08-29', title: 'Exchange-Traded Funds', publication: 'Final Rule, Release Nos. 33-10695 and IC-33646, 84 FR 57162', url: 'https://www.sec.gov/files/rules/final/2019/33-10695.pdf', use: '解释 ETF 一级—二级市场、AP、非 AP 套利者、portfolio disclosure、custom baskets 与压力期套利边界；现行义务仍以最新 eCFR 为准。' },
    { id: 3, authors: 'SEC Office of Investor Education and Advocacy', year: '2023', accessedAt: '2026-08-29', title: 'Updated Investor Bulletin: Exchange-Traded Funds (ETFs)', publication: 'Investor.gov, 23 February 2023', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24', use: '支持 NAV、零售二级交易、AP、creation unit、折溢价、spread 与 in-kind 税务效率的入门边界；明确不讨论商品 ETP 或 ETN。' },
    { id: 4, authors: 'Cboe Global Indices, LLC', year: '2026', accessedAt: '2026-08-29', title: 'Indicative Value Calculation Service — Guide', publication: 'Official calculation methodology', url: 'https://cdn.cboe.com/api/global/us_indices/governance/Cboe_Indicative_Value_Calculation_Service-Guide.pdf', use: '给出基于日度组合、实时或理论价格、FX、现金与份额的 iNAV 公式、约 15 秒频率及 stale input 处理；不是法定 NAV 或成交承诺。' },
    { id: 5, authors: 'Shelly Antoniewicz & Jane Heinrichs', year: '2015', accessedAt: '2026-08-29', title: 'The Role and Activities of Authorized Participants of Exchange-Traded Funds', publication: 'Investment Company Institute White Paper, March 2015', url: 'https://www.ici.org/system/files/attachments/ppr_15_aps_etfs.pdf', use: '提供 sponsor 调查中的 AP、活跃度、代理申赎与二级流动性描述；行业调查有样本与利益相关边界，不能替代当前监管数据。' },
    { id: 6, authors: 'Subcommittee on ETFs and Bond Funds, SEC Fixed Income Market Structure Advisory Committee', year: '2019', accessedAt: '2026-08-29', title: 'Report on the Design of Exchange-Traded Funds and Bond Funds — Implications under Stressful Conditions', publication: 'FIMSAC Subcommittee Report, 10 April 2019', url: 'https://www.sec.gov/spotlight/fixed-income-advisory-committee/etfs-and-bond-funds-subcommittee-report-041519.pdf', use: '区分 AP 与 market maker，说明 bond ETF 套利、step-away 与底层流动性；报告明示仅代表 subcommittee 观点，不代表 FIMSAC、SEC 或 staff。' },
    { id: 7, authors: 'Staff of the Office of Analytics and Research, SEC Division of Trading and Markets', year: '2015', accessedAt: '2026-08-29', title: 'Equity Market Volatility on August 24, 2015', publication: 'SEC Research Note, December 2015', url: 'https://www.sec.gov/files/marketstructure/research/equity_market_volatility.pdf', use: '提供该日 499 只美国股票 ETP、LULD、range、SPY、IVV 与 QQQ 的官方时序统计；单次事件不能估计长期平均因果效应。' },
    { id: 8, authors: 'Bank of England', year: '2020', accessedAt: '2026-08-29', title: 'Interim Financial Stability Report — May 2020', publication: 'Official financial stability report', url: 'https://www.bankofengland.co.uk/-/media/boe/files/financial-stability-report/2020/may-2020.pdf', use: '记录 2020 年 3 月部分大型 IG 与 HY 公司债 ETF 折价超过 5%、而 1 月不超过约 0.1%，并讨论 ETF 价格发现；数字属于特定压力窗口。' },
    { id: 9, authors: 'Karamfil Todorov', year: '2021', accessedAt: '2026-08-29', title: 'The Anatomy of Bond ETF Arbitrage', publication: 'BIS Quarterly Review, March 2021, 41–53', url: 'https://www.bis.org/publ/qtrpdf/r_qt2103d.htm', use: '系统解释 fractional baskets、basket—holdings wedge、AP dealer inventory、17 倍相对 spread 与债券 ETF 套利；BIS 专题分析不是普遍结构因果估计。' },
    { id: 10, authors: 'Bank of England', year: '2021', accessedAt: '2026-08-29', title: 'Did Movements in Exchange-Traded Funds Act as a Price Signal for Open-Ended Fund Investors during the “Dash for Cash” Stress Period?', publication: 'Bank Overground, 20 August 2021', url: 'https://www.bankofengland.co.uk/bank-overground/2021/did-movements-exchange-traded-funds-act-as-price-signal-open-ended-fund-investors', use: '报告压力期 1% ETF 折价与次日预期 OEF NAV 约 −0.28% 的条件关联；回归 association 不证明 ETF 交易造成后续 NAV 变化。' },
    { id: 11, authors: 'United States Oil Fund, LP', year: '2023', accessedAt: '2026-08-29', title: 'Prospectus — United States Oil Fund, LP Shares', publication: 'Form 424B3 filed on SEC EDGAR, dated 28 April 2023', url: 'https://www.sec.gov/Archives/edgar/data/1327068/000117120023000283/i23236_uso-424b3.htm', use: '披露 2020-04-21 约 36% premium、次日 8.66%、至 05-01 为 1.45%，以及 14:30 futures settlement 与 16:00 share close 的时差；USO 是商品池。' },
    { id: 12, authors: 'United States Oil Fund, LP', year: '2020', accessedAt: '2026-08-29', title: 'Current Report on Form 8-K — Suspension of Creation Baskets', publication: 'SEC EDGAR filing, 21 April 2020', url: 'https://www.sec.gov/Archives/edgar/data/1327068/000117120020000256/i20259_uso-8k.htm', use: '直接记录因现有注册份额耗尽而暂停新增 creation baskets、但保留 redemption 与二级交易；不是一般 ETF 的自动 suspension 规则。' },
    { id: 13, authors: 'U.S. Securities and Exchange Commission', year: '2025', accessedAt: '2026-08-29', title: 'SEC Permits In-Kind Creations and Redemptions for Crypto ETPs', publication: 'Press Release 2025-101, 29 July 2025', url: 'https://www.sec.gov/newsroom/press-releases/2025-101-sec-permits-kind-creations-redemptions-crypto-etps', use: '记录部分美国 spot bitcoin 与 ether ETP 从 cash-only 向获准 in-kind 申赎的变化；这些批准令不等于修改全部 Rule 6c-11 ETF。' },
    { id: 14, authors: 'U.S. Congress', year: 'current', accessedAt: '2026-08-29', title: '26 U.S.C. § 852 — Taxation of Regulated Investment Companies and Their Shareholders', publication: 'United States Code', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&req=granuleid%3AUSC-prelim-title26-section852', use: '§852(b)(6) 是美国 RIC 实物赎回税务处理的法源；不免除 ETF 股东卖出份额的税，也不自动适用于非美国或非 RIC 产品。' },
    { id: 15, authors: 'Financial Industry Regulatory Authority', year: '2009', accessedAt: '2026-08-29', title: 'FINRA Reminds Firms of Sales Practice Obligations Relating to Leveraged and Inverse Exchange-Traded Funds', publication: 'Regulatory Notice 09-31, 11 June 2009', url: 'https://www.finra.org/rules-guidance/notices/09-31', use: '支持 daily-reset leveraged / inverse ETF 的复利、波动与持有期风险；销售实践指引不能说明此类产品长期必亏。' },
    { id: 16, authors: 'U.S. Securities and Exchange Commission', year: 'current', accessedAt: '2026-08-29', title: '17 CFR § 270.18f-4 — Use of Derivatives by Registered Funds', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-270/section-270.18f-4', use: '提供注册基金衍生品风险管理及 leveraged / inverse fund 条件；不规定 AP 套利义务，也不覆盖 USO 一类商品池。' },
    { id: 17, authors: 'Edwin J. Elton, Martin J. Gruber, George Comer & Kai Li', year: '2002', title: 'Spiders: Where Are the Bugs?', publication: 'Journal of Business, 75(3), 453–472', url: 'https://doi.org/10.1086/339891', use: '提供早期 SPDR 定价、费用、现金拖累与 creation / redemption 结构证据；单一早期股票 ETF 不能代表现代债券或衍生品产品。' },
    { id: 18, authors: 'James M. Poterba & John B. Shoven', year: '2002', title: 'Exchange-Traded Funds: A New Investment Option for Taxable Investors', publication: 'American Economic Review, 92(2), 422–427', url: 'https://doi.org/10.1257/000282802320191732', use: '建立 ETF 与传统指数基金税后表现的早期比较；样本主要是 1994–2000 年美国产品，不能直接量化现行税收优势。' },
    { id: 19, authors: 'Robert F. Engle & Debojyoti Sarkar', year: '2006', title: 'Premiums-Discounts and Exchange Traded Funds', publication: 'Journal of Derivatives, 13(4), 27–45', url: 'https://doi.org/10.3905/jod.2006.635418', use: '显示国内与国际 ETF 折溢价动态并强调 stale prices 与 bid-ask measurement；旧样本与成本代理限制当前外推。' },
    { id: 20, authors: 'Lucy F. Ackert & Yisong S. Tian', year: '2008', title: 'Arbitrage, Liquidity, and the Valuation of Exchange Traded Funds', publication: 'Financial Markets, Institutions & Instruments, 17(5), 331–362', url: 'https://doi.org/10.1111/j.1468-0416.2008.00144.x', use: '连接 ETF 折溢价、流动性与跨国产品特征；统计折价不能直接等同无风险、可交易利润。' },
    { id: 21, authors: 'Antti Petajisto', year: '2017', title: 'Inefficiencies in the Pricing of Exchange-Traded Funds', publication: 'Financial Analysts Journal, 73(1), 24–54', url: 'https://doi.org/10.2469/faj.v73.n1.7', use: '估计大样本 ETF 价格偏离和交易成本调整后的效率差异，说明套利是有带宽的约束；fair-value 与成本模型仍有测量误差。' },
    { id: 22, authors: 'Martin Lettau & Ananth Madhavan', year: '2018', title: 'Exchange-Traded Funds 101 for Economists', publication: 'Journal of Economic Perspectives, 32(1), 135–154', url: 'https://doi.org/10.1257/jep.32.1.135', use: '提供 ETF 结构、一级与二级市场、套利、成本和市场影响的标准综述；综述不替代具体产品规则或新因果识别。' },
    { id: 23, authors: 'Kevin Pan & Yao Zeng', year: '2017', title: 'ETF Arbitrage under Liquidity Mismatch', publication: 'ESRB Working Paper Series No. 59', url: 'https://www.esrb.europa.eu/pub/pdf/wp/esrb.wp59.en.pdf', use: '建立债券 AP 兼任 dealer 时的 inventory conflict 与错价机制；截至访问日属工作论文，结论集中于公司债 ETF。' },
    { id: 24, authors: 'Caitlin D. Dannhauser', year: '2017', title: 'The Impact of Innovation: Evidence from Corporate Bond Exchange-Traded Funds (ETFs)', publication: 'Journal of Financial Economics, 125(3), 537–560', url: 'https://doi.org/10.1016/j.jfineco.2017.06.002', use: '利用债券进入 ETF 的变化研究估值、流动性与共同定价；早期样本不直接刻画 2020 压力期 AP 资本约束。' },
    { id: 25, authors: 'Itzhak Ben-David, Francesco Franzoni & Rabih Moussawi', year: '2018', title: 'Do ETFs Increase Volatility?', publication: 'Journal of Finance, 73(6), 2471–2535', url: 'https://doi.org/10.1111/jofi.12727', use: '支持 ETF 套利交易可能把非基本面冲击传给美国股票成分股；不支持“所有 ETF 必然提高系统波动”。' },
    { id: 26, authors: 'Zhi Da & Sophie Shive', year: '2018', title: 'Exchange Traded Funds and Asset Return Correlations', publication: 'European Financial Management, 24(1), 136–168', url: 'https://doi.org/10.1111/eufm.12137', use: '显示 ETF 活动与成分股共动的状态依赖关系；相关性上升可混合信息整合与非基本面流量。' },
    { id: 27, authors: 'Doron Israeli, Charles M. C. Lee & Suhas A. Sridharan', year: '2017', title: 'Is There a Dark Side to Exchange Traded Funds? An Information Perspective', publication: 'Review of Accounting Studies, 22(3), 1048–1083', url: 'https://doi.org/10.1007/s11142-017-9400-8', use: '将 ETF ownership 与成分股交易成本、信息环境及定价效率联系；美国股票识别不能外推到全部资产类别。' },
    { id: 28, authors: 'Jitka Hilliard', year: '2014', title: 'Premiums and Discounts in ETFs: An Analysis of the Arbitrage Mechanism in Domestic and International Funds', publication: 'Global Finance Journal, 25(2), 90–107', url: 'https://doi.org/10.1016/j.gfj.2014.06.001', use: '比较国内与国际 ETF 的折溢价和收敛差异；历史数据与代理变量不能观察 AP 全套执行成本。' },
    { id: 29, authors: 'Marco Avellaneda & Stanley Zhang', year: '2010', title: 'Path-Dependence of Leveraged ETF Returns', publication: 'SIAM Journal on Financial Mathematics, 1, 586–603', url: 'https://doi.org/10.1137/090760805', use: '严格推导 daily-reset leveraged ETF 的路径、方差拖累与动态暴露；解释 NAV 路径而非市价对 NAV 的套利误差。' },
    { id: 30, authors: 'Louis R. Piccotti', year: '2018', title: 'ETF Premiums and Liquidity Segmentation', publication: 'Financial Review, 53(1), 117–152', url: 'https://doi.org/10.1111/fire.12148', use: '说明高流动性 ETF 份额可因流动性服务获得均衡 premium；不表示任意 premium 都合理或不会收敛。' },
    { id: 31, authors: 'David E. Rappoport & Tugkan Tuzun', year: '2020', title: 'Arbitrage and Liquidity: Evidence from a Panel of Exchange Traded Funds', publication: 'Finance and Economics Discussion Series 2020-097, Federal Reserve Board', url: 'https://doi.org/10.17016/FEDS.2020.097', use: '显示市场流动性影响 ETF 套利有效性，较不流动债券 ETF 的调整更持久；Granger dynamics 不等于完整结构因果。' },
    { id: 32, authors: 'Andrei Shleifer & Robert W. Vishny', year: '1997', title: 'The Limits of Arbitrage', publication: 'Journal of Finance, 52(1), 35–55', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x', use: '提供资本、委托关系与短期损失可迫使正确套利提前退出的基础理论；一般模型不直接给出 ETF unit 或实际套利带。' },
    { id: 33, authors: 'Lawrence R. Glosten, Suresh Nallareddy & Yuan Zou', year: '2021', title: 'ETF Activity and Informational Efficiency of Underlying Securities', publication: 'Management Science, 67(1), 22–47', url: 'https://doi.org/10.1287/mnsc.2019.3427', use: '提供 ETF 活动可改善弱信息环境股票短期信息效率的反例证据；效应依信息环境而异。' },
    { id: 34, authors: 'Egle Karmaziene & Valeri Sokolovski', year: '2022', title: 'Short-Selling Equity Exchange Traded Funds and Its Effect on Stock Market Liquidity', publication: 'Journal of Financial and Quantitative Analysis, 57(3), 923–956', url: 'https://doi.org/10.1017/S0022109021000181', use: '利用 2008 short-sale ban 说明 ETF shorting 可替代个股空头并影响成分股流动性；不是基金自身证券出借收入的估计。' },
    { id: 35, authors: 'John J. Shim & Karamfil Todorov', year: '2021', title: 'ETFs, Illiquid Assets, and Fire Sales', publication: 'BIS Working Papers No. 975', url: 'https://www.bis.org/publ/work975.pdf', use: '记录 fractional baskets、basket turnover 与 AP inventory buffer，并给出 ETF 不必机械触发底层火售的状态依赖反例。' },
    { id: 36, authors: 'Travis Box, Ryan Davis, Richard Evans & Andrew Lynch', year: '2021', title: 'Intraday Arbitrage between ETFs and Their Underlying Portfolios', publication: 'Journal of Financial Economics, 141(3), 1078–1095', url: 'https://doi.org/10.1016/j.jfineco.2021.04.023', use: '用日内可执行报价显示真正可交易的 ETF—portfolio 套利机会稀少并检验价格传递；样本限于 2006–2015 美国被动股票 ETF。' },
    { id: 37, authors: 'David C. Brown, Shaun W. Davies & Matthew C. Ringgenberg', year: '2021', title: 'ETF Arbitrage, Non-Fundamental Demand, and Return Predictability', publication: 'Review of Finance, 25(4), 937–972', url: 'https://doi.org/10.1093/rof/rfaa027', use: '把 creation / redemption activity 建模为非基本面需求信号；flow 解释依模型假设，收益未必是成本后可复制套利。' },
    { id: 38, authors: 'Ananth N. Madhavan', year: '2016', title: 'Exchange-Traded Funds and the New Dynamics of Investing', publication: 'Oxford University Press', url: 'https://doi.org/10.1093/acprof:oso/9780190279394.001.0001', use: '系统整理 ETF 交易、指数、套利、流动性与组合应用；专著不替代当前法规或具体事件的独立识别。' },
    { id: 39, authors: 'Austin Gerig & Keegan Murphy', year: '2016', accessedAt: '2026-08-29', title: 'The Determinants of ETF Trading Pauses on August 24th, 2015', publication: 'SEC Division of Economic and Risk Analysis White Paper', url: 'https://www.sec.gov/about/divisions-offices/division-economic-risk-analysis/staff-papers-analyses/feb2016-dera-white-paper-etf-volatility', use: '把该日 ETF pauses 与交易量、流动性供给、S&P 500 相关性和 turnover 联系；作者研究不代表 Commission 结论，预测回归不等于完整因果。' },
    { id: 40, authors: 'U.S. Securities and Exchange Commission', year: '2020', accessedAt: '2026-08-29', title: 'Use of Derivatives by Registered Investment Companies and Business Development Companies', publication: 'Final Rule, Release No. IC-34084, 85 FR 83162', url: 'https://www.sec.gov/rules/final/2020/ic-34084.pdf', use: '采用 Rule 18f-4 并修订 Rule 6c-11，使符合条件的 leveraged / inverse ETF 可依现行框架运营；采用时文本须与当前 eCFR 配合阅读。' },
    { id: 41, authors: 'Mitsuru Katagiri, Junnosuke Shino & Koji Takahashi', year: '2025', title: 'To Lend or Not to Lend: The Bank of Japan’s ETF Purchase Program and Securities Lending', publication: 'Review of Asset Pricing Studies, 15(3–4), 332–376', url: 'https://doi.org/10.1093/rapstu/raaf008', use: '利用 BoJ purchases 识别 ETF 持仓进入证券借贷供给的中长期渠道；日本央行政策实验不同于 AP 为申赎借券。' },
    { id: 42, authors: 'John D. Finnerty, Natalia Reisel & Xun Zhong', year: '2025', title: 'ETFs, Creation and Redemption Processes, and Bond Liquidity', publication: 'Journal of Financial and Quantitative Analysis, 60(4), 1891–1924', url: 'https://doi.org/10.1017/S0022109024000346', use: '显示债券进入 creation 或 redemption basket 后流动性通常改善，同时识别交易成本与 inventory 管理；样本限于美国公司债。' },
    { id: 43, authors: 'Claudio E. Raddatz K.', year: '2025', title: 'Authorized Participants’ Regulatory Constraints and Limits to ETF Arbitrage during Market Turmoil: Evidence from the Dash-for-Cash Episode', publication: 'Journal of Banking & Finance, 179, 107499', url: 'https://doi.org/10.1016/j.jbankfin.2025.107499', use: '显示 2020 年 3 月 active AP 与 lead market maker 的资本空间影响债券 ETF 一级套利；单次 turmoil 不能解释常态全部折价。' },
    { id: 44, authors: 'Jonathan Brogaard, Davidson Heath & Da Huang', year: '2026', title: 'ETF Sampling and Index Arbitrage', publication: 'Journal of Financial and Quantitative Analysis, 61(2), 547–579', url: 'https://doi.org/10.1017/S0022109025102378', use: '显示 ETF baskets 会系统性省略部分不流动指数成分，使 index、holdings 与 basket 不同；样本为 2015–2019 美国股票 ETF。' },
    { id: 45, authors: 'Richard B. Evans, Rabih Moussawi, Michael S. Pagano & John Sedunov', year: '2026', title: 'Operational Shorting and ETF Liquidity Provision', publication: 'Journal of Financial Economics, 180, 104241', url: 'https://doi.org/10.1016/j.jfineco.2026.104241', use: '说明 market maker 可先卖出尚未创建的 ETF shares、稍后 creation 交割；专有美国数据不支持把全部 short interest 或 FTD 都归为此渠道。' },
    { id: 46, authors: 'Marta Khomyn, Tālis J. Putniņš & Marius Zoican', year: '2024', title: 'The Value of ETF Liquidity', publication: 'Review of Financial Studies, 37(10), 3092–3148', url: 'https://doi.org/10.1093/rfs/hhae041', use: '解释同指数 ETF 如何因二级流动性形成客户分层、费用租金和先发优势；样本集中于美国 plain-vanilla 股票 ETF。' },
    { id: 47, authors: 'Rabih Moussawi, Ke Shen & Raisa Velthuis', year: '2025', title: 'The Role of Taxes in the Rise of ETFs', publication: 'Review of Financial Studies, 38(10), 2988–3039', url: 'https://doi.org/10.1093/rfs/hhaf044', use: '量化 in-kind redemptions、heartbeat trades、税收客户群与 ETF 增长；结论针对美国 RIC 和应税投资者。' },
    { id: 48, authors: 'Naz Koont, Yiming Ma, Ľuboš Pástor & Yao Zeng', year: '2025', title: 'Steering a Ship in Illiquid Waters: Active Management of Passive Funds', publication: 'Review of Financial Studies, 38(10), 2887–2935', url: 'https://doi.org/10.1093/rfs/hhaf034', use: '说明公司债 ETF 主动选择含现金和部分资产的 baskets，在 tracking 与 liquidity transformation 间权衡；方向随申赎失衡而变。' },
    { id: 49, authors: 'Sirio Aramonte & Fernando Avalos', year: '2020', accessedAt: '2026-08-29', title: 'The Recent Distress in Corporate Bond Markets: Cues from ETFs', publication: 'BIS Bulletin No. 6, 14 April 2020', url: 'https://www.bis.org/publ/bisbull06.htm', use: '说明 2020 压力期公司债 ETF 折价可能反映 stale NAV、交易成本和风险承受下降；不提供所有折价的单一解释。' },
    { id: 50, authors: 'United States Oil Fund, LP', year: '2020', accessedAt: '2026-08-29', title: 'Current Report on Form 8-K — Resumption of Creation Baskets', publication: 'SEC EDGAR filing, 12 June 2020', url: 'https://www.sec.gov/Archives/edgar/data/1327068/000117120020000430/i20391_uso-8k.htm', use: '记录新增十亿股注册生效后恢复 creation baskets，形成机制重新开放时点；不能把期间全部价差变化归因于开关。' },
    { id: 51, authors: 'U.S. Securities and Exchange Commission', year: '2021', accessedAt: '2026-08-29', title: 'In the Matter of United States Commodity Funds LLC and United States Oil Fund, LP', publication: 'Securities Act Release No. 11006, 8 November 2021', url: 'https://www.sec.gov/litigation/admin/2021/33-11006.pdf', use: '提供 USO 份额耗尽、FCM 限制、披露缺失与恢复发行的监管 findings；和解令针对该商品池，不是一般 ETF 规则。' },
    { id: 52, authors: 'NYSE Arca, Inc.', year: '2026', accessedAt: '2026-08-29', title: 'Form 19b-4 — SR-NYSEArca-2026-09', publication: 'Official proposed rule filing, pp. 14–15', url: 'https://www.nyse.com/publicdocs/nyse/markets/nyse-arca/rule-filings/filings/2026/SR-NYSEArca-2026-09.pdf', use: '以具体产品备案说明 IIV 每 15 秒发布、用前一日 NAV 基础更新，却不应视为每日 NAV 的实时更新；该口径只适用于文件所述产品，不能外推成所有 IIV 的统一方法。' },
    { id: 53, authors: 'U.S. Securities and Exchange Commission', year: 'current', accessedAt: '2026-08-29', title: '17 CFR § 270.2a-4 — Definition of Current Net Asset Value', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-270/section-270.2a-4', use: '提供注册投资公司 current NAV 的估值与应计基础；定义周期性 NAV，而非可交易实时 iNAV 或同步可执行 V*。' },
    { id: 54, authors: 'Narat Charupat & Peter Miu', year: '2011', title: 'The Pricing and Performance of Leveraged Exchange-Traded Funds', publication: 'Journal of Banking & Finance, 35(4), 966–977', url: 'https://doi.org/10.1016/j.jbankfin.2010.09.012', use: '提供 leveraged ETF 定价、复利与加拿大产品结构证据；时期、法域和 cash / in-kind 安排限制外推。' },
    { id: 55, authors: 'Ayan Bhattacharya & Maureen O’Hara', year: '2018', title: 'Can ETFs Increase Market Fragility? Effect of Information Linkages in ETF Markets', publication: 'SSRN Scholarly Paper, revised 17 April 2018', url: 'https://doi.org/10.2139/ssrn.2740699', use: '建立跨市场学习既可能聚合信息，也可能产生 herding 与持续局部错位的理论；未同行评审的风格化模型不是脆弱性量化。' },
  ],
  readingList: [
    { title: 'SEC Rule 6c-11 — Current eCFR', scope: '§270.6c-11(a)、(c)(1)–(4)、(d)', reason: '先从现行法条掌握 AP、basket、creation unit、网站披露、custom basket 与 recordkeeping 的精确定义。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-270/section-270.6c-11' },
    { title: 'SEC ETF Adopting Release (2019)', scope: 'I.B；II.C.1–6；IV.B.3–4', reason: '把法条背后的一级市场、套利、持仓披露、篮子与市场参与者经济逻辑连起来，并识别采用时与现行规则的差别。', url: 'https://www.sec.gov/files/rules/final/2019/33-10695.pdf' },
    { title: 'SEC Updated Investor Bulletin (2023)', scope: 'What is an ETF；How ETFs work；Risks and benefits', reason: '用监管机构的零背景语言复习 NAV、AP、creation unit、spread 与产品边界，再回到本节公式。', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-24' },
    { title: 'Cboe Indicative Value Calculation Guide (2026)', scope: 'Sections 2–3', reason: '逐字段理解 iNAV 如何由日度持仓、实时 / 理论价格、FX、现金和份额计算，以及 stale input 怎样进入。', url: 'https://cdn.cboe.com/api/global/us_indices/governance/Cboe_Indicative_Value_Calculation_Service-Guide.pdf' },
    { title: 'Lettau & Madhavan (2018)', scope: '全文，重点为 ETF mechanics、arbitrage 与 market quality', reason: '最适合在完成本节后建立经济学版全景，并把产品结构与价格发现、流动性和成本连接。', url: 'https://doi.org/10.1257/jep.32.1.135' },
    { title: 'Madhavan (2016), Exchange-Traded Funds and the New Dynamics of Investing', scope: '一级 / 二级市场、流动性与套利相关章节', reason: '从交易实践、指数和组合应用角度深化全章；阅读时用现行规则更新书中的制度数字。', url: 'https://doi.org/10.1093/acprof:oso/9780190279394.001.0001' },
    { title: 'Engle & Sarkar (2006)', scope: '全文，重点为折溢价测量与国际 ETF', reason: '训练区分 stale NAV、交易时钟和真正可执行价差，并观察早期实证如何处理测量误差。', url: 'https://doi.org/10.3905/jod.2006.635418' },
    { title: 'Petajisto (2017)', scope: '全文，重点为 fair value、交易成本与效率分布', reason: '理解为何 ETF 定价效率应以成本调整的带宽度量，而不是只看 close−NAV。', url: 'https://doi.org/10.2469/faj.v73.n1.7' },
    { title: 'Box et al. (2021)', scope: '全文，重点为 intraday executable quotes', reason: '学习如何从显示折溢价推进到日内两腿可执行套利，并理解“机会稀少”的测量含义。', url: 'https://doi.org/10.1016/j.jfineco.2021.04.023' },
    { title: 'Rappoport & Tuzun (2020)', scope: '全文，重点为 liquidity 与 adjustment dynamics', reason: '观察 ETF 与底层流动性如何改变收敛速度，并练习不把 Granger 关系过度解释成结构因果。', url: 'https://doi.org/10.17016/FEDS.2020.097' },
    { title: 'ICI: Role and Activities of Authorized Participants (2015)', scope: 'AP role、agency creation、active versus contracted APs', reason: '建立 AP、做市商、客户和二级流动性分工；同时保留行业调查的样本与利益相关边界。', url: 'https://www.ici.org/system/files/attachments/ppr_15_aps_etfs.pdf' },
    { title: 'FIMSAC Subcommittee Bond ETF Report (2019)', scope: 'Sections 2.2–2.3 与 stress discussion', reason: '从监管咨询材料理解 bond ETF 套利和 step-away 风险，并注意文件不代表 SEC 结论。', url: 'https://www.sec.gov/spotlight/fixed-income-advisory-committee/etfs-and-bond-funds-subcommittee-report-041519.pdf' },
    { title: 'Todorov (2021), Anatomy of Bond ETF Arbitrage', scope: '全文与 Graphs 2–5', reason: '掌握 fractional basket、holdings wedge、dealer inventory 和两层流动性，是债券 ETF 机制的核心读物。', url: 'https://www.bis.org/publ/qtrpdf/r_qt2103d.htm' },
    { title: 'Pan & Zeng (2017)', scope: '模型、inventory conflict 与公司债证据', reason: '深入理解 AP 同时作为底层 dealer 时，为什么申赎动机和 price-gap arbitrage 可能分离。', url: 'https://www.esrb.europa.eu/pub/pdf/wp/esrb.wp59.en.pdf' },
    { title: 'Koont et al. (2025)', scope: 'basket choice、cash 与被动基金主动管理', reason: '把 custom basket 从合规名词推进为 tracking—liquidity transformation 的组合优化问题。', url: 'https://doi.org/10.1093/rfs/hhaf034' },
    { title: 'Finnerty, Reisel & Zhong (2025)', scope: 'creation / redemption baskets 与 bond liquidity', reason: '观察进入篮子的债券如何变化，并把执行成本、库存与后续流动性区分。', url: 'https://doi.org/10.1017/S0022109024000346' },
    { title: 'Raddatz (2025)', scope: 'Dash-for-Cash、AP capital space 与 bond ETF arbitrage', reason: '研究本节最关键的 1.20 接口：监管资本和资产负债表空间怎样改变压力期套利强度。', url: 'https://doi.org/10.1016/j.jbankfin.2025.107499' },
    { title: 'SEC August 24, 2015 Research Note', scope: 'Executive Summary、Sections IV–VI', reason: '沿分钟级时序复原成分股开盘、LULD、深度和 ETP 异常价格，避免只记“flash crash”标签。', url: 'https://www.sec.gov/files/marketstructure/research/equity_market_volatility.pdf' },
    { title: 'Bank of England Interim FSR (May 2020)', scope: 'Market-based finance box on bond funds and ETFs', reason: '阅读 5% 折价的原始上下文，区分 ETF 价格发现、开放式基金 first-mover advantage 与压力期估值。', url: 'https://www.bankofengland.co.uk/-/media/boe/files/financial-stability-report/2020/may-2020.pdf' },
    { title: 'Bank of England ETF Price Signal Analysis (2021)', scope: '全文与 regression caveats', reason: '用 0.28% 结果练习“条件关联”语言，不把预测关系误写成 ETF 造成下一日 NAV 下跌。', url: 'https://www.bankofengland.co.uk/bank-overground/2021/did-movements-exchange-traded-funds-act-as-price-signal-open-ended-fund-investors' },
    { title: 'USO 2023 Prospectus', scope: 'creation suspension 与 historical premium disclosure', reason: '从发行人原始文件复原 36%、8.66%、1.45% 和 90 分钟估值时差，并确认 USO 的 commodity-pool 边界。', url: 'https://www.sec.gov/Archives/edgar/data/1327068/000117120023000283/i23236_uso-424b3.htm' },
    { title: 'Poterba & Shoven (2002)', scope: '全文', reason: '建立美国 ETF 税后效率的早期基准，再与 §852(b)(6) 和现代 heartbeat / basket 研究对照。', url: 'https://doi.org/10.1257/000282802320191732' },
    { title: 'Moussawi, Shen & Velthuis (2025)', scope: 'in-kind redemptions、heartbeat trades 与 tax clientele', reason: '把“税务效率”从宣传语拆成法制、交易和客户群机制，同时保留美国 RIC 的适用边界。', url: 'https://doi.org/10.1093/rfs/hhaf044' },
    { title: 'Avellaneda & Zhang (2010)', scope: 'daily reset、path dependence 与 volatility drag', reason: '严格理解 leveraged ETF 多日回报为何偏离简单倍数，并与市价—NAV 套利误差分开。', url: 'https://doi.org/10.1137/090760805' },
  ],
};
