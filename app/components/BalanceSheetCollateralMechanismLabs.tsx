'use client';

import { useId, useState } from 'react';
import {
  balanceSheetCollateralFixtureAudit,
  balanceSheetSnapshotMetrics,
  borrowingCapacityEnvelope,
  canonicalBalanceSheetBefore,
  collateralIdentificationMetrics,
  debtOverhangMetrics,
  externalFinancePremiumMetrics,
  financialAcceleratorMetrics,
  pledgeableCollateralMetrics,
  type CapacityConstraintInput,
  type IdentificationGate,
} from './balanceSheetCollateralFixtures';

function Sources({ ids }: { ids: number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function LabShell({ id, kicker, title, sources, children }: { id: string; kicker: string; title: string; sources: number[]; children: React.ReactNode }) {
  return <section className="yield-mechanism-lab balance-sheet-collateral-lab" id={id}><header><div><span>{kicker}</span><h3>{title}</h3></div><p>机制依据：<Sources ids={sources} /></p></header>{children}</section>;
}

function RangeInput({ label, value, min, max, step, onChange, display }: { label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; display: (value: number) => string }) {
  const id = useId();
  return <label className="yield-control" htmlFor={id}><span>{label}</span><input id={id} max={max} min={min} onChange={(event) => onChange(Number(event.currentTarget.value))} step={step} type="range" value={value} /><output htmlFor={id}>{display(value)}</output></label>;
}

function ResetControl({ label, onReset }: { label: string; onReset: () => void }) {
  return <button className="yield-reset" onClick={onReset} type="button">恢复 {label} 冻结例</button>;
}

function formatAuditValue(value: string) {
  const numeric = Number(value.trim());
  return value.trim().length > 0 && Number.isFinite(numeric) ? String(Number(numeric.toFixed(6))) : value;
}

function Signed({ value, suffix = '' }: { value: number; suffix?: string }) {
  return <>{value > 0 ? '+' : ''}{value.toFixed(2)}{suffix}</>;
}

export function NetWorthRevaluationLab() {
  const [propertyShockPct, setPropertyShockPct] = useState(-20);
  const [liabilityChange, setLiabilityChange] = useState(0);
  const before = balanceSheetSnapshotMetrics(canonicalBalanceSheetBefore);
  const after = balanceSheetSnapshotMetrics({
    ...canonicalBalanceSheetBefore,
    observationTime: 'SYN-after-shock',
    assets: canonicalBalanceSheetBefore.assets.map((line) => line.lineId === 'property' ? { ...line, amount: line.amount * (1 + propertyShockPct / 100) } : line),
    liabilities: canonicalBalanceSheetBefore.liabilities.map((line, index) => index === 0 ? { ...line, amount: Math.max(0, line.amount + liabilityChange) } : line),
  });
  const netWorthChange = (after?.netWorth ?? 0) - (before?.netWorth ?? 0);

  return <LabShell id="balance-sheet-c1" kicker="C1 · NET-WORTH REVALUATION" sources={[1, 2, 4, 37]} title="同一笔资产价格损失先一比一打到净值，再由初始杠杆改变净值的百分比跌幅">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value}%`} label="地产市场价值冲击" max={20} min={-50} onChange={setPropertyShockPct} step={1} value={propertyShockPct} />
      <RangeInput display={(value) => `${value >= 0 ? '+' : ''}${value} SYN`} label="同期负债变化（独立输入）" max={30} min={-30} onChange={setLiabilityChange} step={1} value={liabilityChange} />
    </div>
    {before && after ? <div className="holding-return-chain" role="group" aria-label="净值重估结果">
      <article><span>冲击前总资产 / 负债</span><b>{before.totalAssets.toFixed(0)} / {before.totalLiabilities.toFixed(0)}</b><p>净值为 {before.netWorth.toFixed(0)} SYN；资产、负债和净值必须来自同一法律实体与同一估值时点。</p></article>
      <article><span>冲击后总资产 / 负债</span><b>{after.totalAssets.toFixed(0)} / {after.totalLiabilities.toFixed(0)}</b><p>净值变为 {after.netWorth.toFixed(0)} SYN。负债不会仅因某项资产市价下跌而自动同比减少。</p></article>
      <article><span>净值金额变化</span><b><Signed value={netWorthChange} suffix=" SYN" /></b><p>当其他资产与负债冻结时，资产重估损益一比一进入净值金额。</p></article>
      <article className="result"><span>净值百分比变化</span><b>{before.netWorth === 0 ? '不可定义' : `${(netWorthChange / before.netWorth * 100).toFixed(1)}%`}</b><p>它可显著大于资产的百分比跌幅，这正是杠杆对净值脆弱性的第一层放大。</p></article>
    </div> : <div className="wacc-decision ineligible" role="alert"><b>输入未形成可比资产负债表</b></div>}
    <div className="precision-note"><span>不能跨过的解释边界</span><p><code>净值 = 资产 − 负债</code>是会计恒等式；“净值下降导致融资变贵或额度收缩”则需要外部融资摩擦、合同与贷款人反应，不能由恒等式单独推出。冻结例是逐行声明计量 basis 的 <b>SYNTHETIC mixed-basis snapshot</b>：它可以按声明规则形成权益，却不能冒充统一市场净值、评估净值或回收净值。账面权益、宏观部门净值、清算剩余和本实验的合成 borrower net worth 也不是天然同一个量。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>冻结例中总资产200、负债120、净值80；价值100的地产下跌20%而负债不变，资产降至180、净值降至60。资产只跌10%，净值却跌25%。这是带逐行 basis 声明的合成 mixed-basis 重估桥，不是任何真实企业或家庭。</div>
    <ResetControl label="C1" onReset={() => { setPropertyShockPct(-20); setLiabilityChange(0); }} />
  </LabShell>;
}

export function PledgeableValueLab() {
  const [marketValue, setMarketValue] = useState(100);
  const [valuationHaircutPct, setValuationHaircutPct] = useState(10);
  const [liquidityHaircutPct, setLiquidityHaircutPct] = useState(10);
  const [fxRiskReservePct, setFxRiskReservePct] = useState(0);
  const [advanceRatePct, setAdvanceRatePct] = useState(75);
  const [priorClaims, setPriorClaims] = useState(10);
  const [enforcementCost, setEnforcementCost] = useState(5);
  const [currentDrawn, setCurrentDrawn] = useState(35);
  const [perfected, setPerfected] = useState(true);
  const result = pledgeableCollateralMetrics({
    synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', decisionTime: 'SYN-decision', currentFacilityDrawn: currentDrawn,
    assets: [{
      collateralId: 'interactive-asset', label: '互动合成资产', marketValue, ownershipShareRatio: 1,
      valuationHaircutRatio: valuationHaircutPct / 100, liquidityHaircutRatio: liquidityHaircutPct / 100,
      fxRiskReserveRatio: fxRiskReservePct / 100, advanceRateRatio: advanceRatePct / 100,
      concentrationCap: null, priorSeniorClaims: priorClaims, enforcementCost, eligible: true, transferable: true, perfected, enforceable: true,
    }],
  });
  const item = result?.contributions[0];

  return <LabShell id="balance-sheet-c2" kicker="C2 · PLEDGEABILITY WATERFALL" sources={[5, 6, 7, 8, 12, 13, 32, 33]} title="市价只是瀑布起点：所有权、折扣、advance rate、优先债权、执行成本与担保权状态共同决定可用借款基础">
    <div className="yield-view-picker" role="group" aria-label="选择担保权是否完成对抗要件"><button aria-pressed={perfected} className={perfected ? 'active' : ''} onClick={() => setPerfected(true)} type="button">已完成对抗要件</button><button aria-pressed={!perfected} className={!perfected ? 'active' : ''} onClick={() => setPerfected(false)} type="button">未完成：本合成合同按零计</button></div>
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} SYN`} label="资产市场价值" max={200} min={0} onChange={setMarketValue} step={5} value={marketValue} />
      <RangeInput display={(value) => `${value}%`} label="估值折扣" max={60} min={0} onChange={setValuationHaircutPct} step={5} value={valuationHaircutPct} />
      <RangeInput display={(value) => `${value}%`} label="流动性折扣" max={40} min={0} onChange={setLiquidityHaircutPct} step={5} value={liquidityHaircutPct} />
      <RangeInput display={(value) => `${value}%`} label="独立 FX 风险准备（已换成同一 SYN 计价后）" max={30} min={0} onChange={setFxRiskReservePct} step={5} value={fxRiskReservePct} />
      <RangeInput display={(value) => `${value}%`} label="advance rate" max={100} min={0} onChange={setAdvanceRatePct} step={5} value={advanceRatePct} />
      <RangeInput display={(value) => `${value} SYN`} label="更优先债权" max={80} min={0} onChange={setPriorClaims} step={5} value={priorClaims} />
      <RangeInput display={(value) => `${value} SYN`} label="预计执行成本" max={40} min={0} onChange={setEnforcementCost} step={5} value={enforcementCost} />
      <RangeInput display={(value) => `${value} SYN`} label="本设施已提款" max={100} min={0} onChange={setCurrentDrawn} step={5} value={currentDrawn} />
    </div>
    {result && item ? <div className="holding-return-chain" role="group" aria-label="可质押价值瀑布结果">
      <article><span>法律与控制门</span><b>{item.legalGatePassed ? 'PASS' : 'STOP'}</b><p>本地合成规则要求 eligible、transferable、perfected、enforceable 同时成立；现实结论必须读取具体法域与合同。</p></article>
      <article><span>折扣后价值</span><b>{item.valueAfterHaircuts.toFixed(2)} SYN</b><p>所有金额已先换成同一 SYN 计价，再计算市场价值 × 所有权份额 ×（1 − 估值折扣 − 流动性折扣 − 独立 FX 风险准备）；总扣减超过100%时输入直接无效。</p></article>
      <article><span>借款基础</span><b>{result.totalBorrowingBase.toFixed(2)} SYN</b><p>advance rate × 折扣后价值 − 更优先债权 − 执行成本；每项只扣一次。</p></article>
      <article className="result"><span>新增资产型容量</span><b>{result.maxIncrementalAssetBasedPrincipal.toFixed(2)} SYN</b><p>先保留有符号 headroom {result.signedFacilityHeadroom.toFixed(2)}，最后才把负值截为不可新增。</p></article>
    </div> : <div className="wacc-decision ineligible" role="alert"><span>STOP</span><b>折扣、所有权或金额定义域未闭合</b><p>各项独立扣减合计不得超过100%，所有金额必须非负，且必须固定同一计价币种、设施和决策时点。</p></div>}
    <div className="precision-note"><span>制度与币种护栏</span><p>Basel 对银行资本计量中的“合格金融抵押品”和监管折扣，不等于某借款人在当地民商法下可以设立、对抗第三人并执行的担保权。本实验全部金额已先换成同一 SYN 计价；FX 风险准备只是换汇后的独立风险扣减，不提供汇率、估值时点或换汇依据，不能用于处理真实币种错配。真实资产缺原币、汇率和换算时点时必须 STOP。本实验把未完成对抗要件保守设为零，只是可复算的合成合同；它不是任何国家的法律意见。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>100 SYN 市值经10%估值折扣和10%流动性折扣后为80；75% advance rate 得60，再减10优先债权与5执行成本，借款基础45；已提款35，所以新增容量10。未完成担保权对抗要件时，本合成合同按零计。</div>
    <ResetControl label="C2" onReset={() => { setMarketValue(100); setValuationHaircutPct(10); setLiquidityHaircutPct(10); setFxRiskReservePct(0); setAdvanceRatePct(75); setPriorClaims(10); setEnforcementCost(5); setCurrentDrawn(35); setPerfected(true); }} />
  </LabShell>;
}

export function BindingConstraintLab() {
  const [assetHeadroom, setAssetHeadroom] = useState(17);
  const [earningsHeadroom, setEarningsHeadroom] = useState(30);
  const [contractualHeadroom, setContractualHeadroom] = useState(12);
  const [lenderOfferHeadroom, setLenderOfferHeadroom] = useState(18);
  const decisionTime = 'SYN-same-decision-time';
  const constraintPassport = {
    currency: 'SYN', amountUnit: 'SYN-currency', decisionTime,
    borrowerLegalEntityId: 'SYN_BORROWER_1', facilityId: 'SYN_FACILITY_1',
    principalConcept: 'incremental-drawn-principal', horizon: '24m',
  } as const;
  const rows: CapacityConstraintInput[] = [
    { constraintId: 'asset-based', applicable: true, signedIncrementalPrincipalHeadroom: assetHeadroom, ...constraintPassport },
    { constraintId: 'earnings-based', applicable: true, signedIncrementalPrincipalHeadroom: earningsHeadroom, ...constraintPassport },
    { constraintId: 'contractual', applicable: true, signedIncrementalPrincipalHeadroom: contractualHeadroom, ...constraintPassport },
    { constraintId: 'lender-offer', applicable: true, signedIncrementalPrincipalHeadroom: lenderOfferHeadroom, ...constraintPassport },
  ];
  const result = borrowingCapacityEnvelope(rows);

  return <LabShell id="balance-sheet-c3" kicker="C3 · BINDING CONSTRAINT STACK" sources={[9, 10, 15, 16, 20, 25]} title="资产、收益、契约与贷款要约的容量不能相加；统一对象、币种、时点和本金单位后，只能取最紧的适用上限">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} SYN`} label="资产型有符号 headroom" max={60} min={-20} onChange={setAssetHeadroom} step={1} value={assetHeadroom} />
      <RangeInput display={(value) => `${value} SYN`} label="收益型有符号 headroom" max={60} min={-20} onChange={setEarningsHeadroom} step={1} value={earningsHeadroom} />
      <RangeInput display={(value) => `${value} SYN`} label="契约型有符号 headroom" max={60} min={-20} onChange={setContractualHeadroom} step={1} value={contractualHeadroom} />
      <RangeInput display={(value) => `${value} SYN`} label="贷款人实际要约 headroom" max={60} min={-20} onChange={setLenderOfferHeadroom} step={1} value={lenderOfferHeadroom} />
    </div>
    {result ? <div className="holding-return-chain" role="group" aria-label="多约束取最小结果">
      {rows.map((row) => <article className={result.bindingConstraintIds.includes(row.constraintId) ? 'result' : undefined} key={row.constraintId}><span>{row.constraintId}</span><b>{row.signedIncrementalPrincipalHeadroom?.toFixed(0)} SYN</b><p>{result.bindingConstraintIds.includes(row.constraintId) ? '当前绑定；若并列最小，系统保留全部绑定ID。' : '当前不绑定；单独放松这一项未必增加最终容量。'}</p></article>)}
      <article className="result"><span>可新增本金</span><b>{result.lendableIncrementalPrincipal.toFixed(0)} SYN</b><p><code>max(0, min(active signed headrooms))</code>；负的最小值保留为违约深度，再在放款输出层截零。</p></article>
    </div> : null}
    <div className="precision-note"><span>为什么“提高抵押物”可能没有用</span><p>冻结例中12 SYN的契约/覆盖余量最紧，因此把抵押品容量从17提高到40仍不会改变最终12。只有放松当前绑定约束，或让另一个约束成为新最小值，边际借款容量才移动。这也是“资产价格上涨必然带来等量信贷扩张”错误的最短反例。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>资产17、收益30、契约12、贷款人要约18都已换成同一新增本金单位，最终容量为12，绑定约束是contractual。四项不可相加为77。</div>
    <ResetControl label="C3" onReset={() => { setAssetHeadroom(17); setEarningsHeadroom(30); setContractualHeadroom(12); setLenderOfferHeadroom(18); }} />
  </LabShell>;
}

export function ExternalFinancePremiumLab() {
  const [contractRatePct, setContractRatePct] = useState(6);
  const [annualisedFeesPct, setAnnualisedFeesPct] = useState(0.5);
  const [benchmarkPct, setBenchmarkPct] = useState(4);
  const [internalOpportunityPct, setInternalOpportunityPct] = useState(4.4);
  const [netWorthRatioPct, setNetWorthRatioPct] = useState(20);
  const allInExternalPct = contractRatePct + annualisedFeesPct;
  const result = externalFinancePremiumMetrics({
    synthetic: true, rateUnit: 'percent-per-year', netWorthRatio: netWorthRatioPct / 100,
    matchedBenchmarkPct: benchmarkPct,
    opportunityCostInternalFundsPct: internalOpportunityPct, requiredExternalReturnPct: allInExternalPct,
    illustrativeModel: { targetNetWorthRatio: 30 / 100, premiumFloorBp: 100, slopeBpPerNetWorthPercentagePointShortfall: 20 },
  });

  return <LabShell id="balance-sheet-c4" kicker="C4 · SPREAD ≠ EXTERNAL-FINANCE PREMIUM" sources={[1, 2, 4]} title="可观察合同利差与理论上的外部融资溢价使用不同反事实；数字偶尔相同也不能把名称互换">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="合同利率" max={12} min={0} onChange={setContractRatePct} step={0.1} value={contractRatePct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="费用年化等价" max={3} min={0} onChange={setAnnualisedFeesPct} step={0.1} value={annualisedFeesPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="匹配基准利率" max={10} min={0} onChange={setBenchmarkPct} step={0.1} value={benchmarkPct} />
      <RangeInput display={(value) => `${value.toFixed(1)}%`} label="内部资金机会成本" max={10} min={0} onChange={setInternalOpportunityPct} step={0.1} value={internalOpportunityPct} />
      <RangeInput display={(value) => `${value}%`} label="借款人净值 / 资产" max={60} min={0} onChange={setNetWorthRatioPct} step={1} value={netWorthRatioPct} />
    </div>
    {result ? <div className="holding-return-chain" role="group" aria-label="合同利差与外部融资溢价分账">
      <article><span>外部资金全含成本</span><b>{allInExternalPct.toFixed(2)}%</b><p>合同率加本地简单年化费用；不是监管APR、实现收益或所有外部融资工具的共同成本。</p></article>
      <article><span>可观察 all-in spread</span><b>{result.observableSpreadBp === null ? '不可报告' : `${(result.observableSpreadBp / 100).toFixed(2)} pp`}</b><p>全含外部成本减匹配市场基准；它混有资金、损失、运营、资本和议价等组件。</p></article>
      <article><span>定义上的 EFP</span><b>{result.definitionalPremiumBp === null ? '不可报告' : `${(result.definitionalPremiumBp / 100).toFixed(2)} pp`}</b><p>外部资金所需回报减内部资金机会成本；内部反事实通常不可直接观察。</p></article>
      <article className="result"><span>合成模型 EFP</span><b>{result.illustrativeModelPremiumBp.toFixed(0)} bp</b><p>仅在“30%目标净值率、100bp底座、每短缺1个百分点增加20bp”的局部教学模型内成立。</p></article>
    </div> : null}
    <div className="precision-note"><span>理论对象与数据字段</span><p>金融加速器文献中的 external finance premium 是内部资金与外部资金的楔子；贷款数据库中的 spread 通常是合同率减某个基准。前者是模型对象，后者是测量对象。要把净值变化映射到 EFP，必须声明模型、反事实和校准，不能把观察到的贷款利差直接贴成“代理成本”。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>合同6%加0.5%费用得到6.5%全含外部成本；相对4%基准的可观察spread为2.5个百分点，相对4.4%内部资金机会成本的EFP为2.1个百分点。二者反事实不同。</div>
    <ResetControl label="C4" onReset={() => { setContractRatePct(6); setAnnualisedFeesPct(0.5); setBenchmarkPct(4); setInternalOpportunityPct(4.4); setNetWorthRatioPct(20); }} />
  </LabShell>;
}

export function DebtOverhangLab() {
  const [projectCost, setProjectCost] = useState(20);
  const [projectPayoff, setProjectPayoff] = useState(28);
  const [legacyCapturePct, setLegacyCapturePct] = useState(40);
  const result = debtOverhangMetrics({ synthetic: true, amountUnit: 'SYN-currency', projectCost, expectedPresentValueOfProjectPayoff: projectPayoff, legacyCreditorCaptureShareRatio: legacyCapturePct / 100 });

  return <LabShell id="balance-sheet-c5" kicker="C5 · DEBT OVERHANG" sources={[17, 18, 26]} title="项目对企业整体有正净现值，却可能因为部分增量价值先修复旧债而对现有股东不值得出资">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} SYN`} label="项目成本（由现有股东承担）" max={50} min={0} onChange={setProjectCost} step={1} value={projectCost} />
      <RangeInput display={(value) => `${value} SYN`} label="项目预期回报的现值" max={60} min={0} onChange={setProjectPayoff} step={1} value={projectPayoff} />
      <RangeInput display={(value) => `${value}%`} label="旧债权人捕获的增量价值份额" max={90} min={0} onChange={setLegacyCapturePct} step={5} value={legacyCapturePct} />
    </div>
    {result ? <><div className="holding-return-chain" role="group" aria-label="债务悬置计算结果">
      <article><span>企业整体项目 NPV</span><b><Signed value={result.totalProjectNPV} suffix=" SYN" /></b><p>项目预期回报现值减项目成本；这是对全部索取权人的价值，不等于股东私有回报。</p></article>
      <article><span>旧债权人价值改善</span><b>{result.valueAccruingToLegacyCreditors.toFixed(2)} SYN</b><p>本实验用固定捕获份额抽象旧债回收率改善；现实分配由资本结构、优先级与状态决定。</p></article>
      <article><span>股东私有 NPV</span><b><Signed value={result.equityPrivateNPV} suffix=" SYN" /></b><p>股东取得的项目价值减其出资；它可能与企业整体NPV符号相反。</p></article>
      <article className="result"><span>债务悬置判定</span><b>{result.debtOverhangBlocksPositiveNPVProject ? 'BLOCKED' : 'NOT BLOCKED'}</b><p>只有整体NPV为正且股东私有NPV为负时，本合成判据才返回阻断。</p></article>
    </div></> : null}
    <div className="precision-note"><span>与“借不到钱”不同</span><p>抵押品不足是容量约束；债务悬置是价值分配与激励问题。企业即使技术上还能融资，也可能不愿为主要改善旧债回收率的项目出资。债务重组、优先级调整或新资金保护可能改变分配，但这些属于合同设计与困境处置，不应被压缩成一条LTV公式。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>成本20、回报现值28使整体NPV为+8；若40%的增量回报先改善旧债，股东只得16.8，扣除20出资后的私有NPV为−3.2，于是正NPV项目被阻断。</div>
    <ResetControl label="C5" onReset={() => { setProjectCost(20); setProjectPayoff(28); setLegacyCapturePct(40); }} />
  </LabShell>;
}

export function FinancialAcceleratorLoopLab() {
  const [initialShock, setInitialShock] = useState(-10);
  const [gainPct, setGainPct] = useState(50);
  const [rounds, setRounds] = useState(4);
  const result = financialAcceleratorMetrics({ synthetic: true, amountUnit: 'SYN-currency', initialBorrowerNetWorthShock: initialShock, localFeedbackGain: gainPct / 100, rounds });

  return <LabShell id="balance-sheet-c6" kicker="C6 · LOCAL FEEDBACK GAIN" sources={[1, 2, 3, 4, 29]} title="金融加速器描述内生反馈怎样放大并延长初始冲击；它不是关于冲击来源的理论，也不是无条件爆炸">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value} SYN`} label="第0轮借款人净值冲击" max={20} min={-30} onChange={setInitialShock} step={1} value={initialShock} />
      <RangeInput display={(value) => value < 100 ? `${(value / 100).toFixed(2)}（局部稳定）` : `${(value / 100).toFixed(2)}（无稳定无限和）`} label="局部反馈增益 g" max={130} min={0} onChange={setGainPct} step={5} value={gainPct} />
      <RangeInput display={(value) => `${value}轮`} label="显示轮数" max={10} min={1} onChange={setRounds} step={1} value={rounds} />
    </div>
    {result ? <><div className="holding-return-chain" role="group" aria-label="金融加速器各轮结果">{result.roundEffects.map((effect, index) => <article key={index}><span>ROUND {index}</span><b><Signed value={effect} /></b><p>{index === 0 ? '外生或上游初始冲击。' : `上一轮效应 × g；不是新的独立冲击。`}</p></article>)}</div><div className={`wacc-decision ${result.stabilityStatus === 'locally-stable' ? 'eligible' : 'ineligible'}`} role="status"><span>局部稳定性</span><b>{result.stabilityStatus === 'locally-stable' ? 'LOCALLY STABLE' : 'UNIT ROOT / EXPLOSIVE'}</b><p>{rounds}轮累计为 {result.finiteRoundCumulativeEffect.toFixed(2)} SYN，有限轮放大倍数 {result.finiteRoundAmplificationMultiple?.toFixed(3) ?? '不可定义'}。{result.stableInfiniteCumulativeEffect === null ? 'g≥1时不报告稳定无限和；必须更换非线性、约束或政策闭环模型。' : `若局部线性关系永久不变，无限几何和为 ${result.stableInfiniteCumulativeEffect.toFixed(2)} SYN。`}</p></div></> : null}
    <div className="precision-note"><span>这一旋钮没有替代经济学</span><p><code>g</code>把“净值/可质押价值下降 → 融资容量或EFP恶化 → 支出和收入下降 → 下一轮净值再降”压缩成局部线性增益，只用于理解反馈。真实世界各箭头有不同时间尺度、非线性、异质性与政策反应；资产出售和margin spiral分别路由到7.13与7.12。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>初始−10、g=0.5时四轮依次为−10、−5、−2.5、−1.25，累计−18.75；在局部线性关系永久不变的反事实下，无限和为−20。它不校准任何经济体。</div>
    <ResetControl label="C6" onReset={() => { setInitialShock(-10); setGainPct(50); setRounds(4); }} />
  </LabShell>;
}

const gateLabels: Record<keyof IdentificationGate, string> = {
  plausiblyExogenousCollateralShock: '抵押品价格变动有可辩护的外生来源',
  preExistingExposureMeasured: '处理前资产所有权／暴露已测量',
  localDemandOrProductivityConfoundingAddressed: '地方需求与生产率共同冲击已处理',
  preTrendsSupported: '处理前趋势与事件时间支持设计',
  commonSupportEstablished: '处理组与对照组有共同支持',
  treatmentSelectionAndAttritionAddressed: '申请选择、样本退出与所有权选择已处理',
  interferenceOrSpilloversAddressed: '空间／行业溢出与干扰已处理',
};

export function CollateralIdentificationLab() {
  const [treatedPost, setTreatedPost] = useState(88);
  const [controlPost, setControlPost] = useState(96);
  const [gates, setGates] = useState<IdentificationGate>({
    plausiblyExogenousCollateralShock: true,
    preExistingExposureMeasured: true,
    localDemandOrProductivityConfoundingAddressed: false,
    preTrendsSupported: true,
    commonSupportEstablished: true,
    treatmentSelectionAndAttritionAddressed: true,
    interferenceOrSpilloversAddressed: true,
  });
  const result = collateralIdentificationMetrics({ synthetic: true, outcomeUnit: 'SYN-real-outcome-index', treatedPre: 100, treatedPost, controlPre: 100, controlPost, gates });

  return <LabShell id="balance-sheet-c7" kicker="C7 · ESTIMAND & IDENTIFICATION GATES" sources={[19, 21, 22, 23, 24, 30, 31]} title="所有者—租户差分可以净掉部分共同需求；声明的设计闸门全通过时，也只能形成等待外部证据审计的识别候选">
    <div className="yield-control-grid">
      <RangeInput display={(value) => `${value}`} label="处理组（预定所有者）事后结果" max={120} min={60} onChange={setTreatedPost} step={1} value={treatedPost} />
      <RangeInput display={(value) => `${value}`} label="同地对照组（租户）事后结果" max={120} min={60} onChange={setControlPost} step={1} value={controlPost} />
    </div>
    <fieldset className="yield-model-picker"><legend>识别闸门：主动切换，观察标签而非数值怎样变化</legend>{(Object.keys(gateLabels) as (keyof IdentificationGate)[]).map((key) => <label key={key}><input checked={gates[key]} onChange={(event) => setGates((current) => ({ ...current, [key]: event.currentTarget.checked }))} type="checkbox" /><span>{gateLabels[key]}</span></label>)}</fieldset>
    {result ? <><div className="holding-return-chain" role="group" aria-label="抵押品渠道差分结果">
      <article><span>处理组变化</span><b><Signed value={result.treatedChange} /></b><p>处理前固定为100；这里只是结果的前后观察变化。</p></article>
      <article><span>对照组变化</span><b><Signed value={result.controlChange} /></b><p>同地对照吸收部分共同需求，但租户与所有者可能仍有不同趋势和选择。</p></article>
      <article><span>描述性 DiD</span><b><Signed value={result.descriptiveDifferenceInDifferences} /></b><p><code>(treated post−pre)−(control post−pre)</code>；算术值不随识别闸门改变。</p></article>
      <article className="result"><span>当前标签</span><b>{result.identificationStatus === 'identified-candidate-under-declared-gates' ? 'IDENTIFIED-CANDIDATE' : 'DESCRIPTIVE'}</b><p>{result.failedGateIds.length ? `仍失败：${result.failedGateIds.map((key) => gateLabels[key]).join('；')}` : '七道设计门只被用户声明为通过；这形成待证据审计的候选，不代表数据、标准误、安慰剂或排除限制已经通过。'}</p></article>
    </div></> : null}
    <div className="precision-note"><span>声明不是证据，标签升级不改变点估计</span><p>闸门的作用不是把−8变成另一个数字。这里的勾选只记录“研究设计声称已处理什么”，不验证数据、标准误、安慰剂、排除限制或结果稳健性；即使全部勾选也永不显示 IDENTIFIED。若地方资产价格同时代表需求繁荣、银行供给共同变化或所有权选择，DiD仍可精确计算，却只能保持 descriptive。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>处理组100→88、对照组100→96，描述性DiD为−8。冻结例故意关闭“地方需求/生产率混淆已处理”闸门，因此标签保持DESCRIPTIVE；点选该门后最多显示 IDENTIFIED-CANDIDATE，不会把声明冒充证据。</div>
    <ResetControl label="C7" onReset={() => { setTreatedPost(88); setControlPost(96); setGates({ plausiblyExogenousCollateralShock: true, preExistingExposureMeasured: true, localDemandOrProductivityConfoundingAddressed: false, preTrendsSupported: true, commonSupportEstablished: true, treatmentSelectionAndAttritionAddressed: true, interferenceOrSpilloversAddressed: true }); }} />
  </LabShell>;
}

export function BalanceSheetCollateralFixtureAudit() {
  const passed = balanceSheetCollateralFixtureAudit.filter((item) => item.passed).length;
  return <div className="yield-fixture-audit" role="group" aria-label="3.11合成机制断言"><span>冻结合成 fixture：{passed}/{balanceSheetCollateralFixtureAudit.length} 项数值、单位与边界断言通过</span><ul>{balanceSheetCollateralFixtureAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key} · expected {formatAuditValue(item.expected)} · observed {formatAuditValue(item.observed)}</li>)}</ul></div>;
}
