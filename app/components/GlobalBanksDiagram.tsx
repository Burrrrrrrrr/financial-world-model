import styles from './globalBanks.module.css';

export default function GlobalBanksDiagram() {
  return <figure className={styles.systemMap} aria-labelledby="global-banks-map-title global-banks-map-caption">
    <p className={styles.mapScrollHint} id="global-banks-map-scroll-hint"><b>窄屏读图：</b>聚焦图框后用左右方向键横向移动；触摸屏可在图内左右拖动。图中文字保持可读字号，不会压缩成缩略图。</p>
    <div className={styles.mapViewport} role="group" aria-label="完整全球银行机制图，可横向滚动" aria-describedby="global-banks-map-scroll-hint" tabIndex={0}>
    <svg viewBox="0 0 1040 560" role="img" aria-labelledby="global-banks-map-title global-banks-map-desc">
      <title id="global-banks-map-title">全球银行把带身份的冲击转化为目的地信用的完整链条</title>
      <desc id="global-banks-map-desc">上层从母行与集团约束，经分行、子公司和记账办公室，进入直接跨境或当地附属机构贷款；下层显示借款人替代、实体结果和回写母行的反馈。虚线表示统计镜头，不等于现金或信用路线。</desc>
      <defs>
        <marker id="gb-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#225f68" /></marker>
        <marker id="gb-feedback-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#9b603e" /></marker>
        <style>{'.gb-box{fill:#fff;stroke:#4d7e85;stroke-width:1.5}.gb-route{fill:#edf6f5;stroke:#37737b;stroke-width:1.5}.gb-result{fill:#fff4e9;stroke:#a26947;stroke-width:1.5}.gb-lens{fill:#edf1fa;stroke:#65769b;stroke-width:1.5}.gb-line{fill:none;stroke:#225f68;stroke-width:2;marker-end:url(#gb-arrow)}.gb-feedback{fill:none;stroke:#9b603e;stroke-width:2;marker-end:url(#gb-feedback-arrow)}.gb-dash{fill:none;stroke:#65769b;stroke-width:1.6;stroke-dasharray:7 6}.gb-label{font:700 15px system-ui;fill:#15383d}.gb-small{font:500 12px system-ui;fill:#40595c}.gb-kicker{font:700 10px system-ui;letter-spacing:1.1px;fill:#2a6870}'}</style>
      </defs>
      <rect className="gb-box" x="32" y="48" width="210" height="132" rx="18" />
      <text className="gb-kicker" x="52" y="73">HOME / PARENT SHOCK</text>
      <text className="gb-label" x="52" y="101">母行与集团状态</text>
      <text className="gb-small" x="52" y="126">capital · funding · policy</text>
      <text className="gb-small" x="52" y="148">currency · risk limit</text>
      <text className="gb-small" x="52" y="168">先办shock passport</text>
      <rect className="gb-box" x="302" y="32" width="240" height="164" rx="18" />
      <text className="gb-kicker" x="322" y="58">ENTITY / HOME–HOST GATES</text>
      <text className="gb-label" x="322" y="87">母行 · 分行 · 子公司</text>
      <text className="gb-small" x="322" y="113">legal entity / office type</text>
      <text className="gb-small" x="322" y="135">typed upstream state</text>
      <text className="gb-small" x="322" y="157">capital · local rules</text>
      <text className="gb-small" x="322" y="179">不是一个集团钱包</text>
      <rect className="gb-route" x="606" y="28" width="198" height="92" rx="16" />
      <text className="gb-kicker" x="626" y="53">ROUTE A</text>
      <text className="gb-label" x="626" y="80">直接跨境贷款</text>
      <text className="gb-small" x="626" y="102">booking ≠ borrower residence</text>
      <rect className="gb-route" x="606" y="140" width="198" height="92" rx="16" />
      <text className="gb-kicker" x="626" y="165">ROUTE B</text>
      <text className="gb-label" x="626" y="192">当地附属机构贷款</text>
      <text className="gb-small" x="626" y="214">booking = borrower residence</text>
      <rect className="gb-result" x="850" y="70" width="158" height="130" rx="18" />
      <text className="gb-kicker" x="870" y="96">LOAN OFFER</text>
      <text className="gb-label" x="870" y="123">价格 × 数量</text>
      <text className="gb-small" x="870" y="147">期限 · 抵押</text>
      <text className="gb-small" x="870" y="168">契约 · 续作</text>
      <text className="gb-small" x="870" y="188">报价不是成交</text>
      <path className="gb-line" d="M242 114H302" />
      <path className="gb-line" d="M542 90C570 80 580 74 606 74" />
      <path className="gb-line" d="M542 142C570 156 580 184 606 184" />
      <path className="gb-line" d="M804 74C828 78 834 100 850 110" />
      <path className="gb-line" d="M804 184C828 178 834 158 850 150" />
      <rect className="gb-result" x="790" y="302" width="218" height="132" rx="18" />
      <text className="gb-kicker" x="812" y="328">BORROWER / SUBSTITUTION</text>
      <text className="gb-label" x="812" y="356">其他银行 · 债券 · 内部现金</text>
      <text className="gb-small" x="812" y="382">原路线 ≠ all-bank credit</text>
      <text className="gb-small" x="812" y="404">all-bank ≠ all-financing</text>
      <text className="gb-small" x="812" y="424">替代决定最终缺口</text>
      <rect className="gb-box" x="455" y="324" width="250" height="116" rx="18" />
      <text className="gb-kicker" x="476" y="350">HOST OUTCOMES</text>
      <text className="gb-label" x="476" y="378">活动 · 抵押 · 违约 · 拨备</text>
      <text className="gb-small" x="476" y="402">需额外数据与识别才能声称</text>
      <text className="gb-small" x="476" y="423">不同时间尺度不得压平</text>
      <path className="gb-line" d="M924 200V302" />
      <path className="gb-line" d="M790 370H705" />
      <path className="gb-feedback" d="M455 385C320 385 170 330 132 180" />
      <text className="gb-small" x="240" y="365">利润、损失与资本回写母行</text>
      <rect className="gb-lens" x="44" y="470" width="438" height="66" rx="16" />
      <text className="gb-kicker" x="64" y="494">STATISTICAL CAMERA 01 · LBS</text>
      <text className="gb-small" x="64" y="518">residence · unconsolidated · intragroup retained · currency / booking location</text>
      <rect className="gb-lens" x="558" y="470" width="438" height="66" rx="16" />
      <text className="gb-kicker" x="578" y="494">STATISTICAL CAMERA 02 · CBSI / CBSG</text>
      <text className="gb-small" x="578" y="518">nationality · consolidated · intragroup eliminated · country-risk allocation</text>
      <path className="gb-dash" d="M265 470V214" />
      <path className="gb-dash" d="M778 470V246" />
    </svg>
    </div>
    <figcaption id="global-banks-map-caption"><b>读图顺序：</b>先确认冲击与实体，再区分两条放贷路线，随后观察贷款要约和借款人替代，最后才进入实体结果与母行反馈。下方两台统计相机只决定“看见什么”，不自动证明现金来源、管理意图或因果。</figcaption>
  </figure>;
}
