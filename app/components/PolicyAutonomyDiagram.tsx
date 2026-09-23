import styles from './policyAutonomy.module.css';

export default function PolicyAutonomyDiagram() {
  return <figure className={styles.systemMap} aria-labelledby="policy-autonomy-map-caption">
    <p className={styles.mapHint}>横向滚动查看完整机制图 · 实线表示定义内传导，虚线表示待识别反馈，不表示已知因果强度</p>
    <div className={styles.mapScroll} role="region" aria-label="Trilemma、Dilemma与政策自主性机制图" tabIndex={0}>
      <svg viewBox="0 0 1120 590" role="img" aria-labelledby="policy-autonomy-map-title policy-autonomy-map-desc">
        <title id="policy-autonomy-map-title">制度承诺、全球金融条件和本地资产负债表如何共同界定政策自主性</title>
        <desc id="policy-autonomy-map-desc">外部利率、全球风险与美元条件先经过汇率承诺、有效资本流动和资产可比性形成经典三元约束，再经过计价货币、外币负债、期限、对冲和中介容量形成金融条件传导。国内政策工具在这个可行域中影响政策率、汇率、收益率、信用和现金结果，结果与预期再反馈到制度可信度和私人行为。工具自主、金融条件隔离、稳定效果和福利最优始终分开。</desc>
        <defs>
          <marker id="pa-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#65417d" /></marker>
          <marker id="pa-dash-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4"><path d="M0 0L8 4L0 8Z" fill="#9a7047" /></marker>
          <style>{`.pa-box{fill:#fff;stroke:#76518e;stroke-width:1.5}.pa-external{fill:#edf3fb;stroke:#4f7394;stroke-width:1.6}.pa-constraint{fill:#f4edf8;stroke:#76518e;stroke-width:1.7}.pa-filter{fill:#eef6f0;stroke:#62866d;stroke-width:1.5}.pa-outcome{fill:#fff7e9;stroke:#a7794d;stroke-width:1.5}.pa-feedback{fill:#f7f1f8;stroke:#8a6d99;stroke-width:1.5}.pa-line{fill:none;stroke:#65417d;stroke-width:2;marker-end:url(#pa-arrow)}.pa-dash{fill:none;stroke:#9a7047;stroke-width:1.7;stroke-dasharray:7 6;marker-end:url(#pa-dash-arrow)}.pa-label{font-family:system-ui;font-size:var(--pa-label-size,14px);font-weight:700;fill:#382047}.pa-small{font-family:system-ui;font-size:var(--pa-small-size,11.5px);font-weight:500;fill:#554761}.pa-kicker{font-family:system-ui;font-size:var(--pa-kicker-size,10.5px);font-weight:700;letter-spacing:1.05px;fill:#76518e}`}</style>
        </defs>

        <rect className="pa-external" x="24" y="36" width="220" height="178" rx="16" />
        <text className="pa-kicker" x="43" y="62">EXTERNAL STATE</text>
        <text className="pa-label" x="43" y="87">外部价格与风险状态</text>
        <text className="pa-small" x="43" y="114">anchor-country policy rate</text>
        <text className="pa-small" x="43" y="138">global risk bearing / dollar funding</text>
        <text className="pa-small" x="43" y="162">trade demand / commodity terms</text>
        <text className="pa-small" x="43" y="186">共同因子 ≠ 已识别政策冲击</text>

        <rect className="pa-constraint" x="280" y="36" width="250" height="178" rx="16" />
        <text className="pa-kicker" x="299" y="62">CLASSIC FEASIBILITY LAYER</text>
        <text className="pa-label" x="299" y="87">三项承诺能否同时闭合？</text>
        <text className="pa-small" x="299" y="114">汇率锚／波动带／退出规则</text>
        <text className="pa-small" x="299" y="138">主体×工具×方向的有效资本流动</text>
        <text className="pa-small" x="299" y="162">资产可比、预期贬值、风险与basis</text>
        <text className="pa-small" x="299" y="186">Trilemma：声明基准内的相容性</text>
        <path className="pa-line" d="M244 125H280" />

        <rect className="pa-filter" x="566" y="36" width="250" height="178" rx="16" />
        <text className="pa-kicker" x="585" y="62">FINANCIAL TRANSMISSION FILTER</text>
        <text className="pa-label" x="585" y="87">合约与中介怎样改写冲击？</text>
        <text className="pa-small" x="585" y="114">主导计价货币／进口投入</text>
        <text className="pa-small" x="585" y="138">外币债、期限墙、套保与margin</text>
        <text className="pa-small" x="585" y="162">银行／基金／做市与抵押品容量</text>
        <text className="pa-small" x="585" y="186">窄化检验：浮动下仍可有金融共振</text>
        <path className="pa-line" d="M530 125H566" />

        <rect className="pa-box" x="852" y="36" width="244" height="178" rx="16" />
        <text className="pa-kicker" x="871" y="62">DOMESTIC TOOL SET</text>
        <text className="pa-label" x="871" y="87">可用、可执行、可持续？</text>
        <text className="pa-small" x="871" y="114">policy rate / liquidity / balance sheet</text>
        <text className="pa-small" x="871" y="138">FXI / reserves / MPM / CFM / fiscal</text>
        <text className="pa-small" x="871" y="162">法律权限 × 资源 × 市场深度</text>
        <text className="pa-small" x="871" y="186">工具数量 ≠ 政策效果或最优性</text>
        <path className="pa-line" d="M816 125H852" />

        <rect className="pa-outcome" x="852" y="286" width="244" height="176" rx="16" />
        <text className="pa-kicker" x="871" y="312">TYPED OUTCOME VECTOR</text>
        <text className="pa-label" x="871" y="337">不要把结果压成一个“自主性”</text>
        <text className="pa-small" x="871" y="364">policy rate / curve / FX / spread</text>
        <text className="pa-small" x="871" y="388">credit quantity / access / FX cash</text>
        <text className="pa-small" x="871" y="412">inflation / output / stability / welfare</text>
        <text className="pa-small" x="871" y="436">主体、时域与反事实逐项保存</text>
        <path className="pa-line" d="M974 214V286" />

        <rect className="pa-feedback" x="566" y="286" width="250" height="176" rx="16" />
        <text className="pa-kicker" x="585" y="312">EXPECTATIONS & POLICY FEEDBACK</text>
        <text className="pa-label" x="585" y="337">选择与结果共同内生</text>
        <text className="pa-small" x="585" y="364">exchange-rate expectations / credibility</text>
        <text className="pa-small" x="585" y="388">hedging / currency choice / leverage</text>
        <text className="pa-small" x="585" y="412">policy reaction / anticipation / selection</text>
        <text className="pa-small" x="585" y="436">反应 ≠ 外生处理，结果 ≠ 效果</text>
        <path className="pa-dash" d="M852 374H816" />

        <rect className="pa-box" x="280" y="286" width="250" height="176" rx="16" />
        <text className="pa-kicker" x="299" y="312">FOUR CLAIMS · FOUR EVIDENCE GATES</text>
        <text className="pa-label" x="299" y="337">自主性护照</text>
        <text className="pa-small" x="299" y="364">① instrument autonomy</text>
        <text className="pa-small" x="299" y="388">② financial-condition insulation</text>
        <text className="pa-small" x="299" y="412">③ stabilisation effectiveness</text>
        <text className="pa-small" x="299" y="436">④ welfare optimality</text>
        <path className="pa-line" d="M566 374H530" />

        <rect className="pa-external" x="24" y="286" width="220" height="176" rx="16" />
        <text className="pa-kicker" x="43" y="312">NEXT STATE</text>
        <text className="pa-label" x="43" y="337">更新制度、资产负债表与预期</text>
        <text className="pa-small" x="43" y="364">versioned regime / mobility passport</text>
        <text className="pa-small" x="43" y="388">reserves / currency mismatch / market</text>
        <text className="pa-small" x="43" y="412">unknown与合法0继续分开</text>
        <text className="pa-small" x="43" y="436">下一轮不能覆盖旧时点证据</text>
        <path className="pa-line" d="M280 374H244" />
        <path className="pa-dash" d="M134 286V248C134 232 151 226 177 226H676C696 226 706 214 706 196" />

        <rect className="pa-outcome" x="158" y="514" width="804" height="54" rx="14" />
        <text className="pa-label" x="178" y="537">最低结论门：</text>
        <text className="pa-small" x="282" y="537">经典相容性、经验共动、局部因果效果与福利判断是四种证据身份；C1/C2只做有限合成诊断。</text>
        <text className="pa-small" x="178" y="557">浮动可扩大政策率空间，同时不能保证隔离全球金融条件；两句可以同时为真。</text>
      </svg>
    </div>
    <figcaption id="policy-autonomy-map-caption"><b>读图顺序：</b>先问经典制度承诺是否相容，再问全球金融条件经过何种合约和中介进入本地；随后将国内工具与结果向量逐项对应。Trilemma解释“在声明基准内哪些持续承诺不能任意同时绑定”。Rey（2015）的原始Dilemma是资本自由流动下更强的货币政策约束命题；图中只画本课窄化后的结果问题——即使政策率可偏离，广义金融条件是否仍被全球周期推动。两者及后续部分缓冲证据必须分栏。所有虚线反馈都需要额外识别，任何一层缺字段都保持unknown或null。</figcaption>
  </figure>;
}
