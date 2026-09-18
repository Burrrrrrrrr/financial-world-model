import MacroprudentialDiagram from '../components/MacroprudentialDiagram';
import MacroprudentialLabStatic from '../components/MacroprudentialLabStatic';
import MacroprudentialQuiz from '../components/MacroprudentialQuiz';
import MacroprudentialStaticQuiz from '../components/MacroprudentialStaticQuiz';
import '../components/MacroprudentialPrint.css';
import { macroprudentialConcepts } from './macroprudentialConcepts';
import { macroprudentialLabs, macroprudentialLabAudit } from '../components/macroprudentialLabDefinitions';
import type { MacroLabId } from '../components/macroprudentialFixtures';
import { macroprudentialScenarioAudit, macroprudentialScenarios } from '../components/macroprudentialScenarios';
import { lesson324ReadingList, lesson324References } from './macroprudentialReferences';
import {
  macroprudentialChecks,
  macroprudentialEntryVocabulary,
  macroprudentialEvidenceGroups,
  macroprudentialFailedDownloadLedger,
  macroprudentialGlossary,
  macroprudentialInterfaces,
  macroprudentialInvariants,
  macroprudentialSourceArchiveLedger,
  macroprudentialThesis,
} from './macroprudentialStudy';
import {
  canonicalMacroprudentialAudit,
  canonicalMacroprudentialFields,
  canonicalMacroprudentialStateExample,
} from './macroprudentialState';
import type { LessonRecord } from './types';

export {
  canonicalMacroprudentialAudit,
  canonicalMacroprudentialFields,
  canonicalMacroprudentialStateExample,
} from './macroprudentialState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'macroprudential-scope-route', label: '对象／路线／证据护照' },
  { id: 'macroprudential-policy-chain', label: '目标—工具—反馈链' },
  { id: 'macroprudential-policy-layers', label: '工具／结果／研究层级' },
  { id: 'macroprudential-interactive-section', label: 'Interactive M1–M10' },
  { id: 'macroprudential-static-twins', label: 'Static K1–K10' },
  { id: 'macroprudential-checks-glossary', label: 'Checks / Audit / Glossary' },
  { id: 'macroprudential-evidence-boundaries', label: 'State / Sources / Interfaces' },
] as const;

const labAttachments: Readonly<Record<string, MacroLabId | undefined>> = {
  'macroprudential-mechanism-01': 'C2',
  'macroprudential-mechanism-08': 'C1',
  'macroprudential-mechanism-13': 'C3',
  'macroprudential-mechanism-15': 'C4',
  'macroprudential-mechanism-19': 'C5',
  'macroprudential-mechanism-25': 'C7',
  'macroprudential-mechanism-26': 'C6',
};

const sectionIds = ['thesis', ...macroprudentialConcepts.map(concept => concept.id), ...extras.map(section => section.id)];
const referenceIds = new Set<number>(lesson324References.map(reference => reference.id));
const renderedCitationIds = [
  ...macroprudentialConcepts.flatMap(concept => concept.sourceIds),
  ...macroprudentialLabs.flatMap(lab => lab.sourceIds),
  ...macroprudentialScenarios.flatMap(scenario => scenario.sourceIds),
  ...macroprudentialChecks.flatMap(check => check.sourceIds),
  ...macroprudentialEvidenceGroups.flatMap(group => group.ids),
];
const evidenceMapIds = new Set<number>(macroprudentialEvidenceGroups.flatMap(group => group.ids));

export const lesson324IntegrityAudit = [
  {
    key: '27 single-mechanism units, 81 connected paragraphs and explicit boundary/source scope',
    passed: macroprudentialConcepts.length === 27
      && macroprudentialConcepts.every(concept => concept.paragraphs.length === 3
        && concept.paragraphs.every(paragraph => paragraph.length >= 75)
        && concept.boundary.length >= 35
        && concept.sourceNote.length >= 35
        && concept.sourceIds.length > 0),
  },
  {
    key: 'all section IDs are unique and seven independent experiments attach exactly once',
    passed: new Set(sectionIds).size === sectionIds.length
      && Object.values(labAttachments).filter(Boolean).length === 7
      && new Set(Object.values(labAttachments).filter(Boolean)).size === 7
      && Object.values(labAttachments).every(id => id === undefined || macroprudentialLabs.some(lab => lab.id === id)),
  },
  {
    key: 'eight primary-source routes, ten guided readings and every rendered citation resolves',
    passed: lesson324References.length === 8
      && lesson324ReadingList.length === 10
      && renderedCitationIds.every(id => referenceIds.has(id))
      && !referenceIds.has(999)
      && lesson324References.every((reference, index) => reference.id === index + 1
        && reference.url.startsWith('https://')
        && reference.use.includes('支持')
        && reference.use.includes('不支持')),
  },
  {
    key: 'evidence map covers every declared source in both directions',
    passed: lesson324References.every(reference => evidenceMapIds.has(reference.id))
      && [...evidenceMapIds].every(id => referenceIds.has(id)),
  },
  {
    key: '20 understanding checks, at least 40 terms, 16 invariants and eight interfaces',
    passed: macroprudentialChecks.length === 20
      && macroprudentialGlossary.length >= 40
      && macroprudentialInvariants.length === 16
      && macroprudentialInterfaces.length === 8,
  },
  {
    key: 'beginner entry vocabulary defines mechanism, evidence, unit, failure state and policy state axis before the labs',
    passed: macroprudentialEntryVocabulary.length === 17
      && ['Systemic externality', 'SYN / synthetic', 'bp / basis point', 'STOP / unknown / null', 'capacity / threshold / proposal / actual']
        .every(term => macroprudentialEntryVocabulary.some(([candidate]) => candidate === term))
      && macroprudentialGlossary.some(([term, definition]) => term === 'bp / basis point' && definition.includes('100bp等于1个百分点'))
      && macroprudentialChecks[19].question.startsWith('教材生产合同检查')
      && macroprudentialChecks[19].sourceIds.length === 0,
  },
  {
    key: 'math, scenario and canonical author gates pass while two registered approvals remain separate evidence',
    passed: [...macroprudentialLabAudit, ...macroprudentialScenarioAudit, ...canonicalMacroprudentialAudit].every(item => item.passed)
      && !canonicalMacroprudentialStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalMacroprudentialStateExample.evidenceState.twoFullApprovalsRegistered,
  },
  {
    key: 'source ledger preserves eight real archives, four failed HTML artifacts and exact read-scope boundaries',
    passed: macroprudentialSourceArchiveLedger.length === 8
      && macroprudentialFailedDownloadLedger.length === 4
      && macroprudentialSourceArchiveLedger.every(record => record.includes('SHA⁠-⁠256'))
      && macroprudentialFailedDownloadLedger.every(record => record.includes('实际HTML')),
  },
  {
    key: 'reviewed release keeps the approved BODY clock and two approvals aligned without treating downstream artifact verification as an internal fact',
    passed: typeof canonicalMacroprudentialStateExample.clockState.registeredAt === 'string'
      && !Number.isNaN(Date.parse(canonicalMacroprudentialStateExample.clockState.registeredAt))
      && canonicalMacroprudentialStateExample.clockState.ownReviewFrozenAt === '2026-09-16T07:06:09.360Z'
      && canonicalMacroprudentialStateExample.evidenceState.reviews.length === 2
      && canonicalMacroprudentialStateExample.evidenceState.twoFullApprovalsRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.formalCatalogRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.formalRegistryRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.sharedStateRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.completeBodyFrozen
      && canonicalMacroprudentialStateExample.eligibilityState.independentAccuracyApproval
      && canonicalMacroprudentialStateExample.eligibilityState.independentPedagogyApproval
      && !canonicalMacroprudentialStateExample.eligibilityState.browserQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.noJavaScriptQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.keyboardQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.responsiveQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.printQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.finalPdfProduced
      && !canonicalMacroprudentialStateExample.eligibilityState.finalPdfVerified
      && !canonicalMacroprudentialStateExample.eligibilityState.completionClaimAllowed,
  },
] as const;

if (!lesson324IntegrityAudit.every(item => item.passed)) {
  throw new Error(`3.24 lesson gate failed: ${lesson324IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson324Content() {
  return <>
    <noscript>
      <style>{'.lesson-page[data-lesson-id="3.24"] .macroprudential-interactive-only{display:none!important}'}</style>
      <p>脚本已关闭：七个C的固定默认输入、完整结果、手算、反例与来源，以及K1–K10的同题ABC和三条推理仍可通过原生折叠阅读；打印只保留一份静态记录。完整同版BODY-r4已经两名非作者独立审查通过；浏览器、无脚本、键盘、响应式与最终PDF状态由候选之外的验收收据判定，不由本文档自证。</p>
    </noscript>

    <section id="thesis" className="lesson-section lesson-opening">
      <p className="section-kicker">ONE CENTRAL MECHANISM · TARGET SYSTEMIC EXTERNALITIES WITHOUT PRETENDING PRECISION IS FREE</p>
      <h2>当风险生成在特定资产负债表与共同反馈中，只调全经济资金价格可能代价很大，也未必命中风险源。</h2>
      {macroprudentialThesis.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <div className="impact-facts" role="group" aria-label="3.24核心学习承诺">
        <article><span>先定位</span><b>externality + dimension</b><p>说明私人选择怎样成为系统后果。</p></article>
        <article><span>再映射</span><b>objective → instrument</b><p>把最终目标翻译成近端约束。</p></article>
        <article><span>最后评估</span><b>effect + resilience + leakage + cost</b><p>不把一个结果升级成总有效。</p></article>
      </div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 4]} /></p>
    </section>

    <section id="macroprudential-scope-route" className="lesson-section">
      <p className="section-kicker">OBJECT / CLOCK / PERIMETER / EVIDENCE PASSPORT</p>
      <h2>先把系统、主体、合同、法域和证据身份写清，再讨论哪一种工具“更精准”。</h2>
      <p>Master prerequisite是3.14 Credit Cycle与3.15 Debt / Leverage Cycle。本课保留两课真实lesson对象、修订和审稿身份，只把它们作为语义先修；<code>inputLineage=[]</code>、<code>numericValuesConsumed=false</code>，不拿两课SYN数值校准3.24。后续接口是5.05 Regulation &amp; Market Design，用于继续处理权限、监管范围、执行、互惠、处置和行为适应。</p>
      <p>学习路线分三层：01–10先建立系统风险、两个维度、外部性、目标与政策组合；11–21把资本、CCyB、借款人、部门、流动性、外币与结构型工具映射到不同可行集；22–27处理递减收益、guided discretion、数据、内生性、泄漏与再校准。遇到C先手算固定默认，再只改一个条件；七C互不相连。</p>
      <div className="term-grid entry-vocabulary" aria-label="3.24入口术语" role="group">{macroprudentialEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>进入机制与实验前先解码</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <div className="precision-note"><span>审批状态 · 完整同版正文已由两位非作者独立审查通过</span><p><code>registeredAt={canonicalMacroprudentialStateExample.clockState.registeredAt}</code>只登记课程接入；两份批准共同指向BODY-r4，<code>ownReviewFrozenAt={canonicalMacroprudentialStateExample.clockState.ownReviewFrozenAt}</code>才是该批准正文的冻结身份钟，<code>reviews=2</code>。632/632有限数学审计仍只绑定fixtures SHA⁠-⁠256 <code>69abfec363f11a22e1bd87746800febb8f8301be84eb71efa8d56d43499c937c</code>，不占两席审稿，也不认证现实政策数据、PIT/OOS、因果或生产资格。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[1, 2, 3, 4]} /></p>
    </section>

    {macroprudentialConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section id={concept.id} key={concept.id} className="lesson-section">
        <p className="section-kicker">{String(index + 1).padStart(2, '0')} · CORE MECHANISM</p>
        <h2>{concept.title}</h2>
        {concept.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {concept.formula ? <div className="equation-card"><span>只用于澄清对象的必要算式</span><div><code>{concept.formula.expression}</code></div><p>{concept.formula.explanation}</p></div> : null}
        <div className="precision-note"><span>成立条件、反例与接口</span><p>{concept.boundary}</p></div>
        {labId ? <MacroprudentialLabStatic labId={labId} /> : null}
        <p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds} />{concept.sourceNote}</p>
      </section>;
    })}

    <section id="macroprudential-policy-chain" className="lesson-section">
      <p className="section-kicker">CONDITIONAL POLICY CHAIN · NOT A UNIVERSAL TOOL RANKING</p>
      <h2>工具先改变可行集，主体反应再改变信贷、缓冲、泄漏和下一轮校准。</h2>
      <p>这张图把最容易被压扁的层级重新展开。它既不保证每个工具按同方向运行，也不声称六道门覆盖一切；任何一门缺数据、权限或反事实，就在该门保留unknown。</p>
      <MacroprudentialDiagram />
    </section>

    <section id="macroprudential-policy-layers" className="lesson-section">
      <p className="section-kicker">TARGET / TRANSMISSION / EVALUATION</p>
      <h2>近端命中、压力期韧性、范围泄漏和社会成本，是四种不同成品。</h2>
      <div className="model-card-grid">
        <div><h3>对象层</h3><p>先冻结主体、合同、工具、法域、分子分母、宣布/生效/释放时钟和监管范围。LTV、DSTI、资本与流动性各自回答不同问题；unknown不填0。 <Cites ids={[1, 2, 3]} /></p></div>
        <div><h3>传导层</h3><p>工具改变借款人或贷款人可行集，随后才有申请、审批、定价、资产组合、缓冲与实际信贷。capacity（可行容量）、threshold（约束阈值）、proposal（政策提议）和actual（实际执行或结果）是政策链上的不同状态，不能互相提升。 <Cites ids={[2, 4]} /></p></div>
        <div><h3>研究层</h3><p>政策常在风险上升时实施；未经反事实识别的前后、面板或事件共变最多是观察性描述／关联，准实验和叙事设计也各有estimand与假设。近端命中或观察性关联不自动等于因果、PIT、OOS、福利或生产资格。 <Cites ids={[2, 4, 6, 7]} /></p></div>
      </div>
    </section>

    <section id="macroprudential-interactive-section" className="lesson-section macroprudential-interactive-only">
      <p className="section-kicker">INTERACTIVE M1–M10 · FIXED INDEPENDENT QUESTIONS</p>
      <h2>先识别系统对象、约束分母和覆盖范围，再选择中性数值。</h2>
      <p>十题各自绑定一个C的完整固定输入、护照与单位。M与K共享同一题库、ABC顺序和三条诊断；M不跟随可编辑C，改选只替换当前反馈。</p>
      <MacroprudentialQuiz />
    </section>

    <section id="macroprudential-static-twins" className="lesson-section">
      <p className="section-kicker">STATIC K1–K10 · NO SCRIPT / PRINT</p>
      <h2>无脚本和纸上仍保留同题、同选项、正确推理与两条错误路径。</h2>
      <p>每个K与对应M使用同一固定输入和来源。先独立手算，再展开三条路径；错误数通常回答另一个问题，所以必须指出偷换了哪一个对象、状态、分母或覆盖范围。</p>
      <MacroprudentialStaticQuiz />
    </section>

    <section id="macroprudential-checks-glossary" className="lesson-section">
      <p className="section-kicker">UNDERSTANDING / AUTHOR INTEGRITY / GLOSSARY</p>
      <h2>能说清“工具先打到哪里、结果还缺什么”，才算理解宏观审慎而不是背缩写。</h2>
      <div className="check-grid" role="group" aria-label="3.24理解检查">{macroprudentialChecks.map((check, index) => <div key={check.question}><details><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p>{check.answer} <Cites ids={check.sourceIds} /></p></details><p className="print-only"><b>{String(index + 1).padStart(2, '0')} · {check.question}　答案：</b>{check.answer} <Cites ids={check.sourceIds} /></p></div>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.24作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...macroprudentialLabAudit, ...macroprudentialScenarioAudit, ...canonicalMacroprudentialAudit, ...lesson324IntegrityAudit].map(item => <li key={item.key} className={item.passed ? 'passed' : ''}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="3.24术语表" role="group">{macroprudentialGlossary.map(([term, definition, confusion]) => <article className="term-card" key={term}><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>

    <section id="macroprudential-evidence-boundaries" className="lesson-section">
      <p className="section-kicker">REVIEWED BODY STATE / ACTUAL READING / INTERFACES</p>
      <h2>当前页面登记已双审正文身份，但不让候选文档自证自己的最终包装与验收结果。</h2>
      <div className="precision-note" data-key-coverage={canonicalMacroprudentialAudit.every(item => item.passed) ? 'complete' : 'incomplete'}>
        <span>3.24 canonical reviewed body · {canonicalMacroprudentialFields.length}个顶层字段</span>
        <p><code>{canonicalMacroprudentialFields.join(', ')}</code>。schema为<code>{canonicalMacroprudentialStateExample.schemaVersion}</code>；3.14和3.15仅以真实对象身份进入semanticPrerequisiteStates，数值消费与校准均为false。现实观察性关联、国家政策率、资本、借款人分布、法律权限、政策时钟、PIT、OOS、因果、收益和生产资格均为null/false；七C结果只对应各自SYN输入。</p>
      </div>

      <h3>编写者实际核读范围与本地真PDF身份</h3>
      <ol className="contract-list">{macroprudentialSourceArchiveLedger.map((record, index) => <li key={record}><b>{String(index + 1).padStart(2, '0')}</b><span>{record}</span></li>)}</ol>
      <p>八项来源均严格按上列本人已读范围使用。本地原件已归档并不意味着全文已读：尤其BCBS 2024只读24页中的1–12，WP433只读摘要与文内1–2，CGFS38只读前言/摘要/出版说明，WP337只读摘要、身份与40页范围。未核读部分不会通过二手摘要或文件存在性冒充。</p>

      <h3>首次伪PDF下载的失败隔离</h3>
      <ul>{macroprudentialFailedDownloadLedger.map(record => <li key={record}>{record}</li>)}</ul>
      <p>这四个旧文件是HTML失败证据，不是PDF阅读证据。网络恢复后取得的四份新真PDF使用不同文件名、页数和哈希；正文只引用新身份。 <Cites ids={[5, 6, 7, 8]} /></p>

      <h3>生产者侧不变量</h3>
      <ol className="contract-list">{macroprudentialInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>

      <h3>证据地图</h3>
      <div className="evidence-map" aria-label="3.24八项来源证据地图" role="group">{macroprudentialEvidenceGroups.map(group => <div key={group.title}><h4>{group.title}</h4><p>{group.text} <Cites ids={group.ids} /></p></div>)}</div>

      <h3 id="macroprudential-cross-interfaces">跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="3.24跨章接口">{macroprudentialInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>

      <div className="precision-note"><span>双审登记、成品收据与证据边界</span><p>同一BODY-r4已冻结，并由accuracy与pedagogy两名非作者分别完整批准。为避免PDF在生成前声称自己已经生成和通过，canonical只登记已经完成的BODY与双审事实；浏览器、无JavaScript、键盘、响应式、打印、最终PDF与交付完成状态保持false，由候选之外的最终验收收据在事后闭合。现实政策资料、历史PIT、OOS、结构因果、法律合规、投资建议与生产系统资格继续保持null/false。</p></div>
    </section>
  </>;
}

const lesson324Reviews: LessonRecord['reviews'] = [
  { kind: 'accuracy', completedAt: '2026-09-16T07:20:02.140Z', decision: 'approved', revision: '3.24-r1', summary: '从头完整审查同一BODY-r4冻结正文、27个机制、七C、十M/K、八份原典读页边界、canonical与80页纸本；P1/P2/P3均为0。机制10页码范围和r3分页失败均已关闭；pypdf中文提取限制作为边界保留。' },
  { kind: 'pedagogy', completedAt: '2026-09-16T07:13:54.217Z', decision: 'approved', revision: '3.24-r1', summary: '从头完整审查同一BODY-r4的初学者路径、17个入口词汇、27个机制、七C、十M/K、错误路线、检查、术语、接口及80页纸本；P1/P2/P3均为0。BODY-r1七项与r3孤立标题均已关闭。' },
];

export const lesson324: LessonRecord = {
  slug: '3-24',
  id: '3.24',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Macroprudential Policy：从系统性外部性到目标、工具、缓冲与泄漏反馈',
  subtitle: '为什么只调利率有时无法控制金融风险：区分leaning与resilience，把资本、借款人、部门、流动性和结构型工具放回各自近端对象、时钟、范围与识别边界',
  readingTime: '27个单机制单元与七C固定手算约85–115分钟；十M/K约25–40分钟，20道检查、术语、原典范围与接口约40–60分钟可第二遍完成。均为估时，后续未读原典另计',
  prerequisite: 'Master prerequisite：3.14 Credit Cycle、3.15 Debt / Leverage Cycle；只保留真实lesson身份与语义接口，不消费上游SYN数值。按需调用3.09–3.13、3.16、4.07、T03/T05/T06/T08；后续接口为5.05 Regulation & Market Design',
  updatedAt: '2026-09-16',
  revision: '3.24-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson324Reviews,
  previous: { slug: '3-23', label: '3.23 Macro Surprise' },
  next: { label: '5.05 Regulation & Market Design' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...macroprudentialConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson324Content,
  references: lesson324References,
  readingList: lesson324ReadingList,
  readingListOrder: 'source',
};
