'use client';

import { useEffect, useState } from 'react';
import {
  c1Default,
  c2Default,
  calculateC1,
  calculateC2,
  globalCycleLabs,
  type C1Input,
  type C1Result,
  type C2Input,
  type C2Result,
  type GlobalCycleLabId,
} from './globalCycleLabs';
import styles from './globalCycle.module.css';

function format(value: number, digits = 3) {
  if (Object.is(value, -0)) return '0';
  return String(Number(value.toFixed(digits))).replace('-', '−');
}

function labMeta(id: GlobalCycleLabId) {
  const lab = globalCycleLabs.find(candidate => candidate.id === id);
  if (!lab) throw new Error(`Unknown 4.07 lab ${id}`);
  return lab;
}

function C1ResultView({ result }: { result: C1Result }) {
  return <>
    <div className={styles.resultGrid} aria-label="C1三条合成记录结果">
      {result.rows.map(row => <article className={styles.resultCard} key={row.id}>
        <h4>{row.id} · {row.asset}</h4>
        <dl>
          <dt>未缓冲 G×E</dt><dd>{format(row.unbuffered)}</dd>
          <dt>缓冲抵消</dt><dd>{format(row.bufferOffset)}</dd>
          <dt>本地冲击 L</dt><dd>{format(row.local)}</dd>
          <dt>净 adverse score</dt><dd>{format(row.total)}</dd>
          <dt>“全球解释份额”</dt><dd>{row.globalShare === null ? 'null · 分母为0' : '不报告因果份额'}</dd>
        </dl>
      </article>)}
    </div>
    <div className={styles.decomposition} role="group" aria-label="C1数字分解条">
      <div className={styles.decompRow}><b>记录</b><span>未缓冲</span><span>缓冲</span><span>本地</span><span>净结果</span></div>
      {result.rows.map(row => <div className={styles.decompRow} key={`bar-${row.id}`}>
        <b>{row.id} · {row.asset}</b>
        <span className={row.unbuffered > 0 ? styles.positive : styles.neutral}>{format(row.unbuffered)}</span>
        <span className={row.bufferOffset < 0 ? styles.negative : styles.neutral}>{format(row.bufferOffset)}</span>
        <span className={row.local < 0 ? styles.negative : row.local > 0 ? styles.positive : styles.neutral}>{format(row.local)}</span>
        <span className={row.total < 0 ? styles.negative : row.total > 0 ? styles.positive : styles.neutral}>{format(row.total)}</span>
      </div>)}
    </div>
    <p className={styles.nullPanel}><b>证据上限：</b><code>causalShare = null</code>；<code>realWorldEstimate = null</code>。代数成分是作者设定，不是现实因果方差分解。</p>
  </>;
}

function C1FixedRecord() {
  const result = calculateC1(c1Default);
  return <div className={styles.fixedRecord}>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>这是冻结的AUTHOR-SYN默认记录，和互动默认值调用同一个calculator；所有资产先转换为同方向synthetic adverse score，不能读成现实收益、基点或国家排名。</p>
    <p className={styles.formula}>Uᵢ = G × Eᵢ；Oᵢ = −G × Eᵢ × Bᵢ；Dᵢ = G × Eᵢ × (1−Bᵢ) + Lᵢ</p>
    <div className={styles.tableWrap} role="region" aria-label="C1固定输入与输出" tabIndex={0}>
      <table className={styles.dataTable}><thead><tr><th scope="col">记录</th><th scope="col">资产</th><th scope="col">G</th><th scope="col">E</th><th scope="col">B</th><th scope="col">L</th><th scope="col">U</th><th scope="col">O</th><th scope="col">D</th></tr></thead><tbody>{result.rows.map(row => <tr key={row.id}><th scope="row">{row.id}</th><td>{row.asset}</td><td>{c1Default.globalStress}</td><td>{format(row.exposure, 2)}</td><td>{format(row.buffer, 2)}</td><td>{format(row.local)}</td><td>{format(row.unbuffered)}</td><td>{format(row.bufferOffset)}</td><td>{format(row.total)}</td></tr>)}</tbody></table>
    </div>
    <p><b>默认手算：</b>A = 4×1×(1−1/4)+0 = 3；B = 4×(6/4)×(1−2/4)−1 = 2；C = 4×(2/4)×1+2 = 4。B的全球暴露最高而结果最小；C的暴露最低而结果最大，固定脆弱性排序被推翻。</p>
    <C1ResultView result={result} />
    <p><b>预注册反例：</b>只把B的L改为−4，共同贡献仍为3，但净结果为−1；全球risk-off期间，本地有利消息可以令单一市场反向。结果不得截断为0。</p>
    <p><b>STOP/null：</b>任一身份、单位、方向或输入缺失，非整数档、E&lt;0、B不在[0,1]、非有限值或重复记录均STOP；G=0、E=0、B=1与D=0是已知零，但D=0时比例为null。</p>
    <p className={styles.sourceLine}>机制依据：<a href="#ref-4">[4] </a><a href="#ref-9">[9] </a><a href="#ref-12">[12]</a>。来源支持异质暴露与通道，不提供本实验参数。</p>
  </div>;
}

type C1Raw = Record<keyof C1Input, string>;

const c1Bounds: Record<keyof C1Input, readonly [number, number]> = {
  globalStress: [0, 8],
  aExposureQ: [0, 8], aBufferQ: [0, 4], aLocal: [-8, 8],
  bExposureQ: [0, 8], bBufferQ: [0, 4], bLocal: [-8, 8],
  cExposureQ: [0, 8], cBufferQ: [0, 4], cLocal: [-8, 8],
};

const c1Labels: Record<keyof C1Input, string> = {
  globalStress: '共同压力 G（整数）',
  aExposureQ: 'A exposure（四分之一档）', aBufferQ: 'A buffer（四分之一档）', aLocal: 'A local L',
  bExposureQ: 'B exposure（四分之一档）', bBufferQ: 'B buffer（四分之一档）', bLocal: 'B local L',
  cExposureQ: 'C exposure（四分之一档）', cBufferQ: 'C buffer（四分之一档）', cLocal: 'C local L',
};

function c1RawDefault(): C1Raw {
  return Object.fromEntries(Object.entries(c1Default).map(([key, value]) => [key, String(value)])) as C1Raw;
}

function parseC1(raw: C1Raw): { input: C1Input | null; errors: string[] } {
  const values: Partial<C1Input> = {};
  const errors: string[] = [];
  (Object.keys(c1Default) as (keyof C1Input)[]).forEach(key => {
    const text = raw[key];
    const value = /^-?(?:0|[1-9]\d*)$/.test(text) ? Number(text) : Number.NaN;
    const [min, max] = c1Bounds[key];
    if (!Number.isInteger(value) || value < min || value > max) errors.push(c1Labels[key]);
    else values[key] = value;
  });
  return { input: errors.length ? null : values as C1Input, errors };
}

function C1Active() {
  const [raw, setRaw] = useState<C1Raw>(c1RawDefault);
  const [revision, setRevision] = useState(0);
  const parsed = parseC1(raw);
  const result = parsed.input ? calculateC1(parsed.input) : null;
  const instructionsId = 'global-cycle-C1-instructions';
  return <>
    <p className={styles.instructions} id={instructionsId}><b>编辑当前独立SYN：</b>G、四分之一档E/B与整数L均有封闭输入域；非法值会STOP并清除旧结果。E显示值=输入档位/4，B显示值=输入档位/4。</p>
    <div className={styles.controls} role="group" aria-label="C1异质反应合成输入">
      {(Object.keys(c1Default) as (keyof C1Input)[]).map(key => {
        const [min, max] = c1Bounds[key];
        const invalid = parsed.errors.includes(c1Labels[key]);
        return <label htmlFor={`global-cycle-C1-${key}`} key={key}><span>{c1Labels[key]}</span><input id={`global-cycle-C1-${key}`} type="number" inputMode="numeric" min={min} max={max} step={1} value={raw[key]} aria-invalid={invalid} aria-describedby={instructionsId} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [key]: value })); setRevision(current => current + 1); }} /><small>{min}–{max}，只接受整数；unknown不能填0。</small></label>;
      })}
    </div>
    <button className={styles.reset} type="button" onClick={() => { setRaw(c1RawDefault()); setRevision(current => current + 1); }}>恢复C1固定默认</button>
    <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">{result ? `C1状态${revision + 1}已重算；结果只属于当前AUTHOR-SYN。` : `STOP · 以下字段不在声明域：${parsed.errors.join('；')}。旧结果已清除；STOP不是经济零。`}</p>
    <div className={styles.results}>{result ? <C1ResultView result={result} /> : <p className={styles.stop}><b>STOP · 无数值结果：</b>修正输入前，不沿用旧结果。</p>}</div>
  </>;
}

function C2ResultView({ result }: { result: C2Result }) {
  const pc1 = result.pc1Kind === 'global-common-direction' ? 'global common direction' : 'A−B local contrast direction';
  return <>
    <div className={styles.tableWrap} role="region" aria-label="C2当前四时点序列" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">时点</th><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th><th scope="col">SYN VIX-like P</th></tr></thead><tbody>{result.series.map(row => <tr key={row.time}><th scope="row">{row.time}</th><td>{row.A}</td><td>{row.B}</td><td>{row.C}</td><td>{row.P}</td></tr>)}</tbody></table></div>
    <div className={styles.resultGrid}>
      <article className={styles.resultCard}><h4>PCA镜头</h4><dl><dt>PC1方向</dt><dd>{pc1}</dd><dt>特征值</dt><dd>{result.eigenvalues.join(' / ')}</dd><dt>解释份额</dt><dd>{format(result.explainedShare * 100, 1)}%</dd><dt>loadings</dt><dd>{result.pc1Loadings.map(value => format(value, 3)).join(' / ')}</dd></dl></article>
      <article className={styles.resultCard}><h4>Proxy镜头</h4><dl><dt>Corr(C,P)</dt><dd>{format(result.correlationCP, 3)}</dd><dt>数值完全匹配</dt><dd>{result.proxySampleMatch ? '是（仍非身份等号）' : '否'}</dd><dt>P−C</dt><dd>{result.proxyResidual.join(' / ')}</dd></dl></article>
      <article className={styles.resultCard}><h4>Correlation镜头</h4><dl><dt>Corr(A,B)</dt><dd>{format(result.correlationAB, 3)}</dd><dt>共同score</dt><dd>{result.commonScore.join(' / ')}</dd><dt>因果方向</dt><dd>null</dd></dl></article>
    </div>
    <p className={styles.nullPanel}><code>identifiedShock = null</code>；<code>contagionDirection = null</code>；<code>causalEffect = null</code>。即使proxy数值完全匹配、相关=1或PC1解释100%，没有识别护照也不能生成因果数值。</p>
  </>;
}

function C2FixedRecord() {
  const result = calculateC2(c2Default);
  return <div className={styles.fixedRecord}>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>四个时点已经去均值并使用同一synthetic stress-score单位；P是SYN VIX-like proxy，不是真实VIX。X′X、列顺序[A,B,C]、窗口和单位已冻结。</p>
    <p className={styles.formula}>g=(−3,−1,1,3)，q=(1,−1,−1,1)；A=g+hq，B=g−hq，C=g，P=g+kq；默认h=1，k=2。</p>
    <C2ResultView result={result} />
    <div className={styles.tableWrap} role="region" aria-label="C2默认Gram矩阵" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">X′X</th><th scope="col">A</th><th scope="col">B</th><th scope="col">C</th></tr></thead><tbody>{result.gram.map((row, index) => <tr key={index}><th scope="row">{['A', 'B', 'C'][index]}</th>{row.map((value, column) => <td key={column}>{value}</td>)}</tr>)}</tbody></table></div>
    <p><b>默认手算：</b>特征值为60、8、0；共同方向(1,1,1)/√3为PC1，解释60/(60+8)=15/17≈88.2%；Corr(A,B)=(5−1)/(5+1)=2/3；Corr(C,P)=√(5/(5+4))=√5/3≈0.745；P−C=(2,−2,−2,2)。</p>
    <div className={styles.fourLenses}>
      <article><h4>PCA</h4><p>回答冻结面板中哪条线性组合承载最多方差；不回答冲击来源、经济命名或方向。</p></article>
      <article><h4>VIX-like proxy</h4><p>回答外部可观测序列与共同score多接近；不证明二者同一、外生或未来稳定。</p></article>
      <article><h4>Correlation</h4><p>回答两个序列的线性共同运动；不回答谁导致谁，也不区分共同冲击与传染。</p></article>
      <article><h4>Causal design</h4><p>需要外生变化、时序或typed edge等额外证据；本实验没有，所以全部因果字段为null。</p></article>
    </div>
    <p><b>关键边界：</b>h=3时本地A−B对比的特征值72超过共同方向60，PC1不再是“全球”方向；k=0时P与g样本内完全一致，也只证明四个合成点匹配。若总方差为0、列方差为0、最大特征值并列、时钟/单位/缺失规则未知或要求从PC1直接生成shock，必须STOP/null。</p>
    <p><b>观测等价反例：</b>故事一令潜在g同时进入A/B/C；故事二把可观测C写成源，A=C+hq、B=C−hq。两者生成完全相同的X、PCA和相关矩阵；这些统计量不能选择因果图。</p>
    <p className={styles.sourceLine}>机制依据：<a href="#ref-2">[2] </a><a href="#ref-4">[4] </a><a href="#ref-7">[7] </a><a href="#ref-19">[19]</a>。来源支持因子/代理口径，不提供SYN参数或因果身份。</p>
  </div>;
}

function C2Active() {
  const [input, setInput] = useState<C2Input>(c2Default);
  const [revision, setRevision] = useState(0);
  const result = calculateC2(input);
  return <>
    <p className={styles.instructions}><b>编辑当前独立SYN：</b>h控制A/B本地对比，k控制proxy-specific成分；只有离散、可手算档位。页面不会提供“将PC1识别为shock”的按钮。</p>
    <div className={styles.controls} role="group" aria-label="C2测量镜头合成输入">
      <label htmlFor="global-cycle-C2-h"><span>市场本地对比 h</span><select id="global-cycle-C2-h" value={input.h} onChange={event => { const h = Number(event.currentTarget.value); setInput(current => ({ ...current, h })); setRevision(current => current + 1); }}>{[0, 1, 2, 3].map(value => <option value={value} key={value}>{value}</option>)}</select><small>h=3时PC1切换为A−B本地对比。</small></label>
      <label htmlFor="global-cycle-C2-k"><span>Proxy-specific成分 k</span><select id="global-cycle-C2-k" value={input.k} onChange={event => { const k = Number(event.currentTarget.value); setInput(current => ({ ...current, k })); setRevision(current => current + 1); }}>{[0, 1, 2, 3, 4].map(value => <option value={value} key={value}>{value}</option>)}</select><small>k=0时P与g数值匹配，因果字段仍为null。</small></label>
    </div>
    <button className={styles.reset} type="button" onClick={() => { setInput(c2Default); setRevision(current => current + 1); }}>恢复C2固定默认</button>
    <p className={styles.liveStatus} role="status" aria-live="polite" aria-atomic="true">C2状态{revision + 1}已重算；measurement结果已更新，causal字段仍为null。</p>
    <div className={styles.results}><C2ResultView result={result} /></div>
  </>;
}

export default function GlobalCycleLab({ labId }: { labId: GlobalCycleLabId }) {
  const meta = labMeta(labId);
  useEffect(() => {
    document.documentElement.classList.add('global-cycle-js');
    return () => document.documentElement.classList.remove('global-cycle-js');
  }, []);
  return <aside className={styles.lab} id={`global-cycle-lab-${labId}`} aria-labelledby={`global-cycle-lab-${labId}-title`}>
    <div className={styles.labLead}>
      <span className="section-kicker">{labId} · AUTHOR-SYN / INTERACTIVE + STATIC TWIN</span>
      <h3 id={`global-cycle-lab-${labId}-title`}>{meta.title}</h3>
      <p>{meta.question}</p>
      <p className={styles.passport}><b>实验护照：</b>{meta.passport}</p>
    </div>
    <div className={`${styles.dynamic} global-cycle-interactive-only`}>{labId === 'C1' ? <C1Active /> : <C2Active />}</div>
    <details className={styles.static} open><summary>{labId}固定输入、结果、手算、反例与来源（无需JavaScript）</summary>{labId === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</details>
    <div className={styles.printRecord}>{labId === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</div>
  </aside>;
}
