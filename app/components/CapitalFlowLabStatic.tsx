import CapitalFlowMechanismLab from './CapitalFlowMechanismLab';
import { flowLabs, flowDisplayValue } from './capitalFlowLabDefinitions';
import type { FlowLabId } from './capitalFlowLabDefinitions';
import styles from './capitalFlow.module.css';

function LabSources({ labId, screenOnly = false }: { labId: FlowLabId; screenOnly?: boolean }) {
  const lab = flowLabs.find(l => l.id === labId);
  if (!lab) throw Error('Unknown capital-flow lab ' + labId);
  return (
    <p className={screenOnly ? `section-sources ${styles.screenSources}` : 'section-sources'}>
      机制依据：{lab.sourceIds.map(id => <a href={`#ref-${id}`} key={id}>[{id}] </a>)}。
      数值为作者独立合成合同/账/菜单，不是原文参数、国家观察、真实资金用途或现实因果预测。
    </p>
  );
}

function RecordTail({ labId, includeSources }: { labId: FlowLabId; includeSources: boolean }) {
  const lab = flowLabs.find(l => l.id === labId);
  if (!lab) throw Error('Unknown capital-flow lab ' + labId);
  return (
    <div className={styles.recordTail}>
      <p><b>改变条件并核对象：</b>{lab.experiment}</p>
      {includeSources ? <LabSources labId={labId} /> : null}
    </div>
  );
}

function FixedRecord({ labId, print = false }: { labId: FlowLabId; print?: boolean }) {
  const lab = flowLabs.find(l => l.id === labId);
  if (!lab) throw Error('Unknown capital-flow lab ' + labId);
  const result = lab.display(lab.initial);
  if (result.status === 'STOP') throw Error('Invalid capital-flow default ' + labId);
  return (
    <>
      <p className={styles.fixedInputs}>
        <b>固定输入：</b>{lab.fields.map(field => `${field.label}＝${flowDisplayValue(lab.initial[field.key])}`).join('；')}。
      </p>
      <dl>
        {result.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
      </dl>
      <RecordTail labId={labId} includeSources={print} />
    </>
  );
}

export default function CapitalFlowLabStatic({ labId }: { labId: FlowLabId }) {
  const lab = flowLabs.find(l => l.id === labId);
  if (!lab) throw Error('Unknown capital-flow lab ' + labId);
  return (
    <aside id={`capital-flow-${labId}`} className={styles.static}>
      <header className={styles.labHeader}>
        <span className="section-kicker">{labId} · INDEPENDENT SYN / NATIVE / PRINT</span>
        <h3>{lab.title}</h3>
      </header>
      <p className={styles.passport}><b>成立范围：</b>{lab.assumption}</p>
      <CapitalFlowMechanismLab labId={labId} />
      <details>
        <summary>{labId}无脚本固定输入、完整结果与手算</summary>
        <FixedRecord labId={labId} />
      </details>
      <div className={styles.printRecord}><FixedRecord labId={labId} print /></div>
      <LabSources labId={labId} screenOnly />
    </aside>
  );
}
