'use client';
import {useState} from 'react';
import {exchangeRateLabs} from './exchangeRateLabDefinitions';
import type {ExchangeRateLabId} from './exchangeRateLabDefinitions';
import styles from './exchangeRate.module.css';
export default function ExchangeRateMechanismLab({labId}:{labId:ExchangeRateLabId}){return <ActiveFxLab key={labId} labId={labId}/>;}
function ActiveFxLab({labId}:{labId:ExchangeRateLabId}){
 const lab=exchangeRateLabs.find(l=>l.id===labId);if(!lab)throw Error(`Unknown FX lab ${labId}`);
 const [values,setValues]=useState<Readonly<Record<string,number>>>(lab.initial);
 const result=lab.display(values);
 return <div className={`${styles.dynamic} exchange-rate-interactive-only`} data-exchange-rate-lab={labId}>
  <div className={styles.controls} role="group" aria-label={`${labId}独立汇率合同参数`}>{lab.fields.map(f=><label key={f.key} htmlFor={`exchange-rate-${labId}-${f.key}`}><span>{f.label}</span><input id={`exchange-rate-${labId}-${f.key}`} type="number" min={f.min} max={f.max} step={f.step} value={Number.isNaN(values[f.key])?'':values[f.key]} onChange={e=>{const next=e.currentTarget.valueAsNumber;setValues(prev=>({...prev,[f.key]:next}));}}/></label>)}</div>
  <button type="button" className={styles.reset} onClick={()=>setValues(lab.initial)}>恢复{labId}固定基准</button>
  <div className={styles.results} aria-live="polite" aria-atomic="true">{result.status==='OK'?<dl>{result.rows.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>:<p role="status">STOP：本次未得到结果，旧结果已清除；不是经济结果0、套利利润0或违约判断。请核本实验护照或恢复基准。诊断：<code>{result.reason}</code></p>}</div>
 </div>;
}
