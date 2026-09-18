import TreasuryCurveMechanismLab from './TreasuryCurveMechanismLab';
import { treasuryCurveLabs } from './treasuryCurveLabDefinitions';
import type { TreasuryCurveLab } from './treasuryCurveLabDefinitions';
import { formatSigned, type TreasuryCurveChartValue, type TreasuryCurveLabId } from './treasuryCurveFixtures';
import styles from './treasuryCurve.module.css';

function labFor(labId: TreasuryCurveLabId): TreasuryCurveLab {
  const lab = treasuryCurveLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`Unknown Treasury curve lab: ${labId}`);
  return lab;
}

function scalar(value: unknown): string {
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) throw Error('4.04 fixed records accept finite numbers only.');
    return (value === 0 ? '0' : String(Number(value.toPrecision(12)))).replace('-', '−');
  }
  if (typeof value === 'string') return value;
  if (value === null) return 'unknown／未识别（不是0）';
  return String(value);
}

function LabSources({ labId, screenOnly = false }: { labId: TreasuryCurveLabId; screenOnly?: boolean }) {
  const lab = labFor(labId);
  return <p className={`section-sources ${styles.sources}${screenOnly ? ` ${styles.screenSources}` : ''}`}>
    机制依据：{lab.sourceIds.map(sourceId => <a key={sourceId} href={`#ref-${sourceId}`} aria-label={`${labId}实验参考文献${sourceId}`}>[{sourceId}] </a>)}。
    来源只支持定义、机制与口径边界；所有参数、阈值、曲线、冲击和结果均为作者SYN，不是来源数据、现实校准、point-in-time（PIT，历史时点当时可得）资料、因果估计、预测、收益或生产信号。
  </p>;
}

function FixedChart({ labId, values, label = '固定默认图' }: { labId: TreasuryCurveLabId; values: readonly TreasuryCurveChartValue[]; label?: string }) {
  const lab = labFor(labId);
  values.forEach(value => {
    if (value !== null && !Number.isFinite(value)) throw Error(`4.04 ${labId} fixed chart accepts finite numbers or explicit null only.`);
  });
  const numericValues = values.filter((value): value is number => value !== null);
  const maxAbs = Math.max(1, ...numericValues.map(value => Math.abs(value)));

  return <figure className={styles.chart} aria-label={`${labId}${label}：${lab.chartTitle}`}>
    <figcaption>
      <b>{lab.chartTitle}</b>
      <span>零轴居中；长度只在本实验内部比较。负值不是错误，0也不代表unknown。</span>
    </figcaption>
    <div className={styles.chartRows}>
      {values.map((value, index) => {
        if (value === null) return <div className={styles.chartRow} data-static-chart-null="true" key={`${labId}-fixed-${lab.chartLabels[index] ?? index}`}>
          <span>{lab.chartLabels[index] ?? `value ${index + 1}`}</span>
          <div className={styles.signedTrack} aria-hidden="true" />
          <b>null — 未识别</b>
        </div>;
        const width = Math.max(value === 0 ? 0 : 1.5, Math.abs(value) / maxAbs * 49);
        const position = value < 0 ? { right: '50%', width: `${width}%` } : { left: '50%', width: `${width}%` };
        return <div className={styles.chartRow} data-static-chart-null="false" key={`${labId}-fixed-${lab.chartLabels[index] ?? index}`}>
          <span>{lab.chartLabels[index] ?? `value ${index + 1}`}</span>
          <div className={styles.signedTrack} aria-hidden="true"><i className={value < 0 ? styles.negative : undefined} style={position} /></div>
          <b>{formatSigned(value, '', Math.abs(value) >= 100 ? 0 : 2)}</b>
        </div>;
      })}
    </div>
  </figure>;
}

function FixedRecord({ labId }: { labId: TreasuryCurveLabId }) {
  const lab = labFor(labId);
  const result = lab.display(lab.initial);
  if (result.status !== 'OK') throw Error(`${labId} fixed default must not STOP.`);

  return <div className={styles.fixedRecord}>
    <h4 className={styles.recordHeading}>{labId}固定默认记录 · DEFAULT SYN</h4>
    <p className={styles.fixedWarning}><b>固定记录不随控件变化：</b>六个C彼此独立，没有共同证券、组合、交易、日期或冲击路径；打印与无脚本版本只绑定本卡列出的默认输入。</p>
    <p className={styles.recordLabel}><b>完整固定输入：</b></p>
    <dl className={styles.inputRecord} aria-label={`${labId}完整固定默认输入`}>
      {lab.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{scalar(lab.initial[field.key])}</dd></div>)}
    </dl>
    <p className={styles.recordLabel}><b>完整固定结果：</b></p>
    <dl className={styles.recordValues} aria-label={`${labId}完整固定默认结果`}>
      {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
    </dl>
    <FixedChart labId={labId} values={result.chart} />
    <p className={styles.rebuild}><b>默认手算：</b>{lab.defaultRebuild}</p>
    <div className={styles.recordTail}>
      <p><b>必要公式：</b>{lab.formula.join('；')}。</p>
      <p><b>只改一个条件：</b>{lab.changeCondition}</p>
      <p><b>极端输入：</b>{lab.extremes.join('；')}</p>
      <p><b>常见误解：</b>{lab.misconception}</p>
      <p><b>反例：</b>{lab.counterexample}</p>
      <p><b>仍缺证据：</b>{lab.unknownWarning}</p>
      <p><b>不可破坏的不变量：</b>{lab.invariants.join('；')}</p>
      <LabSources labId={labId} />
    </div>
  </div>;
}

function C6UnknownRecord() {
  const lab = labFor('C6');
  const input: Readonly<Record<string, number | string>> = { ...lab.initial, driver: 'unknown' };
  const result = lab.display(input);
  if (result.status !== 'OK' || !result.chartValues) throw Error('C6 fixed unknown counterexample must expose explicit nullable chart values.');

  return <div className={styles.fixedRecord} data-treasury-curve-static-unknown="C6">
    <h4 className={styles.recordHeading}>C6固定unknown反例 · UNKNOWN IS NOT ZERO</h4>
    <p className={styles.fixedWarning}><b>未识别不是经济零：</b>本记录只把driver从默认policy改为unknown。Expected short、Term premium与FX/funding保持null，不画数值柱、不显示0.00、不参与scale；独立给定的Reverse spillover仍照实显示。</p>
    <p className={styles.recordLabel}><b>完整固定输入：</b></p>
    <dl className={styles.inputRecord} aria-label="C6 unknown反例完整固定输入">
      {lab.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{scalar(input[field.key])}</dd></div>)}
    </dl>
    <p className={styles.recordLabel}><b>完整固定结果：</b></p>
    <dl className={styles.recordValues} aria-label="C6 unknown反例完整固定结果">
      {result.rows.map(([rowLabel, value]) => <div key={rowLabel}><dt>{rowLabel}</dt><dd>{value}</dd></div>)}
    </dl>
    <FixedChart labId="C6" values={result.chartValues} label="unknown反例图" />
    <p className={styles.rebuild}><b>状态合同：</b>driver=unknown → [expected short, term premium, FX/funding] = [null, null, null]；Reverse spillover = {scalar(input.reverseBp)} bp。只有最后一项是已给定数值。</p>
    <div className={styles.recordTail}>
      <p><b>缩放边界：</b>三个null行保留标签与空轨道，只有有限数值才进入长度标度。</p>
      <p><b>恢复边界：</b>把driver切回policy、growth或funding后，三个分支才重新显示SYN数值。</p>
      <LabSources labId="C6" />
    </div>
  </div>;
}

export default function TreasuryCurveLabStatic({ labId }: { labId: TreasuryCurveLabId }) {
  const lab = labFor(labId);
  return <aside id={`treasury-curve-lab-${labId}`} className={styles.static} aria-labelledby={`treasury-curve-lab-${labId}-title`}>
    <div className={styles.labLead}>
      <header className={styles.labHeader}>
        <span className="section-kicker">{labId} · 独立SYN／动态重算／静态孪生</span>
        <h3 id={`treasury-curve-lab-${labId}-title`}>{lab.title}</h3>
      </header>
      <p>{lab.question}</p>
      <p className={styles.passport}><b>实验护照：</b>{lab.passport}</p>
    </div>
    <TreasuryCurveMechanismLab labId={labId} />
    <details>
      <summary>{labId}固定输入、完整结果、手算、极端值、反例与来源（无需JavaScript）</summary>
      <FixedRecord labId={labId} />
    </details>
    <div className={styles.printRecord}><FixedRecord labId={labId} /></div>
    {labId === 'C6' ? <>
      <details open>
        <summary>C6 unknown反例：null、数值柱与reverse spillover（无需JavaScript）</summary>
        <C6UnknownRecord />
      </details>
      <div className={styles.printRecord}><C6UnknownRecord /></div>
    </> : null}
    <LabSources labId={labId} screenOnly />
  </aside>;
}
