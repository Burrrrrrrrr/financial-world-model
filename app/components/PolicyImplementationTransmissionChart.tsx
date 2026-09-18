const stages = [
  {
    step: '01',
    eyebrow: 'DECISION',
    title: '3.05 交付条件政策决定',
    body: '保留公告、生效日、立场工具、操作目标的点／区间／附近类型，以及资产负债表与沟通指令。',
    observed: 'actionVector · operatingTarget · targetType · timestamps',
    cannot: '不能只凭 headline rate 推出实施条款。',
  },
  {
    step: '02',
    eyebrow: 'COMPILE',
    title: '实施部门编译一致的指令向量',
    body: '把决定翻译为管理利率、准备金供给、操作期限、便利条款、准入、抵押品、haircut 与结算时钟。',
    observed: 'administeredTerms · reserveRemunerationTerms · facilityTerms · balanceSheetInstruction · calendarState',
    cannot: '技术调整不自动等于新的宏观立场。',
  },
  {
    step: '03',
    eyebrow: 'OPTIONS',
    title: '主体获得不同的可执行外部选项',
    body: '账户资格、抵押品、资产负债表成本和操作截止时间决定每家机构真正能获得的净存放或融资价格。',
    observed: 'facilityAccess · eligibilityState · collateralState',
    cannot: '牌价不是所有交易者都能无成本取得的硬界。',
  },
  {
    step: '04',
    eyebrow: 'VALUE',
    title: '异质银行形成边际准备金估值',
    body: '支付、尾部流出、监管、相对回报、网络位置和日历共同决定下一单位准备金对该机构的价值。',
    observed: 'reserveQuantity · reserveDistributionState · paymentOutflowState · reserveDemandRegime',
    cannot: '系统总量不能替代机构分布与可贷余额。',
  },
  {
    step: '05',
    eyebrow: 'TRADE',
    title: '隔夜交易生成价格分布与 benchmark',
    body: '借贷双方在无担保或 repo 市场成交；统计机构再按 median、trimmed mean 或 weighted average 形成有效基准。',
    observed: 'overnightContractType · effectiveOvernightRate · marketVolumes · rateDispersion · benchmarkMethod · methodologyVersion',
    cannot: 'benchmark 中心不是市场全部交易，也不是央行牌价。',
  },
  {
    step: '06',
    eyebrow: 'DIAGNOSE',
    title: '控制误差触发有条件的技术响应',
    body: '央行把同对象有效率与点／区间／附近目标比较，再联合数量、分布、便利、抵押品与日历判断是否调整。',
    observed: 'targetError · facilityUsage · reserveManagementPurpose · technicalAction · technicalActionSurprise · implementationOutcomeSurprise',
    cannot: '偏离本身不能识别 scarcity 或 implementation shock。',
  },
];

export default function PolicyImplementationTransmissionChart() {
  return (
    <figure className="growth-transmission-chart implementation-transmission-chart" aria-labelledby="implementation-transmission-title implementation-transmission-caption">
      <div className="growth-transmission-head">
        <div>
          <span>DECISION → TERMS → MARGINAL VALUE → TRADES → BENCHMARK → FEEDBACK</span>
          <h3 id="implementation-transmission-title">央行不能直接“写出”每笔隔夜成交价；它先改变可交易选项，再由异质主体把制度价格传入市场</h3>
        </div>
        <div className="growth-transmission-legend" aria-label="图例" role="group">
          <span className="main-path">可观察实施主链</span>
          <span className="break-path">每层的禁止推论</span>
        </div>
      </div>

      <ol className="implementation-stage-grid" aria-label="六阶段政策实施链">
        {stages.map((stage) => (
          <li key={stage.step}>
            <article className="growth-stage">
              <div><span>{stage.step}</span><small>{stage.eyebrow}</small></div>
              <h4>{stage.title}</h4>
              <p>{stage.body}</p>
              <details>
                <summary>可观测字段与边界</summary>
                <p><b>观察：</b><code>{stage.observed}</code></p>
                <p><b>不能推出：</b>{stage.cannot}</p>
              </details>
            </article>
          </li>
        ))}
      </ol>

      <div className="growth-feedback-band">
        <span>技术反馈不是一次性修补</span>
        <p>需求会随支付、存款、监管、风险与制度学习移动；供给会受现金、政府账户、资产到期和操作取用改变。央行据此调整管理利率位置、准备金数量、操作期限、便利或准入，新的条款又改变下一轮交易行为。</p>
      </div>
      <figcaption id="implementation-transmission-caption">实线主链经过“主体可执行外部选项”和“边际准备金估值”，故意不画成“央行公告 → 市场率”的直接箭头。只有先冻结币种、合约、交易人、结算场所、统计方法和时间，才可计算实施误差。</figcaption>
    </figure>
  );
}
