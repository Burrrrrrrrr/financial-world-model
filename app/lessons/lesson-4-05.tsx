import DollarFundingDiagram from '../components/DollarFundingDiagram';
import DollarFundingLab from '../components/DollarFundingLab';
import DollarFundingQuiz from '../components/DollarFundingQuiz';
import styles from '../components/dollarFunding.module.css';
import { dollarFundingLabs, dollarFundingLabAudit, type DollarFundingLabId } from '../components/dollarFundingLabs';
import { dollarFundingConcepts } from './dollarFundingConcepts';
import {
  dollarFundingEvidenceGroups,
  dollarFundingFailedSourceLedger,
  lesson405ReadingList,
  lesson405References,
} from './dollarFundingReferences';
import {
  dollarFundingChecks,
  dollarFundingCoreRoute,
  dollarFundingEntryVocabulary,
  dollarFundingEvidenceBoundaries,
  dollarFundingInterfaces,
  dollarFundingInvariants,
  dollarFundingPassportRules,
  dollarFundingResearchQuestions,
  dollarFundingThesis,
  dollarFundingUnderstandingQuestions,
} from './dollarFundingStudy';
import {
  canonicalDollarFundingAudit,
  canonicalDollarFundingFields,
  canonicalDollarFundingStateExample,
  dollarFundingObservedPassportFields,
} from './dollarFundingState';
import type { LessonRecord } from './types';

export { canonicalDollarFundingStateExample } from './dollarFundingState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'dollar-funding-route', label: '95分钟主路径／对象护照' },
  { id: 'dollar-funding-system-chain', label: '传染链、2011与2020反例' },
  { id: 'dollar-funding-checks', label: '十二M/K与二十题' },
  { id: 'dollar-funding-evidence-research', label: '证据、研究与跨章接口' },
] as const;

const labAttachments: Readonly<Record<string, DollarFundingLabId | undefined>> = {
  'dollar-funding-mechanism-01': 'C1',
  'dollar-funding-mechanism-02': 'C2',
  'dollar-funding-mechanism-04': 'C3',
  'dollar-funding-mechanism-07': 'C4',
  'dollar-funding-mechanism-10': 'C5',
  'dollar-funding-mechanism-13': 'C6',
};

const firstUseDecoder = [
  ['Legal entity（法律实体）', '真正拥有资产、承担负债和履行付款合同的主体；集团名称与国别只是上层分类。'],
  ['Settlement currency（结算币种）', '合同在value date必须实际交付的币种；美元计价资产不必等于美元cash。'],
  ['Horizon H（窗口）', '以完整UTC ISO as-of和horizonEnd定义的前瞻现金区间；本课统一使用开左闭右(as-of, horizonEnd]。D0/D1只是显示标签。'],
  ['CP / CD（短期市场融资）', 'CP通常是企业或金融机构发行的短期无担保票据；CD是银行发行的存款类工具。两者的投资者、期限与准入窗口可以突然变化。'],
  ['Rollover（滚续）', '旧融资到期后通过一笔新交易取得资金；旧还款腿不会因预期续作而消失。'],
  ['Repo（回购）', '抵押证券换现金并约定回购；initial与repurchase legs都属于合同。'],
  ['FX swap（外汇掉期）', 'spot与forward反向币种交换捆绑；今天取得美元会留下未来美元腿。'],
  ['Covered interest parity（CIP）', '可比cash与FX合成策略终值相等的复制基准；现实执行条件不完全相同会留下basis。'],
  ['Cross-currency basis（跨币种基差）', '带完整报价护照的相对资金价格楔子；正负没有脱离定义的固定shortage含义。'],
  ['Margin（保证金现金腿）', '头寸价值变化或融资规则触发的现金/抵押补充要求；它有自己的金额与到期时钟。'],
  ['Haircut（折扣）', '抵押品marked value中不能换成借款现金的比例；它作用于capacity，不自动产生receipt。'],
  ['Dealer capacity（中介承载能力）', '做市商在资本、杠杆、融资、限额与结算约束下愿意和能够承接的交易规模。'],
  ['Committed executable（已承诺可执行）', '不可撤销、条件已满足且金额/UTC value timestamp确定；必须晚as-of，且只有落在(as-of, horizonEnd]内才进当前前瞻账本。'],
  ['Swap line（央行互换额度）', '第一层由FRBNY执行FOMC授权，与外国央行完成两币交换：initial USD IN/FCY OUT，到期USD principal+interest/compensation OUT并原数量返还FCY；本课1–30日只是实验输入域，官方材料支持next day至最长3个月；私人机构只能经独立本地安排。'],
  ['FIMA repo', '获批官方账户持有人以自己的Treasury向SOMA做repo；当前期限只允许O/N或7-calendar-day。本课可选author-SYN additional-margin腿若启用，只能严格发生在initial与repurchase之间。'],
] as const;

const diagnosticObjects = [
  ['Price', '利率、basis、repo、bid–ask、forward points', '成本变化；不能单独回答可借多少或谁能借。'],
  ['Quantity / tenor', '成交量、quote size、获配量、可用期限', '资金或中介容量；不能单独回答实体资格。'],
  ['Access', 'eligibility、limit、documentation、collateral、award、settlement', 'route是否对该实体可执行；“市场存在”不能替代。'],
  ['Cash leg', 'amount、currency、direction、value timestamp、source event', '真正进入期限账本的对象；capacity和announcement不是cash leg。'],
] as const;

const sectionIds = ['thesis', extras[0].id, ...dollarFundingConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const referenceIds = new Set<number>(lesson405References.map(reference => reference.id));
const renderedCitationIds = [
  ...dollarFundingConcepts.flatMap(concept => concept.sourceIds),
  ...dollarFundingLabs.flatMap(lab => lab.sourceIds),
  ...dollarFundingChecks.flatMap(check => check.sourceIds),
  ...dollarFundingResearchQuestions.flatMap(question => question.sourceIds),
  ...dollarFundingEvidenceGroups.flatMap(group => group.sourceIds),
  1, 2, 3, 4, 7, 8, 10, 11, 12, 13, 14, 15, 16, 17, 18,
];
const evidenceMapIds = new Set<number>(dollarFundingEvidenceGroups.flatMap(group => group.sourceIds));
const routeConceptIds = dollarFundingCoreRoute.flatMap(step => step.conceptIds);

export const lesson405IntegrityAudit = [
  {
    key: 'fourteen single-mechanism units retain causal chain counterexample evidence boundary and interfaces',
    passed: dollarFundingConcepts.length === 14 && dollarFundingConcepts.every(concept => concept.question.length >= 20 && concept.intuition.length >= 70 && concept.actors.length >= 60 && concept.constraints.length >= 60 && concept.behavior.length >= 60 && concept.transmission.length >= 60 && concept.feedback.length >= 60 && concept.counterexample.length >= 45 && concept.evidenceBoundary.length >= 40 && concept.sourceIds.length > 0),
  },
  {
    key: 'six independent labs attach once and never share fixture IDs',
    passed: Object.values(labAttachments).filter(Boolean).length === 6 && new Set(Object.values(labAttachments).filter(Boolean)).size === 6 && dollarFundingLabs.length === 6 && new Set(dollarFundingLabs.map(lab => lab.fixtureId)).size === 6,
  },
  {
    key: '95-minute route covers every concept once and all visible section IDs are unique',
    passed: dollarFundingCoreRoute.length === 10 && dollarFundingCoreRoute[0].time === '00–08分钟' && dollarFundingCoreRoute[9].time === '90–95分钟' && routeConceptIds.length === 14 && new Set(routeConceptIds).size === 14 && dollarFundingConcepts.every(concept => routeConceptIds.includes(concept.id as (typeof routeConceptIds)[number])) && new Set(sectionIds).size === sectionIds.length,
  },
  {
    key: 'eighteen sources resolve citations and evidence map covers every source',
    passed: lesson405References.length === 18 && lesson405ReadingList.length === 9 && lesson405References.every((reference, index) => reference.id === index + 1 && reference.url.startsWith('https://') && reference.use.includes('支持') && (reference.use.includes('不') || reference.use.includes('不能'))) && renderedCitationIds.every(id => referenceIds.has(id)) && lesson405References.every(reference => evidenceMapIds.has(reference.id)),
  },
  {
    key: 'scope layers include twelve checks twenty questions twenty-two passport rules vocabulary research interfaces boundaries and invariants',
    passed: dollarFundingChecks.length === 12 && dollarFundingUnderstandingQuestions.length === 20 && dollarFundingPassportRules.length === 22 && dollarFundingEntryVocabulary.length >= 34 && dollarFundingResearchQuestions.length === 10 && dollarFundingInterfaces.length === 14 && dollarFundingEvidenceBoundaries.length === 8 && dollarFundingInvariants.length >= 28 && dollarFundingObservedPassportFields.length === 27,
  },
  {
    key: 'canonical reviewed-BODY preserves exact frozen identity and two approvals while downstream delivery remains external',
    passed: canonicalDollarFundingFields.length === 19
      && canonicalDollarFundingStateExample.authoringGate.verdict === 'APPROVE_FOR_AUTHORING'
      && !canonicalDollarFundingStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalDollarFundingStateExample.evidenceState.independentReviews.length === 2
      && canonicalDollarFundingStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.revision === '4.05-r1')
      && canonicalDollarFundingStateExample.evidenceState.accuracyApprovalComplete
      && canonicalDollarFundingStateExample.evidenceState.pedagogyApprovalComplete
      && canonicalDollarFundingStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers
      && !canonicalDollarFundingStateExample.evidenceState.sealedMetadataDeltaApprovedByTwoIndependentReviewers
      && !canonicalDollarFundingStateExample.evidenceState.browserQaComplete
      && !canonicalDollarFundingStateExample.evidenceState.finalPdfAccepted,
  },
  {
    key: 'all author finite audits pass but remain distinct from independent review',
    passed: [...dollarFundingLabAudit, ...canonicalDollarFundingAudit].every(item => item.passed) && !canonicalDollarFundingStateExample.evidenceState.authorFiniteChecksAreIndependentReview,
  },
] as const;

if (!lesson405IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.05 lesson gate failed: ${lesson405IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson405Content() {
  return <>
    <noscript><style>{'.lesson-page[data-lesson-id="4.05"] .dollar-funding-interactive-only{display:none!important}'}</style></noscript>
    <p className="dollar-funding-nojs-fallback">无脚本静态通道：六个C各自保留固定输入、结果、手算、极端值、反例与来源；十二道M/K先显示题册，答案与误区在后续默认关闭的答案册。BODY-r1、BODY-r2与BODY-r3的原始审稿证据均按原样保留；r3虽获pedagogy APPROVE，但accuracy仍为CHANGES_REQUIRED，因此两席没有同时批准同一BODY，r3整体被拒绝。当前机制正文已由两位非作者对同一clean BODY-r4完整批准；页面只登记这一内容审批，sealed元数据差异、浏览器与最终交付状态仍必须由外部收据证明。</p>

    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">ONE CENTRAL MECHANISM · DATED DOLLAR DELIVERY THROUGH CONDITIONAL ROUTES</p>
      <h2>“美元融资紧张”不是美元总量突然消失，而是某个主体在某个日期无法把资源及时转成可交付美元。</h2>
      <p><b>先把开场里的行话翻成普通话：</b>CP是机构发行的短期无担保票据，CD是银行发行的存款类工具；repo是先用证券换现金、以后再付现金把证券买回；FX swap是今天与未来各有一组方向相反的货币交换。它们都不是“市场名字一出现，美元就已经到账”，而是各自带有资格、数量、合同状态与结算日期的路线。</p>
      <p><b>再区分价格与资产负债表约束：</b>basis是直接美元融资与外汇合成美元融资之间、在明确报价约定下的相对价格楔子；margin是需要另行交付的保证金现金腿；haircut是抵押品市值中不能变成借款的那一部分；dealer capacity则是中介在资本、杠杆、融资、限额与结算约束下能承接多少交易。四者都可能传递压力，却没有任何一个单独等同于“某实体缺多少美元”。</p>
      <p>{dollarFundingThesis.statement}</p>
      <p>完整因果链是：美元合同与或有现金流在某个实体和期限集中 → 存款、CP/CD、repo、FX swap或内部渠道在价格、数量、期限或准入上收紧 → 主体提高报价、替代融资、调用内部资源、卖资产或削减贷款 → basis、汇率、margin、haircut、dealer capacity与资产价格把局部缺口传给其他市场 → 新价格和资产负债表状态成为下一轮付款与融资的输入。每一步都可能被长期资金、自然对冲、可执行转移或官方后备切断，也可能被共同去杠杆放大。</p>
      <div className="impact-facts" role="group" aria-label="4.05五条核心不等式">{dollarFundingThesis.inequalities.map((inequality, index) => <article key={inequality}><span>BOUNDARY {String(index + 1).padStart(2, '0')}</span><b>{inequality}</b><p>{index === 0 ? '先问谁、何币种、何时交付。' : index === 1 ? '上限、承诺和结算是三个状态。' : index === 2 ? '价格、数量和准入必须联合观察。' : index === 3 ? '终值风险与现金时钟必须分栏。' : '官方路线逐层登记，不画成一根总水管。'}</p></article>)}</div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 4, 10, 11, 12, 13, 16]} /></p>
    </section>

    <section className="lesson-section" id="dollar-funding-route">
      <p className="section-kicker">ENTITY / CURRENCY / HORIZON / ROUTE / STATUS / VALUE DATE / FEEDBACK</p>
      <h2>第一遍用95分钟走完闭环：对象先于指标，现金腿先于叙事，准入先于“有工具”。</h2>
      <p>先修课只提供语义接口：4.03说明美元与Treasury可提供哪些服务、capacity为何不等于cash；4.04说明repo、FX hedge、basis与本地门为何要单列。本课不复制它们的合成输入或数值输出，也不把上游的双审状态升级为本课已获批准。</p>
      <h3>十五个首次术语先解码</h3>
      <div className="term-grid entry-vocabulary" role="group" aria-label="4.05十五个首次术语解码">{firstUseDecoder.map(([term, definition]) => <article className="term-card" key={term}><span>FIRST-USE DECODER</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <nav className="international-monetary-core-route" aria-label="4.05 95分钟核心学习路径"><div><span>CORE ROUTE · 95 MINUTES</span><h3>每一段都用同一组问题退出：谁、何币种、何时、哪条cash leg、哪道route gate、什么证据仍未知？</h3><p>第一遍最后五分钟只抽二至三道M/K并提出一个研究问题；完整十二题、历史案例扩展和其余研究题都属于第二遍。即使压缩到80分钟，也不能删掉实体/期限、gross/net、basis报价护照或官方分层。</p></div><ol>{dollarFundingCoreRoute.map(step => <li key={step.time}><span>{step.time}</span><h4>{step.title}</h4><p>{step.task}</p><p><b>退出检查：</b>{step.exit}</p>{step.conceptIds.length ? <p>{step.conceptIds.map((id, index) => <span key={id}>{index ? ' → ' : ''}<a href={`#${id}`}>{dollarFundingConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p> : <p><a href="#dollar-funding-checks">进入M/K抽样与最低证据包</a></p>}</li>)}</ol></nav>
      <h3>Price—Quantity—Access还不够：最终要落到不可重复的cash leg</h3>
      <div className={styles.routeTableWrap} role="region" aria-label="美元融资四类诊断对象" tabIndex={0}><table className={styles.routeTable}><thead><tr><th>对象</th><th>例子</th><th>能回答／不能回答</th></tr></thead><tbody>{diagnosticObjects.map(([object, examples, boundary]) => <tr key={object}><td>{object}</td><td>{examples}</td><td>{boundary}</td></tr>)}</tbody></table></div>
      <DollarFundingDiagram />
      <div className="precision-note"><span>当前状态 · CLEAN BODY-r4 已由两位独立非作者完整批准</span><p>canonical审批状态为<code>{canonicalDollarFundingStateExample.stateId}</code>。开写前规格<code>{canonicalDollarFundingStateExample.authoringGate.specificationSha256.slice(0, 12)}…</code>只批准开始写作；BODY-r1、r2与r3均因两席未同时批准同一冻结BODY而整体拒绝。accuracy与pedagogy两席审查的是同一份17个正文文件的clean冻结BODY、208项清单与99页PDF；accuracy为P1=0、P2=0、P3=1，pedagogy为P1=0、P2=0、P3=2，三项P3均为非阻断改进。六个C仍只有作者SYN，<code>inputLineage=[]</code>，没有observed、PIT、identified shock、OOS、预测、收益、交易或production资格。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[1, 2, 14, 15, 16, 18]} /></p>
    </section>

    {dollarFundingConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section className="lesson-section" id={concept.id} key={concept.id}>
        <p className="section-kicker">MECHANISM {String(index + 1).padStart(2, '0')} · {concept.label}</p>
        <h2>{concept.title}</h2>
        <p className="lead-question"><b>本节只解决一个问题：</b>{concept.question}</p>
        <h3>先建立直觉</h3><p>{concept.intuition}</p>
        <h3>谁参与，谁真正承担付款</h3><p>{concept.actors}</p>
        <h3>约束先于行为</h3><p>{concept.constraints}</p>
        <h3>主体会怎样反应</h3><p>{concept.behavior}</p>
        <h3>怎样传到其他市场与实体</h3><p>{concept.transmission}</p>
        <h3>新状态怎样反馈回来</h3><p>{concept.feedback}</p>
        {concept.formula ? <div><p className={styles.formula}>{concept.formula.expression}</p><dl className={styles.formulaGrid}>{concept.formula.variables.map(variable => <div key={variable.symbol}><dt>{variable.symbol}</dt><dd>{variable.meaning}</dd></div>)}</dl><p><b>直白解释：</b>{concept.formula.explanation}</p><p className={styles.boundary}><b>STOP：</b>{concept.formula.stopRule}</p></div> : null}
        <h3>用反例修正过度直觉</h3><p>{concept.counterexample}</p>
        <h3>证据能支持到哪里</h3><p>{concept.evidenceBoundary}</p>
        <div className="interface-grid" role="group" aria-label={`${concept.title}接口`}><article><span>FROM</span><p>{concept.interfaces.from}</p></article><article><span>TO</span><p>{concept.interfaces.to}</p></article></div>
        <p className="section-sources"><b>本单元来源：</b><Cites ids={concept.sourceIds} /> {concept.sourceNote}</p>
        {labId ? <DollarFundingLab labId={labId} /> : null}
      </section>;
    })}

    <section className="lesson-section" id="dollar-funding-system-chain">
      <p className="section-kicker">SYSTEM CLOSURE · TWO HISTORICAL WINDOWS, NOT ONE CRISIS SCRIPT</p>
      <h2>把十四个机制重新合成动态系统：传染来自多条条件边同时收紧，而不是一个指标越过阈值。</h2>
      <p>正常时期，终端用户、银行、MMF、dealer、repo、FX swap和内部资本市场把美元在时间与实体之间搬运。冲击首先可能落在客户提款、MMF赎回、衍生品margin、短期到期或抵押品价值中的任一处；随后主体选择新融资、调拨、卖出与缩贷。只有当多个主体共享短期限、同一collateral、同一dealer或相近value dates时，局部动作才容易同步化。此时price、quantity与access共同变化，资产出售又改变下一轮haircut、margin与净值。</p>
      <p>2011年的欧洲银行案例提供一条可检验链：对美国MMF资金事前依赖更高的银行，在资金撤出后更明显地削减美元相对欧元贷款。研究价值不在于证明“MMF永远导致全球危机”，而在于它比较银行暴露与币种内贷款，使资金供给解释更可证伪。2020年则同时出现NBFI赎回、企业credit-line draws、margin、dealer capacity和资产出售；FSB与CGFS复盘要求我们容纳多因反馈，不能把一个basis图当作全部系统。</p>
      <p>还要区分两个常被同名basis混淆的对象：USD cross-currency basis比较现金与FX-swap-implied美元成本；Treasury cash–futures basis trade是现券、期货、repo与margin之间的相对价值交易。它们可以在同一现金争夺中相互作用，却不是同一价格、同一position或同一cash-flow ledger。</p>
      <div className={styles.routeTableWrap} role="region" aria-label="2011与2020证据比较" tabIndex={0}><table className={styles.routeTable}><thead><tr><th>窗口</th><th>首先观察</th><th>主体反应</th><th>可声称／不可声称</th></tr></thead><tbody><tr><td>2011 euro-area banks</td><td>美国MMF暴露、CIP偏离、币种特定贷款</td><td>替代美元资金、削减美元相对欧元贷款</td><td>支持该样本机制；不外推所有银行和时期。</td></tr><tr><td>March 2020</td><td>赎回、credit-line draws、margin、dealer capacity、basis与市场功能</td><td>囤积cash、缩短期限、卖资产、公共后备</td><td>支持多渠道反馈；不做单因份额或固定危机剧本。</td></tr></tbody></table></div>
      <div className="precision-note"><span>最小可证伪证据包</span><p>至少需要：一个legal entity与H；完整gross cash legs；至少两类price/quantity/access观察；一项行为反应；一项竞争解释；一项能使主叙事失败的反证。只有basis、DXY、GLI或facility headline，不足以证明实体美元shortage。</p></div>
      <p className="section-sources"><b>案例依据：</b><Cites ids={[1, 7, 8, 9]} /></p>
    </section>

    <section className="lesson-section" id="dollar-funding-checks">
      <p className="section-kicker">EXIT CHECKS · EXPLAIN, CALCULATE, THEN FALSIFY</p>
      <h2>十二道M/K检查与二十道理解题：答案必须带主体、期限、cash leg、route gate和证据边界。</h2>
      <DollarFundingQuiz />
      <h3>二十道第二遍作业</h3>
      <ol className="understanding-list">{dollarFundingUnderstandingQuestions.map((question, index) => <li key={question}><b>{String(index + 1).padStart(2, '0')}</b> · {question}</li>)}</ol>
      <p className={styles.boundary}><b>统一评分：</b>如果答案没有说明谁、何币种、何窗口、哪一条可执行cash leg、哪一道access gate以及什么仍是unknown，只写“恐慌、避险、美元荒”不计为机制答案。</p>
    </section>

    <section className="lesson-section" id="dollar-funding-evidence-research">
      <p className="section-kicker">MEASUREMENT / RESEARCH / INTERFACES / PROVENANCE</p>
      <h2>从会解释机制走向可验证研究：先保存护照与null，再谈模型和预测。</h2>
      <h3>二十二字段资金护照</h3>
      <div className="term-grid" role="group" aria-label="4.05二十二字段资金护照">{dollarFundingPassportRules.map(([field, rule]) => <article className="term-card" key={field}><span>FUNDING / ROUTE / EVIDENCE PASSPORT</span><h3>{field}</h3><p>{rule}</p></article>)}</div>
      <h3>入口术语词典</h3>
      <div className="term-grid entry-vocabulary" role="group" aria-label="4.05入口术语">{dollarFundingEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入现实数据</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <h3>十个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.05可证伪研究问题">{dollarFundingResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>拒绝：</b>{question.reject}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}</div>
      <h3>六组命题—证据地图</h3>
      <div className="evidence-map" role="group" aria-label="4.05十八项来源证据地图">{dollarFundingEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>失败与版本受限来源也要保留</h3>
      <div className="term-grid" role="group" aria-label="4.05失败与受限来源台账">{dollarFundingFailedSourceLedger.map(record => <article className="term-card" key={record.title}><span>FAILED / VERSION-LIMITED · PRESERVED</span><h3>{record.title}</h3><p><b>请求：</b><code>{record.request}</code></p><p><b>状态：</b>{record.status}</p><p><b>处置：</b>{record.resolution}</p><p className="section-sources">对应来源：<Cites ids={record.sourceIds} /></p></article>)}</div>
      <h3>八条证据边界</h3>
      <ol className="understanding-list">{dollarFundingEvidenceBoundaries.map((boundary, index) => <li key={boundary}><b>{String(index + 1).padStart(2, '0')}</b> · {boundary}</li>)}</ol>
      <h3>跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.05跨章接口">{dollarFundingInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <h3>不可破坏的不变量</h3>
      <div className="check-grid" role="group" aria-label="4.05不变量"><div><ul>{dollarFundingInvariants.slice(0, Math.ceil(dollarFundingInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div><div><ul>{dollarFundingInvariants.slice(Math.ceil(dollarFundingInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div></div>
      <div className="yield-fixture-audit" role="group" aria-label="4.05作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...dollarFundingLabAudit, ...canonicalDollarFundingAudit, ...lesson405IntegrityAudit].map(item => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="precision-note"><span>当前审批与交付边界</span><p>不可改写的<code>BODY-r1</code>、<code>BODY-r2</code>与<code>BODY-r3</code>及其原始审稿报告继续作为失败 provenance 保留；r3的accuracy CHANGES_REQUIRED与pedagogy APPROVE不能拼成双审批准，因为两席没有同时接受同一BODY。当前这是<code>4.05-r1</code>的已登记内容审批：accuracy与pedagogy分别完整批准同一<code>/private/tmp/market-405-body-r4-clean-20260917</code>。本次仅允许catalog、lesson metadata与canonical state三文件从草稿提升；这组三文件差异是否通过同两名审稿人的sealed delta复核，以及browser、无JavaScript、键盘、390px、print、PDF与最终交付是否完成，都只能由外部收据证明。内容双审不构成现实数据校准、PIT/OOS、因果、预测、交易或production资格。</p></div>
    </section>
  </>;
}

const lesson405Reviews: LessonRecord['reviews'] = [
  {
    kind: 'accuracy',
    completedAt: '2026-09-17T07:33:42Z',
    decision: 'approved',
    revision: '4.05-r1',
    summary: '独立复核同一clean BODY-r4的十七个正文文件、十四项机制、六个C、十二M/K、二十题、二十二字段护照、十八项来源与99页A4纸本；P1/P2为0、P3为1。实际C4计算正确；非阻断建议是让CIP概念公式把FCY/USD报价方向锁得更明确。',
  },
  {
    kind: 'pedagogy',
    completedAt: '2026-09-17T07:31:58Z',
    decision: 'approved',
    revision: '4.05-r1',
    summary: '独立复核同一clean BODY-r4的95分钟初学者路径、十四项机制、六个实验、十二组互动与静态题册、首次术语、390px、无脚本与99页A4纸本；P1/P2为0、P3为2。非阻断建议是降低C6首次操作密度，并把cash leg的白话定义前置。',
  },
];

export const lesson405: LessonRecord = {
  slug: '4-05',
  id: '4.05',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Global Dollar Funding：实体期限缺口、融资路线与全球反馈',
  subtitle: '美元融资紧张为什么会传染到非美国市场：从法律实体、币种与期限梯出发，区分FX swap现金腿、CIP/basis、中介资产负债表、抵押品capacity、美元升值、MMF资金链、内部资本市场、swap line与FIMA分层官方后备',
  readingTime: '页面内置95分钟核心路径：14个单一机制、六个独立SYN，末段只抽二至三道M/K并提出一个研究问题；完整十二M/K、二十题、证据地图、研究设计、词典和原典路线另作第二遍。估时来自学习任务，不以重复文字凑时长',
  prerequisite: 'Master prerequisites：4.03 Reserve Currency / Safe Asset与4.04 US Treasury；按需回看T06 Balance Sheet、T07 FX/Repo/Derivatives、T08 Financial Data、2.06 Bank Intermediary、3.13 Financial Conditions与3.20 Exchange Rate。后续接口为4.06–4.11及7.11/7.16/7.24–7.26',
  updatedAt: '2026-09-17',
  revision: '4.05-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson405Reviews,
  previous: { slug: '4-04', label: '4.04 US Treasury 作为全球定价曲线' },
  next: { slug: '4-06', label: '4.06 Global Banks 与 Cross-border Credit' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...dollarFundingConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson405Content,
  references: lesson405References,
  readingList: lesson405ReadingList,
  readingListOrder: 'source',
};
