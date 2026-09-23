import type { EmCapitalFlowSourceId } from './emCapitalFlowReferences';

export const emCapitalFlowThesis = {
  title: '中心命题：资本流是一组有主体、有合约、有时钟的双边资产负债表交易，不是一根“全球资金水管”',
  statement: '全球状态只能提供共同输入；非居民与居民分别通过互斥的金融账户功能分类单元——直接投资、证券股权／基金份额、证券债务、金融衍生品、其他投资与适用的储备资产——改变跨境债权，工具、币种、期限与对冲则作为另一维属性保存，再由投资者约束、本地市场深度和政策状态决定谁承受价格、现金与信用压力。净额、基金申赎、持仓变化和美元方向都只是局部观察，不能替代完整流量对象，更不能自动识别冲击。',
  chain: '对象护照 → 交易／估值 → gross两侧 → 合约组成 → push×pull×pipes → 异质暴露 → 边际吸收 → 币种与期限 → 国内路线 → 基准／赎回 → 实时事件 → 价格—资产负债表反馈 → 缓冲与识别边界',
  inequalities: [
    'BOP文献的gross leg ≠ 逐笔未净成交turnover',
    '头寸变化 ≠ 当期资本流交易',
    'net接近0 ≠ 两侧没有大规模跨境行为',
    '总融资稳定 ≠ 合约结构或到期现金稳定',
    '本币债 ≠ 没有全球美元或投资者风险',
    '事件标签 ≠ 外生shock ≠ 危机 ≠ 福利损失',
    '观察数量 ≠ 已识别供给冲击',
  ],
} as const;

export const emCapitalFlowCoreRoute = [
  { time: '00–07分钟', conceptIds: ['em-flow-mechanism-01'], goal: '先把“钱进来”改写为居民、方向、工具、交易／头寸和时钟齐全的对象。' },
  { time: '07–14分钟', conceptIds: ['em-flow-mechanism-02'], goal: '同时保存非居民与居民两条gross leg；在本段完成C1的两腿代数、净额与相抵结果。' },
  { time: '14–21分钟', conceptIds: ['em-flow-mechanism-03'], goal: '先按功能分类建立互斥组成向量，再把工具、币种与期限作为属性维度保存。' },
  { time: '21–29分钟', conceptIds: ['em-flow-mechanism-04'], goal: '把push、pull和pipes写成共同决定的条件关系，不抢跑因果。' },
  { time: '29–36分钟', conceptIds: ['em-flow-mechanism-05'], goal: '拒绝固定EM beta，建立经济体×工具×方向×状态的异质暴露。' },
  { time: '36–43分钟', conceptIds: ['em-flow-mechanism-06'], goal: '找到边际吸收者，分开持仓流、价格、数量与融资可得性。' },
  { time: '43–51分钟', conceptIds: ['em-flow-mechanism-07'], goal: '沿主体资产负债表追踪币种和对冲，理解风险迁移。' },
  { time: '51–59分钟', conceptIds: ['em-flow-mechanism-08'], goal: '用期限表把偿付能力与rollover现金缺口分栏。' },
  { time: '59–67分钟', conceptIds: ['em-flow-mechanism-09'], goal: '在同一借款人边界内比较四条互斥的新融资路线，完成C2。' },
  { time: '67–75分钟', conceptIds: ['em-flow-mechanism-10'], goal: '拆开基准、最终申赎、经理交易和估值，理解共同销售。' },
  { time: '75–83分钟', conceptIds: ['em-flow-mechanism-11'], goal: '带着第2段C1结果复核surge、stop、flight、retrenchment的阈值、vintage与严格PIT标签；此处不重做实验。' },
  { time: '83–91分钟', conceptIds: ['em-flow-mechanism-12'], goal: '逐箭头检验流量—价格—资产负债表—信用反馈。' },
  { time: '91–98分钟', conceptIds: ['em-flow-mechanism-13'], goal: '区分缓冲状态、政策反应与供需识别，守住下游边界。' },
] as const;

export const emCapitalFlowPassportRules = [
  '经济体与样本宇宙：哪些国家、是否含金融中心、谁被称为EM。',
  '持有人居民身份：居民、非居民、unknown，不以国籍替代。',
  '发行人居民身份与法律实体；集团母公司和境外子公司分开。',
  '资产腿或负债腿；同时保存来源数据库原始符号。',
  '正号显示约定与经济含义，不依赖图表颜色猜方向。',
  '直接投资、证券股权、证券债务、衍生品、其他投资或储备。',
  '具体工具：贷款、存款、债券、股权、贸易信贷等。',
  '发行人与持有人部门；政府、银行、非银金融、企业、家庭分开。',
  '币种：合同币种、计价币种、报告币种与基准币。',
  '期限：原始期限、剩余期限与未来偿付窗口分开。',
  '自然对冲、金融对冲、保证金与对手方资格。',
  '一级发行、二级交易、赎回、偿还或集团内部转移。',
  'transaction、position、price/FX valuation或other volume change。',
  'gross inflow leg、gross outflow leg或net；gross不冒充turnover。',
  '流量是期间量，头寸是时点量，现金缺口另有到期时点。',
  '频率与期间；日、月、季、年不得机械相加。',
  '市场交易时钟、结算时钟、统计观察期和发布日期。',
  '时区、休市与非重叠市场关闭时间。',
  '单位、币值、缩放、季调与名义／实际处理。',
  '数据来源、表号、API或文件版本及检索日期。',
  '修订vintage与历史实时可得性；最终值不冒充PIT。',
  '覆盖率、自愿报告、基金样本和缺失机制。',
  'residence与nationality／consolidated口径不得直接相加。',
  '存量变动是否做汇率和break adjustment；调整仍不等于逐笔交易。',
  '事件标签的趋势、窗口、阈值、持续期与估计样本。',
  'push/pull/pipes变量的经济定义与同时性风险。',
  '价格、数量与access分别保存，不用一个代理覆盖三个对象。',
  '政策工具的授权主体、资格、期限、币种和成本。',
  '证据等级：身份、描述、模型、准实验、结构识别或政策框架。',
  'observed、PIT、causal、prediction、OOS、trading、production逐轴记录。',
] as const;

export const emCapitalFlowEntryVocabulary = [
  ['居民原则', '按经济领土与主要经济利益中心归属，不等于护照国籍或集团母公司所在地。'],
  ['金融账户资产腿', '居民取得或处置对非居民的金融债权。'],
  ['金融账户负债腿', '非居民取得或处置对本国居民的债权。'],
  ['Gross inflow', '文献中常指非居民驱动的负债侧净交易腿；不是所有逐笔买卖的未净总额。'],
  ['Gross outflow', '文献中常指居民驱动的资产侧净交易腿；与负债腿分开保存。'],
  ['Net inward financing', '教学显示的I−O；使用时必须保留来源符号和两条原始腿。'],
  ['Transaction', '当期债权建立、清偿、买卖或转让，不含价格／汇率重估。'],
  ['Position', '某时点持有的金融资产或负债存量。'],
  ['Valuation', '价格或汇率变化对头寸价值的改变，不是交易现金流。'],
  ['Other volume change', '重分类、核销、居民身份变化等非交易非估值调整。'],
  ['FDI', '通常涉及控制或重大影响的直接投资关系；不等于greenfield或永久稳定资金。'],
  ['Portfolio equity', '不构成直接投资关系的股权与基金份额，承担价格损失。'],
  ['Portfolio debt', '可交易债务证券；币种、期限、持有人与市场深度仍需拆。'],
  ['Other investment', '贷款、存款、贸易信贷等类别；内部异质性很大。'],
  ['Push factor', '跨经济体共同变化的全球候选输入，不自动等于外生shock。'],
  ['Pull factor', '目的地本地回报、需求、风险和制度候选，常与流量内生互动。'],
  ['Pipes', '银行、基金、基准、市场结构等把全球和本地条件转成交易的中介管道。'],
  ['Investor base', '实际持有人与最终资金来源的组成；不是单一外国持有比率。'],
  ['Marginal absorber', '在当前价格真正承接新增供给或销售的一方。'],
  ['Original sin', '借款人难以用本币对外借款的经典问题；redux强调风险可迁移到本币债外国持有人。'],
  ['Natural hedge', '同币种收入或资产对负债现金流的经济抵消。'],
  ['Financial hedge', '远期、掉期、期权等合同形成的对冲；需检查期限、对手方与保证金。'],
  ['Rollover', '到期融资被续作或替换；access和现金时点比年度总量更关键。'],
  ['Gross financing need', '某窗口内到期本金、利息及必要现金用途的总需求。'],
  ['Benchmark effect', '指数权重与跟踪约束改变主动和被动配置的候选机制。'],
  ['Redemption', '最终投资者赎回基金份额；不等于基金经理同额销售。'],
  ['Surge / Stop', '非居民gross inflow腿按事前规则的异常增加／减少。'],
  ['Flight / Retrenchment', '居民gross outflow腿按事前规则的异常增加／减少。'],
  ['Absorptive capacity', '本地投资者、市场深度、外汇现金、制度与政策共同构成的条件化吸收能力。'],
  ['Equilibrium quantity', '供给与需求共同决定的成交数量；数量变化本身不能识别哪条曲线移动。'],
] as const;

export type EmCapitalFlowCheck = {
  id: string;
  kind: 'M' | 'K';
  title: string;
  question: string;
  options: readonly [string, string, string];
  correct: 0 | 1 | 2;
  answer: string;
  trap: string;
  sourceIds: readonly EmCapitalFlowSourceId[];
};

export const emCapitalFlowChecks: readonly EmCapitalFlowCheck[] = [
  { id: 'M1', kind: 'M', title: '交易还是估值', question: '外国持仓由100升到112，已知价格／汇率重估+14、其他数量变化0，当期交易是多少？', options: ['−2；头寸变化不能直接称作流入', '+12；持仓增加就是流入', '+26；把交易和估值相加'], correct: 0, answer: '由头寸桥，12 = T + 14，因此T = −2。', trap: '把存量差分冒充交易。', sourceIds: [1] },
  { id: 'K1', kind: 'K', title: 'gross与net', question: 'ΔI=−6、ΔO=−6时，最严谨的结论是什么？', options: ['两侧都没有事件', 'ΔN=0，但可能同时存在stop与retrenchment', '必然是资本外逃'], correct: 1, answer: '净额相抵不消除两侧主体行为。', trap: '净额为零即平静。', sourceIds: [3, 4] },
  { id: 'M2', kind: 'M', title: '工具组成', question: '短期外币银行贷款−5、长期本币债+5，总融资不变，能推出什么？', options: ['风险完全不变', '银行供给冲击已识别', '总量稳定但路线、币种与期限可能改变，需继续核对属性'], correct: 2, answer: '总量身份不能覆盖合约组成迁移。', trap: '把所有融资单位视为可互换。', sourceIds: [6, 9, 15, 17] },
  { id: 'K2', kind: 'K', title: 'Push与Pull', question: '美元上升、本国政治风险也恶化，债券流出。当前能写什么？', options: ['唯一原因是美元', 'global与local为联合候选，因果需额外识别', '唯一原因是政治风险'], correct: 1, answer: 'push/pull是条件分解，不是从同时变化中选择一个真因。', trap: '把先后或相关当排他性因果。', sourceIds: [5, 6, 7, 10] },
  { id: 'M3', kind: 'M', title: '固定EM beta', question: '同一global state下两国结果相反，最优先检查什么？', options: ['币种期限、投资者基础、本地残差与政策等过滤器', '把因子符号翻转', '删除反向国家以保持平均关系'], correct: 0, answer: '国家×工具×方向×状态的暴露不同，不存在固定EM系数。', trap: '把样本标签当机制。', sourceIds: [8, 9, 10] },
  { id: 'K3', kind: 'K', title: '边际吸收者', question: '外国基金卖出5，本地养老金等量买入。单凭这5能否计算汇率变化？', options: ['能，汇率必贬5%', '能，汇率完全不变', '不能；需发行供给、需求弹性、市场深度与其他交易'], correct: 2, answer: '销售有交易对手，流量没有固定价格乘数。', trap: '把持仓变化机械映射成价格。', sourceIds: [18, 19, 20] },
  { id: 'M4', kind: 'M', title: '本币债与风险迁移', question: '政府把外币短债改为长期本币债，正确表述是什么？', options: ['一切外部风险消失', '风险必然更高', '借款人FX与rollover风险可下降，但外国持有人承担汇率／久期风险'], correct: 2, answer: '风险可在主体间迁移，期限也有双面效果。', trap: '把本币融资视为无条件安全。', sourceIds: [16, 17] },
  { id: 'K4', kind: 'K', title: '现金时钟', question: '总融资前后均为12，未来窗口M=6、R=4、H=1，rollover gap是多少？', options: ['1，且不因期间总量稳定而消失', '0，总融资稳定已覆盖到期', '12，所有融资都要重算'], correct: 0, answer: 'max(0,6−4−1)=1。', trap: '用期间总量替代时点现金。', sourceIds: [2, 15, 24] },
  { id: 'M5', kind: 'M', title: '基金流分解', question: '基金持仓下降能否直接等于BOP portfolio outflow？', options: ['能，二者定义相同', '不能；需拆经理交易、申赎、估值、覆盖与居民口径', '只要价格同时下跌就能'], correct: 1, answer: '基金数据库与BOP覆盖、对象和会计桥不同。', trap: '用一个中介样本代表全部跨境投资者。', sourceIds: [9, 18, 19] },
  { id: 'K5', kind: 'K', title: '事件实时钟', question: '用2010–2025全样本分位数给2013年贴stop标签，主要问题是什么？', options: ['使用未来信息，历史标签不再是严格PIT', '样本太长所以必然无效', '只要最终数据准确就没有问题'], correct: 0, answer: '阈值必须只用事件前可知数据并保存vintage。', trap: '把标签构造当成中性的后处理。', sourceIds: [3, 4] },
  { id: 'M6', kind: 'M', title: '储备与政策', question: '储备下降后市场稳定，能否断言FXI有效且福利最优？', options: ['能，时间顺序就是因果', '能，只要储备规模大', '不能；需分交易／估值、反应函数、反事实、成本和其他工具'], correct: 2, answer: '政策反应、市场结果、因果效果与福利是不同结论。', trap: '把内生政策反应当随机处理。', sourceIds: [22, 23, 24] },
  { id: 'K6', kind: 'K', title: '供需识别', question: '跨境贷款量下降且课程通过双审，证据状态如何变化？', options: ['供给冲击和生产资格都成立', '仍需需求控制与识别设计；双审不生成observed/PIT/causal/OOS证据', '只要来源权威就可称因果'], correct: 1, answer: '均衡数量不能区分供需，编辑门也不能提升经验资格。', trap: '把工程和审稿质量冒充实证证据。', sourceIds: [13, 25] },
] as const;

export const emCapitalFlowUnderstandingQuestions = [
  '用一个具体交易说明居民身份、发行人、持有人和工具为什么缺一不可。',
  '构造头寸增加但交易为负的数值例子，并写出完整头寸桥。',
  '解释BOP文献的gross leg为何仍不等于未净成交turnover。',
  '构造净流入变化为0但stop与retrenchment并存的例子。',
  '先把10单位直接投资、证券股权、证券债务与其他投资银行贷款放入互斥功能单元，再比较退出和损失承担。',
  '为一项资本流研究画push、pull、pipes三栏竞争解释。',
  '说明为什么全球变量解释度有限既不证明全球周期不存在，也不支持强版单因子。',
  '设计一个“低global beta但总损失大”的本地残差情景。',
  '非居民卖债时列出五类可能边际吸收者及其约束。',
  '给出外国持仓下降但没有销售的估值反例。',
  '比较未对冲本地收入借款人、美元收入出口商和本币债外国基金。',
  '解释对冲终值与保证金／rollover现金为什么必须分栏。',
  '构建一个期间总融资稳定但未来现金缺口仍为正的期限表。',
  '说明银行贷款下降为何既可能是供给，也可能是需求或路线替代。',
  '把基金申赎、经理交易、估值和BOP交易放进同一但不混淆的桥。',
  '写出stop历史标签的严格PIT构造规则和两项稳健性检验。',
  '分别给出流量—价格反馈的正反馈与负反馈例子。',
  '解释储备存量、储备交易和FXI为何不能互相替代。',
  '为“本地投资者基础缓冲外资销售”写一个会推翻叙事的反证。',
  '为4.08输出一份最小exposure vector，并说明为何它不是国家排名。',
] as const;

export type EmCapitalFlowUnderstandingGuide = {
  kind: 'measurement' | 'channel' | 'identification' | 'policy';
  mustInclude: readonly string[];
  commonError: string;
  extension: string;
};

export const emCapitalFlowUnderstandingGuides: readonly EmCapitalFlowUnderstandingGuide[] = [
  { kind: 'measurement', mustInclude: ['居民持有人和发行人', '资产／负债方向', '工具与交易时钟'], commonError: '只写“外国钱进入本国”而没有债权对象。', extension: '加入境外子公司与最终资金使用地。' },
  { kind: 'measurement', mustInclude: ['期初与期末头寸', '交易、估值、其他变化', '数值闭合'], commonError: '把头寸差全部算作交易。', extension: '再构造头寸不变但有大交易的例子。' },
  { kind: 'measurement', mustInclude: ['两条腿不互相抵消', '腿内仍可能净额化', 'turnover需要逐笔买卖'], commonError: '把gross capital flow翻译成全部未净成交。', extension: '说明发行与偿还怎样在同工具内抵消。' },
  { kind: 'measurement', mustInclude: ['ΔI与ΔO分别为−6', 'ΔN=0', 'stop与retrenchment主体不同'], commonError: '净额为0即没有事件。', extension: '加入工具内部的债务stop与股权surge。' },
  { kind: 'channel', mustInclude: ['控制／所有权', '期限币种与偿付权', '价格与access路径'], commonError: '按工具名称给固定安全排名。', extension: '加入SPE/pass-through与二级交易。' },
  { kind: 'identification', mustInclude: ['全球共同候选', '本地需求／风险候选', '银行／基金／基准管道'], commonError: '把push与pull当互斥真因。', extension: '写一项可区分两种故事的识别设计。' },
  { kind: 'identification', mustInclude: ['平均解释度对象与样本', '尾部／工具异质性', '不从低R²推不存在'], commonError: '在“全部由全球决定”和“全球完全无关”之间二选一。', extension: '分正常期与stop期估计。' },
  { kind: 'channel', mustInclude: ['低global contribution', '大local residual', '总结果由两者共同决定'], commonError: '把beta当损失或脆弱性排名。', extension: '加入缓冲使高beta国家结果较小。' },
  { kind: 'channel', mustInclude: ['本地养老金／银行／家庭／官方／另一非居民', '各自风险或现金约束', '边际而非平均持有人'], commonError: '把外国卖方视为没有交易对手。', extension: '加入发行净供给。' },
  { kind: 'measurement', mustInclude: ['持仓下降来自价格或汇率', '交易可以为0', '头寸桥闭合'], commonError: '持仓变化与交易画等号。', extension: '加入other volume change。' },
  { kind: 'channel', mustInclude: ['借款人币种错配', '自然／金融对冲', '投资者基准币与久期'], commonError: '只看债务币种或国籍。', extension: '加入保证金时钟。' },
  { kind: 'channel', mustInclude: ['终值对冲', '中间保证金现金', '到期续作access'], commonError: '名义全对冲即所有时点无压力。', extension: '构造终值覆盖但日内现金不足的案例。' },
  { kind: 'channel', mustInclude: ['期间融资总量', '具体到期窗口', '承诺续作与可用现金'], commonError: '用年度流入覆盖本周到期。', extension: '加入多期限桶和主体不可转移现金。' },
  { kind: 'identification', mustInclude: ['均衡数量由供需共同决定', '替代融资路线', '所需报价／额度／共同借款人证据'], commonError: '贷款量下降自动称供给收缩。', extension: '设计母行shock×预定暴露。' },
  { kind: 'measurement', mustInclude: ['最终投资者申赎', '经理买卖', '价格／汇率估值', 'BOP覆盖和居民口径'], commonError: '四项使用同一个flow标签。', extension: '加入基准权重公告与实施时钟。' },
  { kind: 'measurement', mustInclude: ['只用t−1以前数据', '保存vintage和窗口', '替代阈值／趋势稳健性'], commonError: '用最终全样本阈值回填历史。', extension: '比较实时标签与修订后标签。' },
  { kind: 'channel', mustInclude: ['赎回—销售—价格的正反馈', '养老金逆向承接的负反馈', '各自成立条件'], commonError: '看到循环箭头就宣称系统性传染。', extension: '为每条边写拒绝条件。' },
  { kind: 'policy', mustInclude: ['存量含交易和估值', 'FXI是政策交易的一部分', '可动用与总额不同'], commonError: '储备下降等于等额售汇。', extension: '加入远期头寸与或有负债。' },
  { kind: 'identification', mustInclude: ['预定本地投资者基础', '外国销售shock', '非连接资产或国家placebo'], commonError: '稳定结果自动归功于本地买方。', extension: '检查本地投资者是否也同时受限。' },
  { kind: 'measurement', mustInclude: ['工具、币种、期限、主体、投资者基础', '时钟与证据状态', '不输出单一分数'], commonError: '把向量加权成未经验证的国家排名。', extension: '为下游模型预注册权重与OOS验证。' },
] as const;

export const emCapitalFlowResearchQuestions = [
  { question: '实时gross-flow事件与修订后事件有多大差异？', design: '用逐vintage BOP数据滚动估计趋势和阈值，冻结四类事件规则。', evidenceNeeded: '历史发布档案、修订矩阵与事件前可知样本。', whatWouldWeakenIt: '大部分事件只在最终修订数据中出现。', reject: '最终全样本标签不得冒充PIT。', sourceIds: [1, 3, 4] as const },
  { question: '同一global state对债券、股票、银行和FDI的loading是否稳定？', design: '按方向×工具分面板，预注册状态交互和滚动窗口。', evidenceNeeded: '可比BOP流量、全球状态版本与本地控制。', whatWouldWeakenIt: '系数对样本、工具或时期高度翻转。', reject: '不估计单一EM beta。', sourceIds: [5, 6, 7, 8] as const },
  { question: '外国投资者结构是否放大共同shock？', design: 'shock×预定共同基金依赖／基准权重，控制市场深度和进入选择。', evidenceNeeded: '持有人、基金、基准、流动性与事件时钟。', whatWouldWeakenIt: '高低暴露组在placebo shock下同样分化。', reject: '基金覆盖率不等于全体非居民。', sourceIds: [8, 18, 19] as const },
  { question: '非居民销售由谁承接，价格影响如何随市场深度改变？', design: '匹配持有人交易、发行供给、交易商库存与高频价格。', evidenceNeeded: '同工具交易、持仓、报价和结算数据。', whatWouldWeakenIt: '外国销售与本地买入时钟不闭合。', reject: '汇率与收益率不能相加为吸收份额。', sourceIds: [18, 19, 20] as const },
  { question: '本币债是否将风险从借款人迁移给外国投资者？', design: '比较币种×期限×持有人暴露对外生美元或风险容量shock的反应。', evidenceNeeded: '合同币种、久期、对冲、基金负债与借款人现金流。', whatWouldWeakenIt: '充分本地持有或对冲组同样反应。', reject: '本币债不预设安全或危险。', sourceIds: [16, 17] as const },
  { question: '外部融资怎样进入新增银行贷款？', design: '资本流shock×银行预定依赖，控制共同借款人需求并跟踪价格和数量。', evidenceNeeded: '银行资金、贷款登记、报价／额度与借款人结果。', whatWouldWeakenIt: '贷款反应只来自高需求借款人选择。', reject: '国家流入与贷款增长相关不是供给识别。', sourceIds: [11, 12, 13] as const },
  { question: '非居民银行贷款收缩是否被非居民债券／证券股权一级融资或居民银行贷款真正替代？', design: '以同一企业、同一期间的新融资为边界，把债权人居民身份×工具定义成互斥路线，再比较数量、币种、期限、价格和access。', evidenceNeeded: '企业级贷款提款、一级发行／认购、股权关系、合同条款与现金数据。', whatWouldWeakenIt: '受冲击企业总融资与条款完全不变，或所谓替代仅来自二级市场持有人转手。', reject: '数量补足不自动等价；附加属性unknown保持未定；路线定义之外的附加字段即使全部匹配，也只能称这些字段匹配，路线身份差异仍保留。', sourceIds: [13, 14, 15] as const },
  { question: 'stop何时转化为信用与实体收缩？', design: '事件×预定FX mismatch／短期到期／抵押暴露，并跟踪现金、信用和投资时序。', evidenceNeeded: 'PIT事件、主体负债、收入、对冲、贷款和真实活动。', whatWouldWeakenIt: '高低暴露主体反应无差异或时序相反。', reject: 'stop本身不称危机原因。', sourceIds: [3, 15, 21] as const },
  { question: '储备和本地投资者基础对哪条路线提供缓冲？', design: '把缓冲按主体、币种和期限与外生流量shock交互，记录政策内生性。', evidenceNeeded: '可动用储备、持有人、FXI、市场深度与资格规则。', whatWouldWeakenIt: '缓冲只在政策事后选择样本中显现。', reject: '单一储备比率不生成韧性排名。', sourceIds: [22, 23, 24] as const },
  { question: '融资价差的共同波动与资本流数量的特质波动分别由哪些供需冲击解释？', design: '联合建模spread与net-flow quantity，先报告共同／特质方差份额，再对共同与国别供需冲击施加并替换符号／零限制；access另需独立数据，不能冒充论文直接结果。', evidenceNeeded: '可比净流量代理、融资价差、模型vintage及限制敏感性；若研究access，另配拒贷与市场关闭指标。', whatWouldWeakenIt: '数量共同因子不再弱、结果对限制或net-flow proxy高度翻转，或替代模型无法复现价量差异。', reject: '不预设价和量都由强共同因子主导，也不得互作代理。', sourceIds: [25] as const },
] as const;

export const emCapitalFlowEvidenceBoundaries = [
  'BOP金融账户的gross leg按资产／负债方向分开，但不是逐笔未净成交turnover。',
  '交易、价格／汇率重估、其他数量变化和期末头寸必须分栏。',
  '功能分类与工具轴不得混列求和；直接投资、证券投资、衍生品与其他投资及其内部工具没有跨时期固定安全排序。',
  'push、pull、pipes是候选分解；代理、因子和同期回归不自动识别结构shock。',
  '国家、工具、方向与状态的loading不同；EM标签和样本均值不生成永久排名。',
  '基金申赎、经理交易、基金持仓与BOP portfolio flow覆盖和口径不同。',
  '事件标签、危机、因果影响、政策效果与福利是五个独立结论。',
  '本页全部数值实验为AUTHOR-SYN；observed、PIT、causal、prediction、OOS、trading与production均未取得。',
] as const;

export const emCapitalFlowInterfaces = [
  ['3.21 Capital Flow国内入口', '接收具体资产／负债腿、银行／基金／企业入口与现金时钟语义。', '不继承27个入口机制的SYN数值、审稿身份或实证资格。'],
  ['4.01 BOP / IIP', '接收居民原则、金融账户方向、交易—估值—头寸桥和来源符号。', '不重讲完整复式记账；gross不得改写为turnover。'],
  ['4.05 Global Dollar Funding', '接收entity/currency/horizon、hedge与price–quantity–access。', '不读取其SYN cash legs或把美元proxy当shock。'],
  ['4.06 Global Banks', '接收typed credit edge、residence/nationality和供需证据上限。', '不重做银行网络识别；集团总量不覆盖目的地。'],
  ['4.07 Global Financial Cycle', '接收global state、candidate driver、country/asset loading与local residual。', '不继承AUTHOR-SYN数值、固定EM beta或因果资格。'],
  ['4.09 Trilemma / Dilemma', '输出流量方向、工具、币种、期限、投资者基础、缓冲与政策状态。', '不提前回答政策自主、CFM/MPM/FXI效果或福利最优。'],
  ['4.20 Safe-haven Flow', '输出居民／非居民方向、边际吸收者和driver-conditioned flow。', '不把流入资产自动命名safe haven。'],
  ['4.21 Contagion vs Common Shock', '输出基金／银行typed pipes、共同输入、时序与feedback候选。', '不把共动或循环图直接称为传染。'],
  ['7.10 Cross-asset State', '输出经济体×工具×方向×状态的loading与local residual。', '不输出未经验证的国家分数。'],
  ['7.15 Regime / Warning', '输出实时surge/stop/flight/retrenchment版本、阈值和事件前暴露。', '不输出危机概率，除非下游独立验证。'],
  ['7.17 Causality / 7.28 A股接口', '输出供需竞争解释、暴露向量、clock和evidence axes。', '不输出因果、OOS、交易或生产信号。'],
] as const;

export const emCapitalFlowInvariants = [
  '每次使用EM都声明样本宇宙与异质维度。',
  '居民身份不以国籍、上市地或集团母公司替代。',
  '资产腿与负债腿分别保存，不先做净额抵消。',
  '来源符号与教学显示符号同时保存。',
  'gross inflow/outflow不称逐笔未净成交turnover。',
  'transaction、position、valuation与other change分栏。',
  '头寸端点差不冒充当期交易。',
  'unknown、未报告、未发布和0不得互换。',
  '负值、偿还、销售与方向含义由护照决定。',
  '流量期间、到期时点和统计发布日期分别保存。',
  '日度基金流不得机械相加到季度BOP。',
  'FDI不预设稳定、安全或生产性。',
  'portfolio不预设热钱或二级市场用途。',
  '银行／其他投资内部工具不得视为同质。',
  '功能分类、工具、持有人部门和境内融资路线是不同轴，不得混成一个组成向量。',
  '每个AUTHOR-SYN融资单位只能进入一个已声明的互斥桶。',
  '总量稳定时仍保存完整组成向量。',
  '路线定义之外的附加属性全部匹配时，只能报告这些字段匹配，不能称合同全面等价。',
  '附加属性unknown不等于no，也不允许输出不匹配结论。',
  '覆盖现金超过到期额时报告surplus，不把合法超额覆盖写成STOP。',
  'push与pull不是互斥二元原因。',
  'VIX、美元、美债和全球因子保持candidate/proxy身份。',
  'pipes包含投资者和市场结构，不作为残差桶。',
  'loading按经济体、工具、方向、状态版本化。',
  '样本均值不生成永久国家排名。',
  'local residual不自动等于已识别本地shock。',
  '外国销售必须有边际吸收者。',
  '价格、数量与融资access分别保存。',
  '外国持仓下降不自动等于销售。',
  '汇率、收益率、储备和成交量不能相加。',
  '外币债总额不等于未对冲净敞口。',
  '本币债不等于无全球美元风险。',
  '自然对冲与金融对冲分别记录。',
  '对冲终值与保证金／展期现金时钟分开。',
  '原始期限、剩余期限与未来偿债表不混用。',
  '储备总额不等于私人主体可用现金。',
  '集团总量不得覆盖目的地重配。',
  '离岸发债公告不证明资金已回流本地。',
  '贷款数量下降不自动称供给收缩。',
  '基金申赎、经理交易与估值分开。',
  '基金样本不代表完整BOP portfolio flow。',
  '基准公告、实施与再平衡日期分开。',
  '事件阈值只使用当时可知信息。',
  'surge/stop属于非居民腿，flight/retrenchment属于居民腿。',
  '事件标签不等于危机或因果shock。',
  '正反馈与负反馈都必须有主体、时序和约束。',
  '储备存量变化不等于等额FXI。',
  '政策反应、因果效果、自主性和福利分开。',
  'AUTHOR-SYN、双审与构建都不生成现实证据资格。',
  'observed、PIT、causal、prediction、OOS、trading、production逐轴冻结。',
] as const;
