'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'portfolio' | 'transmission';
type Choice = 'a' | 'b' | 'c';

type Option = {
  id: Choice;
  label: string;
  diagnosis: string;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: Choice;
  options: Option[];
  calculation: string;
  reveal: string;
  revisit: string;
};

type AttemptState = {
  choice?: Choice;
  revealed?: boolean;
};

const STORAGE_KEY = 'market-world-model:2.04-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};

const portfolioScenarios: Scenario[] = [
  {
    id: 'wrapper-versus-strategy',
    label: '组合实验 01 · 两条分类轴',
    title: '“ETF”是否自动等于“被动指数基金”？',
    brief: '产品甲在交易所连续交易，并通过大额申赎单元增减份额，但投资顾问按自有研究主动选券；产品乙不在交易所逐笔交易，投资者按日终净值向基金申赎，组合按一套公开指数规则复制。只根据这些事实判断。',
    facts: [
      { label: '产品甲', value: 'ETF wrapper', note: '组合选择具有主动裁量' },
      { label: '产品乙', value: 'Open-end fund', note: '按指数规则管理' },
      { label: '分类问题', value: 'Wrapper ≠ strategy', note: '交易载体与选券方式是两条轴' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '甲是被动基金，因为所有 ETF 都只能复制指数', diagnosis: 'ETF 描述份额怎样交易和申赎，不自动决定组合是否按指数规则管理。主动 ETF 是真实存在的产品类别。' },
      { id: 'b', label: '甲是主动 ETF，乙是非 ETF 的被动指数基金；两种组合都可能存在', diagnosis: '正确：strategy axis 回答组合决策是否以规则化基准为目标，wrapper axis 回答投资者与基金怎样交易份额。' },
      { id: 'c', label: '乙不是被动基金，因为只有 ETF 才能追踪指数', diagnosis: '传统开放式共同基金、公募基金或其他载体同样可以采用指数化策略；上市交易不是被动管理的必要条件。' },
    ],
    calculation: '分类矩阵：主动/被动 strategy × ETF/非 ETF wrapper；题设中的甲与乙分别落在“主动×ETF”和“被动×非 ETF”。',
    reveal: '先分轴，再谈机制。把 ETF 当成策略会把 AP、做市商和二级市场误写成基金经理的选股目标；把被动当成载体又会漏掉传统指数基金的现金申赎订单。',
    revisit: '回看 03–06「被动、指数基金与 ETF 的分类边界」。',
  },
  {
    id: 'cap-weight-drift',
    label: '组合实验 02 · 自我再平衡',
    title: '市值加权指数中，一只成分股单独上涨是否必然触发基金追涨？',
    brief: '某全复制基金与市值加权指数起初都只有 A、B 两股，市值/持仓分别为 60 与 40 百万元。A 随后上涨 10%，B 不变；成分、流通股数、公司行动、资金流与费用均不变，基金持股数量也未变。',
    facts: [
      { label: 'Initial values', value: 'A 60 / B 40m', note: '基金与指数完全一致' },
      { label: 'Price move', value: 'A +10% / B 0%', note: '只有价格变化' },
      { label: 'New values', value: 'A 66 / B 40m', note: '总值变为 106m' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '必须再买 A 6 百万元，才能把权重提高 10%', diagnosis: '10% 是 A 的价格回报，不是目标权重增加 10 个百分点；原有 A 持仓已随价格升值到 66 百万元。' },
      { id: 'b', label: '必须卖 A、买 B，恢复最初的 60/40 权重', diagnosis: '这相当于追踪一个固定权重或定期再平衡策略，不是题设的流通市值加权规则。' },
      { id: 'c', label: '无需因这次价格变化本身交易；基金和指数权重都变为约 62.26%/37.74%', diagnosis: '正确：在股数与自由流通因子不变时，市值加权指数和全复制持仓会由同一价格变化同步漂移。' },
    ],
    calculation: 'A 新权重=66/(66+40)=62.264%；B=37.736%。基金与指数使用同一价格，所以主动权重仍为零。',
    reveal: '市值加权的“自我再平衡”只覆盖纯价格漂移。新增资金、成分进出、自由流通股调整、发行回购、现金分红处理和复制误差仍会生成订单。',
    revisit: '回看 12–15「权重数学、价格漂移与真正需要交易的变化」。',
  },
  {
    id: 'flow-and-rebalance',
    label: '组合实验 03 · 目标到订单',
    title: '资金流与指数换权同时发生时，订单方向怎样被共同决定？',
    brief: '基金交易前净资产为 100 百万元，A/B/C 持仓为 50/30/20。开盘前确认现金净申购 20 百万元；同日生效的新指数权重为 40%/35%/25%。忽略价格变化、费用、现金缓冲、在途订单和整手限制。',
    facts: [
      { label: 'Current holdings', value: '50 / 30 / 20m', note: '交易前合计 100m' },
      { label: 'Confirmed flow', value: '+20m cash', note: '本轮可用于组合' },
      { label: 'New weights', value: '40 / 35 / 25%', note: '作用于交易后 120m' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'A/B/C 的目标订单为 −2/+12/+10 百万元，净买入为 20 百万元', diagnosis: '正确：新目标市值为 48/42/30，再减现有持仓；资金流可以买入组合，同时换权仍让 A 成为净卖出。' },
      { id: 'b', label: '三只都按旧权重买入 +10/+6/+4 百万元，因为资金流必然按旧指数分配', diagnosis: '旧权重不再是生效目标；这样交易后仍保持 50/30/20，无法跟上新指数。' },
      { id: 'c', label: '只按权重变化交易 −10/+5/+5 百万元，净额为零', diagnosis: '这忽略了新增 20 百万元现金。订单必须同时满足新目标组合与资金账本。' },
    ],
    calculation: '目标市值=120×(40%,35%,25%)=(48,42,30)m；订单=目标−现有=(−2,+12,+10)m，合计 +20m。',
    reveal: '“有净流入，所以每只成分都被买”并不成立。资金流项、规则换权项、现有偏离和在途暴露共同决定证券层订单；净买入组合中也可以包含卖单。',
    revisit: '回看 17–20「统一订单恒等式与三类机械需求」。',
  },
  {
    id: 'difference-versus-error',
    label: '组合实验 04 · 两种追踪量',
    title: '基金每月稳定落后 0.10%，Tracking Error 会是多少？',
    brief: '连续四个月，基金减指数的简单回报差依次为 −0.10%、−0.10%、−0.10%、−0.10%。使用本节定义：Tracking Difference 是平均回报差，事后 Tracking Error 是回报差去均值后的样本标准差；暂不年化。',
    facts: [
      { label: 'Active returns', value: '−0.10% × 4', note: '每月完全相同' },
      { label: 'Tracking Difference', value: 'Mean(Rf − Ri)', note: '描述平均方向' },
      { label: 'Tracking Error', value: 'Sample SD(Rf − Ri)', note: '描述围绕均值的波动' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'Tracking Difference 与 Tracking Error 都是 −0.10%', diagnosis: '标准差不能为负；而且稳定偏离去均值后每期都为零。' },
      { id: 'b', label: 'Tracking Difference 为 −0.10%，Tracking Error 为 0', diagnosis: '正确：基金可以非常稳定地落后，因而低 TE 并不等于低成本或没有持续拖累。' },
      { id: 'c', label: 'Tracking Difference 为 0，Tracking Error 为 0.10%', diagnosis: '两者含义被互换。平均偏离保留方向，波动率只读取偏离在时间上的不稳定程度。' },
    ],
    calculation: 'TD=(−0.10%−0.10%−0.10%−0.10%)/4=−0.10%；每项减均值均为 0，所以样本 TE=0。',
    reveal: '费用可能造成稳定负 Tracking Difference，却不一定抬高 Tracking Error；抽样、交易时点和公司行动误差则更可能让回报差随时间摆动。评价产品必须同时看两者。',
    revisit: '回看 22–25「Tracking Difference、Tracking Error 与来源分解」。',
  },
];

const transmissionScenarios: Scenario[] = [
  {
    id: 'rebalance-timing',
    label: '传导实验 01 · 执行时钟',
    title: '指数变更已公告时，为什么不一定等到生效收盘才交易？',
    brief: '某新增成分在周五收盘后进入指数，基金必须买入固定规模。教学模型把三个候选的预期交易冲击与因提前/延后持仓产生的追踪风险等价成本相加：提前分批为 8+5 bp，生效收盘一次完成为 20+0 bp，次日补齐为 10+12 bp。这里 1 bp（basis point，基点）=0.01 个百分点。',
    facts: [
      { label: '提前分批', value: '8 + 5 bp', note: '低冲击、承担提前暴露' },
      { label: '生效收盘', value: '20 + 0 bp', note: '拥挤冲击、当期追踪最紧' },
      { label: '次日完成', value: '10 + 12 bp', note: '较低冲击、承担落后暴露' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '按题设应提前分批，总等价成本 13 bp；但这不是所有调仓的普遍最优', diagnosis: '正确：13 低于收盘的 20 和次日的 22；若价格风险、冲击或授权权重改变，排序也会改变。' },
      { id: 'b', label: '必须在生效收盘成交，因为被动基金不能作任何执行判断', diagnosis: '被动约束目标暴露，不会删除执行判断。经理仍需在追踪偏离与实施成本之间选择。' },
      { id: 'c', label: '应在次日成交，因为等待总能降低价格冲击', diagnosis: '等待项在题设中造成 12 bp 追踪风险成本；更慢不自动更便宜。' },
    ],
    calculation: 'C提前=8+5=13 bp；C收盘=20+0=20 bp；C延后=10+12=22 bp。教学候选最小值为提前分批。',
    reveal: '公告日把未来机械需求变成公开信息，流动性提供者和抢跑者会先行动。基金越追求生效点零偏离，越可能在拥挤时点支付冲击；越早或越晚交易，越承担主动暴露。',
    revisit: '回看 30–34「公告、生效、抢跑与收盘竞价」。',
  },
  {
    id: 'secondary-not-flow',
    label: '传导实验 02 · 两级市场',
    title: '投资者在交易所买入 500 万元 ETF，底层股票是否必然同额被买入？',
    brief: '投资者甲在二级市场以 500 万元从投资者乙手中买入既有 ETF 份额；当日 ETF 在外份额数未变，没有 creation 或 redemption，做市商库存也未参与。忽略交易费用。',
    facts: [
      { label: 'Buyer cash', value: '−5m', note: '支付给份额卖方' },
      { label: 'Seller cash', value: '+5m', note: '既有份额转手' },
      { label: 'Shares outstanding', value: 'No change', note: '基金账本不变' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '必然；500 万元会穿过 ETF 直接流入每只成分股', diagnosis: '二级成交只改变份额持有人；题设没有新增份额、基金现金或底层交易。' },
      { id: 'b', label: '基金收到 500 万元，但可选择暂时持有现金', diagnosis: '买方把现金付给卖方，不是基金。传统现金申购基金才更接近“投资者现金进入基金账本”。' },
      { id: 'c', label: '不必；题设中基金与底层直接交易均为零，只有份额所有权转移', diagnosis: '正确：持续单边需求耗尽卖方或做市库存后，后续 creation 才可能把压力接到底层。' },
    ],
    calculation: '二级市场：买方现金 −5m、卖方现金 +5m、基金现金 0、ETF 在外份额变化 0、由本交易直接导致的底层订单 0。',
    reveal: '“ETF 成交额”“ETF 净申购”和“基金买卖底层”是三层变量。它们能通过库存与申赎连接，却不能相加或一比一替代。',
    revisit: '回看 08–11「两种申赎账本与 ETF 库存缓冲」。',
  },
  {
    id: 'replication-choice',
    label: '传导实验 03 · 复制选择',
    title: '完全复制是否一定是最低总追踪成本？',
    brief: '某债券指数含大量难交易小券。对同一评估期，完全复制的预期交易与持有成本为 18 bp、抽样造成的风险等价成本为 0；抽样组合的交易与持有成本为 6 bp、抽样风险等价成本为 7 bp。两者均满足基金合同授权，其他条件相同。',
    facts: [
      { label: 'Full replication', value: '18 + 0 bp', note: '持仓更像指数、交易更昂贵' },
      { label: 'Sampling', value: '6 + 7 bp', note: '交易更少、残余风险更高' },
      { label: 'Objective', value: 'Total expected cost', note: '题设把风险换算为等价成本' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '完全复制必然更好，因为持有每一只成分就没有任何追踪差异', diagnosis: '完全复制仍有费用、税、现金、执行和公司行动时差；在题设中其可量化总成本也更高。' },
      { id: 'b', label: '按题设抽样的总等价成本为 13 bp，低于完全复制的 18 bp', diagnosis: '正确：被动经理可以用有限裁量降低实施成本；代价是模型误差和状态变化下的追踪风险。' },
      { id: 'c', label: '抽样必然更好，因为少交易永远不会增加风险', diagnosis: '抽样遗漏的证券、因子、期限或流动性暴露会造成残余偏离；题设已经给出 7 bp 风险成本。' },
    ],
    calculation: 'Cfull=18+0=18 bp；Csample=6+7=13 bp。差额 5 bp 只在题设概率、期限和约束下成立。',
    reveal: '“被动”不是把指数成分表机械复制到底。组合经理会在持仓相似度、可交易性、税费、现金和模型风险之间优化；债券 ETF 的指数、持仓与申赎篮子尤其可能不同。',
    revisit: '回看 26–29「完全复制、抽样、合成复制与优化边界」。',
  },
  {
    id: 'inclusion-evidence',
    label: '传导实验 04 · 证据边界',
    title: '新增成分上涨后又部分回落，最强的合格结论是什么？',
    brief: '某历史样本中，股票从指数变更公告到生效日平均异常上涨 5%，随后两周平均回落 3%。成分选择并非随机，公告可能同时改变注意力、流动性与投资者认知；研究没有直接观察全部指数基金订单。',
    facts: [
      { label: 'Pre-effective move', value: '+5%', note: '公告后到生效日' },
      { label: 'Post-effective move', value: '−3%', note: '随后两周平均反转' },
      { label: 'Design', value: 'Observational event study', note: '非随机且订单不完整' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '结果与短期价格压力相容，但不能单独识别全部 5% 的原因或把剩余 2% 定义为永久需求效应', diagnosis: '正确：部分反转约束了机制，却仍混合选择、信息、流动性、预期交易与风险调整误差。' },
      { id: 'b', label: '已经证明被动基金造成 5% 永久高估，因为价格先上涨', diagnosis: '样本随后回落，而且公告前预期、成分选择与共同信息均未排除；“造成”“永久”“高估”都越过设计。' },
      { id: 'c', label: '完全没有证据价值，因为事件研究不能用于机制判断', diagnosis: '观察研究仍能记录时间路径、成交量、异质性和反转；问题在于结论必须停在设计支持的层级。' },
    ],
    calculation: '观察到的平均路径：公告→生效 +5%，生效→两周 −3%；算术净变化约 +2%，但它不是已识别的永久因果效应。',
    reveal: '指数事件不是天然的无信息随机实验。合格研究要同时报告选择规则、公告与生效时钟、预期交易、真实资金规模、对照组、反转窗口以及竞争解释。',
    revisit: '回看 35–41「价格效应的五种解释与识别协议」。',
  },
];

const modes: { id: Mode; label: string; title: string; description: string }[] = [
  { id: 'portfolio', label: 'MODE 01', title: '从规则到组合', description: '分类轴、自我再平衡、订单与追踪量' },
  { id: 'transmission', label: 'MODE 02', title: '从组合到市场', description: '执行时钟、两级市场、复制选择与证据' },
];

const sequence = [
  ...portfolioScenarios.map((item, index) => ({ id: item.id, mode: 'portfolio' as const, index, correct: item.correct })),
  ...transmissionScenarios.map((item, index) => ({ id: item.id, mode: 'transmission' as const, index, correct: item.correct })),
];

function taskStatus(item: Scenario, attempt?: AttemptState) {
  if (!attempt?.revealed) return attempt?.choice ? '已选择，尚未提交' : '未作答';
  return attempt.choice === item.correct ? '已提交，回答正确' : '已提交，回答错误，可重新作答';
}

function validatedAttempts(value: unknown) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
  const input = value as Record<string, unknown>;
  const valid: Record<string, AttemptState> = {};
  for (const item of sequence) {
    const raw = input[item.id];
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) continue;
    const candidate = raw as Record<string, unknown>;
    const choice = candidate.choice;
    if (choice !== 'a' && choice !== 'b' && choice !== 'c') continue;
    valid[item.id] = { choice, revealed: candidate.revealed === true };
  }
  return valid;
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

export default function PassiveFundLab() {
  const [mode, setMode] = useState<Mode>('portfolio');
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
  const scenarios = mode === 'portfolio' ? portfolioScenarios : transmissionScenarios;
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
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attempts));
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

  function choose(nextChoice: Choice) {
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
      navigate(nextUnsubmitted.mode, nextUnsubmitted.index);
      return;
    }
    pendingFocusRef.current = 'result';
    setCompleted(true);
  }

  function resetAll() {
    setAttempts({});
    setCompleted(false);
    setAnnouncement('八道题的作答记录已重置。');
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      setStorageState('session');
      setAnnouncement('八道题的作答记录已重置；无法保存，当前会话仍可作答。');
    }
    navigate('portfolio', 0, 'option');
  }

  const globalQuestionNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;

  return (
    <div className="impact-lab">
      <div className="impact-lab-head">
        <div><span>PASSIVE FUND TRANSMISSION LAB</span><h3>被动资金的组合、订单与市场传导实验</h3></div>
        <p>八题均使用固定教学参数。先区分策略与载体，再把指数权重、资金流、现有持仓、执行时钟和证据层级放入同一账本；客户端包含答案，不作为防作弊考试。</p>
      </div>
      <noscript>
        <div className="precision-note">
          <span>互动实验当前不可用</span>
          <p>此实验需要浏览器运行 JavaScript；下方按钮在无脚本状态下不能提交。你仍可直接前往 <a href="#active-practice">51 · 主动练习</a> 与 <a href="#understanding-checks">52 · 理解检查</a>，使用完整的静态题目与答案完成同一机制复习。</p>
        </div>
      </noscript>
      <p className="impact-lab-progress">全局进度：已提交 {submittedCount}/8 · 当前正确 {correctCount}/8 · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {modes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} key={item.id} onClick={() => selectMode(item.id)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${mode === 'portfolio' ? '从规则到组合' : '从组合到市场'}题目导航`}>
        {scenarios.map((item, index) => {
          const globalNumber = sequence.findIndex((entry) => entry.id === item.id) + 1;
          return (
            <button
              aria-label={`第 ${globalNumber} 题，${item.title}，${taskStatus(item, attempts[item.id])}`}
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
          <b id={resultTitleId}>八题已提交：{correctCount}/8 正确</b>
          <p>复习路径：第 1 题回看策略与载体两条轴；第 2–4 题回看市值加权、统一订单账本与两种追踪量；第 5–7 题回看执行时钟、两级市场与复制选择；第 8 题回看指数事件的竞争解释。错误题仍保留原选择，可回到对应模式逐题重做。</p>
          <div>
            <button className="impact-secondary" onClick={() => navigate('portfolio', 0)} type="button">回到第 1 题</button>
            <button className="impact-secondary" onClick={resetAll} type="button">重置全部作答</button>
          </div>
        </div>
      ) : (
        <>
          <div className="impact-question">
            <span>{scenario.label} · 全局第 {globalQuestionNumber}/8 题</span>
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
                  name={`passive-fund-${scenario.id}`}
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
      <p className="impact-lab-caveat"><b>模型边界：</b>所有资产、权重、回报差、冲击与风险等价成本均为教学构造；真实产品必须使用基金合同、指数方法文件、当期 holdings / basket、确认申赎、交易规则、税费与执行数据。保存只限本设备、本浏览器和当前题库版本。</p>
    </div>
  );
}
