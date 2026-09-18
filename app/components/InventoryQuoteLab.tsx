'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'quotes' | 'controls';

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

const quoteScenarios: Scenario[] = [
  {
    id: 'target-deviation',
    label: '报价坐标 01 · Target deviation',
    title: '用于当前控制的库存目标偏离是多少？',
    brief: '实际库存和 target 使用同一标的、同一数量单位；正号表示 long。target 已把题目给定的业务基准纳入。',
    facts: [
      { label: 'Actual inventory', value: 'q = +8', note: '实际持有 8 个单位' },
      { label: 'Target inventory', value: 'q* = +3', note: '当前控制基准为 long 3' },
      { label: 'Definition', value: 'x = q − q*', note: 'x 是相对目标偏离，不是实际持仓' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'Short deviation 5', diagnosis: '你把 q−q* 的符号写反了；8−3 为正。' },
      { id: 'b', label: 'Long deviation 8', diagnosis: '这是实际库存 q，遗漏了 target。' },
      { id: 'c', label: 'Long deviation 5', diagnosis: '正确：x=8−3=+5，控制上偏多 5 个单位。' },
    ],
    calculation: 'x=q−q*=+8−(+3)=+5。实际 mark-to-market exposure 仍是 q=+8；x=+5 是相对已定义目标的控制状态。',
    reveal: 'Target 不会自动抵消风险。若 q* 不是已计入的 hedge、负债或明确业务基准，仍必须另外报告实际 q 的价格暴露。',
  },
  {
    id: 'reservation-price',
    label: '报价坐标 02 · Reservation price',
    title: '在教学性二次风险模型里，内部 reservation price 是多少？',
    brief: '使用 r=m−x·φ，其中 φ=γσ²τ 是每增加一个库存偏离单位带来的边际中心调整。',
    facts: [
      { label: 'Reference mid', value: 'm = $100.00', note: '同步公共参考价，不是无误真值' },
      { label: 'Deviation', value: 'x = +5', note: '相对目标偏多' },
      { label: 'Inventory slope', value: 'φ = $0.02 / unit', note: '风险厌恶、波动与期限的乘积' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '$99.90', diagnosis: '正确：偏多使内部无差异中心下降 $0.10。' },
      { id: 'b', label: '$100.10', diagnosis: '符号反了；偏多时继续买入更昂贵，reservation price 应降低。' },
      { id: 'c', label: '$100.00', diagnosis: '价格变化条件均值为零不等于库存风险成本为零。' },
    ],
    calculation: 'r=$100.00−5×$0.02=$99.90。它是风险调整内部价格，不是预测公共价格会跌到 $99.90。',
    reveal: 'Long deviation 首先降低内部 reservation price；只有在围绕 r 对称且 width 固定的最小报价规则下，实际 center 才同向下移，使 ask 更容易卖出、bid 更不愿继续买入。',
  },
  {
    id: 'center-width',
    label: '报价坐标 03 · Center / width',
    title: '两侧同时下调一美分，报价中心与 full width 怎样变化？',
    brief: 'Quote center c=(a+b)/2；full width w=a−b。请分别计算，而不是凭某一侧的移动猜 spread。',
    facts: [
      { label: 'Original bid / ask', value: '$99.98 / $100.02', note: '原 center=$100.00，width=$0.04' },
      { label: 'New bid / ask', value: '$99.97 / $100.01', note: '两侧各下调 $0.01' },
      { label: 'Reference mid', value: '$100.00', note: '用于计算 center skew' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'Center 不变；width 扩到 $0.06', diagnosis: '两侧同幅下移会改变 center，不会改变两侧间距。' },
      { id: 'b', label: 'Center 降到 $99.99；width 缩到 $0.02', diagnosis: 'Center 算对了，但 $100.01−$99.97 仍为 $0.04。' },
      { id: 'c', label: 'Center 降到 $99.99；width 仍为 $0.04', diagnosis: '正确：这是 downward center skew，不是 spread widening。' },
    ],
    calculation: 'c=($99.97+$100.01)/2=$99.99；w=$100.01−$99.97=$0.04；center skew y=c−m=−$0.01。',
    reveal: 'Center/skew 与 width 是两套独立坐标。只说“报价下调”不足以判断 spread 变宽还是整体平移。',
  },
  {
    id: 'short-inventory',
    label: '报价坐标 04 · Short sign',
    title: '相对目标偏空时，最小库存机制预测哪个方向？',
    brief: '使用 r−m=−xφ；这里只判断 inventory channel，公共价值更新与信息风险保持不变。',
    facts: [
      { label: 'Deviation', value: 'x = −4', note: '相对目标 short 4' },
      { label: 'Inventory slope', value: 'φ = $0.03 / unit', note: '正的风险调整系数' },
      { label: 'Other channels', value: 'Held fixed', note: '公共价值、width 与竞争不变' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'Reservation price 比 mid 低 $0.12', diagnosis: '你沿用了 long 的方向；x 为负时 −xφ 为正。' },
      { id: 'b', label: 'Reservation price 比 mid 高 $0.12；若围绕 r 报价，bid 更积极、ask 更保守', diagnosis: '正确：内部 r 上升；在以 r 为中心、width 不变的最小规则下，它鼓励买回、抑制继续卖出。' },
      { id: 'c', label: '只需对称扩大 width', diagnosis: '对称扩大 width 会同时减少两侧成交，不会专门鼓励减少 short。' },
    ],
    calculation: 'r−m=−(−4)×$0.03=+$0.12。若实际报价围绕 r 对称且 width 不变，bid 与 ask 都上移 $0.12。',
    reveal: 'Long 与 short 的内部 reservation adjustment 应成镜像；屏幕 center 只有在给定报价规则下才同向移动，现实策略还可另改 width、size 或 hedge。',
  },
];

const controlScenarios: Scenario[] = [
  {
    id: 'risk-neutral-distance',
    label: '控制接口 01 · Arrival trade-off',
    title: '风险中性且无库存成本时，哪一报价距离最大化这个教学性单侧毛收入？',
    brief: '成交强度 λ(δ)=Ae^(−κδ)，每次成交毛 capture 为 δ；最大化 δλ(δ)。A、κ 均为正。',
    facts: [
      { label: 'Objective', value: 'δ·A·e^(−κδ)', note: '每笔收入 × 单位时间成交强度' },
      { label: 'A', value: 'Baseline intensity', note: '等比例缩放所有候选报价的到达率' },
      { label: 'κ', value: 'Distance sensitivity', note: '报价更远时强度衰减得多快' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'δ*=A/κ', diagnosis: 'A 只是共同乘数，不进入这个简化一阶条件。' },
      { id: 'b', label: 'δ*=1/κ', diagnosis: '正确：一阶条件为 A e^(−κδ)(1−κδ)=0。' },
      { id: 'c', label: 'δ*=0', diagnosis: '在 mid 成交时每笔毛 capture 为零；风险中性不等于 zero spread。' },
    ],
    calculation: 'd[δAe^(−κδ)]/dδ=Ae^(−κδ)(1−κδ)。δ<1/κ 时斜率为正、δ>1/κ 时为负，因此 δ*=1/κ 是最大值；对称两侧的风险中性 full width 为 2/κ。',
    reveal: '这是指数成交强度下的教学基准，不是订单簿结构定律。Queue、size、news、fees 和竞争都会改变真实 fill function。',
  },
  {
    id: 'size-risk',
    label: '控制接口 02 · Displayed size',
    title: '同样 4 个单位的两侧成交，对 long deviation 的平方风险分数分别有什么影响？',
    brief: '当前 x=+10。Ask fill 表示做市商卖出 4，bid fill 表示做市商买入 4；只比较 x²。',
    facts: [
      { label: 'Current deviation', value: 'x = +10', note: '当前风险分数 10²=100' },
      { label: 'Ask fill', value: 'Maker sells 4', note: 'x_after=10−4' },
      { label: 'Bid fill', value: 'Maker buys 4', note: 'x_after=10+4' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'Ask 与 bid fill 都把分数降到 36', diagnosis: 'Bid fill 会让做市商继续买入，long deviation 反而增加。' },
      { id: 'b', label: 'Ask 变 196；bid 变 36', diagnosis: '你交换了 maker 在 ask 卖出、在 bid 买入的方向。' },
      { id: 'c', label: 'Ask 变 36、降低 64；bid 变 196、增加 96', diagnosis: '正确：价格不变时，数量不对称也能管理成交后的库存跳幅。' },
    ],
    calculation: 'Ask: (10−4)²=36，变化 −64；bid: (10+4)²=196，变化 +96。',
    reveal: 'Price skew 并未穷尽 inventory control。Maker 还可减少风险增加侧 size、增加纠偏侧 size，或选择不参与。',
  },
  {
    id: 'minimum-variance-hedge',
    label: '控制接口 03 · Linear hedge',
    title: '最小方差 hedge 头寸和剩余方差是多少？',
    brief: '库存标的持仓 q=10；hedge 头寸 z 的正号表示增加 hedge 工具暴露。忽略执行成本。',
    facts: [
      { label: 'Inventory variance', value: 'Var(ΔS)=4', note: '未对冲方差 q²Var=400' },
      { label: 'Hedge variance', value: 'Var(ΔH)=1', note: '每单位 hedge 工具方差' },
      { label: 'Covariance', value: 'Cov(ΔS,ΔH)=1.5', note: '同向正协方差' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'z*=−15；剩余方差 175', diagnosis: '正确：对正协方差资产建立反向头寸，风险下降但不归零。' },
      { id: 'b', label: 'z*=−10；风险完全消失', diagnosis: '名义一比一不是最小方差比率；相关性也不是 1。' },
      { id: 'c', label: 'z*=+15；剩余方差 175', diagnosis: '头寸方向反了；正协方差下同向 hedge 会增加风险。' },
    ],
    calculation: 'z*=−q·Cov/Var(H)=−10×1.5/1=−15；V=10²×4+(−15)²×1+2×10×(−15)×1.5=175。',
    reveal: '最小方差只处理给定 covariance 下的线性风险；basis、相关性漂移、spread、impact、margin 与非线性 Greeks 仍在。',
  },
  {
    id: 'causal-boundary',
    label: '控制接口 04 · 因果边界',
    title: '观察到 dealer inventory 较高后 quote center 下移，最稳健的结论是什么？',
    brief: '这是参与者级观察数据；没有随机分配库存冲击，也没有完整观察私有信息、目标库存和跨市场 hedge。',
    facts: [
      { label: 'Observed relation', value: 'q high → center lower', note: '时序已用 pre-quote inventory' },
      { label: 'Common-value controls', value: 'Partial', note: '仍可能遗漏公共与私有价值更新' },
      { label: 'Inventory target / hedge', value: 'Unobserved', note: 'raw q 未必等于残余风险' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '已经证明 inventory 导致 center 下移', diagnosis: '时序必要但不充分；库存由过去报价、成交与共同冲击内生生成。' },
      { id: 'b', label: '与 inventory channel 一致，但仍需可信的 dealer-specific variation', diagnosis: '正确：公共坏消息、信息型卖单、风险限额、target 和 hedge 可同时决定 q 与 center。' },
      { id: 'c', label: '已经证明 adverse selection 不存在', diagnosis: 'Inventory 与 information channels 可以同时存在，观察相关性不能删除其中之一。' },
    ],
    calculation: '可识别目标应写成：在公共价值、订单流和风险状态可比时，一个外生 inventory-deviation shock 对后续 center、width、size、hedge 与 x 的局部效应。',
    reveal: 'Dealer fixed effects 只能删除不随时间变化的差异，不能解决时变私有信息、移动 target、先前报价选择或未观测 hedge。',
  },
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

export default function InventoryQuoteLab() {
  const [mode, setMode] = useState<Mode>('quotes');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'quotes' ? quoteScenarios : controlScenarios;
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

  const modeLabel = mode === 'quotes' ? '报价坐标与符号' : '成交、数量、对冲与识别';

  return (
    <div className="inventory-quote-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>INVENTORY CONTROL · STATE → QUOTE → NEXT STATE</span>
          <h3>先预测库存偏离如何移动报价，再审计 size、hedge 与因果证据</h3>
        </div>
        <p>两种模式各四题。提交前只显示状态和原始事实；公式、方向诊断与模型边界在作答后揭示。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="库存报价实验模式">
        <button type="button" aria-pressed={mode === 'quotes'} onClick={() => selectMode('quotes')}>
          <span>MODE A</span><b>Reservation &amp; Quotes</b><small>Target、center、width 与多空符号</small>
        </button>
        <button type="button" aria-pressed={mode === 'controls'} onClick={() => selectMode('controls')}>
          <span>MODE B</span><b>Controls &amp; Identification</b><small>Arrival、size、hedge 与因果边界</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${modeLabel}题目`}>
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

      <ScenarioFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={`inventory-quote-${mode}-${scenario.id}`}
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
          <p className="impact-locked">先选择答案。计算过程、符号诊断与适用边界仍被锁定。</p>
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
        {revealed ? (correct ? '判断成立，计算与边界解释已显示。' : '需要修正，诊断、计算与边界解释已显示。') : ''}
      </p>

      <p className="impact-lab-caveat"><b>实验边界：</b>这些题训练单一做市商的状态、报价坐标与局部控制，不是可部署策略。真实报价还受信息、queue、tick、fees、竞争、限额、对冲流动性和制度义务影响。</p>
    </div>
  );
}
