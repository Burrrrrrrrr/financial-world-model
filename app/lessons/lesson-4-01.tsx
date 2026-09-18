import BalanceOfPaymentsDiagram from '../components/BalanceOfPaymentsDiagram';
import BalanceOfPaymentsLabStatic from '../components/BalanceOfPaymentsLabStatic';
import BalanceOfPaymentsQuiz from '../components/BalanceOfPaymentsQuiz';
import BalanceOfPaymentsStaticQuiz from '../components/BalanceOfPaymentsStaticQuiz';
import { balanceOfPaymentsConcepts } from './balanceOfPaymentsConcepts';
import { balanceOfPaymentsLabs, balanceOfPaymentsLabAudit } from '../components/balanceOfPaymentsLabDefinitions';
import type { BopLabId } from '../components/balanceOfPaymentsFixtures';
import { balanceOfPaymentsScenarioAudit, balanceOfPaymentsScenarios } from '../components/balanceOfPaymentsScenarios';
import { lesson401ReadingList, lesson401References } from './balanceOfPaymentsReferences';
import {
  balanceOfPaymentsChecks,
  balanceOfPaymentsEntryVocabulary,
  balanceOfPaymentsEvidenceGroups,
  balanceOfPaymentsFailedDownloadLedger,
  balanceOfPaymentsGlossary,
  balanceOfPaymentsInterfaces,
  balanceOfPaymentsInvariants,
  balanceOfPaymentsSourceArchiveLedger,
  balanceOfPaymentsThesis,
} from './balanceOfPaymentsStudy';
import {
  canonicalBalanceOfPaymentsAudit,
  canonicalBalanceOfPaymentsFields,
  canonicalBalanceOfPaymentsStateExample,
} from './balanceOfPaymentsState';
import type { LessonRecord } from './types';

export {
  canonicalBalanceOfPaymentsAudit,
  canonicalBalanceOfPaymentsFields,
  canonicalBalanceOfPaymentsStateExample,
} from './balanceOfPaymentsState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

function ArchiveRecord({ text }: { text: string }) {
  const match = text.match(/^(.*?：)(tmp\/research\/[^，]+)(，.*)$/);
  return match
    ? <>{match[1]}<code className="balance-of-payments-archive-path">{match[2]}</code>{match[3]}</>
    : <>{text}</>;
}

const extras = [
  { id: 'balance-of-payments-scope-route', label: '边界／符号／版本护照' },
  { id: 'balance-of-payments-chain', label: '交易账本—头寸桥' },
  { id: 'balance-of-payments-three-layers', label: '核算／观测／因果三层' },
  { id: 'balance-of-payments-interactive-section', label: 'Interactive M1–M10' },
  { id: 'balance-of-payments-static-twins', label: 'Static K1–K10' },
  { id: 'balance-of-payments-checks-glossary', label: 'Checks / Audit / Glossary' },
  { id: 'balance-of-payments-evidence-boundaries', label: 'State / Sources / Interfaces' },
] as const;

const labAttachments: Readonly<Record<string, BopLabId | undefined>> = {
  'balance-of-payments-mechanism-06': 'C1',
  'balance-of-payments-mechanism-18': 'C2',
  'balance-of-payments-mechanism-15': 'C3',
  'balance-of-payments-mechanism-22': 'C4',
  'balance-of-payments-mechanism-25': 'C5',
  'balance-of-payments-mechanism-20': 'C6',
  'balance-of-payments-mechanism-24': 'C7',
};

const sectionIds = ['thesis', ...balanceOfPaymentsConcepts.map(concept => concept.id), ...extras.map(section => section.id)];
const referenceIds = new Set<number>(lesson401References.map(reference => reference.id));
const renderedCitationIds = [
  ...balanceOfPaymentsConcepts.flatMap(concept => concept.sourceIds),
  ...balanceOfPaymentsLabs.flatMap(lab => lab.sourceIds),
  ...balanceOfPaymentsScenarios.flatMap(scenario => scenario.sourceIds),
  ...balanceOfPaymentsChecks.flatMap(check => check.sourceIds),
  ...balanceOfPaymentsEvidenceGroups.flatMap(group => group.ids),
];
const evidenceMapIds = new Set<number>(balanceOfPaymentsEvidenceGroups.flatMap(group => group.ids));

export const lesson401IntegrityAudit = [
  {
    key: '27 single-mechanism units, 81 connected paragraphs and explicit boundary/source scope',
    passed: balanceOfPaymentsConcepts.length === 27
      && balanceOfPaymentsConcepts.every(concept => concept.paragraphs.length === 3
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
      && Object.values(labAttachments).every(id => id === undefined || balanceOfPaymentsLabs.some(lab => lab.id === id)),
  },
  {
    key: 'nine official-source routes, ten guided readings and every rendered citation resolves',
    passed: lesson401References.length === 9
      && lesson401ReadingList.length === 10
      && renderedCitationIds.every(id => referenceIds.has(id))
      && lesson401References.every((reference, index) => reference.id === index + 1
        && reference.url.startsWith('https://')
        && reference.use.includes('支持')
        && reference.use.includes('不支持')),
  },
  {
    key: 'evidence map covers every declared source in both directions',
    passed: lesson401References.every(reference => evidenceMapIds.has(reference.id))
      && [...evidenceMapIds].every(id => referenceIds.has(id)),
  },
  {
    key: '20 understanding checks, at least 40 terms, 16 invariants and eight interfaces',
    passed: balanceOfPaymentsChecks.length === 20
      && balanceOfPaymentsGlossary.length >= 40
      && balanceOfPaymentsInvariants.length === 16
      && balanceOfPaymentsInterfaces.length === 8,
  },
  {
    key: 'beginner entry vocabulary defines accounting boundary, sign, flow/stock, failure and version axes',
    passed: balanceOfPaymentsEntryVocabulary.length === 17
      && ['Residence / economic territory', 'BOP flow / IIP stock', 'FAB = NAFA − NIL', 'STOP / unknown / null', 'BPM6 / BPM7']
        .every(term => balanceOfPaymentsEntryVocabulary.some(([candidate]) => candidate === term)),
  },
  {
    key: 'math, scenario and canonical author gates pass while two registered approvals remain separate evidence',
    passed: [...balanceOfPaymentsLabAudit, ...balanceOfPaymentsScenarioAudit, ...canonicalBalanceOfPaymentsAudit].every(item => item.passed)
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalBalanceOfPaymentsStateExample.evidenceState.twoFullApprovalsRegistered
      && canonicalBalanceOfPaymentsStateExample.evidenceState.reviews.length === 2,
  },
  {
    key: 'source ledger preserves three actual local archives and no fabricated failed download evidence',
    passed: balanceOfPaymentsSourceArchiveLedger.length === 3
      && balanceOfPaymentsFailedDownloadLedger.length === 0
      && balanceOfPaymentsSourceArchiveLedger.every(record => record.includes('SHA⁠-⁠256')),
  },
  {
    key: 'reviewed release records frozen BODY and approvals but no downstream self-certification',
    passed: typeof canonicalBalanceOfPaymentsStateExample.clockState.registeredAt === 'string'
      && !Number.isNaN(Date.parse(canonicalBalanceOfPaymentsStateExample.clockState.registeredAt))
      && canonicalBalanceOfPaymentsStateExample.clockState.ownReviewFrozenAt === '2026-09-16T11:24:40.796Z'
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.completeBodyFrozen
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.independentAccuracyApproval
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.independentPedagogyApproval
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.browserQaPassed
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.noJavaScriptQaPassed
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.keyboardQaPassed
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.responsiveQaPassed
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.printQaPassed
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.finalPdfProduced
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.finalPdfVerified
      && !canonicalBalanceOfPaymentsStateExample.eligibilityState.completionClaimAllowed,
  },
] as const;

if (!lesson401IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.01 lesson gate failed: ${lesson401IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson401Content() {
  return <>
    <noscript>
      <style>{'.lesson-page[data-lesson-id="4.01"] .balance-of-payments-interactive-only{display:none!important}'}</style>
      <p>脚本已关闭：七个C的固定输入、完整结果、手算、反例与来源，以及K1–K10的同题ABC和三条推理仍可通过原生折叠阅读；打印只保留一份静态记录。同一BODY-r5已经两名非作者分别完整批准；浏览器、无JavaScript、键盘、响应式、打印与最终PDF仍由候选之外的验收收据闭合。</p>
    </noscript>

    <section id="thesis" className="lesson-section lesson-opening">
      <p className="section-kicker">ONE CENTRAL MECHANISM · THE SAME EXTERNAL EVENT CLOSES AS ACCOUNTS AND REOPENS AS A POSITION</p>
      <h2>国际收支不是跨境现金计数器，而是居民—非居民经济事件的复式账本；外部头寸还会在交易之外被汇率、价格与其他数量变化改写。</h2>
      {balanceOfPaymentsThesis.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <div className="impact-facts" role="group" aria-label="4.01核心学习承诺">
        <article><span>先分类</span><b>resident × transaction × account</b><p>锁定边界、所有权、时点与账户。</p></article>
        <article><span>再闭合</span><b>CAB + KAB + D = FAB</b><p>把两种净借贷估计和统计差异分栏。</p></article>
        <article><span>最后桥接</span><b>opening + transactions + exchange-rate changes + other price changes + other volume changes = closing</b><p>不把头寸变化全部叫资本流动。</p></article>
      </div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 5, 9]} /></p>
    </section>

    <section id="balance-of-payments-scope-route" className="lesson-section">
      <p className="section-kicker">BOUNDARY / SIGN / CLOCK / VERSION PASSPORT</p>
      <h2>先固定谁是居民、何时发生经济所有权变化、采用哪套符号和哪一版标准，再读任何“流入／流出”标题。</h2>
      <p>Master prerequisite是3.20 Exchange Rate与3.21 Capital Flow国内入口。本课只保留两课真实lesson对象与语义接口，<code>inputLineage=[]</code>、<code>numericValuesConsumed=false</code>，不把两课合成数值灌入4.01。后续4.06–4.09会继续加入全球银行、跨境信用、全球金融周期与政策自主性，但这里先把可复核账本建立起来。</p>
      <p>正文采用BPM7资产—负债主语言：金融账户余额是资产净取得减负债净发生；传统credit/debit只在对照框出现。新术语与现实旧数据双标签展示，例如earned income（BPM6常见栏名primary income）。概念标准与数据实施版本不一致时，保留来源原词和vintage，不悄悄改名。</p>
      <div className="term-grid entry-vocabulary" aria-label="4.01入口术语" role="group">{balanceOfPaymentsEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>进入机制与实验前先解码</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <div className="precision-note"><span>审批状态 · 完整同版正文已由两位非作者独立审查通过</span><p><code>ownReviewFrozenAt={canonicalBalanceOfPaymentsStateExample.clockState.ownReviewFrozenAt}</code>精确指向获批BODY-r5冻结时钟，<code>reviews={canonicalBalanceOfPaymentsStateExample.evidenceState.reviews.length}</code>。准确性与教学席均为APPROVE且P1/P2/P3为0；作者结构与算术门仍不占审批席，现实数据、PIT、OOS、因果、福利、危机预测和生产资格也没有因此成立。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[1, 2, 5, 6, 9]} /></p>
    </section>

    {balanceOfPaymentsConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section id={concept.id} key={concept.id} className="lesson-section">
        <p className="section-kicker">{String(index + 1).padStart(2, '0')} · CORE MECHANISM</p>
        <h2>{concept.title}</h2>
        {concept.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {concept.formula ? <div className="equation-card"><span>只用于澄清对象的必要算式</span><div><code>{concept.formula.expression}</code></div><p>{concept.formula.explanation}</p></div> : null}
        <div className="precision-note"><span>成立条件、反例与接口</span><p>{concept.boundary}</p></div>
        {labId ? <BalanceOfPaymentsLabStatic labId={labId} /> : null}
        <p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds} />{concept.sourceNote}</p>
      </section>;
    })}

    <section id="balance-of-payments-chain" className="lesson-section">
      <p className="section-kicker">CONDITIONAL ACCOUNTING CHAIN · NOT A CASH PIPE OR CAUSAL FORECAST</p>
      <h2>同一经济事件先生成资源腿和金融对项；交易与非交易变化再把期初外部资产负债表推到期末。</h2>
      <p>这张图把最容易混淆的分类、符号、净借贷、统计差异和IIP桥分开。核算门通过，只说明记录在给定定义下闭合；它不自动告诉我们汇率下一步方向、逆差是否可持续或哪一项政策应当改变。</p>
      <BalanceOfPaymentsDiagram />
    </section>

    <section id="balance-of-payments-three-layers" className="lesson-section">
      <p className="section-kicker">ACCOUNTING / MEASUREMENT / CAUSAL INTERPRETATION</p>
      <h2>恒等式、发布数据和行为解释，是三种不能相互冒充的成品。</h2>
      <div className="model-card-grid">
        <div><h3>核算层</h3><p>先锁定居民边界、经济所有权、权责发生时点、账户分类和符号。概念上同一交易的资源腿与融资腿闭合；这不是关于谁先行动的理论。 <Cites ids={[1, 2]} /></p></div>
        <div><h3>测量层</h3><p>现实经常／资本账户与金融账户来自不同调查和行政来源，覆盖、时点、估值和修订不同。统计差异与镜像数据用于诊断，不是违法资金或单一遗漏账户的证据。 <Cites ids={[3, 4, 5, 9]} /></p></div>
        <div><h3>因果层</h3><p>顺差、资本流、汇率与资产价格可共同内生变化；要判断驱动方向，必须另加主体约束、政策时钟和识别设计。<code>CAB=S−I</code>重排不了行为反事实。 <Cites ids={[1, 4]} /></p></div>
      </div>
    </section>

    <section id="balance-of-payments-interactive-section" className="lesson-section balance-of-payments-interactive-only">
      <p className="section-kicker">INTERACTIVE M1–M10 · FIXED INDEPENDENT QUESTIONS</p>
      <h2>先锁定账户、符号和时钟，再选择中性数值。</h2>
      <p>十题各自绑定一个C的完整固定输入、护照与单位。M与K共享同一题库、ABC顺序和三条诊断；M不跟随可编辑C，改选只替换当前反馈。</p>
      <BalanceOfPaymentsQuiz />
    </section>

    <section id="balance-of-payments-static-twins" className="lesson-section">
      <p className="section-kicker">STATIC K1–K10 · NO SCRIPT / PRINT</p>
      <h2>无脚本和纸上仍保留同题、同选项、正确推理与两条错误路径。</h2>
      <p>每个K与对应M使用同一固定输入和来源。先独立手算，再展开三条路径；错误数通常回答另一个问题，所以必须指出偷换了哪一个账户、存量、流量、符号或时钟。</p>
      <BalanceOfPaymentsStaticQuiz />
    </section>

    <section id="balance-of-payments-checks-glossary" className="lesson-section">
      <p className="section-kicker">UNDERSTANDING / AUTHOR INTEGRITY / GLOSSARY</p>
      <h2>能把边界、账户、符号、差异与头寸桥说清，才算理解国际收支而不是背“顺差／逆差”。</h2>
      <div className="check-grid" role="group" aria-label="4.01理解检查">{balanceOfPaymentsChecks.map((check, index) => <div key={check.question}><details><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p>{check.answer} <Cites ids={check.sourceIds} /></p></details><p className="print-only"><b>{String(index + 1).padStart(2, '0')} · {check.question}　答案：</b>{check.answer} <Cites ids={check.sourceIds} /></p></div>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="4.01作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...balanceOfPaymentsLabAudit, ...balanceOfPaymentsScenarioAudit, ...canonicalBalanceOfPaymentsAudit, ...lesson401IntegrityAudit].map(item => <li key={item.key} className={item.passed ? 'passed' : ''}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="4.01术语表" role="group">{balanceOfPaymentsGlossary.map(([term, definition, confusion]) => <article className="term-card" key={term}><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>

    <section id="balance-of-payments-evidence-boundaries" className="lesson-section">
      <p className="section-kicker">REVIEWED BODY STATE / ACTUAL READING / INTERFACES</p>
      <h2>当前页面登记已获双审的正文身份与作者核读范围，但不会让候选文档自证自己的最终包装和交付结果。</h2>
      <div className="precision-note" data-key-coverage={canonicalBalanceOfPaymentsAudit.every(item => item.passed) ? 'complete' : 'incomplete'}>
        <span>4.01 canonical reviewed body · {canonicalBalanceOfPaymentsFields.length}个顶层字段</span>
        <p><code>{canonicalBalanceOfPaymentsFields.join(', ')}</code>。schema为<code>{canonicalBalanceOfPaymentsStateExample.schemaVersion}</code>；3.20和3.21只以真实对象身份进入semanticPrerequisiteStates，数值消费和校准均为false。现实国家BOP/IIP、政策、汇率反应、PIT、OOS、因果、福利和生产资格均为null/false；七C只对应各自SYN输入。</p>
      </div>

      <h3>编写者实际核读范围与本地原件身份</h3>
      <ol className="contract-list">{balanceOfPaymentsSourceArchiveLedger.map((record, index) => <li key={record}><b>{String(index + 1).padStart(2, '0')}</b><span><ArchiveRecord text={record} /></span></li>)}</ol>
      <p>本地完整PDF存在，不等于1076页手册已被逐页通读。台账按章节、段落和页面登记实际核读范围；网页来源与未归档PDF仍按官方页面身份引用，不被虚构成本地档案。</p>

      {balanceOfPaymentsFailedDownloadLedger.length > 0 ? <><h3>失败下载隔离</h3><ul>{balanceOfPaymentsFailedDownloadLedger.map(record => <li key={record}>{record}</li>)}</ul></> : null}

      <h3>生产者侧不变量</h3>
      <ol className="contract-list">{balanceOfPaymentsInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>

      <h3>证据地图</h3>
      <div className="evidence-map" aria-label="4.01九项来源证据地图" role="group">{balanceOfPaymentsEvidenceGroups.map(group => <div key={group.title}><h4>{group.title}</h4><p>{group.text} <Cites ids={group.ids} /></p></div>)}</div>

      <h3 id="balance-of-payments-cross-interfaces">跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.01跨章接口">{balanceOfPaymentsInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>

      <div className="precision-note"><span>双审登记、成品收据与证据边界</span><p>同一BODY-r5已冻结，并由accuracy与pedagogy两名未参与写作的非作者分别从头批准，P1/P2/P3均为0。canonical只登记已经完成的BODY与双审事实；浏览器、无JavaScript、键盘、响应式、打印、最终PDF与交付完成状态保持false，由候选之外的最终验收收据在事后闭合。任何实质正文修改都会使两席批准同时失效并重新开始。</p></div>
    </section>
  </>;
}

const lesson401Reviews: LessonRecord['reviews'] = [
  { kind: 'accuracy', completedAt: '2026-09-16T11:42:12.651Z', decision: 'approved', revision: '4.01-r1', summary: '从头完整审查同一BODY-r5冻结正文、27个机制、七C、十M/K、九项官方来源及87页纸本；P1/P2/P3均为0。复式恒等、统计差异、五通道头寸桥、BPM6/BPM7版本和核读范围均逐项闭合。' },
  { kind: 'pedagogy', completedAt: '2026-09-16T11:43:40.720Z', decision: 'approved', revision: '4.01-r1', summary: '从头完整审查同一BODY-r5的初学者路径、交互与无脚本等价物、键盘、390px响应式及87页A4纸本；P1/P2/P3均为0。开篇对比度与三卡分页问题已在本轮前关闭。' },
];

export const lesson401: LessonRecord = {
  slug: '4-01',
  id: '4.01',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Balance of Payments：从居民—非居民复式账本到外部头寸桥',
  subtitle: '为什么“钱流入／流出”会误导：把经济所有权、权责发生、经常／资本／金融账户、统计差异、储备与IIP重估放回同一套可复核结构',
  readingTime: '27个单机制单元与七C固定手算约90–125分钟；十M/K约25–40分钟，20道检查、术语、原典范围与接口约40–60分钟可第二遍完成。均为学习估时，未靠凑字保证时长',
  prerequisite: 'Master prerequisite：3.20 Exchange Rate、3.21 Capital Flow国内入口；只保留真实lesson身份与语义接口，不消费上游SYN数值。按需调用T03/T05/T06/T08；后续接口为4.06–4.09及7.24–7.26',
  updatedAt: '2026-09-16',
  revision: '4.01-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson401Reviews,
  previous: { slug: '3-24', label: '3.24 Macroprudential Policy' },
  next: { slug: '4-02', label: '4.02 International Monetary System' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...balanceOfPaymentsConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson401Content,
  references: lesson401References,
  readingList: lesson401ReadingList,
  readingListOrder: 'source',
};
