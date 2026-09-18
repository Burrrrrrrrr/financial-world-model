import type { TreasuryCurveSourceId } from './treasuryCurveReferences';

export const treasuryCurveThesis = {
  statement: '美债不是一条会无摩擦复制到全球的单一“世界贴现率”，而是一组可交易、可套保、可融资、可观察的美元期限价格。它通过reference、hedge、relative value、collateral/funding与information五种角色成为全球传导枢纽；每次传播仍须经过曲线身份、现金流期限、资产自身spread、融资中介、币种套保与本地制度六道门。',
  inequalities: [
    'benchmark / reference quote ≠ every contract’s discount curve',
    'Treasury yield change ≠ identified structural U.S. shock',
    'global influence ≠ one-way, one-for-one pass-through',
  ],
  exitSentence: '先认曲线，再认暴露；先认冲击，再谈方向；最后检查融资、币种和本地制度是否让传导通过。',
} as const;

export const treasuryCurveCoreRoute = [
  { time: '00–08分钟', title: '开场悖论与三个不等式', conceptIds: ['treasury-curve-mechanism-01'], task: '先判断“全球基准”为什么不等于“所有合同同一折现率”。', exit: '能完整说出曲线护照至少包含币种、家族、输入、报价侧、复利、日计数、时点和抵押制度。' },
  { time: '08–20分钟', title: '六种期限坐标', conceptIds: ['treasury-curve-mechanism-02'], task: '沿price→cash flows→discount factors→zero/par/forward重建对象。', exit: '知道CMT par不能直接代入zero discount formula。' },
  { time: '20–32分钟', title: 'Benchmark与on/off-the-run', conceptIds: ['treasury-curve-mechanism-03', 'treasury-curve-mechanism-04'], task: '分清公共坐标、可交易新券与个券便利。', exit: '能解释为什么最可见报价也可能最含specialness。' },
  { time: '32–45分钟', title: 'Duration与key-rate hedge', conceptIds: ['treasury-curve-mechanism-05', 'treasury-curve-mechanism-06'], task: '先做局部一阶暴露，再把风险展开成节点向量。', exit: '能说明总DV01为0为何不等于steepener风险为0。' },
  { time: '45–56分钟', title: 'Relative value、repo与OIS边界', conceptIds: ['treasury-curve-mechanism-07', 'treasury-curve-mechanism-08', 'treasury-curve-mechanism-09'], task: '追踪spread、basis、haircut与合同折现制度。', exit: '能画出Treasury通过比较和融资传播、却不等于SOFR/OIS的路径。' },
  { time: '56–69分钟', title: 'Driver identity与跨资产竞赛', conceptIds: ['treasury-curve-mechanism-10', 'treasury-curve-mechanism-11'], task: '比较增长信息、政策紧缩与融资压力三种同号yield move。', exit: '至少构造一个yield↑/equity↑和一个yield↑/equity↓的闭合因果链。' },
  { time: '69–78分钟', title: 'FX hedge与国际双向门', conceptIds: ['treasury-curve-mechanism-12', 'treasury-curve-mechanism-13'], task: '把美元回报、本币未套保回报、套保回报与本地政策分开。', exit: '缺hedge ratio或forward cost时主动输出null。' },
  { time: '78–83分钟', title: '2020市场功能压力', conceptIds: ['treasury-curve-mechanism-14'], task: '把多类卖方、margin、basis与dealer capacity装回同一反馈系统。', exit: '知道高volume与差liquidity可以同时出现。' },
  { time: '83–86分钟', title: 'M/K退出检查', conceptIds: [], task: '完成同题互动/静态检查并重述三个不等式。', exit: '能把任意headline yield move改写为带护照、driver与传导门的研究问题。' },
] as const;

export const treasuryCurvePassportRules = [
  ['01 · Currency', '现金流、曲线与报告回报的币种；跨币种必须另列FX/quanto处理。'],
  ['02 · Curve family', 'Treasury CMT par、Treasury zero、GSW fitted、SOFR OIS、swap或其他，不能只写“risk-free”。'],
  ['03 · Instrument universe', 'Bills/notes/bonds/STRIPS/TIPS/FRNs、on/off-the-run及是否含futures/swaps。'],
  ['04 · Quote side', 'bid、offer、mid、last、auction result或model fitted；indicative不等于transaction。'],
  ['05 · Price convention', 'clean或dirty，是否含accrued interest，结算日与现金流cutoff。'],
  ['06 · Rate coordinate', 'YTM、discount factor、zero、par、forward、repo或swap rate。'],
  ['07 · Compounding', 'simple、bond-equivalent、periodic或continuous；频率不得隐含。'],
  ['08 · Day count', '实际日数与年基准；不得把Treasury实际规则换成30/360默认。'],
  ['09 · Maturity grid', '节点与插值范围；不能用一个10Y点代表整条曲线。'],
  ['10 · Valuation clock', '时区、日期、盘中/收盘、发布时间与as-of。'],
  ['11 · Source & method', '官方、交易、vendor或模型；输入、拟合、过滤、修订与版本。'],
  ['12 · Collateral regime', 'CCP/CSA、eligible collateral、PAI/remuneration与discounting约定。'],
  ['13 · Liquidity state', 'spread、depth、price impact与resilience分别记录，volume不是替代。'],
  ['14 · Benchmark role', 'reference、hedge、RV anchor、collateral或information；可多选但不可混同。'],
  ['15 · Exposure map', '现金流、duration/PVBP、KRD nodes、convexity、optionality与basis。'],
  ['16 · Funding state', 'repo rate、haircut、eligible/unencumbered quantity、tenor、roll与dealer capacity。'],
  ['17 · Driver identity', 'policy、growth-information、term premium、liquidity/convenience、funding/intermediation、foreign或unknown。'],
  ['18 · FX hedge gate', '本币、spot convention、hedge ratio、forward/basis、hedge tenor与rollover。'],
  ['19 · Local gate', '汇率制度、央行反应、美元负债、外部融资、市场深度与风险承受。'],
  ['20 · Evidence boundary', '窗口、样本、识别、vintage、null reasons与禁止外推项。'],
] as const;

export const treasuryCurveEntryVocabulary = [
  ['Treasury security', '对美国财政部的具体可交易债权；不同产品现金流不同。'],
  ['Treasury curve', '由一组证券或衍生品价格构造的期限价格关系，不是单只债券。'],
  ['CMT', '从财政部日度par curve固定期限点读出的constant maturity Treasury yield。'],
  ['Par yield', '使假想票息债价格等于面值的票息率。'],
  ['Zero yield', '与某期限discount factor一一对应的零息收益率。'],
  ['Discount factor', '今天换取未来某日一单位同币种确定现金流的价格。'],
  ['Forward rate', '由今日discount factors比值合成的未来区间边际价格。'],
  ['YTM', '使单只券全部现金流现值等于价格的单一内部收益率。'],
  ['Clean / dirty price', '不含/包含应计利息的债券报价；结算时不可混用。'],
  ['On-the-run', '某原始期限最近发行的Treasury；常更活跃，也可能repo special。'],
  ['Off-the-run', '被新券替代的旧券；并非自动无流动性或无便利楔子。'],
  ['STRIPS', '将合格Treasury票息与本金分拆成独立零息证券。'],
  ['Benchmark', '供比较、报价、风险沟通或hedge的共同参考坐标。'],
  ['Basis', '相关但不相同工具之间的相对价格楔子；含定义、融资和制度。'],
  ['Swap spread', 'swap rate相对指定政府债/曲线的差；不是纯信用指标。'],
  ['Duration', '价格对局部收益率变化的一阶敏感度摘要。'],
  ['PVBP / DV01', '对1bp局部利率变动的货币价值敏感度。'],
  ['Convexity', '价格—收益率曲线的二阶曲率修正。'],
  ['Key-rate duration', '对选定期限节点局部bump的敏感度向量。'],
  ['Repo', '以证券作抵押的融资/借券交易；现金与特定券需求都重要。'],
  ['Haircut', '抵押品市值中不计入可借现金的折扣比例。'],
  ['SOFR', '纽约联储管理的、以Treasury作抵押的广泛隔夜融资成本参考率。'],
  ['OIS', '固定端对隔夜指数复利浮动端的掉期；曲线用途依合同/抵押。'],
  ['PAI', '清算衍生品变动保证金相关的price alignment interest安排。'],
  ['Term premium', '承担未来利率与状态风险所需的期限补偿；模型依赖。'],
  ['Information shock', '政策沟通同时揭示央行对经济状态判断的候选冲击。'],
  ['Cross-currency basis', '跨币种融资/套保价格偏离简单利差关系的楔子。'],
  ['Rollover risk', '短期限融资或套保需在资产到期前反复续作的风险。'],
  ['Dealer capacity', '中介在资本、杠杆、风险和融资约束下承接库存与交易的能力。'],
  ['Reverse spillover', '外国消息、政策或配置经全球市场返回美国Treasury的路径。'],
  ['Driver class', '对观测yield move的候选结构来源分类；证据不足时为unknown。'],
  ['Null reason', '某结论未计算/未识别的具体原因；null不等于经济零。'],
] as const;

export const treasuryCurveChecks: readonly {
  id: string;
  kind: 'M' | 'K';
  title: string;
  question: string;
  answer: string;
  trap: string;
  sourceIds: readonly TreasuryCurveSourceId[];
}[] = [
  { id: '01', kind: 'M', title: '基准不等于折现曲线', question: '一份按SOFR PAI处理的CCP清算美元swap，为什么不能直接用Treasury CMT作合同折现曲线？', answer: '清算、抵押报酬和合约制度决定折现；Treasury可作hedge或RV reference，但不是同一对象。', trap: '只说“SOFR更准确”，或把差异归因于Treasury信用风险。', sourceIds: [7, 8, 9] },
  { id: '02', kind: 'M', title: 'On-the-run双重性', question: '为什么最新券既适合做醒目报价，又可能不适合估计纯宏观zero curve？', answer: '更强交易与价格发现提高可见性，同时liquidity premium、deliverability和repo specialness进入价格。', trap: '把on-the-run称为“无噪声真实利率”。', sourceIds: [1, 3, 6] },
  { id: '03', kind: 'M', title: '同向yield、反向股票', question: '构造两个都令10Y yield上升、但股票方向相反的因果链。', answer: '增长/信息改善可提高现金流与股票；意外紧缩可抬高政策路径和ERP、压低股票。', trap: '只说“情绪不同”，没有主体、约束和传导。', sourceIds: [12, 13] },
  { id: '04', kind: 'M', title: 'Repo反馈环', question: 'Haircut上升怎样从融资约束传到Treasury与其他资产？', answer: '可借现金下降→追加保证金/去杠杆→卖出→depth恶化与impact上升→融资条件进一步收紧，并可跨资产变现。', trap: '只说利率上升所以债价下降。', sourceIds: [4, 5, 7] },
  { id: '05', kind: 'M', title: '跨国传导不是复制', question: '为何相同美国冲击在不同经济体可能主要走预期短率或term premium？', answer: '本地政策反应、汇率制度、美元融资、外债、市场深度和风险承受不同。', trap: '把某论文样本系数当通用实时beta。', sourceIds: [10, 14] },
  { id: '06', kind: 'M', title: '反向溢出', question: '为什么Treasury长端变化不能自动认定冲击来自美国？', answer: '外国消息与全球配置可经term premium进入Treasury；开盘顺序或overnight move不等于结构身份。', trap: '用市场规模或时区作为因果证明。', sourceIds: [11] },
  { id: '07', kind: 'K', title: 'Par与zero', question: '10Y CMT是par yield，能否直接代入D(10)=exp(−y×10)？', answer: '不能。需完整票息债曲线bootstrap，并统一复利、日计数、结算与曲线对象。', trap: '把“十年”相同当作现金流相同。', sourceIds: [1, 2, 3] },
  { id: '08', kind: 'K', title: 'Forward构造', question: '连续复利D(2)=0.92、D(3)=0.86时，2Y–3Y forward是什么，且不是什么？', answer: 'f(2,3)=ln(0.92/0.86)≈6.74%；它是今日曲线隐含区间价格，不是确定未来短率预测。', trap: '直接做0.92−0.86，或把forward称为市场必然预期。', sourceIds: [3] },
  { id: '09', kind: 'K', title: 'Duration符号', question: 'Dmod=7、收益率小幅上升10bp时，一阶价格变化率？', answer: '约−7×0.001=−0.7%；需附小变动、局部、一阶、近似平行边界。', trap: '写成+7%，或遗漏bp换算。', sourceIds: [3] },
  { id: '10', kind: 'K', title: 'Key-rate hedge', question: '总DV01被10Y hedge压到0，为何2s10s steepener仍可能有P&L？', answer: '节点暴露未逐项匹配；总DV01只约束一个方向，KRD residual仍非零。', trap: '把总量中性等同所有曲线形状中性。', sourceIds: [3, 15] },
  { id: '11', kind: 'K', title: '外汇输入缺失', question: 'Treasury美元回报+2%，但本币、hedge ratio与forward cost未知；套保后本币回报是多少？', answer: 'null。未知项不能补0，也不能默认未套保或100%套保。', trap: '直接回答+2%。', sourceIds: [14] },
  { id: '12', kind: 'K', title: '2020流动性判断', question: 'Treasury成交量很高，能否据此断言流动性很好？', answer: '不能。强迫交易可令volume高，同时spread扩大、depth下降、impact恶化。', trap: '把activity与低交易成本混为一谈。', sourceIds: [4, 5, 6] },
  { id: '13', kind: 'M', title: 'Spread不是纯信用', question: '公司债相对Treasury spread扩大，为什么不能全部命名为default risk？', answer: 'Spread还可能含liquidity、optionality、税、资本、融资与benchmark便利；需匹配并识别。', trap: '用一个raw yield difference替代全部资产护照。', sourceIds: [3, 4, 9] },
  { id: '14', kind: 'M', title: 'SOFR不是Treasury yield', question: 'SOFR以Treasury作collateral，为何仍不是Treasury bond yield？', answer: 'SOFR度量隔夜现金融资成本；债券yield度量证券现金流价格，两者主体、期限与权利不同。', trap: '因共同出现Treasury一词就认为相等。', sourceIds: [7] },
  { id: '15', kind: 'K', title: 'Collateral capacity', question: 'SYN市值96、可用比例80%、haircut 5%，可借现金是多少？', answer: '96×0.80×0.95=72.96；面值或毛持仓不能替代eligible unencumbered value。', trap: '回答95或96。', sourceIds: [4, 7] },
  { id: '16', kind: 'K', title: 'Cash-flow抵消', question: '现金流贡献+2.5%、无风险拖累−1.0%、ERP拖累−1.5%，净变化如何解释？', answer: 'SYN近似为0%；这不是“没有机制”，而是三个非零贡献恰好抵消。', trap: '把净0倒推各分项均为0。', sourceIds: [12, 13] },
  { id: '17', kind: 'M', title: 'Credit-risk-free边界', question: '把Treasury称作credit-risk-free benchmark，能否推出持有期不会亏损？', answer: '不能。仍有duration、market liquidity、funding、reinvestment与basis风险。', trap: '把发行人名义履约与市场价格稳定混同。', sourceIds: [4, 5] },
  { id: '18', kind: 'M', title: 'Driver unknown', question: '只有日度10Y +12bp，可否标注“Fed tightening shock”？', answer: '不可；需事件窗口与识别。当前driverClass=unknown，并保留增长、term premium、供给、便利、融资和外国冲击候选。', trap: '用事后故事替代识别。', sourceIds: [10, 11, 12, 13] },
  { id: '19', kind: 'K', title: 'FX报价方向', question: '公式中FXspot为何必须写明“本币/美元”或“美元/本币”？', answer: '报价方向决定升贬值贡献的符号；未声明时本币回报不可复算。', trap: '认为百分比变动天然没有方向。', sourceIds: [14] },
  { id: '20', kind: 'K', title: 'Basis不是必然归零', question: 'Cash–futures basis出现偏差，是否意味着无风险利润会立即消除？', answer: '不一定。Repo、margin、capital、delivery、liquidity与dealer capacity会限制套利并制造路径风险。', trap: '把无套利理论约束等同无摩擦即时交易。', sourceIds: [4] },
] as const;

export const treasuryCurveResearchQuestions = [
  { question: '某次Treasury节点变化究竟来自expected short-rate、term premium、liquidity/convenience还是foreign shock？', design: '预注册事件窗口与联合资产响应，保留模型/高频识别差异，并以unknown作为合法结果。', reject: '仅凭日频方向命名冲击。', sourceIds: [10, 11, 12, 13] as const },
  { question: 'On-the-run premium怎样随auction age、repo specialness和dealer capacity变化？', design: '匹配现金流、剩余期限与税务，联合cash price、repo与流动性指标。', reject: '用新旧券简单yield差直接命名流动性溢价。', sourceIds: [3, 6, 7] as const },
  { question: 'Treasury与SOFR/OIS之间的basis在何种抵押制度和压力状态下扩大？', design: '按CCP/CSA、PAI、tenor、collateral与funding分层，报告制度切换。', reject: '把两条曲线差异全部归为信用。', sourceIds: [7, 8, 9] as const },
  { question: '组合的KRD hedge是否在steepener、butterfly和basis shock中仍有效？', design: '固定节点与bump规则，样本外重估，分开curve residual、convexity与basis。', reject: '以总DV01为0宣称风险消失。', sourceIds: [3, 15] as const },
  { question: '外国投资者对Treasury的需求如何随FX hedge cost与rollover gap变化？', design: '记录投资者本币、hedge ratio、tenor、forward/basis与资产现金流；避免从聚合持仓猜套保。', reject: '缺输入时假定100%或0%套保。', sourceIds: [14] as const },
  { question: '相同美国yield move为何在不同经济体产生不同local yield、FX与equity反应？', design: 'driver-conditioned panel或高频事件，按汇率制度、外债、储备、政策反应与市场深度预分组。', reject: '预设pass-through=1或把历史论文beta当当前常数。', sourceIds: [10, 12] as const },
  { question: 'Dealer inventory capacity收紧是否先于跨市场liquidity恶化？', design: '区分liquidity supply与investor demand，联合spread、depth、impact、inventory和funding，承认同步政策干预。', reject: '用volume或单日相关性声称因果。', sourceIds: [4, 5, 6] as const },
  { question: 'Foreign news经term premium反向影响Treasury的份额是否随全球风险状态改变？', design: '保留overnight proxy限制，比较不同识别、vintage与状态；不把模型份额当观测真值。', reject: '把截至2019的20–25%写成实时结构常数。', sourceIds: [11] as const },
] as const;

export const treasuryCurveInterfaces = [
  ['3.07 Yield Curve', '接收curvePassport、discountFactors、zeroCouponYields、forwardRates及duration/safety/collateral/risk-bearing语义接口。', '不消费不存在的exported canonical数值，不重复把forward写成纯预期。'],
  ['4.03 Reserve / Safe Asset', '接收资产服务、便利、有效容量与抵押可用性的边界。', '不把safe asset翻译成价格不会跌，不复制4.03 SYN。'],
  ['4.05 Global Dollar Funding', '传递SOFR/repo、FX hedge、basis、rollover与collateral状态。', '不提前完整解释离岸美元创造与全球美元短缺。'],
  ['4.06 Global Banks', '传递dealer与银行资产负债表承载、margin和跨市场中介接口。', '不推断个别银行头寸、资本充足或违约。'],
  ['4.07 Global Financial Cycle', '传递driver-conditioned全球共同成分、风险承受与反向溢出。', '不把共振等同单一美国因果或永恒risk-on/off。'],
  ['4.10–4.12 Rates / Credit / FX', '传递key-rate vector、benchmark+spread、currency/hedge gate。', '不在本节替代各资产自身现金流、default、carry与市场制度。'],
  ['4.13–4.15 Equity / Volatility / Commodities', '传递现金流—贴现率—ERP—funding的条件化框架。', '不预设yield与股票、波动或商品的固定符号。'],
  ['4.17 Stock–Bond Correlation', '传递growth、policy、inflation、liquidity driver及净贡献。', '不以一段历史相关性当结构常数。'],
  ['5.03–5.07 Institutions', '传递benchmark网络、清算/抵押制度与本地政策过滤。', '不把美国制度视作全球法律标准。'],
  ['7.10 Cross-asset State', '交付globalRateStateCandidate全字段及null reasons。', '不得降维成单一globalDiscountRate标量或固定方向标签。'],
  ['7.24 Identification', '交付事件时钟、driver候选、joint response与反向溢出假设。', '日频yield方向不等于已识别shock。'],
  ['7.25 Data Engineering', '交付曲线、证券、FX、repo、来源、vintage与发布时钟护照。', '缺失不补0，不跨数据版本拼接。'],
  ['7.26 Validation', '交付SYN/observed/PIT、样本、估计与禁止外推边界。', '本课交互不证明预测、收益或生产表现。'],
  ['Investment decisions', '只提供机制识别与研究设计检查。', '不提供买卖、套保比例、杠杆、发行、政策或法律建议。'],
] as const;

export const treasuryCurveEvidenceBoundaries = [
  '官方方法可确定口径，却不能证明任意私人合约选择相同曲线。',
  '同行评审或央行研究支持样本内关系，不把系数升级为实时结构常数。',
  '工作论文以“在其模型/样本中估计”表述；作者免责声明与识别限制保留。',
  'Publisher abstract只支持摘要公开命题；未取得全文不引用页表、系数或细节证明。',
  '2020官方复盘允许多机制并存，不授权单一参与者因果份额。',
  'SYN实验验证定义、算术和条件方向；不校准现实市场，也不生成交易信号。',
  '任何observed/PIT/OOS/causal/forecast状态均保持false或null，直至另有逐项证据。',
] as const;

export const treasuryCurveInvariants = [
  'Benchmark不是任意合约的discount curve。',
  'Treasury yield move不是已识别的Fed shock。',
  'Global influence不是单向、一比一pass-through。',
  'CMT par不是zero yield或discount factor。',
  'YTM不是每一期现金流实际使用的逐期贴现率。',
  'Forward不是剔除期限溢价后的确定未来短率。',
  'On-the-run更可见不等于宏观信息更纯。',
  'Off-the-run不等于无流动性、税务或便利楔子。',
  'Duration是局部敏感度，不是冲击原因或精确P&L。',
  '总DV01中性不等于KRD、convexity与basis中性。',
  'Raw spread不是纯信用、纯流动性或纯便利收益。',
  'SOFR是隔夜Treasury融资参考率，不是Treasury bond yield。',
  '可作抵押不等于能以面值取得等额现金。',
  '高交易量不等于窄spread、深depth或低price impact。',
  'Credit-risk-free benchmark不等于无价格、融资或市场风险。',
  'Yield上升不决定股票、信用、美元或外国债券的固定方向。',
  '外国投资者美元回报不等于未套保或套保后本币回报。',
  'Foreign spillover与reverse spillover可同时存在。',
  'Unknown/null不是经济0；净0也不代表所有机制均为0。',
  '本课SYN、作者自检、浏览器QA与PDF检查都不是两名独立内容审批。',
] as const;
