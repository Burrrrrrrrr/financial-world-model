'use client';

import { useState, useSyncExternalStore } from 'react';
import {
  borrowerConflictResults,
  borrowerDirectionPassports,
  canonicalCategoryBalancedResult,
  canonicalGrowthPurposeResult,
  canonicalVariancePurposeResult,
  duplicatedCreditAverage,
  populationStandardScore,
  priceQuantityConflictAggregate,
  priceQuantityConflictComponents,
} from './financialConditionsFixtures';

function Sources({ ids }: { ids: number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

const subscribeHydration = () => () => {};
const getClientHydrationSnapshot = () => true;
const getServerHydrationSnapshot = () => false;

function LabShell({ id, kicker, title, sources, children }: { id: string; kicker: string; title: string; sources: number[]; children: React.ReactNode }) {
  const hydrated = useSyncExternalStore(subscribeHydration, getClientHydrationSnapshot, getServerHydrationSnapshot);
  return <section className={`yield-mechanism-lab financial-conditions-mechanism-lab${hydrated ? ' is-hydrated' : ''}`} id={id}><header><div><span>{kicker}</span><h3>{title}</h3></div><p>机制依据：<Sources ids={sources} /></p></header>{children}</section>;
}

function RangeInput({ inputId, label, value, min, max, step, onChange, display }: { inputId: string; label: string; value: number; min: number; max: number; step: number; onChange: (value: number) => void; display: (value: number) => string }) {
  return <label className="yield-control" htmlFor={inputId}><span>{label}</span><input id={inputId} max={max} min={min} onChange={(event) => onChange(Number(event.currentTarget.value))} step={step} type="range" value={value} /><output htmlFor={inputId}>{display(value)}</output></label>;
}

function signed(value: number, digits = 3) {
  return `${value > 0 ? '+' : ''}${value.toFixed(digits)}`;
}

export function DirectionStandardisationLab() {
  const [equity, setEquity] = useState(120);
  const [dollar, setDollar] = useState(110);
  const [profile, setProfile] = useState<'dollar-debtor' | 'matched' | 'undefined'>('dollar-debtor');
  const rateZ = (2 - 1) / 0.5;
  const creditZ = (3.5 - 2) / 0.75;
  const equityZ = -(equity - 100) / 20;
  const dollarZ = profile === 'dollar-debtor' ? (dollar - 100) / 5 : profile === 'matched' ? 0 : null;
  const score = dollarZ === null ? null : (rateZ + creditZ + equityZ + dollarZ) / 4;
  return <LabShell id="financial-conditions-c1" kicker="C1 · DIRECTION + STANDARDISATION" sources={[3, 8, 9]} title="先选择融资主体和经济方向，再把不可比的原始单位映射到同一教学尺度">
    <div className="yield-control-grid"><RangeInput display={(value) => value.toFixed(0)} inputId="fci-c1-equity" label="股票指数（均值100，SD 20）" max={160} min={60} onChange={setEquity} step={5} value={equity} /><RangeInput display={(value) => value.toFixed(0)} inputId="fci-c1-dollar" label="广义美元（均值100，SD 5）" max={125} min={80} onChange={setDollar} step={1} value={dollar} /></div>
    <div className="holding-return-chain" role="group" aria-label="C1固定利率与信用输入的完整合成护照"><article><span>实际短率 · SYNTHETIC</span><b>{signed(rateZ)}</b><p>原值2.00%，校准均值1.00%，population SD 0.50pp；(2−1)/0.5=+2。</p></article><article><span>BBB利差 · SYNTHETIC</span><b>{signed(creditZ)}</b><p>原值3.50%，校准均值2.00%，population SD 0.75pp；(3.5−2)/0.75=+2。</p></article></div>
    <div className="yield-model-picker" role="group" aria-label="美元暴露护照"><button aria-pressed={profile === 'dollar-debtor'} className={profile === 'dollar-debtor' ? 'active' : ''} onClick={() => setProfile('dollar-debtor')} type="button"><b>未对冲美元债务人</b><span>美元升值记作收紧</span></button><button aria-pressed={profile === 'matched'} className={profile === 'matched' ? 'active' : ''} onClick={() => setProfile('matched')} type="button"><b>美元收入债务匹配</b><span>本例把净美元暴露设为0</span></button><button aria-pressed={profile === 'undefined'} className={profile === 'undefined' ? 'active' : ''} onClick={() => setProfile('undefined')} type="button"><b>未声明主体</b><span>方向未定义，停止聚合</span></button></div>
    {score === null ? <output aria-live="polite" className="wacc-decision ineligible"><span>STOP · DIRECTION UNDEFINED</span><b>美元方向必须绑定主体、币种与对冲</b><p>不能用“美元涨=全球统一收紧”替代暴露护照。</p></output> : <output aria-live="polite" className="wacc-decision eligible"><span>SYNTHETIC EQUAL-COMPONENT FCI</span><b>{signed(score)} index points</b><p>实际短率 {signed(rateZ)}，BBB利差 {signed(creditZ)}，股票 {signed(equityZ)}，美元 {signed(dollarZ ?? 0)}；四项等权。</p></output>}
    <div className="precision-note"><span>单位与符号</span><p>z-score只说“相对冻结校准窗有多异常”，不是百分点、融资金额或因果效应。股票上涨在本企业融资护照中映射为宽松，所以要翻向；美元符号则取决于债务、收入与对冲。</p></div>
    <div className="yield-static-summary">
      <b>静态摘要：</b><p>默认快照的四项护照与方向变换如下；全部数值均为SYNTHETIC，四项等权结果为(+2+2−1+2)/4=+1.25 index points。未声明主体时，美元方向未知，必须STOP。</p>
      <div className="yield-data-table-wrap financial-conditions-static-ledger" role="region" aria-label="C1默认快照四项原值方向与标准化复算表" tabIndex={0}><table className="yield-data-table"><caption>C1默认快照 · 原值与冻结校准 → 标准化 → 乘方向s</caption><thead><tr><th scope="col">输入</th><th scope="col">原值 / 均值 / SD</th><th scope="col">主体方向规则</th><th scope="col">代入式与z</th></tr></thead><tbody><tr><th scope="row">实际短率</th><td>2.00% / 1.00% / 0.50pp</td><td>上升=收紧，s=+1</td><td>(2−1)/0.5=+2</td></tr><tr><th scope="row">BBB利差</th><td>3.50% / 2.00% / 0.75pp</td><td>扩大=收紧，s=+1</td><td>(3.5−2)/0.75=+2</td></tr><tr><th scope="row">股票指数</th><td>120 / 100 / 20指数点</td><td>上涨=宽松，s=−1；标准化后翻向</td><td>−(120−100)/20=−1</td></tr><tr><th scope="row">广义美元</th><td>110 / 100 / 5指数点</td><td>未对冲美元债务人：升值=收紧，s=+1</td><td>(110−100)/5=+2</td></tr></tbody></table></div>
    </div>
  </LabShell>;
}

const weightLenses = [
  { id: 'category', label: '类别等权', result: canonicalCategoryBalancedResult, note: '六个经济块各占1/6；回答广义状态。' },
  { id: 'growth', label: '增长用途', result: canonicalGrowthPurposeResult, note: 'SYNTHETIC宏观用途权重；不是估计的增长系数。' },
  { id: 'variance', label: '统计方差用途', result: canonicalVariancePurposeResult, note: 'SYNTHETIC方差镜头；权重不等于因果重要性。' },
] as const;

export function WeightLensLab() {
  const [lens, setLens] = useState<(typeof weightLenses)[number]['id']>('category');
  const selected = weightLenses.find(({ id }) => id === lens) ?? weightLenses[0];
  return <LabShell id="financial-conditions-c2" kicker="C2 · WEIGHT LENS" sources={[1, 3, 8, 9]} title="输入不变，权重一换，指数就在回答另一个问题">
    <div className="yield-model-picker" role="group" aria-label="选择金融条件权重用途">{weightLenses.map((item) => <button aria-pressed={lens === item.id} className={lens === item.id ? 'active' : ''} key={item.id} onClick={() => setLens(item.id)} type="button"><b>{item.label}</b><span>{item.note}</span></button>)}</div>
    <output aria-live="polite" className="wacc-decision eligible"><span>{selected.label.toUpperCase()} · SYNTHETIC</span><b>{selected.result ? signed(selected.result.score) : 'STOP'} index points</b><p>{selected.note}</p></output>
    <div className="holding-return-chain" role="group" aria-label={`${selected.label}的分项贡献`}>{selected.result?.contributions.map(({ domain, value, weight, contribution }) => <article key={domain}><span>{domain}</span><b>{signed(contribution)}</b><p>{signed(value, 2)} × {(weight * 100).toFixed(0)}%权重。</p></article>)}</div>
    <div className="precision-note"><span>权重不是客观真值</span><p>等类别权重、动态因子、PCA、增长乘数和借款人暴露权重分别服务不同estimand（估计对象：为谁、估什么结果、什么期限）。PCA loading最大只说明样本方差方向；增长用途权重还要锁定结果、期限、模型和训练vintage。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>同一六维SYNTHETIC状态在类别等权、增长用途和统计方差用途下分别为+0.717、+0.795和+0.848 index points；差异来自问题与权重，不是原始世界在按钮间变化。</div>
  </LabShell>;
}

export function DuplicateDetectorLab() {
  const [copies, setCopies] = useState(1);
  const result = duplicatedCreditAverage(copies);
  return <LabShell id="financial-conditions-c3" kicker="C3 · DUPLICATE DETECTOR" sources={[3, 5, 8, 9]} title="把同一信用信号复制三次，不会创造三份经济信息，却会悄悄提高它的原始组件权重">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value} 个`} inputId="fci-c3-copies" label="私人信用块中完全重复的输入数" max={5} min={1} onChange={setCopies} step={1} value={copies} /></div>
    {result ? <output aria-live="polite" className="wacc-decision eligible"><span>NAIVE EQUAL-COMPONENT AVERAGE</span><b>{signed(result.score)} index points</b><p>信用复制项占全部原始输入 {(result.creditShareOfRawInputs * 100).toFixed(1)}%；类别等权基准仍为+0.717。</p></output> : null}
    <div className="precision-note"><span>相关不等于重复，但重复是清晰反例</span><p>现实指标通常不是完全相同，只是高度相关。先在经济块内处理冗余，再在块间聚合，可以防止“数据多的类别自然权重大”；PCA也要报告样本、loading、符号锚和稳定性。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>信用输入只有1个时，六项平均为+0.717；把完全相同的1.2复制到3个信用输入后，八项平均变为+0.838，尽管没有新增经济信息。</div>
  </LabShell>;
}

export function VintageMachineLab() {
  const [futureTail, setFutureTail] = useState(140);
  const realtimeValues = [100, 102, 104, 106, 108];
  const fullValues = [...realtimeValues, 120, 130, futureTail];
  const realtime = populationStandardScore(realtimeValues, 4);
  const full = populationStandardScore(fullValues, 4);
  return <LabShell id="financial-conditions-c4" kicker="C4 · VINTAGE MACHINE" sources={[4, 9, 19]} title="未来危机没有修改旧利差，却能通过完整样本均值和波动率重写旧日期的标签">
    <div className="yield-control-grid"><RangeInput display={(value) => `${value} bp`} inputId="fci-c4-future" label="未来样本最后一个信用利差观测" max={180} min={108} onChange={setFutureTail} step={4} value={futureTail} /></div>
    <div className="holding-return-chain" role="group" aria-label="实时和事后标准化比较"><article><span>REAL-TIME AS-OF</span><b>{realtime ? signed(realtime.score) : 'STOP'}</b><p>[100,102,104,106,108]；均值{realtime?.mean.toFixed(1)}，population SD {realtime?.standardDeviation.toFixed(3)}bp。</p></article><article className="result"><span>EX-POST FULL SAMPLE</span><b>{full ? signed(full.score) : 'STOP'}</b><p>未来[120,130,{futureTail}]进入normaliser；旧值108本身没有改变。</p></article></div>
    <div className="precision-note"><span>五个时钟</span><p>历史指数应保存observation、release、revision、retrieval和model-estimation/effective time。伪实时研究只能使用当时已发布的值、当时可估的normaliser（把原值映射到可比尺度的均值、SD等规则）与当时冻结的权重；否则会把未来信息泄漏进过去。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>108在当时五个观测中的z为+1.414；后来加入120、130、140并错误地用完整样本标准化时，同一个108变为约−0.419。两者必须分别标REAL-TIME和EX-POST。</div>
  </LabShell>;
}

const menuViews = [
  { id: 'aggregate', label: '六块平均', result: priceQuantityConflictAggregate, directionPassport: null, note: '总体接近中性，却掩盖银行可得性+1.5。' },
  { id: 'small', label: '银行依赖小企业', result: borrowerConflictResults.bankDependentSmallFirm, directionPassport: borrowerDirectionPassports.bankDependentSmallFirm, note: '55%暴露权重落在银行可得性。' },
  { id: 'issuer', label: '公开债券发行人', result: borrowerConflictResults.publicBondIssuer, directionPassport: borrowerDirectionPassports.publicBondIssuer, note: '信用价格、股票和市场流动性更重要。' },
  { id: 'dollar', label: '美元债务人', result: borrowerConflictResults.dollarDebtor, directionPassport: borrowerDirectionPassports.dollarDebtor, note: '50%暴露权重落在美元/FX项。' },
] as const;

export function BorrowerFinancingMenuLab() {
  const [view, setView] = useState<(typeof menuViews)[number]['id']>('aggregate');
  const selected = menuViews.find(({ id }) => id === view) ?? menuViews[0];
  const selectedScore = selected.result?.score;
  return <LabShell id="financial-conditions-c5" kicker="C5 · WEIGHT-ONLY HETEROGENEITY · SHARED FIXED SIGN MAP" sources={[8, 10, 17, 21]} title="先冻结同一合成方向图，再单独观察暴露权重如何让接近零的总指数对应完全不同的融资菜单">
    <div className="yield-model-picker" role="group" aria-label="选择金融条件观察对象">{menuViews.map((item) => <button aria-pressed={view === item.id} className={view === item.id ? 'active' : ''} key={item.id} onClick={() => setView(item.id)} type="button"><b>{item.label}</b><span>{item.note}</span></button>)}</div>
    <output aria-live="polite" className={(selectedScore ?? 0) > 0.25 ? 'wacc-decision ineligible' : 'wacc-decision eligible'}><span>SYNTHETIC WEIGHT-ONLY EFFECTIVE CONDITIONS</span><b>{typeof selectedScore === 'number' ? signed(selectedScore) : 'STOP'} index points</b><p>{selected.note}</p></output>
    <div className="yield-data-table-wrap" role="region" aria-label={`${selected.label}六维权重与贡献闭合表`} tabIndex={0}><table className="yield-data-table"><caption>{selected.label} · zᵇᵢ × wᵇᵢ贡献账本；本实验固定同一SYNTHETIC方向图，仅改变权重</caption><thead><tr><th scope="col">经济lane</th><th scope="col">已对齐zᵇᵢ</th><th scope="col">权重wᵇᵢ</th><th scope="col">贡献wᵇᵢzᵇᵢ</th></tr></thead><tbody>{selected.result?.contributions.map(({ domain, value, weight, contribution }) => <tr key={domain}><th scope="row">{priceQuantityConflictComponents.find((component) => component.domain === domain)?.label ?? domain}</th><td>{signed(value)}</td><td>{(weight * 100).toFixed(1)}%</td><td>{signed(contribution)}</td></tr>)}</tbody><tfoot><tr><th scope="row" colSpan={3}>六项贡献闭合</th><td>{typeof selectedScore === 'number' ? signed(selectedScore) : 'STOP'}</td></tr></tfoot></table></div>
    <div className="precision-note"><span>这是权重异质性实验，不是完整主体方向估计</span><p>一般式必须使用主体特定zᵇᵢ；本实验为隔离权重效应，预注册<code>weight-only-under-shared-fixed-sign-map</code>，三个主体各自保存六项SYNTHETIC方向假设。{selected.directionPassport ? `当前美元规则：${selected.directionPassport.domainDirections.find(({ domain }) => domain === 'dollar-fx')?.rule}` : '总体镜头只汇总已按注册混合主体方向对齐的六条lane。'} 真实输出还应保留all-in price、批准概率、获批额度/申请额、期限、抵押与covenant；任何主体方向未知都应STOP。</p></div>
    <div className="yield-static-summary">
      <b>静态摘要：</b><p>默认六块等权的z为(+0.2,−0.4,−0.6,+0.1,+1.5,−0.3)，权重各16.7%，贡献约为(+0.033,−0.067,−0.100,+0.017,+0.250,−0.050)，合计+0.083。下面冻结同一SYNTHETIC方向图，只改变三类主体的暴露权重；这不是现实主体估计。</p>
      <div className="financial-conditions-static-ledgers">{menuViews.slice(1).map((item) => <div className="yield-data-table-wrap financial-conditions-static-ledger" key={item.id} role="region" aria-label={`${item.label}静态六维权重与贡献闭合表`} tabIndex={0}><table className="yield-data-table"><caption>{item.label} · 静态zᵇᵢ × wᵇᵢ账本</caption><thead><tr><th scope="col">经济lane</th><th scope="col">zᵇᵢ</th><th scope="col">权重</th><th scope="col">贡献</th></tr></thead><tbody>{item.result?.contributions.map(({ domain, value, weight, contribution }) => <tr key={domain}><th scope="row">{priceQuantityConflictComponents.find((component) => component.domain === domain)?.label ?? domain}</th><td>{signed(value)}</td><td>{(weight * 100).toFixed(1)}%</td><td>{signed(contribution)}</td></tr>)}</tbody><tfoot><tr><th scope="row" colSpan={3}>六项贡献闭合</th><td>{typeof item.result?.score === 'number' ? signed(item.result.score) : 'STOP'}</td></tr></tfoot></table></div>)}</div>
    </div>
  </LabShell>;
}

export function ForecastCausalGateLab() {
  const [fci, setFci] = useState(1.5);
  const [exogenous, setExogenous] = useState(false);
  const [commonNewsExcluded, setCommonNewsExcluded] = useState(false);
  const predictedChange = -0.8 * fci;
  const twoNecessaryGatesPassed = exogenous && commonNewsExcluded;
  return <LabShell id="financial-conditions-c6" kicker="C6 · FORECAST ≠ CAUSAL EFFECT" sources={[1, 8, 11, 16]} title="合成预测算术不能授予经验OOS或因果身份；必要设计门通过也不等于识别完成">
    <div className="yield-control-grid"><RangeInput display={(value) => signed(value, 1)} inputId="fci-c6-level" label="当前SYNTHETIC FCI" max={3} min={-2} onChange={setFci} step={0.25} value={fci} /></div>
    <div className="yield-model-picker" role="group" aria-label="因果识别必要门"><button aria-pressed={exogenous} className={exogenous ? 'active' : ''} onClick={() => setExogenous((value) => !value)} type="button"><b>{exogenous ? 'PASS' : 'FAIL'} · 外生变化</b><span>是否有明确定义且外生的处理变化？</span></button><button aria-pressed={commonNewsExcluded} className={commonNewsExcluded ? 'active' : ''} onClick={() => setCommonNewsExcluded((value) => !value)} type="button"><b>{commonNewsExcluded ? 'PASS' : 'FAIL'} · 共同消息</b><span>是否排除坏消息同时改变市场与未来增长？</span></button></div>
    <output aria-live="polite" className="wacc-decision ineligible"><span>SYNTHETIC FORECAST ARITHMETIC · EMPIRICAL PREDICTION NOT ESTIMATED</span><b>{signed(predictedChange, 2)}pp 教学条件演算</b><p>合成规则为增长修正=−0.8×FCI；canonical的predictionStatus仍是not-estimated。{twoNecessaryGatesPassed ? '两个必要因果门已声明通过，但处理、支持集、识别与推断尚未闭合。' : '必要因果门尚未全部通过。'} 因果身份始终为not-claimed。</p></output>
    <div className="precision-note"><span>两道必要门通过仍是DESIGN INCOMPLETE</span><p>本界面不授予identified-candidate。真实研究还要定义具体处理、支持集、时间顺序、识别假设、估计、推断、安慰剂与稳健性审计；若真实预注册的as-of输入、时间有序OOS、benchmark和loss记录通过，才可另行升级预测身份。研究政策总效应时，FCI组件往往还是政策的中介；把它们直接当控制变量可能形成post-treatment bias。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>FCI=+1.5、SYNTHETIC系数−0.8只能得到−1.2pp教学算术；本章没有经验估计或OOS记录，predictionStatus为not-estimated、causalStatus为not-claimed。即使两个按钮全选，也只表示两个必要门通过，设计仍未闭合。</div>
  </LabShell>;
}

export function StateDependenceLab() {
  const [state, setState] = useState<'calm' | 'stress'>('calm');
  const [fci, setFci] = useState(1);
  const beta = state === 'calm' ? 0.4 : 1.2;
  const response = -beta * fci;
  return <LabShell id="financial-conditions-c7" kicker="C7 · OPTIONAL STATE DEPENDENCE" sources={[11, 12, 13]} title="同一个指数值在平静期与压力期可以对应不同预测响应；线性系数不是跨状态结构常数">
    <div className="yield-model-picker" role="group" aria-label="选择教学状态"><button aria-pressed={state === 'calm'} className={state === 'calm' ? 'active' : ''} onClick={() => setState('calm')} type="button"><b>平静状态</b><span>SYNTHETIC β=0.4</span></button><button aria-pressed={state === 'stress'} className={state === 'stress' ? 'active' : ''} onClick={() => setState('stress')} type="button"><b>压力状态</b><span>SYNTHETIC β=1.2</span></button></div>
    <div className="yield-control-grid"><RangeInput display={(value) => signed(value, 1)} inputId="fci-c7-level" label="SYNTHETIC FCI" max={2.5} min={-1} onChange={setFci} step={0.25} value={fci} /></div>
    <output aria-live="polite" className="wacc-decision eligible"><span>{state.toUpperCase()} · SYNTHETIC CONDITIONAL PREDICTION</span><b>{signed(response, 2)}pp</b><p>Δgrowtĥ=−β(state)×FCI；这只是状态依赖的可计算反例。</p></output>
    <div className="precision-note"><span>不可从交互外推</span><p>两个β不是现实估计，状态也不是由本实验识别。压力期更大的响应可能来自非线性融资约束、火售或中介反馈，但这些机制分别由3.14和Chapter 7承接。</p></div>
    <div className="yield-static-summary"><b>静态摘要：</b>同一FCI=+1时，平静状态教学预测为−0.4pp，压力状态为−1.2pp；差异只展示状态依赖，不是因果结构参数。</div>
  </LabShell>;
}
