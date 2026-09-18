'use client';

import { useEffect, useRef, useState } from 'react';
import {
  globalBanksLabs,
  type GlobalBanksField,
  type GlobalBanksInput,
  type GlobalBanksLab,
  type GlobalBanksLabId,
  type GlobalBanksResult,
} from './globalBanksLabs';
import styles from './globalBanks.module.css';

function labFor(id: GlobalBanksLabId): GlobalBanksLab {
  const lab = globalBanksLabs.find(candidate => candidate.id === id);
  if (!lab) throw new Error(`Unknown 4.06 lab ${id}`);
  return lab;
}

function initialRaw(lab: GlobalBanksLab): Readonly<Record<string, string>> {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key] ?? '')]));
}

function parseField(field: GlobalBanksField, raw: string): { value: unknown; invalid: boolean } {
  if (field.kind === 'number') {
    if (!/^(?:0|[1-9]\d*)$/.test(raw)) return { value: raw, invalid: true };
    const value = Number(raw);
    return {
      value,
      invalid: !Number.isSafeInteger(value) || value < field.min || value > field.max || (value - field.min) % field.step !== 0,
    };
  }
  if (field.kind === 'select') {
    return { value: raw, invalid: !field.options.some(option => option.value === raw) };
  }
  if (field.kind === 'text') {
    return { value: raw, invalid: !/^[A-Z0-9][A-Z0-9._:-]*$/.test(raw) };
  }
  const milliseconds = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(raw) ? Date.parse(raw) : Number.NaN;
  const canonical = Number.isFinite(milliseconds) && new Date(milliseconds).toISOString().slice(0, 16) + 'Z' === raw;
  return { value: raw, invalid: !canonical };
}

function displayValue(value: unknown, field: GlobalBanksField): string {
  if (typeof value === 'number') return `${String(value).replace('-', '−')}${field.kind === 'number' ? ` ${field.unit}` : ''}`;
  return String(value ?? 'null');
}

function FixedChart({ lab, values }: { lab: GlobalBanksLab; values: readonly number[] }) {
  const maxAbs = Math.max(1, ...values.map(value => Math.abs(value)));
  return <figure className={styles.chart} aria-label={`${lab.id}固定默认图：${lab.chartTitle}`}>
    <figcaption><b>{lab.chartTitle}</b><span>零轴居中；柱长只在当前独立SYN中比较，不代表现实规模。</span></figcaption>
    {values.map((value, index) => {
      const width = Math.max(value === 0 ? 0 : 1.5, Math.abs(value) / maxAbs * 49);
      const position = value < 0 ? { right: '50%', width: `${width}%` } : { left: '50%', width: `${width}%` };
      return <div className={styles.chartRow} key={`${lab.id}-${lab.chartLabels[index] ?? index}`}>
        <span>{lab.chartLabels[index] ?? `Value ${index + 1}`}</span>
        <div className={styles.track} aria-hidden="true"><i className={value < 0 ? styles.negative : undefined} style={position} /></div>
        <b>{String(value).replace('-', '−')}</b>
      </div>;
    })}
  </figure>;
}

function ResultView({ lab, result }: { lab: GlobalBanksLab; result: GlobalBanksResult }) {
  if (result.status === 'STOP') {
    return <p className={styles.stop}><b>STOP · 当前没有数值结果：</b>{result.reason} STOP不是经济零、无风险或“没有传导”。</p>;
  }
  return <>
    <p className={result.status === 'ACCOUNTING_ONLY' ? styles.accounting : undefined}>
      <b>{result.status === 'ACCOUNTING_ONLY' ? 'ACCOUNTING_ONLY · ' : '当前SYN结果：'}</b>{result.note}
      {result.status === 'ACCOUNTING_ONLY' ? ' 这只是会计桥，需求状态与因果仍未识别。' : ' 结果只属于当前定义实验。'}
    </p>
    <dl aria-label={`${lab.id}当前结果`}>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <FixedChart lab={lab} values={result.chart} />
  </>;
}

function FixedRecord({ lab }: { lab: GlobalBanksLab }) {
  const result = lab.calculate(lab.initial);
  if (result.status === 'STOP') throw new Error(`${lab.id} default must resolve`);
  return <div className={styles.fixedRecord}>
    <h4 className={styles.recordHeading}>{lab.id}固定默认记录 · {lab.fixtureId}</h4>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>本记录不随控件变化。六个C没有共同银行、借款人、头寸、日期或因果身份，也不会互相读取结果。</p>
    <p><b>完整固定输入：</b></p>
    <dl className={styles.inputRecord}>{lab.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{displayValue(lab.initial[field.key], field)}</dd></div>)}</dl>
    <p><b>完整固定结果：</b></p>
    <dl className={styles.recordValues}>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <FixedChart lab={lab} values={result.chart} />
    <p><b>默认手算：</b>{lab.defaultRebuild}</p>
    <div className={styles.recordTail}>
      <p><b>必要关系：</b>{lab.formula.join('；')}。</p>
      <p><b>0与null边界：</b>{lab.zeroOrNull}</p>
      <p><b>反例：</b>{lab.counterexample}</p>
      <p><b>证据上限：</b>{lab.evidenceCeiling}</p>
      <p><b>不可破坏的不变量：</b>{lab.invariants.join('；')}。</p>
      <p><b>预注册边界案例：</b>{lab.cases.map(testCase => `${testCase.id} ${testCase.label} → ${testCase.expectedStatus}（${testCase.expected}）`).join('；')}</p>
      <p className={styles.sourceLine}>机制依据：{lab.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}。来源约束定义与证据边界，不提供SYN参数。</p>
    </div>
  </div>;
}

export default function GlobalBanksLab({ labId }: { labId: GlobalBanksLabId }) {
  return <ActiveLab key={labId} labId={labId} />;
}

function ActiveLab({ labId }: { labId: GlobalBanksLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  const [revision, setRevision] = useState(0);
  const staticRecordRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    document.documentElement.classList.add('global-banks-js');
    if (staticRecordRef.current) staticRecordRef.current.open = false;
    return () => document.documentElement.classList.remove('global-banks-js');
  }, []);

  const parsed = lab.fields.map(field => ({ field, ...parseField(field, raw[field.key] ?? '') }));
  const invalid = parsed.filter(item => item.invalid);
  const input: GlobalBanksInput = Object.fromEntries(parsed.map(item => [item.field.key, item.value]));
  const result: GlobalBanksResult = invalid.length
    ? { status: 'STOP', code: `${labId}_CLIENT_FIELD_INVALID`, reason: `以下字段不在声明域：${invalid.map(item => item.field.label).join('；')}。` }
    : lab.calculate(input);
  const instructionsId = `global-banks-${labId}-instructions`;

  return <aside className={styles.lab} id={`global-banks-lab-${labId}`} aria-labelledby={`global-banks-lab-${labId}-title`}>
    <div className={styles.labLead}>
      <span className="section-kicker">{labId} · INDEPENDENT AUTHOR-SYN / STATIC TWIN</span>
      <h3 id={`global-banks-lab-${labId}-title`}>{lab.title}</h3>
      <p>{lab.question}</p>
      <p className={styles.passport}><b>实验护照：</b>{lab.passport}</p>
    </div>
    <div className={`${styles.dynamic} global-banks-interactive-only`}>
      <p className={styles.instructions} id={instructionsId}><b>编辑当前独立SYN：</b>非法枚举、非安全整数、错误ID／UTC时间或跨字段冲突会STOP并清除旧结果。锁定字段用于保留实验身份，不能在界面中改写。</p>
      <div className={styles.controls} role="group" aria-label={`${labId}独立全球银行实验输入`}>
        {parsed.map(({ field, invalid: fieldInvalid }) => {
          const id = `global-banks-${labId}-${field.key}`;
          const editable = field.editable !== false;
          if (field.kind === 'select') return <label htmlFor={id} key={field.key}><span>{field.label}</span><select id={id} value={raw[field.key] ?? ''} disabled={!editable} aria-invalid={fieldInvalid} aria-describedby={instructionsId} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(valueRevision => valueRevision + 1); }}>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><small>{field.help}{!editable ? ' · 实验身份已锁定。' : ''}</small></label>;
          return <label htmlFor={id} key={field.key}><span>{field.label}</span><input id={id} type={field.kind === 'number' ? 'number' : 'text'} inputMode={field.kind === 'number' ? 'numeric' : 'text'} min={field.kind === 'number' ? field.min : undefined} max={field.kind === 'number' ? field.max : undefined} step={field.kind === 'number' ? field.step : undefined} readOnly={!editable} value={raw[field.key] ?? ''} aria-invalid={fieldInvalid} aria-describedby={instructionsId} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(valueRevision => valueRevision + 1); }} /><small>{field.help}{!editable ? ' · 实验身份已锁定。' : ''}</small></label>;
        })}
      </div>
      <button className={styles.reset} type="button" onClick={() => { setRaw(initialRaw(lab)); setRevision(value => value + 1); }}>恢复{labId}固定默认</button>
      <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">{result.status === 'STOP' ? `${labId}状态${revision + 1}为STOP；旧结果已清除。` : `${labId}状态${revision + 1}已重算；证据状态为${result.status}。`}</p>
      <div className={styles.results}><ResultView lab={lab} result={result} /></div>
    </div>
    <details className={styles.static} open ref={staticRecordRef}>
      <summary>{labId}固定记录（正常屏幕默认折叠；无JavaScript仍完整展开）</summary>
      <FixedRecord lab={lab} />
    </details>
    <div className={styles.printRecord}><FixedRecord lab={lab} /></div>
  </aside>;
}
