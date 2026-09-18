export type ExpectationsMode = 'measurement' | 'mechanism';
export type ExpectationsChoice = 'a' | 'b' | 'c';

export type ExpectationsAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type ExpectationsScenario = {
  id: string;
  mode: ExpectationsMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: ExpectationsChoice; label: string; diagnosis: string }[];
  correct: ExpectationsChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
  numericAssertions: ExpectationsAssertion[];
};

export const expectationsModes: { id: ExpectationsMode; label: string; title: string; description: string }[] = [
  {
    id: 'measurement',
    label: 'MODE A',
    title: '先把预期对象量对',
    description: '校准期限窗口、个体不确定性、预测 vintage、市场补偿与三维锚定。',
  },
  {
    id: 'mechanism',
    label: 'MODE B',
    title: '再把更新接到行为和资产',
    description: '复算 Bayesian、sticky information、事前实际率、反馈稳定性与实时新闻分解。',
  },
];

export const inflationExpectationsScenarios: ExpectationsScenario[] = [
  {
    id: 'sce-forward-one-year-horizon',
    mode: 'measurement',
    label: '测量实验 01 · Horizon',
    title: '纽约联储 SCE 的 “three-year ahead” 究竟覆盖哪十二个月？',
    brief: '预测起点冻结为 2026-06，并严格使用纽约联储 SCE 问卷定义。这里不把其他调查的同名期限强行套用到 SCE。',
    facts: [
      { label: 'One-year ahead', value: '2026-06 → 2027-06', note: '未来十二个月价格变化' },
      { label: 'Three-year ahead', value: '2028-06 → 2029-06', note: '未来第 2 至第 3 年的一年窗口' },
      { label: 'Five-year ahead', value: '2030-06 → 2031-06', note: '未来第 4 至第 5 年的一年窗口' },
    ],
    options: [
      { id: 'a', label: 'Three-year 是 2026-06 至 2029-06 的三年累计价格涨幅', diagnosis: '把 forward one-year window 误读成从今天起算的累计窗口。' },
      { id: 'b', label: 'Three-year 是未来第 2 年至第 3 年的一年期变化；five-year 以同样方式后移', diagnosis: '正确。名称指向远期一年窗口，而不是累计三年或五年。' },
      { id: 'c', label: 'Three-year 是未来前三年价格变化的平均年化率', diagnosis: '把 forward one-year 改成了多年平均；这是另一个 estimand。' },
    ],
    correct: 'b',
    calculation: '以作答月为 0：three-year 的 startOffset=24 个月、endOffset=36 个月，因此 window=12 个月；five-year 对应 48→60 个月。',
    reveal: '同名“三年预期”在不同调查里可能指累计变化、日历年、未来三年平均或远期一年。没有问卷原文和 forecast origin，期限就没有被定义。',
    revisit: '回看 03「Horizon / Window」、08「Information Set / Vintage」与 09「Household Surveys」。',
    sourceIds: [5, 6, 7, 73],
    staticSourceIds: [6, 7],
    staticTwin: {
      title: '变式 01 · 起点改变、窗口定义不变',
      prompt: '若 SCE 作答月为 2027-01，three-year ahead 覆盖哪段时间？它是否是三年累计？',
      answer: '覆盖 2029-01→2030-01，即作答日起第 24 至 36 个月的一年窗口；不是三年累计，也不是前三年平均。',
    },
    numericAssertions: [
      { key: 'threeYearStartMonths', expected: 24, unit: 'months' },
      { key: 'threeYearEndMonths', expected: 36, unit: 'months' },
      { key: 'threeYearWindowMonths', expected: 12, unit: 'months' },
      { key: 'isCumulative', expected: false, unit: 'boolean' },
    ],
  },
  {
    id: 'uncertainty-disagreement-mixture',
    mode: 'measurement',
    label: '测量实验 02 · Density',
    title: '两个人意见不同与每个人自己不确定，为什么必须分开计算？',
    brief: 'A 与 B 对同一指数、同一期限作答且等权。A 的主观均值为 3%、标准差为 1pp；B 的均值为 5%、标准差为 3pp。',
    facts: [
      { label: 'Respondent A', value: 'mean 3% · SD 1pp', note: '个体方差 1pp²' },
      { label: 'Respondent B', value: 'mean 5% · SD 3pp', note: '个体方差 9pp²' },
      { label: 'Weights', value: '50% / 50%', note: '共同对象与期限' },
    ],
    options: [
      { id: 'a', label: '个体不确定性就是两人均值之差 2pp', diagnosis: '两人中心位置的差异属于横截面 disagreement，不是任何一个人的密度宽度。' },
      { id: 'b', label: '混合分布方差为 5pp²，因为只需平均两人的个体方差', diagnosis: '遗漏了个体均值围绕聚合均值的分歧方差。' },
      { id: 'c', label: '均值 4%；平均个体方差 5pp²；分歧方差 1pp²；总方差 6pp²，SD≈2.44949pp', diagnosis: '正确。全方差把 within-person uncertainty 与 between-person disagreement 相加。' },
    ],
    correct: 'c',
    calculation: '① m̄=(3+5)/2=4%。② E[vᵢ]=(1²+3²)/2=5pp²。③ Var(mᵢ)=((3−4)²+(5−4)²)/2=1pp²。④ 总方差=6pp²，SD=√6≈2.44949pp。',
    reveal: '平均个体标准差是 2pp，但全方差公式平均的是方差而不是标准差。只有对象、期限和权重一致，两个分量才有共同含义。',
    revisit: '回看 06「Point / Density」、07「Uncertainty / Disagreement」、34「Aggregation」与 38「Tail / Density Anchoring」。',
    sourceIds: [73, 75, 77, 79],
    staticSourceIds: [75, 77],
    staticTwin: {
      title: '变式 02 · 同时缩窄个体密度',
      prompt: '两人均值为 2% 与 4%，个体 SD 为 0.5pp 与 1.5pp，等权。求聚合均值、within variance、disagreement variance、总方差与总 SD。',
      answer: '均值 3%；within variance=(0.5²+1.5²)/2=1.25pp²；disagreement variance=1pp²；总方差 2.25pp²；总 SD=1.5pp。',
    },
    numericAssertions: [
      { key: 'mean', expected: 4, unit: '%' },
      { key: 'withinVariance', expected: 5, unit: 'pp²' },
      { key: 'disagreementVariance', expected: 1, unit: 'pp²' },
      { key: 'totalVariance', expected: 6, unit: 'pp²' },
      { key: 'totalSd', expected: 2.449489743, unit: 'pp', tolerance: 1e-9 },
    ],
  },
  {
    id: 'forecast-revision-error-vintage',
    mode: 'measurement',
    label: '测量实验 03 · Vintage',
    title: '同一个 forecast target 下，revision 与 real-time error 分别是什么？',
    brief: '预测对象固定为同一日历年 CPI。1 月预测 2.4%，4 月预测 2.9%；该年 CPI 首次公布为 3.1%，后来修订为 3.0%。',
    facts: [
      { label: 'January forecast', value: '2.4%', note: '旧预测 origin' },
      { label: 'April forecast', value: '2.9%', note: '同一 target 的新预测' },
      { label: 'Realization', value: 'first 3.1% · revised 3.0%', note: '两种数据 vintage' },
    ],
    options: [
      { id: 'a', label: 'Revision=+0.5pp；实时 error=+0.2pp；修订后 error=+0.1pp，实时识别保留 +0.2pp', diagnosis: '正确。预测修正比较两次预测，预测误差比较当时预测与随后首次可得实现值。' },
      { id: 'b', label: '实时 error=+0.1pp，因为修订值比初值更准确', diagnosis: '把研究时点之后的实现值修订回填进当时的信息集，制造 look-ahead。' },
      { id: 'c', label: 'Revision=−0.5pp，error=−0.2pp', diagnosis: '把“新减旧”和“实现减预测”的两个冻结符号同时反转。' },
    ],
    correct: 'a',
    calculation: 'Revision=2.9−2.4=+0.5pp；real-time FE=3.1−2.9=+0.2pp；revised FE=3.0−2.9=+0.1pp。',
    reveal: '研究必须同时保存 target、forecast origin、问卷截止、首次发布与后续修订。事后更干净的数据不能替代参与者当时能看到的数据。',
    revisit: '回看 08「Information Set / Vintage」、17「Error / Revision」、20「Joint Hypothesis」与 59「Real-time Identification」。',
    sourceIds: [35, 37, 70, 71],
    staticSourceIds: [37, 70],
    staticTwin: {
      title: '变式 03 · 负的实时预测误差',
      prompt: '同一 target 的预测由 1.8% 修至 2.2%，首次实现 2.0%，后修为 2.1%。分别求 revision、实时 error 与修订后 error。',
      answer: 'Revision=+0.4pp；实时 error=2.0−2.2=−0.2pp；修订后 error=2.1−2.2=−0.1pp。',
    },
    numericAssertions: [
      { key: 'revision', expected: 0.5, unit: 'pp' },
      { key: 'realTimeError', expected: 0.2, unit: 'pp' },
      { key: 'revisedError', expected: 0.1, unit: 'pp' },
    ],
  },
  {
    id: 'breakeven-risk-liquidity',
    mode: 'measurement',
    label: '测量实验 04 · Compensation',
    title: 'Nominal–TIPS spread 为什么不能直接改名为市场“纯预期通胀”？',
    brief: '期限和现金流约定已匹配。名义收益率 4.60%，TIPS 实际收益率 1.70%，通胀风险溢价 IRP=+0.40pp，正的 TIPS 流动性溢价 LP=+0.15pp，其他楔子为 0；冻结 BE=Eᴾπ+IRP−LP。',
    facts: [
      { label: 'Nominal yield', value: '4.60%', note: '同期限名义债' },
      { label: 'TIPS real yield', value: '1.70%', note: '同期限通胀保值债' },
      { label: 'Pricing wedges', value: 'IRP +0.40pp · LP +0.15pp', note: '正 LP 抬高 TIPS yield、压低 BE' },
    ],
    options: [
      { id: 'a', label: '物理测度下预期通胀就是 2.90%', diagnosis: '2.90% 是原始 breakeven compensation，尚未剥离风险和流动性楔子。' },
      { id: 'b', label: 'BE=2.90%；在冻结模型中 Eᴾπ=2.65%', diagnosis: '正确：Eᴾπ=BE−IRP+LP=2.90−0.40+0.15=2.65%。' },
      { id: 'c', label: 'Eᴾπ=2.35%，因为还应再扣除 TIPS liquidity premium', diagnosis: '符号错误。题设正 LP 已经压低 observed BE，反推物理预期时应加回。' },
    ],
    correct: 'b',
    calculation: '① BE=4.60−1.70=2.90%。② Eᴾπ=2.90−0.40+0.15=2.65%。收益率水准以 %/year 表示，变动通常以 bp 表示。',
    reveal: '不同模型可能为 liquidity wedge 采用相反命名或符号，所以数据契约必须冻结等式；市场价格还可能包含税务、指数化滞后、seasonality 与供需楔子。',
    revisit: '回看 13「Market Instruments」、14「Compensation / P vs Q」、15「Model Extraction」与 58「Asset-news Decomposition」。',
    sourceIds: [46, 47, 48, 49, 60],
    staticSourceIds: [48, 49, 60],
    staticTwin: {
      title: '变式 04 · 风险与流动性反向修正',
      prompt: '名义 3.90%、TIPS 1.40%、IRP=+0.30pp、LP=+0.10pp，其他为 0。按同一符号求 BE 与 Eᴾπ。',
      answer: 'BE=2.50%；Eᴾπ=2.50−0.30+0.10=2.30%。',
    },
    numericAssertions: [
      { key: 'breakeven', expected: 2.9, unit: '%' },
      { key: 'expectedInflation', expected: 2.65, unit: '%', tolerance: 1e-12 },
    ],
  },
  {
    id: 'anchor-level-tail-shock',
    mode: 'measurement',
    label: '测量实验 05 · Anchoring',
    title: '长期均值仍在 2% 附近，为什么不能直接宣布预期“完全锚定”？',
    brief: '目标为 2%。长期均值由 2.0% 升至 2.1%；Pr(π>4%) 由 5% 升至 14%；IQR 由 0.8pp 升至 1.6pp；一次 +1pp 短期 surprise 后长期均值升 0.1pp。',
    facts: [
      { label: 'Long-run mean', value: '2.0% → 2.1%', note: '距目标 0.1pp' },
      { label: 'Tail / dispersion', value: 'P(π>4%) 5%→14% · IQR .8→1.6pp', note: '分布形状改变' },
      { label: 'News sensitivity', value: '+1pp surprise → +0.1pp long mean', note: '事件 beta=.10' },
    ],
    options: [
      { id: 'a', label: '均值仍接近 2%，所以预期在所有维度完全锚定', diagnosis: '只看 level，遗漏尾部、分散度和长期预期对短期新闻的敏感性。' },
      { id: 'b', label: '尾部上升，所以所有锚定维度都已经永久失效', diagnosis: '把连续、多维且需重复观测的状态强行二元化。' },
      { id: 'c', label: 'Level 仍接近目标，但 higher-moment 与 shock anchoring 变弱；还需更多实时事件判断持续性', diagnosis: '正确。锚定至少要分别检查水平、分布尾部和新闻映射。' },
    ],
    correct: 'c',
    calculation: '目标距离=2.1−2.0=0.1pp；尾部概率增加 14−5=9 percentage points；IQR 增加 0.8pp；β=0.1pp/1pp=0.10。',
    reveal: 'Disagreement 变大也不自动等于制度去锚，可能只是信息异质性上升。去锚判断需要共同对象、期限、vintage 与多次新闻反应。',
    revisit: '回看 35「Anchoring as Mapping」、37「News-sensitivity」、38「Tail / Density」与 39「Disagreement ≠ De-anchoring」。',
    sourceIds: [54, 75, 98, 99, 107, 108],
    staticSourceIds: [98, 99, 107],
    staticTwin: {
      title: '变式 05 · 均值与单次 beta 稳定，尾部仍变弱',
      prompt: '长期均值稳定在 2.2%，P(π>4%) 由 4% 升至 12%，IQR 由 .6 升至 1.4pp；本次事件 β=0。如何判断？',
      answer: 'Level 与该次 news sensitivity 没有恶化证据，但 higher-moment anchoring 明显变弱；单次零响应不能证明完全锚定。',
    },
    numericAssertions: [
      { key: 'levelDistance', expected: 0.1, unit: 'pp' },
      { key: 'tailChange', expected: 9, unit: 'percentage points' },
      { key: 'iqrChange', expected: 0.8, unit: 'pp' },
      { key: 'beta', expected: 0.1, unit: 'pp/pp' },
    ],
  },
  {
    id: 'bayesian-precision-update',
    mode: 'mechanism',
    label: '机制实验 01 · Bayesian Update',
    title: '信号比先验更嘈杂时，为什么 posterior 不会简单取平均？',
    brief: '正态共轭、独立误差。Prior mean=2%，prior variance=1pp²；signal=4%，signal-noise variance=3pp²。',
    facts: [
      { label: 'Prior', value: 'mean 2% · variance 1pp²', note: '较精确' },
      { label: 'Signal', value: '4% · noise variance 3pp²', note: '较嘈杂' },
      { label: 'Gain', value: 'K=v₀/(v₀+r)', note: '按相对精度更新' },
    ],
    options: [
      { id: 'a', label: 'K=.25；posterior mean=2.5%，variance=.75pp²，SD≈.866025pp', diagnosis: '正确。噪声较大使新信号只有 25% 权重，但仍减少 posterior uncertainty。' },
      { id: 'b', label: 'Posterior mean=3%，因为先验与信号应简单平均', diagnosis: '简单平均暗含两者精度相同，与题设方差矛盾。' },
      { id: 'c', label: 'Posterior mean=3.5%，因为信号权重应为 75%', diagnosis: '把更大的 noise variance 错读成更高的信号精度。' },
    ],
    correct: 'a',
    calculation: 'K=1/(1+3)=.25；m₁=2+.25×(4−2)=2.5%；v₁=(1−.25)×1=.75pp²；SD=√.75≈.866025pp。',
    reveal: 'Bayesian learning 不是“相信最新数字”。现实主体还可能误判精度、使用错误模型或选择不注意；该算例只隔离精度加权。',
    revisit: '回看 23「Noisy Information」、25「Bayesian Learning」与 26「Constant-gain」。',
    sourceIds: [83, 96],
    staticSourceIds: [83, 96],
    staticTwin: {
      title: '变式 06 · 更精确的新信号',
      prompt: 'Prior mean=3%、variance=4pp²；signal=1%、noise variance=1pp²。求 gain、posterior mean、variance 与 SD。',
      answer: 'K=4/(4+1)=.8；posterior mean=3+.8×(1−3)=1.4%；variance=.8pp²；SD≈.894427pp。',
    },
    numericAssertions: [
      { key: 'gain', expected: 0.25, unit: 'ratio' },
      { key: 'mean', expected: 2.5, unit: '%' },
      { key: 'variance', expected: 0.75, unit: 'pp²' },
      { key: 'sd', expected: 0.866025404, unit: 'pp', tolerance: 1e-9 },
    ],
  },
  {
    id: 'sticky-information-hazard',
    mode: 'mechanism',
    label: '机制实验 02 · Sticky Information',
    title: '每期 40% 的主体更新，为什么下一期累计更新比例是 64% 而不是 80%？',
    brief: '旧预期为 2%，当前完全信息预期为 4%；每期更新 hazard λ=40%。没有后续新信号或遗忘，已更新者保持 4%，未更新者仍为 2%。',
    facts: [
      { label: 'Old / new belief', value: '2% / 4%', note: '信念差 2pp' },
      { label: 'Update hazard', value: 'λ=40% per period', note: '只作用于尚未更新者' },
      { label: 'Signal path', value: 'unchanged after t', note: '隔离 staggered updating' },
    ],
    options: [
      { id: 'a', label: '当期均值 4%，因为所有人最终都会知道新信息', diagnosis: '把“最终”偷换成“当期”，删除了本期 60% 未更新主体。' },
      { id: 'b', label: '当期均值 2.8%，下一期仍为 2.8%', diagnosis: '忽略了第二期尚未更新者中的 40% 会新增更新。' },
      { id: 'c', label: '当期均值 2.8%；下一期累计更新 64%，均值 3.28%', diagnosis: '正确。第二期新增份额是 .6×.4=.24，而不是再从全体加 40pp。' },
    ],
    correct: 'c',
    calculation: 'shareₜ=.4；shareₜ₊₁=.4+.6×.4=.64。m̄ₜ=.4×4+.6×2=2.8%；m̄ₜ₊₁=.64×4+.36×2=3.28%。',
    reveal: '40% 是每期 conditional hazard，不是“预期上升 40pp”。Sticky information 让持续聚合迟滞来自更新时点，而 noisy information 则让所有人可持续但小幅更新。',
    revisit: '回看 22「Sticky Information」、23「Noisy Information」与 34「Aggregation」。',
    sourceIds: [64, 70, 71, 81],
    staticSourceIds: [64, 71],
    staticTwin: {
      title: '变式 07 · 25% 更新 hazard',
      prompt: '旧预期 1.5%、新预期 3.5%、λ=.25。求当期与下一期累计更新份额及均值。',
      answer: '当期更新 25%，均值 2.0%；下一期累计更新 .25+.75×.25=.4375，均值 .4375×3.5+.5625×1.5=2.375%。',
    },
    numericAssertions: [
      { key: 'updatedShareT', expected: 0.4, unit: 'ratio' },
      { key: 'updatedShareT1', expected: 0.64, unit: 'ratio' },
      { key: 'meanT', expected: 2.8, unit: '%' },
      { key: 'meanT1', expected: 3.28, unit: '%' },
    ],
  },
  {
    id: 'fisher-consumption-constraint',
    mode: 'mechanism',
    label: '机制实验 03 · Ex-ante Real Rate',
    title: '预期通胀上升压低事前实际率，为什么消费方向仍然不确定？',
    brief: '名义一年利率固定为 5%；预期通胀由 2% 升至 3.5%。家庭受借贷约束，同时预期实际可支配收入下降 4%；其余条件不作足以固定消费符号的假设。',
    facts: [
      { label: 'Nominal rate', value: '5%', note: '保持不变' },
      { label: 'Expected inflation', value: '2% → 3.5%', note: '使用简化点预测' },
      { label: 'Household constraints', value: 'credit constrained · real income −4%', note: '替代效应之外的渠道' },
    ],
    options: [
      { id: 'a', label: '预期通胀上升必然提高当前消费，因为持币等待更贵', diagnosis: '把替代效应当成唯一渠道，忽略收入、融资、财富与不确定性。' },
      { id: 'b', label: '实际率约 2.9412%→1.4493%，降约 1.4919pp；但收入与信用约束使消费净方向不确定', diagnosis: '正确。算术可以确定实际率方向，行为净效应仍需主体约束。' },
      { id: 'c', label: '名义利率不变，所以实际率与消费都不变', diagnosis: '遗漏预期通胀对事前实际回报的分母作用。' },
    ],
    correct: 'b',
    calculation: 'r₀ᵉ=1.05/1.02−1≈2.941176%；r₁ᵉ=1.05/1.035−1≈1.449275%；变化≈−1.491901pp。',
    reveal: '若通胀本身是随机变量，严格回报涉及 E[(1+π)⁻¹]，不是简单把 Eπ 放进分母；该题只使用明确标注的点预测简化。',
    revisit: '回看 46「Fisher / Ex-ante Real Rate」、47「Consumption / Durables」与 50「Mean vs Uncertainty」。',
    sourceIds: [47, 51, 57, 89, 90, 93],
    staticSourceIds: [51, 89, 93],
    staticTwin: {
      title: '变式 08 · 实际率下降仍不锁定消费',
      prompt: 'i=4%，预期通胀由 1% 升至 2.5%；实际收入预期 −3%、家庭借贷受限。求简化实际率变化并判断消费方向。',
      answer: '实际率约 2.970297%→1.463415%，下降约 1.506883pp；消费方向仍不确定，因为替代、收入与信用渠道相互竞争。',
    },
    numericAssertions: [
      { key: 'real0', expected: 2.941176471, unit: '%' },
      { key: 'real1', expected: 1.449275362, unit: '%' },
      { key: 'change', expected: -1.491901109, unit: 'pp' },
      { key: 'consumptionSign', expected: 'ambiguous', unit: 'label' },
    ],
  },
  {
    id: 'expectation-feedback-stability',
    mode: 'mechanism',
    label: '机制实验 04 · Feedback',
    title: '更新增益大于 1 时，为什么系统仍可能收敛？',
    brief: '教学局部线性系统固定为 eₜ=gπₜ₋₁、πₜ=uₜ+γeₜ。g=1.2、γ=.6；u₀=1pp，之后 u=0；初始预期贡献为 0。',
    facts: [
      { label: 'Belief gain g', value: '1.2', note: '实现值到下一期信念' },
      { label: 'Behavior pass-through γ', value: '0.6', note: '信念到实现通胀' },
      { label: 'One-time shock', value: 'u₀=1pp · uₜ>0=0', note: '冻结线性结构' },
    ],
    options: [
      { id: 'a', label: 'Loop gain=.72<1；π 路径为 1、.72、.5184pp，逐期衰减', diagnosis: '正确。稳定性由整条反馈回路的乘积决定。' },
      { id: 'b', label: '因为 g>1，系统必然发散', diagnosis: '只看更新一段，忽略信念转成实际价格的 γ=.6 截断了回路。' },
      { id: 'c', label: '价格水平永久更高，所以通胀率也永久保持 1%', diagnosis: '把一次价格水平的永久变化与通胀率持续不变混为一谈。' },
    ],
    correct: 'a',
    calculation: 'Loop gain=γg=.6×1.2=.72。π₀=1pp；e₁=1.2，π₁=.6×1.2=.72pp；π₂=.72×.72=.5184pp。|γg|<1，冻结系统稳定。',
    reveal: '现实中的竞争、短合同、政策可信度、收入约束与融资边界都会改变 γ 或 g。局部模型收敛不保证任何现实制度永久稳定，发散算例也不自动证明真实经济已经去锚。',
    revisit: '回看 42「Feedback Stability」、43–45「合同接口」与 51「Feedback and Breaks」。',
    sourceIds: [64, 65, 83, 99, 107],
    staticSourceIds: [64, 83, 99],
    staticTwin: {
      title: '变式 09 · 冻结模型中的放大',
      prompt: '若 g=1.4、γ=.8，同样从 π₀=1pp 开始，求 loop gain 与前两次反馈。',
      answer: 'Loop gain=1.12；π₁=1.12pp、π₂=1.2544pp，在冻结线性模型中发散；这仍不是现实去锚的充分证据。',
    },
    numericAssertions: [
      { key: 'loopGain', expected: 0.72, unit: 'ratio' },
      { key: 'stable', expected: true, unit: 'boolean' },
      { key: 'pi1', expected: 0.72, unit: 'pp' },
      { key: 'pi2', expected: 0.5184, unit: 'pp' },
    ],
  },
  {
    id: 'realtime-inflation-communication-surprise',
    mode: 'mechanism',
    label: '机制实验 05 · Real-time News',
    title: '上午 CPI 与下午央行沟通同时发生时，怎样避免把两个事件和五种新闻混成一个故事？',
    brief: '08:29 ET 冻结 CPI consensus=3.1%、历史同口径 forecast-error SD=.20pp；08:30 首次发布 actual=3.4%。08:29–08:45 名义收益率 +8bp、实际收益率 +3bp、raw breakeven +5bp。14:00 政策利率按预期不变；14:00–14:15 两年利率 +12bp、股票 +0.6%。',
    facts: [
      { label: 'CPI release', value: '3.4% vs 3.1% · σ=.20pp', note: '08:30 首次发布' },
      { label: 'Morning window', value: 'nominal +8bp · real +3bp · BE +5bp', note: '只报告 compensation 变化' },
      { label: 'Afternoon window', value: 'policy as expected · 2y +12bp · equity +0.6%', note: '独立沟通事件' },
    ],
    options: [
      { id: 'a', label: '上午 +5bp 就是纯预期通胀上升，下午价格变化也应归入 CPI 反应', diagnosis: '同时犯了两类错误：未剥离市场风险/流动性楔子，并混合相隔数小时的事件窗。' },
      { id: 'b', label: '下午政策利率没有 surprise，所以资产变化只能是噪声', diagnosis: '声明仍可改变预期路径、反应函数认知或披露央行私人信息。' },
      { id: 'c', label: 'CPI z=+1.5；上午只能报告通胀补偿变化；下午是独立沟通，利率与股票同涨只是 information-shock mixture 候选', diagnosis: '正确。候选解释不是结构识别结论。' },
    ],
    correct: 'c',
    calculation: 'z=(3.4−3.1)/.20=+1.5。上午名义 +8bp=实际 +3bp+raw BE +5bp；这只是机械恒等式。下午需单独冻结 14:00 前的信息集与 14:00–14:15 窄窗。',
    reveal: '事件研究至少保存 consensus cutoff、首次发布、时区、市场窗、重叠新闻、政策文件 data cutoff 与模型 run date。利率和股票同涨可与央行信息效应一致，但不能单凭符号证明。',
    revisit: '回看 55「Central-bank Information Shock」、57「Inflation Release Surprise」、58「Asset-news Decomposition」与 59「Real-time Identification」。',
    sourceIds: [47, 49, 50, 54, 100, 109, 110, 111, 114, 121, 122, 123, 124],
    staticSourceIds: [47, 49, 100, 121, 122, 123, 124],
    staticTwin: {
      title: '变式 10 · 负 surprise 与另一场下午沟通',
      prompt: 'Actual=2.7%、consensus=3.0%、SD=.15pp；上午 nominal −9bp、real −4bp、BE −5bp；14:00 利率不变但两年率 +10bp、股票 +0.5%。应怎样报告？',
      answer: 'CPI z=(2.7−3.0)/.15=−2；上午只报告名义、实际与通胀补偿变化。下午是独立沟通事件，利率与股票同涨仍只是信息混合候选。',
    },
    numericAssertions: [
      { key: 'cpiZ', expected: 1.5, unit: 'sd' },
      { key: 'nominalMove', expected: 8, unit: 'bp' },
      { key: 'realMove', expected: 3, unit: 'bp' },
      { key: 'breakevenMove', expected: 5, unit: 'bp' },
      { key: 'sameEventWindow', expected: false, unit: 'boolean' },
    ],
  },
];
