'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'decision' | 'identification';
type Choice = 'a' | 'b' | 'c';

type Option = {
  id: Choice;
  label: string;
  diagnosis: string;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: Choice;
  options: Option[];
  calculation: string;
  reveal: string;
  revisit: string;
};

type AttemptState = {
  choice?: Choice;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:2.02-lab-r2';
const EMPTY_ATTEMPT: AttemptState = {};

const decisionScenarios: Scenario[] = [
  {
    id: 'account-weight',
    label: '结构实验 01 · 权重',
    title: '账户数量占多数，是否就主导了主动买入金额？',
    brief: '同一窗口有 1,000 个活跃自然人账户。A 组 900 户，每户提交并成交 1,000 元主动买单；B 组 100 户，每户成交 30,000 元主动买单。价格、订单主动性和成交条件相同。题目只比较主动买入成交金额，不推断永久价格影响。',
    facts: [
      { label: 'A group', value: '900 × ¥1,000', note: '账户占比 90%' },
      { label: 'B group', value: '100 × ¥30,000', note: '账户占比 10%' },
      { label: 'Measure', value: 'Executed value', note: '不是人数、股数或净买入' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'A 组主导，因为它占活跃账户 90%', diagnosis: '这把参与广度当成成交金额权重。A 组金额只有 90 万元，少于 B 组的 300 万元。' },
      { id: 'b', label: 'B 组占主动买入金额约 76.92%，但题面不足以证明其永久价格影响更大', diagnosis: '正确：B 金额权重为 300/(90+300)=76.92%。价格影响还需要订单时序、深度、内部化与恢复。' },
      { id: 'c', label: '两组都属于散户，因此主动买入金额各占一半', diagnosis: '分类标签不赋予等权。人数、账户规模和订单金额的联合分布决定流量权重。' },
    ],
    calculation: 'A=900×1,000=900,000 元；B=100×30,000=3,000,000 元；B 权重=3,000,000/3,900,000=76.92%。',
    reveal: '“散户很多”与“谁贡献流量”是两种统计。即使 B 在本窗口贡献更多主动金额，也不能跳过当时深度和其他主体承接，直接宣称 B 决定长期价格。',
    revisit: '回看 05 分母地图、06 分布而非平均，以及 2.01 的分布聚合。',
  },
  {
    id: 'mean-versus-gross',
    label: '结构实验 02 · 净额',
    title: '平均订单为零，是否意味着没有人交易？',
    brief: '80 户各买入 5,000 元，20 户各卖出 20,000 元；所有订单都可执行。题目把买入记为正、卖出记为负，并以成交金额计算净额和不带符号的总活动。',
    facts: [
      { label: 'Buyers', value: '80 × ¥5,000', note: '买入人数占 80%' },
      { label: 'Sellers', value: '20 × ¥20,000', note: '卖方单户金额更大' },
      { label: 'Asked', value: 'Net + gross', note: '两个量都要计算' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '净买入 30 万元，因为买方账户更多', diagnosis: '人数不能替代金额。80×5,000 与 20×20,000 都是 40 万元。' },
      { id: 'b', label: '净订单为零，因此总成交意愿和真实订单也都为零', diagnosis: '净额抵销不删除双边活动。题面中每个账户都下了非零订单，总活动为买卖金额之和 80 万元。' },
      { id: 'c', label: '净订单为零、总活动 80 万元，而且没有任何一户实际下了零元订单', diagnosis: '正确：数学均值或净额可以为零，却未必对应一名真实“平均账户”，也不保存 gross flow。' },
    ],
    calculation: '买入=80×5,000=400,000；卖出=20×20,000=400,000；净额=400,000−400,000=0；gross=400,000+400,000=800,000 元。',
    reveal: '全市场或群体净额与成交活动是不同变量。把净额为零写成“没人交易”，会同时丢掉成交量、尾部订单与谁向谁重配资产。',
    revisit: '回看 06 分布而非平均、34 订单失衡。',
  },
  {
    id: 'cost-compounding',
    label: '结构实验 03 · 费用',
    title: '价格始终不变，高换手还能让财富损失多少？',
    brief: '初始财富 100,000 元；连续完成 100 次全仓往返。每次交易前后资产价格不变，单次 round trip 的全部费用和滑点合计为当时财富的 0.30%。没有入金、税收、利息或其他收益。',
    facts: [
      { label: 'Initial wealth', value: '¥100,000', note: '每次按剩余财富全仓' },
      { label: 'Round trips', value: '100', note: '完整买入—卖出往返' },
      { label: 'Cost per trip', value: '0.30%', note: '按当时财富计，需复利' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '期末约 74,048.43 元；费用每次按剩余财富复利', diagnosis: '正确：100,000×0.997¹⁰⁰≈74,048.43。' },
      { id: 'b', label: '期末 70,000 元；把 0.30%×100 从初始本金一次扣除', diagnosis: '这是假设每次都对不变的初始本金收费，与题面“按当时财富”不符。' },
      { id: 'c', label: '期末 97,000 元；只要佣金低，总共只需扣 3%', diagnosis: '3% 也是把 0.30% 只累加十次或只做一次总扣减；题面有 100 次往返。' },
    ],
    calculation: 'W₁₀₀=100,000×(1−0.003)¹⁰⁰=100,000×0.997¹⁰⁰≈74,048.43 元。',
    reveal: '本题只证明高换手在没有毛收益优势时会机械累积成本，不说明为何投资者高换手。把原因归为过度自信需要第 6.09 节的独立证据。',
    revisit: '回看 25–27 的费用、路由与换手；按需回看 T02 复利。',
  },
  {
    id: 'constraint-projection',
    label: '结构实验 04 · 投影',
    title: '家庭想交易的数量，经过账户约束后还剩多少？',
    brief: '单位均为千元。目标订单是买 A 50、卖 B 30；可交易现金 20，另有应急金但明确不可动用；B 当日可售库存最多 10；禁止借款和卖空；卖出款在本教学题中立即可用于买入；忽略费用和整手。投影规则是在可行集合内最小化与目标订单的平方距离。',
    facts: [
      { label: 'Desired', value: 'Buy A 50 / Sell B 30', note: '尚未经过约束的愿望' },
      { label: 'Cash + sale', value: '20 + s', note: '题设允许立即复用卖出款' },
      { label: 'Sellable B', value: '≤ 10', note: '不可卖空、应急金不可动' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '买 A 50、卖 B 30；家庭净财富足够就应执行目标', diagnosis: '这仍是期望订单，违反现金和 B 的可售库存上限。家庭资产中的应急金也被题面排除在本窗口之外。' },
      { id: 'b', label: '买 A 30、卖 B 10，即订单向量 (+30, −10)', diagnosis: '正确：卖出上限取 10，题设允许 10 的卖款与 20 现金共同买入，得到 b=30。' },
      { id: 'c', label: '买 A 20、卖 B 10；卖出款永远不能用于同日买入', diagnosis: '题面明确规定卖出款立即可用。真实市场结算和可用资金规则可能不同，本题已锁定教学时钟。' },
    ],
    calculation: '令 b 为买 A、s 为卖 B：min (b−50)²+(s−30)²，约束 0≤s≤10、0≤b≤20+s。最优边界为 s=10、b=30。',
    reveal: '应急金属于家庭财富，却不属于本窗口账户可行资金；目标订单只有经过现金、库存和时钟投影后，才会成为市场可能看到的订单。',
    revisit: '回看 08 家庭账本、16 账户分割、18 目标到订单；按需回看 T06 与 1.20。',
  },
];

const identificationScenarios: Scenario[] = [
  {
    id: 'margin-observational-equivalence',
    label: '识别实验 01 · 强平',
    title: '看到一笔特定规模卖单，能否认定是保证金强卖？',
    brief: '融资账户持有 1,000 股，现价 80 元，债务 60,000 元，权益 20,000 元。教学维持规则为“权益/剩余证券市值≥30%”。唯一补救是卖股并将全部卖款偿债；价格固定、忽略费用和冲击，股数须为整数。另有现金账户因消费需要也卖出同样股数，研究者只看见卖单与成交价。',
    facts: [
      { label: 'Assets / debt', value: '¥80,000 / ¥60,000', note: '卖出并偿债时权益保持 20,000' },
      { label: 'Maintenance', value: 'E / remaining A ≥ 30%', note: '教学规则，不代表任一券商合同' },
      { label: 'Observed', value: 'Sell order only', note: '没有账户身份与债务状态' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '卖出不能改善比率，因为权益保持不变，所以不存在可求的最小股数', diagnosis: '卖出并偿债让权益不变，却同时降低分母；20,000/(80,000−80q) 会随 q 上升。' },
      { id: 'b', label: '至少卖 167 股，而且看到 167 股卖单就能确认强平', diagnosis: '股数计算正确，因果判断错误。现金需求也能生成同一卖单，结果对动机观察等价。' },
      { id: 'c', label: '融资账户至少卖 167 股；但仅凭这笔卖单不能区分强制降杠杆与消费变现', diagnosis: '正确：需要账户身份、债务、阈值状态和卖款用途才能识别动机。' },
    ],
    calculation: '20,000/(80,000−80q)≥0.30 ⇒ 20,000≥24,000−24q ⇒ q≥166.67；股数取整数，最少卖 167 股并偿债。',
    reveal: '阈值可以产生唯一的最小可行订单，却不让公开成交自动携带动机。结构识别要同时观察冲击前账户状态与规则是否绑定。',
    revisit: '回看 20–21 的杠杆与保证金反馈，以及 2.01 的观察等价。',
  },
  {
    id: 'identity-classifier',
    label: '识别实验 02 · 身份',
    title: '用小额订单代理散户，净买卖方向会不会被翻转？',
    brief: '目标量预先定义为“经核验自然人账户买入额减卖出额”。小额买入 600,000，其中核验散户 360,000；小额卖出 400,000，其中核验散户 160,000；大额买入 300,000，其中核验散户 120,000；大额卖出 500,000，其中核验散户 340,000。',
    facts: [
      { label: 'Small-order proxy', value: '¥600k buy / ¥400k sell', note: '算法只把小额单视作散户' },
      { label: 'Verified retail buy', value: '¥360k + ¥120k', note: '小额与大额自然人买入' },
      { label: 'Verified retail sell', value: '¥160k + ¥340k', note: '小额与大额自然人卖出' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '代理得到净买入 20 万元，账户身份却得到净卖出 2 万元，方向翻转', diagnosis: '正确：proxy=600−400=+200；verified=(360+120)−(160+340)=−20，单位均为千元。' },
      { id: 'b', label: '真实散户净买入 20 万元，因为大额订单按定义不可能来自自然人', diagnosis: '大额订单不是机构身份的定义。题面已经给出大额自然人买卖，算法漏掉它们。' },
      { id: 'c', label: '散户净额必为零，因为全市场成交的买卖总额必然相等', diagnosis: '全市场清算恒等式不要求某一主体组内部买卖相等；其他主体或中介可以承接净重配。' },
    ],
    calculation: '小额代理：600,000−400,000=+200,000 元。账户核验：(360,000+120,000)−(160,000+340,000)=−20,000 元。',
    reveal: '分类误差不仅改变规模，还能改变符号。题目识别的是账户类别下买卖额，不识别最终家庭、私人信息或交易动机。',
    revisit: '回看 03 定义、39–40 的测量阶梯与分类器，以及 1.26B 的身份四轴。',
  },
  {
    id: 'platform-default',
    label: '识别实验 03 · 平台',
    title: '目标持仓相同，平台默认值还能改变主动订单流吗？',
    brief: '两个随机分配的平台组各有 1,000 名用户；每人在进入页面前已经决定买 100 股，估值、现金和信息完全相同。A 组默认 market order，70% 接受默认；B 组默认 passive limit，只有 20% 主动改成 market order。其余都提交非市场化限价单；题目只测提交的主动股数，不假设被动单成交。',
    facts: [
      { label: 'Target per user', value: 'Buy 100 shares', note: '两组信念与目标完全相同' },
      { label: 'A market share', value: '70%', note: '默认市场单' },
      { label: 'B market share', value: '20%', note: '默认被动限价单' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '信念相同，所以两组主动订单流也必然相同', diagnosis: '目标与执行方式是不同节点。默认值改变了多少用户跨越报价。' },
      { id: 'b', label: 'A 主动买 70,000 股、B 为 20,000 股；默认值造成 50,000 股主动需求差，但目标持仓没变', diagnosis: '正确：随机化只改变题设中的执行默认，不能据此称为估值或目标变化。' },
      { id: 'c', label: 'A 组的目标持仓比 B 组多 50,000 股，因此平台提高了看多信念', diagnosis: '两组各 100,000 股目标完全相同；差异只在主动或被动订单类型。' },
    ],
    calculation: 'A 主动股数=1,000×100×70%=70,000；B=1,000×100×20%=20,000；差额=50,000 股。',
    reveal: '平台位于目标与可执行订单之间。题目刻意关闭推荐榜、社交传播与注意力变化；这些认知通道留给 6.05 和 6.17。',
    revisit: '回看 18 目标到订单、26 路由、37 平台设计；按需回看 1.03 订单类型。',
  },
  {
    id: 'feedback-boundary',
    label: '识别实验 04 · 反馈',
    title: '正反馈一定发散吗？固定增益下总流量和模型内冲击是多少？',
    brief: '第一轮外生主动买入 100,000 股；局部线性影响为每 100,000 股上涨 0.5 个百分点。每轮价格变化又触发下一轮主动买量等于上一轮的 40%。假设影响系数、深度和参与者集合不变、无反向流，教学模型持续到无穷轮。',
    facts: [
      { label: 'Initial flow', value: '100,000 shares', note: '第一轮外生买入' },
      { label: 'Feedback gain', value: 'g = 0.40', note: '每轮为上一轮 40%' },
      { label: 'Local impact', value: '0.5 pp / 100k', note: '百分点，不是 50%' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '总影响只有 0.5 个百分点，因为只有第一轮是外生冲击', diagnosis: '后续流量虽由反馈内生生成，仍在题设线性冲击中作用于价格。' },
      { id: 'b', label: '任何正反馈都会发散，因此流量和价格影响都是无穷大', diagnosis: '几何反馈在 |g|<1 时收敛；本题 g=0.40。' },
      { id: 'c', label: '总流量约 166,666.67 股，总模型内影响约 0.8333 个百分点，且 g<1 使其收敛', diagnosis: '正确：总量为首项除以 1−g，再按固定局部冲击线性换算。' },
    ],
    calculation: 'Q=100,000×(1+0.4+0.4²+…)=100,000/(1−0.4)=166,666.67 股；Δp=0.5 个百分点×166,666.67/100,000=0.8333 个百分点。',
    reveal: '这是固定深度、固定主体和无逆向流的教学闭环，不是永久因果估计。流动性耗尽、做市商调整、卖方进入或参与者退出都会改变增益和冲击。',
    revisit: '回看 19 局部冲击、35 可预测性与 36 状态依赖；按需回看 1.09。',
  },
];

const modes: { id: Mode; label: string; title: string; description: string }[] = [
  { id: 'decision', label: 'MODE 01', title: '从人群到订单', description: '权重、净额、费用与约束投影' },
  { id: 'identification', label: 'MODE 02', title: '从成交到机制', description: '强平、身份、平台与反馈边界' },
];

const sequence = [
  ...decisionScenarios.map((item, index) => ({ id: item.id, mode: 'decision' as const, index, correct: item.correct })),
  ...identificationScenarios.map((item, index) => ({ id: item.id, mode: 'identification' as const, index, correct: item.correct })),
];

function taskStatus(item: Scenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return attempt?.choice ? '已选择，尚未提交' : '未作答';
  return attempt.choice === item.correct ? '已提交，回答正确' : '已提交，回答错误，可重新作答';
}

function validatedAttempts(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const valid: Record<string, AttemptState> = {};
  for (const item of sequence) {
    const raw = input[item.id];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const candidate = raw as Record<string, unknown>;
    const choice = candidate.choice;
    const revealed = candidate.revealed;
    if (choice !== 'a' && choice !== 'b' && choice !== 'c') continue;
    valid[item.id] = { choice, revealed: revealed === true };
  }
  return valid;
}

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目教学参数">
      {scenario.facts.map((fact) => (
        <article key={`${scenario.id}:${fact.label}:${fact.value}`}>
          <span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function RetailInvestorLab() {
  const [mode, setMode] = useState<Mode>('decision');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [storageState, setStorageState] = useState<'loading' | 'saved' | 'session'>('loading');
  const [announcement, setAnnouncement] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | 'result' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'decision' ? decisionScenarios : identificationScenarios;
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const { choice, revealed } = attempt;
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = revealed && choice === scenario.correct;
  const nextUnsubmitted = sequence.find((item) => !attempts[item.id]?.revealed);
  const submittedCount = sequence.filter((item) => attempts[item.id]?.revealed).length;
  const correctCount = sequence.filter((item) => {
    const itemAttempt = attempts[item.id];
    return itemAttempt?.revealed && itemAttempt.choice === item.correct;
  }).length;

  useEffect(() => {
    let cancelled = false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      const restored = stored ? validatedAttempts(JSON.parse(stored)) : {};
      queueMicrotask(() => {
        if (cancelled) return;
        setAttempts(restored);
        setStorageState('saved');
      });
    } catch {
      queueMicrotask(() => {
        if (cancelled) return;
        setStorageState('session');
        setAnnouncement('无法保存，当前会话仍可作答。');
      });
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (storageState !== 'saved') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
    } catch {
      queueMicrotask(() => {
        setStorageState('session');
        setAnnouncement('无法保存，当前会话仍可作答。');
      });
    }
  }, [attempts, storageState]);

  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (pending) {
      pendingFocusRef.current = null;
      if (pending === 'question') questionRef.current?.focus();
      if (pending === 'option') firstOptionRef.current?.focus();
      if (pending === 'result') resultRef.current?.focus();
    }
  }, [scenario.id, revealed, completed]);

  function navigate(nextMode: Mode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocusRef.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode && !completed) return;
    navigate(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex && !completed) return;
    navigate(mode, nextIndex);
  }

  function choose(nextChoice: Choice) {
    setAttempts((current) => ({ ...current, [scenario.id]: { choice: nextChoice, revealed: false } }));
    setCompleted(false);
  }

  function submit() {
    if (!choice) return;
    pendingFocusRef.current = 'result';
    setAttempts((current) => ({ ...current, [scenario.id]: { choice, revealed: true } }));
  }

  function retryCurrent() {
    setAttempts((current) => {
      const next = { ...current };
      delete next[scenario.id];
      return next;
    });
    setAnnouncement('当前题已清除，可以重新作答。');
    pendingFocusRef.current = 'option';
    setCompleted(false);
  }

  function goToNextUnsubmitted() {
    if (nextUnsubmitted) {
      navigate(nextUnsubmitted.mode, nextUnsubmitted.index);
      return;
    }
    pendingFocusRef.current = 'result';
    setCompleted(true);
  }

  function resetAll() {
    setAttempts({});
    setCompleted(false);
    setAnnouncement('八道题的作答记录已重置。');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageState('session');
      setAnnouncement('八道题的作答记录已重置；无法保存，当前会话仍可作答。');
    }
    navigate('decision', 0, 'option');
  }

  const globalQuestionNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;

  return (
    <div className="impact-lab">
      <div className="impact-lab-head">
        <div><span>RETAIL STRUCTURE LAB</span><h3>散户结构与识别实验</h3></div>
        <p>八题均为固定参数的自学实验。先锁定单位、分母和可行集合，再判断；客户端包含答案，不作为防作弊考试。</p>
      </div>
      <p className="impact-lab-progress">全局进度：已提交 {submittedCount}/8 · 当前正确 {correctCount}/8 · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {modes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} key={item.id} onClick={() => selectMode(item.id)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${mode === 'decision' ? '从人群到订单' : '从成交到机制'}题目导航`}>
        {scenarios.map((item, index) => {
          const globalNumber = sequence.findIndex((entry) => entry.id === item.id) + 1;
          return (
            <button
              aria-label={`第 ${globalNumber} 题，${item.title}，${taskStatus(item, attempts[item.id])}`}
              aria-pressed={!completed && scenarioIndex === index}
              key={item.id}
              onClick={() => selectScenario(index)}
              type="button"
            >
              <span>{String(globalNumber).padStart(2, '0')}</span>{attempts[item.id]?.revealed ? (attempts[item.id]?.choice === item.correct ? '正确' : '待重做') : '未提交'}
            </button>
          );
        })}
      </div>

      {completed ? (
        <div className="impact-result" ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>八题已提交：{correctCount}/8 正确</b>
          <p>复习路径：第 1–2 题回看权重与代表性；第 3–5 题回看家庭账本、费用与约束；第 6 题回看身份和测量；第 7–8 题回看平台反事实与反馈。错误题仍保留原选择，可回到对应模式逐题重做。</p>
          <div>
            <button className="impact-secondary" onClick={() => navigate('decision', 0)} type="button">回到第 1 题</button>
            <button className="impact-secondary" onClick={resetAll} type="button">重置全部作答</button>
          </div>
        </div>
      ) : (
        <>
          <div className="impact-question">
            <span>{scenario.label} · 全局第 {globalQuestionNumber}/8 题</span>
            <h3 ref={questionRef} tabIndex={-1}>{scenario.title}</h3>
            <p>{scenario.brief}</p>
          </div>
          <ScenarioFacts scenario={scenario} />
          <fieldset className="impact-choice-fieldset" disabled={revealed}>
            <legend className="sr-only">第 {globalQuestionNumber} 题：{scenario.title}，请选择一个答案</legend>
            {scenario.options.map((option, optionIndex) => (
              <label className={choice === option.id ? 'selected' : ''} key={option.id}>
                <input
                  checked={choice === option.id}
                  name={`retail-${scenario.id}`}
                  onChange={() => choose(option.id)}
                  ref={optionIndex === 0 ? firstOptionRef : undefined}
                  type="radio"
                  value={option.id}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {!revealed ? (
            <button className="impact-primary" disabled={!choice} onClick={submit} type="button">提交本题并查看诊断</button>
          ) : (
            <div className={correct ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
              <b id={resultTitleId}>{correct ? '回答正确' : '回答错误，可根据诊断重做'}</b>
              <p>{selected?.diagnosis}</p>
              <code>{scenario.calculation}</code>
              <strong>{scenario.reveal}</strong>
              <p><b>复习入口：</b>{scenario.revisit}</p>
              <div>
                {!correct ? <button className="impact-secondary" onClick={retryCurrent} type="button">清除本题并重做</button> : <span aria-hidden="true" />}
                <button className="impact-secondary" onClick={goToNextUnsubmitted} type="button">{nextUnsubmitted ? '前往下一道未提交题' : '查看完成诊断'}</button>
              </div>
            </div>
          )}
        </>
      )}
      <p className="impact-lab-caveat"><b>模型边界：</b>所有金额、取整、结算与固定流动性假设都只服务于唯一作答；真实市场必须改用当时账户合同、订单审计和深度数据。刷新后的保存只限本设备、本浏览器和当前题库版本。</p>
    </div>
  );
}
