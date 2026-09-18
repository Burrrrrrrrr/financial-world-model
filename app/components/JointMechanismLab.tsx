'use client';
import {useState} from 'react';
import {jointLabs} from './jointLabDefinitions';
import type {JointLabId} from './jointLabDefinitions';
import styles from './jointPolicy.module.css';
export default function JointMechanismLab({labId}:{labId:JointLabId}){const lab=jointLabs.find(l=>l.id===labId);if(!lab)throw new Error(`Unknown joint lab ${labId}`);return <ActiveJointLab key={labId} labId={labId}/>;}
function ActiveJointLab({labId}:{labId:JointLabId}){
 const lab=jointLabs.find(l=>l.id===labId)!;
 const [values,setValues]=useState<Readonly<Record<string,number>>>(lab.initial);
 const result=lab.display(values);
 return <div className={`${styles.dynamic} joint-interactive-only`} data-joint-lab={labId}>
  <div className={styles.controls} role="group" aria-label={`${labId}联合政策交互参数`}>{lab.fields.map(f=><label key={f.key} htmlFor={`joint-${labId}-${f.key}`}><span>{f.label}</span><input id={`joint-${labId}-${f.key}`} type="number" min={f.min} max={f.max} step={f.step} value={Number.isNaN(values[f.key])?'':values[f.key]} onChange={e=>setValues(prev=>({...prev,[f.key]:e.target.valueAsNumber}))}/></label>)}</div>
  <button type="button" className={styles.reset} onClick={()=>setValues(lab.initial)}>恢复{labId}固定基准</button>
  <div className={styles.results} aria-live="polite" aria-atomic="true">{result.status==='OK'?<dl>{result.rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>:<p role="status">STOP：输入缺失／非有限数，超出本实验金额、率或概率网格，或出现根／数值边界与本展示之外的状态。未得到结果，不是经济结果0；请检查护照或恢复基准。诊断：<code>{result.reason}</code></p>}</div>
 </div>;
}
