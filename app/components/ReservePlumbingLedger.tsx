'use client';

import { useRef, useState } from 'react';
import { ledgerEntities, ledgerOperations } from './policyImplementationFixtures';

function signed(value: number) {
  if (value > 0) return `+${value}`;
  return String(value);
}

export default function ReservePlumbingLedger() {
  const [operationId, setOperationId] = useState(ledgerOperations[0].id);
  const [applied, setApplied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const operation = ledgerOperations.find((item) => item.id === operationId) ?? ledgerOperations[0];
  const allBalanced = ledgerEntities.every((entity) => {
    const entry = operation.entries[entity.id];
    return entry.assetDelta === entry.liabilityEquityDelta;
  });

  function choose(id: typeof operationId) {
    setOperationId(id);
    setApplied(false);
  }

  function applyStep() {
    setApplied(true);
    requestAnimationFrame(() => resultRef.current?.focus());
  }

  return (
    <section className="reserve-ledger" aria-labelledby="reserve-ledger-title">
      <div className="reserve-ledger-head">
        <div>
          <span>SYNTHETIC · DOUBLE-ENTRY LEDGER</span>
          <h3 id="reserve-ledger-title">五种操作看起来都在“动钱”，但只有逐户过账才能判断系统准备金与分布怎样改变</h3>
        </div>
        <p>每个案例独立从基线开始，金额均为十亿元本币。资产变动必须等于负债与净值变动；这里的合并外部部门只追踪资产迁移，不代替财政或家庭完整账户。</p>
      </div>

      <div className="reserve-ledger-picker" role="group" aria-label="选择一种过账操作">
        {ledgerOperations.map((item) => (
          <button aria-pressed={item.id === operation.id} className={item.id === operation.id ? 'active' : ''} key={item.id} onClick={() => choose(item.id)} type="button">
            <span>{item.label}</span><b>{item.title}</b>
          </button>
        ))}
      </div>

      <div className="reserve-ledger-trigger">
        <span>当前事件</span>
        <h4>{operation.title}</h4>
        <p>{operation.trigger}</p>
        <div>
          <button className="ledger-primary" disabled={applied} onClick={applyStep} type="button">{applied ? '本步已过账' : '逐步显示四类账本'}</button>
          <button className="ledger-secondary" disabled={!applied} onClick={() => setApplied(false)} type="button">重置本案例</button>
        </div>
      </div>

      {applied ? (
        <div className="reserve-ledger-result" ref={resultRef} role="region" tabIndex={-1} aria-label={`${operation.title} 过账结果`}>
          <div className="reserve-ledger-grid">
            {ledgerEntities.map((entity) => {
              const entry = operation.entries[entity.id];
              const balanced = entry.assetDelta === entry.liabilityEquityDelta;
              return (
                <article key={entity.id}>
                  <header><span>{entity.label}</span><small>{balanced ? 'BALANCED' : 'CHECK FAILED'}</small></header>
                  <p>{entity.role}</p>
                  <div><b>资产 Δ {signed(entry.assetDelta)}</b>{entry.assets.map((line) => <code key={line}>{line}</code>)}</div>
                  <div><b>负债与净值 Δ {signed(entry.liabilityEquityDelta)}</b>{entry.liabilitiesEquity.map((line) => <code key={line}>{line}</code>)}</div>
                </article>
              );
            })}
          </div>
          <div className={allBalanced ? 'reserve-ledger-audit passed' : 'reserve-ledger-audit'}>
            <span>{allBalanced ? '四类账本校验通过' : '账本校验失败'}</span>
            <p><b>系统准备金 Δ {signed(operation.systemReserveDelta)}</b> · {operation.distribution}</p>
            <p>{operation.causalBoundary}</p>
          </div>
        </div>
      ) : (
        <div className="reserve-ledger-placeholder" role="status"><span>尚未过账</span><p>先预测系统准备金方向，再按“逐步显示”核对四类账本。选择其他案例不会保留前一案例的结果。</p></div>
      )}

      <details className="reserve-ledger-static" open>
        <summary>纯文本五案例摘要（可收起；打印版保留）</summary>
        <ol>
          {ledgerOperations.map((item) => (
            <li key={item.id}><b>{item.title}</b><span>系统准备金 Δ {signed(item.systemReserveDelta)}；{item.distribution}</span><span>{item.causalBoundary}</span></li>
          ))}
        </ol>
      </details>
      <noscript><div className="precision-note"><span>无脚本替代</span><p>银行间付款：总量 0；政府支出：+30；缴税：−25；央行 repo：+40；家庭从银行存款取现：−15。正文 06–09 给出完整 T-account 与边界。</p></div></noscript>
    </section>
  );
}
