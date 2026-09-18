'use client';

import { useState } from 'react';
import { surpriseScenarios, surpriseOptions, surpriseScenarioInputText } from './surpriseScenarios';
import { surpriseLabs, surpriseNumber } from './surpriseLabDefinitions';
import styles from './surprise.module.css';

export default function SurpriseQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  return (
    <div id="surprise-interactive-quiz" className="surprise-interactive-only">
      {surpriseScenarios.map(scenario => {
        const lab = surpriseLabs.find(candidate => candidate.id === scenario.labId);
        if (!lab) throw Error('Missing question passport ' + scenario.labId);
        const options = surpriseOptions(scenario);
        const selected = options.find(option => option.id === answers[scenario.id]);
        const id = `M${scenario.id}`;
        const feedbackId = `surprise-${id}-feedback`;
        return (
          <article className={`${styles.dynamic} ${styles.question}`} key={scenario.id} id={`surprise-${id}`} aria-labelledby={`surprise-${id}-title`}>
            <span className="section-kicker">{id} · 固定默认SYN · 与K同题同选项</span>
            <h3 id={`surprise-${id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{surpriseScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一独立护照：</b>{lab.passport}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不跟随可编辑C。先核对象、版本与时钟，再选择；改选立即替换成当前候选诊断。</p>
            <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>
              {options.map(option => (
                <li key={option.id}>
                  <button
                    id={`surprise-${id}-option-${option.id}`}
                    type="button"
                    aria-pressed={selected?.id === option.id}
                    aria-controls={feedbackId}
                    onClick={() => setAnswers(previous => ({ ...previous, [scenario.id]: option.id }))}
                  >{option.id} · {surpriseNumber(option.value)} {scenario.unit}</button>
                </li>
              ))}
            </ol>
            <p id={feedbackId} className={styles.feedback} aria-live="polite" aria-atomic="true">
              {selected ? <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</> : '尚未选择。答后才显示当前候选推理；中性数字不认证真实市场消息、因果、PIT或价格预测。'}
            </p>
            <p className={`section-sources ${styles.sources}`}>
              依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
              来源支持机制；本题条件是独立SYN，不是来源数据或真实事件回放。
            </p>
          </article>
        );
      })}
    </div>
  );
}
