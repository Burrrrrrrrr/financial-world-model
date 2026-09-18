'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  yieldCurveModes,
  yieldCurveScenarioAssertions,
  yieldCurveScenarios,
  type YieldCurveChoice,
  type YieldCurveMode,
  type YieldCurveScenario,
} from './yieldCurveScenarios';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = {
  choice?: YieldCurveChoice;
  confidence?: Confidence;
  firstChoice?: YieldCurveChoice;
  firstConfidence?: Confidence;
  submissions?: number;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:3.07-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};
const validChoices = new Set<YieldCurveChoice>(['a', 'b', 'c']);
const validConfidence = new Set<Confidence>(['low', 'medium', 'high']);
const scenarioIds = new Set(yieldCurveScenarios.map((scenario) => scenario.id));

function validateStored(value: unknown): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as { schema?: unknown; attempts?: unknown };
  if (source.schema !== 1 || !source.attempts || typeof source.attempts !== 'object' || Array.isArray(source.attempts)) return null;

  const attempts: Record<string, AttemptState> = {};
  let droppedInvalid = false;
  Object.entries(source.attempts as Record<string, unknown>).forEach(([id, raw]) => {
    if (!scenarioIds.has(id as YieldCurveScenario['id']) || !raw || typeof raw !== 'object' || Array.isArray(raw)) {
      droppedInvalid = true;
      return;
    }
    const item = raw as Record<string, unknown>;
    const choice = item.choice as YieldCurveChoice | undefined;
    const confidence = item.confidence as Confidence | undefined;
    const firstChoice = item.firstChoice as YieldCurveChoice | undefined;
    const firstConfidence = item.firstConfidence as Confidence | undefined;
    const submissions = item.submissions;
    const revealed = item.revealed === undefined ? false : item.revealed;
    const currentInvalid = revealed === true
      ? !validChoices.has(choice as YieldCurveChoice) || !validConfidence.has(confidence as Confidence)
      : (choice !== undefined && !validChoices.has(choice)) || (confidence !== undefined && !validConfidence.has(confidence));
    const hasHistory = firstChoice !== undefined || firstConfidence !== undefined || submissions !== undefined;
    const completeHistory = validChoices.has(firstChoice as YieldCurveChoice)
      && validConfidence.has(firstConfidence as Confidence)
      && Number.isSafeInteger(submissions)
      && (submissions as number) >= 1;

    if (typeof revealed !== 'boolean' || currentInvalid || (hasHistory && !completeHistory) || (revealed && !completeHistory)) {
      droppedInvalid = true;
      return;
    }
    attempts[id] = { choice, confidence, firstChoice, firstConfidence, submissions: submissions as number | undefined, revealed };
  });
  return { attempts, droppedInvalid };
}

function parseStored(raw: string) {
  try { return validateStored(JSON.parse(raw)); }
  catch { return null; }
}

function mastered(scenario: YieldCurveScenario, attempt?: AttemptState) {
  return Boolean(attempt?.revealed && attempt.choice === scenario.correct);
}

function statusOf(scenario: YieldCurveScenario, attempt?: AttemptState) {
  if (mastered(scenario, attempt)) return '已答对';
  if (attempt?.revealed) return '待重做';
  return '未提交';
}

const confidenceLabels: { id: Confidence; label: string }[] = [
  { id: 'low', label: '低：主要靠猜' },
  { id: 'medium', label: '中：能解释一部分' },
  { id: 'high', label: '高：能逐步复算' },
];

function SourceLinks({ ids }: { ids: number[] }) {
  return <p className="impact-source-links"><b>本题机制依据：</b>{' '}{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</p>;
}

export default function YieldCurveLab() {
  const [mode, setMode] = useState<YieldCurveMode>('coordinates');
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

  const sequence = yieldCurveScenarios;
  const scenarios = sequence.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const selected = scenario.options.find((option) => option.id === attempt.choice);
  const isCorrect = mastered(scenario, attempt);
  const nextUnmastered = sequence.find((item) => !mastered(item, attempts[item.id]));
  const submittedCount = sequence.filter((item) => attempts[item.id]?.revealed).length;
  const masteredCount = sequence.filter((item) => mastered(item, attempts[item.id])).length;
  const coordinateMastered = sequence.filter((item) => item.mode === 'coordinates' && mastered(item, attempts[item.id])).length;
  const decompositionMastered = sequence.filter((item) => item.mode === 'decomposition' && mastered(item, attempts[item.id])).length;
  const globalNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;
  const loading = storageState === 'loading';

  useEffect(() => {
    let cancelled = false;
    let restored: Record<string, AttemptState> = {};
    let recovered = false;
    let canPersist = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? parseStored(raw) : null;
      if (raw && parsed) {
        restored = parsed.attempts;
        recovered = parsed.droppedInvalid;
      } else if (raw) {
        recovered = true;
        try { window.localStorage.removeItem(STORAGE_KEY); }
        catch { canPersist = false; }
      }
    } catch {
      canPersist = false;
    }
    queueMicrotask(() => {
      if (cancelled) return;
      setAttempts(restored);
      setStorageState(canPersist ? 'saved' : 'session');
      if (recovered) setRecoveryNotice('无法验证的本地题库内容已丢弃；其余合法作答已恢复。');
      if (!canPersist) setAnnouncement('浏览器拒绝本地保存；当前会话仍可作答，但刷新可能丢失进度。');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (storageState !== 'saved') return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, attempts })); }
    catch {
      queueMicrotask(() => {
        setStorageState('session');
        setAnnouncement('浏览器拒绝本地保存；当前会话仍可作答，但刷新可能丢失进度。');
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

  function navigate(nextMode: YieldCurveMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    if (!completed && nextMode === mode && nextIndex === scenarioIndex) return;
    pendingFocus.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
    setResetArmed(false);
  }

  function choose(choice: YieldCurveChoice) {
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
      return { ...current, [scenario.id]: { ...old, firstChoice: old.firstChoice ?? old.choice, firstConfidence: old.firstConfidence ?? old.confidence, submissions: Math.min((old.submissions ?? 0) + 1, Number.MAX_SAFE_INTEGER), revealed: true } };
    });
  }

  function retry() {
    setAttempts((current) => ({ ...current, [scenario.id]: { ...(current[scenario.id] ?? EMPTY_ATTEMPT), choice: undefined, confidence: undefined, revealed: false } }));
    setAnnouncement('当前选择已清除；首次答案、首次置信度和提交次数继续保留。');
    pendingFocus.current = 'option';
  }

  function goToNext() {
    if (!isCorrect) return;
    if (!nextUnmastered) {
      pendingFocus.current = 'result';
      setCompleted(true);
      return;
    }
    const nextModeScenarios = sequence.filter((item) => item.mode === nextUnmastered.mode);
    navigate(nextUnmastered.mode, nextModeScenarios.findIndex((item) => item.id === nextUnmastered.id));
  }

  function requestReset() {
    if (loading) return;
    pendingFocus.current = 'reset';
    setResetArmed(true);
    setAnnouncement('重置尚未执行；再次确认才会清除 3.07 题库在本设备的记录。');
  }

  function resetAll() {
    if (loading) return;
    setAttempts({});
    setMode('coordinates');
    setScenarioIndex(0);
    setCompleted(false);
    setResetArmed(false);
    setRecoveryNotice('');
    pendingFocus.current = 'title';
    try {
      window.localStorage.removeItem(STORAGE_KEY);
      setAnnouncement('3.07 十道题的本地作答记录已重置；其他课程键未受影响。');
    } catch {
      setStorageState('session');
      setAnnouncement('当前会话已重置，但浏览器拒绝修改本地存储。');
    }
  }

  return (
    <div aria-busy={loading} className="impact-lab yield-curve-lab">
      <div className="impact-lab-head"><div><span>YIELD CURVE · COORDINATE & DECOMPOSITION LAB</span><h3 ref={titleRef} tabIndex={-1}>先确定价格坐标与回报口径，再判断预期、风险、供求和模型不确定性</h3></div><p>十道主题和十道静态孪生均使用冻结合成值；不包含当前市场收益率或投资建议。</p></div>
      <noscript><div className="precision-note"><span>互动实验当前不可用</span><p>此实验需要 JavaScript；你仍可前往<a href="#yield-static-twins">十道 SSR 静态孪生题</a>完成同一组机制练习。</p></div></noscript>
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录已清理</span><p>{recoveryNotice}</p></div> : null}
      <p aria-live="polite" className="impact-lab-progress">当前已答对 {masteredCount}/{sequence.length} · 坐标 {coordinateMastered}/5 · 分解 {decompositionMastered}/5 · 已提交 {submittedCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '仅当前会话' : '正在恢复记录'}</p>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="选择收益率曲线题库模式">{yieldCurveModes.map((item) => <button aria-pressed={mode === item.id} className={mode === item.id ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(item.id, 0)} type="button"><span>{item.label}</span><b>{item.title}</b><small>{item.description}</small></button>)}</div>
      <div className="impact-task-picker" role="group" aria-label="选择当前模式中的题目">{scenarios.map((item, index) => <button aria-label={`${item.id} ${item.title}，${statusOf(item, attempts[item.id])}${index === scenarioIndex ? '，当前题目' : ''}`} aria-current={index === scenarioIndex ? 'step' : undefined} className={index === scenarioIndex ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(mode, index)} type="button"><span>{item.id}</span>{statusOf(item, attempts[item.id])}</button>)}</div>

      {completed ? <div aria-label="实验完成诊断" className="impact-result correct" ref={resultRef} role="region" tabIndex={-1}><b>本轮完成：坐标 {coordinateMastered}/5，分解 {decompositionMastered}/5</b><p>十题均已答对。复盘时优先检查“高置信首次答错”的题，再用 K1–K10 静态孪生检查迁移。</p><button className="impact-secondary" onClick={() => navigate('coordinates', 0)} type="button">回到 M1 复盘</button></div> : <>
        <section className="impact-question" aria-labelledby={`yield-question-${scenario.id}`}><span>{scenario.label} · 全局第 {globalNumber}/{sequence.length} 题 · SYNTHETIC</span><h3 id={`yield-question-${scenario.id}`} ref={questionRef} tabIndex={-1}>{scenario.title}</h3><p>{scenario.brief}</p></section>
        <div className="impact-facts" role="group" aria-label="题目冻结参数">{scenario.facts.map((fact) => <article key={`${scenario.id}:${fact.label}`}><span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p></article>)}</div>
        <div className="impact-formula-brief" role="group" aria-label="可用公式与单位"><span>可用公式与单位</span>{scenario.formulas.map((formula) => <code key={formula}>{formula}</code>)}<p>{scenario.formulaUnits}</p></div>
        <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>选择唯一最完整的答案</legend>{scenario.options.map((option, index) => <label className={attempt.choice === option.id ? 'selected' : ''} key={option.id}><input checked={attempt.choice === option.id} name={`yield-choice-${scenario.id}`} onChange={() => choose(option.id)} ref={index === 0 ? firstOptionRef : undefined} type="radio" value={option.id} /><i>{option.id.toUpperCase()}</i><span>{option.label}</span></label>)}</fieldset>
        <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>提交前记录置信度</legend>{confidenceLabels.map((item) => <label key={item.id}><input checked={attempt.confidence === item.id} name={`yield-confidence-${scenario.id}`} onChange={() => chooseConfidence(item.id)} type="radio" value={item.id} /><span>{item.label}</span></label>)}</fieldset>
        <button className="impact-primary" disabled={attempt.revealed || !attempt.choice || !attempt.confidence || loading} onClick={submit} type="button">提交答案并查看机制诊断</button>
        {attempt.revealed ? <div aria-labelledby={resultTitleId} className={isCorrect ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1}><b id={resultTitleId}>{isCorrect ? '回答正确：已解锁逐步复算' : '回答错误：尚未显示答案与复算'}</b><p>{selected?.diagnosis}</p>{isCorrect ? <><output aria-label="逐步复算" className="impact-calculation">{scenario.calculation}</output><strong>{scenario.reveal}</strong><p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find((item) => item.id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p><p><b>复习入口：</b><a href={`#${scenario.primarySectionId}`}>主机制</a>{scenario.remediationSectionIds.map((id) => <span key={id}> · <a href={`#${id}`}>{id}</a></span>)}</p><SourceLinks ids={scenario.sourceIds} /><div><span aria-hidden="true" /><button className="impact-secondary" onClick={goToNext} type="button">{nextUnmastered ? '前往下一道未掌握题' : '查看完成诊断'}</button></div></> : <><p>请回到冻结参数、单位和对象边界重新判断；错误状态不展示正确选项、完整计算、citation 或下一题。</p><div><button className="impact-secondary" onClick={retry} type="button">保留首次记录并重做</button></div></>}</div> : null}
      </>}

      <div aria-label="3.07 本地作答记录控制" className="impact-result" role="group">{!resetArmed ? <button className="impact-secondary" disabled={loading} onClick={requestReset} ref={requestResetRef} type="button">准备重置本实验</button> : <><button className="impact-secondary" disabled={loading} onClick={() => { pendingFocus.current = 'reset-request'; setResetArmed(false); setAnnouncement('已取消重置，原记录保留。'); }} type="button">取消</button><button className="impact-secondary" disabled={loading} onClick={resetAll} ref={confirmResetRef} type="button">确认清除 3.07 十道题记录</button></>}</div>
      <div className="yield-fixture-audit" role="group" aria-label="题库结构断言"><span>题库结构断言 {yieldCurveScenarioAssertions.filter((item) => item.passed).length}/{yieldCurveScenarioAssertions.length}</span><ul>{yieldCurveScenarioAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.id}>{item.passed ? '通过' : '失败'} · {item.statement}</li>)}</ul></div>
      <p className="impact-lab-caveat"><b>边界：</b>只有 <code>{STORAGE_KEY}</code> 保存通过白名单校验的 attempts。模式、题号、得分、正确答案、完整计算、来源、C1–C5 控件状态与 3.06 输入都不进入本地记录。</p>
    </div>
  );
}
