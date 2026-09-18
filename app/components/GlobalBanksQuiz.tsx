'use client';

import { useState } from 'react';
import { globalBanksChecks } from '../lessons/globalBanksStudy';
import styles from './globalBanks.module.css';

function StaticQuestionSheet({ print = false }: { print?: boolean }) {
  return <div className={styles.staticQuiz} data-static-question-sheet="true" data-print-static={print ? 'true' : 'false'}>
    {globalBanksChecks.map(check => <article key={`${print ? 'print-' : ''}${check.id}`}>
      <h4>{check.id} · {check.title}</h4>
      <p>{check.question}</p>
      <ol className={styles.staticOptions}>{check.options.map((option, index) => <li key={option}><b>{String.fromCharCode(65 + index)}.</b> {option}</li>)}</ol>
    </article>)}
  </div>;
}

function StaticAnswerKey({ print = false }: { print?: boolean }) {
  return <div className={`${styles.staticQuiz} ${styles.answerKey}`} data-static-answer-key="true" data-print-answer-key={print ? 'true' : 'false'}>
    {globalBanksChecks.map(check => <article key={`${print ? 'print-answer-' : 'answer-'}${check.id}`}>
      <h4>{check.id} 答案 · {String.fromCharCode(65 + check.correct)}</h4>
      <p><b>答案：</b>{String.fromCharCode(65 + check.correct)}。{check.answer}</p>
      <p><b>误区：</b>{check.trap}</p>
      <p className={styles.sourceLine}>依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>
    </article>)}
  </div>;
}

export default function GlobalBanksQuiz() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const check = globalBanksChecks[active];
  const correct = selected === check.correct;
  const questionTitleId = `global-banks-check-${check.id}-title`;
  const selectedLetter = selected === null ? '' : String.fromCharCode(65 + selected);
  const correctLetter = String.fromCharCode(65 + check.correct);

  return <section className={styles.quiz} aria-labelledby="global-banks-quiz-title">
    <span className="section-kicker">TWELVE M/K CHECKS · INTERACTIVE + STATIC TWINS</span>
    <h3 id="global-banks-quiz-title">十二道退出检查：先辨统计镜头、实体和路线，再做会计桥与识别判断。</h3>
    <p>互动版只保存当前题的临时选择，切题会清空答案。无JavaScript与纸本先给完整题册，再用独立答案册核对；每道解释都要写出对象、口径和证据上限。</p>
    <div className="global-banks-interactive-only">
      <nav className={styles.quizNav} aria-label="十二道全球银行理解检查">
        {globalBanksChecks.map((item, index) => <button aria-current={active === index ? 'true' : undefined} key={item.id} type="button" onClick={() => { setActive(index); setSelected(null); }}>{item.id}</button>)}
      </nav>
      <article>
        <h4 id={questionTitleId}>{check.id} · {check.title}</h4>
        <p>{check.question}</p>
        <div className={styles.options} role="group" aria-labelledby={questionTitleId}>{check.options.map((option, index) => {
          const letter = String.fromCharCode(65 + index);
          const isSelected = selected === index;
          const isCorrectAnswer = selected !== null && index === check.correct;
          const answerState = selected === null
            ? 'unanswered'
            : isSelected && isCorrectAnswer
              ? 'selected-correct'
              : isSelected
                ? 'selected-incorrect'
                : isCorrectAnswer
                  ? 'correct'
                  : 'unselected';
          const accessibleState = answerState === 'selected-correct'
            ? '；已选择，回答正确'
            : answerState === 'selected-incorrect'
              ? '；已选择，回答错误'
              : answerState === 'correct'
                ? '；正确答案'
                : '';
          const visibleState = answerState === 'selected-correct'
            ? '已选择 · 正确'
            : answerState === 'selected-incorrect'
              ? '已选择 · 错误'
              : answerState === 'correct'
                ? '正确答案'
                : '';
          return <button
            aria-label={`${letter} · ${option}${accessibleState}`}
            aria-pressed={isSelected}
            data-answer-state={answerState}
            key={option}
            type="button"
            onClick={() => setSelected(index)}
          >
            <span>{letter} · {option}</span>
            {visibleState ? <b className={styles.optionState} aria-hidden="true">{visibleState}</b> : null}
          </button>;
        })}</div>
        {selected === null
          ? <p className={styles.answer}>先选择，再用entity、lens、origination route、as-of与evidence ceiling解释；不要只猜字母。</p>
          : <p className={styles.answer} role="status" aria-live="polite" aria-atomic="true"><b>{correct ? '正确。' : '需要修正。'}</b>你选择 {selectedLetter}；正确答案 {correctLetter}。{check.answer} <b>常见误区：</b>{check.trap} 依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>}
      </article>
    </div>
    <div className="global-banks-nojs-fallback">
      <h4>无JavaScript题册 · 请先作答</h4>
      <StaticQuestionSheet />
    </div>
    <details className={styles.static} data-answer-key-disclosure="true">
      <summary>完成后展开：十二题答案、误区与来源</summary>
      <StaticAnswerKey />
    </details>
    <div className={styles.printRecord}>
      <h3>十二题纸本题册 · 请先作答</h3>
      <StaticQuestionSheet print />
      <section className={styles.printAnswerKey}>
        <h3>十二题纸本答案册 · 完成题册后再核对</h3>
        <StaticAnswerKey print />
      </section>
    </div>
  </section>;
}
