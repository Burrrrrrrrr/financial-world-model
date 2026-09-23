import styles from './globalCycle.module.css';

export default function EmCapitalFlowDiagram() {
  return <figure className={styles.systemMap} aria-labelledby="em-flow-map-title em-flow-map-caption">
    <p className={styles.mapHint}>复杂图 · 窄屏可在图内横向滚动；图注提供完整文字等价物。</p>
    <div className={styles.mapScroll} role="region" aria-label="新兴市场资本流对象、合约、吸收和反馈系统图，可横向滚动" tabIndex={0}>
      <svg viewBox="0 0 1120 590" role="img" aria-labelledby="em-flow-map-title em-flow-map-desc">
        <title id="em-flow-map-title">全球与本地条件如何经资本流合约和本地吸收转化为新兴市场结果</title>
        <desc id="em-flow-map-desc">从有护照的居民与非居民交易开始，分别保存gross inflow和gross outflow，并用互斥功能分类单元记录组成、把工具属性另列；push、pull与pipes只作为候选输入。合约的币种、期限、对冲和投资者约束经过本地边际吸收者，影响价格、汇率、信用和融资可得性；结果再通过基金赎回、抵押、续作与政策反应形成反馈。所有因果箭头保持待识别。</desc>
        <defs>
          <marker id="emf-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#356f9d" /></marker>
          <marker id="emf-dash-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#9a7047" /></marker>
          <style>{`.emf-box{fill:#fff;stroke:#5f86a7;stroke-width:1.5}.emf-object{fill:#e8f2fb;stroke:#356f9d;stroke-width:1.8}.emf-candidate{fill:#fff5e9;stroke:#a7794d;stroke-width:1.5}.emf-filter{fill:#edf5ef;stroke:#62866d;stroke-width:1.5}.emf-feedback{fill:#f3eef8;stroke:#7f6591;stroke-width:1.5}.emf-line{fill:none;stroke:#356f9d;stroke-width:2;marker-end:url(#emf-arrow)}.emf-dash{fill:none;stroke:#9a7047;stroke-width:1.7;stroke-dasharray:7 6;marker-end:url(#emf-dash-arrow)}.emf-label{font:700 14px system-ui;fill:#173957}.emf-small{font:500 11.5px system-ui;fill:#425c6f}.emf-kicker{font:700 10.5px system-ui;letter-spacing:1.1px;fill:#356f9d}`}</style>
        </defs>

        <rect className="emf-object" x="24" y="34" rx="16" width="226" height="174" />
        <text className="emf-kicker" x="43" y="59">OBSERVATION PASSPORT</text>
        <text className="emf-label" x="43" y="84">谁 × 谁 × 什么债权</text>
        <text className="emf-small" x="43" y="110">residence / issuer / holder</text>
        <text className="emf-small" x="43" y="133">transaction ≠ position ≠ valuation</text>
        <text className="emf-small" x="43" y="156">currency / maturity / sector</text>
        <text className="emf-small" x="43" y="179">clock / vintage / coverage</text>
        <text className="emf-small" x="43" y="200">gross leg ≠ turnover</text>

        <rect className="emf-box" x="285" y="34" rx="16" width="245" height="174" />
        <text className="emf-kicker" x="304" y="59">TWO LEGS + COMPOSITION</text>
        <text className="emf-label" x="304" y="84">I、O、N与合约向量</text>
        <text className="emf-small" x="304" y="110">nonresident inflow leg I</text>
        <text className="emf-small" x="304" y="133">resident outflow leg O</text>
        <text className="emf-small" x="304" y="156">N = I − O，保留两条原始腿</text>
        <text className="emf-small" x="304" y="179">DI / PI-equity / PI-debt / deriv. / OI</text>
        <text className="emf-small" x="304" y="200">stop ≠ crisis；net可遮蔽</text>
        <path className="emf-line" d="M250 121H285" />

        <rect className="emf-candidate" x="565" y="34" rx="16" width="246" height="174" />
        <text className="emf-kicker" x="584" y="59">CONDITIONAL CANDIDATES</text>
        <text className="emf-label" x="584" y="84">Push × Pull × Pipes</text>
        <text className="emf-small" x="584" y="110">global rates / dollar / risk bearing</text>
        <text className="emf-small" x="584" y="133">local demand / return / institutions</text>
        <text className="emf-small" x="584" y="156">banks / funds / benchmarks / market</text>
        <text className="emf-small" x="584" y="179">country×instrument×direction×state</text>
        <text className="emf-small" x="584" y="200">candidate，不从相关倒推shock</text>
        <path className="emf-dash" d="M530 121H565" />

        <rect className="emf-filter" x="846" y="34" rx="16" width="250" height="174" />
        <text className="emf-kicker" x="865" y="59">CONTRACT FILTER</text>
        <text className="emf-label" x="865" y="84">币种 × 期限 × 对冲</text>
        <text className="emf-small" x="865" y="110">borrower FX / income currency</text>
        <text className="emf-small" x="865" y="133">investor base currency / duration</text>
        <text className="emf-small" x="865" y="156">maturity wall / rollover access</text>
        <text className="emf-small" x="865" y="179">terminal hedge ≠ margin cash</text>
        <text className="emf-small" x="865" y="200">solvency ≠ liquidity</text>
        <path className="emf-line" d="M811 121H846" />

        <rect className="emf-filter" x="846" y="276" rx="16" width="250" height="158" />
        <text className="emf-kicker" x="865" y="301">LOCAL ABSORPTION</text>
        <text className="emf-label" x="865" y="326">谁接盘、哪条路线开放？</text>
        <text className="emf-small" x="865" y="352">resident / official / other foreign</text>
        <text className="emf-small" x="865" y="375">market depth / dealer inventory</text>
        <text className="emf-small" x="865" y="398">四条互斥 residence × instrument 路线</text>
        <text className="emf-small" x="865" y="421">price × quantity × access</text>
        <path className="emf-line" d="M971 208V276" />

        <rect className="emf-box" x="565" y="276" rx="16" width="246" height="158" />
        <text className="emf-kicker" x="584" y="301">HETEROGENEOUS OUTCOMES</text>
        <text className="emf-label" x="584" y="326">汇率、价格、信用、现金</text>
        <text className="emf-small" x="584" y="352">FX / yields / asset prices</text>
        <text className="emf-small" x="584" y="375">credit / issuance / rollover gap</text>
        <text className="emf-small" x="584" y="398">holder migration / real activity</text>
        <text className="emf-small" x="584" y="421">不是固定国家脆弱性排名</text>
        <path className="emf-line" d="M846 355H811" />

        <rect className="emf-feedback" x="285" y="276" rx="16" width="245" height="158" />
        <text className="emf-kicker" x="304" y="301">FEEDBACK CANDIDATES</text>
        <text className="emf-label" x="304" y="326">结果怎样产生下一轮流量？</text>
        <text className="emf-small" x="304" y="352">price → NAV / collateral / margin</text>
        <text className="emf-small" x="304" y="375">FX → mismatch / investor returns</text>
        <text className="emf-small" x="304" y="398">redemption / credit / policy</text>
        <text className="emf-small" x="304" y="421">正负反馈均需逐边识别</text>
        <path className="emf-line" d="M565 355H530" />

        <rect className="emf-object" x="24" y="276" rx="16" width="226" height="158" />
        <text className="emf-kicker" x="43" y="301">NEXT VINTAGE</text>
        <text className="emf-label" x="43" y="326">新交易、新头寸、新约束</text>
        <text className="emf-small" x="43" y="352">更新两条gross leg与composition</text>
        <text className="emf-small" x="43" y="375">保存revision / PIT / unknown</text>
        <text className="emf-small" x="43" y="398">不覆盖旧passport与event label</text>
        <text className="emf-small" x="43" y="421">政策反应不冒充外生处理</text>
        <path className="emf-line" d="M285 355H250" />
        <path className="emf-line" d="M137 276V241C137 224 153 219 178 219H350C377 219 390 207 390 188" />

        <rect className="emf-candidate" x="188" y="495" rx="14" width="744" height="62" />
        <text className="emf-label" x="208" y="519">证据与政策门</text>
        <text className="emf-small" x="208" y="541">观察到的q=S(p,z)=D(p,x)：没有额外设计，流量／贷款量只是供需均衡；储备、FXI、CFM与MPM只记录条件，不在4.08给出因果或福利答案。</text>
        <path className="emf-dash" d="M688 434V495" />
      </svg>
    </div>
    <figcaption id="em-flow-map-caption"><b>读图顺序：</b>先用蓝色护照固定对象，再将两条gross leg按互斥功能分类展开，并把工具、币种、期限等属性放到另一维；棕色虚线的push、pull与pipes始终是待识别候选；绿色合约与本地吸收器允许同一输入被缓冲、放大或改道；紫色反馈必须逐箭头验证。任何缺字段都保留unknown/null，不用“外资流出”四个字补齐。</figcaption>
  </figure>;
}
