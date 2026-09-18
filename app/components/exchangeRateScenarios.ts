import {
  fxQuoteTranslation, fxCoveredReturn, fxUncoveredStates, fxConditionalRepricing,
  fxRelativePriceIndex, fxBalanceSheet, fxTradeInvoice,
} from './exchangeRateFixtures';
import { exchangeRateCanonicalInputs, exchangeRateLabs, exchangeRateDisplayValue } from './exchangeRateLabDefinitions';
import type { ExchangeRateLabId } from './exchangeRateLabDefinitions';

export type ExchangeRateScenario = {
  id: string;
  labId: ExchangeRateLabId;
  title: string;
  question: string;
  inputs: Readonly<Record<string, number>>;
  unit: string;
  correct: number;
  reason: string;
  wrong: readonly { value: number; diagnosis: string }[];
  scope: string;
  sourceIds: readonly number[];
};

const c = exchangeRateCanonicalInputs;
const m8Inputs = { ...c.c5, foreignIndexNew: 110 } as const;
const quote = (cents: number) => cents / 100;
const gross = (bps: number) => 1 + bps / 10_000;
const meanFuture = (c.c3.probabilityAPct * quote(c.c3.futureACents)
  + (100 - c.c3.probabilityAPct) * quote(c.c3.futureBCents)) / 100;

function authored(s: Omit<ExchangeRateScenario, 'scope' | 'sourceIds'>): ExchangeRateScenario {
  const lab = exchangeRateLabs.find(l => l.id === s.labId);
  if (!lab) throw Error(`Missing authored lab passport: ${s.labId}`);
  return { ...s, scope: lab.assumption, sourceIds: lab.sourceIds };
}

// Answers and distractors are independently written expressions, not copied fixture outputs.
// The separate audit below compares the ten answer expressions against their pure contracts.
export const exchangeRateScenarios: readonly ExchangeRateScenario[] = [
  authored({
    id: 'M1', labId: 'C1', title: '反向币值必须先取倒数', inputs: c.c1,
    question: '同一外币金额不变。S从旧报价变为新报价时，本币的反向币值1/S相对旧值变化多少？不是问S本身的变化。',
    unit: '%（1/S相对变化）',
    correct: (c.c1.oldQuoteCents / c.c1.newQuoteCents - 1) * 100,
    reason: '反向旧值为1/7、新值为1/8.75；新值除旧值等于7/8.75=0.8，所以变化是−20%。S上升25%对应本币反向币值下降20%，两个百分率的分母不同。给定20外币只影响折本币金额，不改变币值百分率；这不解释真实汇率为何变化。',
    wrong: [
      { value: -(c.c1.newQuoteCents / c.c1.oldQuoteCents - 1) * 100, diagnosis: '−25%先算S上升25%，然后直接改负号。取倒数需要重新计算新值/旧值：7/8.75而非8.75/7；只有小幅变动时变号才可能是近似，本题要求给定报价的精确比率。' },
      { value: (c.c1.newQuoteCents / c.c1.oldQuoteCents - 1) * 100, diagnosis: '+25%计算的是S本币/1外币的报价变化，回答了另一对象。所求是1/S外币/1本币；S上升意味着同一本币能换的外币减少，不能把正向报价的结果直接复制到反向币值。' },
    ],
  }),
  authored({
    id: 'M2', labId: 'C2', title: '理想远期要匹配两条同日期支付', inputs: c.c2,
    question: '在本题无费用、同类固定支付的理想条件下，使套保总回报等于本币总回报的精确远期基准F是多少？不是问给定可代入的F，也不是未来现货期望。',
    unit: '本币/1外币（理想F）',
    correct: quote(c.c2.spotCents) * gross(c.c2.homeReturnBps) / gross(c.c2.foreignReturnBps),
    reason: '一单位本币经外币投资并全额套保，终点本币总金额为1.01×F/10；令它等于本币总金额1.04，得F=10×1.04/1.01≈10.297029703。给定F=10.4不是自动满足该等式的基准；未知买卖价、借贷和保证金成本仍不能认证可执行套利，F也不等于真实E[S未来]。',
    wrong: [
      { value: quote(c.c2.spotCents) * (1 + (c.c2.homeReturnBps - c.c2.foreignReturnBps) / 10_000), diagnosis: '10.3用10×(1+4%−1%)得到小回报加法近似，省掉了精确分母1.01。它可以解释方向，但不是题目要求的同日期总支付精确相等基准；不能把近似误差当作新金融机制。' },
      { value: quote(c.c2.forwardCents), diagnosis: '10.4只是题设给定的远期报价。将已给F直接叫理想F，跳过了1.01×F/10是否等于1.04的核对；理论基准、输入报价与现实可执行成交价是三个不同对象。' },
    ],
  }),
  authored({
    id: 'M3', labId: 'C2', title: '套保回报不能漏掉交叉乘积', inputs: c.c2,
    question: '按给定S和给定F，外币投资的全部到期支付今天卖出远期后，本币同期间简单净回报是多少？不是问相对本币投资的超额，也不认证净套利利润。',
    unit: '%（套保本币简单净回报）',
    correct: (gross(c.c2.foreignReturnBps) * c.c2.forwardCents / c.c2.spotCents - 1) * 100,
    reason: '先把一单位本币按10换成0.1外币；外币投资后得0.101外币，再按已锁定10.4换成1.0504本币，简单净回报5.04%。等价于1.01×1.04−1，其中0.01×0.04也要保留；减去本币4%才是另一对象+1.04百分点。费用与融资未知，不能将算术差叫已实现套利利润。',
    wrong: [
      { value: c.c2.homeReturnBps / 100, diagnosis: '4%直接使用本币投资回报，擅自假定给定F已经处于理想CIP基准。题设F=10.4需要实际代入外币现金流1.01×10.4/10；不能用条件理论等式抹掉给定输入与基准的差别。' },
      { value: c.c2.foreignReturnBps / 100 + (c.c2.forwardCents / c.c2.spotCents - 1) * 100, diagnosis: '5%把外币投资1%与远期/现货变化4%直接相加，遗漏外币利息也按同一远期报价换回本币产生的0.04个百分点交叉项。给定简单总回报要相乘，再减1，而不是把两个净回报相加。' },
    ],
  }),
  authored({
    id: 'M4', labId: 'C3', title: '汇率均值不等于投资超额', inputs: c.c3,
    question: '按题设物理概率，未对冲外币投资的预期本币简单回报减去本币同期间简单回报，差是多少百分点？本题π是这个自定义简单超额，不是EW的log风险项。',
    unit: '百分点（简单预期超额π）',
    correct: (gross(c.c3.foreignReturnBps) * meanFuture / quote(c.c3.spotCents) - gross(c.c3.homeReturnBps)) * 100,
    reason: '未来S的算术均值0.5×8+0.5×12=10；未对冲外币投资的预期本币简单回报为1.01×10/10−1=1%。所求外币投资减本币投资，故1%−4%=−3个百分点。汇率的算术预期变化0%没有删除外币利息和本币比较基准；给定概率不是现实估计，也不识别风险补偿。',
    wrong: [
      { value: (meanFuture / quote(c.c3.spotCents) - 1) * 100, diagnosis: '0只回答未来S均值相对今天S的变化，漏掉外币投资1%与本币投资4%两条同日期现金流。汇率均值不变不等于两币投资预期回报相同；更不等于真实风险或风险补偿已被识别为零。' },
      { value: (gross(c.c3.homeReturnBps) - gross(c.c3.foreignReturnBps) * meanFuture / quote(c.c3.spotCents)) * 100, diagnosis: '+3个百分点倒置了比较方向，算的是本币回报减未对冲外币预期本币回报。题目π明确按外币投资减本币投资定义；先写两条终点本币金额再相减，才不会在“本币较高”与“外币超额较低”之间混淆符号。' },
    ],
  }),
  authored({
    id: 'M5', labId: 'C3', title: '先取log，再按状态平均', inputs: c.c3,
    question: '题设E[log(S未来/S今天)]×100是多少？所求是正向S的预期log变化刻度，不是简单百分回报，也不是1/S的算术预期变化。',
    unit: '（log变化×100刻度）',
    correct: c.c3.probabilityAPct * Math.log(c.c3.futureACents / c.c3.spotCents)
      + (100 - c.c3.probabilityAPct) * Math.log(c.c3.futureBCents / c.c3.spotCents),
    reason: '两个状态先各自取log：log(8/10)与log(12/10)，再各乘0.5并相加，最后乘100，得约−2.041099726。log是凹函数，所以这不同于log(平均S/今天S)=log(1)=0；负log均值也不能直接叫简单回报−2.0411%，更不能从独立SYN识别真实概率或风险补偿。',
    wrong: [
      { value: Math.log(meanFuture / quote(c.c3.spotCents)) * 100, diagnosis: '0先平均未来报价得10，再取log(10/10)，把log(E[S])误接成E[log S]。非线性操作与状态平均通常不能换顺序；本题8与12不是同一报价，Jensen差不能被均值相等消掉。' },
      { value: (quote(c.c3.spotCents) * (c.c3.probabilityAPct / 100 / quote(c.c3.futureACents)
        + (1 - c.c3.probabilityAPct / 100) / quote(c.c3.futureBCents)) - 1) * 100, diagnosis: '约4.166666667%是1/S反向币值的算术预期相对变化：10×(0.5/8+0.5/12)−1。它既换了正向/反向对象，又把log变化换成简单变化；数值可在另一问题中成立，但不能回答本题正向S的预期log刻度。' },
    ],
  }),
  authored({
    id: 'M6', labId: 'C4', title: '条件回价必须同时更新终点与分母', inputs: c.c4,
    question: '两情景保持同一估值日t、终点T及持有期。按新情景给定条件S=G外E[S未来]/(G本+π)，新情景条件S是多少？不是问加息的现实因果效果或成交预测。',
    unit: '本币/1外币（新条件S）',
    correct: gross(c.c4.foreignReturnBps) * quote(c.c4.newExpectedFutureCents)
      / (gross(c.c4.newHomeReturnBps) + c.c4.newExpectedExcessBps / 10_000),
    reason: '新情景分子1.01×10.3=10.403，分母1.03+0=1.03，所以新条件S=10.1。基线用1.01×10/1.02≈9.901960784，因给定预期终点与本币回报同时改变，条件比较中S仍上升2%。这只是同一时钟下的模型回价，不是两次连续交易，也不识别加息导致贬值。',
    wrong: [
      { value: gross(c.c4.foreignReturnBps) * quote(c.c4.oldExpectedFutureCents)
        / (gross(c.c4.newHomeReturnBps) + c.c4.newExpectedExcessBps / 10_000), diagnosis: '约9.805825243只更新本币回报到3%，却仍用旧预期终点10，计算的是另一个“终点不修订”的条件情景。题设新终点是10.3；不能把只改利率的比较冒充同时改利率和预期终点的本题。' },
      { value: gross(c.c4.foreignReturnBps) * quote(c.c4.newExpectedFutureCents), diagnosis: '10.403只得到分子1.01×10.3，漏除新情景的本币总回报加给定π。预期终点本币金额不是今天的条件报价；必须由两条同期间回报条件回推S，且分母须严格正。' },
    ],
  }),
  authored({
    id: 'M7', labId: 'C5', title: '实际指数要同时经过两国价格门', inputs: c.c5,
    question: '按本课qIndex=100×(S新/S旧)×(I外新/I外旧)÷(I本新/I本旧)，新qIndex是多少？旧期100只是归一化，不是均衡或绝对PPP水平。',
    unit: '（本课归一化qIndex）',
    correct: 100 * c.c5.newQuoteCents / c.c5.oldQuoteCents
      * (c.c5.foreignIndexNew / c.c5.foreignIndexOld) / (c.c5.homeIndexNew / c.c5.homeIndexOld),
    reason: '名义S倍数1.1、外国价格倍数1、本国价格倍数1.2，故qIndex=100×1.1×1/1.2≈91.666666667。名义本币贬值10%并未阻止本课qIndex下降；此指数上升表示实际贬值，与BIS REER上升表示升值的方向相反。两国各自指数不是同篮子货币成本，不能由此认证绝对PPP或低估。',
    wrong: [
      { value: 100 * (1 + (c.c5.newQuoteCents / c.c5.oldQuoteCents - 1)
        + (c.c5.foreignIndexNew / c.c5.foreignIndexOld - 1) - (c.c5.homeIndexNew / c.c5.homeIndexOld - 1)), diagnosis: '90把名义+10%与本国价格+20%直接加减，使用1+10%−20%的近似，漏掉精确价格倍数分母1.2。方向可相同，但本题给定归一化指数的乘除定义，不要求小变动近似。' },
      { value: 100 * c.c5.newQuoteCents / c.c5.oldQuoteCents, diagnosis: '110只计算名义S归一化指数，漏掉外国/本国价格倍数。要回答本课实际qIndex，必须让同一名义报价变化经过两国各自指定价格口径；不能把名义贬值直接叫同幅实际贬值。' },
    ],
  }),
  authored({
    id: 'M8', labId: 'C5', title: '主动固定qIndex是另一个反事实', inputs: m8Inputs,
    question: '本题只将C5外国新指数改为110。给定新S仍用于原情景记录；另主动要求qIndex保持旧期100时，反事实所需S相对旧S变化多少？不是声称给定新S已经保持qIndex不变。',
    unit: '%（固定qIndex反事实所需S变化）',
    correct: ((m8Inputs.homeIndexNew / m8Inputs.homeIndexOld)
      / (m8Inputs.foreignIndexNew / m8Inputs.foreignIndexOld) - 1) * 100,
    reason: '另设qIndex=100，便要求S反事实/S旧=(I本新/I本旧)/(I外新/I外旧)=1.2/1.1，所需S变化约9.090909091%。给定新S=11相对旧10上升10%，属于原情景输入，不是这个固定qIndex解；反事实新S约10.909090909。两情景不能混接，更不能把归一化100认证为真实均衡。',
    wrong: [
      { value: ((m8Inputs.homeIndexNew / m8Inputs.homeIndexOld - 1)
        - (m8Inputs.foreignIndexNew / m8Inputs.foreignIndexOld - 1)) * 100, diagnosis: '10%把本国价格20%与外国价格10%相减，使用小变动近似，也恰巧复制了给定S的10%变化。精确固定qIndex需要1.2/1.1−1；原情景给定新S与另求的反事实新S是不同对象，不能因数字看起来接近就宣称已固定实际指数。' },
      { value: (m8Inputs.homeIndexNew / m8Inputs.homeIndexOld - 1) * 100, diagnosis: '20%只跟随本国价格变化，漏掉本题已改为1.1的外国价格倍数。固定本课qIndex需要名义S倍数乘外国价格倍数再除本国价格倍数等于1，不能让同一外国产品价格门在反事实中凭空消失。' },
    ],
  }),
  authored({
    id: 'M9', labId: 'C6', title: '权益变化不是权益水平', inputs: c.c6,
    question: '原币资产负债金额固定、没有新增借款，仅按新S换算后，新账面净权益是多少本币单位？不是问权益变化，也不是法律违约判断。',
    unit: '本币单位（新账面净权益）',
    correct: c.c6.homeAssets + quote(c.c6.newQuoteCents) * c.c6.foreignAssets
      - c.c6.homeLiabilities - quote(c.c6.newQuoteCents) * c.c6.foreignLiabilities,
    reason: '新折本币资产为100+0×7.7=100，新负债为0+10×7.7=77，故新账面净权益23。旧权益100−10×7=30，纯换算变化−7；没有新增借款不等于固定外币负债的本币账面额不变。这里没有支付日期、银行反应或法律程序证据，不能由账面结果直接判定违约。',
    wrong: [
      { value: c.c6.homeAssets + quote(c.c6.oldQuoteCents) * c.c6.foreignAssets
        - c.c6.homeLiabilities - quote(c.c6.oldQuoteCents) * c.c6.foreignLiabilities, diagnosis: '30仍用旧报价7，因没有新增借款就错误保留旧权益。外币负债原币10确实没变，但每单位外币按新S需7.7本币；交易流量为零与折本币存量重估是两个不同统计门。' },
      { value: (c.c6.foreignAssets - c.c6.foreignLiabilities)
        * (quote(c.c6.newQuoteCents) - quote(c.c6.oldQuoteCents)), diagnosis: '−7正确计算了净外币头寸−10乘报价变化0.7所得的权益变化，却把变化量冒充新权益水平。先有旧权益30，再加变化−7才得新23；不能把某一账面变化直接当成法定违约或银行授信变化。' },
    ],
  }),
  authored({
    id: 'M10', labId: 'C7', title: '贸易收款增加不是全部留作净现金', inputs: c.c7,
    question: '同一支付日固定外币发票收付与本币其他费用，按反事实新S换算，给定净现金（收款−进口付款−本币费用）是多少？所求不是法定会计利润、数量变化或真实净出口因果效果。',
    unit: '本币单位（给定净现金）',
    correct: (c.c7.foreignReceipts - c.c7.foreignPayments) * quote(c.c7.newQuoteCents) - c.c7.homeFixedCost,
    reason: '新折本币收款10×7.7=77，进口付款6×7.7=46.2，本币费用20仍需扣除，给定净现金77−46.2−20=10.8。基线为70−42−20=8，纯换算增加2.8，不是收款增加7全部留下。它仅覆盖声明现金项目，未给库存、折旧、税、应计或对冲，不认证法定会计利润或贸易数量反应。',
    wrong: [
      { value: (c.c7.foreignReceipts - c.c7.foreignPayments) * quote(c.c7.oldQuoteCents) - c.c7.homeFixedCost
        + c.c7.foreignReceipts * (quote(c.c7.newQuoteCents) - quote(c.c7.oldQuoteCents)), diagnosis: '15用基线净现金8加外币收款折本币增加7，漏掉同一新S也使进口付款增加6×0.7=4.2。净现金必须同时过收入和付款两道换算门；不能把名义收款增加全数当成可留资金，更不能据此认证利润或实际出口增加。' },
      { value: (c.c7.foreignReceipts - c.c7.foreignPayments) * quote(c.c7.newQuoteCents), diagnosis: '30.8是净外币发票4按7.7折成本币，尚未减给定本币费用20。按同一付款日先净额换算并不免除其他本币付款；所求完整声明净现金应再扣20，且这仍不是含所有会计项目的法定利润。' },
    ],
  }),
];

const orders: Readonly<Record<string, readonly number[]>> = {
  M1: [0, 1, 2], M2: [1, 2, 0], M3: [1, 0, 2], M4: [2, 0, 1], M5: [0, 2, 1],
  M6: [2, 1, 0], M7: [1, 2, 0], M8: [1, 0, 2], M9: [0, 1, 2], M10: [2, 0, 1],
};

export function exchangeRateOptions(s: ExchangeRateScenario) {
  const order = orders[s.id];
  if (!order) throw Error(`Unknown authored option order: ${s.id}`);
  const candidates = [
    { value: s.correct, diagnosis: s.reason, correct: true },
    ...s.wrong.map(w => ({ value: w.value, diagnosis: w.diagnosis, correct: false })),
  ];
  // Opaque positional identities do not mark an answer as correct in visible/ARIA labels.
  return order.map((i, position) => ({ ...candidates[i], id: `${s.id}-choice-${position + 1}` }));
}

export function exchangeRateScenarioInputText(s: ExchangeRateScenario) {
  const lab = exchangeRateLabs.find(l => l.id === s.labId);
  if (!lab) throw Error(`Missing authored lab input labels: ${s.labId}`);
  return lab.fields.map(f => `${f.label}＝${exchangeRateDisplayValue(s.inputs[f.key])}`).join('；');
}

function resultNumber<T>(r: { status: 'OK'; value: T } | { status: 'STOP'; reason: string }, key: keyof T): number {
  if (r.status === 'STOP') throw Error(`Authored default stopped: ${r.reason}`);
  const value = r.value[key];
  if (typeof value !== 'number' || !Number.isFinite(value)) throw Error('Expected a finite authored audit value');
  return value;
}
const pureAnswers = [
  resultNumber(fxQuoteTranslation(c.c1), 'reverseQuoteChangePct'),
  resultNumber(fxCoveredReturn(c.c2), 'idealForward'),
  resultNumber(fxCoveredReturn(c.c2), 'coveredReturnPct'),
  resultNumber(fxUncoveredStates(c.c3), 'expectedSimpleExcessPp'),
  resultNumber(fxUncoveredStates(c.c3), 'expectedLogQuoteChangePct'),
  resultNumber(fxConditionalRepricing(c.c4), 'newSpot'),
  resultNumber(fxRelativePriceIndex(c.c5), 'normalizedRealIndex'),
  resultNumber(fxRelativePriceIndex(m8Inputs), 'constantRealIndexRequiredQuoteChangePct'),
  resultNumber(fxBalanceSheet(c.c6), 'newEquity'),
  resultNumber(fxTradeInvoice(c.c7), 'newIllustrativeNetCash'),
];

/** Finite AUTHOR contract checks, not content approval, reality/PIT or executable-trade certification. */
export const exchangeRateScenarioAudit = [
  { key: 'ten shared M/K cases; thirty finite distinct neutral choices and twenty complete wrong paths', passed: exchangeRateScenarios.length === 10 && new Set(exchangeRateScenarios.map(s => s.id)).size === 10 && exchangeRateScenarios.every(s => s.wrong.length === 2 && new Set(exchangeRateOptions(s).map(o => o.value)).size === 3 && exchangeRateOptions(s).every(o => Number.isFinite(o.value) && o.diagnosis.length > 60)) },
  { key: 'ten independently authored answer expressions agree with same-C pure contracts', passed: exchangeRateScenarios.every((s, i) => Math.abs(s.correct - pureAnswers[i]) <= 1e-10 * Math.max(1, Math.abs(pureAnswers[i]))) },
  { key: 'every question retains the full Chinese input set, valid domains and unchanged same-C passport', passed: exchangeRateScenarios.every(s => { const lab = exchangeRateLabs.find(l => l.id === s.labId)!; return lab.display(s.inputs).status === 'OK' && Object.keys(s.inputs).sort().join('|') === lab.fields.map(f => f.key).sort().join('|') && lab.fields.every(f => exchangeRateScenarioInputText(s).includes(f.label)) && s.scope === lab.assumption && s.sourceIds.join('|') === lab.sourceIds.join('|'); }) },
  { key: 'all inputs canonical except M8 foreign new index110; M8 expressly separates required-S counterfactual', passed: exchangeRateScenarios.every(s => { const lab = exchangeRateLabs.find(l => l.id === s.labId)!; return Object.keys(s.inputs).every(k => s.inputs[k] === (s.id === 'M8' && k === 'foreignIndexNew' ? 110 : lab.initial[k])); }) && exchangeRateScenarios[7].question.includes('不是声称给定新S已经保持qIndex不变') },
  { key: 'shared actual ABC ordering A/C/B/B/A/C/C/B/A/B; one correct each and counts3/4/3', passed: exchangeRateScenarios.map(s => 'ABC'[exchangeRateOptions(s).findIndex(o => o.correct)]).join('/') === 'A/C/B/B/A/C/C/B/A/B' && exchangeRateScenarios.every(s => exchangeRateOptions(s).filter(o => o.correct).length === 1 && new Set(exchangeRateOptions(s).map(o => o.id)).size === 3) },
  { key: 'M10 only declared net cash; references1–8 and independent SYN scopes do not certify reality', passed: exchangeRateScenarios.every(s => s.scope.includes('独立SYN') && s.sourceIds.length > 0 && s.sourceIds.every(id => Number.isInteger(id) && id >= 1 && id <= 8)) && exchangeRateScenarios[9].question.includes('给定净现金') && exchangeRateScenarios[9].question.includes('不是法定会计利润') },
] as const;
