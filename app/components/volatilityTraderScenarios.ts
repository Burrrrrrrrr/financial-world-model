export type VolatilityTraderMode = 'object' | 'book';
export type VolatilityTraderChoice = 'a' | 'b' | 'c';

export type VolatilityTraderScenario = {
  id: string;
  mode: VolatilityTraderMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: VolatilityTraderChoice; label: string; diagnosis: string }[];
  correct: VolatilityTraderChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const volatilityTraderModes: { id: VolatilityTraderMode; label: string; title: string; description: string }[] = [
  { id: 'object', label: 'MODE A', title: '识别真正的交易对象', description: '分开 volatility、variance、路径、曲面、事件与 correlation，并保持单位一致。' },
  { id: 'book', label: 'MODE B', title: '审计组合、执行与约束', description: '从 Greeks 与 full repricing 走到 strategy payoff、target、fill、margin 和反例。' },
];

export const volatilityTraderScenarios: VolatilityTraderScenario[] = [
  {
    id: 'variance-versus-volatility',
    mode: 'object',
    label: '对象实验 01 · Volatility versus Variance',
    title: '25% 的价格隐含波动率与 20% 的主观预测，相差的究竟是什么单位？',
    brief: '同一期限、同一标的且口径已经对齐。交易员把可交易曲面映射成 25% 的年化 implied volatility，并预测同口径 realized volatility 为 20%。暂不讨论风险溢价估计误差；选择单位严格的表述。',
    facts: [
      { label: 'Implied volatility', value: '25% p.a.', note: '波动率单位' },
      { label: 'Forecast realized vol', value: '20% p.a.', note: '同期限、同年化约定' },
      { label: 'Variance convention', value: 'Decimal squared', note: '25%=0.25' },
    ],
    options: [
      { id: 'a', label: '方差差为 5%，因为 25%−20%=5%', diagnosis: '5 个 volatility points 是波动率差，不是方差差；平方映射不能省略。' },
      { id: 'b', label: '波动率差为 5 points；方差差为 0.25²−0.20²=0.0225', diagnosis: '正确。二者可以同时报告，但绝不能混成同一个单位。' },
      { id: 'c', label: '方差差为 0.25−0.20=0.05', diagnosis: '仍然在相减波动率；方差必须先把年化波动率平方。' },
    ],
    correct: 'b',
    calculation: 'Δσ=25%−20%=5 volatility points；Δv=0.25²−0.20²=0.0625−0.0400=0.0225，即 225 percentage-points-squared。',
    reveal: 'Variance swap、VIX-style quantity 与 option IV 可能采用不同显示约定。每次比较前都要冻结 horizon、annualization、return definition 与 squared/non-squared unit。',
    revisit: '回看 08–13「单位、realized variance、implied variance 与 VRP」。',
    staticTwin: {
      title: '变式 01 · 18% 与 15% 不是 3% 方差差',
      prompt: '同口径 implied volatility 为 18%，realized-vol forecast 为 15%。分别求 volatility gap 与 decimal variance gap。',
      answer: 'Volatility gap=3 points；variance gap=0.18²−0.15²=0.0324−0.0225=0.0099。若使用 percentage-points-squared，等于 99。',
    },
  },
  {
    id: 'realized-variance-clock',
    mode: 'object',
    label: '对象实验 02 · Realized Path',
    title: '四个日收益怎样变成一个年化 realized variance，而不是“把涨跌抵消”？',
    brief: '冻结教学口径：四个等间隔日对数收益分别为 +1%、−1%、+2%、0%，一年按 252 个交易日，使用不去均值的平方收益实现量 RV=(252/N)Σr²。忽略高频微观结构噪声。',
    facts: [
      { label: 'Daily log returns', value: '+1%, −1%, +2%, 0%', note: '先转成小数再平方' },
      { label: 'Observations N', value: '4', note: '四个一日区间' },
      { label: 'Annualization', value: '252/N', note: '本题冻结约定' },
    ],
    options: [
      { id: 'a', label: 'RV=0，因为四日累计收益接近 0', diagnosis: 'Realized variance 对每段收益平方；相反方向不会像累计收益那样互相抵消。' },
      { id: 'b', label: '年化 realized vol=3.78%', diagnosis: '0.0378 是 decimal variance；把它直接写成百分比波动率漏掉了平方根。' },
      { id: 'c', label: '年化 RV=0.0378，年化 realized vol≈19.44%', diagnosis: '正确。先求平方和，再乘 252/4，最后开平方才回到波动率单位。' },
    ],
    correct: 'c',
    calculation: 'Σr²=0.01²+(−0.01)²+0.02²+0²=0.0006；RV=252/4×0.0006=0.0378；√RV≈0.1944=19.44%。',
    reveal: '期权的路径暴露与“终点涨了多少”不同。采样频率、隔夜、跳跃、缺失值和微观结构噪声都会改变实际结算或研究中的 realized measure。',
    revisit: '回看 09–10「收益时钟、实现方差与测量选择」。',
    staticTwin: {
      title: '变式 02 · 两个相反的大波动仍有高 realized variance',
      prompt: '两个日对数收益为 +2% 与 −2%，按 252 日及 RV=(252/N)Σr²，求年化 RV 与 realized vol。',
      answer: 'RV=252/2×(0.02²+0.02²)=0.1008；realized vol=√0.1008≈31.75%。累计回到附近不代表路径平静。',
    },
  },
  {
    id: 'long-option-is-not-pure-vol',
    mode: 'object',
    label: '对象实验 03 · Option versus Volatility',
    title: '买入一份正 vega 的 call，为什么仍不能把整笔仓位称为“纯 long volatility”？',
    brief: '交易员买入一份 call 后没有做 delta hedge。建仓时 portfolio delta=+0.55、gamma>0、vega>0、theta<0；随后标的上涨而 implied volatility 下跌。题目未给完整曲面和路径。',
    facts: [
      { label: 'Delta', value: '+0.55', note: '存在一阶方向暴露' },
      { label: 'Gamma / Vega', value: 'Positive', note: '只描述局部敏感度' },
      { label: 'Theta', value: 'Negative', note: '依定价与时钟约定' },
    ],
    options: [
      { id: 'a', label: '这份仓位同时含方向、曲率、波动率与时间暴露；须对冲并归因后才能谈 vol expression', diagnosis: '正确。买 option 是取得一组状态相关 Greeks 和 payoff，不是直接买入单一可观测 volatility。' },
      { id: 'b', label: '只要 vega>0，最终 P&L 就只由 volatility 决定', diagnosis: 'Vega 只是一个局部偏导；未对冲 delta、spot path、theta、skew 与 higher-order terms 都会进入 P&L。' },
      { id: 'c', label: '标的上涨，所以 call 的 P&L 必为正', diagnosis: '权利金、IV 下跌、时间流逝和曲面运动都可能抵消 delta 收益；方向正确不保证净收益。' },
    ],
    correct: 'a',
    calculation: '局部 ΔV≈Delta·ΔS+½Gamma·(ΔS)²+Vega·Δσ+Theta·Δt+cross/higher-order terms；未做 delta hedge 时第一项不能忽略。',
    reveal: 'Long call、long straddle、long variance 与 long VIX future 是不同 payoff。策略名必须由合约、hedge policy、horizon 与 P&L attribution 共同定义。',
    revisit: '回看 05–07 与 18–24「claim、Greeks、hedge policy 和 full repricing」。',
    staticTwin: {
      title: '变式 03 · Short put 也不是单一 short-vol 标签',
      prompt: '一份未对冲 short put 的 delta 为正、gamma 与 vega 为负。标的上涨且 IV 上升。能否只凭“short vega”判断盈亏？',
      answer: '不能。正 delta 可能受益于上涨，负 vega 受损于 IV 上升，gamma、theta、曲面与成本也同时作用；需按真实路径和完整重估归因。',
    },
  },
  {
    id: 'delta-hedged-local-pnl',
    mode: 'object',
    label: '对象实验 04 · Local P&L',
    title: 'Delta 已对冲后，Gamma 收益为什么仍可能被 Theta、IV 与成本吃掉？',
    brief: '一段很短的教学窗口内，组合初始 delta 已被标的对冲。冻结 portfolio-level 单位：Gamma=8 美元/美元²、Vega=50 美元/vol point、窗口 Theta=−20 美元；标的变动 +3 美元，IV 下降 1 point，交易成本 6 美元。忽略 cross-Greeks、融资和 Greek 漂移。',
    facts: [
      { label: 'Curvature', value: 'Γ=8 $/$² · ΔS=+$3', note: '½Γ(ΔS)²' },
      { label: 'Volatility / time', value: 'Vega=$50/point · Δσ=−1 point · ΘΔt=−$20', note: '单位已冻结' },
      { label: 'Cost', value: '$6', note: '从 gross P&L 扣除' },
    ],
    options: [
      { id: 'a', label: 'P&L≈+$36，因为 delta-neutral 意味着只保留 gamma', diagnosis: 'Gamma gross gain 是 36 美元，但 vega、theta 和成本没有消失。' },
      { id: 'b', label: 'P&L=0，因为对冲消除了所有风险', diagnosis: 'Delta hedge 只在局部移除一阶 spot exposure；曲率、IV、时间、跳跃与执行风险仍在。' },
      { id: 'c', label: 'P&L≈−$40', diagnosis: '正确：36−50−20−6=−40。Delta-neutral 从不等于 P&L-neutral。' },
    ],
    correct: 'c',
    calculation: 'ΔΠ≈½×8×3² + 50×(−1) −20 −6 = 36−50−20−6=−$40。',
    reveal: '常见“realized minus implied”直觉是连续、无摩擦、模型与 hedge policy 受控时的特殊映射；实盘必须保留 surface move、discrete hedge、jump 和 cost residual。',
    revisit: '回看 18–25「局部损益、离散对冲、曲面重估与归因」。',
    staticTwin: {
      title: '变式 04 · 正 Gamma 也可能只赚到很小净额',
      prompt: 'Gamma=10 美元/美元²，标的变动 2 美元；Vega=30 美元/point，IV 上升 0.5 point；窗口 Theta=−25 美元、成本 8 美元。忽略其他项，求净 P&L。',
      answer: 'Gamma 项=½×10×2²=$20；vega 项=+$15；净额=20+15−25−8=+$2。局部正 gamma 不等于免费凸性。',
    },
  },
  {
    id: 'event-total-variance',
    mode: 'object',
    label: '对象实验 05 · Event Variance',
    title: '跨越事件的 IV 更高，怎样用 total variance 做一个有条件的事件波动提取？',
    brief: '一只 30 天到期、跨越单日事件的 ATM option IV 为 30%；一只 20 天到期、在事件前到期的同口径 option IV 为 20%。仅作教学近似：普通日方差率恒为 20%²、总方差可加、曲面与风险溢价差异忽略；两个期限之间的 10 天由 9 个普通日和 1 个事件日构成。',
    facts: [
      { label: 'Across-event', value: 'σL=30% · TL=30/365', note: '总方差 σL²TL' },
      { label: 'Pre-event', value: 'σS=20% · TS=20/365', note: '总方差 σS²TS' },
      { label: 'Extra window', value: '9 ordinary + 1 event day', note: '普通日仍按 20%² 方差率' },
    ],
    options: [
      { id: 'a', label: '事件方差率=(30%−20%)²，所以事件 vol=10%', diagnosis: '可加的是 total variance σ²T，不是 volatility level 或 volatility gap。' },
      { id: 'b', label: '事件总方差约 0.004219；折算单日事件年化 vol≈124.1%', diagnosis: '正确。先从跨事件总方差中扣除前 20 天和额外 9 个普通日的基线方差，再把余量归于一个事件日。' },
      { id: 'c', label: '30% 已经是事件当天预期波动，不需期限调整', diagnosis: '30% 是整个 30 天区间的年化 IV；它把普通日和事件日压缩在同一总方差中。' },
    ],
    correct: 'b',
    calculation: 'w_event≈0.30²×30/365−0.20²×29/365=1.54/365≈0.004219；σ_event≈√(w_event÷(1/365))=√1.54≈124.1%。',
    reveal: '事件方差提取是相对价值模型，不是观测事实。到期日、strike、forward、skew、calendar arbitrage、普通日基线和 risk premium 都可能成为 residual。',
    revisit: '回看 14–17 与 28–29「forecast horizon、event variance 与 calendar expression」。',
    staticTwin: {
      title: '变式 05 · 用 IV² proxy 提取两段 forward variance',
      prompt: '明确把同一 forward-moneyness 的 IV² 当 variance-strike 教学 proxy：20 天 IV=18%，40 天 IV=22%。求第 21–40 天的 proxy annualized forward variance 与 vol。',
      answer: 'Proxy forward variance=[0.22²×40/365−0.18²×20/365]/(20/365)=0.0644 decimal²/year；proxy forward vol=√0.0644≈25.38%。真实交易需 variance-swap-equivalent quotes，不能直接用 22%−18%。',
    },
  },
  {
    id: 'variance-swap-payoff',
    mode: 'book',
    label: '组合实验 06 · Variance Swap',
    title: '收取 realized variance 的一条腿，为什么必须先平方 strike 再谈损益？',
    brief: '一份教学 variance swap 约定 payoff=Nvar×(RV−Kvar)，Nvar=1,000 万美元/decimal variance unit；volatility strike 报价为 20%，因此 Kvar=0.20²。到期同口径 realized volatility 为 30%，忽略 cap、结算离散化和信用调整。',
    facts: [
      { label: 'Side', value: 'Receive realized variance', note: 'Long variance' },
      { label: 'Strike', value: '20% vol → Kvar=0.0400', note: '先平方' },
      { label: 'Realized', value: '30% vol → RV=0.0900', note: '同一口径' },
    ],
    options: [
      { id: 'a', label: 'Payoff=+$500,000', diagnosis: '正确：1,000 万×(0.09−0.04)=50 万美元。' },
      { id: 'b', label: 'Payoff=+$1,000,000，因为 30%−20%=10%', diagnosis: '把 volatility difference 直接送入 variance-notional payoff，单位错配。' },
      { id: 'c', label: 'Payoff=+$50,000，因为 30²−20²=500', diagnosis: '没有按合约的 decimal variance unit 使用 notional；百分数平方与小数平方相差尺度因子。' },
    ],
    correct: 'a',
    calculation: 'Π=$10,000,000×(0.30²−0.20²)=$10,000,000×0.05=+$500,000。',
    reveal: '市场也可能用 variance points 与 vega notional 报价，二者换算依 strike。任何真实合约都必须以 term sheet 的 notional、cap、采样和 disruption rule 为准。',
    revisit: '回看 33–34「variance swap、volatility swap 与 convexity adjustment」。',
    staticTwin: {
      title: '变式 06 · Short variance 的非线性 vol 损益',
      prompt: 'Short variance 的 payoff 为 Nvar×(Kvar−RV)，Nvar=$5m/decimal variance，strike vol=25%，realized vol=35%。求 payoff。',
      answer: 'Kvar=0.0625，RV=0.1225；payoff=$5m×(−0.06)=−$300,000。10 个 vol points 的上升对应 600 个 percentage-points-squared，而不是线性 10。',
    },
  },
  {
    id: 'calendar-total-variance',
    mode: 'book',
    label: '组合实验 07 · Calendar',
    title: '远月 IV 低于近月 IV，为什么 total variance 仍可能正常递增？',
    brief: '同一 forward-moneyness 下，三个月 IV=30%，六个月 IV=24%。本题明确把两个 IV² 当作 variance-swap strikes 的教学 proxy，使用连续期限近似，不考虑离散股息、曲面插值与 calendar risk premium；求 3–6 月区间的 proxy forward variance。',
    facts: [
      { label: 'Near', value: 'T1=0.25 · σ1=30%', note: 'w1=σ1²T1' },
      { label: 'Far', value: 'T2=0.50 · σ2=24%', note: 'w2=σ2²T2' },
      { label: 'Forward interval', value: 'ΔT=0.25', note: '(w2−w1)/ΔT' },
    ],
    options: [
      { id: 'a', label: '存在负 forward variance，因为 24%<30%', diagnosis: 'Calendar no-arbitrage 检查的是 total variance 随期限是否下降，不是 IV level 是否下降。' },
      { id: 'b', label: 'Forward vol=6%，直接用 30%−24%', diagnosis: 'Volatility level 不可按这种方式做期限相减；应先转 total variance。' },
      { id: 'c', label: 'Proxy forward variance=0.0252 decimal²/year（252 pp²/year），vol≈15.87%', diagnosis: '正确：在题设 IV² proxy 下，远月 total variance 仍大于近月，后段方差率为正；这不是精确 variance-swap quote。' },
    ],
    correct: 'c',
    calculation: 'Proxy w1=0.30²×0.25=0.0225；proxy w2=0.24²×0.50=0.0288；fvar=(0.0288−0.0225)/0.25=0.0252 decimal²/year；fvol≈15.87%。',
    reveal: 'Calendar spread 还同时暴露于两端 gamma、vega、theta、skew 和事件位置。即便 forward variance 算对，也没有证明交易便宜或可盈利。',
    revisit: '回看 29「Term Structure 与 Calendar Spread」。',
    staticTwin: {
      title: '变式 07 · 远月 IV 下降但 total variance 仍可递增',
      prompt: '把同 forward-moneyness IV² 明确当教学 proxy：T1=0.25、IV1=20%；T2=0.50、IV2=18%。求后 0.25 年 proxy forward variance 与 vol。',
      answer: 'Proxy w1=0.01，w2=0.0162；fvar=(0.0162−0.01)/0.25=0.0248 decimal²/year；fvol≈15.75%。远月 IV 更低但 proxy total variance 仍递增；真实交易需 variance-swap-equivalent quotes。',
    },
  },
  {
    id: 'dispersion-correlation',
    mode: 'book',
    label: '组合实验 08 · Dispersion',
    title: '指数波动率怎样把成分波动与相关性压缩成一个数？',
    brief: '教学指数只有两只等权成分，σ1=30%、σ2=20%，相关系数 ρ=0.20。假设权重和波动率固定，使用二资产方差恒等式；随后判断常见“long constituents variance / short index variance”表达的边界。',
    facts: [
      { label: 'Weights', value: 'w1=w2=0.5', note: '收益权重' },
      { label: 'Volatilities', value: '30% / 20%', note: '同期限同口径' },
      { label: 'Correlation', value: 'ρ=0.20', note: '单一二资产相关' },
    ],
    options: [
      { id: 'a', label: '指数 variance=0.0385，vol≈19.62%；dispersion 近似 short correlation 但不是纯 correlation', diagnosis: '正确。实际组合还残留权重、skew、jump、vega、strike、basis、成本与离散再平衡。' },
      { id: 'b', label: '指数 vol=(30%+20%)/2=25%', diagnosis: '忽略了分散化与 covariance；volatility 不能像权重那样简单线性平均。' },
      { id: 'c', label: '只要两腿 vega-neutral，dispersion 就必为无风险 correlation swap', diagnosis: 'Vega-neutral 是局部约束；不能消除曲面、成分跳跃、相关性偏斜与工具 basis。' },
    ],
    correct: 'a',
    calculation: 'σI²=0.5²×0.30²+0.5²×0.20²+2×0.5×0.5×0.20×0.30×0.20=0.0385；σI≈19.62%。',
    reveal: 'Index variance 的 covariance 项让 correlation 可以成为相对价值对象；但可交易的 option portfolio 只是带 residual 的 proxy，不能由策略标签宣称“纯相关性”。',
    revisit: '回看 35–38「指数方差、implied correlation 与 dispersion residual」。',
    staticTwin: {
      title: '变式 08 · 相关性上升怎样抬高指数波动',
      prompt: '保持等权、σ1=30%、σ2=20%，把 ρ 从 0.20 提高到 0.50。求新的指数 variance 与 vol。',
      answer: 'σI²=0.0225+0.01+0.015=0.0475；σI≈21.79%。成分 vol 未变，相关性上升仍使指数 vol 提高。',
    },
  },
  {
    id: 'target-order-fill',
    mode: 'book',
    label: '组合实验 09 · Account State',
    title: '“模型要 short 120 vega”为什么不等于市场已经出现 −120 vega 的成交？',
    brief: '所有 exposure 数值均为 portfolio vega，单位是美元/vol point，并带方向。风险系统给出 target=−120；价格与到期先把 post-shock actual 改成 −70，所以 desired exposure adjustment 为 −50。冻结每卖出 1 个 package 增加 −10 美元/point vega；交易台计划卖 5 个但只成交 3 个，期间忽略新的价格与 Greek 漂移。',
    facts: [
      { label: 'Target', value: '−$120 / vol point', note: '期望账户暴露' },
      { label: 'Post-shock actual', value: '−$70 / vol point', note: '下单前真实状态' },
      { label: 'Package / fill', value: '−$10/point each · sold 3', note: '真实新增暴露 −$30/point' },
    ],
    options: [
      { id: 'a', label: '真实成交=−120，因为模型 target 已经确定', diagnosis: '把目标状态当成订单和成交；忽略现仓、批准、限额、流动性与部分成交。' },
      { id: 'b', label: 'Desired adjustment=−50→卖 5 个；只成交 3 个后 actual=−100，仍需卖 2 个', diagnosis: '正确。先把 exposure gap 映射成 package 数量，只有 3 个真实 fills 改变仓位。' },
      { id: 'c', label: '成交后 actual=−150，因为把 target 与 fill 相加', diagnosis: 'Fill 应加在 post-shock actual 上，不是加在 target 上。' },
    ],
    correct: 'b',
    calculation: 'Desired Δvega*=−120−(−70)=−50；每卖 1 个为 −10，所以 desired order=卖 5 个；fill=卖 3 个→new actual=−70−30=−100；remaining order=卖 2 个。',
    reveal: 'Option book 的 Greeks 还会随 spot、time 和 surface 自发漂移。真实系统必须在同一时间戳重算 actual，并分开 optimizer output、approved order、sent order 与 fill。',
    revisit: '回看 40–46「Greek aggregation、constraints 与 target–actual–order–fill」。',
    staticTwin: {
      title: '变式 09 · Target 不变也可能需要反向交易',
      prompt: 'Target vega=+$80/point，actual 漂到 +$110/point；每卖 1 个 package 改变 −$5/point vega，交易台只成交 desired packages 的一半。求 desired order、fill 与新 actual。',
      answer: 'Desired adjustment=80−110=−$30/point，对应卖 6 个 packages；成交一半即卖 3 个、fill exposure=−$15/point；新 actual=+$95/point，仍需卖 3 个才能到 target。',
    },
  },
  {
    id: 'short-vol-stress',
    mode: 'book',
    label: '组合实验 10 · Constraint and Tail',
    title: '一个每天显示正 theta 的 short-vol book，为什么仍不能按“稳定收租”定规模？',
    brief: '组合含未封顶的 naked short calls，并在平静状态显示正 theta、负 gamma、负 vega。压力情景包含标的跳升、IV 上冲、bid–ask 扩大与 margin add-on；没有可靠连续对冲保证。',
    facts: [
      { label: 'Quiet-state carry', value: 'Theta > 0', note: '局部模型量' },
      { label: 'Tail shape', value: 'Naked short calls', note: '损失无有限合约上界' },
      { label: 'Stress frictions', value: 'Jump + IV + spread + margin', note: '可能同时恶化' },
    ],
    options: [
      { id: 'a', label: '正 theta 是到期盈利保证，可按平均日收益无限放大', diagnosis: 'Theta 是局部时间偏导，不是保证现金流；尾部损失、margin 与流动性会约束规模。' },
      { id: 'b', label: '只要每日 delta hedge，naked call 的最大损失就被锁定', diagnosis: '跳跃、离散执行、gap、交易暂停和曲面变化使连续复制不可得；合约 payoff 本身仍无上界。' },
      { id: 'c', label: '应以 full-reprice tail、liquidity、margin 与可成交退出共同定规模；正 carry 只是一项归因', diagnosis: '正确。Short-vol 风险常在最难对冲、最缺流动性时集中出现。' },
    ],
    correct: 'c',
    calculation: '可行规模上界=min(情景损失预算、margin/collateral、Greek limits、liquidity/exit、mandate/legal limits)；quiet-state theta 不能替代任何一项。',
    reveal: '所谓 volatility risk premium 只能解释某些历史平均补偿，不能把单笔 short option 变成安全收益，也不能给出不依状态的最优杠杆。',
    revisit: '回看 27、41–44 与 48–52「short vol、压力约束、证据与反例」。',
    staticTwin: {
      title: '变式 10 · Put spread 改变尾部但不消除所有风险',
      prompt: '交易员把 naked short put 改成 short put spread。哪类风险被改变，哪类风险仍需审计？',
      answer: '更低 strike 的 long put 给合约到期损失设定有限上界；但建仓成本、路径内 margin、early assignment、gap、skew、liquidity、execution 和组合层相关尾部仍需审计。',
    },
  },
];
