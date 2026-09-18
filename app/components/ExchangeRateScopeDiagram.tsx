import styles from './exchangeRateScopeDiagram.module.css';

const diagramSources = [1, 2, 3, 4, 6, 8] as const;

// 单幅原生HTML机制图；无客户端状态、观测图、真实参数或国家轨迹。
export function ExchangeRateScopeDiagram() {
  return (
    <figure
      className={styles.scope}
      aria-labelledby="exchange-rate-scope-title"
      aria-describedby="exchange-rate-scope-description exchange-rate-scope-boundary"
    >
      <figcaption className={styles.caption}>
        <p className={styles.kicker}>概念连接 · 四种对象，一条反馈主线</p>
        <h3 id="exchange-rate-scope-title" className={styles.heading}>
          先分清哪种支付，再解释谁为什么重新报价
        </h3>
        <p id="exchange-rate-scope-description" className={styles.description}>
          报价连接不同币种的有日期索赔权。下面分别核收益条件、主体暴露与执行约束，不是四个必然依次发生的事件；等式成立也不能替每条现实箭头提供证据。
        </p>
      </figcaption>

      <ol className={styles.cards} role="list">
        <li className={styles.card}>
          <h4>一 · 币种、报价与日期</h4>
          <p>
            S为本币／一单位外币；上涨表示本币贬值。先核支付币、合同金额与交收日，分别保留现货、远期和未来现货。
          </p>
          <p className={styles.connection}>
            <strong>接到收益：</strong>只有币种、投入与支付日期对齐，才能比较两条到期路线。
          </p>
        </li>
        <li className={styles.card}>
          <h4>二 · 合约与预期收益</h4>
          <p>
            远期覆盖路线在理想条件下核无套利；未对冲路线按未来状态核预期收益、风险与误差，不能把两者换名。
          </p>
          <p className={styles.connection}>
            <strong>接到持有：</strong>期限、风险、套保费用和权限不同，同一个利差不决定所有主体的选择。
          </p>
        </li>
        <li className={styles.card}>
          <h4>三 · 贸易与外币资产负债表</h4>
          <p>
            同一次换汇变化经收入、进口付款、资产与债务进入不同主体。自然对冲、合同计价和付款日期决定净暴露。
          </p>
          <p className={styles.connection}>
            <strong>接到交易：</strong>给定现金或账面权益变化可能引出套保、融资和需求调整；完整利润、方向与强度仍需证据。
          </p>
        </li>
        <li className={styles.card}>
          <h4>四 · 执行报价与下一轮反馈</h4>
          <p>
            持有和套保意愿经可成交买卖价、信用、抵押品、流动性与承载能力进入市场，报价也可能先反映未来流量预期。
          </p>
          <p className={styles.connection}>
            <strong>反馈到前面：</strong>新价改变重估、资金与预期；对账或先后次序本身不识别因果。
          </p>
        </li>
      </ol>

      <p className={styles.feedback}>
        <strong>三类连接分别核：</strong>covered等式依赖无套利的合约和执行条件；未对冲等式依赖明示的条件预期模型；真实持有、成交、价格及产出箭头仍待识别。价格篮子另核定义：本课qIndex上升约定实际贬值，BIS有效汇率指数上升表示升值。
      </p>
      <p id="exchange-rate-scope-boundary" className={styles.boundary}>
        本图没有真实数据、校准参数或现货预测。七个C各有独立SYN设定，不组成共同国家轨迹。机制与方向依据：
        {diagramSources.map((id) => (
          <a key={id} href={`#ref-${id}`} aria-label={`参考文献 ${id}`}>
            [{id}]
          </a>
        ))}
        。
      </p>
    </figure>
  );
}

export default ExchangeRateScopeDiagram;
