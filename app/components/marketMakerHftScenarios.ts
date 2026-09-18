export type HftMode = 'decision' | 'systems';
export type HftChoice = 'a' | 'b' | 'c';

export type HftScenario = {
  id: string;
  mode: HftMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: HftChoice;
  options: { id: HftChoice; label: string; diagnosis: string }[];
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const hftModes: { id: HftMode; label: string; title: string; description: string }[] = [
  { id: 'decision', label: 'MODE 01', title: '从信念到报价', description: '公允价值、信息、队列、撤单与全成本路由' },
  { id: 'systems', label: 'MODE 02', title: '从约束到反馈', description: '库存、消息、重复深度、markout 与局部放大' },
];

export const marketMakerHftScenarios: HftScenario[] = [
  {
    id: 'as-quote',
    mode: 'decision',
    label: '决策实验 01 · Avellaneda–Stoikov',
    title: '库存为多头时，reservation price 与被动取整后的双边报价是多少？',
    brief: '只使用本课冻结的原始 A–S 近似。把一股设为一个模型成交单位，q 是无量纲单位数，γ 与 k 都用模型价格美元的逆数表示，因此 γ/k 无量纲。mid s=100 美元/单位，库存 q=+2，风险厌恶 γ=0.1，价格波动 σ=0.20 美元/单位/√分钟，剩余时间 5 分钟，指数到达参数 k=20，tick=0.01 美元。先算 r 与总价差 w，再令 bid=r−w/2、ask=r+w/2；为保持被动，bid 向下、ask 向上取至 tick。',
    facts: [
      { label: 'State', value: 's=100 / q=+2', note: '正库存为多头' },
      { label: 'Risk/time', value: 'γ=.1 / σ=.20 / τ=5', note: '单位必须一起保留' },
      { label: 'Arrival/tick', value: 'k=20 / $0.01', note: '最后一步才取整' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'r=100.04；最终 bid/ask=99.98/100.10', diagnosis: '库存符号反了。多头库存使 agent 更愿意卖、较不愿继续买，因此 reservation price 应低于 mid。' },
      { id: 'b', label: 'r=99.96；raw 约 99.9001/100.0199；最终 99.90/100.02', diagnosis: '正确。先连续求解，再把 bid 向下、ask 向上做被动 tick 取整。' },
      { id: 'c', label: 'r=99.96；最终 bid/ask=99.91/100.01', diagnosis: '这是向内取整，会把 bid 抬高、ask 压低，不符合题设的 outward passive rounding。' },
    ],
    calculation: 'r=100−2×0.1×0.20²×5=99.96；w=0.1×0.20²×5+(2/0.1)ln(1+0.1/20)=0.1197508；raw=99.9001246/100.0198754；outward tick=99.90/100.02。',
    reveal: 'A–S 在特殊 Brownian/CARA/Poisson 环境中把库存风险与成交到达写进报价；它没有 queue、latency、fees、impact、硬限额或跨 venue 状态，不能当作生产系统的完整策略。',
    revisit: '回看 19–26「A–S 环境、reservation price、spread 与模型边界」。',
    staticTwin: {
      title: '变式 01 · 空头库存与 outward rounding',
      prompt: '仍按一股为模型成交单位，q 是无量纲单位数，γ、k 都按模型价格美元的逆数表示。s=50，q=−1，γ=0.2，σ=0.10 美元/单位/√分钟，τ=4 分钟，k=10，tick=0.01。使用同一公式并做被动向外取整。',
      answer: 'r=50−(−1×0.2×0.10²×4)=50.008；w=0.008+10ln(1.02)=0.206026；raw bid≈49.904987、ask≈50.111013；最终 49.90/50.12。',
    },
  },
  {
    id: 'gm-bayes',
    mode: 'decision',
    label: '决策实验 02 · Glosten–Milgrom',
    title: '买卖方向本身携带信息时，竞争性零利润 bid 与 ask 怎样由 Bayes 更新？',
    brief: '终值 V 只能是 101 或 99，先验概率各 50%。20% 的来单者知情：高值时只买、低值时只卖；80% 是噪声交易者，任一状态下买卖各半。竞争性、风险中性 dealer 报 a=E[V|buy]、b=E[V|sell]；忽略库存、费用和 tick。',
    facts: [
      { label: 'Values', value: '101 / 99', note: '先验各 50%' },
      { label: 'Informed', value: '20%', note: '方向与状态一致' },
      { label: 'Noise', value: '80%', note: '买卖各半' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'bid=ask=100，因为先验均值是 100', diagnosis: '忽略了“发生买单或卖单”会改变状态后验概率。竞争不会消除信息条件差异。' },
      { id: 'b', label: 'ask=100.40、bid=99.60，spread=0.80', diagnosis: '把 20% informed 直接当成买单后的信息优势，没有按买单在两种状态下的似然做 Bayes 更新。' },
      { id: 'c', label: 'ask=100.20、bid=99.80，spread=0.40', diagnosis: '正确。买单后高值概率 0.60，卖单后高值概率 0.40。' },
    ],
    calculation: 'P(buy|H)=0.2+0.8×0.5=0.6，P(buy)=0.5，所以 P(H|buy)=0.6；ask=.6×101+.4×99=100.20。对称地 P(H|sell)=.4，bid=99.80。',
    reveal: 'Adverse selection 是“成交条件改变对价值的信念”，并不要求对手方违法或拥有公司内幕；现实 markout 还会混入公共新闻、延迟与机械冲击。',
    revisit: '回看 12、17「成交毒性与 Glosten–Milgrom」。',
    staticTwin: {
      title: '变式 02 · 更高知情比例',
      prompt: '终值为 102 或 98，先验各半；30% 知情者高值买、低值卖，70% 噪声买卖各半。求竞争性 ask、bid 与 spread。',
      answer: 'P(H|buy)=0.65、P(H|sell)=0.35；ask=.65×102+.35×98=100.60；bid=.35×102+.65×98=99.40；spread=1.20。',
    },
  },
  {
    id: 'fifo-queue',
    mode: 'decision',
    label: '决策实验 03 · FIFO Queue',
    title: '前方成交与前方撤单交错发生时，本单究竟成交多少？',
    brief: '同价位严格 price–time priority。本单数量 200 股，进入时前方有 600 股。随后按顺序发生：250 股主动单击中该价位；确认位于本单前方的 180 股撤单；再有 300 股主动单击中。冻结无 hidden/reserve、无新增订单插到前方、无价格变动。',
    facts: [
      { label: 'Queue ahead', value: '600', note: '本单之前' },
      { label: 'Own order', value: '200', note: '同价位 FIFO' },
      { label: 'Events', value: 'M250 → C180 → M300', note: '顺序不可交换' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '本单成交 130 股，剩余 70 股', diagnosis: '正确。第一笔成交后前方 350，前方撤单后 170；第二笔 300 先消耗 170，再成交本单 130。' },
      { id: 'b', label: '本单完全不成交，因为主动单合计 550 小于初始前方 600', diagnosis: '漏掉了明确位于本单前方的 180 股撤单，它也会推进 queue position。' },
      { id: 'c', label: '本单全部成交，因为成交与撤单合计 730 大于 600', diagnosis: '超过前方的数量只有 130，不足以完成本单 200；不能把前方消耗后的全部事件量都算成本单成交。' },
    ],
    calculation: '前方量：600−250−180=170；第二笔主动量 300 先吃掉 170，剩余 130 与本单成交；own fill=min(200,130)=130，remaining=70。',
    reveal: 'Queue position 需要知道撤单发生在本单前还是后。只有 L1 或成交数据时，这个关键状态通常不可见；cancel request 也不等于撮合器已确认撤单。',
    revisit: '回看 10、27–29「队列状态、FIFO 与 fill/cancel race」。',
    staticTwin: {
      title: '变式 03 · 部分成交后的剩余量',
      prompt: '前方 400 股，本单 150 股；依次发生主动成交 100、前方撤单 120、主动成交 250。其余假设相同。求本单成交与剩余数量。',
      answer: '前方先降至 300，再因前方撤单降至 180；最后 250 先吃掉 180，再成交本单 70；本单剩余 80 股。',
    },
  },
  {
    id: 'stale-threshold',
    mode: 'decision',
    label: '决策实验 04 · Keep / Cancel',
    title: '旧报价在多大过时概率之上应撤销？',
    brief: '一股报价在仍有效时净赚 g=0.012 美元；若已过时并成交，条件损失为 L=0.048 美元。p 是“在本决策时点报价已过时”的概率；keep 的教学 EV=(1−p)g−pL，cancel payoff 固定为 0。所有 spread、fee 与 rebate 已含在 g/L，忽略撤单延迟和未成交机会成本。',
    facts: [
      { label: 'Valid payoff', value: '+$0.012', note: '每股净额' },
      { label: 'Stale payoff', value: '−$0.048', note: '不是额外再减 g' },
      { label: 'Cancel payoff', value: '$0', note: '题设冻结' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'break-even 为 25%；高于 25% 撤单', diagnosis: '用 g/L 而不是 g/(g+L)，漏掉有效状态概率也随 p 下降。' },
      { id: 'b', label: 'break-even 为 20%；高于 20% 撤单，低于 20% 保留', diagnosis: '正确。EV=0.012−0.060p，令其为零得到 p=0.20。' },
      { id: 'c', label: '只要 p<50% 就保留，因为有效状态更可能', diagnosis: '决策取决于概率乘以收益幅度；坏状态损失是好状态收益的四倍。' },
    ],
    calculation: 'EV_keep=(1−p)0.012−p0.048=0.012−0.060p；EV=0 时 p*=0.012/0.060=20%。',
    reveal: '真实撤单是与在途成交竞争的请求：若 cancel latency 很长，选择“撤”仍可能先被成交；本题只隔离信念阈值，不代表生产系统规则。',
    revisit: '回看 29–30「fill/cancel race 与 keep/cancel 阈值」。',
    staticTwin: {
      title: '变式 04 · 不对称收益的阈值',
      prompt: '有效时报价净赚 0.015 美元/股，过时成交损失 0.035 美元/股，cancel payoff=0。求 break-even 过时概率和两侧动作。',
      answer: 'p*=0.015/(0.015+0.035)=30%；p>30% 时撤单，p<30% 时保留；恰为 30% 时题设下无差异。',
    },
  },
  {
    id: 'venue-routing',
    mode: 'decision',
    label: '决策实验 05 · Fee-inclusive Routing',
    title: '最低 displayed ask 为什么不一定是最低全成本 venue？',
    brief: '这是法域无关的合成 venue，不代表当前美国 NMS fee schedule。立即买入 1,000 股，两个 venue 均保证全额成交、没有其他价格冲击。A 的 ask=100.000、taker fee=0.003、预期 slippage=0.001 美元/股；B 的 ask=99.999、fee=0.0030、slippage=0.0025。没有 rebate。比较每股和总全成本。',
    facts: [
      { label: 'Venue A', value: '100.000 + .003 + .001', note: '保证成交' },
      { label: 'Venue B', value: '99.999 + .0030 + .0025', note: '保证成交' },
      { label: 'Order', value: '1,000 shares', note: '无其他冲击' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '选 A；A 为 $100,004，B 为 $100,004.50，A 便宜 $0.50', diagnosis: '正确。显示价只是全成本的一项；应把 fee 与 slippage 都按每股加入后再乘数量。' },
      { id: 'b', label: '选 B；显示 ask 低 $0.001，所以总成本低 $1', diagnosis: '只比较了显示价，忽略 B 更高的 fee 与 slippage。' },
      { id: 'c', label: '两者相同；交易费不应计入执行质量', diagnosis: '费用是真实现金流。除非研究问题明确排除，否则 fee-inclusive cost 才能比较 venue。' },
    ],
    calculation: 'A 每股=100+.003+.001=100.004，总额=100,004；B 每股=99.999+.0030+.0025=100.0045，总额=100,004.50；A 低 $0.50。',
    reveal: '现实 routing 还要加入 fill probability、nonfill opportunity cost、队列、延迟、信息泄露和跨 venue 相互影响；不能把本题的确定成交式外推为普遍 smart router。',
    revisit: '回看 13、33、40「venue state、routing 与 maker/taker economics」。',
    staticTwin: {
      title: '变式 05 · 一厘价差之外的成本',
      prompt: '买入 2,000 股。A：ask 20.000、fee .0025、slippage .0005；B：ask 19.999、fee .0030、slippage .0015。均保证全额成交。选择 venue 并算总差额。',
      answer: 'A 每股 20.0030，总额 40,006；B 每股 20.0035，总额 40,007；选 A，便宜 1 美元。',
    },
  },
  {
    id: 'inventory-hedge',
    mode: 'systems',
    label: '系统实验 01 · Inventory Headroom',
    title: '激活完整 bid 之前，至少要先成交并确认多少份整数 hedge？',
    brief: 'agent 当前库存 q=+12 股，计划激活一张可一次成交 15 股的完整 bid，并按 worst case 假定它随后立即全部成交。有效库存绝对值不得超过 20 股。每份 short hedge 精确抵消 5 股，只允许非负整数份；所有 hedge 必须先成交并收到权威确认，策略随后才激活 bid。无基差、费用、hedge 最小名义或确认后的新延迟。',
    facts: [
      { label: 'Current q', value: '+12', note: '多头' },
      { label: 'Potential bid fill', value: '+15', note: '买入增加库存' },
      { label: 'Hedge / limit', value: '−5 each / |q|≤20', note: '整数份' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '无需 hedge；12 尚未超过 20', diagnosis: '硬限额要读取候选 quote 的 worst-case fill。完整 bid 成交会把库存推到 27。' },
      { id: 'b', label: 'short 1 份；成交后有效库存为 22', diagnosis: '22 仍大于绝对限额 20，动作不可行。' },
      { id: 'c', label: 'short 至少 2 份；成交后有效库存为 17', diagnosis: '正确。27−2×5=17；一份不够，两份是最小整数可行解。' },
    ],
    calculation: '未对冲候选库存=12+15=27；求最小整数 n≥0 使 |27−5n|≤20，得到 n≥1.4，因此 n=2，有效库存 17。',
    reveal: '硬限额先筛可行集，再谈期望利润。普通跨 venue quote 与 hedge 不保证原子成交；只有已成交并确认、或由真实市场机制保证原子执行的 hedge 才能预先释放 headroom，否则必须让 quote 的未对冲 worst case 自身合规。',
    revisit: '回看 14、32、42「可行集、hedge 与 pre-trade controls」。',
    staticTwin: {
      title: '变式 06 · 空头与整数 long hedge',
      prompt: '当前 q=−14；计划激活的完整 ask 若成交会再卖出 12 股；|有效库存|≤20。每份 long hedge 精确抵消 4 股，允许非负整数份，但必须先成交并确认后才激活 ask。求最小份数和 worst-case 有效库存。',
      answer: '未对冲库存=−26；需最小 n 使 |−26+4n|≤20，n≥1.5，所以 long 2 份；有效库存=−18。',
    },
  },
  {
    id: 'message-throttle',
    mode: 'systems',
    label: '系统实验 02 · Message Budget',
    title: '消息余量不足时，为什么不能把半套双边 reprice 当作完整动作？',
    brief: '这是纯教学阈值，不对应任何真实 venue 或法域。假设单一 port 的滚动一秒 outbound message cap 为 100，所有 add/cancel 权重均为 1，当前窗口已使用 94 条；越界请求会被拒绝，窗口按事件时间滚动退出。一次题设双边原子 reprice 必须包含 cancel bid、cancel ask、new bid、new ask，共 4 条；不允许只更新一侧，不计 ack、reject 或 burst allowance。问还能完成几次完整 reprice。',
    facts: [
      { label: 'Limit', value: '100 / second', note: '滚动窗口' },
      { label: 'Used', value: '94', note: '余量 6' },
      { label: 'Atomic action', value: '4 messages', note: '不能拆半' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '只能完成 1 次；剩 2 条但不能组成第二次完整动作', diagnosis: '正确。floor((100−94)/4)=1；离散动作必须作为整体进入可行集。' },
      { id: 'b', label: '能完成 1.5 次，因为 6/4=1.5', diagnosis: '消息和原子重报价不能取连续份数；半次动作被题设禁止。' },
      { id: 'c', label: '能完成 6 次，因为一对 bid/ask 只算一条消息', diagnosis: '题设已经逐项冻结为四条 outbound messages，不能把策略意图当成交易所消息计数。' },
    ],
    calculation: 'message headroom=100−94=6；完整动作数=floor(6/4)=1；执行后剩余 headroom=2。',
    reveal: '真实 message budget 可能按 port、session、symbol、订单类型或滚动窗口定义，且 reject/cancel/replace 的计数规则各异；节流状态本身会改变撤单能力和 stale-quote 风险。',
    revisit: '回看 13、43「系统状态与消息／节流控制」。',
    staticTwin: {
      title: '变式 07 · 离散消息动作',
      prompt: '仍是同一纯教学、单 port、等权滚动窗口。滚动一秒上限 120，已使用 111；一次完整双边 reprice 仍需 4 条且不可拆分。最多完成几次，剩余几条余量？',
      answer: '余量 9；floor(9/4)=2 次完整 reprice，使用 8 条，剩余 1 条。',
    },
  },
  {
    id: 'liquidity-mirage',
    mode: 'systems',
    label: '系统实验 03 · Shared Risk Capacity',
    title: '跨 venue 重复报价共享同一风险预算时，显示深度高估多少？',
    brief: '同一 maker 在 venue A、B 各显示 500 股 ask，但共享风险预算只允许两处合计成交 500 股；除此之外，A 有独立 maker 的 300 股，B 有另一独立 maker 的 400 股。冻结各报价真实、无补单、无隐藏量、两个 venue 同时可达。求显示总深度、同一状态下 actionable depth 与高估比例。',
    facts: [
      { label: 'Shared maker', value: '500 + 500 displayed', note: '合计最多成交 500' },
      { label: 'Independent', value: '300 + 400', note: '可同时成交' },
      { label: 'No replenishment', value: 'frozen', note: '同一市场状态' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '显示与有效深度都为 1,700；所有挂单都必须同时兑现', diagnosis: '忽略两个 500 报价共享同一库存／风险容量；一处成交可以合法触发另一处撤单。' },
      { id: 'b', label: '显示 1,700，有效 1,200；高估 500，约占显示深度 29.41%', diagnosis: '正确。共享 maker 只能计一次 500，再加独立 700。' },
      { id: 'c', label: '有效深度只有 700，因为共享 maker 的 1,000 都是假单', diagnosis: '题设明确其报价真实且可在任一处成交 500；共享容量不等于 spoofing 或零可执行性。' },
    ],
    calculation: 'displayed=500+500+300+400=1,700；actionable=500+300+400=1,200；overstatement=500；500/1,700=29.4118%。',
    reveal: 'Liquidity mirage 不是“屏幕上的订单都是假的”，而是相关报价不能在同一状态下同时兑现。识别必须有稳定 agent identity、同步时钟和成交后跨 venue 撤单路径。',
    revisit: '回看 34、49「跨 venue 同步与 liquidity mirage」。',
    staticTwin: {
      title: '变式 08 · 重复显示与可执行容量',
      prompt: '共享 maker 在 A、B 各显示 400 股，但两处合计最多成交 400；独立深度分别为 250 与 350。求 displayed、actionable、高估量和高估比例。',
      answer: 'displayed=400+400+250+350=1,400；actionable=400+250+350=1,000；高估 400，占显示深度 28.5714%。',
    },
  },
  {
    id: 'passive-markout',
    mode: 'systems',
    label: '系统实验 04 · Fill Economics',
    title: '被动成交拿到 spread 与 rebate，为什么十毫秒 markout 后仍可能亏损？',
    brief: 'maker 被动卖出 1,000 股，成交价 100.01；成交前 mid=100.00，10ms 后 mid=100.03；rebate=0.002 美元/股，没有其他 fee、hedge 或 inventory cost。以未来 mid 平仓价值计算本次新增成交的短期经济 P&L。',
    facts: [
      { label: 'Passive sell', value: '1,000 @ 100.01', note: '新增空头' },
      { label: 'Mid', value: '100.00 → 100.03', note: '10ms markout horizon' },
      { label: 'Rebate', value: '+$0.002/share', note: '真实现金流' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '亏损 $18：价差 +$10、随后上行 −$30、rebate +$2', diagnosis: '正确。卖出价低于未来 mid 0.02 美元/股，rebate 只补回 0.002。' },
      { id: 'b', label: '盈利 $12：成交时半价差 $10 加 rebate $2', diagnosis: '只看成交瞬间，忽略成交条件与随后的价格移动；这正是不利选择常被漏掉的地方。' },
      { id: 'c', label: '亏损 $30：未来 mid 上升 0.03', diagnosis: '把价格从成交前 mid 的移动全部归于本单，却漏掉成交价本身高于旧 mid 的 0.01 与 rebate。' },
    ],
    calculation: '新增 sell P&L=(100.01−100.03+0.002)×1,000=−18；等价分解：初始 spread capture +10、mid move −30、rebate +2。',
    reveal: 'Markout 是条件结果，不是私有信息的直接标签；期限、基准、公共新闻、机械 impact 与 hedge 都会改变数值。比较 maker 质量时必须统一 horizon 与符号。',
    revisit: '回看 12、31、40「毒性、markout 与 fee-inclusive P&L」。',
    staticTwin: {
      title: '变式 09 · 被动买入后的负 markout',
      prompt: 'maker 被动买入 2,000 股，成交价 49.99；成交前 mid=50.00，20ms 后 mid=49.96；rebate=.001 美元/股，无其他成本。求新增成交 P&L 并分解。',
      answer: '买入 P&L=(49.96−49.99+.001)×2,000=−58 美元；初始 spread capture +20，mid 下跌损失 −80，rebate +2。',
    },
  },
  {
    id: 'local-feedback',
    mode: 'systems',
    label: '系统实验 05 · Liquidity Feedback',
    title: '同步撤单怎样在冻结的局部 impact law 下放大同一笔需求？',
    brief: '初始 actionable ask depth 为 10,000 股。四个 maker 因同一毒性信号各撤 1,500 股，剩余 4,000。随后到达 8,000 股市场买单。只在本题采用合成式 Δp=0.0005×max(Q−D,0)，系数单位为美元/股的价格变化除以一股超额需求；忽略补单、跨档非线性与其他市场。',
    facts: [
      { label: 'Depth', value: '10,000 → 4,000', note: '先撤单' },
      { label: 'Market buy Q', value: '8,000', note: '随后到达' },
      { label: 'Impact coefficient', value: '$0.0005 / excess share', note: '仅为教学式' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '撤单前后 impact 都为 $4，因为 Q 始终是 8,000', diagnosis: 'impact 式使用超出可执行深度的 Q−D，不是只看订单绝对量。' },
      { id: 'b', label: '撤单前 impact=0；撤单后超额需求 4,000，impact=$2.00', diagnosis: '正确。初始 Q≤D；撤单后 max(8,000−4,000,0)=4,000。' },
      { id: 'c', label: 'impact=$3.00，因为撤单量为 6,000', diagnosis: '撤单量解释深度变化，但公式输入是到达订单超过剩余深度的数量 4,000。' },
    ],
    calculation: '撤单前 max(8,000−10,000,0)=0；撤单后 max(8,000−4,000,0)=4,000；Δp=0.0005×4,000=$2.00/股。',
    reveal: '这只演示“共同撤单→depth 下降→同一订单 impact 上升”的局部正反馈。系数不是经验常数，也不能凭这一题直接宣称已经形成 7.11 的融资—市场流动性系统螺旋。',
    revisit: '回看 47–50「负反馈、正反馈、mirage 与跨市场边界」。',
    staticTwin: {
      title: '变式 10 · 另一组撤单冲击',
      prompt: '初始 depth 9,000；三个 maker 各撤 1,200，剩余 5,400；随后市场买单 Q=7,200。教学式 Δp=.0004×max(Q−D,0)。求撤单前后 impact。',
      answer: '撤单前 Q≤D，impact=0；撤单后超额需求=7,200−5,400=1,800；impact=.0004×1,800=$0.72/股。',
    },
  },
];
