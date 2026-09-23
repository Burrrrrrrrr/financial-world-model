import EmCapitalFlowDiagram from '../components/EmCapitalFlowDiagram';
import EmCapitalFlowLab from '../components/EmCapitalFlowLab';
import EmCapitalFlowQuiz from '../components/EmCapitalFlowQuiz';
import styles from '../components/globalCycle.module.css';
import { emCapitalFlowLabAudit, emCapitalFlowLabs, type EmCapitalFlowLabId } from '../components/emCapitalFlowLabs';
import { emCapitalFlowConcepts } from './emCapitalFlowConcepts';
import { emCapitalFlowEvidenceGroups, lesson408ReadingList, lesson408References } from './emCapitalFlowReferences';
import {
  emCapitalFlowChecks,
  emCapitalFlowCoreRoute,
  emCapitalFlowEntryVocabulary,
  emCapitalFlowEvidenceBoundaries,
  emCapitalFlowInterfaces,
  emCapitalFlowInvariants,
  emCapitalFlowPassportRules,
  emCapitalFlowResearchQuestions,
  emCapitalFlowThesis,
  emCapitalFlowUnderstandingGuides,
  emCapitalFlowUnderstandingQuestions,
} from './emCapitalFlowStudy';
import {
  canonicalEmCapitalFlowAuthorAudit,
  canonicalEmCapitalFlowFields,
  canonicalEmCapitalFlowStateExample,
  emCapitalFlowReviewedBodySha256,
} from './emCapitalFlowState';
import type { LessonRecord } from './types';

export { canonicalEmCapitalFlowStateExample } from './emCapitalFlowState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'em-flow-route', label: '98分钟主路径／第二遍附录' },
  { id: 'em-flow-debate-map', label: '口径、数据与争论地图' },
  { id: 'em-flow-checks', label: '十二M/K与二十题' },
  { id: 'em-flow-evidence-research', label: '证据、研究与跨章接口' },
] as const;

const labAttachments: Readonly<Record<string, EmCapitalFlowLabId | undefined>> = {
  'em-flow-mechanism-02': 'C1',
  'em-flow-mechanism-09': 'C2',
};

const entryGateTerms = [
  ['Resident / nonresident', '按经济领土与主要经济利益中心区分，不等于国籍、上市地或集团母公司。'],
  ['Asset / liability leg', '居民对外债权与非居民对本国债权两条腿；必须保留原始符号。'],
  ['Transaction / position', '期间交易和时点存量不同；存量还受价格、汇率与其他数量变化影响。'],
  ['Gross / net', 'gross在此指资产腿与负债腿分开，不是全部逐笔成交；net会把两腿相抵。'],
  ['Classification × instrument', '先用互斥功能分类单元求和，再把股权、债券、贷款、存款等工具属性另列；直接投资股权／关联债不能重复进入泛股权／债务桶。'],
  ['Push / pull / pipes', '全球条件、本地吸引与投资者／市场管道共同决定流量，均不是天然外生shock。'],
  ['Price / quantity / access', '融资价格、实际数量与能否成交／续作是三种结果，不能互作代理。'],
  ['Event / crisis', 'surge、stop、flight、retrenchment是规则化事件标签，不等于危机、原因或福利。'],
] as const;

const objectComparison = [
  ['BOP金融账户交易', '居民—非居民、资产／负债、功能类别的期间交易', '谁在何方向改变跨境债权', '逐笔turnover、单体现金、因果来源'],
  ['IIP／外债头寸', '期末资产负债存量，含交易、估值与其他变化', '币种、期限、部门和存量暴露', '仅靠端点恢复期间交易或到期现金'],
  ['基金申赎／持仓', '特定基金最终投资者现金与经理持仓', '资产管理管道和共同销售候选', '完整BOP portfolio flow或全部外国投资者'],
  ['银行跨境统计', 'residence LBS或consolidated nationality CBS', '银行路线、币种和集团暴露', '两套口径直接相加或自动识别贷款供给'],
  ['证券成交／价格', '交易所或场外成交、报价、收益率与汇率', '边际吸收、市场深度和价格冲击', '居民方向、BOP分类或最终资金用途'],
] as const;

const dataSystemMatrix = [
  ['IMF BOP / IIP（BPM7框架）', '交易与头寸按居民、资产／负债、功能类别拆分；交易—重估桥', '实施版本、修订、覆盖；不提供单家机构现金或逐笔成交', [1] as const],
  ['World Bank / IMF QEDS', '外债按部门、工具、原始期限、币种与未来偿债表', '多为聚合头寸；当前历史数据不可一概称BPM7-native', [2] as const],
  ['BIS LBS', '银行所在地／residence、unconsolidated、含跨境集团内头寸、币种与FX/break-adjusted change', '国家聚合而非单家银行；不是集团最终风险；adjusted change仍不是逐笔交易或新增贷款', [26] as const],
  ['BIS CBS / GLI', 'CBS按母行国籍全球合并；GLI按借款人居住地追踪对非银行部门的外币银行贷款与国际债券信用', '两套镜头及BOP不可机械相加；GLI不覆盖全部资本流或未对冲敞口；保存方法vintage', [26, 27] as const],
  ['IMF PIP / DIP', 'CPIS按发行人居住地记录跨境证券资产头寸；CDIS按直接投资关系与即时对手经济体记录年末头寸', '头寸不等于交易；issuer residence／immediate counterpart不等于国籍／最终控制方；需处理覆盖、SPE与pass-through', [28, 29] as const],
  ['基金与基准数据库', '申赎、经理交易、持仓与指数权重', '样本覆盖有限，不等于BOP portfolio flow', [8, 18, 19] as const],
  ['信贷登记／企业财务', '银行—借款人贷款价格数量与企业币种、现金和投资', '国家和公司选择、需求供给、法律实体匹配仍需设计', [12, 13, 15] as const],
] as const;

const mechanismClaims = [
  ['会计身份', '资产／负债腿、交易—估值—头寸桥、清算表', '约束数值与对象，不给原因'],
  ['描述性相关', 'push/pull回归、基金流与市场价格共动', '给条件关系，不给外生shock'],
  ['事件比较', 'surge/stop/flight/retrenchment与危机样本', '结果依阈值、趋势、频率和vintage'],
  ['理论／校准机制', 'sudden stop、抵押与资产负债表放大', '说明可能链条，不给普适参数'],
  ['局部识别', '共同借款人、资格边界、外生母行或基准事件', '只在具体设计假设和样本内'],
  ['政策框架', '储备、FXI、CFM/MPM条件与权衡', '不是随机实验或统一福利处方'],
] as const;

const referenceIds = new Set<number>(lesson408References.map(reference => reference.id));
const evidenceMapIds = new Set<number>(emCapitalFlowEvidenceGroups.flatMap(group => group.sourceIds));
const routeConceptIds = emCapitalFlowCoreRoute.flatMap(step => step.conceptIds);
const sectionIds = ['thesis', extras[0].id, ...emCapitalFlowConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const renderedCitationIds = [
  ...emCapitalFlowConcepts.flatMap(concept => concept.sourceIds),
  ...emCapitalFlowChecks.flatMap(check => check.sourceIds),
  ...emCapitalFlowResearchQuestions.flatMap(question => question.sourceIds),
  ...emCapitalFlowEvidenceGroups.flatMap(group => group.sourceIds),
  ...emCapitalFlowLabs.flatMap(lab => lab.sourceIds),
  ...lesson408References.map(reference => reference.id),
];
const checkCorrectIndices = emCapitalFlowChecks.map(check => check.correct);
const checkAnswerCounts = [0, 1, 2].map(index => checkCorrectIndices.filter(correct => correct === index).length);
const maxCheckAnswerRun = checkCorrectIndices.reduce(
  (state, current, index) => ({
    max: Math.max(state.max, current === checkCorrectIndices[index - 1] ? state.run + 1 : 1),
    run: current === checkCorrectIndices[index - 1] ? state.run + 1 : 1,
  }),
  { max: 0, run: 0 },
).max;

export const lesson408IntegrityAudit = [
  {
    key: 'thirteen single-mechanism units retain actors constraints transmission feedback example counterexample evidence and interfaces',
    passed: emCapitalFlowConcepts.length === 13 && emCapitalFlowConcepts.every(concept => concept.question.length >= 20 && concept.intuition.length >= 90 && concept.actors.length >= 55 && concept.constraints.length >= 65 && concept.behavior.length >= 55 && concept.transmission.length >= 55 && concept.feedback.length >= 45 && concept.example.length >= 35 && concept.counterexample.length >= 35 && concept.evidenceBoundary.length >= 40 && concept.sourceIds.length > 0),
  },
  { key: '98-minute route covers every concept exactly once and section IDs are unique', passed: emCapitalFlowCoreRoute.length === 13 && emCapitalFlowCoreRoute[0].time === '00–07分钟' && emCapitalFlowCoreRoute[12].time === '91–98分钟' && routeConceptIds.length === 13 && new Set(routeConceptIds).size === 13 && emCapitalFlowConcepts.every(concept => routeConceptIds.includes(concept.id as (typeof routeConceptIds)[number])) && new Set(sectionIds).size === sectionIds.length },
  { key: 'two independent AUTHOR-SYN labs attach exactly once and all arithmetic gates pass', passed: Object.values(labAttachments).filter(Boolean).length === 2 && new Set(Object.values(labAttachments).filter(Boolean)).size === 2 && emCapitalFlowLabs.length === 2 && emCapitalFlowLabAudit.every(item => item.passed) },
  { key: 'twenty-nine sources and twelve readings are continuous traceable and fully evidence-mapped', passed: lesson408References.length === 29 && lesson408ReadingList.length === 12 && lesson408References.every((reference, index) => reference.id === index + 1 && reference.url.startsWith('https://') && reference.use.includes('支持') && reference.use.includes('不')) && renderedCitationIds.every(id => referenceIds.has(id)) && lesson408References.every(reference => evidenceMapIds.has(reference.id)) },
  { key: 'checks answer balance questions rubrics passport vocabulary research interfaces boundaries and invariants meet contract', passed: emCapitalFlowChecks.length === 12 && emCapitalFlowChecks.filter(check => check.kind === 'M').length === 6 && emCapitalFlowChecks.filter(check => check.kind === 'K').length === 6 && checkAnswerCounts.every(count => count === 4) && maxCheckAnswerRun <= 2 && emCapitalFlowUnderstandingQuestions.length === 20 && emCapitalFlowUnderstandingGuides.length === 20 && emCapitalFlowUnderstandingGuides.every(guide => guide.mustInclude.length >= 2 && guide.mustInclude.length <= 4 && guide.commonError.length > 8) && emCapitalFlowPassportRules.length === 30 && emCapitalFlowEntryVocabulary.length === 30 && emCapitalFlowResearchQuestions.length === 10 && emCapitalFlowInterfaces.length === 11 && emCapitalFlowEvidenceBoundaries.length === 8 && emCapitalFlowInvariants.length >= 45 },
  { key: 'canonical state binds two independent approvals to the reviewed body while empirical and policy claims remain absent', passed: canonicalEmCapitalFlowFields.length === 19 && canonicalEmCapitalFlowAuthorAudit.every(item => item.passed) && canonicalEmCapitalFlowStateExample.evidenceState.independentReviews.length === 2 && canonicalEmCapitalFlowStateExample.evidenceState.independentReviews.every(review => review.approvedBodySha256 === emCapitalFlowReviewedBodySha256) && canonicalEmCapitalFlowStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers && !canonicalEmCapitalFlowStateExample.evidenceState.observedDataImported && !canonicalEmCapitalFlowStateExample.evidenceState.pointInTimeCertified && !canonicalEmCapitalFlowStateExample.evidenceState.causalEffectIdentified && !canonicalEmCapitalFlowStateExample.evidenceState.outOfSampleValidated && !canonicalEmCapitalFlowStateExample.evidenceState.productionEligibility },
] as const;

if (!lesson408IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.08 lesson gate failed: ${lesson408IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson408Content() {
  return <>
    <noscript><style>{'.lesson-page[data-lesson-id="4.08"] .em-flow-interactive-only{display:none!important}.lesson-page[data-lesson-id="4.08"] .em-flow-nojs-fallback{display:block!important}'}</style></noscript>
    <p className="em-flow-nojs-fallback"><b>无脚本静态通道：</b>两个AUTHOR-SYN实验保留冻结输入、同源calculator结果、完整手算、反例、STOP/null和来源；十二道M/K先显示完整题册，答案在默认关闭的答案册中。作者结构与算术检查不是独立内容审批。</p>

    <aside className={styles.entryGate} aria-labelledby="em-flow-entry-gate-title">
      <p className="section-kicker">TWO-MINUTE ENTRY GATE · 先固定八个对象</p>
      <h2 id="em-flow-entry-gate-title">在说“外资流入／流出”以前，先回答：谁、哪条腿、什么合约、哪个时钟？</h2>
      <div className={styles.entryGateGrid}>{entryGateTerms.map(([term, definition]) => <article key={term}><h3>{term}</h3><p>{definition}</p></article>)}</div>
    </aside>

    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">ONE CENTRAL MECHANISM · TYPED CROSS-BORDER CLAIMS × LOCAL ABSORPTION → HETEROGENEOUS OUTCOMES</p>
      <h2>{emCapitalFlowThesis.title}</h2>
      <p><b>先锁定本课唯一中心机制：</b>{emCapitalFlowThesis.statement}如果只记住一句话，请记住：<b>资本流是债权对象和主体行为的记录，不是“市场情绪”或“钱”的别名。</b></p>
      <p><b>本课的最小闭环：</b>{emCapitalFlowThesis.chain}。这条链既保留gross-flow文献关于居民与非居民分侧行动的发现，也保留push/pull权重随工具和时期变化、基金与基准形成共同管道、本币债可能迁移而非消除风险、价格与数量共同成分可能由不同shock主导等反证；任何一项都不能被改写为所有EM统一反应。<Cites ids={[1, 3, 4, 5, 8, 9, 16, 17, 18, 19, 25]} /></p>
      <div className={styles.boundaryGrid} role="group" aria-label="4.08七条不可混同关系">{emCapitalFlowThesis.inequalities.map((inequality, index) => <article key={inequality}><span>BOUNDARY {String(index + 1).padStart(2, '0')}</span><b>{inequality}</b><p>{index < 2 ? '先固定会计对象。' : index < 5 ? '再追踪合约与现金时钟。' : '最后才谈事件、因果或政策。'}</p></article>)}</div>
      <EmCapitalFlowDiagram />
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 4, 6, 8, 9, 10, 15, 16, 17, 21, 22, 25]} /></p>
    </section>

    <section className="lesson-section" id="em-flow-route">
      <p className="section-kicker">OBJECT / TWO LEGS / CONTRACT / DRIVER / ABSORBER / BALANCE SHEET / EVENT / POLICY</p>
      <h2>第一遍用98分钟走完整条链：每遇到“资金流出”，先问它是交易、头寸、估值、哪一侧gross leg，还是某类基金样本。</h2>
      <p>硬先修是4.01与4.07；3.21、4.05、4.06按需回看。4.01只交付居民、方向和交易—估值桥；3.21交付具体国内入口但不在本课重复其银行记账与基金现金菜单；4.05交付币种、期限和现金时钟；4.06交付银行typed edge；4.07交付global state与candidate driver。所有上游仅传类型、语义和证据上限，不传AUTHOR-SYN数值、审稿身份或因果资格。</p>
      <nav className="international-monetary-core-route" aria-label="4.08 98分钟核心学习路径"><div><span>CORE ROUTE · 98 MINUTES</span><h3>对象 → 两条gross leg → 合约组成 → push/pull/pipes → 异质暴露 → 边际吸收 → 币种期限 → 国内路线 → 基准赎回 → 事件 → 反馈 → 缓冲与识别。</h3><p>C1在第2段完成代数，事件实时钟在第11段重新审计；C2在第9段完成。完整数据表、十二题、二十道作业、研究问题、术语与原典路线属于第二遍，不计入98分钟。</p></div><ol>{emCapitalFlowCoreRoute.map(step => <li key={step.time}><span>{step.time}</span><h4>{step.conceptIds.map(id => emCapitalFlowConcepts.find(concept => concept.id === id)?.index).join(' / ')}</h4><p>{step.goal}</p><p>{step.conceptIds.map((id, index) => <span key={id}>{index ? ' → ' : ''}<a href={`#${id}`}>{emCapitalFlowConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p></li>)}</ol></nav>
      <details className={styles.secondPass}>
        <summary>第二遍附录 · 五类常被混写的观测对象与三十字段护照</summary>
        <h3>五类对象各自能看见什么</h3>
        <div className={styles.tableWrap} role="region" aria-label="资本流五类观测对象比较" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">对象</th><th scope="col">正式观测</th><th scope="col">能回答</th><th scope="col">不能自动回答</th></tr></thead><tbody>{objectComparison.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
        <h3>三十字段资本流—合约—证据护照</h3>
        <div className="term-grid" role="group" aria-label="4.08三十字段护照">{emCapitalFlowPassportRules.map((rule, index) => <article className="term-card" key={rule}><span>PASSPORT {String(index + 1).padStart(2, '0')}</span><h4>{rule.split('：')[0]}</h4><p>{rule}</p></article>)}</div>
        <div className="precision-note"><span>证据轴互不代替</span><p><b>Measurement：</b>AUTHOR-SYN → observed transaction/position → versioned history → strict PIT；<b>Causal：</b>not claimed → candidate push/pull/pipe → locally identified shock → verified feedback；<b>Prediction：</b>not estimated → in-sample → OOS candidate → OOS validated。双审、构建与发布只证明内容和交付门，不提升经验轴。</p></div>
      </details>
    </section>

    {emCapitalFlowConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section className="lesson-section" id={concept.id} key={concept.id}>
        <p className="section-kicker">MECHANISM {String(index + 1).padStart(2, '0')} · {concept.index}</p>
        <h2>{concept.title}</h2>
        <p><b>本节问题：</b>{concept.question}</p>
        <p className={styles.passport}><b>前置：</b>{concept.prerequisite}</p>
        <div className="precision-note"><span>先用直觉抓住单一机制</span><p>{concept.intuition}</p></div>
        <h3>谁参与，哪些约束使同一总量产生不同结果？</h3>
        <p><b>参与者：</b>{concept.actors}</p>
        <p><b>约束与口径：</b>{concept.constraints}</p>
        <h3>行为如何进入价格、现金和下一轮流量？</h3>
        <p><b>行为：</b>{concept.behavior}</p>
        <p><b>传导：</b>{concept.transmission}</p>
        <p><b>反馈：</b>{concept.feedback}</p>
        {concept.formula ? <div className="equation-card"><span>MINIMUM RELATION · 不是自动因果式</span><code>{concept.formula}</code><p>公式只固定对象、身份或候选关系；变量缺字段、口径不齐或识别条件不成立时，结论保持partial/null。</p></div> : null}
        <div className="case-study"><div><span>例子 / WORKED INTUITION</span><p>{concept.example}</p></div><div><span>反例 / FALSIFIER</span><p>{concept.counterexample}</p></div></div>
        {labId ? <EmCapitalFlowLab id={labId} /> : null}
        <p className={styles.boundary}><b>证据边界：</b>{concept.evidenceBoundary}</p>
        <div className="interface-grid" role="group" aria-label={`${concept.index}跨章接口`}><article><span>FROM</span><p>{concept.interfaces.from}</p></article><article><span>TO</span><p>{concept.interfaces.to}</p></article></div>
        <p className="section-sources"><b>机制依据：</b><Cites ids={concept.sourceIds} /></p>
      </section>;
    })}

    <section className="lesson-section" id="em-flow-debate-map">
      <div className="em-flow-print-heading">
        <p className="section-kicker">DATA MAP · ACCOUNTING IDENTITIES, CONDITIONAL EVIDENCE, AND IDENTIFICATION CEILINGS</p>
        <h2>没有一张“资本流表”能同时回答交易、持仓、银行集团风险、基金赎回、到期现金和因果供给。</h2>
      </div>
      <p>官方BOP/IIP提供居民—非居民与交易—估值框架，QEDS提供外债期限和币种；BIS LBS/CBS/GLI分别观察居住地银行资产负债表、合并集团风险与对非银行部门的外币信用；CPIS/CDIS分别观察跨境证券与直接投资头寸；基金和基准数据揭示资产管理pipe，信贷登记与企业财务才接近国内借款人。严谨研究不是挑一张最方便的图，而是先指定问题，再选择可支持该问题的数据，并把不能支持的字段保留为unknown。<Cites ids={[1, 2, 8, 9, 10, 12, 13, 18, 19, 26, 27, 28, 29]} /></p>
      <div className={styles.tableWrap} role="region" aria-label="资本流七类数据系统" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">数据系统</th><th scope="col">能支持</th><th scope="col">关键限制</th><th scope="col">依据</th></tr></thead><tbody>{dataSystemMatrix.map(row => <tr key={row[0] as string}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td><td><Cites ids={row[3] as readonly number[]} /></td></tr>)}</tbody></table></div>
      <h3>同一句“导致”必须声明来自哪种证据</h3>
      <div className={styles.tableWrap} role="region" aria-label="六类机制证据等级" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">证据层</th><th scope="col">本课例子</th><th scope="col">最多支持</th></tr></thead><tbody>{mechanismClaims.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table></div>
      <h3>四个同时成立、但不能相互替代的结论</h3>
      <div className="term-grid"><article className="term-card"><span>GROSS FLOWS</span><h4>净额会遮蔽两侧行动</h4><p>危机中居民与非居民两腿可同时收缩；这不说明每个事件有同一原因。<Cites ids={[3, 4]} /></p></article><article className="term-card"><span>HETEROGENEITY</span><h4>全球因素重要但不统治全部流量</h4><p>工具、投资者和时期改变loading；有限平均解释度反驳强版单因子，不否认尾部与特定路线。<Cites ids={[5, 6, 8, 9]} /></p></article><article className="term-card"><span>RISK MIGRATION</span><h4>本币和长期融资改变风险承担者</h4><p>借款人FX／rollover风险下降时，外国持有人的汇率与久期风险可能上升。<Cites ids={[16, 17]} /></p></article><article className="term-card"><span>PRICE vs QUANTITY</span><h4>价差共同性强，不代表数量也由强共同因子支配</h4><p>在[25]的模型与样本中，融资价差的共同波动主要由共同供给冲击解释，资本流数量则大多是国别特质波动、特质需求与供给贡献相近；access需另找数据，三者不能互作代理。<Cites ids={[25]} /></p></article></div>
      <p className={styles.boundary}><b>最低可证伪证据包：</b>冻结居民与工具对象、来源符号、交易—估值桥、两条gross leg、币种期限和对冲、投资者与边际吸收者、价格／数量／access、实时事件阈值、政策反应时钟、竞争解释和失败条件。只有净流入、外国持有、美元指数或基金流曲线，均不足以得到sudden-stop原因、国家排名或政策结论。</p>
      <p className="section-sources"><b>数据与争论依据：</b><Cites ids={[1, 2, 3, 4, 5, 6, 8, 9, 10, 13, 16, 17, 18, 19, 21, 22, 25, 26, 27, 28, 29]} /></p>
    </section>

    <section className="lesson-section" id="em-flow-checks">
      <p className="section-kicker">EXIT CHECKS · TYPE THE CLAIM BEFORE YOU EXPLAIN IT</p>
      <h2>十二道M/K检查与二十道理解题：答案必须同时守住居民、方向、合约、现金时钟和证据上限。</h2>
      <EmCapitalFlowQuiz />
      <h3>二十道第二遍作业</h3>
      <ol className="understanding-list">{emCapitalFlowUnderstandingQuestions.map((question, index) => {
        const guide = emCapitalFlowUnderstandingGuides[index];
        return <li key={question}><b>{String(index + 1).padStart(2, '0')}</b> · {question}<details className={styles.rubric}><summary>作答后展开 · {guide.kind}题最小合格骨架</summary><p><b>必含：</b>{guide.mustInclude.join('；')}。</p><p><b>常见错误：</b>{guide.commonError}</p><p><b>可选延伸：</b>{guide.extension}</p></details></li>;
      })}</ol>
      <p className={styles.boundary}><b>分题型评分：</b>measurement题核对居民、方向、交易／头寸和口径；channel题核对主体、合约、边际吸收与时钟；identification题核对供需、外生来源、竞争解释和反证；policy题区分工具状态、反应、效果、自主性和福利。无法识别时必须写candidate、partial、unknown或null。</p>
    </section>

    <section className="lesson-section" id="em-flow-evidence-research">
      <p className="section-kicker">RESEARCH / EVIDENCE / INTERFACES / PROVENANCE</p>
      <h2>从会解释“外资流出”走向可验证研究：先冻结债权对象和实时钟，再讨论冲击、危机、政策或预测。</h2>
      <details className={styles.secondPass}>
        <summary>第二遍附录 · 完整三十词术语表</summary>
        <div className="term-grid entry-vocabulary" role="group" aria-label="4.08入口术语">{emCapitalFlowEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入现实数据</span><h4>{term}</h4><p>{definition}</p></article>)}</div>
      </details>
      <h3>十个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.08可证伪研究问题">{emCapitalFlowResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>需要：</b>{question.evidenceNeeded}</p><p><b>削弱证据：</b>{question.whatWouldWeakenIt}</p><p><b>拒绝：</b>{question.reject}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}</div>
      <h3>八组命题—证据地图</h3>
      <div className="evidence-map" role="group" aria-label="4.08二十九项来源证据地图">{emCapitalFlowEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>八条证据边界</h3>
      <ol className="understanding-list">{emCapitalFlowEvidenceBoundaries.map((boundary, index) => <li key={boundary}><b>{String(index + 1).padStart(2, '0')}</b> · {boundary}</li>)}</ol>
      <h3>跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.08跨章接口">{emCapitalFlowInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <details className={styles.secondPass}>
        <summary>第二遍附录 · 不变量与作者有限自检</summary>
        <div className="check-grid" role="group" aria-label="4.08不变量"><div><ul>{emCapitalFlowInvariants.slice(0, Math.ceil(emCapitalFlowInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div><div><ul>{emCapitalFlowInvariants.slice(Math.ceil(emCapitalFlowInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div></div>
        <div className="yield-fixture-audit" role="group" aria-label="4.08作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...emCapitalFlowLabAudit, ...canonicalEmCapitalFlowAuthorAudit, ...lesson408IntegrityAudit].map(item => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      </details>
      <div className="precision-note"><span>当前审批边界 · BODY-r4 双重独立复审</span><p>事实／公式／引用席与教学／结构／可访问性席已分别对同一个冻结BODY哈希 <code>{emCapitalFlowReviewedBodySha256}</code> 给出批准，P1/P2/P3均为0；运行与出版QA另行通过。双审只证明本讲义在声明范围内的内容与教学质量，不把AUTHOR-SYN实验升级为现实观测，也不生成PIT、causal、OOS、forecast、trading或production资格。未来任何实质改动都必须重新冻结并复审。</p></div>
    </section>
  </>;
}

const lesson408Reviews: LessonRecord['reviews'] = [
  {
    kind: 'accuracy' as const,
    completedAt: '2026-09-22T23:59:12Z',
    decision: 'approved' as const,
    revision: '4.08-r1',
    summary: '独立复核同一只读BODY-r4的13个机制、会计分类与公式、C1/C2、十二题、29项来源、证据边界和跨章接口；P1/P2/P3均为0。批准内容哈希f11df44e…70fa8。',
  },
  {
    kind: 'pedagogy' as const,
    completedAt: '2026-09-23T00:02:49Z',
    decision: 'approved' as const,
    revision: '4.08-r1',
    summary: '独立复核同一只读BODY-r4的98分钟路径、零基础入口、两项实验、十二题与二十题，以及390px、200%等价压力、无脚本和80页A4呈现；P1/P2/P3均为0。批准内容哈希f11df44e…70fa8。',
  },
];

export const lesson408: LessonRecord = {
  slug: '4-08',
  id: '4.08',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Capital Flows into Emerging Markets：两条总额流、合约组成与本地吸收',
  subtitle: '资本流不是“全球资金进入新兴市场”的单一水管：从居民／非居民、交易／头寸与gross／net口径出发，先以互斥功能分类记录组成、再把工具与基金／银行管道另列，沿币种、期限、对冲、边际吸收者和本地资产负债表追踪汇率、价格、信用与sudden-stop反馈',
  readingTime: '页面内置98分钟核心路径：13个单一机制、两个可手算且非现实观测的AUTHOR-SYN实验；完整十二道M/K、二十题、十个研究问题、三十字段护照、数据／证据地图和十二组原典阅读另作第二遍。估时来自学习任务，不以重复文字凑时长',
  prerequisite: 'Master prerequisites：4.01 Balance of Payments与4.07 Global Financial Cycle；按需回看3.21、4.05、4.06及T06/T08。只继承上游类型、语义与证据上限，不读取其AUTHOR-SYN数值、现实／因果／审稿身份。后续接口为4.09、4.20–4.21及7.10/7.15/7.17/7.28',
  updatedAt: '2026-09-22',
  revision: '4.08-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson408Reviews,
  previous: { slug: '4-07', label: '4.07 Global Financial Cycle' },
  next: { label: '4.09 Trilemma / Dilemma 与政策自主性' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...emCapitalFlowConcepts.map(({ id, index, title }) => ({ id, label: `${index} ${title}` })),
    ...extras.slice(1),
  ],
  Content: Lesson408Content,
  references: [...lesson408References],
  readingList: [...lesson408ReadingList],
  readingListOrder: 'grouped',
};
