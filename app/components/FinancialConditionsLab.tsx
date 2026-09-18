'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  financialConditionsModes,
  financialConditionsNumericAssertionAudit,
  financialConditionsScenarioAssertions,
  financialConditionsScenarios,
  type FinancialConditionsChoice,
  type FinancialConditionsMode,
  type FinancialConditionsScenario,
} from './financialConditionsScenarios';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = {
  choice?: FinancialConditionsChoice;
  confidence?: Confidence;
  firstChoice?: FinancialConditionsChoice;
  firstConfidence?: Confidence;
  submissions?: number;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:3.13-financial-conditions-lab-r1';
const STORAGE_SCHEMA = 2;
const EMPTY_ATTEMPT: AttemptState = {};
const DEFAULT_MODE: FinancialConditionsMode = 'construction';
const choiceIds: FinancialConditionsChoice[] = ['a', 'b', 'c'];
const confidenceLabels = [
  { id: 'low' as const, label: '低：我在排除明显错误' },
  { id: 'medium' as const, label: '中：我理解主要机制' },
  { id: 'high' as const, label: '高：我能解释失败条件' },
];

function isChoice(value: unknown): value is FinancialConditionsChoice { return typeof value === 'string' && choiceIds.includes(value as FinancialConditionsChoice); }
function isConfidence(value: unknown): value is Confidence { return value === 'low' || value === 'medium' || value === 'high'; }

function parseAttempt(value: unknown): AttemptState | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const candidate = value as Record<string, unknown>;
  if (candidate.choice !== undefined && !isChoice(candidate.choice)) return null;
  if (candidate.firstChoice !== undefined && !isChoice(candidate.firstChoice)) return null;
  if (candidate.confidence !== undefined && !isConfidence(candidate.confidence)) return null;
  if (candidate.firstConfidence !== undefined && !isConfidence(candidate.firstConfidence)) return null;
  if (candidate.revealed !== undefined && typeof candidate.revealed !== 'boolean') return null;
  if (candidate.submissions !== undefined && (!Number.isSafeInteger(candidate.submissions) || Number(candidate.submissions) < 0)) return null;
  return {
    choice: candidate.choice as FinancialConditionsChoice | undefined,
    confidence: candidate.confidence as Confidence | undefined,
    firstChoice: candidate.firstChoice as FinancialConditionsChoice | undefined,
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
    const legalIds = new Set<string>(financialConditionsScenarios.map(({ id }) => id));
    const attempts: Record<string, AttemptState> = {};
    let droppedInvalid = false;
    for (const [id, value] of Object.entries(candidate.attempts as Record<string, unknown>)) {
      const attempt = legalIds.has(id) ? parseAttempt(value) : null;
      if (attempt) attempts[id] = attempt;
      else droppedInvalid = true;
    }
    return { attempts, droppedInvalid };
  } catch { return null; }
}

function mastered(scenario: FinancialConditionsScenario, attempt: AttemptState | undefined) {
  return Boolean(attempt?.revealed && attempt.choice === scenario.correct);
}

function statusOf(scenario: FinancialConditionsScenario, attempt: AttemptState | undefined) {
  if (mastered(scenario, attempt)) return '已掌握';
  if (attempt?.submissions) return '待重做';
  return '未作答';
}

function SourceLinks({ ids }: { ids: number[] }) {
  return <p className="section-sources"><b>依据：</b>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</p>;
}

export default function FinancialConditionsLab() {
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [mode, setMode] = useState<FinancialConditionsMode>(DEFAULT_MODE);
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
  const sequence = financialConditionsScenarios;
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
        notice = '本地记录未通过3.13 schema与白名单，已从空白进度继续。';
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

  function navigate(nextMode: FinancialConditionsMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocus.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setResetArmed(false);
  }
  function choose(choice: FinancialConditionsChoice) {
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
    pendingFocus.current = 'option';
    setAnnouncement('当前选择已清除；首次答案、置信度和提交次数保留。');
  }
  function goToNext() {
    if (!isCorrect || !nextUnmastered) return;
    const sameMode = sequence.filter(({ mode: nextMode }) => nextMode === nextUnmastered.mode);
    navigate(nextUnmastered.mode, sameMode.findIndex(({ id }) => id === nextUnmastered.id));
  }
  function resetAll() {
    if (loading) return;
    setAttempts({}); setMode(DEFAULT_MODE); setScenarioIndex(0); setResetArmed(false); setRecoveryNotice(''); pendingFocus.current = 'question';
    try { window.localStorage.removeItem(STORAGE_KEY); setAnnouncement('3.13十道题的本设备记录已清除，其他课程键未受影响。'); }
    catch { setStorageState('session'); setAnnouncement('当前会话已重置，但浏览器拒绝修改本地存储。'); }
  }

  return <div className="impact-lab bank-credit-lab risk-taking-quiz financial-conditions-quiz">
    <div className="impact-lab-head"><div><span>FINANCIAL CONDITIONS · CONSTRUCTION, INTERPRETATION & CLAIM LAB</span><h3>从方向、标准化和权重一路检查到融资菜单、预测身份与官方FCI-G边界</h3></div><p>M题与K题都严格采用九道SYNTHETIC题加一道官方FCI-G解释题；所有计算都可在K1–K10静态孪生中公开复算。</p></div>
    <noscript><style>{'.financial-conditions-quiz > :not(.impact-lab-head):not(noscript):not(#financial-conditions-static-twins){display:none!important}'}</style><div className="precision-note"><span>互动题当前不可用</span><p>请前往<a href="#financial-conditions-static-twins">K1–K10静态孪生题</a>完成相同机制练习。</p></div></noscript>
    <div aria-busy={loading} className="bank-credit-script-ui">
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录状态</span><p>{recoveryNotice}</p></div> : null}
      <p aria-live="polite" className="impact-lab-progress">当前已答对 {masteredCount}/{sequence.length} · 已提交 {submittedCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '仅当前会话' : '正在恢复记录'}</p><p aria-live="polite" className="sr-only">{announcement}</p>
      <div className="impact-mode-picker" role="group" aria-label="选择3.13题库模式">{financialConditionsModes.map((item) => <button aria-pressed={mode === item.id} className={mode === item.id ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(item.id, 0)} type="button"><span>{item.label}</span><b>{item.title}</b><small>{item.description}</small></button>)}</div>
      <div className="impact-task-picker" role="group" aria-label="选择当前模式题目">{scenarios.map((item, index) => <button aria-current={index === scenarioIndex ? 'step' : undefined} aria-label={`${item.id} ${item.title}，${statusOf(item, attempts[item.id])}`} className={index === scenarioIndex ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(mode, index)} type="button"><span>{item.id}</span>{statusOf(item, attempts[item.id])}</button>)}</div>
      <section aria-labelledby={`financial-conditions-question-${scenario.id}`} className="impact-question"><span>{scenario.label} · 全局第 {globalNumber}/{sequence.length} 题 · {scenario.synthetic ? 'SYNTHETIC' : 'OFFICIAL DATA INTERPRETATION'}</span><h3 id={`financial-conditions-question-${scenario.id}`} ref={questionRef} tabIndex={-1}>{scenario.title}</h3><p>{scenario.brief}</p></section>
      <div className="impact-facts" role="group" aria-label="题目冻结参数">{scenario.facts.map((fact) => <article key={`${scenario.id}:${fact.label}`}><span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p></article>)}</div>
      <div className="impact-formula-brief" role="group" aria-label="可用公式与单位"><span>可用公式与单位</span>{scenario.formulas.map((formula) => <code key={formula}>{formula}</code>)}<p>{scenario.formulaUnits}</p></div>
      <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>选择唯一最完整的答案</legend>{scenario.options.map((option, index) => <label className={attempt.choice === option.id ? 'selected' : ''} key={option.id}><input checked={attempt.choice === option.id} name={`financial-conditions-choice-${scenario.id}`} onChange={() => choose(option.id)} ref={index === 0 ? firstOptionRef : undefined} type="radio" /><i>{option.id.toUpperCase()}</i><span>{option.label}</span></label>)}</fieldset>
      <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}><legend>提交前记录置信度</legend>{confidenceLabels.map((item) => <label key={item.id}><input checked={attempt.confidence === item.id} name={`financial-conditions-confidence-${scenario.id}`} onChange={() => chooseConfidence(item.id)} type="radio" /><span>{item.label}</span></label>)}</fieldset>
      <button className="impact-primary" disabled={attempt.revealed || !attempt.choice || !attempt.confidence || loading} onClick={submit} type="button">提交答案并查看机制诊断</button>
      {attempt.revealed ? <div className={isCorrect ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1}><b>{isCorrect ? '回答正确：已解锁复算、判断、机制与失败条件' : '回答错误：标准答案仍未展示'}</b><p>{selected?.diagnosis}</p>{isCorrect ? <><output aria-label="逐步复算" className="impact-calculation">{scenario.calculation}</output><p><b>判断：</b>{scenario.judgment}</p><p><b>机制解释：</b>{scenario.causalExplanation}</p><p><b>反事实 / 失败条件：</b>{scenario.counterfactualOrFailure}</p><p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find(({ id }) => id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p><p><b>复习入口：</b><a href={`#${scenario.primarySectionId}`}>主机制</a>{scenario.remediationSectionIds.map((id) => <span key={id}> · <a href={`#${id}`}>{id}</a></span>)}</p><SourceLinks ids={scenario.sourceIds} /><div>{nextUnmastered ? <button className="impact-secondary" onClick={goToNext} type="button">前往下一道未掌握题</button> : <strong>十题均已答对；请继续K1–K10静态迁移。</strong>}</div></> : <><p>请检查主体护照、方向、单位、权重、vintage以及预测/因果身份，再重做。</p><button className="impact-secondary" onClick={retry} type="button">保留首次记录并重做</button></>}</div> : null}
      <div aria-label="3.13本地作答记录控制" className="impact-result" role="group">{!resetArmed ? <button className="impact-secondary" disabled={loading} onClick={() => { pendingFocus.current = 'reset-confirm'; setResetArmed(true); setAnnouncement('尚未清除；再次确认才会删除3.13记录。'); }} ref={resetRequestRef} type="button">准备重置本实验</button> : <><button className="impact-secondary" onClick={() => { pendingFocus.current = 'reset-request'; setResetArmed(false); }} type="button">取消</button><button className="impact-secondary" onClick={resetAll} ref={resetConfirmRef} type="button">确认清除3.13十道题记录</button></>}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.13题库结构与数值断言"><span>结构 {financialConditionsScenarioAssertions.filter(({ passed }) => passed).length}/{financialConditionsScenarioAssertions.length} · 数值 {financialConditionsNumericAssertionAudit.filter(({ passed }) => passed).length}/{financialConditionsNumericAssertionAudit.length}</span><ul>{financialConditionsScenarioAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{financialConditionsNumericAssertionAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={`${item.scenarioId}.${item.key}`}>{item.passed ? 'PASS' : 'FAIL'} · {item.scenarioId}.{item.key}</li>)}</ul></div>
      <p className="impact-lab-caveat"><b>边界：</b>只有<code>{STORAGE_KEY}</code>保存通过白名单验证的作答；参数、官方数据、来源和其他课程键不写入。客户端门控不构成服务器级答案保密。</p>
    </div>
    <section aria-labelledby="financial-conditions-static-twins-title" id="financial-conditions-static-twins"><div className="impact-lab-head"><div><span>STATIC TWINS · K1–K10</span><h3 id="financial-conditions-static-twins-title">无脚本、打印与复习模式均可完成的十道迁移题</h3></div><p>每题公开计算、判断、机制与失败条件；K1–K9为SYNTHETIC教学参数，K10使用另一官方FCI-G日期。</p></div>{sequence.map(({ staticTwin }) => <article className="impact-result correct" key={staticTwin.id}><span>{staticTwin.id} · {staticTwin.synthetic ? 'SYNTHETIC' : 'OFFICIAL DATA INTERPRETATION'} · {staticTwin.title}</span><h4>{staticTwin.prompt}</h4><ol type="A">{staticTwin.choices.map((choice) => <li key={choice.id}>{choice.label}</li>)}</ol><p><b>复算：</b>{staticTwin.calculations.join(' ')}</p><p><b>答案：</b>{staticTwin.answer}</p><p><b>判断：</b>{staticTwin.judgment}</p><p><b>机制解释：</b>{staticTwin.causalExplanation}</p><p><b>反事实 / 失败条件：</b>{staticTwin.counterfactualOrFailure}</p><SourceLinks ids={staticTwin.sourceIds} /></article>)}</section>
  </div>;
}
