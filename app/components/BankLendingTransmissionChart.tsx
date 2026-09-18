const stages = [
  {
    id: '01',
    title: '冻结政策与银行初始状态',
    body: '读取政策实施结果、收益率曲线、银行融资结构及资本与流动性余量；每个输入都保留币种、期限、法人和观察时点。',
    guard: '政策决定、市场利率变化与外生政策冲击不是同一个对象。',
  },
  {
    id: '02',
    title: '重估边际融资与约束成本',
    body: '存款 beta、存款流出、批发融资、对冲、资本、流动性和集中度共同改变下一单位贷款的边际成本与可用容量。',
    guard: '平均融资成本不能替代边际融资成本，监管比率也不能直接相加。',
  },
  {
    id: '03',
    title: '形成全口径贷款要约',
    body: '银行把基准曲线、融资楔子、冻结的预期损失、运营成本、资本与流动性影子成本和竞争加价写入利率、费用与合同条款。',
    guard: '本节冻结借款人风险评价与风险容忍度；二者的内生变化留给 3.11 与 3.12。',
  },
  {
    id: '04',
    title: '在多个边际上调整供给',
    body: '银行可以同时改变报价、审批概率、额度、期限、抵押品与契约，而不是只沿一条利率轴移动。',
    guard: '观察到贷款利率上升，并不足以证明数量变化来自银行供给。',
  },
  {
    id: '05',
    title: '重新匹配银行与借款人',
    body: '相同申请在融资结构和容量不同的银行得到不同要约；银行也会在客户、贷款类别与证券之间重新配置资产。',
    guard: '匹配形成、关系终止与申请选择都会改变可观察样本。',
  },
  {
    id: '06',
    title: '检查外部融资替代',
    body: '原贷款行收缩后，其他银行、债券和非银行融资可能承接部分缺口；贷款对变化必须继续聚合到借款人总融资。',
    guard: '单个银行—企业贷款对收缩，不等于借款人总融资等量收缩。',
  },
  {
    id: '07',
    title: '把实体结果与识别分开',
    body: '只有在需求、匹配、替代与共同冲击得到可辩护处理后，才讨论投资、就业或产出的响应及其时滞。',
    guard: '会计链和条件情景只生成候选机制，不自动获得因果方向或预测能力。',
  },
] as const;

const branches = [
  {
    label: '银行负反馈',
    value: '流出与约束收紧 → 报价和额度再调整',
    note: '较贵的替代融资或更少的资本余量会反馈到下一轮要约；方向和强度取决于银行初始状态。',
  },
  {
    label: '借款人替代路径',
    value: '原行收缩 → 其他银行 / 债券 / 非银',
    note: '替代可以缓冲总融资，也可能因关系信息不可移植、市场准入或时间成本而不完全。',
  },
  {
    label: '研究输出',
    value: 'pair → borrower total → real outcome',
    note: '三个 estimand 分别报告；前一层的显著结果不能直接改名为后一层效应。',
  },
] as const;

export default function BankLendingTransmissionChart() {
  return (
    <figure className="growth-transmission-chart bank-lending-transmission-chart" aria-labelledby="bank-lending-transmission-title">
      <div className="growth-transmission-head">
        <div>
          <span>SUPPLY-CHANNEL MAP</span>
          <h3 id="bank-lending-transmission-title">从政策实施到银行要约、融资替代与实体结果：每一步都保留可证伪边界</h3>
        </div>
      </div>
      <ol className="growth-transmission-map">
        {stages.map((stage) => (
          <li className="growth-stage" key={stage.id}>
            <span>{stage.id}</span>
            <h4>{stage.title}</h4>
            <p>{stage.body}</p>
            <em>护栏：{stage.guard}</em>
          </li>
        ))}
      </ol>
      <div className="holding-return-chain" role="group" aria-label="银行贷款渠道的反馈与替代路径">
        {branches.map((branch, index) => (
          <article className={index === branches.length - 1 ? 'result' : undefined} key={branch.label}>
            <span>{branch.label}</span>
            <b>{branch.value}</b>
            <p>{branch.note}</p>
          </article>
        ))}
      </div>
      <figcaption>这张图是一张机制与测量路线图，而不是结构方程：只有政策暴露先影响银行边际成本或容量、银行再改变供给、借款人又不能完全替代时，才形成独立于一般利率渠道的银行贷款渠道候选。</figcaption>
    </figure>
  );
}
