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
    id: 'basis-sign-scale',
    label: '执行账本 01 · Sign & scale',
    title: '先冻结符号、时钟与分母：这条股指期货基差究竟是多少？',
    brief: '题面把 basis 明确定义为 B=F−S，使用同一时点的期货与现货中点。现货 bid/ask 为 999/1,001，90 天期货 bid/ask 为 1,013/1,015；采用 360 天简单年化，不计股息、融资与交易成本。这里只计算 gross quoted basis，不判断套利。',
    facts: [
      { label: 'Convention', value: 'B = F − S', note: '正值称 futures premium；不足以单独判断期限结构' },
      { label: 'Synchronized quotes', value: 'S 999/1,001 · F 1,013/1,015', note: '先分别取同一时点中点' },
      { label: 'Tenor', value: '90 / 360 year', note: '简单年化，不做复利' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'B=−14 点，年化 −5.6%；期货贴水', diagnosis: '这把另一种常见的 S−F 符号习惯偷偷带入题面。任何基差数字都必须与定义一起报告，不能只凭“basis”一词判断正负。' },
      { id: 'b', label: 'B=+14 点，简单年化 +5.6%；期货升水，但尚未证明有套利', diagnosis: '正确：中点分别为 1,000 与 1,014；按题设 F−S 得 +14。年化只改变尺度，不会自动扣除公平 carry。' },
      { id: 'c', label: 'B=+16 点，年化 +6.4%；应以 futures ask 减 spot bid', diagnosis: '1,015−999 是跨越两侧报价得到的最大显示差，不是中点基差；若检验套利，还必须按交易方向选择可执行两腿并加入 carry。' },
    ],
    calculation: 'S_mid=(999+1,001)/2=1,000；F_mid=(1,013+1,015)/2=1,014；B=F_mid−S_mid=14 点；简单年化=14/1,000×360/90=5.6%。',
    reveal: '“基差”至少需要四个标签：符号定义、现货代理、期货合约月份与时间戳。14 点只是 raw basis；先用同一状态的公平 carry 得到 residual basis（ε），再经过可执行 bid / ask 与成本带检验，才接近可交易的相对价值偏离。',
  },
  {
    id: 'cash-and-carry',
    label: '执行账本 02 · Cash-and-carry',
    title: '期货高于可复制终值时，一份现金—期货套利的净利润是多少？',
    brief: '某股指篮子的可成交 ask 为 200.00 点，距到期半年；按简单融资率 4%，买入现货的到期融资本息为 204.00 点。到期前已知现金股息的到期价值合计 3.20 点，因此复制一份到期指数暴露的净终值成本为 200.80 点。期货可按 bid 204.50 卖出，其他双腿成本为 0.45 点，乘数为每点 100 元。',
    facts: [
      { label: 'Cash replication', value: '204.00 − 3.20', note: '融资本息减收到并滚存至到期的股息' },
      { label: 'Futures execution', value: 'sell bid 204.50', note: '卖期货使用买方报价' },
      { label: 'Other costs / multiplier', value: '0.45 · ¥100/point', note: '题面合并后的额外成本' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '买现货、卖期货；每份净赚 3.25 点，即每张合约 325 元', diagnosis: '正确：期货 bid 超过完整复制终值 3.70 点；再扣除 0.45 点其他成本，留下 3.25 点。' },
      { id: 'b', label: '买期货、卖现货；每张净赚 450 元，因为期货相对现货升水 4.50 点', diagnosis: '期货升水本身首先补偿融资并扣除股息。忽略 carry 会把正常的 3.70 点复制差额误当成额外利润，并把方向写反。' },
      { id: 'c', label: '没有利润；期货与现货到期必相等，所以中途任何价差都会自动消失', diagnosis: '到期收敛给出终端关系，不会替交易者支付初始买卖价差、融资或持仓成本。这里题面已经给出正的成本后闭环。' },
    ],
    calculation: '复制终值=204.00−3.20=200.80；每点净利润=204.50−200.80−0.45=3.25；每张合约=3.25×100=325 元。',
    reveal: 'Cash-and-carry 的完整方向是：按 ask 买入可交付或可复制现货、融资持有、收取资产收入，同时按 bid 卖出匹配期货；到期用现货价值或结算现金闭环。真正的上界由可执行成本决定，而不是由一条无摩擦公式单独决定。',
  },
  {
    id: 'reverse-cash-and-carry',
    label: '执行账本 03 · Reverse carry',
    title: '期货看起来过低时，反向现金—期货套利为什么必须先通过借券门槛？',
    brief: '某可借资产可按 spot bid 80.00 元卖空，卖空所得获准以 3% 简单年利率投资 90 天，到期为 80.60 元；同时按 futures ask 78.90 元买入期货。到期前需向出借人补偿股息 0.50 元，借券与双腿执行成本合计 0.42 元。合约乘数为 500；题面假设借券可以锁定至到期且期货最终交付同一资产。',
    facts: [
      { label: 'Short-sale proceeds', value: '80.00 → 80.60', note: '只有允许使用并投资卖空所得时才成立' },
      { label: 'Futures execution', value: 'buy ask 78.90', note: '买期货使用卖方报价' },
      { label: 'Dividend / borrow & execution', value: '0.50 / 0.42', note: '均按每单位到期金额给定' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '每单位赚 1.10 元、每张 550 元；股息和借券成本与卖空者无关', diagnosis: '卖空者必须把资产收入补偿给出借人，并支付借券和执行成本；只算 80.00−78.90 会高估利润。' },
      { id: 'b', label: '每单位亏 0.78 元；卖空所得的利息应从收益中扣除', diagnosis: '题设允许卖空所得投资，利息是该闭环的收入而非支出。只有在法律或账户规则限制其使用时，才需要改写账本。' },
      { id: 'c', label: '每单位净赚 0.78 元、每张 390 元；但任何借券召回都会破坏“锁定”前提', diagnosis: '正确：到期投资价值减期货买入、股息补偿和所有成本，留下 0.78 元；题面额外冻结了现实中最关键的借券期限风险。' },
    ],
    calculation: '每单位净利润=80.60−78.90−0.50−0.42=0.78 元；每张=0.78×500=390 元。',
    reveal: '反向套利通常比正向套利更脆弱：卖空所得可能受限，借券费会跳升，证券可被召回，股息或公司行动需要补偿，实物交割资产还必须完全匹配。因此现实无套利区间往往不对称，下界甚至可能暂时失去可执行的纠偏者。',
  },
  {
    id: 'variation-margin-ledger',
    label: '执行账本 04 · Variation margin',
    title: '逐日盯市没有改变最终期货损益，却把多大的途中现金需求提前了？',
    brief: '交易者在 4,020 点卖出一张现金结算期货，合约乘数为每点 50 元。随后四个结算价依次为 4,050、3,990、4,005、4,000。忽略保证金利息和手续费；每日损益都立即进入保证金账户。',
    facts: [
      { label: 'Short entry', value: '4,020', note: '卖方在价格下跌时获利' },
      { label: 'Daily settlements', value: '4,050 → 3,990 → 4,005 → 4,000', note: '逐日现金结算路径' },
      { label: 'Multiplier', value: '¥50 / point', note: '每点损益换成现金' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '最终赚 1,000 元，途中没有现金缺口，因为终点低于开仓价', diagnosis: '最终损益正确，但第一天期货上涨 30 点，空头须先支付 1,500 元 variation margin；未来盈利不能自动替代今天现金。' },
      { id: 'b', label: '最终赚 1,000 元；最大累计现金流出为第一天的 1,500 元', diagnosis: '正确：每日点数损益为 −30、+60、−15、+5，累计为 −30、+30、+15、+20；最低累计点数是 −30。' },
      { id: 'c', label: '最终赚 4,000 元；把四天绝对波动 30+60+15+5 全部相加', diagnosis: '逐日盯市结算有正有负；绝对波动是现金周转量的一种描述，不是终端净损益。最终仍等于开仓价减最终结算价。' },
    ],
    calculation: '空头每日点数现金流：4,020−4,050=−30；4,050−3,990=+60；3,990−4,005=−15；4,005−4,000=+5。累计终值=+20×50=1,000 元；最低累计值=−30×50=−1,500 元。',
    reveal: '期货与远期在确定利率等简化条件下可以有相同理论交割价，但现金流时点不同。逐日盯市把浮亏变成即时流动性需求，把浮盈变成可再投资现金；利率与价格共同随机时，这种再投资路径还会使 futures 与 forward value 出现差异。',
  },
];

const systemScenarios: Scenario[] = [
  {
    id: 'fair-value-not-forecast',
    label: '系统诊断 01 · Fair value ≠ forecast',
    title: '利率上升后股指期货升水反而缩小，这能说明市场突然转为看跌吗？',
    brief: '同一现货指数保持 5,000 点、距到期 90 天。旧状态下简单融资率为 4%，预计到期前股息终值 35 点；新状态融资率升至 5%，但预计股息终值同时升至 55 点。忽略交易成本，并采用 F*=S(1+rT)−D、T=0.25。',
    facts: [
      { label: 'Spot / tenor', value: '5,000 · T=0.25', note: '现货与期限不变' },
      { label: 'Old carry', value: 'r=4% · D=35', note: '融资 50 点，股息 35 点' },
      { label: 'New carry', value: 'r=5% · D=55', note: '融资 62.5 点，股息 55 点' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '公平升水由 15 点缩至 7.5 点；这可完全由 carry 变化解释，不能单独推出看跌预期', diagnosis: '正确：更高利率扩大升水，但更高预期股息以更大幅度压低期货；净效应是公平基差收窄。' },
      { id: 'b', label: '利率上升必使升水扩大到 27.5 点；股息只影响现货，不进入期货公平价值', diagnosis: '持有现货会收到股息，而期货多头在合约价格里不直接获得这笔收入，因此预期股息是公平 carry 的核心组成。' },
      { id: 'c', label: '升水缩小证明期货交易者预期指数到期下跌 7.5 点', diagnosis: '期货价格不是无条件预期的机械读数；无套利 carry、风险溢价、交易成本和约束都能改变期现关系。' },
    ],
    calculation: '旧 F*=5,000×(1+0.04×0.25)−35=5,015，公平基差 +15；新 F*=5,000×(1+0.05×0.25)−55=5,007.5，公平基差 +7.5。',
    reveal: '观察到的升贴水至少要分成公平 carry 与 residual basis（ε）。只有在利率、股息、税费、时钟、合约和执行成本可比后，残余变化才可能被研究为需求、风险溢价或约束状态；它仍不是对未来方向的无模型民调。',
  },
  {
    id: 'one-sided-band',
    label: '系统诊断 02 · One-sided band',
    title: '期货跌破理论下界，却没有交易者把它立刻买回去：最关键的缺失条件是什么？',
    brief: '某市场在正常借券条件下的可执行期货区间为 [98.90, 101.80]；当前 futures bid/ask 为 98.10/98.20。此时现货可正常买入，但该资产全面暂停新借券，已有借券还可被召回。题面下界来自“卖空现货、买期货”的 reverse cash-and-carry。',
    facts: [
      { label: 'Executable band', value: '[98.90, 101.80]', note: '按正常双向融资状态估计' },
      { label: 'Futures quote', value: '98.10 / 98.20', note: 'ask 低于旧下界 0.70' },
      { label: 'Borrow state', value: 'new borrow unavailable', note: '反向现货腿无法建立' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '买期货即可锁定 0.70，因为到期收敛不需要另一条交易腿', diagnosis: '单独买期货留下完整方向风险。所谓锁定利润要求同时建立并维持卖空现货腿，而该腿在题设中不可用。' },
      { id: 'b', label: '改做买现货、卖期货即可；任何一侧的套利方向都能修复任何符号的偏离', diagnosis: '买现货、卖期货约束的是期货过贵的上界；当期货过低时，这一方向会扩大而非锁定当前偏离。' },
      { id: 'c', label: '旧下界已经失去可执行基础；借券不可得使价格带不对称，贴水可以持续', diagnosis: '正确：无套利界不是脱离交易技术的数学常数。缺少可锁定的现货空头，反向闭环不存在。' },
    ],
    calculation: '按旧参数，reverse carry 的显示边际=98.90−98.20=0.70；但反向可执行数量为 0，因此可锁定总利润为 0，而不是 0.70×任意规模。',
    reveal: '价格越过旧模型边界只说明模型状态已经改变。研究者必须同时更新借券可得性、haircut、卖空所得使用限制、涨跌停、交割资格和资本限额；当一侧约束绑定时，基差分布会偏斜，而不是围绕零对称扩散。',
  },
  {
    id: 'treasury-ctd',
    label: '系统诊断 03 · CTD & implied repo',
    title: '两只国债都可交割，为什么 raw basis 更小的那只不一定是真正的 cheapest-to-deliver？',
    brief: '同一期货合约的两只可交割券已经按各自 conversion factor 计算。A 券显示 gross basis 0.12 点、考虑融资与期间票息后的 implied repo rate 为 4.30%；B 券显示 gross basis 0.18 点、implied repo rate 为 4.70%。锁定至交割日的实际 repo cost 为 4.45%，其他交割成本暂忽略。空头可以在合约规则允许的篮子中选择交割券。',
    facts: [
      { label: 'Bond A', value: 'basis 0.12 · IRR 4.30%', note: '低 raw basis，但 carry 较弱' },
      { label: 'Bond B', value: 'basis 0.18 · IRR 4.70%', note: '高 raw basis，但票息时点更有利' },
      { label: 'Locked repo', value: '4.45%', note: '与 IRR 同期限同年化口径' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'A 是 CTD，因为 cheapest-to-deliver 按 raw basis 最小机械决定；A 还净赚 0.15%', diagnosis: '完整交割经济价值要计入现金价格、conversion factor、应计、票息及融资时点。A 的 IRR 低于 repo cost，题面并未给出正净 carry。' },
      { id: 'b', label: 'B 是题设 CTD，因为 IRR 最高；相对锁定 repo 的毛年化优势约 0.25%', diagnosis: '正确：在这些冻结假设下，空头选择能产生最高交割回报的 B；4.70%−4.45%=0.25%，仍须扣执行、资本和期权价值。' },
      { id: 'c', label: '两只券都不是 CTD，因为 conversion factor 会让所有可交割券拥有完全相同的经济价值', diagnosis: 'Conversion factor 只做标准化近似；不同票息、到期、repo specialness 与交割选择权仍会产生相对价值和 CTD 切换。' },
    ],
    calculation: '在题设同口径下，选择 max(IRR_A,IRR_B)=4.70%，所以 B 为 CTD；其相对锁定 repo 的毛优势=4.70%−4.45%=0.25%/年。',
    reveal: '国债期货没有一只固定“底层债券”。必须先列出 deliverable basket，再逐券计算 invoice、coupon、accrued interest、repo、haircut 与交割日选择；CTD 可能随收益率、repo specialness 和时间改变，DV01 hedge ratio 也会随之跳变。',
  },
  {
    id: 'margin-feedback',
    label: '系统诊断 04 · Margin liquidity',
    title: '终端收敛利润仍为正，为什么高杠杆 basis desk 还是可能被迫平仓？',
    brief: '某 Treasury basis 组合持有 1,000 万美元现金券并卖出匹配期货。初始 repo haircut 为 2%，期货初始保证金为 10 万美元；模型预计持有至交割的剩余毛利润为 3 万美元。压力日 repo haircut 升至 6%，清算与经纪商另要求补充 15 万美元期货保证金，且 cash bond bid 变薄。假设终端交割条款没有变化。',
    facts: [
      { label: 'Cash leg', value: '$10m · haircut 2% → 6%', note: '额外融资自有资金需求 $400k' },
      { label: 'Futures liquidity', value: '+$150k margin call', note: '立即可支付现金需求' },
      { label: 'Terminal gross edge', value: '$30k', note: '只有坚持到交割才可能实现' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '组合需额外筹集 55 万美元；终端正利润不能替代今天的现金，融资约束可迫使两腿同时平仓', diagnosis: '正确：haircut 增量为 1,000 万×4%=40 万，再加 15 万保证金。其现金需求远大于题设终端毛边际。' },
      { id: 'b', label: '只需 3 万美元，因为最大现金需求永远等于最终套利利润', diagnosis: '期货保证金与 repo haircut 按风险敞口和价格路径决定，不以终端利润为上限；高杠杆收敛交易的核心正是现金时序错配。' },
      { id: 'c', label: '无需增资；同一方向的 cash bond 浮盈会自动抵消所有 margin call', diagnosis: '两腿可能在不同清算、托管和融资账户，现金券价值也可能下跌且 bid 变薄。经济对冲不保证即时、跨账户的现金净额。' },
    ],
    calculation: '新增 repo equity=10,000,000×(6%−2%)=$400,000；再加 futures margin $150,000；总即时现金需求=$550,000，是剩余 $30,000 毛边际的 18.3 倍。',
    reveal: '“最终会收敛”回答的是终端相对价格，不回答谁能活到终点。basis 扩大、VM、haircut、repo 不续作、dealer balance-sheet 收缩和 cash-market impact 可以形成正反馈：被迫卖现货、回补期货，进一步改变基差并消耗其他机构容量。',
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
        <article key={`${scenario.id}:${fact.label}:${fact.value}`}>
          <span>{fact.label}</span>
          <b>{fact.value}</b>
          <p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function FuturesBasisLab() {
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

  const modeLabel = mode === 'ledger' ? '定义与执行账本' : '约束与系统诊断';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'system' && mode === 'ledger'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '继续下一道未答题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>BASIS · CARRY · SETTLEMENT · FUNDING CAPACITY</span>
          <h3>先让期现两腿、收入与现金时钟完全闭合，再判断基差是正常 carry、可执行偏离，还是融资约束的影子</h3>
        </div>
        <p>两种模式各四题。Mode A 计算符号与尺度、双向套利和逐日现金流；Mode B 诊断公平价值、单侧套利带、国债交割选择与保证金反馈。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="期货基差与期现套利实验模式">
        <button type="button" aria-pressed={mode === 'ledger'} onClick={() => selectMode('ledger')}>
          <span>MODE A</span><b>Definition &amp; Ledger</b><small>基差口径、双向执行套利与逐日结算</small>
        </button>
        <button type="button" aria-pressed={mode === 'system'} onClick={() => selectMode('system')}>
          <span>MODE B</span><b>Constraints &amp; System</b><small>公平 carry、非对称边界、CTD 与流动性反馈</small>
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
              name={'futures-basis-' + mode + '-' + scenario.id}
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
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从基差符号、双向复制和 variation margin，推进到公平 carry、单侧约束、CTD 与融资流动性反馈。你仍可从上方题目选择器返回任一题更新答案。</p>
          <strong>完成不等于“会套公式”。面对任何基差，先冻结合约、时钟、符号和单位，再重建两腿现金流与可执行容量；最后才讨论偏离反映了预期、风险溢价、便利收益，还是中介约束。</strong>
          <div><button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button></div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算过程、适用条件与机制诊断仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>八题使用冻结报价、简化利率与假设性执行条件，只用于教学，不构成投资、交易、税务或法律建议。真实 cash-and-carry 还要逐项核对合约乘数、交割 / 现金结算规则、现货复制误差、bid / ask 与深度、股息和票息时点、repo 与借券、保证金净额、税费、账户隔离、限仓、涨跌停及清算会员附加要求；到期收敛也不保证任何参与者能够无成本持有至终点。</p>
    </div>
  );
}
