import { housingScenarios } from './housingCollateralScenarios';
import styles from './housingCollateral.module.css';

export default function HousingStaticQuiz() {
  return <div>{housingScenarios.map((scenario) => <article className={styles.staticQuiz} data-housing-static={`K${scenario.id}`} key={scenario.id}>
    <h3>K{scenario.id} · {scenario.title}</h3><p>{scenario.input}</p><p><b>问题：</b>{scenario.question}</p><p><b>选项：</b>{scenario.choices.map(({label},i)=>`${String.fromCharCode(65+i)}. ${label}`).join('；')}</p>
    <details><summary>展开K{scenario.id}完整答案与三条路径诊断</summary><p>{scenario.explanation}</p>{scenario.choices.map((choice)=><p key={choice.id}><b>{choice.label}：</b>{choice.diagnosis}</p>)}</details>
    <div className={styles.printAnswer}><p><b>答案：</b>{scenario.explanation}</p>{scenario.choices.map((choice)=><p key={choice.id}><b>{choice.label}：</b>{choice.diagnosis}</p>)}</div>
    <p className="section-sources"><a href={`#${scenario.anchor}`}>对应机制</a> {scenario.sources.map((id)=><a key={id} href={`#ref-${id}`}>[{id}]</a>)}</p>
  </article>)}</div>;
}
