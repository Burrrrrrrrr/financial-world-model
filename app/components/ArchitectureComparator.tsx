'use client';

import { useState } from 'react';

const architectures = {
  orderBook: {
    label: '订单驱动 · 连续订单簿',
    short: 'Order-driven CLOB',
    flow: ['投资者指令', '经纪商 / 会员', '可见或部分可见订单簿', '规则化自动撮合', '成交与报告'],
    liquidity: '来自其他投资者、机构和做市商提交的存量限价订单；交易所本身通常不拿资产负债表接单。',
    price: '可成交订单按场所的价格与优先规则，和当时最优对手方订单逐笔匹配。',
    transparency: '通常有较强的成交前价格可见性，但隐藏订单、暗池和多场所交易会使全貌不完整。',
    failure: '薄订单簿会放大冲击；大单公开可能泄露意图；连续优先规则还可能把竞争引向速度。',
  },
  dealer: {
    label: '交易商 · 双边报价 / RFQ',
    short: 'Dealer / RFQ',
    flow: ['客户交易意图', '向一名或多名交易商询价', '交易商以自营身份报价', '客户选择或拒绝', '双边成交与报告'],
    liquidity: '交易商先用自己的库存和资本承接客户，再通过另一客户、其他交易商或公开市场管理风险。',
    price: '报价综合参考市场、规模、信用、库存、对冲成本与客户信息；同一时点不同客户可能得到不同可执行价格。',
    transparency: '询价可限制在少数交易商之间，减少公开泄露，但客户看不到完整市场供需，必须比较报价。',
    failure: '压力时期交易商可能扩大价差、缩小可承接规模或撤回报价；即时性依赖其资产负债表。',
  },
  brokered: {
    label: '经纪撮合 · 搜索自然对手方',
    short: 'Brokered search',
    flow: ['大额或非标准意图', '经纪商保密搜索', '寻找自然对手方', '双方协商条款', '成交与报告'],
    liquidity: '最终来自愿意站到另一边的客户；纯代理经纪商帮助搜索和谈判，但不一定用自有资本承担头寸。',
    price: '价格由双边或多边协商形成，往往同时取决于规模、时间、条款与对手方信用。',
    transparency: '公开前透明度较低，有助于保护大单意图；但搜索过程中仍可能泄露信息。',
    failure: '寻找对手方需要时间且不保证成交；市场紧张时，愿意承接整笔风险的人可能消失。',
  },
  call: {
    label: '集合 / 批量竞价',
    short: 'Call / batch auction',
    flow: ['一段时间内收集订单', '形成累计买卖意愿', '按规则计算候选价格', '单一价格集中成交', '剩余订单进入下一阶段'],
    liquidity: '来自同一时间窗口内聚集的买卖双方，不要求某个交易商持续用库存提供即时性。',
    price: '在合格订单集合上选择统一成交价，通常先最大化成交量，再按场所规则处理并列与失衡。',
    transparency: '可披露指示价和失衡，也可限制信息；具体程度决定参与者能否在竞价前策略性调整。',
    failure: '等待窗口牺牲即时性；订单失衡可能使一侧大量未成交；并列与价格保护规则会影响结果。',
  },
} as const;

type ArchitectureKey = keyof typeof architectures;

const constraints = {
  immediacy: {
    label: '即时性与等待',
    question: '现在能否成交，比隐藏完整意图更先成为瓶颈。',
  },
  leakage: {
    label: '冲击与意图泄露',
    question: '公开完整规模可能先改变他人的订单和报价。',
  },
  standardization: {
    label: '合约能否互换',
    question: '若条款无法放入共同价格—数量坐标，自动匹配先失去基础。',
  },
} as const;

type ConstraintKey = keyof typeof constraints;

const scenarios = {
  liquid: {
    label: '小额标准化股票',
    context: '规模很小、证券高度标准化、希望立即交易。',
    priority: 'immediacy',
    feedback: '在这个简化情境里，合约已经标准化且规模不易暴露完整机构意图，首先要比较的是立即执行、排队和等待下一批次的代价。',
    fit: {
      orderBook: '公开订单簿通常能快速给出可执行价格；关键约束是 spread、排队与当时深度。',
      dealer: '交易商也能提供即时性，但需要比较报价及经纪商是否以自营身份成交。',
      brokered: '专门搜索对手方的时间成本通常高于这笔小额交易的收益。',
      call: '若恰逢开盘或收盘竞价，可借助集中流动性；否则必须等待下一批次。',
    },
  },
  block: {
    label: '机构大宗交易',
    context: '规模远大于最优报价深度，公开展示可能提前推动价格。',
    priority: 'leakage',
    feedback: '规模远大于显示深度时，任何路径都要先回答谁会看见完整方向，以及公开冲击、搜索泄露和 dealer 报价补偿分别落在哪里。',
    fit: {
      orderBook: '立即扫单确定性高但冲击可能大；拆单可以隐藏规模，却延长暴露时间。',
      dealer: '交易商可用资产负债表一次承接，但报价会补偿库存、对冲和信息风险。',
      brokered: '寻找自然对手方可能减少机械冲击，代价是等待、谈判与信息泄露风险。',
      call: '若大量参与者在同一时点聚集，统一价格可降低顺序优势；但未必能吸收全部失衡。',
    },
  },
  bespoke: {
    label: '非标准化合约',
    context: '条款、期限或信用暴露需要定制，合约难以与公开订单完全互换。',
    priority: 'standardization',
    feedback: '在比较速度和透明度之前，必须先确认不同意图是否指向可互换的同一合约；否则统一订单簿和单一清算价没有共同对象。',
    fit: {
      orderBook: '缺乏可互换标准品时，很难形成足够密集、可自动匹配的订单簿。',
      dealer: '交易商可以同时设计条款、报价并管理信用与对冲，是常见组织方式。',
      brokered: '经纪商可在专业参与者之间搜索满足特定条款的对手方。',
      call: '若订单并非同一标准化合约，就没有可共同计算的单一清算价。',
    },
  },
} as const;

type ScenarioKey = keyof typeof scenarios;

export default function ArchitectureComparator() {
  const [architectureKey, setArchitectureKey] = useState<ArchitectureKey>('orderBook');
  const [scenarioKey, setScenarioKey] = useState<ScenarioKey>('block');
  const [prediction, setPrediction] = useState<ConstraintKey | null>(null);
  const [revealed, setRevealed] = useState(false);
  const architecture = architectures[architectureKey];
  const scenario = scenarios[scenarioKey];

  const selectScenario = (key: ScenarioKey) => {
    setScenarioKey(key);
    setPrediction(null);
    setRevealed(false);
  };

  return (
    <section className="architecture-lab" id="architecture-lab" aria-labelledby="architecture-lab-title">
      <div className="architecture-lab-head">
        <p>10 · INTERACTIVE · 同一意图，不同制度路径</p>
        <h2 id="architecture-lab-title">改变架构，究竟是谁在提供流动性？</h2>
        <span>先选交易情境并预测首要瓶颈，再打开四条架构路径。这里比较的是约束与传导机制，不是给每种资产贴一个永恒的“最佳市场”标签。</span>
      </div>

      <div className="scenario-picker" aria-label="选择交易情境">
        {Object.entries(scenarios).map(([key, item]) => (
          <button aria-pressed={scenarioKey === key} key={key} onClick={() => selectScenario(key as ScenarioKey)} type="button">
            <b>{item.label}</b><span>{item.context}</span>
          </button>
        ))}
      </div>

      <div className="architecture-prediction">
        <div className="prediction-prompt">
          <span>STEP 01 · 先作预测</span>
          <h3>在教材给定的简化条件下，哪一个约束应当最先检查？</h3>
          <p>这不是问唯一最佳市场。先识别首要摩擦，才能解释不同架构把成本转移给谁。</p>
        </div>
        <div className="constraint-picker" aria-label="预测首要约束">
          {Object.entries(constraints).map(([key, item]) => (
            <button aria-pressed={prediction === key} key={key} onClick={() => { setPrediction(key as ConstraintKey); setRevealed(false); }} type="button">
              <b>{item.label}</b><span>{item.question}</span>
            </button>
          ))}
        </div>
        <button className="prediction-reveal" disabled={!prediction} onClick={() => setRevealed(true)} type="button">
          查看反馈并打开四条路径
        </button>
        {revealed && prediction && (
          <div className={prediction === scenario.priority ? 'prediction-result correct' : 'prediction-result'} aria-live="polite" role="status">
            <b>{prediction === scenario.priority ? '预测命中首要约束。' : `先把“${constraints[scenario.priority].label}”放到第一位。`}</b>
            <p>{scenario.feedback} 其他约束仍然存在，接下来逐条比较它们怎样组合。</p>
          </div>
        )}
      </div>

      {revealed ? (
        <>
          <div className="architecture-picker" aria-label="选择市场架构">
            {Object.entries(architectures).map(([key, item], index) => (
              <button aria-pressed={architectureKey === key} key={key} onClick={() => setArchitectureKey(key as ArchitectureKey)} type="button">
                <span>{String(index + 1).padStart(2, '0')}</span>{item.short}
              </button>
            ))}
          </div>

          <div className="architecture-panel">
            <div className="architecture-title"><span>{scenario.label}</span><h3>{architecture.label}</h3><p>{scenario.fit[architectureKey]}</p></div>
            <div className="architecture-flow" aria-label={`${architecture.label} 的执行路径`}>
              {architecture.flow.map((step, index) => <div key={step}><span>{String(index + 1).padStart(2, '0')}</span><b>{step}</b></div>)}
            </div>
            <div className="architecture-facts">
              <article><span>流动性来自谁</span><p>{architecture.liquidity}</p></article>
              <article><span>价格怎样形成</span><p>{architecture.price}</p></article>
              <article><span>谁能看见什么</span><p>{architecture.transparency}</p></article>
              <article><span>主要失败模式</span><p>{architecture.failure}</p></article>
            </div>
          </div>
        </>
      ) : (
        <div className="architecture-locked"><span>STEP 02</span><p>提交预测后，四种架构的完整传导路径会在这里展开。</p></div>
      )}

      <p className="architecture-lab-note">
        现实市场经常把多种机制叠在一起：同一股票可以在公开订单簿、暗池和交易商内部系统之间路由；
        同一外汇市场也可以同时存在匿名订单簿、双边报价和多交易商 RFQ。架构名称是分析工具，不是互斥的市场身份证。
      </p>
    </section>
  );
}
