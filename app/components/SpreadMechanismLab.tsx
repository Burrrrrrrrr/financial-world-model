'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Mode = 'builder' | 'measurement';
type CostKey = 'processing' | 'waiting' | 'inventory' | 'information' | 'markup' | 'rebate';

type CostInput = {
  key: CostKey;
  label: string;
  short: string;
  value: number;
  min: number;
  max: number;
  step: number;
  sign: 1 | -1;
};

const initialCosts: CostInput[] = [
  { key: 'processing', label: '处理、连接与成交成本', short: '不含下方 rebate 的毛增量成本', value: 0.20, min: 0, max: 1.2, step: 0.05, sign: 1 },
  { key: 'waiting', label: '等待与未成交补偿', short: '实验中单独分配的机会成本', value: 0.15, min: 0, max: 1.2, step: 0.05, sign: 1 },
  { key: 'inventory', label: '库存与资本风险溢价', short: '不与其他栏重复的增量风险', value: 0.25, min: 0, max: 1.5, step: 0.05, sign: 1 },
  { key: 'information', label: '逆向选择预期损失', short: '实验中单列的条件成交损失', value: 0.40, min: 0, max: 1.8, step: 0.05, sign: 1 },
  { key: 'markup', label: 'Break-even 外残余加价', short: '市场势力或稀缺性，不是必要成本', value: 0.15, min: 0, max: 1.2, step: 0.05, sign: 1 },
  { key: 'rebate', label: '流动性提供者净补贴', short: '只从毛增量成本账本扣除一次', value: 0.10, min: 0, max: 0.8, step: 0.05, sign: -1 },
];

const presets: { id: string; label: string; note: string; values: Partial<Record<CostKey, number>>; tick: number }[] = [
  {
    id: 'calm',
    label: '平静且竞争充分',
    note: '信息风险和库存压力较低，报价竞争把残余加价压得很薄。',
    values: { processing: 0.15, waiting: 0.10, inventory: 0.10, information: 0.15, markup: 0.05, rebate: 0.10 },
    tick: 0.10,
  },
  {
    id: 'news',
    label: '公告后的信息不确定',
    note: '不是“恐慌”这个标签直接扩大价差，而是被挑中风险和库存不确定性同时上升。',
    values: { processing: 0.20, waiting: 0.20, inventory: 0.55, information: 1.20, markup: 0.15, rebate: 0.10 },
    tick: 0.10,
  },
  {
    id: 'thin',
    label: '参与者少、报价稀疏',
    note: '等待成本、库存风险与竞争后残余加价都更高；这不是把每项当成可直接观测的会计科目。',
    values: { processing: 0.35, waiting: 0.60, inventory: 0.70, information: 0.45, markup: 0.65, rebate: 0 },
    tick: 0.50,
  },
];

type Scenario = {
  id: string;
  title: string;
  setup: string;
  direction: 1 | -1;
  trade: number;
  mid0: number;
  midLater: number;
  options: { id: string; label: string; diagnosis: string }[];
  correct: string;
  explanation: string;
};

const scenarios: Scenario[] = [
  {
    id: 'unchanged',
    title: '案例 01 · 报价成本被保留下来',
    setup: '成交前 mid = 100.000；买方主动成交 P = 100.010；观察期后 mid 仍为 100.000。',
    direction: 1,
    trade: 100.010,
    mid0: 100.000,
    midLater: 100.000,
    options: [
      { id: 'all-realized', label: 'ES 2.0 bp；RS 2.0 bp；PI 0.0 bp', diagnosis: '方向、两倍化和后续 mid 未变化都处理正确。' },
      { id: 'half', label: 'ES 1.0 bp；RS 1.0 bp；PI 0.0 bp', diagnosis: '你算的是单边成交价偏离 mid，却忘了 effective spread 按完整买卖往返口径乘以 2。' },
      { id: 'all-impact', label: 'ES 2.0 bp；RS 0.0 bp；PI 2.0 bp', diagnosis: '后续 mid 没有改变，不能把成交价与初始 mid 的差额全部当成价格影响。' },
    ],
    correct: 'all-realized',
    explanation: '买方在 mid 上方 1 bp 成交，因此双边化 ES 为 2 bp。观察期内 mid 不动，流动性提供者相对后续基准保留了全部 2 bp；这里的 PI 为 0。',
  },
  {
    id: 'partial-impact',
    title: '案例 02 · 一部分变成后续价格变化',
    setup: '成交前 mid = 100.000；买方主动成交 P = 100.010；观察期后 mid = 100.008。',
    direction: 1,
    trade: 100.010,
    mid0: 100.000,
    midLater: 100.008,
    options: [
      { id: 'right', label: 'ES 2.0 bp；RS 0.4 bp；PI 1.6 bp', diagnosis: '你正确把同一个 effective spread 分成了后续仍保留的部分与 mid 变化部分。' },
      { id: 'swapped', label: 'ES 2.0 bp；RS 1.6 bp；PI 0.4 bp', diagnosis: '你交换了两项：mid 已沿买方方向移动 0.8 bp，双边化价格影响应为 1.6 bp。' },
      { id: 'add-wrong', label: 'ES 2.0 bp；RS 2.4 bp；PI 1.6 bp', diagnosis: 'RS 使用成交价与未来 mid，而不是把未来 mid 的变化再次加到成交偏离上；三者还必须满足 ES = RS + PI。' },
    ],
    correct: 'right',
    explanation: '后续 mid 向买方方向移动 0.8 bp，双边化 PI 为 1.6 bp；成交价只比未来 mid 高 0.2 bp，所以 RS 为 0.4 bp。二者相加仍等于 2 bp 的 ES。',
  },
  {
    id: 'negative-realized',
    title: '案例 03 · 价格改善仍可能输给后续移动',
    setup: '成交前 mid = 100.000；买方以改善后的 P = 100.005 成交；观察期后 mid = 100.010。',
    direction: 1,
    trade: 100.005,
    mid0: 100.000,
    midLater: 100.010,
    options: [
      { id: 'right', label: 'ES 1.0 bp；RS −1.0 bp；PI 2.0 bp', diagnosis: '你允许 realized spread 为负，并保持 ES = RS + PI。' },
      { id: 'floor-zero', label: 'ES 1.0 bp；RS 0.0 bp；PI 1.0 bp', diagnosis: 'Realized spread 没有零下限；未来 mid 越过成交价时，提供流动性的一方会相对该基准亏损。' },
      { id: 'ignore-improve', label: 'ES 2.0 bp；RS 0.0 bp；PI 2.0 bp', diagnosis: '你忽略了实际成交的价格改善。Effective spread 使用成交价，不自动等于 quoted spread。' },
    ],
    correct: 'right',
    explanation: '价格改善把 ES 降到 1 bp，但未来 mid 沿买方方向移动了 1 bp，双边化 PI 为 2 bp。为维持恒等式，RS 为 −1 bp：事后基准显示流动性提供者被价格变化反超。',
  },
  {
    id: 'sell-sign',
    title: '案例 04 · 卖方方向的符号检查',
    setup: '成交前 mid = 100.000；卖方主动成交 P = 99.990；观察期后 mid = 99.985。',
    direction: -1,
    trade: 99.990,
    mid0: 100.000,
    midLater: 99.985,
    options: [
      { id: 'right', label: 'ES 2.0 bp；RS −1.0 bp；PI 3.0 bp', diagnosis: '你用 D = −1 统一了买卖方向，且三项相加一致。' },
      { id: 'negative-es', label: 'ES −2.0 bp；RS 1.0 bp；PI −3.0 bp', diagnosis: '你只做了价格相减，没有乘卖方方向 D = −1；标准符号约定让主动交易成本通常为正。' },
      { id: 'future-only', label: 'ES 3.0 bp；RS 1.0 bp；PI 2.0 bp', diagnosis: 'Effective spread 只比较成交价与成交前基准，不使用未来 mid；未来价格变化进入 PI 与 RS。' },
    ],
    correct: 'right',
    explanation: '卖方以低于初始 mid 1 bp 的价格成交，双边化 ES 为 2 bp。未来 mid 又下移 1.5 bp，因此 PI 为 3 bp；成交价反而高于未来 mid 0.5 bp，对主动卖方方向化后 RS 为 −1 bp。',
  },
];

function Builder() {
  const [costs, setCosts] = useState(initialCosts);
  const [tick, setTick] = useState(0.50);
  const [presetNote, setPresetNote] = useState('先改变任一输入，观察经济要求与显示网格怎样分别作用。');
  const [prediction, setPrediction] = useState<'wider' | 'equal' | 'narrower' | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const predictionRef = useRef<HTMLSpanElement>(null);
  const breakEvenBurden = costs.filter((item) => !['markup', 'rebate'].includes(item.key)).reduce((sum, item) => sum + item.value, 0);
  const rebate = costs.find((item) => item.key === 'rebate')?.value ?? 0;
  const markup = costs.find((item) => item.key === 'markup')?.value ?? 0;
  const breakEvenHalf = Math.max(0, breakEvenBurden - rebate);
  const targetHalf = breakEvenHalf + markup;
  const rawSpread = 2 * targetHalf;
  const midpoint = 100;
  const tickPrice = midpoint * tick / 10000;
  const targetHalfPrice = midpoint * targetHalf / 10000;
  const continuousBid = midpoint - targetHalfPrice;
  const continuousAsk = midpoint + targetHalfPrice;
  const bid = Math.floor((continuousBid + 1e-10) / tickPrice) * tickPrice;
  const ask = Math.ceil((continuousAsk - 1e-10) / tickPrice) * tickPrice;
  const displayed = (ask - bid) / midpoint * 10000;
  const correctPrediction = displayed > rawSpread + 1e-7 ? 'wider' : 'equal';
  const correct = prediction === correctPrediction;

  useEffect(() => {
    if (revealed) resultRef.current?.focus();
  }, [revealed]);

  function resetPrediction() {
    setPrediction(null);
    setRevealed(false);
  }

  function retryPrediction() {
    resetPrediction();
    requestAnimationFrame(() => predictionRef.current?.focus());
  }

  function updateCost(key: CostKey, value: number) {
    setPresetNote('自定义参数：这些数字是教学假设，不是从市场数据识别出的结构成分。');
    setCosts((items) => items.map((item) => item.key === key ? { ...item, value } : item));
    resetPrediction();
  }

  function applyPreset(id: string) {
    const preset = presets.find((item) => item.id === id);
    if (!preset) return;
    setCosts((items) => items.map((item) => ({ ...item, value: preset.values[item.key] ?? item.value })));
    setTick(preset.tick);
    setPresetNote(preset.note);
    resetPrediction();
  }

  return (
    <div className="spread-builder">
      <div className="spread-assumption" role="note">
        <b>先读假设：</b>本模式先算不含租金的 break-even half-spread，再加竞争后残余 markup，并分别映射 bid / ask。为使加法闭合，六个滑杆被<strong>人为定义为互不重复的增量栏</strong>：处理成本不含单列 rebate，同一选择性成交损失只能放进等待或信息栏一次。
        真实机制相关且可能重叠，不能把滑杆当作已识别结构分解。参考 mid 固定、两侧对称；真实 LOB 两侧可来自不同主体，库存还会移动报价中心。若所有缓冲与 markup 为零，本实验允许显示 bid=ask 的理论目标边界；它不是同一连续簿可永久保留的 locked resting book。
      </div>
      <div className="spread-preset-grid" role="group" aria-label="选择教学市场状态预设">
        {presets.map((preset) => <button key={preset.id} onClick={() => applyPreset(preset.id)} type="button"><span>{preset.label}</span><small>{preset.note}</small></button>)}
      </div>
      <p className="spread-preset-note" aria-live="polite">{presetNote}</p>
      <div className="spread-builder-grid">
        <div className="spread-sliders">
          {costs.map((item) => (
            <label key={item.key}>
              <span><b>{item.label}</b><small>{item.short}</small></span>
              <output>{item.sign === -1 ? '−' : '+'}{item.value.toFixed(2)} bp / 侧</output>
              <input
                aria-label={`${item.label}，当前 ${item.value.toFixed(2)} 个基点每侧`}
                max={item.max}
                min={item.min}
                onChange={(event) => updateCost(item.key, Number(event.target.value))}
                step={item.step}
                type="range"
                value={item.value}
              />
            </label>
          ))}
          <fieldset className="spread-tick-picker">
            <legend>单个报价的价格 tick · 以参考 mid 的 bp 表示</legend>
            {[0.10, 0.50, 1.00].map((value) => (
              <button aria-pressed={tick === value} key={value} onClick={() => { setTick(value); setPresetNote('自定义网格：tick 只改变可显示报价，不会证明底层风险已经变化。'); resetPrediction(); }} type="button">{value.toFixed(2)} bp</button>
            ))}
          </fieldset>
          <div className="spread-builder-prediction">
            <span ref={predictionRef} tabIndex={-1}>先预测：bid 向下、ask 向上保护性映射后，网格价差相对 {rawSpread.toFixed(2)} bp 连续目标价差会怎样？</span>
            <div role="group" aria-label="预测网格化后的显示价差">
              <button aria-pressed={prediction === 'wider'} disabled={revealed} onClick={() => setPrediction('wider')} type="button">更宽</button>
              <button aria-pressed={prediction === 'equal'} disabled={revealed} onClick={() => setPrediction('equal')} type="button">完全相同</button>
              <button aria-pressed={prediction === 'narrower'} disabled={revealed} onClick={() => setPrediction('narrower')} type="button">更窄</button>
            </div>
            <button className="spread-primary" disabled={!prediction || revealed} onClick={() => setRevealed(true)} type="button">锁定参数并揭示网格映射</button>
          </div>
        </div>
        <div className={revealed ? 'spread-output' : 'spread-output locked'}>
          <span>ILLUSTRATIVE QUOTE BUILDER</span>
          <h3>{revealed ? <>{bid.toFixed(4)} <i>/</i> {ask.toFixed(4)}</> : <>连续目标 {continuousBid.toFixed(4)} <i>/</i> {continuousAsk.toFixed(4)}</>}</h3>
          <p>参考 midpoint 固定为 100；连续目标关于它对称。揭示时才分别把 bid 向下、ask 向上投到合法 tick，隔离网格效应；零目标间距只是一项理论边界。</p>
          <div className="spread-metric-grid">
            <div><small>Break-even 毛负担</small><strong>{breakEvenBurden.toFixed(2)} bp / 侧</strong></div>
            <div><small>单列净补贴</small><strong>−{rebate.toFixed(2)} bp / 侧</strong></div>
            <div><small>Break-even half-spread</small><strong>{breakEvenHalf.toFixed(2)} bp / 侧</strong></div>
            <div><small>Break-even 外 markup</small><strong>+{markup.toFixed(2)} bp / 侧</strong></div>
            <div><small>连续目标完整价差</small><strong>{rawSpread.toFixed(2)} bp</strong></div>
            <div><small>网格化显示价差</small><strong>{revealed ? `${displayed.toFixed(2)} bp` : '预测后揭示'}</strong></div>
          </div>
          {revealed ? <div className={correct ? 'spread-equation-readout correct' : 'spread-equation-readout'} ref={resultRef} role="status" tabIndex={-1}>
            <strong>{correct ? '预测正确' : '这次预测需要修正'}</strong>
            {!correct ? <p>{prediction === 'narrower' ? '保护性映射不会把 bid 向上或 ask 向下，所以显示价差不可能比连续目标更窄。' : prediction === 'equal' ? '连续 bid / ask 没有同时落在合法网格；分别向外映射会增加宽度。' : '这组连续 bid / ask 已经落在合法网格上，因此无需额外向外移动。'}</p> : null}
            <b>h<sub>BE</sub> = max(0, {breakEvenBurden.toFixed(2)} − {rebate.toFixed(2)}) = {breakEvenHalf.toFixed(2)}；h<sub>target</sub> = {breakEvenHalf.toFixed(2)} + {markup.toFixed(2)} = {targetHalf.toFixed(2)} bp / 侧</b>
            <p>连续 bid {continuousBid.toFixed(4)} 向下映射为 {bid.toFixed(4)}，连续 ask {continuousAsk.toFixed(4)} 向上映射为 {ask.toFixed(4)}，得到 {displayed.toFixed(2)} bp。{displayed > rawSpread + 1e-7 ? `其中 ${(displayed - rawSpread).toFixed(2)} bp 来自离散报价约束。` : rawSpread === 0 ? '两侧都位于 100 的合法价格点；零间距来自理论目标，不是 tick 强迫，也不代表静态单一场所簿可长期锁定。' : '两侧当前恰好已经位于合法网格。'}</p>
            <button className="spread-secondary" onClick={retryPrediction} type="button">保持参数，重新预测</button>
          </div> : <p className="spread-output-lock">先选择预测并提交；网格 bid / ask 与显示价差暂时锁定。</p>}
        </div>
      </div>
    </div>
  );
}

function Measurement() {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const focusAfterAdvance = useRef(false);
  const scenario = scenarios[index];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;
  const scale = 10000 / scenario.mid0;
  const effective = 2 * scenario.direction * (scenario.trade - scenario.mid0) * scale;
  const realized = 2 * scenario.direction * (scenario.trade - scenario.midLater) * scale;
  const impact = 2 * scenario.direction * (scenario.midLater - scenario.mid0) * scale;

  useEffect(() => {
    if (revealed) resultRef.current?.focus();
    else if (focusAfterAdvance.current) {
      titleRef.current?.focus();
      focusAfterAdvance.current = false;
    }
  }, [revealed, index]);

  function advance() {
    focusAfterAdvance.current = true;
    setIndex((value) => value === scenarios.length - 1 ? 0 : value + 1);
    setChoice(null);
    setRevealed(false);
  }

  function retryScenario() {
    setChoice(null);
    setRevealed(false);
    requestAnimationFrame(() => titleRef.current?.focus());
  }

  return (
    <div className="spread-measurement">
      <div className="spread-assumption" role="note"><b>统一口径：</b>D=+1 表示主动买，D=−1 表示主动卖；三个指标都以成交前同一 mid 为起点，并按 m<sub>0</sub> 转为基点。这样 ES = RS(τ) + PI(τ) 是代数恒等式。</div>
      <div aria-label={`案例 ${index + 1}，共 ${scenarios.length} 个`} aria-valuemax={scenarios.length} aria-valuemin={1} aria-valuenow={index + 1} className="spread-progress" role="progressbar">
        {scenarios.map((item, itemIndex) => <i aria-hidden="true" className={itemIndex < index || (itemIndex === index && revealed) ? 'done' : itemIndex === index ? 'current' : ''} key={item.id} />)}
      </div>
      <div className="spread-measure-grid">
        <div>
          <span className="spread-case-label">{scenario.title}</span>
          <h3 ref={titleRef} tabIndex={-1}>{scenario.setup}</h3>
          <p>先不要心算“赚了多少”。请按方向 D 写出 ES、RS 与 PI，再选答案。</p>
          <div className="spread-choice-grid" role="group" aria-label="选择你的分解结果">
            {scenario.options.map((option) => (
              <button aria-pressed={choice === option.id} disabled={revealed} key={option.id} onClick={() => setChoice(option.id)} type="button">{option.label}</button>
            ))}
          </div>
          {!revealed ? <button className="spread-primary" disabled={!choice} onClick={() => setRevealed(true)} type="button">揭示计算与诊断</button> : <p className="spread-submitted">预测已锁定。请先阅读下方诊断，再选择重新作答或进入下一案例。</p>}
        </div>
        <div className="spread-formula-panel">
          <span>MEASUREMENT MAP</span>
          <p>ES = 2D(P − m<sub>0</sub>)</p>
          <p>RS(τ) = 2D(P − m<sub>τ</sub>)</p>
          <p>PI(τ) = 2D(m<sub>τ</sub> − m<sub>0</sub>)</p>
          <b>ES = RS(τ) + PI(τ)</b>
          <small>本实验把价格差除以 m<sub>0</sub> 并乘 10,000，结果以 bp 表示。</small>
        </div>
      </div>
      {revealed ? (
        <>
          <div className={correct ? 'spread-result correct' : 'spread-result'} ref={resultRef} role="status" tabIndex={-1}>
            <b>{correct ? '计算正确' : '需要修正这条测量链'}</b>
            {!correct && selected ? <p><strong>错误来源：</strong>{selected.diagnosis}</p> : null}
            <p>{scenario.explanation}</p>
            <div>
              <span>ES <strong>{effective.toFixed(1)} bp</strong></span>
              <i>=</i>
              <span>RS <strong>{realized.toFixed(1)} bp</strong></span>
              <i>+</i>
              <span>PI <strong>{impact.toFixed(1)} bp</strong></span>
            </div>
          </div>
          <div className="spread-result-actions">
            <button className="spread-secondary" onClick={retryScenario} type="button">重新作答本案例</button>
            <button className="spread-primary" onClick={advance} type="button">{index === scenarios.length - 1 ? '重新开始四个案例' : '进入下一案例'}</button>
          </div>
        </>
      ) : <p className="spread-locked">答案与下一步按钮会在提交预测后出现。</p>}
    </div>
  );
}

export default function SpreadMechanismLab() {
  const [mode, setMode] = useState<Mode>('builder');
  const headingRef = useRef<HTMLHeadingElement>(null);
  const modeCopy = useMemo(() => mode === 'builder'
    ? { title: '从 break-even 到连续目标与网格映射', body: '先计算不含租金的盈亏平衡缓冲，再加入竞争后残余加价，最后分别把 bid 与 ask 映射到价格网格。' }
    : { title: '从一笔成交到三种价差指标', body: '先预测，再用方向统一的公式拆开成交成本、后续价格变化与事后保留部分。' }, [mode]);

  function switchMode(next: Mode) {
    setMode(next);
    requestAnimationFrame(() => headingRef.current?.focus());
  }

  return (
    <div className="spread-lab">
      <div className="spread-lab-head">
        <p>18 · INTERACTIVE LAB · 双模式价差实验</p>
        <h2 ref={headingRef} tabIndex={-1}>{modeCopy.title}</h2>
        <span>{modeCopy.body}</span>
      </div>
      <div className="spread-mode-picker" role="group" aria-label="选择价差实验模式">
        <button aria-pressed={mode === 'builder'} onClick={() => switchMode('builder')} type="button"><span>MODE A</span><b>报价形成：补偿要求与价格网格</b></button>
        <button aria-pressed={mode === 'measurement'} onClick={() => switchMode('measurement')} type="button"><span>MODE B</span><b>成交测量：ES、RS 与 Price Impact</b></button>
      </div>
      {mode === 'builder' ? <Builder /> : <Measurement />}
      <p className="spread-lab-caveat"><b>实验边界：</b>Mode A 不是结构估计器；它为了演算而强制将相关的现实机制分配到互不重复的增量栏，并把 break-even 与 residual markup 分开。Mode B 的 PI 是给定时间窗内的方向化 mid 变化，不自动等于纯粹的信息冲击或某一笔交易的因果效果。</p>
    </div>
  );
}
