'use client';

import { useMemo, useState } from 'react';

const initialLast = 100.9;
const initialBestBid = 100.9;
const initialBestAsk = 101.0;

const asks = [
  { price: 101.0, quantity: 300, cumulative: 300 },
  { price: 101.1, quantity: 500, cumulative: 800 },
  { price: 101.25, quantity: 800, cumulative: 1_600 },
  { price: 101.5, quantity: 1_300, cumulative: 2_900 },
  { price: 102.0, quantity: 2_000, cumulative: 4_900 },
];

function executeVisibleMarketBuy(orderSize: number) {
  const initial = { remaining: orderSize, notional: 0, filled: 0, lastPrice: initialBestAsk, executions: [] as Array<(typeof asks)[number] & { take: number }> };
  const state = asks.reduce((result, level) => {
    const take = Math.min(result.remaining, level.quantity);
    return {
      remaining: result.remaining - take,
      notional: result.notional + take * level.price,
      filled: result.filled + take,
      lastPrice: take > 0 ? level.price : result.lastPrice,
      executions: [...result.executions, { ...level, take }],
    };
  }, initial);

  return {
    executions: state.executions,
    filled: state.filled,
    unfilled: state.remaining,
    lastPrice: state.lastPrice,
    vwap: state.filled ? state.notional / state.filled : 0,
    lastToLast: ((state.lastPrice / initialLast) - 1) * 10_000,
    sweepFromAsk: ((state.lastPrice / initialBestAsk) - 1) * 10_000,
  };
}

export default function MarginalPriceLab() {
  const [orderSize, setOrderSize] = useState(600);
  const result = useMemo(() => executeVisibleMarketBuy(orderSize), [orderSize]);
  const midpoint = (initialBestBid + initialBestAsk) / 2;

  return (
    <section className="price-lab" id="price-lab" aria-labelledby="price-lab-title">
      <div className="lab-heading">
        <div>
          <p>05 · INTERACTIVE · 订单簿实验</p>
          <h2 id="price-lab-title">一笔买单会让哪一种“价格”改变？</h2>
        </div>
        <div className="lab-order-size"><strong>{orderSize.toLocaleString()}</strong><span>股可成交买单</span></div>
      </div>

      <p className="lab-assumption">
        简化假设：这是单一交易场所某一瞬间的静态可见订单簿；执行期间没有撤单、补单、隐藏数量、价格保护或跨市场路由。
        “可成交买单”表示愿意立即与现有卖价成交的订单，不承诺现实中的任何市价单都必然全部成交。
      </p>

      <label className="lab-slider">
        <span>拖动订单规模，先预测它最后会触及哪一档</span>
        <input
          aria-label="可成交买单股数"
          aria-valuetext={`${orderSize.toLocaleString()} 股`}
          max="6000"
          min="100"
          onChange={(event) => setOrderSize(Number(event.target.value))}
          step="100"
          type="range"
          value={orderSize}
        />
        <span className="slider-limits"><i>100 股</i><i>6,000 股</i></span>
      </label>

      <div className="lab-grid">
        <table className="order-book">
          <caption className="sr-only">卖方可见订单簿及当前买单的逐档成交结果</caption>
          <thead>
            <tr><th scope="col">卖价 Ask</th><th scope="col">该档数量</th><th scope="col">累计卖量</th><th scope="col">本单成交</th></tr>
          </thead>
          <tbody>
            {result.executions.map((level) => (
              <tr className={level.take ? 'consumed' : ''} key={level.price}>
                <td>¥ {level.price.toFixed(2)}</td>
                <td>{level.quantity.toLocaleString()}</td>
                <td>{level.cumulative.toLocaleString()}</td>
                <td><b>{level.take ? level.take.toLocaleString() : '—'}</b><i style={{ width: `${(level.take / level.quantity) * 100}%` }} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="lab-results">
          <div><span>初始 best bid / ask</span><strong>¥ {initialBestBid.toFixed(2)} / {initialBestAsk.toFixed(2)}</strong></div>
          <div><span>初始 mid-quote</span><strong>¥ {midpoint.toFixed(2)}</strong></div>
          <div><span>上一笔成交价</span><strong>¥ {initialLast.toFixed(2)}</strong></div>
          <div><span>{result.unfilled ? '已成交部分 VWAP' : '本单 VWAP'}</span><strong>¥ {result.vwap.toFixed(3)}</strong></div>
          <div className="primary"><span>{result.unfilled ? '已成交部分最后价' : '本单最后成交价'}</span><strong>¥ {result.lastPrice.toFixed(2)}</strong></div>
          <div><span>last-to-last 跳动</span><strong>+ {result.lastToLast.toFixed(1)} bp</strong></div>
          <div><span>相对初始 ask 的扫档幅度</span><strong>+ {result.sweepFromAsk.toFixed(1)} bp</strong></div>
          {result.unfilled > 0 && <p>可见卖盘只成交 {result.filled.toLocaleString()} 股；剩余 {result.unfilled.toLocaleString()} 股的执行价无法由当前快照推出。</p>}
        </div>
        <p className="sr-only" aria-live="polite">
          订单规模 {orderSize.toLocaleString()} 股；{result.unfilled ? '已成交部分' : '本单'}最后价 {result.lastPrice.toFixed(2)} 元；
          {result.unfilled ? '已成交部分' : '本单'}成交量加权平均价 {result.vwap.toFixed(3)} 元；未成交 {result.unfilled.toLocaleString()} 股。
        </p>
      </div>

      <div className="lab-definitions">
        <p><b>VWAP</b> = 本单总成交金额 ÷ 已成交股数，它回答整笔订单平均付了多少钱。</p>
        <p><b>1 bp</b> = 0.01%。100 bp 等于 1 个百分点。</p>
      </div>

      <p className="lab-takeaway">
        上一笔恰好在 bid 成交、下一笔在 ask 成交，即使 mid-quote 没变，last price 也会向上跳；这叫 bid–ask bounce，
        不能直接解释为公共估值上升。订单继续消耗高于初始 ask 的档位时，才出现本实验所说的“向上扫档”。
        两种变化都不能仅凭一次成交被认定为永久信息冲击。
      </p>
    </section>
  );
}
