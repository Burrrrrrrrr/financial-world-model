import { cycleScenarios, cycleOptions, cycleScenarioInputText } from './cycleScenarios';
import type { CycleScenario } from './cycleScenarios';
import { cycleDisplayValue } from './cycleLabDefinitions';
import styles from './cycle.module.css';

function AnswerPaths({ scenario }: { scenario: CycleScenario }) {
  return (
    <div className={styles.answerPaths}>
      {cycleOptions(scenario).map(option => (
        <p key={option.id}>
          <b>{option.id} · {cycleDisplayValue(option.value)} {scenario.unit} · {option.correct ? '正确推理' : '这条路径错在哪里'}：</b>
          {option.diagnosis}
        </p>
      ))}
    </div>
  );
}

export default function CycleStaticQuiz() {
  return (
    <>
      {cycleScenarios.map((scenario, index) => {
        const id = `K${index + 1}`;
        return (
          <article className={`${styles.static} ${styles.question}`} key={scenario.id} id={`cycle-${id}`} aria-labelledby={`cycle-${id}-title`}>
            <span className="section-kicker">{id} · 与{scenario.id}同题同选项 · 原生折叠 / 打印</span>
            <h3 id={`cycle-${id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{cycleScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一独立护照：</b>{scenario.scope}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不跟随可编辑实验。先写下对象与日期，展开后核完整正确推理和两条错误路径。</p>
            <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>
              {cycleOptions(scenario).map(option => <li key={option.id}><b>{option.id} · </b>{cycleDisplayValue(option.value)} {scenario.unit}</li>)}
            </ol>
            <details>
              <summary>{id}答案与两条错误路径（无需JavaScript）</summary>
              <AnswerPaths scenario={scenario} />
            </details>
            <div className={styles.printRecord}><AnswerPaths scenario={scenario} /></div>
            <p className={`section-sources ${styles.sources}`}>
              依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
              本题只核独立合成条件下的对象、时钟与计算，不认证真实周期定年、法律判断、系统性危机、预测或PIT。
            </p>
          </article>
        );
      })}
    </>
  );
}
