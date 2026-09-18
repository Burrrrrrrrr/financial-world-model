import { bopCanonicalInputs, bopEvaluators } from './balanceOfPaymentsFixtures';
import type { BopLabId } from './balanceOfPaymentsFixtures';
import { balanceOfPaymentsLabs, bopNumber } from './balanceOfPaymentsLabDefinitions';

type WrongPath = Readonly<{ value: number; diagnosis: string }>;
export type BopScenario = Readonly<{
  id: string; labId: BopLabId; title: string; question: string; unit: string; resultKey: string;
  correct: number; correctIndex: 0 | 1 | 2; explanation: string;
  wrong: readonly [WrongPath, WrongPath]; sourceIds: readonly number[];
}>;

function numericResult(id: BopLabId, key: string): number {
  const result = bopEvaluators[id](bopCanonicalInputs[id]);
  if (result.status === 'STOP' || typeof result.value[key] !== 'number') throw Error(`固定题必须取得数值结果：${id}.${key}`);
  return result.value[key];
}

export const balanceOfPaymentsScenarios: readonly BopScenario[] = [
  {
    id: '1', labId: 'C1', title: '出口与金融对项不是两份收入',
    question: '货物出口credit 120，居民取得境外存款80与贸易信贷40；仅求单笔复式缺口。', unit: 'SYN金额', resultKey: 'entryGap',
    correct: numericResult('C1', 'entryGap'), correctIndex: 0,
    explanation: '金融对项debits=80+40=120，所以缺口=120−120=0。货物腿与金融腿是同一交易的对应记录，不是两份国民收入。',
    wrong: [
      { value: 120, diagnosis: '120只保留出口credit，没有扣除等额金融资产取得；它是单边项目，不是复式缺口。' },
      { value: 80, diagnosis: '80只取境外存款，对40贸易信贷视而不见；对项可以由多个金融工具共同组成。' },
    ], sourceIds: [1],
  },
  {
    id: '2', labId: 'C2', title: '经常账户不是货物余额',
    question: '把货物、服务、earned income与transfer income的revenue和expenditure全部纳入；仅求CAB。', unit: 'SYN金额', resultKey: 'currentAccountBalance',
    correct: numericResult('C2', 'currentAccountBalance'), correctIndex: 1,
    explanation: '经常账户revenue=690、expenditure=650，CAB=40。货物余额80只是其中一项，不能替代完整经常账户。',
    wrong: [
      { value: 80, diagnosis: '80=500−420只算货物，遗漏服务−20、earned income−30和transfer income+10。' },
      { value: 45, diagnosis: '45=CAB40+KAB5，把资本账户加进来后得到净借贷，而题目只问经常账户余额。' },
    ], sourceIds: [1, 2],
  },
  {
    id: '3', labId: 'C2', title: '统计差异必须显式保留',
    question: '题设CAB=40、KAB=5、FAB=55；按D=FAB−(CAB+KAB)仅求统计差异。', unit: 'SYN金额', resultKey: 'statisticalDiscrepancy',
    correct: numericResult('C2', 'statisticalDiscrepancy'), correctIndex: 2,
    explanation: 'D=55−(40+5)=10。它定位两种净借贷估计未闭合，不会自动告诉我们遗漏发生在哪个账户。',
    wrong: [
      { value: -10, diagnosis: '−10采用相反定义(CAB+KAB)−FAB；题目已冻结BPM7教学合同D=FAB−(CAB+KAB)。' },
      { value: 0, diagnosis: '0用概念恒等式强行覆盖实测差额；现实来源不完美时应单列统计差异，而不是改写原数。' },
    ], sourceIds: [1, 4],
  },
  {
    id: '4', labId: 'C3', title: '资产腿与负债腿分别净额化',
    question: '资产取得600、处置500；负债发生800、偿还700；仅求FAB。', unit: 'SYN金额', resultKey: 'financialAccountBalance',
    correct: numericResult('C3', 'financialAccountBalance'), correctIndex: 0,
    explanation: '资产净取得100，负债净发生100，所以FAB=100−100=0；这不意味着没有跨境金融交易。',
    wrong: [
      { value: 100, diagnosis: '100是资产净取得或负债净发生的任一侧净额，不是资产侧减负债侧后的FAB。' },
      { value: 2600, diagnosis: '2600是四类毛交易周转合计。毛活动规模与净金融账户余额回答不同问题。' },
    ], sourceIds: [1],
  },
  {
    id: '5', labId: 'C3', title: '零净额可以同时伴随大毛周转',
    question: '沿用同一四项毛交易，仅求取得、处置、发生与偿还的合计周转。', unit: 'SYN金额', resultKey: 'grossTurnover',
    correct: numericResult('C3', 'grossTurnover'), correctIndex: 1,
    explanation: '600+500+800+700=2600。FAB虽然为0，毛交易与潜在滚续需求并不为0。',
    wrong: [
      { value: 0, diagnosis: '0是FAB净余额，把净额误当毛活动；相反方向的交易会在净额里抵消。' },
      { value: 200, diagnosis: '200=资产净取得100+负债净发生100，只合计两条净腿，仍未恢复四类毛周转。' },
    ], sourceIds: [1],
  },
  {
    id: '6', labId: 'C4', title: '储备存量需要交易与非交易桥接',
    question: '期初500，交易+50，汇率重估+20，其他价格0，其他数量−10；仅求期末储备。', unit: 'SYN金额', resultKey: 'closingReserveAssets',
    correct: numericResult('C4', 'closingReserveAssets'), correctIndex: 2,
    explanation: '500+50+20+0−10=560。期末较期初增加60，但当期储备交易只有+50。',
    wrong: [
      { value: 550, diagnosis: '550只加交易，遗漏净非交易变化+10；它不能解释题设完整期末头寸，也不能反推现实干预。' },
      { value: 510, diagnosis: '510只把三个非交易变化合并进期初，却漏掉储备交易+50，因此没有完成题设存量桥。' },
    ], sourceIds: [1, 6],
  },
  {
    id: '7', labId: 'C5', title: 'NIIP变化不是金融账户余额的别名',
    question: 'IIP桥中期初NIIP=200、期末NIIP=235；仅求NIIP实际变化。', unit: 'SYN金额', resultKey: 'actualNetIipChange',
    correct: numericResult('C5', 'actualNetIipChange'), correctIndex: 0,
    explanation: '235−200=35。交易贡献50，还要叠加净汇率+10、净其他价格−30和净其他数量+5。',
    wrong: [
      { value: 50, diagnosis: '50是金融账户余额，只计算资产与负债交易差；它遗漏重估和其他数量变化。' },
      { value: 235, diagnosis: '235是期末NIIP本身，而题目问的是期末235减期初200后的期间变化；存量不能直接冒充存量变化。' },
    ], sourceIds: [1, 3],
  },
  {
    id: '8', labId: 'C5', title: '交易贡献与持有损益要分栏',
    question: '资产交易+100、负债交易+50；仅求金融账户余额，不加入任何重估。', unit: 'SYN金额', resultKey: 'financialAccountBalance',
    correct: numericResult('C5', 'financialAccountBalance'), correctIndex: 1,
    explanation: 'FAB=100−50=50。NIIP实际变化35包含非交易变化，不能倒灌进金融账户。',
    wrong: [
      { value: 35, diagnosis: '35是完整NIIP变化，混入汇率、价格和其他数量变化；题目只问BOP金融账户交易。' },
      { value: 10, diagnosis: '10是资产汇率变化40减负债汇率变化30的净汇率重估，不属于金融账户交易。' },
    ], sourceIds: [1, 3],
  },
  {
    id: '9', labId: 'C6', title: '储蓄投资恒等式没有因果箭头',
    question: '私人储蓄300、投资250；政府储蓄50、投资80；仅求恒等式隐含CAB。', unit: 'SYN金额', resultKey: 'impliedCurrentAccountBalance',
    correct: numericResult('C6', 'impliedCurrentAccountBalance'), correctIndex: 2,
    explanation: '私人缺口+50与政府缺口−30合成+20，所以S−I=20。这个余额不识别哪个部门或价格先调整。',
    wrong: [
      { value: 50, diagnosis: '50只取私人储蓄−投资，遗漏政府储蓄−投资为−30。全国余额必须合并居民部门。' },
      { value: -30, diagnosis: '−30只取政府缺口，不能把一个部门的净借入直接改名为全国经常账户。' },
    ], sourceIds: [1],
  },
  {
    id: '10', labId: 'C7', title: '相同NIIP之下仍有不同流动性结构',
    question: '经济体A储备100、短期外币债务400；仅求机械储备覆盖率。', unit: '%', resultKey: 'economyAReserveCoveragePercent',
    correct: numericResult('C7', 'economyAReserveCoveragePercent'), correctIndex: 0,
    explanation: '100/400=25%。B的对应比率是80/40=200%；两者NIIP都为100，但这一个比率仍不是危机概率或完整储备充足性。',
    wrong: [
      { value: 200, diagnosis: '200%是经济体B的覆盖率，把另一个独立经济体的分子分母移入A。' },
      { value: 100, diagnosis: '100是两经济体共同的NIIP数值，不是储备除以短期外币债务的比例。' },
    ], sourceIds: [1, 3, 6],
  },
];

export function balanceOfPaymentsOptions(scenario: BopScenario): readonly Readonly<{ id: 'A' | 'B' | 'C'; value: number; correct: boolean; diagnosis: string }>[] {
  let wrongIndex = 0;
  return (['A', 'B', 'C'] as const).map((id, index) => index === scenario.correctIndex
    ? { id, value: scenario.correct, correct: true, diagnosis: `正确推理：${scenario.explanation}` }
    : { id, value: scenario.wrong[wrongIndex].value, correct: false, diagnosis: `这条路径错在哪里：${scenario.wrong[wrongIndex++].diagnosis}` });
}

export function balanceOfPaymentsScenarioInputText(scenario: BopScenario): string {
  const lab = balanceOfPaymentsLabs.find(candidate => candidate.id === scenario.labId);
  if (!lab) throw Error(`题目缺少实验护照：${scenario.labId}`);
  return lab.fields.map(field => `${field.label} = ${bopNumber(lab.initial[field.key])}`).join('；');
}

export const balanceOfPaymentsScenarioAudit = [
  {
    key: 'ten fixed M/K questions each have one correct and two distinct finite numeric paths',
    passed: balanceOfPaymentsScenarios.length === 10
      && new Set(balanceOfPaymentsScenarios.map(scenario => scenario.id)).size === 10
      && balanceOfPaymentsScenarios.every(scenario => {
        const options = balanceOfPaymentsOptions(scenario);
        return options.length === 3 && options.filter(option => option.correct).length === 1
          && new Set(options.map(option => option.value)).size === 3 && options.every(option => Number.isFinite(option.value));
      }),
  },
  {
    key: 'all questions retain their full parent-lab passport, unit and three diagnoses',
    passed: balanceOfPaymentsScenarios.every(scenario => {
      const lab = balanceOfPaymentsLabs.find(candidate => candidate.id === scenario.labId);
      const inputText = balanceOfPaymentsScenarioInputText(scenario);
      return Boolean(lab) && scenario.unit.length > 0
        && lab!.fields.every(field => inputText.includes(`${field.label} = ${bopNumber(lab!.initial[field.key])}`))
        && balanceOfPaymentsOptions(scenario).every(option => option.diagnosis.length >= 40);
    }),
  },
  {
    key: 'correct positions are balanced 4/3/3 without causal or policy certification',
    passed: [0, 1, 2].map(index => balanceOfPaymentsScenarios.filter(scenario => scenario.correctIndex === index).length).join('/') === '4/3/3'
      && balanceOfPaymentsScenarios.every(scenario => !scenario.explanation.includes('已识别因果') && !scenario.explanation.includes('政策最优')),
  },
] as const;
