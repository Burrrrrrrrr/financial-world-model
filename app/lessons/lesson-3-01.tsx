import GrowthTransmissionChart from '../components/GrowthTransmissionChart';
import RealGrowthLab from '../components/RealGrowthLab';
import { realGrowthScenarios } from '../components/realGrowthScenarios';
import { lesson301ReadingList, lesson301References } from './lesson-3-01-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson301Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>实际增长是境内新增价值之“数量”的变化；它只有穿过产业、公司、分配、每股与估值边界，才可能成为股东回报。</h2>
        <p>
          “经济增长”经常被缩写成一个 GDP 增速，但这个数字首先是一项统计测量：在给定生产边界、经济领土和期间后，把居民生产单位创造的增加值或最终产品按可比价格聚合，观察其 volume 怎样变化。它不是全国销售额的增长，不是物价上涨，不是财富存量增加，也不是居民福利、公司利润或股票回报的另一个名字。2025 SNA 更新了数字化、全球化、净产出与福祉展示，却保留了这一国民账户主干；各国是否、何时切换仍是另一问题。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <div className="causal-chain" aria-label="实际增长进入股票回报的完整链条" role="list">
          <div role="listitem"><span>01</span><b>Boundary</b><p>何地、何期、何种生产。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Real output</b><p>价格剥离后的增加值。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Sources</b><p>劳动、资本、效率与重配。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Industry</b><p>需求、进口与供应链。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Company</b><p>收入、成本、利润与股本。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Market</b><p>预期、折现与价格。</p></div>
        </div>
        <p>
          两个反例先封住最常见的捷径。一个经济体可以因新企业、更多劳动或新资本而高速增长，但既有上市公司的每股现金流没有同步增加；本国 GDP 也可以收缩，而以海外收入为主、具有定价权的出口龙头利润上升。跨国历史中 GDP 增长与股票回报甚至曾呈负相关，但这只是特定样本的相关事实，不是“增长必然伤害股票”的结构定律。<Cite n={105} /><Cite n={106} /><Cite n={126} /><Cite n={127} />
        </p>
        <GrowthTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、先修与六阶段路线</p>
        <h2>本节先把增长“量对”，再解释它怎样产生、怎样进入企业，以及为什么常在股票这一端断开。</h2>
        <div className="learning-objectives">
          <span>六阶段路线 · 从 national accounts 到 shareholder return</span>
          <ol>
            <li><b>对象与恒等式（00–11）：</b>固定 flow、production boundary、final/intermediate、value added、三种 GDP 路径、gross/net 与 domestic/national。</li>
            <li><b>实际量测量（12–19）：</b>拆开现价与物量，理解 double deflation、Fisher chain、频率、人均、可比窗口、库存和福利边界。</li>
            <li><b>增长来源（20–36）：</b>沿劳动、资本、生产率、利用率、创新、扩散、重配、进入退出和收敛解释产出变化。</li>
            <li><b>行业与公司桥（37–49）：</b>把最终需求经过供应链、进口和公司边界，转换为收入、增加值、成本和利润。</li>
            <li><b>股东与证据边界（50–59）：</b>加入上市覆盖、全球收入、股本、租金、估值、信息时钟、vintage 与识别阶梯。</li>
            <li><b>主动迁移（60–63）：</b>完成 10 道互动、10 道静态孪生、14 道检查、18 个术语、Evidence Passport 与 20 组阅读。</li>
          </ol>
        </div>
        <p>
          硬先修为“无”；建议按需调用 T01–T06，尤其是 return、复利、比率、回归与资产负债表。85–90 分钟核心首读走 00–09 → 11–18 → 20、23–30 → 32、34–39 → 44–59 → 60 仅读说明 → 62–63；完整正文与逐式复算约 180–225 分钟。3.02 解释通胀形成，3.03 解释劳动力市场，3.05 解释央行反应，3.23 解释 macro surprise；本节只提供它们需要的 measurement 与 transmission 接口。<Cite n={1} /><Cite n={6} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="flow-level-growth">
        <p className="section-kicker">02 · Level、Flow 与 Growth Rate</p>
        <h2>GDP 是一段期间内的生产流量；GDP level、增长额与增长率回答三个不同问题。</h2>
        <div className="equation-card">
          <span>离散增长率与 log change</span>
          <div>g<sub>t</sub> = Y<sub>t</sub>/Y<sub>t−1</sub> − 1；　ΔlnY<sub>t</sub> = lnY<sub>t</sub> − lnY<sub>t−1</sub></div>
          <p>Y 必须是同一地理、边界、价格口径、季节调整和频率下的期间流量或量指数，且两期都严格为正。百分比增长精确用第一式；log change 可跨期相加，并在小变化时近似百分比。</p>
        </div>
        <p>
          规模从 2,000 到 2,040 的经济体新增 40、增长 2%；规模从 400 到 420 的经济体只新增 20，却增长 5%。所以“谁更大”“谁贡献了更多新增量”“谁增长更快”不能用一个排行代替。GDP 也不是国家资产负债表：工厂、市值、住宅和土地是存量，GDP 是这些资源在期间内共同生成的生产流。财富可以因资产价格上涨而大增而当期 GDP 几乎不变，GDP 也可因高生产同时伴随资本耗损而增长而净财富改善有限。<Cite n={1} /><Cite n={7} /><Cite n={113} />
        </p>
      </section>

      <section className="lesson-section" id="production-boundary">
        <p className="section-kicker">03 · Production Boundary</p>
        <h2>“发生了付款”不等于“发生了当期生产”；GDP 先问交易是否穿过生产边界。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="生产边界的典型纳入与排除，可横向滚动">
          <table className="concept-table">
            <caption>边界判断针对当期新增生产，不是判断活动是否重要</caption>
            <thead><tr><th scope="col">事件</th><th scope="col">GDP 处理</th><th scope="col">为什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">新建住宅</th><td>计入当期投资</td><td>当期生产了新的固定资产</td></tr>
              <tr><th scope="row">二手住宅换手</th><td>房屋本体不再计入；经纪等当期服务计入</td><td>既有资产转移不创造同额新产出</td></tr>
              <tr><th scope="row">股票买卖</th><td>证券本金换手不计；经纪、交易与托管服务计入</td><td>金融索取权转移不同于新生产</td></tr>
              <tr><th scope="row">养老金或现金补贴</th><td>转移本身不计 G；由其支持的后续消费另按实际购买计</td><td>单向再分配没有对应当期产品</td></tr>
              <tr><th scope="row">企业自制软件/R&amp;D</th><td>符合资产边界时计入产出与投资</td><td>国民账户将可识别的知识产品资本化</td></tr>
              <tr><th scope="row">家庭无偿照护</th><td>核心 GDP 通常排除</td><td>边界与可测性选择，不表示其没有社会价值</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          生产边界是可比核算所需的制度选择，不是自然界给出的真理。把无偿照护外包给付费机构会抬高 GDP，即使照护小时不变；灾后修复会增加测得产出，却先有财富损失。2025 SNA 对数据资产等新对象扩展了边界，但“标准采纳”仍不等于所有国家已经把同一对象纳入当前发布值。<Cite n={1} /><Cite n={2} /><Cite n={13} /><Cite n={114} />
        </p>
      </section>

      <section className="lesson-section" id="final-intermediate">
        <p className="section-kicker">04 · Final 与 Intermediate</p>
        <h2>同一商品是最终品还是中间品取决于用途；把供应链所有销售额相加会重复计算。</h2>
        <p>
          小麦 60 卖给面粉厂，面粉 100 卖给面包店，面包 160 卖给家庭。总销售额 320 中，小麦的价值同时嵌在面粉和面包里，面粉又嵌在面包里；GDP 只能记最终面包 160，或加总三环节增加值 60、40、60。若家庭买面粉自己烘焙，面粉对国民账户可能成为最终消费；若面包店买同一袋面粉，它就是中间投入。<Cite n={1} /><Cite n={6} /><Cite n={121} />
        </p>
        <div className="precision-note"><span>不可把 final 理解成“成品外观”</span><p>机器卖给工厂是固定资本形成而非本期被耗尽的中间品；本期生产但尚未售出的产品进入存货投资。分类读的是经济用途、所有权与期间，而不是商品名称。</p></div>
      </section>

      <section className="lesson-section" id="value-added">
        <p className="section-kicker">05 · Value Added</p>
        <h2>增加值是 gross output 扣除生产中被耗用的中间投入；它把毛销售额转换为本环节新增价值。</h2>
        <div className="equation-card">
          <span>行业生产账户</span>
          <div>VA<sub>j</sub> = GO<sub>j</sub> − II<sub>j</sub>；　GDP<sub>market</sub> = Σ<sub>j</sub>VA<sub>j,basic</sub> + taxes<sub>products</sub> − subsidies<sub>products</sub></div>
          <p>GO 与 II 都是货币/期间；必须使用相容的 valuation 与边界。企业会计 revenue 不自动等于 national-account gross output，COGS 也不自动等于 intermediate inputs。</p>
        </div>
        <p>
          增加值随后由劳动报酬、生产税减补贴和 gross operating surplus/mixed income 等收入构成承接。它不是利润：工资很高的咨询公司可有高增加值而资本利润有限；高周转零售商可有巨大收入却因商品购入占比高而增加值率较低。正因如此，行业销售增长不能直接当作 GDP 贡献，公司收入也不能直接当作宏观增加值。<Cite n={1} /><Cite n={15} /><Cite n={120} /><Cite n={121} />
        </p>
      </section>

      <section className="lesson-section" id="expenditure-identity">
        <p className="section-kicker">06 · Expenditure Identity</p>
        <h2>C + I + G + X − M 是从最终用途核对境内产出的恒等式，不是五个互不相干的结构原因。</h2>
        <div className="equation-card">
          <span>支出法的压缩写法</span>
          <div>Y = C + I + G + X − M</div>
          <p>C 是居民及相关最终消费的教学压缩，I 含固定资本形成与存货变化，G 指政府消费与投资而非全部财政支出，X/M 是货物与服务出口/进口；精确类别依对应账户体系。</p>
        </div>
        <p>
          进口被减去，不是因为它“抵消了需求”，而是因为进口品可能已被记在 C、I、G 或出口生产的投入中，必须把外国生产从 domestic product 剔除。出口则虽由外国购买，却在本国经济领土内生产，所以加入 GDP。恒等式只说明事后账户怎样闭合；若要问消费刺激、关税或汇率变化造成多少产出，必须建模供应反应、进口替代、价格、库存与政策反馈，而不能把式中符号当作因果系数。<Cite n={1} /><Cite n={6} /><Cite n={15} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="production-approach">
        <p className="section-kicker">07 · Production Approach</p>
        <h2>生产法沿行业汇总增加值，因此最适合回答“增长发生在哪里”，但行业 contribution 仍不是公司收益。</h2>
        <p>
          统计机构先估各行业 gross output 与 intermediate inputs，再得到行业增加值，最后处理产品税补贴与平衡项。季度资料不完整时，会使用调查、行政记录、价格指数与相关物量指标外推；年度和经济普查资料到来后再校准。于是“制造业实际增加值增长 5%”说的是该行业价格剥离后的新增价值量，而不是工厂销售额、工业生产指数或上市制造公司收入都增长 5%。<Cite n={1} /><Cite n={6} /><Cite n={120} />
        </p>
        <p>
          中国季度 GDP 以生产核算为主要发布结果；截至 2026 年二季度的说明仍以《中国国民经济核算体系（2016）》及 2008 SNA 基本原则为口径，并从 2026–2030 年使用 2025 固定基期核算不变价量。这个固定基期制度与美国 Fisher 链式量不同，因此不能把两国“real level”分项当作同一可加对象，比较时应优先使用定义一致的增速、贡献率与元数据。<Cite n={28} /><Cite n={29} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="income-approach">
        <p className="section-kicker">08 · Income Approach</p>
        <h2>生产创造的增加值同时形成收入，但“资本所得”仍不能直接等同上市公司利润。</h2>
        <div className="equation-card">
          <span>收入侧的压缩桥</span>
          <div>GDI = compensation + taxes on production/imports − subsidies + gross operating surplus + mixed income</div>
          <p>不同体系展示可把 consumption of fixed capital、net operating surplus 与 mixed income 分拆；具体表必须按同一 gross/net 和 valuation 口径读取。</p>
        </div>
        <p>
          自雇业主的收入同时补偿劳动与资本，若全部塞进资本项会扭曲劳动份额；住房服务、政府生产和非公司企业也进入宏观收入，却未必进入股票指数。收入法的价值在于揭示新增价值怎样在工资、税与经营盈余之间分配，而不是把某一 residual 自动命名为“股东拿走的利润”。<Cite n={1} /><Cite n={6} /><Cite n={87} /><Cite n={88} /><Cite n={89} /><Cite n={90} />
        </p>
      </section>

      <section className="lesson-section" id="gdp-gdi">
        <p className="section-kicker">09 · GDP、GDI 与 Statistical Discrepancy</p>
        <h2>支出侧与收入侧概念上相等；公布值不同，说明统计系统在用两组不完美资料观察同一潜在活动。</h2>
        <div className="equation-card">
          <span>概念恒等与经验差异</span>
          <div>GDP ≡ GDI；　statistical discrepancy = measured GDP − measured GDI</div>
          <p>第一项是完整账户中的概念恒等，第二项是实际估计差。差异可来自抽样、覆盖、时点、季调、插值与缺失资料，不能直接归因某类主体“少报”。</p>
        </div>
        <p>
          美国 BEA 以较及时和广泛的支出资料把 GDP 作为 featured measure，同时发布 GDI 及两者平均；研究也曾发现收入侧在某些周期样本中含额外信号。但“某段历史 GDI 更好”不能变成永恒排序，简单平均也不是真值保证。正确做法是保留两者、统计差异、发布日期和 vintage，并检查结论对替代组合是否稳健。<Cite n={9} /><Cite n={37} /><Cite n={46} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="gross-net">
        <p className="section-kicker">10 · Gross 与 Net</p>
        <h2>GDP 中的“Gross”表示尚未扣除资本耗损；高 gross growth 不必等于生产能力或可支配收入同幅净增。</h2>
        <div className="equation-card">
          <span>从总量到净量</span>
          <div>NDP<sub>2025 SNA</sub> = GDP − depreciation − depletion</div>
          <p>三项都是货币/期间。depreciation 表示固定资产在生产中的经济价值损失，depletion 表示自然资源存量的耗减；若讨论 volume growth，三者还需一致的价格—数量方法。</p>
        </div>
        <p>
          一场投资潮可同时提高当期 GDP 与未来资本服务，但若既有设备快速老化、自然资源耗减或重建只是替换损毁资本，净新增能力可能远小于 gross 数字。2008 SNA 及许多旧数据中的 NDP 通常只扣 consumption of fixed capital；2025 SNA 把 depletion 也纳入从 gross 到 net 的扣减，因此跨标准比较必须记录所用版本。2025 SNA 同时提高净量可见度，并把 NDP volume change 列为概念上更适宜、应与 GDP 并列的增长指标，而不是取消 GDP。<Cite n={1} /><Cite n={2} /><Cite n={66} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="domestic-national">
        <p className="section-kicker">11 · Domestic 与 National</p>
        <h2>GDP 按经济领土内生产组织，GNI 按居民单位获得的初次收入组织；跨国企业会把两条边界拉开。</h2>
        <div className="equation-card">
          <span>从 domestic product 到 national income</span>
          <div>GNI = GDP + primary income receivable from rest of world − primary income payable to rest of world</div>
          <p>“居民”是经济利益中心概念，不等于国籍；境外子公司生产通常进入东道国 GDP，而相应跨境利润进入两国国际账户与 national income 调整。</p>
        </div>
        <p>
          本国上市公司的全球收入按公司合并边界呈现，国内 GDP 按生产地点呈现；两者从定义上就不可能自动相等。出口是本国生产交付海外，进入本国 GDP；本国集团海外子公司在海外生产并当地销售，主要进入东道国 GDP；利润汇回如何影响本国居民收入又是第三条路径。忽略这些边界，会把“本国经济”与“本国交易所公司”误当同一资产。<Cite n={1} /><Cite n={13} /><Cite n={97} /><Cite n={98} /><Cite n={99} />
        </p>
      </section>

      <section className="lesson-section" id="current-volume">
        <p className="section-kicker">12 · Current Price 与 Volume</p>
        <h2>名义 GDP 同时含价格与数量；实际增长要回答“价格结构可比时，产出量怎样变化”。</h2>
        <div className="equation-card">
          <span>单产品直觉与多产品边界</span>
          <div>V<sub>t</sub> = p<sub>t</sub>q<sub>t</sub>；　V<sub>t</sub>/V<sub>t−1</sub> = P<sub>t/t−1</sub> × Q<sub>t/t−1</sub></div>
          <p>单产品的 p、q 直观清楚；多产品经济必须用价格与数量指数聚合。只有在匹配的 index-number system 中，价值比才按相应价格比与数量比精确闭合。</p>
        </div>
        <p>
          若名义价值升 6%、匹配的 GDP 价格指数升 2%，精确实际量增长是 1.06/1.02−1≈3.92%，而“6−2=4%”只是一阶近似。这里不能随手用 CPI：GDP deflator 覆盖境内最终生产，权重会随构成变化；CPI 追踪居民购买篮子，含进口消费而不含许多投资和出口。通胀怎样形成留给 3.02，本节只说明为什么 price measure 必须与产出边界相配。<Cite n={1} /><Cite n={6} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="double-deflation">
        <p className="section-kicker">13 · Double Deflation</p>
        <h2>行业实际增加值不是“名义销售除一个价格指数”；产出与中间投入必须分别量化。</h2>
        <p>
          行业名义增加值为 GO−II。若产出价格涨 2%、原料价格涨 20%，用产出价格同时平减两边会把投入价格冲击伪装成数量变化；double deflation 分别建立 gross output 与 intermediate input 的量指数，再在相容的上一年价格或指数框架下求实际增加值。行业真实产量上升而原料实际耗用增长更快时，real value added 甚至可以下降。<Cite n={1} /><Cite n={8} /><Cite n={15} /><Cite n={120} />
        </p>
        <div className="precision-note"><span>“Real”不是对所有分项除同一个 CPI</span><p>服务质量、金融中介、政府非市场产出和新产品尤其难分价格与数量。平减方法的选择会进入 measured growth，因此应保存 source price index、quality adjustment、reference year 与 revision vintage。</p></div>
      </section>

      <section className="lesson-section" id="fisher-chain">
        <p className="section-kicker">14 · Fisher Chain-type Quantity Index</p>
        <h2>相对价格不断变化时，Fisher 指数用相邻两期权重折中数量变化，再把相邻增长链起来。</h2>
        <div className="equation-card">
          <span>相邻期 Fisher quantity index</span>
          <div>Q<sup>L</sup><sub>t</sub> = Σp<sub>t−1</sub>q<sub>t</sub>/Σp<sub>t−1</sub>q<sub>t−1</sub>；　Q<sup>P</sup><sub>t</sub> = Σp<sub>t</sub>q<sub>t</sub>/Σp<sub>t</sub>q<sub>t−1</sub></div>
          <div>Q<sup>F</sup><sub>t</sub> = √(Q<sup>L</sup><sub>t</sub>Q<sup>P</sup><sub>t</sub>)；　I<sup>F</sup><sub>t</sub> = I<sup>F</sup><sub>t−1</sub>Q<sup>F</sup><sub>t</sub></div>
          <p>p 为货币/单位，q 为数量；分母必须为正且覆盖相同商品集合。Laspeyres 用上期价格，Paasche 用本期价格，Fisher 取几何平均。链结改善远离固定基年的替代偏误，却不会修复原始资料或质量调整错误。</p>
        </div>
        <p>
          “参考年 2017 dollars”只是把指数缩放到某年名义价值，改变参考年不应改变链式增长率。链式量不是想象中的“按 2017 年永远固定价格重算所有年份”；权重每个相邻期都会更新。Fisher 的 superlative 性质有明确指数理论基础，但经济解释仍依商品覆盖、价格、质量和新产品处理。<Cite n={8} /><Cite n={43} /><Cite n={122} />
        </p>
      </section>

      <section className="lesson-section" id="growth-frequency">
        <p className="section-kicker">15 · Frequency、Annualization 与 Contribution</p>
        <h2>QoQ、SAAR、YoY、年度平均和 component contribution 的分母不同，不能只看同一个百分号。</h2>
        <div className="equation-card">
          <span>季度路径的三种读法</span>
          <div>g<sub>q</sub> = Q<sub>t</sub>/Q<sub>t−1</sub>−1；　g<sub>SAAR</sub> = (1+g<sub>q</sub>)<sup>4</sup>−1；　g<sub>YoY</sub> = Q<sub>t</sub>/Q<sub>t−4</sub>−1</div>
          <p>Q 为经适当季调的季度量水平。SAAR 假定当季速度连续四季用于可比表达，不是预测；YoY 读取过去四季合成路径；年度增长比较两个年度平均。</p>
        </div>
        <p>
          上季 100、本季 100.8，非年化环比为 0.8%，复合年化约 3.24%；同比仍取决于四季前水平。组件“贡献 1 个百分点”也不是组件增长 1%：贡献取决于组件权重、增长和指数公式。对 Fisher 链式量，不能简单用 chained-dollar 分项变化除总量变化；应使用统计机构发布的 contribution 表或合规相邻期公式。<Cite n={8} /><Cite n={16} /><Cite n={25} /><Cite n={123} />
        </p>
      </section>

      <section className="lesson-section" id="per-capita">
        <p className="section-kicker">16 · Aggregate 与 Per Capita</p>
        <h2>总产出增长衡量经济体生产规模，人均实际产出才开始接近“平均可用资源”，但仍不是福利。</h2>
        <div className="equation-card">
          <span>人口尺度</span>
          <div>y<sub>t</sub> = Y<sub>t</sub>/N<sub>t</sub>；　Δlny ≈ ΔlnY − ΔlnN</div>
          <p>Y 为同口径实际产出，N 为相配时期和居民范围的人口。按工作年龄人口、就业者或工时除，会得到不同生产率/生活水平对象。</p>
        </div>
        <p>
          总 GDP 增长 4%、人口增长 3% 时，人均增长约 1%；总量扩张可支持更大市场，却不表示平均生活水平同幅提高。跨国 level 比较还要处理不同价格水平，通常使用 PPP；用市场汇率换算容易把非贸易品价格差异和短期汇率波动混进真实量。<Cite n={26} /><Cite n={27} /><Cite n={42} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="comparable-window">
        <p className="section-kicker">17 · Comparable Window</p>
        <h2>季节、工作日、移动节日、基期与统计翘尾都能改变表面增速，却不创造额外生产。</h2>
        <p>
          未季调季度总量天然受春节、圣诞、天气和工作日数量影响；环比通常要使用季调序列，同比虽部分抵消固定季节，也会被春节/复活节移动、闰年和交易日改变。季调模型会随新增资料重新估计，因此历史季调值也可修订。中国使用 NBS-SA 处理春节等移动节日，欧盟则明确区分季调、工作日调整和未经调整的发布序列；两者标签不能默认为同一算法。<Cite n={16} /><Cite n={19} /><Cite n={21} /><Cite n={29} />
        </p>
        <div className="equation-card">
          <span>统计翘尾 carry-over</span>
          <div>carry-over = Q<sub>4,prior</sub>/mean(Q<sub>1…4,prior</sub>) − 1</div>
          <p>这是“新年四季都停在上年 Q4 水平”时仍会出现的年度平均增长。它只由季度路径与年度平均口径产生，不表示新年内继续增长。</p>
        </div>
        <p>
          若上年四季为 96、98、100、102，新年四季全为 102，则新年每个环比为零，全年平均仍比上年平均 99 高约 3.03%。因此，年度预测要分开 inherited level、当年新增 quarterly momentum 与基数；“全年高增长”可以与“年内已停滞”同时为真。<Cite n={21} /><Cite n={25} />
        </p>
      </section>

      <section className="lesson-section" id="inventory-investment">
        <p className="section-kicker">18 · Inventory Investment</p>
        <h2>库存水平、库存投资和库存对 GDP 增长的贡献是三阶不同对象；“库存仍增加”也可能拖累增长。</h2>
        <div className="equation-card">
          <span>生产、最终销售与存货变化</span>
          <div>GDP = final sales of domestic product + change in inventories</div>
          <p>库存是时点存量；change in inventories 是期间投资流量；它对 GDP 增长的贡献主要取决于库存投资相对上一期怎样变化，而不是库存投资正负本身。</p>
        </div>
        <p>
          最终销售从 1,000 升至 1,010，库存投资从 +12 降至 +4：GDP 从 1,012 升至 1,014，只增 2。企业仍在累库，但累库速度下降，对 GDP 增长的贡献为 −8。相反，库存投资从 −5 升至 +3 会大幅抬高增长，即使期初仍在去库存。库存可能是企业预期需求的主动选择，也可能是销售意外不足的被动结果；账户数字本身不能区分动机。<Cite n={6} /><Cite n={21} /><Cite n={94} />
        </p>
      </section>

      <section className="lesson-section" id="welfare-boundary">
        <p className="section-kicker">19 · GDP 与 Welfare Boundary</p>
        <h2>GDP 衡量生产，不衡量生产成果怎样分配、是否可持续，也不把全部生活质量压成一个数字。</h2>
        <p>
          人均 GDP 上升通常扩展消费与公共服务资源，但同一平均值可对应完全不同的收入分配、闲暇、健康、经济安全和环境路径。污染事故后的清理增加市场生产，事故造成的自然资本损失却不以同额负 GDP 出现；家庭无偿劳动转为付费服务会提高 GDP；寿命改善和闲暇也不按市场产出直接计价。因此“GDP 不是福利”不是说 GDP 无用，而是说生产账户不能承担一整套福利函数。<Cite n={2} /><Cite n={45} /><Cite n={114} /><Cite n={115} /><Cite n={116} />
        </p>
        <p>
          研究应把目标变量说清：解释生产能力时用 actual/potential output 与生产率；解释居民物质生活时增加人均收入、消费和分配；解释可持续性时查看资产负债表、耗损与环境账户。把这些维度合成一个指标需要规范性权重，不能伪装成纯统计事实。<Cite n={2} /><Cite n={45} /><Cite n={113} /><Cite n={116} />
        </p>
      </section>

      <section className="lesson-section" id="production-function">
        <p className="section-kicker">20 · Production Function as Scaffold</p>
        <h2>生产函数把投入与产出组织成一套可审计语言，但它本身不是已经识别的因果定律。</h2>
        <div className="equation-card">
          <span>增长来源的最小骨架</span>
          <div>Y<sub>t</sub> = A<sub>t</sub>F(K<sup>S</sup><sub>t</sub>, L<sup>S</sup><sub>t</sub>; Z<sub>t</sub>)</div>
          <p>Y 是同一边界和期间的实际产出或实际增加值量指数；Kˢ 是资本服务而非资产市值，Lˢ 是质量调整劳动服务而非简单人数；A 汇总在既定函数和投入测量下未被解释的效率；Z 可表示能源、中间投入、组织或其他明确纳入的生产条件。各量可以是指数，因此不能仅凭式子把它们解释为可相加的货币金额。</p>
        </div>
        <p>
          这条式子的用途，是强迫研究者逐一回答“产出是什么、投入怎样测量、哪些条件被遗漏、参数在哪个范围内稳定”。若估计得到资本与产出正相关，不能立刻说增加一单位资本必然造成相应产出：需求上升可能同时推动企业生产和投资，景气变化也可能提高既有设备利用率。生产函数只有结合时序、约束、外生变化或结构假设，才可能承担因果解释。<Cite n={54} /><Cite n={55} /><Cite n={64} /><Cite n={117} />
        </p>
        <p>
          代表性总量函数还会掩盖企业差异和重配。同样的总资本与总工时，若资源配置到不同企业、供应链存在瓶颈，或生产技术不能无成本聚合，总产出可以不同。因此，本节把生产函数当作增长核算的坐标系；33–35 节再把企业内改善、企业间重配和进入退出单独打开。<Cite n={64} /><Cite n={66} />
        </p>
      </section>

      <section className="lesson-section" id="hours-worked">
        <p className="section-kicker">21 · Hours Worked</p>
        <h2>劳动数量首先是期间内实际投入的工时流量；就业人数只是形成工时的一个因子。</h2>
        <div className="equation-card">
          <span>从人数到劳动时间</span>
          <div>H<sub>t</sub> = Σ<sub>i</sub>h<sub>i,t</sub> ≈ N<sup>E</sup><sub>t</sub> × h̄<sub>t</sub></div>
          <p>H 是小时/期间，hᵢ是个人或岗位实际工作小时，Nᴱ是期间就业人数或平均岗位数，h̄是每名就业者平均工时。人数与工时必须使用相容的人群、期间和覆盖范围；一个季末人数不能无说明地乘全年平均工时。</p>
        </div>
        <p>
          两个经济体都增加 1% 就业，若一个经济体每名就业者平均工时下降 2%，另一个上升 1%，它们的劳动数量投入并不相同。加班、兼职比例、停工、休假和工作日都会使 hours 与 headcount 分离；用人数替代工时，会把工作时长变化错误塞进劳动生产率或 TFP。<Cite n={64} /><Cite n={117} /><Cite n={119} />
        </p>
        <div className="precision-note">
          <span>3.03 边界</span>
          <p>本节只测量已经发生的劳动投入，不解释为什么企业招聘、裁员，劳动者为什么进入或退出劳动力市场，也不分析失业和工资形成。那些行为机制留给 3.03；在 3.01 中，hours 只是一项生产投入和分母。</p>
        </div>
      </section>

      <section className="lesson-section" id="labor-composition">
        <p className="section-kicker">22 · Labor Composition</p>
        <h2>一小时并非在所有岗位和时期都代表同一种劳动服务；质量调整的目的，是把工时数量与构成变化分开。</h2>
        <div className="equation-card">
          <span>质量调整劳动服务的 Törnqvist 近似</span>
          <div>ΔlnL<sup>S</sup><sub>t</sub> = Σ<sub>g</sub>s̄<sup>L</sup><sub>g,t</sub>ΔlnH<sub>g,t</sub></div>
          <p>g 是按教育、经验、年龄、职业或其他可观测特征划分的劳动组；H 是各组工时；s̄ᴸ 是相邻两期劳动报酬份额的平均，所有组权重之和为 1。Lˢ 是劳动服务指数，不是人数，也不表示某一群体的社会价值。</p>
        </div>
        <p>
          若总工时不变，但高报酬、高经验岗位的工时份额上升，质量调整劳动服务可能增加；若只用总工时，新增服务会落入 TFP residual。反过来，经济下行时低工时或低生产率岗位先退出，存续岗位的平均产出可能机械上升，即使任何个人都没有变得更有效率。这是 composition effect，不应写成普遍的技能跃迁。<Cite n={57} /><Cite n={64} /><Cite n={119} />
        </p>
        <p>
          报酬份额作为权重依赖“劳动报酬能够反映边际服务价值”等核算假设；自雇者的 mixed income 同时包含劳动与资本回报，必须作分配处理。这里使用工资是为了构造投入权重，不是在解释工资为何变化，更不意味着工资差异完全由个人生产率造成。<Cite n={64} /><Cite n={87} /><Cite n={119} />
        </p>
      </section>

      <section className="lesson-section" id="capital-accumulation">
        <p className="section-kicker">23 · Capital Accumulation</p>
        <h2>投资是期间流量，资本是由历年投资、退役和耗损累积而成的存量；二者不能互换。</h2>
        <div className="equation-card">
          <span>简化 perpetual-inventory law</span>
          <div>K<sub>a,t</sub> = (1 − δ<sub>a</sub>)K<sub>a,t−1</sub> + I<sub>a,t</sub></div>
          <p>Kₐ是资产类别 a 在期末的实际生产性或财富资本存量，Iₐ是本期同价量口径的 gross investment，δₐ是该期经济折旧/效率损失率。这个写法假定投资在期末进入；若采用期中投入、不同资产年龄效率或退役分布，时序必须相应改写。</p>
        </div>
        <p>
          若资本存量为 100、折旧率 8%、本期投资 6，期末资本只有 98：投资为正，但净资本仍下降。购入新机器属于固定资本形成，购买既有公司股票只是金融索取权换手；并购是否增加国民账户投资，要看交易是否伴随新固定资产或知识产品形成，而不是支付金额有多大。<Cite n={1} /><Cite n={54} /><Cite n={118} />
        </p>
        <p>
          资本积累能扩展未来生产能力，却不保证每一笔投资都有同等产出回报。资产可能闲置、配置错误或迅速过时；不同设备的寿命、退役概率和 age-efficiency profile 也不同。因而“投资率高”只说明更多资源流向资本形成，不能单独证明资本服务、生产率或股东回报将按同一比例提高。<Cite n={54} /><Cite n={66} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="capital-services">
        <p className="section-kicker">24 · Capital Services</p>
        <h2>生产过程使用的是资产在本期提供的服务流，而不是资产负债表上的购置成本或市场价值。</h2>
        <div className="equation-card">
          <span>异质资本服务的聚合</span>
          <div>ΔlnK<sup>S</sup><sub>t</sub> = Σ<sub>a</sub>s̄<sup>K</sup><sub>a,t</sub>ΔlnS<sub>a,t</sub></div>
          <p>Sₐ是资产类别 a 的生产性服务量，s̄ᴷ是相邻两期 rental/user-cost 份额的平均，权重之和为 1。资本服务 Kˢ 是无量纲量指数或指数增长率；不能把服务器、建筑和车辆的物理数量直接相加。</p>
        </div>
        <p>
          一台服务器价格可能远低于厂房，却因折旧快、机会成本高和生产贡献集中而具有较高年度 user cost；资本服务权重因此不同于财富存量权重。资本存量回答“拥有哪些资产”，资本服务回答“这些资产在本期为生产提供了多少投入”，二者分别适合财富核算与生产率核算。<Cite n={64} /><Cite n={118} /><Cite n={119} />
        </p>
        <p>
          设备开机率、班次和产能利用率还可能在资本存量不变时改变实际服务。若数据只观察存量而没有利用率，景气复苏造成的更高开机率可能被 TFP residual 吸收。这里仅说明测量边界；融资条件为何改变投资或利用率，以及政策如何反应，留给 3.05 以后相应单元。<Cite n={66} /><Cite n={93} /><Cite n={119} />
        </p>
      </section>

      <section className="lesson-section" id="labor-productivity">
        <p className="section-kicker">25 · Labor Productivity</p>
        <h2>劳动生产率是单位工时对应的实际产出；它是重要的部分生产率，却不是“劳动者个人效率”的纯测量。</h2>
        <div className="equation-card">
          <span>每小时实际产出</span>
          <div>LP<sub>t</sub> = Y<sub>t</sub>/H<sub>t</sub>；　ΔlnLP<sub>t</sub> = ΔlnY<sub>t</sub> − ΔlnH<sub>t</sub></div>
          <p>Y 必须是与 H 覆盖相同部门和期间的实际产出量；H 是总工作小时。若产出增 3%、工时增 1%，小变化下每小时产出约增 2%。</p>
        </div>
        <p>
          每小时产出可以因更好的机器、软件、管理、规模、供应链和劳动构成而提高，也可以因低生产率岗位先退出而机械上升。所以劳动生产率把全部非工时条件都留在分子里；它不能单独识别增长来自劳动者技能、资本深化还是 TFP。<Cite n={55} /><Cite n={64} /><Cite n={117} /><Cite n={119} />
        </p>
        <p>
          周期中还可能出现“产出下降、生产率上升”：若产出降 2% 而工时降 5%，每小时产出反而约升 3%。这不证明衰退改善了技术，而可能反映工时调整、labor hoarding、企业选择与利用率变化。3.03 将解释就业和工时怎样形成；此处只确保生产率分子与分母没有错位。<Cite n={64} /><Cite n={69} /><Cite n={119} />
        </p>
      </section>

      <section className="lesson-section" id="capital-deepening">
        <p className="section-kicker">26 · Capital Deepening</p>
        <h2>每小时可调用的资本服务增加，能够提高每小时产出；但在其他条件不变时，其边际贡献通常递减。</h2>
        <div className="equation-card">
          <span>Constant-returns Cobb–Douglas 的 per-hour 形式</span>
          <div>Y = A(K<sup>S</sup>)<sup>α</sup>H<sup>1−α</sup>　⇒　Y/H = A(K<sup>S</sup>/H)<sup>α</sup></div>
          <p>0&lt;α&lt;1，Kˢ/H 是每小时资本服务，Y/H 是劳动生产率。对数变化近似为 Δln(Y/H)=ΔlnA+αΔln(Kˢ/H)。这一分解依函数形式、规模报酬与投入测量假设。</p>
        </div>
        <p>
          若 α=0.4、每小时资本服务增长 5%、A 不变，资本深化对每小时产出增长的贡献约为 2 个百分点，而不是 5 个百分点。机器翻倍也不保证产出翻倍，因为劳动、能源、技能、管理和市场需求可能成为新约束；资本深化描述沿既有技术增加投入，不应与技术前沿外移混为一谈。<Cite n={54} /><Cite n={62} /><Cite n={117} />
        </p>
        <p>
          资本深化可以长期提高产出水平，但在基本 Solow 机制中，若技术、人口和储蓄条件不再变化，资本边际回报递减会使每工人增长逐渐放缓。这解释了为什么高投资率可能带来一段追赶，却不能仅靠无限堆积同类资本永久维持同一人均增速。<Cite n={54} /><Cite n={62} />
        </p>
      </section>

      <section className="lesson-section" id="tfp-residual">
        <p className="section-kicker">27 · TFP / MFP Residual</p>
        <h2>TFP 是在既定产出、投入与权重下无法由投入增长解释的剩余；它不是被直接观测到的纯技术。</h2>
        <div className="equation-card">
          <span>Value-added growth-accounting residual</span>
          <div>ΔlnA<sub>t</sub> = ΔlnY<sub>t</sub> − s̄<sup>K</sup><sub>t</sub>ΔlnK<sup>S</sup><sub>t</sub> − s̄<sup>L</sup><sub>t</sub>ΔlnL<sup>S</sup><sub>t</sub></div>
          <p>Y、Kˢ、Lˢ必须覆盖同一部门与期间；s̄ᴷ和s̄ᴸ是相容的成本份额，在最小 value-added 模型中通常和为 1。各项是同频 log change，结果为 log points/期间；小变化时可读作百分比增长。</p>
        </div>
        <p>
          正 residual 可能包含技术、组织改善、规模经济和资源重配，也可能包含资本利用率上升、未测劳动质量、价格平减错误、遗漏中间投入或加成变化；负 residual 也不意味着经济“忘记了技术”。Solow residual 的价值正在于把未解释部分显露出来，而不是替研究者替它命名。<Cite n={55} /><Cite n={64} /><Cite n={66} /><Cite n={92} /><Cite n={93} /><Cite n={119} />
        </p>
        <div className="precision-note">
          <span>Residual discipline</span>
          <p>只有当产出与投入量测可信、份额假设适用、利用率和构成得到处理、研究设计还能排除共同冲击时，才可把 residual 的一部分进一步归因于具体创新。网页中的“TFP 增长”默认指核算残差，不默认指结构技术参数。</p>
        </div>
      </section>

      <section className="lesson-section" id="growth-accounting">
        <p className="section-kicker">28 · Growth Accounting</p>
        <h2>增长核算把实际产出增长分配给投入贡献与 TFP residual；它回答“怎样分解”，不自动回答“什么造成”。</h2>
        <div className="equation-card">
          <span>贡献式</span>
          <div>ΔlnY = s̄<sup>K</sup>ΔlnK<sup>S</sup> + s̄<sup>L</sup>ΔlnL<sup>S</sup> + ΔlnA</div>
          <p>资本和劳动的“贡献”是投入增长率乘成本份额，单位为 log points/期间；TFP 本身的增长率在此也等于它对产出增长的 log-point 贡献。一般百分比变化只在小变化下近似相加。</p>
        </div>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="增长核算数值例，可横向滚动">
          <table className="concept-table">
            <caption>实际产出增长 3.5%，资本份额 0.40、劳动份额 0.60</caption>
            <thead><tr><th scope="col">项目</th><th scope="col">增长</th><th scope="col">份额</th><th scope="col">贡献</th></tr></thead>
            <tbody>
              <tr><th scope="row">资本服务</th><td>5.0%</td><td>0.40</td><td>约 2.0pp</td></tr>
              <tr><th scope="row">劳动服务</th><td>1.0%</td><td>0.60</td><td>约 0.6pp</td></tr>
              <tr><th scope="row">TFP residual</th><td>约 0.9%</td><td>直接进入</td><td>约 0.9pp</td></tr>
              <tr><th scope="row">合计</th><td colSpan={2}>同一 log-point 口径</td><td>约 3.5pp</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这张表不能证明资本增长“外生造成”2 个百分点：预期需求可能同时提高投资、工时和利用率，份额也可能随加成与收入分配变化。增长核算是一项受约束的描述性分解；因果研究必须另行说明冲击、反事实与识别。<Cite n={55} /><Cite n={64} /><Cite n={66} /><Cite n={117} /><Cite n={119} />
        </p>
      </section>

      <section className="lesson-section" id="factor-share-assumptions">
        <p className="section-kicker">29 · Factor-share Assumptions</p>
        <h2>用收入份额给投入增长加权，需要竞争、规模报酬与成本边界等条件；份额不是无条件的技术弹性。</h2>
        <div className="equation-card">
          <span>Cobb–Douglas 基准下的份额映射</span>
          <div>Y = AK<sup>α</sup>L<sup>1−α</sup>；　在竞争且 constant returns 基准下，α ≈ capital cost share，1−α ≈ labor cost share</div>
          <p>这是一条有条件映射。份额的分母必须说明是 value added、gross output 还是总成本；若使用 gross-output accounting，还需单列 energy、materials 与 purchased services，不能沿用 value-added 两投入权重。</p>
        </div>
        <p>
          产品加成会使要素收入份额偏离产出弹性；未观测无形资本会漏掉部分资本服务；生产税与补贴改变增加值和成本之间的关系；自雇 mixed income 需要在劳动与资本间估算分配。若简单把剩余全部归资本，会在自雇占比较高的经济体低估劳动份额。<Cite n={64} /><Cite n={66} /><Cite n={87} /><Cite n={92} /><Cite n={119} />
        </p>
        <p>
          利用率与非恒定规模报酬还会使观测的短期产出响应不同于长期技术弹性。因此，出版级结论不能只写“资本贡献=资本份额×资本增长”，还应同时注明 share definition、竞争/加成假设、规模报酬、投入覆盖、频率与 residual 中仍可能留下什么。<Cite n={66} /><Cite n={92} /><Cite n={93} />
        </p>
      </section>

      <section className="lesson-section" id="actual-potential-output">
        <p className="section-kicker">30 · Actual 与 Potential Output</p>
        <h2>实际产出是统计估计，潜在产出是不可直接观察的持续生产能力；两者之差依模型与 vintage 而变。</h2>
        <div className="equation-card">
          <span>Latent trend 与 output gap</span>
          <div>gap<sub>t</sub> = 100 × [lnY<sub>t</sub> − lnY<sup>*</sup><sub>t</sub>]</div>
          <p>Y 是实际产出量，Y* 是模型估计的潜在产出；gap 以近似百分比表示。Potential 不是“所有机器满负荷时的物理极限”，而是在给定定义下可持续的产出路径。</p>
        </div>
        <p>
          一场停工结束后，实际产出可以迅速反弹，因为既有劳动和资本重新被使用；这不要求技术前沿或潜在增长率同步跃升。反过来，资本形成下降、劳动服务趋势改变或生产率持续走弱，可能降低潜在路径，即使当期 GDP 尚未明显下跌。区分 cyclical utilization 与 capacity growth，才能避免把恢复性增长写成永久生产率改善。<Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={53} />
        </p>
        <p>
          不同机构可用生产函数、滤波器或多变量模型估计 Y*，结果会随新数据和端点修订。实时研究显示 output gap 的历史估计可能被大幅改写，因此事后最终 gap 不能冒充当时决策者已知状态。这里仅建立 actual/potential 的测量接口；央行怎样读取它、容忍多大偏离和怎样反应，全部留给 3.05。<Cite n={50} /><Cite n={51} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="innovation-frontier">
        <p className="section-kicker">31 · Innovation Frontier</p>
        <h2>创新扩展“可以怎样生产”的知识集合，却不保证发明当期就表现为全经济实际产出或 TFP。</h2>
        <div className="equation-card">
          <span>只作机制语言的知识前沿</span>
          <div>A<sup>F</sup><sub>t+1</sub> = A<sup>F</sup><sub>t</sub>(1 + g<sup>idea</sup><sub>t</sub>)</div>
          <p>Aᶠ是不可直接观察的技术前沿指数，gⁱᵈᵉᵃ是知识集合的扩张率。此式只表达“新知识可移动前沿”，不是可直接用专利数或 R&amp;D 支出替代的估计方程。</p>
        </div>
        <p>
          R&amp;D、软件和数据资产可在国民账户中形成当期投资，因为生产这些知识产品本身使用了资源；它们对以后产出的经济回报仍取决于试验成功、组织调整、互补资本和扩散。专利增加、模型能力提高或实验室突破，都可能先扩大技术机会而尚未改变大多数企业的生产流程。<Cite n={1} /><Cite n={56} /><Cite n={58} /><Cite n={59} />
        </p>
        <p>
          内生增长理论说明知识具有部分非竞争性并可能产生 spillover，但“研究人员越多，长期增长率按固定比例越高”的强 scale effect 受到数据挑战；后续模型因而区分 ideas 的质量、研究难度和人口规模。正式写作应把“创新活动增加”“知识前沿外移”“实际采用”和“统计 TFP 上升”写成四个不同事件。<Cite n={56} /><Cite n={58} /><Cite n={60} /><Cite n={61} /><Cite n={77} />
        </p>
      </section>

      <section className="lesson-section" id="diffusion-adoption">
        <p className="section-kicker">32 · Diffusion and Adoption</p>
        <h2>前沿技术只有进入具体企业的组织、资本与工作流程，才会成为已实现的生产率。</h2>
        <div className="equation-card">
          <span>Frontier–adoption gap 的教学表示</span>
          <div>A<sub>i,t</sub> = d<sub>i,t</sub>A<sup>F</sup><sub>t</sub>；　0 ≤ d<sub>i,t</sub> ≤ 1</div>
          <p>Aᶠ是共同技术前沿，dᵢ是企业 i 的有效采用程度，Aᵢ是其已实现效率。现实 adoption 不一定是一维比例；互补资产、网络、管理和学习可使关系非线性。</p>
        </div>
        <p>
          新通用技术的第一阶段常要求软件重写、流程重组、培训和试错。这些投入先占用工时和资本，却尚未产生全部可计量产出，甚至会暂时压低生产率；待互补投资完成，收益才逐渐显现，形成所谓 productivity J-curve。因而“技术已经存在但宏观生产率未上升”既不能立即证明技术无效，也不能保证未来收益必然到来。<Cite n={77} /><Cite n={78} />
        </p>
        <p>
          扩散速度还可能因企业规模、管理能力、供应链兼容性和采用成本而异，技术收益于是先集中于少数 frontier firms，再逐步传播或长期停滞。这里只解释从知识到产出的时间与组织接口；补贴、产业政策和市场结构如何改变采用激励，留给 5.20 等后续单元。<Cite n={69} /><Cite n={79} />
        </p>
      </section>

      <section className="lesson-section" id="within-firm-productivity">
        <p className="section-kicker">33 · Within-firm Productivity</p>
        <h2>Within-firm improvement 指同一生产单位在可比投入下产生更多或更好产出；它必须与价格、加成和样本构成变化分开。</h2>
        <div className="equation-card">
          <span>企业生产率的概念对象</span>
          <div>P<sub>i,t</sub> = Q<sub>i,t</sub>/F(K<sup>S</sup><sub>i,t</sub>, L<sup>S</sup><sub>i,t</sub>, M<sub>i,t</sub>)</div>
          <p>Q 是企业物量或经过适当平减的产出，M 是中间投入，Kˢ与Lˢ是服务流。P 是在选定函数和量测下的效率指数；若分子使用收入而不能观察企业价格，得到的 revenue productivity 会同时含价格与 markup。</p>
        </div>
        <p>
          更少废品、更短停机、改进排程和管理流程都可能形成真正的企业内效率改善；涨价、需求转向高价产品或市场势力增强则可能提高 revenue per input，却不表示物理生产率同幅上升。Foster 等研究表明 physical productivity 与 revenue productivity 可以给出不同排序，因此不能把财报收入除员工人数直接命名为技术效率。<Cite n={69} /><Cite n={75} />
        </p>
        <p>
          观察同一家企业前后变化也不自动识别管理措施的因果效应：企业可能在需求旺盛时同时采用新流程，或只有成功采用者继续留在样本。可信结论还需可比产品价格、投入质量、同期冲击和退出处理。33 节只定义 within component；下一节再问市场份额变化怎样改变总体。<Cite n={69} /><Cite n={75} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="productivity-reallocation">
        <p className="section-kicker">34 · Reallocation</p>
        <h2>即使每家企业的生产率都不变，资源和市场份额转向高生产率企业，也能提高聚合生产率。</h2>
        <div className="equation-card">
          <span>两期聚合生产率的精确离散分解</span>
          <div>P<sub>t</sub> = Σ<sub>i</sub>s<sub>i,t</sub>p<sub>i,t</sub></div>
          <div>ΔP = Σs<sub>i,t−1</sub>Δp<sub>i</sub> + Σp<sub>i,t−1</sub>Δs<sub>i</sub> + ΣΔs<sub>i</sub>Δp<sub>i</sub></div>
          <p>sᵢ是和为 1 的可比份额，pᵢ是同单位生产率水平。三项分别是 within、between 和 cross；若改用 log productivity 或不同权重，这个加法式不再保持同样精确形式。</p>
        </div>
        <p>
          两家企业生产率分别为 1 和 2，初始份额各 50%，聚合值为 1.5；若生产率不变而高生产率企业份额升至 70%，聚合值升至 1.7。没有一家企业变得更有效率，总体仍因 reallocation 改善。反方向上，融资、制度或市场摩擦若让低生产率企业占用更多资本和劳动，聚合产出会低于相同总投入下的可实现水平。<Cite n={70} /><Cite n={71} /><Cite n={72} /><Cite n={73} />
        </p>
        <p>
          分解本身仍是会计重排，不证明份额移动由竞争选择造成。需求偏好、价格、加成、政府采购和测量误差都可能改变 revenue share；高 revenue productivity 也可能反映高价格而非高 physical productivity。研究必须说明权重、生产率口径与反事实，再决定能否把 between term 解释为资源配置改善。<Cite n={70} /><Cite n={72} /><Cite n={75} /><Cite n={76} />
        </p>
      </section>

      <section className="lesson-section" id="entry-exit">
        <p className="section-kicker">35 · Entry and Exit</p>
        <h2>企业出生和死亡会改变生产单位集合；只观察持续存活者，会漏掉增长与生产率演化的重要一腿。</h2>
        <div className="equation-card">
          <span>企业集合的状态变化</span>
          <div>P<sub>t</sub> = Σ<sub>i∈S</sub>s<sub>i,t</sub>p<sub>i,t</sub> + Σ<sub>i∈E</sub>s<sub>i,t</sub>p<sub>i,t</sub></div>
          <div>P<sub>t−1</sub> = Σ<sub>i∈S</sub>s<sub>i,t−1</sub>p<sub>i,t−1</sub> + Σ<sub>i∈X</sub>s<sub>i,t−1</sub>p<sub>i,t−1</sub></div>
          <p>S 是两期都存在的 survivors，E 是 entrants，X 是 exits。进入和退出贡献必须相对明确的聚合基准计算；不能把两个不同企业集合的简单平均直接相减后全部归因 survivor improvement。</p>
        </div>
        <p>
          低生产率企业退出可机械抬高存续样本平均值，即使没有一家存续企业改善；新企业初期生产率可能较低，却通过试验和成长在以后贡献创新。退出也不总是“淘汰低效”：短期融资约束或共同冲击可能杀死有潜力的企业。因此，净进入项描述集合变化，不自带福利或因果符号。<Cite n={72} /><Cite n={74} /><Cite n={75} /><Cite n={81} />
        </p>
        <p>
          动态 Olley–Pakes 类分解把 survivors 的 within/reallocation 与 entry/exit 分开，但结论仍取决于生产率、份额和观察窗。此处还为 Equity Fundamentals 留下关键断点：新企业可以推高全经济产出和利润池，却不提高原有上市公司每股权益；IPO 和新增股本甚至会把增长分配给新资本。<Cite n={74} /><Cite n={76} /><Cite n={126} /><Cite n={127} />
        </p>
      </section>

      <section className="lesson-section" id="catch-up-convergence">
        <p className="section-kicker">36 · Catch-up and Conditional Convergence</p>
        <h2>低生产率经济体拥有采用既有技术的追赶空间，但低起点既不是充分条件，也不是高增长保证。</h2>
        <div className="equation-card">
          <span>Conditional convergence 的经验表示</span>
          <div>Δlny<sub>i,t→t+h</sub> = a − βlny<sub>i,t</sub> + γ′Z<sub>i,t</sub> + ε<sub>i,t+h</sub></div>
          <p>y 是可比的人均或每工时实际产出，h 是固定预测期，Z 包含储蓄、人口、教育或制度等稳态条件；在口径和条件成立时，β&gt;0 表示较低初始水平与较快追赶相关。它不是由一条横截面回归自动识别的政策因果系数。</p>
        </div>
        <p>
          在 Solow 机制中，资本稀缺使资本深化初期具有较高边际贡献；可获得的前沿知识也减少从零发明的成本。但追赶需要互补人力资本、组织能力、基础设施和可配置资源，且不同经济体可能走向不同稳态。只比较初始收入与后续增长，会把这些条件、选择进入样本和测量误差混进 β。<Cite n={54} /><Cite n={62} /><Cite n={63} />
        </p>
        <p>
          “贫穷国家必然增长更快”是 absolute convergence 的过强版本；conditional convergence 只说，在相关长期条件相近时，离自身稳态更远的经济体可能增长更快。即使 GDP 成功追赶，后续 37–56 节仍要检查增长落在哪些行业、由新资本还是既有公司获得、是否转成每股现金流，以及市场此前为这条路径支付了什么价格。<Cite n={54} /><Cite n={62} /><Cite n={63} />
        </p>
      </section>
      <section className="lesson-section" id="final-demand-industry">
        <p className="section-kicker">37 · Final Demand → Industry Output</p>
        <h2>一元最终需求不会只落到收款行业：它会沿境内投入产出网络形成上游生产，并在进口处发生地理泄漏。</h2>
        <div className="equation-card">
          <span>静态投入产出数量模型</span>
          <div>x = Ax + f；　x = (I − A)<sup>−1</sup>f</div>
          <p>x 与 f 都是行业产出/期间，A<sub>ij</sub> 是行业 j 每生产一元毛产出所直接使用的行业 i 中间投入。I 是对角线为 1 的单位矩阵；(I−A)<sup>−1</sup> 这个逆矩阵把第一轮、第二轮直到更上游的投入需求加总。谱半径小于 1 保证足够高阶的轮次最终趋于零，从而使 I+A+A<sup>2</sup>+… 这个级数收敛；它不保证每个行业的需求分量在每一轮都单调下降。此外还必须保证部门定义相容并按模型冻结技术系数。</p>
        </div>
        <p>
          家庭多购买一元餐饮，最先看到的是餐饮最终需求；餐厅随后购买食品、能源、物流、租赁和专业服务，上游又购买自己的投入。单国 Leontief inverse 把境内直接与间接 gross-output requirements 展开，进口则需在 use table 中作为境外来源剥离；多区域投入产出模型才能把这部分继续追到外国行业。两者都不能自动告诉我们 GDP 增量：每一层毛产出都含中间投入，只有境内 value-added coefficients 乘上整条需求链，才得到模型中的境内增加值。若产能、价格、进口份额、库存和投入系数会响应，静态矩阵给的是条件传导图，不是无条件乘数。<Cite n={15} /><Cite n={120} /><Cite n={121} />
        </p>
      </section>

      <section className="lesson-section" id="gross-output-gdp">
        <p className="section-kicker">38 · Gross Output ≠ GDP Contribution</p>
        <h2>行业销售增长很大，可能只是把更多中间品层层转售；GDP 只记录每一层新创造的价值。</h2>
        <div className="equation-card">
          <span>行业增加值率</span>
          <div>VA<sub>j</sub> = GO<sub>j</sub> − II<sub>j</sub>；　v<sub>j</sub> = VA<sub>j</sub>/GO<sub>j</sub></div>
          <p>GO、II 与 VA 都是同一行业、期间与估价口径的货币流；v 是无量纲比率。实际量分析不能把现价 v 机械乘实际 GO，须尊重双重平减和链式方法。</p>
        </div>
        <p>
          批发商以 100 买入转售商品、以 103 售出时，103 是销售额，不是批发这类 margin industry 的 national-account gross output。在不存在另行收费服务的最简情形下，gross output 约为销售减转售商品成本所得的 3 元贸易边际；若批发商自身又消耗 1 元能源、包装或租赁服务，增加值才是 3−1=2。炼油、汽车装配等非 margin industries 也可以有高 gross output 而低增加值率，但原因是中间投入密集，不能与批发零售的特殊产出定义混为一件事。公司营收、行业 gross output、最终销售与 GDP contribution 因而是四个对象。<Cite n={1} /><Cite n={120} /><Cite n={121} /><Cite n={129} />
        </p>
      </section>

      <section className="lesson-section" id="import-content">
        <p className="section-kicker">39 · Import Content</p>
        <h2>需求落在本国商店，不表示新增价值都在本国；进口含量决定第一道地理泄漏。</h2>
        <p>
          一元消费可以直接购买进口终端品，也可以购买本国组装但大量使用进口零部件的产品。支出恒等式中的 −M 在总量上做来源校正；投入产出表则进一步识别直接进口和藏在本国供应链各层的间接进口。若进口含量为 m、境内增加值率为 d，则在极简冻结结构下，一元最终需求最多先映射为约 d=1−m 的境内增加值；现实中税、贸易与运输边际、库存和多轮投入使映射更细。<Cite n={1} /><Cite n={15} /><Cite n={121} />
        </p>
        <div className="precision-note"><span>−M 不是需求乘数 −1</span><p>进口可以替代本国产出，也可以提供本国企业短期无法生产的机器和中间品，从而解除供给约束、提高以后资本服务。要判断冲击效应，必须同时估计替代关系、汇率与价格响应、进口中间品角色和政策反应；账户位置本身没有因果系数。</p></div>
      </section>

      <section className="lesson-section" id="consumption-composition">
        <p className="section-kicker">40 · Consumption Composition</p>
        <h2>消费总量相同，耐用品、服务与必需品之间的重配会产生完全不同的行业、库存与利润路径。</h2>
        <p>
          居民消费支出把当期最终使用记入 C，但汽车、医疗、住房服务与餐饮的供给链、进口含量、价格弹性和公司覆盖完全不同。耐用品购买常可跨期推迟，订单变化会先进入制造与库存；服务多在生产时即消费，库存缓冲较弱；住房的自有住宅服务还包含估算租金，而买卖既有住房资产本身不是新生产。于是“消费增长 3%”只是上层聚合，解释企业收入至少要向下拆到产品类别、数量/价格、境内来源与销售渠道。<Cite n={1} /><Cite n={6} /><Cite n={21} />
        </p>
        <p>
          这种拆分也阻止一个常见错误：高频零售销售通常以名义销售、特定机构覆盖和自身季调发布，不能直接替代实际居民消费或服务消费。它可以成为 nowcast 的部分证据，但须明确缺失行业、价格平减、退货、税与后续修订。<Cite n={6} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="investment-two-sides">
        <p className="section-kicker">41 · Investment 的两张脸</p>
        <h2>投资在购买期是最终需求，在安装后成为资本存量；同一笔支出同时连接当期 GDP 与未来供给。</h2>
        <div className="equation-card">
          <span>资本积累的永续盘存直觉</span>
          <div>K<sub>t</sub> = (1 − δ<sub>t</sub>)K<sub>t−1</sub> + I<sub>t</sub></div>
          <p>K 是期末生产性资产存量，I 是期间总固定资本形成，δ 是期间耗损率。实际生产分析更关注不同资产的 productive stock 与 capital services，不能把所有资本单位同质相加。</p>
        </div>
        <p>
          新机器在制造和安装期间进入投资与 GDP；此后它通过资本服务影响潜在与实际产出，同时逐年耗损。投资繁荣若只替换报废资产，对净资本存量的提升有限；住宅建设进入投资，但既有住宅买卖主要是资产转手；库存变化也是 I 的组成，却不等同固定资本形成。对上市公司而言，宏观 I 可能成为设备供应商收入，也可能是本公司资本开支和短期自由现金流流出，长期是否增厚每股价值取决于投入资本回报而非“投资增加”四个字。<Cite n={1} /><Cite n={6} /><Cite n={66} /><Cite n={118} />
        </p>
      </section>

      <section className="lesson-section" id="government-purchase-transfer">
        <p className="section-kicker">42 · Government Purchase ≠ Transfer</p>
        <h2>政府购买当期产品进入 G；转移支付先改变收入与约束，只有被花费或改变行为后才间接进入生产。</h2>
        <p>
          G 包括政府消费与总投资：教师、公共管理、道路和设备等当期生产按相应方法计量。养老金、失业救济、现金补贴和债券利息主要是部门间收入或金融流量，不因政府付款这一动作本身形成当期新增产品，所以不直接进入 G。它们仍可能通过居民消费、劳动供给、企业现金约束或风险分担改变以后 C、I 和产出；是否、何时以及乘数多大是行为与政策识别问题，不是国民账户分类可以回答的。<Cite n={1} /><Cite n={6} /><Cite n={21} />
        </p>
        <div className="precision-note"><span>成本计价不是社会价值裁决</span><p>许多政府非市场服务没有可观察市场价格，产出常按投入成本估计。增加投入可能提高 measured output，却不自动证明服务质量或福利同比例提高；质量调整与结果评价需另加证据。</p></div>
      </section>

      <section className="lesson-section" id="exports-production-location">
        <p className="section-kicker">43 · Exports 与 Production Location</p>
        <h2>出口按生产地点进入 GDP，公司收入却按控制与合并边界呈现；跨国集团把二者系统性分开。</h2>
        <p>
          本国工厂向海外客户交货，是本国生产和出口；本国集团的外国子公司在当地生产并销售，通常进入东道国 GDP，即使利润最终归本国股东；境外委托加工、merchanting、知识产权和合同制造还可能使货物流、所有权转移与收入确认不在同一地点。国际账户使用经济所有权与居民单位规则，企业报告则按会计控制和业务分部合并。于是“出口增长”不是“本国指数公司海外收入增长”，“本国公司收入增长”也不是“本国 GDP 增长”。<Cite n={1} /><Cite n={13} /><Cite n={97} /><Cite n={98} /><Cite n={99} />
        </p>
        <p>
          可检验的桥应把公司销售按客户目的地、生产地和利润归属分别标记，并说明汇率换算。只用总部地址或股票上市地给跨国收入贴国别标签，会同时错置生产、需求和股东三条边界。
        </p>
      </section>

      <section className="lesson-section" id="industry-company-concordance">
        <p className="section-kicker">44 · Industry → Company Concordance</p>
        <h2>统计行业是生产活动分类，公司是多业务法律与会计实体；从行业增长到公司收入必须显式建桥。</h2>
        <p>
          一个集团可同时经营云服务、零售、物流与广告，而产业统计可能按 establishment 的主要活动分别归类；证券数据库却常给整个发行人一个主行业代码。并购、分拆、业务重组和分类修订还会改变映射。最小 concordance 因此不是“行业代码相同就相等”，而是一张带权矩阵：公司 c 对产品/行业 j 的暴露权重 w<sub>cj</sub>，并标注权重来自收入、增加值、资产、成本还是人工判断，以及报告期、地理和残余未分配项。<Cite n={1} /><Cite n={15} /><Cite n={120} /><Cite n={121} />
        </p>
        <div className="equation-card">
          <span>暴露映射而非定义恒等</span>
          <div>ΔlnRevenue<sub>c</sub> ≈ Σ<sub>j</sub>w<sub>cj</sub>β<sub>cj</sub>ΔlnDemand<sub>j</sub> + company-specific terms</div>
          <p>w 是无量纲暴露权重，β 是公司收入对行业需求的条件弹性；两者都需估计且可能随价格、份额、并购与产能状态变化。该式是研究模型，不是国民账户恒等。</p>
        </div>
      </section>

      <section className="lesson-section" id="real-output-nominal-revenue">
        <p className="section-kicker">45 · Real Output → Nominal Revenue</p>
        <h2>实际量增长只有与公司价格、产品组合、汇率和市场份额结合，才成为名义收入增长。</h2>
        <div className="equation-card">
          <span>公司收入的近似拆分</span>
          <div>ΔlnRevenue ≈ ΔlnVolume + ΔlnEffective Price + mix + FX + scope</div>
          <p>各项须相对同一公司边界与期间，并写成可比的 log-point contribution；mix 表示高低价产品权重，FX 表示折算效应，scope 表示并购、剥离或会计合并范围变化。交叉项在大变化时不能忽略。</p>
        </div>
        <p>
          实际 GDP 上升 3% 时，公司销量可能因行业暴露和份额变化上升 8% 或下降；即使销量相同，提价、折扣和组合也会改变 revenue；海外收入还受汇率折算。上述拆分是研究者针对特定公司搭建的近似桥，不是国民账户恒等式；每一项都应回到公司披露验证。反过来，名义收入强劲可能完全由价格上涨驱动，实际数量不增；缺乏拆分时，不能把“名义营收−CPI”当公司真实销量。<Cite n={6} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="revenue-gross-profit">
        <p className="section-kicker">46 · Revenue → Gross Profit</p>
        <h2>收入增长是否变成会计毛利，取决于净实现价格与平均会计销售成本怎样共同变化，而不是只看销量。</h2>
        <div className="equation-card">
          <span>单产品会计毛利桥</span>
          <div>Net revenue = Pq；　Gross profit = net revenue − cost of sales</div>
          <div>若 cost of sales = cq，则 Gross profit = (P − c)q；　gross margin = Gross profit / net revenue</div>
          <p>P 是扣除折让后的平均实现价格，c 是这个单产品教学模型中每单位已售商品的会计销售成本，q 是已售数量；多产品企业还需按组合聚合。</p>
        </div>
        <p>
          IAS 1 的费用功能法把 cost of sales 作为会计列示类别，并在示例损益表中以 revenue 减 cost of sales 得到 gross profit；IAS 2 又说明，当期通常称作 cost of sales 的存货费用可包含已售存货原先归集的成本、未分摊生产间接费用和异常生产成本。因此 c 只能被理解为本教学模型中的平均会计销售成本，不能自动改名为经济学边际成本或可变成本，gross margin 也不能直接当作结构性加成。<Cite n={131} /><Cite n={132} />
        </p>
        <p>
          需求扩张使 q 上升，但若原材料、生产人工或把存货运至当前位置的运输与处理成本推高 c，或者促销折让压低 P，以至于单位毛利 P−c 的收缩超过销量增长，毛利仍可下降；供给受限时 q 不增而净实现价格 P 上升，收入与毛利又可能增加。这两个方向是上式在不同条件下的直接算术，不是从一条宏观序列已经识别出的因果弹性。因此从 real activity 到 gross profit 至少要观察净实现价格、销售成本、产品组合、成本归集和竞争状态。完整通胀形成机制留给 3.02，本节只固定这条公司算术桥。
        </p>
      </section>

      <section className="lesson-section" id="value-added-distribution">
        <p className="section-kicker">47 · Value-added Distribution</p>
        <h2>新增价值形成后，还要在劳动、政府、债权人与资本所有者之间分配；GDP 增长不是利润的所有权声明。</h2>
        <p>
          增加值在收入侧首先表现为雇员报酬、生产和进口税减补贴、gross operating surplus 与 mixed income。公司从营业盈余到股东可得收益，还需扣除折旧、利息、所得税并处理养老金、少数股东、非经营损益与再投资。劳动份额、利润份额和税负会随议价、产业构成、加成、资本密集度与周期改变，所以“收入份额冻结”只能作为局部基准。<Cite n={1} /><Cite n={6} /><Cite n={87} /><Cite n={88} /><Cite n={89} /><Cite n={90} />
        </p>
        <p>
          更关键的是，宏观 mixed income 包含无法干净拆分劳动与资本回报的非公司业主收入，住房服务和政府生产也进入增加值。把 gross operating surplus 除 GDP 当“上市公司净利率”，会同时错在部门覆盖、gross/net、利息税项与公司边界。
        </p>
      </section>

      <section className="lesson-section" id="operating-leverage">
        <p className="section-kicker">48 · Operating Leverage</p>
        <h2>固定经营成本使小幅销量变化放大利润变化，但放大倍数随利润基数、价格和成本状态而变。</h2>
        <div className="equation-card">
          <span>局部销量经营杠杆</span>
          <div>π = (P − v)q − F；　DOL<sub>q</sub> = ∂lnπ/∂lnq = (P − v)q/π</div>
          <p>P、v 是货币/单位，q 是数量，F 与 π 是货币/期间；该导数冻结 P、v、F 和组合，且只在 π&gt;0 时有通常的利润增长直觉。π=0 时无定义，π&lt;0 时符号解释失真。</p>
        </div>
        <p>
          从 π=(P−v)q−F 对 q 求导，再乘 q/π，就直接得到 DOL<sub>q</sub>=(P−v)q/π；这一步是本页对利润恒等式的自行推导。P=10、v=6、q=100、F=300 时，利润为 100，DOL=4；销量增 10% 后利润变 140，即增 40%。但若扩产需要新增固定成本、销量增长伴随降价、工资随景气上升或企业接近产能上限，实际增幅会偏离这一局部导数。经营杠杆因此是状态变量，不是行业永久常数，更不能拿宏观 GDP 增速直接乘 DOL 预测指数利润。<Cite n={128} />
        </p>
      </section>

      <section className="lesson-section" id="national-account-profit">
        <p className="section-kicker">49 · National-account Profit ≠ Reported Earnings</p>
        <h2>国民账户企业利润为宏观生产与收入分析构造，财报净利润依会计确认和公司合并边界；两者可以互相校验，却不能直接替换。</h2>
        <p>
          国民账户会调整税务折旧与经济折旧、存货计价和资本消耗，力求把利润放回当期生产；财务会计则按会计确认、计量和公司合并边界处理项目。宏观利润还覆盖未上市公司、特定法人部门和估算项，而股票指数只含满足上市与编制规则的发行人。因此两套数字的部门覆盖、利润定义、季度时点、初值资料和修订路径都可能不同。<Cite n={6} /><Cite n={41} />
        </p>
        <div className="precision-note"><span>正确用途是 bridge，不是 substitution</span><p>先固定 corporate sector、税前/税后、含/不含资本消耗和 inventory valuation adjustment，再把宏观利润作为总量交叉验证；公司估值仍应回到一致口径的报表现金流、股本和债务。两者背离可以提出测量、覆盖或利润分配假说，却不会自动判定哪一方“错”。</p></div>
      </section>

      <section className="lesson-section" id="economy-listed-coverage">
        <p className="section-kicker">50 · Economy Coverage ≠ Listed Universe</p>
        <h2>GDP 覆盖经济领土内全部合格生产，股票指数只覆盖一套可投资证券；增长可以在指数之外发生。</h2>
        <p>
          家庭企业、非上市私企、政府、非营利机构、住房服务和外资在地生产都可进入 GDP；股票指数则只覆盖符合其成分资格与权重规则的上市证券。新企业创造的产出可能先进入 GDP，几年后才上市；高增长公司也可能在海外上市或从未上市。反过来，指数中的跨国巨头可从境外获得大部分收入和利润。所谓“本国股票市场代表本国经济”因此不是定义事实，而是需要逐期估计的覆盖命题。<Cite n={1} /><Cite n={13} /><Cite n={126} /><Cite n={127} />
        </p>
        <div className="equation-card">
          <span>上市覆盖率只是起点</span>
          <div>coverage<sub>t</sub> = matched listed value added<sub>t</sub> / economy value added<sub>t</sub></div>
          <p>分子必须按生产地点和增加值口径重建，不能直接用上市公司收入；比率会随上市、退市、并购、国企边界和指数规则变化。</p>
        </div>
      </section>

      <section className="lesson-section" id="geographic-mismatch">
        <p className="section-kicker">51 · Geographic Mismatch</p>
        <h2>总部、上市地、生产地、客户地与利润归属地是五张不同地图；任何一张都不能独占“公司属于哪个经济体”。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="公司与宏观地理边界，可横向滚动">
          <table className="concept-table">
            <caption>同一跨国公司的五类位置</caption>
            <thead><tr><th scope="col">位置</th><th scope="col">回答的问题</th><th scope="col">适合的研究</th></tr></thead>
            <tbody>
              <tr><th scope="row">总部／控制地</th><td>战略与治理中心在哪里</td><td>监管、税制与控制权</td></tr>
              <tr><th scope="row">证券上市地</th><td>证券在哪套市场规则下交易</td><td>指数、流动性与投资者基础</td></tr>
              <tr><th scope="row">生产地</th><td>增加值在哪个经济领土形成</td><td>GDP、就业与供应链</td></tr>
              <tr><th scope="row">客户地</th><td>最终或中间需求来自哪里</td><td>收入暴露与需求冲击</td></tr>
              <tr><th scope="row">利润归属地</th><td>初次收入与税前利润记在哪里</td><td>GNI、国际账户与税务</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          研究 GDP news 对股票的影响时，应至少构造国内生产暴露、国内客户收入暴露和海外收入暴露，并标注货币。用上市地把全球公司全部视为“国内”，会稀释真实国内现金流通道；用客户地替代生产地，又会把进口供应商的增加值错归国内。<Cite n={13} /><Cite n={97} /><Cite n={98} /><Cite n={99} />
        </p>
      </section>

      <section className="lesson-section" id="aggregate-profit-eps">
        <p className="section-kicker">52 · Aggregate Profit → EPS</p>
        <h2>总利润属于一组公司；每股收益属于当期股数下的一份索取权，发行、回购与进入退出会改变两者之间的分母。</h2>
        <div className="equation-card">
          <span>从总额到每股的简化桥</span>
          <div>EPS<sub>t</sub> = earnings attributable to common<sub>t</sub> / weighted-average diluted shares<sub>t</sub></div>
          <p>分子须处理非控股、优先权及 if-converted 等相应调整；分母是期间加权并按适用反稀释规则处理的潜在普通股。真实报表应服从相应会计准则，指数每股增长还受成分变更、权重和聚合方法影响。</p>
        </div>
        <p>
          企业为融资扩张而增发，资产与总利润可以上升，但若新增利润不足以补偿新增股数，原股东 EPS 下降；低价回购可提高每股索取，昂贵回购或借债回购却可能毁损长期价值。宏观增长由新企业和新增资本推动时，社会总产出与总利润增长不保证归属于旧股东。股票的对象从来不是“经济总额”，而是特定资本结构中一股剩余索取权。<Cite n={41} /><Cite n={126} /><Cite n={127} />
        </p>
      </section>

      <section className="lesson-section" id="productivity-capture-rents">
        <p className="section-kicker">53 · Productivity Capture 与 Economic Rents</p>
        <h2>生产率提高扩大可分配价值，但谁获得收益取决于竞争、议价、知识产权与进入壁垒。</h2>
        <p>
          新技术让每单位投入产出更多，社会层面的实际收入潜力上升；在完全竞争和自由进入下，成本下降可能主要通过低价转给消费者或更高实际工资转给劳动者，先行企业的超额利润被模仿侵蚀。若企业拥有专利、网络效应、稀缺数据、品牌或规模壁垒，生产率收益可能较久留在利润和企业价值中。供应商、平台、劳动者、政府与消费者的议价位置又会重新分配这部分 surplus。<Cite n={55} /><Cite n={69} /><Cite n={80} /><Cite n={89} /><Cite n={90} /><Cite n={91} />
        </p>
        <div className="precision-note"><span>TFP growth ≠ shareholder alpha</span><p>宏观 TFP 是条件残差；经济租金是超过使要素留在当前用途所需回报的剩余；股票 alpha 还要求市场价格没有充分反映可持续租金。三者必须分别测量，不能沿一个“技术进步”标签直接等号连接。</p></div>
      </section>

      <section className="lesson-section" id="expected-growth-price-paid">
        <p className="section-kicker">54 · Expected Growth 与 Price Paid</p>
        <h2>好增长只有超出价格所含条件预期，且现金流效应胜过折现率效应，才倾向带来正意外回报。</h2>
        <div className="equation-card">
          <span>价格与回报的方向性分解</span>
          <div>P<sub>t</sub> = E<sub>t</sub>[Σ<sub>j≥1</sub> M<sub>t,t+j</sub>CF<sub>t+j</sub>]</div>
          <div>unexpected return ≈ cash-flow news − discount-rate news</div>
          <p>第一式中 M 是随机折现因子，CF 是股东现金流；第二式是 Campbell–Shiller 风格的方向性现值新闻分解。两类 news 必须相对同一事前信息集，并在可比对数现值单位中表达。</p>
        </div>
        <p>
          经济增长很高但早已被预期，公布时不会再创造同幅价格变化；增长超调查一致预期也不等于超出价格所含的完整信息，因为价格可能吸收更及时的私人或市场信息。更强增长还可能提高实际利率、政策路径或风险补偿，压低给定现金流的现值。反过来，低增长若“没有担心的那么差”或伴随折现率下降，股票可上涨。因此水准、调查 surprise、市场 news 与 realized return 是四个不同对象。<Cite n={41} /><Cite n={105} /><Cite n={106} /><Cite n={107} /><Cite n={108} />
        </p>
      </section>

      <section className="lesson-section" id="shareholder-return-decomposition">
        <p className="section-kicker">55 · Shareholder-return Decomposition</p>
        <h2>长期股东结果要同时看起始估值、基本面增长、分配、稀释与估值变化；GDP 只可能进入其中部分基本面。</h2>
        <div className="equation-card">
          <span>有限持有期的精确总回报</span>
          <div>1 + R<sub>0,T</sub> = W<sub>T</sub>/P<sub>0</sub></div>
          <p>W<sub>T</sub> 是以 P<sub>0</sub> 买入一股并按既定规则再投资全部分配后，在 T 时点的终值。实际计算应使用相容的 total-return index。教学近似可把年化回报拆成起始收益率、每股基本面增长与估值倍数变化，但大变化和跨期交互不能简单相加。</p>
        </div>
        <p>
          宏观实际增长可能经国内销量、生产率或利润份额进入公司总利润；随后还要经过上市覆盖、海外暴露、资本开支、债权与税、股本变化，才成为每股现金流。投资者支付的起始倍数决定这些现金流对应多高的预期门槛，终点倍数又受利率与风险溢价影响。于是长期回报研究若只回归 GDP growth，遗漏的不是一个“小控制变量”，而是从经济生产到一股索取权的整套所有权与定价桥。<Cite n={41} /><Cite n={105} /><Cite n={106} /><Cite n={126} /><Cite n={127} />
        </p>
      </section>

      <section className="lesson-section" id="cross-country-evidence">
        <p className="section-kicker">56 · Cross-country Evidence</p>
        <h2>历史上经济增长与股票回报弱相关或负相关，是一项需要解释的样本事实，不是反向结构定律。</h2>
        <p>
          跨国研究曾报告每人 GDP 增长与实际股票回报在长样本中并不正相关，候选解释包括高增长由新企业和新资本获得、既有股东被稀释、起始估值过高、利润份额变化、跨国公司地理错配以及 measurement timing。后续研究对国家选择、起止年份、幸存者偏差、可投资性、通胀和估值控制的处理会改变估计。即便历史相关为负，也不能推出一次 GDP 公布应令股票下跌，更不能推出更低增长提高社会福利。<Cite n={105} /><Cite n={106} /><Cite n={126} /><Cite n={127} />
        </p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="三种增长股票问题的 estimand 区分，可横向滚动">
          <table className="concept-table">
            <caption>不要把三个问题混成一个系数</caption>
            <thead><tr><th scope="col">设计</th><th scope="col">典型 estimand</th><th scope="col">主要威胁</th></tr></thead>
            <tbody>
              <tr><th scope="row">跨国长期面板</th><td>长期增长差与长期实际股东回报差</td><td>估值、制度、样本进入、幸存与地理覆盖</td></tr>
              <tr><th scope="row">单国时间序列</th><td>增长状态对未来回报或盈利的条件预测</td><td>持久状态、样本小、结构变化与反向定价</td></tr>
              <tr><th scope="row">公告事件窗口</th><td>相对事前信息集的增长新闻价格反应</td><td>预期代理、同步新闻、时钟、政策与折现率通道</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="information-clock">
        <p className="section-kicker">57 · Information Clock</p>
        <h2>经济活动发生、统计机构参考、首次发布、公众看到与研究者取得数据的时间不同；因果顺序必须逐一保存。</h2>
        <div className="equation-card">
          <span>五个不可压缩的时间戳</span>
          <div>referenceAt ≤ releaseAt ≤ publicAt ≤ observedAt；　vintageAt 标记你实际使用的版本</div>
          <p>referenceAt 是被测活动期间，releaseAt 是官方发布安排，publicAt 是信息可交易时点，observedAt 是数据管线取得时点，vintageAt 是所用历史快照。时区、节假日、embargo 与修订可使不等号并非简单同日。</p>
        </div>
        <p>
          一季度 GDP 初值在季度结束后发布，价格在此前已吸收月度数据与预期；把一季度收益与后来公布的一季度 GDP 同期回归，会把信息形成与活动期间混在一起。事件研究须冻结公告前信息集、预期代理、精确发布日期和窗口内其他新闻；预测研究则只能使用当时已经 public 且管线可取得的 vintage。宏观 surprise 的完整定价留给 3.23，本节只建立不泄漏的时钟契约。<Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="vintage-revision">
        <p className="section-kicker">58 · Vintage 与 Revision</p>
        <h2>初值是当时可得资料下的估计，修订值是后来更完整资料与方法下的新估计；两者回答不同研究问题。</h2>
        <p>
          季度 GDP 初值大量依赖月度样本、外推与缺失项假设，随后月度资料、年度账户、经济普查、季调重估、基期和方法变更会改写当前期乃至完整历史。最新 vintage 适合研究统计机构目前认为发生了什么；real-time vintage 才适合重建决策者和市场当时知道什么。FRED 默认展示最新修订历史，不能仅把今天下载的整条序列向后 lag 一期就称为“实时数据”；应使用 ALFRED、RTDSM 或 API 的 real-time 参数保存 vintage。<Cite n={9} /><Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={46} /><Cite n={47} /><Cite n={48} />
        </p>
        <div className="precision-note"><span>截至 2026-08-31 的时点边界</span><p>BEA 2026 annual update 尚未发布，计划日期为 9 月 30 日，不能把未来修订写成已知历史；IMF 2026 年 7 月 WEO Update 不是新的完整 WEO database，完整数据库仍为 2026 年 4 月版本。任何课程快照都应把 accessedAt 与 release/vintage 写入证据账本。<Cite n={12} /><Cite n={23} /></p></div>
      </section>

      <section className="lesson-section" id="growth-identification-ladder">
        <p className="section-kicker">59 · Identification Ladder</p>
        <h2>从账户恒等到股价因果，证据强度必须逐级上升；漂亮相关图不能跨过缺失的中间桥。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="增长传导的六级识别阶梯，可横向滚动">
          <table className="concept-table">
            <caption>每一级只支持相应强度的陈述</caption>
            <thead><tr><th scope="col">级别</th><th scope="col">你真正拥有的证据</th><th scope="col">可以说什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">1 · Identity</th><td>GDP 三面、增加值与支出账户闭合</td><td>定义与记账关系，不是冲击因果</td></tr>
              <tr><th scope="row">2 · Measurement</th><td>同口径量、价格、频率、修订和覆盖</td><td>某对象怎样变化及误差边界</td></tr>
              <tr><th scope="row">3 · Exposure</th><td>投入产出、进口、行业—公司与地理映射</td><td>哪些主体更可能受影响</td></tr>
              <tr><th scope="row">4 · Mechanism</th><td>价格/数量、成本、利润、股本与折现率中间变量</td><td>传导路径与可断裂位置</td></tr>
              <tr><th scope="row">5 · Quasi-experiment</th><td>可信 surprise、外部变化、异质暴露与反事实</td><td>有边界的条件因果效应</td></tr>
              <tr><th scope="row">6 · Transport</th><td>跨时期、国家和状态的复现及结构稳定检验</td><td>在哪些条件下可外推</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最实用的证伪方式是 chain-break：若声称国内增长经公司现金流推高指数，则高国内收入暴露公司应比纯海外暴露公司反应更强；若折现率通道主导，利率敏感度和久期应解释横截面；若只在最新修订 GDP 上成立、实时 vintage 消失，原结论可能来自前视；若行业需求增长却没有销量、收入或利润中间响应，链条应在股票之前被拒绝。识别不是为故事加一个显著性星号，而是让每一箭头都有可能失败。<Cite n={41} /><Cite n={49} /><Cite n={105} /><Cite n={106} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">60 · Interactive Measurement-to-Profit Lab</p>
        <h2>先在冻结数字下辨认对象、单位与时钟，再判断增长穿过企业和估值边界后还能否保留方向。</h2>
        <p>
          十题分为两种模式。Mode A 不考宏观预测，而是检查增加值、进口校正、名义—实际分解、季度年化和链式非可加性；Mode B 再检查统计翘尾、GDP/GDI 双重信号、增长核算残差、经营杠杆和 GDP—股票断链。每题提交前记录置信度，首次答案永久保留在本题版本的本地记录中；答错后可以重做，但高置信错误应优先复盘，因为它暴露的是错误 world model，而不是记忆遗漏。
        </p>
        <RealGrowthLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道无脚本孪生题更换数字与表面情境，检验你能否迁移机制，而不是背下互动答案。</h2>
        <div className="understanding-checks">
          {realGrowthScenarios.map((scenario, index) => (
            <details key={scenario.id}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>复算：</b>{scenario.staticTwin.answer}</p>
              <p className="impact-source-links"><b>依据：</b>{' '}{scenario.staticSourceIds.map((id) => <Cite key={`${scenario.id}:${id}`} n={id} />)}</p>
            </details>
          ))}
        </div>
        <p>
          完成标准不是“看懂答案”，而是在展开前写出对象、公式、单位、频率和至少一个失效边界。若某题只能凭选项措辞作答，回到它的 revisit 单元并用自己的数字再造一题；只有数值和情境改变后仍能复算，知识才从识别变成生成。
        </p>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks、Glossary 与 Evidence Passport</p>
        <h2>十四道检查重建完整因果链，十八个术语固定对象；Evidence Passport 则阻止账户事实、模型条件和因果证据互相冒充。</h2>
        <div className="understanding-checks">
          <details><summary>01 · 为什么三家企业销售额相加会重复计算，而增加值相加不会？</summary><p>后续销售额已经包含上游中间品价值；每家增加值只取 gross output 减本期中间投入。全链增加值之和等于最终产品价值，但只在同一生产边界、期间与估价口径下成立。</p></details>
          <details><summary>02 · C+I+G+X−M 中的 −M 为什么不是“进口对 GDP 的因果效应为负一”？</summary><p>M 用来剔除已进入其他支出项的境外生产，是来源校正。进口冲击还会改变价格、替代、国内中间品、投资与汇率，边际效应必须另行识别。</p></details>
          <details><summary>03 · 名义增长 6%、匹配价格指数增长 2%，为何实际增长不是精确 4%？</summary><p>精确数量比为 1.06/1.02，因此增长约 3.92%；6−2 是 log 或小变化的一阶近似。价格指数还必须覆盖同一产出边界，CPI 不能随手替代 GDP deflator。</p></details>
          <details><summary>04 · QoQ 1%、SAAR 4.06% 与 YoY 3.06% 能同时为真吗？</summary><p>能。三者分别比较上一季、把当季速度复合四次、比较四季前，窗口不同。SAAR 不是未来四季预测，YoY 也可能掩盖最新动量转折。</p></details>
          <details><summary>05 · 为什么 Fisher chained-dollar 分项不能在非参考期硬加？</summary><p>各分项用相邻期权重独立链结后再缩放，聚合指数不是分项缩放水平的算术和。份额用现价，增长贡献用官方 contribution 或合规指数公式。</p></details>
          <details><summary>06 · GDP 与 GDI 公布值不同，哪一个是真值？</summary><p>概念上两者测量同一生产收入；实际值来自不同不完美资料。差异不是某部门少报的直接证据，平均也不保证真值；应保留两者和各自 vintage。</p></details>
          <details><summary>07 · 增长核算的 TFP 残差为什么不能直接叫技术进步？</summary><p>残差以生产函数、规模报酬、收入份额、资本与劳动服务测量为条件，还可混入利用率、无形资本、加成、重配和误差。技术是候选来源，不是由减法识别的唯一原因。</p></details>
          <details><summary>08 · 一元最终需求怎样转为境内增加值？</summary><p>先经投入产出网络形成直接与间接毛产出，再用境内增加值系数剔除中间品重复和进口含量。冻结技术系数的 Leontief 结果是条件模拟，不是政策乘数。</p></details>
          <details><summary>09 · 实际行业产出增长为何不能直接当公司收入增长？</summary><p>公司跨行业、跨地域并以名义会计收入报告；还要加入市场份额、有效价格、组合、汇率、并购与会计范围。行业 establishment 与公司 legal entity 也不是同一分类单元。</p></details>
          <details><summary>10 · 经营杠杆何时失去直观解释？</summary><p>局部 DOL 冻结价格、单位变动成本、固定成本和组合；利润接近零时数值爆大，π=0 时无定义，亏损时传统利润增长率与符号通常失去直觉。</p></details>
          <details><summary>11 · 经济总利润增长为何不保证 EPS 增长？</summary><p>增长可能属于非上市或新公司；对现有发行人还要处理少数股东、债务、税、资本开支与加权稀释股数。增发可让总利润上升而原股东每股收益下降。</p></details>
          <details><summary>12 · 正 GDP surprise 为何不能直接推出正股票回报？</summary><p>调查 surprise 不等于价格完整信息集中的 news；现金流映射受覆盖和利润弹性影响，增长还可提高实际利率或风险溢价。意外总回报要比较同一事前信息集下的现金流与折现率新闻。</p></details>
          <details><summary>13 · 最新修订 GDP 为什么会污染实时预测研究？</summary><p>后来资料和方法会改写历史，今天下载的旧日期数值包含当时不可得信息。必须保存 publicAt、observedAt 和 vintageAt，并从 ALFRED、RTDSM 或官方档案重建实时矩阵。</p></details>
          <details><summary>14 · 给“国内增长推高本国指数”写一个 chain-break 检验。</summary><p>比较高与低国内收入/生产暴露公司；若没有销量、收入、利润或每股现金流中间响应，而价格只随久期或利率敏感度变化，现金流链应被拒绝，折现率或共同新闻是更一致的候选机制。</p></details>
        </div>

        <div className="glossary-grid" aria-label="十八个实际增长核心术语">
          <article><b>Production boundary</b><p>国民账户决定哪些活动属于当期生产的概念边界；付款、资产转手和生产不是同义词。</p></article>
          <article><b>Economic territory</b><p>居民生产单位具有经济利益中心的地理范围；不是公司国籍或证券上市地。</p></article>
          <article><b>Gross output</b><p>生产单位在期间内产出的产品总值，包含以后作为中间投入被重复承载的价值。</p></article>
          <article><b>Intermediate input</b><p>在生产过程中被消耗或转换的货物与服务；固定资产的逐期使用通过资本消耗处理。</p></article>
          <article><b>Value added</b><p>gross output 减 intermediate inputs；避免供应链销售额重复计算的新增价值。</p></article>
          <article><b>GDP / GDI</b><p>境内生产的产品/支出侧与收入侧估计；概念相等，测量误差造成公布差异。</p></article>
          <article><b>Current price</b><p>按当期价格计值的名义量，同时包含价格、数量与构成变化。</p></article>
          <article><b>Volume measure</b><p>用相容指数方法剥离价格变化后的数量聚合；不是每项简单除 CPI。</p></article>
          <article><b>Fisher chain index</b><p>相邻期 Laspeyres 与 Paasche 指数的几何平均再跨期链结；增长可比，参考期外分项水平通常不可加。</p></article>
          <article><b>Statistical carry-over</b><p>上一年末水平相对全年平均的高低，对下一年度平均增长形成的算术继承；不是新增动量。</p></article>
          <article><b>Capital services</b><p>不同资产在期间内提供的生产性服务流，通常用 user cost 聚合；不等于账面资本存量。</p></article>
          <article><b>Labor services</b><p>按教育、经验等构成调整的工时投入；不等于就业人数。</p></article>
          <article><b>Labor productivity</b><p>实际产出与劳动投入之比；可因资本深化、TFP、重配或周期利用率变化。</p></article>
          <article><b>TFP residual</b><p>给定生产函数、投入服务和份额权重后未被解释的产出增长；不是纯技术的直接观测。</p></article>
          <article><b>Potential output</b><p>模型估计的可持续产出路径；不可直接观察，会随方法、数据和 vintage 修订。</p></article>
          <article><b>Domestic value-added content</b><p>最终需求经供应链后在本经济领土形成的增加值份额，区别于毛出口或最终销售额。</p></article>
          <article><b>Operating leverage</b><p>冻结其他条件下利润对销量的局部弹性；依利润基数和成本结构而变。</p></article>
          <article><b>Growth news</b><p>相对某个明确事前信息集的增长信息更新；不是增长水准，也不等同调查误差或股票回报。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="实际增长传导主张的 Evidence Passport，可横向滚动">
          <table className="concept-table">
            <caption>每条 GDP → company → equity 主张必须保存的最小字段</caption>
            <tbody>
              <tr><th scope="row">Claim / estimand</th><td>方向明确的局部机制句；population、unit、horizon、treatment 与 counterfactual</td></tr>
              <tr><th scope="row">National-account object</th><td>production boundary、geography、current/volume、gross/net、level/growth/contribution</td></tr>
              <tr><th scope="row">Clocks / vintage</th><td>referenceAt、releaseAt、publicAt、observedAt、vintageAt、时区与季调状态</td></tr>
              <tr><th scope="row">Exposure bridge</th><td>final demand、input-output、import content、industry-company concordance、production/customer geography</td></tr>
              <tr><th scope="row">Company bridge</th><td>volume、price、mix、FX、scope、variable/fixed costs、tax/debt/capex、diluted shares</td></tr>
              <tr><th scope="row">Valuation bridge</th><td>公告前信息集、cash-flow news、discount-rate news、initial valuation 与 total-return definition</td></tr>
              <tr><th scope="row">Inference</th><td>design、assumptions、alternatives、heterogeneous prediction、chain-break、revision robustness 与 transport boundary</td></tr>
              <tr><th scope="row">Evidence status</th><td>identity / official estimate / direct observation / inferred exposure / model-generated / causal estimate，并附稳定 URL 或 DOI</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces、Evidence Map 与 20 组阅读</p>
        <h2>3.01 输出一份可测量的实际活动状态和一张可被否证的公司传导图；价格形成、通胀、劳动力、央行与 surprise 各自从这里接走明确对象。</h2>
        <div className="interface-grid">
          <article><span>回到 Chapter 1</span><h3>Market Pricing</h3><p>本节给出 cash-flow 与 discount-rate news；Chapter 1 解释异质订单如何在流动性状态中形成实际成交价。</p></article>
          <article><span>连接 Chapter 2</span><h3>Participants</h3><p>相同增长状态会因资产负债表、授权、地理暴露和期限不同，改变不同主体的预期与订单。</p></article>
          <article><span>连接 3.02</span><h3>Inflation</h3><p>本节只把 value 与 volume 分开；价格怎样由工资、加成、供给与需求形成，留给下一单元。</p></article>
          <article><span>连接 3.03</span><h3>Labor Market</h3><p>本节把人数、工时和劳动构成当生产投入；失业、参与和工资形成不在此展开。</p></article>
          <article><span>连接 3.05</span><h3>Central Bank</h3><p>本节区分 actual 与 potential output；央行怎样读取缺口并形成反应函数，留给 3.05。</p></article>
          <article><span>连接 3.23</span><h3>Macro Surprise</h3><p>本节固定 reference/release/public/observed/vintage 时钟；预期代理和公告价格反应的完整识别留给 3.23。</p></article>
          <article><span>连接 Equity Fundamentals</span><h3>GDP → EPS → Return</h3><p>本节交付断裂地图；完整公司模型、自由现金流、资本结构和 DCF 需在股票基本面模块展开。</p></article>
          <article><span>连接 Chapter 7</span><h3>Research Design</h3><p>Evidence Passport 将复杂世界观压缩为局部 estimand、可观察中间变量、chain-break 与实时样本外检验。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="实际增长四层二十组阅读路径，可横向滚动">
          <table className="concept-table">
            <caption>页面下方列出 Core、Models、Evidence、Systems 各五个成对阅读单元</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">五个主题</th><th scope="col">完成标准</th></tr></thead>
            <tbody>
              <tr><th scope="row">Core</th><td>SNA 更新；美中编制；链式指数；季度时钟；宏观利润 → 股票</td><td>能定义对象、单位、频率、价格口径、修订和不可加性</td></tr>
              <tr><th scope="row">Models</th><td>增长模型 / 核算；人力资本 / 收敛；R&amp;D / 规模效应；创新 / 竞争；Domar / 非线性网络</td><td>能写假设、条件分解、状态转移和不可识别处</td></tr>
              <tr><th scope="row">Evidence</th><td>GDP / GDI；错配；高增长 ≠ 高生产率；GDP ≠ 股东回报；冲击后持久性</td><td>能区分测量改进、描述分解、准实验与资产定价 estimand</td></tr>
              <tr><th scope="row">Systems</th><td>行业增加值 / I–O；大企业 / 网络；全球价值链；实时数据；爱尔兰 / GNI*</td><td>能重建供应链、地理、信息集、所有权和指标边界</td></tr>
            </tbody>
          </table>
        </div>
        <div className="evidence-map" aria-label="3.01 逐项证据地图">
          <h3>层一｜统计标准、国家编制与实时数据</h3>
          <p>2008 SNA 定义基本生产和账户边界；2025 SNA 是已经国际通过但仍待各国实施的新标准，实施策略和 ESA 2030 准备都不等于某国已经切换。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} /></p>
          <p>美国 NIPA 的生产边界、发布轮次、链式物量和 GDP/GDI discrepancy 是四个相关但分开的对象；third estimate 仍会修订，chained-dollar components 也不因以货币表示就可以直接相加。<Cite n={6} /><Cite n={7} /><Cite n={8} /><Cite n={9} /></p>
          <p>美国历史 GDP 会因更完整资料、经济普查和方法改进而变化；截至本节的 2026-08-31 信息集，9 月 30 日年度更新尚未发布，自有数据和数据库资本化也仍是评估中的 2025-SNA 实验。<Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={13} /></p>
          <p>ESA 2010 的法律文本、方法手册与欧盟区域总量编制是三种证据；区域总量可包含估算与年度对齐，不是任一成员国数字的简单复制。<Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} /></p>
          <p>修订三角、benchmarking、temporal disaggregation、季调和 early estimates 需要专门的季度账户工具；欧盟资料的覆盖期、发布批次和成员国日程不是同一件事。<Cite n={18} /><Cite n={19} /><Cite n={20} /><Cite n={21} /></p>
          <p>IMF ANEA、WEO、OECD 国民账户和 World Bank 恒价美元/年增速库分别服务年度账户、估计预测、跨国转换和长期比较；它们不能混成一套无标记的实时季度数据。<Cite n={22} /><Cite n={23} /><Cite n={24} /><Cite n={25} /><Cite n={26} /><Cite n={27} /></p>
          <p>中国当前公开核算体系与 2008 SNA 基本衔接；2026–2030 年不变价核算的固定基期为 2025 年，价格缩减和物量外推不能改名为 BEA Fisher chain。<Cite n={28} /><Cite n={29} /><Cite n={30} /></p>
          <p>中国年度初步核算、最终核实、常规修订和经济普查基准修订属于不同层次；2023 年名义水平的一次上修不证明历史数据总是低估，也不意味实质增速同幅修订。<Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /></p>
          <p>ALFRED、FRED API 与 Philadelphia Fed RTDSM 共同说明 observation date 不等于 realtime/vintage date；只保存今日最新历史值会在伪实时研究中泄漏未来修订。<Cite n={35} /><Cite n={36} /><Cite n={37} /></p>
          <p>CBO 用增长核算与分项潜在投入构造潜在产出。<Cite n={38} /> OECD 的方案结合 Cobb–Douglas、效率趋势、NAIRU 与 Kalman filtering。<Cite n={39} /> European Commission 的 production-function 方法则显式包含 NAWRU。<Cite n={40} /> 三者的共性只是：都在特定模型与信息集下构造不可直接观测的状态，并受端点和 vintage 影响；不应把三套工具箱伪合并为同一方法。<Cite n={38} /><Cite n={39} /><Cite n={40} /></p>

          <h3>层二｜测量推断、修订与潜在状态</h3>
          <p>NIPA corporate profits 是为当期生产与收入核算构造的宏观量，包含存货计价和资本消耗调整；它不是 GAAP/IFRS 净利润、EPS 或自由现金流的替代值。<Cite n={6} /><Cite n={41} /></p>
          <p>PPP 用于空间价格比较，superlative indexes 为某些物量指数提供理论基础；两者依赖轮次、权重与指数设计，都不是市场汇率或短期增长信号。<Cite n={42} /><Cite n={43} /><Cite n={44} /></p>
          <p>人均 GDP 不包含完整福利；消费、闲暇、寿命、分配、经济安全和可持续性可改变社会评价，但这些选择也不会自动产生一个无争议的单一替代标量。<Cite n={45} /><Cite n={114} /><Cite n={115} /><Cite n={116} /></p>
          <p>宏观修订可能包含新信息，也可能重新分配早期测量噪声；GDP 与 GDI 的相对信息量是特定美国样本与 vintage 中的经验结果，不是一个永久排名。<Cite n={46} /><Cite n={47} /><Cite n={48} /><Cite n={49} /></p>
          <p>potential output、output gap、trend growth 与 r-star 可在 state-space 框架中联合推断，但它们依赖模型结构和信息集，实时估计可因趋势端点与后续修订大幅变化。<Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={53} /></p>

          <h3>层三｜增长模型、生产率与异质企业</h3>
          <p>Solow 累积模型、增长核算、知识外部性、人力资本与 R&amp;D 模型给出不同机制；理论中的 A、实测 residual、教育年限和研发支出不能彼此互换。<Cite n={54} /><Cite n={55} /><Cite n={56} /><Cite n={57} /><Cite n={58} /></p>
          <p>creative destruction、scale-effect 限定、conditional convergence 与 social infrastructure 是四类不同命题；它们分别依赖市场结构、ideas-production、稳态条件和制度识别，不能压缩成“创新或制度越多，增长必然越高”。<Cite n={59} /><Cite n={60} /><Cite n={61} /><Cite n={62} /><Cite n={63} /></p>
          <p>资本/劳动服务、投入质量、中间投入、Penn World Table 与企业微观证据共同说明 TFP 是条件残差；规模报酬、竞争定价、份额和测量选择必须显式报告。<Cite n={64} /><Cite n={65} /><Cite n={66} /><Cite n={67} /><Cite n={68} /><Cite n={69} /></p>
          <p>misallocation 反事实与 allocation/selection 分解依赖 CES、markup、质量、proxy 和跨国可比性；revenue-product dispersion 与规模—生产率 covariance 不是已识别的政策扭曲因果。<Cite n={70} /><Cite n={71} /><Cite n={72} /><Cite n={73} /></p>
          <p>entry、exit、survivor growth 与 plant life cycle 可以分解企业集合如何变化，却不会把退出自动命名为低效淘汰，也不能仅凭年龄曲线归因某项监管。<Cite n={74} /><Cite n={75} /><Cite n={76} /><Cite n={81} /></p>
          <p>ideas productivity、productivity J-curve、technology diffusion 与 competition–innovation 倒 U 都表明创新有时滞、互补投入和状态依赖；没有一个关系是可对所有技术与市场复制的结构常数。<Cite n={77} /><Cite n={78} /><Cite n={79} /><Cite n={80} /></p>
          <p>厚尾大企业与不对称投入产出网络是两种不同的微观冲击聚合机制；大冲击下的替代、高阶项和一般均衡反馈还会超出一阶 Domar 近似，因此 size、centrality 与 causal shock 不能混同。<Cite n={82} /><Cite n={83} /><Cite n={84} /><Cite n={85} /><Cite n={86} /></p>

          <h3>层四｜份额、周期、全球链条与资产价格</h3>
          <p>劳动、资本与利润份额依赖自雇调整、gross/net、sector scope、required return 与无形资本处理；经营剩余或 residual share 不会因改名就成为上市公司会计利润。<Cite n={87} /><Cite n={88} /><Cite n={89} /><Cite n={90} /></p>
          <p>markup、规模报酬和投入利用率都会改变 measured productivity；生产函数法与工具变量结果是识别设计的产物，不是直接观测的市场势力或技术。<Cite n={91} /><Cite n={92} /><Cite n={93} /></p>
          <p>库存投资、business-cycle comovement 与 demand/supply disturbances 必须分别处理会计贡献、lead–lag 与结构识别；SVAR 长期限制是一项识别假设，不是冲击身份的直接观察。<Cite n={94} /><Cite n={95} /><Cite n={96} /><Cite n={100} /></p>
          <p>gross exports 可拆成国内增加值、国外增加值和重复计算；出口额的交易地理不会单独回答 GDP、居民收入、企业利润或上市地归属。<Cite n={97} /><Cite n={98} /><Cite n={99} /></p>
          <p>危机与负面冲击后的产出损失可能持久，先前信贷潮会改变衰退深度与恢复路径；历史平均和 Markov statistical regime 都不是某次衰退的确定时间表或结构身份。<Cite n={101} /><Cite n={102} /><Cite n={103} /><Cite n={104} /></p>
          <p>股票价格由 expected cash flows 与 discount rates 共同决定，意外回报的 news 分解依赖信息集与线性近似；企业高销售/盈利增长的持久性也有限，因此 GDP 增长不是股价恒等式。<Cite n={105} /><Cite n={106} /><Cite n={107} /><Cite n={108} /><Cite n={109} /></p>
          <p>股价、消费者信心和信用利差可能领先经济活动，但 VAR news 与预测力不自动识别真实技术基本面或外生金融供给。<Cite n={110} /><Cite n={111} /><Cite n={112} /></p>
          <p>wealth-income 是存量/流量关系，GDP 是生产流量，welfare dashboard 则引入分配、生活质量与可持续性；资产价格变化和规范性权重会让三类比较分离。<Cite n={113} /><Cite n={114} /><Cite n={115} /><Cite n={116} /></p>

          <h3>层五｜操作手册、边界案例与股东断链</h3>
          <p>OECD 生产率/资本手册与 BLS 当前技术说明区分 productive stock、wealth stock、capital services、hours、labor composition 与 TFP；具体序列仍依赖资产寿命、权重与初步投入估计。<Cite n={117} /><Cite n={118} /><Cite n={119} /></p>
          <p>GDP-by-industry、I–O requirements、rebasing 和季环比折年是四种操作工具：gross output 会重复计算，I–O coefficient 不是因果财政乘数，annualized rate 不是预测；批发零售还要使用 trade-margin 产出例外，不能把 turnover 当 gross output。<Cite n={120} /><Cite n={121} /><Cite n={122} /><Cite n={123} /><Cite n={129} /></p>
          <p>爱尔兰 2015 年的 26.3% real-GDP 发布值、后续对资产负债表迁移/IP/contract manufacturing 的机制解释，以及 GNI* 扣减项是三层证据；它们说明 territorial GDP 可以准确回答自己的问题，却不一定是 domestic activity 或福利的最佳单一标题。<Cite n={124} /><Cite n={125} /><Cite n={130} /></p>
          <p>跨国长期证据不支持 GDP growth 与 existing-share return 的机械正相关；new firms、net issuance 与 dilution 是从总量增长到既有股东的关键断链，但历史负相关和约 2% dilution 都不是结构常数。<Cite n={126} /><Cite n={127} /></p>
          <p>OpenStax 管理会计章节直接支持“给定销售水平的 DOL = contribution margin / net operating income”；这条局部桥依赖售价、单位变动成本、固定成本与销售组合冻结，不能把宏观增长率直接放大成 EPS。<Cite n={128} /></p>
          <p>IAS 1 说明 trade discounts 与 volume rebates 反映在 revenue 中，并以费用功能法和示例损益表给出 revenue、cost of sales 与 gross profit 的会计列示桥；IAS 2 则说明 cost of sales 可吸收已售存货成本、未分摊生产间接费用与异常生产成本。因此促销折让压低 P 而非推高 c，会计毛利也不能被无条件解释为价格减经济学边际成本。<Cite n={131} /><Cite n={132} /></p>
        </div>
        <p>
          本节的最小复述应是：<b>实际增长先是给定生产边界、经济领土、期间与价格体系下，境内新增价值之数量的变化；它由劳动服务、资本服务、生产率与资源重配共同生成，并通过最终需求、投入产出和进口含量分布到行业。行业活动只有经过公司业务与地理边界、价格/数量/组合/汇率、成本和增加值分配，才形成公司利润；利润还须经过债税、资本开支、股本和上市覆盖才成为每股现金流。股票价格只对相对事前信息集的现金流与折现率新闻反应。因此 GDP 水准、增长率、调查 surprise、盈利增长和股东回报既相连又不相等；可靠研究必须保存对象、时钟、vintage、暴露、中间变量、反事实与断链证据。</b>
        </p>
      </section>
    </>
  );
}

export const lesson301: LessonRecord = {
  slug: '3-01',
  id: '3.01',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Real Growth：从实际产出、生产率到企业盈利与股票回报的断裂地图',
  subtitle: '先严格测量经济领土内新增价值的数量变化，再沿投入、生产率、供应链、公司边界、成本、每股与估值解释增长怎样进入市场，以及为什么经常断开',
  readingTime: '核心首读约 85–90 分钟；完整正文含逐式复算约 180–225 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习 25–35，理解检查与术语 25–35，建议分三次完成；参考文献与延伸阅读不计',
  prerequisite: '无；建议按需调用 T01–T06，尤其是增长率、复利、比率、回归与资产负债表；与 3.02、3.03、3.05、3.23 只建立接口',
  updatedAt: '2026-09-01',
  revision: '3.01-r6',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.01-r6',
      summary:
        '独立复核 64 个机制单元、132 条来源、36 个 claim-level Evidence Map 证据簇与全部引用落点，逐式检查国民账户边界、增长核算、投入产出网络、GDP→公司收入→会计毛利→EPS→回报的断裂链，并复算互动和静态练习；IAS 1／IAS 2 的净收入、销售成本与毛利口径直接核验通过，冻结哈希、类型、规范、生产构建、HTTP 与结构不变量全部一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.01-r6',
      summary:
        '独立复核零背景入口、六阶段路线、公式后的白话解释、反例与边界、64 节认知递进、10 道互动题、10 道静态孪生、14 道检查、18 个术语及四层各五组阅读；会计毛利桥已清楚区分净实现价格、平均会计销售成本与经济学边际成本，学习记录、ARIA、焦点、无脚本、移动与打印边界的源码和成品审计无缺陷，冻结哈希与运行检查一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-21', label: '2.21 Heterogeneous Agents → Endogenous Dynamics' },
  next: { slug: '3-02', label: '3.02 Inflation' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、先修与路线' },
    { id: 'flow-level-growth', label: 'Level / Flow / Growth' },
    { id: 'production-boundary', label: 'Production Boundary' },
    { id: 'final-intermediate', label: 'Final / Intermediate' },
    { id: 'value-added', label: 'Value Added' },
    { id: 'expenditure-identity', label: 'Expenditure Identity' },
    { id: 'production-approach', label: 'Production Approach' },
    { id: 'income-approach', label: 'Income Approach' },
    { id: 'gdp-gdi', label: 'GDP / GDI' },
    { id: 'gross-net', label: 'Gross / Net' },
    { id: 'domestic-national', label: 'Domestic / National' },
    { id: 'current-volume', label: 'Current Price / Volume' },
    { id: 'double-deflation', label: 'Double Deflation' },
    { id: 'fisher-chain', label: 'Fisher Chain Index' },
    { id: 'growth-frequency', label: 'Frequency / Annualization' },
    { id: 'per-capita', label: 'Aggregate / Per Capita' },
    { id: 'comparable-window', label: 'Comparable Window' },
    { id: 'inventory-investment', label: 'Inventory Investment' },
    { id: 'welfare-boundary', label: 'Welfare Boundary' },
    { id: 'production-function', label: 'Production Function' },
    { id: 'hours-worked', label: 'Hours Worked' },
    { id: 'labor-composition', label: 'Labor Composition' },
    { id: 'capital-accumulation', label: 'Capital Accumulation' },
    { id: 'capital-services', label: 'Capital Services' },
    { id: 'labor-productivity', label: 'Labor Productivity' },
    { id: 'capital-deepening', label: 'Capital Deepening' },
    { id: 'tfp-residual', label: 'TFP / MFP Residual' },
    { id: 'growth-accounting', label: 'Growth Accounting' },
    { id: 'factor-share-assumptions', label: 'Factor-share Assumptions' },
    { id: 'actual-potential-output', label: 'Actual / Potential Output' },
    { id: 'innovation-frontier', label: 'Innovation Frontier' },
    { id: 'diffusion-adoption', label: 'Diffusion / Adoption' },
    { id: 'within-firm-productivity', label: 'Within-firm Productivity' },
    { id: 'productivity-reallocation', label: 'Reallocation' },
    { id: 'entry-exit', label: 'Entry / Exit' },
    { id: 'catch-up-convergence', label: 'Catch-up / Convergence' },
    { id: 'final-demand-industry', label: 'Final Demand → Industry' },
    { id: 'gross-output-gdp', label: 'Gross Output / GDP' },
    { id: 'import-content', label: 'Import Content' },
    { id: 'consumption-composition', label: 'Consumption Composition' },
    { id: 'investment-two-sides', label: 'Investment Two Sides' },
    { id: 'government-purchase-transfer', label: 'Purchase / Transfer' },
    { id: 'exports-production-location', label: 'Exports / Location' },
    { id: 'industry-company-concordance', label: 'Industry / Company' },
    { id: 'real-output-nominal-revenue', label: 'Real Output / Revenue' },
    { id: 'revenue-gross-profit', label: 'Revenue / Gross Profit' },
    { id: 'value-added-distribution', label: 'Value-added Distribution' },
    { id: 'operating-leverage', label: 'Operating Leverage' },
    { id: 'national-account-profit', label: 'Macro / Reported Profit' },
    { id: 'economy-listed-coverage', label: 'Economy / Listed Coverage' },
    { id: 'geographic-mismatch', label: 'Geographic Mismatch' },
    { id: 'aggregate-profit-eps', label: 'Aggregate Profit / EPS' },
    { id: 'productivity-capture-rents', label: 'Productivity Capture' },
    { id: 'expected-growth-price-paid', label: 'Expected Growth / Price' },
    { id: 'shareholder-return-decomposition', label: 'Shareholder Return' },
    { id: 'cross-country-evidence', label: 'Cross-country Evidence' },
    { id: 'information-clock', label: 'Information Clock' },
    { id: 'vintage-revision', label: 'Vintage / Revision' },
    { id: 'growth-identification-ladder', label: 'Identification Ladder' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'active-practice', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson301Content,
  references: lesson301References,
  readingList: lesson301ReadingList,
};
