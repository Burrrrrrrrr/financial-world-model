'use client';
import { useState } from 'react';
import { fiscalC6FromControls, fiscalLabs } from './fiscalLabDefinitions';
import type { FiscalLabId } from '../lessons/fiscalPolicyConcepts';
import FiscalPathChart from './FiscalPathChart';
import styles from './fiscalPolicy.module.css';
export default function FiscalMechanismLab({labId}:{labId:FiscalLabId}) {
 const lab=fiscalLabs.find(({id})=>id===labId);
 if(!lab)throw new Error(`Unknown fiscal lab ${labId}`);
 return <ActiveFiscalLab key={labId} labId={labId}/>;
}
function ActiveFiscalLab({labId}:{labId:FiscalLabId}) {
 const lab=fiscalLabs.find(({id})=>id===labId)!;
 const [values,setValues]=useState<Readonly<Record<string,number>>>(lab.initial);
 const outputs=lab.outputs(values);
 const path=labId==='C6'&&outputs?fiscalC6FromControls(values):null;
 return <div className={`${styles.dynamic} fiscal-interactive-only`} data-fiscal-lab={labId}>
  <div className={styles.controls} role="group" aria-label={`${labId}交互参数`}>{lab.fields.map(field=><label key={field.key} htmlFor={`fiscal-${labId}-${field.key}`}><span>{field.label}</span><input type="number" id={`fiscal-${labId}-${field.key}`} min={field.min} max={field.max} step={field.step} value={Number.isNaN(values[field.key])?'':values[field.key]} onChange={event=>setValues(previous=>({...previous,[field.key]:event.target.valueAsNumber}))}/></label>)}</div>
  <button className={styles.reset} type="button" onClick={()=>setValues(lab.initial)}>恢复{labId}固定基准</button>
  <div className={styles.results} aria-live="polite" aria-atomic="true">{outputs?<dl>{outputs.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>:<p role="status">STOP：输入为空或非有限数、现金用途超预算、反馈超本模型范围、窗口／期数无效，或基线已含同一政策效应。不能用0替代缺失结果；请检查并恢复基准。</p>}</div>
  {path?<FiscalPathChart baseline={[100,102,104,106]} withPolicy={path.withPolicyLevels}/>:null}
 </div>;
}
