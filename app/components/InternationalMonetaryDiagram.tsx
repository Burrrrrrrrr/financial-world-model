import styles from './internationalMonetary.module.css';

const stages = [
  {
    number: '01',
    title: '先拆成功能护照',
    body: '合同计价、付款、最终结算、外汇交易、融资负债、官方储备和汇率锚各自回答不同问题，不能压成一个“国际份额”。',
    gate: '每个数字先写明function、unit、reference period、coverage、denominator与vintage；缺任一项，就停在口径核验。',
    sources: [4, 15, 19],
  },
  {
    number: '02',
    title: '再检查准入条件',
    body: '价值稳定、法治与产权、可兑换性、资产容量、市场深度和可靠基础设施，决定一种货币能否承载大规模跨境承诺。',
    gate: '这些条件使核心网络成为可能，却不单独保证所有主体都会采用，也没有一组跨时代固定权重。',
    sources: [1, 4, 17],
  },
  {
    number: '03',
    title: '让协调预期进入选择',
    body: '其他客户、银行、做市商和投资者越可能接受同一货币，单个主体的报价、换汇、套保、融资与系统接入成本越低。',
    gate: '网络效应是在准入条件之上的放大器；多重均衡不等于基本面无关，也不等于路径不可逆。',
    sources: [1, 2, 4],
  },
  {
    number: '04',
    title: '沿全链成本形成路由',
    body: '订单可直接兑换，也可经载体货币；支付还要经过消息、资金移动、清算和最终结算。深市场会吸引更多流量，流量又改善深度。',
    gate: '多一条兑换腿未必更贵；更快消息也未必改变计价、融资、抵押品与最终结算资产。',
    sources: [3, 5, 9],
  },
  {
    number: '05',
    title: '把功能接回资产负债表',
    body: '贸易计价创造该币种营运资金与套保需求，银行负债和债券供给提供融资，安全资产与抵押品又支撑交易、储备和压力期流动性。',
    gate: '衍生品可压低开放头寸，却可能留下保证金、基差与展期风险；公共后备是有条件的，不是自动无限保险。',
    sources: [7, 10, 11, 18],
  },
  {
    number: '06',
    title: '用双时钟判断持续或替代',
    body: '新合同、发行和支付路线可以先变，旧债、储备、账户关系与系统投资则按期限缓慢到期；估值变化还会在没有交易时改写存量份额。',
    gate: '单季份额、单一功能或地缘相关性都不能单独证明广泛替代；必须分开新流量、既有存量、估值与结构断点。',
    sources: [8, 12, 13, 14, 15],
  },
] as const;

export default function InternationalMonetaryDiagram() {
  return (
    <figure className={styles.diagram} aria-labelledby="international-monetary-diagram-title">
      <figcaption className={styles.diagramCaption}>
        <p className={styles.diagramKicker}>FUNCTION PASSPORTS → ADMISSION → COORDINATION → ROUTING → BALANCE SHEETS → STOCK-FLOW MIGRATION</p>
        <h3 id="international-monetary-diagram-title">核心货币集中不是一项单独优势的静态排名，而是一条可被进入、放大、维持，也能在条件恶化时逆转的反馈链。</h3>
        <p>六张卡是解释顺序，不是现实货币的打分表。每一步都要说明主体、功能、成本、时间和证据；任何一步缺少资料，就保留unknown，而不是用下一层结果倒填上一层原因。</p>
      </figcaption>
      <div className={styles.diagramCards}>
        {stages.map(stage => (
          <article className={styles.diagramCard} key={stage.number}>
            <span>{stage.number}</span>
            <h4>{stage.title}</h4>
            <p>{stage.body}</p>
            <p className={styles.diagramGate}><b>检查门：</b>{stage.gate}</p>
            <p className={styles.sources}>
              {stage.sources.map(id => <a key={id} href={`#ref-${id}`} aria-label={`国际货币体系关系图参考文献${id}`}>[{id}] </a>)}
            </p>
          </article>
        ))}
      </div>
      <p className={styles.diagramFeedback}><b>两条反馈必须同时看：</b>更多使用降低边际全链成本，推动进一步采用；但集中也会累积共同融资、抵押与基础设施依赖。压力、政策、技术或地缘冲击是否足以改变均衡，取决于它们能否同时撬动新流量、既有存量和网络接入成本，而不是只改变一个醒目的市场份额。</p>
    </figure>
  );
}
