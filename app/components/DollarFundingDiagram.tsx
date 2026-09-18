import styles from './dollarFunding.module.css';

export default function DollarFundingDiagram() {
  return <figure className={styles.systemMap} aria-labelledby="dollar-funding-map-title dollar-funding-map-caption">
    <svg viewBox="0 0 980 470" role="img" aria-labelledby="dollar-funding-map-title dollar-funding-map-desc">
      <title id="dollar-funding-map-title">全球美元融资的实体、私人路线、市场反馈与官方后备</title>
      <desc id="dollar-funding-map-desc">左侧是具体法律实体及其到期现金流；中间是私人融资、抵押、外汇互换、内部转移和资产出售；右侧是价格、数量、准入和资产负债表反馈。下方把主权swap line、FIMA官方账户repo和本地onward三层分开。</desc>
      <defs>
        <marker id="df-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#326d73" /></marker>
        <style>{`.df-box{fill:#fff;stroke:#4e858a;stroke-width:1.5}.df-official{fill:#e9f2ff;stroke:#526f9b;stroke-width:1.5}.df-pressure{fill:#fff3e8;stroke:#ad6c43;stroke-width:1.5}.df-line{fill:none;stroke:#326d73;stroke-width:2;marker-end:url(#df-arrow)}.df-dash{fill:none;stroke:#75898a;stroke-width:1.5;stroke-dasharray:6 6;marker-end:url(#df-arrow)}.df-label{font:700 15px system-ui;fill:#17373a}.df-small{font:500 12px system-ui;fill:#3d5759}.df-kicker{font:700 11px system-ui;letter-spacing:1.2px;fill:#2f676d}`}</style>
      </defs>
      <rect className="df-box" x="28" y="45" rx="16" width="210" height="126" />
      <text className="df-kicker" x="48" y="69">ENTITY / CURRENCY / HORIZON</text>
      <text className="df-label" x="48" y="96">具体法律实体</text>
      <text className="df-small" x="48" y="120">C₀ + dated inflows</text>
      <text className="df-small" x="48" y="141">− maturities − margin/draws</text>
      <text className="df-small" x="48" y="160">→ G_pre only</text>

      <rect className="df-box" x="315" y="30" rx="16" width="260" height="176" />
      <text className="df-kicker" x="337" y="55">PRIVATE / INTERNAL ROUTES</text>
      <text className="df-label" x="337" y="83">每条route逐门验证</text>
      <text className="df-small" x="337" y="108">CP / CD / unsecured</text>
      <text className="df-small" x="337" y="130">repo / sale / collateral</text>
      <text className="df-small" x="337" y="152">FX swap / future USD leg</text>
      <text className="df-small" x="337" y="174">intragroup / legal + time gates</text>
      <text className="df-small" x="337" y="195">status + value date → cash leg</text>

      <rect className="df-pressure" x="660" y="45" rx="16" width="282" height="126" />
      <text className="df-kicker" x="682" y="69">PRICE × QUANTITY × ACCESS</text>
      <text className="df-label" x="682" y="96">市场与资产负债表反馈</text>
      <text className="df-small" x="682" y="120">basis / repo / bid–ask / tenor</text>
      <text className="df-small" x="682" y="141">dealer capacity / margin / haircut</text>
      <text className="df-small" x="682" y="160">sale → price ↓ → capacity ↓</text>

      <path className="df-line" d="M238 106H315" />
      <path className="df-line" d="M575 106H660" />
      <path className="df-line" d="M802 171C800 226 545 242 470 205" />
      <path className="df-dash" d="M730 171C636 256 242 250 150 171" />

      <text className="df-small" x="248" y="94">funding attempt</text>
      <text className="df-small" x="581" y="94">orders / balance sheet</text>
      <text className="df-small" x="535" y="233">feedback to routes</text>
      <text className="df-small" x="268" y="267">asset prices / margin return to entity</text>

      <rect className="df-official" x="30" y="315" rx="16" width="260" height="105" />
      <text className="df-kicker" x="50" y="341">LAYER A · SOVEREIGN SWAP</text>
      <text className="df-label" x="50" y="367">Fed ↔ foreign central bank</text>
      <text className="df-small" x="50" y="391">USD ↔ foreign currency; reversal legs</text>
      <text className="df-small" x="50" y="410">不是私人银行receipt</text>

      <rect className="df-official" x="360" y="315" rx="16" width="260" height="105" />
      <text className="df-kicker" x="380" y="341">LAYER B · FIMA REPO</text>
      <text className="df-label" x="380" y="367">SOMA ↔ approved holder</text>
      <text className="df-small" x="380" y="391">Treasury collateral; O/N or 7-day</text>
      <text className="df-small" x="380" y="410">holder ledger only</text>

      <rect className="df-official" x="690" y="315" rx="16" width="252" height="105" />
      <text className="df-kicker" x="710" y="341">LAYER C · LOCAL ONWARD</text>
      <text className="df-label" x="710" y="367">local allocator ↔ recipient</text>
      <text className="df-small" x="710" y="391">独立eligibility / award / collateral</text>
      <text className="df-small" x="710" y="410">不是A或B自动结果</text>

      <path className="df-dash" d="M290 366H360" />
      <path className="df-dash" d="M620 366H690" />
      <path className="df-line" d="M816 315C812 255 650 243 553 205" />
      <text className="df-small" x="302" y="354">may fund, not automatic</text>
      <text className="df-small" x="631" y="354">optional, new transaction</text>
    </svg>
    <figcaption id="dollar-funding-map-caption"><b>读图顺序：</b>先锁定左侧的主体与H，再逐条验证中间route；右侧价格与资产负债表变化会反馈回来。下方三层只说明本课涉及的官方结构，并不声称穷尽全球安排。虚线表示“可能成为上游来源”，不是自动cash receipt。</figcaption>
  </figure>;
}
