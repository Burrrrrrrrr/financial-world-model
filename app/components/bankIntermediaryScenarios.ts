export type BankMode = 'ledger' | 'stress';
export type BankChoice = 'a' | 'b' | 'c';

export type BankScenario = {
  id: string;
  mode: BankMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: BankChoice;
  options: { id: BankChoice; label: string; diagnosis: string }[];
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const bankModes: { id: BankMode; label: string; title: string; description: string }[] = [
  { id: 'ledger', label: 'MODE 01', title: '从贷款到资本', description: 'T-account、结算、损失、RWA 与杠杆' },
  { id: 'stress', label: 'MODE 02', title: '从压力到动作', description: 'LCR、NSFR、流失、利率与火售反馈' },
];

export const bankScenarios: BankScenario[] = [
  {
    id: 'loan-deposit-entry',
    mode: 'ledger',
    label: '账本实验 01 · 贷款发放',
    title: '银行在本行账户内发放 8 百万元贷款时，哪两项会同时增加？',
    brief: '初始资产为准备金 10、证券 20、贷款 60；负债为存款 75、批发融资 5，权益 10。银行批准并实际发放贷款 8，直接记入借款人在本行的存款账户，尚未支用。金额均为百万元；忽略手续费、日一预期信用损失、税和其他初始计量或监管调整。',
    facts: [
      { label: 'Initial assets', value: '10 + 20 + 60 = 90', note: '准备金、证券、贷款' },
      { label: 'Funding & equity', value: '75 + 5 + 10 = 90', note: '存款、批发融资、权益' },
      { label: 'New drawdown', value: '+8 loan / +8 deposit', note: '同行内记账，尚未支付' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '贷款升至 68、准备金降至 2；存款和权益不变', diagnosis: '偷加了提现或跨行支付。贷款发放并记入本行存款时，不需要在这一时点把准备金交给借款人。' },
      { id: 'b', label: '贷款升至 68、存款升至 83、总资产升至 98；准备金与权益不变', diagnosis: '正确。银行同时取得借款人欠款的资产，并承担向借款人支付该存款的负债；贷款本金不是利润。' },
      { id: 'c', label: '贷款升至 68、权益升至 18；存款不变', diagnosis: '把贷款本金误当成银行收入。新增贷款扩大资产和存款负债，不会自动创造股东资本。' },
    ],
    calculation: '发放后资产=准备金10+证券20+贷款68=98；负债与权益=存款83+批发融资5+权益10=98。',
    reveal: '“贷款创造存款”是一笔双重记账，不是银行获得免费净资产。它创造的是贷款资产和支付性负债，资本、准备金与后续融资问题仍然存在。',
    revisit: '回看 05–13「资产负债表、T-account 与贷款—存款」。',
    staticTwin: {
      title: '变式 01 · 同行内贷款',
      prompt: '初始准备金 12、证券 18、贷款 50；存款 60、融资 12、权益 8。新增同行内贷款 5 并记入借款人存款，尚未支用；忽略手续费、日一预期信用损失、税和其他初始调整。写出新资产、存款、总表和权益。',
      answer: '贷款 55、存款 65；总资产=12+18+55=85，负债与权益=65+12+8=85。准备金仍为 12，权益仍为 8。',
    },
  },
  {
    id: 'interbank-settlement',
    mode: 'ledger',
    label: '账本实验 02 · 跨行支付',
    title: '借款人把其中 6 百万元支付给另一家银行的客户，付款行怎样变化？',
    brief: '以上一题发放后的付款行为起点：准备金 10、证券 20、贷款 68；存款 83、批发融资 5、权益 10。借款人向他行客户支付 6；题设假定以准备金最终结算，无手续费、透支或日内信用。',
    facts: [
      { label: 'Payment', value: '6 to another bank', note: '跨行而非本行内部转账' },
      { label: 'Settlement asset', value: 'central-bank reserves', note: '付款行向收款行转移 6' },
      { label: 'Loan principal', value: '68', note: '支付不是偿还贷款' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '付款行准备金降至 4、存款降至 77，贷款仍为 68；收款行获得相应准备金和存款', diagnosis: '正确。付款行的结算资产和对付款人的存款负债同时减少；原贷款仍是借款人欠付款行的债务。' },
      { id: 'b', label: '付款行贷款降至 62、存款降至 77，准备金不变', diagnosis: '把购买或转账当成偿还本金。只有借款人向贷款行偿还本金，贷款资产才会下降。' },
      { id: 'c', label: '付款行只减少存款 6，收款行只增加存款 6，银行间不需要任何结算资产', diagnosis: '删除了跨行支付的最终结算。题设明确以准备金结算，因此两家银行的准备金必须反向变化。' },
    ],
    calculation: '付款行资产=准备金4+证券20+贷款68=92；负债与权益=存款77+融资5+权益10=92。',
    reveal: '整个银行体系仍保留贷款发放创造的存款，但存款和准备金已从付款行迁到收款行。体系能够创造存款，与单家银行面临资金流出可以同时成立。',
    revisit: '回看 12–16「支出、跨行结算与单家/体系边界」。',
    staticTwin: {
      title: '变式 02 · 跨行结算',
      prompt: '付款行初始准备金 9、证券 16、贷款 55；存款 65、融资 7、权益 8。客户跨行支付 4，以准备金结算。写出付款行的新账本。',
      answer: '准备金 5、证券 16、贷款 55，总资产 76；存款 61、融资 7、权益 8，总负债与权益 76。贷款本金不因支出而变化。',
    },
  },
  {
    id: 'credit-loss-capital',
    mode: 'ledger',
    label: '账本实验 03 · 信用损失',
    title: '确认 4 百万元不可恢复贷款损失后，资本和教学资本率怎样变化？',
    brief: '某教学银行贷款 70，全部按 100% 教学风险权重计入 RWA；另有 30 零权重资产。负债 90、权益 10。现确认贷款损失 4 并立即核销；忽略税、既有拨备、收益和其他监管调整。',
    facts: [
      { label: 'Before loss', value: 'A 100 / L 90 / E 10', note: 'RWA 70' },
      { label: 'Write-off', value: '4', note: '贷款资产与权益同时减少' },
      { label: 'After-loss RWA', value: '70 − 4 = 66', note: '题设 100% 权重' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '权益 6、RWA 66、资本率约 9.09%；总资产 96，简单权益/资产比率 6.25%', diagnosis: '正确。损失先减少资产和残余权益，核销后的风险暴露也同步下降。' },
      { id: 'b', label: '权益 6、RWA 70、资本率约 8.57%，因为核销不改变暴露', diagnosis: '题设要求已核销且贷款余额下降 4；继续用原 RWA 70 会把不存在的暴露留在分母。真实监管处理仍要看适用规则。' },
      { id: 'c', label: '权益仍为 10、RWA 66、资本率约 15.15%', diagnosis: '忘记真正信用损失由权益吸收。减少风险资产不会让已经发生的损失凭空消失。' },
    ],
    calculation: '损失后贷款=66，总资产=96，权益=10−4=6；教学资本率=6/66=9.09%；简单权益/资产=6/96=6.25%。',
    reveal: '信用损失、拨备确认、核销与监管资本调整可能发生在不同时间。此题冻结为“立即确认并核销”，只为看清损失吸收与分母变化。',
    revisit: '回看 17–20 与 38「损失吸收、监管资本和拨备时序」。',
    staticTwin: {
      title: '变式 03 · 核销后的两个分母',
      prompt: '贷款/RWA 64、零权重资产 16、负债 72、权益 8。立即确认并核销贷款损失 3。计算权益、RWA、教学资本率、总资产和简单权益/资产比率。',
      answer: '权益 5、RWA 61、资本率=5/61=8.20%；总资产=80−3=77，简单权益/资产=5/77=6.49%。',
    },
  },
  {
    id: 'rwa-lending-capacity',
    mode: 'ledger',
    label: '账本实验 04 · RWA 余量',
    title: '只有教学资本率约束生效时，银行最多还能新增多少 100% 权重贷款？',
    brief: '合格教学资本为 9，现有 RWA 为 72，内部资本率底线为 10%。新增贷款全部按 100% 教学风险权重计入 RWA；假定资本、利润、损失以及杠杆和流动性约束均不变化。',
    facts: [
      { label: 'Capital', value: '9', note: '题设固定' },
      { label: 'Current RWA', value: '72', note: '当前比率 12.5%' },
      { label: 'Internal floor', value: '10%', note: '只允许 100% 权重新增贷款' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '最多新增 90，因为 9/10%=90', diagnosis: '90 是资本 9 在 10% 底线下可支持的总 RWA，不是新增量；还必须减去现有 72。' },
      { id: 'b', label: '最多新增 9，因为资本金额就是可放贷款金额', diagnosis: '把资本金额直接当成贷款额度。资本是分子，能支持的 RWA 取决于目标比率。' },
      { id: 'c', label: '最多新增 18，使总 RWA 达到 90，资本率刚好 10%', diagnosis: '正确。最大总 RWA=9/10%=90，减去现有 72 得 18。' },
    ],
    calculation: 'RWA_max=9/0.10=90；new-loan headroom=90−72=18。',
    reveal: '真实新增信用还会消耗流动性、稳定融资、杠杆暴露、运营能力和内部集中度限额；“资本允许”只说明这一项约束尚有余量。',
    revisit: '回看 19–24「RWA、资本率、缓冲与修复动作」。',
    staticTwin: {
      title: '变式 04 · 资本率允许的新增量',
      prompt: '资本 8、现有 RWA 60、内部底线 10%，只允许新增 100% 权重贷款，其他约束不生效。最多可新增多少？',
      answer: '最大总 RWA=8/10%=80，减现有 60，最多新增 20。',
    },
  },
  {
    id: 'leverage-backstop',
    mode: 'ledger',
    label: '账本实验 05 · 非风险加权后备约束',
    title: '新增零风险权重资产，为什么仍可能触发杠杆率约束？',
    brief: 'Tier 1 教学资本为 6、RWA 为 50、杠杆暴露为 120。银行增加 10 的零风险权重资产并全部由新增负债融资；题设内部杠杆率底线为 5%，忽略收益和其他调整。',
    facts: [
      { label: 'Before', value: '6/50=12% · 6/120=5%', note: '风险资本率与杠杆率' },
      { label: 'New asset', value: '+10 at 0% RWA', note: '由负债融资' },
      { label: 'After exposure', value: '130', note: 'RWA 仍为 50' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '两个比率都保持不变，因为新资产风险权重为零', diagnosis: '零风险权重只令 RWA 不变；非风险加权杠杆暴露仍增加 10。' },
      { id: 'b', label: '风险资本率仍为 12%，杠杆率降至约 4.62%，低于 5% 底线', diagnosis: '正确。杠杆率作为后备约束，正是为了捕捉低权重资产仍会扩大总敞口的情况。' },
      { id: 'c', label: '风险资本率降至 10%，杠杆率仍为 5%', diagnosis: '反转了两个分母：题设新资产不进入 RWA，却进入杠杆暴露。' },
    ],
    calculation: '风险资本率=6/50=12%；新杠杆率=6/(120+10)=4.62%。',
    reveal: '低信用风险权重不等于没有久期、价格、流动性或杠杆风险。风险加权资本率与杠杆率必须并列读取，不能互相替代。',
    revisit: '回看 19、22 与 41「RWA、杠杆后备约束与 constraint stack」。',
    staticTwin: {
      title: '变式 05 · 零权重并非零暴露',
      prompt: '资本 5、RWA 40、杠杆暴露 95。新增 5 零权重资产并由负债融资。计算前后风险资本率与杠杆率。',
      answer: '风险资本率始终为 5/40=12.5%；杠杆率由 5/95=5.26% 降至 5/100=5%。',
    },
  },
  {
    id: 'lcr-buffer',
    mode: 'stress',
    label: '压力实验 01 · LCR',
    title: '应用题设认可系数后，这家银行的教学 LCR 是否达到 100%？',
    brief: '准备金 8 按 100% 计入 HQLA，政府证券 15 按 95%，其他合格资产 4 按 50%。未来 30 日压力流出 30，题设允许计入且已经过上限检验的流入为 8。所有系数仅为教学参数。',
    facts: [
      { label: 'HQLA', value: '8×100% + 15×95% + 4×50%', note: '认可后为 24.25' },
      { label: 'Outflows', value: '30', note: '30 日标准化压力流出' },
      { label: 'Eligible inflows', value: '8', note: '题设已确认可计入' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'HQLA=24.25、净流出=22，LCR≈110.23%，达到教学底线', diagnosis: '正确。先应用认可系数，再以压力流出减去合格流入。' },
      { id: 'b', label: 'LCR≈122.73%，因为全部 27 资产都按面值计入 HQLA', diagnosis: '忽略了政府证券和其他合格资产的题设认可折扣。' },
      { id: 'c', label: 'LCR≈80.83%，因为任何流入都不能抵扣压力流出', diagnosis: '题设明确 8 已经合格且通过上限检验；把它删除会改变题目。' },
    ],
    calculation: 'HQLA=8+14.25+2=24.25；net outflows=30−8=22；LCR=24.25/22=110.23%。',
    reveal: 'LCR 是标准化 30 日压力比率，不是“未来每天都有现金”的保证。实际高速流失、集中度、操作准备和抵押品时钟仍可能更紧。',
    revisit: '回看 26–28「HQLA、净现金流出与 LCR」。',
    staticTwin: {
      title: '变式 06 · 认可后流动性不足',
      prompt: '准备金 6 按 100%、政府证券 12 按 90%、其他合格资产 4 按 50% 计入 HQLA；压力流出 25、合格流入 5。计算教学 LCR。',
      answer: 'HQLA=6+10.8+2=18.8；净流出=20；LCR=18.8/20=94%，低于 100% 教学底线。',
    },
  },
  {
    id: 'nsfr-structure',
    mode: 'stress',
    label: '压力实验 02 · NSFR',
    title: '短期批发融资权重为零时，教学 NSFR 应使用哪个分母？',
    brief: 'ASF：资本 10×100%，稳定存款 50×95%，较不稳定存款 20×90%，短期批发融资 10×0%。RSF：贷款 60×85%，证券 20×5%，准备金 10×0%。系数均为冻结教学参数。',
    facts: [
      { label: 'ASF', value: '10 + 47.5 + 18 + 0', note: '可用稳定融资 75.5' },
      { label: 'RSF', value: '51 + 1 + 0', note: '所需稳定融资 52' },
      { label: 'Horizon', value: 'structural · about one year', note: '不是今日现金' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'NSFR=100%，因为未加权融资和资产总额都是 90', diagnosis: 'NSFR 使用经过稳定度系数处理的 ASF 与 RSF，不使用未加权总额直接相除。' },
      { id: 'b', label: 'NSFR≈83.89%，因为 75.5 应除以总资产 90', diagnosis: '把 RSF 分母换成总资产。NSFR 的分母是资产和承诺按规则计算的所需稳定融资。' },
      { id: 'c', label: 'NSFR=75.5/52≈145.19%', diagnosis: '正确。短期批发融资在题设中不提供 ASF，但准备金也不要求 RSF。' },
    ],
    calculation: 'ASF=10+50×0.95+20×0.90=75.5；RSF=60×0.85+20×0.05=52；NSFR=145.19%。',
    reveal: 'NSFR 反映结构性资金期限，不等于今日可用现金，也不能替代 LCR。真实 ASF/RSF 分类和适用范围必须按法域与版本核对。',
    revisit: '回看 29–31「ASF、RSF 与 NSFR」。',
    staticTwin: {
      title: '变式 07 · 结构性稳定融资',
      prompt: 'ASF：资本 8×100%、稳定存款 40×95%、较不稳定存款 20×90%；RSF：贷款 50×85%、证券 20×5%。计算教学 NSFR。',
      answer: 'ASF=8+38+18=64；RSF=42.5+1=43.5；NSFR=64/43.5=147.13%。',
    },
  },
  {
    id: 'deposit-runoff-funding-gap',
    mode: 'stress',
    label: '压力实验 03 · 存款流失',
    title: '只按今日可动用资源，这家银行还差多少流动性？',
    brief: '今日确认存款流出 18。可用准备金 5；未设押且操作已就绪的抵押品市场价值 12，借款 haircut 为 20%；没有其他已确认融资或当日流入。',
    facts: [
      { label: 'Runoff today', value: '18', note: '已确认现金需要' },
      { label: 'Usable reserves', value: '5', note: '可直接结算' },
      { label: 'Collateral capacity', value: '12×(1−20%)=9.6', note: '已满足资格和操作条件' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '流动性 17、缺口 1，因为抵押品可按面值全部借出', diagnosis: '忽略 20% haircut。合格抵押品的账面或市场价值不等于可借现金。' },
      { id: 'b', label: '最大流动性 14.6，今日缺口 3.4', diagnosis: '正确。准备金 5 加折扣后借款能力 9.6，只能覆盖 14.6。' },
      { id: 'c', label: '只有准备金 5 可用，缺口 13，因为抵押融资永远不能用于支付', diagnosis: '题设明确抵押品未设押且操作就绪，可形成当日借款能力；把它全部删除不符合条件。' },
    ],
    calculation: 'Liquidity capacity=5+12×0.80=14.6；shortfall=18−14.6=3.4。',
    reveal: '央行或市场抵押融资可以争取时间，但不会自动补回资产经济损失或重建资本。资格、haircut、预先质押和操作测试必须在压力前准备。',
    revisit: '回看 32–33 与 39–40「存款行为、应急融资和流失时钟」。',
    staticTwin: {
      title: '变式 08 · Haircut 后的融资缺口',
      prompt: '今日流出 15；可用准备金 4；未设押、操作就绪抵押品市场价值 10，haircut 25%。没有其他流入或融资。计算流动性能力与缺口。',
      answer: '抵押融资能力=10×75%=7.5；总流动性=4+7.5=11.5；缺口=15−11.5=3.5。',
    },
  },
  {
    id: 'nii-eve-split',
    mode: 'stress',
    label: '压力实验 04 · NII 与 EVE',
    title: '同一次加息能否令短期净利息收入上升、经济价值权益却下降？',
    brief: '利率平行上升 100 bp。未来一年重定价资产 80、beta 100%；重定价存款 50、deposit beta 40%；批发融资 20、beta 100%。另用经济价值视角：资产 100、修正久期 4，负债 90、修正久期 1。忽略凸性、税、基差与行为变化。',
    facts: [
      { label: 'Income repricing', value: '80 vs 50×40% + 20', note: '金额×利率变化' },
      { label: 'EVE duration', value: '4×100 vs 1×90', note: '货币久期差 310' },
      { label: 'Rate shock', value: '+100 bp = +0.01', note: '同一教学曲线' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'ΔNII=+0.40；ΔEVE≈−3.10', diagnosis: '正确。短期可重定价资产收益增加 0.8，负债成本增加 0.4；资产货币久期大于负债，经济价值权益下降 3.1。' },
      { id: 'b', label: 'ΔNII=+0.80；ΔEVE≈−4.00', diagnosis: '只计算资产端，删除了存款与批发融资成本，也删除了负债价值下降对权益的正贡献。' },
      { id: 'c', label: 'ΔNII=−0.40；ΔEVE≈+3.10', diagnosis: '把收入与经济价值两个方向都反转了。题设资产重定价额和货币久期差均已冻结。' },
    ],
    calculation: 'ΔNII=80×0.01−50×0.004−20×0.01=0.40；ΔEVE≈−(4×100−1×90)×0.01=−3.10。',
    reveal: 'NII 是期间收入时钟，EVE 是资产负债经济价值时钟；二者方向可以不同。Deposit beta、存款稳定性、提前还款和非平行曲线会改变真实结果。',
    revisit: '回看 34–37「重定价、NII、EVE 与 deposit beta」。',
    staticTwin: {
      title: '变式 09 · 两个利率风险时钟',
      prompt: '利率上升 150 bp；重定价资产 60、beta 100%；存款 40、beta 50%；批发融资 10、beta 100%。经济价值资产 90/修正久期 5、负债 82/修正久期 2。计算 ΔNII 与一阶 ΔEVE。',
      answer: 'ΔNII=60×0.015−40×0.0075−10×0.015=+0.45；ΔEVE≈−(5×90−2×82)×0.015=−4.29。',
    },
  },
  {
    id: 'fire-sale-credit-feedback',
    mode: 'stress',
    label: '压力实验 05 · 火售与资本反馈',
    title: '卖资产填满现金缺口后，为什么资本修复任务可能反而出现？',
    brief: '银行今日现金缺口 8，只能出售一项按账面价值计入 100% RWA 的证券；市场成交价为账面价值的 80%。出售前 CET1=8、RWA=80。题设忽略税和其他收益，出售后若要恢复 9% 教学资本率，可继续无损减少 100% 权重暴露或补充资本。',
    facts: [
      { label: 'Cash need', value: '8', note: '需卖账面 10 才能取得' },
      { label: 'Sale price', value: '80% of book', note: '确认损失 2' },
      { label: 'Before', value: 'CET1 8 / RWA 80', note: '初始 10%' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '卖账面 8 即可取得现金 8，且资本率自动改善', diagnosis: '按 80% 成交只能取得 6.4，现金仍不足；同时折价会确认损失。' },
      { id: 'b', label: '卖账面 10 后现金问题和资本问题都已解决，因为 RWA 降至 70', diagnosis: '卖出虽减少 RWA，却也确认损失 2，使 CET1 降至 6；6/70 仍低于 9%。' },
      { id: 'c', label: '卖账面 10 取得 8，CET1 降至 6、RWA 降至 70、比率约 8.57%；还需减 RWA 或补 0.30 资本', diagnosis: '正确。连续减仓解为 3.333…；若以 0.01 为最小步长并保证达标，至少减少 3.34。若 RWA 不变，则需补资本 0.09×70−6=0.30。' },
    ],
    calculation: 'Sale book=8/0.8=10；loss=2；CET1=6；RWA=70；ratio=8.57%；RWA_max=6/0.09=66.666…；连续减仓=3.333…，按 0.01 向上取整为 3.34；补资本=0.30。',
    reveal: '只有存在约束驱动、折价成交和有限买方能力时，才应称为 fire sale。卖资产不必然改善资本；实现损失可能压过 RWA relief，并把流动性问题转成信用收缩。',
    revisit: '回看 45–49「修复瀑布、火售、信用供给与状态依赖」。',
    staticTwin: {
      title: '变式 10 · 现金修复后的资本缺口',
      prompt: '现金缺口 6，证券按账面价值 75% 成交；出售前 CET1=7、RWA=70，证券按 100% 权重。为恢复 9% 教学资本率，还需减少多少 100% 权重暴露，或补多少资本？',
      answer: '需卖账面 6/0.75=8，确认损失 2；CET1=5、RWA=62、比率=8.06%。最大 RWA=5/9%=55.555…，连续减仓值为 6.444…；若以 0.01 为最小步长并保证达标，至少减少 6.45。若不缩 RWA，则需资本=9%×62−5=0.58。',
    },
  },
];
