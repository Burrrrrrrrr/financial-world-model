import { fiscalC6FromControls, fiscalLabs, type FiscalField } from './fiscalLabDefinitions';
import type { FiscalLabId } from '../lessons/fiscalPolicyConcepts';
import FiscalMechanismLab from './FiscalMechanismLab';
import FiscalPathChart from './FiscalPathChart';
import styles from './fiscalPolicy.module.css';
function FixedBody({initial,fields,outputs}:{initial:Readonly<Record<string,number>>;fields:readonly FiscalField[];outputs:readonly (readonly [string,string])[]}) {
 return <div className={styles.fixed}><p data-fiscal-fixed-inputs><b>固定输入：</b>{fields.map(({key,label})=>`${label} = ${initial[key]}`).join('；')}。动态修改不改写基准。</p><dl>{outputs.map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl></div>;
}
export default function FiscalLabStatic({labId}:{labId:FiscalLabId}) {
 const lab=fiscalLabs.find(({id})=>id===labId);
 if(!lab)throw new Error(`Unknown fiscal static lab ${labId}`);
 const outputs=lab.outputs(lab.initial)!;
 const path=labId==='C6'?fiscalC6FromControls(lab.initial):null;
 return <aside className={styles.lab} id={`fiscal-${labId}`} aria-label={`${labId}机制实验`}><h3>{labId} · {lab.title}</h3><p><b>冻结口径：</b>{lab.assumption}</p>
  <FiscalMechanismLab labId={labId}/>
  <details className={styles.record}><summary>{labId}固定基准：无脚本原生展开，同一函数／同一输入</summary><FixedBody initial={lab.initial} fields={lab.fields} outputs={outputs}/>{path?<FiscalPathChart baseline={[100,102,104,106]} withPolicy={path.withPolicyLevels}/>:null}</details>
  <div className={styles.printRecord} data-fiscal-print-static={labId}><h4>{labId}固定记录：同一函数／同一输入</h4><FixedBody initial={lab.initial} fields={lab.fields} outputs={outputs}/></div>
  <p><b>现在动手：</b>{lab.experiment}</p><p className="section-sources"><b>机制来源，非参数校准：</b>{lab.sourceIds.map(id=><a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}]</a>)}</p>
 </aside>;
}
