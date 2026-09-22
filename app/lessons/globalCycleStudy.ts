import type { GlobalCycleSourceId } from './globalCycleReferences';

export const globalCycleThesis = {
  statement: 'Global Financial Cycle不是一只“全球恐慌指数”，而是一个需要用有护照的跨国、跨资产面板测量的共同状态：它的样本内共同成分要与代理变量、候选驱动、传导渠道、本地过滤和反馈逐层分开。',
  causalChain: '可比观测 → 共同成分/本地残差 → 候选驱动 → Treasury/美元/银行/风险承载渠道 → 本地过滤后的异质结果 → 资产负债表与政策反馈',
  inequalities: [
    'Common component ≠ identified structural shock',
    'VIX / broad dollar / Treasury yield / basis ≠ global factor',
    'Factor loading ≠ permanent vulnerability rank or causal pass-through',
    'Comovement / residual correlation ≠ contagion',
    'Policy-rate autonomy ≠ full insulation of domestic financial conditions',
    'Double review / successful build ≠ observed, PIT, causal, predictive or production evidence',
  ],
} as const;

export const globalCycleCoreRoute = [
  { time: '00–07分钟', title: '先过八词入口，再拆状态、标签、冲击与危机', conceptIds: ['global-cycle-mechanism-01'], task: '先用2分钟读入口八词，再用四句话分别定义GFCy、risk-on/off、shock与crisis。', exit: '不再把“市场一起跌”写成已知美国冲击。' },
  { time: '07–15分钟', title: '给面板办护照', conceptIds: ['global-cycle-mechanism-02'], task: '锁定资产、国家、币种、收益定义、时区、频率、缺失和vintage。', exit: '能指出错时区、错币种和未来修订怎样制造伪同步。' },
  { time: '15–25分钟', title: '提取共同因子但拒绝命名', conceptIds: ['global-cycle-mechanism-03'], task: '读懂z=λf+u、因子符号和universe依赖。', exit: '知道PCA回答共同方差，不回答谁造成。' },
  { time: '25–33分钟', title: '把loading、解释份额和残差分栏', conceptIds: ['global-cycle-mechanism-04'], task: '用C1手算共同贡献、缓冲与本地冲击。', exit: '能解释高loading为何仍可有较小或反向结果。' },
  { time: '33–41分钟', title: '多市场三角验证先去重', conceptIds: ['global-cycle-mechanism-05'], task: '为VIX、美元、美债、信用和杠杆写独立护照与overlap。', exit: '不把五个相关指标算成五份独立证明。' },
  { time: '41–50分钟', title: '区分美国政策、新闻与期限溢价', conceptIds: ['global-cycle-mechanism-06'], task: '比较两个同样令2Y收益率上升、却令股票/信用不同反应的场景。', exit: '只有识别设计通过时才写causal shock。' },
  { time: '50–60分钟', title: '美元三层分解', conceptIds: ['global-cycle-mechanism-07'], task: '分别登记美元价格、funding access与主体净外币暴露。', exit: '不会从DXY或basis单独推出所有主体的压力。' },
  { time: '60–69分钟', title: '全球银行只是一个typed channel', conceptIds: ['global-cycle-mechanism-08'], task: '把4.06的一条信贷边与4.07的截面共同状态分开。', exit: '能写出集团稳定、目的地分化和替代融资反例。' },
  { time: '69–77分钟', title: '本地过滤器决定落地', conceptIds: ['global-cycle-mechanism-09'], task: '比较外币错配、汇率、市场深度、本地融资和政策响应。', exit: '不再把国家差异当成无关噪声。' },
  { time: '77–85分钟', title: '中介容量闭合反馈', conceptIds: ['global-cycle-mechanism-10'], task: '画价格—保证金/限额—卖出—价格链，加入一条负反馈和一条外围→中心的反向路径。', exit: '不假设所有机构都顺周期卖出，也不把中心→外围当永久单向箭头。' },
  { time: '85–91分钟', title: '代理与loading会随regime漂移', conceptIds: ['global-cycle-mechanism-11'], task: '写出危机前后银行/非银渠道迁移，并列出旧beta可搬运到新时期所需的稳定性检查。', exit: '不使用永久beta或固定VIX阈值。' },
  { time: '91–97分钟', title: '相关不是传染', conceptIds: ['global-cycle-mechanism-12'], task: '用C2比较PCA、proxy、correlation和causal design；只完成M1、M4、K5三题。', exit: '会把measurement、异质传导与causality分开，并把共同冲击、同步本地冲击和直接传染留给不同证据设计。' },
] as const;

export const globalCyclePassportRules = [
  ['01 · State ID / schema', '为每次估计保存不可变stateId、schemaVersion和创建时钟；页面重算不得覆盖旧版本。'],
  ['02 · Series ID / provider', '记录每个序列的标识、提供者与许可边界；名称相同不表示口径相同。'],
  ['03 · Asset class / instrument', '股票总回报、债券收益率、信用利差、FX、资本流、信用量和杠杆分别标识。'],
  ['04 · Jurisdiction / entity', '价格、借款人、持有人、银行国籍与记账地按问题保存，不压成一个country。'],
  ['05 · Currency / numeraire', '本币、美元回报和对冲回报分别构造；报告币种不能替代合同币种。'],
  ['06 · Unit / transformation', 'level、return、log return、bp change、growth、z-score和adverse-score不可混算。'],
  ['07 · Sign convention', '明确正值表示risk-on、stress或价格上升；PCA符号锚只是一项显示约定。'],
  ['08 · Observation clock', '记录市场收盘、事件窗、时区与交易日；跨时区lead–lag不得伪装为同期。'],
  ['09 · Release / retrieval clock', '宏观与资本流需保存发布时间、下载时间和当时可得版本。'],
  ['10 · Vintage / revision', '保存数据vintage与修订标记；最终修订数据不自动具有PIT身份。'],
  ['11 · Frequency / aggregation', '日内、日、周、月、季度的聚合规则与复利方式明确，不把不同频率填成相同。'],
  ['12 · Missing policy', '停牌、休市、未发布和真实零分开；禁止静默前向填充或整行删除。'],
  ['13 · Sample universe', '列明国家、资产、覆盖起止与纳入规则；“全球”只对该universe有效。'],
  ['14 · Standardisation window', '均值/方差只从声明窗口估计；严格PIT不能用未来样本重新标准化过去。'],
  ['15 · Factor method / count', 'PCA、静态或动态因子、因子数、权重和初值全部版本化。'],
  ['16 · Loading / uncertainty', '保存每个资产loading、标准误/后验区间、估计窗与漂移状态。'],
  ['17 · Explained share', '同时保存分子、分母、面板和窗口；不跨不同设计比较一个百分比。'],
  ['18 · Proxy passport', 'VIX、美元、EBP、basis等记录期限、市场、方向、来源和与因子重叠。'],
  ['19 · Driver candidate', 'US policy、US news、term premium、global growth等只能在识别前标candidate。'],
  ['20 · Shock identification', '保存工具、事件窗、relevance、exclusion、同时新闻和局部外推范围。'],
  ['21 · Channel state', 'Treasury、美元、银行、基金与risk-bearing channel分别保存price/quantity/access。'],
  ['22 · Local filters', '外币错配、hedge、本地融资、市场深度、制度与政策响应逐项记录。'],
  ['23 · Gross-flow direction', 'gross inflow、gross outflow、surge、stop、flight、retrenchment与net flow分开。'],
  ['24 · Feedback / edge', '网络边必须有主体、方向、强度、时钟和证据；相关矩阵不能自行生成边。'],
  ['25 · Evidence axes', 'measurement、causal、prediction三轴独立；整条链只取最弱箭头的等级。'],
  ['26 · Output uncertainty', '保留估计不确定性、模型替代和unstable/partial/null，不以点估计冒充事实。'],
  ['27 · Downstream route', '向4.08/4.09/4.20/4.21/7.10传递字段与禁止升级项。'],
  ['28 · Provenance / review', '来源、作者审计、两席独立审稿、浏览器和打印收据分开登记。'],
] as const;

export const globalCycleEntryVocabulary = [
  ['Global Financial Cycle (GFCy)', '跨国资产价格、资本流、信用、风险承担或中介状态中的共同波动研究对象；具体内容依面板与方法。'],
  ['Risk-on / risk-off', '对一组风险资产、融资价格和仓位方向的压缩标签；不是结构冲击名称。'],
  ['Common component', '多个序列在声明模型和样本中共同变化的部分。'],
  ['Latent factor', '不能直接观测、由模型从多序列估计的共同状态。'],
  ['Proxy', '与目标概念有关但不相同的可观测指标；适用性需逐样本验证。'],
  ['VIX', '由S&P 500指数期权（SPX）实时买卖中间报价构造、表示未来恒定30个日历日预期波动率并按年化表达；不等于全球风险偏好。'],
  ['Loading', '序列对潜在因子的统计暴露；依样本、标准化和窗口，非永久因果beta。'],
  ['Local residual', '当前因子模型未解释的部分；可含本地冲击、遗漏因子、测量误差或网络传播。'],
  ['Explained variance', '某因子在声明面板中承载的样本方差份额；不等于政策因果贡献。'],
  ['PCA', '寻找样本方差最大正交方向的线性降维方法。'],
  ['Dynamic factor model', '允许共同因子和观测按时间动态连接的统计模型。'],
  ['Sign anchor', '为展示固定因子正负的约定，例如令其与风险资产回报正相关；不提供经济识别。'],
  ['Driver candidate', '可能产生共同状态的候选变量或冲击，尚未满足结构识别。'],
  ['Identified shock', '在明确设计和假设下提取的局部外生创新；其身份依relevance/exclusion等限制。'],
  ['Information effect', '政策公告同时透露央行对经济的看法，使市场变化不只反映纯政策动作。'],
  ['Risk-bearing capacity', '中介在资本、融资、margin、risk limit和市场深度下持有风险的能力。'],
  ['Global dollar cycle', '美元计价资产、美元汇率、风险和国际资产需求的共同波动框架；不是GFCy的唯一别名。'],
  ['Currency mismatch', '负债、资产、收入或现金腿在币种与期限上不匹配。'],
  ['Gross inflow / outflow', '分别由非居民增减本国资产和居民增减外国资产形成的跨境流动；与net flow不同。'],
  ['Surge / stop', '非居民gross inflow的异常增加/减少。'],
  ['Flight / retrenchment', '居民gross outflow的异常增加/减少。'],
  ['Financial spillover', '一国冲击经价格、融资、贸易或资产负债表影响他国；不要求直接网络传染。'],
  ['Contagion', '超出共同冲击与正常连接所能解释的额外传播命题；需要专门识别。'],
  ['Domestic financial cycle', '以本国信用与房地产等中期共振为核心的周期；与GFCy对象和频率不同。'],
  ['PIT', 'point-in-time，只使用当时已发布、可取得且未被未来修订替换的输入。'],
  ['OOS', 'out-of-sample，模型估计后在未参与拟合的数据上评估。'],
  ['Author-SYN', '作者为教学构造、可手算且不对应现实观测的合成记录。'],
  ['STOP / null', '必要护照或识别条件缺失；不是经济零、没有风险或效应为零。'],
] as const;

export type GlobalCycleCheck = {
  id: string;
  kind: 'M' | 'K';
  title: string;
  question: string;
  options: readonly string[];
  correct: number;
  answer: string;
  trap: string;
  sourceIds: readonly GlobalCycleSourceId[];
};

export const globalCycleChecks: readonly GlobalCycleCheck[] = [
  { id: 'M1', kind: 'M', title: '共同因子不是冲击', question: '第一主成分解释了40%方差，最严谨的结论是什么？', options: ['Fed造成了40%的全球波动', '声明面板与窗口中第一共同方向承载40%样本方差，driver仍待识别', 'VIX必然解释另外60%'], correct: 1, answer: '解释份额是测量结果，不是冲击身份或因果贡献。', trap: '把dimension reduction升级为结构分解。', sourceIds: [2, 4, 19] },
  { id: 'K1', kind: 'K', title: 'C1异质分解', question: 'G=4、E=1.5、B=0.5、L=−1时，author-SYN adverse score是多少？', options: ['2', '3', '5'], correct: 0, answer: '4×1.5×(1−0.5)−1=2。', trap: '漏掉缓冲或把有利本地冲击改成正压力。', sourceIds: [12] },
  { id: 'M2', kind: 'M', title: 'VIX身份', question: 'VIX与全球因子相关0.8，能否把VIX称为全球因子？', options: ['能，相关高即同一对象', '只有VIX超过30时能', '不能；VIX是SPX期权隐含波动率，相关不证明身份、外生性或稳定性'], correct: 2, answer: 'Proxy与latent factor要分别保存，且需overlap audit。', trap: '把代理相关性变成定义等号。', sourceIds: [2, 7, 17] },
  { id: 'K2', kind: 'K', title: 'PC1符号', question: '把因子和全部loading同时乘−1会怎样？', options: ['拟合与解释份额不变', '解释份额变负', '证明经济从risk-on变risk-off'], correct: 0, answer: '因子符号任意；显示方向需登记anchor。', trap: '给数学符号天然经济含义。', sourceIds: [2, 19] },
  { id: 'M3', kind: 'M', title: '美国收益率同方向', question: '美国2Y上升时全球股票可能上涨，最合理的下一步是什么？', options: ['仍认定纯紧缩', '区分货币政策意外、增长信息和期限/风险溢价，再看跨市场符号', '删除股票数据'], correct: 1, answer: '相同利率方向可由不同driver产生。', trap: '单市场方向识别冲击。', sourceIds: [2, 10, 16] },
  { id: 'K3', kind: 'K', title: 'gross与net', question: '外国投资者撤资10、本国居民把海外资产汇回10，净流量接近0说明什么？', options: ['没有资本流事件', '两者自动互相抵销风险', '可能同时有stop与retrenchment，净额隐藏两边行为'], correct: 2, answer: '必须分别读取gross inflow和gross outflow。', trap: '用净额推断外国投资者行为。', sourceIds: [11] },
  { id: 'M4', kind: 'M', title: '美元异质性', question: '美元升值10%，以下哪项最专业？', options: ['按负债、资产、收入、hedge、margin与期限逐主体判断', '所有非美主体损失10%', '只看DXY阈值'], correct: 0, answer: '美元价格、funding access与currency exposure要分开。', trap: '从相对价格直接推全体损益。', sourceIds: [9, 16, 20] },
  { id: 'K4', kind: 'K', title: '全球银行重配', question: '集团对外债权总额不变，A国−20、B国+20，可得什么？', options: ['全球银行渠道不存在', '存在目的地重配；总量不能回答A国金融条件，也不能证明全球共同收缩', 'A与B都不受影响'], correct: 1, answer: '边、目的地截面和全球共同状态是不同层级。', trap: '用集团总量覆盖目的地。', sourceIds: [8, 18] },
  { id: 'M5', kind: 'M', title: '浮动汇率与自主性', question: '浮动汇率国信用利差仍受全球冲击，能否说它没有货币政策自主性？', options: ['能，任何spillover都等于无自主', '只有固定汇率才有自主', '不能；政策利率自主、金融条件隔离和冲击幅度是不同结果'], correct: 2, answer: '浮动可缓冲但不承诺完全隔绝所有金融变量。', trap: '把insulation与autonomy混为一谈。', sourceIds: [3, 13, 14] },
  { id: 'K5', kind: 'K', title: 'C2观测等价', question: 'PCA和相关矩阵完全相同的两组因果故事，能凭这些统计量选择“共同冲击”还是“传染”吗？', options: ['不能；需外生shock、时序或typed edge等额外证据', '能，PC1就是共同冲击', '能，相关高的一方是源头'], correct: 0, answer: '描述性统计不足以选择因果图。', trap: '从同期相关推方向。', sourceIds: [4, 10, 19, 21, 22] },
  { id: 'M6', kind: 'M', title: '解释度争论', question: '资本流研究发现全球变量通常解释不到四分之一变异，最严谨的解释是什么？', options: ['全球周期不存在', '强版“单因子主导全部资本流”受反证，但其他资产、流量类型和压力期仍可有重要共同成分', '所有资本流都是国内因素'], correct: 1, answer: '对象、频率、样本和尾部状态决定结论范围。', trap: '把有限解释度改写成不存在。', sourceIds: [4, 11] },
  { id: 'K6', kind: 'K', title: '证据三轴', question: '页面通过双审和构建后，causal/OOS/production状态应怎样变化？', options: ['全部自动为true', '因子解释度高时自动为true', '保持原状态；内容质量门不生成现实数据或验证证据'], correct: 2, answer: '审稿、交付、测量、因果、预测和production互不冒充。', trap: '把软件/编辑门升级为经验资格。', sourceIds: [1, 15] },
] as const;

export const globalCycleUnderstandingQuestions = [
  '用自己的话区分global financial cycle、risk-on/off、identified shock与crisis。',
  '为一组美国、欧洲和亚洲股票日收益建立最小observation passport，并处理不重叠收盘。',
  '解释为什么因子整体乘−1不改变拟合，却会改变未声明的risk-on标签。',
  '给出面板扩展后PC1经济含义变化的例子。',
  '用z=λf+u写出高loading但最终反向市场的数值例子。',
  '比较explained variance、预测R²和结构冲击贡献，说明三者为何不同。',
  '列出VIX、美元、美债收益率、信用利差和银行杠杆各自回答的问题。',
  '画overlap graph，说明全球股票下跌为何可能同时进入因子和VIX。',
  '构造收益率同样上升但股票反应相反的政策意外与增长消息情景。',
  '写出外部工具的relevance和exclusion条件，并列一个信息效应威胁。',
  '比较未套保美元债务人、美元收入出口商和充分套保基金的美元升值路径。',
  '把price、quantity与access分别用于诊断美元融资，而不是只引用basis。',
  '说明4.06的一条typed credit edge为何不能直接命名为global factor。',
  '给出集团总量不变但两个目的地一收一放的重配例子。',
  '用gross inflow/outflow解释net flow为零但stop与retrenchment并存。',
  '比较本币长期债务深市场与短期美元债务浅市场对同一shock的反应。',
  '解释政策利率自主、金融条件隔离和福利最优为什么是三个问题。',
  '设计一个会使VIX代理关系在危机后漂移的制度变化。',
  '用协方差分解解释共同冲击为何能制造高相关而无需直接传染。',
  '为4.21写一个最低传染识别包：冲击源、typed edge、时序、共同因子、placebo与反证。',
] as const;

export type GlobalCycleUnderstandingGuide = {
  kind: 'measurement' | 'identification' | 'channel' | 'policy' | 'contagion';
  mustInclude: readonly string[];
  commonError: string;
  extension: string;
};

export const globalCycleUnderstandingGuides: readonly GlobalCycleUnderstandingGuide[] = [
  { kind: 'measurement', mustInclude: ['GFCy是依面板与方法估计的共同状态', 'risk-on/off是方向标签', 'identified shock需要外生或结构识别', 'crisis还要求损失或市场功能严重受损'], commonError: '把四个词都当作“市场下跌”的同义词。', extension: '给出一个risk-off但尚不能称crisis的例子。' },
  { kind: 'measurement', mustInclude: ['列出资产、国家、币种与收益定义', '保存收盘时区和可交易日', '声明缺失处理与数据vintage'], commonError: '把亚洲周一与美国周一机械对齐，或把休市填成0。', extension: '分别构造同期和信息可得时钟面板。' },
  { kind: 'measurement', mustInclude: ['写出f→−f且λ→−λ', '说明λf与拟合值不变', 'sign anchor只是显示约定'], commonError: '把数学翻号解释成经济状态真的反转。', extension: '设计一个可复现的sign anchor。' },
  { kind: 'measurement', mustInclude: ['指出universe改变了协方差矩阵', '说明权重/loadings可重排', '拒绝把两版本无条件拼接'], commonError: '把PC1改变归因于市场结构变化而不检查样本定义。', extension: '提出核心面板与扩展面板稳定性检查。' },
  { kind: 'measurement', mustInclude: ['给出f、loading与local residual数值', '展示λf与u符号相反', '最终值仍等于两者之和'], commonError: '为得到想要方向而改变因子符号或截断残差。', extension: '再给一个低loading但大最终反应的例子。' },
  { kind: 'measurement', mustInclude: ['EV是当前面板样本方差份额', '预测R²评估预测误差解释', '结构贡献依识别冲击与反事实'], commonError: '把三个百分比都叫“解释力”。', extension: '说明为什么高EV也可有低OOS R²。' },
  { kind: 'measurement', mustInclude: ['VIX是30日SPX期权预期波动率', '美元是相对价格', '收益率/利差/杠杆各有不同对象'], commonError: '把五个指标写成同一潜在变量的重复观测。', extension: '为每个指标补期限、币种和方向。' },
  { kind: 'measurement', mustInclude: ['列出全球股票进入factor的路径', '列出SPX期权进入VIX的路径', '标出共享的美国股票原语'], commonError: '把factor与VIX同向当作两份独立证据。', extension: '提出一个不共享股票原语的替代proxy。' },
  { kind: 'identification', mustInclude: ['政策紧缩情景的跨市场符号', '增长好消息情景的跨市场符号', '相同收益率方向不能识别driver'], commonError: '只看2Y方向就给shock命名。', extension: '加入期限溢价上升作为第三个竞争解释。' },
  { kind: 'identification', mustInclude: ['relevance：工具确实移动政策shock', 'exclusion：工具不经其他渠道影响结果', '信息效应是一项具体威胁'], commonError: '把高频窗口本身当作外生性证明。', extension: '写一个排除重叠数据发布的样本规则。' },
  { kind: 'channel', mustInclude: ['债务币种与期限', '收入/资产币种', '对冲终值与保证金时钟', '三类主体方向可不同'], commonError: '把美元升值百分比直接当所有主体损失百分比。', extension: '加入自然对冲不完全的中间案例。' },
  { kind: 'channel', mustInclude: ['price是融资价格', 'quantity是实际数量', 'access是能否成交/续作', '三者时钟可能错开'], commonError: '只凭basis扩大就断言实体美元现金短缺。', extension: '设计price恶化但quantity暂稳的情景。' },
  { kind: 'channel', mustInclude: ['typed edge有主体、方向、产品与时钟', 'global factor是截面统计摘要', '一条边不能代表全部网络'], commonError: '把已识别贷款边自动升级成全球共同shock。', extension: '说明多条共同母行边如何进入截面检验。' },
  { kind: 'channel', mustInclude: ['集团净变化为0', 'A与B目的地变化相反', 'A国条件与全球共同收缩仍待分别判断'], commonError: '用集团总量稳定推出所有目的地稳定。', extension: '加入第三国和替代债券融资。' },
  { kind: 'channel', mustInclude: ['stop在非居民gross inflow侧', 'retrenchment在居民gross outflow侧', '两边可同时很大而net接近0'], commonError: '从net=0推出没有跨境行为。', extension: '画四象限并加入surge与flight。' },
  { kind: 'channel', mustInclude: ['比较币种错配与债务期限', '比较市场深度/本地投资者', '说明同一global input为何映射不同'], commonError: '只用“开放度”解释全部差异。', extension: '加入政策可信度作为内生filter。' },
  { kind: 'policy', mustInclude: ['政策率自主是工具维度', '金融条件隔离是结果维度', '福利还需产出、通胀、分配与成本'], commonError: '观察到spillover就宣告没有货币自主。', extension: '分别给三项结论所需证据。' },
  { kind: 'measurement', mustInclude: ['指出制度或中介结构断点', '解释proxy与latent state关系为何变', '给出滚动/断点与OOS稳定性检查'], commonError: '看到相关下降就说GFCy消失。', extension: '比较银行渠道减弱与基金渠道增强。' },
  { kind: 'contagion', mustInclude: ['写出完整协方差四项', '声明何时因子—残差正交', '说明残差协方差仍非传染'], commonError: '漏掉交叉项或把统一尺度变化说成相关必升。', extension: '解释异方差校正针对什么偏误。' },
  { kind: 'contagion', mustInclude: ['外生冲击源与时钟', '预先存在的主体化typed edge', '共同/区域因子与lead–lag', 'placebo、竞争解释和拒绝条件'], commonError: '只以危机相关上升或残差相关命名方向。', extension: '写出非连接边也反应时如何否决网络叙事。' },
] as const;

export const globalCycleResearchQuestions = [
  { question: '第一全球因子在改变资产universe后是否稳定？', design: '预注册核心与扩展面板，冻结标准化、缺失和符号锚，比较loading、EV与reconstruction。', evidenceNeeded: '同一PIT时钟下的多版本面板和bootstrap/后验不确定性。', whatWouldWeakenIt: '加入一个资产类别即令方向或主要loading大幅翻转。', reject: '禁止事后挑选最像VIX的universe。', sourceIds: [2, 4, 19] as const },
  { question: 'VIX何时是共同资产因子的好代理？', design: '滚动/状态依赖比较因子与VIX，同时加入美元、EBP和realized volatility并做overlap。', evidenceNeeded: '同频PIT代理、共同因子版本和样本外误差。', whatWouldWeakenIt: '相关只在美国股灾窗口存在，跨资产/地区不稳。', reject: '高样本内相关不能证明同一经济身份。', sourceIds: [2, 7, 17] as const },
  { question: '美国货币政策还是美国增长信息驱动全球同步？', design: '使用窄窗口工具并显式处理information effect；对股票、利率、美元和信用预注册符号。', evidenceNeeded: '公告级价格、工具强度、同时新闻和rich-information controls。', whatWouldWeakenIt: '替代工具或排除可疑窗口后效应消失。', reject: '普通Fed funds变化不称identified shock。', sourceIds: [2, 10, 16] as const },
  { question: '中介风险承载是否放大同一外生shock？', design: '将外生shock与预定资产负债表暴露交互，追踪margin、leverage、flow和price的时间顺序。', evidenceNeeded: '机构/基金暴露、融资与交易数据。', whatWouldWeakenIt: '高暴露主体不更敏感，或先有价格再机械改变ratio。', reject: '聚合杠杆相关不闭合通道。', sourceIds: [8, 9, 17] as const },
  { question: '美元价格、basis和美元贷款量中哪一层传导最强？', design: '三者分别建模并用主体currency mismatch和hedge异质性区分。', evidenceNeeded: '币种/期限/实体级资金、贷款与对冲数据。', whatWouldWeakenIt: '方向对有美元收入/套保主体相同，或关系随时期反转。', reject: 'DXY单变量不给shortage结论。', sourceIds: [9, 18, 20] as const },
  { question: '全球银行冲击是否被当地银行或债券融资替代？', design: '共同借款人或目的地×银行暴露设计，合并总融资和条款。', evidenceNeeded: '银行—企业关系、债券发行、内部现金和shock clock。', whatWouldWeakenIt: '受冲击银行收缩但企业总融资与条件不变。', reject: 'claims stock差分不称供给。', sourceIds: [8, 18] as const },
  { question: '浮动汇率对哪类结果提供多少缓冲？', design: '区分政策率、信用、房价、汇率与产出，使用制度变化或交互并控制政策内生性。', evidenceNeeded: '汇率制度、干预、开放度、错配和本地政策。', whatWouldWeakenIt: '只对政策率有缓冲而金融条件无差异，或结果依危机样本。', reject: '不写“完全自主/完全失去自主”二元结论。', sourceIds: [3, 12, 13, 14] as const },
  { question: '全球因子平均解释度低时，尾部资本流事件是否仍受其影响？', design: '分开常态方差与surge/stop/flight/retrenchment条件概率。', evidenceNeeded: 'gross flow双边、事件定义、实时全球状态和本地控制。', whatWouldWeakenIt: '极端事件在替代阈值下不稳或只由修订数据出现。', reject: '平均R²不替代尾部检验。', sourceIds: [4, 11] as const },
  { question: '危机后银行渠道是否迁移到非银基金？', design: '分时期比较银行/基金暴露和redemption/credit反应，允许time-varying loading。', evidenceNeeded: '持仓、赎回、银行信贷、市场深度与制度断点。', whatWouldWeakenIt: '渠道权重变化只来自样本/口径改变。', reject: '固定全样本beta不得掩盖断点。', sourceIds: [1, 6, 17] as const },
  { question: '残差共动是传染还是遗漏共同因素？', design: '先过滤预注册的全球与区域共同因子，再校正危机期异方差，并用外生源shock×预定网络暴露、lead–lag与placebo。', evidenceNeeded: 'typed edges、交易时钟、共同因子版本、波动率状态和对照边。', whatWouldWeakenIt: '非边连接同样反应、异方差校正后跃升消失，或加入区域因子后效应消失。', reject: '残差相关本身不称contagion。', sourceIds: [4, 10, 11, 19, 21, 22] as const },
] as const;

export const globalCycleEvidenceBoundaries = [
  '全球金融周期是依观测对象和估计方法定义的潜在共同状态，不是自然界直接公布的单一指数。',
  'PCA/DFM、相关和代理匹配属于measurement；只有满足识别假设的shock response才进入局部causal层。',
  '一个资产面板的高解释份额不能迁移给资本流、信用、房价或另一频率。',
  'VIX、美元、美债、basis、EBP和杠杆各自有不同口径；多指标必须先去重再三角验证。',
  '上游3.13、4.04、4.05、4.06只提供类型和语义接口；其author-SYN、审稿和证据身份不得继承。',
  '政策利率自主、金融条件隔离、宏观稳定与福利最优是不同结论，4.07不提前给4.09政策答案。',
  '相关上升和残差共动不能证明直接传染；危机样本先检查异方差与共同/区域因子，4.21还需要typed edge、时序、外生源与placebo。',
  '本页没有加载现实时间序列：全部实验为author-SYN，observed/PIT/OOS/causal/prediction/trading/production均未取得。',
] as const;

export const globalCycleInterfaces = [
  ['3.13 Financial Conditions', '接收主体/用途/期限特定的本地条件向量、时钟与global/local候选分解。', '不继承本地FCI scalar或author-SYN；跨国标准化前不得聚合。'],
  ['4.04 US Treasury Curve', '接收curve passport、driver candidate、key-rate vector、local pass-through与reverse-spillover flag。', '未识别driver保持unknown；收益率方向不自动成为全球shock。'],
  ['4.05 Global Dollar Funding', '接收entity/currency/horizon与price–quantity–access语义。', '不读取G_pre、cash legs或SYN basis；DXY/basis/facility不作单指标。'],
  ['4.06 Global Banks', '接收typed credit edge、主体/路线、shock clock、loan-offer response与evidence ceiling。', '不重讲LBS/CBS或把claims/目的地回撤叫common factor。'],
  ['4.08 EM Capital Flows', '输出asset/funding dimensions、country loading、local residual、currency exposure、clock与evidence axes。', '不输出新兴市场排名、sudden-stop标签或资本流因果。'],
  ['4.09 Trilemma / Dilemma', '输出global state、identified/candidate shock、本地pass-through与制度暴露。', '不提前回答政策自主、CFM有效性或福利。'],
  ['4.20 Safe-haven Flow', '输出driver-conditioned risk-off vector、proxy diagnostics与residual。', '不凭共同因子给资产贴永久safe-haven标签。'],
  ['4.21 Contagion vs Common Shock', '输出common component、candidate shock、residual covariance、lead–lag与typed edges。', '不把excess comovement直接改名为contagion。'],
  ['7.10 Cross-asset State', '输出factor/loadings/covariance、regime drift、residual、overlap graph、uncertainty与clock。', '不升级为网络共振、系统性风险或可交易signal。'],
  ['7.17 Causality', '输出每条driver/channel的识别假设、placebo与failure mode。', '描述性因子不得复用为外生shock。'],
] as const;

export const globalCycleInvariants = [
  '所有author-SYN字段与现实数据状态永久分栏。',
  'common component、proxy、driver、channel、local filter、outcome和feedback分层保存。',
  '因子符号无天然经济含义；每个版本必须保存sign anchor。',
  'PCA universe、窗口、标准化、缺失和vintage缺一即STOP。',
  '未来均值/方差不得进入严格PIT历史标准化。',
  '停牌、休市、未发布、unknown和0不得互换。',
  '任何单一proxy都不能把globalFactorIdentified置为true。',
  'VIX只按其期权隐含波动率口径描述。',
  'DXY、basis和GLI都不是实体美元现金缺口。',
  'Treasury yield方向不识别政策、增长或期限溢价。',
  'loading不是永久国家脆弱性排名。',
  'explained variance不是因果贡献、损失比例或预测R²。',
  'asset-price factor解释度不得迁移到capital-flow factor。',
  'gross inflow、gross outflow和net flow分别保存。',
  'surge/stop由非居民一侧定义；flight/retrenchment由居民一侧定义。',
  '银行信用边与全球截面state不是同一对象。',
  '集团总量不得覆盖目的地重配。',
  '本地替代融资未知时，总融资结论保持partial/null。',
  '美元升值对主体的方向必须由净暴露和时钟决定。',
  '套保终值与margin/rollover现金时钟分开。',
  '浮动汇率可缓冲但不承诺完全金融隔离。',
  '政策变量内生时不宣称工具保护因果。',
  '外部工具需报告relevance、exclusion和信息效应风险。',
  '事件窗重叠或弱工具时causal状态降级。',
  '预测关联不得改名为结构shock。',
  '残差相关不等于contagion。',
  '网络边必须有主体、方向、强度与时钟。',
  'lead–lag先排除跨时区交易时钟。',
  '危机相关上升需检查共同波动与异方差。',
  'regime与beta必须版本化，不用固定历史阈值。',
  '反向溢出候选不得被单向中心模型删除。',
  '每条命题的证据等级不高于最弱箭头。',
  'measurement、causal、prediction三轴不得合并。',
  '双审只批准冻结内容，不生成现实数据证据。',
  '构建、浏览器、移动端和打印是交付门，不是学术识别门。',
  '作者有限自检不得冒充任一独立审稿席。',
  '正文修改后旧审稿不自动覆盖新BODY。',
  '来源必须说明支持与不支持，不能只堆书目。',
  '失败来源和版本受限证据应保留，不用无关来源替代。',
  '4.07不重讲4.06的LBS/CBS和贷款级供给识别。',
  '4.07不提前完成4.08资本流、4.09政策或4.21传染结论。',
  'observedSnapshots和realDataAdapters在本课保持空。',
  'PIT、historical replay、OOS和production状态默认false。',
  '任何交易、预测或风险建议必须超出本课证据范围并另行验证。',
] as const;
