'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'common-price' | 'timing';

type Option = {
  id: string;
  label: string;
  diagnosis: string;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: string;
  options: Option[];
  calculation: string;
  reveal: string;
};

const commonPriceScenarios: Scenario[] = [
  {
    id: 'cointegration-candidate',
    label: '共同价格 01 · 长期约束',
    title: '仅根据这些路径特征，哪项判断最稳健？',
    brief: '两个价格已换算为同一经济暴露和同一货币单位；题目尚未提供正式单位根或 rank 检验。',
    facts: [
      { label: '价格 A level', value: '持续漂移', note: '长期均值不稳定' },
      { label: '价格 B level', value: '持续漂移', note: '长期均值不稳定' },
      { label: 'A−B', value: '围绕 0 回归', note: '偏离没有无限扩散' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'A、B 的价格水平都已证明是 stationary', diagnosis: '你把差价可能平稳的性质错误传给了两个各自漂移的 level。' },
      { id: 'b', label: 'A、B 可能是 I(1)、rank-1 cointegrated；仍需正式检验', diagnosis: '正确：路径与单一共同趋势一致，但图形不能替代 integration、rank 和稳定性检验。' },
      { id: 'c', label: '高共同变动已经证明 A 是 price-discovery leader', diagnosis: '相关或共同漂移既不识别 cointegration rank，也不分配发现份额。' },
    ],
    calculation: '候选关系是 pA,t−pB,t≈I(0)，而 pA,t、pB,t≈I(1)。两个价格、一个共同趋势时，候选 cointegration rank 为 2−1=1。',
    reveal: 'Cointegration 只说明长期约束存在；谁在纠偏、谁贡献共同创新，还要进入 VECM、innovation covariance 与份额分解。',
  },
  {
    id: 'vecm-correction',
    label: '共同价格 02 · 误差修正',
    title: '下一步由长期偏离触发的价格修正分别是多少？',
    brief: '忽略短期 lag 项与新 innovation；z=pF−pS，Δpi=αi·z。',
    facts: [
      { label: '均衡误差', value: 'z = +10 bp', note: 'Futures 相对 spot-equivalent 偏高' },
      { label: 'Futures loading', value: 'αF = −0.10', note: '负号意味着偏高后向下修正' },
      { label: 'Spot loading', value: 'αS = +0.40', note: '正号意味着偏高差价下 spot 向上修正' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'Futures +1 bp；spot −4 bp', diagnosis: '两侧方向都写反了，会让原有偏离继续扩大。' },
      { id: 'b', label: 'Futures 与 spot 各修正 2.5 bp', diagnosis: 'VECM 不会自动平均差价；各市场按自己的 α loading 调整。' },
      { id: 'c', label: 'Futures −1 bp；spot +4 bp', diagnosis: '正确：−0.10×10=−1，+0.40×10=+4；spot 承担更多当期纠偏。' },
    ],
    calculation: 'ΔpF=−0.10×10 bp=−1 bp；ΔpS=+0.40×10 bp=+4 bp。若其他项为零，偏离从 10 bp 缩到约 5 bp。',
    reveal: 'Futures 的 |αF| 点估计较小，只说明它在本题中纠偏较少；只有在指定系统中检验 H0: αF=0，才可讨论 weak exogeneity。这仍不是信息因果起源的证明。',
  },
  {
    id: 'diagonal-information-share',
    label: '共同价格 03 · 独立创新',
    title: '当两个 reduced-form innovations 不相关时，Hasbrouck information shares 是多少？',
    brief: '共同价格 innovation 为 ψ′ν；Σ 为 diagonal，因此没有 covariance cross-term 需要分配。',
    facts: [
      { label: '长期 loading', value: 'ψ = (0.8, 0.2)′', note: '两个 innovation 对共同趋势的长期映射' },
      { label: 'Innovation covariance', value: 'Σ = diag(1, 4)', note: '方差分别为 1 与 4，协方差为 0' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '共同方差 0.80；IS = 80% / 20%', diagnosis: '正确：贡献为 0.8²×1=.64 与 0.2²×4=.16，归一化后为 .80/.20。' },
      { id: 'b', label: 'IS 约为 94% / 6%', diagnosis: '你只平方并归一化 ψ，遗漏了第二市场较大的 innovation variance。' },
      { id: 'c', label: 'IS = 50% / 50%', diagnosis: '市场数量相同不意味着它们对共同 innovation variance 的贡献相同。' },
    ],
    calculation: 'Var(Δm)=ψ′Σψ=.8²×1+.2²×4=.64+.16=.80；IS1=.64/.80=.80，IS2=.16/.80=.20。',
    reveal: 'Diagonal Σ 让方差贡献可以唯一相加。IS 分配的是模型共同创新方差，不是知情交易占比或经济信息的法律来源。',
  },
  {
    id: 'component-share',
    label: '共同价格 04 · 永久成分权重',
    title: '二市场 Gonzalo–Granger component shares 是多少？',
    brief: '共同 loading 为 (1,1)′，cointegrating relation 为 p1−p2；CS 从 adjustment loadings 构造。',
    facts: [
      { label: 'Market 1 loading', value: 'α1 = −0.10', note: '偏离后向下纠偏' },
      { label: 'Market 2 loading', value: 'α2 = +0.40', note: '承担更大幅度纠偏' },
      { label: '二市场公式', value: 'CS1=α2/(α2−α1)', note: 'CS2=−α1/(α2−α1)' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'CS = 20% / 80%', diagnosis: '你把“谁纠偏更多”误写成“谁进入 permanent component 更多”。' },
      { id: 'b', label: 'CS = 50% / 50%', diagnosis: 'Cointegrating vector 的 1/−1 规定长期差价，不等于共同成分权重。' },
      { id: 'c', label: 'CS = 80% / 20%', diagnosis: '正确：0.40/0.50=.80，0.10/0.50=.20。' },
    ],
    calculation: 'CS1=.40/[.40−(−.10)]=.80；CS2=.10/.50=.20；两者和为 1。',
    reveal: 'Market 1 的 CS 较高，正因为 market 2 承担更多 error correction。CS 是 price-level component weight，不是 innovation variance share。',
  },
];

const timingScenarios: Scenario[] = [
  {
    id: 'correlated-innovations',
    label: '时间识别 01 · 同步创新',
    title: '两个 innovation 高度相关时，information share 最稳健的报告是什么？',
    brief: '两个市场的长期 loading 与边际 innovation variance 对称，但 reduced-form innovations 同期相关。',
    facts: [
      { label: '长期 loading', value: 'ψ = (0.5, 0.5)′', note: '两者映射相同' },
      { label: 'Covariance', value: 'Σ = [[1,.8],[.8,1]]', note: '同刻共同变化很强' },
      { label: '总共同方差', value: 'ψ′Σψ = 0.90', note: '包含 covariance cross-term' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '对称性唯一识别 IS = 50% / 50%', diagnosis: '对称性可以支持摘要，但 covariance cross-term 仍没有天然归属，不能称唯一识别。' },
      { id: 'b', label: '两种排序给 90/10 与 10/90；每个市场 bounds 为 10%–90%', diagnosis: '正确：换排序会交换谁先吸收 contemporaneous covariance。' },
      { id: 'c', label: 'Market 1 的 IS 永远为 90%', diagnosis: '90% 只来自 market 1 排在 Cholesky 首位的一个排序。' },
    ],
    calculation: '排序 1→2 时 L=[[1,0],[.8,.6]]，ψ′L=(.9,.3)，平方后为 .81/.09，即 90%/10%；反向排序交换份额。',
    reveal: 'Hasbrouck bounds 不是统计不精确造成的普通置信区间，而是 reduced-form contemporaneous covariance 没有唯一经济主人。',
  },
  {
    id: 'asynchronous-feed',
    label: '时间识别 02 · 异步 Feed',
    title: '观察到 2 毫秒更新差后，最稳健的下一步是什么？',
    brief: '接收端 feed latency 未知；两条序列使用 carried-forward previous-tick price 对齐。',
    facts: [
      { label: '公共新闻', value: 'τ = 0', note: '同一预定发布时点' },
      { label: 'Futures feed', value: 'τ + 4 ms', note: '研究者收到更新' },
      { label: 'ETF consolidated feed', value: 'τ + 6 ms', note: '研究者收到更新' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '先同步 exchange timestamps 并审计 feed latency；目前不足以判定 2 ms leader', diagnosis: '正确：接收时点混合了生成、传输与聚合延迟。' },
      { id: 'b', label: 'Futures 已确定领先 2 ms', diagnosis: '你把研究者收到 feed 的时间当成交易所生成 quote 的时间。' },
      { id: 'c', label: 'ETF 实际领先，只是 consolidated feed 更慢', diagnosis: '未知 latency 允许这种可能，却没有证据支持反向确定结论。' },
    ],
    calculation: 'Observed time = exchange event time + venue/feed transport + consolidation + receiver latency；未知差项时，6−4=2 ms 不能唯一归给 price discovery。',
    reveal: 'Previous-tick interpolation 还会把尚未更新的旧价带到新时点，制造机械 lead–lag。应同时报告 exchange time、refresh time 与 latency sensitivity。',
  },
  {
    id: 'options-target',
    label: '时间识别 03 · 期权目标',
    title: 'Call premium 先变化时，哪项结论最准确？',
    brief: '同一时刻 IV（implied volatility，由期权价格反推的隐含波动率参数）也跳升；没有同步匹配的 put、行权价 K、到期日 T 与 parity inputs。',
    facts: [
      { label: 'Call premium', value: '先上升', note: '原始期权权利金变化' },
      { label: 'Implied volatility', value: '同步上升', note: '方向与波动效应混合' },
      { label: 'Parity inputs', value: '缺失', note: '无法构造可比 implied forward' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'Options 已证明先发现 spot direction', diagnosis: 'Call premium 同时编码方向、波动、期限和利率，不能只归为 spot direction。' },
      { id: 'b', label: 'Options 应完全从 price-discovery 研究删除', diagnosis: '期权可能首先吸收 volatility 或 tail information，只是研究目标必须重定义。' },
      { id: 'c', label: 'Raw option price 不足以排名；先定义 direction 或 volatility target', diagnosis: '正确：方向研究需构造可比 implied forward，或把问题明确改成 volatility/tail discovery。' },
    ],
    calculation: '若有同步、同一行权价 K 与到期日 T 的 European call/put，可在明确贴现因子和合约约定下用 Fimpl=K+e^(r(T−t))(C−P) 反演 forward；若再映射成 spot-equivalent，才另需分红/carry 假设。本题缺少匹配合约。',
    reveal: '“哪个市场发现价格”必须先说明发现的是方向、波动率、尾部风险还是流动性状态。不同 target 可能有不同 leader。',
  },
  {
    id: 'cash-closed',
    label: '时间识别 04 · 交易时段',
    title: 'Cash market 闭市期间 futures 对新闻反应，最稳健的结论是什么？',
    brief: 'Cash 次日开盘跳空到接近 futures 的新水平；没有同时开市状态的数据。',
    facts: [
      { label: '新闻时点', value: 'Cash closed', note: '现货无法产生新可交易 quote' },
      { label: 'Futures', value: '当时连续更新', note: '可观察的交易接口' },
      { label: 'Cash', value: '次日跳空', note: '开市后才重新报价' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'Futures 永久主导所有交易时段', diagnosis: '你把一个市场无法更新的特殊状态外推成了无条件排名。' },
      { id: 'b', label: 'Futures 在 cash closed 状态承担可观察 timing discovery；不能外推到同时开市', diagnosis: '正确：结论保留了制度状态和估计对象。' },
      { id: 'c', label: 'Cash 才是真实价格，所以 futures 反应不算 price discovery', diagnosis: '直接持有 claim 不等于任何时刻都能更快吸收信息；闭市时 futures 是可交易表达接口。' },
    ],
    calculation: '可观察事实是 event-time first/persistent response 出现在 futures；同时开市时的 VECM、IS 或 CS 没有由这段样本识别。',
    reveal: '领先者会随交易时段、新闻类型、约束和流动性切换。状态条件不是附注，而是 price-discovery estimand 的一部分。',
  },
];

function DiscoveryFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" aria-label="题目原始事实">
      {scenario.facts.map((fact) => (
        <article key={fact.label}>
          <span>{fact.label}</span>
          <b>{fact.value}</b>
          <p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function PriceDiscoveryLab() {
  const [mode, setMode] = useState<Mode>('common-price');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'common-price' ? commonPriceScenarios : timingScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;

  useEffect(() => {
    if (revealed) {
      resultRef.current?.focus();
      return;
    }
    if (pendingFocusRef.current === 'question') questionTitleRef.current?.focus();
    if (pendingFocusRef.current === 'option') firstOptionRef.current?.focus();
    pendingFocusRef.current = null;
  }, [mode, scenarioIndex, revealed]);

  function reset(nextMode = mode, nextIndex = scenarioIndex) {
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setChoice('');
    setRevealed(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode) return;
    pendingFocusRef.current = 'question';
    reset(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex) return;
    pendingFocusRef.current = 'question';
    reset(mode, nextIndex);
  }

  function retryScenario() {
    pendingFocusRef.current = 'option';
    reset();
  }

  function nextScenario() {
    pendingFocusRef.current = 'question';
    reset(mode, (scenarioIndex + 1) % scenarios.length);
  }

  return (
    <div className="price-discovery-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>PRICE DISCOVERY · COMMON TREND → CLOCK AUDIT</span>
          <h3>先计算共同价格份额，再审计“先动”究竟支持到哪一层</h3>
        </div>
        <p>两种模式各四题。提交前只给模型事实或时间路径；计算、诊断与识别边界在作答后揭示。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="价格发现实验模式">
        <button type="button" aria-pressed={mode === 'common-price'} onClick={() => selectMode('common-price')}>
          <span>MODE A</span><b>共同价格与份额</b><small>Cointegration、VECM、IS 与 CS</small>
        </button>
        <button type="button" aria-pressed={mode === 'timing'} onClick={() => selectMode('timing')}>
          <span>MODE B</span><b>时钟与识别边界</b><small>Covariance、feed、options 与 trading hours</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${mode === 'common-price' ? '共同价格与份额' : '时钟与识别边界'}题目`}>
        {scenarios.map((item, index) => (
          <button type="button" key={item.id} aria-pressed={index === scenarioIndex} onClick={() => selectScenario(index)}>
            <span>{String(index + 1).padStart(2, '0')}</span>{item.label.split(' · ')[1]}
          </button>
        ))}
      </div>

      <div className="impact-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1}>{scenario.title}</h3>
        <p>{scenario.brief}</p>
      </div>

      <DiscoveryFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={`price-discovery-${mode}-${scenario.id}`}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {!revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={() => setRevealed(true)}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算过程、误区诊断与识别边界仍被锁定。</p>
        </>
      ) : (
        <div className={`impact-result ${correct ? 'correct' : ''}`} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <code>{scenario.calculation}</code>
          <strong>{scenario.reveal}</strong>
          <div>
            <button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button>
            <button type="button" className="impact-primary" onClick={nextScenario}>下一题</button>
          </div>
        </div>
      )}

      <p className="sr-only" role="status" aria-live="polite">
        {revealed ? (correct ? '判断成立，计算与识别解释已显示。' : '需要修正，诊断、计算与识别解释已显示。') : ''}
      </p>

      <p className="impact-lab-caveat"><b>实验边界：</b>这些题训练 common-trend 分解与时间证据审计，不是跨市场交易信号。真实份额依赖合约映射、样本、cointegration rank、时钟、innovation covariance、交易制度与估计协议。</p>
    </div>
  );
}
