export type CorporateFlowMode = 'ledger' | 'evidence';
export type CorporateFlowChoice = 'a' | 'b' | 'c';

export type CorporateFlowScenario = {
  id: string;
  mode: CorporateFlowMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: CorporateFlowChoice; label: string; diagnosis: string }[];
  correct: CorporateFlowChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
};

export const corporateFlowModes: { id: CorporateFlowMode; label: string; title: string; description: string }[] = [
  { id: 'ledger', label: 'MODE A', title: '三本账与两条时间轴', description: '分别核算 issued／treasury／outstanding、WASO、现金融资、ASR 交付和真实市场容量。' },
  { id: 'evidence', label: 'MODE B', title: '从文件事实到有边界的结论', description: '区分授权、注册、计划、成交、披露与因果 estimand，判断一份证据最多支持到哪一层。' },
];

export const corporateFlowScenarios: CorporateFlowScenario[] = [
  {
    id: 'share-state-ledger', mode: 'ledger', label: '账本实验 01 · 股本状态机',
    title: '回购、增发和注销依次发生后，为什么 outstanding 不能在注销时再减一次？',
    brief: '单位均为百万股。冻结 Delaware 默认情形：初始 authorized A=200、issued I=120、treasury T=20，因此 outstanding O=100。公司先回购 10 并存入 treasury，再新发 primary 5，最后从库存股中注销 6；期末按指定 free-float 方法排除 nonfloat 15。忽略拆股和其他事件。',
    facts: [
      { label: 'Initial state', value: 'A 200 · I 120 · T 20 · O 100', note: 'O=I−T' },
      { label: 'Events', value: 'buy 10 → issue 5 → retire 6', note: '按顺序记账' },
      { label: 'Nonfloat', value: '15', note: '只在期末计算 F=O−X' },
    ],
    options: [
      { id: 'a', label: '期末 I=119、T=24、O=95、float=80', diagnosis: '正确。库存股注销同时减少 issued 与 treasury，二者之差不再变化，因此不能把同一次回购重复减少 outstanding。' },
      { id: 'b', label: '期末 I=119、T=24、O=89、float=74', diagnosis: '把注销 6 又从 outstanding 中减了一次，造成 double count。回购进入库存股时 O 已经下降。' },
      { id: 'c', label: '期末 I=125、T=24、O=101、float=86', diagnosis: '忽略注销会同时降低 issued；也没有正确沿事件状态机更新 O。' },
    ],
    correct: 'a',
    calculation: '回购后 (I,T,O)=(120,30,90)；发行后=(125,30,95)；注销后=(119,24,95)；float=95−15=80。A 仍为 200，累计 retired=6。',
    reveal: 'Retired shares 是事件流，不应作为第四个库存量再从 I−T 中扣除。公司法对注销后 authorized capacity 的处理具有法域性，本题只冻结 Delaware 默认情形。',
    revisit: '回看 08、21、37 与 47「股本状态、授权容量、库存股会计和披露字段」。',
    sourceIds: [24, 94, 97], staticSourceIds: [24, 94, 97],
    staticTwin: { title: '变式 01 · 库存股再发行', prompt: '初始 I=150、T=30、O=120。先将库存股 8 再发行，再回购 5 存入 treasury，最后注销库存股 10。求期末 I、T、O。', answer: '再发行后 (150,22,128)；回购后 (150,27,123)；注销后 (140,17,123)。注销不再次改变 outstanding。' },
  },
  {
    id: 'waso-diluted-eps', mode: 'ledger', label: '账本实验 02 · WASO 与 Diluted EPS',
    title: '期末只有 108 百万股，为什么 basic EPS 的分母仍是 112 百万股？',
    brief: '一年按 12 个等长月。1 月 1 日 outstanding 100m；4 月 1 日 primary issue 20m；10 月 1 日回购 12m。归属于普通股股东的净利润为 224m。另有 8m 已通过反稀释检验、且题设无需调整分子的增量潜在普通股。',
    facts: [
      { label: 'Share path', value: '100 → 120 → 108m', note: '分别持续 3、6、3 个月' },
      { label: 'Common earnings', value: '224m', note: '题设已处理优先股影响' },
      { label: 'Incremental diluted', value: '+8m', note: '已冻结为 dilutive 且无分子调整' },
    ],
    options: [
      { id: 'a', label: 'Basic denominator 108m，basic EPS≈2.074；diluted EPS≈1.931', diagnosis: '把期末 outstanding 误作全年加权平均数。' },
      { id: 'b', label: 'Basic denominator 112m，basic EPS=2.00；diluted denominator 120m，diluted EPS≈1.867', diagnosis: '正确。每段实际 outstanding 按存续时间加权，潜在股份只进入 diluted bridge。' },
      { id: 'c', label: 'Basic denominator 120m，basic EPS≈1.867；diluted denominator 128m', diagnosis: '把期间最大股数当作 basic 分母，又在 diluted 分母重复加入并不存在的期末增量。' },
    ],
    correct: 'b',
    calculation: 'WASO=100×3/12+120×6/12+108×3/12=112m；basic EPS=224/112=2.00；diluted denominator=112+8=120m；diluted EPS=224/120=1.8667。',
    reveal: 'Period-end outstanding、weighted-average basic shares 与 diluted denominator 是三个状态。真实 diluted EPS 对可转债还可能同时调整分子，反稀释工具必须排除。',
    revisit: '回看 09–10 与 43「加权平均股数、潜在普通股和机械 EPS bridge」。',
    sourceIds: [23], staticSourceIds: [23],
    staticTwin: { title: '变式 02 · 年中回购', prompt: '1 月 1 日 outstanding 80m，7 月 1 日回购 8m；全年普通股利润 144m，另有题设确认 dilutive 且无分子调整的潜在股份 4m。求 basic 与 diluted EPS。', answer: 'WASO=80×6/12+72×6/12=76m；basic EPS=144/76≈1.8947；diluted denominator=80m，diluted EPS=1.80。' },
  },
  {
    id: 'primary-secondary-yields', mode: 'ledger', label: '账本实验 03 · Primary / Secondary / Yield',
    title: '同一期间出现回购、primary 和 secondary 时，哪笔钱属于发行人？',
    brief: '期初普通股总市值为 2,000m。公司实际支付 120m 回购普通股，primary issuance 取得 gross proceeds 50m，selling shareholder 的 secondary sale 取得 80m，普通股现金股息为 30m。忽略费用、税和非现金股数变化。',
    facts: [
      { label: 'Issuer cash legs', value: 'repurchase 120 · primary 50 · dividend 30', note: '均为公司现金账' },
      { label: 'Holder cash leg', value: 'secondary 80', note: '款项归 selling shareholder' },
      { label: 'Starting market cap', value: '2,000m', note: '冻结为 yield 分母' },
    ],
    options: [
      { id: 'a', label: 'Buyback yield 6%；cash net equity flow −70m；net payout yield 5%', diagnosis: '正确。secondary 只是既有股东之间的所有权转移，不进入发行人现金融资或 payout 分子。' },
      { id: 'b', label: 'Cash net equity flow +10m，因为 50+80−120=10', diagnosis: '把 selling shareholder 收到的 80 错记进公司现金账。' },
      { id: 'c', label: 'Net payout yield 1%，因为还要从 payout 中减去 secondary 80', diagnosis: 'Secondary sale 不由公司收款或付款；除非研究的是市场可售流量，否则不进入 issuer payout。' },
    ],
    correct: 'a',
    calculation: 'Buyback yield=120/2,000=6%；issuer cash net equity flow=50−120=−70m；net payout yield=(30+120−50)/2,000=5%。',
    reveal: 'Primary／secondary 是“谁交付股票、谁收到钱”的身份问题；它与短期市场供给压力有关，却不能因都叫 offering 就合并为发行人融资。',
    revisit: '回看 06–07、29、38 与 49「primary/secondary、gross/net 和 denominator choice」。',
    sourceIds: [60, 72, 95, 96], staticSourceIds: [60, 95, 96],
    staticTwin: { title: '变式 03 · 混合发行的两本现金账', prompt: '期初市值 1,500m；公司回购 60m，primary gross 90m，secondary proceeds 45m，普通股股息 15m。计算 buyback yield、issuer cash net equity flow 与 net payout yield。', answer: 'Buyback yield=60/1,500=4%；issuer cash net equity flow=90−60=+30m；net payout yield=(15+60−90)/1,500=−1%。Secondary 45m 不进入三项。' },
  },
  {
    id: 'debt-buyback-eps', mode: 'ledger', label: '账本实验 04 · 债务融资回购',
    title: '股数减少 10%，为什么 EPS 仍可能完全不变？',
    brief: '初始资产 1,000m、负债 400m、账面权益 600m、outstanding 100m、无交易利润 60m。公司借款 100m，随即以每股 10 元回购 10m 股。资产负债表只取借款到账并完成回购后的即时 pro forma，尚未计入本期经营利润、利息应计或其他现金流；EPS 另按交易自期初起全年生效、税后新增利息 6m 的 pro forma 计算。忽略费用、回购税与其他经营变化。',
    facts: [
      { label: 'Debt and buyback', value: '+100 debt · −100 cash', note: '总资产净变化为零' },
      { label: 'Share change', value: '100 → 90m', note: '题设视为全年生效' },
      { label: 'After-tax interest', value: '6m', note: '利润由 60 降至 54' },
    ],
    options: [
      { id: 'a', label: '资产 1,100、负债 500、权益 600；EPS 0.667', diagnosis: '只记录借款，没有记录随后支付 100 现金和权益抵减；也漏掉新增利息。' },
      { id: 'b', label: '资产 1,000、负债 500、权益 500；EPS 0.60，与回购前相同', diagnosis: '正确。债务与立即回购令总资产回到起点，负债升、权益降；分子 54 与分母 90 同比下降 10%。' },
      { id: 'c', label: '资产 900、负债 400、权益 500；EPS 0.60', diagnosis: '这是现金融资回购的资产负债表，却与题设新增债务 100 矛盾。' },
    ],
    correct: 'b',
    calculation: '即时交易账：A*=1,000+100−100=1,000，L*=500，E*=500；全年 EPS 账：EPS₀=60/100=0.60，EPS₁=(60−6)/90=0.60。税后资金成本 6% 恰等于 60/(100×10)=6% earnings yield。',
    reveal: 'EPS accretion 由分子成本与分母下降共同决定；即使 EPS 上升，也不自动说明回购价低于内在价值、投资机会没有被牺牲或风险没有上升。',
    revisit: '回看 12–13、40、43–44「融资约束、机会成本、资产负债表与价值边界」。',
    sourceIds: [44, 46, 51, 67], staticSourceIds: [44, 51],
    staticTwin: { title: '变式 04 · 资金成本低于 earnings yield', prompt: '无交易利润 50m、股数 100m；借款并以 10 元回购 10m 股，全年税后新增利息 4m，题设视为全年生效。求前后 EPS，并判断机械增厚。', answer: 'EPS₀=0.50；EPS₁=(50−4)/90≈0.5111，机械增厚约 2.22%。这仍不是价值创造证明。' },
  },
  {
    id: 'asr-capacity', mode: 'ledger', label: '账本实验 05 · ASR 与执行容量',
    title: 'ASR 初始交付 24 百万股时，为什么最终回购量和市场执行天数都不是 24？',
    brief: '初始 outstanding 200m。发行人向 dealer 预付 300m，dealer 从股东借入并初始交付 24m 股。题设冻结无 cap、floor 和费用，最终合约价格为 10 元，正 true-up 以股份交付；另冻结 dealer 在窗口内须从市场实际买入全部 30m 股。share ADV=5m/日，允许参与率 20%。',
    facts: [
      { label: 'Prepayment / final price', value: '300m / 10', note: '教学简式只在冻结条款下成立' },
      { label: 'Initial delivery', value: '24m borrowed shares', note: '不是当日公开市场买盘' },
      { label: 'Market capacity', value: '20% × 5m = 1m/day', note: '题设要求买满 30m' },
    ],
    options: [
      { id: 'a', label: '最终 24m、无 true-up、24 个交易日；outstanding 176m', diagnosis: '把 initial delivery 当成最终合同股数和 market covering 全量。' },
      { id: 'b', label: '最终 30m、true-up 6m、6 个交易日，因为 ADV 为 5m', diagnosis: '把全部市场成交量当成 dealer 可用容量，忽略 20% 参与率。' },
      { id: 'c', label: '最终 30m、true-up 6m、30 个交易日；outstanding 最终 170m', diagnosis: '正确。总股数由冻结的最终价格决定，dealer 的市场购买与发行人的初始借股交付是不同时间轴。' },
    ],
    correct: 'c',
    calculation: 'Q_final=300/10=30m；Q_true-up=30−24=6m；初始 O=200−24=176m，最终 O=170m；每日容量=0.20×5=1m，D=30/1=30 日。',
    reveal: '真实 ASR 可能有折价 VWAP、cap/floor、费用、提前终止与现金或股份结算，所以教材公式不是通用估值式。Rule 10b-18 FAQ 也不把 dealer covering 自动纳入发行人安全港。',
    revisit: '回看 27、36 与 39「ASR 状态机、settlement clock 和市场 order flow」。',
    sourceIds: [3, 21, 64, 91], staticSourceIds: [3, 64, 91],
    staticTwin: { title: '变式 05 · 负 true-up', prompt: '发行人预付 240m，初始交付 22m；冻结最终价格 12 元、无 cap/floor/费用，负 true-up 按本题以股份结算。求最终总股数和 true-up。若 dealer 需买 20m、ADV 4m、参与率 25%，求容量日数。', answer: 'Q_final=240/12=20m，Q_true-up=20−22=−2m；负号表示发行人向 dealer 返还／交付 2m 股，使发行人最终净取得 20m 股，并非 dealer 再向发行人交付“负两百万股”。每日容量=1m，需 20 日。' },
  },
  {
    id: 'authorization-evidence', mode: 'evidence', label: '证据实验 01 · Authorization ≠ Demand',
    title: '董事会新批 100 亿美元回购，今天最多能把它写成什么事实？',
    brief: '公司 8-K 或董事会公告写明批准最高 100 亿美元回购，并明确不要求最低购买量、可随时暂停。研究者没有 broker order、fill、settlement 或之后 Item 703 数据。公告日股价上涨 3%。',
    facts: [
      { label: 'Direct record', value: '$10bn authorization cap', note: '可行动上限，不是 obligation' },
      { label: 'Execution evidence', value: 'none yet', note: '无 order、fill、cash 或 share change' },
      { label: 'Market response', value: '+3% announcement window', note: '联合信念更新' },
    ],
    options: [
      { id: 'a', label: '公司当天已买入 100 亿美元，3% 涨幅就是订单冲击', diagnosis: '同时把授权当成交，又把公告反应当实际订单的因果冲击。' },
      { id: 'b', label: '既然无最低义务，公告完全没有信息含量', diagnosis: '无执行承诺不等于无信息；董事会选择、容量与条件仍可能更新市场信念。' },
      { id: 'c', label: '只能确认回购容量与政策信号；执行量、成交路径和涨幅分解仍未知', diagnosis: '正确。公告可以改变市场对未来执行、估值信号和资本配置的联合预期，却不能填补成交账。' },
    ],
    correct: 'c',
    calculation: '当前状态只到 authorization/announcement。Actual demand 需要 order 或 fill；股本与现金变化需要 trade/settlement/accounting；价格分解需要识别设计。',
    reveal: 'Apple 与 Berkshire 的直接文件都展示 authorization 与 actual purchases 可以分别披露；历史研究也发现完成率异质，所以“宣布回购”不是买盘单位。',
    revisit: '回看 03–05、21、46–47 与 50「状态机、资本配置反事实、可知时钟和事件研究」。',
    sourceIds: [49, 50, 65, 81, 82, 83], staticSourceIds: [50, 81, 82],
    staticTwin: { title: '变式 06 · 授权余额', prompt: '公司原授权 8bn，累计已执行 3bn，董事会把上限再增加 2bn。若没有其他变化，最新 remaining capacity 是多少？能否据此推断下一季度至少回购多少？', answer: '容量为 8+2−3=7bn；不能推断最低执行量。还需管理层选择、合规、流动性、融资和实际成交。' },
  },
  {
    id: 'secondary-evidence', mode: 'evidence', label: '证据实验 02 · Mixed Offering',
    title: 'Prospectus 同时列 12 百万 primary 与 8 百万 secondary，哪部分机械稀释并给公司带来钱？',
    brief: '题设冻结该 mixed offering 已完成 closing、股份交付和收款。最终交易文件显示公司交付 12m 新股，selling shareholder 交付既有 8m 股。两部分以相同公开发行价出售；公司声明不会收到 selling shareholder tranche 的 proceeds。忽略绿鞋、费用、库存股和其他发行。',
    facts: [
      { label: 'Issuer tranche', value: '12m new shares', note: 'primary' },
      { label: 'Holder tranche', value: '8m existing shares', note: 'secondary' },
      { label: 'Total marketed', value: '20m', note: '市场可售量不等于股本增加量' },
    ],
    options: [
      { id: 'a', label: '20m 都增加 outstanding，公司收到全部 proceeds', diagnosis: '把 selling shareholder 的既有股转让误作公司新发。' },
      { id: 'b', label: '只有 12m 增加 outstanding 并给公司带来 gross proceeds；8m 只改变所有权和市场供给', diagnosis: '正确。研究市场吸收量可看 20m，但公司现金与机械股本桥只看 primary 12m。' },
      { id: 'c', label: '只有 secondary 8m 稀释，因为旧股东在卖出', diagnosis: '持有人出售会改变所有权或 float，却不机械增加总 outstanding；primary 才新增股数。' },
    ],
    correct: 'b',
    calculation: 'Δoutstanding=+12m；issuer gross proceeds=12m×offer price；secondary holder proceeds=8m×offer price；marketed shares=20m。三者属于不同账。',
    reveal: '“市场供给”可以包括 primary 与 secondary，而“发行人融资”和“机械稀释”只属于 primary leg。混合发行必须逐 tranche 阅读 cover page 和 use of proceeds。',
    revisit: '回看 06、28–29、38、41 与 47「primary/secondary、follow-on、现金账和 float」。',
    sourceIds: [15, 39, 40, 41, 72, 96], staticSourceIds: [15, 72, 96],
    staticTwin: { title: '变式 07 · 纯 Secondary Block', prompt: '既有战略股东完成出售 25m 已发行股份，公司不出售股份。题设冻结某指数方法在本次 review 生效后将这 25m 全部由 nonfloat 转为 float，且无其他事件。求 Δoutstanding、Δindex free float 与 issuer proceeds。', answer: 'Δoutstanding=0；Δindex free float=+25m；issuer proceeds=0。市场可售量与指数口径改变，不等于公司融资或机械稀释。' },
  },
  {
    id: 'rule-10b18-boundary', mode: 'evidence', label: '证据实验 03 · Rule 10b-18',
    title: '某日回购量超过 25% ADTV，能否直接判定公司违法操纵？',
    brief: '研究者只看到估算的日回购量高于 25% ADTV，却没有 manner、timing、price、block exception、broker、MNPI 或其他交易事实。题目只判断 Rule 10b-18 安全港含义，不评价其他法律责任。',
    facts: [
      { label: 'Observed estimate', value: '>25% ADTV', note: '且估算误差未知' },
      { label: 'Safe harbor', value: 'voluntary and non-exclusive', note: '四类条件须整体评估' },
      { label: 'Missing facts', value: 'block · timing · price · manner · intent', note: '法律与事实链不完整' },
    ],
    options: [
      { id: 'a', label: '不能；最多说可能未满足该安全港的 volume condition，仍需核实例外和其他事实', diagnosis: '正确。失去安全港不创造操纵推定，更不能由一项估算直接作最终违法判断。' },
      { id: 'b', label: '可以；25% 是所有美国回购的绝对法定上限', diagnosis: '把自愿安全港的 volume condition 写成普遍禁止规则，也忽略 block exception。' },
      { id: 'c', label: '只要采用 10b5-1 计划，就自动满足 10b-18 的全部条件', diagnosis: '10b5-1 与 10b-18 回答不同问题，前者不会自动满足后者。' },
    ],
    correct: 'a',
    calculation: '允许结论层级：estimated volume condition may not be met → verify ADTV definition/block exception/execution → separately assess other law. 禁止跳跃：>25% → manipulation proved。',
    reveal: '安全港不是交易授权书，也不是全面合法性证书。EU MAR 和中国规则又有各自结构，任何 25% 叙事都必须带法域、版本与适用对象。',
    revisit: '回看 22–24、46–47「10b-18、10b5-1、跨法域和证据字段」。',
    sourceIds: [1, 2, 3, 4, 30, 31, 33], staticSourceIds: [1, 2, 3, 4],
    staticTwin: { title: '变式 08 · Safe Harbor 不是 Mandatory Route', prompt: '公司通过一笔 privately negotiated transaction 回购股份，没有主张 Rule 10b-18。能否仅因交易不在该安全港内就称其违法？', answer: '不能。10b-18 是针对特定公开市场购买的非排他安全港；私人交易仍须按其他适用法律和事实评估。' },
  },
  {
    id: 'knowable-when', mode: 'evidence', label: '证据实验 04 · Knowable When',
    title: '6 月 30 日季度内回购到 8 月 5 日 10-Q 才公开，7 月 10 日的实时策略能否使用？',
    brief: '公司在 April–June 实际回购，periodEnd 为 6 月 30 日；10-Q 于 8 月 5 日 filed/public。数据库在 8 月 6 日抓取。研究者要构造 7 月 10 日可交易信号；不存在更早的直接逐日披露。',
    facts: [
      { label: 'Economic period', value: 'April–June', note: '成交发生区间' },
      { label: 'PublicAt', value: '5 August', note: '外部首次可靠可见' },
      { label: 'Signal date', value: '10 July', note: '早于 publicAt' },
    ],
    options: [
      { id: 'a', label: '可以，因为交易在 6 月 30 日以前已经真实发生', diagnosis: '把经济发生时点与外部可知时点混为一谈，造成 look-ahead bias。' },
      { id: 'b', label: '可以，因为 2023 SEC 规则要求所有公司逐日披露回购', diagnosis: '2023 规则已被法院撤销，现行 Item 703 是 periodic filing 中的月度汇总。' },
      { id: 'c', label: '不可以；只能在 8 月 5 日以后使用，并保存 period、publicAt 与抓取 vintage', diagnosis: '正确。事后真实不等于当时可知，数据库抓取时间还应与官方公开时间分开。' },
    ],
    correct: 'c',
    calculation: 'signalDate 2026-07-10 < publicAt 2026-08-05，因此记录对实时策略不可用；observedAt 2026-08-06 还晚于 publicAt。',
    reveal: '每条 corporate-flow observation 至少保存 event/trade period、settlement、asOf、publicAt、observedAt 与 revisionVintage；不能把后报数据回填到公告日。',
    revisit: '回看 36、46–48「成交/结算、可知时钟、披露地图和流量重建」。',
    sourceIds: [6, 7, 8, 9], staticSourceIds: [13, 15],
    staticTwin: { title: '变式 09 · ATM Capacity 的时间错误', prompt: '公司 3 月 1 日登记 500m ATM capacity，5 月 10 日才披露截至 4 月 30 日实际卖出 120m。3 月 15 日研究能否把 500m 全部记为已发行，把 120m 记为当时可知？', answer: '都不能。500m 是容量，不是成交；截至 3 月 15 日究竟售出多少仍未知。120m 是截至 4 月 30 日的事后累计，且到 5 月 10 日才公开，因此不能用于 3 月 15 日。' },
  },
  {
    id: 'event-study-boundary', mode: 'evidence', label: '证据实验 05 · Announcement Estimand',
    title: '回购公告窗口上涨 4%，为什么不能直接说“公司买盘把价格推高 4%”？',
    brief: '董事会在收盘后宣布新的 open-market program；次日市场调整后的两日累计异常收益为 +4%。公告没有说明当晚已成交；同期公司同时更新业绩指引、融资计划和资本开支。研究者只有公开公告与价格。',
    facts: [
      { label: 'Outcome', value: '+4% abnormal return', note: '给定模型的公告窗口估计' },
      { label: 'Bundled news', value: 'guidance + financing + capex + buyback', note: '多项信息同时更新' },
      { label: 'Actual fills', value: 'unobserved', note: '没有订单或成交证据' },
    ],
    options: [
      { id: 'a', label: '4% 就是实际回购订单的永久价格冲击', diagnosis: '公告日未观察到实际订单，且窗口包含多个信息内容；无法把联合反应分配给单一通道。' },
      { id: 'b', label: '4% 是给定 benchmark 下对整组公告信息的联合市场反应；具体通道和永久性仍待识别', diagnosis: '正确。事件研究的 estimand 是公告信息集的价格更新，不是自动的 order-flow coefficient。' },
      { id: 'c', label: '只要长期收益随后为正，就能证明管理层准确识别低估并创造价值', diagnosis: '长期 abnormal return 对 benchmark 和选择样本敏感，也不能单独识别内在价值或机会成本。' },
    ],
    correct: 'b',
    calculation: 'Observed: announcement-window abnormal return under a chosen expected-return model. Unidentified: actual buy quantity, order impact, signaling share, capex/funding news share, permanence and counterfactual no-announcement price。',
    reveal: '公告研究、actual-trade study、accounting panel、threshold design 与 aggregate time series 是五种不同 estimand；名称都出现“回购”并不让它们回答同一问题。',
    revisit: '回看 16、44–45、50–53 与 55「信号、价值、流动性和识别协议」。',
    sourceIds: [45, 46, 47, 49, 57, 58, 66, 67, 68], staticSourceIds: [70, 71, 72],
    staticTwin: { title: '变式 10 · Issuance Announcement', prompt: '公司宣布 primary offering，同日披露盈利低于预期，股价跌 7%；题设没有 pricing、closing 或 delivery 证据。判断三句真伪：(1) −7%=机械稀释；(2) outstanding 已增加；(3) −7%只能记为给定 benchmark 下盈利与融资公告信息集的联合窗口反应。', answer: '假、假、真。窗口包含盈利与融资信息，且没有完成发行的证据；公告反应与实际交付后的股数桥必须分开。' },
  },
];
