import { macroNumber, macroprudentialLabs } from './macroprudentialLabDefinitions';
import {
  macroprudentialOptions,
  macroprudentialScenarioInputText,
  macroprudentialScenarios,
} from './macroprudentialScenarios';
import type { MacroprudentialScenario } from './macroprudentialScenarios';
import styles from './macroprudential.module.css';

function AnswerPaths({ scenario }: { scenario: MacroprudentialScenario }) {
  return <div className={styles.answerPaths}>{macroprudentialOptions(scenario).map(option => <p key={option.id}><b>{option.id} · {macroNumber(option.value)} {scenario.unit}：</b>{option.diagnosis}</p>)}</div>;
}

export default function MacroprudentialStaticQuiz() {
  return <>{macroprudentialScenarios.map(scenario => {
    const lab = macroprudentialLabs.find(candidate => candidate.id === scenario.labId);
    if (!lab) throw Error(`静态题缺少护照：${scenario.labId}`);
    const id = `K${scenario.id}`;
    return (
      <article className={`${styles.static} ${styles.question}`} key={scenario.id} id={`macroprudential-${id}`} aria-labelledby={`macroprudential-${id}-title`}>
        <span className="section-kicker">{id} · 与M{scenario.id}同题同选项 · 无脚本／打印</span>
        <h3 id={`macroprudential-${id}-title`}>{scenario.title}</h3>
        <p>{scenario.question}</p>
        <p><b>完整固定输入：</b>{macroprudentialScenarioInputText(scenario)}</p>
        <p><b>{scenario.labId}同一护照：</b>{lab.passport}</p>
        <p><b>所求单位：</b>{scenario.unit}。先独立手算，再展开正确路线和两条错误路径；本题不随C控件变化。</p>
        <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>{macroprudentialOptions(scenario).map(option => <li key={option.id}><b>{option.id} · </b>{macroNumber(option.value)} {scenario.unit}</li>)}</ol>
        <details><summary>{id}答案与两条错误路径（无需JavaScript）</summary><AnswerPaths scenario={scenario} /></details>
        <div className={styles.printRecord}><AnswerPaths scenario={scenario} /></div>
        <p className={`section-sources ${styles.sources}`}>依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。只核题设算术与语义，不认证现实政策。</p>
      </article>
    );
  })}</>;
}
