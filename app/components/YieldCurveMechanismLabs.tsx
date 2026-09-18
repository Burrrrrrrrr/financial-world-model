'use client';

import { useEffect, useId, useMemo, useRef, useState } from 'react';
import {
  alternativeDecompositionFixture,
  curveCoordinateFixture,
  curveCoordinateMetrics,
  expectationsTermPremiumFixture,
  holdingPeriodReturnMetrics,
  decompositionEstimatePct,
  preferredHabitatFixture,
  preferredHabitatTermPremiumChangeBp,
  decompositionEstimateRangeBp,
  termPremiumVintageFixtures,
  type HoldingReturnScenarioId,
  type TermPremiumVintage,
  yieldCurveFixtureAssertions,
} from './yieldCurveFixtures';

function ResetControl({ label, onReset }: { label: string; onReset: () => void }) {
  const [armed, setArmed] = useState(false);
  const requestRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const hasOpened = useRef(false);

  useEffect(() => {
    if (armed) {
      hasOpened.current = true;
      confirmRef.current?.focus();
    } else if (hasOpened.current) {
      hasOpened.current = false;
      requestRef.current?.focus();
    }
  }, [armed]);

  if (!armed) return <button className="yield-reset" onClick={() => setArmed(true)} ref={requestRef} type="button">准备重置{label}</button>;

  return (
    <div className="yield-reset-confirm" role="group" aria-label={`确认重置${label}`}>
      <button onClick={() => setArmed(false)} type="button">取消</button>
      <button onClick={() => { onReset(); setArmed(false); }} ref={confirmRef} type="button">确认重置</button>
    </div>
  );
}

function SourceMarks({ ids }: { ids: number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

type CoordinateView = 'discount' | 'zero' | 'forward' | 'par';

const coordinateViews: { id: CoordinateView; label: string; axis: string }[] = [
  { id: 'discount', label: 'Discount factor', axis: '贴现因子（无量纲）' },
  { id: 'zero', label: 'Continuous zero', axis: '连续复利年率（%）' },
  { id: 'forward', label: 'Interval forward', axis: '区间连续远期率（%）' },
  { id: 'par', label: 'Annual par coupon', axis: '年付息 par coupon（%）' },
];

function coordinateSeries(view: CoordinateView) {
  if (view === 'discount') return curveCoordinateFixture.discountFactors.map((value, index) => ({ x: curveCoordinateFixture.maturitiesYears[index], label: `${index + 1}Y`, value }));
  if (view === 'zero') return curveCoordinateMetrics.zeroRateContinuousPct.map((value, index) => ({ x: curveCoordinateFixture.maturitiesYears[index], label: `${index + 1}Y`, value }));
  if (view === 'forward') return curveCoordinateMetrics.intervalForwardRatePct.map((value, index) => ({ x: index + 1.5, label: `[${index + 1}Y,${index + 2}Y]`, value }));
  return [{ x: 3, label: '3Y par', value: curveCoordinateMetrics.threeYearAnnualParCouponPct }];
}

export function YieldCurveCoordinateLab() {
  const [view, setView] = useState<CoordinateView>('discount');
  const svgTitleId = useId();
  const svgDescId = useId();
  const series = coordinateSeries(view);
  const values = series.map((point) => point.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = Math.max(max - min, view === 'discount' ? 0.02 : 0.25);
  const selected = coordinateViews.find((item) => item.id === view) ?? coordinateViews[0];
  const x = (maturity: number) => 70 + (maturity / 3) * 500;
  const y = (value: number) => 250 - ((value - min) / span) * 170;

  return (
    <section className="yield-mechanism-lab" aria-labelledby="curve-coordinate-title">
      <header><div><span>C1 · SYNTHETIC COORDINATE LAB</span><h3 id="curve-coordinate-title">同一组贴现价格可转成 zero、区间 forward 和 par，但四种坐标不能混用</h3></div><p><SourceMarks ids={[1, 3, 7, 10]} /></p></header>
      <div className="yield-view-picker" role="group" aria-label="选择曲线坐标">
        {coordinateViews.map((item) => <button aria-pressed={view === item.id} className={view === item.id ? 'active' : ''} key={item.id} onClick={() => setView(item.id)} type="button"><b>{item.label}</b><span>{item.axis}</span></button>)}
      </div>
      <div className="yield-chart-grid">
        <div className="yield-svg-wrap" role="group" tabIndex={0} aria-label={`${selected.label}；${series.map((point) => `${point.label} ${point.value.toFixed(6)}`).join('；')}`}>
          <svg className="yield-lab-svg" role="img" viewBox="0 0 620 300" aria-labelledby={`${svgTitleId} ${svgDescId}`}>
            <title id={svgTitleId}>{`${selected.label} 坐标图`}</title>
            <desc id={svgDescId}>每个点由同一组贴现因子计算。Forward 点位于区间中点，标签明确写出左右端点；四种坐标使用各自纵轴，不直接比高低。</desc>
            <line className="yield-axis" x1="70" x2="570" y1="250" y2="250" />
            <line className="yield-axis" x1="70" x2="70" y1="55" y2="250" />
            <path className="yield-series-line" d={series.map((point, index) => `${index ? 'L' : 'M'} ${x(point.x)} ${y(point.value)}`).join(' ')} />
            {series.map((point) => <g key={point.label}><circle className="yield-data-point" cx={x(point.x)} cy={y(point.value)} data-testid={`c1-${view}-${point.label}`} data-value={point.value} data-x-value={point.x} r="7" /><text x={x(point.x)} y="274" textAnchor="middle">{point.label}</text><text x={x(point.x)} y={Math.max(45, y(point.value) - 12)} textAnchor="middle">{view === 'discount' ? point.value.toFixed(3) : `${point.value.toFixed(3)}%`}</text></g>)}
            <text className="yield-axis-title" x="320" y="296" textAnchor="middle">期限（年）</text>
            <text className="yield-axis-title" transform="translate(18 150) rotate(-90)" textAnchor="middle">{selected.axis}</text>
          </svg>
        </div>
        <div className="yield-readout" aria-live="polite"><span>{selected.label}</span><b>{selected.axis}</b><p>{view === 'forward' ? '远期率属于 [1Y,2Y] 和 [2Y,3Y] 区间，不是 1.5Y/2.5Y 的 spot 点。' : '这些数字是价格的坐标转换，本身尚未解释预期或期限溢价。'}</p></div>
      </div>
      <div className="yield-data-table-wrap" role="region" tabIndex={0} aria-label="C1 冻结数值表">
        <table className="yield-data-table"><caption>冻结贴现因子与所有派生坐标</caption><thead><tr><th scope="col">对象</th><th scope="col">1Y / [1,2]</th><th scope="col">2Y / [2,3]</th><th scope="col">3Y</th></tr></thead><tbody>
          <tr><th scope="row">Discount factor</th>{curveCoordinateFixture.discountFactors.map((value) => <td data-value={value} key={value}>{value}</td>)}</tr>
          <tr><th scope="row">Continuous zero</th>{curveCoordinateMetrics.zeroRateContinuousPct.map((value) => <td data-value={value} key={value}>{value.toFixed(12)}%</td>)}</tr>
          <tr><th scope="row">Interval forward</th><td data-value={curveCoordinateMetrics.intervalForwardRatePct[0]}>[1Y,2Y] {curveCoordinateMetrics.intervalForwardRatePct[0].toFixed(12)}%</td><td data-value={curveCoordinateMetrics.intervalForwardRatePct[1]}>[2Y,3Y] {curveCoordinateMetrics.intervalForwardRatePct[1].toFixed(12)}%</td><td>—</td></tr>
          <tr><th scope="row">Annual-pay par coupon</th><td>—</td><td>—</td><td data-value={curveCoordinateMetrics.threeYearAnnualParCouponPct}>{curveCoordinateMetrics.threeYearAnnualParCouponPct.toFixed(12)}%</td></tr>
        </tbody></table>
      </div>
      <div className="yield-static-summary"><b>静态摘要：</b>D=[.97,.935,.89]；continuous zero=[3.045920748471,3.360437484673,3.884460541865]%；forward [1,2]=3.674954220874%、[2,3]=4.932506656250%；3Y annual par=3.935599284436%。</div>
      <ResetControl label="C1" onReset={() => setView('discount')} />
    </section>
  );
}

export function ExpectationsTermPremiumLab() {
  const [maturityIndex, setMaturityIndex] = useState(4);
  const [expectedPathShockBp, setExpectedPathShockBp] = useState(0);
  const [termPremiumShockBp, setTermPremiumShockBp] = useState(0);
  const [showAlternative, setShowAlternative] = useState(false);
  const titleId = useId();
  const descId = useId();
  const expectedAveragePct = expectationsTermPremiumFixture.expectedAverageShortRatePct[maturityIndex] + expectedPathShockBp / 100;
  const estimatedTermPremiumPct = expectationsTermPremiumFixture.estimatedYieldTermPremiumPct[maturityIndex] + termPremiumShockBp / 100;
  const scenarioImpliedYieldPct = expectedAveragePct + estimatedTermPremiumPct;
  const alternativeExpected = alternativeDecompositionFixture.expectedAverageShortRatePct[maturityIndex] + expectedPathShockBp / 100;
  const alternativePremium = alternativeDecompositionFixture.estimatedYieldTermPremiumPct[maturityIndex] + termPremiumShockBp / 100;
  const expectedHeight = Math.max(0, expectedAveragePct) * 40;
  const premiumHeight = Math.abs(estimatedTermPremiumPct) * 40;
  const premiumY = estimatedTermPremiumPct >= 0
    ? 255 - Math.max(0, scenarioImpliedYieldPct) * 40
    : 255 - expectedHeight;

  return (
    <section className="yield-mechanism-lab" aria-labelledby="expectations-premium-title">
      <header><div><span>C2 · SYNTHETIC DECOMPOSITION LAB</span><h3 id="expectations-premium-title">观测收益率是价格坐标；预期路径与期限溢价的分解必须绑定模型和约定</h3></div><p><SourceMarks ids={[19, 20, 30, 31, 34, 60]} /></p></header>
      <div className="yield-maturity-picker" role="group" aria-label="选择分解期限">{expectationsTermPremiumFixture.maturitiesYears.map((maturity, index) => <button aria-pressed={index === maturityIndex} className={index === maturityIndex ? 'active' : ''} key={maturity} onClick={() => setMaturityIndex(index)} type="button">{maturity}Y</button>)}</div>
      <div className="yield-control-grid">
        <label><span>预期平均短率情景移动</span><b>{expectedPathShockBp >= 0 ? '+' : ''}{expectedPathShockBp}bp</b><input max="75" min="-75" onChange={(event) => setExpectedPathShockBp(Number(event.target.value))} step="5" type="range" value={expectedPathShockBp} /></label>
        <label><span>估计期限溢价情景移动</span><b>{termPremiumShockBp >= 0 ? '+' : ''}{termPremiumShockBp}bp</b><input max="75" min="-75" onChange={(event) => setTermPremiumShockBp(Number(event.target.value))} step="5" type="range" value={termPremiumShockBp} /></label>
      </div>
      <div className="yield-chart-grid">
        <div className="yield-svg-wrap" role="group" tabIndex={0} aria-label={`${expectationsTermPremiumFixture.maturitiesYears[maturityIndex]}Y：预期平均 ${expectedAveragePct.toFixed(3)}%，估计期限溢价 ${estimatedTermPremiumPct.toFixed(3)}%，情景隐含加法收益率 ${scenarioImpliedYieldPct.toFixed(3)}%`}>
          <svg className="yield-lab-svg" role="img" viewBox="0 0 620 300" aria-labelledby={`${titleId} ${descId}`}>
            <title id={titleId}>预期平均短率与估计期限溢价的加法分解</title>
            <desc id={descId}>柱子下段是预期平均短率；斜纹段是模型估计或加法残差期限溢价，为正时向上叠加，为负时从预期端点向下扣减。横线是两者之和。Jensen 与未单列的便利收益已按冻结约定包含在残差中，不重复加总。</desc>
            <line className="yield-axis" x1="80" x2="540" y1="255" y2="255" />
            <rect className="yield-expectation-bar" data-testid="c2-expected" data-value={expectedAveragePct} height={expectedHeight} width="130" x="245" y={255 - expectedHeight} />
            <rect className={estimatedTermPremiumPct >= 0 ? 'yield-premium-bar' : 'yield-premium-bar negative'} data-testid="c2-premium" data-value={estimatedTermPremiumPct} height={premiumHeight} width="130" x="245" y={premiumY} />
            <line className="yield-observed-marker" data-testid="c2-scenario-marker" data-value={scenarioImpliedYieldPct} x1="225" x2="395" y1={255 - Math.max(0, scenarioImpliedYieldPct) * 40} y2={255 - Math.max(0, scenarioImpliedYieldPct) * 40} />
            <text x="310" y="278" textAnchor="middle">{expectationsTermPremiumFixture.maturitiesYears[maturityIndex]}Y</text>
            <text x="310" y={Math.max(22, 245 - scenarioImpliedYieldPct * 40)} textAnchor="middle" data-testid="c2-scenario" data-value={scenarioImpliedYieldPct}>{scenarioImpliedYieldPct.toFixed(3)}%</text>
          </svg>
        </div>
        <div className="yield-readout" aria-live="polite"><span>Scenario-implied additive yield</span><b data-testid="c2-sum" data-value={scenarioImpliedYieldPct}>{expectedAveragePct.toFixed(3)}% + {estimatedTermPremiumPct.toFixed(3)}% = {scenarioImpliedYieldPct.toFixed(3)}%</b><p>滑杆生成的是教学情景，不会改写历史观测值。<code>jensenConvexityConvention= included-in-estimated-term-premium</code>；上段不是 observed/true TP，也不再叠加 liquidity/safety wedge。</p></div>
      </div>
      <button aria-pressed={showAlternative} className="yield-toggle" onClick={() => setShowAlternative((value) => !value)} type="button">{showAlternative ? '隐藏' : '显示'}同一情景隐含加法收益率的另一分解</button>
      {showAlternative ? <div className="precision-note" role="status"><span>分解非唯一</span><p>{expectationsTermPremiumFixture.maturitiesYears[maturityIndex]}Y 在另一 synthetic 约定下为 {alternativeExpected.toFixed(3)}% + {alternativePremium.toFixed(3)}% = {(alternativeExpected + alternativePremium).toFixed(3)}%。{alternativeDecompositionFixture.interpretation}</p></div> : null}
      <div className="yield-static-summary"><b>静态摘要：</b>5Y 基准为 expected average 3.50% + estimated TP .50% = observed yield 4.00%；另一同值分解为 3.25% + .75%。</div>
      <ResetControl label="C2" onReset={() => { setMaturityIndex(4); setExpectedPathShockBp(0); setTermPremiumShockBp(0); setShowAlternative(false); }} />
    </section>
  );
}

export function HoldingPeriodReturnLab() {
  const [scenarioId, setScenarioId] = useState<HoldingReturnScenarioId>('M5');
  const [returnConvention, setReturnConvention] = useState<'log' | 'simple'>('log');
  const metrics = holdingPeriodReturnMetrics(scenarioId);
  const fixture = scenarioId === 'M5' ? { buyPrice: 94, salePrice: 97, shortGrossReturn: 1.03 } : { buyPrice: 91, salePrice: 95, shortGrossReturn: 1.025 };
  const resultBp = returnConvention === 'log' ? metrics.logExcessReturnBp : metrics.simpleExcessReturnBp;
  const validGrossInputs = fixture.buyPrice > 0 && fixture.salePrice > 0 && fixture.shortGrossReturn > 0;

  return (
    <section className="yield-mechanism-lab" aria-labelledby="holding-return-title">
      <header><div><span>C3 · SYNTHETIC HOLDING-PERIOD LAB</span><h3 id="holding-return-title">买入时 YTM 不是提前卖出回报；下一期剩余曲线决定售价</h3></div><p><SourceMarks ids={[10, 12, 14, 16]} /></p></header>
      <div className="yield-view-picker" role="group" aria-label="选择回报情景"><button aria-pressed={scenarioId === 'M5'} className={scenarioId === 'M5' ? 'active' : ''} onClick={() => setScenarioId('M5')} type="button">M5 · 94→97 / 1.03</button><button aria-pressed={scenarioId === 'K5'} className={scenarioId === 'K5' ? 'active' : ''} onClick={() => setScenarioId('K5')} type="button">K5 · 91→95 / 1.025</button></div>
      <div className="yield-view-picker" role="group" aria-label="选择回报口径"><button aria-pressed={returnConvention === 'log'} className={returnConvention === 'log' ? 'active' : ''} onClick={() => setReturnConvention('log')} type="button">Log excess return</button><button aria-pressed={returnConvention === 'simple'} className={returnConvention === 'simple' ? 'active' : ''} onClick={() => setReturnConvention('simple')} type="button">Simple excess return</button></div>
      <div className="holding-return-chain" role="group" aria-label={`${scenarioId}：买入 ${fixture.buyPrice}，卖出 ${fixture.salePrice}，短债 gross ${fixture.shortGrossReturn}，${returnConvention} 超额回报 ${resultBp.toFixed(9)} 基点`}>
        <article><span>t · dirty purchase price</span><b data-value={fixture.buyPrice}>{fixture.buyPrice}</b><p>剩余两年 zero，无中间 coupon。</p></article>
        <article><span>t+1 · dirty sale price</span><b data-value={fixture.salePrice}>{fixture.salePrice}</b><p>剩余一年 zero，实际售价由新曲线决定。</p></article>
        <article><span>Matched short gross</span><b data-value={fixture.shortGrossReturn}>{fixture.shortGrossReturn}</b><p>持有期与融资基准一致。</p></article>
        <article className="result"><span>{returnConvention} excess return</span><b data-testid="c3-result" data-value={resultBp}>{resultBp.toFixed(9)}bp</b><p>{returnConvention === 'log' ? 'ln(P1/P0)−ln(Rshort)' : '(P1/P0)−Rshort'}。</p></article>
      </div>
      {!validGrossInputs ? <p role="alert">对数输入必须严格为正。</p> : null}
      <div className="yield-static-summary"><b>静态摘要：</b>M5 log excess=18.573939918bp，simple excess=19.148936170bp；K5 log excess=183.247724933bp，simple excess=189.560439560bp。</div>
      <ResetControl label="C3" onReset={() => { setScenarioId('M5'); setReturnConvention('log'); }} />
    </section>
  );
}

export function PreferredHabitatDurationLab() {
  const [selectedBucket, setSelectedBucket] = useState(2);
  const [supplyShock, setSupplyShock] = useState(-10);
  const [capacity, setCapacity] = useState(1);
  const [kappa, setKappa] = useState(1);
  const [showSignaling, setShowSignaling] = useState(false);
  const titleId = useId();
  const descId = useId();
  const changes = preferredHabitatTermPremiumChangeBp(selectedBucket, supplyShock, capacity, kappa);
  const scale = 1.6;

  return (
    <section className="yield-mechanism-lab" aria-labelledby="habitat-duration-title">
      <header><div><span>C4 · SYNTHETIC PREFERRED-HABITAT LAB</span><h3 id="habitat-duration-title">期限特定供给冲击与套利者风险承载能力互动，再经邻近期限传播</h3></div><p><SourceMarks ids={[44, 45, 46, 48, 49, 53, 54]} /></p></header>
      <div className="yield-maturity-picker" role="group" aria-label="选择净久期供给冲击所在期限">{preferredHabitatFixture.maturitiesYears.map((maturity, index) => <button aria-pressed={index === selectedBucket} className={index === selectedBucket ? 'active' : ''} key={maturity} onClick={() => setSelectedBucket(index)} type="button">{maturity}Y</button>)}</div>
      <div className="yield-control-grid">
        <label><span>套利者需吸收的净久期供给 ΔQ</span><b>{supplyShock}</b><input max="15" min="-15" onChange={(event) => setSupplyShock(Number(event.target.value))} step="1" type="range" value={supplyShock} /></label>
        <label><span>风险承载能力（无量纲）</span><b>{capacity.toFixed(1)}</b><input max="2" min="0.5" onChange={(event) => setCapacity(Number(event.target.value))} step="0.1" type="range" value={capacity} /></label>
        <label><span>κ（bp / normalized supply unit）</span><b>{kappa.toFixed(1)}</b><input max="2" min="0.5" onChange={(event) => setKappa(Number(event.target.value))} step="0.1" type="range" value={kappa} /></label>
      </div>
      <div className="yield-chart-grid">
        <div className="yield-svg-wrap" role="group" tabIndex={0} aria-label={`估计期限溢价变化：${preferredHabitatFixture.maturitiesYears.map((maturity, index) => `${maturity}Y ${changes[index].toFixed(2)}bp`).join('；')}`}>
          <svg className="yield-lab-svg habitat-bars" role="img" viewBox="0 0 620 300" aria-labelledby={`${titleId} ${descId}`}>
            <title id={titleId}>净久期供给冲击的跨期限传播</title><desc id={descId}>四根柱从同一零轴出发；负值向下，正值向上。矩阵行是受影响期限，列是冲击期限，数值由同一矩阵乘法函数生成。</desc>
            <line className="yield-zero-axis" x1="70" x2="570" y1="140" y2="140" />
            {changes.map((value, index) => { const height = Math.abs(value) * scale; const y = value >= 0 ? 140 - height : 140; return <g key={preferredHabitatFixture.maturitiesYears[index]}><rect className={value >= 0 ? 'habitat-positive' : 'habitat-negative'} data-testid={`c4-bar-${preferredHabitatFixture.maturitiesYears[index]}`} data-value={value} height={height} width="68" x={92 + index * 125} y={y} /><text x={126 + index * 125} y="258" textAnchor="middle">{preferredHabitatFixture.maturitiesYears[index]}Y</text><text x={126 + index * 125} y={value >= 0 ? Math.max(32, y - 8) : Math.min(276, 154 + height)} textAnchor="middle">{value.toFixed(2)}bp</text></g>; })}
          </svg>
        </div>
        <div className="yield-readout" aria-live="polite"><span>冻结教学算式</span><b>ΔTPₘ = κ × Σⱼ WₘⱼΔQⱼ / capacity</b><p><code>κ</code> 的单位是 bp/标准化净久期供给单位；ΔQ 是套利者需要吸收的净久期供给，负号表示需吸收的供给减少。</p></div>
      </div>
      <div className="yield-data-table-wrap" role="region" tabIndex={0} aria-label="Preferred-habitat 冻结传播矩阵"><table className="yield-data-table"><caption>传播矩阵 W：行=受影响期限，列=冲击期限；全部为 synthetic</caption><thead><tr><th scope="col">受影响 \ 冲击</th>{preferredHabitatFixture.maturitiesYears.map((maturity) => <th scope="col" key={maturity}>{maturity}Y</th>)}</tr></thead><tbody>{preferredHabitatFixture.spilloverMatrix.map((row, rowIndex) => <tr key={preferredHabitatFixture.maturitiesYears[rowIndex]}><th scope="row">{preferredHabitatFixture.maturitiesYears[rowIndex]}Y</th>{row.map((value, columnIndex) => <td data-column-maturity={preferredHabitatFixture.maturitiesYears[columnIndex]} data-row-maturity={preferredHabitatFixture.maturitiesYears[rowIndex]} data-value={value} key={`${rowIndex}-${columnIndex}`}>{value.toFixed(2)}</td>)}</tr>)}</tbody></table></div>
      <button aria-pressed={showSignaling} className="yield-toggle" onClick={() => setShowSignaling((value) => !value)} type="button">{showSignaling ? '隐藏' : '显示'} signaling 通道（只是独立视觉层）</button>
      {showSignaling ? <div className="precision-note" role="status"><span>未进入供给算式</span><p>公告还可以改变预期政策路径；本实验为防止重复计算，没有把 signaling 加入 ΔTP 矩阵。</p></div> : null}
      <div className="yield-static-summary"><b>静态摘要：</b>10Y 桶 ΔQ=−10、κ=1bp/unit、capacity=1 时，ΔTP=[−.5,−2.5,−10,−2.5]bp。</div>
      <ResetControl label="C4" onReset={() => { setSelectedBucket(2); setSupplyShock(-10); setCapacity(1); setKappa(1); setShowSignaling(false); }} />
    </section>
  );
}

export function TermPremiumVintageLab() {
  const [vintage, setVintage] = useState<TermPremiumVintage>('V1');
  const [visibleIds, setVisibleIds] = useState<string[]>(['ACM', 'KW', 'Survey residual']);
  const models = termPremiumVintageFixtures[vintage];
  const range = decompositionEstimateRangeBp(vintage, visibleIds);
  const titleId = useId();
  const descId = useId();
  const toggleModel = (id: string) => setVisibleIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  const scaleX = (value: number) => 90 + ((value - 40) / 60) * 430;

  return (
    <section className="yield-mechanism-lab" aria-labelledby="term-premium-vintage-title">
      <header><div><span>C5 · SYNTHETIC VINTAGE LAB</span><h3 id="term-premium-vintage-title">市场收益率不变，模型、调查约束、样本或 vintage 仍可重写分解输出</h3></div><p><SourceMarks ids={[19, 30, 31, 33, 34, 35, 43, 59, 60]} /></p></header>
      <div className="yield-view-picker" role="group" aria-label="选择分解 vintage"><button aria-pressed={vintage === 'V1'} className={vintage === 'V1' ? 'active' : ''} onClick={() => setVintage('V1')} type="button">V1</button><button aria-pressed={vintage === 'V2'} className={vintage === 'V2' ? 'active' : ''} onClick={() => setVintage('V2')} type="button">V2</button></div>
      <fieldset className="yield-model-picker"><legend>选择纳入敏感性包络的分解输出（至少两个才计算）</legend>{['ACM', 'KW', 'Survey residual'].map((id) => <label key={id}><input checked={visibleIds.includes(id)} onChange={() => toggleModel(id)} type="checkbox" />{id}</label>)}</fieldset>
      <div className="yield-svg-wrap" role="group" tabIndex={0} aria-label={range ? `${vintage}：最小 ${range.minBp.toFixed(1)}bp，中位 ${range.medianBp.toFixed(1)}bp，最大 ${range.maxBp.toFixed(1)}bp，宽度 ${range.widthBp.toFixed(1)}bp` : `${vintage}：可见分解输出少于两个，敏感性包络不可用`}>
        <svg className="yield-lab-svg" role="img" viewBox="0 0 620 240" aria-labelledby={`${titleId} ${descId}`}>
          <title id={titleId}>分解估计敏感性范围与 vintage</title><desc id={descId}>每个分解输出点均使用同一横轴，并保留模型定义期限溢价或调查加法残差的种类。范围线从最小值到最大值，菱形标记数值排序后的中位数；它不是期限溢价置信区间。</desc>
          <line className="yield-axis" x1="90" x2="520" y1="170" y2="170" />
          {[40, 60, 80, 100].map((tick) => <g key={tick}><line className="yield-grid-line" x1={scaleX(tick)} x2={scaleX(tick)} y1="45" y2="180" /><text x={scaleX(tick)} y="202" textAnchor="middle">{tick}bp</text></g>)}
          {range ? <><line className="vintage-range-line" data-testid="c5-range" data-max={range.maxBp} data-min={range.minBp} x1={scaleX(range.minBp)} x2={scaleX(range.maxBp)} y1="92" y2="92" /><polygon className="vintage-median" data-testid="c5-median" data-value={range.medianBp} points={`${scaleX(range.medianBp)},82 ${scaleX(range.medianBp)+9},92 ${scaleX(range.medianBp)},102 ${scaleX(range.medianBp)-9},92`} /></> : null}
          {models.filter((model) => visibleIds.includes(model.id)).map((model, index) => { const value = decompositionEstimatePct(model) * 100; return <g key={model.id}><circle className="yield-data-point" cx={scaleX(value)} cy={125 + index * 18} data-testid={`c5-model-${model.id}`} data-value={value} r="6" /><text x="84" y={130 + index * 18} textAnchor="end">{model.id}</text></g>; })}
        </svg>
      </div>
      <div className="framework-comparison" role="group" aria-label={`${vintage} 当前纳入的分解输出卡`}>{models.filter((model) => visibleIds.includes(model.id)).map((model) => { const premium = decompositionEstimatePct(model); return <article key={model.id}><header><h3>{model.id}</h3><p>SYNTHETIC</p></header><dl><div><dt>Observed 10Y yield</dt><dd>4.00%</dd></div><div><dt>Expected average</dt><dd>{model.expectedAverageShortRatePct.toFixed(2)}%</dd></div><div><dt>{'estimatedYieldTermPremiumPct' in model ? 'Estimated TP' : 'Additive residual TP'}</dt><dd>{premium.toFixed(2)}%</dd></div><div><dt>Estimate kind</dt><dd>{'estimatedYieldTermPremiumPct' in model ? 'modelDefinedTermPremium' : 'additiveResidual'}</dd></div><div><dt>Jensen / convexity</dt><dd>{model.jensenConvexityConvention}</dd></div></dl></article>; })}</div>
      <output className="yield-range-output" data-testid="c5-summary" data-min={range?.minBp} data-median={range?.medianBp} data-max={range?.maxBp} data-width={range?.widthBp}>{range ? `${vintage} selected decomposition outputs: min ${range.minBp.toFixed(1)}bp · numeric median ${range.medianBp.toFixed(1)}bp · max ${range.maxBp.toFixed(1)}bp · width ${range.widthBp.toFixed(1)}bp；敏感性包络，不是 TP 置信区间` : '可见分解输出少于两个：不计算范围，也不以单一输出冒充不确定性。'}</output>
      <div className="yield-static-summary"><b>静态摘要：</b>observed 10Y yield 在 V1/V2 都为 4%；所选分解输出的敏感性包络在 V1 为 65/75/90bp、width 25bp，在 V2 为 55/70/75bp、width 20bp。它混合了两类明示 estimand，不是 TP 置信区间；分解修订也不是市场变动。</div>
      <ResetControl label="C5" onReset={() => { setVintage('V1'); setVisibleIds(['ACM', 'KW', 'Survey residual']); }} />
    </section>
  );
}

export function YieldCurveFixtureAudit() {
  const passed = useMemo(() => yieldCurveFixtureAssertions.filter((assertion) => assertion.passed).length, []);
  return <div className="yield-fixture-audit" role="group" aria-label={`冻结数值断言 ${passed}/${yieldCurveFixtureAssertions.length} 通过`}><span>冻结数值断言 {passed}/{yieldCurveFixtureAssertions.length}</span><ul>{yieldCurveFixtureAssertions.map((assertion) => <li className={assertion.passed ? 'passed' : ''} key={assertion.id}>{assertion.passed ? '通过' : '失败'} · {assertion.statement}</li>)}</ul></div>;
}
