import './CapitalFlowDiagram.css';

const scopeSources = [1, 2, 4, 6, 7, 8] as const;

// 作者原生HTML概念图；没有客户端状态、观测数据或共同国家数值轨迹。
export default function CapitalFlowScopeDiagram() {
  return (
    <figure
      className="capital-flow-scope"
      aria-labelledby="capital-flow-scope-title"
      aria-describedby="capital-flow-scope-description capital-flow-scope-boundary"
    >
      <figcaption className="capital-flow-scope__caption">
        <p className="capital-flow-scope__kicker">概念连接 · 先定位入口，再追实际选择</p>
        <h3 id="capital-flow-scope-title">同一个资金总额，进入不同主体就面对不同的门</h3>
        <p id="capital-flow-scope-description">
          下面四卡分别解释资金或持有关系怎样进入具体资产负债表，再连接有日期的融资、资本、需求与现金菜单。它们不是四个必然依次发生的步骤；只有相应合同、主体选择和执行证据齐全，才可继续连接价格与信用反馈。
        </p>
      </figcaption>

      <ol className="capital-flow-scope__cards" role="list">
        <li className="capital-flow-scope__card">
          <h4>一 · 银行负债入口</h4>
          <p>
            银行借入外币并取得对应资产，同时新增还款负债，不因借款自动增加权益。新的融资条件可进入贷款菜单，但资本占用、合格需求和风险意愿仍是不同的门。
          </p>
          <p className="capital-flow-scope__connection">
            <strong>有条件地接到信用：</strong>只有银行实际报价、客户接受并通过审批，才形成下一笔贷款；贷款风险与续借条件又可能改变下一轮融资。净外币本金相抵不保证到期现金可用。
          </p>
        </li>
        <li className="capital-flow-scope__card">
          <h4>二 · 证券所有权入口</h4>
          <p>
            同一非居民付款人买新证券时，款项归发行人；买居民旧证券时，款项先归旧卖方。改变的是收款者和新增索赔权，不是把全部证券付款都变成发行人的新投资资金。
          </p>
          <p className="capital-flow-scope__connection">
            <strong>有条件地接到配置：</strong>发行人支出、旧卖方还债或再投资，要分别追踪。若付款人用窗口前已到岸存款结算，证券腿与存款腿须对账，不能重算成窗口内新净流入；后续订单才可连接成交与价格。
          </p>
        </li>
        <li className="capital-flow-scope__card">
          <h4>三 · 央行自定操作入口</h4>
          <p>
            只有明确给定央行购汇时，外国资产和银行准备金才按该操作增加；另行出售国内债权可以吸收准备金。先购后售是两笔动作，资本流交易本身不自动替央行下指令。
          </p>
          <p className="capital-flow-scope__connection">
            <strong>有条件地接到政策反馈：</strong>基础数量净增为零，仍可能留下资产组合、期限和利息收付变化。还需交易价格、银行反应与政策权限，才能判断利率、信用和公共费用，不能先判“全部无效”或“免费”。
          </p>
        </li>
        <li className="capital-flow-scope__card">
          <h4>四 · 到期／基金现金反馈</h4>
          <p>
            付款日看不重叠的可用外币、确认收款与可执行兑换；基金现金需求另看已有现金、给定候选价格和买方容量。长期净财富、全库存估值或赎回请求，都不能替代该日可交付现金。
          </p>
          <p className="capital-flow-scope__connection">
            <strong>有条件地接到下一轮：</strong>实际兑换、出售和付款仍须证据；现金缺口可能引出续借、调仓或受限支付，报价和信用再反过来改写菜单。到期实验与基金实验不是同一主体，菜单也不是最终基金净值或已付赎回。
          </p>
        </li>
      </ol>

      <p className="capital-flow-scope__feedback">
        <strong>共同核查顺序：</strong>先核居民边界和交易窗口，再核实际收款者与支付币种，随后列可行菜单、观察真实选择，最后才研究价格与信用如何反馈。账务闭合保证对象没有漏接，不识别现实因果。
      </p>
      <p id="capital-flow-scope-boundary" className="capital-flow-scope__boundary">
        本图无真实数据、政策阈值、预测或法律认证。七个C都是各自独立的合成实验，不组成共同国家轨迹，也不自动相互传数。来源只支持概念和边界，不提供合成参数：
        {scopeSources.map((id) => (
          <a key={id} href={`#ref-${id}`} aria-label={`参考文献 ${id}`}>
            [{id}]
          </a>
        ))}
        。
      </p>
    </figure>
  );
}
