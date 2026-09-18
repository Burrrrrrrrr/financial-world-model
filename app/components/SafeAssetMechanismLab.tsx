'use client';

import { useState } from 'react';
import { parseSafeAssetRawDecimal, parseSafeAssetRawInteger } from './safeAssetFixtures';
import type { SafeAssetLabId } from './safeAssetFixtures';
import { safeAssetLabs } from './safeAssetLabDefinitions';
import type { SafeAssetDisplay, SafeAssetLab } from './safeAssetLabDefinitions';
import SafeAssetLabChart from './SafeAssetLabChart';
import styles from './safeAsset.module.css';

function labFor(labId: SafeAssetLabId): SafeAssetLab {
  const lab = safeAssetLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`未知安全资产实验：${labId}`);
  return lab;
}

function initialRaw(lab: SafeAssetLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

function decimalPlaces(scale: number): number {
  const digits = Math.log10(scale);
  if (!Number.isInteger(digits) || digits < 0 || digits > 4) throw Error(`未支持的安全资产字段scale：${scale}`);
  return digits;
}

export default function SafeAssetMechanismLab({ labId }: { labId: SafeAssetLabId }) {
  return <ActiveSafeAssetLab key={labId} labId={labId} />;
}

function ActiveSafeAssetLab({ labId }: { labId: SafeAssetLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  const [revision, setRevision] = useState(0);

  const parsed = lab.fields.map(field => {
    if (field.kind === 'select') {
      const option = field.options.find(candidate => candidate.value === (raw[field.key] ?? ''));
      return { field, value: option?.value ?? null, invalid: !option };
    }
    const value = field.kind === 'integer'
      ? parseSafeAssetRawInteger(raw[field.key] ?? '')
      : parseSafeAssetRawDecimal(raw[field.key] ?? '', decimalPlaces(field.scale));
    const scaled = value === null ? null : Math.round(value * field.scale);
    const stepScaled = Math.round(field.step * field.scale);
    const minScaled = Math.round(field.min * field.scale);
    const stepInvalid = scaled === null || (scaled - minScaled) % stepScaled !== 0;
    return { field, value, invalid: value === null || value < field.min || value > field.max || stepInvalid };
  });
  const invalid = parsed.filter(item => item.invalid);
  const input = Object.fromEntries(parsed.map(({ field, value }) => [field.key, value]));
  const result: SafeAssetDisplay = invalid.length > 0
    ? { status: 'STOP', reason: `以下字段尚不是声明域中的完整值：${invalid.map(({ field }) => field.label).join('；')}。` }
    : lab.display(input);
  const instructionsId = `safe-asset-${labId}-instructions`;

  return (
    <div className={`${styles.dynamic} safe-asset-interactive-only`} data-safe-asset-lab={labId}>
      <p id={instructionsId} className={styles.instructions}>
        <b>编辑当前独立SYN条件：</b>整数与小数字段只接受声明范围、精度和步长内的完整值；枚举只接受列出的用途、状态或匹配标签。
        空白、指数写法、负零、越界、额外小数、未知枚举或跨字段非法状态都会STOP并清除旧结果，不补0、不钳值、不把unknown改成0。
      </p>
      <div className={styles.controls} role="group" aria-label={`${labId}当前独立安全资产实验输入`}>
        {parsed.map(({ field, invalid: isInvalid }) => {
          const inputId = `safe-asset-${labId}-${field.key}`;
          const rangeId = `${inputId}-range`;
          if (field.kind === 'select') {
            return <label key={field.key} htmlFor={inputId}>
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
                  setRevision(previous => previous + 1);
                }}
              >
                {field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
              </select>
              <small id={rangeId}>严格枚举；该选择只属于{labId}，不得替另一个实验赋予共同主体或时钟。</small>
            </label>;
          }
          return <label key={field.key} htmlFor={inputId}>
            <span>{field.label}</span>
            <input
              id={inputId}
              name={inputId}
              type="number"
              inputMode={field.kind === 'integer' ? 'numeric' : 'decimal'}
              min={field.min}
              max={field.max}
              step={field.step}
              value={raw[field.key] ?? ''}
              aria-invalid={isInvalid}
              aria-describedby={`${rangeId} ${instructionsId}`}
              onChange={event => {
                const text = event.currentTarget.value;
                setRaw(previous => ({ ...previous, [field.key]: text }));
                setRevision(previous => previous + 1);
              }}
            />
            <small id={rangeId}>范围{field.min}至{field.max}；步长{field.step}；最多{decimalPlaces(field.scale)}位小数。</small>
          </label>;
        })}
      </div>
      <button id={`safe-asset-${labId}-reset`} type="button" className={styles.reset} onClick={() => {
        setRaw(() => initialRaw(lab));
        setRevision(previous => previous + 1);
      }}>
        清除无效输入并恢复{labId}固定默认
      </button>
      <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">
        {result.status === 'OK'
          ? `${labId}结果已更新（第${revision + 1}次状态）；完整结果与图形在后方。`
          : `${labId}第${revision + 1}次状态为STOP：${result.reason}旧结果已清除。`}
      </p>
      <div className={styles.results}>
        {result.status === 'OK' ? <>
          <p><b>当前条件结果：</b>只属于这一组作者SYN输入；不估计现实主权安全性、市场报价、债务阈值、最优发行、储备配置或政策福利。</p>
          <dl aria-label={`${labId}当前安全资产实验结果`}>
            {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
          </dl>
          <SafeAssetLabChart labId={labId} input={input} />
        </> : <p className={styles.stop}>
          <b>STOP · 当前未得到结果：</b>{result.reason} 旧结果已清除；STOP不是经济零、没有网络或现实状态不变。请按字段范围与实验护照修正，或恢复固定默认。
        </p>}
      </div>
    </div>
  );
}
