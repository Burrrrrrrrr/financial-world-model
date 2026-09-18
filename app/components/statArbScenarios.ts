export type StatArbMode = 'construction' | 'stress';
export type StatArbChoice = 'a' | 'b' | 'c';

export type StatArbScenario = {
  id: string;
  mode: StatArbMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: StatArbChoice;
  options: { id: StatArbChoice; label: string; diagnosis: string }[];
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const statArbModes: { id: StatArbMode; label: string; title: string; description: string }[] = [
  { id: 'construction', label: 'MODE 01', title: '从信号到组合', description: '名义敞口、中性约束、价差、半衰期与剩余风险' },
  { id: 'stress', label: 'MODE 02', title: '从损益到共同减仓', description: '成本、借券、波动缩放、保证金与价格反馈' },
];

export const statArbScenarios: StatArbScenario[] = [
  {
    id: 'gross-net-leverage',
    mode: 'construction',
    label: '组合实验 01 · Gross / Net / Leverage',
    title: '净名义敞口为零时，组合为什么仍可能有八倍总杠杆？',
    brief: '四个头寸的带方向名义金额依次为 +120、+80、−100、−100 千元；正数为多头，负数为空头。权益 E=50 千元。使用 net N=Σn、gross G=Σ|n|、gross leverage L=G/E。金额均是同一货币，不考虑衍生品 delta、融资净额或期权非线性。',
    facts: [
      { label: 'Longs', value: '+120 / +80', note: '千元' },
      { label: 'Shorts', value: '−100 / −100', note: '千元' },
      { label: 'Equity', value: '50', note: '千元' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'net=0、gross=0、leverage=0', diagnosis: '把多空相抵误当成风险和资产负债表都消失。Gross 要先取每个头寸绝对值，再求和。' },
      { id: 'b', label: 'net=0、gross=400 千元、gross leverage=8 倍', diagnosis: '正确。净额描述方向偏置，总额与权益之比描述资产负债表规模。' },
      { id: 'c', label: 'net=200 千元、gross=400 千元、leverage=4 倍', diagnosis: 'Net 必须保留空头负号；leverage 的分母是权益 50，而不是多头名义 200。' },
    ],
    calculation: 'N=120+80−100−100=0；G=120+80+100+100=400 千元；L=400/50=8。',
    reveal: 'Dollar neutral 只说明净名义金额为零。八倍 gross 仍会放大价差、借券费、margin、流动性和模型误差；“neutral”不能读成“没有资产负债表”。',
    revisit: '回看 26–30「Signed notional、三种中性与 gross/net/leverage」。',
    staticTwin: {
      title: '变式 01 · 零净额与五倍总杠杆',
      prompt: '头寸为 +60、+40、−70、−30 千元，权益 40 千元。求 net、gross 与 gross leverage。',
      answer: 'N=60+40−70−30=0；G=60+40+70+30=200 千元；L=200/40=5 倍。',
    },
  },
  {
    id: 'beta-neutral-hedge',
    mode: 'construction',
    label: '组合实验 02 · Beta Neutrality',
    title: '两腿 beta 均为正时，beta 中性为什么通常不会同时 dollar 中性？',
    brief: '组合做多 A 120 千元，A 对声明市场因子的 beta 为 1.2；用 B 空头对冲，B 的 beta 为 0.8，因此题设满足 0<βB<βA。令 beta exposure βA nA+βB nB=0。Beta 视为无量纲且在本题窗口内固定；忽略估计误差、特异风险与交易成本。',
    facts: [
      { label: 'Long A', value: '+120k', note: 'βA=1.2' },
      { label: 'Short B', value: 'unknown', note: 'βB=0.8' },
      { label: 'Constraint', value: 'β exposure=0', note: '不是 net=0' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '做空 B 120 千元；net=0、gross=240 千元', diagnosis: '这只实现 dollar neutral。两腿 beta 不同，组合仍有 1.2×120−0.8×120=48 千元 beta-notional。' },
      { id: 'b', label: '做空 B 80 千元；net=+40、gross=200 千元', diagnosis: 'Hedge ratio 倒置。低 beta 资产需要更大的名义金额，才能抵消高 beta 多头。' },
      { id: 'c', label: '做空 B 180 千元；net=−60、gross=300 千元', diagnosis: '正确。1.2×120+0.8×(−180)=0，但名义净额并不为零。' },
    ],
    calculation: 'nB=−(βA/βB)nA=−(1.2/0.8)×120=−180 千元；net=120−180=−60；gross=120+180=300 千元。',
    reveal: '“Market neutral”必须声明对哪个因子、用哪个估计窗口和在何种尺度中性。Beta-neutral 组合仍有净名义、行业、流动性与非线性风险。',
    revisit: '回看 07、28–29「Market neutral 与暴露矩阵」。',
    staticTwin: {
      title: '变式 02 · 不等名义的 beta hedge',
      prompt: '做多 A 90 千元，βA=1.1；B 的 βB=0.9。求 beta-neutral 的 B 名义金额、net 与 gross。',
      answer: 'nB=−(1.1/0.9)×90=−110 千元；net=−20 千元；gross=200 千元。',
    },
  },
  {
    id: 'spread-zscore',
    mode: 'construction',
    label: '信号实验 03 · Spread / Z-score',
    title: '先冻结价差单位，才能把偏离写成无量纲 z-score。',
    brief: '使用价格水平价差 s=PA−α−hPB；这里 α≡αL、h≡hL。PA=103.4，PB=48，α=5，h=2；历史窗口内价差均值 μ=1.2、标准差 σs=0.6。价格和 α 使用同一货币/股单位，pair hedge coefficient h 把 B 的价格单位映射成 A 的价格单位；估计量在决策时点之前已冻结。字母 β 在后续题中专指市场／因子 beta，不与 h 混用。',
    facts: [
      { label: 'Prices', value: '103.4 / 48', note: 'A / B' },
      { label: 'Relation', value: 'α=5 / h=2', note: 'pair hedge coefficient' },
      { label: 'History', value: 'μ=1.2 / σ=0.6', note: '同单位' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'spread=2.4，z=+2.0', diagnosis: '正确。先按冻结的 hedge relation 得到价差，再用同单位均值和标准差标准化。' },
      { id: 'b', label: 'spread=7.4，z≈10.33', diagnosis: '漏减了 hPB 中的一部分；2×48=96，不是 91。' },
      { id: 'c', label: 'spread=2.4，z=4.0', diagnosis: 'Z-score 要减去历史均值：偏离是 2.4−1.2=1.2，而不是直接用价差除标准差。' },
    ],
    calculation: 's=103.4−5−2×48=2.4；z=(2.4−1.2)/0.6=2.0。',
    reveal: 'z=2 只是相对冻结窗口的两倍样本标准差；没有分布、平稳性和实时可交易性假设时，它不是确定的尾部概率，也不自动是做空指令。',
    revisit: '回看 14–20「信号、distance/correlation/cointegration、价差与 z-score」。',
    staticTwin: {
      title: '变式 03 · 负向三倍标准差',
      prompt: 'PA=69.2，PB=44，α=4，h=1.5；价差历史均值 0.4、标准差 0.4。求 spread 与 z。',
      answer: 's=69.2−4−1.5×44=−0.8；z=(−0.8−0.4)/0.4=−3。',
    },
  },
  {
    id: 'ou-half-life',
    mode: 'construction',
    label: '信号实验 04 · OU Half-life',
    title: '均值回归速度怎样变成半衰期，又为什么不是平仓承诺？',
    brief: '教学上假定价差满足 OU 模型 ds=κ(μ−s)dt+σdW，且 κ=0.2/日。使用 t1/2=ln2/κ。κ 已在不使用未来数据的估计窗中得到并暂时固定；本题不处理参数不确定性、跳跃或结构断裂。',
    facts: [
      { label: 'Model', value: 'OU', note: '只是工作模型' },
      { label: 'κ', value: '0.2 / day', note: '逆时间单位' },
      { label: 'Formula', value: 'ln2 / κ', note: '输出为天' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '0.289 天', diagnosis: '把 κ/ln2 当成了半衰期。量纲检查也能发现 κ/ln2 仍是 1/天，不是时间。' },
      { id: 'b', label: '约 3.466 天', diagnosis: '正确。0.693147/0.2=3.4657 天。' },
      { id: 'c', label: '5 天，而且第 5 天必然回到均值', diagnosis: '1/κ 是另一个时间尺度，不是半衰期；更重要的是随机过程不承诺某天必然命中均值。' },
    ],
    calculation: 't1/2=ln(2)/0.2=0.693147/0.2=3.4657 天。',
    reveal: 'Half-life 描述模型中期望偏离衰减一半的时间，不是持仓到期日。若 κ 漂移、关系断裂或成本高于收敛收益，机械等待会放大路径风险。',
    revisit: '回看 17–20「协整、价差单位、OU 与阈值」。',
    staticTwin: {
      title: '变式 04 · 更慢的模型衰减',
      prompt: '若 κ=0.1/日，其余解释不变，求半衰期。',
      answer: 't1/2=ln2/0.1=6.931 天。它仍是模型期望衰减尺度，不是必然收敛时点。',
    },
  },
  {
    id: 'dollar-neutral-beta',
    mode: 'construction',
    label: '组合实验 05 · Remaining Beta',
    title: '等额多空已经 dollar neutral，为什么权益归一化 beta 暴露仍为 +0.4？',
    brief: '用权益归一化权重表示组合：A 权重 +1，B 权重 −1；βA=1.2，βB=0.8。Net weight=Σw，gross=Σ|w|，权益归一化 beta 暴露=Σβiw_i。Beta 在题设窗口内固定。',
    facts: [
      { label: 'Weights', value: '+1 / −1', note: 'dollar neutral' },
      { label: 'Betas', value: '1.2 / 0.8', note: '同一市场因子' },
      { label: 'Gross', value: '2', note: '权益倍数' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'net=0、gross=0、beta 暴露=0', diagnosis: '多空抵消了净权重，不会消除 gross；beta 还要按每腿暴露加权。' },
      { id: 'b', label: 'net=0、gross=2、beta 暴露=+2.0', diagnosis: '空头权重必须保留负号；1.2×1+0.8×(−1)，不是两者相加。' },
      { id: 'c', label: 'net=0、gross=2、权益归一化 beta 暴露=+0.4', diagnosis: '正确。Dollar neutrality 不等于 beta neutrality。这里的 +0.4 是每单位权益的线性市场暴露，不是组合收益率。' },
    ],
    calculation: 'net=1−1=0；gross=|1|+|−1|=2；βp=1.2×1+0.8×(−1)=0.4。',
    reveal: '任何“中性”都是相对一个暴露集合的投影。因子被遗漏、载荷漂移或压力状态变成非线性时，样本内的零暴露会重新出现。',
    revisit: '回看 27–29「Dollar、beta、multifactor 与行业中性」。',
    staticTwin: {
      title: '变式 05 · 方向相反的剩余 beta',
      prompt: '权重仍为 +1、−1，但 βA=0.9、βB=1.1。求 net、gross 与权益归一化 beta 暴露。',
      answer: 'net=0；gross=2；权益归一化 beta 暴露 βp=0.9−1.1=−0.2。',
    },
  },
  {
    id: 'net-pnl',
    mode: 'stress',
    label: '约束实验 06 · Net P&L',
    title: '方向判断正确后，交易成本、借券费和融资费还剩多少净收益？',
    brief: '多头名义 100 千元，当期上涨 2%；空头名义 100 千元，对应资产下跌 1%。全期全部买卖成交的总绝对名义金额冻结为 200 千元，综合执行成本 8bp 只对这 200 千元乘一次；借券费按冻结的空头名义 100 千元、5% 年化和 20/360 年计；另有融资与运营费 40 元。忽略股息、公司行动、名义随价格变化和重复周转。',
    facts: [
      { label: 'Gross P&L', value: '+2% / short −1%', note: '两腿都盈利' },
      { label: 'Trading', value: '200k × 8bp', note: '全期总绝对成交名义' },
      { label: 'Borrow / other', value: '5% × 20/360 / ¥40', note: '年化日数明确' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '净收益约 2,522.22 元', diagnosis: '正确。先算两腿 mark-to-market，再逐项扣除同一货币单位的成本。' },
      { id: 'b', label: '净收益 3,000 元', diagnosis: '这是只算多空价格收益，完全忽略执行、借券和融资现金流。' },
      { id: 'c', label: '净收益约 2,682.22 元', diagnosis: '漏扣了 200 千元×8bp=160 元的执行成本。' },
    ],
    calculation: '多头=100,000×2%=2,000；空头=100,000×1%=1,000；交易成本=200,000×0.0008=160；借券=100,000×5%×20/360=277.78；净额=3,000−160−277.78−40=2,522.22 元。',
    reveal: 'Stat-arb 的“毛 alpha”必须经过 turnover、spread/impact、borrow、funding、股息和公司行动才变成可实现净收益；self-financing 也不等于融资免费。',
    revisit: '回看 34–40「Turnover、执行、融资、借券与净损益」。',
    staticTwin: {
      title: '变式 06 · 空头方向不利时的净额',
      prompt: '多空名义各 80 千元；多头上涨 1.5%，被做空资产也上涨 0.5%。全期全部买卖成交的总绝对名义冻结为 160 千元，5bp 成本只乘一次；借券费按冻结空头名义 80 千元、3% 年化和 30/360 年计；无其他融资。求净 P&L。',
      answer: '多头 +1,200；空头 −400；交易成本 80；借券费 200；净 P&L=1,200−400−80−200=520 元。',
    },
  },
  {
    id: 'borrow-recall',
    mode: 'stress',
    label: '约束实验 07 · Borrow Recall',
    title: '借券 recall 怎样把“等价等待收敛”变成强制回补订单？',
    brief: '空头 200,000 股，出借方 recall 其中 30%。本题额外假定无法及时找到替代借券，且借券合同要求立即返还，所以必须回补被 recall 的全部数量；这不是“任何 recall 都必然立即回补”的普遍法规结论。当前回补价格 25 元/股，题设把 spread、impact 与 fee 合并为回补名义金额的 35bp；忽略税、股息与剩余空头风险。',
    facts: [
      { label: 'Short shares', value: '200,000', note: '库存单位' },
      { label: 'Recall', value: '30%', note: '强制回补比例' },
      { label: 'Price / cost', value: '¥25 / 35bp', note: '成本乘名义金额' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '回补 60,000 股，名义 150 万元，成本 525 元', diagnosis: 'Basis point 换算少了一个数量级；35bp=0.0035，不是 0.00035。' },
      { id: 'b', label: '回补 60,000 股，名义 150 万元，成本 5,250 元', diagnosis: '正确。Recall 先决定数量，再由价格得到名义，最后乘 35bp。' },
      { id: 'c', label: '回补 200,000 股，成本 17,500 元', diagnosis: '题设只 recall 30%，不能把整个空头都当成强制回补。' },
    ],
    calculation: 'recall shares=200,000×30%=60,000；notional=60,000×25=1,500,000 元；cost=1,500,000×0.0035=5,250 元。',
    reveal: 'Short leg 的可行性取决于 locate、持续借券、费用和 recall/buy-in。价格关系即使最终恢复，被迫在途中回补的组合也无法实现回测终点收益。',
    revisit: '回看 37–41「融资、locate、borrow 与 mark-to-market 路径」。',
    staticTwin: {
      title: '变式 07 · 更小比例、更高股价',
      prompt: '沿用“无法替借且合同要求立即返还”的题设：空头 150,000 股，recall 20%，价格 40 元/股，综合回补成本 25bp。求回补股数、名义和成本。',
      answer: '回补 30,000 股；名义 1,200,000 元；成本=1,200,000×0.0025=3,000 元。',
    },
  },
  {
    id: 'volatility-scaling',
    mode: 'stress',
    label: '约束实验 08 · Volatility Scaling',
    title: '观点没有改变，波动率上升为什么仍会机械减仓 37.5%？',
    brief: '目标组合波动率 σ*=10%，未缩放基准头寸的预测波动率 σhat0=16%；两者使用同一持有期、同一年化规则和同一收益口径，且 σhat0>0。未缩放组合 gross G0=4,000 万元。只使用 k=min(1,σ*/σhat0)，并假定所有头寸同比例缩放时波动同比例缩放；本题暂不叠加 margin、borrow 或流动性上限。',
    facts: [
      { label: 'Target vol', value: '10%', note: '风险预算' },
      { label: 'Unscaled forecast vol', value: '16%', note: 'σhat0，状态上升' },
      { label: 'Unscaled gross', value: '¥40m', note: '同比例缩放' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'k=1.6，新 gross=6,400 万元', diagnosis: '方向反了。预测风险高于目标时应缩小，而不是放大头寸。' },
      { id: 'b', label: 'k=0.60，新 gross=2,400 万元，减仓 40%', diagnosis: '直接用差值 6/10，而不是比率 10/16。' },
      { id: 'c', label: 'k=0.625，新 gross=2,500 万元，减仓 1,500 万元或 37.5%', diagnosis: '正确。信号可不变，但风险可行集已经缩小。' },
    ],
    calculation: 'k=10%/16%=0.625；new gross=40m×0.625=25m；reduction=15m；15/40=37.5%。',
    reveal: '波动缩放是规则性订单生成器，不是新的价值判断。若许多资金使用相似风险窗口，价格下跌—波动上升—减仓可形成正反馈；但经验效果并非跨策略普遍稳定。',
    revisit: '回看 41–44「路径风险、波动限制、margin 与共同减仓」。',
    staticTwin: {
      title: '变式 08 · 较温和的风险收缩',
      prompt: '目标波动 12%，未缩放基准组合的预测波动 15%，二者同口径、同期限、同年化且预测波动大于零；未缩放 gross 2,500 万元。求 k、新 gross 和减仓比例。',
      answer: 'k=12/15=0.8；新 gross=2,000 万元；减仓 500 万元或 20%。',
    },
  },
  {
    id: 'margin-headroom',
    mode: 'stress',
    label: '约束实验 09 · Simplified Margin',
    title: '价差看起来更便宜时，保证金上限为什么反而要求减仓？',
    brief: '权益 E=1,000 万元，当前 gross=4,000 万元。教学上假定所有头寸统一、可加的保证金率 m=30%，无净额抵扣、集中度附加项、压力加成或合约差异。必须满足 mG≤E。求需要的保证金、最大 gross 与最低减仓。',
    facts: [
      { label: 'Equity', value: '¥10m', note: '可用资本' },
      { label: 'Gross', value: '¥40m', note: '当前组合' },
      { label: 'Margin rate', value: '30%', note: '教学用可加模型' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '需 1,200 万；最大 gross 3,333.33 万；至少减 666.67 万或 16.67%', diagnosis: '正确。约束由权益和保证金率决定，而不是由价差信号强弱决定。' },
      { id: 'b', label: '只需 300 万保证金，无需减仓', diagnosis: '把保证金率乘到了权益，而不是当前 gross exposure。' },
      { id: 'c', label: '最大 gross 3,000 万，需减仓 25%', diagnosis: '把 30% 错当成可保留比例；正确上限是 E/m。' },
    ],
    calculation: 'required margin=40m×30%=12m>E=10m；Gmax=10m/0.30=33.3333m；reduction=6.6667m；reduction/G=16.6667%。',
    reveal: '真实 prime-broker margin 会计入净额、跨品种抵扣、流动性、集中度与压力附加项。本题只隔离“权益下降或 margin 上调会收缩可行集”这一机制。',
    revisit: '回看 37、41–44「融资、路径、风险限制与 margin scaling」。',
    staticTwin: {
      title: '变式 09 · 更高保证金率',
      prompt: '权益 600 万元，gross 2,000 万元，统一保证金率 40%。求最大 gross、最低减仓金额和比例。',
      answer: 'Gmax=6m/0.40=15m；需减 5m；减仓比例=5/20=25%。',
    },
  },
  {
    id: 'common-deleveraging',
    mode: 'stress',
    label: '反馈实验 10 · Common Deleveraging',
    title: '五家“独立”基金使用同类限制时，局部卖出怎样合成为 −2% 教学冲击？',
    brief: '五家 market-neutral 基金各因同类风险限制卖出共同多头篮子 1,000 万元；这些卖单在题设窗口内可相加。完整减仓还会在别处回补各自空头腿，但本题只隔离共同多头腿对该篮子的局部冲击。按正文符号约定，净买入 Q>0、净卖出 Q<0；冻结 Λ=+0.04%/百万元，所以每 100 万元净卖出令篮子收益变化 −0.04%。Λ 已概括题设中的对手方承接与局部价格反应；不另加入额外恢复性净买盘、cross-impact、非线性或时间衰减。',
    facts: [
      { label: 'Funds', value: '5', note: '独立决策、相似规则' },
      { label: 'Sell each', value: '¥10m', note: '同一篮子' },
      { label: 'Lambda', value: '+0.04% / ¥1m', note: 'Q<0 表示净卖出' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '总卖出 1,000 万元，冲击 −0.4%', diagnosis: '漏掉了五家订单在同一状态下合并进入市场。' },
      { id: 'b', label: '总卖出 5,000 万元，教学冲击 −2.0%', diagnosis: '正确。共同持仓和共同约束把分散主体的动作叠加成市场级订单流。' },
      { id: 'c', label: '净冲击为 0，因为组合起初 market neutral', diagnosis: 'Market neutral 描述组合暴露，不会让平仓订单自动由外部买盘抵消。' },
    ],
    calculation: '卖出幅度=5×10m=50m，因此 signed Q=−50 个“百万元”；ΛQ=(+0.04%)×(−50)=−2.0%。',
    reveal: '线性 impact 只是因果桥：现实 Λ 会随深度、时间、方向、参与者和反应内生变化。完整 market-neutral 减仓通常同时包含“卖出多头”和“回补空头”，两边可能作用于不同资产并产生 cross-impact；本题只计算共同多头篮子的局部卖压。要证明 crowded unwind，必须观察共同暴露、约束收紧、真实订单和价格反馈，而不是只凭同步亏损。',
    revisit: '回看 44–52「共同减仓、拥挤、案例、反例与识别」。',
    staticTwin: {
      title: '变式 10 · 更多主体、更小单体订单',
      prompt: '只看共同多头腿：八家基金各卖出 600 万元；按 Q<0 表示卖出，冻结 Λ=+0.025%/百万元。求总卖出和线性冲击。完整减仓中的空头回补不计入本题。',
      answer: '卖出幅度=8×6m=48m，因此 signed Q=−48 个百万元单位；ΛQ=(+0.025%)×(−48)=−1.2%。',
    },
  },
];
