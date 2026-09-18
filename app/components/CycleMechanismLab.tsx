'use client';

import { useState } from 'react';
import { parseCycleRawInteger } from './cycleFixtures';
import type { CycleLabId } from './cycleFixtures';
import { cycleLabs } from './cycleLabDefinitions';
import type { CycleDisplay, CycleLab } from './cycleLabDefinitions';
import styles from './cycle.module.css';

function labFor(labId: CycleLabId): CycleLab {
  const lab = cycleLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error('Unknown cycle lab ' + labId);
  return lab;
}

function initialRaw(lab: CycleLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

export default function CycleMechanismLab({ labId }: { labId: CycleLabId }) {
  return <ActiveCycleLab key={labId} labId={labId} />;
}

function ActiveCycleLab({ labId }: { labId: CycleLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  // Raw strings remain the only state. Empty, fractional and incomplete strings never become 0/defaults.
  const parsed = lab.fields.map(field => ({ field, value: parseCycleRawInteger(raw[field.key] ?? '') }));
  const invalidRaw = parsed.filter(entry => entry.value === null);
  const input = Object.fromEntries(parsed.map(entry => [entry.field.key, entry.value]));
  const result: CycleDisplay = invalidRaw.length > 0
    ? { status: 'STOP', reason: '以下输入尚不是完整非负安全整数：' + invalidRaw.map(entry => entry.field.label).join('；') + '。' }
    : lab.display(input);
  const instructionId = `cycle-${labId}-raw-instructions`;

  return (
    <div className={`${styles.dynamic} cycle-interactive-only`} data-cycle-lab={labId}>
      <p id={instructionId} className={styles.rawInstructions}>
        <b>编辑当前条件：</b>每格须填写范围内完整整数。清空、小数、不完整字串或越界时停算并清除当前结果，
        不把缺失补为0，也不偷偷恢复默认；跨字段关系还须满足上方成立范围。
      </p>
      <div className={styles.controls} role="group" aria-label={`${labId}独立合成实验的当前输入`}>
        {parsed.map(({ field, value }) => {
          const inputId = `cycle-${labId}-${field.key}`;
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
              <small id={rangeId}>整数范围：{field.min}–{field.max}；步长1。</small>
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
            <p><b>当前输入的完整结果：</b>以下仅来自当前独立合成条件；未知项保持原义，不是0。</p>
            <dl aria-label={`${labId}当前输入结果`}>
              {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </>
        ) : (
          <p className={styles.stop}>
            <b>STOP · 当前未得到结果：</b>{result.reason}
            旧结果已清除。这不是经济结果0、正式衰退、法律违约或系统性危机判断。
            请按字段范围及本实验护照修正输入，或使用上方恢复默认按钮。
          </p>
        )}
      </div>
    </div>
  );
}
