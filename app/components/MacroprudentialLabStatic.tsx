import MacroprudentialMechanismLab from './MacroprudentialMechanismLab';
import { macroprudentialLabs, macroNumber } from './macroprudentialLabDefinitions';
import type { MacroprudentialLab } from './macroprudentialLabDefinitions';
import type { MacroLabId } from './macroprudentialFixtures';
import styles from './macroprudential.module.css';

function labFor(labId: MacroLabId): MacroprudentialLab {
  const lab = macroprudentialLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`未知宏观审慎实验：${labId}`);
  return lab;
}

function LabSources({ labId, screenOnly = false }: { labId: MacroLabId; screenOnly?: boolean }) {
  const lab = labFor(labId);
  return (
    <p className={`section-sources ${styles.sources}${screenOnly ? ` ${styles.screenSources}` : ''}`}>
      机制依据：{lab.sourceIds.map(id => <a key={id} href={`#ref-${id}`} aria-label={`${labId}参考文献${id}`}>[{id}] </a>)}。
      来源支持机制与边界；全部参数是作者独立SYN，不是来源数据、现实法定阈值、压力测试、政策建议或收益回测。
    </p>
  );
}

function FixedRecord({ labId }: { labId: MacroLabId }) {
  const lab = labFor(labId);
  const result = lab.display(lab.initial);
  if (result.status !== 'OK') throw Error(`${labId}固定默认不能STOP。`);
  return (
    <div className={styles.fixedRecord}>
      <h4 className={styles.recordHeading}>{labId}固定默认记录 · DEFAULT SYN</h4>
      <p className={styles.fixedWarning}><b>固定记录不随控件变化：</b>七个C没有共同国家、机构、时钟或参数，不能串成历史路径。</p>
      <p className={styles.recordLabel}><b>完整固定输入：</b></p>
      <dl className={styles.inputRecord} aria-label={`${labId}固定默认输入`}>
        {lab.fields.map(field => <div key={field.key}><dt>{field.label}</dt><dd>{macroNumber(lab.initial[field.key])}</dd></div>)}
      </dl>
      <p className={styles.recordLabel}><b>完整固定结果：</b></p>
      <dl className={styles.recordValues} aria-label={`${labId}固定默认结果`}>
        {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <p className={styles.rebuild}><b>默认手算：</b>{lab.rebuild}</p>
      <div className={styles.recordTail}>
        <p><b>只改一个条件：</b>{lab.changeCondition}</p>
        <p><b>反例：</b>{lab.counterexample}</p>
        <p><b>仍缺证据：</b>{lab.unknownWarning}</p>
        <LabSources labId={labId} />
      </div>
    </div>
  );
}

export default function MacroprudentialLabStatic({ labId }: { labId: MacroLabId }) {
  const lab = labFor(labId);
  return (
    <aside id={`macroprudential-lab-${labId}`} className={styles.static} aria-labelledby={`macroprudential-lab-${labId}-title`}>
      <div className={styles.labLead}>
        <header className={styles.labHeader}>
          <span className="section-kicker">{labId} · 独立SYN／动态重算／静态孪生</span>
          <h3 id={`macroprudential-lab-${labId}-title`}>{lab.title}</h3>
        </header>
        <p>{lab.question}</p>
        <p className={styles.passport}><b>实验护照：</b>{lab.passport}</p>
      </div>
      <MacroprudentialMechanismLab labId={labId} />
      <details>
        <summary>{labId}固定输入、完整结果、手算、反例与来源（无需JavaScript）</summary>
        <FixedRecord labId={labId} />
      </details>
      <div className={styles.printRecord}><FixedRecord labId={labId} /></div>
      <LabSources labId={labId} screenOnly />
    </aside>
  );
}
