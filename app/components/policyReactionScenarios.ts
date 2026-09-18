export type PolicyReactionMode = 'measurement' | 'mechanism';
export type PolicyReactionChoice = 'a' | 'b' | 'c';

export type PolicyReactionAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type PolicyReactionScenario = {
  id: string;
  mode: PolicyReactionMode;
  label: string;
  title: string;
  brief: string;
  synthetic: boolean;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: PolicyReactionChoice; label: string; diagnosis: string }[];
  correct: PolicyReactionChoice;
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
    numericAssertions: PolicyReactionAssertion[];
  };
  numericAssertions: PolicyReactionAssertion[];
};

export const policyReactionModes: { id: PolicyReactionMode; label: string; title: string; description: string }[] = [
  {
    id: 'measurement',
    label: 'MODE A',
    title: '先把制度、对象与时钟量对',
    description: '校准四层政策架构、目标对象、实时 vintage、委员会聚合和跨央行发布时钟。',
  },
  {
    id: 'mechanism',
    label: 'MODE B',
    title: '再把状态映射成条件路径',
    description: '复算 Taylor 基准、Brainard 收缩、冲击权衡、ELB 路径和机械公告意外。',
  },
];

export const policyReactionScenarios: PolicyReactionScenario[] = [
  {
    id: 'M1',
    mode: 'measurement',
    label: '测量实验 01 · Institutional Layers',
    title: 'Mandate、Strategy、Decision 与 Implementation 应怎样分层？',
    brief: '本题使用稳定制度文件与有日期的决定文件；实施层只建立到 3.06 的接口。',
    synthetic: false,
    facts: [
      { label: 'Legal mandate', value: '法律／条约授权', note: '规定目标、权力与问责' },
      { label: 'Strategy / decision', value: '框架解释／时点选择', note: '长期映射与一次会议不是同一层' },
      { label: 'Implementation', value: '操作框架', note: '准备金、走廊与交易执行归 3.06' },
    ],
    formulas: ['policyArchitecture = legalMandate → strategy → datedDecision → implementation'],
    formulaUnits: '四个制度层；层之间不是可互换单位。',
    options: [
      { id: 'a', label: '四类文本都是同一政策目标的不同表述', diagnosis: '把法律授权、解释战略、时点决定和执行手段错误地视为同义对象。' },
      { id: 'b', label: '依次记录为授权、战略、决定和实施四层', diagnosis: '正确。前三层构成 3.05 的制度—反应—决定主线，实施细节只接向 3.06。' },
      { id: 'c', label: '最新会议决定会取代法律授权与既有战略', diagnosis: '时点决定不能自行改写法定授权，也不应被当作完整战略。' },
    ],
    correct: 'b',
    calculation: '稳定制度来源 4 份；有日期的决定来源 2 份；mandate ≠ strategy，strategy ≠ decision，decision ≠ implementation。',
    reveal: '授权回答“被要求追求什么”；战略回答“怎样解释授权”；会议决定回答“在这次信息集下做什么”；实施回答“怎样进入准备金、操作和结算”。边界：3.05 可以说明为什么选择某工具或路径，但操作走廊与交易执行属于 3.06。',
    revisit: '回看 02「Institutional Layers」、03「Legal Mandate」与 18「Objective / Indicator / Instrument」。',
    sourceIds: [1, 2, 9, 10, 25, 30],
    staticSourceIds: [1, 2, 9, 10],
    staticTwin: {
      title: '变式 01 · Fed 与 BoE 的四层架构',
      prompt: '比较 Fed 与 BoE：法律文本、长期战略或年度 remit、会议决定、执行操作应如何分层？',
      calculations: ['两个机构均保持四层结构。', '稳定制度文件不因一次会议决定而失效。', '执行操作不计入 3.05 的正文机制。'],
      answer: '两者都应按 legal mandate → strategy/remit → dated decision → implementation 分层；最后一层只作 3.06 接口。',
      numericAssertions: [
        { key: 'institutionCount', expected: 2, unit: 'count' },
        { key: 'layerCount', expected: 4, unit: 'count' },
        { key: 'implementationOwnedBy305', expected: false, unit: 'boolean' },
      ],
    },
    numericAssertions: [
      { key: 'layerCount', expected: 4, unit: 'count' },
      { key: 'staticSourceCount', expected: 4, unit: 'count' },
      { key: 'decisionSourceCount', expected: 2, unit: 'count' },
    ],
  },
  {
    id: 'M2',
    mode: 'measurement',
    label: '测量实验 02 · Target Object',
    title: '目标指数与政策期限怎样同时对齐？',
    brief: '以下全部是合成教学值，不是当前观测。目标对象为 PCE 通胀，政策关心其预测回归路径。',
    synthetic: true,
    facts: [
      { label: 'Target', value: 'PCE · 2.0%', note: '冻结同一目标对象' },
      { label: 'PCE state', value: 'current 2.7% · 1y forecast 2.3%', note: '年化率；当前与未来一年分列' },
      { label: 'Other index', value: 'current CPI 3.2%', note: '补充信息，不是 PCE 目标缺口' },
    ],
    formulas: ['sameObjectGapₕ = forecast(targetIndex,h) − target(targetIndex)', 'currentGap = current(targetIndex) − target(targetIndex)'],
    formulaUnits: '通胀率为 %/year；差值为 percentage points。',
    options: [
      { id: 'a', label: '用 CPI 3.2% 减 PCE 目标 2.0%，偏离为 1.2pp', diagnosis: '算术成立，但混合不同价格指数，不能作为目标偏离的主诊断。' },
      { id: 'b', label: '只看当前 PCE 偏离 0.7pp，预测期没有意义', diagnosis: '忽略了前瞻决策所对应的政策期限。' },
      { id: 'c', label: '当前同指数偏离 0.7pp，未来一年同指数偏离 0.3pp', diagnosis: '正确。目标指数和政策期限都被明确保存。' },
    ],
    correct: 'c',
    calculation: '当前 PCE gap = 2.7−2.0=0.7pp；未来一年 PCE forecast gap = 2.3−2.0=0.3pp；CPI−PCE=0.5pp，但后者不是目标缺口。',
    reveal: '目标偏离必须先冻结价格指数，再冻结当前、未来一年或中期等期限。换指数或换期限会改变 estimand，不只是换一个数据点。所有数值均为合成教学值，也不能由较高的非目标指数自动推出更强行动。',
    revisit: '回看 08「Price-stability Objective」、13「Target Index」、16「Policy Horizon」与 21「Inflation State」。',
    sourceIds: [2, 47, 52],
    staticSourceIds: [5, 7, 47, 52],
    staticTwin: {
      title: '变式 02 · HICP 与国内 CPI 不可混用',
      prompt: '合成 ECB 式案例：HICP 目标 2.0%，未来一年 HICP 预测 2.4%，某国 CPI 3.1%。有效预测缺口是多少？',
      calculations: ['同对象预测缺口 = 2.4−2.0=0.4pp。', '3.1−2.0=1.1pp 混合国内 CPI 与 HICP 目标，不能作为目标缺口。'],
      answer: '0.4pp；国内 CPI 只能作为补充信息。',
      numericAssertions: [
        { key: 'hicpForecastGap', expected: 0.4, unit: 'percentagePoint', tolerance: 1e-12 },
        { key: 'nationalCpiIsTargetIndex', expected: false, unit: 'boolean' },
      ],
    },
    numericAssertions: [
      { key: 'currentPceGap', expected: 0.7, unit: 'percentagePoint', tolerance: 1e-12 },
      { key: 'forwardPceGap', expected: 0.3, unit: 'percentagePoint', tolerance: 1e-12 },
      { key: 'cpiMinusPce', expected: 0.5, unit: 'percentagePoint', tolerance: 1e-12 },
    ],
  },
  {
    id: 'M3',
    mode: 'measurement',
    label: '测量实验 03 · Real-time Vintage',
    title: '实时 output gap 与 r-star 应怎样重建？',
    brief: '同一次历史决策有两套合成数据：决策时实时版与事后最终修订版。每次计算只能使用同列 vintage。',
    synthetic: true,
    facts: [
      { label: 'Real-time', value: 'Y 100 · Y* 102 · i 4.0% · Eπ 2.5% · r* .75%', note: '决策者当时可得状态' },
      { label: 'Final', value: 'Y 101.5 · Y* 101 · i 4.0% · Eπ 2.2% · r* 1.25%', note: '事后修订，不是当时信息' },
      { label: 'Frozen formulas', value: 'x=100(Y/Y*−1) · real-rate gap=(i−Eπ)−r*', note: '百分比与百分点分开' },
    ],
    formulas: ['xᵥ = 100 × (Yᵥ/Y*ᵥ − 1)', 'realRateGapᵥ = (iᵥ − Eᵥπ) − r*ᵥ'],
    formulaUnits: 'output gap 为 percent of potential；利率差为 percentage points。',
    options: [
      { id: 'a', label: '实时 gap≈−1.961%，最终 gap≈+0.495%；实时实际利率 gap=0.75pp', diagnosis: '正确。每一列只使用同一 vintage 的产出、潜在产出、预期通胀和 r-star。' },
      { id: 'b', label: '把实时产出与最终潜在产出组合，得到约 −0.990%', diagnosis: '混合 vintage，制造了决策者当时不可能观察到的状态。' },
      { id: 'c', label: '实时产出缺口就是 100−102=−2pp', diagnosis: '遗漏除以潜在产出和显式 ×100，单位也从指数误写成百分点。' },
    ],
    correct: 'a',
    calculation: 'xᴿᵀ=100(100/102−1)=−1.960784%；xᶠⁱⁿᵃˡ=100(101.5/101−1)=0.495050%；修订=+2.455834pp。实时 real-rate gap=(4.0−2.5)−.75=.75pp；最终版=(4.0−2.2)−1.25=.55pp。',
    reveal: '反应函数审计必须重建决策时的信息集。最终修订值可评价事后状态，却不能替代实时状态解释当时为何行动；潜在产出与 r-star 本身也只是估计，不是最终真值。',
    revisit: '回看 19「Information Set / Vintage」、23「Output-gap State」、46「Neutral Rate」与 51「Regime / Lucas Critique」。',
    sourceIds: [57, 58, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76],
    staticSourceIds: [57, 58, 68, 72],
    staticTwin: {
      title: '变式 03 · 缺口方向可被修订翻转',
      prompt: '实时 Y=98、Y*=100、i=3.5%、Eπ=2.4%、r*=.6%；最终 Y=100.5、Y*=99.5、Eπ=2.1%、r*=1%。分别复算。',
      calculations: ['xᴿᵀ=−2%；xᶠⁱⁿᵃˡ≈1.005025%。', '实时实际利率 gap=(3.5−2.4)−.6=.5pp；最终=(3.5−2.1)−1=.4pp。'],
      answer: '输出状态从负 gap 修订为正 gap，但实际利率 gap 只由 .5 修订为 .4pp。',
      numericAssertions: [
        { key: 'realTimeOutputGap', expected: -2, unit: 'percentOfPotential', tolerance: 1e-12 },
        { key: 'finalOutputGap', expected: 1.00502512562814, unit: 'percentOfPotential', tolerance: 1e-12 },
        { key: 'realTimeRealRateGap', expected: 0.5, unit: 'percentagePoint', tolerance: 1e-12 },
      ],
    },
    numericAssertions: [
      { key: 'realTimeOutputGap', expected: -1.96078431372549, unit: 'percentOfPotential', tolerance: 1e-12 },
      { key: 'finalOutputGap', expected: 0.495049504950495, unit: 'percentOfPotential', tolerance: 1e-12 },
      { key: 'outputGapRevision', expected: 2.45583381867599, unit: 'percentagePoint', tolerance: 1e-12 },
      { key: 'realTimeRealRateGap', expected: 0.75, unit: 'percentagePoint', tolerance: 1e-12 },
      { key: 'finalRealRateGap', expected: 0.55, unit: 'percentagePoint', tolerance: 1e-12 },
    ],
  },
  {
    id: 'M4',
    mode: 'measurement',
    label: '测量实验 04 · Committee',
    title: '个人 projection 与正式 committee decision 怎样分开？',
    brief: '全部利率是合成教学值。个人预测、个人偏好、投票与正式决议不是同一个统计对象。',
    synthetic: true,
    facts: [
      { label: 'Individual projections', value: '3.50 · 4.00 · 4.25 · 5.00 · 6.00%', note: '合成个人分布' },
      { label: 'Formal votes', value: '4.00 · 4.00 · 4.00 · 4.00 · 4.50%', note: '合成投票' },
      { label: 'Adopted rate', value: '4.00%', note: '制度程序生成的正式行动' },
    ],
    formulas: ['meanProjection = Σprojection/n', 'decision = formally adopted committee action'],
    formulaUnits: '所有利率为 annual percent；计数无单位。',
    options: [
      { id: 'a', label: '委员会决定是个人预测均值 4.55%', diagnosis: '个人预测均值不是正式表决规则。' },
      { id: 'b', label: '决定为 4.00%；4.55% 均值和 4.25% 中位数只描述分布', diagnosis: '正确。预测、偏好、投票和正式决定被分别保存。' },
      { id: 'c', label: '委员会必须采用中位数 4.25%', diagnosis: '中位数没有自动转化为政策决定的制度含义。' },
    ],
    correct: 'b',
    calculation: '预测总和=22.75；mean=22.75/5=4.55%；median=4.25%；正式票决众数及采用结果=4.00%。',
    reveal: '委员会内部信息可通过预测、发言、偏好或投票表现，只有制度规定的决议程序生成正式行动。本题不代表任何现实委员会规则，也不能由平均预测反推出个体反应函数。',
    revisit: '回看 06「Decision Body」、52「Committee Aggregation」与 57「Policy Point / Path」。',
    sourceIds: [95, 96, 97, 98, 101],
    staticSourceIds: [95, 96, 97, 98, 101],
    staticTwin: {
      title: '变式 04 · 中位预测不等于采用利率',
      prompt: '另一合成委员会的 projections=[2,2.5,3,3.25,3.5,4,5]，votes=[3,3,3,3,3,3.5,3.5]，采用利率 3%。',
      calculations: ['预测 mean=23.25/7≈3.321429%。', '预测 median=3.25%；正式决定=3.00%。'],
      answer: '不同；预测中位数为 3.25%，正式决定为 3.00%。',
      numericAssertions: [
        { key: 'projectionMean', expected: 3.32142857142857, unit: 'annualPercentRate', tolerance: 1e-12 },
        { key: 'projectionMedian', expected: 3.25, unit: 'annualPercentRate' },
        { key: 'adoptedRate', expected: 3, unit: 'annualPercentRate' },
      ],
    },
    numericAssertions: [
      { key: 'projectionMean', expected: 4.55, unit: 'annualPercentRate', tolerance: 1e-12 },
      { key: 'projectionMedian', expected: 4.25, unit: 'annualPercentRate' },
      { key: 'adoptedRate', expected: 4, unit: 'annualPercentRate' },
    ],
  },
  {
    id: 'M5',
    mode: 'measurement',
    label: '测量实验 05 · Real-time Clock',
    title: '截至 2026-09-01，跨央行 dashboard 应怎样保存时间？',
    brief: '本题使用截至 2026-09-01 已发布的一手资料。报告日、信息 cutoff、会议日和序列观测日必须分开。',
    synthetic: false,
    facts: [
      { label: 'Fed / BoE', value: 'MPR release ≠ series cutoffs', note: 'BoE cutoff 明确 varies by series' },
      { label: 'BoJ / BoC', value: 'staged release · dated decisions', note: '不同文档在不同日期可得' },
      { label: 'RBA', value: 'cutoff 08-05 · release 08-11', note: '数据截点与发布相差 6 个日历日' },
    ],
    formulas: ['available(document,t)=1[releaseAt≤t]', 'report clock ≠ information cutoff ≠ series observation date ≠ decision clock'],
    formulaUnits: '日期保留来源时区；工作日窗口与日历日差分别计量。',
    options: [
      { id: 'a', label: '每份报告只保存发布日，并把它视为全部数据的观测日', diagnosis: '发布日、信息截点和序列观测日并不相同。' },
      { id: 'b', label: '全部换成同一时区后即可压成一个统一 cutoff', diagnosis: '时区标准化不能消除报告内部不同序列的异步信息集。' },
      { id: 'c', label: '分别保存会议、发布、信息截点和序列观测时钟', diagnosis: '正确，同时保留 BoE varies-by-series 边界和 BoJ 两阶段发布。' },
    ],
    correct: 'c',
    calculation: 'Fed 公共信息边界 12:00=720 分钟、决定发布 14:00=840；BoE market path 窗口 15 个英国工作日；BoJ 全文较 07-31 晚 3 天；RBA cutoff→release=6 个日历日。',
    reveal: '实时比较不是寻找一个整齐共同日期，而是重建每个节点真正可用的信息。每份报告内部还可能存在更早的序列截点；ECB 与 PBOC 的当前快照在正文另列，本题不把更多异质时钟压进一个评分项。',
    revisit: '回看 19「Information Set / Vintage」、53「State / Calendar / Guidance」与 63「Interfaces / Reading」。',
    sourceIds: [16, 17, 25, 26, 27, 30, 31, 32, 33, 34, 35, 36],
    staticSourceIds: [16, 17, 25, 26, 27, 30, 31, 32, 33, 34, 35, 36],
    staticTwin: {
      title: '变式 05 · 2026-08-01 的可得产品集合',
      prompt: '以各机构本地日历 2026-08-01 结束为截点，Fed MPR、BoE MPR、BoJ Statement、BoC MPR、BoJ full Outlook、RBA SMP 哪些可得？',
      calculations: ['前四项发布日不晚于 08-01。', 'BoJ full Outlook 于 08-03，RBA SMP 于 08-11，尚不可得。'],
      answer: '可得向量 [1,1,1,1,0,0]，共 4 项。',
      numericAssertions: [
        { key: 'availableProductCount', expected: 4, unit: 'count' },
        { key: 'bojFullOutlookAvailable', expected: false, unit: 'boolean' },
        { key: 'rbaSmpAvailable', expected: false, unit: 'boolean' },
      ],
    },
    numericAssertions: [
      { key: 'fedPublicInfoBoundaryMinuteEDT', expected: 720, unit: 'minuteOfLocalDay' },
      { key: 'fedDecisionReleaseMinuteEDT', expected: 840, unit: 'minuteOfLocalDay' },
      { key: 'boeMarketPathWindow', expected: 15, unit: 'businessDay' },
      { key: 'bojFullReleaseLag', expected: 3, unit: 'calendarDay' },
      { key: 'rbaCutoffToReleaseLag', expected: 6, unit: 'calendarDay' },
    ],
  },
  {
    id: 'K1',
    mode: 'mechanism',
    label: '机制实验 01 · Taylor Benchmark',
    title: '经典 Taylor 写法给出的基准利率是多少？',
    brief: '以下是合成状态。该规则只是一把透明标尺，不是央行的事实机械算法。',
    synthetic: true,
    facts: [
      { label: 'Neutral / inflation', value: 'r*=0.5% · π=3.0% · π*=2.0%', note: '利率与通胀为年率' },
      { label: 'Output gap', value: 'x=−1.0%', note: '负 gap 表示低于可持续供给' },
      { label: 'Coefficients', value: '0.5 / 0.5', note: '对通胀 gap 和产出 gap 的冻结响应' },
    ],
    formulas: ['i=r*+π+0.5(π−π*)+0.5x'],
    formulaUnits: '利率为 annual percent；gap 项贡献为 percentage points；系数无量纲。',
    options: [
      { id: 'a', label: '3.50%', diagnosis: '正确。通胀 gap 项与产出 gap 项恰好相抵。' },
      { id: 'b', label: '3.00%', diagnosis: '遗漏 r-star 或错误处理两个 gap 项。' },
      { id: 'c', label: '4.50%', diagnosis: '把负产出 gap 当成正 gap，或重复加入通胀 gap。' },
    ],
    correct: 'a',
    calculation: 'r*+π=.5+3=3.5%；0.5(π−π*)=.5pp；0.5x=−.5pp；i=3.5+.5−.5=3.5%。',
    reveal: 'Taylor rule 把状态映射为可复核 benchmark，用来显示决定相对简单系统反应的位置。实时修订、平滑、风险管理、金融约束和委员会判断都会造成合理偏离。',
    revisit: '回看 44「Reaction Function」、45「Taylor Rule」、46「Neutral Rate」与 48「Policy Inertia」。',
    sourceIds: [53, 55, 57, 59],
    staticSourceIds: [53, 55, 57, 59],
    staticTwin: {
      title: '变式 06 · 同一规则、另一组状态',
      prompt: 'r*=1.0%、π=1.5%、π*=2.0%、x=−2.0%，用同一公式计算。',
      calculations: ['i=1+1.5+.5(−.5)+.5(−2)。', 'i=2.5−.25−1=1.25%。'],
      answer: '1.25%。',
      numericAssertions: [
        { key: 'inflationGapContribution', expected: -0.25, unit: 'percentagePoint' },
        { key: 'outputGapContribution', expected: -1, unit: 'percentagePoint' },
        { key: 'benchmarkRate', expected: 1.25, unit: 'annualPercentRate' },
      ],
    },
    numericAssertions: [
      { key: 'neutralPlusInflation', expected: 3.5, unit: 'annualPercentRate' },
      { key: 'inflationGapContribution', expected: 0.5, unit: 'percentagePoint' },
      { key: 'outputGapContribution', expected: -0.5, unit: 'percentagePoint' },
      { key: 'benchmarkRate', expected: 3.5, unit: 'annualPercentRate' },
    ],
  },
  {
    id: 'K2',
    mode: 'mechanism',
    label: '机制实验 02 · Brainard',
    title: '政策作用系数不确定时，最优 normalized action 是多少？',
    brief: '合成静态二次损失模型：gap=1.2、E[b]=0.8、Var(b)=0.16。action 不是实际政策利率的百分点变化。',
    synthetic: true,
    facts: [
      { label: 'Initial gap', value: 'g=1.2 normalized gap', note: '归一化状态单位' },
      { label: 'Transmission', value: 'E[b]=.8 · Var(b)=.16', note: 'b 的单位为 gap/action' },
      { label: 'Action', value: 'normalized unit', note: '绝不可改名为 rate pp' },
    ],
    formulas: ['L(a,b)=(g−ba)²', 'E[b²]=Var(b)+E[b]²', 'a*=gE[b]/E[b²]'],
    formulaUnits: 'a 为 normalized action；Var(b) 与 E[b²] 为 (gap/action)²。',
    options: [
      { id: 'a', label: '1.50 个 normalized action 单位', diagnosis: '这是把 b 固定为 .8 的 certainty-equivalent 结果。' },
      { id: 'b', label: '0.96 个 normalized action 单位', diagnosis: '只算 gE[b]，没有除以 E[b²]。' },
      { id: 'c', label: '1.20 个 normalized action 单位', diagnosis: '正确。本题参数不确定性使行动相对 1.50 收缩。' },
    ],
    correct: 'c',
    calculation: 'E[b²]=.16+.8²=.80 (gap/action)²；a*=1.2×.8/.80=1.20；确定系数 aᶜᵉ=1.2/.8=1.50；收缩=.30 normalized action。',
    reveal: '在这个特定静态二次模型里，作用系数方差抬高 E[b²]，从而降低最优行动。Brainard 式收缩不是普遍定理；动态持续性、尾部风险或做错方向的代价可让稳健行动更强。',
    revisit: '回看 37「Brainard Attenuation」、38「Robust Risk Management」与 40「Model Uncertainty」。',
    sourceIds: [39, 78],
    staticSourceIds: [39, 78],
    staticTwin: {
      title: '变式 07 · 更大的相对传导方差',
      prompt: 'gap=1、E[b]=.5、Var(b)=.25。分别求不确定性与确定系数行动。',
      calculations: ['E[b²]=.25+.5²=.50。', 'a*=1×.5/.5=1；确定系数行动=1/.5=2。'],
      answer: '不确定性下为 1 个 normalized action，较确定系数结果收缩 1 单位。',
      numericAssertions: [
        { key: 'expectedBSquared', expected: 0.5, unit: 'squaredGapPerSquaredAction' },
        { key: 'uncertainOptimalAction', expected: 1, unit: 'normalizedAction' },
        { key: 'certaintyEquivalentAction', expected: 2, unit: 'normalizedAction' },
      ],
    },
    numericAssertions: [
      { key: 'expectedBSquared', expected: 0.8, unit: 'squaredGapPerSquaredAction' },
      { key: 'uncertainOptimalAction', expected: 1.2, unit: 'normalizedAction' },
      { key: 'certaintyEquivalentAction', expected: 1.5, unit: 'normalizedAction' },
      { key: 'attenuation', expected: 0.3, unit: 'normalizedAction' },
    ],
  },
  {
    id: 'K3',
    mode: 'mechanism',
    label: '机制实验 03 · Stabilization Trade-off',
    title: '相同通胀 gap 下，需求与供给状态为何给出不同紧缩结论？',
    brief: '合成 transition：紧缩令 inflation gap 下降 .4、signed output gap 下降 .5；初始 inflation gap=.8，λ=.5。',
    synthetic: true,
    facts: [
      { label: 'Demand state', value: 'gπ=.8 · x=+2.0', note: '通胀与活动同向偏强' },
      { label: 'Supply state', value: 'gπ=.8 · x=−1.0', note: '通胀高但活动偏弱' },
      { label: 'Tightening map', value: 'Δgπ=−.4 · Δx=−.5', note: 'signed gap 继续下降' },
    ],
    formulas: ['L=.5(gπ²+λx²)', 'newGap=oldGap+signedΔgap'],
    formulaUnits: 'L 为 normalized gap²；λ 是 relative loss weight，不是概率。',
    options: [
      { id: 'a', label: '相同通胀 gap 意味着两个状态都应紧缩', diagnosis: '忽略供给状态中通胀与活动目标的冲突。' },
      { id: 'b', label: '紧缩改善需求状态，却在供给状态中略微提高损失', diagnosis: '正确。负的 signed output gap 再下降，意味着负 gap 绝对值扩大。' },
      { id: 'c', label: 'λ=.5 表示供给状态出现概率为 50%', diagnosis: 'λ 是相对损失权重，不是概率。' },
    ],
    correct: 'b',
    calculation: '需求 hold L=.5(.8²+.5×2²)=1.32；tight 后 (.4,1.5) 得 .6425。供给 hold=.5(.8²+.5×(−1)²)=.57；tight 后 (.4,−1.5) 得 .6425。变化分别 −.6775 与 +.0725。',
    reveal: '紧缩使 signed x 下降：对正 gap 是降温，对已为负的 gap 则是衰退缺口扩大。transition 全为合成映射；不同归一化或 λ 下的 loss 水平不可横向比较。',
    revisit: '回看 32「Demand Shock」、33「Supply Shock」、35「Divine Coincidence Break」与 43「Distribution / Sector Boundary」。',
    sourceIds: [47, 52, 112],
    staticSourceIds: [47, 52, 112],
    staticTwin: {
      title: '变式 08 · λ 改变后的状态依赖',
      prompt: 'gπ=.75，需求 x=1.5、供给 x=−.5；Δgπ=−.3、Δx=−.4、λ=1。',
      calculations: ['需求 hold=1.40625，tight=.70625。', '供给 hold=.40625，tight=.50625。'],
      answer: '紧缩使需求状态损失下降 .7，却使供给状态损失增加 .1。',
      numericAssertions: [
        { key: 'demandHoldLoss', expected: 1.40625, unit: 'normalizedGapSquaredLoss' },
        { key: 'demandTightenLoss', expected: 0.70625, unit: 'normalizedGapSquaredLoss' },
        { key: 'supplyHoldLoss', expected: 0.40625, unit: 'normalizedGapSquaredLoss' },
        { key: 'supplyTightenLoss', expected: 0.50625, unit: 'normalizedGapSquaredLoss' },
      ],
    },
    numericAssertions: [
      { key: 'demandHoldLoss', expected: 1.32, unit: 'normalizedGapSquaredLoss' },
      { key: 'demandTightenLoss', expected: 0.6425, unit: 'normalizedGapSquaredLoss' },
      { key: 'supplyHoldLoss', expected: 0.57, unit: 'normalizedGapSquaredLoss' },
      { key: 'supplyTightenLoss', expected: 0.6425, unit: 'normalizedGapSquaredLoss' },
      { key: 'supplyLossChange', expected: 0.0725, unit: 'normalizedGapSquaredLoss' },
    ],
  },
  {
    id: 'K4',
    mode: 'mechanism',
    label: '机制实验 04 · ELB Path',
    title: '当前利率受下限约束时，未来路径承诺怎样进入金融条件？',
    brief: '合成两期加权路径统计量 P=i₀+wE₀i₁。它不是收益率、现值，也不是跨工具统一等价单位。',
    synthetic: true,
    facts: [
      { label: 'Current constraint', value: 'desired −.5% · ELB/actual 0%', note: '约束为 50bp' },
      { label: 'Future rate', value: 'without 1.5% · with commitment .5%', note: '可信承诺改变 E₀i₁' },
      { label: 'Weight', value: 'w=.5', note: '教学用无量纲权重' },
    ],
    formulas: ['P₀=i₀+wE₀[i₁]'],
    formulaUnits: 'P 是 two-period weighted-path point，不是某期限收益率。',
    options: [
      { id: 'a', label: 'P 由 .75 降至 .25；承诺通过预期未来利率起作用', diagnosis: '正确。当前利率仍在 ELB，但预期路径变化。' },
      { id: 'b', label: '直接把当前利率设为 −.5%，所以承诺没有作用', diagnosis: '违反题目冻结的 ELB 约束。' },
      { id: 'c', label: 'P 下降 .50 等同于任何期限利率都下降 50bp', diagnosis: 'P 只是教学加权统计量，不能跨期限等价换算。' },
    ],
    correct: 'a',
    calculation: 'ELB constraint=0−(−.5)=.5pp=50bp；Pⁿᵒ=0+.5×1.5=.75；Pᶜᵒᵐᵐⁱᵗ=0+.5×.5=.25；ΔP=−.50 weighted-path point。',
    reveal: '当前工具受下限约束时，政策仍可借预期未来短端路径影响金融条件。可信度必须另行识别；P 不是实际政策立场，也不是 QE 与 guidance 的统一换算率。',
    revisit: '回看 41「Nonlinearity / ELB」、56「Instrument Menu」、57「Policy Point / Path」与 58「Commitment」。',
    sourceIds: [41, 43, 80, 83, 86, 87],
    staticSourceIds: [41, 43, 80, 83, 86, 87],
    staticTwin: {
      title: '变式 09 · 负利率下限与另一条路径',
      prompt: 'ELB/actual=−.25%、desired=−1%、w=.4，未来率由 1.25% 降至 .25%。',
      calculations: ['约束=−.25−(−1)=.75pp=75bp。', 'Pⁿᵒ=−.25+.4×1.25=.25；Pᶜᵒᵐᵐⁱᵗ=−.25+.4×.25=−.15；变化 −.40。'],
      answer: '路径统计量由 .25 降至 −.15，变化 −.40 weighted-path point。',
      numericAssertions: [
        { key: 'elbConstraint', expected: 75, unit: 'basisPoint' },
        { key: 'pathWithoutCommitment', expected: 0.25, unit: 'weightedPathPoint' },
        { key: 'pathWithCommitment', expected: -0.15, unit: 'weightedPathPoint' },
      ],
    },
    numericAssertions: [
      { key: 'elbConstraint', expected: 50, unit: 'basisPoint' },
      { key: 'pathWithoutCommitment', expected: 0.75, unit: 'weightedPathPoint' },
      { key: 'pathWithCommitment', expected: 0.25, unit: 'weightedPathPoint' },
      { key: 'pathStatisticChange', expected: -0.5, unit: 'weightedPathPoint' },
    ],
  },
  {
    id: 'K5',
    mode: 'mechanism',
    label: '机制实验 05 · Target Surprise',
    title: '机械 target surprise、rule residual 与 path repricing 怎样分开？',
    brief: '合成事件：同一目标利率对象按 actual−expected 计算。另一期限／事件窗的路径变化必须单列。',
    synthetic: true,
    facts: [
      { label: 'Pre-announcement', value: 'current 4.00% · P(4.25)=.6 · P(4.00)=.4', note: '同一目标对象的当前点位与事前分布' },
      { label: 'Actual / benchmark', value: '4.25% / 4.25%', note: '实际点位与系统反应基准相同' },
      { label: 'Separate path', value: '+20bp', note: '不同期限／事件窗，不可相加' },
    ],
    formulas: ['E[target]=Σpⱼtargetⱼ', 'targetSurprise=actual−expected', 'ruleResidual=actual−systematicBenchmark'],
    formulaUnits: '目标利率为 %/year；差值换成 basis points；不同期限的 bp 仍不是同一 estimand。',
    options: [
      { id: 'a', label: 'surprise 为 +25bp，因为目标从 4.00 升至 4.25%', diagnosis: '这是原始目标变动，不是相对事前分布的 surprise。' },
      { id: 'b', label: '结构 shock 为 +30bp，即 10bp target surprise 加 20bp path', diagnosis: '不同期限和事件窗不能相加，机械 surprise 也不能自动命名为结构 shock。' },
      { id: 'c', label: '机械 target surprise=+10bp，rule residual=0；path 变化单列', diagnosis: '正确。符号冻结为 actual−expected，三个对象分别记录。' },
    ],
    correct: 'c',
    calculation: 'E[target]=.6×4.25+.4×4=4.15%；mechanical surprise=4.25−4.15=.10pp=+10bp；raw change=+25bp；rule residual=4.25−4.25=0；+20bp path repricing 不相加。',
    reveal: '市场预期 surprise、相对系统反应的残差和曲线路径重定价是三个不同测量对象。若要命名结构政策 shock，还须处理央行信息效应、同步新闻、事件窗污染与反应内生性。',
    revisit: '回看 51「Regime / Lucas Critique」、54「Systematic / Surprise」与 55「Target / Path / Information」。',
    sourceIds: [64, 65, 66, 94],
    staticSourceIds: [64, 65, 66, 94],
    staticTwin: {
      title: '变式 10 · 降息预期未兑现',
      prompt: 'current=3%，P(3.25)=.3、P(3.00)=.7，actual=benchmark=3%，另有 −15bp path repricing。',
      calculations: ['E[target]=.3×3.25+.7×3=3.075%。', 'surprise=3−3.075=−.075pp=−7.5bp；raw change=0；rule residual=0。'],
      answer: '机械 target surprise 为 −7.5bp；不能与 −15bp path 变化相加或自动称为结构 shock。',
      numericAssertions: [
        { key: 'expectedTarget', expected: 3.075, unit: 'annualPercentRate' },
        { key: 'mechanicalTargetSurprise', expected: -7.5, unit: 'basisPoint' },
        { key: 'ruleResidual', expected: 0, unit: 'basisPoint' },
      ],
    },
    numericAssertions: [
      { key: 'expectedTarget', expected: 4.15, unit: 'annualPercentRate' },
      { key: 'mechanicalTargetSurprise', expected: 10, unit: 'basisPoint' },
      { key: 'rawTargetChange', expected: 25, unit: 'basisPoint' },
      { key: 'ruleResidual', expected: 0, unit: 'basisPoint' },
      { key: 'targetAndPathAreAdditive', expected: false, unit: 'boolean' },
    ],
  },
];
