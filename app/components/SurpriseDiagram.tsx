import styles from './surpriseDiagram.module.css';

const cards=[
 {number:'01',title:'先固定对象与时钟',body:'Actual与代理必须匹配变量、参考期、版本和单位；形成、截止、公开、收到、公告分别保存。',condition:'错对象会制造假意外，错时钟会把后来资料带回过去。',sources:[2,4,5,7]},
 {number:'02',title:'再问相对谁是新消息',body:'同一实现值可相对上期改善、相对调查偏弱，也可只改写一个消息包分量；代理还可能陈旧。',condition:'均值、中位和个体预期分列，零代理差不等全部主体零更新。',sources:[2,4,6,8]},
 {number:'03',title:'把更新拆进估值通道',body:'消息可能同时改变未来现金流、总所需回报、政策目标和路径；联合结果含期限与交互。',condition:'GDP不是股权现金流，总回报不是GDP增长，也不能把单改对照直接相加。',sources:[1,3,9]},
 {number:'04',title:'最后经过主体和市场',body:'持仓、风险限额、流动性与订单把异质更新变成价格；价格和政策反应又进入下一轮信息。',condition:'窄窗减少部分重叠，不自动识别外生冲击、PIT、OOS或可执行收益。',sources:[2,3]},
] as const;

export default function SurpriseDiagram(){return <figure className={styles.diagram} aria-labelledby="surprise-diagram-title">
 <figcaption className={styles.caption}><p className={styles.kicker}>INFORMATION → BELIEFS → CASH FLOW / REQUIRED RETURN → ORDERS → PRICE → FEEDBACK</p><h3 id="surprise-diagram-title">宏观公布值不会跳过预期、主体与市场，直接变成价格。</h3><p>四张卡是条件链，不是每次公告都按固定方向运行的四阶段。任何一门缺证据，就在该门保留未知。</p></figcaption>
 <div className={styles.cards}>{cards.map(card=><article className={styles.card} key={card.number}><span>{card.number}</span><h4>{card.title}</h4><p>{card.body}</p><p className={styles.condition}><b>检查门：</b>{card.condition}</p><p className={styles.sources}>{card.sources.map(id=><a key={id} href={`#ref-${id}`} aria-label={`关系图参考文献${id}`}>[{id}] </a>)}</p></article>)}</div>
 <p className={styles.feedback}><b>反馈不是噪声：</b>政策和价格会响应宏观信息，这些响应又改变融资、活动和下一轮预测。若用公告后的价格或政策反应重新构造“事前”代理，必须重新检查反向反馈与时间泄漏。</p>
 <p className={styles.boundary}>本图只组织可检验问题；没有导入真实公告、调查、证券或订单数据，也没有给任一箭头指定统一系数。</p>
 </figure>;}
