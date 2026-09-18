'use client';

import { useState } from 'react';
import { parseMacroRawInteger } from './macroprudentialFixtures';
import type { MacroLabId } from './macroprudentialFixtures';
import { macroprudentialLabs } from './macroprudentialLabDefinitions';
import type { MacroprudentialDisplay, MacroprudentialLab } from './macroprudentialLabDefinitions';
import styles from './macroprudential.module.css';

function labFor(labId: MacroLabId): MacroprudentialLab {
  const lab = macroprudentialLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`未知宏观审慎实验：${labId}`);
  return lab;
}

function initialRaw(lab: MacroprudentialLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

export default function MacroprudentialMechanismLab({ labId }: { labId: MacroLabId }) {
  return <ActiveLab key={labId} labId={labId} />;
}

function ActiveLab({ labId }: { labId: MacroLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  const parsed = lab.fields.map(field => ({ field, value: parseMacroRawInteger(raw[field.key] ?? '') }));
  const invalid = parsed.filter(({ field, value }) => value === null || value < field.min || value > field.max);
  const input = Object.fromEntries(parsed.map(({ field, value }) => [field.key, value]));
  const result: MacroprudentialDisplay = invalid.length > 0
    ? { status: 'STOP', reason: `以下字段尚不是声明域内的完整安全整数：${invalid.map(({ field }) => field.label).join('；')}。` }
    : lab.display(input);
  const instructionsId = `macroprudential-${labId}-instructions`;

  return (
    <div className={`${styles.dynamic} macroprudential-interactive-only`} data-macroprudential-lab={labId}>
      <p id={instructionsId} className={styles.instructions}>
        <b>编辑当前独立SYN条件：</b>只接受字段范围内完整整数。空白、小数、指数写法、越界、getter或跨字段非法状态都会STOP并清除旧结果；合法0、unknown和STOP绝不互换。
      </p>
      <div className={styles.controls} role="group" aria-label={`${labId}当前独立合成实验输入`}>
        {parsed.map(({ field, value }) => {
          const inputId = `macroprudential-${labId}-${field.key}`;
          const rangeId = `${inputId}-range`;
          const isInvalid = value === null || value < field.min || value > field.max;
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
                aria-invalid={isInvalid}
                aria-describedby={`${rangeId} ${instructionsId}`}
                onChange={event => {
                  const text = event.currentTarget.value;
                  setRaw(previous => ({ ...previous, [field.key]: text }));
                }}
              />
              <small id={rangeId}>安全整数范围：{field.min}至{field.max}；步长1。对象和单位见字段名称。</small>
            </label>
          );
        })}
      </div>
      <button type="button" className={styles.reset} onClick={() => setRaw(initialRaw(lab))}>
        清除无效输入并恢复{labId}固定默认
      </button>
      <div className={styles.results} aria-live="polite" aria-atomic="true">
        {result.status === 'OK' ? (
          <>
            <p><b>当前条件结果：</b>只属于这一组SYN输入；未观测对象仍显示unknown，不因算术闭合升级为现实政策效果。</p>
            <dl aria-label={`${labId}当前结果`}>
              {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
          </>
        ) : (
          <p className={styles.stop}><b>STOP · 当前未得到结果：</b>{result.reason} 旧结果已清除；STOP不是经济零、政策无效或现实无风险。</p>
        )}
      </div>
    </div>
  );
}
