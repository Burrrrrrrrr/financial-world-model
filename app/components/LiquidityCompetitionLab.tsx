'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'competition' | 'speed-stress';

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

const competitionScenarios: Scenario[] = [
  {
    id: 'quote-economics',
    label: '竞争基础 01 · Conditional margin',
    title: '这张 ask 被成交后，每股的条件期望净边际是多少？',
    brief: '参考 mid 为 $100；ask=$100.04。作答时只计算“已成交条件下”的每股经济性，不乘 fill probability，也不分摊固定技术成本。',
    facts: [
      { label: 'Gross distance', value: '$0.040', note: 'Ask 相对当前 mid 的距离，等于 4.0 bp' },
      { label: 'Expected markout', value: '$0.025', note: '成交后同方向 fair-value 移动，等于 2.5 bp' },
      { label: 'Other variable cost', value: '$0.009', note: '费用 $0.005＋库存/对冲成本 $0.004' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '+$0.006 / 股', diagnosis: '正确：先扣成交后 markout，再扣费用与库存/对冲成本。' },
      { id: 'b', label: '+$0.031 / 股', diagnosis: '你已扣除 $0.009 的费用与库存/对冲成本，但遗漏了成交条件下最关键的 adverse markout。' },
      { id: 'c', label: '−$0.006 / 股', diagnosis: '算式方向反了；$0.040 仍大于两类成本之和 $0.034。' },
    ],
    calculation: '$0.040−$0.025−$0.009=+$0.006，也就是以 $100 为基准的 +0.6 bp。',
    reveal: '正的 conditional margin 仍不保证整套策略赚钱：还要乘成交概率、计入未成交机会、固定技术成本、尾部损失和资本占用。',
  },
  {
    id: 'queue-choice',
    label: '竞争基础 02 · Price / queue',
    title: '是否应当为了获得价格优先，把 ask 从 $100.02 改进到 $100.01？',
    brief: '旧报价在 $100.02 前方排着 500 股；改进一 tick 会成为新的 best ask，但每股少收一美分。',
    facts: [
      { label: 'Stay', value: '$100.02, Qahead=500', note: '毛边际较高，成交更晚且可能排不到' },
      { label: 'Improve', value: '$100.01, Qahead=0', note: '获得价格优先，毛边际少 $0.01' },
      { label: 'Unknown state', value: 'Flow / toxicity / horizon', note: '未来主动买量、撤单、消息与库存均未给定' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '一定改进，因为价格优先总是更好', diagnosis: '价格优先提高 fill chance，却同时降低每股收入并改变 adverse-selection exposure。' },
      { id: 'b', label: '一定留在原队列，因为价差收入更高', diagnosis: '较高名义收入没有意义，如果期限内几乎不可能成交或库存急需释放。' },
      { id: 'c', label: '信息不足；应比较两种状态依赖期望价值', diagnosis: '正确：队列位置、成交概率、条件 markout、库存目标和期限必须一起进入。' },
    ],
    calculation: '比较 Vimprove=Pfill,1·L·g1−K1 与 Vstay=Pfill,2·L·g2−K2；仅凭一 tick 与 Qahead 不能决定符号。',
    reveal: '价格竞争不是机械地把报价推到最优档位；它把“每股赚多少”和“何时、以什么信息条件成交”绑在一起。',
  },
  {
    id: 'effective-number',
    label: '竞争基础 03 · Effective providers',
    title: '四家供应者的成交份额为 70%、10%、10%、10%，有效供应者数量是多少？',
    brief: '使用 Neff=1/Σsi²。份额用小数表示；这个指标只衡量集中度，不衡量压力时是否共同退出。',
    facts: [
      { label: 'Shares', value: '0.70 / 0.10 / 0.10 / 0.10', note: '四个可见参与者并非等权' },
      { label: 'Concentration', value: 'Σsi²', note: '份额平方和越高，集中度越高' },
      { label: 'Benchmark', value: '4 equal firms → Neff=4', note: '等份额时等于名义数量' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '4.00', diagnosis: '这是账户数量，忽略一家占 70% 的集中度。' },
      { id: 'b', label: '约 1.92', diagnosis: '正确：1/(0.49+0.01+0.01+0.01)=1/0.52≈1.92。' },
      { id: 'c', label: '约 0.52', diagnosis: '0.52 是份额平方和，不是它的倒数。' },
    ],
    calculation: 'Neff=1/(0.70²+3×0.10²)=1/0.52≈1.923。',
    reveal: '“有四家”不等于四份独立容量；而 Neff≈1.92 也仍可能高估韧性，因为不同公司可能使用相同信号、对冲市场和风险阈值。',
  },
  {
    id: 'spread-depth',
    label: '竞争基础 04 · Liquidity vector',
    title: 'Quoted spread 从 4 美分降到 2 美分，但 best-level depth 从 10,000 股降到 2,000 股，流动性是否改善？',
    brief: '假定观察窗口、股票和价格水平可比；没有给出大单执行成本、恢复速度或撤单后可成交率。',
    facts: [
      { label: 'Tightness', value: '4¢ → 2¢', note: '小额立即成交的名义价格改善' },
      { label: 'Displayed depth', value: '10k → 2k shares', note: 'inside 可见容量下降 80%' },
      { label: 'Missing', value: 'Impact / fill / resiliency', note: '大单和压力状态尚未测量' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '一定改善，因为 spread 更窄', diagnosis: '这只评价 tightness，不能替代 depth、impact 与 resiliency。' },
      { id: 'b', label: '一定恶化，因为 depth 更少', diagnosis: '这忽略了小单的执行价格确实改善；不同使用者面对的结果可能不同。' },
      { id: 'c', label: '只能说 tightness 改善、displayed depth 恶化', diagnosis: '正确：必须把流动性当向量，并按订单规模与状态评估。' },
    ],
    calculation: 'Spread 改善 50%，inside displayed depth 下降 80%；没有一个诚实的标量能在缺少权重时自动合并二者。',
    reveal: '竞争最容易改善屏幕最内侧价格，却不必然增加可供大单使用的风险资本；这是“正常时更紧、压力时更薄”能够同时成立的第一步。',
  },
];

const speedStressScenarios: Scenario[] = [
  {
    id: 'participation-threshold',
    label: '速度与压力 01 · Participation',
    title: '状态从正常切换到压力后，这张被动报价的条件净边际怎样变化？',
    brief: '所有数字均以 bp/成交名义金额计。Gross capture 固定为 1.8 bp；只改变成交后的 markout 与库存/对冲成本。',
    facts: [
      { label: 'Normal', value: '1.8−0.8−0.4−0.2', note: 'Markout、risk/hedge、fees 依次扣除' },
      { label: 'Stress', value: '1.8−1.5−0.7−0.2', note: '信息毒性和对冲成本同时升高' },
      { label: 'Control set', value: 'Price / size / cancel / exit', note: '供应者不只会扩大 spread' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '正常 +0.4 bp；压力仍 +0.4 bp', diagnosis: '你把条件 markout 和对冲成本误当成固定不变。' },
      { id: 'b', label: '正常 +0.4 bp；压力 −0.6 bp', diagnosis: '正确：同一屏幕价差在状态改变后可从可供给变成负期望值。' },
      { id: 'c', label: '正常 −0.4 bp；压力 +0.6 bp', diagnosis: '收入与成本的符号被整体颠倒了。' },
    ],
    calculation: 'Normal=1.8−0.8−0.4−0.2=+0.4 bp；Stress=1.8−1.5−0.7−0.2=−0.6 bp。',
    reveal: '当许多供应者使用相似的 toxicity、波动与 hedge-cost 状态变量时，同一个阈值会同时触发降 size、撤单或退出；这不是由“机器恐慌”这一拟人化解释产生的。',
  },
  {
    id: 'latency-race',
    label: '速度与压力 02 · Public signal race',
    title: '所有人几乎同时看见公共价格跳升，快交易者抢在旧 ask 撤掉前买入。最稳健的福利判断是什么？',
    brief: '信号不是私人研究成果；赢家从过时 quote 获利，原做市商承担 stale-quote loss，各公司另付速度基础设施成本。',
    facts: [
      { label: 'Information', value: 'Public and symmetric', note: '信息本身不因某家公司更快而产生' },
      { label: 'Transfer', value: 'Sniper gain ↔ maker loss', note: '成交利润大体是参与者间转移' },
      { label: 'Real cost', value: 'Speed investment', note: '光纤、微波、共址和工程成本消耗资源' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '私人速度价值可为正，但社会增量可能很小甚至为负', diagnosis: '正确：必须分开抢到转移收益的私人回报与信息/风险共享的社会产出。' },
      { id: 'b', label: '赢家获利，所以社会福利必然提高同样金额', diagnosis: '赢家利润对应旧报价供应者损失，不能把转移直接当新增总剩余。' },
      { id: 'c', label: '只要信息是公共的，速度不可能影响任何报价', diagnosis: '连续、串行处理会让微小到达先后决定取消或成交谁先发生。' },
    ],
    calculation: '社会账本≈投资者执行收益＋真实风险共享/信息收益−速度资源成本；sniping profit 与 stale-quote loss 先在参与者间相抵。',
    reveal: '这不证明所有低延迟投资都浪费：更快监控也能减少过时报价风险、让做市商报得更紧。关键是绝对处理能力还是相对抢跑优势。',
  },
  {
    id: 'hft-taxonomy',
    label: '速度与压力 03 · HFT taxonomy',
    title: '一家机构 80% 成交为被动、日终近乎平仓、频繁更新双边报价。能够支持什么结论？',
    brief: '没有观察它在其他证券、场所和时段的全部策略，也没有随机分配“高频身份”。',
    facts: [
      { label: 'Passive share', value: '80%', note: '多数成交来自已挂出的订单' },
      { label: 'Inventory', value: 'Near-flat EOD', note: '日终不承担显著方向库存' },
      { label: 'Messages', value: 'Frequent updates', note: '高频监控和订单管理' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '证明所有 HFT 都提供流动性', diagnosis: '从一家机构外推到全部 HFT，忽略 market-making 与 opportunistic 策略异质性。' },
      { id: 'b', label: '证明高撤单率等于虚假流动性', diagnosis: '频繁更新可能是风险管理，也可能有策略性问题；必须看可执行率、时序与意图证据。' },
      { id: 'c', label: '与电子做市商画像一致，但不是整个 HFT 类别的定义', diagnosis: '正确：这是行为分类证据，不是对技术标签的普遍因果结论。' },
    ],
    calculation: '分类应基于 passive/active mix、持仓周期、报价持续性、撤单时序与策略状态，而不是单凭“快”或消息数量。',
    reveal: 'Algorithmic trading、HFT、electronic market making 和 aggressive latency trading 是重叠但不相同的集合；不拆开策略，平均结果没有机制含义。',
  },
  {
    id: 'extreme-evidence',
    label: '速度与压力 04 · Tail evidence',
    title: '研究发现：单只股票极端波动时 HFT 平均吸收非 HFT 失衡；多只股票同时极端波动时 HFT 净需求占优。正确解读是什么？',
    brief: '这是给定样本与事件定义下的条件平均，不是所有市场、所有 HFT 或每条路径的定律。',
    facts: [
      { label: 'Idiosyncratic stress', value: 'Net supply on average', note: '单股冲击仍可能被跨资产资本吸收' },
      { label: 'Systematic stress', value: 'Net demand dominates', note: '条件角色翻转；具体容量渠道未被单独识别' },
      { label: 'Causality', value: 'Little evidence HFT caused EPMs', note: '不等于排除任何放大或反馈渠道' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'HFT 在压力下总会退出，因此必然造成极端波动', diagnosis: '单股事件中的平均净供给和“少有起因证据”直接反驳这一绝对命题。' },
      { id: 'b', label: '供给角色随冲击广度翻转，与共同容量受压机制一致', diagnosis: '正确：单股与多股同时事件的条件平均异号，与共同容量受压机制一致；但这不是容量渠道的因果估计。' },
      { id: 'c', label: 'HFT 从不放大波动，因为研究没有发现它们造成事件', diagnosis: '“不是起因”不等于“没有传播或状态反馈”，两种因果问题必须分开。' },
    ],
    calculation: '识别对象应写成 E[net HFT liquidity | idiosyncratic EPM] 与 E[net HFT liquidity | simultaneous EPM] 的差，而非无条件 HFT dummy。',
    reveal: '压力研究必须先定义冲击广度、参与者策略、供给/需求方向和事件时钟；只比较“有 HFT/无 HFT”会把异质机制压成口号。',
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

export default function LiquidityCompetitionLab() {
  const [mode, setMode] = useState<Mode>('competition');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'competition' ? competitionScenarios : speedStressScenarios;
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

  const modeLabel = mode === 'competition' ? '报价与容量竞争' : '速度与压力状态';

  return (
    <div className="liquidity-competition-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>COMPETITION · QUEUE · SPEED · PARTICIPATION</span>
          <h3>从单张报价的经济性，推到多个供应者何时竞争、何时同步收缩</h3>
        </div>
        <p>两种模式各四题。每题先固定反事实与状态，再揭示计算、机制边界和最弱可支持结论。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="流动性供应竞争实验模式">
        <button type="button" aria-pressed={mode === 'competition'} onClick={() => selectMode('competition')}>
          <span>MODE A</span><b>Quotes &amp; Capacity</b><small>边际、队列、集中度与流动性向量</small>
        </button>
        <button type="button" aria-pressed={mode === 'speed-stress'} onClick={() => selectMode('speed-stress')}>
          <span>MODE B</span><b>Speed &amp; Stress</b><small>参与阈值、速度竞赛、策略分类与尾部证据</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
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
              name={'liquidity-competition-' + mode + '-' + scenario.id}
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
          <p className="impact-locked">先选择答案。计算、条件性结论与反事实边界仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-labelledby={resultTitleId}>
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

      <p className="impact-lab-caveat"><b>实验边界：</b>这些题训练竞争、队列、速度和状态依赖参与的机制识别，不是可部署 HFT 策略。真实结果还依赖 tick、fees、订单类型、场所规则、跨市场 hedge、风险限额和做市义务。</p>
    </div>
  );
}
