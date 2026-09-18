export type EndogenousDynamicsMode = 'engine' | 'evidence';
export type EndogenousDynamicsChoice = 'a' | 'b' | 'c';

export type EndogenousDynamicsScenario = {
  id: string;
  mode: EndogenousDynamicsMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: EndogenousDynamicsChoice; label: string; diagnosis: string }[];
  correct: EndogenousDynamicsChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
};

export const endogenousDynamicsModes: { id: EndogenousDynamicsMode; label: string; title: string; description: string }[] = [
  { id: 'engine', label: 'MODE A', title: '闭环账本与局部动力', description: '核算目标、约束、成交、财富、保证金、策略权重与局部稳定，不让变量或时钟越级。' },
  { id: 'evidence', label: 'MODE B', title: '交互、聚合与证据边界', description: '检查市场守恒、战略互补、信息时钟、非线性聚合和“局部稳定”的外推边界。' },
];

export const endogenousDynamicsScenarios: EndogenousDynamicsScenario[] = [
  {
    id: 'target-projection-order', mode: 'engine', label: '闭环实验 01 · Target → Projection',
    title: '无约束目标是 15 百万股，为什么真正目标只剩 6 百万股？',
    brief: '单资产、单期、小收益局部近似；题内按 A*=Wμ/(γσ²) 定义答案。基金净财富 W=120m，同一下一期的预期超额 log return μ=1%、log-return 方差 σ²=0.0004，风险厌恶 γ=5，股价 p=40；long gross-exposure cap 为 2×W，当前持仓 q=5m 股。忽略费用、short leg 和取整。',
    facts: [
      { label: 'Unconstrained rule', value: 'A*=Wμ/(γσ²)', note: 'A* 单位为货币' },
      { label: 'Feasible cap', value: '2×W=240m', note: '先投影货币敞口' },
      { label: 'Current position', value: '5m shares', note: '订单=可行目标股数−现仓' },
    ],
    options: [
      { id: 'a', label: '可行目标 6m 股；目标订单买入 1m 股', diagnosis: '正确。无约束货币敞口 600m 超过 240m 上限，投影后再除以 40，得到 6m 股。' },
      { id: 'b', label: '可行目标 15m 股；目标订单买入 10m 股', diagnosis: '这是无约束目标，没有执行 leverage projection。' },
      { id: 'c', label: '可行目标 3m 股；目标订单卖出 2m 股', diagnosis: '把风险上限或风险厌恶的方向处理错了；题设正预期并未要求降为半仓。' },
    ],
    correct: 'a',
    calculation: 'A*=120×0.01/(5×0.0004)=600m；Aᵗᵃʳ=min(600,2×120)=240m；qᵗᵃʳ=240/40=6m；d=6−5=+1m 股。',
    reveal: '均值—方差式只产生无约束目标，约束投影才产生可行目标。μ 与 σ²必须对应同一预测期；把 log-return moments 直接用于该式，是 small-return 下 simple return≈log return 的局部教学近似。若 W≤0、p≤0、γ≤0 或 σ²≤0，结果为 N/A；目标订单仍不等于已提交或已成交。',
    revisit: '回看 05–06、10–13「状态、单位、目标、约束、订单与成交」。',
    sourceIds: [25, 68, 80], staticSourceIds: [25, 80],
    staticTwin: { title: '变式 01 · 较低杠杆上限', prompt: '仍按题内小收益近似 A*=Wμ/(γσ²)：W=90m、同一预测期 μ=0.006、σ²=0.0009、γ=4、p=30、long cap=1.5×W、当前 4m 股。求无约束敞口、可行目标股数和目标订单。', answer: 'A*=90×0.006/(4×0.0009)=150m；cap=135m；目标 4.5m 股，因此目标订单买入 0.5m 股。μ 与 σ²均为同一期 log-return moments，公式按局部近似定义。' },
  },
  {
    id: 'capacity-residual', mode: 'engine', label: '闭环实验 02 · Capacity / Fill',
    title: '还想买 5 百万股时，为什么本期只能成交 2 百万股？',
    brief: '可行目标为 8m 股，当前持仓为 3m；下单前可用的预测匹配成交量为 10m 股，本策略单期参与上限 20%，题设提交部分全部成交。另问：若预测和实际匹配量均为零，应怎样记录成交与参与率？',
    facts: [
      { label: 'Desired gap', value: '8−3=5m', note: '尚未受执行容量约束' },
      { label: 'Capacity', value: '20%×10m=2m', note: '提交上限' },
      { label: 'Fill ratio', value: '100%', note: '只对已提交部分' },
    ],
    options: [
      { id: 'a', label: '买入 5m、残余 0；零成交量时参与率记 0', diagnosis: '跳过参与上限；零分母下参与率也不应伪造为 0。' },
      { id: 'b', label: '买入 2m、残余目标 3m；零成交量时成交 0、参与率 N/A', diagnosis: '正确。容量限制提交与成交，未完成差额继续成为下一期状态。' },
      { id: 'c', label: '买入 2m、残余目标 5m；零成交量时参与率为无穷大', diagnosis: '成交后现仓已变为 5m，距 8m 只剩 3m；0/0 不是无穷大。' },
    ],
    correct: 'b',
    calculation: 'd=5m；z=min(5,0.2×10)=2m；fill y=2m；qₜ₊₁=3+2=5m；residual=8−5=3m。V=0 时 z=y=0，而 |y|/V 为 N/A。',
    reveal: '实时容量必须来自下单时可知的预测或滞后量；把同周期最终成交量倒填进下单规则会偷看未来。残余订单、撤单与重新优化是不同的下一期状态。',
    revisit: '回看 07、12–13 与 54「多时钟、订单轨迹、残余状态和数据可用性」。',
    sourceIds: [25, 49], staticSourceIds: [25],
    staticTwin: { title: '变式 02 · 卖出容量', prompt: '目标 1m、当前 4m、预测匹配量 8m、参与上限 25%、提交部分全成交。求本期成交、期末持仓与残余目标；V=0 时怎样记录？', answer: '目标卖出 3m，但容量为 2m，因此成交 −2m，期末持仓 2m，仍需卖 1m；V=0 时成交 0、参与率 N/A。' },
  },
  {
    id: 'dealer-wealth-ledger', mode: 'engine', label: '闭环实验 03 · Dealer / Wealth',
    title: '客户支付了约 40.20 百万元，为什么财富反而增加约 1.21 百万元？',
    brief: '股价 pₜ=100。客户部门净买入 D=2m 股，局部冲击系数 Λ=0.005 log-point/百万股、噪声为零；dealer 初始库存 Iᴹ=0.5m 股。某客户原持 1m 股，本期买 0.4m；只为唯一算术答案，题设假定区间价格线性变化且成交量均匀，故成交均价取首尾价格中点。无费用、利息和融资流。',
    facts: [
      { label: 'Price impact', value: 'r=0.005×2=1%', note: 'log return' },
      { label: 'Dealer leg', value: 'yᴹ=−D', note: '客户净买必须有反向成交' },
      { label: 'Wealth check', value: 'old-position P&L + execution P&L', note: '支付现金不等于财富损失' },
    ],
    options: [
      { id: 'a', label: 'Dealer 库存 2.5m；客户财富增加约 1.206m', diagnosis: 'Dealer 必须卖给客户，库存应下降而不是上升。' },
      { id: 'b', label: 'Dealer 库存 −1.5m；客户财富减少约 40.201m', diagnosis: '把购买资产支付的全部现金当成财富损失，漏记新取得股份。' },
      { id: 'c', label: 'Dealer 库存 −1.5m；客户现金减少约 40.201m，但财富增加约 1.206m', diagnosis: '正确。现金与资产同步换手，财富变化来自持仓重估及成交后到期末的价格差。' },
    ],
    correct: 'c',
    calculation: 'pₜ₊₁=100e^0.01≈101.0050；p̄≈100.5025；Iᴹₜ₊₁=0.5−2=−1.5m；现金减少 0.4×100.5025≈40.201m；ΔW=1×1.0050+0.4×0.5025≈1.206m。',
    reveal: '价格上涨创造的是 mark-to-market 估值变化，不是凭空增加系统现金。线性路径中点只是本题冻结的成交假设；真实研究必须使用可得的 fill/VWAP。',
    revisit: '回看 14–18「市场结果、dealer 守恒、现金、持仓与财富账」。',
    sourceIds: [25, 68, 75], staticSourceIds: [25, 75],
    staticTwin: { title: '变式 03 · 客户净卖出', prompt: 'pₜ=50、D=−1m、Λ=0.02；dealer 初始库存 −0.2m。客户原持 0.8m、卖 0.3m，仍用线性路径中点且无费用。求期末价、dealer 库存、客户现金流与财富变化。', answer: 'pₜ₊₁=50e⁻⁰·⁰²≈49.0099；dealer 库存=−0.2−(−1)=0.8m；客户现金增加约 0.3×49.505=14.8515m；财富变化约 0.8×(−0.9901)+(−0.3)×(−0.4951)=−0.6435m。' },
  },
  {
    id: 'population-wealth-weights', mode: 'engine', label: '闭环实验 04 · n ≠ ω',
    title: 'Chartist 采用率是 75%，为什么它控制的财富份额只有约 21.57%？',
    brief: '两条规则的适应度为 U_F=0、U_C=ln 3，logit 选择强度 β=1。两类规则当前财富分别为 80m、20m；下一期 gross wealth growth 分别为 1.00、1.10，无外部流量、切换资产转移或进入退出。',
    facts: [
      { label: 'Population update', value: 'n∝exp(βU)', note: '采用率／人数权重' },
      { label: 'Wealth update', value: 'ω∝current wealth×growth', note: '资本份额' },
      { label: 'No identity', value: 'n ≠ ω', note: '还不同于成交份额与风险贡献' },
    ],
    options: [
      { id: 'a', label: 'Chartist 的采用率与新财富份额都为 75%', diagnosis: '把 logit 人数权重复制给资本份额，忽略初始财富基数。' },
      { id: 'b', label: 'Chartist 采用率 75%；新财富份额 22/102≈21.57%', diagnosis: '正确。两项权重来自不同更新方程，只有额外强条件下才会相等。' },
      { id: 'c', label: 'Chartist 采用率 25%；新财富份额 75%', diagnosis: 'logit 方向和财富账都颠倒了。' },
    ],
    correct: 'b',
    calculation: 'n_C=e^(ln3)/(e⁰+e^(ln3))=3/4；新财富 F=80、C=20×1.10=22，总计 102，故 ω_C=22/102≈21.57%。',
    reveal: '采用率 n、财富/AUM 份额 ω、单位资本头寸 x 和可执行约束 Ω 必须分开。还要从财富增长中剔除外部申赎，否则会把资金流错写成规则赚钱后的自然选择。',
    revisit: '回看 20–23、42–45「适应度、构成四腿、财富选择和策略切换」。',
    sourceIds: [27, 28, 56, 58], staticSourceIds: [27, 56],
    staticTwin: { title: '变式 04 · 人多不等于钱多', prompt: 'U_A=ln2、U_B=0、β=1；当前财富 A=30m、B=70m，gross growth A=1.2、B=0.9。求 n_A 与新 ω_A。', answer: 'n_A=2/(2+1)=2/3；新财富 A=36m、B=63m，因此 ω_A=36/99≈36.36%。' },
  },
  {
    id: 'margin-iteration', mode: 'engine', label: '闭环实验 05 · Margin Iteration',
    title: '价格从 10 跌到 8 后，为什么一轮去杠杆卖单是 2.5 百万股，而不是全部卖出？',
    brief: 'Long fund 持 10m 股，现金为 0、债务 60m；价格已由 10 跌至 8。Gross leverage cap=3。按冲击后的当前状态计算一次保证金目标；局部冲击系数为 Λ=0.02 log-point/百万股。忽略费用、利息和成交容量，仅做第一轮更新。',
    facts: [
      { label: 'Post-shock equity', value: '10×8−60=20m', note: 'W>0 才定义 leverage' },
      { label: 'Current gross exposure', value: '80m', note: 'leverage=80/20=4' },
      { label: 'Allowed exposure', value: '3×20=60m', note: '目标股数=60/8' },
    ],
    options: [
      { id: 'a', label: '目标 7.5m 股，卖出 2.5m；一轮追加 −5% log return（简单收益约 −4.88%）', diagnosis: '正确。这只是一次 margin–impact 更新，成交后的权益和约束还要再次计算。' },
      { id: 'b', label: 'W=80m、leverage=1，因此无需卖出', diagnosis: '把资产市值当成净权益，漏掉债务。' },
      { id: 'c', label: 'W=20m，因此必须一次卖完 10m', diagnosis: '超出上限只要求降至允许敞口；真实强平还受规则、现金、容量和成交路径约束。' },
    ],
    correct: 'a',
    calculation: 'W=20m；ℓ=80/20=4；cap exposure=60m；qᶜᵃᵖ=60/8=7.5m；d=−2.5m；第一轮局部 rᴹ=0.02×(−2.5)=−0.05 log return，对应 simple return e⁻⁰·⁰⁵−1≈−4.88%。',
    reveal: '一次计算不等于 cascade 终点：卖出可能降低风险敞口，却也可能通过价格冲击进一步降低剩余头寸价值。若 W≤0，leverage 为 N/A，系统应进入违约/处置状态。',
    revisit: '回看 17、28、35–36「抵押品、阈值、融资—市场流动性与 forced-flow cascade」。',
    sourceIds: [68, 70, 71, 73], staticSourceIds: [68, 70, 71],
    staticTwin: { title: '变式 05 · 更紧上限', prompt: '基金持 6m 股、现金 0、债务 72m；价格从 20 跌至 15，cap=2.5，Λ=0.01 log-return/百万股。求 W、当前 leverage、目标股数、第一轮卖单和局部冲击。', answer: 'W=6×15−72=18m；gross leverage=90/18=5；允许敞口 45m，目标 3m 股，第一轮卖 3m；局部追加冲击是 −3% log return，对应 simple return e⁻⁰·⁰³−1≈−2.96%。' },
  },
  {
    id: 'market-conservation', mode: 'evidence', label: '证据实验 01 · Market Conservation',
    title: '客户实际净买入 3 百万股时，模型还缺少哪个部门？',
    brief: '模型将若干客户账户的实际成交相加，得到 D=+3m 股，并用局部式 r=ΛD 描述价格反应。模型没有发行、注销、到期或公司行动。现在检查股份守恒，而不是判断冲击式是否拟合数据。',
    facts: [
      { label: 'Observed customer leg', value: '+3m shares', note: '已经是实际成交而非意向' },
      { label: 'Security supply', value: 'unchanged', note: '无公司行动' },
      { label: 'Missing sector', value: '?', note: '全市场成交必须双边' },
    ],
    options: [
      { id: 'a', label: '所有主体合计持仓可增加 3m，因为价格上涨创造股份', diagnosis: '价格重估不创造证券数量。' },
      { id: 'b', label: '客户内部既可净买 3m，又可自动满足净成交为 0', diagnosis: '若集合只包含客户且净买为正，就必须有集合外对手方；不能同时宣称同一集合净和为零。' },
      { id: 'c', label: 'Dealer／外部流动性部门必须成交 −3m；未建模则股份账不完整', diagnosis: '正确。冲击式可以以客户净流为解释变量，但证券守恒仍要求反向成交腿。' },
    ],
    correct: 'c',
    calculation: 'Σ all-sector fills=0；Σ customer fills=+3m，因此 Σ liquidity-provider fills=−3m。价格变化只改变市值，不改变此数量恒等式。',
    reveal: 'Walrasian 清算把价格调到计划净需求为零；有限深度模型则允许客户净成交不为零，由 dealer 或外部部门承接。两种闭合方式不能在同一时点无说明地混用。',
    revisit: '回看 08、13–16 与 23「市场交互、实际成交、清算/冲击边界和主递归」。',
    sourceIds: [25, 75, 80], staticSourceIds: [25, 80],
    staticTwin: { title: '变式 06 · 两名客户仍未闭合', prompt: '客户 A 买 2m、客户 B 卖 1m，无发行或注销。客户集合净成交多少？外部流动性提供者应成交多少？', answer: '客户净成交 +1m；外部流动性提供者应成交 −1m；所有部门合计为 0。' },
  },
  {
    id: 'strategic-complementarity', mode: 'evidence', label: '证据实验 02 · Fixed Point / Stability',
    title: '存在一个代数固定点，为什么还必须单独检查动态是否收敛？',
    brief: '无约束标量 best-response 教学模型为 ā=b̄+χā，给定 b̄=0.4、χ=0.5。动态过程按 a⁽ᵏ⁺¹⁾=b̄+χa⁽ᵏ⁾ 迭代。行动 a 是无量纲风险权重。',
    facts: [
      { label: 'Algebraic equation', value: 'a*=b/(1−χ)', note: 'χ≠1 时有唯一代数解' },
      { label: 'Iteration', value: 'a(k+1)=b+χa(k)', note: '收敛需 |χ|<1' },
      { label: 'Given', value: 'b=0.4 · χ=0.5', note: '无 clip 与其他状态' },
    ],
    options: [
      { id: 'a', label: '固定点 0.8，且朴素迭代局部稳定', diagnosis: '正确。χ=0.5 的绝对值小于 1，偏离每轮缩小一半。' },
      { id: 'b', label: '固定点 0.4，因为平均行动不能反馈自身', diagnosis: '忽略 χa 的战略反馈项。' },
      { id: 'c', label: '固定点 0.8，但 χ>0 所以必然不稳定', diagnosis: '正互补不自动失稳；在此线性迭代中关键是 |χ|。' },
    ],
    correct: 'a',
    calculation: 'a*=0.4/(1−0.5)=0.8；误差 e(k+1)=0.5e(k)，故任意初始误差几何衰减。',
    reveal: '“有解”与“从现实起点会走到该解”是两个问题。多主体矩阵版本还要检查谱半径；加入 clip、阈值或状态切换后应重新求非线性固定点。',
    revisit: '回看 24–28 与 39「固定点、局部稳定、阈值和战略互补」。',
    sourceIds: [62, 63, 64], staticSourceIds: [62, 63],
    staticTwin: { title: '变式 07 · 有解但迭代发散', prompt: 'b=0.1、χ=1.2，无约束。求代数固定点并判断朴素迭代。', answer: '代数固定点 a*=0.1/(1−1.2)=−0.5；但 |χ|=1.2>1，朴素 best-response iteration 不稳定。存在代数解不等于动态稳定。' },
  },
  {
    id: 'public-time', mode: 'evidence', label: '证据实验 03 · PublicAt',
    title: '3 月 31 日的持仓到 5 月 10 日才披露，4 月 15 日能否用于实时信号？',
    brief: '基金持仓描述 3 月 31 日的期末状态，5 月 10 日正式 filing/public，5 月 11 日进入研究数据库。研究者在 4 月 15 日生成交易信号；不存在更早的直接公开数据。',
    facts: [
      { label: 'State date', value: '31 March', note: '经济状态所属时点' },
      { label: 'PublicAt', value: '10 May', note: '外部可靠可知时点' },
      { label: 'ObservedAt', value: '11 May', note: '研究系统抓取时点' },
    ],
    options: [
      { id: 'a', label: '可用，因为 event/state date 早于 4 月 15 日', diagnosis: '把事后所属期当成当时可知，造成 look-ahead bias。' },
      { id: 'b', label: '不可用，并应把尚未披露的持仓填成零', diagnosis: '未知不等于零；可使用此前已公开版本或明确缺失。' },
      { id: 'c', label: '不可用；只能用 4 月 15 日前已公开版本，并保存 publicAt、observedAt 与 vintage', diagnosis: '正确。经济发生、公开和数据库观察是三条不同时间轴。' },
    ],
    correct: 'c',
    calculation: 'decisionAt 15 April < publicAt 10 May < observedAt 11 May，因此该记录在决策时不可用；字段应为 unknown 或 previous-public vintage，而非 future-filled。',
    reveal: '反馈研究尤其容易时间旅行：事后看到某类主体处于高杠杆或拥挤状态，不代表市场当时或研究策略当时能够观察到它。',
    revisit: '回看 07、48、53–55「事件时钟、案例协议、数据地图与识别」。',
    sourceIds: [48, 78, 80], staticSourceIds: [48, 78],
    staticTwin: { title: '变式 08 · 测量日不等于发布日期', prompt: '一项调查在 6 月 30 日测量 chartist 占比，7 月 3 日发布；回测决策日 7 月 1 日。能否使用？', answer: '不能。measurementAt 早于决策日不够，publicAt 仍晚于决策日；只能在 7 月 3 日以后使用。' },
  },
  {
    id: 'nonlinear-aggregation', mode: 'evidence', label: '证据实验 04 · Mean of Rule ≠ Rule of Mean',
    title: '两人的平均信号是 0.075，为什么代表主体法把订单高估三倍？',
    brief: '两名等规模主体信号为 0.20 和 −0.05。每名主体的实际提交订单规则为 z(s)=clip(10s,−1,1) 百万股。比较逐主体聚合与“先取平均信号，再乘两名代表主体”的捷径。',
    facts: [
      { label: 'Signals', value: '0.20 · −0.05', note: 'mean=0.075' },
      { label: 'Nonlinearity', value: 'clip to [−1,1]', note: '强信号先触顶' },
      { label: 'Two methods', value: 'Σz(sᵢ) vs 2z(mean s)', note: '不可预设相等' },
    ],
    options: [
      { id: 'a', label: '两种方法都得到 0.5m', diagnosis: '忽略均值信号在代表主体规则下并未触顶。' },
      { id: 'b', label: '逐主体为 0.5m；均值法为 1.5m', diagnosis: '正确。个体订单为 +1 与 −0.5，而代表主体每人订单为 +0.75。' },
      { id: 'c', label: '逐主体为 1.5m；均值法为 0.5m', diagnosis: '把两种计算顺序颠倒。' },
    ],
    correct: 'b',
    calculation: 'Σz=clip(2,−1,1)+clip(−0.5,−1,1)=1−0.5=0.5m；2z(0.075)=2×0.75=1.5m。',
    reveal: '只在线性规则且约束不绑定等强条件下，先平均状态再求订单才可能等于逐主体聚合。阈值、违约、杠杆、short cap 和异质财富都会破坏捷径。',
    revisit: '回看 03–06、11、28 与 41「闭环条件、状态分布、约束非线性和异质性的双重作用」。',
    sourceIds: [1, 2, 4, 29, 46], staticSourceIds: [1, 4, 29],
    staticTwin: { title: '变式 09 · 三名主体', prompt: '三名等规模主体信号为 0.30、0.02、−0.08，仍用 z(s)=clip(10s,−1,1)m。分别计算逐主体聚合和均值信号代表主体法。', answer: '逐主体订单为 1、0.2、−0.8，总计 0.4m；平均信号 0.08，代表主体每人 0.8m，三人合计 2.4m。' },
  },
  {
    id: 'local-stability-boundary', mode: 'evidence', label: '证据实验 05 · Local ≠ Global',
    title: '冻结参数下是阻尼振荡，为什么仍不能宣布整个市场“稳定”？',
    brief: '误价 mₜ=xₜ−f 满足局部二阶近似 mₜ₊₁=(1−a_F+a_C)mₜ−a_Cmₜ₋₁。给定 a_F=0.6、a_C=0.7；规则权重、价值、约束和冲击系数仅在局部分析中冻结。',
    facts: [
      { label: 'Characteristic', value: 'λ²−1.1λ+0.7=0', note: '复根' },
      { label: 'Root modulus', value: '√0.7≈0.837', note: '冻结参数下小扰动衰减' },
      { label: 'Outside local model', value: 'switching · margin · impact shift', note: '会改变 a_F、a_C' },
    ],
    options: [
      { id: 'a', label: '只要存在 chartist，系统必然发散', diagnosis: '趋势反馈强度与基本面负反馈共同决定局部边界；存在类型不等于失稳。' },
      { id: 'b', label: '特征根模长为 0.7，所以现实全局稳定', diagnosis: '模长应为 √0.7，而且局部冻结模型不能证明全局或现实稳定。' },
      { id: 'c', label: '复根模约 0.837，冻结参数下阻尼振荡；switching 与 margin 仍可改写稳定性', diagnosis: '正确。答案同时保留数学结论和外推边界。' },
    ],
    correct: 'c',
    calculation: '根的乘积为 a_C=0.7；共轭复根模长为 √0.7≈0.8367<1，故局部小扰动以振荡形式衰减。',
    reveal: '局部稳定不等于全局稳定，也不等于带噪系统具有有限方差。约束切换点要用分段/单侧分析；策略权重内生变化时，系数本身就是状态。',
    revisit: '回看 24–28、43、47 与 55「稳定性、切换、内生 Regime 和断链证伪」。',
    sourceIds: [23, 28, 30, 33], staticSourceIds: [23, 28],
    staticTwin: { title: '变式 10 · 冻结参数下失稳', prompt: '给定 a_F=0.4、a_C=1.1。判断复根模长和局部稳定性，并说明为何不能外推为现实价格无限爆炸。', answer: '复根模长 √1.1≈1.049>1，冻结参数的局部系统不稳定；但真实系统的 clip、容量、破产、政策、价格边界和规则切换都会改变路径，不能由线性近似外推无限爆炸。' },
  },
];
