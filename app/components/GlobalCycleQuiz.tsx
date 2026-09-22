'use client';

import { useState } from 'react';
import { globalCycleChecks } from '../lessons/globalCycleStudy';
import styles from './globalCycle.module.css';

function StaticQuestionSheet({ print = false }: { print?: boolean }) {
  return <div className={styles.staticQuiz} data-static-question-sheet="true" data-print-static={print ? 'true' : 'false'}>
    {globalCycleChecks.map(check => <article key={`${print ? 'print-' : ''}${check.id}`}>
      <h4>{check.id} · {check.title}</h4>
      <p>{check.question}</p>
      <ol className={styles.staticOptions}>{check.options.map((option, index) => <li key={option}><b>{String.fromCharCode(65 + index)}.</b> {option}</li>)}</ol>
    </article>)}
  </div>;
}

function StaticAnswerKey({ print = false }: { print?: boolean }) {
  return <div className={`${styles.staticQuiz} ${styles.answerKey}`} data-static-answer-key="true" data-print-answer-key={print ? 'true' : 'false'}>
    {globalCycleChecks.map(check => <article key={`${print ? 'print-answer-' : 'answer-'}${check.id}`}>
      <h4>{check.id} 答案 · {String.fromCharCode(65 + check.correct)}</h4>
      <p><b>答案：</b>{String.fromCharCode(65 + check.correct)}。{check.answer}</p>
      <p><b>误区：</b>{check.trap}</p>
      <p className={styles.sourceLine}>依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>
    </article>)}
  </div>;
}

export default function GlobalCycleQuiz() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const check = globalCycleChecks[active];
  const correct = selected === check.correct;
  const selectedLabel = selected === null ? null : `${String.fromCharCode(65 + selected)} · ${check.options[selected]}`;
  const correctLabel = `${String.fromCharCode(65 + check.correct)} · ${check.options[check.correct]}`;
  return <section className={styles.quiz} aria-labelledby="global-cycle-quiz-title">
    <span className="section-kicker">TWELVE M/K CHECKS · MEASUREMENT BEFORE CAUSALITY</span>
    <h3 id="global-cycle-quiz-title">十二道退出检查：先辨对象与证据等级，再计算因子、暴露和资本流。</h3>
    <p>互动版一次显示一题；切题会清空选择。无JavaScript与纸本先给完整题册，答案放在后续独立答案册。正确字母不是终点，必须能解释为什么其他选项越过了测量、因果或接口边界。</p>
    <div className="global-cycle-interactive-only">
      <nav className={styles.quizNav} aria-label="十二道全球金融周期理解检查">
        {globalCycleChecks.map((item, index) => <button aria-current={active === index ? 'true' : undefined} key={item.id} type="button" onClick={() => { setActive(index); setSelected(null); }}>{item.id}</button>)}
      </nav>
      <article aria-live="polite">
        <h4>{check.id} · {check.title}</h4>
        <p>{check.question}</p>
        <div className={styles.options} role="group" aria-label={`${check.id}选项`}>{check.options.map((option, index) => <button aria-pressed={selected === index} className={selected === index ? styles.optionSelected : undefined} key={option} type="button" onClick={() => setSelected(index)}>{String.fromCharCode(65 + index)} · {option}</button>)}</div>
        {selected === null ? <p className={styles.answer}>先选择，再用对象、时钟、面板、证据轴和反例解释；不要只猜字母。</p> : <p className={styles.answer}><b>{correct ? '正确。' : '需要修正。'}</b><span className={styles.answerChoice}>你选择：{selectedLabel}。正确答案：{correctLabel}。</span>{check.answer} <b>常见误区：</b>{check.trap} 依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>}
      </article>
    </div>
    <div className="global-cycle-nojs-fallback"><h4>无JavaScript题册 · 请先作答</h4><StaticQuestionSheet /></div>
    <details className={styles.static} data-answer-key-disclosure="true"><summary>完成后展开：十二题答案、误区与来源</summary><StaticAnswerKey /></details>
    <div className={styles.printRecord}>
      <h3>十二题纸本题册 · 请先作答</h3><StaticQuestionSheet print />
      <section><h3>十二题纸本答案册 · 完成题册后再核对</h3><StaticAnswerKey print /></section>
    </div>
  </section>;
}
