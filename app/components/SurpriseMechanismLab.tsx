'use client';

import { useState } from 'react';
import { parseSurpriseRawInteger } from './surpriseFixtures';
import type { SurpriseLabId } from './surpriseFixtures';
import { surpriseLabs } from './surpriseLabDefinitions';
import type { SurpriseDisplay, SurpriseLab } from './surpriseLabDefinitions';
import styles from './surprise.module.css';

function labFor(labId: SurpriseLabId): SurpriseLab {
  const lab = surpriseLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error('Unknown surprise lab ' + labId);
  return lab;
}

function initialRaw(lab: SurpriseLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

export default function SurpriseMechanismLab({ labId }: { labId: SurpriseLabId }) {
  return <ActiveSurpriseLab key={labId} labId={labId} />;
}

function ActiveSurpriseLab({ labId }: { labId: SurpriseLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  // Only raw strings are state. Results are derived now, never restored from a stale snapshot.
  const parsed = lab.fields.map(field => ({ field, value: parseSurpriseRawInteger(raw[field.key] ?? '') }));
  const invalidRaw = parsed.filter(({ field, value }) => value === null || value < field.min || value > field.max);
  const input = Object.fromEntries(parsed.map(({ field, value }) => [field.key, value]));
  const result: SurpriseDisplay = invalidRaw.length > 0
    ? { status: 'STOP', reason: '以下字段尚不是声明范围内的完整安全整数：' + invalidRaw.map(({ field }) => field.label).join('；') + '。' }
    : lab.display(input);
  const instructionId = `surprise-${labId}-raw-instructions`;

  return (
    <div className={`${styles.dynamic} surprise-interactive-only`} data-surprise-lab={labId}>
      <p id={instructionId} className={styles.rawInstructions}>
        <b>编辑当前独立条件：</b>须输入范围内完整整数；有负值范围的字段允许负整数。
        空白、小数、指数写法、不完整字串和越界均停算并清除当前结果，不补0、不钳值、不恢复默认。
        原始整数合法后仍须满足上方护照的跨字段时序条件。
      </p>
      <div className={styles.controls} role="group" aria-label={`${labId}独立合成实验的当前输入`}>
        {parsed.map(({ field, value }) => {
          const inputId = `surprise-${labId}-${field.key}`;
          const rangeId = `${inputId}-range`;
          const invalid = value === null || value < field.min || value > field.max;
          return (
            <label key={field.key} htmlFor={inputId}>
              <span>{field.label}</span>
              <input
                id={inputId}
                type="number"
                inputMode="numeric"
                min={field.min}
                max={field.max}
                step={field.step}
                value={raw[field.key] ?? ''}
                aria-invalid={invalid}
                aria-describedby={`${rangeId} ${instructionId}`}
                onChange={event => {
                  const text = event.currentTarget.value;
                  setRaw(previous => ({ ...previous, [field.key]: text }));
                }}
              />
              <small id={rangeId}>安全整数范围：{field.min}至{field.max}；步长1。单位见字段名称。</small>
            </label>
          );
        })}
      </div>
      <button type="button" className={styles.reset} onClick={() => setRaw(() => initialRaw(lab))}>
        清除无效输入并恢复{labId}固定默认
      </button>
      <div className={styles.results} aria-live="polite" aria-atomic="true">
        {result.status === 'OK' ? (
          <>
            <p><b>当前输入的完整结果：</b>只来自此刻这一独立合成条件。未知不是0；事后比较不是截止前消息。</p>
            <dl aria-label={`${labId}当前输入结果`}>
              {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </>
        ) : (
          <p className={styles.stop}>
            <b>STOP · 当前未得到结果：</b>{result.reason}
            旧结果已清除；STOP不是经济零、无消息、真实市场意外或价格判断。
            请按字段范围和护照修正，或使用上方恢复默认按钮。
          </p>
        )}
      </div>
    </div>
  );
}
