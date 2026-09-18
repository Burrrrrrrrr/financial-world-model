import SurpriseMechanismLab from './SurpriseMechanismLab';
import { surpriseLabs, surpriseNumber } from './surpriseLabDefinitions';
import type { SurpriseLab } from './surpriseLabDefinitions';
import type { SurpriseLabId } from './surpriseFixtures';
import { surpriseLabNotes } from './surpriseLabNotes';
import styles from './surprise.module.css';

function labFor(labId: SurpriseLabId): SurpriseLab {
  const lab = surpriseLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error('Unknown surprise lab ' + labId);
  return lab;
}

function LabSources({ labId, screenOnly = false }: { labId: SurpriseLabId; screenOnly?: boolean }) {
  const lab = labFor(labId);
  return (
    <p className={`section-sources ${styles.sources}${screenOnly ? ` ${styles.screenSources}` : ''}`}>
      机制依据：{lab.sourceIds.map(id => <a key={id} href={`#ref-${id}`} aria-label={`${labId}机制参考文献${id}`}>[{id}] </a>)}。
      来源支持机制与边界；本记录数值是作者独立合成，不是原论文数据、真实公告、市场预测或PIT认证。
    </p>
  );
}

function FixedRecord({ labId }: { labId: SurpriseLabId }) {
  const lab = labFor(labId);
  const note = surpriseLabNotes.find(candidate => candidate.labId === labId);
  if (!note) throw Error('Missing surprise default note ' + labId);
  const result = lab.display(lab.initial);
  if (result.status !== 'OK') throw Error('Invalid surprise default ' + labId);
  return (
    <div className={styles.fixedRecord}>
      <h4 className={styles.recordHeading}>{labId}固定默认记录 · DEFAULT SYN</h4>
      <p className={styles.fixedWarning}>
        <b>这份记录不随控件改变：</b>以下完整输入、结果与三段手算说明只绑定固定默认。
        改变控件后读动态区的当前结果；七C独立，不是同一国家或一条共同事件轨迹。
      </p>
      <p className={styles.recordLabel}><b>完整固定默认输入：</b></p>
      <dl className={styles.inputRecord} aria-label={`${labId}完整固定默认输入`}>
        {lab.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{surpriseNumber(lab.initial[field.key])}</dd></div>)}
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

export default function SurpriseLabStatic({ labId }: { labId: SurpriseLabId }) {
  const lab = labFor(labId);
  return (
    <aside id={`surprise-lab-${labId}`} className={styles.static} aria-labelledby={`surprise-lab-${labId}-title`}>
      <div className={styles.labLead}>
        <header className={styles.labHeader}>
          <span className="section-kicker">{labId} · 独立合成／原生折叠／打印</span>
          <h3 id={`surprise-lab-${labId}-title`}>{lab.title}</h3>
        </header>
        <p>{lab.question}</p>
        <p className={styles.passport}><b>成立范围：</b>{lab.passport}</p>
      </div>
      <SurpriseMechanismLab labId={labId} />
      <details>
        <summary>{labId}固定默认输入、完整结果、手算与来源（无需JavaScript）</summary>
        <FixedRecord labId={labId} />
      </details>
      <div className={styles.printRecord}><FixedRecord labId={labId} /></div>
      <LabSources labId={labId} screenOnly />
    </aside>
  );
}
