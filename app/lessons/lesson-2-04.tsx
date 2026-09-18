import PassiveFundLab from '../components/PassiveFundLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson204Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>被动资金并不是“什么都不判断、什么都不交易”的钱；它把判断从逐只证券的收益预测，迁移到了规则选择、复制误差、资金账本与执行时钟。</h2>
        <p>
          主动管理人通常先形成“哪项资产相对更值得持有”的判断，再在授权与成本内配置；被动指数基金则先接受一个外部或合同规定的目标坐标：某个指数、某种复制方式与某组容许偏离。它不必预测成分股明天涨跌，仍必须回答今天是否已有净申赎、指数权重何时生效、公司行动怎样处理、现金与税费怎样进入净值、难交易成分是否抽样、订单应在公告后提前做还是挤到生效收盘。只要这些状态改变，基金就会生成真实买卖需求。Frino 与 Gallagher 对早期 S&amp;P 500 指数基金的研究把问题说得很清楚：指数是没有交易摩擦的纸面组合，基金却必须在有费用、有资金流、有成交成本的现实市场里复制它。<Cite n={11} />
        </p>
        <p>
          这里最容易犯的错误，是把 <b>passive、index fund 与 ETF</b> 当成三个同义词。Passive 描述组合决策相对某套规则的裁量方式；index fund 描述以指数回报为目标的投资策略；ETF 描述份额在交易所成交，并通常有大额一级申赎接口的产品载体。指数基金可以不是 ETF，ETF 也可以主动管理。美国监管说明一直把主动与被动 ETF 都放在 ETF 载体下；中国上交所自 2026 年 6 月 17 日起实施主动 ETF 指引，更直接地证明“ETF＝被动”在制度上已经不成立。<Cite n={1} /><Cite n={2} /><Cite n={4} />
        </p>
        <p>
          因此，本节不是重讲 1.21 的 ETF 折溢价套利，而是追问一个更靠近参与者目标的问题：<b>当投资人现金流、指数规则、基金现有持仓与实施摩擦共同变化时，被动管理人怎样把一个不可交易的指数转换成可结算订单；这些可预期订单又怎样吸引流动性供给、抢跑与套利，并通过价格、跟踪结果和下一轮资金流反馈回来？</b>
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>完整链条不是“指数涨了 → ETF 买入”，而是“规则状态与资金状态 → 目标暴露 → 实施选择 → 订单 → 市场响应 → 追踪结果 → 新状态”。</h2>
        <div className="mechanism-chain" aria-label="被动资金从规则到反馈的八步因果链">
          <div><span>01</span><b>定义目标</b><p>基金合同指定指数、回报版本、复制容差与可用工具。</p></div>
          <div><span>02</span><b>读取规则</b><p>指数提供商发布成分、权重、公司行动和生效时钟。</p></div>
          <div><span>03</span><b>更新规模</b><p>确认现金申赎，或 ETF creation / redemption 与篮子交付。</p></div>
          <div><span>04</span><b>构造组合</b><p>在全复制、抽样、衍生品与现金之间选择目标暴露。</p></div>
          <div><span>05</span><b>计算缺口</b><p>目标减去现有、在途、篮子与衍生品等价持仓。</p></div>
          <div><span>06</span><b>安排执行</b><p>权衡提前偏离、收盘拥挤、冲击、税费与失败风险。</p></div>
          <div><span>07</span><b>形成价格</b><p>基金订单与预期交易、做市库存和流动性供给共同成交。</p></div>
          <div><span>08</span><b>反馈更新</b><p>跟踪差异、费用、折溢价与体验影响资金流和产品治理。</p></div>
        </div>
        <p>
          这条链里没有任何一步要求基金经理相信“新增成分被低估”。订单可以完全由规则产生；但规则产生不代表订单没有信息或没有策略。指数提供商选择了什么市场、资格阈值、自由流通口径、权重上限和生效日，基金选择了什么复制与执行方法，套利者又会根据公开时钟提前布局。被动只是把裁量的位置改变了，不是把裁量从系统中删除。S&amp;P DJI 对指数方法的官方说明也明确把资格、权重、成分维护与更新时钟列为方法核心；IOSCO 则要求基准管理人对方法、治理与问责承担责任。<Cite n={7} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围与先修</p>
        <h2>本节研究“被动管理人怎样生成订单”；ETF 一级市场只作为传导接口，不再重复完整套利账本。</h2>
        <p>
          硬先修是 1.21：要先能区分 ETF 二级成交、AP 的 creation / redemption、基金持仓与 NAV；以及 2.01：同一产品中的最终投资人、指数提供商、基金顾问、交易台、AP 与做市商具有不同目标和约束。建议按需回看 1.09 的价格冲击、1.20 的融资约束与 2.03 的目标权重到母订单。若不具备这些接口，很容易把“投资者买 ETF”写成“基金立即拿钱买全部成分”，或把指数变更后上涨写成基金经理看好。
        </p>
        <div className="learning-objectives">
          <span>七阶段学习路线 · 从分类到可证伪研究</span>
          <ol>
            <li><b>分类与主体（03–07）：</b>把策略、基准与载体三条轴分开，再识别谁制定规则、谁持有资产、谁提交订单。</li>
            <li><b>资金与指数账本（08–16）：</b>比较现金申赎与 ETF 两级市场，理解市值加权、自我漂移、divisor 与回报版本。</li>
            <li><b>目标到订单（17–21）：</b>用统一恒等式分开资金流、规则换权、公司行动、现有偏离与在途暴露。</li>
            <li><b>复制与追踪（22–29）：</b>区分 Tracking Difference / Error，并在全复制、抽样与合成复制间求解总成本。</li>
            <li><b>调仓与价格（30–41）：</b>解释公告、生效、收盘竞价和预期交易，再审计价格压力、需求曲线、信息与选择。</li>
            <li><b>制度、所有权与边界（42–48）：</b>把指数治理、投票、证券借贷、中国制度、跨境与固定收益放回各自约束。</li>
            <li><b>研究与练习（49–53）：</b>把世界模型压缩为数据字段、事件设计、八题实验、主动练习与课程接口。</li>
          </ol>
          <p><b>时间预算：</b>首次主线阅读约 90–110 分钟；互动实验快速 20–25 分钟，完整复盘约 35–45 分钟；主动练习与理解检查快速约 23–30 分钟，完整完成约 45–60 分钟；课程接口另需 3–4 分钟。建议分两次完成，参考文献与延伸阅读不计。</p>
          <p><b>零基础术语桥：</b>1 bp（basis point，基点）等于 0.01 个百分点；beta 指组合随整体市场方向变化的暴露；alpha 指相对基准的主动收益判断；mandate 是基金合同与治理形成的投资授权；venue 是交易场所；Q/ADV 是订单金额相对日均成交额的比例。后文保留英文，是为了与产品文件和研究论文对接。</p>
        </div>
      </section>

      <section className="lesson-section" id="three-axes">
        <p className="section-kicker">阶段一 · 分类与主体　|　03 · 三条分类轴</p>
        <h2>“是否预测”“是否跟踪指数”“是否在交易所交易”回答三个不同问题。</h2>
        <div className="table-scroll" role="region" aria-label="被动策略、指数目标和ETF载体三条分类轴，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">策略裁量、目标坐标与份额载体的分类边界</caption>
            <thead><tr><th scope="col">轴</th><th scope="col">它回答什么</th><th scope="col">不能据此推出什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Active ↔ Passive</th><td>证券选择和权重是否主要服从预先指定规则 / 基准，经理有多大相对裁量</td><td>不能推出费用高低、是否上市、是否频繁交易或治理是否积极</td></tr>
              <tr><th scope="row">Index-tracking ↔ Non-index</th><td>产品是否以某一指数回报或暴露为明确目标</td><td>不能推出一定全复制，也不能推出指数本身没有设计判断</td></tr>
              <tr><th scope="row">ETF ↔ Non-ETF wrapper</th><td>份额是否在交易所成交，是否具有大额一级市场接口</td><td>不能推出组合主动 / 被动，也不能推出二级价格等于 NAV</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          实务分类还可能出现规则型但不许可使用“index”名称的产品、enhanced index（增强指数，允许有限主动偏离）、smart beta（用因子或其他规则替代纯市值权重）、主动 ETF、指数共同基金和 ETF feeder（主要投资目标 ETF 的联接基金）。判断时不要先看营销标签，而要看基金合同 / prospectus：投资目标是什么，目标指数是否被点名，允许偏离多少，组合顾问能否因主观预期改变证券与权重，份额怎样申赎与成交。SEC 的投资者材料明确指出，有些 ETF 被动追踪指数，有些由顾问主动买卖；2026 年上交所主动 ETF 指引又把“不以跟踪特定指数为投资目标”写入主动 ETF 的定义。<Cite n={1} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="passive-definition">
        <p className="section-kicker">04 · Passive 的可操作定义</p>
        <h2>被动不是“没有人做决定”，而是把证券层目标函数锚定在外生规则，并限制经理以观点改变相对暴露。</h2>
        <p>
          对本节而言，一项策略越被动，组合目标越能由当期规则、资金规模和公开状态重建，而不是依赖经理未公开的预期收益排序。若指数规定 A 权重 4%、B 权重 2%，基金不会因为研究员更喜欢 B 就把二者对调；但它可能因为 A 暂停交易、税负异常、最小交易单位或流动性太差而暂时抽样，并用期货或相近证券维持风险暴露。这里的裁量服务于复制，不是把基金重新变成主动选股。
        </p>
        <p>
          这个定义也解释了为何“被动基金交易很少”并非定理。一个稳定的大盘市值加权指数可能低换手；每日重置的杠杆指数、等权指数、波动控制指数或频繁换仓的因子指数，却能在没有主观选股的情况下持续交易。交易频率来自规则状态变化与资金流，不来自 passive 这个标签本身。指数方法文件而非基金名字，才决定哪些输入会触发权重变化。<Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="index-fund-definition">
        <p className="section-kicker">05 · Index Fund</p>
        <h2>指数基金持有的是资产与合约，指数本身只是一套计算规则；基金不可能字面上“买入指数”。</h2>
        <p>
          指数把一组证券价格、股数、自由流通因子、汇率、公司行动与除数映射成一个数值序列。它没有法律人格、现金账户、税单、申赎、交易成本或可结算头寸。指数基金则是实际资产池：投资人拥有基金份额，基金持有证券、现金、期货、掉期或其他允许资产，并承担费用、税和执行误差。所谓“追踪指数”，是让基金净值回报尽量接近指定指数版本，而不是把一个抽象数值买进托管账户。S&amp;P DJI 的数学方法特别区分指数与组合，并用 divisor 保持成分变更时指数水平连续；这不代表真实基金换仓没有成本。<Cite n={8} />
        </p>
        <div className="precision-note"><span>先问“追踪哪一个指数版本”</span><p>同一成分与权重可以有 price return、gross total return、net total return、不同计价货币和不同汇率时点。基金收到的股息与税后现金若对比错误版本，所谓 tracking gap 可能只是口径错配。</p></div>
      </section>

      <section className="lesson-section" id="etf-definition">
        <p className="section-kicker">06 · ETF</p>
        <h2>ETF 增加的是份额交易与大额申赎架构，不会自动决定基金采用哪套组合规则。</h2>
        <p>
          美国现行 Rule 6c-11 所覆盖的开放式 ETF，是在交易所按市场价格交易份额、并由 AP 用 basket 与 cash balancing amount 交换 creation units 的注册开放式管理公司；规则还允许在政策、审查和记录约束下使用 custom baskets。定义关注份额和篮子机制，而不是要求产品必须追踪指数。<Cite n={2} /><Cite n={3} />
        </p>
        <p>
          中国现行上交所指数 ETF 细则将交易所交易基金定义为投资特定指数对应组合证券或合同约定标的、份额用组合证券、现金或其他对价申赎并上市交易的开放式基金；2026 年另设主动 ETF 指引后，两类产品在同一 ETF 载体轴上并存。法域之间的 AP / 参与券商、申赎代理、清算时钟和现金替代安排不能自动互换，实际交易仍以具体规则与产品文件为准。<Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="actor-map">
        <p className="section-kicker">07 · 七类主体</p>
        <h2>“被动资金买入”至少可能指七个节点中的不同动作；没有主体分解，就没有因果解释。</h2>
        <div className="table-scroll" role="region" aria-label="被动投资生态七类主体的目标和动作，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">最终投资人、指数提供商、基金治理层、组合经理、交易台、AP做市商和套利者的分工</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">控制的动作</th><th scope="col">主要约束</th></tr></thead>
            <tbody>
              <tr><th scope="row">最终投资人</th><td>选择产品、买卖或申赎份额</td><td>资产配置、费用、税、流动性与行为偏差</td></tr>
              <tr><th scope="row">指数提供商</th><td>定义宇宙、资格、权重、公司行动与生效日</td><td>方法目标、数据、治理、利益冲突与可复制性</td></tr>
              <tr><th scope="row">基金董事会 / 管理人</th><td>采纳基准、监督顾问、披露与治理</td><td>受托义务、合同、监管和持有人利益</td></tr>
              <tr><th scope="row">被动组合经理</th><td>选择复制、现金、期货、篮子与调仓时点</td><td>追踪目标、成本、税、流动性与操作风险</td></tr>
              <tr><th scope="row">交易台</th><td>把目标缺口拆成订单并执行</td><td>冲击、信息泄漏、截止时点与成交风险</td></tr>
              <tr><th scope="row">AP / 做市商</th><td>一级申赎或二级报价、库存和对冲</td><td>利润、资本、借券、清算与客户流</td></tr>
              <tr><th scope="row">预期交易者</th><td>公告后提前买卖新增 / 删除证券并供给流动性</td><td>预测误差、拥挤、基差和退出时钟</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          同一金融集团可以兼任基金顾问、做市商或 AP，但法律责任、账本和订单动机仍须分别识别。尤其不要把指数提供商的成分决定当成基金经理“看好”，也不要把 AP 为修复库存提交的 creation 当成终端投资人新增配置。Lettau 与 Madhavan 的 ETF 综述与 SEC 规则经济分析都强调一级、二级市场及角色分工；本节在此基础上把组合管理层补回系统。<Cite n={3} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="cash-subscription-ledger">
        <p className="section-kicker">阶段二 · 资金与指数账本　|　08 · 现金申赎指数基金</p>
        <h2>传统开放式指数基金的投资人申购把现金直接送入基金账本，经理因此通常需要建立目标暴露。</h2>
        <p>
          假设基金在日终按下一次计算的 NAV 接受 1,000 万元净申购。份额确认后，基金资产与份额增加；若目标是保持 2% 现金缓冲，其余 980 万元需要按复制策略变成证券或衍生品暴露。经理可以先用期货迅速取得 beta（整体市场方向暴露），再逐步买入成分；也可以用现货直接配置。现金真正进入基金，因此即使没有任何二级“基金份额成交”，基金仍会形成市场订单。
        </p>
        <div className="equation-card">
          <span>现金申购后的待配置规模</span>
          <div>DeployableFlow<sub>t</sub>=NetCashFlow<sub>t</sub>−ΔCashBuffer<sub>t</sub>−FeesPayable<sub>t</sub></div>
          <p>所有项使用同一货币和同一确认时点。NetCashFlow 为基金已确认的申购减赎回现金；现金缓冲增加会减少本轮可投金额，下降则释放金额；应付费用单列以免把运营支出误当投资。这个数只给出组合层净额，不决定每只证券的方向。</p>
        </div>
      </section>

      <section className="lesson-section" id="etf-secondary-ledger">
        <p className="section-kicker">09 · ETF 二级市场账本</p>
        <h2>二级市场买入把钱交给份额卖方，不是交给基金；成交额不能直接叫“流入”。</h2>
        <p>
          甲在交易所用 500 万元买入乙持有的 ETF，ETF 份额只从乙的账户转到甲，基金现金、持仓和在外份额数均不改变。若卖方供给足够，巨大成交量也可以没有净 creation。只有持续单边需求耗尽自然卖方与做市库存，做市商或客户再经 AP 把 basket / cash 交给基金并取得新增 creation units，一级账本才改变。SEC 的 ETF 规则经济分析把这种“绝大多数交易发生在二级市场、一级活动并非每天发生”的结构视为 ETF 的核心特征。<Cite n={3} />
        </p>
        <div className="precision-note"><span>三种量不能混写</span><p>ETF turnover 是既有份额转手；net creation 是在外份额净增加；fund portfolio trades 是基金或代表基金执行的底层订单。三者能通过库存、篮子和现金连接，但既不同时发生，也不必金额相等。</p></div>
      </section>

      <section className="lesson-section" id="etf-primary-ledger">
        <p className="section-kicker">10 · ETF 一级市场与库存缓冲</p>
        <h2>Creation 改变份额与基金资产，却仍不保证同额公开市场买盘在同一时刻出现。</h2>
        <p>
          In-kind creation 中，AP 可以交付自己已有的证券库存，基金取得资产并发行份额；基金不必再拿现金逐只买入。现金 creation 更可能让基金或其代理随后交易；custom basket 又可能只交付一部分持仓或不同组合。做市商还可以先卖出库存或 operationally short 份额，随后才 creation 补库。因此从客户买单到成分股订单之间存在卖方库存、做市库存、对冲与篮子四层缓冲。Rule 6c-11 对 basket、custom basket 与记录的要求，以及 1.21 的完整账本，正是为了让这些中间状态可识别。<Cite n={2} /><Cite n={3} />
        </p>
        <p>
          债券 ETF 把这种差异推到极端：指数可能含数千只债券，基金持有其子集，当日 creation basket 又是另一子集。Koont 等人的研究显示，被动公司债 ETF 会主动选择含现金和部分债券的篮子，在追踪与流动性转换之间权衡；Brogaard 等人则记录美国股票 ETF 对较不流动成分的系统性抽样。因此，net creation 乘指数权重只是粗代理，不是可验证的证券级订单。Brown、Davies 与 Ringgenberg 把一级活动构造为非基本面需求代理的研究，也明确依赖模型与持仓映射，而不是把每笔 creation 直接等同成分订单。<Cite n={14} /><Cite n={15} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="flow-measurement">
        <p className="section-kicker">11 · 资金流测量</p>
        <h2>同一个“ETF 流入 10 亿元”可以指成交、份额净增或资产增长；研究前必须先重建口径。</h2>
        <div className="equation-card">
          <span>ETF 可比份额法净 creation 近似</span>
          <div>NetCreationValue<sub>t</sub>≈(N<sub>t</sub><sup>adj</sup>−N<sub>t−1</sub><sup>adj</sup>)×NAV<sub>t</sub></div>
          <p>N<sup>adj</sup> 是统一到同一份额单位后的在外份额数：若 t 日发生拆并份，应把 t−1 日份额按同一比例重述，而不是把技术性份额变化算成资金流。NAV 是与该份额单位和确认时点匹配的每份净值。结果仍只是日度净值口径近似，不能显示 gross creations 与 gross redemptions 同时发生，也不能告诉我们 basket 是现金还是实物、谁发起或何时对冲。</p>
        </div>
        <p>
          资产管理规模从 100 增至 110 亿元，不代表净流入 10 亿元，因为已有资产回报也改变 AUM。二级成交 50 亿元也不代表 50 亿元流入，因为每笔成交同时有买方和卖方。最小研究表应并列 AUM、基金回报、在外份额、NAV、gross / net units、二级成交额与实际 basket；若只能观察其中一项，就把结论写成代理而非事实。
        </p>
      </section>

      <section className="lesson-section" id="index-weight-math">
        <p className="section-kicker">12 · 市值加权数学</p>
        <h2>流通市值权重把价格、可计入股数与自由流通因子共同映射为目标；价格只是其中一个输入。</h2>
        <div className="equation-card">
          <span>简化的自由流通市值权重</span>
          <div>b<sub>i,t</sub>=M<sub>i,t</sub>/Σ<sub>j∈I<sub>t</sub></sub>M<sub>j,t</sub>，　M<sub>i,t</sub>=P<sub>i,t</sub>S<sub>i,t</sub>FIF<sub>i,t</sub></div>
          <p>b 是证券 i 在指数中的无量纲权重；P 是每股价格，S 是方法认可的股数，FIF 是 0 到 1 之间的自由流通纳入因子，I 是当期成分集合。具体指数还可能使用权重上限、缓冲带、外资可投资比例或其他调整，必须回到方法文件。<Cite n={8} /><Cite n={9} /></p>
        </div>
        <p>
          如果 A 的价格上涨而 S、FIF 与成分集合不变，A 的指数权重会自然上升；持有固定股数 A 的全复制基金市值也同步上升。反之，发行新股、回购、控股股东减持使自由流通变化、外资限制调整或指数换入换出，即使价格不动也会改变目标股数。把所有权重变化都叫“指数基金追涨杀跌”，会把无需交易的价格漂移与真正规则事件混在一起。<Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="self-rebalancing">
        <p className="section-kicker">13 · 市值权重的自我再平衡</p>
        <h2>在理想全复制、无资金流和股数不变时，纯价格变化不会产生为维持市值权重而进行的交易。</h2>
        <p>
          假设指数与基金都持有 A/B 的同一可计入股数比例，初始市值 60/40。A 上涨 10% 后，二者同时变成 66/40，权重同时变为约 62.26%/37.74%；基金无需再买 A。市值加权指数在这个严格意义上“自我再平衡”。这不是说基金永远不交易，而是说要寻找订单必须先把权重变化分成<b>由持仓价格本身产生的共同漂移</b>与<b>由现金流、股数、成分、自由流通或复制误差产生的目标缺口</b>。
        </p>
        <p>
          一个常见错误公式是直接用 AUM×(今日指数权重−昨日指数权重) 当作订单。若权重差来自证券价格，而基金现有持仓市值也按同一价格更新，这样会重复计算。正确做法是先把现有股数用当前可执行价格重估，再与当前目标股数比较；只有剩余缺口才是母订单。
        </p>
      </section>

      <section className="lesson-section" id="non-cap-rebalancing">
        <p className="section-kicker">14 · 非市值权重与显式再平衡</p>
        <h2>等权、因子、风险控制与每日杠杆规则不会随价格自动保持目标，因此可在固定时钟持续产生机械交易。</h2>
        <p>
          两只股票起初各 50%，A 上涨、B 不动后，等权组合会让 A 超过 50%；下次再平衡需要卖 A、买 B。因子指数会因估值、质量、动量或波动输入更新权重；波动控制指数会在估计波动变化时调节风险资产与现金；每日杠杆产品则按每日目标重置衍生品暴露。它们都可以规则化，却具有完全不同的换手、顺逆势方向和收盘需求。
        </p>
        <p>
          因而“被动资金对市场的影响”没有一个统一符号。市值加权资金流通常按当前规模配置；等权再平衡更像卖相对赢家、买相对输家；动量指数可能相反；波动控制规则在波动上升时减风险；杠杆 ETF 的日内再平衡方向依当日回报与资产变化。任何实证都必须先把指数方法翻译成可计算需求函数，再谈总体冲击。<Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="divisor-corporate-actions">
        <p className="section-kicker">15 · Divisor 与公司行动</p>
        <h2>指数除数让指数水平在技术变更时连续，却不能替真实基金支付现金、交税或完成证券交割。</h2>
        <p>
          一个简化指数水平可写成 Index<sub>t</sub>=ΣM<sub>i,t</sub>/D<sub>t</sub>。当成分替换、可计入股数或自由流通因子更新，以及其他事件改变纳入市值，但方法不希望指数仅因技术换表跳变时，提供商会调整 divisor D 保持连续。市值加权指数中的拆股通常由股数增加与价格同比例下降相互抵消，市值不变，因而无需调整 divisor；价格加权指数等其他类型可能不同，必须以具体方法为准。这个算术操作不产生可交易现金。基金面对并购换股、要约、分拆、配股、退市、股息应收与预提税，仍需实际选择、提交指令并处理失败。S&amp;P DJI 的指数数学明确说明 divisor 的连续性作用；MSCI 则用独立公司行动方法规定事件处理。<Cite n={8} /><Cite n={9} />
        </p>
        <p>
          公司行动也能造成看似“被动”的主动时钟。例如指数可能在事件生效日按方法立即删除被收购公司，基金却因结算延迟数日后才收到现金；权利受限或海外资产停牌时，基金不能同步交易；spin-off 可能先进入持仓再由指数决定保留或删除。Tracking gap 在此不是经理观点，而是指数纸面处理与法律资产交割之间的时间差。
        </p>
      </section>

      <section className="lesson-section" id="return-versions">
        <p className="section-kicker">16 · 价格、总回报与税后版本</p>
        <h2>复制目标必须在成分、权重、股息、税、汇率与估值时钟上同口径；“同名指数”还不够。</h2>
        <p>
          Price return 指数不把现金股息再投资；gross total return 通常假设税前股息再投资；net total return 使用方法预设的预提税率；货币对冲版本还加入外汇远期与滚动。真实基金收到的股息时点、适用税率、证券借贷补偿付款和汇率可能与指数假设不同。于是基金可以执行完全正确，仍稳定领先或落后某一版本。
        </p>
        <p>
          在跨境比较中，先保存完整 benchmark identifier、回报类型、币种、当地收盘与 FX fix；不要用美元 ETF 的净值回报直接减去人民币价格指数。ESMA 指数追踪 UCITS 指引要求披露追踪政策、预期 tracking error 及可能影响追踪能力的因素，这类披露正是为防止把不同目标口径混成“复制失败”。<Cite n={6} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="unified-order-identity">
        <p className="section-kicker">阶段三 · 目标到订单　|　17 · 统一订单恒等式</p>
        <h2>规则权重不是订单；订单是当前时点目标经济暴露减去一切已经拥有或在途的等价暴露。</h2>
        <div className="equation-card">
          <span>证券 i 的目标与母订单</span>
          <div>TargetValue<sub>i,t</sub>=A*<sub>t</sub>w*<sub>i,t</sub>，　OrderValue<sub>i,t</sub>=TargetValue<sub>i,t</sub>−H<sub>i,t</sub>−Pending<sub>i,t</sub>−EquivalentExposure<sub>i,t</sub></div>
          <p>A* 是交易后目标净资产，w* 是经理在 mandate（投资授权）内选择的目标权重；H 是当前持仓按同一价格截面重估的市值，Pending 是已下达未完成订单，EquivalentExposure 把期货、掉期、申赎篮子或替代证券按 hedge ratio 映射到证券 / 因子暴露。正值表示仍需增加，负值表示仍需减少。不同资产不能在没有映射模型时直接相减。</p>
        </div>
        <p>
          目标股数还需用预计成交价格换算，并服从整手、最小申赎单位、停牌、涨跌幅、外资额度、期货乘数和现金可用时点。交易台随后决定交易场所（venue）、限价、算法、收盘竞价参与和跨日拆分。被动经理不预测相对价值，并不意味着订单生成只是把 Excel 权重乘一次 AUM。
        </p>
      </section>

      <section className="lesson-section" id="order-decomposition">
        <p className="section-kicker">18 · 资金流、换权与交叉项</p>
        <h2>在理想起点上，目标变化可拆成“新钱按旧权重配置”“旧资产按新规则换权”与一个交叉项。</h2>
        <div className="equation-card">
          <span>教学分解：忽略价格共同漂移与初始偏离</span>
          <div>ΔTargetValue<sub>i</sub>=b<sub>i</sub>F+AΔb<sub>i</sub>+FΔb<sub>i</sub></div>
          <p>A 是变化前基金资产，F 是已确认净资金流，b 是旧目标权重，Δb 是由成分、股数、自由流通或规则更新造成的目标权重变化。第一项是 flow demand，第二项是原资产 rebalance demand，第三项说明资金流与换权同时发生时不能只把两张独立订单表相加。金额单位必须一致。</p>
        </div>
        <p>
          若基金初始并未精确跟踪，还要减去旧有偏离；若价格在两截面间变化，必须先按当前价格重估 H；若有期货或 basket 在途，也要扣除。最稳妥的生产算法始终回到 17 节的目标减现有恒等式，分解只用于解释经济来源，不能替代逐仓账本。
        </p>
      </section>

      <section className="lesson-section" id="not-all-buys">
        <p className="section-kicker">19 · 净流入不等于“全体成分同向买入”</p>
        <h2>组合层净买入可以包含证券层卖单；指数变更、现有偏离和现金替代决定横截面方向。</h2>
        <p>
          一个 100 百万元基金持有 A/B/C=50/30/20，同时收到 20 百万元净流入，新指数权重变为 40/35/25。交易后目标 48/42/30，因此订单为 −2/+12/+10，合计仍是 +20。流入为市场提供组合层净需求，但 A 因规则低配成为卖出。若 AP 以实物 basket 交付接近目标的 B、C，基金公开市场订单还会进一步缩小。
        </p>
        <p>
          这也是为什么“某 ETF 净流入 × 每只成分当前权重”只能作为按比例的 implied-demand baseline（隐含需求基线），不具有上界或下界性质：规则换权与旧有偏离既可能放大，也可能抵消甚至反转某只证券的方向。要判断个股冲击，至少需要基金旧持仓、新目标、篮子构成、现金比例、衍生品、在途交易与经理执行策略。若数据不可得，应把估计称为情景代理，并用不同假设给出区间，而不是报告伪精确的买入金额。
        </p>
      </section>

      <section className="lesson-section" id="cash-corporate-orders">
        <p className="section-kicker">20 · 现金与公司行动订单</p>
        <h2>即使 AUM 和指数名单都不变，股息、费用、税、期货到期与公司行动也会改变可投资现金和实际暴露。</h2>
        <p>
          基金收到股息后若目标指数假设立即再投资，真实现金在结算前形成 cash drag；管理费按日从 NAV 计提，减少可投资资产；预提税使跨境基金实际收到的现金少于 gross index；期货到期需要 roll；并购、配股与分拆又能交付不同证券或现金。每一项都能生成小额、持续或事件驱动订单，而不含任何相对收益预测。Sammon 与 Shim 对发行、回购和 IPO 引起的指数构成再平衡进行研究，进一步说明市值加权并不等于永不换仓；其 2026 年结果是特定指数与样本下的成本估计，不是普遍拖累常数。<Cite n={25} />
        </p>
        <p>
          证券借贷收入可能抵消部分费用，现金抵押品投资又产生独立风险；赎回时交出低成本税基证券可以改变剩余组合税负。Poterba 与 Shoven 对早期美国 ETF 与传统指数基金的比较说明产品税务结构能够显著改变税后结果，但其 1994–2000 年样本不能直接当作所有法域和当前产品的固定优势。<Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="aggregate-demand">
        <p className="section-kicker">21 · 规模聚合与可预期需求</p>
        <h2>个体基金订单可能很小；大量追踪同一或重叠指数的产品在同一生效点聚合，才形成市场需要吸收的需求冲击。</h2>
        <div className="equation-card">
          <span>证券 i 的教学聚合目标缺口</span>
          <div>Q<sub>i,t</sub><sup>aggregate</sup>=Σ<sub>f=1</sub><sup>F</sup>[TargetValue<sub>i,f,t</sub>−CurrentEquivalentExposure<sub>i,f,t</sub>]</div>
          <p>对每只基金 f，先以同一货币、同一价格截面计算目标缺口，再求和。这个量仍不是必然在公开市场同时执行的净订单：基金可预交易，AP 可用库存，基金之间可交叉，衍生品可临时替代，其他投资者又可能反向供给。</p>
        </div>
        <p>
          市场影响取决于订单相对于可用深度、日成交和风险承受能力的比例，而不是名义金额本身。同样 5 亿元需求进入高流动性大盘股和自由流通很小的证券，会产生完全不同的价格路径。Pavlova 与 Sikorskaya 把各基准权重按跟踪资产聚合成 benchmarking intensity，发现主动与被动管理人都会对加入自身基准的股票增持；这说明“基准化需求”比狭义被动基金持仓更广，但其 Russell cutoff 识别与美国 1998–2018 样本仍有外推边界。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="tracking-difference">
        <p className="section-kicker">阶段四 · 复制与追踪　|　22 · Tracking Difference</p>
        <h2>Tracking Difference 读取基金在一段时间里平均领先或落后多少，保留方向，却不告诉你偏离是否稳定。</h2>
        <div className="equation-card">
          <span>等频样本的平均追踪差异</span>
          <div>a<sub>t</sub>=R<sub>fund,t</sub><sup>NAV</sup>−R<sub>benchmark,t</sub>，　TD̄=(1/T)Σ<sub>t=1</sub><sup>T</sup>a<sub>t</sub></div>
          <p>a 是每一期基金 NAV 总回报减同币种、同税务与同时间戳的基准回报；TD̄ 是算术平均主动回报。负值表示样本期平均落后。若报告累计几何差，应另给 ∏(1+Rfund)/∏(1+Rbenchmark)−1，不能与算术均值无说明互换。</p>
        </div>
        <p>
          费用率常让平均差异偏负，但并非所有差异都等于费用：证券借贷收入可正向抵消，税率和股息时点会改变符号，抽样或交易价格也可能偶尔使基金领先。比较不同产品时还要统一估值频率、份额类别和费用口径；市价回报包含 ETF 折溢价变化，NAV 回报才主要反映基金组合复制，两者回答不同问题。<Cite n={6} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="tracking-error">
        <p className="section-kicker">23 · Tracking Error</p>
        <h2>Tracking Error 是主动回报的波动率；它衡量“不稳定偏离”，不是平均跑输幅度，也不是基金总风险。</h2>
        <div className="equation-card">
          <span>事后样本 Tracking Error</span>
          <div>TE<sub>sample</sub>=√&#123;[1/(T−1)]Σ<sub>t=1</sub><sup>T</sup>(a<sub>t</sub>−ā)<sup>2</sup>&#125;</div>
          <p>a 与上一节同口径，ā 是样本平均主动回报；TE 单位为每期回报百分点且非负。若每年有 m 个等频观察，在序列相关可忽略且口径稳定时常用 TEannual≈√m·TEperiod；否则应直接用适合期限的模型。T 必须大于 1。</p>
        </div>
        <p>
          每月都稳定落后 0.10% 的基金，月度 TD 为 −0.10%，去均值后的 TE 可以为零；每月在 +0.10% 与 −0.10% 间摆动的基金，TD 可以为零，TE 却为正。二者都可能随基准下跌 20%，所以低 TE 也不等于低总风险。ESMA 将 tracking error 定义为指数追踪 UCITS 与指数回报差的波动，与这个区分一致。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="tracking-metric-boundaries">
        <p className="section-kicker">24 · TD、TE、RMS 与折溢价</p>
        <h2>四个看似相近的指标位于不同账本：方向、波动、总偏离与份额市场价格不能混成一个“tracking error”。</h2>
        <div className="table-scroll" role="region" aria-label="四种追踪与定价指标的定义、单位和用途，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Tracking Difference、Tracking Error、RMS tracking difference 与 ETF 折溢价对照</caption>
            <thead><tr><th scope="col">量</th><th scope="col">读取什么</th><th scope="col">关键边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Mean TD</th><td>基金 NAV 回报相对基准的平均方向</td><td>稳定费用拖累会进入；不读不稳定程度</td></tr>
              <tr><th scope="row">TE = sd(a)</th><td>主动回报围绕自身均值的波动</td><td>稳定落后可为零；不是平均落后</td></tr>
              <tr><th scope="row">RMS = √mean(a²)</th><td>围绕零的总偏离幅度</td><td>同时混合均值与波动；精确地，RMS²=TD̄²+[(T−1)/T]TE<sub>sample</sub>²</td></tr>
              <tr><th scope="row">ETF premium/discount</th><td>份额市场价相对某一 NAV / 同步价值的偏离</td><td>位于份额交易层，不是基金组合复制误差</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个 ETF 可以 NAV 完美追踪指数、但二级价格在压力时短暂折价；也可以份额始终贴近 NAV、基金却因费用稳定落后指数。Elton 等人对早期 SPDR 的分析已经把费用、现金拖累、交易结构和折溢价分开；把这些指标压成一个排名会丢掉机制。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="tracking-attribution">
        <p className="section-kicker">25 · 跟踪结果的归因账户</p>
        <h2>平均拖累和波动偏离来自不同通道；归因式用于组织证据，不自动证明每一项的因果贡献。</h2>
        <div className="equation-card">
          <span>教学近似：单期主动回报</span>
          <div>a<sub>t</sub>≈−fee<sub>t</sub>−tradingCost<sub>t</sub>−taxGap<sub>t</sub>+lendingIncome<sub>t</sub>+cash<sub>t</sub>(R<sub>cash,t</sub>−R<sub>index,t</sub>)+ε<sub>sampling,t</sub>+ε<sub>timing,t</sub></div>
          <p>所有项以该期基金资产比例计量。前三项通常是拖累，但 taxGap 可因基准税率与基金实际税率差而有不同符号；借贷收入为正；现金项依市场方向变化；ε 汇总抽样和执行时点残差。真实复利、交互项、估值差与衍生品融资会使等式不精确，所以必须标为近似归因。</p>
        </div>
        <p>
          费用率较稳定时主要影响 TD；季度调仓冲击、停牌和抽样误差更容易抬高 TE；现金在上涨市场拖累、下跌市场可能相对贡献为正；借贷收入能降低平均拖累，却伴随对手、抵押品与投票召回问题。Frino 与 Gallagher 记录的早期指数基金结果说明资金流、市场波动和交易摩擦会使 tracking error 随状态变化，不能用一条固定费率完全解释。<Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="full-replication">
        <p className="section-kicker">26 · Full Replication</p>
        <h2>完全复制尽量持有每一成分及其目标权重，降低结构偏离，却可能把微小、昂贵或不可取得的成分全部变成交易义务。</h2>
        <p>
          对成分少、流动性高的股票指数，全复制能让组合结构直观、模型风险低；价格共同漂移又会自动维持市值权重。但当指数含数千只债券、小盘股、多市场证券或频繁公司行动时，持有每一项会增加固定费用、整手误差、结算节点、税务事件与交易冲击。全复制也不能消除费用、现金、股息时点或指数纸面价格不可执行带来的差异。
        </p>
        <p>
          因而“持仓看起来最像指数”不等于“税费后回报最像指数”。复制方法应与产品规模、资产流动性、持有期限和追踪容差联合选择。对小基金而言，为极低权重成分支付固定成本尤其不经济；基金扩大后，同一笔固定费用相对 AUM 下降，最优复制方式可能改变。
        </p>
      </section>

      <section className="lesson-section" id="sampling">
        <p className="section-kicker">27 · Stratified Sampling</p>
        <h2>抽样不是随意挑几只证券，而是在不持有全部成分时，尽量匹配指数的关键风险、现金流与流动性结构。</h2>
        <p>
          股票指数抽样可能按行业、规模、国家、beta 与因子暴露分层；债券指数还需匹配久期、曲线、信用等级、发行人、行业、可赎回性与利差。经理省去高成本小头寸，同时接受未持有证券的特异风险、协方差估计误差和状态变化风险。若目标函数仍是降低复制损失，而不是根据预期超额收益押注，有限选择裁量可以仍属于被动实施。
        </p>
        <p>
          Brogaard、Heath 与 Huang 研究 2015–2019 年美国股票 ETF，发现篮子会系统性遗漏部分不流动指数成分，并强调 sampling 会改变指数套利怎样传到个股。这个结果不能外推为每只 ETF 都低配不流动股；它提醒研究者必须分别观察 index、fund holdings、creation basket 与 redemption basket。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="synthetic-replication">
        <p className="section-kicker">28 · Synthetic Replication 与衍生品</p>
        <h2>期货或掉期能迅速取得指数暴露、处理现金与难交易市场，却把复制问题从现货持仓转成基差、融资、抵押品和对手风险。</h2>
        <p>
          收到大额现金流时，基金可先买指数期货 equitize cash，再逐步买现货；跨境市场关闭时可用期货维持 beta；合成 ETF 也可通过 swap 接收指数回报。这些工具减少即时现货订单，却产生 futures basis、roll、margin、collateral、counterparty exposure 与合约时钟。衍生品名义本金不能直接与持仓市值相加，必须按 delta、乘数、币种和期限映射。
        </p>
        <p>
          ESMA 对指数追踪 UCITS 要求披露复制方式与影响追踪的因素，正因为 physical、sampling 与 synthetic 会形成不同风险，而不是一条从“被动”标签即可推断的结构。具体衍生品限额与抵押要求依法域和基金合同变化，本节不把某一 UCITS 安排当成全球规则。<Cite n={6} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="replication-optimization">
        <p className="section-kicker">29 · 复制优化</p>
        <h2>被动经理的合理目标不是孤立地把 TE 压到零，而是在授权内最小化追踪损失、实施成本与操作风险的总和。</h2>
        <div className="equation-card">
          <span>教学目标函数：先把不同量纲正规化</span>
          <div>min<sub>w,u</sub> λ<sub>TE</sub>L<sub>TE</sub>(w,b)+λ<sub>TD</sub>L<sub>TD</sub>(w,b,τ)+λ<sub>TC</sub>L<sub>TC</sub>(u)+λ<sub>Tax</sub>L<sub>Tax</sub>(u)+λ<sub>Ops</sub>L<sub>Ops</sub>(w,u)</div>
          <p>w 是基金目标权重，b 是指数权重，u 是从现有持仓到 w 的交易，τ 是容许或预期平均差异。每个 L 都必须先成为同一口径的无量纲损失，例如把 tracking variance 除以明确的风险尺度平方、把货币交易成本除以 AUM 和成本尺度；也可让 λ 携带相应倒数单位。若不做这一步，收益方差、现金税费和操作风险不能直接相加。λ 由投资授权、风险预算与治理决定；估计误差会改变最优解，这不是一条可直接校准所有基金的闭式公式。</p>
        </div>
        <p>
          λTE 很高时，基金愿意在拥挤时点支付成本以贴近指数；成本权重高时，它可能预交易、延后小额换仓或抽样；税务权重高时，赎回篮子与税基管理更重要。最优选择依 AUM、期限、资产流动性与产品承诺变化。被动管理的专业性就在于把这些可观察权衡做得稳定、可审计，而不是偷偷引入未授权 alpha（相对基准的主动收益判断）观点。
        </p>
      </section>

      <section className="lesson-section" id="event-clocks">
        <p className="section-kicker">阶段五 · 调仓与价格　|　30 · 指数事件的五只时钟</p>
        <h2>参考日、公告日、生效日、基准定价点与基金结算日构成不同信息集；事件研究不能把它们压成一个日期。</h2>
        <div className="table-scroll" role="region" aria-label="指数事件五只时钟的作用与可观察行为，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">参考日、公告日、生效日、基准定价点和结算日对照</caption>
            <thead><tr><th scope="col">时钟</th><th scope="col">发生什么</th><th scope="col">常见研究错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Reference / rank date</th><td>方法读取规模、流动性、自由流通或因子数据</td><td>忽略市场可提前预测阈值结果</td></tr>
              <tr><th scope="row">Announcement date</th><td>提供商公开成分、权重或方法决定</td><td>把公告后价格变化全算到生效日</td></tr>
              <tr><th scope="row">Effective date</th><td>新指数构成开始用于回报计算</td><td>假设所有基金都在这一刻首次交易</td></tr>
              <tr><th scope="row">Pricing point</th><td>常为生效日前一收盘价，也可能依具体方法不同</td><td>把收盘价与整日均价混用</td></tr>
              <tr><th scope="row">Settlement / holdings date</th><td>基金成交、资产和份额实际交割并进入账本</td><td>用成交日持仓推断未结算资产不存在</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          具体时钟由指数方法与交易所决定，不能把 S&amp;P 500 的安排外推给 Russell、MSCI、沪深或债券指数。S&amp;P U.S. Indices 方法文件明确列示公告、季度再平衡和异常关闭政策；MSCI 则分开指数评审、公司行动和关闭处理。事件数据库必须保存当时生效的历史版本，而不是用今天下载的方法回填过去。<Cite n={9} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="anticipation">
        <p className="section-kicker">31 · 可预测规则与提前布局</p>
        <h2>透明规则降低治理黑箱，却把未来机械需求部分公开；市场会在基金下单之前先改变价格与流动性。</h2>
        <p>
          若某股票明显跨过规模阈值，套利者可以在正式公告前估计加入概率；公告确认后，指数基金的未来买入方向更明确，其他交易者会提前买入，并计划在生效日向基金卖出。这类 index arbitrage / pre-positioning 把一部分价格变化从生效时点搬到参考日或公告期，也可能为基金预先聚合流动性。它不是无风险：提供商可使用缓冲带或裁量，价格与自由流通会继续变化，基金可能预交易，其他套利者也会拥挤退出。
        </p>
        <p>
          Green 与 Jame 使用机构交易数据研究 S&amp;P 500 新增，发现指数基金会从公告开始交易，并可在生效后数周才完全建立头寸；较大基金和流动性较低股票更倾向把交易移出生效日。这与基金用暂时 tracking error 换取较低冲击相容，但不是所有产品的固定执行规则。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="manager-timing">
        <p className="section-kicker">32 · 提前、收盘或延后</p>
        <h2>基金执行时点在“暴露错位”和“拥挤冲击”之间移动风险；被动目标不规定唯一最优路径。</h2>
        <p>
          提前买入新增成分可以避开生效收盘拥挤，却在指数尚未持有该股时产生正主动权重；等到生效收盘可以把成交价与指数定价点对齐，却把订单暴露给已知失衡和抢跑者；生效后补齐可能获得更好流动性，却在新指数已生效时低配。三者分别把成本放在 tracking risk、market impact 与 post-effective gap，权重由基金 mandate 与执行模型决定。
        </p>
        <div className="equation-card">
          <span>教学执行权衡</span>
          <div>C(s)=Impact(s)+ExpectedTrackingLoss(s)+InformationLeakage(s)+OperationalRisk(s)</div>
          <p>s 表示随时间的执行路径。Impact 在拥挤时段可能更高；提前或延后会增加相对指数的暴露时长；订单披露和预期交易影响 leakage；截止、停牌与结算进入 operational risk。各项须换成相同货币或 bp（基点，1 bp=0.01 个百分点）等价成本比较，不能把波动百分点与现金成本直接相加。</p>
        </div>
      </section>

      <section className="lesson-section" id="closing-auction">
        <p className="section-kicker">33 · Closing Auction</p>
        <h2>当指数以有效日收盘价切换，收盘竞价既提供共同基准与集中流动性，也可能集中可预期失衡。</h2>
        <p>
          在收盘成交能使基金新持仓的入场价与指数新成分的基准价同步，降低当期 tracking slippage；大量自然和专业流动性提供者也会因可预期需求进入竞价。但如果许多基金、衍生品、选股模型和月末账户都在同一时点交易，价格对不平衡更敏感，成交后的暂时偏离可能快速反转。
        </p>
        <p>
          Bogousslavsky 与 Muravyev 报告美国股票收盘竞价成交占比从 2010 年 3.1% 升至 2018 年 7.5%；其样本中竞价价格通常接近盘前 bid / ask、平均冲击低于连续交易，价格偏离又快速且几乎完全反转。论文还发现 S&amp;P 500 加入后竞价相对日内成交上升。它支持“收盘能吸收大额需求且存在短暂压力”并存，而不是证明任何一笔收盘订单都低成本或由被动资金直接造成。Madhavan 对 1996–2002 年 Russell reconstitution 的分析同样显示复制成本与有风险的流动性供给机会并存。<Cite n={22} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-providers">
        <p className="section-kicker">34 · 抢跑者也是流动性提供者</p>
        <h2>提前买入者从基金处获得的价格优势，可能正是承担库存、预测和反向价格风险的补偿。</h2>
        <p>
          假设指数基金有效日仍需买 1 亿元，套利者公告后先买 3,000 万元，并在有效日卖出；若基金此前也预买 2,000 万元，则收盘剩余基金需求 8,000 万元，套利者供给 3,000 万元后净失衡 5,000 万元。总机械需求没有消失，而是 5,000 万元被搬到此前时段、3,000 万元在收盘形成反向供给。价格压力如何分布，取决于每段市场深度和其他投资者反应。
        </p>
        <p>
          把所有 anticipatory trading 称为“无风险抢跑”会遗漏三个反例：指数结果可能被缓冲规则或委员会改变；基金可能在套利者之前或之外执行；市场下跌和个股消息可能覆盖预期价差。反过来，否认其成本也不合理：基金若承诺在公开可预测时点大额交易，流动性提供者通常要求补偿。Petajisto 把这种 index turnover cost 估为历史样本中的显性经济量，但数值依 1990–2005 年 S&amp;P 500 / Russell 2000 制度，不是当前所有指数的固定费率。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="hypothesis-map">
        <p className="section-kicker">35 · 价格效应的五种竞争解释</p>
        <h2>指数纳入后上涨可以由临时冲击、长期需求、信息、流动性或选择共同产生；单一事件窗口不会自动选出一个答案。</h2>
        <div className="table-scroll" role="region" aria-label="指数纳入价格效应五种解释的预测与反证，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">价格压力、不完全替代、信息认证、流动性注意力和选择效应对照</caption>
            <thead><tr><th scope="col">机制</th><th scope="col">主要链条</th><th scope="col">有区分力的观察</th></tr></thead>
            <tbody>
              <tr><th scope="row">Temporary price pressure</th><td>集中买盘 → 流动性补偿 → 价格暂升 → 库存释放后反转</td><td>成交 / 失衡大，随后较快反转</td></tr>
              <tr><th scope="row">Downward-sloping demand</th><td>新增相对刚性持有人 → 残余需求曲线有限弹性 → 新均衡价格</td><td>与机械需求规模相关且不完全反转</td></tr>
              <tr><th scope="row">Information / certification</th><td>纳入决定或资格信息更新预期现金流 / 风险</td><td>基本面、分析师或信息质量同步变化</td></tr>
              <tr><th scope="row">Attention / liquidity</th><td>可见度与持有人结构改变 → spread、成交与 required return（投资者要求的预期回报率）改变</td><td>持续流动性和参与变化可解释价格</td></tr>
              <tr><th scope="row">Selection / anticipation</th><td>规模、动量、盈利与阈值先决定被选中，市场又提前交易</td><td>公告前趋势、阈值附近差异和方法裁量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这些机制不是互斥的。公告期可先包含预期交易和信息，生效收盘再出现临时冲击，长期又因持有人与流动性变化形成新价格。合格论文必须说明估计的是哪段时间、哪个因果对象，并把其他通道作为控制、异质性或竞争解释，而不是给一条平均异常回报贴上唯一心理动机。
        </p>
      </section>

      <section className="lesson-section" id="temporary-pressure-evidence">
        <p className="section-kicker">36 · Temporary Price Pressure 的经典证据</p>
        <h2>早期 S&amp;P 500 研究发现显著公告效应与不同程度反转，但样本制度、预告期和指数资产规模随后都在变化。</h2>
        <p>
          Harris 与 Gurel 研究 S&amp;P 500 名单变化，报告新增公告后价格即时上升超过 3%，约两周后几乎完全反转；这一时间路径与短期流动性压力相容。<Cite n={17} /> Shleifer 同期研究 1976 年以来新增，发现异常回报至少在纳入后十天没有消失，且与指数基金买入代理正相关，更支持向下倾斜需求。<Cite n={18} /> 两篇经典论文的不同反转结果本身就警告：不能把“指数效应”当作一个跨样本不变参数。
        </p>
        <p>
          1989 年后 S&amp;P 开始在可能时提前约一周公告，Lynch 与 Mendenhall 利用新时钟发现公告后到生效日的正 / 负异常回报，以及生效后的部分反转；这同时支持暂时压力与长期需求曲线，而不能把未反转部分自动命名为基本面价值。其样本是早期制度下的 S&amp;P 500 变化，和今天高频预期、ETF、closing auction 生态不同。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="downward-demand">
        <p className="section-kicker">37 · 不完全替代与向下倾斜需求</p>
        <h2>若单只股票没有无风险完美替代品，套利者承接机械需求要承担特异风险，残余需求就不会无限有弹性。</h2>
        <p>
          在摩擦为零、证券可被完美替代的教科书极限中，非信息买盘不会永久改变价格；套利者可以无限卖出昂贵证券并买入完全相同现金流的替代品。但现实股票的经营、治理、事件与借券风险不同，替代组合只消除共同因子，留下 idiosyncratic risk。订单越大、替代越差、套利资本越有限，流动性提供者要求的价格补偿越高。
        </p>
        <p>
          Wurgler 与 Zhuravskaya 建立这种有限套利模型，并发现缺少近似替代品的股票在 S&amp;P 500 纳入时价格跳升更大；结果与残余需求向下倾斜一致。它不是“指数基金永远制造高估”的证明，因为纳入、替代品测量与长期基本面仍可能相关，且均衡价格效应可随市场结构变化。<Cite n={20} /> Pavlova 与 Sikorskaya 更近期的 benchmarking intensity 证据也支持基准化持有人的需求较不弹性，但估计依具体工具变量与样本。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="information-attention-liquidity">
        <p className="section-kicker">38 · 信息、注意力与流动性</p>
        <h2>指数变更不一定是无信息实验；规则输入、资格门槛和纳入后的市场结构都可能改变对现金流与风险的认识。</h2>
        <p>
          大盘指数可能要求规模、流动性、自由流通、盈利或上市历史；委员会型指数还可能使用裁量。公司跨过门槛本身能透露规模和经营状态，纳入公告又提高媒体、分析师与机构关注。加入后成交、借券、衍生品覆盖和股东基础改变，可能降低或提高 required return（投资者要求的预期回报率）。即使指数提供商声明不做投资推荐，市场参与者仍可从方法输入与未来持有人结构更新价格。
        </p>
        <p>
          ETF 还会把份额市场信息和套利订单传给成分股。Ben-David、Franzoni 与 Moussawi 在美国股票样本中发现 ETF ownership / activity 与更高日内、日度波动及价格反转相关，把机制解释为套利交易传递非基本面冲击；Da 与 Shive 则记录 ETF activity 与成分股共动关系。两者都不能支持“所有 ETF 都降低价格效率”或把 ownership 当随机处理；产品选择、共同需求和信息聚合仍是内生的。<Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="selection-endogeneity">
        <p className="section-kicker">39 · Selection 与内生性</p>
        <h2>股票不是随机掉进指数，基金资产也不是随机追踪指数；被动持有与市场结果的相关性天然混合选择。</h2>
        <p>
          被纳入公司往往先增长、价格上涨、改善流动性或满足盈利门槛；指数基金规模又会在市场上涨和投资者偏好改变时增长。用“被动持股比例高”的股票与低比例股票比较，可能把规模、波动、行业、可交易性和既往回报误当被动资金效应。即使使用阈值附近的 Russell 1000/2000 差异，也要核对排序参考日（rank date）、指数分档缓冲（banding）、自由流通调整、重构时钟和基金实际基准权重。
        </p>
        <p>
          事件研究的最小改进包括：冻结当时方法和公告文件；分别建模公告前预期、公告到生效、生效竞价和反转窗口；用相似但未纳入证券做对照；检验事件前趋势、同期新闻与阈值操纵；以实际跟踪资产和持仓重建需求；报告成交量、失衡、spread 与流动性，而不只看回报。若关键订单不可见，结论应停在“与某机制相容”。
        </p>
      </section>

      <section className="lesson-section" id="effect-time-variation">
        <p className="section-kicker">40 · 指数效应会随制度内生变化</p>
        <h2>套利者学习、公告更透明、竞价更深和基金执行更灵活，会把曾经显著的纳入冲击提前、分散或压小。</h2>
        <p>
          如果一种可预测交易长期产生超额收益，更多资本会提前布局，指数基金也会调整执行；价格效应因此不是不受历史影响的结构常数。Greenwood 与 Sammon 最终期刊版研究 1980–2020 年 S&amp;P 调整，报告新增效应从 1990 年代平均约 7.4% 降到 2010–2020 年不足 1%，删除效应也大幅衰减；其他指数家族出现相似变化。<Cite n={36} /> 这说明现代市场已适应部分公开需求，却不证明机械需求、交易成本或局部不流动证券的影响消失。
        </p>
        <p>
          该论文的 2022 年 NBER working paper 与 2025 年最终发表版在部分删除效应数字上不同，本节只采用最终版。这个版本纪律很重要：旧工作论文的样本、估计或摘要数字不能与新期刊年份拼成一条不存在的“最终证据”。对任何新指数事件，都应以当期市场结构重新估计，而不是把 1986、2000 或 2025 的平均效应直接套入。
        </p>
      </section>

      <section className="lesson-section" id="causal-designs">
        <p className="section-kicker">41 · 从事件相容性到局部因果</p>
        <h2>更可信的设计寻找规则造成的近似外生差异，但每一种设计都只识别特定阈值、时期与处理。</h2>
        <p>
          Kaul、Mehrotra 与 Morck 使用 1996 年 TSE 300 对公众流通股定义进行预先公告的修订：该修订提高了 31 只股票的公众流通量及指数权重，既不传递公司前景信息，也不改变股东的法律义务。相较委员会选择，这更接近数量已知的需求冲击，其持久价格反应支持需求曲线并非完全水平；但单次加拿大制度事件仍可能有提前交易与一般均衡反应。<Cite n={46} />
        </p>
        <p>
          Chang、Hong 与 Liskovich 利用 Russell 1000/2000 市值边界及不同指数权重构造 regression discontinuity（断点回归），发现阈值附近进入 Russell 2000 带来的更高指数持有对价格有正向局部效应。<Cite n={37} /> 这个设计不能外推到远离阈值的公司或自由裁量指数；而 Heath 等人又提醒 Russell 重构已被大量研究反复当作自然实验，重复使用会积累多重检验和设计依赖问题。<Cite n={38} /> “使用了自然实验”不是免检因果通行证。
        </p>
      </section>

      <section className="lesson-section" id="index-governance">
        <p className="section-kicker">阶段六 · 制度、所有权与边界　|　42 · 指数提供商治理</p>
        <h2>指数规则可以透明，却不等于自然、唯一或无裁量；方法定义的市场会成为基金必须追踪的可投资现实。</h2>
        <p>
          提供商选择 eligible universe（可入选证券池）、自由流通、流动性门槛、权重、buffer（成分或权重缓冲区）、公司行动、异常关闭、咨询与紧急偏离程序。两只都称“大盘”或“科技”的指数，只要这些规则不同，长期回报、换手、集中度和基金订单就会不同。S&amp;P DJI 的方法库公开指数与补充政策；MSCI 也分别维护全球可投资市场、自由流通、公司行动、计算和市场关闭方法。透明让规则可审计，不把规则变成物理定律。<Cite n={7} /><Cite n={9} />
        </p>
        <p>
          IOSCO 基准原则要求管理人对基准确定承担总体责任，建立对受托第三方的监督及内部监督安排，并处理利益冲突、方法质量、问责和投诉程序。<Cite n={10} /> 这说明“外包给指数”并没有消灭治理，而是把部分选择集中到指数提供商。基金管理人仍需判断该指数是否与产品目标相符、方法变更是否需要披露或更换；完整的基准选择、评价和委托激励留给 2.18，本节只保留它怎样生成目标权重与时钟。
        </p>
      </section>

      <section className="lesson-section" id="ownership-voting">
        <p className="section-kicker">43 · Passive Ownership 与 Voting</p>
        <h2>组合不凭观点卖出一家公司，不等于资产管理人失去投票权、尽调责任或治理选择。</h2>
        <p>
          指数基金通常会随指数长期持有大量公司，难以用“卖出”持续表达不满；规模又让其投票成为重要治理输入。Appel、Gormley 与 Keim 利用 Russell 1000/2000 边界诱发的被动共同基金持有差异，发现更高被动持有与更多独立董事、取消收购防御和更平等投票权相关，并将结果解释为被动机构通过大额投票块施加影响。该结果是阈值附近的局部识别，不能推出每家指数基金都积极监督。<Cite n={39} />
        </p>
        <p>
          文献并非单向一致。Heath、Macciocchi、Michaely 与 Ringgenberg 发现相对主动基金，指数基金更少反对管理层，并质疑其监督强度。<Cite n={41} /> 这与上一项研究的结论并不一致，因此合格教材应保留不确定性：passive security selection 与 active ownership 是不同轴，实际治理效果取决于投票政策、资源、共同所有权、监管和识别方法，而不是由“被动”一词预先决定。
        </p>
      </section>

      <section className="lesson-section" id="securities-lending-governance">
        <p className="section-kicker">44 · Securities Lending、收益与投票</p>
        <h2>把成分证券借出能增加收入并支持市场借券，却可能在记录日前要求基金权衡借贷收益、召回与投票价值。</h2>
        <p>
          基金出借证券后取得费用和抵押品收益，可抵消部分 tracking drag；借入者取得卖空或结算所需证券。投票权通常随借出证券暂时转移，基金若要投票可能召回，但召回会放弃收入并改变借券市场供给。决策取决于提案重要性、预期投票影响、借贷费、召回可行性和受托政策，不能假设“指数基金永远不召回”或“借贷必然损害治理”。
        </p>
        <p>
          Aggarwal、Saffi 与 Sturgess 使用 2007–2009 年 Markit 日度借贷数据，并匹配约 3,000 家 Russell 3000 公司、56,220 项提案和 7,415 个股权登记日；可借供给在投票前下降，尤其当 ISS（Institutional Shareholder Services，机构投票建议服务商）建议反对管理层时，召回与反对管理层投票相关。<Cite n={40} /> 这是机构动态配置投票权的证据，不证明所有基金在每次表决都召回，也不能把借贷收入直接视为无风险 alpha。
        </p>
      </section>

      <section className="lesson-section" id="china-index-funds">
        <p className="section-kicker">45 · 中国指数基金与 ETF 边界</p>
        <h2>中国制度把“指数目标”“允许抽样”“异常风险处置”和“ETF 申赎载体”分层规定，恰好拆除了机械复制神话。</h2>
        <p>
          中国证监会《公开募集证券投资基金运作指引第 3 号——指数基金指引》将指数基金定义为以跟踪标的指数或基准业绩表现为主要投资目标的基金；规则允许完全复制、抽样复制，以及在符合产品定位和 tracking 要求时投资非成分券。更重要的是，当成分券出现明显负面事件、面临退市或违约而指数尚未调整时，管理人应以持有人利益优先，履行内部程序后及时调整。<Cite n={33} /> 这不是主动押注许可，而是受托义务对机械规则的风险边界。
        </p>
        <p>
          上交所指数 ETF 细则再规定份额按最小申赎单位，以组合证券、现金或其他对价申赎，并在开盘前披露申购赎回清单（PCF）；股票、跨市场、跨境、商品和债券 ETF 的份额使用与结算约束分开，参考净值只供参考。公募信息披露办法又把法定 NAV、申赎价格与定期报告复核置于另一披露层，不能与 PCF 或盘中参考值混同。<Cite n={5} /><Cite n={34} /><Cite n={42} /> 2026 年主动 ETF 指引生效后，中国市场也不能再用“ETF”替代“指数基金”。实际产品必须继续核对基金合同、招募说明书、当日 PCF、交易所和登记结算规则。
        </p>
      </section>

      <section className="lesson-section" id="cross-border-clocks">
        <p className="section-kicker">46 · Cross-border、Holiday 与 FX</p>
        <h2>跨境 ETF 同时活在境内份额、境外现货、外汇、指数估值与一级结算时钟中；看似机械的折溢价可能只是时钟错位。</h2>
        <p>
          境内 ETF 交易时，境外股票可能尚未开盘、已经收盘或因假日休市。做市商只能用期货、ADR、相关资产、外汇和新闻估计同步篮子；对冲误差与资金占用扩大，套利带随之变宽。人民币 NAV 又同时包含外币资产价格与汇率变化。若 IOPV 只更新部分输入，或本身沿用前日净值，市场价相对 IOPV 的偏离不能自动解释为错误定价。
        </p>
        <p>
          一级结算也可能因当地假日、外汇额度或交付周期延长。美国 Rule 6c-11 在符合条件时允许含外国投资的 ETF 延迟交付赎回资产，但须尽快且最迟不超过赎回请求后的 15 日；这是 AP 一级交付上限，不是零售二级交易统一交收期。<Cite n={2} /> 中国每只跨境产品的现金替代、申赎暂停、RTGS（实时逐笔全额结算）/ 日终交收和 IOPV 方法均可能不同；例如 2026 年更新的一只海外中国互联网 ETF 招募说明书就把外汇额度、非实时 IOPV 与不同交收路径列为该产品条件，但个案不能外推成统一规则。<Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="fixed-income-boundary">
        <p className="section-kicker">47 · Fixed-income ETF</p>
        <h2>债券低成交、dealer 库存与 evaluated prices 让 index、holdings、basket、NAV 和可执行价值之间的距离显著扩大。</h2>
        <p>
          债券指数可含数千只券，许多证券当天没有成交；基金通常抽样持有，当日申赎篮子又只是一小部分，NAV 依估值服务而非同步可执行 bid。Todorov 的 BIS 研究报告，部分大型债券 ETF 单次篮子与总持仓重合度低于 3%，约 90% 活动发生在二级市场，常态申赎并非每天发生；2020 年压力期某些产品 tracking error 曾短暂显著扩大。<Cite n={30} /> 这些是特定样本政策研究数字，不是所有债券 ETF 的固定结构。
        </p>
        <p>
          因此压力期折价可能同时包含两部分：ETF 份额在更活跃市场先发现可成交价格，使陈旧 NAV 随后下修；AP 融资、dealer inventory 与底层流动性又确实限制赎回套利。Koont 等人展示公司债 ETF 会根据流量方向选择现金与债券篮子；Raddatz 发现 2020 dash-for-cash 中活跃 AP 与 lead market maker 的资本空间影响一级套利；Dannhauser 与 Hoseinzade 在 taper tantrum 中找到赎回相关债券收益率上升及随后反转。三者分别是篮子管理、单次危机与特定固定收益事件证据，不能外推成 ETF 日常失灵。<Cite n={15} /><Cite n={31} /><Cite n={44} /> 股票 ETF 的全复制直觉不能无修改地外推到固定收益。
        </p>
      </section>

      <section className="lesson-section" id="feedback-crowding">
        <p className="section-kicker">48 · 反馈、拥挤与状态依赖</p>
        <h2>被动需求进入价格后，价格又会改变市值权重、AUM、投资者体验和下一轮需求；反馈方向取决于指数规则与资金行为。</h2>
        <p>
          对既有市值加权成分，价格上涨会自然提高权重和基金持仓市值，但不要求现有全复制基金仅因这一步继续买入；未来新增资金却会按更高权重配置。若上涨又吸引追涨资金流，flow demand 形成正反馈；若等权基金在再平衡时卖出相对赢家，则提供负反馈。指数资格阈值、fast entry、自由流通更新、杠杆重置与波动控制还会形成不同开关。
        </p>
        <p>
          ETF 套利也可能传递或吸收冲击。Ben-David 等与 Da–Shive 发现 ETF 活动与波动、反转或共动相关；但 Box、Davis、Evans 与 Lynch 使用 2006–2015 年 423 只美国被动股票 ETF 的分钟报价与订单失衡，发现底层股票冲击驱动 ETF 的响应约为反向的六倍，并未发现大规模日内 ETF→股票传染。<Cite n={27} /><Cite n={28} /><Cite n={45} /> 证据合在一起要求状态依赖结论：资产流动性、时标、抽样、事件日与识别设计决定方向，不能写成“ETF 一定放大”或“一定稳定”。跨场所网络留给 4.24。
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">阶段七 · 研究与练习　|　49 · 可证伪研究协议</p>
        <h2>要检验“被动资金影响价格”，必须先证明规则生成了多大目标缺口、谁在何时执行，以及价格相对什么反事实变化。</h2>
        <div className="table-scroll" role="region" aria-label="被动资金研究的最低数据字段、识别问题与常见误判，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">被动资金研究从产品、指数、基金、ETF、订单到市场结果的数据协议</caption>
            <thead><tr><th scope="col">层</th><th scope="col">最低字段</th><th scope="col">常见误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">产品</th><td>法律载体、主动/被动目标、benchmark identifier、NAV policy</td><td>把所有 ETF 当指数基金</td></tr>
              <tr><th scope="row">指数</th><td>历史方法版本、rank / announcement / effective / pricing dates、旧新权重</td><td>用当前方法回填历史事件</td></tr>
              <tr><th scope="row">基金</th><td>AUM、现金流、holdings、在途订单、期货、费用、税与借贷</td><td>AUM 变化全部叫净流入</td></tr>
              <tr><th scope="row">ETF 一级 / 二级</th><td>成交、shares outstanding、gross / net units、PCF / baskets、cash ratio</td><td>成交额、creation 与底层买盘一比一</td></tr>
              <tr><th scope="row">执行</th><td>母订单、成交价量、竞价失衡、Q/ADV（订单金额/日均成交额）、spread、depth 与时钟</td><td>假设全部在生效收盘交易</td></tr>
              <tr><th scope="row">识别</th><td>对照组、事件前趋势、同期新闻、阈值、预期概率、反转窗口</td><td>异常回报自动等于机械因果效应</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个局部、可检验的问题可以写成：“在冻结历史指数规则、公告前纳入概率、同期公司新闻和旧持仓后，生效日需买入量相对竞价可用深度的外生差异，是否提高竞价失衡与短期价格反转？”结果应同时报告公告前、公告后、生效竞价和后续窗口，并用实际 tracking assets 构造处理强度。若只能观察 ETF 份额净增，就检验份额层关系，不要把不可见的成分订单假装成已观察事实。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">50 · 互动实验</p>
        <h2>八道题先把策略与载体拆开，再让规则、资金流、现有持仓、执行时钟和证据边界进入同一账本。</h2>
        <p>
          Mode 01 检验四个最基础但最常被误写的机制：主动 ETF 与非 ETF 指数基金可以同时存在；市值加权中的纯价格漂移不必触发追涨；净流入与换权可让部分成分净卖出；稳定跑输可以有零 Tracking Error。Mode 02 再把执行时点、ETF 二级换手、抽样与全复制的总成本，以及指数纳入事件的因果边界放进可判定场景。
        </p>
        <PassiveFundLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">51 · 主动练习</p>
        <h2>六道练习要求你亲自从规则重建目标、订单和追踪结果，而不是复述“被动资金很大”。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · 市值权重的共同漂移</span><p>指数与全复制基金均持有 A/B，对应市值 75/25 百万元。A 下跌 20%，B 上涨 20%，股数、FIF、成分与资金流不变。求新权重，并判断仅因价格变化是否需交易。</p><details className="practice-answer"><summary>展开核对答案</summary><p>A=60，B=30，总值 90；权重为 66.6667%/33.3333%。基金持仓市值与指数同步变化，题设下主动权重仍为零，无需仅为跟随新市值权重而交易。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 流入与换权</span><p>基金 AUM 200 百万元，旧持仓 X/Y=120/80；确认净流入 40，生效新权重 45%/55%。忽略一切摩擦，求两只证券母订单。</p><details className="practice-answer"><summary>展开核对答案</summary><p>交易后目标规模 240；目标市值 108/132；减现有 120/80，订单为 X −12、Y +52，净买入 40。组合净流入仍含 X 的卖单。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 实物篮子错配</span><p>沿用练习 02，但 40 百万元 ETF creation 已全额实物交付 X/Y=10/30；旧持仓仍为 120/80。求基金随后直接订单。</p><details className="practice-answer"><summary>展开核对答案</summary><p>收到后持仓 130/110；目标仍是 108/132；基金需卖 X 22、买 Y 22，净额为零。creation 改变基金规模，但实物已覆盖总金额；直接交易只修正篮子与目标错配。</p></details></article>
          <article className="practice-problem"><span>练习 04 · TD、TE 与 RMS</span><p>四期主动回报为 −20、0、−20、0 bp。求算术 TD、样本 TE 与围绕零的 RMS，均不年化。</p><details className="practice-answer"><summary>展开核对答案</summary><p>TD=−10 bp；去均值偏差为 −10/+10/−10/+10，样本 TE=√(400/3)=11.547 bp；RMS=√[(400+0+400+0)/4]=14.142 bp。三者不能互换。</p></details></article>
          <article className="practice-problem"><span>练习 05 · 执行时点</span><p>某调仓的三个路径等价成本：提前为 impact 7bp＋tracking 8bp；收盘为 19＋0；延后为 9＋13。求题设最优，并说明为什么不能外推。</p><details className="practice-answer"><summary>展开核对答案</summary><p>三者为 15、19、22bp，题设最小为提前。只要冲击、跟踪损失、时限或授权权重改变，排序就会改变；数字是教学情景，不是市场校准。</p></details></article>
          <article className="practice-problem"><span>练习 06 · 事件证据</span><p>一只股票公告后上涨 6%，生效后一周回落 4%；同期发布超预期盈利，且没有对照组。写出一句不越界结论和至少三项下一步证据。</p><details className="practice-answer"><summary>展开核对答案</summary><p>合格结论：“时间路径与部分短期价格压力相容，但盈利信息、选择与预期交易使 6% 不能归因于被动需求。”下一步至少需要历史方法与旧新权重、公告前纳入概率、实际跟踪资产/持仓、竞价失衡、相似未纳入对照、同期新闻控制与多个反转窗口。</p></details></article>
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">52 · 理解检查</p>
        <h2>若能不看正文解释以下十问，你才真正把“被动资金”从标签还原成一组主体、账本与时钟。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么 ETF 不等于被动指数基金？</summary><p>ETF 是份额上市与一级申赎载体；被动 / 主动描述组合裁量，指数化描述目标。指数基金可用非 ETF 载体，ETF 也可主动管理。</p></details>
          <details><summary>02 · 被动基金为什么仍然需要专业经理？</summary><p>经理要把纸面指数转成可结算持仓，处理抽样、现金、税、公司行动、衍生品、流动性、执行、风险与异常事件。</p></details>
          <details><summary>03 · 市值加权成分上涨为何不必触发追涨？</summary><p>在股数、FIF、成分与资金流不变时，指数权重和全复制持仓市值由同一价格同步漂移，目标缺口仍可为零。</p></details>
          <details><summary>04 · ETF 成交量为什么不是资金流？</summary><p>二级成交是既有份额在买卖双方间转移；只有 creation / redemption 改变在外份额和基金资产。</p></details>
          <details><summary>05 · Creation 为什么不等于基金公开市场买盘？</summary><p>实物 creation 可直接转移 AP 库存，custom basket 也可能不同于指数；现金部分和篮子错配才更可能生成基金直接订单。</p></details>
          <details><summary>06 · Tracking Difference 与 Tracking Error 有何不同？</summary><p>前者读平均方向，后者读主动回报围绕自身均值的波动；稳定负拖累可以有负 TD 和零 TE。</p></details>
          <details><summary>07 · 抽样复制为何仍可属于被动？</summary><p>若选择目标是降低复制损失和成本，而非押注预期 alpha，它是实施裁量；但会带来残余权重和模型风险。</p></details>
          <details><summary>08 · 为什么基金不一定在生效收盘一次完成？</summary><p>收盘可贴近基准定价，却可能拥挤；提前或延后能降低冲击，但承担指数生效前后的主动暴露。</p></details>
          <details><summary>09 · 指数纳入上涨为何不能自动归因于机械需求？</summary><p>成分选择、公告信息、注意力、流动性、预期交易和共同新闻都能产生相同方向，需要对照与局部识别。</p></details>
          <details><summary>10 · 被动持有为何不等于被动所有权？</summary><p>基金仍持有投票权并可参与治理、出借或召回证券；实证对监督强度存在争议，不能由策略标签预判。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-closing">
        <p className="section-kicker">53 · 课程接口与最终诊断</p>
        <h2>2.04 输出的不是“ETF 知识点”，而是一套把规则型资本还原为目标缺口、订单时钟与可验证市场影响的诊断协议。</h2>
        <div className="interface-grid">
          <article><span>← 1.21</span><h3>ETF Creation / Redemption</h3><p>调用两级市场、AP、basket、套利带与时钟，不重复完整 NAV 和双向套利账本。</p></article>
          <article><span>← 2.01–2.03</span><h3>Agents & Parent Orders</h3><p>延续异质主体、AUM 和目标到母订单语言；把目标来源从研究 alpha 改成指数规则。</p></article>
          <article><span>→ 2.17</span><h3>Redemption & Liquidity</h3><p>输出现金与实物申赎、篮子错配和底层流动性；后续研究压力赎回与剩余持有人。</p></article>
          <article><span>→ 2.18</span><h3>Benchmark & Tracking Error</h3><p>输出最小 TD / TE 定义与复制权衡；后续完整处理基准选择、归因、评价和治理。</p></article>
          <article><span>→ 4.24</span><h3>Cross-market Linkage</h3><p>输出 ETF、现货、期货、外汇与跨境时钟接口；后续建立多场所价格发现和 basis 网络。</p></article>
          <article><span>→ 7.13</span><h3>Crowding & Endogenous Rules</h3><p>输出聚合目标缺口、公开时钟与适应性反馈；复杂系统章再研究拥挤、阈值与制度内生变化。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“不预测价格的资金却推动了价格”的说法，先分开 passive、index-tracking 与 ETF 三条轴；识别最终投资人、指数提供商、基金治理、组合经理、交易台、AP、做市商和预期交易者；冻结当时生效的指数方法与五只时钟；把现金申赎和 ETF 二级换手分账；用交易后 AUM 与新权重形成目标，再减当前、在途、篮子和衍生品等价暴露；剔除市值加权的共同价格漂移；在全复制、抽样、合成和现金之间解释总成本；分别计算 Tracking Difference 与 Tracking Error；把公告、生效、竞价和反转拆开；最后让价格、跟踪结果、资金流与指数治理回到下一轮状态。完成这条链，被动基金才不再是一只“自动买入”的黑箱，而成为一套有目标、有裁量边界、有资产负债表、有执行成本，也能被数据反驳的规则型机构。
        </p>
      </section>
    </>
  );
}

export const lesson204: LessonRecord = {
  slug: '2-04',
  id: '2.04',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Passive Index Fund / ETF：规则、复制与机械订单',
  subtitle: '从策略与载体的分类边界出发，解释指数规则、资金流、复制选择和事件时钟怎样生成订单，并通过流动性、价格与跟踪结果形成反馈',
  readingTime: '核心阅读约 90–110 分钟；互动实验快速 20–25／含复盘 35–45，主动练习核对 15–20／完整书写 30–40，理解检查快速 8–10／完整复述 15–20，课程接口 3–4 分钟；快速路径约 136–169 分钟，完整学习约 173–219 分钟（建议分两次完成；参考文献与延伸阅读不计）',
  prerequisite: '1.21、2.01；按需回看 1.09、1.20 与 2.03',
  updatedAt: '2026-08-29',
  revision: '2.04-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '2.04-r1',
      summary: '冻结 r1 无 P0；要求修正市值加权拆股与 divisor 机制、implied demand 非上下界、份额流量口径、RMS 恒等式、优化目标量纲、IOSCO 监督、借贷样本和动态法源元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '2.04-r1',
      summary: '冻结 r1 无 P0/P1；要求统一七阶段路线与时间预算、补齐零基础术语桥和无脚本替代入口，并拆开双论文延伸阅读链接。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '2.04-r2',
      summary: '冻结 r2 的 r1 问题均已修复；仅要求把 Kaul–Mehrotra–Morck 事件精确表述为公众流通股定义修订，并将 Aggarwal–Saffi–Sturgess 提案数精校为 56,220。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '2.04-r2',
      summary: '批准完整冻结 r2：七阶段学习坡度、时间预算、术语桥、无脚本替代、21 项阅读、实验唯一答案、SSR、存储、焦点、ARIA、键盘与窄屏均通过。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '2.04-r3',
      summary: '批准完整冻结 r3：两轮事实修订、全部公式与单位、法域边界、八题实验、六道练习、46 条来源、21 项阅读及书目元数据均通过，未发现剩余 P0–P2。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '2.04-r3',
      summary: '批准完整冻结 r3：54 节学习坡度、七阶段路线、术语桥、静态与互动练习、无脚本路径、SSR、存储、焦点、ARIA、键盘和窄屏均通过，未发现剩余 P0–P2。',
    },
  ],
  previous: { slug: '2-03', label: '2.03 Long-only Asset Manager' },
  next: { slug: '2-05', label: '2.05 Pension / Insurance Capital' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整系统' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'three-axes', label: '三条分类轴' },
    { id: 'passive-definition', label: 'Passive 定义' },
    { id: 'index-fund-definition', label: 'Index Fund' },
    { id: 'etf-definition', label: 'ETF 载体' },
    { id: 'actor-map', label: '七类主体' },
    { id: 'cash-subscription-ledger', label: '现金申赎基金' },
    { id: 'etf-secondary-ledger', label: 'ETF 二级账本' },
    { id: 'etf-primary-ledger', label: 'ETF 一级桥接' },
    { id: 'flow-measurement', label: '资金流测量' },
    { id: 'index-weight-math', label: '市值权重数学' },
    { id: 'self-rebalancing', label: '自我再平衡' },
    { id: 'non-cap-rebalancing', label: '非市值权重' },
    { id: 'divisor-corporate-actions', label: 'Divisor 与公司行动' },
    { id: 'return-versions', label: '指数回报版本' },
    { id: 'unified-order-identity', label: '统一订单恒等式' },
    { id: 'order-decomposition', label: '订单来源分解' },
    { id: 'not-all-buys', label: '流入不等于全买' },
    { id: 'cash-corporate-orders', label: '现金与公司行动' },
    { id: 'aggregate-demand', label: '规模聚合需求' },
    { id: 'tracking-difference', label: 'Tracking Difference' },
    { id: 'tracking-error', label: 'Tracking Error' },
    { id: 'tracking-metric-boundaries', label: '四种指标边界' },
    { id: 'tracking-attribution', label: '追踪归因账户' },
    { id: 'full-replication', label: '完全复制' },
    { id: 'sampling', label: '抽样复制' },
    { id: 'synthetic-replication', label: '合成复制' },
    { id: 'replication-optimization', label: '复制优化' },
    { id: 'event-clocks', label: '指数事件时钟' },
    { id: 'anticipation', label: '提前布局' },
    { id: 'manager-timing', label: '执行时点' },
    { id: 'closing-auction', label: '收盘竞价' },
    { id: 'liquidity-providers', label: '预期交易与流动性' },
    { id: 'hypothesis-map', label: '五种竞争解释' },
    { id: 'temporary-pressure-evidence', label: '经典价格压力证据' },
    { id: 'downward-demand', label: '向下倾斜需求' },
    { id: 'information-attention-liquidity', label: '信息、注意力与流动性' },
    { id: 'selection-endogeneity', label: '选择与内生性' },
    { id: 'effect-time-variation', label: '指数效应时变' },
    { id: 'causal-designs', label: '局部因果设计' },
    { id: 'index-governance', label: '指数治理' },
    { id: 'ownership-voting', label: '所有权与投票' },
    { id: 'securities-lending-governance', label: '证券借贷与治理' },
    { id: 'china-index-funds', label: '中国制度边界' },
    { id: 'cross-border-clocks', label: '跨境与汇率时钟' },
    { id: 'fixed-income-boundary', label: '固定收益边界' },
    { id: 'feedback-crowding', label: '反馈与拥挤' },
    { id: 'research-protocol', label: '研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'interfaces-closing', label: '接口与诊断' },
  ],
  Content: Lesson204Content,
  references: [
    { id: 1, authors: 'U.S. Securities and Exchange Commission, Office of Investor Education and Assistance', year: '2025', accessedAt: '2026-08-29', title: 'Characteristics of Mutual Funds and Exchange-Traded Funds (ETFs)', publication: 'Investor.gov Investor Bulletin, 29 April 2025', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/characteristics-mutual-funds-exchange-traded-funds', use: '用监管机构的零背景语言区分 mutual fund 与 ETF 载体，并明确 ETF 可被动追踪指数或主动管理；投资者教育材料不替代具体产品文件。' },
    { id: 2, authors: 'U.S. Securities and Exchange Commission', year: 'current', accessedAt: '2026-08-29', title: '17 CFR § 270.6c-11 — Exchange-Traded Funds', publication: 'Electronic Code of Federal Regulations; page current through 27 August 2026', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-270/section-270.6c-11', use: '提供美国开放式 ETF、AP、creation unit、basket、custom basket、折溢价、网站披露、外国资产延迟交付与记录保存的现行定义；不覆盖所有 ETP。' },
    { id: 3, authors: 'U.S. Securities and Exchange Commission', year: '2019', accessedAt: '2026-08-29', title: 'Exchange-Traded Funds', publication: 'Final Rule, Release Nos. 33-10695; IC-33646, 84 FR 57162', url: 'https://www.sec.gov/rules/final/2019/33-10695.pdf', use: '解释 ETF 一级与二级市场、AP、套利、portfolio holdings、basket 与 custom basket 的采纳逻辑；现行规则文本须与后续修订后的 eCFR 配合。' },
    { id: 4, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所主动管理交易型开放式证券投资基金业务指引', publication: '上证发〔2026〕64号，2026-06-17 施行，现行有效', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/fund/trading/c/c_20260617_10822565.shtml', use: '提供中国主动 ETF 的当前定义和运作边界，直接证明 ETF 载体与指数化 / 被动策略不是同一分类轴。' },
    { id: 5, authors: '上海证券交易所', year: '2020', accessedAt: '2026-08-29', title: '上海证券交易所交易型开放式指数基金业务实施细则（2020年第二次修订）', publication: '上证发〔2020〕88号，2020-12-04 施行，现行有效', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/fund/trading/c/c_20250606_10781071.shtml', use: '提供上交所指数 ETF、代理券商、最小申赎单位、PCF、分类结算与参考净值的现行业务框架；不能把单一类别的 T+0/T+1 外推到所有 ETF。' },
    { id: 6, authors: 'European Securities and Markets Authority', year: '2014', accessedAt: '2026-08-29', title: 'Guidelines on ETFs and Other UCITS Issues', publication: 'ESMA/2014/937EN', url: 'https://www.esma.europa.eu/sites/default/files/library/2015/11/esma-2014-0011-01-00_en_0.pdf', use: '定义指数追踪 UCITS 的复制、预期 tracking error、年度 tracking difference、UCITS ETF 与 iNAV 披露；欧盟规则不自动适用于美国或中国。' },
    { id: 7, authors: 'S&P Dow Jones Indices', year: 'current', accessedAt: '2026-08-29', title: 'Methodology Matters', publication: 'S&P DJI Index Literacy', url: 'https://www.spglobal.com/spdji/en/research-insights/index-literacy/methodology-matters/', use: '用提供商材料解释指数方法如何定义资格、权重、自由流通、重构和更新；教育材料说明设计空间，不证明任何指数优于另一指数。' },
    { id: 8, authors: 'S&P Dow Jones Indices', year: '2026', accessedAt: '2026-08-29', title: 'Index Mathematics Methodology', publication: 'S&P DJI Index Methodology, August 2026', url: 'https://www.spglobal.com/spdji/en/methodology/article/index-mathematics-methodology/', use: '支持市值与自由流通权重、非市值权重、divisor 连续性和指数不同于可交易组合的数学边界。' },
    { id: 9, authors: 'MSCI Inc.', year: '2026', accessedAt: '2026-08-29', title: 'Index Methodology Resource Library', publication: 'MSCI Index Resources; current methodology library', url: 'https://www.msci.com/indexes/index-resources/index-methodology', use: '提供全球可投资市场、指数计算、自由流通、公司行动、流动性和市场关闭的当前方法入口；具体结论必须读取相应历史版本。' },
    { id: 10, authors: 'International Organization of Securities Commissions', year: '2013', accessedAt: '2026-08-29', title: 'Principles for Financial Benchmarks', publication: 'IOSCO Final Report FR07/13', url: 'https://www.iosco.org/library/pubdocs/pdf/IOSCOPD409.pdf', use: '建立基准管理人的总体责任、对受托第三方及内部监督、冲突管理、方法质量与问责原则；原则允许依基准特征采用不同实施方式。' },
    { id: 11, authors: 'Alex Frino & David R. Gallagher', year: '2001', title: 'Tracking S&P 500 Index Funds', publication: 'Journal of Portfolio Management, 28(1), 44–55', url: 'https://doi.org/10.3905/jpm.2001.319822', use: '说明纸面指数与真实基金之间的费用、现金流和交易摩擦会产生追踪偏离；早期美国样本不是当前行业参数。' },
    { id: 12, authors: 'Edwin J. Elton, Martin J. Gruber, George Comer & Kai Li', year: '2002', title: 'Spiders: Where Are the Bugs?', publication: 'Journal of Business, 75(3), 453–472', url: 'https://doi.org/10.1086/339891', use: '用 1993–1998 年早期 SPDR 分解费用、现金股息拖累、定价与结构；历史单产品不能代表现代全部 ETF。' },
    { id: 13, authors: 'Martin Lettau & Ananth Madhavan', year: '2018', title: 'Exchange-Traded Funds 101 for Economists', publication: 'Journal of Economic Perspectives, 32(1), 135–154', url: 'https://doi.org/10.1257/jep.32.1.135', use: '提供 ETF 主体、两级市场、套利、流动性与成本的标准经济学综述；综述不替代当前法条或具体因果研究。' },
    { id: 14, authors: 'Jonathan Brogaard, Davidson Heath & Da Huang', year: '2026', title: 'ETF Sampling and Index Arbitrage', publication: 'Journal of Financial and Quantitative Analysis, 61(2), 547–579', url: 'https://doi.org/10.1017/S0022109025102378', use: '研究 2015–2019 年美国股票 ETF 的抽样、篮子与套利异质性；不能外推为所有 ETF 或所有不流动成分的固定效应。' },
    { id: 15, authors: 'Naz Koont, Yiming Ma, Ľuboš Pástor & Yao Zeng', year: '2025', title: 'Steering a Ship in Illiquid Waters: Active Management of Passive Funds', publication: 'Review of Financial Studies, 38(10), 2887–2935', url: 'https://doi.org/10.1093/rfs/hhaf034', use: '说明公司债 ETF 会在现金与部分债券篮子间主动选择，以管理追踪和流动性转换；结果集中于特定固定收益生态。' },
    { id: 16, authors: 'T. Clifton Green & Russell Jame', year: '2011', title: 'Strategic Trading by Index Funds and Liquidity Provision Around S&P 500 Index Additions', publication: 'Journal of Financial Markets, 14(4), 605–624', url: 'https://doi.org/10.1016/j.finmar.2011.02.004', use: '用 Abel Noser 机构交易记录说明基金会在公告后预交易并把部分执行移出生效日；数据参与者不是全体指数基金。' },
    { id: 17, authors: 'Lawrence Harris & Eitan Gurel', year: '1986', title: 'Price and Volume Effects Associated with Changes in the S&P 500 List: New Evidence for the Existence of Price Pressures', publication: 'Journal of Finance, 41(4), 815–829', url: 'https://doi.org/10.1111/j.1540-6261.1986.tb04550.x', use: '记录早期 S&P 新增的即时价格上升与约两周反转，支持暂时价格压力；制度与时期限制当前外推。' },
    { id: 18, authors: 'Andrei Shleifer', year: '1986', title: 'Do Demand Curves for Stocks Slope Down?', publication: 'Journal of Finance, 41(3), 579–590', url: 'https://doi.org/10.1111/j.1540-6261.1986.tb04518.x', use: '将 S&P 500 新增回报与指数基金需求联系，结果与向下倾斜需求相容；委员会选择不是随机处理。' },
    { id: 19, authors: 'Anthony W. Lynch & Richard R. Mendenhall', year: '1997', title: 'New Evidence on Stock Price Effects Associated with Changes in the S&P 500 Index', publication: 'Journal of Business, 70(3), 351–383', url: 'https://doi.org/10.1086/209722', use: '利用 1989 年后提前公告制度区分公告、生效与部分反转；不能把未反转部分自动定义为基本面或永久需求。' },
    { id: 20, authors: 'Jeffrey Wurgler & Ekaterina Zhuravskaya', year: '2002', title: 'Does Arbitrage Flatten Demand Curves for Stocks?', publication: 'Journal of Business, 75(4), 583–608', url: 'https://doi.org/10.1086/341636', use: '以近似替代与特异风险解释为什么套利不能无限平坦化单股需求；代理测量与横截面识别仍有边界。' },
    { id: 21, authors: 'Antti Petajisto', year: '2011', title: 'The Index Premium and Its Hidden Cost for Index Funds', publication: 'Journal of Empirical Finance, 18(2), 271–288', url: 'https://doi.org/10.1016/j.jempfin.2010.10.002', use: '估计 1990–2005 年 S&P 500 与 Russell 2000 的纳入 / 删除 premium 及 turnover cost；历史数值不是当前所有指数的成本常数。' },
    { id: 22, authors: 'Ananth Madhavan', year: '2003', title: 'The Russell Reconstitution Effect', publication: 'Financial Analysts Journal, 59(4), 51–64', url: 'https://doi.org/10.2469/faj.v59.n4.2545', use: '研究 1996–2002 年 Russell 重构的日内波动、复制成本与流动性供给；不是干净的随机实验。' },
    { id: 23, authors: 'Vincent Bogousslavsky & Dmitriy Muravyev', year: '2023', title: 'Who Trades at the Close? Implications for Price Discovery and Liquidity', publication: 'Journal of Financial Markets, 66, 100852', url: 'https://doi.org/10.1016/j.finmar.2023.100852', use: '记录 2010–2018 年美国收盘竞价成交增长、价格发现、快速反转及 S&P 新增后的竞价变化；关联不等于全部由被动基金直接造成。' },
    { id: 24, authors: 'Anna Pavlova & Taisiya Sikorskaya', year: '2023', title: 'Benchmarking Intensity', publication: 'Review of Financial Studies, 36(3), 859–903', url: 'https://doi.org/10.1093/rfs/hhac055', use: '把基准权重按跟踪资产聚合并用 Russell 边界研究基准化需求弹性；局部工具变量和美国样本限制外推。' },
    { id: 25, authors: 'Marco Sammon & John J. Shim', year: '2026', title: 'Index Rebalancing and Stock Market Composition: Do Indexes Time the Market?', publication: 'Journal of Financial Economics, 177, 104229', url: 'https://doi.org/10.1016/j.jfineco.2025.104229', use: '研究发行、回购与 IPO 引起的市值指数构成再平衡和成本；最终版数值不能与旧工作论文混用，也不是普遍拖累定律。' },
    { id: 26, authors: 'David C. Brown, Shaun W. Davies & Matthew C. Ringgenberg', year: '2021', title: 'ETF Arbitrage, Non-Fundamental Demand, and Return Predictability', publication: 'Review of Finance, 25(4), 937–972', url: 'https://doi.org/10.1093/rof/rfaa027', use: '把 2007–2016 年一级市场活动构造成非基本面需求代理并研究反转；flow 解释依模型，不能把每笔申赎定性为噪声订单。' },
    { id: 27, authors: 'Itzhak Ben-David, Francesco Franzoni & Rabih Moussawi', year: '2018', title: 'Do ETFs Increase Volatility?', publication: 'Journal of Finance, 73(6), 2471–2535', url: 'https://doi.org/10.1111/jofi.12727', use: '提供 ETF ownership / activity 与成分股波动、反转及套利传导的美国证据；排除限制和后续异质性证据不允许普遍化。' },
    { id: 28, authors: 'Zhi Da & Sophie Shive', year: '2018', title: 'Exchange Traded Funds and Asset Return Correlations', publication: 'European Financial Management, 24(1), 136–168', url: 'https://doi.org/10.1111/eufm.12137', use: '连接 ETF 活动与成分股共动，提示信息整合与非基本面流量的竞争解释；观察关系不是单向结构因果。' },
    { id: 29, authors: 'James M. Poterba & John B. Shoven', year: '2002', title: 'Exchange-Traded Funds: A New Investment Option for Taxable Investors', publication: 'American Economic Review, 92(2), 422–427', url: 'https://doi.org/10.1257/000282802320191732', use: '比较早期美国 ETF 与传统指数基金税后结构；结论依美国税制和 1994–2000 年样本，不能跨法域泛化。' },
    { id: 30, authors: 'Karamfil Todorov', year: '2021', accessedAt: '2026-08-29', title: 'The Anatomy of Bond ETF Arbitrage', publication: 'BIS Quarterly Review, March 2021', url: 'https://www.bis.org/publ/qtrpdf/r_qt2103d.htm', use: '提供债券 ETF 的部分篮子、活跃 AP、二级市场占比、估值和 2020 压力期机制；政策研究并非随机因果论文。' },
    { id: 31, authors: 'Claudio E. Raddatz K.', year: '2025', title: 'Authorized Participants’ Regulatory Constraints and Limits to ETF Arbitrage During Market Turmoil: Evidence from the Dash-for-Cash Episode', publication: 'Journal of Banking & Finance, 179, 107499', url: 'https://doi.org/10.1016/j.jbankfin.2025.107499', use: '显示 2020 年 3 月 AP 与 lead market maker 资本空间影响债券 ETF 一级套利；单次 turmoil 不解释常态全部折价。' },
    { id: 32, authors: 'European Securities and Markets Authority', year: '2013', accessedAt: '2026-08-29', title: 'ESMA Q&A 1105: Do Index-Tracking UCITS Provisions Apply to UCITS ETFs?', publication: 'ESMA Q&A, 11 July 2013', url: 'https://www.esma.europa.eu/publications-data/questions-answers/1105', use: '确认当 UCITS ETF 追踪指数时适用 index-tracking UCITS 要求；这是一条适用范围问答，不定义全球 ETF。' },
    { id: 33, authors: '中国证券监督管理委员会', year: '2021', accessedAt: '2026-08-29', title: '公开募集证券投资基金运作指引第3号——指数基金指引', publication: '证监会公告〔2021〕2号，2021-02-01 施行，现行有效', url: 'https://www.csrc.gov.cn/csrc/c101877/c1415875/content.shtml', use: '定义中国指数基金，允许抽样与条件性非成分券投资，并要求成分券重大负面事件时优先持有人利益；不等于主动 alpha 授权。' },
    { id: 34, authors: '上海证券交易所', year: 'current', accessedAt: '2026-08-29', title: '常见问题', publication: '上海证券交易所基金网站；页面未标注正式发布日期', url: 'https://etf.sse.com.cn/fund/quertion/', use: '以投资者语言说明二级买卖、组合证券 / 现金申赎、PCF 与产品类别差异；简化问答须由正式细则和产品文件限定。' },
    { id: 35, authors: 'S&P Dow Jones Indices', year: '2026', accessedAt: '2026-08-29', title: 'S&P U.S. Indices Methodology', publication: 'S&P DJI Index Methodology, July 2026', url: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-us-indices.pdf', use: '提供 S&P 美国指数资格、委员会、公告、再平衡和异常市场时钟；只适用于所列指数与当期方法版本。' },
    { id: 36, authors: 'Robin Greenwood & Marco Sammon', year: '2025', title: 'The Disappearing Index Effect', publication: 'Journal of Finance, 80(2), 657–698', url: 'https://doi.org/10.1111/jofi.13410', use: '记录 1980–2020 年 S&P 与其他指数的纳入 / 删除效应显著衰减；采用最终期刊版，避免混用 2022 工作论文数字。' },
    { id: 37, authors: 'Yen-Cheng Chang, Harrison Hong & Inessa Liskovich', year: '2015', title: 'Regression Discontinuity and the Price Effects of Stock Market Indexing', publication: 'Review of Financial Studies, 28(1), 212–246', url: 'https://doi.org/10.1093/rfs/hhu041', use: '利用 Russell 1000/2000 边界建立更强局部识别；估计只适用于阈值附近公司且依方法执行。' },
    { id: 38, authors: 'Davidson Heath, Matthew C. Ringgenberg, Mehrdad Samadi & Ingrid M. Werner', year: '2023', title: 'Reusing Natural Experiments', publication: 'Journal of Finance, 78(4), 2329–2364', url: 'https://doi.org/10.1111/jofi.13250', use: '警告同一 Russell 等自然实验被反复用于众多结论会积累多重检验和设计依赖；不否定所有断点研究。' },
    { id: 39, authors: 'Ian R. Appel, Todd A. Gormley & Donald B. Keim', year: '2016', title: 'Passive Investors, Not Passive Owners', publication: 'Journal of Financial Economics, 121(1), 111–141', url: 'https://doi.org/10.1016/j.jfineco.2016.03.003', use: '用 Russell 边界诱发被动持有差异研究公司治理；是局部 IV 证据，不能推出每家指数基金都积极监督。' },
    { id: 40, authors: 'Reena Aggarwal, Pedro A. C. Saffi & Jason Sturgess', year: '2015', title: 'The Role of Institutional Investors in Voting: Evidence from the Securities Lending Market', publication: 'Journal of Finance, 70(5), 2309–2346', url: 'https://doi.org/10.1111/jofi.12284', use: '用 2007–2009 年 Markit 日度借贷数据及配套投票事件记录投票前召回与治理选择；不证明所有基金总会召回或借贷必然有害。' },
    { id: 41, authors: 'Davidson Heath, Daniele Macciocchi, Roni Michaely & Matthew C. Ringgenberg', year: '2022', title: 'Do Index Funds Monitor?', publication: 'Review of Financial Studies, 35(1), 91–131', url: 'https://doi.org/10.1093/rfs/hhab023', use: '提供与积极治理证据不一致的指数基金监督较弱结论；教材据此保留治理结果不确定性。' },
    { id: 42, authors: '中国证券监督管理委员会', year: '2020', accessedAt: '2026-08-29', title: '公开募集证券投资基金信息披露管理办法', publication: '证监会令第158号，依第166号令修正', url: 'https://www.csrc.gov.cn/csrc/c106256/c1653985/content.shtml', use: '规定中国公募基金 NAV、申赎价格、上市公告和托管复核等法定披露；应与交易所 PCF 和盘中参考净值分开。' },
    { id: 43, authors: '易方达基金管理有限公司', year: '2026', accessedAt: '2026-08-29', title: '易方达中证海外中国互联网50交易型开放式指数证券投资基金更新的招募说明书', publication: '上海证券交易所基金公告，2026-01-08', url: 'https://www.sse.com.cn/disclosure/fund/announcement/c/new/2026-01-08/513050_20260108_7G5D.pdf', use: '以单只跨境 ETF 展示汇率、额度、非实时 IOPV 与结算路径如何进入机制；产品实例不得泛化为全市场统一规则。' },
    { id: 44, authors: 'Caitlin D. Dannhauser & Saeid Hoseinzade', year: '2022', title: 'The Unintended Consequences of Corporate Bond ETFs: Evidence from the Taper Tantrum', publication: 'Review of Financial Studies, 35(1), 51–90', url: 'https://doi.org/10.1093/rfs/hhab031', use: '用 taper tantrum 与同发行人比较连接 ETF 赎回、债券收益率上升及数月反转；特定危机与固定收益样本限制外推。' },
    { id: 45, authors: 'Travis Box, Ryan Davis, Richard Evans & Andrew Lynch', year: '2021', title: 'Intraday Arbitrage Between ETFs and Their Underlying Portfolios', publication: 'Journal of Financial Economics, 141(3), 1078–1095', url: 'https://doi.org/10.1016/j.jfineco.2021.04.023', use: '用 2006–2015 年 423 只美国被动股票 ETF 的分钟级数据发现主要价格响应由底层到 ETF；是普遍放大叙述的重要反证但不覆盖所有时标与资产。' },
    { id: 46, authors: 'Aditya Kaul, Vikas Mehrotra & Randall Morck', year: '2000', title: 'Demand Curves for Stocks Do Slope Down: New Evidence from an Index Weights Adjustment', publication: 'Journal of Finance, 55(2), 893–912', url: 'https://doi.org/10.1111/0022-1082.00230', use: '利用 1996 年 TSE 300 预先公告的公众流通股定义修订识别 31 只股票的权重需求冲击；单次加拿大制度事件仍有预期交易与一般均衡边界。' },
  ],
  readingList: [
    { title: 'Lettau & Madhavan (2018)', scope: '全文，重点为 ETF structure、arbitrage、liquidity 与 costs', reason: '先建立两级市场与角色全景，再用本节的规则—目标—订单层补足组合管理。', url: 'https://doi.org/10.1257/jep.32.1.135' },
    { title: 'SEC Rule 6c-11 — Current eCFR', scope: '§270.6c-11(a)、(b)(4)、(c)(1)–(4)、(d)', reason: '直接核对 AP、basket、creation unit、网站披露、custom basket、外国资产交付与记录要求。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-270/section-270.6c-11' },
    { title: '中国证监会 · 指数基金指引', scope: '第 2、5–6、8–11 条', reason: '理解中国指数基金的定义、抽样复制、异常成分风险处置与交易所接口。', url: 'https://www.csrc.gov.cn/csrc/c101877/c1415875/content.shtml' },
    { title: 'S&P DJI · Index Mathematics Methodology', scope: '市值权重、非市值权重、divisor 与公司行动', reason: '从指数提供商的一手数学文件理解为什么指数是规则序列，不是可直接成交组合。', url: 'https://www.spglobal.com/spdji/en/methodology/article/index-mathematics-methodology/' },
    { title: 'MSCI · Index Methodology Library', scope: 'GIMI、Calculation、Free Float、Corporate Events 与 Market Closures', reason: '训练按具体任务选择方法文件，并保存历史版本而不是只读最新页面。', url: 'https://www.msci.com/indexes/index-resources/index-methodology' },
    { title: 'Frino & Gallagher (2001)', scope: '全文，重点为纸面指数、资金流、交易摩擦和 TE', reason: '理解最简单的复制承诺为何仍会产生现实追踪误差。', url: 'https://doi.org/10.3905/jpm.2001.319822' },
    { title: 'Brogaard, Heath & Huang (2026)', scope: 'sampling、basket construction 与流动性异质性', reason: '把 index、holdings、basket 与真实套利订单彻底分开。', url: 'https://doi.org/10.1017/S0022109025102378' },
    { title: 'Koont et al. (2025)', scope: '公司债 ETF 的篮子与被动基金实施裁量', reason: '观察“passive mandate、active implementation”在不流动市场的真实边界。', url: 'https://doi.org/10.1093/rfs/hhaf034' },
    { title: 'Green & Jame (2011)', scope: '机构逐笔交易与 S&P 新增执行时钟', reason: '用真实成交反驳“所有指数基金都在生效收盘一次完成”的机械故事。', url: 'https://doi.org/10.1016/j.finmar.2011.02.004' },
    { title: 'Harris & Gurel (1986)', scope: '早期 S&P 500 纳入后的价格与成交量、约两周反转', reason: '先理解 temporary price pressure 证据及其历史制度边界。', url: 'https://doi.org/10.1111/j.1540-6261.1986.tb04550.x' },
    { title: 'Shleifer (1986)', scope: 'S&P 500 纳入需求与持续异常回报', reason: '再与 Harris–Gurel 对读，理解向下倾斜需求与暂时压力为何是竞争解释。', url: 'https://doi.org/10.1111/j.1540-6261.1986.tb04518.x' },
    { title: 'Wurgler & Zhuravskaya (2002)', scope: '替代证券、特异风险与有限套利', reason: '理解为什么看见机械需求的套利者也不能无限平坦化单股需求。', url: 'https://doi.org/10.1086/341636' },
    { title: 'Chang, Hong & Liskovich (2015)', scope: 'Russell 断点识别', reason: '学习如何从事件相容性推进到局部因果，同时保留阈值与外部效度边界。', url: 'https://doi.org/10.1093/rfs/hhu041' },
    { title: 'Greenwood & Sammon (2025)', scope: '1980–2020 的指数效应时变', reason: '理解市场参与者、执行与流动性会适应公开规则，历史效应不是结构常数。', url: 'https://doi.org/10.1111/jofi.13410' },
    { title: 'Bogousslavsky & Muravyev (2023)', scope: '收盘竞价、价格发现与反转', reason: '把收盘的低冲击流动性与暂时价格偏离同时放进执行模型。', url: 'https://doi.org/10.1016/j.finmar.2023.100852' },
    { title: 'Pavlova & Sikorskaya (2023)', scope: 'benchmarking intensity 与需求弹性', reason: '从狭义被动持有扩展到全部基准化管理人的聚合需求。', url: 'https://doi.org/10.1093/rfs/hhac055' },
    { title: 'Todorov (2021)', scope: '债券 ETF 的部分篮子、dealer 与压力状态', reason: '识别股票复制直觉为什么不能无修改地套到低成交固定收益资产。', url: 'https://www.bis.org/publ/qtrpdf/r_qt2103d.htm' },
    { title: 'Appel, Gormley & Keim (2016)', scope: '被动持有与公司治理', reason: '理解被动 security selection 与 active ownership 是不同决策轴。', url: 'https://doi.org/10.1016/j.jfineco.2016.03.003' },
    { title: 'Aggarwal, Saffi & Sturgess (2015)', scope: '证券借贷、召回与投票', reason: '把借贷收入、借券供给、投票权与受托选择接入同一状态系统。', url: 'https://doi.org/10.1111/jofi.12284' },
    { title: 'IOSCO Principles for Financial Benchmarks', scope: 'Principles 1–4、6–14、17–19', reason: '从方法之外理解指数提供商的总体责任、冲突、质量与问责。', url: 'https://www.iosco.org/library/pubdocs/pdf/IOSCOPD409.pdf' },
    { title: '上交所 · 指数 ETF 业务实施细则', scope: '第 2、7–9、16–24、30–31 条', reason: '核对中国指数 ETF、代理券商、申赎单位、分类结算、PCF 与参考净值的现行边界。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/fund/trading/c/c_20250606_10781071.shtml' },
  ],
};
