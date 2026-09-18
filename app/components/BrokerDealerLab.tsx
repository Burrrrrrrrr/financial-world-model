'use client';

import { useEffect, useId, useRef, useState } from 'react';
import {
  brokerDealerScenarios,
  dealerModes,
  type DealerChoice,
  type DealerMode,
  type DealerScenario,
} from './brokerDealerScenarios';

type AttemptState = {
  choice?: DealerChoice;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:2.07-lab-r3';
const EMPTY_ATTEMPT: AttemptState = {};
const sequence = brokerDealerScenarios.map((item) => ({
  id: item.id,
  mode: item.mode,
  correct: item.correct,
  options: item.options.map((option) => option.id),
}));

function taskStatus(item: DealerScenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return attempt?.choice ? '已选择，尚未提交' : '未作答';
  return attempt.choice === item.correct ? '已提交，回答正确' : '已提交，回答错误，可重新作答';
}

function validatedAttempts(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const payload = value as Record<string, unknown>;
  if (payload.schema !== 1 || !payload.attempts || typeof payload.attempts !== 'object' || Array.isArray(payload.attempts)) return {};
  const input = payload.attempts as Record<string, unknown>;
  const valid: Record<string, AttemptState> = {};
  for (const item of sequence) {
    const raw = input[item.id];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const candidate = raw as Record<string, unknown>;
    const choice = candidate.choice;
    if (choice !== 'a' && choice !== 'b' && choice !== 'c') continue;
    if (typeof candidate.revealed !== 'boolean') continue;
    if (!item.options.includes(choice)) continue;
    valid[item.id] = { choice, revealed: candidate.revealed };
  }
  return valid;
}

function ScenarioFacts({ scenario }: { scenario: DealerScenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目固定教学参数">
      {scenario.facts.map((fact) => (
        <article key={scenario.id + ':' + fact.label + ':' + fact.value}>
          <span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function BrokerDealerLab() {
  const [mode, setMode] = useState<DealerMode>('balance-sheet');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const [storageState, setStorageState] = useState<'loading' | 'saved' | 'session'>('loading');
  const [announcement, setAnnouncement] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | 'result' | null>(null);
  const resultTitleId = useId();
  const scenarios = brokerDealerScenarios.filter((item) => item.mode === mode);
  const scenario = scenarios[scenarioIndex];
  const attempt = attempts[scenario.id] ?? EMPTY_ATTEMPT;
  const { choice, revealed } = attempt;
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
      const restored = stored ? validatedAttempts(JSON.parse(stored)) : {};
      queueMicrotask(() => {
        if (cancelled) return;
        setAttempts(restored);
        setStorageState('saved');
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
  }, [scenario.id, revealed, completed]);

  function navigate(nextMode: DealerMode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocusRef.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
  }

  function selectMode(nextMode: DealerMode) {
    if (nextMode === mode && !completed) return;
    navigate(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex && !completed) return;
    navigate(mode, nextIndex);
  }

  function choose(nextChoice: DealerChoice) {
    setAttempts((current) => ({ ...current, [scenario.id]: { choice: nextChoice, revealed: false } }));
    setCompleted(false);
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
      const nextModeScenarios = brokerDealerScenarios.filter((item) => item.mode === nextUnsubmitted.mode);
      const nextIndex = nextModeScenarios.findIndex((item) => item.id === nextUnsubmitted.id);
      navigate(nextUnsubmitted.mode, nextIndex);
      return;
    }
    pendingFocusRef.current = 'result';
    setCompleted(true);
  }

  function resetAll() {
    setAttempts({});
    setCompleted(false);
    setAnnouncement(sequence.length + ' 道题的作答记录已重置。');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageState('session');
      setAnnouncement(sequence.length + ' 道题的作答记录已重置；无法保存，当前会话仍可作答。');
    }
    navigate('balance-sheet', 0, 'option');
  }

  const globalQuestionNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;

  return (
    <div className="impact-lab bank-intermediary-lab broker-dealer-lab">
      <div className="impact-lab-head">
        <div><span>DEALER CAPACITY LAB</span><h3>从融资、库存到报价与反馈</h3></div>
        <p>十题均使用冻结教学参数。先分清融资腿、客户腿和 firm inventory，再读取净资本、客户保护、margin、风险限额与日内结算；客户端包含答案，不作为防作弊考试。</p>
      </div>
      <noscript>
        <div className="precision-note">
          <span>互动实验当前不可用</span>
          <p>此实验需要浏览器运行 JavaScript；下方按钮在无脚本状态下不能提交。你仍可直接前往 <a href="#active-practice">主动练习</a> 与 <a href="#understanding-checks">理解检查</a>，使用同一数据源生成的静态题目和完整答案。</p>
        </div>
      </noscript>
      <p className="impact-lab-progress">全局进度：已提交 {submittedCount}/{sequence.length} · 当前正确 {correctCount}/{sequence.length} · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {dealerModes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} key={item.id} onClick={() => selectMode(item.id)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={(mode === 'balance-sheet' ? '从融资到库存' : '从约束到订单') + '题目导航'}>
        {scenarios.map((item, index) => {
          const globalNumber = sequence.findIndex((entry) => entry.id === item.id) + 1;
          return (
            <button
              aria-current={!completed && scenarioIndex === index ? 'step' : undefined}
              aria-label={'第 ' + globalNumber + ' 题，' + item.title + '，' + taskStatus(item, attempts[item.id])}
              aria-pressed={!completed && scenarioIndex === index}
              key={item.id}
              onClick={() => selectScenario(index)}
              type="button"
            >
              <span>{String(globalNumber).padStart(2, '0')}</span>{attempts[item.id]?.revealed ? (attempts[item.id]?.choice === item.correct ? '正确' : '待重做') : '未提交'}
            </button>
          );
        })}
      </div>

      {completed ? (
        <div className="impact-result" ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{sequence.length} 题已提交：{correctCount}/{sequence.length} 正确</b>
          <p>复习路径：第 1–2 题回到 repo 与 matched book；第 3 题回到库存报价；第 4–5 题分开 firm net capital 与客户保护；第 6–9 题回到 margin、风险、杠杆与 CCP 现金时钟；第 10 题闭合 capacity 的稳定与放大分支。错误题保留原选择，可逐题重做。</p>
          <div>
            <button className="impact-secondary" onClick={() => navigate('balance-sheet', 0)} type="button">回到第 1 题</button>
            <button className="impact-secondary" onClick={resetAll} type="button">重置全部作答</button>
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
          <fieldset className="impact-choice-fieldset" disabled={revealed}>
            <legend className="sr-only">第 {globalQuestionNumber} 题：{scenario.title}，请选择一个答案</legend>
            {scenario.options.map((option, optionIndex) => (
              <label className={choice === option.id ? 'selected' : ''} key={option.id}>
                <input
                  checked={choice === option.id}
                  name={'broker-dealer-' + scenario.id}
                  onChange={() => choose(option.id)}
                  ref={optionIndex === 0 ? firstOptionRef : undefined}
                  type="radio"
                  value={option.id}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {!revealed ? (
            <button className="impact-primary" disabled={!choice} onClick={submit} type="button">提交本题并查看诊断</button>
          ) : (
            <div className={correct ? 'impact-result correct' : 'impact-result'} ref={resultRef} role="region" tabIndex={-1} aria-labelledby={resultTitleId}>
              <b id={resultTitleId}>{correct ? '回答正确' : '回答错误，可根据诊断重做'}</b>
              <p>{selected?.diagnosis}</p>
              <code>{scenario.calculation}</code>
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
      <p className="impact-lab-caveat"><b>模型边界：</b>金额、价格、利率、haircut、margin、扣减、限额和阈值都是为了唯一答案而冻结的教学参数；除题中标明的美元外，百万元金额不绑定特定币种。Repo haircut、监管 haircut、客户 margin、CCP margin 与价格跌幅不可互换；教学净资本桥、reserve 公式、VaR 和库存报价均不是任何法域的完整规则或经验常数。真实分析必须冻结法律实体、账户性质、净额集合、抵押品权利、清算链、规则版本、截止时间和内部限额。保存只限本设备、本浏览器和当前题库版本。</p>
    </div>
  );
}
