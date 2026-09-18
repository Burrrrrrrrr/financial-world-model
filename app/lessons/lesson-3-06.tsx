import type { ReactNode } from 'react';
import MoneyMarketImplementationLab from '../components/MoneyMarketImplementationLab';
import PolicyImplementationTransmissionChart from '../components/PolicyImplementationTransmissionChart';
import ReserveDemandFrameworkLab from '../components/ReserveDemandFrameworkLab';
import ReservePlumbingLedger from '../components/ReservePlumbingLedger';
import { policyImplementationScenarios } from '../components/policyImplementationScenarios';
import { lesson306ReadingList, lesson306References } from './lesson-3-06-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a aria-label={'参考文献 ' + n} className="citation-mark" href={'#ref-' + n}>[{n}]</a>;
}

function Cites({ ns }: { ns: number[] }) {
  return <>{ns.map((n) => <Cite key={n} n={n} />)}</>;
}

type ConceptSection = {
  id: string;
  number: number;
  label: string;
  title: string;
  paragraphs: ReactNode[];
  formula?: { label: string; expression: ReactNode; note: ReactNode };
  boundary?: ReactNode;
  after?: ReactNode;
};

type ImplementationBoundaryState = {
  currency: string;
  eligibilityState: {
    legalEntity: string;
    accountType: string;
  };
  overnightContractType: {
    venue: string;
  };
  reserveSettlementState: {
    settlementSystem: string;
  };
  timestamps: {
    timezone: string;
  };
};

type CanonicalBoundaryFieldPath =
  | 'currency'
  | `eligibilityState.${Extract<keyof ImplementationBoundaryState['eligibilityState'], string>}`
  | `overnightContractType.${Extract<keyof ImplementationBoundaryState['overnightContractType'], string>}`
  | `reserveSettlementState.${Extract<keyof ImplementationBoundaryState['reserveSettlementState'], string>}`
  | `timestamps.${Extract<keyof ImplementationBoundaryState['timestamps'], string>}`;

const canonicalBoundaryFieldPaths = [
  'currency',
  'eligibilityState.legalEntity',
  'eligibilityState.accountType',
  'overnightContractType.venue',
  'reserveSettlementState.settlementSystem',
  'timestamps.timezone',
] as const satisfies readonly CanonicalBoundaryFieldPath[];

function ImplementationConceptSection({ section }: { section: ConceptSection }) {
  return (
    <section className="lesson-section" id={section.id}>
      <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label}</p>
      <h2>{section.title}</h2>
      {section.formula ? (
        <div className="equation-card">
          <span>{section.formula.label}</span>
          <div>{section.formula.expression}</div>
          <p>{section.formula.note}</p>
        </div>
      ) : null}
      {section.paragraphs.map((paragraph, index) => <p key={`${section.id}:${index}`}>{paragraph}</p>)}
      {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
      {section.after}
    </section>
  );
}

const conceptSections: ConceptSection[] = [
  {
    id: 'implementation-passport', number: 2, label: 'Implementation Passport',
    title: '实施前先把“政策利率决定”拆成可执行字段；一个 headline rate 不足以进入市场。',
    paragraphs: [
      <>最低护照要保存动作、公告时刻、生效日、立场工具、操作目标、目标类型与水平、管理利率、准备金计息层级、数量指令、交易对手、抵押品、haircut、操作日历、结算日历和 benchmark 方法。以 Fed 为例，政策声明给目标区间与立场，同日 implementation note 才给 IORB、standing repo、ON RRP、资产操作和 primary-credit 指令；两份文件不能互相替代。<Cites ns={[3, 4]} /></>,
      <><code>effectiveDate</code> 必须与公告、交易、结算、维持期和利息起算日分开。市场可能在今天为明日生效条款定价；若研究者只保留日线日期，就会把预期调整错写成控制偏差。准入、抵押品与统计方法也各有版本，不能只保存利率值。</>,
    ],
    formula: { label: '数据契约，不是估计式', expression: <code>passport = decision + clock + target + administeredTerms + reserveTerms + access + collateral + operations + benchmark</code>, note: <>缺失字段应写 unknown，不以叙事补齐。</> },
    boundary: <>3.05 的 <code>effectiveDate</code> 规范化为 <code>timestamps.effectiveAt</code>；<code>corridor/floor terms</code> 拆为 <code>targetType、administeredTerms、reserveRemunerationTerms、facilityTerms</code>。<code>actionVector、operatingTarget、balanceSheetInstruction</code> 原名保留，禁止静默改名或丢字段。</>,
  },
  {
    id: 'decision-compiler', number: 3, label: 'Decision Compiler',
    title: '委员会选择的是立场；实施部门必须把它编译成市场参与者今天真正能做的交易集合。',
    paragraphs: [
      <>“维持目标区间”仍可能需要改变 IORB 在区间内的位置、补充短券购买、调整 repo 报价或限额。这些动作可能只为修正实施误差；反过来，政策目标已变而管理利率、生效日或结算指令不同步，会先生成一个内部不一致的价格向量。研究对象因此是整套 action vector，而非新闻标题里的单一数字。<Cites ns={[4, 5, 15]} /></>,
      <>符号必须避免和资产负债表冲突：<code>Target</code> 表示操作目标，<code>iD/iL/iO</code> 表示存放、借贷与常规操作价格，<code>QR</code> 表示准备金供给状态；<code>Access/Haircut/Collateral</code> 显式拼写，<code>τ</code> 保存生效与结算时钟。管理率在目标不变时微调 5bp，是技术变化候选而非自动的 5bp 宏观 shock。</>,
    ],
    formula: { label: '实施动作向量', expression: <code>uₜ = {'{'}Targetₜ, iDₜ, iLₜ, iOₜ, QRₜ, OMOₜ, Accessₜ, Haircutₜ, Collateralₜ, τₜ{'}'}</code>, note: <>每个分量都要带币种、期限、资格、单位和版本。</> },
  },
  {
    id: 'reserve-definition', number: 4, label: 'Reserve Balance',
    title: '准备金是合资格机构对央行的即期名义债权，也是特定币种与支付系统中的最终结算资产。',
    paragraphs: [
      <>准备金在央行资产负债表上是负债，在银行资产负债表上是资产。A 的客户向 B 的客户付款，商业银行存款迁移，同时央行账本把准备金从 A 转给 B；银行间债务最终用央行负债结清。因此准备金不是公众可直接持有的普通银行存款，也不是银行金库里预先等待放贷的一袋钱。<Cites ns={[5, 6, 25, 60]} /></>,
      <>“最终”仍是制度限定词：只对相应币种、合资格账户和结算安排成立。没有央行账户的主体不能直接持有该账户债权；不同币种、法律实体与结算系统的余额也不能直接相加。跨境代理账户、外汇融资与央行互换线的完整机制留给 Chapter 4，本节只保留不可删除的边界字段。<Cite n={60} /></>,
    ],
    boundary: <>55 节把币种、法律实体、venue 与结算系统重新装回数据护照。</>,
  },
  {
    id: 'reserves-deposits-currency', number: 5, label: 'Reserves / Deposits / Currency',
    title: '准备金、公众存款与纸币都处在货币层级，却不能用“银行把准备金借给公众”来连接。',
    paragraphs: [
      <>银行发放贷款通常同时创造贷款资产和借款人存款；只有借款人向别家银行付款，才发生银行间准备金转移。贷款能力受资本、风险、融资、监管、借款需求与盈利约束；准备金保障结算，却不是逐笔贷款的机械原料。BoE 的官方会计说明明确反对固定“货币乘数”叙事；完整信用供给决定由 3.09 接手。<Cite n={48} /></>,
      <>公众把银行存款换成纸币时，央行纸币负债 <code>C</code> 上升、准备金负债 <code>R</code> 下降；现金存回银行则反向。央行总资产可以完全不变，准备金仍被现金需求吸收。零法定准备金率也不等于零准备金需求：支付、预防、监管便利和相对收益仍然存在。<Cites ns={[1, 59]} /></>,
    ],
  },
  {
    id: 'settlement-ledger', number: 6, label: 'Settlement Ledger',
    title: '银行间付款只重新分配准备金；系统总量不变，不代表边际银行不会短缺。',
    paragraphs: [
      <>若 A 的客户向 B 的客户支付 20，A 的客户存款与准备金各减 20，B 的准备金与客户存款各增 20，<code>R_A+R_B</code> 不变。A 即使处在“总量充裕”的系统，也可能跌破自身日内或隔夜缓冲，于是借入、卖券、延迟付款或使用央行便利。<Cites ns={[13, 43]} /></>,
      <>利率由边际借款人与可达贷款人的相遇条件形成，而非系统平均银行。支付流、代理清算、集团内转移限制和时区可以制造节点短缺；研究至少要同时保存集中度、余额分位数、付款时点和网络位置。</>,
    ],
    boundary: <>商业银行之间的交易不创造系统净准备金；央行与外部部门的交易或自治因素才改变总量。</>,
  },
  {
    id: 'balance-sheet-identity', number: 7, label: 'Central-bank Identity',
    title: '准备金是其余资产负债表项目给定后的剩余负债，不是能与全部项目独立设定的旋钮。',
    paragraphs: [
      <>一致口径下，<code>A</code> 是央行资产，<code>C</code> 是流通现金，<code>G</code> 是政府在央行存款，<code>O</code> 是其他吸收准备金的负债，<code>K</code> 是资本与净值。资产不变而政府账户上升，银行准备金必须下降；央行买入资产并以新增准备金付款，准备金上升。<Cite n={1} /></>,
      <>这只是会计恒等式，不是因果识别。资产与负债可能共同回应政策或压力；估计 <code>ΔA</code> 对利率的影响仍须保存操作目的、时间、需求内生性、估值、应计和合并口径。</>,
    ],
    formula: { label: '存量与流量恒等式', expression: <><code>Aₜ = Cₜ + Gₜ + Oₜ + Kₜ + Rₜ</code><br /><code>ΔR = ΔA − ΔC − ΔG − ΔO − ΔK</code></>, note: <>单位必须是同一币种、同一估值时点、同一合并边界。</> },
  },
  {
    id: 'autonomous-factors', number: 8, label: 'Autonomous Factors',
    title: '现金、政府账户与其他负债能在政策立场不变时移动准备金供给。',
    paragraphs: [
      <>税款转入政府央行账户时 <code>G↑、R↓</code>；政府支出时 <code>G↓、R↑</code>；公众取现时 <code>C↑、R↓</code>。这些流量常集中在税期、债券结算、月末或节前。央行若要维持同一隔夜控制状态，会预测并用 repo、reverse repo 或资产交易对冲，而不是把每次数量变化都叫宽松或紧缩。<Cites ns={[1, 9]} /></>,
      <>同一预测误差在需求曲线陡峭区会引起较大价格波动，在平坦区影响较小。自治因素可作为供给扰动候选工具变量，但只有当预测误差与同期财政信息、风险和资金需求足够独立时，才支持局部因果识别。</>,
    ],
  },
  {
    id: 'five-t-accounts', number: 9, label: 'T-account Case Library',
    title: '五种操作共享同一复式记账映射；相同“扩表”仍可对应不同期限、目的与价格信号。',
    paragraphs: [
      <>央行 repo 形成 repo claim 与准备金，reverse repo 临时吸收准备金，买券形成证券资产与准备金，政府支出在负债端把政府存款换成准备金，取现则把准备金换成纸币。这是一组同一会计机制的案例库，不是五个无关中心。<Cites ns={[1, 25, 29]} /></>,
      <>短期 repo 满足既定价格下的需求，可能只是实施；短券购买补偿现金增长，可能是储备管理；长期债券购买若明确压低期限溢价，才更接近 QE。分类必须联合目的、期限、风险转移、公告和反事实，不能只看 <code>ΔA&gt;0</code>。<Cites ns={[14, 50]} /></>,
    ],
    after: <ReservePlumbingLedger />,
  },
  {
    id: 'reserve-demand', number: 10, label: 'Reserve Demand',
    title: '银行的准备金需求由支付、预防、监管与相对回报共同生成，而非只由法定比例决定。',
    paragraphs: [
      <>支付规模、尾部流出、法定要求、流动性监管、市场率与边际准备金报酬之差、抵押品成本、便利准入、日历和网络位置共同进入。银行是在即时流动性收益与机会、资产负债表和操作成本间取舍；利率相同也不意味着无限持有。<Cites ns={[1, 11, 32, 59]} /></>,
      <>总需求是异质银行需求的聚合，会随存款、支付技术、监管、网络与危机概率移动。因此某一年估计的 ample 金额或资产占比不能永久固定。</>,
    ],
    formula: { label: '机构条件需求', expression: <code>Rᵈᵢ = f(Payᵢ, OutflowRiskᵢ, Reqᵢ, Regᵢ, iᵐ−iᴿ, Collᵢ, Accessᵢ, Calendarᵢ, Networkᵢ)</code>, note: <>函数的变量集合说明机制，不宣称线性、同质或跨制度稳定。</> },
  },
  {
    id: 'intraday-overnight', number: 11, label: 'Intraday / Overnight',
    title: '同一单位准备金在付款时段与收盘持有决策中解决不同问题。',
    paragraphs: [
      <>日内准备金用于即时支付与证券结算，价值取决于付款队列、透支规则、抵押品、营业时钟和收款不确定性；隔夜余额既是次日即时流动性，也是有明确报酬的资产。即使日内信用利率为零，抵押品占用仍有机会成本。<Cites ns={[1, 32, 60]} /></>,
      <>维持期内不同日期也非完美替代：交易成本、信用额度、周末与结算日会破坏简单跨日套利。结算机制还会重新安排何时必须有可用流动性、何时达到最终性以及日内信用需何种抵押；PFMI 支持保存这些结算与流动性风险字段，却不提供“某种系统必然提高或降低准备金需求”的统一方向。<Cites ns={[43, 60]} /></>,
    ],
  },
  {
    id: 'transactions-demand', number: 12, label: 'Transactions Demand',
    title: '准备金的边际交易便利随余额增加而递减，由此产生非线性需求曲线。',
    paragraphs: [
      <>余额很低时，一单位额外准备金可显著降低付款失败、透支或高价收盘融资概率；足以覆盖常态支付后，再增加一单位的便利迅速下降。Poole 的随机准备金模型把收盘不确定性与设施价格连接起来，是走廊／地板图形的理论起点。<Cite n={42} /></>,
      <>曲线不是技术常数。支付集中度、客户存款、日内信用、内部净额与代理关系会平移或改变斜率；实证不能把共同变化全塞进“数量效应”。</>,
    ],
  },
  {
    id: 'precautionary-demand', number: 13, label: 'Precautionary Demand',
    title: '银行针对厚尾流出持有缓冲；内部“最低舒适余额”有经济意义，却不是可直接观察的结构真值。',
    paragraphs: [
      <>最终支付、客户提款、margin call 与融资续作都有尾部；对未来市场深度的担忧和管理层风险容忍会抬高缓冲。2019 年美国事件中，一些银行面对很高 repo 回报仍不愿跌破内部阈值，说明可观察总余额不是可贷余额。<Cites ns={[9, 13, 51]} /></>,
      <>调查的最低舒适余额受时点、压力记忆、制度学习与策略回答影响。央行需联合利率弹性、付款时点、便利使用和分布，而非寻找永久单点。<Cites ns={[11, 12]} /></>,
    ],
  },
  {
    id: 'regulatory-demand', number: 14, label: 'Regulatory / Supervisory Demand',
    title: '流动性监管改变准备金的相对便利，却通常不规定所有银行统一持有一个数量。',
    paragraphs: [
      <>准备金无需先卖出或回购即可支付；高质量主权债虽可属于 HQLA，仍要经过货币化与抵押品操作。LCR 对一级 HQLA 的处理、变现测试、内部压力测试与监督预期会改变组合边际，但 Basel 标准不等于“每家银行必须持有 X 准备金”。<Cites ns={[1, 59]} /></>,
      <>若监管变化同时提高准备金和国债需求，净效应取决于两者替代性、抵押品便利与银行融资结构。把需求外移全部归因于 LCR，会遗漏存款、支付速度与风险状态。</>,
    ],
  },
  {
    id: 'relative-return-collateral', number: 15, label: 'Relative Return / Collateral',
    title: '准备金机会成本必须使用边际报酬，并把担保融资中的抵押品价值与中介成本单独标出。',
    paragraphs: [
      <>最小价格是相关隔夜市场率减去边际一单位准备金留在央行的报酬。差越高，银行越愿节约或贷出准备金；接近零时，额外持有的价格惩罚较小。分层计息下平均利息率不能替代边际率。<Cite n={1} /></>,
      <>repo 还占用抵押品；稀缺证券的 specialness、haircut、资产负债表、信用与交易成本会让屏幕利差偏离纯准备金机会成本。RBA 证据显示存款与抵押品成本改善澳洲样本的需求解释，但其系数不能跨国移植。<Cite n={32} /></>,
    ],
    formula: { label: '边际价格激励', expression: <code>cᵐₜ = iᴼᴺₜ − iᴿ,ᵐᵃʳᵍₜ</code>, note: <>两率必须同币种、同期限、同年化口径；secured 与 unsecured 不可无说明混算。</> },
  },
  {
    id: 'reserve-requirements', number: 16, label: 'Reserve Requirements',
    title: '法定准备金能制造较低利率弹性的最低需求，但基数、平均、处罚与报酬决定约束落在哪里。',
    paragraphs: [
      <>同一个 RRR 数字可能对应不同存款基数、免征额、机构范围、逐日或平均满足、结转与处罚。仅报告 <code>RRR=10%</code> 无法推出边际需求，更不能把要求余额与超额余额混成一列。</>,
      <>RRR 为零时，支付、预防和监管需求仍在；高 RRR 若按维持期平均且充分报酬，也未必每天制造同样稀缺。走廊文献表明平均机制可平滑利率，但会受规避与结算日效应限制。<Cite n={45} /></>,
    ],
  },
  {
    id: 'averaging', number: 17, label: 'Averaging',
    title: '跨日替代可以缓冲日常冲击，但临近维持期末和存在交易摩擦时不再是无成本套利。',
    paragraphs: [
      <>若 N 天平均余额至少为目标值，理想模型中的银行比较今天与未来利率，把余额移到更便宜日期；临近末日，可补偿日期减少，需求变陡。<Cites ns={[43, 45]} /></>,
      <>信用额度、周末、付款风险、预期误差和交易成本令不同日期不完全替代。实证必须标注维持期日序、结算日和假期，不能把所有工作日当同质样本。</>,
    ],
    formula: { label: '维持期约束', expression: <code>(1/N) Σₜ Rₜ ≥ R̄</code>, note: <>平均约束提供跨日弹性，不是日度市场率保证。</> },
  },
  {
    id: 'aggregate-distribution', number: 18, label: 'Aggregate / Distribution',
    title: '“系统准备金充裕”不推出每个法人、清算节点和时区都充裕。',
    paragraphs: [
      <>总量由央行负债表决定，个体余额由付款、客户流、代理网络和资产交易分配。高余额银行可能因内部缓冲、资本或结算不确定而不愿贷出；短缺机构可能没有抵押品或便利准入。总量不变时，分布摩擦仍能提高局部利率和分散度。<Cites ns={[13, 51]} /></>,
      <>监测至少要看机构类型分布、付款时点、借贷集中度、利率分位数、关系稳定性、法律实体和跨实体转移限制。一个平均 reserve ratio 无法替代这些字段。</>,
    ],
  },
  {
    id: 'network-access', number: 19, label: 'Network / Access',
    title: '市场利率受边际交易者可达的外部选项约束，而非受全体都能看见却不能使用的央行牌价约束。',
    paragraphs: [
      <>只有合资格账户持有人能直接取得准备金报酬，贷款便利还要求交易对手、法律、抵押品与操作资格。非银行资金提供者常要经代理银行，接受低于央行存放率的净回报；银行套利又受资产负债表成本约束，于是形成 leaky floor。<Cites ns={[1, 6, 19, 35]} /></>,
      <>BoJ 经验显示，合资格机构可从 call market 借入再存入 CDF，但非合资格贷款人、交易成本和容量使无担保 call rate 可略低于 CDF。利率旁必须始终展示准入矩阵。<Cite n={35} /></>,
    ],
  },
  {
    id: 'bis-two-dimensions', number: 20, label: 'BIS Two-dimensional Taxonomy',
    title: '先观察边际准备金机会成本，再观察超额准备金数量；框架名称只能放在两维之后。',
    paragraphs: [
      <>BIS 2025 分类把纵轴设为 <code>cᵐ=iON−iR,marg</code>，横轴设为超出要求的隔夜准备金数量，并另分供给方式。前者决定边际交易激励，后者影响流动性管理；分层计息时平均与边际机会成本还会分离。<Cite n={1} /></>,
      <>教学中可用 <code>cᵐ×Qexcess</code> 检查年化利差暴露数量级，但这不是 BIS 定义的福利损失，也不是把两轴相乘的新分类。若 <code>cᵐ&lt;0</code>，应先查非银行准入、分割与成本，而非宣称无条件免费套利。</>,
    ],
    boundary: <>双维分类仍不完整包含支付制度、抵押品、危机便利与财政风险，不能用来做一般福利排名。</>,
  },
  {
    id: 'nonlinear-demand-curve', number: 21, label: 'Nonlinear Reserve-demand Curve',
    title: 'scarce、ample 与 abundant 是非线性曲线上的经济区域，不是三个永久金额。',
    paragraphs: [
      <>余额很低时，收盘短缺概率使 spread 靠近贷款端；中间区域增加准备金会显著降低短缺风险，曲线较陡；支付与预防需要基本满足后，曲线趋平。经典理论与现代估计都支持这条非线性逻辑。<Cites ns={[11, 42, 46, 56, 57]} /></>,
      <>ample 通常指利率仍可靠受控、但边际斜率可以非零；abundant／satiated 更接近平坦区。各央行官方用语不同，尤其 RBA 把 ample 与需求驱动设计相连；页面必须同时注明本图区域定义与机构原词。观察到 spread 变大也不能区分沿曲线左移还是需求曲线右移。</>,
    ],
    after: <ReserveDemandFrameworkLab />,
  },
  {
    id: 'scarce-corridor', number: 22, label: 'Scarce-reserves Corridor',
    title: '走廊把准备金供给放在需求曲线斜坡；市场交易而非行政命令把价格带到目标附近。',
    paragraphs: [
      <>存放便利给潜在贷款人一个外部选项，贷款便利给短缺银行一个最后融资选项；央行用数量操作使准备金供给与斜坡需求在目标附近相交。自治因素预测和日常 fine-tuning 因而重要：供给减少或需求上升会把率推向上端，供给增加则移向下端。<Cites ns={[42, 45, 47]} /></>,
      <>走廊的价格仍由收盘短缺概率、跨日 averaging、信用与操作成本生成。它可能保留较强市场交易和较小央行表，却需要更密集的数量预测；这组权衡不是跨状态固定的福利排序。</>,
    ],
  },
  {
    id: 'soft-bounds', number: 23, label: 'Soft Facility Bounds',
    title: '走廊上下端是主体特异的净外部选项；只有准入、期限、币种、抵押品与摩擦匹配时才近似硬界。',
    paragraphs: [
      <>教科书不等式隐含贷款人能进入存放端、借款人能进入贷款端，合约期限与结算一致，且无资产负债表、抵押品、信用、操作与 stigma 成本。现实双边比较应把下界写给贷款人 <code>j</code>，上界写给借款人 <code>i</code>。<Cites ns={[1, 25, 45]} /></>,
      <>无存放便利准入的非银行可在表面下界之下放款；缺抵押品、担心污名或错过截止时间的银行可在牌价上界之上借款。穿越边界先做准入与净成本诊断，不直接宣称套利或政策失控。</>,
    ],
    formula: { label: '主体特异软界', expression: <code>iᴰ,ⁿᵉᵗⱼ ≤ iᴼᴺᵢⱼ ≤ iᴸ,ᵉᶠᶠᵢ</code>, note: <>j 是贷款方，i 是借款方；上下端不能误用同一主体下标。</> },
  },
  {
    id: 'floor-system', number: 24, label: 'Floor System',
    title: '当供给位于需求曲线平坦区，边际准备金报酬而非每日数量微调成为主要价格锚。',
    paragraphs: [
      <>原型地板里，额外准备金机会成本接近零，市场率在准备金／存放报酬附近形成。Fed 2019 选择 ample-reserves 方式，IORB 是主要工具，ON RRP 为更广的货币市场参与者提供辅助外部选项。<Cites ns={[5, 6, 10]} /></>,
      <>数量约束没有消失。资产 runoff、现金或政府账户增长可把供给推回陡峭区，央行仍要购买资产、做 repo 或调整负债结构。平坦区中数量暂时不决定边际价格，不等于数量永久无关。<Cites ns={[11, 12]} /></>,
    ],
  },
  {
    id: 'leaky-floor', number: 25, label: 'Leaky Floor',
    title: '市场低于准备金报酬率，可以是准入与中介成本下的均衡，而非会计矛盾。',
    paragraphs: [
      <>若非银行贷款人的外部回报低于 <code>iR</code>，而有央行账户的银行吸收这笔资金要付成本 <code>κ</code>，只有 <code>iR−imarket&gt;κ</code> 才值得套利。ECB 的 €STR 涵盖银行向广泛批发金融机构的无担保隔夜借款，许多贷款人没有 DFR 准入；BoJ call market 也展示相似分割。<Cites ns={[19, 35]} /></>,
      <>“地板漏了”应转成可验证问题：看贷款人身份、账户准入、银行吸收能力、成交量与利率分位数。若同样具有完整准入、低成本的主体仍持续以更低率贷出，才更像真正的套利谜题。</>,
    ],
    formula: { label: '可执行套利条件', expression: <code>net arbitrage = iᴿ − iᵐᵃʳᵏᵉᵗ − κ</code>, note: <>净值为负时，表面 spread 不足以覆盖中介路径。</> },
  },
  {
    id: 'ample-reserves', number: 26, label: 'Ample Reserves',
    title: 'ample 的核心是可靠控制且对小数量变化不过度敏感，不是每家银行都没有短缺风险。',
    paragraphs: [
      <>Fed 语境中的 ample 指总供给足以让短端主要由管理利率控制，而无需主动每日微调；需求曲线斜率仍可非零。时间变动模型把 abundant 视为更接近饱和的平坦区，把 ample 视为温和斜率区，阈值会随需求移动。<Cites ns={[5, 11]} /></>,
      <>总量 ample 可与节点短缺、repo 压力和付款延迟并存。2019 年经验显示边际中介余额、支付时点与资产负债表约束可能比聚合数字更重要。<Cites ns={[9, 13, 51]} /></>,
    ],
  },
  {
    id: 'abundant-supply-demand', number: 27, label: 'Quantity Region / Supply Mode',
    title: 'abundant 是数量区域，supply-driven 与 demand-driven 是供给规则；两组坐标不能互换。',
    paragraphs: [
      <>abundant 描述需求曲线近乎平坦；supply-driven 描述央行或既有资产组合先决定数量，银行被动持有；demand-driven 则由央行报出获取价格、合格银行按规则和抵押品内生取用。系统可 abundant 且 supply-driven，也可 ample 且 demand-driven。<Cites ns={[1, 20, 29]} /></>,
      <>需求驱动不等于免费无限。价格、抵押品、haircut、期限与准入共同限制取用。RBA 2026-08-25 明确区分目标设计与当时状态：正转向 demand-driven ample，但余额仍高于潜在需求，尚未抵达目标稳态。<Cite n={29} /></>,
    ],
  },
  {
    id: 'tiering', number: 28, label: 'Tiering / Quota',
    title: '分层计息使平均准备金报酬与下一单位准备金的边际报酬显著分离。',
    paragraphs: [
      <>若配额内按高率、配额外按低率计息，银行总体平均收益可能很高，下一单位却只能获低率；交易因而围绕配额发生。BIS 双维分类要求以边际报酬计算机会成本，不能用总利息除总余额替代。<Cite n={1} /></>,
      <>分层会制造机构特异阈值：配额未满的银行愿意吸收资金，配额已满者要求更高市场回报。总量相同，配额使用分布不同，成交方向与利率分布仍可重排。</>,
    ],
  },
  {
    id: 'administered-options', number: 29, label: 'Administered Rates as Options',
    title: '管理利率通过改变“拒绝更差交易”的能力锚定市场，不是行政规定每一笔成交。',
    paragraphs: [
      <>有资格把边际资金留在央行的机构，不会无条件以显著更低净率贷出；能按已知条款从央行借入的机构，也不会无条件支付更高净率。牌价先改变 reservation rate，再经竞争、议价和套利进入市场。锚的强弱取决于覆盖多少边际交易者以及总摩擦 <code>κ</code>。<Cites ns={[6, 25, 35]} /></>,
      <>若主体无准入、受信用／抵押品限制，或把便利视为紧急救助，牌价对日常成交约束会弱。设计的关键不是“表上有一个 rate”，而是适当主体在适当时点能否以可接受净条件真实使用。</>,
    ],
  },
  {
    id: 'open-market-operations', number: 30, label: 'Open-market Operations',
    title: 'OMO 用期限、数量、价格和结算方式改变准备金及其预期可得性。',
    paragraphs: [
      <>repo 临时供给准备金，reverse repo 临时吸收，outright purchase/sale 更持久改变资产与准备金。每项还要标固定利率或竞价、数量上限或 full allotment、期限、对手方、抵押品、haircut、公告和结算时点；只写“投放 X”无法判断价格信号。<Cites ns={[4, 15, 21, 25, 29]} /></>,
      <>相同净投放可有不同保险价值：隔夜 repo 解决一天结算压力，三个月 repo 减少续作风险，长期购买还改变久期和稀缺性。操作表要同时显示 flow 与 outstanding，防止把到期续作重复算成新增宽松。</>,
    ],
  },
  {
    id: 'fixed-full-allotment', number: 31, label: 'Fixed Quantity / Full Allotment',
    title: '固定数量让价格或配给揭示需求；固定价格 full allotment 让数量在预设价格内生。',
    paragraphs: [
      <>固定数量拍卖给出资金量，投标利率与分配反映竞争；固定价格 full allotment 则在合格抵押品和规则内满足全部投标，数量随需求变化。后者自动适应需求不确定性，但报价太低会替代私人市场，太高则无人使用。<Cites ns={[1, 20, 29]} /></>,
      <>“full”仍不代表实际无限：抵押品、haircut、名单、操作日、期限和风控都是约束。评价需求驱动框架要读完整条款，不读口号。</>,
    ],
  },
  {
    id: 'maturity-collateral-haircut', number: 32, label: 'Maturity / Collateral / Haircut',
    title: '操作利率相同，期限、抵押品便利与 haircut 仍会改变可执行融资价格。',
    paragraphs: [
      <>repo 现金利率只是总成本一部分。交出稀缺证券会失去 specialness；haircut 使可借现金小于抵押市值；较长期限减少续作风险却更久占用抵押品。比较市场与央行 repo 时必须匹配期限，并另列抵押品、haircut、资产负债表和操作成本。<Cite n={32} /></>,
      <>扩大合格抵押品或降低 haircut 能在牌价不变时提高便利容量。BoE 2026 年抵押品资格调整处于 repo-led 转型背景，更接近实施能力变化，不应无证据改写成宏观立场变化。<Cite n={24} /></>,
    ],
  },
  {
    id: 'standing-lending', number: 33, label: 'Standing Lending Facility',
    title: '常备贷款便利既是尾部保险也是利率控制工具，但真实使用条件决定上界有多软。',
    paragraphs: [
      <>短缺机构可用合格抵押品获得央行资金，降低收盘极端短缺成本并压住隔夜率上尾；但定价过低、准入过宽会减少同业交易并让央行成为日常首选。最优设计在控制稳定与市场替代之间权衡。<Cites ns={[12, 25, 47]} /></>,
      <>牌价之外还有 collateral、haircut、操作、披露与 stigma。便利使用突增可能是系统稀缺，也可能是个别机构或操作问题；必须与利率分布、付款和抵押品共同诊断。</>,
    ],
  },
  {
    id: 'standing-deposit', number: 34, label: 'Standing Deposit / Absorbing',
    title: '吸收端为合资格多余资金提供替代；覆盖越窄，表面地板越可能泄漏。',
    paragraphs: [
      <>银行把余额留在央行或进入存放便利可获管理利率；reverse repo 等工具还能把外部选项扩展到更广对手方。市场率过低时，吸收可减少可贷现金或提高贷款人外部回报，从而上推利率。<Cites ns={[6, 25]} /></>,
      <>吸收也改变央行负债由谁持有。ON RRP 把部分流动性从银行准备金转换为其他合格对手方持有的央行 reverse-repo liability；它能支持地板，却不应与银行准备金不加说明地合并。<Cites ns={[1, 6]} /></>,
    ],
  },
  {
    id: 'effective-facility-price', number: 35, label: 'Effective Facility Price',
    title: '只有把牌价与抵押品、资产负债表、操作和 stigma 转成同单位净价，便利才能与市场比较。',
    paragraphs: [
      <>借款便利的机构有效成本等于牌价加各项可执行成本；存放端净回报则从牌价扣除准入、资产负债表和操作成本。市场只有在央行选项真正更便宜或更优时才受它约束。<Cites ns={[23, 25, 47]} /></>,
      <>课堂可冻结合成 <code>κ</code> 训练复算；现实中无法观察部分应作为区间或机制标签。用“牌价与市场率的残差”直接命名 stigma，会把信用、抵押品和测量误差全塞进一个词。</>,
    ],
    formula: { label: '机构净价', expression: <><code>iᴸ,ᵉᶠᶠᵢ = iᴸ + κcollᵢ + κhaircutᵢ + κBSᵢ + κopsᵢ + κstigmaᵢ</code><br /><code>iᴰ,ⁿᵉᵗⱼ = iᴰ − κaccessⱼ − κBSⱼ − κopsⱼ</code></>, note: <>所有成本先换为同期限年化单位；公式是分栏，不保证每项可精确相加识别。</> },
  },
  {
    id: 'four-rate-objects', number: 36, label: 'Four Rate Objects',
    title: 'policy rate、operating target、administered rate 与 effective benchmark 是四个对象。',
    paragraphs: [
      <>policy rate 表达立场；operating target 是实施要引导的近端市场变量；administered rate 是央行直接设定的账户或便利价格；effective benchmark 是由合格成交按方法计算的统计量。Fed 的目标区间、IORB 与 EFFR 分属不同栏；RBA cash rate 又同时承担操作目标与官方成交 benchmark 角色。<Cites ns={[4, 7, 8, 20, 23, 30]} /></>,
      <>若把四者合成“政策率”，央行宣布值与市场测量值会循环相等，实施误差从数据中消失。每一列都要保存值、合约、方法、生效与发布时间。</>,
    ],
  },
  {
    id: 'benchmark-methodology', number: 37, label: 'Benchmark Methodology',
    title: 'benchmark 是一项有样本边界的统计量；median、trimmed mean 与 weighted average 回答不同问题。',
    paragraphs: [
      <>EFFR 是合格 federal funds 成交的成交量加权中位数；€STR 是对两端各 25% 成交量修剪后的加权均值；SONIA 使用中央 50% 成交量 trimmed mean；RBA cash rate 与 BoJ call rate 使用各自覆盖内的加权平均。它们的币种、交易人、担保状态和算法不能互换。<Cites ns={[8, 19, 23, 30, 36]} /></>,
      <>同日尾部跳升时，中位数可不动而 99 分位上升。两者不是一真一假，而是 estimand 不同。控制监测要保存中心、分位数、成交量、参与者与 contingency；低成交沿用前值或方法改版也要打 flag。</>,
    ],
  },
  {
    id: 'control-error', number: 38, label: 'Control Error',
    title: '点目标与区间目标必须用不同误差函数；vicinity 目标还要事前冻结容忍带。',
    paragraphs: [
      <>点目标直接用有效率减目标。区间目标只量到最近边界：低于下界时取 <code>iEff−L</code>，区间内为零，高于上界取 <code>iEff−U</code>。区间内仍可另报相对中点位置，但不能把它冒充正式越界失败。<Cites ns={[4, 5]} /></>,
      <>“附近”目标必须引用央行声明或研究者事前定义，不能看完结果再调宽。误差应以 basis points、同日生效条款和同种合约计算；secured benchmark 相对 unsecured target 的差不是纯控制误差。</>,
    ],
    formula: { label: '同对象误差函数 g', expression: <><code>ePoint = iEff − i*</code><br /><code>eRange = iEff−L if below; 0 if inside; iEff−U if above</code></>, note: <>后续 shock 公式调用这一已定义的 <code>g(iEff,targetSet)</code>，不把区间强压成标量 T。</> },
  },
  {
    id: 'implementation-dashboard', number: 39, label: 'Feedback-control Dashboard',
    title: '央行监测的是价格分布、数量、准入与日历组成的机制面板，不是一条日度平均率。',
    paragraphs: [
      <>最低面板包含有效率及 1/25/75/99 分位、目标误差、管理利差、secured–unsecured spread、成交量与集中度、准备金总量和分布、需求弹性、付款时点、facility take-up、抵押品 specialness、政府账户、现金、税期／结算日和 benchmark contingency。每项带 <code>observedAt</code> 与方法版本。<Cites ns={[8, 9, 11, 28]} /></>,
      <>控制循环是 <code>target → terms → market → measurement → diagnosis → response</code>。响应可能改管理率、数量、期限、便利或只容忍短暂波动；记录必须使用规范字段 <code>reserveManagementPurpose</code>，否则后人会把技术动作错标为立场改变。</>,
    ],
  },
  {
    id: 'scarcity-diagnosis', number: 40, label: 'Diagnosis: Scarcity',
    title: 'scarcity 的证据不是“某天利率高”，而是数量对 spread 的边际影响显著、非线性增强。',
    paragraphs: [
      <>支持组合包括：市场率相对准备金报酬上升；利率对自治因素或准备金变化更敏感；上分位与 dispersion 扩大；付款延后；银行提高借入却不愿贷出；repo 或贷款便利使用增加。单一高率日也可能来自政策预期、信用或抵押品。<Cites ns={[9, 11, 12]} /></>,
      <>2019 年美国税款与国债结算两天吸收约 1200 亿美元准备金，压力由较低总量、僵化交易关系和分布约束共同放大，随后 repo 与储备管理购买稳定市场。这是“日历 × 数量区域 × 网络 × 分布”的联合案例，不是一个神奇阈值故事。<Cites ns={[9, 51]} /></>,
    ],
  },
  {
    id: 'segmentation-diagnosis', number: 41, label: 'Diagnosis: Segmentation',
    title: '总量足够而压力集中于特定主体、网络或法律实体，更像分割而不是系统性稀缺。',
    paragraphs: [
      <>若聚合 spread 平稳但机构／市场分位显著分叉，便利有资格与无资格者报价不同，付款和借款压力集中在少数节点，证据更支持 segmentation。全系统注入可能缓解却过宽；扩大适当准入、改善再分配、调整对手方或代理网络可能更对症。<Cites ns={[13, 35, 55]} /></>,
      <>诊断必须区分法律实体与集团合并值。集团内余额会受监管、破产隔离、币种和时区限制，母行有钱不等于子行结算账户可立即使用；交易级网络和双边报价比全市场均值更有信息。</>,
    ],
  },
  {
    id: 'dealer-constraint-diagnosis', number: 42, label: 'Diagnosis: Dealer Constraint',
    title: 'repo 融资压力可以来自 dealer 资产负债表约束，而非支付系统准备金不足。',
    paragraphs: [
      <>当客户融资国债的需求增加，核心 dealer 的杠杆、资本或风险限额会限制中介，repo benchmark 可上升，即便 settlement balances 足以满足成员日常支付。加拿大 2025 年事件研究把 client repo demand 与 dealer constraints 的互动列为重要机制，term repo 与借贷失衡回落共同缓解压力。<Cite n={28} /></>,
      <>抵押品 specialness 是另一条机制，主要回到 32 节：稀缺证券可压低 specific repo，国债供给与 inventory 又可提高 GC 融资。诊断时并看 GC/special、secured/unsecured、dealer positions、fails 与准备金，不从一条 repo rate 倒推出准备金需求。</>,
    ],
    boundary: <>本节中心是 dealer 中介容量；抵押品自身便利收益由 32 节拥有。</>,
  },
  {
    id: 'observation-confounds', number: 43, label: 'Observation Confounds',
    title: '观测到的 benchmark 偏离不等于真实控制故障；日历、测量与沟通是三类可区分的映射混淆。',
    paragraphs: [
      <>税期、国债结算、月季末、假期和维持期末可同时改变现金、抵押品、资产负债表窗口与付款。若偏离在预先已知日历重复且快速消退，更像短暂映射；若扩散到正常日和多个市场，才支持结构需求变化。<Cites ns={[9, 43]} /></>,
      <>测量混淆包括成交量过低、参与者集中、异常交易、trim 阈值、沿用前值和方法改版；沟通混淆则是市场把 reserve-management operation 读成 QE，或把 facility repricing 读成立场变化。两者分别要求规范字段 <code>benchmarkMeasurementFlag</code> 与 <code>reserveManagementPurpose</code>，不是把所有异常归成一个 shock。<Cites ns={[8, 14, 19]} /></>,
    ],
  },
  {
    id: 'reserve-management-qe', number: 44, label: 'Reserve Management / QE / Market Functioning',
    title: '三类购买可以拥有相同会计分录，却试图切断不同的机制边。',
    paragraphs: [
      <>储备管理购买补偿现金、政府账户或其他负债增长，维持既定隔夜控制状态；QE 通过久期、稀缺、信号或组合再平衡改变较长期金融条件；市场功能购买首先修复交易、做市或价差失灵。三者都可能使证券资产与准备金上升。<Cites ns={[14, 49, 50]} /></>,
      <>识别需要公告目的、资产期限、规模相对市场、状态依赖退出与价格响应。Powell 2019 对短券储备管理购买和危机后 LSAP 的区分支持“目的不同”，但不能证明任何短券购买都零外溢。<Cite n={14} /></>,
    ],
  },
  {
    id: 'qt-normalization', number: 45, label: 'QT / Normalisation',
    title: 'QT 机械减少准备金；何时推高隔夜 spread，取决于曲线区域、需求移动与常规融资工具。',
    paragraphs: [
      <>资产到期不再投资或出售使央行资产下降，其他负债给定时准备金下降。在 abundant 平坦区，spread 可几乎不动；进入 ample／scarce 过渡后，同量 runoff 的价格影响增强。央行可以停 QT、做 repo 或调整资产期限，分开“组合正常化”和“隔夜控制”。<Cites ns={[11, 12, 53, 54]} /></>,
      <>BoE 与 RBA 展示需求驱动的替换：长期资产或疫情工具退出时，常规 repo 取用内生上升，央行资产从长期证券／贷款转向短期 repo，准备金由需求托底。因此长期资产 runoff 与准备金不再继续下降可以同时发生。<Cites ns={[20, 22, 29, 31]} /></>,
    ],
  },
  {
    id: 'market-functioning-backstop', number: 46, label: 'Market-functioning Backstop',
    title: '便利既要防止流动性尾部，又不能用稳定的零成交假象替代健康市场。',
    paragraphs: [
      <>低摩擦、低价格的常备便利能稳定支付和隔夜率，却可能减少私人流动性保险与价格发现；高价格、窄准入保留市场交易，却会在需求不确定时放大尾部。最优储备供给模型把 rate control 与 market disintermediation 的权衡显式化。<Cite n={12} /></>,
      <>框架评价不能只最小化日均目标误差，还要看成交量、集中度、私人／央行融资构成、压力容量、抵押品准备度与操作演练。没有交易而稳定的 benchmark 不必表示实施健康。</>,
    ],
  },
  {
    id: 'fed-snapshot', number: 47, label: 'Snapshot: Federal Reserve',
    title: '截至冻结时点，Fed 的 ample-reserves 框架以 IORB 为主锚，并用辅助工具把 EFFR 保持在目标区间。',
    paragraphs: [
      <>2026-07-29 FOMC 维持 federal funds target range 3.50–3.75%；7 月 30 日起 IORB 3.65%，standing overnight repo rate 3.75%，ON RRP offering rate 3.50%，primary credit rate 3.75%。Desk 可在必要时买入剩余期限三年以内 Treasury 以维持 ample reserves。这组名义值是有日期的条款，不是永久参数。<Cites ns={[3, 4]} /></>,
      <>操作目标／观察值是 federal funds rate／EFFR；EFFR 为合格无担保隔夜成交的 volume-weighted median。IORB 只对合格账户余额可得，ON RRP 扩展地板覆盖；总量判断还需 repo、FHLB／MMF 行为、分布与付款时点。<Cites ns={[5, 6, 8]} /></>,
    ],
    boundary: <>官方文件证明当前条款；Staff Report 的需求阈值不是 FOMC 法定阈值。</>,
  },
  {
    id: 'ecb-snapshot', number: 48, label: 'Snapshot: Eurosystem',
    title: 'Eurosystem 以 DFR 引导短端，并从 abundant liquidity 向弹性、混合供给过渡。',
    paragraphs: [
      <>2024 review 保留由 DFR 附近引导短期率，并以 MRO、三个月 LTRO 及未来结构性操作／组合提供流动性。2026-07-23 最新决定维持 DFR/MRO/marginal lending 2.25/2.40/2.65%；这组利率自 6 月 17 日生效。<Cites ns={[15, 16, 17]} /></>,
      <>自 2026-06-17 起，合格货币政策对手方 current account 中超过 minimum reserves 的余额，无论是否转入 deposit facility，按 DFR 计息；这不包括 required reserves 或所有主体。€STR 是批发无担保借款 benchmark，不是 DFR 的别名，非银行准入与中介成本能使其更低。<Cites ns={[18, 19]} /></>,
    ],
    boundary: <>ECB 自称弹性混合框架，不应硬塞进永恒“纯地板”标签。</>,
  },
  {
    id: 'boe-snapshot', number: 49, label: 'Snapshot: Bank of England',
    title: 'Bank Rate 计息准备金，供给正转向 demand-driven、repo-led；repo 取用增加不等于立场宽松。',
    paragraphs: [
      <>BoE 对合格 reserves balances 以 Bank Rate 计息，并以短端市场率与 Bank Rate 一致为实施目标。随着 APF 与 TFSME 相关准备金下降，STR 和 ILTR 常规使用上升；官方 Guide 与 2025–26 报告把目标描述为 demand-driven、repo-led。<Cites ns={[20, 21, 22]} /></>,
      <>SONIA 是合格英镑无担保隔夜存款的 central-50% trimmed mean，不是准备金账户率。collateral eligibility、auction clearing spread、OSF/DWF 定价与参与者准备度共同决定 repo-led 供给是否真实可达。<Cites ns={[21, 23, 24]} /></>,
    ],
  },
  {
    id: 'boc-snapshot', number: 50, label: 'Snapshot: Bank of Canada',
    title: 'BoC 官方称 floor system，但 target−5bp 的 deposit rate 与 repo 结构使它不是零 spread 的教科书地板。',
    paragraphs: [
      <>本课审计冻结于 <code>2026-09-01 23:12:02 ET</code>；当时 2026-09-02 09:45 ET 决定尚未发布。最近已发布的 2026-07-15 决定为 overnight target 2.25%、Bank Rate 2.50%、deposit rate 2.20%。自 2025-01-30 起 deposit rate=target−5bp，operating band 宽 30bp。<Cites ns={[25, 26]} /></>,
      <>CORRA 衡量 general-collateral repo，不是政策目标本身；dealer 资产负债表与客户 repo 需求会使其波动。框架页有“deposit earns target”的旧概括，但日期明确的新条款与当次决定优先；OR/ORR、term repo 和 standing facilities 还各有主体、抵押品与价格。<Cites ns={[25, 27, 28]} /></>,
    ],
    boundary: <>数据层另存 <code>nextScheduledReleaseAt=2026-09-02 09:45 ET</code>；不能用页面访问日期冒充未来决定的 as-of。</>,
  },
  {
    id: 'rba-snapshot', number: 51, label: 'Snapshot: Reserve Bank of Australia',
    title: 'RBA 已采用 demand-driven ample 的正式设计，但疫情遗留余额仍高于需求，实际状态尚在过渡。',
    paragraphs: [
      <>RBA 以 AONIA/cash rate 为无担保隔夜操作目标与 weighted-average benchmark。2026-08-11 cash rate target 4.35%，ES rate 按现行设计为 target−10bp；常规 OMO 以 full allotment 方式按规则提供准备金。<Cites ns={[30, 31, 33]} /></>,
      <>2026-08-25 官方讲话称 ES balances 约 2000 亿澳元，高于 700–1000 亿调查需求区间，市场资金仍可比 RBA OMO 更便宜取得，因此“已经抵达 ample 稳态”不准确。正式框架名称与当时数量状态必须分栏。<Cite n={29} /></>,
    ],
  },
  {
    id: 'boj-snapshot', number: 52, label: 'Snapshot: Bank of Japan',
    title: 'BoJ 以无担保隔夜 call rate“约”某水平为目标；CDF 与市场率的小负 spread 体现准入分割。',
    paragraphs: [
      <>2026-06-17 起 uncollateralized overnight call target 为约 1.0%，CDF 对除 required reserves 外的合格 current-account balances 付 1.0%，basic loan rate 1.25%；7 月 31 日决定维持 call target 约 1.0%。<Cites ns={[34, 37, 52]} /></>,
      <>FY2025 操作报告显示 call rate 可略低于 CDF：合资格机构能借入后存回央行，但贷款人准入、交易成本和容量使 spread 未必归零。官方统计是其定义覆盖内的 volume-weighted average，不代表全部日元隔夜交易；“around”也不按点目标零容忍评分。<Cites ns={[35, 36]} /></>,
    ],
  },
  {
    id: 'pboc-snapshot', number: 53, label: 'Snapshot: PBOC',
    title: '7 天逆回购表达主要政策率，DR001 是当前短端观察层；数量、走廊与多期限工具共同实施。',
    paragraphs: [
      <>2024 年改革把 7 天期逆回购改为固定利率、数量招标并明示主要政策率属性，这是制度起源。2026Q2 报告记录当前演进：6 月 17 日起临时正／逆回购改为政策率 −25bp/+25bp，区间缩至 50bp，DR001 持续突破相关操作率成为触发条件，操作时间适度提前，6 月底首次增加固定利率、数量招标的隔夜逆回购；短端调控观察自 2025 起由 DR007 逐步转向 DR001，MLF 已退出政策利率功能。<Cites ns={[38, 39]} /></>,
      <>DR001／DR007 是存款类机构以利率债质押的银行间 repo rate，不是准备金报酬，也不与 EFFR 的无担保合约等价。锁定来源不能确认 2026-09-02 当日 7 天逆回购名义值，比较卡因此显示“未在锁定来源中确认”，不得沿用旧数字。<Cites ns={[38, 40, 41]} /></>,
    ],
    boundary: <>降准或零 RRR 不等于零准备金需求；“合理充裕”也不保证每个机构任一时点无资金压力。</>,
  },
  {
    id: 'framework-comparison', number: 54, label: 'Seven-system Comparison',
    title: '七央行只能按同一字段比较实施机制，不能把名义利率、币种余额和官方标签排成一张松紧榜。',
    paragraphs: [
      <>比较固定十三字段：立场工具、操作目标、benchmark/contract、准备金报酬、供给方式、常规操作、贷款便利、吸收选项、准入、抵押品、准备金要求／平均、当前转型、快照日期。Fed、ECB、BoE 可有相近的低边际机会成本，却以不同供给、目标合约和非银行覆盖实现；BoC 与 RBA 的小正 spread 也不能被当成同一制度。<Cites ns={[1, 2]} /></>,
      <>跨币种名义利率不能直接比较松紧，绝对准备金金额不能排名充裕度，secured 与 unsecured benchmark 不能合并。可比较的 estimand 是“本币近端利率怎样被相应工具和市场结构锚住”。</>,
    ],
    after: <FrameworkComparison />,
  },
  {
    id: 'currency-account-venue', number: 55, label: 'Currency / Account / Venue',
    title: '同一机构的流动性不能跨币种、法律实体、账户、venue 与时区无成本合并。',
    paragraphs: [
      <>准备金是特定币种、央行账户与结算系统中的负债；不同币种、法律实体、账户类型或 venue 的余额不能无说明合并。在岸 secured 与 unsecured 合约也不是同一个交易网络，表面同期限利差首先可能是对象差异。</>,
      <>观察到两个隔夜率不同，先问边际交易者能否同时进入两项市场、两项央行选项和同一结算时钟，再讨论套利或控制失败。S55 支持市场分割的一般边界，S60 支持结算最终性与风险字段；二者不为跨境代理、FX swap 或 swap line 的具体传导背书，那些机制明确交给 Chapter 4。<Cites ns={[55, 60]} /></>,
    ],
    formula: { label: '不可删除的边界字段及其 canonical 归属', expression: <code>{canonicalBoundaryFieldPaths.join(' · ')}</code>, note: <>任何 rate 或 reserve quantity 缺少这些嵌套字段，都不能安全跨制度拼接；它们不是 contract 之外的裸别名。</> },
  },
  {
    id: 'necessary-not-sufficient', number: 56, label: 'Necessary, Not Sufficient',
    title: '隔夜率贴近目标只证明政策到达第一站，不证明收益率曲线、银行信贷和实体经济同比例响应。',
    paragraphs: [
      <>本节只识别政策是否到达第一站：目标、管理条款、准备金状态与相应隔夜 benchmark。S55 已足以说明近端货币市场之间的 pass-through 也会受准入和分割影响；本节没有期限结构或银行信用模型，因此不能从隔夜控制结果推出长端、贷款或总需求方向。<Cite n={55} /></>,
      <>交给 3.07 的规范字段是 <code>effectiveOvernightRate、overnightContractType、benchmarkMethod、benchmarkMeasurementFlag、expectedImplementationPath、technicalActionSurprise、implementationOutcomeSurprise、timestamps</code>。3.07 才拥有期限结构，3.09–3.10 拥有银行负债与信贷，3.13 汇总金融条件；这些字段不使用 <code>securedSpread、benchmarkFlag、distributionState</code> 等未定义别名。</>,
    ],
  },
  {
    id: 'policy-implementation-shock', number: 57, label: 'Policy / Technical / Outcome Innovation',
    title: '目标、技术条款与控制结果是三层 surprise；未经排除限制，任何一层都还不能叫结构 shock。',
    paragraphs: [
      <>点、区间与 vicinity 不能硬压成同一标量 T。政策侧保存完整 <code>targetVector</code> 与会前预期；技术条款侧比较实际管理条款与“给定实际目标变化时”的条件预期；结果侧调用 38 节同对象误差 <code>e=g(iEff,targetSet)</code>。目标不变而 IORB 意外移动 5bp，只能先记 technical-action surprise；没有 <code>iEff</code> 就不能计算 implementation-outcome surprise。<Cites ns={[4, 9]} /></>,
      <>目标和配套管理率同步移动 25bp 时，若后者正好等于给定新目标的条件预期，主要是 policy-decision surprise，技术条款 surprise 为零。只有再排除同期准备金需求、抵押品、测量和央行信息变化后，意外控制误差才可命名 implementation-outcome shock；多维条款不能逐项相加重复计数。</>,
    ],
    formula: { label: '三层 surprise 候选', expression: <><code>surprisePolicy = ΔtargetVector − E₋ΔtargetVector</code><br /><code>surpriseTechnical = ΔadministeredTerms − E₋[ΔadministeredTerms | ΔtargetVector]</code><br /><code>surpriseOutcome = Δe − E₋Δe, where e=g(iEff,targetSet)</code></>, note: <>条件预期防止把新目标的机械配套条款重复计数；“shock”还需要结构排除限制。</> },
  },
  {
    id: 'research-design', number: 58, label: 'Local Research Design',
    title: '研究应局部切断一条边，而不是用一条 OLS 声称识别整个准备金系统。',
    paragraphs: [
      <>统一原则是先注册 estimand、时钟、单位、样本与未排除机制，再讨论设计。历史流动性效应研究、实时非线性需求估计与 RBA 的 IV 练习分别说明供给误差、threshold 和内生需求的不同难点；它们不共同证明一套通用识别法。<Cites ns={[11, 32, 44, 57]} /></>,
      <>资格、tier quota、交易网络、多时间戳与抵押品条款只是待 Chapter 7 验证的候选 assignment：S13 只建立网络机制，S24 只记录抵押品制度变化，均不自动满足排除限制。后续必须另补方法来源、选择进入、同时信息、安慰剂与 falsification，不能把候选边直接写成已识别设计。<Cites ns={[13, 24]} /></>,
    ],
    boundary: <>Chapter 7 接手预注册、因果图、方法文献、安慰剂、异质性与外推；本节只给设计护照，不声明任何候选已识别。</>,
  },
  {
    id: 'closed-loop', number: 59, label: 'Closed Implementation Loop',
    title: '稳定实施来自持续诊断和学习，不是一次选定“最佳框架”后停止调整。',
    paragraphs: [
      <>闭环从决定编译为管理条款、数量、准入与抵押品；异质主体形成边际准备金价值并交易；benchmark 分布与目标误差回到诊断；技术响应改变下一轮条款。需求随支付、存款、监管和压力移动，供给受资产、现金、政府账户与操作取用改变，工具又反过来塑造市场行为。<Cites ns={[1, 12, 20, 29]} /></>,
      <>面对陌生制度，先问最终结算资产是什么、谁能持有、谁能进便利、边际报酬是多少、总量与分布怎样、操作价格与抵押品是什么、有效率如何统计、偏离发生在哪一层。只有这些字段闭合，才有资格把波动归因于 scarcity、segmentation、dealer、calendar 或经识别的 implementation-outcome shock。</>,
    ],
    formula: { label: '完整闭环', expression: <code>decision → compiler → terms / supply / access / collateral → marginal value → trades → benchmark → error + diagnostics → response → next state</code>, note: <>任一箭头都可能随制度、风险和学习改变。</> },
  },
];

const checks = [
  { question: '为什么银行间付款不改变系统准备金总量？', answer: '央行账本只把余额从付款银行转给收款银行；改变总量需要央行与外部部门交易或自治因素变化。', sourceIds: [1, 13] },
  { question: '政府缴税为何可在央行资产不变时减少准备金？', answer: '政府央行存款上升与银行准备金下降同处负债端，其他项给定时 ΔR=−ΔG。', sourceIds: [1] },
  { question: '零 RRR 为什么不等于零准备金需求？', answer: '支付结算、尾部流出缓冲、监管便利和相对收益仍会产生条件需求。', sourceIds: [1, 59] },
  { question: '系统 ample 为什么不等于每家机构 ample？', answer: '余额分布、付款网络、内部阈值、法律实体和准入决定边际短缺。', sourceIds: [13, 51] },
  { question: 'BIS 为什么分开边际机会成本与超额数量？', answer: '数量影响流动性管理，边际 spread 影响交易激励；tiering 下平均与边际报酬还会分离。', sourceIds: [1] },
  { question: '走廊上下端为什么不是无条件硬界？', answer: '只有借贷双方分别能以匹配期限、低成本进入相应便利，且借款人有合格抵押品时，牌价才近似约束成交。', sourceIds: [1, 45] },
  { question: '地板下方成交为什么可能没有无风险套利？', answer: '贷款人可能无准入，而有账户银行吸收资金会付资产负债表、信用与操作成本。', sourceIds: [19, 35] },
  { question: 'demand-driven 与 abundant 有何不同？', answer: '前者是供给规则，后者是需求曲线区域；它们可以独立组合。', sourceIds: [1, 29] },
  { question: 'repo 利率为什么不能只解释为准备金稀缺？', answer: 'dealer 容量、客户融资需求、抵押品 specialness、信用与分割也会移动。', sourceIds: [28, 32] },
  { question: 'benchmark 中心稳定为什么仍可能存在压力？', answer: 'median 或 trimmed mean 可掩盖尾部，需要同时看分位数、成交量、集中度和 contingency。', sourceIds: [8, 19] },
  { question: '怎样区分储备管理购买与 QE？', answer: '比较目的、期限与久期、反事实、公告和预期通道，而不是只看资产与准备金上升。', sourceIds: [14, 49, 50] },
  { question: 'QT 为什么可能一段时间不推高隔夜 spread？', answer: '平坦区中数量下降的边际价格效应小；接近陡峭区后才增强，常规 repo 还可内生补位。', sourceIds: [11, 12, 29] },
  { question: '区间目标内为什么不按中点判失败？', answer: '正式目标允许一个范围；越界误差在范围内为零，中点位置是另一项监测统计。', sourceIds: [4, 5] },
  { question: 'technical-action surprise 何时不能叫 implementation-outcome shock？', answer: '这是本课的三层审计分解：前者测量给定目标后的条款意外，后者测量同对象控制误差的意外；没有有效率就无法计算后者，而且未排除准备金需求、抵押品、测量与同期政策信息时，即使有结果 surprise 也不能命名为结构 shock。', sourceIds: [4, 9] },
  { question: '隔夜率贴近目标为何不证明贷款率同比例变化？', answer: '3.06 没有期限结构或银行信用模型；S55 只证明就连近端市场内部的 pass-through 也可受分割影响，因此本章证据不允许把近端控制外推为贷款率结论；该链条由 3.07 与 3.09–3.10 建模。', sourceIds: [55] },
  { question: '怎样把本章压成一个可证伪问题？', answer: '例如事前定义政府账户预测误差，估计 EFFR−IORB 对供给的状态依赖局部斜率，并写清排除限制与 falsification。', sourceIds: [11, 44, 57] },
] as const;

const glossary = [
  ['Reserve balance', '合格机构对央行的账户债权', '公众银行存款或可直接借给家庭的库存', '04–06'],
  ['Final settlement asset', '特定币种与系统中清偿银行间债务的央行负债', '跨币种万能流动性', '04、55'],
  ['Autonomous factor', '不由当次立场决定却会改变准备金的现金、政府账户等项目', '已经识别的外生 shock', '08'],
  ['Reserve demand', '支付、预防、监管与相对收益下的条件需求', '法定准备金本身', '10–17'],
  ['Excess reserves', '超过制度要求的隔夜余额', '无用余额或每家机构都多余', '20'],
  ['Marginal opportunity cost', '相关隔夜率减边际准备金报酬', '平均计息率或福利损失', '15、20'],
  ['Reserve-demand curve', 'spread 与准备金数量的非线性条件关系', '跨期不变函数', '21'],
  ['Corridor', '供给与需求斜坡相交、便利提供软外部选项的框架', '央行硬性规定每笔成交', '22–23'],
  ['Floor', '低机会成本区内由管理报酬锚定近端率', '任何成交都不得更低', '24–25'],
  ['Leaky floor', '市场率低于表面存放或准备金报酬', '必然政策失控', '25'],
  ['Ample', '足以可靠控制而需求曲线斜率仍可非零的状态／机构术语', 'every bank sufficient', '26'],
  ['Abundant / satiated', '需求曲线近乎平坦的数量区域', 'demand-driven 供给', '27'],
  ['Demand-driven supply', '央行设获取价格并按规则满足合格需求', '免费、无抵押、无限供给', '27、31'],
  ['Tiering', '不同余额区段按不同率计息', '用平均报酬替代边际报酬', '28'],
  ['Administered rate', '央行直接设定的账户或便利价格', '有效市场 benchmark', '29、36'],
  ['OMO', '按明确条款注入或吸收准备金的央行交易', '自动等于 QE', '30、44'],
  ['Full allotment', '合格投标在固定价格按规则满足', '无资格与抵押品约束', '31'],
  ['Haircut', '抵押品市值相对可借现金的折减', '利率本身', '32'],
  ['Standing facility', '规则内按需可用的央行借贷或存放选项', '无 stigma 的硬界', '33–35'],
  ['Operating target', '实施部门要引导的近端市场变量', '法定最终目标或算法', '36'],
  ['Effective benchmark', '由合格成交按预定方法形成的统计量', '市场全部交易', '37'],
  ['Implementation-outcome shock', '目标给定后、由控制误差 surprise 且经排除限制识别的实施结果创新', 'technical-action change、条款 surprise 或未解释 residual', '57–58'],
] as const;

const implementationInputAliases = [
  { source: 'actionVector', target: 'actionVector' },
  { source: 'effectiveDate', target: 'timestamps.effectiveAt' },
  { source: 'operatingTarget', target: 'operatingTarget' },
  { source: 'corridor/floor terms', target: 'targetType + administeredTerms + reserveRemunerationTerms + facilityTerms' },
  { source: 'balanceSheetInstruction', target: 'balanceSheetInstruction' },
] as const;

const canonicalImplementationStateFields = [
  'actionVector', 'balanceSheetInstruction', 'operatingTarget', 'targetType', 'administeredTerms', 'reserveRemunerationTerms', 'facilityTerms',
  'currency', 'overnightContractType', 'effectiveOvernightRate', 'targetError', 'benchmarkMethod', 'benchmarkMeasurementFlag', 'administeredSpread',
  'expectedImplementationPath', 'reserveQuantity', 'excessReserveQuantity', 'reserveDistributionState', 'reserveDemandRegime', 'reserveSettlementState',
  'supplyMode', 'facilityUsage', 'facilityAccess', 'liquidityBufferState', 'marketVolumes', 'rateDispersion', 'securedUnsecuredSpread', 'repoSpread',
  'collateralState', 'segmentationState', 'calendarState', 'paymentOutflowState', 'governmentDepositFlows', 'debtSettlementCalendar',
  'reserveManagementPurpose', 'technicalAction', 'technicalActionSurprise', 'implementationOutcomeSurprise', 'autonomousForecastError', 'policySurprise',
  'eligibilityState', 'networkState', 'timestamps', 'methodologyVersion',
] as const;

type CanonicalImplementationStateField = (typeof canonicalImplementationStateFields)[number];

type CanonicalImplementationState = {
  [Field in CanonicalImplementationStateField]: unknown;
} & ImplementationBoundaryState;

type CanonicalImplementationStateKey = Extract<keyof CanonicalImplementationState, string>;

function outputInterface(
  name: string,
  fields: readonly CanonicalImplementationStateKey[],
  guardrail: string,
) {
  return { name, payload: fields.join('、'), guardrail };
}

const interfaces = [
  {
    name: 'I1 · 3.05 → 3.06',
    payload: implementationInputAliases.map(({ source, target }) => `${source} → ${target}`).join('；'),
    guardrail: '这是显式 alias map；一次决定不能只传 headline rate，也不能静默重命名。',
  },
  {
    name: 'I2 · T06 → 3.06',
    payload: 'centralBankBS、bankBS、doubleEntry、consolidationScope',
    guardrail: '这些是外部会计输入；资产负债表恒等式不是因果模型。',
  },
  outputInterface('I3 · 3.06 → 3.07', ['effectiveOvernightRate', 'overnightContractType', 'benchmarkMethod', 'benchmarkMeasurementFlag', 'expectedImplementationPath', 'technicalActionSurprise', 'implementationOutcomeSurprise', 'timestamps'], '隔夜率不能直接外推长端。'),
  outputInterface('I4 · 3.06 → 3.09', ['reserveSettlementState', 'reserveDistributionState', 'facilityAccess', 'paymentOutflowState', 'liquidityBufferState', 'timestamps'], '存款融资与信用创造由 3.09 计算，本节不用货币乘数机械解释贷款。'),
  outputInterface('I5 · 3.06 → 3.10', ['effectiveOvernightRate', 'administeredTerms', 'facilityAccess', 'collateralState', 'liquidityBufferState', 'rateDispersion', 'timestamps'], 'bankMarginalFundingCost 由 3.10 从这些输入推导，不在本节伪装成已计算输出。'),
  outputInterface('I6 · 3.06 → 3.13', ['effectiveOvernightRate', 'securedUnsecuredSpread', 'repoSpread', 'rateDispersion', 'targetError', 'timestamps'], '金融条件还需要曲线、信用、汇率与股票。'),
  outputInterface('I7 · 3.06 ↔ 3.18', ['governmentDepositFlows', 'debtSettlementCalendar', 'autonomousForecastError', 'reserveManagementPurpose', 'timestamps'], '财政流影响准备金，不自动等于财政支配。'),
  outputInterface('I8 · 3.06 → 3.23 / Chapter 7', ['policySurprise', 'technicalActionSurprise', 'implementationOutcomeSurprise', 'timestamps', 'autonomousForecastError', 'eligibilityState', 'networkState'], '变化、surprise 与经排除限制识别的 shock 分栏保存。'),
] as const;

const snapshotFields = [
  'Stance instrument', 'Operating target', 'Benchmark / contract', 'Reserve remuneration', 'Supply mode', 'Regular operation',
  'Standing lending', 'Absorbing option', 'Access', 'Collateral', 'Requirement / averaging', 'Current transition', 'Snapshot date',
] as const;

const frameworkSnapshots: { institution: string; sourceIds: number[]; values: string[] }[] = [
  {
    institution: 'Federal Reserve', sourceIds: [3, 4, 5, 6, 8], values: [
      'Federal funds target range 3.50–3.75%', 'Federal funds rate within target range', 'EFFR；eligible unsecured overnight federal funds；volume-weighted median',
      'IORB 3.65%，自 2026-07-30 生效', 'Ample reserves；数量在平坦／温和斜率区由资产与储备管理维持',
      'Desk repo / reverse repo 与必要时 ≤3y Treasury purchases', 'Standing overnight repo 3.75%；primary credit 3.75%', 'ON RRP 3.50%',
      '准备金账户、ON RRP 和 repo 对手方资格不同', 'Standing repo 与 primary credit 各有合格抵押品和限额',
      '无普遍正准备金率要求；仍有支付与预防需求', '持续评估 ample 边界与分布，不把 Staff 估计当法定阈值', '决定 2026-07-29；条款 2026-07-30；审计访问 2026-09-02',
    ],
  },
  {
    institution: 'Eurosystem', sourceIds: [15, 16, 17, 18, 19], values: [
      'DFR 2.25%；MRO 2.40%；MLF 2.65%', '短期市场率在 DFR 附近', '€STR；批发无担保隔夜银行借款；两端各 25% 成交量修剪后加权均值',
      '合格对手方 excess reserves 与 deposit facility 均按 DFR；required reserves 另行处理', '弹性混合供给；从 abundant liquidity 过渡',
      'MRO、3m LTRO；未来结构性操作与组合', 'Marginal lending facility', 'Deposit facility 与央行账户 excess remuneration',
      '货币政策对手方有账户与操作资格；€STR 贷款人覆盖更广', 'Eurosystem collateral framework',
      'Minimum reserves 存在；excess 与 required 必须分栏', '让银行间市场重新承担更多分配，同时保持弹性流动性', '三率 2026-06-17 生效，2026-07-23 再确认；审计访问 2026-09-02',
    ],
  },
  {
    institution: 'Bank of England', sourceIds: [20, 21, 22, 23, 24], values: [
      'Bank Rate', '短期 sterling money-market rates 与 Bank Rate 一致', 'SONIA；合格无担保隔夜存款；中央 50% 成交量 trimmed mean',
      '合格 reserves balances 按 Bank Rate 计息', '目标为 demand-driven、repo-led；实际取用随长期工具退出增加',
      'STR 与 ILTR', 'Operational Standing Facility / Discount Window Facility', '准备金账户；必要时吸收操作',
      'SMF 参与者与设施资格分层', 'SMF collateral 与 haircut；2026-06 有资格调整',
      '不以单一 RRR 描述边际需求；操作日历与抵押准备重要', 'APF/TFSME 相关准备金下降，常规 repo 逐步接棒', 'Guide 更新至 2026-07-29；报告覆盖至 2026-02；审计访问 2026-09-02',
    ],
  },
  {
    institution: 'Bank of Canada', sourceIds: [25, 26, 27, 28], values: [
      'Overnight target 2.25%', 'Overnight rate target / operating band', 'CORRA；general-collateral repo；不是 target 本身',
      'Deposit rate 2.20%=target−5bp', '官方 floor system；30bp operating band',
      'Overnight repo / reverse repo、term repo 与市场操作', 'Bank Rate 2.50%；standing liquidity / overnight standing repo', 'Deposit facility 与 ORR 等吸收端',
      'Lynx participants、dealers 与工具对手方资格不同', 'Repo 与便利需要合格抵押品',
      '结算余额与网络分布重要；旧网页概括服从日期明确条款', '关注 CORRA 中 dealer 约束与客户需求，不把 repo 压力全归准备金', '冻结 2026-09-01 23:12:02 ET；9/2 09:45 ET 决定当时尚未发布',
    ],
  },
  {
    institution: 'Reserve Bank of Australia', sourceIds: [29, 30, 31, 33], values: [
      'Cash rate target 4.35%', 'Interbank Overnight Cash Rate / AONIA', '国内银行间无担保隔夜成交；weighted average',
      'ES rate=target−10bp', '正式设计为 demand-driven ample；当时余额仍供给驱动并高于需求',
      'Fixed-rate full-allotment OMO 与公开市场 repo', 'Standing facilities / open repo 过渡安排', 'ES balances 计息；必要时吸收',
      'Exchange Settlement Account holders 与 OMO 参与者', 'OMO 与设施的合格抵押品和 haircut',
      '无单一金额阈值；调查需求区间只是时点信息', '约 200bn ES 对调查 70–100bn，尚未抵达需求决定稳态', '目标 2026-08-11；状态讲话 2026-08-25；审计访问 2026-09-02',
    ],
  },
  {
    institution: 'Bank of Japan', sourceIds: [34, 35, 36, 37, 52], values: [
      'Uncollateralized overnight call rate around 1.0%', '无担保隔夜 call rate 约 1.0%', '定义覆盖内 brokered/direct call trades；volume-weighted average',
      'CDF 对合格 excess current-account balances 1.0%', '大额央行账户余额与操作共同供给；目标使用 around',
      'Money-market operations 与证券操作', 'Basic loan rate 1.25%', 'CDF',
      'CDF 资格与 call-market 贷款人范围不完全重合', '贷款操作要求合格抵押品',
      'Required reserves 与 CDF-eligible excess 分开', '小幅 call<CDF spread 反映准入与成本，非自动失控', '条款 2026-06-17；7/31 决定维持；审计访问 2026-09-02',
    ],
  },
  {
    institution: 'PBOC', sourceIds: [38, 39, 40, 41], values: [
      '7-day reverse repo 为主要政策率；9/2 名义值未在锁定来源确认', '短端观察自 DR007 逐步转向 DR001', 'DR001/DR007；存款类机构、利率债质押 repo；与 EFFR 合约不同',
      '多层准备金与 RRR 制度；不可压成一个 IORB 等价物', '价格、数量、走廊与结构工具并用',
      '固定利率、数量招标的 7-day reverse repo；临时 O/N 与 2026-06 新增 O/N reverse repo', 'SLF 等；期限与对象不同', '临时正回购等吸收端；2026-06 起相关 O/N 区间 ±25bp',
      '存款类机构、公开市场业务一级交易商和工具资格不同', 'DR 以利率债质押；各工具抵押品另定',
      'RRR 仍是数量工具；零／降 RRR 不等于零结算需求', 'MLF 退出政策率功能；触发更聚焦 DR001 持续突破', '综合报告 2026-08-12；审计访问 2026-09-02；9/2 日度名义值未确认',
    ],
  },
];

const evidenceGroups = [
  { title: 'A｜分类与资产负债表', text: 'S01–S02 支持机会成本、数量、供给方式和跨国字段；不能提供 2026 名义值或福利排名。', ids: [1, 2] },
  { title: 'B｜Fed 条款、benchmark 与 2019', text: 'S03–S14 中官方层证明条款和方法，staff research 解释需求、网络与事件；研究阈值不是法定阈值。', ids: Array.from({ length: 12 }, (_, i) => i + 3) },
  { title: 'C｜六个其他实施体系', text: 'S15–S41 支持 ECB、BoE、BoC、RBA、BoJ 与 PBOC 的制度和日期快照；币种、合约与术语不可直接比较。', ids: Array.from({ length: 27 }, (_, i) => i + 15) },
  { title: 'D｜经典理论与货币会计', text: 'S42–S50 支持随机需求、averaging、走廊／地板、贷款—存款会计、便利与资产购买分类；模型假设和历史会计说明都不是2026现行参数。', ids: Array.from({ length: 9 }, (_, i) => i + 42) },
  { title: 'E｜现代需求、网络与识别', text: 'S51–S58 支持分布、付款、存款、抵押品、pass-through 与非线性；估计依赖样本和内生性假设。', ids: Array.from({ length: 8 }, (_, i) => i + 51) },
  { title: 'F｜监管与结算', text: 'S59–S60 支持 HQLA、变现测试、支付与最终性；不规定统一准备金量或最优框架。', ids: [59, 60] },
  { title: 'G｜课堂合成数值', text: 'M1–K5 与 ST1–ST10 只由公开公式和冻结断言支持；任何论文都不为合成参数或答案概率背书。', ids: [] },
] as const;

function FrameworkComparison() {
  return (
    <div className="framework-comparison" aria-label="七家央行的十三字段实施机制比较" role="group">
      {frameworkSnapshots.map((snapshot) => (
        <article key={snapshot.institution}>
          <header><h3>{snapshot.institution}</h3><p><Cites ns={snapshot.sourceIds} /></p></header>
          <dl>
            {snapshotFields.map((field, index) => <div key={field}><dt>{field}</dt><dd>{snapshot.values[index]}</dd></div>)}
          </dl>
        </article>
      ))}
      <p className="framework-comparison-footnote">名义率不可跨币种排名松紧；绝对余额不可排名充裕度；secured 与 unsecured benchmark 不可当同一对象。字段若未在锁定来源确认，明确显示“未确认”，不补猜。</p>
    </div>
  );
}

function Lesson306Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>政策决定不是靠公告文字自动进入市场，而要被编译成价格、数量、准入、抵押品与结算规则，再经异质主体交易形成有效隔夜率。</h2>
        <p>3.05 交付条件政策决定；本节研究实施误差。完整链是：委员会决定 → 实施指令 → 管理利率、准备金供给、便利、准入、抵押品与日历 → 银行对下一单位准备金的边际估值 → 隔夜借贷与 repo → benchmark 及分布 → 相对操作目标的偏差 → 技术响应。央行能公布目标，却不能只凭命名让每一笔交易按目标成交。<Cites ns={[1, 5, 15, 25, 42]} /></p>
        <p>中心机制不是“准备金越多，利率越低”的直线，而是价格、数量与摩擦的联合状态。同样总量在准入分割、抵押品稀缺、资产负债表成本或支付集中时会形成不同利率；同样隔夜率也可由稀缺走廊、充裕地板、分层报酬或需求驱动 repo 得到。近端控制成功只是必要条件，不代表曲线、贷款或总需求已同比例响应。<Cites ns={[1, 11, 13, 28, 29, 55]} /></p>
        <PolicyImplementationTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>先画最终结算资产和需求曲线，再谈走廊、地板或 ample；框架标签必须晚于机制。</h2>
        <div className="learning-objectives"><span>核心首读约 75–90 分钟</span><ol>
          <li><b>账本路线（02–09）：</b>决定护照、编译、准备金定义、结算与 T-account。</li>
          <li><b>需求路线（10–21）：</b>日内／隔夜需求、监管、边际机会成本、分布与非线性区域。</li>
          <li><b>工具路线（22–37）：</b>走廊、地板、tiering、供给方式、OMO、便利和 benchmark。</li>
          <li><b>诊断路线（38–59）：</b>控制误差、四类故障、七制度快照、传导接口和局部识别。</li>
        </ol></div>
        <p>核心路线是 00、01、02、04、06、07、10、15、18、20、21、23、24、25、27、29、30、35、36、38、39、40、44、54、56、57、59；其余机制深化不从目录、深链接、打印或全文中删除。这样零背景读者可先掌握闭环，再返回制度细节。</p>
        <div className="precision-note"><span>章节所有权</span><p>3.07 拥有期限结构；3.09–3.10 拥有银行存款、贷款与信用创造；3.13 拥有综合金融条件；3.18 拥有财政—货币互动；3.23 与 Chapter 7 完成 shock 识别。本节只交付有对象、有时钟的近端实施状态。</p></div>
      </section>

      {conceptSections.map((section) => <ImplementationConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Lab</p>
        <h2>十道合成题先校验账本、对象和单位，再诊断稀缺、分割、操作目的、技术条款意外与实施结果意外。</h2>
        <p>所有题都显式标记 SYNTHETIC。错答只显示所选项为什么不完整，不显示正确选项、完整复算或下一题；答对后才解锁机制解释。客户端静态站无法阻止主动检查源代码，因此页面只承诺“作答界面不提前泄露”，不声称服务端级答案保密。</p>
        <MoneyMarketImplementationLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>静态孪生改变数字或制度对象，提供无脚本与打印环境下可独立复算的完整步骤。</h2>
        <div className="case-grid" id="implementation-static-twins">
          {policyImplementationScenarios.map((scenario, index) => (
            <article className="case-card" key={scenario.id}>
              <span>STATIC {String(index + 1).padStart(2, '0')} · SYNTHETIC</span>
              <h3>{scenario.staticTwin.title}</h3>
              <p><b>题干：</b>{scenario.staticTwin.prompt}</p>
              <ol>{scenario.staticTwin.calculations.map((step) => <li key={step}>{step}</li>)}</ol>
              <p><b>标准答案：</b>{scenario.staticTwin.answer}</p>
              <p><b>单位护栏：</b>{scenario.formulaUnits}</p>
              <p><b>机制来源：</b> <Cites ns={scenario.staticSourceIds} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks / Glossary</p>
        <h2>掌握标准不是背出七家央行牌价，而是能在陌生制度中重建最终结算资产、边际选项、统计对象与故障层。</h2>
        <div className="check-list">{checks.map((check, index) => <details key={check.question}><summary>{index + 1}. {check.question}</summary><p>{check.answer} <Cites ns={[...check.sourceIds]} /></p></details>)}</div>
        <div className="term-grid" aria-label="3.06术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces / Reading / Evidence Map</p>
        <h2>本节交付的是带币种、合约、主体、统计方法与时间戳的实施状态；后续章节不得把它退化成一个无摩擦“政策率”。</h2>
        <div className="interface-grid">{interfaces.map(({ name, payload, guardrail }) => <article key={name}><span>{name}</span><h3>交付字段</h3><p><code>{payload}</code></p><em>{guardrail}</em></article>)}</div>
        <div className="precision-note"><span>3.06 唯一 canonical state contract</span><p><code>{canonicalImplementationStateFields.join(', ')}</code>。I3–I8 的字段由 TypeScript 联合类型限制为这套契约的子集；<code>securedSpread、benchmarkFlag、distributionState、overnightRate、implementationDispersion</code> 等旧别名不再作为输出。最低合格记录不是孤立的“3.6%”，而是同时说明合约、交易人、结算场所、统计方法、操作目标和多重时间戳。</p></div>
        <div className="precision-note"><span>不可删除边界的嵌套类型</span><p><code>{canonicalBoundaryFieldPaths.join(', ')}</code>。<code>CanonicalImplementationState</code> 把 44 个顶层键与 <code>ImplementationBoundaryState</code> 相交：<code>eligibilityState</code> 必须含 <code>legalEntity/accountType</code>，<code>overnightContractType</code> 必须含 <code>venue</code>，<code>reserveSettlementState</code> 必须含 <code>settlementSystem</code>，<code>timestamps</code> 必须含 IANA <code>timezone</code>。这些是 canonical 顶层对象的强制子字段，不是实现者可以省略的文字备注。</p></div>

        <h3>Evidence Map · 来源数量不能替代证据类型</h3>
        <div className="evidence-map" aria-label="3.06连续覆盖60条来源的证据地图" role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} {group.ids.length ? <Cites ns={[...group.ids]} /> : null}</p></div>)}</div>
        <div className="precision-note"><span>快照与未来发布防护</span><p>BoC 快照精确冻结于 2026-09-01 23:12:02 ET；PBOC 9 月 2 日当日 7 天逆回购名义值未由锁定来源确认。任何后来发布只能作为新 revision 更新整组字段，不能静默回填历史 as-of。</p></div>
        <p>最小复述是：<b>央行先把政策决定编译为管理利率、准备金供给、便利、准入、抵押品与日历；银行依据支付、风险、监管与可执行净回报形成异质的边际准备金价值；隔夜交易再按明确方法形成 benchmark。点、区间与 vicinity 目标需要不同误差函数；偏离必须联合数量、分布、dealer、抵押品、日历和测量诊断。policy-decision surprise、technical-action surprise 与 implementation-outcome surprise 分属三个对象；只有经结构排除限制后才能把相应创新命名为 shock，而近端控制也只把政策送到第一站。</b></p>
      </section>
    </>
  );
}

export const lesson306: LessonRecord = {
  slug: '3-06',
  id: '3.06',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Policy Rate → Money Market Rate：准备金、操作框架与隔夜利率控制',
  subtitle: '政策决定怎样通过准备金的价格、数量、准入、抵押品与操作规则，改变最后结算资产的边际价值，并把隔夜成交率拉回操作目标附近',
  readingTime: '核心首读约 75–90 分钟；完整正文与逐式复算约 220–280 分钟；互动实验首次完成 30–40／含复盘 45–55，静态变式、检查题与术语约 50–70；来源与延伸阅读不计',
  prerequisite: '3.05 的 actionVector / effectiveDate / operatingTarget / balanceSheetInstruction；按需调用 T06 Balance Sheet、T07 Repo / Unsecured Loan 与 T08 Trading / Settlement / Vintage',
  updatedAt: '2026-09-02',
  revision: '3.06-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.06-r4',
      summary:
        '独立通读 00–63、60 条连续来源、18 组阅读、20 道主题与静态孪生题、5 组 T-account、7×13 制度快照、8 个接口与 canonical contract；逐项复算公式、单位、题目、账本与当前央行一手条款，并确认 tiered 曲线在 Q=55 显式给出右侧近 10bp 阶跃，Q=56、59、60、80 与函数精确一致，6/6 断言通过；冻结前后 16 项哈希一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.06-r4',
      summary:
        '独立审核零背景教学递进，并用真实系统 Chrome 逐击 64/64 深链、验证首页键鼠入口、1280/390 视口、控制台、溢出与 axe；精确检查 tiered 在 Q=55/56/59/60/80 和 shift=−15/0/+15 的曲线—圆点—读数一致，完成 20 个错答门控、10/10、刷新恢复、两步重置、5 个账本场景与打印回归；冻结前后 16 项哈希一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '3-05', label: '3.05 Central Bank Objective & Reaction Function' },
  next: { slug: '3-07', label: '3.07 Yield Curve' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson306Content,
  references: lesson306References,
  readingList: lesson306ReadingList,
};
