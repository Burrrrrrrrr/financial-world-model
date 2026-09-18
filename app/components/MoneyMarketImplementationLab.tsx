'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  policyImplementationModes,
  policyImplementationScenarios,
  type PolicyImplementationChoice,
  type PolicyImplementationMode,
  type PolicyImplementationScenario,
} from './policyImplementationScenarios';

type Confidence = 'low' | 'medium' | 'high';
type AttemptState = {
  choice?: PolicyImplementationChoice;
  confidence?: Confidence;
  firstChoice?: PolicyImplementationChoice;
  firstConfidence?: Confidence;
  submissions?: number;
  revealed: boolean;
};

const STORAGE_KEY = 'market-world-model:3.06-lab-r1';
const LEGACY_STORAGE_KEY = 'market-world-model:3.06-lab-r0';
const EMPTY_ATTEMPT: AttemptState = { revealed: false };
const validChoices = new Set<PolicyImplementationChoice>(['a', 'b', 'c']);
const validConfidence = new Set<Confidence>(['low', 'medium', 'high']);
const scenarioIds = new Set(policyImplementationScenarios.map((scenario) => scenario.id));
const sequence = policyImplementationScenarios;

function validateStored(value: unknown): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;
  const source = value as { schema?: unknown; attempts?: unknown };
  if (source.schema !== 1 || !source.attempts || typeof source.attempts !== 'object' || Array.isArray(source.attempts)) return null;

  const attempts: Record<string, AttemptState> = {};
  let droppedInvalid = false;
  Object.entries(source.attempts as Record<string, unknown>).forEach(([id, raw]) => {
    if (!scenarioIds.has(id) || !raw || typeof raw !== 'object' || Array.isArray(raw)) {
      droppedInvalid = true;
      return;
    }
    const item = raw as Record<string, unknown>;
    const choice = item.choice as PolicyImplementationChoice | undefined;
    const confidence = item.confidence as Confidence | undefined;
    const firstChoice = item.firstChoice as PolicyImplementationChoice | undefined;
    const firstConfidence = item.firstConfidence as Confidence | undefined;
    const submissions = item.submissions;
    const revealed = item.revealed === undefined ? false : item.revealed;
    const currentInvalid = revealed === true
      ? !validChoices.has(choice as PolicyImplementationChoice) || !validConfidence.has(confidence as Confidence)
      : (choice !== undefined && !validChoices.has(choice)) || (confidence !== undefined && !validConfidence.has(confidence));
    const hasHistory = firstChoice !== undefined || firstConfidence !== undefined || submissions !== undefined;
    const completeHistory = validChoices.has(firstChoice as PolicyImplementationChoice)
      && validConfidence.has(firstConfidence as Confidence)
      && Number.isSafeInteger(submissions)
      && (submissions as number) >= 1;

    if (typeof revealed !== 'boolean' || currentInvalid || (hasHistory && !completeHistory) || (revealed && !completeHistory)) {
      droppedInvalid = true;
      return;
    }
    attempts[id] = {
      choice,
      confidence,
      firstChoice,
      firstConfidence,
      submissions: submissions as number | undefined,
      revealed,
    };
  });
  return { attempts, droppedInvalid };
}

function parseStored(raw: string): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
  try { return validateStored(JSON.parse(raw)); }
  catch { return null; }
}

function mastered(scenario: PolicyImplementationScenario, attempt?: AttemptState) {
  return Boolean(attempt?.revealed && attempt.choice === scenario.correct);
}

function statusOf(scenario: PolicyImplementationScenario, attempt?: AttemptState) {
  if (mastered(scenario, attempt)) return '已答对';
  if (attempt?.revealed) return '待重做';
  return '未提交';
}

function SourceLinks({ ids }: { ids: number[] }) {
  return (
    <p className="impact-source-links"><b>本题机制依据：</b>{' '}
      {ids.map((id) => <a aria-label={'参考文献 ' + id} className="citation-mark" href={'#ref-' + id} key={id}>[{id}]</a>)}
    </p>
  );
}

const confidenceLabels: { id: Confidence; label: string }[] = [
  { id: 'low', label: '低：主要靠猜' },
  { id: 'medium', label: '中：能解释一部分' },
  { id: 'high', label: '高：能逐步复算' },
];

export default function MoneyMarketImplementationLab() {
  const [mode, setMode] = useState<PolicyImplementationMode>('measurement');
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

  const scenarios = sequence.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const selected = scenario.options.find((option) => option.id === attempt.choice);
  const isCorrect = mastered(scenario, attempt);
  const nextUnmastered = sequence.find((item) => !mastered(item, attempts[item.id]));
  const submittedCount = sequence.filter((item) => attempts[item.id]?.revealed).length;
  const masteredCount = sequence.filter((item) => mastered(item, attempts[item.id])).length;
  const measurementMastered = sequence.filter((item) => item.mode === 'measurement' && mastered(item, attempts[item.id])).length;
  const mechanismMastered = sequence.filter((item) => item.mode === 'mechanism' && mastered(item, attempts[item.id])).length;
  const globalNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;
  const loading = storageState === 'loading';

  useEffect(() => {
    let cancelled = false;
    let restored: Record<string, AttemptState> = {};
    let recovered = false;
    let migrated = false;
    let canPersist = true;
    try {
      const currentRaw = window.localStorage.getItem(STORAGE_KEY);
      const current = currentRaw ? parseStored(currentRaw) : null;
      if (currentRaw && current) {
        restored = current.attempts;
        recovered = current.droppedInvalid;
      } else {
        if (currentRaw) recovered = true;
        const legacyRaw = window.localStorage.getItem(LEGACY_STORAGE_KEY);
        const legacy = legacyRaw ? parseStored(legacyRaw) : null;
        if (legacyRaw && legacy) {
          restored = legacy.attempts;
          recovered = recovered || legacy.droppedInvalid;
          try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ schema: 1, attempts: restored }));
            window.localStorage.removeItem(LEGACY_STORAGE_KEY);
            migrated = true;
          } catch {
            canPersist = false;
          }
        } else if (legacyRaw) {
          recovered = true;
        }
        if (currentRaw && !current && !migrated) {
          try { window.localStorage.removeItem(STORAGE_KEY); }
          catch { canPersist = false; }
        }
        if (legacyRaw && !legacy) {
          try { window.localStorage.removeItem(LEGACY_STORAGE_KEY); }
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
      if (migrated) setRecoveryNotice('旧版题库记录已校验并迁移到当前版本。');
      else if (recovered) setRecoveryNotice('无法验证的本地内容已丢弃；通过校验的作答已恢复。若浏览器允许保存，系统会立即写回清理后的记录。');
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

  function navigate(nextMode: PolicyImplementationMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    if (!completed && nextMode === mode && nextIndex === scenarioIndex) return;
    pendingFocus.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
    setResetArmed(false);
  }

  function choose(choice: PolicyImplementationChoice) {
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
      [scenario.id]: {
        ...(current[scenario.id] ?? EMPTY_ATTEMPT),
        choice: undefined,
        confidence: undefined,
        revealed: false,
      },
    }));
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
      window.localStorage.removeItem(LEGACY_STORAGE_KEY);
      setAnnouncement('十道题的新旧版本地作答记录均已重置。');
    } catch {
      setStorageState('session');
      setAnnouncement('当前会话已重置，但浏览器拒绝修改本地存储；旧记录可能在刷新后重新出现。若需永久清除，请删除本站点的浏览器数据。');
    }
  }

  return (
    <div aria-busy={loading} className="impact-lab money-market-lab">
      <div className="impact-lab-head">
        <div>
          <span>MONEY MARKET · IMPLEMENTATION LAB</span>
          <h3 ref={titleRef} tabIndex={-1}>先把央行账本、利率对象与统计单位量对，再诊断偏离来自稀缺、分割、抵押品、日历还是实施条款</h3>
        </div>
        <p>前五题训练恒等式、区间误差、机会成本、便利净价和 benchmark；后五题训练目标给定后的机制诊断。全部数值均为合成教学值。</p>
      </div>

      <noscript><div className="precision-note"><span>互动实验当前不可用</span><p>此实验需要 JavaScript；你仍可前往<a href="#implementation-static-twins">十道无脚本静态孪生题</a>完成同一组机制练习。</p></div></noscript>
      {recoveryNotice ? <div className="precision-note" role="status"><span>本地记录已恢复</span><p>{recoveryNotice}</p></div> : null}
      <p aria-live="polite" className="impact-lab-progress">当前已答对 {masteredCount}/{sequence.length} · 测量 {measurementMastered}/5 · 机制 {mechanismMastered}/5 · 当前提交态 {submittedCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '仅当前会话（刷新可能丢失）' : '正在恢复记录'}</p>
      <p aria-live="polite" className="sr-only">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="选择实验模式">
        {policyImplementationModes.map((item) => (
          <button aria-pressed={mode === item.id} className={mode === item.id ? 'active' : ''} disabled={loading} key={item.id} onClick={() => navigate(item.id, 0)} type="button">
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
          <b>本轮完成：测量 {measurementMastered}/5，机制 {mechanismMastered}/5</b>
          <p>十题均已在当前答案状态下答对。复盘时优先检查“高置信首次答错”的题，再用静态孪生检验自己是否能在新数字和新制度对象上重建机制。</p>
          <button className="impact-secondary" onClick={() => navigate('measurement', 0)} type="button">回到第一题逐题复盘</button>
        </div>
      ) : (
        <>
          <section className="impact-question" aria-labelledby={`implementation-question-${scenario.id}`}>
            <span>{scenario.label} · 全局第 {globalNumber}/{sequence.length} 题 · SYNTHETIC</span>
            <h3 id={`implementation-question-${scenario.id}`} ref={questionRef} tabIndex={-1}>{scenario.title}</h3>
            <p>{scenario.brief}</p>
          </section>

          <div className="impact-facts" role="group" aria-label="题目冻结参数">
            {scenario.facts.map((fact) => <article key={`${scenario.id}:${fact.label}`}><span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p></article>)}
          </div>
          <div className="impact-formula-brief" role="group" aria-label="可用公式与单位">
            <span>可用公式与单位</span>
            {scenario.formulas.map((formula) => <code key={formula}>{formula}</code>)}
            <p>{scenario.formulaUnits}</p>
          </div>

          <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}>
            <legend>选择唯一最完整的答案</legend>
            {scenario.options.map((option, index) => (
              <label className={attempt.choice === option.id ? 'selected' : ''} key={option.id}>
                <input checked={attempt.choice === option.id} name={`implementation-choice-${scenario.id}`} onChange={() => choose(option.id)} ref={index === 0 ? firstOptionRef : undefined} type="radio" value={option.id} />
                <i>{option.id.toUpperCase()}</i><span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          <fieldset className="impact-choice-fieldset" disabled={loading || attempt.revealed}>
            <legend>提交前记录置信度</legend>
            {confidenceLabels.map((item) => (
              <label key={item.id}><input checked={attempt.confidence === item.id} name={`implementation-confidence-${scenario.id}`} onChange={() => chooseConfidence(item.id)} type="radio" value={item.id} /><span>{item.label}</span></label>
            ))}
          </fieldset>

          <button className="impact-primary" disabled={attempt.revealed || !attempt.choice || !attempt.confidence || loading} onClick={submit} type="button">提交答案并查看机制诊断</button>

          {attempt.revealed ? (
            <div aria-labelledby={resultTitleId} className={isCorrect ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1}>
              <b id={resultTitleId}>{isCorrect ? '回答正确：已解锁逐步复算' : '回答错误：尚未显示答案与复算'}</b>
              <p>{selected?.diagnosis}</p>
              {isCorrect ? (
                <>
                  <output aria-label="逐步复算" className="impact-calculation">{scenario.calculation}</output>
                  <strong>{scenario.reveal}</strong>
                  <p><b>学习记录：</b>首次答案 {attempt.firstChoice?.toUpperCase()} · 首次置信度 {confidenceLabels.find((item) => item.id === attempt.firstConfidence)?.label ?? '未记录'} · 已提交 {attempt.submissions ?? 1} 次。</p>
                  <p><b>复习入口：</b>{scenario.revisit}</p>
                  <SourceLinks ids={scenario.sourceIds} />
                  <div><span aria-hidden="true" /><button className="impact-secondary" onClick={goToNext} type="button">{nextUnmastered ? '前往下一道未掌握题' : '查看完成诊断'}</button></div>
                </>
              ) : (
                <>
                  <p>请回到冻结参数、公式单位和对象边界重新判断；系统保留首次答案与置信度，但不会在错误提交后展示正确选项、完整计算或答案结论。</p>
                  <div><button className="impact-secondary" onClick={retry} type="button">保留首次记录并重做</button></div>
                </>
              )}
            </div>
          ) : null}
        </>
      )}

      <div aria-label="本地作答记录控制" className="impact-result" role="group">
        {!resetArmed ? (
          <button className="impact-secondary" disabled={loading} onClick={requestReset} ref={requestResetRef} type="button">准备重置本实验</button>
        ) : (
          <>
            <button className="impact-secondary" disabled={loading} onClick={() => { pendingFocus.current = 'reset-request'; setResetArmed(false); setAnnouncement('已取消重置，原记录保留。'); }} type="button">取消</button>
            <button className="impact-secondary" disabled={loading} onClick={resetAll} ref={confirmResetRef} type="button">确认清除十道题记录</button>
          </>
        )}
      </div>
      <p className="impact-lab-caveat"><b>边界：</b>十题参数均为 SYNTHETIC，只为唯一判分冻结；它们不是任何央行的当前利率、准备金阈值、结构系数、政策建议或投资建议。记录仅保存在本设备、本浏览器和当前题库版本，不会上传。</p>
    </div>
  );
}
