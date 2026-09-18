'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'clock' | 'identification';

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
    id: 'same-cell-baseline',
    label: '时钟基础 01 · Same-cell baseline',
    title: '开盘 spread 更宽，但哪个五分钟格相对自己的常态更异常？',
    brief: 'Quoted spread 记为 S，单位 bp（basis point，基点；1 bp=0.01%）。题内基准只用此前交易日、同一制度与 phase 的同格数据估计；所有数字均为教学参数。',
    facts: [
      { label: '09:35', value: 'S=18 / baseline 20 bp', note: '绝对水平较宽，但比开盘常态窄 2 bp' },
      { label: '12:30', value: 'S=9 / baseline 6 bp', note: '绝对水平较窄，却比午间常态宽 3 bp' },
      { label: 'Comparison', value: 'S / E[S | clock] − 1', note: '先相对同格常态标准化，再比较方向和幅度' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '09:35 更异常，因为 18 bp 大于 9 bp', diagnosis: '你比较了原始水平，却没有问每个时点本来应当多宽；开盘 18 bp 其实低于自己的条件基准。' },
      { id: 'b', label: '12:30 更异常，因为它相对同格基准宽 50%', diagnosis: '正确：09:35 相对基准为 −10%，12:30 为 +50%；午间虽然绝对更窄，却是更强的“异常变宽”。' },
      { id: 'c', label: '两格都正常，因为 spread 都低于 20 bp', diagnosis: '20 bp 只属于开盘基准，不能跨时间格复用；午间必须和自己的 6 bp 常态比较。' },
    ],
    calculation: '09:35：18/20−1=−10%；12:30：9/6−1=+50%。原始 spread 排名与“相对常态是否异常变宽”的排名相反。',
    reveal: '同格标准化只回答“相对该时点与 phase 是否异常”，不解释异常为何发生。还需结合公告、OFI、depth、quote age 与制度版本判断是逆向选择、库存保护还是陈旧报价。',
  },
  {
    id: 'common-clock-confound',
    label: '时钟基础 02 · Common seasonality',
    title: '原始成交量 Q 与 realized variance 几乎完全同涨同跌，能否推出 Q 导致 RV？',
    brief: '三个时间格的实际值恰好等于各自事前季节基准。RV 以教学用 bp² 表示；这些数字只用来展示共同日内时钟如何制造相关。',
    facts: [
      { label: 'Open', value: 'Q=900, RV=9 bp²', note: '同格基准也是 900 与 9' },
      { label: 'Midday', value: 'Q=300, RV=3 bp²', note: '同格基准也是 300 与 3' },
      { label: 'Close', value: 'Q=800, RV=8 bp²', note: '同格基准也是 800 与 8' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '可以；原始相关接近 1，所以 Q 导致 RV', diagnosis: '共同的开盘—午间—收盘形状已经足以产生接近 1 的相关；同期相关不识别方向。' },
      { id: 'b', label: '不能；共同季节性可完全解释这组原始共变', diagnosis: '正确：每格相对自身基准的 Q surprise 与 RV surprise 都为零，原始相关没有提供格内异常共同运动的证据。' },
      { id: 'c', label: '可以反向推出 RV 导致 Q', diagnosis: '同样不成立。时钟是两者的共同状态变量，数据没有提供外生变化来区分任一方向。' },
    ],
    calculation: '原始三点满足 Q=100×RV，故 corr(Q,RV)=1；但 Q/E[Q|clock]−1=0，RV/E[RV|clock]−1=0，每格的季节调整残差均为零。',
    reveal: '去季节性不是自动的因果识别：残差仍可能共同响应新闻、深度、风险约束或测量误差。它只是先移除一条已知的共同混淆路径。',
  },
  {
    id: 'auction-point-mass',
    label: '时钟基础 03 · Auction point mass',
    title: '16:00 收盘集合竞价成交 120 万股，应如何放入五分钟日内曲线？',
    brief: '连续交易的 15:55–16:00 成交 30 万股，并有逐时点报价；16:00 的 120 万股在一次统一撮合价上完成。所有数值均为教学参数。',
    facts: [
      { label: 'Continuous', value: '0.30m shares', note: '15:55–16:00 连续撮合，可定义期间报价与深度' },
      { label: 'Closing auction', value: '1.20m shares', note: '16:00 单一 cross，是一个点质量' },
      { label: 'Combined', value: '1.50m shares', note: '若合并，80% 来自不同撮合阶段' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '平均摊入最后五分钟的每一分钟', diagnosis: '这会捏造实际不存在的连续成交路径，并错误赋予 auction 分钟级等待时间。' },
      { id: 'b', label: '全部并入 15:55–16:00，直接与午间连续格比较', diagnosis: '总量可以用于日终账本，但这样比较会把两种撮合机制混成一个时间格，价差和深度也未必同义。' },
      { id: 'c', label: '把连续格与 closing-auction phase 分开报告', diagnosis: '正确：保留 30 万股连续流量和 120 万股 auction 点质量，再按研究问题决定是否汇总日成交。' },
    ],
    calculation: 'auction share=1.20/1.50=80%。若把 1.20m 平均摊成五份，会虚构每分钟 0.24m 的成交；真实数据只有 16:00 的统一撮合。',
    reveal: '集合竞价的指令不平衡、指示价格、统一清算价和连续市场 BBO 属于不同对象。1.16 负责分相位；集合竞价是否改善价格发现与执行质量的机制判断应进入 1.17。',
  },
  {
    id: 'lunch-second-open',
    label: '时钟基础 04 · Second opening',
    title: '有午休的市场在 12:30 出现 RV 峰值，它一定是异常新闻冲击吗？',
    brief: '市场 A 于 11:30–12:30 停市，12:30 重新连续交易；市场 B 没有午休。题内 RV 与基准均为教学参数。',
    facts: [
      { label: 'Market A', value: 'RV=12; second-open baseline=11', note: '若误用普通盘中基准 3，会看成四倍峰值' },
      { label: 'Market B', value: 'RV=3; 12:30 baseline=3', note: '12:30 只是普通连续交易格' },
      { label: 'Session state', value: 'A=reopen; B=interior', note: '相同钟点对应不同交易阶段' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '不一定；A 应先与自己的第二开盘基准比较', diagnosis: '正确：A 的 12 只比 second-open 基准 11 高约 9.1%，原始峰值主要可能来自停市后的重新价格发现。' },
      { id: 'b', label: '一定；12 明显大于普通盘中基准 3', diagnosis: '你把第二开盘当成普通盘中格，忽略了午间信息积累与重新撮合这一制度状态。' },
      { id: 'c', label: '应把 A 的午休收益按 60 分钟平均，再与五分钟 RV 比较', diagnosis: '停市期间没有连续可交易路径；机械除以分钟数会伪造可观测的五分钟收益过程。' },
    ],
    calculation: '正确季节 surprise：12/11−1≈9.1%；误用盘中基准则为 12/3−1=300%。同一个观测会因 phase 定义不同得到完全不同的异常标签。',
    reveal: '跨市场对齐应同时保留本地钟点与 session phase。午休长度改革可检验信息积累机制，但必须控制同时变化的交易时长、邻近市场重叠和制度趋势。',
  },
];

const identificationScenarios: Scenario[] = [
  {
    id: 'announcement-clock',
    label: '识别基础 01 · Announcement clock',
    title: '08:30 的平均波动峰值应全部写进平滑日内季节曲线吗？',
    brief: '教学样本有 100 个可比日期：20 个预定公告日的 08:30 RV 为 25，80 个非公告日为 5。公告日历事前已知，但 surprise 只能在公布时观察。',
    facts: [
      { label: 'Release days', value: '20 days × RV 25', note: '固定 08:30 发布，但实际 surprise 尚未提前知道' },
      { label: 'No-release days', value: '80 days × RV 5', note: '同一钟点没有该公告' },
      { label: 'Pooled clock mean', value: 'RV=9', note: '忽略事件状态后的机械平均' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '是；08:30 的季节基准就是 9', diagnosis: '合并平均会在 80 个非公告日系统性高估，并在公告日大幅低估，把事件时钟误写成普通时钟。' },
      { id: 'b', label: '否；同时建模本地时钟与公告事件时钟', diagnosis: '正确：公告日历、公布时点和可得后的 surprise 应与平滑季节项分开，且要和同钟点非公告日比较。' },
      { id: 'c', label: '否；应删除所有公告日再研究市场', diagnosis: '删除可以做稳健性检验，但会丢掉真实、可预测的制度状态，也无法解释公告日的执行风险。' },
    ],
    calculation: '合并均值=(20×25+80×5)/100=9。它对非公告日高估 (9/5−1)=80%，对公告日低估 (1−9/25)=64%。',
    reveal: '公告时钟与交易时钟重合会造成识别混淆。日历是否有公告可事前使用，实际值、surprise 与修订值必须遵守真实发布时间，不能提前进入特征。',
  },
  {
    id: 'dst-overlap-clock',
    label: '识别基础 02 · DST overlap',
    title: '纽约开市峰值在 UTC 上突然提前一小时，最先应检查什么？',
    brief: '教学情境位于美国已进入夏令时、英国尚未进入的一周；纽约本地开市始终为 09:30。数字用于展示时区映射，不是经验效应估计。',
    facts: [
      { label: 'Before US DST', value: '09:30 NY = 14:30 UTC', note: '伦敦本地也为 14:30' },
      { label: 'Mismatch week', value: '09:30 NY = 13:30 UTC', note: '英国仍为 GMT，伦敦本地也是 13:30' },
      { label: 'Observed peak', value: '14:30 → 13:30 UTC', note: '随纽约开市和跨市场重叠一起移动' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '宣布市场结构发生了永久断点', diagnosis: 'UTC 峰值移动可能完全由时区制度造成；永久断点需要在本地时钟和 DST 控制后仍然存在。' },
      { id: 'b', label: '固定使用 14:30 UTC，便于所有年份比较', diagnosis: '这会把 13:30 的真实纽约开市错标成普通时段，并把错位误学为季节漂移。' },
      { id: 'c', label: '核对 IANA 时区、DST 状态与伦敦—纽约重叠', diagnosis: '正确：同时保留 UTC、本地交易所时间和 overlap state，才能区分本地开市效应与参与者重叠效应。' },
    ],
    calculation: '纽约本地开市变化为 0 分钟，UTC 映射变化为 −60 分钟；英国尚未切换时，伦敦本地的纽约开市也由 14:30 提前到 13:30。',
    reveal: 'DST 错位周可以成为准实验，但公告、假日和季末流量仍需控制。若峰值固定跟随 UTC 而不跟随本地开市或重叠，参与者重叠解释会受到反驳。',
  },
  {
    id: 'same-day-denominator-leak',
    label: '识别基础 03 · Denominator leakage',
    title: '10:00 的累计成交量能否除以当天 16:00 才知道的最终成交量？',
    brief: '两天截至 10:00 都成交 20 万股；A 日最终成交 200 万股，B 日因 14:00 突发新闻最终成交 400 万股。过去数据预测的当日总量在两天均为 160 万股。所有数字均为教学参数。',
    facts: [
      { label: 'Information at 10:00', value: 'A=B=0.20m shares', note: '两个实时信息集在该变量上完全相同' },
      { label: 'Final daily Q', value: 'A=2.0m; B=4.0m', note: 'B 的差异由 14:00 后才发生的新闻造成' },
      { label: 'Past-only forecast', value: 'E₉:₅₉[Qday]=1.6m', note: '只用 10:00 前可得信息估计' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '实时模型不能用最终分母；应使用过去数据给出的尺度', diagnosis: '正确：最终总量让 14:00 的未来新闻反向改变 10:00 的特征。用过去估计的 160 万分母时，两天都为 12.5%。' },
      { id: 'b', label: '可以；最终成交量只是普通归一化，不是标签', diagnosis: '是否泄漏取决于当时能否取得，而不取决于字段名称。16:00 才完成的分母包含 10:00 后的信息。' },
      { id: 'c', label: '可以；A、B 都使用同一个公式，所以比较公平', diagnosis: '公式相同不代表信息集相同。B 的 5% 已经编码了未来突发新闻造成的额外成交。' },
    ],
    calculation: '事后份额：A=0.2/2.0=10%，B=0.2/4.0=5%；过去尺度：A=B=0.2/1.6=12.5%。前者让相同的 10:00 观测因未来路径而不同。',
    reveal: '当天最终占比可用于事后描述整日成交分布，但不能作为实时特征。季节曲线、缩放参数、极端值截尾（winsorization：把超出预设阈值的值压到阈值）与函数基底也都必须只在训练窗口拟合。',
  },
  {
    id: 'calendar-event-clock',
    label: '识别基础 04 · Calendar vs event clock',
    title: '两个窗口都包含 100 笔成交：event time 是否意味着它们处于同一市场状态？',
    brief: '开盘的 100 笔在 1 分钟内完成，午间的 100 笔历时 20 分钟。题内只比较成交强度和等待时间，不把数字解释为真实市场参数。',
    facts: [
      { label: 'Opening window', value: '100 trades / 1 min', note: 'calendar-time 强度为每分钟 100 笔' },
      { label: 'Midday window', value: '100 trades / 20 min', note: 'calendar-time 强度为每分钟 5 笔' },
      { label: 'Event-time sample', value: '100 trades each', note: '按笔数取样后长度看似完全相同' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '是；相同交易笔数已经消除了所有时钟差异', diagnosis: '按笔数取样会条件于活动发生，恰好抹去两窗最重要的等待时间差异。' },
      { id: 'b', label: '否；应并列报告 event time、calendar time 与 duration', diagnosis: '正确：event time 比较每笔信息，calendar time 保留真实等待与预测时距，duration 本身也是状态变量。' },
      { id: 'c', label: '否；只保留 calendar time，event time 没有研究价值', diagnosis: 'calendar time 不能替代每笔价格冲击和订单流持久性的比较；两种时钟回答不同问题。' },
    ],
    calculation: '成交强度：开盘 100/1=100 笔/分钟，午间 100/20=5 笔/分钟，前者为后者 20 倍；event-time 长度却都恰为 100 笔。',
    reveal: 'volume time 会按构造压平成交量季节性，因此不能据此声称季节性消失。零成交窗、等待时间、午休与 auction 必须在 calendar/session clock 中保留。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...clockScenarios.map((item, index) => ({ id: item.id, mode: 'clock' as const, index })),
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

export default function IntradaySeasonalityLab() {
  const [mode, setMode] = useState<Mode>('clock');
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
  const scenarios = mode === 'clock' ? clockScenarios : identificationScenarios;
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
    reset('clock', 0);
  }

  const modeLabel = mode === 'clock' ? '时钟与测量' : '识别与预测';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'identification' && mode === 'clock'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '下一题';

  return (
    <div className="intraday-seasonality-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>CLOCK · SESSION · EVENT · NORMALIZATION</span>
          <h3>把日内周期当作可建模状态：先辨认交易时钟，再判断异常、机制与可用信息</h3>
        </div>
        <p>两种模式各四题。每题先锁定本地钟点、交易阶段与当时信息集，再揭示计算和识别边界。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="日内季节性实验模式">
        <button type="button" aria-pressed={mode === 'clock'} onClick={() => selectMode('clock')}>
          <span>MODE A</span><b>Clock &amp; Normalize</b><small>同格基准、共同季节性、auction 与第二开盘</small>
        </button>
        <button type="button" aria-pressed={mode === 'identification'} onClick={() => selectMode('identification')}>
          <span>MODE B</span><b>Identify &amp; Forecast</b><small>公告、DST、信息泄漏与双时钟协议</small>
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
              name={'intraday-seasonality-' + mode + '-' + scenario.id}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完整提交</b>
          <p>你已经提交全部八题：先把原始水平放回同格与同阶段基准，再拆开 auction、午休重开、公告、DST、可得信息和不同取样时钟。</p>
          <strong>完成不等于发现了一条普遍 U 型定律；可靠结论必须说明变量口径、session phase、制度版本、信息可得时点和仍未排除的竞争机制。</strong>
          <div>
            <button type="button" className="impact-primary" onClick={restartLab}>从 Mode A 重新开始</button>
          </div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算、测量口径与识别边界仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>本实验的成交量、RV、时点、基准和比例全部是为推理而设的教学参数，不是经验校准或交易信号。真实研究还需处理交易所本地时区、假日与半日市、制度变更、零成交窗、公告修订、微观结构噪声和严格的过去信息集。</p>
    </div>
  );
}
