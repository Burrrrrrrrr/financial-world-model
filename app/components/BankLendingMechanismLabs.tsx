'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import {
  allInLoanOfferMetrics,
  bankBorrowerAllocationMetrics,
  bankLendingFixtureAssertions,
  creditMenuMetrics,
  fundingPassThroughMetrics,
  identificationSubstitutionMetrics,
  loanCapacityMetrics,
  repricingClockMetrics,
} from './bankLendingFixtures';

function SourceMarks({ ids }: { ids: readonly number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function MechanismNoScriptFallback() {
  return <noscript><style>{'.bank-lending-mechanism-lab > :not(header):not(noscript):not(.yield-static-summary){display:none!important}'}</style><div className="precision-note"><span>无脚本模式</span><p>控件已隐藏，因为没有 JavaScript 时数值不会随输入更新。每个实验末尾仍保留一组冻结静态摘要；同一机制也可在本课 K1–K10 静态孪生题中复算。</p></div></noscript>;
}

function ResetControl({ label, onReset }: { label: string; onReset: () => void }) {
  const [armed, setArmed] = useState(false);
  const requestRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const wasOpened = useRef(false);

  useEffect(() => {
    if (armed) {
      wasOpened.current = true;
      confirmRef.current?.focus();
    } else if (wasOpened.current) {
      wasOpened.current = false;
      requestRef.current?.focus();
    }
  }, [armed]);

  if (!armed) return <button className="yield-reset" onClick={() => setArmed(true)} ref={requestRef} type="button">准备重置{label}</button>;
  return <div aria-label={`确认重置${label}`} className="yield-reset-confirm" role="group"><button onClick={() => setArmed(false)} type="button">取消</button><button onClick={() => { onReset(); setArmed(false); }} ref={confirmRef} type="button">确认重置</button></div>;
}

function RangeInput({
  display,
  label,
  max,
  min = 0,
  onChange,
  step = 1,
  value,
}: {
  display?: (value: number) => string;
  label: string;
  max: number;
  min?: number;
  onChange: (value: number) => void;
  step?: number;
  value: number;
}) {
  return <label><span>{label}</span><b>{display ? display(value) : value.toLocaleString()}</b><input aria-label={label} max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} /></label>;
}

function SignedBp({ value }: { value: number }) {
  return <>{value > 0 ? '+' : ''}{value.toFixed(1)} bp</>;
}

function LabShell({
  children,
  id,
  kicker,
  sources,
  title,
}: {
  children: ReactNode;
  id: string;
  kicker: string;
  sources: readonly number[];
  title: string;
}) {
  return <section aria-labelledby={`${id}-title`} className="yield-mechanism-lab bank-credit-mechanism-lab bank-lending-mechanism-lab" id={id}><header><div><span>{kicker}</span><h3 id={`${id}-title`}>{title}</h3></div><p><SourceMarks ids={sources} /></p></header><MechanismNoScriptFallback />{children}</section>;
}

const interactiveOfferComponentIds = {
  referenceRate: 'interactive:reference-rate',
  marginalFundingCost: 'interactive:marginal-funding-cost',
  fundingSpread: 'interactive:funding-spread',
  expectedLoss: 'interactive:expected-loss',
  operatingCost: 'interactive:operating-cost',
  capitalShadowCost: 'interactive:capital-shadow-cost',
  liquidityShadowCost: 'interactive:liquidity-shadow-cost',
  concentrationOpportunityCost: 'interactive:concentration-opportunity-cost',
  targetResidualReturn: 'interactive:target-residual-return',
  upfrontFee: 'interactive:upfront-fee',
};

export function AllInLoanPricingLab() {
  const [quoteKind, setQuoteKind] = useState<'all-in-mcf' | 'spread-over-reference'>('all-in-mcf');
  const [referenceRatePct, setReferenceRatePct] = useState(4);
  const [marginalFundingCostPct, setMarginalFundingCostPct] = useState(5);
  const [fundingSpreadPct, setFundingSpreadPct] = useState(1);
  const [expectedLossPct, setExpectedLossPct] = useState(0.8);
  const [operatingCostPct, setOperatingCostPct] = useState(0.4);
  const [capitalShadowCostPct, setCapitalShadowCostPct] = useState(0.6);
  const [liquidityShadowCostPct, setLiquidityShadowCostPct] = useState(0.2);
  const [concentrationOpportunityCostPct, setConcentrationOpportunityCostPct] = useState(0.2);
  const [targetResidualReturnPct, setTargetResidualReturnPct] = useState(0.8);
  const [upfrontFeeAmount, setUpfrontFeeAmount] = useState(1);
  const [principalAmount, setPrincipalAmount] = useState(100);
  const [termMonths, setTermMonths] = useState(12);
  const result = allInLoanOfferMetrics({
    synthetic: true,
    currency: 'SYN',
    amountUnit: 'SYN-currency',
    rateUnit: 'percent-per-year',
    feeOutputUnit: 'basis-points',
    referenceRatePct,
    fundingQuote: quoteKind === 'all-in-mcf'
      ? { kind: 'all-in-mcf', marginalFundingCostPct }
      : { kind: 'spread-over-reference', fundingSpreadPct },
    expectedLossPct,
    operatingCostPct,
    capitalShadowCostPct,
    liquidityShadowCostPct,
    concentrationOpportunityCostPct,
    targetResidualReturnPct,
    upfrontFeeAmount,
    principalAmount,
    termMonths,
    componentIds: interactiveOfferComponentIds,
  });

  return <LabShell id="bank-lending-c1" kicker="C1 · ALL-IN LOAN OFFER" sources={[10, 25, 33, 34]} title="全口径贷款报价先固定资金成本口径，再把风险、运营、约束影子成本与费用逐项显式加入">
    <div className="yield-view-picker" role="group" aria-label="选择边际融资成本的输入口径">{([['all-in-mcf', '全含边际融资成本'], ['spread-over-reference', '相对基准的融资利差']] as const).map(([id, label]) => <button aria-pressed={quoteKind === id} className={quoteKind === id ? 'active' : ''} key={id} onClick={() => setQuoteKind(id)} type="button">{label}</button>)}</div>
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="合同参考利率" max={8} min={-3} onChange={setReferenceRatePct} step={0.1} value={referenceRatePct} />
      {quoteKind === 'all-in-mcf'
        ? <RangeInput display={(value) => `${value.toFixed(1)}%`} label="全含边际融资成本 MCF" max={10} min={-3} onChange={setMarginalFundingCostPct} step={0.1} value={marginalFundingCostPct} />
        : <RangeInput display={(value) => `${value.toFixed(1)}%`} label="相对参考利率的融资利差" max={4} min={-3} onChange={setFundingSpreadPct} step={0.1} value={fundingSpreadPct} />}
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="冻结预期损失" max={4} onChange={setExpectedLossPct} step={0.1} value={expectedLossPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="运营成本" max={2} onChange={setOperatingCostPct} step={0.1} value={operatingCostPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="资本影子成本" max={3} onChange={setCapitalShadowCostPct} step={0.1} value={capitalShadowCostPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="流动性影子成本" max={3} onChange={setLiquidityShadowCostPct} step={0.1} value={liquidityShadowCostPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="集中度机会成本" max={3} onChange={setConcentrationOpportunityCostPct} step={0.1} value={concentrationOpportunityCostPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="目标剩余回报" max={4} onChange={setTargetResidualReturnPct} step={0.1} value={targetResidualReturnPct} />
      <RangeInput display={(value) => `${value.toFixed(1)} SYN`} label="一次性费用" max={4} onChange={setUpfrontFeeAmount} step={0.1} value={upfrontFeeAmount} />
      <RangeInput display={(value) => `${value} SYN`} label="本金" max={200} min={50} onChange={setPrincipalAmount} step={10} value={principalAmount} />
      <RangeInput display={(value) => `${value}个月`} label="合同期限" max={60} min={6} onChange={setTermMonths} step={6} value={termMonths} />
    </div>
    {result ? <div className="holding-return-chain" role="group" aria-label="全口径贷款报价结果链"><article><span>参考利率</span><b>{result.referenceRatePct.toFixed(2)}%</b><p>这是合同锚；在全含MCF口径下不另行加总。参考利率、MCF与融资利差均允许有限有符号值。</p></article><article><span>边际融资成本</span><b data-testid="c1-mcf">{result.marginalFundingCostPct.toFixed(2)}%</b><p>相对参考利率的融资利差为 {result.fundingSpreadPct.toFixed(2)}%；当前利息链使用 {result.additiveInterestComponentIds.length} 个互异组件ID。</p></article><article><span>利息报价</span><b data-testid="c1-interest-rate">{result.annualInterestRatePct.toFixed(2)}%</b><p>MCF + 冻结EL + 运营 + 资本 + 流动性 + 集中度机会成本 + 目标剩余回报。</p></article><article className="result"><span>费用年化后的全含等价报价</span><b data-testid="c1-all-in">{result.allInEquivalentPct.toFixed(2)}%</b><p>一次性费用按本金和期限简单线性年化为 {result.annualizedFeeBp.toFixed(1)} bp；费用ID与利息链分列，合计 {result.componentIdCount} 个活动组件。</p></article></div> : <div className="wacc-decision ineligible" role="alert"><span>STOP</span><b>输入口径或组件账本不合法</b><p>利率锚、MCF或利差必须有限；非融资成本、费用、本金与期限必须在各自定义域内，且所有成本组件ID必须非空互异。</p></div>}
    <div className="precision-note"><span>公式后的白话</span><p><code>利息报价 = MCF + EL + 运营成本 + 资本影子成本 + 流动性影子成本 + 集中度机会成本 + 目标剩余回报</code>。若输入的是“参考利率上的融资利差”，计算器先把二者合成MCF；若输入已经是全含MCF，就绝不再加一次参考利率。目标剩余回报是达到既定回报目标所需的剩余项，不是在另一个hurdle之上的第二次加价。费用另外年化，只为比较报价，不代表实际有效利率、监管APR或已实现收益。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>冻结参考利率4%、全含MCF 5%、EL 0.8%、运营0.4%、资本0.6%、流动性0.2%、集中度机会成本0.2%、目标剩余回报0.8%，利息报价为8%；12个月本金100、一次性费用1简单年化为100bp，因此全含等价报价为9%。这是合成报价分解，不是某家银行的真实报价或预测。</div>
    <ResetControl label="C1" onReset={() => { setQuoteKind('all-in-mcf'); setReferenceRatePct(4); setMarginalFundingCostPct(5); setFundingSpreadPct(1); setExpectedLossPct(0.8); setOperatingCostPct(0.4); setCapitalShadowCostPct(0.6); setLiquidityShadowCostPct(0.2); setConcentrationOpportunityCostPct(0.2); setTargetResidualReturnPct(0.8); setUpfrontFeeAmount(1); setPrincipalAmount(100); setTermMonths(12); }} />
  </LabShell>;
}

export function FundingMixBetaLab() {
  const [direction, setDirection] = useState<'tightening' | 'easing'>('tightening');
  const [policyMoveBp, setPolicyMoveBp] = useState(100);
  const [depositStockWeightPct, setDepositStockWeightPct] = useState(60);
  const [depositMarginalSharePct, setDepositMarginalSharePct] = useState(60);
  const [depositOpeningCostPct, setDepositOpeningCostPct] = useState(2);
  const [depositBeta, setDepositBeta] = useState(0.3);
  const [wholesaleOpeningCostPct, setWholesaleOpeningCostPct] = useState(4);
  const [wholesaleBeta, setWholesaleBeta] = useState(0.9);
  const [depositOutflowPct, setDepositOutflowPct] = useState(25);
  const [replacementOpeningCostPct, setReplacementOpeningCostPct] = useState(4);
  const [replacementBeta, setReplacementBeta] = useState(1);
  const [transitionPremiumBp, setTransitionPremiumBp] = useState(20);
  const result = fundingPassThroughMetrics({
    synthetic: true,
    rateUnit: 'percent-per-year',
    moveUnit: 'basis-points',
    weightUnit: 'decimal-ratio',
    policyMoveDirection: direction,
    policyMoveBp,
    sources: [
      { sourceId: 'deposits', kind: 'deposit', stockWeightRatio: depositStockWeightPct / 100, marginalFundingShareRatio: depositMarginalSharePct / 100, openingCostPct: depositOpeningCostPct, depositBeta },
      { sourceId: 'wholesale', kind: 'wholesale', stockWeightRatio: 1 - depositStockWeightPct / 100, marginalFundingShareRatio: 1 - depositMarginalSharePct / 100, openingCostPct: wholesaleOpeningCostPct, passThroughCoefficient: wholesaleBeta },
    ],
    depositSourceId: 'deposits',
    depositOutflowFraction: depositOutflowPct / 100,
    replacementFunding: { openingCostPct: replacementOpeningCostPct, passThroughCoefficient: replacementBeta, transitionPremiumBp },
  });

  return <LabShell id="bank-lending-c2" kicker="C2 · FUNDING MIX, BETA & OUTFLOW" sources={[8, 10, 19, 25, 27, 29, 30, 33]} title="低存款 beta 只压低第一阶段重定价；存款流出后，替代融资会从第二条路径重新抬高边际成本">
    <div className="yield-view-picker" role="group" aria-label="选择政策移动方向">{([['tightening', '紧缩：利率上移'], ['easing', '宽松：利率下移']] as const).map(([id, label]) => <button aria-pressed={direction === id} className={direction === id ? 'active' : ''} key={id} onClick={() => setDirection(id)} type="button">{label}</button>)}</div>
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} bp`} label="政策利率移动幅度" max={200} onChange={setPolicyMoveBp} step={10} value={policyMoveBp} />
      <RangeInput display={(value) => `${value}%`} label="ACF存量篮子的存款权重" max={90} min={10} onChange={setDepositStockWeightPct} step={5} value={depositStockWeightPct} />
      <RangeInput display={(value) => `${value}%`} label="MCF边际篮子的存款份额" max={90} min={10} onChange={setDepositMarginalSharePct} step={5} value={depositMarginalSharePct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="存款期初成本" max={5} onChange={setDepositOpeningCostPct} step={0.1} value={depositOpeningCostPct} />
      <RangeInput display={(value) => value.toFixed(2)} label="存款 beta" max={1.2} onChange={setDepositBeta} step={0.05} value={depositBeta} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="批发融资期初成本" max={8} onChange={setWholesaleOpeningCostPct} step={0.1} value={wholesaleOpeningCostPct} />
      <RangeInput display={(value) => value.toFixed(2)} label="批发融资传导系数" max={1.5} onChange={setWholesaleBeta} step={0.05} value={wholesaleBeta} />
      <RangeInput display={(value) => `${value}%`} label="存款流出占该存款来源" max={60} onChange={setDepositOutflowPct} step={5} value={depositOutflowPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="替代融资期初成本" max={8} onChange={setReplacementOpeningCostPct} step={0.1} value={replacementOpeningCostPct} />
      <RangeInput display={(value) => value.toFixed(2)} label="替代融资传导系数" max={1.5} onChange={setReplacementBeta} step={0.05} value={replacementBeta} />
      <RangeInput display={(value) => `${value} bp`} label="转换期溢价" max={100} onChange={setTransitionPremiumBp} step={5} value={transitionPremiumBp} />
    </div>
    {result ? <><div className="holding-return-chain" role="group" aria-label="ACF存量融资成本两阶段传导"><article><span>ACF存量篮子传导系数</span><b data-testid="c2-acf-coefficient">{result.stockWeightedPassThroughCoefficient.toFixed(3)}</b><p>只用各来源的存量权重计算代表性平均融资成本。</p></article><article><span>ACF第一阶段</span><b data-testid="c2-acf-stage-one"><SignedBp value={result.averageFirstStageChangeBp} /></b><p>期初 {result.openingAverageFundingCostPct.toFixed(3)}%，冻结存量权重后 {result.fixedStockPostAverageCostPct.toFixed(3)}%。</p></article><article><span>ACF替代阶段</span><b data-testid="c2-acf-stage-two"><SignedBp value={result.replacementEffectOnAverageCostBp} /></b><p>存量篮子被挤出存款权重 {(result.displacedDepositStockWeight * 100).toFixed(1)}%。</p></article><article className="result"><span>ACF两阶段总变化</span><b data-testid="c2-acf-total"><SignedBp value={result.totalAverageFundingCostChangeBp} /></b><p>最终平均融资成本 {result.secondStageAverageFundingCostPct.toFixed(3)}%。</p></article></div><div className="holding-return-chain" role="group" aria-label="MCF边际融资成本两阶段传导"><article><span>MCF边际篮子传导系数</span><b data-testid="c2-mcf-coefficient">{result.marginalFundingPassThroughCoefficient.toFixed(3)}</b><p>使用下一单位资金包的边际份额；它不必等于存量权重。</p></article><article><span>MCF第一阶段</span><b data-testid="c2-mcf-stage-one"><SignedBp value={result.marginalFirstStageChangeBp} /></b><p>期初 {result.openingMarginalFundingCostPct.toFixed(3)}%，冻结边际份额后 {result.fixedMarginalPostFundingCostPct.toFixed(3)}%。</p></article><article><span>MCF替代阶段</span><b data-testid="c2-mcf-stage-two"><SignedBp value={result.replacementEffectOnMarginalCostBp} /></b><p>边际篮子被挤出存款份额 {(result.displacedDepositMarginalShare * 100).toFixed(1)}%；替代资金事后成本 {result.replacementFundingPostCostPct.toFixed(3)}%。</p></article><article className="result"><span>MCF两阶段总变化</span><b data-testid="c2-mcf-total"><SignedBp value={result.totalMarginalFundingCostChangeBp} /></b><p>最终边际融资成本 {result.secondStageMarginalFundingCostPct.toFixed(3)}%。</p></article></div></> : <div className="wacc-decision ineligible" role="alert"><span>STOP</span><b>融资权重、成本或单位未闭合</b><p>ACF存量权重与MCF边际份额必须分别严格合计为1；第二阶段流出比例只能在0到100%之间，政策移动后的所有名义融资成本必须保持非负。</p></div>}
    <div className="precision-note"><span>两个篮子、两个阶段</span><p><code>ACF第一阶段 = Σ存量权重 × 来源传导系数 × 政策移动</code>，而 <code>MCF第一阶段 = Σ边际融资份额 × 来源传导系数 × 政策移动</code>；随后分别用各篮子“被挤出的存款份额 × 替代融资与存款的事后成本差”计算第二阶段。只有存款来源使用deposit beta这一专名，批发与替代融资使用一般传导系数。低存款beta不等于银行天然免疫：数量流失与昂贵替代资金仍可能抵消第一阶段保护。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>本冻结例中，存款/批发融资在ACF存量篮子和MCF边际篮子都恰为60%/40%，所以两者传导系数都为0.54、紧缩100bp后的第一阶段都为+54bp；这只是数值巧合，不是概念恒等。25%的存款来源流出使两个篮子各替代15%，含20bp转换溢价的替代资金再增加43.5bp，因此两阶段总变化都为97.5bp。改变“MCF边际篮子的存款份额”会让两条结果分开。</div>
    <ResetControl label="C2" onReset={() => { setDirection('tightening'); setPolicyMoveBp(100); setDepositStockWeightPct(60); setDepositMarginalSharePct(60); setDepositOpeningCostPct(2); setDepositBeta(0.3); setWholesaleOpeningCostPct(4); setWholesaleBeta(0.9); setDepositOutflowPct(25); setReplacementOpeningCostPct(4); setReplacementBeta(1); setTransitionPremiumBp(20); }} />
  </LabShell>;
}

export function RepricingClockLab() {
  const [horizon, setHorizon] = useState<0 | 3 | 12 | 24>(3);
  const [newBusinessRatePct, setNewBusinessRatePct] = useState(7);
  const [currentRatePct, setCurrentRatePct] = useState(5);
  const [repricedRatePct, setRepricedRatePct] = useState(7);
  const [floatingSharePct, setFloatingSharePct] = useState(20);
  const [fixedSharePct, setFixedSharePct] = useState(20);
  const resettableShare = 100 - floatingSharePct - fixedSharePct;
  const result = repricingClockMetrics({
    synthetic: true,
    amountUnit: 'SYN-currency',
    rateUnit: 'percent-per-year',
    newBusinessRatePct,
    buckets: [
      { bucket: 'floating', balance: floatingSharePct, currentRatePct, repricedRatePct },
      { bucket: 'reset-3m', balance: resettableShare / 3, currentRatePct, repricedRatePct },
      { bucket: 'reset-6m', balance: resettableShare / 3, currentRatePct, repricedRatePct },
      { bucket: 'reset-12m', balance: resettableShare / 3, currentRatePct, repricedRatePct },
      { bucket: 'fixed', balance: fixedSharePct, currentRatePct, repricedRatePct },
    ],
  });
  const selectedStockRate = result?.stockRatesPctByHorizon[horizon];
  const selectedRepricedShare = result?.repricedSharesByHorizon[horizon];

  return <LabShell id="bank-lending-c3" kicker="C3 · NEW BUSINESS VS STOCK CLOCK" sources={[33, 34, 35, 57]} title="新贷报价可以今天跳变，存量贷款却只在各自重定价日逐桶迁移">
    <div className="yield-view-picker" role="group" aria-label="选择存量贷款观察时点">{([0, 3, 12, 24] as const).map((month) => <button aria-pressed={horizon === month} className={horizon === month ? 'active' : ''} key={month} onClick={() => setHorizon(month)} type="button">第{month}月</button>)}</div>
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="新业务报价" max={10} onChange={setNewBusinessRatePct} step={0.1} value={newBusinessRatePct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="存量当前合同利率" max={10} onChange={setCurrentRatePct} step={0.1} value={currentRatePct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="重定价后合同利率" max={10} onChange={setRepricedRatePct} step={0.1} value={repricedRatePct} />
      <RangeInput display={(value) => `${value}%`} label="浮息桶占存量" max={80 - fixedSharePct} onChange={setFloatingSharePct} step={5} value={floatingSharePct} />
      <RangeInput display={(value) => `${value}%`} label="合同期内固定桶占存量" max={80 - floatingSharePct} onChange={setFixedSharePct} step={5} value={fixedSharePct} />
    </div>
    {result ? <><div className="holding-return-chain" role="group" aria-label="新贷与存量重定价时钟"><article><span>新业务</span><b data-testid="c3-new-rate">{result.newBusinessRatePct.toFixed(3)}%</b><p>这是新签或真正重新议价的流量价格，不被塞进冻结存量。</p></article><article><span>第{horizon}月已重定价</span><b data-testid="c3-repriced-share">{((selectedRepricedShare ?? 0) * 100).toFixed(1)}%</b><p>浮息桶第0月、3月桶第3月、6月桶第6月、12月桶第12月进入新率；固定桶不自动迁移。</p></article><article className="result"><span>第{horizon}月存量加权利率</span><b data-testid="c3-stock-rate">{selectedStockRate?.toFixed(3)}%</b><p>它由尚未重定价与已经重定价的余额共同决定，因此通常比新业务序列更慢。</p></article></div><div className="holding-return-chain" role="group" aria-label="存量利率完整时间线">{([0, 3, 12, 24] as const).map((month) => <article className={month === horizon ? 'result' : undefined} key={month}><span>第{month}月</span><b>{result.stockRatesPctByHorizon[month].toFixed(3)}%</b><p>已重定价 {(result.repricedSharesByHorizon[month] * 100).toFixed(1)}%</p></article>)}</div></> : <div className="wacc-decision ineligible" role="alert"><span>STOP</span><b>存量桶未闭合</b><p>五个互斥桶必须完整、总余额为正，利率与余额均需非负。</p></div>}
    <div className="precision-note"><span>测量边界</span><p><code>存量利率(t) = Σ桶余额 × 该桶在t时点适用利率 ÷ 总存量</code>。这句话只说合同重定价时钟；它没有把新发放规模、提前偿还、违约、展期、构成迁移或借款人需求当作已控制变量。真实数据必须明确“新业务/存量”、初始固定期、剩余期限和下一重定价桶。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>五个桶各20、当前利率5%、重定价后7%时，新业务立即显示7%；存量在第0/3/12/24月分别为5.4%/5.8%/6.6%/6.6%，已重定价份额20%/40%/80%/80%。固定桶即使到第24月仍未按本实验规则自动变为新率。</div>
    <ResetControl label="C3" onReset={() => { setHorizon(3); setNewBusinessRatePct(7); setCurrentRatePct(5); setRepricedRatePct(7); setFloatingSharePct(20); setFixedSharePct(20); }} />
  </LabShell>;
}

const capacityLabels = [
  ['capital', '风险资本'],
  ['leverage', '杠杆率'],
  ['lcr', '30日流动性'],
  ['nsfr', '稳定融资'],
  ['concentration', '集中度'],
] as const;

const capacityStateLabels = {
  breached: 'BREACHED · 已越界（保留负深度）',
  'binding-at-zero': 'BINDING AT ZERO · 恰在门槛',
  'positive-binding': 'POSITIVE BINDING · 正容量绑定',
  'not-binding': 'NOT BINDING · 仍有余量',
} as const;

export function UnifiedCapacityLab() {
  const [cet1, setCet1] = useState(15);
  const [tier1ForLeverage, setTier1ForLeverage] = useState(12);
  const [hqla, setHqla] = useState(30);
  const [availableStableFunding, setAvailableStableFunding] = useState(120);
  const [connectedExposureBefore, setConnectedExposureBefore] = useState(0.5);
  const [unitsMatched, setUnitsMatched] = useState(true);
  const [assumptionsFrozen, setAssumptionsFrozen] = useState(true);
  const result = unitsMatched && assumptionsFrozen ? loanCapacityMetrics({
    synthetic: true,
    amountUnit: 'SYN-currency',
    capacityUnit: 'SYN-currency',
    ratioUnit: 'decimal-ratio',
    mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1',
    mappingTarget: { loanInstrumentId: 'SYN-C4-TERM-LOAN', lenderLegalEntityId: 'SYN-C4-BANK', currency: 'SYN', decisionTime: '2026-09-03T00:00:00Z', mappingBasis: 'incremental-drawn-term-loan-principal' },
    capital: { nativeHorizon: 'point-in-time', cet1, minimumCET1Ratio: 0.1, rwaBefore: 100, loanRiskWeight: 0.5 },
    leverage: { nativeHorizon: 'point-in-time', tier1Capital: tier1ForLeverage, minimumLeverageRatio: 0.03, leverageExposureBefore: 300, loanExposureFactor: 1 },
    lcr: { nativeHorizon: '30-calendar-days', hqla, minimumLCR: 1, cappedNetCashOutflowBefore: 20, loanNetOutflowFactor: 0.2 },
    nsfr: { nativeHorizon: 'one-year', availableStableFunding, minimumNSFR: 1, requiredStableFundingBefore: 100, loanRSFFactor: 0.5 },
    concentration: { nativeHorizon: 'point-in-time', tier1Capital: 12, maximumExposureRatio: 0.25, connectedExposureBefore, loanExposureFactor: 0.05 },
    assumptions: { otherAssetsFixed: true, capitalAndEarningsFixed: true, riskWeightsFixed: true, lcrNetOutflowAlreadyCapped: true, marginalLoanFactorsFixed: true, regulatoryBuffersIncludedInMinimums: true },
  }) : null;
  const hasBreach = Boolean(result?.breachedConstraints.length);

  return <LabShell id="bank-lending-c4" kicker="C4 · UNIFIED MARGINAL CAPACITY" sources={[21, 23, 24, 62, 67, 68, 69, 70, 71]} title="资本、杠杆、流动性、稳定融资和集中度先各自换算成同一种边际贷款容量，再由最小值绑定">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} SYN`} label="CET1资本" max={25} min={5} onChange={setCet1} value={cet1} />
      <RangeInput display={(value) => `${value} SYN`} label="杠杆率口径Tier 1资本" max={20} min={7} onChange={setTier1ForLeverage} value={tier1ForLeverage} />
      <RangeInput display={(value) => `${value} SYN`} label="HQLA" max={50} min={20} onChange={setHqla} value={hqla} />
      <RangeInput display={(value) => `${value} SYN`} label="可用稳定融资" max={160} min={100} onChange={setAvailableStableFunding} step={5} value={availableStableFunding} />
      <RangeInput display={(value) => `${value.toFixed(2)} SYN`} label="同一关联方既有暴露" max={5} onChange={setConnectedExposureBefore} step={0.25} value={connectedExposureBefore} />
    </div>
    <fieldset className="yield-model-picker"><legend>统一容量的资格门</legend><label><input checked={unitsMatched} onChange={(event) => setUnitsMatched(event.target.checked)} type="checkbox" />五项都映射到同一贷款工具、法人、币种、决策时点与新增提款本金basis</label><label><input checked={assumptionsFrozen} onChange={(event) => setAssumptionsFrozen(event.target.checked)} type="checkbox" />其他资产、资本收益、风险权重与边际转换因子冻结</label></fieldset>
    {result ? <><output className={`wacc-decision ${hasBreach ? 'ineligible' : 'eligible'}`}><span>{hasBreach ? 'SYNTHETIC RULE BREACHED · 新增容量为零' : 'FEASIBLE LOAN CAPACITY · 局部教学上限'}</span><b data-testid="c4-capacity">{result.feasibleLoanCapacity.toFixed(2)} SYN</b><p>{hasBreach ? `已越界规则：${result.breachedConstraints.map((key) => capacityLabels.find(([id]) => id === key)?.[1] ?? key).join(' / ')}；负值没有被抹去。` : `最紧约束：${result.bindingConstraints.map((key) => capacityLabels.find(([id]) => id === key)?.[1] ?? key).join(' / ')}。`}</p></output><div className="holding-return-chain" role="group" aria-label="五项规则的有符号余量与换算容量">{capacityLabels.map(([key, label]) => { const diagnostic = result.constraintDiagnostics[key]; return <article className={diagnostic.breached || result.bindingConstraints.includes(key) ? 'result' : undefined} key={key}><span>{label} · {diagnostic.direction === 'minimum' ? '最低门槛' : '最高上限'}</span><b>{diagnostic.signedConvertedCapacity > 0 ? '+' : ''}{diagnostic.signedConvertedCapacity.toFixed(2)} SYN</b><p>{capacityStateLabels[diagnostic.bindingState]}；signed raw headroom={diagnostic.signedRawHeadroom > 0 ? '+' : ''}{diagnostic.signedRawHeadroom.toFixed(2)} SYN；{result.nativeHorizons[key]}。</p></article>; })}</div><div className="precision-note"><span>共同映射护照</span><p>工具 {result.mappingTarget.loanInstrumentId}；法人 {result.mappingTarget.lenderLegalEntityId}；币种 {result.mappingTarget.currency}；决策时点 {result.mappingTarget.decisionTime}；basis {result.mappingTarget.mappingBasis}。共同映射不抹平规则原生horizon：LCR仍是30日、NSFR仍是一年，其余为时点口径。</p></div></> : <div className="wacc-decision ineligible" role="alert"><span>STOP · 不输出容量</span><b>共同映射目标或局部线性假设没有冻结</b><p>异质监管比率不能直接相加或取最小；必须先在明确分母、转换因子、缓冲、贷款工具、法人、币种、决策时点与basis下换算成相同贷款本金单位。</p></div>}
    <div className="precision-note"><span>不是监管合规计算器</span><p>每项先报告有符号原始余量，再按同一目标贷款的边际分母或分子用量换算为有符号容量。最低门槛用“分子−门槛×分母”，最高上限用“上限×分母−分子”；因此负值保留越界深度，恰好为零与正容量绑定也分开标记。只有最终新增可行容量采用 <code>max(0, min(五项 signed capacity))</code>。各规则原生horizon仍需保留，任何最低比率、缓冲、暴露定义和净流出上限都必须由适用法域与报告期规则提供。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>在同一SYN期限贷款、同一法人、币种、决策时点与“新增提款本金”basis下，冻结参数的有符号换算容量为100/100/50/40/50 SYN，因此可行容量是40，NSFR为positive binding。把CET1调至5会显示raw −5、converted −100、feasible 0并标记breached；把某门恰好调到阈值则显示binding at zero。LCR保留30日原生horizon、NSFR保留一年，其余规则保留时点口径。</div>
    <ResetControl label="C4" onReset={() => { setCet1(15); setTier1ForLeverage(12); setHqla(30); setAvailableStableFunding(120); setConnectedExposureBefore(0.5); setUnitsMatched(true); setAssumptionsFrozen(true); }} />
  </LabShell>;
}

export function CreditMenuRationingLab() {
  const [offerRatePct, setOfferRatePct] = useState(7);
  const [approvedLimit, setApprovedLimit] = useState(80);
  const [termMonths, setTermMonths] = useState(24);
  const [collateralRequirementPct, setCollateralRequirementPct] = useState(70);
  const [covenantCount, setCovenantCount] = useState(3);
  const [rejectionProbabilityPct, setRejectionProbabilityPct] = useState(25);
  const [framework, setFramework] = useState<'none' | 'stiglitz-weiss'>('stiglitz-weiss');
  const [modelReturnTurnsDown, setModelReturnTurnsDown] = useState(true);
  const result = creditMenuMetrics({
    synthetic: true,
    amountUnit: 'SYN-currency',
    rateUnit: 'percent-per-year',
    probabilityUnit: 'percent-probability',
    baseline: { offerRatePct: 6, approvedLimit: 100, termMonths: 36, collateralRequirementPct: 50, covenantCount: 1, rejectionProbabilityPct: 10 },
    proposed: { offerRatePct, approvedLimit, termMonths, collateralRequirementPct, covenantCount, rejectionProbabilityPct },
    frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
    rationingModel: { framework, higherRateReducesExpectedReturnUnderModel: framework === 'stiglitz-weiss' && modelReturnTurnsDown },
  });

  return <LabShell id="bank-lending-c5" kicker="C5 · CREDIT MENU & CONDITIONAL RATIONING" sources={[11, 12, 13, 18, 53, 56]} title="银行可以沿价格、额度、期限、抵押、契约和拒绝概率共同调整；信用配给只在明确的信息模型中是条件性结论">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="拟议报价利率" max={10} min={3} onChange={setOfferRatePct} step={0.1} value={offerRatePct} />
      <RangeInput display={(value) => `${value} SYN`} label="拟议批准额度" max={120} min={20} onChange={setApprovedLimit} step={5} value={approvedLimit} />
      <RangeInput display={(value) => `${value}个月`} label="拟议期限" max={60} min={6} onChange={setTermMonths} step={6} value={termMonths} />
      <RangeInput display={(value) => `${value}%`} label="拟议抵押覆盖要求" max={100} onChange={setCollateralRequirementPct} step={5} value={collateralRequirementPct} />
      <RangeInput label="拟议契约条数" max={6} onChange={setCovenantCount} value={covenantCount} />
      <RangeInput display={(value) => `${value}%`} label="拟议拒绝概率" max={60} onChange={setRejectionProbabilityPct} step={5} value={rejectionProbabilityPct} />
    </div>
    <fieldset className="yield-model-picker"><legend>信用配给理论开关</legend><label><input checked={framework === 'stiglitz-weiss'} onChange={(event) => { setFramework(event.target.checked ? 'stiglitz-weiss' : 'none'); if (!event.target.checked) setModelReturnTurnsDown(false); }} type="checkbox" />采用 Stiglitz–Weiss 型逆向选择框架</label><label><input checked={modelReturnTurnsDown} disabled={framework === 'none'} onChange={(event) => setModelReturnTurnsDown(event.target.checked)} type="checkbox" />在该模型参数下，更高利率会降低银行期望回报</label></fieldset>
    {result ? <><div className="holding-return-chain" role="group" aria-label="六维贷款菜单变化"><article><span>价格</span><b data-testid="c5-price"><SignedBp value={result.offerRateChangeBp} /></b><p>相对基准6%。</p></article><article><span>额度 / 期限</span><b>{result.approvedLimitChange > 0 ? '+' : ''}{result.approvedLimitChange} SYN · {result.termChangeMonths > 0 ? '+' : ''}{result.termChangeMonths}月</b><p>数量与到期结构是独立边际。</p></article><article><span>抵押 / 契约</span><b>{result.collateralRequirementChangePctPoints > 0 ? '+' : ''}{result.collateralRequirementChangePctPoints.toFixed(0)}个百分点 · {result.covenantCountChange > 0 ? '+' : ''}{result.covenantCountChange}条</b><p>不能仅由观察到的利率概括。</p></article><article className="result"><span>菜单收紧维度</span><b data-testid="c5-dimensions">{result.tighteningDimensions}/6</b><p>拒绝概率变化 {result.rejectionProbabilityChangePctPoints > 0 ? '+' : ''}{result.rejectionProbabilityChangePctPoints.toFixed(0)}个百分点。</p></article></div><output className={result.stiglitzWeissConditionalResult ? 'wacc-decision eligible' : 'wacc-decision ineligible'}><span>{result.stiglitzWeissConditionalResult ? 'MODEL-CONDITIONAL RATIONING' : 'NO RATIONING CLAIM'}</span><b>{result.stiglitzWeissConditionalResult ? '在所选模型假设下，银行可能不以继续加价清算市场' : '当前开关不足以推出信用配给'}</b><p>这只是特定信息结构、合同空间和参数下的比较静态；它既不是“所有贷款市场都配给”的事实，也没有识别独立的银行贷款供给效应。</p></output></> : <div className="wacc-decision ineligible" role="alert"><span>STOP</span><b>菜单或模型组合不合法</b><p>金额、期限和概率必须在定义域内；没有选择理论框架时，不能同时宣称模型期望回报随利率下降。</p></div>}
    <div className="precision-note"><span>冻结边界</span><p>本实验把借款人PD、LGD、抵押品价值和银行风险容忍度全部冻结，只让银行提供的合同菜单变化。因此“额度少20”是菜单中的描述性供给候选，不是已识别的供给冲击；若风险评价或风险容忍度随政策改变，机制已跨入3.11或3.12。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>相对6%、额度100、期限36月、抵押50%、1条契约、拒绝概率10%的基准菜单，拟议菜单为7%、80、24月、70%、3条和25%，六个维度均收紧。在Stiglitz–Weiss型框架且更高利率降低模型期望回报的前提下，输出只写“模型条件下可能配给”，不写成普遍事实或因果识别。</div>
    <ResetControl label="C5" onReset={() => { setOfferRatePct(7); setApprovedLimit(80); setTermMonths(24); setCollateralRequirementPct(70); setCovenantCount(3); setRejectionProbabilityPct(25); setFramework('stiglitz-weiss'); setModelReturnTurnsDown(true); }} />
  </LabShell>;
}

export function BankBorrowerAllocationLab() {
  const [borrowerXBankTotal, setBorrowerXBankTotal] = useState(110);
  const [borrowerYBankTotal, setBorrowerYBankTotal] = useState(90);
  const [borrowerXAtA, setBorrowerXAtA] = useState(70);
  const [borrowerYAtA, setBorrowerYAtA] = useState(60);
  const [borrowerXExternal, setBorrowerXExternal] = useState(5);
  const [borrowerYExternal, setBorrowerYExternal] = useState(5);
  const [riskAssessmentFrozen, setRiskAssessmentFrozen] = useState(true);
  const [riskToleranceFrozen, setRiskToleranceFrozen] = useState(true);
  const result = riskAssessmentFrozen && riskToleranceFrozen ? bankBorrowerAllocationMetrics({
    synthetic: true,
    amountUnit: 'SYN-currency',
    probabilityUnit: 'percent-probability',
    banks: [{ bankId: 'A', fixedRiskToleranceScore: 60 }, { bankId: 'B', fixedRiskToleranceScore: 60 }],
    borrowers: [
      { borrowerId: 'X', fixedPDPct: 2, fixedLGDPct: 40, fixedCollateralValue: 100, totalFinancingDemand: 150, relationshipBankId: 'A' },
      { borrowerId: 'Y', fixedPDPct: 4, fixedLGDPct: 50, fixedCollateralValue: 80, totalFinancingDemand: 130, relationshipBankId: 'A' },
    ],
    pairs: [
      { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: Math.min(borrowerXAtA, borrowerXBankTotal) },
      { bankId: 'B', borrowerId: 'X', preAmount: 20, postAmount: borrowerXBankTotal - Math.min(borrowerXAtA, borrowerXBankTotal) },
      { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: Math.min(borrowerYAtA, borrowerYBankTotal) },
      { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: borrowerYBankTotal - Math.min(borrowerYAtA, borrowerYBankTotal) },
    ],
    externalFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: borrowerXExternal }, { borrowerId: 'Y', preAmount: 0, postAmount: borrowerYExternal }],
    frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
  }) : null;

  return <LabShell id="bank-lending-c6" kicker="C6 · TWO-BANK MATCHING & REALLOCATION" sources={[16, 17, 18, 31, 32, 43, 44, 45, 46]} title="同一借款人可从关系行流向另一家银行或外部融资；配对变化、银行总量和借款人总融资必须分别加总">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} SYN`} label="X事后银行贷款总额" max={150 - borrowerXExternal} min={20} onChange={(value) => { setBorrowerXBankTotal(value); setBorrowerXAtA((current) => Math.min(current, value)); }} step={5} value={borrowerXBankTotal} />
      <RangeInput display={(value) => `${Math.min(value, borrowerXBankTotal)} SYN`} label="X事后由A行提供的贷款" max={borrowerXBankTotal} onChange={setBorrowerXAtA} step={5} value={Math.min(borrowerXAtA, borrowerXBankTotal)} />
      <RangeInput display={(value) => `${value} SYN`} label="X事后外部融资" max={150 - borrowerXBankTotal} onChange={setBorrowerXExternal} step={5} value={borrowerXExternal} />
      <RangeInput display={(value) => `${value} SYN`} label="Y事后银行贷款总额" max={130 - borrowerYExternal} min={20} onChange={(value) => { setBorrowerYBankTotal(value); setBorrowerYAtA((current) => Math.min(current, value)); }} step={5} value={borrowerYBankTotal} />
      <RangeInput display={(value) => `${Math.min(value, borrowerYBankTotal)} SYN`} label="Y事后由A行提供的贷款" max={borrowerYBankTotal} onChange={setBorrowerYAtA} step={5} value={Math.min(borrowerYAtA, borrowerYBankTotal)} />
      <RangeInput display={(value) => `${value} SYN`} label="Y事后外部融资" max={130 - borrowerYBankTotal} onChange={setBorrowerYExternal} step={5} value={borrowerYExternal} />
    </div>
    <fieldset className="yield-model-picker"><legend>保持3.10的机制边界</legend><label><input checked={riskAssessmentFrozen} onChange={(event) => setRiskAssessmentFrozen(event.target.checked)} type="checkbox" />借款人PD、LGD与抵押价值冻结</label><label><input checked={riskToleranceFrozen} onChange={(event) => setRiskToleranceFrozen(event.target.checked)} type="checkbox" />两家银行的risk tolerance冻结</label></fieldset>
    {result ? <><div className="holding-return-chain" role="group" aria-label="银行维度重新配置">{result.bankRows.map((row) => <article className={row.bankId === 'A' ? 'result' : undefined} key={row.bankId}><span>银行{row.bankId}</span><b>{row.change > 0 ? '+' : ''}{row.change.toFixed(1)} SYN</b><p>{row.preAmount.toFixed(1)} → {row.postAmount.toFixed(1)}</p></article>)}<article><span>银行体系贷款</span><b data-testid="c6-bank-total">{result.systemBankLendingChange > 0 ? '+' : ''}{result.systemBankLendingChange.toFixed(1)} SYN</b><p>一家收缩可与另一家扩张并存。</p></article></div><div className="holding-return-chain" role="group" aria-label="借款人维度总融资">{result.borrowerRows.map((row) => <article key={row.borrowerId}><span>借款人{row.borrowerId}</span><b>{row.totalFinancingChange > 0 ? '+' : ''}{row.totalFinancingChange.toFixed(1)} SYN</b><p>银行贷款 {row.bankLoanChange > 0 ? '+' : ''}{row.bankLoanChange.toFixed(1)}；外部融资 {row.externalFinancingChange > 0 ? '+' : ''}{row.externalFinancingChange.toFixed(1)}。</p></article>)}<article className="result"><span>两位借款人总融资</span><b data-testid="c6-total-finance">{result.totalFinancingChange > 0 ? '+' : ''}{result.totalFinancingChange.toFixed(1)} SYN</b><p>跨银行重配吸收 {result.crossBankReallocationAbsorbed.toFixed(1)}，外部替代增加 {result.externalSubstitutionIncrease.toFixed(1)}。</p></article></div><div className="precision-note"><span>冻结风险下的配对账本</span><p>关系行贷款变化 {result.relationshipAmountChange > 0 ? '+' : ''}{result.relationshipAmountChange.toFixed(1)}，仍保留关系的配对数 {result.relationshipRetainedCount}；冻结PD/LGD时预期损失金额随余额变化 {result.expectedLossAmountChangeAtFrozenRisk > 0 ? '+' : ''}{result.expectedLossAmountChangeAtFrozenRisk.toFixed(3)}。这些是配置结果，不是风险偏好变化，也没有自动识别银行供给。</p></div></> : <div className="wacc-decision ineligible" role="alert"><span>STOP · 边界越界</span><b>风险评价或risk tolerance未冻结</b><p>一旦PD、LGD、抵押价值或银行风险容忍度变化，本实验就不能把事后匹配差异解释成3.10的纯贷款供给配置；请到3.11/3.12另建状态。</p></div>}
    <div className="yield-static-summary"><b>静态摘要：</b>冻结A/B两行和X/Y两位借款人。A行四个关系/非关系配对合计由180降至130，B行由40升至70，跨银行重配吸收30；外部融资增加10后，银行体系贷款变化−20，而借款人总融资变化仅−10。PD、LGD、抵押价值与risk tolerance全程固定，这个账本仍只是描述，不是独立供给识别。</div>
    <ResetControl label="C6" onReset={() => { setBorrowerXBankTotal(110); setBorrowerYBankTotal(90); setBorrowerXAtA(70); setBorrowerYAtA(60); setBorrowerXExternal(5); setBorrowerYExternal(5); setRiskAssessmentFrozen(true); setRiskToleranceFrozen(true); }} />
  </LabShell>;
}

const designLabels = [
  ['shockExogeneitySupported', '政策或银行暴露的外生性有可辩护来源'],
  ['preTrendsPassed', '处理前趋势与安慰剂检查通过'],
  ['demandVariationControlled', '借款人同期需求变化得到控制'],
  ['matchingFormationExitSelectionAddressed', '研究设计已处理匹配形成、退出与申请选择（这是设计证据，不是由开关生成的持续关系）'],
  ['spilloversAddressed', '跨银行、地区与投入产出外溢得到处理'],
] as const;

type DesignGate = (typeof designLabels)[number][0];

export function LendingEstimandLab() {
  const [view, setView] = useState<'pair' | 'borrower' | 'real'>('pair');
  const [exposedCutX, setExposedCutX] = useState(30);
  const [exposedCutY, setExposedCutY] = useState(20);
  const [controlOffsetX, setControlOffsetX] = useState(15);
  const [controlOffsetY, setControlOffsetY] = useState(10);
  const [outsideOffsetX, setOutsideOffsetX] = useState(10);
  const [outsideOffsetY, setOutsideOffsetY] = useState(5);
  const [realChangeX, setRealChangeX] = useState(-2);
  const [realChangeY, setRealChangeY] = useState(-1);
  const [supportStressTest, setSupportStressTest] = useState(false);
  const [design, setDesign] = useState<Record<DesignGate, boolean>>({ shockExogeneitySupported: true, preTrendsPassed: true, demandVariationControlled: true, matchingFormationExitSelectionAddressed: true, spilloversAddressed: true });
  const pairs = supportStressTest ? [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 0 },
    { bankId: 'C', borrowerId: 'X', preAmount: 0, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 0 },
    { bankId: 'C', borrowerId: 'Y', preAmount: 0, postAmount: 20 },
  ] : [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 100 - exposedCutX },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 40 + controlOffsetX },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 80 - exposedCutY },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 20 + controlOffsetY },
  ];
  const result = identificationSubstitutionMetrics({
    synthetic: true,
    amountUnit: 'SYN-currency',
    realOutcomeUnit: 'SYN-real-index',
    banks: supportStressTest ? [{ bankId: 'A', exposed: true }, { bankId: 'B', exposed: false }, { bankId: 'C', exposed: false }] : [{ bankId: 'A', exposed: true }, { bankId: 'B', exposed: false }],
    borrowers: [{ borrowerId: 'X' }, { borrowerId: 'Y' }],
    pairs,
    otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: outsideOffsetX }, { borrowerId: 'Y', preAmount: 0, postAmount: outsideOffsetY }],
    realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 50 + realChangeX }, { borrowerId: 'Y', preIndex: 30, postIndex: 30 + realChangeY }],
    frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
    design,
  });
  const activeValue = view === 'pair' ? result?.pairEstimandCurrency : view === 'borrower' ? result?.borrowerTotalMeanObservedChangeCurrency : result?.realOutcomeMeanObservedChangeIndex;
  const activeStatus = view === 'pair' ? result?.pairIdentificationStatus : view === 'borrower' ? result?.borrowerTotalIdentificationStatus : result?.realOutcomeIdentificationStatus;
  const activeUnit = view === 'real' ? 'SYN-real-index' : 'SYN-currency';
  const activeLabel = view === 'pair' ? '银行—借款人配对对比' : view === 'borrower' ? '借款人总融资变化' : '实体结果变化';
  const activeValueText = typeof activeValue === 'number' ? `${activeValue > 0 ? '+' : ''}${activeValue.toFixed(2)} ${activeUnit}` : `N/A · 支持集为空`;
  const pairStatusExplanation = result?.pairIdentificationStatus === 'identified-under-stated-assumptions'
    ? '五项设计证据门与由余额计算的持续暴露/控制支持门均为真，因此pair层只获得“在明示假设下识别”的条件标签。'
    : result?.pairIdentificationStatus === 'candidate-not-identified'
      ? result.stablePairEstimationSupportEligible
        ? '冲击与前趋势门通过，但需求、匹配或外溢仍未闭合，所以pair层只是候选机制。'
        : '五项设计开关即使全真，也不能补回缺失的实际估计支持：暴露行与至少一条控制行都必须pre>0且post>0；每期active行数相同并不充分。'
      : '外生冲击或前趋势基础不足，pair差异只能描述。';

  return <><div aria-hidden="true" id="mechanism-c7" style={{ scrollMarginTop: 92 }} /><LabShell id="bank-lending-c7" kicker="C7 · PAIR → BORROWER TOTAL → REAL" sources={[4, 43, 44, 45, 46, 47, 50, 51, 52]} title="贷款对收缩、借款人总融资减少与实体结果下降是三个不同 estimand；融资替代和识别假设决定它们能否接续">
    <div className="yield-view-picker" role="group" aria-label="选择当前强调的估计对象">{([['pair', '贷款对'], ['borrower', '借款人总融资'], ['real', '实体结果']] as const).map(([id, label]) => <button aria-pressed={view === id} className={view === id ? 'active' : ''} key={id} onClick={() => setView(id)} type="button">{label}</button>)}</div>
    <div className="yield-control-grid">
      <RangeInput display={(value) => `−${value} SYN`} label="暴露行对X的贷款削减" max={60} onChange={setExposedCutX} step={5} value={exposedCutX} />
      <RangeInput display={(value) => `−${value} SYN`} label="暴露行对Y的贷款削减" max={50} onChange={setExposedCutY} step={5} value={exposedCutY} />
      <RangeInput display={(value) => `+${value} SYN`} label="控制行对X的承接" max={40} onChange={setControlOffsetX} step={5} value={controlOffsetX} />
      <RangeInput display={(value) => `+${value} SYN`} label="控制行对Y的承接" max={40} onChange={setControlOffsetY} step={5} value={controlOffsetY} />
      <RangeInput display={(value) => `+${value} SYN`} label="X的债券或非银替代" max={40} onChange={setOutsideOffsetX} step={5} value={outsideOffsetX} />
      <RangeInput display={(value) => `+${value} SYN`} label="Y的债券或非银替代" max={40} onChange={setOutsideOffsetY} step={5} value={outsideOffsetY} />
      <RangeInput display={(value) => `${value > 0 ? '+' : ''}${value} index`} label="X实体结果变化" max={5} min={-10} onChange={setRealChangeX} value={realChangeX} />
      <RangeInput display={(value) => `${value > 0 ? '+' : ''}${value} index`} label="Y实体结果变化" max={5} min={-10} onChange={setRealChangeY} value={realChangeY} />
    </div>
    <fieldset className="yield-model-picker"><legend>持续关系支持集压力测试</legend><label><input checked={supportStressTest} onChange={(event) => setSupportStressTest(event.target.checked)} type="checkbox" />切换为三银行反例：A持续、B退出、C进入；pre/post每期都各有两条active，但没有任何持续控制行</label></fieldset>
    <fieldset className="yield-model-picker"><legend>识别护栏：关闭任何一项都会降低结论等级</legend>{designLabels.map(([key, label]) => <label key={key}><input checked={design[key]} onChange={(event) => setDesign((current) => ({ ...current, [key]: event.target.checked }))} type="checkbox" />{label}</label>)}</fieldset>
    {result ? <><output aria-live="polite" className={activeStatus === 'identified-under-stated-assumptions' ? 'wacc-decision eligible' : 'wacc-decision ineligible'}><span>{activeStatus?.toUpperCase()}</span><b data-testid="c7-active-estimand">{activeLabel}：{activeValueText}</b><p>{view === 'pair' ? pairStatusExplanation : '当前计算只有这一层的前后观察均值，没有单独的反事实；即使pair层通过设计门与持续关系支持门，这一层也保持descriptive-only。'} 银行供给反应：{result.bankSupplyResponseSupported ? '获条件支持' : '未获支持'}；完整贷款传导：{result.completeBankLendingTransmissionSupported ? '获支持' : '未获支持'}。</p></output><div className="holding-return-chain" role="group" aria-label="三个分层估计对象"><article className={view === 'pair' ? 'result' : undefined}><span>1 · Pair estimand</span><b data-testid="c7-pair">{result.pairEstimandCurrency === null ? 'N/A · 空支持集' : `${result.pairEstimandCurrency > 0 ? '+' : ''}${result.pairEstimandCurrency.toFixed(2)} SYN`}</b><p>持续暴露行变化减同一借款人的持续控制行平均变化；退出、进入和全零控制都不进入均值。状态为 {result.pairIdentificationStatus}。</p></article><article className={view === 'borrower' ? 'result' : undefined}><span>2 · Borrower-total mean observed change</span><b data-testid="c7-borrower">{result.borrowerTotalMeanObservedChangeCurrency > 0 ? '+' : ''}{result.borrowerTotalMeanObservedChangeCurrency.toFixed(2)} SYN</b><p>把银行贷款与其他融资加回后的前后观察均值；当前是否下降：{result.borrowerTotalObservedDecline ? '是' : '否'}。没有独立反事实，所以状态为 {result.borrowerTotalIdentificationStatus}。</p></article><article className={view === 'real' ? 'result' : undefined}><span>3 · Real-outcome mean observed change</span><b data-testid="c7-real">{result.realOutcomeMeanObservedChangeIndex > 0 ? '+' : ''}{result.realOutcomeMeanObservedChangeIndex.toFixed(2)} index</b><p>实体结果的前后观察均值；当前是否下降：{result.realOutcomeObservedDecline ? '是' : '否'}。时滞、同时冲击与外溢尚未由本计算器提供反事实，状态为 {result.realOutcomeIdentificationStatus}。</p></article></div><div className="precision-note"><span>实际估计支持集：持续暴露 + 持续控制</span><p>持续控制行平均变化 {result.controlBankMeanChangeCurrency === null ? 'N/A（没有持续控制）' : `${result.controlBankMeanChangeCurrency > 0 ? '+' : ''}${result.controlBankMeanChangeCurrency.toFixed(2)} SYN`}；债券/非银平均承接 {result.otherFinancingMeanChangeCurrency > 0 ? '+' : ''}{result.otherFinancingMeanChangeCurrency.toFixed(2)}。逐借款人：{result.borrowerTimeRelationshipSupportByBorrower.map((item) => `${item.borrowerId} pre-active=${item.preActiveRelationshipCount}、post-active=${item.postActiveRelationshipCount}、持续暴露=${item.stableExposedRelationship ? '是' : '否'}、持续控制=${item.stableControlRelationshipCount}${item.stableEstimationSupportEligible ? '（纳入）' : '（排除）'}`).join('；')}。由余额计算的完整支持门：{result.stablePairEstimationSupportEligible ? '满足' : '不满足'}。每期关系数只是一项诊断，不是充分条件；“匹配选择已处理”开关只代表设计证据，也不能自认证持续关系。</p></div></> : <div className="wacc-decision ineligible" role="alert"><span>STOP</span><b>配对矩阵、单位或冻结边界不完整</b><p>每位借款人必须同时拥有暴露行与控制行记录，并有完整其他融资和实体结果；PD、LGD、抵押价值与risk tolerance不得在本节内漂移。</p></div>}
    <div className="precision-note"><span>绝不从相关性、设计开关或每期计数自动升级</span><p>计算器按 <code>pair → borrower total financing → real outcome</code> 顺序报告三个量。pair估计的实际支持集要求暴露行与至少一条控制行都满足pre&gt;0且post&gt;0，控制均值只使用这些持续控制。A持续、B退出、C进入时，pre与post虽然各有两条active，仍没有持续控制，pair支持集为空。真实研究还需逐项提供冲击来源、处理前检验、需求控制、匹配审计、聚类层级、支持总体和外溢设计。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>冻结两行两借款人矩阵：暴露行A对X/Y分别−30/−20，持续控制行B分别+15/+10，其他融资分别+10/+5，实体指数分别−2/−1。A与B对X/Y都满足pre&gt;0且post&gt;0；由数据计算的持续支持门与五项设计门全部通过时，pair对比−37.5才标为“在明示假设下识别”并条件支持银行供给反应。借款人总融资与实体结果的前后观察均值为−5和−1.5；后二层因没有各自反事实而保持descriptive-only。切换压力测试后，A持续、B退出、C进入使pre/post每期仍各有两条active，但持续控制数为0，pair估计显示N/A、标签立即降级且不支持银行供给反应。</div>
    <ResetControl label="C7" onReset={() => { setView('pair'); setExposedCutX(30); setExposedCutY(20); setControlOffsetX(15); setControlOffsetY(10); setOutsideOffsetX(10); setOutsideOffsetY(5); setRealChangeX(-2); setRealChangeY(-1); setSupportStressTest(false); setDesign({ shockExogeneitySupported: true, preTrendsPassed: true, demandVariationControlled: true, matchingFormationExitSelectionAddressed: true, spilloversAddressed: true }); }} />
  </LabShell></>;
}

export function BankLendingFixtureAudit() {
  const passed = bankLendingFixtureAssertions.filter((item) => item.passed).length;
  return <div aria-label="3.10冻结机制与边界断言" className="yield-fixture-audit" role="group"><span>冻结机制与边界断言 {passed}/{bankLendingFixtureAssertions.length}</span><ul>{bankLendingFixtureAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.id}>{item.passed ? '通过' : '失败'} · {item.statement}</li>)}</ul></div>;
}
