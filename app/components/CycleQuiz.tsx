'use client';

import { useState } from 'react';
import { cycleScenarios, cycleOptions, cycleScenarioInputText } from './cycleScenarios';
import { cycleDisplayValue } from './cycleLabDefinitions';
import styles from './cycle.module.css';

export default function CycleQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});
  return (
    <div id="cycle-interactive-quiz" className="cycle-interactive-only">
      {cycleScenarios.map(scenario => {
        const options = cycleOptions(scenario);
        const selected = options.find(option => option.id === answers[scenario.id]);
        const feedbackId = `cycle-${scenario.id}-feedback`;
        return (
          <article className={`${styles.dynamic} ${styles.question}`} key={scenario.id} id={`cycle-${scenario.id}`} aria-labelledby={`cycle-${scenario.id}-title`}>
            <span className="section-kicker">{scenario.id} · 固定默认SYN · 与K同题同选项</span>
            <h3 id={`cycle-${scenario.id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{cycleScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一独立护照：</b>{scenario.scope}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不跟随上方可编辑实验。先核对象与日期，再选择；改选立即替换成当前候选诊断。</p>
            <ol className={styles.options} aria-label={`${scenario.id}三个中性数值选项`}>
              {options.map(option => (
                <li key={option.id}>
                  <button
                    id={`cycle-${scenario.id}-option-${option.id}`}
                    type="button"
                    aria-pressed={selected?.id === option.id}
                    aria-controls={feedbackId}
                    onClick={() => setAnswers(previous => ({ ...previous, [scenario.id]: option.id }))}
                  >
                    {option.id} · {cycleDisplayValue(option.value)} {scenario.unit}
                  </button>
                </li>
              ))}
            </ol>
            <p id={feedbackId} className={styles.feedback} aria-live="polite" aria-atomic="true">
              {selected ? (
                <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</>
              ) : (
                '尚未选择。选择后才显示当前候选推理；数值吻合不认证真实周期、法律判断、系统性危机或预测。'
              )}
            </p>
            <p className={`section-sources ${styles.sources}`}>
              依据：{scenario.sourceIds.map(id => <a key={id} href={`#ref-${id}`} aria-label={`${scenario.id}参考文献${id}`}>[{id}] </a>)}。
              来源支持机制；本题输入为独立SYN，不是来源观测、官方定年或PIT认证。
            </p>
          </article>
        );
      })}
    </div>
  );
}
