'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'portfolio' | 'organization';
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

const STORAGE_KEY = 'market-world-model:2.03-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};

const portfolioScenarios: Scenario[] = [
  {
    id: 'feasible-return',
    label: '组合实验 01 · 可行域',
    title: '为什么最高预期收益股票不是主动公募的完整答案？',
    brief: '四只股票的基准权重为 (50%, 30%, 15%, 5%)，研究团队给出的预期收益为 (10%, 9%, 6%, 4%)。产品必须满仓、不得卖空，并把与基准权重差的欧氏距离限制在 16 个百分点以内。这里的距离只是教学风险预算，不是 Tracking Error。',
    facts: [
      { label: 'Benchmark', value: '50 / 30 / 15 / 5', note: '四项合计 100%' },
      { label: 'Expected return', value: '10 / 9 / 6 / 4', note: '仅为题设，不保证实现' },
      { label: 'Constraint', value: 'Distance ≤ 16pp', note: '另须 long-only 与满仓' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'P1=(100%,0%,0%,0%)，预期收益最高，所以必然最优', diagnosis: 'P1 的预期收益虽为 10%，但相对基准距离约 60.42 个百分点，违反风险预算。实现后的赢家也不能倒推出事前可行。' },
      { id: 'b', label: 'P2=(60%,35%,5%,0%)，在三个候选中给出最高的可行预期收益 9.45%', diagnosis: '正确：P2 满仓且不卖空，相对距离约 15.81，位于题设可行域；P3 也可行但预期收益较低。' },
      { id: 'c', label: 'P3=(55%,30%,15%,0%)，因为离基准最近，所以一定最优', diagnosis: '离基准更近不等于目标值更高。P3 距离约 7.07，但预期收益 9.10%，低于同样可行的 P2。' },
    ],
    calculation: 'P2：E[R]=0.60×10%+0.35×9%+0.05×6%=9.45%；距离=√(10²+5²+(-10)²+(-5)²)=15.81pp。P3 的预期收益为 9.10%。',
    reveal: '管理人的任务是先把研究信号投影到 mandate、风险和实施共同定义的可行域，再在可行域里比较目标值。题目没有交易成本、协方差估计误差或资金流，因此不是完整投资建议。',
    revisit: '回看 16「Mandate 是可行域」、40–42「信号、优化与约束的两面」。',
  },
  {
    id: 'active-underweight',
    label: '组合实验 02 · 主动权重',
    title: 'Long-only 基金能否对一只股票拥有负的主动权重？',
    brief: '基准权重 b=(40%,30%,20%,10%)，基金权重 w=(55%,25%,20%,0%)。两组都在同一四证券宇宙内归一到 100%，主动权重定义为 a=w−b。',
    facts: [
      { label: 'Fund weights', value: '55 / 25 / 20 / 0', note: '所有绝对权重均非负' },
      { label: 'Benchmark', value: '40 / 30 / 20 / 10', note: '相同宇宙与归一口径' },
      { label: 'Active Share', value: '½Σ|w−b|', note: '衡量持仓偏离幅度' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '可以；a=(+15%,−5%,0%,−10%)，Active Share 为 15%', diagnosis: '正确：long-only 约束的是绝对权重 w≥0，不要求主动权重 a≥0；零持有一只基准成分就是相对低配 10%。' },
      { id: 'b', label: '不可以；主动权重为负就等于卖空', diagnosis: '卖空看绝对持仓是否为负。基金对第二、第四只股票低配，但绝对持仓仍分别为 25% 和 0%。' },
      { id: 'c', label: '可以，但 Active Share 是 30%，因为绝对偏离合计为 30%', diagnosis: 'Active Share 定义含二分之一；在两组权重均归一到 100% 时，一边的超配与另一边的低配会被绝对值重复计入。' },
    ],
    calculation: 'a=w−b=(15,−5,0,−10)pp；Active Share=½×(15+5+0+10)%=15%。',
    reveal: '绝对持仓、主动持仓和经济风险是三种坐标。long-only 管的是第一种；基准相对评价主要看第二种；协方差还会把第二种映射为第三种。',
    revisit: '回看 22–23「主动权重与相对低配」、29「Active Share」。',
  },
  {
    id: 'same-active-share',
    label: '组合实验 03 · 两种距离',
    title: 'Active Share 相同，Tracking Error 是否也必然相同？',
    brief: '三只资产年化波动率都为 20%。资产 1 与 2 的相关系数为 0.9，资产 1 与 3 为 0。组合 A 的主动权重是 (+10%,−10%,0)，组合 B 是 (+10%,0,−10%)；其余协方差不影响本题。',
    facts: [
      { label: 'Active Share A/B', value: '10% / 10%', note: '持仓偏离幅度相同' },
      { label: 'Corr(1,2)', value: '0.90', note: '两条主动腿高度共振' },
      { label: 'Corr(1,3)', value: '0.00', note: '两条主动腿不共振' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '相同；二者 Active Share 都是 10%，所以 TE 都是 10%', diagnosis: 'Active Share 不读取波动率和相关性，Tracking Error 读取协方差矩阵；两者单位和含义都不同。' },
      { id: 'b', label: 'A 的 TE 更高，因为资产 1 与 2 的相关性更高', diagnosis: '两条主动腿一多一空时，高正相关会使共同波动互相抵销，反而降低相对收益的波动。' },
      { id: 'c', label: 'B 的 TE 约 2.83%，高于 A 的约 0.89%，尽管 Active Share 相同', diagnosis: '正确：A 的两条主动腿高度同向，超配与低配抵销；B 缺少这种协方差抵销。' },
    ],
    calculation: 'TE_A=√[0.2²(0.1²+0.1²−2×0.1×0.1×0.9)]≈0.894%；TE_B=√[0.2²(0.1²+0.1²)]≈2.828%。',
    reveal: 'Active Share 是持仓空间的 L1 距离，Tracking Error 是协方差加权的风险距离。相同持仓偏离可以暴露于完全不同的因子和相关性。',
    revisit: '回看 24–30「事后/事前风险、Active Share 与 TE」。',
  },
  {
    id: 'total-versus-active',
    label: '组合实验 04 · 风险坐标',
    title: 'Tracking Error 为零，基金是否就“没有风险”？',
    brief: '某基金在每个时点都精确复制一个股票基准，忽略费用、税收和微小再平衡差异。该基准过去一年的年化波动率为 18%。题目中的风险只指收益波动，不讨论信用或操作风险。',
    facts: [
      { label: 'Fund return', value: 'Rₚ,t = Rᵦ,t', note: '每一期都完全相同' },
      { label: 'Benchmark vol', value: '18% annualized', note: '股票市场总波动' },
      { label: 'Active return', value: 'Rₚ,t − Rᵦ,t', note: '逐期恒等于零' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '没有风险；TE=0 就说明净值不会波动', diagnosis: 'TE 只度量相对基准的偏离。基金与基准一起下跌时，相对收益仍可为零。' },
      { id: 'b', label: '相对风险为零，但题设下总波动仍为 18%', diagnosis: '正确：完全复制消除了主动收益波动，没有消除基准本身的市场风险。' },
      { id: 'c', label: '总波动也为零，但主动风险为 18%', diagnosis: '两个坐标被倒置。基金收益与基准完全相同，所以基金总波动等于基准波动，主动收益恒为零。' },
    ],
    calculation: 'Rₚ−Rᵦ=0 ⇒ sd(Rₚ−Rᵦ)=0；但 sd(Rₚ)=sd(Rᵦ)=18%。',
    reveal: '基准相对管理首先回答“偏离共同坐标多少”，不是“持有人可能损失多少”。客户适配和绝对风险管理不能被低 TE 替代。',
    revisit: '回看 26「总风险与主动风险」、27「风险预算」。',
  },
];

const organizationScenarios: Scenario[] = [
  {
    id: 'convex-flow',
    label: '组织实验 01 · 资金流',
    title: '零期望相对收益的冒险，为什么仍可能提高管理公司的期望规模？',
    brief: '稳定策略的相对收益恒为 0，下一期资产管理规模倍数为 1.0。冒险策略有 30% 概率相对收益 +7%、对应规模倍数 1.8；有 70% 概率相对收益 −3%、对应倍数 0.8。忽略基金收益对净值的直接机械影响，倍数只表示题设的净申赎映射。',
    facts: [
      { label: 'Stable', value: '0% → 1.0× AUM', note: '无相对收益波动' },
      { label: 'Upside state', value: '30%: +7% → 1.8×', note: '流入对上行反应较强' },
      { label: 'Downside state', value: '70%: −3% → 0.8×', note: '流出损失有下界' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '冒险策略期望相对收益为 0，但期望规模倍数为 1.10，高于稳定策略', diagnosis: '正确：题设把非线性的资金流映射与对称的期望相对收益分开。' },
      { id: 'b', label: '冒险策略期望相对收益为 +4%，所以规模更高', diagnosis: '0.3×7%+0.7×(−3%)=0，不是 +4%；规模优势来自题设映射的凸性。' },
      { id: 'c', label: '两种策略的期望规模都为 1.0，因为期望相对收益相同', diagnosis: '一般不能把期望值先送入非线性函数。E[f(X)] 未必等于 f(E[X])。' },
    ],
    calculation: 'E[active return]=0.3×7%−0.7×3%=0；E[AUM multiplier]=0.3×1.8+0.7×0.8=1.10。',
    reveal: '这是说明组织激励可能与持有人效用错位的教学反例，不是现实资金流函数的校准，也不证明管理人一定会冒险。治理、下行退出、职业声誉和风险限额都可能改变选择。',
    revisit: '回看 32–36「绩效、资金流、容量与职业问责」。',
  },
  {
    id: 'target-to-orders',
    label: '组织实验 02 · 订单形成',
    title: '目标权重相同，净申购能否改变交易方向？',
    brief: '交易前基金净资产为 100 百万元，持仓 A/B/C 的市值分别为 35/25/40。开盘前已确认净申购 20 百万元，现金将在本轮可用；基金希望把交易后 120 百万元按目标权重 50%/30%/20% 配置。忽略价格变化、费用、整手和现金缓冲。',
    facts: [
      { label: 'Current holdings', value: '35 / 25 / 40m', note: '交易前合计 100m' },
      { label: 'Confirmed inflow', value: '+20m', note: '本轮可用于买入' },
      { label: 'Target weights', value: '50 / 30 / 20%', note: '作用于交易后 120m' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'A/B/C 分别交易 +15/+5/−20m，因为目标权重只应用于原有 100m', diagnosis: '忽略确认流入会把目标市值的分母算错，也无法解释 20m 新现金怎样进入组合。' },
      { id: 'b', label: '三只都按原持仓同比增加 20%，即 +7/+5/+8m', diagnosis: '同比增加能保持当前 35/25/40 的权重，不能达到 50/30/20 的目标。' },
      { id: 'c', label: 'A/B/C 的期望母订单为 +25/+11/−16m，净买入恰为 20m', diagnosis: '正确：目标市值是 60/36/24m，再减当前持仓；订单净额吸收了确认流入。' },
    ],
    calculation: '交易后目标市值=120×(50%,30%,20%)=(60,36,24)m；减当前 (35,25,40)m，得到 (+25,+11,−16)m，合计 +20m。',
    reveal: '目标权重不是订单。管理资产规模、确认资金流、现有持仓、现金缓冲、价格、整手和可交易性共同把它转换为母订单；交易台还要继续选择执行时钟。',
    revisit: '回看 35「AUM 与订单」、44–45「目标权重、母订单与交易台」。',
  },
  {
    id: 'execution-horizon',
    label: '组织实验 03 · 执行时钟',
    title: '为什么“越快完成”并不总是最低成本？',
    brief: '一个固定母订单可以在 T=1、2、4 或 8 个等长时段内完成。教学总成本为 C(T)=16/T+T 个基点：第一项代表快速执行的冲击，第二项代表等待与价格漂移风险的等价成本。模型已把不确定性压缩为确定数。',
    facts: [
      { label: 'Impact term', value: '16 / T bps', note: '执行越慢，冲击越小' },
      { label: 'Waiting term', value: 'T bps', note: '执行越慢，等待代价越大' },
      { label: 'Candidates', value: 'T = 1, 2, 4, 8', note: '只能四选一' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'T=1，因为最快完成就没有等待风险', diagnosis: 'T=1 的等待项最低，但冲击项为 16bp，总成本 17bp，并非候选最小值。' },
      { id: 'b', label: 'T=4，总教学成本 8bp', diagnosis: '正确：四个候选的成本依次为 17、10、8、10bp。' },
      { id: 'c', label: 'T=8，因为拆得越细，市场冲击一定越低', diagnosis: '只看见冲击项，忽略了题设随时间上升的等待项；T=8 总成本回升到 10bp。' },
    ],
    calculation: 'C(1)=17，C(2)=10，C(4)=8，C(8)=10，单位均为 bp；候选最小值在 T=4。',
    reveal: '真实执行需要状态依赖的冲击、波动、成交概率和信息衰减模型；本题只保留“冲击—等待”两端，说明投资经理确定方向后，订单仍需独立优化。',
    revisit: '回看 45「投资经理与交易台」、47「冲击—等待前沿」。',
  },
  {
    id: 'evidence-boundary',
    label: '组织实验 04 · 证据边界',
    title: '看到落后基金随后提高主动风险，最强的合格结论是什么？',
    brief: '一份历史观察性面板发现：样本中年中相对排名较低的美国成长型基金，在下半年平均提高了 Tracking Error。研究没有随机分配排名，没有直接观察投资委员会讨论，也没有排除风格漂移、资金流、持仓价格变化和经理更换。',
    facts: [
      { label: 'Design', value: 'Historical panel', note: '不是随机实验' },
      { label: 'Observed', value: 'Rank ↔ later TE', note: '条件相关关系' },
      { label: 'Missing', value: 'Decision process', note: '动机与替代通道未直接观察' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '结果与锦标赛式风险激励相容，但不能单独证明职业顾虑导致了主动冒险', diagnosis: '正确：观察到的行为模式能约束理论，却仍有选择、共同原因和机械持仓变化等竞争解释。' },
      { id: 'b', label: '已经证明所有落后经理都会赌博，因为排名先于风险变化', diagnosis: '时间先后只是因果识别的必要条件之一；样本、平均效应、动机和未观测通道都不支持“所有”与“已经证明”。' },
      { id: 'c', label: '完全没有信息，因为观察研究不能用于机制研究', diagnosis: '过度否定同样错误。历史面板可以建立条件模式、异质性和理论可检验含义，只是结论必须停在设计所支持的层级。' },
    ],
    calculation: '可观察链：年中相对状态 → 下半年主动风险变化。尚未被识别的箭头：排名信息 → 组织激励/职业判断 → 主动改变组合。',
    reveal: '机构研究最容易把一项回归改写成管理人的内心独白。合格叙述应把样本、时期、估计对象、替代解释和外部效度与结果一起报告。',
    revisit: '回看 36–37「职业问责与风险调整」、49「机构研究协议」。',
  },
];

const modes: { id: Mode; label: string; title: string; description: string }[] = [
  { id: 'portfolio', label: 'MODE 01', title: '从 mandate 到组合', description: '可行域、主动权重与两种风险距离' },
  { id: 'organization', label: 'MODE 02', title: '从组织到订单', description: '资金流、规模、执行与证据边界' },
];

const sequence = [
  ...portfolioScenarios.map((item, index) => ({ id: item.id, mode: 'portfolio' as const, index, correct: item.correct })),
  ...organizationScenarios.map((item, index) => ({ id: item.id, mode: 'organization' as const, index, correct: item.correct })),
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

export default function LongOnlyManagerLab() {
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
  const scenarios = mode === 'portfolio' ? portfolioScenarios : organizationScenarios;
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
        <div><span>LONG-ONLY MANAGER LAB</span><h3>主动公募的约束、组织与订单实验</h3></div>
        <p>八题均使用固定教学参数。先区分绝对持仓、主动持仓、风险与组织目标，再作答；客户端包含答案，不作为防作弊考试。</p>
      </div>
      <p className="impact-lab-progress">全局进度：已提交 {submittedCount}/8 · 当前正确 {correctCount}/8 · {storageState === 'saved' ? '本设备自动保存' : storageState === 'session' ? '本设备无法保存，当前会话仍可作答' : '正在读取本设备记录'}</p>
      <p className="sr-only" aria-live="polite">{announcement}</p>

      <div className="impact-mode-picker" role="group" aria-label="实验模式">
        {modes.map((item) => (
          <button aria-pressed={!completed && mode === item.id} key={item.id} onClick={() => selectMode(item.id)} type="button">
            <span>{item.label}</span><b>{item.title}</b><small>{item.description}</small>
          </button>
        ))}
      </div>

      <div className="impact-task-picker" role="group" aria-label={`${mode === 'portfolio' ? '从 mandate 到组合' : '从组织到订单'}题目导航`}>
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
          <p>复习路径：第 1–4 题回看 mandate、主动权重和两种风险坐标；第 5–6 题回看资金流、规模与订单；第 7 题回看执行前沿；第 8 题回看机构激励的证据边界。错误题仍保留原选择，可回到对应模式逐题重做。</p>
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
                  name={`long-only-${scenario.id}`}
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
      <p className="impact-lab-caveat"><b>模型边界：</b>所有权重、收益、协方差、资金流倍数与成本函数均为教学构造；真实产品必须使用基金合同、当期风险模型、确认申赎、交易规则与执行数据。保存只限本设备、本浏览器和当前题库版本。</p>
    </div>
  );
}
