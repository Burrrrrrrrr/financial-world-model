'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  debtLeverageModes,
  debtLeverageNumericAssertionAudit,
  debtLeverageScenarioAssertions,
  debtLeverageScenarios,
  type DebtLeverageChoice,
  type DebtLeverageMode,
  type DebtLeverageScenario,
} from './debtLeverageScenarios';
import styles from './debtLeverage.module.css';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = {
  choice?: DebtLeverageChoice;
  confidence?: Confidence;
  firstChoice?: DebtLeverageChoice;
  firstConfidence?: Confidence;
  submissions?: number;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:3.15-debt-leverage-lab-r1';
const STORAGE_SCHEMA = 1;
const EMPTY_ATTEMPT: AttemptState = {};
const DEFAULT_MODE: DebtLeverageMode = 'ledger';
const choiceIds: DebtLeverageChoice[] = ['a', 'b', 'c'];
const confidenceLabels = [
  { id: 'low' as const, label: '低：我主要在排除明显错误' },
  { id: 'medium' as const, label: '中：我能复算账本与主要机制' },
  { id: 'high' as const, label: '高：我能说明反例与证据边界' },
];

function isChoice(value: unknown): value is DebtLeverageChoice {
  return typeof value === 'string' && choiceIds.includes(value as DebtLeverageChoice);
}

function isConfidence(value: unknown): value is Confidence {
  return value === 'low' || value === 'medium' || value === 'high';
}

function parseAttempt(value: unknown): AttemptState | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  const allowed = new Set(['choice', 'confidence', 'firstChoice', 'firstConfidence', 'submissions', 'revealed']);
  if (Object.keys(candidate).some((key) => !allowed.has(key))) return null;
  if (candidate.choice !== undefined && !isChoice(candidate.choice)) return null;
  if (candidate.firstChoice !== undefined && !isChoice(candidate.firstChoice)) return null;
  if (candidate.confidence !== undefined && !isConfidence(candidate.confidence)) return null;
  if (candidate.firstConfidence !== undefined && !isConfidence(candidate.firstConfidence)) return null;
  if (candidate.submissions !== undefined && (!Number.isSafeInteger(candidate.submissions) || Number(candidate.submissions) < 0)) return null;
  if (candidate.revealed !== undefined && typeof candidate.revealed !== 'boolean') return null;
  const submissions = candidate.submissions === undefined ? 0 : Number(candidate.submissions);
  const hasFirstPair = candidate.firstChoice !== undefined && candidate.firstConfidence !== undefined;
  if ((candidate.firstChoice === undefined) !== (candidate.firstConfidence === undefined)) return null;
  if (submissions > 0 && !hasFirstPair) return null;
  if (submissions === 0 && hasFirstPair) return null;
  if (candidate.revealed === true && (submissions < 1 || candidate.choice === undefined || candidate.confidence === undefined || !hasFirstPair)) return null;
  return {
    choice: candidate.choice as DebtLeverageChoice | undefined,
    confidence: candidate.confidence as Confidence | undefined,
    firstChoice: candidate.firstChoice as DebtLeverageChoice | undefined,
    firstConfidence: candidate.firstConfidence as Confidence | undefined,
    submissions: candidate.submissions as number | undefined,
    revealed: candidate.revealed as boolean | undefined,
  };
}

function parseStored(raw: string): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
    const candidate = parsed as Record<string, unknown>;
    if (candidate.schema !== STORAGE_SCHEMA || !candidate.attempts || typeof candidate.attempts !== 'object' || Array.isArray(candidate.attempts)) return null;
    const legalIds = new Set(debtLeverageScenarios.map(({ id }) => id));
    const attempts: Record<string, AttemptState> = {};
    let droppedInvalid = false;
    for (const [id, value] of Object.entries(candidate.attempts as Record<string, unknown>)) {
      const attempt = legalIds.has(id) ? parseAttempt(value) : null;
      if (attempt) attempts[id] = attempt;
      else droppedInvalid = true;
    }
    return { attempts, droppedInvalid };
  } catch {
    return null;
  }
}

export const debtLeverageStorageAudit = [
  { key: 'empty and pre-submit partial states remain recoverable', passed: parseAttempt({}) !== null && parseAttempt({ choice: 'a' }) !== null },
  { key: 'revealed answer requires choice confidence first pair and positive submissions', passed: parseAttempt({ choice: 'a', confidence: 'high', firstChoice: 'a', firstConfidence: 'high', submissions: 1, revealed: true }) !== null && parseAttempt({ choice: 'a', confidence: 'high', revealed: true }) === null },
  { key: 'retry preserves a coherent first-attempt pair', passed: parseAttempt({ firstChoice: 'b', firstConfidence: 'low', submissions: 1, revealed: false }) !== null && parseAttempt({ firstChoice: 'b', submissions: 1, revealed: false }) === null },
  { key: 'unknown fields and zero-submission first metadata are rejected', passed: parseAttempt({ injected: true }) === null && parseAttempt({ firstChoice: 'a', firstConfidence: 'medium', submissions: 0 }) === null },
] as const;

if (!debtLeverageStorageAudit.every(({ passed }) => passed)) {
  throw new Error(`3.15 storage schema gate failed: ${debtLeverageStorageAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

const mastered = (scenario: DebtLeverageScenario, attempt: AttemptState | undefined) => Boolean(attempt?.revealed && attempt.choice === scenario.correct);
const statusOf = (scenario: DebtLeverageScenario, attempt: AttemptState | undefined) => mastered(scenario, attempt) ? '已掌握' : attempt?.submissions ? '待重做' : '未作答';

function SourceLinks({ ids }: { ids: readonly number[] }) {
  return <p className="section-sources"><b>依据：</b>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</p>;
}

export default function DebtLeverageLab() {
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [mode, setMode] = useState<DebtLeverageMode>(DEFAULT_MODE);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [storageState, setStorageState] = useState<'loading' | 'saved' | 'session'>('loading');
  const [announcement, setAnnouncement] = useState('');
  const [recoveryNotice, setRecoveryNotice] = useState('');
  const [resetArmed, setResetArmed] = useState(false);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const resultRef = useRef<HTMLDivElement>(null);
  const resetConfirmRef = useRef<HTMLButtonElement>(null);
  const resetRequestRef = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<'question' | 'option' | 'result' | 'reset-confirm' | 'reset-request' | null>(null);
  const sequence = debtLeverageScenarios;
  const scenarios = useMemo(() => sequence.filter((item) => item.mode === mode), [mode, sequence]);
  const scenario = scenarios[Math.min(scenarioIndex, scenarios.length - 1)] ?? sequence[0];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const selected = scenario.options.find(({ id }) => id === attempt.choice);
  const isCorrect = mastered(scenario, attempt);
  const masteredCount = sequence.filter((item) => mastered(item, attempts[item.id])).length;
  const submittedCount = sequence.filter((item) => (attempts[item.id]?.submissions ?? 0) > 0).length;
  const nextUnmastered = sequence.find((item) => !mastered(item, attempts[item.id]));
  const globalNumber = sequence.findIndex(({ id }) => id === scenario.id) + 1;
  const loading = storageState === 'loading';

  useEffect(() => {
    let cancelled = false;
    let restored: Record<string, AttemptState> = {};
    let notice = '';
    let canPersist = true;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? parseStored(raw) : null;
      if (raw && parsed) {
        restored = parsed.attempts;
        notice = parsed.droppedInvalid ? '无法验证的本地条目已丢弃，其余合法进度已恢复。' : Object.keys(restored).length ? `已恢复 ${Object.keys(restored).length} 道题。` : '';
      } else if (raw) {
        notice = '本地记录未通过3.15 schema与题号白名单，已从空白进度继续。';
        try { window.localStorage.removeItem(STORAGE_KEY); } catch { canPersist = false; }
      }
    } catch { canPersist = false; }
    queueMicrotask(() => {
      if (cancelled) return;
      setAttempts(restored);
      setStorageState(canPersist ? 'saved' : 'session');
      setRecoveryNotice(notice);
      if (!canPersist) setAnnouncement('浏览器拒绝本地保存；当前会话仍可作答。');
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (storageState !== 'saved') return;
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: STORAGE_SCHEMA, attempts })); }
    catch { queueMicrotask(() => { setStorageState('session'); setAnnouncement('浏览器拒绝本地保存；刷新可能丢失进度。'); }); }
  }, [attempts, storageState]);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === 'question') questionRef.current?.focus();
    if (target === 'option') firstOptionRef.current?.focus();
    if (target === 'result') resultRef.current?.focus();
    if (target === 'reset-confirm') resetConfirmRef.current?.focus();
    if (target === 'reset-request') resetRequestRef.current?.focus();
  }, [scenario.id, attempt.revealed, resetArmed]);

  function navigate(nextMode: DebtLeverageMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocus.current = focus; setMode(nextMode); setScenarioIndex(nextIndex); setResetArmed(false);
  }
  function choose(choice: DebtLeverageChoice) {
    setAttempts((current) => {
      const old = current[scenario.id] ?? EMPTY_ATTEMPT;
      return old.revealed || old.choice === choice ? current : { ...current, [scenario.id]: { ...old, choice, revealed: false } };
    });
  }
  function chooseConfidence(confidence: Confidence) {
    setAttempts((current) => {
      const old = current[scenario.id] ?? EMPTY_ATTEMPT;
      return old.revealed || old.confidence === confidence ? current : { ...current, [scenario.id]: { ...old, confidence, revealed: false } };
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
    pendingFocus.current = 'option'; setAnnouncement('当前选择已清除；首次答案、置信度和提交次数保留。');
  }
  function goToNext() {
    if (!isCorrect || !nextUnmastered) return;
    const sameMode = sequence.filter(({ mode: nextMode }) => nextMode === nextUnmastered.mode);
    navigate(nextUnmastered.mode, sameMode.findIndex(({ id }) => id === nextUnmastered.id));
  }
  function resetAll() {
    if (loading) return;
    setAttempts({}); setMode(DEFAULT_MODE); setScenarioIndex(0); setResetArmed(false); setRecoveryNotice(''); pendingFocus.current = 'question';
    try { window.localStorage.removeItem(STORAGE_KEY); setAnnouncement('3.15十道题的本设备记录已清除，其他课程键未受影响。'); }
    catch { setStorageState('session'); setAnnouncement('当前会话已重置，但浏览器拒绝修改本地存储。'); }
  }

  return <div className={`impact-lab bank-credit-lab risk-taking-quiz ${styles.quiz}`}>
    <div className="impact-lab-head"><div><span>DEBT / LEVERAGE · LEDGER, CONSTRAINT & SYSTEM LAB</span><h3>从分母、时钟和资格门一路检查到债务积压、去杠杆外溢与证据边界</h3></div><p>M1–M9使用明确标记的SYNTHETIC参数；M10只解释冻结的官方Fed观测。每题另有K1–K10静态迁移版本。</p></div>
    <noscript><style>{`.${styles.quiz} > :not(.impact-lab-head):not(noscript):not(#debt-leverage-static-twins){display:none!important}`}</style><div className="precision-note"><span>互动题当前不可用</span><p>请前往<a href="#debt-leverage-static-twins">K1–K10静态迁移题</a>完成同一机制练习。</p></div></noscript>
    <div aria-busy={loading} className="bank-credit-script-ui">
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录状态</span><p>{recoveryNotice}</p></div> : null}
      <p aria-live="polite" className="impact-lab-progress">当前已答对 {masteredCount}/{sequence.length} · 已提交 {submittedCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '仅当前会话' : '正在恢复记录'}</p>
      <p aria-live="polite" className="sr-only">{announcement}</p>
      <div className="impact-mode-picker" role="group" aria-label="选择3.15题库模式">{debtLeverageModes.map((item, index) => <button aria-pressed={mode === item.id} className={mode === item.id ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(item.id, 0)} type="button"><span aria-hidden="true">MODE {String(index + 1).padStart(2, '0')}</span><b>{item.label}</b><small>{item.description}</small></button>)}</div>
      <div className="impact-task-picker" role="group" aria-label="选择当前模式题目">{scenarios.map((item, index) => <button aria-current={index === scenarioIndex ? 'step' : undefined} aria-label={`${item.id} ${item.title}，${statusOf(item, attempts[item.id])}`} className={index === scenarioIndex ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(mode, index)} type="button"><span>{item.id}</span>{statusOf(item, attempts[item.id])}</button>)}</div>
      <section aria-labelledby={`debt-leverage-question-${scenario.id}`} className="impact-question"><span>{scenario.label} · 全局第 {globalNumber}/{sequence.length} 题 · {scenario.synthetic ? 'SYNTHETIC' : 'OFFICIAL DATA INTERPRETATION'}</span><h4 id={`debt-leverage-question-${scenario.id}`} ref={questionRef} tabIndex={-1}>{scenario.title}</h4><p>{scenario.brief}</p></section>
      <div className="impact-facts" role="group" aria-label="题目冻结参数">{scenario.facts.map((fact) => <article key={`${scenario.id}:${fact.label}`}><span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p></article>)}</div>
      <div className="impact-formula-brief" role="group" aria-label="可用公式与单位"><span>可用公式与单位</span>{scenario.formulas.map((formula) => <code key={formula}>{formula}</code>)}<p>{scenario.formulaUnits}</p></div>
      <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>选择唯一最完整的答案</legend>{scenario.options.map((option, index) => <label className={attempt.choice === option.id ? 'selected' : ''} key={option.id}><input checked={attempt.choice === option.id} name={`debt-leverage-choice-${scenario.id}`} onChange={() => choose(option.id)} ref={index === 0 ? firstOptionRef : undefined} type="radio" /><i>{option.id.toUpperCase()}</i><span>{option.label}</span></label>)}</fieldset>
      <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>提交前记录置信度</legend>{confidenceLabels.map((item) => <label key={item.id}><input checked={attempt.confidence === item.id} name={`debt-leverage-confidence-${scenario.id}`} onChange={() => chooseConfidence(item.id)} type="radio" /><span>{item.label}</span></label>)}</fieldset>
      <button className="impact-primary" disabled={attempt.revealed || !attempt.choice || !attempt.confidence || loading} onClick={submit} type="button">提交答案并查看机制诊断</button>
      {attempt.revealed ? <div aria-label={`${scenario.id}作答结果：${isCorrect ? '正确' : '错误'}`} className={isCorrect ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1}><b>{isCorrect ? '回答正确：已解锁复算、判断、机制与失败条件' : '回答错误：标准答案仍未展示'}</b><p>{selected?.diagnosis}</p>{isCorrect ? <><output aria-label="逐步复算" className="impact-calculation">{scenario.calculation}</output><p><b>判断：</b>{scenario.judgment}</p><p><b>机制解释：</b>{scenario.mechanismExplanation}</p><p><b>反事实 / 失败条件：</b>{scenario.counterfactualOrFailure}</p><p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find(({ id }) => id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p><p><b>复习入口：</b><a href={`#${scenario.primarySectionId}`}>主机制</a>{scenario.remediationSectionIds.map((id) => <span key={id}> · <a href={`#${id}`}>{id}</a></span>)}</p><SourceLinks ids={scenario.sourceIds} /><div>{nextUnmastered ? <button className="impact-secondary" onClick={goToNext} type="button">前往下一道未掌握题</button> : <strong>十题均已答对；请继续K1–K10静态迁移。</strong>}</div></> : <><p>请检查分母、时钟、资格门、主动/被动状态和证据身份，再重做。</p><button className="impact-secondary" onClick={retry} type="button">保留首次记录并重做</button></>}</div> : null}
      <div aria-label="3.15本地作答记录控制" className="impact-result" role="group">{!resetArmed ? <button className="impact-secondary" disabled={loading} onClick={() => { pendingFocus.current = 'reset-confirm'; setResetArmed(true); setAnnouncement('尚未清除；再次确认才会删除3.15记录。'); }} ref={resetRequestRef} type="button">准备重置本实验</button> : <><button className="impact-secondary" onClick={() => { pendingFocus.current = 'reset-request'; setResetArmed(false); }} type="button">取消</button><button className="impact-secondary" onClick={resetAll} ref={resetConfirmRef} type="button">确认清除3.15十道题记录</button></>}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.15题库结构、数值与存储断言"><span>结构 {debtLeverageScenarioAssertions.filter(({ passed }) => passed).length}/{debtLeverageScenarioAssertions.length} · 数值 {debtLeverageNumericAssertionAudit.filter(({ passed }) => passed).length}/{debtLeverageNumericAssertionAudit.length} · 存储 {debtLeverageStorageAudit.filter(({ passed }) => passed).length}/{debtLeverageStorageAudit.length}</span><ul>{debtLeverageScenarioAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{debtLeverageNumericAssertionAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={`${item.scenarioId}.${item.key}`}>{item.passed ? 'PASS' : 'FAIL'} · {item.scenarioId}.{item.key}</li>)}{debtLeverageStorageAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · storage · {item.key}</li>)}</ul></div>
      <p className="impact-lab-caveat"><b>边界：</b>只有<code>{STORAGE_KEY}</code>保存通过schema与题号白名单验证的作答；官方数据、参数、来源和其他课程键均不写入。客户端门控不构成服务器级答案保密。</p>
    </div>
    <section aria-labelledby="debt-leverage-static-twins-title" className={styles.staticTwin} id="debt-leverage-static-twins"><div className="impact-lab-head"><div><span>33 · STATIC TWINS · K1–K10</span><h3 id="debt-leverage-static-twins-title">无脚本、打印与复习模式均可完成的十道迁移题</h3></div><p>每题公开复算、判断、机制与失败条件；K1–K9为SYNTHETIC教学参数，K10解释同一冻结Fed数据。</p></div>{sequence.map(({ staticTwin }) => <article className="impact-result correct" key={staticTwin.id}><span>{staticTwin.id} · {staticTwin.synthetic ? 'SYNTHETIC' : 'OFFICIAL DATA INTERPRETATION'} · {staticTwin.title}</span><h4>{staticTwin.prompt}</h4><ol className="static-choice-list">{staticTwin.choices.map((choice) => <li key={choice.id}><b>{choice.id.toUpperCase()}.</b><span>{choice.label}</span></li>)}</ol><p><b>复算：</b>{staticTwin.calculations.join(' ')}</p><p><b>答案：</b>{staticTwin.answer}</p><p><b>判断：</b>{staticTwin.judgment}</p><p><b>机制解释：</b>{staticTwin.mechanismExplanation}</p><p><b>反事实 / 失败条件：</b>{staticTwin.counterfactualOrFailure}</p><SourceLinks ids={staticTwin.sourceIds} /></article>)}</section>
  </div>;
}
