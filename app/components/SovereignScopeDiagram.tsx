import './SovereignScopeDiagram.css';

// 一幅静态语义图；没有国家输入、计算状态或客户端脚本依赖。
const scopeDiagram = (
  <figure
    className="sovereign-scope"
    aria-labelledby="sovereign-scope-title"
    aria-describedby="sovereign-scope-description sovereign-scope-boundary"
  >
    <figcaption className="sovereign-scope-caption">
      <p className="sovereign-scope-kicker">概念连接 · 四道不同的门</p>
      <h3 id="sovereign-scope-title" className="sovereign-scope-heading">
        同一债务存量，不能只过一道门
      </h3>
      <p id="sovereign-scope-description" className="sovereign-scope-description">
        先声明谁欠、量哪种金额、参考日是什么，再分别核付款、资金、合约与支持。下面是检查顺序，不是事件必然依次发生的时间线；一道门通过，不替其他门作保证。
      </p>
    </figcaption>

    <ol className="sovereign-scope-gates" role="list">
      <li className="sovereign-scope-gate">
        <h4 className="sovereign-scope-gate-title">一 · 合同付款日期</h4>
        <p className="sovereign-scope-gate-body">
          列到期本金、利息、付款币种与回售条件，回答“何时要付什么”。总额和原始长期限不能替代今天的剩余期限表。
        </p>
        <p className="sovereign-scope-connection">
          <strong>接到资金门：</strong>日期与币种明确后，才能核同日可用的相应资金。
        </p>
      </li>
      <li className="sovereign-scope-gate">
        <h4 className="sovereign-scope-gate-title">二 · 今日可用资金</h4>
        <p className="sovereign-scope-gate-body">
          扣除受限现金，核资产的权限与交收日，以及另外已落实的今日资金。未来能变现的财富不等于今日现金。
        </p>
        <p className="sovereign-scope-connection">
          <strong>接到融资门：</strong>有缺口时另查融资或支持；今日覆盖也不保证未来可偿付。
        </p>
      </li>
      <li className="sovereign-scope-gate">
        <h4 className="sovereign-scope-gate-title">三 · 再融资与合约重设</h4>
        <p className="sovereign-scope-gate-body">
          核谁承接、以什么条件、何时成交与交收。市场报价可以先变，旧固定票息不会随报价立即重算。
        </p>
        <p className="sovereign-scope-connection">
          <strong>接到支持门：</strong>新条件经到期替换或重设进入费用，再改变财政需要达到的初级余额。
        </p>
      </li>
      <li className="sovereign-scope-gate">
        <h4 className="sovereign-scope-gate-title">四 · 未来财政支持</h4>
        <p className="sovereign-scope-gate-body">
          核可行的初级余额（扣除利息前的财政收支差额）、增长与税基，以及支持的币种、权限和状态条件。不只看平均路径，也不只看当前债率。
        </p>
        <p className="sovereign-scope-connection">
          <strong>反馈到前面的门：</strong>支持预期影响今日承接；融资费用与调整又改变未来支持。
        </p>
      </li>
    </ol>

    <p className="sovereign-scope-feedback">
      <strong>持有人与反馈：</strong>对支持的判断影响融资条件；费用进入预算，调整再改变国内生产总值（GDP）与税基，成为下一轮判断的输入。方向和强度都需要条件与证据。
    </p>
    <p id="sovereign-scope-boundary" className="sovereign-scope-boundary">
      机制依据：[1][2][3][6]。本图是概念地图，不用真实数据、通用安全阈值或默认违约概率；七个C实验各有独立合成设定，不是同一国家的共同轨迹。
    </p>
  </figure>
);

export function SovereignScopeDiagram() {
  return scopeDiagram;
}

export default SovereignScopeDiagram;
