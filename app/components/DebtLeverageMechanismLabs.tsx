'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  canonicalDebtOverhangInput,
  canonicalDebtOverhangResult,
  canonicalDeleveragingResults,
  canonicalDistributionGroups,
  canonicalDistributionResult,
  canonicalLeverageRegistryInput,
  canonicalLeverageRegistryResult,
  canonicalNetDebtInput,
  canonicalNetDebtResult,
  canonicalPassiveLeverageInput,
  canonicalPassiveLeverageResult,
  canonicalRefinancingGapInput,
  canonicalRefinancingGapResult,
  canonicalTargetLeverageInput,
  canonicalTargetLeverageResult,
  debtLeverageMechanismLabSources,
  debtOverhangMetrics,
  deleveragingPathMetrics,
  leverageDistributionMetrics,
  leverageRegistryMetrics,
  netDebtEligibility,
  passiveLeverageShock,
  refinancingGapMetrics,
  targetLeverageProposal,
  type DeleveragingPath,
} from './debtLeverageFixtures';
import styles from './debtLeverage.module.css';

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function Sources({ ids }: { ids: readonly number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function LabShell({ id, kicker, title, sources, children }: { id: string; kicker: string; title: string; sources: readonly number[]; children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  return <section className={`yield-mechanism-lab debt-leverage-mechanism-lab ${styles.lab}${hydrated ? ' is-hydrated' : ''}`} id={id}>
    <header><div><span>{kicker}</span><h3>{title}</h3></div><p>机制依据：<Sources ids={sources} /></p></header>
    <noscript><div className="precision-note"><span>互动控件当前不可用</span><p>本实验已切换为冻结输入的静态等价解；下方保留机制边界与完整复算，不把无法更新的控件伪装成可交互状态。</p></div></noscript>
    {children}
  </section>;
}

function RangeInput({ inputId, label, value, min, max, step, onChange, display }: { inputId: string; label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; display: (value: number) => string }) {
  return <label className="yield-control" htmlFor={inputId}><span>{label}</span><input aria-valuetext={display(value)} id={inputId} max={max} min={min} onChange={(event) => onChange(Number(event.currentTarget.value))} step={step} type="range" value={value} /><output htmlFor={inputId}>{display(value)}</output></label>;
}

function required<T>(value: T | null, label: string): T {
  if (value === null) throw new Error(`3.15 missing canonical ${label}`);
  return value;
}

const n = (value: number | null | undefined, digits = 2) => typeof value === 'number' ? value.toFixed(digits) : 'STOP';
const pct = (value: number | null | undefined, digits = 1) => typeof value === 'number' ? `${(value * 100).toFixed(digits)}%` : 'STOP';
const signed = (value: number | null | undefined, digits = 1) => typeof value === 'number' ? `${value > 0 ? '+' : ''}${value.toFixed(digits)}` : 'STOP';

const staticRegistry = required(canonicalLeverageRegistryResult, 'leverage registry');
const staticPassive = required(canonicalPassiveLeverageResult, 'passive leverage');
const staticTarget = required(canonicalTargetLeverageResult, 'target leverage proposal');
const staticNetDebt = required(canonicalNetDebtResult, 'net debt');
const staticRefinancing = required(canonicalRefinancingGapResult, 'refinancing gap');
const staticOverhang = required(canonicalDebtOverhangResult, 'debt overhang');
const staticDistribution = required(canonicalDistributionResult, 'distribution');
const cashCandidateLabels: Record<string, string> = {
  'same-entity-unrestricted': '同实体、同币种、未受限且及时可用现金',
  restricted: '受限现金',
  subsidiary: '子公司现金',
  'wrong-currency': '错币种现金',
  'future-cash': '目标日后现金',
};
const cashFailureLabels: Record<string, string> = {
  'wrong-legal-entity': '法律实体不一致',
  'wrong-currency': '币种不一致',
  restricted: '使用受限',
  'available-after-target-date': '目标日后才可用',
};
const adjustmentStatusLabels: Record<string, string> = {
  'synthetic-accounting-path-not-observed-action': '合成账本路径，不是已观察行动',
};
const spendingEffectLabels: Record<string, string> = {
  'likely-delayed-spending-or-distribution': '可能通过延后支出或分配逐步修复',
  'possible-asset-supply-and-spending-pressure': '可能增加资产供给并压低支出',
  'loss-transferred-to-creditor': '损失转移给债权人，不是现金偿还',
  'depends-on-equity-supplier-and-use-of-cash': '取决于谁提供股本以及现金用途',
};

export function LeverageRegistryLab() {
  const [assets, setAssets] = useState(canonicalLeverageRegistryInput.assets);
  const [debt, setDebt] = useState(canonicalLeverageRegistryInput.debt);
  const [otherLiabilities, setOtherLiabilities] = useState(canonicalLeverageRegistryInput.otherLiabilities);
  const result = leverageRegistryMetrics({ ...canonicalLeverageRegistryInput, assets, debt, otherLiabilities });
  return <LabShell id="debt-leverage-c1" kicker="C1 · LEVERAGE REGISTRY" sources={debtLeverageMechanismLabSources.c1} title="同一张资产负债表，换一个分母就换了一个问题">
    <div className="yield-control-grid"><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c1-assets" label="总资产 A" max={150} min={70} onChange={setAssets} step={1} value={assets} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c1-debt" label="有息债务 D" max={100} min={20} onChange={setDebt} step={1} value={debt} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c1-other" label="其他负债" max={25} min={0} onChange={setOtherLiabilities} step={1} value={otherLiabilities} /></div>
    {result ? <div aria-label="杠杆登记计算结果" className={`holding-return-chain ${styles.labOutput}`} role="group"><article><span>BALANCE SHEET</span><b>E = {n(result.equity)}</b><p>A {n(assets)} = D {n(debt)} + 其他负债 {n(otherLiabilities)} + E {n(result.equity)}。</p></article><article><span>REGISTERED RATIOS</span><b>A/E {n(result.assetsToEquity)}×</b><p>D/A {pct(result.debtToAssets)}；D/E {n(result.debtToEquity)}×；D/收入 {n(result.debtToIncome)}×。</p></article></div> : <div aria-label="杠杆登记停止状态" className="wacc-decision ineligible" role="group"><span>STOP · NON-POSITIVE DENOMINATOR</span><b>权益、收入、EBITDA或NAV不能为零或负数</b><p>保留失败状态，不用绝对值或无穷大伪装成正常杠杆。</p></div>}
    <div className="precision-note"><span>口径护栏</span><p>这里的有息债务不等于全部负债；本课目标日合资格净债务/EBITDA只按注册政策扣现金，不是通用net debt定义；gross exposure/NAV还可能含衍生品与表外敞口。Basel的“leverage ratio”方向相反，是Tier 1资本/监管暴露，不能与A/E同名互换。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>A=100、D=80、其他负债=10，因此E=10；D/A={pct(staticRegistry.debtToAssets)}，D/E={n(staticRegistry.debtToEquity)}×，A/E={n(staticRegistry.assetsToEquity)}×，D/收入={n(staticRegistry.debtToIncome)}×，(D−合资格现金5)/EBITDA16={n(staticRegistry.netDebtToEbitda, 4)}×，gross exposure150/NAV10={n(staticRegistry.grossExposureToNav)}×。它们回答六个不同问题。</p></div>
  </LabShell>;
}

export function TargetRebalancingLab() {
  const [shock, setShock] = useState(canonicalPassiveLeverageInput.assetPriceShockPct);
  const [target, setTarget] = useState(canonicalTargetLeverageInput.targetAssetsToEquity);
  const passive = passiveLeverageShock({ ...canonicalPassiveLeverageInput, assetPriceShockPct: shock });
  const proposal = targetLeverageProposal({ ...canonicalTargetLeverageInput, assetPriceShockPct: shock, targetAssetsToEquity: target });
  return <LabShell id="debt-leverage-c2" kicker="C2 · PASSIVE → TARGET → PROPOSAL" sources={debtLeverageMechanismLabSources.c2} title="先观察分母机械变化，再计算规则会提出什么；两者都不是实际交易">
    <div className="yield-control-grid"><RangeInput display={(v) => `${signed(v, 0)}%`} inputId="debt-leverage-c2-shock" label="资产价格冲击" max={8} min={-9} onChange={setShock} step={1} value={shock} /><RangeInput display={(v) => `${v.toFixed(0)}×`} inputId="debt-leverage-c2-target" label="合成目标 A/E" max={15} min={4} onChange={setTarget} step={1} value={target} /></div>
    {passive ? <div aria-label="被动杠杆与目标规则计算结果" className="holding-return-chain" role="group"><article><span>PASSIVE STATE</span><b>A/E {n(passive.after.assetsToEquity)}×</b><p>债务仍是{n(passive.after.debt)}；资产{n(passive.after.assets)}、权益{n(passive.after.equity)}。只发生价格冲击。</p></article><article><span>SYNTHETIC RULE</span><b>{proposal ? `${proposal.proposedAssetTrade >= 0 ? '拟买入' : '拟出售'} ${n(Math.abs(proposal.proposedAssetTrade))}` : 'STOP'}</b><p>{proposal ? `若无价格冲击并以债务一比一融资/偿还，拟议期末A=${n(proposal.proposedEnd.assets)}、D=${n(proposal.proposedEnd.debt)}、E=${n(proposal.proposedEnd.equity)}。actualAdjustment = null。` : '目标不可达或权益已耗尽；不继续输出行动。'}</p></article></div> : null}
    <div className="precision-note"><span>capacity ≠ target ≠ choice ≠ actual</span><p>抵押或资本约束只描述最多能做多少；目标杠杆是一条行为规则；拟议交易是该规则在冻结假设下的输出；实际交易还要经过治理、市场深度、融资可得性与成交价格。本实验永久把第四栏留为null。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>A=100、D=90、E=10；资产跌4%后A=96、D仍90、E=6，A/E从{n(staticPassive.before.assetsToEquity)}×被动跳至{n(staticPassive.after.assetsToEquity)}×，权益跌{n(Math.abs(staticPassive.equityLossPct ?? 0))}%。若仅假定目标A/E=10×、按账面价出售并全部偿债，规则提出出售{n(Math.abs(staticTarget.proposedAssetTrade))}、偿债{n(Math.abs(staticTarget.proposedDebtChange))}，拟议期末A=60、D=54、E=6；这不是观测行动。</p></div>
  </LabShell>;
}

export function GrossNetDebtLab() {
  const [includeRestricted, setIncludeRestricted] = useState(false);
  const [includeSubsidiary, setIncludeSubsidiary] = useState(false);
  const cashCandidates = canonicalNetDebtInput.cashCandidates.map((candidate) => candidate.id === 'restricted' && includeRestricted ? { ...candidate, unrestricted: true } : candidate.id === 'subsidiary' && includeSubsidiary ? { ...candidate, legalEntity: canonicalNetDebtInput.debtLegalEntity } : candidate);
  const result = netDebtEligibility({ ...canonicalNetDebtInput, cashCandidates });
  return <LabShell id="debt-leverage-c3" kicker="C3 · GROSS / NET DEBT" sources={debtLeverageMechanismLabSources.c3} title="现金不是看到就扣：先过法律实体、币种、限制与日期四道门">
    <div className="yield-model-picker" role="group" aria-label="本课目标日合资格净债务现金政策情景"><button aria-pressed={includeRestricted} className={includeRestricted ? 'active' : ''} onClick={() => setIncludeRestricted((value) => !value)} type="button"><b>解除7单位限制</b><span>{includeRestricted ? 'UNRESTRICTED' : 'RESTRICTED'}</span></button><button aria-pressed={includeSubsidiary} className={includeSubsidiary ? 'active' : ''} onClick={() => setIncludeSubsidiary((value) => !value)} type="button"><b>9单位转至同实体</b><span>{includeSubsidiary ? 'SAME ENTITY' : 'SUBSIDIARY'}</span></button></div>
    {result ? <><output aria-atomic="true" aria-live="polite" className="sr-only">本课现金资格政策更新：合资格现金{n(result.eligibleCash)}，目标日合资格净债务{n(result.netDebt)}。</output><div aria-label="本课现金资格政策计算结果" className="holding-return-chain" role="group"><article><span>ELIGIBLE CASH · COURSE POLICY</span><b>{n(result.eligibleCash)}</b><p>五个候选池按<code>{result.policyId}</code>逐项过门；只有通过者可在目标日抵销同币种债务。</p></article><article><span>COURSE-POLICY ELIGIBLE NET DEBT</span><b>{n(result.netDebt)}</b><p>gross debt {n(result.grossDebt)} − eligible cash {n(result.eligibleCash)}；不是普适net debt定义。</p></article></div><div aria-label="现金资格决定表，可横向滚动" className="yield-data-table-wrap" role="region" tabIndex={0}><table className="yield-data-table"><caption>当前情景下每一现金池的资格决定；中文标签用于阅读，code保留机器合同</caption><thead><tr><th scope="col">现金池</th><th scope="col">金额</th><th scope="col">决定</th><th scope="col">失败门</th></tr></thead><tbody>{result.decisions.map((item) => <tr key={item.id}><th scope="row">{cashCandidateLabels[item.id] ?? item.id}<br /><code>{item.id}</code></th><td>{item.amount}</td><td>{item.eligible ? '合资格（ELIGIBLE）' : '排除（EXCLUDED）'}</td><td>{item.failedRules.length ? <>{item.failedRules.map((rule) => cashFailureLabels[rule] ?? rule).join('、')}<br /><code>{item.failedRules.join(', ')}</code></> : '—'}</td></tr>)}</tbody></table></div></> : null}
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>gross debt=80。本课政策<code>{staticNetDebt.policyId}</code>下，合资格现金只有同实体、同币种、未受限且在目标日前可用的5，因此目标日合资格净债务={staticNetDebt.netDebt}。受限7、子公司9、错币种4和目标日后6全部排除；名义存在不等于能用于该债务，换用其他合法定义必须换标签重算。</p></div>
  </LabShell>;
}

export function MaturityRefinancingLab() {
  const [principalDue, setPrincipalDue] = useState(canonicalRefinancingGapInput.maturityBuckets[0].principalDue);
  const [interestDue, setInterestDue] = useState(canonicalRefinancingGapInput.interestDue);
  const [cash, setCash] = useState(canonicalRefinancingGapInput.eligibleOpeningCash);
  const [operatingCash, setOperatingCash] = useState(canonicalRefinancingGapInput.nonOverlappingOperatingCashFlow);
  const [availability, setAvailability] = useState(canonicalRefinancingGapInput.facilityAvailabilityFactor);
  const result = refinancingGapMetrics({ ...canonicalRefinancingGapInput, interestDue, eligibleOpeningCash: cash, nonOverlappingOperatingCashFlow: operatingCash, facilityAvailabilityFactor: availability, maturityBuckets: [{ ...canonicalRefinancingGapInput.maturityBuckets[0], principalDue }, { ...canonicalRefinancingGapInput.maturityBuckets[1], principalDue: canonicalRefinancingGapInput.totalDebt - principalDue }] });
  return <LabShell id="debt-leverage-c4" kicker="C4 · MATURITY / REFINANCING GAP" sources={debtLeverageMechanismLabSources.c4} title="债务总量相同，什么时候必须交现金会改变生存问题">
    <div className="yield-control-grid"><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c4-due" label="目标窗内到期本金" max={60} min={0} onChange={setPrincipalDue} step={1} value={principalDue} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c4-interest" label="目标窗内利息" max={12} min={0} onChange={setInterestDue} step={1} value={interestDue} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c4-cash" label="合资格期初现金" max={25} min={0} onChange={setCash} step={1} value={cash} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c4-fcf" label="非重叠经营现金流" max={20} min={0} onChange={setOperatingCash} step={1} value={operatingCash} /><RangeInput display={(v) => `${(v * 100).toFixed(0)}%`} inputId="debt-leverage-c4-availability" label="承诺额度可用系数" max={1} min={0} onChange={setAvailability} step={0.1} value={availability} /></div>
    {result ? <div aria-label="再融资来源与用途计算结果" className="holding-return-chain" role="group"><article><span>USES</span><b>{n(result.totalUses)}</b><p>窗口内互斥到期本金 {n(result.principalDue)} + 同窗利息 {n(result.interestDue)} + 不含本金与利息的其他用途 {n(result.otherUsesExcludingPrincipalAndInterest)}。</p></article><article><span>RELIABLE SOURCES</span><b>{n(result.totalReliableSources)}</b><p>现金 {n(cash)} + 经营现金流 {n(operatingCash)} + 已承诺未提款5×可用系数{(availability * 100).toFixed(0)}%。缺口 {n(result.refinancingGap)}；资金盈余 {n(result.surplus)}。</p></article></div> : <div aria-label="再融资缺口停止状态" className="wacc-decision ineligible" role="group"><span>STOP</span><b>利息或用途为负、到期桶重叠、超出总债务或时钟无效</b></div>}
    <div className="precision-note"><span>缺口截零，资金盈余单列；正缺口不等于已经违约</span><p>缺口定义为<code>max(0, 总用途−可靠来源)</code>，反向差额以资金盈余报告，不能让“负缺口”承担双重含义。正缺口表示在这个窗内必须获得新融资、出售资产、追加股本或重组。未承诺额度不能按100%当现金；同一笔本金不能同时列入“计划摊还”和“气球到期”，期初现金也不能再伪装成期间经营现金流。任何到期桶若只与目标窗部分重叠，本函数都会STOP，直到原子现金流或明确分配规则补齐。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>目标窗到期本金30 + 显式冻结利息0 + 其他用途0，总用途30；合资格现金8 + 非重叠经营现金流7 + 承诺未提款额度5×80%=4，可靠来源共{n(staticRefinancing.totalReliableSources)}，因此再融资缺口={n(staticRefinancing.refinancingGap)}、资金盈余={n(staticRefinancing.surplus)}。总债务都是80，换一条到期梯就能改变当前现金缺口。</p></div>
  </LabShell>;
}

export function DebtOverhangLab() {
  const [cost, setCost] = useState(canonicalDebtOverhangInput.projectCostPaidByExistingEquity);
  const [payoff, setPayoff] = useState(canonicalDebtOverhangInput.projectTerminalPayoffIncrement);
  const result = debtOverhangMetrics({ ...canonicalDebtOverhangInput, projectCostPaidByExistingEquity: cost, projectTerminalPayoffIncrement: payoff });
  return <LabShell id="debt-leverage-c5" kicker="C5 · DEBT OVERHANG" sources={debtLeverageMechanismLabSources.c5} title="项目总价值为正，旧债仍可能截走新增价值，使股东拒绝投资">
    <div className="yield-control-grid"><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c5-cost" label="现有股东支付成本" max={20} min={1} onChange={setCost} step={1} value={cost} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c5-payoff" label="终值增量" max={30} min={0} onChange={setPayoff} step={1} value={payoff} /></div>
    {result ? <div aria-label="项目总价值与股东激励计算结果" className="holding-return-chain" role="group"><article><span>TOTAL VALUE TEST</span><b>NPV {signed(result.totalNpv)}</b><p>项目终值增量 {n(payoff)} − 当期成本 {n(cost)}。</p></article><article><span>EQUITY INCENTIVE TEST</span><b>Equity NPV {signed(result.equityNpv)}</b><p>旧债权人先获得增量 {n(result.creditorGain)}；股东终值只增 {n(result.equityIncrementBeforeCost)}，再扣成本。</p></article></div> : null}
    <div className="precision-note"><span>结论依赖冻结合同</span><p>本题假定旧债不可重谈、现有股东用现金支付、没有新优先融资、终值确定且不折现。只要能重谈、发行有担保新债、补贴或改变优先级，利益分配就会变化；机制存在不等于所有投资下降都由债务积压造成。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>无项目时终值资产90、旧债面值100，债权人得90、股东得0。有项目时股东付10、终值资产105，债权人得100、股东得5。总NPV={signed(staticOverhang.totalNpv)}，但股东NPV={signed(staticOverhang.equityNpv)}，债权人吸收{n(staticOverhang.creditorGain)}新增价值；在冻结假设下，股东会拒绝一个正总NPV项目。</p></div>
  </LabShell>;
}

const pathLabels: Record<DeleveragingPath, string> = {
  'asset-sale-repay': '卖资产并偿债',
  'new-equity-retained-cash': '增发股本并留现金',
  'debt-write-down': '债务减记',
  'retained-earnings-cash': '留存收益并积累现金',
};

export function DeleveragingPathsLab() {
  const [path, setPath] = useState<DeleveragingPath>('asset-sale-repay');
  const result = deleveragingPathMetrics({ assets: 96, debt: 90, otherLiabilities: 0, targetAssetsToEquity: 10, path, amountUnit: 'SYN-currency' });
  return <LabShell id="debt-leverage-c6" kicker="C6 · FOUR REPAIR PATHS" sources={debtLeverageMechanismLabSources.c6} title="同样把A/E降到10倍，分子、分母和真实经济后果可以完全不同">
    <div className="yield-model-picker" role="group" aria-label="选择资产负债表修复路径">{(Object.keys(pathLabels) as DeleveragingPath[]).map((candidate) => <button aria-pressed={path === candidate} className={path === candidate ? 'active' : ''} key={candidate} onClick={() => setPath(candidate)} type="button"><b>{pathLabels[candidate]}</b><span>{candidate}</span></button>)}</div>
    {result ? <><output aria-atomic="true" aria-live="polite" className="sr-only">修复路径更新：{pathLabels[result.path]}需要{n(result.amount)}，期末A/E为{n(result.end.assetsToEquity)}倍；这是合成账本路径，不是已观察行动。</output><div aria-label="去杠杆修复路径计算结果" className="holding-return-chain" role="group"><article><span>REQUIRED AMOUNT</span><b>{n(result.amount)}</b><p>{pathLabels[result.path]}；{adjustmentStatusLabels[result.observedStatus] ?? result.observedStatus}（<code>{result.observedStatus}</code>）。</p></article><article><span>ENDING LEDGER</span><b>A/E {n(result.end.assetsToEquity)}×</b><p>A {n(result.end.assets)} = D {n(result.end.debt)} + 其他负债 {n(result.end.otherLiabilities)} + E {n(result.end.equity)}；{spendingEffectLabels[result.realSpendingEffect] ?? result.realSpendingEffect}（<code>{result.realSpendingEffect}</code>）。</p></article></div></> : null}
    <div className="precision-note"><span>减记不是现金偿还</span><p>卖资产偿债同时缩小A与D；发股或留存收益先抬高A与E；减记在A不变时把D的损失转给债权人并抬高借款人E。期末比率相同，谁承担损失、何时需要现金、是否压低资产价格与支出完全不同。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>冲击后A=96、D=90、E=6，要回到A/E=10：卖资产并偿债需{n(canonicalDeleveragingResults[0]?.amount)}，期末A/D/E=60/54/6；增发股本留现金需{n(canonicalDeleveragingResults[1]?.amount)}，期末100/90/10；债务减记需{n(canonicalDeleveragingResults[2]?.amount)}，期末96/86.4/9.6；留存收益积累现金需{n(canonicalDeleveragingResults[3]?.amount)}但要经过时间。四条路径都闭合，却不是同一种经济事件。</p></div>
  </LabShell>;
}

export function DistributionTailLab() {
  const [tailWeight, setTailWeight] = useState(canonicalDistributionGroups[0].populationWeight);
  const [tailDebt, setTailDebt] = useState(canonicalDistributionGroups[0].debt);
  const groups = [{ ...canonicalDistributionGroups[0], populationWeight: tailWeight, debt: tailDebt }, { ...canonicalDistributionGroups[1], populationWeight: 1 - tailWeight }];
  const result = leverageDistributionMetrics(groups);
  return <LabShell id="debt-leverage-c7" kicker="C7 · DISTRIBUTION / TAIL" sources={debtLeverageMechanismLabSources.c7} title="平均杠杆可以平静，真正触发减支的尾部却在变厚">
    <div className="yield-control-grid"><RangeInput display={(v) => `${(v * 100).toFixed(0)}%`} inputId="debt-leverage-c7-weight" label="薄缓冲群体人口权重" max={0.6} min={0.05} onChange={setTailWeight} step={0.05} value={tailWeight} /><RangeInput display={(v) => v.toFixed(0)} inputId="debt-leverage-c7-debt" label="薄缓冲群体债务" max={120} min={30} onChange={setTailDebt} step={5} value={tailDebt} /></div>
    {result ? <div aria-label="分布总量与脆弱尾部计算结果" className="holding-return-chain" role="group"><article><span>TWO AGGREGATES</span><b>{n(result.averageOfRatios, 3)}× ≠ {n(result.ratioOfSums, 3)}×</b><p>左为人口加权的个体D/I平均，右为加权债务总和÷加权收入总和；不能互换。</p></article><article><span>CONSTRAINT-RELEVANT TAIL</span><b>{pct(result.vulnerableWeight, 0)}</b><p>本合成规则把D/I≥4或当期本金/收入≥1的群体记入尾部；不是违约概率。</p></article></div> : null}
    <div className="precision-note"><span>同一均值不保证同一反应</span><p>债务落在高边际消费倾向家庭、短债企业或受保证金约束中介手中，比落在深口袋主体手中更容易转成减支或被迫出售。宏观反馈需要暴露分布、到期集中与非约束买家，而不只是一个均值。</p></div>
    <div className="yield-static-summary"><b>无脚本静态等价：</b><p>20%的薄缓冲群体D/I=6、80%的稳健群体D/I=2，人口加权比率均值={n(staticDistribution.averageOfRatios, 3)}×；但人口加权债务总和/收入总和={n(staticDistribution.ratioOfSums, 3)}×，脆弱尾部权重={pct(staticDistribution.vulnerableWeight, 0)}。两个平均数都不是危机概率。</p></div>
  </LabShell>;
}
