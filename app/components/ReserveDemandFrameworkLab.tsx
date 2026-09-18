'use client';

import { useId, useMemo, useState } from 'react';
import {
  frameworkAssertions,
  frameworkCurvePoints,
  frameworkMetrics,
  frameworkModes,
  type FrameworkMode,
} from './policyImplementationFixtures';

const regionLabels: Record<string, string> = {
  scarce: 'scarce：边际短缺风险高，数量变化影响大',
  ample: 'ample：仍可控但曲线斜率并非零',
  abundant: 'abundant：接近平坦区，小数量变化影响较小',
};

function x(q: number) { return 70 + ((q - 10) / 90) * 560; }
function y(spread: number) { return 290 - (spread / 90) * 250; }

export default function ReserveDemandFrameworkLab() {
  const [mode, setMode] = useState<FrameworkMode>('corridor');
  const [reserveSupply, setReserveSupply] = useState(50);
  const [demandShift, setDemandShift] = useState(0);
  const [grossArbitrage, setGrossArbitrage] = useState(8);
  const [intermediationCost, setIntermediationCost] = useState(10);
  const supplyId = useId();
  const shiftId = useId();
  const grossId = useId();
  const costId = useId();
  const selectedMode = frameworkModes.find((item) => item.id === mode) ?? frameworkModes[0];
  const metrics = frameworkMetrics(mode, reserveSupply, demandShift);
  const netArbitrage = grossArbitrage - intermediationCost;
  const curvePath = useMemo(() => frameworkCurvePoints(mode, demandShift).map((point, index) => (
    `${index === 0 ? 'M' : 'L'} ${x(point.reserveSupply).toFixed(2)} ${y(point.marginalSpreadBp).toFixed(2)}`
  )).join(' '), [demandShift, mode]);
  const passedAssertions = frameworkAssertions.filter((item) => item.passed).length;

  return (
    <section className="reserve-framework-lab" aria-labelledby="reserve-framework-title">
      <div className="reserve-framework-head">
        <div>
          <span>SYNTHETIC · FROZEN DEMAND CURVE + INTERPRETATION LAYERS</span>
          <h3 id="reserve-framework-title">先用同一条需求曲线观察数量—价格关系，再把四种制度规则作为解释层对照；按钮本身不求解均衡供给</h3>
        </div>
        <p>教学基础函数固定为 <code>baseSpread=2+78/[1+exp((Q−45−shift)/7)]</code> bp。Q 始终由学习者外生选择；除 tiered 的边际计息惩罚外，模式按钮只切换制度解释，不估计任何央行的真实供给均衡。tiered 模式下，曲线和当前点都按 <code>i_ON−i_R,marg = baseSpread + marginal remuneration penalty</code> 绘制。</p>
      </div>

      <div className="reserve-framework-mode" role="group" aria-label="选择实施框架解释卡；除分层计息外不改变数值求解">
        {frameworkModes.map((item) => (
          <button aria-pressed={mode === item.id} className={mode === item.id ? 'active' : ''} key={item.id} onClick={() => setMode(item.id)} type="button">
            <b>{item.label}</b><span>{item.supplyRule}</span>
          </button>
        ))}
      </div>

      <div className="reserve-framework-controls">
        <label htmlFor={supplyId}><span>用于比较的外生准备金情景 Q（本图不求解 demand-driven 的内生取用量）</span><b>{reserveSupply}</b><input id={supplyId} max="90" min="15" onChange={(event) => setReserveSupply(Number(event.target.value))} step="1" type="range" value={reserveSupply} /></label>
        <label htmlFor={shiftId}><span>准备金需求平移 shift</span><b>{demandShift > 0 ? `+${demandShift}` : demandShift}</b><input id={shiftId} max="15" min="-15" onChange={(event) => setDemandShift(Number(event.target.value))} step="5" type="range" value={demandShift} /></label>
      </div>

      <div className="reserve-framework-main">
        <div className="reserve-framework-svg-wrap" tabIndex={0} role="group" aria-label={`准备金供给 ${reserveSupply}，需求平移 ${demandShift}，边际 spread ${metrics.marginalSpreadBp.toFixed(1)} 基点，处于 ${metrics.region} 区域`}>
          <svg className="reserve-framework-svg" role="img" viewBox="0 0 680 340" aria-labelledby="reserve-curve-svg-title reserve-curve-svg-desc">
            <title id="reserve-curve-svg-title">非线性准备金需求曲线与当前供给</title>
            <desc id="reserve-curve-svg-desc">纵轴是隔夜率相对边际准备金报酬的基点差，横轴是标准化准备金数量。当前供给圆点与文字读数使用同一公式；tiered 模式在 Q=55 处以垂直线段表示配额右侧的边际计息阶跃。</desc>
            <line x1="70" x2="630" y1="290" y2="290" />
            <line x1="70" x2="70" y1="30" y2="290" />
            {[0, 20, 40, 60, 80].map((tick) => <g key={tick}><line className="grid" x1="70" x2="630" y1={y(tick)} y2={y(tick)} /><text x="58" y={y(tick) + 5} textAnchor="end">{tick}</text></g>)}
            {[10, 30, 50, 70, 90].map((tick) => <g key={tick}><line className="grid" x1={x(tick)} x2={x(tick)} y1="30" y2="290" /><text x={x(tick)} y="313" textAnchor="middle">{tick}</text></g>)}
            <rect className="region scarce" x={x(10)} y="30" width={x(35 + demandShift) - x(10)} height="260" />
            <rect className="region ample" x={x(35 + demandShift)} y="30" width={x(70 + demandShift) - x(35 + demandShift)} height="260" />
            <rect className="region abundant" x={x(70 + demandShift)} y="30" width={x(100) - x(70 + demandShift)} height="260" />
            <path className="demand-curve" d={curvePath} />
            <line className="supply-line" x1={x(reserveSupply)} x2={x(reserveSupply)} y1="30" y2="290" />
            <circle className="supply-point" cx={x(reserveSupply)} cy={y(metrics.marginalSpreadBp)} r="7" />
            <text className="axis-title" x="350" y="334" textAnchor="middle">标准化准备金数量 Q</text>
            <text className="axis-title vertical" transform="translate(18 170) rotate(-90)" textAnchor="middle">i_ON − i_R,marg（bp）</text>
          </svg>
        </div>

        <div className="reserve-framework-readout" aria-live="polite">
          <span>{selectedMode.label}</span>
          <b>{metrics.marginalSpreadBp.toFixed(1)}bp</b>
          <p>{regionLabels[metrics.region]}</p>
          <dl>
            <div><dt>同一曲线的基础 spread</dt><dd>{metrics.baseSpreadBp.toFixed(1)}bp</dd></div>
            <div><dt>边际计息惩罚</dt><dd>{metrics.marginalRemunerationPenaltyBp.toFixed(1)}bp</dd></div>
            <div><dt>平均计息惩罚</dt><dd>{metrics.averageRemunerationPenaltyBp.toFixed(1)}bp</dd></div>
          </dl>
          <p><b>供给规则：</b>{selectedMode.supplyRule}</p>
          <p><b>计息规则：</b>{selectedMode.remunerationRule}</p>
          <p><b>本按钮的数值角色：</b>{selectedMode.numericRole}</p>
        </div>
      </div>

      <div className="reserve-leaky-test">
        <div>
          <span>SOFT-BOUND TEST</span>
          <h4>没有存款便利准入的贷款人面对银行中介成本时，表面地板会不会“漏”？</h4>
          <p>这里只检验可执行净套利的符号；期限、信用与统计对象已假定匹配。</p>
        </div>
        <div className="reserve-leaky-controls">
          <label htmlFor={grossId}><span>牌价与市场率毛差</span><b>{grossArbitrage}bp</b><input id={grossId} max="20" min="0" onChange={(event) => setGrossArbitrage(Number(event.target.value))} type="range" value={grossArbitrage} /></label>
          <label htmlFor={costId}><span>可执行中介成本 κ</span><b>{intermediationCost}bp</b><input id={costId} max="20" min="0" onChange={(event) => setIntermediationCost(Number(event.target.value))} type="range" value={intermediationCost} /></label>
        </div>
        <output className={netArbitrage > 0 ? 'profitable' : 'blocked'}>净套利 = {grossArbitrage}−{intermediationCost} = {netArbitrage > 0 ? '+' : ''}{netArbitrage}bp；{netArbitrage > 0 ? '存在收敛激励，但容量仍可能有限。' : netArbitrage === 0 ? '恰好无差异，不能假定无限容量。' : '套利不可执行，市场可以低于表面地板。'}</output>
      </div>

      <div className="reserve-framework-audit">
        <span>固定行为断言 {passedAssertions}/{frameworkAssertions.length}</span>
        <ul>{frameworkAssertions.map((item) => <li key={item.id} className={item.passed ? 'passed' : ''}>{item.passed ? '通过' : '失败'} · {item.statement}</li>)}</ul>
      </div>
      <p className="reserve-framework-caveat"><b>解释边界：</b>scarce／ample／abundant 是本图的经济区域标签，不是各央行官方术语的统一翻译。模式按钮把同一组 Q 与 shift 放进不同制度语境；除 tiered 外，它不进入数值方程，因此不能从“读数相同”推出框架等价，也不能把 demand-driven 当成已经求解的 full-allotment 均衡。tiered 曲线在 Q=55 显式画出边际计息阶跃，不把离散制度边界伪装成渐进惩罚。打印版保留冻结公式、当前读数和六条断言。</p>
    </section>
  );
}
