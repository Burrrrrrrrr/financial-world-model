import { exchangeRateScenarios, exchangeRateOptions, exchangeRateScenarioInputText } from './exchangeRateScenarios';
import type { ExchangeRateScenario } from './exchangeRateScenarios';
import { exchangeRateDisplayValue } from './exchangeRateLabDefinitions';
import styles from './exchangeRate.module.css';

function AnswerPaths({ scenario }: { scenario: ExchangeRateScenario }) {
  return <>{exchangeRateOptions(scenario).map((o, n) => <p key={o.id}>
    <b>{'ABC'[n]} · {exchangeRateDisplayValue(o.value)} {scenario.unit} · {o.correct ? '正确推理' : '这条路径错在哪里'}：</b>{o.diagnosis}
  </p>)}</>;
}

export default function ExchangeRateStaticQuiz() {
  return <>{exchangeRateScenarios.map((s, i) => <article className={`${styles.static} ${styles.question}`} key={s.id} id={`exchange-K${i + 1}`} aria-labelledby={`exchange-K${i + 1}-title`}>
    <span className="section-kicker">K{i + 1} · 与{s.id}同题同选项 · 原生折叠／打印</span>
    <h3 id={`exchange-K${i + 1}-title`}>{s.title}</h3>
    <p>{s.question}</p>
    <p><b>完整输入：</b>{exchangeRateScenarioInputText(s)}。</p>
    <p><b>{s.labId}同一独立护照：</b>{s.scope}</p>
    <p><b>所求单位：</b>{s.unit}。先写出对象与日期再判断；展开后逐条核对，而不是只记正确字母。</p>
    <ol className={styles.options} aria-label={`K${i + 1}三个数值选项`}>
      {exchangeRateOptions(s).map((o, n) => <li key={o.id}><b>{'ABC'[n]} · </b>{exchangeRateDisplayValue(o.value)} {s.unit}</li>)}
    </ol>
    <details>
      <summary>K{i + 1}答案与两条错路径（无需JavaScript）</summary>
      <AnswerPaths scenario={s} />
    </details>
    <div className={styles.printRecord}><AnswerPaths scenario={s} /></div>
    <p className="section-sources">依据：{s.sourceIds.map(id => <a key={id} href={`#ref-${id}`}>[{id}] </a>)}。仅核本题独立SYN；不认证现实风险、可执行套利、贸易数量、法定利润或预测。</p>
  </article>)}</>;
}
