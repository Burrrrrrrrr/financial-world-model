'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  corporateFlowModes,
  corporateFlowScenarios,
  type CorporateFlowChoice,
  type CorporateFlowMode,
  type CorporateFlowScenario,
} from './corporateFlowScenarios';

type AttemptState = { choice?: CorporateFlowChoice; revealed?: boolean };

const STORAGE_KEY = 'market-world-model:2.20-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};
const validChoices = new Set<CorporateFlowChoice>(['a', 'b', 'c']);
const scenarioIds = new Set(corporateFlowScenarios.map((scenario) => scenario.id));
const sequence = corporateFlowScenarios;

function validatedAttempts(value: unknown): { attempts: Record<string, AttemptState>; droppedInvalid: boolean } | null {
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
    const attempt = raw as { choice?: unknown; revealed?: unknown };
    if (!validChoices.has(attempt.choice as CorporateFlowChoice) || typeof attempt.revealed !== 'boolean') {
      droppedInvalid = true;
      return;
    }
    result[id] = { choice: attempt.choice as CorporateFlowChoice, revealed: attempt.revealed };
  });
  return { attempts: result, droppedInvalid };
}

function taskStatus(scenario: CorporateFlowScenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return '未提交';
  return attempt.choice === scenario.correct ? '已答对' : '已提交，待重做';
}

function ScenarioFacts({ scenario }: { scenario: CorporateFlowScenario }) {
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
    <p className="impact-source-links">
      <b>本题依据：</b>{' '}
      {ids.map((sourceId) => <a aria-label={'参考文献 ' + sourceId} className="citation-mark" href={'#ref-' + sourceId} key={sourceId}>[{sourceId}]</a>)}
    </p>
  );
}

export default function CorporateFlowLab() {
  const [mode, setMode] = useState<CorporateFlowMode>('ledger');
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
  const scenarios = corporateFlowScenarios.filter((item) => item.mode === mode);
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
          else {
            restored = validated.attempts;
            recoveredCorruption = validated.droppedInvalid;
          }
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

  function navigate(nextMode: CorporateFlowMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocusRef.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
    setResetArmed(false);
  }

  function choose(nextChoice: CorporateFlowChoice) {
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
      const modeScenarios = corporateFlowScenarios.filter((item) => item.mode === nextUnsubmitted.mode);
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
    <div aria-busy={restoring} className="impact-lab corporate-flow-lab">
      <div className="impact-lab-head">
        <div><span>CORPORATE FLOW · THREE-LEDGER LAB</span><h3 ref={labTitleRef} tabIndex={-1}>把董事会容量、真实成交、现金、股数与证据时钟重新对齐</h3></div>
        <p>前五题核算股本、EPS、现金、债务和 ASR；后五题判断授权、混合发行、安全港、可知时间与公告研究最多支持到哪一层。题目中的单位、法域、条款与时点均已冻结。</p>
      </div>
      <noscript><div className="precision-note"><span>互动实验当前不可用</span><p>此实验需要浏览器运行 JavaScript；你仍可前往 <a href="#active-practice">主动练习</a> 与 <a href="#checks-glossary">理解检查</a>，使用同一题库的静态孪生与完整答案。</p></div></noscript>
      <p aria-atomic="true" className="impact-lab-progress" role="status">全局进度：已提交 {submittedCount}/{sequence.length} · 当前正确 {correctCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {corporateFlowModes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} disabled={restoring} key={item.id} onClick={() => navigate(item.id, 0)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={(mode === 'ledger' ? '三本账核算' : '制度与证据判断') + '题目导航'}>
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
          <p>复习路径：第 1 题回到 issued／treasury／outstanding；第 2 题回到 WASO 与 diluted bridge；第 3–4 题分开 issuer cash、secondary 与融资成本；第 5 题重画 ASR；第 6–10 题依次检查 authorization、mixed offering、10b-18、publicAt 与 announcement estimand。</p>
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
                <input checked={choice === option.id} name={'corporate-flow-' + scenario.id} onChange={() => choose(option.id)} ref={optionIndex === 0 ? firstOptionRef : undefined} type="radio" value={option.id} />
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
              <SourceLinks ids={scenario.sourceIds} />
              <div>
                {!correct ? <button className="impact-secondary" onClick={retryCurrent} type="button">清除本题并重做</button> : <span aria-hidden="true" />}
                <button className="impact-secondary" onClick={goToNextUnsubmitted} type="button">{nextUnsubmitted ? '前往下一道未提交题' : '查看完成诊断'}</button>
              </div>
            </div>
          )}
        </>
      )}
      <p className="impact-lab-caveat"><b>模型与数据边界：</b>题内公司的股数、利润、价格、法域、合约、ADV 与时点均为唯一判分而冻结的教学参数，不代表实时发行、会计意见、税务结论或投资建议。记录只保存在本设备、本浏览器和当前题库版本，不会上传；清理浏览器数据会丢失。</p>
    </div>
  );
}
