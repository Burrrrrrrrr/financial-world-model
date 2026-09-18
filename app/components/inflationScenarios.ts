export type InflationMode = 'measurement' | 'mechanism';
export type InflationChoice = 'a' | 'b' | 'c';

export type InflationScenario = {
  id: string;
  mode: InflationMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: InflationChoice; label: string; diagnosis: string }[];
  correct: InflationChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
};

export const inflationModes: { id: InflationMode; label: string; title: string; description: string }[] = [
  { id: 'measurement', label: 'MODE A', title: '先把“通胀”量对', description: '从权重、时钟、CPI–PCE 口径、质量和住房服务走到 breakeven 的测量边界。' },
  { id: 'mechanism', label: 'MODE B', title: '再把价格形成接到企业', description: '检查成本与加成、工资生产率、汇率传导、相对价持久性以及收入—毛利断裂。' },
];

export const inflationScenarios: InflationScenario[] = [
  {
    id: 'weighted-index-contribution', mode: 'measurement', label: '测量实验 01 · Weighted Index',
    title: '一个分项涨 10%、另一个跌 5%，总指数为什么只涨 4%？',
    brief: '基期支出权重分别为 60% 和 40%，本期两个 price relative 分别为 1.10 和 0.95，权重和严格为 1。题目使用冻结的固定篮子教学指数，不处理替代、链结、质量变化或样本更新，也不冒充任何官方 CPI 的完整算法。',
    facts: [
      { label: 'Item A', value: 'w=60% · relative=1.10', note: '分项价格上涨 10%' },
      { label: 'Item B', value: 'w=40% · relative=0.95', note: '分项价格下降 5%' },
      { label: 'Teaching index', value: 'Σwᵢrᵢ', note: '贡献用百分点表达' },
    ],
    options: [
      { id: 'a', label: '指数从 100 到 104；A、B 贡献分别为 +6pp、−2pp，总通胀 4%', diagnosis: '正确。权重乘分项涨幅得到算术贡献；贡献百分点相加才是冻结教学桥中的总涨幅。' },
      { id: 'b', label: '通胀 2.5%，因为 10% 与 −5% 的简单平均为 2.5%', diagnosis: '简单平均暗含两个分项等权，违反题设 60/40 的支出权重。' },
      { id: 'c', label: '通胀 6%，因为只需保留上涨分项的贡献', diagnosis: '下跌分项同样进入总指数；上涨贡献不等于总体通胀。' },
    ],
    correct: 'a',
    calculation: 'I₁/I₀=0.60×1.10+0.40×0.95=1.04。A 贡献=0.60×10%=+6pp；B 贡献=0.40×(−5%)=−2pp；合计 4pp。',
    reveal: '“贡献最大”是权重与价格变化的算术结果，不等于该分项在结构上“造成”了其他价格上涨。官方指数还会处理更细聚合、权重更新、替代、质量和样本变化。',
    revisit: '回看 03「Quote → Price Relative → Aggregate」、13「Reference / Chain / Contribution」与 22「Contribution / Distribution / Diffusion」。',
    sourceIds: [1, 12], staticSourceIds: [1],
    staticTwin: { title: '变式 01 · 上涨与下跌同时存在', prompt: '固定权重为 70% 和 30%，两项价格分别上涨 8% 和下降 4%。求指数、两项贡献和总通胀。', answer: '指数比=0.70×1.08+0.30×0.96=1.044，即指数 104.4；贡献为 +5.6pp 与 −1.2pp，总通胀 4.4%。' },
  },
  {
    id: 'mom-annualized-yoy-base', mode: 'measurement', label: '测量实验 02 · Inflation Clock',
    title: '价格仍在上涨，为什么下一月同比通胀反而可以下降？',
    brief: '冻结同一口径指数：Iₜ₋₁₂=98.0、Iₜ₋₁=100.4、Iₜ=101.0、Iₜ₋₁₁=99.0、Iₜ₊₁=101.2。题设已完成所需季节调整；月率年化只把一个月速度复合十二次，不是预测。',
    facts: [
      { label: 'Current window', value: '98.0 → 100.4 → 101.0', note: '分别提供同比与环比基准' },
      { label: 'Next month', value: '99.0 → 101.2', note: '同比旧分母向前滚动' },
      { label: 'Annualise', value: '(Iₜ/Iₜ₋₁)¹²−1', note: '速度表达，不是未来路径' },
    ],
    options: [
      { id: 'a', label: 'MoM、月率年化和 YoY 都是 0.60%，只是名称不同', diagnosis: '三者使用不同窗口；月率年化还需复合，不能与月率或同比互换。' },
      { id: 'b', label: '只要 101.0 升到 101.2，下一月 YoY 就不可能下降', diagnosis: '同比同时更换新分子和十二个月前的旧分母；价格水平上涨不保证同比上升。' },
      { id: 'c', label: '当前 MoM≈0.598%、年化≈7.412%、YoY≈3.061%；下一月 MoM≈0.198%、YoY≈2.222%', diagnosis: '正确。下一月价格继续上涨，但旧分母由 98 换成 99 且新月速度较慢，同比因窗口滚动而下降。' },
    ],
    correct: 'c',
    calculation: '101/100.4−1≈0.59761%；(101/100.4)¹²−1≈7.41178%；101/98−1≈3.06122%。下一月：101.2/101−1≈0.19802%；101.2/99−1≈2.22222%。',
    reveal: 'Base effect 是比较窗口的算术，不是冲击身份。同比下降但仍为正叫 disinflation，不是价格水平下降的 deflation；月率年化也不能被读成未来十二个月预测。',
    revisit: '回看 20「MoM / Annualised / YoY / Annual Average / Base Effect」。',
    sourceIds: [1, 16], staticSourceIds: [1, 16],
    staticTwin: { title: '变式 02 · 同一指数的三只时钟', prompt: 'Iₜ₋₁₂=196、Iₜ₋₁=200、Iₜ=201、Iₜ₋₁₁=198、Iₜ₊₁=201.2。求当前月率、复合年化率、同比，以及下一月月率和同比。', answer: '当前 MoM=0.5%；年化=(1.005)¹²−1≈6.1678%；YoY=201/196−1≈2.5510%。下一月 MoM≈0.09950%，YoY=201.2/198−1≈1.6162%。' },
  },
  {
    id: 'cpi-pce-scope-weight', mode: 'measurement', label: '测量实验 03 · CPI / PCE Bridge',
    title: '分项价格完全相同，为什么 CPI 与 PCE 教学桥仍给出不同通胀？',
    brief: '住房、医疗、其他价格分别上涨 6%、2%、1%；CPI 教学权重为 40%、8%、52%，PCE 教学权重为 30%、20%、50%。这里只隔离权重效应，现实指数还存在 scope、formula、source data 与 revision 差异。',
    facts: [
      { label: 'Housing', value: '+6% · CPI 40% · PCE 30%', note: '权重不同' },
      { label: 'Health care', value: '+2% · CPI 8% · PCE 20%', note: 'PCE 可含代表家庭支付' },
      { label: 'Other', value: '+1% · CPI 52% · PCE 50%', note: '两套权重均和为 1' },
    ],
    options: [
      { id: 'a', label: 'CPI 永远高于 PCE，而且差额必然全由医疗第三方支付造成', diagnosis: '把一次冻结练习升级成普遍规律，也把多类差异错误归为一个原因。' },
      { id: 'b', label: '本题 CPI=3.08%、PCE=2.70%，权重桥差 0.38pp；现实差异不止权重', diagnosis: '正确。现实还须逐项处理消费范围、付款主体、指数公式、来源资料和修订。' },
      { id: 'c', label: '二者都叫居民消费价格，所以理论上必须得到同一数字', diagnosis: 'CPI 与 PCE 的目标范围、付款边界、权重来源和公式并不相同。' },
    ],
    correct: 'b',
    calculation: 'CPI=0.40×6%+0.08×2%+0.52×1%=3.08%；PCE=0.30×6%+0.20×2%+0.50×1%=2.70%；差=0.38pp。',
    reveal: '同一组分项价格也能因权重不同得到不同聚合；但不能据此断言现实 CPI–PCE 差额全部是权重效应，更不能把任一个称为另一指标的“更准确版本”。',
    revisit: '回看 06「CPI」、07「PCE」、09「CPI–PCE–GDP Four-difference Bridge」与 10「Plutocratic / Democratic / Personal Weights」。',
    sourceIds: [9, 18, 19, 20, 25, 26], staticSourceIds: [9, 18],
    staticTwin: { title: '变式 03 · 差值不是结构常数', prompt: '住房、医疗、其他分别涨 5%、3%、1%；CPI 权重 45%/5%/50%，PCE 权重 30%/25%/45%。按固定权重桥计算。', answer: 'CPI=2.90%，PCE=2.70%，差 0.20pp。本题仍不能推出 CPI 一般高于 PCE。' },
  },
  {
    id: 'quality-oer-boundary', mode: 'measurement', label: '测量实验 04 · Quality / OER',
    title: '电脑贴价涨 5%、房价涨 10%，为什么本题总指数只涨 0.95%？',
    brief: '电脑贴价上涨 5%，但冻结质量调整后的 constant-quality price relative 为 0.99；房屋资产价上涨 10%，但 OER 住房服务 relative 为 1.04。权重分别为电脑 5%、OER 25%、其他 70%，其他 relative 为 1.00。',
    facts: [
      { label: 'Computer', value: 'sticker +5% · quality relative 0.99', note: '使用给定同质价格' },
      { label: 'Owner housing', value: 'house price +10% · OER relative 1.04', note: '资产价与住房服务价分开' },
      { label: 'Weights', value: '5% / 25% / 70%', note: '固定权重教学桥' },
    ],
    options: [
      { id: 'a', label: '通胀 2.75%，即 5%×5%+10%×25%', diagnosis: '错误地用电脑贴价和房屋资产价格替代题设的同质价格与住房服务价格。' },
      { id: 'b', label: '质量提高后电脑应从指数删除，自住房则改用按揭付款', diagnosis: '质量调整不是删除商品；OER 也不是按揭现金付款指数。' },
      { id: 'c', label: '指数比=1.0095，即通胀 0.95%；必须使用给定的同质价格与租赁等价服务价', diagnosis: '正确。电脑贡献 −0.05pp，OER 贡献 +1.00pp，其余为零。' },
    ],
    correct: 'c',
    calculation: 'I₁/I₀=0.05×0.99+0.25×1.04+0.70×1.00=1.0095，通胀=0.95%。',
    reveal: '质量调整估计“若质量保持可比，价格怎样变化”；OER 估计自住房提供的住房服务。两者都有方法与误差边界，但不能用贴价、房价或按揭付款直接替代。',
    revisit: '回看 14「Quality / Package Size / Shrinkflation」与 16「Rent / OER」。',
    sourceIds: [8, 13, 14], staticSourceIds: [13, 14],
    staticTwin: { title: '变式 04 · 同质价格与住房服务', prompt: '手机贴价涨 8%，给定同质 relative=0.98；房价涨 12%，给定 OER relative=1.03；权重为 10%、30%、60%，其他不变。求指数通胀。', answer: '0.10×0.98+0.30×1.03+0.60=1.007，即通胀 0.70%；贴价与房价不是直接输入。' },
  },
  {
    id: 'breakeven-decomposition', mode: 'measurement', label: '测量实验 05 · Inflation Compensation',
    title: '名义债减 TIPS 得到 2.60%，为什么不能直接改名为“市场预期通胀”？',
    brief: '同期限且已匹配计息约定：名义收益率 4.20%、实际收益率 1.60%。模型给定 inflation-risk premium=+0.45pp，综合 liquidity/indexation/tax wedge=−0.10pp，并冻结 BE=Eπ+IRP+W 的符号约定。',
    facts: [
      { label: 'Nominal − real', value: '4.20% − 1.60%', note: 'raw inflation compensation' },
      { label: 'Inflation-risk premium', value: '+0.45pp', note: '题设模型估计' },
      { label: 'Other wedge W', value: '−0.10pp', note: '符号不可自行翻转' },
    ],
    options: [
      { id: 'a', label: '预期通胀必为 2.60%，因为 breakeven 只包含预期', diagnosis: 'breakeven 还可包含通胀风险、流动性、指数化、税与期权等相对定价因素。' },
      { id: 'b', label: 'Raw breakeven=2.60%，题设模型隐含预期=2.25%，且分解依赖模型', diagnosis: '正确。Eπ=2.60−0.45−(−0.10)=2.25%。' },
      { id: 'c', label: '预期=2.60−0.45−0.10=2.05%', diagnosis: '没有遵守 W=−0.10pp 的冻结符号，重复向下扣除了负楔子。' },
    ],
    correct: 'b',
    calculation: 'BE=4.20%−1.60%=2.60%；Eπ=BE−IRP−W=2.60%−0.45%−(−0.10%)=2.25%。',
    reveal: '2.60% 是市场价格中的通胀补偿，不是直接观测的纯预期；2.25% 也只是题设模型和楔子估计下的隐含值。现实比较还必须匹配期限、现金流与指数化细节。',
    revisit: '回看 58「Realized Inflation / Nominal Bond / TIPS / Breakeven」。',
    sourceIds: [106, 107], staticSourceIds: [106, 107],
    staticTwin: { title: '变式 05 · 楔子的符号', prompt: '名义 3.80%、实际 1.30%、IRP=+0.30pp、W=−0.15pp。求 raw breakeven 与题设模型隐含预期。', answer: 'Raw breakeven=2.50%；Eπ=2.50−0.30−(−0.15)=2.35%。两者都不是无需模型的通胀真值。' },
  },
  {
    id: 'unit-cost-markup', mode: 'mechanism', label: '机制实验 01 · Unit Cost × Markup',
    title: '单位成本涨 10%，售价为什么只上涨 5.6%？',
    brief: '单位成本 UC₀=80 货币/单位，markup factor μ₀=P/UC=1.25，因此 P₀=100。随后 UC₁=88，μ₁=1.20；产品、税、质量和计量单位冻结。这里的 UC 是教学账本，不自动等于边际成本、ULC 或会计销售成本。',
    facts: [
      { label: 'Initial', value: 'UC₀=80 · μ₀=1.25', note: 'P₀=100' },
      { label: 'After shock', value: 'UC₁=88 · μ₁=1.20', note: '成本上升、加成压缩' },
      { label: 'Identity', value: 'P=UC×μ', note: 'μ 是无量纲 factor' },
    ],
    options: [
      { id: 'a', label: '价格从 100 到 105.6，即 +5.6%；加成压缩吸收了部分成本冲击', diagnosis: '正确。1.10×(1.20/1.25)=1.056。' },
      { id: 'b', label: '价格必涨 10%，因为单位成本一定一比一传导', diagnosis: '忽略 markup factor 从 1.25 降到 1.20，也把传导率预先固定为 1。' },
      { id: 'c', label: '价格精确涨 5%，因为成本 +10% 减加成 5 个百分点', diagnosis: '1.25→1.20 不是 −5%，而且普通百分比乘法含交叉项。' },
    ],
    correct: 'a',
    calculation: 'P₁=88×1.20=105.6；P₁/P₀=1.10×0.96=1.056，所以普通涨幅 5.6%。对数核对：ln1.10+ln0.96≈5.4488 log points。',
    reveal: '成本上涨可以被加成压缩、数量下降、质量/组合变化或替代部分吸收；反过来，需求强也可能让成本不变而加成上升。账本分解本身不识别市场势力因果。',
    revisit: '回看 25「Price = μ × MC」与 30「Markup / Gross Margin / Unit Profit / Corporate Profit」。',
    sourceIds: [75, 76, 77, 78], staticSourceIds: [75, 77],
    staticTwin: { title: '变式 06 · 成本上涨、加成收缩', prompt: 'UC₀=50、μ₀=1.40、P₀=70；UC 上升 8% 至 54，μ 降至 1.30。求新价格和涨幅。', answer: 'P₁=54×1.30=70.2，普通价格涨幅=70.2/70−1≈0.2857%。' },
  },
  {
    id: 'wage-productivity-ulc', mode: 'mechanism', label: '机制实验 02 · Wage / Productivity / ULC',
    title: '小时报酬涨 6%，单位劳动成本为什么只涨约 3.92%？',
    brief: '小时报酬从 30 升至 31.8，劳动生产率从每小时 3 个实际产出单位升至 3.06。没有给出其他成本、加成、需求或价格调整信息，因此只能计算 ULC，不能唯一推出 CPI。',
    facts: [
      { label: 'Compensation/hour', value: '30 → 31.8', note: '+6%' },
      { label: 'Real output/hour', value: '3.00 → 3.06', note: '+2%' },
      { label: 'ULC', value: '(货币/小时)/(产出/小时)', note: '小时单位约去' },
    ],
    options: [
      { id: 'a', label: 'ULC 与 CPI 都上涨 6%', diagnosis: '忽略生产率分母，也把 ULC 机械映射成消费价格。' },
      { id: 'b', label: 'ULC 精确上涨 4%，价格也必须上涨 4%', diagnosis: '6−2 只是小变化近似；价格结论还缺成本份额、加成、需求与时滞。' },
      { id: 'c', label: 'ULC 精确上涨约 3.92%；是否进入价格还取决于其他成本、加成、需求和传导', diagnosis: '正确。ULC 比率=1.06/1.02。' },
    ],
    correct: 'c',
    calculation: 'ULC₀=30/3=10；ULC₁=31.8/3.06≈10.39216；增长=1.06/1.02−1≈3.92157%。',
    reveal: '工资增长不是 ULC 增长，ULC 也不是 CPI。持续工资—价格反馈还需要实际工资诉求、生产率、劳动成本份额、需求、合同、加成、预期与名义制度共同闭合。',
    revisit: '回看 29「Wage / Productivity / ULC / Feedback Conditions」。',
    sourceIds: [55, 74], staticSourceIds: [74],
    staticTwin: { title: '变式 07 · 生产率下降', prompt: '小时报酬上涨 4%，劳动生产率下降 1%。求 ULC 精确涨幅，并说明能否单独推出 CPI。', answer: 'ULC 比率=1.04/0.99≈1.050505，涨约 5.0505%；仍不能单独推出 CPI 或企业价格。' },
  },
  {
    id: 'fx-pass-through', mode: 'mechanism', label: '机制实验 03 · FX Pass-through',
    title: '本币贬值 10%，为什么题设零售价只上涨约 2.63%？',
    brief: '汇率按本币/外币报价，由 7.00 升至 7.70；出口商外币报价由 100 降至 97。边境本币价 Pᵇ=eP*。题设固定窗口给定 log pass-through elasticity β=ΔlnPʳ/ΔlnPᵇ=0.40，其他零售成本冻结。',
    facts: [
      { label: 'Exchange rate e', value: '7.00 → 7.70', note: '本币贬值 10%' },
      { label: 'Exporter price P*', value: '100 → 97', note: '外币报价下降 3%' },
      { label: 'Retail elasticity', value: 'β=0.40', note: '只属于题设窗口' },
    ],
    options: [
      { id: 'a', label: '边境价和零售价都上涨 10%', diagnosis: '忽略出口商外币报价下降和边境到零售的不完全传导。' },
      { id: 'b', label: '边境价 +6.7%，按给定 log elasticity 零售价约 +2.628%；参数不能外推', diagnosis: '正确。先用 1.10×0.97，再用 exp[0.40×ln(1.067)]。' },
      { id: 'c', label: '边境价精确 +7%，零售价精确 +2.8%', diagnosis: '把乘法与 log elasticity 两个非线性步骤都错误线性化。' },
    ],
    correct: 'b',
    calculation: 'Pᵇ₀=700，Pᵇ₁=7.70×97=746.9，边境价涨 6.7%。零售价比=exp[0.40×ln(1.067)]≈1.02627977，即涨约 2.628%。',
    reveal: '汇率传导依报价货币、进口投入、边境定价、本地分销、竞争、需求、政策制度和时间窗口而变；汇率变化本身也不是一个已识别的外生冲击。',
    revisit: '回看 32「FX / Import-price Pass-through」。',
    sourceIds: [79, 80, 81, 82], staticSourceIds: [79, 80],
    staticTwin: { title: '变式 08 · 两道传导闸门', prompt: '本币/外币汇率上涨 5%，外币出口价下降 2%，给定 log elasticity=0.60。求边境价和零售价涨幅。', answer: '边境价比=1.05×0.98=1.029，即 +2.9%；零售价比=exp[0.60×ln(1.029)]≈1.0173004，即约 +1.7300%。' },
  },
  {
    id: 'relative-price-jump-persistence', mode: 'mechanism', label: '机制实验 04 · Level Jump / Persistence',
    title: '能源价格永久高 50%，为什么总体通胀只出现一期？',
    brief: '能源固定权重 10%，其 price relative 路径为 1.00、1.50、1.50、1.50；其他 90% 价格始终为 1.00。没有工资、运输、预期、财政或其他第二轮效应。',
    facts: [
      { label: 'Energy relative', value: '1.00 → 1.50 → 1.50 → 1.50', note: '一次跳升后保持' },
      { label: 'Energy weight', value: '10%', note: '其他权重 90%' },
      { label: 'Propagation', value: 'none', note: '冻结全部二轮机制' },
    ],
    options: [
      { id: 'a', label: '每期通胀都是 5%，因为能源一直比初始高 50%', diagnosis: '把价格水平差异误写成每期继续变化。' },
      { id: 'b', label: '第二期通胀为零，所以总指数必须回到 100', diagnosis: '零通胀表示水平不再变化，不表示先前涨幅逆转。' },
      { id: 'c', label: '指数 100→105→105→105，通胀 5%→0→0；持续性需要新增涨价或传播', diagnosis: '正确。高相对价和高总体价格水平可以持续，而通胀率回到零。' },
    ],
    correct: 'c',
    calculation: 'I=100×[0.10×Renergy+0.90]，所以路径为 100、105、105、105；相邻期通胀为 5%、0%、0%。',
    reveal: '“暂时通胀”必须说明是 rate shock、component contribution 还是 price-level effect；它不自动承诺价格水平回到原点。持续通胀还需冲击继续发生或反馈链条闭合。',
    revisit: '回看 02「Price Level / Inflation / Relative Price」、28「Relative-price Shock → Aggregate Inflation」与 47「Transitory / Persistent / Propagation」。',
    sourceIds: [53, 71, 85], staticSourceIds: [53, 71],
    staticTwin: { title: '变式 09 · 食品一次跳升', prompt: '食品权重 20%，价格一次上涨 25% 后保持，其他价格不变。求总指数和通胀路径。', answer: '指数 100→105→105；通胀 5%→0%。食品相对价仍高 25%，但没有持续新增通胀。' },
  },
  {
    id: 'corporate-gross-margin-shock', mode: 'mechanism', label: '机制实验 05 · Revenue / Gross Profit',
    title: '名义收入上涨 1.76%，会计毛利为什么反而下降 7.2%？',
    brief: '初始净售价 P₀=100、销量 q₀=100、每单位会计 cost of sales c₀=70。随后 P 上涨 6% 至 106，q 下降 4% 至 96，c 上涨 10% 至 77；存货计价、组合、退货、折让、汇率和会计分类冻结。',
    facts: [
      { label: 'Initial', value: 'P=100 · q=100 · c=70', note: 'Revenue=10,000 · GP=3,000' },
      { label: 'After shock', value: 'P=106 · q=96 · c=77', note: '价、量、成本同时变化' },
      { label: 'Accounting bridge', value: 'GP=(P−c)q', note: 'c 不是经济学边际成本' },
    ],
    options: [
      { id: 'a', label: '收入 +1.76%，毛利 −7.2%，毛利率由 30% 降至约 27.36%', diagnosis: '正确。售价上涨没有覆盖更快的单位销售成本上涨和销量下降。' },
      { id: 'b', label: '毛利上涨 1.76%，因为名义收入上涨', diagnosis: '收入变化不能直接改名为利润变化。' },
      { id: 'c', label: '毛利率仍为 30%，因为售价与成本都属于“通胀”', diagnosis: '售价与成本涨幅、基数和数量路径不同；“都在涨”不固定毛利率。' },
    ],
    correct: 'a',
    calculation: 'Revenue₀=10,000，GP₀=3,000，GM₀=30%。Revenue₁=106×96=10,176（+1.76%）；GP₁=(106−77)×96=2,784（−7.2%）；GM₁=29/106≈27.3585%，下降约 2.6415pp。',
    reveal: '名义收入还要经过销量、成本、会计分类、营业费用、税债、资本开支与股本才成为真实每股现金流。Gross profit、contribution margin、operating profit 和 economic profit 不能互换。',
    revisit: '回看 30「Markup / Gross Margin / Unit Profit / Corporate Profit」、54「Inflation → Nominal Revenue」、55「Input Cost → Pass-through」与 56「Margin / Profit / EPS」。',
    sourceIds: [76, 77, 78, 117, 118, 119], staticSourceIds: [117, 118, 119],
    staticTwin: { title: '变式 10 · 提价仍未守住毛利', prompt: '初始 P=50、q=200、c=35；售价 +8% 至 54，销量 −5% 至 190，单位销售成本 +12% 至 39.2。求收入、毛利和毛利率变化。', answer: '收入 10,000→10,260（+2.6%）；毛利 3,000→(54−39.2)×190=2,812（−6.2667%）；毛利率 30%→约 27.4074%，下降约 2.5926pp。' },
  },
];
