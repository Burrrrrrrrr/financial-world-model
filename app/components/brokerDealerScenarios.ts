export type DealerMode = 'balance-sheet' | 'constraints';
export type DealerChoice = 'a' | 'b' | 'c';

export type DealerScenario = {
  id: string;
  mode: DealerMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: DealerChoice;
  options: { id: DealerChoice; label: string; diagnosis: string }[];
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const dealerModes: { id: DealerMode; label: string; title: string; description: string }[] = [
  { id: 'balance-sheet', label: 'MODE 01', title: '从融资到库存', description: 'repo、matched book、报价、净资本与客户储备' },
  { id: 'constraints', label: 'MODE 02', title: '从约束到订单', description: 'margin、VaR、杠杆、CCP 现金与容量分支' },
];

export const brokerDealerScenarios: DealerScenario[] = [
  {
    id: 'repo-haircut',
    mode: 'balance-sheet',
    label: '账本实验 01 · Repo haircut',
    title: 'haircut 从 5% 升到 10% 后，融资容量和追加抵押品分别怎样变化？',
    brief: 'dealer 原先以市值 100 百万美元的抵押品获得 95 百万美元 repo 现金。融资方把 haircut 从 5% 提高到 10%；新增与原抵押品适用同一 haircut，价格、币种、资格、应计利息、费用和其他保证金均不变，也不允许现金还款。分别回答“仍只交付 100 抵押品”和“仍要借到 95 现金”两个问题；使用连续解、无最小转移单位。',
    facts: [
      { label: 'Collateral value', value: '100', note: '百万元，价格不变' },
      { label: 'Haircut', value: '5% → 10%', note: '融资折扣，不是净资本 haircut' },
      { label: 'Target cash', value: '95', note: '第二问保持不变' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '融资容量仍为 95；若保持借款 95，只需追加 5 抵押品', diagnosis: '忽略了新 haircut。100 抵押品只能支持 90 现金；追加额还要用 95/0.90 重新求所需抵押品，而不是把 5 的现金差直接当作抵押品。' },
      { id: 'b', label: '融资容量降至 90；若保持借款 95，抵押品需 105.56，追加约 5.56', diagnosis: '正确。haircut 作用于抵押品市值；维持固定现金时，所需抵押品按 F/(1−h) 非线性增加。' },
      { id: 'c', label: '融资容量降至 90；若保持借款 95，必须追加 10 抵押品', diagnosis: '10 是 haircut 的百分点，不是追加抵押品金额。必须先把固定融资 95 除以 90%。' },
    ],
    calculation: '新融资容量=100×(1−10%)=90；固定借款 95 所需抵押品=95/0.90=105.5556；追加=105.5556−100=5.5556。',
    reveal: 'Repo haircut 回答“抵押品能换多少现金”。它与价格跌幅、客户保证金、CCP initial margin 和 Rule 15c3-1 的证券扣减不是同一个量。',
    revisit: '回看 15、18–20「haircut、matched book、净额与抵押品再使用」。',
    staticTwin: {
      title: '变式 01 · 固定融资下的抵押品追加',
      prompt: 'dealer 要维持 90 百万美元 repo 融资。haircut 从 4% 提高到 8%，抵押品价格不变。计算调整前、调整后所需抵押品和追加额。',
      answer: '调整前=90/0.96=93.7500；调整后=90/0.92=97.8261；需追加约 4.0761 百万美元抵押品。',
    },
  },
  {
    id: 'matched-book',
    mode: 'balance-sheet',
    label: '账本实验 02 · Matched book',
    title: '方向性库存近似为零时，matched-book repo 为什么仍有开仓本金简表和融资成本？',
    brief: 'dealer 在期初用 5 百万美元既有自有现金，加上 95 百万美元 repo 融资，向客户提供 100 百万美元 reverse repo。客户年率 5%，dealer 的 repo 年率 4%；期限同为一年且期内余额不变。先写开仓本金简表，再计算一年利息损益；利息于期末确认且未分配时才进入权益。忽略违约、haircut 变化、费用、税收和复利。',
    facts: [
      { label: 'Reverse repo asset', value: '100 @ 5%', note: '向客户提供现金融资' },
      { label: 'Repo liability', value: '95 @ 4%', note: '从现金提供者融资' },
      { label: 'Equity cash', value: '5', note: '既有资金，不是本笔利润' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '资产与负债可完全抵销为零，因为没有方向性证券库存', diagnosis: '经济方向接近匹配，不等于会计、法律和监管净额条件已经满足。reverse repo 资产 100 与 repo 负债 95 仍存在。' },
      { id: 'b', label: '年化净利息为 1，因为客户利率只比融资利率高 1 个百分点', diagnosis: '1 个百分点不能直接乘以 100：dealer 只有 95 负债按 4% 计息，另有 5 自有资金。应分别计算两条现金流。' },
      { id: 'c', label: '开仓本金简表为资产 100、负债 95、既有权益资金 5；一年净利息为 1.20', diagnosis: '正确。收入 100×5%=5，融资成本 95×4%=3.8，差额 1.2；若期末确认且未分配，权益才由 5 增至 6.2。' },
    ],
    calculation: '开仓：资产=reverse repo 100；负债=repo 95；既有权益资金=5。一年利息损益=100×5%−95×4%=5−3.8=1.2；若全额留存，期末权益=6.2。',
    reveal: 'Matched book 匹配的是某些方向和期限，不是“无风险”。gross balance sheet、净额资格、haircut 差、抵押品返还、对手方和截止时间仍可能首先约束。',
    revisit: '回看 18–20「cash/collateral matched book、gross/netting 与 rehypothecation」。',
    staticTwin: {
      title: '变式 02 · 两条融资腿分别计息',
      prompt: 'dealer 用 5 自有现金和 75 repo 融资，向客户提供 80 reverse repo。客户年率 4.8%，repo 年率 3.6%，期限一年、余额不变，忽略其他项目。写出简表和年化净利息。',
      answer: '开仓本金简表为资产 80、repo 负债 75、既有权益资金 5；收入=80×4.8%=3.84，成本=75×3.6%=2.70，一年净利息=1.14；若全额留存，期末权益=6.14。',
    },
  },
  {
    id: 'inventory-quote',
    mode: 'balance-sheet',
    label: '账本实验 03 · Inventory quote',
    title: '多头库存上升时，dealer 是先整体下移报价，还是必然扩大 spread？',
    brief: '使用冻结教学压缩式 r=m−κq，bid=r−s₀/2，ask=r+s₀/2，目标库存 q*=0。外部参考中价 m=100.00，基础 full spread s₀=0.20 美元（因此 half-spread 为 0.10 美元，而非 10 bp），dealer 多头库存 q=+4，κ=0.05 美元/库存单位。忽略信息、竞争、外部订单簿可成交性、离散 tick 和非线性风险。',
    facts: [
      { label: 'Reference mid', value: '100.00', note: '外部共同价值代理' },
      { label: 'Inventory', value: 'q = +4', note: '正号代表 dealer 多头' },
      { label: 'Sensitivity', value: 'κ = 0.05', note: '美元/库存单位' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'reservation price=99.80，bid=99.70，ask=99.90；spread 仍为 0.20', diagnosis: '正确。多头 dealer 更愿意卖、较不愿继续买，因此中心价下移 0.20；本题冻结的基础 spread 没有变化。' },
      { id: 'b', label: 'bid=99.90、ask=100.10；库存只会扩大成交量，不影响中心价', diagnosis: '删除了库存项 κq。题设明确要求库存进入 reservation price。' },
      { id: 'c', label: 'bid=99.80、ask=100.20；spread 扩大到 0.40', diagnosis: '把中心价下移与 spread 扩大混为同一动作。本题只给出 quote skew，没有给 spread 对库存的二阶反应。' },
    ],
    calculation: 'r=100−0.05×4=99.80；bid=99.80−0.10=99.70；ask=99.80+0.10=99.90；spread=0.20。',
    reveal: '报价可以通过移动中心、改变宽度和改变可成交 size 三个边际响应。库存风险只是一种机制；adverse selection 和订单处理成本也能产生 spread。',
    revisit: '回看 21–25「库存目标、reservation price、spread 与 price impact」。',
    staticTwin: {
      title: '变式 03 · 空头库存的报价上移',
      prompt: 'm=50.00，基础 full spread s₀=0.16（half-spread=0.08），q=−3，κ=0.04。用 r=m−κq、bid=r−s₀/2、ask=r+s₀/2 计算 reservation price、bid、ask 和 spread。',
      answer: 'r=50−0.04×(−3)=50.12；bid=50.04，ask=50.20，spread=0.16。空头 dealer 报价整体上移以吸引卖盘、抑制继续卖出。',
    },
  },
  {
    id: 'net-capital-headroom',
    mode: 'balance-sheet',
    label: '账本实验 04 · Net capital',
    title: '为什么 adjusted net worth 20 不能直接当作 tentative 或最终 net capital？',
    brief: '某美国 broker-dealer 的冻结两步教学桥：按题设规则调整后的净值 adjusted net worth 为 20 百万美元；先扣除 2 的 nonallowable assets／其他 pre-haircut deductions 得到 tentative net capital，再扣除 3 的适用 securities haircuts／post-TNC charges 得到 net capital；两类扣减互不重叠。12 已是所有适用 greater-of tests 中本题 binding 的净资本要求。忽略早期预警与题外规则。',
    facts: [
      { label: 'Adjusted net worth', value: '20', note: '尚未形成 TNC' },
      { label: 'Pre-/post-TNC deductions', value: '2 / 3', note: '顺序不可互换或重复扣除' },
      { label: 'Applicable minimum', value: '12', note: '只用于本题' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'TNC=20、net capital=17、headroom=5', diagnosis: '把 adjusted net worth 错当成 TNC，因此漏掉了在 TNC 形成前必须扣除的 2。' },
      { id: 'b', label: 'TNC=18、net capital=15、headroom=3', diagnosis: '正确。先扣 pre-haircut 项目得到 TNC=18，再扣 post-TNC 市场风险费用得到 NC=15，最后与要求 12 比较。' },
      { id: 'c', label: 'TNC=18、net capital=12、headroom=0', diagnosis: '前一步正确，但最低要求是阈值，不会把实际 net capital 从 15 自动重写为 12。' },
    ],
    calculation: '教学 TNC=20−2=18；net capital=18−3=15；headroom=15−12=3。',
    reveal: 'Nonallowable assets 等 pre-haircut 项目在 TNC 形成前扣除，不能在已有 TNC 上重复扣一次；正式数值仍必须回到 Rule 15c3-1、适用方法、附录与 FOCUS instructions。',
    revisit: '回看 15、26「净资本与不同 haircut」。',
    staticTwin: {
      title: '变式 04 · 扣减后的净资本余量',
      prompt: 'adjusted net worth 为 18，nonallowable assets／其他 pre-haircut deductions 为 1.5，适用 securities haircuts／post-TNC charges 为 2.5，本题适用最低要求 11.5。计算教学 TNC、net capital 与 headroom。',
      answer: 'TNC=18−1.5=16.5；net capital=16.5−2.5=14；headroom=14−11.5=2.5 百万美元。',
    },
  },
  {
    id: 'customer-reserve',
    mode: 'balance-sheet',
    label: '账本实验 05 · Customer reserve',
    title: '客户 credits 为 120、允许 debits 为 75 时，教学储备要求是多少？',
    brief: '只使用 Rule 15c3-3 Exhibit A 的教学压缩：R_raw=max(0, prescribed customer credits−permitted adjusted customer debits)。题设 credits 120；debits 75 已完成题设适用的 aggregate-debit reduction 与全部 Note 调整，单位百万元。问题求 raw reserve requirement，不求扣除既有 reserve balance 后的新增存入额；忽略 PAB、频率、通知和其他项目。',
    facts: [
      { label: 'Customer credits', value: '120', note: '题设规定可计入' },
      { label: 'Adjusted debits', value: '75', note: '题设规定允许扣减' },
      { label: 'Floor', value: '0', note: '负值不形成负储备' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '120，因为所有客户 credit 都必须逐美元静态隔离', diagnosis: '美国规则使用规定的 credits 与允许 debits 的公式，而不是把所有客户负债逐美元放入一只静态账户。' },
      { id: 'b', label: '75，因为 margin debit 才是客户资金', diagnosis: '把允许扣减项当成储备本身。储备取 credits 超过允许 debits 的净额。' },
      { id: 'c', label: '45', diagnosis: '正确。教学储备要求=max(0,120−75)=45；这不等于某一客户对特定 45 资产拥有所有权。' },
    ],
    calculation: 'R_raw=max(0,120−75)=45。',
    reveal: '客户 reserve 保护现金净额，possession or control 处理客户证券位置；两者与 firm 自有净资本又是不同约束。',
    revisit: '回看 27–28「customer reserve 与 possession/control」。',
    staticTwin: {
      title: '变式 05 · 客户 credits 与允许 debits',
      prompt: '教学 adjusted customer credits 为 90，完成全部适用调整后的 allowable debits 为 58；现有 qualifying reserve balance 为 25。忽略 PAB 和其他项目。分别计算 raw reserve requirement 与本次 incremental deposit due。',
      answer: 'raw requirement=max(0,90−58)=32；incremental deposit due=max(0,32−25)=7 百万美元。',
    },
  },
  {
    id: 'house-margin',
    mode: 'constraints',
    label: '约束实验 01 · House margin',
    title: '规则最低线之外的 house margin 怎样首先约束客户账户？',
    brief: '客户持有 100 股、每股 50 美元的可融资多头股票，账户 debit balance 为 3,200 美元。dealer 的冻结 house maintenance requirement 为当前市值的 40%；忽略利息、其他资产、税、Regulation T 初始保证金和价格跳跃。',
    facts: [
      { label: 'Market value', value: '100×$50 = $5,000', note: '多头证券市值' },
      { label: 'Debit balance', value: '$3,200', note: '客户欠 dealer' },
      { label: 'House requirement', value: '40%', note: '高于或独立于题外最低线' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'equity=$1,800、比例 36%，低于 40%；deficiency=$200', diagnosis: '正确。要求权益 5,000×40%=2,000，实际权益 5,000−3,200=1,800，缺口 200。' },
      { id: 'b', label: 'equity=$3,200、比例 64%，没有缺口', diagnosis: 'debit balance 是客户融资负债，不是账户权益。权益等于市值减 debit。' },
      { id: 'c', label: 'deficiency=$800，因为 40% 应乘以 debit balance', diagnosis: '题设 maintenance requirement 以当前证券市值为基数，而不是以 debit balance 为基数。' },
    ],
    calculation: 'market value=100×50=5,000；equity=5,000−3,200=1,800；equity ratio=36%；required equity=5,000×40%=2,000；deficiency=200。',
    reveal: '客户 initial margin、maintenance margin、dealer house margin、repo haircut、CCP IM 和净资本 haircut 具有不同主体、基数与时钟。',
    revisit: '回看 29–30「margin stack 与 PB concentration add-on」。',
    staticTwin: {
      title: '变式 06 · 账户权益不足',
      prompt: '客户持有 200 股、每股 30 美元，debit balance 为 3,900 美元，house maintenance 为市值 40%。计算账户权益、权益比例、要求权益和 deficiency。',
      answer: '市值 6,000；权益=6,000−3,900=2,100；比例 35%；要求权益=2,400；deficiency=300 美元。',
    },
  },
  {
    id: 'var-capacity',
    mode: 'constraints',
    label: '约束实验 02 · VaR 容量',
    title: '波动率翻倍时，冻结的一日线性风险容量为什么减半？',
    brief: '使用单资产、delta-one、零均值正态教学近似 VaR=zσ|X|。一日美元风险限额为 2 百万美元，z=2.33（约 99% 单侧分位），初始日波动率 σ=2%，以小数代入。假定无分散、基差、非线性和流动性 add-on；再令 σ 升到 4%。VaR 不是最大损失。',
    facts: [
      { label: 'Risk limit', value: '$2m', note: '冻结一日限额' },
      { label: 'Quantile', value: 'z = 2.33', note: '题设参数' },
      { label: 'Volatility', value: '2% → 4%', note: '其他参数不变' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '容量从 42.92m 升到 85.84m，因为波动越大预期收益越高', diagnosis: '风险限额约束的是损失尺度，不是预期收益。波动率变大时，相同名义头寸消耗更多风险额度。' },
      { id: 'b', label: '容量从约 42.92m 降到约 21.46m', diagnosis: '正确。|X|max=Limit/(zσ)，σ 翻倍而其他量不变，容量减半。' },
      { id: 'c', label: '容量保持 2m，因为风险限额就是最大头寸', diagnosis: '把损失限额和名义头寸混为一体。二者通过 zσ 相连。' },
    ],
    calculation: '初始 |X|max=2/(2.33×0.02)=42.918m；压力后=2/(2.33×0.04)=21.459m。',
    reveal: '真实 dealer 风险限额还处理非线性、相关性、basis、jump、持有期、流动性与压力情景；VaR 近似不是 Rule 15c3-1 公式，也不证明任何去杠杆必然发生。',
    revisit: '回看 31「内部 VaR、stress 与 inventory limit」。',
    staticTwin: {
      title: '变式 07 · 风险容量的反比例变化',
      prompt: '风险限额 1.5 百万美元，z=2.33，日波动率从 2.5% 升至 5%，其他假设不变。计算前后最大线性 notional。',
      answer: '初始=1.5/(2.33×0.025)=25.751m；压力后=1.5/(2.33×0.05)=12.876m，容量减半。',
    },
  },
  {
    id: 'leverage-loss',
    mode: 'constraints',
    label: '约束实验 03 · 价格损失与去杠杆',
    title: '2% 的资产损失怎样把 20 倍会计杠杆推到约 32.67 倍？',
    brief: 'dealer 初始资产 A=100、负债 L=95、权益 E=5，全部金额为百万元。资产统一无对冲下跌 2%，负债短时不变。第二问假定此后价格不再变化，dealer 卖出资产并把全部现金用于偿债，以恢复 A/E=20。忽略税、成本和风险权重。',
    facts: [
      { label: 'Initial', value: 'A 100 / L 95 / E 5', note: '会计杠杆 20×' },
      { label: 'Asset shock', value: '−2%', note: '损失 2' },
      { label: 'Repair rule', value: 'sell assets / repay debt', note: '权益保持 3' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '冲击后杠杆 20.41×；只需卖出 2', diagnosis: '把资产百分比变化直接当成杠杆百分比变化。损失由薄权益吸收，分母从 5 降到 3。' },
      { id: 'b', label: '冲击后杠杆 49×；恢复 20×需卖出 58', diagnosis: '49 是 98/2，而冲击后权益是 5−2=3，不是 2。' },
      { id: 'c', label: '冲击后 A=98、E=3、杠杆约 32.67×；恢复 20×需卖出并偿债 38', diagnosis: '正确。出售还债不改变权益 3，目标资产为 20×3=60，因此从 98 降到 60。' },
    ],
    calculation: '损失=100×2%=2；A′=98，E′=5−2=3，L=95；leverage=98/3=32.6667。恢复 20×：A*=20×3=60，出售并偿债=98−60=38。',
    reveal: '这是一条机械会计分支，不是实际监管要求或价格路径。若存在对冲、资本注入、盈利、负债折价、风险权重或市场冲击，修复量都会变化。',
    revisit: '回看 10、31–32 与 39「杠杆、内部限额、融资和正反馈」。',
    staticTwin: {
      title: '变式 08 · 薄权益下的小幅损失',
      prompt: '初始 A=80、L=76、E=4，会计杠杆 20×。资产无对冲下跌 1.5%，负债不变。计算新权益和杠杆；若此后价格不变，卖出资产还债以恢复 20×，需卖多少？',
      answer: '损失=1.2；A′=78.8，E′=2.8，杠杆=78.8/2.8=28.1429×。目标资产=20×2.8=56，需卖出并偿债 22.8。',
    },
  },
  {
    id: 'ccp-variation-margin',
    mode: 'constraints',
    label: '约束实验 04 · CCP variation margin',
    title: '明日应收款为什么不能覆盖今日 CCP 截止前的 5,000 美元缺口？',
    brief: 'dealer 在同一美元清算账户持有 100 份 long futures contracts，每份乘数 1,000 美元/点；结算价下降 0.5 点。题设把 variation margin 现金流出记为正。今日同一 VM 截止前可用现金 20,000、尚未使用且已承诺并可操作提取的额度 25,000；另有 30,000 应收款明日到账。忽略 initial margin 变化、跨账户净额、费用和其他现金流。',
    facts: [
      { label: 'Position', value: '100 long', note: '乘数 $1,000/点' },
      { label: 'Price move', value: '−0.5 point', note: 'long 发生损失' },
      { label: 'Today resources', value: '$20k + $25k', note: '明日 $30k 不计' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'VM 流出 $50,000；今日可用 $45,000；shortfall=$5,000', diagnosis: '正确。截止时点先于明日 receivable；经济上确定的未来流入也不能穿越结算时钟。' },
      { id: 'b', label: '没有缺口，因为总资源 $75,000 高于 VM', diagnosis: '把明日应收款提前到今日。流动性约束必须按法律和操作可用时点计算。' },
      { id: 'c', label: 'VM 流入 $50,000，因为价格下降使 long 可以低价买入', diagnosis: '期货 long 在结算价下降时产生亏损和 VM 流出，不是新的买入机会。' },
    ],
    calculation: 'VM outflow=100×$1,000×0.5=$50,000；today resources=$20,000+$25,000=$45,000；shortfall=max(0,50,000−45,000)=$5,000。',
    reveal: 'IM 覆盖潜在未来价格变动，VM 把已经发生的损益转成现金。资本充足、经济对冲和明日应收都不能自动解决今日截止时点。',
    revisit: '回看 33–36「CCP IM、VM、default fund 与 settlement headroom」。',
    staticTwin: {
      title: '变式 09 · 日内 VM 时钟',
      prompt: 'dealer 在同一美元清算账户持有 60 份 long futures contracts，乘数 500 美元/点，结算价下降 0.8 点。今日现金 7,000、同一截止前可用且未使用额度 12,000、明日应收 10,000。计算 VM 流出和今日 shortfall。',
      answer: 'VM=60×500×0.8=24,000；今日资源=7,000+12,000=19,000；明日应收不计，今日 shortfall=5,000 美元。',
    },
  },
  {
    id: 'capacity-branch',
    mode: 'constraints',
    label: '约束实验 05 · 状态依赖容量',
    title: '客户立即卖出 60 单位时，dealer 最多能无对冲地新增保留多少库存？',
    brief: 'dealer 当前 delta-one、未对冲净 long risk inventory q=+10，硬性内部上限为 +30。客户希望立即卖给 dealer 60 单位；每无对冲买入并保留 1 单位会使 q 增加 1，题设允许完美一比一 hedge 使 q 同量下降，并把客户成交与同步 hedge/转售视为一个原子动作。限额在任一时点都不可突破。问题问最多可净新增并保留多少未对冲风险；dealer 若 principal fill 全部 60，超过余量的部分必须预先安排或同步外部化，不能先突破再等待。',
    facts: [
      { label: 'Current inventory', value: '+10', note: 'dealer 已多头' },
      { label: 'Hard maximum', value: '+30', note: '题设不可突破' },
      { label: 'Client sell order', value: '60', note: '客户要求 immediacy' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '可无对冲地新增保留 60，因为 dealer 的职责就是提供流动性', diagnosis: '把做市功能误写成无限风险空间。若 60 全部留在账上，库存会从 +10 推到 +70，违反题设硬限额。' },
      { id: 'b', label: '最多净新增保留 20；若 principal fill 全部 60，至少 40 必须预先安排或同步对冲、转售、匹配另一客户', diagnosis: '正确。long risk headroom=30−10=20。要在任一时点不突破，额外 40 必须与客户成交同步外部化；否则只能缩小 principal fill 或改走 agency。' },
      { id: 'c', label: '不能净新增任何库存，因为 dealer 已经是多头', diagnosis: '只要仍有 headroom，dealer 可以保留一部分新增 long；多头不等于剩余容量为零。' },
    ],
    calculation: 'continuous unhedged-risk headroom=max(0,30−10)=20；若 gross principal fill=60，minimum prearranged/simultaneous externalisation=max(0,60−20)=40。',
    reveal: 'Principal execution 与最终净库存不是同一量。同一卖单在 headroom 充足时可被库存保留并稳定价格；headroom 紧张时，若要 principal fill 全部数量，超出余量的部分必须预先安排或在同一原子动作中同步 hedge/转售；否则应缩小 principal fill、改走 agency 或要求价格让步。反馈方向由冲击前状态决定。',
    revisit: '回看 21、37–42 与 49「库存目标、principal/agency/hedge、报价、融资与状态分支」。',
    staticTwin: {
      title: '变式 10 · 剩余库存空间',
      prompt: 'dealer 当前 delta-one 未对冲净 long risk inventory=+5，连续硬上限=+25；完美一比一同步 hedge 可同量降低该风险。客户希望立即卖出 35 单位，限额任一时点不可突破。最多可净新增保留多少未对冲风险？若全部 principal fill，至少多少必须预先安排或作为同一原子动作同步外部化？',
      answer: '可用 long risk headroom=25−5=20，因此最多净新增保留 20；若 gross principal fill 全部 35，至少 15 必须通过预先安排或同步的对冲、转售或另一客户流外部化，否则应缩小 principal fill 或采用 agency。',
    },
  },
];
