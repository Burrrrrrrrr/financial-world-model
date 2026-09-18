'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'anchor' | 'risk';

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

const anchorScenarios: Scenario[] = [
  {
    id: 'contract-detective',
    label: '价格锚点 01 · Contract detective',
    title: '“一张看涨期权只要 3.20 美元”——这句话少了哪些决定真实现金流的合同字段？',
    brief: '某美式股票看涨期权报价为每股 3.20 美元，执行价 50 美元，标准乘数为 100。你买入一张并持有多头；忽略佣金。题面没有保证到期实值，也没有授权把任何其他产品的结算规则套进来。',
    facts: [
      { label: 'Premium quote', value: '$3.20 / share', note: '权利金按每股报价，不是整张合约总额' },
      { label: 'Multiplier', value: '100 shares', note: '合约调整后乘数可能改变，真实交易须查当期规格' },
      { label: 'Style', value: 'American equity call', note: '多头可按适用规则提交行权，空头面临指派义务' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '买方先支付 3.20 美元；若不行权，损失只有 3.20 美元', diagnosis: '报价单位被误当成整张合约。标准乘数为 100 时，一张合约的初始权利金是 320 美元；合约调整、费用和经纪商规则还可能改变实际账本。' },
      { id: 'b', label: '买方先支付 320 美元取得买入权；卖方收取权利金并承担被指派后的履约义务', diagnosis: '正确：多头拥有权利而非义务，空头承担或有义务。若多头让合约失效，题设下最大损失是已付 320 美元。' },
      { id: 'c', label: '买方与卖方都只拥有选择权；清算机构会替任何一方吸收不利到期现金流', diagnosis: '清算降低交易对手履约风险，但不会消除合约本身的经济损失。期权空头收到权利金，交换的是被指派时履约的义务。' },
    ],
    calculation: '初始权利金现金流=−$3.20×100=−$320。到期多头 call 净损益=[max(S_T−50,0)−3.20]×100；空头为其相反数（均未计费用）。',
    reveal: '读期权报价前先冻结底层、call/put、执行价、到期、行权风格、乘数、结算方式与最后交易/行权时点。同名“期权”可能是股票实物交割、指数现金结算或行权后形成期货仓位；价格单位相同，不代表合同现金流相同。',
  },
  {
    id: 'itm-but-losing',
    label: '价格锚点 02 · ITM but losing',
    title: '到期时看涨期权处于实值，为什么这笔交易仍然亏损？',
    brief: '交易者以每股 8 美元买入一张执行价 100 美元的看涨期权，乘数为 100。到期标的结算价为 105 美元；忽略佣金、融资和税。请同时区分 payoff、profit 与 moneyness。',
    facts: [
      { label: 'Entry premium', value: '$8.00 / share', note: '这是沉没的初始成本，但计算总损益时不能消失' },
      { label: 'Expiry spot / strike', value: '$105 / $100', note: '到期内在价值为每股 5 美元' },
      { label: 'Multiplier', value: '100', note: '每股结果乘以 100 才是每张合约现金额' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '期权实值 5 美元，但每股净亏 3 美元；每张合约亏 300 美元', diagnosis: '正确：ITM 只比较到期标的价与执行价；交易盈亏还要扣除最初支付的 8 美元权利金。' },
      { id: 'b', label: '只要 ITM 就必然盈利；每张合约赚 500 美元', diagnosis: '500 美元是到期 payoff，不是含初始权利金的 profit。把 payoff 与 profit 混为一谈，会把保本点从 108 美元错误地降到 100 美元。' },
      { id: 'c', label: '期权虚值 3 美元，因为到期收益没有覆盖权利金', diagnosis: 'Moneyness 不由历史买入价决定。此 call 因 105>100 而 ITM；“亏损”描述交易结果，“实值”描述合同在当前或到期状态下的内在价值。' },
    ],
    calculation: '到期 payoff=max(105−100,0)×100=$500；总 profit=$500−$8×100=−$300；到期保本点=100+8=$108。',
    reveal: '内在价值回答“若此刻按 payoff 公式结算，权利值多少”；时间价值常被写成权利金减内在价值，但它不是对所有合同都必为正：不能立即行权的欧式期权，其当前权利金可能低于按当前现货计算的内在值。盈亏还依赖成交权利金、乘数和费用，三者不能互相替代。',
  },
  {
    id: 'put-call-parity',
    label: '价格锚点 03 · Put–call parity',
    title: '两组到期现金流完全相同，今天的价格为何必须相同？',
    brief: '同一无股息股票的欧式 call 与 put 拥有相同执行价 98、相同到期日；无风险利率为 0。现货为 100，call 为 7。忽略交易成本、信用约束与借券限制。哪一个 put 价格满足欧式 put–call parity？',
    facts: [
      { label: 'Matched contracts', value: 'K=98 · same expiry', note: '风格、执行价、到期和底层都必须匹配' },
      { label: 'Spot / call', value: 'S=100 · C=7', note: '股票不支付股息' },
      { label: 'Discounting', value: 'r=0 → PV(K)=98', note: '只为把复制关系写成整数' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'P=7；同执行价的 call 与 put 必须同价', diagnosis: 'call 与 put 的终端方向相反，并不会一般同价。它们的价差由现货与执行价现值决定。' },
      { id: 'b', label: 'P=3；因为现货高于执行价 2，所以从 call 权利金中减两次', diagnosis: '平价只减一次 S−PV(K)。重复扣除内在差额会让两组复制组合的初始成本不一致。' },
      { id: 'c', label: 'P=5；因为 C−P=S−PV(K)=2', diagnosis: '正确：long call 加执行价现值债券，与 long put 加股票在到期的每一种状态都有同一现金流。' },
    ],
    calculation: 'C−P=S−PV(K)；7−P=100−98=2，所以 P=5。若 P=4，则 C+PV(K)=105 高于 P+S=104，在题设无摩擦条件下形成 1 美元复制差。',
    reveal: '平价是复制组合的无套利关系，不是对涨跌概率的判断。离散股息要从现货持有收益中逐笔贴现，欧式与美式的边界不同；可执行检验还要按四腿 bid/ask、借券、融资、税费和提前行权风险重建。',
  },
  {
    id: 'binomial-replication',
    label: '价格锚点 04 · Binomial replication',
    title: '不预测“上涨概率”，怎样用股票和现金复制一份看涨期权？',
    brief: '一步二叉树中，股票现价 100；到期只可能为 120 或 80。执行价 100 的欧式 call 在两种状态分别支付 20 与 0。节点之间无股息或其他现金分配（q=0），无风险利率为 0，不计交易成本。',
    facts: [
      { label: 'Stock tree', value: '100 → 120 / 80', note: '这是教学用完备的一步两状态市场' },
      { label: 'Call payoff', value: '20 / 0', note: '由 max(S_T−100,0) 给出' },
      { label: 'Cash rate', value: '0%', note: '借入金额到期不产生利息' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '买 1 股并借入 80；复制成本 20', diagnosis: '这组仓位的状态现金流不是 20/0。复制要求两个终端状态逐一相等，而不是只让初始价格看起来合理。' },
      { id: 'b', label: '买 0.5 股并借入 40；两态支付 20/0，复制成本为 10', diagnosis: '正确：0.5×120−40=20，0.5×80−40=0；因此无套利期权价等于 0.5×100−40=10。' },
      { id: 'c', label: '必须先知道真实上涨概率；若不知道，期权没有可定义价格', diagnosis: '在这个完备、无摩擦的一步模型中，复制而非真实概率固定价格。风险中性概率是把复制价格写成贴现期望的工具，不是统计预测。' },
    ],
    calculation: 'Δ=(C_u−C_d)/(S_u−S_d)=(20−0)/(120−80)=0.5；B=C_d−ΔS_d=−40；C_0=ΔS_0+B=0.5×100−40=10。',
    reveal: '二叉树把连续模型的核心暴露出来：先逐状态复制，再由一价定律定价。这里隐含的风险中性上涨概率为 (100−80)/(120−80)=0.5；它恰好等于 0.5 是模型参数的结果，不能被解释为市场“认为上涨概率 50%”。',
  },
];

const riskScenarios: Scenario[] = [
  {
    id: 'greeks-local-map',
    label: '局部风险 01 · Greeks local map',
    title: '标的上涨、隐波下跌时，Delta、Gamma 与 Vega 怎样共同形成局部损益近似？',
    brief: '某多头期权每股 Delta=+0.42、Gamma=+0.018/美元、Vega=+0.27 美元/波动率点。下一小段时间内标的上涨 2 美元、隐含波动率下降 1.5 个百分点。先忽略 Theta、利率、cross-greeks 与更高阶项，乘数为 100。',
    facts: [
      { label: 'Directional curvature', value: 'Δ=0.42 · Γ=0.018/$', note: 'Gamma 项带 1/2，并随价格变动平方进入' },
      { label: 'Vol exposure', value: 'Vega=$0.27 / vol point', note: '题面已按 1 个百分点定义，不再乘 0.01' },
      { label: 'Move', value: 'ΔS=+$2 · Δσ=−1.5 pt', note: '冻结其余输入的局部情境' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '近似每股 +0.471 美元，即每张 +47.10 美元；上涨收益被隐波下降部分抵消', diagnosis: '正确：Delta 项 +0.84，Gamma 项 +0.036，Vega 项 −0.405，合计 +0.471。' },
      { id: 'b', label: '近似每股 +1.281 美元；Vega 只取绝对值，隐波方向不重要', diagnosis: 'Vega 是有符号的局部敏感度。多头普通期权通常 Vega 为正，因此隐波下降贡献负损益，不能把冲击取绝对值。' },
      { id: 'c', label: '精确每股 +0.471 美元；Greeks 已经覆盖任何幅度、任何路径的真实损益', diagnosis: '数值是题设截断后的近似，不是恒等式。大幅或离散跳跃、surface 重塑、时间流逝以及 Delta/Gamma/Vega 自身变化都会产生残差。' },
    ],
    calculation: 'ΔV≈Δ·ΔS+½Γ(ΔS)²+Vega·Δσ=0.42×2+0.5×0.018×2²+0.27×(−1.5)=0.471 美元/股；×100=$47.10/张。',
    reveal: 'Greeks 是在模型、估值点和单位被冻结时的偏导数，不是独立现金流。完整二阶展开还可能包含 volga、vanna、charm 等交叉或高阶项；实际 P&L 还混合成交价差、离散对冲、surface 变化和模型误差。',
  },
  {
    id: 'implied-vol-solver',
    label: '局部风险 02 · IV solver',
    title: '屏幕上的“20% 隐波”是怎样从权利金反解出来的？',
    brief: '一份欧式 call 的市场权利金为 6.3076。Black–Scholes 输入冻结为 S=K=100、连续无风险利率 5%、连续股息率 2%、到期 0.5 年。求使模型价格等于市场价的年化波动率。',
    facts: [
      { label: 'Observed premium', value: 'C_mkt=6.3076', note: '这是求根方程的目标值，不是波动率本身' },
      { label: 'Frozen inputs', value: 'S=K=100 · r=5% · q=2%', note: '任何输入或模型变化都会改变反解结果' },
      { label: 'Tenor', value: 'T=0.5 year', note: 'σ 采用年化标准差口径' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'σ=6.3076%；权利金数值就是隐含波动率', diagnosis: '权利金与波动率单位不同。隐波是使定价函数匹配市场价格的参数根，而不是把价格加百分号。' },
      { id: 'b', label: 'σ≈20%；通过单调求根使 C_BS(σ)=6.3076', diagnosis: '正确：代入 σ=0.20 得 d₁≈0.17678、d₂≈0.03536，call 价格约 6.30764。' },
      { id: 'c', label: 'σ=20% 且代表市场对未来实际波动率的无偏预测', diagnosis: '数值根正确，但解释错误。隐波同时吸收模型约定、风险溢价、供需、跳跃风险和微观结构，不能无条件等同未来实现波动。' },
    ],
    calculation: 'd₁=[ln(S/K)+(r−q+½σ²)T]/(σ√T)，d₂=d₁−σ√T。σ=0.20 时 d₁=0.1767767、d₂=0.0353553，C=Se^(−qT)N(d₁)−Ke^(−rT)N(d₂)=6.307635≈6.3076。',
    reveal: 'IV 是“给定模型与其余输入后，能重现这笔成交价的 σ”。数值算法要先检查价格是否落在无套利边界内，再用有界、单调的求根法；深度实值、极短期限或接近边界时 Vega 很小，价格误差会被放大成很大的 IV 误差。',
  },
  {
    id: 'surface-motion',
    label: '局部风险 03 · Surface motion',
    title: '标的从 100 涨到 110 后，“新 ATM 隐波”在 sticky-strike 与 sticky-delta 下为何不同？',
    brief: '初始现货为 100，同一期限的简化隐波切片为：K=90 时 25%，K=100 时 20%，K=110 时 18%。随后现货快速升至 110，期限流逝暂忽略。为便于教学，把同 delta 近似为同相对 moneyness；真实 delta 还取决于期限、利率和隐波。',
    facts: [
      { label: 'Initial slice', value: 'K90:25% · K100:20% · K110:18%', note: '这是负 skew，不是一条常数波动率线' },
      { label: 'Spot move', value: '100 → 110', note: '新 ATM 执行价约为 110' },
      { label: 'Two heuristics', value: 'strike fixed / moneyness shifts', note: '只是 surface 动态假设，不是无套利定律' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '两种规则都给新 ATM 25%；上涨必然把左翼高隐波搬到 ATM', diagnosis: '这既不符合固定执行价，也不符合固定相对 moneyness 的定义。surface 如何移动必须先指定状态变量与映射规则。' },
      { id: 'b', label: 'sticky-strike 给 20%，sticky-delta 给 18%；两者名称可以互换', diagnosis: '方向写反。固定执行价时 K=110 仍保留原来的 18%；固定相对 moneyness时，原 ATM 的 20% 随现货移到新 ATM 附近。' },
      { id: 'c', label: 'sticky-strike 约给 18%，sticky-delta 约给 20%；实际市场可以同时偏离两者', diagnosis: '正确：两种规则是对 surface 动态的不同条件假设，不是由静态 smile 单独推出的事实。' },
    ],
    calculation: 'Sticky strike：σ_new(K=110)≈σ_old(K=110)=18%。Sticky delta（题设近似）：新 ATM 的相对 moneyness 与旧 ATM 对齐，所以 σ_new(ATM)≈20%。',
    reveal: '静态 smile 只描述一个时点不同 strike 的 IV；surface motion 描述状态变化后的映射。用旧 Greeks 解释 P&L 时，选错 sticky 规则会把 surface 迁移误记为纯 Delta 或 Vega。真实市场还会发生 skew 旋转、期限联动与跳跃。',
  },
  {
    id: 'expiry-dividend',
    label: '局部风险 04 · Expiry & dividend',
    title: '临近到期与除息前夕，为什么不能把所有期权都按同一种“自动行权”直觉处理？',
    brief: '合约 A 是当日到期、欧式、现金结算的宽基指数期权；合约 B 是一张美式股票 call，执行价 100，股价 105，次晨每股除息 1.00，隔夜利息忽略。一个已把除息后状态纳入的简化模型给出“不立即行权”的 continuation value 为每股 4.70。',
    facts: [
      { label: 'Contract A', value: '0DTE · European · cash-settled', note: '不能提前行权，最终按适用结算值处理' },
      { label: 'Contract B', value: 'S=105 · K=100', note: '立即行权价值为每股 5.00' },
      { label: 'Dividend / continuation', value: '$1.00 / $4.70', note: 'continuation 已纳入除息后状态；call 本身不获得股票股息' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'A 无提前行权；B 因立即行权价值 5.00 高于 continuation 4.70，题设节点应提前行权', diagnosis: '正确：A 的合同风格排除提前行权；B 必须比较 exercise value 与已计入离散股息的 continuation value，而不是只看“有股息”三个字。' },
      { id: 'b', label: 'A 与 B 都应立即行权；0DTE 意味着任何期权都必须由持有人手动提前行权', diagnosis: '0DTE 只表示当日到期，不改变 European/American 风格。现金结算指数期权与实物交割股票期权的行权、结算和指派链不同。' },
      { id: 'c', label: 'B 绝不应提前行权；美式只表示到期日行权方式与欧式不同', diagnosis: '美式期权可在规则允许时提前行权。无股息股票的 call 通常不宜提前行权，但离散股息可能改变最优边界。' },
    ],
    calculation: 'B 的 exercise value=max(105−100,0)=5.00 美元/股；continuation value=4.70，所以该节点的美式价值=max(5.00,4.70)=5.00，并选择提前行权。',
    reveal: '临近到期时 Gamma 可能集中，Theta 的绝对值可能急剧增大，微小现货变化就会改变 Delta 与是否实值；但“pin risk”不是价格必然钉在执行价，也不是自动行权结果确定。0DTE 定义、最后交易时刻、结算值、行权截止、exercise-by-exception 与经纪商阈值都属于会变的合同规则，必须查当期文件。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...anchorScenarios.map((item, index) => ({ id: item.id, mode: 'anchor' as const, index })),
  ...riskScenarios.map((item, index) => ({ id: item.id, mode: 'risk' as const, index })),
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目教学参数">
      {scenario.facts.map((fact) => (
        <article key={`${scenario.id}:${fact.label}:${fact.value}`}>
          <span>{fact.label}</span>
          <b>{fact.value}</b>
          <p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function OptionGreeksLab() {
  const [mode, setMode] = useState<Mode>('anchor');
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
  const scenarios = mode === 'anchor' ? anchorScenarios : riskScenarios;
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
    setSubmittedScenarioIds((current) => current.filter((id) => id !== scenario.id));
    setScenarioResults((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== scenario.id)));
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
    reset('anchor', 0);
  }

  const modeLabel = mode === 'anchor' ? '合同与价格锚点' : '局部风险与波动率曲面';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'risk' && mode === 'anchor'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '继续下一道未答题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>CONTRACT · NO-ARBITRAGE · GREEKS · IMPLIED VOLATILITY</span>
          <h3>先把合同与复制现金流钉牢，再把 Greeks 当作局部风险坐标，而不是价格预测器</h3>
        </div>
        <p>两种模式各四题。Mode A 识别权利义务、盈亏口径、平价与二叉树复制；Mode B 解释局部 Greeks、IV 反演、surface motion 与到期 / 股息边界。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="期权价格与 Greeks 实验模式">
        <button type="button" aria-pressed={mode === 'anchor'} onClick={() => selectMode('anchor')}>
          <span>MODE A</span><b>Contract &amp; Price Anchors</b><small>合同侦探、价格构成、平价与复制</small>
        </button>
        <button type="button" aria-pressed={mode === 'risk'} onClick={() => selectMode('risk')}>
          <span>MODE B</span><b>Local Risk &amp; Surface</b><small>Greeks、IV 求根、曲面动态与到期边界</small>
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

      <p className="impact-lab-progress" role="status" aria-live="polite">总进度：已提交 {submittedScenarioIds.length}/8，当前答对 {correctCount} 题。</p>

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
              name={'option-greeks-' + mode + '-' + scenario.id}
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
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从合同、盈亏和平价推进到局部 Greeks、IV 反演、surface motion 与到期边界。你仍可从上方题目选择器返回任一题更新答案。</p>
          <strong>完成不等于“背下五个字母”。面对任何期权，先核合同与单位，再画终端现金流并检查复制锚；最后才用带模型、状态点和单位标签的 Greeks 解释小变动风险。</strong>
          <div><button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button></div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算过程、适用条件与机制诊断仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>八题使用冻结参数、无摩擦复制或明确简化的局部近似，只用于教学，不构成投资、交易、税务或法律建议。真实期权还要核对当前合约乘数、公司行动调整、最后交易与行权时刻、exercise-by-exception、经纪商截止、指派、实物 / 现金 / 期货结算、bid / ask、流动性、保证金、税费、股息、利率曲线、借券及限仓；模型 Greeks 与隐波也会随模型、surface 约定和市场状态改变。</p>
    </div>
  );
}
