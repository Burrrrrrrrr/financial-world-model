'use client';

import { useState } from 'react';
import { internationalMonetaryLabs, imsNumber } from './internationalMonetaryLabDefinitions';
import {
  internationalMonetaryOptions,
  internationalMonetaryScenarioInputText,
  internationalMonetaryScenarios,
} from './internationalMonetaryScenarios';
import styles from './internationalMonetary.module.css';

export default function InternationalMonetaryQuiz() {
  const [answers, setAnswers] = useState<Readonly<Record<string, string>>>({});

  return (
    <div id="international-monetary-interactive-quiz" className="international-monetary-interactive-only">
      {internationalMonetaryScenarios.map(scenario => {
        const lab = internationalMonetaryLabs.find(candidate => candidate.id === scenario.labId);
        if (!lab) throw Error(`互动题缺少实验护照：${scenario.labId}`);
        const options = internationalMonetaryOptions(scenario);
        const selected = options.find(option => option.id === answers[scenario.id]);
        const id = `M${scenario.id}`;
        const feedbackId = `international-monetary-${id}-feedback`;

        return (
          <article className={`${styles.dynamic} ${styles.question}`} key={scenario.id} id={`international-monetary-${id}`} aria-labelledby={`international-monetary-${id}-title`}>
            <span className="section-kicker">{id} · 固定默认SYN · 与K同题同选项</span>
            <h3 id={`international-monetary-${id}-title`}>{scenario.title}</h3>
            <p>{scenario.question}</p>
            <p><b>完整固定输入：</b>{internationalMonetaryScenarioInputText(scenario)}</p>
            <p><b>{scenario.labId}同一实验护照：</b>{lab.passport}</p>
            <p><b>所求单位：</b>{scenario.unit}。本题不跟随可编辑C；先确认功能、分母、时钟和状态，再选择中性数值。</p>
            <ol className={styles.options} aria-label={`${id}三个中性数值选项`}>
              {options.map(option => (
                <li key={option.id}>
                  <button
                    id={`international-monetary-${id}-option-${option.id}`}
                    type="button"
                    aria-pressed={selected?.id === option.id}
                    aria-controls={feedbackId}
                    onClick={() => setAnswers(previous => ({ ...previous, [scenario.id]: option.id }))}
                  >
                    {option.id} · {imsNumber(option.value)} {scenario.unit}
                  </button>
                </li>
              ))}
            </ol>
            <p id={feedbackId} className={styles.feedback} aria-live="polite" aria-atomic="true">
              {selected
                ? <><b>{selected.correct ? '本题推理吻合' : '需要重做'}：</b>{selected.diagnosis}</>
                : '尚未选择。答后只显示当前候选诊断；中性数字不认证真实币种数据、因果、point-in-time（PIT，历史时点当时可得）、替代概率或政策效果。'}
            </p>
            <p className={`section-sources ${styles.sources}`}>
              依据：{scenario.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${id}参考文献${sourceId}`}>[{sourceId}] </a>)}。
              来源支持定义与机制；题设是独立SYN，不是来源数据或历史回放。
            </p>
          </article>
        );
      })}
    </div>
  );
}
