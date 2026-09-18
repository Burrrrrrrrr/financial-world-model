'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'mechanics' | 'design';

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

const mechanicsScenarios: Scenario[] = [
  {
    id: 'relative-tick',
    label: '网格基础 01 · Piecewise grid',
    title: '价格跨过 tick table 边界后，能否继续沿用原来的等距阶梯？',
    brief: '教学规则规定：p≤75.00 时局部 tick τ=0.02，该档价格网格以 0 为锚；p>75.00 时 τ=0.10，第一档为 75.10。当前中间价 m=74.96。相对 tick 统一写作 ρᵇᵖ=10,000×τ/m；1 bp 等于 0.01%。',
    facts: [
      { label: 'Lower band', value: 'p≤75.00；τ=.02', note: '不要把显示小数位数当成报价合法性' },
      { label: 'Upper band', value: 'p>75.00；τ=.10', note: '跨边界后重新枚举，不延长旧阶梯' },
      { label: 'Current scale', value: 'm=74.96', note: '先识别价格档，再把一格换算成 bp' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '74.98、75.00、75.02、75.10 全部合法；ρ=10 bp', diagnosis: '你把低档两分钱阶梯越过边界继续延伸；75.02 不在上档一角网格上，比例换算也没有得到 10 bp。' },
      { id: 'b', label: '74.98、75.00、75.10 合法，75.02 非法；当前 ρ≈2.67 bp', diagnosis: '正确：跨档要逐段枚举；当前 m 仍在下档，所以用 τ=.02 计算局部 relative tick。' },
      { id: 'c', label: '只有 75.10 合法；当前 ρ≈13.34 bp', diagnosis: '上档规则不会追溯取消下档合法价格；当前价格也尚未进入 τ=.10 的档位。' },
    ],
    calculation: '当前 ρᵇᵖ=10,000×0.02/74.96≈2.6681 bp。边界上方按 75.10、75.20…枚举，不能用 75.02、75.04…延伸旧网格。',
    reveal: '分段 tick table 是合法价格的有序集合，不是一条覆盖整个价格轴的 τℤ。Relative tick 也必须使用当前实际适用的局部 τ。',
  },
  {
    id: 'grid-step',
    label: '网格基础 02 · Inside prices',
    title: 'Spread 原本不止一格时，tick 减半会怎样增加公开改价路径？',
    brief: '当前 bid=31.20、ask=31.32，旧 tick τ=0.04，所有价格均以 0 为锚。新制度把 τ 降至 0.02；端点报价先保持不变，只比较机械可行集合。',
    facts: [
      { label: 'Current book', value: '31.20 / 31.32', note: '端点相距 0.12' },
      { label: 'Old grid', value: 'τ=.04', note: '31.24、31.28 位于 spread 内' },
      { label: 'New grid', value: 'τ=.02', note: '增加三条新的 inside 价格' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '旧制 3 ticks、2 个 inside prices；新制 6 ticks、5 个 inside prices', diagnosis: '正确：端点不变时，网格减半把三段切成六段，并新增 31.22、31.26、31.30。' },
      { id: 'b', label: '旧制 2 ticks、新制 5 ticks，因为端点不应计入', diagnosis: 'Tick 数计算的是端点之间的间隔段数，不是 inside 价位数；两者相差一。' },
      { id: 'c', label: '两种制度都只有 2 个 inside prices，因为 spread 金额没变', diagnosis: '经济金额不变不等于合法行动集合不变；网格更细会增加可停留价格。' },
    ],
    calculation: '旧制 n=(31.32−31.20)/.04=3，I=2；新制 n=.12/.02=6，I=5。新 inside 集合为 31.22、31.24、31.26、31.28、31.30。',
    reveal: 'Spread ticks 与 inside-price 数不是同一个计数。网格细化先增加可行改价，再由主体决定是否真正使用这些新档。',
  },
  {
    id: 'depth-window',
    label: '网格基础 03 · Comparable depth',
    title: 'tick 减半后 best depth 下降，能否直接说流动性减少？',
    brief: '改革前后都从同一最优卖价 25.00 起算。比较“最优一档深度”和“最优价至 25.06（含端点）的累计卖方深度”。数量均为股，假设快照同步且没有隐藏量。',
    facts: [
      { label: 'Before · τ=.02', value: '1400 / 900 / 600 / 500', note: '25.00 / .02 / .04 / .06' },
      { label: 'After · τ=.01', value: '700 / 620 / 590 / 540 / 500 / 430 / 360', note: '25.00 至 25.06 每分钱一档' },
      { label: 'Comparison', value: '同一 0.06 价格区间', note: '规则只改变分桶宽度' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '总深度 −50%，因为 best quote 从 1,400 降到 700', diagnosis: 'Best level 是随 tick 改变宽度的容器；它不能代表固定经济区间中的总数量。' },
      { id: 'b', label: '总深度 +75%，因为价位数从 4 个增到 7 个', diagnosis: '价位数量是规则机械结果，不是股数；必须实际加总同一价格窗口。' },
      { id: 'c', label: 'best depth −50%，固定区间累计深度 +10%', diagnosis: '正确：最优档减半，但 25.00–25.06 的显示数量由 3,400 增至 3,740。' },
    ],
    calculation: 'Best: (700−1400)/1400=−50%。固定区间：改革前 1400+900+600+500=3400；改革后合计 3740，变化=(3740−3400)/3400=+10%。',
    reveal: '“每档深度”与“固定经济距离内的可执行数量”回答不同问题。tick 改革研究若只比较 level 1，会把深度重分桶误写成流动性流失。',
  },
  {
    id: 'queue-jump',
    label: '网格基础 04 · Full action value',
    title: '加入未成交与消息成本后，成交概率更高的改价是否仍占优？',
    brief: '卖出 q=200 股。本题采用全成/零成的二元教学账本：期限 h 内要么 200 股全部成交，要么一股未成交，不存在部分成交；π 是 full-fill probability。使用 Vⱼ=πⱼqḡⱼ−(1−πⱼ)Cⱼᵐⁱˢˢ−Cⱼᵐˢᵍ；ḡ 已含全额成交后的价格质量和费用，单位为元/股，其余 C 为元/单。',
    facts: [
      { label: 'Join', value: 'π=.40；ḡ=.008', note: 'Cmiss=.30；Cmsg=.04' },
      { label: 'Improve', value: 'π=.70；ḡ=.0045', note: 'Cmiss=.30；Cmsg=.08' },
      { label: 'Quantity', value: 'q=200', note: '两种行动相同' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'Join 的 V=0.64，高于 Improve 的 0.63', diagnosis: '你只算了成交时收益，遗漏未成交成本和不同消息成本。' },
      { id: 'b', label: 'Join 的 V=0.42；Improve 的 V=0.46，因此 Improve 略优', diagnosis: '正确：更高 fill 抵消了较低成交后净剩余和较高消息成本，但优势只有 0.04 元/单。' },
      { id: 'c', label: 'Improve 必然更优，因为 70%>40%', diagnosis: '结论碰巧方向相同，但理由不成立；只比较成交概率会忽略价格、markout、费用和未成交代价。' },
    ],
    calculation: 'Vjoin=.40×200×.008−.60×.30−.04=.42；Vimprove=.70×200×.0045−.30×.30−.08=.46。',
    reveal: 'Tick 通过可用改善幅度进入 ḡ 和 π，但理性动作取决于完整价值账本。这里的数值只适用于声明过的全成/零成特例；真实部分成交必须按实际成交量计收益，并把成本作用到剩余数量。对输入做小幅敏感性变化，排序就可能翻转。',
  },
];

const designScenarios: Scenario[] = [
  {
    id: 'conditional-design',
    label: '制度识别 01 · Conditional effect',
    title: '面对一只一档 spread 的高流动性股票，减小 tick 最稳健的事前预测是什么？',
    brief: '股票在改革前 73% 的有效交易时间处于一档 quoted spread，订单到达频繁，best queue 较长。监管者拟把 tick 减半；没有同时改变费用、优先权或 lot size。问题要求最弱、可证伪的条件预测。',
    facts: [
      { label: 'Binding proxy', value: 'P(spread=1 tick)=73%', note: '网格很可能约束价差' },
      { label: 'Book state', value: 'Frequent arrivals; long queues', note: '价格内竞争空间不足' },
      { label: 'Treatment', value: 'Tick × 0.5', note: '仍需观察行为均衡' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'spread、所有深度和波动必然同时下降', diagnosis: '这把方向不一的市场质量维度强行绑定；更细网格可缩窄 spread，却也可能分散 best depth 并增加报价更新。' },
      { id: 'b', label: '没有任何影响，因为基本价值没有变化', diagnosis: '规则不必改变价值才能改变可行报价、队列租金、成交概率和路由。' },
      { id: 'c', label: 'quoted spread 有缩窄空间，队列可能变短；总福利与大单成本仍待检验', diagnosis: '正确：这是由 binding state 推出的局部预测，同时保留深度、impact、费用和主体异质性的经验问题。' },
    ],
    calculation: '事前诊断：spread-to-tick ratio 频繁等于 1，且一档状态占有效时间 73%。改革开放旧 spread 内新价格，但不会机械决定固定 bp 区间深度或大单实施成本。',
    reveal: 'tick 政策没有脱离状态的统一符号。先问原网格是否 binding，再分别预测 price fidelity、undercutting、queue rent、depth 与 routing，才是可检验设计。',
  },
  {
    id: 'maker-markout',
    label: '制度识别 02 · Maker markout',
    title: '买在旧 mid 下方并获得返佣，为什么成交后的净结果仍可能为负？',
    brief: '一张 maker 买单以 Pfill=79.99 成交，决策时 mid m₀=80.00；固定期限 h 后 mid mh=79.97。场所给 maker 0.16 bp 返佣，所以正文费用符号为 fmake=−0.16 bp。使用 Gmake=10,000×(mh−Pfill)/m₀−fmake。',
    facts: [
      { label: 'Fill', value: 'Buy at 79.99', note: '低于决策 mid 80.00' },
      { label: 'Later state', value: 'mh=79.97', note: '成交后价格继续向下' },
      { label: 'Rebate', value: '0.16 bp', note: 'fmake=−0.16 bp' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '+1.41 bp，因为成交价低于决策时 mid 且有返佣', diagnosis: 'Maker 账本看成交后固定期限的 mid，而不是只看下单时 spread capture；价格继续下跌造成 adverse markout。' },
      { id: 'b', label: '−2.34 bp：markout −2.50 bp，返佣只补回 0.16 bp', diagnosis: '正确：返佣改善结果，却不足以覆盖成交后 0.02 元的不利移动。' },
      { id: 'c', label: '−2.50 bp，因为返佣不应进入 maker 账本', diagnosis: 'Markout 算对了，但漏掉了场所返佣；净结果必须加减实际费用。' },
    ],
    calculation: '10,000×(79.97−79.99)/80.00=−2.50 bp；再减 fmake=−0.16，相当于加回 0.16，得到 −2.34 bp。',
    reveal: '返佣不是利润。Maker 结果必须以成交后的固定期限 mid 评价，再与费用、未成交机会和不同状态下的 fill 共同解释。',
  },
  {
    id: 'price-band-assignment',
    label: '制度识别 03 · Price-band assignment',
    title: '新闻把价格推过 tick 分档边界，简单前后差能否识别网格效应？',
    brief: '教学规则规定 m≤25.00 时 τ=.01，m>25.00 时 τ=.05。某股票公布业绩后由 24.98 跳到 25.03，并因此切换 tick。Assignment 指证券被分配到哪一个制度档位。',
    facts: [
      { label: 'Before news', value: 'm=24.98；τ=.01', note: 'ρ≈4.00 bp' },
      { label: 'After news', value: 'm=25.03；τ=.05', note: 'ρ≈19.98 bp' },
      { label: 'Concurrent shock', value: 'Earnings release', note: '同时改变价格、风险和订单流' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '改革效应就是跨界后 spread 变化，因为 tick 确实扩大五倍', diagnosis: '机械档位变化真实存在，但业绩新闻同时改变 natural spread、波动和订单组成；简单前后差没有反事实。' },
      { id: 'b', label: 'Relative tick 约扩大五倍，但 assignment 内生；需冻结基期分组或另找边界反事实', diagnosis: '正确：先承认实际处理，再限制因果语言；每日实际档位可以描述暴露，不能自行创造外生分配。' },
      { id: 'c', label: '没有任何 treatment，因为规则文本没有在当天修订', diagnosis: '价格分档规则会让同一文本在状态跨界时改变实际 tick；动态暴露仍是制度处理。' },
    ],
    calculation: '改革前 ρ≈10,000×.01/24.98=4.00 bp；改革后 ρ≈10,000×.05/25.03=19.98 bp。比率约 4.99，但与新闻冲击同时发生。',
    reveal: '动态 price band 让 outcome 也参与 assignment。可靠设计要在事件前冻结资格、审计两个边界，并把实际每日 tick 作为内生暴露单独报告。',
  },
  {
    id: 'bundled-did',
    label: '制度识别 04 · Bundled DiD',
    title: '一次规则同时改 quote tick、trade increment 与 fee cap，DiD 系数应叫什么？',
    brief: '处理组的 quoted spread 从 7 bp 升至 10 bp，对照组从 6 bp 升至 7 bp。同日只有处理组同时扩大 quote tick、扩大 trade increment，并降低 fee cap。假设处理前趋势可比，仅先手算变化之差。',
    facts: [
      { label: 'Treated', value: '7 → 10 bp', note: '变化 +3 bp' },
      { label: 'Control', value: '6 → 7 bp', note: '变化 +1 bp' },
      { label: 'Policy package', value: 'Quote + trade + fee', note: '三项同日进入' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '+3 bp，且是纯 quote-tick 因果效应', diagnosis: '你没有扣除对照组的共同变化，也把三项规则捆绑误写成单一网格机制。' },
      { id: 'b', label: '−2 bp，因为对照组变化应从处理组水平中相减', diagnosis: 'DiD 比较的是两组各自前后变化；方向与算式都写反了。' },
      { id: 'c', label: '+2 bp；在识别假设下也只能称组合政策效应', diagnosis: '正确：(+3)−(+1)=+2 bp，但没有错位处理就不能把 quote、trade 与 fee 三个通道拆开。' },
    ],
    calculation: 'β̂DiD=(10−7)−(7−6)=3−1=+2 bp。它与 Y 同为 bp。',
    reveal: 'DiD 不会自动把同时发生的制度组件拆开。只有分组、分期或外生阈值让组件错位，才可能识别增量机制。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...mechanicsScenarios.map((item, index) => ({ id: item.id, mode: 'mechanics' as const, index })),
  ...designScenarios.map((item, index) => ({ id: item.id, mode: 'design' as const, index })),
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" aria-label="题目教学参数">
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

export default function TickSizeLab() {
  const [mode, setMode] = useState<Mode>('mechanics');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submittedScenarioIds, setSubmittedScenarioIds] = useState<string[]>([]);
  const [scenarioResults, setScenarioResults] = useState<Record<string, boolean>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'mechanics' ? mechanicsScenarios : designScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;
  const nextUnsubmitted = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));
  const correctCount = Object.values(scenarioResults).filter(Boolean).length;

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
    setScenarioResults((current) => ({ ...current, [scenario.id]: correct }));
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
    setScenarioResults({});
    reset('mechanics', 0);
  }

  const modeLabel = mode === 'mechanics' ? '网格与队列' : '制度与识别';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'design' && mode === 'mechanics'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>GRID · QUEUE · DEPTH · DESIGN</span>
          <h3>先算网格约束与排队价值，再判断制度改革究竟改变了什么</h3>
        </div>
        <p>两种模式各四题。Mode A 必须把绝对价格换成可比经济单位，Mode B 必须给出条件预测、对照组和不能推出的结论。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="Tick size 实验模式">
        <button type="button" aria-pressed={mode === 'mechanics'} onClick={() => selectMode('mechanics')}>
          <span>MODE A</span><b>Grid &amp; Queue</b><small>分段网格、inside price、可比深度与完整行动价值</small>
        </button>
        <button type="button" aria-pressed={mode === 'design'} onClick={() => selectMode('design')}>
          <span>MODE B</span><b>Design &amp; Identify</b><small>条件效应、maker markout、动态分档与组合政策</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const result = scenarioResults[item.id];
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          const status = !submitted ? '未提交' : result ? '已提交，正确' : '已提交，需复习';
          return (
            <button
              type="button"
              key={item.id}
              aria-label={`${number} ${shortLabel}，${status}`}
              aria-pressed={index === scenarioIndex}
              aria-current={index === scenarioIndex ? 'step' : undefined}
              onClick={() => selectScenario(index)}
            >
              <span aria-hidden="true">{!submitted ? number : result ? '✓' : '!'}</span>{shortLabel}
            </button>
          );
        })}
      </div>

      <div className="impact-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1} aria-label={`${scenario.label}：${scenario.title}`}>{scenario.title}</h3>
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
              name={'tick-size-' + mode + '-' + scenario.id}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完整提交</b>
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从分段网格、inside price、可比深度和行动价值，推进到条件预测、maker markout、动态分档与组合政策。你仍可从上方题目选择器回到任一题更新答案。</p>
          <strong>完成不等于找到一个全球最优 tick；可靠判断必须先诊断约束是否 binding，再分别测量 spread、固定区间 depth、大单 impact、价格效率、消息负荷、执行概率与跨场所迁移。</strong>
          <div>
            <button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button>
          </div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算、经济口径与识别边界仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>八题均使用教学参数，不代表任一交易所的完整协议，也不是交易建议。真实复现必须冻结 venue、产品、规则版本、生效日、价格档位、quote/order/trade increment、优先权、费用返还、lot size、隐藏与 midpoint 订单、公司行动、跨场所路由和当时可得信息。</p>
    </div>
  );
}
