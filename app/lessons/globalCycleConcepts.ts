import type { GlobalCycleSourceId } from './globalCycleReferences';

export type GlobalCycleFormula = {
  kind: 'definition' | 'measurement' | 'estimation' | 'author-syn';
  expression: string;
  variables: readonly { symbol: string; meaning: string }[];
  explanation: string;
  stopRule: string;
};

export type GlobalCycleConcept = {
  id: string;
  label: string;
  title: string;
  question: string;
  intuition: string;
  actors: string;
  constraints: string;
  behavior: string;
  transmission: string;
  feedback: string;
  formula?: GlobalCycleFormula;
  counterexample: string;
  evidenceBoundary: string;
  interfaces: { from: string; to: string };
  sourceIds: readonly GlobalCycleSourceId[];
};

const globalCycleConceptDefinitions: readonly GlobalCycleConcept[] = [
  {
    id: 'global-cycle-mechanism-01',
    label: 'OBJECT / STATE IS NOT SHOCK',
    title: '“全球金融周期”先是一个待测的共同状态，不是一个已经知道来源的全球冲击。',
    question: '看到多国股票同涨、信用利差同收窄，就能说“美国宽松制造了全球risk-on”吗？',
    intuition: '把世界市场想成一间同时亮起许多灯的楼。灯一起亮说明存在共同成分的可能，却还不知道是总电源、日照、楼内活动，还是多个房间同时收到各自消息。Global financial cycle（GFCy）用于描述跨国资产价格、资本流、信用和风险承担的共同波动；risk-on/risk-off只是方向性标签；shock是外生或结构性创新；crisis是损失与市场功能严重受损的事件。四者不能互换。',
    actors: '观察对象包括不同国家的股票、信用、汇率、商品、资本流、银行与非银中介；可能驱动者包括主要经济体的货币政策、增长信息、风险承载能力、美元融资与地缘事件；本地央行、财政当局、投资者和借款人又会改变落地结果。共同状态没有人格，也不“决定”市场。',
    constraints: '至少要声明资产集合、国家集合、币种、频率、样本窗、标准化、缺失值、时区与数据vintage。没有这些护照，“全球”可能只是一组美国或发达市场资产，“周期”也可能只是一次高波动事件。共同状态不能在被识别之前被命名为货币政策冲击、风险偏好或美元短缺。',
    behavior: '研究者先问是否存在稳定的共同成分，再把候选驱动、传导渠道和本地过滤分别列出。市场参与者则可能在同一时点对折现率、现金流、保证金与风险预算作出不同反应，表面同向不代表内部理由相同。',
    transmission: '可验证链条应写成：有护照的观测面板 → 样本内共同成分与本地残差 → 候选驱动 → Treasury、美元、银行与风险承载渠道 → 本地结果。任何一段缺失，都只能停在相应证据等级。',
    feedback: '资产下跌可收紧保证金和风险限额，迫使再平衡并令共同成分更强；反过来，政策回应与本地买盘也可削弱同步。反馈会改变下一期状态，却不能倒过来证明最初冲击的身份。',
    counterexample: '美国强劲就业意外可令美债收益率上升，同时全球股票上涨、信用利差收窄；同一个“收益率上升”既可能来自紧缩冲击，也可能来自更强现金流预期。若先贴risk-off标签，就会把相反机制混成一件事。',
    evidenceBoundary: 'Handbook综述与ReStud论文支持广泛共同运动及特定美国政策冲击的样本结果；Cerutti等显示资本流中的平均解释度可能有限。三类证据共同要求先描述、再识别，而不是否认或神化全球周期。',
    interfaces: { from: '接收3.13的本地金融条件语义与4.04–4.06的候选渠道；不读取上游author-SYN数字。', to: '向全部后续单元交付state/shock/channel/crisis四分法。' },
    sourceIds: [1, 2, 4, 6, 10],
  },
  {
    id: 'global-cycle-mechanism-02',
    label: 'PANEL / COMPARABILITY BEFORE CORRELATION',
    title: '共同运动从可比面板开始：不同币种、收盘时刻、收益定义和vintage会制造或掩盖同步。',
    question: '为什么把纽约收盘、东京收盘和伦敦月末价格直接排成一张相关矩阵可能是错的？',
    intuition: '比较一群跑者的速度，必须先统一距离和计时窗。全球资产面板也一样：本币收益与美元收益回答不同问题；日本周一收盘可能尚未看到美国周一消息；债券总回报、收益率变化和信用利差变化也不是同单位。相关系数计算容易，建立同一信息集却困难。',
    actors: '交易所和数据商定义时间戳与价格，指数提供者决定再投资与币种，统计机构发布可修订流量，研究者选择样本与变换。投资者实际可以在重叠交易时段、次日开盘或月末再平衡，因此观测时钟必须匹配机制时钟。',
    constraints: '最小observation passport要保存seriesId、provider、assetClass、jurisdiction、currency、unit、transformation、observationTime、releaseTime、retrievedAt、vintage、timezone、frequency、missingPolicy、signConvention和sampleUniverse。禁止把事后修订流量与当时可见价格当成同一PIT面板。',
    behavior: '先决定研究问题和信息时点，再进行币种换算、总回报构造、同步或先后反应（lead–lag）排列。若市场不开盘、报价失真或数据缺失，要保留null与交易日原因，不能前向填充成“没有变化”。',
    transmission: '错误时钟会把美国消息的次日亚洲反应误写成同时冲击；错误币种会把本币资产回报和汇率合成效应混在一起；错误vintage则把未来修订的信息倒灌进历史因子。',
    feedback: '研究结论常反过来形成风险指标与仓位输入；若面板护照错误，伪同步会进入模型、触发共同再平衡，再制造真实交易反馈。数据治理因此不是后台细节，而是系统的一部分。',
    formula: {
      kind: 'measurement',
      expression: 'zⱼ,t = (xⱼ,t − μⱼ,train) / σⱼ,train',
      variables: [
        { symbol: 'xⱼ,t', meaning: '有完整护照的第j个观测；其收益/利差方向已经声明' },
        { symbol: 'μⱼ,train / σⱼ,train', meaning: '只用声明训练窗估计的均值与标准差' },
        { symbol: 'zⱼ,t', meaning: '相对自身训练历史的标准化异常度，不是经济福利单位' },
      ],
      explanation: '标准化让不同单位可进入共同因子估计；它不会修复错时钟、错币种或数据修订，也不能跨不同训练窗直接比较。',
      stopRule: 'σ为0、训练窗不足、未来样本泄漏、方向/币种/时钟未知时输出null/STOP，不补0。',
    },
    counterexample: '美国股市周五下跌，亚洲市场周一才反应。按同一日历日期配对可能得到低相关；把亚洲周一对齐美国周五又可能得到高相关。两者都不是“真相”，而是不同信息时钟，必须先声明。',
    evidenceBoundary: '因子模型文献支持先标准化并保存大面板；它不替代具体市场微观结构、实时数据库或跨时区识别。',
    interfaces: { from: '接收T08时间尺度、3.13时钟与上游字段语义。', to: '向4.12 lead–lag和7.10状态估计交付可审计面板。' },
    sourceIds: [1, 2, 4, 19],
  },
  {
    id: 'global-cycle-mechanism-03',
    label: 'LATENT FACTOR / SAMPLE-DEPENDENT SUMMARY',
    title: '共同因子是对所选面板共同方差的压缩：它没有天然单位、固定符号或唯一经济名字。',
    question: '第一主成分很强，是否就等于“全球风险偏好”被观测到了？',
    intuition: '把许多资产曲线压成一条线，像把多声部合唱压成主旋律。主旋律能帮助概括共同变化，却不知道谁在指挥、歌词是什么，也可能随加入新声部而改变。主成分分析（PCA）或动态因子模型（DFM）寻找共同变化，但二者不是同一个估计式；“风险偏好”仍是需要额外识别的经济解释。',
    actors: '研究者选择面板和估计方法；每个资产由loading连接共同因子；本地或资产特有事件进入residual。交易者可能把发布的因子当风险指标，但指标使用者不应忘记它是模型产物。',
    constraints: '因子存在尺度与符号不识别：f乘−1、全部loading也乘−1，拟合完全相同。结果还依样本范围、标准化、缺失处理、频率、窗口、因子数与实时重估。必须登记sign anchor、universe和version。',
    behavior: '估计后要同时报告loading、explained variance、残差、稳定性和替代面板；不能只展示一条漂亮曲线。若增加信用或商品后第一因子含义改变，应视为模型对象改变，而不是市场突然改变。',
    transmission: '共同因子通过loading映射到各资产；loading不是永久beta，更不是政策传导系数。样本内共同部分可作为后续driver研究的被解释变量，但不能倒置为结构冲击。',
    feedback: '当大量机构使用相似因子做风险预算，统计摘要可能成为仓位共同输入，进而增强下一期共同运动；这是一条待测的内生反馈，而不是PCA数学自动证明。',
    formula: {
      kind: 'estimation',
      expression: '静态单因子／PCA教学特例：zⱼ,t = λⱼ f_t + uⱼ,t；f_t = w′z_t',
      variables: [
        { symbol: 'f_t', meaning: '样本内潜在共同因子，必须有版本和符号锚' },
        { symbol: 'λⱼ', meaning: '冻结面板、窗口与估计规则下资产j的loading；本式先把它视为固定' },
        { symbol: 'uⱼ,t', meaning: '模型未解释的本地/资产特有部分，不等于噪声或传染' },
      ],
      explanation: '这里故意只写静态教学特例：PCA的权重w寻找冻结样本中的方差方向。DFM还可加入因子动态、滞后观测或状态空间滤波；若loading随时间变化，则必须另写局部PCA、状态方程或w_t的估计规则，不能把三类模型塞进同一个等号。',
      stopRule: 'universe、标准化、窗口、缺失规则、符号锚或版本缺失时，不输出“全球因子”；若声称动态或时变loading却没有独立方法和不确定性，也STOP。',
    },
    counterexample: '在只含全球股票的面板中，第一因子可能高度像全球股市；加入大宗商品、信用和汇率后，权重和方向改变。两条曲线都可能统计有效，却不是同一个可无条件拼接的对象。',
    evidenceBoundary: 'Miranda-Agrippino与Rey在特定大面板中找到显著单一共同因子；Cerutti等在资本流面板中得到较低解释度。差异可来自对象、频率、样本与方法，不构成简单真假裁决。',
    interfaces: { from: '接收已标准化且有护照的面板。', to: '向7.10交付factor、loadings、residual、version和uncertainty，而不是driver标签。' },
    sourceIds: [1, 2, 4, 19],
  },
  {
    id: 'global-cycle-mechanism-04',
    label: 'LOADINGS / EXPLAINED SHARE / RESIDUAL',
    title: '同一个全球状态通过不同loading进入各国：弱响应、反向响应和大本地残差都与共同因子共存。',
    question: '如果全球因子下降，为什么某国股票仍可上涨，另一国货币却大跌？',
    intuition: '同一阵风吹过，帆的朝向、面积和绳索决定船怎样动。因子是风的共同部分，loading是暴露，本地冲击是潮流与舵。一个国家在某个时点反向，不足以否定全球共同成分；所有国家同向，也不意味着暴露完全相同。',
    actors: '全球投资者、国内投资者、银行、企业和政策机构共同决定实际loading；外币债务、出口收入、对冲、市场深度、指数权重、外国持有、本地存款与政策可信度都是候选过滤器。',
    constraints: 'loading由估计模型和样本决定，可能随危机、法规、投资者结构与币种构成变化。explained variance是所选面板内的统计份额，不是经济福利、资本损失或因果贡献。残差也可包含遗漏的区域因子和测量误差。',
    behavior: '分析时把“共同部分”“本地残差”“估计误差”三栏分别报告，再用主体暴露解释候选异质性。不能按单日收益给国家固定贴上“高beta”或“避险”。',
    transmission: '共同状态乘以loading形成一阶映射，本地政策和资产负债表再改变最终结果。时间变化的loading意味着同样的全球冲击在不同制度和脆弱性状态下产生不同幅度，甚至不同符号。',
    feedback: '本地大跌可改变指数权重、保证金和资本流，反过来影响下一期全球因子估计；因此cross-section并非被动终点，而可能回写共同状态。',
    formula: {
      kind: 'measurement',
      expression: 'Explained variance（EV₁）= eigenvalue₁ / trace(Σ)',
      variables: [
        { symbol: 'eigenvalue₁', meaning: '第一共同方向在声明协方差矩阵中承载的方差' },
        { symbol: 'trace(Σ)', meaning: '所选标准化面板的总方差' },
        { symbol: 'EV₁', meaning: '样本内解释份额；不是结构冲击贡献或预测R²' },
      ],
      explanation: 'EV₁随面板、窗口和标准化而变；它适合描述压缩程度，不适合跨不同设计直接排名。',
      stopRule: '协方差矩阵版本、面板范围或标准化不一致时禁止比较EV₁；样本过短或缺失规则不明时STOP。',
    },
    counterexample: '全球risk-off为−2单位，A国loading为0.8但有+2单位本地改革消息，最终可上涨；B国loading仅0.3却有外币融资压力，最终可能跌得更多。观察最终收益无法单独反推共同因子。',
    evidenceBoundary: 'IMF和相关研究支持跨国敏感度显著异质并可随时间变化；没有来源支持本课author-SYN暴露系数或永久国家排名。',
    interfaces: { from: '接收factor estimate与本地主体暴露。', to: '向4.08交付有时钟的country/asset loading与local residual，不输出脆弱性排名。' },
    sourceIds: [4, 6, 9, 12],
  },
  {
    id: 'global-cycle-mechanism-05',
    label: 'PROXY / TRIANGULATION NOT EQUALITY',
    title: 'VIX、美元、信用利差、美债与中介杠杆是互补诊断，不是同一个风险原语的五次证明。',
    question: '为什么VIX升高常与risk-off同现，却不能被定义成全球金融周期？',
    intuition: '医生不会用体温代替整套诊断。VIX是由S&P 500指数期权（SPX options）报价构造、恒定30个日历日并按年化表达的预期波动率；美元是相对价格；普通信用利差可含预期损失、流动性和风险补偿，超额债券溢价（EBP）则是模型估计的、超出预期违约损失解释部分；美债收益率还含政策预期、期限溢价和增长通胀信息。它们能互相印证，也能各自偏离。',
    actors: '期权投资者形成VIX，外汇参与者形成美元价格，债券投资者形成收益率与利差，银行/基金决定杠杆和资本流。不同市场的主体、合约、营业时钟和约束不同，不能把同日共动当成一个重复观测。',
    constraints: '每个proxy要有口径、方向、期限、币种、资产范围和vintage。还要做overlap audit：全球股票下跌既进入风险资产因子，也可能推高VIX；若两者同时当独立证据，会重复计算同一市场原语。',
    behavior: '先定义待辨别的状态，再看多市场是否给出一致但非重复的信息；出现分歧时保留分歧，不用加权平均把它抹平。一个proxy失效不等于整个机制不存在，多个proxy同向也不自动识别driver。',
    transmission: '风险承载收缩可同时压低风险资产、扩大信用利差、推高VIX并推动美元；但正向美国增长、供给冲击或安全资产供需也可产生部分相同组合。多市场三角验证的价值在于缩小解释集合。',
    feedback: 'VIX等代理进入在险价值（Value at Risk, VaR）、期权对冲与风控规则后，本身会影响仓位；美元与利差也影响抵押和资本。指标既可测量状态，也可能成为传导节点，必须用时间顺序区分。',
    counterexample: 'VIX可在美国股市平静时保持较低，但美元融资access、某类信用或新兴市场外币债务已经恶化；反之，一次美国股票事件可推高VIX，却未形成广泛资本流与信用收缩。',
    evidenceBoundary: 'Cboe只定义VIX的期权口径；全球周期论文记录其相关性，Fed材料则把VIX、GFC因子、信用利差和EBP并列。任何来源都没有把这些量定义为同义词。',
    interfaces: { from: '接收4.04收益率护照、4.05 price/quantity/access和市场代理。', to: '向7.10交付去重后的proxy diagnostic vector与overlap graph。' },
    sourceIds: [2, 3, 7, 17, 20],
  },
  {
    id: 'global-cycle-mechanism-10',
    label: 'RISK-BEARING CAPACITY / ENDOGENOUS AMPLIFICATION',
    title: '风险承载能力把价格变化变成资产负债表反馈：冲击之后的同步可以由杠杆、保证金和风险限额内生放大。',
    question: '为什么一个并不巨大的价格冲击会演化成跨资产、跨国家的共同去杠杆，并反向影响最初的中心市场？',
    intuition: '若持仓下跌只改变纸面财富，传导可能有限；若它同时提高保证金、触发VaR、降低抵押价值或冲击资本比率，投资者会卖出别的资产补现金。于是最初只在一处的冲击，通过共同中介和共同约束扩散成广泛risk-off。',
    actors: '全球银行、broker-dealer、对冲基金、开放式基金、保险与养老金拥有不同负债和约束；清算机构、prime broker、风险委员会与投资者赎回决定何时需要现金或降风险。共同所有权与相似模型使不同资产被一同处理。',
    constraints: '杠杆、保证金（margin）、抵押折扣（haircut）、赎回和监管资本不是同一种约束；方向与速度也不同。观察总杠杆下降不能单独识别主动风险偏好、被动保证金调整还是资产价格分母效应。机构级和头寸级数据通常不完整。',
    behavior: '资产下跌后，中介可能卖出流动资产、减少融资、提高客户抵押折扣、削减贷款或对冲波动。被动投资者也可能因赎回卖出；长久期机构有时反而再平衡买入。相同初始冲击因此可被放大、缓冲或迁移。',
    transmission: '价格 → 净值/保证金/风险指标 → 资产出售与融资收缩 → 市场深度下降/价格再跌，是典型正反馈；现金买家、央行流动性与逆向再平衡可形成负反馈。全球共同因子记录结果，不自动识别哪一种约束在起作用。',
    feedback: '反馈强度会随市场深度和共同仓位变化。外国市场损失还可经安全资产需求、美元、中心国中介净值和政策反应回到美国等中心市场，这一reverse spillover属于闭环候选而非预设单向箭头。若资产负债表有缓冲，同样冲击也可能迅速吸收。',
    counterexample: '养老金在股票下跌后为恢复战略权重买入股票，形成负反馈；把所有机构都设定为VaR卖家会夸大同步，也忽略负债驱动和长期再平衡。',
    evidenceBoundary: '全球周期与跨境银行文献支持中介杠杆和风险承担通道；它们不提供本课author-SYN反馈系数，也不闭合所有机构的共同资产负债表。',
    interfaces: { from: '接收2.06中介资产负债表、4.05融资与4.06信贷边。', to: '向7.11流动性螺旋与7.16网络层交付typed feedback candidates。' },
    sourceIds: [1, 2, 8, 9, 17],
  },
  {
    id: 'global-cycle-mechanism-06',
    label: 'US DRIVER / POLICY IS ONE CANDIDATE',
    title: '美国冲击需要分解：货币政策意外、增长信息、期限溢价与市场功能可以给出相同利率方向。',
    question: '美债收益率跳升且全球资产下跌，怎样判断是Fed紧缩冲击而非美国好消息或期限溢价变化？',
    intuition: '看到车速下降并不能知道司机刹车、上坡还是逆风。美国利率变化也可能来自政策路径、经济新闻、通胀、期限溢价、供给和流动性。只有外生工具、窄事件窗、丰富信息集或其他可辩护限制，才可能把某一创新解释成局部结构冲击。',
    actors: 'FOMC、财政部、美国数据发布者、全球投资者与中介共同影响美债和美元。外国央行会响应，本国增长和通胀也可同时变化，形成共同反应和反向溢出。',
    constraints: '高频货币政策surprise要求市场在窗口内正确区分政策与信息效应；事件可能重叠，工具强度和外推期也有限。向量自回归（VAR）依变量、先验与识别排序。任何结果都属于特定样本和局部反事实。',
    behavior: '紧缩意外通常提高折现率并可能收紧全球中介；正向增长消息可同时提高收益率和风险资产；期限溢价或市场功能冲击又有不同组合。研究设计应先预测跨市场符号，再看数据能否区分。',
    transmission: '美国冲击可经全球定价曲线、美元、资产组合、银行/非银杠杆和贸易需求外溢；每条渠道有自己的时钟和本地filter，不能用“Fed→世界”单箭头替代。',
    feedback: '外国风险资产和美元变化会反过来影响美国金融条件、通胀与政策反应；若忽略反向反馈，低频估计可能把共同响应误归为单向美国驱动。',
    formula: {
      kind: 'estimation',
      expression: 'responseᵢ,t+h = βᵢ,h(s_t) · identifiedShock_t + domesticᵢ,t+h + εᵢ,t+h',
      variables: [
        { symbol: 'identifiedShock_t', meaning: '经明确识别设计获得、非普通利率变化的局部创新' },
        { symbol: 'βᵢ,h(s_t)', meaning: '国家/资产i在状态s、期限h下的局部响应' },
        { symbol: 'domesticᵢ,t+h', meaning: '本地同时冲击与政策响应，不能强行并入beta' },
      ],
      explanation: '只有shock身份可信时，beta才有局部因果含义；状态依赖使同一shock的效果不固定。',
      stopRule: '若只有普通利率变化或同时新闻未处理，改称driver candidate，不报告causal beta。',
    },
    counterexample: '美国通胀低于预期可令美债收益率下降、全球股票上涨；一次金融稳定担忧也可能令收益率下降但全球股票下跌。只看收益率方向会把风险来源倒置。',
    evidenceBoundary: 'ReStud与Fed IFDP提供特定识别下美国政策/新闻的全球反应；Powell演讲与反论研究提醒美国政策重要性可能被夸大。结论必须随工具、窗口和样本保存。',
    interfaces: { from: '接收4.04的TreasuryDriverClass候选而非事实标签。', to: '向4.09交付identified shock或candidate状态及其证据上限。' },
    sourceIds: [2, 3, 5, 10, 14, 16],
  },
  {
    id: 'global-cycle-mechanism-07',
    label: 'DOLLAR / PRICE, FUNDING, EXPOSURE',
    title: '美元渠道至少有三层：美元相对价格、美元融资可得性与主体外币暴露，三者方向不能互相替代。',
    question: '为什么美元升值常伴随全球金融收紧，却不意味着所有非美主体都受损？',
    intuition: '美元升值是一项相对价格；美元funding stress关心具体实体能否按期取得美元现金；currency mismatch关心资产、负债、收入和对冲的净暴露。三者可以共同变化，也可以分离。出口商有美元收入、央行有美元资产、充分套保机构与未套保债务人的反应会不同。',
    actors: '美元借款企业、全球银行与非银中介、出口商、资产管理人、央行和做市商都持有不同币种与期限结构。外汇掉期（FX swap）与跨币种基差（cross-currency basis）连接现金与对冲，美元债券和银行贷款则连接信用。',
    constraints: '必须保存币种、法律实体、期限、对冲比率（hedge ratio）、收入币种、融资价格/数量/可得性（price/quantity/access）和结算时钟。美元指数（DXY）、广义美元、跨币种基差、BIS全球流动性指标（GLI）或互换额度存在都不是实体现金缺口的充分统计量。',
    behavior: '美元升值可提高未对冲美元债务负担并压缩银行风险承载，也可能增加美元收入出口商的本币现金流；充分对冲者还可能因margin timing短期承压。中介会调整跨境信贷、证券与FX swap报价。',
    transmission: '美元价格变化通过资产负债表与信用风险进入银行/非银容量，再影响资产价格和投资；美元融资access恶化则可独立于现货汇率发生。最终方向取决于净暴露和时钟。',
    feedback: '去杠杆与安全资产需求可推高美元，美元再压低风险承载，形成正反馈；央行流动性、自然对冲和美元收入可缓冲。',
    counterexample: '同样10%的美元升值：未套保美元债务人负担上升；拥有美元销售收入的出口商本币收入增加；充分对冲基金终值风险较低但可能收到保证金通知。把三者都标为−10会丢掉机制。',
    evidenceBoundary: 'BIS与IMF研究支持美元、跨境信用和投资的样本关系；不支持固定弹性、个体方向或“美元上涨=全球短缺”的定义。',
    interfaces: { from: '接收4.05的entity/currency/horizon与price–quantity–access语义，绝不继承其SYN缺口。', to: '向4.08交付currency exposure与funding access维度。' },
    sourceIds: [8, 9, 16, 18, 20],
  },
  {
    id: 'global-cycle-mechanism-08',
    label: 'GLOBAL BANK / ONE CHANNEL AMONG MANY',
    title: '全球银行可以同步收紧多个目的地，但一条银行信贷边既不是全球共同因子，也不覆盖所有资本流。',
    question: '几家全球银行同时缩减跨境贷款，何时能解释多国金融条件共同收紧，何时只是局部重配？',
    intuition: '4.06追踪一条贷款从母行、实体、路线到借款人；4.07把许多已类型化的边放到同一截面，问是否出现共同变化。边是传播渠道，因子是对许多结果的统计概括。银行可以把资金从A国移到B国，使集团总额稳定而目的地分化；证券基金和企业债又可能走完全不同路线。',
    actors: '全球母行、分行/子公司、当地银行、企业借款人、证券基金和债券投资者构成平行网络。Home/host政策与实体约束决定银行边，基金赎回和指数权重决定证券边。',
    constraints: '不得从聚合claims推导贷款供给，也不能把LBS/CBS、存量/流量、直接跨境/当地附属路线混合。只有多个目的地、币种与产品在共同shock clock下的反应，才可测试共同银行渠道。替代融资必须另测。',
    behavior: '母行受冲击后可跨目的地削减、缓冲或重配；当地借款人会转向本地银行、债券或内部现金。若银行融资数量下降而总融资不变，只能说观测到银行融资变化且被其他来源抵消；银行供给边仍需贷款要约、共同借款人或外生母行冲击等设计识别。',
    transmission: '共同母行约束 → 多实体/目的地贷款要约 → 借款人融资与资产价格，是候选链；证券组合和美元funding可与它并行。全球因子只能概括共同结果，不能替代逐边证据。',
    feedback: '目的地损失回到银行资本并影响下一轮配置；同时其他市场价格与赎回会改变银行抵押和融资。闭环需要跨数据集实体链接，单一聚合时间序列无法证明。',
    counterexample: '集团对外总债权不变，但从脆弱A国撤回20并向稳健B国增加20。全球银行规模平稳掩盖A国收紧；若只看A国又会误写成全球共同收缩。',
    evidenceBoundary: 'Bruno–Shin与全球银行文献支持银行杠杆和跨境流渠道；本课不重复4.06的LBS/CBS与借款人识别，也不继承其审稿或SYN状态。',
    interfaces: { from: '只接收4.06的typed credit edge、clock、response和evidence ceiling。', to: '向4.08/7.16交付银行渠道候选与未覆盖的替代网络。' },
    sourceIds: [1, 2, 8, 18],
  },
  {
    id: 'global-cycle-mechanism-09',
    label: 'LOCAL FILTERS / BUFFER, AMPLIFY, REVERSE',
    title: '本地结构不是噪声：汇率、错配、市场深度、投资者基础与政策可以缓冲、放大或反转同一全球状态。',
    question: '为什么同一轮全球risk-off对两个资本开放程度相近的国家产生完全不同的信用和汇率结果？',
    intuition: '同样的雨落在不同地面：排水、坡度和土壤决定积水。全球状态只是上游输入；本地外币错配、固定或浮动汇率、金融市场深度、外国投资者份额、本地稳定融资、储备、政策可信度和宏观审慎共同构成过滤器。',
    actors: '国内央行和监管者、政府、银行、企业、居民与外国投资者分别控制政策反应、负债币种、对冲、资本缓冲和投资组合。不同主体可能相互抵消。',
    constraints: '汇率制度标签不能替代实际干预和市场深度；资本管制法条不能替代执行与规避；储备总量不能替代可动用币种/期限；宏观审慎工具方向与适用部门不同。政策变量常内生于脆弱性。',
    behavior: '浮动汇率可通过价格调整吸收部分冲击，也可能在高美元债务下恶化资产负债表；本地存款与长久期投资者可缓冲外资撤回；可信政策可减少风险溢价，顺周期加息也可能压低国内需求。',
    transmission: '最终结果是全球输入、国家暴露、本地政策反应与国内冲击的联合函数。跨国差异因此是机制信息，而不是应被平均掉的误差。',
    feedback: '成功缓冲降低共同因子的后续loading；失败或政策顺周期则放大外流、贬值和信用收缩。政策预期也会在冲击到来前改变仓位。',
    counterexample: '两个国家都有开放资本账户：A有本币长期债务、深厚本地投资者基础和可信浮动；B有短期美元债务、浅市场和隐性盯住。相同美元冲击下，A可主要经汇率吸收，B可能触发融资和信用反馈。',
    evidenceBoundary: 'IMF与trilemma文献支持暴露异质和政策条件性；它们不提供通用工具排名，也不支持从一次缓冲结果推断永久韧性。',
    interfaces: { from: '接收3.13主体特定金融条件与本课全球state。', to: '向4.09交付pass-through和制度暴露，不提前给政策福利答案。' },
    sourceIds: [12, 13, 14, 15, 16],
  },
  {
    id: 'global-cycle-mechanism-11',
    label: 'REGIME DRIFT / TRANSPORTABILITY',
    title: '全球周期的loading、代理关系与主导渠道不是永久参数：结构改变后必须重新估计，而不能搬运旧阈值。',
    question: '为什么危机前有效的VIX—美元—银行杠杆关系，危机后可能减弱或换成另一条渠道？',
    intuition: '交通网络修了新路，原先最拥堵的路口就不再代表全城。危机后监管、央行工具、银行资本、非银行金融、指数投资和主要融资货币的角色变化，会重写同一proxy与潜在状态的关系。本节只处理“旧参数能否搬到新时期”这个中心问题；反向溢出已经放入上一节反馈闭环。',
    actors: '全球银行、资产管理人、保险养老金、清算和市场基础设施随法规与技术改变；美国、欧洲、中国及其他大型经济体的政策和增长权重也会变化。研究者必须把每个版本绑定到制度、样本和数据vintage。',
    constraints: '固定全样本beta会把结构断点平均化；滚动估计又受小样本和端点噪声影响。中心变量的预测力可来自共同第三因素。任何regime标签都要有起止、判据、实时可得性与重新估计规则。',
    behavior: '研究者比较危机前后、银行与非银、不同货币和区域因子，保留模型不稳定；政策制定者关注传导迁移，而不是只盯旧代理。',
    transmission: '结构变化可令银行信贷、基金赎回、美元债券或本地融资在不同时期承担不同权重，因此同一VIX、美元或银行杠杆读数不再对应同一个latent state；运输旧系数前必须通过稳定性和断点检验。',
    feedback: '模型被广泛采用会改变行为，监管与后备安排也改变压力响应；每次危机后的制度学习令下一轮周期结构不同，所以重估规则本身必须进入系统状态。',
    counterexample: '全球银行危机后资本和流动性监管更严格，银行渠道减弱，但开放式基金赎回与美元债券渠道变强。旧模型看到银行杠杆关系下降，不能据此断言全球周期消失。',
    evidenceBoundary: 'Handbook和BIS国内/全球周期研究支持传导随危机与结构变化；它们不提供永恒断点日期或唯一中心货币。',
    interfaces: { from: '接收多期factor/proxy/channel版本。', to: '向7.07 regime switching和7.10状态估计交付漂移警告与重估规则。' },
    sourceIds: [1, 6, 14, 17, 20],
  },
  {
    id: 'global-cycle-mechanism-12',
    label: 'COMMON SHOCK / CONTAGION / IDENTIFICATION',
    title: '同期相关无法区分共同冲击、同步本地冲击与直接传染；全球周期测量必须止步于它能证明的位置。',
    question: '两国股市相关性在危机时从0.3升到0.8，是否证明A国“传染”了B国？',
    intuition: '两间房同时冒烟，可能是共同电路故障，也可能一间着火蔓延到另一间，或两人同时点燃蜡烛。相关性只告诉我们共同变化，不给路径。危机期若共同因子方差相对特质方差上升，或样本按高波动状态条件抽取，未经校正的相关系数也会升高；统一改变量纲本身不会改变相关。直接传染需要超出共同因素与正常连接的额外跨边传播证据。',
    actors: '共同全球冲击、区域/国内同步消息、跨境银行、共同基金持仓、贸易链与信息网络都能产生相关。研究者需要用外生冲击、先后反应（lead–lag）、网络暴露或对照组缩小解释。',
    constraints: '残差相关并不自动等于传染：它可来自遗漏因子、测量误差或同步本地政策。先后反应也可由交易时区造成。类型化连接（typed edge）必须有主体、方向、强度和时钟，不能由价格相关矩阵凭空生成。',
    behavior: '先回归或过滤可观测共同因子，再检验残差是否随预先存在的类型化连接和外生源冲击变化；同时设置能推翻传染叙事的安慰剂/伪检验（placebo）与替代网络。4.07只交付待识别对象，完整判别留给4.21。',
    transmission: '共同冲击可让A、B同时动；直接传染则要求A的创新经已知边在时间上进入B，并超过共同驱动能解释的部分。两种模型可给出相同同期协方差。',
    feedback: '一旦市场将共同下跌解释为传染，风险限额和赎回可能真的创造新的跨资产边；叙事与行为因此会改变后续数据，但不改变初始证据边界。',
    formula: {
      kind: 'measurement',
      expression: 'Cov(xᵢ,xⱼ)=λᵢλⱼVar(f)+λᵢCov(f,uⱼ)+λⱼCov(uᵢ,f)+Cov(uᵢ,uⱼ)',
      variables: [
        { symbol: 'λᵢλⱼ Var(f)', meaning: '声明单因子模型中的共同因子协方差部分' },
        { symbol: '交叉项', meaning: 'λᵢCov(f,uⱼ)+λⱼCov(uᵢ,f)；只有已声明因子与各残差正交时才为0' },
        { symbol: 'Cov(uᵢ,uⱼ)', meaning: '未解释共同变化；仍可含遗漏因子、同步本地冲击或真实边传播' },
        { symbol: 'f / u', meaning: '依所选模型定义，变更因子集合会改变残差' },
      ],
      explanation: '完整式先保留因子—残差交叉项；只有在所选模型或PCA样本投影中明确满足正交条件，才可化为共同项加残差协方差。无论是否化简，残差相关仍需外生源、时序和类型化连接（typed edge）才能进入传染识别。',
      stopRule: '若因子版本、正交条件、时间对齐或网络边未知，只报告观察相关与候选解释，不输出contagion。',
    },
    counterexample: 'author-SYN可以构造两组完全相同的A/B同期相关：一组由同一个f同时驱动，另一组由A滞后一期开启B。没有时序与边数据，仅凭相关无法区分。',
    evidenceBoundary: 'Forbes–Rigobon直接说明异方差会偏置基于相关跃升的传染检验；Bekaert–Harvey–Ng在全球/区域因子与时变beta之后检验额外共动。两者提供识别框架，不允许把任意相关或残差矩阵直接命名传染。',
    interfaces: { from: '接收factor、residual、clock与已知typed edges。', to: '向4.21交付common component、residual covariance、lead–lag候选和证据上限。' },
    sourceIds: [4, 10, 11, 17, 19, 21, 22],
  },
] as const;

const globalCycleConceptOrder = [
  'global-cycle-mechanism-01',
  'global-cycle-mechanism-02',
  'global-cycle-mechanism-03',
  'global-cycle-mechanism-04',
  'global-cycle-mechanism-05',
  'global-cycle-mechanism-06',
  'global-cycle-mechanism-07',
  'global-cycle-mechanism-08',
  'global-cycle-mechanism-09',
  'global-cycle-mechanism-10',
  'global-cycle-mechanism-11',
  'global-cycle-mechanism-12',
] as const;

export const globalCycleConcepts: readonly GlobalCycleConcept[] = globalCycleConceptOrder.map(id => {
  const concept = globalCycleConceptDefinitions.find(candidate => candidate.id === id);
  if (!concept) throw new Error(`Missing 4.07 mechanism definition: ${id}`);
  return concept;
});
