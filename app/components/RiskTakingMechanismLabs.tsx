'use client';

import { useState } from 'react';
import {
  canonicalMarginProxyBasis,
  canonicalRiskyCandidate,
  canonicalSafeCandidate,
  cohortRiskMetrics,
  marginPressureMetrics,
  riskAdjustedSelectionMetrics,
  riskBudgetExposureMetrics,
  riskTakingFixtureAudit,
  riskTakingIdentificationStatus,
  riskTransferMetrics,
  searchForYieldMix,
  identifiedCandidateGate,
  type IdentificationGate,
} from './riskTakingFixtures';

function Sources({ ids }: { ids: number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function LabShell({ id, kicker, title, sources, children }: { id: string; kicker: string; title: string; sources: number[]; children: React.ReactNode }) {
  return <section className="yield-mechanism-lab risk-taking-mechanism-lab" id={id}><header><div><span>{kicker}</span><h3>{title}</h3></div><p>机制依据：<Sources ids={sources} /></p></header>{children}</section>;
}

function RangeInput({ inputId, label, value, min, max, step, onChange, display }: { inputId: string; label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; display: (value: number) => string }) {
  return <label className="yield-control" htmlFor={inputId}><span>{label}</span><input id={inputId} max={max} min={min} onChange={(event) => onChange(Number(event.currentTarget.value))} step={step} type="range" value={value} /><output htmlFor={inputId}>{display(value)}</output></label>;
}

function ResetControl({ label, onReset }: { label: string; onReset: () => void }) {
  return <button className="yield-reset" onClick={onReset} type="button">恢复 {label} 冻结例</button>;
}

function Signed({ value, digits = 2, suffix = '' }: { value: number; digits?: number; suffix?: string }) {
  return <>{value > 0 ? '+' : ''}{value.toFixed(digits)}{suffix}</>;
}

export function RiskAdjustedSelectionLab() {
  const [shadowPrice, setShadowPrice] = useState(0.2);
  const [target, setTarget] = useState(0.5);
  const safe = riskAdjustedSelectionMetrics({ ...canonicalSafeCandidate, riskShadowPricePerUnexpectedLossPoint: shadowPrice, targetResidualReturnPctPointsPerYear: target });
  const risky = riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, riskShadowPricePerUnexpectedLossPoint: shadowPrice, targetResidualReturnPctPointsPerYear: target });
  return <LabShell id="risk-taking-c4" kicker="C4 · RISK-ADJUSTED SELECTION" sources={[1, 3, 4]} title="票息不是排序规则：同期限PD/LGD/EAD闭合后，合成的决策账本尾部权重才进入选择门槛">
    <div className="yield-control-grid"><RangeInput display={(value) => value.toFixed(2)} inputId="risk-taking-c4-shadow-price" label="每单位意外损失的内部影子价" max={0.6} min={0} onChange={setShadowPrice} step={0.05} value={shadowPrice} /><RangeInput display={(value) => `${value.toFixed(2)} pp/年`} inputId="risk-taking-c4-target" label="目标剩余回报门槛" max={1.5} min={0} onChange={setTarget} step={0.1} value={target} /></div>
    <output aria-atomic="true" aria-live="polite" className="sr-only">{safe && risky ? `安全项目：回报门${safe.returnHurdlePassed ? '通过' : '未通过'}、PD上限门${safe.decisionPdCapPassed ? '通过' : '未通过'}、尾部预算门${safe.unexpectedLossBudgetPassed ? '通过' : '未通过'}，总体${safe.accepted ? '获批' : '未获批'}；高风险项目：回报门${risky.returnHurdlePassed ? '通过' : '未通过'}、PD上限门${risky.decisionPdCapPassed ? '通过' : '未通过'}、尾部预算门${risky.unexpectedLossBudgetPassed ? '通过' : '未通过'}，总体${risky.accepted ? '获批' : '未获批'}。风险调整贡献分别为${safe.riskAdjustedContributionPctPoints.toFixed(2)}和${risky.riskAdjustedContributionPctPoints.toFixed(2)}个百分点。` : '输入无效，暂不输出审批结果。'}</output>
    <div className="holding-return-chain" role="group" aria-label="安全和高风险项目的风险调整选择">
      {safe ? <article className={safe.accepted ? 'result' : undefined}><span>安全项目 · {safe.accepted ? '总体获批' : '总体未获批'}</span><b><Signed value={safe.riskAdjustedContributionPctPoints} suffix=" pp/年" /></b><p>三门状态：回报门{safe.returnHurdlePassed ? '通过' : '未通过'} · PD上限门{safe.decisionPdCapPassed ? '通过' : '未通过'} · 尾部预算门{safe.unexpectedLossBudgetPassed ? '通过' : '未通过'}。12个月预期损失率 {safe.expectedLossRatePctPoints.toFixed(2)}pp，即 {safe.expectedLossAmount.toFixed(2)} {safe.eadCurrency} / {safe.eadAmount.toFixed(0)} {safe.eadCurrency} EAD；尾部费用 {safe.tailRiskChargePctPoints.toFixed(2)}pp；回报门槛 {target.toFixed(2)}pp。</p></article> : null}
      {risky ? <article className={risky.accepted ? 'result' : undefined}><span>高风险项目 · {risky.accepted ? '总体获批' : '总体未获批'}</span><b><Signed value={risky.riskAdjustedContributionPctPoints} suffix=" pp/年" /></b><p>三门状态：回报门{risky.returnHurdlePassed ? '通过' : '未通过'} · PD上限门{risky.decisionPdCapPassed ? '通过' : '未通过'} · 尾部预算门{risky.unexpectedLossBudgetPassed ? '通过' : '未通过'}。12个月预期损失率 {risky.expectedLossRatePctPoints.toFixed(2)}pp，即 {risky.expectedLossAmount.toFixed(2)} {risky.eadCurrency} / {risky.eadAmount.toFixed(0)} {risky.eadCurrency} EAD；尾部费用 {risky.tailRiskChargePctPoints.toFixed(2)}pp；回报门槛 {target.toFixed(2)}pp。</p></article> : null}
    </div>
    <div className="precision-note"><span>冻结边界与期限护照</span><p>两个项目均为12个月合同、12个月PD预测期、100 SYN EAD、SYN币种和同一产品基础；借款人PD/LGD、项目现金流、3.10边际资金成本、资本流动性费用、PD上限、尾部预算与银行可用容量固定。移动的只是SYNTHETIC决策账本尾部权重，不是已观察或已批准的董事会aggregate appetite。界面中的“获批”要求回报、PD和尾部预算三门同时通过；若冻结量也变，必须标为联合渠道。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>影子价0.2时安全与高风险项目的风险调整贡献都为0.7pp并通过0.5pp门槛；影子价升至0.4时，高风险项目贡献降至−0.1pp而被拒绝。全部为SYNTHETIC教学参数。</div>
    <ResetControl label="C4" onReset={() => { setShadowPrice(0.2); setTarget(0.5); }} />
  </LabShell>;
}

export function SearchForYieldLab() {
  const [safeYield, setSafeYield] = useState(1);
  const [riskyYield, setRiskyYield] = useState(7);
  const [targetYield, setTargetYield] = useState(5);
  const result = searchForYieldMix(safeYield, riskyYield, targetYield);
  return <LabShell id="risk-taking-c1" kicker="C1 · SEARCH FOR YIELD" sources={[2, 11, 17]} title="安全收益下降而名义目标黏住时，组合会机械要求更高风险权重；超出100%则必须显式引入杠杆或放弃目标">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value.toFixed(1)}%`} inputId="risk-taking-c1-safe-yield" label="安全资产承诺收益" max={8} min={0} onChange={setSafeYield} step={0.5} value={safeYield} /><RangeInput display={(value) => `${value.toFixed(1)}%`} inputId="risk-taking-c1-risky-yield" label="风险资产承诺收益" max={12} min={1} onChange={setRiskyYield} step={0.5} value={riskyYield} /><RangeInput display={(value) => `${value.toFixed(1)}%`} inputId="risk-taking-c1-target" label="内部名义目标" max={12} min={0} onChange={setTargetYield} step={0.5} value={targetYield} /></div>
    {result ? <><output aria-live="polite" className={result.feasibleWithoutLeverage ? 'wacc-decision eligible' : 'wacc-decision ineligible'}><span>{result.feasibleWithoutLeverage ? 'FEASIBLE WITHOUT LEVERAGE' : 'STOP · TARGET OUTSIDE MENU'}</span><b>原始风险份额 {(result.rawRiskyShareRatio * 100).toFixed(1)}%</b><p>显示用份额截在0–100%，但可行性判断保留未截断值；承诺收益不等于扣除损失后的期望回报。</p></output><div className="holding-return-chain"><article><span>显示风险份额</span><b>{(result.displayedRiskyShareRatio * 100).toFixed(1)}%</b><p>只用于画面，不掩盖超出菜单的缺口。</p></article><article className="result"><span>显示组合承诺收益</span><b>{result.displayedPromisedYieldPctPoints.toFixed(2)}%</b><p>不含损失、流动性与尾部风险。</p></article></div></> : <div className="wacc-decision ineligible" role="alert"><b>风险资产收益必须严格高于安全资产收益</b></div>}
    <div className="precision-note"><span>不能从算例外推</span><p>该两资产凸组合只展示逐利压力，不估计现实资产需求，也没有证明低利率由外生政策冲击产生。风险预算、杠杆、资本和流动性在此冻结。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>安全4%、风险7%、目标5%时风险份额为1/3；安全降至1%而其他量不变时为2/3。若风险收益只有4%，原始份额为4/3，需STOP。</div>
    <ResetControl label="C1" onReset={() => { setSafeYield(1); setRiskyYield(7); setTargetYield(5); }} />
  </LabShell>;
}

export function MeasuredRiskOverlayLab() {
  const [measuredVol, setMeasuredVol] = useState(4);
  const [stressLoss, setStressLoss] = useState(25);
  const [lossBudget, setLossBudget] = useState(10);
  const result = riskBudgetExposureMetrics({ lossBudget, currentMeasuredVolatilityPctPoints: measuredVol, confidenceMultiplier: 2.5, stressLossRatePctPoints: stressLoss });
  return <LabShell id="risk-taking-c3" kicker="C3 · MEASURED VOLATILITY + STRESS OVERLAY" sources={[22, 23, 24]} title="低测量波动能放松模型约束，却不必提高稳健敞口：压力覆盖层可能继续绑定">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value}%`} inputId="risk-taking-c3-measured-vol" label="当前测量波动" max={30} min={1} onChange={setMeasuredVol} step={1} value={measuredVol} /><RangeInput display={(value) => `${value}%`} inputId="risk-taking-c3-stress-loss" label="压力损失率" max={60} min={5} onChange={setStressLoss} step={5} value={stressLoss} /><RangeInput display={(value) => `${value} SYN`} inputId="risk-taking-c3-loss-budget" label="冻结损失预算" max={30} min={1} onChange={setLossBudget} step={1} value={lossBudget} /></div>
    <output aria-atomic="true" aria-live="polite" className="sr-only">{result ? `模型上限${result.modelOnlyMaximumExposure.toFixed(1)}，压力上限${result.stressMaximumExposure.toFixed(1)}，稳健上限${result.robustMaximumExposure.toFixed(1)} SYN；当前由${result.bindingMeasure}约束。` : '输入无效，暂不输出风险预算结果。'}</output>
    {result ? <div className="holding-return-chain" role="group" aria-label="模型与压力风险预算"><article><span>模型上限</span><b>{result.modelOnlyMaximumExposure.toFixed(1)} SYN</b><p>预算 ÷ (2.5 × 测量波动)。</p></article><article><span>压力上限</span><b>{result.stressMaximumExposure.toFixed(1)} SYN</b><p>预算 ÷ 压力损失率。</p></article><article className="result"><span>稳健上限</span><b>{result.robustMaximumExposure.toFixed(1)} SYN</b><p>取较小者；当前绑定：{result.bindingMeasure}。</p></article></div> : null}
    <div className="precision-note"><span>测量不是偏好</span><p>市场平静会压低后视波动，但真实尾部风险未必同步下降。只有中介选择规则或风险影子价变化，才属于3.12风险偏好；预算变化属于容量边界，必须冻结或显式建模。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>预算10、乘数2.5、压力损失25%时，测量波动8%与4%给出模型上限50与100，但压力上限始终40，所以稳健敞口不变。</div>
    <ResetControl label="C3" onReset={() => { setMeasuredVol(4); setStressLoss(25); setLossBudget(10); }} />
  </LabShell>;
}

export function MarginAmbiguityLab() {
  const [depositFloor, setDepositFloor] = useState(1.5);
  const [riskShift, setRiskShift] = useState(0.4);
  const [retrench, setRetrench] = useState(0.8);
  const result = marginPressureMetrics({ ...canonicalMarginProxyBasis, assetYieldBeforePctPoints: 6, depositCostBeforePctPoints: 2, otherFundingCostPctPoints: 0.5, policyRateChangePctPoints: -3, assetYieldPassThrough: 0.8, depositRatePassThrough: 0.5, depositRateFloorPctPoints: depositFloor, riskShiftingSensitivity: riskShift, capacityRetrenchmentSensitivity: retrench });
  return <LabShell id="risk-taking-c2" kicker="C2 · SYNTHETIC MARGIN PROXY / DEPOSIT-FLOOR AMBIGUITY" sources={[3, 12, 14]} title="同一平均生息资产分母上的息差代理压缩，既可诱发逐利，也可触发资本保全式收缩；它不是监管报表NIM">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value.toFixed(1)}pp`} inputId="risk-taking-c2-deposit-floor" label="存款成本贡献下限" max={2} min={0} onChange={setDepositFloor} step={0.25} value={depositFloor} /><RangeInput display={(value) => value.toFixed(2)} inputId="risk-taking-c2-risk-shift" label="逐利敏感度" max={1.5} min={0} onChange={setRiskShift} step={0.1} value={riskShift} /><RangeInput display={(value) => value.toFixed(2)} inputId="risk-taking-c2-retrench" label="容量收缩敏感度" max={1.5} min={0} onChange={setRetrench} step={0.1} value={retrench} /></div>
    <output aria-atomic="true" aria-live="polite" className="sr-only">{result ? `合成息差代理从${result.marginBeforePctPoints.toFixed(2)}变为${result.marginAfterPctPoints.toFixed(2)}个百分点；净风险选择压力为${result.illustrativeNetRiskChoicePressure.toFixed(2)}，${result.illustrativeNetRiskChoicePressure > 0 ? '逐利占优' : result.illustrativeNetRiskChoicePressure < 0 ? '收缩占优' : '两者抵消'}。` : '输入不满足共同分母或下限条件，暂不输出。'}</output>
    {result ? <div className="holding-return-chain"><article><span>息差</span><b>{result.marginBeforePctPoints.toFixed(2)} → {result.marginAfterPctPoints.toFixed(2)} pp</b><p>存款下限{result.depositFloorBinding ? '绑定' : '未绑定'}。</p></article><article><span>逐利 / 收缩压力</span><b>{result.riskShiftingPressure.toFixed(2)} / {result.capacityRetrenchmentPressure.toFixed(2)}</b><p>两个教学敏感度分别映射相反行为。</p></article><article className="result"><span>净风险选择压力</span><b><Signed value={result.illustrativeNetRiskChoicePressure} /></b><p>{result.illustrativeNetRiskChoicePressure > 0 ? '逐利占优' : result.illustrativeNetRiskChoicePressure < 0 ? '收缩占优' : '两者抵消'}；它汇总相反的行为作用，不把容量变化重命名为偏好。</p></article></div> : null}
    <div className="precision-note"><span>共同分母与边界</span><p>资产收益、存款成本和其他资金成本都定义为“占平均生息资产的年化百分点贡献”，因此可以相减；这只是SYNTHETIC margin proxy，不是现实银行NIM。存款成本贡献下限不得高于冲击前2pp。现实研究必须用利息收入减利息支出再除以平均生息资产，并分别测量传导、治理、资本余量和风险预算。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>无下限且逐利敏感度0.8、收缩0.4时净压力+0.36；1.5%下限且敏感度反转为0.4/0.8时为−0.76。符号来自明确参数，不是政策事实。</div>
    <ResetControl label="C2" onReset={() => { setDepositFloor(1.5); setRiskShift(0.4); setRetrench(0.8); }} />
  </LabShell>;
}

export function ExAnteExPostLab() {
  const [riskyShare, setRiskyShare] = useState(40);
  const [safeRealisedDefaultRate, setSafeRealisedDefaultRate] = useState(0.5);
  const [riskyRealisedDefaultRate, setRiskyRealisedDefaultRate] = useState(4);
  const result = cohortRiskMetrics({ riskyShareRatio: riskyShare / 100, safeRealisedDefaultRatePctPoints: safeRealisedDefaultRate, riskyRealisedDefaultRatePctPoints: riskyRealisedDefaultRate });
  return <LabShell id="risk-taking-c5" kicker="C5 · EX-ANTE / EX-POST PARADOX" sources={[5, 6, 16]} title="事前选择更冒险与事后违约更少可以同时成立；必须把选择时钟、实现窗口和组内风险分开">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value}%`} inputId="risk-taking-c5-risky-share" label="事前高风险份额" max={100} min={0} onChange={setRiskyShare} step={5} value={riskyShare} /><RangeInput display={(value) => `${value.toFixed(1)}%`} inputId="risk-taking-c5-safe-default" label="安全组实现违约率" max={10} min={0} onChange={setSafeRealisedDefaultRate} step={0.5} value={safeRealisedDefaultRate} /><RangeInput display={(value) => `${value.toFixed(1)}%`} inputId="risk-taking-c5-risky-default" label="风险组实现违约率" max={20} min={0} onChange={setRiskyRealisedDefaultRate} step={0.5} value={riskyRealisedDefaultRate} /></div>
    <output aria-atomic="true" aria-live="polite" className="sr-only">{result ? `事前高风险份额${(result.riskyShareRatio * 100).toFixed(0)}%；固定表现窗的组合实现违约率${result.realisedDefaultRatePctPoints.toFixed(2)}%。` : '输入无效，暂不输出表现窗结果。'}</output>
    {result ? <div className="holding-return-chain"><article><span>事前风险构成</span><b>{(result.riskyShareRatio * 100).toFixed(0)}%</b><p>应由发放时可得评分与规则定义。</p></article><article className="result"><span>事后组合实现违约率</span><b>{result.realisedDefaultRatePctPoints.toFixed(2)}%</b><p>按同一固定表现窗、同一发放批次与等EAD权重聚合；不换写成离散违约笔数。</p></article></div> : null}
    <div className="precision-note"><span>成熟期与反推陷阱</span><p>支持性宏观状态可同时压低安全组和风险组的实现违约率，因此较低的事后违约不能证明事前筛选更保守。比较必须对齐发放批次、评分时点与成熟窗口。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>风险份额20%、固定表现窗组内实现违约率1%/8%时组合实现违约率2.4%；份额升至40%，但两组实现率降至0.5%/4%时组合实现违约率反而为1.9%。</div>
    <ResetControl label="C5" onReset={() => { setRiskyShare(40); setSafeRealisedDefaultRate(0.5); setRiskyRealisedDefaultRate(4); }} />
  </LabShell>;
}

export function RiskTransferLab() {
  const [retained, setRetained] = useState(20);
  const [protection, setProtection] = useState(10);
  const originated = 100;
  const sold = originated - retained;
  const result = riskTransferMetrics({ originatedExposure: originated, retainedExposure: retained, soldExposure: sold, purchasedProtectionOnRetained: protection });
  return <LabShell id="risk-taking-c7" kicker="C7 · OPTIONAL RISK-TRANSFER CONSERVATION" sources={[8, 15, 17, 27]} title="出售与保护可以改变银行的发起激励，却不会让基础信用风险凭空消失：必须追到最终持有人">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value} SYN`} inputId="risk-taking-c7-retained" label="银行保留（发起量固定100）" max={100} min={0} onChange={(value) => { setRetained(value); setProtection((current) => Math.min(current, value)); }} step={5} value={retained} /><RangeInput display={(value) => `${value} SYN`} inputId="risk-taking-c7-protection" label="对保留部分购买保护" max={retained} min={0} onChange={setProtection} step={5} value={protection} /></div>
    <output aria-atomic="true" aria-live="polite" className="sr-only">{result ? `银行未对冲${result.bankUnhedgedExposure.toFixed(0)}，贷款买家${result.loanBuyerExposure.toFixed(0)}，保护卖方${result.protectionSellerExposure.toFixed(0)}，系统最终持有人合计${result.systemFinalHolderExposure.toFixed(0)} SYN。` : '输入违反风险守恒，暂不输出。'}</output>
    {result ? <div className="holding-return-chain" role="group" aria-label="信用风险最终持有人账本"><article><span>银行未对冲</span><b>{result.bankUnhedgedExposure.toFixed(0)} SYN</b><p>保留减保护。</p></article><article><span>贷款买家</span><b>{result.loanBuyerExposure.toFixed(0)} SYN</b><p>承接出售部分。</p></article><article><span>保护卖方</span><b>{result.protectionSellerExposure.toFixed(0)} SYN</b><p>承接受保护部分的基础信用风险。</p></article><article className="result"><span>系统最终持有人</span><b>{result.systemFinalHolderExposure.toFixed(0)} SYN</b><p>守恒缺口 {result.conservationGap.toFixed(0)}。</p></article></div> : null}
    <div className="precision-note"><span>守恒不等于风险等价</span><p>该账本只守恒原始名义信用敞口；保护卖方违约、基差、相关性、网络集中与再证券化需要另建状态。银行风险下降与系统风险下降不是同一句话。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>发起100、保留20、出售80、为保留部分买10保护：银行未对冲10，买家80，保护卖方10，系统最终持有人仍合计100。</div>
    <ResetControl label="C7" onReset={() => { setRetained(20); setProtection(10); }} />
  </LabShell>;
}

const gateLabels: Record<keyof IdentificationGate, string> = {
  policyTreatmentDefinedBeforeOutcome: '政策处理在结果前定义', policyShockExogeneityEstablished: '政策冲击外生性成立', predeterminedIntermediaryExposure: '中介暴露预定', sameBorrowerOrApplicationDemandControl: '同借款人/申请需求控制', lenderCapacityFrozenOrModelled: '贷款人容量冻结或建模', borrowerRiskFrozenOrModelled: '借款人风险冻结或建模', exAnteRiskOutcomeObserved: '观察事前风险结果', commonSupportEstablished: '共同支持成立', eventDecisionOutcomeClocksOrdered: '事件—决策—结果时钟有序', noPostTreatmentControls: '不使用处理后控制', inferenceMatchesAssignment: '推断层级匹配处理分配',
};

export function RiskTakingIdentificationLab() {
  const [gates, setGates] = useState<IdentificationGate>({ ...identifiedCandidateGate, sameBorrowerOrApplicationDemandControl: false });
  const result = riskTakingIdentificationStatus(gates);
  return <LabShell id="risk-taking-c6" kicker="C6 · IDENTIFICATION GATE" sources={[4, 5, 7, 8]} title="风险份额和贷款标准可以描述机制，却只有在冲击外生性、预定暴露、需求、容量、借款人风险、时钟与推断闸门闭合后才是因果候选">
    <fieldset className="yield-model-picker"><legend>逐项声明证据门</legend>{(Object.keys(gateLabels) as (keyof IdentificationGate)[]).map((key) => <label key={key}><input checked={gates[key]} onChange={(event) => setGates((current) => ({ ...current, [key]: event.target.checked }))} type="checkbox" />{gateLabels[key]}</label>)}</fieldset>
    <output aria-live="polite" className={result.status === 'identified-candidate' ? 'wacc-decision eligible' : 'wacc-decision ineligible'}><span>{result.status.toUpperCase()}</span><b>{result.passed}/{result.total} 项通过</b><p>{result.failedKeys.length ? `失败：${result.failedKeys.map((key) => gateLabels[key]).join('；')}` : '全部已声明闸门通过；结论仍只适用于共同支持样本与所述假设。'}</p></output>
    <div className="precision-note"><span>调查与模型不会自认证因果</span><p>风险容忍度调查、资产风险份额和本页SYN算例都只能提供描述或机制候选。政策冲击、同申请需求反事实以及容量与借款人状态的冻结/建模必须来自设计证据。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>十一门中只缺同一借款人/申请需求控制时10/11通过，状态仍为mechanism-consistent；十一门全过才是identified-candidate，而不是全球结构常数。3.12 canonical低利率水平算例另因冲击外生性与预定暴露均未建立，只能保留机制身份。</div>
    <ResetControl label="C6" onReset={() => setGates({ ...identifiedCandidateGate, sameBorrowerOrApplicationDemandControl: false })} />
  </LabShell>;
}

export function RiskTakingFixtureAudit() {
  const passed = riskTakingFixtureAudit.filter((item) => item.passed).length;
  return <div className="yield-fixture-audit" role="group" aria-label="3.12风险承担机制底层fixture审计"><span>{passed}/{riskTakingFixtureAudit.length} 项边界、数值与突变断言通过</span><ul>{riskTakingFixtureAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>;
}
