import { balanceOfPaymentsLabs, bopNumber } from './balanceOfPaymentsLabDefinitions';
import {
  balanceOfPaymentsOptions,
  balanceOfPaymentsScenarioInputText,
  balanceOfPaymentsScenarios,
} from './balanceOfPaymentsScenarios';
import type { BopScenario } from './balanceOfPaymentsScenarios';
import styles from './balanceOfPayments.module.css';

function AnswerPaths({ scenario }: { scenario: BopScenario }) {
  return (
    <div className={styles.answerPaths}>
      {balanceOfPaymentsOptions(scenario).map(option => (
        <p key={option.id}><b>{option.id} · {bopNumber(option.value)} {scenario.unit}：</b>{option.diagnosis}</p>
      ))}
    </div>
  );
}

export default function BalanceOfPaymentsStaticQuiz() {
  return (
    <>
      {balanceOfPaymentsScenarios.map(scenario => {
        const lab = balanceOfPaymentsLabs.find(candidate => candidate.id === scenario.labId);
        if (!lab) throw Error(`静态题缺少实验护照：${scenario.labId}`);
        const id = `K${scenario.id}`;

        return (
          <article
            className={`${styles.static} ${styles.question}`}
            key={scenario.id}
            id={`balance-of-payments-${id}`}
            aria-labelledby={`balance-of-payments-${id}-title`}
          >
            <span className="section-kicker">{id} · 与M{scenario.id}同题同选项 · 无脚本／打印</span>
            <h3 id={`balance-of-payments-${id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{balanceOfPaymentsScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一实验护照：</b>{lab.passport}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不随C控件变化；先独立手算，再展开正确路线和两条回答了不同对象的错误路径。</p>
            <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>
              {balanceOfPaymentsOptions(scenario).map(option => <li key={option.id}><b>{option.id} · </b>{bopNumber(option.value)} {scenario.unit}</li>)}
            </ol>
            <details>
              <summary>{id}答案与两条错误路径（无需JavaScript）</summary>
              <AnswerPaths scenario={scenario} />
            </details>
            <div className={styles.printRecord}><AnswerPaths scenario={scenario} /></div>
            <p className={`section-sources ${styles.sources}`}>
              依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
              只核题设对象、记账方向与算术，不认证现实数据、因果、危机概率或政策效果。
            </p>
          </article>
        );
      })}
    </>
  );
}
