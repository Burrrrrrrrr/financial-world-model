'use client';

import { useEffect, useState } from 'react';
import { policyAutonomyChecks } from '../lessons/policyAutonomyStudy';
import styles from './policyAutonomy.module.css';

function EvidenceLine({ sourceIds }: { sourceIds: readonly number[] }) {
  return <p className={styles.sourceLine}>依据：{sourceIds.length ? sourceIds.map(id => <a key={id} href={`#ref-${id}`}>[{id}] </a>) : '课程 evidence-state 契约（非外部政策文献）'}</p>;
}

function StaticOptions({ options }: { options: readonly string[] }) {
  return <ul className={styles.explicitOptions}>{options.map((option, index) => <li key={option}><b>{String.fromCharCode(65 + index)} ·</b> {option}</li>)}</ul>;
}

export default function PolicyAutonomyQuiz() {
  const [active, setActive] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const check = policyAutonomyChecks[active];
  const selected = answers[check.id];

  useEffect(() => {
    document.documentElement.classList.add('policy-autonomy-js');
    return () => document.documentElement.classList.remove('policy-autonomy-js');
  }, []);

  return <>
    <section className={`${styles.quiz} policy-autonomy-interactive-only`} aria-labelledby="policy-autonomy-quiz-title">
      <p className="section-kicker">INTERACTIVE CHECK · M = MEASUREMENT / K = MECHANISM</p>
      <h3 id="policy-autonomy-quiz-title">十二道检查逐题作答；选项只记录本次页面状态，不上传数据</h3>
      <div className={styles.quizNav} aria-label="切换题目">{policyAutonomyChecks.map((item, index) => <button key={item.id} type="button" aria-current={active === index ? 'true' : undefined} aria-label={`${item.id} ${item.title}${answers[item.id] === undefined ? '，未答' : answers[item.id] === item.correct ? '，已答对' : '，已作答'}`} onClick={() => setActive(index)}>{item.id}</button>)}</div>
      <p><b>{check.id} · {check.title}</b></p>
      <p>{check.question}</p>
      <div className={styles.options} role="group" aria-label={`${check.id}选项`}>{check.options.map((option, index) => <button key={option} type="button" aria-pressed={selected === index} onClick={() => setAnswers(previous => ({ ...previous, [check.id]: index }))}>{String.fromCharCode(65 + index)} · {option}</button>)}</div>
      {selected === undefined ? <p className={styles.liveStatus} role="status" aria-live="polite">选择后显示判定、解释与常见陷阱。</p> : <div className={styles.answer} role="status" aria-live="polite"><b>{selected === check.correct ? '正确' : '需要重看'} · 答案 {String.fromCharCode(65 + check.correct)}</b><span className={styles.answerChoice}>{check.options[check.correct]}</span><p>{check.answer}</p><p><b>常见陷阱：</b>{check.trap}</p><EvidenceLine sourceIds={check.sourceIds} /></div>}
      <button className={styles.reset} type="button" onClick={() => setAnswers({})}>清空十二题页面作答</button>
    </section>

    <section className="policy-autonomy-nojs-fallback" aria-labelledby="policy-autonomy-static-questions-title">
      <h3 id="policy-autonomy-static-questions-title">十二道M/K静态题册</h3>
      <ol className={styles.staticQuestions}>{policyAutonomyChecks.map(checkItem => <li key={checkItem.id}><b>{checkItem.id} · {checkItem.title}</b><p>{checkItem.question}</p><StaticOptions options={checkItem.options} /></li>)}</ol>
      <details className={styles.static}><summary>完成后展开静态答案册</summary><ol className={styles.staticAnswers}>{policyAutonomyChecks.map(checkItem => <li key={checkItem.id}><b>{checkItem.id} · {String.fromCharCode(65 + checkItem.correct)} · {checkItem.options[checkItem.correct]}</b><p>{checkItem.answer}</p><p><b>陷阱：</b>{checkItem.trap}</p><EvidenceLine sourceIds={checkItem.sourceIds} /></li>)}</ol></details>
    </section>

    <section className={`${styles.printRecord} policy-autonomy-print-record`} aria-hidden="true">
      <h3>十二道M/K题册</h3>
      <ol className={styles.staticQuestions}>{policyAutonomyChecks.map(checkItem => <li key={checkItem.id}><b>{checkItem.id} · {checkItem.title}</b><p>{checkItem.question}</p><StaticOptions options={checkItem.options} /></li>)}</ol>
      <h3>答案与边界</h3>
      <ol className={styles.staticAnswers}>{policyAutonomyChecks.map(checkItem => <li key={checkItem.id}><b>{checkItem.id} · {String.fromCharCode(65 + checkItem.correct)} · {checkItem.options[checkItem.correct]}</b><p>{checkItem.answer} 常见陷阱：{checkItem.trap}</p></li>)}</ol>
    </section>
  </>;
}
