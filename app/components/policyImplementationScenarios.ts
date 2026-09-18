export type PolicyImplementationMode = 'measurement' | 'mechanism';
export type PolicyImplementationChoice = 'a' | 'b' | 'c';

export type PolicyImplementationAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type PolicyImplementationScenario = {
  id: string;
  mode: PolicyImplementationMode;
  label: string;
  title: string;
  brief: string;
  synthetic: boolean;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: PolicyImplementationChoice; label: string; diagnosis: string }[];
  correct: PolicyImplementationChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: {
    title: string;
    prompt: string;
    calculations: string[];
    answer: string;
    numericAssertions: PolicyImplementationAssertion[];
  };
  numericAssertions: PolicyImplementationAssertion[];
};

export const policyImplementationModes: {
  id: PolicyImplementationMode;
  label: string;
  title: string;
  description: string;
}[] = [
  {
    id: 'measurement',
    label: 'MODE A',
    title: '先把账本、对象与单位量对',
    description: '复算准备金恒等式、区间误差、边际机会成本、便利净价与 benchmark 统计量。',
  },
  {
    id: 'mechanism',
    label: 'MODE B',
    title: '再诊断利率为何偏离',
    description: '区分稀缺、准入泄漏、分布短缺、储备管理、技术条款意外与实施结果意外。',
  },
];

export const policyImplementationScenarios: PolicyImplementationScenario[] = [
  {
    id: 'M1',
    mode: 'measurement',
    label: '测量实验 01 · Reserve Identity',
    title: '政府支出进入商业银行账户，系统准备金怎样变化？',
    brief: 'SYNTHETIC：只做同一时点、同一口径的央行资产负债表会计，不评价财政支出的宏观效果。',
    synthetic: true,
    facts: [
      { label: '央行资产 A', value: '1,000', note: '十亿元本币；本题保持不变' },
      { label: '负债与净值', value: 'C 400 · G 120 · O 80 · K 50', note: '现金、政府存款、其他非准备金负债、资本／净值' },
      { label: '政府支出', value: '30', note: 'G 减少 30，款项进入私人部门商业银行账户' },
    ],
    formulas: ['R = A − C − G − O − K', 'ΔR = ΔA − ΔC − ΔG − ΔO − ΔK'],
    formulaUnits: '资产负债表项目均为十亿元本币；流量与存量口径一致。',
    options: [
      { id: 'a', label: '系统准备金减少 30', diagnosis: '你的符号方向来自直觉而非恒等式。请先写清政府账户 G 在这笔付款中的变化，再只用 ΔR=−ΔG 复算。' },
      { id: 'b', label: '系统准备金不变，只在银行之间重分配', diagnosis: '你把“银行间重分配”的边界用到了含政府央行账户的付款。请先判断这是否属于银行体系内部的闭合转账。' },
      { id: 'c', label: '系统准备金增加 30', diagnosis: '正确。支付前 R=350，支付后政府存款为 90、R=380。' },
    ],
    correct: 'c',
    calculation: '支付前 R=1,000−400−120−80−50=350；支付后 G=90，所以 R=1,000−400−90−80−50=380；ΔR=+30。',
    reveal: '政府支出把央行对政府的负债转换为对银行体系的准备金负债。它改变系统总量；之后银行之间的付款只会在机构间重新分配这 30。恒等式说明记账方向，不单独识别财政冲击的宏观因果效果。',
    revisit: '回看 06「Settlement Ledger」、07「Central-bank Identity」与 08「Autonomous Factors」。',
    sourceIds: [1],
    staticSourceIds: [1],
    staticTwin: {
      title: '变式 01 · 税款进入政府账户',
      prompt: 'SYNTHETIC：A=700、C=260、G=95、O=45、K=40。私人部门缴税 25，其他项目不变。求税前、税后准备金与 ΔR。',
      calculations: ['税前 R=700−260−95−45−40=260。', '缴税后 G=120，R=700−260−120−45−40=235。', 'ΔR=235−260=−25。'],
      answer: '税款从商业银行账户进入政府央行账户，系统准备金减少 25；这不是央行出售资产。',
      numericAssertions: [
        { key: 'preReserveBillion', expected: 260, unit: 'billionCurrency' },
        { key: 'postReserveBillion', expected: 235, unit: 'billionCurrency' },
        { key: 'reserveDeltaBillion', expected: -25, unit: 'billionCurrency' },
      ],
    },
    numericAssertions: [
      { key: 'preReserveBillion', expected: 350, unit: 'billionCurrency' },
      { key: 'postReserveBillion', expected: 380, unit: 'billionCurrency' },
      { key: 'reserveDeltaBillion', expected: 30, unit: 'billionCurrency' },
    ],
  },
  {
    id: 'M2',
    mode: 'measurement',
    label: '测量实验 02 · Point vs Range',
    title: '有效率越过目标区间上界时，控制误差是多少？',
    brief: 'SYNTHETIC：正式对象是区间越界距离；相对中点位置可另报，但不能替代它。',
    synthetic: true,
    facts: [
      { label: '目标区间', value: '[3.50%, 3.75%]', note: '年化；L=3.50%，U=3.75%' },
      { label: '有效隔夜率', value: '3.82%', note: '与目标同币种、同合约、同日期' },
      { label: '单位', value: '1bp = 0.01pp', note: 'percentage point 与 percent change 不可混用' },
    ],
    formulas: ['i_eff > U 时：e_range = i_eff − U', '区间内：e_range = 0'],
    formulaUnits: '利率为 %/year；差值先得 percentage points，再换算 basis points。',
    options: [
      { id: 'a', label: '+7bp', diagnosis: '正确。3.82% 比上界 3.75% 高 0.07 个百分点，即 7bp。' },
      { id: 'b', label: '+19.5bp', diagnosis: '你计算了另一种位置统计量。请对照题目要求，确认正式误差的参照物是区间中点还是最近边界。' },
      { id: 'c', label: '0bp', diagnosis: '只有有效率属于目标集合时，区间误差才置零。请先用题给值完成集合归属判断。' },
    ],
    correct: 'a',
    calculation: 'e_range=3.82−3.75=0.07 percentage point；0.07pp÷0.01pp/bp=+7bp。相对中点另为 +19.5bp。',
    reveal: '区间目标内部的正式越界误差为零；越界后只量到最近边界。若用中点误差评价控制，会把正式允许的区间内位置误写成失败。',
    revisit: '回看 36「Four Rate Objects」、37「Benchmark Method」与 38「Control Error」。',
    sourceIds: [4, 8],
    staticSourceIds: [4, 8],
    staticTwin: {
      title: '变式 02 · 有效率低于区间下界',
      prompt: 'SYNTHETIC：目标区间为 [2.25%,2.50%]，同对象有效率为 2.21%。计算有符号越界距离。',
      calculations: ['低于下界时 e_range=i_eff−L。', 'e_range=2.21−2.25=−0.04pp=−4bp。', '相对中点为 −16.5bp，只是另一项位置统计。'],
      answer: '正式区间越界误差为 −4bp。',
      numericAssertions: [
        { key: 'lowerBoundPct', expected: 2.25, unit: 'percentPerYear', tolerance: 1e-9 },
        { key: 'effectiveRatePct', expected: 2.21, unit: 'percentPerYear', tolerance: 1e-9 },
        { key: 'rangeErrorBp', expected: -4, unit: 'basisPoint' },
        { key: 'midpointDistanceBp', expected: -16.5, unit: 'basisPoint', tolerance: 1e-9 },
      ],
    },
    numericAssertions: [
      { key: 'upperBoundPct', expected: 3.75, unit: 'percentPerYear', tolerance: 1e-9 },
      { key: 'effectiveRatePct', expected: 3.82, unit: 'percentPerYear', tolerance: 1e-9 },
      { key: 'rangeErrorBp', expected: 7, unit: 'basisPoint' },
      { key: 'midpointDistanceBp', expected: 19.5, unit: 'basisPoint', tolerance: 1e-9 },
    ],
  },
  {
    id: 'M3',
    mode: 'measurement',
    label: '测量实验 03 · Marginal Opportunity Cost',
    title: '边际准备金机会成本与数量级 proxy 应怎样复算？',
    brief: 'SYNTHETIC：乘积只是年化利差暴露的描述性数量级，不是 BIS 定义的福利损失。',
    synthetic: true,
    facts: [
      { label: '相关隔夜市场率', value: '2.18%', note: '年化' },
      { label: '边际准备金报酬', value: '2.10%', note: '使用边际而非平均报酬' },
      { label: '超额准备金', value: '80bn', note: '十亿元；只用于描述性乘积' },
    ],
    formulas: ['c_m = i_ON − i_R,marg', 'proxy = c_m(decimal) × Q_excess'],
    formulaUnits: 'spread 用 bp；乘金额前 8bp 必须转成 0.0008；结果为每年货币金额。',
    options: [
      { id: 'a', label: '0.08bp；0.64m/year', diagnosis: '百分点、基点与十进制利率至少有一步换算不一致。请逐层标出单位，再把利差乘以金额。' },
      { id: 'b', label: '8bp；64m/year', diagnosis: '正确。0.08pp=8bp，0.0008×80bn=0.064bn=64m。' },
      { id: 'c', label: '80bp；640m/year', diagnosis: '换算数量级与题给的 bp 定义不一致。请从 1bp=0.01pp 开始逐步复算，不要跳过十进制利率。' },
    ],
    correct: 'b',
    calculation: 'c_m=2.18%−2.10%=0.08pp=8bp；proxy=0.0008×80bn=0.064bn=64m/year。',
    reveal: '两维要分开保存：边际 spread 描述持有或贷出下一单位准备金的价格激励，超额数量描述流动性缓冲。它们的乘积可帮助检查量纲，但不包含风险、抵押品、资产负债表成本，也不是福利度量。',
    revisit: '回看 15「Relative Return」、20「BIS Two Dimensions」与 28「Tiering」。',
    sourceIds: [1],
    staticSourceIds: [1],
    staticTwin: {
      title: '变式 03 · 更小 spread、更大余额',
      prompt: 'SYNTHETIC：市场率 3.94%、边际准备金报酬 3.90%、超额余额 120bn。求 c_m 与描述性 proxy。',
      calculations: ['c_m=3.94−3.90=0.04pp=4bp。', '4bp=0.0004。', '0.0004×120bn=0.048bn=48m/year。'],
      answer: '4bp 与 48m/year；后者仍不是福利损失。',
      numericAssertions: [
        { key: 'opportunityCostBp', expected: 4, unit: 'basisPoint' },
        { key: 'exposureMillionLocalCurrencyPerYear', expected: 48, unit: 'millionCurrencyPerYear' },
      ],
    },
    numericAssertions: [
      { key: 'opportunityCostBp', expected: 8, unit: 'basisPoint' },
      { key: 'exposureMillionLocalCurrencyPerYear', expected: 64, unit: 'millionCurrencyPerYear' },
    ],
  },
  {
    id: 'M4',
    mode: 'measurement',
    label: '测量实验 04 · Effective Facility Price',
    title: '常备贷款便利的牌价与机构有效成本为何不同？',
    brief: 'SYNTHETIC：所有附加成本都已换成年化 bp；现实中不可观察的 stigma 只能作区间或机制标签。',
    synthetic: true,
    facts: [
      { label: '贷款便利牌价', value: '4.00%', note: '年化' },
      { label: '附加成本', value: '抵押品 6bp · 资产负债表 3bp · 操作/stigma 4bp', note: '合计 13bp' },
      { label: '同期限市场融资', value: '4.08%', note: '已匹配期限与币种' },
    ],
    formulas: ['i_L,eff = i_L + κ_coll + κ_BS + κ_ops/stigma'],
    formulaUnits: '各 κ 均为年化 basis points；100bp=1 percentage point。',
    options: [
      { id: 'a', label: '有效成本 4.13%，市场便宜 5bp', diagnosis: '正确。牌价加 13bp 得 4.13%，比 4.08% 高 5bp。' },
      { id: 'b', label: '有效成本 4.04%，便利更便宜', diagnosis: '附加成本的加总不完整。请逐项核对定义式中的抵押品、资产负债表与操作成本，再比较同期限市场融资。' },
      { id: 'c', label: '有效成本就是 4.00%，附加成本不能进入比较', diagnosis: '你把网页牌价直接当成机构可执行净价。请回到有效成本定义，判断题给的各项 κ 是否需要进入比较。' },
    ],
    correct: 'a',
    calculation: 'i_L,eff=4.00%+(6+3+4)bp=4.13%；4.13%−4.08%=0.05pp=5bp，因此市场融资便宜 5bp。',
    reveal: '便利能否形成软上界，取决于真实可达净价，而非网页牌价。现实中的 κ 往往不能精确观察；本题加总只训练比较结构，不能把现实残差自动命名为 stigma。',
    revisit: '回看 23「Soft Bounds」、32「Collateral / Haircut」与 35「Effective Facility Price」。',
    sourceIds: [12, 25],
    staticSourceIds: [25],
    staticTwin: {
      title: '变式 04 · 存放端净外部选项',
      prompt: 'SYNTHETIC：存放牌价 1.90%，准入、资产负债表与操作成本合计 11bp；市场率 1.80%。比较净存放回报与市场率。',
      calculations: ['i_D,net=1.90%−0.11%=1.79%。', '市场率 1.80% 比净存放回报高 1bp。'],
      answer: '市场净回报高 1bp；表面存放牌价更高，不保证存央行是更优的机构净选择。',
      numericAssertions: [
        { key: 'netDepositReturnPct', expected: 1.79, unit: 'percentPerYear', tolerance: 1e-9 },
        { key: 'marketAdvantageBp', expected: 1, unit: 'basisPoint' },
      ],
    },
    numericAssertions: [
      { key: 'effectiveFacilityRatePct', expected: 4.13, unit: 'percentPerYear', tolerance: 1e-9 },
      { key: 'marketCheaperByBp', expected: 5, unit: 'basisPoint' },
    ],
  },
  {
    id: 'M5',
    mode: 'measurement',
    label: '测量实验 05 · Benchmark Statistic',
    title: '成交量加权中位数与加权平均数为何不能互换？',
    brief: 'SYNTHETIC：本题模拟 EFFR-like 的 volume-weighted median，不代表任何现实交易日。',
    synthetic: true,
    facts: [
      { label: '合格成交', value: '10@3.50 · 25@3.55 · 40@3.60 · 25@3.70', note: '成交量@年化利率' },
      { label: '总成交量', value: '100', note: '从低利率向高利率累计' },
      { label: '待求', value: 'Volume-weighted median', note: '不是 weighted mean' },
    ],
    formulas: ['median = 第一个累计成交量达到总量 50% 的利率档', 'mean = Σ(volume × rate) / Σvolume'],
    formulaUnits: '利率为 %/year；成交量单位任意但须同口径。',
    options: [
      { id: 'a', label: '3.55%', diagnosis: '所选档位尚未满足题目定义的累计成交量阈值。请从最低利率档重新累加，而不是按档位顺序猜测。' },
      { id: 'b', label: '3.6025%', diagnosis: '你混用了加权平均数与加权中位数。请改用“第一个达到累计阈值的利率档”这一规则。' },
      { id: 'c', label: '3.60%', diagnosis: '正确。累计量在 3.60% 档从 35 上升到 75，第 50 百分位落在此档。' },
    ],
    correct: 'c',
    calculation: '累计量依次为 10、35、75、100，第 50 单位落在 3.60% 档；加权均值=(10×3.50+25×3.55+40×3.60+25×3.70)/100=3.6025%。',
    reveal: '统计方法定义 estimand。中位数对尾部成交更稳健，却可能在 99th percentile 已显著上升时保持不动；因此控制监测必须同时保存中心、分位数、成交量和参与者。',
    revisit: '回看 37「Benchmark Methodology」与 39「Control Dashboard」。',
    sourceIds: [8],
    staticSourceIds: [8],
    staticTwin: {
      title: '变式 05 · 新成交分布',
      prompt: 'SYNTHETIC：合格成交为 20@1.90、35@2.00、45@2.10。求 volume-weighted median 与 weighted mean。',
      calculations: ['总量 100，累计量 20、55、100。', '第 50 百分位落在 2.00% 档。', '加权均值=(20×1.90+35×2.00+45×2.10)/100=2.025%。'],
      answer: '加权中位数 2.00%；加权均值 2.025%。',
      numericAssertions: [
        { key: 'totalVolume', expected: 100, unit: 'volume' },
        { key: 'cumulativeAt200', expected: 55, unit: 'volume' },
        { key: 'weightedMedianPct', expected: 2, unit: 'percentPerYear', tolerance: 1e-9 },
        { key: 'weightedMeanPct', expected: 2.025, unit: 'percentPerYear', tolerance: 1e-9 },
      ],
    },
    numericAssertions: [
      { key: 'totalVolume', expected: 100, unit: 'volume' },
      { key: 'cumulativeAt360', expected: 75, unit: 'volume' },
      { key: 'weightedMedianPct', expected: 3.6, unit: 'percentPerYear', tolerance: 1e-9 },
      { key: 'weightedMeanPct', expected: 3.6025, unit: 'percentPerYear', tolerance: 1e-9 },
    ],
  },
  {
    id: 'K1',
    mode: 'mechanism',
    label: '机制实验 01 · Corridor Demand Shift',
    title: '目标不变、准备金需求右移，怎样把市场率拉回目标附近？',
    brief: 'SYNTHETIC：供给原本落在走廊需求曲线斜坡，冲击来自临时付款风险，不是宏观目标变化。',
    synthetic: true,
    facts: [
      { label: '政策目标与两端', value: '不变', note: '立场未改变' },
      { label: '准备金需求', value: '右移', note: '突发付款风险提高边际准备金价值' },
      { label: '观察', value: '市场率向贷款端上升', note: '需要技术实施响应' },
    ],
    formulas: ['需求右移 + 固定供给 → 交点利率上升', '供给右移 → 交点回到原目标附近'],
    formulaUnits: '这是方向性比较静态；未冻结真实数量或利率系数。',
    options: [
      { id: 'a', label: '下调政策目标', diagnosis: '你选择了会改变宏观立场的动作。请先遵守“目标不变”的约束，再判断需求、供给或目标中究竟哪一项需要调整。' },
      { id: 'b', label: '通过 repo/OMO 增加准备金，或按既定价格弹性供给', diagnosis: '正确。供给响应针对目标给定后的需求右移。' },
      { id: 'c', label: '降低存款便利率', diagnosis: '这个动作会改变价格边界。请检验它是否既能抵消题设的曲线移动，又能满足“目标与两端不变”的约束。' },
    ],
    correct: 'b',
    calculation: '目标与走廊端点不变；需求曲线右移使固定供给处的交点上升。央行以 repo/OMO 使供给右移，或在既定价格 full allotment，使市场交点回到操作目标附近。',
    reveal: '先判断是哪一条边移动，再决定是技术响应还是立场响应。临时支付冲击下增加准备金不等于降息；若需求永久外移，央行还要重估长期供给区间与框架。',
    revisit: '回看 08「Autonomous Factors」、21「Nonlinear Demand」、22「Corridor」与 30–31「Operations」。',
    sourceIds: [42, 45],
    staticSourceIds: [1, 9],
    staticTwin: {
      title: '变式 06 · 政府账户意外吸收准备金',
      prompt: 'SYNTHETIC：目标不变，政府账户意外增加 50，使准备金供给左移 50；市场率在走廊斜坡上上升。央行及时 repo 供给 50，会形成什么闭环？',
      calculations: ['G↑50 → R↓50。', '斜坡上供给左移 → 市场率上升。', 'repo +50 → R 恢复；其他项给定时交点近似复原。'],
      answer: '这是 G↑→R↓→rate↑→repo→R↑ 的技术控制闭环，不是下调政策目标。',
      numericAssertions: [
        { key: 'governmentAccountDeltaBillion', expected: 50, unit: 'billionCurrency' },
        { key: 'reserveDrainBillion', expected: 50, unit: 'billionCurrency' },
        { key: 'repoInjectionBillion', expected: 50, unit: 'billionCurrency' },
        { key: 'finalNetReserveChangeBillion', expected: 0, unit: 'billionCurrency' },
      ],
    },
    numericAssertions: [
      { key: 'targetUnchanged', expected: true, unit: 'boolean' },
      { key: 'demandShiftDirection', expected: 'right', unit: 'direction' },
      { key: 'technicalResponse', expected: 'increaseSupply', unit: 'category' },
    ],
  },
  {
    id: 'K2',
    mode: 'mechanism',
    label: '机制实验 02 · Leaky Floor',
    title: '市场率低于存款便利率，为什么未必存在可执行套利？',
    brief: 'SYNTHETIC：边际贷款人是没有存款便利准入的非银行；有账户银行吸收资金会产生成本。',
    synthetic: true,
    facts: [
      { label: '存款便利率', value: '2.00%', note: '只有合资格账户持有人可直接获得' },
      { label: '市场率', value: '1.92%', note: '无便利准入的非银行提供资金' },
      { label: '银行中介成本 κ', value: '10bp', note: '资产负债表与操作成本合计' },
    ],
    formulas: ['gross spread = i_D − i_market', 'net arbitrage = gross spread − κ'],
    formulaUnits: '所有利差与成本均为年化 basis points。',
    options: [
      { id: 'a', label: '任何低于 2.00% 的成交都不可能', diagnosis: '你把牌价当成了所有主体都可用的硬界。请先核对边际贷款人的准入，再复算可执行净套利。' },
      { id: 'b', label: '央行一定把政策目标下调了', diagnosis: '你从一个市场率位置直接跳到了目标变化。请先检查准入、主体身份与中介成本这些中间条件。' },
      { id: 'c', label: '1.92% 可以是均衡成交；净套利为负', diagnosis: '正确。毛差 8bp 小于 10bp 中介成本，净差 −2bp。' },
    ],
    correct: 'c',
    calculation: '毛差=2.00%−1.92%=0.08pp=8bp；净套利=8−10=−2bp。有账户银行没有动力无限吸收这笔资金。',
    reveal: '牌价只有经准入、资产负债表容量与操作路径折算后，才形成主体特异的外部选项。低于表面地板的成交不自动等于失控；仍需核对期限、信用、benchmark 方法与主体身份。',
    revisit: '回看 19「Access Network」、23「Soft Bounds」、25「Leaky Floor」与 35「Effective Price」。',
    sourceIds: [1, 19, 35],
    staticSourceIds: [1, 19, 35],
    staticTwin: {
      title: '变式 07 · 地板套利何时有利',
      prompt: 'SYNTHETIC：存款便利率 3.00%、市场率 2.94%，合资格银行总中介成本 4bp。求毛差与净差，并判断方向。',
      calculations: ['毛差=3.00−2.94=0.06pp=6bp。', '净差=6−4=+2bp。'],
      answer: '套利有利，银行吸收资金并存回央行的行为倾向收窄 spread；容量有限时不保证立刻完全收敛。',
      numericAssertions: [
        { key: 'grossArbitrageBp', expected: 6, unit: 'basisPoint' },
        { key: 'intermediationCostBp', expected: 4, unit: 'basisPoint' },
        { key: 'netArbitrageBp', expected: 2, unit: 'basisPoint' },
      ],
    },
    numericAssertions: [
      { key: 'grossArbitrageBp', expected: 8, unit: 'basisPoint' },
      { key: 'intermediationCostBp', expected: 10, unit: 'basisPoint' },
      { key: 'netArbitrageBp', expected: -2, unit: 'basisPoint' },
    ],
  },
  {
    id: 'K3',
    mode: 'mechanism',
    label: '机制实验 03 · Aggregate vs Distribution',
    title: '总量不变时，局部准备金短缺与高利率为何仍会出现？',
    brief: 'SYNTHETIC：一次客户付款只在银行 A 与 B 之间移动准备金；B 因未来流出风险不愿贷回。',
    synthetic: true,
    facts: [
      { label: '系统准备金', value: '500 → 500', note: '总量不变' },
      { label: '银行间转移', value: 'A → B：60', note: 'A 跌破内部缓冲' },
      { label: 'B 的约束', value: '预防性缓冲', note: '担心稍后流出，不愿立即贷回' },
    ],
    formulas: ['R_A↓60 + R_B↑60 ⇒ ΔR_system=0', 'local price = f(distribution, network, buffers, access)'],
    formulaUnits: '余额为十亿元本币；价格方向是机制判断，不给结构系数。',
    options: [
      { id: 'a', label: '总量可仍充裕，但分布、网络与预防阈值使 A 边际短缺', diagnosis: '正确。系统平均不能替代边际节点的可达流动性。' },
      { id: 'b', label: '系统准备金一定减少 60', diagnosis: '你把单家机构的余额变化当成了系统净变化。请分别汇总 A 与 B 的过账，再比较系统前后总量。' },
      { id: 'c', label: '总量为 500，所以局部利率不可能上升', diagnosis: '你用聚合总量替代了边际节点的可达流动性。请把再分配意愿、网络、实体边界与准入逐项放回诊断。' },
    ],
    correct: 'a',
    calculation: 'A 减少 60，B 增加 60，因此系统前后都是 500；但 A 的边际短缺与 B 的预防性持有使可贷余额不足，局部借款率可以上升。',
    reveal: '“系统 ample”是聚合状态，不是每家银行的保证。诊断要看余额分布、付款时点、双边关系、集团转移限制和便利准入，再判断定向工具还是全系统供给更合适。',
    revisit: '回看 06「Settlement Ledger」、13「Precautionary Demand」、18「Distribution」与 41「Segmentation」。',
    sourceIds: [13, 51],
    staticSourceIds: [13],
    staticTwin: {
      title: '变式 08 · 清算节点短缺',
      prompt: 'SYNTHETIC：系统余额不变；清算银行 C 因代理客户流出 40，其他银行余额上升但受集团／时区限制不能回流；C 可用合格抵押品进入按需便利。最小诊断是什么？',
      calculations: ['系统 ΔR=0。', 'C 的可用余额 −40，其他节点 +40。', '回流受限，而 C 有可达的抵押便利。'],
      answer: '这是分布性／节点短缺与可达便利问题，不是系统总量减少 40；是否使用便利仍取决于其有效价格。',
      numericAssertions: [
        { key: 'aggregateReserveDeltaBillion', expected: 0, unit: 'billionCurrency' },
        { key: 'nodeOutflowBillion', expected: 40, unit: 'billionCurrency' },
        { key: 'facilityAccessible', expected: true, unit: 'boolean' },
      ],
    },
    numericAssertions: [
      { key: 'aggregateBeforeBillion', expected: 500, unit: 'billionCurrency' },
      { key: 'aggregateAfterBillion', expected: 500, unit: 'billionCurrency' },
      { key: 'transferBillion', expected: 60, unit: 'billionCurrency' },
    ],
  },
  {
    id: 'K4',
    mode: 'mechanism',
    label: '机制实验 04 · Reserve Management vs QE',
    title: '扩表与准备金增加，为什么不自动等于 QE？',
    brief: 'SYNTHETIC：央行事前说明操作只为抵消现金自治因素，并保持目标区间与路径沟通不变。',
    synthetic: true,
    facts: [
      { label: '现金需求冲击', value: 'C +60 → R −60', note: '其他项给定' },
      { label: '央行操作', value: '买入短期国库券 60', note: '资产 +60、准备金 +60' },
      { label: '立场与沟通', value: '不变', note: '维持既定 ample 状态' },
    ],
    formulas: ['cash drain: ΔR=−ΔC', 'bill purchase: ΔR=+ΔA', 'net ΔR=−60+60=0'],
    formulaUnits: '资产、现金与准备金均为十亿元本币；净变化相对冲击前基线。',
    options: [
      { id: 'a', label: '这是旨在压低长端的 QE', diagnosis: '你仅根据“资产购买”这一会计形式贴了政策标签。请同时核对操作目的、期限、无操作反事实与公告沟通。' },
      { id: 'b', label: '这是主要抵消自治因素的储备管理购买', diagnosis: '正确。短券购买恢复既定准备金状态，目标与路径未变。' },
      { id: 'c', label: '商业银行放贷直接把系统准备金增加 60', diagnosis: '你混同了商业银行存款创造与央行负债总量变化。请先限定哪类主体能够改变系统净准备金。' },
    ],
    correct: 'b',
    calculation: '现金需求使 R 机械减少 60；短券购买使 A 与 R 增加 60；相对冲击前净 ΔR=0。目的标签由公告、期限、反事实和预期通道共同决定。',
    reveal: '储备管理购买、QE 与市场功能购买可有相同 T-account，却切断不同机制边。判断不能只看 ΔA>0，而要问若没有现金缺口是否仍会购买、买何期限资产、希望改变哪段价格以及如何退出。',
    revisit: '回看 09「Five T-accounts」、43「Calendar / Communication」与 44「Reserve Management vs QE」。',
    sourceIds: [14],
    staticSourceIds: [50],
    staticTwin: {
      title: '变式 09 · 明确压低久期溢价的购买',
      prompt: 'SYNTHETIC：没有自治因素缺口时，央行宣布买入 100 的十年期债券，明确目标是降低久期／期限溢价并放松更长期金融条件。应如何分类？',
      calculations: ['不存在需要抵消的现金或政府账户缺口。', '资产期限为十年，公告目的指向长端金融条件。', '准备金增加是会计伴随，不是唯一传导。'],
      answer: '更接近 QE／balance-sheet stance 操作，而非单纯储备管理。',
      numericAssertions: [
        { key: 'purchaseBillion', expected: 100, unit: 'billionCurrency' },
        { key: 'maturityYears', expected: 10, unit: 'year' },
        { key: 'autonomousGapPresent', expected: false, unit: 'boolean' },
        { key: 'classification', expected: 'qeLike', unit: 'category' },
      ],
    },
    numericAssertions: [
      { key: 'currencyDrainBillion', expected: 60, unit: 'billionCurrency' },
      { key: 'billPurchaseBillion', expected: 60, unit: 'billionCurrency' },
      { key: 'netReserveChangeBillion', expected: 0, unit: 'billionCurrency' },
    ],
  },
  {
    id: 'K5',
    mode: 'mechanism',
    label: '机制实验 05 · Policy vs Technical-action Surprise',
    title: '目标区间不变、准备金报酬意外下调 5bp，应先归为什么？',
    brief: 'SYNTHETIC、Fed-like：公告明确称技术调整旨在让有效率更稳定地位于既定目标区间。',
    synthetic: true,
    facts: [
      { label: '目标区间', value: '[3.50%, 3.75%] → 不变', note: '目标变化 0bp' },
      { label: '准备金报酬', value: '3.70% → 3.65%', note: '意外下调 5bp' },
      { label: '会前条件预期', value: '若目标不变，管理条款也不变', note: 'E₋[ΔadministeredTerms | Δtarget=0]=0bp' },
      { label: '公告目的', value: '改善区间内控制', note: '不宣称改变宏观立场' },
    ],
    formulas: ['technical-action surprise = ΔadministeredTerms − E₋[ΔadministeredTerms | ΔtargetVector]', 'implementation-outcome surprise = Δe − E₋Δe，e=g(i_eff,targetSet)'],
    formulaUnits: '管理条款与目标用 bp 或完整向量保存；本题没有给 i_eff，因此只能计算 technical-action surprise，不能计算 implementation-outcome surprise。',
    options: [
      { id: 'a', label: '目标给定后的 technical-action surprise 候选', diagnosis: '正确。目标变化为零，管理条款相对条件预期意外移动；这仍不是市场控制误差的 surprise。' },
      { id: 'b', label: '25bp 的 policy-target tightening', diagnosis: '这个标签与题给的目标向量和管理利率变化不能同时对应。请先分别量化两个对象，再做分类。' },
      { id: 'c', label: 'Benchmark methodology revision', diagnosis: '你选择了统计口径变化。请核对题设究竟改变了成交样本／算法，还是实施条款中的某个价格分量。' },
    ],
    correct: 'a',
    calculation: 'Δtarget=0bp；E₋[Δadministered rate | Δtarget=0]=0bp；实际 Δadministered rate=3.65−3.70=−5bp，所以 technical-action surprise=−5bp。题目没有 i_eff，implementation-outcome surprise 不可计算。',
    reveal: '三层对象不能互换：target-vector surprise 描述立场；technical-action surprise 描述给定目标后条款相对条件预期的移动；implementation-outcome surprise 描述有效率控制误差相对预期的移动。只有第三层再排除资金需求、抵押品与测量变化，才可能命名结构性实施冲击。',
    revisit: '回看 03「Decision Compiler」、38「Control Error」、43「Communication」与 57–58「Shock / Research Design」。',
    sourceIds: [4, 9],
    staticSourceIds: [4],
    staticTwin: {
      title: '变式 10 · 目标与实施向量同步移动',
      prompt: 'SYNTHETIC：市场此前预期目标不变；但其制度条件预期是，若目标意外移动，准备金报酬、repo 与 reverse-repo 条款会与目标等幅移动。实际目标及三项配套条款全部上调 25bp，公告明确宏观立场改变，目标—有效率 spread 预期不变。主要分类是什么？',
      calculations: ['目标 ΔT=+25bp，而 E₋ΔT=0。', '给定实际 ΔT=+25bp，配套管理条款的条件预期也是 +25bp；实际同步移动，所以 technical-action surprise=0。', '目标—有效率 spread 的预期变化是 0bp；题目没有给 i_eff，因此不能声称实际 spread 或 implementation-outcome surprise 等于零。', '四项 +25bp 不是可以相加的 100bp 冲击。'],
      answer: '主要是 policy-decision surprise；给定目标已经上调 25bp，配套条款的条件预期也上调 25bp，所以 technical-action surprise 为 0，不应把每个工具变化重复计数。只能断言预期 spread 变化为 0；未观察 i_eff 时，实际实施结果仍不可识别。',
      numericAssertions: [
        { key: 'expectedTargetDeltaBp', expected: 0, unit: 'basisPoint' },
        { key: 'targetDeltaBp', expected: 25, unit: 'basisPoint' },
        { key: 'conditionalExpectedAdministeredRateDeltaBp', expected: 25, unit: 'basisPoint' },
        { key: 'administeredRateDeltaBp', expected: 25, unit: 'basisPoint' },
        { key: 'technicalActionSurpriseBp', expected: 0, unit: 'basisPoint' },
        { key: 'expectedImplementationSpreadDeltaBp', expected: 0, unit: 'basisPoint' },
        { key: 'classification', expected: 'policyDecision', unit: 'category' },
      ],
    },
    numericAssertions: [
      { key: 'targetDeltaBp', expected: 0, unit: 'basisPoint' },
      { key: 'expectedAdministeredRateDeltaBp', expected: 0, unit: 'basisPoint' },
      { key: 'administeredRateDeltaBp', expected: -5, unit: 'basisPoint' },
      { key: 'technicalActionSurpriseBp', expected: -5, unit: 'basisPoint' },
      { key: 'implementationOutcomeIdentified', expected: false, unit: 'boolean' },
      { key: 'classification', expected: 'technicalActionCandidate', unit: 'category' },
    ],
  },
];
