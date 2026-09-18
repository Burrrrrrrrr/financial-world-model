const stages = [
  {
    id: '01',
    title: '先冻结主体与请求权',
    body: '指定法律实体、合并边界、币种、持有人部门、计量口径和期初账本，再判断某项负债是否属于所选货币口径。',
    guard: '“贷款”“存款”“准备金”只是名称；缺少发行人和持有人护照时不得聚合。',
  },
  {
    id: '02',
    title: '把信用生命周期拆开',
    body: '审批、承诺、提款、付款、清算和最终结算各有事件与时钟；只有提款才生成表内贷款本金。',
    guard: '已批准额度不是贷款余额，支付指令也不是最终结算。',
  },
  {
    id: '03',
    title: '闭合双方账本',
    body: '每项资产都对应另一主体的负债；同行贷款先生成贷款与存款，跨行支付再迁移存款和准备金。',
    guard: '体系准备金总量不变，不代表付款行不需要结算流动性。',
  },
  {
    id: '04',
    title: '分开交易与估值事件',
    body: '本金、利息、费用、拨备、核销、证券交易、税收和央行操作分别改变不同账本字段。',
    guard: '净贷款下降既可能是偿还，也可能是出售、核销或重估，不能只看期末差额。',
  },
  {
    id: '05',
    title: '在正确边界上合并',
    body: '单家银行、集团和存款类机构体系分别回答支付能力、法律可转移性与宏观货币对应项。',
    guard: '在体系层被抵销的准备金与同业头寸，仍可能约束单家银行。',
  },
  {
    id: '06',
    title: '最后叠加行为与制度约束',
    body: '合格需求、预期净收益、资本、杠杆、流动性、稳定融资、集中度与操作准备共同界定可行信用。',
    guard: '货币内生不等于贷款无限；央行流动性也不等于资本或有序处置。',
  },
] as const;

export default function BankCreditTransmissionChart() {
  return (
    <figure className="growth-transmission-chart bank-credit-transmission-chart" aria-labelledby="bank-credit-transmission-title">
      <div className="growth-transmission-head">
        <div>
          <span>EVENT-LEDGER MAP</span>
          <h3 id="bank-credit-transmission-title">从信用决定到货币、支付与银行约束：先闭合账本，再解释行为</h3>
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
      <figcaption>这张图故意把会计恒等式放在行为解释之前：若主体、时钟和请求权没有闭合，后续关于“银行先找存款”或“准备金自动倍增”的因果叙事都无法被检验。</figcaption>
    </figure>
  );
}
