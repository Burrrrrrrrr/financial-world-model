'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'quote' | 'evidence';

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

const quoteScenarios: Scenario[] = [
  {
    id: 'direction-event',
    label: '报价 01 · 方向事件',
    title: '主动买单到达后，竞争性 ask 应当是多少？',
    brief: '报价者风险中性且竞争充分；知情者知道高低状态，非知情者等概率买卖。',
    facts: [
      { label: '共同价值', value: 'V ∈ {99, 101}', note: '高低状态先验各 50%' },
      { label: '知情到达概率', value: 'πᴵ = 0.20', note: '其余 80% 为非知情流量' },
      { label: '已观察事件', value: '主动买 B', note: '报价必须以买单已经到达为条件' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '100.00', diagnosis: '你使用了成交前的无条件均值，没有让买单事件更新状态概率。' },
      { id: 'b', label: '100.20', diagnosis: '正确：买单把高状态后验从 0.50 提高到 0.60，条件价值为 100.20。' },
      { id: 'c', label: '100.60', diagnosis: '你把 0.60 的后验概率直接当成了相对 100 的价格增量。' },
    ],
    calculation: 'P(B|H)=0.60，P(B|L)=0.40；P(H|B)=0.60；a=0.60×101+0.40×99=100.20。',
    reveal: 'ask 不是任意加价，而是“买单已经选择接受 ask”之后的条件共同价值。若仍报 100.00，报价者会在买单样本中系统性亏损。',
  },
  {
    id: 'signal-quality',
    label: '报价 02 · 信号质量',
    title: '知情者的信号并不完美时，竞争性 ask 应当是多少？',
    brief: '信号正确率 κ=0.80；知情者按信号方向交易，非知情者等概率买卖。',
    facts: [
      { label: '共同价值', value: 'V ∈ {90, 110}', note: '高低状态先验各 50%' },
      { label: '知情到达概率', value: 'πᴵ = 0.25', note: '信号正确率 κ=0.80' },
      { label: '已观察事件', value: '主动买 B', note: '方向有信息，但不会完全揭示状态' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '101.50', diagnosis: '正确：P(B|H)=0.575、P(B|L)=0.425，等先验下高状态后验为 0.575。' },
      { id: 'b', label: '102.50', diagnosis: '你把知情者的不完美信号当成了准确知道状态。' },
      { id: 'c', label: '100.00', diagnosis: '你完全忽略了买单方向所携带的似然信息。' },
    ],
    calculation: 'P(B|H)=0.25×0.80+0.75×0.50=0.575；P(B|L)=0.25×0.20+0.75×0.50=0.425；a=0.575×110+0.425×90=101.50。',
    reveal: 'πᴵ 描述知情流量的到达概率，κ 描述其信号质量；二者是不同参数。人数不变而信号更准确，也会扩大条件报价分离。',
  },
  {
    id: 'conditional-pnl',
    label: '报价 03 · 条件盈亏',
    title: '哪一本买单条件账本满足竞争性零预期利润？',
    brief: '共同价值高低为 99/101、等先验；πᴵ=0.40，竞争性 ask 已算得 100.40。',
    facts: [
      { label: '买单样本构成', value: '40% 知情，60% 非知情', note: '这里的比例只适用于已发生的买单样本' },
      { label: '知情买单状态', value: 'V = 101', note: '完美信号知情者只在高状态买' },
      { label: '非知情买单', value: 'E[V|noise buy] = 100', note: '其方向与状态独立' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '每一笔成交利润都为零', diagnosis: '零利润约束作用在条件成交混合的平均值上，不是逐笔保证。' },
      { id: 'b', label: '知情买单亏 0.40；非知情买单赚 0.60', diagnosis: '损益距离算反了：报价者以 100.40 卖出，在 V=101 时亏 0.60。' },
      { id: 'c', label: '知情买单亏 0.60；非知情买单平均赚 0.40；加权为零', diagnosis: '正确：对知情者的条件损失由非知情流量上的条件收益补偿。' },
    ],
    calculation: '报价者利润=a−V。知情买单：100.40−101=−0.60；非知情买单平均：100.40−100=+0.40；0.40×(−0.60)+0.60×0.40=0。',
    reveal: '正价差与竞争、零平均利润可以同时存在。价差重新分配的是不同对手类型之间的盈亏，不是保证每笔成交都无风险。',
  },
  {
    id: 'asymmetric-prior',
    label: '报价 04 · 非对称先验',
    title: '高状态先验不是 50% 时，买单后的 ask 应当是多少？',
    brief: '知情者准确知道状态；非知情者仍等概率买卖。',
    facts: [
      { label: '共同价值', value: 'V ∈ {80, 120}', note: 'P(H)=0.30，P(L)=0.70' },
      { label: '知情到达概率', value: 'πᴵ = 0.20', note: '高状态下 P(B|H)=0.60' },
      { label: '已观察事件', value: '主动买 B', note: '先验必须保留在贝叶斯分母中' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '92.00', diagnosis: '这是交易前的先验均值，没有根据买单更新。' },
      { id: 'b', label: '约 95.65', diagnosis: '正确：高状态后验约为 0.3913，条件价值约为 95.65。' },
      { id: 'c', label: '104.00', diagnosis: '这个答案偷偷把高低状态先验改回了 50/50。' },
    ],
    calculation: 'P(H|B)=0.60×0.30 / [0.60×0.30+0.40×0.70]=0.18/0.46≈0.3913；a=80+40×0.3913≈95.65。',
    reveal: '订单方向的含义取决于成交前状态。相同买单似然，在悲观先验下也未必把条件价值推到无条件中点以上。',
  },
];

const evidenceScenarios: Scenario[] = [
  {
    id: 'zero-inventory',
    label: '证据 01 · 隔离机制',
    title: '哪条机制足以解释竞争性 spread 扩大？',
    brief: '报价者风险中性，库存惩罚和处理成本都为零；价值范围不变，只有 πᴵ 从 0.10 升至 0.40。',
    facts: [
      { label: '库存项', value: '0', note: '自身持仓偏离不产生惩罚' },
      { label: '处理成本', value: '0', note: 'tick 与费用也不变' },
      { label: '对手构成', value: '知情到达概率上升', note: '交易方向对价值状态更有诊断力' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'Inventory risk', diagnosis: '题设已把库存惩罚隔离为零，不能用持仓风险解释变化。' },
      { id: 'b', label: 'Processing cost / tick', diagnosis: '处理成本和最小价格单位没有改变，无法解释比较静态。' },
      { id: 'c', label: 'Conditional adverse selection', diagnosis: '正确：成交方向更能区分价值状态，条件 bid 与 ask 因而进一步分离。' },
    ],
    calculation: '对称、完美信号教学特例中，spread=πᴵ(vH−vL)。价值范围固定而 πᴵ 上升，信息型价差随之扩大。',
    reveal: '逆向选择关注“什么类型的对手更会选择击中报价”；库存风险关注成交后报价者自己持有什么仓位。两条路径可以同时存在，但不是同一状态变量。',
  },
  {
    id: 'public-announcement',
    label: '证据 02 · 公告窗口',
    title: '单凭这条交易后路径，最稳健的结论是什么？',
    brief: '买单成交后 1 毫秒，预定公共公告发布；所有相关场所几乎同时上涨 30 bp。',
    facts: [
      { label: '成交', value: 't = 0', note: '主动买单发生' },
      { label: '公共公告', value: 't = 1 ms', note: '已知的共同信息冲击' },
      { label: '跨场所价格', value: '+30 bp', note: '近乎同步上移' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '只能确认该窗口的 signed mid response；尚不能识别交易者类型或私人信息贡献', diagnosis: '正确：交易与公告的时间邻近不足以构造无公告、无交易的反事实。' },
      { id: 'b', label: '买方必然事先知道公告内容', diagnosis: '公共新闻与时间错位是直接替代解释；路径本身不能证明私人信息。' },
      { id: 'c', label: '30 bp 全部是该订单的 mechanical impact', diagnosis: '跨场所同步变动要求首先审计共同新闻，不能把全部路径归给本地订单。' },
    ],
    calculation: '可观察量是 D·(mₜ₊ₕ−mₜ)=+30 bp；交易者类型、无交易价格和无公告价格都没有被同时观察。',
    reveal: '买后涨既可能来自信息优势，也可能来自公共新闻、流量选择、扫簿或其他市场先动。这条 signed mid response 是证据入口，不是身份判决；没有成交价就不能进一步计算主动方 markout。',
  },
  {
    id: 'pin-estimate',
    label: '证据 03 · 日度计数',
    title: '模型拟合得到 PIN=0.32，哪种表述最准确？',
    brief: '数据还存在日内季节性、到达过度离散和订单拆分；模型没有观察交易者法律身份。',
    facts: [
      { label: '估计结果', value: 'PIN = 0.32', note: '来自指定混合到达模型的参数估计' },
      { label: '潜在对象', value: 'information event / trader type', note: '不能逐笔直接观察' },
      { label: '规格风险', value: '季节性、过度离散、拆单', note: '真实到达可能偏离 Poisson 假设' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '32% 成交已经确认属于违法内幕交易', diagnosis: 'PIN 不观察法律义务、重大非公开信息或个人身份。' },
      { id: 'b', label: '在该混合到达模型及其假设下，模型隐含知情成交概率的估计为 0.32', diagnosis: '正确：数值、估计对象与成立条件都被保留下来。' },
      { id: 'c', label: '32% 的价格变化由信息造成', diagnosis: 'PIN 的分母是成交到达强度，不是收益变动或价差分解。' },
    ],
    calculation: 'PIN=α_event·μᴵ / (α_event·μᴵ+εᴮ+εˢ)。它是参数化到达模型中的无条件成交来源概率。',
    reveal: '结构估计把不可见类型映射到可见买卖计数，但映射依赖生成模型。拟合数值不是逐笔标签，更不是违法概率。',
  },
  {
    id: 'vpin-statistic',
    label: '证据 04 · 成交量时钟',
    title: 'VPIN=0.82 时，哪种表述最稳健？',
    brief: '统计量由固定量桶、bulk volume classification 和 50 桶滚动窗口构造。',
    facts: [
      { label: '量桶', value: '固定总成交量', note: '时间随市场活跃度快慢变化' },
      { label: '方向量', value: '由分类规则估计', note: '不是逐笔真实身份记录' },
      { label: '滚动统计', value: 'VPIN = 0.82', note: '依赖桶宽、窗口与分类方法' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '下一次崩盘的概率为 82%', diagnosis: 'VPIN 不是校准后的危机概率预测器。' },
      { id: 'b', label: '82% 成交由 informed trader 发起', diagnosis: 'VPIN 统计买卖量失衡，不逐笔识别知情类型。' },
      { id: 'c', label: '在所选分类、桶宽和窗口下，近期归一化买卖量失衡较高', diagnosis: '正确：陈述只覆盖这个构造能够直接支持的对象。' },
    ],
    calculation: 'VPIN=(1/n)Σ|Vᵢᴮ−Vᵢˢ|/V_bucket；0.82 是滚动量失衡统计，不是 82% 的交易者类型或事件概率。',
    reveal: 'VPIN 与经典 PIN 不是同一估计量。高值可以提示所选 volume-time 构造中的失衡，却必须接受分类、交易强度和参数敏感性审计。',
  },
];

function AdverseSelectionFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" aria-label="题目原始事实">
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

export default function AdverseSelectionLab() {
  const [mode, setMode] = useState<Mode>('quote');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'quote' ? quoteScenarios : evidenceScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;

  useEffect(() => {
    if (revealed) {
      resultRef.current?.focus();
      return;
    }
    if (pendingFocusRef.current === 'question') questionTitleRef.current?.focus();
    if (pendingFocusRef.current === 'option') firstOptionRef.current?.focus();
    pendingFocusRef.current = null;
  }, [mode, scenarioIndex, revealed]);

  function reset(nextMode = mode, nextIndex = scenarioIndex) {
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setChoice('');
    setRevealed(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode) return;
    pendingFocusRef.current = 'question';
    reset(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex) return;
    pendingFocusRef.current = 'question';
    reset(mode, nextIndex);
  }

  function retryScenario() {
    pendingFocusRef.current = 'option';
    reset();
  }

  function nextScenario() {
    pendingFocusRef.current = 'question';
    reset(mode, (scenarioIndex + 1) % scenarios.length);
  }

  return (
    <div className="adverse-selection-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>ADVERSE SELECTION · UPDATE → AUDIT</span>
          <h3>先预测条件报价，再判断证据究竟支持到哪一层</h3>
        </div>
        <p>两种模式各四题。提交前只给事实；后验计算、误区诊断与证据边界在作答后揭示。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="逆向选择实验模式">
        <button type="button" aria-pressed={mode === 'quote'} onClick={() => selectMode('quote')}>
          <span>MODE A</span><b>状态与条件报价</b><small>Bayes、ask/bid 与条件盈亏</small>
        </button>
        <button type="button" aria-pressed={mode === 'evidence'} onClick={() => selectMode('evidence')}>
          <span>MODE B</span><b>证据与机制归因</b><small>库存、markout、PIN 与 VPIN</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${mode === 'quote' ? '状态与条件报价' : '证据与机制归因'}题目`}>
        {scenarios.map((item, index) => (
          <button type="button" key={item.id} aria-pressed={index === scenarioIndex} onClick={() => selectScenario(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>{item.label.split(' · ')[1]}
          </button>
        ))}
      </div>

      <div className="impact-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1}>{scenario.title}</h3>
        <p>{scenario.brief}</p>
      </div>

      <AdverseSelectionFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={`adverse-selection-${mode}-${scenario.id}`}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {!revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={() => setRevealed(true)}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。后验计算、误区诊断与机制边界仍被锁定。</p>
        </>
      ) : (
        <div className={`impact-result ${correct ? 'correct' : ''}`} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <code>{scenario.calculation}</code>
          <strong>{scenario.reveal}</strong>
          <div>
            <button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button>
            <button type="button" className="impact-primary" onClick={nextScenario}>下一题</button>
          </div>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {revealed ? (correct ? '判断成立，计算与机制解释已显示。' : '需要修正，诊断、计算与机制解释已显示。') : ''}
      </p>

      <p className="impact-lab-caveat"><b>实验边界：</b>这些题用于学习生成模型与证据审计，不是交易者识别系统，也不能判断违法行为。真实报价还受库存、成本、竞争、tick、速度、场所规则和未建模状态影响。</p>
    </div>
  );
}
