export type GlobalMacroMode = 'translate' | 'audit';
export type GlobalMacroChoice = 'a' | 'b' | 'c';

export type GlobalMacroScenario = {
  id: string;
  mode: GlobalMacroMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: GlobalMacroChoice; label: string; diagnosis: string }[];
  correct: GlobalMacroChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const globalMacroModes: { id: GlobalMacroMode; label: string; title: string; description: string }[] = [
  { id: 'translate', label: 'MODE A', title: '把观点翻译成暴露', description: '从预期差、利率敏感度与外汇报价走到可核算的情景损益。' },
  { id: 'audit', label: 'MODE B', title: '审计 carry、约束与证据', description: '检查期限价格、杠杆、融资以及 target 为什么还不是 flow。' },
];

export const globalMacroScenarios: GlobalMacroScenario[] = [
  {
    id: 'standardized-surprise',
    mode: 'translate',
    label: '信息实验 01 · Actual versus Expectation',
    title: '通胀高于预测多少，才叫同口径的“正 surprise”？',
    brief: '某月 CPI 环比公布值为 0.4%，决策前调查中位数为 0.2%，同一指标历史预测误差的标准差为 0.1 个百分点。调查、公布值和误差尺度的季调、口径与发布时间均已对齐；选择证据允许的最强结论。',
    facts: [
      { label: 'Actual A', value: '0.4%', note: '本次公布值' },
      { label: 'Prior expectation E', value: '0.2%', note: '公布前已冻结' },
      { label: 'Surprise scale σe', value: '0.1 个百分点', note: '历史 A−E 的标准差' },
    ],
    options: [
      { id: 'a', label: 'z=−2，股票必然上涨', diagnosis: '符号算反，而且 surprise 的大小不能单独决定股票方向；反应还取决于市场状态、政策路径与风险溢价。' },
      { id: 'b', label: 'z=+2；它度量意外程度，但不单独识别资产方向', diagnosis: '正确。先识别相对公布前预期的标准化意外，再另行估计价格映射。' },
      { id: 'c', label: 'z=+0.2；因为只需计算 0.4−0.2', diagnosis: '0.2 个百分点是原始预测误差；标准化 surprise 还要除以 0.1 个百分点。' },
    ],
    correct: 'b',
    calculation: 'e=A−E=0.4%−0.2%=+0.2 个百分点；z=e/σe=0.2/0.1=+2。',
    reveal: '“数据高”不是交易方向。Global macro 先问它相对谁高、超出多少、市场原先怎样定价，再问该状态下哪个价格通道占主导。',
    revisit: '回看 06–12「状态、市场基准、surprise 与条件映射」。',
    staticTwin: {
      title: '变式 01 · 失业率的好坏不能由符号代替',
      prompt: '失业率公布 4.2%，公布前预期 4.0%，同口径预测误差标准差 0.1 个百分点。求标准化 surprise，并说明能否仅据此断言债券上涨。',
      answer: 'z=(4.2−4.0)/0.1=+2。它表示失业率比预期高两个历史标准差；债券方向仍取决于增长、通胀、政策反应与信息效应，不能由 z 的正号机械推出。',
    },
  },
  {
    id: 'price-is-not-pure-expectation',
    mode: 'translate',
    label: '预期实验 02 · Price versus Belief',
    title: '利率期货隐含 4.0%，能否直接写成“市场相信未来利率就是 4.0%”？',
    brief: '某一到期利率合约的报价换算为 4.0%，同期调查均值为 3.7%。题目没有提供期限／风险溢价、合约平均结算口径、凸性调整或参与者分布；选择最严谨表述。',
    facts: [
      { label: 'Price-implied rate', value: '4.0%', note: '由可交易合约报价换算' },
      { label: 'Survey mean', value: '3.7%', note: '受访者点预测均值' },
      { label: 'Risk-premium adjustment', value: 'Unknown', note: '不能假定为 0' },
    ],
    options: [
      { id: 'a', label: '市场对未来利率的主观概率均值必为 4.0%', diagnosis: '合约价格还可能包含风险溢价、结算平均、凸性和技术供需，不能无模型地还原唯一信念。' },
      { id: 'b', label: '调查一定正确，合约 4.0% 可以忽略', diagnosis: '调查也有抽样、聚合和激励限制；二者是不同观测，不存在先验的绝对真值。' },
      { id: 'c', label: '只能称 4.0% 为该合约的价格隐含量；纯预期需额外调整与模型', diagnosis: '正确。可交易价格是约束下的边际价格，不等于全体参与者无风险溢价的平均信念。' },
    ],
    correct: 'c',
    calculation: 'Price-implied 4.0% = expectation component + risk/term premium + contract/convention adjustments；题设没有足够信息把后几项设为 0。',
    reveal: 'Global macro 的“市场预期”必须注明来源：调查、期货、OIS、期权分布或分析师共识测量的是不同对象。',
    revisit: '回看 06、08–12「信息集合、市场共识与可交易价格」。',
    staticTwin: {
      title: '变式 02 · 远期价格也不是无偏预测的同义词',
      prompt: '两年期价格隐含政策利率 3.5%，调查均值 3.1%，但期限溢价未知。哪一个数是“真实市场预期”？',
      answer: '题设无法识别唯一真实预期。3.5% 是特定价格与合约口径下的隐含量，3.1% 是调查聚合；要比较须建模期限／风险溢价、样本与结算规则。',
    },
  },
  {
    id: 'bond-dv01',
    mode: 'translate',
    label: '利率实验 03 · DV01',
    title: '宏观观点写成“利率上行”后，怎样变成可核算的债券损益？',
    brief: '基金持有一笔多头债券仓位。当前 DV01 的正数报价为每上升 1 bp（0.01 个百分点）损失 18,000 美元；假设收益率曲线平行上移 15 bp，忽略凸性、carry、融资、汇率和交易成本。',
    facts: [
      { label: 'Position', value: 'Long bond', note: '价格与收益率反向' },
      { label: 'DV01 magnitude', value: '$18,000 / bp', note: '本题定义为利率上升的损失幅度' },
      { label: 'Yield move', value: '+15 bp', note: '平行上移' },
    ],
    options: [
      { id: 'a', label: '一阶 P&L≈−$270,000', diagnosis: '正确。多头 duration 在收益率上升时先承受价格损失。' },
      { id: 'b', label: '一阶 P&L≈+$270,000', diagnosis: '把债券价格—收益率方向写反；该符号更接近等 DV01 空头的结果。' },
      { id: 'c', label: '一阶 P&L≈−$1,200', diagnosis: '把总变动除以 DV01；应以每 bp 损益乘 15 bp。' },
    ],
    correct: 'a',
    calculation: 'ΔP≈−DV01×Δy(bp)=−$18,000/bp×15 bp=−$270,000。',
    reveal: '“看空债券”还不够：必须声明是哪个曲线点、多少 signed DV01、什么期限和币种，才知道观点的实际风险单位。',
    revisit: '回看 19–23「债券价格、duration、DV01 与 convexity」。',
    staticTwin: {
      title: '变式 03 · 空头 duration 遇到利率下降',
      prompt: '一笔债券空头的 DV01 幅度为 $12,000/bp，收益率平行下降 8 bp。忽略其他项，求一阶 P&L。',
      answer: '债券多头因利率下降约赚 $96,000，等规模空头约亏 $96,000；空头的一阶 P&L≈$12,000×(−8)=−$96,000。',
    },
  },
  {
    id: 'curve-relative-value',
    mode: 'translate',
    label: '曲线实验 04 · Steepener',
    title: '“长端比短端升得更多”如何用近似 DV01 中性的两条腿表达？',
    brief: '组合做多 2 年期债券、做空 10 年期债券，两腿 DV01 幅度均为 $10,000/bp，因此对平行小幅移动近似中性。随后 2 年收益率上升 5 bp，10 年收益率上升 20 bp；忽略 convexity、carry、roll、basis 与成本。',
    facts: [
      { label: '2y leg', value: 'Long · $10k/bp', note: '利率上升产生损失' },
      { label: '10y leg', value: 'Short · $10k/bp', note: '利率上升产生收益' },
      { label: 'Realized move', value: '+5 bp / +20 bp', note: '10y−2y 利差扩大 15 bp' },
    ],
    options: [
      { id: 'a', label: 'P&L≈−$250,000，因为两端都上升', diagnosis: '相对价值仓位不能只看收益率共同方向；10 年空头的收益抵消并超过 2 年多头损失。' },
      { id: 'b', label: 'P&L≈0，因为初始 DV01 中性', diagnosis: 'DV01 中性只对平行移动近似中性；曲线斜率变化正是该组合要保留的暴露。' },
      { id: 'c', label: 'P&L≈+$150,000', diagnosis: '正确。2 年腿亏 50,000，10 年空头赚 200,000，净赚 150,000。' },
    ],
    correct: 'c',
    calculation: 'Π≈(−$10k×5)+(+$10k×20)=−$50k+$200k=+$150k。',
    reveal: 'Relative value 不是无风险：它只是主动压低某些共同暴露，同时保留 slope、curvature、basis、carry 或流动性风险。',
    revisit: '回看 22、30 与 35「曲线交易、carry／roll 与残余暴露」。',
    staticTwin: {
      title: '变式 04 · 非平行下降下的曲线 P&L',
      prompt: '做多 5 年、做空 30 年，两腿 DV01 均为 $7,000/bp；5 年收益率下降 20 bp，30 年下降 8 bp。忽略其他项，求净 P&L。',
      answer: '5 年多头约赚 $140,000；30 年空头约亏 $56,000；净 P&L≈+$84,000。初始平行 DV01 中性不等于任何曲线变化下 P&L 为零。',
    },
  },
  {
    id: 'fx-forward-translation',
    mode: 'translate',
    label: '外汇实验 05 · Quote、CIP 与 Payoff',
    title: '同一个“看多欧元”观点，怎样避免把报价方向和利差写反？',
    brief: '即期 S=1.1000 USD/EUR，即 1 欧元值 1.10 美元；半年美元简单利率 4%，欧元简单利率 2%。忽略 cross-currency basis 与成本。基金以理论远期价做多 EUR 10m，半年后即期为 1.1400 USD/EUR；选择理论 F 与到期未折现 P&L。',
    facts: [
      { label: 'Quote S', value: '1.1000 USD/EUR', note: 'domestic USD per foreign EUR' },
      { label: 'Rates', value: 'rUSD=4% · rEUR=2%', note: 'simple annual rates' },
      { label: 'Long foreign notional', value: 'EUR 10m · T=0.5', note: '到期买入欧元、支付美元' },
    ],
    options: [
      { id: 'a', label: 'F≈1.0892；P&L≈+$508,000', diagnosis: '利差方向写反。以 USD/EUR 报价时，美元利率更高使欧元远期相对即期升水。' },
      { id: 'b', label: 'F≈1.1109；P&L≈+$291,089', diagnosis: '正确。先冻结 domestic/foreign，再按 CIP 求远期并用 S_T−F 计算多头外币 payoff。' },
      { id: 'c', label: 'F=1.1000；P&L=0，因为远期没有初始价值', diagnosis: '远期初始价值可为 0，不表示交割价等于即期，也不表示到期 payoff 必为 0。' },
    ],
    correct: 'b',
    calculation: 'F=S(1+rUSD·T)/(1+rEUR·T)=1.1000×1.02/1.01≈1.110891；Π=EUR10m×(1.1400−1.110891)≈+$291,089。',
    reveal: 'FX 公式没有脱离报价 convention 的“统一正负号”。每次都先写“每 1 单位哪种货币值多少另一种货币”，再定义多空与结算币种。',
    revisit: '回看 24–26「FX 报价、CIP、远期 P&L 与 carry」。',
    staticTwin: {
      title: '变式 05 · CAD/USD 报价下的远期多头',
      prompt: 'S=1.3500 CAD/USD，半年 CAD 利率 3%、USD 利率 5%，忽略 basis。以理论 F 做多 USD 5m，半年后 S_T=1.3700。求 F 与未折现 CAD P&L。',
      answer: 'F=1.35×1.015/1.025≈1.336829 CAD/USD；P&L=USD5m×(1.3700−1.336829)≈CAD165,854。先把 CAD 视为 domestic、USD 视为 foreign，公式方向才不会混乱。',
    },
  },
  {
    id: 'carry-is-not-arbitrage',
    mode: 'audit',
    label: '收益实验 06 · Carry versus Expected Return',
    title: '高息货币的正 carry 为什么不是已经锁定的超额收益？',
    brief: '某策略借低息货币、通过远期做多高息货币。若汇率、曲线和估值不变，策略有正 ex-ante carry；但题目没有对未来即期、波动、流动性、jump 或融资状态作保证。',
    facts: [
      { label: 'Funding currency rate', value: '2%', note: '低息腿' },
      { label: 'Investment currency rate', value: '10%', note: '高息腿' },
      { label: 'Future FX state', value: 'Unknown', note: '可发生跳跃与贬值' },
    ],
    options: [
      { id: 'a', label: '利差 8%，所以无论汇率怎样都至少赚 8%', diagnosis: '把条件性 carry 当作到期保证；外币贬值、basis、成本和融资变化都可超过利差。' },
      { id: 'b', label: 'CIP 成立，所以任何 currency carry 的期望收益必为 0', diagnosis: 'CIP 约束有套保的无套利远期价格，不等于 UIP 成立，也不规定未套保 carry 的实际风险溢价为 0。' },
      { id: 'c', label: '正 carry 是“价格状态不变时”的收益分量，不是套利或收益保证', diagnosis: '正确。历史 carry premium 可能正，但与波动、流动性和 crash risk 同时存在。' },
    ],
    correct: 'c',
    calculation: 'Total return = carry + future spot/curve/basis valuation change − funding/transaction costs；只有第一项的当前条件为正。',
    reveal: 'Carry 是收益分解，不是因果解释，更不是无风险承诺。宏观基金必须把“赚时间”与“怕状态跳变”写在同一张情景表中。',
    revisit: '回看 25–26、30 与 45「carry、roll 和 P&L attribution」。',
    staticTwin: {
      title: '变式 06 · 正 carry 也可出现负总收益',
      prompt: '一笔年度化正 carry 6% 的外汇仓位持有一个月，粗略 carry 为 +0.5%；同期投资货币相对结算货币贬值 4%，忽略其他项。总收益约多少？',
      answer: '约 −3.5%。正 carry 只抵消了部分汇率损失；精确结果还需复利、远期点、notional 与成本口径。',
    },
  },
  {
    id: 'equity-index-fair-value',
    mode: 'audit',
    label: '股指实验 07 · Cost of Carry',
    title: '用股指期货表达增长观点时，期货价格为什么不等于现货指数？',
    brief: '现货指数 S=5,000，连续复利融资率 r=4%，连续股息率 q=1.5%，到期 T=0.25 年；忽略交易成本、税、融券限制和离散股息误差。市场期货为 5,040。',
    facts: [
      { label: 'Spot index', value: '5,000', note: '不可直接与期货点位相减定输赢' },
      { label: 'Net carry r−q', value: '2.5%', note: '连续复利假设' },
      { label: 'Maturity', value: '0.25 year', note: '约三个月' },
    ],
    options: [
      { id: 'a', label: '理论 F≈5,031.35；市场高约 8.65 点，但未计摩擦不能直接称可套利利润', diagnosis: '正确。先做融资与股息调整，再讨论实际 basis、交易成本和可执行性。' },
      { id: 'b', label: '理论 F=5,000；市场高 40 点就是无风险利润', diagnosis: '漏掉持有现货的融资成本与股息收益，也忽略现实套利带。' },
      { id: 'c', label: '理论 F≈4,968.85，因为股息率低于利率', diagnosis: '当 r>q 时，净持有成本为正，理论远期通常高于即期而非低于即期。' },
    ],
    correct: 'a',
    calculation: 'F=S·exp[(r−q)T]=5,000·exp[(0.04−0.015)×0.25]≈5,031.35；observed basis gap≈8.65 点。',
    reveal: '股指期货把方向、融资、股息和 basis 装进同一合约。看对股票方向仍可能因期限、roll、currency 或 basis 选择而得到不同 P&L。',
    revisit: '回看 27–28 与 30「股票价格通道、股指期货与 basis」。',
    staticTwin: {
      title: '变式 07 · 半年股指远期',
      prompt: 'S=4,000，连续融资率 3%、股息率 1%、T=0.5。忽略摩擦，求理论 F；若市场为 4,050，只能作何有限判断？',
      answer: 'F=4,000e^0.01≈4,040.20。市场较理论值高约 9.80 点；在核对股息估计、时间戳、融资、交易成本和可借券性前，只能称观察到正的模型 basis gap。',
    },
  },
  {
    id: 'commodity-curve',
    mode: 'audit',
    label: '商品实验 08 · Storage 与 Convenience Yield',
    title: '“原油供给受扰”为什么不能只用现货方向判断期货仓位收益？',
    brief: '可储存商品现货 S=80，连续融资率 5%、储存成本率 2%、便利收益率 3%，半年到期。假设这些输入可冻结且允许标准 cash-and-carry；选择理论远期与严谨解释。',
    facts: [
      { label: 'Spot', value: '80', note: '当前现货价格' },
      { label: 'r + u − y', value: '5% + 2% − 3% = 4%', note: '净持有成本' },
      { label: 'Maturity', value: '0.5 year', note: '半年' },
    ],
    options: [
      { id: 'a', label: 'F=80；期货总会一对一复制现货', diagnosis: '漏掉融资、储存与持有实物的便利收益；期限结构并非恒为平坦。' },
      { id: 'b', label: 'F≈81.62；供给冲击还可能改变 y、曲线与 roll，期货收益不只看现货', diagnosis: '正确。理论关系与实际 P&L 都依赖期限、库存条件和可交易约束。' },
      { id: 'c', label: 'F≈78.42；便利收益率必须加到远期价', diagnosis: '便利收益降低持有实物的净成本，在该 convention 下应从 r+u 中减去。' },
    ],
    correct: 'b',
    calculation: 'F=S·exp[(r+u−y)T]=80·exp[(0.05+0.02−0.03)×0.5]≈81.62。',
    reveal: '商品宏观观点必须指定合约月份。现货、近月、远月和滚动指数可因库存、储存、便利收益与期限结构给出不同回报。',
    revisit: '回看 29–30「商品期限结构与收益分账」。',
    staticTwin: {
      title: '变式 08 · 三个月商品远期',
      prompt: 'S=60，连续 r=4%、储存 u=3%、便利收益 y=2%，T=0.25。求理论 F，并说明 y 上升、其他不变时 F 怎样变。',
      answer: 'F=60e^[(.04+.03−.02)×.25]≈60.75。其他不变时 y 上升会降低净持有成本，因此理论 F 下降；这并不保证现货同时下降。',
    },
  },
  {
    id: 'gross-net-margin',
    mode: 'audit',
    label: '约束实验 09 · Gross、Net 与 Margin',
    title: '净方向只有 30%，为什么基金仍可能因融资约束被迫大幅减仓？',
    brief: '基金 NAV 为 $100m，多头名义 $240m、空头名义 $210m。账户可用现金 $5m，新增 margin call 为 $12m；不允许新增融资或资产转入。',
    facts: [
      { label: 'Long / short notional', value: '$240m / $210m', note: '绝对名义规模' },
      { label: 'NAV', value: '$100m', note: '杠杆分母' },
      { label: 'Cash / margin call', value: '$5m / $12m', note: '现金缺口 $7m' },
    ],
    options: [
      { id: 'a', label: 'Gross=4.5×、Net=0.3×；仍有 $7m 现金缺口，观点不变也可能减仓', diagnosis: '正确。低净方向不代表低融资、basis、margin 或 gross liquidation risk。' },
      { id: 'b', label: 'Gross=0.3×，所以 margin call 不会约束基金', diagnosis: '把 net exposure 当成 gross exposure；多空抵消方向，却不消除两腿的融资和保证金需求。' },
      { id: 'c', label: 'Gross=2.4×、Net=2.1×；现金缺口为 0', diagnosis: '分别把多头和空头倍率误叫 gross/net，也忽略 $12m−$5m 的资金缺口。' },
    ],
    correct: 'a',
    calculation: 'Gross=(240+210)/100=4.5×；Net=(240−210)/100=0.3×；cash shortfall=12−5=$7m。',
    reveal: '宏观基金的资产负债表先约束仓位，观点才在剩余可行域中表达。Margin、haircut 与 funding tenor 会把“仍然相信”改写成“必须卖”。',
    revisit: '回看 39–43「组合规模、gross/net、融资与执行接口」。',
    staticTwin: {
      title: '变式 09 · 另一组多空账本',
      prompt: 'NAV=$200m，多头 $360m、空头 $260m，可用现金 $8m，新增 margin call $15m。求 gross、net 与现金缺口。',
      answer: 'Gross=(360+260)/200=3.1×；Net=(360−260)/200=0.5×；现金缺口=$7m。净暴露 0.5× 不会抵消两腿的 margin 和 liquidation needs。',
    },
  },
  {
    id: 'target-is-not-flow',
    mode: 'audit',
    label: '证据实验 10 · Target versus Flow',
    title: '只拿到新的跨资产 target，能否断言基金今天买了债券、卖了美元？',
    brief: '研究者只观察到新目标：USD 计价 rate DV01 +$100k/bp、美元现汇暴露 −$20m、股指期货 delta +$5m。Post-shock actual、旧 target、现金流、跨账户净额、工具替换、订单和成交均未知。',
    facts: [
      { label: 'New target', value: 'Known', note: '三类目标暴露' },
      { label: 'Post-shock actual', value: 'Unknown', note: '候选订单的比较基准缺失' },
      { label: 'Orders / fills', value: 'Unknown', note: '实施与成交证据缺失' },
    ],
    options: [
      { id: 'a', label: '目标为正的腿今天一定买入，目标为负的腿一定卖出', diagnosis: '目标符号不是订单符号；actual 可能已经高于、低于或等于目标。' },
      { id: 'b', label: '只能识别目标状态；真实订单、成交和市场流量仍不可识别', diagnosis: '正确。还需 actual、NAV、载体、netting、执行窗口与 fills 才能向流量推进。' },
      { id: 'c', label: '新 target 就是收盘时的最终仓位', diagnosis: '跳过了订单生成、约束、部分成交、价格变化和未成交剩余。' },
    ],
    correct: 'b',
    calculation: 'Desired order exposure = target exposure − post-shock actual exposure；题设缺 actual，连候选订单符号都不可识别，更不能识别 fill。',
    reveal: 'Global macro 是生成跨资产 target 的 agent；它不是一张公开成交带。市场归因必须从规则与目标继续走到 actual、order、fill 和价格响应。',
    revisit: '回看 43、48–51「账户状态、反馈和证据边界」。',
    staticTwin: {
      title: '变式 10 · 目标上调也未必形成买单',
      prompt: '某基金把股指目标从 $30m 上调到 $40m，但价格上涨后 post-shock actual 已达 $46m；忽略其他净额时，候选订单方向是什么？这是否等于最终成交？',
      answer: '候选差额为 40−46=−$6m，即卖出方向。它仍不等于最终成交：还要经过约束、订单切分、容量与 fill。',
    },
  },
];
