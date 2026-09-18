'use client';

import { useEffect, useState } from 'react';
import { treasuryCurveLabs, type TreasuryCurveLab } from './treasuryCurveLabDefinitions';
import { parseTreasuryCurveDecimal, type TreasuryCurveLabId, type TreasuryCurveResult } from './treasuryCurveFixtures';
import TreasuryCurveLabChart from './TreasuryCurveLabChart';
import styles from './treasuryCurve.module.css';

function labFor(labId: TreasuryCurveLabId): TreasuryCurveLab {
  const lab = treasuryCurveLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`Unknown Treasury curve lab: ${labId}`);
  return lab;
}

function initialRaw(lab: TreasuryCurveLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

function decimalPlaces(scale: number): number {
  const digits = Math.log10(scale);
  if (!Number.isInteger(digits) || digits < 0 || digits > 3) throw Error(`Unsupported 4.04 field scale: ${scale}`);
  return digits;
}

export default function TreasuryCurveMechanismLab({ labId }: { labId: TreasuryCurveLabId }) {
  return <ActiveTreasuryCurveLab key={labId} labId={labId} />;
}

function ActiveTreasuryCurveLab({ labId }: { labId: TreasuryCurveLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('treasury-curve-js');
    return () => document.documentElement.classList.remove('treasury-curve-js');
  }, []);

  const parsed = lab.fields.map(field => {
    if (field.kind === 'select') {
      const option = field.options.find(candidate => candidate.value === (raw[field.key] ?? ''));
      return { field, value: option?.value ?? null, invalid: !option };
    }
    const value = parseTreasuryCurveDecimal(raw[field.key] ?? '', decimalPlaces(field.scale));
    const scaled = value === null ? null : Math.round(value * field.scale);
    const minScaled = Math.round(field.min * field.scale);
    const stepScaled = Math.round(field.step * field.scale);
    const invalid = value === null || value < field.min || value > field.max || scaled === null || (scaled - minScaled) % stepScaled !== 0;
    return { field, value, invalid };
  });
  const invalid = parsed.filter(item => item.invalid);
  const input = Object.fromEntries(parsed.map(({ field, value }) => [field.key, value]));
  const result: TreasuryCurveResult = invalid.length > 0
    ? { status: 'STOP', reason: `以下字段不在声明域：${invalid.map(item => item.field.label).join('；')}。` }
    : lab.display(input);
  const instructionsId = `treasury-curve-${labId}-instructions`;

  return <div className={`${styles.dynamic} treasury-curve-interactive-only`} data-treasury-curve-lab={labId}>
    <p className={styles.instructions} id={instructionsId}><b>编辑当前独立SYN：</b>每个C拥有独立fixture与state，不读取其他C。空白、空格、指数写法、加号、负零、越界、额外小数、非法枚举或跨字段非法状态都会STOP并清除旧结果；unknown永远不补0。</p>
    <div className={styles.controls} role="group" aria-label={`${labId} Treasury曲线独立实验输入`}>
      {parsed.map(({ field, invalid: isInvalid }) => {
        const inputId = `treasury-curve-${labId}-${field.key}`;
        const rangeId = `${inputId}-range`;
        if (field.kind === 'select') return <label htmlFor={inputId} key={field.key}>
          <span>{field.label}</span>
          <select id={inputId} name={inputId} value={raw[field.key] ?? ''} aria-invalid={isInvalid} aria-describedby={`${rangeId} ${instructionsId}`} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(previous => previous + 1); }}>
            {field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
          </select>
          <small id={rangeId}>严格枚举；选择只属于{labId}，不向其他实验传值。</small>
        </label>;
        return <label htmlFor={inputId} key={field.key}>
          <span>{field.label}</span>
          <input id={inputId} name={inputId} type="number" inputMode="decimal" min={field.min} max={field.max} step={field.step} value={raw[field.key] ?? ''} aria-invalid={isInvalid} aria-describedby={`${rangeId} ${instructionsId}`} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(previous => previous + 1); }} />
          <small id={rangeId}>范围{field.min}至{field.max} {field.unit}；步长{field.step}；最多{decimalPlaces(field.scale)}位小数。</small>
        </label>;
      })}
    </div>
    <button className={styles.reset} id={`treasury-curve-${labId}-reset`} type="button" onClick={() => { setRaw(initialRaw(lab)); setRevision(previous => previous + 1); }}>恢复{labId}独立固定默认</button>
    <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">
      {result.status === 'OK' ? `${labId}结果已更新（状态${revision + 1}）；结果仅属于当前SYN。` : `${labId}状态${revision + 1}为STOP：${result.reason}旧结果已清除。`}
    </p>
    <div className={styles.results}>
      {result.status === 'OK' ? <>
        <p><b>当前SYN结果：</b>{result.note} 不认证实时曲线、现实证券、PIT/OOS、因果、预测、收益或交易。</p>
        <dl aria-label={`${labId}当前Treasury曲线实验结果`}>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
        <TreasuryCurveLabChart labId={labId} values={result.chartValues ?? result.chart} />
      </> : <p className={styles.stop}><b>STOP · 当前没有结果：</b>{result.reason} STOP不是经济零、稳定或“无传导”。请修正字段或恢复默认。</p>}
    </div>
  </div>;
}
