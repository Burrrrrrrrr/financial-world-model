'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'ledger' | 'system';

type Option = {
  id: string;
  label: string;
  diagnosis: string;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: string;
  options: Option[];
  calculation: string;
  reveal: string;
};

const ledgerScenarios: Scenario[] = [
  {
    id: 'long-margin-call',
    label: '账户账本 01 · Long margin',
    title: '价格下跌后，要把权益率恰好恢复到题面目标，需要补多少现金？',
    brief: '教学账户买入 800 股，初始价 75 元/股；其中借款 debit D=32,000 元。价格跌至 54 元时，债务在本题时钟内不变。经纪商要求权益率 E/V 恢复到 35%，且现金存入后立即用于偿还 debit；忽略利息、税、费用和进一步价格冲击。',
    facts: [
      { label: 'Position', value: '800 × 54', note: '冲击后的证券市值' },
      { label: 'Debit', value: '32,000 元', note: '本题时钟内固定' },
      { label: 'Target', value: 'E / V = 35%', note: '题面指定恢复线' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '3,920 元；当前权益 11,200 元，目标权益 15,120 元', diagnosis: '正确：补款偿还 debit 后，证券市值不变、债务减少，权益等额增加到题面目标。' },
      { id: 'b', label: '16,800 元；用初始价格与当前价格之差乘以 800 股', diagnosis: '16,800 元是盯市损失，不是恢复到 35% 权益率所需的边际补款；两者的基准不同。' },
      { id: 'c', label: '15,120 元；把恢复后的目标权益本身当作需要新注入的现金', diagnosis: '目标权益中已有当前权益 11,200 元；现金缺口只应补两者之差，不能把存量权益再补一次。' },
    ],
    calculation: 'V₁=800×54=43,200；E₁=43,200−32,000=11,200；目标 E*=0.35×43,200=15,120；现金缺口=15,120−11,200=3,920 元。',
    reveal: '价格损失、margin deficiency 与现金 call 是三个不同量。Call 取决于当前市值、债务、要求比例和恢复目标；真实合约还可能要求恢复到 initial 或另一 house level，而非本题的 35%。',
  },
  {
    id: 'sell-to-delever',
    label: '账户账本 02 · Sell to delever',
    title: '不注入新资本，只卖资产并等额还债，要恢复目标杠杆应卖多少？',
    brief: '某可分割资产组合在价格冲击后市值 A=112,000 元、债务 D=88,000 元，因此权益 E=24,000 元。管理人只能按当前价格无冲击卖出 x 元资产，并把全部卖出所得即时偿还债务；目标是把资产/权益杠杆 A/E 恢复到 3 倍。',
    facts: [
      { label: 'Post-shock', value: 'A=112k, D=88k', note: '权益由恒等式计算' },
      { label: 'Action', value: 'Sell x; repay x', note: '资产与债务等额下降' },
      { label: 'Target', value: 'A′ / E′ = 3.0', note: '忽略冲击和费用' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '16,000 元；误把 A′/E′=3 当成 D′/E′=3，令目标债务为 72,000 元', diagnosis: 'A′/E′=3 实际对应 D′/E′=2；只有误令 D′=3×24,000=72,000，才会算出 88,000−72,000=16,000。' },
      { id: 'b', label: '48,000 元；把卖出后的目标债务本身当成这一次需要偿还的金额', diagnosis: '48,000 元是卖出后的目标债务余额，不是偿债额；应以当前债务 88,000 减去它。' },
      { id: 'c', label: '40,000 元；卖后 A′=72,000、D′=48,000、E′仍为 24,000', diagnosis: '正确：无价格冲击时，卖资产还债不会立即改变权益，只缩小资产和负债。' },
    ],
    calculation: 'E=A−D=24,000。卖出还债后 E′=(A−x)−(D−x)=E；令 (112,000−x)/24,000=3，得 x=40,000 元。',
    reveal: '“卖出还债不改变当期权益”只是一阶无摩擦账本。若卖盘压价、产生税费或同一资产的剩余仓位被重新标记，权益会在行动过程中继续下降，所需卖出量必须递归重算。',
  },
  {
    id: 'repo-haircut-jump',
    label: '账户账本 03 · Repo haircut',
    title: '抵押品价格不变而 haircut 上升，为什么也会产生现金需求？',
    brief: '一笔教学 repo 以市值 3,200 万元的债券作抵押。旧 haircut h₀=3%，所以现金借款按 (1−h₀)A 计算。续作时抵押品价格不变，但贷款人把 haircut 提高到 h₁=6.5%；借款人若保持全部抵押品，必须把超出新借款上限的现金归还。忽略利息与阈值。',
    facts: [
      { label: 'Collateral', value: 'A=32.0m', note: '续作时价格不变' },
      { label: 'Old term', value: 'h₀=3%', note: '旧现金借款比例 97%' },
      { label: 'New term', value: 'h₁=6.5%', note: '新现金借款比例 93.5%' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '96 万元；用旧 haircut 3% 乘当前抵押品市值', diagnosis: '96 万元是旧条款下的总自有资金份额，不是新旧借款上限之间的增量。' },
      { id: 'b', label: '112 万元；借款上限从 3,104 万降到 2,992 万', diagnosis: '正确：保持仓位时，借款人需要填补融资条款收紧造成的 112 万元差额。' },
      { id: 'c', label: '208 万元；用新 haircut 6.5% 乘当前抵押品市值', diagnosis: '208 万元是新条款下的总自有资金份额，不是相对旧条款新增的现金需求。' },
    ],
    calculation: 'B₀=(1−0.03)×32m=31.04m；B₁=(1−0.065)×32m=29.92m；保持抵押品的新增现金需求 B₀−B₁=(0.065−0.03)×32m=1.12m。',
    reveal: '融资压力有两条入口：抵押品价格可以下降，haircut 也可以上升。危机中二者常同向变化，若只保存价格而不保存融资条款，会把 margin spiral 的一半误写成资产基本面。',
  },
  {
    id: 'futures-variation-margin',
    label: '账户账本 04 · Variation margin',
    title: '期货价格的不利变动怎样变成当天现金流，而不是账面上等待到期的损失？',
    brief: '某账户持有 12 张股指期货多头，每点合约乘数 100 元。昨日结算价 3,280 点，今日结算价 3,247 点；题面规定按两次结算价之差进行 variation settlement。账户可立即动用的合格现金为 25,000 元；initial margin 要求本题不变。',
    facts: [
      { label: 'Position', value: 'Long 12 × 100/point', note: '方向与乘数' },
      { label: 'Settlement', value: '3,280 → 3,247', note: '下降 33 点' },
      { label: 'Cash buffer', value: '25,000 元', note: '题面可用流动性' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '支付 39,600 元 VM；相对现金缓冲短缺 14,600 元', diagnosis: '正确：多头在结算价下降时支付当日变动保证金，现金时钟先于合约到期。' },
      { id: 'b', label: '支付 3,300 元 VM；只用 33 点乘每点 100 元，漏掉 12 张合约', diagnosis: '每点总敏感度应由 12 张乘 100 元得到 1,200 元，合约张数不能省略。' },
      { id: 'c', label: '支付 14,600 元 VM；先用现金缓冲抵扣后才确认盯市损失', diagnosis: '14,600 元是付款后的流动性缺口；VM 总额仍是 39,600 元，现金缓冲不会改写损益。' },
    ],
    calculation: 'VM loss=12×100×(3,280−3,247)=39,600 元；即时流动性缺口=39,600−25,000=14,600 元。',
    reveal: '衍生品可以用较少初始资金建立大名义敞口，但盯市把价格变化迅速变成现金转移。偿付能力和流动性因此必须分开：长期净资产为正，也可能因今天拿不出合格现金而被平仓。',
  },
];

const systemScenarios: Scenario[] = [
  {
    id: 'price-vs-house-margin',
    label: '系统诊断 01 · Trigger',
    title: '这笔 call 是价格下跌自动造成，还是保证金规则变化造成？',
    brief: '某证券账户在冲击后证券市值 V=900 万元、debit=700 万元，故权益为 200 万元。冲击前经纪商的 house maintenance 为 20%；同一时点经纪商把该证券的 house requirement 调到 25%。题面只判断当前缺口来源，不讨论调整是否最优。',
    facts: [
      { label: 'Snapshot', value: 'V=9m, D=7m', note: '冲击后账户状态' },
      { label: 'Old rule', value: 'm=20%', note: '旧维持比例' },
      { label: 'New rule', value: 'm=25%', note: '新 house 比例' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '旧 20% 规则已经产生 20 万元缺口；上调至 25% 只是把既有缺口扩大到 25 万元', diagnosis: '冲击后旧要求权益是 180 万元，低于当前权益 200 万元；这里把 20 万元缓冲误读成缺口。' },
      { id: 'b', label: '旧规则仍合格；25% 要求权益 225 万，当前仅 200 万，因此缺口 25 万', diagnosis: '正确：当前 call 来自“冲击后的账户状态 × 同时收紧的合同要求”，不能只贴价格标签。' },
      { id: 'c', label: '当前权益率约 22.22%；按新的 25% 口径仍保留约 2.78 个百分点缓冲', diagnosis: '22.22% 比 25% 低约 2.78 个百分点，方向恰好相反；新规则产生缺口。' },
    ],
    calculation: '当前权益率=(9m−7m)/9m=22.22%；旧要求权益=1.8m，账户通过；新要求权益=2.25m，缺口=2.25m−2.0m=0.25m。',
    reveal: '价格、波动、集中度和 house margin 是可分别变化的状态。研究若只有 margin-call 时间戳而没有要求比例历史，会把合同收紧误归因于价格；只有比例而没有账户市值，也无法重建真实缺口。',
  },
  {
    id: 'cross-asset-liquidity',
    label: '系统诊断 02 · Cash waterfall',
    title: '利率衍生品产生现金 call，为什么最先被卖出的可能是股票？',
    brief: '某多资产基金今日需以现金支付 1,200 万元 variation margin。题面时钟内无法从投资人取得新资本，也不能在截止前缩减产生 call 的利率 hedge。可出售的未设押股票组合预估冲击 10 bp；核心长久期债券出售冲击 80 bp，且承担负债对冲功能。',
    facts: [
      { label: 'Cash call', value: '12m today', note: '利率衍生品产生' },
      { label: 'Equity sale', value: '10 bp impact', note: '未设押且可快速结算' },
      { label: 'Bond sale', value: '80 bp impact', note: '承担对冲功能' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '优先卖债券：现金需求源于利率对冲，因此同风险因子资产能更有效降低本次 call', diagnosis: '题面规定本次 VM 已到期且对冲不能在截止前缩减；出售哪项资产筹钱，应比较可交付速度、冲击和组合功能。' },
      { id: 'b', label: '股票冲击更小，但股票与利率 VM 属于不同净额集合，所以出售所得不能用于付款', diagnosis: '法律净额限制合约义务互抵，不会让已经变成可用现金的股票出售所得失去支付能力。' },
      { id: 'c', label: '可先卖股票：资金瀑布按可交付速度与执行成本排序，现金来源不必对应产生 call 的头寸', diagnosis: '正确：主体会卖“能卖的”，而不一定卖“最想卖的”；这把利率冲击传到股票订单流。' },
    ],
    calculation: '题面不要求把 10 bp 与 80 bp 相减成收益预测；它给出的是筹集同一 12m 现金时的执行成本排序。股票销售是融资选择，不等于股票基本面信号。',
    reveal: 'Cross-asset contagion 的最小链条是：A 市场损失或 VM → 现金缺口 → 出售 B 市场未设押、较易交易资产 → B 的价格与深度变化。要识别它，必须看到共同持有人、抵押状态、call 时钟与真实销售，而不只看相关性上升。',
  },
  {
    id: 'endogenous-price-spiral',
    label: '系统诊断 03 · Feedback',
    title: '每个基金都在“降低自身风险”，为什么合起来反而可能放大系统风险？',
    brief: '两只基金在第一轮冲击后各有资产 A=9,500 万元、债务 D=8,000 万元、权益 E=1,500 万元，并各自遵守资产/权益不超过 5 倍的硬上限。按固定价格计算，每只都需卖出并还债 2,000 万元。市场题面给出：两者合计每卖出 1,000 万元，会使共同持仓再下跌 0.8%；第一轮之外尚未重算。',
    facts: [
      { label: 'Each fund', value: 'A=95m, D=80m', note: '冲击后同一状态' },
      { label: 'Rule', value: 'A / E ≤ 5', note: '硬约束' },
      { label: 'Impact map', value: '−0.8% per 10m sold', note: '共同持仓局部映射' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '合计 4,000 万第一轮卖盘约压价 3.2%；剩余仓位重估后必须重算约束', diagnosis: '正确：个体去风险动作通过共同价格改变其他人和自己的约束状态，形成反馈。' },
      { id: 'b', label: '固定价卖出让权益不变，因此额外 3.2% 跌幅只改变剩余资产，不会再改变杠杆约束', diagnosis: '额外跌幅会重估剩余资产，债务却未同步减少同样金额，所以权益与杠杆约束都会改变。' },
      { id: 'c', label: '两只基金持仓结构相同，冲击应按每只 2,000 万分别计算，系统额外跌幅仍是 1.6%', diagnosis: '共同市场面对的是合计 4,000 万净卖量；把同一订单簿人为分成两个计算会漏掉聚合冲击。' },
    ],
    calculation: '每只固定价去杠杆量 x=95m−5×15m=20m；合计 40m。按题面局部映射，额外跌幅=40m/10m×0.8%=3.2%。这只是下一轮输入，不是闭式最终价格。',
    reveal: 'Margin spiral 的核心不是“风险经理做错了”，而是私下最优动作共享同一价格。模型必须迭代 price → equity → constraint → sale → impact → new price，并检查深度是否随压力内生消失。',
  },
  {
    id: 'synthetic-hidden-leverage',
    label: '系统诊断 04 · Archegos',
    title: '从 Archegos 事件能得到哪一个不过度外推的杠杆结论？',
    brief: 'SEC 2022 年民事诉状指称，Archegos 从 2020 年 3 月 31 日约 16 亿美元 invested capital、102 亿美元 gross exposure，扩张到截至 2021 年 3 月 22 日超过 360 亿美元 invested capital、1,600 亿美元 gross exposure；其经济头寸大量通过多家对手方的 total return swaps 建立。后续司法与监管记录确认欺诈、操纵及银行体系超过 100 亿美元的损失，但诉状中的规模口径仍须标作指称。',
    facts: [
      { label: 'Start', value: '1.6b capital / 10.2b gross', note: '2020-03 · SEC 诉状口径' },
      { label: '2021-03-22', value: '>36b capital / >160b gross', note: '截至该日 · SEC 诉状口径' },
      { label: 'Outcome', value: 'Unmet calls; bank losses >10b', note: '后续司法与监管记录' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '可用 160/36≈4.44 倍估计实际杠杆，再据此判断价格下跌后的清算规模', diagnosis: '分子和分母都只是“超过”的披露阈值；两阈值之比不是实际比率估计，且缺少净额、估值与抵押品。' },
      { id: 'b', label: '把公开现金持仓与一家主经纪商的 swap 相加，通常足以重建跨行 gross exposure', diagnosis: '多家 prime 各自只见局部，现金持仓披露也不覆盖全部合成头寸；跨行聚合正是本案的关键盲区。' },
      { id: 'c', label: '应聚合现金与合成 gross exposure、集中度和全部对手方，并把清算机制与法律归责分开', diagnosis: '正确：风险机制、信息缺口和违法证据是三层不同问题，不能相互替代。' },
    ],
    calculation: '160/36≈4.44 只是两个公开阈值的机械比值；由于实际分子和分母均只披露为“超过”，它既不是实际 gross exposure / invested capital 比率的估计，也不是该比率的上界或下界。',
    reveal: '即使取得同一时点的精确分子与分母，这个比率也仍不是完整账户杠杆：还需冻结净额、swap 估值、抵押品、法律实体与全部 prime broker 口径。风险机制可以独立分析，但欺诈与操纵结论必须依靠另外的司法证据。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...ledgerScenarios.map((item, index) => ({ id: item.id, mode: 'ledger' as const, index })),
  ...systemScenarios.map((item, index) => ({ id: item.id, mode: 'system' as const, index })),
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目教学参数">
      {scenario.facts.map((fact) => (
        <article key={fact.label}>
          <span>{fact.label}</span>
          <b>{fact.value}</b>
          <p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function LeverageMarginLab() {
  const [mode, setMode] = useState<Mode>('ledger');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submittedScenarioIds, setSubmittedScenarioIds] = useState<string[]>([]);
  const [scenarioResults, setScenarioResults] = useState<Record<string, boolean>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'ledger' ? ledgerScenarios : systemScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;
  const nextUnsubmitted = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));
  const correctCount = Object.values(scenarioResults).filter(Boolean).length;

  useEffect(() => {
    if (revealed || completed) {
      resultRef.current?.focus();
      return;
    }
    if (pendingFocusRef.current === 'question') questionTitleRef.current?.focus();
    if (pendingFocusRef.current === 'option') firstOptionRef.current?.focus();
    pendingFocusRef.current = null;
  }, [mode, scenarioIndex, revealed, completed]);

  function reset(nextMode = mode, nextIndex = scenarioIndex) {
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setChoice('');
    setRevealed(false);
    setCompleted(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode && !completed) return;
    pendingFocusRef.current = 'question';
    reset(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex && !completed) return;
    pendingFocusRef.current = 'question';
    reset(mode, nextIndex);
  }

  function retryScenario() {
    pendingFocusRef.current = 'option';
    setSubmittedScenarioIds((current) => current.filter((id) => id !== scenario.id));
    setScenarioResults((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== scenario.id)));
    reset();
  }

  function submitScenario() {
    setSubmittedScenarioIds((current) => current.includes(scenario.id) ? current : [...current, scenario.id]);
    setScenarioResults((current) => ({ ...current, [scenario.id]: correct }));
    setRevealed(true);
  }

  function nextScenario() {
    const nextTarget = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));
    if (nextTarget) {
      pendingFocusRef.current = 'question';
      reset(nextTarget.mode, nextTarget.index);
      return;
    }
    setCompleted(true);
  }

  function restartLab() {
    pendingFocusRef.current = 'question';
    setSubmittedScenarioIds([]);
    setScenarioResults({});
    reset('ledger', 0);
  }

  const modeLabel = mode === 'ledger' ? '账户与现金流' : '反馈与识别';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'system' && mode === 'ledger'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>EQUITY · MARGIN · CASH · LIQUIDATION</span>
          <h3>先算账户在固定价格下需要什么，再判断共同卖出怎样反过来改变价格</h3>
        </div>
        <p>两种模式各四题。Mode A 闭合证券 margin、卖出还债、repo haircut 与 futures VM；Mode B 区分触发器、跨资产现金瀑布、价格反馈和合成杠杆证据。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="杠杆与强制清算实验模式">
        <button type="button" aria-pressed={mode === 'ledger'} onClick={() => selectMode('ledger')}>
          <span>MODE A</span><b>Ledger &amp; Cash</b><small>权益率、去杠杆、haircut 与 variation margin</small>
        </button>
        <button type="button" aria-pressed={mode === 'system'} onClick={() => selectMode('system')}>
          <span>MODE B</span><b>Feedback &amp; Identify</b><small>house rule、现金瀑布、螺旋与隐藏敞口</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const result = scenarioResults[item.id];
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          const status = !submitted ? '未提交' : result ? '已提交，正确' : '已提交，需复习';
          return (
            <button
              type="button"
              key={item.id}
              aria-label={`${number} ${shortLabel}，${status}`}
              aria-pressed={index === scenarioIndex}
              aria-current={index === scenarioIndex ? 'step' : undefined}
              onClick={() => selectScenario(index)}
            >
              <span aria-hidden="true">{!submitted ? number : result ? '✓' : '!'}</span>{shortLabel}
            </button>
          );
        })}
      </div>

      <div className="impact-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1} aria-label={`${scenario.label}：${scenario.title}`}>{scenario.title}</h3>
        <p>{scenario.brief}</p>
      </div>

      <ScenarioFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={'leverage-margin-' + mode + '-' + scenario.id}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完整提交</b>
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从固定价账户账本，推进到 house margin、跨资产筹现、内生价格反馈和合成杠杆证据。你仍可从上方题目选择器回到任一题更新答案。</p>
          <strong>完成不等于“任何下跌都会触发螺旋”。闭环还需要杠杆敞口、可执行约束、有限现金缓冲、被迫交易与不足以吸收卖盘的市场深度同时成立。</strong>
          <div>
            <button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button>
          </div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算、反馈边界与识别强度仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <code>{scenario.calculation}</code>
          <strong>{scenario.reveal}</strong>
          <div>
            <button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button>
            <button type="button" className="impact-primary" onClick={nextScenario}>{nextLabel}</button>
          </div>
        </div>
      )}

      <p className="impact-lab-caveat"><b>实验边界：</b>八题均使用教学合约与冻结价格，不代表任何券商、交易所、CCP、repo、衍生品主协议及抵押品附件（ISDA / CSA）或监管规则，也不是法律或交易建议。真实复现必须保存资产与负债口径、gross/net exposure、抵押品、haircut、initial/maintenance/house margin、IM/VM、合格现金、call 与 cure 时钟、净额集合、账户层级、清算与违约规则、价格冲击、共同持有人及当时可得信息。</p>
    </div>
  );
}
