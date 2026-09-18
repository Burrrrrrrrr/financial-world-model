export type RiskParityMode = 'decompose' | 'construct';
export type RiskParityChoice = 'a' | 'b' | 'c';

export type RiskParityScenario = {
  id: string;
  mode: RiskParityMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: RiskParityChoice; label: string; diagnosis: string }[];
  correct: RiskParityChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const riskParityModes: { id: RiskParityMode; label: string; title: string; description: string }[] = [
  { id: 'decompose', label: 'MODE A', title: '拆解组合风险', description: '从 covariance、MRC、RC 与 PCR 判断资本和风险怎样错位。' },
  { id: 'construct', label: 'MODE B', title: '构造并审计权重', description: '从风险预算、约束、q／g 与 post-shock actual 走到候选订单。' },
];

export const riskParityScenarios: RiskParityScenario[] = [
  {
    id: 'full-covariance-decomposition',
    mode: 'decompose',
    label: '分解实验 01 · Full Covariance',
    title: '60%／40% 的资本权重怎样变成风险份额？',
    brief: '两个 long-only sleeve 的权重为 (0.6,0.4)，年化波动为 (10%,20%)，相关系数为 0.25。所有数值同币种、同持有期、同年化口径，协方差矩阵视为决策前已知；求组合波动的百分比风险贡献 PCR。',
    facts: [
      { label: 'Capital weights', value: '60% / 40%', note: 'q=(0.6,0.4)' },
      { label: 'Standalone vols', value: '10% / 20%', note: '不是可直接相加的风险份额' },
      { label: 'Correlation', value: '0.25', note: 'cov=0.005' },
    ],
    options: [
      { id: 'a', label: 'PCR≈38.71% / 61.29%', diagnosis: '正确。先算 Σq，再算 qᵢ(Σq)ᵢ；资本权重不能直接充当风险份额。' },
      { id: 'b', label: 'PCR=50% / 50%', diagnosis: '这是假定 ERC 已经成立；题设只给资本权重，没有给风险平价条件。' },
      { id: 'c', label: 'PCR=60% / 40%', diagnosis: '把资本份额直接改名为风险份额，漏掉了个体波动与 covariance。' },
    ],
    correct: 'a',
    calculation: 'Σq=(0.008,0.019)；V=q′Σq=0.0124；σp=11.1355%；VC=(0.0048,0.0076)；PCR=VC/V≈(38.7097%,61.2903%)。',
    reveal: '风险贡献是“当前权重 × 该资产与整个组合的 covariance”再标准化。Standalone volatility、资本权重和组合风险份额是三种不同对象。',
    revisit: '回看 04–09「资本与风险、MRC、RC、PCR」。',
    staticTwin: {
      title: '变式 01 · 50/50 仍不等风险',
      prompt: '两资产权重各 50%，波动为 12% 与 18%，相关性为 0。求组合方差、波动与 PCR。',
      answer: 'VC=(0.5²×0.12²,0.5²×0.18²)=(0.0036,0.0081)；V=0.0117，σp≈10.8167%；PCR≈(30.7692%,69.2308%)。',
    },
  },
  {
    id: 'two-asset-erc',
    mode: 'decompose',
    label: '构造实验 02 · Two-asset ERC',
    title: '两资产 ERC 为什么在非退化相关性下仍是 inverse-vol？',
    brief: '两项资产波动为 10% 与 20%，相关性为 0.70，目标风险预算各 50%，要求 long-only、权重和为 1。题设组合方差为正；选择精确 ERC 权重。',
    facts: [
      { label: 'Standalone vols', value: '10% / 20%', note: 'σ₁/σ₂=1/2' },
      { label: 'Correlation', value: '0.70', note: '共同 covariance 不为零' },
      { label: 'Risk budgets', value: '50% / 50%', note: '比较 RC，不比较 MRC' },
    ],
    options: [
      { id: 'a', label: '50% / 50%', diagnosis: '平均分资本不能抵消第二项两倍的 standalone volatility。' },
      { id: 'b', label: '66.67% / 33.33%', diagnosis: '正确。两资产等预算方程中的共同 covariance 项抵消，权重比为 σ₂/σ₁。' },
      { id: 'c', label: '80% / 20%', diagnosis: '这是 inverse-variance 权重，不是两资产等风险贡献的 inverse-vol 解。' },
    ],
    correct: 'b',
    calculation: 'q=(2/3,1/3)；V≈0.0151111，σp≈12.2927%；VC₁=VC₂≈0.00755556，所以 RC₁=RC₂≈6.1464%，PCR=(50%,50%)。',
    reveal: '“相关性不影响两资产等预算权重”是一个窄特例：相关性仍改变总波动；到三资产且相关矩阵行和不等时，inverse-vol 通常不再是 ERC。',
    revisit: '回看 14–15「ERC 条件与 inverse-vol 特例」。',
    staticTwin: {
      title: '变式 02 · 负相关下的两资产 ERC',
      prompt: '两资产波动为 12% 与 18%，相关性 −0.30，等风险预算且组合风险非零。求 ERC 权重、两项 VC 与组合波动。',
      answer: 'q=(18/(12+18),12/(12+18))=(60%,40%)；VC₁=VC₂=0.0036288；V=0.0072576，σp≈8.5192%，PCR=(50%,50%)。',
    },
  },
  {
    id: 'heterogeneous-correlation',
    mode: 'decompose',
    label: '反例实验 03 · Heterogeneous Correlation',
    title: '三资产 inverse-vol 为什么不再自动等于 ERC？',
    brief: '三资产波动为 (10%,20%,30%)，相关矩阵各行和为 (1.7,1.3,1.8)：ρ₁₂=0.1、ρ₁₃=0.6、ρ₂₃=0.2。采用 inverse-vol 权重 (6/11,3/11,2/11)，矩阵为正定；选择正确 PCR。',
    facts: [
      { label: 'Inverse-vol q', value: '54.55% / 27.27% / 18.18%', note: '令 qᵢσᵢ 相同' },
      { label: 'Correlation row sums', value: '1.7 / 1.3 / 1.8', note: '并不相等' },
      { label: 'Covariance status', value: 'Positive definite', note: '不是坏矩阵伪影' },
    ],
    options: [
      { id: 'a', label: 'PCR=33.33% / 33.33% / 33.33%', diagnosis: '只有相关矩阵行和相同等特殊结构下，inverse-vol 才会把贡献均分。' },
      { id: 'b', label: 'PCR=54.55% / 27.27% / 18.18%', diagnosis: '这是资本权重，不是由全协方差计算的风险贡献。' },
      { id: 'c', label: 'PCR≈35.42% / 27.08% / 37.50%', diagnosis: '正确。Inverse-vol 下 VC 与相关矩阵行和成正比。' },
    ],
    correct: 'c',
    calculation: 'V≈0.01428099；VC≈(0.00505785,0.00386777,0.00535537)；PCR≈(35.4167%,27.0833%,37.5000%)。精确 ERC q 约为 (52.7391%,30.6180%,16.6429%)。',
    reveal: 'Inverse-vol 平衡 qᵢσᵢ，却没有自动平衡每项与整个组合的 covariance。相关网络异质时，必须用完整 Σ 验算 RC。',
    revisit: '回看 15–17「Inverse-vol、Equal Weight 与 ERC」。',
    staticTwin: {
      title: '变式 03 · 同波动也可不等风险',
      prompt: '三资产波动都为 10%，等权；ρ₁₂=0.8，ρ₁₃=ρ₂₃=0。求 PCR。',
      answer: '相关矩阵行和为 (1.8,1.8,1.0)，等权下 VC 与行和成比例；PCR≈(39.1304%,39.1304%,21.7391%)，不是三等分。',
    },
  },
  {
    id: 'diagonal-risk-budget',
    mode: 'decompose',
    label: '预算实验 04 · General Risk Budget',
    title: '不相等风险预算为什么使用 √b/σ，而不是 b/σ？',
    brief: '三资产彼此零 covariance，波动为 (10%,20%,40%)，目标风险份额 b=(50%,30%,20%)。要求正权重且归一化；选择精确 risk-budgeting 解。',
    facts: [
      { label: 'Risk budgets b', value: '50% / 30% / 20%', note: '不是资本权重' },
      { label: 'Standalone vols', value: '10% / 20% / 40%', note: 'Σ 为对角阵' },
      { label: 'Closed form', value: 'qᵢ ∝ √bᵢ / σᵢ', note: '仅对角 covariance 特例' },
    ],
    options: [
      { id: 'a', label: 'q≈64.71% / 25.06% / 10.23%', diagnosis: '正确。归一化 √b/σ 后，qᵢ²σᵢ² 正好按 b 分配。' },
      { id: 'b', label: 'q=50% / 30% / 20%', diagnosis: '把目标风险份额直接当作资本份额，忽略了不同波动。' },
      { id: 'c', label: 'q≈57.14% / 28.57% / 14.29%', diagnosis: '这是等预算 inverse-vol 权重，没有实现题设不相等的 b。' },
    ],
    correct: 'a',
    calculation: '√b/σ≈(7.0711,2.7386,1.1180)，归一化 q≈(0.6470765,0.2506117,0.1023118)；V≈0.00837416，PCR=(50%,30%,20%)。',
    reveal: 'Risk budget 是贡献目标。对角矩阵下贡献与 qᵢ²σᵢ² 成正比，所以权重需要 √b；一般协方差下连这个闭式也不再成立。',
    revisit: '回看 10、20「Risk Budget 与不相等预算」。',
    staticTwin: {
      title: '变式 04 · 64/36 风险预算',
      prompt: '两资产零相关，波动 12% 与 18%，目标 b=(64%,36%)。求归一化权重、组合方差和 PCR。',
      answer: '√b/σ=(0.8/0.12,0.6/0.18)=(6.6667,3.3333)，q=(2/3,1/3)；V=0.01，σp=10%，PCR=(64%,36%)。',
    },
  },
  {
    id: 'variance-factor-two',
    mode: 'decompose',
    label: '审计实验 05 · Factor-of-two',
    title: 'Variance contribution 为什么要防止“二倍总和”陷阱？',
    brief: '两项独立资产权重各 50%，波动为 10% 与 30%。令 V=q′Σq；比较可加的 variance component VCᵢ=qᵢ(Σq)ᵢ 与 qᵢ∂V/∂qᵢ。',
    facts: [
      { label: 'Weights', value: '50% / 50%', note: 'long-only' },
      { label: 'Vols', value: '10% / 30%', note: 'zero covariance' },
      { label: 'Variance', value: 'V=0.025', note: 'σp≈15.8114%' },
    ],
    options: [
      { id: 'a', label: 'qᵢ∂V/∂qᵢ 直接加总为 V', diagnosis: 'V 对权重是二阶齐次函数，Euler 总和是 2V；需要乘 1/2 才成为加总到 V 的 VC。' },
      { id: 'b', label: 'VC=(0.0025,0.0225) 加总为 V；qᵢ∂V/∂qᵢ 加总为 2V', diagnosis: '正确。先冻结贡献 convention，才能避免把 variance 与 volatility contribution 混写。' },
      { id: 'c', label: '两项 PCR 都是 50%', diagnosis: '第二项波动是第一项三倍，等资本下方差贡献为九倍。' },
    ],
    correct: 'b',
    calculation: 'VC=(0.5²×0.1²,0.5²×0.3²)=(0.0025,0.0225)，ΣVC=0.025=V；qᵢ∂V/∂qᵢ=2VC，合计 0.05=2V；PCR=(10%,90%)。',
    reveal: '本节以 volatility Euler RC 为主，并把 VC 定义成加总到 variance 的 qᵢ(Σq)ᵢ；符号看似相邻，齐次次数却不同。',
    revisit: '回看 05–09「Variance、Volatility 与 Euler 贡献」。',
    staticTwin: {
      title: '变式 05 · 40/60 的方差审计',
      prompt: '两项独立资产权重 40%/60%，波动 15%/25%。求 V、VC、PCR，并核对 qᵢ∂V/∂qᵢ 的总和。',
      answer: 'VC=(0.4²×0.15²,0.6²×0.25²)=(0.0036,0.0225)，V=0.0261；PCR≈(13.7931%,86.2069%)；qᵢ∂V/∂qᵢ=2VC，合计 0.0522=2V。',
    },
  },
  {
    id: 'mrc-rc-pcr-audit',
    mode: 'construct',
    label: '审计实验 06 · MRC versus RC',
    title: '同一组合里，哪一组数才是可以加总的当前风险贡献？',
    brief: '沿用第 1 题的 q=(0.6,0.4)、年化波动 (10%,20%) 和相关系数 0.25。已知 Σq=(0.008,0.019)、σp≈11.1355%；选择同时正确区分 MRC、RC 与 PCR 的结果。',
    facts: [
      { label: 'Current weights q', value: '60% / 40%', note: 'RC 必须乘回当前权重' },
      { label: 'Σq', value: '0.008 / 0.019', note: '每项与整个组合的 covariance' },
      { label: 'Portfolio vol', value: '11.1355%', note: 'RC 加总回这一数值' },
    ],
    options: [
      { id: 'a', label: 'MRC≈4.3105% / 6.8250%，两项相加为 σp', diagnosis: '这组数已经乘过 q，是 RC；把可加的持仓贡献误叫成边际斜率。' },
      { id: 'b', label: 'MRC≈7.1842% / 17.0625%，RC 与 MRC 相同', diagnosis: 'MRC 数值正确，但 RC 还必须分别乘 0.6 与 0.4；忘记当前规模就不能做 Euler 加总。' },
      { id: 'c', label: 'MRC≈7.1842% / 17.0625%；RC≈4.3105% / 6.8250%；PCR≈38.71% / 61.29%', diagnosis: '正确。MRC 是每单位权重的斜率，RC=qᵢMRCᵢ 才是当前持仓贡献，PCR=RC/σp。' },
    ],
    correct: 'c',
    calculation: 'MRC=(Σq)/σp≈(7.1842%,17.0625%)；RC=q⊙MRC≈(4.3105%,6.8250%)，合计 11.1355%；PCR=RC/σp≈(38.7097%,61.2903%)。',
    reveal: 'MRC 回答“再加一点权重会怎样”，RC 回答“当前持仓已经分到多少风险”。只有先乘回 q，Euler 总账才会闭合；再除以 σp 才能与预算 b 比较。',
    revisit: '回看 07–09「MRC、RC 与 PCR」。',
    staticTwin: {
      title: '变式 06 · 从斜率到当前贡献',
      prompt: '两项独立资产 q=(0.5,0.5)，波动为 12% 与 18%。已知 Σq=(0.0072,0.0162)、σp≈10.8167%。分别求 MRC、RC 与 PCR，并核对加总。',
      answer: 'MRC≈(6.6564%,14.9769%)；RC≈(3.3282%,7.4885%)，合计约 10.8167%；PCR≈(30.7692%,69.2308%)。MRC 本身不能直接相加回 σp。',
    },
  },
  {
    id: 'binding-weight-cap',
    mode: 'construct',
    label: '约束实验 07 · Binding Cap',
    title: 'Solver 返回可行权重，为什么仍不能声称精确 ERC？',
    brief: '两项独立资产波动 10% 与 20%，目标预算各 50%，long-only、权重和为 1，但低波动资产上限为 55%。在这个两资产例子中，无约束 ERC 需要 66.67%／33.33%，因此上限绑定。',
    facts: [
      { label: 'Unconstrained ERC', value: '66.67% / 33.33%', note: 'inverse-vol special case' },
      { label: 'Binding cap', value: 'q₁≤55%', note: '精确解不在可行域' },
      { label: 'Feasible boundary', value: '55% / 45%', note: '必须报告实际 PCR' },
    ],
    options: [
      { id: 'a', label: 'q=55%/45%；PCR≈27.19%/72.81%；最大预算残差约 22.81 个百分点', diagnosis: '正确。可行不等于命中预算；binding constraint 的经济代价要显式报告。' },
      { id: 'b', label: 'q=50%/50%；PCR=50%/50%', diagnosis: '等资本不会抵消第二项更高的 variance，而且 50/50 不是本题最接近无约束解的边界点。' },
      { id: 'c', label: 'q=55%/45%；PCR=55%/45%', diagnosis: '再次把资本权重误作风险份额。' },
    ],
    correct: 'a',
    calculation: 'q=(0.55,0.45)；VC=(0.003025,0.0081)，V=0.011125；PCR≈(27.1910%,72.8090%)；PCR−b≈(−22.809,+22.809) 个百分点。',
    reveal: '“优化成功”只表示算法返回某个可行点。若精确预算被 cap、floor、group 或 turnover 约束排除，应称 constrained approximation 并报告 residual。',
    revisit: '回看 25、27「可行域、绑定约束与残差」。',
    staticTwin: {
      title: '变式 07 · 60% 上限',
      prompt: '两项独立资产波动 12% 与 24%，等风险预算；第一项权重上限为 60%。求边界组合的 PCR 与最大绝对预算残差。',
      answer: '无约束 ERC 为 2/3、1/3，cap 后 q=(0.6,0.4)；VC=(0.005184,0.009216)，V=0.0144；PCR=(36%,64%)，最大残差 14 个百分点。',
    },
  },
  {
    id: 'asset-vs-factor-risk',
    mode: 'construct',
    label: '因子实验 08 · Asset ≠ Factor',
    title: '资产风险各半，为什么共同因子仍可占近九成？',
    brief: '两资产都对同一因子暴露 1。因子方差 Ω=0.008，特异方差 D=diag(0.002,0.002)，权重各 50%。Σ=BΩB′+D；选择正确解释。',
    facts: [
      { label: 'Factor loadings B', value: '1 / 1', note: '共享同一风险源' },
      { label: 'Factor variance', value: '0.008', note: 'common component' },
      { label: 'Specific variances', value: '0.002 / 0.002', note: 'equal residual risk' },
    ],
    options: [
      { id: 'a', label: '资产与因子风险都天然 50/50', diagnosis: '资产贡献可以按标签均分，但两个标签可共同承载同一个因子。' },
      { id: 'b', label: '资产 PCR 为 50/50，但共同因子占总方差约 88.89%', diagnosis: '正确。资产分散与经济风险源分散是两套坐标。' },
      { id: 'c', label: 'Residual risk 为 0', diagnosis: 'D 明确包含两项非零特异方差；组合 residual variance 为 0.001。' },
    ],
    correct: 'b',
    calculation: 'Σ=[[0.01,0.008],[0.008,0.01]]；V=0.009，σp≈9.4868%；资产 PCR=(50%,50%)；factor variance=0.008，residual variance=0.001，factor share=88.8889%。',
    reveal: '资产 ERC 只平衡资产标签在指定 Σ 中的贡献。若多个资产共享 duration、growth、inflation 或 liquidity 因子，因子层仍可高度集中。',
    revisit: '回看 36–38「Asset Risk、Hidden Factor 与 Factor Parity」。',
    staticTwin: {
      title: '变式 08 · 75% 的共同因子',
      prompt: '两资产因子暴露都为 1，Ω=0.006，D=diag(0.004,0.004)，等权。求总方差、资产 PCR、factor 与 residual variance shares。',
      answer: 'Σ=[[0.01,0.006],[0.006,0.01]]；V=0.008，资产 PCR=(50%,50%)；factor variance=0.006 占 75%，residual variance=0.002 占 25%。',
    },
  },
  {
    id: 'composition-vs-multiplier',
    mode: 'construct',
    label: '缩放实验 09 · q versus g',
    title: '外层目标波动倍率为什么不改变标准化风险贡献？',
    brief: '两项独立资产波动 10% 与 20%，相对 ERC 构成为 q=(2/3,1/3)。外层策略把组合目标波动设为 12%，没有 cap、floor 或 cash risk；求共同倍率 g 和最终 risky exposures。',
    facts: [
      { label: 'Relative composition q', value: '2/3 / 1/3', note: '由 risk parity 决定' },
      { label: 'Composition vol', value: '≈9.4281%', note: '√(q′Σq)' },
      { label: 'Target vol', value: '12%', note: '由外层 2.11 policy 决定' },
    ],
    options: [
      { id: 'a', label: '共同缩放会把 PCR 从 50/50 改走', diagnosis: '正的共同尺度同时缩放总波动和每项 RC，不改变 RC/σp。' },
      { id: 'b', label: 'g≈0.7857', diagnosis: '把 composition vol 与 target 的比率写反；这里目标高于基础波动，需要放大。' },
      { id: 'c', label: 'g≈1.2728；w*≈(0.8485,0.4243)；PCR 仍为 50/50', diagnosis: '正确。q 决定相对构成，g 只共同缩放 risky basket。' },
    ],
    correct: 'c',
    calculation: 'σ(q)=√[(2/3)²×0.1²+(1/3)²×0.2²]≈9.4281%；g=12/9.4281≈1.272792；w*=gq≈(0.848528,0.424264)，σ(w*)=12%，PCR=(50%,50%)。',
    reveal: 'Risk parity 与 vol targeting 可以串联，却不能合并概念：q 回答“资产之间怎样分”，g 回答“整个篮子做多大”。',
    revisit: '回看 23–24「Scale Invariance 与 q／g」。',
    staticTwin: {
      title: '变式 09 · 目标低于基础波动',
      prompt: '两项独立资产波动 12% 与 18%，ERC q=(60%,40%)；目标波动 8%，无 cap/floor。求 σ(q)、g、w* 与 PCR。',
      answer: 'σ(q)=√(0.6²×0.12²+0.4²×0.18²)=√0.010368≈10.1823%；g≈0.785674；w*≈(0.471404,0.314270)，PCR 仍为 (50%,50%)。',
    },
  },
  {
    id: 'target-flow-identification',
    mode: 'construct',
    label: '证据实验 10 · Target ≠ Flow',
    title: '只有新 target，能否判断基金真实买卖了什么？',
    brief: 'Risk-parity engine 给出新目标 w*=(60%,30%)，其余 10% 为现金。研究者不知道 post-shock actual、交易前 NAV、账户现金流、实现工具、跨账户净额、订单或成交。选择证据允许的最强结论。',
    facts: [
      { label: 'New target w*', value: '60% / 30% / 10% cash', note: '只是一项政策状态' },
      { label: 'Post-shock actual', value: 'Unknown', note: '订单差额的关键基准缺失' },
      { label: 'Orders and fills', value: 'Unknown', note: '没有实施与成交证据' },
    ],
    options: [
      { id: 'a', label: '只能识别目标状态；真实 flow 的符号和金额仍不可识别', diagnosis: '正确。Desired order 取决于 target−post-shock actual，之后还要经过载体、净额、约束和 fill。' },
      { id: 'b', label: '股票一定买入 60%，债券一定买入 30%', diagnosis: '目标权重不是从零仓位开始的购买比例；actual 可能高于或低于 target。' },
      { id: 'c', label: '新 target 就是观察到的最终成交组合', diagnosis: '跳过了订单、容量、部分成交和执行期间价格变化，也没有任何成交记录。' },
    ],
    correct: 'a',
    calculation: '候选订单金额为 ΔXᵈᵉˢ=NAV⁻w*−X⁻。题目没有 NAV⁻ 与 post-shock actual X⁻，因此连每项订单符号都不唯一；更无法推出 fill 或价格影响。',
    reveal: '同一个 risk-parity target 可以对应买入、卖出或零交易。Target 是模型输出；actual、order 与 fill 是账户和执行状态，不能由方法名称倒推。',
    revisit: '回看 34–35、51「Dynamic q、Target ≠ Flow 与证伪协议」。',
    staticTwin: {
      title: '变式 10 · 同一 target、相反订单',
      prompt: '两项资产的目标市值都为 5,000 万元。账户 A 的 post-shock actual 为 6,000 万／4,000 万，账户 B 为 4,000 万／6,000 万；忽略外部现金流。分别写出两账户的候选订单金额，并解释为什么只看 target 不能判断 flow。',
      answer: '账户 A 的候选订单为 (−1,000 万,+1,000 万)，账户 B 为 (+1,000 万,−1,000 万)。两者 target 完全相同，actual gap 却相反；真实 fill 还需再经过执行与容量。',
    },
  },
];
