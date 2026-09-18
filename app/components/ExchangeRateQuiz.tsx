'use client';

import { useState } from 'react';
import { exchangeRateScenarios, exchangeRateOptions, exchangeRateScenarioInputText } from './exchangeRateScenarios';
import { exchangeRateDisplayValue } from './exchangeRateLabDefinitions';
import styles from './exchangeRate.module.css';

export default function ExchangeRateQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  return <>{exchangeRateScenarios.map(s => {
    const options = exchangeRateOptions(s);
    const selected = options.find(o => o.id === answers[s.id]);
    const feedbackId = `exchange-${s.id}-feedback`;
    return <article className={`${styles.dynamic} ${styles.question}`} key={s.id} id={`exchange-${s.id}`} aria-labelledby={`exchange-${s.id}-title`}>
      <span className="section-kicker">{s.id} · 独立SYN · 与K同题同选项</span>
      <h3 id={`exchange-${s.id}-title`}>{s.title}</h3>
      <p>{s.question}</p>
      <p><b>完整输入：</b>{exchangeRateScenarioInputText(s)}。</p>
      <p><b>{s.labId}同一独立护照：</b>{s.scope}</p>
      <p><b>所求单位：</b>{s.unit}。先确认对象与日期，再选择数值；可以重新选择，反馈只对应当前所选项。</p>
      <ol className={styles.options} aria-label={`${s.id}三个数值选项`}>
        {options.map((o, n) => <li key={o.id}>
          <button type="button" aria-pressed={selected?.id === o.id} aria-controls={feedbackId}
            onClick={() => setAnswers(previous => ({ ...previous, [s.id]: o.id }))}>
            {'ABC'[n]} · {exchangeRateDisplayValue(o.value)} {s.unit}
          </button>
        </li>)}
      </ol>
      <p id={feedbackId} className={styles.feedback} role="status" aria-live="polite" aria-atomic="true">
        {selected ? <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</> : '尚未选择。选择后显示该选项的推理；数值吻合不认证现实市场、风险补偿、可执行套利或预测。'}
      </p>
      <p className="section-sources">依据：{s.sourceIds.map(id => <a key={id} href={`#ref-${id}`}>[{id}] </a>)}。理论来源支持机制；所有给定数值是本题独立SYN，不是来源中的真实观测。</p>
    </article>;
  })}</>;
}
