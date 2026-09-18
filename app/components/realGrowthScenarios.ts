export type RealGrowthMode = 'measurement' | 'transmission';
export type RealGrowthChoice = 'a' | 'b' | 'c';

export type RealGrowthScenario = {
  id: string;
  mode: RealGrowthMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: RealGrowthChoice; label: string; diagnosis: string }[];
  correct: RealGrowthChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
};

export const realGrowthModes: { id: RealGrowthMode; label: string; title: string; description: string }[] = [
  { id: 'measurement', label: 'MODE A', title: '先把“增长”量对', description: '从增加值、支出恒等式、价格—数量拆分走到增长率时钟与链式量边界。' },
  { id: 'transmission', label: 'MODE B', title: '再把机制接到企业', description: '检查统计翘尾、GDP／GDI、投入与生产率、利润放大以及股票回报断链。' },
];

export const realGrowthScenarios: RealGrowthScenario[] = [
  {
    id: 'value-added-chain', mode: 'measurement', label: '测量实验 01 · Value Added',
    title: '三次销售合计 320，为什么这条供应链只创造 160 的 GDP？',
    brief: '农户把小麦以 60 卖给面粉厂；面粉厂把面粉以 100 卖给面包店；面包店把本期生产的面包以 160 卖给最终消费者。忽略存货、税、补贴、进口与自然资源耗减，所有生产均在同一经济体内发生；这里计算 gross GDP，不另扣固定资本折旧。2025 SNA 口径下，从 GDP 转到 NDP 还需同时扣除 depreciation 与 depletion；本题已假定 depletion=0。',
    facts: [
      { label: 'Farm sale', value: '60', note: '无题内中间投入' },
      { label: 'Mill sale', value: '100', note: '使用 60 的小麦' },
      { label: 'Bakery sale', value: '160', note: '使用 100 的面粉' },
    ],
    options: [
      { id: 'a', label: 'GDP=160；各环节增加值为 60、40、60', diagnosis: '正确。生产法只加每个环节新增的价值，或等价地只记最终面包；中间品不能重复计算。' },
      { id: 'b', label: 'GDP=320；把三次成交额直接相加', diagnosis: '320 同时包含小麦和面粉在后续产品中的重复价值，衡量的是题内毛销售额之和，不是 GDP。' },
      { id: 'c', label: 'GDP=100；最终销售减去第一环节产值', diagnosis: '最终产品 160 已包含整条境内供应链的增加值；不能再减去最上游产出。' },
    ],
    correct: 'a',
    calculation: 'VA农户=60；VA面粉厂=100−60=40；VA面包店=160−100=60；ΣVA=60+40+60=160，等于最终支出 160。',
    reveal: '“最终”取决于用途而非物理形态：同一袋面粉卖给家庭烘焙可以是最终消费，卖给面包店则是中间投入。生产法与支出法相等是账户恒等式，不表示每条基础数据都无误差。',
    revisit: '回看 03–05「Production Boundary、Final / Intermediate 与 Value Added」；核对 gross/net 再看 10「Gross 与 Net」。',
    sourceIds: [1, 2, 6, 15, 120, 121], staticSourceIds: [1, 6, 120],
    staticTwin: { title: '变式 01 · 咖啡链', prompt: '咖啡农售豆 50，烘焙商售烘焙豆 90，咖啡馆向最终消费者售饮品 150；无其他投入。分别求三环节增加值与 GDP。', answer: '增加值依次为 50、40、60，总和 150；三次销售额 290 不能作为 GDP。' },
  },
  {
    id: 'expenditure-imports', mode: 'measurement', label: '测量实验 02 · C + I + G + X − M',
    title: '进口为什么被减去，却不意味着“进口让居民消费失效”？',
    brief: '同一期间居民消费 C=500，国内总投资 I=120，政府消费与总投资 G=140，出口 X=80，进口 M=110。各项按同一现价口径记录，忽略统计差异。',
    facts: [
      { label: 'Domestic final spending', value: 'C+I+G=760', note: '其中可能含进口品' },
      { label: 'Exports', value: '+80', note: '境内生产、境外最终使用' },
      { label: 'Imports', value: '−110', note: '剔除非境内生产' },
    ],
    options: [
      { id: 'a', label: 'GDP=950；进口应与出口一样相加', diagnosis: '进口品可能已进入 C、I 或 G；再次相加会把境外生产计入境内 GDP。' },
      { id: 'b', label: 'GDP=730；减进口是来源校正，不是说进口支出没有需求', diagnosis: '正确。C、I、G 按购买者记录，减 M 只把其中及其他用途中的境外增加值剔除。' },
      { id: 'c', label: 'GDP=760；出口与进口都不是国内需求，所以都删除', diagnosis: '出口虽非国内最终需求，却是境内生产；GDP 的 domestic 指生产地点，不是购买者国籍。' },
    ],
    correct: 'b',
    calculation: 'GDP=C+I+G+X−M=500+120+140+80−110=730。',
    reveal: '“进口贡献为负”是支出恒等式中的记账位置，不是边际因果效应。一次进口冲击可能同时改变消费、投资、库存、汇率和本国中间投入，不能只观察 −M 项判断总效应。',
    revisit: '回看 06「Expenditure Identity」与 37–39「Final Demand → Industry Output、Gross Output ≠ GDP Contribution、Import Content」。',
    sourceIds: [1, 6, 15], staticSourceIds: [1, 6],
    staticTwin: { title: '变式 02 · 支出侧闭合', prompt: 'C=400、I=100、G=120、X=70、M=90。求 GDP，并说明若消费中包含 30 的进口品，为何不能再额外减一次 30。', answer: 'GDP=400+100+120+70−90=600。M=90 已统一剔除支出项目中的进口来源，再减 30 会重复扣除。' },
  },
  {
    id: 'nominal-real-deflator', mode: 'measurement', label: '测量实验 03 · Nominal / Real',
    title: '名义产出增加 6%，价格指数增加 2%，实际增长究竟是多少？',
    brief: '基期名义与实际 GDP 均为 100。本期名义 GDP 为 106，同一聚合口径的 GDP 价格指数由 1.00 升至 1.02。为唯一答案，按 value ratio = price-index ratio × quantity-index ratio 精确分解。',
    facts: [
      { label: 'Value ratio', value: '1.06', note: '名义变化' },
      { label: 'Price ratio', value: '1.02', note: 'GDP 聚合价格指数' },
      { label: 'Quantity ratio', value: '?', note: '不能直接做百分点减法' },
    ],
    options: [
      { id: 'a', label: '实际增长 6%，因为 GDP 总量就是 106', diagnosis: '把现价价值变化当成了数量变化。' },
      { id: 'b', label: '实际增长恰好 4.00%，因为 6−2=4', diagnosis: '4% 是小变化下的近似；题目要求用指数比率精确分解。' },
      { id: 'c', label: '实际增长约 3.92%，因为 1.06/1.02−1', diagnosis: '正确。Fisher 体系下相邻期价值比等于价格比与数量比的乘积。' },
    ],
    correct: 'c',
    calculation: 'Q₁/Q₀=(V₁/V₀)/(P₁/P₀)=1.06/1.02≈1.039216，因此实际增长约 3.92%。',
    reveal: '“名义增速−通胀”只是一阶近似，而且这里需要与 GDP 覆盖范围一致的价格指数；居民 CPI 不是 GDP deflator 的可互换替代品。',
    revisit: '回看 12–14「Current Price / Volume、Double Deflation 与 Fisher Chain-type Quantity Index」。',
    sourceIds: [1, 6, 8, 122], staticSourceIds: [6, 8, 122],
    staticTwin: { title: '变式 03 · 精确去价格', prompt: '名义 GDP 从 100 升至 108，匹配的价格指数从 1.00 升至 1.03。求精确实际增速与“8−3”的近似误差。', answer: '实际比率=1.08/1.03≈1.048544，实际增速约 4.854%；5% 近似高估约 0.146 个百分点。' },
  },
  {
    id: 'quarterly-annualized', mode: 'measurement', label: '测量实验 04 · Growth Clock',
    title: '一个季度增长 0.8%，为什么美国式标题可能写成 3.2%？',
    brief: '经季节调整的实际 GDP 数量指数由上季 100.0 升至本季 100.8。题目要求同时报告非年化环比和复合年化率；不假定未来真的会重复。',
    facts: [
      { label: 'Quarterly ratio', value: '100.8/100', note: '一个季度已经发生的变化' },
      { label: 'Annualization', value: 'ratio⁴−1', note: '四季复合的速度表达' },
      { label: 'Forecast status', value: 'none', note: '不是未来预测' },
    ],
    options: [
      { id: 'a', label: '环比 0.8%；年化约 3.24%，但后者不是年度同比或预测', diagnosis: '正确。年化只是把当季速度复合四次，未声称之后三季会实现。' },
      { id: 'b', label: '环比与年化都为 3.2%，只是单位名称不同', diagnosis: '两者时间尺度不同；4×0.8% 也只是近似，不是环比本身。' },
      { id: 'c', label: '年度同比必为 3.24%，因为一年有四季', diagnosis: '同比比较本季与四季前，需要另外三个季度的路径；不能由单季变化推出。' },
    ],
    correct: 'a',
    calculation: '非年化环比=100.8/100−1=0.8%；复合年化=(1.008)⁴−1≈3.2386%。',
    reveal: '阅读标题必须先找频率、调整方式与比较基准。中国、欧盟和美国常用展示习惯不同，同一个“3% 增长”在年比、季比或季比年化下不是同一对象。',
    revisit: '回看 15「Frequency、Annualization 与 Contribution」以及 17「Comparable Window」。',
    sourceIds: [21, 123], staticSourceIds: [21, 123],
    staticTwin: { title: '变式 04 · 一季三种时钟', prompt: '季调实际量指数 Qₜ₋₁=250、Qₜ=252.5、Qₜ₋₄=245。求非年化环比、复合年化率与同比，并说明能否据此断言未来路径。', answer: '环比=252.5/250−1=1%；年化=(1.01)⁴−1≈4.0604%；同比=252.5/245−1≈3.0612%。三者读取不同窗口，均不能单独推出未来路径。' },
  },
  {
    id: 'chain-nonadditivity', mode: 'measurement', label: '测量实验 05 · Chain Additivity',
    title: '链式实际 GDP 是 1,000，组件却加总为 1,030：哪一个数字错了？',
    brief: '官方表中某非参考期的链式实际量：GDP=1,000，消费=700，投资=250，政府=180，净出口=−100。各组件均为单独链结后按同一参考年缩放的 chained-dollar 展示量。',
    facts: [
      { label: 'Published aggregate', value: '1,000', note: '由聚合 Fisher 数量指数生成' },
      { label: 'Component sum', value: '1,030', note: '700+250+180−100' },
      { label: 'Reference period', value: 'no', note: '链式水平通常不可加' },
    ],
    options: [
      { id: 'a', label: 'GDP 应改为 1,030，因为恒等式永远要求链式水平可加', diagnosis: '现价恒等式可加，但各组件独立链结后的参考年货币量在非参考期一般不可加。' },
      { id: 'b', label: '不据此判错；份额用现价，增长贡献用官方贡献表或相邻期公式', diagnosis: '正确。把链式组件硬加或用它们算份额会产生伪残差。' },
      { id: 'c', label: '把 30 全部记作统计差异即可恢复经济含义', diagnosis: '这里的 30 来自指数构造的非可加性，不是 GDP 与 GDI 的统计差异。' },
    ],
    correct: 'b',
    calculation: '组件链式量之和 1,030 与聚合链式量 1,000 的差 30 不具独立经济含义；不得把它分配给某个组件。',
    reveal: 'Fisher 链式指数提高相对价格变化下的数量测量，却牺牲跨组件水平可加性。若要自建聚合，应从现价和上一年价格数据重新聚合并链结，而不是相加现成 chained dollars。',
    revisit: '回看 14「Fisher Chain-type Quantity Index」与 15「Frequency、Annualization 与 Contribution」。',
    sourceIds: [8, 122], staticSourceIds: [8, 122],
    staticTwin: { title: '变式 05 · 不制造伪残差', prompt: '某期链式 GDP=1,000，三个独立链结组件为 610、270、110，合计 990。可否把差额 10 称为“未解释增长”？应使用什么数据计算结构份额？', answer: '不可。差额是链式水平非可加性的可能结果；结构份额应用同一时期现价组件/现价 GDP，增长贡献用官方贡献或合规指数公式。' },
  },
  {
    id: 'statistical-carryover', mode: 'transmission', label: '传导实验 01 · Carry-over',
    title: '新一年每个季度都零环比，为什么全年平均仍可增长 3.03%？',
    brief: '上一年四个季调实际量指数依次为 96、98、100、102；新一年四季均保持 102。忽略修订，年度增长按四季平均与上年四季平均比较。',
    facts: [
      { label: 'Prior-year average', value: '99', note: '(96+98+100+102)/4' },
      { label: 'New-year average', value: '102', note: '四季均无环比增长' },
      { label: 'Inherited level', value: 'Q4=102', note: '进入新年时已较高' },
    ],
    options: [
      { id: 'a', label: '全年增长 0%，因为四个环比都是 0', diagnosis: '混淆了年内边际变化与年度平均相对上年平均的变化。' },
      { id: 'b', label: '全年增长 6.25%，因为 102/96−1', diagnosis: '这是新年水平相对上一年 Q1 的变化，不是两个年度平均之比。' },
      { id: 'c', label: '全年增长 102/99−1≈3.03%，全部来自统计翘尾', diagnosis: '正确。新年没有新增季比增长，但继承了上一年内已形成的高水平。' },
    ],
    correct: 'c',
    calculation: 'gannual=(102+102+102+102)/(96+98+100+102)−1=408/396−1≈3.0303%。',
    reveal: 'carry-over 不是额外生产，也不是预测模型；它只是季度路径与年度平均口径之间的算术。年初“高翘尾”可以抬高全年同比，却不代表当下动量强。',
    revisit: '回看 15「Frequency、Annualization 与 Contribution」以及 17「Comparable Window」。',
    sourceIds: [21, 25], staticSourceIds: [21, 25],
    staticTwin: { title: '变式 06 · 更高翘尾', prompt: '上一年四季为 90、96、102、108；新一年四季均为 108。求新年年度平均增速，并区分它与新年内环比。', answer: '上一年均值 99，新年均值 108，年度增长约 9.09%；新年四个季比均为 0，增长全由进入新年时的水平差带来。' },
  },
  {
    id: 'gdp-gdi-signal', mode: 'transmission', label: '传导实验 02 · GDP / GDI',
    title: '支出侧为 1,050、收入侧为 1,010，能否任选一个当作“真实产出”？',
    brief: '同一时期的现价 GDP 估计为 1,050，GDI 估计为 1,010。两者概念上测量同一境内生产活动，但来自不同且不完美的基础资料。题目只做账户与信号解释，不假设谁是真值。',
    facts: [
      { label: 'GDP', value: '1,050', note: '支出/产品侧估计' },
      { label: 'GDI', value: '1,010', note: '收入侧估计' },
      { label: 'Conceptual equality', value: 'yes', note: '测量误差使公布值不同' },
    ],
    options: [
      { id: 'a', label: '统计差异 GDP−GDI=40；简单平均为 1,030，但平均也不是真值保证', diagnosis: '正确。两种噪声信号可联合使用，不能仅凭较高或较低判定经济状态。' },
      { id: 'b', label: 'GDI 少 40，说明家庭隐瞒了 40 的收入', diagnosis: '统计差异汇总多类抽样、覆盖、时点和估计误差，不能直接归到某部门或行为。' },
      { id: 'c', label: 'GDP 必然准确，因为官方总是把支出侧定义为真值', diagnosis: '官方可以把 GDP 作为 featured estimate，但这不是观测到无误差的真值。' },
    ],
    correct: 'a',
    calculation: 'Statistical discrepancy=GDP−GDI=1,050−1,010=40；simple average=(1,050+1,010)/2=1,030。',
    reveal: 'GDP/GDI 平均或 GDPplus 等组合指标是在不同误差信号间提取信息；其权重依模型与历史修订性质。研究必须保存发布时可得的 vintage，不能用后来修订值代替当时决策信息。',
    revisit: '回看 08–09「Income Approach 与 GDP / GDI」，再看 57–58「Information Clock 与 Vintage / Revision」。',
    sourceIds: [9, 37, 49], staticSourceIds: [9, 37, 49],
    staticTwin: { title: '变式 07 · 两种噪声测量', prompt: '同一时期 GDP=1,200、GDI=1,160。求统计差异和简单平均，并说明能否把 40 自动分配为“企业少报利润”。', answer: '统计差异=40，简单平均=1,180；不能自动分配，必须追踪各组件来源与修订，平均也不保证等于潜在真值。' },
  },
  {
    id: 'growth-accounting-residual', mode: 'transmission', label: '传导实验 03 · Growth Accounting',
    title: '产出增长 3.5%，资本与劳动贡献后，剩余的 0.9 个百分点是什么？',
    brief: '使用连续时间/小变化的 Cobb–Douglas 增长核算：ΔlnY=ΔlnA+αΔlnK+(1−α)ΔlnH。资本收入份额 α=0.40，资本服务增长 5%，质量调整劳动投入 H 增长 1%，实际产出增长 3.5%。百分比按 log-point 近似给定。',
    facts: [
      { label: 'Capital contribution', value: '0.40×5%=2.0pp', note: '使用资本服务' },
      { label: 'Labor contribution', value: '0.60×1%=0.6pp', note: '使用质量调整投入' },
      { label: 'Output growth', value: '3.5%', note: '同一频率 log change' },
    ],
    options: [
      { id: 'a', label: 'TFP=3.5%，因为它等于总产出增长', diagnosis: '忽略资本和劳动投入已能解释的 2.6 个百分点。' },
      { id: 'b', label: 'ΔlnA=0.009，即 TFP 增长约 0.90%，贡献约 0.9pp；但不能直接命名为纯技术进步', diagnosis: '正确。TFP 的增长率约为 0.90%，在这条分解中对产出增长贡献约 0.9 个百分点；残差还可能混入利用率、质量、配置、加成和误差。' },
      { id: 'c', label: 'TFP=−1.5pp，因为应从资本增长 5% 直接减产出增长', diagnosis: '资本增长必须先乘相应收入份额，且还要计劳动贡献。' },
    ],
    correct: 'b',
    calculation: 'ΔlnA=0.035−0.40×0.05−0.60×0.01=0.009，即约 0.90% 的 TFP 增长；在这条 log-point 分解中，它对产出增长贡献约 0.9 个百分点。',
    reveal: '增长核算是条件分解，不是单凭恒等式识别技术因果。若规模报酬、竞争性要素定价、资本服务或劳动质量假设不成立，份额权重与残差解释都要改变。',
    revisit: '回看 20「Production Function as Scaffold」、24「Capital Services」与 27–29「TFP Residual、Growth Accounting、Factor-share Assumptions」。',
    sourceIds: [55, 64, 66, 117, 119], staticSourceIds: [55, 64, 117, 119],
    staticTwin: { title: '变式 08 · 另一组份额', prompt: 'α=0.35，资本服务增长 4%，质量调整劳动增长 2%，实际产出增长 3.2%。按同一 log-point 教学式求 TFP 残差。', answer: '资本贡献=1.4pp，劳动贡献=0.65×2=1.3pp；ΔlnA=0.005，即 TFP 增长约 0.50%，在这条分解中贡献约 0.5pp；它仍不是纯技术的直接观测。' },
  },
  {
    id: 'operating-leverage', mode: 'transmission', label: '传导实验 04 · Operating Leverage',
    title: '销量只增加 10%，为什么经营利润可以增加 40%？',
    brief: '一家单产品企业价格 P=10，单位变动成本 v=6，初始销量 q=100，期间固定经营成本 F=300。数量单位与货币单位一致；价格、单位成本、产品组合、汇率、税、利息和资本开支均冻结。',
    facts: [
      { label: 'Contribution margin', value: '(P−v)q=400', note: '覆盖固定成本前' },
      { label: 'Initial operating profit', value: '100', note: '400−300' },
      { label: 'Volume shock', value: '+10%', note: 'q 从 100 到 110' },
    ],
    options: [
      { id: 'a', label: '利润增加 10%，因为销量与利润同比例', diagnosis: '只有没有固定成本或利润率保持为特殊比例时才成立；题设固定成本造成放大。' },
      { id: 'b', label: '利润增加 4%，因为单位贡献毛利是价格的 40%', diagnosis: '40% 是单位贡献率，不是利润增长率。' },
      { id: 'c', label: '利润从 100 到 140，增长 40%；局部经营杠杆为 4', diagnosis: '正确。新增 10 单位贡献 40，在固定成本不变时全部进入经营利润。' },
    ],
    correct: 'c',
    calculation: 'π₀=(10−6)×100−300=100；π₁=4×110−300=140；利润增长=40%。局部 DOL=(P−v)q/π=400/100=4。',
    reveal: '经营杠杆在利润接近零时会爆大；π=0 时 DOL 无定义，π<0 时传统利润增长率和 DOL 符号通常失去直观经济解释。它不是企业永久常数。现实中价格、工资、原料、促销、产能与组合会共同变化，所以 GDP 数量增长不会机械乘一个固定倍数得到利润增长。',
    revisit: '回看 45–48「Real Output → Nominal Revenue、Revenue → Gross Profit、Value-added Distribution 与 Operating Leverage」。',
    sourceIds: [128], staticSourceIds: [128],
    staticTwin: { title: '变式 09 · 5% 销量冲击', prompt: 'P=20、v=12、q=50、F=300。销量增加 5%，其余冻结。求初始利润、新利润、利润增幅与初始局部经营杠杆。', answer: '初始贡献毛利 400、利润 100；新销量 52.5，新利润 120，增长 20%；初始 DOL=400/100=4。' },
  },
  {
    id: 'gdp-equity-break', mode: 'transmission', label: '传导实验 05 · GDP ≠ Equity Return',
    title: '国内实际 GDP 超预期，为什么本国股票指数仍可能下跌？',
    brief: '国内实际 GDP 增长比发布前调查一致预期高 1 个百分点；指数公司约 70% 收入来自海外，增长主要来自低利润率境内行业与新进入企业。公告同时使实际利率和折现率上升；价格还可能包含调查未捕获的即时信息。题目不要求数值估值。',
    facts: [
      { label: 'Cash-flow news', value: 'ambiguous', note: '行业、利润率、海外暴露与既有/新企业分配不同' },
      { label: 'Discount-rate news', value: 'up', note: '可压低现值' },
      { label: 'Survey surprise', value: '+1pp', note: '调查一致预期不等于价格的完整信息集' },
    ],
    options: [
      { id: 'a', label: '指数必须上涨，因为 GDP 与公司收入在定义上相等', diagnosis: 'GDP 是境内增加值，上市公司收入可含中间品、海外销售并排除非上市部门；二者没有定义恒等。' },
      { id: 'b', label: '指数必须下跌，因为高增长永远提高利率', diagnosis: '折现率只是其中一条路径；现金流、预期差、政策反应与估值状态可给出不同净结果。' },
      { id: 'c', label: '涨跌不由 GDP 符号单独决定；要分别估计现金流、折现率、覆盖范围与预期差', diagnosis: '正确。题设给出现金流泄漏和折现率上升，所以下跌完全可能，但并非高增长的普遍定律。' },
    ],
    correct: 'c',
    calculation: 'Campbell–Shiller 式方向性分解是：意外总回报≈未来现金流的现值新闻−未来折现率的现值新闻；两项须相对公告前同一信息集，并转换到可比的对数现值单位。+1pp GDP 调查 surprise 不能直接与回报百分点相减，必须先经过收入暴露、利润弹性与折现率响应的经验映射。',
    reveal: '跨国长期相关、单国时间序列预测与公告窗口 surprise response 是三个不同 estimand。快速经济增长也可能由新资本、新公司或劳动收入获得，未必进入既有上市股东的每股现金流。',
    revisit: '回看 50–59「Economy Coverage、Geographic Mismatch、EPS、Rent Capture、Expected Growth、Shareholder Return、Cross-country Evidence 与实时识别」。',
    sourceIds: [41, 105, 106, 126, 127], staticSourceIds: [41, 105, 106, 126, 127],
    staticTwin: { title: '变式 10 · 海外收入与折现率', prompt: '某国 GDP surprise 为正，但指数 80% 收入来自海外；国内新增产出集中于非上市企业，同时长端实际利率上升。应怎样写出可检验的股票反应假说？', answer: '分别测量国内/海外收入暴露、行业与上市覆盖、每股现金流修正、折现率变化及公告前预期；不能把 GDP surprise 的正号直接映射为指数回报正号。' },
  },
];
