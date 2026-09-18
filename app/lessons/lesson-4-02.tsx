import InternationalMonetaryDiagram from '../components/InternationalMonetaryDiagram';
import InternationalMonetaryLabStatic from '../components/InternationalMonetaryLabStatic';
import InternationalMonetaryQuiz from '../components/InternationalMonetaryQuiz';
import InternationalMonetaryStaticQuiz from '../components/InternationalMonetaryStaticQuiz';
import styles from '../components/internationalMonetary.module.css';
import { internationalMonetaryConcepts } from './internationalMonetaryConcepts';
import { internationalMonetaryFixtureAudit } from '../components/internationalMonetaryFixtures';
import type { ImsLabId } from '../components/internationalMonetaryFixtures';
import { internationalMonetaryLabAudit, internationalMonetaryLabs } from '../components/internationalMonetaryLabDefinitions';
import { internationalMonetaryScenarioAudit, internationalMonetaryScenarios } from '../components/internationalMonetaryScenarios';
import { lesson402ReadingList, lesson402References } from './internationalMonetaryReferences';
import {
  internationalMonetaryChecks,
  internationalMonetaryEntryVocabulary,
  internationalMonetaryEvidenceGroups,
  internationalMonetaryFailedDownloadLedger,
  internationalMonetaryGlossary,
  internationalMonetaryInterfaces,
  internationalMonetaryInvariants,
  internationalMonetarySourceArchiveLedger,
  internationalMonetaryThesis,
} from './internationalMonetaryStudy';
import {
  canonicalInternationalMonetaryAudit,
  canonicalInternationalMonetaryFields,
  canonicalInternationalMonetaryStateExample,
  internationalMonetaryObservedPassportFields,
} from './internationalMonetaryState';
import type { LessonRecord } from './types';

export {
  canonicalInternationalMonetaryAudit,
  canonicalInternationalMonetaryFields,
  canonicalInternationalMonetaryStateExample,
} from './internationalMonetaryState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

function ArchiveRecord({ text }: { text: string }) {
  const match = text.match(/^(.*?：)(tmp\/research\/[^，]+)(，.*)$/);
  return match
    ? <>{match[1]}<code className="international-monetary-archive-path">{match[2]}</code>{match[3]}</>
    : <>{text}</>;
}

const extras = [
  { id: 'international-monetary-scope-route', label: '75–90分钟核心路径／统计护照' },
  { id: 'international-monetary-system-chain', label: '协调均衡反馈链' },
  { id: 'international-monetary-observed-snapshots', label: '三组现实快照' },
  { id: 'international-monetary-interactive-section', label: 'Interactive M1–M10' },
  { id: 'international-monetary-static-twins', label: 'Static K1–K10' },
  { id: 'international-monetary-checks-glossary', label: 'Checks / Audit / Glossary' },
  { id: 'international-monetary-evidence-boundaries', label: 'Draft State / Sources / Interfaces' },
] as const;

const coreRouteSteps = [
  {
    time: '0–10分钟',
    title: '先锁对象，不先背排名',
    task: '读核心命题、先修边界和统计护照规则；目标是能说清“功能、分母、时钟不同就不能直接比较”。',
    links: [['#thesis', '核心命题'], ['#international-monetary-scope-route', '对象护照']] as const,
  },
  {
    time: '10–22分钟',
    title: '从货币域走到功能拆分',
    task: '读机制01–02，并完成机制02附带的C2；亲手确认五个百分比没有共同分母，直接平均必须STOP。',
    links: [['#international-monetary-mechanism-01', '机制01'], ['#international-monetary-mechanism-02', '机制02＋C2']] as const,
  },
  {
    time: '22–42分钟',
    title: '把协调预期变成可执行路由',
    task: '依次读机制04–08，完成C1与C3；得到“准入条件→协调互补→全链成本→载体路由→厚市场反馈”的闭环。',
    links: [['#international-monetary-mechanism-04', '04＋C1'], ['#international-monetary-mechanism-05', '05'], ['#international-monetary-mechanism-06', '06'], ['#international-monetary-mechanism-07', '07＋C3'], ['#international-monetary-mechanism-08', '08']] as const,
  },
  {
    time: '42–57分钟',
    title: '把网络接回支付与资产负债表',
    task: '读支付栈、债务计价、贸易—银行反馈、安全资产与公共后备；目标是区分技术连接、私人融资容量与有条件公共保险。',
    links: [['#international-monetary-mechanism-11', '11'], ['#international-monetary-mechanism-14', '14'], ['#international-monetary-mechanism-16', '16'], ['#international-monetary-mechanism-17', '17'], ['#international-monetary-mechanism-21', '21']] as const,
  },
  {
    time: '57–75分钟',
    title: '用双时钟解释为何替代很慢',
    task: '读机制22、23、26并完成C7，再看总反馈链；把新流量、既有存量、估值变化与路径依赖分开。',
    links: [['#international-monetary-mechanism-22', '22'], ['#international-monetary-mechanism-23', '23'], ['#international-monetary-mechanism-26', '26＋C7'], ['#international-monetary-system-chain', '总反馈链']] as const,
  },
  {
    time: '75–90分钟',
    title: '只做能检验整条链的八道检查',
    task: '先独立作答，再展开答案；若任一题需要猜测术语，就回到对应机制，而不是继续堆叠阅读。',
    links: [['#international-monetary-check-02', '检查02'], ['#international-monetary-check-03', '03'], ['#international-monetary-check-04', '04'], ['#international-monetary-check-09', '09'], ['#international-monetary-check-14', '14'], ['#international-monetary-check-17', '17'], ['#international-monetary-check-19', '19'], ['#international-monetary-check-20', '20']] as const,
  },
] as const;

const labAttachments: Readonly<Record<string, ImsLabId | undefined>> = {
  'international-monetary-mechanism-02': 'C2',
  'international-monetary-mechanism-04': 'C1',
  'international-monetary-mechanism-07': 'C3',
  'international-monetary-mechanism-13': 'C4',
  'international-monetary-mechanism-22': 'C5',
  'international-monetary-mechanism-23': 'C6',
  'international-monetary-mechanism-26': 'C7',
};

const sectionIds = ['thesis', ...internationalMonetaryConcepts.map(concept => concept.id), ...extras.map(section => section.id)];
const checkIds = internationalMonetaryChecks.map((_, index) => `international-monetary-check-${String(index + 1).padStart(2, '0')}`);
const coreRouteTargets = coreRouteSteps.flatMap(step => step.links.map(([href]) => href.slice(1)));
const visibleAnchorIds = new Set([...sectionIds, ...checkIds]);
const referenceIds = new Set<number>(lesson402References.map(reference => reference.id));
const renderedCitationIds = [
  ...internationalMonetaryConcepts.flatMap(concept => concept.sourceIds),
  ...internationalMonetaryLabs.flatMap(lab => lab.sourceIds),
  ...internationalMonetaryScenarios.flatMap(scenario => scenario.sourceIds),
  ...internationalMonetaryChecks.flatMap(check => check.sourceIds),
  ...internationalMonetaryEvidenceGroups.flatMap(group => group.ids),
  1, 4, 5, 8, 9, 10, 12, 13, 14, 15, 19,
];
const evidenceMapIds = new Set<number>(internationalMonetaryEvidenceGroups.flatMap(group => group.ids));

export const lesson402IntegrityAudit = [
  {
    key: '27 single-mechanism units, 81 connected paragraphs and explicit boundary/source scope',
    passed: internationalMonetaryConcepts.length === 27
      && internationalMonetaryConcepts.every(concept => concept.paragraphs.length === 3
        && concept.paragraphs.every(paragraph => paragraph.length >= 70)
        && concept.boundary.length >= 35
        && concept.sourceNote.length >= 35
        && concept.sourceIds.length > 0),
  },
  {
    key: 'all section IDs are unique and seven independent experiments attach exactly once',
    passed: new Set(sectionIds).size === sectionIds.length
      && Object.values(labAttachments).filter(Boolean).length === 7
      && new Set(Object.values(labAttachments).filter(Boolean)).size === 7
      && Object.values(labAttachments).every(id => id === undefined || internationalMonetaryLabs.some(lab => lab.id === id)),
  },
  {
    key: 'six-step 75–90 minute core route closes object, coordination, routing, balance-sheet and dual-clock layers with valid anchors',
    passed: coreRouteSteps.length === 6
      && coreRouteSteps[0].time === '0–10分钟'
      && coreRouteSteps[5].time === '75–90分钟'
      && coreRouteTargets.length === 26
      && coreRouteTargets.every(id => visibleAnchorIds.has(id)),
  },
  {
    key: '19 declared sources, 12 guided readings and every rendered citation resolves',
    passed: lesson402References.length === 19
      && lesson402ReadingList.length === 12
      && renderedCitationIds.every(id => referenceIds.has(id))
      && lesson402References.every((reference, index) => reference.id === index + 1
        && reference.url.startsWith('https://')
        && reference.use.includes('支持')
        && reference.use.includes('不')),
  },
  {
    key: 'evidence map covers every declared source in both directions',
    passed: lesson402References.every(reference => evidenceMapIds.has(reference.id))
      && [...evidenceMapIds].every(id => referenceIds.has(id)),
  },
  {
    key: '19 entry terms, 20 understanding checks, at least 55 glossary terms, 16 invariants and eight interfaces',
    passed: internationalMonetaryEntryVocabulary.length === 19
      && internationalMonetaryChecks.length === 20
      && internationalMonetaryGlossary.length >= 55
      && internationalMonetaryInvariants.length === 16
      && internationalMonetaryInterfaces.length === 8,
  },
  {
    key: 'fixture, lab, scenario and canonical author gates pass without occupying either independent review seat',
    passed: [...internationalMonetaryFixtureAudit, ...internationalMonetaryLabAudit, ...internationalMonetaryScenarioAudit, ...canonicalInternationalMonetaryAudit].every(item => item.passed)
      && !canonicalInternationalMonetaryStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalInternationalMonetaryStateExample.evidenceState.reviews.length === 2
      && canonicalInternationalMonetaryStateExample.evidenceState.reviews.every(review => review.decision === 'approved')
      && canonicalInternationalMonetaryStateExample.evidenceState.twoFullApprovalsRegistered,
  },
  {
    key: 'local evidence ledger contains actual archives with SHA-256 identities and preserves any real failures separately',
    passed: internationalMonetarySourceArchiveLedger.length >= 3
      && internationalMonetarySourceArchiveLedger.every(record => record.includes('SHA-256'))
      && internationalMonetaryFailedDownloadLedger.every(record => record.length >= 20),
  },
  {
    key: 'reviewed BODY and exact two approvals are registered while delivery and completion remain external',
    passed: canonicalInternationalMonetaryStateExample.clockState.ownReviewFrozenAt === '2026-09-16T16:25:15.573Z'
      && canonicalInternationalMonetaryStateExample.eligibilityState.completeBodyFrozen
      && canonicalInternationalMonetaryStateExample.eligibilityState.independentAccuracyApproval
      && canonicalInternationalMonetaryStateExample.eligibilityState.independentPedagogyApproval
      && canonicalInternationalMonetaryStateExample.eligibilityState.twoFullApprovals
      && !canonicalInternationalMonetaryStateExample.eligibilityState.browserQaPassed
      && !canonicalInternationalMonetaryStateExample.eligibilityState.printQaPassed
      && !canonicalInternationalMonetaryStateExample.eligibilityState.finalPdfProduced
      && !canonicalInternationalMonetaryStateExample.eligibilityState.completionClaimAllowed,
  },
] as const;

if (!lesson402IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.02 lesson gate failed: ${lesson402IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson402Content() {
  return <>
    <noscript>
      <style>{'.lesson-page[data-lesson-id="4.02"] .international-monetary-interactive-only{display:none!important}'}</style>
      <p>脚本已关闭：七个C的固定输入、完整结果、手算、反例与来源，以及K1–K10的同题ABC和三条推理仍可通过原生折叠阅读；打印只保留一份静态记录。4.02的同一BODY-r8已经两位非作者从头独立批准，P1/P2/P3均为0；无脚本状态不会改变该审批对象或证据边界。</p>
    </noscript>

    <section id="thesis" className="lesson-section lesson-opening">
      <p className="section-kicker">ONE CENTRAL MECHANISM · ADMISSIBLE CURRENCIES ENTER A COORDINATION GAME AND THE NETWORK FEEDS BACK INTO COST</p>
      <h2>全球金融围绕少数核心货币集中，是“制度与资产先允许承载—他人采用降低我的全链成本—更多采用继续加厚网络”的条件性协调均衡。</h2>
      {internationalMonetaryThesis.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <div className="impact-facts" role="group" aria-label="4.02核心学习承诺">
        <article><span>先拆功能</span><b>invoice currency ≠ payment currency ≠ settlement asset ≠ funding ≠ reserve</b><p>每个比例先锁定统计护照，再讨论集中。</p></article>
        <article><span>再走机制</span><b>admission → coordination → thick markets</b><p>基本面是准入，网络是放大，不是平面因素表。</p></article>
        <article><span>最后看迁移</span><b>new flow → installed stock → valuation</b><p>局部新流量变化不等于广泛存量替代。</p></article>
      </div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 4, 7, 19]} /></p>
    </section>

    <section id="international-monetary-scope-route" className="lesson-section">
      <p className="section-kicker">FUNCTION / BOUNDARY / DENOMINATOR / CLOCK / VINTAGE PASSPORT</p>
      <h2>先问“哪一种功能、谁的资产负债表、什么分母、哪个时点”，再问某种货币是否主导。</h2>
      <p>Master prerequisite是4.01 Balance of Payments：它提供居民/非居民、交易/头寸、币种与估值通道的已审语义边界。本课只保留该真实lesson对象及其审批身份，<code>inputLineage=[]</code>、<code>numericValuesConsumed=false</code>；不会把4.01的SYN数值校准成国际货币模型。后续4.03–4.09再分别深入安全资产、美元融资、全球银行、全球金融周期和政策约束。</p>
      <p>国际货币没有天然的单一总分。FX turnover按两条币种腿合计200%，COFER是期末官方储备市场价值，GLI是对货币区外非银行借款人的银行贷款加国际债券，贸易计价则取决于样本与采集方法。只有function、unit、reference period、coverage、denominator与vintage全部相同，比例才可能直接比较；否则应并排保留，而不是静默平均。</p>
      <nav className={`international-monetary-core-route ${styles['international-monetary-core-route']}`} aria-label="4.02 75–90分钟核心学习路径">
        <div>
          <span>CORE ROUTE · 75–90 MINUTES</span>
          <h3>第一遍只走一条必要脊柱：对象护照 → 协调与路由 → 支付／资产负债表 → 双时钟替代。</h3>
          <p>这不是把整课标题机械缩短，而是保留能闭合因果链的15个机制、四个关键C与八道检查。按下列顺序读完即可形成第一张world model；每一步的“任务”是退出条件，未完成就回看本步，不必先读全部资料。</p>
        </div>
        <ol>
          {coreRouteSteps.map(step => <li key={step.time}>
            <span>{step.time}</span>
            <h4>{step.title}</h4>
            <p>{step.task}</p>
            <p>{step.links.map(([href, label], index) => <span key={href}>{index > 0 ? ' → ' : ''}<a href={href}>{label}</a></span>)}</p>
          </li>)}
        </ol>
        <p><b>第二遍／深读再进入：</b>机制03、09–10、12–13、15、18–20、24–25、27，C4–C6，全部M/K，三组现实快照的数值细节、完整术语表、证据台账与延伸阅读。它们补足统计、制度和研究边界，但从核心路径暂时延后不会切断第一遍因果链。</p>
      </nav>
      <div className="term-grid entry-vocabulary" aria-label="4.02入口术语" role="group">
        {internationalMonetaryEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>进入机制与实验前先解码</span><h3>{term}</h3><p>{definition}</p></article>)}
      </div>
      <div className="precision-note"><span>审批状态 · 完整同版正文已由两位非作者独立审查通过</span><p><code>ownReviewFrozenAt={canonicalInternationalMonetaryStateExample.clockState.ownReviewFrozenAt}</code>、<code>reviews={canonicalInternationalMonetaryStateExample.evidenceState.reviews.length}</code>。accuracy与pedagogy两席均从头审查BODY-r8并给出APPROVE，P1/P2/P3均为0；作者有限算术、结构、浏览器与构建门仍不占审批席，现实point-in-time（PIT，历史时点当时可得）、out-of-sample（OOS，样本外）、因果、预测、福利、建议与生产资格也没有因此成立。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[4, 5, 8, 10, 12, 15, 19]} /></p>
    </section>

    {internationalMonetaryConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section id={concept.id} key={concept.id} className="lesson-section">
        <p className="section-kicker">{String(index + 1).padStart(2, '0')} · CORE MECHANISM</p>
        <h2>{concept.title}</h2>
        {concept.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        {concept.formula ? <div className="equation-card"><span>只用于澄清对象的必要算式</span><div><code>{concept.formula.expression}</code></div><p>{concept.formula.explanation}</p></div> : null}
        <div className="precision-note"><span>成立条件、反例与接口</span><p>{concept.boundary}</p></div>
        {labId ? <InternationalMonetaryLabStatic labId={labId} /> : null}
        <p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds} />{concept.sourceNote}</p>
      </section>;
    })}

    <section id="international-monetary-system-chain" className="lesson-section">
      <p className="section-kicker">CONDITIONAL FEEDBACK CHAIN · NOT A MONOCAUSAL RANKING</p>
      <h2>核心地位由准入条件、协调预期、市场路由、资产负债表和存量时钟共同维持；任何一层都可能成为瓶颈。</h2>
      <p>这张关系图故意把“制度可信”和“大家已经在用”分开：前者决定网络能否承载，后者降低边际全链成本。新技术、地缘冲击或政策若只改变一段连接而没有迁移计价、融资、资产和最终结算，可能只是让旧核心货币换了一条轨道。</p>
      <InternationalMonetaryDiagram />
    </section>

    <section id="international-monetary-observed-snapshots" className="lesson-section">
      <p className="section-kicker">THREE OBSERVED SNAPSHOTS · THREE DIFFERENT PASSPORTS</p>
      <h2>现实数字可以同时正确却不能合并：外汇成交、跨境信用与官方储备测量的是三种对象。</h2>
      <p>第一张快照来自BIS 2025 Triennial的最终表：2025年4月全球OTC FX日均net-net成交额为9.51024万亿美元，美元成交额为8.471519万亿美元。用两个精确金额相除，作者可反算美元出现在约89.08%的交易一侧；官方Table 25.2按整数列示约89%，并没有直接发布89.078%这个精度。因为每笔外汇交易包含两个币种腿，所有币种份额合计200%。这是一个异常波动月份的成交口径，不是全年支付、最终结算、贸易计价、债务或储备份额；2025年9月初值9.6万亿美元与89.2%也已被最终版替代。 <Cites ids={[5]} /></p>
      <p>第二张快照来自2026年3月末BIS IBS/GLI：跨境银行claims为47.6万亿美元，较窄的cross-border bank credit为39.5万亿美元；美元GLI为14.7万亿美元、欧元GLI为5.1万亿欧元。GLI的对象是货币发行区外非银行借款人的银行贷款加国际债券，所以它既不是全部全球融资，也不是纯银行跨境债权；美元与欧元名义量还不能不经同日汇率直接相减。 <Cites ids={[10, 11]} /></p>
      <p>第三张快照是IMF COFER 2026Q1：官方外汇储备总额约13.10万亿美元，美元、欧元和人民币份额分别为57.13%、20.03%和1.99%。这是期末市场价值存量；交易、汇率、债券价格、总储备与覆盖/估算都能改写份额，而且自2025Q3起的100%构成包含未报告部分的imputation，并非100%逐币直接观测。 <Cites ids={[12, 13, 14]} /></p>
      <div className={`model-card-grid observed-passport-grid ${styles['observed-passport-grid']}`} aria-label="三组现实观测统计护照">
        {canonicalInternationalMonetaryStateExample.observedSnapshotState.map(snapshot => <article
          className={`observed-passport-card ${styles['observed-passport-card']} ${snapshot.id === 'IMF-COFER-2026Q1' ? styles.observedPassportBreak : ''}`}
          data-passport-id={snapshot.id}
          key={snapshot.id}
        >
          <h3>{snapshot.label}</h3>
          <p><code>{snapshot.id}</code> · observed statistical passport</p>
          <dl>{internationalMonetaryObservedPassportFields.map(([field, label]) => <div key={field}><dt>{label}</dt><dd>{snapshot[field]}</dd></div>)}</dl>
        </article>)}
      </div>
      <div className="precision-note"><span>不能做的运算</span><p>三组数字没有共同功能、单位、时钟、覆盖与分母，因此不存在自然等权平均。若研究者要构造综合指数，必须另行公开权重、方向、缺失值、版本和敏感性；本课canonical状态将<code>crossFunctionCompositeIndex=null</code>。</p></div>
    </section>

    <section id="international-monetary-interactive-section" className="lesson-section international-monetary-interactive-only">
      <p className="section-kicker">INTERACTIVE M1–M10 · FIXED INDEPENDENT QUESTIONS</p>
      <h2>先锁定功能、分母、时钟和状态，再选择中性数值。</h2>
      <p>十题各自绑定一个C的完整固定输入、护照和单位。M与K共享同一题库、ABC顺序与三条诊断；M不跟随可编辑C，改选只替换当前反馈。</p>
      <InternationalMonetaryQuiz />
    </section>

    <section id="international-monetary-static-twins" className="lesson-section">
      <p className="section-kicker">STATIC K1–K10 · NO SCRIPT / PRINT</p>
      <h2>无脚本和纸上仍保留同题、同选项、正确推理与两条错误路径。</h2>
      <p>每个K与对应M使用同一固定输入和来源。先独立手算，再展开三条路径；错误数往往回答了另一个功能、分母、时钟或状态，所以必须指出偷换发生在哪里。</p>
      <InternationalMonetaryStaticQuiz />
    </section>

    <section id="international-monetary-checks-glossary" className="lesson-section">
      <p className="section-kicker">UNDERSTANDING / AUTHOR INTEGRITY / GLOSSARY</p>
      <h2>能把功能、准入、网络、路由、资产负债表与双时钟连成一条条件链，才算理解国际货币体系。</h2>
      <div className="check-grid" role="group" aria-label="4.02理解检查">
        {internationalMonetaryChecks.map((check, index) => <div id={checkIds[index]} key={check.question}><details><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p>{check.answer} <Cites ids={check.sourceIds} /></p></details><p className="print-only"><b>{String(index + 1).padStart(2, '0')} · {check.question}　答案：</b>{check.answer} <Cites ids={check.sourceIds} /></p></div>)}
      </div>
      <div className="yield-fixture-audit" role="group" aria-label="4.02作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...internationalMonetaryFixtureAudit, ...internationalMonetaryLabAudit, ...internationalMonetaryScenarioAudit, ...canonicalInternationalMonetaryAudit, ...lesson402IntegrityAudit].map(item => <li key={item.key} className={item.passed ? 'passed' : ''}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="4.02术语表" role="group">
        {internationalMonetaryGlossary.map(([term, definition, confusion]) => <article className="term-card" key={term}><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}
      </div>
    </section>

    <section id="international-monetary-evidence-boundaries" className="lesson-section">
      <p className="section-kicker">REVIEWED BODY STATE / ACTUAL READING / INTERFACES</p>
      <h2>当前页面登记获批BODY-r8、两席审稿、核读范围与仍未完成的现实证据；它不会把教材审批写成现实机制认证。</h2>
      <div className="precision-note" data-key-coverage={canonicalInternationalMonetaryAudit.every(item => item.passed) ? 'complete' : 'incomplete'}>
        <span>4.02 canonical reviewed BODY · {canonicalInternationalMonetaryFields.length}个顶层字段</span>
        <p><code>{canonicalInternationalMonetaryFields.join(', ')}</code>。schema为<code>{canonicalInternationalMonetaryStateExample.schemaVersion}</code>；4.01只以真实已审对象身份进入semanticPrerequisiteState，数值消费与校准均为false。三组现实快照各自带护照，却不进入七个SYN实验校准；point-in-time（PIT，历史时点当时可得）、out-of-sample（OOS，样本外）、因果、预测、福利、最佳执行与生产资格仍为null/false。</p>
      </div>

      <h3>编写者实际核读范围与本地原件身份</h3>
      <ol className="contract-list">{internationalMonetarySourceArchiveLedger.map((record, index) => <li key={record}><b>{String(index + 1).padStart(2, '0')}</b><span><ArchiveRecord text={record} /></span></li>)}</ol>
      <p>本地PDF存在不等于全文逐页通读。台账按文件身份与实际核读页面登记；只核读网页或未取得原件的来源继续按官方页面身份引用，不会伪造成已归档全文。</p>

      {internationalMonetaryFailedDownloadLedger.length > 0 ? <><h3>失败下载隔离</h3><ul>{internationalMonetaryFailedDownloadLedger.map(record => <li key={record}>{record}</li>)}</ul></> : null}

      <h3>生产者侧不变量</h3>
      <ol className="contract-list">{internationalMonetaryInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>

      <h3>证据地图</h3>
      <div className="evidence-map" aria-label="4.02十九项来源证据地图" role="group">{internationalMonetaryEvidenceGroups.map(group => <div key={group.title}><h4>{group.title}</h4><p>{group.text} <Cites ids={group.ids} /></p></div>)}</div>

      <h3 id="international-monetary-cross-interfaces">跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.02跨章接口">{internationalMonetaryInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>

      <div className="precision-note"><span>双审登记、成品收据与证据边界</span><p>同一BODY-r8已冻结，并由accuracy与pedagogy两名未参与写作的非作者分别从头批准，P1/P2/P3均为0。canonical只登记已经完成的BODY与双审事实；浏览器、无JavaScript、键盘、390px响应式、打印、最终PDF与交付完成状态保持false，由候选之外的最终验收收据在事后闭合。任何实质正文修改都会使两席批准同时失效并重新开始。</p></div>
    </section>
  </>;
}

const lesson402Reviews: LessonRecord['reviews'] = [
  { kind: 'accuracy', completedAt: '2026-09-16T16:41:32.169Z', decision: 'approved', revision: '4.02-r1', summary: '从头完整审查同一BODY-r8冻结正文、27个机制、七C、十M/K、三组现实统计护照、19项来源及100页纸本；P1/P2/P3均为0。公式、最终数据版本、统计口径、引用边界、75–90分钟命名与point-in-time（PIT，历史时点当时可得）首次展开均闭合。' },
  { kind: 'pedagogy', completedAt: '2026-09-16T16:39:33.531Z', decision: 'approved', revision: '4.02-r1', summary: '从头完整审查同一BODY-r8的初学者机制链、75–90分钟路径、交互与静态等价物、键盘、390px、无脚本及100页A4纸本；P1/P2/P3均为0，r4–r7全部旧问题关闭。' },
];

export const lesson402: LessonRecord = {
  slug: '4-02',
  id: '4.02',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'International Monetary System：协调均衡、网络外部性与核心货币集中',
  subtitle: '为什么全球金融围绕少数核心货币运行：从功能护照、准入条件和载体路由，一直走到贸易—银行反馈、公共后备、存量迟滞与可逆替代',
  readingTime: '页面内置可执行的75–90分钟核心路径：15个脊柱机制、C1/C2/C3/C7与八道检查；完整27机制与七C约95–135分钟，十M/K及现实快照、术语、证据和原典另作第二遍。均为真实学习估时，不靠凑字保证时长',
  prerequisite: 'Master prerequisite：4.01 Balance of Payments；只保留真实已审lesson身份与语义接口，不消费上游SYN数值。按需调用T03/T05/T06/T08；后续接口为4.03–4.09、5.13–5.14及7.24–7.26',
  updatedAt: '2026-09-16',
  revision: '4.02-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson402Reviews,
  previous: { slug: '4-01', label: '4.01 Balance of Payments' },
  next: { slug: '4-03', label: '4.03 Reserve Currency 与 Safe Asset Demand' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...internationalMonetaryConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson402Content,
  references: lesson402References,
  readingList: lesson402ReadingList,
  readingListOrder: 'source',
};
