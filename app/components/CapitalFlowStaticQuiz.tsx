import {flowScenarios,flowOptions,flowScenarioInputText} from './capitalFlowScenarios';
import type {FlowScenario} from './capitalFlowScenarios';
import {flowDisplayValue} from './capitalFlowLabDefinitions';
import styles from './capitalFlow.module.css';
function AnswerPaths({scenario}:{scenario:FlowScenario}){return <>{flowOptions(scenario).map((o,n)=><p key={o.id}><b>{'ABC'[n]} · {flowDisplayValue(o.value)} {scenario.unit} · {o.correct?'正确推理':'这条路径错在哪里'}：</b>{o.diagnosis}</p>)}</>;}
export default function CapitalFlowStaticQuiz(){return <>{flowScenarios.map((s,i)=><article className={`${styles.static} ${styles.question}`} key={s.id} id={`capital-K${i+1}`} aria-labelledby={`capital-K${i+1}-title`}>
 <span className="section-kicker">K{i+1} · 与{s.id}同题同选项 · 原生折叠／打印</span><h3 id={`capital-K${i+1}-title`}>{s.title}</h3><p>{s.question}</p>
 <p><b>完整输入：</b>{flowScenarioInputText(s)}。</p><p><b>{s.labId}同一独立护照：</b>{s.scope}</p><p><b>所求单位：</b>{s.unit}。先写出对象与日期，展开后重建正确推理和两条错误路径。</p>
 <ol className={styles.options} aria-label={`K${i+1}三个数值选项`}>{flowOptions(s).map((o,n)=><li key={o.id}><b>{'ABC'[n]} · </b>{flowDisplayValue(o.value)} {s.unit}</li>)}</ol>
 <details><summary>K{i+1}答案与两条错路径（无需JavaScript）</summary><AnswerPaths scenario={s}/></details><div className={styles.printRecord}><AnswerPaths scenario={s}/></div>
 <p className="section-sources">依据：{s.sourceIds.map(id=><a key={id} href={`#ref-${id}`}>[{id}] </a>)}。只核本题独立SYN，不认证真实信用、资金用途、央行授权、净流出、赎回或预测。</p>
 </article>)}</>;}
