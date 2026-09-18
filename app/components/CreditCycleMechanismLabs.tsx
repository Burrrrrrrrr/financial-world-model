'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  canonicalCapitalLossInput,
  canonicalCapitalLossResult,
  canonicalCollateralCapacityInput,
  canonicalCollateralCapacityResult,
  canonicalCompositionGroups,
  canonicalCompositionResult,
  canonicalDebtServiceInput,
  canonicalDebtServiceResult,
  canonicalPassiveLeverageInput,
  canonicalPassiveLeverageResult,
  canonicalStockFlowInput,
  canonicalStockFlowResult,
  canonicalWarningInput,
  canonicalWarningResult,
  capitalLossFeedbackMetrics,
  collateralCapacityMetrics,
  compositionDecomposition,
  creditCycleMechanismLabSources,
  debtServiceRepricingMetrics,
  passiveLeverageMetrics,
  stockFlowBridge,
  warningCausalGate,
} from './creditCycleFixtures';
import styles from './creditCycle.module.css';

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function Sources({ ids }: { ids: readonly number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function LabShell({ id, kicker, title, sources, children }: { id: string; kicker: string; title: string; sources: readonly number[]; children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  return <section className={`yield-mechanism-lab financial-conditions-mechanism-lab credit-cycle-mechanism-lab ${styles.lab}${hydrated ? ' is-hydrated' : ''}`} id={id}><header><div><span>{kicker}</span><h3>{title}</h3></div><p>机制依据：<Sources ids={sources} /></p></header>{children}</section>;
}

function RangeInput({ inputId, label, value, min, max, step, onChange, display }: { inputId: string; label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; display: (value: number) => string }) {
  return <label className="yield-control" htmlFor={inputId}><span>{label}</span><input aria-valuetext={display(value)} id={inputId} max={max} min={min} onChange={(event) => onChange(Number(event.currentTarget.value))} step={step} type="range" value={value} /><output htmlFor={inputId}>{display(value)}</output></label>;
}

function pct(ratio: number | null | undefined, digits = 1) {
  return typeof ratio === 'number' ? `${(ratio * 100).toFixed(digits)}%` : 'N/A';
}

function number(value: number | null | undefined, digits = 2) {
  return typeof value === 'number' ? value.toFixed(digits) : 'STOP';
}

function signed(value: number | null | undefined, digits = 2) {
  return typeof value === 'number' ? `${value > 0 ? '+' : ''}${value.toFixed(digits)}` : 'STOP';
}

function required<T>(value: T | null, label: string): T {
  if (value === null) throw new Error(`3.14 missing canonical ${label}`);
  return value;
}

const staticStockFlow = required(canonicalStockFlowResult, 'stock-flow result');
const staticLeverage = required(canonicalPassiveLeverageResult, 'passive-leverage result');
const staticCollateral = required(canonicalCollateralCapacityResult, 'collateral result');
const staticDsr = required(canonicalDebtServiceResult, 'debt-service result');
const staticCapital = required(canonicalCapitalLossResult, 'capital-loss result');
const staticComposition = required(canonicalCompositionResult, 'composition result');
const staticWarning = required(canonicalWarningResult, 'warning result');

export function StockFlowBridgeLab() {
  const [originations, setOriginations] = useState(canonicalStockFlowInput.grossOriginations);
  const [repayments, setRepayments] = useState(canonicalStockFlowInput.principalRepayments);
  const [chargeOffs, setChargeOffs] = useState(canonicalStockFlowInput.chargeOffs);
  const [otherChanges, setOtherChanges] = useState(canonicalStockFlowInput.valuationChanges);
  const [declaredClosing, setDeclaredClosing] = useState(canonicalStockFlowInput.declaredClosingStock);
  const result = stockFlowBridge({ ...canonicalStockFlowInput, grossOriginations: originations, principalRepayments: repayments, chargeOffs, valuationChanges: otherChanges, declaredClosingStock: declaredClosing });
  return <LabShell id="credit-cycle-c1" kicker="C1 · STOCK–FLOW BRIDGE" sources={creditCycleMechanismLabSources.c1} title="让新发放、交易净流与存量变化在同一账本中对账">
    <div className="yield-control-grid"><RangeInput display={(v) => v.toFixed(0)} inputId="credit-cycle-c1-originations" label="Gross originations" max={40} min={0} onChange={setOriginations} step={1} value={originations} /><RangeInput display={(v) => v.toFixed(0)} inputId="credit-cycle-c1-repayments" label="Principal repayments" max={30} min={0} onChange={setRepayments} step={1} value={repayments} /><RangeInput display={(v) => v.toFixed(0)} inputId="credit-cycle-c1-chargeoffs" label="Charge-offs" max={15} min={0} onChange={setChargeOffs} step={1} value={chargeOffs} /><RangeInput display={(v) => signed(v, 0)} inputId="credit-cycle-c1-other" label="Valuation / other changes" max={8} min={-8} onChange={setOtherChanges} step={1} value={otherChanges} /><RangeInput display={(v) => v.toFixed(0)} inputId="credit-cycle-c1-closing" label="已报告期末存量" max={140} min={70} onChange={setDeclaredClosing} step={1} value={declaredClosing} /></div>
    {result ? <div aria-atomic="true" aria-live="polite" className={`wacc-decision ${result.accepted ? 'eligible' : 'ineligible'} ${styles.labOutput}`} role="status"><span>{result.accepted ? 'LEDGER CLOSED' : 'STOP · RECONCILIATION RESIDUAL'}</span><b>计算期末 {number(result.computedClosingStock)} · 已报告 {number(declaredClosing)}</b><p>净交易流 {signed(result.netTransactionFlow)}；存量变化 {signed(result.stockChange)}；对账残差 {signed(result.reconciliationResidual)} SYN。</p></div> : <div aria-live="polite" className="wacc-decision ineligible" role="status"><span>STOP</span><b>输入单位、符号或时钟无效</b></div>}
    <div className="precision-note"><span>为什么这一步优先于“信用增长”</span><p>只有期末存量与期初、交易、核销、重估和重分类闭合，研究者才知道所谓“增长”是新融资、旧债未偿、账面减记还是统计变化。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>冻结输入为100+20−8−3+1={staticStockFlow.computedClosingStock}。Gross originations=20，net transaction flow={staticStockFlow.netTransactionFlow}，stock change={staticStockFlow.stockChange}，对账残差={staticStockFlow.reconciliationResidual}。三个数字都由同一纯函数复算，但语义不同。</p><div aria-label="C1冻结存量流量账本，可横向滚动" className="yield-data-table-wrap" role="region" tabIndex={0}><table className="yield-data-table"><caption>C1冻结账本 · SYN-currency</caption><thead><tr><th scope="col">期初</th><th scope="col">发放</th><th scope="col">偿还</th><th scope="col">核销</th><th scope="col">其他</th><th scope="col">期末</th></tr></thead><tbody><tr><th scope="row">100</th><td>+20</td><td>−8</td><td>−3</td><td>+1</td><td>{staticStockFlow.computedClosingStock}</td></tr></tbody></table></div></div>
  </LabShell>;
}

export function PassiveLeverageLab() {
  const [shock, setShock] = useState(canonicalPassiveLeverageInput.assetPriceShockPct);
  const result = passiveLeverageMetrics({ ...canonicalPassiveLeverageInput, assetPriceShockPct: shock });
  return <LabShell id="credit-cycle-c2" kicker="C2 · PASSIVE LEVERAGE" sources={creditCycleMechanismLabSources.c2} title="债务不变时，资产价格也能通过权益分母推高杠杆">
    <div className="yield-control-grid"><RangeInput display={(v) => `${signed(v, 0)}%`} inputId="credit-cycle-c2-shock" label="资产价格冲击" max={20} min={-60} onChange={setShock} step={1} value={shock} /></div>
    {result ? <><div aria-atomic="true" aria-live="polite" className="holding-return-chain" role="status"><article><span>BEFORE</span><b>D/A {pct(result.before.debtToAssets)}</b><p>资产 {number(result.before.assets)}，债务 {number(result.before.debt)}，其他负债 {number(result.before.otherLiabilities)}，权益 {number(result.before.equity)}；D/E {number(result.before.debtToEquity, 3)}，D/I {number(result.before.debtToIncome, 2)}。</p></article><article><span>AFTER</span><b>D/A {pct(result.after.debtToAssets)}</b><p>资产 {number(result.after.assets)}，债务 {number(result.after.debt)}，其他负债 {number(result.after.otherLiabilities)}，权益 {number(result.after.equity)}；D/E {number(result.after.debtToEquity, 3)}，D/I {number(result.after.debtToIncome, 2)}。</p></article></div>{result.nonPositiveEquity ? <div aria-live="polite" className="wacc-decision ineligible" role="status"><span>NON-POSITIVE EQUITY</span><b>权益为零或负数，D/E不再是正常杠杆倍数</b><p>保留非正权益状态，不用绝对值美化分母。</p></div> : null}</> : null}
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>债务80、其他负债0、资产120、收入20；资产跌15%后为102，权益按资产减全部负债从40降至22。D/A从{pct(staticLeverage.before.debtToAssets, 3)}升至{pct(staticLeverage.after.debtToAssets, 3)}，D/E从{number(staticLeverage.before.debtToEquity, 3)}升至{number(staticLeverage.after.debtToEquity, 3)}，D/I仍为{number(staticLeverage.after.debtToIncome, 1)}。若其他负债不为0，不能再用assets−debt替代权益。</p></div>
  </LabShell>;
}

export function CollateralBorrowingBaseLab() {
  const [shock, setShock] = useState(canonicalCollateralCapacityInput.marketValueShockPct);
  const [advanceRate, setAdvanceRate] = useState(canonicalCollateralCapacityInput.advanceRate);
  const result = collateralCapacityMetrics({ ...canonicalCollateralCapacityInput, marketValueShockPct: shock, advanceRate });
  return <LabShell id="credit-cycle-c3" kicker="C3 · COLLATERAL BORROWING BASE" sources={creditCycleMechanismLabSources.c3} title="把市值经过资格、advance rate和已提款后，再计算真正可用额度">
    <div className="yield-control-grid"><RangeInput display={(v) => `${signed(v, 0)}%`} inputId="credit-cycle-c3-shock" label="抵押市值冲击" max={20} min={-60} onChange={setShock} step={1} value={shock} /><RangeInput display={(v) => `${(v * 100).toFixed(0)}%`} inputId="credit-cycle-c3-advance" label="Advance rate" max={0.9} min={0.3} onChange={setAdvanceRate} step={0.05} value={advanceRate} /></div>
    {result ? <div aria-atomic="true" aria-live="polite" className="holding-return-chain" role="status"><article><span>BEFORE</span><b>Headroom {number(result.before.rawHeadroom)}</b><p>市值 {number(result.before.marketValue)} × eligible 80% × advance {(advanceRate * 100).toFixed(0)}% = base {number(result.before.borrowingBase)}；申请20最多新增 {number(result.before.approvedIncrement)}。</p></article><article><span>AFTER</span><b>Headroom {number(result.after.rawHeadroom)}</b><p>市值 {number(result.after.marketValue)}，base {number(result.after.borrowingBase)}，申请20最多新增 {number(result.after.approvedIncrement)}，未满足 {number(result.after.unmetRequest)}。</p></article></div> : <div aria-live="polite" className="wacc-decision ineligible" role="status"><span>STOP</span><b>比率、估值时钟或抵押权无效</b></div>}
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>市值120在80%可质押、70% advance rate下形成base {number(staticCollateral.before.borrowingBase)}，扣除已提款50后headroom {number(staticCollateral.before.rawHeadroom)}。市值跌20%后base {number(staticCollateral.after.borrowingBase)}、headroom {number(staticCollateral.after.rawHeadroom)}，容量减少{number(Math.abs(staticCollateral.capacityChange))}。市值不是borrowing base；资格、法律可执行性、估值时点和已提款都必须先通过。</p></div>
  </LabShell>;
}

export function DebtServiceRepricingLab() {
  const [newRate, setNewRate] = useState(canonicalDebtServiceInput.newAnnualRatePct);
  const [incomeShock, setIncomeShock] = useState(canonicalDebtServiceInput.incomeShockPct);
  const [repricingShare, setRepricingShare] = useState(canonicalDebtServiceInput.repricingShare);
  const result = debtServiceRepricingMetrics({ ...canonicalDebtServiceInput, newAnnualRatePct: newRate, incomeShockPct: incomeShock, repricingShare });
  return <LabShell id="credit-cycle-c4" kicker="C4 · DEBT-SERVICE REPRICING" sources={creditCycleMechanismLabSources.c4} title="利率重定价与收入下降如何在违约之前先挤压现金流">
    <div className="yield-control-grid"><RangeInput display={(v) => `${v.toFixed(1)}%`} inputId="credit-cycle-c4-rate" label="新年利率" max={12} min={1} onChange={setNewRate} step={0.5} value={newRate} /><RangeInput display={(v) => `${signed(v, 0)}%`} inputId="credit-cycle-c4-income" label="收入冲击" max={30} min={-50} onChange={setIncomeShock} step={1} value={incomeShock} /><RangeInput display={(v) => `${(v * 100).toFixed(0)}%`} inputId="credit-cycle-c4-share" label="当期重定价债务份额" max={1} min={0} onChange={setRepricingShare} step={0.1} value={repricingShare} /></div>
    {result ? <div aria-atomic="true" aria-live="polite" className="holding-return-chain" role="status"><article><span>BASE · SAME WINDOW</span><b>DSR {pct(result.before.dsr, 2)}</b><p>利息 {number(result.before.interestPayment)} + 到期本金合计 {number(result.before.totalPrincipalDue)}，除以收入 {number(result.before.income)}。</p></article><article><span>REPRICED · SAME WINDOW</span><b>DSR {pct(result.after.dsr, 2)}</b><p>利息 {number(result.after.interestPayment)} + 到期本金合计 {number(result.after.totalPrincipalDue)}，除以收入 {number(result.after.income)}；变化 {signed(result.dsrChangePercentagePoints, 2)}pp。</p></article></div> : null}
    <div className="precision-note"><span>时钟、本金互斥与利息近似门</span><p>两种情景都覆盖2026-09-11至2027-09-11的前瞻合同支付窗。到期本金合计=不含气球本金的计划摊还+气球本金，两桶互斥、同一笔本金只计一次；教学简式还用期初债务计全窗利息并把本金视作窗末支付，真实窗内摊还必须改用现金流表或加权平均余额。repricing share只让相应份额旧债进入新利率。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>同一2026-09-11至2027-09-11前瞻窗内，债务100、利率4%、不含气球本金的计划摊还6、气球本金0、收入25，基准DSR={pct(staticDsr.before.dsr, 3)}。全部重定价到7%且收入下降10%的同窗情景DSR={pct(staticDsr.after.dsr, 3)}，上升{number(staticDsr.dsrChangePercentagePoints, 3)}pp。两类本金桶互斥且只计一次；本简式用期初债务计全窗利息并假设本金窗末支付，真实窗内摊还须改用现金流表或加权平均余额。</p></div>
  </LabShell>;
}

export function CapitalLossFeedbackLab() {
  const [defaultedEad, setDefaultedEad] = useState(canonicalCapitalLossInput.defaultedEad);
  const [assumedNetEconomicLgd, setAssumedNetEconomicLgd] = useState(canonicalCapitalLossInput.assumedNetEconomicLgd);
  const result = capitalLossFeedbackMetrics({ ...canonicalCapitalLossInput, defaultedEad, assumedNetEconomicLgd });
  return <LabShell id="credit-cycle-c5" kicker="C5 · CAPITAL-LOSS FEEDBACK" sources={creditCycleMechanismLabSources.c5} title="信用损失如何穿过薄资本层，放大为更大的资产容量收缩">
    <div className="yield-control-grid"><RangeInput display={(v) => v.toFixed(0)} inputId="credit-cycle-c5-default" label="违约时 EAD" max={20} min={0} onChange={setDefaultedEad} step={1} value={defaultedEad} /><RangeInput display={(v) => `${(v * 100).toFixed(0)}%`} inputId="credit-cycle-c5-lgd" label="假设净经济 LGD" max={0.8} min={0} onChange={setAssumedNetEconomicLgd} step={0.05} value={assumedNetEconomicLgd} /></div>
    {result ? <div aria-atomic="true" aria-live="polite" className="holding-return-chain" role="status"><article><span>INITIAL</span><b>容量 {number(result.initialCapacity)}</b><p>资本10 / (10%×80%)；当前贷款100，headroom {number(result.initialHeadroom)}。</p></article><article><span>AFTER ASSUMED RECOGNITION</span><b>容量 {number(result.postAssumedLossCapacity)}</b><p>合成损失估计 {number(result.syntheticLossEstimate)}，在教学假设下资本 {number(result.postAssumedLossCapital)}，按同一估计减记后贷款 {number(result.postAssumedWriteDownLoans)}；简化门下需收缩 {number(result.requiredSimpleShrinkage)}。</p></article></div> : <div aria-live="polite" className="wacc-decision ineligible" role="status"><span>STOP</span><b>损失估计已超过本教学桥可处理的资本</b><p>进入负资本后，必须路由破产、补充资本或处置框架，不继续套简式。</p></div>}
    <div className="precision-note"><span>合成损失估计，不是已实现损失或Basel合规计算</span><p>本实验采用违约时EAD × 假设净经济LGD。五年合成回收路径只把假定能变现的净回收与可执行担保现金回收、以及处置成本纳入LGD，不使用担保名义面额，也不得再扣一次回收。贷款100是估计计入前的净账面贷款；{result ? <>当前滑块对应的同一个{number(result.syntheticLossEstimate)}单位估计在教学假设下只确认一次，同时把资本10降至{number(result.postAssumedLossCapital)}、净账面贷款100降至{number(result.postAssumedWriteDownLoans)}</> : <>当前滑块对应的估计已超过资本10，因而停在负资本边界，不继续计算简化容量</>}。本实验固定RWA density与最低比率，只隔离一阶容量机制。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>初始净账面贷款100、简化容量 {number(staticCapital.initialCapacity)}，headroom {number(staticCapital.initialHeadroom)}。违约时EAD 10 × 假设净经济LGD 40%形成合成损失估计 {number(staticCapital.syntheticLossEstimate)}；同一个估计在“立即确认一次”的教学假设下同时令资本降至 {number(staticCapital.postAssumedLossCapital)}、净账面贷款降至 {number(staticCapital.postAssumedWriteDownLoans)}，新容量 {number(staticCapital.postAssumedLossCapacity)}，为恢复简化门需收缩 {number(staticCapital.requiredSimpleShrinkage)}。五年合成回收路径只接收假定可变现的净回收和担保现金回收，不接收担保面额且不得二次扣减；这些回收尚未观测，所以结果不是已闭合实现损失、会计裁决、Basel合规计算或监管决策。</p></div>
  </LabShell>;
}

export function DistributionCompositionLab() {
  const [smeWeight, setSmeWeight] = useState(canonicalCompositionGroups[0].weightAfter);
  const result = compositionDecomposition(canonicalCompositionGroups.map((group, index) => ({ ...group, weightAfter: index === 0 ? smeWeight : 1 - smeWeight })));
  return <LabShell id="credit-cycle-c6" kicker="C6 · COMPOSITION EFFECT" sources={creditCycleMechanismLabSources.c6} title="组内状态没变时，人群或暴露权重也能让总体指标反向">
    <div className="yield-control-grid"><RangeInput display={(v) => `SME ${(v * 100).toFixed(0)}% / Bond ${((1 - v) * 100).toFixed(0)}%`} inputId="credit-cycle-c6-weight" label="冲击后权重" max={0.9} min={0.1} onChange={setSmeWeight} step={0.05} value={smeWeight} /></div>
    {result ? <div aria-atomic="true" aria-live="polite" className="holding-return-chain" role="status"><article><span>AGGREGATE</span><b>{signed(result.aggregateBefore, 3)} → {signed(result.aggregateAfter, 3)}</b><p>总变化 {signed(result.aggregateChange, 3)} SYN state points。</p></article><article><span>DECOMPOSITION</span><b>Within {signed(result.withinEffect, 3)}</b><p>Composition {signed(result.compositionEffect, 3)}；residual {signed(result.residual, 6)}。</p></article></div> : null}
    <div className="precision-note"><span>固定权重反事实</span><p>若用冲击前权重保持人口结构，可看见组内状态变了多少；再把权重变化单独放回，才得到composition effect。总体平均无法替代受约束份额和尾部。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>SME状态+1、债券发行人−0.5均不变，权重从60/40变30/70。总体从{signed(staticComposition.aggregateBefore, 2)}降至{signed(staticComposition.aggregateAfter, 2)}；within={signed(staticComposition.withinEffect, 2)}，composition={signed(staticComposition.compositionEffect, 2)}，residual={signed(staticComposition.residual, 2)}。组内效应按冲击前固定权重计算；再单独放回权重变化，不能用总体均值替代尾部。</p></div>
  </LabShell>;
}

export function WarningCausalGateLab() {
  const [credit, setCredit] = useState(canonicalWarningInput.creditGrowthZ);
  const [asset, setAsset] = useState(canonicalWarningInput.assetPriceGrowthZ);
  const [spread, setSpread] = useState(canonicalWarningInput.spreadZ);
  const [exogeneity, setExogeneity] = useState(false);
  const [predetermined, setPredetermined] = useState(false);
  const [demandCounterfactual, setDemandCounterfactual] = useState(false);
  const result = warningCausalGate({ ...canonicalWarningInput, creditGrowthZ: credit, assetPriceGrowthZ: asset, spreadZ: spread, exogeneityGate: exogeneity, predeterminedExposureGate: predetermined, demandCounterfactualGate: demandCounterfactual });
  return <LabShell id="credit-cycle-c7" kicker="C7 · WARNING ≠ CAUSAL SHOCK" sources={creditCycleMechanismLabSources.c7} title="允许预警算术输出，但不让任何分数绕过因果门">
    <div className="yield-control-grid"><RangeInput display={(v) => signed(v, 1)} inputId="credit-cycle-c7-credit" label="Credit-growth z" max={3} min={-3} onChange={setCredit} step={0.1} value={credit} /><RangeInput display={(v) => signed(v, 1)} inputId="credit-cycle-c7-asset" label="Asset-price-growth z" max={3} min={-3} onChange={setAsset} step={0.1} value={asset} /><RangeInput display={(v) => signed(v, 1)} inputId="credit-cycle-c7-spread" label="Credit-spread z" max={3} min={-3} onChange={setSpread} step={0.1} value={spread} /></div>
    <div className="yield-model-picker" role="group" aria-label="信用冲击因果识别三道门"><button aria-pressed={exogeneity} className={exogeneity ? 'active' : ''} onClick={() => setExogeneity((value) => !value)} type="button"><b>外生性</b><span>{exogeneity ? 'PASS' : 'FAIL'}</span></button><button aria-pressed={predetermined} className={predetermined ? 'active' : ''} onClick={() => setPredetermined((value) => !value)} type="button"><b>预定暴露</b><span>{predetermined ? 'PASS' : 'FAIL'}</span></button><button aria-pressed={demandCounterfactual} className={demandCounterfactual ? 'active' : ''} onClick={() => setDemandCounterfactual((value) => !value)} type="button"><b>需求反事实</b><span>{demandCounterfactual ? 'PASS' : 'FAIL'}</span></button></div>
    {result ? <div aria-atomic="true" aria-live="polite" className="holding-return-chain" role="status"><article><span>WARNING LANE</span><b>{signed(result.vulnerabilityScore, 3)}</b><p>{result.warningStatus}；prediction status仍为 <code>{result.predictionStatus}</code>。</p></article><article><span>CAUSAL LANE</span><b>{result.causalStatus === 'identified-candidate' ? 'IDENTIFIED-CANDIDATE' : 'STOP'}</b><p>{result.failedCausalGates.length ? `失败门：${result.failedCausalGates.join(', ')}` : '三门通过也只能先进入候选，尚需支持集与推断。'}</p></article></div> : null}
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>(1.5+1−(−1.2))/3={number(staticWarning.vulnerabilityScore, 4)}，在预注册的SYNTHETIC规则下为<code>{staticWarning.warningStatus}</code>。但prediction=<code>{staticWarning.predictionStatus}</code>，三道因果门都失败，causal=<code>{staticWarning.causalStatus}</code>。预警、OOS预测与因果冲击在HTML和打印中都保持三栏。</p></div>
  </LabShell>;
}
