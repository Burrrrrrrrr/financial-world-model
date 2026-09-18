import {
  bopCanonicalInputs,
  bopEvaluators,
  bopExactToNumber,
  bopRawDomains,
} from './balanceOfPaymentsFixtures';
import type { BopDomain, BopLabId, BopResult, ExactQuantity } from './balanceOfPaymentsFixtures';

export type BopDisplay =
  | Readonly<{ status: 'STOP'; reason: string }>
  | Readonly<{ status: 'OK'; rows: readonly (readonly [string, string])[] }>;

export type BopLab = Readonly<{
  id: BopLabId;
  title: string;
  question: string;
  passport: string;
  sourceIds: readonly number[];
  initial: Readonly<Record<string, number>>;
  fields: readonly Readonly<{ key: string; label: string; min: number; max: number; step: 1 }>[];
  display: (input: unknown) => BopDisplay;
  rebuild: string;
  changeCondition: string;
  counterexample: string;
  unknownWarning: string;
}>;

export function bopNumber(value: number): string {
  if (!Number.isFinite(value)) throw Error('国际收支展示只接受有限数。');
  return (value === 0 ? '0' : String(Number(value.toPrecision(12)))).replace('-', '−');
}

function gcd(a: bigint, b: bigint): bigint {
  const zero = BigInt(0); let x = a < zero ? -a : a; let y = b < zero ? -b : b;
  while (y !== zero) { const remainder = x % y; x = y; y = remainder; }
  return x;
}
function exactText(quantity: ExactQuantity): string {
  const numerator = BigInt(quantity.numerator) * BigInt(quantity.scale);
  const denominator = BigInt(quantity.denominator);
  const divisor = gcd(numerator, denominator);
  const reducedNumerator = numerator / divisor; const reducedDenominator = denominator / divisor;
  const fraction = reducedDenominator === BigInt(1) ? reducedNumerator.toString() : `${reducedNumerator}/${reducedDenominator}`;
  return reducedDenominator === BigInt(1) ? fraction.replace('-', '−') : `${fraction.replace('-', '−')} ≈ ${bopNumber(bopExactToNumber(quantity))}`;
}
function valueText(result: Extract<BopResult, { status: 'OK' }>, key: string): string {
  const value = result.value[key];
  if (value === null) return 'unknown／未观测或未识别（不是0）';
  if (result.exact[key]) return exactText(result.exact[key]);
  if (typeof value === 'number') return bopNumber(value);
  if (typeof value === 'boolean') return value ? '是（只在题设内）' : '否（只在题设内）';
  if (typeof value === 'string') return value;
  throw Error(`未声明展示规则：${key}`);
}

const fieldLabels: Record<BopLabId, Readonly<Record<string, string>>> = {
  C1: {
    goodsExportCredit: '货物出口 credit/revenue（SYN金额）',
    foreignDepositAcquisition: '取得境外存款资产（SYN金额）',
    tradeCreditAcquisition: '取得对非居民贸易信贷资产（SYN金额）',
  },
  C2: {
    goodsRevenue: '货物 revenue（SYN金额）', goodsExpenditure: '货物 expenditure（SYN金额）',
    servicesRevenue: '服务 revenue（SYN金额）', servicesExpenditure: '服务 expenditure（SYN金额）',
    earnedIncomeRevenue: 'earned income revenue（SYN金额）', earnedIncomeExpenditure: 'earned income expenditure（SYN金额）',
    transferIncomeRevenue: 'transfer income revenue（SYN金额）', transferIncomeExpenditure: 'transfer income expenditure（SYN金额）',
    capitalRevenue: '资本账户 revenue（SYN金额）', capitalExpenditure: '资本账户 expenditure（SYN金额）',
    netAssetAcquisition: '金融账户净取得资产（SYN金额）', netLiabilityIncurrence: '金融账户净发生负债（SYN金额）',
  },
  C3: {
    assetAcquisitions: '期间资产取得总额（SYN金额）', assetDisposals: '期间资产处置总额（SYN金额）',
    liabilityIncurrences: '期间负债发生总额（SYN金额）', liabilityRepayments: '期间负债偿还总额（SYN金额）',
  },
  C4: {
    openingReserveAssets: '期初储备资产头寸（SYN金额）', reserveTransactions: '储备资产交易净变化（SYN金额）',
    exchangeRateRevaluation: '汇率重估变化（SYN金额）', otherPriceRevaluation: '其他价格重估变化（SYN金额）',
    otherVolumeChange: '其他数量变化（SYN金额）',
  },
  C5: {
    openingAssets: '期初外部资产（SYN金额）', openingLiabilities: '期初外部负债（SYN金额）',
    assetTransactions: '资产交易净变化（SYN金额）', liabilityTransactions: '负债交易净变化（SYN金额）',
    assetExchangeRateChange: '资产汇率重估（SYN金额）', liabilityExchangeRateChange: '负债汇率重估（SYN金额）',
    assetOtherPriceChange: '资产其他价格重估（SYN金额）', liabilityOtherPriceChange: '负债其他价格重估（SYN金额）',
    assetOtherVolumeChange: '资产其他数量变化（SYN金额）', liabilityOtherVolumeChange: '负债其他数量变化（SYN金额）',
  },
  C6: {
    privateSaving: '私人部门总储蓄（SYN金额）', privateInvestment: '私人部门总资本形成（SYN金额）',
    governmentSaving: '政府部门总储蓄（SYN金额）', governmentInvestment: '政府部门总资本形成（SYN金额）',
  },
  C7: {
    economyAAssets: '经济体A外部资产（SYN金额）', economyALiabilities: '经济体A外部负债（SYN金额）',
    economyAReserveAssets: '经济体A储备资产（SYN金额）', economyAShortTermFxDebt: '经济体A短期外币债务（SYN金额）',
    economyBAssets: '经济体B外部资产（SYN金额）', economyBLiabilities: '经济体B外部负债（SYN金额）',
    economyBReserveAssets: '经济体B储备资产（SYN金额）', economyBShortTermFxDebt: '经济体B短期外币债务（SYN金额）',
  },
};

const rowKeys: Record<BopLabId, readonly (readonly [string, string])[]> = {
  C1: [['金融对项 debits 合计', 'counterpartDebits'], ['单笔复式缺口', 'entryGap'], ['单笔是否闭合', 'transactionBalanced'], ['是否要求实体现金跨境', 'physicalCashCrossingBorderRequired']],
  C2: [['经常账户 revenue 合计', 'currentRevenues'], ['经常账户 expenditure 合计', 'currentExpenditures'], ['CAB', 'currentAccountBalance'], ['KAB', 'capitalAccountBalance'], ['FAB = 资产净取得−负债净发生', 'financialAccountBalance'], ['CAB+KAB', 'currentPlusCapital'], ['统计差异 FAB−(CAB+KAB)', 'statisticalDiscrepancy'], ['因果驱动是否识别', 'causalDriverIdentified']],
  C3: [['资产净取得', 'netAssetAcquisition'], ['负债净发生', 'netLiabilityIncurrence'], ['FAB', 'financialAccountBalance'], ['四类毛交易周转合计', 'grossTurnover'], ['融资稳定性', 'fundingStability'], ['滚续风险', 'rolloverRisk']],
  C4: [['交易变化', 'reserveTransactions'], ['重估合计', 'revaluation'], ['非交易变化合计', 'nontransactionChange'], ['期末储备资产', 'closingReserveAssets'], ['干预金额', 'interventionAmount'], ['储备充足性', 'reserveAdequacy']],
  C5: [['期末外部资产', 'closingAssets'], ['期末外部负债', 'closingLiabilities'], ['期初NIIP', 'openingNetIip'], ['期末NIIP', 'closingNetIip'], ['金融账户余额', 'financialAccountBalance'], ['净汇率重估', 'netExchangeRateChange'], ['净其他价格重估', 'netOtherPriceChange'], ['净其他数量变化', 'netOtherVolumeChange'], ['NIIP实际变化', 'actualNetIipChange'], ['桥接残差', 'bridgeGap']],
  C6: [['私人储蓄−投资', 'privateGap'], ['政府储蓄−投资', 'governmentGap'], ['国民储蓄', 'nationalSaving'], ['国民投资', 'nationalInvestment'], ['恒等式隐含CAB', 'impliedCurrentAccountBalance'], ['因果调整路径', 'causalAdjustmentPath']],
  C7: [['A的NIIP', 'economyANetIip'], ['B的NIIP', 'economyBNetIip'], ['NIIP是否相同', 'sameNetIip'], ['A毛头寸规模', 'economyAGrossPosition'], ['B毛头寸规模', 'economyBGrossPosition'], ['A储备/短期外币债务', 'economyAReserveCoveragePercent'], ['B储备/短期外币债务', 'economyBReserveCoveragePercent'], ['危机概率', 'crisisProbability'], ['充足性结论', 'liquidityAdequacy']],
};

const copy: Record<BopLabId, Omit<BopLab, 'id' | 'initial' | 'fields' | 'display'>> = {
  C1: {
    title: '一笔出口怎样生成等额金融对项',
    question: '出口货物不是“凭空流入120”；居民取得的外部资产怎样补齐另一边？',
    passport: '独立SYN单笔交易。站在居民视角，货物出口记credit/revenue；取得境外存款与对非居民贸易信贷均是金融资产增加。没有具体国家、货币、银行或真实支付链。',
    sourceIds: [1], rebuild: '出口credit 120；境外存款资产增加80、贸易信贷资产增加40，两项debit合计120，所以单笔复式缺口120−80−40=0。并不要求120张纸币穿过国境。',
    changeCondition: '任一对项变化都会显式出现缺口；程序不把缺口自动塞进某个金融项目。真实统计汇总层的差额应作为统计差异单列，而不是伪造对项。',
    counterexample: '若非居民先赊购，出口时对项可以全是贸易信贷；以后付款只是把贸易信贷换成存款资产，不应再次记录同一笔出口。',
    unknownWarning: '真实付款时间、币种、账户所在地、贸易信贷期限、手续费、汇率和编制来源均未知。',
  },
  C2: {
    title: '三大账户与统计差异的有限闭合',
    question: 'CAB、KAB和FAB分别怎么算；实测未闭合时差额究竟放在哪里？',
    passport: '独立SYN期间汇总。采用BPM7的revenue/expenditure与资产净取得−负债净发生口径；统计差异定义为FAB−(CAB+KAB)。所有数字是题设，不代表任何经济体。',
    sourceIds: [1, 2], rebuild: '经常账户revenue=690、expenditure=650，所以CAB=40；KAB=10−5=5；FAB=90−35=55；统计差异=55−(40+5)=10。',
    changeCondition: '改变任一原始分项会改变相应余额与统计差异；程序保留差异，不把它按比例摊回经常账户或金融账户。',
    counterexample: '会计概念上CAB+KAB=FAB，不等于三组现实数据由同一来源同时观测。调查覆盖、时点和分类差异会令实务出现统计差异。',
    unknownWarning: '误差来源、遗漏方向、非法流动、因果驱动和修订后数值均未识别；统计差异不是“资本外逃”的自动估计。',
  },
  C3: {
    title: '净金融账户可以掩盖巨大的双向毛流量',
    question: 'FAB等于0时，跨境金融活动是否也等于0？',
    passport: '独立SYN毛交易账本。资产取得与处置、负债发生与偿还分别给定；净额只在同一侧同一类资产或负债内计算，资产与负债仍分开。',
    sourceIds: [1], rebuild: '资产净取得=600−500=100；负债净发生=800−700=100；FAB=100−100=0，但四类毛交易周转=600+500+800+700=2600。',
    changeCondition: '只改一项毛交易会同时改变该侧净额与毛周转；相等净额不要求相等构成、期限、币种或交易对手。',
    counterexample: '净额为0并不意味着没有滚续：若短债到期700又新借800，毛融资需求与再融资脆弱性仍可能很大。',
    unknownWarning: '期限、币种、工具、交易对手、毛成交覆盖、融资稳定性、滚续风险和市场准入条件都未知。',
  },
  C4: {
    title: '储备头寸变化不等于央行当期买卖',
    question: '期末储备增加60，其中多少来自交易，多少来自非交易变化？',
    passport: '独立SYN储备资产桥。期初头寸、BOP交易、汇率/其他价格重估和其他数量变化分别给定；不是干预识别、储备充足性或中央银行资产负债表全表。',
    sourceIds: [1, 6], rebuild: '期末储备=500+交易50+汇率重估20+其他价格0+其他数量变化(−10)=560。总增加60中，50是交易，10是净非交易变化。',
    changeCondition: '改变汇率重估会改变期末头寸但不改变题设交易；若桥接后储备为负，程序STOP而不是把结果钳为0。',
    counterexample: '以美元报告的非美元储备可因交叉汇率上升而增值，即便央行没有净购入外汇；反过来，央行购买也可能被负重估抵消。',
    unknownWarning: '现实干预、可用性、对应负债、质押安排、币种结构、估值方法和储备充足性都未知。',
  },
  C5: {
    title: 'IIP桥接把交易与持有损益分开',
    question: 'NIIP从200变成235时，为什么不能把全部35都叫资本流入或流出？',
    passport: '独立SYN外部资产负债表。资产、负债的交易、汇率重估、其他价格重估和其他数量变化分栏；没有真实市场、币种或违约事件。',
    sourceIds: [1, 3], rebuild: '期末资产=1000+100+40−20+0=1120；负债=800+50+30+10−5=885；NIIP由200升至235。交易贡献50，净汇率+10，净其他价格−30，净其他数量+5，合计35，桥接残差0。',
    changeCondition: '任一资产或负债重估变化只进入对应桥；若期末资产或负债为负则STOP。程序不会把重估伪装成金融账户交易。',
    counterexample: '一个国家可以经常账户顺差却因负重估使NIIP下降；也可经常账户逆差但因有利估值令NIIP暂时改善。',
    unknownWarning: '真实市场价格、汇率暴露、衍生品套保、资产覆盖、估值误差、可持续性与因果均未知。',
  },
  C6: {
    title: 'CAB等于储蓄减投资，但恒等式不提供因果箭头',
    question: '私人净储蓄50与政府缺口−30怎样合成全国CAB？',
    passport: '独立SYN国民账户分解。资本形成沿用宏观统计定义；私人和政府只作两部门合并。恒等式是同一账本的重排，不是行为模型或政策乘数。',
    sourceIds: [1], rebuild: '私人缺口=300−250=50；政府缺口=50−80=−30；国民储蓄350、国民投资330，所以S−I=20，恒等式隐含CAB=20。',
    changeCondition: '改变任一储蓄或投资会机械改变恒等式余额，但不会由程序推断汇率、利率、收入、消费或资本流怎样调整。',
    counterexample: '看到CAB下降不能只宣布“政府赤字导致”：私人储蓄、私人投资、收入和政策反应都可能同时变化，方向需要模型与识别。',
    unknownWarning: '现实部门边界、折旧、统计口径、行为反应、价格反馈、政策反事实与调整时序均未知。',
  },
  C7: {
    title: '相同NIIP不代表相同毛头寸与流动性结构',
    question: '两个经济体NIIP都为100，为什么外部资产负债表不能据此视为相同？',
    passport: '两个互不对应现实国家的SYN快照。短期外币债务与储备资产只是两个构成字段；储备覆盖率是机械比率，不是IMF充足性框架或危机概率。',
    sourceIds: [1, 3, 6], rebuild: 'A：资产1000、负债900，NIIP=100、毛头寸1900、储备/短期外币债务=25%。B：资产300、负债200，NIIP=100、毛头寸500、覆盖率=200%。净位置相同，毛规模与构成不同。',
    changeCondition: '保持资产减负债为100仍可任意改变毛规模；改变短债或储备会改变机械覆盖率，但不改变其他未建模的期限、套保与市场准入。',
    counterexample: '高毛头寸既可能反映金融中心的双向中介，也可能放大估值与融资暴露；单一比率不能直接排序危机概率。',
    unknownWarning: '真实可用储备、剩余期限、币种、部门、衍生品、或有负债、资本管制、市场准入和危机概率未知。',
  },
};

function display(id: BopLabId, input: unknown): BopDisplay {
  const result = bopEvaluators[id](input);
  if (result.status === 'STOP') return result;
  return { status: 'OK', rows: rowKeys[id].map(([label, key]) => [label, valueText(result, key)]) };
}

export const balanceOfPaymentsLabs: readonly BopLab[] = (Object.keys(bopCanonicalInputs) as BopLabId[]).map(id => ({
  id, ...copy[id], initial: bopCanonicalInputs[id],
  fields: Object.entries(bopRawDomains[id] as Readonly<Record<string, BopDomain>>).map(([key, domain]) => ({ key, label: fieldLabels[id][key], ...domain })),
  display: input => display(id, input),
}));

export const balanceOfPaymentsLabAudit = [
  {
    key: 'seven independent canonical input identities and 46 declared raw integer fields',
    passed: balanceOfPaymentsLabs.length === 7
      && balanceOfPaymentsLabs.reduce((sum, lab) => sum + lab.fields.length, 0) === 46
      && balanceOfPaymentsLabs.every(lab => lab.initial === bopCanonicalInputs[lab.id]),
  },
  {
    key: 'all fields retain units and exact safe integer domains',
    passed: balanceOfPaymentsLabs.every(lab => lab.fields.every(field => field.label.length >= 10 && field.step === 1 && Number.isSafeInteger(field.min) && Number.isSafeInteger(field.max) && field.min <= field.max)),
  },
  {
    key: 'all defaults yield finite or explicit unknown rows with rebuild and counterexample',
    passed: balanceOfPaymentsLabs.every(lab => {
      const result = lab.display(lab.initial);
      return result.status === 'OK' && result.rows.every(([label, value]) => label.length > 0 && value.length > 0)
        && lab.rebuild.length >= 60 && lab.counterexample.length >= 45 && lab.unknownWarning.length >= 35;
    }),
  },
] as const;
