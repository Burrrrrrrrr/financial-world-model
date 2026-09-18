import type { SafeAssetSourceId } from './safeAssetConcepts';

export type SafeAssetCheck = {
  question: string;
  answer: string;
  sourceIds: readonly SafeAssetSourceId[];
};

export type SafeAssetCoreRouteStep = {
  time: string;
  title: string;
  task: string;
  conceptIds: readonly string[];
  exitCheck: string;
};

export type SafeAssetPassportRule = {
  field: string;
  question: string;
  reason: string;
  unknownRule: string;
};

export type SafeAssetResearchQuestion = {
  question: string;
  design: string;
  evidenceNeeded: string;
  whatWouldWeakenIt: string;
  sourceIds: readonly SafeAssetSourceId[];
};

export type SafeAssetInterface = readonly [name: string, payload: string, guardrail: string];

export const safeAssetThesis = [
  '全球为什么同时需要“美元”和“美国国债”？因为货币单位解决记账、合约和付款语言，具体债权工具解决价值停放、交易退出、抵押融资和危机时可动用性。两者可以通过同币种市场相互强化，却不是同一对象；同样写着美元的存款、国债和公司债也不会自动提供相同服务。',
  '官方部门和私人资产负债表真正需求的是一组状态依赖的服务：偿付可信、价格损失可控、市场能承接、法律与操作上可达，并能在需要时出售或抵押。合格资产因这些非现金服务可能获得更高价格和便利收益；连续发行又可能增加float、基准和抵押品，形成需求—市场深度—货币网络的正反馈。',
  '这条关系不是“债务越多越好”。当财政可信度、展期能力、做市资产负债表或制度可达性成为约束时，新增负债可降低每单位安全服务，毛余额也会在可用、合格、未占用和市场承接的漏斗中大量损耗。4.03因此只研究资产服务、相对短缺、非单调供给与识别上限，不给主权评级、最优储备权重、债务阈值、汇率预测或交易建议。',
] as const;

export const safeAssetEntryVocabulary = [
  ['Reserve currency', '一种货币在官方储备持有中承担的国际功能；它描述货币单位和网络，不是某只证券的名称。'],
  ['Reserve asset', '由货币当局控制、可用于国际收支融资或外汇操作等任务并满足统计条件的外部资产类别；不等于所有外币资产。'],
  ['Official foreign exchange reserves', '官方储备中按外汇工具和币种观察的支路；不包含货币黄金、SDR holdings和IMF reserve position的全部储备概念。'],
  ['Claim / issuer', 'claim是持有人对债务人拥有的金融权利；issuer或debtor说明谁承担支付义务。币种相同不意味着债务人和风险相同。'],
  ['Safe asset', '对明确主体、用途、规模和状态提供较强信用、价格、流动性、法律、操作或抵押服务的资产；不是永久无风险标签。'],
  ['Asset service', '资产除现金流以外提供的可交易、可抵押、可达和坏状态可用性等功能。'],
  ['Convenience yield', '在关键现金流和风险尽量匹配后，服务资产相对比较资产接受的较低金融收益所对应的服务价格候选量度。'],
  ['Matched comparator', '在币种、期限、现金流、信用、税收和套保成本等关键维度与研究资产尽量一致的比较资产。'],
  ['Bid–ask spread / tightness', '买价与卖价之间的距离，主要描述小额即时交易的一部分成本，不等于市场深度。'],
  ['Market depth', '不同价格档位可承接的数量；同样点差下，深度仍可能不同。'],
  ['Price impact', '给定交易规模引起的价格变化；必须同时写出交易规模、工具、场所和时间窗口。'],
  ['Resilience', '价格和订单簿在冲击后恢复的速度；本文把它作为需要另取恢复路径数据的扩展诊断，来源14并未测量此项，高成交量本身也不证明韧性。'],
  ['Collateral', '为融资或其他义务提供保障、在违约时可被处置的资产；可抵押不自动等于储备资产。'],
  ['Haircut', '出借方不按全部抵押市值放款的折扣；会随资产、对手方、设施和状态变化。'],
  ['Eligibility', '某工具是否被特定设施、交易对手或规则接受；不是资产的普遍永久属性。'],
  ['Encumbrance', '资产已被质押、限制或承担其他权利负担，因而不能被视为完全自由可用。'],
  ['Float / available supply', '真正可能进入交易或抵押网络的数量；不同于全部发行或未偿余额。'],
  ['Effective safe-asset capacity', '在主体和状态明确后，经可用、资格、未占用与市场承接过滤的服务容量；本课Qeff只作SYN教学。'],
  ['Aggregate shortage', '在同一服务口径下，总需求超过有效总供给的假说。'],
  ['Distributional shortage', '总量存在，但资产被持有人、监管、法域、托管或操作安排锁住，无法到达需要者。'],
  ['Stress liquidity shortage', '资产名义上合格，却不能在所需时间内以可接受haircut和价格冲击变现。'],
  ['Triffin-type tension', '全球要求中心提供足够可靠负债，与发行者维持这些负债可信度之间的条件张力；不是经常账户赤字恒等式。'],
  ['Market value / par value', 'market value按当前价格计量，par value按面值或合同本金计量；两者不能静默互换。'],
  ['SYN / OBS / INF', 'SYN是教学合成情景，OBS是带统计护照的观测，INF是以模型或作者假设从观测推出的结果；三者必须分栏。'],
  ['PIT / OOS', 'point-in-time（PIT，历史时点当时可得）保存当时信息集；out-of-sample（OOS，样本外）检验锁定规则在未参与构造的数据上的表现。'],
  ['STOP / unknown / null', 'STOP表示输入违反计算合同；unknown或null表示证据缺失。二者都不等于经济零。'],
] as const;

export const safeAssetCoreRoute = [
  {
    time: '00–08分钟',
    title: '入口分拣：先把货币单位、债权工具与统计类别分开。',
    task: '阅读4.03.1和入口术语；把“美元、美元存款、美国国债、货币黄金、互换额度”分别写成单位、资产、特殊储备项目或潜在流动性安排。',
    conceptIds: ['safe-asset-mechanism-01'],
    exitCheck: '能解释“美元储备不等于美国国债”，并能说出为什么货币黄金不能硬写成对普通发行者的债权。',
  },
  {
    time: '08–18分钟',
    title: '用途优先：官方为什么持有，而不是先问哪个收益最高。',
    task: '阅读4.03.2；为干预、外部偿债、紧急支付与信心缓冲各写一个时间窗口，再说明为什么收益必须服从可用性。',
    conceptIds: ['safe-asset-mechanism-02'],
    exitCheck: '能拒绝一套适用于所有经济体的储备权重，并指出国家任务、负债和制度为何改变需求。',
  },
  {
    time: '18–30分钟',
    title: '安全服务向量：从“不会违约”扩展到坏状态能否使用。',
    task: '阅读4.03.3；选一项熟悉资产，用信用安全、名义价格稳定、市场流动性、法律与操作可达、抵押品可用、坏状态表现六维逐栏描述，未知处明确写unknown。法律与操作在概念分析中可继续拆问，但C1把二者合为同一“可达性”栏。',
    conceptIds: ['safe-asset-mechanism-03'],
    exitCheck: '能给出一个“信用风险低但不适合当前任务”的反例，并说清主体、用途、状态和规模。',
  },
  {
    time: '30–42分钟',
    title: '匹配后才谈便利收益：识别服务价格，而不是给普通利差改名。',
    task: '阅读4.03.4并手写CY公式；逐项核对币种、期限、现金流、信用、税与套保成本，任一不匹配就列污染项并STOP。',
    conceptIds: ['safe-asset-mechanism-04'],
    exitCheck: '能解释为什么“国债收益率低”既不单独证明便利收益，也不单独证明安全资产短缺。',
  },
  {
    time: '42–54分钟',
    title: '流动性四维：相同成交量也可能有不同的大单退出能力。',
    task: '阅读4.03.5；把spread、depth、price impact和resilience分别写出单位和问题。前三项对照来源14，resilience单列为需另取冲击后恢复数据的扩展诊断，不允许合成一个未经证明的总分。',
    conceptIds: ['safe-asset-mechanism-05'],
    exitCheck: '能构造两个成交量相同、但深度和价格冲击不同的市场，并指出观察覆盖必须限定到工具和场所。',
  },
  {
    time: '54–66分钟',
    title: '抵押现金能力与容量漏斗：从一件资产走到全市场有效供给。',
    task: '阅读4.03.6–4.03.7；手算一次haircut现金能力，再让毛余额依次经过可提供、资格、未质押且操作可达、市场承接四个SYN系数。',
    conceptIds: ['safe-asset-mechanism-06', 'safe-asset-mechanism-07'],
    exitCheck: '能解释为什么可抵押不等于储备资产、毛债务不等于Qeff，并知道已质押和unknown不能按自由数量或零处理。',
  },
  {
    time: '66–76分钟',
    title: '相对短缺与非单调供给：同时保留数量效应和可信度效应。',
    task: '阅读4.03.8–4.03.9；把总量、分配与压力期流动性短缺各配一类必要数据，再画出“发行改善float”与“约束侵蚀服务”两条相反链。',
    conceptIds: ['safe-asset-mechanism-08', 'safe-asset-mechanism-09'],
    exitCheck: '能拒绝“债务越多越安全”和“债务越多越危险”两种单调说法，并说明哪种状态条件决定方向。',
  },
  {
    time: '76–88分钟',
    title: 'Triffin条件张力与COFER识别上限：从理论世界回到可观察数据。',
    task: '阅读4.03.10–4.03.11；区分原始制度语境、现代安全资产模型和经常账户叙事，再列出同一个币种市场价值可由哪些不同工具路径生成。最后完成理解检查17–20。',
    conceptIds: ['safe-asset-mechanism-10', 'safe-asset-mechanism-11'],
    exitCheck: '能说明Triffin不是赤字恒等式，也能列出识别Treasury数量需求仍缺的逐工具数量、价格、交易、收益与持有人数据。',
  },
] satisfies readonly SafeAssetCoreRouteStep[];

export const safeAssetChecks: readonly SafeAssetCheck[] = [
  {
    question: '为什么“美元是储备货币”不能推出“美元储备就是美国国债”？',
    answer: '储备货币描述货币单位在官方持有中的功能；美国国债是对美国财政主体的具体债权。同币种还可以包含存款、其他证券和claims，BPM7储备资产又包含货币黄金、SDR holdings和IMF reserve position等不同项目，所以必须逐项识别工具、债务人、控制与可用性。',
    sourceIds: [1, 4],
  },
  {
    question: '为什么货币黄金属于储备资产时，仍不能把全部储备资产定义成对非居民的普通债权？',
    answer: 'BPM7对储备资产有专门分类和例外结构；货币黄金不是对某个非居民债务人的普通金融claim，SDR holdings与IMF reserve position也有各自制度关系。定义必须保留特殊项目，不能为追求整齐而硬填发行者。',
    sourceIds: [1],
  },
  {
    question: '官方储备管理为什么不能简单等同收益最大化？',
    answer: '储备要在特定时间完成干预、外部支付、偿债、信心与紧急流动性任务。若高收益资产在任务时点不可出售、兑换或依法动用，就不能完成首要目的；安全与流动性约束先限定可选集合，收益只是在该集合中的目标之一。',
    sourceIds: [2, 3],
  },
  {
    question: '能否用同一储备充足率和币种权重评价所有经济体？',
    answer: '不能。汇率制度、外债、进口、资本流、市场准入、法律权限与风险容忍度不同，储备的适当水平和工具结构也不同。IMF框架明确不存在一刀切答案，本课不计算现实政策缺口或最优配置。',
    sourceIds: [2, 3],
  },
  {
    question: '为什么低违约概率不足以证明一项资产对某持有人“安全”？',
    answer: '持有人还可能面对利率引起的市价损失、交易深度不足、法律或托管受限、操作不可达、抵押资格变化与坏状态共同出售。只有把主体、用途、状态和规模写清，才能讨论哪些安全服务成立。',
    sourceIds: [7, 8, 12, 13, 14],
  },
  {
    question: '一项资产平时点差很窄，为什么仍可能不适合大额紧急变现？',
    answer: '点差主要反映小额即时交易的一部分成本；大额变现还取决于订单簿depth、给定规模的price impact和冲击后resilience。来源14观测前三项而不测resilience；后者必须另取冲击后恢复路径，不能从该报告或成交量反推。压力期做市资产负债表收缩时，四维仍可能同时恶化。',
    sourceIds: [12, 14],
  },
  {
    question: '便利收益公式为什么要求先找matched comparator？',
    answer: '收益率同时包含期限、现金流、信用、税、流动性、监管和套保等补偿。研究者必须先登记要识别的目标服务：若目标是安全、流动与抵押便利，就故意保留这些服务差异，同时匹配币种、期限、现金流、信用、税与套保成本；其他未登记差异仍须列作污染项。没有目标—控制边界时，连便利收益候选也不能命名或显示；即使声明匹配全部通过，结果仍只是受遗漏变量约束的候选量，不是纯量。',
    sourceIds: [8, 9],
  },
  {
    question: '便利收益能否为零或负数，低收益率是否必然意味着高便利？',
    answer: '便利收益是状态依赖的相对价格候选量度，可以缩小、为零甚至为负。低收益率还可能来自货币政策、通胀与增长预期、期限溢价、税收或套保成本，不能单独识别服务价值。',
    sourceIds: [8, 9],
  },
  {
    question: '为什么成交量大不等于市场深？',
    answer: '成交量记录实际活动，depth记录不同价格档位可承接的数量。压力期被迫交易可能让成交量升高，同时平均交易规模下降、挂单变薄、价格冲击增大。来源14可支持spread、depth与impact的历史测量；resilience必须用另取的冲击后恢复数据观察，四项不能合成未经验证的总分。',
    sourceIds: [14],
  },
  {
    question: '窄点差能否证明大单可无损退出？',
    answer: '不能。窄点差只说明最优买卖报价接近，未说明报价后有多少数量，也未说明一笔大单穿透多少价位。要判断大单退出，至少还需深度和规模条件下的price impact。',
    sourceIds: [14],
  },
  {
    question: '为什么“可作抵押”不能证明资产属于官方储备？',
    answer: '抵押资格由特定设施和交易对手规则决定，BPM7储备资产还要求控制、可用性、外部资产及用途等统计条件。某资产可以是合格抵押品却不属于货币当局储备，也可以属于储备但在某设施中不合格。',
    sourceIds: [1, 13],
  },
  {
    question: 'haircut从低位升高时，为什么现金能力会下降，即使资产数量未变？',
    answer: '按cash=(1−h)PQ，haircut上升直接降低每单位抵押品可借现金；若同时价格下跌、资格收缩或一部分已质押，自由合格数量也会下降。该算术仍不保证交易对手愿意成交。',
    sourceIds: [12, 13],
  },
  {
    question: '为什么债务未偿余额增长不能直接写成安全资产有效供给同比增长？',
    answer: '毛余额还要经过可交易与可提供、设施资格、未被锁定或质押、法律和操作可达、以及市场在给定状态下能否承接等过滤。任何一层不扩张，Qeff都可能增长更少或下降。',
    sourceIds: [7, 8, 12, 13, 14],
  },
  {
    question: '总量短缺、分配短缺和压力期流动性短缺有何不同？',
    answer: '总量短缺是同一服务口径下总需求超过有效总供给；分配短缺是资产存在却被规则、持有人、法域或操作安排锁住；压力期流动性短缺是名义合格资产不能按所需时间和可接受折扣变现。三者需要总量、持有人/资格和压力交易数据三类不同证据。',
    sourceIds: [7, 8, 12],
  },
  {
    question: '为什么一条低收益率曲线不能单独证明全球安全资产短缺？',
    answer: '收益率由货币政策、增长和通胀预期、期限溢价、供给、监管、税收、套保与便利服务共同决定。短缺命题还必须明确谁的需求、什么用途、何种状态和有效供给，并排除替代解释。',
    sourceIds: [7, 8, 9],
  },
  {
    question: '增发为什么可能先提高、后降低有效安全服务容量？',
    answer: '在可信度和中介容量充足时，连续标准化发行可增加float、基准价格、抵押品和做市深度；当财政、展期、通胀、市场承接或制度约束主导时，新增负债可能提高风险补偿、haircut和价格冲击，降低每单位服务。理论不提供现实统一转折点。',
    sourceIds: [7, 8, 12],
  },
  {
    question: 'Triffin-type tension为什么不是“储备货币国必须持续经常账户赤字”？',
    answer: '原始Bretton Woods约束、现代安全资产供给和现代财政容量是不同版本；国际负债还可通过既有资产、毛头寸、私人发行与跨境中介形成。真正的条件张力是全球要求足够可靠负债，而发行者必须维持其可信度，不是由一个经常账户符号机械决定。',
    sourceIds: [7, 10, 11],
  },
  {
    question: '为什么COFER币种市场价值上升不能直接称为央行净买入该币种国债？',
    answer: '同币种可包含存款、证券和其他claims，期末市场价值又会受本金交易、收益、汇率、债券价格、覆盖、修订和估算影响。COFER不公开匿名逐工具数量与完整交易桥，所以无法唯一识别某种国债净买入。',
    sourceIds: [4, 5, 6],
  },
  {
    question: 'SYN、OBS与INF在本课中各能证明什么？',
    answer: 'SYN只验证定义、算术和条件方向；OBS只能在其统计护照内描述观测对象；INF依赖模型、匹配或识别假设，必须与观测分开。SYN不能校准现实，OBS不能自动成为因果，INF不能伪装成官方发布。',
    sourceIds: [1, 4, 7, 8],
  },
  {
    question: '作者检查、构建、浏览器或双审通过后，是否证明现实PIT、OOS、因果和政策最优？',
    answer: '不证明。教材QA与双审只覆盖冻结文本、交互合同和有限算术；历史point-in-time（PIT）数据、out-of-sample（OOS）验证、工具级识别、因果、预测、政策反事实、投资建议与生产资格都必须取得各自证据。',
    sourceIds: [],
  },
];

export const safeAssetPassportRules = [
  { field: 'function', question: '这条记录回答储备、交易、抵押、定价还是融资中的哪一个功能？', reason: '同一资产可承担多种功能，不同统计量不能因名称相似而合并。', unknownRule: '功能未写明时停止跨来源比较。' },
  { field: 'holder / decision right', question: '谁持有、谁有权出售、质押或调度？', reason: '官方部门、银行和基金面对不同任务与规则，名义持有人也可能不是决策者。', unknownRule: '匿名汇总不得反推具体国家或机构。' },
  { field: 'instrument / legal claim', question: '它是存款、证券、黄金、SDR项目、IMF头寸还是潜在流动性安排？', reason: '工具决定现金流、权利、债务人和统计分类。', unknownRule: '不能用币种名称替代工具字段。' },
  { field: 'issuer / debtor / backing', question: '谁承担付款义务，若非普通claim，其制度安排是什么？', reason: '同币种不同债务人的信用和法律风险不同；特殊储备项目不能硬填普通发行者。', unknownRule: '债务人或制度权利未知时不得评价信用服务。' },
  { field: 'currency', question: '现金流、计价和实际可用流动性分别是什么币种？', reason: '计价单位、付款币与对冲后风险可能不同。', unknownRule: '币种不清时不得与另一币种收益或需求直接比较。' },
  { field: 'unit', question: '金额是面值、市场价值、数量、收益率、bp、成交额还是百分比？', reason: '不同单位不能相加，bp差值也不等数量需求。', unknownRule: '单位缺失的数值不得进入公式或图表。' },
  { field: 'reference period', question: '它是某日状态、季度末存量、期间流量还是多年论文样本？', reason: '状态、流量和历史样本回答不同问题。', unknownRule: '参考期不一致时只能并排展示，不能直接求差。' },
  { field: 'coverage', question: '覆盖哪些主体、工具、场所和法域，排除了什么？', reason: '特定平台、on-the-run市场或官方外汇储备都不是全市场。', unknownRule: '覆盖未知时不得把样本写成总体。' },
  { field: 'denominator', question: '比例或份额以什么集合为分母？', reason: '报告者数量、世界外汇储备、全部官方资产和安全资产总量是不同分母。', unknownRule: '分母不同的份额不直接比较或平均。' },
  { field: 'vintage', question: '数据何时下载、按哪种方法发布，是否经历回溯修订？', reason: '方法断点和估算会改变历史序列，今天看到的值不必等于当时可得值。', unknownRule: '缺vintage时不得声称PIT。' },
  { field: 'maturity / cash flows', question: '何时支付本金和收益，期限与任务时钟是否匹配？', reason: '期限和现金流是便利收益匹配及官方可动用性的关键维度。', unknownRule: '期限不明时不得显示期限匹配后的便利收益候选，也不得判断期限覆盖；期限明确也不能把候选升级为纯量。' },
  { field: 'market value / par value', question: '用当前价格还是面值计量，价格来源和估值时点是什么？', reason: '利率变化可让市场价值变化而数量不变。', unknownRule: '估值基础不明时不得把价值变化称为交易。' },
  { field: 'eligibility', question: '对哪个设施、交易对手或规则合格？', reason: '资格是关系属性，不是资产的全球永久标签。', unknownRule: '设施未指定时只可写“可能合格”。' },
  { field: 'encumbrance / availability', question: '资产是否已质押、锁定、受限制或由持有人拒绝提供？', reason: '毛持有不等于自由可用数量。', unknownRule: '未知不得按全部free float或零处理。' },
  { field: 'haircut / margin', question: '在什么对手方、期限和状态下采用多少折扣？', reason: '现金能力对haircut敏感，压力期参数可能跳变。', unknownRule: '平时haircut不得静默外推到压力情景。' },
  { field: 'price risk', question: '信用、利率、通胀、汇率和流动性损失分别由谁承担？', reason: '不违约不等于市场价值稳定。', unknownRule: '风险维度缺失时不得称“无风险”。' },
  { field: 'liquidity dimensions', question: 'spread、depth、price impact和resilience各由什么数据测量？', reason: '来源14只测量前三项；resilience需要冲击后恢复路径。成交量和任一单项都不能替代完整退出能力。', unknownRule: '缺失维度保留unknown，不从来源14补写resilience，也不合成总分。' },
  { field: 'jurisdiction / custody / operational access', question: '权利在哪个法域、由谁托管、多久可转移或抵押？', reason: '法律和操作可达性决定坏状态能否真正动用。', unknownRule: '只看到证券名称时不能假设全球同等可达。' },
  { field: 'evidence state', question: '该字段是SYN、OBS、INF、PIT、OOS、unknown还是STOP？', reason: '证据身份决定可以声称什么，避免把教材算式升级为现实结论。', unknownRule: '没有收据与版本时不得自行提升证据等级。' },
] satisfies readonly SafeAssetPassportRule[];

export const safeAssetResearchQuestions: readonly SafeAssetResearchQuestion[] = [
  {
    question: '在关键风险匹配后，目标资产的安全、流动和抵押服务是否仍对应稳定的收益率楔子？',
    design: '先预先登记目标服务组合；再锁定币种、期限、现金流、信用、税与套保等非目标匹配规则，分别报告原始利差、调整项、未匹配污染项和剩余CY候选，并做状态分组与替代比较资产敏感性。',
    evidenceNeeded: '工具级收益率、现金流、信用与税收信息、可执行套保成本、流动性和抵押使用数据，以及可复现的PIT版本。',
    whatWouldWeakenIt: '更换合理匹配资产或加入套保、期限与税收控制后楔子消失，或楔子与服务指标方向不一致。',
    sourceIds: [8, 9],
  },
  {
    question: '相同成交量下，订单簿深度与价格冲击能否解释大额退出成本的差异？',
    design: '在同一工具、平台和时段内对交易规模分层；以来源14的历史框架测spread、depth与impact，另用事件时间恢复路径测resilience，不构造单一流动性分数。',
    evidenceNeeded: '带时间戳的订单簿、成交、交易规模和冲击后恢复数据，并清楚限定interdealer或客户市场覆盖。',
    whatWouldWeakenIt: '在规模、波动和时段匹配后，深度与impact不再解释退出成本，或结果只由一段异常样本驱动。',
    sourceIds: [14],
  },
  {
    question: '从毛余额到特定主体压力期Qeff，容量主要损失在哪一层？',
    design: '为同一主体依次记录可提供、资格、未占用、操作可达和市场承接，不允许用一个统一折扣包办全部损耗。',
    evidenceNeeded: '持有人与工具级存量、质押、设施资格、托管位置、haircut和压力交易深度；重复使用必须单列。',
    whatWouldWeakenIt: '漏斗字段无法获得或只靠作者比例填补时，只能保留SYN，不能形成现实容量结论。',
    sourceIds: [7, 8, 12, 13, 14],
  },
  {
    question: '压力期现金能力下降主要来自价格、haircut、资格还是自由数量收缩？',
    design: '使用互斥分解锁定每个通道的初值、变化时点与交互项，并与追加保证金和被迫出售事件对齐。',
    evidenceNeeded: '设施或交易对手级估值、haircut、资格、encumbrance、margin call与成交数据。',
    whatWouldWeakenIt: '关键字段仅有期末聚合值、通道定义重叠或无法区分主动去杠杆与规则变化。',
    sourceIds: [12, 13],
  },
  {
    question: '观察到的短缺更接近总量不足、分配锁定还是压力期市场承接失败？',
    design: '为三种假说分别预注册可观测预测：总量价格楔子、持有人/法域分割溢价、压力期impact与haircut跳变，并比较哪组证据同时成立。',
    evidenceNeeded: '同口径服务需求、有效供给、持有人分布、设施资格、跨法域价格和压力期微观结构。',
    whatWouldWeakenIt: '只有低收益率或COFER份额、没有主体和有效供给数据时，任何短缺分类都不能被识别。',
    sourceIds: [7, 8, 12, 14],
  },
  {
    question: '新增发行在什么条件下改善市场深度，又在什么条件下提高风险补偿或haircut？',
    design: '区分可交易float、期限结构、发行标准化、财政与展期状态、做市承接，允许响应非线性并报告不同制度区间。',
    evidenceNeeded: '发行与持有工具级数据、订单簿与回购指标、财政和展期状态、方法稳定的长期PIT样本。',
    whatWouldWeakenIt: '结果对状态划分不稳健、只反映货币政策共同冲击，或无法排除需求同时变化。',
    sourceIds: [7, 8, 12],
  },
  {
    question: 'Triffin-type解释相对经常账户机械叙事是否提供额外、可证伪的预测？',
    design: '并列原始制度、现代有限承诺与反方模型，比较它们对毛负债供给、便利楔子、财政可信度和替代供给的不同预测，不用单一赤字符号代表机制。',
    evidenceNeeded: '制度规则、毛国际资产负债、工具级供给、便利价格、财政与市场承接状态，以及历史时点可得版本。',
    whatWouldWeakenIt: '若不同模型对可观测变量没有可区分预测，结论应降级为解释框架，而不是因果证据。',
    sourceIds: [7, 10, 11],
  },
  {
    question: '给定同一个COFER币种总市场价值，哪些工具组合和估值路径都能产生它，还缺什么数据才能区分？',
    design: '构造多组存款/证券数量、工具价格、本金交易、收益、FX和覆盖路径，让它们生成同一汇总值；再逐项加入数据，观察识别集合如何收缩。',
    evidenceNeeded: '上游4.02币种总值、逐工具数量与价格、互斥交易/收益桥、期限、持有人与方法版本；不可观测项保留unknown。',
    whatWouldWeakenIt: '如果研究只重算币种份额或把估值残差命名为交易，就没有回答工具识别问题。',
    sourceIds: [4, 5, 6],
  },
];

export const safeAssetInterfaces: readonly SafeAssetInterface[] = [
  ['2.06 Repo / Haircut 基础', '接收回购、抵押品、haircut、margin与资产负债表的最小语法。', '本课只做一页桥接，不重建清算、银行监管或完整回购市场课程。'],
  ['4.01 Balance of Payments', '接收居民/非居民、交易/头寸、存量桥和估值通道，帮助区分跨境持有与价值变化。', 'BOP恒等不证明安全资产需求，也不能把经常账户符号改写成Triffin行为因果。'],
  ['4.02 International Monetary System', '接收货币功能分离、网络准入、COFER币种市场价值护照和SYN/OBS/INF边界。', '不重复份额面板、公式、当前数值、FX两腿、载体货币、支付栈或后备设施；不消费4.02 SYN作校准。'],
  ['4.04 US Treasury 作为全球定价曲线', '传递匹配后的便利收益、基准服务、流动性四维与供给容量。', '不提前讲完整久期、期限溢价、收益率曲线定价或全球贴现率。'],
  ['4.05 Global Dollar Funding', '传递抵押品haircut后的现金能力、有效float以及货币便利与特定国债便利可分离的边界。', '不从聚合供给推断任何机构的美元缺口、展期失败或危机概率。'],
  ['4.06 Global Banks', '传递储备/抵押资产的用途、encumbrance、法律实体与操作可达性。', '官方或聚合持有不能静默映射到银行实体资产负债表或净币种风险。'],
  ['4.07 Global Financial Cycle', '传递安全需求冲击经价格、汇率、haircut、margin和风险限额反馈的通道。', '安全资产需求不是唯一全球周期因子，因果仍需冲击识别。'],
  ['4.08 Capital Flows / 4.09 Trilemma', '传递外部流动性缓冲为何会影响资本流冲击和政策自主的动机。', '不移交统一储备充足率、最优组合或一刀切政策处方。'],
  ['4.16 Gold / 4.20 Safe-haven Flow', '传递货币黄金不在COFER同一分母、安全服务具有状态依赖以及避险流不等于永久安全标签。', '不得用跨分母排名或一段价格上涨证明安全性、官方偏好或未来回报。'],
  ['5.13–5.14 Monetary History / Bretton Woods', '传递原始Bretton Woods、现代安全资产与财政版本的Triffin标签。', '历史制度顺序不能直接变成当代崩溃预测、债务阈值或货币替代时钟。'],
  ['7.24–7.26 Research Pipeline', '传递资产护照、CY匹配门、容量漏斗、COFER工具识别桥、方法断点与unknown规则。', '无合格PIT、逐工具数据、对照与OOS时，只能声称描述性或部分识别研究。'],
];

export const safeAssetInvariants = [
  '储备货币、计价货币、储备资产、具体债权工具和抵押品资格绝不静默合并。',
  'reserve asset判断必须保留外部资产、控制、可用性与特殊项目边界；货币黄金、SDR holdings和IMF reserve position不得硬套普通发行者。',
  '官方储备需求不等于全部全球安全资产需求；私人银行、基金、企业和金融基础设施的用途与约束分别登记。',
  '安全始终写成“对谁、为哪种用途、在什么状态、以多大规模、通过哪个市场或设施可用”的服务向量。',
  '低违约概率、低收益率、窄点差、高成交量、抵押品资格和储备资产身份均不能互相作充分证明。',
  '便利收益候选只有在目标服务预先登记，且币种、期限、现金流、信用、税收和套保等非目标匹配通过时才显示；不匹配或目标—控制边界不明时STOP并列污染项，即使全部通过也不把候选升级为纯量。',
  'spread、depth、price impact与resilience保持四个独立诊断，不合成未经证实的流动性总分；来源14只测量前三项，resilience不得伪装成其观测量。',
  '可抵押不等于官方储备资产；抵押现金能力必须同时显示价格、资格、自由数量和haircut。',
  '平时haircut、margin、资格和深度不得静默外推到压力期；参数状态和交易对手必须登记。',
  '毛发行、未偿余额或官方持有都不是Qeff；availability、eligibility、encumbrance、operational reach与market capacity逐层保留。',
  '总量短缺、分配短缺和压力期流动性短缺不得互换；每种命题使用不同证据。',
  '供给与安全服务允许非单调；不得发布“债务越多越安全”或“债务越多必然越危险”的普遍规律。',
  'Triffin段落必须同时保留原始制度语境、现代模型和反方；经常账户赤字不得写成储备资产供给的行为恒等式。',
  'COFER只在其官方外汇储备币种市场价值护照内使用；不把它扩展为全部储备、全部官方资产或全球安全资产。',
  'COFER世界构成中的估算不冒充全部直接报告；方法断点、imputed share与vintage保持可见。',
  '币种市场价值变化不得直接称为匿名央行净买入、特定国债数量需求、便利收益或政治动机。',
  '4.03不重刊4.02的COFER份额面板、份额公式和当前数值；唯一入口是上游已核定护照与给定总值。',
  'SYN、OBS、INF、PIT、OOS和unknown分栏；作者SYN不得装入现实国家参数后显示政策结论。',
  '未观测的交易、收益、价格、FX、覆盖或修订通道写unknown/null，绝不以零填补或把残差强命名为交易。',
  '作者检查、构建、浏览器、PDF与双审只证明有限教材合同，不认证现实PIT、OOS、因果、预测、配置、建议或生产资格。',
] as const;

export const safeAssetEvidenceBoundaries = [
  {
    state: 'SYN',
    fullName: 'synthetic / 教学合成',
    allowed: '验证对象分类、条件方向、算术、STOP规则和“多条路径可产生同一汇总值”的识别直觉。',
    prohibited: '不得代表现实国家、货币、日期、最优政策、真实阈值或市场校准。',
    receipt: '固定输入、单位、独立状态、极端值测试、SYN水印与不可越界说明。',
  },
  {
    state: 'OBS',
    fullName: 'observed / 带护照观测',
    allowed: '在function、unit、reference period、coverage、denominator、vintage及资产附加字段内描述实际记录。',
    prohibited: '不能仅因来自官方或真实市场就升级为因果、动机、最优或全总体事实。',
    receipt: 'canonical来源、下载或访问时间、版本、覆盖、原值与转换、方法断点和未知字段。',
  },
  {
    state: 'INF',
    fullName: 'inferred / 推断',
    allowed: '在匹配、模型或识别假设明确时，从观测提出有限机制解释、部分识别区间或候选因果结果。',
    prohibited: '不得冒充来源原文、官方指标或无需假设的事实；相关关系不得自动称为结构因果。',
    receipt: '估计对象、假设、对照、替代解释、敏感性、误差与可证伪预测。',
  },
  {
    state: 'PIT',
    fullName: 'point-in-time / 历史时点当时可得',
    allowed: '重建主体在决策时真正可见的数据、方法、发布和修订状态，服务历史回放与泄漏控制。',
    prohibited: '今天回溯修订的数据、事后分类和后来论文结果不能冒充当时信息集。',
    receipt: 'as-of时间、首次发布与修订时间、数据vintage、查询或文件身份，以及当时方法说明。',
  },
  {
    state: 'OOS',
    fullName: 'out-of-sample / 样本外',
    allowed: '检验预先锁定的匹配、分类或预测规则在未参与构造的数据和时段上是否仍成立。',
    prohibited: '课内SYN极端值、同样本拟合、事后阈值或视觉故事不能称OOS。',
    receipt: '训练/设计截止、冻结规则、独立测试窗口、基线、评价指标和失败记录。',
  },
] as const;

export const safeAssetReadingGuide = [
  {
    order: 1,
    title: '先固定“什么算储备资产”：只读定义和特殊项目，不背货币排行榜。',
    scope: 'BPM7关于reserve assets的用途、外部资产、控制、可用性、货币黄金、SDR holdings、IMF reserve position、存款与证券分类。',
    readFor: '能为每项工具写出是否为claim、对谁的claim、谁控制以及何时可动用。',
    doNotInfer: 'BPM7不给储备货币名单，也不判断具体证券永久安全。',
    sourceIds: [1],
  },
  {
    order: 2,
    title: '再读官方为什么持有：把安全、流动和收益放回公共任务约束。',
    scope: 'IMF Revised Guidelines的目标、治理与国家异质性；ARA入口对风险缓冲、机会成本和无统一答案的说明。',
    readFor: '理解用途和时间窗口怎样先限定资产集合，再讨论收益。',
    doNotInfer: '不从指南生成任何国家的最优规模、币种、期限或政策缺口。',
    sourceIds: [2, 3],
  },
  {
    order: 3,
    title: '用两篇理论文献理解安全的相对性与供给能力，而不是寻找永久安全名单。',
    scope: 'Caballero–Farhi–Gourinchas的安全资产短缺与发行能力；He–Krishnamurthy–Milbradt的float、需求、市场深度和展期状态。',
    readFor: '把总量、状态和每单位服务质量同时纳入供给分析。',
    doNotInfer: '历史粗略分类和理论状态不提供当前全球规模、现实主权阈值或评级。',
    sourceIds: [7, 8],
  },
  {
    order: 4,
    title: '学习匹配便利收益：重点是识别门，不是记一个bp常数。',
    scope: 'Jiang–Krishnamurthy–Lustig对Treasury basis、外国安全需求和汇率关系的研究设计与样本边界，并回看4.03的matched comparator清单。',
    readFor: '理解币种、期限、现金流、信用与套保处理如何决定差值含义。',
    doNotInfer: '论文关系不等于官方储备经理动机，不解释全部汇率变化，也不构成预测。',
    sourceIds: [9],
  },
  {
    order: 5,
    title: '从订单簿到抵押品：分别读市场流动性和融资流动性。',
    scope: '纽约联储Staff Report 827的spread、depth、price impact与样本覆盖；resilience仅作为需要另取恢复路径数据的扩展诊断；PFMI Principle 5的资格、haircut、集中度和顺周期；BIS AER 2023 Box D的margin与火售反馈。',
    readFor: '能画出价格—haircut—现金能力—被迫出售的反馈，保持四个诊断独立，并准确说出来源14只观测前三项。',
    doNotInfer: '特定历史市场、规范原则和机制综述都不认证当前全市场状态或所有政府债安全。',
    sourceIds: [12, 13, 14],
  },
  {
    order: 6,
    title: '对读Triffin的现代理论与反方，阻止单向戏剧化。',
    scope: 'Farhi–Maggiori的有限承诺与国际储备供给；Bordo–McCauley对机械经常账户版本和财政版本假设的批评。',
    readFor: '区分原始制度、现代安全资产供给与财政可信度三种命题，并寻找可区分预测。',
    doNotInfer: '不发布危机日期、美元路径、债务阈值或经常账户必须为负的结论。',
    sourceIds: [10, 11],
  },
  {
    order: 7,
    title: '最后读COFER三件套：只问它看见什么、遗漏什么、方法怎样改变。',
    scope: 'COFER dataset metadata、2025方法说明与当期Data Brief；对照4.02已有币种护照，不重刊份额卡。',
    readFor: '能把币种市场价值变化拆成交易、收益、FX、价格与覆盖候选通道，并把不可观测项留作unknown。',
    doNotInfer: '不能识别匿名国、逐工具数量、Treasury净买入、便利收益、政治动机或未来趋势。',
    sourceIds: [4, 5, 6],
  },
  {
    order: 8,
    title: '前沿观察位：货币便利与国债便利是否可能分离。',
    scope: 'NBER Working Paper 35000仅作为未来补充；PDF版本、72页与SHA-256已归档，但尚未完成段落级内容核读和正式引用，因此不进入核心正文或数字状态。',
    readFor: '形成“货币融资/支付服务与特定证券服务可相关但不必相同”的待检验问题。',
    doNotInfer: '不使用工作论文样本均值、转负时点或回归系数，不把Digest写成已核读全文。',
    sourceIds: [],
  },
] as const;
