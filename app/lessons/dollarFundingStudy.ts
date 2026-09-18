import type { DollarFundingSourceId } from './dollarFundingReferences';

export const dollarFundingThesis = {
  statement: '全球美元融资不是“世界上有多少美元”，而是具体法律实体能否在明确窗口内，把可用现金、到期流入和真正可执行的私人、内部或官方路线，变成按时交付的美元cash legs。',
  inequalities: [
    '集团或国别美元净头寸 ≠ 具体实体、具体日期的可用美元',
    'Collateral borrowing capacity ≠ 已承诺或已结算的cash receipt',
    'Cross-currency basis、DXY、GLI或facility existence ≠ 单一美元短缺指标',
    'Hedged currency value ≠ funded cash-flow schedule',
    'Official first layer ≠ automatic private-sector onward allocation',
  ],
} as const;

export const dollarFundingCoreRoute = [
  { time: '00–08分钟', title: '先问周五谁必须交美元', conceptIds: ['dollar-funding-mechanism-01'], task: '填写legal entity、币种、as-of、H、value date与netting set。', exit: '能解释集团有钱为何不等于子实体今天可付。' },
  { time: '08–20分钟', title: '把存量改写成期限梯', conceptIds: ['dollar-funding-mechanism-02', 'dollar-funding-mechanism-05'], task: '区分cash、contractual flows、contingent flows、residual maturity与rollover。', exit: '会算G_pre，并拒绝把capacity或预期续作扣进去。' },
  { time: '20–31分钟', title: '加入非银与企业', conceptIds: ['dollar-funding-mechanism-03'], task: '把资产价值、最终偿付、赎回、margin与自然/金融hedge分栏。', exit: '知道hedged不等于funded。' },
  { time: '31–41分钟', title: '逐条打开工具路线门', conceptIds: ['dollar-funding-mechanism-04'], task: '比较CP/CD、repo、FX swap、bond与sale的eligibility、capacity和settlement。', exit: '看到quote或市场存在时不再自动写receipt。' },
  { time: '41–53分钟', title: '画FX swap两期现金腿', conceptIds: ['dollar-funding-mechanism-06'], task: '同时登记spot与forward leg，按value date放入期限桶。', exit: '不把gross notional叫净债务或明日缺口。' },
  { time: '53–65分钟', title: 'basis先过报价护照', conceptIds: ['dollar-funding-mechanism-07', 'dollar-funding-mechanism-08'], task: '补齐pair、direction、tenor、rate basis、side与bid/ask，再连接hedging demand和dealer capacity。', exit: '能给出null而不是用basis符号猜shortage。' },
  { time: '65–75分钟', title: '抵押、haircut与美元升值反馈', conceptIds: ['dollar-funding-mechanism-09', 'dollar-funding-mechanism-10'], task: '把market value、capacity、receipt、margin与主体方向分开。', exit: '能解释同一美元升值为何对三个主体不同。' },
  { time: '75–83分钟', title: '多层资金链与集团迁移', conceptIds: ['dollar-funding-mechanism-11', 'dollar-funding-mechanism-12'], task: '画MMF—dealer/bank—borrower与intragroup gates。', exit: '不会把payment route或transfer意向当funding cash。' },
  { time: '83–90分钟', title: '两种官方后备逐层画', conceptIds: ['dollar-funding-mechanism-13', 'dollar-funding-mechanism-14'], task: '分开sovereign swap、FIMA account-holder repo与local onward。', exit: '不会画成Fed直接借给世界私人机构。' },
  { time: '90–95分钟', title: '抽样M/K与最低证据包', conceptIds: [], task: '只选二至三道M/K口头解释，再写出一个可证伪的多指标研究问题；完整十二题留到第二遍。', exit: '能把一个“美元荒”叙事改写成entity/horizon/route/evidence问题，不要求五分钟做完全套。' },
] as const;

export const dollarFundingPassportRules = [
  ['01 · Legal entity', '合同和付款义务属于哪个独立法律主体；集团简称不能替代。'],
  ['02 · Booking location', '头寸登记地点与支付/监管环境；不自动等于集团nationality。'],
  ['03 · Nationality / consolidation', '集团归属和合并边界；与residence口径不得直接相加。'],
  ['04 · Settlement currency', '真正要交付的币种；计价币种、报告币种和抵押品币种另列。'],
  ['05 · As-of clock', '用完整UTC ISO timestamp固定日期、时刻与当时可得资料；D0/D1只是由此派生的显示标签，后见信息不能进入PIT账本。'],
  ['06 · Horizon H', '明确horizonEnd并统一使用开左闭右的前瞻区间(as-of, horizonEnd]；O/N、7d、30d、90d不得混同。'],
  ['07 · Contractual inflows', '窗口内确定value date的本金、利息和结算流入。'],
  ['08 · Contractual outflows', '窗口内全部本金、利息、旧融资到期和结算流出。'],
  ['09 · Contingent outflows', 'margin、credit-line draw、redemption等有明确规则的压力流。'],
  ['10 · Usable cash', '在该实体该账户可立即使用的美元；受限现金另列。'],
  ['11 · Netting set', '法律可执行、币种/日期/对手相容的净额集合；不凭经济直觉净额。'],
  ['12 · Funding instrument', 'deposit、CP、CD、repo、FX swap、bond或其他；资产负债表位置和未来腿明确。'],
  ['13 · Residual maturity', '从as-of到下一现金腿的剩余期限，不用原始期限替代。'],
  ['14 · Per-leg route status', '每条cash leg分别标realised、committed_executable、quoted_only、unavailable或null，不得用一个交易级标签覆盖initial、reverse、margin或repayment的不同时态。'],
  ['15 · Transaction / leg IDs', 'transaction唯一映射合同passport；(transaction, cash-leg)唯一映射不可变现金腿。'],
  ['16 · Collateral passport', 'owner、lot/pool、marked value、unencumbered、eligibility、haircut、allocation和limit。'],
  ['17 · Value timestamp / settlement', '每条cash leg何时真正到账，使用带Z的UTC ISO minute；trade date、announcement与capacity不是value timestamp。'],
  ['18 · FX quote passport', 'pair、direction、spot/forward、tenor、day-count、side、bid/ask与加点腿。'],
  ['19 · Action-induced outflows', '新repo/FX swap/官方操作的repayment、fee、margin和反转腿；FIMA additional margin只是可选author-SYN压力账本腿，选complete时才必须严格晚于initial且早于repurchase。'],
  ['20 · Official layer', 'sovereign swap、FIMA account-holder repo、local onward或other/null，逐层不合并；Layer A要保留两币initial/reversal四腿、term/rate/interest与foreign-central-bank Fed contractual obligor，且Layer C未创建时local onward risk=N/A。'],
  ['21 · Price—quantity—access', '成本、可得数量/期限与资格/成交门分别观察；单一面板不能替代。'],
  ['22 · Evidence state', 'SYN、observed、PIT、identified causal、OOS、production逐项标记；unknown不补0。'],
] as const;

export const dollarFundingEntryVocabulary = [
  ['Funding liquidity', '主体在明确窗口内履行现金义务的能力；不同于market liquidity和solvency。'],
  ['Dollar funding', '取得并按时交付美元cash的合同与市场安排，不等于持有美元计价资产。'],
  ['Legal entity', '依法承担合同、资产、负债和付款的主体。'],
  ['Booking location', '头寸被记录的地点；与集团nationality和资金实际位置均需区分。'],
  ['Residual maturity', '从当前as-of到下一合同现金腿的剩余时间。'],
  ['Rollover', '旧融资到期后用新交易取得资金；旧还款与新收款是不同腿。'],
  ['Commercial paper (CP)', '通常为短期无担保市场融资，投资者、评级和市场窗口会限制access。'],
  ['Certificate of deposit (CD)', '银行发行的存款类融资工具；期限与投资者基础需具体识别。'],
  ['Repo', '以证券为抵押取得现金并约定回购；initial与repurchase legs都要入账。'],
  ['FX swap', 'spot与forward反向币种交换捆绑的交易；未来美元腿可能形成rollover need。'],
  ['Covered interest parity (CIP)', '可比现金与FX合成策略终值相等的复制关系基准。'],
  ['Cross-currency basis', '在声明报价约定下，直接与合成融资成本之间的加点/减点楔子。'],
  ['Hedge demand', '为降低币值风险产生的方向性swap/forward需求；不等于cash期限匹配。'],
  ['Dealer capacity', '中介在资本、杠杆、限额、funding和settlement约束下承载交易的能力。'],
  ['Haircut', '抵押品marked value中不计入可借现金的比例。'],
  ['Encumbrance', '资产已被质押、锁定或受权利限制，不能重复分配。'],
  ['Collateral capacity', '资格、haircut和额度下的潜在借款上限；不是cash receipt。'],
  ['Margin', '因衍生品或融资头寸价值变化产生的现金/抵押补充要求。'],
  ['Natural hedge', '收入或资产现金流与外币义务在币种、金额和日期上的经济匹配。'],
  ['Financial hedge', '通过衍生品或金融合约改变币值风险；可能创造margin和rollover。'],
  ['Money market fund (MMF)', '投资短期工具的基金；其期限和发行人选择可影响银行美元负债。'],
  ['Correspondent banking', '一家银行为另一家银行持有账户并提供支付等服务的关系。'],
  ['Payment route', '支付消息和结算经过的机构链；本身不证明贷款或资金暴露。'],
  ['Intragroup transfer', '集团实体之间的资金移动；受法律、监管、额度与操作门限制。'],
  ['Ring-fencing', '监管或内部安排限制本地资源向外转移，以保护特定实体或法域。'],
  ['Swap line', 'FOMC授权、FRBNY执行的Fed与外国央行主权货币互换安排；第一层有USD IN/FCY OUT与到期USD OUT/FCY IN四腿，foreign central bank到期偿还美元principal+interest/compensation，FRBNY按同一汇率返还初始原数量FCY；本地私人分配属于另一层。'],
  ['FIMA repo', '获批官方账户持有人以Treasury抵押向SOMA取得美元的repo后备；本课可选author-SYN additional-margin腿若启用，只能严格发生在initial与repurchase之间。'],
  ['Local onward', '本地官方机构向合格recipient开展的独立操作，不由upstream facility自动产生。'],
  ['LBS', '按residence、unconsolidated记录的BIS国际银行统计，含intragroup。'],
  ['CBS', '按nationality、worldwide consolidated记录的BIS统计，排除intragroup。'],
  ['GLI', 'BIS全球流动性指标；覆盖银行贷款和国际债券等聚合项目，不是实体cash账本。'],
  ['Price—quantity—access', '同时观察融资成本、可得数量/期限与资格/成交能力的诊断框架。'],
  ['Realised', 'cash已结算，完整UTC value timestamp必须不晚as-of；它只进历史/C0 attribution，不再进当前前瞻X_H或O_H。'],
  ['Committed executable', '不可撤销且条件已满足，完整UTC value timestamp必须晚as-of；只有落在(as-of, horizonEnd]的腿进当前X_H或O_H，更晚的腿进下一桶。'],
  ['Quoted only', '只有indicative price或capacity；不进入cash schedule。'],
  ['Null / STOP', '缺少必要字段或合同冲突；不是经济零、稳定或没有风险。'],
] as const;

export type DollarFundingCheck = {
  id: string;
  kind: 'M' | 'K';
  title: string;
  question: string;
  options: readonly string[];
  correct: number;
  answer: string;
  trap: string;
  sourceIds: readonly DollarFundingSourceId[];
};

export const dollarFundingChecks: readonly DollarFundingCheck[] = [
  { id: 'M1', kind: 'M', title: '集团充足、实体短缺', question: '集团合并报表显示美元净资产为正，伦敦子行周五仍可能缺美元，最完整的解释是什么？', options: ['市场一定误价', '资源属于不同实体，transfer还要过法律、监管、运营与时间门', '子行必然资不抵债'], correct: 1, answer: '集团净额不能替代recipient实体、value date与可执行transfer。', trap: '把consolidated solvency当settlement liquidity。', sourceIds: [2, 14] },
  { id: 'K1', kind: 'K', title: 'Canonical G_pre', question: 'C₀=25、合同流入50、合同流出120、contingent流出20、Cmin=0；另有15 collateral capacity但无交易。G_pre是多少？', options: ['50', '65', '80'], correct: 1, answer: 'N_pre=25+50−120−20=−65，G_pre=65；capacity不是cash。', trap: '把未成交抵押能力直接扣减。', sourceIds: [1, 2, 18] },
  { id: 'M2', kind: 'M', title: 'Hedged不等于funded', question: '基金已100%对冲美元资产汇率风险，为什么仍可能有美元现金压力？', options: ['不可能有压力', '短期swap滚续、margin或赎回的value date可早于资产现金流', '只有美元下跌才有压力'], correct: 1, answer: '价值风险与现金腿时钟不同。', trap: '把终值对冲当即时流动性。', sourceIds: [2, 3, 9] },
  { id: 'K2', kind: 'K', title: 'FX swap notional', question: '两笔100美元FX swap分别明天和两年后到期，对7日窗口应怎样记录？', options: ['都记100缺口', '只按各自方向与value date登记；远期腿在窗口外不进7日桶', '全部净为0'], correct: 1, answer: 'Notional必须拆成两期现金腿并按期限桶登记。', trap: '把gross notional当明日净债务。', sourceIds: [2, 3] },
  { id: 'M3', kind: 'M', title: 'Basis不是shortage按钮', question: '看到basis=−40bp，为什么不能立即断言“全球缺美元”？', options: ['因为basis从不重要', '因为还缺pair、方向、tenor、side等护照，且basis受需求和中介约束共同影响', '因为负数一定表示美元过剩'], correct: 1, answer: 'Basis是有报价约定的relative price，不是数量、access或结构因果本身。', trap: '给符号固定经济标签。', sourceIds: [1, 4, 5] },
  { id: 'K3', kind: 'K', title: 'Route gate', question: 'Repo报价存在且haircut已知，但抵押品已全部质押。Cash receipt应记什么？', options: ['按haircut后全额记入', '0并称无风险', 'null/unavailable；没有unencumbered collateral，route未通过'], correct: 2, answer: '报价和公式不足以产生cash；encumbrance门失败。', trap: '把market existence当entity access。', sourceIds: [1, 18] },
  { id: 'M4', kind: 'M', title: 'MMF传导', question: '美国MMF缩短银行CP/CD期限，怎样可能影响境外企业美元贷款？', options: ['两者没有连接', '银行负债期限/数量收紧→替代融资或缩表→币种特定贷款收缩', 'MMF直接取消企业贷款'], correct: 1, answer: '冲击通过多层中介资产负债表，而非直接合同。', trap: '省略银行/dealer中间层。', sourceIds: [1, 7] },
  { id: 'K4', kind: 'K', title: 'Payment不等于funding', question: '看到一笔支付经过纽约correspondent，能否把消息金额记作correspondent loan？', options: ['能，支付即贷款', '不能；需余额、overdraft/credit合同、提款和期限证据', '只要是美元就能'], correct: 1, answer: 'Payment route只证明服务链，不证明credit exposure。', trap: '从message flow猜资金余额。', sourceIds: [17] },
  { id: 'M5', kind: 'M', title: '美元升值的异质主体', question: '美元升值时，以下哪项最专业？', options: ['所有非美主体都受损', '先读取资产、负债、收入、hedge、margin与期限，再判断各主体路径', 'DXY上涨等于全球shortage'], correct: 1, answer: '方向来自资产负债表与cash-flow passport。', trap: '用指数替代主体。', sourceIds: [1, 2, 9] },
  { id: 'K5', kind: 'K', title: 'FIMA期限', question: '若as-of=2026-09-17T09:00Z，合成FIMA七日repo在2026-09-19T15:00Z（D2）交付美元，repurchase应是哪一完整时间戳？', options: ['2026-09-20T15:00Z（D3）', '2026-09-26T15:00Z（D9）', '2026-10-01T15:00Z（D14）'], correct: 1, answer: 'Seven-calendar-day必须保持同一UTC时刻从D2到D9；若选O/N则是D2到D3。同理，D30 initial需要允许D37 reverse，不能因输入上限拒绝合法期限。', trap: '把SYN自由度用来改写真实设施期限，或只比较D标签而忽略完整时间戳。', sourceIds: [12] },
  { id: 'M6', kind: 'M', title: '两种官方后备', question: 'Swap line与FIMA最关键的结构差异是什么？', options: ['没有差异', '前者第一层交换美元与外国央行货币；后者是获批官方账户以Treasury做repo', '两者都由私人银行直接点击使用'], correct: 1, answer: '对手方、交换资产、信用关系和onward逻辑不同。', trap: '画成一根Fed—私人银行直管。', sourceIds: [10, 11, 12, 13] },
  { id: 'K6', kind: 'K', title: '官方第一层不等于私人收款', question: 'Fed与外国央行完成100美元swap，本地银行尚未获award。银行cash receipt是多少？', options: ['100', '按比例自动分配', 'null/0 receipt for that bank；需独立local onward transaction'], correct: 2, answer: '第一层不自动创造私人第二层。若问题是“是否已收款”，该银行为0；若问可达量而award未知，则保持null。', trap: '把upstream capacity登记到下游实体。', sourceIds: [10, 11] },
] as const;

export const dollarFundingUnderstandingQuestions = [
  '为一家日本银行伦敦子行填写legal entity、booking location、parent nationality、settlement currency与7日窗口。',
  '把集团consolidated美元净额与该子行周五settlement cash分别写出，并解释为什么不能互换。',
  '将现金存量、合同流入、合同流出、margin、可融资抵押品和quoted capacity放入正确栏位。',
  '比较90-day CD与每天滚动的O/N repo在7日ladder中的不同。',
  '把旧repo到期和新rollover写成两个transaction及至少四条cash legs。',
  '为养老金区分美元资产价值、FX hedge终值、即时margin与未来swap美元腿。',
  '为CP、CD、repo、FX swap和bond分别标抵押、报表位置、剩余期限与route gate。',
  '写出一条“有市场报价但没有可执行数量”的反例，并说明为何receipt为null。',
  '把同notional、明日到期与两年到期FX swap逐腿放入期限桶。',
  '给basis数值补全currency pair、quote direction、rate basis、tenor、side与bid/ask。',
  '构造basis扩大但并无系统危机的解释，以及access恶化但最近basis稳定的反例。',
  '把Treasury marked value、unencumbered eligible value、haircut capacity、binding receipt与settled cash分五栏。',
  '检查一组sale/private repo/FIMA allocation是否重复使用同一collateral lot。',
  '比较未对冲进口商、自然对冲出口商和套保NBFI在美元升值下的现金路径。',
  '画MMF→CP/CD/repo/dealer→非美银行→借款人的链，并为每条边列price、quantity、access证据。',
  '解释为什么correspondent payment message不能直接推断overdraft或credit line。',
  '为一笔intragroup transfer列legal、regulatory、operational、amount与value-date五道门。',
  '画swap line的Fed—外国央行USD IN/FCY OUT、到期USD OUT/FCY IN四腿，标出term、rate、两位FCY最小结算单位取整、interest、逐腿status与foreign-central-bank Fed contractual obligor；再单独画local onward。',
  '画FIMA account-holder repo的Treasury/美元initial腿、七日repurchase腿、严格在两者之间的可选author-SYN additional-margin腿与可选local onward。',
  '写出一个可证伪美元funding stress证据包：entity/H、至少两类price/quantity/access、行为反应、竞争解释与反证。',
] as const;

export const dollarFundingResearchQuestions = [
  { question: '实体级7日美元gap是否比集团净头寸更能预测内部转移、facility use或币种特定贷款收缩？', design: '构建PIT entity passport与maturity ladder，预注册缺失和netting规则，比较增量样本外解释力。', reject: '用集团总资产或国别美元债替代entity cash flows。', sourceIds: [2, 14] as const },
  { question: 'MMF期限缩短通过哪些银行负债工具进入美元贷款供给？', design: '使用事前MMF依赖、币种内贷款与银行固定效应，区分借款需求和银行供给。', reject: '从同期总贷款下降直接声称MMF因果。', sourceIds: [1, 7] as const },
  { question: 'Basis变动中hedging demand与dealer balance-sheet cost各占多少？', design: '联合quote passport、流量/头寸proxy、季度末与制度变化，承认proxy和识别限制。', reject: '只用basis方向或DXY做单变量回归。', sourceIds: [4, 5, 6] as const },
  { question: 'Price平稳时，term quote size、tenor和counterparty access是否已提前恶化？', design: '保存bid/ask、size、rejection、tenor与成交，定义可观测的access而非事后故事。', reject: '把最近成交价当完整市场状态。', sourceIds: [1, 16] as const },
  { question: 'Haircut上升与margin需求怎样共同触发跨资产出售？', design: '匹配collateral lot、owner、encumbrance、margin clock与sale timestamps，区分capacity和settled cash。', reject: '以账面Treasury持仓作为同日cash。', sourceIds: [8, 18] as const },
  { question: '美元升值对不同资产负债表的现金影响何时反向？', design: '按自然收入、债务币种、hedge ratio、maturity和margin制度分组；先给direction，再估计。', reject: '用DXY为所有主体赋同号。', sourceIds: [1, 2, 9] as const },
  { question: 'Intragroup transfer在何种home/host约束下缓冲或迁移冲击？', design: '实体级内部flows、审批和value dates，利用制度差异但保留选择偏差。', reject: '把consolidated intragroup elimination当实际可达性。', sourceIds: [2, 14] as const },
  { question: 'Swap-line local operations怎样影响basis、tenor和银行贷款？', design: '分别记录Layer A draw、Layer C auction/award、eligible population和时间，避免announcement=receipt。', reject: '用Fed总swap余额分配给每家银行。', sourceIds: [10, 11, 13] as const },
  { question: 'FIMA access是否减少储备管理者在压力期出售Treasury？', design: '比较可达性、持仓、facility terms和sale行为，控制冲击与选择，公开聚合不能识别时明确失败。', reject: '由低take-up直接推断无效果或无需求。', sourceIds: [12, 13] as const },
  { question: 'PIT price—quantity—access面板能否优于basis或DXY预测跨境美元信用收缩？', design: '预注册样本、阈值、entity bridge、vintage和缺失处理，严格OOS比较。', reject: '用修订后GLI或未来facility记录泄漏。', sourceIds: [15, 16] as const },
] as const;

export const dollarFundingInterfaces = [
  ['4.01 Balance of Payments', '接收居民/非居民交易与金融对项的宏观账本。', '不把BOP净额当实体美元settlement cash。'],
  ['4.02 International Monetary System', '接收美元网络、货币层级与官方安排的制度背景。', '不重复完整货币体系史，不把核心地位等同无限流动性。'],
  ['4.03 Reserve / Safe Asset', '接收美元单位服务、Treasury collateral与有效容量边界。', '不把safe asset market value当cash，不复制4.03 SYN。'],
  ['4.04 Treasury Curve', '接收repo、FX hedge、本地门与市场功能接口。', '不把Treasury yield或SOFR当美元funding单一价格。'],
  ['4.06 Global Banks', '输出entity ladder、intragroup、MMF与币种特定贷款链。', '不推断个别银行头寸、资本或违约。'],
  ['4.07 Global Financial Cycle', '输出共同美元价格、access和中介capacity候选。', '不把共振归为单一美国冲击。'],
  ['4.08 Emerging Markets', '输出美元债、自然/金融hedge、非银赎回与官方门。', '不按国别标签预设脆弱性。'],
  ['4.11 FX Hedging / Basis', '输出完整FX-swap现金腿、quote passport与dealer约束。', '不把basis解释成quantity或shortage。'],
  ['7.11 Liquidity Spiral', '输出cash need、collateral capacity、margin、sale与haircut反馈。', '不把SYN反馈当历史校准。'],
  ['7.16 Financial Networks', '输出多层资金链与entity/route节点。', 'Payment edge不自动等于credit edge。'],
  ['7.24 Identification', '输出竞争机制、时间钟、官方layer与反证。', '同期相关或announcement不等于causal receipt。'],
  ['7.25 Data Engineering', '输出immutable transaction/cash-leg IDs、vintage和null reasons。', '不跨口径拼LBS/CBS/GLI或把unknown补0。'],
  ['7.26 Validation', '输出SYN/observed/PIT/OOS/causal/production状态。', '页面实验不证明预测、收益或production readiness。'],
  ['Investment / policy decisions', '只提供机制学习与研究设计。', '不提供交易、套保比例、融资、监管、法律或政策建议。'],
] as const;

export const dollarFundingEvidenceBoundaries = [
  '官方与BIS材料支持对象、条款和机制，不提供任意私人实体当前头寸或实时缺口。',
  '历史案例证明某条链在特定样本出现，不把2011或2020改写成下一次危机的固定顺序。',
  'Working paper版本与publisher final严格分开；只引用已读版本的页节。',
  'SYN公式验证单位、方向、互斥和STOP，不是监管指标、历史校准、压力测试或政策效果模型。',
  'Basis、DXY、GLI与facility usage各照亮一面；没有任何一个变量是普适shortage indicator。',
  'Aggregate LBS/CBS/GLI不能自动桥接到legal entity；bridge缺失时个体结论为null。',
  'Official facility存在不等于私人资格、award、H内settlement或足额覆盖。',
  'Observed、PIT、causal、OOS、forecast、trading和production状态逐项独立，不能由网页通过或双审升级。',
] as const;

export const dollarFundingInvariants = [
  'Global dollar funding不是全球美元存量。',
  '集团净额不是实体、币种、日期的可用cash。',
  'Solvency不是funding liquidity。',
  'Stock不是窗口内flow。',
  'Original maturity不是residual maturity。',
  '预期rollover不能删除旧到期流出。',
  '新rollover与旧maturity必须用不同transaction IDs。',
  'Hedged不是funded。',
  'FX-swap gross notional不是净债务、损失或明日缺口。',
  'Spot FX不是自带未来返还的融资。',
  'Basis符号没有脱离quote passport的固定含义。',
  'CIP偏离不等于无风险即时套利。',
  'Indicative price不证明可执行quantity或access。',
  'Market value不是eligible unencumbered collateral。',
  'Haircut capacity不是cash receipt。',
  '完整UTC timestamp是计算键；D0/D1只是显示标签。',
  '当前前瞻窗口统一为(as-of, horizonEnd]，左边界as-of不重复进窗口。',
  'Realised value timestamp必须不晚as-of；只归历史/C0 attribution，当期X_H/O_H=0。',
  'Committed executable value timestamp必须晚as-of；只在(as-of, horizonEnd]内进当前X_H/O_H。',
  '每条cash leg独立持有status；initial realised不能让future reverse继承同一状态。',
  '同一collateral lot不能分配给多个route超过U。',
  '(transaction_id, cash_leg_id)必须唯一映射不可变leg passport。',
  '同一source event换新leg ID重复登记仍然STOP。',
  'DXY上升不证明所有主体同向受损或全球shortage。',
  'Correspondent payment route不证明funding/credit exposure。',
  'Intragroup capacity或意向不是recipient cash。',
  'Swap-line Layer A必须保留固定FRBNY/foreign-CB实体、FOMC授权与FRBNY执行边界、对手准备度、foreign-central-bank Fed contractual obligor、term/rate/interest与两币initial/reversal四腿；Layer A不自动创建Layer C，local onward risk=N/A。',
  'Swap-line Layer A的initial FCY=USD principal×rate后按声明的2位FCY最小结算单位四舍五入，reversal FCY=initial FCY原数量；只有reversal USD增加USD interest/compensation。实验的1–30日输入域不是官方期限上限；官方材料支持next day至最长3个月。',
  'Swap-line Layer A四腿任一缺失、0金额、时间/汇率/本息关系或immutable ID冲突都STOP；完整第一层仍不是私人bank receipt。',
  'FIMA account holder不是任意私人机构。',
  'FIMA term只能按当前官方允许的O/N或7-calendar-day建模。',
  'FIMA additional-margin leg是可选author-SYN stress-ledger extension，不是Fed FAQ已公开证明的逐笔official schedule；只有选complete时才要求amount/status/timestamp，且必须严格满足initialTimestamp < marginTimestamp < repurchaseTimestamp。',
  'FIMA正的X_H要求approved holder、holder-owned且唯一分配的eligible Treasury、完整initial/reverse legs、per-leg status、UTC timestamps、margin/limit与匹配term/date；缺一项即null/STOP。',
  'FIMA输入域必须允许D30 initial对应D31 overnight reverse或D37 seven-day reverse。',
  'Local onward是独立transaction，不由upstream facility自动产生。',
  'Layer C必须使用与upstream A/B不同的transaction/leg/source-event IDs，并保留recipient自己的collateral rule及repayment/fee/margin schedule；D30收款与D37还款必须可表示。',
  'SYN-2只输出G_pre；不存在G_post，也不读取其他实验。',
  'RECON-X只属作者静态测试，不是第七个SYN或页面结果。',
  'Unknown/null不是经济零。',
  '双审、build、浏览器与PDF都不证明observed/PIT/OOS/causal/production资格。',
] as const;
