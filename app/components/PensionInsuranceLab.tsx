'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'promise' | 'orders';
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

const STORAGE_KEY = 'market-world-model:2.05-lab-r1';
const EMPTY_ATTEMPT: AttemptState = {};

const promiseScenarios: Scenario[] = [
  {
    id: 'promise-owner',
    label: '负债表实验 01 · 风险承担者',
    title: 'DB、纯 DC 与保险年金究竟由谁承担投资和兑现结果？',
    brief: '雇员年薪 20 万元、服务 25 年。DB 公式为每服务一年计提工资的 2%；纯 DC sponsor 每年缴费工资的 8%；保险年金约定被保险人生存时每年支付 6 万元。只按这些明确承诺判断，不自行加入担保或保护机制。',
    facts: [
      { label: 'DB formula', value: '2% × 25 × 20万', note: '年公式待遇为 10 万元' },
      { label: 'Pure DC', value: '8% × 20万', note: '年度 sponsor 缴费为 1.6 万元' },
      { label: 'Insurance annuity', value: '6 万元/年', note: '以被保险人生存为条件' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '三者都是长期资金，因此受益人承担全部投资结果', diagnosis: '“长期”描述期限，不分配法律责任。DB 公式与保险年金都存在由计划/sponsor 或保险人兑现的承诺。' },
      { id: 'b', label: 'DB 有公式给付责任；保险人承担年金合同的长寿与资产兑现风险；纯 DC 参与人主要承担账户投资结果', diagnosis: '正确。纯 DC sponsor 仍可能承担缴费、行政和受托义务，但题设没有承诺特定终值。' },
      { id: 'c', label: '纯 DC sponsor 必须补足任意退休收入目标，DB 参与人则承担全部市场风险', diagnosis: '方向反了：题设纯 DC 只承诺规定缴费，DB 才有明确公式给付；真实混合计划需另读文件。' },
    ],
    calculation: 'DB 年待遇=2%×25×20万=10万元；纯 DC 年缴费=8%×20万=1.6万元；保险年金=生存状态下每年 6 万元。三个数的合同含义不同，不能直接比较为“收益率”。',
    reveal: '先冻结权利义务，再看资产。DB/DC 是结果风险分配，养老金/保险是法律关系；任何法域中的担保、混合条款和保护机制都必须另行核对。',
    revisit: '回看 03–06、15、26 与 30「承诺、主体和风险承担者」。',
  },
  {
    id: 'pv-discount',
    label: '负债表实验 02 · 折现',
    title: '法律支付不变时，教学折现率下降会怎样改变负债现值？',
    brief: '某单一现金流在第 10 年末支付 110 百万元。仅为教学，使用一条平坦年复利曲线，折现率从 3% 降到 2%；忽略概率、税和其他现金流。',
    facts: [
      { label: 'Future payment', value: '110', note: '第 10 年末，百万元' },
      { label: 'Old curve', value: '3%', note: '年复利教学曲线' },
      { label: 'New curve', value: '2%', note: '支付金额没有改变' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '现值由约 81.85 升至 90.24，增加 8.39，约 10.25%', diagnosis: '正确：较低折现率提高远期固定支付的今日现值；增加额和百分比均以旧现值为基数。' },
      { id: 'b', label: '现值降至约 74，因为利率下降会降低未来价值', diagnosis: '符号反了。未来支付固定时，折现率越低，折回今天的扣减越少。' },
      { id: 'c', label: '法律支付仍为 110，所以任何计量负债都不变', diagnosis: '混淆了法律现金流与计量现值。承诺可不变，经济、会计或监管现值仍会随各自曲线变化。' },
    ],
    calculation: 'L₃%=110/1.03¹⁰=81.85；L₂%=110/1.02¹⁰=90.24；变化=8.39；8.39/81.85=10.25%。',
    reveal: '题设曲线只是教学输入，不代表真实养老金会计、最低融资或保险监管曲线；现实分析必须注明法域、口径、币种和期限。',
    revisit: '回看 09–11「状态现金流、现值与折现曲线」。',
  },
  {
    id: 'duration-funded',
    label: '负债表实验 03 · 资产负债共同重估',
    title: '资产上涨时，funded ratio 是否仍可能恶化？',
    brief: '计划初始资产 A=105、负债 L=100，资产修正久期 4、负债修正久期 12。收益率平行下降 50 bp，即 Δy=−0.005。使用一阶久期近似，忽略凸性、现金流与基差。',
    facts: [
      { label: 'Initial balance', value: 'A 105 / L 100', note: 'FR=105%，S=5' },
      { label: 'Durations', value: 'D_A 4 / D_L 12', note: '负债更敏感' },
      { label: 'Rate shock', value: '−50 bp', note: 'Δy=−0.005' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'A₁=107.10、L₁=106.00；FR 降至约 101.04%，surplus 降至 1.10', diagnosis: '正确：资产上涨 2.10，但负债上涨 6.00，分母与负债货币久期主导结果。' },
      { id: 'b', label: '资产上涨，所以 FR 必然高于原来的 105%', diagnosis: '只看分子、删除了负债重估。Funded ratio 必须同时更新 A 和 L。' },
      { id: 'c', label: '资产和负债都有久期，可以直接相互抵消，无需看市值', diagnosis: '原始久期是百分比敏感度；必须乘以各自规模，比较货币久期或 DV01。' },
    ],
    calculation: 'A₁=105×(1−4×−0.005)=107.10；L₁=100×(1−12×−0.005)=106.00；FR₁=107.10/106=101.04%；S₁=1.10。',
    reveal: '资产回报为正不等于计划状态改善。对 DB，要同时观察资产与负债规模、曲线敏感度、现金流和使用的计量口径。',
    revisit: '回看 12–18「久期、DV01、funded ratio 与盈余敏感度」。',
  },
  {
    id: 'two-lenses',
    label: '负债表实验 04 · 多口径计量',
    title: '同一承诺能否在两套明确教学曲线下同时显示低于和高于 100% funded？',
    brief: '15 年后支付 100 百万元，当前资产为 70。董事会经济教学曲线为 2%，报表教学曲线为 4%，均为年复利且其他假设完全相同。两条曲线仅为演示多口径，不代表任何真实会计规则。',
    facts: [
      { label: 'Payment', value: '100 at t=15', note: '同一法律承诺' },
      { label: 'Economic teaching', value: '2%', note: '董事会假设' },
      { label: 'Reporting teaching', value: '4%', note: '报表假设' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '经济口径 L≈74.30、FR≈94.21%；报表口径 L≈55.53、FR≈126.07%', diagnosis: '正确：同一现金流在不同明确曲线下产生不同现值与比率，不会改变题设法律支付。' },
      { id: 'b', label: '法律承诺相同，所以 funded ratio 必须只有一个数', diagnosis: '法律权利唯一不等于所有管理、会计、融资和监管计量都使用同一曲线。' },
      { id: 'c', label: '应无条件用资产预期收益率替代两条规定曲线', diagnosis: '这会越过题设和适用规则，并可能通过提高风险资产预期回报人为降低负债。' },
    ],
    calculation: 'Lᵉ=100/1.02¹⁵=74.30，FRᵉ=70/74.30=94.21%；Lᵃ=100/1.04¹⁵=55.53，FRᵃ=70/55.53=126.07%。',
    reveal: '多口径不是任意选择最顺眼的数字。每条曲线都要对应明确目的与法域；研究结论必须始终带上计量上标。',
    revisit: '回看 07、10–11 与 17「计量目的、现值和 funded ratio」。',
  },
];

const orderScenarios: Scenario[] = [
  {
    id: 'db-hedge-notional',
    label: '订单实验 01 · 利率对冲',
    title: '目标负债对冲率怎样转换成收固定、付浮动掉期的 notional？',
    brief: '负债现值 100、久期 12，目标覆盖 80% 负债货币久期。实物债券市值 60、久期 5；无现有或在途掉期。每 1 百万元收固定、付浮动的利率互换（receive-fixed swap）notional 提供 7 百万元·年的教学货币久期。',
    facts: [
      { label: 'Liability target', value: '80% × 100 × 12', note: '960 百万元·年' },
      { label: 'Physical bonds', value: '60 × 5', note: '300 百万元·年' },
      { label: 'Swap unit', value: '7 per 1 notional', note: 'receive-fixed 增加久期' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '需要 receive-fixed 约 94.29 百万元 notional', diagnosis: '正确：先算目标 960，再减实物 300 得缺口 660，最后除以每单位 7。' },
      { id: 'b', label: '需要 pay-fixed 约 94.29 百万元 notional', diagnosis: '方向反了。题设需要增加随利率下降而升值的资产侧久期，receive-fixed 才提供该方向。' },
      { id: 'c', label: '需要 receive-fixed 42.86，因为只需用实物债券敏感度除以 7', diagnosis: '这只把已有 300 转成 notional，没有计算目标负债覆盖与现有敞口之间的缺口。' },
    ],
    calculation: 'Target=0.8×100×12=960；Physical=60×5=300；Gap=660；N=660/7=94.29 百万元 notional。',
    reveal: 'Notional 大于实物债市值不自动等于过度对冲。应比较曲线节点 DV01，并同时检查基差、对手方、保证金和可用抵押品。',
    revisit: '回看 21–24「LDI、对冲率与抵押品瀑布」。',
  },
  {
    id: 'collateral-waterfall',
    label: '订单实验 02 · 今日现金',
    title: '三十年负债的计划如何覆盖今天到期的 6 百万元变动保证金？',
    brief: '计划现金 3，但运营底线为 1；T-bill 4 可当日无折价变现；股票次日才结算，私募资产不可即时变现。今日变动保证金（variation margin，VM）为 6。只按可在截止前到账的资产判断。',
    facts: [
      { label: 'Usable cash', value: '3 − 1 = 2', note: '运营底线不得动用' },
      { label: 'Same-day T-bill', value: '4', note: '题设无折价' },
      { label: 'VM today', value: '6', note: '股票次日、私募不可用' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '使用 2 现金并变现 4 T-bill，刚好覆盖 6，不卖股票', diagnosis: '正确：只有运营底线以上现金和当日可变现 T-bill 能赶上截止时点。' },
      { id: 'b', label: '使用全部 3 现金并卖 3 T-bill', diagnosis: '违反题设明确的 1 百万元运营底线；“账上有现金”不等于全部可用。' },
      { id: 'c', label: '卖 6 股票，因为养老金投资期限很长', diagnosis: '股票次日才结算，无法覆盖今日 VM；长期负债也不会改变结算时钟。' },
    ],
    calculation: 'Available collateral=(3−1)+4=6；today shortfall=6−6=0。股票与私募在题设截止前贡献 0。',
    reveal: 'FR、surplus 与今日 collateral sufficiency 必须分账。安全且易变现的资产常在压力中先被卖，正因为它能及时交付。',
    revisit: '回看 08、24–25、40 与 44「多时钟、抵押品和压力执行」。',
  },
  {
    id: 'dc-flow-glidepath',
    label: '订单实验 03 · DC 规则流',
    title: '新增缴费与 glide-path 换权同时发生时，股票一定被卖吗？',
    brief: 'Pooled DC 基金原 AUM 100，股票/债券持仓 60/40；确认新增缴费现金 10；新 glide-path 权重为 55%/45%。忽略费用、现金缓冲、价格变化、在途和整手限制。',
    facts: [
      { label: 'Old holdings', value: '60 / 40', note: '股票/债券，百万元' },
      { label: 'Confirmed flow', value: '+10 cash', note: '交易后规模 110' },
      { label: 'New weights', value: '55% / 45%', note: '股票权重下降 5 个百分点' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '按旧权重买股票 6、债券 4', diagnosis: '忽略了已经生效的新 glide-path 权重，因此交易后不会落在新目标。' },
      { id: 'b', label: '只因换权卖股票 5、买债券 5，净额为零', diagnosis: '忽略新增 10 现金。订单必须同时满足新规模与新权重。' },
      { id: 'c', label: '股票买 0.5、债券买 9.5；股票权重下降但仍是净买入', diagnosis: '正确：目标为 110×55%=60.5 和 110×45%=49.5，减现有 60/40 得 +0.5/+9.5。' },
    ],
    calculation: 'Targets=(60.5,49.5)；orders=(60.5−60,49.5−40)=(+0.5,+9.5)，合计新增 10。',
    reveal: '权重下降不等于卖出，净流入也不等于按旧权重全买。目标金额由新规模和新规则共同决定。',
    revisit: '回看 26–29 与 42「DC 风险承担、规则流量与母订单」。',
  },
  {
    id: 'insurer-capital-sale',
    label: '订单实验 04 · 资本阈值',
    title: '保险公司为恢复 120% 内部底线，最少要卖出多少固定交易块？',
    brief: '教学口径 own funds=21、capital requirement=20，初始 SR=105%；内部底线为 120%。每卖出 5 百万元风险信用并转为现金，requirement 降低 1.5；为保持唯一答案，题设暂按成交价和 own funds 不变，只允许整块交易。',
    facts: [
      { label: 'Initial SR', value: '21 / 20 = 105%', note: '低于内部 120%' },
      { label: 'One block', value: 'Sell 5 → CR 18.5', note: 'SR=113.51%' },
      { label: 'Two blocks', value: 'Sell 10 → CR 17', note: 'SR=123.53%' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '不交易，因为 105% 已高于 100%', diagnosis: '擅自把题设内部底线 120% 改成 100%。内部约束可以比法定最低要求更紧。' },
      { id: 'b', label: '卖出一个 5 百万元交易块即可', diagnosis: '21/18.5=113.51%，仍低于 120%；必须验算，而不是只看 requirement 下降。' },
      { id: 'c', label: '最少卖出两个交易块，即 10 百万元', diagnosis: '正确：21/17=123.53%，第一次达到或超过内部底线。' },
    ],
    calculation: '0 blocks: 105%；1 block: 21/18.5=113.51%；2 blocks: 21/17=123.53%。最小满足 120% 的离散动作是 2 blocks。',
    reveal: '若真实卖出压低价格并减少 own funds，可能需要更多出售；资本注入、再保险或深度买盘可打断循环。此题是通用教学比率，不代表 EU、美国或中国法定规则。',
    revisit: '回看 34–35、41 与 45–47「偿付能力、资本要求和状态依赖反馈」。',
  },
];

const modes: { id: Mode; label: string; title: string; description: string }[] = [
  { id: 'promise', label: 'MODE 01', title: '从承诺到负债表', description: '风险承担、折现、久期与多口径' },
  { id: 'orders', label: 'MODE 02', title: '从约束到订单', description: '对冲、抵押品、DC 流量与资本阈值' },
];

const sequence = [
  ...promiseScenarios.map((item, index) => ({ id: item.id, mode: 'promise' as const, index, correct: item.correct })),
  ...orderScenarios.map((item, index) => ({ id: item.id, mode: 'orders' as const, index, correct: item.correct })),
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
    <div className="impact-facts" role="group" aria-label="题目固定教学参数">
      {scenario.facts.map((fact) => (
        <article key={scenario.id + ':' + fact.label + ':' + fact.value}>
          <span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function PensionInsuranceLab() {
  const [mode, setMode] = useState<Mode>('promise');
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
  const scenarios = mode === 'promise' ? promiseScenarios : orderScenarios;
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
    navigate('promise', 0, 'option');
  }

  const globalQuestionNumber = sequence.findIndex((item) => item.id === scenario.id) + 1;

  return (
    <div className="impact-lab">
      <div className="impact-lab-head">
        <div><span>PENSION &amp; INSURANCE BALANCE-SHEET LAB</span><h3>从长期承诺到即时订单的资产负债表实验</h3></div>
        <p>八题均使用固定教学参数。先识别谁承担什么，再让折现、久期、funded ratio、抵押品、DC 规则流和资本阈值进入同一账本；客户端包含答案，不作为防作弊考试。</p>
      </div>
      <noscript>
        <div className="precision-note">
          <span>互动实验当前不可用</span>
          <p>此实验需要浏览器运行 JavaScript；下方按钮在无脚本状态下不能提交。你仍可直接前往 <a href="#active-practice">50 · 主动练习</a> 与 <a href="#understanding-checks">51 · 理解检查</a>，用完整静态题目和答案复习同一机制。</p>
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

      <div className="impact-task-picker" role="group" aria-label={(mode === 'promise' ? '从承诺到负债表' : '从约束到订单') + '题目导航'}>
        {scenarios.map((item, index) => {
          const globalNumber = sequence.findIndex((entry) => entry.id === item.id) + 1;
          return (
            <button
              aria-label={'第 ' + globalNumber + ' 题，' + item.title + '，' + taskStatus(item, attempts[item.id])}
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
          <p>复习路径：第 1 题回到风险承担者，第 2–4 题回到现值、久期和多口径；第 5 题回到 DV01 与掉期方向，第 6 题回到抵押品时钟，第 7 题回到 DC 目标账本，第 8 题回到资本阈值与反馈。错误题保留原选择，可逐题重做。</p>
          <div>
            <button className="impact-secondary" onClick={() => navigate('promise', 0)} type="button">回到第 1 题</button>
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
                  name={'pension-insurance-' + scenario.id}
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
      <p className="impact-lab-caveat"><b>模型边界：</b>金额均为百万元人民币，利率变化以小数代入，1 bp=0.0001；题目曲线、资本规则、成交价和流动性均为唯一可判的教学设定，不代表真实会计、养老金 funding 或任何法域的保险监管。真实分析必须使用适用计划/保单、曲线、规则版本、头寸、抵押品和成交数据。保存只限本设备、本浏览器和当前题库版本。</p>
    </div>
  );
}
