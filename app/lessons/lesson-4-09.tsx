import PolicyAutonomyDiagram from '../components/PolicyAutonomyDiagram';
import PolicyAutonomyLab from '../components/PolicyAutonomyLab';
import PolicyAutonomyQuiz from '../components/PolicyAutonomyQuiz';
import styles from '../components/policyAutonomy.module.css';
import { policyAutonomyLabAudit, policyAutonomyLabs, type PolicyAutonomyLabId } from '../components/policyAutonomyLabs';
import { policyAutonomyConcepts } from './policyAutonomyConcepts';
import { lesson409ReadingList, lesson409References, policyAutonomyEvidenceGroups } from './policyAutonomyReferences';
import {
  policyAutonomyChecks,
  policyAutonomyCoreRoute,
  policyAutonomyEntryVocabulary,
  policyAutonomyEvidenceBoundaries,
  policyAutonomyInterfaces,
  policyAutonomyInvariants,
  policyAutonomyPassportRules,
  policyAutonomyResearchQuestions,
  policyAutonomyThesis,
  policyAutonomyUnderstandingGuides,
  policyAutonomyUnderstandingQuestions,
} from './policyAutonomyStudy';
import {
  canonicalPolicyAutonomyAuthorAudit,
  canonicalPolicyAutonomyFields,
  canonicalPolicyAutonomyStateExample,
  policyAutonomyReviewedBodySha256,
} from './policyAutonomyState';
import type { LessonRecord } from './types';

export { canonicalPolicyAutonomyStateExample } from './policyAutonomyState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'policy-autonomy-route', label: '98分钟主路径／三十字段护照' },
  { id: 'policy-autonomy-debate-map', label: '制度、结果与证据地图' },
  { id: 'policy-autonomy-checks', label: '十二M/K与二十题' },
  { id: 'policy-autonomy-evidence-research', label: '研究、证据与跨章接口' },
] as const;

const labAttachments: Readonly<Record<string, PolicyAutonomyLabId | undefined>> = {
  'policy-autonomy-mechanism-05': 'C1',
  'policy-autonomy-mechanism-09': 'C2',
};

const entryGateTerms = [
  ['Instrument autonomy', '某项国内工具路径能否偏离外部基准；它不承诺利差、信用或宏观结果被隔离。'],
  ['Financial-condition insulation', '外部状态进入本地收益率、信用价格、数量、access、汇率与资产价格的程度。'],
  ['Stabilisation effectiveness', '政策相对明确反事实是否改变通胀、产出或金融稳定目标。'],
  ['Welfare optimality', '计入资源、分配、尾部风险与跨境外溢后的规范判断；不能由前面三栏自动推出。'],
  ['Trilemma', '经典假设内三个持续承诺的相容性问题，不是现实国家只能选两个按钮的口号。'],
  ['Dilemma', 'Rey（2015）的原始强命题涉及资本自由流动下的货币政策约束；本课另将浮动下广义金融条件仍可共振记为较窄命题。'],
  ['Effective mobility', '与问题相关的主体、工具、方向和时钟上的事实可执行跨境替代，而不是一个法定开关。'],
  ['Basis', '对冲后回报相对CIP基准的差异；它会受资金、资产和中介约束影响，不能自动叫作套利利润。'],
  ['Risk-off / global loading', 'risk-off是状态标签；global loading是本地结果对该状态的条件敏感度，两者都不是天然结构shock。'],
  ['Estimand', '研究真正要估计的对象：处理、结果、主体、时域与反事实必须同时固定。'],
  ['PIT / OOS', 'PIT要求只用决策时可得信息；OOS要求在冻结规则之外验证，均不能由页面构建或审稿替代。'],
  ['Policy reaction', '政策对压力和信息的内生响应；动作、效果与福利是三种不同证据身份。'],
] as const;

const outcomeMatrix = [
  ['工具自主', '政策率、流动性工具、资产负债表、FXI、MPM或CFM路径', '是否能相对外部基准作不同选择？', '不能推出广义金融条件已隔离'],
  ['金融条件隔离', '曲线、信用价量与access、汇率、资产价格、保证金和外币现金', '外部变化有多少进入哪些主体？', '不能由政策率共动或不共动单独决定'],
  ['稳定效果', '通胀、产出、就业、市场功能与系统风险', '相对无政策或替代政策，结果改变多少？', '需要反事实与政策选择识别'],
  ['福利最优', '总资源、分配、尾部、财政成本、外溢与长期行为反应', '收益是否超过全部成本且优于替代方案？', '不能由短期价格稳定直接推出'],
] as const;

const measurementMatrix = [
  ['汇率制度', 'AREAER de jure；事实分类；锚、波幅、反应和退出', '公告／实施／重设／退出时钟', '低波动不等于固定；年度标签不等于实时规则', [15, 16, 37] as const],
  ['资本流动', '法定限制、实际头寸、成交、成本、托管与执行', '主体×方向×工具×币种×期限', 'KAOPEN不等于每条路线的事实可执行性', [13, 14, 16, 28, 29] as const],
  ['利率平价', '同币种／期限／信用的回报、预期、风险、对冲与basis', '决策时预期与结算时钟', '残差不是唯一可命名shock或无风险利润', [30, 31, 32, 33] as const],
  ['全球金融周期', '共同因子、VIX、美元、杠杆、信用与资本流', '统计状态、公告窗口与宏观时域', 'factor或代理不等于结构shock', [6, 7, 18, 34, 35, 40, 41] as const],
  ['主体资产负债表', '债务、收入、支付、自然对冲、衍生品和期限', '同主体、同币、同现金窗口', '国家净额不等于尾部企业现金', [9, 17, 20, 23] as const],
  ['官方储备／FXI', '交易、估值、其他变化、可用性、承诺与衍生品', '执行、结算、冲销和退出时钟', '储备变化不等于等额干预；gross不等于usable', [22, 23, 24, 25, 26, 38, 39, 42] as const],
  ['政策组合', 'shock、friction、target、entity、route、capacity、cost', '预期、选择、实施和评价时钟', '政策框架不是国别处理效果或福利答案', [19, 20, 21, 22, 27] as const],
] as const;

const claimLadder = [
  ['定义／会计', '四类自主结果、制度与现金对象', '固定术语、符号和可相加对象；不给行为或因果'],
  ['MODEL-SYN', 'C1相容性与利率楔子', '验证声明内逻辑；不给现实概率、流量或政策效果'],
  ['AUTHOR-SYN', 'C2匿名A/B现金与信用向量', '演示反例；不给国家参数或脆弱性排序'],
  ['描述性事实', '制度分类、利率共动、全球因子', '支持样本内关系；共同原因与选择仍存在'],
  ['条件化机制', '错配、主导计价、有限中介与工具容量', '说明在何种摩擦下可能传导；不保证净效果'],
  ['局部因果', '高频工具、阈值、资格或配对设计', '只在识别假设、样本、窗口和结果内'],
  ['OOS／福利', '实时预测、外推与社会权重', '须另有严格PIT、外样本和规范证据；本课不声称'],
] as const;

const referenceIds = new Set<number>(lesson409References.map(reference => reference.id));
const evidenceMapIds = new Set<number>(policyAutonomyEvidenceGroups.flatMap(group => group.sourceIds));
const routeConceptIds = policyAutonomyCoreRoute.flatMap(step => step.conceptIds);
const sectionIds = ['thesis', extras[0].id, ...policyAutonomyConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const renderedCitationIds = [
  ...policyAutonomyConcepts.flatMap(concept => concept.sourceIds),
  ...policyAutonomyChecks.flatMap(check => check.sourceIds),
  ...policyAutonomyResearchQuestions.flatMap(question => question.sourceIds),
  ...policyAutonomyEvidenceGroups.flatMap(group => group.sourceIds),
  ...policyAutonomyLabs.flatMap(lab => lab.sourceIds),
  ...lesson409References.map(reference => reference.id),
];
const checkCorrectIndices = policyAutonomyChecks.map(check => check.correct);
const checkAnswerCounts = [0, 1, 2].map(index => checkCorrectIndices.filter(correct => correct === index).length);
const maxCheckAnswerRun = checkCorrectIndices.reduce((state, current, index) => ({ max: Math.max(state.max, current === checkCorrectIndices[index - 1] ? state.run + 1 : 1), run: current === checkCorrectIndices[index - 1] ? state.run + 1 : 1 }), { max: 0, run: 0 }).max;

export const lesson409IntegrityAudit = [
  { key: 'thirteen single-mechanism units retain actors constraints transmission feedback example counterexample evidence and interfaces', passed: policyAutonomyConcepts.length === 13 && policyAutonomyConcepts.every(concept => concept.question.length >= 20 && concept.intuition.length >= 85 && concept.actors.length >= 50 && concept.constraints.length >= 60 && concept.behavior.length >= 50 && concept.transmission.length >= 50 && concept.feedback.length >= 45 && concept.example.length >= 35 && concept.counterexample.length >= 35 && concept.evidenceBoundary.length >= 40 && concept.sourceIds.length > 0) },
  { key: '98-minute route covers every concept exactly once and section IDs are unique', passed: policyAutonomyCoreRoute.length === 13 && policyAutonomyCoreRoute[0].time === '00–07分钟' && policyAutonomyCoreRoute[12].time === '92–98分钟' && routeConceptIds.length === 13 && new Set(routeConceptIds).size === 13 && policyAutonomyConcepts.every(concept => routeConceptIds.includes(concept.id as (typeof routeConceptIds)[number])) && new Set(sectionIds).size === sectionIds.length },
  { key: 'two independent synthetic labs attach exactly once and all arithmetic gates pass', passed: Object.values(labAttachments).filter(Boolean).length === 2 && new Set(Object.values(labAttachments).filter(Boolean)).size === 2 && policyAutonomyLabs.length === 2 && policyAutonomyLabAudit.every(item => item.passed) },
  { key: 'forty-two sources and twelve readings are continuous traceable and fully evidence-mapped', passed: lesson409References.length === 42 && lesson409ReadingList.length === 12 && lesson409References.every((reference, index) => reference.id === index + 1 && reference.url.startsWith('https://') && reference.use.includes('支持') && reference.use.includes('不支持')) && renderedCitationIds.every(id => referenceIds.has(id)) && lesson409References.every(reference => evidenceMapIds.has(reference.id)) },
  { key: 'checks answer balance questions rubrics passport vocabulary research interfaces boundaries and invariants meet contract', passed: policyAutonomyChecks.length === 12 && policyAutonomyChecks.filter(check => check.kind === 'M').length === 6 && policyAutonomyChecks.filter(check => check.kind === 'K').length === 6 && checkAnswerCounts.every(count => count === 4) && maxCheckAnswerRun <= 2 && policyAutonomyUnderstandingQuestions.length === 20 && policyAutonomyUnderstandingGuides.length === 20 && policyAutonomyUnderstandingGuides.every(guide => guide.mustInclude.length >= 2 && guide.mustInclude.length <= 4 && guide.commonError.length > 8) && policyAutonomyPassportRules.length === 30 && policyAutonomyEntryVocabulary.length === 30 && policyAutonomyResearchQuestions.length === 10 && policyAutonomyInterfaces.length === 11 && policyAutonomyEvidenceBoundaries.length === 8 && policyAutonomyInvariants.length >= 45 },
  { key: 'canonical state binds two independent approvals to the reviewed body while empirical and policy claims remain absent', passed: canonicalPolicyAutonomyFields.length === 18 && canonicalPolicyAutonomyAuthorAudit.every(item => item.passed) && canonicalPolicyAutonomyStateExample.evidenceState.independentReviews.length === 2 && canonicalPolicyAutonomyStateExample.evidenceState.independentReviews.every(review => review.approvedBodySha256 === policyAutonomyReviewedBodySha256) && canonicalPolicyAutonomyStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers && !canonicalPolicyAutonomyStateExample.evidenceState.observedDataImported && !canonicalPolicyAutonomyStateExample.evidenceState.pointInTimeCertified && !canonicalPolicyAutonomyStateExample.evidenceState.causalEffectIdentified && !canonicalPolicyAutonomyStateExample.evidenceState.predictionEstimated && !canonicalPolicyAutonomyStateExample.evidenceState.outOfSampleValidated && !canonicalPolicyAutonomyStateExample.evidenceState.tradingEligibility && !canonicalPolicyAutonomyStateExample.evidenceState.productionEligibility },
] as const;

if (!lesson409IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.09 lesson gate failed: ${lesson409IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson409Content() {
  return <>
    <noscript><style>{'.lesson-page[data-lesson-id="4.09"] .policy-autonomy-interactive-only{display:none!important}.lesson-page[data-lesson-id="4.09"] .policy-autonomy-nojs-fallback{display:block!important}'}</style></noscript>
    <p className="policy-autonomy-nojs-fallback"><b>无脚本静态通道：</b>两个合成实验保留冻结输入、同源calculator结果、完整手算、反例、STOP/null与来源；十二道M/K显示静态题册和默认关闭的答案册。作者结构与算术检查不是独立内容审批。</p>

    <aside className={styles.entryGate} aria-labelledby="policy-autonomy-entry-title">
      <p className="section-kicker">TWO-MINUTE ENTRY GATE · 先把一句“有自主性”拆成十二个对象</p>
      <h2 id="policy-autonomy-entry-title">不要先问“这个国家自由不自由”；先问哪项工具、哪种结果、哪个主体、哪个时钟。</h2>
      <div className={styles.entryGateGrid}>{entryGateTerms.map(([term, definition]) => <article key={term}><h3>{term}</h3><p>{definition}</p></article>)}</div>
    </aside>

    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">ONE CENTRAL MECHANISM · INSTITUTIONAL FEASIBILITY × FINANCIAL FRICTIONS → TYPED POLICY OUTCOMES</p>
      <h2>{policyAutonomyThesis.title}</h2>
      <p><b>先锁定本课唯一中心机制：</b>{policyAutonomyThesis.statement} 如果只记住一句话，请记住：<b>能设定自己的政策率，不等于能隔离自己的全部金融条件；不能完全隔离金融条件，也不等于汇率制度毫无作用。</b></p>
      <p><b>本课最小闭环：</b>{policyAutonomyThesis.chain}。经典Mundell–Fleming与历史Trilemma文献给持续承诺的相容性基准。Rey（2015）的原始Dilemma提出更强的制度结论：资本自由流动下，全球金融周期可能不因汇率制度而消失并约束货币政策；本课则另把“政策率可偏离、广义金融条件仍可能共振”作为较窄、可分结果检验的命题。后续关于浮动仍有部分缓冲的证据是对强命题的限定，不是Rey原文。<Cites ids={[1, 2, 3, 5, 6, 7, 8, 9, 10, 11, 35, 36]} /></p>
      <div className={styles.boundaryGrid} role="group" aria-label="4.09七条不可混同关系">{policyAutonomyThesis.inequalities.map((inequality, index) => <article key={inequality}><span>BOUNDARY {String(index + 1).padStart(2, '0')}</span><b>{inequality}</b><p>{index < 3 ? '结果层不得越级。' : index < 6 ? '制度、行为与识别分开。' : '出版质量不生成经验资格。'}</p></article>)}</div>
      <PolicyAutonomyDiagram />
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 5, 6, 7, 8, 9, 17, 19, 20, 21, 22]} /></p>
    </section>

    <section className="lesson-section" id="policy-autonomy-route">
      <p className="section-kicker">OUTCOME / COMMITMENT / MOBILITY / WEDGE / CYCLE / BALANCE SHEET / TOOL / EVIDENCE</p>
      <h2>第一遍用98分钟走完可行域：先审制度相容，再追踪广义金融条件，最后才问政策效果和福利。</h2>
      <p>硬先修是4.01–4.08提供的类型和证据边界，尤其4.05的币种／期限／现金钟、4.07的global state与shock分级、4.08的资本流方向与边际吸收。上游不向本课传递合成数值、国家结论、政策效果或审稿身份。</p>
      <nav className="international-monetary-core-route" aria-label="4.09 98分钟核心学习路径"><div><span>CORE ROUTE · 98 MINUTES</span><h3>结果护照 → 经典基准 → 制度规则 → 有效流动 → 楔子账本 → 浮动空间 → 全球周期 → 汇率双通道 → 主体现金 → 工具分配 → FXI双腿／冲销 → 内生政策 → 证据阶梯。</h3><p>C1在第5段分别审计制度相容性与利率平价残差；C2在第9段并列现金桥与独立信用观察。第11段核心只做FXI双腿与冲销worked mechanism；储备统计、CFM法律边界与绕道放在第二遍。完整数据表、十二题、二十题、研究设计、术语与原典阅读也不计入98分钟。</p></div><ol>{policyAutonomyCoreRoute.map(step => <li key={step.time}><span>{step.time}</span><h4>{step.conceptIds.map(id => policyAutonomyConcepts.find(concept => concept.id === id)?.index).join(' / ')}</h4><p>{step.goal}</p><p>{step.conceptIds.map((id, index) => <span key={id}>{index ? ' → ' : ''}<a href={`#${id}`}>{policyAutonomyConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p></li>)}</ol></nav>
      <details className={styles.secondPass}><summary>第二遍附录 · 四类结果矩阵与三十字段政策自主性护照</summary>
        <h3>四类“自主性”各自需要什么证据</h3>
        <div className={styles.tableWrap} role="region" aria-label="四类政策自主结果比较" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">结果层</th><th scope="col">观测对象</th><th scope="col">可检验问题</th><th scope="col">不可自动推出</th></tr></thead><tbody>{outcomeMatrix.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td></tr>)}</tbody></table></div>
        <h3>三十字段制度—工具—证据护照</h3>
        <div className="term-grid" role="group" aria-label="4.09三十字段护照">{policyAutonomyPassportRules.map((rule, index) => <article className="term-card" key={rule}><span>PASSPORT {String(index + 1).padStart(2, '0')}</span><h4>{rule.split('：')[0]}</h4><p>{rule}</p></article>)}</div>
        <div className="precision-note"><span>三条证据轴互不代替</span><p><b>Measurement：</b>MODEL/AUTHOR-SYN → observed → versioned history → strict PIT；<b>Causal：</b>not claimed → candidate channel → locally identified effect → verified feedback；<b>Prediction：</b>not estimated → in-sample → OOS candidate → OOS validated。双审、构建、打印与发布只升级内容和交付门。</p></div>
      </details>
    </section>

    {policyAutonomyConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section className="lesson-section" id={concept.id} key={concept.id}>
        <p className="section-kicker">MECHANISM {String(index + 1).padStart(2, '0')} · {concept.index}</p>
        <h2>{concept.title}</h2>
        <p><b>本节问题：</b>{concept.question}</p>
        <p className={styles.passport}><b>前置：</b>{concept.prerequisite}</p>
        <div className="precision-note"><span>先用直觉抓住单一机制</span><p>{concept.intuition}</p></div>
        <h3>谁参与，哪些约束界定可行集合？</h3>
        <p><b>参与者：</b>{concept.actors}</p><p><b>约束与口径：</b>{concept.constraints}</p>
        <h3>行为如何进入金融条件，并反馈到下一轮政策？</h3>
        <p><b>行为：</b>{concept.behavior}</p><p><b>传导：</b>{concept.transmission}</p><p><b>反馈：</b>{concept.feedback}</p>
        {concept.formula ? <div className="equation-card"><span>MINIMUM RELATION · 只在声明范围内解释</span><code>{concept.formula}</code>{concept.formulaTranslation ? <p><b>逐符号翻译：</b>{concept.formulaTranslation.replace(/^直译：/, '')}</p> : null}<p>公式固定对象、符号或候选关系；任何缺失字段、不可比资产、内生政策或未识别反事实都使更强结论保持partial、unknown或null。</p></div> : null}
        <div className="case-study"><div><span>例子 / WORKED INTUITION</span><p>{concept.example}</p></div><div><span>反例 / FALSIFIER</span><p>{concept.counterexample}</p></div></div>
        {labId ? <PolicyAutonomyLab id={labId} /> : null}
        {concept.id === 'policy-autonomy-mechanism-11' ? <details className={styles.secondPass}><summary>第二遍延伸 · 储备可用性与CFM实施边界</summary><h3>储备不是一只可随时提取的总额</h3><p>把gross reserves、流动／可用资产、已承诺资产、衍生品头寸、预定与或有外币流出以及短期外币负债分栏；储备存量或变动还混有收益、估值、交易与其他数量变化，不能直接等同可用FXI容量或等额干预。私人企业也只有在法律资格、币种、期限、交易对手和市场容量都闭合时，才可能获得官方外汇路线。<Cites ids={[38, 39, 42]} /></p><h3>CFM的楔子来自实施，不来自标签</h3><p>记录法律范围、居民方向、工具、豁免、实施日、执法机构与替代路线；目标流下降时仍要追踪贸易信用、离岸实体、非银、衍生品和期限迁移。这里仅登记实施边界，不评估净效果、分配、外溢或福利；这些问题由5.06承接。<Cites ids={[21, 28, 29]} /></p></details> : null}
        <p className={styles.boundary}><b>证据边界：</b>{concept.evidenceBoundary}</p>
        <div className="interface-grid" role="group" aria-label={`${concept.index}跨章接口`}><article><span>FROM</span><p>{concept.interfaces.from}</p></article><article><span>TO</span><p>{concept.interfaces.to}</p></article></div>
        <p className="section-sources"><b>机制依据：</b><Cites ids={concept.sourceIds} /></p>
      </section>;
    })}

    <section className="lesson-section" id="policy-autonomy-debate-map">
      <p className="section-kicker">MEASUREMENT MAP · DIFFERENT DATA OBJECTS ANSWER DIFFERENT AUTONOMY QUESTIONS</p>
      <h2>没有一只“自主性指数”能同时观察制度承诺、有效资本流动、广义金融条件、主体现金和政策效果。</h2>
      <p>政策自主研究最容易出错的地方，不是公式太少，而是将不同数据对象拼成一个含义不稳定的总分。汇率分类看制度行为，资本开放指数看法定限制，利率联动看某项工具共动，全球因子看跨资产共同状态，企业与银行数据才接近主体化现金与信用；政策效果还需要反事实。最稳妥的做法，是先写问题再选数据，并把未观测字段保留为unknown。<Cites ids={[3, 4, 5, 6, 7, 9, 10, 12, 13, 14, 15, 16, 30, 34, 35]} /></p>
      <div className={styles.tableWrap} role="region" aria-label="4.09七类测量系统" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">对象</th><th scope="col">最低数据包</th><th scope="col">时钟／单位</th><th scope="col">关键禁止升级</th><th scope="col">依据</th></tr></thead><tbody>{measurementMatrix.map(row => <tr key={row[0] as string}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><Cites ids={row[4] as readonly number[]} /></td></tr>)}</tbody></table></div>
      <h3>一句“影响了”必须先标注证据层</h3>
      <div className={styles.tableWrap} role="region" aria-label="4.09七级证据阶梯" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">证据层</th><th scope="col">本课对象</th><th scope="col">最多支持</th></tr></thead><tbody>{claimLadder.map(row => <tr key={row[0]}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td></tr>)}</tbody></table></div>
      <h3>四个可同时成立的命题</h3>
      <div className="term-grid"><article className="term-card"><span>CLASSIC FEASIBILITY</span><h4>固定汇率会压缩政策率空间</h4><p>在资本流动和资产可比基准内，持续独立利差要求至少放松一项声明或加入楔子。<Cites ids={[1, 2, 3]} /></p></article><article className="term-card"><span>PARTIAL BUFFER</span><h4>浮动通常扩大政策率空间</h4><p>事实制度和利率联动研究支持“圆角”与条件化缓冲，而非三个纯按钮。<Cites ids={[4, 5, 9, 10]} /></p></article><article className="term-card"><span>GLOBAL CYCLE</span><h4>金融条件仍可全球共振</h4><p>风险承载、美元融资、银行和基金能让信用与资产价格在浮动下同步。<Cites ids={[6, 7, 8, 18, 34, 35]} /></p></article><article className="term-card"><span>LOCAL ABSORPTION</span><h4>同一外部状态产生异质结果</h4><p>计价、错配、期限、对冲、市场深度与政策容量决定谁被缓冲、放大或改道。<Cites ids={[9, 17, 19, 20, 23]} /></p></article></div>
      <p className={styles.boundary}><b>最低可证伪证据包：</b>冻结工具、目标、主体、时域、锚与制度反应规则；保存de jure/de facto、有效资本路线、资产可比、预期与楔子；将政策率、曲线、信用价量与access、汇率、外币现金、宏观目标分列；重建决策时信息、政策选择、anticipation、替代工具和反证。只有制度标签、利差、VIX、储备／GDP或事后结果，均不足以给政策效果与福利。</p>
      <p className="section-sources"><b>测量与争论依据：</b><Cites ids={[3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42]} /></p>
    </section>

    <section className="lesson-section" id="policy-autonomy-checks">
      <p className="section-kicker">EXIT CHECKS · TYPE THE OUTCOME BEFORE CLAIMING AUTONOMY</p>
      <h2>十二道M/K检查与二十道理解题：答案必须同时守住制度假设、结果层、主体现金和证据上限。</h2>
      <PolicyAutonomyQuiz />
      <h3>二十道第二遍作业</h3>
      <ol className="understanding-list">{policyAutonomyUnderstandingQuestions.map((question, index) => { const guide = policyAutonomyUnderstandingGuides[index]; return <li key={question}><b>{String(index + 1).padStart(2, '0')}</b> · {question}<details className={styles.rubric}><summary>作答后展开 · {guide.kind}题最小合格骨架</summary><p><b>必含：</b>{guide.mustInclude.join('；')}。</p><p><b>常见错误：</b>{guide.commonError}</p><p><b>可选延伸：</b>{guide.extension}</p></details></li>; })}</ol>
      <p className={styles.boundary}><b>分题型评分：</b>定义题必须给工具、目标、主体和时域；模型题必须写假设与结论范围；测量题必须保留版本、可比性和unknown；识别题必须给处理、结果、反事实、共同原因、选择和anticipation；政策题必须区分工具状态、动作、效果、成本、外溢与福利。</p>
    </section>

    <section className="lesson-section" id="policy-autonomy-evidence-research">
      <p className="section-kicker">RESEARCH / EVIDENCE / INTERFACES / PROVENANCE</p>
      <h2>从讨论“有多少自主”走向可验证研究：先指定结果向量与制度时钟，再构造反事实。</h2>
      <details className={styles.secondPass}><summary>第二遍附录 · 完整三十词术语表</summary><div className="term-grid entry-vocabulary" role="group" aria-label="4.09入口术语">{policyAutonomyEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入现实数据</span><h4>{term}</h4><p>{definition}</p></article>)}</div></details>
      <h3>十个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.09可证伪研究问题">{policyAutonomyResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>需要：</b>{question.evidenceNeeded}</p><p><b>削弱证据：</b>{question.whatWouldWeakenIt}</p><p><b>拒绝：</b>{question.reject}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}</div>
      <h3>八组命题—证据地图</h3>
      <div className="evidence-map" role="group" aria-label="4.09四十二项来源证据地图">{policyAutonomyEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>八条证据边界</h3><ol className="understanding-list">{policyAutonomyEvidenceBoundaries.map((boundary, index) => <li key={boundary}><b>{String(index + 1).padStart(2, '0')}</b> · {boundary}</li>)}</ol>
      <h3>跨章接口</h3><div className="interface-grid" role="group" aria-label="4.09跨章接口">{policyAutonomyInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <details className={styles.secondPass}><summary>第二遍附录 · 不变量与作者有限自检</summary><div className="check-grid" role="group" aria-label="4.09不变量"><div><ul>{policyAutonomyInvariants.slice(0, Math.ceil(policyAutonomyInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div><div><ul>{policyAutonomyInvariants.slice(Math.ceil(policyAutonomyInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div></div><div className="yield-fixture-audit" role="group" aria-label="4.09作者有限自检"><span>作者结构／算术／canonical自检（不是独立内容审批）</span><ul>{[...policyAutonomyLabAudit, ...canonicalPolicyAutonomyAuthorAudit, ...lesson409IntegrityAudit].map(item => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div></details>
      <div className="precision-note"><span>当前审批边界 · BODY-r5 双重独立复审</span><p>两席已对同一冻结哈希 <code>{policyAutonomyReviewedBodySha256}</code> 独立批准，P1/P2/P3=0；运行／出版QA另行通过。这里只升级内容与交付资格：observed、PIT、causal、prediction、OOS、trading、production仍全部未获得。任何实质改动须重新冻结并复审。</p></div>
    </section>
  </>;
}

const lesson409Reviews: LessonRecord['reviews'] = [
  {
    kind: 'accuracy' as const,
    completedAt: '2026-09-23T02:05:00Z',
    decision: 'approved' as const,
    revision: '4.09-r1',
    summary: '已批准 · P1/P2/P3=0 · 33043b99…a684',
  },
  {
    kind: 'pedagogy' as const,
    completedAt: '2026-09-23T02:09:33Z',
    decision: 'approved' as const,
    revision: '4.09-r1',
    summary: '已批准 · P1/P2/P3=0 · 33043b99…a684',
  },
];

export const lesson409: LessonRecord = {
  slug: '4-09', id: '4.09', chapter: '04', chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Trilemma / Dilemma 与政策自主性：制度可行域、金融条件与多工具边界',
  subtitle: '政策自主不是国家身上的单一开关：从固定汇率、有效资本流动与独立利率路径的经典相容性出发，再沿主导货币、外币负债、期限、对冲与中介容量追踪浮动汇率下仍可存在的全球金融传导，并把工具空间、金融条件隔离、稳定效果与福利判断分成四层',
  readingTime: '页面内置98分钟核心路径：13个单一机制、一个MODEL-SYN相容性账本和一个AUTHOR-SYN主体现金配对实验；完整十二道M/K、二十题、十个研究问题、三十字段护照、制度／证据地图和十二组原典阅读另作第二遍。估时来自学习任务，不以重复文字凑时长',
  prerequisite: 'Master prerequisites：4.01–4.08；重点按需回看4.05、4.07、4.08及T02/T06/T08。只继承类型、语义与证据上限，不读取上游合成数值、现实／因果／审稿身份。后续接口为4.10、5.06及7.10/7.17/7.24–7.26',
  updatedAt: '2026-09-22', revision: '4.09-r1', reviewStatus: 'double-reviewed', reviews: lesson409Reviews,
  previous: { slug: '4-08', label: '4.08 Capital Flows into Emerging Markets' },
  next: { label: '4.10 Exchange-rate Regime 与 Shock Absorption' },
  sections: [{ id: 'thesis', label: '核心命题' }, extras[0], ...policyAutonomyConcepts.map(({ id, index, title }) => ({ id, label: `${index} ${title}` })), ...extras.slice(1)],
  Content: Lesson409Content,
  references: [...lesson409References], readingList: [...lesson409ReadingList], readingListOrder: 'grouped',
};
