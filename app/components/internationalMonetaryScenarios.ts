import { imsCanonicalInputs, imsEvaluators } from './internationalMonetaryFixtures';
import type { ImsLabId } from './internationalMonetaryFixtures';
import { internationalMonetaryLabs, imsNumber } from './internationalMonetaryLabDefinitions';

type WrongPath = Readonly<{ value: number; diagnosis: string }>;

export type ImsScenario = Readonly<{
  id: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10';
  labId: ImsLabId;
  title: string;
  question: string;
  unit: string;
  resultKey: string;
  correct: number;
  correctIndex: 0 | 1 | 2;
  explanation: string;
  wrong: readonly [WrongPath, WrongPath];
  sourceIds: readonly number[];
  scope: string;
}>;

function labFor(id: ImsLabId) {
  const lab = internationalMonetaryLabs.find(candidate => candidate.id === id);
  if (!lab) throw Error(`固定题缺少实验定义：${id}`);
  return lab;
}

function numericResult(id: ImsLabId, key: string): number {
  const evaluator = imsEvaluators[id] as (input: unknown) =>
    | Readonly<{ status: 'STOP'; reason: string }>
    | Readonly<{ status: 'OK'; value: Readonly<Record<string, unknown>> }>;
  const result = evaluator(imsCanonicalInputs[id]);
  if (result.status === 'STOP' || typeof result.value[key] !== 'number' || !Number.isFinite(result.value[key])) {
    throw Error(`固定题必须取得有限数值结果：${id}.${key}`);
  }
  return result.value[key];
}

function sources(id: ImsLabId): readonly number[] { return labFor(id).sourceIds; }
function scope(id: ImsLabId): string { return labFor(id).passport; }

export const internationalMonetaryScenarios: readonly ImsScenario[] = [
  {
    id: '1', labId: 'C1', title: '协调采用先过固定成本门',
    question: '固定成本24、互动40次、每次被接受节省1；仅求使净收益为0的预期接受率阈值。',
    unit: '%（SYN协调阈值）', resultKey: 'thresholdPct', correct: numericResult('C1', 'thresholdPct'), correctIndex: 0,
    explanation: '全接受节省为40，所以阈值=24/40=60%。当前55%只决定当前净收益−2，不是阈值；40是全接受时的金额节省，也不是百分比门槛。',
    wrong: [
      { value: 55, diagnosis: '55%是题设当前预期接受率。它低于阈值并产生净收益−2，但不能因为它是当前输入就改名为零净收益门槛。' },
      { value: 40, diagnosis: '40是40次互动各节省1所得的全接受SYN金额。金额与接受率百分比单位不同，不能直接当成阈值。' },
    ], sourceIds: sources('C1'), scope: scope('C1'),
  },
  {
    id: '2', labId: 'C2', title: '同一候选货币不创造共同分母',
    question: '五张护照分别给出FX、计价、融资、储备与跨境支付记录价值百分比；在未统一function、unit、参考期、覆盖和分母时，可直接平均的百分比数量是多少？',
    unit: '项（可直接平均）', resultKey: 'directlyAverageableShareCount', correct: numericResult('C2', 'directlyAverageableShareCount'), correctIndex: 1,
    explanation: '答案为0。五张护照都指向C2_SYN_CANDIDATE，却分别是90%、60%、70%、50%和75%的不同统计对象；第五张只测付款币跨境支付记录，不测清算或最终结算。程序不生成简单平均69%。',
    wrong: [
      { value: 5, diagnosis: '5把“同一候选货币、同为百分比”误当成相同单位和分母。五张护照的function、时钟、覆盖与分母均不同。' },
      { value: 1, diagnosis: '1假定至少能选一张与其他四张直接平均，但没有任意两张已获得共同统计总体；单张本身也不存在跨护照平均问题。' },
    ], sourceIds: sources('C2'), scope: scope('C2'),
  },
  {
    id: '3', labId: 'C3', title: '两腿成本必须乘法合成',
    question: '载体路径两腿成本分别10bp与20bp；仅求该两腿路径的精确有效成本。',
    unit: 'bp（SYN有效成本）', resultKey: 'vehicleEffectiveCostBps', correct: numericResult('C3', 'vehicleEffectiveCostBps'), correctIndex: 2,
    explanation: '有效成本=10+20−10×20/10000=29.98bp。第二腿作用于第一腿后的留存金额，所以简单相加30bp漏掉0.02bp交叉项。',
    wrong: [
      { value: 30, diagnosis: '30bp直接相加两腿净成本，省略了第二腿只作用于第一腿后余额的乘法交叉项；它是近似，不是题目要求的精确结果。' },
      { value: 35, diagnosis: '35bp是题设直接A/B路径成本，不是10bp和20bp两条载体腿合成后的有效成本。' },
    ], sourceIds: sources('C3'), scope: scope('C3'),
  },
  {
    id: '4', labId: 'C3', title: '比较最终交付而不是兑换腿数',
    question: '起始名义额1000000，直接成本35bp，载体两腿10bp和20bp；载体路径相对直接路径多交付多少？',
    unit: 'SYN金额', resultKey: 'vehicleDeliveryAdvantage', correct: numericResult('C3', 'vehicleDeliveryAdvantage'), correctIndex: 0,
    explanation: '直接交付996500；载体交付1000000×0.999×0.998=997002，所以载体多交付502。两腿并不因腿数更多而机械更贵。',
    wrong: [
      { value: 500, diagnosis: '500使用35−(10+20)=5bp的加法近似再乘名义额，漏掉两腿乘法中的0.02bp，故少算2。' },
      { value: 2998, diagnosis: '2998是载体路径自身相对1000000的损失，不是载体与直接路径最终交付量之间的差额。' },
    ], sourceIds: sources('C3'), scope: scope('C3'),
  },
  {
    id: '5', labId: 'C4', title: '核心币参与额来自所有相连货币对',
    question: 'AB/AC/AD/AE/BC成交额为45/25/15/5/10，总成交100；仅求FX-A币种份额。',
    unit: '%（一侧参与份额）', resultKey: 'currencyASharePct', correct: numericResult('C4', 'currencyASharePct'), correctIndex: 1,
    explanation: 'FX-A参与AB、AC、AD、AE四条边，参与额45+25+15+5=90；除以总成交100得到90%。',
    wrong: [
      { value: 45, diagnosis: '45%只取AB一条边，遗漏FX-A在AC、AD和AE三条交易中的币种腿。' },
      { value: 100, diagnosis: '100%把FX-A误当成每笔交易必然出现。题设BC=10不含A，因此A参与额是90而非总成交100。' },
    ], sourceIds: sources('C4'), scope: scope('C4'),
  },
  {
    id: '6', labId: 'C4', title: 'FX币种份额不是普通100%构成',
    question: '沿用五条货币对，五种币种的一侧参与份额合计多少？',
    unit: '%（五币种份额合计）', resultKey: 'currencyShareSumPct', correct: numericResult('C4', 'currencyShareSumPct'), correctIndex: 2,
    explanation: '每笔FX交易同时涉及两种币，各货币参与额合计为2×总成交；所以份额精确合计200%，不应重新归一化到100%。',
    wrong: [
      { value: 100, diagnosis: '100%套用了单一构成表的普通分母，却删除了每笔FX交易的第二条币种腿。' },
      { value: 500, diagnosis: '500%假定五种币各自都占全部成交；实际各币份额由与它相连的货币对参与额决定。' },
    ], sourceIds: sources('C4'), scope: scope('C4'),
  },
  {
    id: '7', labId: 'C5', title: '毛新发行必须扣除同期偿还',
    question: '期初存量1000、毛新发行300、偿还280，且估值变化冻结为0；仅求净新流量。',
    unit: 'SYN金额', resultKey: 'netNewFlow', correct: numericResult('C5', 'netNewFlow'), correctIndex: 0,
    explanation: '净新流量=300−280=20。300是毛新发行，580是发行加偿还的毛活动；两者都不是净存量增量。',
    wrong: [
      { value: 300, diagnosis: '300只记录新发行，忽略同一期间到期与偿还280；它是毛流入而不是净新流量。' },
      { value: 580, diagnosis: '580=300+280衡量双向毛活动，把偿还也按正号加入；净流量必须保留相反方向。' },
    ], sourceIds: sources('C5'), scope: scope('C5'),
  },
  {
    id: '8', labId: 'C5', title: '期末存量不是本期新流量',
    question: '沿用期初1000、发行300、偿还280且估值为0；仅求期末存量。',
    unit: 'SYN金额（期末存量）', resultKey: 'closingStock', correct: numericResult('C5', 'closingStock'), correctIndex: 1,
    explanation: '期末存量=1000+300−280=1020。20是期间变化，不能把变化量直接当成期末水平。',
    wrong: [
      { value: 1300, diagnosis: '1300只把毛新发行加到期初存量，漏掉同期偿还280，因此没有完成从期初到期末的完整交易桥。' },
      { value: 20, diagnosis: '20是期末减期初所得的净变化，不是包含既有合同的期末存量水平；它缺少期初已有的1000。' },
    ], sourceIds: sources('C5'), scope: scope('C5'),
  },
  {
    id: '9', labId: 'C6', title: '零交易不等于零储备变化',
    question: 'R-A持有60且汇率1.00→1.20；R-B持有80且汇率0.50→0.45；交易贡献为0，仅求总估值变化。',
    unit: 'SYN报告货币', resultKey: 'totalValuationChange', correct: numericResult('C6', 'totalValuationChange'), correctIndex: 2,
    explanation: 'R-A贡献60×0.20=+12，R-B贡献80×(−0.05)=−4，总估值变化+8；期末总值108是水平而非变化。',
    wrong: [
      { value: 12, diagnosis: '12只保留R-A升值贡献，遗漏R-B汇率下降带来的−4。储备组合估值必须合计全部给定币种。' },
      { value: 108, diagnosis: '108是期末储备报告价值。题目问估值变化，应以期末108减期初100得到8。' },
    ], sourceIds: sources('C6'), scope: scope('C6'),
  },
  {
    id: '10', labId: 'C7', title: '迟滞带保留历史，阈值仍允许逆转',
    question: '初态外围、进入阈值60、退出阈值40，六期分数50/65/55/35/55/65；状态共切换几次？',
    unit: '次（SYN状态切换）', resultKey: 'switchCount', correct: numericResult('C7', 'switchCount'), correctIndex: 0,
    explanation: '第2期进入核心、第4期退出、第6期再次进入，共3次。第3期和第5期同为55，却因先前状态不同分别保留核心和外围。',
    wrong: [
      { value: 2, diagnosis: '2只数一次进入和一次退出，遗漏第6期65再次跨过进入阈值所产生的第二次进入。' },
      { value: 1, diagnosis: '1只比较初态外围与终态核心的净差，抹掉期间先进入、再退出、再进入的完整路径。' },
    ], sourceIds: sources('C7'), scope: scope('C7'),
  },
];

export function internationalMonetaryOptions(scenario: ImsScenario): readonly Readonly<{
  id: 'A' | 'B' | 'C';
  value: number;
  correct: boolean;
  diagnosis: string;
}>[] {
  let wrongIndex = 0;
  return (['A', 'B', 'C'] as const).map((id, index) => index === scenario.correctIndex
    ? { id, value: scenario.correct, correct: true, diagnosis: `正确推理：${scenario.explanation}` }
    : { id, value: scenario.wrong[wrongIndex].value, correct: false, diagnosis: `这条路径错在哪里：${scenario.wrong[wrongIndex++].diagnosis}` });
}

function inputValueText(value: unknown): string {
  if (typeof value === 'number') return imsNumber(value);
  if (value === 'KEEP_SEPARATE') return '逐护照保留，不直接平均';
  if (typeof value === 'string') return value;
  throw Error('固定题输入只接受有限数或声明枚举。');
}

export function internationalMonetaryScenarioInputText(scenario: ImsScenario): string {
  const lab = labFor(scenario.labId);
  return lab.fields.map(field => `${field.label} = ${inputValueText(lab.initial[field.key])}`).join('；');
}

export const internationalMonetaryScenarioAudit = [
  {
    key: 'ten shared M/K questions each have one correct and two distinct finite numeric paths',
    passed: internationalMonetaryScenarios.length === 10
      && new Set(internationalMonetaryScenarios.map(scenario => scenario.id)).size === 10
      && internationalMonetaryScenarios.every(scenario => {
        const options = internationalMonetaryOptions(scenario);
        return options.length === 3 && options.filter(option => option.correct).length === 1
          && new Set(options.map(option => option.value)).size === 3
          && options.every(option => Number.isFinite(option.value) && option.diagnosis.length >= 45);
      }),
  },
  {
    key: 'all questions retain the full parent-lab fixed input passport unit and source identity',
    passed: internationalMonetaryScenarios.every(scenario => {
      const lab = labFor(scenario.labId);
      const inputText = internationalMonetaryScenarioInputText(scenario);
      return scenario.unit.length > 0 && scenario.scope === lab.passport
        && scenario.sourceIds.join('|') === lab.sourceIds.join('|')
        && lab.fields.every(field => inputText.includes(`${field.label} = ${inputValueText(lab.initial[field.key])}`));
    }),
  },
  {
    key: 'correct positions are balanced 4/3/3 and all authored correct values equal canonical evaluators',
    passed: [0, 1, 2].map(index => internationalMonetaryScenarios.filter(scenario => scenario.correctIndex === index).length).join('/') === '4/3/3'
      && internationalMonetaryScenarios.every(scenario => scenario.correct === numericResult(scenario.labId, scenario.resultKey)),
  },
  {
    key: 'coverage includes passports 200-percent flow-stock valuation and hysteresis without reality certification',
    passed: internationalMonetaryScenarios[1].question.includes('可直接平均')
      && internationalMonetaryScenarios[5].correct === 200
      && internationalMonetaryScenarios[6].labId === 'C5'
      && internationalMonetaryScenarios[8].labId === 'C6'
      && internationalMonetaryScenarios[9].labId === 'C7'
      && internationalMonetaryScenarios.every(scenario => scenario.scope.includes('独立SYN') || scenario.scope.includes('同一虚构候选货币')),
  },
] as const;
