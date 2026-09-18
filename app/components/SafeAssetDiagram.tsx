import styles from './safeAsset.module.css';

const stages = [
  {
    number: '01',
    title: '先分清名称与债权',
    body: '货币是合同与记账单位；存款、国债、SDR头寸和货币黄金是不同资产对象。相同币种不等于相同债务人、现金流或法律权利。',
    gate: '先写主体、工具、债务人、币种、期限与可动用条件；对象不清，立即停止比较。',
  },
  {
    number: '02',
    title: '再说明谁需要什么服务',
    body: '官方部门关心干预、外部支付与紧急流动性；私人部门还可能关心结算、监管、抵押、做市库存与价值保存。需求必须绑定用途和状态。',
    gate: '官方储备需求不是全部安全资产需求；同一主体在平时与压力期也可能使用不同服务。',
  },
  {
    number: '03',
    title: '把服务映射成价格楔子',
    body: '当现金流、信用、期限、币种、税与套保风险足够匹配时，额外的安全、流动与货币服务可让资产接受较低金融收益率，形成候选便利收益。',
    gate: '未匹配的原始利差是风险与服务的混合量；它不能直接命名为便利收益。',
  },
  {
    number: '04',
    title: '从毛存量筛到有效容量',
    body: '毛发行量还要经过可交易、可及时取得、设施合格、未被锁定、haircut与市场承接等漏斗，才成为特定主体在特定状态下可调用的容量。',
    gate: '债务余额、成交量、窄点差或“可作抵押”任何一个指标都不能单独代表有效安全供给。',
  },
  {
    number: '05',
    title: '同时追踪两条供给反馈',
    body: '适度增加float可改善基准、价格发现与深度；但当财政可信度、展期能力或中介资产负债表受压时，每单位债权提供的安全服务可能下降。',
    gate: '供给关系可以非单调；“越多越安全”和“越多越危险”都不是无条件结论。',
  },
  {
    number: '06',
    title: '最后才讨论国际张力与识别',
    body: '全球希望中心发行足够可用负债，同时要求其持续可信；统计上，币种总市场价值又无法单独识别某种工具的数量需求。',
    gate: 'Triffin-type tension不是经常账户赤字恒等式；COFER币种份额也不是Treasury净买入。',
  },
] as const;

export default function SafeAssetDiagram() {
  return (
    <figure className={styles.diagram} aria-labelledby="safe-asset-diagram-title">
      <figcaption className={styles.diagramCaption}>
        <p className={styles.diagramKicker}>OBJECT → USER &amp; PURPOSE → SERVICE PRICE → EFFECTIVE CAPACITY → TWO-SIDED FEEDBACK → IDENTIFICATION</p>
        <h3 id="safe-asset-diagram-title">全球需要的不是一个抽象的“美元标签”，而是一组在指定用途与坏状态中仍可调用的债权服务。</h3>
        <p>六步是推理顺序，不是资产排行榜。每一步都可能失败：名称可能不等于工具，平时流动可能不等于压力期可动用，毛余额也可能无法转化为即时现金容量。</p>
      </figcaption>
      <div className={styles.diagramCards}>
        {stages.map(stage => <article className={styles.diagramCard} key={stage.number}>
          <span>{stage.number}</span>
          <h4>{stage.title}</h4>
          <p>{stage.body}</p>
          <p className={styles.diagramGate}><b>检查门：</b>{stage.gate}</p>
        </article>)}
      </div>
      <div className={styles.feedbackPair}>
        <article><span>增强回路</span><p>更多可用float → 更连续的报价与价格发现 → 更低退出/融资摩擦 → 更广使用 → 更强基准与抵押网络。</p></article>
        <article><span>侵蚀回路</span><p>发行与杠杆继续上升 → 财政、展期或做市承接约束收紧 → haircut／价格冲击／可信度风险上升 → 有效安全服务下降。</p></article>
      </div>
    </figure>
  );
}
