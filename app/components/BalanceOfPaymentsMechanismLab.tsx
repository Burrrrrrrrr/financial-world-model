'use client';

import { useState } from 'react';
import { parseBopRawInteger } from './balanceOfPaymentsFixtures';
import type { BopLabId } from './balanceOfPaymentsFixtures';
import { balanceOfPaymentsLabs } from './balanceOfPaymentsLabDefinitions';
import type { BopDisplay, BopLab } from './balanceOfPaymentsLabDefinitions';
import styles from './balanceOfPayments.module.css';

function labFor(labId: BopLabId): BopLab {
  const lab = balanceOfPaymentsLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`未知国际收支实验：${labId}`);
  return lab;
}

function initialRaw(lab: BopLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

export default function BalanceOfPaymentsMechanismLab({ labId }: { labId: BopLabId }) {
  return <ActiveBalanceOfPaymentsLab key={labId} labId={labId} />;
}

function ActiveBalanceOfPaymentsLab({ labId }: { labId: BopLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));

  // Raw strings are the only stored state. Every result is derived from the current fields,
  // so invalid edits cannot leave a stale valid accounting record on screen.
  const parsed = lab.fields.map(field => ({ field, value: parseBopRawInteger(raw[field.key] ?? '') }));
  const invalid = parsed.filter(({ field, value }) => value === null || value < field.min || value > field.max);
  const input = Object.fromEntries(parsed.map(({ field, value }) => [field.key, value]));
  const result: BopDisplay = invalid.length > 0
    ? { status: 'STOP', reason: `以下字段尚不是声明域内的完整安全整数：${invalid.map(({ field }) => field.label).join('；')}。` }
    : lab.display(input);
  const instructionsId = `balance-of-payments-${labId}-instructions`;

  return (
    <div
      className={`${styles.dynamic} balance-of-payments-interactive-only`}
      data-balance-of-payments-lab={labId}
    >
      <p id={instructionsId} className={styles.instructions}>
        <b>编辑当前独立SYN条件：</b>只接受字段范围内完整整数；带符号字段允许负整数。
        空白、小数、指数写法、越界或跨字段非法状态都会STOP并清除旧结果，不补0、不钳值，也不把unknown改成0。
      </p>
      <div className={styles.controls} role="group" aria-label={`${labId}当前独立国际收支实验输入`}>
        {parsed.map(({ field, value }) => {
          const inputId = `balance-of-payments-${labId}-${field.key}`;
          const rangeId = `${inputId}-range`;
          const isInvalid = value === null || value < field.min || value > field.max;
          return (
            <label key={field.key} htmlFor={inputId}>
              <span>{field.label}</span>
              <input
                id={inputId}
                name={inputId}
                type="number"
                inputMode="numeric"
                min={field.min}
                max={field.max}
                step={field.step}
                value={raw[field.key] ?? ''}
                aria-invalid={isInvalid}
                aria-describedby={`${rangeId} ${instructionsId}`}
                onChange={event => {
                  const text = event.currentTarget.value;
                  setRaw(previous => ({ ...previous, [field.key]: text }));
                }}
              />
              <small id={rangeId}>安全整数范围：{field.min}至{field.max}；步长1。对象与单位见字段名称。</small>
            </label>
          );
        })}
      </div>
      <button
        id={`balance-of-payments-${labId}-reset`}
        type="button"
        className={styles.reset}
        onClick={() => setRaw(() => initialRaw(lab))}
      >
        清除无效输入并恢复{labId}固定默认
      </button>
      <div className={styles.results} aria-live="polite" aria-atomic="true">
        {result.status === 'OK' ? (
          <>
            <p><b>当前条件结果：</b>只属于此刻这一组SYN输入；账本闭合不识别真实原因、汇率方向、融资安全或政策效果。</p>
            <dl aria-label={`${labId}当前国际收支实验结果`}>
              {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </>
        ) : (
          <p className={styles.stop}>
            <b>STOP · 当前未得到结果：</b>{result.reason} 旧结果已清除；STOP不是经济零、没有跨境交易或现实账户平衡。
            请按字段范围与实验护照修正，或恢复固定默认。
          </p>
        )}
      </div>
    </div>
  );
}
