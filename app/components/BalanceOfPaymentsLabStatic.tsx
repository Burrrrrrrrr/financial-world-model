import BalanceOfPaymentsMechanismLab from './BalanceOfPaymentsMechanismLab';
import { balanceOfPaymentsLabs, bopNumber } from './balanceOfPaymentsLabDefinitions';
import type { BopLab } from './balanceOfPaymentsLabDefinitions';
import type { BopLabId } from './balanceOfPaymentsFixtures';
import styles from './balanceOfPayments.module.css';

function labFor(labId: BopLabId): BopLab {
  const lab = balanceOfPaymentsLabs.find(candidate => candidate.id === labId);
  if (!lab) throw Error(`未知国际收支实验：${labId}`);
  return lab;
}

function LabSources({ labId, screenOnly = false }: { labId: BopLabId; screenOnly?: boolean }) {
  const lab = labFor(labId);
  return (
    <p className={`section-sources ${styles.sources}${screenOnly ? ` ${styles.screenSources}` : ''}`}>
      机制依据：{lab.sourceIds.map(id => <a key={id} href={`#ref-${id}`} aria-label={`${labId}实验参考文献${id}`}>[{id}] </a>)}。
      来源支持定义与边界；全部金额和比率是作者独立SYN，不是来源数据、真实国家账户、PIT资料、因果估计、储备充足性判断或政策建议。
    </p>
  );
}

function FixedRecord({ labId }: { labId: BopLabId }) {
  const lab = labFor(labId);
  const result = lab.display(lab.initial);
  if (result.status !== 'OK') throw Error(`${labId}固定默认不能STOP。`);

  return (
    <div className={styles.fixedRecord}>
      <h4 className={styles.recordHeading}>{labId}固定默认记录 · DEFAULT SYN</h4>
      <p className={styles.fixedWarning}>
        <b>固定记录不随控件变化：</b>七个C互相独立，没有共同国家、币种、参考期或事件路径；打印与无脚本版本只绑定这里列出的默认输入。
      </p>
      <p className={styles.recordLabel}><b>完整固定输入：</b></p>
      <dl className={styles.inputRecord} aria-label={`${labId}完整固定默认输入`}>
        {lab.fields.map(field => (
          <div key={field.key}>
            <dt>{field.label}</dt>
            <dd>{bopNumber(lab.initial[field.key])}</dd>
          </div>
        ))}
      </dl>
      <p className={styles.recordLabel}><b>完整固定结果：</b></p>
      <dl className={styles.recordValues} aria-label={`${labId}完整固定默认结果`}>
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

export default function BalanceOfPaymentsLabStatic({ labId }: { labId: BopLabId }) {
  const lab = labFor(labId);
  return (
    <aside
      id={`balance-of-payments-lab-${labId}`}
      className={styles.static}
      aria-labelledby={`balance-of-payments-lab-${labId}-title`}
    >
      <div className={styles.labLead}>
        <header className={styles.labHeader}>
          <span className="section-kicker">{labId} · 独立SYN／动态重算／静态孪生</span>
          <h3 id={`balance-of-payments-lab-${labId}-title`}>{lab.title}</h3>
        </header>
        <p>{lab.question}</p>
        <p className={styles.passport}><b>实验护照：</b>{lab.passport}</p>
      </div>
      <BalanceOfPaymentsMechanismLab labId={labId} />
      <details>
        <summary>{labId}固定输入、完整结果、手算、反例与来源（无需JavaScript）</summary>
        <FixedRecord labId={labId} />
      </details>
      <div className={styles.printRecord}><FixedRecord labId={labId} /></div>
      <LabSources labId={labId} screenOnly />
    </aside>
  );
}
