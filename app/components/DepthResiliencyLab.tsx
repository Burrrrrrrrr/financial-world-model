'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'ledger' | 'recovery';

type Option = {
  id: string;
  label: string;
  diagnosis: string;
};

type LedgerScenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  initial?: number;
  add?: number;
  cancel?: number;
  execution?: number;
  migration?: number;
  unit?: string;
  correct: string;
  options: Option[];
  explanation: string;
};

const ledgerScenarios: LedgerScenario[] = [
  {
    id: 'fixed-band',
    label: '账本 01 · 固定价格带',
    title: '这段观察窗结束时，固定 ask-side 价格带还显示多少数量？',
    brief: '修改已拆成 cancel-old 与 add-new；没有丢包、隐藏补显或坐标迁移。',
    initial: 1200,
    add: 360,
    cancel: 410,
    execution: 290,
    migration: 0,
    unit: '股',
    correct: 'b',
    options: [
      { id: 'a', label: '1,150 股', diagnosis: '你只做了初始量加新增再减撤单，遗漏了被主动订单执行的 290 股。' },
      { id: 'b', label: '860 股', diagnosis: '正确：1,200 + 360 − 410 − 290 = 860。固定坐标下无需迁移项。' },
      { id: 'c', label: '500 股', diagnosis: '你计算了流出，却没有把 360 股新限价单加入期末状态。' },
    ],
    explanation: 'A−C−E 是消息账本：它精确说明显示数量怎样改变，却没有说明交易者为什么新增、撤销或成交。',
  },
  {
    id: 'moving-band',
    label: '账本 02 · 移动坐标',
    title: '价格带跟随当前 mid；300 股因坐标移动离开窗口，期末相对 depth 是多少？',
    brief: 'M=−300 只表示订单被重新分箱；这些订单没有撤销。',
    initial: 900,
    add: 250,
    cancel: 120,
    execution: 80,
    migration: -300,
    unit: '股',
    correct: 'a',
    options: [
      { id: 'a', label: '650 股', diagnosis: '正确：900 + 250 − 120 − 80 − 300 = 650；最后一项是坐标迁移，不是经济撤单。' },
      { id: 'b', label: '950 股', diagnosis: '你完成了订单事件账本，却遗漏了 mid 移动令 300 股离开相对价格带。' },
      { id: 'c', label: '1,250 股', diagnosis: '你把负向迁移当成了新增。M 的符号表示相对窗口成员如何改变。' },
    ],
    explanation: '动态坐标适合描述围绕新 mid 的即时机会，但必须把 migration 单列，否则会把重新分箱误称为补单或撤单。',
  },
  {
    id: 'amendment',
    label: '账本 03 · 跨带改单',
    title: '400 股从固定带内改到带外；带内另有成交 200、新增 300，期末是多少？',
    brief: '改单已规范化：旧位置 cancel 400，带外 add 400；带外新增不进入本价格带。',
    initial: 1500,
    add: 300,
    cancel: 400,
    execution: 200,
    migration: 0,
    unit: '股',
    correct: 'c',
    options: [
      { id: 'a', label: '1,600 股', diagnosis: '你把跨带修改当成全簿净零，却忽略了研究对象只是原固定价格带；旧位置的 400 股已经离开。' },
      { id: 'b', label: '800 股', diagnosis: '你把同一笔跨带修改重复扣减。规范化后，带内只记录一次 cancel 400。' },
      { id: 'c', label: '1,200 股', diagnosis: '正确：1,500 − 400 − 200 + 300 = 1,200。带外的新位置不属于当前集合。' },
    ],
    explanation: '研究坐标决定哪些消息进入账本。对全订单簿，改价是 cancel+add；对固定子区域，只有落在该区域内的两端才进入区域变化。',
  },
  {
    id: 'three-layers',
    label: '账本 04 · 三层流动性',
    title: '屏幕仅显示 400 股，700 股在同一价格带成交；其中 300 股经记录确认为 reserve。随后出现 200 股新显示订单。',
    brief: '请选择证据能够支持、但没有越界的结论。',
    correct: 'b',
    options: [
      { id: 'a', label: '初始真实供给恰好是 900 股', diagnosis: '你把不同时间的 400 displayed、300 hidden 和事后 200 新单直接相加，并把新单倒灌到冲击前。' },
      { id: 'b', label: '初始 displayed 为 400；本次至少显现 300 hidden；初始 latent 数量未知', diagnosis: '正确：订单记录识别了至少 300 reserve，事后新单只说明意愿已经实现，不能反推冲击前 latent 存量。' },
      { id: 'c', label: '700 股成交不可能，数据一定错误', diagnosis: '显示数量不是全部可执行承诺；reserve / hidden liquidity 可以让实际成交超过事前屏幕显示量。' },
    ],
    explanation: 'Displayed、hidden 与 latent 位于不同承诺层和不同时间点。只有题目明确给出的订单记录，才允许把超显示成交识别为 hidden。',
  },
];

type Series = {
  name: string;
  pattern: 'solid' | 'dash';
  points: { x: number; y: number }[];
};

type RecoveryScenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  tableHeaders?: string[];
  tableRows?: string[][];
  series?: Series[];
  correct: string;
  options: Option[];
  explanation: string;
};

const recoveryScenarios: RecoveryScenario[] = [
  {
    id: 'two-clocks',
    label: '审计 01 · 两种时钟',
    title: 'P 与 Q 都在第 500 个 book event 达到 80% 恢复；P 用 5 秒，Q 用 50 秒。任务 deadline 为 10 秒。',
    brief: '判断任务结论与机制结论分别能走多远。',
    tableHeaders: ['路径', '达到 80% 的事件数', '日历时间', '任务 deadline'],
    tableRows: [['P', '500', '5 秒', '10 秒'], ['Q', '500', '50 秒', '10 秒']],
    correct: 'a',
    options: [
      { id: 'a', label: 'P 满足期限；两者 event-time 相同，不能仅此断言每事件机制不同', diagnosis: '正确：执行任务由日历时间绑定；每事件反应的粗粒度结果相同，仍需事件大小与完整路径。' },
      { id: 'b', label: '两者同样满足任务，因为都在 500 个事件后恢复', diagnosis: '你把 book-event clock 替代了真实 deadline；Q 的 50 秒已超过任务上限。' },
      { id: 'c', label: 'Q 更有韧性，因为等待越久代表恢复越稳定', diagnosis: '等待更久不自动代表稳定；稳定需要持续阈值、复发和路径损失证据。' },
    ],
    explanation: 'Calendar time 回答真实等待，event time 回答经历多少次簿更新。专业结论应保留两个时钟，而不是寻找无条件总排名。',
  },
  {
    id: 'sustained-threshold',
    label: '审计 02 · 持续阈值',
    title: '恢复比例 R 首次在 5 秒越过 0.8，却在 10 秒跌回 0.62。要求连续 10 秒保持 R≥0.8。',
    brief: '本题只在给定五秒网格上判定，不做网格间插值；连续三个观测点皆达标即构成十秒窗口。',
    tableHeaders: ['秒', '0', '5', '10', '15', '20', '25'],
    tableRows: [['R', '0.00', '0.84', '0.62', '0.83', '0.87', '0.90']],
    series: [{ name: 'R(u)', pattern: 'solid', points: [{ x: 0, y: 0 }, { x: 5, y: .84 }, { x: 10, y: .62 }, { x: 15, y: .83 }, { x: 20, y: .87 }, { x: 25, y: .9 }] }],
    correct: 'b',
    options: [
      { id: 'a', label: '5 秒', diagnosis: '这是首次穿越；10 秒时已经跌破 0.8，不能满足持续窗口。' },
      { id: 'b', label: '15 秒', diagnosis: '正确：15、20、25 秒三个连续观测点都不低于 0.8；按题目预先规定的离散网格，恢复起点是 15 秒。' },
      { id: 'c', label: '25 秒', diagnosis: '25 秒是确认窗口的末端，不是持续恢复开始的时点。' },
    ],
    explanation: '持续阈值把“碰到目标”和“稳定留在目标区间”分开；窗口长度与插值规则必须预先固定。',
  },
  {
    id: 'deficit-auc',
    label: '审计 03 · 路径损失',
    title: 'P 更早触及 0.9，但中途再次坍塌；Q 较慢却更平稳。哪条路径在 0–30 秒的 deficit AUC 更小？',
    brief: 'Deficit 定义为 1−R；先以相邻点做梯形积分，再除以 H=30 秒得到本节定义的归一化 AUC。两条路径终点都为 0.9。',
    tableHeaders: ['路径 / 秒', '0', '10', '20', '30'],
    tableRows: [['P', '0.0', '0.9', '0.2', '0.9'], ['Q', '0.0', '0.6', '0.8', '0.9']],
    series: [
      { name: 'P · 实线', pattern: 'solid', points: [{ x: 0, y: 0 }, { x: 10, y: .9 }, { x: 20, y: .2 }, { x: 30, y: .9 }] },
      { name: 'Q · 虚线', pattern: 'dash', points: [{ x: 0, y: 0 }, { x: 10, y: .6 }, { x: 20, y: .8 }, { x: 30, y: .9 }] },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'P，因为它更早首次达到 0.9', diagnosis: 'First crossing 忽略了 P 在 20 秒跌回 0.2；整段路径承受的缺口反而更大。' },
      { id: 'b', label: '相同，因为两者在 30 秒都为 0.9', diagnosis: '终点丢掉了中间的持续时间与严重程度；AUC 正是为了保留路径。' },
      { id: 'c', label: 'Q，因为它在整个窗口累积的缺口更小', diagnosis: '正确：原始梯形积分为 P=14.5 秒、Q=11.5 秒；各除以 H=30 秒后，归一化 AUC 分别约为 0.483 与 0.383。' },
    ],
    explanation: '本节采用 (1/H)∫[h]₊du，因此报告 0.483 与 0.383，而不是带“秒”单位的 14.5 与 11.5。AUC 不替代恢复概率和持续时间；它补充回答整个 horizon 内的平均未恢复缺口有多重。',
  },
  {
    id: 'conditional-time',
    label: '审计 04 · 成功路径选择',
    title: '100 次冲击中，60 次在 120 秒内达到 80%；这 60 次的条件中位恢复时间为 12 秒。其余 40 次未恢复。',
    brief: '请选择对全样本最诚实的报告方式。',
    tableHeaders: ['观察窗结果', '事件数'],
    tableRows: [['120 秒内达到 80%', '60'], ['120 秒内未确认', '40'], ['合计', '100']],
    correct: 'b',
    options: [
      { id: 'a', label: '市场通常在 12 秒恢复', diagnosis: '12 秒只属于成功的 60 条路径；这句话把 40% 未恢复事件从结论中删除了。' },
      { id: 'b', label: '恢复概率 60%；成功路径条件中位数 12 秒；全样本需保留删失', diagnosis: '正确：可靠性与成功者速度成对报告，失败路径仍在风险集合中。' },
      { id: 'c', label: '其余 40 次没有 τ，应从数据中删除', diagnosis: '删除未恢复事件会制造成功路径选择偏差，系统性高估韧性。' },
    ],
    explanation: '未在 horizon 内恢复不是“没有数据”，而是 τ 超出观察窗的右删失信息。恢复事件概率和 survival 分析都必须保留它。',
  },
];

function LedgerVisual({ scenario, revealed }: { scenario: LedgerScenario; revealed: boolean }) {
  if (scenario.initial === undefined) {
    return (
      <div className="depth-layer-visual" aria-label="题目给出的三个原始订单记录">
        <div><span>t₀ · 屏幕快照</span><b>400 displayed</b><p>公开可见数量</p></div>
        <div><span>成交记录</span><b>+300 reserve redisplay</b><p>明确标记为同一 reserve order</p></div>
        <div><span>t₁ · 新订单消息</span><b>+200 new displayed</b><p>冲击后到达的独立显示订单</p></div>
      </div>
    );
  }

  const entries = [
    { label: '初始 D', value: scenario.initial, sign: '' },
    { label: '新增 A', value: scenario.add ?? 0, sign: '+' },
    { label: '撤单 C', value: -(scenario.cancel ?? 0), sign: '−' },
    { label: '执行 E', value: -(scenario.execution ?? 0), sign: '−' },
    { label: '迁移 M', value: scenario.migration ?? 0, sign: (scenario.migration ?? 0) >= 0 ? '+' : '−' },
  ];
  const result = entries.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="depth-ledger-visual" aria-label={revealed ? `深度账本，期末显示深度 ${result} ${scenario.unit}` : '深度账本原始流量，期末显示深度待预测'}>
      {entries.map((entry, index) => (
        <div className={entry.value < 0 ? 'outflow' : entry.value > 0 && index > 0 ? 'inflow' : ''} key={entry.label}>
          <span>{entry.label}</span>
          <b>{index === 0 ? '' : entry.sign}{Math.abs(entry.value).toLocaleString()}</b>
          <small>{scenario.unit}</small>
        </div>
      ))}
      <i aria-hidden="true">=</i>
      <div className="ledger-total"><span>期末 D</span><b>{revealed ? result.toLocaleString() : '?'}</b><small>{revealed ? scenario.unit : '待预测'}</small></div>
    </div>
  );
}

function RecoveryChart({ series }: { series: Series[] }) {
  const width = 520;
  const height = 210;
  const pad = { left: 42, right: 18, top: 20, bottom: 34 };
  const allPoints = series.flatMap((item) => item.points);
  const maxX = Math.max(...allPoints.map((point) => point.x), 1);
  const sx = (x: number) => pad.left + (x / maxX) * (width - pad.left - pad.right);
  const sy = (y: number) => pad.top + (1 - y) * (height - pad.top - pad.bottom);
  const path = (points: { x: number; y: number }[]) => points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${sx(point.x)} ${sy(point.y)}`).join(' ');

  return (
    <div className="recovery-chart-wrap">
      <div className="recovery-chart-scroll" role="region" aria-label="合成恢复路径图，可横向滚动" tabIndex={0}>
        <svg aria-label={`合成恢复路径：${series.map((item) => item.name).join('；')}`} className="recovery-chart" role="img" viewBox={`0 0 ${width} ${height}`}>
          {[0, .5, .8, 1].map((value) => <g key={value}><line className={value === .8 ? 'threshold' : 'grid'} x1={pad.left} x2={width - pad.right} y1={sy(value)} y2={sy(value)} /><text x="6" y={sy(value) + 4}>{value.toFixed(1)}</text></g>)}
          <line className="axis" x1={pad.left} x2={pad.left} y1={pad.top} y2={height - pad.bottom} />
          <line className="axis" x1={pad.left} x2={width - pad.right} y1={height - pad.bottom} y2={height - pad.bottom} />
          <text className="axis-label" x={width - 54} y={height - 8}>秒</text>
          {series.map((item, seriesIndex) => (
            <g key={item.name}>
              <path className={`series series-${seriesIndex} ${item.pattern}`} d={path(item.points)} />
              {item.points.map((point) => <circle className={`series-point series-${seriesIndex}`} cx={sx(point.x)} cy={sy(point.y)} key={`${point.x}-${point.y}`} r="4" />)}
            </g>
          ))}
        </svg>
      </div>
      <div className="recovery-chart-legend" aria-hidden="true">{series.map((item, index) => <span key={item.name}><i className={`series-${index} ${item.pattern}`} />{item.name}</span>)}</div>
      <p>横轴为日历秒，纵轴为恢复比例 R；0.8 参考线用点线标记。完整数值见下表。</p>
    </div>
  );
}

function EvidenceTable({ headers, rows, label }: { headers: string[]; rows: string[][]; label: string }) {
  return (
    <div className="depth-lab-table-scroll" role="region" aria-label={`${label}数据表，可横向滚动`} tabIndex={0}>
      <table>
        <thead><tr>{headers.map((header) => <th key={header} scope="col">{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, rowIndex) => <tr key={`${label}-${rowIndex}`}>{row.map((cell, cellIndex) => cellIndex === 0 ? <th key={cellIndex} scope="row">{cell}</th> : <td key={cellIndex}>{cell}</td>)}</tr>)}</tbody>
      </table>
    </div>
  );
}

function ChoiceSet({
  name,
  legend,
  options,
  choice,
  disabled,
  firstRef,
  onChange,
}: {
  name: string;
  legend: string;
  options: Option[];
  choice: string | null;
  disabled: boolean;
  firstRef: React.RefObject<HTMLInputElement | null>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="depth-choice-fieldset" disabled={disabled}>
      <legend className="sr-only">{legend}</legend>
      {options.map((option, index) => (
        <label className={choice === option.id ? 'selected' : ''} key={option.id}>
          <input checked={choice === option.id} name={name} onChange={() => onChange(option.id)} ref={index === 0 ? firstRef : undefined} type="radio" value={option.id} />
          <span>{option.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

function LedgerMode({ focusVersion }: { focusVersion: number }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const focusAfterAdvance = useRef(false);
  const radioName = useId();
  const scenario = ledgerScenarios[index];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;

  useEffect(() => {
    if (revealed) resultRef.current?.focus();
    else if (focusAfterAdvance.current) {
      titleRef.current?.focus();
      focusAfterAdvance.current = false;
    }
  }, [revealed, index]);

  useEffect(() => {
    if (focusVersion > 0) titleRef.current?.focus();
  }, [focusVersion]);

  function retry() {
    setChoice(null);
    setRevealed(false);
    requestAnimationFrame(() => firstChoiceRef.current?.focus());
  }

  function advance() {
    focusAfterAdvance.current = true;
    setIndex((value) => value === ledgerScenarios.length - 1 ? 0 : value + 1);
    setChoice(null);
    setRevealed(false);
  }

  return (
    <div className="depth-mode-body">
      <div className="depth-lab-assumption" role="note"><b>固定规则：</b>全部数字都是同一合成资产、同一 ask side 和同一数量单位。A 包括新显示与 reserve redisplay；C 只含非成交显示移除；E 只扣成交前已经显示的部分；M 只记录坐标成员变化。守恒式是显示深度账本，不是行为或价格因果模型。</div>
      <div aria-label={`账本任务 ${index + 1}，共 ${ledgerScenarios.length} 个`} aria-valuemax={ledgerScenarios.length} aria-valuemin={1} aria-valuenow={index + 1} className="depth-lab-progress" role="progressbar">
        {ledgerScenarios.map((item, itemIndex) => <i aria-hidden="true" className={itemIndex < index || (itemIndex === index && revealed) ? 'done' : itemIndex === index ? 'current' : ''} key={item.id} />)}
      </div>
      <span className="depth-case-label">{scenario.label}</span>
      <h3 ref={titleRef} tabIndex={-1}>{scenario.title}</h3>
      <p>{scenario.brief}</p>
      <LedgerVisual revealed={revealed} scenario={scenario} />
      <ChoiceSet choice={choice} disabled={revealed} firstRef={firstChoiceRef} legend={scenario.title} name={`${radioName}-${scenario.id}`} onChange={setChoice} options={scenario.options} />
      <button className="depth-primary" disabled={!choice || revealed} onClick={() => setRevealed(true)} type="button">锁定答案并揭示账本</button>
      {revealed && selected ? (
        <div aria-labelledby={`ledger-result-${scenario.id}`} className={correct ? 'depth-result correct' : 'depth-result'} ref={resultRef} role="region" tabIndex={-1}>
          <span className="sr-only" role="status">{correct ? `判断正确。${selected.diagnosis}` : `需要修正。${selected.diagnosis}`}</span>
          <b id={`ledger-result-${scenario.id}`}>{correct ? '✓ 判断正确' : '需要修正：账本对象或流量方向有误'}</b>
          <p>{selected.diagnosis}</p>
          <strong>{scenario.explanation}</strong>
          <div><button className="depth-secondary" onClick={retry} type="button">重做本题</button><button className="depth-primary" onClick={advance} type="button">{index === ledgerScenarios.length - 1 ? '回到账本 01' : '进入下一账本'}</button></div>
        </div>
      ) : <p className="depth-locked">先选择并提交；逐选项诊断会在锁定后出现。</p>}
    </div>
  );
}

function RecoveryMode({ focusVersion }: { focusVersion: number }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstChoiceRef = useRef<HTMLInputElement>(null);
  const focusAfterAdvance = useRef(false);
  const radioName = useId();
  const scenario = recoveryScenarios[index];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;

  useEffect(() => {
    if (revealed) resultRef.current?.focus();
    else if (focusAfterAdvance.current) {
      titleRef.current?.focus();
      focusAfterAdvance.current = false;
    }
  }, [revealed, index]);

  useEffect(() => {
    if (focusVersion > 0) titleRef.current?.focus();
  }, [focusVersion]);

  function retry() {
    setChoice(null);
    setRevealed(false);
    requestAnimationFrame(() => firstChoiceRef.current?.focus());
  }

  function advance() {
    focusAfterAdvance.current = true;
    setIndex((value) => value === recoveryScenarios.length - 1 ? 0 : value + 1);
    setChoice(null);
    setRevealed(false);
  }

  return (
    <div className="depth-mode-body">
      <div className="depth-lab-assumption" role="note"><b>审计规则：</b>全部路径为合成教学数据。恢复基准、阈值、horizon、插值和事件字母表已由题目固定；先判断指标能支持什么，再讨论机制，不把条件路径写成因果响应。</div>
      <div aria-label={`恢复审计 ${index + 1}，共 ${recoveryScenarios.length} 个`} aria-valuemax={recoveryScenarios.length} aria-valuemin={1} aria-valuenow={index + 1} className="depth-lab-progress" role="progressbar">
        {recoveryScenarios.map((item, itemIndex) => <i aria-hidden="true" className={itemIndex < index || (itemIndex === index && revealed) ? 'done' : itemIndex === index ? 'current' : ''} key={item.id} />)}
      </div>
      <span className="depth-case-label">{scenario.label}</span>
      <h3 ref={titleRef} tabIndex={-1}>{scenario.title}</h3>
      <p>{scenario.brief}</p>
      {scenario.series ? <RecoveryChart series={scenario.series} /> : null}
      {scenario.tableHeaders && scenario.tableRows ? <EvidenceTable headers={scenario.tableHeaders} label={scenario.label} rows={scenario.tableRows} /> : null}
      <ChoiceSet choice={choice} disabled={revealed} firstRef={firstChoiceRef} legend={scenario.title} name={`${radioName}-${scenario.id}`} onChange={setChoice} options={scenario.options} />
      <button className="depth-primary" disabled={!choice || revealed} onClick={() => setRevealed(true)} type="button">提交恢复审计</button>
      {revealed && selected ? (
        <div aria-labelledby={`recovery-result-${scenario.id}`} className={correct ? 'depth-result correct' : 'depth-result'} ref={resultRef} role="region" tabIndex={-1}>
          <span className="sr-only" role="status">{correct ? `审计通过。${selected.diagnosis}` : `这项判断需要修正。${selected.diagnosis}`}</span>
          <b id={`recovery-result-${scenario.id}`}>{correct ? '✓ 审计通过' : '这项判断遗漏了路径条件'}</b>
          <p>{selected.diagnosis}</p>
          <strong>{scenario.explanation}</strong>
          <div><button className="depth-secondary" onClick={retry} type="button">重做本题</button><button className="depth-primary" onClick={advance} type="button">{index === recoveryScenarios.length - 1 ? '回到审计 01' : '进入下一审计'}</button></div>
        </div>
      ) : <p className="depth-locked">先选择并提交；指标边界与逐选项诊断会在锁定后出现。</p>}
    </div>
  );
}

export default function DepthResiliencyLab() {
  const [mode, setMode] = useState<Mode>('ledger');
  const [focusVersion, setFocusVersion] = useState(0);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setFocusVersion((value) => value + 1);
  }

  return (
    <section className="depth-lab" aria-labelledby="depth-lab-title">
      <header className="depth-lab-head">
        <p>23 · INTERACTIVE · PREDICT BEFORE REVEAL</p>
        <h2 id="depth-lab-title">Shock–Response Lab：先把深度变化对上账，再判断一条路径是否真的恢复。</h2>
        <span>模式 A 训练固定/移动坐标、改单与三层流动性；模式 B 审计多个时钟、持续阈值、路径 AUC 与成功样本选择。所有答案提交前保持中性。</span>
      </header>
      <div className="depth-mode-picker" role="group" aria-label="切换互动实验模式">
        <button aria-pressed={mode === 'ledger'} onClick={() => switchMode('ledger')} type="button"><span>模式 A · Depth Ledger</span><b>哪些变化是新增、撤单、执行或坐标迁移？</b></button>
        <button aria-pressed={mode === 'recovery'} onClick={() => switchMode('recovery')} type="button"><span>模式 B · Recovery Audit</span><b>首次穿越、持续恢复与路径损失会给出什么不同答案？</b></button>
      </div>
      {mode === 'ledger' ? <LedgerMode focusVersion={focusVersion} /> : <RecoveryMode focusVersion={focusVersion} />}
      <p className="depth-lab-caveat"><b>不要把合成输出当成真实市场参数。</b>实验有意固定资产、side、单位和事件规则，只隔离概念。真实研究还必须处理多场所、隐藏订单规则、消息丢失、新闻、内生冲击、重叠事件与条件反事实。</p>
    </section>
  );
}
