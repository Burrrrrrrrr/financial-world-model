'use client';

import { useEffect, useState } from 'react';
import { dollarFundingFieldIsActive, dollarFundingLabs, type DollarFundingInput, type DollarFundingLab, type DollarFundingLabId, type DollarFundingResult } from './dollarFundingLabs';
import styles from './dollarFunding.module.css';

function labFor(id: DollarFundingLabId): DollarFundingLab {
  const lab = dollarFundingLabs.find(candidate => candidate.id === id);
  if (!lab) throw new Error(`Unknown 4.05 lab ${id}`);
  return lab;
}

function initialRaw(lab: DollarFundingLab) {
  return Object.fromEntries(lab.fields.map(field => [field.key, String(lab.initial[field.key])]));
}

function parseStrictNumber(raw: string): number | null {
  if (!/^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(raw)) return null;
  const value = Number(raw);
  return Number.isFinite(value) && !Object.is(value, -0) ? value : Object.is(value, -0) ? 0 : null;
}

function parseStrictTimestamp(raw: string): string | null {
  if (!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}Z$/.test(raw)) return null;
  const milliseconds = Date.parse(raw);
  if (!Number.isFinite(milliseconds)) return null;
  return new Date(milliseconds).toISOString().slice(0, 16) + 'Z' === raw ? raw : null;
}

function decimalPlaces(step: number) {
  const text = String(step);
  return text.includes('.') ? text.split('.')[1].length : 0;
}

function scalar(value: number | string) {
  if (typeof value === 'number') return String(value).replace('-', '−');
  return value;
}

function FixedChart({ lab, values }: { lab: DollarFundingLab; values: readonly (number | null)[] }) {
  const finite = values.filter((value): value is number => value !== null && Number.isFinite(value));
  const maxAbs = Math.max(1, ...finite.map(value => Math.abs(value)));
  return <figure className={styles.chart} aria-label={`${lab.id}固定默认图：${lab.chartTitle}`}>
    <figcaption><b>{lab.chartTitle}</b><span>零轴居中；长度只在当前SYN内部比较。Null不画数值柱，0也不等于unknown。</span></figcaption>
    {values.map((value, index) => {
      const label = lab.chartLabels[index] ?? `Value ${index + 1}`;
      const width = value === null ? 0 : Math.max(value === 0 ? 0 : 1.5, Math.abs(value) / maxAbs * 49);
      const position = value !== null && value < 0 ? { right: '50%', width: `${width}%` } : { left: '50%', width: `${width}%` };
      return <div className={styles.chartRow} key={`${lab.id}-${label}`}><span>{label}</span><div className={styles.track} aria-hidden="true">{value !== null ? <i className={value < 0 ? styles.negative : undefined} style={position} /> : null}</div><b>{value === null ? 'null · 未识别' : String(Number(value.toPrecision(6))).replace('-', '−')}</b></div>;
    })}
  </figure>;
}

function ResultView({ lab, result }: { lab: DollarFundingLab; result: DollarFundingResult }) {
  if (result.status === 'STOP') return <p className={styles.stop}><b>STOP · 当前没有数值结果：</b>{result.reason} STOP不是经济零、稳定或“没有风险”。</p>;
  return <>
    <p><b>当前SYN结果：</b>{result.note} 结果不认证现实主体、实时市场、point-in-time（PIT）、因果、预测、收益或生产状态。</p>
    <dl aria-label={`${lab.id}当前结果`}>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <FixedChart lab={lab} values={result.chart} />
  </>;
}

function FixedRecord({ lab }: { lab: DollarFundingLab }) {
  const result = lab.calculate(lab.initial);
  if (result.status !== 'OK') throw new Error(`${lab.id} default must be OK`);
  const activeFields = lab.fields.filter(field => dollarFundingFieldIsActive(field, lab.initial));
  return <div className={styles.fixedRecord}>
    <h4 className={styles.recordHeading}>{lab.id}固定默认记录 · DEFAULT SYN</h4>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>本记录不随页面控件变化；六个C没有共同实体、账户、交易、日期、抵押品或状态，也不会互相读取结果。</p>
    <p><b>完整固定输入：</b></p>
    <dl className={styles.inputRecord}>{activeFields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{scalar(lab.initial[field.key])}{field.kind === 'number' ? ` ${field.unit}` : field.kind === 'timestamp' ? ' · UTC ISO minute' : ''}</dd></div>)}</dl>
    <p><b>完整固定结果：</b></p>
    <dl className={styles.recordValues}>{result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>
    <FixedChart lab={lab} values={result.chart} />
    <p><b>默认手算：</b>{lab.defaultRebuild}</p>
    <div className={styles.recordTail}>
      <p><b>必要关系：</b>{lab.formula.join('；')}。</p>
      <p><b>只改一个条件：</b>{lab.changeCondition}</p>
      <p><b>极端输入：</b>{lab.extremes.join('；')}。</p>
      <p><b>常见误解：</b>{lab.misconception}</p>
      <p><b>反例：</b>{lab.counterexample}</p>
      <p><b>仍缺证据：</b>{lab.unknownWarning}</p>
      <p><b>不可破坏的不变量：</b>{lab.invariants.join('；')}。</p>
      <p className={styles.sourceLine}>机制依据：{lab.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}。来源只约束机制和定义，不提供本实验参数。</p>
    </div>
  </div>;
}

export default function DollarFundingLab({ labId }: { labId: DollarFundingLabId }) {
  return <ActiveLab key={labId} labId={labId} />;
}

function ActiveLab({ labId }: { labId: DollarFundingLabId }) {
  const lab = labFor(labId);
  const [raw, setRaw] = useState<Readonly<Record<string, string>>>(() => initialRaw(lab));
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    document.documentElement.classList.add('dollar-funding-js');
    return () => document.documentElement.classList.remove('dollar-funding-js');
  }, []);

  const activeFields = lab.fields.filter(field => dollarFundingFieldIsActive(field, raw));
  const parsed = activeFields.map(field => {
    const value = raw[field.key] ?? '';
    if (field.kind === 'select') {
      const valid = field.options.some(option => option.value === value);
      return { field, value: valid ? value : null, invalid: !valid };
    }
    if (field.kind === 'timestamp') {
      const timestamp = parseStrictTimestamp(value);
      const milliseconds = timestamp === null ? null : Date.parse(timestamp);
      const belowMinimum = timestamp !== null && milliseconds !== null && field.min !== undefined && milliseconds < Date.parse(field.min);
      const aboveMaximum = timestamp !== null && milliseconds !== null && field.max !== undefined && milliseconds > Date.parse(field.max);
      const invalid = timestamp === null || milliseconds === null || belowMinimum || aboveMaximum;
      return { field, value: timestamp, invalid };
    }
    const number = parseStrictNumber(value);
    const precision = decimalPlaces(field.step);
    const scaled = number === null ? null : Math.round(number * 10 ** precision);
    const minScaled = Math.round(field.min * 10 ** precision);
    const stepScaled = Math.round(field.step * 10 ** precision);
    const invalid = number === null || number < field.min || number > field.max || scaled === null || (scaled - minScaled) % stepScaled !== 0 || (value.split('.')[1]?.length ?? 0) > precision;
    return { field, value: number, invalid };
  });
  const invalid = parsed.filter(item => item.invalid);
  const input: DollarFundingInput = Object.fromEntries(parsed.map(item => [item.field.key, item.value ?? '']));
  const result: DollarFundingResult = invalid.length ? { status: 'STOP', reason: `以下字段不在声明域：${invalid.map(item => item.field.label).join('；')}。` } : lab.calculate(input);
  const instructionsId = `dollar-funding-${labId}-instructions`;

  return <aside className={styles.lab} id={`dollar-funding-lab-${labId}`} aria-labelledby={`dollar-funding-lab-${labId}-title`}>
    <div className={styles.labLead}>
      <span className="section-kicker">{labId} · INDEPENDENT SYN / STATIC TWIN</span>
      <h3 id={`dollar-funding-lab-${labId}-title`}>{lab.title}</h3>
      <p>{lab.question}</p>
      <p className={styles.passport}><b>实验护照：</b>{lab.passport}</p>
    </div>
    <div className={`${styles.dynamic} dollar-funding-interactive-only`}>
      <p className={styles.instructions} id={instructionsId}><b>编辑当前独立SYN：</b>空白、非法枚举、越界、额外小数或跨字段冲突会STOP并清除旧结果。Unknown永远不补0，当前控件不会改变其他C。</p>
      <div className={styles.controls} role="group" aria-label={`${labId}独立美元融资实验输入`}>
        {parsed.map(({ field, invalid: fieldInvalid }) => {
          const id = `dollar-funding-${labId}-${field.key}`;
          if (field.kind === 'select') return <label htmlFor={id} key={field.key}><span>{field.label}</span><select id={id} value={raw[field.key] ?? ''} aria-invalid={fieldInvalid} aria-describedby={instructionsId} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(valueRevision => valueRevision + 1); }}>{field.options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}</select><small>严格枚举；Unknown与No含义不同。</small></label>;
          if (field.kind === 'timestamp') return <label htmlFor={id} key={field.key}><span>{field.label}</span><input id={id} type="text" inputMode="text" spellCheck={false} autoCapitalize="none" autoCorrect="off" value={raw[field.key] ?? ''} aria-invalid={fieldInvalid} aria-describedby={instructionsId} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(valueRevision => valueRevision + 1); }} /><small>{field.min ? `不早于${field.min}；` : ''}{field.max ? `不晚于${field.max}；` : ''}格式YYYY-MM-DDTHH:mmZ。</small></label>;
          return <label htmlFor={id} key={field.key}><span>{field.label}</span><input id={id} type="number" inputMode="decimal" min={field.min} max={field.max} step={field.step} value={raw[field.key] ?? ''} aria-invalid={fieldInvalid} aria-describedby={instructionsId} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [field.key]: value })); setRevision(valueRevision => valueRevision + 1); }} /><small>{field.min}–{field.max} {field.unit}；步长{field.step}。</small></label>;
        })}
      </div>
      <button className={styles.reset} type="button" onClick={() => { setRaw(initialRaw(lab)); setRevision(value => value + 1); }}>恢复{labId}固定默认</button>
      <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">{result.status === 'OK' ? `${labId}状态${revision + 1}已重算；结果只属于当前SYN。` : `${labId}状态${revision + 1}为STOP；旧结果已清除。`}</p>
      <div className={styles.results}><ResultView lab={lab} result={result} /></div>
    </div>
    <details className={styles.static} open>
      <summary>{labId}固定输入、结果、手算、反例与来源（无需JavaScript）</summary>
      <FixedRecord lab={lab} />
    </details>
    <div className={styles.printRecord}><FixedRecord lab={lab} /></div>
  </aside>;
}
