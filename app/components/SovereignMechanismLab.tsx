'use client';
import {useState} from 'react';
import {sovereignLabs} from './sovereignLabDefinitions';
import type {SovereignLabId} from './sovereignLabDefinitions';
import styles from './sovereignDebt.module.css';
export default function SovereignMechanismLab({labId}:{labId:SovereignLabId}){return <ActiveSovereignLab key={labId} labId={labId}/>;}
function ActiveSovereignLab({labId}:{labId:SovereignLabId}){
 const lab=sovereignLabs.find(l=>l.id===labId);if(!lab)throw Error(`Unknown sovereign lab ${labId}`);
 const [values,setValues]=useState<Readonly<Record<string,number>>>(lab.initial);
 const result=lab.display(values);
 return <div className={`${styles.dynamic} sovereign-interactive-only`} data-sovereign-lab={labId}>
  <div className={styles.controls} role="group" aria-label={`${labId}主权债务独立情景参数`}>{lab.fields.map(f=><label key={f.key} htmlFor={`sovereign-${labId}-${f.key}`}><span>{f.label}</span><input id={`sovereign-${labId}-${f.key}`} type="number" min={f.min} max={f.max} step={f.step} value={Number.isNaN(values[f.key])?'':values[f.key]} onChange={e=>setValues(prev=>({...prev,[f.key]:e.target.valueAsNumber}))}/></label>)}</div>
  <button type="button" className={styles.reset} onClick={()=>setValues(lab.initial)}>恢复{labId}固定基准</button>
  <div className={styles.results} aria-live="polite" aria-atomic="true">{result.status==='OK'?<dl>{result.rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>:<p role="status">STOP：本实验未得到结果，旧结果已清除；不是经济结果0、违约或不可持续判定。请检查独立护照或恢复基准。诊断：<code>{result.reason}</code></p>}</div>
 </div>;
}
