'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

type Level = { price: number; size: number };
type BookState = {
  label: string;
  bids: Level[];
  asks: Level[];
  lastTrade: number | null;
  note: string;
};

type TapeEvent = {
  title: string;
  message: string;
  question: string;
  options: { id: string; label: string; diagnosis: string }[];
  correct: string;
  explanation: string;
};

const bookStates: BookState[] = [
  {
    label: 'S0 · 初始快照',
    bids: [{ price: 99.99, size: 500 }, { price: 99.98, size: 800 }, { price: 99.97, size: 1000 }],
    asks: [{ price: 100.01, size: 300 }, { price: 100.02, size: 600 }, { price: 100.03, size: 900 }],
    lastTrade: null,
    note: '这是单一场所、连续交易、只含显示数量的教学订单簿。',
  },
  {
    label: 'S1 · 买价改善',
    bids: [{ price: 100.00, size: 200 }, { price: 99.99, size: 500 }, { price: 99.98, size: 800 }, { price: 99.97, size: 1000 }],
    asks: [{ price: 100.01, size: 300 }, { price: 100.02, size: 600 }, { price: 100.03, size: 900 }],
    lastTrade: null,
    note: '100.00 低于最优卖价 100.01，因此没有成交；它成为新的最优买价。',
  },
  {
    label: 'S2 · 主动卖单到达',
    bids: [{ price: 100.00, size: 80 }, { price: 99.99, size: 500 }, { price: 99.98, size: 800 }, { price: 99.97, size: 1000 }],
    asks: [{ price: 100.01, size: 300 }, { price: 100.02, size: 600 }, { price: 100.03, size: 900 }],
    lastTrade: 100.00,
    note: '卖出限价 100.00 可与既有买价 100.00 成交 120 股；成交价采用既有挂单价格。',
  },
  {
    label: 'S3 · 最优买档撤空',
    bids: [{ price: 99.99, size: 500 }, { price: 99.98, size: 800 }, { price: 99.97, size: 1000 }],
    asks: [{ price: 100.01, size: 300 }, { price: 100.02, size: 600 }, { price: 100.03, size: 900 }],
    lastTrade: 100.00,
    note: '撤单不是成交，却让 100.00 买档消失，最优买价回到 99.99。',
  },
  {
    label: 'S4 · 主动买单扫过两档',
    bids: [{ price: 99.99, size: 500 }, { price: 99.98, size: 800 }, { price: 99.97, size: 1000 }],
    asks: [{ price: 100.02, size: 450 }, { price: 100.03, size: 900 }],
    lastTrade: 100.02,
    note: '450 股买单先成交 300@100.01，再成交 150@100.02；新的最优卖价为 100.02。',
  },
  {
    label: 'S5 · 卖价改善',
    bids: [{ price: 99.99, size: 500 }, { price: 99.98, size: 800 }, { price: 99.97, size: 1000 }],
    asks: [{ price: 100.00, size: 200 }, { price: 100.02, size: 450 }, { price: 100.03, size: 900 }],
    lastTrade: 100.02,
    note: '100.00 高于最优买价 99.99，因此不成交；它进入卖方队列并改善最优卖价。',
  },
];

const tape: TapeEvent[] = [
  {
    title: 'EVENT 01 · 新增限价单',
    message: '一张买入限价单：200 股 @ 100.00 抵达。',
    question: '下一状态最主要的变化是什么？',
    options: [
      { id: 'rest-improve', label: '不成交；best bid 改为 100.00', diagnosis: '价格约束与状态更新都判断正确：它不能成交，但可以成为新的最优买档。' },
      { id: 'trade', label: '立即与 100.01 的卖单成交', diagnosis: '你把“限价单”误解成必须立即成交。100.00 是买方最高接受价，仍低于 100.01 的 best ask。' },
      { id: 'unchanged', label: '因为没有成交，订单簿保持不变', diagnosis: '你把“没有成交”误当成“没有状态变化”。新增挂单可以改善报价，即使 last trade 不变。' },
    ],
    correct: 'rest-improve',
    explanation: '买入限价 100.00 仍低于 best ask 100.01，不能立即成交；但它高于原 best bid 99.99，所以建立一个新的买方最优档。',
  },
  {
    title: 'EVENT 02 · 可成交限价单',
    message: '一张卖出限价单：120 股 @ 100.00 抵达。',
    question: '它会等待，还是会立刻执行？',
    options: [
      { id: 'rest-ask', label: '作为 best ask 100.00 等待', diagnosis: '你忽略了可成交性：卖出限价等于当前 best bid，先与既有买单执行，而不是先等待。' },
      { id: 'hit-bid', label: '与既有 100.00 买单成交 120 股', diagnosis: '方向、价格约束与既有挂单定价都判断正确。' },
      { id: 'trade-ask', label: '与 100.01 卖单成交 120 股', diagnosis: '你把主动卖单匹配到了同侧。卖单要寻找买方流动性，因此先触及 bid，而不是 ask。' },
    ],
    correct: 'hit-bid',
    explanation: '卖出限价等于当前 best bid，因此具有 marketability。它与先在簿中的买单成交，100.00 买档由 200 股降到 80 股。',
  },
  {
    title: 'EVENT 03 · 撤销剩余挂单',
    message: '100.00 买档剩余 80 股的撤销已获撮合系统确认。',
    question: '撤单之后，什么发生了？',
    options: [
      { id: 'bid-down', label: '没有交易；best bid 回到 99.99', diagnosis: '你正确地区分了 CANCEL 与 EXECUTE：撤空最优买档会改变报价，但不会产生新成交。' },
      { id: 'trade-cancel', label: '撤单产生一笔 80 股成交', diagnosis: '你混淆了 CANCEL 与 EXECUTE。确认撤单只移除尚未成交数量，last trade 仍停在 100.00。' },
      { id: 'ask-down', label: 'best ask 降到 100.00', diagnosis: '被移除的是买方 100.00 档；它会影响 best bid，不会凭空改写卖方队列。' },
    ],
    correct: 'bid-down',
    explanation: '撤单只移除尚未成交的承诺，不产生交易。最优买档被撤空后，下一档 99.99 自动成为 best bid。',
  },
  {
    title: 'EVENT 04 · 主动买单',
    message: '一张买入市价单：450 股抵达。',
    question: '在本实验的静态可见簿假设下，它怎样成交？',
    options: [
      { id: 'two-levels', label: '300@100.01 ＋ 150@100.02', diagnosis: '你保持了最优价优先和逐档数量守恒。' },
      { id: 'one-level', label: '全部 450 股都在 100.01 成交', diagnosis: '你让 100.01 档成交了超过其 300 股显示量，破坏了本实验给定的静态数量约束。' },
      { id: 'partial-only', label: '只成交 300 股，其余必然撤销', diagnosis: '你额外加入了本题没有给出的剩余撤销条件；这里的主动买单会继续触及下一可见卖档。' },
    ],
    correct: 'two-levels',
    explanation: '最优卖档只有 300 股，余下 150 股继续触及第二档 100.02。第二档原有 600 股，因此成交后还剩 450 股。',
  },
  {
    title: 'EVENT 05 · 价差内新增卖单',
    message: '一张卖出限价单：200 股 @ 100.00 抵达。',
    question: '此时 best bid 为 99.99，它会怎样改变订单簿？',
    options: [
      { id: 'new-ask', label: '不成交；best ask 改为 100.00', diagnosis: '你正确识别了它位于价差内：不跨 bid，却以更低卖价获得价格优先。' },
      { id: 'sell-now', label: '立即在 99.99 成交', diagnosis: '你忽略了卖方限价约束：100.00 是最低接受价，不能在更低的 99.99 成交。' },
      { id: 'behind-ask', label: '排在 100.02 卖档之后', diagnosis: '价格优先先于时间优先。100.00 比 100.02 更有竞争力，会建立新档，而不是排在旧档之后。' },
    ],
    correct: 'new-ask',
    explanation: '100.00 高于 best bid 99.99，因此不是可成交卖单；但它低于旧 best ask 100.02，所以在价差内建立新的卖方最优档。',
  },
];

function best(levels: Level[]) {
  return levels[0];
}

function Book({ state }: { state: BookState }) {
  const bid = best(state.bids);
  const ask = best(state.asks);
  const spread = ask && bid ? ask.price - bid.price : null;
  const mid = ask && bid ? (ask.price + bid.price) / 2 : null;

  return (
    <div className="lob-book-panel">
      <div className="lob-state-label"><span>{state.label}</span><p>{state.note}</p></div>
      <div className="lob-book-metrics" aria-label="当前订单簿派生指标与最近成交价">
        <div><span>BBO</span><strong>{bid && ask ? `${bid.price.toFixed(2)} / ${ask.price.toFixed(2)}` : '—'}</strong></div>
        <div><span>SPREAD</span><strong>{spread?.toFixed(2) ?? '—'}</strong></div>
        <div><span>MIDQUOTE</span><strong>{mid?.toFixed(3) ?? '—'}</strong></div>
        <div><span>LAST · 独立成交记录</span><strong>{state.lastTrade?.toFixed(2) ?? '未给定'}</strong></div>
      </div>
      <table className="lob-book-table">
        <caption>当前显示订单簿；卖盘在上、买盘在下，靠近中线的是最优报价</caption>
        <thead><tr><th scope="col">方向</th><th scope="col">价格</th><th scope="col">显示数量</th></tr></thead>
        <tbody>
          {[...state.asks].reverse().map((level) => (
            <tr className={level.price === ask?.price ? 'ask best' : 'ask'} key={`ask-${level.price}`}>
              <th scope="row">ASK{level.price === ask?.price ? ' · BEST' : ''}</th><td>{level.price.toFixed(2)}</td><td>{level.size.toLocaleString('en-US')}</td>
            </tr>
          ))}
          <tr className="book-gap"><th scope="row">BBO</th><td colSpan={2}>{bid && ask ? `${bid.price.toFixed(2)} / ${ask.price.toFixed(2)}` : '—'}</td></tr>
          {state.bids.map((level) => (
            <tr className={level.price === bid?.price ? 'bid best' : 'bid'} key={`bid-${level.price}`}>
              <th scope="row">BID{level.price === bid?.price ? ' · BEST' : ''}</th><td>{level.price.toFixed(2)}</td><td>{level.size.toLocaleString('en-US')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function EventTape() {
  const [step, setStep] = useState(0);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const eventTitleRef = useRef<HTMLHeadingElement>(null);
  const focusEventAfterAdvanceRef = useRef(false);
  const event = tape[step];
  const visibleState = revealed ? bookStates[step + 1] : bookStates[step];
  const correct = prediction === event.correct;
  const selectedOption = event.options.find((option) => option.id === prediction);
  const nextState = bookStates[step + 1];
  const nextBid = best(nextState.bids);
  const nextAsk = best(nextState.asks);
  const nextSpread = nextAsk && nextBid ? nextAsk.price - nextBid.price : null;
  const nextMid = nextAsk && nextBid ? (nextAsk.price + nextBid.price) / 2 : null;

  useEffect(() => {
    if (revealed) {
      resultRef.current?.focus();
    } else if (focusEventAfterAdvanceRef.current) {
      eventTitleRef.current?.focus();
      focusEventAfterAdvanceRef.current = false;
    }
  }, [revealed, step]);

  function advance() {
    focusEventAfterAdvanceRef.current = true;
    if (step === tape.length - 1) {
      setStep(0);
    } else {
      setStep((value) => value + 1);
    }
    setPrediction(null);
    setRevealed(false);
  }

  return (
    <div className="lob-experiment">
      <div className="lob-control-panel">
        <div
          aria-label={`事件 ${step + 1}，共 ${tape.length} 个`}
          aria-valuemax={tape.length}
          aria-valuemin={1}
          aria-valuenow={step + 1}
          aria-valuetext={`当前为第 ${step + 1} 个事件，共 ${tape.length} 个`}
          className="lob-progress"
          role="progressbar"
        >
          {tape.map((item, index) => <i aria-hidden="true" className={index < step || (index === step && revealed) ? 'done' : index === step ? 'current' : ''} key={item.title} />)}
        </div>
        <span className="lob-event-label">{event.title}</span>
        <h3 ref={eventTitleRef} tabIndex={-1}>{event.message}</h3>
        <p>{event.question}</p>
        <div className="lob-choice-grid" role="group" aria-label="选择你的预测">
          {event.options.map((option) => (
            <button
              aria-pressed={prediction === option.id}
              disabled={revealed}
              key={option.id}
              onClick={() => setPrediction(option.id)}
              type="button"
            >{option.label}</button>
          ))}
        </div>
        {!revealed ? <>
          <button className="lob-primary-action" disabled={!prediction} onClick={() => setRevealed(true)} type="button">揭示并更新订单簿</button>
          <p className="lob-locked-note">先提交预测，右侧订单簿才会从 S{step} 更新到 S{step + 1}。</p>
        </> : <>
          <div
            aria-live="polite"
            className={correct ? 'lob-feedback correct' : 'lob-feedback'}
            ref={resultRef}
            role="status"
            tabIndex={-1}
          >
            <b>{correct ? '预测正确' : '这次预测需要修正'}</b>
            {!correct && selectedOption ? <p className="lob-diagnosis"><strong>错误来源：</strong>{selectedOption.diagnosis}</p> : null}
            <p>{event.explanation}</p>
            <p className="lob-status-summary">
              <strong>事件已应用：</strong>BBO {nextBid && nextAsk ? `${nextBid.price.toFixed(2)} / ${nextAsk.price.toFixed(2)}` : '未定义'}，
              spread {nextSpread?.toFixed(2) ?? '未定义'}，mid {nextMid?.toFixed(3) ?? '未定义'}，
              last {nextState.lastTrade?.toFixed(2) ?? '未给定'}。{nextState.note}
            </p>
          </div>
          <button className="lob-primary-action" onClick={advance} type="button">{step === tape.length - 1 ? '重新播放事件带' : '进入下一事件'}</button>
        </>}
      </div>
      <Book state={visibleState} />
    </div>
  );
}

type QueueTask = 'cancellation' | 'allocation';
type CancelPosition = 'ahead' | 'behind';
type AllocationRule = 'fifo' | 'pro-rata';

function QueueLab() {
  const [task, setTask] = useState<QueueTask>('cancellation');
  const [cancelPosition, setCancelPosition] = useState<CancelPosition>('ahead');
  const [allocationRule, setAllocationRule] = useState<AllocationRule>('fifo');
  const [prediction, setPrediction] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const parameterRef = useRef<HTMLDivElement>(null);
  const focusParameterAfterResetRef = useRef(false);

  const answer = useMemo(() => {
    if (task === 'cancellation') return cancelPosition === 'ahead' ? 80 : 0;
    return allocationRule === 'fifo' ? 0 : 125;
  }, [allocationRule, cancelPosition, task]);

  const diagnosis = useMemo(() => {
    if (prediction === null || prediction === answer) return null;
    if (task === 'cancellation' && cancelPosition === 'ahead') {
      return prediction === 0
        ? '你看到了原始 500 股 queue ahead，却没有先扣除前方已确认撤掉的 150 股。430 股对手量越过剩余 350 股后，还会触及你的 80 股。'
        : '用自己的 250 股替代了前方门槛，算成 430−250=180。自己的订单量决定成交上限，却不能代替 500−150=350 股的 queue ahead。';
    }
    if (task === 'cancellation' && cancelPosition === 'behind') {
      return prediction === 80
        ? '把后方撤单当成前方撤单，从 500 股 queue ahead 中错误扣除了 150 股。后方数量离开不会缩短你前面的队列。'
        : '用自己的 250 股替代了前方门槛，算成 430−250=180。真正的 queue ahead 仍是 500 股，因此 430 股尚未触及你。';
    }
    if (allocationRule === 'fifo') {
      return prediction === 125
        ? '你使用了比例分配。严格 FIFO 会让 500 股先完整给 A 与 B，尚未轮到你的订单。'
        : '忽略了前方 A 与 B，并把自己的 250 股直接视为全额成交。严格 FIFO 下，500 股对手量在到达你之前已经耗尽。';
    }
    return prediction === 0
      ? '你沿用了 FIFO。纯比例教学规则不看前后位置，而按你的 250/1,000 份额分配 500 股。'
      : '把按份额分配误作自己的 250 股全额成交。你只占同价总量的 25%，因此只能获得 500 股对手量的 25%。';
  }, [allocationRule, answer, cancelPosition, prediction, task]);

  useEffect(() => {
    if (revealed) {
      resultRef.current?.focus();
    } else if (focusParameterAfterResetRef.current) {
      parameterRef.current?.focus();
      focusParameterAfterResetRef.current = false;
    }
  }, [revealed, task]);

  function reset(nextTask?: QueueTask, focusParameter = false) {
    focusParameterAfterResetRef.current = focusParameter;
    if (nextTask) setTask(nextTask);
    setPrediction(null);
    setRevealed(false);
  }

  return (
    <div className="queue-lab">
      <div className="queue-task-picker" aria-label="选择排队实验" role="group">
        <button aria-pressed={task === 'cancellation'} onClick={() => reset('cancellation')} type="button"><span>CHALLENGE A</span><b>撤单发生在前方还是后方</b></button>
        <button aria-pressed={task === 'allocation'} onClick={() => reset('allocation')} type="button"><span>CHALLENGE B</span><b>同价数量由谁获得</b></button>
      </div>

      {task === 'cancellation' ? (
        <div className="queue-challenge">
          <div>
            <span>公开假设 · 单一价位 · FIFO</span>
            <h3>A 200 → B 300 → 你的订单 250 → C 200</h3>
            <p>随后撤销 150 股，再依次有 250 股和 180 股主动卖单真正到达这个价位，总计消耗 430 股。新增订单都排在你的后方；没有隐藏量、改价、价格更优订单或数量门槛。</p>
          </div>
          <div className="queue-parameter" ref={parameterRef} tabIndex={-1}>
            <span>150 股撤单来自哪里？</span>
            <button aria-pressed={cancelPosition === 'ahead'} disabled={revealed} onClick={() => { setCancelPosition('ahead'); setPrediction(null); }} type="button">A 的 150 股 · 在你前方</button>
            <button aria-pressed={cancelPosition === 'behind'} disabled={revealed} onClick={() => { setCancelPosition('behind'); setPrediction(null); }} type="button">C 的 150 股 · 在你后方</button>
          </div>
          <div className="queue-predict" role="group" aria-label="预测自己的成交数量">
            <span>预测：你的 250 股最终成交多少？</span>
            {[0, 80, 180].map((value) => <button aria-pressed={prediction === value} disabled={revealed} key={value} onClick={() => setPrediction(value)} type="button">{value} 股</button>)}
          </div>
        </div>
      ) : (
        <div className="queue-challenge">
          <div>
            <span>公开假设 · 同一价格 · 一次 500 股主动卖单</span>
            <h3>A 200 → B 300 → 你的订单 250 → C 250</h3>
            <p>总挂单为 1,000 股。纯比例算法只用于教学，假设没有最小分配、Top order、做市商优先、取整与残余分配。</p>
          </div>
          <div className="queue-parameter" ref={parameterRef} tabIndex={-1}>
            <span>选择比较规则</span>
            <button aria-pressed={allocationRule === 'fifo'} disabled={revealed} onClick={() => { setAllocationRule('fifo'); setPrediction(null); }} type="button">FIFO · 严格时间顺序</button>
            <button aria-pressed={allocationRule === 'pro-rata'} disabled={revealed} onClick={() => { setAllocationRule('pro-rata'); setPrediction(null); }} type="button">教学式纯 Pro-Rata</button>
          </div>
          <div className="queue-predict" role="group" aria-label="预测自己的分配数量">
            <span>预测：你的 250 股获得多少成交？</span>
            {[0, 125, 250].map((value) => <button aria-pressed={prediction === value} disabled={revealed} key={value} onClick={() => setPrediction(value)} type="button">{value} 股</button>)}
          </div>
        </div>
      )}

      {!revealed ? (
        <button className="lob-primary-action queue-reveal" disabled={prediction === null} onClick={() => setRevealed(true)} type="button">揭示队列结果</button>
      ) : (
        <div
          aria-live="polite"
          className={prediction === answer ? 'queue-answer correct' : 'queue-answer'}
          ref={resultRef}
          role="status"
          tabIndex={-1}
        >
          <span>{prediction === answer ? '预测正确' : '需要修正'}</span>
          <strong>你的成交量 = {answer} 股</strong>
          {diagnosis ? <p className="queue-diagnosis"><b>这个答案通常意味着：</b>{diagnosis}</p> : null}
          {task === 'cancellation' ? (
            <p>{cancelPosition === 'ahead'
              ? '前方 500 股先因撤单减少到 350 股；430 股主动卖量先消耗这 350 股，再触及你的前 80 股。公式为 max(430 − 350, 0) = 80。'
              : '撤掉的是你后方的数量，前方仍有 500 股；430 股主动卖量尚未越过前方队列，所以你的成交量仍为 0。'}
            </p>
          ) : (
            <p>{allocationRule === 'fifo'
              ? 'FIFO 下，500 股先完整分配给 A 的 200 股与 B 的 300 股；你的订单尚未轮到。'
              : '纯比例教学规则下，你占同价总量的 250/1,000 = 25%，因此获得 500×25% = 125 股。真实产品还可能加入阈值、优先份额、取整与残余分配。'}
            </p>
          )}
          <button onClick={() => reset(undefined, true)} type="button">修改假设并重算</button>
        </div>
      )}
    </div>
  );
}

export default function LimitOrderBookLab() {
  const [mode, setMode] = useState<'events' | 'queue'>('events');

  return (
    <section className="limit-book-lab" id="book-lab">
      <div className="lob-lab-head">
        <p>INTERACTIVE · LIMIT ORDER BOOK LAB</p>
        <h2>先预测事件怎样改写状态，再观察排队权怎样变成成交</h2>
        <span>所有数字与事件顺序都是公开的教学情景，不代表经验概率。事件带固定为单一场所、连续交易、普通显示订单、价格优先后 FIFO、主动单按既有挂单价格成交且无传输延迟；所有 ADD、CANCEL 与 EXECUTE 都指已通过场所验证并被接受或确认的消息，拒绝分支属于 1.03。队列实验切换规则时会另行明示。</span>
      </div>
      <div className="lob-mode-picker" role="group" aria-label="选择订单簿实验模式">
        <button aria-pressed={mode === 'events'} onClick={() => setMode('events')} type="button"><span>LAB 01</span><b>事件带：新增、成交与撤单</b></button>
        <button aria-pressed={mode === 'queue'} onClick={() => setMode('queue')} type="button"><span>LAB 02</span><b>队列权：位置与分配规则</b></button>
      </div>
      {mode === 'events' ? <EventTape /> : <QueueLab />}
      <p className="lob-lab-caveat"><b>解释边界：</b>这里的订单簿是事件发生后立即更新的确定性教学状态。现实公开行情可能只显示部分价位或聚合数量，并存在传输延迟、隐藏量、其他场所、路由和更复杂的优先类别；因此实验教的是状态转换逻辑，不是承诺真实订单一定这样成交。</p>
    </section>
  );
}
