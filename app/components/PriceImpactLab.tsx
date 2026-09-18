'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'measure' | 'identify';

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

const measureScenarios: Scenario[] = [
  {
    id: 'sweep-vwap',
    label: '测量 01 · 扫过多档',
    title: '买入 900 股扫过三档 ask，成交 VWAP 与相对 arrival mid 的滑点是多少？',
    brief: '假设下单前 mid=100.00，忽略手续费；最后一笔价格不等于平均成交价。',
    facts: [
      { label: 'Ask 1', value: '100.01 × 300', note: '先成交 300 股' },
      { label: 'Ask 2', value: '100.02 × 500', note: '再成交 500 股' },
      { label: 'Ask 3', value: '100.04 × 400', note: '只需其中 100 股' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'VWAP=100.0400；滑点 +4.00 bp', diagnosis: '你把最后一档的成交价当成了全部 900 股的平均价。' },
      { id: 'b', label: 'VWAP=100.0200；滑点 +2.00 bp', diagnosis: '中间档价格不是按成交量加权的结果；第一档和第三档都必须进入计算。' },
      { id: 'c', label: 'VWAP≈100.0189；滑点约 +1.89 bp', diagnosis: '正确：三档成交现金额加总后除以 900，再与 arrival mid 比较。' },
    ],
    calculation: '(300×100.01 + 500×100.02 + 100×100.04) / 900 = 100.0189；(100.0189/100.00−1)×10,000 ≈ 1.89 bp。',
    reveal: '这个数同时包含了半个 spread 与扫过深度的成本。它是实现的成交滑点，不是已被识别的“纯市场冲击”。',
  },
  {
    id: 'implementation-shortfall',
    label: '测量 02 · Implementation shortfall',
    title: '目标买入 1,000 股，但只成交 800 股。把未成交机会成本也算入时，shortfall 是多少？',
    brief: '决策价为 50.00；买入的正 shortfall 表示成本高于纸面组合。',
    facts: [
      { label: '已成交 1', value: '600 @ 50.10', note: '相对决策价 +0.10' },
      { label: '已成交 2', value: '200 @ 50.20', note: '相对决策价 +0.20' },
      { label: '未成交', value: '200；期末价 50.40', note: '放弃部分的机会成本' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '$180；相对目标名义金额为 36 bp', diagnosis: '正确：已成交成本 $100，未成交机会成本 $80，合计 $180。' },
      { id: 'b', label: '$100；20 bp', diagnosis: '这只计了已成交部分，把未成交的 200 股当成了无成本。' },
      { id: 'c', label: '$320；64 bp', diagnosis: '你把未成交 200 股的全部期末市值当成成本；机会成本只是期末价与决策价的差。' },
    ],
    calculation: '600×(50.10−50.00) + 200×(50.20−50.00) + 200×(50.40−50.00) = 60+40+80 = $180；$180 / $50,000 = 36 bp。',
    reveal: 'Implementation shortfall 是决策组合与真实组合的总差异，它可包含 spread、fee、timing、impact 与未成交机会成本；不能把总 shortfall 全部归因于 impact。',
  },
  {
    id: 'peak-decay',
    label: '测量 03 · Peak 与 decay',
    title: '一笔买入 metaorder 从 mid=100.00 开始，结束时 mid=100.30，30 分钟后为 100.12。哪个陈述正确？',
    brief: '以开始 mid 为基准，买入方向为正；不要把有限观察窗口的残留直接命名为 permanent impact。',
    facts: [
      { label: '开始', value: '100.00', note: 'arrival mid' },
      { label: '执行结束 T', value: '100.30', note: 'peak signed markout = +30 bp' },
      { label: 'T+30 min', value: '100.12', note: '有限期残留 = +12 bp' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '暂时冲击=30 bp；永久冲击=12 bp', diagnosis: '这个路径能描述 peak 与有限期残留，却没有识别反事实，不足以把两者分别命名为纯暂时和永久冲击。' },
      { id: 'b', label: 'Peak=30 bp；已观察回落=18 bp；残留比例=40%', diagnosis: '正确：这些都是可直接由路径计算的描述量，没有越界声称因果或无限期极限。' },
      { id: 'c', label: '已回落 12 bp；残留比例=60%', diagnosis: '你把残留幅度与已回落幅度对调了：从 30 bp 降到 12 bp，已回落 18 bp。' },
    ],
    calculation: 'Peak=(100.30/100.00−1)×10,000=30 bp；decay=30−12=18 bp；residual ratio=12/30=40%。',
    reveal: '“结束后仍在”不等于“永久”。公共新闻、订单选择、同向其他流量与对冲买卖都可以改变后续路径。',
  },
  {
    id: 'average-marginal',
    label: '测量 04 · Average 与 marginal',
    title: '若归一化总执行成本为 C(q)=2q^(3/2)，在 q=4 时平均成本与边际成本分别是多少？',
    brief: 'q 为预先定义的数量单位；C/q 是平均每单位成本，dC/dq 是再增加一个微小单位的边际成本。',
    facts: [
      { label: '总成本函数', value: 'C(q)=2q^(3/2)', note: '凹价格响应仍可导致凸的总成本' },
      { label: '评估点', value: 'q=4', note: '√q=2' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '平均=6；边际=4', diagnosis: '边际成本应当高于平均成本；你把两者对调了。' },
      { id: 'b', label: '平均=4；边际=4', diagnosis: '对非线性总成本，平均与导数不会一般相等。' },
      { id: 'c', label: '平均=4；边际=6', diagnosis: '正确：C/q=2√q=4；dC/dq=3√q=6。' },
    ],
    calculation: 'C(4)=2×4^(3/2)=16；average=16/4=4；marginal=C′(4)=3√4=6。',
    reveal: '一条“凹的 impact curve”不意味总成本也凹。对数量的平均价格让步随 q^½ 增长时，总成本随 q^(3/2) 增长，边际单位比已执行的平均单位更贵。',
  },
];

const identifyScenarios: Scenario[] = [
  {
    id: 'response-causality',
    label: '识别 01 · 交易后路径',
    title: '策略只在预测未来上涨 20 bp 时才买入，某次执行后价格实现上涨 35 bp。单凭这条路径能识别什么？',
    brief: '相关新闻与选择信号会同时影响买入决定和未来价格。',
    facts: [
      { label: '事前模型预测', value: '+20 bp', note: '触发了买入选择' },
      { label: '实现 signed markout', value: '+35 bp', note: '实际价格路径' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '因果 impact 就是 35 bp', diagnosis: '你把交易后的全部价格变化都归给了自己，忽略了原本会发生的市场路径。' },
      { id: 'b', label: '可观察的 signed markout 为 35 bp；因果 impact 仍未识别', diagnosis: '正确：缺少“不交易时会发生什么”的反事实，单一路径只能提供描述量。' },
      { id: 'c', label: '因果 impact 必然是 15 bp', diagnosis: '35−20 只在事前预测是正确的反事实条件均值且无其他创新时才有特定解释；这些条件未由一次观察证明。' },
    ],
    calculation: '可观察：s·(m_future−m_arrival)=+35 bp。不可观察：同一世界状态下若不下单的 m_future(0)。',
    reveal: '市场 impact 是一个反事实概念，price response 是一个条件平均。选择性下单让二者尤其容易被混淆。',
  },
  {
    id: 'square-root-scale',
    label: '识别 02 · Square-root 尺度',
    title: '在教学性平方根规格 I=Y·σ·√(Q/V) 中，Y=0.8、日波动率=2%、Q/V=1%，预测 peak impact 是多少？',
    brief: 'σ 和 Q/V 都用小数；这是给定规格下的条件均值，不是无条件定律。',
    facts: [
      { label: '日波动率 σ', value: '0.02', note: '2%' },
      { label: '日成交占比 Q/V', value: '0.01', note: '√0.01=0.1' },
      { label: '系数 Y', value: '0.8', note: '样本与口径特定' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '0.16%，即 16 bp', diagnosis: '正确：0.8×0.02×0.1=0.0016=0.16%=16 bp。' },
      { id: 'b', label: '1.60%，即 160 bp', diagnosis: '百分比与小数换算多了一个数量级。' },
      { id: 'c', label: '0.016%，即 1.6 bp', diagnosis: '你在从小数转为百分比时少了一个数量级。' },
    ],
    calculation: 'I=0.8×0.02×√0.01=0.0016；0.0016×10,000=16 bp。',
    reveal: '该式通过波动率和成交占比实现无量纲缩放，但 Y、指数、波动口径、volume 口径与所指的 impact horizon 都必须另行估计。',
  },
  {
    id: 'impact-surface',
    label: '识别 03 · 同量、异速',
    title: '两笔 metaorder 都等于日成交量的 1%：A 在 10 分钟内以 50% 参与率执行，B 用 2 小时以 5% 参与率执行。哪个结论最稳健？',
    brief: '总数量占比相同，但速度、持续时间和执行期间市场容量不同。',
    facts: [
      { label: 'Metaorder A', value: 'Q/Vday=1%；POV=50%', note: '短且急' },
      { label: 'Metaorder B', value: 'Q/Vday=1%；POV=5%', note: '长且慢' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'A 的真实 impact 必然是 B 的 10 倍', diagnosis: '参与率相差 10 倍不会机械转化为 impact 相差 10 倍；函数形状和恢复都未定。' },
      { id: 'b', label: '两者 impact 必然完全相同', diagnosis: '仅用 Q/Vday 的规格会给出相同预测，但这是模型限制，不是真实世界必然相同。' },
      { id: 'c', label: '尺寸单变量规格无法区分；应估计 size–participation–duration surface', diagnosis: '正确：先承认两笔单在单变量模型中不可区分，再用预先定义的多维规格检验速度与持续时间的增量信息。' },
    ],
    calculation: '两者在 I=Yσ√(Q/Vday) 中的输入完全相同；差异只会在加入 POV、T 与恢复状态后进入模型。',
    reveal: '“平方根定律”常是第一个基线，而不是让参与率、持续时间、日内时段与流动性状态消失的理由。',
  },
  {
    id: 'dynamic-arbitrage',
    label: '识别 04 · Round-trip 审计',
    title: '研究者任意拼接一条强凹即时 impact 函数与一个快速回落 kernel。对买入后卖出的 round trip，最低必须检查什么？',
    brief: '比较完整买入—等待—卖出路径，而不是只看其中某一笔交易的响应。',
    facts: [
      { label: '交易路径', value: '买入 Q → 等待 → 卖出 Q', note: '期末净仓位为 0' },
      { label: '模型元件', value: '非线性 impact + decay kernel', note: '形状不能彼此独立任选' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '只要回落到零，模型就一定无套利', diagnosis: '回落终点不足以约束整条路径的成本；买卖顺序、速度与函数形状仍可以制造价格操纵。' },
      { id: 'b', label: '所有允许的零净仓位 round trip 平均执行成本不得为负', diagnosis: '正确：这是 no-price-manipulation / no-dynamic-arbitrage 的最低审计语言，它会联合约束 impact 形状与衰减核。' },
      { id: 'c', label: '只要单笔交易的方向与价格变化同号就足够', diagnosis: '单笔同号响应不能排除多步操纵路径，必须审计完整 round trip。' },
    ],
    calculation: '对任一允许策略 v(t) 且 ∫v(t)dt=0，模型应保证 E[execution cost(v)]≥0。',
    reveal: '无动态套利不会告诉你唯一正确的 impact 函数，但会排除一些看似拟合很好、实际允许通过自己推价再反向获利的内在矛盾模型。',
  },
];

function ImpactFacts({ scenario }: { scenario: Scenario }) {
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

export default function PriceImpactLab() {
  const [mode, setMode] = useState<Mode>('measure');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'measure' ? measureScenarios : identifyScenarios;
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
    <div className="impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>PRICE IMPACT · MEASURE → IDENTIFY</span>
          <h3>先算可观察成本，再审计能否称为冲击</h3>
        </div>
        <p>两种模式各四题。提交前只显示原始路径；计算、诊断与识别边界在作答后揭示。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="价格冲击实验模式">
        <button type="button" aria-pressed={mode === 'measure'} onClick={() => selectMode('measure')}>
          <span>MODE A</span><b>成本与路径测量</b><small>VWAP、shortfall、peak 与 marginal</small>
        </button>
        <button type="button" aria-pressed={mode === 'identify'} onClick={() => selectMode('identify')}>
          <span>MODE B</span><b>反事实与模型审计</b><small>Response、scaling、surface 与 arbitrage</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${mode === 'measure' ? '成本与路径测量' : '反事实与模型审计'}题目`}>
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

      <ImpactFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={`impact-${mode}-${scenario.id}`}
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
          <p className="impact-locked">先选择答案。计算过程、误区诊断与机制解释仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>数值是用于练习口径与识别的教学构造，不是实盘成本模型。真实 impact 还取决于订单选择、日内状态、其他同期流量、延迟、成交概率与反事实设计。</p>
    </div>
  );
}
