'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  laborMarketScenarios,
  laborModes,
  type LaborChoice,
  type LaborMode,
  type LaborScenario,
} from './laborMarketScenarios';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = {
  choice?: LaborChoice;
  confidence?: Confidence;
  firstChoice?: LaborChoice;
  firstConfidence?: Confidence;
  submissions?: number;
  revealed: boolean;
};

// Keep the key stable across editorial revisions while schema 1 remains compatible,
// so a reader's earlier in-progress answers can be normalized instead of abandoned.
const STORAGE_KEY = 'market-world-model:3.03-lab-r1';
const EMPTY_ATTEMPT: AttemptState = { revealed: false };
const validChoices = new Set<LaborChoice>(['a', 'b', 'c']);
const validConfidence = new Set<Confidence>(['low', 'medium', 'high']);
const scenarioIds = new Set(laborMarketScenarios.map((scenario) => scenario.id));
const sequence = laborMarketScenarios;

function validateStored(value: unknown): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as { schema?: unknown; attempts?: unknown };
  if (source.schema !== 1 || !source.attempts || typeof source.attempts !== 'object' || Array.isArray(source.attempts)) return null;

  const result: Record<string, AttemptState> = {};
  let droppedInvalid = false;
  Object.entries(source.attempts as Record<string, unknown>).forEach(([id, raw]) => {
    if (!scenarioIds.has(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) {
      droppedInvalid = true;
      return;
    }

    const item = raw as Record<string, unknown>;
    const choice = item.choice as LaborChoice | undefined;
    const confidence = item.confidence as Confidence | undefined;
    const firstChoice = item.firstChoice as LaborChoice | undefined;
    const firstConfidence = item.firstConfidence as Confidence | undefined;
    const submissions = item.submissions;
    const storedRevealed = item.revealed;
    const revealed = storedRevealed === undefined ? false : storedRevealed;
    const currentInvalid = revealed === true
      ? !validChoices.has(choice as LaborChoice) || !validConfidence.has(confidence as Confidence)
      : (choice !== undefined && !validChoices.has(choice)) || (confidence !== undefined && !validConfidence.has(confidence));
    const hasHistory = firstChoice !== undefined || firstConfidence !== undefined || submissions !== undefined;
    const completeHistory = validChoices.has(firstChoice as LaborChoice)
      && validConfidence.has(firstConfidence as Confidence)
      && Number.isSafeInteger(submissions)
      && (submissions as number) >= 1;

    if (typeof revealed !== 'boolean' || currentInvalid || (hasHistory && !completeHistory) || (revealed && !completeHistory)) {
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

function statusOf(scenario: LaborScenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return '未提交';
  return attempt.choice === scenario.correct ? '已答对' : '待重做';
}

function SourceLinks({ ids }: { ids: number[] }) {
  return (
    <p className="impact-source-links"><b>本题依据：</b>{' '}
      {ids.map((id) => <a aria-label={'参考文献 ' + id} className="citation-mark" href={'#ref-' + id} key={id}>[{id}]</a>)}
    </p>
  );
}

const confidenceLabels: { id: Confidence; label: string }[] = [
  { id: 'low', label: '低：主要靠猜' },
  { id: 'medium', label: '中：能解释一部分' },
  { id: 'high', label: '高：能逐步复算' },
];

export default function LaborMarketLab() {
  const [mode, setMode] = useState<LaborMode>('measurement');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [storageState, setStorageState] = useState<'loading' | 'saved' | 'session'>('loading');
  const [announcement, setAnnouncement] = useState('');
  const [recoveryNotice, setRecoveryNotice] = useState('');
  const [completed, setCompleted] = useState(false);
  const [resetArmed, setResetArmed] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const confirmResetRef = useRef<HTMLButtonElement>(null);
  const requestResetRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<'title' | 'question' | 'option' | 'result' | 'reset' | 'reset-request' | null>(null);
  const resultTitleId = useId();

  const scenarios = laborMarketScenarios.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const selected = scenario.options.find((option) => option.id === attempt.choice);
  const isCorrect = attempt.revealed && attempt.choice === scenario.correct;
  const nextUnsubmitted = sequence.find((item) => !attempts[item.id]?.revealed);
  const submittedCount = sequence.filter((item) => attempts[item.id]?.revealed).length;
  const correctCount = sequence.filter((item) => attempts[item.id]?.revealed && attempts[item.id]?.choice === item.correct).length;
  const globalNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;
  const loading = storageState === 'loading';

  useEffect(() => {
    let cancelled = false;
    let restored: Record<string, AttemptState> = {};
    let recovered = false;
    let canPersist = true;

    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        let parsed: unknown;
        try { parsed = JSON.parse(stored); }
        catch { recovered = true; }

        if (!recovered) {
          const validated = validateStored(parsed);
          if (validated === null) recovered = true;
          else {
            restored = validated.attempts;
            recovered = validated.droppedInvalid;
          }
        }

        if (recovered) {
          try { window.localStorage.removeItem(STORAGE_KEY); }
          catch { canPersist = false; }
        }
      }
    } catch {
      canPersist = false;
    }

    queueMicrotask(() => {
      if (cancelled) return;
      setAttempts(restored);
      setStorageState(canPersist ? 'saved' : 'session');
      if (recovered) {
        setRecoveryNotice('无法验证的本地内容已丢弃；通过校验的作答已恢复。若浏览器允许保存，系统会立即写回清理后的记录。');
      }
      if (!canPersist) setAnnouncement('浏览器拒绝本地保存；当前会话仍可完整作答，但刷新、关闭页面或浏览器异常退出可能丢失最新进度。');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (storageState !== 'saved') return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, attempts })); }
    catch {
      queueMicrotask(() => {
        setStorageState('session');
        setAnnouncement('浏览器拒绝本地保存；当前会话仍可完整作答，但刷新、关闭页面或浏览器异常退出可能丢失最新进度。');
      });
    }
  }, [attempts, storageState]);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === 'title') titleRef.current?.focus();
    if (target === 'question') questionRef.current?.focus();
    if (target === 'option') firstOptionRef.current?.focus();
    if (target === 'result') resultRef.current?.focus();
    if (target === 'reset') confirmResetRef.current?.focus();
    if (target === 'reset-request') requestResetRef.current?.focus();
  }, [scenario.id, attempt.revealed, completed, resetArmed]);

  function navigate(nextMode: LaborMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    if (!completed && nextMode === mode && nextIndex === scenarioIndex) return;
    pendingFocus.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
    setResetArmed(false);
  }

  function choose(choice: LaborChoice) {
    setAttempts((current) => {
      const old = current[scenario.id] ?? EMPTY_ATTEMPT;
      if (old.revealed || old.choice === choice) return current;
      return { ...current, [scenario.id]: { ...old, choice, revealed: false } };
    });
    setCompleted(false);
  }

  function chooseConfidence(confidence: Confidence) {
    setAttempts((current) => {
      const old = current[scenario.id] ?? EMPTY_ATTEMPT;
      if (old.revealed || old.confidence === confidence) return current;
      return { ...current, [scenario.id]: { ...old, confidence, revealed: false } };
    });
  }

  function submit() {
    pendingFocus.current = 'result';
    setAttempts((current) => {
      const old = current[scenario.id] ?? EMPTY_ATTEMPT;
      if (old.revealed || !old.choice || !old.confidence) return current;
      return {
        ...current,
        [scenario.id]: {
          ...old,
          firstChoice: old.firstChoice ?? old.choice,
          firstConfidence: old.firstConfidence ?? old.confidence,
          submissions: Math.min((old.submissions ?? 0) + 1, Number.MAX_SAFE_INTEGER),
          revealed: true,
        },
      };
    });
  }

  function retry() {
    setAttempts((current) => ({
      ...current,
      [scenario.id]: { ...(current[scenario.id] ?? EMPTY_ATTEMPT), choice: undefined, confidence: undefined, revealed: false },
    }));
    setAnnouncement('当前选择已清除；首次答案、首次置信度和提交次数继续保留。');
    pendingFocus.current = 'option';
  }

  function goToNext() {
    if (!nextUnsubmitted) {
      pendingFocus.current = 'result';
      setCompleted(true);
      return;
    }
    const nextModeScenarios = laborMarketScenarios.filter((item) => item.mode === nextUnsubmitted.mode);
    navigate(nextUnsubmitted.mode, nextModeScenarios.findIndex((item) => item.id === nextUnsubmitted.id));
  }

  function requestReset() {
    if (loading) return;
    pendingFocus.current = 'reset';
    setResetArmed(true);
    setAnnouncement('重置尚未执行；再次确认才会清除本实验在本设备上的记录。');
  }

  function resetAll() {
    if (loading) return;
    setAttempts({});
    setMode('measurement');
    setScenarioIndex(0);
    setCompleted(false);
    setResetArmed(false);
    setRecoveryNotice('');
    pendingFocus.current = 'title';
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setAnnouncement('十道题的本地作答记录已重置。');
    } catch {
      setStorageState('session');
      setAnnouncement('当前会话已重置，但浏览器拒绝修改本地存储；旧记录可能在刷新后重新出现。若需永久清除，请删除本站点的浏览器数据。');
    }
  }

  return (
    <div aria-busy={loading} className="impact-lab labor-market-lab">
      <div className="impact-lab-head">
        <div><span>LABOR · STATE-TO-WAGE LAB</span><h3 ref={titleRef} tabIndex={-1}>先把人、岗位和流量量对，再把匹配、合同、家庭收入与资产 surprise 接成一条可检验链</h3></div>
        <p>前五题校准 E／U／N、persons/jobs、gross flows、工资构成和 compensation；后五题复算 tightness、Beveridge shift、合同重置、家庭收入与公告 surprise。</p>
      </div>

      <noscript><div className="precision-note"><span>互动实验当前不可用</span><p>此实验需要 JavaScript；你仍可前往<a href="#labor-static-twins">十道无脚本静态孪生题</a>完成同一组机制练习。</p></div></noscript>
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录已恢复</span><p>{recoveryNotice}</p></div> : null}
      <p aria-live="polite" className="impact-lab-progress">已提交 {submittedCount}/10 · 当前答对 {correctCount}/10 · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '仅当前会话（刷新可能丢失）' : '正在恢复记录'}</p>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="选择实验模式">
        {laborModes.map((item) => (
          <button
            aria-pressed={mode === item.id}
            className={mode === item.id ? 'active' : ''}
            disabled={loading}
            key={item.id}
            onClick={() => navigate(item.id, 0)}
            type="button"
          >
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label="选择当前模式中的题目">
        {scenarios.map((item, index) => (
          <button
            aria-label={`${String(sequence.findIndex((candidate) => candidate.id === item.id) + 1).padStart(2, '0')} ${item.title}，${statusOf(item, attempts[item.id])}${index === scenarioIndex ? '，当前题目' : ''}`}
            aria-current={index === scenarioIndex ? 'step' : undefined}
            className={index === scenarioIndex ? 'active' : ''}
            disabled={loading}
            key={item.id}
            onClick={() => navigate(mode, index)}
            type="button"
          >
            <span>{String(sequence.findIndex((candidate) => candidate.id === item.id) + 1).padStart(2, '0')}</span>
            {statusOf(item, attempts[item.id])}
          </button>
        ))}
      </div>

      {completed ? (
        <div aria-label="实验完成诊断" className="impact-result correct" ref={resultRef} role="region" tabIndex={-1}>
          <b>本轮诊断：已提交 {submittedCount}/10，当前答对 {correctCount}/10</b>
          <p>完成不等于掌握。优先重做高置信却答错的题，再用静态孪生检验自己是否守住统计单位、风险集、时钟、合同边际和传导断点。</p>
          <button className="impact-secondary" onClick={() => navigate('measurement', 0)} type="button">回到第一题逐题复盘</button>
        </div>
      ) : (
        <>
          <section className="impact-question" aria-labelledby={`labor-question-${scenario.id}`}>
            <span>{scenario.label} · 全局第 {globalNumber}/10 题</span>
            <h3 id={`labor-question-${scenario.id}`} ref={questionRef} tabIndex={-1}>{scenario.title}</h3>
            <p>{scenario.brief}</p>
          </section>

          <div className="impact-facts" role="group" aria-label="题目冻结参数">
            {scenario.facts.map((fact) => <article key={`${scenario.id}:${fact.label}`}><span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p></article>)}
          </div>

          <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}>
            <legend>选择唯一最完整的答案</legend>
            {scenario.options.map((option, index) => (
              <label className={attempt.choice === option.id ? 'selected' : ''} key={option.id}>
                <input
                  checked={attempt.choice === option.id}
                  name={`labor-choice-${scenario.id}`}
                  onChange={() => choose(option.id)}
                  ref={index === 0 ? firstOptionRef : undefined}
                  type="radio"
                  value={option.id}
                />
                <i>{option.id.toUpperCase()}</i><span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}>
            <legend>提交前记录置信度</legend>
            {confidenceLabels.map((item) => (
              <label key={item.id}>
                <input checked={attempt.confidence === item.id} name={`labor-confidence-${scenario.id}`} onChange={() => chooseConfidence(item.id)} type="radio" value={item.id} />
                <span>{item.label}</span>
              </label>
            ))}
          </fieldset>

          <button className="impact-primary" disabled={attempt.revealed || !attempt.choice || !attempt.confidence || loading} onClick={submit} type="button">提交答案并查看机制诊断</button>

          {attempt.revealed ? (
            <div aria-labelledby={resultTitleId} className={isCorrect ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1}>
              <b id={resultTitleId}>{isCorrect ? '回答正确' : '回答错误，可保留首次记录后重做'}</b>
              <p>{selected?.diagnosis}</p>
              <output aria-label="逐步复算" className="impact-calculation">{scenario.calculation}</output>
              <strong>{scenario.reveal}</strong>
              <p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find((item) => item.id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p>
              <p><b>复习入口：</b>{scenario.revisit}</p>
              <SourceLinks ids={scenario.sourceIds} />
              <div>
                {!isCorrect ? <button className="impact-secondary" onClick={retry} type="button">保留首次记录并重做</button> : <span aria-hidden="true" />}
                <button className="impact-secondary" onClick={goToNext} type="button">{nextUnsubmitted ? '前往下一道未提交题' : '查看完成诊断'}</button>
              </div>
            </div>
          ) : null}
        </>
      )}

      <div aria-label="本地作答记录控制" className="impact-result" role="group">
        {!resetArmed ? <button className="impact-secondary" disabled={loading} onClick={requestReset} ref={requestResetRef} type="button">准备重置本实验</button> : (
          <><button className="impact-secondary" disabled={loading} onClick={() => { pendingFocus.current = 'reset-request'; setResetArmed(false); setAnnouncement('已取消重置，原记录保留。'); }} type="button">取消</button><button className="impact-secondary" disabled={loading} onClick={resetAll} ref={confirmResetRef} type="button">确认清除十道题记录</button></>
        )}
      </div>
      <p className="impact-lab-caveat"><b>边界：</b>题中总体、匹配效率、合同份额、税转移和市场分解只为唯一判分而冻结；它们不是就业预测、政策建议或投资建议。记录仅保存在本设备、本浏览器和当前题库版本，不会上传。</p>
    </div>
  );
}
