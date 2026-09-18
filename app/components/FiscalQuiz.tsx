'use client';
import { useState } from 'react';
import { fiscalScenarios, type FiscalScenario } from './fiscalPolicyScenarios';
import styles from './fiscalPolicy.module.css';
export default function FiscalQuiz(){return <div className="fiscal-interactive-only">{fiscalScenarios.map(s=><Question key={s.id} scenario={s}/>)}</div>;}
function Question({scenario:s}:{scenario:FiscalScenario}) {
 const [selected,setSelected]=useState<string|null>(null);
 const [submitted,setSubmitted]=useState<string|null>(null);
 const checked=s.choices.find(c=>c.id===submitted);
 const correct=checked?.id===s.correctId;
 return <article className={styles.quiz} data-fiscal-quiz={s.id}><h3>{s.id} · {s.title}</h3><p><b>题设：</b>{s.input}</p><fieldset><legend>{s.question}</legend>{s.choices.map((c,i)=><label key={c.id}><input type="radio" name={`fiscal-${s.id}`} value={c.id} checked={selected===c.id} onChange={()=>{setSelected(c.id);setSubmitted(null);}}/><span>{String.fromCharCode(65+i)} · {c.label}</span></label>)}</fieldset><button className={styles.reset} type="button" disabled={!selected} onClick={()=>setSubmitted(selected)}>检查{s.id}推理</button>{checked?<div className={styles.feedback} role="status"><b>{correct?'判断正确':'需要修正'}</b><p>{checked.diagnosis}</p>{correct?<p>{s.explanation}</p>:null}</div>:null}</article>;
}
