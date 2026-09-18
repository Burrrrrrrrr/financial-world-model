'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'clearing' | 'identification';

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

const clearingScenarios: Scenario[] = [
  {
    id: 'curve-clear',
    label: '清算基础 01 · Curve & clear',
    title: '逐价累积后，哪一档使 paired volume 最大？',
    brief: '教学协议允许竞价市价单与限价单参加；市价量在每个候选价都进入相应一侧。定义 B(p) 为可在 p 买入的累计量，S(p) 为可在 p 卖出的累计量，V(p)=min[B,S]，I(p)=B−S；数量单位均为股。',
    facts: [
      { label: 'Buy ledger', value: 'Market 40; 101×30; 100×50; 99×20', note: '买入限价不低于候选价才进入 B(p)' },
      { label: 'Sell ledger', value: 'Market 20; 99×25; 100×45; 101×50', note: '卖出限价不高于候选价才进入 S(p)' },
      { label: 'Candidate set', value: '99 / 100 / 101', note: '先比较 paired volume，再看后续规则' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'p=99；V=45；I=+95', diagnosis: '99 元的计算本身成立，但它只配对 45 股；你在完成全部候选价比较之前就停下了。' },
      { id: 'b', label: 'p=100；V=90；I=+30', diagnosis: '正确：100 元累计买量 120、累计卖量 90，配对 90 股，高于另外两档。' },
      { id: 'c', label: 'p=101；V=140；I=−70', diagnosis: '140 是卖方累计量，不是成交量；两侧较小的买量只有 70，因此 V=70。' },
    ],
    calculation: 'p=99: (B,S,V,I)=(140,45,45,+95)；p=100: (120,90,90,+30)；p=101: (70,140,70,−70)。所以 p*=100，Q*=90。',
    reveal: 'paired volume 只计实际配对的一侧数量，90 股成交不能把买卖双方相加成 180。买方失衡 +30 也不表示清算后价格必然继续上涨；它只是这张冻结账本在 100 元上的剩余方向。',
  },
  {
    id: 'tie-break',
    label: '清算基础 02 · Tie-break protocol',
    title: '两个候选价既同量又同失衡，参考价怎样进入最后一层？',
    brief: '本题使用明确标注的教学协议 A：先最大化 V，再最小化 |I|，仍并列时选择最接近参考价的候选价。它不是任何交易所的通用规则。参考价为 100.60。',
    facts: [
      { label: 'p=99', value: 'B=130; S=80', note: 'V=80，I=+50' },
      { label: 'p=100', value: 'B=105; S=95', note: 'V=95，I=+10' },
      { label: 'p=101', value: 'B=95; S=105', note: 'V=95，I=−10' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '99，因为正失衡最大', diagnosis: '协议第一层最大化 paired volume，不是最大化买方剩余；99 只有 80 股可配对。' },
      { id: 'b', label: '100，因为它是三个候选的中间数', diagnosis: '100 与 101 在前两层仍并列，协议没有“自动取中间数”；必须应用已声明的参考价距离。' },
      { id: 'c', label: '101，因为距参考价 0.40，小于 100 的 0.60', diagnosis: '正确：100 与 101 都配对 95、绝对失衡都为 10，第三层才由参考价 100.60 选择 101。' },
    ],
    calculation: '第一层淘汰 p=99；第二层 100 与 101 的 |I| 都为 10；第三层 |101−100.60|=0.40 < |100−100.60|=0.60，故 p*=101。',
    reveal: '目标顺序本身就是价格形成机制。真实研究必须冻结 venue、产品、日期和规则版本；上交所、深交所、Nasdaq 与 Euronext 的次级条件并不相同。',
  },
  {
    id: 'at-price-allocation',
    label: '清算基础 03 · At-price allocation',
    title: '清算价和总量已知后，同价两张订单各成交多少？',
    brief: '已知 p*=100、Q*=90。买方竞价市价及更优价订单先占 70 股，因此清算价上只剩 20 股买方执行额度；同价两张买单数量分别为 30 与 20。本题明确使用 pro rata，并忽略整手与舍入。',
    facts: [
      { label: 'Total match', value: 'Q*=90', note: '全体订单的单边成交量' },
      { label: 'Better-priced buy', value: '70 filled first', note: '同价剩余额度 R=90−70=20' },
      { label: 'At-price buys', value: 'Order A=30; Order B=20', note: '同价总量 50，按比例分配 20' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: 'A=12，B=8', diagnosis: '正确：两单按 30:20 分配 20 股额度，成交率都为 40%。' },
      { id: 'b', label: 'A=18，B=12', diagnosis: '你把同价可分额度误算成 30；Q*=90 中已有 70 股被更优订单占用，只剩 20。' },
      { id: 'c', label: 'A=20，B=0', diagnosis: '这相当于擅自改成时间优先；题目已经明确使用 pro rata，抵达先后在本题不决定分配。' },
    ],
    calculation: 'R=90−70=20；A=20×30/(30+20)=12；B=20×20/(30+20)=8；12+8=20，数量守恒。',
    reveal: 'price determination 与 allocation 是两道题。同一 p*、Q* 在 time priority、pro rata、parity 或其他优先协议下，可以给个人完全不同的 fill。',
  },
  {
    id: 'indicative-update',
    label: '清算基础 04 · Recompute the state',
    title: '没有任何成交，只撤掉一张卖单，indicative state 会怎样变化？',
    brief: '初始三个候选价的 (B,S) 分别是 99:(120,70)、100:(100,90)、101:(70,110)，按“最大 V→最小 |I|”选指示价。随后撤销一张限价 100 的卖单 20 股；它会使 p≥100 的累计卖量减少 20。',
    facts: [
      { label: 'Before cancel', value: 'p=100; V=90; I=+10', note: '初始唯一最大配对量' },
      { label: 'Cancel event', value: 'Sell 20 @100 removed', note: 'S(100) 与 S(101) 各减 20' },
      { label: 'After event', value: 'Recompute all candidates', note: '不能只给旧答案减 20' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '仍为 100 / paired 90 / imbalance +10', diagnosis: '你没有把撤单写回累计卖量；indicative state 是当前账本的函数，不是上一条消息的固定标签。' },
      { id: 'b', label: '变为 101 / paired 70 / imbalance −20', diagnosis: '正确：三档新 paired volume 都为 70，再由绝对失衡 50、30、20 选择 101。' },
      { id: 'c', label: '变为 99 / paired 70 / imbalance +50', diagnosis: '“卖单减少所以价格下降”不是计算规则；三档同量后还需比较绝对失衡。' },
    ],
    calculation: '撤单后：99=(120,70,V70,I+50)；100=(100,70,V70,I+30)；101=(70,90,V70,I−20)。故 indicative price=101，paired=70，imbalance=−20。',
    reveal: '预开盘价格可以在零成交时跳变，因为 add、cancel 与 amend 重画了累计曲线。它既传递订单信息，也会诱发其他主体响应，所以整条指示路径是内生互动，不是外生新闻序列。',
  },
];

const identificationScenarios: Scenario[] = [
  {
    id: 'auction-instruction',
    label: '识别基础 01 · Choose the instruction',
    title: '只参加收盘撮合、又必须保留最高买价，应选哪种语义？',
    brief: '15:40，投资者希望买入 500 股，只愿在 closing auction 成交，最高可接受 50.10；不希望订单在连续盘提前执行。本题只考 MOO/LOO/MOC/LOC 的二维语义，不代表任一场所的截止时间。',
    facts: [
      { label: 'Destination', value: 'Closing auction only', note: '不是 opening，也不是提前连续成交' },
      { label: 'Side & size', value: 'Buy 500', note: '买方订单' },
      { label: 'Price protection', value: 'Maximum 50.10', note: '需要显式上限' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: 'MOC buy 500', diagnosis: 'MOC 指定收盘执行语义，却没有 50.10 的显式价格保护；它不满足题目第二个约束。' },
      { id: 'b', label: 'LOO buy 500 @50.10', diagnosis: 'LOO 有价格边界，但 destination 是 opening auction；你选错了交易阶段。' },
      { id: 'c', label: 'LOC buy 500 @50.10', diagnosis: '正确：closing destination 与 limit protection 两个维度同时满足。' },
      { id: 'd', label: '普通 DAY limit buy 500 @50.10', diagnosis: '普通日限价单可能在收盘前连续市场达到条件时执行，不满足“只参加 closing auction”。' },
    ],
    calculation: '时间维度：Close → MOC/LOC；价格维度：需要显式上限 → LOC。因此选择 Limit-on-Close，而不是 Market-on-Close。',
    reveal: '名称只表达核心语义，不自动决定撤单窗、迟到订单重定价、优先权和未成交后的命运。把 LOC 带到真实市场前，仍须查该 venue、产品与日期的原生协议。',
  },
  {
    id: 'rule-boundaries',
    label: '识别基础 02 · Freeze, random end & collar',
    title: '冻结、随机结束和价格保护同时存在时，哪些结论仍然成立？',
    brief: '题内协议规定：15:55 后既有订单不得撤改；仍可提交合格的失衡抵消单；uncross 随机发生在 15:59:30–16:00；最终允许价格区间为 [99,101]。15:57 一张 LOC sell 100.50×200 的持有人想撤，此刻 unconstrained indicative price=102。',
    facts: [
      { label: 'Cancellation state', value: 'Freeze began 15:55', note: '15:57 的撤单请求不合格' },
      { label: 'End time', value: 'Unknown inside 30-second window', note: '不能精确卡住最后一毫秒' },
      { label: 'Price state', value: 'Indicative 102; collar [99,101]', note: '原始指示价超出允许区间' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '立即撤单，并确定在 16:00 以 102 成交', diagnosis: '这同时忽略 freeze、random end 与 collar：撤单无效、结束时刻未知、102 也不在允许范围内。' },
      { id: 'b', label: '不能撤；102 不能直接成为最终价；是否成交仍未知', diagnosis: '正确：三条规则分别约束选择权、时间与价格，但都没有单独创造对手量或保证这张订单成交。' },
      { id: 'c', label: '订单自动变成连续市价单并在 101 成交', diagnosis: '题内协议没有这种 residual routing；collar 也不等于把所有订单自动夹到边界成交。' },
    ],
    calculation: '15:57 > 15:55，撤改权已失效；102 > 101，原始 indicative price 越过上界 1；uncross 只知落在 30 秒窗口内，具体结果仍依赖后续合格订单和 fallback rule。',
    reveal: 'freeze、randomization 与 collar 分别处理承诺、最后时点策略和极端价格，但会带来错误难修正、等待不确定和延迟清算等代价。真实场所对超界结果可能限价、延长、暂停或取消，不能把一种 fallback 写成通则。',
  },
  {
    id: 'discovery-pressure',
    label: '识别基础 03 · Persistence path',
    title: '竞价价格变化在后续可交易价格中大体保留，最弱可支持什么？',
    brief: '竞价前可比 mid=100，auction price=101；随后无已知新公告，30 分钟、次日开盘和次日午间的可比 mid 分别为 100.95、100.98、101.03。忽略本题外的 bid–ask bounce。',
    facts: [
      { label: 'Auction innovation', value: '+1.00', note: '101−100' },
      { label: '30-minute mid', value: '100.95', note: '保留率 95%' },
      { label: 'Next open / midday', value: '100.98 / 101.03', note: '价格差没有快速消失' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '与较持久的价格发现相容，但不能证明信息因果', diagnosis: '正确：多个期限都大体保留竞价创新，弱化纯短暂压力解释；遗漏新闻和共同市场变化仍可能造成同一路径。' },
      { id: 'b', label: '已经证明竞价中必有知情交易者', diagnosis: '价格持续是结果路径，不直接识别交易者身份；公共信息、跨市场先行和共同因子也能使变化持续。' },
      { id: 'c', label: '高 auction price 必然是被动资金压力', diagnosis: '题目没有给被动持仓、指数事件或订单身份；而且快速逆转这一压力证据也并不存在。' },
    ],
    calculation: '保留率 Rₕ=[ln(midₕ)−ln(100)]/[ln(101)−ln(100)]：30分钟≈0.95，次日开盘≈0.98，次日午间≈1.03。ln 是自然对数；路径接近1，而非接近0。',
    reveal: 'persistence/reversal 是描述性诊断，不是主体标签。需要对照新闻、市场收益、跨 venue 价格、订单身份与正常 auction 路径，才能把“相容”推进到更强识别。',
  },
  {
    id: 'rebalance-design',
    label: '识别基础 04 · Rebalance counterfactual',
    title: '指数换仓日收盘上涨后大幅逆转，应怎样把它变成研究而不是故事？',
    brief: '相对匹配对照组，纳入组在实施日前的趋势差约 0.01%；实施日 closing-auction 对数异常收益为 +0.80%，次日首 30 分钟的对数异常收益为 −0.65%；paired volume 增加相当于 ADV 的 7%。对数异常收益是处理组对数收益减对照组对数收益，相邻时段可以相加；ADV 指日均成交量。',
    facts: [
      { label: 'Pretrend', value: '+0.01%', note: '处理前路径接近，但不等于随机化' },
      { label: 'Close → next 30m', value: '+0.80% then −0.65%', note: '两段均为 log abnormal return，净保留 +0.15%' },
      { label: 'Auction liquidity', value: '+7% ADV paired', note: '大量需求在统一价格聚合' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '证明收盘价永久发现了 0.80% 新价值', diagnosis: '次日很快逆转 0.65%，绝大部分变化没有保留；永久发现不是最弱解释。' },
      { id: 'b', label: '证明被动基金操纵了收盘价', diagnosis: '规则性跟踪需求、暂时价格压力与欺骗性操纵是不同判断；这组聚合数据没有法律或意图证据。' },
      { id: 'c', label: '与显著暂时压力相容，并需指数分配规则与对照设计识别', diagnosis: '正确：约 81.25% 的事件日上涨在次日前 30 分钟逆转；应利用可预定的纳入规则、匹配对照、预趋势和多期限保留率。' },
    ],
    calculation: '因为两段均为可相加的对数异常收益，逆转比例=0.65/0.80=81.25%；净保留=(0.80−0.65)/0.80=18.75%。7% ADV 的 paired 增量说明流动性聚合，却不单独识别谁提供、谁承受或福利是否改善。',
    reveal: '最小研究还要检查指数公告到实施之间的提前交易、同期公司新闻、市场共同收益、阈值附近的可比证券、auction imbalance 与连续盘替代交易。高成交、低冲击和更好价格发现可以同时或分别出现。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...clearingScenarios.map((item, index) => ({ id: item.id, mode: 'clearing' as const, index })),
  ...identificationScenarios.map((item, index) => ({ id: item.id, mode: 'identification' as const, index })),
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

export default function OpeningClosingAuctionLab() {
  const [mode, setMode] = useState<Mode>('clearing');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submittedScenarioIds, setSubmittedScenarioIds] = useState<string[]>([]);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'clearing' ? clearingScenarios : identificationScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;
  const nextUnsubmitted = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));

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
    reset('clearing', 0);
  }

  const modeLabel = mode === 'clearing' ? '清算与分配' : '解释与识别';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'identification' && mode === 'clearing'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>CURVES · CLEARING · ALLOCATION · IDENTIFICATION</span>
          <h3>从订单账本生成统一清算结果，再判断规则、指示路径与价格机制</h3>
        </div>
        <p>两种模式各四题。Mode A 必须手算，Mode B 必须写清场所规则、主体约束和仍未排除的竞争机制。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="开收盘集合竞价实验模式">
        <button type="button" aria-pressed={mode === 'clearing'} onClick={() => selectMode('clearing')}>
          <span>MODE A</span><b>Clear &amp; Allocate</b><small>累计曲线、并列规则、个人 fill 与动态重算</small>
        </button>
        <button type="button" aria-pressed={mode === 'identification'} onClick={() => selectMode('identification')}>
          <span>MODE B</span><b>Interpret &amp; Identify</b><small>订单语义、规则边界、持续性与换仓反事实</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          return (
            <button
              type="button"
              key={item.id}
              aria-label={`${number} ${shortLabel}，${submitted ? '已提交' : '未提交'}`}
              aria-pressed={index === scenarioIndex}
              onClick={() => selectScenario(index)}
            >
              <span aria-hidden="true">{submitted ? '✓' : number}</span>{shortLabel}
            </button>
          );
        })}
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
              name={'opening-closing-auction-' + mode + '-' + scenario.id}
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
          <p>你已经完成全部八题：从累计买卖曲线、paired volume 与 imbalance 推导价格，再把 allocation、动态指示状态、订单语义、规则边界和后续价格路径分开判断。</p>
          <strong>完成不等于掌握一套全球通用算法；可靠答案必须同时声明 venue、产品、规则生效日期、订单资格、tie-break、分配、撤改窗口、价格保护与残余订单去向。</strong>
          <div>
            <button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button>
          </div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算、规则口径与识别边界仍被锁定。</p>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>除特别说明的术语外，本实验使用的是教学协议与教学参数，不代表任一交易所的完整规则，也不是交易建议。真实复现必须读取目标场所当日生效的原生规则和消息规范，并处理时区、半日市、停牌、价格带、订单修订、隐藏量、跨 venue 交易及交易纠错。</p>
    </div>
  );
}
