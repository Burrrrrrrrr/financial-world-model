import { safeAssetLabs, safeAssetNumber } from './safeAssetLabDefinitions';
import { safeAssetOptions, safeAssetScenarioInputText, safeAssetScenarios } from './safeAssetScenarios';
import type { SafeAssetScenario } from './safeAssetScenarios';
import styles from './safeAsset.module.css';

function AnswerPaths({ scenario }: { scenario: SafeAssetScenario }) {
  return <div className={styles.answerPaths}>
    {safeAssetOptions(scenario).map(option => <p className={option.correct ? styles.correct : undefined} key={option.id}>
      <b>{option.id} · {safeAssetNumber(option.value)} {scenario.unit}：</b>{option.diagnosis}
    </p>)}
  </div>;
}

export default function SafeAssetStaticQuiz() {
  return <div className={styles.quizGrid}>
    {safeAssetScenarios.map(scenario => {
      const lab = safeAssetLabs.find(candidate => candidate.id === scenario.labId);
      if (!lab) throw Error(`静态题缺少实验护照：${scenario.labId}`);
      const id = `K${scenario.id}`;
      return <article className={styles.quizCard} key={scenario.id} id={`safe-asset-${id}`} aria-labelledby={`safe-asset-${id}-title`}>
        <span className="section-kicker">{id} · 与M{scenario.id}同题同选项 · 无脚本／打印</span>
        <h3 id={`safe-asset-${id}-title`}>{scenario.title}</h3>
        <p>{scenario.question}</p>
        <p><b>完整固定输入：</b>{safeAssetScenarioInputText(scenario)}</p>
        <p><b>{scenario.labId}同一实验护照：</b>{lab.passport}</p>
        <p><b>所求单位：</b>{scenario.unit}。本题不随C控件变化；先独立手算，再展开正确路线和两条回答了不同对象的错误路径。</p>
        <ol className={styles.quizChoices} aria-label={`${id}三个中性数值选项`}>
          {safeAssetOptions(scenario).map(option => <li key={option.id}><b>{option.id} · </b>{safeAssetNumber(option.value)} {scenario.unit}</li>)}
        </ol>
        <details className={styles.staticAnswer}>
          <summary>{id}答案与两条错误路径（无需JavaScript）</summary>
          <AnswerPaths scenario={scenario} />
        </details>
        <div className={styles.printRecord}><AnswerPaths scenario={scenario} /></div>
        <p className={`section-sources ${styles.sources}`}>
          依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
          只核题设对象、用途、状态、单位和算术，不认证现实安全评级、储备交易、因果、阈值或政策效果。
        </p>
      </article>;
    })}
  </div>;
}
