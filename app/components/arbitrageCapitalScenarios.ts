export type ArbitrageCapitalMode = 'object' | 'capital';
export type ArbitrageCapitalChoice = 'a' | 'b' | 'c';

export type ArbitrageCapitalScenario = {
  id: string;
  mode: ArbitrageCapitalMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: ArbitrageCapitalChoice; label: string; diagnosis: string }[];
  correct: ArbitrageCapitalChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const arbitrageCapitalModes: { id: ArbitrageCapitalMode; label: string; title: string; description: string }[] = [
  { id: 'object', label: 'MODE A', title: '识别可执行的套利对象', description: '先证明 claims 等价，再扣除成本、借券与时钟，区分 textbook arbitrage 和 convergence bet。' },
  { id: 'capital', label: 'MODE B', title: '审计资本、仓位与反馈', description: '把 haircut、资金流、拥挤、target、fill 与强制减仓放进同一本账户状态机。' },
];

export const arbitrageCapitalScenarios: ArbitrageCapitalScenario[] = [
  {
    id: 'textbook-arbitrage',
    mode: 'object',
    label: '对象实验 01 · Textbook Arbitrage',
    title: '两份完全相同的终值索赔价格不同，什么条件下才是严格套利？',
    brief: '冻结理想条件：A 与 B 在同一时点、同一法律实体下都无条件支付 100；A=99、B=101。允许同步买 A、卖空 B，借券、融资、结算与税务均无成本且保证持续，没有中途 margin call。',
    facts: [
      { label: 'Cheap claim A', value: '99 now → 100 at T', note: '终值与 B 完全相同' },
      { label: 'Rich claim B', value: '101 now → 100 at T', note: '可同步且无成本卖空' },
      { label: 'Friction', value: '0', note: '本题刻意冻结为 textbook 世界' },
    ],
    options: [
      { id: 'a', label: '买 B、卖空 A；初始赚 2，终值净额为 0', diagnosis: '方向相反：买 101、卖 99 在初始时先支付 2，不是收益。' },
      { id: 'b', label: '买 A、卖空 B；初始净流入 2，终值相互抵消', diagnosis: '正确。同步、等价、可融资且可持续的条件使净终值不为负，初始已有确定正流入。' },
      { id: 'c', label: '只能称正期望 convergence trade，因为任何套利都必须承担 fundamental risk', diagnosis: '题设已经排除 fundamental、执行、融资和中途清算风险；在这些理想条件下就是严格套利。' },
    ],
    correct: 'b',
    calculation: 't0 cash flow=+101−99=+2；T cash flow=+100−100=0。若把初始流入以无风险资产持有，终值严格为正。',
    reveal: '现实中最难的通常不是做减法，而是证明“相同索赔、同步成交、可卖空、可融资、能持有至终点”同时成立。少一项，严格套利就可能退化为风险交易。',
    revisit: '回看 03–06「严格套利、convergence trade 与 claims equivalence」。',
    staticTwin: {
      title: '变式 01 · 扣除已知摩擦后的严格套利',
      prompt: '两份无条件支付 100 的完全相同索赔分别报价 98.5 与 100.8；买便宜、卖贵的全部确定成本合计 0.6，且借券和融资保证持续。求初始确定净流入与终值净额。',
      answer: 'Gross spread=2.3；扣成本后初始净流入=1.7；终值两条腿相互抵消为 0。题设保证所有条件，因此仍是严格套利。',
    },
  },
  {
    id: 'claim-equivalence',
    mode: 'object',
    label: '对象实验 02 · Claims Equivalence',
    title: '票息和到期日相同，为什么两只债券仍未必服从一价定律？',
    brief: 'A 与 B 都标示五年期、3% coupon、同一发行人；但 A 不可赎回，B 可由发行人在利率下降时按 102 提前赎回。观察到 A 比 B 贵 2 个 price points，其他条款尚未核对。',
    facts: [
      { label: 'Coupon / maturity', value: '3% / 5 years', note: '表面字段相同' },
      { label: 'A', value: 'Non-callable', note: '现金流路径不由发行人改写' },
      { label: 'B', value: 'Callable at 102', note: '含发行人持有的赎回选择权' },
    ],
    options: [
      { id: 'a', label: '不能仅凭价差称错价；B 的 callable option 改变了状态依赖现金流', diagnosis: '正确。一价定律比较的是每个状态、时点和法律优先级下相同的索赔，不是名称相似的证券。' },
      { id: 'b', label: 'A 贵 2 点必然违反一价定律，因为 coupon 与 maturity 相同', diagnosis: '忽略了赎回权；利率下降时 B 的上涨会被发行人提前赎回截断。' },
      { id: 'c', label: '只要 duration 接近，两者就可视为完全相同的终值索赔', diagnosis: 'Duration 是局部利率敏感度，不会消除 option、信用、税务、流动性与交收差异。' },
    ],
    correct: 'a',
    calculation: '可验证 basis 必须先做 contract adjustment：raw price gap 2 points 不能在未估值 embedded call 前解释成套利利润。',
    reveal: '“同一发行人、同一 ticker、同一到期”都只是筛选条件。真正的 equivalence 还要冻结现金流、optionality、seniority、currency、tax、settlement、deliverable 与 corporate action。',
    revisit: '回看 03–06「严格套利、索赔等价、候选错价与 anchor」。',
    staticTwin: {
      title: '变式 02 · 同股不同权也不是同一索赔',
      prompt: '两类股票分享相同当期 dividend，但一类有额外投票权和不同 conversion 条款。看到 4% 价差，能否直接称无风险套利？',
      answer: '不能。控制权、conversion、流动性、税务和可卖空性都会改变状态现金流或可执行集合；必须先调整这些差异。',
    },
  },
  {
    id: 'no-arbitrage-band',
    mode: 'object',
    label: '对象实验 03 · No-arbitrage Band',
    title: '可见价差小于完成整条交易链的确定成本时，还存在可执行套利吗？',
    brief: '两份索赔已确认完全相同，A=99.40、B=100.10；买 A、卖 B 的同步成交、borrow、funding、settlement 与退出确定成本合计 0.85 price points。忽略随机冲击。',
    facts: [
      { label: 'Raw spread', value: '100.10−99.40=0.70', note: '尚未扣成本' },
      { label: 'All-in certain cost', value: '0.85', note: '同一 notional 的完整交易链' },
      { label: 'Claim mismatch', value: '0', note: '本题已验证等价' },
    ],
    options: [
      { id: 'a', label: '存在 0.70 的无风险利润，因为同一索赔价格不同', diagnosis: '漏掉完整 all-in cost；屏幕价差不是可带走的净现金流。' },
      { id: 'b', label: '净套利利润为 0.15，因为 0.85−0.70=0.15', diagnosis: '符号倒置；成本高于 spread，净值应为负。' },
      { id: 'c', label: '净值为 −0.15，价差仍在 no-arbitrage band 内', diagnosis: '正确。摩擦把一价定律从一个点扩成带宽；套利资本不会为确定负净值机械进场。' },
    ],
    correct: 'c',
    calculation: 'Net locked value=0.70−0.85=−0.15 price points；在本题参数下没有正的可执行套利。',
    reveal: '带宽不是永恒常数。spread、depth、borrow fee、haircut、capital charge 和 settlement risk 会随状态变化，因此昨天可套利的 gap 今天可能只是一条不可成交的屏幕残差。',
    revisit: '回看 17「No-trade Region 与完整成本」。',
    staticTwin: {
      title: '变式 03 · 价差穿越带宽',
      prompt: '完全相同索赔的 raw spread=1.30 points，全部确定成本=0.75，且交易可同步并持有至终点。求锁定净值。',
      answer: 'Net locked value=1.30−0.75=0.55 points；若题设的等价、融资和可持续性全部真实成立，价差已穿越无套利带宽。',
    },
  },
  {
    id: 'convergence-path-risk',
    mode: 'object',
    label: '对象实验 04 · Convergence Path',
    title: '预期最终收敛获利，为什么中途仍可能先出现更大的账面亏损？',
    brief: '定义 basis x=rich−cheap。交易员在 x0=4 时买 cheap、卖 rich，预计六个月后 xT=1；但压力路径中 x 先扩大到 9。每一 basis point、每单位仓位对应 1 个货币单位 P&L，忽略 carry。',
    facts: [
      { label: 'Entry basis', value: 'x0=4', note: '做空 rich、做多 cheap' },
      { label: 'Expected exit', value: 'xT=1', note: '若实现则 gap 收窄 3' },
      { label: 'Stress path', value: 'xstress=9', note: '收敛前先扩大 5' },
    ],
    options: [
      { id: 'a', label: '只要最终 xT=1，中途 basis 变化不会产生任何账户损益', diagnosis: 'mark-to-market、margin 与投资者资金流都在中途发生；不能只看终点。' },
      { id: 'b', label: '压力期获利 5，因为 basis 从 4 扩大到 9', diagnosis: '方向相反：本仓位是 short basis，basis 扩大造成亏损。' },
      { id: 'c', label: '预期终点获利 3，但压力期先亏 5；能否存活取决于资本路径', diagnosis: '正确。终点 thesis 和中途 financing path 是两道不同的命题。' },
    ],
    correct: 'c',
    calculation: 'Short-basis P&L=q(xentry−xnow)。Expected=1×(4−1)=+3；stress=1×(4−9)=−5。',
    reveal: 'Noise-trader risk 的关键不是“价格永远不回归”，而是错误定价可能在你必须报告 NAV、缴 margin 或面对赎回之前继续扩大。',
    revisit: '回看 11–14 与 22「Noise-trader Risk、Horizon 与 Survival」。',
    staticTwin: {
      title: '变式 04 · 正确终点也可能经过错误方向',
      prompt: '以 x0=3 建立 short-basis 仓位，预计 xT=0，但中途 x=7。每单位的终点收益与中途 mark-to-market 分别是多少？',
      answer: '若最终收敛，收益=3−0=+3；中途损益=3−7=−4。没有足够 collateral 时，正确终点无法挽救提前清算。',
    },
  },
  {
    id: 'borrow-carry',
    mode: 'object',
    label: '对象实验 05 · Short-leg Carry',
    title: '“高估 6%”为什么可能不足以覆盖一条昂贵的 short leg？',
    brief: '交易员预计 rich security 在一年内相对下跌 6%。冻结条件：年化 borrow fee=8%，完整执行与结算成本=1%，不考虑 dividend、税务和 price impact；费用均按同一 notional。',
    facts: [
      { label: 'Expected relative correction', value: '+6%', note: 'short leg 的预期价格收益' },
      { label: 'Borrow fee', value: '−8%', note: '冻结为一年持有' },
      { label: 'Execution / settlement', value: '−1%', note: '完整交易链成本' },
    ],
    options: [
      { id: 'a', label: '预期净值为 −3%，所以 raw mispricing 不足以支持该表达', diagnosis: '正确。6−8−1=−3%；观点可以正确，合约表达仍可为负净值。' },
      { id: 'b', label: '预期净值为 +13%，因为借券费代表出借人付给空头', diagnosis: '通常是借方支付 borrow fee；题设也明确将其列为成本。' },
      { id: 'c', label: '预期净值仍为 +6%，borrow 只影响 margin、不影响收益', diagnosis: 'Borrow fee 是真实 carry；margin 是另一种资源占用，不能相互替代。' },
    ],
    correct: 'a',
    calculation: 'Expected net relative return=6%−8%−1%=−3%。尚未计入 recall、buy-in、dividend 与 stress impact。',
    reveal: '做空约束不仅可能阻止建仓，也会改变“谁是边际套利者”。高 fee、recall 与 squeeze risk 会让最确信高估的人仍选择小仓位或不交易。',
    revisit: '回看 18–19「Borrow、Fee、Recall 与 Short Squeeze」并连接 1.19。',
    staticTwin: {
      title: '变式 05 · 正 correction 需要穿透 carry',
      prompt: '预计相对修正 10%，一年 borrow fee=4%，全部执行成本=1.5%，忽略其他项目。求预期净值。',
      answer: '10%−4%−1.5%=+4.5%。它仍是有风险的预期净值，不是锁定套利，因为 correction、borrow 和退出都可能偏离预测。',
    },
  },
  {
    id: 'haircut-capacity',
    mode: 'capital',
    label: '资本实验 06 · Haircut Shock',
    title: '同样的 10 million equity，haircut 上升会把可持有 gross position 压缩多少？',
    brief: '冻结一条线性 collateral constraint：required capital=h×gross exposure。基金 eligible equity=10m，原 haircut=10%，actual gross=100m；风险冲击后 haircut 提高到25%，没有新增资本和 portfolio offsets。',
    facts: [
      { label: 'Eligible equity', value: '$10m', note: '可用于本仓位的资本' },
      { label: 'Haircut', value: '10% → 25%', note: '冲击后按新规则即时约束' },
      { label: 'Actual gross', value: '$100m', note: '冲击前恰好用满容量' },
    ],
    options: [
      { id: 'a', label: '新容量为 $250m，因此可以加仓 $150m', diagnosis: '容量是 equity/haircut，不是 equity×haircut 的倒数方向误读。' },
      { id: 'b', label: '新容量为 $40m；若无新资本，至少减仓 $60m', diagnosis: '正确。10/0.25=40；actual 100 必须降至不高于40。' },
      { id: 'c', label: '只要终点 cash flow 不变，haircut 不会影响持仓', diagnosis: 'Haircut 约束的是中途可融资规模；即使终值索赔不变，也可能触发当前强制减仓。' },
    ],
    correct: 'b',
    calculation: 'Grossmax,old=10/0.10=$100m；Grossmax,new=10/0.25=$40m；minimum reduction=$100m−$40m=$60m。',
    reveal: '错价扩大与 haircut 上升常会同时发生。于是机会的预期回报更高，能承担它的资本却更少；这正是 limits to arbitrage 的非单调核心。',
    revisit: '回看 25–26 与 37–38「Haircut、Funding、Wealth 与 Margin Feedback」。',
    staticTwin: {
      title: '变式 06 · 同时改变 haircut 与容量',
      prompt: 'Eligible equity=$12m，actual gross=$80m；haircut 从15%升到30%，无 offsets。求新容量与最低减仓。',
      answer: '新容量=12/0.30=$40m；最低减仓=80−40=$40m。原容量也是80m，说明基金冲击前恰好用满。',
    },
  },
  {
    id: 'delegated-capital-flow',
    mode: 'capital',
    label: '资本实验 07 · Delegated Capital',
    title: '策略亏损与投资者赎回叠加后，套利资本为什么在机会最大时骤降？',
    brief: '基金期初可用资本=100m，basis widening 造成15m mark-to-market loss；随后投资者净赎回20m。冻结冲击后 haircut=20%，赎回以绝对金额计，忽略管理费和其他仓位；在 mark 已更新、尚未清算的时点，actual gross 冻结为500m。',
    facts: [
      { label: 'Starting capital', value: '$100m', note: '期初 gross capacity=500m at 20%' },
      { label: 'Mark-to-market', value: '−$15m', note: '先进入 NAV' },
      { label: 'Net redemption', value: '−$20m', note: '随后流出资本' },
    ],
    options: [
      { id: 'a', label: '期末资本为 $85m，赎回只改变 investor count', diagnosis: '赎回是基金资产流出，会继续减少可用于仓位的资本。' },
      { id: 'b', label: '期末资本为 $65m，但 gross capacity 仍是 $500m', diagnosis: '资本下降后，在同一20% haircut下容量也随之下降。' },
      { id: 'c', label: '期末资本 $65m、容量 $325m；相对 $500m 至少减仓 $175m', diagnosis: '正确。先合账 NAV 与 flow，再除以 haircut 得到新的可行上限。' },
    ],
    correct: 'c',
    calculation: 'Capital+=100−15−20=$65m；Grossmax=65/0.20=$325m；minimum reduction=500−325=$175m。',
    reveal: 'Shleifer–Vishny 的稳健含义不是“任何资金流都放大错价”，而是 performance-sensitive delegated capital 会让专业套利者在 adverse deepening 时恰好失去承载能力。',
    revisit: '回看 27–30「Delegated Management、Performance-based Arbitrage 与资本供给」。',
    staticTwin: {
      title: '变式 07 · 亏损与赎回的容量乘数',
      prompt: 'Starting capital=$120m，mark-to-market loss=$12m，redemption=$18m，haircut=25%；在 mark 已更新、尚未清算时，actual gross 冻结为$480m。求新资本、新容量和最低减仓。',
      answer: '新资本=120−12−18=$90m；新容量=90/0.25=$360m；最低减仓=480−360=$120m。',
    },
  },
  {
    id: 'crowded-liquidation-impact',
    mode: 'capital',
    label: '资本实验 08 · Common Liquidation',
    title: '多家基金同时减仓时，为什么个体清算成交会变成系统价格冲击？',
    brief: '四家基金持有同方向 convergence trade，并各自已经实际成交卖出20m。冻结线性教学深度：该资产每40m净卖出成交造成1%的不利价格变化；深度提供成交对手盘，但没有抵消方向的外生净买流或随后恢复。',
    facts: [
      { label: 'Funds', value: '4', note: '同方向、同一时钟' },
      { label: 'Forced sale filled per fund', value: '$20m', note: '来自独立账户约束的实际成交' },
      { label: 'Linear depth', value: '$40m per 1%', note: '纯教学 impact coefficient' },
    ],
    options: [
      { id: 'a', label: '净卖出成交合计 $80m，对应约 2% 的额外不利冲击', diagnosis: '正确。先聚合 actual forced fills，再除以冻结深度；这不是每家独立计算后忽略重叠。' },
      { id: 'b', label: '只有 0.5%，因为20/40=0.5且基金彼此独立', diagnosis: '本题价格函数接收的是聚合净成交；账户独立不等于成交冲击独立。' },
      { id: 'c', label: '价格必然不变，因为每个卖方都相信资产低估', diagnosis: '观点不提供即时对手盘；被迫卖出者可以在认为更便宜时继续卖。' },
    ],
    correct: 'a',
    calculation: 'Aggregate forced sale filled=4×$20m=$80m；linear impact=80/40×1%=2% in the adverse sell direction。',
    reveal: '共同持仓本身不是因果。必须依次观察 constraint hit、actual order、fill、depth 和 price response；但一旦这些节点同向，个体去风险会变成系统正反馈。',
    revisit: '回看 41–45「Crowding、Forced Liquidation、Predatory Trading 与异质资本」。',
    staticTwin: {
      title: '变式 08 · 深度不足放大共同退出',
      prompt: '三家基金各实际成交卖出15m，市场教学深度为每30m净卖出成交造成1%变化；没有抵消方向的外生净流。求聚合成交与线性冲击。',
      answer: 'Aggregate filled sale=3×15=$45m；impact=45/30×1%=1.5% 的不利变化。真实 impact 通常非线性且会随时钟改变。',
    },
  },
  {
    id: 'paired-target-fill',
    mode: 'capital',
    label: '资本实验 09 · Target–Order–Fill',
    title: '两条腿的 target、post-lifecycle actual 与 partial fill 应怎样分别记账？',
    brief: 'Signed positions 约定 long 为正、short 为负。Target=(+100 cheap, −100 rich)；生命周期更新后的 actual=(+70, −60)。候选订单按 target−actual 生成；实际 fills=(+20, −30)。忽略价格变化。',
    facts: [
      { label: 'Target', value: '(+100, −100)', note: '期望的配对仓位' },
      { label: 'Post-life actual', value: '(+70, −60)', note: '已处理 expiry/settlement' },
      { label: 'Signed fills', value: '(+20, −30)', note: '只有 fill 改变真实仓位' },
    ],
    options: [
      { id: 'a', label: 'Desired=(+30,+40)，new actual=(+90,−90)', diagnosis: 'Short leg 的 target 是−100；−100−(−60)=−40，不是+40。' },
      { id: 'b', label: 'Desired=(+30,−40)，new actual=(+90,−90)，remaining=(+10,−10)', diagnosis: '正确。候选订单、fill 和剩余差额都保持 signed convention。' },
      { id: 'c', label: 'Target 一生成就把 actual 改成(+100,−100)，fill 只影响成本', diagnosis: 'Target 不是成交；把未成交 target 写入 actual 会消灭 leg risk 和执行失败。' },
    ],
    correct: 'b',
    calculation: 'Desired=(100−70, −100−(−60))=(+30,−40)；actual+=(70+20, −60−30)=(+90,−90)；remaining=(+10,−10)。',
    reveal: 'Limits to arbitrage 最终通过订单而非观点影响价格。两腿成交不同步会暂时留下方向、basis、margin 与 settlement risk，必须作为真实状态而非 residual 删除。',
    revisit: '回看 02、34，并回接 2.09 的「Target–Actual–Order–Fill」状态机。',
    staticTwin: {
      title: '变式 09 · 两腿 partial fill 的剩余状态',
      prompt: 'Target=(+80,−80)，post-life actual=(+50,−55)，fills=(+25,−20)。求 desired、new actual 与 remaining。',
      answer: 'Desired=(+30,−25)；new actual=(+75,−75)；remaining=(+5,−5)。不能用 package target 直接覆盖真实两腿。',
    },
  },
  {
    id: 'short-squeeze-inference',
    mode: 'capital',
    label: '资本实验 10 · Short Squeeze Evidence',
    title: '极高 short interest 与股价暴涨，足以唯一识别“全部由空头回补驱动”吗？',
    brief: '冻结为证据判断题：一只股票 short interest 曾超过 free float，价格与成交量急升；账户级数据只在若干离散窗口显示明显 buying-to-cover，持续上涨阶段仍有大量普通 long buying，且没有直接证据证明 gamma squeeze 是全程主因。',
    facts: [
      { label: 'Short interest', value: '> free float', note: 'gross stock, not a timed order' },
      { label: 'Covering', value: 'Observed in intervals', note: '贡献存在但时钟离散' },
      { label: 'Other buying', value: 'Large and persistent', note: '竞争解释不能删除' },
    ],
    options: [
      { id: 'a', label: 'Short interest 超过 float 证明所有借券都违法，且必须同日回补', diagnosis: 'Short interest 是存量快照；它既不恢复每笔贷款链，也不给出统一回补日。' },
      { id: 'b', label: '只要 call volume 与价格同时上升，就证明 gamma squeeze 解释全部涨幅', diagnosis: '相关成交量不能恢复 dealer 净 Gamma、hedge fill 与 price impact；题设也明确没有该单因果证据。' },
      { id: 'c', label: '可说 squeeze vulnerability 与部分 covering 存在，但持续涨幅需保留 long demand 等竞争解释', diagnosis: '正确。证据应按账户、方向、时钟和份额分解，而不是从高 short interest 跨越到唯一因果。' },
    ],
    correct: 'c',
    calculation: '本题不做伪精确比例：stock short interest ≠ 当日 cover order；gross option volume ≠ dealer net Gamma；价格共动 ≠ 唯一机制。',
    reveal: 'Short squeeze 是可发生的反馈机制，不是任何高 short-interest 暴涨的同义词。正式结论需要 loan/recall、covering flow、long buying、option inventory、hedge fills 与 market depth。',
    revisit: '回看 41、44 与 49「Crowding、Predatory Trading 与 GameStop 证据边界」。',
    staticTwin: {
      title: '变式 10 · 高 short interest 只给出脆弱性，不给出时钟',
      prompt: '某股 short interest=80% free float，随后两日上涨40%，但只有 aggregated volume 与价格。可以得出什么最强结论？',
      answer: '最多说高 short interest 可能提高 squeeze vulnerability；不能恢复谁回补、何时回补、回补占买盘比例，也不能排除消息、long demand、做市与流动性机制。',
    },
  },
];
