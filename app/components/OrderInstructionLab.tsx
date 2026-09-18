'use client';

import { useMemo, useState } from 'react';

type LabMode = 'book' | 'stop';
type EntryInstruction = 'market' | 'passiveLimit' | 'tightLimit' | 'wideLimit';
type TimeInForce = 'day' | 'ioc';
type HardConstraint = 'none' | 'cap' | 'exact';
type ImmediateOutcome = 'full' | 'partial' | 'none';
type StopInstruction = 'stopMarket' | 'stopLimit';
type PricePath = 'smooth' | 'gap';
type ChildOrder = 'market' | 'limit' | 'exact';
type StopOutcome = 'filled' | 'resting' | 'atStop';

const asks = [
  { price: 100, quantity: 200 },
  { price: 100.02, quantity: 500 },
  { price: 100.05, quantity: 1000 },
] as const;

const entryInstructions = {
  market: {
    label: '市价买入',
    cap: Number.POSITIVE_INFINITY,
    constraint: 'none' as HardConstraint,
    description: '没有由交易者填写的最高买价；订单会尽快接受当前可获得的卖盘，但仍受场所规则约束。',
  },
  passiveLimit: {
    label: '限价 99.99 元买入',
    cap: 99.99,
    constraint: 'cap' as HardConstraint,
    description: '最高愿付 99.99 元，低于当前 100.00 元的最优卖价，因此抵达时不能立即成交。',
  },
  tightLimit: {
    label: '限价 100.01 元买入',
    cap: 100.01,
    constraint: 'cap' as HardConstraint,
    description: '最高愿付 100.01 元，可以吃掉 100.00 元卖盘，但不能接受 100.02 元卖盘。',
  },
  wideLimit: {
    label: '限价 100.03 元买入',
    cap: 100.03,
    constraint: 'cap' as HardConstraint,
    description: '保留 100.03 元硬上限，同时立即索取 100.00 与 100.02 元卖盘。',
  },
} as const;

const pricePaths = {
  smooth: {
    label: '连续下跌',
    preTriggerTrades: [102, 101, 100.2],
    triggerTrade: 99.95,
    bestBidAfterChildAcceptance: 99.9,
    availableBidSize: 1000,
    note: '触发成交与随后可执行买价相距很小，但仍是两个不同对象。',
  },
  gap: {
    label: '跳空下跌',
    preTriggerTrades: [102, 101, 100.2],
    triggerTrade: 97.1,
    bestBidAfterChildAcceptance: 97,
    availableBidSize: 1000,
    note: '最后一笔未触发成交为 100.20 元；下一笔合格成交跳到 97.10 元，子单通过验证时的最高买价为 97.00 元。',
  },
} as const;

const hardConstraintLabels: Record<HardConstraint, string> = {
  none: '没有自设最高买价',
  cap: '写入最高买价',
  exact: '写死成交价与数量',
};

const immediateOutcomeLabels: Record<ImmediateOutcome, string> = {
  full: '全部立即成交',
  partial: '部分立即成交，留下余量',
  none: '没有立即成交',
};

const childOrderLabels: Record<ChildOrder, string> = {
  market: '生成市价子单',
  limit: '生成限价子单',
  exact: '直接按触发价成交',
};

const stopOutcomeLabels: Record<StopOutcome, string> = {
  filled: '给定买盘足够，本例完成',
  resting: '价格不满足，子单等待',
  atStop: '必定按 100.00 元成交',
};

function formatPrice(value: number) {
  return value.toFixed(2);
}

function formatVwap(value: number) {
  return value.toFixed(4);
}

export default function OrderInstructionLab() {
  const [mode, setMode] = useState<LabMode>('book');
  const [entryInstruction, setEntryInstruction] = useState<EntryInstruction>('wideLimit');
  const [orderQuantity, setOrderQuantity] = useState<600 | 2000>(600);
  const [timeInForce, setTimeInForce] = useState<TimeInForce>('day');
  const [constraintPrediction, setConstraintPrediction] = useState<HardConstraint | null>(null);
  const [outcomePrediction, setOutcomePrediction] = useState<ImmediateOutcome | null>(null);
  const [entryRevealed, setEntryRevealed] = useState(false);
  const [stopInstruction, setStopInstruction] = useState<StopInstruction>('stopMarket');
  const [pricePath, setPricePath] = useState<PricePath>('gap');
  const [childPrediction, setChildPrediction] = useState<ChildOrder | null>(null);
  const [stopOutcomePrediction, setStopOutcomePrediction] = useState<StopOutcome | null>(null);
  const [stopRevealed, setStopRevealed] = useState(false);

  const entryResult = useMemo(() => {
    const instruction = entryInstructions[entryInstruction];
    const execution = asks.reduce<{ remaining: number; fills: { price: number; quantity: number; filled: number }[] }>((accumulator, level) => {
      const eligible = level.price <= instruction.cap;
      const filled = eligible ? Math.min(accumulator.remaining, level.quantity) : 0;
      return {
        remaining: accumulator.remaining - filled,
        fills: [...accumulator.fills, { ...level, filled }],
      };
    }, { remaining: orderQuantity, fills: [] });
    const { fills, remaining } = execution;
    const filledQuantity = orderQuantity - remaining;
    const notional = fills.reduce((sum, level) => sum + level.price * level.filled, 0);
    const vwap = filledQuantity > 0 ? notional / filledQuantity : null;
    const worstPrice = fills.filter((level) => level.filled > 0).at(-1)?.price ?? null;
    const immediateOutcome: ImmediateOutcome = filledQuantity === orderQuantity
      ? 'full'
      : filledQuantity === 0
        ? 'none'
        : 'partial';
    const remainder = remaining === 0
      ? '无剩余数量'
      : entryInstruction === 'market'
        ? `${remaining} 股没有可见对手量；后续处理取决于场所规则`
        : timeInForce === 'day'
          ? `${remaining} 股以 ${formatPrice(instruction.cap)} 元继续等待`
          : `${remaining} 股立即撤销，不进入等待队列`;

    return { fills, filledQuantity, vwap, worstPrice, immediateOutcome, remainder };
  }, [entryInstruction, orderQuantity, timeInForce]);

  const path = pricePaths[pricePath];
  const expectedChild: ChildOrder = stopInstruction === 'stopMarket' ? 'market' : 'limit';
  const expectedStopOutcome: StopOutcome = stopInstruction === 'stopMarket' || path.bestBidAfterChildAcceptance >= 99.5 ? 'filled' : 'resting';
  const stopResult = stopInstruction === 'stopMarket'
    ? {
        child: '触发后生成 100 股市价卖单',
        outcome: `假设处理无额外延迟，先在最高买价 ${formatPrice(path.bestBidAfterChildAcceptance)} 元成交 100 股。`,
        warning: '100.00 元是触发阈值；触发成交、子单通过验证时的最高买价与最终成交价不是同一个变量。',
      }
    : {
        child: '触发后生成 100 股、最低卖价 99.50 元的限价单',
        outcome: expectedStopOutcome === 'filled'
          ? `最高买价 ${formatPrice(path.bestBidAfterChildAcceptance)} 元不低于 99.50 元，本例以 ${formatPrice(path.bestBidAfterChildAcceptance)} 元成交 100 股。`
          : `最高买价 ${formatPrice(path.bestBidAfterChildAcceptance)} 元低于 99.50 元，订单不能立即成交并以 99.50 元等待。`,
        warning: expectedStopOutcome === 'filled'
          ? '限价得到价格改善；真实成交仍取决于优先级、数量与处理时延。'
          : '市场若继续下跌，仓位仍然存在；价格边界没有创造退出流动性。',
      };

  const resetEntryPrediction = () => {
    setConstraintPrediction(null);
    setOutcomePrediction(null);
    setEntryRevealed(false);
  };

  const resetStopPrediction = () => {
    setChildPrediction(null);
    setStopOutcomePrediction(null);
    setStopRevealed(false);
  };

  const chooseMode = (nextMode: LabMode) => {
    setMode(nextMode);
    resetEntryPrediction();
    resetStopPrediction();
  };

  const entryPredictionCorrect = constraintPrediction === entryInstructions[entryInstruction].constraint
    && outcomePrediction === entryResult.immediateOutcome;
  const stopPredictionCorrect = childPrediction === expectedChild && stopOutcomePrediction === expectedStopOutcome;

  const stopTimeline = [
    {
      state: 'ACCEPTED → DORMANT',
      value: `最近成交 ${formatPrice(path.preTriggerTrades.at(-1) ?? 0)}`,
      detail: '初始条件单已通过验证；本例采用标准成交触发，创建后尚无不高于 100.00 元的合格成交。',
    },
    {
      state: 'TRIGGER EVENT',
      value: `合格成交 ${formatPrice(path.triggerTrade)}`,
      detail: '第一笔不高于 100.00 元的合格成交出现，只负责启动子单生成，不代表子单已经被接受。',
    },
    {
      state: 'CHILD VALIDATION',
      value: expectedChild === 'market' ? 'Market' : 'Limit 99.50',
      detail: `${stopResult.child}；本实验假设子单通过券商与场所验证。`,
    },
    {
      state: expectedStopOutcome === 'filled' ? 'FILLED' : 'RESTING',
      value: `Best bid ${formatPrice(path.bestBidAfterChildAcceptance)}`,
      detail: stopResult.outcome,
    },
  ];

  return (
    <section className="order-instruction-lab" id="order-lab" aria-labelledby="order-lab-title">
      <div className="order-lab-head">
        <p>12 · INTERACTIVE · 指令—状态—结果</p>
        <h2 id="order-lab-title">把“写进订单的约束”与“抵达市场后的状态”分开预测</h2>
        <span>
          这个实验把复杂市场压缩成可核算的小模型。它训练状态判断，不模拟真实交易所的全部队列、费用、路由、隐藏量、价格保护或停牌规则。
        </span>
      </div>

      <div className="order-mode-picker" aria-label="选择实验" role="group">
        <button aria-pressed={mode === 'book'} onClick={() => chooseMode('book')} type="button">
          <span>EXPERIMENT 01</span><b>价格字段与验证后状态</b>
        </button>
        <button aria-pressed={mode === 'stop'} onClick={() => chooseMode('stop')} type="button">
          <span>EXPERIMENT 02</span><b>Stop 的触发、子单与执行</b>
        </button>
      </div>

      {mode === 'book' ? (
        <div className="order-experiment">
          <div className="order-control-panel">
            <div aria-labelledby="entry-instruction-label" role="group">
              <span id="entry-instruction-label">STEP 01 · 选择价格指令</span>
              <div className="order-choice-grid">
                {Object.entries(entryInstructions).map(([key, instruction]) => (
                  <button
                    aria-pressed={entryInstruction === key}
                    key={key}
                    onClick={() => {
                      setEntryInstruction(key as EntryInstruction);
                      resetEntryPrediction();
                    }}
                    type="button"
                  >
                    <b>{instruction.label}</b><small>{instruction.description}</small>
                  </button>
                ))}
              </div>
            </div>

            <div className="quantity-picker" aria-labelledby="entry-quantity-label" role="group">
              <span id="entry-quantity-label">目标买入数量</span>
              {[600, 2000].map((quantity) => (
                <button
                  aria-pressed={orderQuantity === quantity}
                  key={quantity}
                  onClick={() => {
                    setOrderQuantity(quantity as 600 | 2000);
                    resetEntryPrediction();
                  }}
                  type="button"
                >
                  {quantity.toLocaleString('zh-CN')} 股
                </button>
              ))}
            </div>

            {entryInstruction !== 'market' && (
              <div className="tif-picker" aria-labelledby="entry-tif-label" role="group">
                <span id="entry-tif-label">剩余数量如何处理</span>
                <button
                  aria-pressed={timeInForce === 'day'}
                  onClick={() => {
                    setTimeInForce('day');
                    resetEntryPrediction();
                  }}
                  type="button"
                >DAY · 当日继续等待</button>
                <button
                  aria-pressed={timeInForce === 'ioc'}
                  onClick={() => {
                    setTimeInForce('ioc');
                    resetEntryPrediction();
                  }}
                  type="button"
                >IOC · 可得部分立即成交，剩余撤销</button>
              </div>
            )}

            <div className="order-prediction dual-prediction">
              <span>STEP 02 · 先作两次预测</span>
              <div aria-labelledby="constraint-question" role="group">
                <h3 id="constraint-question">A. 指令显式写入了哪项硬约束？</h3>
                {Object.entries(hardConstraintLabels).map(([key, label]) => (
                  <button aria-pressed={constraintPrediction === key} key={key} onClick={() => { setConstraintPrediction(key as HardConstraint); setEntryRevealed(false); }} type="button">{label}</button>
                ))}
              </div>
              <div aria-labelledby="outcome-question" role="group">
                <h3 id="outcome-question">B. 假设通过初始验证，进入 ACTIVE 后首先发生什么？</h3>
                {Object.entries(immediateOutcomeLabels).map(([key, label]) => (
                  <button aria-pressed={outcomePrediction === key} key={key} onClick={() => { setOutcomePrediction(key as ImmediateOutcome); setEntryRevealed(false); }} type="button">{label}</button>
                ))}
              </div>
              <button className="order-reveal" disabled={!constraintPrediction || !outcomePrediction} onClick={() => setEntryRevealed(true)} type="button">运行订单</button>
            </div>
          </div>

          {entryRevealed && constraintPrediction && outcomePrediction ? (
            <div className="order-output">
              <div className={entryPredictionCorrect ? 'order-feedback correct' : 'order-feedback'} aria-live="polite" role="status">
                <b>{entryPredictionCorrect ? '两项预测都命中。' : '至少有一项需要修正。'}</b>
                <p>
                  硬约束：{hardConstraintLabels[entryInstructions[entryInstruction].constraint]}；验证通过后的即时状态：{immediateOutcomeLabels[entryResult.immediateOutcome]}。
                  价格边界来自订单字段，即时成交程度来自该边界、数量与当前簿面的关系。
                </p>
              </div>
              <p className="order-result-announcement" aria-live="polite" role="status">
                执行摘要：成交 {entryResult.filledQuantity} / {orderQuantity} 股；
                {entryResult.vwap === null ? '没有成交均价' : `VWAP（四位小数）${formatVwap(entryResult.vwap)} 元`}；{entryResult.remainder}。
              </p>
              <div className="book-and-result">
                <div className="mini-book">
                  <table>
                    <caption>简化卖盘 · 提交前</caption>
                    <thead><tr><th scope="col">卖价</th><th scope="col">可卖数量</th><th scope="col">本单成交</th></tr></thead>
                    <tbody>
                      {entryResult.fills.map((level) => (
                        <tr className={level.filled > 0 ? 'used' : ''} key={level.price}>
                          <td>{formatPrice(level.price)}</td><td>{level.quantity}</td><td>{level.filled || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="order-metrics">
                  <article><span>成交数量</span><strong>{entryResult.filledQuantity} / {orderQuantity} 股</strong></article>
                  <article><span>成交均价</span><strong>{entryResult.vwap === null ? '未成交' : `${formatVwap(entryResult.vwap)} 元`}</strong></article>
                  <article><span>最差成交价</span><strong>{entryResult.worstPrice === null ? '—' : `${formatPrice(entryResult.worstPrice)} 元`}</strong></article>
                  <article><span>剩余指令</span><strong>{entryResult.remainder}</strong></article>
                </div>
              </div>
              <p className="order-lab-caveat">
                教学假设：普通订单均通过初始验证；市场只有表中三档卖单，不计费用、隐藏量、其他订单、延迟与撤单。2,000 股情景还会直接展示：即使没有自设限价，市价单也不能凭空创造超过 1,700 股的对手量。
              </p>
            </div>
          ) : (
            <div className="order-output locked"><span>STEP 03</span><p>完成“硬约束”和“验证通过后的即时状态”两次预测后，系统才会显示逐档成交、均价和余量。</p></div>
          )}
        </div>
      ) : (
        <div className="order-experiment stop-experiment">
          <div className="order-control-panel">
            <p className="stop-lab-assumption">
              <b>路径前提：</b>初始条件单已通过验证并处于 DORMANT。触发后时间线仍会展示 CHILD VALIDATION；为比较两种子单在同一买盘下的结果，本实验预先假设候选子单通过该验证。
            </p>
            <div aria-labelledby="stop-instruction-label" role="group">
              <span id="stop-instruction-label">STEP 01 · 选择条件指令</span>
              <div className="order-choice-grid two">
                <button aria-pressed={stopInstruction === 'stopMarket'} onClick={() => { setStopInstruction('stopMarket'); resetStopPrediction(); }} type="button">
                  <b>卖出 Stop-Market · 100 股</b><small>触发价 100.00 元；触发后生成市价卖单。</small>
                </button>
                <button aria-pressed={stopInstruction === 'stopLimit'} onClick={() => { setStopInstruction('stopLimit'); resetStopPrediction(); }} type="button">
                  <b>卖出 Stop-Limit · 100 股</b><small>触发价 100.00 元；触发后生成最低卖价 99.50 元的限价单。</small>
                </button>
              </div>
            </div>
            <div className="path-picker" aria-labelledby="stop-path-label" role="group">
              <span id="stop-path-label">选择成交路径</span>
              {Object.entries(pricePaths).map(([key, item]) => (
                <button aria-pressed={pricePath === key} key={key} onClick={() => { setPricePath(key as PricePath); resetStopPrediction(); }} type="button">{item.label}</button>
              ))}
            </div>
            <div className="order-prediction dual-prediction">
              <span>STEP 02 · 先作两次预测</span>
              <div aria-labelledby="child-question" role="group">
                <h3 id="child-question">A. 合格成交触发后生成什么？</h3>
                {Object.entries(childOrderLabels).map(([key, label]) => (
                  <button aria-pressed={childPrediction === key} key={key} onClick={() => { setChildPrediction(key as ChildOrder); setStopRevealed(false); }} type="button">{label}</button>
                ))}
              </div>
              <div aria-labelledby="stop-outcome-question" role="group">
                <h3 id="stop-outcome-question">B. 假设子单通过验证，给定通过时的买盘，结果是什么？</h3>
                {Object.entries(stopOutcomeLabels).map(([key, label]) => (
                  <button aria-pressed={stopOutcomePrediction === key} key={key} onClick={() => { setStopOutcomePrediction(key as StopOutcome); setStopRevealed(false); }} type="button">{label}</button>
                ))}
              </div>
              <button className="order-reveal" disabled={!childPrediction || !stopOutcomePrediction} onClick={() => setStopRevealed(true)} type="button">播放四阶段状态</button>
            </div>
          </div>

          {stopRevealed && childPrediction && stopOutcomePrediction ? (
            <div className="order-output">
              <div className={stopPredictionCorrect ? 'order-feedback correct' : 'order-feedback'} aria-live="polite" role="status">
                <b>{stopPredictionCorrect ? '两项预测都命中。' : '至少有一项需要修正。'}</b>
                <p>
                  正确路径：{childOrderLabels[expectedChild]} → {stopOutcomeLabels[expectedStopOutcome]}。{stopResult.warning}
                </p>
              </div>
              <p className="order-result-announcement" aria-live="polite" role="status">
                本例采用 FINRA 标准成交触发语义；子单通过验证时 best bid 为 {formatPrice(path.bestBidAfterChildAcceptance)} 元、可用数量 {path.availableBidSize} 股。
              </p>
              <div className="stop-timeline" aria-label={`${path.label}中的条件单状态`}>
                {stopTimeline.map((step, index) => (
                  <div className={index === 1 ? 'triggered' : ''} key={step.state}>
                    <span>{String(index + 1).padStart(2, '0')} · {step.state}</span>
                    <strong>{step.value}</strong>
                    <p>{step.detail}</p>
                  </div>
                ))}
              </div>
              <div className="stop-outcome"><span>本例结果</span><b>{stopResult.outcome}</b><p>{path.note} 本实验另假设最高买价可用 1,000 股，足够承接 100 股子单；真实结果还取决于处理延迟、队列与后续订单变化。</p></div>
            </div>
          ) : (
            <div className="order-output locked"><span>STEP 03</span><p>完成“生成什么子单”和“给定买盘如何处理”两次预测后，系统才会分开展示触发与执行。</p></div>
          )}
        </div>
      )}
    </section>
  );
}
