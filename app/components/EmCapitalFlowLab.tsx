'use client';

import { useEffect, useState } from 'react';
import {
  c1Default,
  c2Default,
  calculateC1,
  calculateC2,
  emCapitalFlowLabs,
  type C1Input,
  type C1Result,
  type C2Input,
  type C2Result,
  type EmCapitalFlowLabId,
} from './emCapitalFlowLabs';
import styles from './globalCycle.module.css';

function format(value: number, digits = 2) {
  if (Object.is(value, -0)) return '0';
  return String(Number(value.toFixed(digits))).replace('-', '−');
}

function percent(value: number | null) {
  return value === null ? 'null · 分母为0' : `${format(value * 100, 1)}%`;
}

function labMeta(id: EmCapitalFlowLabId) {
  const lab = emCapitalFlowLabs.find(candidate => candidate.id === id);
  if (!lab) throw new Error(`Unknown 4.08 lab ${id}`);
  return lab;
}

const eventLabels = {
  surge: 'surge · 非居民流入腿显著增加',
  stop: 'stop · 非居民流入腿显著减少',
  flight: 'flight · 居民对外投资腿显著增加',
  retrenchment: 'retrenchment · 居民对外投资腿显著减少',
  none: 'none · 未越过事前阈值',
} as const;

function C1ResultView({ result }: { result: C1Result }) {
  return <>
    <div className={styles.resultGrid}>
      <article className={styles.resultCard}><h4>非居民gross inflow腿</h4><dl><dt>工具合计变化 ΔI</dt><dd>{format(result.grossInflowChange)}</dd><dt>事前事件标签</dt><dd>{eventLabels[result.inwardEvent]}</dd></dl></article>
      <article className={styles.resultCard}><h4>居民gross outflow腿</h4><dl><dt>工具合计变化 ΔO</dt><dd>{format(result.grossOutflowChange)}</dd><dt>事前事件标签</dt><dd>{eventLabels[result.outwardEvent]}</dd></dl></article>
      <article className={styles.resultCard}><h4>净流入变化</h4><dl><dt>ΔN = ΔI − ΔO</dt><dd>{format(result.netInflowChange)}</dd><dt>两条gross leg变化在net中相抵</dt><dd>{result.offsettingGrossLegChanges ? '是' : '否'}</dd></dl></article>
    </div>
    <p className={styles.nullPanel}><code>causalDriver = null</code>；<code>crisis = null</code>；<code>welfare = null</code>。事件标签只描述冻结规则下的gross腿变化，不提供原因、危机或福利结论。</p>
  </>;
}

function C1FixedRecord() {
  const result = calculateC1(c1Default);
  const masked = calculateC1({ ...c1Default, inwardPortfolioEquity: 6 });
  return <div className={styles.fixedRecord}>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>以下是冻结的AUTHOR-SYN默认记录。实验宇宙只含证券投资债务、证券投资股权／基金份额、其他投资三个互斥且在本SYN内穷尽的功能分类单元；直接投资、衍生品与储备在实验范围外，而不是填0。所有值都是同一期间、同一合成单位的交易变化；正号仅表示对应gross腿增加，不是资产回报。</p>
    <p className={styles.formula}>ΔI = ΣₖΔIₖ；ΔO = ΣₖΔOₖ；ΔN = ΔI − ΔO。默认阈值 τᵢ = τₒ = 4。</p>
    <div className={styles.tableWrap} role="region" aria-label="C1固定gross腿输入" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">方向</th><th scope="col">证券债务</th><th scope="col">证券股权／基金份额</th><th scope="col">其他投资</th><th scope="col">实验宇宙合计</th><th scope="col">标签</th></tr></thead><tbody>
      <tr><th scope="row">非居民取得本国资产 ΔI</th><td>−6</td><td>0</td><td>0</td><td>−6</td><td>stop</td></tr>
      <tr><th scope="row">居民取得外国资产 ΔO</th><td>−6</td><td>0</td><td>0</td><td>−6</td><td>retrenchment</td></tr>
    </tbody></table></div>
    <p><b>默认手算：</b>ΔN = −6 − (−6) = 0。净流入变化为零，但非居民减少买入本国资产、居民也减少取得外国资产；这正是净额遮蔽两条gross腿的情形。</p>
    <C1ResultView result={result} />
    <p><b>组成反例：</b>若只把非居民证券股权／基金份额变化改为+6，则本SYN的非居民腿合计从−6被抵消为0，聚合标签变为none，而证券债务单元仍是−6。互斥单元加总仍可遮蔽内部事件；本课不会把聚合标签倒灌给每个单元。</p>
    <p><b>STOP/null：</b>任一身份、方向、频率、单位、交易／头寸口径未知，输入缺失、非整数、变化超出[−8,8]、阈值不在[1,8]，或阈值使用未来样本时STOP。unknown不得填0；合法零是已知没有变化。</p>
    <p className={styles.sourceLine}>机制依据：<a href="#ref-1">[1] </a><a href="#ref-3">[3] </a><a href="#ref-4">[4]</a>。来源支持对象和事件分类，不提供本实验数值或现实阈值。</p>
    <span hidden>{masked.netInflowChange}</span>
  </div>;
}

type C1Raw = Record<keyof C1Input, string>;
const c1Labels: Record<keyof C1Input, string> = {
  inwardPortfolioDebt: '非居民·证券债务 ΔI', inwardPortfolioEquity: '非居民·证券股权/基金份额 ΔI', inwardOtherInvestment: '非居民·其他投资 ΔI',
  outwardPortfolioDebt: '居民·证券债务 ΔO', outwardPortfolioEquity: '居民·证券股权/基金份额 ΔO', outwardOtherInvestment: '居民·其他投资 ΔO',
  inwardThreshold: '非居民腿阈值 τᵢ', outwardThreshold: '居民腿阈值 τₒ',
};

function c1RawDefault(): C1Raw {
  return Object.fromEntries(Object.entries(c1Default).map(([key, value]) => [key, String(value)])) as C1Raw;
}

function parseC1(raw: C1Raw): { input: C1Input | null; errors: string[] } {
  const values: Partial<C1Input> = {};
  const errors: string[] = [];
  (Object.keys(c1Default) as (keyof C1Input)[]).forEach(key => {
    const value = /^-?(?:0|[1-9]\d*)$/.test(raw[key]) ? Number(raw[key]) : Number.NaN;
    const threshold = key === 'inwardThreshold' || key === 'outwardThreshold';
    const min = threshold ? 1 : -8;
    const max = 8;
    if (!Number.isInteger(value) || value < min || value > max) errors.push(c1Labels[key]);
    else values[key] = value;
  });
  return { input: errors.length ? null : values as C1Input, errors };
}

function C1Active() {
  const [raw, setRaw] = useState<C1Raw>(c1RawDefault);
  const parsed = parseC1(raw);
  const result = parsed.input ? calculateC1(parsed.input) : null;
  return <>
    <p className={styles.instructions}><b>编辑当前独立SYN：</b>六个互斥报告单元的变化为−8至+8整数，两个阈值为1至8整数。阈值被当作事前已冻结；本实验不会用当前结果反选阈值。范围外功能类别保持“未纳入”，不是经济零。</p>
    <div className={styles.controls} role="group" aria-label="C1 gross flow合成输入">{(Object.keys(c1Default) as (keyof C1Input)[]).map(key => {
      const threshold = key === 'inwardThreshold' || key === 'outwardThreshold';
      const invalid = parsed.errors.includes(c1Labels[key]);
      return <label htmlFor={`em-flow-C1-${key}`} key={key}><span>{c1Labels[key]}</span><input id={`em-flow-C1-${key}`} type="number" inputMode="numeric" min={threshold ? 1 : -8} max={8} step={1} value={raw[key]} aria-invalid={invalid} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [key]: value })); }} /><small>{threshold ? '1–8' : '−8至+8'}；unknown不得填0。</small></label>;
    })}</div>
    <button className={styles.reset} type="button" onClick={() => setRaw(c1RawDefault())}>恢复C1固定默认</button>
    <p className={styles.liveStatus} role="status" aria-live="polite">{result ? 'C1已按当前AUTHOR-SYN重算。' : `STOP · 不合法字段：${parsed.errors.join('；')}。旧结果已清除。`}</p>
    <div className={styles.results}>{result ? <C1ResultView result={result} /> : <p className={styles.stop}><b>STOP · 无数值结果：</b>修正输入前不沿用旧结果；STOP不是经济零。</p>}</div>
  </>;
}

function C2ResultView({ result }: { result: C2Result }) {
  const conclusion = result.additionalAttributeConclusion === 'no-migration-to-compare'
    ? '路线向量未变化，无替代可比较'
    : result.additionalAttributeConclusion === 'declared-additional-fields-match'
      ? '除路线定义外的已声明附加属性匹配；路线身份差异仍保留，不得称合同全面等价'
      : result.additionalAttributeConclusion === 'declared-additional-fields-mismatch'
        ? '除路线定义外，至少一项已声明附加属性不匹配；只在这些字段内判定'
        : '附加属性证据未知；结论未定，不得由“不能证明匹配”反推“不匹配”';
  return <>
    <div className={styles.tableWrap} role="region" aria-label="C2路线迁移结果" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">融资路线</th><th scope="col">前期</th><th scope="col">后期</th><th scope="col">变化</th><th scope="col">前期占比</th><th scope="col">后期占比</th></tr></thead><tbody>{result.routes.map(route => <tr key={route.key}><th scope="row">{route.label}</th><td>{route.before}</td><td>{route.after}</td><td>{format(route.change)}</td><td>{percent(route.beforeShare)}</td><td>{percent(route.afterShare)}</td></tr>)}</tbody></table></div>
    <div className={styles.resultGrid}>
      <article className={styles.resultCard}><h4>期间融资总量</h4><dl><dt>前期</dt><dd>{result.totalBefore}</dd><dt>后期</dt><dd>{result.totalAfter}</dd><dt>总量变化</dt><dd>{format(result.totalChange)}</dd></dl></article>
      <article className={styles.resultCard}><h4>到期现金窗口</h4><dl><dt>Rollover gap</dt><dd>{format(result.rolloverGap)}</dd><dt>Coverage surplus</dt><dd>{format(result.coverageSurplus)}</dd><dt>与期间总量同义？</dt><dd>否</dd><dt>组成占比可比？</dt><dd>{result.compositionComparable ? '是' : '否 · 存在零分母'}</dd></dl></article>
      <article className={styles.resultCard}><h4>替代判定</h4><dl><dt>路线向量改变</dt><dd>{result.routeVectorChanged ? '是' : '否'}</dd><dt>声明内结论</dt><dd>{conclusion}</dd></dl></article>
    </div>
    <p className={styles.nullPanel}><code>identifiedSupplyShock = null</code>；<code>realWorldRiskEstimate = null</code>。融资数量是供需共同决定的均衡量，构成变化也不是已识别供给冲击。</p>
  </>;
}

function C2FixedRecord() {
  const result = calculateC2(c2Default);
  const equivalent = calculateC2({ ...c2Default, additionalAttributesMatch: 'yes' });
  const notEquivalent = calculateC2({ ...c2Default, additionalAttributesMatch: 'no' });
  const noSubstitution = calculateC2({ ...c2Default, nonresidentBondAfter: 2 });
  const overcovered = calculateC2({ ...c2Default, committedRefinancingCash: 8, executableHedgeReceipts: 2 });
  return <div className={styles.fixedRecord}>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>四条路线按债权人居民身份×工具×一级融资定义：非居民银行短期外币贷款、非居民一级认购长期本币债、非居民一级认购且未构成直接投资关系的证券股权、居民银行本币贷款。同一合成企业、同一期间、每单位新融资只进入一个桶；二级市场转手、直接投资关联债与其他本地融资均在实验范围外。</p>
    <p className={styles.formula}>Fₜ = Σᵣqᵣ,ₜ；Δqᵣ = qᵣ,₁−qᵣ,₀；RolloverGap = max(0, M−R−H)；CoverageSurplus = max(0, R+H−M)。</p>
    <C2ResultView result={result} />
    <p><b>默认手算：</b>新融资向量由[8,2,1,1]变为[2,8,1,1]，两期总量都为12；非居民银行路线−6、非居民本币债一级认购+6。未来窗口旧外币债有6到期、4确定再融资现金、1可执行套保收款，所以gap=max(0,6−4−1)=1、surplus=0。期间新融资总量不变与旧债时点现金缺口为1可以同时成立。</p>
    <p><b>四态反证：</b>路线身份字段（债权人居民身份、工具及此处固定的币种／期限）本来就随路线迁移而改变；开关只比较路线定义之外的附加字段，如价格、担保、优先级与access。yes只表示这些附加字段匹配，绝不表示合同全面等价；no表示至少一项附加字段不匹配；默认unknown只报告证据不足；路线向量不变时没有迁移可比较。若后期债券仍为2而银行降至2，后期总融资为6，显示未被替代的数量缺口。</p>
    <p><b>超额覆盖反例：</b>M=6、R=8、H=2是合法状态：gap=0、surplus=4。R与H在本SYN中分别是确定再融资现金和可执行套保收款，来源互不重复；超额资金不是STOP，也不证明现实主体可自由调拨。</p>
    <p><b>STOP/null：</b>负数、非整数、任一路线或现金量超过12、存量与期间新融资混加、实体或时钟改变、R与H重复计入同一现金时STOP。任一期总量为0时，相关组成占比返回null，不伪造0%；属性unknown是合法未定状态，不是0、no或STOP。</p>
    <p className={styles.sourceLine}>机制依据：<a href="#ref-2">[2] </a><a href="#ref-9">[9] </a><a href="#ref-15">[15] </a><a href="#ref-16">[16] </a><a href="#ref-17">[17]</a>。来源支持路线与币种期限风险，不提供本实验参数。</p>
    <span hidden>{equivalent.additionalAttributeConclusion}{notEquivalent.additionalAttributeConclusion}{noSubstitution.totalAfter}{overcovered.coverageSurplus}</span>
  </div>;
}

type C2Raw = Record<Exclude<keyof C2Input, 'additionalAttributesMatch'>, string> & { additionalAttributesMatch: 'yes' | 'no' | 'unknown' };
const c2NumberKeys = (Object.keys(c2Default).filter(key => key !== 'additionalAttributesMatch')) as Exclude<keyof C2Input, 'additionalAttributesMatch'>[];
const c2Labels: Record<keyof C2Input, string> = {
  nonresidentBankBefore: '前期·非居民银行短期外币贷款', nonresidentBondBefore: '前期·非居民一级认购长期本币债', nonresidentEquityBefore: '前期·非居民证券股权一级认购', residentBankBefore: '前期·居民银行本币贷款',
  nonresidentBankAfter: '后期·非居民银行短期外币贷款', nonresidentBondAfter: '后期·非居民一级认购长期本币债', nonresidentEquityAfter: '后期·非居民证券股权一级认购', residentBankAfter: '后期·居民银行本币贷款',
  maturingFxDebt: '窗口内到期旧外币债 M', committedRefinancingCash: '确定再融资现金 R', executableHedgeReceipts: '可执行套保收款 H', additionalAttributesMatch: '路线定义之外的附加属性证据',
};

function c2RawDefault(): C2Raw {
  return Object.fromEntries(Object.entries(c2Default).map(([key, value]) => [key, String(value)])) as C2Raw;
}

function parseC2(raw: C2Raw): { input: C2Input | null; errors: string[] } {
  const values: Partial<C2Input> = { additionalAttributesMatch: raw.additionalAttributesMatch };
  const errors: string[] = [];
  c2NumberKeys.forEach(key => {
    const value = /^(?:0|[1-9]\d*)$/.test(raw[key]) ? Number(raw[key]) : Number.NaN;
    if (!Number.isInteger(value) || value < 0 || value > 12) errors.push(c2Labels[key]);
    else values[key] = value;
  });
  return { input: errors.length ? null : values as C2Input, errors };
}

function C2Active() {
  const [raw, setRaw] = useState<C2Raw>(c2RawDefault);
  const parsed = parseC2(raw);
  const result = parsed.input ? calculateC2(parsed.input) : null;
  return <>
    <p className={styles.instructions}><b>编辑当前独立SYN：</b>所有数量为0–12整数；M、R、H共享同一未来窗口，R与H来源互不重复，但允许R+H&gt;M并将超额显示为coverage surplus。附加属性状态只回答路线定义之外的已声明字段：unknown保持未定，yes/no也不能认证未声明的现实合同属性。</p>
    <div className={styles.controls} role="group" aria-label="C2融资路线合成输入">{c2NumberKeys.map(key => {
      const invalid = parsed.errors.includes(c2Labels[key]);
      return <label htmlFor={`em-flow-C2-${key}`} key={key}><span>{c2Labels[key]}</span><input id={`em-flow-C2-${key}`} type="number" inputMode="numeric" min={0} max={12} step={1} value={raw[key]} aria-invalid={invalid} onChange={event => { const value = event.currentTarget.value; setRaw(previous => ({ ...previous, [key]: value })); }} /><small>0–12，只接受整数。</small></label>;
    })}
      <label htmlFor="em-flow-C2-additionalAttributesMatch"><span>{c2Labels.additionalAttributesMatch}</span><select id="em-flow-C2-additionalAttributesMatch" value={raw.additionalAttributesMatch} onChange={event => { const value = event.currentTarget.value as 'yes' | 'no' | 'unknown'; setRaw(previous => ({ ...previous, additionalAttributesMatch: value })); }}><option value="unknown">未知 · 证据不足，结论未定</option><option value="yes">是 · 价格/担保/优先级/access等附加字段匹配</option><option value="no">否 · 至少一项附加字段不匹配</option></select><small>不含路线定义字段；unknown ≠ no，证据不足不得升级成否定事实。</small></label>
    </div>
    <button className={styles.reset} type="button" onClick={() => setRaw(c2RawDefault())}>恢复C2固定默认</button>
    <p className={styles.liveStatus} role="status" aria-live="polite">{result ? 'C2已按当前AUTHOR-SYN重算。' : `STOP · 不合法字段：${parsed.errors.join('；')}。旧结果已清除。`}</p>
    <div className={styles.results}>{result ? <C2ResultView result={result} /> : <p className={styles.stop}><b>STOP · 无数值结果：</b>修正输入前不沿用旧结果；STOP不是零融资。</p>}</div>
  </>;
}

export default function EmCapitalFlowLab({ id }: { id: EmCapitalFlowLabId }) {
  const lab = labMeta(id);
  useEffect(() => {
    document.documentElement.classList.add('em-flow-js');
    return () => document.documentElement.classList.remove('em-flow-js');
  }, []);
  return <section className={styles.lab} id={`em-flow-lab-${id}`} aria-labelledby={`em-flow-${id}-title`}>
    <div className={styles.labLead}><span className="section-kicker">AUTHOR-SYN LAB · {id}</span><h3 id={`em-flow-${id}-title`}>{lab.title}</h3><p>{lab.question}</p><p className={styles.passport}><b>实验护照：</b>{lab.passport}</p></div>
    <div className={`em-flow-interactive-only ${styles.dynamic}`}>{id === 'C1' ? <C1Active /> : <C2Active />}</div>
    <div className={`em-flow-nojs-fallback ${styles.static}`}><p className={styles.noJsNotice}><b>当前没有运行JavaScript：</b>互动控件已隐藏；下方冻结记录保留相同calculator、完整手算、反例、STOP/null与来源。</p>{id === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</div>
    <div className={`${styles.printRecord} ${styles.static}`}>{id === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</div>
  </section>;
}
