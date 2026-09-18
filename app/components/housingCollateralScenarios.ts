import { housingCanonicalResults, housingC1, housingC2, housingC3, housingC5, housingC6, housingC7 } from './housingCollateralFixtures';
import { housingFormat as f } from './housingLabDefinitions';
import { housingPriceDrawdownPercent, housingPricePeak, housingPriceTrough } from './housingPriceData';

export type HousingScenario = { id: string; anchor: string; title: string; question: string; input: string; choices: readonly { id: string; label: string; diagnosis: string; numericValue: number }[]; correct: string; explanation: string; sources: readonly number[] };
const r = housingCanonicalResults;
const choice = (id: string, value: number, diagnosis: string, suffix = '') => ({ id, numericValue: value, label: `${f(value)}${suffix}`, diagnosis });

export const housingScenarios: readonly HousingScenario[] = [
  { id: '1', anchor: 'home-equity', title: '二押和现金各放哪一栏？', question: '当前房屋权益是多少？', input: `SYN：房价${housingC1.price}、一押${housingC1.firstLien}、二押${housingC1.secondLien}、现金${housingC1.cash}。`, correct: 'equity',
    choices: [choice('equity', r.c1.equity, '对：所有已借抵押本金都扣除，可用现金独立保留。'), choice('omit-junior', housingC1.price - housingC1.firstLien, '这条路径遗漏二押。先重建全部住房抵押本金，不要把一押LTV当合并LTV。'), choice('include-cash', r.c1.equity + housingC1.cash, '这条路径把房屋权益和现金合并成简化净财富，回答的已不是住房权益。')],
    explanation: `100−70−10=${f(r.c1.equity)}；现金5单独记录。漏二押的30过高，含现金的25是不同资产范围。`, sources: [2, 5] },
  { id: '2', anchor: 'new-loan-gates', title: '放宽哪个门才有用？', question: '忽略尚未通过的首付门，新贷款技术容量是多少？', input: `SYN：房价100、最高LTV0.8、月预算0.45、月息0.005、240月。月年金系数${f(r.c2.factor, 12)}。`, correct: 'minimum',
    choices: [choice('collateral-only', r.c2.collateralCap, '只看担保上限遗漏了月付款预算；求出另一容量后再取较小值。'), choice('minimum', r.c2.capacity, '对：付款门先绑定。这仍不是贷款人批准或实际放款。'), choice('add-caps', r.c2.collateralCap + r.c2.paymentCap, '两种限制约束同一笔借款，不能把两个上限当作独立资金池相加。')],
    explanation: `抵押上限80，付款上限0.45/a=${f(r.c2.paymentCap)}，两者最小值${f(r.c2.capacity)}。提高不绑定的LTV门不一定有影响。`, sources: [1, 2, 7] },
  { id: '3', anchor: 'down-payment', title: '交割日还差多少现金？', question: '假设按C2容量借满，计费用2、可用现金25，首付资金缺口是多少？', input: `房价100−假设容量${f(r.c2.capacity)}，另计费用2；可用现金25。假设借满不是实际批准。`, correct: 'cash-gap',
    choices: [choice('omit-fees', Math.max(0, housingC2.price - r.c2.capacity - housingC2.cash), '这条路径漏掉交割费用；把完整交割用途与可用现金同日对账。'), choice('cash-gap', r.c2.cashGapAtCap, '对：即使月付可行，现金门尚未通过。'), choice('monthly-means-closing', 0, '把月付款预算合格误当交割现金齐备，是流量与存量的混淆。')],
    explanation: `自有资金与费用100−${f(r.c2.capacity)}+2=${f(r.c2.cashNeededAtCap)}；再扣现金25，缺${f(r.c2.cashGapAtCap)}。`, sources: [2, 7] },
  { id: '4', anchor: 'cash-out', title: '批准不是可消费现金', question: '全部旧债同次清偿后，交给家庭的额外现金是多少？', input: 'SYN：容量90、批准85、实际借入85、清旧本金75、应计未付利息0、全部另计交割费用2。', correct: 'net-cash',
    choices: [choice('net-cash', r.c3.cashOut, '对：只将交割后剩余资金视为额外现金。'), choice('draw-is-cash', housingC3.drawn, '实际借入资金首先还要完成旧债和费用用途，不能全部算额外现金。'), choice('omit-fees', housingC3.drawn - housingC3.dischargedDebt, '只扣旧债的路径漏掉交割费用，净增债也不是净现金。')],
    explanation: `85−75−2=${f(r.c3.cashOut)}；净增债10、费用2与现金8分别保留。`, sources: [2, 9] },
  { id: '5', anchor: 'cash-out', title: '新旧债务存量不可双计', question: '旧债75已全部清偿后，这笔再融资的新存量是多少？', input: '实际新借85、旧债75已经注销，未保留二押。', correct: 'new-stock',
    choices: [choice('add-discharged', housingC3.drawn + housingC3.dischargedDebt, '将已清偿旧债继续加在新存量里，是双重计数。'), choice('flow-is-stock', r.c3.netDebtIncrease, '新旧差是流量／变化量，不是成交后新存量。'), choice('new-stock', r.c3.newDebt, '对：同次全清旧债，只保留新存量。')],
    explanation: `最终存量85，净增10。若旧债未全部清偿，则必须改账本，不能继续沿用“已全清”的题设。`, sources: [2, 9] },
  { id: '6', anchor: 'rate-reset', title: '新利率尚未到重置日', question: '本比较日ARM重置标记为0，当前适用P&I是多少？', input: '余额70、剩240月；原月息0.004、假设未来重置0.006；本日尚未重置，不计税险。', correct: 'old-payment',
    choices: [choice('quote-immediate', r.c4.hypotheticalResetPi, '把未来假设报价直接覆盖当前合同，漏掉重置日期门槛。'), choice('old-payment', r.c4.currentArmPi, '对：未到重置日仍用旧合同；未来日重新登记余额和剩期。'), choice('difference-as-payment', r.c4.hypotheticalResetPi - r.c4.fixedPi, '这算的是假设新旧月付差，不是当前付款水平。')],
    explanation: `当前P&I=${f(r.c4.fixedPi, 6)}；仅当本日重置且其他条件冻结时新P&I才为${f(r.c4.hypotheticalResetPi, 6)}。`, sources: [7, 10] },
  { id: '7', anchor: 'two-dimensional-stress', title: '现金覆盖不是违约日期', question: '已知月赤字0.4、现金3，在冻结流量假设下现金覆盖月数是多少？', input: '房价70、债80；月收入1.2、必要支出1、P&I0.6；未来12月不变，不计再融资与收入恢复。只问预算覆盖。', correct: 'runway',
    choices: [choice('runway', r.c5.cashRunwayMonths!, '对：这是冻结预算覆盖，不是必然违约时点。', '个月'), choice('cash-over-income', housingC5.cash / housingC5.income, '分母用了收入，不是待填的净月赤字，回答了不同问题。', '个月'), choice('cash-over-payment', housingC5.cash / housingC5.pi, '分母只用P&I，忽略收入与必要支出的净额。', '个月')],
    explanation: `3/(1+0.6−1.2)=${f(r.c5.cashRunwayMonths)}月；12月赤字4.8、动现金后缺1.8，实际逾期／违约仍未知。`, sources: [4, 5] },
  { id: '8', anchor: 'sale-recovery', title: '净池只分配一次', question: '已成交60、费用3先付、优先50、次级20，次级首次抵押回收是多少？', input: '教学排序明确为先费用→优先→次级，不根据真实法条或KMV排序推断。', correct: 'junior',
    choices: [choice('omit-costs', Math.min(housingC6.juniorClaim, Math.max(0, housingC6.salePrice - housingC6.seniorClaim)), '未先扣成本使分配池过大；这是首次净处置对账，不是毛价格对账。'), choice('pro-rata', r.c6.netProceeds * housingC6.juniorClaim / (housingC6.seniorClaim + housingC6.juniorClaim), '比例分配改变了题目已声明的优先顺序；顺序是输入，不可私自替换。'), choice('junior', r.c6.juniorRecovery, '对：次级只用净池支付优先之后的余额；未收回部分仍非最终法律损失。')],
    explanation: `净池57，优先50，次级7，业主0；次级抵押回收不足13，后续追索和最终损失未知。`, sources: [4, 6] },
  { id: '9', anchor: 'heterogeneous-spending', title: '分组冲击与系数共同加权', question: 'C7下一12月总合成支出变化是多少SYN？', input: '40户：每户冲击−10、系数0.02；40户：−5、0.06；20户：0、0。全部系数仅教学，不是估计MPC。', correct: 'weighted',
    choices: [choice('mean-coefficient', r.c7.totalValueShock * r.c7.unweightedResponseMean, '直接平均系数丢掉人数与冲击的组合权重；回到逐组贡献。'), choice('weighted', r.c7.totalSpendingChange, '对：先按每组人数×每户冲击×该组系数，再相加。'), choice('mean-household-response', housingC7.reduce((sum, group) => sum + group.perHouseholdValueShock * group.syntheticResponse, 0) / housingC7.length * r.c7.households, '三个组不是各占三分之一家庭；均分组平均也会错置权重。')],
    explanation: '40×(−10)×0.02+40×(−5)×0.06+20×0×0=−20；合成聚合比−20/−600=1/30，不是国家乘数或个人MPC。', sources: [2, 3] },
  { id: '10', anchor: 'valuation-passport', title: '指数跌幅的基数与证据身份', question: '指定回溯峰222.84到谷175.49的算术跌幅百分比是多少？', input: 'FHFA全国名义季度SA；2026取得的当前历史快照，峰谷按本页事后窗口选。', correct: 'peak-base',
    choices: [choice('index-points-as-percent', housingPriceTrough.value - housingPricePeak.value, '这是指数点差，不是以起点为基数的百分比。', '%'), choice('trough-base', (housingPriceTrough.value - housingPricePeak.value) / housingPriceTrough.value * 100, '用谷值当跌幅基数会改变问题；上涨与下跌的百分比基数不相同。', '%'), choice('peak-base', housingPriceDrawdownPercent, '对：用峰值作跌幅基数，但正确算术仍不意味着历史PIT或因果识别。', '%')],
    explanation: '100×(175.49/222.84−1)=−21.248429%。指数非单套房售价；正确描述不证明当年可见数据，也不识别信用冲击。', sources: [12, 13] },
];

const near = (a: number, b: number) => Math.abs(a - b) < 1e-9;
const answer = (scenario: number, id: string) => housingScenarios[scenario - 1].choices.find((c) => c.id === id)!.numericValue;
export const housingScenarioAudit = [
  { key: 'correct option positions vary across A/B/C, without changing scenario identity or values', passed: [0,1,2].every((position)=>housingScenarios.some((s)=>s.choices.findIndex(({id})=>id===s.correct)===position)) },
  { key: 'ten unique M/K records; each one correct and two wrong finite distinct outputs', passed: housingScenarios.length === 10 && new Set(housingScenarios.map(({id})=>id)).size === 10 && housingScenarios.every((s)=>s.choices.length===3 && s.choices.filter(({id})=>id===s.correct).length===1 && s.choices.every(({numericValue})=>Number.isFinite(numericValue)) && new Set(s.choices.map(({numericValue})=>numericValue)).size===3) },
  { key: 'wrong paths C1 omission and cash inclusion', passed: answer(1,'omit-junior')===30 && answer(1,'include-cash')===25 },
  { key: 'wrong paths capacity summation and cost omission', passed: near(answer(2,'add-caps'),142.81134725731812) && near(answer(3,'omit-fees'),12.188652742681882) },
  { key: 'wrong paths cash-out and stock double count', passed: answer(4,'omit-fees')===10 && answer(4,'draw-is-cash')===85 && answer(5,'add-discharged')===160 && answer(5,'flow-is-stock')===10 },
  { key: 'wrong paths timing, coverage denominators and liquidation priority', passed: near(answer(6,'difference-as-payment'),0.09687428038297346) && answer(7,'cash-over-income')===2.5 && answer(7,'cash-over-payment')===5 && answer(8,'omit-costs')===10 && near(answer(8,'pro-rata'),114/7) },
  { key: 'wrong paths spending aggregation and index percentage', passed: near(answer(9,'mean-coefficient'),-16) && near(answer(9,'mean-household-response'),-50/3) && near(answer(10,'index-points-as-percent'),-47.35) && near(answer(10,'trough-base'),-26.981594392842897) },
] as const;
if (housingScenarioAudit.some(({passed})=>!passed)) throw new Error(`3.16 scenario gate: ${housingScenarioAudit.filter(({passed})=>!passed).map(({key})=>key).join('; ')}`);
