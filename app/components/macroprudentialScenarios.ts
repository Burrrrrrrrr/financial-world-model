import { macroCanonicalInputs, macroEvaluators } from './macroprudentialFixtures';
import type { MacroLabId } from './macroprudentialFixtures';
import { macroNumber, macroprudentialLabs } from './macroprudentialLabDefinitions';

type WrongPath = Readonly<{ value: number; diagnosis: string }>;

export type MacroprudentialScenario = Readonly<{
  id: string;
  labId: MacroLabId;
  title: string;
  question: string;
  unit: string;
  resultKey: string;
  correct: number;
  correctIndex: 0 | 1 | 2;
  explanation: string;
  wrong: readonly [WrongPath, WrongPath];
  sourceIds: readonly number[];
}>;

function numericResult(id: MacroLabId, key: string): number {
  const result = macroEvaluators[id](macroCanonicalInputs[id]);
  if (result.status === 'STOP' || typeof result.value[key] !== 'number') {
    throw Error(`固定题必须取得数值结果：${id}.${key}`);
  }
  return result.value[key];
}

export const macroprudentialScenarios: readonly MacroprudentialScenario[] = [
  {
    id: '1', labId: 'C2', title: '系统性风险不是一项资产下跌的别名',
    question: '五家银行各卖2单位共同资产，线性总冲击500bp后，仅求每家剩余持仓按市值后的权益。', unit: 'SYN金额', resultKey: 'equityAfter',
    correct: numericResult('C2', 'equityAfter'), correctIndex: 0,
    explanation: '系统出售10单位使价格从100到95；每家余18单位，余量损失18×5=90，权益1000−90=910。个体取得现金与系统权益下降可并存，但这仍不是现实危机判定。',
    wrong: [
      { value: 1000, diagnosis: '1000保留了出售前权益，遗漏同步出售对每家剩余共同持仓的市值损失。只看单家取得现金会错过系统反馈。' },
      { value: 800, diagnosis: '800把每家按题设出售前价取得的200现金直接从权益扣除；出售是资产换现金，不是同额损失，真正题设损失来自余量跌价90。' },
    ], sourceIds: [1, 2],
  },
  {
    id: '2', labId: 'C1', title: '利率工具与定向工具的目标域',
    question: '两个方案令目标部门都变化−100bp；仅求定向方案目标变化减利率方案目标变化。', unit: 'bp', resultKey: 'sameTargetHitBp',
    correct: numericResult('C1', 'sameTargetHitBp'), correctIndex: 1,
    explanation: '−100−(−100)=0bp，说明两方案在这个题设的近端目标命中相同；差异出现在非目标影响，不构成现实最优性证明。',
    wrong: [
      { value: -100, diagnosis: '−100是任一方案自身的目标部门变化，不是两个方案的差。它漏掉第二个−100，偷换了所求对象。' },
      { value: 75, diagnosis: '75是两个非目标影响绝对值80与5的差，单位仍是bp；它不是目标部门两方案之差。' },
    ], sourceIds: [1, 2, 6],
  },
  {
    id: '3', labId: 'C2', title: '横截面共同暴露与同步出售',
    question: '五家银行各卖2单位，系统每卖一单位冲击50bp；仅求题设总价格跌幅。', unit: 'bp', resultKey: 'priceDropBp',
    correct: numericResult('C2', 'priceDropBp'), correctIndex: 2,
    explanation: '同步出售量5×2=10，再乘50bp得到500bp。这个结果依赖题设共同资产、同步行为和线性深度，不是金融周期的普适系数。',
    wrong: [
      { value: 100, diagnosis: '100=2×50只计算一家出售，遗漏其他四家同向行动；这正是把个体判断误当系统结果。' },
      { value: 50, diagnosis: '50只是每一系统出售单位的题设冲击系数，没有乘以10单位总出售量。参数不是结果。' },
    ], sourceIds: [1, 2],
  },
  {
    id: '4', labId: 'C3', title: '实际资本、监管要求与可释放缓冲',
    question: '损失后CET1率900bp，释放200bp使监管阈值由900降到700bp；仅求释放后的监管headroom。', unit: 'bp of RWA', resultKey: 'regulatoryHeadroomAfterReleaseBp',
    correct: numericResult('C3', 'regulatoryHeadroomAfterReleaseBp'), correctIndex: 0,
    explanation: '释放后headroom=900−700=200bp。释放改变阈值，没有把实际CET1从900抬回1200，也不保证银行实际使用空间。',
    wrong: [
      { value: 0, diagnosis: '0是冲击后、释放前900−900的headroom。题目已经显式释放200bp，不能把释放前状态带到释放后。' },
      { value: 300, diagnosis: '300是冲击前实际率1200减释放前监管阈值900的headroom；它混入冲击前资本，不回答损失和释放后的状态。' },
    ], sourceIds: [2, 3, 4, 5],
  },
  {
    id: '5', labId: 'C4', title: 'LTV与DSTI有不同分母',
    question: '贷款800、冲击后抵押品800；仅求冲击后LTV。同期DSTI使用另一组收入与债务服务。', unit: '%', resultKey: 'ltvAfterPercent',
    correct: numericResult('C4', 'ltvAfterPercent'), correctIndex: 1,
    explanation: 'LTV=800/800=100%。DSTI=96/160=60%回答现金流负担的另一问题；两个门可以同时收紧，但不能互换分母。',
    wrong: [
      { value: 60, diagnosis: '60%=96/160是冲击后DSTI，把年度债务服务和收入拿来替代贷款与抵押品，分母对象错了。' },
      { value: 80, diagnosis: '80%=800/1000是冲击前LTV；题目指定冲击后抵押品800，沿用旧估值漏掉价格变化。' },
    ], sourceIds: [2, 3, 4, 6],
  },
  {
    id: '6', labId: 'C1', title: '总量工具与定向工具的非目标影响',
    question: '利率方案非目标影响绝对值80bp，定向方案为5bp；仅求题设非目标影响缩减比例。', unit: '%', resultKey: 'stipulatedSpilloverReductionPercent',
    correct: numericResult('C1', 'stipulatedSpilloverReductionPercent'), correctIndex: 2,
    explanation: '(80−5)/80=93.75%。这是给定响应的算术，不是任何真实工具的平均效果、福利排名或对规避的净效果。',
    wrong: [
      { value: 75, diagnosis: '75=80−5保留的是bp差，没有除以利率方案的80bp基准；它是幅度差，不是百分比缩减。' },
      { value: 6.25, diagnosis: '6.25%=5/80是定向方案剩余影响占原影响的比例；题目求缩减比例，须再用100%减去它。' },
    ], sourceIds: [1, 2, 6],
  },
  {
    id: '7', labId: 'C5', title: '资本充足与流动性错配',
    question: 'HQLA 120，30日流出200、合资格流入50且未触及75%上限；仅求简化LCR。', unit: '%', resultKey: 'simplifiedLcrPercent',
    correct: numericResult('C5', 'simplifiedLcrPercent'), correctIndex: 0,
    explanation: '净流出=200−50=150，简化LCR=120/150=80%。另给资本率12%不进入这项现金流分数，也不能修补期限错配。',
    wrong: [
      { value: 60, diagnosis: '60%=120/200直接用毛流出，遗漏题设允许的50合资格流入；所求分母是简化净流出。' },
      { value: 12, diagnosis: '12%是另给资本率，回答损失吸收分母而不是30日现金流覆盖；资本与流动性不能互换。' },
    ], sourceIds: [1, 2, 3],
  },
  {
    id: '8', labId: 'C3', title: '释放监管阈值不等于创造实际资本',
    question: '本题显式释放200bp CCyB但没有注资；仅求释放本身创造的CET1金额。', unit: 'SYN金额', resultKey: 'capitalCreatedByRelease',
    correct: numericResult('C3', 'capitalCreatedByRelease'), correctIndex: 1,
    explanation: '释放只降低监管阈值，创造资本为0。是否释放、何时释放以及银行是否使用属于规则、判断与行为的后续问题。',
    wrong: [
      { value: 200, diagnosis: '200是释放的bp幅度，不是CET1金额；把阈值单位直接改名成资本存量，违反单位与对象合同。' },
      { value: 300, diagnosis: '300是题设冲击损失金额。释放没有倒转损失，也没有把资本从900恢复到1200。' },
    ], sourceIds: [2, 3, 4, 5],
  },
  {
    id: '9', labId: 'C7', title: '朴素前后比较不等因果',
    question: '政策对象增速从1200bp降到700bp；仅求朴素前后差，不赋予因果身份。', unit: 'bp', resultKey: 'naiveBeforeAfterBp',
    correct: numericResult('C7', 'naiveBeforeAfterBp'), correctIndex: 2,
    explanation: '700−1200=−500bp。相对题设无政策反事实是−800bp，SYN双重差分是−700bp；不同estimand不同，三者都未自动通过识别门。',
    wrong: [
      { value: -800, diagnosis: '−800=700−1500使用了题设无政策事后反事实；这是反事实差，不是最朴素的本组前后差。' },
      { value: -700, diagnosis: '−700是朴素差−500再减对照变化+200的SYN双重差分；题目未要求对照调整。' },
    ], sourceIds: [2, 4, 6],
  },
  {
    id: '10', labId: 'C6', title: '国内、非银与跨境泄漏',
    question: '银行−200、非银+120、外国分行+40、离岸直接+30；仅求已测渠道的系统净变化。', unit: 'SYN金额', resultKey: 'measuredSystemChange',
    correct: numericResult('C6', 'measuredSystemChange'), correctIndex: 0,
    explanation: '−200+120+40+30=−10。未测渠道未观察，因此−10只是已测净变化，不能改名为完整系统效果或因果泄漏。',
    wrong: [
      { value: -200, diagnosis: '−200只保留受约束银行渠道，遗漏非银、外国分行和离岸直接借款的190抵消；这正是范围泄漏问题。' },
      { value: 0, diagnosis: '0把未观察渠道误填成恰好完全抵消，或把接近闭合改成闭合。unknown不是0，已测算术也明确为−10。' },
    ], sourceIds: [2, 4, 7],
  },
];

export function macroprudentialOptions(scenario: MacroprudentialScenario): readonly Readonly<{
  id: 'A' | 'B' | 'C'; value: number; correct: boolean; diagnosis: string;
}>[] {
  let wrongIndex = 0;
  return (['A', 'B', 'C'] as const).map((id, index) => index === scenario.correctIndex
    ? { id, value: scenario.correct, correct: true, diagnosis: `正确推理：${scenario.explanation}` }
    : { id, value: scenario.wrong[wrongIndex].value, correct: false, diagnosis: `这条路径错在哪里：${scenario.wrong[wrongIndex++].diagnosis}` });
}

export function macroprudentialScenarioInputText(scenario: MacroprudentialScenario): string {
  const lab = macroprudentialLabs.find(candidate => candidate.id === scenario.labId);
  if (!lab) throw Error(`题目缺少实验护照：${scenario.labId}`);
  return lab.fields.map(field => `${field.label} = ${macroNumber(lab.initial[field.key])}`).join('；');
}

export const macroprudentialScenarioAudit = [
  {
    key: 'ten fixed independent M/K questions each have one correct and two distinct numeric wrong paths',
    passed: macroprudentialScenarios.length === 10
      && new Set(macroprudentialScenarios.map(scenario => scenario.id)).size === 10
      && macroprudentialScenarios.every(scenario => {
        const options = macroprudentialOptions(scenario);
        return options.length === 3
          && options.filter(option => option.correct).length === 1
          && new Set(options.map(option => option.value)).size === 3
          && options.every(option => Number.isFinite(option.value));
      }),
  },
  {
    key: 'all questions retain the full parent-lab default input passport, unit and three complete diagnoses',
    passed: macroprudentialScenarios.every(scenario => scenario.unit.length > 0
      && macroprudentialScenarioInputText(scenario).length > 100
      && macroprudentialOptions(scenario).every(option => option.diagnosis.length >= 45)),
  },
  {
    key: 'correct positions are balanced 4/3/3 and no question claims causal or production approval',
    passed: [0, 1, 2].map(index => macroprudentialScenarios.filter(scenario => scenario.correctIndex === index).length).join('/') === '4/3/3'
      && macroprudentialScenarios.every(scenario => !scenario.explanation.includes('已识别因果') && !scenario.explanation.includes('生产可用')),
  },
  {
    key: 'question titles name the mechanism actually tested rather than adjacent teaching topics',
    passed: macroprudentialScenarios[2].title === '横截面共同暴露与同步出售'
      && macroprudentialScenarios[5].title === '总量工具与定向工具的非目标影响'
      && macroprudentialScenarios[7].title === '释放监管阈值不等于创造实际资本',
  },
] as const;
