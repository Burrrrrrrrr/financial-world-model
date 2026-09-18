import { housingLabs, type HousingLabId } from './housingLabDefinitions';
import HousingMechanismLab from './HousingMechanismLab';
import styles from './housingCollateral.module.css';

function FixedBody({initial,outputs}:{initial:Readonly<Record<string,number>>;outputs:readonly (readonly [string,string])[]}) {
  return <div className={styles.staticBody}><p><b>固定输入：</b><code>{JSON.stringify(initial)}</code>。页面交互变化不会改写这个基准。</p><dl>{outputs.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
}

export default function HousingLabStatic({ labId }: { labId: HousingLabId }) {
  const lab = housingLabs.find(({ id }) => id === labId)!;
  const outputs = lab.outputs(lab.initial)!;
  return <aside className={styles.lab} id={`housing-${labId}`} aria-label={`${labId}机制实验`}>
    <h3>{lab.id} · {lab.title}</h3><p className={styles.assumption}><b>冻结口径：</b>{lab.assumption}</p>
    <HousingMechanismLab labId={labId} />
    <details className={styles.staticRecord}><summary>{lab.id}固定基准记录：无JavaScript与打印使用同一函数、同一输入</summary><FixedBody initial={lab.initial} outputs={outputs}/></details>
    <div className={styles.printStaticRecord} data-housing-print-static={labId}><h4>{lab.id}固定基准记录 · 同一函数／同一输入</h4><FixedBody initial={lab.initial} outputs={outputs}/></div>
    <p><b>现在动手：</b>{lab.experiment}</p><p className="section-sources"><b>机制依据而非数字校准：</b>{lab.sourceIds.map((id) => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}]</a>)}</p>
  </aside>;
}
