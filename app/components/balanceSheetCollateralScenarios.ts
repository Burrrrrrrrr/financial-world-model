import {
  balanceSheetSnapshotMetrics,
  borrowingCapacityEnvelope,
  collateralIdentificationMetrics,
  debtOverhangMetrics,
  financialAcceleratorMetrics,
  pledgeableCollateralMetrics,
} from './balanceSheetCollateralFixtures';

export type BalanceSheetCollateralChoice = 'a' | 'b' | 'c';
export type BalanceSheetCollateralMode = 'measurement-capacity' | 'dynamics-identification';

export type BalanceSheetCollateralAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type BalanceSheetCollateralScenario = {
  id: `M${number}`;
  mode: BalanceSheetCollateralMode;
  label: string;
  title: string;
  brief: string;
  synthetic: true;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: BalanceSheetCollateralChoice; label: string; diagnosis: string }[];
  correct: BalanceSheetCollateralChoice;
  calculation: string;
  reveal: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: BalanceSheetCollateralAssertion[];
  staticTwin: {
    id: `K${number}`;
    title: string;
    prompt: string;
    choices: { id: BalanceSheetCollateralChoice; label: string }[];
    correct: BalanceSheetCollateralChoice;
    calculations: string[];
    answer: string;
    formulaUnits?: string;
    sourceIds: number[];
    numericAssertions: BalanceSheetCollateralAssertion[];
  };
};

export const balanceSheetCollateralModes: { id: BalanceSheetCollateralMode; label: string; title: string; description: string }[] = [
  { id: 'measurement-capacity', label: '测量容量', title: '从净值、可质押价值到绑定约束', description: '严格区分价值口径、法律权利、偿债能力与同单位容量。' },
  { id: 'dynamics-identification', label: '动态识别', title: '从融资楔子、真实支出到因果边界', description: '分开EFP、债务悬置、反馈、替代、识别与数据聚合。' },
];

const snapshot = balanceSheetSnapshotMetrics({
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', observationTime: 'SYN-t0',
  assets: [
    { lineId: 'property', label: '地产', amount: 400, measurementBasis: 'market-value' },
    { lineId: 'other', label: '其他资产', amount: 600, measurementBasis: 'synthetic-assumption' },
  ],
  liabilities: [{ lineId: 'liabilities', label: '负债', amount: 700, measurementBasis: 'face-value' }],
});
const shockedSnapshot = balanceSheetSnapshotMetrics({
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', observationTime: 'SYN-t1',
  assets: [
    { lineId: 'property', label: '地产', amount: 360, measurementBasis: 'market-value' },
    { lineId: 'other', label: '其他资产', amount: 600, measurementBasis: 'synthetic-assumption' },
  ],
  liabilities: [{ lineId: 'liabilities', label: '负债', amount: 700, measurementBasis: 'face-value' }],
});

const collateralPool = pledgeableCollateralMetrics({
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', decisionTime: 'SYN-t', currentFacilityDrawn: 45,
  assets: [
    { collateralId: 'receivables', label: '应收账款', marketValue: 120, ownershipShareRatio: 1, valuationHaircutRatio: 0.2, liquidityHaircutRatio: 0, fxRiskReserveRatio: 0, advanceRateRatio: 0.75, concentrationCap: 60, priorSeniorClaims: 20, enforcementCost: 0, eligible: true, transferable: true, perfected: true, enforceable: true },
    { collateralId: 'equipment', label: '设备', marketValue: 80, ownershipShareRatio: 1, valuationHaircutRatio: 0, liquidityHaircutRatio: 0, fxRiskReserveRatio: 0, advanceRateRatio: 0.5, concentrationCap: null, priorSeniorClaims: 18, enforcementCost: 0, eligible: true, transferable: true, perfected: true, enforceable: true },
  ],
});

const constraintPassport = {
  currency: 'SYN', amountUnit: 'SYN-currency', decisionTime: 'SYN-t',
  borrowerLegalEntityId: 'SYN_BORROWER_1', facilityId: 'SYN_FACILITY_1',
  principalConcept: 'incremental-drawn-principal', horizon: '24m',
} as const;
const envelope = borrowingCapacityEnvelope([
  { constraintId: 'asset-based', applicable: true, signedIncrementalPrincipalHeadroom: 17, ...constraintPassport },
  { constraintId: 'earnings-based', applicable: true, signedIncrementalPrincipalHeadroom: 30, ...constraintPassport },
  { constraintId: 'contractual', applicable: true, signedIncrementalPrincipalHeadroom: 12, ...constraintPassport },
  { constraintId: 'lender-offer', applicable: true, signedIncrementalPrincipalHeadroom: 18, ...constraintPassport },
]);

const overhang = debtOverhangMetrics({ synthetic: true, amountUnit: 'SYN-currency', projectCost: 20, expectedPresentValueOfProjectPayoff: 28, legacyCreditorCaptureShareRatio: 0.4 });
const accelerator = financialAcceleratorMetrics({ synthetic: true, amountUnit: 'SYN-currency', initialBorrowerNetWorthShock: -10, localFeedbackGain: 0.5, rounds: 4 });
const did = collateralIdentificationMetrics({
  synthetic: true, outcomeUnit: 'SYN-real-outcome-index', treatedPre: 100, treatedPost: 70, controlPre: 100, controlPost: 90,
  gates: { plausiblyExogenousCollateralShock: true, preExistingExposureMeasured: true, localDemandOrProductivityConfoundingAddressed: false, preTrendsSupported: true, commonSupportEstablished: true, treatmentSelectionAndAttritionAddressed: true, interferenceOrSpilloversAddressed: true },
});

export const balanceSheetCollateralScenarios: BalanceSheetCollateralScenario[] = [
  {
    id: 'M1', mode: 'measurement-capacity', label: 'Net Worth Bridge', synthetic: true,
    title: '总资产1000、负债700，其中地产400跌10%；在其他项目冻结时，净值如何变化？',
    brief: '先做金额恒等式，再比较资产与净值的百分比变化；不要让负债随资产价格机械同比下降。',
    facts: [
      { label: '冲击前', value: 'A=1000，L=700', note: '同一法律实体、同币种、同估值时点。' },
      { label: '地产', value: '400 × (−10%)', note: '市场价值损失40；其他资产冻结。' },
      { label: '负债', value: '700不变', note: '没有偿还、减记或重组事件。' },
    ],
    formulas: ['Net worth = assets − liabilities', 'ΔN = ΔA − ΔL'], formulaUnits: '金额均为SYN；百分比的分母必须明确是总资产、地产还是净值。',
    options: [
      { id: 'a', label: '净值300→260，下降40或13.33%；总资产只下降4%。', diagnosis: '正确：金额损失一比一进入净值，但百分比以更小的净值为分母。' },
      { id: 'b', label: '净值300→270，因为负债也应随地产下跌10%。', diagnosis: '负债不会仅因抵押资产市场价格下跌就机械同比减少；你混入了并不存在的债务减记。' },
      { id: 'c', label: '净值下降10%，因为地产下降10%。', diagnosis: '你把单项资产收益率直接当成股东净值收益率，忽略资产组合权重和固定负债。' },
    ], correct: 'a',
    calculation: 'N₀=1000−700=300；地产损失=400×10%=40；A₁=960；N₁=960−700=260；ΔN/N₀=−40/300=−13.33%。',
    reveal: '杠杆首先放大的是净值百分比脆弱性；这一步仍只是重估会计桥，尚未证明融资条件会改变。',
    primarySectionId: 'net-worth-identity', remediationSectionIds: ['valuation-bases', 'net-worth-versus-liquidity'], sourceIds: [1, 2, 27, 37],
    numericAssertions: [
      { key: 'opening-net-worth', expected: 300, unit: 'SYN' }, { key: 'closing-net-worth', expected: 260, unit: 'SYN' }, { key: 'net-worth-change-pct', expected: -13.3333333333, unit: 'percent', tolerance: 1e-6 },
    ],
    staticTwin: {
      id: 'K1', title: '净值对负债变化的非对称桥', prompt: '资产500中设备200跌15%，同时用现有现金实际偿还负债10；原负债350。净值从多少变到多少？',
      choices: [{ id: 'a', label: '150→130' }, { id: 'b', label: '150→120' }, { id: 'c', label: '150→140' }], correct: 'b',
      calculations: ['期初净值=500−350=150。', '设备损失=200×15%=30；若用现有现金偿债10，资产=500−30−10=460。', '偿还后负债=350−10=340；期末净值=460−340=120。'],
      answer: 'B。用现有现金正常偿还本金时，资产与负债同时减少10，偿债本身不改变净值；只有30的设备损失使净值由150降至120。', sourceIds: [27, 37], numericAssertions: [{ key: 'closing-net-worth', expected: 120, unit: 'SYN' }],
    },
  },
  {
    id: 'M2', mode: 'measurement-capacity', label: 'Pledgeability', synthetic: true,
    title: '应收与设备都通过权利门后，可质押借款基础与新增headroom是多少？',
    brief: '先逐项做折扣和advance rate，再扣各自更优先债权，最后汇总并减本设施已提款；每个扣减只出现一次。',
    facts: [
      { label: '应收', value: '120；20%折扣；75% advance；concentration cap 60；先顺位20', note: '先取advance后价值与cap的较小者，再扣先顺位；本题不另设执行成本。' },
      { label: '设备', value: '80；50% advance；先顺位18', note: '无额外折扣。' },
      { label: '已提款', value: '45', note: '同一设施、同币种与决策时点。' },
    ],
    formulas: ['contribution = max{0, min[advance × value after haircuts, concentration cap] − prior senior claims − enforcement costs}', 'incremental headroom = Σcontributions − current draw；无cap时按+∞处理'], formulaUnits: '金额均为SYN；advance和折扣使用0–1比例。',
    options: [
      { id: 'a', label: '池为62，新增headroom为17。', diagnosis: '正确：应收先受60的concentration cap，再扣20得40；设备贡献22，合计62。' },
      { id: 'b', label: '池为74，新增headroom为29。', diagnosis: '你漏掉了应收账款60的concentration cap，所以把72直接减20得到52。' },
      { id: 'c', label: '把两个资产市值直接相加200，再减45，得到155。', diagnosis: '市值不是借款基础；你跳过了权利门、折扣、advance rate和优先债权。' },
    ], correct: 'a',
    calculation: '应收：min[120×(1−20%)×75%, 60]−20=min(72,60)−20=40；设备：80×50%−18=22；借款基础=62；新增headroom=62−45=17。',
    reveal: '最重要的不是记住17，而是保证折扣、advance rate、concentration cap、先顺位和已提款按合同顺序各自只出现一次。',
    primarySectionId: 'borrowing-base', remediationSectionIds: ['collateral-value-ladder', 'liens-and-priority'], sourceIds: [7, 8, 12, 13, 32, 33],
    numericAssertions: [{ key: 'borrowing-base', expected: 62, unit: 'SYN' }, { key: 'incremental-headroom', expected: 17, unit: 'SYN' }],
    staticTwin: {
      id: 'K2', title: '未完成权利门的高市值资产', prompt: '一项市值300的资产未完成本合成合同要求的担保权对抗要件，另一项市值100的合格资产经20%折扣、60% advance、先顺位8。已提款30，新增headroom？',
      choices: [{ id: 'a', label: '10' }, { id: 'b', label: '310' }, { id: 'c', label: '18' }], correct: 'a',
      calculations: ['未完成权利门的资产贡献按本合成合同为0。', '合格资产贡献=100×80%×60%−8=40。', '新增headroom=40−30=10。'],
      answer: 'A。高市值不等于本实体在该法域、该顺位和该时点可向该设施提供可执行担保。', sourceIds: [7, 8, 32], numericAssertions: [{ key: 'incremental-headroom', expected: 10, unit: 'SYN' }],
    },
  },
  {
    id: 'M3', mode: 'measurement-capacity', label: 'DSCR Capacity', synthetic: true,
    title: '合格年现金流24、最低DSCR 1.5、现有年偿债12；新增年偿债余量是多少？',
    brief: 'DSCR先把流量映射到每年可承担的债务服务，再用明确利率和摊还期限换成新增本金；不能直接把EBITDA当本金。',
    facts: [
      { label: '合格现金流', value: '24 SYN/年', note: '已扣本题冻结的税、维持性资本开支和优先现金承诺。' },
      { label: '最低DSCR', value: '1.50×', note: '合同阈值，不是监管统一常数。' },
      { label: '现有年偿债', value: '12 SYN/年', note: '含本题定义的利息与本金支付。' },
    ],
    formulas: ['max annual debt service = qualifying cash flow / minimum DSCR', 'signed headroom = max annual debt service − current annual debt service'], formulaUnits: '第一步输出SYN/年；换本金还需要利率、频率和剩余期限。',
    options: [
      { id: 'a', label: '最大年偿债16，新增年偿债余量4。', diagnosis: '正确：24/1.5=16，再减现有12。' },
      { id: 'b', label: '新增本金12，因为24−12=12。', diagnosis: '你漏除了DSCR阈值，还把年度现金流和本金存量混成同一单位。' },
      { id: 'c', label: '新增年偿债36，因为24×1.5。', diagnosis: '最低覆盖率在分母；覆盖要求越高，可承担偿债额越低。' },
    ], correct: 'a', calculation: 'max debt service=24/1.5=16 SYN/年；signed headroom=16−12=4 SYN/年。没有边际利率和摊还期时，停止在流量headroom。',
    reveal: '收益型约束与资产型约束可以同时存在；只有先把二者转换为同一新增本金单位，才可以比较谁绑定。',
    primarySectionId: 'dscr-capacity', remediationSectionIds: ['earnings-based-constraints', 'capacity-normalisation'], sourceIds: [9, 10, 20, 25],
    numericAssertions: [{ key: 'max-annual-debt-service', expected: 16, unit: 'SYN-per-year' }, { key: 'annual-debt-service-headroom', expected: 4, unit: 'SYN-per-year' }],
    staticTwin: {
      id: 'K3', title: '负的偿债余量必须保留', prompt: '合格现金流18、最低DSCR 1.5、现有年偿债14。signed headroom与可新增偿债额分别是多少？',
      choices: [{ id: 'a', label: '−2与0' }, { id: 'b', label: '0与0' }, { id: 'c', label: '+2与2' }], correct: 'a',
      calculations: ['最大年偿债=18/1.5=12。', 'signed headroom=12−14=−2。', '只有最终“可新增”输出截为0；−2保留为越界深度。'],
      answer: 'A。过早截零会丢失契约违反程度与修复距离。', sourceIds: [20, 25], numericAssertions: [{ key: 'signed-headroom', expected: -2, unit: 'SYN-per-year' }, { key: 'lendable', expected: 0, unit: 'SYN-per-year' }],
    },
  },
  {
    id: 'M4', mode: 'measurement-capacity', label: 'Binding Stack', synthetic: true,
    title: '资产17、收益30、契约12、贷款人要约18均为同一新增本金headroom；最终容量是多少？',
    brief: '多个必要条件构成串联门：先验证可比，再取最小；放松一个非绑定约束不会改变结果。',
    facts: [
      { label: '四项headroom', value: '17 / 30 / 12 / 18', note: '同实体、同币种、同决策时点、同新增本金单位。' },
      { label: '方向', value: '越大越宽松', note: '有符号值允许小于零。' },
      { label: '绑定', value: '允许并列', note: '并列最小时保留全部约束ID。' },
    ],
    formulas: ['capacity = max(0, min(applicable comparable signed headrooms))'], formulaUnits: '所有输入都已经是SYN新增本金；若时点或单位不同则STOP。',
    options: [
      { id: 'a', label: '77，因为四项容量相加。', diagnosis: '这些不是四笔资金来源，而是同一新增贷款必须同时满足的上限。' },
      { id: 'b', label: '12，contractual绑定；把资产17提高到40仍是12。', diagnosis: '正确：最紧上限决定结果，非绑定约束的局部放松没有边际效果。' },
      { id: 'c', label: '30，因为收益型约束最能反映经营质量。', diagnosis: '经济解释不能覆盖合同算术；适用约束都必须同时满足。' },
    ], correct: 'b', calculation: 'min(17,30,12,18)=12；max(0,12)=12；binding={contractual}。把17改40后，min(40,30,12,18)仍为12。',
    reveal: '“抵押品上升但贷款不增”不必否定抵押机制：可能只是收益、契约或贷款人要约当前绑定。',
    primarySectionId: 'binding-constraint-stack', remediationSectionIds: ['ltv-and-coverage', 'capacity-normalisation'], sourceIds: [9, 10, 20, 25],
    numericAssertions: [{ key: 'capacity', expected: 12, unit: 'SYN' }, { key: 'binding', expected: 'contractual', unit: 'id' }],
    staticTwin: {
      id: 'K4', title: '并列绑定约束', prompt: '资产8、收益8、契约20、贷款人要约15，统一后最终容量和绑定集合？',
      choices: [{ id: 'a', label: '8，资产与收益共同绑定' }, { id: 'b', label: '8，只保留资产' }, { id: 'c', label: '51，无绑定' }], correct: 'a',
      calculations: ['最小值为8。', '资产与收益都恰等于最小值。', '容量8，绑定集合保留两个ID。'], answer: 'A。只保留一个最小ID会制造任意排序并丢失联合约束。',
      sourceIds: [9, 10], numericAssertions: [{ key: 'capacity', expected: 8, unit: 'SYN' }, { key: 'binding-count', expected: 2, unit: 'count' }],
    },
  },
  {
    id: 'M5', mode: 'measurement-capacity', label: 'Value Passport', synthetic: true,
    title: '哪组字段足以判断“账面资产500”能否支持今天的一笔新增贷款？',
    brief: '这是一道停止规则题。账面总额没有说明法律所有权、可转让性、估值层级、优先级、币种或测试时点。',
    facts: [
      { label: '唯一已知', value: 'book assets = 500', note: '集团合并报表，报告期末在三个月前。' },
      { label: '目标', value: '子公司今天申请新增贷款', note: '贷款币种与资产所在地尚未给出。' },
      { label: '未知', value: 'owner / liens / valuation / law', note: '不得由字段名猜测。' },
    ],
    formulas: ['book total assets ≠ pledgeable value ≠ recovery value'], formulaUnits: '缺失的实体、币种、时点、权利和价值口径不能用0或合并总额代填。',
    options: [
      { id: 'a', label: '直接把500乘统一LTV即可。', diagnosis: '你把集团账面总资产当成子公司可执行抵押池，并假定了不存在的统一LTV。' },
      { id: 'b', label: '先STOP；补法律所有人、资产ID/地点、市场/评估价值、顺位、担保权状态、币种、合同日与版本。', diagnosis: '正确：先建立权利—价值—时钟护照，再计算借款基础。' },
      { id: 'c', label: '用500减全部集团负债即可。', diagnosis: '净值与可质押价值不是同一对象，集团负债也未必是申请子公司的义务。' },
    ], correct: 'b', calculation: '当前没有合法数值结果：输入护照缺少法律实体、资产所有权、价值层级、优先债权、担保权对抗状态、币种与决策时点，因此应返回STOP/null。',
    reveal: '专业性常体现在知道何时不能算。补齐元数据不是行政附注，而是机制成立的组成部分。',
    primarySectionId: 'scope-passport', remediationSectionIds: ['asset-ownership', 'valuation-bases', 'legal-enforceability'], sourceIds: [7, 8, 27, 31, 32],
    numericAssertions: [{ key: 'decision', expected: 'STOP', unit: 'status' }],
    staticTwin: {
      id: 'K5', title: '评估日与决策日错位', prompt: '抵押品评估来自18个月前，资产市场此后剧烈变化且合同要求评估不超过12个月。能否静默沿用？',
      choices: [{ id: 'a', label: '不能；标记stale并STOP或按合同取得更新评估' }, { id: 'b', label: '能；历史评估是唯一客观值' }, { id: 'c', label: '能；直接换成当前指数即可且无需披露' }], correct: 'a',
      calculations: ['比较appraisalAt与decisionAt。', '18个月超过合同12个月上限。', '标记stale；若用指数更新，必须另存方法、版本与不确定性。'], answer: 'A。旧值不是自动错误，但在给定合同下不能作为当前合格输入。',
      sourceIds: [27, 30, 32], numericAssertions: [{ key: 'staleness-months', expected: 18, unit: 'months' }, { key: 'status', expected: 'STOP', unit: 'status' }],
    },
  },
  {
    id: 'M6', mode: 'dynamics-identification', label: 'Spread / EFP', synthetic: true,
    title: '全含外部成本6.5%、匹配基准4%、内部资金机会成本4.4%；spread与EFP分别是多少？',
    brief: '两者都像“融资楔子”，但反事实分母不同。先命名对象，再做减法。',
    facts: [
      { label: '全含外部成本', value: '6.5%/年', note: '合同率和本题费用等价合计。' },
      { label: '市场基准', value: '4.0%/年', note: '用于可观察合同spread。' },
      { label: '内部机会成本', value: '4.4%/年', note: '用于理论EFP反事实。' },
    ],
    formulas: ['all-in spread = external cost − matched benchmark', 'EFP = external cost − opportunity cost of internal funds'], formulaUnits: '利率为年化百分点；结果可写pp或乘100写bp。',
    options: [
      { id: 'a', label: 'spread=2.5pp，EFP=2.1pp；不可同名。', diagnosis: '正确：市场基准与内部资金机会成本是不同反事实。' },
      { id: 'b', label: '二者都是2.5pp，因为内部资金免费。', diagnosis: '内部资金有机会成本；“无需付合同利息”不等于经济成本为零。' },
      { id: 'c', label: 'EFP就是贷款利率6.5%。', diagnosis: '溢价必须是相对某个反事实的差值，不是外部成本本身。' },
    ], correct: 'a', calculation: 'spread=6.5−4.0=2.5pp=250bp；EFP=6.5−4.4=2.1pp=210bp。',
    reveal: '观察到spread扩大可以提示融资条件变化，却不能不经模型就分解为代理成本或净值效应。',
    primarySectionId: 'external-finance-premium', remediationSectionIds: ['internal-external-finance', 'observable-versus-latent'], sourceIds: [1, 2, 4, 15, 16],
    numericAssertions: [{ key: 'spread', expected: 2.5, unit: 'pct-points-per-year' }, { key: 'efp', expected: 2.1, unit: 'pct-points-per-year' }],
    staticTwin: {
      id: 'K6', title: '数字相同仍不是同一概念', prompt: '外部成本7%、市场基准4%、内部机会成本4%。两个差值都为3pp。可以写“spread=EFP所以二者定义相同”吗？',
      choices: [{ id: 'a', label: '不可以；只是两个反事实当前数值巧合相等' }, { id: 'b', label: '可以；只要数字相同概念就相同' }, { id: 'c', label: '可以；内部资金永远等于无风险基准' }], correct: 'a',
      calculations: ['spread=7−4=3pp。', 'EFP=7−4=3pp。', '输入基准来源与经济反事实仍不同；换一个状态就可能分离。'], answer: 'A。数值相等不构成概念恒等。',
      sourceIds: [1, 2, 4], numericAssertions: [{ key: 'spread', expected: 3, unit: 'pct-points' }, { key: 'efp', expected: 3, unit: 'pct-points' }],
    },
  },
  {
    id: 'M7', mode: 'dynamics-identification', label: 'Debt Overhang', synthetic: true,
    title: '成本20、回报现值28，旧债吸收40%的项目回报；为什么正NPV项目仍可能不投？',
    brief: '分别从企业全部索取权人与当前股东视角计算，不要把容量约束和激励问题混为一谈。',
    facts: [
      { label: '项目整体', value: 'cost=20，PV=28', note: '整体NPV为+8。' },
      { label: '旧债捕获', value: '40% × 28', note: '本题用固定份额抽象旧债回收改善。' },
      { label: '股东出资', value: '20', note: '不考虑新融资工具重构。' },
    ],
    formulas: ['total NPV = payoff PV − cost', 'equity private NPV = payoff PV × (1−legacy capture share) − cost'], formulaUnits: '金额为SYN；捕获份额是0–1比例。',
    options: [
      { id: 'a', label: '一定投资，因为+8的整体NPV已足够。', diagnosis: '你忽略了项目价值在旧债权人与股东之间的分配。' },
      { id: 'b', label: '可能拒绝：股东私有NPV=−3.2，即使整体NPV=+8。', diagnosis: '正确：债务悬置来自索取权分配，而不是项目缺乏社会价值。' },
      { id: 'c', label: '拒绝仅能说明抵押品价值为零。', diagnosis: '容量不足与债务悬置是不同机制；本题没有给出抵押容量。' },
    ], correct: 'b', calculation: '整体NPV=28−20=8；旧债吸收=28×40%=11.2；股东所得=16.8；股东私有NPV=16.8−20=−3.2。',
    reveal: '资本结构能让“企业值得做”和“当前股东愿意做”分离；重组可能改变分配，但不是免费消除损失。',
    primarySectionId: 'debt-overhang', remediationSectionIds: ['financing-versus-investment', 'distress-and-restructuring'], sourceIds: [17, 18],
    numericAssertions: [{ key: 'total-npv', expected: 8, unit: 'SYN' }, { key: 'equity-private-npv', expected: -3.2, unit: 'SYN' }],
    staticTwin: {
      id: 'K7', title: '没有债务悬置的正NPV项目', prompt: '成本30、回报现值42，旧债捕获20%。股东私有NPV与决策？',
      choices: [{ id: 'a', label: '+3.6，股东有投资激励' }, { id: 'b', label: '−3.6，拒绝' }, { id: 'c', label: '+12，捕获份额无关' }], correct: 'a',
      calculations: ['整体NPV=42−30=12。', '股东所得=42×80%=33.6。', '股东私有NPV=33.6−30=+3.6。'], answer: 'A。存在旧债价值改善不必然阻断项目；关键是股东私有NPV的符号。',
      sourceIds: [17, 18], numericAssertions: [{ key: 'equity-private-npv', expected: 3.6, unit: 'SYN', tolerance: 1e-8 }],
    },
  },
  {
    id: 'M8', mode: 'dynamics-identification', label: 'Feedback', synthetic: true,
    title: '初始净值冲击−10、局部反馈增益0.5；四轮累计和稳定无限和分别是多少？',
    brief: '区分初始冲击与内生反馈。每一轮只是上一轮乘局部增益，不是再施加一次−10。',
    facts: [
      { label: '初始冲击', value: '−10 SYN', note: '由上游事件给定。' },
      { label: '反馈增益', value: 'g=0.5', note: '压缩多条经济箭头的局部教学参数。' },
      { label: '轮数', value: '4', note: '含第0轮。' },
    ],
    formulas: ['round k = initial shock × g^k', 'stable infinite sum = initial shock / (1−g), only if 0≤g<1'], formulaUnits: '各轮与累计为SYN；g为无量纲局部增益。',
    options: [
      { id: 'a', label: '四轮−40，因为每轮都重复−10。', diagnosis: '反馈轮不是独立重放初始冲击；每轮应乘g。' },
      { id: 'b', label: '四轮累计−18.75；稳定无限和−20。', diagnosis: '正确：−10−5−2.5−1.25=−18.75，几何和为−20。' },
      { id: 'c', label: '只报告−10，因为反馈不属于冲击。', diagnosis: '初始冲击与反馈应分开命名，但完整动态结果必须包含内生传播。' },
    ], correct: 'b', calculation: 'rounds={−10,−5,−2.5,−1.25}；四轮累计−18.75；因g=0.5<1，稳定无限和=−10/(1−0.5)=−20。',
    reveal: '金融加速器解释冲击为何被放大与持久化；它不会告诉你最初冲击是什么，也不会自动生成因果识别。',
    primarySectionId: 'financial-accelerator-loop', remediationSectionIds: ['shock-versus-amplification', 'state-dependence'], sourceIds: [1, 2, 3, 4, 29],
    numericAssertions: [{ key: 'four-round-sum', expected: -18.75, unit: 'SYN' }, { key: 'stable-infinite-sum', expected: -20, unit: 'SYN' }],
    staticTwin: {
      id: 'K8', title: '单位根反馈不能套稳定乘数', prompt: '初始冲击−4，g=1，三轮累计与稳定无限和？',
      choices: [{ id: 'a', label: '三轮−12；稳定无限和不存在' }, { id: 'b', label: '三轮−4；无限和−4' }, { id: 'c', label: '三轮−8；无限和−∞可当精确预测' }], correct: 'a',
      calculations: ['三轮都是−4。', '有限累计=−12。', 'g=1不满足局部稳定条件，因此不报告有限的稳定无限和。'], answer: 'A。此时必须引入非线性、约束或政策反应，不能把发散几何式当现实预测。',
      sourceIds: [2, 3], numericAssertions: [{ key: 'finite-sum', expected: -12, unit: 'SYN' }, { key: 'infinite-sum', expected: 'null', unit: 'status' }],
    },
  },
  {
    id: 'M9', mode: 'dynamics-identification', label: 'Substitution', synthetic: true,
    title: '担保贷款80→50，但其他融资上升；总外部融资和最终资源缺口是多少？',
    brief: '贷款对或单一工具的变化必须先聚合到借款人总外部融资，再把内部现金使用单独列示。',
    facts: [
      { label: '担保贷款', value: '80→50', note: '下降30。' },
      { label: '其他外部融资', value: '无担保40→50；债券20→25；贸易信用10→13', note: '合计上升18。' },
      { label: '内部现金', value: '使用5', note: '资源缓冲，不是外部融资。' },
    ],
    formulas: ['total external = secured + unsecured + bonds + trade credit', 'post-cash resource change = Δexternal finance + cash used；remaining shortfall = max(0, −post-cash resource change)'], formulaUnits: '所有金额必须使用同一窗口、币种与本金/余额口径。',
    options: [
      { id: 'a', label: '总外部融资150→138，减少12；用现金5后资源缺口7。', diagnosis: '正确：其他融资替代18，使原30的担保贷款缺口只剩12，现金再缓冲5。' },
      { id: 'b', label: '资源缺口30，因为只看担保贷款。', diagnosis: '你把单一工具变化直接当成借款人总融资变化，忽略替代。' },
      { id: 'c', label: '总外部融资增加18，因为只加替代来源。', diagnosis: '替代融资的增量必须与原工具下降一起聚合。' },
    ], correct: 'a', calculation: '期初=80+40+20+10=150；期末=50+50+25+13=138；Δexternal=−12；使用内部现金5后仍缺7。',
    reveal: '融资替代决定一条局部抵押品冲击能否真正进入投资、就业或消费；内部现金会缓冲当期，却可能降低未来保险能力。',
    primarySectionId: 'financing-substitution', remediationSectionIds: ['total-external-finance', 'cash-buffer'], sourceIds: [23, 24, 35, 36, 38],
    numericAssertions: [{ key: 'opening-external', expected: 150, unit: 'SYN' }, { key: 'closing-external', expected: 138, unit: 'SYN' }, { key: 'resource-gap', expected: 7, unit: 'SYN' }],
    staticTwin: {
      id: 'K9', title: '完全替代仍可能改变条款', prompt: '原银行贷款下降20，另一银行贷款增加15，债券增加5；总外部融资如何变化？能否断言没有真实效应？',
      choices: [{ id: 'a', label: '总额不变，但成本、期限、担保与时滞仍需检查' }, { id: 'b', label: '总额下降20，必然削减投资' }, { id: 'c', label: '总额增加20，必然扩张投资' }], correct: 'a',
      calculations: ['替代增加=15+5=20。', '原融资减少20，所以总额变化0。', '金额完全替代不保证价格、期限、货币或到账时点完全替代。'], answer: 'A。总金额是必要聚合层，却不是完整合同等价。',
      sourceIds: [4, 35, 36], numericAssertions: [{ key: 'total-external-change', expected: 0, unit: 'SYN' }],
    },
  },
  {
    id: 'M10', mode: 'dynamics-identification', label: 'Identification', synthetic: true,
    title: '所有者结果100→70、同地租户100→90，DiD为多少；缺一项地方需求控制时应贴什么标签？',
    brief: '算术估计量与因果身份分开：闸门失败不会改变点估计，却会阻止解释升级。',
    facts: [
      { label: '处理组', value: 'owner 100→70', note: '要求资产所有权在冲击前测量。' },
      { label: '对照组', value: 'renter 100→90', note: '同地区只吸收部分共同冲击。' },
      { label: '失败闸门', value: '地方需求/生产率未处理', note: '其余门在本题暂按通过。' },
    ],
    formulas: ['DiD = (treated post−pre) − (control post−pre)', 'causal label requires all declared design gates'], formulaUnits: '结果为SYN指数点；识别标签不是数值单位。',
    options: [
      { id: 'a', label: 'DiD=−20，但标签保持DESCRIPTIVE。', diagnosis: '正确：−30−(−10)=−20；地方需求混淆未闭合，不能贴因果标签。' },
      { id: 'b', label: 'DiD=−20，因此自动识别为抵押品因果效应。', diagnosis: '可计算的差分不等于可辩护的反事实；你跳过了失败闸门。' },
      { id: 'c', label: 'DiD=−40，因为两个跌幅相加。', diagnosis: 'DiD是变化之差，不是绝对跌幅之和。' },
    ], correct: 'a', calculation: 'owner change=70−100=−30；renter change=90−100=−10；DiD=−30−(−10)=−20。因地方需求/生产率控制失败，status=descriptive。',
    reveal: '所有者—租户对照很有启发性，但还要审查预趋势、共同支持、所有权选择、银行供给、样本退出和溢出。',
    primarySectionId: 'identification-gates', remediationSectionIds: ['local-demand-confound', 'owner-renter-control', 'support-and-selection'], sourceIds: [19, 21, 22, 23, 24, 30, 31],
    numericAssertions: [{ key: 'did', expected: -20, unit: 'SYN-index-points' }, { key: 'status', expected: 'descriptive', unit: 'status' }],
    staticTwin: {
      id: 'K10', title: '所有闸门通过后的局部标签', prompt: '处理组100→92、对照组100→98，七项设计门均有明确证据支持。DiD与允许的最强表述？',
      choices: [{ id: 'a', label: '−6；在所声明假设与共同支持样本内的identified-candidate' }, { id: 'b', label: '−6；全球、永久、结构常数' }, { id: 'c', label: '−10；不需要限定' }], correct: 'a',
      calculations: ['处理变化=−8。', '对照变化=−2。', 'DiD=−6；即便闸门全过，外推仍受样本、法域、时期与处理支持限制。'], answer: 'A。识别是有条件的局部结论，不是把估计量升级成普遍定律。',
      sourceIds: [19, 21, 22], numericAssertions: [{ key: 'did', expected: -6, unit: 'SYN-index-points' }, { key: 'status', expected: 'identified-candidate', unit: 'status' }],
    },
  },
];

function approximately(actual: number, expected: number, tolerance = 1e-8) {
  return Math.abs(actual - expected) <= tolerance;
}

const computedValues: Record<string, number | string | boolean | null | undefined> = {
  'M1.opening-net-worth': snapshot?.netWorth,
  'M1.closing-net-worth': shockedSnapshot?.netWorth,
  'M1.net-worth-change-pct': snapshot && shockedSnapshot ? (shockedSnapshot.netWorth - snapshot.netWorth) / snapshot.netWorth * 100 : null,
  'M2.borrowing-base': collateralPool?.totalBorrowingBase,
  'M2.incremental-headroom': collateralPool?.signedFacilityHeadroom,
  'M3.max-annual-debt-service': 24 / 1.5,
  'M3.annual-debt-service-headroom': 24 / 1.5 - 12,
  'M4.capacity': envelope?.lendableIncrementalPrincipal,
  'M4.binding': envelope?.bindingConstraintIds.join('|'),
  'M5.decision': 'STOP',
  'M6.spread': 6.5 - 4,
  'M6.efp': 6.5 - 4.4,
  'M7.total-npv': overhang?.totalProjectNPV,
  'M7.equity-private-npv': overhang?.equityPrivateNPV,
  'M8.four-round-sum': accelerator?.finiteRoundCumulativeEffect,
  'M8.stable-infinite-sum': accelerator?.stableInfiniteCumulativeEffect,
  'M9.opening-external': 80 + 40 + 20 + 10,
  'M9.closing-external': 50 + 50 + 25 + 13,
  'M9.resource-gap': 12 - 5,
  'M10.did': did?.descriptiveDifferenceInDifferences,
  'M10.status': did?.identificationStatus,
  'K1.closing-net-worth': 460 - 340,
  'K2.incremental-headroom': 100 * 0.8 * 0.6 - 8 - 30,
  'K3.signed-headroom': 18 / 1.5 - 14,
  'K3.lendable': Math.max(0, 18 / 1.5 - 14),
  'K4.capacity': 8,
  'K4.binding-count': 2,
  'K5.staleness-months': 18,
  'K5.status': 'STOP',
  'K6.spread': 7 - 4,
  'K6.efp': 7 - 4,
  'K7.equity-private-npv': 42 * 0.8 - 30,
  'K8.finite-sum': -12,
  'K8.infinite-sum': 'null',
  'K9.total-external-change': -20 + 15 + 5,
  'K10.did': (92 - 100) - (98 - 100),
  'K10.status': 'identified-candidate',
};

export const balanceSheetCollateralNumericAssertionAudit = balanceSheetCollateralScenarios.flatMap((scenario) => [
  ...scenario.numericAssertions.map((assertion) => ({ scenarioId: scenario.id, ...assertion })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({ scenarioId: scenario.staticTwin.id, ...assertion })),
]).map((assertion) => {
  const actual = computedValues[`${assertion.scenarioId}.${assertion.key}`];
  const passed = typeof assertion.expected === 'number'
    ? typeof actual === 'number' && approximately(actual, assertion.expected, assertion.tolerance)
    : actual === assertion.expected;
  return { ...assertion, actual, passed };
});

const allowedSectionIds = new Set([
  'net-worth-identity', 'valuation-bases', 'net-worth-versus-liquidity', 'borrowing-base', 'collateral-value-ladder', 'liens-and-priority',
  'dscr-capacity', 'earnings-based-constraints', 'capacity-normalisation', 'binding-constraint-stack', 'ltv-and-coverage',
  'scope-passport', 'asset-ownership', 'legal-enforceability', 'external-finance-premium', 'internal-external-finance', 'observable-versus-latent',
  'debt-overhang', 'financing-versus-investment', 'distress-and-restructuring', 'financial-accelerator-loop', 'shock-versus-amplification', 'state-dependence',
  'financing-substitution', 'total-external-finance', 'cash-buffer', 'identification-gates', 'local-demand-confound', 'owner-renter-control', 'support-and-selection',
]);

export const balanceSheetCollateralScenarioAssertions = [
  { key: 'exactly-ten-scenarios', passed: balanceSheetCollateralScenarios.length === 10 },
  { key: 'five-per-mode', passed: balanceSheetCollateralModes.every((mode) => balanceSheetCollateralScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { key: 'unique-scenario-ids', passed: new Set(balanceSheetCollateralScenarios.map(({ id }) => id)).size === 10 },
  { key: 'unique-static-twin-ids', passed: new Set(balanceSheetCollateralScenarios.map(({ staticTwin }) => staticTwin.id)).size === 10 },
  { key: 'three-unique-options', passed: balanceSheetCollateralScenarios.every(({ options, staticTwin }) => options.length === 3 && new Set(options.map(({ id }) => id)).size === 3 && staticTwin.choices.length === 3 && new Set(staticTwin.choices.map(({ id }) => id)).size === 3) },
  { key: 'correct-option-exists', passed: balanceSheetCollateralScenarios.every(({ options, correct, staticTwin }) => options.some(({ id }) => id === correct) && staticTwin.choices.some(({ id }) => id === staticTwin.correct)) },
  { key: 'sources-present', passed: balanceSheetCollateralScenarios.every(({ sourceIds, staticTwin }) => sourceIds.length > 0 && staticTwin.sourceIds.length > 0 && [...sourceIds, ...staticTwin.sourceIds].every((id) => Number.isSafeInteger(id) && id > 0)) },
  { key: 'remediation-links-closed', passed: balanceSheetCollateralScenarios.every(({ primarySectionId, remediationSectionIds }) => allowedSectionIds.has(primarySectionId) && remediationSectionIds.length > 0 && remediationSectionIds.every((id) => allowedSectionIds.has(id))) },
  { key: 'formulas-and-units-present', passed: balanceSheetCollateralScenarios.every(({ formulas, formulaUnits }) => formulas.length > 0 && formulaUnits.trim().length > 0) },
  { key: 'all-numeric-assertions-pass', passed: balanceSheetCollateralNumericAssertionAudit.every(({ passed }) => passed) },
  { key: 'all-synthetic', passed: balanceSheetCollateralScenarios.every(({ synthetic }) => synthetic) },
] as const;

if (!balanceSheetCollateralScenarioAssertions.every(({ passed }) => passed)) {
  throw new Error(`3.11 scenario structure gate failed: ${balanceSheetCollateralScenarioAssertions.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

if (!balanceSheetCollateralNumericAssertionAudit.every(({ passed }) => passed)) {
  throw new Error(`3.11 scenario numeric gate failed: ${balanceSheetCollateralNumericAssertionAudit.filter(({ passed }) => !passed).map(({ scenarioId, key, actual, expected }) => `${scenarioId}.${key}: ${String(actual)} != ${String(expected)}`).join('; ')}`);
}
