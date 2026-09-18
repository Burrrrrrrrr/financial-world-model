import styles from './balanceOfPayments.module.css';

const cards = [
  {
    number: '01',
    title: '先冻结统计边界',
    body: '国际收支记录居民与非居民之间的交易；居民身份不等于国籍、上市地、币种或集团控制。',
    gate: '主体或交易对手的居住身份未定，就先停在分类问题，不能仅凭“跨境付款”命名账户。',
    sources: [1, 2],
  },
  {
    number: '02',
    title: '再确认流量与时钟',
    body: 'BOP是期间交易流量；IIP是时点外部资产负债存量。参考期、估值日、发布与修订时钟必须分开。',
    gate: '存量、存量变化和期间交易是三个对象；发布日期也不是统计参考期。',
    sources: [1, 3],
  },
  {
    number: '03',
    title: '逐笔保留复式对项',
    body: '货物、服务或收入的一条记录，会有金融资产、负债或其他账户中的对项；实体现金无需穿越边境。',
    gate: 'credit与debit是记账方向，不自动等于好坏、现金流入流出或本币升贬值。',
    sources: [1],
  },
  {
    number: '04',
    title: '汇总但不掩埋差额',
    body: '经常账户、资本账户和金融账户分别汇总；不同来源未闭合时，统计差异必须显式保留。',
    gate: '会计恒等式不授权把实测差额塞回某一账户，也不能自动定位遗漏或非法流动。',
    sources: [1, 4],
  },
  {
    number: '05',
    title: '把交易接回IIP桥',
    body: '期末头寸由期初头寸、交易、汇率与其他价格重估、其他数量变化共同连接。',
    gate: '头寸增加不等当期净买入；储备变化也不等已识别的外汇干预。',
    sources: [1, 3, 6],
  },
  {
    number: '06',
    title: '最后才解释机制',
    body: '毛资产与负债、期限、币种、部门和对手方决定融资与估值暴露；净额只回答其中一个切面。',
    gate: '账本闭合不识别因果、可持续性、危机概率、汇率方向或政策效果；这些需要额外数据与设计。',
    sources: [1, 3, 6],
  },
] as const;

export default function BalanceOfPaymentsDiagram() {
  return (
    <figure className={styles.diagram} aria-labelledby="balance-of-payments-diagram-title">
      <figcaption className={styles.diagramCaption}>
        <p className={styles.diagramKicker}>RESIDENCE → PERIOD TRANSACTION → DOUBLE ENTRY → ACCOUNT BALANCE → IIP BRIDGE → CONDITIONAL INTERPRETATION</p>
        <h3 id="balance-of-payments-diagram-title">国际收支先是一套对象与时钟严格的复式账本，解释因果必须另过一道证据门。</h3>
        <p>六张卡是检查顺序，不是“顺差必然升值、逆差必然危机”的方向预测。任何一门缺证据，就在该门保留unknown。</p>
      </figcaption>
      <div className={styles.diagramCards}>
        {cards.map(card => (
          <article className={styles.diagramCard} key={card.number}>
            <span>{card.number}</span>
            <h4>{card.title}</h4>
            <p>{card.body}</p>
            <p className={styles.diagramGate}><b>检查门：</b>{card.gate}</p>
            <p className={styles.sources}>
              {card.sources.map(id => <a key={id} href={`#ref-${id}`} aria-label={`国际收支关系图参考文献${id}`}>[{id}] </a>)}
            </p>
          </article>
        ))}
      </div>
      <p className={styles.diagramFeedback}><b>反馈不是会计对项：</b>汇率、利率、收入、政策和资产价格会改变下一期交易与估值；这些行为反应必须用其当时可得信息另行识别，不能从本期账本恒等式倒推出唯一因果箭头。</p>
    </figure>
  );
}
