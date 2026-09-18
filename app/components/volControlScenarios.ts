export type VolControlMode = 'estimator' | 'orders';
export type VolControlChoice = 'a' | 'b' | 'c';

export type VolControlScenario = {
  id: string;
  mode: VolControlMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: VolControlChoice; label: string; diagnosis: string }[];
  correct: VolControlChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const volControlModes: { id: VolControlMode; label: string; title: string; description: string }[] = [
  { id: 'estimator', label: 'MODE A', title: '风险估计与目标暴露', description: '冻结信息时点，从年化、EWMA、clip 和冲击后权重得到目标。' },
  { id: 'orders', label: 'MODE B', title: '带符号订单与系统反馈', description: '加入空头、相关性、现金腿、成本和 focal-cohort 成交流。' },
];

export const volControlScenarios: VolControlScenario[] = [
  {
    id: 'annualization-clock',
    mode: 'estimator',
    label: '估计实验 01 · Annualization',
    title: '日波动怎样在冻结时钟下转换成年化波动？',
    brief: '截至 t−1 已知的日波动为 1%，一年冻结为 D=252 个同频交易日；题设采用独立同分布下的平方根时间约定，只做单位转换，不声称该约定在自相关、季节性或跳跃下无条件成立。',
    facts: [
      { label: 'Daily vol', value: '1%', note: 'σΔ=0.01' },
      { label: 'Daily variance', value: '0.0001', note: 'vΔ=σΔ²' },
      { label: 'Annualizer', value: 'D=252', note: '冻结交易时钟' },
    ],
    options: [
      { id: 'a', label: '年化方差 0.0252；年化波动 252%', diagnosis: '方差乘 252 正确，但标准差应乘 √252，而不是乘 252。' },
      { id: 'b', label: '年化方差 0.0252；年化波动约 15.875%', diagnosis: '正确。先年化方差，再取平方根。' },
      { id: 'c', label: '年化方差 0.0001；年化波动 1%', diagnosis: '仍停留在日频，没有执行题设的年化转换。' },
    ],
    correct: 'b',
    calculation: 'vann=252×0.01²=0.0252；σann=0.01×√252=0.158745≈15.875%。',
    reveal: '年化不是给波动贴标签，而是把风险估计与目标放到同一时间单位。只要时钟、缺失日或收益依赖结构改变，转换约定就必须重审。',
    revisit: '回看 05–07「四种波动、单位与信息截止」。',
    staticTwin: {
      title: '变式 01 · 周频年化',
      prompt: '截至决策前的周波动为 2%，冻结一年 D=52 周并采用平方根时间约定。求年化方差与年化波动。',
      answer: 'vann=52×0.02²=0.0208；σann=0.02×√52≈0.144222，即 14.422%。',
    },
  },
  {
    id: 'causal-ewma',
    mode: 'estimator',
    label: '估计实验 02 · Causal EWMA',
    title: '最新已知冲击怎样进入下一次风险预测？',
    brief: '上一期日方差预测为 0.0001，λ=0.94；最新且已完整可知的 t−1 收益为 −4%，均值冻结为 0，D=252。用 v(t|t−1)=λv(t−1|t−2)+(1−λ)r(t−1)² 更新；该结果只能服务 t 或更晚的目标。',
    facts: [
      { label: 'Old daily variance', value: '0.0001', note: '截至更早时点' },
      { label: 'Latest return', value: '−4%', note: '必须先平方' },
      { label: 'Decay', value: 'λ=0.94', note: '旧值权重' },
    ],
    options: [
      { id: 'a', label: '新方差 −0.002306，波动无法取实数', diagnosis: '把带符号收益直接放进方差递推；方差冲击项应使用平方。' },
      { id: 'b', label: '新方差 0.001510；年化波动约 61.686%', diagnosis: '把 λ 与 1−λ 对旧值和新冲击的权重倒置。' },
      { id: 'c', label: '新方差 0.000190；年化波动约 21.882%', diagnosis: '正确。负收益的符号在平方后消失，但时点不能倒流。' },
    ],
    correct: 'c',
    calculation: 'v=0.94×0.0001+0.06×(−0.04)²=0.000190；σann=√(252×0.000190)=0.218815≈21.882%。',
    reveal: '风险估计使用已实现冲击，却不是同时段预言。用 t−1 收盘冲击更新出的风险，只能改变下一可执行时点的 target。',
    revisit: '回看 07–12「因果时钟、EWMA、聚集与速度」。',
    staticTwin: {
      title: '变式 02 · 正收益也提高平方冲击',
      prompt: '旧日方差 0.000225，λ=0.90，最新已知收益 +3%，均值为 0，D=252。求新日方差与年化波动。',
      answer: 'v=0.90×0.000225+0.10×0.03²=0.0002925；σann=√(252×0.0002925)≈27.150%。',
    },
  },
  {
    id: 'clip-leverage-cap',
    mode: 'estimator',
    label: '目标实验 03 · Clip 与 Leverage Cap',
    title: '为什么写着“12% 目标”却只能得到 7.5% 的预测波动？',
    brief: '单位 risky basket 预测波动为 5%，目标为 12%，gmin=0、gmax=1.5，现金风险冻结为 0。Raw multiplier=目标/预测风险，随后必须先通过 clip；cash weight 定义为 1−g。',
    facts: [
      { label: 'Target vol', value: '12%', note: '与预测同口径' },
      { label: 'Basket vol', value: '5%', note: '未缩放' },
      { label: 'Leverage cap', value: 'gmax=1.5', note: '硬上限' },
    ],
    options: [
      { id: 'a', label: 'g*=1.5；cash=−50%；预测组合波动 7.5%', diagnosis: '正确。上限绑定，目标不是结果保证。' },
      { id: 'b', label: 'g*=2.4；cash=−140%；预测组合波动 12%', diagnosis: '只算 raw multiplier，忽略了题设硬上限。' },
      { id: 'c', label: 'g*=0.4167；cash≈58.33%；预测组合波动≈2.08%', diagnosis: '把预测波动与目标波动的比率写反。' },
    ],
    correct: 'a',
    calculation: 'graw=12%/5%=2.4；g*=clip(2.4;0,1.5)=1.5；cash=1−1.5=−0.5；预测波动=1.5×5%=7.5%。',
    reveal: '目标波动是一条暴露规则。Leverage cap、floor、跳跃、现金腿和估计误差都可能让最终风险偏离目标。',
    revisit: '回看 14–19「倍率、上下限、fallback 与现金腿」。',
    staticTwin: {
      title: '变式 03 · 最低暴露绑定',
      prompt: '目标 10%、预测 25%，gmin=0.5、gmax=1.5，现金风险为 0。求 raw multiplier、最终 g、cash weight 和预测组合波动。',
      answer: 'graw=0.4，但 floor 绑定后 g=0.5；cash=50%；预测组合波动=0.5×25%=12.5%，高于目标。',
    },
  },
  {
    id: 'post-shock-drift',
    mode: 'estimator',
    label: '权重实验 04 · Post-shock Actual',
    title: '目标不变时，价格下跌为什么反而可能要求买入？',
    brief: '期初 NAV=1,000 万元，risky asset 60%、cash 40%，现金收益为 0；risky 当期下跌 20%。下一次 target 仍为 60%，无成本。订单必须从冲击后实际权重出发，而不是从上一期 target 出发。',
    facts: [
      { label: 'Opening NAV', value: '¥10m', note: 'risky 6m / cash 4m' },
      { label: 'Risky return', value: '−20%', note: '先形成权重漂移' },
      { label: 'New target', value: '60%', note: '目标本身未变' },
    ],
    options: [
      { id: 'a', label: '漂移权重 40%；买入 176 万元', diagnosis: '把 −20% 收益直接当作权重减少 20 个百分点；即使沿用这个错误权重，也应按新 NAV 计算 40% actual 与 60% target 的金额差。' },
      { id: 'b', label: '漂移权重约 54.545%；买入 48 万元', diagnosis: '正确。先更新 risky value 与 NAV，再恢复 60% target。' },
      { id: 'c', label: '漂移权重仍为 60%；不交易', diagnosis: '忽略了 risky 与 cash 回报不同造成的实际权重漂移。' },
    ],
    correct: 'b',
    calculation: 'risky−=6m×0.8=4.8m；NAV−=4.8m+4m=8.8m；w−=4.8/8.8=54.545%；target amount=8.8m×60%=5.28m；order=+0.48m。',
    reveal: 'Vol-control 的真实订单不是“新 target 减旧 target”，而是“新 target amount 减冲击后 actual amount”。漂移本身可以抵消甚至反转风险规则隐含的交易方向。',
    revisit: '回看 20–24「漂移权重、target−actual 与外部现金流」。',
    staticTwin: {
      title: '变式 04 · 75% 目标的再平衡',
      prompt: '期初 NAV=800 万元，risky 75%、cash 25%，risky 下跌 10%，现金收益 0；新 target 仍为 75%。求漂移权重和订单金额。',
      answer: 'risky−=600×0.9=540 万，NAV−=740 万，w−=72.973%；target=555 万，因此买入 15 万元。',
    },
  },
  {
    id: 'up-jump-sell',
    mode: 'estimator',
    label: '反例实验 05 · 上涨后卖出',
    title: '波动冲击为什么可以在价格上涨后生成卖单？',
    brief: '期初 NAV=1,000 万元，risky 60%、cash 40%；risky 上涨 20%，cash return=0。随后预测波动升至 20%、目标 10%，无 clip，因此新 target weight=50%。计算冲击后 actual 再求订单。',
    facts: [
      { label: 'Opening risky', value: '¥6m', note: '60% weight' },
      { label: 'Risky return', value: '+20%', note: '上涨也可提高平方波动' },
      { label: 'New target', value: '50%', note: '10% / 20%' },
    ],
    options: [
      { id: 'a', label: '买入 120 万元，因为 risky 上涨', diagnosis: '把价格方向误当成 vol-control 的方向预测。' },
      { id: 'b', label: '卖出 220 万元', diagnosis: '用旧 NAV 计算新 target，忽略上涨后的权益。' },
      { id: 'c', label: '卖出 160 万元', diagnosis: '正确。上涨后的 risky amount 为 720 万，新 NAV 为 1,120 万，50% target 只有 560 万。' },
    ],
    correct: 'c',
    calculation: 'risky−=6m×1.2=7.2m；NAV−=7.2m+4m=11.2m；target=11.2m×50%=5.6m；order=5.6−7.2=−1.6m。',
    reveal: '风险缩放对测得风险是反向的，却不必与刚刚的价格方向同向。上涨与下跌都可能通过平方收益提高风险估计；订单符号还取决于冲击后 actual。',
    revisit: '回看 21–23 与 41「卖单条件、空头边界与三种顺周期」。',
    staticTwin: {
      title: '变式 05 · 小幅上涨后的降权',
      prompt: '期初 NAV=2,000 万元，risky 70%、cash 30%，cash return=0；risky 上涨 5%。新目标波动 9%、预测 15%，故 target=60%。求新 NAV、target amount 与订单。',
      answer: 'risky−=1,400×1.05=1,470 万，NAV−=2,070 万；target=1,242 万；卖出 228 万元。',
    },
  },
  {
    id: 'short-cover',
    mode: 'orders',
    label: '符号实验 06 · Short De-risking',
    title: '空头风险缩小时，为什么真实订单是买入回补？',
    brief: '这是外生给定为空头的风险 overlay，不涉及趋势信号。期初 NAV=1,000 万元，signed risky weight=−40%、cash=140%；risky 上涨 10%。新风险 target 要求 signed weight=−20%，现金收益和成本为 0。',
    facts: [
      { label: 'Opening short', value: '−¥4m', note: 'signed exposure' },
      { label: 'Risky return', value: '+10%', note: '空头亏损' },
      { label: 'New target', value: '−20%', note: '绝对风险减半' },
    ],
    options: [
      { id: 'a', label: '买入回补 248 万元', diagnosis: '正确。负仓位从 −440 万变成目标 −192 万，需要正方向订单。' },
      { id: 'b', label: '继续卖出 248 万元', diagnosis: '把“减少空头绝对值”误作继续增加空头。' },
      { id: 'c', label: '买入 200 万元', diagnosis: '只比较旧目标百分比，忽略了价格损失、当前 NAV 和漂移仓位。' },
    ],
    correct: 'a',
    calculation: 'short amount−=−4m×1.1=−4.4m；NAV−=14m−4.4m=9.6m；target=−20%×9.6m=−1.92m；order=−1.92−(−4.4)=+2.48m。',
    reveal: '“波动上升导致 gross 收缩”不能直接翻译成卖压。对空头而言，减绝对风险是买入；多资产组合必须逐市场保留持仓符号。',
    revisit: '回看 22–24「带符号暴露与 target−actual」。',
    staticTwin: {
      title: '变式 06 · 下跌后的空头获利与回补',
      prompt: '期初 NAV=2,000 万元，signed risky=−30%、cash=130%，cash return=0；risky 下跌 20%，新 target=−10%，无成本。求交易前 NAV、目标金额与订单。',
      answer: 'short amount−=−600×0.8=−480 万；NAV−=2,600−480=2,120 万；target=−212 万；order=+268 万，即买入回补。',
    },
  },
  {
    id: 'correlation-shock',
    mode: 'orders',
    label: '组合实验 07 · Correlation Shock',
    title: '个体波动不变时，相关性上升怎样触发共同减仓？',
    brief: '两个 long risky sleeve 的固定 composition 为 (0.5,0.5)，各自年化波动 10%。初始相关性 ρ=0，组合已按 10% target 配置，NAV=1,000 万元；随后 ρ 瞬间升至 1，个体波动、价格和权益均不变，无 cap。',
    facts: [
      { label: 'Sleeve vols', value: '10% / 10%', note: '保持不变' },
      { label: 'Correlation', value: '0 → 1', note: '只改协方差' },
      { label: 'Target vol', value: '10%', note: 'composition 固定' },
    ],
    options: [
      { id: 'a', label: 'Gross 不变，因为个体波动没有变化', diagnosis: '漏掉了组合方差中的协方差项。' },
      { id: 'b', label: 'Gross 从约 1,414.2 万降至 1,000 万；每只卖约 207.1 万', diagnosis: '正确。相关性拿走分散后，总倍率从 √2 降至 1。' },
      { id: 'c', label: '新 gross 约 707.1 万；总卖约 707.1 万', diagnosis: '漏掉 0.5 composition 权重，也漏掉 ρ=1 时的协方差项。' },
    ],
    correct: 'b',
    calculation: 'ν0=√(0.5²×0.1²+0.5²×0.1²)=7.071%；g0=10/7.071=1.4142。ρ=1 后 ν1=10%，g1=1；总卖=10m×(1.4142−1)=4.142m，每只约 2.071m。',
    reveal: '风险不是市场数量，而是协方差状态。2.11 只让固定 composition 同比缩放；若基础权重也按 risk parity 改变，应交给 2.12。',
    revisit: '回看 30–32「多资产协方差、同比缩放与 Risk Parity 边界」。',
    staticTwin: {
      title: '变式 07 · 相关性升至 0.5',
      prompt: 'NAV=2,000 万元，其他参数相同，但相关性从 0 升至 0.5。求新组合波动、倍率、总卖出和每只卖出。',
      answer: 'ν1=√(0.0075)=8.6603%；g1=10/8.6603=1.1547。旧 gross=2,828.4 万，新 gross=2,309.4 万，总卖约 519.0 万，每只约 259.5 万。',
    },
  },
  {
    id: 'inverse-vol-variance',
    mode: 'orders',
    label: '构造实验 08 · Inverse-vol vs. Inverse-variance',
    title: '为什么“按波动倒数”与“按方差倒数”会得到不同组合？',
    brief: '两项资产波动分别为 10% 与 20%。只比较两个归一化基础权重：inverse-vol 使用 1/σ，inverse-variance 使用 1/σ²；本题不加入协方差或第二层 target-vol scaling。',
    facts: [
      { label: 'Asset 1 vol', value: '10%', note: '低波动' },
      { label: 'Asset 2 vol', value: '20%', note: '高波动' },
      { label: 'Rules', value: '1/σ vs 1/σ²', note: '先分别归一化' },
    ],
    options: [
      { id: 'a', label: '两种规则都得到 50% / 50%', diagnosis: '忽略了两项资产风险尺度不同。' },
      { id: 'b', label: 'Inverse-vol 为 80% / 20%；inverse-variance 为 66.67% / 33.33%', diagnosis: '把两个规则的权重强度交换。' },
      { id: 'c', label: 'Inverse-vol 为 66.67% / 33.33%；inverse-variance 为 80% / 20%', diagnosis: '正确。平方倒数对低波动资产倾斜更强。' },
    ],
    correct: 'c',
    calculation: 'Inverse-vol 原始分数=(10,5)，归一化=(2/3,1/3)；inverse-variance 原始分数=(100,25)，归一化=(0.8,0.2)。',
    reveal: 'Academic volatility-managed factor 常见 inverse-variance 构造，risk-control index 常见 target/inverse-vol multiplier；二者不能用同一个名称代替，也都不自动等于协方差意义上的 risk parity。',
    revisit: '回看 34–35 与 49「研究组合、inverse-variance 与证据争论」。',
    staticTwin: {
      title: '变式 08 · 12% 与 18%',
      prompt: '两资产波动为 12% 与 18%。分别求归一化 inverse-vol 与 inverse-variance 权重。',
      answer: 'Inverse-vol 为 60%/40%；inverse-variance 第一项权重=(1/0.12²)/[(1/0.12²)+(1/0.18²)]=9/13≈69.231%，第二项 30.769%。',
    },
  },
  {
    id: 'cash-leg-cost',
    mode: 'orders',
    label: '现金实验 09 · Cash Leg 与 Cost',
    title: '卖出风险资产以后，现金和 NAV 怎样同时更新？',
    brief: '本题的 risky amount 是全额付款的现货／基金份额市值，不是衍生品 notional。交易前 NAV=1,000 万元，risky amount=1,200 万元、cash=−200 万元。新 target risky amount 按交易前 NAV 冻结为 800 万元；全部卖出成交，成本为成交额 25 bp，成交期间无价格变化、无外部流，成本后不迭代重算 target。',
    facts: [
      { label: 'Pre-trade balance', value: 'Risky 12m / cash −2m', note: 'NAV 10m' },
      { label: 'Target risky', value: '¥8m', note: '先冻结金额' },
      { label: 'Trading cost', value: '25 bp', note: '只计真实 fill' },
    ],
    options: [
      { id: 'a', label: '卖 400 万；成本 1 万；cash=199 万；NAV=999 万；risky weight≈80.080%', diagnosis: '正确。卖出增加现金，成本减少 NAV；不在成本后迭代 target。' },
      { id: 'b', label: 'Cash=200 万；NAV=1,000 万；risky weight=80%', diagnosis: '漏掉了明确的成交成本。' },
      { id: 'c', label: 'Cash=−601 万；NAV=199 万', diagnosis: '把卖出风险资产错误记成现金流出。' },
    ],
    correct: 'a',
    calculation: 'order=8m−12m=−4m；cost=4m×0.0025=0.01m；cash+=−2m−(−4m)−0.01m=1.99m；NAV+=8m+1.99m=9.99m；weight=8/9.99≈80.080%。',
    reveal: 'Cash leg 不是残余注脚：它承接卖出、融资、利息和成本。指数公式、基金账本与保险 hedge book 若使用不同现金口径，结果就不能直接比较。',
    revisit: '回看 18–19 与 28「现金／融资腿、TR/ER 与成交成本」。',
    staticTwin: {
      title: '变式 09 · 正现金账户',
      prompt: '本题 risky 是全额付款的现货／基金份额市值。交易前 NAV=2,000 万元，risky=1,400 万、cash=600 万；target risky=1,000 万，全部成交，成本 10 bp；成交期间无价格变化、无外部流，成本后不迭代 target。求成本、cash、NAV 与成交后 risky weight。',
      answer: '卖出 400 万；成本 0.4 万；cash=999.6 万；NAV=1,999.6 万；risky weight=1,000/1,999.6≈50.010%。',
    },
  },
  {
    id: 'cohort-impact',
    mode: 'orders',
    label: '系统实验 10 · Cohort Flow 与 Impact',
    title: '规则隐含卖单怎样升级成可检验的群体成交流？',
    brief: '事前定义 focal cohort 包含 6 家 vol-control 基金；集合外交易对手不因成交而加入，若某对手本身也属于 cohort，则必须按自身带符号 fill 纳入。每家交易前 NAV=5 亿元，实际 risky weight=70%、target=50%，所有减仓在同一市场和窗口成交。Q 以 1 亿元为单位，Λ=0.25 bp/亿元，残差 u=+0.4 bp。',
    facts: [
      { label: 'Focal cohort', value: '6 funds × ¥500m', note: '集合事前冻结' },
      { label: 'Actual → target', value: '70% → 50%', note: '每家卖 ¥100m' },
      { label: 'Impact bridge', value: 'Λ=0.25 bp / ¥100m', note: 'u=+0.4 bp' },
    ],
    options: [
      { id: 'a', label: '把全市场交易双方相加，Q=0；价格变化 +0.4 bp', diagnosis: '改变了 estimand：把集合外对手方也加入后，所有成交会机械抵消。' },
      { id: 'b', label: 'Q=−6 亿元=−6 单位；价格变化 −1.1 bp', diagnosis: '正确。先求 focal cohort 的带符号真实成交，再加同量纲残差。' },
      { id: 'c', label: 'Q=+6 亿元；价格变化 +1.9 bp', diagnosis: '把卖出错误记成正号。' },
    ],
    correct: 'b',
    calculation: '每家 fill=500m×(50%−70%)=−100m；Q=6×(−100m)=−600m=−6 units；Rwin=0.25×(−6)+0.4=−1.1 bp。Rwin 是冻结执行窗口的收益，不是收益率的一阶差分。',
    reveal: '目标权重只给潜在订单；本题另外冻结全部成交和同窗口，才得到 Q。现实因果识别仍须处理外部主体、订单簿事件、共同新闻、深度和 u 与 Q 的相关性。',
    revisit: '回看 42–44「反馈、稳定通道与因果识别」。',
    staticTwin: {
      title: '变式 10 · 更大降权与负残差',
      prompt: 'Focal cohort 有 4 家基金，每家 NAV=7.5 亿元，actual=90%、target=60%，同市场同窗口全部成交；Λ=0.15 bp/亿元，u=−0.25 bp。求 cohort Q 与冻结执行窗口收益 Rwin。',
      answer: '每家卖 7.5亿×30%=2.25 亿元；Q=−9 亿元=−9 units；Rwin=0.15×(−9)−0.25=−1.60 bp。',
    },
  },
];
