import type { ReactNode } from 'react';
import YieldCurveLab from '../components/YieldCurveLab';
import {
  ExpectationsTermPremiumLab,
  HoldingPeriodReturnLab,
  PreferredHabitatDurationLab,
  TermPremiumVintageLab,
  YieldCurveCoordinateLab,
  YieldCurveFixtureAudit,
} from '../components/YieldCurveMechanismLabs';
import YieldCurveTransmissionChart from '../components/YieldCurveTransmissionChart';
import { yieldCurveScenarios } from '../components/yieldCurveScenarios';
import { lesson307ReadingList, lesson307References } from './lesson-3-07-sources';
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

function YieldConceptSection({ section }: { section: ConceptSection }) {
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

type CurvePassport = {
  currency: string;
  issuerClass: string;
  curveFamily: string;
  instrumentSet: string;
  cashFlowConvention: string;
  quoteConvention: string;
  compoundingConvention: string;
  dayCountConvention: string;
  settlementConvention: string;
  curveFitMethod: string;
  methodologyVersion: string;
};

type TermPremiumModelBoundary = {
  modelId: string;
  modelVersion: string;
  sampleStart: string;
  sampleEnd: string;
  vintageAsOf: string;
  jensenConvexityConvention: string;
};

type BoundaryTimestamp = string | null;

type YieldCurveTimestamps = {
  timezone: string;
  quoteObservedAt: BoundaryTimestamp;
  publishedAt: BoundaryTimestamp;
  modelEstimatedAt: BoundaryTimestamp;
  vintageAsOf: BoundaryTimestamp;
  revisedAt: BoundaryTimestamp;
  retrievedAt: BoundaryTimestamp;
  sourceObservedAt?: string;
  announcedAt?: string;
  effectiveAt?: string;
  settledAt?: string;
};

type MaturityCoordinate =
  | { maturityYears: number; maturityDate?: string }
  | { maturityDate: string; maturityYears?: number };

type RateUnit = 'decimalAnnualRate' | 'percentAnnualRate' | 'basisPoints';
type DiscountFactorPoint = MaturityCoordinate & { value: number; unit: 'discountFactor' };
type YieldCurvePoint = MaturityCoordinate & { value: number; unit: RateUnit };
type ForwardIntervalPoint = {
  start: MaturityCoordinate;
  end: MaturityCoordinate;
  value: number;
  unit: RateUnit;
};

type DecompositionEstimateKind = 'modelDefinedTermPremium' | 'additiveResidual';

type DecompositionEstimateRangeMember = {
  modelId: string;
  modelVersion: string;
  sampleStart: string;
  sampleEnd: string;
  vintageAsOf: string;
  jensenConvexityConvention: string;
  estimateKind: DecompositionEstimateKind;
  value: number;
  unit: RateUnit;
};

type DecompositionEstimateRangeContract = {
  maturity: MaturityCoordinate;
  members: readonly [DecompositionEstimateRangeMember, DecompositionEstimateRangeMember, ...DecompositionEstimateRangeMember[]];
  memberKinds: readonly DecompositionEstimateKind[];
  rangeMeaning: 'selectedDecompositionOutputsNotConfidenceInterval';
  min: number;
  median: number;
  max: number;
  width: number;
  unit: RateUnit;
};

type YieldCurveBoundaryState = {
  curvePassport: CurvePassport;
  termPremiumModel: TermPremiumModelBoundary;
  overnightContractType: { venue: string };
  timestamps: YieldCurveTimestamps;
};

type CertaintyEquivalentYieldPoint = MaturityCoordinate & {
  measure: 'physicalP' | 'riskNeutralQ';
  value: number;
  unit: RateUnit;
  jensenConvexityConvention: string;
};

const canonicalBoundaryPaths = [
  'curvePassport.currency', 'curvePassport.issuerClass', 'curvePassport.curveFamily', 'curvePassport.instrumentSet',
  'curvePassport.cashFlowConvention', 'curvePassport.quoteConvention', 'curvePassport.compoundingConvention',
  'curvePassport.dayCountConvention', 'curvePassport.settlementConvention', 'curvePassport.curveFitMethod',
  'curvePassport.methodologyVersion', 'termPremiumModel.modelId', 'termPremiumModel.modelVersion',
  'termPremiumModel.sampleStart', 'termPremiumModel.sampleEnd', 'termPremiumModel.vintageAsOf',
  'termPremiumModel.jensenConvexityConvention', 'decompositionEstimateRange.members[].modelId/modelVersion/sampleStart/sampleEnd/vintageAsOf/jensenConvexityConvention/estimateKind/value/unit',
  'decompositionEstimateRange.maturity.(maturityYears|maturityDate)/members[]/memberKinds/rangeMeaning/min/median/max/width/unit',
  'certaintyEquivalentYields[].measure/(maturityYears|maturityDate)/value/unit/jensenConvexityConvention',
  'discountFactors[].(maturityYears|maturityDate)/value/unit', 'zeroCouponYields[].(maturityYears|maturityDate)/value/unit', 'parYields[].(maturityYears|maturityDate)/value/unit',
  'forwardRates[].start.(maturityYears|maturityDate)/end.(maturityYears|maturityDate)/value/unit', 'overnightContractType.venue', 'timestamps.timezone', 'timestamps.quoteObservedAt',
  'timestamps.publishedAt', 'timestamps.modelEstimatedAt', 'timestamps.vintageAsOf', 'timestamps.revisedAt', 'timestamps.retrievedAt',
] as const;

const canonicalAliasRules = [
  'currency := curvePassport.currency',
  'issuerClass := curvePassport.issuerClass',
  'curveFamily := curvePassport.curveFamily',
  'instrumentSet := curvePassport.instrumentSet',
  'cashFlowConvention := curvePassport.cashFlowConvention',
  'quoteConvention := curvePassport.quoteConvention',
  'compoundingConvention := curvePassport.compoundingConvention',
  'dayCountConvention := curvePassport.dayCountConvention',
  'settlementConvention := curvePassport.settlementConvention',
  'curveFitMethod := curvePassport.curveFitMethod',
  'methodologyVersion := curvePassport.methodologyVersion',
  'termPremiumModelVersion := termPremiumModel.modelVersion',
  'termPremiumVintage := termPremiumModel.vintageAsOf',
  'jensenConvexityConvention := termPremiumModel.jensenConvexityConvention',
] as const;

const canonicalYieldCurveStateFields = [
  'curvePassport', 'currency', 'issuerClass', 'curveFamily', 'instrumentSet', 'cashFlowConvention', 'quoteConvention',
  'compoundingConvention', 'dayCountConvention', 'settlementConvention', 'effectiveOvernightRate', 'overnightContractType',
  'benchmarkMethod', 'benchmarkMeasurementFlag', 'expectedImplementationPath', 'technicalActionSurprise',
  'implementationOutcomeSurprise', 'discountFactors', 'zeroCouponYields', 'parYields', 'forwardRates', 'curveFitMethod',
  'curveFitError', 'curveMeasurementFlag', 'levelFactor', 'slopeFactor', 'curvatureFactor', 'expectedShortRatePath',
  'expectedAverageShortRate', 'certaintyEquivalentYields', 'decompositionConvention', 'jensenConvexityConvention',
  'jensenConvexityAdjustment', 'estimatedYieldTermPremium', 'estimatedForwardTermPremium', 'expectedHoldingPeriodExcessReturn',
  'termPremiumModel', 'termPremiumModelVersion', 'termPremiumVintage', 'decompositionEstimateRange', 'surveyExpectationInput',
  'durationSupplyState', 'riskBearingCapacityState', 'preferredHabitatState', 'safetyConvenienceState',
  'liquidityConvenienceState', 'collateralConvenienceState', 'convexityHedgingState', 'decompositionComponents',
  'decompositionUncertainty', 'eventClock', 'identificationStatus', 'timestamps', 'methodologyVersion',
] as const;

type CanonicalYieldCurveField = (typeof canonicalYieldCurveStateFields)[number];
type YieldCurveCoordinateState = {
  discountFactors: readonly DiscountFactorPoint[];
  zeroCouponYields: readonly YieldCurvePoint[];
  parYields: readonly YieldCurvePoint[];
  forwardRates: readonly ForwardIntervalPoint[];
  certaintyEquivalentYields: readonly CertaintyEquivalentYieldPoint[];
  decompositionEstimateRange: DecompositionEstimateRangeContract;
};
type CanonicalYieldCurveState = { [Field in CanonicalYieldCurveField]: unknown } & YieldCurveBoundaryState & YieldCurveCoordinateState;
type CanonicalYieldCurveKey = Extract<keyof CanonicalYieldCurveState, string>;

const yieldCurveInputFields = [
  'effectiveOvernightRate', 'overnightContractType', 'benchmarkMethod', 'benchmarkMeasurementFlag',
  'expectedImplementationPath', 'technicalActionSurprise', 'implementationOutcomeSurprise', 'timestamps',
] as const satisfies readonly CanonicalYieldCurveKey[];

const conceptSections: ConceptSection[] = [
  {
    id: 'bridge-from-306', number: 2, label: '3.06 → 3.07 Bridge',
    title: '已实现隔夜率只是曲线起点；从实施路径到预期短率还需要明示转换模型。',
    paragraphs: [
      <><code>effectiveOvernightRate</code> 是当前近端已实现价格；<code>expectedImplementationPath</code> 是 3.06 对操作实施的条件判断；<code>expectedShortRatePath</code> 则必须由调查、市场价格或明确状态模型生成。它们位于不同信息层，不允许用改名完成跳跃。</>,
      <>3.06 的八个字段逐字保留：<code>{yieldCurveInputFields.join(', ')}</code>。<code>technicalActionSurprise</code> 与 <code>implementationOutcomeSurprise</code> 继续分栏；它们可以帮助对齐事件时钟，却不自动成为政策或期限溢价 shock。</>,
    ],
    boundary: <><code>expectedImplementationPath ≠ expectedShortRatePath</code>；<code>benchmarkMeasurementFlag</code> 非 clear 时必须传播测量警报，不自动填补曲线。</>,
  },
  {
    id: 'curve-passport', number: 3, label: 'Curve Passport',
    title: '说“收益率曲线”之前，必须先固定币种、发行人、证券集、现金流、报价、方法和时钟。',
    paragraphs: [
      <>曲线不是没有身份的一组点。最低护照要回答币种与发行人、合格证券 universe、是 bid、mid 还是 transaction quote、clean/dirty、结算日、day count、复利和曲线构造方法。关键字段未知就写 <code>unknown</code>，不能默认 USD。<Cites ns={[1, 2, 3, 7, 8]} /></>,
      <>美国财政部 CMT 是基于指示性 bid input 和 monotone-convex 方法导出的 par curve；GSW 则是 Board staff 从 off-the-run 证券估计的 NSS zero/forward 产品。二者都可被叫作“Treasury curve”，但输入、坐标和机构身份不同。<Cites ns={[1, 3, 4]} /></>,
    ],
    formula: { label: '对象恒等式', expression: <code>curve = passport + quotes + construction method + vintage</code>, note: <>先验证对象一致，才允许比较数值。</> },
  },
  {
    id: 'curve-vintage', number: 4, label: 'Quote & Vintage Clock',
    title: '交易、观察、发布、模型估计、修订与下载是六个不同时钟。',
    paragraphs: [
      <>今日下载的历史曲线可能已使用事后全样本参数、证券筛选变化或方法修订；它不是当时投资者必然可见的 real-time vintage。研究记录至少保存 <code>quoteObservedAt、publishedAt、modelEstimatedAt、vintageAsOf、revisedAt、retrievedAt</code>。<Cites ns={[1, 4, 6, 8, 35]} /></>,
      <>门户页的 last updated 不能改写论文年份。GSW 的正式论文是 2007，Kim–Wright 是 2005 FEDS，Kiley 是 2024 FEDS；动态数据页面的后续更新只属于产品时钟。<Cites ns={[3, 31, 35, 43]} /></>,
    ],
  },
  {
    id: 'cash-flow-contract', number: 5, label: 'Cash-flow Contract',
    title: '债券首先是一组有金额和日期的现金流，而不是一个“利率数字”。',
    paragraphs: [
      <>第 <code>k</code> 笔现金流 <code>CFₖ</code> 在 <code>Tₖ</code> 支付，今日价格等于每笔支付乘以自己到期日的贴现因子。到这一步还没有 YTM、预期短率或期限溢价；只有合约与价格。<Cite n={10} /></>,
      <>两只债即使到期日相同，只要 coupon、日计数、结算、可赎回性或本金路径不同，就不是同一现金流对象。先对齐现金流，才能用价差谈套利。</>,
    ],
    formula: { label: '贴现因子定价', expression: <code>Bₜ = Σₖ CFₖ Dₜ(Tₖ)</code>, note: <>这里的现金流被视为确定、无违约且不随状态变化，并与贴现因子使用同一币种、numeraire 和结算口径；可赎回、信用或其他状态依赖现金流需要状态定价或期权模型。</> },
  },
  {
    id: 'clean-dirty', number: 6, label: 'Clean / Dirty Price',
    title: '报价与实际结算金额不同；付息日历可以制造看似的价格跳变。',
    paragraphs: [
      <>票息债在两个付息日之间已累积一部分利息。市场 clean quote 排除 accrued interest，买方实际交付的 dirty price 则把它加回。普通付息日、yield 不变时，未把 coupon 现金流并入财富的 dirty/cash price 会机械下跳；clean quote 的目的正是剥离大部分应计锯齿。<Cite n={10} /></>,
      <>因此 clean-price change 仍不是投资者总财富回报：它遗漏 accrued-interest 变化以及已收到的 coupon。总回报必须使用现金流一致的 dirty prices，并把持有期内 coupon 一起计入。</>,
      <>所以 M1/K1 明确把估值日放在付息日，accrued interest 为零，并规定还剩五笔年票息。这些不是琐碎描述，而是保证题目只有一个答案的合约边界。</>,
    ],
    formula: { label: '结算恒等式', expression: <code>Pdirty = Pclean + accrued interest</code>, note: <>日计数、付息频率、除息日与结算日一起决定 accrued interest。</> },
  },
  {
    id: 'discount-factor', number: 7, label: 'Discount Factor',
    title: '贴现因子是跨期限价格的原始坐标；收益率是对价格的年化转换。',
    paragraphs: [
      <><code>Dₜ(T)</code> 表示今日为到期日 <code>T</code> 的一单位确定支付付出多少价格。在连续复利下，到期年数为 <code>τ</code> 的 zero yield 通过取对数得到。收益率的数字取决于复利和年化约定，底层价格却没有改变。<Cites ns={[3, 7, 10]} /></>,
      <>把 discount factor 当作原始状态有一个重要好处：同一组价格可以一致地生成 zero、par 和 forward，从而把“坐标转换”与“经济归因”分开。</>,
    ],
    formula: { label: '连续复利 zero', expression: <><code>Dₜ(T)=exp[−τyₜ(T)]</code><br /><code>yₜ(T)=−ln Dₜ(T)/τ</code></>, note: <><code>y</code> 在计算中是年化小数，页面显示为百分比。</> },
  },
  {
    id: 'yield-to-maturity', number: 8, label: 'Yield to Maturity',
    title: 'YTM 用一个内部收益率压缩单只票息债的多笔现金流，因而必然丢失曲线信息。',
    paragraphs: [
      <>YTM 是使债券全部现金流现值等于 dirty price 的单一内部收益率。这个数值依赖付息频率、day count 与复利报价；同一价格在不同报价约定下可以显示不同年化数字。<Cites ns={[10, 16]} /></>,
      <>即使数学上已求得 YTM，它也不是这只债在下一持有期的必然回报；若要把它解释为持有到期的实现复合收益，还另需无违约、票息按同一 YTM 再投资等假设。只要中途卖出，剩余现金流将按届时整条曲线重新定价。</>,
    ],
    formula: { label: '年付息示例', expression: <code>Pdirty = Σₖ CFₖ/(1+YTM)^τₖ</code>, note: <>若每年付 <code>m</code> 次，分母、期数与年化口径都要相应调整。</> },
  },
  {
    id: 'zero-yield', number: 9, label: 'Zero-coupon Yield',
    title: 'zero yield 只对应一笔到期支付，却通常仍需要从可交易债券中估计。',
    paragraphs: [
      <>零息现金流避免了一只 coupon bond 同时混入多个到期贴现因子。但市场并不在所有期限都有无摩擦的纯 zero，因此实际 zero curve 往往依赖 STRIPS、bootstrap 或平滑模型。<Cites ns={[3, 7, 9]} /></>,
      <>这个转换减少了 coupon 现金流混合，却没有消除报价误差、证券选择、流动性与拟合误差。所以 zero 也需要 curve passport 和 measurement flag。</>,
    ],
  },
  {
    id: 'par-yield', number: 10, label: 'Par Yield',
    title: 'par yield 是使假想新券价格恰好等于面值的 coupon rate，它使用到期前全部贴现因子。',
    paragraphs: [
      <>将本金归一为 1，第 <code>k</code> 个付息区间的年分数为 <code>Δₖ</code>，使新券理论价格为 1 的 coupon <code>c(T)</code> 由整条到期前 discount curve 共同决定。因此同期限 par yield 一般不等于 zero yield。<Cites ns={[1, 2, 10]} /></>,
      <>官方 Treasury CMT 是 par curve，而不是零息或期限溢价曲线。如果图例只写“10Y yield”，读者无法判断它是单券 YTM、CMT par、zero 还是模型 forward。</>,
    ],
    formula: { label: '年付息 par coupon', expression: <code>cₜ(T) = [1−Dₜ(T)] / Σₖ ΔₖDₜ(Tₖ)</code>, note: <>给定全部 discount factors 才能复算 par coupon。</> },
  },
  {
    id: 'forward-rate', number: 11, label: 'Forward Rate',
    title: 'forward rate 是今日由两个到期价格锁定的未来区间价格，不是一个中点 spot。',
    paragraphs: [
      <>连续复利下，<code>[m,n]</code> 区间 forward 由 <code>D(m)</code> 和 <code>D(n)</code> 的对数差决定。它表示今日约定从 <code>m</code> 到 <code>n</code> 的融资条件；把数值画在区间中点只是视觉排布，不会把它变成 spot point。<Cites ns={[3, 7, 10]} /></>,
      <>瞬时 forward 的精确价格定义是 <code>fₜ(T)=−∂ ln Dₜ(T)/∂T</code>，求导方向是到期日 <code>T</code>，不是日历时点 <code>t</code>。这里 <code>Dₜ(T)</code> 继续表示本节从现金流价格恢复的零息贴现因子；一般不能把该导数直接写成某个测度下的未来短率期望。要获得期望解释，还需指定测度、风险价格和 Jensen 约定。<Cites ns={[20, 25]} /></>,
    ],
    formula: { label: '连续复利区间 forward', expression: <code>fₜ(m,n) = −[ln Dₜ(n)−ln Dₜ(m)]/(n−m)</code>, note: <>数据契约必须保存左右端点，不仅保存一个数值。</> },
  },
  {
    id: 'compounding-units', number: 12, label: 'Compounding / Day Count',
    title: '同一价格可以用不同复利与年化坐标表达；比较前必须先统一口径。',
    paragraphs: [
      <>年度有效率 <code>yEA</code> 与连续复利率 <code>yc</code> 满足 <code>yc=ln(1+yEA)</code> 和 <code>yEA=exp(yc)−1</code>。simple、bond-equivalent、semiannual 和 continuous rate 的数字不可直接相减。<Cites ns={[2, 7, 10]} /></>,
      <>day-count convention 决定两个日期之间的 year fraction，支付频率决定复利次数。小数、百分比和 basis point 也必须分栏：<code>0.005=0.5%=50bp</code>。</>,
    ],
    formula: { label: '复利坐标转换', expression: <><code>yc = ln(1+yEA)</code><br /><code>yEA = exp(yc)−1</code></>, note: <>公式中的利率是小数；页面展示时再转成 % 或 bp。</> },
  },
  {
    id: 'bootstrap', number: 13, label: 'Bootstrap',
    title: 'bootstrap 从短到长剥离已知现金流，递归恢复未知贴现因子。',
    paragraphs: [
      <>一年面值债先给出 <code>D1</code>；两年面值债的第一年 coupon 可用已知 <code>D1</code> 贴现，剩余价格才对应 <code>D2</code>。这种“先剥已知、后求未知”的递归是从 par input 到 zero curve 的最小原型。<Cites ns={[1, 7, 10]} /></>,
      <>现实报价期限不连续，现金流日期不完全对齐，价格也含证券特定误差。因此 bootstrap 结果会将输入误差向后传播，通常需要证券筛选、interpolation 和残差审计。</>,
    ],
    formula: { label: '两步示例', expression: <><code>1=(1+c1)D1</code><br /><code>1=c2D1+(1+c2)D2</code></>, note: <>面值归一为 1，年付息；其他频率需改写现金流。</> },
  },
  {
    id: 'interpolation', number: 14, label: 'Interpolation',
    title: '连续曲线是从有限市场报价中构造出来的测量对象，平滑不等于真实。',
    paragraphs: [
      <>可交易债券只在离散到期日有报价，一条日度连续曲线必然包含方法选择。monotone-convex、Nelson–Siegel/Svensson 和 spline 对局部 forward 和曲率的影响不同。<Cites ns={[1, 3, 7, 8]} /></>,
      <>一条视觉平滑的曲线可以在样本外产生不稳定 forward，也可以牺牲局部价格误差来换取全局外观。合格输出要同时报告方法、参数版本、拟合残差与被剔除证券。</>,
    ],
  },
  {
    id: 'security-selection', number: 15, label: 'Security Selection',
    title: '单券的流动性、税务、可赎回性和 repo specialness 会污染对一般期限结构的估计。',
    paragraphs: [
      <>on-the-run 债通常流动性更高，STRIPS 没有 coupon 现金流混合，可赎回债却包含期权。采用 off-the-run、STRIPS 或剔除 special 证券，都是在减少某种证券特定 wedge，但同时改变了被估计的对象。<Cites ns={[3, 4, 9]} /></>,
      <>单券 rich/cheap 不能自动命名为期限溢价。它可能反映交易便利、税务、抵押需求、交割选择或差的报价；这些都应先进入 security-level measurement flag。</>,
    ],
  },
  {
    id: 'multi-curve-guard', number: 16, label: 'Multi-curve Guard',
    title: '政府债、OIS、swap 和信用债代表不同合约与价格系统，未经映射不可静默互换。',
    paragraphs: [
      <>币种相同不意味 discount curve 相同。政府债含安全、流动与抵押便利，OIS 反映特定隔夜指数现金流，swap 还有对手方、CSA 和 projection 口径。未固定 numeraire、现金流和抵押约定前，不能把价差全归于预期。<Cites ns={[10, 20]} /></>,
      <>本节只保留这一个最低 guard，不展开危机后 OIS discounting、multi-curve projection 与 basis 的完整制度。若后续实现扩展此处，必须新增专门一手资料，不能让一本教材承担现行制度证据。</>,
    ],
  },
  {
    id: 'law-one-price', number: 17, label: 'Law of One Price',
    title: '现金流复制约束同一时点的横截面价格，却不决定真实概率或预期回报。',
    paragraphs: [
      <>两个组合若在每个状态支付完全相同的现金流，在无摩擦基准中应有同一价格；否则可买便宜组合、卖贵组合锁定差价。交易成本、融资、做空和资产负债表约束会将点状套利变成套利带，却不取消复制基准。<Cites ns={[10, 20]} /></>,
      <>无套利可以说明 zero、par 和 forward 必须来自一致的 discount factors，但它不会说明今日 forward 就是未来 spot 的无偏预测。要走到预测，必须再对预期回报和风险价格施加额外限制。</>,
    ],
    after: <YieldCurveCoordinateLab />,
  },
  {
    id: 'bond-recursion', number: 18, label: 'One-period Bond Recursion',
    title: '今日长债价格连接下一期的短率与届时剩余曲线，因此天然是跨状态对象。',
    paragraphs: [
      <>设 <code>Pₜ⁽ⁿ⁾</code> 是剩余 <code>n</code> 期零息债价格，下一期它变成 <code>Pₜ₊₁⁽ⁿ⁻¹⁾</code>。随机贴现因子 <code>Mₜ₊₁</code> 给每个未来状态的价值以不同权重，今日价格是加权后的条件期望。<Cites ns={[20, 25]} /></>,
      <>这个递推说明为什么“买入时收益率”不能封住一期回报：一年后的售价依赖届时整条剩余曲线，而这条曲线在今日是随机的。</>,
    ],
    formula: { label: '一期递推', expression: <code>Pₜ⁽ⁿ⁾ = Eₜ[Mₜ₊₁ Pₜ₊₁⁽ⁿ⁻¹⁾]</code>, note: <>价格、SDF 与未来剩余债券必须使用同一 numeraire 和状态空间。</> },
  },
  {
    id: 'sdf-risk-compensation', number: 19, label: 'SDF & Risk Compensation',
    title: '期限风险补偿取决于债券回报在高边际价值状态中的表现，而不只是到期年数。',
    paragraphs: [
      <>所有可定价 gross return 都满足 <code>1=Eₜ[Mₜ₊₁Rₜ₊₁]</code>。长债若在投资者边际价值高的坏状态表现差，它与 SDF 负协方差，才需要更高条件预期回报作为补偿。<Cites ns={[15, 20]} /></>,
      <>这也说明期限溢价不必永远为正。若长债在特定坏状态提供对冲、安全或流动便利，投资者可以接受更低预期回报。风险的方向必须从状态支付而非年限标签推导。</>,
    ],
    formula: { label: '协方差定价', expression: <code>Eₜ[Rₜ₊₁]−Rᶠ,ₜ = −Covₜ(Mₜ₊₁,Rₜ₊₁)/Eₜ[Mₜ₊₁]</code>, note: <>比较基准、持有期与 gross/log 口径要一致。</> },
  },
  {
    id: 'p-q-measures', number: 20, label: 'P-measure / Q-measure',
    title: '现实测度描述事件频率，风险中性测度把风险价格吸收进定价概率；二者不可互换。',
    paragraphs: [
      <>P-measure 动态回答研究者认为未来状态如何发生，Q-measure 则将风险价格嵌入状态权重，使之可以像用短率折现一样便捷地定价。同一状态变量在 P 与 Q 下可以有不同转移规律。<Cites ns={[20, 25]} /></>,
      <>Q-expected short rate 不是调查预测，也不是现实世界最可能路径。它是一个定价对象；P/Q 差异才为风险补偿与期限溢价分解提供空间。</>,
    ],
    formula: { label: '教学单曲线 Q 定价', expression: <code>Pₜ⁽ⁿ⁾ = Eₜ^Q[exp(−Σⱼ₌₀ⁿ⁻¹ rₜ₊ⱼ)]</code>, note: <><code>r</code> 是与每个离散步长匹配的一期连续复利短率（等价地，该步的 log discount rate）；若输入是年化短率而步长为 <code>Δ≠1</code> 年，指数中使用 <code>rΔ</code>。这是带明确 numeraire 与离散时间约定的教学形式，不是实现多曲线定价的通用代码。</> },
  },
  {
    id: 'jensen-boundary', number: 21, label: 'Jensen / Convexity Boundary',
    title: '即使在风险中性测度下，先取期望再取对数也不等于先取对数再平均。',
    paragraphs: [
      <>债券价格是指数折现项的条件期望，yield 又是对价格取负对数并年化。因为 <code>E[exp(−X)] ≠ exp(−E[X])</code>，收益率一般不是未来短率的精确算术平均。<Cites ns={[20, 25, 60]} /></>,
      <>不同期限溢价产品对 Jensen/convexity 项处理不同：可以单列，也可以吸收进 term premium。比较 ACM、KW 或 survey residual 前，必须先对齐 <code>jensenConvexityConvention</code>，否则同名字段可以包含不同对象。</>,
    ],
    formula: { label: '风险中性 certainty-equivalent yield', expression: <code>yₜ⁽ⁿ⁾ = −(1/n) ln Eₜ^Q[exp(−Σ r)]</code>, note: <>这个非线性操作正是必须保存 Jensen convention 的原因。</> },
  },
  {
    id: 'yield-term-premium', number: 22, label: 'Yield Term Premium',
    title: '期限溢价是给定模型、样本、测度和凸性约定后的估计或定义残差，不是直接观测值。',
    paragraphs: [
      <>可以在 P-measure 下用未来短率路径的 certainty-equivalent price 构造 <code>yᴾ</code>，再定义 <code>TP=y−yᴾ</code>。令 <code>Jᴾ≡yᴾ−average Eᴾ[r]</code>；在本节指数折现与同一步长口径下，由 Jensen 不等式有 <code>Jᴾ≤0</code>。某些资料把其绝对幅度称作正的 convexity adjustment，不能把两套符号直接相加。教学加法式必须固定这一符号与是否吸收约定。<Cites ns={[19, 31, 34]} /></>,
      <>数据名必须写 <code>estimatedYieldTermPremium</code> 或 <code>additiveResidualTermPremium</code>，不允许 <code>observedTermPremium</code> 或 <code>trueTermPremium</code>。safety、liquidity、collateral、supply、clientele 和 intermediary capacity 是影响价格并可被总 TP 吸收的机制来源；除非另行识别 pure risk premium，不得把它们再并列相加而双重计数。</>,
    ],
    formula: { label: '模型定义与教学近似', expression: <><code>yᴾ=−(1/n)ln Eₜᴾ[exp(−Σr)]</code><br /><code>Jᴾ≡yᴾ−average Eᴾ[r]</code><br /><code>estimated TP≡y−yᴾ</code><br /><code>y = average Eᴾ[r] + Jᴾ + estimated TP</code></>, note: <>这里沿用 §20 的步长与 <code>r</code> 口径；若产品把 <code>Jᴾ</code> 吸收进其 TP 定义，就不得再次单列。最后一行是定义相容的加法桥，不替代精确债券定价。</> },
  },
  {
    id: 'expectations-hypothesis', number: 23, label: 'Expectations Hypothesis',
    title: '“预期假说”是一组对远期率、未来短率或持有期超额回报施加限制的命题。',
    paragraphs: [
      <>最强版本可以要求相应条件预期超额回报为零；弱一些的版本允许非零但不随时间变化的期限补偿。不同持有期、复利和非线性近似会使这些版本不完全等价。<Cites ns={[11, 12, 13, 18]} /></>,
      <>所以“预期假说被拒绝”必须说明哪一个版本、哪个期限、什么数据与检验方程。经验失败提示时变风险补偿或模型错定，却不会把每一次曲线变化都唯一归因于 TP。</>,
    ],
  },
  {
    id: 'forward-not-forecast', number: 24, label: 'Forward ≠ Forecast',
    title: '远期率是今日的无套利价格，未来 spot 是新信息到来后才实现的价格。',
    paragraphs: [
      <>有效年复利下，<code>(1+z2)²=(1+z1)(1+f1,2)</code> 只说明今日的两年投资与“一年后按已锁定 forward 继续投资”的价格一致。它没有说一年后的实现 spot 一定等于 forward。<Cites ns={[12, 13, 18]} /></>,
      <>未来 spot 与今日 forward 的差异可来自新闻、预期更新、时变风险补偿和测量误差。因此在没有模型与测度约定时，应把 forward 称为市场价格，不是“市场预测”。</>,
    ],
  },
  {
    id: 'survey-path', number: 25, label: 'Survey & Policy Path',
    title: '调查和政策沟通能约束持久短率过程，却都不是市场边际定价者的无误差真信念。',
    paragraphs: [
      <>长期短率的均值回归速度与长期均值很难从有限样本单独估计。专业调查可为远端预期提供外部约束，政策沟通则可限定近期条件路径。<Cites ns={[19, 31, 32]} /></>,
      <>但调查有异质性、发布滞后和量化误差，政策路径又是条件的。数据应分别保存 survey mean/distribution、模型 P-measure expectation 和 marginal-pricing belief；不得用一个 <code>marketExpectation</code> 吞并它们。</>,
    ],
    after: <ExpectationsTermPremiumLab />,
  },
  {
    id: 'holding-period-return', number: 26, label: 'Holding-period Return',
    title: '持有一期后的回报由今日买入价与下一期剩余债券价格共同决定。',
    paragraphs: [
      <>对零息债，令 <code>p=ln P</code>，一期对数回报是下一期剩余 <code>n−1</code> 期债价格对数减今日 <code>n</code> 期债价格对数。如果有 coupon，还要把持有期内收到的现金流放回 gross return。<Cites ns={[10, 14]} /></>,
      <>YTM 是由给定价格与合约现金流解出的内部收益率；这个数学定义本身不要求真的持有到期或再投资。只有把 YTM 解释为 realized compound return 时，才需要持有到期、无违约并将票息按同率再投资。它不等于一期 realized return，也不等于条件 expected return。</>,
    ],
    formula: { label: '零息债一期对数回报', expression: <code>rₜ₊₁⁽ⁿ⁾ = pₜ₊₁⁽ⁿ⁻¹⁾−pₜ⁽ⁿ⁾</code>, note: <>日期、持有期、coupon 和 clean/dirty 必须先固定。</> },
  },
  {
    id: 'excess-bond-return', number: 27, label: 'Excess Bond Return',
    title: '长债超额回报必须减去同币种、同持有期、同融资口径的短债机会成本。',
    paragraphs: [
      <>一期对数超额回报是长债对数回报减去一期短债的 log gross return。这里定义 <code>rᶠₜ,ₜ₊₁≡−ln Pₜ⁽¹⁾</code>；若输入是一周期 effective yield <code>yEA</code>，同一项应写成 <code>ln(1+yEA)</code>。simple 与 log 在小变化时接近，却不是同一对象。<Cites ns={[12, 14]} /></>,
      <><code>estimatedYieldTermPremium</code>、<code>estimatedForwardTermPremium</code> 与 <code>expectedHoldingPeriodExcessReturn</code> 相关但不同。它们的期限、持有期、价格坐标和 Jensen 处理都应进入字段名或附带元数据。</>,
    ],
    formula: { label: '对数超额回报', expression: <code>rxₜ₊₁⁽ⁿ⁾ = pₜ₊₁⁽ⁿ⁻¹⁾−pₜ⁽ⁿ⁾−rᶠₜ,ₜ₊₁</code>, note: <>最后一项是同币种、同持有期、同融资口径的短债 log gross return。</> },
  },
  {
    id: 'duration', number: 28, label: 'Duration',
    title: 'modified duration 是价格对小幅、近似平行收益率变化的一阶敏感度，不是到期年限。',
    paragraphs: [
      <>同样 10bp 收益率变化对长久期债造成更大价格波动，因为更多现金流权重处在遥远日期。modified duration 把这个一阶关系压成 <code>ΔP/P≈−DmodΔy</code>。<Cite n={10} /></>,
      <>这个近似默认小变化与近似平行移动。曲线 twist 或 butterfly 需要 key-rate duration 等多维暴露；duration 也会随价格和收益率重新计算。</>,
    ],
    formula: { label: '一阶价格近似', expression: <code>ΔP/P ≈ −Dmod × Δy</code>, note: <><code>Δy</code> 使用小数；50bp 等于 0.005。</> },
  },
  {
    id: 'ordinary-convexity', number: 29, label: 'Ordinary Convexity',
    title: '普通凸性是 duration 局部直线近似的二阶修正，不是精确重定价公式。',
    paragraphs: [
      <>对无嵌入期权的普通债，价格—收益率曲线通常呈正凸性；因此在同等绝对利率变化下，上涨增量会略大于下跌损失。二阶项使用 <code>(Δy)²</code>，所以在正凸性下两个方向都为正修正。<Cites ns={[10, 55]} /></>,
      <>它不等于 MBS 负凸性，也不等于 futures convexity adjustment。M6/K6 的答案必须标为 second-order approximation，不能用“精确价格变化”命名。</>,
    ],
    formula: { label: 'Duration–convexity 二阶近似', expression: <code>ΔP/P ≈ −DmodΔy + ½C(Δy)²</code>, note: <>较大变化、非平行移动或嵌入期权需要重新定价。</> },
  },
  {
    id: 'fama-bliss', number: 30, label: 'Fama–Bliss',
    title: '远期—即期差不只预测未来短率，也可以与后续债券超额回报关联。',
    paragraphs: [
      <>Fama–Bliss 的经验设计把远期利差中的信息分别与后续短率变化和长债超额回报联系。结果提醒我们：forward 不能只用 pure expectations 解释。<Cite n={12} /></>,
      <>但回归系数依赖样本、期限、持有期与误差处理，重叠回报还会产生序列相关。经典样本结论不是跨 regime 稳定交易规则。</>,
    ],
  },
  {
    id: 'campbell-shiller', number: 31, label: 'Campbell–Shiller',
    title: '预期假说对未来累计短率和长债价格变化施加联合限制，不是只观察一个 slope。',
    paragraphs: [
      <>经典结果显示，当长短利差较高时，长率后续变化常与简单预期假说的方向或幅度不符，提示预期超额回报可以随时间变化。<Cites ns={[13, 18]} /></>,
      <>一次倒挂仍然没有唯一原因。它可能来自未来降息路径、长端期限溢价下降、短端技术压力或几项同时发生。形状是症状，不是识别策略。</>,
    ],
  },
  {
    id: 'return-predictability', number: 32, label: 'Cochrane–Piazzesi Factor',
    title: '整条远期曲线中的共同信息可被压成超额回报预测因子，但统计因子不是结构冲击。',
    paragraphs: [
      <>多个 forward rates 的 tent-shaped 线性组合在特定样本中能预测多期限债券超额回报，说明时变 expected return 的信息不只位于一个 long-minus-short slope。<Cite n={14} /></>,
      <>但这个统计组合不能直接命名为“风险偏好 shock”。系数、标准化、样本端点与样本外表现都可以漂移；研究应同时报告时间窗口与识别状态。</>,
    ],
    after: <HoldingPeriodReturnLab />,
  },
  {
    id: 'level-factor', number: 33, label: 'Level',
    title: 'level 压缩大多数期限共同移动的部分，是统计摘要而不是经济原因。',
    paragraphs: [
      <>level 可以用长端 yield、多期限平均或第一主成分表示。三种定义通常高度相关，却不数值相同，所以 <code>levelFactor</code> 必须携带计算方法与期限 universe。<Cites ns={[21, 23]} /></>,
      <>高 level 可以来自较高长期通胀预期、更高实际短率路径、期限溢价上升或测量对象改变。因此 level 不是长期通胀预期的别名。</>,
    ],
  },
  {
    id: 'slope-factor', number: 34, label: 'Slope',
    title: 'slope 是端点相对价格的压缩，相同变化可由短端或长端的完全不同动作生成。',
    paragraphs: [
      <>常见代理变量是 <code>y10−y2</code>，也可以用第二主成分或 NS 的 slope loading。长端不变而短端上升，与短端不变而长端下降，都会使 slope 变小，但对现金价格与宏观解释的含义不同。<Cites ns={[13, 21, 23]} /></>,
      <>因此报告 slope 时必须保留原始端点 yield 和变化。单一“曲线变平”标签会丢失哪一端动、价格是涨是跌以及路径/TP 哪个成分改变。</>,
    ],
  },
  {
    id: 'curvature-factor', number: 35, label: 'Curvature',
    title: 'curvature 描述中段相对两端的隆起或凹陷，其符号和幅度取决于期限选择。',
    paragraphs: [
      <>一个简单代理是 <code>2y5−y2−y10</code>，也可使用第三主成分或 NS 曲率载荷。若换成 1Y/7Y/30Y，统计对象也随之变化。<Cites ns={[21, 23]} /></>,
      <>中段隆起可来自预期的政策周期、发行供给、特定客户群、局部流动性或拟合方法。curvature 只是形状坐标，不能自动翻译为“市场预期中期降息”。</>,
    ],
  },
  {
    id: 'nelson-siegel', number: 36, label: 'Nelson–Siegel',
    title: 'Nelson–Siegel 用三个载荷压缩 level、slope 和 curvature，但原始形式不是动态无套利模型。',
    paragraphs: [
      <>第一个载荷恒为 1，第二个从 1 衰减至 0，第三个在两端都趋近 0 而中间隆起。因此 <code>y(0)=β0+β1</code>、<code>y(∞)=β0</code>；<code>λ</code> 的单位必须与期限单位互逆，使 <code>λτ</code> 无量纲。<Cite n={21} /></>,
      <>三因子拟合便于压缩与可视化，却不会仅因为名字像 level/slope/curvature 就识别出宏观结构。也不能由良好拟合推出跨时期价格无套利。</>,
    ],
    formula: { label: 'Nelson–Siegel yield curve', expression: <code>y(τ)=β0+β1[(1−e^−λτ)/(λτ)]+β2[(1−e^−λτ)/(λτ)−e^−λτ]</code>, note: <>页面中的参数都是 synthetic；不把拟合因子直接命名为结构 shock。</> },
  },
  {
    id: 'svensson-nss', number: 37, label: 'Svensson / NSS',
    title: 'NSS 增加第二个曲率载荷，提高复杂形状的拟合能力，也增加参数不稳定。',
    paragraphs: [
      <>定义 <code>L1(x)=(1−exp(−x))/x</code>、<code>L2(x)=L1(x)−exp(−x)</code>，NSS 在 NS 的一个 slope 和一个 curvature 外增加使用第二个 decay parameter 的 curvature term。<Cites ns={[3, 22]} /></>,
      <>额外自由度可以降低截面残差，也可造成参数共线、局部最优和远端 forward 不稳定。因此曲线方法必须保存参数、优化起点、约束与版本。</>,
    ],
  },
  {
    id: 'dynamic-ns', number: 38, label: 'Dynamic Nelson–Siegel',
    title: 'DNS 让三个形状因子随时间演化，从而预测整条曲线而非逐期限独立预测。',
    paragraphs: [
      <>将每日曲线压成 <code>β0t、β1t、β2t</code> 后，可以用 VAR 或其他时间序列动态生成未来因子，再通过固定载荷还原整条曲线。<Cite n={23} /></>,
      <>好的预测表现不等于风险价格已被结构识别。如果 DNS 未施加跨期无套利，它仍主要是统计状态空间模型，不能直接输出 model-consistent TP。</>,
    ],
  },
  {
    id: 'afns', number: 39, label: 'Arbitrage-free Nelson–Siegel',
    title: 'AFNS 把 Nelson–Siegel 型载荷嵌入一致的短率过程与风险中性动态，连接截面与时间。',
    paragraphs: [
      <>原始 NS 用于截面拟合，AFNS 则限制状态动态和风险价格，使所有期限价格能由同一无套利递推生成。<Cite n={24} /></>,
      <>无套利限制可以减少自由度并提高内部一致性，却不保证预测最优、状态命名唯一或期限溢价为直接观测量。</>,
    ],
  },
  {
    id: 'affine-dtsm', number: 40, label: 'Affine DTSM',
    title: '仿射期限结构模型用少数状态同时约束短率、风险价格与所有到期债券价格。',
    paragraphs: [
      <>在典型 affine DTSM 中，短率是状态向量 <code>Xₜ</code> 的仿射函数，零息债对数价格也写成 <code>Aₙ+Bₙ′Xₜ</code>。一旦给定 P-measure 状态动态和风险价格，Q-measure 动态便通过无套利递推把所有期限连接起来。<Cites ns={[20, 25, 26]} /></>,
      <>同一组状态在 P 下描述研究者估计的现实演化，在 Q 下负责定价。两者的差异产生风险补偿；只估一条截面曲线却没有状态动态，不能完成这种分解。</>,
    ],
    formula: { label: '典型仿射表示', expression: <><code>rₜ=δ₀+δ₁′Xₜ</code><br /><code>ln Pₜ⁽ⁿ⁾=Aₙ+Bₙ′Xₜ</code></>, note: <>系数来自模型递推，不是把每个期限各自做一次无约束回归。</> },
    boundary: <>Affine 是函数形式和条件假设，不是现实真值；状态维数、分布、风险价格和零下限处理都会改变分解。</>,
  },
  {
    id: 'essentially-affine', number: 41, label: 'Essentially Affine',
    title: '更灵活的风险价格可以改善收益率预测，却也扩大模型可把同一价格解释成不同补偿的空间。',
    paragraphs: [
      <>essentially affine 规范放宽较早模型对市场风险价格的限制，使条件 expected excess return 能随更多状态变化。这有助于同时面对收益率截面和预测回归中的时变风险补偿。<Cites ns={[18, 27]} /></>,
      <>灵活性并不免费：弱持久性识别、参数共线和样本选择可能让样本内拟合改善，而远端预期路径或 TP 大幅漂移。比较模型时要同时看价格误差、回报预测、参数稳定性和经济限制，不能只选拟合最好的版本。</>,
    ],
  },
  {
    id: 'identification-estimation', number: 42, label: 'Identification & Estimation',
    title: '收益率拟合得几乎一样的模型，仍可能给出很不一样的现实短率路径与期限溢价。',
    paragraphs: [
      <>潜在状态可以旋转或重新缩放；高度持久短率过程又使长期均值在有限样本中难以估计。若不同参数组合生成近似相同的 Q-measure 价格，却对应不同 P-measure 动态，横截面拟合无法单独识别分解。<Cites ns={[28, 29, 33]} /></>,
      <>因此估计报告不能停在 likelihood 或 RMSE。至少要保存初始化、约束、样本端点、优化诊断、参数不确定性、调查输入和 vintage，并检查分解是否对合理替代规范稳定。</>,
    ],
    boundary: <>“无套利模型可估计”与“经济成分已识别”是两件事；后者还需要数据变化和限制真正区分竞争解释。</>,
  },
  {
    id: 'acm-model', number: 43, label: 'ACM',
    title: 'ACM 用收益率因子、因子创新与债券超额回报的线性回归构造可扩展的期限溢价估计。',
    paragraphs: [
      <>ACM 的吸引力在于将高维无套利定价拆成一组线性回归：先提取收益率因子和状态动态，再用跨期限超额回报对因子创新与滞后状态的暴露估计风险价格，最后递推出各期限价格与分解。<Cite n={30} /></>,
      <>这条路线没有把调查预测当作硬约束，因而远端 P-measure 路径更依赖样本持久性与因子动态。2013 年 JFE 论文、较早 Staff Report 与纽约联储持续更新的数据门户是不同版本对象；门户曲线是研究产品，不是官方认定的真实 TP。<Cites ns={[30, 35, 59]} /></>,
    ],
  },
  {
    id: 'kim-wright', number: 44, label: 'Kim–Wright',
    title: 'Kim–Wright 用调查预测约束远端短率路径，并把凸性处理写进模型口径。',
    paragraphs: [
      <>当收益率样本很难识别长期均值时，调查预测为 P-measure 的持久短率路径增加外部信息。Kim–Wright 三因子无套利模型由此把长端 yield 分成预期短率部分和按其模型口径定义的期限溢价。<Cites ns={[31, 32]} /></>,
      <>调查既非无误差，也不必等于边际投资者信念；其期限、发布日期与样本构成都可能变化。2005 FEDS、后续方法研究与 Board 动态产品必须分别记录，且与 ACM 比较前要对齐 Jensen/convexity convention。<Cites ns={[31, 32, 60]} /></>,
    ],
  },
  {
    id: 'model-uncertainty', number: 45, label: 'Model Uncertainty',
    title: '模型分歧不是应被藏掉的噪声，而是期限溢价不可直接观测所留下的核心证据。',
    paragraphs: [
      <>同一 observed yield 可以由不同长期短率均值、风险价格、调查约束、样本终点和 convexity 处理解释。因而 ACM、KW、survey residual 或不同 bias correction 可能在同一时点给出不同符号和幅度。<Cites ns={[33, 34, 35, 43]} /></>,
      <>合格输出应把 <code>modelId、modelVersion、sampleStart、sampleEnd、vintageAsOf</code> 与分解一起保存，并报告所选模型集合的 min/median/max。这个范围不是统计置信区间，更不是“真值所在区间”；它只显示规范敏感性。</>,
    ],
    after: <TermPremiumVintageLab />,
  },
  {
    id: 'macro-finance', number: 46, label: 'Macro–Finance',
    title: '宏观变量既能帮助解释曲线状态，曲线又会反馈融资条件和后续宏观活动。',
    paragraphs: [
      <>macro–finance 模型把通胀、活动、政策变量与潜在收益率因子放入共同动态系统：宏观消息改变预期政策路径与风险补偿，收益率和信用条件又影响支出、资产负债表与下一期宏观状态。<Cites ns={[36, 37, 38]} /></>,
      <>这种双向系统能组织动态事实，却不会自动产生结构因果。VAR innovation 可能混合政策、信息与测量新闻；修订后的宏观数据还可能不是当时市场可见信息。结构命名必须另有时序、工具变量或其他排除限制。<Cite n={39} /></>,
    ],
  },
  {
    id: 'breakeven-boundary', number: 47, label: 'Inflation Compensation',
    title: '同期限名义收益率减 TIPS 收益率首先只是加法收益率差，不等于纯预期通胀。',
    paragraphs: [
      <>在统一期限、复利和曲线方法后，可先定义 <code>additiveYieldSpread<wbr />BreakevenPct=<wbr />yNominal−<wbr />yTIPS</code>。它混合预期通胀、inflation-risk premium、TIPS 流动性、指数化滞后、deflation floor 与拟合误差；严格 Fisher 关系还具有乘积项。<Cites ns={[5, 40, 41, 42]} /></>,
      <>因此 M8/K8 只在明示符号和忽略项的教学约定下移项求预期通胀。实际收益率曲线的完整定价、实际中性率与跨国通胀制度由 3.08 接手，本节不越界把 TIPS yield 直接叫作真实实际短率路径。</>,
    ],
    formula: { label: '第一步的可审计对象', expression: <code>additiveYieldSpreadBreakevenPct = yNominal − yTIPS</code>, note: <>这是同坐标收益率差，不是 exact Fisher identity，也不是已识别的 expected inflation。</> },
  },
  {
    id: 'preferred-habitat', number: 48, label: 'Preferred Habitat',
    title: '期限偏好的客户群造成局部需求，而有限套利者决定局部冲击是否传遍整条曲线。',
    paragraphs: [
      <>养老金、保险公司、银行或储蓄者可能偏好特定期限现金流；套利者可跨期限承接失衡，却要承担价格风险和资产负债表成本。于是某一 bucket 的净供给变化既影响本地价格，也按替代性向邻近期限传播。<Cite n={44} /></>,
      <>教学矩阵中的 <code>ΔQ</code> 定义为套利者需要吸收的净久期供给，<code>κ</code> 单位是 bp/normalized-supply-unit。负 <code>ΔQ</code> 表示需吸收的供给减少，在其余输入冻结时使估计 TP 与 yield 下移；矩阵系数是 synthetic，不可外推成现实弹性。</>,
    ],
    formula: { label: '教学型局部传播', expression: <code>ΔTPᵢ(bp)=κ · Wᵢⱼ · ΔQⱼ / riskBearingCapacity</code>, note: <>符号、矩阵方向、容量分母和单位必须一起给出。</> },
  },
  {
    id: 'risk-bearing-capacity', number: 49, label: 'Risk-bearing Capacity',
    title: '同一久期供给冲击在套利资本紧张时造成更大价格变化，在容量充足时更易被吸收。',
    paragraphs: [
      <>套利者以资本、融资、保证金和风险限额承接期限错配。波动上升、损失侵蚀资本或融资收紧会降低可承担仓位，使原本局部的客户需求变化转化为更大的 yield 与 expected-return 调整。<Cites ns={[44, 45, 57]} /></>,
      <>risk-bearing capacity 不是可直接观测的恒定标量：价格变化会反过来改变抵押品、PnL、波动和保证金，形成内生反馈。经验研究必须说明使用 dealer balance sheet、杠杆约束还是价格弹性做代理。</>,
    ],
  },
  {
    id: 'duration-supply', number: 50, label: 'Duration Supply',
    title: '市场要吸收的是价格加权利率风险，不是债券票面金额本身。',
    paragraphs: [
      <>一阶平行利率风险近似与 <code>face × price-per-par × modified duration</code> 成正比。同样 500bn 面值的两组债，若价格或久期不同，交给私人部门的风险并不相同。<Cites ns={[10, 44, 45]} /></>,
      <>M9/K9 只有在题干明确两边每单位面值价格相同、且都使用 modified duration 时才能约去价格。现实中的 <code>durationSupplyState</code> 还要净掉央行及价格不敏感部门持仓，并写清是总发行、可流通量还是套利者需吸收的净供给。</>,
    ],
    formula: { label: 'Duration-equivalent face', expression: <code>Nbenchmark = Ntarget(PtargetDmod,target)/(PbenchmarkDmod,benchmark)</code>, note: <>若每面值价格不同，价格项绝不可删除。</> },
  },
  {
    id: 'qe-stock', number: 51, label: 'QE Stock Channel',
    title: '资产购买改变私人部门持有的久期与便利资产存量，存量通道不同于购买当日的消息效应。',
    paragraphs: [
      <>当央行从私人部门买入长债，私人部门需承载的净久期可能下降；若期限偏好与套利容量有限，相关债券价格会上升、yield 或估计 TP 下移。购买也可能改变安全资产稀缺、流动性和对未来政策的信号。<Cites ns={[46, 47, 49, 54]} /></>,
      <>准备金增加只是央行与银行资产负债表的会计对应，不能单独识别 portfolio-balance channel。购买规模到 basis points 没有跨项目、跨时期不变的系数；期限、预期、市场状态和反事实都要进入 estimand。</>,
    ],
  },
  {
    id: 'flow-stock-local', number: 52, label: 'Flow / Stock / Local Supply',
    title: '公告、实际交易、累计持仓与特定期限稀缺作用于不同时间尺度，不能压成一个 QE 数字。',
    paragraphs: [
      <>公告瞬间可同时携带未来政策信号与预期存量变化；执行日的购买流会影响订单承接和市场流动；累计持仓改变私人净供给；对某一 CUSIP 或 maturity bucket 的购买还可能产生 local-supply scarcity。<Cites ns={[46, 47, 48, 49]} /></>,
      <>事件窗口估计的 announcement effect、交易日的 flow effect 与持仓面板的 stock effect 回答不同问题。若把它们共用一个系数，时间尺度与机制会混在一起；若只看被买债券，也要处理选择进入和同时市场新闻。</>,
    ],
  },
  {
    id: 'convenience-yield', number: 53, label: 'Safety & Liquidity Convenience',
    title: '政府债除现金流外还可提供安全、流动和近似货币服务，这些便利会抬高价格并压低收益率。',
    paragraphs: [
      <>安全资产需求反映坏状态中的价值保存，流动性便利反映快速、低成本变现或交易，near-money 服务则与短端替代资产相关。它们概念相连却不等同，强度会随供给、风险和现金需求变化。<Cites ns={[50, 51, 52, 53]} /></>,
      <>这些服务已经进入成交价格，因此可能被一个总 <code>estimatedYieldTermPremium</code> 或 residual 吸收。除非模型独立识别出互斥成分，不得在 <code>yield=path+TP</code> 之后又把 safety、liquidity 和 supply 逐项加上，造成双重计数。</>,
    ],
  },
  {
    id: 'collateral-specialness', number: 54, label: 'Collateral Specialness',
    title: '某只债在 repo 中难以借到时会附带证券特定融资价值，现金价格可因而偏贵。',
    paragraphs: [
      <>若做空者或交割者特别需要某一 CUSIP，它在 repo 中可按低于一般抵押品的利率融资；持有该券的人获得额外 lending benefit。这个 specialness 会提高现金价格、压低单券 yield，并使其相对平滑曲线显得 rich。<Cites ns={[52, 61]} /></>,
      <>repo specialness 属于 security-level wedge，不应直接解释成整个期限 bucket 的宏观预期或纯风险溢价。筛券、repo 数据和残差旗标应共同决定该观测是否进入一般曲线估计。</>,
    ],
  },
  {
    id: 'mbs-negative-convexity', number: 55, label: 'MBS Negative Convexity',
    title: '按揭提前还款使 MBS 久期随利率反向变化，套保交易可能顺着原有利率方向放大波动。',
    paragraphs: [
      <>利率下降时借款人更可能再融资，MBS 现金流提前、有效久期缩短；需要维持久期的持有人会买入久期或 receive fixed，可能进一步压低长率。利率上升时提前还款减慢、久期延长，卖出久期或 pay fixed 又可能推动长率更高。<Cites ns={[55, 56, 57]} /></>,
      <>这个反馈强度取决于按揭结构、持有人、套保工具、波动与 dealer 容量，并非每次长率变化都由 MBS 驱动。它也不同于普通无期权债的正凸性和英国养老金的保证金反馈。</>,
    ],
  },
  {
    id: 'ldi-interface', number: 56, label: 'LDI Liquidity Feedback',
    title: '保证金需求可把长债价格下跌转成被迫销售，再由销售反过来扩大价格下跌。',
    paragraphs: [
      <>2022 年英国 gilt 市场案例中，长率快速上升使部分 LDI 基金面临 collateral calls；筹现与去杠杆推动 gilt 销售，在市场承接能力变弱时形成 yield 上升 → margin pressure → forced sale → yield 再上升的正反馈。<Cite n={58} /></>,
      <>英格兰银行后续案例将临时、定向购买描述为恢复市场功能并配套退出，而不是借此改变货币政策立场。这个案例证明反馈机制可以存在，却不给其他国家、时期或持仓结构提供固定价格弹性，也不能用 MBS 文献替代其制度证据。</>,
    ],
    after: <PreferredHabitatDurationLab />,
  },
  {
    id: 'curve-shape-symptoms', number: 57, label: 'Shape as Symptom',
    title: '倒挂、陡峭或驼峰是价格系统的形状症状，不是带有唯一原因的诊断名称。',
    paragraphs: [
      <>“倒挂”只说明所选长短端点的 yield spread 为负；它可以由短端上升、长端下降或二者同时变化产生，也可以混合预期路径、TP、便利收益和测量变化。历史预测关系不能把单次形状机械翻译成衰退概率或交易结论。<Cites ns={[13, 17, 18]} /></>,
      <>报告形状时必须保存 curve passport、原始期限点、level/slope/curvature 定义和时间戳。若只保留 <code>inverted=true</code>，就无法知道价格方向、冲击位置或研究者选了哪两个期限。</>,
    ],
  },
  {
    id: 'curve-motion', number: 58, label: 'Curve Motion',
    title: '平移、陡峭化、平坦化、扭转和蝶式变化是收益率向量的几何摘要，不是因果标签。',
    paragraphs: [
      <>parallel shift 表示多期限近似同向同幅；steepening/flattening 描述长短差变化；twist 强调端点反向；butterfly 则比较中段与两翼。相同“steepening”既可能是 bear steepener，也可能是 bull steepener，对债券价格与资产负债表的冲击方向不同。</>,
      <>因此事件研究至少保存 <code>Δy(τ)</code> 的全期限向量、基准时点和窗口，再分别估计预期路径与 TP 的变化。新闻、交易流与套保反馈可在分钟、日和月尺度上先后主导，不能用一个形状词替代动态链条。<Cites ns={[16, 36, 37]} /></>,
    ],
  },
  {
    id: 'decomposition-audit', number: 59, label: 'Decomposition Audit',
    title: '可靠解释必须沿着“对象—价格—坐标—模型—机制—识别”逐层留痕。',
    paragraphs: [
      <>第一层固定 curve passport 与 vintage；第二层由现金流价格构造 discount factors；第三层生成一致的 zero/par/forward；第四层选择 P/Q 动态、调查与 Jensen convention；第五层才得到 model-defined TP；第六层提出供给、便利、风险容量或宏观新闻等机制假说；第七层另用可证伪设计识别哪条边真的变化。</>,
      <>审计时应让替代模型在同一 observed curve 和信息集上并排运行，报告 range、残差与失败旗标，并验证分解项是否加回原始 yield。若模型已把某机制吸收进总 TP，就不再次相加；若数据只能支持相关性，<code>identificationStatus</code> 必须保持 descriptive 或 associational。<Cites ns={[28, 29, 34, 35, 43]} /></>,
    ],
    formula: { label: '最小审计链', expression: <code>passport → cash-flow prices → D(T) → zero/par/forward → P/Q model + vintage → estimated TP → mechanism hypothesis → identification test</code>, note: <>前一层不闭合，后一层的精确小数也不能补救对象错误。</> },
    after: <YieldCurveFixtureAudit />,
  },
];

const checks = [
  { question: '为什么必须先写 curve passport，才能比较两条“10Y yield”？', answer: '因为币种、发行人、证券集、现金流、报价、复利、结算、拟合方法和 vintage 任一项不同，都可能改变数值与经济含义；相同期限标签不保证是同一对象。', sourceIds: [1, 2, 3, 7, 8] },
  { question: 'YTM、zero yield 与 par yield 为什么不是三个同义词？', answer: 'YTM 用一个 IRR 压缩单只票息债；zero 对应一笔到期支付；par yield 是令假想新券价格等于面值的 coupon rate，并使用此前全部贴现因子。', sourceIds: [1, 2, 7, 10] },
  { question: '为什么 clean-price change 不能直接当作持有期总回报？', answer: 'clean quote 剥离了 accrued interest，正是为了减轻付息日锯齿；但它也遗漏 accrued 的财富变化和已收到 coupon。总回报须使用现金流一致的 dirty prices，并把 coupon 一起计入。', sourceIds: [10] },
  { question: 'bootstrap 的核心动作是什么？', answer: '按到期顺序先用已知贴现因子剥离较早现金流，再由剩余价格求下一个未知贴现因子；输入误差也会沿递归向长端传播。', sourceIds: [1, 7, 10] },
  { question: '为什么今日 forward 不能直接称为未来 spot 的预测？', answer: 'forward 是今日两个到期价格之间的无套利区间价格；把它解释成现实期望还要增加测度、风险补偿与 Jensen 约定，未来新信息也会改变实现 spot。', sourceIds: [12, 13, 18, 20] },
  { question: '无套利为什么不等于预期假说成立？', answer: '无套利约束可复制现金流和跨期限价格，却不要求条件 expected excess return 为零或常数；预期假说对风险补偿另加了限制。', sourceIds: [11, 12, 13, 20] },
  { question: 'P-measure 与 Q-measure 分别回答什么？', answer: 'P 描述研究者估计的现实状态演化；Q 把风险价格吸收进定价概率。Q-expected short rate 是定价对象，不是调查预测或最可能现实路径。', sourceIds: [20, 25] },
  { question: 'Jensen convention 为什么会改变同名期限溢价？', answer: '价格先对指数贴现项取期望，收益率再取负对数；这不等于短率算术平均。模型可单列或吸收该非线性项，因此比较前必须对齐口径。', sourceIds: [20, 31, 60] },
  { question: '为何不能说“观察到期限溢价上升”？', answer: '市场直接观察的是合约价格或报价；期限溢价来自给定 P/Q 动态、样本、调查与凸性约定的模型分解，应称 estimated 或 model-defined。', sourceIds: [30, 31, 34, 35] },
  { question: '如何正确计算零息长债的一期 log excess return？', answer: '先用下一期剩余债价格除以今日买价得到长债 gross return，再取对数并减去同币种、同持有期短债 gross return 的对数。', sourceIds: [10, 12, 14] },
  { question: 'duration–convexity 公式为什么不能叫精确重定价？', answer: '它只保留收益率变化的一阶和二阶局部项；大变化、曲线非平行移动或嵌入期权都需要基于现金流或期权模型重新定价。', sourceIds: [10, 55] },
  { question: 'NS 的 level、slope、curvature 为什么不是三个结构冲击？', answer: '它们是特定载荷下的截面压缩，能描述形状却不唯一说明通胀、政策、风险或供求中的哪一项改变。', sourceIds: [21, 23] },
  { question: '为何两套无套利模型能拟合同一曲线却给出不同 TP？', answer: '价格主要约束 Q 动态；P 动态、长期均值、风险价格、调查约束、Jensen 处理和样本 vintage 仍可不同，因此分解并不由截面价格唯一识别。', sourceIds: [28, 29, 33, 34] },
  { question: '名义 yield 减 TIPS yield 的第一步应该叫什么？', answer: '应叫同期限、同口径的 additive nominal–real yield spread 或 inflation compensation；它还可含 inflation-risk、流动性、deflation floor、指数化和拟合成分。', sourceIds: [5, 40, 41, 42] },
  { question: '为什么比较债券供给时面值不够？', answer: '一阶风险与面值、每面值价格和 modified duration 的乘积相关；只有价格相同且 duration 定义一致时，duration-equivalent face 公式才能约去价格。', sourceIds: [10, 44, 45] },
  { question: 'QE 的 announcement、flow 与 stock 为什么要分开？', answer: '公告改变预期和政策信号，执行流影响当日承接与流动性，累计持仓改变私人净供给；三者时间尺度、反事实和 estimand 不同。', sourceIds: [46, 47, 48, 49] },
  { question: '便利收益为何不能在 path+TP 之后再次逐项相加？', answer: '安全、流动、抵押品和供给机制已经进入价格，并可能被总 TP 或残差吸收；除非模型独立识别互斥成分，再相加会双重计数。', sourceIds: [50, 51, 52, 61] },
  { question: '一条倒挂曲线为何不是一个完整因果解释？', answer: '倒挂只描述所选端点的相对数值；短端、长端、预期路径、TP、便利收益与测量方法都可能产生它，必须返回完整收益率向量和事件时钟。', sourceIds: [13, 17, 18] },
] as const;

const glossary = [
  ['Curve passport', '定义曲线币种、发行人、证券集、现金流、报价、复利、结算、拟合方法和版本的身份合同', '只写国家与“10Y yield”', '03–04'],
  ['Discount factor', '今日取得未来一单位确定支付的价格', '收益率百分比本身', '05、07'],
  ['Dirty price', 'clean quote 加 accrued interest 的结算价格', '屏幕上的 clean quote', '06'],
  ['YTM', '使单只债全部合约现金流现值等于价格的 IRR', 'zero rate、下一期 realized return 或无条件预测', '08'],
  ['Zero yield', '由单一到期支付的贴现因子转换出的年化率', '每个期限都直接可交易的无误差观测', '09'],
  ['Par yield', '使假想新券价格等于面值的 coupon rate', '同期限 zero 或单券 YTM', '10'],
  ['Forward rate', '今日由两个到期价格锁定的未来区间价格', '未来 spot 的无偏预测', '11、24'],
  ['Bootstrap', '按期限递归剥离已知现金流并求未知贴现因子', '不含输入误差的真实曲线', '13'],
  ['Interpolation', '从离散报价构造连续期限函数的方法选择', '对真实连续曲线的直接观察', '14'],
  ['Law of one price', '相同状态现金流在基准条件下应有同价的复制限制', '真实概率或预期回报理论', '17'],
  ['SDF', '按状态边际价值为未来支付加权的随机贴现因子', '只由平均风险大小决定的折现率', '18–19'],
  ['P-measure', '用于描述现实状态条件演化的概率测度', '无误差调查共识', '20'],
  ['Q-measure', '吸收风险价格、用于无套利定价的风险中性测度', '未来最可能发生的路径', '20–21'],
  ['Jensen adjustment', '指数期望与期望指数不等造成的非线性差异', '普通债 price-yield convexity 或 MBS 套保', '21–22'],
  ['Yield term premium', '给定模型与 Jensen 口径的 yield 分解估计或定义残差', '直接观测的结构真值', '22、43–45'],
  ['Expected excess return', '相对同持有期短债机会成本的条件预期回报', 'YTM 或 forward premium 的同义词', '26–32'],
  ['Modified duration', '价格对小幅近似平行 yield 变化的一阶半弹性', '到期年限或任意曲线变化的精确风险', '28、50'],
  ['Ordinary convexity', '无嵌入期权债价格—收益率关系的二阶局部修正', 'MBS negative convexity', '29、55'],
  ['Level / slope / curvature', '对收益率曲线共同、倾斜和中段形状的统计压缩', '通胀、政策与周期的唯一结构因子', '33–38'],
  ['Affine DTSM', '让短率和债券对数价格对状态呈仿射并施加跨期无套利的动态模型', '已唯一识别的现实模型', '39–42'],
  ['ACM', '利用收益率因子、创新和超额回报回归估计风险价格的框架', '官方 TP 或调查约束模型', '43'],
  ['Kim–Wright', '以调查信息约束持久短率过程的三因子无套利分解', '实时无修订的期限溢价真值', '44'],
  ['Model vintage', '模型在特定估计日可用的数据、样本和版本状态', '论文年份或今日下载时间', '04、45'],
  ['Inflation compensation', '名义与实际债券价格差中与通胀相关的总补偿', '纯 expected inflation', '47'],
  ['Preferred habitat', '客户期限偏好与有限套利共同生成的局部需求机制', '期限市场完全分割', '48'],
  ['Risk-bearing capacity', '中介在资本、融资、保证金和风险限额下承接错配的能力', '固定、直接可观测的单一常数', '49'],
  ['Duration supply', '价格加权并经 modified duration 换算、需由边际投资者承载的利率风险供给', '债券总面值', '50–52'],
  ['Convenience yield', '安全、流动、抵押或货币服务给持有者的非现金流价值', '必须在总 TP 之外再加一次的独立项', '53–54'],
  ['Repo specialness', '特定证券在融资与借券市场中的稀缺便利', '整个主权曲线的宏观风险补偿', '54'],
  ['Rate-amplifying demand', '利率变化先改变久期、保证金或风险约束，再诱发同向交易的反馈', '所有长端波动的共同原因', '55–56'],
] as const;

function outputInterface(
  name: string,
  fields: readonly CanonicalYieldCurveKey[],
  guardrail: string,
) {
  return { name, payload: fields.join('、'), guardrail };
}

const interfaces = [
  {
    name: 'I1 · 3.06 → 3.07',
    payload: yieldCurveInputFields.join('、'),
    guardrail: '八个字段逐字继承；expectedImplementationPath 只是条件实施输入，不得静默改名为 expectedShortRatePath。',
  },
  outputInterface('I2 · T02 / T07 → 3.07', ['curvePassport', 'discountFactors', 'zeroCouponYields', 'parYields', 'forwardRates', 'timestamps'], '现金流、复利、日计数和结算口径不完整时，曲线转换必须失败而不是补默认值。'),
  outputInterface('I3 · 3.07 → 3.08', ['zeroCouponYields', 'expectedShortRatePath', 'expectedAverageShortRate', 'estimatedYieldTermPremium', 'decompositionComponents', 'decompositionUncertainty', 'termPremiumModel', 'timestamps'], '名义—实际比较要重新对齐证券、通胀指数和模型；additive spread 不是 exact Fisher identity。'),
  outputInterface('I4 · 3.07 → 3.10', ['zeroCouponYields', 'forwardRates', 'levelFactor', 'slopeFactor', 'expectedShortRatePath', 'decompositionEstimateRange', 'timestamps'], '银行贷款定价还需要负债、信用、资本与竞争；分解估计范围是所选输出的敏感性包络，不是期限溢价置信区间；本节不直接输出贷款利率。'),
  outputInterface('I5 · 3.07 → 3.13', ['zeroCouponYields', 'parYields', 'levelFactor', 'slopeFactor', 'curvatureFactor', 'estimatedYieldTermPremium', 'decompositionUncertainty', 'timestamps'], '综合金融条件必须加入信用、股票、汇率与主体暴露，不能把一条国债曲线当成全部融资环境。'),
  outputInterface('I6 · 3.07 → 3.20', ['expectedShortRatePath', 'forwardRates', 'estimatedYieldTermPremium', 'safetyConvenienceState', 'liquidityConvenienceState', 'timestamps'], '汇率还需要外国同口径曲线、风险补偿与资本流；国内外名义 yield 差不是无条件汇率预测。'),
  outputInterface('I7 · 3.07 → 4.04', ['curvePassport', 'discountFactors', 'zeroCouponYields', 'forwardRates', 'durationSupplyState', 'safetyConvenienceState', 'collateralConvenienceState', 'riskBearingCapacityState', 'timestamps'], '美国国债成为全球定价曲线还需要美元融资、抵押品和跨境资产负债表机制。'),
  outputInterface('I8 · 3.07 → 3.23 / Chapter 7', ['curveMeasurementFlag', 'curveFitError', 'eventClock', 'termPremiumVintage', 'decompositionEstimateRange', 'decompositionUncertainty', 'identificationStatus', 'timestamps'], '变化与 surprise 先按对象、窗口和 vintage 保存；没有排除限制时保持 descriptive/associational，不能命名结构 shock。'),
] as const;

const evidenceGroups = [
  { title: 'A｜官方曲线与现金流坐标', text: 'S01–S10 支持 CMT、GSW/TIPS、zero/par/forward、筛券、现金流、回报与 duration 的对象定义；官方或教材方法不提供宏观归因。', ids: Array.from({ length: 10 }, (_, index) => index + 1) },
  { title: 'B｜预期假说、SDF 与回报证据', text: 'S11–S19 支持预期假说版本、风险补偿、回报可预测性与调查约束；历史样本关系不是稳定交易规则或当前数值。', ids: Array.from({ length: 9 }, (_, index) => index + 11) },
  { title: 'C｜期限结构模型与识别', text: 'S20–S35 支持 P/Q、NS/DNS/AFNS、affine 规范、ACM、KW、估计偏误与 vintage 稳健性；任何单一模型输出都不是观察真值。', ids: Array.from({ length: 16 }, (_, index) => index + 20) },
  { title: 'D｜宏观与名义—实际分解', text: 'S36–S43 支持 macro–finance 双向动态、实时认知、TIPS 分解和模型数据门户身份；VAR innovation 与 portal line 均不自动获得结构解释。', ids: Array.from({ length: 8 }, (_, index) => index + 36) },
  { title: 'E｜期限供求、QE 与便利收益', text: 'S44–S54 支持 preferred habitat、duration supply、LSAP 的 signal/flow/stock/local channels 和 safety/liquidity convenience；历史 episode 系数不可机械外推。', ids: Array.from({ length: 11 }, (_, index) => index + 44) },
  { title: 'F｜非线性反馈与市场功能', text: 'S55–S58 分别支持 MBS convexity、rate-amplifying demand 和 2022 gilt/LDI 案例；不同制度机制不可互作替代证据。', ids: [55, 56, 57, 58] },
  { title: 'G｜动态产品与证券特定融资', text: 'S59–S61 支持 ACM/KW-style 数据入口、产品 disclaimer 与 repo specialness；下载日期、论文年份、模型 vintage 和证券层残差必须分开。', ids: [59, 60, 61] },
  { title: 'H｜课堂合成数值', text: 'C1–C5、M1–M10 与 K1–K10 的参数均为可复算的 SYNTHETIC fixture；来源只支持公式与机制，不为这些数字的现实概率或政策含义背书。', ids: [] },
] as const;

function Lesson307Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>收益率曲线是一套跨期限现金流价格；长端收益率不是未来短率的简单平均，也不是一个可直接观察的“宏观预测”。</h2>
        <p>3.06 只把政策决定送到隔夜市场这一站。要走向两年、十年或三十年，今天的参与者必须为许多未来状态中的短率、通胀、边际价值、资产供求和交易便利定价。完整链是：实施后的近端状态 → 对未来短率的条件分布 → 按状态定价的风险补偿 → 期限客户与中介约束 → 各现金流价格 → discount factors → zero/par/forward 坐标 → level/slope/curvature → 持仓、套保与资产负债表反馈。<Cites ns={[10, 15, 20, 44]} /></p>
        <p>无套利负责让同一现金流不能在同一时点有相互矛盾的价格，却不负责告诉我们现实概率；期限溢价则是模型、样本、调查和 Jensen 约定共同生成的估计，不是屏幕字段。安全、流动、抵押品、供给与风险承载是改变价格的机制，可能被总期限溢价或残差吸收；它们不应在分解之后再次机械相加。<Cites ns={[20, 30, 31, 34, 50, 61]} /></p>
        <YieldCurveTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>先把债券还原为现金流与价格，再学曲线坐标；最后才讨论预期、期限溢价和供求机制。</h2>
        <div className="learning-objectives"><span>核心首读约 90–110 分钟</span><ol>
          <li><b>对象与坐标（02–17）：</b>从 3.06 接口、curve passport、现金流、discount factor 到 YTM、zero、par、forward 与 bootstrap。</li>
          <li><b>定价与回报（18–32）：</b>SDF、P/Q、Jensen、预期假说、期限溢价、持有期回报与可预测性。</li>
          <li><b>形状与模型（33–47）：</b>level/slope/curvature、NS/DNS/AFNS、affine、ACM、KW、模型不确定性与 inflation compensation。</li>
          <li><b>供求与反馈（48–59）：</b>preferred habitat、风险承载、久期供给、QE、便利收益、MBS/LDI 和分解审计。</li>
        </ol></div>
        <p>核心路线是 00、01、02、03、05、07、08、09、10、11、13、17、18、20、21、22、24、26、27、28、29、33、34、36、39、40、42、43、44、45、47、48、49、50、51、53、55、56、57、59；其余机制仍保留在目录、深链接、无脚本和打印版本中。先形成“价格对象—坐标—分解—机制”的顺序，能避免一看到倒挂就跳到衰退故事。</p>
        <div className="precision-note"><span>章节所有权</span><p>3.08 接手实际利率与折现率；3.10 接手银行贷款传导；3.13 合成金融条件；3.20 处理汇率；4.04 解释美债的全球角色；3.23 与 Chapter 7 才负责 surprise 与 shock 识别。本节只交付有护照、有 vintage、有模型边界的期限结构状态。</p></div>
      </section>

      {conceptSections.map((section) => <YieldConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Lab</p>
        <h2>十道合成题先量对价格、复利、回报和单位，再判断分解、久期供求与模型边界。</h2>
        <p>所有题均标记 SYNTHETIC。错答只解释所选项为何不完整，不展示正确选项、完整计算、来源或下一题；答对后才解锁逐步复算。静态客户端无法阻止主动阅读源代码，因此这里承诺的是“作答界面不提前泄露”，而不是服务端级答案保密。</p>
        <YieldCurveLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道静态孪生改变数字或边界，让无脚本、打印和复盘环境仍能完成一次独立迁移。</h2>
        <div className="case-grid" id="yield-static-twins">
          {yieldCurveScenarios.map((scenario, index) => (
            <article className="case-card" key={scenario.staticTwin.id}>
              <span>STATIC {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.id} · SYNTHETIC</span>
              <h3>{scenario.staticTwin.title}</h3>
              <p><b>题干：</b>{scenario.staticTwin.prompt}</p>
              <ol className="static-choice-list">{scenario.staticTwin.choices.map((choice) => <li key={choice.id}><b>{choice.id.toUpperCase()}.</b> {choice.label}</li>)}</ol>
              <p><b>逐步复算：</b></p>
              <ol>{scenario.staticTwin.calculations.map((step) => <li key={step}>{step}</li>)}</ol>
              <p><b>标准答案：</b>{scenario.staticTwin.answer}</p>
              <p><b>单位护栏：</b>{scenario.formulaUnits}</p>
              <p><b>机制来源：</b> <Cites ns={scenario.staticTwin.sourceIds} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks / Glossary</p>
        <h2>掌握标准不是会读一张曲线图，而是能从价格重建坐标，并明确每一步增加了什么假设。</h2>
        <div className="check-list">{checks.map((check, index) => <div className="check-entry" key={check.question}><details><summary>{index + 1}. {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={[...check.sourceIds]} /></p></details><p className="print-only check-print-answer"><b>{index + 1}. 标准答案：</b>{check.answer} <Cites ns={[...check.sourceIds]} /></p></div>)}</div>
        <div className="term-grid" aria-label="3.07术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces / Reading / Evidence Map</p>
        <h2>本节交付的不是一个“长端利率”，而是一套可追踪到现金流、模型、机制和时钟的期限结构状态。</h2>
        <div className="interface-grid">{interfaces.map(({ name, payload, guardrail }) => <article key={name}><span>{name}</span><h3>交付字段</h3><p><code>{payload}</code></p><em>{guardrail}</em></article>)}</div>
        <div className="precision-note"><span>3.07 canonical state contract · {canonicalYieldCurveStateFields.length} 个顶层键</span><p><code>{canonicalYieldCurveStateFields.join(', ')}</code>。所有接口字段均受 <code>CanonicalYieldCurveKey</code> 限制；<code>observedTermPremium、trueTermPremium、marketForecast</code> 等误导性别名不进入输出。3.06 的八字段输入保持原名与语义边界。</p></div>
        <div className="precision-note"><span>重复顶层键只是兼容投影，不形成第二套真值</span><p><code>{canonicalAliasRules.join('；')}</code>。嵌套的 <code>curvePassport</code> 与 <code>termPremiumModel</code> 是规范来源；ingest 时由它们单向派生兼容键，调用者不得独立写入。若投影与规范值冲突，整条记录必须 reject，不能以任一侧静默覆盖。</p></div>
        <div className="precision-note"><span>不可删除边界的嵌套类型</span><p><code>{canonicalBoundaryPaths.join(', ')}</code>。<code>CanonicalYieldCurveState</code> 强制每个 discount/zero/par 点携带期限轴、每个 forward 携带左右端点，且六个关键时钟键即使未知也必须显式存在并写 <code>null</code>、同时触发 measurement flag；不能用省略字段表达未知，也不能默认 USD、Treasury 或今日 vintage。</p></div>
        <div className="precision-note"><span>单模型与分解估计范围是两个对象</span><p><code>termPremiumModel</code> 描述当前主分解；<code>decompositionEstimateRange</code> 则强制至少两个 <code>members</code>，每个成员都携带 <code>modelId/modelVersion/sampleStart/sampleEnd/vintageAsOf/jensenConvexityConvention/estimateKind/value/unit</code>，并保存固定的 <code>rangeMeaning=selectedDecompositionOutputsNotConfidenceInterval</code>，再由同期限、同单位成员计算 min/median/max/width。<code>memberKinds</code> 只能由 <code>members[].estimateKind</code> 去重派生，调用者不得独立写入；若两者冲突，整条记录必须 reject。其中 <code>estimateKind=modelDefinedTermPremium</code> 才是模型定义的期限溢价，<code>estimateKind=additiveResidual</code> 仍只是冻结加法约定下的残差；二者可以形成明确标注的敏感性包络，却不能在汇总时被改名为同一 estimand、期限溢价模型范围或统计置信区间。<code>decompositionComponents</code> 不替代这份成员清单。</p></div>

        <h3>Evidence Map · 证据先证明哪条边，再限制不能推出什么</h3>
        <div className="evidence-map" aria-label="3.07连续覆盖61条来源的证据地图" role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} {group.ids.length ? <Cites ns={[...group.ids]} /> : null}</p></div>)}</div>

        <div className="learning-objectives"><span>延伸阅读顺序</span><ol>
          <li><b>第一遍：</b>Tuckman、BIS 与 Treasury 方法页，只追踪现金流、复利、zero/par/forward 和 curve passport。</li>
          <li><b>第二遍：</b>Campbell–Shiller、Piazzesi、Fama–Bliss 与 Cochrane–Piazzesi，分开价格恒等式、现实预期与 expected excess return。</li>
          <li><b>第三遍：</b>NS/DNS/AFNS、ACM、Kim–Wright、Hamilton–Wu 与模型稳健性文献，建立 model/vintage/Jensen 比较表。</li>
          <li><b>第四遍：</b>Vayanos–Vila、duration supply、QE、便利收益、MBS 与 BoE gilt 案例，逐条画出主体约束和反馈。</li>
        </ol></div>
        <p>最小复述是：<b>债券先是一组有日期的现金流，曲线是这些现金流的跨期限价格系统。discount factors 可以一致地转换成 zero、par 与 forward，但坐标转换不等于经济解释；无套利约束价格，却不指定现实概率。长端 yield 可被给定模型拆为现实短率路径的 certainty-equivalent 与 model-defined term premium，两者会随样本、调查、风险价格、Jensen convention 和 vintage 改变。期限偏好、净久期供给、安全／流动／抵押便利以及中介风险容量通过价格进入这套分解，并可在 MBS 或 LDI 等约束下形成反馈。形状只是症状；可靠研究必须从 curve passport 出发，逐层保存价格、坐标、分解、机制假说与 identification status。</b></p>
      </section>
    </>
  );
}

export const lesson307: LessonRecord = {
  slug: '3-07',
  id: '3.07',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Yield Curve：Expectations、Term Premium 与期限供求',
  subtitle: '隔夜实施状态怎样经未来短率的条件分布、风险补偿、期限偏好与中介约束，形成跨期限现金流价格、曲线形状和反馈',
  readingTime: '核心首读约 90–110 分钟；完整正文与逐式复算约 240–320 分钟；C1–C5 机制实验约 45–65 分钟，互动题首次完成约 35–50 分钟／含复盘约 55–75 分钟，静态变式、检查题与术语约 60–80 分钟；来源与延伸阅读不计',
  prerequisite: 'T02 Compounding 与 Discounting、3.06 的八字段实施输出；按需调用 T03 Probability / Expectation、T05 Regression、T07 Bond / Futures / Options 与 T08 Trading / Settlement / Vintage',
  updatedAt: '2026-09-02',
  revision: '3.07-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.07-r4',
      summary:
        '独立通读 00–63、61 条连续来源、20 项延伸阅读、C1–C5 与 M1–M10/K1–K10；逐项复算 12 组 fixture、6 组题库结构断言及 43 个数值断言，核验固定收益公式、P/Q/Jensen、期限溢价模型、期限供求与 TIPS/LDI 边界，并确认 54 字段 canonical contract、3.06 八字段接口及来源使用范围闭合；冻结前后 15 项哈希一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.07-r4',
      summary:
        '独立审核零背景教学递进，并用真实 Chrome 验证首页与相邻导航、64/64 深链、1280/390 视口、0 页面溢出、0 axe 违规与 0 console/page error；完成 C1–C5 全控件、20 个错答门控、重做/10-of-10/刷新恢复/两步重置/畸形存储隔离，并在全折叠、部分展开和全部展开三种状态下打印 92 页 PDF，确认 18 道检查答案均恰好一次；冻结前后 15 项哈希一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '3-06', label: '3.06 Policy Rate → Money Market Rate' },
  next: { slug: '3-08', label: '3.08 Real Interest Rate & Discount Rate' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson307Content,
  references: lesson307References,
  readingList: lesson307ReadingList,
};
