import type { ReactNode } from 'react';
import RealRateLab from '../components/RealRateLab';
import {
  CrossAssetSensitivityLab,
  NominalRealDcfLab,
  RealRateFixtureAudit,
  RealRatePassportLab,
  RealYieldRStarLab,
  StochasticInflationLab,
  TipsContractLab,
  WaccEligibilityLab,
} from '../components/RealRateMechanismLabs';
import RealRateTransmissionChart from '../components/RealRateTransmissionChart';
import { realRateScenarios } from '../components/realRateScenarios';
import { lesson308DynamicSourceRequirements, lesson308ReadingList, lesson308References } from './lesson-3-08-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a aria-label={`参考文献 ${n}`} className="citation-mark" href={`#ref-${n}`}>[{n}]</a>;
}

function Cites({ ns }: { ns: number[] }) {
  return <>{ns.map((n) => <Cite key={n} n={n} />)}</>;
}

type ConceptSection = {
  id: string;
  number: number;
  label: string;
  title: string;
  paragraphs: ReactNode[];
  formula?: { label: string; expression: ReactNode; note: ReactNode };
  boundary?: ReactNode;
  after?: ReactNode;
};

function RealRateConceptSection({ section }: { section: ConceptSection }) {
  return (
    <section className="lesson-section" id={section.id}>
      <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label}</p>
      <h2>{section.title}</h2>
      {section.formula ? <div className="equation-card"><span>{section.formula.label}</span><div>{section.formula.expression}</div><p>{section.formula.note}</p></div> : null}
      {section.paragraphs.map((paragraph, index) => <p key={`${section.id}:${index}`}>{paragraph}</p>)}
      {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
      {section.after}
    </section>
  );
}

const nominalCurveInputFields = [
  'zeroCouponYields', 'expectedShortRatePath', 'expectedAverageShortRate', 'estimatedYieldTermPremium',
  'decompositionComponents', 'decompositionUncertainty', 'termPremiumModel', 'timestamps',
] as const;

type CanonicalRealDiscountState = {
  schemaVersion: string;
  stateId: string;
  scope: { currency: string | null; jurisdiction: string | null; subject: string | null; valuationTime: string | null; numeraire: string | null } | null;
  inflationPassport: Record<string, unknown> | null;
  nominalCurveInput: Record<(typeof nominalCurveInputFields)[number], unknown | null> | null;
  realRateState: { measurePassport: unknown | null; exPostRealReturn: unknown | null; exAntePlugInRealRate: unknown | null; expectedRealizedRealReturn: unknown | null; observedMarketRealYieldState: unknown | null; modelRealRiskFreeCurve: unknown | null; estimatedRealForwardRate: unknown | null; exAntePolicyRealRate: unknown | null } | null;
  rStarEstimateRange: unknown | null;
  realRateGap: unknown | null;
  pricingState: { claimSpecificPremiumSchema: unknown | null } | null;
  valuationState: { bondCashFlowNews: unknown | null; equityCashFlowNews: unknown | null; discountRateNews: unknown | null; claimPremiumFields: unknown | null } | null;
  realEstateState: { propertyCashFlowPassport: unknown | null; forwardNOI: unknown | null; propertyDiscountCurve: unknown | null; capRatePassport: unknown | null; mortgageState: unknown | null; DSCR: unknown | null; LTV: unknown | null } | null;
  commodityCarryState: unknown | null;
  goldState: { goldCommodityBoundary: unknown | null } | null;
  crossAssetClaimMap: unknown | null;
  identificationStatus: 'descriptive' | 'candidate-shock' | 'identified' | null;
  measurementFlags: string[];
  timestamps: { observationTime: string | null; publicationTime: string | null; modelRunTime: string | null; revisionVintage: string | null; eventClock: string | null };
};

const canonicalRealDiscountStateFields = [
  'schemaVersion', 'stateId', 'scope', 'inflationPassport', 'nominalCurveInput', 'realRateState',
  'rStarEstimateRange', 'realRateGap', 'pricingState', 'valuationState', 'realEstateState',
  'commodityCarryState', 'goldState', 'crossAssetClaimMap', 'identificationStatus', 'measurementFlags', 'timestamps',
] as const satisfies readonly (keyof CanonicalRealDiscountState)[];

const canonicalRealDiscountStateFieldCoverage = true satisfies Exclude<keyof CanonicalRealDiscountState, (typeof canonicalRealDiscountStateFields)[number]> extends never ? true : false;

const forbiddenAliases = [
  'trueRStar', 'observedRStar', 'riskFreeTIPSYield', 'universalDiscountRate', 'realForwardForecast', 'goldFairValueFromRealRate',
] as const;

const conceptSections: ConceptSection[] = [
  {
    id: 'nominal-to-real-discounting', number: 2, label: '3.07 → 3.08 Bridge',
    title: '名义曲线只给货币现金流定价；进入实际贴现前，还必须指定价格指数、信息时点和索赔权。',
    paragraphs: [
      <>3.07 的输出必须原样接入 <code>nominalCurveInput</code>，不得在传递时静默改名：<code>{nominalCurveInputFields.join(', ')}</code>。这些字段描述名义现金流价格、预期短率路径与模型估计的名义期限溢价；任何一项都不是实际利率本身。<Cites ns={[8, 13, 34, 35]} /></>,
      <>从名义曲线到实际曲线，还要补入未来价格指数的条件分布、实际状态价格，以及指数化证券的合同、流动性、供给与期权楔子。这里的 real SDF 是“按未来购买力状态给支付加权的随机贴现因子”。正确链条是“名义曲线状态 + 通胀分布 + real SDF + 合同与市场楔子 → 实际贴现因子”，不是“名义收益率减一个通胀数字”。<Cites ns={[24, 25, 26, 27, 31]} /></>,
    ],
    formula: { label: '桥接结构', expression: <code>nominal curve + inflation distribution + real SDF + contract wedges → Dᴿₜ(T)</code>, note: <>3.07 的 <code>estimatedYieldTermPremium</code> 是名义期限溢价估计，不能直接改名为 real term premium。</> },
    boundary: <>八字段、模型版本、分解不确定性与 timestamps 全部继续传播；缺任一关键时钟时写 <code>null</code> 并触发 measurement flag。</>,
  },
  {
    id: 'real-rate-passport', number: 3, label: 'Real-rate Passport',
    title: '没有价格指数、期限、时点和索赔权的“实际利率”，只是一个无法复核的数字。',
    paragraphs: [
      <>每个实际利率对象至少要保存币种与司法辖区、价格指数及覆盖范围、是否季调、修订政策、起止日期、期限、复利与年化、ex ante 或 ex post、预期来源和 vintage（某一时点实际可得的数据与模型版本快照）、索赔权、指数化规则、税费及信用状态。市场曲线再加报价、结算、筛券与拟合；模型曲线再加 model ID、版本、样本终点和估计时点。<Cites ns={[2, 3, 4, 5, 6]} /></>,
      <>同样的“10 年实际利率 2%”可能是通胀点预测 plug-in、Treasury Inflation-Protected Securities（TIPS）的 yield to maturity（YTM，即让价格等于全部合约现金流现值的单一内部收益率）、模型 real zero yield、未来实际短率平均或家庭个人篮子的预期购买力回报。它们不共享风险性质或信息集。字段缺失时必须返回 unknown，而不是默认 USD、CPI-U、当前 vintage 或无风险索赔权。<Cites ns={[7, 8, 20, 24, 26]} /></>,
    ],
    formula: { label: '对象结构', expression: <code>real-rate object = passport + numeric value</code>, note: <>“real”只说明按某个价格水平换算，不证明无风险、可交易、无税、无期限溢价或适合某个家庭。</> },
  },
  {
    id: 'four-real-rate-clocks', number: 4, label: 'Observation / Publication / Model / Revision',
    title: '实际利率的输入在不同时间变得可见；把四种时钟压成一个日期会制造前视偏误。',
    paragraphs: [
      <>观测时钟记录市场报价或指数覆盖的经济时期；发布时钟记录数据何时真正可得；模型时钟记录何时运行、使用何种版本与样本终点；修订时钟记录当时 vintage、后续修订和下载时点。它们分别回答“测量了什么时候”“市场何时知道”“模型何时计算”“后来是否被改写”。<Cites ns={[3, 5, 6, 24, 27]} /></>,
      <>例如 4 月 15 日的 TIPS Reference CPI 由更早月份 CPI-U 按合同插值，并不是 4 月当日物价。历史研究若用今天的最终修订模型解释当日价格，又会把后来信息带回过去；证券合同采用的 CPI vintage 与宏观数据库当前 vintage 甚至可以合法不同。<Cites ns={[21, 22]} /></>,
    ],
    boundary: <><code>retrievedAt</code> 只说明何时下载；实时回测只允许使用 <code>publishedAt ≤ decisionAt</code> 的数据和当时可用模型。</>,
  },
  {
    id: 'purchasing-power-numeraire', number: 5, label: 'Purchasing-power Numeraire',
    title: '实际金额不是另一种货币，而是把名义金额换算为某个指定价格篮子的购买力。',
    paragraphs: [
      <>若 <code>Pᶦₜ</code> 是一篮子商品的价格水平，名义金额除以该价格水平就得到以此篮子计价的数量。统计指数通常把某个参考期缩放为 100，因此实际水平要带基期常数；但同一指数的跨期增长只依赖价格比，改基不应改变同一窗口的实际增长率。<Cites ns={[3, 4]} /></>,
      <>按 CPI-U、PCE 或某家庭消费篮子得到的购买力可以同时正确，却回答不同问题。跨国比较至少要分别记录币种、当地价格指数与计价基准；本章不把两个本国 real series 直接相除，也不在此展开购买力平价方法。<Cites ns={[3, 4, 13]} /></>,
    ],
    formula: { label: '购买力换算', expression: <code>Xᴿ,ᴵₜ,base = Xᴺₜ × Pᴵbase / Pᴵₜ</code>, note: <>指数改基改变实际水平标尺，不改变同一指数的累计通胀；更换指数则改变经济对象。</> },
  },
  {
    id: 'nominal-and-real-amounts', number: 6, label: 'Nominal / Real Amount',
    title: '名义金额回答收到多少货币，实际金额回答这些货币在同一时点能购买多少指定商品。',
    paragraphs: [
      <>名义工资、债券本金或公司收入以货币记录；乘基期价格水平再除当期价格水平，才成为基期购买力金额。这个操作是在同一日期换单位，不是回报率计算，也不能单独说明持有人比上一期更富有。<Cites ns={[1, 2, 3, 4]} /></>,
      <>固定名义债权支付预先写定的货币数额，其实际价值随到期价格指数改变；指数化债权按合同指数调整名义支付。两者差异来自现金流规则，不是给同一 yield 换标签。比较两日财富还要把初始成本、期间现金流和终值放到同一购买力单位。</>,
    ],
    boundary: <>“实际现金流”不等于“风险调整现金流”；购买力单位确定后，现金流数量仍可有信用、经营和状态风险。</>,
  },
  {
    id: 'ex-post-real-return', number: 7, label: 'Ex-post Real Return',
    title: '事后实际回报必须用同一持有期的名义总回报除以已经实现的累计价格变化。',
    paragraphs: [
      <>若从 <code>t</code> 到 <code>T</code> 的名义总回报因子为 <code>1+Rᴺ</code>，同一窗口价格因子为 <code>Πᴵ</code>，实现实际总回报就是二者之比减一。名义回报要包含题目要求的票息、股息、价格变化和再投资；指数也要覆盖完全相同的起止日。<Cites ns={[1, 2]} /></>,
      <>名义回报 5%、通胀 10% 时，精确实际回报为 <code>1.05/1.10−1=−4.5455%</code>，并非近似的 −5%。它是事后结果，因为到期价格水平只有事后才知道；它不能替代决策时的 ex-ante stance，也不证明投资者预见了通胀。</>,
    ],
    formula: { label: '精确事后回报', expression: <code>Rᴿ,ex-postₜ,ᵀ = (1+Rᴺₜ,ᵀ) / Πᴵₜ,ᵀ − 1</code>, note: <>同一窗口、同一指数和总回报口径是公式资格条件。</> },
  },
  {
    id: 'ex-ante-plugin-real-rate', number: 8, label: 'Ex-ante Plug-in',
    title: '用通胀预测构造的 ex-ante real rate 是可复核的 plug-in 指标，不是随机通胀下的严格期望回报。',
    paragraphs: [
      <>在决策时点，给定同期限名义总利率和一个有来源、有 vintage 的预期累计通胀因子，可以构造 plug-in real rate。它回答“若未来总价格变化恰等于当前预测，这项名义支付对应多大购买力回报”；不同调查、模型或信息集会给出不同但各自合法的 proxy。<Cites ns={[2, 5, 6, 7]} /></>,
      <>严格的物理概率期望是 <code>(1+i)Eᴾ[1/Π]−1</code>，不是 <code>(1+i)/Eᴾ[Π]−1</code>；二者也不同于 SDF 定价的 real risk-free curve。因此 <code>exAntePlugInRealRate</code>、<code>expectedRealizedRealReturn</code> 与 <code>modelRealRiskFreeCurve</code> 必须分字段。<Cites ns={[8, 13]} /></>,
    ],
    formula: { label: '点预测代理', expression: <code>rplugin = (1+i) / Eᴾ[Π] − 1</code>, note: <>“Ex ante”只说明信息时点，不意味着风险中性、可交易或无模型。</> },
  },
  {
    id: 'exact-fisher-identity', number: 9, label: 'Exact Fisher Identity',
    title: 'Fisher 关系的精确形式是总因子的乘法恒等式；只有在同一状态和同一窗口内才成立。',
    paragraphs: [
      <>同一状态中，名义总回报因子等于实际总回报因子乘总通胀因子。这是单位换算的代数恒等式。未来通胀若确定，事前也可用；若通胀随机，每个未来状态分别成立，却不能先对各项取期望后保持原乘法关系。<Cites ns={[1, 2]} /></>,
      <>取自然对数可得精确加法关系 <code>ln(1+i)=ln(1+r)+ln(1+π)</code>。因此 simple rate 的“名义减通胀”只是小率近似；统一使用 log rate 时加法可以精确，但仍没有把市场通胀补偿识别为物理预期。</>,
    ],
    formula: { label: '精确 Fisher', expression: <code>1+i = (1+r)(1+π) = 1+r+π+rπ</code>, note: <>必须标注 realized、deterministic 或 plug-in，禁止把随机环境中的期望机械代入。</> },
  },
  {
    id: 'additive-fisher-approximation', number: 10, label: 'Additive Approximation',
    title: '名义率减通胀率省略了交叉乘积；利率或通胀越大，这个近似越需要审计。',
    paragraphs: [
      <>由精确式可得 <code>r=(i−π)/(1+π)</code>。常见近似 <code>r≈i−π</code> 忽略 <code>rπ</code>，误差方向取决于实际率与通胀的符号；报告时应保存 exact 与 additive 两个值，而不是依赖“差不多”的口头判断。<Cites ns={[1, 2]} /></>,
      <>名义 8%、通胀 5% 时，精确实际率为 2.8571%，减法近似 3%，高出约 14.29bp。连续复利的 log nominal 减 log inflation 等于精确 log real rate，但这不授权把 simple 与 continuous rate 混算。</>,
    ],
    formula: { label: '误差拆解', expression: <code>radd − rexact = π(i−π)/(1+π) = rexact·π</code>, note: <>百分比先转小数；1 percentage point = 100bp。</> },
    after: <RealRatePassportLab />,
  },
  {
    id: 'stochastic-inflation-jensen-gap', number: 11, label: 'Random Inflation / Jensen',
    title: '实际购买力是价格水平的倒数；随机通胀下，先求倒数再平均与先平均再求倒数并不相同。',
    paragraphs: [
      <>固定名义支付的实际状态支付为 <code>(1+i)/Π</code>。因为 <code>1/x</code> 在正数域凸，<code>E[1/Π] ≥ 1/E[Π]</code>；所以严格物理期望通常高于均值 plug-in，只有总通胀确定时 gap 才消失。<Cites ns={[8, 9, 10, 13]} /></>,
      <>零名义回报、价格因子 0.9/1.1 各半时，平均价格因子为 1，plug-in 为 0%，严格期望却约 1.0101%。这不是套利：实际支付在状态间波动，其市场价格还取决于与 real SDF 的协方差。Jensen gap 是非线性，不是 inflation risk premium。</>,
    ],
    formula: { label: '严格期望与 plug-in', expression: <code>Eᴾ[Gᴿ]=(1+i)Eᴾ[Π⁻¹] ≠ (1+i)/Eᴾ[Π]</code>, note: <>若假设 log inflation 正态，可推导方差项；那是分布特例，不是通式。</> },
    after: <StochasticInflationLab />,
  },
  {
    id: 'fisher-identity-versus-effect', number: 12, label: 'Identity ≠ Effect',
    title: 'Fisher identity 是单位换算；Fisher effect 是关于均衡如何调整的条件性经济假说。',
    paragraphs: [
      <>Identity 说明同一状态的名义、实际回报与通胀如何相乘。Fisher effect 则主张：预期通胀永久变化而均衡实际率、风险补偿、税制和其他楔子不变时，名义率会近似一比一调整。前者无需行为假设，后者需要货币长期中性、预期形成与市场定价结构。<Cites ns={[1, 7]} /></>,
      <>确定性基准下，固定 <code>r</code> 有 <code>∂i/∂πᵉ=1+r≈1</code>。现实中的政策反应、价格黏性、税收、通胀风险溢价和增长新闻会使短中期关系偏离；看到名义率与预期通胀同涨，只支持条件相关，不能用 identity 证明因果效应。</>,
    ],
    boundary: <>Estimand 是“方法声称要估计的目标对象”。长期共同趋势与公告窗口反应是不同 estimand；任何实证 Fisher effect 必须附样本、期限与制度状态。</>,
  },
  {
    id: 'inflation-surprise-redistribution', number: 13, label: 'Unexpected Inflation',
    title: '未预期通胀通过固定名义合同重新分配购买力，方向取决于主体的净名义头寸。',
    paragraphs: [
      <>固定名义债权到期支付 <code>Bᵀⁿ</code>，购买力为 <code>Bᵀⁿ/Pᵀ</code>。若实现通胀高于签约时预期且名义支付不变，债权人的实现实际回报下降，债务人的实际偿债负担下降；意外通缩反向。这是既定货币金额遇到意外价格水平，不是通胀凭空销毁了所有人的资源。<Cite n={1} /></>,
      <>主体必须按净名义资产负债表分类。银行、企业、政府与家庭往往同时持有名义资产和负债，而期限、重定价速度、税收与违约反馈又会改变最终部门分布。指数化、浮息或短期滚动可削弱直接转移，但引入 basis、重置滞后和融资风险。</>,
    ],
    boundary: <>这是给定合同后的财富转移，不是通胀冲击对总产出、税收与资产价格的完整一般均衡效应。</>,
  },
  {
    id: 'price-index-personal-basket-basis', number: 14, label: 'Index Basis Risk',
    title: '合同补偿的是指定公共指数，不是每个家庭实际消费篮子的逐项价格。',
    paragraphs: [
      <>CPI-U、CPI-W、C-CPI-U 与 PCE price index 在覆盖人口、支出范围、权重来源和聚合公式上不同。CPI-U 衡量城市消费者代表性篮子；PCE 还覆盖部分第三方代付消费。任何公共指数都是统计规则产物，不是每户生活成本的无误差观测。<Cites ns={[3, 4]} /></>,
      <>若合同按指数 <code>I</code> 调整，投资者真正关心个人篮子 <code>H</code>，个人实际支付还要乘 <code>Πᴵ/Πᴴ</code>。住房、医疗、能源、地区和替代行为都可使比率偏离 1。TIPS 使用 CPI-U NSA，而 FOMC 的长期通胀目标以 PCE price index 表述；两者不能静默互换。<Cites ns={[20, 21, 22, 68]} /></>,
    ],
    formula: { label: '个人篮子桥', expression: <code>Gpersonal-real = Gcontract-real × Πᴵ/Πᴴ</code>, note: <>指数 basis risk 与 TIPS 三个月 lag 是两个机制：前者是价格对象不同，后者是合同时钟滞后。</> },
  },
  {
    id: 'horizon-window-annualization', number: 15, label: 'Horizon / Window / Annualization',
    title: '实际率比较只有在起止日期、期限和复利方法一致时才有含义。',
    paragraphs: [
      <>持有期为 <code>h</code> 年时，有效年化通胀是 <code>Π^(1/h)−1</code>，有效年化实际回报是 <code>{`{(1+Rᴺ)/Π}^(1/h)−1`}</code>。连续复利则将累计 log nominal return 减累计 log inflation，再除以 <code>h</code>。年化只换单位，不消除季节性或预测误差。<Cites ns={[2, 3, 5, 6]} /></>,
      <>十年 nominal zero 必须与同结算日、同到期日的 real zero 或十年累计通胀对象比较，不能减未来十二个月调查。同 maturity 的 coupon bonds 也未必有同 duration；月率乘 12 仅是简单年化，不是复合年化。<Cites ns={[24, 25, 35]} /></>,
    ],
    formula: { label: '有效年化实际回报', expression: <code>rᴿ,ann = ((1+Rᴺ)/Π)^(1/h) − 1</code>, note: <>Calendar horizon、quote window、release window 与 bond maturity 必须分别保存。</> },
  },
  {
    id: 'after-tax-fee-default-real-return', number: 16, label: 'Tax / Fee / Default',
    title: '投资者真正获得的是税费与违约之后的净名义财富，再由价格指数换成购买力。',
    paragraphs: [
      <>令 <code>Wᵗⁿ</code> 为含买入费用的初始支出，<code>Wᵀⁿ</code> 为将票息、股息、卖出价或偿付、税款、管理费与交易费全部结算后的终值，净实际回报是两期实际财富之比。税基若按名义收入计算，补偿通胀的名义增值也可被征税。<Cites ns={[20, 22]} /></>,
      <>信用债屏幕 yield 通常是承诺现金流的内部收益率，未来实际支付还受违约概率、回收率和时点影响。预期损失与风险溢价不是同一项：坏状态中的 recovery 协方差可以在平均损失之外要求补偿。<Cites ns={[56, 57, 58]} /></>,
    ],
    formula: { label: '净实际财富回报', expression: <code>Rnet-real = (Wᵀⁿ/Wᵗⁿ)/Πᴵ − 1</code>, note: <>只有当终值已正确汇总中间现金流与再投资时才可直接用；否则建立日期化 ledger。</> },
  },
  {
    id: 'multiperiod-real-total-return', number: 17, label: 'Multi-period Total Return',
    title: '多期实际总回报是名义财富路径与累计价格水平共同复合的结果，不是各期收益率的算术和。',
    paragraphs: [
      <>若每个子期名义总回报已包含现金分配并按同一策略再投资，多期名义财富因子是各期 gross return 连乘，累计通胀也是价格因子连乘；两者相除等于各期实际 gross return 连乘。<Cites ns={[13, 17, 35]} /></>,
      <>票息被消费、以另一利率再投资，或中途有税款、追加保证金时，必须先生成现金流或终端财富。YTM 本身只是由价格与合约现金流求出的内部收益率；只有把它解释成投资者最终实现的复合回报时，才额外依赖持有到期、无违约及中间现金流按该率再投资等条件。</>,
    ],
    formula: { label: '自融资路径的聚合', expression: <code>1+Rᴿ₀,ᵀ = ∏ₛ(1+Rˢᴺ) / ∏ₛΠˢ = ∏ₛ(1+Rˢᴿ)</code>, note: <><code>∏</code> 是连乘算子，<code>Πˢ</code> 是第 s 期价格总因子；事前 <code>E[∏G]</code> 也不等于 <code>∏E[G]</code>。</> },
  },
  {
    id: 'real-discount-factor', number: 18, label: 'Real Discount Factor',
    title: '实际贴现因子是一单位确定未来购买力的今日价格，不是某项风险资产收益率的倒数。',
    paragraphs: [
      <><code>Dᴿᵗ(T)</code> 定义为今天用所选实际计价单位衡量，购买一份在 <code>T</code> 确定支付一单位同类购买力的索赔权所需价格。确定实际现金流乘自己到期日的实际贴现因子。<Cites ns={[8, 13, 31, 33]} /></>,
      <>连续复利 real zero 为 <code>−lnD/h</code>，有效年化 real zero 为 <code>D^(−1/h)−1</code>。它们只是护照固定后的坐标变换；市场 TIPS 曲线还有合同和交易楔子，不能未经校正就称为理论 <code>Dᴿ</code>。<Cites ns={[24, 25, 26]} /></>,
    ],
    boundary: <>实际贴现因子只定价确定购买力；风险现金流还要进行状态风险调整。</>,
  },
  {
    id: 'nominal-real-sdf-relation', number: 19, label: 'Nominal / Real SDF',
    title: '名义与实际 stochastic discount factor 的差异，是未来货币购买力的状态转换。',
    paragraphs: [
      <>令 <code>Πᵗ,ᵀ=Pᵀ/Pᵗ</code>，名义与实际 SDF 满足 <code>Mᴺ=Mᴿ/Π</code>。名义支付的价格除以当前价格水平，等于它的实际支付按 real SDF 加权后的价格。<Cites ns={[9, 10, 11, 12, 13]} /></>,
      <>这说明名义债不是“实际无风险债加平均通胀”：到期货币支付确定，其购买力却随状态变化；若恰在边际价值高的坏状态中购买力下降，价格就含通胀风险补偿。</>,
    ],
    formula: { label: '名实定价核关系', expression: <code>Mᴺᵗ,ᵀ = Mᴿᵗ,ᵀ × Pᵗ/Pᵀ = Mᴿᵗ,ᵀ/Πᵗ,ᵀ</code>, note: <>方向不得写反；改变价格指数等于改变 real numeraire。</> },
  },
  {
    id: 'real-risk-free-rate', number: 20, label: 'Real Risk-free Rate',
    title: '实际无风险率只为确定的指数化购买力定价；它不等于中性率，也不等于任意 TIPS yield。',
    paragraphs: [
      <>一期实际无风险索赔权在每个未来状态都支付一单位指定购买力，其价格为 <code>E[Mᴿ]</code>，gross return 为其倒数。多期 real zero 来自 <code>Dᴿᵗ(T)=E[Mᴿᵗ,ᵀ]</code>；持有到期的购买力可确定，中途价格仍随曲线变化。<Cites ns={[8, 9, 13]} /></>,
      <>“无风险”必须附 numeraire：对 CPI-U 购买力无风险的支付，对个人医疗篮子仍有 basis risk。它也不是 <code>r*</code>；TIPS 又有指数滞后、floor、流动性和期限溢价，observed TIPS yield 不能直接填入该字段。<Cites ns={[20, 22, 26, 38]} /></>,
    ],
    formula: { label: '一期实际无风险总回报', expression: <code>1+rᶠᴿ = 1/E[Mᴿ]</code>, note: <>多期 real zero 与未来短期 real risk-free rate 期望平均的差可含 real term premium。</> },
  },
  {
    id: 'risky-required-return', number: 21, label: 'Risky Required Return',
    title: '风险资产的必要回报取决于它在高边际价值状态中的表现，而不只是现金流波动率。',
    paragraphs: [
      <>任一资产的实际 gross return 满足 <code>1=E[MᴿRᴿ]</code>。将期望和协方差拆开，期望回报相对无风险回报的差由 real SDF 与资产回报的条件协方差决定。<Cites ns={[9, 10, 11, 12, 13, 19]} /></>,
      <>高 <code>M</code> 是额外一单位购买力最珍贵的坏状态。资产若恰在此时回报低，协方差为负，需要正风险溢价；若坏状态支付多，它提供保险，必要回报甚至可低于无风险率。因此“高波动=高折现率”不是一般定理。</>,
    ],
    formula: { label: '状态风险补偿', expression: <code>E[Rᴿ] − Rᶠᴿ = −Cov(Mᴿ,Rᴿ) / E[Mᴿ]</code>, note: <>“坏状态”由高 SDF 定义，不是只看 GDP 负增长标签。</> },
  },
  {
    id: 'certainty-equivalent-discounting', number: 22, label: 'Certainty Equivalent',
    title: '风险现金流可先转为定价核加权的确定等价，再用实际无风险曲线贴现；风险只应计算一次。',
    paragraphs: [
      <>对未来实际支付 <code>Xᵀᴿ</code>，定义 pricing-kernel certainty equivalent 为 <code>CEᴹ(X)=E[MᴿX]/E[Mᴿ]</code>，价格可精确写成 <code>Qᴿ=Dᴿ·CEᴹ(X)</code>。支付集中在低 M 的好状态时，定价 CE 通常低于普通物理期望；坏状态保险资产可相反。<Cites ns={[9, 10, 11, 12, 13]} /></>,
      <>这个 <code>CEᴹ</code> 是按 normalized pricing kernel 得到的风险调整期望，不应与一般 <code>u⁻¹(E[u(X)])</code> 无条件等同。估值可选“风险调整现金流+无风险曲线”，或在受控条件下选“物理期望现金流+风险调整贴现率”；两边同时减同一风险会双计。</>,
    ],
    boundary: <>多期、非线性或带期权现金流通常不能被一个常数 required return 精确替代。</>,
  },
  {
    id: 'real-yield-curve-decomposition', number: 23, label: 'Real Curve Decomposition',
    title: '理论实际曲线同时包含未来实际短率路径和锁定长期购买力所需的 real term premium。',
    paragraphs: [
      <>在给定期限结构模型、物理概率与 Jensen convention 后，可把 <code>n</code> 期 real zero yield 写为未来一期实际无风险短率的条件平均，加模型定义的 real term premium。Jensen 若单列就要从 residual 移除；若已被 premium 吸收就不再加。<Cites ns={[8, 26, 27, 31, 32, 33]} /></>,
      <>实际曲线向上可能是预期实际短率更高，也可能是长久期实际债在坏状态表现差，需正 premium；向下也可来自预期宽松或保险价值。输出应写 <code>estimatedRealTermPremium</code> 与 <code>decompositionUncertainty</code>，不是无前缀真值。</>,
    ],
    formula: { label: '模型分解', expression: <code>yᴿ,modelᵗ(n) = (1/n)Σ Eᴾᵗ[rᴿ,shortᵗ₊ⱼ] + TP̂ᴿᵗ(n)</code>, note: <>TP 是否吸收 Jensen/convexity 必须写入约定。</> },
  },
  {
    id: 'reconnect-nominal-real-curves', number: 24, label: 'Nominal–Real Reconnection',
    title: '名义与实际曲线通过状态价格和随机价格水平相连，而不是通过一个无风险的预期通胀常数相减。',
    paragraphs: [
      <>理论名义 discount factor 为 <code>Dᴺ=E[Mᴿ/Π]</code>，理论实际 discount factor 为 <code>Dᴿ=E[Mᴿ]</code>。两者之比同时含物理通胀分布、通胀与边际价值的协方差及 Jensen 非线性，一般不等于 <code>E[Π]</code> 或其倒数。<Cites ns={[8, 13, 25, 26, 31]} /></>,
      <>实际拼接时重新检查 3.07 八字段：名义价格坐标、预期名义短率路径、名义期限溢价及模型、不确定性与时钟。只有币种、到期日、复利、现金流、拟合和 vintage 一致，两条曲线的差才有解释资格。<Cites ns={[24, 27, 34]} /></>,
    ],
    boundary: <>名义 term premium 减 real term premium 只有在模型与约定完全一致时才可继续分解，不能直接改名 inflation risk premium。</>,
  },
  {
    id: 'breakeven-inflation', number: 25, label: 'Breakeven / Inflation Compensation',
    title: 'Breakeven 首先是同期限名义与通胀挂钩债券价格间的市场补偿，不是纯预期通胀。',
    paragraphs: [
      <>首次阅读若尚不熟悉 TIPS 现金流，请先预读<a href="#tips-contract-cashflows">§27 合同</a>、<a href="#tips-reference-cpi">§28 Reference CPI</a>与<a href="#tips-deflation-floor">§29 到期 floor</a>，再回到本节解释相对价格；先有合同，才有可比较的 yield。</>,
      <>市场惯例把同期限 nominal zero 减 TIPS zero 称为 additive breakeven。若两者是有效年化 zero，可从 discount factors 定义 exact gross compensation；若都是连续复利，yield 差精确等于 log discount-factor ratio。不同复利坐标不能混减。<Cites ns={[24, 25, 31, 35]} /></>,
      <>即使坐标完全匹配，相对价格仍混合物理预期通胀、inflation risk premium、TIPS 相对流动性、名义券便利、指数滞后、deflation floor、税务和拟合误差。Coupon bonds 还需匹配现金流与 duration；页面首选名称应是 <code>inflationCompensation</code>。<Cites ns={[26, 27, 28, 29, 30, 33]} /></>,
    ],
    formula: { label: '同坐标补偿', expression: <><code>BEadd(h)=yᴺₕ−yᵀᴵᴾˢₕ</code><br /><code>1+BEexact(h)=(Dᵀᴵᴾˢₕ/Dᴺₕ)^(1/h)</code></>, note: <>Exact relative-price compensation 使用市场 TIPS 曲线时仍包含 TIPS wedges。</> },
  },
  {
    id: 'inflation-risk-premium', number: 26, label: 'Inflation Risk Premium',
    title: '通胀风险溢价为通胀发生在何种经济状态定价，因此符号可以为正，也可以为负。',
    paragraphs: [
      <>名义零息债到期支付固定货币，其实际支付为 <code>1/Π</code>。若高通胀常在高 real SDF 的坏状态出现，名义债在购买力最珍贵时受损，投资者要求更高名义回报，IRP 倾向为正；若通缩才与坏状态相伴，名义债可能提供保险，IRP 可下降甚至为负。通胀方差本身不足以确定符号。<Cites ns={[13, 26, 28, 31, 33]} /></>,
      <>明确的 additive 分解可写“inflation compensation = physical expected inflation + estimated IRP − TIPS liquidity premium + other wedges”。IRP 是模型在物理概率与风险调整价格间分配出的潜变量，不是 spread 减任意调查均值后的真值；不同 inflation dynamics、survey constraint 和 Jensen convention 会产生不同估计。<Cites ns={[26, 27]} /></>,
    ],
    formula: { label: '带符号模型分解', expression: <code>ICₕ = Eᴾ[π̄ₕ] + IRP̂ₕ − LP̂ᵀᴵᴾˢₕ + Oₕ</code>, note: <><code>Oₕ</code> 必须列出 technical components，不是残差垃圾桶；已校正成分不得重复扣除。</> },
  },
  {
    id: 'tips-contract-cashflows', number: 27, label: 'TIPS Cash-flow Contract',
    title: 'TIPS 不是“支付 CPI 加一个利率”的抽象标签，而是一组由 Index Ratio 驱动的本金、票息和到期规则。',
    paragraphs: [
      <>美国 TIPS 的 stated coupon rate 发行后固定且每半年支付。每个支付日先以适用 Index Ratio 调整 par principal，再把固定年 coupon rate 的一半乘以调整后本金；通胀提高本金和票息美元额，通缩可降低二者。Coupon rate 固定不等于 coupon dollar payment 固定。<Cites ns={[20, 22]} /></>,
      <>到期本金为 inflation-adjusted principal 与原始 par 的较大者。二级市场买入还要加入 dirty price、accrued interest、settlement index ratio 与购买溢价；必须先生成逐支付日现金流，才有资格计算 yield 或总回报。<Cites ns={[20, 21, 22, 23]} /></>,
    ],
    formula: { label: '合同现金流', expression: <><code>AdjustedPrincipal=Par×IndexRatio</code><br /><code>Coupon=(c/2)×AdjustedPrincipal</code><br /><code>Redemption=max(AdjustedPrincipal,Par)</code></>, note: <>到期 floor 只适用于本金；期间 coupon 仍可随 deflation 降低。</> },
  },
  {
    id: 'tips-reference-cpi', number: 28, label: 'Reference CPI / Lag / Interpolation',
    title: 'TIPS 的每日指数化值由滞后的 CPI-U NSA 按合同插值生成，不使用当日实时物价。',
    paragraphs: [
      <>任一月份第一天的 Reference CPI 取第三个前置日历月的 CPI-U、U.S. city average、all items、not seasonally adjusted；例如 4 月 1 日使用 1 月 CPI。月份内日期在当月与下月第一日 Ref CPI 间线性插值，所以“三个月 lag”是合同索引时钟，不是对未来通胀的预测。<Cites ns={[21, 22]} /></>,
      <>若日期是当月第 <code>d</code> 日、该月有 <code>D</code> 天，插值权重为 <code>(d−1)/D</code>。Index Ratio 分母通常为 original issue date 的 Ref CPI，若 dated date 不同则按法规处理；Ref CPI 与 ratio 还服从六位截断、五位四舍五入和先前公布未修订 CPI 的合同规则。<Cite n={22} /></>,
    ],
    formula: { label: '日历插值', expression: <><code>RefCPIᵈ=RefCPIᴹ+((d−1)/D)(RefCPIᴹ⁺¹−RefCPIᴹ)</code><br /><code>IndexRatioᵈ=RefCPIᵈ/RefCPIᵈᵃᵗᵉᵈ⁄ⁱˢˢᵘᵉ</code></>, note: <>月初权重为 0；calendar interpolation 不是对月内真实价格路径的估计。</> },
  },
  {
    id: 'tips-deflation-floor', number: 29, label: 'Deflation Floor',
    title: 'TIPS 的通缩保护是到期本金上的嵌入期权，不是对买入价、期间票息或持有期回报的全面保本。',
    paragraphs: [
      <>到期 Index Ratio 若低于 1，Treasury 仍按原始 par 偿还本金；若调整本金更高则支付调整后本金。期间 adjusted principal 可以低于 par，coupon dollar payment 也会下降，合同并未把每期票息锁在初始美元额。<Cites ns={[20, 22]} /></>,
      <>Floor 价值取决于期限、当前 ratio、通缩分布和状态价格，会抬价并影响 observed yield 与 breakeven。投资者若在二级市场以高于 par 或 adjusted principal 的价格买入，最终拿回 par 仍可能亏损。正的 coupon-rate floor（发行票息率最低 0.125%）与负 market yield 也可同时存在，因为 coupon rate 是合同参数，yield 是价格与全部现金流的 IRR。<Cites ns={[23, 29, 30]} /></>,
    ],
    formula: { label: '到期本金', expression: <code>PrincipalPaymentᵀ=Par×max(IndexRatioᵀ,1)</code>, note: <>Strike 是 original par，不是 secondary-market purchase price；floor 也不消除个人篮子 basis、lag 或提前出售风险。</> },
    after: <TipsContractLab />,
  },
  {
    id: 'tips-liquidity-supply-technicals', number: 30, label: 'TIPS Market Wedges',
    title: 'TIPS 与名义 Treasury 的相对价格还受市场分割、供给和合同技术影响，不能全部解释为通胀信念。',
    paragraphs: [
      <>TIPS 相对不易交易、融资成本较高或边际买家要求流动性补偿时，价格较低、yield 较高，从而压低 nominal–TIPS breakeven。在 D’Amico–Kim–Wei 的符号中，正 TIPS liquidity premium 加在 TIPS yield 上，因而在 inflation compensation 中以负号出现；该符号来自模型定义，不是所有文献的默认。<Cites ns={[26, 27, 28]} /></>,
      <>供给期限、拍卖与 reopening、客户集中、nominal Treasury 便利、税务、Ref CPI lag、季节性、floor、报价噪声和筛券/拟合都可能改变相对价格。模型有时把多项共同吸收到 liquidity factor；若已含在估计 component 中，不能再次相加。早期市场与压力期的历史 bp 估计也不能硬套今天。<Cites ns={[29, 30, 32, 33]} /></>,
    ],
    formula: { label: '带符号楔子桥', expression: <code>yᵀᴵᴾˢ,obsₕ = yᴿ,modelₕ + LP̂ᵀᴵᴾˢₕ + Otechnicalₕ</code>, note: <><code>O</code> 是有来源、有符号的技术项集合，不是允许任意解释的 residual。</> },
  },
  {
    id: 'observed-tips-yield', number: 31, label: 'Observed TIPS Yield',
    title: '屏幕上的 TIPS yield 是市场价格经现金流惯例换算的结果，不是可直接观察的实际无风险率。',
    paragraphs: [
      <>需要分开四层：个券 quote/transaction price 是市场观测；由该价格和合同现金流求出的 YTM 是约定型内部收益率；从多券拟合的 zero-coupon real curve 是曲线模型输出；再拆成预期实际短率、real TP 与 liquidity component，已经进入结构期限模型。模型依赖逐层增加。<Cites ns={[24, 25, 26, 27, 35]} /></>,
      <>即使由美国财政部发行且本金挂 CPI-U，长久期 TIPS 仍有 real-rate duration、流动性、floor 和 index basis 风险。负 TIPS yield 也并非数据错误，它可表示投资者愿以高价锁定指定指数购买力；正 coupon rate 不构成 yield 下限。输出至少区分 <code>individualTIPSYieldToMaturity</code>、<code>fittedTIPSZeroYield</code>、<code>modeledRealZeroYield</code> 与三个 estimated components。<Cites ns={[20, 23, 30]} /></>,
    ],
    formula: { label: '结构分层示意', expression: <code>yᵀᴵᴾˢ,fittedₕ = Ēᴾ[rᴿ,short] + TP̂ᴿₕ + Ŵᵀᴵᴾˢₕ</code>, note: <>只有价格/quote 直接观测；YTM、zero curve 和结构分解分别增加现金流、拟合与经济模型假设。</> },
  },
  {
    id: 'model-range-vintage', number: 32, label: 'Model Range / Vintage',
    title: '实际利率与 r* 的“范围”必须由可比模型成员构成；模型分歧不能伪装成统计置信区间。',
    paragraphs: [
      <>首次阅读请先预读<a href="#r-star-definition">§34 的 r* 定义</a>，再回到本节讨论模型范围；否则很容易在目标对象尚未固定前就平均多个不可比数字。</>,
      <>实际政策率可由公开利率与预期通胀构造，但 r*、预期实际短率路径、real TP 与资产所需回报都不是直接观测。每个数值应携带 estimand、期限、模型、样本、data vintage、filtering mode 与 estimate time；只有这些维度一致、差异来自事先声明的合理规范时，才能形成 sensitivity range。<Cites ns={[6, 8, 38, 41, 42, 43]} /></>,
      <><code>min/median/max</code> 只描述所选模型集合，不是频率学置信区间，也不保证真值在内。今天下载的完整历史通常吸收后续数据、修订与最新程序，不能倒填成过去决策者实时可见值；real-time、current-vintage 与 synthetic real-time 要分别标记。<Cites ns={[40, 41, 43]} /></>,
    ],
    formula: { label: '可比成员不变量', expression: <code>same estimand + horizon + information set + unit; explicit model/vintage differences</code>, note: <>禁止把政策 real rate、TIPS forward、HLW r* 和 TVP-VAR 长期中性率放进同一个中位数。</> },
  },
  {
    id: 'ex-ante-policy-real-rate', number: 33, label: 'Ex-ante Policy Real Rate',
    title: '事前政策实际利率是名义政策路径相对于同期限预期购买力变化的构造量，不是事后通胀调整。',
    paragraphs: [
      <>若从 <code>t</code> 到 <code>t+h</code> 的名义无风险合约给出总回报 <code>1+i</code>，未来价格因子尚不确定，严格期望实际总回报为 <code>E[(1+i)/Π]−1</code>；常用 <code>(1+i)/(1+Eπ)−1≈i−Eπ</code> 是点预测 proxy。随机通胀下二者不相等。<Cites ns={[1, 2, 7, 8]} /></>,
      <>期限必须对齐。当前隔夜目标率减一年预期通胀混合两个时钟；研究未来一年 stance 应使用该期间预期平均政策路径，并说明指数、年化和预期来源。事后 realized real return 回答持有人最终得到什么，不能替代决策时可用的 ex-ante stance。</>,
    ],
    boundary: <><code>nominalPolicyRate − trailingInflation</code> 既不是纯事前指标，也不能自动解释资产价格。</>,
  },
  {
    id: 'r-star-definition', number: 34, label: 'r* Definition',
    title: 'r* 是模型中使经济在特定反事实条件下趋于资源充分利用与稳定通胀的实际短率，不是一只证券的屏幕收益率。',
    paragraphs: [
      <>Laubach–Williams 类模型把 r* 定义为与产出位于潜在水平、通胀稳定相一致的实际短期利率；长期版本通常还要求暂时冲击已消退。这个定义包含反事实：若实际利率持续偏离该基准，需求缺口和通胀压力如何演化。<Cites ns={[36, 37, 38, 39]} /></>,
      <>不同理论可讨论短期自然率、长期中性率、灵活价格自然率、安全资产均衡率或私人借贷均衡率。信用、流动性和便利收益让这些对象出现楔子。TIPS yield、long real forward、政策制定者长期判断和统计趋势都能提供信息，却不因数值相近就等于 r*。<Cites ns={[42, 44, 45, 46, 48]} /></>,
    ],
    boundary: <>“r*=1%”不是所有资产使用 1% 折现，也不是央行可精确观测并机械瞄准的数值。</>,
  },
  {
    id: 'real-rate-gap', number: 35, label: 'Real-rate Gap',
    title: '实际利率缺口衡量同期限政策实际率相对同一模型 r* 的位置；符号只在该定义和模型内成立。',
    paragraphs: [
      <>本章固定 <code>gapᴿ=rpolicy,EA−r*</code>。正值表示政策实际率高于模型中性基准，通常对应相对紧缩；负值通常对应相对宽松。这里的“通常”来自模型中的 IS/Phillips 传导，不是仅凭减法获得的结构因果。<Cites ns={[37, 38]} /></>,
      <>不确定性同时来自名义路径、预期通胀、r*、期限与修订。Gap 只衡量所定义模型中的政策实际率通道，不是总体金融条件的充分统计量；其他市场价格、信贷数量与主体约束必须在 3.09–3.13 分别进入，不能由 gap 的符号代替。<Cites ns={[42, 45]} /></>,
    ],
    formula: { label: '本章符号', expression: <code>realRateGap = exAntePolicyRealRate − estimatedRStar</code>, note: <>保存 <code>signConvention=policyRealRateMinusRStar</code>，并要求 horizon matched。</> },
  },
  {
    id: 'r-star-state-space', number: 36, label: 'State-space Inference',
    title: '状态空间模型不是从数据中“读出” r*，而是借助动态限制从可观测结果反推潜在状态。',
    paragraphs: [
      <>简化的 LW 骨架让产出缺口受过去缺口与 real-rate gap 影响，让通胀受自身滞后与产出缺口影响，再以趋势增长和持久成分组成 r*。产出缺口、趋势增长和持久驱动均不可直接观察；Kalman filter 利用模型和截至当时的数据联合更新。<Cites ns={[38, 39]} /></>,
      <>估计变化不只因新增一季数据，还因模型把 GDP、通胀与利率联合路径重新分配给趋势、缺口、暂时冲击和测量误差。随机游走假设、冲击方差、预期代理、疫情处理和有效下限都会改变结果。<Cites ns={[40, 41, 42]} /></>,
    ],
    formula: { label: '示意状态系统', expression: <><code>xₜ=a(L)xₜ₋₁+aᵣ(rₜ₋₁−r*ₜ₋₁)+εˣₜ</code><br /><code>πₜ=b(L)πₜ₋₁+bₓxₜ₋₁+εᵖⁱₜ；r*ₜ=cgₜ+zₜ</code></>, note: <>状态空间提供内部一致推断，不让潜在状态升级为直接测量事实。</> },
  },
  {
    id: 'filtered-vs-smoothed', number: 37, label: 'One-sided vs Smoothed',
    title: 'Filtered estimate 回答“当时知道什么”，smoothed estimate 回答“看完整段样本后怎样重估过去”。',
    paragraphs: [
      <>One-sided filtered estimate 在 <code>t</code> 只用截至 <code>t</code> 的观测；two-sided smoothed estimate 还用 <code>t</code> 之后数据。后者通常更平滑，也可能重写拐点，因为未来通胀和产出帮助模型判断当初变化是趋势还是暂时冲击。<Cites ns={[38, 40, 41]} /></>,
      <>真正实时复现还要使用当时的数据 vintage、模型版本、参数规则与异常处理。本章把“用当前模型重跑过去数据 vintage”标记为 <code>syntheticRealTime</code>：这是审计 schema 的分类，不是来源门户的官方产品名；用今天完整修订数据做 one-sided recursion 同样不是决策者当时所见。<Cites ns={[40, 41]} /></>,
    ],
    boundary: <>Smoothed path 可用于历史描述，但不能进入模拟实时交易或政策规则的特征集。</>,
  },
  {
    id: 'plural-r-star', number: 38, label: 'Multiple r* Estimands',
    title: '多种 r* 之所以不同，往往是因为它们回答不同问题，而不只是测量误差。',
    paragraphs: [
      <>半结构宏观模型由产出、通胀与政策率反推均衡短率；动态随机一般均衡模型（DSGE）可定义灵活价格自然率；时变参数向量自回归（TVP-VAR）可用长期预测极限；TIPS 期限模型则从资产价格提取远期实际短率或长期成分。<Cites ns={[26, 37, 38, 39, 42, 43, 45, 48]} /></>,
      <>这些对象的期限、冲击是否消退、是否含安全便利、使用物理概率 P 测度或风险中性 Q 测度及其信息集均不同。合理做法是先建 estimand taxonomy 再并列，不是先平均后命名“市场共识 r*”。模型分歧本身是政策与估值不确定性的输入。<Cites ns={[44, 47, 48, 49]} /></>,
    ],
    boundary: <>只有 estimand、期限、价格指数与信息集已对齐后，模型范围才有解释性。</>,
  },
  {
    id: 'real-forward-boundary', number: 39, label: 'Real Forward ≠ r*',
    title: '实际远期率是今天 TIPS 价格隐含的跨期限交换价格，不是未来自然利率的直接预测。',
    paragraphs: [
      <>若 <code>Pᴿₜ(T)</code> 是同一指数化口径的 real zero discount factor，则远期 gross rate 由两个期限折现因子之比决定。它保证今天不同期限实际现金流价格一致，是价格坐标而非未来 realized spot real rate 的承诺。<Cites ns={[25, 35]} /></>,
      <>同一条 real forward 可用两种替代表述：在风险中性测度下写成未来短率路径与市场楔子，或在物理测度下写成预期未来短率、real term premium 与市场楔子；两套表示不能把 term premium 重复相加。TIPS liquidity、indexation、floor 与拟合误差仍会造成偏离。长期 forward 与短端政策消息共动，也不能证明长期 r* 真值同幅变化；纽约联储的直接比较还提醒 inflation basis 与 vintage 不匹配。<Cites ns={[26, 27, 35, 48]} /></>,
    ],
    formula: { label: 'Real forward 坐标', expression: <code>1+fᴿₜ;T₁,T₂ = [Pᴿₜ(T₁)/Pᴿₜ(T₂)]^(1/(T₂−T₁))</code>, note: <><code>estimatedRealForwardRate</code>、<code>expectedRealShortRate</code> 与 <code>estimatedRStar</code> 是三个字段。</> },
    after: <RealYieldRStarLab />,
  },
  {
    id: 'master-pricing-equation', number: 40, label: 'Master Pricing Equation',
    title: '复用 §19–22 的状态定价并扩展到多支付日：共同起点是现金流与边际价值的联合定价。',
    paragraphs: [
      <>对在 <code>T</code> 支付 <code>Xᵀ</code> 的资产，最一般表示是 <code>Pₜ=Eₜ[Mₜ,ᵀXᵀ]</code>；多个支付日则逐期求和。同样一元现金流若在资源稀缺、财富损失大的状态支付，通常比只在繁荣状态支付更有价值。<Cites ns={[9, 10, 11, 13]} /></>,
      <>普通 DCF 的“预期现金流除一个常数折现率”是额外假设下的压缩。无风险固定现金流可由期限 discount factors 定价；风险现金流若与 SDF 有协方差，就不能只把物理期望现金流乘无风险 discount factor。<Cites ns={[12, 13, 14]} /></>,
    ],
    formula: { label: '总定价约束', expression: <code>Pₜ = Σₖ Eₜ[Mₜ,ₜₖ Xₜₖ]</code>, note: <>该式组织所有索赔权，却不声称存在一个直接可见、对所有投资者相同的 M。</> },
  },
  {
    id: 'sdf-risk-premium', number: 41, label: 'SDF and Risk Premium',
    title: '风险溢价补偿的是现金流在“坏状态”中的表现，而不只是现金流自身的波动率。',
    paragraphs: [
      <>对 gross return 有 <code>1=E[M R]</code>。同期限无风险 gross return 为 <code>Rᶠ</code> 时，<code>E[M]=1/Rᶠ</code>，因而期望超额回报由 <code>−RᶠCov(M,R)</code> 决定。资产若在高 M 坏状态回报高，投资者愿接受更低预期回报；坏状态表现差则需更高补偿。<Cites ns={[9, 10, 11, 12, 13]} /></>,
      <>波动很大但能在坏状态对冲消费损失的资产，不一定有高 premium；波动不大却在系统坏状态集中亏损的资产，可能要求高补偿。经验 beta、factor loading 或 credit spread 是对状态协方差的模型化代理，不是定义。<Cites ns={[14, 19, 56, 57]} /></>,
    ],
    formula: { label: '协方差形式', expression: <code>E[R]−Rᶠ = −Rᶠ Cov(M,R)</code>, note: <>式中 R 是 gross return；高波动不等于高 required return。</> },
  },
  {
    id: 'cash-flow-vs-discount-rate-news', number: 42, label: 'Cash-flow News vs Discount-rate News',
    title: '意外回报可以来自未来现金流预期变化，也可以来自未来所需回报变化；两者的价格方向相反。',
    paragraphs: [
      <>Campbell 的 log-linear present-value 框架写成 <code>rₜ₊₁−Eₜrₜ₊₁=Nᶜᶠₜ₊₁−Nᵈʳₜ₊₁</code>。上修未来现金流产生正 cash-flow news；上修未来 required return 意味旧资产必须即时降价，所以 discount-rate news 以负号进入。<Cites ns={[15, 16]} /></>,
      <>强劲就业或销售新闻可同时提高利润预期、实际率与风险溢价，股票最终涨跌取决于两条现值链的相对大小。经验分解依赖状态变量、VAR、样本和线性化，是模型归因；只凭价格方向不能识别两种结构冲击。<Cites ns={[14, 15, 59]} /></>,
    ],
    boundary: <>“利率升、股票跌”不足以证明全部价格变化都是 discount-rate news。</>,
  },
  {
    id: 'nominal-real-dcf-consistency', number: 43, label: 'Nominal–Real DCF Consistency',
    title: '名义现金流必须配名义折现系统，实际现金流必须配同一价格指数下的实际折现系统。',
    paragraphs: [
      <>若 <code>Πₜ,ᵀ=Iᵀ/Iₜ</code> 是价格总因子，先把真实商品篮子现金流写成 <code>xᴿᵀ=Xᴺᵀ/Iᵀ</code>，则真实与名义 SDF 满足 <code>Mᴿ=MᴺΠₜ,ᵀ</code>，而两种价格满足 <code>Pᴺₜ=IₜPᴿₜ</code>。若再把真实现金流换成 <code>t</code> 时点货币购买力 <code>X̄ᴿᵀ=Iₜxᴿᵀ=Xᴺᵀ/Πₜ,ᵀ</code>，两套 DCF 的数值才可在当前货币单位下直接相等。确定通胀与常数率的简化情形中，<code>1+kᴺ=(1+kᴿ)(1+π)</code>。<Cites ns={[1, 2, 13, 55]} /></>,
      <>在正的累计通胀、正现金流且其他假设冻结的常见课堂情形中，只把收入按名义增长预测却用实际折现率会高估；反向混配会低估。若通缩、现金流为负或相对价格变化主导，方向可以反转。随机通胀下，工资、售价、成本、税与风险补偿未必同步于同一指数，不能用一个平均通胀率同时转换所有现金流和折现率。减预期通胀只完成单位转换的一部分，不能消除状态协方差。</>,
    ],
    formula: { label: '确定通胀下的一致性', expression: <code>Pᴺₜ = IₜPᴿₜ = X̄ᴿᵀ/(1+kᴿ) = Xᴺᵀ/(1+kᴺ)</code>, note: <>数值相等使用的是 <code>X̄ᴿᵀ</code>——以 <code>t</code> 时点货币购买力表达的实际现金流；若保留商品篮子单位 <code>xᴿᵀ</code>，必须先乘 <code>Iₜ</code>。</> },
    after: <NominalRealDcfLab />,
  },
  {
    id: 'currency-numeraire', number: 44, label: 'Currency / Numeraire',
    title: '估值应对计价单位转换保持一致；换币不是给原折现率机械加一项预期汇率变化。',
    paragraphs: [
      <>令 <code>Sₜ</code> 为一单位外币的本币价格，外币现金流为 <code>Xᶠᵀ</code>，本币估值是 <code>E[MᴰSᵀXᶠ]</code>。在同一可交易索赔权和相容的 numeraire 条件下，对应外币 SDF 满足 <code>Mᶠ=Mᴰ(Sᵀ/Sₜ)</code>，于是 <code>Pᴰ=SₜPᶠ</code>。现金流、无风险曲线、risk premium 与终值必须在同一币种体系。<Cites ns={[13, 67]} /></>,
      <>把美元现金流换人民币后继续用美元 WACC 会漏掉汇率状态价格；把预期贬值简单加到 discount rate 又忽略汇率与现金流、风险厌恶及套保成本的协方差。美元 real rate 不是所有币种资产的通用无风险实际率。<Cites ns={[55, 67]} /></>,
    ],
    formula: { label: '换 numeraire 一致性', expression: <code>Mᶠₜ,ᵀ = Mᴰₜ,ᵀ × Sᵀ/Sₜ；Pᴰₜ=SₜPᶠₜ</code>, note: <><code>currency</code> 和 <code>numeraire</code> 必须显式保存；公司注册地不是默认折现币种。</> },
  },
  {
    id: 'term-specific-discounting', number: 45, label: 'Term-specific Curve',
    title: '不同支付日应由各自期限价格折现；一条十年收益率不能替整串现金流定价。',
    paragraphs: [
      <>确定、无违约的名义现金流满足 <code>Pₜ=ΣDᴺₜ(Tₖ)CFᴺₜₖ</code>。每个支付日使用自己的名义 discount factor；曲线陡峭、倒挂或 twist 时，用单一 YTM 折现所有现金流会掩盖期限暴露，也不能正确计算 key-rate sensitivity。<Cite n={35} /></>,
      <>风险现金流应回到 <code>ΣE[MX]</code> 或明确的风险调整现金流/风险中性测度；不能默认“risk-free discount factor × physical expected cash flow”。所谓公司 discount rate 也只是 term-specific required-return curve 的压缩，不是脱离期限的永久常数。<Cites ns={[13, 14]} /></>,
    ],
    boundary: <>Par yield、YTM 与 zero rate 不是可互换的单一折现率；duration 只是在冻结现金流和局部冲击下的一阶敏感度。</>,
  },
  {
    id: 'claim-specific-premium', number: 46, label: 'Claim-specific Risk Premium',
    title: '基准实际率只定价时间与安全购买力的一部分；每种索赔权还要为自身状态风险和制度楔子定价。',
    paragraphs: [
      <>同币种、同期限资产可共享基准曲线，却因坏状态现金流表现不同而有不同 premium。公司债还含违约、回收、流动性、税与期权；股票含经营、杠杆和剩余索赔风险；房地产含空置、租约、资本开支与不流动性；商品含储存和便利收益。<Cites ns={[14, 56, 57, 58, 60, 61, 63]} /></>,
      <>教学上可写 <code>kclaim≈ybenchmark+systematic-risk compensation+claim wedges</code>，但这是带符号约定的近似桥，不是所有成分的精确加法恒等式。模型总 premium 若已吸收流动性或便利收益，就不能再机械加一次。<Cites ns={[13, 14, 26]} /></>,
    ],
    boundary: <><code>claimSpecificPremium</code> 必须携带 claim、期限、币种、估计模型和 included components；不存在 universal discount rate。</>,
  },
  {
    id: 'nominal-bond', number: 47, label: 'Nominal Government Bond',
    title: '固定名义债券是对确定货币单位的索赔权；其价格直接服从名义曲线，而不是单独服从某个实际利率。',
    paragraphs: [
      <>在无违约基准抽象下，固定息债价格等于各期 coupon 和本金乘相应名义 discount factor。预期实际短率路径与 expected inflation 共同进入预期名义短率路径，nominal term premium 则可在特定联合模型下再分解为 real-rate 与 inflation-risk components；安全/流动性特征还可形成额外楔子。未先声明分解 convention 时，不得把 inflation risk premium 与已包含它的 nominal term premium 再相加。<Cites ns={[13, 31, 34, 35]} /></>,
      <>实际率上升通常压低给定名义现金流现值，但若同一冲击显著下调预期通胀或期限溢价，名义 yield 未必同幅上升。YTM 是把当前价格和所有承诺现金流压成一个 IRR；不是每期限 spot rate，也不是未来 realized return。主权信用、资本管制或币种转换风险存在时，不能继续沿用无违约抽象。<Cite n={35} /></>,
    ],
    formula: { label: '名义固定息债', expression: <code>Pₜ=ΣₖDᴺₜ(Tₖ)Cₖ+Dᴺₜ(Tₙ)F</code>, note: <>实际利率只经名义曲线分解的一部分进入，不能单独决定价格。</> },
  },
  {
    id: 'tips-claim', number: 48, label: 'TIPS / Inflation-indexed Claim',
    title: 'TIPS 提供对指定 CPI-U 指数的合约保护，不提供对每个投资者生活成本的无条件真实无风险回报。',
    paragraphs: [
      <>TIPS 本金由 official Reference CPI index ratio 调整，coupon rate 固定但美元支付作用于调整本金，到期本金不低于 original par。指数 lag、插值、取整与结算属于证券合同，而不是预期；税务则是随投资者和司法辖区变化的 after-tax overlay。二级市场总回报还需 purchase price、accrual 与出售/到期现金流。<Cites ns={[20, 21, 22, 23]} /></>,
      <>Market yield 还含 liquidity、real TP、deflation option、券龄与 curve fit；nominal Treasury 减 TIPS 是 inflation compensation，不是纯 expected inflation，TIPS yield 也不是 r*。个人篮子偏离 CPI-U 时仍有 basis risk。<Cites ns={[24, 25, 26, 27, 29, 30]} /></>,
    ],
    boundary: <><code>tipsRealYield</code> 必须附 index、lag、floor、curve method 与 liquidity treatment。</>,
  },
  {
    id: 'corporate-bond', number: 49, label: 'Corporate Bond',
    title: '公司债是承诺现金流与违约状态下回收权的组合；信用利差不是违约概率的别名。',
    paragraphs: [
      <>Merton 的简化零息框架把公司资产视为抵押物，债权可理解为无违约债权减去股东有限责任形成的 put；reduced-form 模型则对 survival、default timing 与 recovery 的状态现金流定价。两条路线都说明公司债不是国债曲线加一个无条件常数。<Cites ns={[56, 57]} /></>,
      <>观察 spread 还可含 expected loss、systematic default-risk premium、liquidity、tax、embedded option 与 benchmark mismatch。经验研究显示 expected default 不穷尽全部利差，但成分依样本、评级与模型而变；不能由 200bp spread 直接推出 2% 年违约概率。<Cite n={58} /></>,
    ],
    formula: { label: '审计型近似桥', expression: <code>spread ≈ expected loss + default-risk premium + liquidity + tax + option + residual</code>, note: <>这不是逐项直接观测的恒等式；每项要附模型、recovery 与符号约定。</> },
  },
  {
    id: 'equity-residual-claim', number: 50, label: 'Equity Residual Claim',
    title: '股票是资本结构中的剩余索赔权；实际率只通过现金流与状态价格系统中的一条边影响估值。',
    paragraphs: [
      <>股票价格仍服从未来股东现金流与 SDF 的联合定价。实务上可用 dividend 或 FCFE 折现至股权价值；若从 FCFF 得到经营资产或企业侧价值，则要按已声明口径扣除债务与其他优先索赔、加入未进入 FCFF 的非经营资产，才能桥接普通股价值。<Cites ns={[13, 14, 16, 18, 19, 69]} /></>,
      <>实际率上升会提高安全跨期回报并可能推高 required return，但同一增长新闻也能上修销量、利润和再投资机会。在现金流与 premium 均被冻结的局部实验里，支付权重越远端，给定 discount-factor shift 的价格敏感度越大；杠杆也可能放大剩余股权暴露，但方向和幅度依现金流与状态而变。不存在“实际率升 1 个百分点，所有股票固定跌多少”的定理；企业利润增长也不等于每股现金流增长。<Cites ns={[15, 18, 50, 51, 59]} /></>,
    ],
    formula: { label: '剩余索赔定价', expression: <code>Pₜ=ΣₖEₜ[Mₜ,ₜₖ Dividendₜₖ]</code>, note: <>增发、回购、债权优先权、海外暴露与治理会改变每股桥接。</> },
  },
  {
    id: 'gordon-growth', number: 51, label: 'Gordon Growth Model',
    title: 'Gordon 模型把永久稳定增长现金流压成 k−g 分母，因此最适合作为稳态终值与敏感度工具。',
    paragraphs: [
      <>若下一期股息为 <code>D₁</code>，以后永远按常数 <code>g</code> 增长，股权 required return 恒为 <code>kₑ</code> 且 <code>kₑ&gt;g</code>，则 <code>P₀=D₁/(kₑ−g)</code>。分母是折现与增长的净距离；两者接近时，极小输入变化造成巨大价值变化。<Cite n={50} /></>,
      <>它不适合把短期高增长永久外推，也不适合未稳定现金流、资本结构剧变或分配政策无法代表股东现金创造的公司。名义 <code>D₁</code> 与名义增长率 <code>g</code> 必须配名义 <code>kₑ</code>；实际量则全部改为同一指数口径。D₁=5、k=9%、g=4% 得 100，k 单独升至 10% 得 83.33，这是模型敏感度，不是现实必然。<Cites ns={[13, 14]} /></>,
    ],
    formula: { label: '稳定增长永续', expression: <code>P₀=D₁/(kₑ−g)，资格条件：kₑ&gt;g</code>, note: <>任何 <code>k≤g</code> 输入必须停止输出伪数值。</> },
  },
  {
    id: 'wacc', number: 52, label: 'Weighted Average Cost of Capital',
    title: 'WACC 是在特定融资政策下折现企业自由现金流的工具，不是公司的永久统一风险标签。',
    paragraphs: [
      <>标准税后式以债务和股权市场价值加权相应索赔者所需回报。WACC 应配 after-tax FCFF；FCFE 配 cost of equity，债务承诺现金流则需债权定价系统。账面权重、历史 coupon 或母公司平均成本不能无条件替代当前项目的市场机会成本。<Cites ns={[51, 53, 54]} /></>,
      <><code>(1−Tᶜ)</code> 隐含利息可扣除且企业能使用税盾；债务风险、tax-shield risk 与再平衡政策会改变正确口径。公司债 YTM 可作实务 debt-cost proxy，但在显著违约风险下，promised YTM 不等于债权人的 conditional expected return。<Cites ns={[52, 53, 56, 57]} /></>,
    ],
    formula: { label: '税后 WACC', expression: <code>WACC=(E/V)kₑ+(D/V)kᵈ(1−Tᶜ)</code>, note: <>市场价值权重、FCFF、风险、币种、名实与融资政策必须一致。</> },
  },
  {
    id: 'wacc-eligibility', number: 53, label: 'WACC Eligibility Gate',
    title: '在计算 WACC 之前，应先证明被估值现金流与 WACC 的风险、融资和单位假设相容。',
    paragraphs: [
      <>最低 gate 包括：现金流是 FCFF；项目经营风险接近可比资产；目标杠杆相对稳定；债务与税盾可持续；币种、名义/实际口径和期限一致；没有必须单独定价的大额补贴、发行成本、困境成本或实物期权。<Cites ns={[51, 53, 54, 55]} /></>,
      <>新兴项目沿用成熟母公司 WACC 会压低项目风险；杠杆收购沿用交易前 WACC 会遗漏债务路径；用 WACC 折现股息会混合债权人与股东索赔权。关键 gate 失败时，应改用分部 required return、逐期 WACC、APV 或状态定价。<Cites ns={[52, 53, 54]} /></>,
    ],
    formula: { label: '资格判定', expression: <code>decision = allCriticalGates ? eligible : ineligible</code>, note: <>先判定，再计算；不能先显示数字后在脚注补资格。</> },
  },
  {
    id: 'apv', number: 54, label: 'Adjusted Present Value',
    title: 'APV 把经营资产与融资副作用分开，特别适合杠杆随时间变化或融资条件本身重要的项目。',
    paragraphs: [
      <>APV 先以匹配经营风险的 unlevered required return 估值项目经营现金流，再分别加入 tax shield、融资补贴，扣除 issuance/distress cost 等融资副作用。每项都有自己的风险、期限与折现依据，因而能看见价值来自经营还是融资。<Cites ns={[52, 54]} /></>,
      <>APV 不免除估计税盾可用性、违约成本和融资承诺的困难；它只是把隐藏在常数 WACC 中的假设摊开。若税盾已进入 WACC，不能在 APV 再加；若用 APV，则 <code>unleveredValue</code>、各 financing effect 与 total levered value 都应可单独复算。<Cites ns={[52, 53, 54]} /></>,
    ],
    formula: { label: 'APV 桥', expression: <code>Vᴸ=Vᵁ+PV(tax shields)+PV(subsidies)−PV(issuance/distress costs)+…</code>, note: <>APV 与 WACC 的税盾只允许一次进入总价值。</> },
    after: <WaccEligibilityLab />,
  },
  {
    id: 'property-noi', number: 55, label: 'Property NOI',
    title: 'NOI 是物业经营层现金收入减经营费用，不是股东可分配现金流，也不是会计净利润。',
    paragraphs: [
      <>教学口径将 NOI 写为 potential rent 减 vacancy/credit loss，加 other operating income，再减 property operating expenses。债务本息、所得税、折旧和所有者融资通常不进入物业 NOI；大型 capital expenditure、tenant improvement、leasing commission 与 replacement reserve 是否进入，需要另设字段并声明标准。<Cite n={66} /></>,
      <>相同“NOI”可以是 trailing actual、next-year budget 或 stabilized forward NOI；入住率、市场租金、免租期与 lease expiry 又会改变它。因而估值输入要带 period、stabilization、property type、location 与 accounting convention。求 unlevered property value 时从物业经营现金流出发；求 equity value 才进一步扣债务服务与股权层现金流。<Cites ns={[61, 62, 66]} /></>,
    ],
    formula: { label: '教学型经营桥', expression: <code>NOI = potential rent − vacancy/credit loss + other operating income − operating expenses</code>, note: <>NOI 不是 FCFE；资本开支和租赁成本必须显式接到后续 property cash-flow ledger。</> },
  },
  {
    id: 'cap-rate', number: 56, label: 'Capitalization Rate',
    title: 'Cap rate 是一年的 NOI 相对物业价值的收益率坐标，不等于多期 DCF discount rate。',
    paragraphs: [
      <>若使用下一年 stabilized NOI，direct capitalization 写成 <code>CapRate=NOI₁/V₀</code>。只有在 NOI 永久以常数 <code>g</code> 增长、风险和资本开支结构稳定等强假设下，才有 Gordon 式近似 <code>CapRate≈kproperty−g</code>；一般多期物业 DCF 还要逐期预测 NOI、capital outlays 与 net sale proceeds。<Cites ns={[50, 66]} /></>,
      <>Cap rate 下降可来自 benchmark rate 或 risk premium 下降、expected NOI growth 上升，也可仅因价格先涨而当前 NOI 未跟上。Transaction cap、appraisal cap、trailing cap 和 forward cap 不能直接混接；低 cap 也不必然低风险。报告时必须保存 NOI period、stabilization、value type 和 transaction/appraisal flag。<Cites ns={[61, 62, 66]} /></>,
    ],
    formula: { label: 'Direct capitalization', expression: <code>CapRate=NOI₁/V₀；V₀=NOI₁/CapRate</code>, note: <>Cap rate 是收益率坐标；只有稳定永续边界下才近似 required return 减增长。</> },
  },
  {
    id: 'property-discount-mortgage', number: 57, label: 'Property DCF / Mortgage Channel',
    title: '物业资产价值、抵押贷款价值与股权价值是三种索赔权；按揭利率会影响需求与杠杆，但不是 cap rate。',
    paragraphs: [
      <>Unlevered property DCF 逐期贴现 <code>NOI−CapitalOutlays</code> 并加入净出售收入；tenant improvements、leasing commissions 与 replacement reserves 是否包含在其中，必须服从已声明口径。若求股权价值，再扣债务服务、融资费用并加入借款/偿还现金流，使用与杠杆股权风险一致的 required return。资产层、债权层和股权层不能用同一现金流分子混算。<Cites ns={[13, 14, 66]} /></>,
      <>Mortgage rate 上升提高 debt service、降低可承受贷款额并增加 refinancing risk；固定存量债、浮息债与即将到期 balloon 的响应不同。<code>DSCR=NOI/AnnualDebtService</code> 描述偿债覆盖，<code>LTV=LoanAmount-or-Balance/PropertyValue</code> 描述抵押缓冲；分子时点与价值口径必须声明，二者都不能单独等同 default probability。<Cites ns={[56, 57, 66]} /></>,
    ],
    formula: { label: '物业资产 DCF', expression: <code>Vproperty₀=ΣₖDproperty₀(Tₖ)·(NOIₜₖ−CapitalOutlaysₜₖ)+Dproperty₀(T)·NetSaleᵀ</code>, note: <><code>Dproperty₀(Tₖ)</code> 是与每个支付日和物业风险匹配的 discount factor；<code>mortgageRate</code>、<code>propertyDiscountCurve</code>、<code>capRate</code> 与 <code>equityRequiredReturn</code> 必须四分。</> },
  },
  {
    id: 'gold-commodity-boundary', number: 58, label: 'Gold / Commodity Boundary',
    title: '黄金和一般商品没有发行人承诺的现金流；实际利率影响持有机会成本，却不是单变量估值公式。',
    paragraphs: [
      <>在可储存、可融资、可套利且忽略约束的连续复利基准中，商品远期价格满足 <code>F₀,ᵀ=S₀exp[(rᴺ+u−y)T]</code>，其中 <code>rᴺ</code> 是与报价币种和期限匹配的名义融资率，<code>u</code> 是 storage/insurance cost，<code>y</code> 是持有实物的 convenience yield。库存稀缺、交割地点、融资限制和做空困难会破坏简单 cost-of-carry 映射。<Cites ns={[63, 64]} /></>,
      <>黄金无合同 coupon，却有储藏、首饰和工业需求、央行/投资需求与可能的避险服务。较高安全实际率往往提高无息黄金的 opportunity cost，但美元、通胀尾部、制度信用、risk aversion 与 positioning 可同时改价；历史证据不提供机械 intrinsic value。<Cite n={65} /></>,
    ],
    formula: { label: '受限条件下的 carry 基准', expression: <code>F₀,ᵀ=S₀e^((rᴺ+u−y)T)</code>, note: <><code>rᴺ</code> 是同币种名义融资率；不得用一条 real-yield regression 生成无条件 <code>goldFairValue</code>，也不能把所有商品统一成黄金机制。</> },
    boundary: <>完整黄金、商品与跨资产识别留给 4.16；本节只交付 opportunity-cost/carry 接口。</>,
  },
  {
    id: 'cross-asset-claim-map', number: 59, label: 'Cross-asset Claim Map',
    title: '跨资产比较的正确单位是“索赔权—现金流—基准曲线—特有楔子”，不是给每种资产套同一个实际利率 beta。',
    paragraphs: [
      <>相同 real-rate news 先改变安全跨期价格，再通过期限、现金流状态、融资与主体约束进入不同索赔权。名义债的固定货币现金流、TIPS 的指数化现金流、公司债的 recovery、股票的 residual cash flow、房地产 NOI 与终值、商品库存服务彼此不同，价格符号和幅度不应预锁。<Cites ns={[13, 14, 35, 50, 56, 60, 63]} /></>,
      <>跨资产研究至少保存 cash-flow news、benchmark-curve news、claim-premium news 与 financing/flow feedback。只观察“real yield 升、成长股跌、黄金跌”仍不能区分共同增长冲击、央行信息效应、风险厌恶、美元或 forced deleveraging；结构命名必须等待事件时钟和排除限制。<Cites ns={[15, 17, 59, 65]} /></>,
    ],
    after: <><div className="real-rate-claim-table-wrap" role="region" tabIndex={0} aria-label="跨资产索赔权地图"><table className="yield-data-table"><caption>Claim passport：现金流、基准与主要附加楔子</caption><thead><tr><th scope="col">索赔权</th><th scope="col">合同 / 经济现金流</th><th scope="col">首要基准</th><th scope="col">主要附加楔子</th></tr></thead><tbody>
      <tr><th scope="row">名义国债</th><td>固定 nominal coupon / principal</td><td>名义 zero curve</td><td>nominal term premium（可再分解 inflation/real-rate risk）与安全/流动性楔子</td></tr>
      <tr><th scope="row">TIPS</th><td>CPI-U 指数化本金与票息</td><td>fitted/model real curve</td><td>real TP、liquidity、lag、floor、个人 basis</td></tr>
      <tr><th scope="row">公司债</th><td>承诺支付与 default recovery</td><td>同币种 benchmark curve</td><td>expected loss、default risk、liquidity、tax、option</td></tr>
      <tr><th scope="row">股票</th><td>residual dividend / FCFE</td><td>SDF 或 equity required-return curve</td><td>经营、杠杆、增长期权、稀释、治理</td></tr>
      <tr><th scope="row">收益型物业</th><td>NOI、capex 与 net sale</td><td>property required-return curve</td><td>空置、租约、地点、流动性、mortgage/refinancing</td></tr>
      <tr><th scope="row">黄金 / 商品</th><td>无发行人承诺；实物使用/库存服务</td><td>financing curve 与 carry</td><td>storage、convenience、inventory、美元、交割与避险</td></tr>
    </tbody></table></div><CrossAssetSensitivityLab /></>,
  },
];

const checks = [
  { question: '名义总回报 4.2%、同窗口通胀点预测 2.6% 时，精确 plug-in real rate 是多少？', answer: '1.042/1.026−1=1.559454191%；1.6% 是减法近似。该数仍只能命名为点预测 plug-in。', sourceIds: [1, 2] },
  { question: '为什么上述 plug-in 不等于随机通胀下严格的期望实际回报？', answer: '因为 Π 已定义为价格总因子，E[Π⁻¹] 一般不等于 (E[Π])⁻¹；而市场定价还取决于实际状态支付与 SDF 的协方差。', sourceIds: [8, 13] },
  { question: '当前隔夜利率减未来一年通胀预期有什么时钟问题？', answer: '它把当下 overnight price 与一年累计购买力变化混合；应明确只是 proxy，或改用一年期间的预期平均政策路径。', sourceIds: [2, 5] },
  { question: 'TIPS 到期 Index Ratio=0.96、original par=1,000 时，合同本金支付多少？它是否保证二级市场投资者不亏？', answer: '本金支付 1,000，因为到期 floor 取调整本金与 original par 的较大者；但若买入价高于可收现金流现值，投资者仍可亏损。', sourceIds: [20, 22, 23] },
  { question: '为什么正 real-rate gap 不保证总体金融条件收紧？', answer: 'Gap 只衡量所定义模型中的政策实际率通道，不是总体金融条件的充分统计量；其他市场价格、信贷数量与主体约束仍须另行测量。', sourceIds: [42, 45] },
  { question: 'Filtered、smoothed 与本章 syntheticRealTime 的区别是什么？', answer: 'Filtered 只用截至 t 的观测，smoothed 还用未来观测重估过去；本章 syntheticRealTime 指当前模型重跑旧数据 vintage。三者都不自动等于当时模型、参数、异常处理与数据均被完整复原的真正实时估计。', sourceIds: [38, 40, 41] },
  { question: '为什么 nominal–TIPS breakeven 不能直接改名为 expected inflation？', answer: '它还可包含 inflation risk premium、TIPS 相对流动性、名义券便利、index lag、floor 和拟合误差；各成分必须服从明确模型与符号约定。', sourceIds: [26, 27, 28, 29, 30] },
  { question: '为什么不能把 HLW r*、TIPS real forward 与 TVP-VAR 长期中性率直接平均？', answer: '它们的 estimand、期限、测度、risk/liquidity premium、价格指数和信息集不同；先对齐对象才能形成模型范围。', sourceIds: [39, 42, 45, 48] },
  { question: 'Real forward 为什么不等于未来 realized real spot？', answer: 'Forward 是今日 discount factors 隐含的跨期限价格，还可含风险补偿、流动性、floor、拟合误差和未来新闻。', sourceIds: [25, 26, 35] },
  { question: '若资产在高 SDF 的坏状态提供较高回报，其协方差和 required premium 通常怎样？', answer: 'Cov(M,R)>0，因此 required excess return 较低；它提供保险，而非仅靠低波动获得低回报要求。', sourceIds: [9, 11, 13] },
  { question: 'Campbell 分解中为什么 discount-rate news 带负号？', answer: '未来 required return 上修会压低既有现金流当期现值，因此对当期意外回报贡献为负。', sourceIds: [15, 16] },
  { question: '把名义收入按 5% 增长预测，再用实际折现率估值，错在哪里？', answer: '现金流含通胀而 discount system 没有，单位不一致；名义现金流必须配名义率。在正通胀、正现金流且其他项冻结的课堂情形会高估，通缩、负现金流或相对价格变化下方向须另算。', sourceIds: [1, 2, 13] },
  { question: '美元现金流换成人民币后能否继续用美元 WACC？', answer: '不能；现金流、benchmark curve、risk premium、terminal value 与 FX state pricing 必须一起换成同一 numeraire。', sourceIds: [13, 55, 67] },
  { question: '为什么付息债不能用单一十年 zero yield 折现所有 coupon？', answer: '每个 coupon 的支付日不同，应使用各自期限 discount factor；单一 yield 会掩盖 curve shape 与 key-rate exposure。', sourceIds: [35] },
  { question: '公司债 spread 为 200bp，能否直接说年违约概率为 2%？', answer: '不能；spread 还含 recovery、default-risk premium、liquidity、tax、option 与 benchmark mismatch。', sourceIds: [56, 57, 58] },
  { question: 'D₁=5、k=9%、g=4% 的 Gordon 价值是多少？资格条件是什么？', answer: '价值 100；要求永久稳定增长、常数 required return、名实与币种一致，且 k>g。', sourceIds: [50] },
  { question: 'E=60、D=40、kₑ=10%、kᵈ=5%、税率 25% 时 WACC 是多少？为何不能再把同一税盾加进 APV？', answer: '0.6×10%+0.4×5%×0.75=7.5%；只有 FCFF、风险、杠杆、税盾和单位 gates 均成立才可用。税盾已经进入税后债务项，再加进 APV 会双重计算。', sourceIds: [51, 52, 53, 54] },
  { question: '为什么 cost-of-carry 式中的 r 不能直接填 r* 或任意 TIPS yield？', answer: '远期套利基准需要与商品报价币种、期限和融资交易匹配的名义融资率；storage、insurance、convenience yield、库存与约束还要另列。', sourceIds: [63, 64] },
] as const;

const glossary = [
  ['Ex-ante real rate', '决策时基于未来通胀分布或预测构造的购买力回报', '事后 realized real return', '08、11、33'],
  ['Ex-post real rate', '用实现通胀计算的最终购买力回报', '当时可用的政策 stance', '07'],
  ['Inflation passport', '价格指数、对象、期限、年化、来源与 vintage 的组合', '无标签的通胀预期', '03–04'],
  ['Index basis risk', '合同指数与投资者真正消费篮子之间的价格变化差异', 'TIPS 三个月 indexation lag', '14、28'],
  ['Exact Fisher identity', '同状态、同窗口的名义、实际与价格总因子乘法恒等式', 'Fisher effect', '09、12'],
  ['Jensen gap', '随机价格因子的倒数期望与均值倒数之间的非线性差', 'inflation risk premium', '11'],
  ['Real discount factor', '一单位确定未来购买力的今日价格', '风险资产 expected return 的倒数', '18'],
  ['Real risk-free rate', '确定指定实际 numeraire 支付的回报率坐标', 'r* 或任意 TIPS yield', '20'],
  ['Stochastic discount factor / pricing kernel', '将各状态现金流映射为今日价格的随机权重', '单一固定 WACC 或概率密度本身', '19–22、40–41'],
  ['Certainty equivalent', '按 normalized pricing kernel 风险调整后的现金流期望', '未经条件的普通期望', '22'],
  ['Inflation compensation', '匹配名义与指数化债价格差中的总通胀相关补偿', '纯 expected inflation', '24–26'],
  ['Inflation risk premium', '通胀状态与边际价值协方差所要求的模型补偿', '通胀方差或 Jensen gap', '26'],
  ['TIPS index ratio', '当日 Reference CPI 相对基准 Reference CPI 的合同比率', '实时 CPI 或 expected inflation', '27–28'],
  ['Deflation floor', 'TIPS 到期本金相对 original par 的下限', 'purchase-price 或 coupon-payment floor', '29'],
  ['TIPS market wedge', '流动性、供给、合同与拟合使 observed TIPS 偏离 model real curve 的项', '纯预期通胀', '30–31'],
  ['r*', '特定模型反事实下与资源充分利用和稳定通胀相容的中性实际短率', 'TIPS yield', '34–38'],
  ['Short-run natural rate', '可包含当期暂时冲击的模型自然率', '长期 neutral rate', '34、38'],
  ['Long-run neutral rate', '暂时冲击消退后的中性实际率概念', '当前政策应立即达到的值', '34、38'],
  ['Real-rate gap', '同期限 ex-ante policy real rate 减 estimated r*', '名义政策率水平', '35'],
  ['Filtered estimate', '只用截至当前观测的潜在状态估计', '完整真正实时复现', '36–37'],
  ['Smoothed estimate', '用未来观测重估过去潜在状态', '当时决策者可见估计', '37'],
  ['Real forward', '由实际 discount-factor 比率推出的跨期限价格', '未来 spot 或 r* 预测', '39'],
  ['Cash-flow news', '对未来现金流现值的意外修正', '当期会计增长率', '42'],
  ['Discount-rate news', '对未来 required-return 路径的意外修正', '当前无风险率单点变化', '42'],
  ['Numeraire', '表达所有价值的计价基准资产或单位', '公司注册地', '44'],
  ['Claim-specific premium', '特定索赔权因状态风险和制度楔子要求的补偿', '通用资产类别常数', '46'],
  ['Gordon growth model', '永久稳定增长现金流的 D₁/(k−g) 模型', '任意企业的完整 DCF', '51'],
  ['WACC eligibility', '判断 FCFF、风险、杠杆、税盾和单位是否适配 WACC 的门槛', '算出一个 WACC 数字', '52–53'],
  ['APV', '经营价值与融资副作用分别估值后相加', 'WACC 税盾再加一次', '54'],
  ['NOI / cap rate', '物业经营收入净额及其相对价值的一期收益率坐标', '股权自由现金流或多期 discount rate', '55–57'],
] as const;

const interfaces = [
  {
    name: 'I1 · 3.04 / 3.07 → 3.08',
    payload: nominalCurveInputFields.join(', ') + '；inflationExpectationDistribution；priceIndexPassport',
    guardrail: '3.07 八字段逐字继承；名义—实际比较前重新对齐期限、证券、指数、复利与 vintage。',
  },
  {
    name: 'I2 · 3.05 → 3.08',
    payload: 'policyRatePath, policyDecisionClock, expectationMeasure, expectedInflationPath, rStarEstimateRange → exAntePolicyRealRate, realRateGap',
    guardrail: '当前政策率不能静默代替期间平均路径；gap 符号固定为 policy real minus r*。',
  },
  {
    name: 'I3 · 3.08 → 3.09 / 3.10',
    payload: 'nominalCurveInput；realRateState.modelRealRiskFreeCurve；realRateState.exAntePolicyRealRate；realRateGap；pricingState.claimSpecificPremiumSchema；timestamps',
    guardrail: '银行贷款还需要负债成本、资本、信用、竞争与借款人状态；本章不直接生成贷款率。',
  },
  {
    name: 'I4 · 3.08 → 3.13',
    payload: 'nominalCurveInput；realRateState；pricingState.claimSpecificPremiumSchema；valuationState',
    guardrail: '金融条件指数不得把股票、信用、按揭和汇率压成同一个实际折现率。',
  },
  {
    name: 'I5 · 3.08 → 3.16',
    payload: 'realEstateState.propertyCashFlowPassport / forwardNOI / propertyDiscountCurve / capRatePassport / mortgageState / DSCR / LTV',
    guardrail: '房价变化还需供给、交易量、信用准入与抵押反馈。',
  },
  {
    name: 'I6 · 3.08 → 3.20',
    payload: 'scope.currency / numeraire；nominalCurveInput；realRateState.modelRealRiskFreeCurve；inflationPassport',
    guardrail: '汇率还需外国同口径状态、FX risk premium、套保与资本流。',
  },
  {
    name: 'I7 · 3.08 → 4.04 / 4.17',
    payload: 'valuationState.bondCashFlowNews / equityCashFlowNews / discountRateNews / claimPremiumFields',
    guardrail: '美国国债的全球角色和股债相关 regime 不能由本章单独识别。',
  },
  {
    name: 'I8 · 3.08 → 4.16 / Chapter 7',
    payload: 'realRateState.measurePassport / modelRealRiskFreeCurve / estimatedRealForwardRate；goldState.goldCommodityBoundary；crossAssetClaimMap；timestamps.eventClock；identificationStatus',
    guardrail: '后续可检验 real-rate news，但不得预先把黄金或跨资产变化命名为 real-rate shock。',
  },
] as const;

const contractInvariants = [
  '未知时钟必须显式写 null 并触发 measurement flag，不得省略。',
  '模型范围至少两个 estimand、期限、信息集和单位可比的成员；min/median/max 只由成员派生。',
  'filtered、smoothed 与 syntheticRealTime 不得互作别名。',
  '所有 real-rate 对象必须带 horizon、price index、compounding 与 expectation source。',
  '所有 valuation 必须匹配 cash-flow kind、currency、nominal/real 与 claim。',
  'waccEligibility=ineligible 时，waccEstimate 不得成为主估值方法。',
  'APV 与 WACC 税盾只能择一进入总价值。',
  '禁止别名：' + forbiddenAliases.join(', ') + '。',
] as const;

const evidenceGroups = [
  { title: 'A｜Fisher 与测量', text: 'S01–S08 与 S68 支持名义/实际转换、ex ante/ex post、CPI/PCE、FOMC 目标口径、调查与联合期限模型；不把 plug-in 叫严格随机期望。', ids: [...Array.from({ length: 8 }, (_, index) => index + 1), 68] },
  { title: 'B｜SDF、风险与 news', text: 'S09–S19 与 S67 支持状态价格、Euler equation、协方差风险补偿、numeraire、cash-flow/discount-rate news 与 equity required return；不支持 universal discount rate。', ids: [...Array.from({ length: 11 }, (_, index) => index + 9), 67] },
  { title: 'C｜TIPS 合同与期限分解', text: 'S20–S35 支持 Reference CPI、floor、fitted curve、inflation compensation、real/IRP/liquidity/TP 与固定收益坐标；合同、市场观测和结构估计必须分层。', ids: Array.from({ length: 16 }, (_, index) => index + 20) },
  { title: 'D｜r* 定义与 vintage', text: 'S36–S49 从 Wicksell 到现代 state-space、current portals、全球驱动与市场比较；所有 r* 均为带 estimand 和 model vintage 的估计。', ids: Array.from({ length: 14 }, (_, index) => index + 36) },
  { title: 'E｜DCF、WACC 与信用', text: 'S50–S59 与 S69 支持 Gordon、FCFF/FCFE、capital structure、APV/WACC、risk-free consistency、公司债违约/流动性和股票通道；公式资格和 preliminary/teaching 身份必须保留。', ids: [...Array.from({ length: 10 }, (_, index) => index + 50), 69] },
  { title: 'F｜房地产、商品与黄金', text: 'S60–S66 支持住房 user cost/news/long-run discounting、商业地产承销定义、storage/convenience、futures returns 与黄金历史边界；不提供单变量公允值。', ids: Array.from({ length: 7 }, (_, index) => index + 60) },
  { title: 'G｜历史样本边界', text: 'S17 的跨资产样本止于 2015；S28 的核心 TIPS 样本止于 2008；S64 的商品期货样本止于 2010。历史实现和危机证据不等于当前 required return 或固定机制系数。', ids: [17, 28, 64] },
  { title: 'H｜课堂合成数值', text: 'C1–C7、M1–M10、K1–K10 均使用冻结 SYNTHETIC fixtures；来源只支持公式、合同和机制，不为参数现实性、概率或投资含义背书。', ids: [] },
] as const;

function Lesson308Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>实际利率不是一个数字，贴现率也不是一个旋钮：它们是一组有价格指数、期限、状态、索赔权与时钟的跨期价格。</h2>
        <p>把名义利率减去通胀，只完成了最初的单位转换，而且通常还是一个近似。真正的机制链是：名义现金流价格与通胀分布共同界定购买力状态；随机贴现因子按这些状态对支付加权；指数化债券的合同、流动性和期限风险再把状态价格映射为市场 real yield；宏观模型则用另一套反事实条件估计 r*。最后，股票、公司债、物业或商品必须各自加入现金流、风险溢价、融资与制度楔子，才能得到与该索赔权相容的 required return。<Cites ns={[1, 2, 9, 13, 24, 36, 38]} /></p>
        <p>因此，“实际利率上升所以一切资产都跌”不是一条完整理论。相同新闻可能同时上修实际安全曲线、盈利或租金增长、信用风险、流动性需求和中介约束；不同期限的现金流又有不同暴露。研究顺序必须从对象护照出发，先区分恒等式、市场价格、模型估计与因果冲击，再把 benchmark curve、claim-specific premium 和现金流 news 分栏。否则，一个看似精确的贴现率只会把互相冲突的假设藏进单一数字。<Cites ns={[14, 15, 17, 35, 48, 59, 65]} /></p>
        <RealRateTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>先学怎样量出购买力价格，再区分市场实际曲线与 r*；最后才把它们接入不同索赔权。</h2>
        <div className="learning-objectives"><span>核心首读约 100–130 分钟</span><ol>
          <li><b>对象与 Fisher 桥（02–17）：</b>从 3.07 八字段输入、real-rate passport、时钟、ex post/ex ante 到精确恒等式、随机通胀、税与个人价格篮子。</li>
          <li><b>状态定价与 TIPS（18–31）：</b>从 real discount factor、SDF、风险补偿和 certainty equivalent，进入 TIPS 合同、breakeven 分解、市场摩擦与拟合曲线。</li>
          <li><b>自然率与政策 stance（32–39）：</b>区分 Wicksell、现代短期/长期 r*、real-rate gap、filtered/smoothed/real-time vintage，以及 real forward 的边界。</li>
          <li><b>索赔权估值（40–59）：</b>把 nominal/real DCF、期限贴现、公司债、股票、WACC/APV、物业、商品和黄金分别接到自己的现金流与风险楔子。</li>
        </ol></div>
        <p>零背景核心路线是 00、01、02、03、06、07、08、09、10、11、13、18、19、20、21、22、23、24、25、26、27、29、31、32、33、34、35、37、39、40、41、42、43、44、45、46、47、48、50、51、52、53、54、55、56、57、58、59；其余机制用于补足测量边界、反例和复核。每一次看到“real rate”或“discount rate”，先问它支付什么、以什么购买力计价、在哪一期、由谁估计、对谁无风险，再决定能否进入估值。</p>
        <div className="precision-note"><span>章节所有权</span><p>3.02 与 3.04 拥有通胀过程和预期测量；3.05–3.07 拥有政策反应、实施和名义期限结构；3.09–3.10 接手货币、银行信用与贷款率；3.13 合成金融条件；3.16、3.20、4.04、4.16 与 4.17 分别接手房地产、汇率、美债、黄金和股债相关性；Chapter 7 才拥有结构冲击识别。本节只交付带护照、模型范围与索赔权边界的实际贴现状态。</p></div>
      </section>

      {conceptSections.map((section) => <RealRateConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Lab</p>
        <h2>十道合成题要求先通过对象与单位资格，再计算购买力回报、TIPS、r* gap 和索赔权估值。</h2>
        <p>所有题均标记 SYNTHETIC。错答只解释当前选择的缺口，不提前展示正确选项、完整计算、来源或下一题；只有验证正确后才解锁逐步复算。静态客户端无法阻止主动检查源代码，因此门控承诺仅限正常作答界面，不声称具备服务端答案保密能力。</p>
        <RealRateLab />
        <RealRateFixtureAudit />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道静态孪生更换数值或边界，让无脚本、打印与复盘环境也能完成独立迁移。</h2>
        <div className="case-grid" id="real-rate-static-twins">
          {realRateScenarios.map((scenario, index) => (
            <article className="case-card" key={scenario.staticTwin.id}>
              <span>STATIC {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.id} · SYNTHETIC</span>
              <h3>{scenario.staticTwin.title}</h3>
              <p><b>题干：</b>{scenario.staticTwin.prompt}</p>
              <ol className="static-choice-list">{scenario.staticTwin.choices.map((choice) => <li key={choice.id}><b>{choice.id.toUpperCase()}.</b> {choice.label}</li>)}</ol>
              <p><b>逐步复算：</b></p>
              <ol>{scenario.staticTwin.calculations.map((step) => <li key={step}>{step}</li>)}</ol>
              <p><b>标准答案：</b>{scenario.staticTwin.answer}</p>
              <p><b>单位护栏：</b>{scenario.staticTwin.formulaUnits ?? scenario.formulaUnits}</p>
              <p><b>机制来源：</b> <Cites ns={[...scenario.staticTwin.sourceIds]} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks / Glossary</p>
        <h2>掌握标准不是会背 Fisher 式，而是能说明每个实际率的对象、信息集与索赔权，并在资格失败时停止计算。</h2>
        <div className="check-list">{checks.map((check, index) => <div className="check-entry" key={check.question}><details><summary>{index + 1}. {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={[...check.sourceIds]} /></p></details><p className="print-only check-print-answer"><b>{index + 1}. 标准答案：</b>{check.answer} <Cites ns={[...check.sourceIds]} /></p></div>)}</div>
        <div className="term-grid" aria-label="3.08术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces / Reading / Evidence Map</p>
        <h2>本节交付的是可审计的实际贴现状态，而不是一个可以无条件复制到所有资产的“真实利率”。</h2>
        <div className="interface-grid">{interfaces.map(({ name, payload, guardrail }) => <article key={name}><span>{name}</span><h3>交付字段</h3><p><code>{payload}</code></p><em>{guardrail}</em></article>)}</div>

        <div className="precision-note" data-key-coverage={canonicalRealDiscountStateFieldCoverage ? 'complete' : 'incomplete'}><span>3.08 canonical state contract · {canonicalRealDiscountStateFields.length} 个顶层键</span><p><code>{canonicalRealDiscountStateFields.join(', ')}</code>。顶层键同时接受 TypeScript 完整性约束；<code>scope</code> 固定币种、司法辖区、主体与估值时点；<code>inflationPassport</code> 固定价格对象；typed <code>realRateState</code> 显式分开 <code>exPostRealReturn</code>、<code>exAntePlugInRealRate</code>、<code>expectedRealizedRealReturn</code>、<code>observedMarketRealYieldState</code>、<code>modelRealRiskFreeCurve</code> 与 <code>estimatedRealForwardRate</code>；<code>pricingState</code> 与各 valuation state 再按索赔权接入。任何关键边界未知都写 <code>null</code> 并加入 <code>measurementFlags</code>，不能用默认值伪造完整记录。</p></div>
        <div className="precision-note"><span>必须保持的八条合同不变量</span><ol>{contractInvariants.map((invariant) => <li key={invariant}>{invariant}</li>)}</ol></div>
        <div className="precision-note"><span>动态来源不是永恒常数</span><p>下列字段必须随来源快照一并保存。网页上的当前门户、法规、调查或工作论文版本只说明检索时可见状态；发布日期、论文年份、数据 through-date、模型版本和下载日期不得互相替代。</p><ul>{lesson308DynamicSourceRequirements.map((requirement) => <li key={requirement.sourceIds.join('-')}><b>S{requirement.sourceIds.map((id) => String(id).padStart(2, '0')).join(' / S')}：</b><code>{requirement.fields.join(', ')}</code></li>)}</ul></div>

        <h3>Evidence Map · 每组证据先支持一条边，也同时限制不能推出什么</h3>
        <div className="evidence-map" aria-label="3.08连续覆盖69条来源的证据地图" role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} {group.ids.length ? <Cites ns={[...group.ids]} /> : null}</p></div>)}</div>

        <div className="learning-objectives"><span>延伸阅读顺序</span><ol>
          <li><b>第一遍：</b>Fisher、BLS、BEA 与 FRED，做出能区分指数、期限、ex ante/ex post、精确与近似的 real-rate passport。</li>
          <li><b>第二遍：</b>Cochrane、Lucas、Breeden 与 Hansen–Jagannathan，从 <code>p=E(mx)</code> 推到协方差风险补偿，再区分 cash-flow news 与 discount-rate news。</li>
          <li><b>第三遍：</b>TIPS 法规、Treasury 页面、GSW 与 D’Amico–Kim–Wei，逐层分开合同现金流、市场报价、fitted real curve 和 latent decomposition。</li>
          <li><b>第四遍：</b>Wicksell、Woodford、LW/HLW 及 Markets vs r-star，对齐 estimand、期限、filtered/smoothed、current/real-time 和 price-index basis。</li>
          <li><b>第五遍：</b>Gordon、APV/WACC、公司债、住房、storage 与黄金文献；每换一种索赔权，都重写现金流、基准曲线、特有楔子和识别状态。</li>
        </ol></div>
        <p>最小复述是：<b>实际回报先是同窗口名义总回报除以价格总因子；随机通胀下，点预测 plug-in、物理期望和状态定价对象必须分开。TIPS 是有 CPI-U 指数化、滞后、取整和到期本金 floor 的证券，其市场收益率还含 real term premium、流动性、供给、期权和拟合成分；它既不是纯预期实际短率，也不是 r*。r* 是模型和反事实定义下的潜在状态，必须报告 estimand、期限、版本、样本和 vintage。进入资产估值后，名义现金流配名义贴现系统、实际现金流配同指数的实际系统；公司债、股票、物业与商品各自需要 claim-specific premium、现金流或 carry。只有把这些对象、楔子和时钟保留下来，actual price movement 才可能在 Chapter 7 被转化为可证伪的冲击研究。</b></p>
      </section>
    </>
  );
}

export const lesson308: LessonRecord = {
  slug: '3-08',
  id: '3.08',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Real Interest Rate 与 Discount Rate：购买力、r* 与索赔权定价',
  subtitle: '名义现金流价格、通胀分布、状态价格与索赔权楔子怎样共同形成实际贴现率，并经现金流和融资反馈进入债券、股票、房地产与商品',
  readingTime: '核心首读约 100–130 分钟；完整正文与逐式复算约 250–340 分钟；C1–C7 机制实验约 60–85 分钟，互动题首次完成约 35–50 分钟／含复盘约 55–75 分钟，静态变式、检查题与术语约 65–90 分钟；来源与延伸阅读不计',
  prerequisite: '3.02 Inflation、3.04 Inflation Expectations、3.05 Reaction Function、3.07 Yield Curve；按需调用 T02 Compounding / Discounting、T03 Probability / Expectation、T05 Conditional Relation、T06 Balance Sheet、T07 Securities 与 T08 Time / Vintage',
  updatedAt: '2026-09-02',
  revision: '3.08-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.08-r2',
      summary:
        '独立通读 00–63、69 条连续来源及 20 项延伸阅读，审核 C1–C7、M1–M10/K1–K10、typed canonical contract 与全部章节接口；逐项独立复算 15 个 fixture、6 个结构断言和 59 个数值断言，并从权威原始来源核验 TIPS 法规、实际利率与 r*、跨索赔权估值以及 2025–2026 动态材料，最终 P0–P3 为 0，冻结指纹逐项一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.08-r2',
      summary:
        '独立审核零背景教学递进，并在真实浏览器验证首页与相邻导航、64/64 深链、1280/390 视口、0 页面溢出与 0 console error；完成 20 次错答—重做—答对门控、10/10 与刷新恢复、C1–C7、两步重置、畸形存储、三种打印展开状态和无脚本降级，核对 10 个静态孪生、18 道检查、30 个术语、69 条来源与 20 项阅读，P0–P2 为 0，冻结指纹逐项一致。',
    },
  ],
  previous: { slug: '3-07', label: '3.07 Yield Curve' },
  next: { slug: '3-09', label: '3.09 Bank Credit Creation' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson308Content,
  references: lesson308References,
  readingList: lesson308ReadingList,
  readingListOrder: 'source',
};
