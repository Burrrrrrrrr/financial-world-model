'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'events' | 'audit';

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
  reveal: string;
};

const eventScenarios: Scenario[] = [
  {
    id: 'same-quote-events',
    label: '事件 01 · 同价位变化',
    title: '最优报价没有改变，这两个事件合计产生多少 best-level OFI？',
    brief: '采用本节约定：正值代表买方一侧净压力；数量单位均为股。',
    facts: [
      { label: 'Best bid', value: '新增 300', note: '买方队列增加，bid price 不变' },
      { label: 'Best ask', value: '撤销 200', note: '卖方队列减少，ask price 不变' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '+100 股', diagnosis: '你把 ask 撤单当成负向。卖方承接减少同样向买方压力方向贡献，所以两项应相加。' },
      { id: 'b', label: '+500 股', diagnosis: '正确：bid 新增 +300，ask 撤销 +200，合计 OFI=+500。' },
      { id: 'c', label: '−500 股', diagnosis: '方向整体反了。正号表示买方一侧净压力，不是“市场总挂单增加”。' },
    ],
    reveal: 'OFI 不只数成交。新增 bid 与撤销 ask 都削弱了下一笔卖方冲击相对于买方冲击的对称性，因此同向进入 +500。',
  },
  {
    id: 'price-improvement',
    label: '事件 02 · 最优价抬升',
    title: '原 best bid 为 99.99、数量 900；一笔 250 股买单挂到 100.00 并成为新 best bid。该事件的 bid-side 贡献是多少？',
    brief: '只计算这一次报价更新，不把旧 99.99 队列重复计入。',
    facts: [
      { label: '更新前 best bid', value: '99.99 × 900', note: '旧最优买价与数量' },
      { label: '更新后 best bid', value: '100.00 × 250', note: '价格改善后的新最优买价' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '+250 股', diagnosis: '正确：bid price 上升时，贡献是新最优队列数量 +250；旧 99.99 队列不在新 best level。' },
      { id: 'b', label: '−650 股', diagnosis: '你用新旧最优数量做了差，但价格已经改变。Cont 的事件定义在 bid 改善时只计新 best queue。' },
      { id: 'c', label: '+1,150 股', diagnosis: '旧队列仍在更低价位，并没有作为同一 best-level 事件新增到新最优价，不能相加。' },
    ],
    reveal: '价格变化时不能机械使用“新数量减旧数量”。事件公式通过不等式分支处理最优价进入或退出，避免把不同价格上的队列当成同一存量。',
  },
  {
    id: 'signed-trades',
    label: '事件 03 · 主动成交',
    title: '观察窗内，400 股在 ask 被主动买入，250 股在 bid 被主动卖出。净 signed trade flow 与 gross volume 分别是多少？',
    brief: 'ε=+1 表示 buyer-initiated，ε=−1 表示 seller-initiated。',
    facts: [
      { label: 'Ask executions', value: '400', note: 'buyer-initiated' },
      { label: 'Bid executions', value: '250', note: 'seller-initiated' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '净 +650；gross 150 股', diagnosis: '你把净方向与总活动对调了。Gross 不带符号，净流量才允许相消。' },
      { id: 'b', label: '净 −150；gross 650 股', diagnosis: 'Gross 正确，但发起方方向反了：成交在 ask 通常是主动买入，故净值为正。' },
      { id: 'c', label: '净 +150；gross 650 股', diagnosis: '正确：400−250=+150；方向被抵消前的总成交活动为 400+250=650。' },
    ],
    reveal: '同一笔成交当然同时有买方和卖方；trade sign 标记的是谁跨越或接受了当时的报价。净流量 +150 与 gross 650 回答两个不同问题。',
  },
  {
    id: 'zero-net-high-activity',
    label: '事件 04 · 净额抵消',
    title: '四次标准化事件贡献依次为 +300、−500、+250、−50。净 OFI 为多少？这是否说明市场没有活动？',
    brief: '同时计算绝对贡献之和，审计净额背后的总重写规模。',
    facts: [
      { label: '事件序列', value: '+300, −500, +250, −50', note: '已按同一 OFI 方向约定标准化' },
      { label: '观察目标', value: '净方向 + gross rewriting', note: '不要只看一个总数' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'OFI=0，因此没有订单簿活动', diagnosis: '净额确实为零，但绝对贡献总和为 1,100；抵消不等于静止。' },
      { id: 'b', label: 'OFI=0，但 gross absolute flow=1,100', diagnosis: '正确：方向完全抵消，订单簿却被大幅重写。' },
      { id: 'c', label: 'OFI=1,100，且净买方压力极强', diagnosis: '1,100 是绝对活动量，不是带符号净值。把 gross 当 net 会虚构方向。' },
    ],
    reveal: '净指标有意压缩方向，但会丢失抵消前的强度与事件构成。研究中应把 net OFI、absolute flow 和 add/cancel/execution composition 分开保留。',
  },
];

const auditScenarios: Scenario[] = [
  {
    id: 'state-versus-flow',
    label: '审计 01 · 状态与流量',
    title: '此刻 best bid 有 800 股、best ask 有 200 股。仅凭这张快照，最强的可支持结论是什么？',
    brief: 'Queue imbalance 使用当前队列；OFI 需要一个观察区间内的事件。',
    facts: [
      { label: 'Best bid queue', value: '800 股', note: '当前状态' },
      { label: 'Best ask queue', value: '200 股', note: '当前状态' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'OFI=+0.6', diagnosis: '+0.6 是归一化 queue imbalance，不是流量。没有事件历史就不能得到 OFI。' },
      { id: 'b', label: 'OFI=+600 股', diagnosis: '800−200 是两个当前存量之差；它不是一段时间内 add/cancel/execution 的净变化。' },
      { id: 'c', label: 'QI=+0.6；OFI 未知', diagnosis: '正确：(800−200)/(800+200)=0.6，而观察窗内发生过什么仍未知。' },
    ],
    reveal: 'Queue imbalance 是 stock；OFI 是 flow。强正 QI 可能由很久以前累积，也可能在下一事件立即消失。两者可以相关，却不能互换名称。',
  },
  {
    id: 'depth-normalization',
    label: '审计 02 · 容量归一化',
    title: '两个窗口 raw OFI 都是 +600 股；A 的冲击前双侧相关深度为 3,000，B 为 300。若只做 OFI/depth 归一化，哪项计算正确？',
    brief: '这是强度比较，不要求你断言下一价格必涨。',
    facts: [
      { label: '窗口 A', value: '+600 / 3,000', note: '较厚状态' },
      { label: '窗口 B', value: '+600 / 300', note: '较薄状态' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'A=0.2，B=2.0；B 的相对压力更大', diagnosis: '正确。相同原始数量相对更薄的承接容量更强，但这仍是条件信号而非涨价保证。' },
      { id: 'b', label: '两者完全相同，因为 raw OFI 相同', diagnosis: '你忽略了冲击相对于可见容量的尺度；跨证券或跨状态比较尤其会受此影响。' },
      { id: 'c', label: 'A=5，B=0.5；A 的相对压力更大', diagnosis: '你把分子分母倒置。这里定义的是 signed flow 除以预先可得的 depth。' },
    ],
    reveal: '归一化让“600 股”落回市场容量语境，但分母必须在特征截止时已知，并固定口径；用未来平均深度会把答案泄漏回输入。',
  },
  {
    id: 'forecast-leakage',
    label: '审计 03 · 时间泄漏',
    title: '研究发现 [t,t+1s] 内 OFI 与同一秒 mid-price 变化高度相关。以下哪一种额外设计才是真正的向前预测？',
    brief: '特征截止时点必须严格早于目标区间。',
    facts: [
      { label: '已有结果', value: 'OFI[t,t+1s] ↔ Δm[t,t+1s]', note: '同窗关系' },
      { label: '待验证任务', value: 'information set at t → future target', note: '时间顺序不可重叠' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '把同一秒回归的 R² 报得更精确', diagnosis: '更精确的同窗拟合仍然是解释，不会自动变成 ex ante forecast。' },
      { id: 'b', label: '用整日平均 depth 标准化每一秒，再随机拆分训练测试', diagnosis: '整日统计含未来信息，随机拆分又会让相邻重叠路径跨集合，构成双重泄漏。' },
      { id: 'c', label: '仅用 ≤t 的事件构造特征，预测 (t,t+h]，按时间切分并去除重叠', diagnosis: '正确：信息集、目标窗口与验证切分都保持严格时间顺序。' },
    ],
    reveal: '“价格与 OFI 在同一窗口共同变化”可以是有价值的价格形成事实，但预测问题必须把可用信息冻结在 t，并让标签从 t 之后才开始。',
  },
  {
    id: 'accuracy-versus-profit',
    label: '审计 04 · 预测与利润',
    title: '模型对下一次 ±1 tick 方向的命中率为 56%。若每次方向正确赚 1 tick、错误亏 1 tick，平均往返成本为 0.18 tick，单次净期望是多少？',
    brief: '忽略仓位差异；先算 gross edge，再减可实现的往返成本。',
    facts: [
      { label: 'Direction accuracy', value: '56%', note: '正确 +1，错误 −1 tick' },
      { label: 'Round-trip cost', value: '0.18 tick', note: 'spread、fee、slippage 的合成假设' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '+0.38 tick', diagnosis: '你把 56% 当成收益并直接减成本，遗漏了 44% 错误交易的 −1 tick。' },
      { id: 'b', label: '−0.06 tick', diagnosis: '正确：gross 0.12 tick，减去 0.18 后净期望为 −0.06 tick。' },
      { id: 'c', label: '+0.12 tick', diagnosis: '这是 gross edge：0.56−0.44=0.12；还没有扣除 0.18 的往返成本。' },
    ],
    reveal: '统计可预测性只是价值链的第一环。能否在报价变化前成交、是否吃掉 spread、排队能否成交、冲击是否随仓位放大，都会决定信号能否变成利润。',
  },
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="flow-facts" aria-label="题目原始事实">
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

export default function OrderFlowLab() {
  const [mode, setMode] = useState<Mode>('events');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const statusId = useId();
  const resultTitleId = useId();
  const scenarios = mode === 'events' ? eventScenarios : auditScenarios;
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
    <div className="flow-lab">
      <div className="flow-lab-head">
        <div>
          <span>ORDER FLOW · PREDICT → REVEAL</span>
          <h3>先给事件定方向，再让公式检验直觉</h3>
        </div>
        <p>两种模式各四题。提交前只显示原始事实；计算结果、方向标签与解释在作答后才出现。</p>
      </div>

      <div className="flow-mode-picker" role="group" aria-label="实验模式">
        <button type="button" className={mode === 'events' ? 'active' : ''} aria-pressed={mode === 'events'} onClick={() => selectMode('events')}>
          <span>MODE A</span><b>事件账本</b><small>成交、报价与 OFI</small>
        </button>
        <button type="button" className={mode === 'audit' ? 'active' : ''} aria-pressed={mode === 'audit'} onClick={() => selectMode('audit')}>
          <span>MODE B</span><b>研究审计</b><small>状态、归一化与泄漏</small>
        </button>
      </div>

      <div className="flow-task-picker" role="group" aria-label={`${mode === 'events' ? '事件账本' : '研究审计'}题目`}>
        {scenarios.map((item, index) => (
          <button
            type="button"
            key={item.id}
            className={index === scenarioIndex ? 'active' : ''}
            onClick={() => selectScenario(index)}
            aria-pressed={index === scenarioIndex}
          >
            <span>{String(index + 1).padStart(2, '0')}</span>{item.label.split(' · ')[1]}
          </button>
        ))}
      </div>

      <div className="flow-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1}>{scenario.title}</h3>
        <p>{scenario.brief}</p>
      </div>

      <ScenarioFacts scenario={scenario} />

      <fieldset className="flow-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={`flow-${mode}-${scenario.id}`}
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
          <button type="button" className="flow-primary" disabled={!choice} onClick={() => setRevealed(true)}>提交判断并揭示机制</button>
          <p className="flow-locked" id={statusId} aria-live="polite">先选择答案。结果、计算过程与诊断仍被锁定。</p>
        </>
      ) : (
        <div className={`flow-result ${correct ? 'correct' : ''}`} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <strong>{scenario.reveal}</strong>
          <div>
            <button type="button" className="flow-secondary" onClick={retryScenario}>重新作答</button>
            <button type="button" className="flow-primary" onClick={nextScenario}>下一题</button>
          </div>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {revealed ? (correct ? '判断成立，机制解释已显示。' : '需要修正，诊断与机制解释已显示。') : ''}
      </p>

      <p className="flow-lab-caveat"><b>实验边界：</b>所有数字都是教学构造，不是交易建议或实盘回测。实验只训练定义、符号与研究设计；真实预测还必须面对数据源语义、延迟、队列成交、费用和样本外稳定性。</p>
    </div>
  );
}
