import styles from './globalCycle.module.css';

export default function GlobalCycleDiagram() {
  return <figure className={styles.systemMap} aria-labelledby="global-cycle-map-title global-cycle-map-caption">
    <p className={styles.mapHint}>复杂图 · 在窄屏可横向滚动；下方图注提供完整文字等价物。</p>
    <div className={styles.mapScroll} role="region" aria-label="全球金融周期系统图，可横向滚动" tabIndex={0}>
    <svg viewBox="0 0 1120 560" role="img" aria-labelledby="global-cycle-map-title global-cycle-map-desc">
      <title id="global-cycle-map-title">全球金融周期的测量、驱动、渠道、本地过滤与反馈地图</title>
      <desc id="global-cycle-map-desc">左侧先从有护照的跨国跨资产观测估计共同成分和本地残差；共同成分是测量节点，不是驱动。中间列出美国政策、美国增长、全球风险承载和其他中心等候选驱动，再经美债、美元、全球银行和非银渠道传导。右侧本地过滤器把同一输入映射为异质结果，底部反馈返回中介、政策和下一期观测。</desc>
      <defs>
        <marker id="gfc-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#356f9d" /></marker>
        <marker id="gfc-dash-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#92714f" /></marker>
        <style>{`.gfc-box{fill:#fff;stroke:#5f86a7;stroke-width:1.5}.gfc-measure{fill:#e8f2fb;stroke:#356f9d;stroke-width:1.8}.gfc-driver{fill:#fff5e9;stroke:#a7794d;stroke-width:1.5}.gfc-filter{fill:#edf5ef;stroke:#62866d;stroke-width:1.5}.gfc-feedback{fill:#f3eef8;stroke:#7f6591;stroke-width:1.5}.gfc-line{fill:none;stroke:#356f9d;stroke-width:2;marker-end:url(#gfc-arrow)}.gfc-dash{fill:none;stroke:#92714f;stroke-width:1.7;stroke-dasharray:7 6;marker-end:url(#gfc-dash-arrow)}.gfc-label{font:700 14px system-ui;fill:#173957}.gfc-small{font:500 11.5px system-ui;fill:#425c6f}.gfc-kicker{font:700 10.5px system-ui;letter-spacing:1.1px;fill:#356f9d}`}</style>
      </defs>

      <rect className="gfc-box" x="24" y="42" rx="16" width="205" height="146" />
      <text className="gfc-kicker" x="43" y="66">OBSERVATION PASSPORT</text>
      <text className="gfc-label" x="43" y="91">跨国 × 跨资产面板</text>
      <text className="gfc-small" x="43" y="116">asset / country / currency</text>
      <text className="gfc-small" x="43" y="137">clock / frequency / vintage</text>
      <text className="gfc-small" x="43" y="158">transform / sign / missing</text>
      <text className="gfc-small" x="43" y="179">sample universe / overlap</text>

      <rect className="gfc-measure" x="275" y="28" rx="16" width="220" height="176" />
      <text className="gfc-kicker" x="295" y="54">MEASUREMENT · NOT DRIVER</text>
      <text className="gfc-label" x="295" y="80">共同成分 + 本地残差</text>
      <text className="gfc-small" x="295" y="106">静态特例 zⱼ,t = λⱼ fₜ + uⱼ,t</text>
      <text className="gfc-small" x="295" y="129">factor / loading / EV</text>
      <text className="gfc-small" x="295" y="151">proxy diagnostics / uncertainty</text>
      <text className="gfc-small" x="295" y="176">符号、范围、窗口均版本化</text>
      <path className="gfc-line" d="M229 115H275" />

      <rect className="gfc-driver" x="535" y="28" rx="16" width="240" height="176" />
      <text className="gfc-kicker" x="555" y="54">CANDIDATE DRIVERS</text>
      <text className="gfc-label" x="555" y="80">谁改变共同状态？</text>
      <text className="gfc-small" x="555" y="106">US monetary surprise</text>
      <text className="gfc-small" x="555" y="128">US growth / inflation news</text>
      <text className="gfc-small" x="555" y="150">global risk-bearing capacity</text>
      <text className="gfc-small" x="555" y="172">other centres / common shocks</text>
      <text className="gfc-small" x="555" y="193">需识别设计，不能从f倒推</text>
      <path className="gfc-dash" d="M495 115H535" />

      <rect className="gfc-box" x="815" y="28" rx="16" width="280" height="176" />
      <text className="gfc-kicker" x="835" y="54">TRANSMISSION CHANNELS</text>
      <text className="gfc-label" x="835" y="80">怎样穿过全球金融系统？</text>
      <text className="gfc-small" x="835" y="106">Treasury curve / discount rates</text>
      <text className="gfc-small" x="835" y="128">dollar price / funding / mismatch</text>
      <text className="gfc-small" x="835" y="150">global banks / typed credit edges</text>
      <text className="gfc-small" x="835" y="172">funds / margin / common holdings</text>
      <text className="gfc-small" x="835" y="193">price × quantity × access</text>
      <path className="gfc-dash" d="M775 115H815" />

      <rect className="gfc-filter" x="815" y="262" rx="16" width="280" height="160" />
      <text className="gfc-kicker" x="835" y="288">LOCAL FILTERS</text>
      <text className="gfc-label" x="835" y="314">同一输入，不同落地</text>
      <text className="gfc-small" x="835" y="340">FX regime / currency mismatch</text>
      <text className="gfc-small" x="835" y="362">hedging / local funding / depth</text>
      <text className="gfc-small" x="835" y="384">investor base / policy response</text>
      <text className="gfc-small" x="835" y="407">buffer · amplify · reverse</text>
      <path className="gfc-line" d="M955 204V262" />

      <rect className="gfc-box" x="535" y="262" rx="16" width="240" height="160" />
      <text className="gfc-kicker" x="555" y="288">HETEROGENEOUS OUTCOMES</text>
      <text className="gfc-label" x="555" y="314">国家 × 资产结果向量</text>
      <text className="gfc-small" x="555" y="340">asset prices / spreads / FX</text>
      <text className="gfc-small" x="555" y="362">gross flows / credit / leverage</text>
      <text className="gfc-small" x="555" y="384">common part + local residual</text>
      <text className="gfc-small" x="555" y="407">不是固定脆弱性排名</text>
      <path className="gfc-line" d="M815 342H775" />

      <rect className="gfc-feedback" x="274" y="262" rx="16" width="221" height="160" />
      <text className="gfc-kicker" x="294" y="288">FEEDBACK CANDIDATES</text>
      <text className="gfc-label" x="294" y="314">结果怎样回写系统？</text>
      <text className="gfc-small" x="294" y="340">price → margin / VaR / capital</text>
      <text className="gfc-small" x="294" y="362">flows → liquidity / FX / credit</text>
      <text className="gfc-small" x="294" y="384">policy → expectations / buffers</text>
      <text className="gfc-small" x="294" y="407">reverse spillover → centres</text>
      <path className="gfc-line" d="M535 342H495" />

      <rect className="gfc-measure" x="24" y="262" rx="16" width="205" height="160" />
      <text className="gfc-kicker" x="43" y="288">NEXT OBSERVATION</text>
      <text className="gfc-label" x="43" y="314">下一期可观测状态</text>
      <text className="gfc-small" x="43" y="340">新价格 / 新仓位 / 新政策</text>
      <text className="gfc-small" x="43" y="362">new vintage / regime drift</text>
      <text className="gfc-small" x="43" y="384">重新估计，不覆盖旧state</text>
      <text className="gfc-small" x="43" y="407">保留uncertainty与null</text>
      <path className="gfc-line" d="M274 342H229" />
      <path className="gfc-line" d="M126 262V215C126 202 138 198 156 198H256C271 198 278 191 278 176" />

      <rect className="gfc-driver" x="237" y="474" rx="13" width="646" height="56" />
      <text className="gfc-label" x="258" y="497">观测等价边界</text>
      <text className="gfc-small" x="258" y="518">同一相关矩阵可来自共同冲击、同步本地冲击或直接传染；4.07只保存候选，4.21才判别。</text>
      <path className="gfc-dash" d="M655 422V474" />
    </svg>
    </div>
    <figcaption id="global-cycle-map-caption"><b>读图顺序：</b>蓝色共同因子节点属于measurement，不是driver；棕色虚线表示仍需识别的机制候选；绿色本地过滤器允许同一输入被缓冲、放大或反转；紫色反馈只是一张逐箭头待验证的研究地图。任何空缺都应保留partial/null，而不是用“全球risk-off”补齐。</figcaption>
  </figure>;
}
