import SafeAssetDiagram from '../components/SafeAssetDiagram';
import SafeAssetLabStatic from '../components/SafeAssetLabStatic';
import SafeAssetQuiz from '../components/SafeAssetQuiz';
import SafeAssetStaticQuiz from '../components/SafeAssetStaticQuiz';
import styles from '../components/safeAsset.module.css';
import { safeAssetFixtureAudit } from '../components/safeAssetFixtures';
import type { SafeAssetLabId } from '../components/safeAssetFixtures';
import { safeAssetLabAudit, safeAssetLabs } from '../components/safeAssetLabDefinitions';
import { safeAssetScenarioAudit, safeAssetScenarios } from '../components/safeAssetScenarios';
import { safeAssetConcepts } from './safeAssetConcepts';
import {
  lesson403ReadingList,
  lesson403References,
  safeAssetEvidenceGroups,
  safeAssetFailedDownloadLedger,
  safeAssetFrontierReadingLedger,
  safeAssetSourceArchiveLedger,
} from './safeAssetReferences';
import type {
  SafeAssetArchiveRecord,
  SafeAssetFailedDownloadRecord,
  SafeAssetFrontierReadingRecord,
} from './safeAssetReferences';
import {
  safeAssetChecks,
  safeAssetCoreRoute,
  safeAssetEntryVocabulary,
  safeAssetEvidenceBoundaries,
  safeAssetInterfaces,
  safeAssetInvariants,
  safeAssetPassportRules,
  safeAssetReadingGuide,
  safeAssetResearchQuestions,
  safeAssetThesis,
} from './safeAssetStudy';
import {
  canonicalSafeAssetAudit,
  canonicalSafeAssetFields,
  canonicalSafeAssetStateExample,
  safeAssetObservedPassportFields,
} from './safeAssetState';
import type { LessonRecord } from './types';

export {
  canonicalSafeAssetAudit,
  canonicalSafeAssetFields,
  canonicalSafeAssetStateExample,
} from './safeAssetState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

function ArchiveRecord({ record }: { record: SafeAssetArchiveRecord }) {
  return <article className="term-card">
    <span>{record.version}</span>
    <h4>{record.sourceKey}</h4>
    <p><b>对应来源：</b><Cites ids={record.sourceIds} /></p>
    <p><b>本地原件：</b><code className="safe-asset-archive-path">{record.path}</code></p>
    <p><b>文件身份：</b>{record.mime} · {record.bytes.toLocaleString('en-US')} bytes{record.pdfPages ? ` · ${record.pdfPages}页` : ''} · SHA-256 <code className="safe-asset-archive-path">{record.sha256}</code></p>
    <p><b>实际核读：</b>{record.readLocator}</p>
    <p><b>支持：</b>{record.supports}</p>
    <p><b>不支持：</b>{record.doesNotSupport}</p>
  </article>;
}

function FailedDownloadRecord({ record }: { record: SafeAssetFailedDownloadRecord }) {
  return <article className="term-card">
    <span>FAILED / QUARANTINED · {record.responses.length} EXACT RESPONSE{record.responses.length === 1 ? '' : 'S'}</span>
    <h4>{record.request}</h4>
    <p><b>对应来源：</b><Cites ids={record.sourceIds} /></p>
    <p><b>逐响应身份：</b>状态、MIME、字节数、响应体与headers逐条绑定；200或202也不等于取得所请求的PDF。</p>
    <ul>{record.responses.map(response => <li key={response.responsePath}><b>HTTP {response.httpStatus} · {response.mime} · {response.bytes.toLocaleString('en-US')} bytes</b><br /><code className="safe-asset-archive-path">{response.responsePath}</code><br /><code className="safe-asset-archive-path">{response.headersPath}</code></li>)}</ul>
    <p><b>处置：</b>{record.resolution}</p>
  </article>;
}

function FrontierReadingRecord({ record }: { record: SafeAssetFrontierReadingRecord }) {
  return <article className="term-card">
    <span>FRONTIER · {record.status}</span>
    <h4>{record.title}</h4>
    <p>{record.authors}</p>
    <p><b>冻结件：</b><code className="safe-asset-archive-path">{record.pdfPath}</code> · {record.pdfPages}页 · SHA-256 <code className="safe-asset-archive-path">{record.pdfSha256}</code></p>
    <p><b>允许：</b>{record.allowedUse}</p>
    <p><b>禁止：</b>{record.forbiddenUse}</p>
  </article>;
}

const extras = [
  { id: 'safe-asset-scope-route', label: '88分钟主路径／对象护照' },
  { id: 'safe-asset-system-chain', label: '双反馈系统图' },
  { id: 'safe-asset-interactive-section', label: 'Interactive M1–M12' },
  { id: 'safe-asset-static-twins', label: 'Static K1–K12' },
  { id: 'safe-asset-checks-glossary', label: 'Checks / Passport / Vocabulary' },
  { id: 'safe-asset-evidence-boundaries', label: 'Evidence / Research / Interfaces' },
] as const;

const labAttachments: Readonly<Record<string, SafeAssetLabId | undefined>> = {
  'safe-asset-mechanism-03': 'C1',
  'safe-asset-mechanism-04': 'C3',
  'safe-asset-mechanism-06': 'C5',
  'safe-asset-mechanism-07': 'C6',
  'safe-asset-mechanism-09': 'C7',
  'safe-asset-mechanism-11': 'C8',
};

const objectCards = [
  ['美元现金／存款', '货币单位＋对发行者或银行的债权', '是否属于储备与可作抵押都要逐工具、逐主体核验。'],
  ['美国国债', '对美国财政主体的证券债权', '期限、价格、持有人、资格、占用与市场状态仍会改变服务。'],
  ['美元公司债', '美元计价的私人债权', '同币种不继承国债的信用、流动性、储备或抵押地位。'],
  ['货币黄金', '特殊储备资产，不是普通债权', '不在COFER外汇储备币种分母内，也不能硬填普通发行者。'],
  ['SDR holdings', '制度性国际储备项目', 'SDR单位与SDR-denominated claim仍是不同对象。'],
  ['SDR-denominated claim', '以SDR为计价单位的合约债权', '它不等于SDR holdings；若满足COFER的其他claim与储备资产条件，也不会仅因SDR计价而自动被排除。'],
  ['IMF reserve position', '对IMF体系的储备头寸', '不能简化成某一主权证券或普通银行存款。'],
  ['央行互换额度', '潜在流动性安排', '额度未提款时不是已经持有的储备资产或无条件保险。'],
  ['抵押品资格', '工具—设施—对手方之间的关系', '可作抵押不等于reserve asset，也不保证压力期仍以相同haircut成交。'],
] as const;

const serviceCards = [
  ['信用安全', '债务人是否按合同履约；它不回答市场价格、退出或可达性。'],
  ['名义价格稳定', '利率、期限与市场波动造成的价值变化；不违约仍可能亏损。'],
  ['市场流动性', 'spread、depth、price impact与resilience必须分别测量。'],
  ['法律／操作可达', '托管、法域、控制、转移和结算是否能在任务时点完成。'],
  ['抵押品服务', '资格、价格、自由数量与haircut共同决定现金能力。'],
  ['坏状态表现', '正常期可交易不保证压力期能以可接受损失及时变现。'],
] as const;

const liquidityCards = [
  ['01 · Tightness / Spread', '最优买卖报价之间的距离；常用ticks或bp描述小额即时交易的一部分成本。窄点差不说明报价后面有多少数量。'],
  ['02 · Depth', '在一个或多个价格档位可承接的数量；单位必须绑定工具、场所和档位。深度大不保证冲击后恢复很快。'],
  ['03 · Price impact', '给定交易规模导致的价格变化；没有订单大小就没有可比较的impact。成交量大也可能伴随单笔impact恶化。'],
  ['04 · Resilience', '冲击后价格、点差与订单簿恢复所需时间；它是动态速度，不是某一时点的成交量、点差或挂单快照。'],
] as const;

const sectionIds = ['thesis', extras[0].id, ...safeAssetConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const referenceIds = new Set(lesson403References.map(reference => reference.id));
const renderedCitationIds = [
  ...safeAssetConcepts.flatMap(concept => concept.sourceIds),
  ...safeAssetLabs.flatMap(lab => lab.sourceIds),
  ...safeAssetScenarios.flatMap(scenario => scenario.sourceIds),
  ...safeAssetChecks.flatMap(check => check.sourceIds),
  ...safeAssetResearchQuestions.flatMap(question => question.sourceIds),
  ...safeAssetReadingGuide.flatMap(route => route.sourceIds),
  ...safeAssetEvidenceGroups.flatMap(group => group.sourceIds),
  1, 2, 4, 7, 8, 12, 13, 14,
];
const evidenceMapIds = new Set(safeAssetEvidenceGroups.flatMap(group => group.sourceIds));
const coreRouteConceptIds = safeAssetCoreRoute.flatMap(step => step.conceptIds);

export const lesson403IntegrityAudit = [
  {
    key: 'eleven single-mechanism units retain causal chain boundary interfaces and one primary question',
    passed: safeAssetConcepts.length === 11
      && safeAssetConcepts.every(concept => concept.question.length >= 20
        && concept.intuition.length >= 80
        && concept.actors.length >= 70
        && concept.constraints.length >= 70
        && concept.behavior.length >= 70
        && concept.transmission.length >= 70
        && concept.feedback.length >= 70
        && concept.counterexample.length >= 60
        && concept.evidenceBoundary.length >= 60
        && concept.sourceIds.length > 0),
  },
  {
    key: 'exactly four necessary concept formulas and six independent labs attach exactly once',
    passed: safeAssetConcepts.filter(concept => concept.formula).length === 4
      && Object.values(labAttachments).filter(Boolean).length === 6
      && new Set(Object.values(labAttachments).filter(Boolean)).size === 6
      && Object.values(labAttachments).every(id => id === undefined || safeAssetLabs.some(lab => lab.id === id)),
  },
  {
    key: 'eight-step 88-minute route covers each concept exactly once and every visible section id is unique',
    passed: safeAssetCoreRoute.length === 8
      && safeAssetCoreRoute[0].time === '00–08分钟'
      && safeAssetCoreRoute[7].time === '76–88分钟'
      && coreRouteConceptIds.length === 11
      && new Set(coreRouteConceptIds).size === 11
      && safeAssetConcepts.every(concept => coreRouteConceptIds.includes(concept.id))
      && new Set(sectionIds).size === sectionIds.length,
  },
  {
    key: 'fourteen declared sources and every rendered citation resolve while evidence map covers all sources',
    passed: lesson403References.length === 14
      && lesson403ReadingList.length >= 8
      && lesson403References.every((reference, index) => reference.id === index + 1
        && reference.url.startsWith('https://')
        && reference.use.includes('支持')
        && reference.use.includes('不'))
      && renderedCitationIds.every(id => referenceIds.has(id))
      && lesson403References.every(reference => evidenceMapIds.has(reference.id))
      && [...evidenceMapIds].every(id => referenceIds.has(id)),
  },
  {
    key: 'twenty checks nineteen passport rules twenty-six entry terms eight research questions twenty invariants and eleven interfaces',
    passed: safeAssetChecks.length === 20
      && safeAssetPassportRules.length === 19
      && safeAssetEntryVocabulary.length === 26
      && safeAssetResearchQuestions.length === 8
      && safeAssetInvariants.length === 20
      && safeAssetInterfaces.length === 11
      && safeAssetObservedPassportFields.length >= 12,
  },
  {
    key: 'fixture lab scenario and canonical author gates pass while exactly two independent approvals are registered',
    passed: [...safeAssetFixtureAudit, ...safeAssetLabAudit, ...safeAssetScenarioAudit, ...canonicalSafeAssetAudit].every(item => item.passed)
      && canonicalSafeAssetFields.length === 20
      && !canonicalSafeAssetStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalSafeAssetStateExample.evidenceState.independentReviews.length === 2
      && canonicalSafeAssetStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved')
      && canonicalSafeAssetStateExample.evidenceState.twoFullApprovalsRegistered,
  },
  {
    key: 'local source ledger records archived identities while failed and frontier evidence remain visibly separate',
    passed: safeAssetSourceArchiveLedger.length >= 10
      && safeAssetSourceArchiveLedger.every(record => record.path.startsWith('tmp/research/4-03-draft/originals/')
        && record.bytes > 0
        && /^[a-f0-9]{64}$/.test(record.sha256)
        && record.readLocator.length >= 10)
      && safeAssetFailedDownloadLedger.every(record => record.responses.length >= 1
        && record.responses.every(response => response.bytes > 0
          && [200, 202, 403].includes(response.httpStatus)
          && response.responsePath.startsWith('tmp/research/4-03-draft/originals/failures/')
          && response.headersPath.startsWith('tmp/research/4-03-draft/originals/failures/'))
        && record.resolution.length >= 20)
      && safeAssetFrontierReadingLedger.every(record => record.pdfPages > 0
        && /^[a-f0-9]{64}$/.test(record.pdfSha256)
        && record.forbiddenUse.length >= 20),
  },
  {
    key: 'reviewed BODY-r4 identity has both independent approvals while delivery completion production and real-data calibration stay external',
    passed: canonicalSafeAssetStateExample.stateId === '4.03-reviewed-body-r1'
      && canonicalSafeAssetStateExample.clockState.ownBodyFrozenAt === '2026-09-16T21:40:58.241Z'
      && canonicalSafeAssetStateExample.eligibilityState.completeBodyFrozen
      && canonicalSafeAssetStateExample.eligibilityState.independentAccuracyApproval
      && canonicalSafeAssetStateExample.eligibilityState.independentPedagogyApproval
      && canonicalSafeAssetStateExample.eligibilityState.twoFullApprovals
      && !canonicalSafeAssetStateExample.eligibilityState.browserQaPassed
      && !canonicalSafeAssetStateExample.eligibilityState.printQaPassed
      && !canonicalSafeAssetStateExample.eligibilityState.finalPdfProduced
      && !canonicalSafeAssetStateExample.eligibilityState.completionClaimAllowed
      && !canonicalSafeAssetStateExample.eligibilityState.productionEligible,
  },
] as const;

if (!lesson403IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.03 lesson gate failed: ${lesson403IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson403Content() {
  return <>
    <noscript>
      <style>{'.lesson-page[data-lesson-id="4.03"] .safe-asset-interactive-only{display:none!important}'}</style>
    </noscript>
    <p className="safe-asset-nojs-fallback">无脚本／打印静态通道：六个C的固定输入、完整结果、手算、极端值、反例与来源，以及K1–K12的同题ABC和三条推理仍以静态同题形式完整呈现；屏幕关闭脚本时可通过原生折叠阅读，打印或PDF中答案直接展开。可编辑C与互动M不会进入这条静态通道，避免把不能重算的控件误当成有效交互。4.03的同一BODY-r4已由accuracy与pedagogy两位独立非作者从头批准，P1/P2/P3均为0；呈现通道不会改变审批对象或证据身份。</p>

    <section id="thesis" className="lesson-section lesson-opening">
      <p className="section-kicker">ONE CENTRAL MECHANISM · DEMAND IS FOR STATE-CONTINGENT CLAIM SERVICES, NOT A CURRENCY NAME ALONE</p>
      <h2>全球需要的不是一个抽象的“美元标签”，而是能在指定任务和坏状态中调用的债权服务；供给扩大服务，也可能侵蚀服务。</h2>
      {safeAssetThesis.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
      <div className="impact-facts" role="group" aria-label="4.03核心学习承诺">
        <article><span>先锁对象</span><b>currency ≠ claim ≠ reserve asset</b><p>同币种不等于同债务人、同权利或同风险。</p></article>
        <article><span>再拆服务</span><b>credit ≠ price ≠ liquidity ≠ access</b><p>安全是主体、用途、规模与状态条件下的向量。</p></article>
        <article><span>最后识别</span><b>gross stock → Qeff → price wedge</b><p>毛余额和低收益率都不是现实短缺的单独证明。</p></article>
      </div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 7, 8, 12, 13, 14]} /></p>
    </section>

    <section id="safe-asset-scope-route" className="lesson-section">
      <p className="section-kicker">OBJECT / PURPOSE / SERVICE / PRICE / CAPACITY / CREDIBILITY / IDENTIFICATION</p>
      <h2>第一遍用88分钟走完一条必要因果链；每一步都有退出检查，不用先背现实排名。</h2>
      <p>Master prerequisite是4.02 International Monetary System：本课只接收已经双审的语义边界——国际货币有不同功能、COFER是带特定分母和时钟的币种市场价值统计、SYN与观测不能混用。<code>inputLineage=[]</code>，不消费4.02的作者SYN数值，也不重刊其份额公式、2026Q1面板、FX两腿、载体路由或央行后备。4.03新增的问题只有三个：哪些资产服务被需求、毛存量怎样变成有效容量、聚合币种价值为什么不能识别特定工具数量。</p>
      <p>六个可编辑C按“哪一步最需要亲手改变条件”选择，编号有意保留机制族谱而不追求连续：对象分类由下面九张对象卡、机制01与退出检查共同承担，Triffin则由机制10的命题—反命题和双反馈系统图承担；没有C2、C4或C9，不表示对应机制被略去，也不允许把一个额外算式伪装成更强证据。</p>
      <div className={styles.objectGrid} role="group" aria-label="货币单位资产工具与制度安排对象矩阵">
        {objectCards.map(([title, identity, boundary], index) => <article key={title}><span>OBJECT {String(index + 1).padStart(2, '0')}</span><h4>{title}</h4><p><b>它是什么：</b>{identity}</p><p><b>不能跳过：</b>{boundary}</p></article>)}
      </div>
      <nav className="international-monetary-core-route" aria-label="4.03 88分钟核心学习路径">
        <div>
          <span>CORE ROUTE · 88 MINUTES</span>
          <h3>对象先于收益率，服务先于排名，容量先于短缺，识别先于结论。</h3>
          <p>任务栏说明这一段要亲手完成什么；退出检查是进入下一段的门。如果还需要用“大家都知道美国国债安全”回答，就回到本步把主体、用途、状态和工具补全。</p>
        </div>
        <ol>
          {safeAssetCoreRoute.map(step => <li key={step.time}>
            <span>{step.time}</span>
            <h4>{step.title}</h4>
            <p>{step.task}</p>
            <p><b>退出检查：</b>{step.exitCheck}</p>
            <p>{step.conceptIds.map((id, index) => <span key={id}>{index > 0 ? ' → ' : ''}<a href={`#${id}`}>{safeAssetConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p>
          </li>)}
        </ol>
      </nav>
      <h3>进入正文前的26个最小术语</h3>
      <div className="term-grid entry-vocabulary" aria-label="4.03入口术语" role="group">
        {safeAssetEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入机制与实验</span><h3>{term}</h3><p>{definition}</p></article>)}
      </div>
      <div className="precision-note"><span>当前状态 · BODY-r4已由两位独立非作者完整批准</span><p><code>stateId={canonicalSafeAssetStateExample.stateId}</code>、<code>reviews={canonicalSafeAssetStateExample.evidenceState.independentReviews.length}</code>。accuracy与pedagogy两席审查的是同一份冻结正文、清单与112页PDF，P1/P2/P3均为0；作者算术、类型与结构检查不占独立审稿席，现实point-in-time（PIT，历史时点当时可得）、out-of-sample（OOS，样本外）、因果、政策、主权评级、配置、交易与生产资格也没有因此成立。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[1, 2, 4, 5, 6, 7, 8]} /></p>
    </section>

    {safeAssetConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section id={concept.id} key={concept.id} className="lesson-section">
        <p className="section-kicker">{String(index + 1).padStart(2, '0')} · {concept.label}</p>
        <h2>{concept.title}</h2>
        <p className="lead-question"><b>这一节只解决一个问题：</b>{concept.question}</p>
        <p><b>先用直觉理解：</b>{concept.intuition}</p>
        <p><b>谁在行动：</b>{concept.actors}</p>
        <p><b>约束在哪里：</b>{concept.constraints}</p>
        <p><b>主体怎样反应：</b>{concept.behavior}</p>
        <p><b>行为怎样进入价格与系统：</b>{concept.transmission}</p>
        <p><b>新状态怎样反馈：</b>{concept.feedback}</p>
        {concept.id === 'safe-asset-mechanism-03' ? <div className={styles.serviceMatrix} role="group" aria-label="安全资产六维服务矩阵">{serviceCards.map(([title, body]) => <article key={title}><h4>{title}</h4><p>{body}</p></article>)}</div> : null}
        {concept.id === 'safe-asset-mechanism-05' ? <figure className={styles.liquidityPanel} aria-labelledby="safe-asset-liquidity-four-title"><figcaption><span>FOUR PANELS · NEVER SILENTLY AVERAGE</span><h3 id="safe-asset-liquidity-four-title">相同成交量可以对应四张完全不同的流动性图；每一格保留自己的单位和问题。</h3></figcaption><div>{liquidityCards.map(([title, body]) => <article key={title}><h4>{title}</h4><p>{body}</p></article>)}</div><p><b>成交量放在哪里？</b>它记录活动量，可与四维并排解释，但不替代其中任何一项，也不进入未经验证的“综合流动性分数”。</p></figure> : null}
        {concept.id === 'safe-asset-mechanism-11' ? <div className="precision-note"><span>公开COFER视角 · unknown不是0</span><p>公开聚合视角可以观测某币种期末市场价值OBS，但本金交易T、收益再投资I、FX估值、工具价格P、覆盖变化C以及特定工具数量通常不能由该总额唯一识别，必须保持unknown／null。C8的两条完整SYN路径只证明“同一总额可由不同工具数量组成”，不是对公开COFER变化的现实分解。</p></div> : null}
        {concept.formula ? <div className="equation-card">
          <span>{concept.formula.kind === 'definition' ? '定义式' : concept.formula.kind === 'measurement-template' ? '测量模板' : '作者SYN式'}</span>
          <div><code>{concept.formula.expression}</code></div>
          <p>{concept.formula.explanation}</p>
          <dl>{concept.formula.variables.map(variable => <div key={variable.symbol}><dt><code>{variable.symbol}</code></dt><dd>{variable.meaning}</dd></div>)}</dl>
          <p><b>STOP规则：</b>{concept.formula.stopRule}</p>
        </div> : null}
        <div className="precision-note"><span>反例、证据边界与章节接口</span><p><b>反例：</b>{concept.counterexample}</p><p><b>证据能支持到哪里：</b>{concept.evidenceBoundary}</p><p><b>从哪里来：</b>{concept.interfaces.from}</p><p><b>向哪里去：</b>{concept.interfaces.to}</p></div>
        {labId ? <SafeAssetLabStatic labId={labId} /> : null}
        <p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds} />{concept.sourceNote}</p>
      </section>;
    })}

    <section id="safe-asset-system-chain" className="lesson-section">
      <p className="section-kicker">TWO FEEDBACKS · MORE CLAIMS CAN EXPAND OR ERODE SERVICES</p>
      <h2>把十一节重新接成一个动态系统：需求先给服务定价，供给再同时改变数量和每单位服务。</h2>
      <SafeAssetDiagram />
      <p>正向承载链从未来付款、干预、保证金与风险管理任务开始，进入对坏状态可用资产的需求；更高价格和便利收益支持连续发行、基准曲线、现货／回购／衍生品网络与抵押使用。负向约束链从负债和共同持仓扩大开始，在财政、展期、做市承接或制度可达性受限时，通过价格冲击、haircut和风险限额降低每单位服务。两条链同时存在，才解释为什么供给关系可能非单调。</p>
      <p className="section-sources"><b>系统依据：</b><Cites ids={[7, 8, 12, 13, 14]} /></p>
    </section>

    <section id="safe-asset-interactive-section" className="lesson-section">
      <p className="section-kicker">INTERACTIVE M1–M12 · FIXED QUESTION / EDITABLE LABS REMAIN SEPARATE</p>
      <h2>十二道互动检查只读取各自固定默认；它们不会追随上面的可编辑实验，也不会把SYN答案升级成现实证据。</h2>
      <p>先独立判断对象、单位与约束，再点击一个中性数值。每题只反馈当前路径为什么对或错；若想重算条件，应回到对应C，而不是把M题当参数面板。</p>
      <SafeAssetQuiz />
    </section>

    <section id="safe-asset-static-twins" className="lesson-section">
      <p className="section-kicker">STATIC K1–K12 · SAME STEM / SAME OPTIONS / FULL THREE-PATH ANSWERS</p>
      <h2>无JavaScript与打印版保留同题、同选项和三条完整推理路径。</h2>
      <p>每个K与同号M使用完全相同的固定输入、单位、正确值和两个错误对象；展开答案不需要脚本，纸本则直接呈现所有路径。</p>
      <SafeAssetStaticQuiz />
    </section>

    <section id="safe-asset-checks-glossary" className="lesson-section">
      <p className="section-kicker">UNDERSTANDING CHECKS / ASSET PASSPORT / VOCABULARY</p>
      <h2>先用二十题检验能否自己重建因果链，再用十九字段资产护照检查任何现实材料。</h2>
      <div className="check-grid">
        {safeAssetChecks.map((check, index) => <div id={`safe-asset-check-${String(index + 1).padStart(2, '0')}`} key={check.question}>
          <span>{String(index + 1).padStart(2, '0')}</span><p>{check.question}</p>
          <details><summary>展开参考答案与依据</summary><p>{check.answer}</p>{check.sourceIds.length ? <p className="section-sources">依据：<Cites ids={check.sourceIds} /></p> : <p className="section-sources">依据：教材生产与证据分级合同；这是内部质量边界，不冒充外部经济学原典命题。</p>}</details>
          <p className="print-only"><b>{String(index + 1).padStart(2, '0')} · 答案：</b>{check.answer} {check.sourceIds.length ? <Cites ids={check.sourceIds} /> : '依据为教材生产与证据分级合同，不冒充外部经济学原典命题。'}</p>
        </div>)}
      </div>
      <h3>十九字段资产／证据护照</h3>
      <p>层级只有一套：前13项是任何现实对象的最低身份、统计与资产字段；后6项依次扩展占用、haircut、价格风险、四维流动性、法域／托管／操作可达和证据状态，合计19项研究护照。最低字段不等于信息已经完整；后六项与任务无关时也要明确写“不适用”，不能静默省略。这张护照不是要求每项研究必然拿到所有数据，而是规定缺什么就写unknown、能声称到哪里就停在哪里。</p>
      <div className="term-grid" role="group" aria-label="4.03资产与证据护照">
        {safeAssetPassportRules.map(rule => <article className="term-card" key={rule.field}><span>ASSET PASSPORT</span><h3>{rule.field}</h3><p><b>先问：</b>{rule.question}</p><p><b>为什么：</b>{rule.reason}</p><p><b>未知规则：</b>{rule.unknownRule}</p></article>)}
      </div>
    </section>

    <section id="safe-asset-evidence-boundaries" className="lesson-section">
      <p className="section-kicker">EVIDENCE STATE / FALSIFIABLE QUESTIONS / SOURCE ARCHIVE / HANDOFF</p>
      <h2>开放的世界观必须在这里收束成可观察、可否证、可追溯的局部研究问题。</h2>
      <h3>SYN / OBS / INF / PIT / OOS 五种证据身份</h3>
      <div className="evidence-map" role="group" aria-label="4.03证据身份地图">
        {safeAssetEvidenceBoundaries.map(boundary => <div key={boundary.state}><h4>{boundary.state} · {boundary.fullName}</h4><p><b>允许：</b>{boundary.allowed}</p><p><b>禁止：</b>{boundary.prohibited}</p><p><b>最低收据：</b>{boundary.receipt}</p></div>)}
      </div>
      <h3>八个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.03可证伪研究问题">
        {safeAssetResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>需要证据：</b>{question.evidenceNeeded}</p><p><b>什么会削弱它：</b>{question.whatWouldWeakenIt}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}
      </div>
      <h3>八条原典阅读路线</h3>
      <ol className="contract-list">{safeAssetReadingGuide.map(route => <li key={route.order}><b>{String(route.order).padStart(2, '0')}</b><span><strong>{route.title}</strong><br />读什么：{route.scope}<br />读完要会：{route.readFor}<br />不可推出：{route.doNotInfer} {route.sourceIds.length ? <Cites ids={route.sourceIds} /> : null}</span></li>)}</ol>
      <h3>二十条反误导不变量</h3>
      <ol className="contract-list">{safeAssetInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
      <h3>证据地图</h3>
      <div className="evidence-map" aria-label="4.03十四项来源证据地图" role="group">{safeAssetEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>本地原件与失败证据台账</h3>
      <div className="term-grid" role="group" aria-label="4.03本地原件台账">{safeAssetSourceArchiveLedger.map(record => <ArchiveRecord key={record.sourceKey} record={record} />)}</div>
      {safeAssetFailedDownloadLedger.length ? <><h4>保留的失败／不可用证据</h4><div className="term-grid" role="group" aria-label="4.03失败证据台账">{safeAssetFailedDownloadLedger.map(record => <FailedDownloadRecord key={`${record.request}-${record.responses.map(response => response.responsePath).join('|')}`} record={record} />)}</div></> : null}
      {safeAssetFrontierReadingLedger.length ? <><h4>研究前沿观察位（不作核心正文证据）</h4><div className="term-grid" role="group" aria-label="4.03前沿阅读台账">{safeAssetFrontierReadingLedger.map(record => <FrontierReadingRecord key={record.pdfSha256} record={record} />)}</div></> : null}
      <h3 id="safe-asset-cross-interfaces">跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.03跨章接口">{safeAssetInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="4.03作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...safeAssetFixtureAudit, ...safeAssetLabAudit, ...safeAssetScenarioAudit, ...canonicalSafeAssetAudit, ...lesson403IntegrityAudit].map(item => <li key={item.key} className={item.passed ? 'passed' : ''}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="precision-note"><span>当前审批与交付边界</span><p>4.03的BODY-r4已冻结，并由accuracy与pedagogy两名非作者分别完整批准；两份报告均为P1/P2/P3零问题。浏览器、无JavaScript、键盘、390px、打印、最终PDF与封版差异验收仍是正文审批之外的下游交付证据，在其单独完成前不作交付完成或生产资格声明。</p></div>
    </section>
  </>;
}

const lesson403Reviews: LessonRecord['reviews'] = [
  { kind: 'accuracy', completedAt: '2026-09-16T21:52:06Z', decision: 'approved', revision: '4.03-r1', summary: '从头完整审查同一BODY-r4冻结正文、十一项机制、六个C、十二M/K、二十题、十九字段护照、十四项来源与112页纸本；P1/P2/P3均为0。公式、STOP/null/zero/negative分支、便利收益候选边界、C7全网格、COFER识别上限与证据护照闭合。' },
  { kind: 'pedagogy', completedAt: '2026-09-16T21:49:38Z', decision: 'approved', revision: '4.03-r1', summary: '从头完整审查同一BODY-r4的初学者机制链、88分钟路径、六个实验、十二组互动与静态同题、术语首次展开、390px、无脚本及112页A4纸本；P1/P2/P3均为0，BODY-r3遗留问题全部关闭。' },
];

export const lesson403: LessonRecord = {
  slug: '4-03',
  id: '4.03',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Reserve Currency 与 Safe Asset Demand：资产服务、有效容量与供给—可信度张力',
  subtitle: '为什么全球同时需要美元和美国国债：从货币单位与债权工具分离、官方用途和便利收益匹配，一直走到抵押现金能力、Qeff容量漏斗、非单调供给、Triffin条件张力与COFER工具识别上限',
  readingTime: '页面内置88分钟核心路径：11个单一机制与退出检查；六个独立C、十二M/K、二十题、十九字段护照、研究设计与原典路线另作第二遍。均为真实学习估时，不靠凑字保证时长',
  prerequisite: 'Master prerequisite：4.02 International Monetary System；只保留真实已审lesson身份与语义接口，不消费上游SYN或现实快照数值。按需调用T03/T05/T06/T08与2.06 Repo/Haircut最小直觉；后续接口为4.04–4.07、4.16、4.20、5.13–5.14及7.24–7.26',
  updatedAt: '2026-09-16',
  revision: '4.03-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson403Reviews,
  previous: { slug: '4-02', label: '4.02 International Monetary System' },
  next: { label: '4.04 US Treasury 作为全球定价曲线' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...safeAssetConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson403Content,
  references: lesson403References,
  readingList: lesson403ReadingList,
  readingListOrder: 'source',
};
