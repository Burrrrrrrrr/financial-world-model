'use client';

import { useEffect, useState } from 'react';
import { treasuryCurveLabs } from './treasuryCurveLabDefinitions';
import { treasuryCurveScenarios } from './treasuryCurveScenarios';
import styles from './treasuryCurve.module.css';

export default function TreasuryCurveQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});

  useEffect(() => {
    document.documentElement.classList.add('treasury-curve-js');
    return () => document.documentElement.classList.remove('treasury-curve-js');
  }, []);

  return <div id="treasury-curve-interactive-quiz" className={`${styles.quizGrid} treasury-curve-interactive-only`}>
    {treasuryCurveScenarios.map(scenario => {
      const lab = treasuryCurveLabs.find(candidate => candidate.id === scenario.labId);
      if (!lab) throw Error(`Missing Treasury curve question passport: ${scenario.labId}`);
      const selected = scenario.options.find(option => option.id === answers[scenario.id]);
      const id = `M${scenario.id}`;
      const feedbackId = `treasury-curve-${id}-feedback`;

      return <article className={styles.quizCard} key={scenario.id} id={`treasury-curve-${id}`} aria-labelledby={`treasury-curve-${id}-title`}>
        <span className="section-kicker">{id} · 固定SYN题设 · 与K{scenario.id}同题同选项</span>
        <h3 id={`treasury-curve-${id}-title`}>{scenario.title}</h3>
        <p>{scenario.question}</p>
        <p><b>完整固定题设：</b>{scenario.fixture}</p>
        <p><b>{scenario.labId}同一实验护照：</b>{lab.passport}</p>
        <p><b>作答边界：</b>本题不跟随可编辑C；先锁定曲线对象、现金流、driver、融资、币种和本地门，再选择一条完整表述。</p>
        <ol className={styles.quizChoices} aria-label={`${id}三个固定表述选项`}>
          {scenario.options.map(option => <li key={option.id}>
            <button
              id={`treasury-curve-${id}-option-${option.id}`}
              type="button"
              aria-pressed={selected?.id === option.id}
              aria-controls={feedbackId}
              onClick={() => setAnswers(previous => ({ ...previous, [scenario.id]: option.id }))}
            ><b>{option.id} · </b>{option.text}</button>
          </li>)}
        </ol>
        <p id={feedbackId} className={styles.quizFeedback} aria-live="polite" aria-atomic="true">
          {selected
            ? <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</>
            : '尚未选择。答后只显示当前候选路径的诊断；题设不认证实时曲线、现实证券、PIT/OOS、因果、预测、收益或交易。'}
        </p>
        <p className={`section-sources ${styles.sources}`}>
          依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
          来源支持定义与机制；题设是独立SYN，不是来源数据或历史回放。
        </p>
      </article>;
    })}
  </div>;
}
