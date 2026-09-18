export type TrendFollowingMode = 'signal' | 'implementation';
export type TrendFollowingChoice = 'a' | 'b' | 'c';

export type TrendFollowingScenario = {
  id: string;
  mode: TrendFollowingMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: TrendFollowingChoice; label: string; diagnosis: string }[];
  correct: TrendFollowingChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const trendFollowingModes: { id: TrendFollowingMode; label: string; title: string; description: string }[] = [
  { id: 'signal', label: 'MODE A', title: '信号与目标仓位', description: '冻结信息时点，把价格路径、合约风险和相关性变成目标合约数。' },
  { id: 'implementation', label: 'MODE B', title: '现金流与反馈订单', description: '加入展期、逐日结算、成本、回撤和共同去杠杆。' },
];

export const trendFollowingScenarios: TrendFollowingScenario[] = [
  {
    id: 'causal-signal-clock',
    mode: 'signal',
    label: '信号实验 01 · Information Cutoff',
    title: '截至 t−1 的路径何时才能成为可执行订单？',
    brief: '冻结一个正值 return index：I(t−61)=100，I(t−1)=108。用 R=(I(t−1)/I(t−61))−1 与 s=sign(R) 生成 60 期方向信号。t−1 收盘值必须完整形成后才可计算；题设不允许用该收盘价同时成交，最早按事前声明的 t 时点执行。',
    facts: [
      { label: 'Start index', value: '100', note: 't−61，正值' },
      { label: 'Known index', value: '108', note: 't−1 收盘后可知' },
      { label: 'Execution', value: 'Earliest t', note: '禁止同收盘前视成交' },
    ],
    options: [
      { id: 'a', label: 'R=8%，s=+1；可以按 t−1 的同一收盘价成交', diagnosis: '信号数值对，但执行时点前视。只有在 t−1 收盘形成后才能知道完整输入。' },
      { id: 'b', label: 'R=8%，s=+1；最早在事前声明的 t 时点执行', diagnosis: '正确。信号使用的最后一项信息必须先于可成交时点。' },
      { id: 'c', label: 'R=8 个指数点，s=0；因为价格没有预测值', diagnosis: 'R 是无量纲收益率，不是指数点；方向规则不需要输出未来价格点估计。' },
    ],
    correct: 'b',
    calculation: 'R=108/100−1=0.08=8%；sign(0.08)=+1。由于 108 到 t−1 收盘后才完整可知，最早执行时点是 t。',
    reveal: 'Trend signal 是一条因果 policy 的输入，不是对下一价格的保证。信号、目标仓位和真实成交必须使用不同时间戳，才能避免把未来信息偷渡进回测。',
    revisit: '回看 15–17「信息边界、可交易收益链与价格定义域」。',
    staticTwin: {
      title: '变式 01 · 负方向信号',
      prompt: 'I(t−61)=95，I(t−1)=90；仍规定 t−1 收盘形成后，最早在 t 执行。求 R、s 与最早执行时点。',
      answer: 'R=90/95−1=−0.0526316，约 −5.263%；s=−1；最早在 t 执行。',
    },
  },
  {
    id: 'contract-pnl-notional',
    mode: 'signal',
    label: '合约实验 02 · Notional、P&L 与 Margin',
    title: '同一张期货合约为什么同时有名义金额、现金损益和保证金占用？',
    brief: '使用抽象教学合约，不对应任何现行产品：报价从 4,000 点结算到 4,020 点，multiplier 为每点 50 美元，持有 3 张多头。上一结算价名义金额按 |N|M|F(t−1)|；逐日损益按 NMΔF。每张 initial margin requirement 冻结为 15,000 美元；为满足该要求而提交的合格 collateral 仍属于账户权益，不作为购入合约的价款从 NAV 扣除，真实 eligibility、haircut、segregation 与 FCM 条款另行核对。',
    facts: [
      { label: 'Position', value: '+3 contracts', note: '多头' },
      { label: 'Multiplier', value: '$50 / point', note: '抽象合约规格' },
      { label: 'Settlement', value: '4,000 → 4,020', note: '上涨 20 点' },
      { label: 'IM requirement', value: '$15,000 each', note: '不是 NAV 分母' },
    ],
    options: [
      { id: 'a', label: 'P&L=$60,000；notional=$600,000；margin return=100%', diagnosis: '把 20 点价格变化重复乘了一次才得到 $60,000；而且 $60,000/$45,000=133.33%，也不等于所写 100%。' },
      { id: 'b', label: 'P&L=$3,000；notional=$45,000；因此 NAV return=6.67%', diagnosis: '45,000 是总 initial margin requirement，不是合约 notional，也不是基金 NAV。' },
      { id: 'c', label: 'P&L=$3,000；notional=$600,000；P&L/required IM=6.67%，但这不是 NAV return', diagnosis: '正确。三种量的单位都可为美元，但经济含义和分母不同。' },
    ],
    correct: 'c',
    calculation: 'P&L=3×$50×(4,020−4,000)=$3,000；notional=3×$50×4,000=$600,000；total IM=3×$15,000=$45,000；3,000/45,000=6.667%。',
    reveal: 'Futures notional 不等于投入资本、风险或最大损失；initial margin 是风险要求，不是购买价款，为满足要求而提交的合格 collateral 也不能被重复扣出权益。真实 NAV return 必须使用完整账户权益作分母，并加入现金利息、成本和其他头寸。',
    revisit: '回看 26–28 与 37–40「合约规格、名义金额、逐日损益和账户权益」。',
    staticTwin: {
      title: '变式 02 · 空头合约',
      prompt: '抽象合约 multiplier=$100/点，持有 2 张空头；结算价 100→98.8，每张 required initial margin=$2,000。求逐日 P&L、旧价 notional 与 P&L/required IM，并说明最后一个比率的边界。',
      answer: 'N=−2，ΔF=−1.2，所以 P&L=(−2)×100×(−1.2)=+$240；notional=2×100×100=$20,000；总 IM=$4,000，P&L/IM=6%，但不是 NAV return。',
    },
  },
  {
    id: 'dollar-vol-sizing',
    mode: 'signal',
    label: '仓位实验 03 · Dollar-vol Sizing',
    title: '方向信号怎样经每张合约风险预算变成目标合约数？',
    brief: '冻结正价格教学合约：F=4,000，M=$50/点，报价币就是账户基准币，年化收益波动 σ=20%。把每张合约的一阶年化 dollar volatility 定义为 v$=|F|Mσ。某市场风险预算 B$=$200,000，方向信号 s=−1；忽略取整外的其他上限。',
    facts: [
      { label: 'Signal', value: '−1', note: '目标做空' },
      { label: 'Contract', value: '4,000 × $50', note: '$200,000 notional' },
      { label: 'Annual vol', value: '20%', note: '与风险预算同期限' },
      { label: 'Risk budget', value: '$200,000', note: 'annual dollar vol' },
    ],
    options: [
      { id: 'a', label: 'v$=$40,000；目标 −5 张', diagnosis: '正确。先用绝对值求每张风险，再由 s 决定方向。' },
      { id: 'b', label: 'v$=$10,000；目标 −20 张', diagnosis: '把 20% 错当成 5% 或混淆 multiplier 与波动率。' },
      { id: 'c', label: 'v$=$40,000；目标 +5 张', diagnosis: '合约数绝对值对，但丢掉了负方向信号。' },
    ],
    correct: 'a',
    calculation: 'v$=4,000×$50×20%=$40,000；N~=s×B$/v$=(−1)×200,000/40,000=−5 张。',
    reveal: 'Inverse-vol sizing 只是把给定信号映射到风险尺度。若产品可能出现零或负价、报价非线性或利率期货有特殊 tick/DV01，必须改用价格变化风险或交易所风险单位，不能盲目套 |F|Mσ。',
    revisit: '回看 27–33「名义、单位风险、目标仓位和定义域」。',
    staticTwin: {
      title: '变式 03 · 正方向目标',
      prompt: 's=+1，B$=$150,000，F=100，M=$1,000/点，年化波动 25%，汇率为 1；忽略其他上限。求 v$ 和未取整目标合约数。',
      answer: 'v$=100×1,000×25%=$25,000；N~=+150,000/25,000=+6 张。',
    },
  },
  {
    id: 'portfolio-vol-scaling',
    mode: 'signal',
    label: '组合实验 04 · Volatility Scaling',
    title: '组合预测波动高于目标时，gross 应缩到多少？',
    brief: '未缩放基准组合的预测波动 σ̂p0=15%，目标 σ*=10%，两者同期限、同年化、同收益口径且 σ̂p0>0。未缩放 gross G0=3,000 万元，kmax=1；假设全部头寸同比例缩放时预测波动一阶同比例缩放，且没有更紧的 margin、容量或集中度约束。',
    facts: [
      { label: 'Forecast vol', value: '15%', note: '未缩放基准组合' },
      { label: 'Target vol', value: '10%', note: '同口径' },
      { label: 'Unscaled gross', value: '¥30m', note: '同比例缩放' },
    ],
    options: [
      { id: 'a', label: 'k=0.50；新 gross=1,500 万元；减仓 50%', diagnosis: '把 10/15 错算成 1/2。' },
      { id: 'b', label: 'k=2/3；新 gross=2,000 万元；减仓 1,000 万元或 33.33%', diagnosis: '正确。目标低于预测波动，规模按比率缩小。' },
      { id: 'c', label: 'k=1.50；新 gross=4,500 万元；因为波动越高越应加仓', diagnosis: '方向反了，而且违反 kmax=1。' },
    ],
    correct: 'b',
    calculation: 'k=min(1,10%/15%)=2/3；new gross=30m×2/3=20m；reduction=10m，reduction rate=10/30=33.333%。',
    reveal: '组合波动缩放是目标规则，不保证事后波动命中。它依赖协方差估计、同质缩放与可成交性；这些输入在压力中改变时，目标本身会移动。',
    revisit: '回看 32–36「波动估计、组合目标和相关性」。',
    staticTwin: {
      title: '变式 04 · 相同比率的风险收缩',
      prompt: '未缩放预测波动 18%，目标 12%，kmax=1，未缩放 gross 2,500 万元；其他约束不绑定。求 k、新 gross、减仓额与减仓比例。',
      answer: 'k=12/18=2/3；新 gross=1,666.67 万元；减仓约 833.33 万元，比例 33.333%。',
    },
  },
  {
    id: 'correlation-aggregation',
    mode: 'signal',
    label: '组合实验 05 · Correlation',
    title: '两个低相关市场为什么能降低组合波动，而相关性上升又会拿走这项分散？',
    brief: '两个 sleeve 的年化收益波动都为 8%，组合权重各 0.5，相关系数 ρ=0；权重、波动、相关性使用同一收益口径和年化规则。用 σp²=w1²σ1²+w2²σ2²+2w1w2σ1σ2ρ，忽略其他资产。',
    facts: [
      { label: 'Sleeve vols', value: '8% / 8%', note: '同口径年化' },
      { label: 'Weights', value: '0.5 / 0.5', note: '冻结权重' },
      { label: 'Correlation', value: '0', note: '无协方差项' },
    ],
    options: [
      { id: 'a', label: 'σp=4%，因为 8%×0.5=4%', diagnosis: '只保留一个 sleeve，漏掉第二个方差项。' },
      { id: 'b', label: 'σp=8%，因为两个波动率相同', diagnosis: '把收益波动直接平均，忽略了独立方差的平方根聚合。' },
      { id: 'c', label: 'σp≈5.657%', diagnosis: '正确。两个零相关的等权风险源按方差而不是波动率相加。' },
    ],
    correct: 'c',
    calculation: 'σp²=0.5²×0.08²+0.5²×0.08²=0.0032；σp=√0.0032=0.0565685≈5.657%。',
    reveal: '分散不是市场数量，而是共同状态下的协方差结构。若压力时相关性升高，原先按低相关估出的组合 multiplier 可能过大，并触发下一轮同比例减仓。',
    revisit: '回看 34–36「组合波动、相关性与 risk contribution」。',
    staticTwin: {
      title: '变式 05 · 相关性抬升',
      prompt: '仍是两个 8% 年化波动 sleeve、权重各 0.5，但 ρ=0.5。求组合年化波动。',
      answer: 'σp²=0.25×0.08²+0.25×0.08²+2×0.5×0.5×0.08×0.08×0.5=0.0048；σp=√0.0048≈6.928%。',
    },
  },
  {
    id: 'roll-basis-cashflow',
    mode: 'implementation',
    label: '实现实验 06 · Roll、Basis 与 Cash Flow',
    title: '远月比近月贵，为什么展期当场不等于凭空亏掉远近月价差？',
    brief: '同一时点 spot=99、近月=100、远月=102。持有 4 张近月多头，multiplier=1,000；现在按各自市场价格平近月、开同数量远月。题目只隔离“远近月价格缺口是否形成独立 roll cash P&L”，忽略旧腿此前 mark-to-market、bid–ask、fee、slippage 与保证金变化。次日远月结算为 101.5。',
    facts: [
      { label: 'Spot / near / far', value: '99 / 100 / 102', note: '同一时点' },
      { label: 'Position', value: '+4 contracts', note: '平近月、开远月' },
      { label: 'Next far settle', value: '101.5', note: '新仓次日 −0.5' },
    ],
    options: [
      { id: 'a', label: '近月 basis=1；展期立即亏 $8,000；次日再亏 $2,000', diagnosis: '把 calendar spread 当成展期当天的独立现金损益。新旧合约是分别成交的两个头寸。' },
      { id: 'b', label: '近月 basis=1、calendar spread=2；价格缺口本身的即时 P&L=0；次日新仓 P&L=−$2,000', diagnosis: '正确。真实展期日仍有旧腿当日 P&L 和两腿成本，但题设已隔离。' },
      { id: 'c', label: '近月 basis=3、calendar spread=1；次日 P&L=+$2,000', diagnosis: 'basis 与 calendar spread 都算错，且多头在远月下跌时应亏损。' },
    ],
    correct: 'b',
    calculation: 'near basis=100−99=1；calendar spread=102−100=2。开远月本身不把 2×4×1,000 记成独立 P&L。次日 P&L=4×1,000×(101.5−102)=−$2,000。',
    reveal: 'Term structure 会通过持有期间各合约的价格变化进入收益，但“roll yield”不是展期当天收付的远近月价差。连续合约的调整跳空也不是可成交现金流。',
    revisit: '回看 41–44「basis、calendar spread、roll 与连续合约」。',
    staticTwin: {
      title: '变式 06 · Backwardation 不等于即时收入',
      prompt: 'spot=99、近月=100、远月=98；4 张近月多头以同数量展到远月，multiplier=1,000，忽略旧腿当日损益与全部成本。次日远月=98.5。求近月 basis、calendar spread、价格缺口本身的即时 P&L 与次日新仓 P&L。',
      answer: 'near basis=1；calendar spread=98−100=−2；价格缺口本身即时 P&L=0；次日新仓 P&L=4×1,000×0.5=+$2,000。',
    },
  },
  {
    id: 'variation-margin-nav',
    mode: 'implementation',
    label: '现金流实验 07 · Variation Margin 与 NAV',
    title: '逐日结算、抵押品和现金利息怎样共同更新账户权益？',
    brief: '期初 NAV=$1,000,000，其中 $120,000 合格 collateral 已为满足 initial margin requirement 而提交；该 collateral 仍属于账户权益，不作为费用扣除。题设为得到唯一答案，另行冻结全部 $1,000,000 均可按 3.6% 年利率、ACT/360 计一天利息；真实 eligibility、haircut、segregation 与 FCM 条款不由本题推断。当日期货 settlement variation=+$30,000，忽略税、管理费和其他成本。',
    facts: [
      { label: 'Opening NAV', value: '$1,000,000', note: '完整权益分母' },
      { label: 'Posted collateral', value: '$120,000', note: '为满足 IM 要求；不重复扣 NAV' },
      { label: 'Cash rate', value: '3.6% / ACT-360', note: '题设全额计息一天' },
      { label: 'Variation', value: '+$30,000', note: '当日现金结算' },
    ],
    options: [
      { id: 'a', label: '期末 NAV=$910,100，因为先扣 initial margin', diagnosis: 'Initial margin 是风险要求；为满足它而提交的合格 collateral 仍属于账户权益，不是购买合约的支出。' },
      { id: 'b', label: '期末 NAV=$1,030,000，因为抵押品不影响权益', diagnosis: '抵押品处理对，但漏掉题设明确的 $100 一天现金利息。' },
      { id: 'c', label: '期末 NAV=$1,030,100', diagnosis: '正确。加 variation 和题设现金利息，不把为满足 initial margin requirement 而提交的 collateral 再扣一次。' },
    ],
    correct: 'c',
    calculation: 'cash interest=$1,000,000×3.6%×(1/360)=$100；ending NAV=1,000,000+30,000+100=$1,030,100。',
    reveal: 'Variation margin 是逐日现金流，initial margin 是风险要求，为满足要求而提交的 collateral 是账户资产，collateral return 又是另一项收益。真实账户还要按合格及可计息余额、币种、haircut、segregation、费用与 FCM 条款逐项建模。',
    revisit: '回看 37–40「逐日损益、保证金、抵押品收益与 NAV」。',
    staticTwin: {
      title: '变式 07 · 亏损日与成本',
      prompt: '期初 NAV=$1,000,000；为满足 initial margin requirement 而提交的 collateral 仍属于权益；当日 variation=−$25,000，现金利息=+$100，明确成本=$400。求期末 NAV。',
      answer: 'ending NAV=1,000,000−25,000+100−400=$974,700；为满足 initial margin requirement 而提交的 collateral 不重复扣除。',
    },
  },
  {
    id: 'turnover-cost',
    mode: 'implementation',
    label: '实现实验 08 · Turnover 与 Cost',
    title: '目标合约变化怎样变成总绝对成交名义与净成本？',
    brief: '旧仓 [4,−3] 张，目标仓 [1,−5] 张，目标差生成订单 ΔNorder=[−3,−2]；题设另外冻结两笔订单全部成交，所以 ΔNfill=[−3,−2]。市场 A 每张冻结正值交易单位 $250,000，市场 B 每张 $100,000；分母固定为交易前 NAV $5,000,000。TOabs 定义为全部买卖的总绝对成交名义除以该 NAV，不偷换成 one-way。成本模型明确为“总绝对成交名义的 6 bp + 每张实际成交合约 $4 fee”，两项不重叠，roll 不另计。',
    facts: [
      { label: 'Filled contracts', value: 'A −3 / B −2', note: '订单全部成交，共 5 张' },
      { label: 'Unit notionals', value: '$250k / $100k', note: '冻结成交时点' },
      { label: 'NAV denominator', value: '$5m', note: '期初权益' },
      { label: 'Cost', value: '6 bp + $4/contract', note: '互不重叠' },
    ],
    options: [
      { id: 'a', label: '总绝对成交名义 $950,000；TOabs 19%；总成本 $590', diagnosis: '正确。逐市场先取 |ΔN|，再乘正值交易单位；19% 不再除以二。' },
      { id: 'b', label: '成交名义 $95,000；turnover 1.9%；总成本 $77', diagnosis: '把合约名义缩小十倍，随后所有结果都被缩小。' },
      { id: 'c', label: '成交名义 $1,300,000；turnover 26%；总成本 $808', diagnosis: '这是旧仓绝对名义 4×250,000+3×100,000 及其成本，不是目标与现仓之差产生的真实成交。' },
    ],
    correct: 'a',
    calculation: 'Vabs=|−3|×250,000+|−2|×100,000=$950,000；TOabs=950,000/5,000,000=19%；6 bp cost=950,000×0.0006=$570；fees=5×$4=$20；total=$590。',
    reveal: 'Signal 不等于 turnover；目标仓与当前仓之差先生成订单，只有实际 fills 才进入本文按成交定义的 turnover。未成交订单的提交、修改与撤销仍可能改变报价和深度，但必须进入另一套 order-book-event 账本。总绝对成交、buy-side、sell-side 与机构所谓 one-way 是不同口径；还必须声明 roll 是否单列，以及 bp 成本是否已经包含 spread、fee 或 impact。',
    revisit: '回看 45–47「turnover、成本、容量与目标订单」。',
    staticTwin: {
      title: '变式 08 · 翻向与新增仓位',
      prompt: '旧仓 [2,1]，目标 [−1,3]；题设冻结目标差订单全部成交。A/B 每张正值交易单位分别 $200,000/$80,000，交易前 NAV=$4,000,000。成本为总绝对成交名义 5 bp 加每张成交 $3 fee，二者不重叠。求 Vabs、TOabs 和总成本。',
      answer: 'ΔN=[−3,+2]，Vabs=3×200,000+2×80,000=$760,000；TOabs=760,000/4,000,000=19%；比例成本=$380，fee=$15，总成本=$395。',
    },
  },
  {
    id: 'drawdown-path',
    mode: 'implementation',
    label: '路径实验 09 · Drawdown',
    title: '为什么终点收益相同也可能经历完全不同的生存约束？',
    brief: '冻结 NAV 路径（百万元）：10.00 → 10.50 → 9.45 → 9.80。运行峰值 Ht=max(Eu,u≤t)，drawdown DDt=1−Et/Ht；求全路径最大回撤和末点回撤。',
    facts: [
      { label: 'Peak NAV', value: '¥10.50m', note: '第二个时点' },
      { label: 'Trough NAV', value: '¥9.45m', note: '峰后最低点' },
      { label: 'Ending NAV', value: '¥9.80m', note: '尚未回到峰值' },
    ],
    options: [
      { id: 'a', label: '最大回撤 5%；末点回撤 2%', diagnosis: '错误地用初始 NAV 或相邻变化作分母，没有使用运行峰值。' },
      { id: 'b', label: '最大回撤 10%；末点回撤约 6.667%', diagnosis: '正确。最大回撤发生在 10.50→9.45，末点仍相对峰值低 0.70。' },
      { id: 'c', label: '最大回撤 11.11%；末点回撤 7.143%', diagnosis: '把 trough 或 ending NAV 当分母；drawdown 的分母应是此前峰值。' },
    ],
    correct: 'b',
    calculation: 'MDD=1−9.45/10.50=10%；ending DD=1−9.80/10.50=0.0666667≈6.667%。',
    reveal: 'Drawdown 是路径状态，不是某个固定期限收益。赎回、margin、风险限额和职业约束会在途中响应，因此“后来涨回来”不能逆转已经发生的被迫减仓。',
    revisit: '回看 49–51「反转、波动反馈与权益去杠杆」。',
    staticTwin: {
      title: '变式 09 · 同幅度不同尺度',
      prompt: 'NAV（百万元）路径为 8.00→8.40→7.56→7.90。求最大回撤与末点回撤。',
      answer: 'MDD=1−7.56/8.40=10%；ending DD=1−7.90/8.40≈5.952%。',
    },
  },
  {
    id: 'equity-vol-deleveraging',
    mode: 'implementation',
    label: '反馈实验 10 · Equity × Vol Deleveraging',
    title: '方向信号不变时，权益下降和单位风险上升怎样共同制造卖单？',
    brief: '为隔离一条可唯一计算的订单链，本题把每家基金简化为同一市场的一只正向多头篮子，全部 gross 都是该篮子的正值名义，且所有减仓在同一窗口成交。组合构成、方向信号和目标风险率保持不变。参考权益 Eref=1,000 万元、已按目标校准的 gross Gref=4,000 万元、每单位 gross 风险 νref=10%；随后权益 Et=900 万元、同口径单位 gross 风险 νt=15%。假设目标 dollar risk 与权益成比例、风险对 gross 一阶同质，且没有更紧上限，因此 Gt*=Gref×(Et/Eref)×(νref/νt)。四家同型基金各执行相同减仓；用正值订单单位“百万元名义”，卖出 Q<0，冻结 Λ=+0.02%/百万元、u=0。',
    facts: [
      { label: 'Equity', value: '¥10m → ¥9m', note: '下降 10%' },
      { label: 'Unit-gross risk', value: '10% → 15%', note: '同口径上升' },
      { label: 'Long-basket gross', value: '¥40m', note: '同一市场、全部为正向多头名义' },
    ],
    options: [
      { id: 'a', label: '每家新 gross=2,666.67 万元；总 Q=−5,333.33 万元；impact≈−1.067%', diagnosis: '漏掉权益从 1,000 万降到 900 万的比例，规模仍过大。' },
      { id: 'b', label: '每家新 gross=2,400 万元；总 Q=−6,400 万元；impact=−1.28%', diagnosis: '正确。权益与单位风险先共同缩放，再聚合四家的实际卖单。' },
      { id: 'c', label: '每家新 gross=3,600 万元；总 Q=−1,600 万元；impact=−0.32%', diagnosis: '只按权益缩放，漏掉单位 gross 风险上升。' },
    ],
    correct: 'b',
    calculation: '每家 Gt*=40m×(9/10)×(10%/15%)=24m，卖出 16m；四家 signed Q=4×(−16)=−64 个百万元；ΛQ=(+0.02%)×(−64)=−1.28%。',
    reveal: '这条订单不是新的看空判断：即使趋势信号完全不变，权益与单位风险也会缩小可行 gross。线性 impact 只是一座因果桥；真实 Λ 会随深度、执行速度和对手方反应内生变化，且目标订单不等于成交。',
    revisit: '回看 47–53「目标与订单、vol-scaling、drawdown、crowding 与 crisis alpha」。',
    staticTwin: {
      title: '变式 10 · 相同 40% 去杠杆',
      prompt: '仍把每家基金简化为同一市场的一只正向多头篮子，全部 gross 是该篮子的正值名义，减仓在同一窗口成交。Eref=2,000 万元、Et=1,800 万元；νref=12%、νt=18%；已校准 Gref=6,000 万元。三家同型基金、组合与信号不变，风险同质且无其他上限；Λ=+0.01%/百万元、u=0。求每家新 gross、减仓比例、总 signed Q 与线性 impact。',
      answer: '每家 Gt*=60m×(18/20)×(12/18)=36m，减仓 24m 或 40%；三家 Q=3×(−24)=−72 个百万元；ΛQ=(+0.01%)×(−72)=−0.72%。',
    },
  },
];
