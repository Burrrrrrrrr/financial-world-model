import InflationLab from '../components/InflationLab';
import InflationTransmissionChart from '../components/InflationTransmissionChart';
import { inflationScenarios } from '../components/inflationScenarios';
import { lesson302ReadingList, lesson302References } from './lesson-3-02-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson302Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>通胀是一个被严格定义的价格总量之变化；它由异质价格重置聚合生成，并会因冲击持续或内部传播而持续。</h2>
        <p>
          通胀不是“有些东西变贵了”，而是在一个预先规定的人群、地域、交易范围和消费或生产边界内，许多价格经过可比化、加权与聚合以后形成的总体价格水平在明确期间内发生变化。因而，任何通胀判断都隐含两套问题：统计系统究竟测量了谁购买或生产的什么东西，以及这些价格为什么发生变化。前一套问题若没有先答清，后一套机制分析就会把口径差异误写成经济原因。<Cite n={1} /><Cite n={2} /><Cite n={4} /><Cite n={9} />
        </p>
        <div className="causal-chain" aria-label="通胀从冲击到资产反馈的完整链条" role="list">
          <div role="listitem"><span>01</span><b>Object</b><p>人口、范围、权重与时钟。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Shock</b><p>需求、供给、成本与制度。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Pricing</b><p>企业在竞争和合同下重置价格。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Propagation</b><p>工资、预期、合同与网络。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Aggregation</b><p>CPI、PCE 与 GDP prices。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Feedback</b><p>收入、利润、政策与资产。</p></div>
        </div>
        <p>
          一个家庭经历的价格变化可以显著偏离全国指数，一项相对价格跳升可以只造成一次价格水平变化，GDP 价格指数与居民消费价格指数也可以朝不同方向运动。这些差异不自动说明哪个指标错误，而是说明它们在观察不同经济对象。持续通胀可以来自外生涨价本身不断出现；对一次性冲击而言，则必须有工资、合同、预期、融资或政策等反馈把旧变化写入新一轮定价，才会产生内部传播。<Cite n={6} /><Cite n={23} /><Cite n={44} /><Cite n={71} />
        </p>
        <InflationTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、六层契约与学习路线</p>
        <h2>先回答“测到了什么”，再回答“为何涨价”；模型、公司与资产只能接在这两层之后。</h2>
        <div className="learning-objectives">
          <span>六层路线 · 从指数对象到资产反馈</span>
          <ol>
            <li><b>测量对象（00–23）：</b>价格水平、权重、范围、住房、医疗、季调、时钟、家庭异质性。</li>
            <li><b>企业价格形成（24–34）：</b>需求、供给、边际成本、markup、商品、汇率、网络与合同租金。</li>
            <li><b>反馈与制度（35–39）：</b>财政构成、名义锚、预期、指数化以及动态断链。</li>
            <li><b>模型与识别（40–50）：</b>微观调价、Phillips family、NKPC、持久性、因子与证据阶梯。</li>
            <li><b>案例与市场（51–59）：</b>历史多冲击、实时失败、公司损益、资产负债表、债券与股票。</li>
            <li><b>主动迁移（60–63）：</b>十道互动、十道静态孪生、十四道检查、十八个术语与证据审计。</li>
          </ol>
        </div>
        <p>
          硬先修为 3.01；建议按需调用 T01–T06。零背景核心首读走 00–09、11–12、14、16–17、19–23，再进入 24–39、43–50、52–60；完整正文与逐式复算约 190–235 分钟。3.03 承接就业、议价与工资分布，3.04 承接预期形成和测量，3.05 承接央行目标、反应函数与工具，3.07–3.08 承接利率和收益率曲线，4.14 与 4.17 承接商品链及股债相关状态。本节只交付这些章节所需的通胀对象与机制接口。Underlying inflation 本身不可直接观察，因此课程并列多种指标与机制证据，不宣布某个指标永远代表“真实通胀”。<Cite n={37} /><Cite n={41} /><Cite n={42} />
        </p>
      </section>

      <section className="lesson-section" id="level-rate-relative">
        <p className="section-kicker">02 · Price Level、Inflation 与 Relative Price</p>
        <h2>高价格水平、正通胀和某个相对价格更高，是三个彼此连接却不能互换的命题。</h2>
        <div className="equation-card">
          <span>期间必须写入通胀定义</span>
          <div>π<sub>t,h</sub> = P<sub>t</sub>/P<sub>t−h</sub> − 1；　Δ<sub>h</sub>lnP<sub>t</sub> = lnP<sub>t</sub> − lnP<sub>t−h</sub></div>
          <p>第一式是精确普通增长率；第二式可跨相邻期间相加，并在变化较小时近似第一式。P 是同一对象、方法与版本下的价格指数，h 决定比较窗口。</p>
        </div>
        <p>
          价格水平 P 是许多价格按既定方法聚合后的指数水平；指数“100”通常只是缩放，不表示一户家庭要支付 100 元。相对价格则比较商品 i 与 j 的价格比 p<sub>i</sub>/p<sub>j</sub>。某一种商品上涨 20%，其他商品下降或不变，总体价格水平可能只小幅上升；许多分项同步温和上涨，却可能形成广泛通胀。对共同与相对价格成分的统计分解也是模型下的 latent object，并非直接观测事实。<Cite n={1} /><Cite n={6} /><Cite n={9} /><Cite n={71} />
        </p>
        <p>
          通胀从 6% 降至 3% 是 disinflation：价格仍在上涨，只是速度变慢；价格水平持续下降才是 deflation。一次能源价格跳升可以永久抬高价格水平，却在能源不再涨、也没有二轮传播时只产生一期通胀。把 rate、level 与 relative price 分开，是后续全部机制判断的第一道防线。
        </p>
      </section>

      <section className="lesson-section" id="index-anatomy">
        <p className="section-kicker">03 · Quote → Price Relative → Aggregate</p>
        <h2>统计系统观察具体交易价，再经可比化、低层聚合和高层权重生成指数；它从不直接观察“通胀”。</h2>
        <p>
          Posted price 是标价，transaction price 是优惠券、会员价、数量折扣和退货规则后的实际成交价；unit value 是一组交易总金额除以总数量，会因产品组合改变而变化，即使每个可比产品价格都没变。价格采集因此必须先固定产品规格、质量、门店、交易条件和计量单位。<Cite n={1} /><Cite n={2} /><Cite n={10} />
        </p>
        <div className="equation-card">
          <span>从单项 price relative 到一阶贡献</span>
          <div>r<sub>i,t</sub> = p<sub>i,t</sub>/p<sub>i,t−1</sub>；　π<sub>t</sub> ≈ Σ<sub>i</sub>w<sub>i,t</sub>π<sub>i,t</sub></div>
          <p>第一式必须比较可比项目。第二式只是一阶贡献直觉；精确结果还取决于低层算术或几何平均、权重时期、链结以及官方发布算法。</p>
        </div>
        <p>
          统计者先把同一基本分类的 price relatives 聚合成 elementary index，再以支出或产出权重向上聚合。因此“把今天所有价格求平均再除以去年平均价格”通常不是官方指数。低价商品转向高价商品会推高 unit value，却可能只是 mix 变化；同一产品促销结束才更接近可比交易价上涨。指数工程的任务正是尽量分开价格、质量、数量与组合。<Cite n={1} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="population-scope">
        <p className="section-kicker">04 · Target Population、Scope 与 Coverage</p>
        <h2>任何价格指数都必须先说明代表谁、理论上包含什么、实际观察到什么，以及交易按哪里归属。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="价格指数对象的五个边界，可横向滚动">
          <table className="concept-table">
            <caption>边界差异不自动等于遗漏或操纵</caption>
            <thead><tr><th scope="col">字段</th><th scope="col">它回答的问题</th><th scope="col">典型错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Population</th><td>指数代表哪些家庭、消费者或生产者</td><td>把全国指数称为“中位家庭”</td></tr>
              <tr><th scope="row">Scope</th><td>理论目标包含哪些交易、商品和服务</td><td>把不同目标排成准确度等级</td></tr>
              <tr><th scope="row">Coverage</th><td>样本和资料实际覆盖到哪里</td><td>把目标范围当已完全观测</td></tr>
              <tr><th scope="row">Geography</th><td>按购买地、居住地还是生产地组织</td><td>把生产价与居民购买价混合</td></tr>
              <tr><th scope="row">Transaction rule</th><td>自付、代付、实物和估算服务怎样处理</td><td>认为没有当场付款就没有消费</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国 CPI-U、CPI-W 与 chained CPI 的人口、用途或公式并不完全相同；PCE 覆盖由家庭及代表家庭发生的更广消费。<Cite n={18} />欧盟 HICP 以 household final monetary consumption expenditure 为核心，因此与纳入 imputed rent 的指标边界不同。免费公共服务可以提高福利却没有家庭成交价；医疗可由保险或政府支付。是否纳入取决于指数究竟测家庭自付、代表家庭发生的消费，还是更广福利，而不是服务是否重要。<Cite n={1} /><Cite n={2} /><Cite n={9} /><Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="index-formulas">
        <p className="section-kicker">05 · Laspeyres、Paasche、Fisher 与 Substitution</p>
        <h2>指数公式是在不同期篮子之间作条件比较；“考虑替代”不等于知道完整反事实福利。</h2>
        <div className="equation-card">
          <span>三种经典价格指数</span>
          <div>P<sup>L</sup><sub>0t</sub>=Σp<sub>t</sub>q<sub>0</sub>/Σp<sub>0</sub>q<sub>0</sub>；　P<sup>P</sup><sub>0t</sub>=Σp<sub>t</sub>q<sub>t</sub>/Σp<sub>0</sub>q<sub>t</sub>；　P<sup>F</sup><sub>0t</sub>=√(P<sup>L</sup>P<sup>P</sup>)</div>
          <p>Laspeyres 问旧篮子今天多少钱，Paasche 问今天篮子按旧价格多少钱，Fisher 取两者几何平均；三者都要求一致边界、正值和可比商品。</p>
        </div>
        <p>
          相对价格改变时，消费者可向替代品转移。固定旧篮子不会立即吸收跨类别替代；相邻期变权与链式指数更快反映组合变化，却更依赖及时数量资料并可能修订。低层 geometric mean 允许同一基本类别内一定替代，但不等于捕捉所有跨类别行为；C-CPI 与 PCE 也不能只用“都考虑替代”概括。<Cite n={1} /><Cite n={5} /><Cite n={6} /><Cite n={9} /><Cite n={11} /><Cite n={17} /><Cite n={20} />
        </p>
        <div className="precision-note"><span>Superlative 不是无条件冠军</span><p>Fisher 的理论性质依赖明确聚合函数与资料条件。固定型指标可能更适合及时发布或合同指数化，链式指标可能更适合不断变化的消费构成；公式必须服从测量目标。</p></div>
      </section>

      <section className="lesson-section" id="cpi">
        <p className="section-kicker">06 · CPI</p>
        <h2>CPI 测量目标消费人群自付购买的商品与服务价格；它不是永久固定篮子，也不是完整生活成本或福利指数。</h2>
        <p>
          美国 CPI 从家庭消费调查等资料估计 expenditure weights，并从地区、门店和项目样本取得价格；低层可用 geometric mean，高层 CPI-U 采用 Laspeyres 型结构，C-CPI-U 则用更及时变权但须经历初值、过渡值和终值。Relative importance 会随价格相对变化而漂移，权重也定期更新，所以“CPI 是几十年不变的固定篮子”并不准确。<Cite n={9} /><Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={16} /><Cite n={17} />
        </p>
        <p>
          CPI 目标虽受 COLI 框架指导，实际编制仍受可观察交易、质量处理、人口与地理覆盖约束。资产买卖、税收转移和大部分家庭自有资产价格不是同一类当期消费服务价格；自住房通过 OER 等服务口径进入。CPI 也不自动覆盖由雇主、保险或政府代表家庭支付的全部消费。<Cite n={9} /><Cite n={13} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="pce">
        <p className="section-kicker">07 · PCE</p>
        <h2>PCE price index 追踪 personal consumption expenditures 的价格，范围、权重资料、公式和修订机制都与 CPI 不同。</h2>
        <p>
          PCE 不仅覆盖家庭直接支付，也覆盖代表家庭支付的部分消费，并包含服务家庭的非营利机构等 personal-sector 边界。BEA 在细项层面调用 CPI、PPI 与其他价格资料，进行符合国民账户概念的调整，再以 Fisher chain-type 方法聚合。相邻期 current-dollar expenditures 和价格数量结构改变 relative weights，因此它不是一套长期固定篮子。<Cite n={18} /><Cite n={19} /><Cite n={20} /><Cite n={25} />
        </p>
        <p>
          更广范围并不意味 PCE 适合所有问题。研究家庭当场自付压力时，CPI 的交易边界可能更贴近目标；研究整个 personal consumption 价格时，PCE 更匹配。Market-based PCE 突出主要由可观察市场交易定价的项目，却不能理解为删除全部 imputation；总 PCE 中 OER 等估算服务有明确账户角色。PCE 也会随完整账户资料、价格源和方法更新而修订。<Cite n={21} /><Cite n={22} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="gdp-price-purchases">
        <p className="section-kicker">08 · GDP Price Index 与 Gross Domestic Purchases</p>
        <h2>GDP prices 按境内生产组织，domestic purchases prices 按居民最终购买组织；进口与出口使两者天然分离。</h2>
        <p>
          GDP price index 覆盖境内生产的最终货物与服务，包括出口、排除进口；gross domestic purchases price index 覆盖本国居民购买的最终商品与服务，包括进口、排除出口。PCE 是居民购买中的消费部分，domestic purchases 还含私人投资与政府最终购买。对象不同，三者并不是由窄到宽的准确度阶梯。<Cite n={4} /><Cite n={23} /><Cite n={25} />
        </p>
        <div className="equation-card">
          <span>GDP implicit price deflator</span>
          <div>GDP IPD<sub>t</sub> = current-dollar GDP<sub>t</sub> / chained-dollar GDP<sub>t</sub> × 100</div>
          <p>它是相容名义与链式实际 GDP 的比率，不是固定商品篮子；链式量方法、质量、进出口价格和分项构成都进入结果。</p>
        </div>
        <p>
          进口能源价格大涨而国内最终产出价格稳定时，CPI 或 domestic purchases prices 可以明显上升，GDP price index 却没有同样直接反应；出口价格上涨时方向可能反过来。PPI 测生产者在不同阶段收到或支付的价格，既不等于 GDP prices，也不直接等于成本或利润。<Cite n={3} /><Cite n={4} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="cpi-pce-gdp-bridge">
        <p className="section-kicker">09 · CPI–PCE–GDP Four-difference Bridge</p>
        <h2>指标之间的差异至少拆成 formula、weight、scope 和 other 四类；住房或医疗故事通常同时穿过多栏。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="CPI PCE GDP 四类差异桥，可横向滚动">
          <table className="concept-table">
            <caption>比较任何两只价格指数时先填这四栏</caption>
            <thead><tr><th scope="col">差异</th><th scope="col">核心问题</th><th scope="col">实例</th></tr></thead>
            <tbody>
              <tr><th scope="row">Formula</th><td>固定型、低层几何或 Fisher chain 如何聚合</td><td>替代和相邻期变权</td></tr>
              <tr><th scope="row">Weight</th><td>同一价格变化被赋予多少相对支出权重</td><td>住房、医疗权重不同</td></tr>
              <tr><th scope="row">Scope</th><td>自付、代付、非营利、投资、政府和进出口是否纳入</td><td>PCE 第三方医疗支付</td></tr>
              <tr><th scope="row">Other</th><td>价格源、概念调整、质量、季调与残差</td><td>BEA 调整底层来源</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          医疗既可能因第三方支付产生 scope difference，也可能因权重来源产生 weight difference，并因国民账户概念调整产生 other effect；住房同样可同时影响范围与权重。因此，把 CPI–PCE 差异全部归因于住房或消费者替代都不完整。历史 reconciliation 可以在特定期间量化四类效应，却不能生成永久固定差；相对价格、消费结构、资料源和季调会持续变化。<Cite n={18} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="weighting-households">
        <p className="section-kicker">10 · Plutocratic、Democratic 与 Personal Weights</p>
        <h2>一元支出、一户家庭和个人篮子是三种不同聚合单位；总指数不承诺等于“典型家庭”。</h2>
        <div className="equation-card">
          <span>两种群体权重</span>
          <div>w<sup>P</sup><sub>i</sub>=Σ<sub>h</sub>x<sub>hi</sub>/Σ<sub>h,j</sub>x<sub>hj</sub>；　w<sup>D</sup><sub>i</sub>=(1/H)Σ<sub>h</sub>[x<sub>hi</sub>/Σ<sub>j</sub>x<sub>hj</sub>]</div>
          <p>Plutocratic 先汇总所有支出，每一元同权；democratic 先算每户预算份额，再让每户同权。名称描述聚合单位，不是规范意义上的好坏。</p>
        </div>
        <p>
          Personal inflation 还取决于一户自己的品类、数量、地区、门店、促销和实际成交价。以房租、食品和公共交通为主的家庭，可以长期偏离拥有住房和汽车的家庭。组别指数能更接近某类家庭，却仍是组均值，不是组内每户 COLI；以 PCE 构造群组 Fisher measures 也不能把平均值直接下沉为个体福利。<Cite n={29} /><Cite n={30} /><Cite n={31} /><Cite n={44} /><Cite n={45} />
        </p>
      </section>

      <section className="lesson-section" id="headline-core">
        <p className="section-kicker">11 · Headline 与 Core</p>
        <h2>Headline 保留目标范围内全部项目；core 是提取较持续信号的一种过滤器，不是“真实通胀”的无条件别名。</h2>
        <p>
          美国常见 core CPI 或 core PCE 排除 food and energy，但 core 的定义依机构和国家而变。固定排除简单、及时、可解释，却预先假设噪声集中在指定项目；二手车、机票等未排除项目仍可剧烈波动，能源也可通过运输、投入成本和预期产生后续传播。排除只改变监测信号，不会删除家庭实际支出或经济因果。<Cite n={35} /><Cite n={36} /><Cite n={37} />
        </p>
        <p>
          Headline 可以高于或低于 core。能源下跌使 headline 快速回落，而广泛服务价格仍缓慢上涨，并不矛盾；两个指标只是保留了不同信息。研究者应说明 core 想描述或预测哪一种持久成分，并用成本、工资、需求与调价行为交叉核对，而不是宣布它永远更接近真值。<Cite n={37} /><Cite n={41} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="underlying-measures">
        <p className="section-kicker">12 · Trimmed Mean、Median 与 Model-based Underlying</p>
        <h2>截尾、加权中位数和潜在因子分别利用分布与共动；它们有不同目标函数、修订与失效方式。</h2>
        <p>
          Trimmed mean 按分项涨幅排序，从上下尾部剔除指定支出权重，再重加权中间部分；weighted median 取累计支出权重约为 50% 的分项。Dallas Trimmed Mean PCE 与 Cleveland median/trimmed CPI 的比例是历史校准，不是自然常数。它们能减少极端分项影响，却可能剔除具有持久传播意义的冲击。<Cite n={35} /><Cite n={36} />
        </p>
        <p>
          Model-based measures 用动态因子或状态空间模型，从许多分项估计共同、持久或预测相关成分。NY Fed MCT、PCCI 等选择不同数据维度、因子与误差结构；新增资料和模型重估可改写历史 latent series。它们不是藏在数据背后的唯一真值。没有一种 underlying measure 在所有时期和用途稳定获胜，可靠做法是并列指标并检验机制一致性。<Cite n={37} /><Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={42} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="reference-chain-contribution">
        <p className="section-kicker">13 · Reference Triad、Chain-linking 与 Contribution</p>
        <h2>价格基期、权重基期与指数参考期必须分开；重新缩放、更新权重和改变增长路径也必须分开。</h2>
        <p>
          Price reference period 是价格比较依托期，weight reference period 是支出或数量权重代表期，index reference period 只把指数缩放为 100。单纯 rebasing 不改变各期通胀率；更新权重或方法可能改变增长路径。Chain-linking 计算相邻期 relatives 并连乘成长序列，可更新篮子，却必须保存链接点、权重资料和初终状态。不同统计体系的更新频率与轮换制度不同，不能只看“都叫 CPI”。<Cite n={1} /><Cite n={5} /><Cite n={17} /><Cite n={20} /><Cite n={29} /><Cite n={33} /><Cite n={34} />
        </p>
        <p>
          分项 contribution 在小变化下常近似 w<sub>i</sub>π<sub>i</sub>，精确值取决于指数公式与官方方法。“贡献 0.4 个百分点”是账户分解，不表示在反事实中删除该分项后总通胀机械少 0.4 个百分点；替代、投入传导和政策响应都可能改变其他价格。链式实际金额也不一定能像固定价格金额那样逐项相加。<Cite n={1} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="quality-shrinkflation">
        <p className="section-kicker">14 · Quality、Package Size 与 Shrinkflation</p>
        <h2>同质价格需要把产品特征与数量保持可比；质量调整不是任意删除涨价，缩量也常先是单位换算。</h2>
        <p>
          新型号同时提价和提高性能时，直接比标价会把质量提升计成纯涨价；完全忽略换代又会漏掉消费者面对的新价格。统计方法可用直接可比、生产成本、option-cost、class-mean 或 hedonic regression 估计质量差异，每种方法都有资料与模型边界。Hedonic adjustment 借可观察特征与价格关系估计特征价值，不是因为某项涨得快便主观打折；可靠性取决于特征、样本、函数形式和市场稳定性。<Cite n={1} /><Cite n={8} /><Cite n={13} />
        </p>
        <p>
          500 克产品变成 450 克而标价不变，规范化单位价格上涨 500/450−1≈11.1%；这首先是数量可比化，不一定需要 hedonic model。等待时间变长、客服减少、耐用性下降等服务质量则更难观察。Quality adjustment 存在误差并不意味着应改用未经可比化的贴价。<Cite n={1} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="new-goods-sample">
        <p className="section-kicker">15 · New Goods、Replacement、Outlet、Missing、Rotation 与 Scanner</p>
        <h2>不断变化的商品与门店要求样本更新；更多交易数据能扩大覆盖，却不会自动解决目标、匹配和质量问题。</h2>
        <p>
          新品出现、旧品退出、消费者转向线上或折扣门店、样本门店关闭和暂时缺价都会破坏简单同项比较。新品太晚进入会漏掉早期降价与新增选择，太早进入又缺稳定质量和权重资料；outlet substitution 还需区分同质商品更便宜与门店服务、选品和交易条件改变。<Cite n={1} /><Cite n={7} />
        </p>
        <p>
          Replacement 用新观察替代不可得旧项，missing-price imputation 暂估缺失期，sample rotation 为代表性逐步更新项目或门店；三者都不能写成“价格未变”。Scanner 与交易级资料能扩大商品、门店、数量和促销覆盖，却仍要处理分类、退货、会员折扣、商品匹配、质量与线上线下服务差异。数据量更大不等于 target 更明确。<Cite n={1} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="rent-oer">
        <p className="section-kicker">16 · Rent 与 Owners’ Equivalent Rent</p>
        <h2>Rent 与 OER 测量住房服务而非住房资产；其滞后同时来自租约经济和抽样时钟。</h2>
        <p>
          Tenant rent 测租户为现有住房服务支付的租金；OER 估计屋主自住住房可获得的等价租金，排除家具、公用事业等特定项目。OER 不是房主主观报价，也不是房价、按揭利率、首付或本金偿还。BLS 以租赁单位为基础，不同 panel 每六个月采集一次并组合成月度指数；存量租约常在续约或换租时才重定价，所以新挂牌租金不会立即、等幅进入存量服务指数。<Cite n={14} />
        </p>
        <p>
          New Tenant Rent Index 突出新租户交易，可能更快反映市场转折，却回答新签约租金如何变化，而非全部租户或屋主服务成本。它可作领先信息，不能无条件替代官方 rent/OER。房价、挂牌租金、新签租金、存量租金与 OER 同时异向并非统计矛盾；它们的资产或合同对象不同。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="ooh-approaches">
        <p className="section-kicker">17 · OOH Use、Acquisition 与 Payments</p>
        <h2>自住房兼具资产、融资合同和居住服务，因此住房“通胀”必须先选择目标。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="自住房三种测量目标，可横向滚动">
          <table className="concept-table">
            <caption>三种方法分别回答服务、取得与现金流</caption>
            <thead><tr><th scope="col">方法</th><th scope="col">测量对象</th><th scope="col">不能被替代为</th></tr></thead>
            <tbody>
              <tr><th scope="row">Use</th><td>本期消费的住房服务，如 rental equivalence</td><td>房屋资产涨幅</td></tr>
              <tr><th scope="row">Net acquisition</th><td>家庭从部门外净购新住房及相关成本</td><td>全部存量住房市值</td></tr>
              <tr><th scope="row">Payments</th><td>按揭利息、交易费、维修等现金负担</td><td>无融资家庭的服务成本</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          HICP 以家庭最终货币消费为边界，现行范围不含 imputed owner rent，Eurostat 另编 net-acquisition OOHPI；英国 CPIH 使用 rental equivalence，HCIs 则采用 payments approach 并配合 democratic weighting。房价大涨而 OER 温和、按揭支付因利率重定价剧烈上升可以同时成立。评价指标前必须先说明研究消费服务、资产取得还是家庭现金流。<Cite n={27} /><Cite n={28} /><Cite n={31} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="medical-insurance">
        <p className="section-kicker">18 · Medical、Insurance、Third-party Payment 与 Imputation</p>
        <h2>医疗的消费者、付款人、服务提供者和价格观察者常不是同一主体；保费也不是纯服务价格。</h2>
        <p>
          医疗消费可能由患者、雇主、私人保险和政府共同融资。CPI 更接近目标家庭直接面对的自付交易，PCE 覆盖家庭及代表家庭发生的更广消费，因此同一医院服务在 scope、weight、价格源与概念调整上都可不同。医疗 CPI 较低不能自动推出系统总成本压力较低，家庭没有当场付款也不表示没有 personal consumption。<Cite n={18} /><Cite n={25} />
        </p>
        <p>
          保险保费包含预期赔付、风险池、管理服务与制度安排，不能直接当保险服务价格。国民账户可能用净服务或 imputed service 将融资流与当期消费服务分开。Market-based PCE 减少部分难以直接观察价格的项目，却不表示总 PCE 中所有估算服务都没有经济含义。严谨资料表必须分别记录 consumer、payer、provider 和 price source。<Cite n={21} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="seasonal-adjustment">
        <p className="section-kicker">19 · Seasonal Adjustment</p>
        <h2>季调移除稳定重复的日历模式，以突出新动量；它不会删除经济冲击，也不会让序列失去修订。</h2>
        <p>
          服装折扣、机票旺季、学费和公用事业可能在固定月份反复变化。Seasonal adjustment 估计并移除这种重复模式，使连续月率更可比；新增资料会重估近年季节因子，因此历史 seasonally adjusted changes 可以修订，而许多 not-seasonally-adjusted index levels 保持自身发布逻辑。SA 与 NSA 服务不同用途：短期动量常看 SA，合同指数化与精确同比往往核对 NSA。<Cite n={16} />
        </p>
        <div className="precision-note"><span>禁止混接</span><p>不能用 SA 分项月率与 NSA 总指数同比求贡献，也不能把季调修订解释成原始交易价格被改写。任何表格都应同时标明 SA/NSA、调整方法与 vintage。</p></div>
      </section>

      <section className="lesson-section" id="inflation-clocks">
        <p className="section-kicker">20 · MoM、Annualised、YoY、Annual Average 与 Base Effect</p>
        <h2>同一个价格指数可以同时讲出不同速度，因为月率、年化、同比和年度平均使用不同窗口。</h2>
        <div className="equation-card">
          <span>月率的复合年化</span>
          <div>π<sup>ann</sup><sub>t</sub>=(P<sub>t</sub>/P<sub>t−1</sub>)<sup>12</sup>−1；　若月率 1%，年化为 1.01<sup>12</sup>−1≈12.68%</div>
          <p>年化只把当前一个月速度复合十二次，不是未来十二个月预测；月率还必须先确认季调状态。</p>
        </div>
        <p>
          YoY 比较 P<sub>t</sub>/P<sub>t−12</sub>−1，汇总过去十二个月；annual average 比较两个日历年的十二个月平均水平。即使十二月同比相同，两经济体也可因年内路径不同而有不同年度平均。Base effect 是旧月份进入或退出同比窗口造成的机械变化：去年一次大涨退出窗口时，同比可下降，但当月价格压力未必转负；低基数亦可抬高同比。<Cite n={1} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="revision-vintage">
        <p className="section-kicker">21 · Revision、Vintage 与 Information Set</p>
        <h2>同一观察期可以有初值、过渡值、终值与重估历史；实时判断必须冻结当时真正可得的版本。</h2>
        <p>
          初值可能使用初步权重、缺失值处理和当时季调因子；以后会因新价格源、季调重估、国民账户修订或链式权重终值变化。C-CPI-U 明确经历 initial、interim、final，PCE 也随底层资料和 NIPA revisions 更新。严谨研究至少保存 observation period、public release date、vintage/as-of date 和当时 information set。用今天修订序列解释当年预测失败，会引入 hindsight 与 look-ahead。<Cite n={16} /><Cite n={17} /><Cite n={22} /><Cite n={25} />
        </p>
        <p>
          Revision 不表示初值无用，final 也不等于无误差真值；及时性与完整性是权衡。CPI 的 NSA level、SA history、PCE 和派生 underlying series 的修订规则不同，“通胀数据不会修订”与“所有历史都会重写”都过度概括。结论应对合理 vintage 选择可审计。
        </p>
      </section>

      <section className="lesson-section" id="distribution-diffusion">
        <p className="section-kicker">22 · Contribution、Distribution 与 Diffusion</p>
        <h2>贡献回答总量由谁算术构成，分布回答涨幅横截面形状，扩散回答上涨有多广；三者都不是冲击身份。</h2>
        <p>
          在简单近似下分项贡献 c<sub>i,t</sub>≈w<sub>i,t</sub>π<sub>i,t</sub>；精确值遵循指数机构方法。Distribution 观察分项涨幅的偏度、尾部和离散，diffusion 或 breadth 观察上涨分项覆盖。高权重能源暴涨可贡献大而 breadth 窄；许多小分项同步温和上涨可 breadth 广而无单一巨大贡献。Median、trimmed mean 和 common-component model 分别利用分布与共动，但后者依模型与修订。<Cite n={1} /><Cite n={35} /><Cite n={36} /><Cite n={39} /><Cite n={40} /><Cite n={71} />
        </p>
        <p>
          “贡献最大”不是“结构原因最重要”。能源贡献可能来自外部供给，也可能伴随全球需求；广泛上涨可来自共同需求，也可来自多个错开行业冲击。因果判断还需要数量、成本、工资、合同与识别设计。
        </p>
      </section>

      <section className="lesson-section" id="household-coli-welfare">
        <p className="section-kicker">23 · Aggregate、Household、COLI 与 Welfare</p>
        <h2>总价格指数、家庭经历、条件生活成本和福利是逐层扩张的对象；价格变化不能独自完成福利判断。</h2>
        <p>
          Aggregate CPI 通常按总体支出聚合，回答目标货币或消费部门购买力怎样变化；它不承诺代表中位家庭。家庭自己的 inflation experience 还由预算份额、地区、门店、规格、促销、住房 tenure 和成交价决定。一个租房与食品占比高的家庭可经历 6% 个人篮子通胀，而总 CPI 是 3%；两者可以都按各自目标正确。<Cite n={31} /><Cite n={44} /><Cite n={45} />
        </p>
        <p>
          Konüs COLI 在给定偏好、价格和效用目标下，问维持同一效用所需最小支出怎样变化。实际 CPI 只能在明确假设和可观察资料下近似；家庭可以替代、改变数量或降低质量，所以价格指数变化不等于福利损失。收入、失业、资产价格、公共服务、环境和闲暇也改变福利，却不都是消费价格指数成分。<Cite n={6} /><Cite n={9} />至此我们只回答“观察到了怎样的价格变化”；下一层才解释企业为什么真正调价。
        </p>
      </section>

      <section className="lesson-section" id="price-pipeline">
        <p className="section-kicker">24 · Import / PPI / CPI Price Pipeline</p>
        <h2>进口价、生产者价与消费价是不同边界下的指数；所谓 pipeline 是一组暴露与时钟，而不是固定传导率。</h2>
        <p>
          进口价格观察跨境交易价格，PPI 观察国内生产者在特定产出或投入边界上收到或支付的价格，CPI 观察居民消费篮子的取得价格。三者在商品与服务覆盖、税费、权重、质量、地理和交易时点上都可能不同。因此，“进口价格上涨 10%”不能恒等推出 PPI 或 CPI 上涨 10%；比较前必须先对齐产品、单位、地区、SA/NSA 与 release vintage。<Cite n={1} /><Cite n={3} /><Cite n={79} />
        </p>
        <p>
          边境成本只有经过进口投入份额、合同币种、库存与套保、生产率、批零成本、企业加成和最终需求，才可能进入消费价格。旧库存、替代供应或加成压缩可使 PPI 先升而 CPI 反应有限；零售服务成本或税费变化也可让 CPI 在 PPI 平稳时上涨。GSCPI 与生产者价格、商品通胀的历史联系可用于监测和条件预测，却不是每期供应链压力对 CPI 的结构乘数。<Cite n={80} /><Cite n={82} /><Cite n={86} />
        </p>
      </section>

      <section className="lesson-section" id="price-cost-markup">
        <p className="section-kicker">25 · P = μ × MC</p>
        <h2>价格可按边际成本与加成分解，但恒等分解只有在两者能被独立测量和解释时才成为因果模型。</h2>
        <div className="equation-card">
          <span>Cost–markup ledger</span>
          <div>μ ≡ P/MC；　P = μ × MC；　ΔlnP = ΔlnMC + Δlnμ</div>
          <p>MC 是多生产一单位的经济边际成本，μ 是无量纲加成因子。对正值变量，对数式精确；把 μ 定义成残差后再说“加成导致价格”仍只是重新命名。</p>
        </div>
        <p>
          MC 未必等于财报 cost of sales、平均成本或历史采购价。旧库存交付时，会计销售成本可能低于补货的重置成本；长期合同、能源套保与管制价格又让重置成本暂时进不了成交价。需求骤弱时，成本上升可被加成压缩部分吸收；短缺提高愿付价格时，已发生成本不变也可能伴随加成扩大。Rotemberg 一类调整成本还说明企业会比较立即重置与延后调整的动态代价。<Cite n={52} /><Cite n={55} /><Cite n={75} /><Cite n={76} /><Cite n={78} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="demand-pressure">
        <p className="section-kicker">26 · Demand Pressure / Capacity</p>
        <h2>需求只有在撞上向上倾斜或受限的可交付供给时，才更可能从数量扩张转成价格压力。</h2>
        <p>
          产能宽松、库存充足且招聘容易时，新增名义需求可以主要提高数量；设备利用率、关键劳动或交付能力接近约束时，额外订单会增加加班、排队、缺货与机会成本，价格反应更强。同一笔支出在不同 slack 状态下会产生不同量价组合，这是一项结构预测，不是“支出增加必然等比例涨价”的恒等式。<Cite n={87} /><Cite n={89} /><Cite n={92} />
        </p>
        <p>
          总量产出缺口不可直接观察，也会掩盖行业瓶颈。总量尚有闲置不排除汽车、住房或物流已拥堵；某行业报价上涨也不证明全经济过热。需求可泄漏到进口、储蓄或利润，也可由库存释放吸收。识别至少要联合数量、交付时间、库存、职位空缺和相对价格；高供给弹性、进口替代、可信扩产或需求快速逆转，都是可证伪的断链条件。<Cite n={58} /><Cite n={59} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="supply-constraint">
        <p className="section-kicker">27 · Supply Constraint / Bottleneck</p>
        <h2>瓶颈减少可交付数量或提高约束的影子成本；瓶颈指标却只是状态代理，不是冲击身份。</h2>
        <p>
          最终品需要多个互补投入时，最稀缺的芯片、港口时段或熟练工可以限制整条链，即使其余投入充足。企业随后会竞价稀缺投入、支付加急运费、改产品组合或限量销售。该机制说明瓶颈怎样进入成本和数量，却没有给定需求曲线、定价规则或冲击是否已被预期。<Cite n={86} /><Cite n={87} /><Cite n={89} />
        </p>
        <p>
          供应约束也不必产生总通胀：需求同步崩塌、消费者可替代、库存足或受影响部门权重小时，主要结果可能是数量下降与相对价变化，其他分项下跌还可抵消贡献。供应恢复后价格也未必立即回落，企业可能先补库存、清积压或等待合同重置。因此“约束消失”与“价格水平回到原点”是两个命题。<Cite n={53} /><Cite n={71} /><Cite n={88} />
        </p>
      </section>

      <section className="lesson-section" id="relative-price-aggregate">
        <p className="section-kicker">28 · Relative-price Shock → Aggregate Inflation</p>
        <h2>分项贡献是指数记账；从一次相对价格冲击到持续总通胀，还缺一条会自我延续的传播链。</h2>
        <div className="equation-card">
          <span>冻结权重的一阶教学桥</span>
          <div>π<sub>t</sub> ≈ Σ<sub>i</sub>w<sub>i</sub>π<sub>i,t</sub></div>
          <p>机械贡献取决于权重与分项涨幅；正式指数还含链式权重、替代、质量、新品和交叉项。贡献不等于因果，因为价格与权重都可能共同响应需求、收入和政策。</p>
        </div>
        <p>
          若能源权重 10%、价格一次上升 50% 后保持、其余价格不变，总指数从 100 升到 105 后保持 105，通胀路径是 5%、0%、0%。相对价和总体水平永久更高，却没有持续新增通胀。持续性需要连续新涨价，或工资、合同指数化、预期、加成与名义需求把旧变化写入新一轮价格；若反馈断开，“暂时通胀”也不承诺价格水平回落。<Cite n={1} /><Cite n={53} /><Cite n={71} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="wages-productivity-ulc">
        <p className="section-kicker">29 · Wage / Productivity / ULC / Feedback</p>
        <h2>工资增速、生产率和单位劳动成本必须先按单位闭合；ULC 进入 CPI 还要经过成本份额、需求、加成与合同。</h2>
        <div className="equation-card">
          <span>单位劳动成本</span>
          <div>ULC = compensation per hour / real output per hour；　若工资 +6%、生产率 +2%，ULC 比率=1.06/1.02≈1.0392</div>
          <p>ULC 约上涨 3.92%；6%−2%=4% 只是小变化近似。总工资、平均工资、工资份额与 ULC 不是同一对象。</p>
        </div>
        <p>
          工资—价格反馈持续需要劳动成本对边际成本重要、企业可重置价格、需求容纳涨价、工资谈判关注未来生活成本，并且生产率、加成压缩和政策反应没有截断。工资随生产率改善时 ULC 可不升；ULC 上升若由利润空间吸收，价格也未必同步；能源 CPI 一次上升若未进入合同和预期，更不自动构成螺旋。历史证据中许多工资—价格 episode 并未持续加速，因此结论必须写成有条件反馈，而非固定先后顺序。<Cite n={55} /><Cite n={72} /><Cite n={73} /><Cite n={74} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="markup-margin-profit">
        <p className="section-kicker">30 · Markup、Gross Margin、Unit Profit 与 Corporate Profit</p>
        <h2>加成、毛利率、单位利润和公司总利润使用不同成本、分母与边界；同向变化也不证明同一因果。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="加成毛利和利润边界对照，可横向滚动">
          <table className="concept-table">
            <caption>先冻结对象，再解释变化</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">教学表达</th><th scope="col">关键边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Economic markup</th><td>μ=P/MC</td><td>经济边际成本通常不可直接观察</td></tr>
              <tr><th scope="row">Gross margin</th><td>(P−c<sub>accounting</sub>)/P</td><td>会计销售成本、组合和确认时点</td></tr>
              <tr><th scope="row">Unit profit</th><td>单位收入减更广成本</td><td>口径依宏观或企业账本而变</td></tr>
              <tr><th scope="row">Corporate profit</th><td>单位结果×数量，再减固定项</td><td>折旧、利息、税、海外与公司覆盖</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          毛利率上升不必意味着结构 markup 上升，宏观 corporate profits 上升也不表示每家公司借通胀扩大利润。强需求与供给受限可让价格和利润共同上涨；投入到达财报的时滞、产品组合、补贴、海外收入或销量恢复也能提高利润。售价上涨而销量下降、单位成本涨得更快时，名义收入可以上升而毛利额与实际利润下降。证据必须冻结价格、数量、成本定义、存货计价、行业构成与反事实。<Cite n={75} /><Cite n={76} /><Cite n={77} /><Cite n={78} /><Cite n={116} /><Cite n={117} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="commodity-pass-through">
        <p className="section-kicker">31 · Commodity / Food / Energy Three-round Pass-through</p>
        <h2>商品冲击先直接进入 headline，再穿过投入网络，最后才可能闭合工资、合同、预期与政策反馈。</h2>
        <p>
          第一轮是能源、食品按消费权重直接贡献 headline；第二轮是燃料、电力、化肥、运输和包装进入其他商品与服务单位成本；第三轮才是工资、指数化、预期与政策把初始冲击扩散到更广价格。三轮有不同权重、时滞和识别难度，油价与 CPI 的同期相关系数不能当完整 pass-through。<Cite n={73} /><Cite n={83} /><Cite n={85} />
        </p>
        <p>
          油价上涨可能来自全球需求、特定供给中断或预防性需求，不同 shock identity 对收入、汇率与需求的伴随效应不同。商品只跳升一次时，直接同比效应最终退出；运输契约、生产周期与指数化可能让传播更久。能源补贴冻结零售价可延后 CPI 第一轮，却把成本转到财政或公共企业账本，不能说经济冲击消失。<Cite n={83} /><Cite n={84} /><Cite n={85} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="fx-pass-through">
        <p className="section-kicker">32 · FX / Import-price Pass-through</p>
        <h2>汇率先进入出口商报价与边境价格，再经过本地成本和加成进入零售；每一道闸门都可吸收或放大。</h2>
        <div className="equation-card">
          <span>按“本币/外币”报价</span>
          <div>P<sup>b</sup>=e×P*；　ΔlnP<sup>b</sup>=Δlne+ΔlnP*</div>
          <p>本币贬值不等于进口品同幅变贵，因为出口商可改变外币报价；边境到零售还要经过运输、工资、税、进口份额、库存和零售加成。</p>
        </div>
        <p>
          计价货币与企业网络改变短期传导：粘性合同可让汇率先落在进口商利润，拥有本地投入或同时出口的企业可以自然对冲。10% 贬值若伴随出口商降价、国内衰退与加成压缩，CPI 反应可远低于 10%；若又叠加全球商品涨价，边境价可涨得更多。Pass-through 是国家、产品、期限和状态下的估计参数；因果研究还必须从货币政策、风险厌恶与商品冲击中识别汇率变化。<Cite n={79} /><Cite n={80} /><Cite n={81} /><Cite n={82} />
        </p>
      </section>

      <section className="lesson-section" id="supply-chain-inventory">
        <p className="section-kicker">33 · Supply Chain / Shipping / Inventory / Time</p>
        <h2>库存先吸收交付延迟，耗尽后却会把同一冲击突然转成停产与竞价；补库又可能制造第二个时钟。</h2>
        <p>
          港口拥堵、航期不确定与零部件延迟会提高运输和缺货成本，迫使企业加急、改线或减少可售产品。库存最初让生产和定价暂时稳定，耗尽后冲击才显性化；随后同步补库可能放大订单与运价。因此 shock time、库存消耗、价格重置与 CPI release time 不共享同一时钟。<Cite n={86} /><Cite n={87} />
        </p>
        <p>
          GSCPI 将运输价格与制造业调查压缩为共同压力指标，其与生产者价格的统计联系支持监测和条件预测，却不证明每次上升都来自同一瓶颈，也不给企业到 CPI 的固定因果系数。库存充足、替代供应、需求转弱与长期合同可断链；运价回落后零售价仍升，也可能因为高成本补货正替代旧库存。<Cite n={86} /><Cite n={89} />
        </p>
      </section>

      <section className="lesson-section" id="rent-lag">
        <p className="section-kicker">34 · Market Rent、Contract Rent 与 OER Lag</p>
        <h2>边际新租约、存量合同与自住服务使用不同价格和重置时钟；领先关系存在，却没有固定月数。</h2>
        <p>
          新签约市场租金是边际租户当期成交价，存量合同租金是尚未续约租户实际支付价，OER 是自住房租赁服务估计；三者不是同一现金流。CPI shelter 通过租金样本与 rental equivalence 观察服务，房价、按揭本金和利率不能替换。租约轮换低频，加上分组访问与指数聚合，新租金转向通常先于存量 rent 和 OER。<Cite n={14} /><Cite n={15} />
        </p>
        <p>
          租约期限、搬迁率、管制、地域权重、房型与新租户选择都改变 lag；边际市场指数也未必代表整个存量。房价因折现率上升而跌、租赁服务因低空置率仍涨，或新租金已跌而 shelter CPI 仍吸收早先续约，都不矛盾。能说的是存量指数会平滑并滞后边际价格，不能承诺固定领先期。<Cite n={14} /><Cite n={15} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="fiscal-demand">
        <p className="section-kicker">35 · Fiscal Demand / Composition / Leakage / Capacity</p>
        <h2>财政余额不是通胀系数；工具、接受者、支出构成、泄漏和供给弹性共同决定量价反应。</h2>
        <p>
          政府购买直接形成特定商品和劳动需求；转移与减税先改变可支配收入，之后多少成为消费取决于边际消费倾向、资产负债表和不确定性；补贴与间接税还可直接改变测得消费者价格。同额赤字变化由不同工具产生，会有完全不同的时点、构成与供给含义。<Cite n={90} /><Cite n={95} />
        </p>
        <p>
          储蓄、偿债和进口是 leakage，闲置产能、劳动回流和生产率是 quantity response；供应受限且需求集中商品时，同额刺激更易抬价。跨国关联还可能被疫情严重度、封锁、货币政策与能源冲击共同决定。衰退中向高储蓄家庭发转移可能价格效应弱，扩大受约束医疗采购却可先抬局部价格。财政—价格的持久关系进一步依赖货币与财政 regime，不能由一次余额变化单独识别。<Cite n={90} /><Cite n={96} /><Cite n={97} />
        </p>
      </section>

      <section className="lesson-section" id="nominal-anchor-regime">
        <p className="section-kicker">36 · Monetary Accommodation / Nominal Anchor / Regime</p>
        <h2>名义锚约束长期价格路径，却不把每一次短期 CPI 波动都变成央行冲击；政策还会内生响应通胀。</h2>
        <p>
          持续总价格上涨需要名义体系允许总支出与价格水平共同扩张。货币政策可经利率、信贷、资产价格、汇率与预期改变需求和定价环境，但存在时滞，政策本身又响应通胀与活动。因此货币量、利率和通胀的同期关系同时含政策反应与私人行为，不能直接读成因果；较清晰 nominal anchor 与较低持久性的历史关联也不是随机实验。<Cite n={48} /><Cite n={61} /><Cite n={98} />
        </p>
        <p>
          可信锚定且财政可持续时，供给冲击可抬高价格水平并暂时推高通胀而不改写长期趋势；若财政负担无法由未来盈余承接、政策被迫容纳名义支出，特定模型会产生更持久通胀。这是财政—货币结构模型的条件预测，不是任意赤字的自动诊断。截至本节，Fed 现行框架是 2025 年生效的 2% annual PCE longer-run goal，ECB 为对称 2% 中期 HICP，加拿大协议只明确到 2026 年末；制度文件说明承诺，不证明预期已经完全锚定。<Cite n={95} /><Cite n={96} /><Cite n={97} /><Cite n={98} /><Cite n={99} /><Cite n={100} />
        </p>
      </section>

      <section className="lesson-section" id="expectations-pricing">
        <p className="section-kicker">37 · Expected Inflation into Pricing and Contracts</p>
        <h2>预期通过面向未来的重置价、工资、租约、库存和融资进入当前行为，但调查、市场与模型预期不是同一观察。</h2>
        <p>
          企业若预计下次调价前成本和竞争者价格上升，当前最优重置价可包含未来路径；劳动者与雇主若预计生活成本持续上升，合同期限与指数化也可能改变。这是结构通道，却不意味着“预期”可直接观察：家庭调查、专业预测与市场 inflation compensation 覆盖不同主体、期限和风险成分，NKPC 对未来预期的系数也依定价与识别假设。<Cite n={54} /><Cite n={56} /><Cite n={101} /><Cite n={102} />
        </p>
        <p>
          预期并非脱离约束便能自我实现。需求弱、竞争强时，企业即使预计总体通胀也可能无法涨价；可信政策、短合同和生产率改善可截断传播。调查上升还可能只是汽油价格显著性造成的外推。证据必须区分“报告了更高预期”“行为因预期改变”和“预期造成总通胀”；预期形成与分歧的完整机制留给 3.04。<Cite n={103} /><Cite n={104} /><Cite n={105} />
        </p>
      </section>

      <section className="lesson-section" id="contracts-indexation">
        <p className="section-kicker">38 · Indexation / Contracts / Administered Prices / Tax–Subsidy</p>
        <h2>指数化是可核验的规则传播，低频重置是时间摩擦；行政价格与税补贴则可能先改指数、后移成本。</h2>
        <div className="equation-card">
          <span>简化指数化合同</span>
          <div>X<sub>t</sub>=X<sub>t−1</sub>(1+λπ<sub>ref</sub>)</div>
          <p>λ 是传导比例，πref 必须指定指数、观察窗与滞后。只有合同真的引用该规则，历史通胀才机械进入当前 X；这不同于所有主体形成相同预期。</p>
        </div>
        <p>
          行政定价、增值税或消费税调整可在生效月改变观察价，补贴与价格上限可暂时压低它；随后才是供给、财政与配给问题。部分指数化、封顶、豁免、重谈和企业吸收税负都可断链。冻结电价使 CPI 不动，却可能扩大公共企业亏损或财政补贴。研究必须记录法律生效日、适用人群、含税报价和参考指数，不能把一次税率变化误判为持续内生通胀。<Cite n={1} /><Cite n={50} /><Cite n={73} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-break-map">
        <p className="section-kicker">39 · Feedback / Break Map</p>
        <h2>通胀持续性既可来自持续冲击，也可来自内部传播；每条“螺旋”都必须能指出增益、时滞与断点。</h2>
        <p>
          最小动态链是：外部冲击或名义需求改变可交付数量、边际成本或愿付价格，企业在合同与竞争约束下选择重置，价格又改变实际收入、销量、工资谈判、预期与政策环境，新状态成为下一轮成本和需求输入。这是一张机制地图，不是一条每次都会跑完的单向链。P=μ×MC 是恒等分解，“瓶颈提高影子成本”是结构命题，“GSCPI 领先某价格”是样本描述，证据等级不能混用。<Cite n={53} /><Cite n={61} /><Cite n={86} />
        </p>
        <p>
          库存与加成可在企业端吸收，生产率与劳动供给可在工资—成本端断链，需求回落可在销量端断链，可信名义锚可在预期端断链；指数化、同步重置、融资约束与政策容纳则会加强传播。能源一次涨价若无二轮效应，只永久抬高水平而通胀归零；若工资与合同把旧通胀写入新价格，初始冲击消失后总通胀仍可持续。所谓 spiral 因此必须说明反馈变量、时滞、增益和可证伪断点。<Cite n={71} /><Cite n={72} /><Cite n={73} /><Cite n={97} />
        </p>
      </section>

      <section className="lesson-section" id="micro-price-evidence">
        <p className="section-kicker">40 · Micro Price Evidence</p>
        <h2>企业调价离散、异质且伴随促销与产品替换；平均频率不能唯一识别其价格摩擦。</h2>
        <p>
          微观价格资料显示，调价频率、幅度、方向、销售折扣与产品更替在行业间高度异质，许多价格长期不动，另一些则大幅跳变。这排除了“所有价格无摩擦、同步连续调整”的极端描述，却不能凭平均频率单独区分菜单成本、信息摩擦、合同、客户关系或需求冲击。促销价频繁变化而常规价较黏时，把所有变价都计成结构重置会高估灵活性。<Cite n={67} /><Cite n={68} /><Cite n={69} />
        </p>
        <p>
          从微观事实到总通胀还要经过 selection：冲击发生时，哪些企业选择调价、权重多大、方向如何。状态依赖模型中，大冲击会改变进入调价集合的企业；Calvo 类模型则随机给调价机会。两个经济体可有相同平均频率，却分别由小幅随机重置与少数大幅阈值重置构成，聚合传导完全不同。验证必须联合 frequency、size、direction、hazard 与 aggregate contribution；特定 sufficient-statistic 结果也只在其模型类与冲击环境内成立。<Cite n={68} /><Cite n={70} />
        </p>
      </section>

      <section className="lesson-section" id="quantity-identity">
        <p className="section-kicker">41 · Quantity Identity / Nominal Spending</p>
        <h2>名义支出、价格和实际量的匹配分解是账户恒等；它不会自行说明哪一个变量外生推动另两个。</h2>
        <div className="equation-card">
          <span>边界匹配的名义—价格—数量系统</span>
          <div>N<sub>t</sub>=P<sub>t</sub>Y<sub>t</sub>；　ΔlnP<sub>t</sub>=ΔlnN<sub>t</sub>−ΔlnY<sub>t</sub></div>
          <p>名义支出增长 8%、实际量增长约 3% 时，价格增长约为 log 差；这不表示“多出的支出在因果上变成价格”。P 与 Y 若不覆盖同一边界，等式不会闭合。</p>
        </div>
        <p>
          MV=PY 也首先是数量一致性：若 V≡PY/M，它是定义。只有为货币需求、速度、供给规则和产出反应加入行为方程，才产生某个外生 M 冲击怎样影响 P 的结构预测。速度会随利率、支付技术和避险需求改变，货币量也可能内生响应信贷和政策。金融危机中基础货币上升而速度下降、产出收缩，价格不会按 M 同比机械变化。<Cite n={4} /><Cite n={48} /><Cite n={95} /><Cite n={98} />
        </p>
      </section>

      <section className="lesson-section" id="ad-as">
        <p className="section-kicker">42 · AD–AS</p>
        <h2>AD–AS 是把大量主体反应压缩成条件性量价图；需求与供给标签仍需外部识别。</h2>
        <p>
          总需求曲线压缩“给定政策、预期和资产负债表时，名义支出怎样响应价格状态”；总供给曲线压缩“给定成本、产能和定价摩擦时，可交付产出与价格怎样共同变化”。需求扩张通常使价格与数量同向，供给收缩通常使二者反向，但这只是 ceteris paribus 的诊断符号，不能凭两项总量数据完成冲击识别。<Cite n={87} /><Cite n={88} />
        </p>
        <p>
          曲线会移动和变形：财政储蓄与进口 leakage 改变 AD，能源、劳动与供应链改变 AS，预期和政策规则同时作用两边。需求转向商品叠加港口拥堵时，商品价格与数量都可能上升，服务又走另一条路径；简单供需二分无法容纳交互。AD–AS 的价值是迫使作者写明冻结条件与断链，不是把“需求拉动/成本推动”标签当已识别残差。<Cite n={89} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="phillips-family">
        <p className="section-kicker">43 · Phillips Family</p>
        <h2>同名曲线至少包含历史工资关系、价格—slack 回归、预期修正关系与结构 NKPC；斜率不能跨对象搬运。</h2>
        <div className="equation-card">
          <span>条件描述式</span>
          <div>π<sub>t</sub>=a+κx<sub>t</sub>+controls+ε<sub>t</sub></div>
          <p>x 可是失业缺口、产出缺口或职位空缺紧张度；κ 只是给定样本、指标、制度和控制变量下的条件关系，不自动成为政策可永久利用的 trade-off。</p>
        </div>
        <p>
          Phillips 原始被解释变量是货币工资变化，Phelps 与 Friedman 加入预期和自然率边界；现代价格回归与结构 NKPC 又是不同命题。长期预期、政策制度、供给冲击和 slack 测量变化会改变截距与斜率，总量平坦也可能掩盖周期敏感分项。供应冲击同时推高通胀和失业会污染朴素回归，政策因通胀收紧又产生反向因果。每次使用都应标明通胀对象、slack、预期、样本制度与识别方法。<Cite n={46} /><Cite n={47} /><Cite n={48} /><Cite n={58} /><Cite n={59} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="nkpc">
        <p className="section-kicker">44 · New Keynesian Phillips Curve</p>
        <h2>NKPC 在特定价格重置、竞争、技术与预期假设下连接未来通胀和实际边际成本；代理变量替换会改变命题。</h2>
        <div className="equation-card">
          <span>标准前瞻式</span>
          <div>π̂<sub>t</sub>=βE<sub>t</sub>π̂<sub>t+1</sub>+κmĉ<sub>t</sub>+u<sub>t</sub></div>
          <p>这里冻结标准线性化归一化：π̂ 与 u 都是相对稳态或趋势的每期 log-point 偏离，mĉ 是实际边际成本相对稳态的无量纲 log gap，κ 把该 gap 映射为同一每期通胀单位。若改用年化百分率，所有项和 κ 的时间尺度必须一致转换；把 mĉ 随手换成统计产出缺口，不保证结构不变。</p>
        </div>
        <p>
          Calvo 定价提供一条常用微观基础，Galí–Gertler 等经验式可加入滞后、调查预期或 ULC proxy；每次替换都改变可检验含义。预期测量误差、趋势通胀、状态依赖调价与遗漏冲击会被 β、κ 和残差吸收，同一数据可能同时拟合“低 κ、强锚定”与“高 κ、slack 测错”。NKPC 的价值在于清楚陈述反事实接口，不是用残差为所有供应冲击命名。<Cite n={51} /><Cite n={54} /><Cite n={55} /><Cite n={57} /><Cite n={60} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="pricing-rules">
        <p className="section-kicker">45 · Time-dependent / State-dependent Pricing</p>
        <h2>时间依赖规则固定调价机会，状态依赖规则让偏离与冲击改变调价选择；平均 duration 无法唯一选模。</h2>
        <p>
          Taylor 错开合同、Calvo 随机 hazard 与 Rotemberg 调整成本都能生成名义黏性，却以不同方式表示机会与代价。菜单成本等状态依赖模型则让调价概率随价格偏离、冲击幅度和企业状态变化；大冲击不只改变幅度，也改变谁进入调价集合。只凭“价格平均每八个月变化一次”无法在这些结构之间作唯一选择。<Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={56} />
        </p>
        <p>
          小而常见的冲击下两类模型可能预测接近，大而不对称的成本冲击与阈值集中时差异更明显。调价频率上升也不保证通胀大幅上升，新增调整可同时向上和向下；频率不变时少数高权重价格也可巨幅跳升。促销与产品替换进一步使观察变价不等于同产品最优重置，因此应联合 frequency、size、direction、hazard 和 aggregate contribution。<Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} />
        </p>
      </section>

      <section className="lesson-section" id="slope-regime">
        <p className="section-kicker">46 · Slope / Convexity / Flattening / Trend / Regime</p>
        <h2>“Phillips curve 变平”可能是结构斜率、样本变异、测量、冲击构成或制度变化；先分解事实，再解释。</h2>
        <p>
          Slack 变化变小、预期更稳、供给冲击更大或测量误差更重，都能让样本线性斜率看起来下降。若关系凸，接近产能约束时边际价格反应会比深度闲置时强，单一 κ 只是样本平均；只观察低通胀低波动制度，自然更容易估出平坦关系。Flattening 因此不等于需求不再影响通胀。<Cite n={58} /><Cite n={59} /><Cite n={60} />
        </p>
        <p>
          趋势通胀改变价格离散、重置诱因和线性化近似，policy regime 改变预期和冲击持续性。把不同制度拼成固定参数，容易将制度变化写成技术常数。锚定制度内总量关系很平而供应接近极限时突然变陡，或斜率稳定但趋势下降使截距改变，都是可能反例。报告应分开 slope、curvature、trend、regime，并以实时样本外预测检验。<Cite n={61} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="persistence-propagation">
        <p className="section-kicker">47 · Transitory / Persistent / Propagation</p>
        <h2>冲击持续多久、系统传播多久和价格水平最终在哪里，是三种不同的动态属性。</h2>
        <p>
          “冲击暂时”说外生输入多久消失，“通胀持续”说观察通胀对过去状态依赖多强，“价格水平永久更高”说冲击后的 level path。短促成本冲击可因错峰合同、库存与指数化产生持久通胀；持续相对价变化若被其他分项抵消，也未必形成高总通胀。自相关只描述 persistence，不能告诉我们来自持续 shock 还是内部传播。<Cite n={61} /><Cite n={62} /><Cite n={63} /><Cite n={65} />
        </p>
        <div className="equation-card">
          <span>Shock 与 propagation kernel</span>
          <div>π<sub>t</sub>=Σ<sup>∞</sup><sub>h=0</sub>ψ<sub>h</sub>ε<sub>t−h</sub>，且 Σ<sup>∞</sup><sub>h=0</sub>|ψ<sub>h</sub>|&lt;∞</div>
          <p>这里把 π 与 ε 都固定为每期 log points，因此 ψ 是无量纲 impulse-response weight，绝对可和条件保证稳定线性滤波。ε 的序列性质描述输入，ψ 描述系统如何延迟、吸收或放大；若把 ε 标准化成一单位 shock，ψ 的单位须相应改为 log points per shock。趋势、均值漂移和制度切换未处理时还会伪造高自相关。</p>
        </div>
        <p>
          同类冲击在制度改变后快速回落，说明历史 persistence 不是不可变常数。“Transitory”必须附对象、期限与断链假设，不能成为无需监测二轮反馈的同义词。<Cite n={60} /><Cite n={64} /><Cite n={66} />
        </p>
      </section>

      <section className="lesson-section" id="common-sector">
        <p className="section-kicker">48 · Common / Sector-specific Components</p>
        <h2>共同因子与行业成分是统计分解，不是天然的需求或供给标签；行业冲击也可经网络逐渐成为共同变化。</h2>
        <div className="equation-card">
          <span>分项因子教学式</span>
          <div>π<sub>i,t</sub>=λ<sub>i</sub>f<sub>t</sub>+s<sub>i,t</sub>；　Var(f)=1，且加权平均 λ 为正</div>
          <p>π 与 s 用每期 log points，f 被归一化为一标准差、符号按平均 loading 为正固定，因此 λ 的单位是 log points per factor standard deviation。该归一化只解决单因子的尺度与符号不唯一；多因子还存在 rotation，且任何统计因子都不自动拥有结构冲击身份。</p>
        </div>
        <p>
          Breadth 帮助区分少数大分项与广泛温和上涨，却不等于因果或持续性。高权重能源可推高 headline 而共同成分有限；许多行业同调也可能只是共同税率生效。芯片冲击先表现为 sector-specific，数月后在下游共同出现。可靠结论须联合权重、协方差、网络暴露和时间顺序，并检查因子对样本、分项数量与 vintage 的稳健性。<Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={71} /><Cite n={86} />
        </p>
      </section>

      <section className="lesson-section" id="identification-ladder">
        <p className="section-kicker">49 · Identification Ladder</p>
        <h2>机械贡献、领先、条件相关、因果效应与结构反事实是五级不同证据；每上一级都增加可被攻击的假设。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="通胀研究识别阶梯，可横向滚动">
          <table className="concept-table">
            <caption>图表相加闭合不代表原因已经识别</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">证据</th><th scope="col">可支持的主张</th></tr></thead>
            <tbody>
              <tr><th scope="row">1 · Contribution</th><td>w<sub>i</sub>π<sub>i</sub> 或账户闭合</td><td>谁在算术上贡献多少</td></tr>
              <tr><th scope="row">2 · Lead</th><td>X 在样本中领先通胀</td><td>条件预测信息</td></tr>
              <tr><th scope="row">3 · Conditional</th><td>回归控制后的关系</td><td>给定 controls 的相关</td></tr>
              <tr><th scope="row">4 · Causal</th><td>可信外生变动、事件或工具</td><td>局部处理效应</td></tr>
              <tr><th scope="row">5 · Structural</th><td>行为方程与完整反事实</td><td>模型条件下的路径与政策比较</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          通胀研究充满同时性：需求使价格和工资一起升，央行因通胀加息，汇率又响应全球风险。油价与 CPI 同期相关不能识别供给冲击，因为油价也可由全球需求推动；price–quantity sign、符号限制或外部工具都推进识别，却仍受分类、先验与排除限制约束。诊断协议应保存 treatment、outcome、timing、counterfactual、controls、sample、vintage 和 failure test。<Cite n={83} /><Cite n={84} /><Cite n={88} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="shock-decomposition">
        <p className="section-kicker">50 · Shock Decomposition</p>
        <h2>账户贡献、半结构 fitted components 与 VAR/DSGE historical decomposition 回答不同问题；彩色面积相加只证明模型记账闭合。</h2>
        <p>
          账户分解保证总和闭合却不识别 shocks；半结构分解依 controls 与参数稳定；结构历史分解按识别假设把预测误差分配给命名冲击。供应与需求可共同作用于同一分项，财政、货币和疫情严重度也可共同决定支出；不同 sign restrictions、先验或样本会给同一时期分配不同颜色。<Cite n={84} /><Cite n={88} /><Cite n={89} /><Cite n={90} />
        </p>
        <p>
          疫情商品价同时出现数量上升与交付受阻，纯供给/需求二分无法容纳交互。可靠图应并列 observable contributions、模型 residual、识别限制与跨模型区间；不能把 residual 直接更名为“贪婪”“预期”或“过度刺激”。不同疫情分解的价值在于提出可比较的条件叙事，而不是提供唯一真实配额。<Cite n={91} /><Cite n={92} /><Cite n={93} />
        </p>
      </section>

      <section className="lesson-section" id="great-inflation">
        <p className="section-kicker">51 · Great Inflation</p>
        <h2>1970 年代应作为多冲击与 regime 共同维持通胀的案例，而不是寻找一个永恒单因。</h2>
        <p>
          能源与食品相对价、生产率和劳动成本、合同与价格控制、预期学习以及货币—财政制度共同塑造路径；油价冲击自身又可能是供给、全球需求或预防性需求。把全部通胀归给 OPEC 解释不了冲击前后的趋势、跨国差异与制度下的持久性。价格管制还可压低当前测得价格，解除时造成集中重置。<Cite n={61} /><Cite n={64} /><Cite n={83} /><Cite n={84} /><Cite n={95} /><Cite n={96} />
        </p>
        <p>
          预期去锚与政策容纳可以延长传播，但不证明单一主体有意设计结果。后来油价大幅波动却未重现同等持续通胀，说明相同 commodity shock 在不同油占比、工资刚性、合同与政策信誉下有不同乘数。可守的结论是 multi-shock × regime，而不是为每一百分点给无争议配额或外推固定 Phillips slope。<Cite n={85} />
        </p>
      </section>

      <section className="lesson-section" id="pandemic-inflation">
        <p className="section-kicker">52 · Pandemic Inflation</p>
        <h2>疫情通胀必须按时间、部门与证据类型拆开；供需、财政、供应链、住房与劳动市场是接力而非互斥标签。</h2>
        <p>
          封锁与健康风险压低部分服务供给，财政转移和资产负债表支持名义需求，消费从接触服务转向商品并撞上工厂、港口和芯片瓶颈；商品链缓解后，住房、工资与服务价格按不同合同和重置时钟接力。制造业量价、跨国财政差异、GSCPI 和 vacancy 等证据组合支持多机制叙事，却不支持“一项变量解释全部”。<Cite n={86} /><Cite n={87} /><Cite n={89} /><Cite n={90} /><Cite n={91} /><Cite n={92} />
        </p>
        <p>
          每个比例都依样本、模型与 vintage。财政较大国家通胀更高受疫情与政策内生性影响；商品量价同升可指向需求，同时也存在交付约束；利润上升可与强需求共同出现而非独立 cause。相似全球冲击下，各国因能源结构、汇率、财政、劳动供给与信誉走出不同路径。结论必须分为可观测事实、模型归因与跨国相关，美国结果不能无条件外推。<Cite n={78} /><Cite n={90} /><Cite n={93} />
        </p>
      </section>

      <section className="lesson-section" id="realtime-forecast">
        <p className="section-kicker">53 · Real-time Forecast Failure / Vintage / Model Humility</p>
        <h2>真实预测只能使用当时发布的版本和可得变量；事后数据、未来系数与最终分类会制造虚假可预测性。</h2>
        <p>
          时点 t 的预测者只看见当时发布的数据、季调权重与不完整供给信息。实时评估要冻结 release date、observation period、revision status、seasonal-adjustment vintage、forecast origin 与当时模型。CPI NSA、SA history、C-CPI、PCE 和派生 core 的修订规则不同；用 final vintage 回测会高估当时可用性。<Cite n={16} /><Cite n={17} /><Cite n={22} /><Cite n={25} /><Cite n={109} /><Cite n={110} />
        </p>
        <p>
          疫情暴露稳定关系在大冲击、重配、缺失资料与训练区间外的脆弱性。复盘应分 data surprise、shock surprise、parameter instability 与 model omission，并用实时 vintage 重跑。一个事后完美模型若当时没有所需数据，或关键系数由未来样本估计，就不是实时成功。模型谦逊应落实为预测区间、替代模型、failure log 与可复核 information set，而非用“史无前例”免除可证伪性。<Cite n={66} /><Cite n={94} /><Cite n={111} />
        </p>
      </section>

      <section className="lesson-section" id="inflation-revenue">
        <p className="section-kicker">54 · Inflation → Nominal Revenue</p>
        <h2>企业收入是自身净成交价、销量、组合、汇率和合并范围的结果；总体通胀只提供环境，不是收入增长系数。</h2>
        <div className="equation-card">
          <span>多产品名义收入</span>
          <div>Revenue<sub>t</sub>=Σ<sub>j</sub>P<sub>j,t</sub>Q<sub>j,t</sub>；　ΔlnRevenue≈price + volume + mix + FX + scope</div>
          <p>P 是按 IFRS 15 transaction-price 规则处理折扣、返利、退款和退货权后的净成交价格，Q 是相容销量；mix、汇率和并购/处置边界必须另列，不能塞进“价格”。<Cite n={119} /></p>
        </div>
        <p>
          CPI 代表目标消费篮子，PPI 代表生产者价格边界，GDP prices 代表境内最终生产；没有一个会自动等于某公司 realized price。公司可能销售资本品、出口、在海外生产、拥有长期合同或大量免费服务，也可能在 CPI 上升时因需求转向而降价。即使每件价格上涨，销量下降仍可让收入减少；反之，零通胀环境下销量和组合改善也能推高收入。<Cite n={3} /><Cite n={23} /><Cite n={25} /><Cite n={119} />
        </p>
        <p>
          研究应把“总体通胀暴露”改写为可测桥：产品/地区收入权重、成交价指数、单位销量、合同重置频率、计价货币与报告范围。若声称 CPI 推高公司收入，高消费价格暴露和短合同企业应先出现 realized-price 变化；若收入只由并购、汇率换算或销量驱动，通胀现金流链就在第一环断开。
        </p>
      </section>

      <section className="lesson-section" id="input-cost-pass-through">
        <p className="section-kicker">55 · Input Cost → Pass-through</p>
        <h2>投入价格只有经过采购暴露、存货、套保、生产率、竞争、需求与合同，才成为单位成本并进入售价。</h2>
        <p>
          PPI 或商品指数不是企业 cost of sales 的完整代理：企业采购不同品质和地区的材料，还承担劳动、物流、折旧、能源、租金与税费；投入份额、固定价合同和计价货币也不同。历史成本可能先进入库存，补货成本决定未来决策，会计成本则在销售确认时释放。套期保值能平滑现金流，却可能在到期后形成 cliff；替代配方、产品重设计和生产率可降低物理投入量。<Cite n={3} /><Cite n={79} /><Cite n={80} /><Cite n={86} /><Cite n={118} />
        </p>
        <p>
          Pass-through 不是“有定价权/没定价权”的二值属性。需求强、竞争者同受冲击、客户转换成本高和合同可重置时，传导可能快；需求弱、进口替代、长期合同与加成空间大时，企业可能先压 margin。价格随后上调也不证明成本因果，因为需求或产品质量可同时变化。可证伪研究要比较冲击前已知的输入暴露，并观察采购成本→库存/单位成本→净售价→销量的时间顺序。<Cite n={75} /><Cite n={76} /><Cite n={78} /><Cite n={81} /><Cite n={82} />
        </p>
      </section>

      <section className="lesson-section" id="margin-profit-eps">
        <p className="section-kicker">56 · Margin / Profit / EPS / Real Profit</p>
        <h2>提价先经过销量和单位销售成本形成毛利，再经过费用、融资、税与股本才成为每股利润；名义利润还需选择合适 deflator。</h2>
        <div className="equation-card">
          <span>冻结同质产品的会计桥</span>
          <div>Revenue=Pq；　COGS=cq；　Gross Profit=(P−c)q；　Gross Margin=(P−c)/P</div>
          <p>c 是每单位 accounting cost of sales，不是经济 MC；销量会影响毛利额，但在同质单位毛利率中约去。多产品 mix、库存计价和费用分类会改变结果。</p>
        </div>
        <p>
          从 gross profit 到 EPS 还要扣营业费用、折旧、利息、税和少数股东，再除加权稀释股数；债务、并购、回购和增发可令总利润与每股利润异向。实际利润也不能随手除 CPI：若问题是股东消费购买力可用消费 deflator，若分析企业生产收益需匹配产出或投入边界；不同 deflator 回答不同经济问题。宏观 NIPA corporate profits 含当前生产调整，与 IFRS/GAAP 净利润、自由现金流或 EPS 也不是同一对象。<Cite n={76} /><Cite n={77} /><Cite n={78} /><Cite n={116} /><Cite n={117} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="balance-sheet-redistribution">
        <p className="section-kicker">57 · Balance-sheet Redistribution</p>
        <h2>意外通胀会重分配既定名义合同的实际价值，但方向取决于债权债务、重定价速度、税制和经营暴露。</h2>
        <p>
          固定名义债务的借款人往往因未预期价格水平上升而减轻实际偿债负担，贷款人则损失实际购买力；但浮息、短期滚动、通胀挂钩和提前重定价会削弱这条转移。持有现金与固定名义应收账款的主体受损，持有固定名义应付款的主体可能受益；退休金、租约、税档和工资若滞后指数化，也会在家庭、企业与政府之间重新分配。关键是 surprise 相对签约时信息集，而不是已被利率计入的预期通胀。<Cite n={106} /><Cite n={107} /><Cite n={112} />
        </p>
        <p>
          企业端还存在 working-capital channel：补库存需要更多名义融资，利率反应又抬高 carrying cost；拥有库存或实物资产不保证受益，因为需求、技术折旧与融资期限会改变净值。借款人受益也不是一般福利结论：若收入重定价慢于生活成本，或短债很快以更高利率续作，现金流可以恶化。完整分析应按合同逐项记录名义/实际、固定/浮动、期限、指数、重置日和交易对手。
        </p>
      </section>

      <section className="lesson-section" id="bonds-breakeven">
        <p className="section-kicker">58 · Realized Inflation / Nominal Bond / TIPS / Breakeven</p>
        <h2>名义债与通胀保护债的收益率差是 inflation compensation；预期、风险与相对定价楔子必须通过模型拆开。</h2>
        <div className="equation-card">
          <span>同期限的教学分解</span>
          <div>BE ≈ y<sup>N</sup>−y<sup>R</sup> = Eπ + IRP + liquidity/indexation/tax wedges</div>
          <p>BE 是原始 breakeven；Eπ 是预期通胀，IRP 是通胀风险溢价，其余楔子可含流动性、指数时滞、税和 deflation option。符号、期限与现金流必须明确。</p>
        </div>
        <p>
          TIPS 本金依规则按 CPI 指数化，而美国货币政策目标以 PCE 描述；两个指数的 basis risk 不会因都叫 inflation 消失。名义债受实际利率、预期通胀与风险溢价共同影响；TIPS 仍有实际利率久期、流动性与税务风险。收益率差变化可能来自预期，也可能主要来自风险补偿或市场功能，所以“breakeven 上升=市场预期一比一上升”不成立。官方模型 series 与学术分解提供条件估计，不是直接观察真值。<Cite n={98} /><Cite n={106} /><Cite n={107} />
        </p>
      </section>

      <section className="lesson-section" id="asset-interface">
        <p className="section-kicker">59 · Asset-pricing Interface</p>
        <h2>资产价格同时重估现金流、实际利率、预期通胀与风险溢价；“通胀利好/利空某资产”必须附 shock source 与 regime。</h2>
        <p>
          名义债对未预期通胀通常脆弱，却也会因增长恐慌导致实际利率下降而上涨；通胀保护债隔离部分 realized CPI 风险，仍暴露实际久期。股票是对未来名义现金流的剩余索取权：企业能否提价、销量和成本如何响应、债务是固定还是浮动、久期与估值多高，共同决定反应。历史上股票并非稳定的短期通胀 hedge，旧样本回归也不是当前制度定律。<Cite n={112} /><Cite n={113} />
        </p>
        <p>
          股债相关性依 inflation–output covariance 和政策 regime；供给型通胀可同时压现金流并推高利率，需求型冲击则可能短期支持盈利并抬收益率。油价上涨来自全球需求还是供给中断，可让股票反应异号。因此资产研究必须保存 shock identity、announcement surprise、初始估值、行业暴露、现金流与 discount-rate news，不能仅按 realized CPI 水准给资产贴永久标签。完整 real-rate、yield-curve、commodity 与 stock–bond 模型分别留给 3.07、3.08、4.14 和 4.17。<Cite n={114} /><Cite n={115} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">60 · Interactive Measurement-to-Pricing Lab</p>
        <h2>先在冻结数字下量对指数、时钟与边界，再把成本、加成、工资、汇率和公司毛利逐层接上。</h2>
        <p>
          十题分成两种模式。Mode A 校准固定权重贡献、月率/年化/同比、CPI–PCE 权重桥、质量与 OER、TIPS breakeven；Mode B 复算 unit cost×markup、工资/生产率/ULC、汇率两道传导、一次相对价跳升与企业毛利。题设为唯一判分冻结参数，不是现实预测。提交前记录置信度，首次答案和首次置信度保留；高置信错误要优先复盘，因为它暴露的是错误机制而非记忆遗漏。
        </p>
        <InflationLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道无脚本孪生题更换数字和情境，检验你能否迁移公式、对象、单位与因果边界。</h2>
        <div className="understanding-checks">
          {inflationScenarios.map((scenario, index) => (
            <details key={scenario.id}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>复算：</b>{scenario.staticTwin.answer}</p>
              <p className="impact-source-links"><b>依据：</b>{' '}{scenario.staticSourceIds.map((id) => <Cite key={`${scenario.id}:${id}`} n={id} />)}</p>
            </details>
          ))}
        </div>
        <p>
          完成标准不是看懂展开后的答案，而是在展开前写出 target、公式、单位、时钟和至少一个断链。若只能凭选项措辞作答，回到相应 revisit 单元并自行换一组数字；只有在表面情境变化后仍能复算，知识才从识别变成生成。
        </p>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks、Glossary 与 Evidence Passport</p>
        <h2>十四道检查要求重建机制，十八个术语固定对象；Evidence Passport 阻止测量、模型与因果证据互相冒充。</h2>
        <div className="understanding-checks">
          <details><summary>01 · 价格水平保持 105、通胀归零，为什么不矛盾？</summary><p>通胀是相邻期间价格水平变化。水平从 100 一次升到 105 后不再改变，第一期通胀 5%，以后为 0；零通胀不要求水平回到 100。</p></details>
          <details><summary>02 · 一个商品涨 20% 为什么不能直接称为 20% 通胀？</summary><p>它只是一个相对价格或分项变化。总体结果还取决于目标指数、权重、其他分项、质量、替代与聚合公式；结构原因还需另行识别。</p></details>
          <details><summary>03 · CPI、PCE 与 GDP prices 不同，哪一个更准确？</summary><p>先问目标。CPI 更接近特定家庭自付消费，PCE 覆盖代表家庭支付的更广消费，GDP prices 按境内最终生产组织；对象不同，不能无条件排准确度。</p></details>
          <details><summary>04 · Fisher 比 Laspeyres 更“高级”，为何不总是首选？</summary><p>Superlative 性质依聚合函数和及时数量资料。合同指数化、及时发布或资料受限时，固定型公式可更符合目标；选择须报告替代、修订与可解释性权衡。</p></details>
          <details><summary>05 · 房价跌、OER 涨、新租金跌可以同时发生吗？</summary><p>可以。房价是资产价格，新租金是边际合同，存量 rent/OER 通过续约和抽样慢慢重置；折现率、空置率与合同时钟可令三者异向。</p></details>
          <details><summary>06 · 同比下降为何不一定代表当月价格下降？</summary><p>同比同时更换新分子和十二个月前分母。旧高涨月份退出、最新月仍小幅上涨时，同比可下降；这是 disinflation 与 base effect，不是自动 deflation。</p></details>
          <details><summary>07 · PPI 领先 CPI 为什么还不能证明成本推动？</summary><p>两者边界不同，且共同需求、商品与汇率可同时推动。领先只提供预测顺序；因果还需投入暴露、合同、库存、成本和零售价的链式中间证据。</p></details>
          <details><summary>08 · P=μ×MC 为什么不证明 markup 导致通胀？</summary><p>若 μ 定义为 P/MC，分解先是恒等式。只有 MC 独立量测、μ 由明确行为机制决定，并有可信反事实时，才可讨论 conduct 的因果贡献。</p></details>
          <details><summary>09 · 工资上涨何时会形成持续工资—价格反馈？</summary><p>需要工资推高 ULC、劳动成本对 MC 重要、企业能涨价、需求容纳、合同与预期继续反馈，并且生产率、加成压缩和政策没有断链。共同上涨本身不是螺旋。</p></details>
          <details><summary>10 · 为什么商品价格一次跳升不会自动形成持续通胀？</summary><p>其机械贡献只出现在继续变化的期间。持续性需要商品继续涨，或运输、工资、合同、预期、加成和名义需求把初始冲击传播到后续价格。</p></details>
          <details><summary>11 · “Phillips curve 变平”至少有哪些替代解释？</summary><p>结构斜率下降、slack 变异缩小、预期更稳、供给冲击更大、测量误差、非线性或 regime 改变都可能。需分开 slope、curvature、trend 与 sample。</p></details>
          <details><summary>12 · 彩色 shock decomposition 面积闭合，为什么仍非唯一原因？</summary><p>闭合只是账户或模型记账。冲击命名依符号限制、工具、先验、参数与样本；供需交互和 residual 还可能被错误归类。</p></details>
          <details><summary>13 · 名义收益率减实际收益率为何不是纯预期通胀？</summary><p>Breakeven 还包含通胀风险溢价、流动性、指数时滞、税和期权等相对定价楔子；纯预期只能在模型和期限匹配下估计。</p></details>
          <details><summary>14 · 给“通胀提高企业 EPS”写一个 chain-break test。</summary><p>比较高低定价/投入暴露企业，并依次检验净售价、销量、单位销售成本、毛利、费用、利息税、稀释股数。若收入只来自 FX/并购或毛利被成本吞噬，EPS 现金流链应被拒绝。</p></details>
        </div>

        <div className="glossary-grid" aria-label="十八个通胀核心术语">
          <article><b>Price relative</b><p>同一可比项目两期价格之比；规格、门店、交易条件和单位必须一致。</p></article>
          <article><b>Price level</b><p>许多价格按既定人口、范围、权重和公式聚合后的指数水平。</p></article>
          <article><b>Inflation</b><p>给定期间内价格水平的增长率；必须附指数对象、窗口和 SA/NSA。</p></article>
          <article><b>Disinflation / Deflation</b><p>前者是正通胀变慢，后者是价格水平下降；都不同于某个相对价下跌。</p></article>
          <article><b>COLI</b><p>给定偏好与效用目标下维持同一效用所需最小支出变化；不是完整福利。</p></article>
          <article><b>Weight reference</b><p>支出或数量权重代表的时期；不同于 price reference 与 index reference。</p></article>
          <article><b>Chain-linking</b><p>把相邻期指数 relatives 连乘成长序列，以更新篮子和权重。</p></article>
          <article><b>Core inflation</b><p>通过预先剔除指定项目提取较持续信号的指标；不是无条件真值。</p></article>
          <article><b>Underlying inflation</b><p>用截尾、中位数或模型估计的较持久/共同成分；不可直接观察且可修订。</p></article>
          <article><b>OER</b><p>自住房提供的租赁等价服务价格；不是房价、按揭或业主现金支付。</p></article>
          <article><b>ULC</b><p>小时报酬除实际产出/小时；是货币/实际产出单位，不等于工资或 CPI。</p></article>
          <article><b>Markup</b><p>价格相对经济边际成本的因子；测量依生产与需求假设。</p></article>
          <article><b>Gross margin</b><p>收入减会计销售成本后占收入的比例；不同于 markup 与净利润率。</p></article>
          <article><b>Pass-through</b><p>某成本、汇率或税变化在指定产品、期限和状态下进入下游价格的条件响应。</p></article>
          <article><b>Phillips curve</b><p>工资/价格通胀与 slack 的一族描述或结构关系；对象、预期和制度必须标明。</p></article>
          <article><b>NKPC</b><p>特定黏价与预期假设下，当前通胀连接未来预期和实际边际成本的结构式。</p></article>
          <article><b>Persistence</b><p>通胀对过去状态依赖的统计或结构性质；必须与 shock persistence 分开。</p></article>
          <article><b>Breakeven inflation</b><p>匹配期限的名义与实际收益率差，包含预期、风险与市场楔子。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="通胀机制主张 Evidence Passport，可横向滚动">
          <table className="concept-table">
            <caption>每条 inflation claim 必须保存的最小字段</caption>
            <tbody>
              <tr><th scope="row">Claim / estimand</th><td>方向明确的局部句；population、unit、treatment、outcome、horizon 与 counterfactual</td></tr>
              <tr><th scope="row">Index object</th><td>CPI/PCE/PPI/GDP prices；scope、coverage、formula、weights、quality、SA/NSA</td></tr>
              <tr><th scope="row">Clocks / vintage</th><td>price reference、weight reference、observation、release/public、forecast origin、vintage</td></tr>
              <tr><th scope="row">Shock identity</th><td>demand/supply/commodity/FX/fiscal/expectations；外生来源与同时性处理</td></tr>
              <tr><th scope="row">Transmission</th><td>input share、inventory、contract、currency、ULC、markup、quantity、network 与 lag</td></tr>
              <tr><th scope="row">Feedback / break</th><td>wage、indexation、expectation、policy、financing；增益、时滞和可观测断点</td></tr>
              <tr><th scope="row">Company / asset bridge</th><td>realized price、volume、COGS、margin、profit、shares、real rate、risk premium 与 valuation</td></tr>
              <tr><th scope="row">Evidence status</th><td>identity / official measure / descriptive lead / model estimate / causal estimate / structural counterfactual</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces、Evidence Map 与 20 组阅读</p>
        <h2>3.02 输出一只可审计的价格指标、一张企业调价—传播图和一套可证伪的公司/资产接口。</h2>
        <div className="interface-grid">
          <article><span>回到 3.01</span><h3>Real Growth</h3><p>本节给价格指数；3.01 给匹配实际量。名义值只能在边界相容时拆成价格与数量。</p></article>
          <article><span>连接 3.03</span><h3>Labor / Wage</h3><p>本节只给 ULC 与反馈条件；就业匹配、参与、议价与工资分布由 3.03 展开。</p></article>
          <article><span>连接 3.04</span><h3>Expectations</h3><p>本节把预期作为状态变量；主体怎样学习、分歧以及调查/市场怎样量测留给 3.04。</p></article>
          <article><span>连接 3.05</span><h3>Central Bank</h3><p>本节给 nominal anchor 与 accommodation 的最小桥；目标、反应函数、工具与可信度由 3.05 完成。</p></article>
          <article><span>连接 3.07–3.08</span><h3>Real Rate / Yield Curve</h3><p>Breakeven 先拆预期与风险楔子；真实期限结构与收益率曲线定价在后续单元展开。</p></article>
          <article><span>连接 4.14</span><h3>Commodity Chain</h3><p>本节划分一至三轮商品传导；具体商品供需、库存和跨市场网络由 4.14 深化。</p></article>
          <article><span>连接 4.17</span><h3>Stock–Bond Correlation</h3><p>本节给 inflation–output shock identity；股债相关性怎样随 regime 切换留给 4.17。</p></article>
          <article><span>连接 Chapter 7</span><h3>Research Design</h3><p>Evidence Passport 把复杂叙事压缩为局部 estimand、实时资料、中间变量与 chain-break test。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="通胀四层二十组阅读路径，可横向滚动">
          <table className="concept-table">
            <caption>页面下方列出 Core、Models、Evidence、Systems 各五组阅读单元</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">五个主题</th><th scope="col">完成标准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Core</th><td>COLI→CPI；CPI/PCE；HICP/中国；住房目标；underlying</td><td>能冻结人口、范围、权重、公式、时钟与住房/医疗边界</td></tr>
              <tr><th scope="row">Models</th><td>指数理论；Phillips；错开定价；NKPC；货币—财政 regime</td><td>能区分恒等、行为方程、参数、识别与制度条件</td></tr>
              <tr><th scope="row">Evidence</th><td>微观价格；Phillips slope；FX；利润；家庭异质性</td><td>能报告样本、代理、估计量、外推边界与反例</td></tr>
              <tr><th scope="row">Systems</th><td>供需识别；疫情；持久性；实时 vintage；政策与资产</td><td>能重建 shock→pricing→propagation→measurement→feedback</td></tr>
            </tbody>
          </table>
        </div>

        <div className="evidence-map" aria-label="3.02 逐项证据地图">
          <h3>层一｜指数对象、工程与家庭边界</h3>
          <p>国际 CPI 手册与统计决议定义目标、范围和编制原则，PPI 手册与 2025 SNA 分开生产者价格和国民账户价格；Diewert 与 Konüs分别给 superlative index 与条件生活成本的理论边界。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={6} /></p>
          <p>Boskin 报告记录替代、新品、门店与质量偏误的历史争论，Triplett 系统说明 hedonic 设计；两者都不能把旧美国估计或信息技术经验外推为当前全部 CPI bias。<Cite n={7} /><Cite n={8} /></p>
          <p>BLS Concepts、Methods、FAQ、relative importance 与 quality portal 共同说明 CPI 对象、低层公式、权重漂移和 replacement；概览与 FAQ 不能替代具体 series 的 metadata。<Cite n={9} /><Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={13} /></p>
          <p>BLS rent/OER 与 new-tenant series 区分住房服务存量和边际租约，季调说明历史 SA 可重估，C-CPI FAQ 说明 initial/interim/final；四种时钟不能拼成单一“住房滞后”。<Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} /></p>
          <p>BEA 的 CPI–PCE reconciliation、PCE deflation、relative importance、market-based PCE 与 source adjustment 共同建立 formula/weight/scope/other 四差异；“更广”不等于所有用途更优。<Cite n={18} /><Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={22} /></p>
          <p>BEA 分开 PCE、gross domestic purchases 与 GDP prices，解释 implicit deflator 和 NIPA 方法；历史 reconciliation 论文可量化特定样本，却不提供永久 CPI–PCE gap。<Cite n={23} /><Cite n={24} /><Cite n={25} /><Cite n={26} /></p>
          <p>HICP 手册与法规固定欧盟货币消费边界，ONS 当前权重和高层聚合说明英国实现；同名 consumer index 仍须逐国核对 scope、OOH 和 reference year。<Cite n={27} /><Cite n={28} /><Cite n={29} /><Cite n={30} /></p>
          <p>ONS HCI 与 OOH 方法分开 democratic/payments 和 rental-equivalence，中国当前资料固定 2026 起 2025 基期及一般链式 Laspeyres 说明；不能把不同住房目标或旧基期拼接。<Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /></p>
          <p>Dallas trimmed PCE、Cleveland median CPI、core review、MCT 理论与模型页以及 ECB PCCI 展示固定剔除、截尾与 latent common component；trim 比例、插值和模型历史都必须随 vintage 保存。<Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} /><Cite n={40} /></p>
          <p>ECB analytical guide、Lane 更新与 Atlanta dashboard 支持多指标交叉而非永久冠军；家庭与 group PCE 研究则证明总指数、群组均值和个人经历可以系统分离。<Cite n={41} /><Cite n={42} /><Cite n={43} /><Cite n={44} /><Cite n={45} /></p>

          <h3>层二｜定价模型、持久性与微观事实</h3>
          <p>Phillips、Phelps、Friedman 分别从历史工资关系走向预期修正与长期边界；Lucas 与 Taylor 又引入信息和错开合同，五者不是一个可跨制度搬运的固定曲线。<Cite n={46} /><Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} /></p>
          <p>Calvo hazard、Rotemberg 调整成本、relative-price supply shocks、Galí–Gertler NKPC 与 Sbordone ULC 检验给出不同结构接口；实际边际成本和统计 proxy 不可互换。<Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={54} /><Cite n={55} /></p>
          <p>Sticky information、NKPC 识别综述、州际 Phillips slope、周期敏感分项与趋势通胀模型共同说明预期、slack、κ 和 trend 都有测量/制度边界。<Cite n={56} /><Cite n={57} /><Cite n={58} /><Cite n={59} /><Cite n={60} /></p>
          <p>跨货币制度、美国 persistence 反证、trend-relative gap、trend-inflation 综述、relative-wage contract 与 forecast instability 形成相互制约的证据；没有一篇可把 persistence 固定成常数。<Cite n={61} /><Cite n={62} /><Cite n={63} /><Cite n={64} /><Cite n={65} /><Cite n={66} /></p>
          <p>Bils–Klenow、Nakamura–Steinsson 与微观综述展示调价频率、促销和产品更替的定义敏感性；sufficient-statistic 研究与 common/relative factor 分解各自依赖模型类。<Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} /><Cite n={71} /></p>
          <p>工资—价格理论、IMF 历史 episode 与 BLS ULC 方法共同支持“反馈有条件、工资减生产率才接近单位劳动成本”；同时上涨不能自动命名为 spiral。<Cite n={72} /><Cite n={73} /><Cite n={74} /></p>
          <p>长期 market-power 测量、疫情利润会计分解、欧元区 unit profits 与 Conlon 的识别反论证共同要求分开 markup、margin、unit profit 与 causal conduct。<Cite n={75} /><Cite n={76} /><Cite n={77} /><Cite n={78} /></p>

          <h3>层三｜跨境、商品、供应链与疫情识别</h3>
          <p>进口价 pass-through、计价货币、企业进出口网络与国际价格综述共同建立汇率的边境和零售两道闸门；国家、行业、货币和期限决定参数。<Cite n={79} /><Cite n={80} /><Cite n={81} /><Cite n={82} /></p>
          <p>油价 shock identity、incomplete-identification 争论与 1970s/2000s 比较说明同样油价上涨可来自不同冲击，并在油占比、工资与政策制度下产生不同传播。<Cite n={83} /><Cite n={84} /><Cite n={85} /></p>
          <p>GSCPI、瓶颈案例与 price–quantity 分类分别是共同压力指标、行业描述和供需代理；都不能单独变成 CPI 结构贡献份额。<Cite n={86} /><Cite n={87} /><Cite n={88} /></p>
          <p>制造业供需、跨国财政、疫情动态模型、BPEA 分解与 2025 Fed 复盘支持 multi-mechanism episode；变量选择、内生政策和 rare-event 外推仍限制精确配额。<Cite n={89} /><Cite n={90} /><Cite n={91} /><Cite n={92} /><Cite n={93} /></p>
          <p>Fed staff forecast retrospective 把错误分成当时信息与模型问题；Sargent–Wallace、Leeper 与 fiscal-theory 模型则说明货币—财政 regime 的条件路径，不支持“任意赤字机械短期通胀”。<Cite n={94} /><Cite n={95} /><Cite n={96} /><Cite n={97} /></p>
          <p>Fed 2025、ECB 2025 与加拿大当前目标文件记录各自现行框架：目标指数、期限和法律有效期不同，制度承诺也不等于实际预期完全锚定。<Cite n={98} /><Cite n={99} /><Cite n={100} /></p>
          <p>家庭与专业调查、information rigidity、lifetime experience 和 disagreement 研究分别观察不同主体与统计矩；调查均值、分布、修订和市场 compensation 不能互换。<Cite n={101} /><Cite n={102} /><Cite n={103} /><Cite n={104} /><Cite n={105} /></p>

          <h3>层四｜实时数据、资产与公司账本</h3>
          <p>Fed TIPS model、D’Amico 分解、survey forecast 比较、Philadelphia real-time archive、Croushore–Stark 与 ALFRED 共同支持 compensation decomposition 和 vintage discipline；模型 series 与档案覆盖均须读 notes。<Cite n={106} /><Cite n={107} /><Cite n={108} /><Cite n={109} /><Cite n={110} /><Cite n={111} /></p>
          <p>资产—通胀旧样本、股债 news decomposition、macro risk regime 与油价—股票 shock-source 证据说明现金流、实际利率与风险溢价共同定价；没有跨状态永久 hedge 口诀。<Cite n={112} /><Cite n={113} /><Cite n={114} /><Cite n={115} /></p>
          <p>BEA corporate profits、IAS 1、IAS 2 与 IFRS 15 分别固定宏观当前生产利润、费用功能列示、存货销售成本和交易价格；它们共同证明 NIPA profit、gross margin、economic markup 与 EPS 不能互换。<Cite n={116} /><Cite n={117} /><Cite n={118} /><Cite n={119} /></p>
        </div>
        <p>
          本节的最小复述是：<b>通胀先是给定人口、范围、权重、质量、公式、时钟与 vintage 后的价格总量变化；需求、供给、工资、商品、汇率和预期只有经过异质企业的边际成本、加成、合同、库存与调价选择，才形成分项价格。通胀可以因外生冲击持续而持续，也可以在工资、指数化、融资和政策反馈闭合后由内部传播延续。分项贡献、领先指标、条件相关和结构因果属于不同证据等级。价格变化进入公司后仍要穿过销量、会计成本、费用、债税与股本，进入资产后又与实际利率和风险溢价共同重估。因此任何通胀主张都必须同时保存指数对象、冲击身份、传播时钟、可观测中间变量、断链条件和实时信息集。</b>
        </p>
      </section>
    </>
  );
}

export const lesson302: LessonRecord = {
  slug: '3-02',
  id: '3.02',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Inflation：从价格指数、企业定价到反馈、利润与资产重估',
  subtitle: '先把人口、范围、权重、质量和时钟量对，再沿需求、供给、成本、加成、工资、合同与预期解释一次价格冲击何时停止、何时传播，以及怎样进入公司与资产',
  readingTime: '核心首读约 90–95 分钟；完整正文含逐式复算约 190–235 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习 25–35，理解检查与术语 25–35，建议分三至四次完成；参考文献与延伸阅读不计',
  prerequisite: '3.01 Real Growth；建议按需调用 T01–T06，尤其是增长率、复利、权重、期望与资产负债表；与 3.03–3.08、4.14、4.17 只建立接口',
  updatedAt: '2026-09-01',
  revision: '3.02-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.02-r2',
      summary:
        '独立复核 64 个机制单元、119 条来源、27 个 Evidence Map 证据簇、20 组阅读及 10 道互动与 10 道静态孪生，复算正文和练习中的 48 项数字，并重点核验 CPI／PCE／GDP／PPI、OER／OOH、NKPC、工资—价格反馈、利润与 markup、汇率商品传导、财政—货币制度和 TIPS 资产接口；恒等、代理、相关、识别与结构反事实边界清楚，冻结哈希、类型、规范、生产构建、HTTP 与全部锚点不变量一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.02-r2',
      summary:
        '独立复核零背景入口、六层路线、19 个公式卡的单位与白话解释、64 节认知递进、10 道互动、10 道静态孪生、14 道检查、18 个术语、8 个接口及四层各五组阅读；真实浏览器完成全题判分、纠错、置信度、模式切换、刷新与损坏记录恢复、重置、焦点、ARIA、移动、打印、原生课程导航和早中晚目录及引用深链测试，冻结哈希与运行检查一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '3-01', label: '3.01 Real Growth' },
  next: { slug: '3-03', label: '3.03 Labor Market 与 Wage Dynamics' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、先修与路线' },
    { id: 'level-rate-relative', label: 'Level / Rate / Relative Price' },
    { id: 'index-anatomy', label: 'Quote → Aggregate' },
    { id: 'population-scope', label: 'Population / Scope' },
    { id: 'index-formulas', label: 'Laspeyres / Paasche / Fisher' },
    { id: 'cpi', label: 'CPI' },
    { id: 'pce', label: 'PCE' },
    { id: 'gdp-price-purchases', label: 'GDP Prices / Purchases' },
    { id: 'cpi-pce-gdp-bridge', label: 'CPI–PCE–GDP Bridge' },
    { id: 'weighting-households', label: 'Plutocratic / Democratic' },
    { id: 'headline-core', label: 'Headline / Core' },
    { id: 'underlying-measures', label: 'Underlying Measures' },
    { id: 'reference-chain-contribution', label: 'Reference / Chain / Contribution' },
    { id: 'quality-shrinkflation', label: 'Quality / Shrinkflation' },
    { id: 'new-goods-sample', label: 'New Goods / Sample' },
    { id: 'rent-oer', label: 'Rent / OER' },
    { id: 'ooh-approaches', label: 'OOH Approaches' },
    { id: 'medical-insurance', label: 'Medical / Insurance' },
    { id: 'seasonal-adjustment', label: 'Seasonal Adjustment' },
    { id: 'inflation-clocks', label: 'Inflation Clocks' },
    { id: 'revision-vintage', label: 'Revision / Vintage' },
    { id: 'distribution-diffusion', label: 'Contribution / Diffusion' },
    { id: 'household-coli-welfare', label: 'Household / COLI / Welfare' },
    { id: 'price-pipeline', label: 'Import / PPI / CPI Pipeline' },
    { id: 'price-cost-markup', label: 'P = μ × MC' },
    { id: 'demand-pressure', label: 'Demand / Capacity' },
    { id: 'supply-constraint', label: 'Supply / Bottleneck' },
    { id: 'relative-price-aggregate', label: 'Relative Price → Aggregate' },
    { id: 'wages-productivity-ulc', label: 'Wage / Productivity / ULC' },
    { id: 'markup-margin-profit', label: 'Markup / Margin / Profit' },
    { id: 'commodity-pass-through', label: 'Commodity Pass-through' },
    { id: 'fx-pass-through', label: 'FX Pass-through' },
    { id: 'supply-chain-inventory', label: 'Supply Chain / Inventory' },
    { id: 'rent-lag', label: 'Rent Lag' },
    { id: 'fiscal-demand', label: 'Fiscal Demand' },
    { id: 'nominal-anchor-regime', label: 'Nominal Anchor / Regime' },
    { id: 'expectations-pricing', label: 'Expectations / Pricing' },
    { id: 'contracts-indexation', label: 'Contracts / Indexation' },
    { id: 'feedback-break-map', label: 'Feedback / Break Map' },
    { id: 'micro-price-evidence', label: 'Micro Price Evidence' },
    { id: 'quantity-identity', label: 'Quantity Identity' },
    { id: 'ad-as', label: 'AD–AS' },
    { id: 'phillips-family', label: 'Phillips Family' },
    { id: 'nkpc', label: 'NKPC' },
    { id: 'pricing-rules', label: 'Pricing Rules' },
    { id: 'slope-regime', label: 'Slope / Trend / Regime' },
    { id: 'persistence-propagation', label: 'Persistence / Propagation' },
    { id: 'common-sector', label: 'Common / Sector-specific' },
    { id: 'identification-ladder', label: 'Identification Ladder' },
    { id: 'shock-decomposition', label: 'Shock Decomposition' },
    { id: 'great-inflation', label: 'Great Inflation' },
    { id: 'pandemic-inflation', label: 'Pandemic Inflation' },
    { id: 'realtime-forecast', label: 'Real-time Forecast' },
    { id: 'inflation-revenue', label: 'Inflation / Revenue' },
    { id: 'input-cost-pass-through', label: 'Input Cost / Pass-through' },
    { id: 'margin-profit-eps', label: 'Margin / Profit / EPS' },
    { id: 'balance-sheet-redistribution', label: 'Balance-sheet Redistribution' },
    { id: 'bonds-breakeven', label: 'Bonds / Breakeven' },
    { id: 'asset-interface', label: 'Asset-pricing Interface' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson302Content,
  references: lesson302References,
  readingList: lesson302ReadingList,
};
