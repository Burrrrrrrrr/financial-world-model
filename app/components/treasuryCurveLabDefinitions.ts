import type { TreasuryCurveSourceId } from '../lessons/treasuryCurveReferences';
import { treasuryCurveCalculators, type TreasuryCurveLabId, type TreasuryCurveResult } from './treasuryCurveFixtures';

type NumericField = {
  kind: 'decimal'; key: string; label: string; min: number; max: number; step: number; scale: number; unit: string;
};
type SelectField = {
  kind: 'select'; key: string; label: string; options: readonly { value: string; label: string }[];
};
export type TreasuryCurveField = NumericField | SelectField;

export type TreasuryCurveLab = {
  id: TreasuryCurveLabId;
  fixtureId: string;
  title: string;
  question: string;
  passport: string;
  fields: readonly TreasuryCurveField[];
  initial: Readonly<Record<string, number | string>>;
  formula: readonly string[];
  defaultRebuild: string;
  changeCondition: string;
  extremes: readonly string[];
  misconception: string;
  counterexample: string;
  unknownWarning: string;
  invariants: readonly string[];
  sourceIds: readonly TreasuryCurveSourceId[];
  chartTitle: string;
  chartLabels: readonly string[];
  display: (input: Readonly<Record<string, unknown>>) => TreasuryCurveResult;
};

export const treasuryCurveLabs: readonly TreasuryCurveLab[] = [
  {
    id: 'C1',
    fixtureId: '404-role-v1',
    title: '对象—角色分类台：Reference、discount、hedge、RV、funding与information不能靠“利率”二字合并。',
    question: '给定一个明确对象和一个声称的角色，这个角色是否成立；它最容易被误写成什么？',
    passport: '独立SYN枚举；没有市场数值、日期、收益或预测。对象与角色必须来自固定集合，任何未知枚举STOP。',
    fields: [
      { kind: 'select', key: 'object', label: '对象', options: [
        { value: 'cmt', label: 'Treasury CMT par quote' },
        { value: 'sofrOis', label: 'Governing SOFR/OIS discount curve（已声明抵押制度）' },
        { value: 'onRun', label: 'On-the-run Treasury note' },
        { value: 'treasuryCollateral', label: 'Specific Treasury issue used as repo collateral' },
        { value: 'repoSpecial', label: 'Specific-issue special repo funding trade' },
        { value: 'corporateSpread', label: 'Matched corporate spread quote' },
        { value: 'clearedSwap', label: 'CCP-cleared USD swap contract' },
      ] },
      { kind: 'select', key: 'claimedRole', label: '要检验的角色', options: [
        { value: 'reference', label: 'reference quote / coordinate' },
        { value: 'discount', label: 'contract discount curve' },
        { value: 'hedge', label: 'duration hedge' },
        { value: 'relative-value', label: 'relative-value anchor' },
        { value: 'funding', label: 'funding input' },
        { value: 'collateral', label: 'collateral instrument' },
        { value: 'information', label: 'information barometer' },
      ] },
    ],
    initial: { object: 'cmt', claimedRole: 'discount' },
    formula: ['classification = allowed roles(object, stated use)', 'same label ≠ same contract or cash-flow object'],
    defaultRebuild: 'CMT允许reference与information；本默认声称discount，因此判定不成立，并强制给出“不是SOFR/OIS curve”的反例。',
    changeCondition: '把对象切到SOFR/OIS且保留discount，角色成立；再切回CMT即可看到benchmark与discount的边界。',
    extremes: ['任何不在枚举中的对象STOP', '同一对象可有多个角色，但每次只检验一个用途'],
    misconception: '“全球都看Treasury”不等于所有合约都用Treasury折现。',
    counterexample: 'Cleared swap可用Treasury hedge部分久期，同时按SOFR PAI制度折现。',
    unknownWarning: 'C1不输出价格、收益或现实合约法律判断。',
    invariants: ['benchmark ≠ discount curve', 'role is use-specific', 'no market direction output'],
    sourceIds: [1, 7, 8, 9],
    chartTitle: '允许角色序号（只表示集合，不表示强弱）',
    chartLabels: ['role 1', 'role 2', 'role 3', 'role 4'],
    display: treasuryCurveCalculators.C1,
  },
  {
    id: 'C2',
    fixtureId: '404-pv-v1',
    title: '匹配现金流重估：让三笔美元现金流各自走向对应zero node。',
    question: '当曲线和资产自身spread改变时，逐期现值与总现值怎样变化？',
    passport: '独立SYN确定美元现金流；z1/z3/z5明确为连续复利zero percentages，spreadBp为同一资产教学楔子。它们不是CMT、实时Treasury或vendor data。',
    fields: [
      { kind: 'decimal', key: 'cf1', label: '1Y现金流', min: 0, max: 200, step: 1, scale: 1, unit: 'USD SYN' },
      { kind: 'decimal', key: 'cf3', label: '3Y现金流', min: 0, max: 200, step: 1, scale: 1, unit: 'USD SYN' },
      { kind: 'decimal', key: 'cf5', label: '5Y现金流', min: 0, max: 300, step: 1, scale: 1, unit: 'USD SYN' },
      { kind: 'decimal', key: 'z1', label: '1Y zero', min: -2, max: 15, step: 0.1, scale: 10, unit: '%' },
      { kind: 'decimal', key: 'z3', label: '3Y zero', min: -2, max: 15, step: 0.1, scale: 10, unit: '%' },
      { kind: 'decimal', key: 'z5', label: '5Y zero', min: -2, max: 15, step: 0.1, scale: 10, unit: '%' },
      { kind: 'decimal', key: 'spreadBp', label: '资产自身spread', min: -100, max: 1000, step: 5, scale: 1, unit: 'bp' },
    ],
    initial: { cf1: 4, cf3: 4, cf5: 104, z1: 3, z3: 3.5, z5: 4, spreadBp: 80 },
    formula: ['PVⱼ = CFⱼ × exp{−[z(tⱼ)+spread]×tⱼ}', 'P = PV₁ + PV₃ + PV₅'],
    defaultRebuild: '1Y使用3.80%、3Y使用4.30%、5Y使用4.80%的SYN连续复利；逐项折现后再相加。',
    changeCondition: '只提高5Y zero，观察主要由5Y大额本金承担；再只提高spread，三笔现金流全部受影响。',
    extremes: ['现金流可以为0，这是经济零而非missing', '允许小幅负zero，但指数结果必须有限', '任何空白或额外小数STOP'],
    misconception: '不能拿一个10Y CMT par quote给1Y、3Y、5Y现金流统一贴现。',
    counterexample: '相同最终到期日的高票息债与STRIP具有不同现值权重。',
    unknownWarning: '真实债券还需coupon schedule、settlement、day count、clean/dirty、tax与optionality。',
    invariants: ['zero identity shown', 'each cash flow uses matched node', 'spread is labeled SYN'],
    sourceIds: [1, 2, 3, 16],
    chartTitle: '逐期SYN现值贡献',
    chartLabels: ['1Y PV', '3Y PV', '5Y PV'],
    display: treasuryCurveCalculators.C2,
  },
  {
    id: 'C3',
    fixtureId: '404-krd-v1',
    title: 'Key-rate hedge residual：总DV01相抵后，曲线形状风险仍留在哪些节点？',
    question: 'Portfolio与hedge的2Y/5Y/10Y/30Y暴露叠加后，在parallel、steepener与butterfly中怎样产生P&L？',
    passport: '独立SYN相对KRD单位；节点、bump与shock完全显示。不含真实security、notional、futures conversion factor或swap basis。',
    fields: [
      { kind: 'decimal', key: 'p2', label: 'Portfolio 2Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'p5', label: 'Portfolio 5Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'p10', label: 'Portfolio 10Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'p30', label: 'Portfolio 30Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'h2', label: 'Hedge 2Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'h5', label: 'Hedge 5Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'h10', label: 'Hedge 10Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'decimal', key: 'h30', label: 'Hedge 30Y KRD', min: -30, max: 30, step: 0.5, scale: 10, unit: 'SYN' },
      { kind: 'select', key: 'shock', label: '曲线shock', options: [
        { value: 'parallel', label: 'Parallel: +10/+10/+10/+10bp' },
        { value: 'steepener', label: 'Steepener: −5/0/+8/+18bp' },
        { value: 'butterfly', label: 'Butterfly: +6/−8/−8/+6bp' },
      ] },
    ],
    initial: { p2: 4, p5: 2, p10: 6, p30: 1, h2: 0, h5: 0, h10: -13, h30: 0, shock: 'steepener' },
    formula: ['residualₖ = portfolio KRDₖ + hedge KRDₖ', 'ΔP/P ≈ −Σ residualₖ×shockₖ'],
    defaultRebuild: 'Portfolio总暴露13，单一10Y hedge为−13，使总和为0；residual=[4,2,−7,1]，steepener仍产生非零加权结果。',
    changeCondition: '将hedge逐节点设为portfolio的相反数；一阶节点residual为0，但仍不得宣称无basis/convexity风险。',
    extremes: ['负KRD是合法方向', '总和0不是节点全0', 'unknown节点不可用0替代'],
    misconception: '“Duration-neutral”若只约束平行方向，不等于任何曲线形状中性。',
    counterexample: '2Y上升与10Y下降时，单一10Y hedge可放大而非消除残余。',
    unknownWarning: '真实hedge需CTD、conversion factor、cash/futures basis、swap spread、liquidity与funding。',
    invariants: ['signed residual preserved', 'shock vector displayed', 'zero residual is not zero total risk'],
    sourceIds: [3, 9, 15],
    chartTitle: 'Residual KRD by node',
    chartLabels: ['2Y', '5Y', '10Y', '30Y'],
    display: treasuryCurveCalculators.C3,
  },
  {
    id: 'C4',
    fixtureId: '404-driver-v1',
    title: '同一Treasury yield方向下的现金流—贴现率—ERP竞赛。',
    question: '固定Treasury yield上升，切换growth-information、policy-tightening与funding-stress后，资产方向为何改变？',
    passport: '独立SYN driver cards；每张卡的cash-flow、ERP与basis贡献由教学fixture给定。为隔离driver，同一“总贴现率SYN局部敏感度”故意同乘Treasury与ERP shock；现实risk-free与risk-premium暴露不自动相等。未使用真实指数、事件或估计系数。',
    fields: [
      { kind: 'select', key: 'driver', label: 'Driver card', options: [
        { value: 'growth', label: 'Growth-information' },
        { value: 'policy', label: 'Policy-tightening' },
        { value: 'funding', label: 'Liquidity-funding stress' },
      ] },
      { kind: 'decimal', key: 'treasuryBp', label: 'Treasury node变动', min: 0, max: 100, step: 5, scale: 1, unit: 'bp' },
      { kind: 'decimal', key: 'assetDuration', label: '总贴现率 SYN 局部敏感度', min: 0, max: 15, step: 0.5, scale: 10, unit: 'years-like' },
    ],
    initial: { driver: 'growth', treasuryBp: 20, assetDuration: 4 },
    formula: ['net ≈ CF contribution − κSYN×Treasury shock − κSYN×ERP shock − basis/funding drag', 'κRf = κERP 只是隔离driver的作者SYN限制；现实中两类暴露不自动相等'],
    defaultRebuild: 'Growth card给CF +3%、ERP −20bp；共享κSYN=4与Treasury +20bp形成−0.8%，与ERP −20bp形成+0.8%，净值仍为+3%。同一κ只是本题的driver隔离装置，不是现实暴露等式。',
    changeCondition: '保留Treasury +20bp，切换policy或funding卡；观察相同yield sign得到负结果。',
    extremes: ['Treasury shock为0仍可有asset move', '各贡献可抵消为净0', '净0不代表机制均为0', '现实中分开估计κRf与κERP可改变净结果'],
    misconception: '“Yield上升=所有风险资产下跌”把driver与资产自身现金流删除了；反过来，本SYN共用一个κ也不能证明两类现实暴露相等。',
    counterexample: '强增长信息可让yield与股票同升；紧缩可让yield升而股票跌。',
    unknownWarning: '现实分解依赖模型和识别，且risk-free与risk-premium暴露需分开估计；本实验不预测股票、信用或商品。',
    invariants: ['same yield sign permits different outcomes', 'driver shown', 'shared exposure is explicitly SYN, not a real-world equality'],
    sourceIds: [12, 13],
    chartTitle: 'SYN贡献与净结果（同一κ只为隔离driver；现实Rf/ERP暴露不自动相等）',
    chartLabels: ['CF', 'Rf', 'ERP', 'Basis', 'Net'],
    display: treasuryCurveCalculators.C4,
  },
  {
    id: 'C5',
    fixtureId: '404-fx-v1',
    title: '外国投资者currency/hedge gate：美元回报、本币回报与套保后回报分开算。',
    question: 'Spot贡献、hedge ratio、forward cost与cross-currency basis怎样改变净回报？',
    passport: '独立SYN贡献式；正spotContribution表示按本实验定义提高本币回报。现实使用必须重新声明FX报价方向、期限和roll。',
    fields: [
      { kind: 'decimal', key: 'usdReturn', label: 'USD资产回报', min: -20, max: 20, step: 0.1, scale: 10, unit: '%' },
      { kind: 'decimal', key: 'spotContribution', label: '未套保FX贡献', min: -20, max: 20, step: 0.1, scale: 10, unit: '%' },
      { kind: 'decimal', key: 'hedgeRatio', label: 'Hedge ratio', min: 0, max: 100, step: 5, scale: 1, unit: '%' },
      { kind: 'decimal', key: 'forwardCost', label: 'Forward carry成本', min: -10, max: 10, step: 0.1, scale: 10, unit: '%' },
      { kind: 'decimal', key: 'basisCost', label: 'Cross-currency basis成本', min: -5, max: 5, step: 0.1, scale: 10, unit: '%' },
    ],
    initial: { usdReturn: 2, spotContribution: -3, hedgeRatio: 100, forwardCost: 2, basisCost: 0.4 },
    formula: ['Runhedged ≈ Rusd + FXspot', 'Rhedged ≈ Rusd + (1−h)FXspot − h(forwardCost+basisCost)'],
    defaultRebuild: '未套保为2−3=−1%；100%套保后不再承受spot贡献，但支付2.4%，结果为−0.4%。',
    changeCondition: '把hedge ratio降到50%，观察一半spot贡献与一半hedge cost同时保留。',
    extremes: ['0%与100%都是合法边界', '负hedge cost可以提高回报', '未知h不得默认为0或100'],
    misconception: '更高Treasury yield不保证更高套保后本币回报。',
    counterexample: '美元资产+2%可被2.4%套保成本抵消；未套保还可能受美元贬值拖累。',
    unknownWarning: '未处理现金流时点、rollover、collateral、tax、transaction cost与quanto。',
    invariants: ['three returns remain separate', 'FX sign convention shown', 'missing hedge fields STOP'],
    sourceIds: [14],
    chartTitle: '三种SYN回报',
    chartLabels: ['USD', 'Local unhedged', 'Local hedged'],
    display: treasuryCurveCalculators.C5,
  },
  {
    id: 'C6',
    fixtureId: '404-spillover-v1',
    title: 'Driver-conditioned global pass-through：本地反应与反向溢出必须同时可见。',
    question: '相同美国yield move在不同driver和本地gate下，如何拆成expected-short-rate、term-premium与FX/funding分支？',
    passport: '独立SYN条件逻辑；系数未用BIS/Fed样本校准，localGate只是0–100的教学暴露强度。Unknown是合法driver。',
    fields: [
      { kind: 'select', key: 'driver', label: 'Driver identity', options: [
        { value: 'policy', label: 'Identified-policy candidate' },
        { value: 'growth', label: 'Growth-information candidate' },
        { value: 'funding', label: 'Funding-stress candidate' },
        { value: 'unknown', label: 'Unknown / 不强制分类' },
      ] },
      { kind: 'decimal', key: 'usShockBp', label: 'U.S. yield move', min: -100, max: 100, step: 5, scale: 1, unit: 'bp' },
      { kind: 'decimal', key: 'localGate', label: '本地暴露门强度', min: 0, max: 100, step: 5, scale: 1, unit: 'SYN index' },
      { kind: 'decimal', key: 'policyOffsetBp', label: '本地政策抵消/放大', min: -50, max: 50, step: 1, scale: 1, unit: 'bp' },
      { kind: 'decimal', key: 'reverseBp', label: '反向溢出贡献', min: -30, max: 30, step: 1, scale: 1, unit: 'bp' },
    ],
    initial: { driver: 'policy', usShockBp: 25, localGate: 80, policyOffsetBp: -3, reverseBp: 4 },
    formula: ['local channel = U.S. move × driver multiplier × local gate + stated local offset', 'reverse spillover is reported separately, never netted away silently'],
    defaultRebuild: 'Policy卡的SYN short/term/FX multipliers为0.55/0.25/0.20；U.S. 25bp、gate 80%与−3bp offset得到8bp short、5bp term、4 SYN FX压力，并另报+4bp reverse。',
    changeCondition: '保留U.S. move，切换growth、funding或unknown；unknown会输出null而不是用同号收益率猜driver。',
    extremes: ['localGate 0可产生经济零传导，但policyOffset仍独立', 'reverse可正、负或0', 'unknown输出null而非零'],
    misconception: '全球影响不是pass-through=1，也不是永远美国单向驱动。',
    counterexample: 'Foreign news可在美国开盘前进入Treasury term premium；本地央行也可抵消美国冲击。',
    unknownWarning: '不使用43bp、56bp或20–25%历史估计作校准，不预测任何国家。',
    invariants: ['driver conditioned', 'local gate explicit', 'reverse spillover separate', 'unknown stays null'],
    sourceIds: [10, 11, 12, 14],
    chartTitle: 'SYN本地渠道与反向贡献',
    chartLabels: ['Expected short', 'Term premium', 'FX/funding', 'Reverse'],
    display: treasuryCurveCalculators.C6,
  },
] as const;

export const treasuryCurveLabAudit = [
  { key: 'exactly six independent labs with unique fixture ids', passed: treasuryCurveLabs.length === 6 && new Set(treasuryCurveLabs.map(lab => lab.fixtureId)).size === 6 },
  { key: 'each lab has fields sources formulas boundaries and independent reset defaults', passed: treasuryCurveLabs.every(lab => lab.fields.length >= 2 && lab.sourceIds.length > 0 && lab.formula.length > 0 && lab.invariants.length >= 3 && Object.keys(lab.initial).length === lab.fields.length) },
  { key: 'every default returns a finite or explicit null-safe OK record', passed: treasuryCurveLabs.every(lab => lab.display(lab.initial).status === 'OK') },
  { key: 'all lab ids and field keys are unique within scope', passed: new Set(treasuryCurveLabs.map(lab => lab.id)).size === 6 && treasuryCurveLabs.every(lab => new Set(lab.fields.map(field => field.key)).size === lab.fields.length) },
] as const;
