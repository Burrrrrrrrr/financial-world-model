'use client';

import { useEffect, useRef, useState } from 'react';

type Mode = 'frontier' | 'audit';
type MarketId = 'needle' | 'warehouse' | 'patient';

type SyntheticMarket = {
  id: MarketId;
  code: string;
  spread: number;
  depth: number;
  sweepCost: number;
  patientFill: number;
  recoveryT50: number;
  recoveryProbability: number;
};

const markets: SyntheticMarket[] = [
  {
    id: 'needle',
    code: 'MARKET A',
    spread: 0.8,
    depth: 800,
    sweepCost: 13.8,
    patientFill: 52,
    recoveryT50: 72,
    recoveryProbability: 61,
  },
  {
    id: 'warehouse',
    code: 'MARKET B',
    spread: 2.6,
    depth: 14000,
    sweepCost: 3.8,
    patientFill: 84,
    recoveryT50: 12,
    recoveryProbability: 95,
  },
  {
    id: 'patient',
    code: 'MARKET C',
    spread: 1.8,
    depth: 4500,
    sweepCost: 6.1,
    patientFill: 96,
    recoveryT50: 105,
    recoveryProbability: 55,
  },
];

type TaskScenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  constraint: string;
  correct: MarketId;
  explanation: string;
  diagnoses: Record<MarketId, string>;
};

const taskScenarios: TaskScenario[] = [
  {
    id: 'small-now',
    label: '任务 01 · 小单立即成交',
    title: '现在买入 200 股；除此之外没有等待价值，也不会跨越第一档。',
    brief: '目标是把这一笔小额即时买入的报价入口成本压到最低。',
    constraint: '规模 200 股 · 立即完成 · 只触及最优报价',
    correct: 'needle',
    explanation: '题干已说明 200 股不会跨越第一档；在报价相对 mid 对称的合成设定中，full quoted spread 最窄的 A 也有最低的单向 ask 入口让步。此结论只针对给定规模与时限；它没有证明 A 对大单也最流动。',
    diagnoses: {
      needle: '你把“小到不会吃穿第一档”这个条件用对了：此时 tightness 是主要判别量。',
      warehouse: 'B 的深度和恢复很强，但这笔 200 股订单用不到那些容量；2.6 bp 的入口价差反而更贵。',
      patient: 'C 的优势来自允许等待后的完成概率；题目要求立即成交，不能用另一项任务上的优势替代当前目标。',
    },
  },
  {
    id: 'block-now',
    label: '任务 02 · 大单立即成交',
    title: '现在买入 10,000 股；必须一次性完成，不能等待新挂单。',
    brief: '目标是使整笔订单相对初始 mid 的平均价格让步最低。',
    constraint: '规模 10,000 股 · 立即完成 · 比较完整扫簿成本',
    correct: 'warehouse',
    explanation: 'B 虽有 2.6 bp 的入口价差，却能在 mid 至 +5 bp 的卖方价格带内容纳 14,000 股，10,000 股教学扫簿成本只有 3.8 bp。A 的 0.8 bp 只描述最优档入口，薄簿使整单成本跃升到 13.8 bp。',
    diagnoses: {
      needle: '你被最窄 spread 吸引，却忽略了订单规模。A 的 800 股近端容量远小于 10,000 股，tightness 不能代替 depth。',
      warehouse: '你比较了完整数量的价格—数量曲线，而不是只看最优一档；这正是大单任务所需的判断。',
      patient: 'C 允许等待时很有竞争力，但题目禁止等待；6.1 bp 的即时扫簿成本仍高于 B。',
    },
  },
  {
    id: 'patient-cap',
    label: '任务 03 · 有成本上限的耐心执行',
    title: '买入 10,000 股，可等待 60 秒；平均价格让步必须控制在 2.5 bp 内。',
    brief: '目标是在成本约束下最大化 60 秒内完整成交概率。',
    constraint: '规模 10,000 股 · 截止 60 秒 · 成本上限 2.5 bp',
    correct: 'patient',
    explanation: '在统一的 2.5 bp 成本上限与 60 秒窗口内，C 的合成完整成交概率为 96%，高于 B 的 84% 与 A 的 52%。Immediacy 不是“谁毫秒更快”的孤立排名，而是给定数量、价格约束与截止时间后的完成分布。',
    diagnoses: {
      needle: 'A 的屏幕 spread 很窄，但这不保证大单在严格成本上限内及时补齐；它的合成完成概率只有 52%。',
      warehouse: 'B 很快且深，84% 已经不错；但题目在统一成本上限下比较截止前完成概率，C 的 96% 更高。',
      patient: '你保持了成本、数量与时限三项条件，比较的是同一个执行任务，而不是无条件地给市场贴“快/慢”标签。',
    },
  },
  {
    id: 'repeated-shock',
    label: '任务 04 · 连续冲击下重复执行',
    title: '你要为连续冲击做第一轮筛选；只根据表中两项恢复摘要，哪个市场在速度与可靠性上同时占优？',
    brief: '找出条件 τ50 更短且 180 秒恢复事件概率更高的市场；不要把两项摘要升级成任意时点的完整恢复分布。',
    constraint: '目标：条件 τ50 越短越好 · P(180 秒内修复 80%) 越高越好',
    correct: 'warehouse',
    explanation: 'B 的条件 τ50 为 12 秒，在三者中最短；180 秒内达到 80% 修复的概率为 95%，也在三者中最高。因此 B 在题目给出的两项摘要上严格占优。这个结论不能推出“B 在任意 20 秒内必然恢复”，因为完整条件分布尚未给出。',
    diagnoses: {
      needle: 'A 的 full spread 最窄，却有更长的 72 秒条件 τ50 和更低的 61% 恢复事件概率；tightness 不能替代动态恢复摘要。',
      warehouse: '你同时比较了条件恢复速度与恢复事件可靠性；B 在题目公开的两项摘要上都严格占优。',
      patient: 'C 对单笔耐心执行有优势，却有最长的 105 秒条件 τ50 和最低的 55% 恢复事件概率；immediacy 与 resiliency 不能互换。',
    },
  },
];

type AuditScenario = {
  id: string;
  label: string;
  claim: string;
  evidence: string;
  options: { id: string; label: string; diagnosis: string }[];
  correct: string;
  conclusion: string;
};

const auditScenarios: AuditScenario[] = [
  {
    id: 'same-spread',
    label: '审计 01 · 相同 spread',
    claim: '“两处市场的 quoted spread 都是 1 bp，所以它们具有相同流动性。”',
    evidence: 'X 在前后 2 bp 内有 18,000 股；Y 只有 700 股。其余条件暂未观察。',
    options: [
      { id: 'valid', label: '结论成立：spread 已经概括全部流动性', diagnosis: 'Quoted spread 只给出小规模、屏幕时点的 tightness；它没有包含数量曲线。' },
      { id: 'tight-only', label: '只能说观察到的 tightness 相同，depth 明显不同', diagnosis: '正确：同一 1 bp 入口价格可以连接完全不同的可成交数量。' },
      { id: 'depth-only', label: '只能说 depth 相同，tightness 无法比较', diagnosis: '证据恰好直接给出了相同 spread 与不同近端数量；你把两个维度交换了。' },
    ],
    correct: 'tight-only',
    conclusion: '相同 spread 只锁定一个极局部切片。大单执行者必须再看累计深度、价格曲线和隐藏/跨场所数量。',
  },
  {
    id: 'volume',
    label: '审计 02 · 高成交量',
    claim: '“今天成交量创纪录，因此市场今天一定非常流动。”',
    evidence: '成交量上升 4 倍，同时 spread 扩大、单位净订单流对应的价格变化上升、近端 depth 下降。',
    options: [
      { id: 'illiquid', label: '结论不成立：活动很高，吸收能力却在恶化', diagnosis: '正确：压力卖出可以同时制造高 volume、高成本、低 depth 与高 impact。' },
      { id: 'volume-wins', label: '结论成立：更多成交自动意味着更强吸收能力', diagnosis: '高交易需求可以与供给退缩同时发生；实现了很多成交不等于每笔成交便宜。' },
      { id: 'no-information', label: '成交量完全没有信息，任何研究都应删除它', diagnosis: '过度修正。Volume 能描述活动和需求强度，只是不能脱离价格成本与状态单独命名为流动性。' },
    ],
    correct: 'illiquid',
    conclusion: 'Volume 是已发生交易的数量；流动性是市场在给定成本和时间约束下吸收交易意图的能力。需求暴增会让前者高、后者差。',
  },
  {
    id: 'fast-expensive',
    label: '审计 03 · “更快成交”',
    claim: '“市场 P 平均 2 秒完成，市场 Q 平均 15 秒完成，所以 P 的 immediacy 更好。”',
    evidence: 'P 允许扫到 25 bp；Q 把平均让步限制在 3 bp。订单规模也未统一。',
    options: [
      { id: 'valid', label: '结论成立：只比较秒数即可', diagnosis: '执行时间受到价格激进度和订单规模影响；不同约束下的秒数不是同一对象。' },
      { id: 'spread', label: '只需改为比较 quoted spread，时间数据应丢弃', diagnosis: 'Spread 也不能替代成交时间或填单概率；正确做法是统一任务，而不是删掉时间维度。' },
      { id: 'normalize', label: '先统一任务约束，再比较完成时间分布', diagnosis: '正确：immediacy 是受约束的完成速度，不是脱离价格的竞速。' },
    ],
    correct: 'normalize',
    conclusion: '快可以被昂贵地“购买”。比较 immediacy 时至少要固定方向、数量、价格容忍度、时钟起点和完成定义。',
  },
  {
    id: 'news-recovery',
    label: '审计 04 · 新闻后的“恢复”',
    claim: '“公告后 mid 没有回到公告前水平，所以该市场没有 resiliency。”',
    evidence: '公告公开改变了现金流预期；spread 与 depth 在数十秒内回到新的稳定区间，但 mid 永久重估。',
    options: [
      { id: 'old-price', label: '结论成立：resiliency 必须让价格回到旧水平', diagnosis: '这会把有效价格发现误判为缺乏流动性；有信息冲击不应机械回归旧价值。' },
      { id: 'new-state', label: '应考察交易条件围绕新价格是否修复，并区分信息与非信息冲击', diagnosis: '正确：恢复对象可以是 spread、depth、impact 或无信息价格偏离，而不是任何 mid 变化。' },
      { id: 'ignore-time', label: '只要有新闻，就完全不能研究恢复速度', diagnosis: '新闻使识别更难，却不让动态市场质量失去意义；可以研究报价与容量是否围绕新状态重新形成。' },
    ],
    correct: 'new-state',
    conclusion: 'Resiliency 研究“被流量扰动的交易条件如何修复”。若冲击包含新信息，基准本身会移动；要求 mid 回旧位会混淆流动性与价格发现。',
  },
];

function MarketProfiles() {
  return (
    <div className="liquidity-profile-grid" aria-label="三个合成市场的四维状态卡">
      {markets.map((market) => (
        <article key={market.id}>
          <span>SYNTHETIC PROFILE</span>
          <h3>{market.code}</h3>
          <dl>
            <div><dt>Full quoted spread</dt><dd>{market.spread.toFixed(1)} bp</dd></div>
            <div><dt>Mid 至 +5 bp 卖方 depth</dt><dd>{market.depth.toLocaleString()} 股</dd></div>
            <div><dt>10,000 股单向 VWAP concession</dt><dd>{market.sweepCost.toFixed(1)} bp</dd></div>
            <div><dt>60 秒、2.5 bp 内完成</dt><dd>{market.patientFill}%</dd></div>
            <div><dt>条件 τ<sub>50</sub> / 恢复事件概率</dt><dd>{market.recoveryT50}s / {market.recoveryProbability}%</dd></div>
          </dl>
        </article>
      ))}
    </div>
  );
}

function FrontierMode({ focusVersion }: { focusVersion: number }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<MarketId | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const focusAfterAdvance = useRef(false);
  const scenario = taskScenarios[index];
  const correct = choice === scenario.correct;

  useEffect(() => {
    if (revealed) resultRef.current?.focus();
    else if (focusAfterAdvance.current) {
      titleRef.current?.focus();
      focusAfterAdvance.current = false;
    }
  }, [revealed, index]);

  useEffect(() => {
    if (focusVersion > 0) titleRef.current?.focus();
  }, [focusVersion]);

  function retry() {
    setChoice(null);
    setRevealed(false);
    requestAnimationFrame(() => firstChoiceRef.current?.focus());
  }

  function advance() {
    focusAfterAdvance.current = true;
    setIndex((value) => value === taskScenarios.length - 1 ? 0 : value + 1);
    setChoice(null);
    setRevealed(false);
  }

  return (
    <div className="liquidity-frontier">
      <div className="liquidity-assumption" role="note">
        <b>先读实验边界：</b>三个市场及全部数字均为人为设计的合成状态，不代表任何真实证券。所有价格量都用同一 mid 归一化；full quoted spread 是 bid 到 ask 的双向距离，立即成本则是买入 VWAP 相对 mid 的单向 concession，二者不能直接相加。Depth 都是 mid 至 +5 bp 的卖方累计显示量，完成概率都针对同一 10,000 股、60 秒和 2.5 bp 上限。恢复数字来自同一标准化卖方 depth 消耗：τ<sub>50</sub> 是在 180 秒内达到 80% 修复的路径中，首次修复一半初始损失的条件时间；“恢复事件概率”则是达到该 80% 阈值的概率。只有先统一任务，四维比较才有含义。
      </div>
      <MarketProfiles />
      <div aria-label={`任务 ${index + 1}，共 ${taskScenarios.length} 个`} aria-valuemax={taskScenarios.length} aria-valuemin={1} aria-valuenow={index + 1} className="liquidity-progress" role="progressbar">
        {taskScenarios.map((item, itemIndex) => <i aria-hidden="true" className={itemIndex < index || (itemIndex === index && revealed) ? 'done' : itemIndex === index ? 'current' : ''} key={item.id} />)}
      </div>
      <div className="liquidity-question-grid">
        <div>
          <span className="liquidity-case-label">{scenario.label}</span>
          <h3 ref={titleRef} tabIndex={-1}>{scenario.title}</h3>
          <p>{scenario.brief}</p>
          <b className="liquidity-constraint">{scenario.constraint}</b>
          <div className="liquidity-choice-grid" role="group" aria-label="选择最适合这项执行任务的市场">
            {markets.map((market, marketIndex) => (
              <button aria-pressed={choice === market.id} disabled={revealed} key={market.id} onClick={() => setChoice(market.id)} ref={marketIndex === 0 ? firstChoiceRef : undefined} type="button">
                {market.code}
              </button>
            ))}
          </div>
          <button className="liquidity-primary" disabled={!choice || revealed} onClick={() => setRevealed(true)} type="button">锁定选择并揭示机制</button>
        </div>
        <aside>
          <span>TASK-CONDITIONED LIQUIDITY</span>
          <h4>同一市场没有脱离任务的“绝对流动性名次”</h4>
          <p>每道题只改变执行者真正需要的边际。选择前先写出方向、数量、截止时间、成本上限和冲击状态，再判断哪一个维度最可能绑定。</p>
          {revealed && choice ? (
            <div aria-labelledby={`frontier-result-${scenario.id}`} className={correct ? 'liquidity-result correct' : 'liquidity-result'} ref={resultRef} role="region" tabIndex={-1}>
              <span className="sr-only" role="status">{correct ? `判断正确。${scenario.diagnoses[choice]}` : `需要修正。${scenario.diagnoses[choice]}`}</span>
              <b id={`frontier-result-${scenario.id}`}>{correct ? '✓ 判断正确' : '需要修正：主导维度或约束判断有误'}</b>
              <p>{scenario.diagnoses[choice]}</p>
              <strong>{scenario.explanation}</strong>
              <div>
                <button className="liquidity-secondary" onClick={retry} type="button">重做当前任务</button>
                <button className="liquidity-primary" onClick={advance} type="button">{index === taskScenarios.length - 1 ? '回到任务 01' : '进入下一任务'}</button>
              </div>
            </div>
          ) : <p className="liquidity-locked">先选择市场并提交；诊断会在锁定后出现。</p>}
        </aside>
      </div>
    </div>
  );
}

function AuditMode({ focusVersion }: { focusVersion: number }) {
  const [index, setIndex] = useState(0);
  const [choice, setChoice] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const firstChoiceRef = useRef<HTMLButtonElement>(null);
  const focusAfterAdvance = useRef(false);
  const scenario = auditScenarios[index];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;

  useEffect(() => {
    if (revealed) resultRef.current?.focus();
    else if (focusAfterAdvance.current) {
      titleRef.current?.focus();
      focusAfterAdvance.current = false;
    }
  }, [revealed, index]);

  useEffect(() => {
    if (focusVersion > 0) titleRef.current?.focus();
  }, [focusVersion]);

  function retry() {
    setChoice(null);
    setRevealed(false);
    requestAnimationFrame(() => firstChoiceRef.current?.focus());
  }

  function advance() {
    focusAfterAdvance.current = true;
    setIndex((value) => value === auditScenarios.length - 1 ? 0 : value + 1);
    setChoice(null);
    setRevealed(false);
  }

  return (
    <div className="liquidity-audit">
      <div className="liquidity-assumption" role="note"><b>审计规则：</b>先判断证据究竟观测了哪个维度，再检查订单规模、价格/时间约束、场所、状态和聚合窗口是否一致。答案不是给指标贴“好/坏”标签，而是限定它能支持多大的结论。</div>
      <div aria-label={`审计 ${index + 1}，共 ${auditScenarios.length} 个`} aria-valuemax={auditScenarios.length} aria-valuemin={1} aria-valuenow={index + 1} className="liquidity-progress" role="progressbar">
        {auditScenarios.map((item, itemIndex) => <i aria-hidden="true" className={itemIndex < index || (itemIndex === index && revealed) ? 'done' : itemIndex === index ? 'current' : ''} key={item.id} />)}
      </div>
      <div className="liquidity-audit-grid">
        <div>
          <span className="liquidity-case-label">{scenario.label}</span>
          <h3 ref={titleRef} tabIndex={-1}>{scenario.claim}</h3>
          <p><b>已知证据：</b>{scenario.evidence}</p>
          <div className="liquidity-choice-grid" role="group" aria-label="选择最严谨的审计结论">
            {scenario.options.map((option, optionIndex) => <button aria-pressed={choice === option.id} disabled={revealed} key={option.id} onClick={() => setChoice(option.id)} ref={optionIndex === 0 ? firstChoiceRef : undefined} type="button">{option.label}</button>)}
          </div>
          <button className="liquidity-primary" disabled={!choice || revealed} onClick={() => setRevealed(true)} type="button">提交审计意见</button>
        </div>
        <aside>
          <span>METRIC AUDIT</span>
          <h4>指标是特定数据下的投影，不是概念本身</h4>
          <p>同一代理在不同制度、资产和频率上可能改变含义。先保留测量口径，再讨论机制与因果。</p>
          {revealed && selected ? (
            <div aria-labelledby={`audit-result-${scenario.id}`} className={correct ? 'liquidity-result correct' : 'liquidity-result'} ref={resultRef} role="region" tabIndex={-1}>
              <span className="sr-only" role="status">{correct ? `审计通过。${selected.diagnosis}` : `这项结论超出了证据。${selected.diagnosis}`}</span>
              <b id={`audit-result-${scenario.id}`}>{correct ? '✓ 审计通过' : '这项结论超出了证据'}</b>
              <p>{selected.diagnosis}</p>
              <strong>{scenario.conclusion}</strong>
              <div>
                <button className="liquidity-secondary" onClick={retry} type="button">重做本题</button>
                <button className="liquidity-primary" onClick={advance} type="button">{index === auditScenarios.length - 1 ? '回到审计 01' : '进入下一审计'}</button>
              </div>
            </div>
          ) : <p className="liquidity-locked">先选择审计结论并提交；逐选项诊断会在锁定后出现。</p>}
        </aside>
      </div>
    </div>
  );
}

export default function LiquidityDimensionsLab() {
  const [mode, setMode] = useState<Mode>('frontier');
  const [focusVersion, setFocusVersion] = useState(0);

  function switchMode(next: Mode) {
    if (next === mode) return;
    setMode(next);
    setFocusVersion((value) => value + 1);
  }

  return (
    <section className="liquidity-lab" aria-labelledby="liquidity-lab-title">
      <header className="liquidity-lab-head">
        <p>INTERACTIVE · PREDICT BEFORE REVEAL</p>
        <h2 id="liquidity-lab-title">不要问“哪个市场最流动”；先问“为谁、交易多少、多久完成、允许付出什么”。</h2>
        <span>模式 A 把四个维度放回执行任务；模式 B 训练你审计 spread、volume、时间和恢复指标。每次选择都会锁定后再显示逐项诊断。</span>
      </header>
      <div className="liquidity-mode-picker" role="group" aria-label="切换互动实验模式">
        <button aria-pressed={mode === 'frontier'} onClick={() => switchMode('frontier')} type="button"><span>模式 A · 执行前沿</span><b>同一组市场，为什么会随任务更换“最优答案”？</b></button>
        <button aria-pressed={mode === 'audit'} onClick={() => switchMode('audit')} type="button"><span>模式 B · 指标审计</span><b>一个数字能支持什么，又遗漏了哪一维？</b></button>
      </div>
      {mode === 'frontier' ? <FrontierMode focusVersion={focusVersion} /> : <AuditMode focusVersion={focusVersion} />}
      <p className="liquidity-lab-caveat"><b>不要把实验输出带回真实市场当参数。</b>真实执行还受隐藏流动性、排队优先、费用、路由、订单拆分、信息泄露与市场状态影响。本实验的作用是隔离逻辑：tightness 是小量即时成本的入口，depth 是成本随数量扩张的形状，immediacy 是在约束下的完成时间分布，resiliency 是冲击后的条件恢复路径。</p>
    </section>
  );
}
