'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  benchmarkModes,
  benchmarkScenarios,
  type BenchmarkChoice,
  type BenchmarkMode,
  type BenchmarkScenario,
} from './benchmarkScenarios';

type AttemptState = { choice?: BenchmarkChoice; revealed?: boolean };

const STORAGE_KEY = 'market-world-model:2.18-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};
const validChoices = new Set<BenchmarkChoice>(['a', 'b', 'c']);
const scenarioIds = new Set(benchmarkScenarios.map((scenario) => scenario.id));
const sequence = benchmarkScenarios;

function validatedAttempts(value: unknown): Record<string, AttemptState> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as { schema?: unknown; attempts?: unknown };
  if (source.schema !== 1 || !source.attempts || typeof source.attempts !== 'object' || Array.isArray(source.attempts)) return null;
  const result: Record<string, AttemptState> = {};
  Object.entries(source.attempts as Record<string, unknown>).forEach(([id, raw]) => {
    if (!scenarioIds.has(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) return;
    const attempt = raw as { choice?: unknown; revealed?: unknown };
    if (!validChoices.has(attempt.choice as BenchmarkChoice) || typeof attempt.revealed !== 'boolean') return;
    result[id] = { choice: attempt.choice as BenchmarkChoice, revealed: attempt.revealed };
  });
  return result;
}

function taskStatus(scenario: BenchmarkScenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return '未提交';
  return attempt.choice === scenario.correct ? '已答对' : '已提交，待重做';
}

function ScenarioFacts({ scenario }: { scenario: BenchmarkScenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目冻结参数">
      {scenario.facts.map((fact) => (
        <article key={scenario.id + ':' + fact.label + ':' + fact.value}>
          <span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function BenchmarkLab() {
  const [mode, setMode] = useState<BenchmarkMode>('ledger');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [storageState, setStorageState] = useState<'loading' | 'saved' | 'session'>('loading');
  const [announcement, setAnnouncement] = useState('');
  const [resetArmed, setResetArmed] = useState(false);
  const labTitleRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const prepareResetRef = useRef<HTMLButtonElement>(null);
  const confirmResetRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | 'result' | 'reset-confirm' | 'reset-prepare' | 'title' | null>(null);
  const resultTitleId = useId();
  const scenarios = benchmarkScenarios.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const { choice, revealed } = attempt;
  const restoring = storageState === 'loading';
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = revealed && choice === scenario.correct;
  const nextUnsubmitted = sequence.find((item) => !attempts[item.id]?.revealed);
  const submittedCount = sequence.filter((item) => attempts[item.id]?.revealed).length;
  const correctCount = sequence.filter((item) => {
    const itemAttempt = attempts[item.id];
    return itemAttempt?.revealed && itemAttempt.choice === item.correct;
  }).length;

  useEffect(() => {
    let cancelled = false;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      let restored: Record<string, AttemptState> = {};
      let recoveredCorruption = false;
      if (stored) {
        let parsed: unknown = null;
        try { parsed = JSON.parse(stored); } catch { recoveredCorruption = true; }
        if (!recoveredCorruption) {
          const validated = validatedAttempts(parsed);
          if (validated === null) recoveredCorruption = true;
          else restored = validated;
        }
        if (recoveredCorruption) window.localStorage.removeItem(STORAGE_KEY);
      }
      queueMicrotask(() => {
        if (cancelled) return;
        setAttempts(restored);
        setStorageState('saved');
        if (recoveredCorruption) setAnnouncement('已清除损坏的本设备记录，可以重新作答并继续自动保存。');
      });
    } catch {
      queueMicrotask(() => {
        if (cancelled) return;
        setStorageState('session');
        setAnnouncement('无法保存，当前会话仍可作答。');
      });
    }
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (storageState !== 'saved') return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, attempts }));
    } catch {
      queueMicrotask(() => {
        setStorageState('session');
        setAnnouncement('无法保存，当前会话仍可作答。');
      });
    }
  }, [attempts, storageState]);

  useEffect(() => {
    const pending = pendingFocusRef.current;
    if (!pending) return;
    pendingFocusRef.current = null;
    if (pending === 'question') questionRef.current?.focus();
    if (pending === 'option') firstOptionRef.current?.focus();
    if (pending === 'result') resultRef.current?.focus();
    if (pending === 'reset-confirm') confirmResetRef.current?.focus();
    if (pending === 'reset-prepare') prepareResetRef.current?.focus();
    if (pending === 'title') labTitleRef.current?.focus();
  }, [scenario.id, revealed, completed, resetArmed]);

  function navigate(nextMode: BenchmarkMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocusRef.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
    setResetArmed(false);
  }

  function choose(nextChoice: BenchmarkChoice) {
    setAttempts((current) => ({ ...current, [scenario.id]: { choice: nextChoice, revealed: false } }));
    setCompleted(false);
    setResetArmed(false);
  }

  function submit() {
    if (!choice) return;
    pendingFocusRef.current = 'result';
    setAttempts((current) => ({ ...current, [scenario.id]: { choice, revealed: true } }));
  }

  function retryCurrent() {
    setAttempts((current) => {
      const next = { ...current };
      delete next[scenario.id];
      return next;
    });
    setAnnouncement('当前题已清除，可以重新作答。');
    pendingFocusRef.current = 'option';
    setCompleted(false);
  }

  function goToNextUnsubmitted() {
    if (nextUnsubmitted) {
      const modeScenarios = benchmarkScenarios.filter((item) => item.mode === nextUnsubmitted.mode);
      navigate(nextUnsubmitted.mode, modeScenarios.findIndex((item) => item.id === nextUnsubmitted.id));
      return;
    }
    pendingFocusRef.current = 'result';
    setCompleted(true);
  }

  function requestReset() {
    pendingFocusRef.current = 'reset-confirm';
    setResetArmed(true);
    setAnnouncement('重置尚未执行。再次选择确认重置，才会清除本节十道题的本设备记录。');
  }

  function cancelReset() {
    pendingFocusRef.current = 'reset-prepare';
    setResetArmed(false);
    setAnnouncement('已取消重置，原作答记录保留。');
  }

  function resetAll() {
    pendingFocusRef.current = 'title';
    setAttempts({});
    setCompleted(false);
    setMode('ledger');
    setScenarioIndex(0);
    setResetArmed(false);
    setAnnouncement('十道题的作答记录已重置。');
    try { window.localStorage.removeItem(STORAGE_KEY); } catch {
      setStorageState('session');
      setAnnouncement('十道题已重置；无法保存，当前会话仍可作答。');
    }
  }

  const globalQuestionNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;

  return (
    <div aria-busy={restoring} className="impact-lab benchmark-lab">
      <div className="impact-lab-head">
        <div><span>BENCHMARK, ACTIVE RISK &amp; EVIDENCE LAB</span><h3 ref={labTitleRef} tabIndex={-1}>从比较坐标到真实持仓、相对风险与证据边界</h3></div>
        <p>十题都冻结 benchmark role、return basis、weight universe、频率与风险模型。前五题核算相对状态，后五题判断指标、授权、目标与成交各能支持到哪一层结论。客户端包含答案，不作为防作弊考试。</p>
      </div>
      <noscript>
        <div className="precision-note"><span>互动实验当前不可用</span><p>此实验需要浏览器运行 JavaScript；你仍可前往 <a href="#active-practice">主动练习</a> 与 <a href="#checks-glossary">理解检查</a>，使用同一数据源生成的静态题和完整答案。</p></div>
      </noscript>
      <p aria-atomic="true" className="impact-lab-progress" role="status">全局进度：已提交 {submittedCount}/{sequence.length} · 当前正确 {correctCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {benchmarkModes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} disabled={restoring} key={item.id} onClick={() => navigate(item.id, 0)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={(mode === 'ledger' ? '相对状态账本' : '机制与证据推断') + '题目导航'}>
        {scenarios.map((item, index) => {
          const number = sequence.findIndex((entry) => entry.id === item.id) + 1;
          return (
            <button aria-current={!completed && scenarioIndex === index ? 'step' : undefined} aria-label={'第 ' + number + ' 题，' + item.title + '，' + taskStatus(item, attempts[item.id])} aria-pressed={!completed && scenarioIndex === index} disabled={restoring} key={item.id} onClick={() => navigate(mode, index)} type="button">
              <span>{String(number).padStart(2, '0')}</span>{attempts[item.id]?.revealed ? (attempts[item.id]?.choice === item.correct ? '正确' : '待重做') : '未提交'}
            </button>
          );
        })}
      </div>

      {completed ? (
        <div className="impact-result" ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{sequence.length} 题已提交：{correctCount}/{sequence.length} 正确</b>
          <p>复习路径：第1题冻结 policy benchmark；第2题分开 target/order/fill；第3题区分中心和离散；第4题把协方差放回 TE；第5题分开 AS 与 IR；第6–8题识别指标与层级边界；第9题使用证据阶梯；第10题坚持 actual holding 是当前风险主账本。</p>
          <div>
            <button className="impact-secondary" onClick={() => navigate('ledger', 0)} type="button">回到第 1 题</button>
            {!resetArmed ? <button className="impact-secondary" onClick={requestReset} ref={prepareResetRef} type="button">准备重置全部作答</button> : <>
              <button className="impact-secondary" onClick={resetAll} ref={confirmResetRef} type="button">确认重置本节十题</button>
              <button className="impact-secondary" onClick={cancelReset} type="button">取消重置</button>
            </>}
          </div>
        </div>
      ) : (
        <>
          <div className="impact-question">
            <span>{scenario.label} · 全局第 {globalQuestionNumber}/{sequence.length} 题</span>
            <h3 ref={questionRef} tabIndex={-1}>{scenario.title}</h3>
            <p>{scenario.brief}</p>
          </div>
          <ScenarioFacts scenario={scenario} />
          <fieldset className="impact-choice-fieldset" disabled={restoring || revealed}>
            <legend className="sr-only">第 {globalQuestionNumber} 题：{scenario.title}，请选择一个答案</legend>
            {scenario.options.map((option, optionIndex) => (
              <label className={choice === option.id ? 'selected' : ''} key={option.id}>
                <input checked={choice === option.id} name={'benchmark-' + scenario.id} onChange={() => choose(option.id)} ref={optionIndex === 0 ? firstOptionRef : undefined} type="radio" value={option.id} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {!revealed ? (
            <button className="impact-primary" disabled={restoring || !choice} onClick={submit} type="button">提交本题并查看诊断</button>
          ) : (
            <div className={correct ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
              <b id={resultTitleId}>{correct ? '回答正确' : '回答错误，可根据诊断重做'}</b>
              <p>{selected?.diagnosis}</p>
              <output className="impact-calculation">{scenario.calculation}</output>
              <strong>{scenario.reveal}</strong>
              <p><b>复习入口：</b>{scenario.revisit}</p>
              <div>
                {!correct ? <button className="impact-secondary" onClick={retryCurrent} type="button">清除本题并重做</button> : <span aria-hidden="true" />}
                <button className="impact-secondary" onClick={goToNextUnsubmitted} type="button">{nextUnsubmitted ? '前往下一道未提交题' : '查看完成诊断'}</button>
              </div>
            </div>
          )}
        </>
      )}
      <p className="impact-lab-caveat"><b>模型与制度边界：</b>全部权重、收益、协方差、阈值、订单和成交都是为唯一答案冻结的教学参数，不代表任何基金、指数、风险模型或法域的现行标准。题目不是投资、监管或法律建议；记录只保存在本设备、本浏览器和当前题库版本，不会上传，清理浏览器数据会丢失。</p>
    </div>
  );
}
