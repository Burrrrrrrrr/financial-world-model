'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'ledger' | 'role';

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
    id: 'ideal-round-trip',
    label: '损益账本 01 · 理想往返',
    title: '在这个刻意简化的世界里，做市商的 gross spread capture 是多少？',
    brief: '同一做市商先在 bid 买入、后在 ask 卖出；数量相同，期间 mid 不变，也没有费用、返佣、融资或对冲成本。',
    facts: [
      { label: 'Bid / Ask', value: '$99.98 / $100.02', note: 'Full quoted spread = $0.04' },
      { label: '成交数量', value: '100 shares', note: '先买 100，后卖 100' },
      { label: 'Mid path', value: '$100.00 → $100.00', note: '库存持有期间价格未变' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '$2，因为每笔只能赚一个 half-spread', diagnosis: '你只记了一侧。这个完整往返包含 bid 买入和 ask 卖出两个 half-spread。' },
      { id: 'b', label: '$8，因为买卖两侧都要再乘一次成交量', diagnosis: 'Full spread 已经是 ask−bid；再把两侧相加会重复计算。' },
      { id: 'c', label: '$4，即 100×($100.02−$99.98)', diagnosis: '正确：在所有理想条件同时成立时，完整往返的 gross capture 等于数量乘 full spread。' },
    ],
    calculation: 'Gross capture = Q(a−b)=100×($100.02−$99.98)=$4。也可写成两次 $2 half-spread capture。',
    reveal: '这不是一般利润公式。只要两侧未成对、mid 移动、成交来自不同做市商或存在成本，quoted spread 就不能直接变成利润。',
  },
  {
    id: 'two-halves-loss',
    label: '损益账本 02 · 两侧成交仍亏损',
    title: '为何两次成交各有正的 entry capture，最终却仍亏损？',
    brief: '做市商先买入 100 股；持有库存时 mid 下跌；随后按新 mid 附近卖出。忽略其他成本。',
    facts: [
      { label: '第一次成交', value: 'Buy 100 @ $99.98', note: '成交前 mid = $100.00' },
      { label: '持有期间', value: 'Mid $100.00 → $99.90', note: '旧库存承担 −$10 mark-to-market' },
      { label: '第二次成交', value: 'Sell 100 @ $99.92', note: '成交前 mid = $99.90' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'Entry capture +$4，inventory holding P&L −$10，总计 −$6', diagnosis: '正确：两笔各捕获 $2，但旧库存随 mid 下跌损失 $10。现金往返也验证最终为 −$6。' },
      { id: 'b', label: '总计 +$4，因为两次都成交在 mid 的有利一侧', diagnosis: '你只累计了成交瞬间相对 mid 的优势，遗漏了两次成交之间库存价值的变化。' },
      { id: 'c', label: '总计 −$10，因为 spread capture 只是账面幻觉', diagnosis: '库存损失是真实的，但两笔有利成交也确实贡献 +$4，不能删掉。' },
    ],
    calculation: 'Entry capture = 100×(100−99.98)+100×(99.92−99.90)=+$4；holding P&L = 100×(99.90−100)=−$10；合计 −$6。现金核对：100×(99.92−99.98)=−$6。',
    reveal: '自融资账本把“成交时赚到的价格改善”与“持有旧库存时承受的价格变化”恰好分开；二者缺一都会误读做市利润。',
  },
  {
    id: 'variable-contribution',
    label: '损益账本 03 · 单笔贡献',
    title: '这组已完成成交对当天 variable contribution（扣变动成本后的贡献）的净贡献是多少？',
    brief: '以下数字都属于同一批成交；暂不计固定系统成本、资本占用和库存后续 markout。',
    facts: [
      { label: 'Gross capture', value: '+$100', note: '相对成交前 mid 的进入优势' },
      { label: 'Maker rebates', value: '+$12', note: '场所给予的流动性返佣' },
      { label: 'Trading fees', value: '−$20', note: '清算、交易等变动费用' },
      { label: 'Hedge cost', value: '−$25', note: '对冲滑点、basis（库存与对冲腿的相对价差）与手续费合计' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '$112，只需把返佣加到 spread capture', diagnosis: '你遗漏了与同一批成交直接相关的费用和对冲成本。' },
      { id: 'b', label: '$67，即 100+12−20−25', diagnosis: '正确：这是扣除给定变动成本后的 contribution，仍不是覆盖固定成本和资本收费后的经济利润。' },
      { id: 'c', label: '$43，因为 hedge cost 应扣两次', diagnosis: '题目给出的 $25 已是该批成交的对冲净成本；再次扣除会重复记账。' },
    ],
    calculation: 'Variable contribution = $100+$12−$20−$25=$67。若日后再扣固定技术、人力、合规与资本成本，才更接近完整经济利润。',
    reveal: '费用、返佣和对冲必须落在唯一账本位置。所谓“spread 很宽”只有在成本、markout 与资本占用之后仍有剩余时才有经济意义。',
  },
  {
    id: 'realized-spread-bridge',
    label: '损益账本 04 · Realized Spread',
    title: '用 maker-side 的单笔 markout bridge，这笔交易在观察期 h 的估计贡献是多少？',
    brief: '使用 full-spread return 口径：RS(h)=ES−PI(h)。该桥只描述一笔孤立成交到指定 horizon 的 markout，不是全公司的损益。',
    facts: [
      { label: 'Trade scale', value: 'Q=1,000；m₀=$100', note: '名义金额 $100,000' },
      { label: 'Effective spread', value: 'ES=4 bp', note: 'Full-spread return convention' },
      { label: 'Price impact', value: 'PI(h)=6 bp', note: '同一符号与同一 horizon' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '+$40，因为成交时 effective spread 为正', diagnosis: '你停在 entry capture，没有把 h 时点的 adverse markout 纳入。' },
      { id: 'b', label: '−$20，因为 4−6=−2 bp 后无需再除以二', diagnosis: 'ES 与 RS 是 full-spread return；映射到单边 maker contribution 时需要除以二。' },
      { id: 'c', label: '−$10，因为 RS=−2 bp，maker bridge 为 Qm₀RS/2', diagnosis: '正确：$100,000×(−0.0002)/2=−$10。' },
    ],
    calculation: 'RS(h)=4−6=−2 bp；Πmaker(h)=Qm₀RS/2=$100,000×(−0.0002)/2=−$10。',
    reveal: '这个 bridge 依赖 spread 定义、交易方向和 horizon；不能再与包含同一 markout 的库存损益相加，否则会重复计算。',
  },
];

const roleScenarios: Scenario[] = [
  {
    id: 'functional-provider',
    label: '角色约束 01 · 功能定义',
    title: '仅凭这些事实，最严谨的角色判断是什么？',
    brief: '研究者只观察到持续行为，没有取得注册类别、指定协议或场所义务资料。',
    facts: [
      { label: '报价行为', value: '长期双边 passive quotes', note: '经常向到来的市价单供给即时性' },
      { label: '资产负债表', value: '成交后持有 inventory', note: '以自身资本承接头寸' },
      { label: '制度资料', value: '未知', note: '没有 registration / designation 文件' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '已经证明它是该场所正式 designated market maker', diagnosis: '持续做市行为不足以证明具有特定法律身份或合同义务。' },
      { id: 'b', label: '可称 functional market maker；是否 designated 仍未知', diagnosis: '正确：功能角色可由行为识别，正式身份必须由当时适用的规则或协议确认。' },
      { id: 'c', label: '它只能算 broker，因为没有看到客户身份', diagnosis: '是否 broker 取决于代理关系；以自身资产负债表承接库存更接近 principal/dealer 功能。' },
    ],
    calculation: '行为证据支持：continuous passive liquidity supply + principal inventory bearing。制度标签需要另查 registration、security assignment、quoting obligation 与 incentive agreement。',
    reveal: '“Market maker”既可能是经济功能，也可能是特定场所的法律或合同身份。教材必须先说明使用哪一种含义。',
  },
  {
    id: 'local-obligation',
    label: '角色约束 02 · 场所义务',
    title: '某场所规则要求指定做市商在特定证券与核心时段维持最低报价存在率。能推出什么？',
    brief: '规则还含最小规模、最大宽度、例外和暂停条款；题目没有说所有时刻、所有证券或无限规模。',
    facts: [
      { label: '适用对象', value: '指定证券', note: '不是全市场通用身份' },
      { label: '适用状态', value: '特定时段与正常条件', note: '存在例外和豁免' },
      { label: '最低标准', value: 'presence / size / width', note: '具体阈值由当地规则决定' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '指定做市商必须始终站在 NBBO（美国全国市场体系最佳买卖报价）且无限量承接', diagnosis: '你把有限、条件性的本地义务扩张成无条件且无限规模的承诺。' },
      { id: 'b', label: '只要有义务，spread capture 就必然覆盖全部成本', diagnosis: '义务不会消除 adverse selection、库存、资金、技术或资本成本。' },
      { id: 'c', label: '义务给出服务下限；不保证成交、盈利或压力时无限供给', diagnosis: '正确：规则约束报价行为，但成交到达、价格路径和风险承受仍决定经济结果。' },
    ],
    calculation: '合规判断必须写成：security × session × state × minimum size × maximum width × presence ratio × exception。缺任何维度都不能外推。',
    reveal: '指定计划通常用义务换取费用、优先权或其他激励；是否值得参与仍要通过完整参与约束，而不是由身份名称决定。',
  },
  {
    id: 'participation-ledger',
    label: '角色约束 03 · 参与约束',
    title: '这家公司在基础业务与指定计划下，分别会留下多少经济剩余？',
    brief: '所有项目已按同一日、同一账本口径给出；风险/资本收费和 outside option（资本用于其他业务的机会价值）都需要从 accounting P&L 继续扣除。',
    facts: [
      { label: 'Accounting P&L', value: '+$1,800', note: '已包含 capture、rebates、markout、hedge、fees、funding 与 operations' },
      { label: 'Risk/capital + outside option', value: '−$1,200 −$900', note: '基础经济参与成本' },
      { label: 'Designated program', value: '+$700 incentive −$200 obligation', note: '计划净增量 +$500' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '基础 −$300；加入计划后 +$200', diagnosis: '正确：1,800−1,200−900=−300；再加 700−200 后为 +200。' },
      { id: 'b', label: '基础 +$1,800；计划 +$2,300', diagnosis: '这是会计损益和简单加激励，遗漏了资本风险收费、机会成本与义务成本。' },
      { id: 'c', label: '基础 −$2,100；计划 −$1,600', diagnosis: '你把成本从零开始相加，却遗漏了 +$1,800 的会计收益。' },
    ],
    calculation: 'Base surplus = 1,800−1,200−900=−$300；Program surplus = −300+700−200=+$200。',
    reveal: '参与约束问的是长期进入或留下是否值得，不是下一档报价应放在哪里。后者需要把库存状态带入动态定价，留到 1.13。',
  },
  {
    id: 'principal-role',
    label: '角色约束 04 · Principal / Agent',
    title: '怎样描述这家机构而不过度推断其制度身份？',
    brief: '观察到机构用自有账户报双边价、成交后持有头寸并用另一工具对冲；未取得注册文件。',
    facts: [
      { label: '交易账户', value: 'Own account', note: '不是把客户指令简单转交市场' },
      { label: '成交后状态', value: 'Inventory + hedge', note: '资产负债表承担残余风险' },
      { label: '正式身份', value: 'Unverified', note: '法律/场所分类未知' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '它必然是 broker，因为使用交易所替客户撮合', diagnosis: 'Broker 的核心是代理客户；题目显示的是自营账户和自身库存。' },
      { id: 'b', label: '它执行 principal/dealer 式 functional market making；designation 未知', diagnosis: '正确：结论与可观察的账户、报价和库存事实同一层级。' },
      { id: 'c', label: '它必然是正式 market maker，因为所有 dealer 都必须被指定', diagnosis: '经济功能、dealer 法律分类与 venue designation 不是同一个集合。' },
    ],
    calculation: '可识别链：own-account quote → principal fill → inventory exposure → hedge / unwind。不可识别项：registration、designation、具体 obligation 与 incentive。',
    reveal: '角色分类的纪律与因果识别相同：只把结论推到证据能够支持的层级，缺失的制度文件必须明确标为未知。',
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

export default function MarketMakerLab() {
  const [mode, setMode] = useState<Mode>('ledger');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'ledger' ? ledgerScenarios : roleScenarios;
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

  const modeLabel = mode === 'ledger' ? '损益账本' : '角色与参与约束';

  return (
    <div className="market-maker-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>MARKET MAKER · LEDGER → PARTICIPATION</span>
          <h3>先把 spread capture、库存损益与成本逐项对账，再判断谁真正承担做市角色</h3>
        </div>
        <p>两种模式各四题。提交前只显示原始事实；计算、误区诊断和制度边界在作答后揭示。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="做市商实验模式">
        <button type="button" aria-pressed={mode === 'ledger'} onClick={() => selectMode('ledger')}>
          <span>MODE A</span><b>P&amp;L 账本</b><small>Capture、markout、成本与 realized spread</small>
        </button>
        <button type="button" aria-pressed={mode === 'role'} onClick={() => selectMode('role')}>
          <span>MODE B</span><b>角色与参与约束</b><small>功能、指定身份、义务与经济剩余</small>
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
              name={`market-maker-${mode}-${scenario.id}`}
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
          <p className="impact-locked">先选择答案。计算过程、误区诊断与适用边界仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>这些题训练自融资账本与角色识别，不构成特定做市策略、场所合规或盈利承诺。真实结果还取决于成交排序、库存路径、对冲、费用、融资、资本、技术和当地规则。</p>
    </div>
  );
}
