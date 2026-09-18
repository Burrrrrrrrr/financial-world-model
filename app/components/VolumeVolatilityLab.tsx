'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'measurement' | 'identification';

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

const measurementScenarios: Scenario[] = [
  {
    id: 'volume-ledger',
    label: '测量基础 01 · Volume ledger',
    title: '400 笔股指期货成交、平均每笔 25 张：标准单边口径的合约量与成交名义金额是多少？',
    brief: '每笔成交都有买方和卖方，但标准成交量把一次撮合计一次。名义金额还需把期货点位乘以每点合约乘数；它不是实际支付的保证金。',
    facts: [
      { label: 'Trades', value: 'N = 400', note: '窗口内已撮合成交笔数' },
      { label: 'Average size', value: 'q̄ = 25 contracts', note: '每笔平均张数，不是母单规模' },
      { label: 'Price × multiplier', value: '4,000 × $50/point', note: 'VWAP 是成交量加权平均点位；乘数把点位换成每张名义金额' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '10,000 张；$2,000,000,000', diagnosis: '正确：先用 Q=N×q̄ 得到张数，再乘点位和合约乘数；一笔转移只计一次。' },
      { id: 'b', label: '20,000 张；$4,000,000,000', diagnosis: '你把买方和卖方分别计入了总量。标准单边口径下一次撮合不是两次经济转移。' },
      { id: 'c', label: '10,000 张；$40,000,000', diagnosis: '你只乘了点位，遗漏 $50/point 的合约乘数。名义金额也不等于初始保证金。' },
    ],
    calculation: 'Q=400×25=10,000 张；notional=10,000×4,000×$50=$2,000,000,000。',
    reveal: '期货成交量、未平仓量、名义金额和保证金是四个对象；正式研究还必须记录合约乘数、换月、venue 与成交修正规则。',
  },
  {
    id: 'same-volume-different-state',
    label: '测量基础 02 · OFI × depth',
    title: '在单个等长子区间内，哪个窗口的模型绝对价格移动 |r| 更大？',
    brief: 'A 的总成交量更大但主动买卖交替；B 的总量较小，却有更强单边订单流和更薄盘口。题目只比较 r≈λ·OFI 的局部移动，不把一个子区间的 |r| 冒充整窗 realized variance。',
    facts: [
      { label: 'Window A', value: 'Q=100k, |OFI|=2k', note: 'best depth≈50k，买卖流大致抵消' },
      { label: 'Window B', value: 'Q=20k, |OFI|=15k', note: 'best depth≈5k，订单压力高度单边' },
      { label: 'State rule', value: 'λ ∝ 1 / depth', note: '仅作同单位教学近似' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'A，因为总成交量是 B 的五倍', diagnosis: '总量没有方向，也没有说明盘口吸收能力；高 gross activity 可以来自双边循环。' },
      { id: 'b', label: '两者相同，因为每笔成交都有买卖双方', diagnosis: '清算恒等式不消除主动订单压力；成交方向、路径和深度仍决定报价需要移动多少。' },
      { id: 'c', label: 'B，因为单边 OFI 更大且 depth 更薄', diagnosis: '正确：在给定教学近似下，B 的 |λ·OFI| 远大于 A，尽管它的总量更低。' },
    ],
    calculation: '若 λ=c/depth，则 A 的相对压力为 2/50=0.04c，B 为 15/5=3c；B 是 A 的 75 倍。',
    reveal: '这个结果不是一条可交易规则：OFI 与 depth 同期内生，真实价格路径还受撤单、隐藏流动性、消息和跨市场报价影响。',
  },
  {
    id: 'turnover-denominator',
    label: '测量基础 03 · Turnover',
    title: '两只股票都成交 100 万股，能否说它们“换手程度相同”？',
    brief: '股票 A 的自由流通股为 1,000 万股；股票 B 为 1 亿股。假定两者股价不同，但本题只计算股数换手率。',
    facts: [
      { label: 'Volume', value: 'A=B=1,000,000', note: '相同股数成交量' },
      { label: 'Free float A', value: '10,000,000', note: '本窗口分母固定' },
      { label: 'Free float B', value: '100,000,000', note: '是 A 的十倍' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '相同；因为成交股数完全一样', diagnosis: '股数相同不代表相对可交易存量相同；跨证券比较需要明确分母。' },
      { id: 'b', label: '不同；A 为 10%，B 为 1%', diagnosis: '正确：TO=Q/free float。相同绝对量在不同资本结构下含义不同。' },
      { id: 'c', label: '无法计算；必须先知道当日收益率', diagnosis: '收益率与本题股数换手率无关；需要的是成交股数和对应时点的可交易股本。' },
    ],
    calculation: 'TOA=1m/10m=10%；TOB=1m/100m=1%。若改用总股本或 dollar volume/market cap，必须重新命名口径。',
    reveal: '拆股会机械改变股数成交量，股价变化会机械改变 dollar volume；换手率虽更可比，也仍依赖自由流通股本的定义和更新时间。',
  },
  {
    id: 'path-versus-endpoint',
    label: '测量基础 04 · Path volatility',
    title: '三段对数收益为 +0.8%、−0.3%、−0.5%，累计收益为零：realized variance 是多少？',
    brief: '这是一个未在正文手算过的新路径。对数收益可以直接相加；RV 则对每段先平方再相加。',
    facts: [
      { label: 'Path', value: '+0.8% → −0.3% → −0.5%', note: '三段方向不同的价格运动' },
      { label: 'Endpoint', value: '0%', note: '对数收益之和恰好为零' },
      { label: 'RV rule', value: 'Σ rₖ²', note: '沿途每段收益先平方再相加' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'RV=0；因为三段收益相加为零', diagnosis: '这是把累计收益和 realized variance 混为一谈。RV 对每段先平方，方向不会抵消。' },
      { id: 'b', label: 'RV=0.000098；波动率约 0.99%', diagnosis: '正确：0.008²+0.003²+0.005²=0.000098，再开平方约为 0.00990。' },
      { id: 'c', label: 'RV=0.016；因为绝对收益合计 1.6%', diagnosis: '1.6% 是绝对收益和，不是方差；RV 的单位是收益平方。' },
    ],
    calculation: 'R=0.008−0.003−0.005=0；RV=0.000064+0.000009+0.000025=0.000098；√RV≈0.9899%。',
    reveal: '累计 signed flow 接近零也有同样边界：若买卖压力先后推动价格来回，窗口末端不平衡或收益接近零，沿途波动仍可很高。',
  },
];

const identificationScenarios: Scenario[] = [
  {
    id: 'latent-mixture',
    label: '识别基础 01 · Contemporaneous relation',
    title: '去除日内季节性后，成交量与 realized variance 的同期相关系数仍为 0.55。最弱可支持结论是什么？',
    brief: '研究没有外生干预，也没有观察全部新闻、分歧、流动性需求、深度与风险约束。',
    facts: [
      { label: 'Correlation', value: 'corr(Q,RV)=0.55', note: '给定样本与控制变量后的同一窗口相关' },
      { label: 'Timing', value: 'Contemporaneous', note: '两变量在同一时间格测量' },
      { label: 'Identification', value: 'No intervention', note: '潜在共同状态未被随机化' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '成交量增加会因果性地提高波动', diagnosis: '同期相关无法排除共同信息状态、深度变化或波动反向触发交易。' },
      { id: 'b', label: '55% 的波动由成交量造成', diagnosis: '相关系数既不是解释方差比例，也不是结构因果份额。' },
      { id: 'c', label: '在该样本与控制集下存在正向同期共变；方向、共同原因与机制均未识别', diagnosis: '正确：证据只支持条件同期共变，不区分 Q→RV、RV→Q、共同原因或控制变量设定造成的残余关系。' },
    ],
    calculation: 'corr=0.55 只描述标准化共同运动；即使平方得到 0.3025，也不能在非单变量因果设计中解释为“造成 30.25%”。',
    reveal: 'MDH 是与该事实相容的候选结构解释之一；较好拟合仍不是对潜在业务时间、因果方向或唯一机制的直接识别。',
  },
  {
    id: 'quote-before-trade',
    label: '识别基础 02 · Cross-market quote lead',
    title: '宏观数据发布后，标的期货先跳变，ETF 的 BBO 也在 ETF 第一笔成交前整体上移。这个序列最直接反驳什么命题？',
    brief: 'BBO 是 best bid and offer，即当时最优可执行买价与卖价。假定期货和 ETF 的交易所时间戳可靠对齐；后续 ETF 成交仍可能继续承担价格发现和风险转移。',
    facts: [
      { label: 't=0', value: 'Public release', note: '所有人可同时观察的公告' },
      { label: 't=7 ms', value: 'Futures reprice', note: '标的期货最优报价先上移' },
      { label: 't=18 / 36 ms', value: 'ETF BBO / trade', note: 'ETF 最优报价先调整，第一笔 ETF 成交随后出现' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '没有成交，价格就不可能吸收信息', diagnosis: '正确：可执行报价本身已经改变可交易价格；成交不是所有价格发现的必要前置条件。' },
      { id: 'b', label: '公开新闻可以影响价格', diagnosis: '事件序列反而与这个命题一致，并没有反驳它。' },
      { id: 'c', label: '后续成交可能完成风险转移', diagnosis: '报价先动不排除随后交易具有经济功能；两者可以同时成立。' },
    ],
    calculation: '可观察顺序为 release → futures quote → ETF BBO → ETF trade；这证明该事件中至少一部分 ETF 可交易价格更新先于 ETF 执行量出现。',
    reveal: '事件顺序不是完整因果识别：数据泄漏、跨市场路由、时钟误差和 quote staleness 仍需排除。但它足以否定“本市场先有成交量，价格才可能变化”的绝对说法。',
  },
  {
    id: 'intraday-seasonality',
    label: '识别基础 03 · Common seasonality',
    title: '开盘成交 24 万股、历史同格基准 20 万股；午间成交 15 万股、历史同格基准 10 万股。哪个窗口更“异常放量”？',
    brief: '目标是把原始量放回同一股票、同一星期结构、同一时间格的历史基准中比较。基准只能使用当时已经可得的历史数据。',
    facts: [
      { label: 'Open', value: '240k / 200k = 1.20', note: '相对同格基准高 20%' },
      { label: 'Midday', value: '150k / 100k = 1.50', note: '相对同格基准高 50%' },
      { label: 'Unit', value: 'stock × weekday × 5 min', note: '同一证券与日内格的历史条件基准' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '开盘更异常，因为 240k 大于 150k', diagnosis: '这是比较原始水平；它忽略开盘本来就比午间活跃的稳定季节性。' },
      { id: 'b', label: '午间更异常，因为相对同格基准高 50%', diagnosis: '正确：异常活动要相对预先估计的同格基准衡量；午间的相对 surprise 更大。' },
      { id: 'c', label: '两者同样异常，因为都高于历史基准', diagnosis: '方向相同不等于幅度相同；在这个简单比例标准化下，20% 与 50% 不相等。' },
    ],
    calculation: '开盘 surprise=240/200−1=20%；午间 surprise=150/100−1=50%。若基准波动不同，还可用只在训练期估计的标准差进一步标准化。',
    reveal: '这只识别哪一格的成交活动相对更异常。若要研究异常量与异常 RV 的关系，还必须分别构造 RV surprise 再做同期、预测或因果检验；季节性的形成机制留给 1.16。',
  },
  {
    id: 'forecasting-gate',
    label: '识别基础 04 · Out-of-sample',
    title: '加入滞后成交量后，样本内 R² 上升。什么时候才能说它对未来波动“有增量预测价值”？',
    brief: '目标为下一交易日 RV。HAR-RV 是用过去日、周、月三个尺度的 realized variance 预测未来 RV 的异质自回归基准；量的去趋势和所有超参数都必须只在训练窗口估计。',
    facts: [
      { label: 'In-sample', value: 'R² ↑', note: '增加变量几乎不会降低拟合度' },
      { label: 'Baseline', value: 'HAR-RV + observables', note: '日/周/月滞后 RV，并与 OFI、spread、depth 等可观测状态变量比较' },
      { label: 'Protocol', value: 'Rolling / expanding', note: '严格时间顺序与真实可得信息' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '样本内 R² 上升就已经足够', diagnosis: '新增变量可机械提高拟合；这不证明未来数据上的损失更低。' },
      { id: 'b', label: '只要成交量系数显著即可', diagnosis: '显著同期或样本内系数不等于样本外增量，更不等于结构因果。' },
      { id: 'c', label: '严格滚动样本外优于预先冻结的强基准', diagnosis: '正确：需报告 QLIKE/MSE、增量 OOS R²、不确定性，并杜绝标准化泄漏。' },
    ],
    calculation: '比较 loss(HAR-RV+state) 与 loss(HAR-RV+state+volume surprise)。QLIKE 是针对方差预测的非对称损失，MSE 是平方误差；只接受真实时间顺序下稳定且经济上有意义的增量。',
    reveal: '即使通过预测门槛，结论仍只是“量含有基准信息集未完全吸收的增量预测信息”，既没有识别潜在状态，也不是“成交量因果制造未来波动”。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...measurementScenarios.map((item, index) => ({ id: item.id, mode: 'measurement' as const, index })),
  ...identificationScenarios.map((item, index) => ({ id: item.id, mode: 'identification' as const, index })),
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
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

export default function VolumeVolatilityLab() {
  const [mode, setMode] = useState<Mode>('measurement');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submittedScenarioIds, setSubmittedScenarioIds] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'measurement' ? measurementScenarios : identificationScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;
  const nextUnsubmitted = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));

  useEffect(() => {
    if (revealed || completed) {
      resultRef.current?.focus();
      return;
    }
    if (pendingFocusRef.current === 'question') questionTitleRef.current?.focus();
    if (pendingFocusRef.current === 'option') firstOptionRef.current?.focus();
    pendingFocusRef.current = null;
  }, [mode, scenarioIndex, revealed, completed]);

  function reset(nextMode = mode, nextIndex = scenarioIndex) {
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setChoice('');
    setRevealed(false);
    setCompleted(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode && !completed) return;
    pendingFocusRef.current = 'question';
    reset(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex && !completed) return;
    pendingFocusRef.current = 'question';
    reset(mode, nextIndex);
  }

  function retryScenario() {
    pendingFocusRef.current = 'option';
    reset();
  }

  function submitScenario() {
    setSubmittedScenarioIds((current) => current.includes(scenario.id) ? current : [...current, scenario.id]);
    setRevealed(true);
  }

  function nextScenario() {
    const nextTarget = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));
    if (nextTarget) {
      pendingFocusRef.current = 'question';
      reset(nextTarget.mode, nextTarget.index);
      return;
    }
    setCompleted(true);
  }

  function restartLab() {
    pendingFocusRef.current = 'question';
    setSubmittedScenarioIds([]);
    reset('measurement', 0);
  }

  const modeLabel = mode === 'measurement' ? '测量与分解' : '机制与识别';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'identification' && mode === 'measurement'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="volume-volatility-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>VOLUME · ORDER FLOW · DEPTH · VOLATILITY</span>
          <h3>把“市场很忙”拆成可比口径，再判断价格为何移动、证据究竟支持哪种推断</h3>
        </div>
        <p>两种模式各四题。每题先锁定单位、时间与反事实，再揭示计算、因果边界和最弱可支持结论。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="成交量与波动实验模式">
        <button type="button" aria-pressed={mode === 'measurement'} onClick={() => selectMode('measurement')}>
          <span>MODE A</span><b>Measure &amp; Decompose</b><small>总量、换手、OFI、深度与路径波动</small>
        </button>
        <button type="button" aria-pressed={mode === 'identification'} onClick={() => selectMode('identification')}>
          <span>MODE B</span><b>Infer &amp; Falsify</b><small>同期共变、报价先行、季节性与样本外预测</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          return (
            <button
              type="button"
              key={item.id}
              aria-label={`${number} ${shortLabel}，${submitted ? '已提交' : '未提交'}`}
              aria-pressed={index === scenarioIndex}
              onClick={() => selectScenario(index)}
            >
              <span aria-hidden="true">{submitted ? '✓' : number}</span>{shortLabel}
            </button>
          );
        })}
      </div>

      <div className="impact-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1}>{scenario.title}</h3>
        <p>{scenario.brief}</p>
      </div>

      <ScenarioFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={'volume-volatility-' + mode + '-' + scenario.id}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完成</b>
          <p>你已经提交全部八题并完成两种模式：先把 Q、换手、OFI、深度和路径 RV 分开，再把同期共变、报价先行、季节性标准化与样本外预测分开。</p>
          <strong>完成并不表示量已经成为波动的因果解释；最可靠的结论仍取决于口径、时钟、反事实和可排除的竞争机制。</strong>
          <div>
            <button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button>
          </div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算、机制解释与推断边界仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <code>{scenario.calculation}</code>
          <strong>{scenario.reveal}</strong>
          <div>
            <button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button>
            <button type="button" className="impact-primary" onClick={nextScenario}>{nextLabel}</button>
          </div>
        </div>
      )}

      <p className="impact-lab-caveat"><b>实验边界：</b>所有数值均为题目内的教学参数，不是经验校准或交易信号。真实判断还需处理场所合并、成交修正、签名误差、隐藏流动性、日内制度、微观结构噪声和严格时间对齐。</p>
    </div>
  );
}
