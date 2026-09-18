'use client';
import {useState} from 'react';
import {jointScenarios,jointOptions,jointScenarioInputText} from './jointPolicyScenarios';
import type {JointScenario} from './jointPolicyScenarios';
import {jointDisplayValue} from './jointLabDefinitions';
import styles from './jointPolicy.module.css';
function Question({s}:{s:JointScenario}){const [selected,setSelected]=useState<number|null>(null);const options=jointOptions(s);return <article className={styles.question} id={`joint-${s.id}`}><span className="section-kicker">{s.id} · INDEPENDENT SYN</span><h3>{s.title}</h3><p>{s.question}</p><p><b>完整输入（与K题相同）：</b>{jointScenarioInputText(s)}。</p><p><b>范围：</b>{s.labId}同一护照；答案量纲：{s.unit}。</p><ol className={styles.options}>{options.map((o,i)=><li key={o.id}><button type="button" aria-pressed={selected===i} onClick={()=>setSelected(i)}><b>{'ABC'[i]} · </b>{jointDisplayValue(o.value)} {s.unit}</button></li>)}</ol><div aria-live="polite" aria-atomic="true">{selected===null?<p>先手算，再选择；无脚本时请用后面的原生K题。</p>:<p className={styles.feedback}>{options[selected].correct?'✓ 本题通过':'需要修改'}：{options[selected].diagnosis}</p>}</div></article>;}
export default function JointQuiz(){return <div>{jointScenarios.map(s=><Question key={s.id} s={s}/>)}</div>;}
