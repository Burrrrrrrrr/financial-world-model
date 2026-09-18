import {
  bankSecurityTradeMetrics,
  bilateralNetSettlement,
  centralBankLoanMetrics,
  centralBankPurchaseMetrics,
  coveredWriteOffMetrics,
  crossBankSettlementBalances,
  depositInsuranceMetrics,
  feasibleCreditCapacity,
  fiscalSettlementMetrics,
  moneyBaseTransitionMetrics,
  onUsLoanMetrics,
  overdraftDrawMetrics,
  prudentialMetrics,
  refinancingMetrics,
} from './bankCreditFixtures';

export type BankCreditChoice = 'a' | 'b' | 'c';
export type BankCreditMode = 'event-ledger' | 'system-boundary';

export type BankCreditAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type BankCreditScenario = {
  id: `M${number}`;
  mode: BankCreditMode;
  label: string;
  title: string;
  brief: string;
  synthetic: true;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: BankCreditChoice; label: string; diagnosis: string }[];
  correct: BankCreditChoice;
  calculation: string;
  reveal: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: BankCreditAssertion[];
  staticTwin: {
    id: `K${number}`;
    title: string;
    prompt: string;
    choices: { id: BankCreditChoice; label: string }[];
    correct: BankCreditChoice;
    calculations: string[];
    answer: string;
    formulaUnits?: string;
    sourceIds: number[];
    numericAssertions: BankCreditAssertion[];
  };
};

export const bankCreditModes: { id: BankCreditMode; label: string; title: string; description: string }[] = [
  { id: 'event-ledger', label: '事件账本', title: '从提款到核销', description: '每一步同时检查银行、客户、另一家银行与央行。' },
  { id: 'system-boundary', label: '体系边界', title: '从货币总量到约束', description: '切换交易对手、账户位置、统计口径和制度版本。' },
];

export const bankCreditScenarios: BankCreditScenario[] = [
  {
    id: 'M1', mode: 'event-ledger', label: '账本 01 · On-us Drawdown', title: '同行提款 100 的四重记录是什么？', synthetic: true,
    brief: 'SYNTHETIC：居民货币持有部门客户实际提款100，存款纳入本课广义货币口径并先记入本行账户；忽略手续费、首日ECL和税。',
    facts: [{ label: 'drawn amount', value: '100', note: 'approval 已完成' }, { label: 'holder / instrument', value: '居民 / 合格银行存款', note: '冻结进入M' }, { label: 'settlement', value: '同行', note: '尚未对外支付' }, { label: 'opening capital / reserves', value: '冻结', note: '本事件不改二者' }],
    formulas: ['Bank: ΔLoan=+Q；ΔDeposit=+Q', 'Borrower: ΔDeposit=+Q；ΔLoan payable=+Q'], formulaUnits: 'Q为同币种货币单位；每个主体满足ΔA−ΔL−ΔE=0；ΔM还需本题冻结的居民持有人和合格存款条件。',
    options: [{ id: 'a', label: '银行贷款+100、准备金−100；客户存款+100', diagnosis: '你把后续跨行结算提前放进了同行提款。' }, { id: 'b', label: '银行贷款+100、存款负债+100；借款人存款资产与贷款负债各+100', diagnosis: '正确：本金本身不创造银行权益或借款人净值。' }, { id: 'c', label: '银行把旧储户存款100转给借款人，资产负债表规模不变', diagnosis: '这把银行贷款误写成逐笔转贷既有存款。' }], correct: 'b',
    calculation: '银行ΔA=+100贷款、ΔL=+100存款；借款人ΔA=+100存款、ΔL=+100贷款。银行准备金和权益均为0变化；冻结口径ΔM=+100、ΔB=0。',
    reveal: '“贷款创造存款”是提款确认时的四重记账，不是银行无限放贷或融资无关。', primarySectionId: 'on-us-loan-drawdown', remediationSectionIds: ['vertical-double-entry', 'horizontal-quadruple-entry', 'credit-versus-money'], sourceIds: [1, 3, 7],
    numericAssertions: [{ key: 'bankLoanAsset', expected: 100, unit: 'currency' }, { key: 'bankDepositLiability', expected: 100, unit: 'currency' }, { key: 'bankReserveChange', expected: 0, unit: 'currency' }, { key: 'bankEquityChange', expected: 0, unit: 'currency' }, { key: 'borrowerNetWorthChange', expected: 0, unit: 'currency' }, { key: 'broadMoneyChange', expected: 100, unit: 'currency' }, { key: 'monetaryBaseChange', expected: 0, unit: 'currency' }],
    staticTwin: { id: 'K1', title: '变式 01 · 同行提款80', prompt: '客户实际提款80并记入贷款行账户；其余冻结条件同M1。', choices: [{ id: 'a', label: '贷款+80、存款+80；准备金与权益不变' }, { id: 'b', label: '贷款+80、权益+80' }, { id: 'c', label: '准备金−80、存款+80' }], correct: 'a', calculations: ['银行贷款资产与存款负债各+80。', '借款人存款资产与贷款负债各+80。', '准备金、银行权益与借款人净值均不变。'], answer: 'A。冻结口径下M+80、B不变。', sourceIds: [1, 3, 7], numericAssertions: [{ key: 'bankLoanAsset', expected: 80, unit: 'currency' }, { key: 'broadMoneyChange', expected: 80, unit: 'currency' }, { key: 'bankReserveChange', expected: 0, unit: 'currency' }] },
  },
  {
    id: 'M2', mode: 'event-ledger', label: '账本 02 · Cross-bank Payment', title: '借款人把100付到另一家银行后，贷款、存款和准备金落在哪里？', synthetic: true,
    brief: 'SYNTHETIC：A行发放的贷款已存在；A准备金120、B准备金80；A客户最终向B客户支付100。',
    facts: [{ label: 'A reserves', value: '120', note: '结算前' }, { label: 'B reserves', value: '80', note: '结算前' }, { label: 'final payment', value: 'A→B 100', note: '准备金最终结算' }],
    formulas: ['R_A′=R_A−Q；R_B′=R_B+Q', 'ΣΔR=0；ΣΔDeposits=0'], formulaUnits: '金额单位一致；原贷款继续留在A行。',
    options: [{ id: 'a', label: 'A准备金20、B准备金180；原贷款随存款转到B行', diagnosis: '准备金正确，但贷款合同不会因付款自动迁移。' }, { id: 'b', label: 'A准备金120、B准备金80；跨行支付不需结算', diagnosis: '公众存款迁移必须伴随银行间结算资产转移。' }, { id: 'c', label: 'A准备金20、B准备金180；体系准备金仍200，原贷款留在A行', diagnosis: '正确：存款移到B，贷款与融资任务留在A。' }], correct: 'c',
    calculation: 'A：准备金−100、付款人存款−100；B：准备金+100、收款人存款+100。120−100=20，80+100=180，合计仍200。',
    reveal: '体系新增存款可以留存，单家贷款行却会失去准备金与存款；两个尺度必须同时成立。', primarySectionId: 'interbank-deposit-payment', remediationSectionIds: ['entity-group-system-boundary', 'reserve-migration-distribution', 'private-payment-reserve-invariant'], sourceIds: [3, 8, 9, 10],
    numericAssertions: [{ key: 'payerReserveAfter', expected: 20, unit: 'currency' }, { key: 'payeeReserveAfter', expected: 180, unit: 'currency' }, { key: 'systemReserveAfter', expected: 200, unit: 'currency' }, { key: 'systemReserveChange', expected: 0, unit: 'currency' }, { key: 'systemDepositChange', expected: 0, unit: 'currency' }, { key: 'loanMigrates', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K2', title: '变式 02 · 较小付款', prompt: 'A准备金90、B准备金110；A客户向B客户最终支付40。', choices: [{ id: 'a', label: 'A=130、B=70、总额200' }, { id: 'b', label: 'A=50、B=150、总额200' }, { id: 'c', label: 'A=50、B=110、总额160' }], correct: 'b', calculations: ['A：90−40=50。', 'B：110+40=150。', '体系：50+150=200，变化为0。'], answer: 'B。存款也只在客户与银行之间迁移。', sourceIds: [8, 9, 10], numericAssertions: [{ key: 'payerReserveAfter', expected: 50, unit: 'currency' }, { key: 'payeeReserveAfter', expected: 150, unit: 'currency' }, { key: 'systemReserveAfter', expected: 200, unit: 'currency' }] },
  },
  {
    id: 'M3', mode: 'event-ledger', label: '账本 03 · Clearing & Netting', title: '双向总额170为什么只需净结算30，却没有删除170的客户交易？', synthetic: true,
    brief: 'SYNTHETIC：同一清算窗口内A→B为100、B→A为70；净额安排法律有效。',
    facts: [{ label: 'A→B gross', value: '100', note: '客户支付' }, { label: 'B→A gross', value: '70', note: '客户支付' }, { label: 'netting', value: '有效', note: '只改变结算量' }],
    formulas: ['Gross=100+70', 'Net A→B=100−70', 'Gross obligation reduction=Gross−|Net|'], formulaUnits: '客户交易量、名义结算义务与实际日内流动性需求是三个对象。',
    options: [{ id: 'a', label: '总额170；A净付B 30；名义结算义务压缩140', diagnosis: '正确：净额化不删除两方向客户交易；实际流动性节省仍取决于时序与信用。' }, { id: 'b', label: '总额30；A净付B 30；压缩0', diagnosis: '你把净结算额当成客户总交易量。' }, { id: 'c', label: '总额170；双方各结算170', diagnosis: '你把两方向相加后又让每方重复支付。' }], correct: 'a',
    calculation: 'Gross=100+70=170；net=100−70=30；名义结算义务压缩=170−30=140。它不是实际流动性节省的充分统计；时序、队列、预置资金和日内信用仍会改变峰值需求。',
    reveal: '清算、净额和最终结算必须分时钟；数学可抵销不代表法律净额必然有效。', primarySectionId: 'clearing-netting-settlement-finality', remediationSectionIds: ['interbank-deposit-payment', 'credit-lifecycle-event-clock'], sourceIds: [8, 10, 11],
    numericAssertions: [{ key: 'grossPayments', expected: 170, unit: 'currency' }, { key: 'netAtoB', expected: 30, unit: 'currency' }, { key: 'grossObligationReduction', expected: 140, unit: 'currency' }, { key: 'customerTransactionsDeleted', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K3', title: '变式 03 · 非对称总额', prompt: 'A→B为90、B→A为25；净额法律有效。', choices: [{ id: 'a', label: 'gross=115；net=65；名义义务压缩=50' }, { id: 'b', label: 'gross=65；net=65；压缩=0' }, { id: 'c', label: 'gross=115；net=115；压缩=0' }], correct: 'a', calculations: ['gross=90+25=115。', 'net=90−25=65。', '名义结算义务压缩=115−65=50。', '实际流动性节省还需支付时序、队列和日内信用数据。'], answer: 'A。总额、净额与真实日内流动性必须分栏。', sourceIds: [8], numericAssertions: [{ key: 'grossPayments', expected: 115, unit: 'currency' }, { key: 'netAtoB', expected: 65, unit: 'currency' }, { key: 'grossObligationReduction', expected: 50, unit: 'currency' }] },
  },
  {
    id: 'M4', mode: 'event-ledger', label: '账本 04 · Refinancing', title: '新贷120偿还旧贷100时，为什么总额事件与净额都必须保留？', synthetic: true,
    brief: 'SYNTHETIC：新旧债权人均为本课存款类机构体系内银行；先确认新贷款120，再用本体系合格银行存款偿还旧本金100；同币种、体系合并层、忽略费用。',
    facts: [{ label: 'new draw', value: '120', note: 'gross origination' }, { label: 'old principal repaid', value: '100', note: 'gross repayment' }, { label: 'cash-out', value: '20', note: '仍为存款' }],
    formulas: ['NetLoan=Qnew−Pold', 'NetDeposit=Qnew−Pold only under frozen in-scope bank-deposit repayment'], formulaUnits: '冻结 depository-system 层、同币种、旧债权人为体系内银行且用体系内合格存款偿还；总额120/100与净变化20不能互换。',
    options: [{ id: 'a', label: '贷款与存款净增120，因为新贷先发生', diagnosis: '遗漏了随后100的本金偿还。' }, { id: 'b', label: '贷款与存款净减100，因为旧贷被消灭', diagnosis: '遗漏了新贷款确认。' }, { id: 'c', label: 'gross新贷120、gross偿还100；贷款与存款净增20', diagnosis: '正确：期末净额相同仍不代表没有两笔交易。' }], correct: 'c',
    calculation: '冻结体系内：新贷使贷款与合格存款各+120；用体系内银行存款偿还体系内旧贷款使二者各−100；所以体系贷款与存款净变化均为+20。若旧债权人为非银，存款可能只换持有人，必须重算。',
    reveal: '再融资、正常还款与新增信用必须用 gross-flow bridge 分开，否则期末余额会隐藏合同替换。', primarySectionId: 'refinancing-gross-versus-net', remediationSectionIds: ['credit-lifecycle-event-clock', 'on-us-principal-repayment', 'transaction-revaluation-other-volume'], sourceIds: [1, 5, 7],
    numericAssertions: [{ key: 'grossOrigination', expected: 120, unit: 'currency' }, { key: 'grossRepayment', expected: 100, unit: 'currency' }, { key: 'netLoanChange', expected: 20, unit: 'currency' }, { key: 'netDepositChange', expected: 20, unit: 'currency' }],
    staticTwin: { id: 'K4', title: '变式 04 · 透支提款', prompt: '循环额度500，已有贷款120，存款30；付款80时先用存款，余额不足部分形成透支。', choices: [{ id: 'a', label: '新增透支80；余额200；未用300' }, { id: 'b', label: '新增透支50；余额170；未用330' }, { id: 'c', label: '新增透支30；余额150；未用350' }], correct: 'b', calculations: ['新增透支=max(0,80−30)=50。', '贷款余额=120+50=170。', '未用额度=500−170=330。'], answer: 'B。只有实际使用部分转成表内贷款。', sourceIds: [34, 36], numericAssertions: [{ key: 'newDraw', expected: 50, unit: 'currency' }, { key: 'loanBalanceAfter', expected: 170, unit: 'currency' }, { key: 'unusedCommitmentAfter', expected: 330, unit: 'currency' }] },
  },
  {
    id: 'M5', mode: 'event-ledger', label: '账本 05 · Allowance & Write-off', title: 'gross 100、allowance 9 后核销8，为什么存款和净贷款都不变？', synthetic: true,
    brief: 'SYNTHETIC：核销前gross loan=100、loss allowance=9；核销8已被拨备覆盖，忽略税。',
    facts: [{ label: 'gross loan', value: '100', note: '核销前' }, { label: 'allowance', value: '9', note: 'contra-asset' }, { label: 'write-off', value: '8', note: '已覆盖' }],
    formulas: ['Net=gross−allowance', 'Covered write-off: gross−W；allowance−W'], formulaUnits: '会计核销不是客户付款或自动法律免债。',
    options: [{ id: 'a', label: 'gross=92、allowance=1、net=91；存款−8', diagnosis: '净贷款正确，但核销没有借款人付款，不能机械减少存款。' }, { id: 'b', label: 'gross=92、allowance=1、net仍91；存款0变化，新增损失0', diagnosis: '正确：损失已通过拨备进入权益。' }, { id: 'c', label: 'gross=100、allowance=17、net=83；新增损失8', diagnosis: '这把核销误写成再次计提。' }], correct: 'b',
    calculation: '核销前net=100−9=91；核销后gross=100−8=92、allowance=9−8=1、net=92−1=91。deposit与reserve均0变化。',
    reveal: '逾期、违约、拨备、核销、追偿和免债是不同事件；只有实际付款才沿支付链改变存款。', primarySectionId: 'writeoff-not-repayment', remediationSectionIds: ['past-due-versus-default', 'expected-credit-loss-allowance', 'transaction-revaluation-other-volume'], sourceIds: [5, 7, 33, 36, 37],
    numericAssertions: [{ key: 'grossLoanAfter', expected: 92, unit: 'currency' }, { key: 'allowanceAfter', expected: 1, unit: 'currency' }, { key: 'netLoanAfter', expected: 91, unit: 'currency' }, { key: 'depositChange', expected: 0, unit: 'currency' }, { key: 'additionalLoss', expected: 0, unit: 'currency' }],
    staticTwin: { id: 'K5', title: '变式 05 · 拨备不足的核销', prompt: 'gross loan=120、allowance=5；核销8，忽略税。', choices: [{ id: 'a', label: 'gross=112、allowance=0、net=112；额外损失3' }, { id: 'b', label: 'gross=112、allowance=−3、net=115；损失0' }, { id: 'c', label: 'gross=120、allowance=13、net=107；损失8' }], correct: 'a', calculations: ['allowance先吸收5。', 'gross降至112，allowance降至0。', '未覆盖部分8−5=3形成额外损失；net从115降至112。'], answer: 'A。存款仍不因核销改变。', sourceIds: [33, 36, 37], numericAssertions: [{ key: 'grossLoanAfter', expected: 112, unit: 'currency' }, { key: 'allowanceAfter', expected: 0, unit: 'currency' }, { key: 'netLoanAfter', expected: 112, unit: 'currency' }, { key: 'additionalLoss', expected: 3, unit: 'currency' }, { key: 'depositChange', expected: 0, unit: 'currency' }] },
  },
  {
    id: 'M6', mode: 'system-boundary', label: '体系 06 · Bank Asset Purchase', title: '银行从居民非银行买券70，为什么没有贷款也能创造存款？', synthetic: true,
    brief: 'SYNTHETIC：卖方是本课money-holding sector，交易价70，银行以新增存款支付；无同步对冲。',
    facts: [{ label: 'asset seller', value: '居民非银行', note: '货币持有部门' }, { label: 'security price', value: '70', note: '等于账面价' }, { label: 'payment', value: '银行存款', note: '新发行负债' }],
    formulas: ['Bank securities +Q；deposit liability +Q', 'ΔM=+Q；ΔB=0'], formulaUnits: '冻结货币口径和最终经济卖方。',
    options: [{ id: 'a', label: '证券+70、居民存款+70；M+70、B不变', diagnosis: '正确：银行取得资产并发行货币性负债。' }, { id: 'b', label: '证券+70、准备金−70；M不变', diagnosis: '这是银行间买券的路径，不是向居民非银支付。' }, { id: 'c', label: '只有贷款才能创造存款，因此交易无法完成', diagnosis: '银行购买居民资产也可用新增存款负债支付。' }], correct: 'a',
    calculation: '银行资产端证券+70，负债端卖方存款+70；卖方证券−70、存款+70。冻结口径ΔM=+70，央行账本未变所以ΔB=0。',
    reveal: '货币创造取决于银行是否向合格持有人发行合格负债，不取决于资产一定叫“贷款”。', primarySectionId: 'bank-buys-security-from-nonbank', remediationSectionIds: ['credit-versus-money', 'financial-claim-passport', 'bank-sells-security-to-nonbank'], sourceIds: [1, 3, 5, 16],
    numericAssertions: [{ key: 'securitiesChange', expected: 70, unit: 'currency' }, { key: 'broadMoneyChange', expected: 70, unit: 'currency' }, { key: 'monetaryBaseChange', expected: 0, unit: 'currency' }],
    staticTwin: { id: 'K6', title: '变式 06 · 银行卖券', prompt: '居民非银行用既有存款30买入银行持有的证券；无新贷款。', choices: [{ id: 'a', label: '证券−30、居民存款−30；M−30、B不变' }, { id: 'b', label: '证券−30、准备金+30；M不变' }, { id: 'c', label: '证券+30、存款+30；M+30' }], correct: 'a', calculations: ['银行证券资产−30。', '居民既有存款与银行存款负债−30。', '冻结口径M−30；体系准备金不变。'], answer: 'A。若购买资金来自新银行贷款，完整交易链的净结果会改变。', sourceIds: [1, 5], numericAssertions: [{ key: 'securitiesChange', expected: -30, unit: 'currency' }, { key: 'broadMoneyChange', expected: -30, unit: 'currency' }, { key: 'monetaryBaseChange', expected: 0, unit: 'currency' }] },
  },
  {
    id: 'M7', mode: 'system-boundary', label: '体系 07 · Fiscal Settlement', title: '税30、随后政府从央行账户向居民支出45，孤立净结算是多少？', synthetic: true,
    brief: 'SYNTHETIC：政府账户在央行且排除于M；纳税人与收款人均为居民money holder；无发债或央行对冲。',
    facts: [{ label: 'tax to TGA', value: '30', note: '先发生' }, { label: 'resident spending', value: '45', note: '后发生' }, { label: 'account location', value: '央行', note: '关键制度开关' }],
    formulas: ['Tax: ΔM=−T；ΔB=−T', 'Spending: ΔM=+G；ΔB=+G'], formulaUnits: '账户位置、居民性与观察窗口已冻结。',
    options: [{ id: 'a', label: 'M与B各减少75', diagnosis: '你把支出方向也写成了税收。' }, { id: 'b', label: 'M与B均不变，因为政府交易总会自动抵销', diagnosis: '本题支出45大于税30，并未等额抵销。' }, { id: 'c', label: '税后−30、支出后+45；观察窗内M与B各净增15', diagnosis: '正确：先保存两笔gross flow，再计算净额。' }], correct: 'c',
    calculation: '税：M−30、B−30、TGA+30；支出：TGA−45、M+45、B+45。合并窗口净变化=45−30=+15。',
    reveal: '账户分录不等于财政乘数；政府商业银行账户、非居民收款或其他央行负债会改变路径。', primarySectionId: 'government-spending-from-central-bank-account', remediationSectionIds: ['tax-to-central-bank-government-account', 'government-debt-issuance'], sourceIds: [5, 22, 23, 24, 25],
    numericAssertions: [{ key: 'taxBroadMoneyChange', expected: -30, unit: 'currency' }, { key: 'taxBaseChange', expected: -30, unit: 'currency' }, { key: 'spendingBroadMoneyChange', expected: 45, unit: 'currency' }, { key: 'spendingBaseChange', expected: 45, unit: 'currency' }, { key: 'combinedBroadMoneyChange', expected: 15, unit: 'currency' }, { key: 'combinedBaseChange', expected: 15, unit: 'currency' }],
    staticTwin: { id: 'K7', title: '变式 07 · 净税收窗口', prompt: '同一冻结制度下，税50、政府向居民支出20。', choices: [{ id: 'a', label: 'M与B各净增70' }, { id: 'b', label: 'M与B各净减30' }, { id: 'c', label: 'M−50、B+20' }], correct: 'b', calculations: ['税使M与B各−50。', '支出使M与B各+20。', '合并为−30。'], answer: 'B。该结果只属于冻结账户结构与观察窗口。', sourceIds: [22, 24], numericAssertions: [{ key: 'combinedBroadMoneyChange', expected: -30, unit: 'currency' }, { key: 'combinedBaseChange', expected: -30, unit: 'currency' }] },
  },
  {
    id: 'M8', mode: 'system-boundary', label: '体系 08 · QE Seller Switch', title: '央行买券80时，为什么卖方部门决定M是否同步增加？', synthetic: true,
    brief: 'SYNTHETIC：无冲销；比较居民非银行最终卖方与银行卖方，交易价均80。',
    facts: [{ label: 'purchase', value: '80', note: '央行新增证券' }, { label: 'case A', value: '居民非银行卖方', note: '其存款计入M' }, { label: 'case B', value: '银行卖方', note: '只换资产构成' }],
    formulas: ['Nonbank seller: ΔB=+Q；ΔM=+Q', 'Bank seller: ΔB=+Q；ΔM=0'], formulaUnits: '最终经济卖方，不以中间dealer名称代替。',
    options: [{ id: 'a', label: '两种卖方都使M和B各+80', diagnosis: '银行卖方只把证券换成准备金，不直接产生居民存款。' }, { id: 'b', label: '非银卖方：M+80、B+80；银行卖方：M0、B+80', diagnosis: '正确：准备金与居民存款是两层不同负债。' }, { id: 'c', label: '两种卖方都只使M+80，B不变', diagnosis: '央行付款会增加准备金负债，因此B会改变。' }], correct: 'b',
    calculation: '非银：央行证券+80/准备金+80，结算行准备金+80/卖方存款+80，所以M、B各+80。银行卖方：银行证券−80/准备金+80，所以B+80、M0。',
    reveal: '“QE创造广义货币”必须带卖方和居民性护照；后续资产再配置是新事件。', primarySectionId: 'central-bank-purchase-from-resident-nonbank', remediationSectionIds: ['central-bank-purchase-from-bank-or-nonresident', 'monetary-base-versus-broad-money'], sourceIds: [1, 3, 5, 14],
    numericAssertions: [{ key: 'nonbankBroadMoneyChange', expected: 80, unit: 'currency' }, { key: 'nonbankBaseChange', expected: 80, unit: 'currency' }, { key: 'bankBroadMoneyChange', expected: 0, unit: 'currency' }, { key: 'bankBaseChange', expected: 80, unit: 'currency' }],
    staticTwin: { id: 'K8', title: '变式 08 · 央行向银行贷款', prompt: '央行向合资格银行提供抵押贷款50；尚未发生居民贷款或资产购买。', choices: [{ id: 'a', label: 'B+50、M0、银行权益0变化' }, { id: 'b', label: 'B0、M+50、银行权益+50' }, { id: 'c', label: 'B+50、M+50、银行权益+50' }], correct: 'a', calculations: ['央行：贷款资产+50、准备金负债+50。', '银行：准备金资产+50、央行借款负债+50。', 'M不变、权益不变。'], answer: 'A。流动性贷款不是资本注入。', sourceIds: [18, 19, 44], numericAssertions: [{ key: 'monetaryBaseChange', expected: 50, unit: 'currency' }, { key: 'broadMoneyChange', expected: 0, unit: 'currency' }, { key: 'bankEquityChange', expected: 0, unit: 'currency' }] },
  },
  {
    id: 'M9', mode: 'system-boundary', label: '体系 09 · Multiplier Boundary', title: 'B翻倍而M只升4%时，为什么M/B下降不代表货币收缩？', synthetic: true,
    brief: 'SYNTHETIC：B从100升至200；M从500升至520。只计算事后比率，不设固定行为系数。',
    facts: [{ label: 'monetary base', value: '100 → 200', note: '+100%' }, { label: 'broad money', value: '500 → 520', note: '+4%' }, { label: 'causal model', value: '未给定', note: '禁止固定倍数外推' }],
    formulas: ['m₀=M₀/B₀', 'm₁=M₁/B₁', 'ratio change=m₁/m₀−1'], formulaUnits: 'M/B是无量纲事后比率，不是结构系数。',
    options: [{ id: 'a', label: '比率从5升至10，证明贷款加速', diagnosis: '分母翻倍会压低而不是抬高比率。' }, { id: 'b', label: '比率从5降至2.6，下降48%；但M仍增长4%', diagnosis: '正确：比率下降不能改写M的正增长。' }, { id: 'c', label: '固定乘数5要求M变为1,000，因此520不可能', diagnosis: '这把初始事后比率误当成不可变因果律。' }], correct: 'b',
    calculation: 'm₀=500/100=5；m₁=520/200=2.6；2.6/5−1=−48%。同时M本身从500升至520，即+4%。',
    reveal: '现金偏好、准备金报酬、资产购买对手方、资本与贷款需求都会移动比率。', primarySectionId: 'money-multiplier-boundary', remediationSectionIds: ['endogenous-money', 'reserve-requirements-and-operating-framework', 'monetary-base-versus-broad-money'], sourceIds: [1, 14, 15, 17, 18, 46, 47, 48],
    numericAssertions: [{ key: 'initialRatio', expected: 5, unit: 'ratio' }, { key: 'finalRatio', expected: 2.6, unit: 'ratio' }, { key: 'ratioChangePct', expected: -48, unit: 'percent' }, { key: 'broadMoneyGrowthPct', expected: 4, unit: 'percent' }, { key: 'isCausalMultiplier', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K9', title: '变式 09 · 比率再计算', prompt: 'B从250升至300，M从1,000升至1,020。', choices: [{ id: 'a', label: 'M/B从4降至3.4，下降15%；M增长2%' }, { id: 'b', label: 'M/B从4升至4.08，增长2%' }, { id: 'c', label: 'M/B固定为4，因此M必须1,200' }], correct: 'a', calculations: ['初始=1000/250=4。', '期末=1020/300=3.4。', '比率变化=3.4/4−1=−15%；M增长2%。'], answer: 'A。比率与分子自身增速回答不同问题。', sourceIds: [14, 46, 47], numericAssertions: [{ key: 'initialRatio', expected: 4, unit: 'ratio' }, { key: 'finalRatio', expected: 3.4, unit: 'ratio' }, { key: 'ratioChangePct', expected: -15, unit: 'percent' }, { key: 'broadMoneyGrowthPct', expected: 2, unit: 'percent' }] },
  },
  {
    id: 'M10', mode: 'system-boundary', label: '体系 10 · Constraint Stack', title: '为什么七种容量的最小值70才是本题可行新增提款？', synthetic: true,
    brief: 'SYNTHETIC：各异质约束已按冻结局部映射换算成同一币种的边际容量；不是完整监管计算器。',
    facts: [{ label: 'capital / leverage', value: '150 / 120', note: 'currency capacity' }, { label: 'liquidity / stable funding', value: '90 / 110', note: 'currency capacity' }, { label: 'large exposure', value: '70', note: '最低' }, { label: 'demand / expected return', value: '95 / 85', note: '资格与经济性' }],
    formulas: ['Feasible draw=min(all separately converted capacities)'], formulaUnits: '只有在同币种、同期限、同一阶映射下才能取最小值；比率本身不能相加。',
    options: [{ id: 'a', label: '720，把七种容量相加', diagnosis: '约束是同时成立的上限，不能相加成可放贷量。' }, { id: 'b', label: '150，只看资本容量', diagnosis: '资本并非唯一尺子；集中度更先耗尽。' }, { id: 'c', label: '70，大额风险为绑定约束', diagnosis: '正确：最紧的独立门决定当前可行上限。' }], correct: 'c',
    calculation: 'min(150,120,90,110,70,95,85)=70；唯一等于70的是largeExposure。任何输入的单位或资格失配都应停止输出。',
    reveal: '“内生”不等于“无限”：合格需求、收益、资本、杠杆、流动性、稳定融资和集中度共同构成可行域。', primarySectionId: 'eligible-credit-demand-and-underwriting', remediationSectionIds: ['risk-weighted-capital-constraint', 'leverage-ratio-backstop', 'payment-liquidity-and-lcr', 'large-exposure-constraint'], sourceIds: [26, 27, 28, 29, 30, 31, 49, 50, 51],
    numericAssertions: [{ key: 'feasibleCapacity', expected: 70, unit: 'currency' }, { key: 'bindingConstraint', expected: 'largeExposure', unit: 'string' }, { key: 'capacityIsSum', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K10', title: '变式 10 · 美国存款保险边界', prompt: '截至2026-09-02，美国同一存款人、同一FDIC受保银行、同一所有权类别合格余额300,000美元；忽略其他账户与利息。', choices: [{ id: 'a', label: '受保300,000；未保0' }, { id: 'b', label: '受保250,000；未保50,000' }, { id: 'c', label: '每个账户各受保250,000，无需聚合' }], correct: 'b', calculations: ['适用标准限额=250,000。', 'insured=min(300,000,250,000)=250,000。', 'uninsured=50,000。'], answer: 'B。数字严格限于法域、日期、受保银行与所有权类别。', sourceIds: [41, 42], numericAssertions: [{ key: 'insured', expected: 250000, unit: 'USD' }, { key: 'uninsured', expected: 50000, unit: 'USD' }, { key: 'perAccountRule', expected: false, unit: 'boolean' }] },
  },
];

const m1 = onUsLoanMetrics(100, 'included');
const k1 = onUsLoanMetrics(80, 'included');
const m2 = crossBankSettlementBalances(100, 120, 80);
const k2 = crossBankSettlementBalances(40, 90, 110);
const m3 = bilateralNetSettlement(100, 70);
const k3 = bilateralNetSettlement(90, 25);
const m4 = refinancingMetrics(120, 100, true);
const k4 = overdraftDrawMetrics(500, 120, 30, 80);
const m5 = coveredWriteOffMetrics(100, 9, 8);
const k5 = coveredWriteOffMetrics(120, 5, 8);
const m6 = bankSecurityTradeMetrics(70, 'buy-from-resident-nonbank');
const k6 = bankSecurityTradeMetrics(30, 'sell-to-resident-nonbank');
const m7 = fiscalSettlementMetrics(30, 45);
const k7 = fiscalSettlementMetrics(50, 20);
const qeNonbank = centralBankPurchaseMetrics(80, 'resident-nonbank');
const qeBank = centralBankPurchaseMetrics(80, 'bank');
const k8 = centralBankLoanMetrics(50);
const m10 = feasibleCreditCapacity({ capital: 150, leverage: 120, liquidity: 90, stableFunding: 110, largeExposure: 70, eligibleDemand: 95, expectedNetReturn: 85 });
const k10 = depositInsuranceMetrics(300_000, 250_000, 'owner-bank-ownership-category');
const m9 = moneyBaseTransitionMetrics(500, 100, 520, 200);
const k9 = moneyBaseTransitionMetrics(1000, 250, 1020, 300);
const prudentialSnapshot = prudentialMetrics({ cet1: 9, tier1: 10, tier2: 5, rwa: 180, leverageExposure: 400, hqla: 120, outflows: 150, inflows: 60, asf: 110, rsf: 100, connectedExposure: 3 });

const calculatedScenarioValues: Record<string, Record<string, number | string | boolean | null | undefined>> = {
  M1: m1 ?? {}, K1: k1 ?? {},
  M2: m2 ?? {},
  K2: k2 ?? {},
  M3: m3 ?? {}, K3: k3 ?? {},
  M4: m4 ?? {},
  K4: k4 ?? {},
  M5: m5 ?? {}, K5: k5 ?? {},
  M6: m6 ?? {}, K6: k6 ?? {},
  M7: m7 ?? {}, K7: k7 ?? {},
  M8: { nonbankBroadMoneyChange: qeNonbank?.broadMoneyChange, nonbankBaseChange: qeNonbank?.monetaryBaseChange, bankBroadMoneyChange: qeBank?.broadMoneyChange, bankBaseChange: qeBank?.monetaryBaseChange },
  K8: k8 ?? {},
  M9: m9 ?? {},
  K9: k9 ?? {},
  M10: { feasibleCapacity: m10?.feasibleCapacity, bindingConstraint: m10?.bindingConstraint, capacityIsSum: m10?.capacityIsSum, ...prudentialSnapshot },
  K10: k10 ?? {},
};

function assertionPasses(actual: number | string | boolean | null | undefined, assertion: BankCreditAssertion) {
  if (typeof assertion.expected !== 'number') return actual === assertion.expected;
  return typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - assertion.expected) <= (assertion.tolerance ?? 1e-9);
}

export const bankCreditNumericAssertionAudit = bankCreditScenarios.flatMap((scenario) => ([
  ...scenario.numericAssertions.map((assertion) => ({ scenarioId: scenario.id, key: assertion.key, passed: assertionPasses(calculatedScenarioValues[scenario.id]?.[assertion.key], assertion) })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({ scenarioId: scenario.staticTwin.id, key: assertion.key, passed: assertionPasses(calculatedScenarioValues[scenario.staticTwin.id]?.[assertion.key], assertion) })),
]));

export const bankCreditScenarioAssertions = [
  { id: 'scenario-count', statement: '主题题为M1–M10共10道。', passed: bankCreditScenarios.length === 10 && bankCreditScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { id: 'static-count', statement: '静态孪生题为K1–K10共10道。', passed: bankCreditScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { id: 'mode-balance', statement: '事件账本与体系边界两个模式各有5道题。', passed: bankCreditModes.every((mode) => bankCreditScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { id: 'unique-options', statement: '每道主题题与孪生题都恰有唯一a/b/c，文案互异，且correct恰好命中一次。', passed: bankCreditScenarios.every((scenario) => {
    const mainIds = scenario.options.map((option) => option.id);
    const twinIds = scenario.staticTwin.choices.map((option) => option.id);
    return scenario.options.length === 3
      && scenario.staticTwin.choices.length === 3
      && new Set(mainIds).size === 3
      && new Set(twinIds).size === 3
      && (['a', 'b', 'c'] as const).every((id) => mainIds.includes(id) && twinIds.includes(id))
      && new Set(scenario.options.map((option) => option.label)).size === 3
      && new Set(scenario.staticTwin.choices.map((option) => option.label)).size === 3
      && scenario.options.filter((option) => option.id === scenario.correct).length === 1
      && scenario.staticTwin.choices.filter((option) => option.id === scenario.staticTwin.correct).length === 1;
  }) },
  { id: 'position-pattern', statement: '主题题与孪生题正确位置序列不同且不集中于单一位置。', passed: bankCreditScenarios.map((scenario) => scenario.correct).join('') === 'bcacbacbbc' && bankCreditScenarios.map((scenario) => scenario.staticTwin.correct).join('') === 'ababaabaab' },
  { id: 'boundary-guards', statement: '五项语义边界由纯机制计算结果产生，而不是把题面expected手填成actual。', passed: calculatedScenarioValues.M2.loanMigrates === false && calculatedScenarioValues.M3.customerTransactionsDeleted === false && calculatedScenarioValues.M9.isCausalMultiplier === false && calculatedScenarioValues.M10.capacityIsSum === false && calculatedScenarioValues.K10.perAccountRule === false },
] as const;
