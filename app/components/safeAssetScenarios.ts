import { safeAssetCanonicalInputs, safeAssetEvaluators } from './safeAssetFixtures';
import type { SafeAssetLabId } from './safeAssetFixtures';
import { safeAssetLabs, safeAssetNumber } from './safeAssetLabDefinitions';

type WrongPath = Readonly<{ value: number; diagnosis: string }>;

export type SafeAssetScenario = Readonly<{
  id: '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | '11' | '12';
  labId: SafeAssetLabId;
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

function labFor(id: SafeAssetLabId) {
  const lab = safeAssetLabs.find(candidate => candidate.id === id);
  if (!lab) throw Error(`固定题缺少实验定义：${id}`);
  return lab;
}

function numericResult(id: SafeAssetLabId, key: string): number {
  const evaluator = safeAssetEvaluators[id] as (input: unknown) =>
    | Readonly<{ status: 'STOP'; reason: string }>
    | Readonly<{ status: 'OK'; value: Readonly<Record<string, unknown>> }>;
  const result = evaluator(safeAssetCanonicalInputs[id]);
  if (result.status === 'STOP' || typeof result.value[key] !== 'number' || !Number.isFinite(result.value[key]) || Object.is(result.value[key], -0)) {
    throw Error(`固定题必须取得有限且非负零的数值结果：${id}.${key}`);
  }
  return result.value[key];
}

function sources(id: SafeAssetLabId): readonly number[] { return labFor(id).sourceIds; }
function scope(id: SafeAssetLabId): string { return labFor(id).passport; }

export const safeAssetScenarios: readonly SafeAssetScenario[] = [
  {
    id: '1', labId: 'C1', title: '安全不是一维标签',
    question: '默认服务向量明确保留多少个相互独立的维度？',
    unit: '个（独立SYN维度）', resultKey: 'independentDimensionCount', correct: numericResult('C1', 'independentDimensionCount'), correctIndex: 0,
    explanation: '答案为6：信用安全、名义价格稳定、市场流动性、法律与操作可达、抵押品可用、坏状态表现。程序不生成第七个综合“安全分”。',
    wrong: [
      { value: 4, diagnosis: '4只是默认压力干预用途的优先维度数量，不能删除仍然存在的信用和抵押品两维。' },
      { value: 1, diagnosis: '1把六项服务压成永久“安全/不安全”标签，正是本实验禁止的维度坍缩。' },
    ], sourceIds: sources('C1'), scope: scope('C1'),
  },
  {
    id: '2', labId: 'C1', title: '用途—状态选择关注维度',
    question: '默认“干预×压力状态”上下文中，程序标出多少个优先服务维度？',
    unit: '个（优先维度）', resultKey: 'priorityDimensionCount', correct: numericResult('C1', 'priorityDimensionCount'), correctIndex: 1,
    explanation: '压力干预优先关注名义价格稳定、市场流动性、法律与操作可达及坏状态表现，共4维；全部六维仍被保留。',
    wrong: [
      { value: 2, diagnosis: '2对应默认规则下的常态干预优先集合，不是题目给定的压力状态。' },
      { value: 6, diagnosis: '6是完整服务向量维数；优先集合只是当前用途—状态下先看的维度，二者不能混称。' },
    ], sourceIds: sources('C1'), scope: scope('C1'),
  },
  {
    id: '3', labId: 'C3', title: '便利收益先匹配再求差',
    question: '六项匹配均通过，比较资产4.75%、服务资产4.55%；匹配后便利收益候选是多少？',
    unit: 'bp（SYN匹配收益楔子）', resultKey: 'convenienceYieldBps', correct: numericResult('C3', 'convenienceYieldBps'), correctIndex: 2,
    explanation: '4.75%−4.55%=0.20个百分点，而1个百分点=100bp，所以候选便利收益为20bp。',
    wrong: [
      { value: 0.2, diagnosis: '0.2是百分点差的数值写法；题目要求bp，必须再乘100，不能混用两种单位。' },
      { value: 4.75, diagnosis: '4.75是比较资产本身的收益率水平，不是两个已匹配资产之间的服务价格楔子。' },
    ], sourceIds: sources('C3'), scope: scope('C3'),
  },
  {
    id: '4', labId: 'C3', title: '六道匹配门缺一不可',
    question: '默认结果显示多少个关键匹配维度全部通过？',
    unit: '项（匹配维度）', resultKey: 'matchedDimensionCount', correct: numericResult('C3', 'matchedDimensionCount'), correctIndex: 0,
    explanation: '币种、期限、现金流、信用、税和套保成本共6项全部MATCH；任一项MISMATCH都会STOP而非降格算一个“近似纯”便利收益。',
    wrong: [
      { value: 5, diagnosis: '5意味着至少一项仍污染收益差；程序此时必须STOP，不能继续保留便利收益数值。' },
      { value: 1, diagnosis: '1只把“收益率”看作一个匹配对象，忽略收益差背后的六类不可互换风险与成本。' },
    ], sourceIds: sources('C3'), scope: scope('C3'),
  },
  {
    id: '5', labId: 'C5', title: '先重建毛市场价值',
    question: '单位市价100.25、数量1000；在资格、可用性与haircut之前，毛市场价值是多少？',
    unit: 'SYN金额', resultKey: 'grossMarketValue', correct: numericResult('C5', 'grossMarketValue'), correctIndex: 1,
    explanation: '毛市场价值=P×Q=100.25×1000=100250。比例过滤发生在这个入口值之后。',
    wrong: [
      { value: 1_000, diagnosis: '1000只是资产数量，遗漏每单位100.25的价格；数量与价值不能交换单位。' },
      { value: 100.25, diagnosis: '100.25只是单位价格，遗漏1000单位数量；它不是整批抵押品毛价值。' },
    ], sourceIds: sources('C5'), scope: scope('C5'),
  },
  {
    id: '6', labId: 'C5', title: '资格、可用性与haircut连乘',
    question: '毛价值100250、资格90%、可用80%、haircut 5%；最终现金能力是多少？',
    unit: 'SYN现金能力', resultKey: 'cashCapacity', correct: numericResult('C5', 'cashCapacity'), correctIndex: 2,
    explanation: '100250×0.90×0.80×0.95=68571。资格、可用性和haircut分别承担不同过滤任务。',
    wrong: [
      { value: 72_180, diagnosis: '72180只做到资格90%和可用80%，尚未扣除5% haircut，因此是倒数第二层。' },
      { value: 3_609, diagnosis: '3609是haircut从72180中扣掉的金额，不是haircut之后可获得的现金能力。' },
    ], sourceIds: sources('C5'), scope: scope('C5'),
  },
  {
    id: '7', labId: 'C6', title: 'Qeff是四层留存的乘积',
    question: '毛余额1000依次乘80%、90%、75%、80%；市场承接后的Qeff是多少？',
    unit: 'SYN有效容量', resultKey: 'qEff', correct: numericResult('C6', 'qEff'), correctIndex: 0,
    explanation: '1000→800→720→540→432；每一层以紧接前一层为基数，不能把四个损失百分比直接相加。',
    wrong: [
      { value: 540, diagnosis: '540是未质押且操作可达后的倒数第二层，尚未施加80%的市场承接比例。' },
      { value: 800, diagnosis: '800只经过第一层可提供比例，忽略资格、未占用可达与市场承接三层。' },
    ], sourceIds: sources('C6'), scope: scope('C6'),
  },
  {
    id: '8', labId: 'C6', title: '毛余额与Qeff之间是容量损耗',
    question: '沿用毛余额1000与Qeff 432；总容量损耗是多少？',
    unit: 'SYN容量', resultKey: 'totalCapacityLoss', correct: numericResult('C6', 'totalCapacityLoss'), correctIndex: 1,
    explanation: '总损耗=1000−432=568。它是四层过滤的合计，不是任一单层的官方估计。',
    wrong: [
      { value: 432, diagnosis: '432是漏斗终点的有效容量，而不是从入口到终点被过滤掉的部分。' },
      { value: 1_000, diagnosis: '1000是毛余额入口；若把它称为损耗，就等于假定有效容量为0，与题设432冲突。' },
    ], sourceIds: sources('C6'), scope: scope('C6'),
  },
  {
    id: '9', labId: 'C7', title: '数量增加不保证有效服务增加',
    question: '默认当前发行量140、深度服务100%、可信服务40%；有效安全服务容量是多少？',
    unit: 'SYN有效服务容量', resultKey: 'effectiveSafeCapacity', correct: numericResult('C7', 'effectiveSafeCapacity'), correctIndex: 2,
    explanation: '绑定条件取两者较低的40%，所以140×0.40=56。不能只因为深度达到100%就忽略可信服务约束。',
    wrong: [
      { value: 40, diagnosis: '40是每单位资产的绑定服务百分比，不是乘上140发行量后的总有效容量。' },
      { value: 140, diagnosis: '140把每单位服务当成100%，忽略可信服务仅40%已成为绑定约束。' },
    ], sourceIds: sources('C7'), scope: scope('C7'),
  },
  {
    id: '10', labId: 'C7', title: '离散图示峰值不是政策最优',
    question: '在固定0、20、…、200的SYN网格上，有效服务容量最大点的发行量横坐标是多少？',
    unit: 'SYN发行单位（离散图示）', resultKey: 'illustrativeGridPeakQuantity', correct: numericResult('C7', 'illustrativeGridPeakQuantity'), correctIndex: 0,
    explanation: '固定网格上Q=100时容量100最高；Q=120已降至84。这个数只属于作者曲线和网格，不是现实阈值或最优发行。',
    wrong: [
      { value: 120, diagnosis: '120处容量已受可信服务侵蚀降至84，不是固定网格的最高容量点。' },
      { value: 140, diagnosis: '140只是默认当前输入点，容量为56；当前点不自动等于曲线峰值。' },
    ], sourceIds: sources('C7'), scope: scope('C7'),
  },
  {
    id: '11', labId: 'C8', title: '币种总额桥先闭合',
    question: '期初1000，加本金交易80、收益10、FX −20、价格15、覆盖5；期末币种总市场价值是多少？',
    unit: 'SYN币种市场价值', resultKey: 'closingCurrencyValue', correct: numericResult('C8', 'closingCurrencyValue'), correctIndex: 1,
    explanation: '1000+80+10−20+15+5=1090。这个聚合终点仍没有告诉我们其中债券的数量。',
    wrong: [
      { value: 90, diagnosis: '90只是五个期间桥项合计的变化量，不含期初已有的1000存量。' },
      { value: 1_000, diagnosis: '1000是期初存量；忽略五个桥项就无法到达题设期末市场价值。' },
    ], sourceIds: sources('C8'), scope: scope('C8'),
  },
  {
    id: '12', labId: 'C8', title: '同一聚合总额容纳不同债券数量',
    question: '路径A债券数量500，路径B债券数量300，且两条路径都精确闭合1090；数量差是多少？',
    unit: 'SYN债券单位', resultKey: 'bondQuantityDifference', correct: numericResult('C8', 'bondQuantityDifference'), correctIndex: 2,
    explanation: '数量差=|500−300|=200。币种总额相等并没有让两个数量收敛，因此特定债券数量仍未识别。',
    wrong: [
      { value: 500, diagnosis: '500是路径A自己的数量，不是两条等价路径之间的数量差，也没有理由从聚合总额选择A。' },
      { value: 300, diagnosis: '300是路径B自己的数量；聚合总额同样无法优先选择B，所以它不是可识别差额。' },
    ], sourceIds: sources('C8'), scope: scope('C8'),
  },
];

export function safeAssetOptions(scenario: SafeAssetScenario): readonly Readonly<{
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
  if (typeof value === 'number') return safeAssetNumber(value);
  const labels: Readonly<Record<string, string>> = Object.freeze({
    INTERVENTION: '干预/紧急支付', COLLATERAL_FUNDING: '抵押融资', VALUE_PARKING: '价值停放',
    NORMAL: '常态', STRESS: '压力状态', MATCH: '已匹配', MISMATCH: '未匹配',
  });
  if (typeof value === 'string') return labels[value] ?? value;
  throw Error('固定题输入只接受有限数或声明枚举。');
}

export function safeAssetScenarioInputText(scenario: SafeAssetScenario): string {
  const lab = labFor(scenario.labId);
  return lab.fields.map(field => `${field.label} = ${inputValueText(lab.initial[field.key])}`).join('；');
}

export const safeAssetScenarioAudit = [
  {
    key: 'twelve shared scenarios each have exactly one correct and two distinct finite paths',
    passed: safeAssetScenarios.length === 12
      && new Set(safeAssetScenarios.map(scenario => scenario.id)).size === 12
      && safeAssetScenarios.every(scenario => {
        const options = safeAssetOptions(scenario);
        return options.length === 3 && options.filter(option => option.correct).length === 1
          && new Set(options.map(option => option.value)).size === 3
          && options.every(option => Number.isFinite(option.value) && !Object.is(option.value, -0) && option.diagnosis.length >= 38);
      }),
  },
  {
    key: 'all scenarios retain parent-lab complete fixed input passport source and unit identities',
    passed: safeAssetScenarios.every(scenario => {
      const lab = labFor(scenario.labId);
      const inputText = safeAssetScenarioInputText(scenario);
      return scenario.unit.length > 0 && scenario.scope === lab.passport
        && scenario.sourceIds.join('|') === lab.sourceIds.join('|')
        && lab.fields.every(field => inputText.includes(`${field.label} = ${inputValueText(lab.initial[field.key])}`));
    }),
  },
  {
    key: 'correct positions are balanced four-four-four and all correct values come from canonical evaluators',
    passed: [0, 1, 2].map(index => safeAssetScenarios.filter(scenario => scenario.correctIndex === index).length).join('/') === '4/4/4'
      && safeAssetScenarios.every(scenario => scenario.correct === numericResult(scenario.labId, scenario.resultKey)),
  },
  {
    key: 'each of six mechanisms has two fixed checks without importing observed or policy claims',
    passed: (['C1', 'C3', 'C5', 'C6', 'C7', 'C8'] as const).every(id => safeAssetScenarios.filter(scenario => scenario.labId === id).length === 2)
      && safeAssetScenarios.every(scenario => scenario.scope.includes('独立SYN')),
  },
] as const;

if (!safeAssetScenarioAudit.every(item => item.passed)) {
  throw new Error(`4.03 scenario gate failed: ${safeAssetScenarioAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
