'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  endogenousDynamicsModes,
  endogenousDynamicsScenarios,
  type EndogenousDynamicsChoice,
  type EndogenousDynamicsMode,
  type EndogenousDynamicsScenario,
} from './endogenousDynamicsScenarios';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = {
  choice?: EndogenousDynamicsChoice;
  confidence?: Confidence;
  firstChoice?: EndogenousDynamicsChoice;
  firstConfidence?: Confidence;
  submissions?: number;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:2.21-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};
const validChoices = new Set<EndogenousDynamicsChoice>(['a', 'b', 'c']);
const validConfidence = new Set<Confidence>(['low', 'medium', 'high']);
const scenarioIds = new Set(endogenousDynamicsScenarios.map((scenario) => scenario.id));
const sequence = endogenousDynamicsScenarios;

function validatedAttempts(value: unknown): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as { schema?: unknown; attempts?: unknown };
  if (source.schema !== 1 || !source.attempts || typeof source.attempts !== 'object' || Array.isArray(source.attempts)) return null;
  const result: Record<string, AttemptState> = {};
  let droppedInvalid = false;
  Object.entries(source.attempts as Record<string, unknown>).forEach(([id, raw]) => {
    if (!scenarioIds.has(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) { droppedInvalid = true; return; }
    const item = raw as Record<string, unknown>;
    const choice = item.choice as EndogenousDynamicsChoice | undefined;
    const confidence = item.confidence as Confidence | undefined;
    const firstChoice = item.firstChoice as EndogenousDynamicsChoice;
    const firstConfidence = item.firstConfidence as Confidence;
    const submissions = item.submissions;
    const revealed = item.revealed;
    const currentSelectionInvalid = revealed === true
      ? !validChoices.has(choice as EndogenousDynamicsChoice) || !validConfidence.has(confidence as Confidence)
      : (choice !== undefined && !validChoices.has(choice)) || (confidence !== undefined && !validConfidence.has(confidence));
    const hasAnyHistory = firstChoice !== undefined || firstConfidence !== undefined || submissions !== undefined;
    const hasCompleteHistory = validChoices.has(firstChoice) && validConfidence.has(firstConfidence)
      && Number.isInteger(submissions) && (submissions as number) >= 1 && (submissions as number) <= 100;
    if (typeof revealed !== 'boolean' || currentSelectionInvalid ||
      (hasAnyHistory && !hasCompleteHistory) ||
      (revealed === true && !hasCompleteHistory)) {
      droppedInvalid = true;
      return;
    }
    result[id] = {
      choice,
      confidence,
      firstChoice,
      firstConfidence,
      submissions: submissions as number | undefined,
      revealed,
    };
  });
  return { attempts: result, droppedInvalid };
}

function taskStatus(scenario: EndogenousDynamicsScenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return '未提交';
  return attempt.choice === scenario.correct ? '已答对' : '已提交，待重做';
}

function ScenarioFacts({ scenario }: { scenario: EndogenousDynamicsScenario }) {
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

function SourceLinks({ ids }: { ids: number[] }) {
  return (
    <p className="impact-source-links"><b>本题依据：</b>{' '}
      {ids.map((sourceId) => <a aria-label={'参考文献 ' + sourceId} className="citation-mark" href={'#ref-' + sourceId} key={sourceId}>[{sourceId}]</a>)}
    </p>
  );
}

const confidenceLabels: { id: Confidence; label: string }[] = [
  { id: 'low', label: '低：主要靠猜' },
  { id: 'medium', label: '中：能解释一部分' },
  { id: 'high', label: '高：能逐步复算' },
];

export default function EndogenousDynamicsLab() {
  const [mode, setMode] = useState<EndogenousDynamicsMode>('engine');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [storageState, setStorageState] = useState<'loading' | 'saved' | 'session'>('loading');
  const [announcement, setAnnouncement] = useState('');
  const [recoveryNotice, setRecoveryNotice] = useState('');
  const [resetArmed, setResetArmed] = useState(false);
  const labTitleRef = useRef<HTMLHeadingElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const prepareResetRef = useRef<HTMLButtonElement>(null);
  const confirmResetRef = useRef<HTMLButtonElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | 'result' | 'reset-confirm' | 'reset-prepare' | 'title' | null>(null);
  const resultTitleId = useId();
  const scenarios = endogenousDynamicsScenarios.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const { choice, confidence, revealed } = attempt;
  const restoring = storageState === 'loading';
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = revealed && choice === scenario.correct;
  const nextUnsubmitted = sequence.find((item) => !attempts[item.id]?.revealed);
  const submittedCount = sequence.filter((item) => attempts[item.id]?.revealed).length;
  const correctCount = sequence.filter((item) => attempts[item.id]?.revealed && attempts[item.id]?.choice === item.correct).length;

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
          else { restored = validated.attempts; recoveredCorruption = validated.droppedInvalid; }
        }
        if (recoveredCorruption) window.localStorage.removeItem(STORAGE_KEY);
      }
      queueMicrotask(() => {
        if (cancelled) return;
        setAttempts(restored);
        setStorageState('saved');
        if (recoveredCorruption) {
          setRecoveryNotice('系统已移除无法验证的内容；其余通过校验的作答记录已保留。如无可验证记录，本节将从头开始，并继续自动保存。');
        }
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
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, attempts })); }
    catch {
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

  function navigate(nextMode: EndogenousDynamicsMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocusRef.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
    setResetArmed(false);
  }

  function choose(nextChoice: EndogenousDynamicsChoice) {
    setAttempts((current) => ({ ...current, [scenario.id]: { ...current[scenario.id], choice: nextChoice, revealed: false } }));
    setCompleted(false);
    setResetArmed(false);
  }

  function chooseConfidence(nextConfidence: Confidence) {
    setAttempts((current) => ({ ...current, [scenario.id]: { ...current[scenario.id], confidence: nextConfidence, revealed: false } }));
  }

  function submit() {
    if (!choice || !confidence) return;
    pendingFocusRef.current = 'result';
    setAttempts((current) => {
      const old = current[scenario.id] ?? {};
      return {
        ...current,
        [scenario.id]: {
          ...old,
          choice,
          confidence,
          firstChoice: old.firstChoice ?? choice,
          firstConfidence: old.firstConfidence ?? confidence,
          submissions: (old.submissions ?? 0) + 1,
          revealed: true,
        },
      };
    });
  }

  function retryCurrent() {
    setAttempts((current) => ({
      ...current,
      [scenario.id]: { ...current[scenario.id], choice: undefined, confidence: undefined, revealed: false },
    }));
    setAnnouncement('当前选择已清除；首次选择、首次置信度与提交次数仍保留。');
    pendingFocusRef.current = 'option';
    setCompleted(false);
  }

  function goToNextUnsubmitted() {
    if (nextUnsubmitted) {
      const modeScenarios = endogenousDynamicsScenarios.filter((item) => item.mode === nextUnsubmitted.mode);
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
    setMode('engine');
    setScenarioIndex(0);
    setResetArmed(false);
    setRecoveryNotice('');
    setAnnouncement('十道题的作答记录已重置。');
    try { window.localStorage.removeItem(STORAGE_KEY); }
    catch {
      setStorageState('session');
      setAnnouncement('十道题已重置；无法保存，当前会话仍可作答。');
    }
  }

  const globalQuestionNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;

  return (
    <div aria-busy={restoring} className="impact-lab endogenous-dynamics-lab">
      <div className="impact-lab-head">
        <div><span>ENDOGENOUS DYNAMICS · CLOSED-LOOP LAB</span><h3 ref={labTitleRef} tabIndex={-1}>把目标、约束、成交、财富和策略构成按真实时序闭合</h3></div>
        <p>前五题核算动态账本，后五题审计守恒、固定点、信息时钟、非线性聚合与稳定性边界。每次提交还记录置信度，用来区分“答对”与“能解释为什么”。</p>
      </div>
      <noscript><div className="precision-note"><span>互动实验当前不可用</span><p>此实验需要浏览器运行 JavaScript；你仍可前往 <a href="#active-practice">主动练习</a>，完成同构的十道静态孪生题并核对答案。</p></div></noscript>
      <p aria-atomic="true" className="impact-lab-progress" role="status">全局进度：已提交 {submittedCount}/{sequence.length} · 当前正确 {correctCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录校验完成</span><p>{recoveryNotice}</p></div> : null}

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {endogenousDynamicsModes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} disabled={restoring} key={item.id} onClick={() => navigate(item.id, 0)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={(mode === 'engine' ? '闭环账本' : '证据边界') + '题目导航'}>
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
          <p>诊断顺序：第 1–3 题检查单位、守恒和财富账；第 4 题检查 n 与 ω；第 5 题只完成第一轮 margin feedback；第 6–10 题依次检查外部承接、动态稳定、publicAt、非线性聚合与局部外推。高置信但答错的题应优先重做。</p>
          <div>
            <button className="impact-secondary" onClick={() => navigate('engine', 0)} type="button">回到第 1 题</button>
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
                <input checked={choice === option.id} name={'endogenous-dynamics-' + scenario.id} onChange={() => choose(option.id)} ref={optionIndex === 0 ? firstOptionRef : undefined} type="radio" value={option.id} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          <fieldset className="impact-choice-fieldset" disabled={restoring || revealed}>
            <legend>提交前记录置信度</legend>
            {confidenceLabels.map((item) => (
              <label className={confidence === item.id ? 'selected' : ''} key={item.id}>
                <input checked={confidence === item.id} name={'endogenous-confidence-' + scenario.id} onChange={() => chooseConfidence(item.id)} type="radio" value={item.id} />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>
          {!revealed ? (
            <button className="impact-primary" disabled={restoring || !choice || !confidence} onClick={submit} type="button">提交答案、置信度并查看诊断</button>
          ) : (
            <div className={correct ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
              <b id={resultTitleId}>{correct ? '回答正确' : '回答错误，可根据诊断重做'}</b>
              <p>{selected?.diagnosis}</p>
              <output className="impact-calculation">{scenario.calculation}</output>
              <strong>{scenario.reveal}</strong>
              <p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find((item) => item.id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p>
              <p><b>复习入口：</b>{scenario.revisit}</p>
              <SourceLinks ids={scenario.sourceIds} />
              <div>
                {!correct ? <button className="impact-secondary" onClick={retryCurrent} type="button">保留首次记录并重做</button> : <span aria-hidden="true" />}
                <button className="impact-secondary" onClick={goToNextUnsubmitted} type="button">{nextUnsubmitted ? '前往下一道未提交题' : '查看完成诊断'}</button>
              </div>
            </div>
          )}
        </>
      )}
      <p className="impact-lab-caveat"><b>模型与数据边界：</b>题内参数、时钟、成交假设与局部冲击系数只为唯一判分而冻结，不是实盘估计、投资建议或稳定性保证。记录只保存在本设备、本浏览器和当前题库版本，不会上传；清理浏览器数据会丢失。</p>
    </div>
  );
}
