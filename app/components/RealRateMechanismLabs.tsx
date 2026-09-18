'use client';

import { useEffect, useRef, useState } from 'react';
import {
  additiveRealRateApproxPct,
  crossAssetSensitivity,
  dcfConsistencyMetrics,
  exactRealReturnPct,
  realRateFixtureAssertions,
  realYieldDecompositionFixtures,
  stochasticExpectedRealReturnPct,
  tipsContractFixtures,
  tipsContractMetrics,
  waccPct,
  type DcfFixtureId,
  type RealYieldFixtureId,
  type TipsFixtureId,
} from './realRateFixtures';

function SourceMarks({ ids }: { ids: number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function MechanismNoScriptFallback() {
  return <noscript><style>{'.real-rate-mechanism-lab > :not(header):not(noscript):not(.yield-static-summary){display:none!important}'}</style><div className="precision-note"><span>无脚本模式</span><p>控件已隐藏，因为没有 JavaScript 时结果不会随输入更新；请使用本实验末尾的冻结静态摘要，并继续完成 §61 的十道静态孪生题。</p></div></noscript>;
}

function ResetControl({ label, onReset }: { label: string; onReset: () => void }) {
  const [armed, setArmed] = useState(false);
  const requestRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);

  useEffect(() => {
    if (armed) {
      opened.current = true;
      confirmRef.current?.focus();
    } else if (opened.current) {
      opened.current = false;
      requestRef.current?.focus();
    }
  }, [armed]);

  if (!armed) return <button className="yield-reset" onClick={() => setArmed(true)} ref={requestRef} type="button">准备重置{label}</button>;
  return <div className="yield-reset-confirm" role="group" aria-label={`确认重置${label}`}><button onClick={() => setArmed(false)} type="button">取消</button><button onClick={() => { onReset(); setArmed(false); }} ref={confirmRef} type="button">确认重置</button></div>;
}

function RateInput({ label, max, min, onChange, step = 0.25, value }: { label: string; max: number; min: number; onChange: (value: number) => void; step?: number; value: number }) {
  return <label><span>{label}</span><b>{value >= 0 ? '+' : ''}{value.toFixed(2)}%</b><input max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} /></label>;
}

export function RealRatePassportLab() {
  const [nominalPct, setNominalPct] = useState(8);
  const [inflationPct, setInflationPct] = useState(5);
  const [measureKind, setMeasureKind] = useState<'ex-post' | 'ex-ante-plugin'>('ex-post');
  const [indexMatched, setIndexMatched] = useState(true);
  const [horizonMatched, setHorizonMatched] = useState(true);
  const exact = exactRealReturnPct(nominalPct, inflationPct);
  const additive = additiveRealRateApproxPct(nominalPct, inflationPct);
  const passportValid = indexMatched && horizonMatched && exact !== null;
  const gapBp = exact === null ? null : (additive - exact) * 100;

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="real-passport-title">
      <header><div><span>C1 · EXACT / APPROXIMATION LAB</span><h3 id="real-passport-title">先校验价格指数与期限护照，再比较精确购买力回报和减法近似</h3></div><p><SourceMarks ids={[1, 2, 3, 4]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择实际回报时点口径"><button aria-pressed={measureKind === 'ex-post'} className={measureKind === 'ex-post' ? 'active' : ''} onClick={() => setMeasureKind('ex-post')} type="button">Ex post · 已实现通胀</button><button aria-pressed={measureKind === 'ex-ante-plugin'} className={measureKind === 'ex-ante-plugin' ? 'active' : ''} onClick={() => setMeasureKind('ex-ante-plugin')} type="button">Ex ante · 点预测 plug-in</button></div>
      <div className="yield-control-grid"><RateInput label="同窗口名义总回报" max={20} min={-10} onChange={setNominalPct} value={nominalPct} /><RateInput label={measureKind === 'ex-post' ? '同窗口已实现通胀' : '同窗口通胀点预测'} max={20} min={-10} onChange={setInflationPct} value={inflationPct} /></div>
      <fieldset className="yield-model-picker"><legend>Real-rate passport 最小匹配</legend><label><input checked={indexMatched} onChange={(event) => setIndexMatched(event.target.checked)} type="checkbox" />价格指数对象一致</label><label><input checked={horizonMatched} onChange={(event) => setHorizonMatched(event.target.checked)} type="checkbox" />起止窗口与年化一致</label></fieldset>
      {passportValid ? <div className="holding-return-chain" role="group" aria-label={`精确实际回报 ${exact?.toFixed(6)}%，加法近似 ${additive.toFixed(6)}%，近似减精确 ${gapBp?.toFixed(3)} 基点`}><article><span>对象</span><b>{measureKind === 'ex-post' ? 'Realized' : 'Plug-in'}</b><p>{measureKind === 'ex-post' ? '回答最终购买力变化。' : '不是随机通胀下的严格期望。'}</p></article><article><span>Exact gross-factor ratio</span><b data-testid="c1-exact" data-value={exact ?? undefined}>{exact?.toFixed(6)}%</b><p>(1+i)/(1+π)−1</p></article><article><span>Additive approximation</span><b data-testid="c1-additive" data-value={additive}>{additive.toFixed(6)}%</b><p>i−π</p></article><article className="result"><span>Approx − exact</span><b data-testid="c1-gap" data-value={gapBp ?? undefined}>{gapBp?.toFixed(3)}bp</b><p>误差大小随输入而变。</p></article></div> : <p className="real-rate-blocked" role="alert">护照未通过：不输出可比较的“实际利率”。请先恢复同一价格指数对象与完全一致的期限窗口。</p>}
      <div className="yield-static-summary"><b>静态摘要：</b>名义 8%、通胀 5% 时，精确实际回报为 2.857142857%，减法近似为 3%，高出 14.285714bp；ex-ante 版本只能命名为点预测 plug-in。</div>
      <ResetControl label="C1" onReset={() => { setNominalPct(8); setInflationPct(5); setMeasureKind('ex-post'); setIndexMatched(true); setHorizonMatched(true); }} />
    </section>
  );
}

export function StochasticInflationLab() {
  const [nominalPct, setNominalPct] = useState(6);
  const [lowInflationPct, setLowInflationPct] = useState(0);
  const [highInflationPct, setHighInflationPct] = useState(12);
  const [lowProbabilityPct, setLowProbabilityPct] = useState(50);
  const lowProbability = lowProbabilityPct / 100;
  const expectedInflationPct = lowProbability * lowInflationPct + (1 - lowProbability) * highInflationPct;
  const strict = stochasticExpectedRealReturnPct(nominalPct, [{ inflationPct: lowInflationPct, probability: lowProbability }, { inflationPct: highInflationPct, probability: 1 - lowProbability }]);
  const plugin = exactRealReturnPct(nominalPct, expectedInflationPct);
  const gapBp = strict === null || plugin === null ? null : (strict - plugin) * 100;
  const valid = strict !== null && plugin !== null;

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="stochastic-inflation-title">
      <header><div><span>C2 · STOCHASTIC INFLATION LAB</span><h3 id="stochastic-inflation-title">逐状态计算购买力再求期望，才能看见平均通胀 plug-in 遗漏的 Jensen gap</h3></div><p><SourceMarks ids={[1, 2, 8, 13]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-control-grid"><RateInput label="固定名义总回报" max={20} min={-10} onChange={setNominalPct} value={nominalPct} /><RateInput label="低通胀状态" max={20} min={-20} onChange={setLowInflationPct} value={lowInflationPct} /><RateInput label="高通胀状态" max={30} min={-20} onChange={setHighInflationPct} value={highInflationPct} /><label><span>低状态概率</span><b>{lowProbabilityPct}%</b><input max="100" min="0" onChange={(event) => setLowProbabilityPct(Number(event.target.value))} step="5" type="range" value={lowProbabilityPct} /></label></div>
      {valid ? <div className="holding-return-chain" role="group" aria-label={`期望通胀 ${expectedInflationPct.toFixed(3)}%，严格期望实际回报 ${strict?.toFixed(6)}%，plug-in ${plugin?.toFixed(6)}%，Jensen gap ${gapBp?.toFixed(3)} 基点`}><article><span>E[π]</span><b data-value={expectedInflationPct}>{expectedInflationPct.toFixed(3)}%</b><p>概率加权通胀。</p></article><article><span>Strict physical expectation</span><b data-testid="c2-strict" data-value={strict ?? undefined}>{strict?.toFixed(6)}%</b><p>(1+i)E[(1+π)⁻¹]−1</p></article><article><span>Mean plug-in</span><b data-testid="c2-plugin" data-value={plugin ?? undefined}>{plugin?.toFixed(6)}%</b><p>(1+i)/(1+Eπ)−1</p></article><article className="result"><span>Jensen gap</span><b data-testid="c2-gap" data-value={gapBp ?? undefined}>{gapBp?.toFixed(3)}bp</b><p>非线性差，不命名为 IRP。</p></article></div> : <p className="real-rate-blocked" role="alert">至少一个通胀状态使价格总因子不为正；当前输入不定义购买力回报。</p>}
      <div className="yield-static-summary"><b>静态摘要：</b>名义 6%、通胀 0%/12% 各半时，strict=0.321428571%，mean plug-in=0%，gap=32.142857bp。该差额不是 inflation risk premium。</div>
      <ResetControl label="C2" onReset={() => { setNominalPct(6); setLowInflationPct(0); setHighInflationPct(12); setLowProbabilityPct(50); }} />
    </section>
  );
}

export function TipsContractLab() {
  const [fixtureId, setFixtureId] = useState<TipsFixtureId>('M5');
  const base = tipsContractFixtures[fixtureId];
  const [maturityReferenceCpi, setMaturityReferenceCpi] = useState<number>(base.maturityReferenceCpi);
  const metrics = tipsContractMetrics(fixtureId, maturityReferenceCpi);

  function selectFixture(id: TipsFixtureId) {
    setFixtureId(id);
    setMaturityReferenceCpi(tipsContractFixtures[id].maturityReferenceCpi);
  }

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="tips-contract-lab-title">
      <header><div><span>C3 · TIPS CONTRACT LAB</span><h3 id="tips-contract-lab-title">把固定 coupon rate、指数化本金、期间票息与到期本金 floor 分开</h3></div><p><SourceMarks ids={[20, 21, 22, 23]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择冻结 TIPS 合同"><button aria-pressed={fixtureId === 'M5'} className={fixtureId === 'M5' ? 'active' : ''} onClick={() => selectFixture('M5')} type="button">M5 · par 1,000</button><button aria-pressed={fixtureId === 'K5'} className={fixtureId === 'K5' ? 'active' : ''} onClick={() => selectFixture('K5')} type="button">K5 · par 2,000</button></div>
      <div className="yield-control-grid"><label><span>到期 Reference CPI 情景</span><b>{maturityReferenceCpi.toFixed(0)}</b><input max={base.baseReferenceCpi * 1.25} min={base.baseReferenceCpi * 0.75} onChange={(event) => setMaturityReferenceCpi(Number(event.target.value))} step="1" type="range" value={maturityReferenceCpi} /></label></div>
      <div className="holding-return-chain" role="group" aria-label={`${fixtureId} 当前指数比 ${metrics.currentIndexRatio.toFixed(4)}，调整本金 ${metrics.currentAdjustedPrincipal.toFixed(2)}，下一期票息 ${metrics.nextCoupon.toFixed(2)}，到期调整本金 ${metrics.maturityAdjustedPrincipal.toFixed(2)}，到期本金支付 ${metrics.maturityPrincipalPayment.toFixed(2)}`}><article><span>Current index ratio</span><b data-testid="c3-index-ratio" data-value={metrics.currentIndexRatio}>{metrics.currentIndexRatio.toFixed(4)}</b><p>{base.currentReferenceCpi}/{base.baseReferenceCpi}</p></article><article><span>Adjusted principal</span><b data-testid="c3-principal" data-value={metrics.currentAdjustedPrincipal}>{metrics.currentAdjustedPrincipal.toFixed(2)}</b><p>Par × current ratio</p></article><article><span>Next coupon</span><b data-testid="c3-coupon" data-value={metrics.nextCoupon}>{metrics.nextCoupon.toFixed(2)}</b><p>固定年票息率 / {base.couponFrequency} × 调整本金</p></article><article><span>Maturity adjusted</span><b data-value={metrics.maturityAdjustedPrincipal}>{metrics.maturityAdjustedPrincipal.toFixed(2)}</b><p>可低于原始 par。</p></article><article className="result"><span>Maturity principal payment</span><b data-testid="c3-floor-payment" data-value={metrics.maturityPrincipalPayment}>{metrics.maturityPrincipalPayment.toFixed(2)}</b><p>max(original par, adjusted principal)</p></article></div>
      <div className="precision-note"><span>Floor 的边界</span><p>它只保护到期本金相对原始 par；不保护二级市场买入价，不给期间票息设同样 floor，也不消除提前出售的价格风险。</p></div>
      <div className="yield-static-summary"><b>静态摘要：</b>M5 的 current ratio=1.06、adjusted principal=1,060、半年票息=6.36；到期 Ref CPI=240 时 adjusted principal=960，但本金 floor 支付 1,000。</div>
      <ResetControl label="C3" onReset={() => selectFixture('M5')} />
    </section>
  );
}

export function RealYieldRStarLab() {
  const [fixtureId, setFixtureId] = useState<RealYieldFixtureId>('M6');
  const fixture = realYieldDecompositionFixtures[fixtureId];
  const [liquidityShockBp, setLiquidityShockBp] = useState(0);
  const observed = fixture.observedTipsYieldPct;
  const wedge = fixture.signedTipsLiquidityYieldWedgePct + liquidityShockBp / 100;
  const modelReal = observed - wedge;
  const estimatedTp = modelReal - fixture.expectedAverageRealShortRatePct;

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="real-yield-rstar-title">
      <header><div><span>C4 · TIPS / MODEL REAL / R* LAYER LAB</span><h3 id="real-yield-rstar-title">市场价格层、期限模型层与宏观自然率层可以互相提供信息，但不能相互改名</h3></div><p><SourceMarks ids={[24, 25, 26, 27, 38, 41, 48]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择分层冻结情景"><button aria-pressed={fixtureId === 'M6'} className={fixtureId === 'M6' ? 'active' : ''} onClick={() => { setFixtureId('M6'); setLiquidityShockBp(0); }} type="button">M6</button><button aria-pressed={fixtureId === 'K6'} className={fixtureId === 'K6' ? 'active' : ''} onClick={() => { setFixtureId('K6'); setLiquidityShockBp(0); }} type="button">K6</button></div>
      <div className="yield-control-grid"><label><span>有符号 TIPS 流动性收益率楔子情景</span><b>{liquidityShockBp >= 0 ? '+' : ''}{liquidityShockBp}bp</b><input max="50" min="-50" onChange={(event) => setLiquidityShockBp(Number(event.target.value))} step="5" type="range" value={liquidityShockBp} /></label></div>
      <div className="real-rate-layer-chain" role="group" aria-label={`${fixtureId} 分层：观测 TIPS ${observed.toFixed(2)}%，有符号楔子 ${wedge.toFixed(2)}%，模型实际收益率 ${modelReal.toFixed(2)}%，预期实际短率平均 ${fixture.expectedAverageRealShortRatePct.toFixed(2)}%，估计实际期限溢价 ${estimatedTp.toFixed(2)}%，独立 r 星 ${fixture.independentRStarEstimatePct.toFixed(2)}%`}>
        <article><span>直接市场输入</span><h4>Observed TIPS yield</h4><b data-testid="c4-observed" data-value={observed}>{observed.toFixed(2)}%</b><p>价格经合同现金流换算的收益率坐标。</p></article>
        <article><span>市场楔子估计</span><h4>Signed liquidity yield wedge</h4><b data-testid="c4-wedge" data-value={wedge}>{wedge >= 0 ? '+' : ''}{wedge.toFixed(2)}%</b><p>本实验符号：observed = model real + wedge。</p></article>
        <article><span>期限模型层</span><h4>Modeled real yield</h4><b data-testid="c4-model-real" data-value={modelReal}>{modelReal.toFixed(2)}%</b><p>Expected real short path {fixture.expectedAverageRealShortRatePct.toFixed(2)}% + estimated real TP {estimatedTp.toFixed(2)}%。</p></article>
        <article className="independent"><span>独立宏观模型层</span><h4>Estimated r*</h4><b data-testid="c4-rstar" data-value={fixture.independentRStarEstimatePct}>{fixture.independentRStarEstimatePct.toFixed(2)}%</b><p>没有从 TIPS 差式生成；不是屏幕收益率。</p></article>
      </div>
      <div className="precision-note"><span>禁止算术桥</span><p>图上没有从 modeled real yield 指向 r* 的等号或减法。长期 real forward 还会混合期限溢价、流动性、floor 和拟合误差，也不能自动命名为未来 r*。</p></div>
      <div className="yield-static-summary"><b>静态摘要：</b>M6：2.10% observed TIPS − 0.25% signed wedge = 1.85% modeled real yield = 1.30% expected real short path + 0.55% estimated real TP；0.80% r* 是独立模型估计。</div>
      <ResetControl label="C4" onReset={() => { setFixtureId('M6'); setLiquidityShockBp(0); }} />
    </section>
  );
}

export function NominalRealDcfLab() {
  const [fixtureId, setFixtureId] = useState<DcfFixtureId>('M7');
  const [conversion, setConversion] = useState<'exact' | 'additive'>('exact');
  const metrics = dcfConsistencyMetrics(fixtureId);
  const nominalPv = conversion === 'exact' ? metrics.nominalPresentValue : metrics.mismatchedPresentValue;
  const residual = nominalPv - metrics.realPresentValue;

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="nominal-real-dcf-title">
      <header><div><span>C5 · NOMINAL / REAL DCF LAB</span><h3 id="nominal-real-dcf-title">同一索赔权可以用名义或实际单位表达；现金流与折现系统完整一致时，现值必须相同</h3></div><p><SourceMarks ids={[1, 2, 13, 55]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择名实 DCF 冻结情景"><button aria-pressed={fixtureId === 'M7'} className={fixtureId === 'M7' ? 'active' : ''} onClick={() => setFixtureId('M7')} type="button">M7 · 100 / 3% / 4%</button><button aria-pressed={fixtureId === 'K7'} className={fixtureId === 'K7' ? 'active' : ''} onClick={() => setFixtureId('K7')} type="button">K7 · 200 / 2% / 5%</button></div>
      <div className="yield-view-picker" role="group" aria-label="选择名义折现率转换"><button aria-pressed={conversion === 'exact'} className={conversion === 'exact' ? 'active' : ''} onClick={() => setConversion('exact')} type="button">Exact Fisher · 合格</button><button aria-pressed={conversion === 'additive'} className={conversion === 'additive' ? 'active' : ''} onClick={() => setConversion('additive')} type="button">r + π · 故意错配</button></div>
      <div className="nominal-real-bridge" role="group" aria-label={`${fixtureId} 实际现金流 ${metrics.realCashFlow}，实际折现率 ${metrics.realDiscountRatePct}%，名义现金流 ${metrics.nominalCashFlow}，所选名义折现率 ${conversion === 'exact' ? metrics.exactNominalDiscountRatePct : metrics.additiveNominalDiscountRatePct}%，实际现值 ${metrics.realPresentValue.toFixed(9)}，名义现值 ${nominalPv.toFixed(9)}`}>
        <article><span>Date-t real-currency representation · Iₜ=1</span><b>{metrics.realCashFlow.toFixed(2)} / (1+{metrics.realDiscountRatePct.toFixed(2)}%)</b><strong data-testid="c5-real-pv" data-value={metrics.realPresentValue}>PV {metrics.realPresentValue.toFixed(9)}</strong></article>
        <div aria-hidden="true">{conversion === 'exact' ? '≅' : '≠'}</div>
        <article className={conversion === 'exact' ? 'matched' : 'mismatched'}><span>Nominal representation</span><b>{metrics.nominalCashFlow.toFixed(2)} / (1+{(conversion === 'exact' ? metrics.exactNominalDiscountRatePct : metrics.additiveNominalDiscountRatePct).toFixed(2)}%)</b><strong data-testid="c5-nominal-pv" data-value={nominalPv}>PV {nominalPv.toFixed(9)}</strong></article>
      </div>
      <output className={conversion === 'exact' ? 'yield-range-output matched' : 'yield-range-output mismatched'} data-testid="c5-residual" data-value={residual}>{conversion === 'exact' ? `一致性通过：残差 ${residual.toExponential(2)}` : `故意错配：用 r+π 遗漏 rπ，名义 PV 与实际 PV 相差 ${residual.toFixed(9)}`}</output>
      <div className="yield-static-summary"><b>静态摘要：</b>M7 把当前价格指数归一化为 Iₜ=1，并把 real CF=100 写成 date-t 货币购买力；real k=3%、确定通胀=4%，于是 nominal CF=104、exact nominal k=7.12%，两种 date-t currency PV 都为 97.087378641。</div>
      <ResetControl label="C5" onReset={() => { setFixtureId('M7'); setConversion('exact'); }} />
    </section>
  );
}

export function CrossAssetSensitivityLab() {
  const [realCurveShockBp, setRealCurveShockBp] = useState(50);
  const [creditSpreadShockBp, setCreditSpreadShockBp] = useState(0);
  const [equityRiskPremiumShockBp, setEquityRiskPremiumShockBp] = useState(0);
  const [propertyRiskPremiumShockBp, setPropertyRiskPremiumShockBp] = useState(0);
  const [equityGrowthShockBp, setEquityGrowthShockBp] = useState(0);
  const [propertyNoiGrowthShockBp, setPropertyNoiGrowthShockBp] = useState(0);
  const results = crossAssetSensitivity({ realCurveShockBp, creditSpreadShockBp, equityRiskPremiumShockBp, propertyRiskPremiumShockBp, equityGrowthShockBp, propertyNoiGrowthShockBp });
  const assets = [
    { id: 'nominal-bond', label: '名义国债', value: results.nominalBondApproxPct, note: 'Dmod 7.5；冻结名义通胀与便利收益新闻。' },
    { id: 'tips', label: 'TIPS', value: results.tipsApproxPct, note: 'Dmod 8.5；冻结 liquidity、floor 与 index basis。' },
    { id: 'corporate-bond', label: '公司债', value: results.corporateBondApproxPct, note: 'Dmod 5.5；曲线与信用利差共同进入。' },
    { id: 'equity', label: '股权', value: results.equityPriceChangePct, note: 'Gordon D1=5、base k/g=9%/4%。' },
    { id: 'property', label: '收益型物业', value: results.propertyPriceChangePct, note: 'Gordon NOI1=6、base k/g=8%/2%。' },
  ] as const;
  const allValid = assets.every((asset) => asset.value !== null);

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="cross-asset-sensitivity-title">
      <header><div><span>C6 · CROSS-ASSET CLAIM LAB</span><h3 id="cross-asset-sensitivity-title">同一实际曲线冲击只有在冻结现金流与其他溢价后，才能比较各索赔权的局部敏感度</h3></div><p><SourceMarks ids={[14, 15, 35, 50, 56, 60, 63, 65]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-control-grid real-rate-six-controls">
        <label><span>实际基准曲线冲击</span><b>{realCurveShockBp >= 0 ? '+' : ''}{realCurveShockBp}bp</b><input max="200" min="-200" onChange={(event) => setRealCurveShockBp(Number(event.target.value))} step="10" type="range" value={realCurveShockBp} /></label>
        <label><span>公司债信用利差冲击</span><b>{creditSpreadShockBp >= 0 ? '+' : ''}{creditSpreadShockBp}bp</b><input max="200" min="-200" onChange={(event) => setCreditSpreadShockBp(Number(event.target.value))} step="10" type="range" value={creditSpreadShockBp} /></label>
        <label><span>股权风险溢价冲击</span><b>{equityRiskPremiumShockBp >= 0 ? '+' : ''}{equityRiskPremiumShockBp}bp</b><input max="200" min="-200" onChange={(event) => setEquityRiskPremiumShockBp(Number(event.target.value))} step="10" type="range" value={equityRiskPremiumShockBp} /></label>
        <label><span>物业风险溢价冲击</span><b>{propertyRiskPremiumShockBp >= 0 ? '+' : ''}{propertyRiskPremiumShockBp}bp</b><input max="200" min="-200" onChange={(event) => setPropertyRiskPremiumShockBp(Number(event.target.value))} step="10" type="range" value={propertyRiskPremiumShockBp} /></label>
        <label><span>股权长期增长冲击</span><b>{equityGrowthShockBp >= 0 ? '+' : ''}{equityGrowthShockBp}bp</b><input max="200" min="-200" onChange={(event) => setEquityGrowthShockBp(Number(event.target.value))} step="10" type="range" value={equityGrowthShockBp} /></label>
        <label><span>物业 NOI 增长冲击</span><b>{propertyNoiGrowthShockBp >= 0 ? '+' : ''}{propertyNoiGrowthShockBp}bp</b><input max="200" min="-200" onChange={(event) => setPropertyNoiGrowthShockBp(Number(event.target.value))} step="10" type="range" value={propertyNoiGrowthShockBp} /></label>
      </div>
      <div className="real-rate-asset-grid" role="group" aria-label="五类索赔权的冻结模型局部价格变化">{assets.map((asset) => <article className={asset.value === null ? 'invalid' : ''} key={asset.id}><span>{asset.label}</span><b data-testid={`c6-${asset.id}`} data-value={asset.value ?? undefined}>{asset.value === null ? '模型边界失效' : `${asset.value >= 0 ? '+' : ''}${asset.value.toFixed(3)}%`}</b><p>{asset.note}</p></article>)}</div>
      {!allValid ? <p className="real-rate-blocked" role="alert">至少一个 Gordon 分母满足 k≤g；对应股权或物业不再输出伪数值。请缩小增长上修或提高所需回报。</p> : null}
      <div className="precision-note"><span>这不是历史归因</span><p>本实验只改变你所选择的输入，并冻结其余现金流、期权、流动性和主体反馈。现实中的政策或增长新闻会同时改写分子与分母，价格方向必须由完整事件证据识别。</p></div>
      <div className="yield-static-summary"><b>静态摘要：</b>仅把实际曲线提高 50bp 时：名义债约 −3.75%、TIPS −4.25%、公司债 −2.75%、冻结增长的股权 −9.090909%、物业 −7.692308%。系数全为 SYNTHETIC。</div>
      <ResetControl label="C6" onReset={() => { setRealCurveShockBp(50); setCreditSpreadShockBp(0); setEquityRiskPremiumShockBp(0); setPropertyRiskPremiumShockBp(0); setEquityGrowthShockBp(0); setPropertyNoiGrowthShockBp(0); }} />
    </section>
  );
}

type WaccGateKey = 'sameRisk' | 'stableLeverage' | 'currencyMatched' | 'nominalRealMatched' | 'taxShieldUsable';

export function WaccEligibilityLab() {
  const [equityMarketValue, setEquityMarketValue] = useState(600);
  const [debtMarketValue, setDebtMarketValue] = useState(400);
  const [costOfEquityPct, setCostOfEquityPct] = useState(10);
  const [costOfDebtPct, setCostOfDebtPct] = useState(5);
  const [corporateTaxPct, setCorporateTaxPct] = useState(25);
  const [cashFlowType, setCashFlowType] = useState<'FCFF' | 'FCFE'>('FCFF');
  const [gates, setGates] = useState<Record<WaccGateKey, boolean>>({ sameRisk: true, stableLeverage: true, currencyMatched: true, nominalRealMatched: true, taxShieldUsable: true });
  const gateLabels: { id: WaccGateKey; label: string; failure: string }[] = [
    { id: 'sameRisk', label: '项目经营风险与可比资产匹配', failure: '经营风险不匹配' },
    { id: 'stableLeverage', label: '目标市场价值杠杆相对稳定', failure: '杠杆路径不稳定' },
    { id: 'currencyMatched', label: '现金流与资本成本币种一致', failure: '币种不匹配' },
    { id: 'nominalRealMatched', label: '现金流与资本成本名实口径一致', failure: '名实口径不匹配' },
    { id: 'taxShieldUsable', label: '税盾可使用且债务政策持续', failure: '税盾资格不成立' },
  ];
  const failures = [
    ...(equityMarketValue + debtMarketValue > 0 ? [] : ['股权与债务市场价值之和必须大于零']),
    ...(cashFlowType === 'FCFF' ? [] : ['现金流是 FCFE，而 WACC 与 FCFF 配套']),
    ...gateLabels.filter((gate) => !gates[gate.id]).map((gate) => gate.failure),
  ];
  const eligible = failures.length === 0;
  const result = eligible ? waccPct(equityMarketValue, debtMarketValue, costOfEquityPct, costOfDebtPct, corporateTaxPct) : null;

  return (
    <section className="yield-mechanism-lab real-rate-mechanism-lab" aria-labelledby="wacc-eligibility-title">
      <header><div><span>C7 · WACC ELIGIBILITY GATE</span><h3 id="wacc-eligibility-title">先证明现金流、风险、杠杆、税盾与单位相容，再允许 WACC 数字进入估值</h3></div><p><SourceMarks ids={[51, 52, 53, 54, 55]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择现金流类型"><button aria-pressed={cashFlowType === 'FCFF'} className={cashFlowType === 'FCFF' ? 'active' : ''} onClick={() => setCashFlowType('FCFF')} type="button">FCFF · 企业现金流</button><button aria-pressed={cashFlowType === 'FCFE'} className={cashFlowType === 'FCFE' ? 'active' : ''} onClick={() => setCashFlowType('FCFE')} type="button">FCFE · 股权现金流</button></div>
      <div className="yield-control-grid">
        <label><span>股权市场价值 E</span><b>{equityMarketValue}</b><input max="900" min="0" onChange={(event) => setEquityMarketValue(Number(event.target.value))} step="25" type="range" value={equityMarketValue} /></label>
        <label><span>债务市场价值 D</span><b>{debtMarketValue}</b><input max="900" min="0" onChange={(event) => setDebtMarketValue(Number(event.target.value))} step="25" type="range" value={debtMarketValue} /></label>
        <RateInput label="股权必要回报" max={25} min={0} onChange={setCostOfEquityPct} value={costOfEquityPct} />
        <RateInput label="债务成本" max={20} min={0} onChange={setCostOfDebtPct} value={costOfDebtPct} />
        <RateInput label="公司税率" max={60} min={0} onChange={setCorporateTaxPct} step={1} value={corporateTaxPct} />
      </div>
      <fieldset className="yield-model-picker"><legend>WACC 资格门槛</legend>{gateLabels.map((gate) => <label key={gate.id}><input checked={gates[gate.id]} onChange={(event) => setGates((current) => ({ ...current, [gate.id]: event.target.checked }))} type="checkbox" />{gate.label}</label>)}</fieldset>
      {eligible && result !== null ? <output className="wacc-decision eligible" data-testid="c7-wacc" data-value={result}><span>ELIGIBLE · 可作为本题 FCFF 的折现率</span><b>{result.toFixed(3)}%</b><p>E/(D+E)×Re + D/(D+E)×Rd×(1−Tc)</p></output> : <div className="wacc-decision ineligible" role="alert"><span>INELIGIBLE · 停止输出 WACC</span><b>改选与索赔权匹配的方法</b><ul>{failures.map((failure) => <li key={failure}>{failure}</li>)}</ul><p>{cashFlowType === 'FCFE' ? '使用匹配的 cost of equity；' : ''}{!gates.stableLeverage ? '杠杆剧烈变化时优先考虑 APV 或逐期资本成本；' : ''}其他失配应先统一现金流、币种、名实口径与风险。</p></div>}
      <div className="precision-note"><span>防止双重计算</span><p>若税盾已经通过 WACC 的税后债务项进入价值，就不能再在 APV 中把同一税盾加一次。权重使用市场价值，不用历史账面价值替代。</p></div>
      <div className="yield-static-summary"><b>静态摘要：</b>E=600、D=400、Re=10%、Rd=5%、Tc=25%，且 FCFF、风险、杠杆、税盾、币种与名实口径全部合格时，WACC=7.50%。任一门槛失败即停止输出。</div>
      <ResetControl label="C7" onReset={() => { setEquityMarketValue(600); setDebtMarketValue(400); setCostOfEquityPct(10); setCostOfDebtPct(5); setCorporateTaxPct(25); setCashFlowType('FCFF'); setGates({ sameRisk: true, stableLeverage: true, currencyMatched: true, nominalRealMatched: true, taxShieldUsable: true }); }} />
    </section>
  );
}

export function RealRateFixtureAudit() {
  const passed = realRateFixtureAssertions.filter((item) => item.passed).length;
  return <div className="yield-fixture-audit" role="group" aria-label="3.08 冻结机制数值断言"><span>冻结机制数值断言 {passed}/{realRateFixtureAssertions.length}</span><ul>{realRateFixtureAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.id}>{item.passed ? '通过' : '失败'} · {item.statement}</li>)}</ul></div>;
}
