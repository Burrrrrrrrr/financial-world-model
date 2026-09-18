import BenchmarkLab from '../components/BenchmarkLab';
import { benchmarkScenarios } from '../components/benchmarkScenarios';
import { lesson218ReadingList, lesson218References } from './lesson-2-18-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson218Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Benchmark 是事前规定的反事实与治理坐标，不是天然正确的市场组合；它只有经主动状态、约束、授权、目标、订单与成交，才可能改变价格。</h2>
        <p>
          当一只基金“跑赢基准”时，最先被确定的不是经理有多少技能，而是一个相对关系：同一期间、同一币种、同一费用与分红口径下，组合比预先指定的参考路径多赚了多少。这个坐标可以帮助资产所有者区分市场本身提供的回报与经理的主动决定，限制风格漂移，并把风险、问责和费用写进授权；它也可能在特定薪酬、资金流和职业风险下改变经理的边际激励。因此，benchmark 既不是纯粹统计装饰，也不是一出现就会驱使所有机构跟随指数的自动交易程序。<Cite n={1} /><Cite n={3} /><Cite n={21} /><Cite n={24} />
        </p>
        <div className="causal-chain" aria-label="从委托授权到基准反馈的完整状态链" role="list">
          <div role="listitem"><span>01</span><b>Mandate</b><p>目标、期限、范围与禁限。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Benchmark</b><p>角色、权重、收益口径与版本。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Active state</b><p>实际／目标权重与相对收益。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Risk &amp; incentive</b><p>TE、预算、考核与资金流。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Governance</b><p>验证、归因、选择与授权。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Target</b><p>希望达到的下一组合状态。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>07</span><b>Order / fill</b><p>真实指令、成交与成本。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>08</span><b>Market</b><p>价格、深度、相关性与反馈。</p></div>
        </div>
        <p>
          本节的中心纪律是：<b>相对测量不等于行为，相对约束不等于唯一行动，目标不等于订单，订单不等于成交，共同基准也不等于共同价格冲击。</b>只有相似持仓遭遇共同触发、形成同向目标变化，并在相近时点实际成交且市场深度有限，benchmarking 才可能进入拥挤与顺周期反馈。委托合同改善问责的收益与共同约束造成的外部性必须同时保留，而不能把其中一面写成普遍定律。<Cite n={24} /><Cite n={25} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、先修与两条学习路线</p>
        <h2>本节研究“相对坐标怎样进入机构决策”，而不是重新讲完整指数基金、主动选股、风险限额或从众心理。</h2>
        <div className="learning-objectives">
          <span>六阶段路线 · 从基准定义到可证伪的市场反馈</span>
          <ol>
            <li><b>对象与角色（00–17）：</b>分开 index、benchmark、policy、manager、construction、performance、fee 与 liability 坐标，并冻结 benchmark passport。</li>
            <li><b>相对账本（18–28）：</b>由 portfolio/benchmark weights 形成 active weight，再区分 active return、tracking difference、ex-post TE 与年化。</li>
            <li><b>前瞻风险（29–40）：</b>由协方差与因子模型形成 ex-ante TE、风险贡献、预算、Active Share 与 information ratio。</li>
            <li><b>实施与归因（41–51）：</b>解释费用、税、现金、流量、指数调整、复制、执行、衍生品、币种与 Brinson 账面归因。</li>
            <li><b>激励与证据（52–55）：</b>把薪酬、流量、职业顾虑、基准变更、共同交易与因果识别放入同一条可断链机制。</li>
            <li><b>迁移（56–59）：</b>完成 10+10 道实验、14 道检查、术语桥、接口与四层阅读路径。</li>
          </ol>
        </div>
        <p>
          硬先修是 2.03–2.04；建议回看 T01、T03、T06、T08、1.09、1.20、2.12、2.16–2.17。85–90 分钟核心首读统一走 00–11 → 12–18、20 → 21–35 → 36–41、43–46 → 52、54、56–59；现金与衍生品映射、固定收益基准、完整规则和研究设计留到第二遍。2.04 已经说明指数规则、基金复制与 ETF 不是同一对象；2.16 已经说明 limit breach 先进入验证与授权；2.17 已经说明 flow 只有穿过现金和执行才成为卖盘。本节在这些接口上增加“相对坐标”，不重复它们的全部机制。<Cite n={3} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="state-chain">
        <p className="section-kicker">02 · 状态机与最小数据模型</p>
        <h2>一张相对绩效报表至少需要保存事实、反事实、意图与执行四类状态；覆盖彼此只会制造看似精确的错误。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="基准管理四类状态，可横向滚动">
          <table className="concept-table">
            <caption>同一证券在相对管理系统中的不同状态</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">回答的问题</th><th scope="col">不能替代</th></tr></thead>
            <tbody>
              <tr><th scope="row">Benchmark state</th><td>事前反事实在该时点持有什么、怎样计算收益？</td><td>经理实际持仓</td></tr>
              <tr><th scope="row">Actual state</th><td>已成交并按当前价格重估后真正持有什么？</td><td>尚未成交的目标</td></tr>
              <tr><th scope="row">Target state</th><td>治理与组合流程批准希望达到什么权重？</td><td>当前风险主账本</td></tr>
              <tr><th scope="row">In-flight state</th><td>哪些 order 已发出、部分成交、取消或待结算？</td><td>fill 与最终现金</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          每个状态都必须带 entity、portfolio、benchmark code/version、valuation time、currency、return basis、security mapping 和 effective timestamp。同一经理可以相对一个 construction benchmark 控制风险、相对另一个 broad index 作监管披露，再相对 policy benchmark 接受资产所有者问责。若系统只保留“benchmark=某指数简称”，后续 active weight、TE、归因和激励都无法复核。<Cite n={3} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="measurement-passport">
        <p className="section-kicker">03 · Measurement Tuple</p>
        <h2>任何“跑赢 50bp”或“TE 3%”都必须先补全测量元组；否则数字没有稳定含义。</h2>
        <div className="equation-card">
          <span>最小测量元组</span>
          <div>M=(role, universe, basis, currency, clock, weights, window, estimator, version)</div>
          <p>role 是评价、构建、风险、政策或费用用途；universe 是证券与现金全集；basis 是 price/gross/net total return 与 gross/net-of-fee；clock 是估值和汇率时点；window/estimator 决定样本 TE；version 保存当时有效的方法。</p>
        </div>
        <p>
          这不是文书细节，而是识别边界。基金净收益相对 price index 的 +1%，可能同时相对 gross total-return index 为 −1%；人民币投资者面对未对冲美元指数的主动结果，也不能与美元本币结果互换。测量元组没有冻结时，争论“经理是否创造价值”往往只是不同口径之间的错位。<Cite n={9} /><Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="index-versus-benchmark">
        <p className="section-kicker">04 · Index 与 Benchmark</p>
        <h2>Index 是按方法计算并发布的数值序列；Benchmark 是某项授权中被赋予角色的参考坐标，二者有交集但不等价。</h2>
        <p>
          指数方法把成份资格、价格、自由流通股本、权重上限、公司行动和再平衡规则映射成权重与指数水平。Benchmark 则回答“这只组合应相对什么被构建、限制、评价或收费”。一个指数只有被基金文件、投资授权、报告制度或合同选中后，才成为该关系中的 benchmark；反过来，60/40 policy mix、负债现金流、固定回报门槛或自定义组合都可以是 benchmark，却未必对应一只可直接交易的指数。<Cite n={60} /><Cite n={61} /><Cite n={65} /><Cite n={67} />
        </p>
        <div className="precision-note">
          <span>指数不是一只无摩擦证券</span>
          <p>指数可以在公式上即时调整 divisor 或权重以保持连续性，真实基金却要处理现金、税、spread、冲击、lot、借券与结算。把“指数收益”当作投资者无需成本即可获得的资产，会系统性低估复制与治理问题。</p>
        </div>
      </section>

      <section className="lesson-section" id="performance-benchmark">
        <p className="section-kicker">05 · Performance Benchmark</p>
        <h2>绩效基准提供一个事前比较反事实；它可以改善问责，却不必直接规定经理持仓。</h2>
        <p>
          资产所有者需要知道，组合上涨 12% 是因为市场普遍上涨，还是因为经理相对授权作出的决定。Performance benchmark 把前者近似成一个可重复计算的参考路径，使报告、归因、续聘与费用拥有共同坐标。但它是否进入持仓构建，必须查看 mandate，而不能由披露页面反推。美国 Form N-1A 要求适用基金在业绩图表中与合适的 broad-based securities market index 比较；这种披露 comparator 本身并不能证明经理按该指数控制 active weights。<Cite n={50} />
        </p>
        <p>
          绩效基准也不是资产定价模型中的“无风险资产”或因子模型 alpha。组合相对指数多赚 2%，可能来自长期 beta、规模、价值、币种或流动性暴露；只有在进一步指定模型和反事实后，才能讨论 risk-adjusted alpha。这里统一把 portfolio return minus benchmark return 称为 <b>active return</b>，避免中文“超额收益”同时指相对无风险利率而造成歧义。
        </p>
      </section>

      <section className="lesson-section" id="investable-index">
        <p className="section-kicker">06 · Investable Index</p>
        <h2>可投资性不是“成份在交易所挂牌”这么简单，而是规则、容量、税务、可达性与实施时点共同允许现实复制。</h2>
        <p>
          对一只指数化产品而言，基准最好代表一个现实可实施的被动替代：成份可交易、自由流通与外资限制可识别、权重足以在合理成本下复制、公司行动和再平衡可执行、历史数据与治理可获得。即使如此，指数仍不会替基金支付交易成本。大型指数提供商的方法论会详细规定 eligibility、float adjustment、reconstitution、corporate actions 与计算时钟，正因为这些规则会改变真实目标，而不是因为指数本身可被无摩擦持有。<Cite n={60} /><Cite n={62} /><Cite n={64} /><Cite n={65} />
        </p>
        <p>
          “适合作为 performance benchmark”与“适合作为 investable construction target”也可能分离。一个负债驱动组合可以用折现负债作为成功坐标，却无法直接购买“负债指数”；一个很宽的市场指数适合长期评价，却可能包含小规模基金无法经济复制的尾部证券。用途决定 adequacy test，不能先假设一个名称承担全部角色。
        </p>
      </section>

      <section className="lesson-section" id="policy-benchmark">
        <p className="section-kicker">07 · Policy Benchmark</p>
        <h2>Policy benchmark 把资产所有者的长期战略风险选择写成规则；它评价的是总基金治理，而不只是单个经理选股。</h2>
        <p>
          养老金或多资产基金先决定愿意承担多少股票、利率、信用、通胀和币种风险，再把这些长期权重与允许的再平衡规则写成 policy benchmark。若总基金相对 policy benchmark 落后，原因可能是 tactical allocation、经理选择、各 sleeve 内部主动收益、现金、overlay、费用或执行；某个股票经理跑赢自己的 manager benchmark，并不能保证总基金也跑赢 policy benchmark。这里存在“所有者—总组合—资产类别—外部经理”的层级账本。<Cite n={3} /><Cite n={18} />
        </p>
        <div className="equation-card">
          <span>两层评价不能折叠</span>
          <div>R<sub>total</sub>−R<sub>policy</sub> ≠ R<sub>equity manager</sub>−R<sub>equity index</sub></div>
          <p>左侧包含资产配置、其他 sleeves、现金、币种、overlay 与总成本；右侧只评价一个授权单元。两者可以通过归因连接，却不是同一个结果。</p>
        </div>
      </section>

      <section className="lesson-section" id="manager-benchmark">
        <p className="section-kicker">08 · Manager / Construction Benchmark</p>
        <h2>经理基准定义具体授权的机会集与相对风险原点；它可以同时用于评价和构建，也可以只承担其中一种角色。</h2>
        <p>
          一名全球股票经理可能被要求相对某全球指数控制国家、行业和个股主动风险；另一名 absolute-return 经理只在报告中与现金加点比较，并不围绕该门槛构建持仓。Roll 说明以 benchmark 为坐标的 tracking-error 约束可能使组合在总均值—方差空间中偏离传统有效前沿；Jorion 进一步展示 total-risk constraint 可以修正只控制相对风险留下的绝对风险盲点。两者都说明：benchmark 是授权中的模型选择，而不是一条自然法则。<Cite n={2} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="composite-custom">
        <p className="section-kicker">09 · Composite 与 Custom Benchmark</p>
        <h2>多个指数可以组合成更贴近 mandate 的坐标，但权重、再平衡、缺失历史与治理必须事前写清。</h2>
        <p>
          例如一项 70% 全球股票、20% 本币债券、10% 现金的授权，可以把三个公开指数按固定权重组合；也可以采用随负债或资产规模变化的动态权重。前者透明却可能与真实战略漂移，后者贴合却增加模型和治理自由度。Composite benchmark 至少要说明各 component、权重、再平衡频率、币种、对冲、节假日、税、历史拼接和成份更换规则。否则“自定义”很容易退化为事后选择最有利的比较器。
        </p>
        <p>
          GIPS 的 benchmark 指引强调基准描述、选择与变更的透明性，但 GIPS 是自愿采用的绩效呈现标准，不是全球统一法律；它能支持良好报告实践，不能替代基金合同和本地监管义务。<Cite n={57} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="peer-hurdle-liability">
        <p className="section-kicker">10 · Peer Group、Hurdle 与 Liability Benchmark</p>
        <h2>同行排名、费用门槛与负债路径都是比较坐标，却回答三个不同问题，不能统一塞进 tracking-error 账本。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="三类非标准指数比较坐标，可横向滚动">
          <table className="concept-table">
            <caption>比较坐标的目的与关键缺陷</caption>
            <thead><tr><th scope="col">坐标</th><th scope="col">核心问题</th><th scope="col">主要边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Peer group</th><td>相似产品中排第几？</td><td>成员内生变化、分类和幸存者偏差；通常不可投资</td></tr>
              <tr><th scope="row">Fee / hurdle</th><td>何时产生绩效费或奖金？</td><td>合同计算、high-water mark 与对称性；不必是风险原点</td></tr>
              <tr><th scope="row">Liability benchmark</th><td>资产是否覆盖未来支付？</td><td>依赖现金流、折现率与精算假设；未必有可交易成份</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Peer ranking 尤其容易与 benchmark 混淆：如果整个同行群体同时承担了错误风格或过高风险，一个排名靠前的经理仍可能不满足委托目标。费用门槛又可能产生不对称激励，但不能据此假设所有基金都采用相对绩效费。比较之前必须先问“谁与谁签订了什么授权，哪一个坐标触发哪一种后果”。<Cite n={4} /><Cite n={23} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-adequacy">
        <p className="section-kicker">11 · Benchmark Adequacy</p>
        <h2>好基准不是事后最能解释组合的指数，而是事前与 mandate 相符、可测量、可复制或可解释、明确且受治理的反事实。</h2>
        <p>
          Bailey 将 benchmark 质量概括为 unambiguous、investable、measurable、appropriate、reflective of current investment opinions、specified in advance 与 owned 等检验。不同用途下各项权重会变化：performance benchmark 仍应明确、可测量、适当且事前规定；construction benchmark 更强调机会集与可实施性；liability benchmark 则可能不完全可投资，却必须与支付目标相符。<Cite n={1} />
        </p>
        <p>
          Sensoy 的证据表明，基金招募说明书所列基准与其实际风格之间可能存在错配，而且使用更合适的风格坐标会改变评价。这里的教训不是允许研究者年末挑选最有利指数，而是区分两件事：事前 benchmark 决定正式问责；事后 fitted benchmark 可以诊断 misfit，但必须明确标为诊断，不能回写成当初授权。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="passive-objective">
        <p className="section-kicker">12 · Passive Objective</p>
        <h2>指数基金的目标是以产品允许的方式复制指数回报，不是消灭所有决策，也不是保证每期 tracking difference 为零。</h2>
        <p>
          被动经理仍需决定 full replication、sampling、optimization、期货过渡、现金管理、证券借贷、税务 lot、公司行动和收盘执行；这些决定受基金规模、费用、流动性与法律约束。结果通常是围绕 benchmark 的小幅偏离：稳定费用和税差更多进入 tracking difference，现金流、再平衡和执行的不稳定性更多进入 tracking error。Frino–Gallagher 与 Elton 等研究展示了指数基金实施偏离的现实来源，但历史样本不能直接当作今天所有产品的成本参数。<Cite n={29} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="active-objective">
        <p className="section-kicker">13 · Active Objective</p>
        <h2>主动经理承担非零主动权重，是为了在成本、约束和风险之后创造净主动价值；“与基准不同”本身不是价值。</h2>
        <p>
          研究信号先形成对未来收益的条件判断，再经授权、风险、流动性、税和交易成本转成目标组合。相对基准多持有某证券，只说明经理选择承担该方向；只有其实现收益在一致口径下超过成本，才产生净主动结果。Grinold 的 information ratio 框架把预期主动收益与主动风险连接起来，Roll 则提醒基准约束会改变可行组合；二者都没有把高偏离等同于高技能。<Cite n={5} /><Cite n={2} />
        </p>
        <div className="precision-note">
          <span>Active return 不自动等于 alpha</span>
          <p>相对基准收益可以由未建模的 beta、style、currency、liquidity、timing 或成本产生。Alpha 是相对某个明确资产定价模型的截距或定价误差；benchmark-relative return 是合同坐标下的算术差。两者只有在附加假设下才重合。</p>
        </div>
      </section>

      <section className="lesson-section" id="benchmark-aware-active">
        <p className="section-kicker">14 · Benchmark-aware Active</p>
        <h2>Benchmark-aware 不是“半被动”，而是以 benchmark 为风险原点，在主动风险预算内保留证券与时点裁量。</h2>
        <p>
          这类经理会明确管理 sector、factor、security active weights 以及 ex-ante tracking risk。较低 TE 可以来自高度相关的替代证券、行业中性、衍生品对冲或较小风险预算，并不能证明经理只复制指数。反过来，一个主动权重不大的组合也可能因为偏离集中在高波动、低相关资产上而产生较高 TE。Jorion 与 Rudolf–Wolter–Zimmermann 说明 tracking-error 约束的组合选择必须和总风险及其他约束一起理解。<Cite n={10} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-agnostic">
        <p className="section-kicker">15 · Benchmark-agnostic 的边界</p>
        <h2>声称“绝对收益”只能说明构建时不围绕某市场指数，并不意味着没有参考坐标、机会成本或相对问责。</h2>
        <p>
          Absolute-return 策略可能以现金加点、通胀、资本保护、最大回撤或负债覆盖作为成功标准；投资者仍会把它与可获得的替代方案比较。真正的区别在于 benchmark 是否进入优化、风险限制和目标持仓，而不是报告中能否找到一个 comparison series。若一只基金只在营销材料里展示宽基指数，它可能是 performance-only comparator；若风险系统每天计算并限制相对暴露，它才是 construction/risk coordinate。<Cite n={1} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="enhanced-index-spectrum">
        <p className="section-kicker">16 · Enhanced Index Spectrum</p>
        <h2>指数复制、增强指数与 benchmark-aware active 是授权光谱，不应靠单一 TE 或 Active Share 阈值给产品重新贴标签。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="被动到主动授权光谱，可横向滚动">
          <table className="concept-table">
            <caption>产品身份由 mandate 与裁量决定</caption>
            <thead><tr><th scope="col">授权</th><th scope="col">主要目标</th><th scope="col">典型裁量</th><th scope="col">指标解释</th></tr></thead>
            <tbody>
              <tr><th scope="row">Index replication</th><td>按产品文件指定的 price／gross TR／net TR 口径尽可能复制指数回报；基金净实现结果另受费用、税和交易成本影响</td><td>复制、现金、借贷与执行</td><td>TD/TE 评估实施一致性</td></tr>
              <tr><th scope="row">Enhanced index</th><td>小幅正主动收益并保持低主动风险</td><td>受限选股、因子与成本优化</td><td>低 TE 仍可含主动观点</td></tr>
              <tr><th scope="row">Benchmark-aware active</th><td>在显著主动预算内创造净主动价值</td><td>证券、行业、因子、时点</td><td>TE 是风险坐标，不是身份测试</td></tr>
              <tr><th scope="row">Benchmark-agnostic</th><td>绝对、负债或其他目标</td><td>不围绕市场指数构建</td><td>披露 comparator 不等于构建基准</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Cremers–Petajisto 提出 Active Share 后，实务常把持仓偏离、TE 与 closet indexing 放在一起讨论；后续研究提醒，成本、benchmark choice、因子结构和样本选择会改变结论。指标可以揭示需要进一步调查的事实，却不能脱离法域、费用披露和 mandate 独自判定产品是否误导。<Cite n={13} /><Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-passport">
        <p className="section-kicker">17 · Benchmark Passport</p>
        <h2>正式评价前先冻结一张“基准护照”；缺少任一关键字段，都可能让同一名称在不同系统里代表不同反事实。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="基准护照字段，可横向滚动">
          <table className="concept-table">
            <caption>建议保存的最小 benchmark passport</caption>
            <thead><tr><th scope="col">字段组</th><th scope="col">必须回答</th><th scope="col">错配后果</th></tr></thead>
            <tbody>
              <tr><th scope="row">Role / authority</th><td>policy、construction、risk、performance、fee；由谁批准？</td><td>用披露指数冒充交易授权</td></tr>
              <tr><th scope="row">Universe / method</th><td>地区、资产、资格、float、cap、rebalance、corporate action</td><td>主动权重映射错误</td></tr>
              <tr><th scope="row">Return basis</th><td>price、gross/net TR、费用、税、币种、hedge</td><td>TD 符号和大小错位</td></tr>
              <tr><th scope="row">Clock / data</th><td>收盘、汇率、假日、估值、发布与修订</td><td>异步价格制造虚假 TE</td></tr>
              <tr><th scope="row">Governance</th><td>administrator、code、version、change、cessation、transition</td><td>历史结果不可复核</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          截至 2026-08-31，中国证监会公募基金业绩比较基准指引的主体规则已自 2026-03-01 施行，但附则明确若干条款分期：第十五条第二、三款自 2026-09-01 执行；第八条第四款、第九条、第十六条第一款、第十七条自 2027-03-01 执行。中基协操作细则第二十至二十二条自 2026-09-01 执行，第十三、十四、二十三至二十五条自 2027-03-01 执行。教材必须按访问日区分“已经施行”“翌日开始执行”和“未来执行”，也不能把细则列举的 TE、IR、主动比率写成监管规定的唯一公式。<Cite n={44} /><Cite n={45} /><Cite n={46} /><Cite n={47} /><Cite n={49} />
        </p>
        <p>
          美国 Form N-1A 的 broad-based index 是披露比较规则；SEC 的 FAQ 与 ADI 只是非约束 staff views。欧盟 Benchmark Regulation 规制 benchmark 的提供与使用，其范围又经 Regulation (EU) 2025/914 自 2026-01-01 起调整并包含过渡；IOSCO 最终原则则给出治理、方法、质量与问责框架。它们的法律层级、对象与效果不同，不能拼成“全球基金必须贴近指数”的统一义务。<Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={54} /><Cite n={55} /><Cite n={56} /><Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="active-weight">
        <p className="section-kicker">18 · Active Weight</p>
        <h2>主动权重是实际组合与基准在同一资产全集上的差；先完成映射，才能谈偏离、风险或订单。</h2>
        <div className="equation-card">
          <span>持仓级相对状态</span>
          <div>x<sub>t</sub>=w<sub>t</sub>−b<sub>t</sub></div>
          <p>w 是时点 t 的实际组合权重，b 是同一时点、同一币种与同一资产全集上的 benchmark weight，x 是 active weight。x<sub>i</sub>=+2% 表示相对基准超配 2 个百分点，不表示该证券会涨 2% 或贡献 2% 收益。</p>
        </div>
        <p>
          只有组合与基准都在完整共同 universe 上全额投资且权重和均为 1，才有 Σx<sub>i</sub>=0。这个零和关系描述资本权重从 underweight 转向 overweight，不表示主动收益或风险为零。实际持仓应在 fill 与价格重估之后计算；target active weight 可以单独保存为前瞻情景，却不能覆盖当前 exposure。<Cite n={2} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="mapping-boundaries">
        <p className="section-kicker">19 · Cash、Derivatives 与 Off-benchmark Mapping</p>
        <h2>现金、杠杆、空头、衍生品和基准外资产会破坏简单的权重相减；必须先声明是资本权重、名义权重还是风险等价暴露。</h2>
        <p>
          基准没有现金而基金持有 5% 现金时，现金主动权重是 +5%，其他资产合计通常是 −5%；若基金用股指期货恢复市场 beta，资本权重仍有现金，但经济风险暴露可能接近基准。空头和杠杆可使 gross exposure 超过 100%，衍生品又可用 notional、delta-adjusted、DV01 或 factor beta 映射。不同映射回答不同问题，不能把它们合成一个“真实权重”。
        </p>
        <div className="precision-note">
          <span>两本账同时保存</span>
          <p>资本／NAV 账本回答资金投在哪里、费用和现金怎样发生；风险暴露账本回答价格、利率、信用或币种变化怎样影响组合。衍生品策略只保存其中一本，就会在主动权重、TE 或归因处失真。<Cite n={7} /><Cite n={10} /></p>
        </div>
      </section>

      <section className="lesson-section" id="target-order-fill">
        <p className="section-kicker">20 · Target → Order → Fill → Actual Holding</p>
        <h2>基准变化或主动观点先改变目标组合；只有真实成交改变持仓，之后的价格变化还会继续重写权重。</h2>
        <div className="equation-card">
          <span>简化候选订单</span>
          <div>q<sub>i</sub><sup>*</sup>=[w<sub>i</sub><sup>*</sup>AUM<sup>+</sup>−V<sub>i</sub>−I<sub>i</sub>]/P<sub>i</sub></div>
          <p>本式只直接适用于现金证券：w* 是批准目标权重，AUM+ 是流量后的可投资规模，V 是当前实际市值；I 是尚未并入 V 的有符号在途名义金额，买入为正、卖出为负；P 是每证券单位的货币价格。q* 以股数或证券单位计，正值代表候选买入、负值代表候选卖出，AUM、V 与 I 必须使用同一货币。期货等合约要先把报价、contract multiplier 与汇率映射为每合约经济暴露，并让 target、V 与 I 全部采用同一暴露口径；期权还须另行处理 delta／Greeks 与情景映射，不能直接套用这个标量公式。公式只生成候选数量；lot、税、spread、冲击、借券、截止时点和部分成交仍在后面。</p>
        </div>
        <p>
          如果经理把某行业目标从 benchmark−1% 改为 benchmark−4%，但卖单只成交一部分，当前 active weight 可能仍是 −2%。风险系统应以 actual holding 计算当前 ex-ante TE，同时另列 target TE 和 in-flight scenario。把批准 target 当 actual fill，会提前制造并不存在的持仓、风险与市场影响；把订单发出当现金结算，又会重复 2.16–2.17 已纠正的状态混淆。<Cite n={3} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-return">
        <p className="section-kicker">21 · Benchmark Return</p>
        <h2>基准收益来自事前权重与统一资产总收益；公司行动、再平衡和 divisor 可能让真实指数计算比简单加权更复杂。</h2>
        <div className="equation-card">
          <span>期初权重的教学公式</span>
          <div>R<sub>B,t</sub>=Σ<sub>i</sub>b<sub>i,t−1</sub>r<sub>i,t</sub></div>
          <p>R<sub>B,t</sub> 是 t 期 benchmark return，b<sub>i,t−1</sub> 是期初基准权重，r<sub>i,t</sub> 是同币种、同分红／税／公司行动口径的资产总收益。若中途有规则化现金流或重置，必须使用指数方法规定的链接方式。</p>
        </div>
        <p>
          例如 60% 股票指数回报 +2%、40% 债券指数回报 −1%，policy benchmark 本期回报是 0.8%，不是两个回报的简单平均。真实指数会分别计算 price、gross total return 和 net total return，并用 divisor 处理不应被解释为市场回报的成份与资本变化。MSCI 和 S&amp;P 的方法论正是对这些状态作版本化定义；教材公式是最小解释器，不替代提供商方法。<Cite n={61} /><Cite n={65} />
        </p>
      </section>

      <section className="lesson-section" id="portfolio-return">
        <p className="section-kicker">22 · Portfolio Return</p>
        <h2>组合收益必须与 benchmark 使用同一范围与时钟；净收益还要把费用、成本、税、借贷和未解释残差逐项入账。</h2>
        <div className="equation-card">
          <span>净组合收益账本</span>
          <div>R<sub>P,t</sub><sup>net</sup>=Σw<sub>i,t−1</sub>r<sub>i,t</sub>−fee<sub>t</sub>−cost<sub>t</sub>−tax<sub>t</sub>+lending<sub>t</sub>+residual<sub>t</sub></div>
          <p>所有项都以该期组合期初 NAV 为分母。若某项已进入证券收益或 NAV，不得再次扣除；residual 应是待调查对账项，不是把错误永久藏起来的容器。</p>
        </div>
        <p>
          Portfolio return 可以是 gross-of-management-fee、net-of-fee、NAV return 或 ETF market-price return；benchmark 也可以是 price/gross/net total return。比较必须明确两边为何采用当前口径。例如投资者实际体验通常关心基金净 NAV 回报；复制团队又可能先看费用前 implementation result。两个数字都可以有效，但回答不同问题。<Cite n={58} /><Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="active-return">
        <p className="section-kicker">23 · Active Return</p>
        <h2>Active return 是同一期间组合收益减基准收益；只有在持仓与收益口径严格对齐时，才可写成主动权重乘资产收益。</h2>
        <div className="equation-card">
          <span>单期主动收益</span>
          <div>A<sub>t</sub>=R<sub>P,t</sub>−R<sub>B,t</sub>=x<sub>t−1</sub>′r<sub>t</sub></div>
          <p>第二个等号要求两边使用同一资产全集、期初权重和收益定义，并暂时不含另计的费用、交易成本、税与借贷。含实施项时应在等式右侧显式增加，不能让持仓贡献与净投资者结果混用。</p>
        </div>
        <p>
          主动收益不是“经理这一期所有决定的因果贡献”。期初 active weights 可能来自更早的交易，期间公司行动与流量会改变路径，因子与共同冲击也会影响结果。它首先是合同坐标下的账面差；归因可以把差额按规则拆开，但技能判断还需要长期样本、可实施反事实、模型风险和统计不确定性。<Cite n={8} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="tracking-difference">
        <p className="section-kicker">24 · Tracking Difference</p>
        <h2>Tracking difference 描述主动收益的中心或累计落差；它回答“长期偏向哪里”，而不是“每期有多不稳定”。</h2>
        <div className="equation-card">
          <span>算术平均与几何累计必须分开</span>
          <div>TD̄=(1/T)ΣA<sub>t</sub>；　TD<sup>geo</sup><sub>1:T</sub>=Π(1+R<sub>P,t</sub>)/Π(1+R<sub>B,t</sub>)−1</div>
          <p>算术 TD̄ 是 T 期主动收益均值；几何 TD 是两条财富路径的累计相对差。多期复利下二者通常不相等，也不能把单期差无条件相加。</p>
        </div>
        <p>
          一只指数基金若每月稳定因费用落后 10bp，算术 tracking difference 为 −10bp，而 centered tracking error 可以是 0。相反，+10bp、−10bp 交替的路径平均 TD 为 0，却具有正 TE。历史指数基金研究把费用、现金和实施列为常见 TD 来源，但其数量级随产品、税制和市场结构变化。<Cite n={29} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="multiperiod-compounding">
        <p className="section-kicker">25 · Multi-period Compounding</p>
        <h2>多期相对财富取决于两条完整收益路径；同样的平均主动收益可能因波动和基准路径不同而产生不同累计差。</h2>
        <p>
          假设基金与基准第一期分别 +20% 和 +10%，第二期分别 −20% 和 −10%。两期算术主动收益为 +10%、−10%，平均为 0；但基金财富变为 0.96，基准财富变为 0.99，累计相对表现约为 −3.03%。这不是计算矛盾，而是乘法复利和收益基数变化。若现金流发生在期中，还要使用 time-weighted return 或 money-weighted return 区分经理投资结果与投资者实际资金时点。<Cite n={58} />
        </p>
        <div className="precision-note">
          <span>选择哪一个 TD 定义取决于问题</span>
          <p>运营团队可能关心日／月算术平均偏离，投资者关心累计相对财富，归因系统又需要可链接的多期算法。报告应并列定义，而不是把一个指标命名为唯一“跟踪差”。<Cite n={7} /></p>
        </div>
      </section>

      <section className="lesson-section" id="ex-post-te">
        <p className="section-kicker">26 · Ex-post Tracking Error</p>
        <h2>Ex-post TE 是已经实现的主动收益围绕其样本均值的离散；它不测平均落后，也不预测下一期。</h2>
        <div className="equation-card">
          <span>本节采用 n−1 样本标准差</span>
          <div>TE<sup>post</sup>=√[Σ(A<sub>t</sub>−Ā)²/(T−1)]</div>
          <p>T 是有效观测数，Ā 是样本平均主动收益。结果单位与单期收益相同；年化必须另加频率和序列相关假设。本节明确采用 centered、n−1 约定，不宣称所有供应商相同。</p>
        </div>
        <p>
          对 +1%、−1%、+1%、−1% 四个季度，平均主动收益为 0，样本季度 TE 为 √(4/3)%≈1.1547%。若题设明确季度主动收益无序列相关且过程稳定，简化年化为 2.3094%。Pope–Yadav 早已提醒 tracking-error 计算容易因定义和数据处理出现错误，因此任何跨产品比较都要先核对 estimator。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="sample-estimator">
        <p className="section-kicker">27 · Centered TE、RMS 与有限样本</p>
        <h2>把主动收益直接平方平均得到的是 RMS；它同时含稳定偏离与波动，不能在不声明时冒充 centered TE。</h2>
        <div className="equation-card">
          <span>RMS 与样本 TE 的精确关系</span>
          <div>RMS²=Ā²+[(T−1)/T](TE<sup>post</sup>)²</div>
          <p>RMS=√[(1/T)ΣA²]。稳定每期 −10bp 时，RMS=10bp、sample centered TE=0；二者差异正是平均偏离。若供应商使用 T 而非 T−1 作方差分母，关系也要相应调整。</p>
        </div>
        <p>
          短样本 TE 本身高度不确定。十二个月数据可能混合少数再平衡事件、异步估值和一个压力 regime；只报告 2.4% 点估计会制造虚假精度。至少应保存观测数、窗口、缺失值处理、outlier policy、overlapping return 与置信区间或重采样方案，并在比较多个经理时考虑选择偏差。<Cite n={9} /><Cite n={42} />
        </p>
      </section>

      <section className="lesson-section" id="annualization">
        <p className="section-kicker">28 · Annualization 与 Serial Correlation</p>
        <h2>乘 √m 只在单期主动收益近似无自相关、频率稳定且风险状态不变时成立；估值平滑会让简单年化尤其危险。</h2>
        <div className="equation-card">
          <span>含自协方差的 m 期主动收益方差</span>
          <div>Var(Σ<sub>j=1</sub><sup>m</sup>A<sub>t+j</sub>)=m[γ<sub>0</sub>+2Σ<sub>k=1</sub><sup>m−1</sup>(1−k/m)γ<sub>k</sub>]</div>
          <p>γ<sub>k</sub> 是主动收益的 k 阶自协方差。只有所有 k&gt;0 的 γ<sub>k</sub> 近似为零，方差才缩成 mγ<sub>0</sub>，标准差才乘 √m。</p>
        </div>
        <p>
          正自相关会使长期风险高于 naive scaling，负自相关则可能更低；陈旧报价、不同收盘时点、非流动资产 appraisals 和重叠窗口都会改变序列结构。Lo 对 Sharpe ratio 的统计分析虽不直接定义 TE，却精确展示了序列相关怎样破坏简单年化；同样纪律应迁移到 IR 和 tracking-risk 报告。<Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="ex-ante-te">
        <p className="section-kicker">29 · Ex-ante Tracking Error</p>
        <h2>Ex-ante TE 是当前主动权重在预测协方差模型下的条件波动；它是模型输出，不是损失上限或未来实现保证。</h2>
        <div className="equation-card">
          <span>协方差形式</span>
          <div>(TE<sup>ante</sup><sub>t</sub>)²=x<sub>t</sub>′Σ̂<sub>t</sub>x<sub>t</sub></div>
          <p>x 是 current actual active weights；Σ̂ 是与权重 horizon、币种和收益频率匹配的预测协方差矩阵。若计算目标全部成交后的风险，应另用 target x* 并明确标为 scenario。</p>
        </div>
        <p>
          Ex-ante 与 ex-post TE 不同并不自动证明风控错误。组合可能在期间交易，波动和相关性可能改变，风险模型也可能遗漏因子、流动性和非线性。Roll 与 Jorion 的框架帮助理解相对风险几何，但真实预测还必须接受模型验证、压力情景和 total-risk 检查。<Cite n={2} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="covariance-hedge">
        <p className="section-kicker">30 · Covariance、Netting 与 Hedge</p>
        <h2>主动权重相加为零不代表风险为零；真正决定抵消程度的是各资产波动和共同变化结构。</h2>
        <div className="equation-card">
          <span>两资产主动风险</span>
          <div>TE²=x<sub>1</sub>²σ<sub>1</sub>²+x<sub>2</sub>²σ<sub>2</sub>²+2x<sub>1</sub>x<sub>2</sub>ρ<sub>12</sub>σ<sub>1</sub>σ<sub>2</sub></div>
          <p>x<sub>1</sub>=+10%、x<sub>2</sub>=−10%，σ 为 12%/8%、ρ=0.25 时，TE²=0.000160，TE≈1.2649%。净资本权重为零，只说明资金来源与用途平衡。</p>
        </div>
        <p>
          当两个证券高度正相关时，多一只、少另一只可以在资本权重差很大的同时保持较低 TE；当相关性在压力期下降或由正转负，原本的 hedge 会失效。协方差不是固定资产属性，而是估计窗口与 regime 的条件结果。风险系统必须同时报告当前模型、压力相关性和 concentration，而不能把净额抵消当作法律事实。<Cite n={2} /><Cite n={10} />
        </p>
        <div className="equation-card">
          <span>Total risk 与 active risk 的关系</span>
          <div>σ<sub>P</sub>²=σ<sub>B</sub>²+TE²+2Cov(R<sub>B</sub>,A)</div>
          <div>TE²=σ<sub>P</sub>²+σ<sub>B</sub>²−2ρ<sub>PB</sub>σ<sub>P</sub>σ<sub>B</sub></div>
          <p>这里 TE=√Var(A)，σ<sub>P</sub>=√Var(R<sub>P</sub>)、σ<sub>B</sub>=√Var(R<sub>B</sub>)，ρ<sub>PB</sub>=Corr(R<sub>P</sub>,R<sub>B</sub>)，Cov(R<sub>B</sub>,A) 是基准收益与主动收益的协方差；所有量必须采用同一币种、频率、窗口及 centered 方差／协方差分母。由 R<sub>P</sub>=R<sub>B</sub>+A 可知，TE=0 只表示样本内 A 为常数，这个常数可以非零；只有再加 TD̄=0，才推出每期 A=0、组合与 benchmark 的单期收益路径相同。即使精确复制，高波动或高度集中的 benchmark 仍可使 σ<sub>P</sub>很高。</p>
        </div>
      </section>

      <section className="lesson-section" id="factor-specific">
        <p className="section-kicker">31 · Factor 与 Specific Risk</p>
        <h2>因子模型把成千上万只证券的主动风险压缩成共同暴露与特异残差；压缩提高可解释性，也引入模型遗漏。</h2>
        <div className="equation-card">
          <span>主动风险因子分解</span>
          <div>r=Bf+ε，Cov(f,ε)=0；　TE²=x′BFB′x+x′Dx=g′Fg+x′Dx，　g=B′x</div>
          <p>r 是证券收益向量，f 是因子收益向量，ε 是证券残差收益向量；B 是证券对因子的暴露矩阵，F 是因子收益协方差，D 是残差协方差的对角近似，g 是组合主动因子暴露。上式显式采用因子与残差正交的 Cov(f,ε)=0 假设；若残差彼此相关，应以完整 Ω<sub>ε</sub> 取代 D；若因子与残差也不正交，还必须再加入交叉项 2g′Cov(f,ε)x。F 与 D／Ω<sub>ε</sub> 必须和 r、TE 使用同一币种、收益频率与预测期限。</p>
        </div>
        <p>
          一个证券层 Active Share 很高的组合，如果行业、beta、duration 和主要风格因子相互抵消，模型 TE 可以很低；但这也可能只是模型把真正共同风险当作“特异”。风险解释应展示 factor names、exposure units、covariance vintage、specific-risk floor 和 unexplained P&amp;L，而不是只给一个合计数字。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="active-risk-contribution">
        <p className="section-kicker">32 · Active-risk Contribution</p>
        <h2>风险贡献把当前 TE 对各主动暴露的局部敏感度分解；它解释“哪里占用风险”，不自动决定卖谁。</h2>
        <div className="equation-card">
          <span>Euler contribution</span>
          <div>MCTR<sub>i</sub>=(Σx)<sub>i</sub>/TE；　RC<sub>i</sub>=x<sub>i</sub>MCTR<sub>i</sub>；　ΣRC<sub>i</sub>=TE</div>
          <p>MCTR 是对主动权重的边际 TE，RC 是 component contribution。等式要求 Σ 固定、TE&gt;0 且风险函数可微；RC 可以为负，表示该暴露在当前组合中提供局部对冲。</p>
        </div>
        <p>
          因为净投资、行业、long-only 和流动性约束把资产连接在一起，减少一个高 RC 头寸通常还需要资金去向与替代交易。若协方差在交易后改变，原排序也会变化。因此 risk contribution 是诊断与优化输入，不是从最大数值直接生成卖单的规则；真正动作仍须经过 2.16 的 authority 和本节的 target/order/fill。<Cite n={7} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="model-risk">
        <p className="section-kicker">33 · Model Risk 与 Stress</p>
        <h2>Ex-ante TE 的精确小数来自估计模型，而不是精确世界；最危险的状态通常是模型相关性与流动性同时失真。</h2>
        <p>
          协方差窗口可能过短而追逐噪声，也可能过长而错过 regime；新证券历史不足、期权非线性、债券陈旧价格、币种收盘不同、缺失值填充和 corporate-action errors 都能制造虚假风险。Pope–Yadav 对 tracking-error estimation 的批评提醒我们：数据清洗不是模型之外的技术环节，它直接定义被测量的风险。<Cite n={9} />
        </p>
        <p>
          最小验证应比较多个 horizon 与模型、历史 realized active return、factor P&amp;L、持仓变更、压力相关性、liquidity-adjusted scenario 和 benchmark version。模型失准时的正确响应不一定是增加或减少主动风险；先要识别是数据、映射、持仓、模型还是市场状态发生变化。
        </p>
      </section>

      <section className="lesson-section" id="te-budget-limit">
        <p className="section-kicker">34 · TE Budget、Forecast、Limit 与 Breach</p>
        <h2>预算、预测、预警和硬限额是四种治理状态；把它们压成一个“3%阈值”会让风险报告无法行动。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="TE 治理状态，可横向滚动">
          <table className="concept-table">
            <caption>相对风险数字在治理中的不同作用</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">含义</th><th scope="col">触发后</th></tr></thead>
            <tbody>
              <tr><th scope="row">Risk appetite / budget</th><td>愿意分配多少主动风险容量</td><td>不要求必须用满</td></tr>
              <tr><th scope="row">Forecast usage</th><td>当前模型估计用了多少</td><td>可因市场而变，无需发生交易</td></tr>
              <tr><th scope="row">Warning threshold</th><td>提前升级审查的管理线</td><td>校验、归因与计划</td></tr>
              <tr><th scope="row">Formal limit</th><td>mandate 或制度约束</td><td>按文件调整、对冲、例外或升级</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个理想化 benchmark-aware 组合可写为 max α′x−(λ/2)x′Σx−C(Δq)，并受 x′Σx≤τ²、净投资、long-only、行业、换手与流动性约束。这里 x 是候选交易后的主动权重，α 是与优化期限一致的预期主动收益向量，Σ 是同一币种、收益频率与期限下的预测协方差矩阵，Δq 是有符号候选交易数量，C(Δq) 是已除以 NAV、以收益率表示的预计交易成本。因为 α′x 是收益率、x′Σx 是收益率平方，λ 采用使风险惩罚与其余目标项单位一致的系数；τ 与 TE 同为该期限的收益波动率。τ 是最大允许相对风险，不是目标收益，也不是止损。只有忽略成本和其他约束时，绑定 TE cap 才近似缩放 Σ<sup>−1</sup>α 的方向；现实会出现角点、影子价格与不连续目标。<Cite n={10} /><Cite n={11} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="breach-governance">
        <p className="section-kicker">35 · Breach Governance</p>
        <h2>TE 超限首先是治理事件，不是自动卖出指令；同一读数可以对应模型校验、对冲、换仓、等待流量或正式例外。</h2>
        <div className="causal-chain" aria-label="Tracking-error 超限治理链" role="list">
          <div role="listitem"><span>01</span><b>Detect</b><p>确认阈值、时点与责任主体。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Validate</b><p>价格、持仓、benchmark 与模型。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>Attribute</b><p>主动暴露、市场变化与在途单。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Decide</b><p>调整、hedge、等待或申请例外。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Authorize</b><p>形成批准 target 与期限。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Execute</b><p>order、fill、成本与复核。</p></div>
        </div>
        <p>
          中国证监会 2026 指引的超阈值安排保留在规定期限内调整与投资决策委员会审议突破等治理路径，正好说明监测指标不会直接编码成某只证券的市场单；协会细则又把 TE、IR、主动比率等列为可选持续监测指标，而非统一公式。适用基金仍须读完整文件、合同和分期条款，教材只提取一般机制。<Cite n={44} /><Cite n={46} />
        </p>
      </section>

      <section className="lesson-section" id="active-share">
        <p className="section-kicker">36 · Active Share</p>
        <h2>Active Share 测量有多少资本权重被移到 benchmark 之外；它不读取协方差，也不判断这些移动是否正确。</h2>
        <div className="equation-card">
          <span>持仓距离</span>
          <div>AS=(1/2)Σ<sub>i</sub>|w<sub>i</sub>−b<sub>i</sub>|</div>
          <p>1/2 避免把从 underweight 资产移出的资本和加到 overweight 资产的资本计算两次。50/20/30 相对 40/40/20 的 AS 为 1/2×(10+20+10)%=20%。</p>
        </div>
        <p>
          Active Share 的价值是补充 TE：两只高相关同行业股票之间的替换可能产生高持仓偏离、低相对风险；一小笔高波动、低相关集中偏离又可能产生低 AS、高 TE。Cremers–Petajisto 提出的历史预测关系需要与样本、费用和 benchmark choice 一起理解，不能把定义升级成技能标签。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="active-share-domain">
        <p className="section-kicker">37 · Active Share 的适用域</p>
        <h2>0–100% 的直觉只在 long-only、全额投资、同一资产全集成立；空头、杠杆、现金和衍生品都要求先定义映射。</h2>
        <p>
          若 portfolio 和 benchmark 都是 nonnegative 且各自权重和为 1，AS 位于 0 与 1 之间：0 表示持仓权重完全相同，1 表示两者没有共同资本权重。允许 short 或 gross leverage 后，Σ|w−b| 可以超过 2，AS 也可超过 100%。若期货用零市值却提供大 notional exposure，单纯资本权重 AS 会忽略经济风险；若强行把 notional 当资本，又可能与现货不可比。
        </p>
        <p>
          基准错配也会机械提高 AS。一个 small-value mandate 若错误地相对 broad-market index 计算，风格本身会表现为高主动度，即使经理紧贴真正机会集。报告必须同时给出 benchmark role、universe mapping、cash/derivative policy 和 off-benchmark treatment。<Cite n={13} /><Cite n={16} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="active-share-te">
        <p className="section-kicker">38 · Active Share × Tracking Error</p>
        <h2>AS 与 TE 是两维坐标：前者看资本距离，后者看收益协方差；四个象限都可能出现，也都不足以证明未来业绩。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="Active Share 与 Tracking Error 四象限，可横向滚动">
          <table className="concept-table">
            <caption>持仓偏离与相对风险的二维解释</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">一种可能机制</th><th scope="col">仍需检查</th></tr></thead>
            <tbody>
              <tr><th scope="row">低 AS / 低 TE</th><td>紧密复制或小幅增强</td><td>费用、披露、mandate 与净 TD</td></tr>
              <tr><th scope="row">高 AS / 低 TE</th><td>相关替代、行业／因子中性选股</td><td>模型遗漏与基准适当性</td></tr>
              <tr><th scope="row">低 AS / 高 TE</th><td>少数高风险集中偏离或期权</td><td>非线性、tail 与 concentration</td></tr>
              <tr><th scope="row">高 AS / 高 TE</th><td>广泛持仓与风险暴露均显著偏离</td><td>净 alpha、成本、容量与治理</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Petajisto 使用二维关系描述主动风格，Frazzini–Friedman–Pomorski 则展示 benchmark choice 与样本设计可削弱 Active Share 的无条件预测主张。教材把二维图用于诊断“主动资本在哪里、风险从哪里来”，不会把任一象限改名为投资建议。<Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="information-ratio">
        <p className="section-kicker">39 · Information Ratio</p>
        <h2>Information ratio 把平均主动收益除以主动收益波动，回答每单位相对风险获得了多少历史或预期补偿。</h2>
        <div className="equation-card">
          <span>同口径 IR</span>
          <div>IR=E[A]/√Var(A)；　IR̂=Ā/TE<sup>post</sup></div>
          <p>分子和分母必须使用同一 benchmark、gross/net basis、币种、频率、窗口和年化规则。Ā=1.8%、TE=3% 时，IR=0.60。</p>
        </div>
        <p>
          IR 与 Sharpe ratio 不同：Sharpe 的分子通常是相对无风险利率的组合收益，分母是总波动；IR 的分子是 active return，分母是 tracking risk。Grinold 的 fundamental law 在理想条件下把 IR 与 information coefficient 和独立机会数连接，但现实约束、成本和相关信号会使可实现 IR 低于理想值。<Cite n={5} /><Cite n={6} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="ir-boundaries">
        <p className="section-kicker">40 · IR 的统计与解释边界</p>
        <h2>TE 为零时 IR 未定义；TE 很小时比率极不稳定，历史高 IR 也可能来自幸运、错配基准或平滑估值。</h2>
        <p>
          如果每期 active return 都为 +10bp，centered TE 为 0，样本 IR 不是“无穷大技能”，而是分母为零、统计量未定义。若 TE 仅因短样本或 stale prices 很小，一次修正就会重写比率。不同经理之间还存在多重比较：从几百只基金挑最高 IR，最高值天然受到 selection bias。Lo 与 Ledoit–Wolf 对风险调整绩效统计的研究说明，点估计之外还需要序列相关、有限样本和稳健检验；迁移到 IR 时，benchmark 与 active-return 定义也要同步冻结。<Cite n={12} /><Cite n={42} />
        </p>
        <div className="precision-note">
          <span>IR 是结果摘要，不是结构参数</span>
          <p>它不能说明 active return 来自证券选择、因子、时点、杠杆还是成本，也不能告诉投资者未来可投入多少资本。要从比率进入决策，还需 attribution、capacity、turnover、tail risk 和 out-of-sample stability。</p>
        </div>
      </section>

      <section className="lesson-section" id="td-attribution">
        <p className="section-kicker">41 · Tracking Difference Attribution</p>
        <h2>Tracking difference 只有拆成可对账来源，才知道偏离来自产品设计、基准口径、复制选择还是执行失误。</h2>
        <div className="equation-card">
          <span>最小实施归因</span>
          <div>TD≈fees+tax basis+cash drag+sampling+rebalance+execution+derivatives+lending+residual</div>
          <p>每项带正负号，且只能在未被证券收益或 NAV 重复计入时加入。Residual 是实际 TD 减全部已解释项；它需要调查，不能自动命名为 alpha。</p>
        </div>
        <p>
          例如指数基金相对 gross total-return index 的净 TD 为 −0.35%，费用 −0.20%、预扣税口径差 −0.08%、交易与再平衡成本 −0.09%、证券借贷收入 +0.04%，已解释 −0.33%，残差 −0.02%。稳定实施拖累与低 TE 完全相容；这组数据不支持“经理做了 0.35% 的失败主动押注”。指数基金研究可帮助列举组件，真正产品仍需逐日 holdings、flow、corporate actions 和 NAV 对账。<Cite n={29} /><Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="fees-tax-lending">
        <p className="section-kicker">42 · Fees、Tax 与 Securities Lending</p>
        <h2>费用和税往往形成稳定负中心，证券借贷可以抵消一部分；口径不一致会把制度差异伪装成投资技能。</h2>
        <p>
          一个 gross total-return index 通常假设股息完全再投资且不扣管理费；真实基金可能承担管理费、托管费、交易税和预扣税。Net total-return index 又采用特定投资者税率假设，未必等于基金的法定身份。证券借贷收入可补偿费用，但还伴随抵押品、counterparty、recall 和 revenue split。报告必须把基金 gross/net return、指数 price/gross/net TR 和投资者税务身份并列。
        </p>
        <p>
          稳定 20bp 费用拖累主要降低平均 TD，不必提高 centered TE；可变的借贷收入、税 reclaim、turnover 和 corporate action 才会增加路径离散。Elton 等显示同一指数产品也可因费用和实施产生持久差异，但历史结果不能代替当前 fee schedule、借贷政策和税务文件。<Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="flow-cash-drag">
        <p className="section-kicker">43 · Flow、Cash Drag 与权重稀释</p>
        <h2>资金流可以在主动权重不变时产生真实订单，也可以在没有即时现货交易时改变相对风险；必须沿现金与成交路径判断。</h2>
        <p>
          指数基金 AUM 从 100 增至 110，即使目标仍精确等于 benchmark，也需要把新增 10 按权重投入；因此 x=0 不等于 order=0。流入先停留现金时，基金会暂时 underweight 风险资产并形成 cash drag；期货可先恢复 beta，却留下 basis、roll 和 collateral 差异。流出又可用现金、按比例卖出、liquidity-first、期货或 in-kind 处理，每条路径对 active weights 和 TE 的影响不同。
        </p>
        <div className="equation-card">
          <span>Flow 后规模</span>
          <div>AUM<sub>t</sub>=AUM<sub>t−1</sub>(1+R<sub>P,t</sub>)+F<sub>t</sub></div>
          <p>这是把 F 约定在期末发生的简化式；F 是 external net flow。它不等于 gross redemption，更不直接指定哪只证券交易；期中流量需要额外 timing adjustment。2.17 的 cash waterfall 先决定可用资金，本节再计算处置后的 relative state。</p>
        </div>
        <p>
          委托资金流与价格压力的经验研究说明 flow-induced trades 可能影响证券价格，但需要实际持仓、交易方向和可信反事实。不能仅用基金 AUM 变化推断 benchmark 造成的市场冲击。<Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="index-reconstitution">
        <p className="section-kicker">44 · Rebalance、Reconstitution 与 Market-cap Drift</p>
        <h2>成份重构和规则化权重重置会改变目标；纯价格漂移在市值加权指数中通常让指数与精确 tracker 同步变化，不会单独迫使追涨。</h2>
        <p>
          <b>Reconstitution</b> 改变成份全集或资格，<b>rebalance</b> 按既定规则重置权重，<b>corporate action</b> 处理增发、合并、拆分、分红等事件。它们都有公告、参考日、生效日和交易执行窗口。指数管理人可以通过 divisor 或 shares adjustment 保持指数连续；基金则需买卖、接受证券或现金并承担成本。<Cite n={60} /><Cite n={62} /><Cite n={63} /><Cite n={64} /><Cite n={66} />
        </p>
        <div className="precision-note">
          <span>为什么市值上涨不自动要求 tracker 追买</span>
          <p>A/B 初始市值和权重为 60/40。A 上涨 25%、B 不变后，价值变为 75/40，指数权重与精确复制组合都自发变成 65.217%/34.783%。若无流量、成份／股本规则变化、非市值权重重置或复制误差，纯涨价本身产生的必要交易是 0。</p>
        </div>
      </section>

      <section className="lesson-section" id="replication-methods">
        <p className="section-kicker">45 · Full Replication、Sampling 与 Optimization</p>
        <h2>复制方式是在实施成本与相对风险之间选择，不存在对所有规模、资产和市场状态都最优的一种方法。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="指数复制方式比较，可横向滚动">
          <table className="concept-table">
            <caption>复制方法改变 tracking state 的路径</caption>
            <thead><tr><th scope="col">方法</th><th scope="col">主要收益</th><th scope="col">主要偏离来源</th></tr></thead>
            <tbody>
              <tr><th scope="row">Full replication</th><td>持仓直观、模型依赖较低</td><td>尾部证券成本、lot、税与再平衡</td></tr>
              <tr><th scope="row">Stratified sampling</th><td>减少证券数并保留关键分层</td><td>层内选择、非线性和尾部遗漏</td></tr>
              <tr><th scope="row">Optimization</th><td>显式权衡 TE、成本与约束</td><td>协方差／成本模型和角点</td></tr>
              <tr><th scope="row">Synthetic / futures bridge</th><td>快速获得 beta、吸收现金流</td><td>basis、roll、counterparty 与 collateral</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          优化器最小化的可能是 ex-ante TE、预期交易成本或两者加权，而投资者最后观察的是净 TD 与 ex-post TE。模型若低估某些成份的相关性变化，事前看似最优的 sampling 会在压力期失真。Rudolf 等给出线性化跟踪模型，Frino–Gallagher 则展示实施摩擦；两类证据分别是决策模型与历史结果，不能互相替代。<Cite n={43} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="execution-slippage">
        <p className="section-kicker">46 · Execution Slippage</p>
        <h2>指数规则确定目标，不确定真实成交价格；预交易、收盘拥堵、参与率和未成交量共同决定实施 shortfall。</h2>
        <p>
          公开再平衡让市场知道未来潜在目标，套利者可能提前买入纳入证券、卖出剔除证券；tracker 若等到生效日收盘，能降低 closing benchmark mismatch，却可能在最拥挤时成交；提前交易可降低冲击，却承担价格和成份变更风险。交易台必须在 benchmark-price risk、market impact、spread、信息泄露和完成确定性之间选择。
        </p>
        <div className="equation-card">
          <span>含未成交机会成本的 Implementation Shortfall</span>
          <div>IS=[Σ<sub>i</sub>s<sub>i</sub>Q<sub>i</sub><sup>fill</sup>(P<sub>i</sub><sup>exec</sup>−P<sub>i</sub><sup>dec</sup>)+Σ<sub>i</sub>s<sub>i</sub>Q<sub>i</sub><sup>unfilled</sup>(P<sub>i</sub><sup>end</sup>−P<sub>i</sub><sup>dec</sup>)+fees]/AUM</div>
          <p>Q<sup>fill</sup> 与 Q<sup>unfilled</sup> 都是非负证券数量，s=+1 表示买入、s=−1 表示卖出；P<sup>dec</sup> 是决定价格，P<sup>exec</sup> 是成交量加权执行价格，P<sup>end</sup> 是评价期末价格，fees 是货币金额。分子各项均为同一货币金额，除以 AUM 后成为收益率；正 IS 表示成本。进一步归因可把它拆为 delay、market movement、impact、fees 与 opportunity cost，但未成交量绝不能按零成本处理。</p>
        </div>
        <p>
          Gastineau、Madhavan 及早期指数事件研究显示公开时钟可以形成实施成本与价格压力，但公告提前、套利资本和指数规则会变化。任何当前冲击估计都必须使用当期成交数据，不能搬用历史平均。<Cite n={32} /><Cite n={33} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="derivative-overlay">
        <p className="section-kicker">47 · Derivative Overlay</p>
        <h2>衍生品可以迅速改变 benchmark-relative exposure，却让资本权重、风险权重、现金和 P&amp;L 分属不同账本。</h2>
        <p>
          股指期货可把现金流临时 equitize，利率期货和 swaps 可调整 duration，外汇远期可改变 hedge ratio，options 又引入 delta、gamma、vega 与 path dependence。若只看现货 holdings，基金似乎持有高现金且 underweight benchmark；若只看 delta-adjusted exposure，又会漏掉 collateral、basis、roll、counterparty 和非线性尾部。
        </p>
        <p>
          最小报告应并列 actual NAV holdings、derivative notional、delta/DV01/factor-equivalent exposure、margin/collateral、target overlay、in-flight orders 和 P&amp;L attribution。Ex-ante TE 也需要能处理非线性或至少给出局部线性化与 stress；单一 covariance number 不足以描述 option portfolio。<Cite n={7} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="currency-hedge">
        <p className="section-kicker">48 · Currency 与 Hedge Basis</p>
        <h2>本币、基准币和投资者报告币可以不同；hedged 与 unhedged index 是不同反事实，不是显示设置。</h2>
        <p>
          一只美元资产对人民币投资者的回报包含资产本币收益与 USD/CNY 变化；currency-hedged benchmark 还包含远期点、hedge ratio、再平衡和交易成本。若组合按月对冲、指数按日对冲，哪怕名义 hedge ratio 相同也会产生 TD 与 TE。跨市场假日和不同 closing time 还会制造异步回报。
        </p>
        <p>
          因而 benchmark passport 必须记录 base currency、conversion rate source/time、hedged/unhedged、hedge frequency、forward tenor 和 collateral treatment。MSCI 的 calculation methodology 分开价格、总收益、净收益与货币计算，说明“同一个指数”在不同 suffix 下可以是不同经济路径。<Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="bond-illiquid-benchmark">
        <p className="section-kicker">49 · Bond 与 Illiquid-asset Benchmark</p>
        <h2>债券成份多、交易稀疏、到期滚动且价格来源异质，使“精确复制”和日度 TE 比股票指数更依赖估值与模型。</h2>
        <p>
          债券指数会按评级、期限、发行规模、币种和剩余期限筛选，成份随新发行与到期持续变化；基金受 lot、dealer inventory、税和发行可得性约束，通常采用 sampling 与 duration/spread/key-rate mapping。指数使用 evaluated prices、基金使用可执行报价或不同估值时点时，观测 active return 会包含 price-source mismatch。高频低 TE 可能只是双方使用相似平滑估值，也可能因异步标价而虚高。
        </p>
        <p>
          私募资产、房地产或负债 benchmark 的 appraisals 更低频，机械 √m 年化和日度协方差尤其不可靠。应增加 cash-flow matching、duration、spread beta、liquidity、valuation lag 和 scenario shortfall，而不是只把股票公式换一个资产名称。<Cite n={9} /><Cite n={12} /><Cite n={43} />
        </p>
      </section>

      <section className="lesson-section" id="performance-attribution">
        <p className="section-kicker">50 · Performance Attribution</p>
        <h2>Brinson–Fachler 把单期主动收益按配置、选择与交互分解；它是严格账面恒等式，不是经理技能的因果证明。</h2>
        <div className="equation-card">
          <span>单期 sector j 的三项</span>
          <div>Allocation<sub>j</sub>=(W<sub>P,j</sub>−W<sub>B,j</sub>)(R<sub>B,j</sub>−R<sub>B</sub>)</div>
          <div>Selection<sub>j</sub>=W<sub>B,j</sub>(R<sub>P,j</sub>−R<sub>B,j</sub>)</div>
          <div>Interaction<sub>j</sub>=(W<sub>P,j</sub>−W<sub>B,j</sub>)(R<sub>P,j</sub>−R<sub>B,j</sub>)</div>
          <p>W 是 sector 权重，R 是 sector 或总 benchmark return。在一致期初权重和单期算术口径下，三项跨 sector 加总为 active return。</p>
        </div>
        <p>
          科技／其他 benchmark 权重 60/40、收益 10%/2%，portfolio 权重 70/30、sector 收益 12%/1% 时，benchmark 为 6.8%、portfolio 为 8.7%、active return 为 1.9%；allocation 0.8%、selection 0.8%、interaction 0.3%，恰好闭合。多期链接、外汇、衍生品和固定收益需要专门归因；经典 BHB 研究更不能被误述为“资产配置创造 90% 收益”。<Cite n={17} /><Cite n={18} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="risk-cost-attribution">
        <p className="section-kicker">51 · Performance、Risk 与 Cost Attribution</p>
        <h2>收益归因解释已经发生的差额，风险归因解释当前模型敏感度，成本归因解释实施路径；三者时间方向不同。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="三类归因比较，可横向滚动">
          <table className="concept-table">
            <caption>同一主动组合的三本解释账</caption>
            <thead><tr><th scope="col">归因</th><th scope="col">时间方向</th><th scope="col">核心输入</th><th scope="col">不能证明</th></tr></thead>
            <tbody>
              <tr><th scope="row">Performance</th><td>实现后</td><td>权重、收益与链接规则</td><td>技能因果</td></tr>
              <tr><th scope="row">Risk</th><td>当前／前瞻</td><td>actual exposure 与风险模型</td><td>未来实际损失</td></tr>
              <tr><th scope="row">Cost</th><td>决策至成交</td><td>decision/order/fill/benchmark prices</td><td>若不交易的完整反事实</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          三本账应共享 trade ID、holding vintage、benchmark version 和 currency basis，才能回答“某项主动观点预期占用多少风险、怎样成交、最终贡献多少净收益”。如果 performance 用月底持仓、risk 用实时持仓、cost 用另一 benchmark price 却无映射，漂亮的分解图也无法闭合。<Cite n={7} /><Cite n={17} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="incentive-feedback">
        <p className="section-kicker">52 · Performance Evaluation、Career Concern 与 Risk Shifting</p>
        <h2>相对评价既能约束经理偏离授权，也可能在非线性奖励、资金流和解聘风险下改变行为；方向取决于状态，不是“落后必然赌博”。</h2>
        <p>
          委托人无法实时观察经理努力与能力，benchmark 使市场 beta 与部分授权风险可被剥离，从而改善问责；明确 benchmark 甚至可以抵消某些隐性风险激励。另一方面，基金公司收入常与 AUM 相关，经理又面对奖金阈值、同行排名、声誉与解聘。若资金流对相对业绩凸，某些落后状态会提高追加风险的期权价值；若进一步落后带来的失业成本足够高，同一经理反而会去风险。<Cite n={21} /><Cite n={22} /><Cite n={23} /><Cite n={24} />
        </p>
        <div className="equation-card">
          <span>教学性的状态依赖选择</span>
          <div>E[bonus−career cost | risky]=pB−(1−p)φ−risk cost</div>
          <p>p 是追上阈值的概率，B 是奖金，φ 是进一步落后的职业成本。φ、风险厌恶或剩余期限变化，最优方向就可能翻转。公式只展示机制，不是行业薪酬估计。</p>
        </div>
        <p>
          中国基金业协会 2026 绩效考核指引强调三年以上长周期并按岗位设置差异化指标权重，说明真实激励来自组织制度而不是抽象“相对收益”四个字；具体岗位比例不能扩写为所有人员和产品的统一标准。<Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-change-gaming">
        <p className="section-kicker">53 · Benchmark Change、Misfit 与 Gaming</p>
        <h2>适当基准应随 mandate 的真实变化而调整，但事后为改善历史成绩更换坐标会破坏反事实；治理必须区分两者。</h2>
        <p>
          市场结构、产品战略或可用指数可能变化，原 benchmark 因而不再有代表性。正当变更需要记录原因、批准主体、新旧方法、有效日、持有人程序、过渡交易、历史呈现和是否同时展示旧基准；不正当 gaming 则是在看到结果后选择更容易跑赢的 comparator，或让风险 benchmark 与费用 benchmark 各取有利口径。
        </p>
        <p>
          Sensoy 的 mismatch 研究说明错误 benchmark 会扭曲评价；中国 2026 指引、Form N-1A 与 GIPS 指引分别在不同法律／职业层级要求或鼓励基准选择和变更透明。它们不能互相替代，却共同支持“事前规则、可追溯版本、变更解释”这一治理原则。<Cite n={16} /><Cite n={44} /><Cite n={50} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-ladder">
        <p className="section-kicker">54 · 从共同基准到价格反馈的证据阶梯</p>
        <h2>共享 benchmark 只证明一个共同参考点；要声称 crowding 或价格冲击，必须逐级观察更接近市场的状态。</h2>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="Benchmark 价格反馈证据阶梯，可横向滚动">
          <table className="concept-table">
            <caption>每一级证据最多支持到哪里</caption>
            <thead><tr><th scope="col">级别</th><th scope="col">可观察证据</th><th scope="col">最多支持</th></tr></thead>
            <tbody>
              <tr><th scope="row">1 · Rule</th><td>指数方法、公告、目标权重</td><td>适用 benchmark state 将改变</td></tr>
              <tr><th scope="row">2 · Exposure</th><td>AUM、事前持仓、active weights</td><td>潜在目标缺口</td></tr>
              <tr><th scope="row">3 · Governance</th><td>limit、授权、target、例外</td><td>主体希望怎样响应</td></tr>
              <tr><th scope="row">4 · Execution</th><td>orders、fills、时间与成本</td><td>真实 order flow</td></tr>
              <tr><th scope="row">5 · Market</th><td>深度、对手盘、可信对照与反转</td><td>相对可信的价格因果</td></tr>
              <tr><th scope="row">6 · Feedback</th><td>后续 TE、flow、margin 与二轮 fills</td><td>动态放大或衰减</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          指数纳入后价格上涨并不能证明“所有被动基金在收盘买入并造成全部涨幅”；主动基金可能已超配而卖出、维持目标而不交易，套利者也可能提前响应。早期事件研究、权重调整设计和 Russell cutoff 的回归不连续分别提供不同强度证据；局部识别、公告提前和市场适应使冲击不可能是跨时代常数。<Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="causal-protocol">
        <p className="section-kicker">55 · 可证伪研究协议</p>
        <h2>把“benchmarking 导致 herding”拆成多个可失败的中间假设；任何断链都必须降低因果语言。</h2>
        <ol className="research-protocol">
          <li><b>冻结制度：</b>保存 mandate、benchmark role/code/version、方法公告、生效时点和当期有效规则。</li>
          <li><b>定义暴露：</b>重建 actual、target、in-flight holdings，统一现金、衍生品、币种与 off-benchmark mapping。</li>
          <li><b>识别共同触发：</b>区分指数调整、flow、TE/model shock、绩效考核、基本面新闻和其他同时冲击。</li>
          <li><b>证明约束绑定：</b>观察风险 usage、warning/limit、例外权和真正授权；共享 benchmark 本身不够。</li>
          <li><b>重建目标：</b>估计每类基金原 active weight 与新目标，允许 active fund 买、卖或不动。</li>
          <li><b>观察执行：</b>使用 order/fill、时间、venue、direction、partial fill 与 settlement，不用 target AUM 代替成交。</li>
          <li><b>冻结市场容量：</b>测量当时 depth、spread、dealer/intermediary capacity、套利者和其他自然对手盘。</li>
          <li><b>建立反事实：</b>使用 cutoff/RDD、无信息权重变动、matched securities、预趋势、placebo 和事件后反转。</li>
          <li><b>检验异质性：</b>按 passive、benchmark-aware active、performance-only、原持仓、流量和规模分组。</li>
          <li><b>追踪反馈：</b>检查价格变化是否再改变权重、TE、flow、授权和第二轮 fills，并报告衰减条件。</li>
        </ol>
        <div className="precision-note">
          <span>最小可证伪问题</span>
          <p>在指数规则阈值附近、基本面连续的证券中，事前 benchmark-sensitive ownership 较高且原目标缺口同向的基金，是否在生效窗口产生更高 actual net buy fills；这一差异是否随执行同步度和有限深度增强，并在窗口后部分反转？持仓已超配、获例外或只把指数用于披露的基金是否构成预先规定的反例组？</p>
        </div>
        <p>
          Pavlova–Sikorskaya、Chang–Hong–Liskovich 等提供 benchmark intensity 或 cutoff 附近的识别思路，Cuoco–Kaniel 与 Kashyap 等提供均衡机制；经验局部结果和结构模型各自支持不同箭头，不能拼成无条件事实。<Cite n={25} /><Cite n={26} /><Cite n={27} /><Cite n={28} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">56 · Benchmark, Active Risk &amp; Evidence Lab</p>
        <h2>十道唯一答案题把 benchmark role、return basis、actual holding、TD、TE、Active Share、IR 与证据阶梯放回同一账本。</h2>
        <p>
          Mode A 的五题依次核算 policy benchmark return、部分成交后的 actual active weights、n−1 ex-post TE、两资产 ex-ante TE、Active Share 与 IR；Mode B 的五题判断 AS/TE 是否冲突、稳定 TD 如何归因、policy/manager benchmark 层级、指数纳入证据最多到哪一步，以及 current TE 应读取 actual 还是 target。题目不预选答案，提交后才显示诊断；本设备记录含 schema 校验、损坏恢复和两步重置。<Cite n={1} /><Cite n={10} /><Cite n={13} /><Cite n={17} />
        </p>
        <BenchmarkLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">57 · 主动练习 · 十道无脚本迁移题</p>
        <h2>静态孪生与 Lab 共用同一机制，但更换数字或场景；先写 benchmark passport 和状态，再看答案。<Cite n={1} /><Cite n={9} /></h2>
        <div className="practice-grid">
          {benchmarkScenarios.map((scenario, index) => (
            <details className="understanding-check" key={scenario.id + '-static'}>
              <summary>{String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</summary>
              <p><b>题目：</b>{scenario.staticTwin.prompt}</p>
              <p><b>答案：</b>{scenario.staticTwin.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">58 · 十四道理解检查与最小术语桥</p>
        <h2>如果你仍会从“有共同 benchmark”直接跳到“所有机构同时买卖”，就还没有完成本节。<Cite n={2} /><Cite n={21} /><Cite n={24} /><Cite n={28} /></h2>
        <details className="understanding-check"><summary>01 · Index 与 benchmark 为什么不等价？</summary><p>Index 是按方法计算的序列；benchmark 是某项 mandate 中被赋予 policy、construction、risk、performance 或 fee 角色的参考。一个指数可不是该基金基准，基准也可以不是可交易指数。</p></details>
        <details className="understanding-check"><summary>02 · Form N-1A 使用 broad-based index 是否证明基金按它构建？</summary><p>否。该规则首先是业绩披露 comparator；是否进入持仓和风险构建仍需 mandate、实际系统和治理证据。</p></details>
        <details className="understanding-check"><summary>03 · 为什么 Σx=0 不等于 TE=0？</summary><p>Σx=0 只表示在完整全额投资 universe 中资本超配与低配相抵；TE 还取决于各资产波动和协方差。</p></details>
        <details className="understanding-check"><summary>04 · 稳定每期落后 10bp，TE 能否为零？</summary><p>能。平均 TD 为 −10bp，centered ex-post TE 为零；若用 RMS，结果则为 10bp，所以必须声明 estimator。</p></details>
        <details className="understanding-check"><summary>05 · TE 为零是否代表组合无风险？</summary><p>否。精确复制一个年波动 25% 的集中 benchmark 可以 TE=0，却仍承担 25% 左右的总波动和集中风险。</p></details>
        <details className="understanding-check"><summary>06 · Ex-ante 与 ex-post TE 不同是否证明模型错误？</summary><p>不一定。持仓、协方差、流量、成本和市场状态在期间都可能改变；应先重建信息集和组合路径，再判断模型误差。</p></details>
        <details className="understanding-check"><summary>07 · TE breach 能否推导出卖哪只股票？</summary><p>不能。先验证数据、benchmark 和模型，再归因、选择调整／hedge／等待／例外、批准 target，最后才可能形成 order 和 fill。</p></details>
        <details className="understanding-check"><summary>08 · Active Share 相同，TE 是否相同？</summary><p>否。AS 不看协方差；相同资本偏离可以落在高度相关替代品或低相关高波动资产上，产生完全不同 TE。</p></details>
        <details className="understanding-check"><summary>09 · 高 Active Share 是否证明高技能或未来超额收益？</summary><p>否。还需要正确 benchmark、信息质量、成本、容量和样本外证据；文献本身也存在支持与复核反例。</p></details>
        <details className="understanding-check"><summary>10 · 市值加权成份上涨为何不迫使精确 tracker 追买？</summary><p>价格上涨同时提高指数成份市值和 tracker 持仓市值，二者权重自发同步漂移。交易来自 flow、重构、股本／公司行动、非市值重置或已有误差。</p></details>
        <details className="understanding-check"><summary>11 · 指数新增 2% 权重，原持有 3% 的主动基金必然买吗？</summary><p>否。若目标 active weight 为 0，它可能卖至 2%；目标仍 +1% 时可不动；目标 +2% 时才会买至 4%。</p></details>
        <details className="understanding-check"><summary>12 · Brinson attribution 加总闭合是否证明技能？</summary><p>否。它按规则分解实现 active return；因子、时点、成本、选择偏差和反事实仍需另外识别。</p></details>
        <details className="understanding-check"><summary>13 · 落后 benchmark 的经理是否一定加风险？</summary><p>否。奖金凸性可能鼓励 risk shifting，解聘惩罚、风险厌恶、剩余期限和约束又可能促使去风险；方向取决于状态与合同。</p></details>
        <details className="understanding-check"><summary>14 · 共同 benchmark 何时才可能形成价格反馈？</summary><p>还需相似实际／目标头寸、共同触发、绑定约束或相似激励、同向 target、同步 actual fills 与有限深度；任何断链都削弱结论。</p></details>

        <div className="glossary-grid">
          <article><span>Benchmark</span><p>在某项授权中用于政策、构建、风险、评价或费用的事前参考坐标。</p></article>
          <article><span>Index</span><p>按版本化方法计算和发布的数值序列；不是无成本可直接持有的证券。</p></article>
          <article><span>Benchmark passport</span><p>冻结角色、universe、收益、币种、时点、方法、版本和变更治理的记录。</p></article>
          <article><span>Active weight</span><p>同一资产映射上的实际组合权重减 benchmark weight，即 x=w−b。</p></article>
          <article><span>Active return</span><p>组合收益减 benchmark 收益；不自动等于因子模型 alpha。</p></article>
          <article><span>Tracking difference</span><p>主动收益的平均或累计中心偏离，必须声明算术或几何口径。</p></article>
          <article><span>Ex-post TE</span><p>实现主动收益围绕其均值的离散，需声明分母、频率、窗口和年化。</p></article>
          <article><span>Ex-ante TE</span><p>当前主动暴露在预测协方差模型下的条件波动；不是损失限额。</p></article>
          <article><span>Active Share</span><p>同一 universe 中持仓绝对权重偏离的一半；不读取协方差。</p></article>
          <article><span>Information ratio</span><p>平均主动收益除以 tracking risk；TE 为零时未定义。</p></article>
          <article><span>Policy benchmark</span><p>资产所有者长期战略风险选择和再平衡规则的参考路径。</p></article>
          <article><span>Construction benchmark</span><p>经理形成 active weights 和相对风险时使用的原点。</p></article>
          <article><span>Attribution</span><p>按规则分解已实现收益、当前风险或实施成本；不是自动因果识别。</p></article>
          <article><span>Crowding</span><p>多个主体持有相似风险，并可能在共同触发下同向交易的状态；共同 benchmark 只是一个输入。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">59 · 课程接口、复述与阅读路径</p>
        <h2>2.18 在单一主体的 benchmark—主动状态—治理—成交及一阶价格反馈处停止；持仓网络、心理从众和多轮 contagion 留给后续章节。</h2>
        <div className="interface-grid">
          <article><span>回接 2.03</span><h3>Active Manager</h3><p>2.03 输出 mandate、研究、约束、target 与 order；本节增加 benchmark hierarchy、active risk 与评价。</p></article>
          <article><span>回接 2.04</span><h3>Passive / ETF</h3><p>接收指数规则、复制和 ETF/AP 边界；本节深化 TD/TE、benchmark choice 与实施归因。</p></article>
          <article><span>回接 2.12</span><h3>Portfolio Risk</h3><p>总风险和风险贡献是 portfolio 坐标；本节改用 x=w−b 构造 relative-risk 坐标。</p></article>
          <article><span>回接 2.16</span><h3>Risk Governance</h3><p>TE limit 复用 validation→authority→target→order→fill，不生成自动卖单。</p></article>
          <article><span>回接 2.17</span><h3>Flow / Redemption</h3><p>接收现金缺口与处置路径，计算 flow 后 active weight、TD、TE 与实施成本。</p></article>
          <article><span>连接 2.19</span><h3>Crowded Positioning</h3><p>输出共同 benchmark、active positions、trigger、target 与 fills；后续建立重叠持仓网络和 crowded exit。</p></article>
          <article><span>连接 6.10</span><h3>Herding</h3><p>本节只建立 delegated incentives；后续区分信息学习、声誉模仿、心理模仿与协调。</p></article>
          <article><span>连接 7.13 / 7.17</span><h3>Contagion / Identification</h3><p>Actual fills、有限深度与可信反事实进入多轮 fire sale 和因果研究。</p></article>
        </div>
        <div className="precision-note">
          <span>85–90 分钟核心首读</span>
          <p>按 00–11（约 16 分钟）→ 12–18、20（约 13 分钟）→ 21–35（约 25 分钟）→ 36–41、43–46（约 16 分钟）→ 52、54、56–59（约 17 分钟）阅读。把 19、42、47–51、53、55、Lab 全量与完整法规放到第二遍。</p>
        </div>
        <p>
          最小复述应是：<b>Mandate 先选择 benchmark 的角色和可复核口径，实际组合与基准映射成 active weights，再分别产生 active return、TD、ex-post TE、ex-ante TE、Active Share 与 IR；这些指标回答不同问题。Risk budget 或绩效评价只有经过数据／模型校验、激励与授权，才改变 target；target 只有经 order 和 actual fill 才改变持仓与市场。共同 benchmark 要成为 crowding，还必须叠加相似头寸、共同触发、同向目标、同步成交和有限深度。Benchmarking 能改善问责，也可能产生外部性，方向和强度都必须由合同、状态与证据决定。</b><Cite n={3} /><Cite n={25} /><Cite n={28} />
        </p>
      </section>
    </>
  );
}

export const lesson218: LessonRecord = {
  slug: '2-18',
  id: '2.18',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Benchmark、Active Risk 与 Tracking Error：从参照组合到相对授权、真实订单与市场反馈',
  subtitle: '把 index 与 benchmark、policy 与 manager 层级、active weight、TD、ex-post / ex-ante TE、Active Share、IR、归因、激励、target、order、fill 和价格证据严格分层',
  readingTime: '核心首读约 85–90 分钟；完整正文含逐式复算约 150–185 分钟；互动实验首次完成 22–32／含复盘 35–45，静态练习核对 18–28／完整书写 30–40，理解检查与术语 20–28，建议分三次完成；参考文献与延伸阅读不计',
  prerequisite: '2.03–2.04；建议回看 T01、T03、T06、T08、1.09、1.20、2.12、2.16–2.17；研究部分按需 T05',
  updatedAt: '2026-08-31',
  revision: '2.18-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.18-r3',
      summary:
        '独立复核 60 个机制单元、68 条来源与 162 个引文落点，并逐项核验 benchmark 层级、active weight／return、TD、ex-post／ex-ante TE、总风险、因子分解、Active Share、IR、优化与 implementation shortfall 的公式、符号和单位，以及中国、美国、欧盟、GIPS 与 IOSCO 的规则层级和时点；冻结哈希与类型、规范、构建、HTTP、结构及引用不变量均通过，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-31',
      decision: 'approved',
      revision: '2.18-r3',
      summary:
        '独立复核零背景入口、85–90 分钟核心路线、60 项目录、benchmark—active state—治理—target—order—fill—反馈因果链、公式渐进、10 道互动题与 10 道静态孪生、14 道检查、14 个术语及四层阅读路径，并检查唯一答案、键盘／ARIA／焦点、本地保存、无脚本、打印与响应式边界；冻结哈希和全部运行验证一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '2-17', label: '2.17 Redemption、Flow 与 Liquidity Mismatch' },
  next: { slug: '2-19', label: '2.19 Crowded Positioning' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、先修与路线' },
    { id: 'state-chain', label: '状态机与数据模型' },
    { id: 'measurement-passport', label: 'Measurement Tuple' },
    { id: 'index-versus-benchmark', label: 'Index 与 Benchmark' },
    { id: 'performance-benchmark', label: 'Performance Benchmark' },
    { id: 'investable-index', label: 'Investable Index' },
    { id: 'policy-benchmark', label: 'Policy Benchmark' },
    { id: 'manager-benchmark', label: 'Manager Benchmark' },
    { id: 'composite-custom', label: 'Composite / Custom' },
    { id: 'peer-hurdle-liability', label: 'Peer / Hurdle / Liability' },
    { id: 'benchmark-adequacy', label: 'Benchmark Adequacy' },
    { id: 'passive-objective', label: 'Passive Objective' },
    { id: 'active-objective', label: 'Active Objective' },
    { id: 'benchmark-aware-active', label: 'Benchmark-aware Active' },
    { id: 'benchmark-agnostic', label: 'Benchmark-agnostic' },
    { id: 'enhanced-index-spectrum', label: 'Active / Passive Spectrum' },
    { id: 'benchmark-passport', label: 'Benchmark Passport' },
    { id: 'active-weight', label: 'Active Weight' },
    { id: 'mapping-boundaries', label: 'Exposure Mapping' },
    { id: 'target-order-fill', label: 'Target / Order / Fill' },
    { id: 'benchmark-return', label: 'Benchmark Return' },
    { id: 'portfolio-return', label: 'Portfolio Return' },
    { id: 'active-return', label: 'Active Return' },
    { id: 'tracking-difference', label: 'Tracking Difference' },
    { id: 'multiperiod-compounding', label: 'Multi-period Compounding' },
    { id: 'ex-post-te', label: 'Ex-post TE' },
    { id: 'sample-estimator', label: 'Estimator / RMS' },
    { id: 'annualization', label: 'Annualization' },
    { id: 'ex-ante-te', label: 'Ex-ante TE' },
    { id: 'covariance-hedge', label: 'Covariance / Hedge' },
    { id: 'factor-specific', label: 'Factor / Specific Risk' },
    { id: 'active-risk-contribution', label: 'Risk Contribution' },
    { id: 'model-risk', label: 'Model Risk / Stress' },
    { id: 'te-budget-limit', label: 'TE Budget / Limit' },
    { id: 'breach-governance', label: 'Breach Governance' },
    { id: 'active-share', label: 'Active Share' },
    { id: 'active-share-domain', label: 'Active Share Domain' },
    { id: 'active-share-te', label: 'Active Share × TE' },
    { id: 'information-ratio', label: 'Information Ratio' },
    { id: 'ir-boundaries', label: 'IR Boundaries' },
    { id: 'td-attribution', label: 'TD Attribution' },
    { id: 'fees-tax-lending', label: 'Fees / Tax / Lending' },
    { id: 'flow-cash-drag', label: 'Flow / Cash Drag' },
    { id: 'index-reconstitution', label: 'Index Reconstitution' },
    { id: 'replication-methods', label: 'Replication Methods' },
    { id: 'execution-slippage', label: 'Execution Slippage' },
    { id: 'derivative-overlay', label: 'Derivative Overlay' },
    { id: 'currency-hedge', label: 'Currency / Hedge' },
    { id: 'bond-illiquid-benchmark', label: 'Bond / Illiquid Assets' },
    { id: 'performance-attribution', label: 'Performance Attribution' },
    { id: 'risk-cost-attribution', label: 'Risk / Cost Attribution' },
    { id: 'incentive-feedback', label: 'Incentive Feedback' },
    { id: 'benchmark-change-gaming', label: 'Change / Gaming' },
    { id: 'evidence-ladder', label: 'Evidence Ladder' },
    { id: 'causal-protocol', label: 'Causal Protocol' },
    { id: 'lab', label: 'Interactive Lab' },
    { id: 'active-practice', label: 'Static Practice' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson218Content,
  references: lesson218References,
  readingList: lesson218ReadingList,
};
