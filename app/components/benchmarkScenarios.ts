export type BenchmarkMode = 'ledger' | 'inference';
export type BenchmarkChoice = 'a' | 'b' | 'c';

export type BenchmarkScenario = {
  id: string;
  mode: BenchmarkMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: BenchmarkChoice; label: string; diagnosis: string }[];
  correct: BenchmarkChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const benchmarkModes: { id: BenchmarkMode; label: string; title: string; description: string }[] = [
  { id: 'ledger', label: 'MODE A', title: '把基准翻译成可核算的相对状态', description: '冻结收益口径、权重、窗口和协方差，计算 benchmark return、active weight、tracking difference、tracking error、Active Share 与 information ratio。' },
  { id: 'inference', label: 'MODE B', title: '把相对状态翻译成有边界的结论', description: '区分指标、授权、target、order、fill 与因果证据，判断共同基准何时仍不足以证明被动化、从众或机械价格压力。' },
];

export const benchmarkScenarios: BenchmarkScenario[] = [
  {
    id: 'policy-benchmark-return', mode: 'ledger', label: '账本实验 01 · Policy Benchmark',
    title: '总组合赚了 1.10%，相对 60/40 policy benchmark 究竟贡献了多少？',
    brief: '资产所有者事前规定 policy benchmark 为 60% 股票指数、40% 债券指数，按期初权重计量且本期不再平衡。股票指数本期总收益 2%，债券指数 −1%，总组合同口径收益 1.10%。',
    facts: [
      { label: 'Policy weights', value: '60% equity · 40% bond', note: '期初权重，期内不重置' },
      { label: 'Index returns', value: '+2.00% · −1.00%', note: '同币种、同总收益口径' },
      { label: 'Portfolio return', value: '+1.10%', note: '与 policy benchmark 同期间' },
    ],
    options: [
      { id: 'a', label: 'Benchmark return 为 0.50%，active return 为 0.60%', diagnosis: '把两个资产收益简单平均了，忽略 60/40 的事前权重。' },
      { id: 'b', label: 'Benchmark return 为 1.10%，所以 active return 为 0', diagnosis: '把组合自己的实现收益当成 policy benchmark，消除了本来要评价的差异。' },
      { id: 'c', label: 'Benchmark return 为 0.80%，active return 为 +0.30%', diagnosis: '正确。先按 policy weights 构造反事实，再用组合收益减去它。' },
    ],
    correct: 'c',
    calculation: 'R_B=60%×2%+40%×(−1%)=0.80%；A=R_P−R_B=1.10%−0.80%=+0.30%。',
    reveal: '同一经理可以跑赢自己的 sleeve benchmark，而总基金仍落后 policy benchmark；必须先冻结评价层级和权重规则。',
    revisit: '回看 04–11 与 21–25「基准角色、收益口径与 Active Return」。',
    staticTwin: { title: '变式 01 · 70/30 policy benchmark', prompt: 'Policy benchmark 为 70% 股票、30% 债券；股票指数 −2%，债券指数 +1%，组合收益 −0.90%。求 benchmark return 与 active return。', answer: 'R_B=70%×(−2%)+30%×1%=−1.10%；active return=−0.90%−(−1.10%)=+0.20%。' },
  },
  {
    id: 'target-order-fill-holding', mode: 'ledger', label: '账本实验 02 · Target / Order / Fill',
    title: '经理批准 65/34/1 的目标，为什么风险账本仍只能写 63/36/1？',
    brief: 'AUM 为 $100m；benchmark 与交易前实际组合都是股票 $60m、债券 $40m、现金 0。经理批准 target：股票 $65m、债券 $34m、现金 $1m，随后下单买股票 $5m、卖债券 $6m；最终只买到 $3m、卖出 $4m。价格不变并忽略费用。',
    facts: [
      { label: 'Before trade', value: '$60m / $40m / $0m', note: '股票 / 债券 / 现金' },
      { label: 'Approved target', value: '$65m / $34m / $1m', note: '意图，不是持仓' },
      { label: 'Actual fills', value: 'buy $3m · sell $4m', note: '未成交部分仍是订单状态' },
    ],
    options: [
      { id: 'a', label: '实际组合为 63/36/1，active weights 为 +3%/−4%/+1%', diagnosis: '正确。只有成交改变持仓，净卖出 $1m 留在现金。' },
      { id: 'b', label: '实际组合已经是 65/34/1，因为 target 已获批准', diagnosis: '批准只改变授权目标；未成交的 $2m 买单和 $2m 卖单不能进入 actual holding。' },
      { id: 'c', label: '实际组合为 63/34/3，因为未成交债券应直接变成现金', diagnosis: '债券卖单未成交的 $2m 仍是债券持仓，不是现金。' },
    ],
    correct: 'a',
    calculation: '股票=$60m+$3m=$63m；债券=$40m−$4m=$36m；现金=$4m−$3m=$1m。相对 60/40/0 benchmark 的实际主动权重为 +3%/−4%/+1%。',
    reveal: 'Target 表达希望达到的状态，order 表达指令，fill 才改变 actual exposure；风险报告可以另列 target scenario，但不能替代主账本。',
    revisit: '回看 17–20 与 34–35「Benchmark Passport、状态机与超限治理」。',
    staticTwin: { title: '变式 02 · 部分成交后的真实权重', prompt: 'Benchmark 与初始组合均为 50/50/0；target 为 54/44/2，订单买第一资产 4、卖第二资产 6；实际买到 2.5、卖出 4。价格不变。求实际组合与 active weights。', answer: '实际组合为 52.5/46/1.5；相对 50/50/0 的 active weights 为 +2.5%/−4%/+1.5%。未成交部分不改变持仓。' },
  },
  {
    id: 'ex-post-tracking-error', mode: 'ledger', label: '账本实验 03 · Ex-post TE',
    title: '平均 active return 为零，为什么 tracking error 仍不是零？',
    brief: '四个季度主动收益依次为 +1%、−1%、+1%、−1%。题设规定 ex-post tracking error 使用 n−1 样本标准差，并仅在无自相关、频率稳定的教学假设下乘 √4 年化。',
    facts: [
      { label: 'Active-return path', value: '+1% · −1% · +1% · −1%', note: '四个季度，算术口径' },
      { label: 'Estimator', value: 'sample SD · n−1', note: '先去样本均值' },
      { label: 'Annualization', value: '×√4', note: '题设明确无自相关近似' },
    ],
    options: [
      { id: 'a', label: '季度 TE 为 1%，年化 TE 为 2%', diagnosis: '把四个观测当总体并使用 n 作分母；这不符合题设的 n−1 约定。' },
      { id: 'b', label: '季度 TE 约 1.1547%，年化 TE 约 2.3094%', diagnosis: '正确。平均值为零不消除主动收益路径的离散。' },
      { id: 'c', label: '平均主动收益为零，所以季度和年化 TE 都为零', diagnosis: '把 tracking difference 的中心与 tracking error 的离散混为一谈。' },
    ],
    correct: 'b',
    calculation: 'Ā=0；TE_q=√[(1²+1²+1²+1²)/(4−1)]%=1.1547%；TE_ann≈1.1547%×√4=2.3094%。',
    reveal: 'Tracking difference 回答平均相对方向，centered TE 回答围绕该均值的波动；零均值可以与高波动同时成立。',
    revisit: '回看 23–28「Active Return、Tracking Difference、样本 TE 与年化条件」。',
    staticTwin: { title: '变式 03 · 月度 TE 的样本年化', prompt: '四个月主动收益为 +0.5%、−0.5%、+0.5%、−0.5%；用 n−1 样本标准差，并在题设无自相关假设下乘 √12。求月度与简化年化 TE。', answer: '月度 TE=√[(4×0.5²)/(4−1)]%=0.57735%；简化年化 TE=0.57735%×√12=2.00%。' },
  },
  {
    id: 'ex-ante-tracking-error', mode: 'ledger', label: '账本实验 04 · Ex-ante TE',
    title: '主动权重一正一负且相加为零，为什么仍有 1.2649% 的相对风险？',
    brief: '两个资产的主动权重为 x_A=+10%、x_B=−10%；年化波动率分别为 12% 与 8%，相关系数 0.25。题设忽略现金、其他资产、因子映射误差和未来交易。',
    facts: [
      { label: 'Active weights', value: '+10% · −10%', note: '和为零不代表风险抵消' },
      { label: 'Annual volatilities', value: '12% · 8%', note: '同一风险期限' },
      { label: 'Correlation', value: 'ρ=0.25', note: '必须进入交叉项' },
    ],
    options: [
      { id: 'a', label: 'TE 为 2.00%，因为应把两项绝对风险相加', diagnosis: '忽略协方差，也没有正确处理一正一负的主动权重。' },
      { id: 'b', label: 'TE 为 0，因为 +10% 与 −10% 主动权重相加为零', diagnosis: '净投资为零不等于两项收益完全相同；只有特定协方差结构才可能完全抵消。' },
      { id: 'c', label: 'Ex-ante TE 约为 1.2649%', diagnosis: '正确。协方差让两项主动暴露部分对冲，但没有完全抵消。' },
    ],
    correct: 'c',
    calculation: 'TE²=0.10²×0.12²+(−0.10)²×0.08²+2×0.10×(−0.10)×0.25×0.12×0.08=0.000160；TE=1.2649%。',
    reveal: 'Ex-ante TE 是当前主动权重在预测协方差模型下的条件波动，不是损失上限，也不是未来实现 TE 的保证。',
    revisit: '回看 29–33「Ex-ante TE、协方差、因子分解与模型风险」。',
    staticTwin: { title: '变式 04 · 另一组协方差账本', prompt: '主动权重为 +8%、−8%，波动率 15%、10%，相关系数 0.5。忽略其他暴露，求 ex-ante TE。', answer: 'TE²=0.08²×0.15²+(−0.08)²×0.10²+2×0.08×(−0.08)×0.5×0.15×0.10=0.000112；TE≈1.0583%。' },
  },
  {
    id: 'active-share-information-ratio', mode: 'ledger', label: '账本实验 05 · Active Share / IR',
    title: '同一组相对数据怎样分别回答“偏离多少资本”和“每单位相对风险赚多少”？',
    brief: '三项资产的实际组合权重为 50%/20%/30%，benchmark 为 40%/40%/20%。同口径年化平均主动收益为 1.8%，年化 ex-post TE 为 3.0%。题设为 long-only、全额投资、同一资产全集。',
    facts: [
      { label: 'Portfolio weights', value: '50% · 20% · 30%', note: '三项资产，全额投资' },
      { label: 'Benchmark weights', value: '40% · 40% · 20%', note: '同一证券宇宙' },
      { label: 'Active return / TE', value: '1.8% / 3.0%', note: '同为年化、同 benchmark' },
    ],
    options: [
      { id: 'a', label: 'Active Share 为 20%，information ratio 为 0.60', diagnosis: '正确。前者是绝对主动权重的一半，后者是平均主动收益除以 TE。' },
      { id: 'b', label: 'Active Share 为 40%，information ratio 为 0.60', diagnosis: '漏掉 Active Share 定义中的 1/2，因此把转移的资本计算了两次。' },
      { id: 'c', label: 'Active Share 为 20%，information ratio 为 1.67', diagnosis: '把 information ratio 的分子和分母颠倒了。' },
    ],
    correct: 'a',
    calculation: 'AS=½(|50−40|+|20−40|+|30−20|)%=20%；IR=1.8%/3.0%=0.60。',
    reveal: 'Active Share 不看协方差，IR 又依赖主动收益样本；二者都不能单独证明经理技能、产品身份或未来表现。',
    revisit: '回看 36–40「Active Share、二维关系与 Information Ratio」。',
    staticTwin: { title: '变式 05 · 低 Active Share 仍可有正 IR', prompt: '组合权重 45%/35%/20%，benchmark 50%/30%/20%；年化平均主动收益 0.8%，TE 1.6%。求 Active Share 与 IR。', answer: 'AS=½(5%+5%+0)=5%；IR=0.8%/1.6%=0.50。' },
  },
  {
    id: 'active-share-versus-te', mode: 'inference', label: '推断实验 01 · AS × TE',
    title: 'Active Share 30%、ex-ante TE 1% 能否同时成立？',
    brief: '组合用同行业、高相关的 B 股票替代 benchmark 中的 A 股票；证券层资本权重偏离较大，但行业、beta 与主要因子暴露近似抵消。经统一资产映射得到 Active Share 30%，当前风险模型给出 ex-ante TE 1%。',
    facts: [
      { label: 'Holding distance', value: 'Active Share 30%', note: '资本权重绝对偏离' },
      { label: 'Modeled active risk', value: 'Ex-ante TE 1%', note: '协方差加权结果' },
      { label: 'Substitution', value: 'same industry · high correlation', note: '因子暴露近似抵消' },
    ],
    options: [
      { id: 'a', label: '两个数字必有一个错误，因为 Active Share 与 TE 必须同方向变化', diagnosis: '两者测量对象不同；AS 不读取收益协方差。' },
      { id: 'b', label: '两个数字可以同时成立；AS 看资本偏离，TE 看协方差加权的相对收益风险', diagnosis: '正确。高 AS、低 TE 以及低 AS、高 TE 都可能存在。' },
      { id: 'c', label: 'TE 低已经证明组合属于 passive strategy', diagnosis: '策略身份来自 mandate、裁量与目标，不由单一事后或模型指标决定。' },
    ],
    correct: 'b',
    calculation: 'AS=½Σ|w−b| 只保存权重距离；TE=√(x′Σx) 还读取波动率和相关性。因此数值没有定义冲突。',
    reveal: '高偏离不必带来高风险，低相对风险也不等于没有主动决策；指标只能回答被定义的问题。',
    revisit: '回看 36–38「Active Share 的适用域与二维关系」。',
    staticTwin: { title: '变式 06 · 低 AS、高 TE', prompt: '某组合只有 5% Active Share，但全部偏离集中在一只高波动、与 benchmark 低相关的证券；模型给出明显较高 TE。两个指标是否矛盾？', answer: '不矛盾。AS 只说明转移了多少资本；偏离集中在高波动、低相关风险上时，小资本偏离也可产生较高 TE。' },
  },
  {
    id: 'tracking-difference-attribution', mode: 'inference', label: '推断实验 02 · Tracking Difference',
    title: '稳定落后 0.35% 是否已经证明经理作了失败的主动押注？',
    brief: '一只指数基金年度净收益相对 gross total-return index 的 tracking difference 为 −0.35%，ex-post TE 为 0.08%。已核对费用 −0.20%、预扣税口径差 −0.08%、交易与再平衡成本 −0.09%、证券借贷收入 +0.04%。',
    facts: [
      { label: 'Observed TD', value: '−0.35%', note: '基金净收益减 gross index' },
      { label: 'Ex-post TE', value: '0.08%', note: '主动收益围绕均值的波动' },
      { label: 'Known components', value: '−0.20−0.08−0.09+0.04%', note: '费用、税、成本、借贷' },
    ],
    options: [
      { id: 'a', label: '已证明经理作了 0.35% 的失败主动押注', diagnosis: '已知实施项几乎解释全部 TD；还没有证据把残差归为主观押注。' },
      { id: 'b', label: 'TE 很低，所以 tracking difference 必须为零', diagnosis: '稳定拖累可以产生负 TD 和接近零的 centered TE。' },
      { id: 'c', label: '已解释 −0.33%，残差 −0.02%；更符合稳定实施拖累，但仍需核对口径与残差', diagnosis: '正确。归因是可复核账本，不是把每个残差自动称为技能。' },
    ],
    correct: 'c',
    calculation: 'Explained TD=−0.20%−0.08%−0.09%+0.04%=−0.33%；residual=−0.35%−(−0.33%)=−0.02%。',
    reveal: 'Tracking difference 的中心可来自费用、税、现金、复制、借贷、衍生品和执行；只有这些口径对齐后，残差才有解释对象。',
    revisit: '回看 41–49「TD 归因、流量、执行、币种与非流动资产」。',
    staticTwin: { title: '变式 07 · 另一份实施拖累账本', prompt: '费用 −0.15%、税差 −0.05%、交易成本 −0.06%、借券收入 +0.03%，实际 TD 为 −0.25%。求解释值与残差。', answer: '解释值=−0.15%−0.05%−0.06%+0.03%=−0.23%；残差=−0.25%−(−0.23%)=−0.02%。' },
  },
  {
    id: 'policy-versus-manager-benchmark', mode: 'inference', label: '推断实验 03 · Benchmark Hierarchy',
    title: '股票经理跑赢 1.0%，为什么总基金仍可以落后 0.5%？',
    brief: '总基金 policy benchmark 是 60/40；股票 sleeve 的 manager benchmark 是一只股票指数。股票经理相对自己的 manager benchmark 跑赢 1.0%，但总基金相对 policy benchmark 落后 0.5%。口径和计算均已复核无误。',
    facts: [
      { label: 'Total-fund reference', value: '60/40 policy benchmark', note: '战略配置层' },
      { label: 'Equity manager result', value: '+1.0% vs equity benchmark', note: '经理 sleeve 层' },
      { label: 'Total-fund result', value: '−0.5% vs policy benchmark', note: '包含全部 sleeves 与 overlays' },
    ],
    options: [
      { id: 'a', label: '两个结果不矛盾；总基金还包含政策权重偏离、债券 sleeve、现金、币种和跨 sleeve 成本', diagnosis: '正确。不同评价层级的 active return 不能互相替代。' },
      { id: 'b', label: '两个结果互相矛盾，其中一个必然算错', diagnosis: '忽略 manager benchmark 与 policy benchmark 的层级和机会集不同。' },
      { id: 'c', label: '股票经理跑赢已经保证总基金必然跑赢', diagnosis: '一个 sleeve 的正贡献可能被资产配置、其他经理、overlay 或成本抵消。' },
    ],
    correct: 'a',
    calculation: '这是层级判断而非缺失算术：Equity sleeve active return ≠ total-fund active return；总结果还需完整 allocation、其他 sleeves、cash、FX 与 costs 账本。',
    reveal: 'Policy benchmark 表达资产所有者的战略风险坐标，manager benchmark 表达具体授权的相对坐标；二者可以连接，却不能折叠。',
    revisit: '回看 05–10 与 50–51「Benchmark 层级与 Attribution」。',
    staticTwin: { title: '变式 08 · 债券经理与总基金', prompt: '债券经理相对 manager benchmark 跑赢 0.4%，总基金却因 tactical allocation 与 currency overlay 相对 policy benchmark 落后 0.3%。两项是否冲突？', answer: '不冲突。经理层与总基金层使用不同机会集和归因账本；需要把 allocation、其他 sleeves、cash、FX 和成本连接后解释。' },
  },
  {
    id: 'index-inclusion-evidence', mode: 'inference', label: '推断实验 04 · Index Inclusion',
    title: '指数宣布纳入以后，现有证据最多能把结论推进到哪一层？',
    brief: '指数提供商宣布股票 X 将以 0.4% 权重纳入。研究者只观察到公告、市场上被动 AUM 的估计值，以及股票在生效日前上涨；没有基金流量、交易前持仓、target、order、fill 或可信对照数据。',
    facts: [
      { label: 'Methodology event', value: 'addition · target weight 0.4%', note: '未来 benchmark state 将改变' },
      { label: 'Observed price', value: 'rises before effective date', note: '同时可能有预期交易和新闻' },
      { label: 'Missing states', value: 'flow · holding · order · fill · control', note: '没有真实交易链证据' },
    ],
    options: [
      { id: 'a', label: '已证明所有被动基金都在生效日收盘完成买入，且涨幅全部由指数资金造成', diagnosis: '从目标权重越级跳到所有主体的真实成交和价格因果。' },
      { id: 'b', label: '可确认相关 benchmark target 将改变；真实订单、成交规模与因果价格效应仍缺证据', diagnosis: '正确。公告是目标层证据，不是 fill 或价格反事实。' },
      { id: 'c', label: '指数规则从不影响真实交易，所以公告没有任何经济含义', diagnosis: '过度否定。目标变化可以产生交易，但必须继续验证每一层。' },
    ],
    correct: 'b',
    calculation: '证据阶梯当前停在 methodology/benchmark target；要推进到 market impact，至少还需适用 AUM、事前持仓、资金流、目标缺口、actual fills、有限深度和可信价格对照。',
    reveal: '指数事件很适合提出因果问题，却不会自动提供因果答案；公告、生效、成交和反转必须使用不同时间戳。',
    revisit: '回看 44–46 与 54–55「Reconstitution、执行、证据阶梯与研究协议」。',
    staticTwin: { title: '变式 09 · 删除公告也不是 actual sale', prompt: '股票被指数删除且价格下跌，但研究者没有基金持仓、流量、订单和成交数据。最稳健的结论是什么？', answer: '可以确认适用 benchmark weight 将按方法下降；不能确认基金实际卖出量，更不能把全部跌价归因于指数资金。' },
  },
  {
    id: 'actual-exposure-state', mode: 'inference', label: '推断实验 05 · Actual Exposure',
    title: 'Target 低配 4%、实际只低配 1% 时，当前 ex-ante TE 应使用哪一个状态？',
    brief: '经理批准相对 benchmark 低配某行业 4%，并发出卖单。由于只部分成交且市场价格随后变化，风险时点的实际持仓相对 benchmark 只低配 1%。系统同时保存 target、order、fill 与 current holding。',
    facts: [
      { label: 'Approved target', value: 'industry active weight −4%', note: '决策目标' },
      { label: 'Actual holding', value: 'industry active weight −1%', note: '部分成交和价格变化之后' },
      { label: 'Risk question', value: 'current ex-ante TE', note: '当前真实 exposure 的模型预测' },
    ],
    options: [
      { id: 'a', label: '必须使用 −4%，因为 target 更能代表经理意图', diagnosis: '意图可以进入 target scenario，却不能替代当前持仓的实际风险。' },
      { id: 'b', label: '卖单已经发出，所以未成交部分应视作现金', diagnosis: 'Order 不是 fill；未成交证券仍在组合中。' },
      { id: 'c', label: '当前 actual TE 使用 −1% 与现有持仓；−4% 另列为 target scenario', diagnosis: '正确。主账本与前瞻情景同时保留，不能互相覆盖。' },
    ],
    correct: 'c',
    calculation: 'Current risk state 读取 actual holding，因此行业主动权重为 −1%；若计算“全部目标成交后”的预测，再单独以 −4% 构造 target TE。',
    reveal: '相对风险系统必须同时保存事实与意图：actual、in-flight 和 target 是不同状态；只有成交改变实际持仓。',
    revisit: '回看 18–20、29 与 34–35「Active Weight、状态机与风险治理」。',
    staticTwin: { title: '变式 10 · 已取消订单不改变实际暴露', prompt: '经理 target 超配 3%，买单随后被取消，实际持仓仍与 benchmark 相同。当前 actual active weight 与 target 记录应怎样写？', answer: '当前 actual active weight 为 0；+3% 可保留为历史 target，但取消的 order 不能记录为 fill、持仓或当前 TE exposure。' },
  },
];
