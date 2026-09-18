'use client';

import { useState } from 'react';
import { parseImsRawInteger } from './internationalMonetaryFixtures';
import type { ImsLabId } from './internationalMonetaryFixtures';
import { internationalMonetaryLabs } from './internationalMonetaryLabDefinitions';
import type { ImsDisplay, ImsLab } from './internationalMonetaryLabDefinitions';
import InternationalMonetaryLabChart from './InternationalMonetaryLabChart';
import styles from './internationalMonetary.module.css';

function labFor(labId: ImsLabId): ImsLab {
  const lab = internationalMonetaryLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`未知国际货币实验：${labId}`);
  return lab;
}

function initialRaw(lab: ImsLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

export default function InternationalMonetaryMechanismLab({ labId }: { labId: ImsLabId }) {
  return <ActiveInternationalMonetaryLab key={labId} labId={labId} />;
}

function ActiveInternationalMonetaryLab({ labId }: { labId: ImsLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));

  // Raw strings are the sole state. A malformed edit therefore removes the previous
  // valid result instead of letting a stale number appear to describe the new inputs.
  const parsed = lab.fields.map(field => {
    if (field.kind === 'select') {
      const option = field.options.find(candidate => String(candidate.value) === (raw[field.key] ?? ''));
      return { field, value: option?.value ?? null, invalid: !option };
    }
    const value = parseImsRawInteger(raw[field.key] ?? '');
    return { field, value, invalid: value === null || value < field.min || value > field.max };
  });
  const invalid = parsed.filter(item => item.invalid);
  const input = Object.fromEntries(parsed.map(({ field, value }) => [field.key, value]));
  const result: ImsDisplay = invalid.length > 0
    ? { status: 'STOP', reason: `以下字段尚不是声明域中的完整值：${invalid.map(({ field }) => field.label).join('；')}。` }
    : lab.display(input);
  const instructionsId = `international-monetary-${labId}-instructions`;

  return (
    <div className={`${styles.dynamic} international-monetary-interactive-only`} data-international-monetary-lab={labId}>
      <p id={instructionsId} className={styles.instructions}>
        <b>编辑当前独立SYN条件：</b>数字字段只接受声明范围内的完整安全整数；币种字段只接受列出的虚构代码。
        空白、小数、指数写法、越界、未知代码或跨字段非法状态都会STOP并清除旧结果，不补0、不钳值，也不把unknown改成0。
      </p>
      <div className={styles.controls} role="group" aria-label={`${labId}当前独立国际货币实验输入`}>
        {parsed.map(({ field, invalid: isInvalid }) => {
          const inputId = `international-monetary-${labId}-${field.key}`;
          const rangeId = `${inputId}-range`;
          if (field.kind === 'select') {
            return (
              <label key={field.key} htmlFor={inputId}>
                <span>{field.label}</span>
                <select
                  id={inputId}
                  name={inputId}
                  value={raw[field.key] ?? ''}
                  aria-invalid={isInvalid}
                  aria-describedby={`${rangeId} ${instructionsId}`}
                  onChange={event => {
                    const text = event.currentTarget.value;
                    setRaw(previous => ({ ...previous, [field.key]: text }));
                  }}
                >
                  {field.options.map(option => <option key={String(option.value)} value={String(option.value)}>{option.label}</option>)}
                </select>
                <small id={rangeId}>严格枚举；代码只属于{labId}，不得与其他实验的同名字母连接。</small>
              </label>
            );
          }
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
      <button id={`international-monetary-${labId}-reset`} type="button" className={styles.reset} onClick={() => setRaw(() => initialRaw(lab))}>
        清除无效输入并恢复{labId}固定默认
      </button>
      <div className={styles.results} aria-live="polite" aria-atomic="true">
        {result.status === 'OK' ? (
          <>
            <p><b>当前条件结果：</b>只属于这一组SYN输入；它不估计真实货币份额、最优交易路线、储备操作、替代概率或政策福利。</p>
            <dl aria-label={`${labId}当前国际货币实验结果`}>
              {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <InternationalMonetaryLabChart labId={labId} input={input} />
          </>
        ) : (
          <p className={styles.stop}>
            <b>STOP · 当前未得到结果：</b>{result.reason} 旧结果已清除；STOP不是经济零、没有网络或现实份额不变。
            请按字段范围与实验护照修正，或恢复固定默认。
          </p>
        )}
      </div>
    </div>
  );
}
