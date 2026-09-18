'use client';

import { useState } from 'react';
import { housingLabs, type HousingLabId } from './housingLabDefinitions';
import styles from './housingCollateral.module.css';

export default function HousingMechanismLab({ labId }: { labId: HousingLabId }) {
  const lab = housingLabs.find(({ id }) => id === labId);
  if (!lab) throw new Error(`Unknown housing lab ${labId}`);
  return <ActiveLab labId={labId} />;
}

function ActiveLab({ labId }: { labId: HousingLabId }) {
  const lab = housingLabs.find(({ id }) => id === labId)!;
  const [values, setValues] = useState<Readonly<Record<string, number>>>(lab.initial);
  const outputs = lab.outputs(values);
  return <div className={`${styles.dynamic} housing-interactive-only`} data-housing-lab={labId}>
    <div className={styles.controls} role="group" aria-label={`${labId}交互参数`}>
      {lab.fields.map((field) => <label key={field.key} htmlFor={`housing-${labId}-${field.key}`}><span>{field.label}</span><input type="number" id={`housing-${labId}-${field.key}`} value={Number.isNaN(values[field.key]) ? '' : values[field.key]} min={field.min} max={field.max} step={field.step} onChange={(event) => setValues((previous) => ({ ...previous, [field.key]: event.target.valueAsNumber }))} /></label>)}
    </div>
    <button className={styles.reset} onClick={() => setValues(lab.initial)} type="button">恢复{labId}固定基准</button>
    <div aria-live="polite" aria-atomic="true" className={styles.results}>
      {outputs ? <dl>{outputs.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : <p role="status">STOP：输入为空、非有限数、分母／期数无效，或容量→批准→提款顺序不成立。不能用0替代缺失结果；请核对参数并恢复基准。</p>}
    </div>
  </div>;
}
