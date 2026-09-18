'use client';

import { useState } from 'react';
import { dollarFundingChecks } from '../lessons/dollarFundingStudy';
import styles from './dollarFunding.module.css';

function StaticQuestionSheet({ print = false }: { print?: boolean }) {
  return <div className={styles.staticQuiz} data-static-question-sheet="true" data-print-static={print ? 'true' : 'false'}>
    {dollarFundingChecks.map(check => <article key={`${print ? 'print-' : ''}${check.id}`}>
      <h4>{check.id} · {check.title}</h4>
      <p>{check.question}</p>
      <ol className={styles.staticOptions}>{check.options.map((option, index) => <li key={option}><b>{String.fromCharCode(65 + index)}.</b> {option}</li>)}</ol>
    </article>)}
  </div>;
}

function StaticAnswerKey({ print = false }: { print?: boolean }) {
  return <div className={`${styles.staticQuiz} ${styles.answerKey}`} data-static-answer-key="true" data-print-answer-key={print ? 'true' : 'false'}>
    {dollarFundingChecks.map(check => <article key={`${print ? 'print-answer-' : 'answer-'}${check.id}`}>
      <h4>{check.id} 答案 · {String.fromCharCode(65 + check.correct)}</h4>
      <p><b>答案：</b>{String.fromCharCode(65 + check.correct)}。{check.answer}</p>
      <p><b>误区：</b>{check.trap}</p>
      <p className={styles.sourceLine}>依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>
    </article>)}
  </div>;
}

export default function DollarFundingQuiz() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const check = dollarFundingChecks[active];
  const answer = selected === null ? null : selected === check.correct;

  return <section className={styles.quiz} aria-labelledby="dollar-funding-quiz-title">
    <span className="section-kicker">TWELVE M/K CHECKS · INTERACTIVE + STATIC TWINS</span>
    <h3 id="dollar-funding-quiz-title">十二道退出检查：先辨对象与因果，再做现金腿和准入判断。</h3>
    <p>互动版只保存当前题的临时选择；切题会清空答案。无JavaScript与纸本先给完整题册，答案放在后续独立答案册；屏幕答案册默认关闭，先完成检索再核对。</p>
    <div className="dollar-funding-interactive-only">
      <nav className={styles.quizNav} aria-label="十二道美元融资理解检查">
        {dollarFundingChecks.map((item, index) => <button aria-current={active === index ? 'true' : undefined} key={item.id} type="button" onClick={() => { setActive(index); setSelected(null); }}>{item.id}</button>)}
      </nav>
      <article aria-live="polite">
        <h4>{check.id} · {check.title}</h4>
        <p>{check.question}</p>
        <div className={styles.options}>{check.options.map((option, index) => <button key={option} type="button" onClick={() => setSelected(index)}>{String.fromCharCode(65 + index)} · {option}</button>)}</div>
        {selected === null ? <p className={styles.answer}>先选择，再用entity、H、cash leg、route gate和证据边界解释；不要只猜字母。</p> : <p className={styles.answer}><b>{answer ? '正确。' : '需要修正。'}</b>{check.answer} <b>常见误区：</b>{check.trap} 依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>}
      </article>
    </div>
    <div className="dollar-funding-nojs-fallback">
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
