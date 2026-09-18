export type YieldCurveMode = 'coordinates' | 'decomposition';
export type YieldCurveChoice = 'a' | 'b' | 'c';

export type YieldCurveAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type YieldCurveScenario = {
  id: `M${number}`;
  mode: YieldCurveMode;
  label: string;
  title: string;
  brief: string;
  synthetic: true;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: YieldCurveChoice; label: string; diagnosis: string }[];
  correct: YieldCurveChoice;
  calculation: string;
  reveal: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: YieldCurveAssertion[];
  staticTwin: {
    id: `K${number}`;
    title: string;
    prompt: string;
    choices: { id: YieldCurveChoice; label: string }[];
    correct: YieldCurveChoice;
    calculations: string[];
    answer: string;
    sourceIds: number[];
    numericAssertions: YieldCurveAssertion[];
  };
};

export const yieldCurveModes: { id: YieldCurveMode; label: string; title: string; description: string }[] = [
  { id: 'coordinates', label: 'MODE A', title: '先把价格、坐标与回报量对', description: '复算现值、bootstrap、forward、加法分解与持有期超额回报。' },
  { id: 'decomposition', label: 'MODE B', title: '再判断风险、供求与模型边界', description: '区分久期与凸性、NS 载荷、inflation compensation、duration supply 和模型范围。' },
];

export const yieldCurveScenarios: YieldCurveScenario[] = [
  {
    id: 'M1', mode: 'coordinates', label: '坐标实验 01 · YTM', title: '五期现金流在给定有效年 YTM 下的 dirty price 是多少？',
    brief: 'SYNTHETIC：估值日正好是付息日；五笔年度票息未付，第五笔同时返还本金，无应计利息。', synthetic: true,
    facts: [
      { label: '面值 / 年票息', value: '100 / 4', note: '五笔票息，本金只在第 5 年归还' },
      { label: '有效年 YTM', value: '5.5%', note: '年付息；不是连续复利' },
      { label: '估值时钟', value: '付息日', note: 'accrued interest = 0' },
    ],
    formulas: ['Pdirty = Σ CFt / (1+YTM)^t', '第 5 期现金流 = 4 + 100'], formulaUnits: '价格为每 100 面值的货币单位；YTM 先写成小数。',
    options: [
      { id: 'a', label: '93.594573287', diagnosis: '正确：五笔票息和第五年本金均按有效年率贴现。' },
      { id: 'b', label: '95.000000000', diagnosis: '你可能用“票息率低 1.5 个百分点”直接减面值。请回到每一期现金流。' },
      { id: 'c', label: '82.000000000', diagnosis: '请检查你是否遗漏了中间票息，或把 5.5% 错当为每期绝对折扣。' },
    ], correct: 'a',
    calculation: 'P=4/1.055+4/1.055²+4/1.055³+4/1.055⁴+104/1.055⁵≈93.594573287。',
    reveal: 'YTM 是把这只债券多笔现金流压成一个内部收益率的报价坐标；它不是零息曲线上一个原始观测点。', primarySectionId: 'yield-to-maturity', remediationSectionIds: ['cash-flow-contract', 'clean-dirty', 'discount-factor', 'compounding-units'], sourceIds: [10],
    numericAssertions: [{ key: 'dirtyPricePer100', expected: 93.59457328657135, unit: 'currencyPer100', tolerance: 1e-9 }],
    staticTwin: { id: 'K1', title: '变式 01 · YTM 上升', prompt: '同一五年、4% 年票息债，估值仍在付息日，有效年 YTM 改为 5.75%。', choices: [{ id: 'a', label: '93.594573287' }, { id: 'b', label: '92.577957019' }, { id: 'c', label: '94.250000000' }], correct: 'b', calculations: ['列出第 1–4 年的 4 与第 5 年的 104。', 'P=Σ₁⁵ 4/(1.0575)^t+100/(1.0575)^5。', '按九位小数显示为 92.577957019。'], answer: 'B。价格约 92.577957019；依然是 dirty price，无 accrued interest。', sourceIds: [10], numericAssertions: [{ key: 'dirtyPricePer100', expected: 92.57795701857506, unit: 'currencyPer100', tolerance: 1e-9 }] },
  },
  {
    id: 'M2', mode: 'coordinates', label: '坐标实验 02 · Bootstrap', title: '一年与两年 par 债如何递归恢复贴现因子和两年 zero rate？',
    brief: 'SYNTHETIC：两只债都以 100 定价、年付息，zero 使用有效年复利。', synthetic: true,
    facts: [{ label: '1Y par coupon', value: '4%', note: '1Y 现金流 104' }, { label: '2Y par coupon', value: '5%', note: '第 1 年 5，第 2 年 105' }, { label: '报价', value: '100 / 100', note: '两只均为 par bond' }],
    formulas: ['100=104D1', '100=5D1+105D2', 'z2,EA=D2^(-1/2)-1'], formulaUnits: 'D 无量纲；zero rate 为年化百分比。',
    options: [
      { id: 'a', label: 'D1=.960000; D2=.905000; z2=5.000000%', diagnosis: '你似乎直接用 coupon rate 当 zero rate。请先用 1Y 现金流求 D1。' },
      { id: 'b', label: 'D1=.961538; D2=.952381; z2=2.469508%', diagnosis: '请检查 2Y 末期现金流是 105，而不是只有票息或本金。' },
      { id: 'c', label: 'D1=.9615384615384615; D2=.9065934065934066; z2=5.02524948936342%', diagnosis: '正确：先剥离已知的一年现金流，再由 D2 转成有效年 zero。' },
    ], correct: 'c', calculation: 'D1=100/104=.9615384615384615；D2=(100−5D1)/105=.9065934065934066；z2=D2^(−1/2)−1=5.02524948936342%。', reveal: 'par coupon 使整只假想债价格等于面值；zero rate 来自对单一到期现金流的贴现因子。', primarySectionId: 'bootstrap', remediationSectionIds: ['discount-factor', 'zero-yield', 'par-yield', 'compounding-units'], sourceIds: [1, 7, 10], numericAssertions: [{ key: 'discountFactor1Y', expected: 0.9615384615384615, unit: 'discountFactor', tolerance: 1e-12 }, { key: 'discountFactor2Y', expected: 0.9065934065934066, unit: 'discountFactor', tolerance: 1e-12 }, { key: 'zeroRate2YEffectiveAnnualPct', expected: 5.02524948936342, unit: 'annualPercentRate', tolerance: 1e-9 }],
    staticTwin: { id: 'K2', title: '变式 02 · 另一组 par 输入', prompt: '1Y 与 2Y 年付息 par coupon 为 3.5% 和 4.5%，均按 100 定价。', choices: [{ id: 'a', label: 'D1=.9661835748792271; D2=.9153318077803204; z2=4.52272480183436%' }, { id: 'b', label: 'D1=.965000; D2=.910000; z2=4.500000%' }, { id: 'c', label: 'D1=.966184; D2=.966184; z2=1.764%' }], correct: 'a', calculations: ['D1=100/103.5=.9661835748792271。', 'D2=(100−4.5D1)/104.5=.9153318077803204。', 'z2=D2^(−1/2)−1=4.52272480183436%。'], answer: 'A。par coupon 与 zero rate 不同；第一期票息必须先剥离。', sourceIds: [1, 7, 10], numericAssertions: [{ key: 'discountFactor1Y', expected: 0.9661835748792271, unit: 'discountFactor', tolerance: 1e-12 }, { key: 'discountFactor2Y', expected: 0.9153318077803204, unit: 'discountFactor', tolerance: 1e-12 }, { key: 'zeroRate2YEffectiveAnnualPct', expected: 4.52272480183436, unit: 'annualPercentRate', tolerance: 1e-9 }] },
  },
  {
    id: 'M3', mode: 'coordinates', label: '坐标实验 03 · Forward', title: '两个 effective-annual zero rate 隐含的 1y1y forward 是多少？',
    brief: 'SYNTHETIC：只做今日跨期限价格恒等式，不把 forward 称为未来 spot 的预测。', synthetic: true,
    facts: [{ label: '1Y zero', value: '3%', note: 'effective annual' }, { label: '2Y zero', value: '4%', note: 'effective annual' }, { label: '目标区间', value: '[1Y,2Y]', note: '区间 forward，不是 2Y 点值' }], formulas: ['(1+z2)^2=(1+z1)(1+f1,2)'], formulaUnits: '输入先写成小数；输出为有效年百分比。',
    options: [{ id: 'a', label: '1.000000000000%', diagnosis: '你直接相减了两个 zero rate。请回到两条投资路径的复利价格恒等式。' }, { id: 'b', label: '5.00970873786408%', diagnosis: '正确：这是今日两个到期价格隐含的 [1Y,2Y] 区间价格。' }, { id: 'c', label: '5.000000000000%', diagnosis: '这是忽略复利交叉项的近似。请使用 gross return 的比例。' }], correct: 'b', calculation: 'f=(1.04²/1.03)−1=5.00970873786408%。', reveal: 'forward 是今日可锁定的未来区间价格；未来实现 spot 还会受新信息和风险补偿影响。', primarySectionId: 'forward-rate', remediationSectionIds: ['discount-factor', 'compounding-units', 'forward-not-forecast'], sourceIds: [3, 7, 10, 12, 13], numericAssertions: [{ key: 'forward1y1yEffectiveAnnualPct', expected: 5.00970873786408, unit: 'annualPercentRate', tolerance: 1e-9 }],
    staticTwin: { id: 'K3', title: '变式 03 · Forward', prompt: '1Y zero=3.25%，2Y zero=4.5%，均为 effective annual。', choices: [{ id: 'a', label: '1.25%' }, { id: 'b', label: '5.75%' }, { id: 'c', label: '5.76513317191283%' }], correct: 'c', calculations: ['f=(1.045²/1.0325)−1。', '结果为 5.76513317191283%。'], answer: 'C。这仍是区间 forward，不是对未来一年 spot 的无偏承诺。', sourceIds: [3, 7, 10, 12, 13], numericAssertions: [{ key: 'forward1y1yEffectiveAnnualPct', expected: 5.76513317191283, unit: 'annualPercentRate', tolerance: 1e-9 }] },
  },
  {
    id: 'M4', mode: 'coordinates', label: '坐标实验 04 · Additive Decomposition', title: '同一个三年 yield 在冻结加法约定下如何拆成预期平均短率与残差？',
    brief: 'SYNTHETIC：本题把 Jensen 项冻结为 0，TP 只是收益率减算术平均后的 additive residual，不是观测真值。', synthetic: true,
    facts: [{ label: '三期预期一年短率', value: '3% / 3.5% / 4%', note: '现实测度下的教学输入' }, { label: '3Y zero yield', value: '4%', note: '与预期平均同一年化口径' }, { label: 'Jensen convention', value: '0', note: '本题为唯一判分冻结' }], formulas: ['expectedAverage=(r1+r2+r3)/3', 'additiveResidualTP=yield−expectedAverage'], formulaUnits: '利率先以百分点计算；1 百分点=100bp。',
    options: [{ id: 'a', label: 'expectedAverage=3.5%; additiveResidualTP=50bp', diagnosis: '正确：在明示的加法教学约定下，观测收益率减平均路径得到 50bp 残差。' }, { id: 'b', label: 'expectedAverage=4.0%; additiveResidualTP=0bp', diagnosis: '你可能只取了路径终点。请先对三期短率取算术平均。' }, { id: 'c', label: 'expectedAverage=3.75%; additiveResidualTP=25bp', diagnosis: '请检查是否漏掉第一期，以及百分点到 bp 的换算。' }], correct: 'a', calculation: 'expectedAverage=(3+3.5+4)/3=3.5%；additiveResidualTP=4−3.5=.5%=50bp。', reveal: '这是为学习而冻结的加法分解。真实模型还需要明示 P/Q 动态、Jensen/convexity 约定、调查信息和 vintage。', primarySectionId: 'yield-term-premium', remediationSectionIds: ['bond-recursion', 'sdf-risk-compensation', 'p-q-measures', 'jensen-boundary'], sourceIds: [19, 20, 31, 34, 60], numericAssertions: [{ key: 'expectedAverageShortRatePct', expected: 3.5, unit: 'annualPercentRate' }, { key: 'additiveResidualTermPremiumBp', expected: 50, unit: 'basisPoints' }],
    staticTwin: { id: 'K4', title: '变式 04 · 四期加法残差', prompt: '预期短率为 2.8/3.2/3.6/4.0%，4Y yield=3.7%，Jensen 冻结为 0。', choices: [{ id: 'a', label: '3.6%, 10bp' }, { id: 'b', label: '3.4%, 30bp' }, { id: 'c', label: '4.0%, −30bp' }], correct: 'b', calculations: ['expectedAverage=(2.8+3.2+3.6+4.0)/4=3.4%。', 'additiveResidualTP=3.7−3.4=.3%=30bp。'], answer: 'B。这是冻结约定下的 additive residual，不是 observed structural truth。', sourceIds: [19, 20, 31, 34, 60], numericAssertions: [{ key: 'expectedAverageShortRatePct', expected: 3.4, unit: 'annualPercentRate' }, { key: 'additiveResidualTermPremiumBp', expected: 30, unit: 'basisPoints' }] },
  },
  {
    id: 'M5', mode: 'coordinates', label: '坐标实验 05 · Holding Return', title: '一年后卖出剩余一年零息债时，对数超额回报是多少？',
    brief: 'SYNTHETIC：持有期为一年，不假设债券持有到期。', synthetic: true,
    facts: [{ label: '买入 / 一年后卖出', value: '94 / 97', note: '两年 zero 变成剩余一年 zero' }, { label: '同期短债 gross return', value: '1.03', note: '机会成本与持有期匹配' }, { label: '回报口径', value: 'log excess return', note: '不与 simple excess return 混用' }], formulas: ['rx=ln(Psale/Pbuy)−ln(Rshort)'], formulaUnits: '对数回报为小数；乘 10,000 得 bp。',
    options: [{ id: 'a', label: '19.148936170bp', diagnosis: '你算成了 simple excess return=97/94−1.03，但题目要求两个 gross return 的对数差。请统一回报口径。' }, { id: 'b', label: '14.160000000bp', diagnosis: '请检查短债机会成本是 gross return 1.03，不是价格差。' }, { id: 'c', label: '18.573939918bp', diagnosis: '正确：长债价格 gross return 与短债 gross return 都先取对数。' }], correct: 'c', calculation: 'rx=ln(97/94)−ln(1.03)≈.001857393992=18.573939918bp。', reveal: '买入时 YTM 不锁定提前卖出回报；一年后的剩余曲线决定售价。', primarySectionId: 'excess-bond-return', remediationSectionIds: ['yield-to-maturity', 'holding-period-return', 'return-predictability'], sourceIds: [10, 12, 14], numericAssertions: [{ key: 'logExcessReturnBp', expected: 18.5739399183452, unit: 'basisPoints', tolerance: 1e-9 }],
    staticTwin: { id: 'K5', title: '变式 05 · Holding Return', prompt: '买入价 91，一年后售价 95，同期短债 gross return=1.025。求 log excess return。', choices: [{ id: 'a', label: '183.247724933bp' }, { id: 'b', label: '189.560439560bp' }, { id: 'c', label: '430.500000000bp' }], correct: 'a', calculations: ['rx=ln(95/91)−ln(1.025)。', '按九位小数显示为 183.247724933bp。'], answer: 'A。持有期、融资基准与回报口径必须一致。', sourceIds: [10, 12, 14], numericAssertions: [{ key: 'logExcessReturnBp', expected: 183.247724933193, unit: 'basisPoints', tolerance: 1e-9 }] },
  },
  {
    id: 'M6', mode: 'decomposition', label: '分解实验 06 · Duration / Convexity', title: '收益率上升 50bp 时，价格的二阶局部近似是多少？',
    brief: 'SYNTHETIC：ordinary non-callable bond；结果是 duration–convexity approximation，不是精确重定价。', synthetic: true,
    facts: [{ label: 'modified duration', value: '6.2', note: '年' }, { label: 'ordinary convexity', value: '48', note: '约为年平方' }, { label: '收益率变化', value: '+50bp', note: '计算中写成 +0.005' }], formulas: ['ΔP/P≈−DmodΔy+½C(Δy)²'], formulaUnits: '输出为价格百分比变化的二阶近似。',
    options: [{ id: 'a', label: '−3.1000%', diagnosis: '这是只保留一阶 duration 项。请继续加上普通凸性的二阶修正。' }, { id: 'b', label: '−3.0400%', diagnosis: '正确：duration 一阶项为负，普通正凸性项为正。' }, { id: 'c', label: '+3.1600%', diagnosis: '请先检查收益率上升时 duration 项的符号，再处理平方项。' }], correct: 'b', calculation: 'ΔP/P≈−6.2(.005)+.5(48)(.005²)=−.0304=−3.04%。', reveal: '这是局部二阶近似。普通正凸性、MBS 负凸性与期货 convexity adjustment 是三个不同对象。', primarySectionId: 'ordinary-convexity', remediationSectionIds: ['duration', 'mbs-negative-convexity'], sourceIds: [10, 55], numericAssertions: [{ key: 'durationConvexityApproxPct', expected: -3.04, unit: 'percentPriceChange', tolerance: 1e-12 }, { key: 'isExactRepricing', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K6', title: '变式 06 · 收益率下降', prompt: 'modified duration=7.4，ordinary convexity=66，收益率下降 40bp。', choices: [{ id: 'a', label: '+2.9600%' }, { id: 'b', label: '−3.0128%' }, { id: 'c', label: '+3.0128%' }], correct: 'c', calculations: ['Δy=−.004。', 'ΔP/P≈−7.4(−.004)+.5(66)(.004²)=.030128。'], answer: 'C。约 +3.0128%；仍只是二阶近似。', sourceIds: [10, 55], numericAssertions: [{ key: 'durationConvexityApproxPct', expected: 3.0128, unit: 'percentPriceChange', tolerance: 1e-12 }, { key: 'isExactRepricing', expected: false, unit: 'boolean' }] },
  },
  {
    id: 'M7', mode: 'decomposition', label: '分解实验 07 · Nelson–Siegel', title: 'NS 载荷的短端与长端极限由哪些参数决定？',
    brief: 'SYNTHETIC：只检查横截面函数的数学极限，不把 β 自动命名为结构宏观因子。', synthetic: true,
    facts: [{ label: 'β0', value: '4.2%', note: '长端极限' }, { label: 'β1 / β2', value: '−1.2% / 2.0%', note: 'β2 的短长端载荷均趋近 0' }, { label: 'λ', value: '0.7 per year', note: '期限 τ 用年，使 λτ 无量纲' }], formulas: ['y(0)=β0+β1', 'y(∞)=β0'], formulaUnits: '收益率为百分比；λ 的单位与期限单位互逆。',
    options: [{ id: 'a', label: 'short=4.2%; long=3.0%', diagnosis: '请检查 τ→0 时第一个载荷的极限是 1，而不是 0。' }, { id: 'b', label: 'short=3.0%; long=6.2%', diagnosis: '请分别求两个极限；β2 的曲率载荷在两端都消失。' }, { id: 'c', label: 'short=3.0%; long=4.2%', diagnosis: '正确：短端为 β0+β1，长端只剩 β0。' }], correct: 'c', calculation: 'short=4.2−1.2=3.0%；long=4.2%。', reveal: 'level/slope/curvature 是有用的统计压缩，但原始 NS 没有自动施加动态无套利，也不唯一识别经济原因。', primarySectionId: 'nelson-siegel', remediationSectionIds: ['level-factor', 'slope-factor', 'curvature-factor', 'svensson-nss'], sourceIds: [21], numericAssertions: [{ key: 'shortEndLimitPct', expected: 3, unit: 'annualPercentRate' }, { key: 'longEndLimitPct', expected: 4.2, unit: 'annualPercentRate' }, { key: 'lambdaUnit', expected: 'perYear', unit: 'string' }],
    staticTwin: { id: 'K7', title: '变式 07 · NS 极限', prompt: 'β0=3.8%，β1=.6%，β2=−1.4%，λ=.5/year。', choices: [{ id: 'a', label: 'short=3.8%; long=4.4%' }, { id: 'b', label: 'short=4.4%; long=3.8%' }, { id: 'c', label: 'short=4.4%; long=3.2%' }], correct: 'b', calculations: ['short=β0+β1=4.4%。', 'long=β0=3.8%。'], answer: 'B。β2 不改变两个端点极限。', sourceIds: [21], numericAssertions: [{ key: 'shortEndLimitPct', expected: 4.4, unit: 'annualPercentRate' }, { key: 'longEndLimitPct', expected: 3.8, unit: 'annualPercentRate' }] },
  },
  {
    id: 'M8', mode: 'decomposition', label: '分解实验 08 · Inflation Compensation', title: '名义—TIPS 加法收益率差如何与预期通胀分开？',
    brief: 'SYNTHETIC：第一步只是 additive nominal–real yield spread，不是 exact Fisher identity。忽略题干未给的其他项。', synthetic: true,
    facts: [{ label: 'nominal / TIPS zero', value: '3.7% / 1.4%', note: '同期限、同计量口径' }, { label: 'inflation-risk premium', value: '+0.35%', note: 'IRP' }, { label: 'TIPS liquidity premium', value: '+0.15%', note: '按 BE=Eπ+IRP−LP 的符号约定' }], formulas: ['additiveYieldSpreadBreakevenPct=yNominal−yTIPS', 'Eπ=BE−IRP+LP'], formulaUnits: '所有输入为百分点；字段名不得简写成 exactFisherBreakeven。',
    options: [{ id: 'a', label: 'additiveYieldSpreadBreakevenPct=2.30%; expectedInflation=2.10%', diagnosis: '正确：先做名义减 TIPS，再按明示符号约定移项。' }, { id: 'b', label: 'breakeven=2.30%; expectedInflation=2.50%', diagnosis: '请检查 IRP 与 TIPS liquidity premium 在题干分解中的符号。' }, { id: 'c', label: 'breakeven=2.10%; expectedInflation=2.30%', diagnosis: '你可能把预期通胀与先观察到的加法收益率差交换了。' }], correct: 'a', calculation: 'additive spread=3.7−1.4=2.30%；Eπ=2.30−.35+.15=2.10%。', reveal: 'nominal–TIPS spread 是 inflation compensation，还可含 inflation risk、TIPS liquidity、indexation lag、deflation floor 与拟合残差。完整实际率由 3.08 接手。', primarySectionId: 'breakeven-boundary', remediationSectionIds: [], sourceIds: [5, 40, 41, 42], numericAssertions: [{ key: 'additiveYieldSpreadBreakevenPct', expected: 2.3, unit: 'annualPercentRate' }, { key: 'expectedInflationPct', expected: 2.1, unit: 'annualPercentRate' }, { key: 'isExactFisherIdentity', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K8', title: '变式 08 · 负 IRP', prompt: 'nominal=3.2%，TIPS=1.1%，IRP=−0.10%，LP=.25%；使用同一加法约定。', choices: [{ id: 'a', label: 'spread=2.1%; Eπ=2.25%' }, { id: 'b', label: 'spread=2.3%; Eπ=2.45%' }, { id: 'c', label: 'spread=2.1%; Eπ=2.45%' }], correct: 'c', calculations: ['additive spread=3.2−1.1=2.1%。', 'Eπ=2.1−(−.1)+.25=2.45%。'], answer: 'C。不论符号如何，第一步都只能命名为 additive yield spread。', sourceIds: [5, 40, 41, 42], numericAssertions: [{ key: 'additiveYieldSpreadBreakevenPct', expected: 2.1, unit: 'annualPercentRate' }, { key: 'expectedInflationPct', expected: 2.45, unit: 'annualPercentRate' }] },
  },
  {
    id: 'M9', mode: 'decomposition', label: '分解实验 09 · Duration Supply', title: '如何把目标组合的一阶利率风险换算为 benchmark 面值？',
    brief: 'SYNTHETIC：两边每单位面值价格相同，且 duration 均为 modified duration；只在这个 guard 下可约去价格。', synthetic: true,
    facts: [{ label: '目标组合', value: '500bn face · Dmod=8', note: '与 benchmark 的每面值价格相同' }, { label: '10Y benchmark', value: 'Dmod=9', note: '一阶价格敏感度参照' }, { label: '等价对象', value: 'price × modified duration', note: '不是只比面值' }], formulas: ['Nb=Nt(PtDmod,t)/(PbDmod,b)', '价格相同时 Nb=NtDmod,t/Dmod,b'], formulaUnits: '面值为 bn 同一货币；比较同一小幅平行利率变化。',
    options: [{ id: 'a', label: '562.500000000bn', diagnosis: '请检查是否把目标 duration 与 benchmark duration 的比率写反。' }, { id: 'b', label: '444.444444444bn', diagnosis: '正确：500×8/9 保持一阶 price×modified-duration 风险相同。' }, { id: 'c', label: '500.000000000bn', diagnosis: '同面值不会在 duration 不同时自动产生同一一阶价格风险。' }], correct: 'b', calculation: 'Nb=500×(P×8)/(P×9)=444.444444444bn（显示到小数点后九位）。', reveal: '一般公式必须保留价格；本题因为明示了相同价格才能约去。净久期供给是套利者要承载的价格加权风险，不是纯面值。', primarySectionId: 'duration-supply', remediationSectionIds: ['preferred-habitat', 'risk-bearing-capacity', 'qe-stock'], sourceIds: [10, 44, 45, 54], numericAssertions: [{ key: 'durationEquivalentFaceBillion', expected: 444.444444444, unit: 'billionCurrency', tolerance: 1e-9 }, { key: 'samePricePerParAssumption', expected: true, unit: 'boolean' }, { key: 'durationType', expected: 'modifiedDuration', unit: 'string' }],
    staticTwin: { id: 'K9', title: '变式 09 · Duration-equivalent Face', prompt: '目标组合 720bn，价格与 benchmark 每面值相同，Dmod=6.5；benchmark Dmod=10。', choices: [{ id: 'a', label: '468bn' }, { id: 'b', label: '720bn' }, { id: 'c', label: '1,107.692bn' }], correct: 'a', calculations: ['Nb=720×(P×6.5)/(P×10)。', 'Nb=468bn。'], answer: 'A。若价格不同，必须把 Pt/Pb 放回公式。', sourceIds: [10, 44, 45, 54], numericAssertions: [{ key: 'durationEquivalentFaceBillion', expected: 468, unit: 'billionCurrency' }, { key: 'samePricePerParAssumption', expected: true, unit: 'boolean' }] },
  },
  {
    id: 'M10', mode: 'decomposition', label: '分解实验 10 · Model Range', title: '三个模型估计如何形成最小值、中位数、最大值与范围宽度？',
    brief: 'SYNTHETIC：模型范围只描述所选模型集，不是统计置信区间，也不识别真实期限溢价。', synthetic: true,
    facts: [{ label: '模型估计 TP', value: '0.35% / 0.80% / 1.15%', note: '同到期、同 observed yield、同 vintage' }, { label: '换算', value: '1%=100bp', note: '先统一单位再排序' }, { label: '范围宽度', value: 'max−min', note: '不是 max 本身' }], formulas: ['range=[min, median, max]', 'width=max−min'], formulaUnits: '全部输出用 bp。',
    options: [{ id: 'a', label: '35bp, 80bp, 115bp, width=80bp', diagnosis: '正确：三个值排序后中间值是 80bp，宽度是 115−35=80bp。' }, { id: 'b', label: '35bp, 75bp, 115bp, width=80bp', diagnosis: '你可能在没有对应数据的情况下取了两数平均。请先看样本数是奇数还是偶数。' }, { id: 'c', label: '35bp, 80bp, 115bp, width=75bp', diagnosis: '请重新计算 max−min，不要从 median 减起。' }], correct: 'a', calculation: '[35,80,115]bp；median=80bp；width=115−35=80bp。', reveal: '模型、样本、调查、Jensen convention 和 vintage 都会改变分解。范围只说明所选模型的分歧。', primarySectionId: 'decomposition-audit', remediationSectionIds: ['curve-vintage', 'identification-estimation', 'acm-model', 'kim-wright', 'model-uncertainty'], sourceIds: [30, 31, 33, 34, 35, 59, 60], numericAssertions: [{ key: 'minTermPremiumBp', expected: 35, unit: 'basisPoints' }, { key: 'medianTermPremiumBp', expected: 80, unit: 'basisPoints' }, { key: 'maxTermPremiumBp', expected: 115, unit: 'basisPoints' }, { key: 'rangeWidthBp', expected: 80, unit: 'basisPoints' }],
    staticTwin: { id: 'K10', title: '变式 10 · 四元素中位数', prompt: '四个模型 estimated TP 为 −0.20%、0.25%、0.60%、0.95%。', choices: [{ id: 'a', label: 'min=−20bp; median=25bp; max=95bp; width=115bp' }, { id: 'b', label: 'min=−20bp; median=42.5bp; max=95bp; width=115bp' }, { id: 'c', label: 'min=−20bp; median=42.5bp; max=95bp; width=75bp' }], correct: 'b', calculations: ['统一为 [−20,25,60,95]bp 并排序。', '偶数样本 median=(25+60)/2=42.5bp。', 'width=95−(−20)=115bp。'], answer: 'B。四元素中位数必须取排序后中间两项的算术平均。', sourceIds: [30, 31, 33, 34, 35, 59, 60], numericAssertions: [{ key: 'minTermPremiumBp', expected: -20, unit: 'basisPoints' }, { key: 'medianTermPremiumBp', expected: 42.5, unit: 'basisPoints' }, { key: 'maxTermPremiumBp', expected: 95, unit: 'basisPoints' }, { key: 'rangeWidthBp', expected: 115, unit: 'basisPoints' }] },
  },
];

export const yieldCurveScenarioAssertions = [
  { id: 'scenario-count', statement: '主题题为 M1–M10 共 10 道。', passed: yieldCurveScenarios.length === 10 && yieldCurveScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { id: 'static-count', statement: '静态孪生题为 K1–K10 共 10 道。', passed: yieldCurveScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { id: 'mode-balance', statement: '两个模式各有 5 道题。', passed: yieldCurveModes.every((mode) => yieldCurveScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { id: 'unique-options', statement: '每道主题与孪生题的三个选项均互不相同。', passed: yieldCurveScenarios.every((scenario) => new Set(scenario.options.map((option) => option.label)).size === 3 && new Set(scenario.staticTwin.choices.map((option) => option.label)).size === 3) },
  { id: 'correct-position-pattern', statement: '主题与孪生题正确位置序列不同。', passed: yieldCurveScenarios.map((scenario) => scenario.correct).join('') === 'acbacbcaba' && yieldCurveScenarios.map((scenario) => scenario.staticTwin.correct).join('') === 'bacbacbcab' },
  { id: 'guard-fields', statement: 'M6/M8/M9 分别明示二阶近似、加法 breakeven 与价格—modified-duration guard。', passed: yieldCurveScenarios[5].numericAssertions.some((item) => item.key === 'isExactRepricing' && item.expected === false) && yieldCurveScenarios[7].numericAssertions.some((item) => item.key === 'additiveYieldSpreadBreakevenPct') && yieldCurveScenarios[8].numericAssertions.some((item) => item.key === 'samePricePerParAssumption' && item.expected === true) },
] as const;
