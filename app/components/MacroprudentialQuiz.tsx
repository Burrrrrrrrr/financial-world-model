'use client';

import { useState } from 'react';
import { macroNumber, macroprudentialLabs } from './macroprudentialLabDefinitions';
import {
  macroprudentialOptions,
  macroprudentialScenarioInputText,
  macroprudentialScenarios,
} from './macroprudentialScenarios';
import styles from './macroprudential.module.css';

export default function MacroprudentialQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  return (
    <div id="macroprudential-interactive-quiz" className="macroprudential-interactive-only">
      {macroprudentialScenarios.map(scenario => {
        const lab = macroprudentialLabs.find(candidate => candidate.id === scenario.labId);
        if (!lab) throw Error(`互动题缺少护照：${scenario.labId}`);
        const options = macroprudentialOptions(scenario);
        const selected = options.find(option => option.id === answers[scenario.id]);
        const id = `M${scenario.id}`;
        const feedbackId = `macroprudential-${id}-feedback`;
        return (
          <article className={`${styles.dynamic} ${styles.question}`} key={scenario.id} id={`macroprudential-${id}`} aria-labelledby={`macroprudential-${id}-title`}>
            <span className="section-kicker">{id} · 固定默认SYN · 与K同题同选项</span>
            <h3 id={`macroprudential-${id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{macroprudentialScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一护照：</b>{lab.passport}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不跟随可编辑C；先确认对象与范围，再选中性数值。</p>
            <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>
              {options.map(option => <li key={option.id}><button type="button" aria-pressed={selected?.id === option.id} aria-controls={feedbackId} onClick={() => setAnswers(previous => ({ ...previous, [scenario.id]: option.id }))}>{option.id} · {macroNumber(option.value)} {scenario.unit}</button></li>)}
            </ol>
            <p id={feedbackId} className={styles.feedback} aria-live="polite" aria-atomic="true">
              {selected ? <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</> : '尚未选择。答后只显示当前候选诊断；数字不会认证现实政策效果、PIT、OOS、因果或生产资格。'}
            </p>
            <p className={`section-sources ${styles.sources}`}>依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。来源支持机制；题设不是来源数据。</p>
          </article>
        );
      })}
    </div>
  );
}
