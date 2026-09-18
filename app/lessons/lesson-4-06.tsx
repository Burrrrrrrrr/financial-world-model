import GlobalBanksDiagram from '../components/GlobalBanksDiagram';
import GlobalBanksLab from '../components/GlobalBanksLab';
import GlobalBanksQuiz from '../components/GlobalBanksQuiz';
import styles from '../components/globalBanks.module.css';
import { globalBanksLabAudit, globalBanksLabs, type GlobalBanksLabId } from '../components/globalBanksLabs';
import { globalBanksConcepts } from './globalBanksConcepts';
import {
  globalBanksEvidenceGroups,
  globalBanksFailedSourceLedger,
  lesson406ReadingList,
  lesson406References,
} from './globalBanksReferences';
import {
  globalBanksAnswerOrderAudit,
  globalBanksChecks,
  globalBanksCoreRoute,
  globalBanksEntryVocabulary,
  globalBanksEvidenceBoundaries,
  globalBanksInterfaces,
  globalBanksInvariants,
  globalBanksPassportRules,
  globalBanksResearchQuestions,
  globalBanksThesis,
  globalBanksUnderstandingQuestions,
} from './globalBanksStudy';
import {
  canonicalGlobalBanksAuthorAudit,
  canonicalGlobalBanksFields,
  canonicalGlobalBanksStateExample,
} from './globalBanksState';
import type { LessonRecord } from './types';

export { canonicalGlobalBanksStateExample } from './globalBanksState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'global-banks-route', label: '95分钟主路径／三轴护照' },
  { id: 'global-banks-system-chain', label: '动态闭环与历史反例' },
  { id: 'global-banks-checks', label: '十二M/K与二十题' },
  { id: 'global-banks-evidence-research', label: '证据、研究与跨章接口' },
] as const;

const labAttachments: Readonly<Record<string, GlobalBanksLabId | undefined>> = {
  'global-banks-mechanism-03': 'C1',
  'global-banks-mechanism-04': 'C2',
  'global-banks-mechanism-06': 'C3',
  'global-banks-mechanism-10': 'C4',
  'global-banks-mechanism-12': 'C5',
  'global-banks-mechanism-13': 'C6',
};

const firstUseDecoderTerms = [
  'author-SYN',
  'M / K',
  'STOP',
  'PIT',
  'OOS',
  'P1 / P2 / P3',
  'Sealed delta',
  'LCR',
  'Ring-fencing',
  'RWA',
  'PD / LGD',
  'NBFI',
  'Global bank',
  'Parent group',
  'Legal entity',
  'Branch',
  'Subsidiary',
  'LBS',
  'CBSI',
  'CBSG',
] as const;

const firstUseDecoder = firstUseDecoderTerms.map(term => {
  const entry = globalBanksEntryVocabulary.find(([label]) => label === term);
  if (!entry) throw new Error(`4.06 first-use decoder is missing ${term}`);
  return entry;
});

const threeAxes = [
  ['Parent nationality', '谁最终控制银行集团？', '集团战略、合并监管与共同母行暴露', '不能回答资产记在哪或钱从哪里来'],
  ['Booking-office residence', '哪一个居民办事处持有／报告头寸？', 'LBS所在地、原始跨境／当地路线的一端', '不能自动回答授信决策地或最终风险归属'],
  ['Immediate borrower residence', '合同债务人住在哪里？', '原始路线另一端、CBSI即时对手方', '不能被担保人或贷款币种覆盖'],
] as const;

const cameraComparison = [
  ['LBS', '银行办事处所在地', '跨境LBS标准口径：unconsolidated；保留与非居民related offices的intragroup', '币种、记账地、跨境与跨境集团内头寸', '不能直接给全球合并风险；居民office间国内头寸不在该跨境聚合'],
  ['CBSI', '最终控制母行国籍', 'reporting-area集团标准口径：worldwide consolidated；合并边界内抵销intragroup', '对即时对手方国家的合并foreign claims', '不能还原内部资金路线；standalone例外须查reporting-population元数据'],
  ['CBSG', '最终控制母行国籍', '同一标准CBS合并边界；再按合格担保重分配风险', '担保人基础的风险地图', '不改写原始借款人、booking或originationRoute'],
] as const;

const loanOfferEvidenceMatrix = [
  { term: 'Price / spread / fees', observable: '银行问卷可直接报告方向与收紧／放松；单笔合同价格仍需合同或登记数据。', level: 'bank survey；不是application或contract microdata', state: 'survey-supported；本课当前无observed输入', sourceIds: [20, 21] as const },
  { term: 'Quantity / maximum size', observable: '问卷可报告额度或maximum size变化；实际批准与提款数量需更细数据。', level: 'bank survey + loan/application records', state: '部分直接支持；成交数量当前unknown', sourceIds: [15, 18, 20, 21] as const },
  { term: 'Approval', observable: 'credit standards可以提示审批门收紧，但不等于申请级批准概率。', level: 'application-level decision records required', state: '概念候选；当前来源不直接观测概率', sourceIds: [20, 21] as const },
  { term: 'Maturity', observable: '问卷可报告maximum maturity等条款方向；单笔最终合同期限需合同数据。', level: 'bank survey + contract records', state: 'survey-supported；合同值当前unknown', sourceIds: [20, 21] as const },
  { term: 'Collateral', observable: '问卷可报告抵押要求变化；抵押品身份、估值与haircut需合同／抵押登记。', level: 'bank survey + collateral records', state: 'survey-supported；资产级细节当前unknown', sourceIds: [20, 21] as const },
  { term: 'Covenant', observable: '问卷可以覆盖covenants等非价格条款；违约触发与豁免需合同事件数据。', level: 'bank survey + contract/event records', state: 'survey-supported；执行状态当前unknown', sourceIds: [20, 21] as const },
  { term: 'Currency', observable: '本课把币种作为必须保存的合同字段；两份问卷不共同证明逐笔币种选择。', level: 'contract / loan registry', state: '理想研究字段；当前unknown', sourceIds: [1, 3] as const },
  { term: 'Renewal / rollover', observable: '续作与新发放必须分开；一般问卷方向不能替代逐笔续作决定。', level: 'relationship + contract-event records', state: '概念候选；当前unknown', sourceIds: [15, 18] as const },
] as const;

const feedbackArrowMatrix = [
  { arrow: 'home／parent shock → group约束与内部配置', status: '历史样本支持单向通道', evidence: '危机期内部资本市场与母行冲击研究支持特定样本中的配置变化；不提供今天的实体额度。', sourceIds: [10, 11, 14] as const },
  { arrow: 'entity／route约束 → loan-offer vector', status: '部分支持', evidence: '贷款关系研究与官方问卷分别支持数量反应及若干条款；完整向量仍需逐项微观数据。', sourceIds: [15, 18, 20, 21] as const },
  { arrow: 'loan offer → borrower acceptance／substitution', status: '特定样本支持', evidence: '共同借款人与融资替代研究支持局部反应；不自动给出全部融资。', sourceIds: [12, 15, 18] as const },
  { arrow: 'total financing → activity／employment', status: '特定危机样本支持', evidence: '企业层研究支持其样本内信用暴露与真实结果；不可当作跨国固定系数。', sourceIds: [19] as const },
  { arrow: 'activity／collateral → default／provision／affiliate profit', status: 'conceptual / unobserved', evidence: '本课没有把同一借款人结果连接到违约、拨备和当地实体利润的共同数据包。', sourceIds: [12, 19] as const },
  { arrow: 'affiliate loss／capital → parent state → next allocation', status: 'conceptual / unobserved in this lesson', evidence: '历史内部配置研究提供相邻机制，但未与前一箭头在同一样本和时钟中闭合。', sourceIds: [10, 11] as const },
] as const;

const sectionIds = ['thesis', extras[0].id, ...globalBanksConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const referenceIds = new Set<number>(lesson406References.map(reference => reference.id));
const evidenceMapIds = new Set<number>(globalBanksEvidenceGroups.flatMap(group => group.sourceIds));
const renderedCitationIds = [
  ...globalBanksConcepts.flatMap(concept => concept.sourceIds),
  ...globalBanksLabs.flatMap(lab => lab.sourceIds),
  ...globalBanksChecks.flatMap(check => check.sourceIds),
  ...globalBanksResearchQuestions.flatMap(question => question.sourceIds),
  ...globalBanksEvidenceGroups.flatMap(group => group.sourceIds),
  1, 2, 3, 4, 6, 7, 8, 9, 10, 11, 12, 14, 15, 18, 19,
];
const routeConceptIds = globalBanksCoreRoute.flatMap(step => step.conceptIds);

export const lesson406IntegrityAudit = [
  {
    key: 'fifteen single-mechanism units retain causal chain counterexample evidence boundary and interfaces',
    passed: globalBanksConcepts.length === 15 && globalBanksConcepts.every(concept => concept.question.length >= 20 && concept.intuition.length >= 70 && concept.actors.length >= 60 && concept.constraints.length >= 60 && concept.behavior.length >= 60 && concept.transmission.length >= 60 && concept.feedback.length >= 60 && concept.counterexample.length >= 40 && concept.evidenceBoundary.length >= 35 && concept.sourceIds.length > 0),
  },
  {
    key: 'six independent labs attach once and preserve unique fixture identities',
    passed: Object.values(labAttachments).filter(Boolean).length === 6 && new Set(Object.values(labAttachments).filter(Boolean)).size === 6 && globalBanksLabs.length === 6 && new Set(globalBanksLabs.map(lab => lab.fixtureId)).size === 6,
  },
  {
    key: '95-minute route covers every concept exactly once and all visible IDs are unique',
    passed: globalBanksCoreRoute.length === 10 && globalBanksCoreRoute[0].time === '00–08分钟' && globalBanksCoreRoute[9].time === '90–95分钟' && routeConceptIds.length === 15 && new Set(routeConceptIds).size === 15 && globalBanksConcepts.every(concept => routeConceptIds.includes(concept.id as (typeof routeConceptIds)[number])) && new Set(sectionIds).size === sectionIds.length,
  },
  {
    key: 'twenty-one sources resolve every rendered citation and evidence map covers every source',
    passed: lesson406References.length === 21 && lesson406ReadingList.length === 10 && lesson406References.every((reference, index) => reference.id === index + 1 && reference.url.startsWith('https://') && reference.use.includes('支持') && (reference.use.includes('不') || reference.use.includes('不能'))) && renderedCitationIds.every(id => referenceIds.has(id)) && lesson406References.every(reference => evidenceMapIds.has(reference.id)),
  },
  {
    key: 'scope layers include twelve balanced aperiodic checks twenty questions twenty-eight passport fields research interfaces boundaries and invariants',
    passed: globalBanksChecks.length === 12
      && JSON.stringify(globalBanksAnswerOrderAudit.sequence) === JSON.stringify(globalBanksAnswerOrderAudit.expectedSequence)
      && globalBanksAnswerOrderAudit.exactlyBalanced
      && globalBanksAnswerOrderAudit.noExactPeriod234
      && globalBanksAnswerOrderAudit.noMonotoneFourCycle
      && globalBanksUnderstandingQuestions.length === 20 && globalBanksPassportRules.length === 28 && globalBanksEntryVocabulary.length >= 40 && globalBanksResearchQuestions.length === 10 && globalBanksInterfaces.length === 10 && globalBanksEvidenceBoundaries.length === 8 && globalBanksInvariants.length >= 50,
  },
  {
    key: 'canonical reviewed BODY binds exactly two approvals while author checks never impersonate either review or downstream delivery acceptance',
    passed: canonicalGlobalBanksFields.length === 17 && !canonicalGlobalBanksStateExample.evidenceState.authorFiniteAuditIsIndependentReview && canonicalGlobalBanksStateExample.evidenceState.independentReviews.length === 2 && canonicalGlobalBanksStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers && !canonicalGlobalBanksStateExample.evidenceState.sealedMetadataDeltaApprovedByTwoIndependentReviewers && !canonicalGlobalBanksStateExample.evidenceState.finalPdfAccepted && !canonicalGlobalBanksStateExample.evidenceState.observedDataImported && !canonicalGlobalBanksStateExample.evidenceState.pointInTimeCertified && !canonicalGlobalBanksStateExample.evidenceState.causalEffectIdentified && !canonicalGlobalBanksStateExample.evidenceState.productionEligibility,
  },
  {
    key: 'all author finite audits pass but remain distinct from frozen-body review and delivery acceptance',
    passed: [...globalBanksLabAudit, ...canonicalGlobalBanksAuthorAudit].every(item => item.passed) && !canonicalGlobalBanksStateExample.evidenceState.authorFiniteAuditIsIndependentReview,
  },
] as const;

if (!lesson406IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.06 lesson gate failed: ${lesson406IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson406Content() {
  const evidence = canonicalGlobalBanksStateExample.evidenceState;
  return <>
    <noscript><style>{'.lesson-page[data-lesson-id="4.06"] .global-banks-interactive-only{display:none!important}'}</style></noscript>
    <p className="global-banks-nojs-fallback">无脚本静态通道：六个C各自保留固定输入、结果、手算、STOP（有类型的拒绝计算，不等于经济零）边界、反例和来源；十二道机制／口径检查（M/K）先显示完整题册，答案位于后续默认关闭的答案册。作者结构检查不等于独立内容审批，当前审稿、浏览器、纸本与PDF状态以页面审稿记录和最终交付收据为准。</p>

    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">ONE CENTRAL MECHANISM · SHOCK → ENTITY GATES → CREDIT ROUTES → SUBSTITUTION → FEEDBACK</p>
      <h2>全球银行传导不是“母行受冲击，所以全世界少贷款”，而是一串可能被阻断、迁移、缓冲或反转的条件边。</h2>
      <p><b>先把最容易混淆的对象拆开：</b>银行国籍回答谁最终控制集团；booking office residence回答头寸记在哪个居民办事处；即时借款人居住地回答合同债务人在哪。跨境由后两者是否位于不同经济体决定，外币由合同币种决定，外国银行由母行国籍决定。三个标签可能同时出现，却绝不是同义词。</p>
      <p><b>再把统计与机制分开：</b>LBS和CBS是观察同一系统的两台相机。在本课的标准基准里，跨境LBS以所在地、未合并方式保留与非居民related offices的集团内头寸；reporting-area银行集团的CBS按母行国籍合并全球业务并抵销合并边界内往来。居民office间国内头寸不在该跨境LBS聚合，standalone／unconsolidated CBS例外也必须回到reporting-population元数据。两套数字不同不表示谁错，更不能相加成“更完整总量”。定义告诉我们看见什么；实体、合同和识别设计才可能说明为什么变化。</p>
      <p>{globalBanksThesis.statement}</p>
      <p><b>待检验的反馈候选：</b>{globalBanksThesis.causalChain}。这是一张需要逐箭头验证的研究地图，不是已经由同一样本闭合的经验事实。前半段可以在日内或日频改变资金和限额，中段常在月度或季度进入贷款，企业活动、违约和资本回写可能跨越多个季度；把这些时钟压成一条同期相关线，会同时丢掉方向与反例。</p>
      <div className="impact-facts" role="group" aria-label="4.06六条核心边界">{globalBanksThesis.boundaries.map((boundary, index) => <article key={boundary}><span>BOUNDARY {String(index + 1).padStart(2, '0')}</span><b>{boundary}</b><p>{index < 2 ? '先确认主体与地址，再读取数字。' : index < 4 ? '先锁统计口径，再解释行为。' : '先追踪路线与替代，再决定结论层级。'}</p></article>)}</div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 4, 6, 7, 8, 10, 11, 12]} /></p>
    </section>

    <section className="lesson-section" id="global-banks-route">
      <p className="section-kicker">ENTITY / THREE GEOGRAPHIES / LENS / ROUTE / INSTRUMENT / CLOCK / EVIDENCE</p>
      <h2>第一遍用95分钟走完整条链：每遇到一个总量，都先问“谁的、记在哪里、对谁、按哪台相机”。</h2>
      <p>硬先修只有2.06的银行资产负债表和4.01的residence与国际头寸语言。3.13、4.03与4.04只提供相邻语义接口；4.05在代码中实际只提供五值status enum与可核验时钟约束。本课不读取任何上游SYN数值，也不把4.06本地声明的provider／receiver／office／IDs、金额、zero/null和容量映射伪称为4.05字段级schema，更不会重新判定4.05的资金路线。这样可以防止“上游存在一种资源”被悄悄改写成“当地实体已经得到现金并能放贷”。</p>
      <h3>二十个首次术语与证据控件先解码</h3>
      <div className="term-grid entry-vocabulary" role="group" aria-label="4.06二十个首次术语解码">{firstUseDecoder.map(([term, definition]) => <article className="term-card" key={term}><span>FIRST-USE DECODER</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <nav className="international-monetary-core-route" aria-label="4.06 95分钟核心学习路径"><div><span>CORE ROUTE · 95 MINUTES</span><h3>每段只多加一层：实体 → 镜头 → 路线 → 约束 → 要约 → 替代 → 反馈。</h3><p>第一遍最后五分钟只做三道退出检查。完整十二道M/K、二十道理解题、证据地图和研究设计放到第二遍，避免把95分钟变成机械通读。</p></div><ol>{globalBanksCoreRoute.map(step => <li key={step.time}><span>{step.time}</span><h4>{step.title}</h4><p>{step.task}</p><p><b>退出检查：</b>{step.exit}</p>{step.conceptIds.length ? <p>{step.conceptIds.map((id, index) => <span key={id}>{index ? ' → ' : ''}<a href={`#${id}`}>{globalBanksConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p> : <p><a href="#global-banks-evidence-research">查看下游接口的类型与禁止越界项</a></p>}</li>)}</ol></nav>
      <h3>三条地理轴必须分别保存</h3>
      <div className={styles.tableWrap} role="region" aria-label="全球银行三条地理轴" tabIndex={0}><table className={styles.dataTable}><thead><tr><th>字段</th><th>回答什么</th><th>主要用途</th><th>不能回答什么</th></tr></thead><tbody>{threeAxes.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
      <h3>三台统计相机不是三条现金路线</h3>
      <div className={styles.tableWrap} role="region" aria-label="LBS与CBS统计镜头比较" tabIndex={0}><table className={styles.dataTable}><thead><tr><th>镜头</th><th>组织原则</th><th>合并／集团内处理</th><th>适合观察</th><th>不能自动推断</th></tr></thead><tbody>{cameraComparison.map(row => <tr key={row[0]}>{row.map(cell => <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
      <GlobalBanksDiagram />
      <div className="precision-note"><span>当前证据身份 · {evidence.eligibility}</span><p>canonical状态为<code>{canonicalGlobalBanksStateExample.stateId}</code>。accuracy与pedagogy两席已经分别批准同一不可变<code>BODY-r3</code>；本次页面仅登记三文件元数据提升，尚未获得两席对sealed delta的复核，也尚未完成提升后的browser、无JavaScript、390px、print与最终PDF验收。作者有限检查不占任何审稿席。无论课程审批进展如何，<code>inputLineage=[]</code>，本课仍没有observed、PIT、历史回放、OOS、因果、预测、收益、交易或production资格。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[1, 2, 3, 6, 7, 8]} /></p>
    </section>

    {globalBanksConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section className="lesson-section" id={concept.id} key={concept.id}>
        <p className="section-kicker">MECHANISM {String(index + 1).padStart(2, '0')} · {concept.label}</p>
        <h2>{concept.title}</h2>
        <p className="lead-question"><b>本节只解决一个问题：</b>{concept.question}</p>
        <h3>先建立直觉</h3><p>{concept.intuition}</p>
        <h3>谁参与，谁承担合同与约束</h3><p>{concept.actors}</p>
        <h3>约束先于行为</h3><p>{concept.constraints}</p>
        <h3>主体会怎样反应</h3><p>{concept.behavior}</p>
        <h3>怎样传到贷款与目的地</h3><p>{concept.transmission}</p>
        <h3>新状态怎样反馈回来</h3><p>{concept.feedback}</p>
        {concept.formula ? <div><p className={styles.formula}>{concept.formula.expression}</p><dl className={styles.formulaGrid}>{concept.formula.variables.map(variable => <div key={variable.symbol}><dt>{variable.symbol}</dt><dd>{variable.meaning}</dd></div>)}</dl><p><b>直白解释：</b>{concept.formula.explanation}</p><p className={styles.boundary}><b>STOP：</b>{concept.formula.stopRule}</p></div> : null}
        <h3>用反例修正过度直觉</h3><p>{concept.counterexample}</p>
        <h3>证据能支持到哪里</h3><p>{concept.evidenceBoundary}</p>
        {index === 10 ? <><h3>贷款要约逐项证据矩阵</h3><div className={styles.tableWrap} role="region" aria-label="4.06贷款要约逐项证据矩阵" tabIndex={0}><table className={styles.dataTable}><thead><tr><th>要约维度</th><th>当前来源直接看见什么</th><th>所需数据层</th><th>本课证据状态</th><th>来源</th></tr></thead><tbody>{loanOfferEvidenceMatrix.map(row => <tr key={row.term}><td>{row.term}</td><td>{row.observable}</td><td>{row.level}</td><td>{row.state}</td><td><Cites ids={row.sourceIds} /></td></tr>)}</tbody></table></div></> : null}
        {index === 14 ? <><h3>反馈候选逐箭头证据矩阵</h3><div className={styles.tableWrap} role="region" aria-label="4.06反馈候选逐箭头证据矩阵" tabIndex={0}><table className={styles.dataTable}><thead><tr><th>候选箭头</th><th>证据状态</th><th>当前证据能支持到哪里</th><th>来源</th></tr></thead><tbody>{feedbackArrowMatrix.map(row => <tr key={row.arrow}><td>{row.arrow}</td><td>{row.status}</td><td>{row.evidence}</td><td><Cites ids={row.sourceIds} /></td></tr>)}</tbody></table></div></> : null}
        <div className="interface-grid" role="group" aria-label={`${concept.title}接口`}><article><span>FROM</span><p>{concept.interfaces.from}</p></article><article><span>TO</span><p>{concept.interfaces.to}</p></article></div>
        <p className="section-sources"><b>本单元来源：</b><Cites ids={concept.sourceIds} /> {concept.sourceNote}</p>
        {labId ? <GlobalBanksLab labId={labId} /> : null}
      </section>;
    })}

    <section className="lesson-section" id="global-banks-system-chain">
      <p className="section-kicker">SYSTEM ASSEMBLY · TRANSMIT / BUFFER / MIGRATE / REVERSE</p>
      <h2>把十五个机制重新合成动态系统：同一母行冲击可以在不同目的地留下相反结果。</h2>
      <p>正常时期，母行通过分行、子公司和区域中心分配资本、流动性与风险预算。冲击发生后，第一反应可能是内部调拨、缩短期限、提高贷款价格、降低审批或保护核心客户。若某地附属机构拥有稳定当地存款和充足资本，它可能隔断母行融资冲击；若home或host规则限制转移，压力也可能迁移到集团另一个实体。集团总贷款不变时，一个国家仍可少20、另一个多20。</p>
      <p>借款人替代决定银行路线变化能否进入真实活动。受冲击路线减少20、本地银行增加12、债券增加5时，bilateral route为−20、当前已覆盖银行渠道为−8、已观察all-financing为−3。只有same-bank-other-route、其他外国银行和本地银行等银行渠道清单被证明完整时，−8才可以升级为all-bank；只要贸易信用、内部现金或需求状态未观察，结论仍只能停在会计桥，不能写成已识别供给或投资效应。</p>
      <p>历史研究给出可用的机制样本，而不是固定剧本：日本母行资本受损与美国分支贷款提供母国冲击案例；全球金融危机期间的内部资本市场显示集团可以传递也可以重新配置；秘鲁的共同借款人设计说明如何分离相对供给；危机后欧洲和全球银行本地化展示路线结构会长期改变。样本、时期、处理与对照都必须随结论一起保留。</p>
      <div className={styles.tableWrap} role="region" aria-label="四组历史证据的能力与边界" tabIndex={0}><table className={styles.dataTable}><thead><tr><th>证据窗口</th><th>机制用途</th><th>能支持</th><th>不能外推</th></tr></thead><tbody><tr><td>日本母行→美国分支</td><td>母行资本冲击</td><td>特定历史样本的跨境贷款传导</td><td>所有母国、时期与法人形态的固定弹性</td></tr><tr><td>2007–09内部资本市场</td><td>集团流动性重新配置</td><td>传递、缓冲与迁移可以并存</td><td>今天任一实体的可执行额度</td></tr><tr><td>秘鲁共同借款人</td><td>供给与需求识别</td><td>样本内相对贷款供给</td><td>全体企业总融资与一般均衡</td></tr><tr><td>危机后EU／全球银行</td><td>跨境回撤与本地化</td><td>路线和资金结构发生历史变化</td><td>未来必然继续本地化或当地路线永远更安全</td></tr></tbody></table></div>
      <div className="precision-note"><span>最低可证伪证据包</span><p>至少需要：parent、legal entity、office与borrower身份；nationality、booking和borrower三轴；明确LBS/CBSI/CBSG镜头；instrument、currency、maturity、as-of与vintage；带时钟的冲击；贷款要约或行为反应；替代融资覆盖；一项竞争解释与一项能使主叙事失败的反证。仅有一条聚合claims曲线，不足以证明银行供给冲击。</p></div>
      <p className="section-sources"><b>案例依据：</b><Cites ids={[9, 10, 11, 12, 13, 14, 15, 17, 18, 19]} /></p>
    </section>

    <section className="lesson-section" id="global-banks-checks">
      <p className="section-kicker">EXIT CHECKS · DEFINE, ACCOUNT, IDENTIFY, THEN FALSIFY</p>
      <h2>十二道M/K检查与二十道理解题：正确答案必须同时守住对象、口径、时间和证据等级。</h2>
      <GlobalBanksQuiz />
      <h3>二十道第二遍作业</h3>
      <ol className="understanding-list">{globalBanksUnderstandingQuestions.map((question, index) => <li key={question}><b>{String(index + 1).padStart(2, '0')}</b> · {question}</li>)}</ol>
      <p className={styles.boundary}><b>统一评分：</b>如果答案没有区分parent／entity／office／borrower、nationality／booking／counterparty、LBS／CBSI／CBSG、stock／flow与descriptive／accounting／identified结论，只写“母行收紧、资本外逃、全球风险厌恶”不计为机制答案。</p>
    </section>

    <section className="lesson-section" id="global-banks-evidence-research">
      <p className="section-kicker">MEASUREMENT / RESEARCH / INTERFACES / PROVENANCE</p>
      <h2>从会解释机制走向可验证研究：先保存身份、口径、时钟与null，再讨论系数。</h2>
      <h3>二十八字段头寸与证据护照</h3>
      <div className="term-grid" role="group" aria-label="4.06二十八字段护照">{globalBanksPassportRules.map(([field, rule]) => <article className="term-card" key={field}><span>ENTITY / POSITION / SHOCK / EVIDENCE PASSPORT</span><h3>{field}</h3><p>{rule}</p></article>)}</div>
      <h3>完整入口术语词典</h3>
      <div className="term-grid entry-vocabulary" role="group" aria-label="4.06入口术语">{globalBanksEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入现实数据</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <h3>十个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.06可证伪研究问题">{globalBanksResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>需要：</b>{question.evidenceNeeded}</p><p><b>削弱证据：</b>{question.whatWouldWeakenIt}</p><p><b>拒绝：</b>{question.reject}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}</div>
      <h3>六组命题—证据地图</h3>
      <div className="evidence-map" role="group" aria-label="4.06二十一项来源证据地图">{globalBanksEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>失败与版本受限来源也要保留</h3>
      <div className="term-grid" role="group" aria-label="4.06失败与受限来源台账">{globalBanksFailedSourceLedger.map(record => <article className="term-card" key={record.title}><span>FAILED / VERSION-LIMITED · PRESERVED</span><h3>{record.title}</h3><p><b>请求：</b><code>{record.request}</code></p><p><b>状态：</b>{record.status}</p><p><b>处置：</b>{record.resolution}</p><p className="section-sources">对应来源：<Cites ids={record.sourceIds} /></p></article>)}</div>
      <h3>八条证据边界</h3>
      <ol className="understanding-list">{globalBanksEvidenceBoundaries.map((boundary, index) => <li key={boundary}><b>{String(index + 1).padStart(2, '0')}</b> · {boundary}</li>)}</ol>
      <h3>跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.06跨章接口">{globalBanksInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <h3>不可破坏的不变量</h3>
      <div className="check-grid" role="group" aria-label="4.06不变量"><div><ul>{globalBanksInvariants.slice(0, Math.ceil(globalBanksInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div><div><ul>{globalBanksInvariants.slice(Math.ceil(globalBanksInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div></div>
      <div className="yield-fixture-audit" role="group" aria-label="4.06作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...globalBanksLabAudit, ...canonicalGlobalBanksAuthorAudit, ...lesson406IntegrityAudit].map(item => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="precision-note"><span>审批与交付边界</span><p>事实、术语、公式与引用席，以及教学结构、反例与可理解性席，已经分别批准同一不可变BODY-r3；两份批准只绑定冻结对象的精确BODY、snapshot与PDF哈希。当前仅允许catalog、lesson metadata与canonical state三文件从草稿提升，其余十五个BODY文件必须保持字节不变；这组三文件差异仍须由同两席做sealed-delta核对。浏览器、390px、键盘、无JavaScript、print与最终PDF仍是独立交付门。无论这些门是否通过，都不会把本课升级为现实数据、PIT、历史回放、OOS、因果、预测、交易或production系统。</p></div>
    </section>
  </>;
}

const lesson406Reviews: LessonRecord['reviews'] = [
  {
    kind: 'accuracy',
    completedAt: '2026-09-17T11:43:49Z',
    decision: 'approved',
    revision: '4.06-r1',
    summary: '独立复核同一只读BODY-r3的18个正文依赖、15项机制、6个实验、12道M/K、20道理解题、21项来源与119页A4纸本；P1/P2/P3均为0。旧contract、4.05窄接口、C1 comparable-core、C4互斥身份与LBS/CBS benchmark例外五类问题均已闭合。',
  },
  {
    kind: 'pedagogy',
    completedAt: '2026-09-17T11:47:33Z',
    decision: 'approved',
    revision: '4.06-r1',
    summary: '独立复核同一只读BODY-r3的95分钟路径、机制链、反例、六个实验、互动/无脚本/纸本三胞胎、390px、键盘可访问性与119页A4纸本；P1/P2/P3均为0。固定序列ADCDBCBDABAC平衡且无简单双/三/四周期泄漏。',
  },
];

export const lesson406: LessonRecord = {
  slug: '4-06',
  id: '4.06',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Global Banks 与 Cross-border Credit：实体、统计镜头与跨境信贷传导',
  subtitle: '母行冲击如何穿过全球银行集团、法律实体、home–host约束和两条放贷路线，进入多维贷款要约、跨目的地重配、借款人替代与母行反馈；同时严格区分LBS、CBSI、CBSG、claims、credit、stock、flow与因果识别',
  readingTime: '页面内置95分钟核心路径：15个单一机制、六个作者构造且非现实观测的合成教学实验（author-SYN），末段只做三道机制／口径检查（M/K）；完整十二道M/K、二十题、证据地图、研究设计、词典与原典路线另作第二遍。估时来自学习任务，不以重复文字凑时长',
  prerequisite: 'Master prerequisites：2.06 Bank Intermediary与4.01 Balance of Payments；3.13 Financial Conditions、4.03 Reserve/Safe Asset与4.04 Treasury Curve仅作相邻语义接口；4.05 Global Dollar Funding只提供现有五值status enum与可核验时钟约束，4.06本地另行声明C4身份和容量合同且不读取任何上游SYN数值。后续接口为4.07–4.09及7.10–7.16',
  updatedAt: '2026-09-17',
  revision: '4.06-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson406Reviews,
  previous: { slug: '4-05', label: '4.05 Global Dollar Funding' },
  next: { label: '4.07 Global Financial Cycle' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...globalBanksConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson406Content,
  references: lesson406References,
  readingList: lesson406ReadingList,
  readingListOrder: 'source',
};
