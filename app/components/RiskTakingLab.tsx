'use client';

import { useEffect, useRef, useState } from 'react';
import {
  riskTakingModes,
  riskTakingNumericAssertionAudit,
  riskTakingScenarioAssertions,
  riskTakingScenarios,
  type RiskTakingChoice,
  type RiskTakingMode,
  type RiskTakingScenario,
} from './riskTakingScenarios';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = { choice?: RiskTakingChoice; confidence?: Confidence; firstChoice?: RiskTakingChoice; firstConfidence?: Confidence; submissions?: number; revealed?: boolean };

const STORAGE_KEY = 'market-world-model:3.12-risk-taking-lab-r2';
const STORAGE_SCHEMA = 2;
const EMPTY_ATTEMPT: AttemptState = {};
const DEFAULT_MODE = riskTakingModes[0].id;
const validChoices = new Set<RiskTakingChoice>(['a', 'b', 'c']);
const validConfidence = new Set<Confidence>(['low', 'medium', 'high']);
const scenarioIds = new Set(riskTakingScenarios.map(({ id }) => id));
const confidenceLabels: { id: Confidence; label: string }[] = [
  { id: 'low', label: '低：主要靠猜' }, { id: 'medium', label: '中：能计算但边界不稳' }, { id: 'high', label: '高：能解释机制、反事实与失败条件' },
];

function validateStored(value: unknown): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as { schema?: unknown; attempts?: unknown };
  if (source.schema !== STORAGE_SCHEMA || !source.attempts || typeof source.attempts !== 'object' || Array.isArray(source.attempts)) return null;
  const attempts: Record<string, AttemptState> = {};
  let droppedInvalid = false;
  Object.entries(source.attempts as Record<string, unknown>).forEach(([id, raw]) => {
    if (!scenarioIds.has(id as RiskTakingScenario['id']) || !raw || typeof raw !== 'object' || Array.isArray(raw)) { droppedInvalid = true; return; }
    const item = raw as Record<string, unknown>;
    const choice = item.choice as RiskTakingChoice | undefined;
    const confidence = item.confidence as Confidence | undefined;
    const firstChoice = item.firstChoice as RiskTakingChoice | undefined;
    const firstConfidence = item.firstConfidence as Confidence | undefined;
    const submissions = item.submissions;
    const revealed = item.revealed === undefined ? false : item.revealed;
    const currentValid = (choice === undefined || validChoices.has(choice)) && (confidence === undefined || validConfidence.has(confidence));
    const hasHistory = firstChoice !== undefined || firstConfidence !== undefined || submissions !== undefined;
    const historyValid = validChoices.has(firstChoice as RiskTakingChoice) && validConfidence.has(firstConfidence as Confidence) && Number.isSafeInteger(submissions) && (submissions as number) >= 1;
    if (typeof revealed !== 'boolean' || !currentValid || (hasHistory && !historyValid) || (revealed && (!choice || !confidence || !historyValid))) { droppedInvalid = true; return; }
    attempts[id] = { choice, confidence, firstChoice, firstConfidence, submissions: submissions as number | undefined, revealed };
  });
  return { attempts, droppedInvalid };
}

function parseStored(raw: string) {
  try { return validateStored(JSON.parse(raw)); } catch { return null; }
}

function mastered(scenario: RiskTakingScenario, attempt?: AttemptState) {
  return Boolean(attempt?.revealed && attempt.choice === scenario.correct);
}

function statusOf(scenario: RiskTakingScenario, attempt?: AttemptState) {
  if (mastered(scenario, attempt)) return '已答对';
  if (attempt?.revealed) return '待重做';
  return '未提交';
}

function SourceLinks({ ids }: { ids: number[] }) {
  return <p className="impact-source-links"><b>本题机制依据：</b>{' '}{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</p>;
}

export default function RiskTakingLab() {
  const [mode, setMode] = useState<RiskTakingMode>(DEFAULT_MODE);
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
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
  const sequence = riskTakingScenarios;
  const scenarios = sequence.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex] ?? scenarios[0] ?? sequence[0]!;
  const resultTitleId = `risk-taking-result-title-${scenario.id}`;
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
      if (raw && parsed) { restored = parsed.attempts; notice = parsed.droppedInvalid ? '无法验证的本地条目已丢弃，其余合法进度已恢复。' : Object.keys(restored).length ? `已恢复 ${Object.keys(restored).length} 道题。` : ''; }
      else if (raw) { notice = '本地记录未通过3.12 schema与白名单，已从空白进度继续。'; try { window.localStorage.removeItem(STORAGE_KEY); } catch { canPersist = false; } }
    } catch { canPersist = false; }
    queueMicrotask(() => {
      if (cancelled) return;
      setAttempts(restored); setStorageState(canPersist ? 'saved' : 'session'); setRecoveryNotice(notice);
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

  function navigate(nextMode: RiskTakingMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocus.current = focus; setMode(nextMode); setScenarioIndex(nextIndex); setResetArmed(false);
  }
  function choose(choice: RiskTakingChoice) {
    setAttempts((current) => { const old = current[scenario.id] ?? EMPTY_ATTEMPT; return old.revealed || old.choice === choice ? current : { ...current, [scenario.id]: { ...old, choice, revealed: false } }; });
  }
  function chooseConfidence(confidence: Confidence) {
    setAttempts((current) => { const old = current[scenario.id] ?? EMPTY_ATTEMPT; return old.revealed || old.confidence === confidence ? current : { ...current, [scenario.id]: { ...old, confidence, revealed: false } }; });
  }
  function submit() {
    pendingFocus.current = 'result';
    setAttempts((current) => { const old = current[scenario.id] ?? EMPTY_ATTEMPT; return old.revealed || !old.choice || !old.confidence ? current : { ...current, [scenario.id]: { ...old, firstChoice: old.firstChoice ?? old.choice, firstConfidence: old.firstConfidence ?? old.confidence, submissions: Math.min((old.submissions ?? 0) + 1, Number.MAX_SAFE_INTEGER), revealed: true } }; });
  }
  function retry() {
    setAttempts((current) => ({ ...current, [scenario.id]: { ...(current[scenario.id] ?? EMPTY_ATTEMPT), choice: undefined, confidence: undefined, revealed: false } }));
    pendingFocus.current = 'option'; setAnnouncement('当前选择已清除；首次答案、置信度和提交次数保留。');
  }
  function goToNext() {
    if (!isCorrect || !nextUnmastered) return;
    const nextModeSequence = sequence.filter(({ mode: nextMode }) => nextMode === nextUnmastered.mode);
    navigate(nextUnmastered.mode, nextModeSequence.findIndex(({ id }) => id === nextUnmastered.id));
  }
  function resetAll() {
    if (loading) return;
    setAttempts({}); setMode(DEFAULT_MODE); setScenarioIndex(0); setResetArmed(false); setRecoveryNotice(''); pendingFocus.current = 'question';
    try { window.localStorage.removeItem(STORAGE_KEY); setAnnouncement('3.12十道题的本设备记录已清除，其他课程键未受影响。'); }
    catch { setStorageState('session'); setAnnouncement('当前会话已重置，但浏览器拒绝修改本地存储。'); }
  }

  return <div className="impact-lab bank-credit-lab risk-taking-quiz">
    <div className="impact-lab-head"><div><span>INTERMEDIARY RISK TAKING · CHOICE, MEASUREMENT & IDENTIFICATION LAB</span><h3>冻结容量、资金和借款人状态，再判断筛选、定价与组合选择是否真的改变</h3></div><p>十道主题题与K1–K10静态孪生均是可复算SYNTHETIC教学实验；除明确标注的ECB调查题外，不是估计、政策事实、预测或机构行为建议。</p></div>
    <noscript><style>{'.risk-taking-quiz > :not(.impact-lab-head):not(noscript):not(#risk-taking-static-twins){display:none!important}'}</style><div className="precision-note"><span>互动题当前不可用</span><p>请前往<a href="#risk-taking-static-twins">K1–K10静态孪生题</a>完成相同机制练习。</p></div></noscript>
    <div aria-busy={loading} className="bank-credit-script-ui">
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录状态</span><p>{recoveryNotice}</p></div> : null}
      <p aria-live="polite" className="impact-lab-progress">当前已答对 {masteredCount}/{sequence.length} · 已提交 {submittedCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '仅当前会话' : '正在恢复记录'}</p><p aria-live="polite" className="sr-only">{announcement}</p>
      <div className="impact-mode-picker" role="group" aria-label="选择3.12题库模式">{riskTakingModes.map((item) => <button aria-pressed={mode === item.id} className={mode === item.id ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(item.id, 0)} type="button"><span>{item.label}</span><b>{item.title}</b><small>{item.description}</small></button>)}</div>
      <div className="impact-task-picker" role="group" aria-label="选择当前模式题目">{scenarios.map((item, index) => <button aria-current={index === scenarioIndex ? 'step' : undefined} aria-label={`${item.id} ${item.title}，${statusOf(item, attempts[item.id])}`} className={index === scenarioIndex ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(mode, index)} type="button"><span>{item.id}</span>{statusOf(item, attempts[item.id])}</button>)}</div>
      <section aria-labelledby={`risk-taking-question-${scenario.id}`} className="impact-question"><span>{scenario.label} · 全局第 {globalNumber}/{sequence.length} 题 · {scenario.id === 'M10' ? 'ECB DATA + SYNTHETIC INFERENCE TASK' : 'SYNTHETIC'}</span><h3 id={`risk-taking-question-${scenario.id}`} ref={questionRef} tabIndex={-1}>{scenario.title}</h3><p>{scenario.brief}</p></section>
      <div className="impact-facts" role="group" aria-label="题目冻结参数">{scenario.facts.map((fact) => <article key={`${scenario.id}:${fact.label}`}><span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p></article>)}</div>
      <div className="impact-formula-brief" role="group" aria-label="可用公式与单位"><span>可用公式与单位</span>{scenario.formulas.map((formula) => <code key={formula}>{formula}</code>)}<p>{scenario.formulaUnits}</p></div>
      <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>选择唯一最完整的答案</legend>{scenario.options.map((option, index) => <label className={attempt.choice === option.id ? 'selected' : ''} key={option.id}><input checked={attempt.choice === option.id} name={`risk-taking-choice-${scenario.id}`} onChange={() => choose(option.id)} ref={index === 0 ? firstOptionRef : undefined} type="radio" /><i>{option.id.toUpperCase()}</i><span>{option.label}</span></label>)}</fieldset>
      <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>提交前记录置信度</legend>{confidenceLabels.map((item) => <label key={item.id}><input checked={attempt.confidence === item.id} name={`risk-taking-confidence-${scenario.id}`} onChange={() => chooseConfidence(item.id)} type="radio" /><span>{item.label}</span></label>)}</fieldset>
      <button className="impact-primary" disabled={attempt.revealed || !attempt.choice || !attempt.confidence || loading} onClick={submit} type="button">提交答案并查看机制诊断</button>
      {attempt.revealed ? <div aria-labelledby={resultTitleId} className={isCorrect ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1}><b id={resultTitleId}>{isCorrect ? '回答正确：已解锁判断、因果链与失败条件' : '回答错误：标准答案仍未展示'}</b><p>{selected?.diagnosis}</p>{isCorrect ? <><output aria-label="逐步复算" className="impact-calculation">{scenario.calculation}</output><p><b>判断：</b>{scenario.judgment}</p><p><b>因果解释：</b>{scenario.causalExplanation}</p><p><b>反事实 / 失败条件：</b>{scenario.counterfactualOrFailure}</p><p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find(({ id }) => id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p><p><b>复习入口：</b><a href={`#${scenario.primarySectionId}`}>主机制</a>{scenario.remediationSectionIds.map((id) => <span key={id}> · <a href={`#${id}`}>{id}</a></span>)}</p><SourceLinks ids={scenario.sourceIds} /><div>{nextUnmastered ? <button className="impact-secondary" onClick={goToNext} type="button">前往下一道未掌握题</button> : <strong>十题均已答对；请继续K1–K10静态迁移。</strong>}</div></> : <><p>请检查冻结边界、事前/事后时钟、最终风险持有人和识别闸门，再重做。</p><button className="impact-secondary" onClick={retry} type="button">保留首次记录并重做</button></>}</div> : null}
      <div aria-label="3.12本地作答记录控制" className="impact-result" role="group">{!resetArmed ? <button className="impact-secondary" disabled={loading} onClick={() => { pendingFocus.current = 'reset-confirm'; setResetArmed(true); setAnnouncement('尚未清除；再次确认才会删除3.12记录。'); }} ref={resetRequestRef} type="button">准备重置本实验</button> : <><button className="impact-secondary" onClick={() => { pendingFocus.current = 'reset-request'; setResetArmed(false); }} type="button">取消</button><button className="impact-secondary" onClick={resetAll} ref={resetConfirmRef} type="button">确认清除3.12十道题记录</button></>}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.12题库结构与数值断言"><span>结构 {riskTakingScenarioAssertions.filter(({ passed }) => passed).length}/{riskTakingScenarioAssertions.length} · 数值 {riskTakingNumericAssertionAudit.filter(({ passed }) => passed).length}/{riskTakingNumericAssertionAudit.length}</span><ul>{riskTakingScenarioAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{riskTakingNumericAssertionAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={`${item.scenarioId}.${item.key}`}>{item.passed ? 'PASS' : 'FAIL'} · {item.scenarioId}.{item.key}</li>)}</ul></div>
      <p className="impact-lab-caveat"><b>边界：</b>只有 <code>{STORAGE_KEY}</code> 保存通过白名单验证的作答；参数、来源和其他课程键不写入。客户端门控不构成服务器级答案保密。</p>
    </div>
    <section aria-labelledby="risk-taking-static-twins-title" id="risk-taking-static-twins"><div className="impact-lab-head"><div><span>31 · STATIC TWINS · K1–K10</span><h3 id="risk-taking-static-twins-title">无脚本也可完成的十道迁移题</h3></div><p>每题公开复算、判断、因果解释与失败条件；数值仍是教学参数。</p></div>{sequence.map(({ staticTwin }) => <article className="impact-result correct" key={staticTwin.id}><span>{staticTwin.id} · {staticTwin.title}</span><h4>{staticTwin.prompt}</h4><ol type="A">{staticTwin.choices.map((choice) => <li key={choice.id}>{choice.label}</li>)}</ol><p><b>复算：</b>{staticTwin.calculations.join(' ')}</p><p><b>答案：</b>{staticTwin.answer}</p><p><b>判断：</b>{staticTwin.judgment}</p><p><b>因果解释：</b>{staticTwin.causalExplanation}</p><p><b>反事实 / 失败条件：</b>{staticTwin.counterfactualOrFailure}</p><SourceLinks ids={staticTwin.sourceIds} /></article>)}</section>
  </div>;
}
