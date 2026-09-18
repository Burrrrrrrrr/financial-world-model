import { treasuryCurveLabs } from './treasuryCurveLabDefinitions';
import { treasuryCurveScenarios, type TreasuryCurveScenario } from './treasuryCurveScenarios';
import styles from './treasuryCurve.module.css';

function AnswerPaths({ scenario }: { scenario: TreasuryCurveScenario }) {
  return <div className={styles.answerPaths}>
    {scenario.options.map(option => <p className={option.correct ? styles.correct : undefined} key={option.id}>
      <b>{option.id} · {option.text}</b><br />{option.diagnosis}
    </p>)}
  </div>;
}

export default function TreasuryCurveStaticQuiz() {
  return <div className={styles.quizGrid}>
    {treasuryCurveScenarios.map(scenario => {
      const lab = treasuryCurveLabs.find(candidate => candidate.id === scenario.labId);
      if (!lab) throw Error(`Missing static Treasury curve question passport: ${scenario.labId}`);
      const id = `K${scenario.id}`;

      return <article className={styles.quizCard} key={scenario.id} id={`treasury-curve-${id}`} aria-labelledby={`treasury-curve-${id}-title`}>
        <span className="section-kicker">{id} · 与M{scenario.id}同题同选项 · 无脚本／打印</span>
        <h3 id={`treasury-curve-${id}-title`}>{scenario.title}</h3>
        <p>{scenario.question}</p>
        <p><b>完整固定题设：</b>{scenario.fixture}</p>
        <p><b>{scenario.labId}同一实验护照：</b>{lab.passport}</p>
        <p><b>作答边界：</b>本题不随C控件变化；先独立判断，再展开正确路线和两条回答了不同对象或删除了关键门的错误路径。</p>
        <ol className={styles.quizChoices} aria-label={`${id}三个固定表述选项`}>
          {scenario.options.map(option => <li key={option.id}><b>{option.id} · </b>{option.text}</li>)}
        </ol>
        <details className={styles.staticAnswer}>
          <summary>{id}答案与两条错误路径（无需JavaScript）</summary>
          <AnswerPaths scenario={scenario} />
        </details>
        <div className={styles.printRecord}><AnswerPaths scenario={scenario} /></div>
        <p className={`section-sources ${styles.sources}`}>
          依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
          只核题设对象、曲线身份、driver、六道传导门与逻辑边界；不认证现实冲击、因果、传导系数、收益或政策效果。
        </p>
      </article>;
    })}
  </div>;
}
