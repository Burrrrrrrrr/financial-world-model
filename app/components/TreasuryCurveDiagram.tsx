import { treasuryCurveThesis } from '../lessons/treasuryCurveStudy';
import styles from './treasuryCurve.module.css';

const chain = [
  {
    number: 'O',
    title: 'Treasury曲线对象',
    body: '起点不是一个headline 10Y yield，而是已声明币种、曲线家族、工具集合、报价坐标、复利、日计数、估值时点与抵押制度的美元期限价格对象。',
    gate: '对象护照不全，不进入后续传导。',
  },
  {
    number: 'G1',
    title: '曲线身份门',
    body: '先区分Treasury CMT par、Treasury zero、单券YTM、SOFR/OIS、repo与swap曲线；它们可相互影响，但不因都以“利率”报价而成为同一对象。',
    gate: '曲线家族、rate coordinate或合同制度不匹配时STOP。',
  },
  {
    number: 'G2',
    title: '现金流与期限门',
    body: '把每笔现金流交给同日、同币种、同口径的discount factor，再用duration、PVBP与key-rate vector表达对不同节点的暴露。',
    gate: '一个par point不能代替完整zero curve；总DV01为0也不是节点风险为0。',
  },
  {
    number: 'G3',
    title: '资产自身spread门',
    body: '公司债、股票、MBS或商品除了共同Treasury坐标，还有自己的现金流、default、ERP、optionality、liquidity与convenience楔子。',
    gate: '原始yield spread不能在未匹配其他楔子时直接命名为信用补偿。',
  },
  {
    number: 'G4',
    title: '融资与中介门',
    body: 'Repo rate、haircut、margin、可用抵押品、basis与dealer capacity决定相对价值能否被交易和承接；约束收紧时，价差可在去杠杆中放大。',
    gate: '高volume不等于低交易成本；无套利约束不等于无摩擦即时收敛。',
  },
  {
    number: 'G5',
    title: '币种与套保门',
    body: '外国投资者要分开美元资产回报、未套保本币回报与套保后本币回报；spot方向、hedge ratio、forward/basis成本和roll都可改变净结果。',
    gate: '本币、报价方向或关键hedge输入未知时输出null，不默认0%或100%套保。',
  },
  {
    number: 'G6',
    title: '本地制度门',
    body: '汇率制度、本地央行反应、美元负债、外部融资、市场深度与风险承受会把同一美国driver拆成不同的expected-short-rate、term-premium与FX/funding反应。',
    gate: '未识别driver或本地状态时不设pass-through=1，也不用yield sign强制命名。',
  },
  {
    number: 'R',
    title: '本地资产结果',
    body: '最终价格、本币回报、本地yield、FX压力与流动性是现金流、Treasury节点、资产风险溢价、融资楔子和制度反应的净结果，不由单一yield符号决定。',
    gate: '净值为0可来自多个非零贡献抵消；方向未知是合法输出。',
  },
] as const;

const inequalityNotes = [
  '共同参考坐标可影响报价和对冲，却不会覆盖每份合同的抵押与折现规则。',
  '同号变动可由增长信息、政策紧缩、期限溢价、供给、便利或融资压力产生。',
  '传导系数依driver和本地状态而变；外国消息与配置也能反向进入Treasury term premium。',
] as const;

export default function TreasuryCurveDiagram() {
  return <figure className={styles.diagram} aria-labelledby="treasury-curve-diagram-title">
    <figcaption className={styles.diagramCaption}>
      <p className={styles.diagramKicker}>TREASURY CURVE OBJECT → SIX TRANSMISSION GATES → LOCAL-ASSET OUTCOME ⇄ FEEDBACK</p>
      <h3 id="treasury-curve-diagram-title">美债曲线是全球传导枢纽，但不是一个会无摩擦复制到所有资产的“世界利率”。</h3>
      <p>{treasuryCurveThesis.exitSentence}下图是研究顺序：任一门都可以截断、放大或反转传导，八张卡不是一条自动发生的历史路径。</p>
    </figcaption>

    <div className={styles.diagramCards} aria-label="Treasury曲线对象、六个传导门与本地资产结果">
      {chain.map(stage => <article className={styles.diagramCard} key={stage.number}>
        <span>{stage.number}</span>
        <h4>{stage.title}</h4>
        <p>{stage.body}</p>
        <p className={styles.diagramGate}><b>检查门：</b>{stage.gate}</p>
      </article>)}
    </div>

    <div className={styles.feedbackPair} aria-label="Treasury与全球资产的双向反馈">
      <article><span>正向传导</span><p>Treasury对象的节点与融资状态经六道门改写本地现金流估值、要求回报、套保成本、融资条件与政策反应。</p></article>
      <article><span>反向反馈</span><p>本地政策、外国消息、资产跌价、FX套保、margin与跨境重平衡又会返回Treasury需求、term premium、repo/basis与dealer capacity，开启下一轮。</p></article>
    </div>

    <div className={styles.diagramCards} aria-label="三条不等式">
      {treasuryCurveThesis.inequalities.map((inequality, index) => <article className={styles.diagramCard} key={inequality}>
        <span>≠{index + 1}</span>
        <h4>{inequality}</h4>
        <p>{inequalityNotes[index]}</p>
      </article>)}
    </div>
  </figure>;
}
