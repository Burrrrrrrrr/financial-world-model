'use client';

import { useEffect, useState } from 'react';
import { emCapitalFlowChecks } from '../lessons/emCapitalFlowStudy';
import styles from './globalCycle.module.css';

function StaticQuestionSheet({ print = false }: { print?: boolean }) {
  return <ol className={print ? styles.printQuestions : styles.staticQuestions}>{emCapitalFlowChecks.map(check => <li key={check.id}><p><b>{check.id} · {check.title}：</b>{check.question}</p><ol type="A">{check.options.map(option => <li key={option}>{option}</li>)}</ol></li>)}</ol>;
}

function StaticAnswerKey({ print = false }: { print?: boolean }) {
  return <ol className={print ? styles.printAnswers : styles.staticAnswers}>{emCapitalFlowChecks.map(check => <li key={check.id}><p><b>{check.id} · {String.fromCharCode(65 + check.correct)}：</b>{check.options[check.correct]}。{check.answer} <b>常见误区：</b>{check.trap} 依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p></li>)}</ol>;
}

export default function EmCapitalFlowQuiz() {
  const [active, setActive] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  useEffect(() => {
    document.documentElement.classList.add('em-flow-js');
    return () => document.documentElement.classList.remove('em-flow-js');
  }, []);
  const check = emCapitalFlowChecks[active];
  const correct = selected === check.correct;
  const selectedLabel = selected === null ? null : `${String.fromCharCode(65 + selected)} · ${check.options[selected]}`;
  const correctLabel = `${String.fromCharCode(65 + check.correct)} · ${check.options[check.correct]}`;
  return <section className={styles.quiz} aria-labelledby="em-flow-quiz-title">
    <span className="section-kicker">TWELVE M/K CHECKS · OBJECT BEFORE STORY</span>
    <h3 id="em-flow-quiz-title">十二道退出检查：先辨居民、方向、工具和时钟，再谈驱动、危机与政策。</h3>
    <p>互动版一次显示一题；切题会清空选择。无JavaScript与纸本保留完整题册，答案置于独立答案册。正确字母不是终点：你还应能指出其余选项越过了哪一条测量、因果或政策边界。</p>
    <div className="em-flow-interactive-only">
      <nav className={styles.quizNav} aria-label="十二道新兴市场资本流理解检查">{emCapitalFlowChecks.map((item, index) => <button aria-current={active === index ? 'true' : undefined} key={item.id} type="button" onClick={() => { setActive(index); setSelected(null); }}>{item.id}</button>)}</nav>
      <article aria-live="polite">
        <h4>{check.id} · {check.title}</h4>
        <p>{check.question}</p>
        <div className={styles.options} role="group" aria-label={`${check.id}选项`}>{check.options.map((option, index) => <button aria-pressed={selected === index} className={selected === index ? styles.optionSelected : undefined} key={option} type="button" onClick={() => setSelected(index)}>{String.fromCharCode(65 + index)} · {option}</button>)}</div>
        {selected === null ? <p className={styles.answer}>先选择，再用对象护照、两条gross leg、合约属性、现金时钟和证据等级解释。</p> : <p className={styles.answer}><b>{correct ? '正确。' : '需要修正。'}</b><span className={styles.answerChoice}>你选择：{selectedLabel}。正确答案：{correctLabel}。</span>{check.answer} <b>常见误区：</b>{check.trap} 依据：{check.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}</p>}
      </article>
      <button className={styles.reset} type="button" onClick={() => { setActive(0); setSelected(null); }}>重置题目与选择</button>
    </div>
    <div className="em-flow-nojs-fallback"><h4>无JavaScript题册 · 请先作答</h4><StaticQuestionSheet /></div>
    <details className={styles.static} data-answer-key-disclosure="true"><summary>完成后展开：十二题答案、误区与来源</summary><StaticAnswerKey /></details>
    <div className={styles.printRecord}><h3>十二题纸本题册 · 请先作答</h3><StaticQuestionSheet print /><section><h3>十二题纸本答案册 · 完成题册后再核对</h3><StaticAnswerKey print /></section></div>
  </section>;
}
