'use client';
import { useState } from 'react';
import { housingScenarios, type HousingScenario } from './housingCollateralScenarios';
import styles from './housingCollateral.module.css';

function QuizCard({ scenario }: { scenario: HousingScenario }) {
  const [selected, setSelected] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<string | null>(null);
  const verdict = scenario.choices.find(({id})=>id===submitted);
  return <article className={styles.quiz} data-housing-quiz={`M${scenario.id}`}>
    <h3>M{scenario.id} · {scenario.title}</h3><p>{scenario.input}</p>
    <fieldset><legend>{scenario.question}</legend>{scenario.choices.map((choice) => <label key={choice.id}><input type="radio" name={`housing-M${scenario.id}`} value={choice.id} checked={selected===choice.id} onChange={()=>{setSelected(choice.id);setSubmitted(null);}} /><span>{choice.label}</span></label>)}</fieldset>
    <button className={styles.reset} type="button" disabled={selected===null} onClick={()=>setSubmitted(selected)}>检查M{scenario.id}</button>
    {verdict ? <div className={styles.feedback} role="status"><b>{submitted===scenario.correct ? '判断正确' : '需要修正'}</b><p>{verdict.diagnosis}</p>{submitted===scenario.correct ? <p>{scenario.explanation}</p> : <a href={`#${scenario.anchor}`}>回到对应机制，重算以后再提交</a>}</div> : null}
  </article>;
}
export default function HousingQuiz() {
  return <div className={`${styles.dynamic} housing-interactive-only`}><p>先自己手算再选择。改选会清除旧反馈；错路径说明只指出错误机制，不直接替你给出标准答案。</p>{housingScenarios.map((scenario)=><QuizCard key={scenario.id} scenario={scenario} />)}</div>;
}
