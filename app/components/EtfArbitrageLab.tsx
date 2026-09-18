'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'ledger' | 'system';

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

const ledgerScenarios: Scenario[] = [
  {
    id: 'nav-premium',
    label: '执行账本 01 · NAV & Premium',
    title: '先把基金账本与交易价格分开：这只 ETF 的 NAV 和溢价率分别是多少？',
    brief: '某教学 ETF 在估值时点持有资产 A=5,260 万元、负债 L=60 万元，已发行份额 N=100 万份；同一可比时点的 ETF 市场价格为 52.39 元。题面假定资产已按一致时钟估值，并忽略应计误差与估值层级差异。',
    facts: [
      { label: 'Fund assets', value: 'A = 52.6m', note: '基金账本中的资产公允价值' },
      { label: 'Liabilities / shares', value: 'L = 0.6m, N = 1.0m', note: '负债与流通份额' },
      { label: 'ETF price', value: 'P = 52.39', note: '同一可比时点的市场价格' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'NAV=52.60 元；折价约 0.40%，因为资产总额已经代表持有人净资产', diagnosis: '基金资产并不等于份额持有人的净资产；必须先扣除负债。这里把资产总额直接除以份额数，遗漏了 60 万元负债。' },
      { id: 'b', label: 'NAV=52.00 元；市场价格相对 NAV 溢价 0.75%', diagnosis: '正确：先由资产减负债得到基金净资产，再除以份额数；市场价格高于这一每份净资产 0.39 元。' },
      { id: 'c', label: 'NAV=51.40 元；溢价约 1.93%，因为负债需要在资产和份额价值中各扣一次', diagnosis: '负债只在基金净资产恒等式中扣除一次；再次从每份价值中扣除会把同一负债重复计算。' },
    ],
    calculation: 'NAV=(A−L)/N=(52.6m−0.6m)/1.0m=52.00 元；premium=(P/NAV−1)×100%=(52.39/52.00−1)×100%=0.75%。',
    reveal: 'NAV 是基金账本按份额分摊后的净资产，ETF 价格则由二级市场订单形成。溢折价只有在价格和 NAV 的资产范围、货币、估值时点与应计项目可比时才有清晰含义；若时钟不同，报告值会混入估值滞后。',
  },
  {
    id: 'value-neutral-creation',
    label: '执行账本 02 · Creation',
    title: 'AP 按公允价值申购新份额，为什么不会机械稀释原持有人？',
    brief: '某 ETF 原有资产 A=9,600 万元、负债 L=240 万元、流通份额 N=234 万份，因此每份 NAV 为 40 元。授权参与者向基金交付价值 240 万元的合格篮子，并取得 6 万份新 ETF 份额；题面假定交付篮子与新份额价值完全相等，负债不变，也没有税费或价格冲击。',
    facts: [
      { label: 'Before', value: 'A=96m, L=2.4m', note: '原净资产为 93.6m' },
      { label: 'Shares', value: '2.34m → 2.40m', note: '新增 60,000 份' },
      { label: 'Contribution', value: '2.4m', note: '每份新增价值 40 元' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'NAV 升至约 41.03 元，因为新增篮子增加资产，而原份额数仍是 234 万份', diagnosis: '申购会同时增加基金资产和流通份额；只增加分子、不增加分母，相当于假设 AP 交付资产却没有取得新份额。' },
      { id: 'b', label: 'NAV 降至 39.00 元，因为新增份额分享原净资产，但 AP 的交付篮子不计入基金资产', diagnosis: 'AP 交付的合格篮子进入基金资产。只增加份额、不增加净资产，才会产生这里虚构出的机械稀释。' },
      { id: 'c', label: 'NAV 仍为 40.00 元；净资产与份额数按相同比例增加', diagnosis: '正确：基金净资产从 93.6m 增至 96.0m，份额从 2.34m 增至 2.40m，两者之比保持 40 元。' },
    ],
    calculation: '申购前 NAV=(96m−2.4m)/2.34m=40；申购后 A′=98.4m、L′=2.4m、N′=2.40m，因此 NAV′=(98.4m−2.4m)/2.40m=40 元。',
    reveal: '“申购增加份额”不等于“稀释”。真正决定是否发生价值转移的是基金收到的资产价值，是否足以补偿新发行份额以及相关交易和税务成本。若篮子估值错误、现金替代费不足或交易成本由基金承担，价值中性才可能被破坏。',
  },
  {
    id: 'premium-creation',
    label: '执行账本 03 · Premium creation',
    title: 'ETF 出现溢价时，申购套利的可执行利润应怎样计算？',
    brief: '某 ETF 的一个 creation unit 为 U=40,000 份。AP 可按每份 ETF 25.00 元取得并交付申购篮子，取得 ETF 份额后可按当前可成交 bid 25.45 元卖出；融资、交易、申购费与冲击等其他成本合计为每份 0.28 元。题面假定两个交易腿能够按给定价格完成。',
    facts: [
      { label: 'Creation unit', value: 'U = 40,000', note: '不能按任意一份申购' },
      { label: 'Execution', value: '25.00 → bid 25.45', note: '买篮子、卖 ETF' },
      { label: 'Other costs', value: '0.28 / share', note: '所有题面给定摩擦合计' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '净利润 6,800 元；每份可执行价差为 0.17 元', diagnosis: '正确：必须使用 ETF 可卖出的 bid，并从 0.45 元毛价差中扣除每份 0.28 元的全部其他成本。' },
      { id: 'b', label: '毛利润和净利润均为 18,000 元；申购本身没有现金成本', diagnosis: '18,000 元只是 0.45×40,000 的毛价差；申购权限不会消除融资、交易、费用与冲击成本。' },
      { id: 'c', label: '净亏损 11,200 元；其他成本应从篮子价值中扣除后再与 ETF bid 比较', diagnosis: '11,200 元是其他成本总额，不是净损益。成本应与毛价差相减，而不是把成本本身当作套利亏损。' },
    ],
    calculation: '每份毛价差=25.45−25.00=0.45；每份净利润=0.45−0.28=0.17；一个 creation unit 的净利润=0.17×40,000=6,800 元。',
    reveal: '溢价套利的方向是买入或复制申购篮子、卖出或卖空 ETF，再用新创设份额完成交付。它约束的是可执行 bid 与完整篮子成本之间的差，而不是屏幕上的 ETF last price 与昨日 NAV。任一交易腿无法成交、无法融资或无法借券，都可能让纸面价差失去可执行性。',
  },
  {
    id: 'discount-redemption',
    label: '执行账本 04 · Discount redemption',
    title: 'ETF 出现折价时，赎回套利的净利润为什么不是 ETF 与篮子价格的简单差？',
    brief: '某 ETF 的一个 redemption unit 为 U=40,000 份。AP 可按 ETF 当前 ask 24.45 元买入足额份额并申请赎回，收到的篮子可按每份 ETF 对应价值 24.80 元卖出；借券回补、交易、赎回费、结算与冲击成本合计为每份 0.22 元。题面假定赎回篮子能够按给定价格处置。',
    facts: [
      { label: 'Redemption unit', value: 'U = 40,000', note: '需凑足一个赎回单位' },
      { label: 'Execution', value: 'ask 24.45 → 24.80', note: '买 ETF、卖收到的篮子' },
      { label: 'Other costs', value: '0.22 / share', note: '题面完整摩擦合计' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '净利润 14,000 元；用 0.35 元价差直接乘以 40,000 份', diagnosis: '14,000 元是扣除交易与结算摩擦之前的毛价差；它不是 AP 最终可保留的净利润。' },
      { id: 'b', label: '净利润 5,200 元；每份毛价差 0.35 元，扣除成本后剩 0.13 元', diagnosis: '正确：买入 ETF 使用 ask，处置篮子使用可成交价值，再扣除题面给定的全部成本。' },
      { id: 'c', label: '净利润 8,800 元；成本总额本身就是赎回机制创造的收益', diagnosis: '8,800 元等于 0.22×40,000，是需要支付的成本，不是利润；方向不能因其从毛价差中扣除而颠倒。' },
    ],
    calculation: '每份毛价差=24.80−24.45=0.35；每份净利润=0.35−0.22=0.13；一个 redemption unit 的净利润=0.13×40,000=5,200 元。',
    reveal: '折价套利的典型方向是买入 ETF、赎回得到篮子并处置或用于回补既有篮子空头。赎回权只是 AP 拥有的操作权限，不是必须执行的义务；若收到的证券难以出售、结算失败风险上升或资产负债表容量不足，折价可以超过平静时期的常见范围。',
  },
];

const systemScenarios: Scenario[] = [
  {
    id: 'no-arbitrage-band',
    label: '系统诊断 01 · Arbitrage band',
    title: 'ETF 报告溢价并不自动意味着存在可执行套利：这组报价应如何判断？',
    brief: '某时点的同步交易模型给出 ETF 可执行无套利区间 [24.58, 25.28] 元；ETF 二级市场 bid/ask 为 24.94/24.98 元，网页显示的报告 NAV 为 24.80 元。区间已经包含申赎单位、买卖价差、融资、借券、费用、结算和预期冲击。题面只判断当前报价是否越过可执行边界。',
    facts: [
      { label: 'Executable band', value: '[24.58, 25.28]', note: '完整成本后的双边边界' },
      { label: 'ETF quote', value: '24.94 / 24.98', note: 'bid / ask' },
      { label: 'Reported NAV', value: '24.80', note: '不是单独的执行价格' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '应立即做 creation：ETF ask 相对报告 NAV 溢价约 0.73%', diagnosis: '做 creation 后需要卖出 ETF，因此相关价格是 bid，而不是买入用的 ask；更重要的是 24.94 尚未超过 25.28 的上边界。' },
      { id: 'b', label: '应立即做 redemption：ETF bid 高于区间下限 24.58，已经形成折价套利', diagnosis: '赎回套利需要先按 ask 买入 ETF；只有 ETF ask 低于赎回侧下边界，才可能覆盖完整成本。高于下限并不是触发条件。' },
      { id: 'c', label: '没有可执行套利；ETF bid 与 ask 都位于成本调整后的区间内', diagnosis: '正确：相对报告 NAV 的表面差异可以存在，但两条可成交报价均未越过相应的执行边界。' },
    ],
    calculation: 'Creation 侧比较 ETF bid=24.94 与上界 25.28，尚差 0.34；redemption 侧比较 ETF ask=24.98 与下界 24.58，尚高 0.40。因此两侧都没有覆盖完整摩擦后的可执行利润。',
    reveal: '套利约束更像一条状态依赖的价格带，而不是把 ETF 钉在一个无摩擦点上。固定申赎费、creation-unit 离散性、融资与借券成本、资本占用及市场冲击都会改变边界；压力时期这些成本共同扩大时，合理价格带也会变宽。',
  },
  {
    id: 'stale-nav-clock',
    label: '系统诊断 02 · Stale NAV',
    title: 'ETF 相对官方 NAV 折价 6%，为什么相对同步可执行价值反而可能是溢价？',
    brief: '跨时区或底层市场暂停交易的情形下，网页报告 NAV 为 100 元，ETF 当前价格为 94 元；仍在交易的期货、汇率与相关证券共同指向同步可执行价值 V*=93.50 元。题面假定 V* 已按同一货币、应计项目和当前时钟校准，但它仍是模型估计而非可保证实现的清算价值。',
    facts: [
      { label: 'Reported NAV', value: '100.00', note: '含滞后底层价格' },
      { label: 'ETF price', value: '94.00', note: '当前二级市场价格' },
      { label: 'Synchronized V*', value: '93.50', note: '当前可交易信息的估计' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '报告折价为 6.00%，但相对 V* 是约 0.535% 的溢价', diagnosis: '正确：同一个 ETF 价格相对两个不同时钟的基准会得到相反符号；这正是报告折价需要拆解的原因。' },
      { id: 'b', label: '真实折价仍是 6.00%，因为官方 NAV 在定义上总比市场同步估计更接近可交易价值', diagnosis: '官方 NAV 服务于基金会计与份额估值，但若底层收盘时钟滞后，它并不必然代表当前可执行价值。' },
      { id: 'c', label: '相对 V* 仍折价约 0.535%，因为 ETF 价格低于报告 NAV 就不能被重新分类为溢价', diagnosis: '相对 V*，ETF 价格 94 高于 93.50，符号应为正；报告 NAV 的方向不能替代同步基准的重新计算。' },
    ],
    calculation: '报告 premium/discount=94/100−1=−6.00%；同步偏离=94/93.50−1≈+0.0053476，即约 +0.535%。',
    reveal: '报告折价可以拆成“ETF 相对同步价值的交易偏离”与“官方 NAV 相对当前信息的时钟偏离”。在国际股票、债券、停牌资产和期货型产品中，先判断基准是否同步，往往比先解释溢折价更重要；V* 也必须标作估计，不能伪装成无争议真值。',
  },
  {
    id: 'impact-capacity-path',
    label: '系统诊断 03 · Impact & capacity',
    title: '套利确实启动后，哪一侧承担主要收敛，为什么仍可能留下正价差？',
    brief: '某 ETF 的可成交 bid 为 50.42 元，对应 creation basket 的可成交 ask 为 50.00 元；除冲击外的全成本为每份 0.12 元。AP 最多只能执行 2 个 creation units，共 100,000 份。题面估计这两份交易会把 ETF bid 压低 0.05 元、把 basket ask 推高 0.17 元，并假定两项冲击可相加；达到两份后资本限额立即生效。',
    facts: [
      { label: 'Initial gap', value: '50.42 − 50.00', note: '每份毛价差 0.42 元' },
      { label: 'Two-CU impact', value: 'ETF −0.05 / basket +0.17', note: '两腿合计缩窄 0.22 元' },
      { label: 'Capacity / costs', value: 'K=2 / c=0.12', note: '两份后不能继续扩表' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'ETF 一侧承担全部收敛；卖出 100,000 份后毛价差归零，因此不会留下溢价', diagnosis: '题面明确给出 basket 买盘造成 0.17 元冲击，而 ETF 只移动 0.05 元；合计冲击也只有 0.22 元，不能把 0.42 元毛差全部消除。' },
      { id: 'b', label: '篮子承担约 77% 的本轮收敛；容量耗尽后仍剩每份约 0.08 元净边际，因此溢价可以暂时持续', diagnosis: '正确：篮子上涨贡献 0.17/0.22≈77%，ETF 下跌贡献约 23%；新毛差为 0.20，扣除 0.12 成本仍有 0.08，但题面资本上限禁止第三份。' },
      { id: 'c', label: '只要净边际仍为正，AP 就必须继续申购；资本限额不能改变套利均衡', diagnosis: 'AP 的申赎资格不是无限扩表义务。正的纸面边际与可执行数量是两个条件；K 已耗尽时，残余价差可以存在。' },
    ],
    calculation: '初始毛差=0.42；两份后的毛差=0.42−0.05−0.17=0.20；剩余净边际=0.20−0.12=0.08 元。篮子侧收敛份额=0.17/(0.05+0.17)≈77.3%。',
    reveal: '套利者的两条订单会共同改写价差，深度更薄的一侧可以承担更多价格移动；但收敛方向正确也不意味着能做无限数量。必须同时报告两侧冲击、整数 unit 与最先绑定的容量约束，才能解释“已经套利、价差为何仍在”。',
  },
  {
    id: 'bond-evidence-diagnosis',
    label: '系统诊断 04 · Bond ETF evidence',
    title: '债券 ETF 出现 5% 以上报告折价且次日 NAV 下修，现有证据究竟允许什么结论？',
    brief: '压力日收盘，一只债券 ETF 的官方 NAV 为 100.00 元，同一时点 ETF bid/ask 为 94.20/94.60 元；题面假定官方 market price 口径采用二者中点 94.40 元。当日实际 redemption basket 的可执行 bid 估计为 94.00 元，完成赎回另需每份 0.30 元成本。次日官方 NAV 下修至 95.10 元，数据库同时显示当日净 redemption。所有数值只用于判断证据边界。',
    facts: [
      { label: 'Reported marks', value: 'NAV 100 / ETF 94.20–94.60', note: '报告折价超过 5%' },
      { label: 'Executable redemption', value: 'basket bid 94.00 / cost 0.30', note: '按当日真实篮子估计' },
      { label: 'Next observation', value: 'NAV 95.10 / net redeem', note: '次日估值与净申赎' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '已证明存在约 5.6% 无风险赎回套利；次日 NAV 下修只是基金结构失灵的结果', diagnosis: '赎回方向要按 ETF ask 买入，并按实际 basket bid 处置；这里的可执行净边际为负。次日 NAV 下修也不能单独识别结构失灵。' },
      { id: 'b', label: '次日 NAV 接近 ETF，所以已证明全部折价都是正确价格发现，AP 容量和流动性完全无关', diagnosis: '事后 NAV 追赶与信息发现相容，却不能排除流动性超调、dealer inventory、估值误差或资本约束；“全部正确”超出证据。' },
      { id: 'c', label: '证据同时容许 stale NAV 与受限套利；要区分两者，还需逐项报价深度、真实篮子、gross 申赎和 AP 容量', diagnosis: '正确：报告折价很大，但按给定 ask、basket bid 与成本没有赎回利润；次日 NAV 下修支持价格发现解释，却不是其充分证明，净 redemption 也会掩盖 gross 双向活动。' },
    ],
    calculation: '题设报告口径=94.40/100−1=−5.60%；可执行赎回净边际=94.00−94.60−0.30=−0.90 元。次日 NAV=95.10 是后续观测，不是当日可成交价格或随机对照。',
    reveal: '同一组压力期事实可以同时包含信息与摩擦。可证伪的研究必须比较当时可得的 evaluated marks、逐项 executable bids、实际 redemption basket、gross creates/redeems、dealer inventory 与 AP 资本；只看折价、次日 NAV 或净流量中的任一个，都无法唯一识别机制。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...ledgerScenarios.map((item, index) => ({ id: item.id, mode: 'ledger' as const, index })),
  ...systemScenarios.map((item, index) => ({ id: item.id, mode: 'system' as const, index })),
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

export default function EtfArbitrageLab() {
  const [mode, setMode] = useState<Mode>('ledger');
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
  const scenarios = mode === 'ledger' ? ledgerScenarios : systemScenarios;
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
    reset('ledger', 0);
  }

  const modeLabel = mode === 'ledger' ? '账本与执行套利' : '边界与系统诊断';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'system' && mode === 'ledger'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>NAV · CREATION · REDEMPTION · ARBITRAGE CAPACITY</span>
          <h3>先闭合基金与 AP 的执行账本，再判断价格偏离究竟是套利机会、时钟错位还是容量约束</h3>
        </div>
        <p>两种模式各四题。Mode A 计算 NAV、价值中性申购与双向执行利润；Mode B 诊断无套利区间、滞后 NAV、两侧冲击与容量，以及债券 ETF 混合证据。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="ETF 申赎与套利实验模式">
        <button type="button" aria-pressed={mode === 'ledger'} onClick={() => selectMode('ledger')}>
          <span>MODE A</span><b>Ledger &amp; Execution</b><small>NAV、价值中性申购与双向可执行套利</small>
        </button>
        <button type="button" aria-pressed={mode === 'system'} onClick={() => selectMode('system')}>
          <span>MODE B</span><b>Diagnose &amp; System</b><small>套利带、估值时钟、冲击容量与竞争解释</small>
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
              name={'etf-arbitrage-' + mode + '-' + scenario.id}
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
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从基金净资产与申赎账本，推进到可执行套利带、估值时钟、两侧冲击与 AP 容量，再到债券 ETF 的竞争解释。你仍可从上方题目选择器返回任一题更新答案。</p>
          <strong>完成不等于“ETF 必须始终贴住一个静态 NAV”。价格约束是否有效，取决于同步价值、双边执行成本、申赎可用性、AP 的融资与资本容量，以及底层市场能否吸收对应篮子订单。</strong>
          <div><button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button></div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算过程、机制边界与诊断解释仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>八题使用简化的教学账本、冻结报价与假设性执行成本，不构成投资、交易、税务或法律建议，也不代表任何真实 ETF、交易所或中介机构的可成交条件。实际申购赎回资格、篮子、现金替代、费用、估值时钟、结算、借券、融资和风险限额，以产品招募说明书、基金文件、AP 协议、交易场所规则及适用法律为准；AP 拥有申赎权限，并不因此承担在任何价格或市场状态下提供无限套利资本的义务。</p>
    </div>
  );
}
