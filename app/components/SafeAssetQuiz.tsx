'use client';

import { useEffect, useState } from 'react';
import { safeAssetLabs, safeAssetNumber } from './safeAssetLabDefinitions';
import { safeAssetOptions, safeAssetScenarioInputText, safeAssetScenarios } from './safeAssetScenarios';
import styles from './safeAsset.module.css';

export default function SafeAssetQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});

  useEffect(() => {
    document.documentElement.classList.add('safe-asset-js');
    return () => document.documentElement.classList.remove('safe-asset-js');
  }, []);

  return <div id="safe-asset-interactive-quiz" className={`${styles.quizGrid} safe-asset-interactive-only`}>
    {safeAssetScenarios.map(scenario => {
      const lab = safeAssetLabs.find(candidate => candidate.id === scenario.labId);
      if (!lab) throw Error(`互动题缺少实验护照：${scenario.labId}`);
      const options = safeAssetOptions(scenario);
      const selected = options.find(option => option.id === answers[scenario.id]);
      const id = `M${scenario.id}`;
      const feedbackId = `safe-asset-${id}-feedback`;

      return <article className={styles.quizCard} key={scenario.id} id={`safe-asset-${id}`} aria-labelledby={`safe-asset-${id}-title`}>
        <span className="section-kicker">{id} · 固定默认SYN · 与K同题同选项</span>
        <h3 id={`safe-asset-${id}-title`}>{scenario.title}</h3>
        <p>{scenario.question}</p>
        <p><b>完整固定输入：</b>{safeAssetScenarioInputText(scenario)}</p>
        <p><b>{scenario.labId}同一实验护照：</b>{lab.passport}</p>
        <p><b>所求单位：</b>{scenario.unit}。本题不跟随可编辑C；先锁对象、用途、状态与单位，再选择中性数值。</p>
        <ol className={styles.quizChoices} aria-label={`${id}三个中性数值选项`}>
          {options.map(option => <li key={option.id}>
            <button
              id={`safe-asset-${id}-option-${option.id}`}
              type="button"
              aria-pressed={selected?.id === option.id}
              aria-controls={feedbackId}
              onClick={() => setAnswers(previous => ({ ...previous, [scenario.id]: option.id }))}
            >{option.id} · {safeAssetNumber(option.value)} {scenario.unit}</button>
          </li>)}
        </ol>
        <p id={feedbackId} className={styles.quizFeedback} aria-live="polite" aria-atomic="true">
          {selected
            ? <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</>
            : '尚未选择。答后只显示当前候选诊断；中性数字不认证现实主权、市场、储备动机、因果、债务阈值、最优供给或政策效果。'}
        </p>
        <p className={`section-sources ${styles.sources}`}>
          依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
          来源支持定义与机制；题设是独立SYN，不是来源数据或历史回放。
        </p>
      </article>;
    })}
  </div>;
}
