'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'clock' | 'interfaces';

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

const clockScenarios: Scenario[] = [
  {
    id: 'auction-clock',
    label: '时钟状态 01 · 撤单资格',
    title: '同一张开盘买单在 09:18 与 09:23 的撤单资格为何不同？',
    brief: '假设一只正常交易的沪深 A 股正在开盘集合竞价。投资者分别在 09:18 与 09:23 提交有效限价买单，随后立即尝试撤单；另有一张收盘集合竞价订单在 14:58 尝试撤销。',
    facts: [
      { label: 'Opening call', value: '09:15–09:25', note: '订单先集中，再在统一时点形成开盘成交价' },
      { label: 'Cancellation', value: '09:15–09:20 可撤', note: '09:20–09:25 的有效竞价申报不得撤销' },
      { label: 'Closing call', value: '14:57–15:00', note: '收盘集合竞价阶段不得撤销竞价申报' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '09:18 与 09:23 都能撤；只有成交以后才不能撤', diagnosis: '集合竞价有独立的时钟规则。09:20 之后至 09:25，撤单自由已经关闭，即使订单尚未成交，也不能把连续竞价的撤单直觉套过来。' },
      { id: 'b', label: '09:18 可以撤，09:23 与 14:58 不得撤', diagnosis: '正确：09:18 位于可撤阶段；09:23 位于开盘集合竞价不可撤阶段；14:58 位于收盘集合竞价不可撤阶段。订单内容相同，交易资格却因时钟状态不同而变化。' },
      { id: 'c', label: '09:18 不得撤，09:23 可以撤；收盘集合竞价始终可以撤', diagnosis: '方向完全相反。开盘集合竞价先经历可撤阶段，再进入不可撤阶段；收盘集合竞价也不是随时可撤。' },
    ],
    calculation: '09:18∈[09:15,09:20) → 可撤；09:23∈[09:20,09:25] → 不可撤；14:58∈[14:57,15:00] → 不可撤。',
    reveal: '不可撤窗口不是为了预测涨跌，而是为了在临近统一撮合时稳定订单集合，并可能减少最后瞬间反复撤单造成的失衡噪声。代价是投资者在新信息到来时失去撤单选择权，因此订单会在 09:20 前迁移或调整。',
  },
  {
    id: 'auction-clearing',
    label: '时钟状态 02 · 集合竞价清算价',
    title: '六组订单共同进入开盘集合竞价时，哪个价格能够实现最大成交量？',
    brief: '买单为：10.02 元×300 股、10.01 元×400 股、10.00 元×500 股；卖单为：9.99 元×200 股、10.00 元×600 股、10.01 元×300 股。忽略更细的同量择价规则，因为本题最大成交量价格唯一。',
    facts: [
      { label: 'Buy rule', value: '限价 ≥ 清算价', note: '愿意支付不低于候选价的买单可参与成交' },
      { label: 'Sell rule', value: '限价 ≤ 清算价', note: '愿意以不高于候选价出售的卖单可参与成交' },
      { label: 'Objective', value: 'max min(D,S)', note: '每个候选价的可成交量是累计买量和累计卖量的较小者' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '10.00 元，最大可成交 800 股', diagnosis: '正确：10.00 元处累计买量为 1,200 股，累计卖量为 800 股，可成交 800 股；其他候选价分别只能成交 200、700 或 300 股。' },
      { id: 'b', label: '10.01 元，因为它最接近全部买卖订单的简单平均价', diagnosis: '集合竞价不对订单价格做简单平均。10.01 元处累计买量 700、累计卖量 1,100，只能成交 700 股，少于 10.00 元的 800 股。' },
      { id: 'c', label: '9.99 元，因为最低卖价必须自动成为开盘价', diagnosis: '最低卖价只说明最积极卖方愿意成交的起点，不自动决定统一清算价。9.99 元处卖量仅 200 股，因此无法最大化成交量。' },
    ],
    calculation: '9.99：min(1,200,200)=200；10.00：min(1,200,800)=800；10.01：min(700,1,100)=700；10.02：min(300,1,100)=300。',
    reveal: '集合竞价把多个价位的订单压缩成一个统一价格，牺牲逐笔连续反应以换取集中流动性。最大成交量只是第一层规则；若多个价格并列，还要按未成交量和接近参考价等规则继续择价。',
  },
  {
    id: 'delisting-first-day',
    label: '时钟状态 03 · 公司—价格联合状态',
    title: '退市整理首日的买单为何不能再用普通主板 ±10% 直接判废？',
    brief: '某适用退市整理期的沪市主板股票前收 2.00 元，今天是整理首日；09:35 连续竞价买入基准价为 2.12 元，tick=0.01。已开通相应权限的投资者提交 2.21 元限价买单，忽略券商附加风控。',
    facts: [
      { label: 'Company state', value: '退市整理首日', note: '首日不设静态日涨跌幅，后续交易日才回到板块幅度' },
      { label: 'Ordinary cap', value: '2.00×110%=2.20', note: '这是普通主板日的静态上限，本题首日不适用' },
      { label: 'Dynamic cap', value: 'max(2.12×102%, 2.12+0.10)=2.22', note: '连续竞价动态申报范围仍然存在' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '无效，因为 2.21 元超过前收价上浮 10% 得到的 2.20 元', diagnosis: '这把普通主板静态日边界套到了退市整理首日。首日不设该静态边界，仍应继续检查动态申报范围和账户资格。' },
      { id: 'b', label: '不能按 2.20 元判废；2.21 元未越过此刻 2.22 元动态上限，题设下可成为有效申报', diagnosis: '正确：公司状态先关闭首日静态日边界，但没有关闭连续竞价动态范围。账户又已具备权限，所以这张订单通过题设中的三道门。' },
      { id: 'c', label: '退市整理首日所有交易规则都暂停，任何价格和账户都可申报', diagnosis: '“无静态日涨跌幅”不等于没有规则。动态价格范围、申报单位、投资者适当性、账户风控和撮合时钟仍然有效。' },
    ],
    calculation: '首日 static limit=不适用；dynamic upper=max(2.1624,2.22)=2.22 元；2.21≤2.22，因此不因价格范围而无效。',
    reveal: '公司状态不是价格标签，而是规则切换器。退市整理首日移除的是静态日边界，不是全部价格与账户门控；研究触限或废单时若漏掉 company-state × date，会把合法申报误记成越界订单。',
  },
  {
    id: 'board-lots',
    label: '时钟状态 04 · 板块数量单位',
    title: '“A 股买入必须是 100 股整数倍”为什么不是一条覆盖全部板块的规则？',
    brief: '比较三张买单：沪深主板 300 股、科创板 301 股、北交所 101 股。假设价格、账户资格与单笔上限都合规，也没有零股余额卖出问题。',
    facts: [
      { label: 'Main board', value: '100 股或整数倍', note: '300 股满足普通主板买入数量单位' },
      { label: 'STAR Market', value: '最低 200，之后逐股递增', note: '301 股在达到门槛后可以申报' },
      { label: 'BSE stocks', value: '最低 100，之后逐股递增', note: '101 股满足北交所股票的数量规则' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '只有主板 300 股有效；301 与 101 都不是 100 的整数倍', diagnosis: '这把主板规则错误外推到科创板和北交所。后两者达到最低申报数量后，可以按 1 股递增。' },
      { id: 'b', label: '三张都可能有效，因为三个板块采用不同的最低门槛与递增规则', diagnosis: '正确：主板 300 是 100 的整数倍；科创板 301≥200；北交所 101≥100，后二者均可逐股递增。' },
      { id: 'c', label: '三张都无效，因为所有股票只能按 1,000 股整手买入', diagnosis: 'A 股并不存在统一的 1,000 股买入门槛。数量单位必须按市场、板块和产品核验。' },
    ],
    calculation: '主板：300/100=3 个交易单位；科创板：301≥200；北交所：101≥100。',
    reveal: '数量规则会改变小额订单能否进入市场、零股如何退出以及不同投资者的最小资金门槛。研究订单规模时若把所有股票统一除以 100，会给科创板和北交所制造人为的“异常零股”。',
  },
];

const interfaceScenarios: Scenario[] = [
  {
    id: 'sellable-inventory',
    label: '接口状态 01 · 可售库存账本',
    title: '昨仓 800 股、今日再买 300 股普通 A 股，当日最多能卖多少？',
    brief: '该股票不属于允许当日回转的产品例外。账户开盘时已有 800 股可售库存，今日现金买入 300 股；忽略融券、冻结和经纪商额外限制。',
    facts: [
      { label: 'Prior eligible', value: '800 shares', note: '交易日前已持有的库存今日可以卖出' },
      { label: 'Same-day buy', value: '+300 shares', note: '普通 A 股今日新买批次不进入当日可售数量' },
      { label: 'Economic action', value: '可卖旧、不能卖新', note: 'T+1 限制的是新增库存的出售选择权，不是冻结整个账户' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '最多卖 800 股；今日新买 300 股留到后续交易日', diagnosis: '正确：当日可售数量来自此前已合格库存。投资者可以卖旧仓完成部分日内调仓，但不能把今日新买批次再卖出。' },
      { id: 'b', label: '最多卖 1,100 股，因为成交后账户总持仓就是 1,100 股', diagnosis: '总持仓不等于当日可售库存。今日买入会增加经济持仓，却不自动增加普通 A 股当日可售数量。' },
      { id: 'c', label: '当日一股也不能卖，因为 T+1 会冻结所有既有持仓', diagnosis: 'T+1 并不冻结昨日已经可售的 800 股。把新增批次约束误写成全账户禁售，会夸大制度强度。' },
    ],
    calculation: 'Sellable_today=prior eligible inventory=800；same-day buy 300 不计入本题当日可售量。',
    reveal: '相同的市场冲击会因库存历史产生不同响应：有旧仓的人仍可卖出，刚买入且没有旧仓的人只能等待，机构还可能通过期货或融券转移风险。投资者异质性因此首先来自可执行集合，而不只是心理差异。',
  },
  {
    id: 'turnaround-products',
    label: '接口状态 02 · 产品回转矩阵',
    title: '普通股票、境内股票 ETF 与债券 ETF 的同日卖出资格为何不能只看“是不是基金”？',
    brief: '账户开盘无债券 ETF，今日买入 600 份合资格债券 ETF；另有境内股票 ETF 昨仓 300 份，今日再买 400 份；普通 A 股昨仓 500 股，今日再买 200 股。忽略冻结与融券。',
    facts: [
      { label: 'Ordinary A share', value: '500 old + 200 new', note: '今日新买批次不能当日卖出' },
      { label: 'Domestic equity ETF', value: '300 old + 400 new', note: '基金名称不自动赋予 T+0；本题不属于回转例外' },
      { label: 'Eligible bond ETF', value: '0 old + 600 new', note: '交易所列明的债券 ETF 可进行当日回转' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '三者都可卖出今日新买数量，因为都在交易所连续交易', diagnosis: '连续交易不等于允许当日回转。普通股票和题设境内股票 ETF 的新买批次仍受出售资格约束。' },
      { id: 'b', label: '所有 ETF 都能 T+0，所以股票 ETF 可卖 700、债券 ETF 可卖 600', diagnosis: '“所有 ETF 都 T+0”是常见错误。境内股票 ETF 通常不因 ETF 名称自动获得同日回转资格。' },
      { id: 'c', label: 'A 股可卖 500、股票 ETF 可卖 300、债券 ETF 可卖 600', diagnosis: '正确：前两者只能卖昨日可售库存；合资格债券 ETF 的今日买入可当日回转。产品资格必须逐只核验。' },
    ],
    calculation: 'A股 sellable=500；境内股票ETF sellable=300；合资格债券ETF sellable=0+600=600。',
    reveal: '产品回转差异会把套利与风险管理送往不同工具。债券、货币、黄金、商品和部分跨境基金可能有回转资格，但具体清单随产品属性而变；教材中的类别矩阵不是替代交易所产品查询的永久名单。',
  },
  {
    id: 'shorting-state',
    label: '接口状态 03 · 融券与转融券',
    title: '“转融券暂停”能否被翻译成“A 股融资融券已经取消”？',
    brief: '按 2026-08-29 的制度快照，中国证券金融公司的转融券业务自 2024-07-11 起暂停；客户融资融券业务、标的名单与券商库存渠道仍按现行规则存在。',
    facts: [
      { label: 'Transfer lending', value: '暂停', note: '暂停的是中国证券金融公司的转融券券源批发渠道' },
      { label: 'Margin business', value: '仍存在', note: '合资格客户、标的、保证金和券源约束继续适用' },
      { label: 'Naked shorting', value: '不允许', note: '融券卖出需要预先取得合规券源并满足价格等规则' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '可以；转融券一停，所有融资买入与融券卖出都自动终止', diagnosis: '转融券、转融资和客户融资融券不是同一层。暂停一个券源批发渠道，不等于取消全部客户融资融券合约。' },
      { id: 'b', label: '不能；客户融资融券仍存在，但融券更依赖有限券源、资格与保证金', diagnosis: '正确：负面观点仍可通过合规融券和衍生品表达，但可扩张券源更受约束。规则改变了通道容量，不足以单独证明价格高估或波动下降。' },
      { id: 'c', label: '转融券暂停只影响融资买入，与可借证券数量完全无关', diagnosis: '转融券的直接对象正是证券借贷券源。把“融”字一概解释为现金融资，会混淆资金与证券两条资产负债表。' },
    ],
    calculation: '可卖空集合=合资格标的∩客户资格∩可借券源∩保证金/价格规则；转融券暂停只收缩其中一条券源扩张通道。',
    reveal: '“A 股不能做空”和“A 股卖空与做多完全对称”都不准确。负面表达存在，但更依赖账户资格、中介券源和保证金；当这些约束收紧，信息可能转向股指期货、期权或卖出其他可售库存。',
  },
  {
    id: 'stock-connect-gates',
    label: '接口状态 04 · 沪深股通闸门',
    title: '北向投资者能否在 15:10 通过沪深股通参加 A 股盘后固定价格交易？',
    brief: '按 HKEX 2026-07-06 操作口径，北向订单窗口在下午 15:00 结束，只接受限价单；沪深本地盘后固定价格撮合为 15:05–15:30。再假设某日连续竞价中北向每日额度不足。',
    facts: [
      { label: 'Northbound window', value: '至 15:00', note: '当前没有北向 15:05–15:30 盘后固定价格交易' },
      { label: 'Order type', value: '限价申报', note: '北向不接受把风险无限交给订单簿的裸市价指令' },
      { label: 'Quota exhausted', value: '限制新增买入', note: '卖出和撤单并不因额度不足被一并封锁' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '不能参加 15:10 盘后；额度不足时新增买入受限，但卖出仍可进行', diagnosis: '正确：本地交易所开放某一时段，不代表跨境接口已经同步开放。额度闸门也主要约束净买入，不把风险退出一并封死。' },
      { id: 'b', label: '可以参加盘后，而且额度一旦不足，买入、卖出和撤单全部停止', diagnosis: '两点都不对：当前北向窗口不覆盖沪深盘后固定价格；额度不足也不禁止卖出和撤单。' },
      { id: 'c', label: '可以在 15:10 使用市价单，只要香港市场仍然开市', diagnosis: '北向只接受限价申报，且交易窗口由互联互通操作安排决定，不由香港市场是否单独开市推导。' },
    ],
    calculation: '15:10>15:00 北向订单截止 → 不可参与盘后；quota gate 作用于新增净买入，不等于 sell gate。',
    reveal: '沪深股通是带时钟、额度、持股与账户资格的接口，不是把香港交易系统无缝延长到内地。2024 年后盘中北向买卖金额和每日单股持仓披露也已改变，因此“看不到实时净流入”不能被误解成“通道没有交易”。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...clockScenarios.map((item, index) => ({ id: item.id, mode: 'clock' as const, index })),
  ...interfaceScenarios.map((item, index) => ({ id: item.id, mode: 'interfaces' as const, index })),
];

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

export default function AShareTradabilityLab() {
  const [mode, setMode] = useState<Mode>('clock');
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
  const scenarios = mode === 'clock' ? clockScenarios : interfaceScenarios;
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
    reset('clock', 0);
  }

  const modeLabel = mode === 'clock' ? '交易时钟与订单资格' : '库存、卖空与跨境接口';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'interfaces' && mode === 'clock'
      ? '进入模式二'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '继续下一道未答题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div><span>TIME · PRICE · INVENTORY · ACCESS · COMPANY STATE</span><h3>先确定此刻可交易的订单、库存与账户—通道可达性，再判断信息会在哪里进入价格</h3></div>
        <p>两种模式各四题。模式一重建集合竞价、退市整理首日与板块数量规则；模式二重建可售库存、产品回转、卖空通道与沪深股通闸门。实验模式与 1.26A / 1.26B 页码无关。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="A股状态依赖可交易性实验模式">
        <button type="button" aria-pressed={mode === 'clock'} onClick={() => selectMode('clock')}><span>模式一</span><b>Clock &amp; Order State</b><small>集合竞价、公司—价格联合状态与申报单位</small></button>
        <button type="button" aria-pressed={mode === 'interfaces'} onClick={() => selectMode('interfaces')}><span>模式二</span><b>Inventory &amp; Interface State</b><small>T+1、产品回转、融券与沪深股通</small></button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const result = scenarioResults[item.id];
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          const status = !submitted ? '未提交' : result ? '已提交，正确' : '已提交，需复习';
          return (
            <button type="button" key={item.id} aria-label={`${number} ${shortLabel}，${status}`} aria-pressed={index === scenarioIndex} aria-current={index === scenarioIndex ? 'step' : undefined} onClick={() => selectScenario(index)}>
              <span aria-hidden="true">{!submitted ? number : result ? '✓' : '!'}</span>{shortLabel}
            </button>
          );
        })}
      </div>

      <p className="impact-lab-progress" role="status" aria-live="polite">总进度：已提交 {submittedScenarioIds.length}/8，当前答对 {correctCount} 题。</p>

      {!completed && (
        <>
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
                <input ref={optionIndex === 0 ? firstOptionRef : undefined} type="radio" name={'a-share-tradability-' + mode + '-' + scenario.id} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>
        </>
      )}

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完整提交</b>
          <p>你已经探索 8/8，当前答对 {correctCount}/8。维度覆盖为：撤单与拍卖检验 T/P，公司—价格题检验 C/P/A，数量与产品题检验 P/I/A，库存题检验 I，融券与股通题检验 A/T。</p>
          <strong>A 股微观结构的核心不是一张规则清单，而是一个状态机：时间、价格、库存、账户—通道可达性和公司状态共同决定谁能提交什么订单、谁能立即退出，以及哪个市场暂时承担价格发现。</strong>
          <div><button type="button" className="impact-primary" onClick={restartLab}>全部重启并回到模式一</button></div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算过程、机制解释与适用边界仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <code>{scenario.calculation}</code>
          <strong>{scenario.reveal}</strong>
          <div><button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button><button type="button" className="impact-primary" onClick={nextScenario}>{nextLabel}</button></div>
        </div>
      )}

      <p className="impact-lab-caveat"><b>规则时点与实验边界：</b>本实验按 2026-08-29 的制度状态编写。沪深 2026 交易规则自 7 月 6 日施行；北交所盘后固定价格仍待另行通知，4.5.1–4.5.4 风险警示与退市整理交易条款将于 8 月 31 日生效；转融券暂停不等于客户融资融券取消；沪深股通当前不覆盖本地盘后固定价格。八题采用冻结参数，只用于机制学习，不构成投资或交易建议。真实交易还受具体证券公告、产品清单、账户权限、经纪商风控、成交概率、费用、税收和系统状态影响。</p>
    </div>
  );
}
