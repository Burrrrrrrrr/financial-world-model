'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'ledger' | 'design';

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
    id: 'net-short-pnl',
    label: '头寸账本 01 · Net P&L',
    title: '股价判断正确，为什么净空头收益仍小于卖出价与回补价之差？',
    brief: '教学合约：卖空 q=800 股，开仓价 S₀=32 元，30 天后以 S₁=27.50 元回补；年化借券费 b=9%，为便于手算按初始卖出市值和 30/365 计；期间每股现金分配 0.12 元，双边交易与滑点合计 0.06 元/股。忽略税、保证金利息与日度盯市。',
    facts: [
      { label: 'Price leg', value: '800 × (32−27.50)', note: '先算价格毛利，不等于净利' },
      { label: 'Borrow leg', value: '9% × 30/365', note: '本题固定以初始市值计费' },
      { label: 'Other cash flows', value: '0.12 + 0.06 元/股', note: '现金分配补偿与双边执行成本' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '3,600 元；借来的股票不是现金，所以没有额外成本', diagnosis: '3,600 元只是价格腿毛利。借券费、现金分配补偿和执行成本都是空头必须承担的独立现金流。' },
      { id: 'b', label: '约 3,266.63 元；依次扣除借券费、现金分配补偿与执行成本', diagnosis: '正确：价格方向判断盈利，但持有时间与合约现金流吃掉约 333.37 元。' },
      { id: 'c', label: '约 3,410.63 元；只需要扣借券费', diagnosis: '借券费算对了，但漏掉 96 元现金分配补偿和 48 元双边交易与滑点。' },
    ],
    calculation: '毛利=800×(32−27.50)=3,600；借券费=800×32×9%×30/365≈189.37；现金分配补偿=800×0.12=96；执行成本=800×0.06=48；净利≈3,266.63 元。',
    reveal: '空头不是“反向持有股票”这么简单。价格腿、借券腿、公司行动、执行、融资和被迫平仓必须分栏；现实借券费常按每日市值与实际合约口径重算，本题固定初始市值只为教学。',
  },
  {
    id: 'rebate-specialness',
    label: '头寸账本 02 · Rebate',
    title: '现金担保贷款出现负 rebate 时，借券“specialness”应该怎样读取？',
    brief: '某股票贷款以现金作担保。研究数据给出同日一般担保基准 rebate rᴳᶜ=3.9%，该股票实际 borrower rebate rᴿ=−2.4%。本题定义 specialness σ=rᴳᶜ−rᴿ，均为年化率；未给经纪商加价、代理分成、担保品再投资损益或客户融资条件。',
    facts: [
      { label: 'GC benchmark', value: 'rᴳᶜ=3.9%', note: '同日易借证券的比较基准' },
      { label: 'Actual rebate', value: 'rᴿ=−2.4%', note: '借方不收利息，反而支付负 rebate' },
      { label: 'Missing layer', value: 'End-client all-in terms', note: '研究数据不等于客户账单' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'σ=−6.3%，说明借方因负 rebate 获得补贴', diagnosis: '减法方向与负号经济含义都反了；实际 rebate 越低，借券越 special、越昂贵。' },
      { id: 'b', label: 'σ=2.4%，而且这就是终端客户的完整年化借券费', diagnosis: '你只取了负 rebate 的绝对值，也忽略经纪商加价、担保与其他客户层现金流。' },
      { id: 'c', label: 'σ=6.3 个百分点；它衡量相对 GC 的稀缺溢价，不足以恢复客户 all-in 成本', diagnosis: '正确：3.9%−(−2.4%)=6.3%，但数据层只支持相对 loan-market price。' },
    ],
    calculation: 'σ=3.9%−(−2.4%)=6.3 个百分点。若按 360 天市场口径持有 12 天，单看该相对费差约为现金担保本金的 6.3%×12/360；本题没有给现金担保金额，也没有足够信息计算客户净账单。',
    reveal: 'Rebate 是现金担保贷款中的一条利率，不是跨市场统一的“借券费”标签。研究必须保存担保类型、基准、报价方向、年化日数、代理与终端客户层级。',
  },
  {
    id: 'three-denominators',
    label: '头寸账本 03 · Denominators',
    title: 'Utilization、short interest ratio 与 days to cover 为什么能同时给出完全不同的数？',
    brief: '同一观察日：数据商记录 on-loan 42 万股、其覆盖贷款池按该商定义的 lendable inventory 总量为 70 万股（包含已借出份额）；官方 short interest 快照为 94.5 万股；free float 为 900 万股；研究者预先冻结的平均日成交量为 35 万股。',
    facts: [
      { label: 'Loan pool', value: '420k / 700k', note: '只覆盖该数据商可观察库存' },
      { label: 'Position snapshot', value: '945k / 9m', note: '官方空头头寸与流通股' },
      { label: 'Trading capacity proxy', value: '945k / 350k', note: '静态头寸除以历史成交速度' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'Utilization=60%，short interest/float=10.5%，days to cover=2.7；三者不能互换', diagnosis: '正确：三个分母分别是可观察库存、流通股与平均日成交量，经济问题不同。' },
      { id: 'b', label: '三者都应等于 10.5%，否则数据至少有一项错误', diagnosis: '这把库存市场、持仓快照和成交容量强行放到同一分母；数值不同是定义使然。' },
      { id: 'c', label: 'Utilization=42%，days to cover=1.2，因为应使用 on-loan 作分子', diagnosis: '42/70 是 60%；days to cover 的标准分子是冻结时点 short interest，不是某一数据商的 on-loan。' },
    ],
    calculation: 'U=420/700=60%；SI/float=945/9,000=10.5%；DTC=945/350=2.7 天。',
    reveal: 'Utilization 表示某个可观察贷款池的占用比例，不等于全市场有同样比例流通股被卖空；days to cover 也不是未来一定需要 2.7 天，而是用历史成交量构造的压力代理。',
  },
  {
    id: 'recall-routing',
    label: '头寸账本 04 · Recall',
    title: '收到确定数量的 recall 后，哪一组动作能够闭合交还义务而不虚构违法结论？',
    brief: '教学账本：某 desk 现有 64 万股现金股票空头，原贷款人要求下一营业日交还其中 24 万股。经确认可从另一贷款人借到 9 万股；在预设 impact 上限内，市场可回补 15 万股。假设两项都能按时结算，未发生保证金违约。',
    facts: [
      { label: 'Recall', value: '240k shares', note: '改变贷款来源，不自动改变观点' },
      { label: 'Replacement borrow', value: '90k shares', note: '保留等量经济空头' },
      { label: 'Buy to cover', value: '150k shares', note: '减少现金空头与交还缺口' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '只需等待；recall 本身证明原空头交易非法，所以贷款人无权要求交还', diagnosis: 'Recall 是贷款合约生命周期中的常规权利，并不以原交易违法为前提。等待会留下未闭合的交还义务。' },
      { id: 'b', label: '替换借入 9 万股并回补 15 万股，正好覆盖 24 万股 recall；剩余经济空头为 49 万股', diagnosis: '正确：替换借入不改变 9 万股空头，买入回补减少 15 万股；64−15=49 万股。' },
      { id: 'c', label: '回补全部 64 万股，因为任何 recall 都强制整个策略清仓', diagnosis: '本题只要求交还 24 万股，且允许替换借券；是否额外去风险是策略选择，不是题面给出的合约必然。' },
    ],
    calculation: '交还来源=90k 替换借券+150k 回补=240k；经济空头由 640k 降至 640k−150k=490k。',
    reveal: 'Recall 先是融资与交付冲击，再可能经买入回补变成价格冲击。只有当替换供给、时间、深度和风险限额共同紧张时，正反馈才可能形成 squeeze；一笔 recall 本身不证明操纵或失败交收。',
  },
];

const designScenarios: Scenario[] = [
  {
    id: 'locate-borrow-fail',
    label: '制度识别 01 · Locate',
    title: '有 locate 却出现 fail-to-deliver，最强的合规与研究结论是什么？',
    brief: '美国教学情境：经纪商在接收 10 万股 short sale order 前取得符合 Rule 203(b)(1) 的 reasonable-ground locate，但没有预借或专属保留股票。逐笔隔离账本记录该订单交付 6 万股、交付缺口 4 万股；另一份证券级记录显示，该证券在 continuous net settlement（CNS，连续净额交收）系统中的净 fail 余额为 4 万股。Intent、exception use、manipulation 与后续 close-out 字段均为 not supplied。',
    facts: [
      { label: 'Pre-trade', value: 'Locate obtained', note: '订单接收前的记录状态' },
      { label: 'Isolated delivery', value: '60k delivered / 40k gap', note: '未做中央净额的逐笔账本' },
      { label: 'CNS state', value: '40k net fail', note: '题面另行给定的证券级状态' },
      { label: 'Other record fields', value: 'Intent / exception / close-out = not supplied', note: '题面字段状态' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '两个记录都等于 4 万股，所以 CNS 净 fail 可全部归给这笔订单，并证明这 4 万股属于违法 naked short', diagnosis: '数值相同不等于逐笔身份可恢复；清算净额还受其他交付缺口、应收义务和分配影响，locate 是否合理与违法意图也需要额外证据。' },
      { id: 'b', label: '逐笔 gap 与 CNS 净 fail 属于不同账本；后者进入适用 close-out 分析，但现有记录不足以锁定订单来源或违法动机', diagnosis: '正确：先分开订单、locate、借入、逐笔交付、清算净额和 close-out 状态，再谈归因与合规。' },
      { id: 'c', label: '既然有 locate，任何后续 fail 都不受 Rule 204 约束', diagnosis: 'Locate 是前置要求，不豁免交付与 close-out；两套义务不能相互替代。' },
    ],
    calculation: '在逐笔隔离账本中，100k−60k=40k 只得到该订单的交付缺口；CNS 净 fail=40k 是题面另行给定的证券级净额状态，不能从这笔订单机械恢复。两层记录都不能识别 locate 是否合理、fail 来源或是否按期 close out。',
    reveal: '“Locate、borrow、delivery、fail、close-out”是五个状态，不是一条二元合法/非法标签。公开 FTD 通常是中央净额后的证券级状态，而不是某笔订单缺口的简单别名；研究若把 FTD 全部叫 naked short，会把长卖处理延迟、净额结算和合法例外混入同一个分子。',
  },
  {
    id: 'rule-201-clock',
    label: '制度识别 02 · Price test',
    title: '美国 Rule 201 的 10% 触发后，哪一项订单判断符合题面规则？',
    brief: '教学日：某 covered security 前一交易日正常时段收盘 80.00 美元，盘中成交到 72.00 美元，上市市场触发 Rule 201 circuit breaker。当前 national best bid（NBB）为 71.63 美元；本题价格网格为 0.01 美元，因此 71.63 与 71.64 都是合法报价。忽略法定例外，只判断普通 non-exempt short sale order；限制持续本日余下时间和下一交易日。',
    facts: [
      { label: 'Trigger', value: '80.00 → 72.00', note: '上市市场记录的价格路径' },
      { label: 'Current NBB', value: '71.63', note: '题面冻结的当前报价' },
      { label: 'Clock', value: 'Rest of day + next day', note: '题面给定的适用窗口' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '所有 short sale 一律暂停到下周，任何价格都不能执行', diagnosis: 'Rule 201 是触发后的价格测试，不是整只股票的全面禁空，也不持续到任意下周。' },
      { id: 'b', label: '71.63 的普通 short order 可以执行，因为它等于当前最优买价', diagnosis: '非豁免空头在测试生效时不得于当前 NBB 或更低价格执行/显示；“等于”并不通过测试。' },
      { id: 'c', label: '71.64 的普通 short order可高于当前 NBB，71.63 则不行；NBB 变化后需重新判断', diagnosis: '正确：题面只冻结当前 NBB，价格测试不是以触发价 72.00 永久固定。' },
    ],
    calculation: '触发幅度=(80−72)/80=10%。限制开启后，普通 non-exempt short price 必须高于当前 NBB；71.64>71.63，而 71.63=71.63。',
    reveal: 'Price test 改变空头订单能否即时打到 bid，而不消除空头观点。用成交数据研究时必须保存触发时钟、NBB、short/short-exempt 标记、例外与订单未成交路径。',
  },
  {
    id: 'eligibility-selection',
    label: '制度识别 03 · Eligibility',
    title: '股票被纳入可卖空名单后下跌，为什么简单 before/after 不能自动叫作约束解除效应？',
    brief: '某市场按市值、成交量和流动性季度筛选可卖空证券。新纳入股票在事件后 20 日平均异常收益为 −2.4%，从未纳入股票为 −0.6%；但新纳入组事件前市值、动量和流动性均显著更高，规则阈值与完整排名可取得。',
    facts: [
      { label: 'Raw difference', value: '−2.4% − (−0.6%)', note: '需由两项观测结果计算' },
      { label: 'Assignment', value: 'Size + volume + liquidity', note: '规则使用的三项字段' },
      { label: 'Available design', value: 'Known thresholds + ranks', note: '题面可取得的规则资料' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '原始差为 −1.8 个百分点，但需检查规则阈值附近、预趋势与同期成分变化后才谈因果', diagnosis: '正确：先算描述差，再利用已知 assignment 构造局部可比证券并审计是否可操纵。' },
      { id: 'b', label: '−2.4% 就是因果效应，因为名单公布是公开事件', diagnosis: '公开不等于外生；名单依据本身与未来收益、风险和交易成本相关。' },
      { id: 'c', label: '无法研究，因为只要不是随机实验就不存在任何可证伪设计', diagnosis: '已知阈值、排名与分期纳入可支持断点、匹配事件研究或差分设计，但识别假设必须公开。' },
    ],
    calculation: '描述性组间差=−2.4%−(−0.6%)=−1.8 个百分点。识别还需处理 eligibility score、阈值操纵、事件前动态、其他规则变化与名单预期。',
    reveal: '名单变化同时选择“更大、更活跃、更易借”的股票。可靠设计不是把选择忽略，而是把 assignment rule 变成可审计对象，并将 eligibility、实际借券供给和真实 short activity 分层。',
  },
  {
    id: 'ban-spillover',
    label: '制度识别 04 · Ban & spillover',
    title: '危机中实施现金卖空禁令后，哪种表述既算对 DiD，又没有把观点迁移当作消失？',
    brief: '禁令前后，受限金融股相对 effective spread 从 18 bp 升至 39 bp；匹配但未受限股票从 11 bp 升至 20 bp。同窗中，受限股票 put volume 与海外同经济暴露的空头活动显著上升。假设仅为手算暂取平行趋势，现实仍有同期救助与风险差异。',
    facts: [
      { label: 'Restricted', value: '18 → 39 bp', note: '受限组的两个观测时点' },
      { label: 'Comparison', value: '11 → 20 bp', note: '比较组的两个观测时点' },
      { label: 'Spillover', value: 'Puts + offshore shorts ↑', note: '同期其他工具与场所的观测' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '禁令使 spread 增加 21 bp，并彻底消除了空头卖压', diagnosis: '未扣除共同危机变化，也把现金市场活动下降误写成全部负面暴露消失。' },
      { id: 'b', label: 'DiD=−12 bp，说明禁令改善了流动性；衍生品变化与研究无关', diagnosis: '差分方向写反；衍生品和海外迁移正是稳定单位处理假设与总暴露测量的核心。' },
      { id: 'c', label: '现金市场 spread 的描述性 DiD=+12 bp；在强识别假设下是禁令包效应，且需把替代工具纳入总均衡', diagnosis: '正确：(+21)−(+9)=+12 bp；同期政策与 spillover 仍限制单一机制解释。' },
    ],
    calculation: 'β̂ᴰⁱᴰ=(39−18)−(20−11)=21−9=+12 bp。这个量只直接描述所测现金市场 outcome，不等于总经济空头暴露变化。',
    reveal: '禁令可同时改变现货执行、做市套保、期权需求、ADR/海外场所和借券价格。研究必须报告工具迁移和对照污染，否则“卖空减少”可能只是标签与场所换了。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...ledgerScenarios.map((item, index) => ({ id: item.id, mode: 'ledger' as const, index })),
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

export default function ShortSellingLab() {
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
  const scenarios = mode === 'ledger' ? ledgerScenarios : designScenarios;
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
    reset('ledger', 0);
  }

  const modeLabel = mode === 'ledger' ? '头寸与借券' : '制度与识别';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'design' && mode === 'ledger'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>POSITION · LOAN · DELIVERY · IDENTIFICATION</span>
          <h3>先闭合空头与借券现金流，再判断规则和数据究竟识别了哪一个节点</h3>
        </div>
        <p>两种模式各四题。Mode A 要把价格、费用、库存和交还义务放进同一账本；Mode B 要把订单、locate、交付、工具迁移和反事实分开。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="卖空与借券实验模式">
        <button type="button" aria-pressed={mode === 'ledger'} onClick={() => selectMode('ledger')}>
          <span>MODE A</span><b>Position &amp; Loan</b><small>净损益、rebate、三个分母与 recall 路由</small>
        </button>
        <button type="button" aria-pressed={mode === 'design'} onClick={() => selectMode('design')}>
          <span>MODE B</span><b>Rule &amp; Identify</b><small>locate、价格测试、名单选择与禁令外溢</small>
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
              name={'short-selling-' + mode + '-' + scenario.id}
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
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从净损益、loan price、利用率和 recall，推进到 locate、price test、名单 assignment 与禁令 spillover。你仍可从上方题目选择器回到任一题更新答案。</p>
          <strong>完成不等于得到“卖空好或坏”的统一答案；可靠判断必须冻结经济暴露、现金交易、借券、交付、持仓快照、规则时钟、替代工具和所声称的福利指标。</strong>
          <div>
            <button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button>
          </div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算、合规边界与识别强度仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>八题均使用教学参数，不代表任一客户合约、交易所协议或法律意见，也不是交易建议。真实复现必须冻结 jurisdiction、venue、security、account aggregation、order marking、locate source、loan collateral、fee convention、recall terms、settlement cycle、close-out rule、margin、corporate action、衍生品与跨场所暴露，以及当时可得信息。</p>
    </div>
  );
}
