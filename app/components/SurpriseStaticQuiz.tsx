import { surpriseScenarios, surpriseOptions, surpriseScenarioInputText } from './surpriseScenarios';
import type { SurpriseScenario } from './surpriseScenarios';
import { surpriseLabs, surpriseNumber } from './surpriseLabDefinitions';
import styles from './surprise.module.css';

function AnswerPaths({ scenario }: { scenario: SurpriseScenario }) {
  return (
    <div className={styles.answerPaths}>
      {surpriseOptions(scenario).map(option => <p key={option.id}><b>{option.id} · {surpriseNumber(option.value)} {scenario.unit}：</b>{option.diagnosis}</p>)}
    </div>
  );
}

export default function SurpriseStaticQuiz() {
  return (
    <>
      {surpriseScenarios.map(scenario => {
        const lab = surpriseLabs.find(candidate => candidate.id === scenario.labId);
        if (!lab) throw Error('Missing static question passport ' + scenario.labId);
        const id = `K${scenario.id}`;
        return (
          <article className={`${styles.static} ${styles.question}`} key={scenario.id} id={`surprise-${id}`} aria-labelledby={`surprise-${id}-title`}>
            <span className="section-kicker">{id} · 与M{scenario.id}同题同选项 · 原生折叠／打印</span>
            <h3 id={`surprise-${id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{surpriseScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一独立护照：</b>{lab.passport}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不跟随可编辑C。先写对象、版本、单位与适用时钟；若本题没有版本或时钟字段，就明确写“不适用”，不要虚构日期。然后再展开完整正确推理和两条错误路径。</p>
            <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>
              {surpriseOptions(scenario).map(option => <li key={option.id}><b>{option.id} · </b>{surpriseNumber(option.value)} {scenario.unit}</li>)}
            </ol>
            <details>
              <summary>{id}答案与两条错误路径（无需JavaScript）</summary>
              <AnswerPaths scenario={scenario} />
            </details>
            <div className={styles.printRecord}><AnswerPaths scenario={scenario} /></div>
            <p className={`section-sources ${styles.sources}`}>
              依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
              只核本题已给合成条件的对象、时钟与计算，不认证真实消息、因果、PIT或价格预测。
            </p>
          </article>
        );
      })}
    </>
  );
}
