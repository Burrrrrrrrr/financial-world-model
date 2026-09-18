import { treasuryCurveLabs } from './treasuryCurveLabDefinitions';
import { formatSigned, type TreasuryCurveChartValue, type TreasuryCurveLabId } from './treasuryCurveFixtures';
import styles from './treasuryCurve.module.css';

export default function TreasuryCurveLabChart({ labId, values }: { labId: TreasuryCurveLabId; values: readonly TreasuryCurveChartValue[] }) {
  const lab = treasuryCurveLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`Unknown Treasury curve lab: ${labId}`);
  values.forEach(value => {
    if (value !== null && !Number.isFinite(value)) throw Error(`4.04 ${labId} chart accepts finite numbers or explicit null only.`);
  });
  const numericValues = values.filter((value): value is number => value !== null);
  const maxAbs = Math.max(1, ...numericValues.map(value => Math.abs(value)));

  return <figure className={styles.chart} aria-labelledby={`treasury-curve-${labId}-chart-title`}>
    <figcaption>
      <b id={`treasury-curve-${labId}-chart-title`}>{lab.chartTitle}</b>
      <span>零轴居中；长度只在本实验内部比较。负值不是错误，经识别的0与null也是两种不同状态。</span>
    </figcaption>
    <div className={styles.chartRows}>
      {values.map((value, index) => {
        if (value === null) return <div className={styles.chartRow} data-chart-null="true" key={`${labId}-${lab.chartLabels[index] ?? index}`}>
          <span>{lab.chartLabels[index] ?? `value ${index + 1}`}</span>
          <div className={styles.signedTrack} aria-hidden="true" />
          <b>null — 未识别</b>
        </div>;
        const width = Number(Math.max(value === 0 ? 0 : 1.5, Math.abs(value) / maxAbs * 49).toFixed(3));
        const style = value < 0 ? { right: '50%', width: `${width}%` } : { left: '50%', width: `${width}%` };
        return <div className={styles.chartRow} data-chart-null="false" key={`${labId}-${lab.chartLabels[index] ?? index}`}>
          <span>{lab.chartLabels[index] ?? `value ${index + 1}`}</span>
          <div className={styles.signedTrack} aria-hidden="true"><i className={value < 0 ? styles.negative : undefined} style={style} /></div>
          <b>{formatSigned(value, '', Math.abs(value) >= 100 ? 0 : 2)}</b>
        </div>;
      })}
    </div>
  </figure>;
}
