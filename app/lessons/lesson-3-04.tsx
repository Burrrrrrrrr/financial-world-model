import InflationExpectationsLab from '../components/InflationExpectationsLab';
import InflationExpectationsTransmissionChart from '../components/InflationExpectationsTransmissionChart';
import { inflationExpectationsScenarios } from '../components/inflationExpectationsScenarios';
import { lesson304ReadingList, lesson304References } from './lesson-3-04-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a aria-label={'参考文献 ' + n} className="citation-mark" href={'#ref-' + n}>[{n}]</a>;
}

function Lesson304Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>通胀预期不是一句“大家觉得物价会涨”，而是特定主体对特定价格对象和期限形成的主观分布；它只有穿过可行动的合同或选择边际，才可能成为现实机制。</h2>
        <p>
          预期本身不可直接观察。问卷记录受访者对问题的回答，债券和衍生品记录承担名义与实际现金流风险所需的价格，模型再把多种代理压成潜变量。这三类数字都能提供证据，却没有一个天然等于“社会真正相信的未来通胀”。要使一句预期主张可检验，至少要写清谁在预期、预测哪个指数或生活成本总体、覆盖哪段时间、在什么政策和能源路径条件下、报告点值还是完整概率分布，以及作答时可以看到哪一版信息。<Cite n={73} /><Cite n={74} /><Cite n={103} />
        </p>
        <div className="causal-chain" aria-label="通胀预期从对象定义到反馈的完整链条" role="list">
          <div role="listitem"><span>01</span><b>Object</b><p>主体、指数、期限与条件被固定。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Measure</b><p>调查、市场或模型带噪观测。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Update</b><p>信息、注意与经验改变分布。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Anchor</b><p>长期分布对新闻形成映射。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Action</b><p>合同和跨期选择吸收信念。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Feedback</b><p>实现值、沟通和价格成为新信号。</p></div>
        </div>
        <p>
          这条链的关键不是“预期会不会自我实现”，而是每一段在什么条件下成立。信号可能没有被注意；回答可能改变而行为不变；家庭可能受收入与信用约束；企业可能没有重设机会或定价权；政策可信度可能阻止短期冲击外推到长期；市场价格又可能只反映风险和流动性变化。预期与实现通胀还会被共同冲击同时推动，因此二者同向不能单独证明 belief→inflation。严谨结论应是条件命题：当信念改变了合同或选择，而且协调、融资、竞争与政策环境允许传导时，预期才可能放大或延长通胀；反之回路会在中途断裂。<Cite n={72} /><Cite n={89} /><Cite n={92} /><Cite n={99} />
        </p>
        <InflationExpectationsTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>本节拥有“预期怎样被定义、测量、更新、聚合和判断锚定”；实际通胀、政策反应函数和完整资产定价留给相邻单元。</h2>
        <div className="learning-objectives">
          <span>六层路线 · 从对象语法到实时识别</span>
          <ol>
            <li><b>对象与测量（00–16）：</b>主体、指数、期限、分布、vintage，以及家庭、专家、企业、央行、市场和模型六种代理。</li>
            <li><b>检验与更新（17–34）：</b>误差、修正、评分、FI-RE、adaptive、sticky/noisy information、注意、学习、显著性与聚合。</li>
            <li><b>锚定状态（35–42）：</b>期限结构、水平、尾部、分歧、新闻敏感性、可信度、制度变化与反馈稳定性。</li>
            <li><b>行为和沟通（43–59）：</b>价格与工资合同、indexation、实际率、家庭和企业选择、政策沟通、RCT、发布 surprise 与资产新闻。</li>
            <li><b>主动迁移（60–62）：</b>十道互动、十道静态孪生、十四道理解检查和十八个术语。</li>
            <li><b>证据审计（63）：</b>八个章节接口、实时 Evidence Passport、127 条来源和二十组分层阅读。</li>
          </ol>
        </div>
        <p>
          硬先修为 3.02；建议按需调用 T03、T05、T08，并回看 3.03 的工资合同时钟。3.02 拥有 realized inflation、成本—加成与价格形成；3.03 拥有劳动状态、议价和工资分布；3.05 才拥有央行目标函数、反应函数与工具；3.07–3.08 拥有完整收益率曲线、期限溢价和实际利率资产定价；3.23 拥有一般宏观 surprise；Chapter 6 把这里的通胀实例泛化为一般信念和注意机制；Chapter 7 才完成识别设计。本节只交付这些后续章节所需的、带对象和时钟的预期状态。<Cite n={109} /><Cite n={111} /><Cite n={119} />
        </p>
      </section>

      <section className="lesson-section" id="expectation-object">
        <p className="section-kicker">02 · Expectation Object</p>
        <h2>一个完整预期对象不是数字，而是“主体 × 价格对象 × 总体 × 期限 × 条件 × 统计量 × 信息 vintage”的有序组合。</h2>
        <div className="equation-card">
          <span>Expectation passport</span>
          <div>E = (i, X, G, [t+a,t+b], C, φ, ℐ<sub>i,t</sub>)</div>
          <p>i 是主体；X 是 CPI、PCE、HICP、prices in general、own price 或 unit cost；G 是地区/总体；[t+a,t+b] 是窗口；C 是条件；φ 是均值、中位数、概率或另一 functional；ℐ 是当时信息集。</p>
        </div>
        <p>
          “居民预计通胀 4%”仍然未定义：Michigan 的 prices in general 与 Fed 的 PCE 目标不是同一指数；企业的单位成本和销售价格也不是总体 CPI；日本 Tankan 的 general-prices 预期为年率，而 output-price 预期可按相对当前水平的累计变化表达。对象错配会把主体真实回答改写成研究者想研究的变量。<Cite n={2} /><Cite n={21} /><Cite n={23} /><Cite n={30} /><Cite n={109} />
        </p>
        <div className="precision-note"><span>最小数据契约</span><p>任何图表标题都应能补全这七个字段。若其中一个未知，正确做法是标记 unavailable 或 proxy，而不是用“通胀预期”把缺失藏起来。</p></div>
      </section>

      <section className="lesson-section" id="horizon-window">
        <p className="section-kicker">03 · Horizon / Window</p>
        <h2>“一年、三年、五年”可能是从今天起的累计变化、未来某一日历年、若干年平均，也可能是位于远方的一年窗口。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="预期期限窗口比较，可横向滚动">
          <table className="concept-table">
            <caption>以 2026-06 为 forecast origin；名称相同不代表窗口相同</caption>
            <thead><tr><th scope="col">写法</th><th scope="col">示例窗口</th><th scope="col">不能替代什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Next 12 months</th><td>2026-06→2027-06</td><td>2027 calendar-year average</td></tr>
              <tr><th scope="row">SCE three-year ahead</th><td>2028-06→2029-06，即 +24→+36 月</td><td>从今天起三年累计或前三年平均</td></tr>
              <tr><th scope="row">SCE five-year ahead</th><td>2030-06→2031-06，即 +48→+60 月</td><td>从今天起五年累计</td></tr>
              <tr><th scope="row">5–10 year average</th><td>远期五年区间的平均率</td><td>精确的 five-year spot 或 CPI forecast</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          纽约联储 SCE 的 three-year-ahead 和 five-year-ahead 是对应远期时点的一年价格变化，不是三年或五年累计。专业预测问卷还会混合 current-quarter annualized、Q4/Q4、calendar-year average 与 long-run average；市场曲线则可能给 spot horizon 或 forward window。比较前必须先把起点、终点、长度和年化规则展开。<Cite n={6} /><Cite n={36} /><Cite n={37} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="level-rate">
        <p className="section-kicker">04 · Level / Rate</p>
        <h2>预期价格水平、累计涨幅和年化通胀率是三个不同对象；单位转换不能靠口头近似。</h2>
        <div className="equation-card">
          <span>从指数水平到累计与年化变化</span>
          <div>Π<sup>X</sup><sub>t,t+h</sub> = P<sup>X</sup><sub>t+h</sub>/P<sup>X</sup><sub>t</sub> − 1　；　π<sup>ann</sup><sub>t,t+h</sub> = (P<sub>t+h</sub>/P<sub>t</sub>)<sup>12/h</sup> − 1</div>
          <p>P 是指数点；Π 是 h 个月累计比例；第二式只把同一累计变化按复利年化。年化不是预测模型，h 必须以月计且大于 0。</p>
        </div>
        <p>
          若未来三年累计价格上涨 9%，简单除以三得到 3% 只是近似，精确复利年率约为 (1.09)<sup>1/3</sup>−1。非线性还意味着先对未来价格水平取期望再年化，通常不等于先对每种状态年化再取期望。点值和密度必须声明具体 functional，单位也应分别写作指数点、累计百分比或 %/year。<Cite n={37} /><Cite n={57} /><Cite n={73} />
        </p>
      </section>

      <section className="lesson-section" id="conditional-unconditional">
        <p className="section-kicker">05 · Conditional / Unconditional Forecast</p>
        <h2>预测路径常以利率、汇率、能源价格或“适当政策”为条件；条件改变时，数字变化不必表示预测者改了结构判断。</h2>
        <p>
          央行 staff projection 会冻结技术假设或构造替代情景；FOMC SEP 中每位参与者使用自己认为适当的政策路径；企业也可能回答“若成本与需求按当前计划发展”。这类数字是 E[π | C,ℐ]，不是对所有未来政策路径积分后的无条件分布，更不是行动承诺。若两次预测采用不同油价、汇率或利率假设，revision 同时包含新数据与条件变化。<Cite n={44} /><Cite n={45} /><Cite n={118} />
        </p>
        <div className="myth-grid">
          <article><span>Forecast</span><h3>给定假设下最可能路径</h3><p>回答“在这些条件下会发生什么”，可以随输入变化。</p></article>
          <article><span>Scenario</span><h3>一致但未必最可能的条件组合</h3><p>用来暴露非线性和尾部，不给发生概率也可以成立。</p></article>
          <article><span>Commitment</span><h3>对未来行动施加约束的政策表述</h3><p>它是否可信取决于状态依赖、制度和退出条款，不由 forecast 图表自动产生。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="point-density-functionals">
        <p className="section-kicker">06 · Point Forecast / Subjective Density</p>
        <h2>一个点预测未必是受访者主观分布的均值；概率箱和完整密度才能同时表达中心、偏度、尾部与不确定性。</h2>
        <div className="equation-card">
          <span>主观分布及其 functional</span>
          <div>F<sup>X</sup><sub>i,t</sub>(z;h)=Pr<sub>i</sub>(π<sup>X</sup><sub>t,t+h</sub>≤z | ℐ<sub>i,t</sub>)；　m<sub>i,t</sub>=E<sub>i</sub>[π]；　v<sub>i,t</sub>=Var<sub>i</sub>(π)</div>
          <p>F 是从 0 到 1 的累计概率；m 的单位是 %/year，标准差是 pp，方差是 pp²。中位数满足 F(median)≈0.5，众数是密度峰值。</p>
        </div>
        <p>
          右偏分布中，均值常高于中位数和众数；同一个受访者给出的单点也可能是“最可能值”或经四舍五入的焦点答案。专业预测者的点值与其概率分布中心并不总是一致，市场 option 则给风险中性而非物理密度。只有原问卷或估计程序明确规定，研究者才能把 point 改名为 mean。<Cite n={54} /><Cite n={73} /><Cite n={75} /><Cite n={77} />
        </p>
      </section>

      <section className="lesson-section" id="uncertainty-disagreement">
        <p className="section-kicker">07 · Individual Uncertainty / Disagreement</p>
        <h2>个体不确定性是同一个人主观分布的宽度，分歧是不同人的中心预测离散；二者可以独立变化。</h2>
        <div className="equation-card">
          <span>全方差分解</span>
          <div>Var(π)=E<sub>i</sub>[Var<sub>i</sub>(π)] + Var<sub>i</sub>(E<sub>i</sub>[π])</div>
          <p>第一项是平均 within-person variance，第二项是 between-person disagreement。只有共同对象、期限、权重和总体下才可相加；方差单位为 pp²。</p>
        </div>
        <p>
          所有人都可能对中心值 3% 达成一致，却各自把 1% 到 7% 赋予很大概率，此时 disagreement 低而 uncertainty 高；反之每个人都很确定，但一半相信 2%、另一半相信 5%，则 uncertainty 低而 disagreement 高。平均个人标准差也不能直接代替平均个人方差。锚定诊断若只看横截面 IQR，会漏掉每个人尾部同时扩大的状态。<Cite n={75} /><Cite n={78} /><Cite n={79} /><Cite n={80} />
        </p>
      </section>

      <section className="lesson-section" id="information-set-vintage">
        <p className="section-kicker">08 · Information Set / Vintage</p>
        <h2>预期只能相对于作答时可得信息评价；实时研究必须保存观察、作答、发布、修订、政策 cutoff、模型运行和市场事件等多只时钟。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="通胀预期实时研究时钟，可横向滚动">
          <table className="concept-table">
            <caption>至少保存以下时钟；同一数据库中的“日期”不等于同一个信息边界</caption>
            <thead><tr><th scope="col">时钟</th><th scope="col">回答的问题</th><th scope="col">常见泄漏</th></tr></thead>
            <tbody>
              <tr><th scope="row">Survey / respondent</th><td>谁在何时作答、fieldwork 跨多久？</td><td>用整月末数据解释月初回答</td></tr>
              <tr><th scope="row">Consensus cutoff / release</th><td>市场预期何时冻结、初值何时公布？</td><td>用事后调查构造 surprise</td></tr>
              <tr><th scope="row">First / revised vintage</th><td>参与者先看到哪版实现值？</td><td>用修订值回测实时误差</td></tr>
              <tr><th scope="row">Policy information cutoff</th><td>报告或投影纳入数据到何日？</td><td>用报告发布日期之后数据解释报告</td></tr>
              <tr><th scope="row">Market window / timezone</th><td>价格变化属于哪个事件？</td><td>混合上午 CPI 与下午央行声明</td></tr>
              <tr><th scope="row">Model run / access date</th><td>潜变量何时用哪版参数估计？</td><td>把回溯修订曲线当实时可见</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          例如 ECB CES July 2026 的 fieldwork 为 7 月 2–27 日、发布为 8 月 21 日、本站核对日为 9 月 1 日；ATSIX 在 8 月 28 日更新，却可能重估整段历史；Fed 七月 Monetary Policy Report 又使用更早的数据 cutoff。把这些数列按“2026 年夏天”粗略合并，会把未来信息交给过去参与者。<Cite n={12} /><Cite n={56} /><Cite n={58} /><Cite n={110} />
        </p>
      </section>

      <section className="lesson-section" id="household-surveys">
        <p className="section-kicker">09 · Household Surveys</p>
        <h2>家庭调查最接近日常信念，却对 wording、样本、模式、数值能力、显著价格和极端回答尤其敏感。</h2>
        <p>
          Michigan 测量 prices in general，并在 2024 年开始从电话向 web/mixed-mode 过渡；长端中位数可能相近，而均值和右尾更易受模式影响。纽约联储 SCE 使用面板和概率问题，并能区分一、三、五年远期窗口；ECB CES 还提供跨国权重与 2% winsorised mean 等口径。三者都叫 household expectations，但对象、期限、response mode、聚合统计和样本维持机制不同。<Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={6} /><Cite n={10} /><Cite n={11} />
        </p>
        <p>
          英国 IAS 的在线断点、日本公众调查的定性/定量分栏、加拿大 CSCE 的 online/phone fieldwork 以及欧盟定性 balance 再次说明：代表性并不只由样本量决定，还取决于总体、非响应、权重、回答能力和问法。较高 household mean 可能含焦点值、右尾和个人生活成本经验；它不能无条件替代企业合同预期或央行目标一致性。<Cite n={13} /><Cite n={14} /><Cite n={15} /><Cite n={17} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="professional-forecasts">
        <p className="section-kicker">10 · Professional Forecasts</p>
        <h2>专业预测者通常拥有更密集的数据和模型，但并不共享一个模型、一个信息 cutoff 或一个定义，也不因此自动满足理性预期。</h2>
        <p>
          Philadelphia Fed SPF 同时提供点预测、概率箱、长期平均与个体记录，ECB SPF 也区分 HICP、core、增长和失业。专业样本较小且成员会进出；current-quarter annualized、calendar-year average 与 Q4/Q4 对数据冲击的敏感度不同。聚合 median 能降低极端值影响，却不能恢复内部密度；mean disagreement 也不等于平均 individual uncertainty。<Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} />
        </p>
        <p>
          Livingston、BoC Market Participants Survey 和 BoE External Forecasters 又覆盖不同频率与机构。专家可能异步更新、使用不同模型或对公开信号赋予不同权重；forecast-error/revision 证据本身正被用来检验信息刚性。因此“专家预测”是一类数据生成过程，不是无误差的 ground truth。<Cite n={41} /><Cite n={42} /><Cite n={43} /><Cite n={70} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="firm-expectations">
        <p className="section-kicker">11 · Firm Expectations</p>
        <h2>企业最直接决定价格、招聘和投资，但“企业通胀预期”必须拆成自身成本、售价、工资、总体 CPI/HICP 与目标认知。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="企业预期对象比较，可横向滚动">
          <table className="concept-table">
            <caption>同一家企业可能同时回答五种不同对象</caption>
            <thead><tr><th scope="col">调查</th><th scope="col">关键对象</th><th scope="col">不可改名为</th></tr></thead>
            <tbody>
              <tr><th scope="row">Atlanta BIE</th><td>Unit-cost growth、own price</td><td>美国 CPI</td></tr>
              <tr><th scope="row">BoE DMP</th><td>Own price、CPI、wage、employment</td><td>单一企业“通胀率”</td></tr>
              <tr><th scope="row">ECB SAFE</th><td>HICP 1/3/5y、selling price、finance</td><td>所有欧元区企业总体</td></tr>
              <tr><th scope="row">BoJ Tankan</th><td>General prices 年率、output prices 累计</td><td>同单位的两条期限结构</td></tr>
              <tr><th scope="row">Cleveland SoFIE</th><td>CPI 点值、密度、target knowledge</td><td>企业自身调价承诺</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          企业自身成本预期更接近 margin 和招聘边际，own-price 预期更接近计划售价，总体 CPI/HICP 则可能影响工资合同、名义利率和宏观需求判断。样本还会按地区、规模或融资需求选择；加拿大 BOS 约百家 judgment sample，SAFE 以 SMEs 为主，BOS 2026Q2 又更换了汇总指标。企业数据的优势是决策相关，代价是对象和总体更异质。<Cite n={21} /><Cite n={22} /><Cite n={23} /><Cite n={25} /><Cite n={27} /><Cite n={29} /><Cite n={33} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="central-bank-projections">
        <p className="section-kicker">12 · Central-bank Projections</p>
        <h2>央行投影是制度化的信息产品：它可能聚合模型、判断与条件假设，却既不是私人部门信念，也不是未来政策的无条件承诺。</h2>
        <p>
          FOMC SEP 聚合参与者各自在“适当政策”假设下的 PCE 投影；Eurosystem staff projection 使用明确技术假设和情景；BoJ Outlook、RBA SMP 与 BoC MPR 都带自己的数据 cutoff、决策者身份和风险表达。预测中位数、staff baseline、fan chart 与 policy path 不能互换，因为它们回答“谁”“在什么条件下”“以何种概率”三个不同问题。<Cite n={44} /><Cite n={45} /><Cite n={116} /><Cite n={118} /><Cite n={120} />
        </p>
        <div className="precision-note"><span>接口而非反应函数</span><p>本节只讨论投影如何改变公众信息集以及如何量测其 revision。央行怎样权衡目标、怎样从投影选择工具和路径，属于 3.05。</p></div>
      </section>

      <section className="lesson-section" id="market-instruments">
        <p className="section-kicker">13 · Market Instruments</p>
        <h2>Breakeven、inflation swap 和 inflation option 分别价格化不同现金流；它们是总补偿或风险中性分布，不是问卷信念的市场版。</h2>
        <p>
          TIPS principal 随 CPI-U 指数化并带指数滞后与到期通缩保护；nominal–TIPS yield spread 还受 duration、coupon、税、流动性和供需影响。Zero-coupon inflation swap 以合约定义的累计指数变化交换固定率，消除了部分现金债摩擦，却仍包含风险价格、抵押与交易对手条件。Caps/floors 进一步揭示 risk-neutral tails，但投资者的物理概率必须经 stochastic discount factor 才能连接。<Cite n={46} /><Cite n={48} /><Cite n={50} /><Cite n={53} /><Cite n={54} />
        </p>
        <p>
          市场代理的优势是高频、资金加权与期限丰富，缺点是同一价格同时清算 belief、risk tolerance、balance-sheet capacity 和 liquidity。问卷可以直接问 physical belief，却低频且有 wording/response error。二者分叉既可能是信念差异，也可能只是定价楔子改变，必须通过模型和第三类证据三角互证。
        </p>
      </section>

      <section className="lesson-section" id="compensation-pq">
        <p className="section-kicker">14 · Inflation Compensation / P versus Q</p>
        <h2>市场观察到的是风险调整后的 Q-measure 价格；要反推 P-measure 物理预期，必须显式建模风险、流动性与技术楔子。</h2>
        <div className="equation-card">
          <span>本节冻结的 breakeven 分解</span>
          <div>BE<sub>h</sub>=y<sup>N</sup><sub>h</sub>−y<sup>TIPS</sup><sub>h</sub>=E<sup>P</sup><sub>t</sub>π<sub>h</sub>+IRP<sub>h</sub>−LP<sup>TIPS</sup><sub>h</sub>+O<sub>h</sub></div>
          <p>正的 TIPS illiquidity premium 抬高 TIPS 实际收益率，因而压低 observed breakeven，所以式中为负号。所有项为年率；变化常以 bp 记录。不同论文若改定义，必须连同等式一起换。</p>
        </div>
        <p>
          风险厌恶投资者会为通胀与边际效用同向或反向的状态要求补偿，IRP 因而可正可负；流动性在压力期也会急变。若把 nominal 4.60%、TIPS 1.70%、IRP +0.40pp、LP +0.15pp 代入冻结式，则 BE=2.90%，E<sup>P</sup>π=2.65%，而不是 2.90%。这个分解依赖模型，正确报告应写“模型隐含物理预期”，不是“市场真实预期”。<Cite n={47} /><Cite n={49} /><Cite n={51} /><Cite n={52} /><Cite n={60} />
        </p>
      </section>

      <section className="lesson-section" id="model-extraction">
        <p className="section-kicker">15 · Model-based Extraction</p>
        <h2>状态空间、无套利和共同因子模型能把稀疏代理投影成连续期限结构，也会把参数选择、输入修订和实时滤波误差写进结果。</h2>
        <p>
          Cleveland model 联合市场、调查与宏观数据，ATSIX 用调查因子生成 3–120 月期限结构，CIE 提取多种指标的共同成分。输出通常是 latent state 或 fitted mean：它可能没有任何单一受访者直接使用的单位，也会因新增数据、参数重估和历史平滑而改写过去。实时使用须保存 input vintage、发布日期、run date、参数版本和 filtered/smoothed 标记。<Cite n={55} /><Cite n={56} /><Cite n={57} /><Cite n={58} /><Cite n={59} />
        </p>
        <div className="myth-grid">
          <article><span>Filtered</span><h3>只用 t 时点及以前信息估计状态</h3><p>更接近参与者实时可用信息，但噪声更大。</p></article>
          <article><span>Smoothed</span><h3>用未来数据重估过去状态</h3><p>适合历史描述，却不能直接用于实时事件或回测。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="triangulation">
        <p className="section-kicker">16 · Cross-measure Triangulation</p>
        <h2>不存在无条件支配其他指标的“最佳通胀预期”；正确做法是按问题选择主体，并用调查、市场与模型之间的楔子定位竞争解释。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="调查市场模型三角测量，可横向滚动">
          <table className="concept-table">
            <caption>代理分叉本身是诊断信息，不是立即平均掉的误差</caption>
            <thead><tr><th scope="col">代理</th><th scope="col">最接近的问题</th><th scope="col">主要楔子</th></tr></thead>
            <tbody>
              <tr><th scope="row">Household survey</th><td>家庭如何理解未来生活成本并可能行动？</td><td>wording、numeracy、salience、非响应</td></tr>
              <tr><th scope="row">Firm survey</th><td>价格/成本信念怎样进入经营计划？</td><td>own-price 与 aggregate index、样本选择</td></tr>
              <tr><th scope="row">Professional survey</th><td>高信息主体怎样预测指定宏观对象？</td><td>小样本、模型异质、异步更新</td></tr>
              <tr><th scope="row">Market price</th><td>资金愿以什么价格承担名义/实际风险？</td><td>risk、liquidity、technical、Q-measure</td></tr>
              <tr><th scope="row">Latent model</th><td>怎样把不完整代理映射成可比较曲线？</td><td>模型、参数、输入和 revision risk</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          若家庭短期预期上升而企业长期预期、专家密度和风险调整市场曲线稳定，候选解释包括显著食品能源价格、主体不同信息集或暂时 uncertainty；若长期 survey、options tails 和 news-sensitivity 同时恶化，去锚证据更强。三角测量不是把所有指标等权平均，而是利用各自可观察误差结构进行交叉约束。<Cite n={74} /><Cite n={98} /><Cite n={103} />
        </p>
      </section>

      <section className="lesson-section" id="forecast-error-revision">
        <p className="section-kicker">17 · Forecast Error / Revision</p>
        <h2>Revision 比较同一目标的两次预测，forecast error 比较旧预测与随后实现值；两者符号、时间和数据 vintage 都必须冻结。</h2>
        <div className="equation-card">
          <span>实时定义</span>
          <div>FR<sub>t</sub>=π̂<sub>t|T</sub>−π̂<sub>t−1|T</sub>；　FE<sub>T</sub>=π<sup>first</sup><sub>T</sub>−π̂<sub>t|T</sub></div>
          <p>两个预测必须指向同一 target T；实现值默认使用随后首次可得 release。FR 与 FE 的单位通常为 pp，符号分别是“新减旧”和“实现减预测”。</p>
        </div>
        <p>
          预测 2.4%→2.9%、首次实现 3.1%、后修 3.0% 时，revision=+0.5pp，real-time error=+0.2pp，revised error=+0.1pp。用后修值评估实时学习会把未来数据放入过去信息集。若 target、季调、年化或指数定义同时变更，简单差值还混入 measurement revision。<Cite n={35} /><Cite n={37} /><Cite n={70} /><Cite n={71} />
        </p>
      </section>

      <section className="lesson-section" id="calibration-scoring">
        <p className="section-kicker">18 · Calibration / Scoring</p>
        <h2>点预测应按误差损失评价，概率和密度预测还要检验 calibration、sharpness 与 proper scoring；“更接近实现值”不是唯一质量维度。</h2>
        <p>
          MAE 和 RMSE 的单位与预测对象相同，RMSE 对大误差更敏感；概率事件可用 Brier score，连续密度可用 log score 或 CRPS。Strictly proper scoring rule 的关键作用，是让预测者以报告真实主观概率分布来优化期望得分；但具体排序仍取决于评分规则、样本与目标。一个总给 50% 的预测可能校准却不够尖锐，一个极窄密度偶尔命中却长期过度自信。对问卷概率箱先拟合 density 还会引入分布假设，open-ended tails 的处理能显著改变 variance 与 log score。<Cite n={73} /><Cite n={75} /><Cite n={77} /><Cite n={78} /><Cite n={112} />
        </p>
        <div className="precision-note"><span>评分不等于机制识别</span><p>预测优于基准只证明某个损失函数下的信息价值；它不说明主体怎样获得信息，也不证明把该预测公布给公众会改善福利。</p></div>
      </section>

      <section className="lesson-section" id="full-information-re-benchmark">
        <p className="section-kicker">19 · Full-information Rational-expectations Benchmark</p>
        <h2>FI-RE 要求预测相对于指定模型和信息集在平均意义上不留下可系统利用的误差；它不等于完美预见，也不要求每个人给出相同数字。</h2>
        <p>
          理性预期基准将主观条件分布与模型蕴含的条件分布对齐。即使完全理性，未来创新仍不可预测，所以单次 error 可以很大；不同主体若拥有不同合法信息集，也可给出不同预测。所谓 full information 则额外假设相关公共信息被及时吸收，这与现实调查中的稀疏注意和发布时钟不同。FI-RE 的价值是提供可否证的正交条件，而不是把偏离者贴上心理标签。<Cite n={61} /><Cite n={63} /><Cite n={70} /><Cite n={72} />
        </p>
      </section>

      <section className="lesson-section" id="rationality-joint-hypothesis">
        <p className="section-kicker">20 · Rationality as a Joint Hypothesis</p>
        <h2>一项“拒绝理性预期”的检验同时依赖预测模型、主体信息集、损失函数、测量代理和实现值 vintage；拒绝的是组合，不是自动锁定某一种心理偏差。</h2>
        <p>
          若 forecast error 能被旧 revision 预测，可能是 sticky/noisy information，也可能是 target 不一致、问卷点值不是密度均值、实现值后修、主体使用非二次损失或遗漏了私人信息。若 household 与 professional forecasts 分叉，还可能源自不同价格对象、媒体传播和日常价格暴露。统计拒绝应随后设计能区分这些机制的新矩：例如个体更新时点、概率密度、信息 treatment 或实时自然实验。<Cite n={69} /><Cite n={70} /><Cite n={71} /><Cite n={77} /><Cite n={88} />
        </p>
        <div className="myth-grid">
          <article><span>成立的部分</span><h3>可预测误差否定某个冻结基准</h3><p>在对象、信息集和 vintage 正确时，正交条件失败是实质证据。</p></article>
          <article><span>需要修正</span><h3>失败不唯一命名行为机制</h3><p>还需区分不更新、带噪更新、注意选择、异质模型和测量误差。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="adaptive-extrapolative">
        <p className="section-kicker">21 · Adaptive / Extrapolative Expectations</p>
        <h2>适应性规则用过去预测误差修正未来，外推规则则把近期变化继续延伸；两者简单、可学习，却会在 regime change 时系统落后或过冲。</h2>
        <div className="equation-card">
          <span>固定增益的适应性更新</span>
          <div>e<sub>t</sub> = e<sub>t−1</sub> + g(π<sub>t−1</sub> − e<sub>t−1</sub>)，　0≤g≤1</div>
          <p>g 是对上一期误差的更新权重；g=0 永不更新，g=1 令下一期预期等于最近实现值。若再把近期通胀变化率延伸，就得到更强的 extrapolation。</p>
        </div>
        <p>
          规则不需要主体知道完整经济模型，也能在稳定环境中逐步逼近均值；当趋势突然改变时，低 g 产生持续不足反应，高 g 则更容易把暂时食品能源冲击外推。所谓 adaptive 不等于“愚蠢”：它可能是数据稀少、环境漂移或模型维护昂贵时的可行近似。判断需要比较样本外误差、regime stability 和主体实际信息成本。<Cite n={62} /><Cite n={83} /><Cite n={102} />
        </p>
      </section>

      <section className="lesson-section" id="sticky-information">
        <p className="section-kicker">22 · Sticky Information</p>
        <h2>Sticky information 的迟滞来自“何时更新”：一部分主体仍使用旧信息集，所以聚合预期是多代信息 vintage 的加权混合。</h2>
        <div className="equation-card">
          <span>每期更新 hazard 为 λ</span>
          <div>Ē<sub>t</sub>π = Σ<sub>j≥0</sub> λ(1−λ)<sup>j</sup>E<sup>F</sup><sub>t−j</sub>π</div>
          <p>λ 是每期比例而不是百分点；j 表示信息年龄。若 λ=.4，第一期 40% 更新，第二期累计更新为 .4+.6×.4=.64，而不是 80%。</p>
        </div>
        <p>
          当完整信息预期从 2% 跳到 4% 时，λ=.4 给出当期均值 2.8%，下一期 3.28%。个体层预测是离散 vintage 的簇，聚合均值却可平滑移动。这个特征能与所有人每期小幅更新的 noisy-information 模型区分，但现实问卷的访次、舍入和缺失也会制造看似离散的更新，因此需要个体面板和外部信息时钟。<Cite n={64} /><Cite n={70} /><Cite n={71} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="noisy-information">
        <p className="section-kicker">23 · Noisy Information</p>
        <h2>Noisy information 的迟滞来自“更新多少”：主体持续观察，却因为信号含噪而只把一部分 surprise 写进 posterior。</h2>
        <p>
          若真实状态不可直接观察，主体收到 y<sub>t</sub>=π<sub>t</sub>+ε<sub>t</sub>，最优滤波会按先验与信号相对精度分配权重。信号噪声越大，更新增益越小，forecast revision 越平滑；即使人人每期更新，聚合仍可能不足反应。与 sticky information 相比，noisy model 更容易产生连续的小 revision，而不是一批人完全停在旧 forecast 上。<Cite n={63} /><Cite n={67} /><Cite n={70} /><Cite n={71} />
        </p>
        <div className="precision-note"><span>共同结果，不同机制</span><p>聚合均值慢动不能区分 sticky 与 noisy。需观察个体 revision 是否零、信号精度变化时 gain 怎样变、以及相同公开新闻是否在不同主体间同步进入信息集。</p></div>
      </section>

      <section className="lesson-section" id="rational-inattention">
        <p className="section-kicker">24 · Rational Inattention</p>
        <h2>Rational inattention 把信号精度本身视为有成本的选择：主体将有限注意分配给最影响自身决策的状态，而不是均匀追踪所有宏观变量。</h2>
        <p>
          家庭可能在通胀低且稳定时几乎不追踪 CPI，却在食品能源涨幅跨过显著阈值后突然增加注意；企业更可能优先监测自身成本、需求和融资。信息容量约束下，低频更新或粗糙信号可以是最优资源配置，不意味着主体无法理解数字。与此同时，“最优不注意”是模型结论：若主体错误估计损失、信任低或使用错的因果模型，低准确度仍可能是偏差。<Cite n={65} /><Cite n={66} /><Cite n={104} /><Cite n={105} />
        </p>
        <p>
          注意状态还会改变宏观动态：供给冲击在低注意 regime 中可能较快消退，在高注意 regime 中却更容易被观察、外推并进入合同。阈值估计来自特定数据与模型，不是每个国家固定为同一通胀率；政策沟通既可能降低信息成本，也可能因提高 salience 而放大短期新闻。<Cite n={105} /><Cite n={106} />
        </p>
      </section>

      <section className="lesson-section" id="bayesian-learning">
        <p className="section-kicker">25 · Bayesian Learning</p>
        <h2>Bayesian update 按相对精度把先验与新信号合成 posterior；它澄清“更新多少”，却不保证先验、信号模型或主观精度判断正确。</h2>
        <div className="equation-card">
          <span>正态先验与独立正态信号</span>
          <div>K=v<sub>0</sub>/(v<sub>0</sub>+r)；　m<sub>1</sub>=m<sub>0</sub>+K(y−m<sub>0</sub>)；　v<sub>1</sub>=(1−K)v<sub>0</sub></div>
          <p>v₀ 是先验方差，r 是信号噪声方差，单位均为 pp²；K 无量纲。先验越不确定或信号越精确，K 越大。</p>
        </div>
        <p>
          先验均值 2%、方差 1pp²，信号 4%、噪声方差 3pp² 时，K=.25，posterior mean=2.5%，方差=.75pp²、SD≈.866pp。信号高于先验并不意味着“一半一半”；相对精度决定权重。调查实验可用随机信息观察 first stage 是否近似精度加权，但 demand effect、错误精度、信任和 treatment comprehension 都可能让更新偏离基准。<Cite n={83} /><Cite n={94} /><Cite n={96} />
        </p>
      </section>

      <section className="lesson-section" id="constant-gain">
        <p className="section-kicker">26 · Constant-gain Learning</p>
        <h2>当主体认为环境会漂移时，constant gain 永远给新数据固定权重；它比样本均值更快适应 regime change，也更容易追逐噪声。</h2>
        <div className="equation-card">
          <span>固定增益与冲击半衰期</span>
          <div>m<sub>t</sub>=m<sub>t−1</sub>+g(π<sub>t</sub>−m<sub>t−1</sub>)；　half-life=ln(.5)/ln(1−g)</div>
          <p>0&lt;g&lt;1 且每期等长；half-life 的单位是期。g=.2 时一次 surprise 的权重每期乘 .8，半衰期约 3.11 期。</p>
        </div>
        <p>
          递减增益把越来越长的历史当作同一稳定分布，最终对新信息反应很小；constant gain 则承认参数可能变动。经历效应可表现为不同年龄对历史样本使用不同衰减权重。观察到高 gain 可能是合理应对结构变化，也可能是 diagnostic overreaction；区分需要外部 regime evidence 和样本外预测，而不能只看更新幅度。<Cite n={82} /><Cite n={83} /><Cite n={84} /><Cite n={107} />
        </p>
      </section>

      <section className="lesson-section" id="diagnostic-expectations">
        <p className="section-kicker">27 · Diagnostic Expectations</p>
        <h2>Diagnostic expectations 不是简单“相信最新数字”，而是过度提高近期状态中最具代表性的变化权重，导致对某类新闻的系统过度反应。</h2>
        <p>
          若油价快速上涨使“高通胀”状态相对平常状态更有代表性，主体可能过度抬高该状态的主观概率；当新闻方向反转，预测又迅速修正。机制强调相对似然和 representativeness，而非固定线性外推。它可产生预测修正与随后误差的负相关，但相同符号也可能来自测量、regime reversal 或模型误设，所以 diagnostic 只是竞争解释。<Cite n={86} /><Cite n={87} />
        </p>
        <div className="myth-grid">
          <article><span>不足反应</span><h3>旧信息权重过高</h3><p>未来实现继续朝 revision 方向移动，旧 forecast 没有更新够。</p></article>
          <article><span>过度反应</span><h3>新信息或代表性变化权重过高</h3><p>未来实现反向纠正，revision 超过了可持续状态变化。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="under-over-reaction">
        <p className="section-kicker">28 · Underreaction / Overreaction</p>
        <h2>Forecast error 对 revision 的回归可以诊断信息反应方向，但系数只在冻结 target、vintage、信息集和模型假设后才有结构含义。</h2>
        <div className="equation-card">
          <span>教学诊断回归</span>
          <div>FE<sub>t+1</sub>=α+βFR<sub>t</sub>+ε<sub>t+1</sub></div>
          <p>按本节“实现减预测”的符号，β&gt;0 常与不足反应一致，β&lt;0 常与过度反应一致；FR 与 FE 都必须针对同一 target 并使用实时 vintage。</p>
        </div>
        <p>
          β&gt;0 说明在向上修正后，实际值仍平均高于新 forecast；但它也可能源自不同 forecasters 进出样本、forecast target 滚动、发布 revision 或遗漏私人信号。β&lt;0 可能是代表性过度反应，也可能是政策内生反应成功抵消了冲击。回归是联合假设检验，不能仅凭符号宣布心理机制。<Cite n={70} /><Cite n={71} /><Cite n={81} /><Cite n={87} />
        </p>
      </section>

      <section className="lesson-section" id="salient-prices">
        <p className="section-kicker">29 · Salient Prices</p>
        <h2>食品、汽油和经常购买品因观察频率与心理显著性更容易进入 household belief；个人经验价格不必按官方指数权重聚合。</h2>
        <p>
          官方 CPI 按代表性消费篮子加权，而个人每天看到的价格由自己的购买频率、地区、收入和交通方式决定。杂货价格暴露与预期差异相关，随机 wording 也显示“prices you pay”和“inflation”会激活不同参照。高频可见价格上涨可能提高总体预期，即使低频服务或耐用品价格稳定；反向亦然。<Cite n={76} /><Cite n={85} /><Cite n={94} />
        </p>
        <p>
          显著性机制解释 household 与 expert gap 的一部分，但不应变成万能故事。需要确认价格暴露在时间上先于 belief revision，并区分实际预算权重、关注频率、媒体报道和共同宏观冲击。近期研究还提示注意可能存在非线性阈值，因此相同油价变动在低通胀和高通胀 regime 中反应不同。<Cite n={104} /><Cite n={105} /><Cite n={106} />
        </p>
      </section>

      <section className="lesson-section" id="lifetime-experience">
        <p className="section-kicker">30 · Lifetime Experience</p>
        <h2>不同世代用自己经历过的通胀历史学习，因此同一时点面对相同新闻，也可能拥有不同先验、持久性判断和长期锚。</h2>
        <p>
          经历高通胀年代的群体会在更长时期内给较高历史通胀权重，年轻群体的样本更短、近期经历占比更大。该机制能生成 cohort disagreement，而无须假设某一代更不理性。它也说明长期均值接近目标可能只是近期低持久性经验的结果：若 regime 证据改变，所谓“表面锚定”可以迅速松动。<Cite n={84} /><Cite n={102} /><Cite n={107} />
        </p>
        <div className="precision-note"><span>年龄不是机制本身</span><p>年龄同时关联资产负债表、消费篮子、信息来源和数值能力。识别 experience effect 需要利用不同 cohort 面对同一时点和地区冲击，而不是把年龄系数直接命名为学习。</p></div>
      </section>

      <section className="lesson-section" id="numeracy-target-trust">
        <p className="section-kicker">31 · Numeracy / Target Knowledge / Trust</p>
        <h2>数值能力决定能否表达概率，目标知识提供参照点，信任决定是否把官方信息当作高精度信号；三者作用于不同环节。</h2>
        <p>
          Numeracy 较弱可产生焦点值、概率箱加总错误或 point/density 不一致；知道央行目标可把长期答案拉向共同参照；但若对机构能力或承诺缺乏信任，目标信息的主观精度仍可能很低。企业调查显示即使在通胀目标制度下，决策者也未必准确知道目标；随机沟通能改变部分家庭预期，却不保证影响持久或转成行为。<Cite n={7} /><Cite n={33} /><Cite n={34} /><Cite n={95} /><Cite n={97} />
        </p>
        <p>
          因而“没有向 2% 更新”至少有四种候选：没有看到信息、没理解问题、不信任信号、或认为自己的价格对象与目标指数不同。沟通设计应分别测量 exposure、comprehension、belief first stage 和 trust，而不能把所有非响应都叫 stubborn expectations。
        </p>
      </section>

      <section className="lesson-section" id="actor-information-sets">
        <p className="section-kicker">32 · Actor-specific Information Sets</p>
        <h2>家庭、企业、专家和市场参与者可以在各自信息与目标下同时“合理”，却对同一标题给出不同数字。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="不同主体信息集和决策边际，可横向滚动">
          <table className="concept-table">
            <caption>分歧先问对象和损失函数，再问谁对谁错</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">高权重信息</th><th scope="col">主要决策边际</th></tr></thead>
            <tbody>
              <tr><th scope="row">家庭</th><td>经常购买价格、收入、媒体与目标认知</td><td>消费、储蓄、债务、工资要求</td></tr>
              <tr><th scope="row">企业</th><td>订单、单位成本、竞争者、融资与工资</td><td>售价、库存、招聘与投资</td></tr>
              <tr><th scope="row">专家</th><td>宏观 release、模型、政策文件与 revisions</td><td>指定 loss 下的 forecast</td></tr>
              <tr><th scope="row">市场</th><td>全部公开新闻、仓位、抵押与流动性</td><td>风险调整后的边际价格</td></tr>
              <tr><th scope="row">央行</th><td>staff projection、调查、市场与监管信息</td><td>状态评估与政策沟通</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          主体差异不等于所有信念同样准确。正确比较是在同一 target 和可见信息下评价 forecast，并保留其决策损失。专家对 aggregate CPI 可能更准，企业对自身成本更有私人信息，家庭对个人生活成本更相关；把这些数字平均成代表性预期会消掉机制。<Cite n={24} /><Cite n={69} /><Cite n={86} /><Cite n={103} />
        </p>
      </section>

      <section className="lesson-section" id="higher-order-beliefs">
        <p className="section-kicker">33 · Higher-order Beliefs</p>
        <h2>企业不仅预测未来价格，还预测竞争者、工人、客户和央行会怎样相信与行动；这些“对他人信念的信念”决定协调强度。</h2>
        <p>
          若企业相信其他企业都将提价，即使自身成本信号微弱，也可能更愿意重设价格；工人对其他工资合同和央行容忍度的判断也会进入议价。公共信息同时改变 first-order belief 和对他人将如何更新的 higher-order belief，因此可能产生过度协调；私人信息则保留异质性。公共沟通的社会价值由预测准确性和协调外部性共同决定。<Cite n={67} /><Cite n={68} /><Cite n={86} />
        </p>
        <p>
          该机制不能由单一调查均值直接观察。需要战略问卷、对竞争者预期的提问、信息实验或网络数据。3.04 只保留通胀合同中的可观察实例；一般 common-knowledge 与 narrative 动态留给 Chapter 6。
        </p>
      </section>

      <section className="lesson-section" id="aggregation">
        <p className="section-kicker">34 · Aggregation</p>
        <h2>加权平均是统计汇总，不会自动生成一个拥有平均信息、平均约束和平均行为的“代表性主体”。</h2>
        <div className="equation-card">
          <span>加权中心与混合分布</span>
          <div>m̄<sub>t</sub>=Σ<sub>i</sub>ω<sub>i</sub>m<sub>i,t</sub>，　Σ<sub>i</sub>ω<sub>i</sub>=1</div>
          <p>ω 可是人口、企业、消费或市场权重；选择不同权重会改变 estimand。混合均值无法恢复个体 density、决策函数或网络位置。</p>
        </div>
        <p>
          当高负债家庭和高现金家庭对通胀都预期 3% 时，其消费响应仍可能方向相反；同样均值下，大型定价企业和小型 price taker 的宏观传导也不同。非线性行为意味着 E[f(m<sub>i</sub>,constraint<sub>i</sub>)] 通常不等于 f(E[m<sub>i</sub>],E[constraint<sub>i</sub>])。聚合必须保留分布、权重、主体约束和 reweighting 因素。<Cite n={11} /><Cite n={24} /><Cite n={79} /><Cite n={103} />
        </p>
      </section>

      <section className="lesson-section" id="anchoring-mapping">
        <p className="section-kicker">35 · Anchoring as a Mapping</p>
        <h2>锚定不是长期均值离目标有多近，而是长期主观分布在不同短期状态与新闻下仍映射到一个稳定区域。</h2>
        <p>
          至少要区分三维：<b>level anchoring</b> 看长期中心是否与制度目标或稳定区一致；<b>higher-moment anchoring</b> 看 uncertainty、偏度和极端尾部是否受控；<b>shock anchoring</b> 看短期 inflation surprise 是否显著改变长期分布。均值 2.1% 可能与 2% 目标接近，但若 P(π&gt;4%)、IQR 和长期预期的 news beta 同时上升，系统已经比均值暗示的更脆弱。<Cite n={54} /><Cite n={98} /><Cite n={99} /><Cite n={107} />
        </p>
        <div className="myth-grid">
          <article><span>Level</span><h3>长期中心在哪里</h3><p>比较指定指数和期限的均值/中位数与制度参照。</p></article>
          <article><span>Distribution</span><h3>尾部和宽度是否扩张</h3><p>观察个人 uncertainty、risk-neutral tails 与横截面 dispersion。</p></article>
          <article><span>Sensitivity</span><h3>短期新闻能否移动长端</h3><p>用战略 survey、日频数据或事件回归估计映射斜率。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="term-structure">
        <p className="section-kicker">36 · Expectation Term Structure</p>
        <h2>近端、远期一年和长期平均共同定位锚；只看一个五年数字会把近期压力、远期稳态与多年平均混在一起。</h2>
        <div className="equation-card">
          <span>连续复利零息率下的简化 forward average</span>
          <div>f<sub>a,b</sub>=(b z<sub>b</sub>−a z<sub>a</sub>)/(b−a)，　0&lt;a&lt;b</div>
          <p>z 是连续复利的年率，a、b 使用同一时间单位。离散复利、coupon instrument 或风险溢价存在时不能直接套用；survey forward window 则由问卷定义，不由此式创造。</p>
        </div>
        <p>
          近端预期可因能源和税收冲击上升，远期一年仍稳定；长期平均却会因包含近端而小幅上移。SCE 的 three-/five-year 是远期一年窗口，Michigan long run 是约 5–10 年 prices-in-general，ATSIX 是模型化连续期限结构，TIPS forwards 又是风险调整的市场补偿。将这些都命名为“5y5y”会制造虚假比较。<Cite n={2} /><Cite n={6} /><Cite n={47} /><Cite n={56} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="news-sensitivity">
        <p className="section-kicker">37 · News-sensitivity Beta</p>
        <h2>长端是否锚定，可以问它对短期 surprise 的边际反应有多大；但 beta 的单位、事件窗和内生政策反应决定解释。</h2>
        <div className="equation-card">
          <span>事件敏感度</span>
          <div>ΔE<sub>t</sub>π<sub>h</sub>=α<sub>h</sub>+β<sub>h</sub>Surprise<sub>t</sub>+ε<sub>t</sub></div>
          <p>若 surprise 以 pp 表示，β 是“远期预期 pp / surprise pp”；若 surprise 标准化，β 是“远期预期 pp / 1σ”。两种 beta 数值不可直接比较。</p>
        </div>
        <p>
          β 接近零与 shock anchoring 一致，却不是充分证明：预期指标可能低频、测量误差大，或样本期根本没有足够冲击；政策同时反应也可能抵消长端移动。战略问卷通过给受访者同一假设冲击来改善可比性，日频调查和市场事件则提高时间定位，但仍需区分风险、流动性和央行信息新闻。<Cite n={98} /><Cite n={100} /><Cite n={107} />
        </p>
      </section>

      <section className="lesson-section" id="tail-density-anchor">
        <p className="section-kicker">38 · Tail / Density Anchoring</p>
        <h2>均值可以稳定而右尾变厚：主体仍给目标附近最大概率，却开始为高通胀状态分配更多质量。</h2>
        <p>
          假设长期均值仅从 2.0% 升到 2.1%，但 P(π&gt;4%) 从 5% 升到 14%，IQR 从 .8pp 升到 1.6pp。Level 看似稳定，higher-moment anchoring 已显著变弱。Point survey 会漏掉这种变化，概率箱、个体 density 和 inflation options 能补充；options 观察的是 risk-neutral tail，还需分离风险价格。<Cite n={54} /><Cite n={75} /><Cite n={98} /><Cite n={101} />
        </p>
        <p>
          尾部上升也不等于高通胀成为最可能状态。必须分别报告中心、tail mass、density width 和 risk adjustment；对 open-ended bins 的分布拟合应做敏感性分析。把 5%→14% 写成“增加 9%”也不准确，正确是增加 9 percentage points，或相对增加 180%。
        </p>
      </section>

      <section className="lesson-section" id="disagreement-not-deanchor">
        <p className="section-kicker">39 · Disagreement ≠ De-anchoring</p>
        <h2>分歧扩大可能是去锚信号，也可能只是信息、暴露、模型或总体构成更异质；制度判断需要长期中心、尾部和新闻敏感度共同确认。</h2>
        <p>
          供给冲击发生后，能源密集企业与服务企业、债务人与储蓄者、年轻人与经历过高通胀的老人本来就会合理分歧。若各组长期均值仍围绕共同参照，个人 uncertainty 不升，且短期 surprise 不移动长端，分歧更像信息异质；若均值系统偏离、尾部增厚、信任下降和 news beta 上升同时出现，去锚解释才增强。<Cite n={79} /><Cite n={84} /><Cite n={98} /><Cite n={108} />
        </p>
        <div className="precision-note"><span>聚合构成警报</span><p>横截面 dispersion 还会因 respondent composition 变化。面板内变化、固定权重与分组重加权应优先于两个聚合 IQR 的直接比较。</p></div>
      </section>

      <section className="lesson-section" id="credibility">
        <p className="section-kicker">40 · Credibility</p>
        <h2>可信度不是“公众听说过目标”，而是制度、行动和结果共同使长期承诺在不同状态下仍被当作高精度信号。</h2>
        <p>
          一个数值目标提供焦点，但持续偏离且缺少解释会降低信号精度；行动与表述不一致、职责冲突或财政约束也会改变主观 regime 概率。反之，清楚的目标对象、可解释的中期策略、与状态一致的行动以及事后问责，可以让主体把短期供给冲击视为暂时，从而降低长期外推。可信度因此是动态资本，会由每次结果和沟通更新。<Cite n={95} /><Cite n={97} /><Cite n={99} /><Cite n={109} /><Cite n={111} />
        </p>
        <p>
          “目标知识低”与“可信度低”不能互换。有人可能不知道精确 2% 却相信价格会稳定；也有人知道目标却不信机构能实现。测量应同时问目标认知、预期分布、政策能力/意愿和条件反应，而不是用一个 yes/no trust 指标替代整套映射。
        </p>
      </section>

      <section className="lesson-section" id="regime-reanchoring">
        <p className="section-kicker">41 · Regime Change / Re-anchoring</p>
        <h2>制度变化会改变主体认为“冲击有多持久、政策会怎样反应”的模型；re-anchoring 是长期映射逐步重建，不是一则声明后的瞬时跳回。</h2>
        <p>
          新目标、目标区间、反应方式或治理安排提供 regime signal，但主体还会通过后续行动和实现结果学习。Fed 的目标是 2% PCE，ECB 是中期 2% HICP，BoE 是 2% CPI，RBA 是 2–3% CPI 区间并向中点回归；加拿大 2021 协议明确到 2026 年末。相同“2%”跨制度并非同一对象，政策有效期也属于信息集。<Cite n={109} /><Cite n={111} /><Cite n={113} /><Cite n={117} /><Cite n={119} />
        </p>
        <p>
          Re-anchoring 需要观察中长期 mean misalignment、disagreement、tails 和 news sensitivity 是否持续改善；企业 medium-term 指标可把中心偏离与分歧分开。若均值回落只是最近低通胀经验的机械权重，而制度冲击情景仍大幅移动长端，锚定可能只是表面稳定。<Cite n={107} /><Cite n={108} />
        </p>
      </section>

      <section className="lesson-section" id="feedback-stability">
        <p className="section-kicker">42 · Feedback Stability</p>
        <h2>预期反馈是否放大，不由更新增益或价格传导单独决定，而由整条回路的乘积和状态依赖共同决定。</h2>
        <div className="equation-card">
          <span>两段式教学反馈</span>
          <div>e<sub>t</sub>=gπ<sub>t−1</sub>；　π<sub>t</sub>=u<sub>t</sub>+γe<sub>t</sub>；　稳定条件 |γg|&lt;1</div>
          <p>g 是 realized inflation 到信念的增益，γ 是信念到当期通胀的行为传导。二者无量纲，e 与 π 用 pp。该式是局部教学桥，不是完整 NKPC。</p>
        </div>
        <p>
          g=1.2、γ=.6 时 loop gain=.72；一次 1pp 冲击产生 1、.72、.5184pp 的衰减路径，尽管 g&gt;1，系统仍因 γ 足够小而稳定。竞争、合同不重设、收入与信用约束、政策可信度都会压低 γ 或 g；广泛 indexation、协调提价和高注意 regime 则可能提高它们。若参数随通胀状态跳变，低通胀局部稳定也不能保证大冲击后仍稳定。<Cite n={64} /><Cite n={65} /><Cite n={83} /><Cite n={99} /><Cite n={105} />
        </p>
      </section>

      <section className="lesson-section" id="reset-price-interface">
        <p className="section-kicker">43 · Reset-price Interface</p>
        <h2>企业只有在重设价格时，才会把未来成本、需求和竞争者价格的信念压进当前报价；总体预期不是脱离企业状态的直接加价按钮。</h2>
        <div className="equation-card">
          <span>交错定价的最小接口</span>
          <div>p<sup>*</sup><sub>t</sub>=(1−αβ)Σ<sub>k≥0</sub>(αβ)<sup>k</sup>E<sub>t</sub>[p<sub>t+k</sub>+mc<sup>r</sup><sub>t+k</sub>]</div>
          <p>所有小写变量都是相对零通胀稳态的对数偏离：p* 是可重设企业价格的偏离，p 是总体价格水平的偏离，mcʳ 是实质边际成本的偏离；恒定的稳态 desired markup 已在这条线性化接口中归一化。α 是未来仍不能重设的概率，β 是贴现；若 desired markup 时变，还须把其预期路径加入右侧。完整价格聚合和通胀形成属于 3.02。</p>
        </div>
        <p>
          预期未来工资、能源或竞争者价格上升，会在合约保持时间更长、需求更强、替代品更少时提高最优 reset price；若企业是 price taker、库存积压或无法融资，belief 可能不转成实际加价。企业信息实验发现预期变化会影响价格、就业和投资，但效应来自特定样本、制度和 treatment，不支持“所有企业听到通胀信息都会同幅涨价”。<Cite n={66} /><Cite n={72} /><Cite n={92} /><Cite n={126} />
        </p>
      </section>

      <section className="lesson-section" id="wage-contract-interface">
        <p className="section-kicker">44 · Wage-contract Interface</p>
        <h2>工资合同把预期价格、生产率、外部选择与重谈概率共同写入名义工资；“工人预期更高通胀”只提供其中一个条件项。</h2>
        <p>
          工人关心实际工资和生活成本，企业关心生产率、需求和 total compensation。若合同即将重谈、劳动力市场紧、工资议价有协调机制，较高价格预期可能提高 wage demand；若工作风险上升、生产率下降或企业现金流受限，名义工资传导会减弱。合同期限和 indexation 条款还决定何时反应。3.03 已拥有议价、职位外部选择和工资分布，本节只把未来价格分布作为合同输入。<Cite n={19} /><Cite n={23} /><Cite n={72} /><Cite n={99} /><Cite n={127} />
        </p>
        <div className="precision-note"><span>工资预期也有对象</span><p>家庭对 prices in general 的回答不等于工会谈判使用的 CPI 条款；企业对 wage growth 的预测也不等于工人保留工资。接口必须保留合同覆盖、重设日期和参照指数。</p></div>
      </section>

      <section className="lesson-section" id="indexation-not-expectation">
        <p className="section-kicker">45 · Indexation Is Not Expectation</p>
        <h2>Indexation 按既定滞后指数机械调整现金流；主观预期是对未来状态的概率分布。两者都能制造惯性，却走不同的信息链。</h2>
        <div className="equation-card">
          <span>机械指数化规则</span>
          <div>X<sub>t</sub>=X<sub>t−1</sub>(1+λπ<sup>ref</sup><sub>t−ℓ</sub>)</div>
          <p>λ 是覆盖比例，ℓ 是滞后期，πref 是合同指定的已实现指数变化。规则可以在主体没有形成任何新预测时自动执行。</p>
        </div>
        <p>
          租金、工资、养老金或债券本金按过去 CPI 调整，会把 realized inflation 传入未来现金流；forward-looking clause 则可能使用预测值或政策目标。两者混合时，观察到合同上涨不能直接证明预期上升。TIPS 使用 CPI-U 指数化并有三个月 lag 与 deflation floor，正是机械规则和市场预期定价同时存在的例子。<Cite n={46} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="fisher-real-rate">
        <p className="section-kicker">46 · Fisher Relation / Ex-ante Real Rate</p>
        <h2>名义回报与预期通胀共同决定事前购买力回报；常见 i−Eπ 只是小率近似，随机通胀下还存在 Jensen 与风险协方差。</h2>
        <div className="equation-card">
          <span>点预测下的精确简化式</span>
          <div>r<sup>e</sup>=(1+i)/(1+E<sub>t</sub>π)−1　≈　i−E<sub>t</sub>π</div>
          <p>i、π 和 r 都用小数或一致百分比换算。若 π 是随机变量，严格对象含 E[(1+π)⁻¹]，不能只把 Eπ 放入非线性分母。</p>
        </div>
        <p>
          名义率 5%、预期通胀 2% 时，简化实际率约 2.9412%；预期升至 3.5% 而 i 不变，实际率约 1.4493%，下降 1.4919pp。该桥说明预期能改变跨期价格，却不锁定消费或资产需求，因为收入、风险、流动性、税和借贷约束也同时决定行为。完整 real-yield curve 和 term premium 留给 3.08。<Cite n={47} /><Cite n={51} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="consumption-durables">
        <p className="section-kicker">47 · Consumption / Durables</p>
        <h2>较高预期通胀可能使家庭提前购买，也可能因实际收入、财富、信用和滞胀担忧压低支出；净符号必须由主体约束与消费品类型决定。</h2>
        <p>
          在名义率不变、收入确定且可自由借贷的简化模型中，预期通胀上升压低事前实际率，降低等待的相对吸引力，耐用品尤其可能提前购买。但现实家庭可能同时预计实际工资下降、失业风险上升或政策收紧；高负债家庭、净储蓄者和流动性受限家庭的财富与融资渠道也不同。Readiness-to-spend 的横截面关系不是实际消费的随机因果证据。<Cite n={89} /><Cite n={90} /><Cite n={93} />
        </p>
        <p>
          随机信息实验能更接近 belief→behavior 的局部效应，却仍依赖 treatment 内容和宏观状态；关于 growth 和 inflation 的信息还可能一起改变收入预期。结论应写成“在该样本、该利率环境和该 first stage 下，某类消费边际如何响应”，而不是“预期通胀每升 1pp，消费必升 x%”。<Cite n={88} /><Cite n={91} /><Cite n={93} />
        </p>
      </section>

      <section className="lesson-section" id="saving-debt-portfolio">
        <p className="section-kicker">48 · Saving / Nominal Debt / Portfolio</p>
        <h2>预期通胀主要改变事前合约和资产配置，意外通胀还会重分配既有名义债务的实际价值；两种效应不能混为一谈。</h2>
        <p>
          债务签订前，借贷双方会把预期通胀、风险和流动性写入名义利率；若未来通胀恰如预期，实际回报按事前价格实现。合约签订后发生的意外通胀则降低固定名义债权的实际价值、从债权人向债务人转移购买力，除非合约被指数化或利率浮动。预期变化还会改变现金、名义债、TIPS、实物资产和股票的相对需求，但资产价格已同时包含风险溢价。<Cite n={46} /><Cite n={49} /><Cite n={50} /><Cite n={51} />
        </p>
        <div className="myth-grid">
          <article><span>Expected</span><h3>在新合约中被定价</h3><p>改变名义率、期限选择、indexation 和 hedge demand。</p></article>
          <article><span>Unexpected</span><h3>重估旧名义合约</h3><p>改变既有债务实际价值和主体净财富，不需先改变新合同。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="investment-inventory">
        <p className="section-kicker">49 · Investment / Inventory</p>
        <h2>企业投资和库存同时取决于未来售价、成本、需求、融资与不确定性；“预计通胀更高”没有不依赖对象的投资符号。</h2>
        <p>
          若企业预计 own price 和销量上升，而融资成本与单位成本相对稳定，提前采购和扩产可能有利；若预期来自投入成本冲击、需求萎缩或政策紧缩，margin 和净现值反而下降。库存还提供跨期套利，但有仓储、折旧和融资成本。BIE 的 unit-cost density、DMP 的 own-price/CPI/wage 组合和 SAFE 的融资状态能把这些通道分开。<Cite n={21} /><Cite n={22} /><Cite n={23} /><Cite n={25} />
        </p>
        <p>
          企业 RCT 表明信念变化可传到价格、就业和投资，但 treatment 同时改变对宏观状态的理解，且结果依国家、竞争和融资制度。识别应报告哪个 belief first stage 改变、哪一决策边际响应、传导多久，以及没有响应的企业受什么约束。<Cite n={88} /><Cite n={92} />
        </p>
      </section>

      <section className="lesson-section" id="mean-vs-uncertainty">
        <p className="section-kicker">50 · Mean versus Uncertainty</p>
        <h2>即使预期均值不变，主观分布变宽也会改变 precautionary saving、option value、融资条款和企业等待；只追踪中心会漏掉行为状态。</h2>
        <p>
          两个家庭都报 3% mean，其中一个把 2.5–3.5% 视为几乎确定，另一个给 −1% 与 8% 较大概率；后者面对 nominal debt、耐用品和工资合同时承担更大尾部风险。不可逆投资在不确定性上升时更有等待价值，流动性受限家庭则可能增加缓冲储蓄。宏观 uncertainty 的随机信息实验提示支出会响应 second moments，但 treatment 并非纯粹只移动 inflation density。<Cite n={75} /><Cite n={78} /><Cite n={91} />
        </p>
        <p>
          市场 options 能观察 risk-neutral tail，survey density 更接近 physical belief；两者同时扩张时仍需分开概率和风险价格。正确 dashboard 至少并列 mean/median、individual uncertainty、cross-sectional disagreement、tail mass 与 market-implied skew。<Cite n={54} /><Cite n={75} />
        </p>
      </section>

      <section className="lesson-section" id="self-fulfilling-breaks">
        <p className="section-kicker">51 · Self-fulfilling Feedback and Its Breaks</p>
        <h2>预期能够制造现实变化，只在“信念改变行动—行动改变总需求或成本—价格合同允许传导—新实现值再被学习”整条链闭合时成立。</h2>
        <div className="causal-chain" aria-label="通胀预期可能自我实现的条件链" role="list">
          <div role="listitem"><span>01</span><b>Signal</b><p>主体注意并理解新信息。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Belief</b><p>主观分布发生可测变化。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Decision</b><p>消费、工资、价格或库存改变。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Aggregation</b><p>足够主体和权重同向行动。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Outcome</b><p>需求/成本穿过合同进入价格。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Learning</b><p>实现值成为下一轮信号。</p></div>
        </div>
        <p>
          每一箭头都可能断裂：信息未被看到；问卷回答只是 experimenter demand；家庭收入下降；企业没有定价权；合同未到重设日；主体方向互相抵消；政策可信反应降低长期外推。于是“survey 与 inflation 同涨”不能证明自我实现，甚至信息 RCT 也只识别特定 treatment 对特定 margin 的局部效应。最强证据需要 belief first stage、真实行为、合约时钟和 aggregate outcome 依次可见。<Cite n={88} /><Cite n={89} /><Cite n={92} /><Cite n={93} /><Cite n={99} />
        </p>
      </section>

      <section className="lesson-section" id="target-communication">
        <p className="section-kicker">52 · Target Communication</p>
        <h2>数值目标通过提供共同参照和反应承诺影响长期分布，却不能直接控制每个主体的价格对象、信息精度和信任。</h2>
        <p>
          Fed 的 2% 对象是 PCE，ECB 是中期 HICP，BoE 是 CPI，RBA 使用 2–3% 区间；目标语法、双重使命和时间弹性不同。把 household prices-in-general 或 firm unit cost 与目标机械相减，会把对象差异误写为去锚。有效沟通应说明指数、对称性、中期含义、面对供给冲击的取舍以及如何问责，而不只是重复一个数字。<Cite n={109} /><Cite n={111} /><Cite n={113} /><Cite n={117} />
        </p>
        <p>
          随机沟通研究表明目标与政策信息可以移动家庭预期，但 first stage 存在异质性，持久性和行为传导有限。目标知识、理解和信任要分别测量；公布更多信息还会改变 higher-order beliefs 和 salience，未必只提高点预测准确度。<Cite n={68} /><Cite n={95} /><Cite n={97} />
        </p>
      </section>

      <section className="lesson-section" id="forecast-fanchart-scenario">
        <p className="section-kicker">53 · Forecast / Fan Chart / Scenario</p>
        <h2>Baseline forecast 表示在一组条件下的中心路径，fan chart 表示模型化不确定性，scenario 展示另一组一致条件；三者都不自动构成政策承诺。</h2>
        <p>
          Fan chart 的宽度可能来自历史误差、模型分布或判断性风险，颜色不必等于固定概率；asymmetric fan 也可能表达风险偏斜。Scenario 可以没有赋值概率，只问能源、工资或汇率路径改变时结果如何。Staff projection 与决策者个人投影还来自不同作者。阅读时要保存 forecast origin、data cutoff、policy/market-rate assumption、density construction 和 revision。<Cite n={44} /><Cite n={45} /><Cite n={114} /><Cite n={118} />
        </p>
        <div className="precision-note"><span>预测不是承诺</span><p>一条政策利率条件路径可以只是技术假设；一条宏观路径也可随新信息更新。只有制度文本明确对未来行动施加状态依赖约束时，才进入 forward-guidance 的承诺问题。</p></div>
      </section>

      <section className="lesson-section" id="forward-guidance">
        <p className="section-kicker">54 · Forward Guidance: Commitment or Forecast?</p>
        <h2>Forward guidance 可能传达政策承诺、对未来状态的预测，或反应函数的信息；市场响应取决于参与者把哪一部分听成了什么。</h2>
        <p>
          “预计利率在一段时间内保持”可能只是 baseline forecast；“至少在条件 C 成立时保持”更像状态依赖承诺；解释为什么当前路径合适，还会披露央行对增长和通胀的判断。若市场把较低利率路径理解为经济更弱，股票反应可与纯宽松故事相反。沟通效果因此不能只用 policy-rate surprise 度量，还需分开 path news、macro-information news 和 risk-premium news。<Cite n={67} /><Cite n={68} /><Cite n={95} /><Cite n={121} />
        </p>
        <p>
          本节只解释沟通怎样改变信息集和 higher-order beliefs。怎样把承诺写进反应函数、何时出现 time inconsistency，以及工具如何实施，归 3.05。
        </p>
      </section>

      <section className="lesson-section" id="central-bank-information-shock">
        <p className="section-kicker">55 · Central-bank Information Shock</p>
        <h2>央行声明不仅改变政策路径，还可能披露其对经济前景的私人或优势信息；一次事件窗常是 policy shock 与 information shock 的混合。</h2>
        <p>
          高频研究发现，政策公告窗中利率上升而增长预期或股票也上升，可与“央行透露经济比市场想象更强”的正信息成分一致；纯紧缩故事通常更容易产生利率上升、股票下降。Jarociński–Karadi 用利率与股票联动的符号限制分离两类冲击，Nakamura–Steinsson 则从利率、预期通胀和增长响应讨论 information effect。两者都是识别设计，不是看到同向价格就能直接贴标签。<Cite n={121} /><Cite n={122} />
        </p>
        <p>
          声明还可能改变风险偏好、term premium 或对反应函数的理解；宏观新闻重叠、预泄漏和市场微观结构都会污染窄窗。正确表达应是“观察到与 information-shock mixture 一致的符号，需额外工具识别”，而不是“央行信息冲击已被证明”。
        </p>
      </section>

      <section className="lesson-section" id="information-treatments">
        <p className="section-kicker">56 · Information Treatments</p>
        <h2>随机信息实验可以识别“被提供某类信息”对信念和行为的局部因果效应，但 treatment 同时可能改变注意、信任、叙事和实验需求。</h2>
        <p>
          理想设计先确认随机分配，再报告 belief first stage、comprehension、attrition 与行为 outcome；若用 assignment 作为 belief 的工具变量，还需 treatment 只通过目标 belief 影响行为的 exclusion restriction。提供央行目标、专家 forecast 或超市价格不是同一种 treatment，所识别的 complier 也不同。短期问卷响应可能受 experimenter-demand，而长期真实支出更有行为意义但更易 attrition。<Cite n={88} /><Cite n={94} /><Cite n={95} /><Cite n={96} />
        </p>
        <p>
          家庭消费、企业价格和投资的 RCT 提供强于简单相关的证据，却仍是局部平均效应。外推到 aggregate inflation 需要知道 treatment 覆盖、一般均衡价格、政策反应和主体网络；个体 treatment effect 不能直接相加为宏观 multiplier。<Cite n={91} /><Cite n={92} /><Cite n={93} />
        </p>
      </section>

      <section className="lesson-section" id="inflation-release-surprise">
        <p className="section-kicker">57 · Inflation Release Surprise</p>
        <h2>市场交易的是相对事前信息集的 surprise，不是 actual 水准；正确 surprise 需要同口径 consensus、首次发布、冻结尺度、时区和无重叠事件窗。</h2>
        <div className="equation-card">
          <span>标准化公告 surprise</span>
          <div>z<sub>t</sub>=(actual<sup>first</sup><sub>t</sub>−consensus<sub>t−</sub>)/σ<sub>FE</sub></div>
          <p>consensus 在发布前冻结，actual 使用首次可见值，σFE 来自事先定义的同口径历史误差样本；z 无量纲。</p>
        </div>
        <p>
          Actual 3.4%、consensus 3.1%、历史同口径 SD .20pp 给 z=+1.5。若 consensus 在 08:29 ET 冻结、08:30 发布，市场窗必须从发布前延伸到足够短的发布后时刻；核心/headline、m/m annualized 与 y/y 不可混用。之后修订值适合历史测量，却不能替代当时 price discovery 的初值。<Cite n={37} /><Cite n={123} /><Cite n={124} />
        </p>
      </section>

      <section className="lesson-section" id="asset-news-decomposition">
        <p className="section-kicker">58 · Asset-news Decomposition</p>
        <h2>通胀 surprise 进入资产价格时会同时改变预期短率、预期通胀、实际 term premium、通胀风险、流动性和现金流；方向是状态依赖的。</h2>
        <div className="equation-card">
          <span>名义收益率新闻的最小分解</span>
          <div>Δy<sup>N</sup>=ΔE r<sup>short</sup>+ΔEπ+ΔTP<sup>real</sup>+ΔIRP+Δliquidity</div>
          <p>各项变化用 bp；这是会计/模型桥，不表示只靠 nominal 与 TIPS 两个价格就能唯一识别五项。</p>
        </div>
        <div className="equation-card">
          <span>股票 unexpected return 的符号桥</span>
          <div>unexpected return = cash-flow news − discount-rate news</div>
          <p>正的未来现金流修正推高价格，正的未来 required-return 修正压低价格；实证分解依赖预测模型和符号约定。</p>
        </div>
        <p>
          同一高于预期 CPI 可在需求强劲时提高收益和政策路径，也可在供给冲击时压低真实现金流；可信央行可能使长端 inflation expectation 稳定，却抬高 real yield。Raw breakeven 变化仍含 IRP 和 liquidity；汇率响应也取决于相对政策和增长新闻。因而“高 CPI 必然利空所有资产”没有结构基础。<Cite n={47} /><Cite n={49} /><Cite n={51} /><Cite n={54} /><Cite n={123} /><Cite n={124} /><Cite n={125} />
        </p>
      </section>

      <section className="lesson-section" id="real-time-identification">
        <p className="section-kicker">59 · Real-time Identification</p>
        <h2>实时识别的核心是重建参与者当时真正能看到什么，并用设计区分 belief、共同冲击、政策反应和市场楔子。</h2>
        <p>
          最小 Evidence Passport 应保存 observation window、respondent timestamp、survey window、consensus cutoff、release timestamp、timezone、first/revised vintage、policy data cutoff、market event window、model run date 与 access date。随后才选择设计：panel revision 追踪个体学习，RCT 随机化信息，战略问卷冻结情景，高频事件隔离公告，instrument 或 natural experiment 再处理内生 belief。每种设计都有自己的 exclusion、SUTVA、attrition 或 no-overlap 条件。<Cite n={8} /><Cite n={37} /><Cite n={56} /><Cite n={88} /><Cite n={98} /><Cite n={100} />
        </p>
        <p>
          若预期和 realized inflation 同涨，最先排查的是共同能源/需求冲击；若央行同时响应，则 policy endogeneity 会改变后续实现值；若使用 breakeven，则 risk/liquidity 会污染 belief；若使用修订后的模型曲线，则 look-ahead 会美化识别。完整因果研究交给 Chapter 7，本节的交付是不会泄漏未来的信息边界和一组可被竞争机制挑战的局部主张。<Cite n={49} /><Cite n={70} /><Cite n={92} /><Cite n={121} /><Cite n={122} />
        </p>
      </section>

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Object-to-Action Lab</p>
        <h2>十道互动题先检验你是否量对对象、期限、分布和 market wedge，再要求把更新、实际率、反馈与实时事件窗逐步复算。</h2>
        <p>
          Mode A 的五题依次处理 SCE forward-one-year、individual uncertainty 与 disagreement、forecast revision/vintage、breakeven 的风险流动性分解，以及 level/tail/news-sensitivity 三维锚定；Mode B 的五题处理 Bayesian precision、sticky-information hazard、事前实际率与家庭约束、反馈稳定性，以及 CPI 与央行沟通的双事件窗。每题参数只为唯一判分冻结，并不代表当前经济估计。提交前必须记录置信度，系统保留首次答案、首次置信度和提交次数，让高置信错误成为优先复盘信号。<Cite n={6} /><Cite n={48} /><Cite n={70} /><Cite n={75} /><Cite n={98} /><Cite n={122} />
        </p>
        <InflationExpectationsLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <div id="expectations-static-twins" />
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道无脚本孪生题更换起点、数字和表面情境，检验你能否迁移期限、单位、分布、反馈与识别边界。</h2>
        <div className="understanding-checks">
          {inflationExpectationsScenarios.map((scenario, index) => (
            <details key={scenario.id}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>复算：</b>{scenario.staticTwin.answer}</p>
              <p className="impact-source-links"><b>依据：</b>{' '}{scenario.staticSourceIds.map((id) => <Cite key={`${scenario.id}:${id}`} n={id} />)}</p>
            </details>
          ))}
        </div>
        <p>
          展开答案前，先写出 expectation object 的七个字段，再列出至少一个 measurement wedge、一个 behavior break 和一个 real-time clock。若只能记住原题数值或把 survey、market、model 互换，就回到相应 revisit 单元并重新复算；只有换了数字仍能守住 pp、bp、pp²、hazard 与事件窗，知识才从识别变成生成。
        </p>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks、Glossary 与 Expectations Passport</p>
        <h2>十四道检查要求你重建机制，十八个术语固定对象；Expectations Passport 则阻止问卷答案、市场补偿、模型潜变量和因果效应互相冒充。</h2>
        <div className="understanding-checks">
          <details><summary>01 · 一个完整 inflation-expectation object 至少包含什么？</summary><p>主体、价格指数或生活成本总体、地区/目标人口、起止期限窗口、条件假设、点值或密度 functional，以及作答时信息集/vintage。缺少其中任何一项，“3% 通胀预期”都不足以跨指标比较。</p></details>
          <details><summary>02 · SCE three-year ahead 是什么，为什么不是三年累计？</summary><p>它询问从作答时点后第 24 个月到第 36 个月这一年内的价格变化；five-year 类似为第 48 至 60 个月。名称中的 year 指远期落点，而不是从今天起累计三年或五年。</p></details>
          <details><summary>03 · 点预测能否直接当主观密度均值？</summary><p>不能。它可能是中位数、众数、焦点值或受访者对“best guess”的理解；右偏密度下 mean、median 与 mode 不同。必须由问卷定义或个体概率箱拟合确认。</p></details>
          <details><summary>04 · Individual uncertainty 与 disagreement 怎样同时出现在全方差里？</summary><p>总混合方差等于平均个人方差加个人中心预测的横截面方差。前者衡量每个人自己多不确定，后者衡量不同人意见多分散；方差单位 pp²，不能把平均 SD 直接代入。</p></details>
          <details><summary>05 · Breakeven 为什么不能改名为纯预期通胀？</summary><p>因为 nominal–TIPS spread 同时包含物理预期、inflation risk premium、TIPS 相对流动性、指数化滞后、floor 和其他 technical。按本节符号 BE=Eᴾπ+IRP−LP+O，分解还依模型。</p></details>
          <details><summary>06 · Forecast revision 和 error 各比较什么时钟？</summary><p>Revision 比同一 target 的新预测减旧预测；error 比随后首次实现值减旧预测。若用修订实现值、不同 target 或事后信息，便不再是当时参与者面对的实时误差。</p></details>
          <details><summary>07 · 更新缓慢是否证明主体不理性？</summary><p>不证明。Sticky information、noisy signal、rational inattention、模型维护成本和低信任都能产生慢反应。需要个体更新时点、更新幅度、信号精度与决策损失进一步区分。</p></details>
          <details><summary>08 · FE-on-revision 回归的正负号能否无条件命名 under/overreaction？</summary><p>不能。按实现减预测的符号，正 beta 常与不足反应一致、负 beta 常与过度反应一致，但解释同时依赖 target、样本构成、信息集、政策反应和实时 vintage。</p></details>
          <details><summary>09 · 长期均值接近目标是否足以证明锚定？</summary><p>不足。还要检查个人 uncertainty、横截面 disagreement、tail mass、density skew，以及长期预期对短期 surprise 的 beta。Level 稳定可以与高通胀尾部和脆弱 news mapping 并存。</p></details>
          <details><summary>10 · Indexation 与 expectation 的差异是什么？</summary><p>Indexation 依据合约指定的滞后实现指数机械调整现金流；expectation 是对未来结果的主观概率分布。两者都能制造惯性，但前者不要求主体收到或处理新信号。</p></details>
          <details><summary>11 · 为什么预期通胀上升不必提高当前消费？</summary><p>事前实际率下降提供提前消费的替代效应，但预期实际收入下降、失业风险、借贷约束、财富重分配和 uncertainty 可反向作用。耐用品、必需品和服务的调整边际也不同。</p></details>
          <details><summary>12 · 预期何时可能自我实现，哪几处最容易断裂？</summary><p>信念必须先改变真实合同或选择，足够主体同向行动，需求/成本再穿过竞争和价格重设，最终实现值被重新学习。注意、收入、信用、定价权、合同期限、政策可信度和主体抵消都可能截断。</p></details>
          <details><summary>13 · 为什么政策声明不是纯 policy shock？</summary><p>声明既可改变当前与未来工具路径，也可透露央行对增长、通胀和金融状况的优势信息，还可移动 term/risk premium。利率与股票同涨只是 information mixture 的候选符号，不是单次事件证明。</p></details>
          <details><summary>14 · 实时事件研究最少要保存哪些字段？</summary><p>调查/consensus 截止、首次发布值、发布日期与时区、窄市场窗、重叠新闻、政策文件 data cutoff、修订 vintage、模型 run date 和 access date；否则无法重建参与者当时的信息边界。</p></details>
        </div>

        <div className="glossary-grid" aria-label="十八个通胀预期核心术语" role="group">
          <article><b>Expectation object</b><p>带主体、指数、总体、期限、条件、functional 和 vintage 的完整预期对象。</p></article>
          <article><b>Forecast origin</b><p>预测形成的时点；不是实现期、发布日期或数据库下载日。</p></article>
          <article><b>Horizon / Window</b><p>预测离起点多远及实际覆盖的起止区间；spot、average 和 forward window 不同。</p></article>
          <article><b>Conditional forecast</b><p>在明确政策、能源、汇率或其他路径条件下形成的预测。</p></article>
          <article><b>Subjective density</b><p>主体给未来各结果分配的概率分布，可表达中心、偏度、尾部和 uncertainty。</p></article>
          <article><b>Point forecast</b><p>一个数字回答；除非问卷定义，否则不自动等于 density mean。</p></article>
          <article><b>Individual uncertainty</b><p>同一主体主观分布的宽度，常用 variance、SD 或 IQR 表示。</p></article>
          <article><b>Disagreement</b><p>不同主体中心预测的横截面离散，不等于个人 uncertainty。</p></article>
          <article><b>Forecast revision</b><p>同一 forecast target 的新预测减旧预测。</p></article>
          <article><b>Forecast error</b><p>随后实现值减先前预测；实时研究默认保留 first-release vintage。</p></article>
          <article><b>Sticky information</b><p>主体只以一定 hazard 更新完整信息，聚合包含多个旧 information vintages。</p></article>
          <article><b>Noisy information</b><p>主体持续更新，但信号精度有限，因而每次只吸收部分 surprise。</p></article>
          <article><b>Rational inattention</b><p>信息精度和注意分配受获取、处理及决策价值约束。</p></article>
          <article><b>Higher-order belief</b><p>主体对其他主体信念或更新方式的信念，影响协调。</p></article>
          <article><b>Anchoring</b><p>长期分布在水平、尾部和对短期新闻敏感度上的稳定映射。</p></article>
          <article><b>De-anchoring</b><p>上述一个或多个维度持续弱化；不是一次短期均值偏离。</p></article>
          <article><b>Inflation compensation</b><p>市场为预期通胀及风险、流动性和技术楔子要求的总补偿。</p></article>
          <article><b>Central-bank information shock</b><p>政策沟通披露央行宏观判断而形成、与工具冲击混合的资产新闻。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="通胀预期 Evidence Passport，可横向滚动">
          <table className="concept-table">
            <caption>每条 inflation-expectations claim 必须保存的最小字段</caption>
            <tbody>
              <tr><th scope="row">Claim / estimand</th><td>方向明确的局部句；主体、treatment、belief functional、behavior outcome、horizon 与 counterfactual</td></tr>
              <tr><th scope="row">Object passport</th><td>index / prices-in-general / own-price / cost；地区、总体、forecast origin、window 与条件假设</td></tr>
              <tr><th scope="row">Distribution</th><td>point / mean / median / mode / density；individual uncertainty、disagreement、tail 和权重</td></tr>
              <tr><th scope="row">Measurement proxy</th><td>survey / market / model；wording、mode、sample、risk、liquidity 与 parameter wedge</td></tr>
              <tr><th scope="row">Clocks / vintage</th><td>fieldwork、respondent、consensus cutoff、first/revised release、policy cutoff、event window、run/access date</td></tr>
              <tr><th scope="row">Updating mechanism</th><td>adaptive、sticky、noisy、attention、Bayesian、experience、salience 或 heterogeneous model</td></tr>
              <tr><th scope="row">Action / break</th><td>price/wage reset、consumption、debt、inventory、investment；收入、信用、竞争、合同与政策断点</td></tr>
              <tr><th scope="row">Evidence status</th><td>identity / official measure / descriptive relation / model extraction / RCT / event study / structural counterfactual</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-evidence-map">
        <p className="section-kicker">63 · Interfaces、Current Snapshot 与 Evidence Map</p>
        <h2>3.04 最终交付一张带对象、期限、分布、更新、锚定和时钟的预期状态图；后续章节只调用接口，不再把模糊的“市场预期”当原始事实。</h2>
        <div className="interface-grid">
          <article><span>回到 3.02</span><h3>Inflation Formation</h3><p>输出可重设企业的未来成本/价格分布和反馈增益；实际价格聚合、NKPC 与 realized inflation 仍由 3.02 拥有。</p></article>
          <article><span>回到 3.03</span><h3>Labor / Wage Contracts</h3><p>输出工资合同中的价格与生产率预期项；劳动状态、议价、工资分布和合同时钟仍由 3.03 拥有。</p></article>
          <article><span>连接 3.05</span><h3>Reaction Function</h3><p>交付锚定状态、沟通 first stage 与政策信息 cutoff；目标权重、规则和工具选择留给 3.05。</p></article>
          <article><span>连接 3.07–3.08</span><h3>Yield / Real Rate</h3><p>输出预期期限结构、breakeven 分解与 Fisher 桥；完整曲线、term premium 和资产定价留给后续。</p></article>
          <article><span>连接 3.23</span><h3>Macro Surprise</h3><p>输出通胀 actual–consensus、first-release 与事件窗专例；一般 surprise construction 和公告组合归 3.23。</p></article>
          <article><span>连接 Chapter 4</span><h3>Bond / Equity / FX</h3><p>输出 expected-rate、inflation、risk、liquidity 与 cash-flow news；完整跨资产传导和相关状态由 Chapter 4 完成。</p></article>
          <article><span>连接 Chapter 6</span><h3>Belief / Attention</h3><p>输出通胀专用的学习、salience、higher-order belief 与 narrative 可观测实例；一般心理机制归 Chapter 6。</p></article>
          <article><span>连接 Chapter 7</span><h3>Identification</h3><p>Expectations Passport 固定实时 vintage、RCT、战略问卷与事件研究的局部 estimand、联合假设和 chain-break test。</p></article>
        </div>

        <div className="table-scroll" role="region" tabIndex={0} aria-label="截至2026年9月1日的跨主体预期快照，可横向滚动">
          <table className="concept-table">
            <caption>只作为 2026-09-01 可得信息的口径练习；不同对象、期限与统计量不可横向排名</caption>
            <thead><tr><th scope="col">来源 / observation</th><th scope="col">当时可见数字</th><th scope="col">正确标签与时钟</th></tr></thead>
            <tbody>
              <tr><th scope="row">Michigan · Aug final</th><td>1y 4.0%；5–10y 3.3%</td><td>官方 headline medians；prices in general；Final Results for August 2026，本站于 2026-09-01 核对；mixed-mode，非 CPI</td></tr>
              <tr><th scope="row">NY Fed SCE · July</th><td>1y 3.6%；3y 3.3%；5y 3.0%</td><td>官方 headline medians；3y/5y 为 forward-one-year；field 07-01–07-31，released 2026-08-07</td></tr>
              <tr><th scope="row">ECB CES · July</th><td>1y 2.9%；3y 2.7%；5y 2.4%</td><td>官方 release 的 medians；field 07-02–07-27，released 2026-08-21；其他图仍须逐图核对 median 或 winsorised mean</td></tr>
              <tr><th scope="row">BoE IAS · May</th><td>1y 4.0%；次年 3.5%；长期 3.9%</td><td>官方 medians；online public survey；field 04-30–05-05</td></tr>
              <tr><th scope="row">Atlanta BIE · August</th><td>1y unit cost 2.2%</td><td>企业年均单位成本增长的 mean，不是 CPI；updated 08-19</td></tr>
              <tr><th scope="row">BoE DMP · July release</th><td>own-price 1y 3.9%；CPI 1y 3.4%、3y 2.8%</td><td>三个数字均为 weighted means，按截至七月的三个月平均发布；July wave field 07-03–07-17；对象必须分列</td></tr>
              <tr><th scope="row">ECB SAFE · Q2</th><td>HICP 1/3/5y 3.0/3.0/3.1%</td><td>survey-weighted medians；Round 39 SMEs；field 05-21–06-26</td></tr>
              <tr><th scope="row">BoJ Tankan · June</th><td>general prices 1/3/5y 2.7/2.6/2.6%</td><td>official “Average of Enterprises’ Inflation Outlook”；年率；output-price 累计口径另列</td></tr>
              <tr><th scope="row">US SPF · Q3</th><td>2026 Q4/Q4 CPI 3.6%；2026–35 average 2.30%</td><td>官方 medians；released 08-14；不要与 current-quarter annualized 混用</td></tr>
              <tr><th scope="row">ECB SPF · Q3</th><td>HICP 2026/27/28/2031 约 2.7/2.2/2.0/2.0%</td><td>aggregate average point forecasts；released 07-24；annual average 与 fixed horizon 分开</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这张快照的目的不是比较谁“更正确”，而是强迫每个数字带上对象和时钟。英国 9 月 4 日 DMP、9 月 11 日 IAS、Fed 九月 SEP 与 ECB 九月 projections 在 2026-09-01 尚未发生，不能回填；living model series 还须保存下载和 run vintage。<Cite n={1} /><Cite n={5} /><Cite n={12} /><Cite n={13} /><Cite n={21} /><Cite n={23} /><Cite n={25} /><Cite n={30} /><Cite n={36} /><Cite n={39} />
        </p>

        <div className="evidence-map" aria-label="3.04 逐项证据地图" role="group">
          <h3>层一｜Household survey 的对象、问法与时钟</h3>
          <p>Michigan 当期发布、技术文档、2024 mode-transition 与 method comparison 共同固定 prices-in-general、样本和模式断点；均值右尾变化不能无条件命名为宏观去锚。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /></p>
          <p>纽约联储 SCE 当前页、FAQ、设计综述和 data bank 共同固定面板、概率题、1/3/5 年远期窗口与下载 vintage；三年和五年不能改写成累计平均。<Cite n={5} /><Cite n={6} /><Cite n={7} /><Cite n={8} /></p>
          <p>ECB CES 的当前入口、方法、首轮评估和 July 2026 release 固定国家覆盖、权重、winsorisation 与 fieldwork；median 与 winsorised mean 必须逐图读取。<Cite n={9} /><Cite n={10} /><Cite n={11} /><Cite n={12} /></p>
          <p>BoE IAS 的发布与方法断点、BoJ 当前调查与 archive、BoC CSCE 当前轮与档案展示不同模式、定性/定量和季度设计；headline 不可脱离问卷。<Cite n={13} /><Cite n={14} /><Cite n={15} /><Cite n={16} /><Cite n={17} /><Cite n={18} /></p>
          <p>澳大利亚家庭形成研究与欧盟 harmonised survey guide 分别提供异质经验和定性 balance 边界；研究论文与定性净余额都不是当前数值通胀率。<Cite n={19} /><Cite n={20} /></p>

          <h3>层二｜Firm、professional 与 policy projection</h3>
          <p>Atlanta BIE 与方法论文固定 unit cost density；DMP 当前数据和 user guide 同时分开 own price、CPI、wage 与 employment，企业对象不能压成单一“通胀”。<Cite n={21} /><Cite n={22} /><Cite n={23} /><Cite n={24} /></p>
          <p>ECB SAFE 当前轮与 archive、BoC BOS 当前轮与 archive、新 summary-indicator backgrounder 共同记录 SME、judgment sample、频率和 2026Q2 方法断点。<Cite n={25} /><Cite n={26} /><Cite n={27} /><Cite n={28} /><Cite n={29} /></p>
          <p>BoJ Tankan 当前轮与 archive、Banca d’Italia 企业调查以及 Cleveland SoFIE 当前页和扩展说明固定 general/output price、企业覆盖、density、target knowledge 和修剪。<Cite n={30} /><Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /></p>
          <p>Philadelphia SPF 当前入口、Q3 2026 release 与 documentation 固定季度年化、Q4/Q4、长期平均、density 与 individual IDs；专业预测不是无误差 ground truth。<Cite n={35} /><Cite n={36} /><Cite n={37} /></p>
          <p>ECB SPF 当前入口、Q3 report 和历史 review 固定 HICP 对象、annual/fixed horizon 与受访者身份；BoC MPS、BoE external forecasters 和 Livingston 又对应不同机构与频率。<Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={42} /><Cite n={43} /></p>
          <p>FOMC SEP 与 Eurosystem staff projection 都是条件投影，但作者、政策假设和承诺身份不同；它们不能替代 private-sector belief。<Cite n={44} /><Cite n={45} /></p>

          <h3>层三｜Market compensation 与 model extraction</h3>
          <p>Treasury 的 TIPS 合同规则、Fed 曲线数据和 Gürkaynak–Sack–Wright 的曲线方法固定 CPI lag、floor、breakeven 与 forward；living research series 需要实时快照。<Cite n={46} /><Cite n={47} /><Cite n={48} /></p>
          <p>D’Amico–Kim–Wei、Haubrich–Pennacchi–Ritchken、Abrahams 等和 Christensen 等用不同期限结构模型分解物理预期、实际率、term premium、IRP 与 liquidity；模型之间不是同一真值。<Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={52} /></p>
          <p>TIPS puzzle 与 options-implied density 揭示 relative-value、流动性与风险中性尾部；Cleveland model、ATSIX 方法和 CIE 则把多代理压为会修订的潜变量。<Cite n={53} /><Cite n={54} /><Cite n={55} /><Cite n={56} /><Cite n={57} /><Cite n={58} /><Cite n={59} /><Cite n={60} /></p>

          <h3>层四｜形成、信息摩擦、测量与异质性</h3>
          <p>Muth、Nerlove 与 Lucas 提供 rational、adaptive 和 imperfect-information 基准；Mankiw–Reis 与 Sims 分别把更新时点和有限注意引入聚合预期。<Cite n={61} /><Cite n={62} /><Cite n={63} /><Cite n={64} /><Cite n={65} /></p>
          <p>Maćkowiak–Wiederholt、Woodford 与 Morris–Shin把企业注意、common knowledge 和公共信号协调接入价格；Carroll 与 Coibion–Gorodnichenko再提供传播和信息刚性诊断。<Cite n={66} /><Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} /></p>
          <p>跨数据集信息刚性与 JEL 综述、Manski 测量原则、通胀 survey 综述及个体 uncertainty 证据共同说明理性检验依对象、信息集、density 和 vintage。<Cite n={71} /><Cite n={72} /><Cite n={73} /><Cite n={74} /><Cite n={75} /></p>
          <p>随机 wording、point-density comparison、ECB SPF uncertainty 与 inflation disagreement 证据分开问题措辞、functional、个人分布和横截面离散；proper scoring 再固定 calibration 与 sharpness 的预测评价边界。<Cite n={76} /><Cite n={77} /><Cite n={78} /><Cite n={79} /><Cite n={80} /><Cite n={112} /></p>
          <p>专业预测不注意、异质规则、宏观学习专著、lifetime experience 和 grocery exposure 分别解释更新时点、模型切换、递归学习、世代与显著价格。<Cite n={81} /><Cite n={82} /><Cite n={83} /><Cite n={84} /><Cite n={85} /></p>
          <p>主观宏观模型与 diagnostic expectations 提供异质因果图和过度反应候选；information-experiment 综述则固定 first stage、demand effect、persistence 与外推边界。<Cite n={86} /><Cite n={87} /><Cite n={88} /></p>

          <h3>层五｜Belief-to-behavior、沟通与多维锚定</h3>
          <p>激励相容选择、readiness-to-spend、uncertainty RCT、企业 RCT 和家庭 inflation-news RCT 依次增加行为证据强度；设计和主体不同，不能合成通用乘数。<Cite n={89} /><Cite n={90} /><Cite n={91} /><Cite n={92} /><Cite n={93} /></p>
          <p>超市价格实验、央行沟通 RCT 与随机 price-information experiment 固定 treatment、Bayesian-style update 与持久性；新西兰企业证据则提醒目标知识不等于自动锚定。<Cite n={94} /><Cite n={95} /><Cite n={96} /><Cite n={97} /></p>
          <p>战略 survey 与 anchored-expectations 模型定义 news sensitivity 和制度映射；日频家庭数据、疫情 SCE 及历史综述把短期冲击、分歧和长期制度放到不同时间尺度。<Cite n={98} /><Cite n={99} /><Cite n={100} /><Cite n={101} /><Cite n={102} /></p>
          <p>家庭/企业综述、attention working paper、forthcoming threshold 研究与 narrative 文本证据提供 2020s 前沿；working-paper、forthcoming 与文本代理状态必须保留。<Cite n={103} /><Cite n={104} /><Cite n={105} /><Cite n={106} /></p>
          <p>“表面锚定” corrected proof 与美国企业 re-anchoring 指标把经验持久性、mean misalignment 和 disagreement 分开；模型与可修订指标不能当制度真值。<Cite n={107} /><Cite n={108} /></p>

          <h3>层六｜当前政策框架、信息效应与资产 surprise</h3>
          <p>Fed 当前战略与 July MPR、ECB 2025 战略与 June projection 分开目标对象、政策框架、报告 cutoff 和 staff conditional path。<Cite n={109} /><Cite n={110} /><Cite n={111} /><Cite n={45} /></p>
          <p>英国 remit 与 July MPR、BoJ policy outline 与 July Outlook 同样要求区分法定目标、决策者判断、报告日与数据 cutoff。<Cite n={113} /><Cite n={114} /><Cite n={115} /><Cite n={116} /></p>
          <p>RBA conduct statement 与 August SMP、BoC 2021–26 agreement 与 July MPR固定区间目标、条件 forecast 和协议有效期；截至 9 月 1 日不能预告加拿大续签。<Cite n={117} /><Cite n={118} /><Cite n={119} /><Cite n={120} /></p>
          <p>Nakamura–Steinsson 与 Jarociński–Karadi分别从高频预期和利率—股票联动识别央行信息成分；两者都依事件窗和结构限制。<Cite n={121} /><Cite n={122} /></p>
          <p>国债和外汇公告研究固定 pre-release consensus、首次发布和价格发现，Campbell 则提供 cash-flow/discount-rate 股票新闻桥；reduced-form 响应与模型分解都不能单独命名结构冲击。<Cite n={123} /><Cite n={124} /><Cite n={125} /></p>
          <p>Calvo 的随机价格重设与 Taylor 的交错工资合同为本节两条合同接口提供直接理论出处；两者说明预期如何进入可重设决策和合同存量，却不证明现实企业或工资制度服从同一个固定 hazard。<Cite n={126} /><Cite n={127} /></p>
        </div>

        <p>
          本节的最小复述是：<b>先把“预期”定义成特定主体对特定指数、地区、期限和条件形成的主观分布，再从 survey、market 或 model 的带噪代理中量测。主体依据不同信息、注意、经历和主观模型更新，因此均值、个人 uncertainty、横截面 disagreement 与尾部可以分叉；锚定要同时看长期水平、分布和短期新闻敏感度。信念只有进入可重设价格/工资合同或消费、债务、库存和投资选择，并穿过收入、信用、竞争、协调和政策约束，才可能反馈到 realized inflation。政策声明和宏观发布又同时包含路径、宏观信息、风险与流动性新闻，所以任何实证主张都必须保存对象 passport、first-release vintage、consensus cutoff、事件窗、模型版本与 chain-break test。</b>
        </p>
      </section>
    </>
  );
}

export const lesson304: LessonRecord = {
  slug: '3-04',
  id: '3.04',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Inflation Expectations：从测量、学习与锚定到合同、沟通和资产 Surprise',
  subtitle: '先固定谁对哪个价格指数、哪个期限和哪种条件分布形成信念，再解释信息、学习、异质性与锚定怎样影响合同和跨期选择，以及这些机制如何被实时识别',
  readingTime: '核心首读约 90–100 分钟；完整正文含逐式复算约 200–250 分钟；互动实验首次完成 25–35／含复盘 40–50，静态练习 25–35，理解检查与术语 25–35，建议分三至四次完成；参考文献与延伸阅读不计',
  prerequisite: '3.02；建议按需调用 T03、T05、T08，并回看 3.03 工资合同时钟；与 3.05、3.07–3.08、3.23、Chapter 4、Chapter 6 和 Chapter 7 只建立接口',
  updatedAt: '2026-09-01',
  revision: '3.04-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.04-r3',
      summary:
        '独立复核 64 个机制单元、127 条来源、20 组阅读、10 道互动与 10 道静态孪生，逐项核对预期对象、期限、分布、调查与市场代理、学习、锚定、合同、沟通及资产 surprise 的公式、数值、时钟、来源与因果边界；ECB CES、DMP、Tankan、论文出版状态、proper scoring、公告研究、Calvo 线性化和 DOI 修订均由一手来源闭合，章节接口、结构不变量和冻结哈希一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-01',
      decision: 'approved',
      revision: '3.04-r3',
      summary:
        '独立通读零背景路线、64 节递进、21 个公式卡、10 道互动、10 道静态孪生、14 道检查、18 个术语、8 个接口及 20 组阅读；真实浏览器验证双模式、错答重试、双击防重、首次答案与置信度、完成态、刷新持久化、损坏与拒绝存储分支、两步重置、键盘焦点、ARIA、axe、5／2／1 列断点、移动端、深链导航、打印和 noscript，并回归首页及 3.01–3.04，工程门禁、对比度与冻结哈希一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '3-03', label: '3.03 Labor Market 与 Wage Dynamics' },
  next: { slug: '3-05', label: '3.05 Central Bank Objective & Reaction Function' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    { id: 'expectation-object', label: 'Expectation Object' },
    { id: 'horizon-window', label: 'Horizon / Window' },
    { id: 'level-rate', label: 'Level / Rate' },
    { id: 'conditional-unconditional', label: 'Conditional Forecast' },
    { id: 'point-density-functionals', label: 'Point / Density' },
    { id: 'uncertainty-disagreement', label: 'Uncertainty / Disagreement' },
    { id: 'information-set-vintage', label: 'Information Set / Vintage' },
    { id: 'household-surveys', label: 'Household Surveys' },
    { id: 'professional-forecasts', label: 'Professional Forecasts' },
    { id: 'firm-expectations', label: 'Firm Expectations' },
    { id: 'central-bank-projections', label: 'Central-bank Projections' },
    { id: 'market-instruments', label: 'Market Instruments' },
    { id: 'compensation-pq', label: 'Compensation / P vs Q' },
    { id: 'model-extraction', label: 'Model Extraction' },
    { id: 'triangulation', label: 'Triangulation' },
    { id: 'forecast-error-revision', label: 'Error / Revision' },
    { id: 'calibration-scoring', label: 'Calibration / Scoring' },
    { id: 'full-information-re-benchmark', label: 'FI-RE Benchmark' },
    { id: 'rationality-joint-hypothesis', label: 'Joint Hypothesis' },
    { id: 'adaptive-extrapolative', label: 'Adaptive Expectations' },
    { id: 'sticky-information', label: 'Sticky Information' },
    { id: 'noisy-information', label: 'Noisy Information' },
    { id: 'rational-inattention', label: 'Rational Inattention' },
    { id: 'bayesian-learning', label: 'Bayesian Learning' },
    { id: 'constant-gain', label: 'Constant-gain Learning' },
    { id: 'diagnostic-expectations', label: 'Diagnostic Expectations' },
    { id: 'under-over-reaction', label: 'Under / Overreaction' },
    { id: 'salient-prices', label: 'Salient Prices' },
    { id: 'lifetime-experience', label: 'Lifetime Experience' },
    { id: 'numeracy-target-trust', label: 'Numeracy / Target / Trust' },
    { id: 'actor-information-sets', label: 'Actor Information Sets' },
    { id: 'higher-order-beliefs', label: 'Higher-order Beliefs' },
    { id: 'aggregation', label: 'Aggregation' },
    { id: 'anchoring-mapping', label: 'Anchoring as Mapping' },
    { id: 'term-structure', label: 'Expectation Term Structure' },
    { id: 'news-sensitivity', label: 'News-sensitivity Beta' },
    { id: 'tail-density-anchor', label: 'Tail / Density Anchoring' },
    { id: 'disagreement-not-deanchor', label: 'Disagreement ≠ De-anchoring' },
    { id: 'credibility', label: 'Credibility' },
    { id: 'regime-reanchoring', label: 'Regime / Re-anchoring' },
    { id: 'feedback-stability', label: 'Feedback Stability' },
    { id: 'reset-price-interface', label: 'Reset-price Interface' },
    { id: 'wage-contract-interface', label: 'Wage-contract Interface' },
    { id: 'indexation-not-expectation', label: 'Indexation' },
    { id: 'fisher-real-rate', label: 'Fisher / Ex-ante Real Rate' },
    { id: 'consumption-durables', label: 'Consumption / Durables' },
    { id: 'saving-debt-portfolio', label: 'Saving / Nominal Debt' },
    { id: 'investment-inventory', label: 'Investment / Inventory' },
    { id: 'mean-vs-uncertainty', label: 'Mean vs Uncertainty' },
    { id: 'self-fulfilling-breaks', label: 'Feedback and Breaks' },
    { id: 'target-communication', label: 'Target Communication' },
    { id: 'forecast-fanchart-scenario', label: 'Forecast / Fan Chart' },
    { id: 'forward-guidance', label: 'Forward Guidance' },
    { id: 'central-bank-information-shock', label: 'CB Information Shock' },
    { id: 'information-treatments', label: 'Information Treatments' },
    { id: 'inflation-release-surprise', label: 'Inflation Release Surprise' },
    { id: 'asset-news-decomposition', label: 'Asset-news Decomposition' },
    { id: 'real-time-identification', label: 'Real-time Identification' },
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-evidence-map', label: 'Interfaces / Evidence Map' },
  ],
  Content: Lesson304Content,
  references: lesson304References,
  readingList: lesson304ReadingList,
};
