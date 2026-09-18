export type RealRateMode = 'purchasing-power' | 'valuation';
export type RealRateChoice = 'a' | 'b' | 'c';

export type RealRateAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type RealRateScenario = {
  id: `M${number}`;
  mode: RealRateMode;
  label: string;
  title: string;
  brief: string;
  synthetic: true;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: RealRateChoice; label: string; diagnosis: string }[];
  correct: RealRateChoice;
  calculation: string;
  reveal: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: RealRateAssertion[];
  staticTwin: {
    id: `K${number}`;
    title: string;
    prompt: string;
    choices: { id: RealRateChoice; label: string }[];
    correct: RealRateChoice;
    calculations: string[];
    answer: string;
    formulaUnits?: string;
    sourceIds: number[];
    numericAssertions: RealRateAssertion[];
  };
};

export const realRateModes: { id: RealRateMode; label: string; title: string; description: string }[] = [
  { id: 'purchasing-power', label: 'MODE A', title: '先量对购买力与实际利率', description: '区分 ex post、点预测 plug-in、精确 Fisher、Jensen 与 TIPS 合同现金流。' },
  { id: 'valuation', label: 'MODE B', title: '再判断贴现对象与模型边界', description: '区分 TIPS、r*、名实 DCF、duration、Gordon 与 WACC 的适用条件。' },
];

export const realRateScenarios: RealRateScenario[] = [
  {
    id: 'M1', mode: 'purchasing-power', label: '购买力实验 01 · Ex-post Real Return', title: '6% 名义总回报在 3% 已实现通胀后留下多少购买力回报？',
    brief: 'SYNTHETIC：名义总回报与通胀窗口完全一致；税、费用和违约均冻结为零。', synthetic: true,
    facts: [{ label: '名义 gross return', value: '1.06', note: '同一持有期总回报' }, { label: '实现价格指数变化', value: '+3%', note: '同一指数与窗口' }, { label: '目标对象', value: 'ex-post realized real return', note: '不是事前预期' }],
    formulas: ['Rrealized=(1+i)/(1+πrealized)−1'], formulaUnits: '百分比先转小数；输出再乘100。',
    options: [{ id: 'a', label: '2.912621359%', diagnosis: '正确：用两个 gross factor 相除，而不是直接相减。' }, { id: 'b', label: '3.000000000%', diagnosis: '这是 i−π 的加法近似；题目要求精确事后购买力回报。' }, { id: 'c', label: '9.180000000%', diagnosis: '你可能把通胀当作额外收益相乘。购买力应由名义回报除以价格指数增长。' }], correct: 'a',
    calculation: 'Rrealized=1.06/1.03−1=.029126213592≈2.912621359%。', reveal: '“实际”必须说明价格指数、期限与 ex ante/ex post；同一名义数字可以对应不同购买力结果。', primarySectionId: 'ex-post-real-return', remediationSectionIds: ['real-rate-passport', 'purchasing-power-numeraire', 'exact-fisher-identity'], sourceIds: [1, 2],
    numericAssertions: [{ key: 'exPostRealReturnPct', expected: 2.912621359223298, unit: 'percentHoldingPeriodReturn', tolerance: 1e-9 }, { key: 'isExAnte', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K1', title: '变式 01 · 通缩期购买力', prompt: '名义总回报 5.5%，同窗口价格指数下降 1%。求精确事后实际回报。', choices: [{ id: 'a', label: '4.500000000%' }, { id: 'b', label: '6.565656566%' }, { id: 'c', label: '5.445000000%' }], correct: 'b', calculations: ['通胀 gross factor=1−.01=.99。', '1.055/.99−1=.065656565657。'], answer: 'B。精确事后实际回报约 6.565656566%；4.5% 只是加法近似。', sourceIds: [1, 2], numericAssertions: [{ key: 'exPostRealReturnPct', expected: 6.565656565656575, unit: 'percentHoldingPeriodReturn', tolerance: 1e-9 }] },
  },
  {
    id: 'M2', mode: 'purchasing-power', label: '购买力实验 02 · Ex-ante Plug-in', title: '7% 名义率与 4% 通胀点预测能生成什么实际利率对象？',
    brief: 'SYNTHETIC：通胀输入只是一个点预测，不是完整概率分布；答案必须连同 estimand 名称判断。', synthetic: true,
    facts: [{ label: '名义率', value: '7%', note: '与预测期限匹配' }, { label: '通胀点预测', value: '4%', note: '不是随机分布' }, { label: '估计方法', value: 'plug-in Fisher transform', note: '不声称严格期望' }],
    formulas: ['r̃=(1+i)/(1+π̃)−1'], formulaUnits: '输入和输出均为同期限百分比。',
    options: [{ id: 'a', label: '3.000000000%，严格 expected real return', diagnosis: '数值是加法近似，而且点预测不能在随机通胀下定义严格期望实际回报。' }, { id: 'b', label: '2.884615385%，observed real risk-free rate', diagnosis: '数值对，但名称错：点预测变换不是市场直接观察的实际无风险率。' }, { id: 'c', label: '2.884615385%，ex-ante plug-in estimate', diagnosis: '正确：数值与估计对象都被准确命名。' }], correct: 'c',
    calculation: 'r̃=1.07/1.04−1=.028846153846≈2.884615385%。', reveal: '要得到严格条件期望，还需要通胀分布及其与名义支付/定价核的联合关系；一个预测均值不够。', primarySectionId: 'ex-ante-plugin-real-rate', remediationSectionIds: ['stochastic-inflation-jensen-gap', 'real-risk-free-rate'], sourceIds: [1, 2, 5, 7],
    numericAssertions: [{ key: 'exAntePlugInRealRatePct', expected: 2.8846153846153966, unit: 'annualPercentRate', tolerance: 1e-9 }, { key: 'estimationKind', expected: 'plugInPointForecast', unit: 'string' }],
    staticTwin: { id: 'K2', title: '变式 02 · 点预测变换', prompt: '名义率 9%，同期限通胀点预测 6%。哪一项准确？', choices: [{ id: 'a', label: '2.830188679%，plug-in estimate' }, { id: 'b', label: '3.000000000%，strict expectation' }, { id: 'c', label: '15.540000000%，plug-in estimate' }], correct: 'a', calculations: ['gross factors 为 1.09 与 1.06。', '1.09/1.06−1=.028301886792。'], answer: 'A。结果约 2.830188679%，但仍须保留 plug-in 标签。', sourceIds: [1, 2, 5, 7], numericAssertions: [{ key: 'exAntePlugInRealRatePct', expected: 2.830188679245293, unit: 'annualPercentRate', tolerance: 1e-9 }, { key: 'estimationKind', expected: 'plugInPointForecast', unit: 'string' }] },
  },
  {
    id: 'M3', mode: 'purchasing-power', label: '购买力实验 03 · Exact Fisher', title: '5% 实际率与 8% 通胀对应的精确名义率和交叉项是多少？',
    brief: 'SYNTHETIC：这是确定输入下的 gross-factor 恒等式，不是 Fisher effect 的行为估计。', synthetic: true,
    facts: [{ label: '实际率 r', value: '5%', note: '同期限' }, { label: '通胀 π', value: '8%', note: '确定输入' }, { label: '近似', value: 'r+π=13%', note: '待与精确式比较' }],
    formulas: ['1+i=(1+r)(1+π)', 'i=r+π+rπ'], formulaUnits: 'rπ=.05×.08=.004=0.4%=40bp。',
    options: [{ id: 'a', label: 'i=13.0%；交叉项=0bp', diagnosis: '这是加法近似，遗漏了 rπ。' }, { id: 'b', label: 'i=13.4%；交叉项=40bp', diagnosis: '正确：gross factor 相乘产生 40bp 交叉项。' }, { id: 'c', label: 'i=13.4%；交叉项=400bp', diagnosis: '数值单位错：.004 是 40bp，不是 400bp。' }], correct: 'b',
    calculation: 'i=(1.05)(1.08)−1=.134=13.4%；rπ=.004=40bp。', reveal: 'Fisher 恒等式只连接同一状态下的名义、实际与价格变化；Fisher effect 还要研究预期和均衡反应。', primarySectionId: 'exact-fisher-identity', remediationSectionIds: ['additive-fisher-approximation', 'fisher-identity-versus-effect'], sourceIds: [1, 2],
    numericAssertions: [{ key: 'exactNominalRatePct', expected: 13.4, unit: 'annualPercentRate' }, { key: 'crossTermBp', expected: 40, unit: 'basisPoints' }, { key: 'isFisherEffectEstimate', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K3', title: '变式 03 · Fisher 交叉项', prompt: '实际率 4%，通胀 10%。求精确名义率与交叉项。', choices: [{ id: 'a', label: '14.0%；0bp' }, { id: 'b', label: '14.4%；400bp' }, { id: 'c', label: '14.4%；40bp' }], correct: 'c', calculations: ['i=(1.04)(1.10)−1=.144。', 'rπ=.04×.10=.004=40bp。'], answer: 'C。精确名义率 14.4%，比加法近似高 40bp。', formulaUnits: 'rπ=.04×.10=.004=0.4%=40bp。', sourceIds: [1, 2], numericAssertions: [{ key: 'exactNominalRatePct', expected: 14.4, unit: 'annualPercentRate' }, { key: 'crossTermBp', expected: 40, unit: 'basisPoints' }] },
  },
  {
    id: 'M4', mode: 'purchasing-power', label: '购买力实验 04 · Jensen Gap', title: '随机通胀下，为什么不能把平均通胀直接放进分母？',
    brief: 'SYNTHETIC：名义 gross return 固定为 1.06；通胀为 0%/12%，各 50%。只计算非线性差，不把它命名为风险溢价。', synthetic: true,
    facts: [{ label: '名义 gross', value: '1.06', note: '两状态相同' }, { label: '通胀状态', value: '0% / 12%', note: '各50%' }, { label: '平均通胀', value: '6%', note: 'plug-in 结果为0%' }],
    formulas: ['E[Rreal]=(1+i)E[(1+π)⁻¹]−1', 'plug-in=(1+i)/(1+Eπ)−1'], formulaUnits: '结果以持有期百分比和差异 bp 表示。',
    options: [{ id: 'a', label: 'strict=0.321428571%；plug-in=0%；gap=32.142857bp', diagnosis: '正确：先逐状态取购买力倒数，再按概率平均。' }, { id: 'b', label: 'strict=0%；gap=0bp', diagnosis: '你把期望移入非线性分母；一般 E[g(π)]≠g(Eπ)。' }, { id: 'c', label: 'strict=6%；gap=600bp', diagnosis: '平均通胀不是实际回报；还需要用名义 gross factor 除以价格增长。' }], correct: 'a',
    calculation: '1.06×[.5/1+.5/1.12]−1=.003214285714=0.321428571%；与0% plug-in 相差32.142857bp。', reveal: 'Jensen gap 由非线性产生；只有加入状态价格或联合协方差后，才有资格讨论 inflation risk premium。', primarySectionId: 'stochastic-inflation-jensen-gap', remediationSectionIds: ['ex-ante-plugin-real-rate', 'inflation-risk-premium', 'nominal-real-sdf-relation'], sourceIds: [1, 2, 8, 13],
    numericAssertions: [{ key: 'strictExpectedRealReturnPct', expected: 0.32142857142856185, unit: 'percentHoldingPeriodReturn', tolerance: 1e-9 }, { key: 'plugInRealReturnPct', expected: 0, unit: 'percentHoldingPeriodReturn' }, { key: 'jensenGapBp', expected: 32.14285714285619, unit: 'basisPoints', tolerance: 1e-8 }, { key: 'isInflationRiskPremium', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K4', title: '变式 04 · 非对称概率', prompt: '名义回报6%；通胀2%的概率75%，通胀10%的概率25%。比较 strict 与均值 plug-in。', choices: [{ id: 'a', label: 'strict=1.923076923%；gap=0bp' }, { id: 'b', label: 'strict=2.032085561%；plug-in=1.923076923%；gap=10.900864bp' }, { id: 'c', label: 'strict=2.10%；plug-in=2.00%；gap=10bp' }], correct: 'b', calculations: ['E[(1+π)⁻¹]=.75/1.02+.25/1.10。', 'strict=1.06×该期望−1=2.032085561%。', 'Eπ=4%；plug-in=1.06/1.04−1=1.923076923%；差10.900864bp。'], answer: 'B。差异是非线性 gap，不能只凭这一步命名通胀风险溢价。', sourceIds: [1, 2, 8, 13], numericAssertions: [{ key: 'strictExpectedRealReturnPct', expected: 2.032085561497321, unit: 'percentHoldingPeriodReturn', tolerance: 1e-9 }, { key: 'plugInRealReturnPct', expected: 1.9230769230769384, unit: 'percentHoldingPeriodReturn', tolerance: 1e-9 }, { key: 'jensenGapBp', expected: 10.900863842038255, unit: 'basisPoints', tolerance: 1e-8 }] },
  },
  {
    id: 'M5', mode: 'purchasing-power', label: '购买力实验 05 · TIPS Contract', title: '指数化本金、半年票息和到期 deflation floor 分别是多少？',
    brief: 'SYNTHETIC：base Ref CPI=250、当前=265、到期=240；par=1000、年票息率1.2%、半年付息。', synthetic: true,
    facts: [{ label: 'base / current Ref CPI', value: '250 / 265', note: '当前 index ratio=1.06' }, { label: 'maturity Ref CPI', value: '240', note: '到期 ratio=.96' }, { label: 'original par / coupon', value: '1000 / 1.2%', note: '半年付息' }],
    formulas: ['adjusted principal=par×index ratio', 'coupon=(c/2)×adjusted principal', 'maturity principal=max(original par, adjusted principal)'], formulaUnits: '本金与票息为货币单位；floor 只保护到期本金相对 original par。',
    options: [{ id: 'a', label: 'current principal=1060；coupon=6.00；maturity=1060', diagnosis: '票息应按指数化本金计算；到期本金则使用到期 CPI 与 original-par floor。' }, { id: 'b', label: 'current principal=1000；coupon=6.36；maturity=960', diagnosis: '当前本金必须乘 index ratio；到期本金不能低于 original par。' }, { id: 'c', label: 'current principal=1060；coupon=6.36；maturity=1000', diagnosis: '正确：期间票息随指数化本金变化，到期本金应用原始面值 floor。' }], correct: 'c',
    calculation: 'current ratio=265/250=1.06，principal=1060，coupon=.012/2×1060=6.36；maturity adjusted=960，floor payment=max(1000,960)=1000。', reveal: 'floor 不保证买入价、不保护期间票息，也不把市场 TIPS yield 变成纯实际无风险率。', primarySectionId: 'tips-contract-cashflows', remediationSectionIds: ['tips-reference-cpi', 'tips-deflation-floor', 'observed-tips-yield'], sourceIds: [20, 21, 22, 23],
    numericAssertions: [{ key: 'currentAdjustedPrincipal', expected: 1060, unit: 'currency' }, { key: 'nextSemiannualCoupon', expected: 6.36, unit: 'currency' }, { key: 'maturityAdjustedPrincipal', expected: 960, unit: 'currency' }, { key: 'maturityPrincipalPayment', expected: 1000, unit: 'currency' }],
    staticTwin: { id: 'K5', title: '变式 05 · 另一 TIPS 合同', prompt: 'base Ref CPI=200、当前=218、到期=196；par=2000、年票息率.8%、半年付息。', choices: [{ id: 'a', label: 'principal=2180；coupon=8.72；maturity=2000' }, { id: 'b', label: 'principal=2180；coupon=17.44；maturity=1960' }, { id: 'c', label: 'principal=2000；coupon=8.00；maturity=2180' }], correct: 'a', calculations: ['current ratio=218/200=1.09，principal=2180。', 'coupon=.008/2×2180=8.72。', 'maturity adjusted=2000×196/200=1960；floor支付2000。'], answer: 'A。到期 floor 比较 original principal 与到期 adjusted principal。', sourceIds: [20, 21, 22, 23], numericAssertions: [{ key: 'currentAdjustedPrincipal', expected: 2180, unit: 'currency' }, { key: 'nextSemiannualCoupon', expected: 8.72, unit: 'currency' }, { key: 'maturityAdjustedPrincipal', expected: 1960, unit: 'currency' }, { key: 'maturityPrincipalPayment', expected: 2000, unit: 'currency' }] },
  },
  {
    id: 'M6', mode: 'valuation', label: '估值实验 06 · TIPS / Real Yield / r*', title: '观察 TIPS yield、模型实际收益率、预期路径、实际 TP 与 r* 应怎样分层？',
    brief: 'SYNTHETIC：符号约定为 observed TIPS yield = model real yield + signed TIPS liquidity yield wedge；r* 来自独立宏观模型。', synthetic: true,
    facts: [{ label: 'observed TIPS / liquidity wedge', value: '2.10% / +0.25%', note: '同期限、同收益率口径' }, { label: 'expected real short path / real TP', value: '1.30% / +0.55%', note: '模型分解' }, { label: 'independent r*', value: '0.80%', note: '不同 estimand' }],
    formulas: ['model real yield=observed TIPS−signed liquidity wedge', 'model real yield=expected real short path+estimated real TP'], formulaUnits: '全部为百分点；各项必须携带模型、期限和 vintage。',
    options: [{ id: 'a', label: 'model real=2.35%；real TP=1.05%；r*=2.10%', diagnosis: '流动性楔子符号写反，且 observed TIPS 与 r* 被错误等同。' }, { id: 'b', label: 'model real=1.85%；real TP=.55%；r*=.80%（独立）', diagnosis: '正确：三个层次各自保留名称和来源。' }, { id: 'c', label: 'model real=1.30%；real TP=.80%；r*=.55%', diagnosis: '你把预期路径、期限溢价与自然利率交换了。' }], correct: 'b',
    calculation: 'model real=2.10−.25=1.85%；estimated real TP=1.85−1.30=.55%；r*=.80% 仍是独立模型估计。', reveal: '长期 TIPS、real forward、模型实际无风险曲线与 r* 回答不同问题，不能靠数值相近合并。', primarySectionId: 'observed-tips-yield', remediationSectionIds: ['real-yield-curve-decomposition', 'tips-liquidity-supply-technicals', 'r-star-definition', 'real-forward-boundary'], sourceIds: [24, 25, 26, 27, 38, 41, 48],
    numericAssertions: [{ key: 'estimatedModelRealYieldPct', expected: 1.85, unit: 'annualPercentRate' }, { key: 'estimatedRealTermPremiumPct', expected: 0.55, unit: 'annualPercentRate' }, { key: 'independentRStarEstimatePct', expected: 0.8, unit: 'annualPercentRate' }, { key: 'rStarIsObservedTipsYield', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K6', title: '变式 06 · 分层估计', prompt: 'observed TIPS=1.80%，signed liquidity wedge=.15%；expected real short path=1.20%；独立 r*=.90%。', choices: [{ id: 'a', label: 'model real=1.95%；TP=.75%；r*=1.80%' }, { id: 'b', label: 'model real=1.20%；TP=.45%；r*=.45%' }, { id: 'c', label: 'model real=1.65%；TP=.45%；r*=.90%（独立）' }], correct: 'c', calculations: ['model real=1.80−.15=1.65%。', 'estimated real TP=1.65−1.20=.45%。', 'r*=.90%，不从上述差式生成。'], answer: 'C。长期市场价格分解与自然短率估计保持分层。', sourceIds: [24, 25, 26, 27, 38, 41, 48], numericAssertions: [{ key: 'estimatedModelRealYieldPct', expected: 1.65, unit: 'annualPercentRate' }, { key: 'estimatedRealTermPremiumPct', expected: 0.45, unit: 'annualPercentRate' }, { key: 'independentRStarEstimatePct', expected: 0.9, unit: 'annualPercentRate' }] },
  },
  {
    id: 'M7', mode: 'valuation', label: '估值实验 07 · Nominal/Real DCF', title: '确定通胀下，名义与实际现金流怎样给出同一个现值？',
    brief: 'SYNTHETIC：一期确定现金流；当前价格指数归一化为 I₀=1，real CF 以 date-0 货币购买力表达；税、风险溢价与相对价格变化冻结。名义率必须用 exact Fisher 转换。', synthetic: true,
    facts: [{ label: 'date-0 real CF / real rate', value: '100 / 3%', note: 'I₀=1；一期' }, { label: '确定通胀', value: '4%', note: 'nominal CF=104' }, { label: 'exact nominal rate', value: '7.12%', note: '(1.03)(1.04)−1' }],
    formulas: ['PV in date-0 currency=100/1.03', 'PVnominal=104/1.0712'], formulaUnits: 'I₀=1；real CF 已换成 date-0 货币购买力，因此两种 PV 都是 date-0 currency units。',
    options: [{ id: 'a', label: 'PVreal=97.087378641；PVnominal=97.196261682', diagnosis: '你可能用 3%+4%=7% 当作精确名义率，遗漏交叉项。' }, { id: 'b', label: 'PVreal=100；PVnominal=104', diagnosis: '现金流还没有贴现到今天。' }, { id: 'c', label: '两者都为97.087378641', diagnosis: '正确：现金流和贴现率在名义/实际口径中一致转换。' }], correct: 'c',
    calculation: 'nominal CF=100×1.04=104；nominal k=(1.03)(1.04)−1=7.12%；100/1.03=104/1.0712=97.087378641。', reveal: '名义与实际 DCF 不是两套经济价值；在完整一致条件下，它们只是同一索赔权的两种计价。', primarySectionId: 'nominal-real-dcf-consistency', remediationSectionIds: ['exact-fisher-identity', 'cash-flow-vs-discount-rate-news', 'currency-numeraire'], sourceIds: [1, 2, 13, 55],
    numericAssertions: [{ key: 'nominalCashFlow', expected: 104, unit: 'currency' }, { key: 'exactNominalDiscountRatePct', expected: 7.12, unit: 'annualPercentRate' }, { key: 'realPresentValue', expected: 97.0873786407767, unit: 'currency', tolerance: 1e-9 }, { key: 'nominalPresentValue', expected: 97.0873786407767, unit: 'currency', tolerance: 1e-9 }],
    staticTwin: { id: 'K7', title: '变式 07 · 名实一致', prompt: '一期 date-0 real CF=200、real rate=2%、确定通胀=5%，且 I₀=1。', choices: [{ id: 'a', label: 'nominal k=7%；PV=196.261682243' }, { id: 'b', label: 'nominal CF=210；nominal k=7.10%；两种PV=196.078431373' }, { id: 'c', label: 'nominal CF=210；nominal k=3%；PV=203.883495146' }], correct: 'b', calculations: ['nominal CF=200×1.05=210。', 'nominal k=(1.02)(1.05)−1=7.10%。', '200/1.02=210/1.071=196.078431373。'], answer: 'B。I₀=1 且 real CF 已用 date-0 货币购买力表达；简单相加只近似，不能在“精确一致”题中替代 gross-factor 转换。', sourceIds: [1, 2, 13, 55], numericAssertions: [{ key: 'nominalCashFlow', expected: 210, unit: 'currency' }, { key: 'exactNominalDiscountRatePct', expected: 7.1, unit: 'annualPercentRate' }, { key: 'presentValue', expected: 196.078431372549, unit: 'currency', tolerance: 1e-9 }] },
  },
  {
    id: 'M8', mode: 'valuation', label: '估值实验 08 · Duration', title: '固定现金流、平行小冲击下，价格的一阶变化是多少？',
    brief: 'SYNTHETIC：价格102、modified duration=8、yield +50bp；信用利差和现金流不变。', synthetic: true,
    facts: [{ label: 'price', value: '102', note: '每100面值' }, { label: 'modified duration', value: '8', note: '年' }, { label: 'yield shock', value: '+50bp', note: 'Δy=.005' }],
    formulas: ['ΔP/P≈−DmodΔy', 'ΔP≈P×ΔP/P'], formulaUnits: '50bp=.005；结果是一阶局部近似。',
    options: [{ id: 'a', label: 'ΔP/P≈−4.00%；ΔP≈−4.08', diagnosis: '正确：先算相对变化，再乘初始价格。' }, { id: 'b', label: 'ΔP/P≈−400%；ΔP≈−408', diagnosis: 'bp 没有转成小数；50bp 是 .005。' }, { id: 'c', label: 'ΔP/P=−4.00%；ΔP=−4.08（精确）', diagnosis: '数值近似正确，但把 duration 局部近似误称为精确重定价。' }], correct: 'a',
    calculation: 'ΔP/P≈−8×.005=−.04=−4%；ΔP≈102×(−.04)=−4.08。', reveal: '实际曲线变化、信用利差、optionality 和 convexity 都会使精确结果偏离这一阶数值。', primarySectionId: 'term-specific-discounting', remediationSectionIds: ['nominal-bond', 'corporate-bond'], sourceIds: [35],
    numericAssertions: [{ key: 'firstOrderRelativePriceChangePct', expected: -4, unit: 'percentPriceChange' }, { key: 'firstOrderPriceChange', expected: -4.08, unit: 'currency' }, { key: 'isExactRepricing', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K8', title: '变式 08 · 更长久期', prompt: '价格98、modified duration=12、yield +25bp。求一阶近似。', choices: [{ id: 'a', label: '−30%；−29.40' }, { id: 'b', label: '+3%；+2.94' }, { id: 'c', label: '−3%；−2.94（近似）' }], correct: 'c', calculations: ['25bp=.0025。', 'ΔP/P≈−12×.0025=−.03=−3%。', 'ΔP≈98×(−.03)=−2.94。'], answer: 'C。这仍是固定其他状态的一阶局部近似。', formulaUnits: '25bp=.0025；结果是一阶局部近似。', sourceIds: [35], numericAssertions: [{ key: 'firstOrderRelativePriceChangePct', expected: -3, unit: 'percentPriceChange' }, { key: 'firstOrderPriceChange', expected: -2.94, unit: 'currency' }, { key: 'isExactRepricing', expected: false, unit: 'boolean' }] },
  },
  {
    id: 'M9', mode: 'valuation', label: '估值实验 09 · Gordon Boundary', title: 'required return 上升 1 个百分点时，冻结增长的永续股权价格怎样变化？',
    brief: 'SYNTHETIC：D1=5、k=9%、g=4%；随后只把 k 提至10%。稳定永续且始终满足 k>g。', synthetic: true,
    facts: [{ label: 'D1', value: '5', note: '下一期股息' }, { label: 'k / g', value: '9% / 4%', note: 'base price=100' }, { label: 'shock', value: 'k→10%', note: 'D1、g冻结' }],
    formulas: ['P=D1/(k−g)'], formulaUnits: 'k与g先写成小数；输出为货币单位和价格百分比变化。',
    options: [{ id: 'a', label: '新价格90.909091；下跌9.0909%', diagnosis: '你可能把新 spread 写成5.5%或机械把利率变化映射成价格变化。' }, { id: 'b', label: '新价格83.333333；下跌16.6667%', diagnosis: '正确：分母从5%升到6%，非线性地压低价格。' }, { id: 'c', label: '新价格125；上涨25%', diagnosis: 'required return 上升会扩大分母；请同时检查符号和 k>g。' }], correct: 'b',
    calculation: 'P0=5/(.09−.04)=100；P1=5/(.10−.04)=83.333333；变化=(83.333333/100−1)=−16.6667%。', reveal: '这是冻结现金流和增长的比较静态，不证明现实股价变化只由无风险率驱动。', primarySectionId: 'gordon-growth', remediationSectionIds: ['equity-residual-claim', 'cash-flow-vs-discount-rate-news', 'claim-specific-premium'], sourceIds: [50],
    numericAssertions: [{ key: 'baseEquityValue', expected: 100, unit: 'currency' }, { key: 'shockedEquityValue', expected: 83.33333333333333, unit: 'currency', tolerance: 1e-9 }, { key: 'equityPriceChangePct', expected: -16.666666666666675, unit: 'percentPriceChange', tolerance: 1e-9 }, { key: 'gordonBoundarySatisfied', expected: true, unit: 'boolean' }],
    staticTwin: { id: 'K9', title: '变式 09 · Gordon', prompt: 'D1=4、k=8%、g=3%；只把 k 提至9%。', choices: [{ id: 'a', label: 'base=80；new=66.666667；跌16.6667%' }, { id: 'b', label: 'base=80；new=72.727273；跌9.0909%' }, { id: 'c', label: 'base=133.333333；new=100；跌25%' }], correct: 'a', calculations: ['base=4/(.08−.03)=80。', 'new=4/(.09−.03)=66.666666667。', '相对变化=−16.6667%。'], answer: 'A。输入变化只允许解释为本题冻结条件下的局部估值实验。', sourceIds: [50], numericAssertions: [{ key: 'baseEquityValue', expected: 80, unit: 'currency' }, { key: 'shockedEquityValue', expected: 66.66666666666667, unit: 'currency', tolerance: 1e-9 }, { key: 'equityPriceChangePct', expected: -16.666666666666664, unit: 'percentPriceChange', tolerance: 1e-9 }] },
  },
  {
    id: 'M10', mode: 'valuation', label: '估值实验 10 · WACC Eligibility', title: '满足 FCFF 与稳定目标杠杆条件时，WACC 是多少？',
    brief: 'SYNTHETIC：E=600、D=400 均为市场价值；Re=10%、Rd=5%、公司税率25%；FCFF、同风险、稳定目标杠杆、币种与名实口径均匹配。', synthetic: true,
    facts: [{ label: 'E / D', value: '600 / 400', note: 'market values' }, { label: 'Re / Rd', value: '10% / 5%', note: '同币种同名实口径' }, { label: 'tax / cash flow', value: '25% / FCFF', note: '稳定目标杠杆' }],
    formulas: ['WACC=(E/V)Re+(D/V)Rd(1−Tc)'], formulaUnits: '权重使用市场价值；输出为年化百分比。',
    options: [{ id: 'a', label: '7.50%，本题条件下可用于 FCFF', diagnosis: '正确：股权贡献6%，税后债务贡献1.5%。' }, { id: 'b', label: '8.00%，可用于 FCFE', diagnosis: '遗漏税盾，而且 WACC 与 FCFF 配套，不直接贴现 FCFE。' }, { id: 'c', label: '6.50%，无条件适用于任何项目', diagnosis: 'WACC 不是通用市场贴现率；项目风险、杠杆、币种和现金流口径都必须匹配。' }], correct: 'a',
    calculation: 'V=1000；WACC=.6×10%+.4×5%×(1−.25)=6%+1.5%=7.5%。', reveal: '任何 eligibility guard 失败时，都应停止输出单一 WACC，并转向匹配的 cost of equity、APV 或期限结构 DCF。', primarySectionId: 'wacc', remediationSectionIds: ['wacc-eligibility', 'apv', 'nominal-real-dcf-consistency'], sourceIds: [51, 52, 53, 54, 55],
    numericAssertions: [{ key: 'waccPct', expected: 7.5, unit: 'annualPercentRate' }, { key: 'eligible', expected: true, unit: 'boolean' }, { key: 'cashFlowType', expected: 'FCFF', unit: 'string' }],
    staticTwin: { id: 'K10', title: '变式 10 · WACC', prompt: 'E=700、D=300，Re=9%、Rd=4%、税率20%；其余资格条件满足。', choices: [{ id: 'a', label: '7.50%' }, { id: 'b', label: '7.26%' }, { id: 'c', label: '6.30%' }], correct: 'b', calculations: ['V=1000，E/V=.7，D/V=.3。', 'WACC=.7×9%+.3×4%×(1−.20)。', 'WACC=6.3%+.96%=7.26%。'], answer: 'B。若现金流改为 FCFE 或杠杆路径变化，公式资格也随之改变。', sourceIds: [51, 52, 53, 54, 55], numericAssertions: [{ key: 'waccPct', expected: 7.26, unit: 'annualPercentRate' }, { key: 'eligible', expected: true, unit: 'boolean' }] },
  },
];

const m4Strict = stochasticExpectedRealReturnPct(6, [{ inflationPct: 0, probability: 0.5 }, { inflationPct: 12, probability: 0.5 }]);
const m4Plugin = exactRealReturnPct(6, 6);
const k4Strict = stochasticExpectedRealReturnPct(6, [{ inflationPct: 2, probability: 0.75 }, { inflationPct: 10, probability: 0.25 }]);
const k4Plugin = exactRealReturnPct(6, 4);
const m5Metrics = tipsContractMetrics('M5');
const k5Metrics = tipsContractMetrics('K5');
const m7Metrics = dcfConsistencyMetrics('M7');
const k7Metrics = dcfConsistencyMetrics('K7');
const m9Base = gordonPrice(5, 9, 4);
const m9Shocked = gordonPrice(5, 10, 4);
const k9Base = gordonPrice(4, 8, 3);
const k9Shocked = gordonPrice(4, 9, 3);

const calculatedScenarioValues: Record<string, Record<string, number | string | boolean | null>> = {
  M1: { exPostRealReturnPct: exactRealReturnPct(6, 3), isExAnte: false },
  K1: { exPostRealReturnPct: exactRealReturnPct(5.5, -1) },
  M2: { exAntePlugInRealRatePct: exactRealReturnPct(7, 4), estimationKind: 'plugInPointForecast' },
  K2: { exAntePlugInRealRatePct: exactRealReturnPct(9, 6), estimationKind: 'plugInPointForecast' },
  M3: { exactNominalRatePct: exactFisherNominalPct(5, 8), crossTermBp: 5 * 8, isFisherEffectEstimate: false },
  K3: { exactNominalRatePct: exactFisherNominalPct(4, 10), crossTermBp: 4 * 10 },
  M4: { strictExpectedRealReturnPct: m4Strict, plugInRealReturnPct: m4Plugin, jensenGapBp: m4Strict === null || m4Plugin === null ? null : (m4Strict - m4Plugin) * 100, isInflationRiskPremium: false },
  K4: { strictExpectedRealReturnPct: k4Strict, plugInRealReturnPct: k4Plugin, jensenGapBp: k4Strict === null || k4Plugin === null ? null : (k4Strict - k4Plugin) * 100 },
  M5: { currentAdjustedPrincipal: m5Metrics.currentAdjustedPrincipal, nextSemiannualCoupon: m5Metrics.nextCoupon, maturityAdjustedPrincipal: m5Metrics.maturityAdjustedPrincipal, maturityPrincipalPayment: m5Metrics.maturityPrincipalPayment },
  K5: { currentAdjustedPrincipal: k5Metrics.currentAdjustedPrincipal, nextSemiannualCoupon: k5Metrics.nextCoupon, maturityAdjustedPrincipal: k5Metrics.maturityAdjustedPrincipal, maturityPrincipalPayment: k5Metrics.maturityPrincipalPayment },
  M6: { estimatedModelRealYieldPct: realYieldDecompositionFixtures.M6.observedTipsYieldPct - realYieldDecompositionFixtures.M6.signedTipsLiquidityYieldWedgePct, estimatedRealTermPremiumPct: realYieldDecompositionFixtures.M6.observedTipsYieldPct - realYieldDecompositionFixtures.M6.signedTipsLiquidityYieldWedgePct - realYieldDecompositionFixtures.M6.expectedAverageRealShortRatePct, independentRStarEstimatePct: realYieldDecompositionFixtures.M6.independentRStarEstimatePct, rStarIsObservedTipsYield: false },
  K6: { estimatedModelRealYieldPct: realYieldDecompositionFixtures.K6.observedTipsYieldPct - realYieldDecompositionFixtures.K6.signedTipsLiquidityYieldWedgePct, estimatedRealTermPremiumPct: realYieldDecompositionFixtures.K6.observedTipsYieldPct - realYieldDecompositionFixtures.K6.signedTipsLiquidityYieldWedgePct - realYieldDecompositionFixtures.K6.expectedAverageRealShortRatePct, independentRStarEstimatePct: realYieldDecompositionFixtures.K6.independentRStarEstimatePct },
  M7: { nominalCashFlow: m7Metrics.nominalCashFlow, exactNominalDiscountRatePct: m7Metrics.exactNominalDiscountRatePct, realPresentValue: m7Metrics.realPresentValue, nominalPresentValue: m7Metrics.nominalPresentValue },
  K7: { nominalCashFlow: k7Metrics.nominalCashFlow, exactNominalDiscountRatePct: k7Metrics.exactNominalDiscountRatePct, presentValue: k7Metrics.realPresentValue },
  M8: { firstOrderRelativePriceChangePct: durationPriceChangePct(8, 50), firstOrderPriceChange: 102 * durationPriceChangePct(8, 50) / 100, isExactRepricing: false },
  K8: { firstOrderRelativePriceChangePct: durationPriceChangePct(12, 25), firstOrderPriceChange: 98 * durationPriceChangePct(12, 25) / 100, isExactRepricing: false },
  M9: { baseEquityValue: m9Base, shockedEquityValue: m9Shocked, equityPriceChangePct: m9Base === null || m9Shocked === null ? null : (m9Shocked / m9Base - 1) * 100, gordonBoundarySatisfied: 9 > 4 && 10 > 4 },
  K9: { baseEquityValue: k9Base, shockedEquityValue: k9Shocked, equityPriceChangePct: k9Base === null || k9Shocked === null ? null : (k9Shocked / k9Base - 1) * 100 },
  M10: { waccPct: waccPct(600, 400, 10, 5, 25), eligible: true, cashFlowType: 'FCFF' },
  K10: { waccPct: waccPct(700, 300, 9, 4, 20), eligible: true },
};

function assertionPasses(actual: number | string | boolean | null | undefined, assertion: RealRateAssertion) {
  if (typeof assertion.expected !== 'number') return actual === assertion.expected;
  return typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - assertion.expected) <= (assertion.tolerance ?? 1e-9);
}

export const realRateNumericAssertionAudit = realRateScenarios.flatMap((scenario) => ([
  ...scenario.numericAssertions.map((assertion) => ({ scenarioId: scenario.id, key: assertion.key, passed: assertionPasses(calculatedScenarioValues[scenario.id]?.[assertion.key], assertion) })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({ scenarioId: scenario.staticTwin.id, key: assertion.key, passed: assertionPasses(calculatedScenarioValues[scenario.staticTwin.id]?.[assertion.key], assertion) })),
]));

export const realRateScenarioAssertions = [
  { id: 'scenario-count', statement: '主题题为 M1–M10 共 10 道。', passed: realRateScenarios.length === 10 && realRateScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { id: 'static-count', statement: '静态孪生题为 K1–K10 共 10 道。', passed: realRateScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { id: 'mode-balance', statement: '购买力与估值两个模式各有 5 道题。', passed: realRateModes.every((mode) => realRateScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { id: 'unique-options', statement: '每道主题与孪生题的三个选项均互不相同。', passed: realRateScenarios.every((scenario) => new Set(scenario.options.map((option) => option.label)).size === 3 && new Set(scenario.staticTwin.choices.map((option) => option.label)).size === 3) },
  { id: 'correct-position-pattern', statement: '主题与孪生题正确位置序列不同且非单一位置。', passed: realRateScenarios.map((scenario) => scenario.correct).join('') === 'acbacbcaba' && realRateScenarios.map((scenario) => scenario.staticTwin.correct).join('') === 'bacbacbcab' },
  { id: 'guard-fields', statement: 'M2/M4/M6/M8/M10 分别保存 plug-in、非风险溢价、r*分层、近似与WACC资格护栏。', passed: realRateScenarios[1].numericAssertions.some((item) => item.key === 'estimationKind' && item.expected === 'plugInPointForecast') && realRateScenarios[3].numericAssertions.some((item) => item.key === 'isInflationRiskPremium' && item.expected === false) && realRateScenarios[5].numericAssertions.some((item) => item.key === 'rStarIsObservedTipsYield' && item.expected === false) && realRateScenarios[7].numericAssertions.some((item) => item.key === 'isExactRepricing' && item.expected === false) && realRateScenarios[9].numericAssertions.some((item) => item.key === 'eligible' && item.expected === true) },
] as const;
import {
  dcfConsistencyMetrics,
  durationPriceChangePct,
  exactFisherNominalPct,
  exactRealReturnPct,
  gordonPrice,
  realYieldDecompositionFixtures,
  stochasticExpectedRealReturnPct,
  tipsContractMetrics,
  waccPct,
} from './realRateFixtures';
