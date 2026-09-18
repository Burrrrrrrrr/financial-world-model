'use client';
import {useState} from 'react';
import {flowLabs} from './capitalFlowLabDefinitions';
import type {FlowLabId} from './capitalFlowLabDefinitions';
import styles from './capitalFlow.module.css';
export default function CapitalFlowMechanismLab({labId}:{labId:FlowLabId}){return <ActiveFlowLab key={labId} labId={labId}/>;}
function ActiveFlowLab({labId}:{labId:FlowLabId}){
 const lab=flowLabs.find(l=>l.id===labId);if(!lab)throw Error('Unknown capital-flow lab '+labId);
 const [values,setValues]=useState<Readonly<Record<string,number>>>(lab.initial);
 const result=lab.display(values);
 return <div className={`${styles.dynamic} capital-flow-interactive-only`} data-capital-flow-lab={labId}>
  <div className={styles.controls} role="group" aria-label={`${labId}独立资本流合同参数`}>{lab.fields.map(f=><label key={f.key} htmlFor={`capital-flow-${labId}-${f.key}`}><span>{f.label}</span><input id={`capital-flow-${labId}-${f.key}`} type="number" min={f.min} max={f.max} step={f.step} value={Number.isNaN(values[f.key])?'':values[f.key]} onChange={e=>{const next=e.currentTarget.valueAsNumber;setValues(prev=>({...prev,[f.key]:next}));}}/></label>)}</div>
  <button type="button" className={styles.reset} onClick={()=>setValues(lab.initial)}>恢复{labId}固定基准</button>
  <div className={styles.results} aria-live="polite" aria-atomic="true">{result.status==='OK'?<dl>{result.rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>:<p role="status">STOP：本次未得到结果，旧结果已清除；不是经济结果0、现金缺口0或法律违约判断。请核本实验护照或恢复基准。诊断：<code>{result.reason}</code></p>}</div>
 </div>;
}
