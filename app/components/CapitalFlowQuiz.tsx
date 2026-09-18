'use client';
import {useState} from 'react';
import {flowScenarios,flowOptions,flowScenarioInputText} from './capitalFlowScenarios';
import {flowDisplayValue} from './capitalFlowLabDefinitions';
import styles from './capitalFlow.module.css';
export default function CapitalFlowQuiz(){
 const [answers,setAnswers]=useState<Readonly<Record<string,string>>>({});
 return <>{flowScenarios.map(s=>{const options=flowOptions(s),selected=options.find(o=>o.id===answers[s.id]),feedbackId=`capital-${s.id}-feedback`;
  return <article className={`${styles.dynamic} ${styles.question}`} key={s.id} id={`capital-${s.id}`} aria-labelledby={`capital-${s.id}-title`}>
   <span className="section-kicker">{s.id} · 独立SYN · 与K同题同选项</span><h3 id={`capital-${s.id}-title`}>{s.title}</h3><p>{s.question}</p>
   <p><b>完整输入：</b>{flowScenarioInputText(s)}。</p><p><b>{s.labId}同一独立护照：</b>{s.scope}</p><p><b>所求单位：</b>{s.unit}。先确认对象与日期，再选择数值；重新选择立即换成当前候选的诊断。</p>
   <ol className={styles.options} aria-label={`${s.id}三个数值选项`}>{options.map((o,n)=><li key={o.id}><button type="button" aria-pressed={selected?.id===o.id} aria-controls={feedbackId} onClick={()=>setAnswers(previous=>({...previous,[s.id]:o.id}))}>{'ABC'[n]} · {flowDisplayValue(o.value)} {s.unit}</button></li>)}</ol>
   <p id={feedbackId} className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">{selected?<><b>{selected.correct?'本题推理吻合':'需要重做'}：</b>{selected.diagnosis}</>:'尚未选择。选择后显示当前候选推理；数值吻合不认证实际贷款、资金用途、成交、法律或因果预测。'}</p>
   <p className="section-sources">依据：{s.sourceIds.map(id=><a key={id} href={`#ref-${id}`}>[{id}] </a>)}。来源支持机制；本题输入为独立SYN，不是来源观测。</p>
  </article>;
 })}</>;
}
