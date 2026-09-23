'use client';

import { useEffect, useState } from 'react';
import {
  c1Default,
  c1ExplicitWedge,
  c2Default,
  calculateC1,
  calculateC2,
  policyAutonomyLabs,
  type C1Input,
  type C1Result,
  type C2EconomyInput,
  type C2Input,
  type C2Result,
  type PolicyAutonomyLabId,
} from './policyAutonomyLabs';
import styles from './policyAutonomy.module.css';

function format(value: number, digits = 2) {
  if (Object.is(value, -0)) return '0';
  return String(Number(value.toFixed(digits))).replace('-', '−');
}

function formatNullable(value: number | null, suffix = '', digits = 2) {
  return value === null ? 'unknown · null' : `${format(value, digits)}${suffix}`;
}

function labMeta(id: PolicyAutonomyLabId) {
  const lab = policyAutonomyLabs.find(candidate => candidate.id === id);
  if (!lab) throw new Error(`Unknown 4.09 lab ${id}`);
  return lab;
}

const compatibilityLabels: Record<C1Result['compatibility'], string> = {
  'compatible-within-declared-benchmark': '在声明基准内相容',
  'incompatible-within-declared-benchmark': '在声明基准内不相容',
  'state-dependent-benchmark': '状态依赖 · 需补充区间与反应规则',
  'benchmark-not-applicable': '无摩擦经典基准不适用',
  unknown: 'unknown · 字段不足',
};

function C1ResultView({ result }: { result: C1Result }) {
  return <>
    <div className={styles.resultGrid}>
      <article className={styles.resultCard}><h4>制度相容性</h4><dl><dt>判定</dt><dd>{compatibilityLabels[result.compatibility]}</dd><dt>判定范围</dt><dd>仅声明基准</dd></dl></article>
      <article className={styles.resultCard}><h4>利率平价／楔子账本</h4><dl><dt>关系要求 i</dt><dd>{formatNullable(result.parityRequiredRate, '%')}</dd><dt>输入 i</dt><dd>{formatNullable(result.declaredDomesticRate, '%')}</dd><dt>残差 R</dt><dd>{formatNullable(result.parityResidual, 'pp')}</dd></dl></article>
      <article className={styles.resultCard}><h4>两个检查不可合并</h4><dl><dt>平价状态</dt><dd>{result.parityStatus === 'closed' ? 'closed' : result.parityStatus === 'open' ? 'open' : 'unknown'}</dd><dt>算术闭合</dt><dd>{result.residualClosed === null ? 'null' : result.residualClosed ? '是' : '否'}</dd><dt>经验结论</dt><dd>null</dd></dl></article>
    </div>
    {result.missingParityFields.length ? <p className={styles.boundary}><b>平价账本保持unknown：</b>缺少 {result.missingParityFields.join('、')}；要求利率、残差和闭合状态均不推断。制度相容性仍只按独立的制度声明判断。unknown不是0，也不是“不相容”。</p> : null}
    <p className={styles.nullPanel}><code>financialConditionInsulation = null</code>；<code>capitalFlowDirection = null</code>；<code>reservePath = null</code>；<code>policyEffect = null</code>；<code>welfare = null</code>。算术残差与制度相容性也彼此独立：一个关系闭合，不会让三项持续承诺自动相容。</p>
  </>;
}

function C1FixedRecord() {
  const result = calculateC1(c1Default);
  const explicitWedgeResult = calculateC1(c1ExplicitWedge);
  const floatResult = calculateC1({ ...c1Default, exchangeCommitment: 'float' });
  const managedResult = calculateC1({ ...c1Default, exchangeCommitment: 'band-or-managed' });
  const segmentedResult = calculateC1({ ...c1Default, effectiveCapitalMobility: 'segmented-or-wedged' });
  const unknownResult = calculateC1({ ...c1Default, assetComparability: 'unknown' });
  return <div className={styles.fixedRecord}>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>这是MODEL-SYN相容性账本，不是现实国家压力测试。汇率承诺、有效资本流动、独立利率路径与资产可比是显式声明；利率单位均为年化百分点，S表示一单位外币的本币价格，所以预期贬值为正。</p>
    <p className={styles.formula}>i = i* + E(Δs) + ρ + τ；R = i − [i* + E(Δs) + ρ + τ]</p>
    <div className={styles.tableWrap} role="region" aria-label="C1冻结输入与手算" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">声明／数值</th><th scope="col">冻结输入</th><th scope="col">它不代表什么</th></tr></thead><tbody>
      <tr><th scope="row">制度声明</th><td>可信硬盯住；有效资本流动高；资产可比已确认；国内利率路径要独立设定</td><td>不代表这些字段已在现实中测得</td></tr>
      <tr><th scope="row">经典无楔子字段</th><td>i=4，i*=4，E(Δs)=0，ρ=0，τ=0</td><td>0表示作者明确声明为零，不等于未知</td></tr>
      <tr><th scope="row">手算</th><td>要求利率=4+0+0+0=4；R=4−4=0</td><td>残差0不证明三项制度承诺相容、市场有效或政策最优</td></tr>
    </tbody></table></div>
    <C1ResultView result={result} />
    <p><b>显式楔子示例：</b>另把制度声明切换为“区间或管理安排／有效流动存在分割或楔子”，再设i=6、i*=4、E(Δs)=1、ρ=0.5、τ=0.5；要求利率为{formatNullable(explicitWedgeResult.parityRequiredRate, '%')}且R={formatNullable(explicitWedgeResult.parityResidual, 'pp')}。此时制度栏明确返回“{compatibilityLabels[explicitWedgeResult.compatibility]}”，只有独立的平价账本闭合；不得把这些楔子倒写进上面的硬盯住、无摩擦经典基准。</p>
    <p><b>反证组：</b>硬盯住改为浮动，经典固定汇率承诺被放松，返回“基准内相容”，但金融条件隔离仍为null；区间或管理安排必须返回状态依赖，不能自动判相容；有效流动改为分割，返回“无摩擦基准不适用”；资产可比为unknown时，相容性保持unknown。四种输出分别为：{compatibilityLabels[floatResult.compatibility]}、{compatibilityLabels[managedResult.compatibility]}、{compatibilityLabels[segmentedResult.compatibility]}、{compatibilityLabels[unknownResult.compatibility]}。</p>
    <p><b>unknown与STOP：</b>五个数值字段允许输入字面量unknown，只暂停平价账本而不改写制度相容性；0表示已知为零。空白、非数值（unknown除外）、非有限值或超出[−20,50]才STOP并清除旧结果。制度枚举unknown也不替用户猜。现实资本流、储备变化、危机、稳定效果与福利永远不由此实验生成。</p>
    <p className={styles.sourceLine}>机制依据：<a href="#ref-1">[1] </a><a href="#ref-2">[2] </a><a href="#ref-3">[3] </a><a href="#ref-5">[5] </a><a href="#ref-30">[30] </a><a href="#ref-31">[31] </a><a href="#ref-32">[32] </a><a href="#ref-33">[33]</a>。来源支持模型关系、制度权衡与现实楔子，不提供本实验参数。</p>
  </div>;
}

type C1EnumKey = 'exchangeCommitment' | 'effectiveCapitalMobility' | 'domesticRatePathIndependent' | 'assetComparability';
type C1NumberKey = Exclude<keyof C1Input, C1EnumKey>;
type C1Raw = { [K in keyof C1Input]: string };
const c1NumberKeys: C1NumberKey[] = ['domesticRate', 'foreignRate', 'expectedDepreciation', 'riskLiquidityPremium', 'segmentationCostWedge'];
const c1NumberLabels: Record<C1NumberKey, string> = {
  domesticRate: '国内利率 i（%）',
  foreignRate: '外部利率 i*（%）',
  expectedDepreciation: '预期本币贬值 E(Δs)（%）',
  riskLiquidityPremium: '风险／流动性溢价 ρ（%）',
  segmentationCostWedge: '分割／交易楔子 τ（%）',
};

function c1RawDefault(): C1Raw {
  return Object.fromEntries(Object.entries(c1Default).map(([key, value]) => [key, String(value)])) as C1Raw;
}

function parseC1(raw: C1Raw): { input: C1Input | null; errors: string[] } {
  const errors: string[] = [];
  const numbers = {} as Record<C1NumberKey, number | null>;
  c1NumberKeys.forEach(key => {
    const token = raw[key].trim();
    if (token.toLowerCase() === 'unknown') numbers[key] = null;
    else {
      const value = token === '' ? Number.NaN : Number(token);
      if (!Number.isFinite(value) || value < -20 || value > 50) errors.push(c1NumberLabels[key]);
      else numbers[key] = value;
    }
  });
  if (errors.length) return { input: null, errors };
  return { input: {
    exchangeCommitment: raw.exchangeCommitment as C1Input['exchangeCommitment'],
    effectiveCapitalMobility: raw.effectiveCapitalMobility as C1Input['effectiveCapitalMobility'],
    domesticRatePathIndependent: raw.domesticRatePathIndependent as C1Input['domesticRatePathIndependent'],
    assetComparability: raw.assetComparability as C1Input['assetComparability'],
    ...numbers,
  }, errors };
}

function C1Active() {
  const [raw, setRaw] = useState<C1Raw>(c1RawDefault);
  const parsed = parseC1(raw);
  const result = parsed.input ? calculateC1(parsed.input) : null;
  const set = (key: keyof C1Input, value: string) => setRaw(previous => ({ ...previous, [key]: value }));
  return <>
    <p className={styles.instructions}><b>编辑当前MODEL-SYN：</b>先改制度声明，再改五个回报字段。相容性只使用声明状态，利率关系只计算楔子账本；界面故意不把两个结果混成一个“自主性分数”。</p>
    <div className={styles.controls} role="group" aria-label="C1三元约束相容性输入">
      <fieldset><legend>制度声明</legend>
        <label htmlFor="pa-c1-exchange"><span>汇率承诺</span><select id="pa-c1-exchange" value={raw.exchangeCommitment} onChange={event => set('exchangeCommitment', event.currentTarget.value)}><option value="credible-hard-peg">可信硬盯住</option><option value="band-or-managed">区间或管理安排</option><option value="float">浮动</option><option value="unknown">unknown</option></select><small>标签只代表当前SYN声明。</small></label>
        <label htmlFor="pa-c1-mobility"><span>有效资本流动</span><select id="pa-c1-mobility" value={raw.effectiveCapitalMobility} onChange={event => set('effectiveCapitalMobility', event.currentTarget.value)}><option value="frictionless-high">高且近似无摩擦</option><option value="segmented-or-wedged">分割或有楔子</option><option value="unknown">unknown</option></select><small>de jure开放不自动等于本项。</small></label>
        <label htmlFor="pa-c1-independent"><span>国内利率路径是否独立指定</span><select id="pa-c1-independent" value={raw.domesticRatePathIndependent} onChange={event => set('domesticRatePathIndependent', event.currentTarget.value)}><option value="yes">是</option><option value="no">否</option><option value="unknown">unknown</option></select><small>这是政策声明，不是最终效果。</small></label>
        <label htmlFor="pa-c1-comparable"><span>比较资产是否可比</span><select id="pa-c1-comparable" value={raw.assetComparability} onChange={event => set('assetComparability', event.currentTarget.value)}><option value="confirmed">已确认可比</option><option value="confirmed-not-comparable">已确认不可比</option><option value="unknown">unknown／尚未确认</option></select><small>需统一币种、期限、信用、抵押与结算；未确认属于unknown。</small></label>
      </fieldset>
      <fieldset><legend>回报与楔子</legend>{c1NumberKeys.map(key => {
        const invalid = parsed.errors.includes(c1NumberLabels[key]);
        return <label htmlFor={`pa-c1-${key}`} key={key}><span>{c1NumberLabels[key]}</span><input id={`pa-c1-${key}`} type="text" inputMode="decimal" value={raw[key]} aria-invalid={invalid} onChange={event => set(key, event.currentTarget.value)} /><small>−20至50或字面量unknown；空白非法，unknown不能填0替代。</small></label>;
      })}</fieldset>
    </div>
    <div className={styles.buttonRow}><button className={styles.reset} type="button" onClick={() => setRaw(c1RawDefault())}>恢复经典无楔子默认</button><button className={styles.reset} type="button" onClick={() => setRaw(Object.fromEntries(Object.entries(c1ExplicitWedge).map(([key, value]) => [key, String(value)])) as C1Raw)}>载入放松制度假设的显式楔子示例</button></div>
    <p className={styles.liveStatus} role="status" aria-live="polite">{result ? 'C1已按当前合成声明重算；现实结果仍保持null。' : `STOP · 不合法字段：${parsed.errors.join('；')}。旧结果已清除。`}</p>
    <div className={styles.results}>{result ? <C1ResultView result={result} /> : <p className={styles.stop}><b>STOP · 无数值结果：</b>修正输入前不沿用旧结果。</p>}</div>
  </>;
}

const accessLabels: Record<C2EconomyInput['creditAccess'], string> = { open: '开放', partial: '部分可得', closed: '关闭', unknown: 'unknown' };

function C2ResultView({ result }: { result: C2Result }) {
  const rows = [['A', result.economyA], ['B', result.economyB]] as const;
  return <>
    <p className={styles.subResultLabel}><b>派生算术：</b>计算器只由外币现金桥推导FX cash gap与coverage surplus。</p>
    <div className={styles.tableWrap} role="region" aria-label="C2匿名经济体外币现金桥派生结果" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">经济体</th><th scope="col">到期外币债</th><th scope="col">可执行外币资源</th><th scope="col">FX cash gap</th><th scope="col">coverage surplus</th><th scope="col">本币替代容量</th></tr></thead><tbody>{rows.map(([name, economy]) => <tr key={name}><th scope="row">{name}</th><td>{format(economy.maturingFxDebt)}</td><td>{format(economy.fxRevenue + economy.executableHedgeReceipts + economy.committedExternalRollover + economy.usableFxReplacement)}</td><td>{format(economy.fxCashGap)}</td><td>{format(economy.fxCoverageSurplus)}</td><td>{format(economy.localCurrencyReplacementCapacity)}（未扣减FX gap）</td></tr>)}</tbody></table></div>
    <p className={styles.subResultLabel}><b>作者独立输入：</b>信用价格、数量和准入不是FX gap的函数，也不是A/B因果处理效果。</p>
    <div className={styles.tableWrap} role="region" aria-label="C2匿名经济体独立信用观察" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">经济体</th><th scope="col">信用利差变化</th><th scope="col">信用数量变化</th><th scope="col">信用准入</th><th scope="col">证据身份</th></tr></thead><tbody>{rows.map(([name, economy]) => <tr key={name}><th scope="row">{name}</th><td>{format(economy.creditSpreadChangeBp)}bp</td><td>{format(economy.creditQuantityChange)}</td><td>{accessLabels[economy.creditAccess]}</td><td>AUTHOR-SYN独立声明</td></tr>)}</tbody></table></div>
    <div className={styles.resultGrid}>
      <article className={styles.resultCard}><h4>共同声明路径</h4><dl><dt>同一外部利率变化</dt><dd>按构造</dd><dt>声明路径变化比</dt><dd>{result.localToExternalRateChangeRatio === null ? 'null · 分母0' : `${format(result.localToExternalRateChangeRatio * 100, 1)}%`}</dd><dt>pass-through</dt><dd>未识别</dd></dl></article>
      <article className={styles.resultCard}><h4>外币现金派生量</h4><dl><dt>A gap／surplus</dt><dd>{format(result.economyA.fxCashGap)}／{format(result.economyA.fxCoverageSurplus)}</dd><dt>B gap／surplus</dt><dd>{format(result.economyB.fxCashGap)}／{format(result.economyB.fxCoverageSurplus)}</dd><dt>缺口不同</dt><dd>{result.gapsDiffer ? '是' : '否'}</dd></dl></article>
      <article className={styles.resultCard}><h4>禁止升级</h4><dl><dt>本币容量扣减FX缺口</dt><dd>否</dd><dt>因果／福利</dt><dd>null</dd></dl></article>
    </div>
    <p className={styles.nullPanel}><code>identifiedExternalShock = null</code>；<code>financialConditionInsulation = null</code>；<code>policyEffect = null</code>；<code>welfare = null</code>。同一路径与不同结果只演示“政策率自主不等于主体金融条件隔离”，不识别现实效果。</p>
  </>;
}

function C2FixedRecord() {
  const result = calculateC2(c2Default);
  const zeroChange = calculateC2({ ...c2Default, externalRateChangeBp: 0 });
  const overcovered = calculateC2({ ...c2Default, economyB: { ...c2Default.economyB, fxRevenue: 8, executableHedgeReceipts: 4, committedExternalRollover: 3, usableFxReplacement: 3 } });
  return <div className={styles.fixedRecord}>
    <p className={styles.fixedWarning}><b>无脚本／纸本等价：</b>这是两个匿名AUTHOR-SYN经济体的并列表，不是因果matched pair或处理组／对照组。A与B共享作者声明的外部利率+100bp、本地政策率+25bp和同一未来现金窗口；现金桥分别声明到期额、外币收入、可执行对冲、已承诺续作、可用外币替代与本币容量。信用价格、数量和access是另一组独立输入，不由现金缺口机械生成。</p>
    <p className={styles.formula}>FXGap = max[0, 到期外币债 − 外币收入 − 可执行套保收款 − 已承诺外部续作 − 可用外币替代]</p>
    <C2ResultView result={result} />
    <p><b>默认手算：</b>A的外币资源为4+3+3+2=12，gap=max(0,12−12)=0；B的资源为1+1+3+1=6，gap=max(0,12−6)=6。B虽有8单位本币替代容量，但没有声明即时换汇与可用外汇路线，所以不得拿8去消灭外币时点缺口。两国本地政策率路径相同，却可同时出现35bp与110bp的信用利差变化、−2与−7的信用量变化以及不同准入状态。</p>
    <p><b>零分母与过度覆盖：</b>若外部利率变化改为0，25/0不会伪造为0或无穷；声明路径变化比返回{zeroChange.localToExternalRateChangeRatio === null ? 'null' : '非预期数值'}，它在任何情况下都不是已识别pass-through。过度覆盖记录中，B的资源为18、到期额为12，因此gap={format(overcovered.economyB.fxCashGap)}、coverage surplus={format(overcovered.economyB.fxCoverageSurplus)}；界面明确显示超额覆盖而不制造负缺口。</p>
    <p><b>STOP/null：</b>现金输入必须在[0,40]，利差与利率bp在[−1000,2000]，信用数量变化在[−40,40]；输入为空或非有限值时STOP。负到期额与用本币容量无条件抵扣外币支付均禁止。共同政策路径不是已识别处理，匿名差异不是国家脆弱性排名。</p>
    <p className={styles.sourceLine}>机制依据：<a href="#ref-9">[9] </a><a href="#ref-17">[17] </a><a href="#ref-18">[18] </a><a href="#ref-19">[19] </a><a href="#ref-20">[20] </a><a href="#ref-23">[23] </a><a href="#ref-35">[35]</a>。来源支持条件化机制，不提供A/B参数或现实政策效果。</p>
  </div>;
}

type EconomyNumberKey = Exclude<keyof C2EconomyInput, 'creditAccess'>;
type C2Raw = {
  externalRateChangeBp: string;
  sharedLocalPolicyRateChangeBp: string;
  economyA: Record<keyof C2EconomyInput, string>;
  economyB: Record<keyof C2EconomyInput, string>;
};
const economyNumberKeys: EconomyNumberKey[] = ['maturingFxDebt', 'fxRevenue', 'executableHedgeReceipts', 'committedExternalRollover', 'usableFxReplacement', 'localCurrencyReplacementCapacity', 'creditSpreadChangeBp', 'creditQuantityChange'];
const cashNumberKeys: EconomyNumberKey[] = ['maturingFxDebt', 'fxRevenue', 'executableHedgeReceipts', 'committedExternalRollover', 'usableFxReplacement', 'localCurrencyReplacementCapacity'];
const creditNumberKeys: EconomyNumberKey[] = ['creditSpreadChangeBp', 'creditQuantityChange'];
const economyLabels: Record<EconomyNumberKey, string> = {
  maturingFxDebt: '到期外币债', fxRevenue: '外币收入', executableHedgeReceipts: '可执行套保收款', committedExternalRollover: '已承诺外部续作', usableFxReplacement: '可用外币替代', localCurrencyReplacementCapacity: '本币替代容量', creditSpreadChangeBp: '信用利差变化（bp）', creditQuantityChange: '信用数量变化',
};

function c2RawDefault(): C2Raw {
  const mapEconomy = (economy: C2EconomyInput) => Object.fromEntries(Object.entries(economy).map(([key, value]) => [key, String(value)])) as Record<keyof C2EconomyInput, string>;
  return { externalRateChangeBp: String(c2Default.externalRateChangeBp), sharedLocalPolicyRateChangeBp: String(c2Default.sharedLocalPolicyRateChangeBp), economyA: mapEconomy(c2Default.economyA), economyB: mapEconomy(c2Default.economyB) };
}

function parseC2(raw: C2Raw): { input: C2Input | null; errors: string[] } {
  const errors: string[] = [];
  const parseRange = (value: string, label: string, min: number, max: number) => {
    const number = value.trim() === '' ? Number.NaN : Number(value);
    if (!Number.isFinite(number) || number < min || number > max) errors.push(label);
    return number;
  };
  const externalRateChangeBp = parseRange(raw.externalRateChangeBp, '外部利率变化', -1000, 2000);
  const sharedLocalPolicyRateChangeBp = parseRange(raw.sharedLocalPolicyRateChangeBp, '共同本地政策率变化', -1000, 2000);
  const parseEconomy = (name: 'A' | 'B', economy: C2Raw['economyA']): C2EconomyInput => {
    const values = {} as Record<EconomyNumberKey, number>;
    economyNumberKeys.forEach(key => {
      const bp = key === 'creditSpreadChangeBp';
      const quantity = key === 'creditQuantityChange';
      values[key] = parseRange(economy[key], `${name}·${economyLabels[key]}`, bp ? -1000 : quantity ? -40 : 0, bp ? 2000 : quantity ? 40 : 40);
    });
    return { ...values, creditAccess: economy.creditAccess as C2EconomyInput['creditAccess'] };
  };
  const economyA = parseEconomy('A', raw.economyA);
  const economyB = parseEconomy('B', raw.economyB);
  return { input: errors.length ? null : { externalRateChangeBp, sharedLocalPolicyRateChangeBp, economyA, economyB }, errors };
}

function C2Active() {
  const [raw, setRaw] = useState<C2Raw>(c2RawDefault);
  const parsed = parseC2(raw);
  const result = parsed.input ? calculateC2(parsed.input) : null;
  const setTop = (key: 'externalRateChangeBp' | 'sharedLocalPolicyRateChangeBp', value: string) => setRaw(previous => ({ ...previous, [key]: value }));
  const setEconomy = (name: 'economyA' | 'economyB', key: keyof C2EconomyInput, value: string) => setRaw(previous => ({ ...previous, [name]: { ...previous[name], [key]: value } }));
  return <>
    <p className={styles.instructions}><b>编辑当前AUTHOR-SYN：</b>先固定共同外部变化和共同政策率路径，再分别改A/B外币现金桥；信用价格、数量与access放在第二层，始终作为独立作者观察。A/B不是因果matched pair。所有现金资源必须已可执行且不重复；本币替代容量始终另栏。</p>
    <div className={styles.controls} role="group" aria-label="C2匿名经济体配对输入">
      <fieldset><legend>共同声明路径</legend>{(['externalRateChangeBp', 'sharedLocalPolicyRateChangeBp'] as const).map(key => { const label = key === 'externalRateChangeBp' ? '外部利率变化（bp）' : '共同本地政策率变化（bp）'; const invalid = parsed.errors.includes(label); return <label htmlFor={`pa-c2-${key}`} key={key}><span>{label}</span><input id={`pa-c2-${key}`} type="number" inputMode="decimal" min={-1000} max={2000} step="1" value={raw[key]} aria-invalid={invalid} onChange={event => setTop(key, event.currentTarget.value)} /><small>−1000至2000；外部变化为0时声明路径变化比返回null，且任何数值都不等于已识别pass-through。</small></label>; })}</fieldset>
      {(['economyA', 'economyB'] as const).map(name => <fieldset key={name}><legend>匿名经济体 {name === 'economyA' ? 'A' : 'B'} · 现金桥</legend>{cashNumberKeys.map(key => {
        const label = `${name === 'economyA' ? 'A' : 'B'}·${economyLabels[key]}`;
        const invalid = parsed.errors.includes(label);
        return <label htmlFor={`pa-c2-${name}-${key}`} key={key}><span>{economyLabels[key]}</span><input id={`pa-c2-${name}-${key}`} type="number" inputMode="decimal" min={0} max={40} step="1" value={raw[name][key]} aria-invalid={invalid} onChange={event => setEconomy(name, key, event.currentTarget.value)} /><small>0至40。</small></label>;
      })}</fieldset>)}
    </div>
    <details className={styles.secondPass}><summary>第二层 · 展开A/B独立信用观察（不是FX gap派生量）</summary><p>以下价格、数量与准入由作者另行声明，只用于提醒金融条件是向量；它们与上方现金桥同时存在，不构成处理—结果关系。</p><div className={styles.controls}>{(['economyA', 'economyB'] as const).map(name => <fieldset key={name}><legend>匿名经济体 {name === 'economyA' ? 'A' : 'B'} · 独立观察</legend>{creditNumberKeys.map(key => { const label = `${name === 'economyA' ? 'A' : 'B'}·${economyLabels[key]}`; const invalid = parsed.errors.includes(label); const bp = key === 'creditSpreadChangeBp'; return <label htmlFor={`pa-c2-${name}-${key}`} key={key}><span>{economyLabels[key]}</span><input id={`pa-c2-${name}-${key}`} type="number" inputMode="decimal" min={bp ? -1000 : -40} max={bp ? 2000 : 40} step="1" value={raw[name][key]} aria-invalid={invalid} onChange={event => setEconomy(name, key, event.currentTarget.value)} /><small>{bp ? '−1000至2000bp' : '−40至40'}；不由现金缺口生成。</small></label>; })}<label htmlFor={`pa-c2-${name}-access`}><span>信用准入</span><select id={`pa-c2-${name}-access`} value={raw[name].creditAccess} onChange={event => setEconomy(name, 'creditAccess', event.currentTarget.value)}><option value="open">开放</option><option value="partial">部分可得</option><option value="closed">关闭</option><option value="unknown">unknown</option></select><small>准入不由利差、数量或FX gap自动推断。</small></label></fieldset>)}</div></details>
    <button className={styles.reset} type="button" onClick={() => setRaw(c2RawDefault())}>恢复C2冻结默认</button>
    <p className={styles.liveStatus} role="status" aria-live="polite">{result ? 'C2已按当前合成配对重算；因果、隔离和福利仍保持null。' : `STOP · 不合法字段：${parsed.errors.join('；')}。旧结果已清除。`}</p>
    <div className={styles.results}>{result ? <C2ResultView result={result} /> : <p className={styles.stop}><b>STOP · 无数值结果：</b>修正输入前不沿用旧结果。</p>}</div>
  </>;
}

export default function PolicyAutonomyLab({ id }: { id: PolicyAutonomyLabId }) {
  const meta = labMeta(id);
  useEffect(() => {
    document.documentElement.classList.add('policy-autonomy-js');
    return () => document.documentElement.classList.remove('policy-autonomy-js');
  }, []);
  return <aside className={styles.lab} aria-labelledby={`policy-autonomy-${id}-title`}>
    <div className={styles.labLead}><p className="section-kicker">{id} · FINITE SYNTHETIC LAB</p><h3 id={`policy-autonomy-${id}-title`}>{meta.title}</h3><p>{meta.question}</p><p className={styles.passport}><b>实验护照：</b>{meta.passport}</p></div>
    <div className={`${styles.dynamic} policy-autonomy-interactive-only`}>{id === 'C1' ? <C1Active /> : <C2Active />}</div>
    <details className={`${styles.static} policy-autonomy-static-details`}><summary>展开固定记录、手算、反例与STOP/null边界</summary>{id === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</details>
    <div className={`${styles.static} ${styles.printRecord} policy-autonomy-print-record`} aria-hidden="true">{id === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</div>
    <div className={`${styles.static} policy-autonomy-nojs-fallback`}><p className={styles.noJsNotice}><b>无脚本模式：</b>交互控件未执行；以下固定记录与同源calculator默认值等价。</p>{id === 'C1' ? <C1FixedRecord /> : <C2FixedRecord />}</div>
  </aside>;
}
