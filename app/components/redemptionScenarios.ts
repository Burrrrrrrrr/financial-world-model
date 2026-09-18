export type RedemptionMode = 'ledger' | 'inference';
export type RedemptionChoice = 'a' | 'b' | 'c';

export type RedemptionScenario = {
  id: string;
  mode: RedemptionMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: RedemptionChoice; label: string; diagnosis: string }[];
  correct: RedemptionChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const redemptionModes: { id: RedemptionMode; label: string; title: string; description: string }[] = [
  { id: 'ledger', label: 'MODE A', title: '把赎回翻译成现金与交易', description: '冻结份额、估值、成本归属和结算时钟，分开 gross flow、cash gap、sale target、fill、settlement 与剩余 NAV。' },
  { id: 'inference', label: 'MODE B', title: '把交易证据翻译成机制结论', description: '判断 anti-dilution、first-mover、gate 与 ETF 机制改变哪一层，并检验 fire-sale 因果语言是否有足够证据。' },
];

export const redemptionScenarios: RedemptionScenario[] = [
  {
    id: 'gross-versus-net-flow', mode: 'ledger', label: '账本实验 01 · Gross / Net Flow',
    title: '净流出只有 $15m，为什么不能把另外 $74m 的订单历史删除？',
    brief: '某每日开放的公司债基金在截止后，确认收到同一美元份额类别、同一估值日、同一 T+2 结算时点的 $52m 现金赎回与 $37m 现金申购。题设排除失败交收、撤单、费用和跨币种差异。',
    facts: [
      { label: 'Gross redemptions', value: '$52m', note: '已确认，T+2 现金结算' },
      { label: 'Gross subscriptions', value: '$37m', note: '已确认，T+2 现金结算' },
      { label: 'Scope', value: 'same class · same value date', note: '只在冻结口径内比较净额' },
    ],
    options: [
      { id: 'a', label: '基金面临 $89m 净现金流出，因为应把申购与赎回相加', diagnosis: '$89m 是双向 gross activity，不是净现金流出；申购与赎回方向相反。' },
      { id: 'b', label: '基金必然需要卖出 $52m 资产，因为申购不能进入赎回分析', diagnosis: '忽略同一时钟内已确认申购，也从赎回直接跳到出售；基金还可能有现金和其他来源。' },
      { id: 'c', label: '净现金流出为 $15m，但仍要保存 $52m 与 $37m 两条 gross 流量', diagnosis: '正确。净额决定这组订单的方向差，gross 仍影响运营、集中度和行为识别。' },
    ],
    correct: 'c',
    calculation: 'Net flow=$37m−$52m=−$15m，即 $15m 净流出；gross two-way activity=$52m+$37m=$89m。净流出仍不等于资产出售额。',
    reveal: '相同 $15m 净流出可来自 15 对 0，也可来自 515 对 500；现金方向相同，运营负荷与投资者结构完全不同。',
    revisit: '回看 08–09「Gross / Net Flow 与外部流量估计」。',
    staticTwin: { title: '变式 01 · 净申购也不能抹去 gross redemption', prompt: '某股票基金确认 $28m 现金赎回与 $44m 现金申购，两边同币种、同份额类别且同一时点结算。求净流量与 gross activity，并说明能否据此断言基金已买入股票。', answer: '净流量为 $16m 净流入；gross activity 为 $72m。它只给出现金差额，不能证明基金已经下单或成交买入股票。' },
  },
  {
    id: 'settlement-cash-gap', mode: 'ledger', label: '账本实验 02 · Settlement Cash Gap',
    title: '哪些资源真正赶得上赎回付款时钟？',
    brief: '某银行贷款基金周五 16:00 前需支付 $86m。届时可用：未受限现金 $22m、周四结算的确认申购 $19m、周五上午到账的本金利息 $13m，以及已授权并可在周五中午前到账的信贷 $12m。另有 $15m 本金到下周一才到账。',
    facts: [
      { label: 'Cash due', value: '$86m by Fri 16:00', note: '已确认现金义务' },
      { label: 'Usable by deadline', value: '$22m+$19m+$13m+$12m', note: '题设冻结为可用' },
      { label: 'After deadline', value: '$15m next Monday', note: '不能穿越时钟计入' },
    ],
    options: [
      { id: 'a', label: '周五付款前的现金缺口为 $20m', diagnosis: '正确。截止前资源为 $66m，仍需资产出售或其他可执行来源覆盖 $20m。' },
      { id: 'b', label: '缺口为 $32m，因为授权信贷永远不能算流动性资源', diagnosis: '题设已冻结额度获授权、可提款且按时到账；现实中仍需另做提款和续作压力测试。' },
      { id: 'c', label: '缺口为 $5m，因为下周一到期的 $15m 也属于基金资产', diagnosis: '最终到账不等于赶得上周五付款；这会掩盖 settlement mismatch。' },
    ],
    correct: 'a',
    calculation: 'Available=$22m+$19m+$13m+$12m=$66m；G=max(0,$86m−$66m)=$20m。下周一的 $15m 不进入周五时钟。',
    reveal: 'Liquidity 不是“资产最终值多少钱”，而是“多少钱能在指定状态和义务到期前成为可支付现金”。',
    revisit: '回看 14–17「Cash Waterfall 与 Scenario Coverage」。',
    staticTwin: { title: '变式 02 · 到账日比资产标签更重要', prompt: '某市政债基金周三需支付 $48m。届时有现金 $9m、申购 $11m、到期本金 $8m、可用信贷 $6m；另有 $10m 债券周四才到期。求周三缺口。', answer: '截止前资源为 $34m，现金缺口为 $14m。周四到期的 $10m 不能回填周三的付款时钟。' },
  },
  {
    id: 'sale-target-order-fill', mode: 'ledger', label: '账本实验 03 · Target / Order / Fill',
    title: '目标卖出 $28m，为什么仍有 $5.31m 缺口？',
    brief: '基金在非出售资源后仍缺 $24m。经理下达卖出面值 $12m 国债和 $16m 公司债；国债全部以面值 99.75% 成交，公司债只成交面值 $7m、价格 96%，其余未成交。两笔成交均约定在付款前结算，忽略额外费用和失败交收。',
    facts: [
      { label: 'Pre-sale gap', value: '$24.00m cash', note: '全部非出售资源之后' },
      { label: 'Targets / orders', value: '$12m+$16m face', note: '面值不是现金到账' },
      { label: 'Actual fills', value: '$12m@99.75% · $7m@96%', note: '均按时结算' },
    ],
    options: [
      { id: 'a', label: '缺口已关闭并多出 $4m，因为 sale target 为 $28m', diagnosis: '把目标面值当成了实际现金。目标、订单、成交和结算是不同状态。' },
      { id: 'b', label: '成交面值为 $19m，所以剩余缺口恰为 $5m', diagnosis: '还必须按成交价计算结算款；债券并非都按面值变现。' },
      { id: 'c', label: '合同结算款为 $18.69m，仍有 $5.31m 缺口并处于 execution pending', diagnosis: '正确。未成交的 $9m 公司债不能写入可用现金。' },
    ],
    correct: 'c',
    calculation: '$12m×0.9975=$11.97m；$7m×0.96=$6.72m；合计 $18.69m。Residual gap=$24m−$18.69m=$5.31m。',
    reveal: 'Target 是期望状态，order 是指令，fill 才改变持仓，settlement 才提供可用现金。',
    revisit: '回看 18–19「Target、Order、Fill、Settlement」。',
    staticTwin: { title: '变式 03 · 面值成交不等于面值现金', prompt: '基金缺口 $15m。面值 $8m 短债全部以 99.50% 成交；另一笔面值 $10m 市政债只成交 $4m、价格 97%。均按时结算。求结算款与剩余缺口。', answer: '结算款=$8m×0.995+$4m×0.97=$11.84m；剩余缺口=$3.16m。' },
  },
  {
    id: 'remaining-nav-dilution', mode: 'ledger', label: '账本实验 04 · Remaining NAV',
    title: '赎回按 $10 NAV 计算，为什么留下来的投资者只剩 $9.9333？',
    brief: '基金净资产 V=$120m、份额 N=12m，NAV=$10。赎回 x=3m 份，基础额 B=$30m；交易与冲击成本 C=$0.90m，基金从赎回付款中保留 adjustment D=$0.30m。排除未售资产重估、税费和其他流量。',
    facts: [
      { label: 'Pre-redemption', value: 'V=$120m · N=12m', note: 'NAV=$10' },
      { label: 'Redeemed', value: 'x=3m · B=$30m', note: '按赎回前 NAV' },
      { label: 'Cost allocation', value: 'C=$0.90m · D=$0.30m', note: 'D 留在基金' },
    ],
    options: [
      { id: 'a', label: '剩余 NAV 仍为 $10，因为任何按 NAV 赎回都天然中性', diagnosis: '只有无成本或 D 恰好覆盖 C 才中性；这里仍有 $0.60m 留给剩余人。' },
      { id: 'b', label: '剩余 NAV 约为 $9.9333，每份被稀释约 $0.0667', diagnosis: '正确。净未补偿成本 $0.60m 由 9m 剩余份额承担。' },
      { id: 'c', label: '剩余 NAV 为 $9.90，因为 $0.30m adjustment 不进入基金资产', diagnosis: '题设明确 D 留在基金；忽略 D 会错误分配全部成本。' },
    ],
    correct: 'b',
    calculation: 'Payment=$30m−$0.30m=$29.70m；V′=$120m−$29.70m−$0.90m=$89.40m；N′=9m；NAV′=$9.9333。',
    reveal: '赎回按比例缩小基金；跨投资者转移来自未内部化成本、市场冲击或未同步估值。',
    revisit: '回看 26–28「完整账本、Dilution 与 Composition」。',
    staticTwin: { title: '变式 04 · 部分成本内部化', prompt: '某小盘股基金净资产 V=$90m、N=6m、NAV=$15。赎回 1.2m 份，B=$18m；C=$0.36m，D=$0.12m。求剩余 NAV 与每份稀释。', answer: 'V′=$90m−$17.88m−$0.36m=$71.76m；N′=4.8m；NAV′=$14.95，每份稀释 $0.05。' },
  },
  {
    id: 'cash-buffer-rebuild', mode: 'ledger', label: '账本实验 05 · Cash Buffer',
    title: '当前缺口只有 $15m，为什么经理计划卖出 $25m？',
    brief: '基金有 $44m 确认赎回义务，全部非出售资源合计 $29m。政策要求压力状态下重建 $10m 期末现金缓冲，经理因此设定 $25m 资产出售目标。题设只分析目标分解，并假设若全部成交则按估值、无额外费用、按时结算。',
    facts: [
      { label: 'Confirmed outflow', value: '$44m', note: '本期付款前' },
      { label: 'Non-sale resources', value: '$29m', note: '全部可用来源' },
      { label: 'Sale target', value: '$25m', note: '包含 buffer 重建' },
    ],
    options: [
      { id: 'a', label: '全部 $25m 都是本期赎回机械迫使的最低出售额', diagnosis: '本期最低缺口只有 $15m；其余 $10m 是治理选择。' },
      { id: 'b', label: '若目标全部成交，$15m 覆盖当前缺口，额外 $10m 建立期末 buffer', diagnosis: '正确，但实际状态仍要等待成交与结算。' },
      { id: 'c', label: '基金无需出售，因为 $29m 非出售资源已经大于 $10m buffer', diagnosis: '把期末缓冲误当付款总额；基金仍要支付 $44m。' },
    ],
    correct: 'b',
    calculation: 'Minimum need=$44m−$29m=$15m。若 $25m 全部按时实现，期末现金=$29m+$25m−$44m=$10m。',
    reveal: '缓冲重建可降低下一轮急售概率，却扩大本轮市场足迹；单基金审慎行为可能聚合为放大。',
    revisit: '回看 20–23「Cash Buffer 与 Liquidation Policy」。',
    staticTwin: { title: '变式 05 · 再缓冲', prompt: '某基金本期需支付 $31m，非出售资源 $23m，经理计划出售 $14m，假设全部按估值成交并按时结算。分解最低付款需要与计划期末现金。', answer: '当前最低出售需要 $8m；其余 $6m 属于缓冲重建。若全部实现，期末现金 $6m。' },
  },
  {
    id: 'anti-dilution-allocation', mode: 'inference', label: '推断实验 01 · Anti-dilution',
    title: 'Swing adjustment 补足成本时，它究竟改变了什么？',
    brief: '基础赎回额 B=$12m。依已执行政策，赎回方承担 D=$0.12m adjustment，付款为 B−D；事后核算交易成本 C=$0.12m。排除未售持仓重估、税费和其他流量。',
    facts: [
      { label: 'Base claim', value: 'B=$12.00m', note: '调整前' },
      { label: 'Retained adjustment', value: 'D=$0.12m', note: '保留在基金' },
      { label: 'Realized costs', value: 'C=$0.12m', note: '归因于本次流量' },
    ],
    options: [
      { id: 'a', label: '基金凭空获得 $0.12m 外部现金，因此不可能再需要出售', diagnosis: 'Adjustment 不是第三方注资；它减少付款并改变成本归属，不保证现金充足。' },
      { id: 'b', label: '付款降至 $11.88m，且 D=C，使简化账本中的剩余人不承担净稀释', diagnosis: '正确。工具内部化成本，但不证明无需交易。' },
      { id: 'c', label: '剩余人仍必然承担全部 $0.12m，因为价格工具不能改变归属', diagnosis: '忽略已留在基金的 adjustment。' },
    ],
    correct: 'b',
    calculation: 'Payment=$12m−$0.12m=$11.88m；uncompensated cost=C−D=0。',
    reveal: 'Price-based LMT 重新分配流动性成本并削弱先动激励；它不是现金储备或成交保证。',
    revisit: '回看 27 与 39–40「Dilution、Swing、Fee 与 Levy」。',
    staticTwin: { title: '变式 06 · Adjustment 小于成本', prompt: '基础赎回额 B=$8m，D=$0.06m，实际成本 C=$0.09m。求付款额与剩余人仍承担的总成本。', answer: '付款额 $7.94m；未补偿成本 $0.03m。该工具只部分内部化成本。' },
  },
  {
    id: 'first-mover-incentive', mode: 'inference', label: '推断实验 02 · First-mover Incentive',
    title: '为什么“别人可能先赎回”会改变我今天的最优选择？',
    brief: '风险中性投资者今天赎回需承担持仓价值 0.20% 的费用；若等待到其他投资者先赎回之后，预计承担 0.75% 的未补偿未来稀释。题设冻结预期资产收益相同，并排除税、机会成本、现金需求、gate 与其他费用。',
    facts: [
      { label: 'Redeem-now cost', value: '0.20%', note: '确定费用' },
      { label: 'Expected wait dilution', value: '0.75%', note: '概率加权期望' },
      { label: 'Other motives', value: '0', note: '风险中性教学比较' },
    ],
    options: [
      { id: 'a', label: '今天赎回有 0.55% 的期望净优势，形成 first-mover incentive', diagnosis: '正确，但这只是激励判断，不证明 run 已发生。' },
      { id: 'b', label: '应等待，因为浮动 NAV 天然消除所有先后次序激励', diagnosis: '浮动 NAV 不自动把交易成本交给赎回者。' },
      { id: 'c', label: '两种选择相同，因为费用和 dilution 都不是资产基本面', diagnosis: '投资者关心最终财富，成本归属会改变退出时点。' },
    ],
    correct: 'a',
    calculation: 'Expected advantage=0.75%−0.20%=0.55% of holding value。',
    reveal: '他人赎回越多，等待者承担的成本越高，自己的赎回动机越强，才构成战略互补。',
    revisit: '回看 30–33「First-mover、Strategic Complementarity 与 Run」。',
    staticTwin: { title: '变式 07 · 费用反转简化激励', prompt: '现在赎回需承担 0.65% levy；等待导致的预期未补偿稀释为 0.30%，其他动机为零。是否存在本题定义下的 first-mover incentive？', answer: '净优势为 −0.35%，所以在冻结假设下没有“为避免稀释而抢先赎回”的动机。' },
  },
  {
    id: 'redemption-gate-clock', mode: 'inference', label: '推断实验 03 · Redemption Gate',
    title: '收到 $60m 请求后，gate 为什么既没有创造现金，也没有取消赎回压力？',
    brief: '基金以当日开始 NAV=$240m 为 gate 基数，有效请求为 25%，即 $60m。文件允许本期按比例最多支付基数 8%，未满足部分自动递延。题设假设工具已由有权主体依文件正确启动，忽略后续 NAV 变化。',
    facts: [
      { label: 'Valid requests', value: '25%×$240m=$60m', note: '截止时已收到' },
      { label: 'Current cap', value: '8%×$240m', note: '本期支付上限' },
      { label: 'Rule', value: 'carry forward', note: '递延而非取消' },
    ],
    options: [
      { id: 'a', label: '本期仍必须支付全部 $60m，因为 request 不能被 gate 改变', diagnosis: '请求历史仍为 $60m，但 gate 会改变本期支付数量与时钟。' },
      { id: 'b', label: '本期支付 $19.2m，$40.8m 递延；gate 只重排数量与时间', diagnosis: '正确。它不生成现金或消灭退出意愿。' },
      { id: 'c', label: '本期义务为零，而且 $60m 请求永久取消', diagnosis: '把 gate 写成全面 suspension，也违反递延规则。' },
    ],
    correct: 'b',
    calculation: 'Payable cap=$240m×8%=$19.2m；deferred=$60m−$19.2m=$40.8m。',
    reveal: 'Quantity-based LMT 用时间换处置空间，也可能形成队列、公告效应与下一期集中请求。',
    revisit: '回看 41–44「Gate、Deferral、Suspension 与治理」。',
    staticTwin: { title: '变式 08 · 递延不是请求消失', prompt: '基金以 $150m NAV 为基数，收到 18% 请求；文件规定本期最多支付 6%，其余递延。求本期支付额与递延额。', answer: '请求 $27m；本期支付 $9m；递延 $18m。Gate 没有创造 $9m 现金。' },
  },
  {
    id: 'fire-sale-identification', mode: 'inference', label: '推断实验 04 · Fire-sale Evidence',
    title: '什么证据才足以把“赎回与跌价同时发生”推进到火售机制？',
    brief: '基金因一项事前排定、与债券新闻相对独立的平台移除遭遇赎回。逐笔记录确认基金为固定付款截止日实际卖出 $46m；高暴露债券相对同发行人、相近期限而未被该基金持有的债券下跌 1.30%，随后五日反弹 0.90%；窗口内无发行人新闻。',
    facts: [
      { label: 'Constraint shock', value: 'predetermined removal', note: '先于债券新闻' },
      { label: 'Execution evidence', value: '$46m actual fills', note: '用于付款截止日' },
      { label: 'Relative price', value: '−1.30% then +0.90%', note: '同发行人对照' },
    ],
    options: [
      { id: 'a', label: '只要赎回请求先出现，就已证明 $46m 全部是火售', diagnosis: '请求不等于实际成交；本题更强正因为还有 fills 与价格对照。' },
      { id: 'b', label: '证据支持本事件存在约束驱动的临时价格压力，但不能推出所有赎回都会火售', diagnosis: '正确。结论仍依赖冲击外生性、匹配质量与样本边界。' },
      { id: 'c', label: '价格未完全反弹 1.30%，所以可以确定不存在火售成分', diagnosis: '部分反转与临时压力相容；不完全反转不能全盘否定。' },
    ],
    correct: 'b',
    calculation: '出售窗口相对下跌 1.30%，随后反弹 0.90%，累计残差约 −0.40%。反转是辅助证据，不是单独充分条件。',
    reveal: 'Fire sale 需要约束动机、真实成交、有限深度和可信价格反事实；同期相关或 sale target 单独不够。',
    revisit: '回看 34–36、48–54「Fire-sale 定义与研究协议」。',
    staticTwin: { title: '变式 09 · 匹配识别', prompt: '基金因预定再平衡产生现金冲击并实际卖出 $30m。高暴露债券相对同评级、同地区、相近期限对照下跌 0.90%，三日反弹 0.60%，无发行人新闻。最稳健结论是什么？', answer: '证据支持该事件存在约束驱动的临时价格压力，累计相对残差约 −0.30%；仍需审查冲击外生性与匹配，不能外推为所有赎回。' },
  },
  {
    id: 'etf-secondary-ap-boundary', mode: 'inference', label: '推断实验 05 · ETF Boundary',
    title: '投资者卖出 $9m ETF，为什么基金本身可能一分钱都没有流出？',
    brief: '零售投资者在交易所按 $30 卖出 300,000 份 ETF，成交对手为另一名二级市场投资者。流通份额前后均为 80m；当天没有 AP creation/redemption，也没有篮子或现金在 ETF 与 AP 之间转移。',
    facts: [
      { label: 'Secondary fill', value: '300,000×$30=$9m', note: '投资者之间成交' },
      { label: 'Shares outstanding', value: '80m→80m', note: '没有注销份额' },
      { label: 'AP primary activity', value: 'none', note: '没有篮子转移' },
    ],
    options: [
      { id: 'a', label: 'ETF 立即产生 $9m 赎回义务，并必须卖出 $9m 股票', diagnosis: '把二级份额转手误当 AP 赎回；钱由买方付给卖方。' },
      { id: 'b', label: '这只是份额所有权转移；题设下基金直接现金义务为零', diagnosis: '正确。二级折溢价仍可能影响后续 AP 激励。' },
      { id: 'c', label: 'ETF 永远不会因投资者卖出而出现底层市场传导', diagnosis: '从当前无直接义务错误外推；做市库存与后续 AP 仍可传导。' },
    ],
    correct: 'b',
    calculation: 'Secondary turnover=$9m，但 Δshares=0、AP redemption=0，因此该笔交易的直接 fund-level cash obligation=$0。',
    reveal: '普通 OEF 赎回、ETF 二级卖出与 AP 一级申赎是三套不同状态机。',
    revisit: '回看 02、25 与 1.21「ETF/AP 边界」。',
    staticTwin: { title: '变式 10 · AP 实物赎回不等于基金卖出', prompt: '债券 ETF 的 AP 赎回 200,000 份，每份 NAV=$25，并按文件收到约 $5m 实物债券篮子。基金未支付现金、未在市场卖债。应怎样记录？', answer: '这是约 $5m 的 AP 一级实物赎回，份额减少 200,000，资产通过篮子转移；不能记录成基金已卖出或支付 $5m 现金。AP 后续出售是另一层证据。' },
  },
];
