'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'aggregation' | 'identification';

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

type AttemptState = {
  choice: string;
  revealed: boolean;
};

const EMPTY_ATTEMPT: AttemptState = { choice: '', revealed: false };

const aggregationScenarios: Scenario[] = [
  {
    id: 'same-mean-different-distribution',
    label: '聚合实验 01 · 同均值',
    title: '平均观点完全相同，为什么两个市场仍会产生不同净买单？',
    brief: '市场 A 有两名等财富主体：一人认为价值为 120，另一人为 80；市场 B 两人都认为价值为 100。现价均为 100。教学规则规定，每名主体的“期望订单”是 (主观价值−价格)×10 股，但空头主体受借券约束，卖单最多只能达到期望卖单的 25%；买单不受约束。忽略价格冲击与风险厌恶。',
    facts: [
      { label: 'Mean belief', value: 'A = B = 100', note: '两个市场的平均主观价值相同' },
      { label: 'Desired order', value: '10 × (vᵢ−p)', note: '正数为买入，负数为卖出' },
      { label: 'Short gate', value: '25% executable', note: '只有期望卖单受约束' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '两市场净订单都为 0；平均观点相同就足以决定聚合需求', diagnosis: '这只在正负订单能够完全对称执行时成立。市场 A 的卖方被借券约束，分布与约束的组合改变了聚合结果。' },
      { id: 'b', label: '市场 A 净买入 150 股，市场 B 为 0；均值不能保存非线性约束后的聚合结果', diagnosis: '正确：A 的乐观者买 200 股，悲观者期望卖 200 股却只能卖 50 股；B 两人的期望与可执行订单均为 0。' },
      { id: 'c', label: '市场 A 净卖出 150 股；悲观者离当前价格更远，因此一定是边际定价者', diagnosis: '两人偏离价格的绝对值相同，且受约束的是卖方。能否成为边际主体取决于可执行需求，不取决于谁的叙事更悲观。' },
    ],
    calculation: 'A：x₁*=10×(120−100)=+200；x₂*=10×(80−100)=−200，受约束后 x₂=−50；Σx=+150。B：两人均有 x*=0，故 Σx=0。',
    reveal: '平均信念没有变化，净订单却变化，是因为“先平均再过约束”与“每个主体先过约束再相加”一般不相等。这正是分布 μ(z)、账户可达性与约束函数不能被一个平均主体随意压缩的原因。',
  },
  {
    id: 'desired-versus-executable',
    label: '聚合实验 02 · 订单投影',
    title: '四名主体都看多，为什么聚合订单仍可能接近零？',
    brief: '同一利好到达后，四名主体各想买 100 股。主体 F 有现金；主体 L 已触及杠杆上限；主体 M 是做市商，库存上限只允许再买 10 股；主体 R 的基金规则只允许在下次申购资金到账后交易，当前窗口可买 0 股。另有一笔不含信息的客户赎回卖单 110 股。',
    facts: [
      { label: 'Desired buys', value: '4 × 100', note: '共同方向的主观意愿' },
      { label: 'Executable caps', value: '100 / 0 / 10 / 0', note: '现金、杠杆、库存与时钟投影' },
      { label: 'Client flow', value: '−110', note: '外生于本题观点的赎回卖单' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '净买入 290 股；把四人 400 股意愿减去 110 股赎回', diagnosis: '这把不能执行的意愿当成订单。价格看到的是进入撮合或经纪执行链的数量，不是问卷中的“想买”。' },
      { id: 'b', label: '净卖出 110 股；受约束主体的看多观点对系统完全没有意义', diagnosis: 'F 和 M 仍能执行 110 股；受约束观点虽不形成当期订单，也可能在约束松动后成为潜在需求，不能永久删除。' },
      { id: 'c', label: '净订单为 0；400 股共同看多意愿经约束投影后只剩 110 股，恰好抵销赎回', diagnosis: '正确：可执行买单为 100+0+10+0=110，与客户卖单相抵。' },
    ],
    calculation: 'Σx*=400；逐账户投影后 Σx=100+0+10+0−110=0。教学式写作 xᵢ=ΠΩᵢ(xᵢ*)，聚合必须发生在投影之后。',
    reveal: '“所有人都看多但价格没涨”并不矛盾：共同信念、购买能力、交易权限、结算时钟和对手盘是不同状态。反过来，价格上涨也不证明多数人看多；少数拥有可执行资本的边际买家就可能移动价格。',
  },
  {
    id: 'marginal-agent',
    label: '聚合实验 03 · 边际主体',
    title: '谁最有钱，谁就一定决定价格吗？',
    brief: '养老金 P 持有市场 60% 的存量资产，但其战略配置带宽很宽，现价附近不交易。做市商 D 的资产负债表规模只相当于市场存量的 1%，标的库存已接近空头风险限额，并在当前最优卖价提供该价位全部可售深度。客户主动买单耗尽旧卖价；D 作为卖方交付标的后库存进一步下降、空头敞口增加，于是只在更高价格补充卖单，且该报价成为新的全市场最优卖价。下一笔小额主动买单在新卖价成交；量化基金 Q 随后因新价格触发趋势买入。题面只分析这两笔成交与随后短期反馈。',
    facts: [
      { label: 'Largest holder', value: 'P = 60%', note: '存量持仓大，但当前不交易' },
      { label: 'Quote setter', value: 'D ≈ 1% · best ask', note: '旧卖价深度耗尽；卖出后库存更负，逼近空头限额' },
      { label: 'Follower', value: 'Q = 4%', note: '新成交价出现后才触发买单' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'D 使下一笔可成交的边际卖价上移，Q 随后放大；P 的大存量不自动等于当前价格权重', diagnosis: '正确：客户买单先耗尽旧最优卖价；D 卖出标的后库存更负，因空头风险限额只在更高价格补充卖单，而该报价成为新的最优卖价。随后到达的小额买单才在新价格成交。P 只有在调整订单时才直接进入这一短时钟。' },
      { id: 'b', label: 'P 必然决定价格，因为 60% 持仓意味着其效用权重也是 60%', diagnosis: '持仓份额、交易流量、资产定价模型中的边际效用权重不是同一个量。P 当前不提交订单，无法仅凭存量份额锁定下一笔成交。' },
      { id: 'c', label: 'Q 决定第一笔价格，因为趋势策略会在价格变化后买入', diagnosis: '时间顺序被颠倒了：Q 的规则需要先观察新成交价；先是旧最优卖价被耗尽，D 因库存更负只在更高价补单，下一笔主动买单成交后，Q 才收到触发价格。' },
    ],
    calculation: '短时钟：客户主动买单 y>0 → 旧 best ask 深度耗尽 → D 作为卖方的库存变为 q′ᴰ=qᴰ−y<qᴰ，库存更负、空头风险上升 → D 只在更高价格补充卖单，且该报价成为新 best ask → 下一笔买单在新 ask 成交 → Q 的趋势规则触发。P 的 60% 是存量状态，不是这一轮的订单。',
    reveal: '“边际投资者”不是固定职业标签，而是给定资产、时刻、交易通道和冲击下仍有弹性需求的人。危机时它可能从家庭或基金转为资本受限的中介；政策介入后又可能变成央行或公共资产负债表。',
  },
  {
    id: 'composition-feedback',
    label: '聚合实验 04 · 构成反馈',
    title: '第一次上涨为什么可能改变下一轮的市场动力学？',
    brief: '市场中只有价值型 V 与趋势型 T。第一轮前两者各管理 100 单位财富。价格上涨 10% 后，教学假设 V 未持仓而 T 满仓，因此下一轮财富变成 V=100、T=110。投资者随后只按过去一期相对收益，把新增资金 20 全部分配给 T。忽略费用、风险和价格冲击。',
    facts: [
      { label: 'Initial wealth', value: 'V=100, T=100', note: '起点份额各 50%' },
      { label: 'Market move', value: '+10%', note: 'T 满仓，V 空仓' },
      { label: 'New flow', value: '+20 to T', note: '追逐上期相对收益' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '下一轮仍各占 50%；策略类型是外生常数，价格只改变账面收益', diagnosis: '题面让收益改变财富、流量再改变管理规模，策略权重已经内生变化。固定 50/50 会漏掉反馈。' },
      { id: 'b', label: '下一轮 V=100、T=130，趋势型份额约 56.5%；价格改变了未来订单规则的权重', diagnosis: '正确：上涨先把 T 的财富增至 110，再吸引 20 新资金，故总财富 230 中 T 占 130/230。' },
      { id: 'c', label: '趋势型份额为 65%；把 10% 收益误当成增加 10 个百分点份额，再加 5 个百分点流量', diagnosis: '策略份额必须从财富存量重算，收益率与份额百分点不能直接相加。' },
    ],
    calculation: '第一轮后 Wᵥ=100，Wₜ=100×1.10=110；流量后 Wₜ=130。下一轮趋势型权重=130/(100+130)=56.52%。',
    reveal: '异质主体模型的关键不是静态地列出几类人，而是让收益、赎回、破产、模仿和规则变更改变类型权重。价格既是输出，也通过财富与生存选择变成下一轮的输入。',
  },
];

const identificationScenarios: Scenario[] = [
  {
    id: 'no-trade-boundary',
    label: '识别实验 01 · No-trade',
    title: '“有私有信息就会成交”在哪组假设下是错误的？',
    brief: '两名风险厌恶交易者拥有共同先验，初始配置相对于该先验是帕累托最优；收到私人信号后，他们拥有理性预期，任何提议交易的可行性与双方自愿接受都成为共同知识。忽略套保、流动性冲击、税收、约束、不同先验和噪声交易。',
    facts: [
      { label: 'Prior', value: 'Common', note: '共同先验' },
      { label: 'Initial allocation', value: 'Pareto optimal', note: '相对于先验已有效配置' },
      { label: 'Trade', value: 'Voluntary + common knowledge', note: '接受本身泄露信息' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '在这些强条件下，私人信息本身不能支持双方同意的非零交易', diagnosis: '正确：接受交易会传递信息，Milgrom–Stokey 的结果在题设条件下导向 no-trade；现实成交说明至少一项条件或交易动机不成立。' },
      { id: 'b', label: '一定成交；两人的后验不同就必然有买卖双方', diagnosis: '不同后验不是充分条件。交易提议与接受行为本身会揭示信息，且初始配置与共同知识条件至关重要。' },
      { id: 'c', label: '一定不成交，且该结论证明现实交易者都不理性', diagnosis: '定理是条件命题，不是对所有市场的描述。现实存在套保、流动性、不同先验、噪声、约束和非共同知识等多种破坏条件。' },
    ],
    calculation: '不是数值题。诊断顺序是：共同先验？初始配置是否帕累托最优？是否纯自愿？交易与理性是否共同知识？若任一项破坏，不能直接调用 no-trade 结论。',
    reveal: '无交易定理最有价值的用途，是迫使研究者说明成交究竟由哪一条现实摩擦产生，而不是把成交量本身当作“观点分歧”的自动证明。',
  },
  {
    id: 'observational-equivalence',
    label: '识别实验 02 · 同价异因',
    title: '看到价格上涨 3% 与净主动买入，能否判断是“基本面信息被发现”？',
    brief: '数据只有分钟价格、成交量与主动买卖方向。当天出现 +3% 和显著主动买入。候选机制包括：知情者买入；短仓保证金压力导致回补；指数纳入带来被动资金；做市商短 gamma 对冲；散户共同注意力。没有账户身份、持仓、事件时钟或衍生品敞口。',
    facts: [
      { label: 'Observed', value: '+3% price', note: '结果变量' },
      { label: 'Observed', value: 'Net buyer-initiated flow', note: '交易方向' },
      { label: 'Missing', value: 'Identity + constraints', note: '无法看到动机状态' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '可以；主动买单按定义就是带有正面私有信息的订单', diagnosis: '主动性描述谁跨越报价，不描述动机。回补、被动再平衡与对冲也会提交主动买单。' },
      { id: 'b', label: '可以；价格和订单流同向已经排除被迫交易', diagnosis: '被迫回补、规则驱动买入和短 gamma 对冲恰好也会让价格与主动买流同向。' },
      { id: 'c', label: '不能；这些机制在低维成交数据中观察等价，需要身份、敞口、规则或外生时钟破局', diagnosis: '正确：同一结果可以由不同结构产生；识别需要额外可排他的预测，而不是更强的故事。' },
    ],
    calculation: '最低证据增量：账户/参与者标签，冲击前头寸，保证金或指数规则，期权 gamma 暴露，公告与资金流时钟，以及可比较的未受冲击组。',
    reveal: '异质主体框架扩大了候选机制，也提高了证据门槛。它不允许研究者在每次上涨后任选一个“最像”的主体故事；相反，必须提出哪个观察能让竞争机制给出不同预测。',
  },
  {
    id: 'holdings-endogeneity',
    label: '识别实验 03 · 需求系统',
    title: '基金持仓多、价格也高，为什么不能直接说“基金需求抬高了价格”？',
    brief: '横截面中，机构对高质量股票持仓更多，这些股票估值也更高。机构可能因为预期回报和质量而买入；价格上涨也会机械抬高以市值计的持仓；公司特征还会同时影响需求与价格。题面要求判断最小识别问题。',
    facts: [
      { label: 'Holding', value: 'Quantity × price', note: '市值口径含机械价格项' },
      { label: 'Choice', value: 'Expected return matters', note: '需求会响应预期价格' },
      { label: 'Confounder', value: 'Characteristics', note: '同时进入需求与估值' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '直接回归估值对机构持仓市值；系数就是结构需求弹性', diagnosis: '持仓市值含价格，且需求与价格同时决定；直接回归混合了机械相关、反向因果和遗漏特征。' },
      { id: 'b', label: '需把数量与价格分开，并用外生需求移位或工具变量处理需求—价格同时性', diagnosis: '正确：需求系统方法的核心之一正是用持仓数量、特征与工具处理内生价格，而不是把相关系数称为需求冲击。' },
      { id: 'c', label: '只要控制公司规模就能解决，因为所有机构都面对同一价格', diagnosis: '同一价格不消除不同基准、授权、税务、流量和预期对数量选择的影响；规模也不一定吸收全部共同决定因素。' },
    ],
    calculation: '先保存股数或组合权重而非只存市值；再写明 demand shift 的来源、排除限制、价格同时性和均衡清算。没有这些，结论应停留在持仓相关。',
    reveal: '观察持仓让主体框架可测，但持仓既是过去交易的结果，也受当前价格重估。Koijen–Yogo 的需求系统提供一条结构化路线，不意味着任一工具变量或需求形式在所有市场都有效。',
  },
  {
    id: 'representative-shortcut',
    label: '识别实验 04 · 降维边界',
    title: '什么时候使用“代表性主体”仍然是合理的研究选择？',
    brief: '研究目标是解释一个长期聚合风险溢价矩，而不是交易量、财富再分配或政策的分配效应。候选代表性主体模型能在明确偏好与市场完备假设下给出一个随机贴现因子，并将在独立样本中接受矩条件检验。研究者不声称它对应任何真实家庭，也不从拟合成功反推出微观行为。',
    facts: [
      { label: 'Target', value: 'One aggregate moment', note: '狭窄而可检验' },
      { label: 'Claim', value: 'Reduced form', note: '不把模型人当真实人' },
      { label: 'Validation', value: 'Out-of-sample moments', note: '允许被数据否证' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '可以作为有条件的降维基准；但不能据此解释成交量、主体分配或约束冲击', diagnosis: '正确：模型是否合适取决于研究问题和所保留的统计量，而不取决于是否使用了“代表性”这个词。' },
      { id: 'b', label: '完全不可以；只要现实中存在两个人，代表性主体模型就没有任何理论或经验用途', diagnosis: '过度否定。聚合模型可作为定价核或基准，但其结构解释范围必须被限制并接受检验。' },
      { id: 'c', label: '可以，并且拟合一个总量矩就证明真实主体拥有模型中的同一偏好与预期', diagnosis: '聚合拟合不识别微观偏好。许多不同的主体分布和机制可以产生相同总量矩。' },
    ],
    calculation: '判断四问：目标量是否被保留？聚合条件是否透明？被省略的分布是否会改变反事实？模型是否有独立可否证预测？四项都过关，降维才有纪律。',
    reveal: '本节不是“异质模型永远优于简洁模型”。异质性只有在它改变目标结果或反事实时才值得保留；否则，复杂度可能只增加不可识别参数。正确姿势是先问要保存什么，再决定能压缩什么。',
  },
];

const sequence: { id: string; mode: Mode; index: number; correct: string }[] = [
  ...aggregationScenarios.map((item, index) => ({ id: item.id, mode: 'aggregation' as const, index, correct: item.correct })),
  ...identificationScenarios.map((item, index) => ({ id: item.id, mode: 'identification' as const, index, correct: item.correct })),
];

function taskStatus(item: Scenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return attempt?.choice ? '已选择，尚未提交' : '未作答';
  return attempt.choice === item.correct ? '已提交，回答正确' : '已提交，回答错误，可重新作答';
}

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目教学参数">
      {scenario.facts.map((fact) => (
        <article key={`${scenario.id}:${fact.label}:${fact.value}`}>
          <span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function HeterogeneousAgentLab() {
  const [mode, setMode] = useState<Mode>('aggregation');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [attempts, setAttempts] = useState<Record<string, AttemptState>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const questionRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'aggregation' ? aggregationScenarios : identificationScenarios;
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
    const pending = pendingFocusRef.current;
    if (pending) {
      pendingFocusRef.current = null;
      if (pending === 'question') questionRef.current?.focus();
      if (pending === 'option') firstOptionRef.current?.focus();
      return;
    }
    if (revealed || completed) resultRef.current?.focus();
  }, [scenario.id, revealed, completed]);

  function navigate(nextMode: Mode, nextIndex: number, focus: 'question' | 'option' = 'question') {
    pendingFocusRef.current = focus;
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setCompleted(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode && !completed) return;
    navigate(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex && !completed) return;
    navigate(mode, nextIndex);
  }

  function choose(optionId: string) {
    setAttempts((current) => {
      const previous = current[scenario.id] ?? EMPTY_ATTEMPT;
      if (previous.revealed) return current;
      return { ...current, [scenario.id]: { choice: optionId, revealed: false } };
    });
  }

  function submit() {
    setAttempts((current) => {
      const currentAttempt = current[scenario.id];
      if (!currentAttempt?.choice || currentAttempt.revealed) return current;
      return { ...current, [scenario.id]: { ...currentAttempt, revealed: true } };
    });
  }

  function retry() {
    pendingFocusRef.current = 'option';
    setCompleted(false);
    setAttempts((current) => {
      const next = { ...current };
      delete next[scenario.id];
      return next;
    });
  }

  function continueLab() {
    if (!nextUnsubmitted) {
      setCompleted(true);
      return;
    }
    navigate(nextUnsubmitted.mode, nextUnsubmitted.index);
  }

  function restart() {
    setAttempts({});
    pendingFocusRef.current = 'question';
    setMode('aggregation');
    setScenarioIndex(0);
    setCompleted(false);
  }

  const modeLabel = mode === 'aggregation' ? '从主体到订单' : '从结果到识别';

  return (
    <div className="impact-lab">
      <div className="impact-lab-head">
        <div><span>HETEROGENEITY LAB</span><h3>先保留分布，再尝试降维</h3></div>
        <p>八个迁移任务检验你能否区分平均值与分布、意愿与执行、存量与边际、机制与观察结果。所有数字只服务于机制推理，不是市场校准。</p>
      </div>
      <p className="impact-lab-progress" aria-live="polite">已提交 {submittedCount}/8 · 当前正确 {correctCount}/8</p>
      <div className="impact-mode-picker" role="group" aria-label="异质主体实验模式">
        <button type="button" aria-pressed={mode === 'aggregation'} onClick={() => selectMode('aggregation')}><b>模式一 · 从主体到订单</b><span>聚合、约束投影、边际主体与构成反馈</span></button>
        <button type="button" aria-pressed={mode === 'identification'} onClick={() => selectMode('identification')}><b>模式二 · 从结果到识别</b><span>无交易边界、观察等价、需求内生性与降维纪律</span></button>
      </div>
      <div className="impact-task-picker" role="group" aria-label={`${modeLabel}题目`}>
        {scenarios.map((item, index) => {
          const itemAttempt = attempts[item.id];
          const isCurrent = !completed && scenarioIndex === index;
          const itemCorrect = itemAttempt?.revealed && itemAttempt.choice === item.correct;
          return (
            <button
              key={item.id}
              type="button"
              aria-current={isCurrent ? 'step' : undefined}
              aria-label={`第 ${index + 1} 题，${item.label.split(' · ')[1] ?? item.label}：${item.title}；${taskStatus(item, itemAttempt)}${isCurrent ? '；当前题' : ''}`}
              onClick={() => selectScenario(index)}
            >
              {itemAttempt?.revealed ? <span className="impact-task-status" aria-hidden="true">{itemCorrect ? '✓' : '↻'}</span> : null}
              {index + 1}
              {isCurrent ? <span className="impact-task-current" aria-hidden="true">当前题</span> : null}
            </button>
          );
        })}
      </div>

      {!completed ? (
        <>
          <div className="impact-question">
            <span>{scenario.label}</span>
            <h3 ref={questionRef} tabIndex={-1}>{scenario.title}</h3>
            <p>{scenario.brief}</p>
          </div>
          <ScenarioFacts scenario={scenario} />
          <fieldset className="impact-choice-fieldset" disabled={revealed}>
            <legend className="sr-only">{scenario.title}：请选择一个判断</legend>
            {scenario.options.map((option, index) => (
              <label key={option.id} className={choice === option.id ? 'selected' : ''}>
                <input ref={index === 0 ? firstOptionRef : undefined} type="radio" name={`heterogeneous-${scenario.id}`} value={option.id} checked={choice === option.id} onChange={() => choose(option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
          {!revealed ? <button className="impact-primary" type="button" disabled={!choice} onClick={submit}>提交并揭示机制</button> : null}
          {revealed && selected ? (
            <div ref={resultRef} tabIndex={-1} className={`impact-result ${correct ? 'correct' : ''}`} role="region" aria-labelledby={resultTitleId}>
              <b id={resultTitleId}>{correct ? '判断成立' : '需要重建链条'}</b>
              <p>{selected.diagnosis}</p>
              <code>{scenario.calculation}</code>
              <strong>{scenario.reveal}</strong>
              <div>
                {!correct ? <button className="impact-secondary" type="button" onClick={retry}>重新作答本题</button> : <span />}
                <button className="impact-primary" type="button" onClick={continueLab}>{nextUnsubmitted ? '进入下一项未完成任务' : '查看实验总结'}</button>
              </div>
            </div>
          ) : null}
        </>
      ) : (
        <div ref={resultRef} tabIndex={-1} className="impact-result correct" role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>八项机制诊断已完成</b>
          <p>最终正确 {correctCount}/8。分数不是终点；真正的迁移标准是，面对一段市场解释时能先写出主体状态与可执行订单，再判断哪些分布特征可以压缩、哪些反事实会因压缩而改变。</p>
          <strong>若结果不稳，优先重做“同均值”和“同价异因”：前者检验你是否误把平均值当系统状态，后者检验你是否从价格结果倒推动机。</strong>
          <div><span /><button className="impact-primary" type="button" onClick={restart}>清空并重新实验</button></div>
        </div>
      )}
      <p className="impact-lab-caveat"><b>模型边界：</b>本实验故意使用线性订单、硬上限和离散主体，以便看清聚合算子。真实市场还含风险厌恶、战略互动、订单簿、随机到达、网络、学习和跨资产负债表；实验结论是“聚合前先保留必要状态”，不是“四类主体足以解释所有价格”。</p>
    </div>
  );
}
