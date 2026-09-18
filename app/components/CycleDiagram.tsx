import styles from './cycleDiagram.module.css';

const sources = [1,3,7,8,10] as const;
const cards = [
  {
    key: 'cashflow',
    title: '一 · 活动现金流 → 合同兑现',
    mechanism: '订单、就业或收入变化先进入具体家庭和企业的现金流；此前债务仍按自己的日期付款。储备现金、资产回收和续借决定收入下降能否变成付款压力。',
    condition: '只有付款缺口、违约或损失确认确有证据，才继续连接金融压力；缓冲与支出调整可以截断放大。一个总量负增长不替代每个主体的合同。',
  },
  {
    key: 'commitment',
    title: '二 · 长承诺／抵押品 → 信用菜单',
    mechanism: '长期合同和集中到期让短期好消息留下更慢的承诺。资产估值只有经过质押范围、更新规则和门槛，才可能改变下一笔融资的可行菜单。',
    condition: '容量不是风险意愿；需求、报价、接受和审批另核。真实信用与购买选择可能再反馈成交、价值和收入，房价涨跌不自动等于确认贷款损失。',
  },
  {
    key: 'loss',
    title: '三 · 给定损失 → 承损／反馈',
    mechanism: '若已确认贷款损失，且现金、负债按题设固定，资产和权益随之减少。相同产出方向下，不同承诺或损失也可能留下不同承损缓冲。',
    condition: '非正权益可为有效toy结果，本课不算相应资产／权益杠杆；它不是法定关停或系统危机标签。补资本、缩贷及实体回传仍须实际约束和选择证据。',
  },
  {
    key: 'clock',
    title: '四 · 资料时钟 → 不同研究任务',
    mechanism: '观测参考期、首次发布、修订、正式定年公告与系数训练分别绑定时钟。今天看见的历史峰谷，不保证当时公众或模型已知道。',
    condition: '事后定年、描述、机制解释和预测分别设计。预测还须当时可用版本、训练截止及样本外目标；滞后特征、后向窗口和SYN都不独自认证PIT。',
  },
] as const;

/** 作者原生HTML概念图：无客户端状态、数值模型、真实数据或周期波形。 */
export default function CycleDiagram() {
  return (
    <figure
      className={styles.diagram}
      aria-labelledby="cycle-scope-title"
      aria-describedby="cycle-scope-description cycle-scope-boundary"
    >
      <figcaption className={styles.caption}>
        <p className={styles.kicker}>概念关系 · 为什么衰退不等于金融危机</p>
        <h3 id="cycle-scope-title">活动方向与金融承诺之间，还隔着主体、合同和信息</h3>
        <p id="cycle-scope-description">
          四卡各是一条条件因果链，不是必然依次发生的四步。实体现金流与信用条件可以双向反馈；只有相应对象和证据齐全，才把活动转向接到金融压力或研究结论。
        </p>
      </figcaption>

      <ol className={styles.cards} role="list">
        {cards.map((card) => (
          <li className={styles.card} key={card.key}>
            <h4>{card.title}</h4>
            <p>{card.mechanism}</p>
            <p className={styles.condition}>
              <strong>连接条件：</strong>{card.condition}
            </p>
          </li>
        ))}
      </ol>

      <p className={styles.feedback}>
        <strong>共同追问：</strong>活动首先影响谁的收入？哪笔承诺何时兑现？金融菜单是否真的改变选择？报价、信用和政策怎样再返回现金流？哪条判断在当时信息集里仍未知？
      </p>
      <p id="cycle-scope-boundary" className={styles.boundary}>
        本图没有真实周期曲线、政策阈值或危机预测。七个C都是各自独立的合成实验，不组成共同国家路径；未知不是0，定义来源也不提供教学参数。概念依据：
        {sources.map((id) => (
          <a href={`#ref-${id}`} key={id} aria-label={`参考文献 ${id}`}>
            [{id}]
          </a>
        ))}
        。
      </p>
    </figure>
  );
}
