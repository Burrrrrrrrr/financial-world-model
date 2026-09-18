const stages = [
  {
    id: '01',
    title: '冻结借款人和权利边界',
    body: '先确定法律实体、资产所有权、负债范围、币种、估值日、合同测试日与当时可得数据版本。',
    guard: '集团资产、承租资产和未来收入不会因“经济上相关”就自动成为本实体可质押财产。',
  },
  {
    id: '02',
    title: '把冲击写入资产负债表',
    body: '资产价格、现金流、利率、汇率或损失先改变资产、负债、净值、流动性和偿债支出。',
    guard: '会计重估、现金交易、汇兑和其他数量变化必须分账；净值不是现金余额。',
  },
  {
    id: '03',
    title: '重算可质押与偿债容量',
    body: '所有权、折扣、advance rate、优先债权和执行成本形成资产型容量；收益、ICR与DSCR形成现金流型容量。',
    guard: 'book、market、appraisal、liquidation与recovery value不可互换，多项容量统一后取最小而不是相加。',
  },
  {
    id: '04',
    title: '形成融资价格与数量分叉',
    body: '净值下降可能提高外部融资溢价，也可能让额度、担保、期限或审批约束先绑定。',
    guard: '理论EFP不等于贷款spread；银行自身资金、资本与风险容忍度分别由3.10和3.12负责。',
  },
  {
    id: '05',
    title: '企业或家庭重新配置资源',
    body: '主体依次使用现金、替代融资、削减库存与营运资本、延后投资、压低消费或就业，并可能主动去杠杆。',
    guard: '一项贷款减少不等于总外部融资等量减少；内部现金缓冲也不是免费、无限或没有未来代价。',
  },
  {
    id: '06',
    title: '实体结果反馈下一轮状态',
    body: '支出下降影响销售、收入和资产价格，继而进一步改变净值、覆盖率与可质押价值，形成金融加速器。',
    guard: '这条闭环放大并传播冲击，却不自动识别初始冲击，也不等于margin spiral或fire sale。',
  },
  {
    id: '07',
    title: '逐层识别而非跳到因果',
    body: '分别估计资产价到抵押价值、抵押价值到融资、融资到真实支出，以及完整链条的局部支持集。',
    guard: '地方需求、生产率、银行供给、所有权选择、评估滞后与样本退出都可能制造同向相关。',
  },
] as const;

const branches = [
  {
    label: '企业资产型路径',
    value: '设备 / 库存 / 应收 / 不动产 → borrowing base',
    note: '资产专用性、可再部署性、登记顺位和既有留置权决定市场价值有多少能成为债权人的可回收价值。',
  },
  {
    label: '企业收益型路径',
    value: 'EBITDA / cash flow → leverage, ICR, DSCR',
    note: '稳定经营现金流可以成为主约束；这条路径在许多企业债务中比实体抵押品更接近合同现实。',
  },
  {
    label: '家庭路径',
    value: '住房净值 + 收入 + 偿债负担 → 借款与消费',
    note: '住房制度、再融资选项、固定/浮息结构和高低MPC异质性由3.16继续展开，本节只交付通用借款人状态。',
  },
] as const;

export default function BalanceSheetCollateralTransmissionChart() {
  return (
    <figure className="growth-transmission-chart balance-sheet-collateral-transmission-chart" aria-labelledby="balance-sheet-collateral-transmission-title">
      <div className="growth-transmission-head"><div><span>BORROWER-SIDE CHANNEL MAP</span><h3 id="balance-sheet-collateral-transmission-title">从资产与现金流冲击到可质押价值、融资条件、真实支出与下一轮净值</h3></div></div>
      <ol className="growth-transmission-map">
        {stages.map((stage) => <li className="growth-stage" key={stage.id}><span>{stage.id}</span><h4>{stage.title}</h4><p>{stage.body}</p><em>护栏：{stage.guard}</em></li>)}
      </ol>
      <div className="holding-return-chain" role="group" aria-label="借款人资产负债表渠道的三条并行路径">
        {branches.map((branch, index) => <article className={index === branches.length - 1 ? 'result' : undefined} key={branch.label}><span>{branch.label}</span><b>{branch.value}</b><p>{branch.note}</p></article>)}
      </div>
      <figcaption>这是一张状态与证据路线图，不是任何经济体的估计方程。核心顺序是“先冻结权利与时钟，再重算净值和可借容量，最后检验融资是否真的改变支出”；任何一步缺失，都只能报告局部相关或描述性状态。</figcaption>
    </figure>
  );
}
