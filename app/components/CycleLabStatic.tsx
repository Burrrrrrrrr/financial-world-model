import CycleMechanismLab from './CycleMechanismLab';
import { cycleLabs, cycleDisplayValue } from './cycleLabDefinitions';
import type { CycleLab } from './cycleLabDefinitions';
import type { CycleLabId } from './cycleFixtures';
import { cycleLabNotes } from './cycleLabNotes';
import styles from './cycle.module.css';

function labFor(labId: CycleLabId): CycleLab {
  const lab = cycleLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error('Unknown cycle lab ' + labId);
  return lab;
}

function LabSources({ labId, screenOnly = false }: { labId: CycleLabId; screenOnly?: boolean }) {
  const lab = labFor(labId);
  return (
    <p className={`section-sources ${styles.sources}${screenOnly ? ` ${styles.screenSources}` : ''}`}>
      机制依据：{lab.sourceIds.map(id => <a key={id} href={`#ref-${id}`} aria-label={`${labId}机制参考文献${id}`}>[{id}] </a>)}。
      来源支持机制与边界；数值是作者独立合成输入，不是原文参数、国家资料、官方定年或现实因果预测。
    </p>
  );
}

function FixedRecord({ labId }: { labId: CycleLabId }) {
  const lab = labFor(labId);
  const note = cycleLabNotes.find(candidate => candidate.labId === labId);
  if (!note) throw Error('Missing cycle default note ' + labId);
  const result = lab.display(lab.initial);
  if (result.status !== 'OK') throw Error('Invalid cycle default ' + labId);
  return (
    <div className={styles.fixedRecord}>
      <h4 className={styles.recordHeading}>{labId}固定默认记录 · DEFAULT SYN</h4>
      <p className={styles.fixedWarning}>
        <b>这份记录不随控件改变：</b>以下完整输入、结果和手算只绑定明确的固定默认。
        改变控件后请读动态区的当前结果；七C分别独立，不是同一国家或同一路径。
      </p>
      <p className={styles.recordLabel}><b>完整固定默认输入：</b></p>
      <dl className={styles.inputRecord} aria-label={`${labId}完整固定默认输入`}>
        {lab.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{cycleDisplayValue(lab.initial[field.key])}</dd></div>)}
      </dl>
      <p className={styles.recordLabel}><b>完整固定默认结果：</b></p>
      <dl className={styles.recordValues} aria-label={`${labId}完整固定默认结果`}>
        {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <p className={styles.rebuild}><b>重建默认手算：</b>{note.rebuild}</p>
      <div className={styles.recordTail}>
        <p><b>从默认改变一个条件：</b>{note.changeCondition}</p>
        <p><b>这些证据仍然缺少：</b>{note.unknownWarning}</p>
        <LabSources labId={labId} />
      </div>
    </div>
  );
}

export default function CycleLabStatic({ labId }: { labId: CycleLabId }) {
  const lab = labFor(labId);
  return (
    <aside id={`cycle-lab-${labId}`} className={styles.static} aria-labelledby={`cycle-lab-${labId}-title`}>
      <div className={styles.labLead}>
        <header className={styles.labHeader}>
          <span className="section-kicker">{labId} · 独立合成 / 原生折叠 / 打印</span>
          <h3 id={`cycle-lab-${labId}-title`}>{lab.title}</h3>
        </header>
        <p>{lab.question}</p>
        <p className={styles.passport}><b>成立范围：</b>{lab.passport}</p>
      </div>
      <CycleMechanismLab labId={labId} />
      <details>
        <summary>{labId}固定默认输入、完整结果、手算与来源（无需JavaScript）</summary>
        <FixedRecord labId={labId} />
      </details>
      <div className={styles.printRecord}><FixedRecord labId={labId} /></div>
      <LabSources labId={labId} screenOnly />
    </aside>
  );
}
