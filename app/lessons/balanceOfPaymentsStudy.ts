import type { BalanceOfPaymentsSourceId } from './balanceOfPaymentsConcepts';

export type BalanceOfPaymentsCheck = {
  question: string;
  answer: string;
  sourceIds: readonly BalanceOfPaymentsSourceId[];
};
export type BalanceOfPaymentsGlossaryEntry = readonly [term: string, definition: string, confusion: string];
export type BalanceOfPaymentsInterface = readonly [name: string, payload: string, guardrail: string];

export const balanceOfPaymentsThesis = [
  '国际收支不是一条把钱按国境分成“流入”和“流出”的流水线，而是一个以经济领土、居民—非居民关系、经济所有权和期间为基础的复式记录系统。货物、服务、收入或转移首先改变资源关系，同时出现相应金融对项；现金可以稍后支付，也可以根本不以实体货币跨境。先把主体、对象、时钟与符号写清，才有资格解释账户余额。',
  '本课把两个数学骨架分开。同期聚合上，BPM7资产—负债表达给出FAB等于NAFA减NIL，概念上CAB加KAB等于FAB；实测未闭合时显式保留statistical discrepancy。跨期状态上，期末IIP由期初头寸、交易、汇率变化、其他价格变化和其他数量变化共同形成。前者约束交易记录，后者解释存量演化；两者都不自动提供因果箭头。',
  '因此，赤字不等于资本外逃，顺差不等于货币必然升值，金融账户不等于热钱，统计差异也不是隐藏流动的自动估计。七组C只验证彼此独立的SYN账本和停止条件；十组M/K检查对象、符号与分栏。BPM7作为最新概念标准与现实BPM6数据双标签并列，真实国家数据、PIT、结构因果、预测、政策与生产资格在取得独立证据前保持unknown或false。',
] as const;

export const balanceOfPaymentsEntryVocabulary = [
  ['BOP / balance of payments', '国际收支；记录一个期间内居民与非居民之间经济交易的统计体系，不是银行现金流水表。'],
  ['IIP / international investment position', '国际投资头寸；记录参考日居民对非居民金融资产和负债的存量，不是期间交易额。'],
  ['Residence / economic territory', '居民身份按经济领土与主要经济联系确定；不等于国籍、总部、开户地或合同币种。'],
  ['economic ownership', '承担资产主要经济利益与风险的归属，用于确定交易主体和所有权转移时点。'],
  ['transaction', '机构单位通过相互协议发生的经济价值交换、转移或其他权利义务变化；价格重估不是交易。'],
  ['accrual basis', '权责发生制；在经济价值产生、转移或消灭时记录，不以现金到账日替代全部交易时钟。'],
  ['BOP flow / IIP stock', 'BOP主要量期间交易流，IIP量参考日外部金融存量；两者通过integrated IIP相接。'],
  ['double entry', '同一经济体内一项交易至少有等额对应记录；复式闭合不表示两个项目是两份收入。'],
  ['CAB / current account balance', '经常账户余额；货物、服务、earned/primary income与transfer/secondary income的期间余额。'],
  ['KAB / capital account balance', '资本账户余额；资本转移及非生产非金融资产交易的窄账户余额，不是所有资本流。'],
  ['FAB = NAFA − NIL', '金融账户余额等于居民净取得外部金融资产减对非居民净发生金融负债。'],
  ['NAFA / NIL', '分别指金融资产净取得与金融负债净发生；负数可表示净处置或净偿还，不是负存量。'],
  ['credit/revenue / debit/expenditure', 'BPM7经常与资本账户的新标签；现实BPM6数据可能仍显示credit/debit，必须保留来源原词。'],
  ['statistical discrepancy', 'BPM7对BPM6 net errors and omissions的更新名称，定义为FAB减去CAB与KAB之和。'],
  ['BPM6 / BPM7', '现实数据仍大量使用BPM6，BPM7是最新概念标准；术语、符号和实施状态必须随来源保存。'],
  ['SYN / synthetic', '专为隔离机制构造、彼此独立的合成输入；不代表现实国家、历史时期或估计参数。'],
  ['STOP / unknown / null', 'STOP表示输入违反计算合同；unknown或null表示证据不足。二者都不等于已知经济零。'],
] as const;

export const balanceOfPaymentsEvidenceGroups = [
  { title: '边界、交易与时钟', text: '居民—非居民、经济所有权、权责发生、flow/stock、交易与其他变化的概念地基。', ids: [1, 6] },
  { title: '账户、符号与BPM6／BPM7双标签', text: 'CAB、KAB、FAB、NAFA−NIL、复式记录及新旧术语迁移，避免把两套符号未经桥接混用。', ids: [1, 2, 7] },
  { title: '统计差异、镜像资料与修订', text: '统计差异只能诊断覆盖与时钟，CPIS/IIP及跨经济体镜像不对称不能被当成唯一真值或违规证据。', ids: [3, 4, 9] },
  { title: '现实发布与版本状态', text: 'BPM7已发布但现实数据仍大量按BPM6；现行页面、发布政策和年度报告共同限定实施与PIT边界。', ids: [5, 6, 8, 9] },
  { title: '储备与integrated IIP', text: '储备控制/可用性、NIR、交易—汇率—价格—其他数量变化及完整IIP桥接。', ids: [1, 2] },
] as const;

export const balanceOfPaymentsChecks: readonly BalanceOfPaymentsCheck[] = [
  {
    question: '为什么国际收支不能直接理解为现金跨过国境？',
    answer: 'BOP按权责发生制记录居民与非居民之间的经济交易，赊购、应计收入、再投资收益和经双方合同同意的债务减免都可能在现金尚未支付或没有现金时记录。现金渠道回答流动性与结算，不能替代交易对象和经济时钟。',
    sourceIds: [1, 6],
  },
  {
    question: '两个本国公民使用外币交易，是否必然进入本国BOP？',
    answer: '不必然。边界由交易双方的统计居民身份决定，不由国籍或币种决定。若双方都是该经济体居民，外币计价本身不会把交易变成居民—非居民交易；仍要另核经济领土、机构单位和经济所有权。',
    sourceIds: [1],
  },
  {
    question: '货物已经过关但尚未转移经济所有权，海关进口能否直接等于BOP进口？',
    answer: '不能自动等同。BOP货物以居民—非居民经济所有权转移为核心，海关以物理移动和行政申报为重要来源。加工、转口、全球生产、估值与时点差异都可能要求调整；应保存两套口径而非强迫逐笔相等。',
    sourceIds: [1, 4, 6],
  },
  {
    question: '为什么出口120、取得境外存款80和贸易信贷40不是总收入240？',
    answer: '出口120是资源侧记录，80与40是居民获得的两项金融索赔权，二者相加恰好构成同一交易的金融对项。它们不是三笔独立财富；以后收回贸易信贷也只是金融资产形态变化，不应重复记录出口。',
    sourceIds: [1],
  },
  {
    question: '经常账户余额能否只用货物出口减进口表示？',
    answer: '不能。完整CAB还包含服务、earned income（BPM6 primary income）与transfer income（BPM6 secondary income）。货物顺差可能被服务或收入逆差抵消，反之亦然；每组还需一致的居民、期间、估值与版本。',
    sourceIds: [1, 5, 6],
  },
  {
    question: '为什么常说的跨境证券和银行“资本流”大多不在资本账户？',
    answer: 'BOP资本账户是窄账户，主要记录资本转移及非生产非金融资产交易。证券投资、银行贷款和存款属于金融账户的功能类别。日常语言可以说资本流，但接入统计表时必须先翻译到实际账户和工具。',
    sourceIds: [1, 2],
  },
  {
    question: 'NAFA=95、NIL=110时，为什么FAB是−15而口语净流入可以说+15？',
    answer: 'BPM7资产—负债表达定义FAB=NAFA−NIL，所以95−110=−15。若另定义净向内融资N=NIL−NAFA，则N=+15。两者方向相反但描述同一差额，必须保留变量名，不能把口语正号直接贴到FAB。',
    sourceIds: [1, 7],
  },
  {
    question: 'FAB等于0是否意味着跨境金融活动为0？',
    answer: '不意味着。资产取得与处置、负债发生与偿还可以都很大却在各侧净额及资产减负债中抵消。净额回答净借贷方向，不能恢复毛周转、到期续借或市场容量；这些需要更细工具、期限和交易资料。',
    sourceIds: [1],
  },
  {
    question: '概念上的CAB+KAB=FAB为什么不是“赤字导致资本流入”的证明？',
    answer: '等式是同一交易系统两种聚合观察的复式约束，没有时间箭头。融资可能先支持进口，进口需求也可能诱发融资，两者还可受共同冲击影响。主动方、时序与反事实要由合同、事件和识别设计另证。',
    sourceIds: [1, 6],
  },
  {
    question: '经常账户赤字能否直接命名为资本外逃？',
    answer: '不能。赤字可由新增外部负债、处置外部资产、减少储备或多种组合对应；处置外部资产甚至可能是资金回收。资本外逃是另需定义和测量的行为标签，不能由CAB符号或统计差异自动生成。',
    sourceIds: [1, 4, 9],
  },
  {
    question: '为什么顺差不能推出本币必然升值？',
    answer: '账户余额不包含唯一价格形成方程。预期、利率、风险条件、资产配置、套保、政策和市场承接都可同时影响订单与汇率；汇率又会反馈贸易和IIP重估。顺差与升值共存最多是观察，不是由恒等式识别的方向。',
    sourceIds: [1, 6],
  },
  {
    question: '金融账户为什么不能与“热钱”画等号？',
    answer: 'FA含直接投资、证券投资、衍生品、其他投资和储备资产等功能类别，合同、主体和期限差异很大。“热钱”是非官方行为标签，必须有短期性、可逆性或投机动机的独立定义与证据，不能覆盖整个账户。',
    sourceIds: [1, 2],
  },
  {
    question: 'CAB=40、KAB=5、FAB=55时，统计差异是多少，最强能解释到哪里？',
    answer: '按SD=FAB−(CAB+KAB)，结果为10。它只说明两种净借贷估计未闭合，提示检查覆盖、时点、估值、分类和修订；不能从正10唯一定位被遗漏账户，更不能直接称为非法流动。',
    sourceIds: [1, 2, 4],
  },
  {
    question: '为什么不能为了符合理论恒等式而把统计差异按比例摊回各账户？',
    answer: '各账户是由真实来源估计的观测，差异本身保存了测量不一致的信息。任意摊分会伪造项目并掩盖诊断线索。正确做法是保留原始值、差异、来源和版本，再以镜像、修订或项目调查寻找原因。',
    sourceIds: [1, 4, 9],
  },
  {
    question: '储备资产从500升到560，为什么不代表央行买入60？',
    answer: '若题设交易为+50、汇率重估+20、其他数量变化−10，则头寸总增60中只有50是BOP交易，净非交易变化为10。期末减期初不能替代integrated IIP桥，也不能从头寸变化直接识别干预。',
    sourceIds: [1, 2, 6],
  },
  {
    question: '官方持有的外币证券为什么仍可能不符合储备资产？',
    answer: '储备分类要求货币当局控制并可随时用于国际收支融资或外汇干预。若证券因回购、互换、质押或其他安排不能即时动用，可能需要排除或重分类。公共部门和外币标签本身都不是充分条件。',
    sourceIds: [1, 2],
  },
  {
    question: '期初NIIP=200、金融账户交易贡献50、期末NIIP=235，差异来自哪里？',
    answer: 'NIIP实际变化是35，除了交易贡献50，还要加入净汇率、其他价格和其他数量变化。C5中三类非交易项合计−15，故50−15=35。不能把35全叫资本流，也不能把50当完整头寸变化。',
    sourceIds: [1, 2, 3],
  },
  {
    question: '两个经济体NIIP同为100，为什么不能判断它们外部风险相同？',
    answer: '净额隐藏资产与负债毛规模、部门、币种、期限、工具和可用性。一个经济体可以有1900的毛头寸和较低机械储备覆盖，另一个只有500；相同NIIP不恢复这些结构，更不等于相同偿付能力或危机概率。',
    sourceIds: [1, 3, 6],
  },
  {
    question: 'BPM7已发布后，为什么网页仍必须保留BPM6标签？',
    answer: 'BPM7是最新概念标准，但当前IMF与ECB数据仍大量按BPM6编制，实施有过渡窗口。教材应解释earned/primary、transfer/secondary、statistical discrepancy/net errors and omissions等双标签，并让现实图表保留来源原词。',
    sourceIds: [2, 5, 6, 8, 9],
  },
  {
    question: '作者侧课程生产合同检查：本文件何时可以升级为双审完成？',
    answer: '只有完整同版正文冻结后，由两名未参与写作的非作者分别完成准确性与教学审稿，并在实质修改后共同重审，才可登记双审。当前BODY-r5已由两名非作者分别从头批准，P1/P2/P3均为0；有限算术、类型检查、本地PDF台账和来源阅读仍不占两席，也不认证现实PIT、因果、预测或生产资格。',
    sourceIds: [],
  },
];

export const balanceOfPaymentsGlossary: readonly BalanceOfPaymentsGlossaryEntry[] = [
  ['BOP / balance of payments', '一个期间内居民与非居民之间经济交易的统计体系', '实体现金跨境流水或外汇成交量'],
  ['IIP / international investment position', '参考日居民对非居民金融资产与负债的存量表', '期间金融账户交易额'],
  ['Integrated IIP', '用交易、汇率、其他价格和其他数量变化连接期初与期末IIP的完整框架', '只列期末存量的普通表格'],
  ['Economic territory', '用于确定统计居民范围的经济领土概念', '国籍、关境或货币使用区必然相同'],
  ['Institutional unit', '能够拥有资产、承担负债并从事交易的统计主体', '一个品牌、账户或集团名称'],
  ['Resident', '与所选经济领土具有主要经济联系的统计单位', '本国国籍、总部或本币使用者'],
  ['Nonresident', '不属于所选经济体居民范围的交易对手或资产持有人', '外国护照持有人或外币合同'],
  ['Economic ownership', '承担资产主要经济利益与风险的归属', '法律登记、代管或付款人身份'],
  ['Transaction', '机构单位通过相互协议发生的经济价值交换或转移', '市场价格变化、汇率重估或重分类'],
  ['Accrual basis', '在经济权利义务产生或转移时记录的权责发生口径', '现金到账或银行入账日'],
  ['Reference period', '流量统计明确覆盖的期间', '发布时间、取得日或期末估值日'],
  ['Flow', '一个期间内交易或其他变化的数量', '参考日仍持有的余额'],
  ['Stock', '某一参考日资产或负债的状态数量', '当期取得、处置或偿还'],
  ['Other changes in financial assets and liabilities', '交易之外改变金融头寸的重估与其他数量变化账户', '金融账户或统计差异'],
  ['Double entry', '同一经济体内每项交易的等额对应记录原则', '两个项目是两份收入或现金'],
  ['Four-entry bookkeeping', '交易双方各自复式记录形成的跨经济体对称结构', '现实镜像数据一定逐项相等'],
  ['Credit/revenue', 'BPM7经常和资本账户对资源提供或收入一侧使用的更新标签', 'BPM7金融资产增加的统一正号'],
  ['Debit/expenditure', 'BPM7经常和资本账户对资源取得或支出一侧使用的更新标签', '现金流出或负数的同义词'],
  ['Current account', '货物、服务、earned income和transfer income组成的期间账户', '货物贸易余额'],
  ['CAB', 'current account balance，经常账户revenue减expenditure后的余额', '银行现金余额或福利分数'],
  ['Goods account', '按居民—非居民及经济所有权规则记录货物交易的账户', '海关过境货值自动逐项相等'],
  ['Services account', '按服务提供关系记录跨境服务的账户', '只有可见物理越境的活动'],
  ['Earned income / primary income', 'BPM7 earned income及其BPM6 primary income旧标签', '出口收入或单方面转移'],
  ['Transfer income / secondary income', 'BPM7 transfer income及其BPM6 secondary income旧标签', '资本账户中的全部资本转移'],
  ['Capital account', '资本转移及非生产非金融资产交易组成的窄账户', '证券、贷款和存款等所有资本流'],
  ['KAB', 'capital account balance，资本账户revenue减expenditure后的余额', '媒体所称净资本流入'],
  ['Financial account', '记录居民外部金融资产和负债交易的账户', '热钱、现金流或期末IIP'],
  ['NAFA', 'net acquisition of financial assets，外部金融资产取得减处置', '外部资产期末存量或所有未净买卖'],
  ['NIL', 'net incurrence of liabilities，外部金融负债发生减偿还', '负债期末存量或外币债务'],
  ['FAB', '按BPM7主表达定义为NAFA减NIL的金融账户余额', '未经符号桥接的净资本流入'],
  ['Net lending / net borrowing', '资源净提供与相应金融净债权变化的聚合位置', '道德评价、偿付能力或政策效果'],
  ['Statistical discrepancy', 'BPM7对由不同数据源、频率和修订形成的账户不闭合差额所用标签', '可以从差额本身识别哪一项被漏记或误记'],
  ['Net errors and omissions', 'BPM6及许多现行数据对statistical discrepancy使用的旧标签', '可以从名称直接定位遗漏项目'],
  ['Direct investment', '以持续影响关系为特征的金融账户功能类别', '新建厂房、长期资金或稳定资金的同义词'],
  ['Portfolio investment', '不属于直接投资或储备等类别的可交易股权及债务证券投资', '发行人必然收到现金的一级融资'],
  ['Financial derivatives and ESOs', '衍生合约与雇员股票期权的功能类别', '标的资产现货交易或无风险套保'],
  ['Other investment', '包含贷款、存款、贸易信贷等项目的金融账户功能类别', '剩余项、热钱或短期资金'],
  ['Reserve assets', '由货币当局控制并可用于BOP融资或外汇干预的合格外部资产', '公共外币资产或全部央行资产'],
  ['NIR', 'BPM7统计定义下储备资产减预定短期净外币流出', '总储备、单一覆盖率或项目口径必然相同'],
  ['Trade credit', '货物或服务先交付后付款形成的金融索赔或义务', '第二笔货物交易或银行贷款必然相同'],
  ['Currency and deposits', '金融资产工具类别中的货币与存款索赔', '实体钞票跨境或所有流动性'],
  ['External asset', '居民对非居民持有的金融资产或合格黄金资产', '居民持有的所有外币资产'],
  ['External liability', '居民单位对非居民承担的金融负债', '所有外币债务或国内负债'],
  ['NIIP', '外部金融资产减外部金融负债的净国际投资头寸', '偿付能力、国家净财富或当期CAB'],
  ['Exchange-rate change', '因计价货币相对报告货币变化产生的头寸重估', '外汇买卖或金融账户交易'],
  ['Other price change', '除汇率外市场价格变化造成的持有损益', '资产购买、处置或统计差异'],
  ['Other volume change', '债权人单方面确认无法收回后的核销、重分类或居民身份变化等非交易数量变化', '双方合同同意的债务减免；后者是资本转移交易并有金融账户对项'],
  ['Gross transactions', '取得、处置、发生与偿还等未被净额完全压缩的活动', '资产与负债净腿绝对值简单相加必为官方gross'],
  ['Mirror data', '由交易对手经济体或持有人一侧提供的对应统计资料', '无覆盖和时点误差的真值'],
  ['CPIS', 'IMF协调证券投资调查，用资产持有人资料帮助观察跨境证券头寸', '完整BOP、所有金融工具或直接交易流'],
  ['Currency of denomination', '合同规定本金、收入或支付使用的货币', '交易双方居民身份或结算地点'],
  ['Original / remaining maturity', '合同起始期限与参考日剩余到期时间两种不同期限口径', '短期风险可只由原始期限判断'],
  ['Capital flight', '需另定主体、渠道、动机和测量规则的非官方行为概念', '经常账户赤字、负FAB或统计差异'],
  ['Hot money', '通常指高度可逆或短期投机性资金的非官方标签', '金融账户、证券投资或其他投资整体'],
  ['PIT', '每一历史决策时点只使用当时已发布且可取得的数据版本', '今天下载最终历史表并按日期截断'],
  ['SYN', '为隔离会计机制构造的独立合成账本', '现实国家校准、压力测试或估计参数'],
  ['STOP', '输入缺失、非法或跨字段合同失败时拒绝计算并清除旧结果', '经济值为零、账户赤字或政策失败'],
  ['unknown / null', '对象未观测、未识别或当前不具资格', '已知为零或可以靠恒等式补齐'],
];

export const balanceOfPaymentsInvariants = [
  '居民—非居民边界由经济领土与统计居住身份确定；国籍、总部、上市地、账户所在地和计价币种不得替代居民身份。',
  'BOP期间交易流与IIP参考日存量永久分栏；任何期末减期初都必须经过交易、汇率、其他价格和其他数量变化桥接。',
  '交易与非交易变化分别保存：双方合同同意的债务减免是资本转移交易并有金融账户对项；债权人单方面确认无法收回后的核销、重估和重分类才不得倒灌为金融账户交易。',
  '复式记录、CAB+KAB=FAB及S−I均是同一账本的约束或重排，不得赋予发起者、时序、汇率方向或政策因果。',
  'BPM7新词与BPM6现实字段实行双标签；网页解释可用新词，任何真实数据展示必须保留来源原标签和版本。',
  '金融账户固定采用FAB=NAFA−NIL；若使用NIL−NAFA的口语净流入量，必须另命名并显式说明方向相反。',
  '资产取得与处置、负债发生与偿还分别保存；净额不能恢复毛周转、到期融资、市场容量或对手方网络。',
  '经常账户赤字不得命名为资本外逃，顺差不得推出货币升值，金融账户不得改名热钱；三种命题均需独立行为和价格证据。',
  '统计差异按SD=FAB−(CAB+KAB)显式保存；不得设为零、摊回账户或未经证据解释为走私、造假、遗漏流动或资本外逃。',
  '储备资产必须保留控制、可用性、外部性与币种资格；公共外币资产、总储备、NIR、干预能力和储备充足性不得互换。',
  '七组C各有独立经济体、期间、输入和未知出口，彼此不传值、不递归，不得拼成共同国家历史或真实压力情景。',
  '所有原始控件只接受完整安全整数与声明键；合法0、STOP、unknown和null永久分栏，旧结果不得在非法输入后继续显示。',
  '毛头寸、NIIP、币种、部门、工具和期限分别保存；国家净头寸不能替单家机构同日付款，也不能单独给出偿付或危机概率。',
  '3.20与3.21只以真实lesson版本和语义身份进入先修状态；inputLineage保持空，不消费两课SYN数值校准4.01。',
  '每个来源必须保留实际阅读范围、支持与不支持边界；三个本地真PDF归档不扩大到未读章节、网页资料或各国实际实施。',
  '作者稿、有限算术、类型检查、来源台账和网页构建都不占两名非作者完整同版审批；现实数据、PIT/OOS、因果、政策与生产资格须分别验证。',
] as const;

export const balanceOfPaymentsInterfaces: readonly BalanceOfPaymentsInterface[] = [
  ['3.20 Exchange Rate', '接收报价方向、合同币种、交易与重估、套保和储备可用性语义，把汇率变化分别接入现金流与IIP。', 'CAB、FAB或储备方向不能独立决定现汇；外币不等于跨境，重估也不是金融账户交易。'],
  ['3.21 Capital Flow 国内入口', '接收居民对手方、资产／负债腿、银行借款、证券收款者、到期现金和基金承接菜单。', '国家净额不是具体银行资金或企业现金；3.21七组SYN不成为4.01数值输入。'],
  ['Chapter 1 Market Microstructure', '把金融交易接到真实订单、买卖价、深度、数量容量、成交与结算，解释价格如何产生。', 'BOP交易额不是订单流，统计余额不提供需求曲线、价格冲击函数或执行成本。'],
  ['Chapter 2 / 3.09–3.16 Balance Sheets', '将外部资产负债落到银行、企业、家庭和基金的资本、流动性、抵押品、现金与风险选择。', 'NIIP和FAB不能替代单体资产负债表；净外部资产为正不保证每个主体可按期付款。'],
  ['4.02–4.05 Monetary System / Dollar Funding', '传递储备资产、核心货币负债、计价币种、NIR和跨境融资工具，继续研究货币层级。', '统计分类不证明储备货币地位、safe-asset demand、美元短缺或全球传染的结构因果。'],
  ['4.06–4.08 Global Banks / Emerging Markets', '把直接、证券、其他投资及资产负债腿拆到全球银行、企业和本地市场，追踪到期与替代融资。', 'FA不能统称热钱；相同净流入不表示相同期限、币种、国内信用或资产价格传导。'],
  ['4.09 / 5.06 Policy Autonomy / Capital Controls', '传递跨境交易、储备、兑换权限和制度范围，研究汇率制度与资本流动管理怎样改写调整菜单。', '会计恒等式不证明三元悖论约束已经绑定，也不给资本管制效果、福利或最优政策结论。'],
  ['3.23 / Chapter 7 Evidence Pipeline', '传递首次发布、修订、PIT版本、统计差异、镜像诊断、estimand、识别、OOS和失败状态。', '当前下载值、来源阅读、SYN闭合与教材双审均不等于历史PIT、结构因果、预测增量或生产资格。'],
];

export const balanceOfPaymentsSourceArchiveLedger = [
  'IMF BPM7白皮书预编辑版：tmp/research/4-01-draft/imf-bpm7-white-cover-2025.pdf，1076物理页，7367226 B，SHA⁠-⁠256 a770e733fed4b20ad8b487ba2281e06d49cf8ff7402a691ab0ae2db3231127e7。实际核读印刷页12–30（§§2.2–2.39）、82–85（§§3.84–3.96）、96–97（§§3.145–3.149）、122–127（§§4.1–4.15）、239–243与262–264（§§6.1–6.10、6.57–6.65）、265–280（§§6.69–6.123及Boxes 6.5–6.6）、281–287（§§7.1–7.8）、307–310（§§8.1–8.13）、323–328（§§9.1–9.10）并补核§§9.21–9.23、§§14.28–14.29、609–615（§§19.4–19.18）、652–653（§§20.27–20.30）、Annex 11印刷839–853及Annex 13印刷874–895；未通读1076页其余章节、全部表注或编制指南。',
  'IMF BPM7 Annex 13 standalone：tmp/research/4-01-draft/imf-bpm7-annex13-changes-from-bpm6.pdf，23物理页，326444 B，SHA⁠-⁠256 07c0bf65bf5dd04e2863733669384856c8f28b48cf78eaed966ef2ebaf221b9e。实际核读物理页1–23全部文字与Tables A13.1–A13.2；支持总体框架延续、integrated IIP、NIR及BPM6→BPM7术语变化，不代表各国已经采用新标准。',
  'IMF Release of New Standards for Macroeconomic Statistics (BPM7)：tmp/research/4-01-draft/imf-policy-paper-bpm7-release-2025.pdf，7物理页，236719 B，SHA⁠-⁠256 a9a927fe09c8925d69e61247f561f29bcf4fea1de15871a79d9c902de79c9ddb。实际核读物理页1–7全部文字、Executive Summary及§§1–11；支持2025年3月20日发布、白皮书预编辑状态、主要变化与2029–2030目标实施窗口，不是最终编辑版、各国采用证明或因果研究。',
] as const;

export const balanceOfPaymentsFailedDownloadLedger: readonly string[] = [];
