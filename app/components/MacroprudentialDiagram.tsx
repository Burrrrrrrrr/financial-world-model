import styles from './macroprudential.module.css';

const cards = [
  { number: '01', title: '先定位外部性', body: '私人杠杆、期限错配、互联或共同暴露如何把个体选择转成系统损失？', gate: '没有主体、合同、共同状态和实体后果，就不从价格波动跳到系统风险。', sources: [1, 2] },
  { number: '02', title: '区分两个维度', body: '时间维度追踪顺周期积累与释放；横截面维度追踪关键节点、共同暴露和替代性。', gate: '低波动不等安全，规模也不等系统重要性；两维不能压成单一风险分。', sources: [1, 2] },
  { number: '03', title: '把目标变成中间目标', body: '最终金融稳定目标先翻译为韧性、顺周期、流动性、集中或基础设施对象。', gate: '指标只提示调查，不是机械开关；目标、权限、数据和治理必须同时存在。', sources: [2, 3] },
  { number: '04', title: '工具改变可行集', body: '资本工具先改贷款人缓冲，借款人型工具先改资格，流动性工具先改现金与期限。', gate: '近端靶点不是唯一效果；capacity、threshold、choice和actual行为分别记录。', sources: [1, 2, 3] },
  { number: '05', title: '分开leaning与resilience', body: '流量约束可先改新贷，缓冲可在压力期吸收损失；存量分布和实际使用有不同时间。', gate: '信贷下降不等韧性提高，资本率提高也不等压力期缓冲被使用。', sources: [2, 4] },
  { number: '06', title: '追踪泄漏并重新校准', body: '非银、分行、子公司、离岸借款和资产替代让毛效果与系统净效果分叉。', gate: 'unknown不填0；政策后的变化还需反事实、分配与总量成本评估。', sources: [2, 4, 7] },
] as const;

export default function MacroprudentialDiagram() {
  return (
    <figure className={styles.diagram} aria-labelledby="macroprudential-diagram-title">
      <figcaption className={styles.diagramCaption}>
        <p className={styles.diagramKicker}>EXTERNALITY → DIMENSION → OBJECTIVE → INSTRUMENT → FEASIBLE SET → FLOW / BUFFER → STRESS → LEAKAGE → RECALIBRATION</p>
        <h3 id="macroprudential-diagram-title">宏观审慎是一条有反馈、可失败的政策链，不是“看到风险就加一个比率”。</h3>
        <p>六张卡是证据门。每一步只在对象、时钟、范围和行为证据成立时向下游传递；缺失就保留unknown。</p>
      </figcaption>
      <div className={styles.diagramCards}>
        {cards.map(card => <article className={styles.diagramCard} key={card.number}>
          <span>{card.number}</span><h4>{card.title}</h4><p>{card.body}</p><p className={styles.diagramGate}><b>检查门：</b>{card.gate}</p>
          <p className={styles.sources}>{card.sources.map(id => <a key={id} href={`#ref-${id}`} aria-label={`政策链参考文献${id}`}>[{id}] </a>)}</p>
        </article>)}
      </div>
      <p className={styles.diagramFeedback}><b>反馈不是附注：</b>工具改变可行集，主体选择改变信贷流、风险分布和缓冲；压力结果与泄漏又改变下一轮指标、范围和校准。把结果重新输入政策时，必须保留当时信息集，避免事后资料倒灌。</p>
    </figure>
  );
}
