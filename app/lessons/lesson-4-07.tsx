import GlobalCycleDiagram from '../components/GlobalCycleDiagram';
import GlobalCycleLab from '../components/GlobalCycleLab';
import GlobalCycleQuiz from '../components/GlobalCycleQuiz';
import styles from '../components/globalCycle.module.css';
import { globalCycleLabAudit, globalCycleLabs, type GlobalCycleLabId } from '../components/globalCycleLabs';
import { globalCycleConcepts } from './globalCycleConcepts';
import { globalCycleEvidenceGroups, lesson407ReadingList, lesson407References } from './globalCycleReferences';
import {
  globalCycleChecks,
  globalCycleCoreRoute,
  globalCycleEntryVocabulary,
  globalCycleEvidenceBoundaries,
  globalCycleInterfaces,
  globalCycleInvariants,
  globalCyclePassportRules,
  globalCycleResearchQuestions,
  globalCycleThesis,
  globalCycleUnderstandingGuides,
  globalCycleUnderstandingQuestions,
} from './globalCycleStudy';
import {
  canonicalGlobalCycleAuthorAudit,
  canonicalGlobalCycleFields,
  canonicalGlobalCycleStateExample,
} from './globalCycleState';
import type { LessonRecord } from './types';

export { canonicalGlobalCycleStateExample } from './globalCycleState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'global-cycle-route', label: '97分钟主路径／第二遍附录' },
  { id: 'global-cycle-system-chain', label: '争论地图与观测等价' },
  { id: 'global-cycle-checks', label: '十二M/K与二十题' },
  { id: 'global-cycle-evidence-research', label: '证据、研究与跨章接口' },
] as const;

const labAttachments: Readonly<Record<string, GlobalCycleLabId | undefined>> = {
  'global-cycle-mechanism-04': 'C1',
  'global-cycle-mechanism-12': 'C2',
};

const entryGateTerms = [
  ['Global Financial Cycle', '依声明面板和方法估计的跨国、跨资产共同状态，不是一只天然指数。'],
  ['Risk-on / risk-off', '一组价格、融资与仓位方向的压缩标签，不是冲击名称。'],
  ['Common / latent factor', '模型从多序列估计的共同成分；样本、窗口或方法改变时也会改变。'],
  ['Proxy', '与目标有关但不相同的可观测指标；相关高也不构成身份等号。'],
  ['Driver', '可能改变共同状态的候选来源；没有识别设计时只能写candidate。'],
  ['Channel', '冲击穿过价格、融资、资产负债表或网络的具体路径。'],
  ['Local filter', '币种错配、市场深度、投资者基础与政策等本地缓冲/放大器。'],
  ['Feedback', '结果回写中介、政策与下一期观测的闭环；方向可以正也可以负。'],
] as const;

const objectComparison = [
  ['资产价格共同因子', '股票、信用、商品等价格/回报', '样本内共同方差、loadings、residual', '不能自动代表资本流、信用量或冲击来源'],
  ['资本流共同因子', '按居民/非居民、方向和工具拆分的gross flows', '流量共动与事件概率', 'net flow不能恢复stop/flight；平均解释度可能有限'],
  ['全球信用/流动性', '银行贷款、国际债券、币种和借款人', '外币信用数量与融资结构', '聚合GLI不是实体cash、供给因果或共同因子'],
  ['国内金融周期', '本国信用、房价与中期资产负债表', '更长的国内boom–bust', '与短一些的GFCy对象和频率不同，危机时才更易汇合'],
] as const;

const diagnosticMatrix = [
  ['VIX', 'SPX期权报价构造的恒定30日S&P 500预期波动率（年化表达）', '美国股票预期波动的市场价格', '全球因子、纯风险厌恶、外生shock'],
  ['广义美元', '美元相对一篮子货币的价格', '美元cycle与主体暴露候选', '实体funding access或所有主体损益'],
  ['Treasury yield', '政策预期、增长通胀、期限溢价和供需的合成价格', '全球折现率候选', '单凭方向识别Fed shock'],
  ['Credit spread', '公司债收益率相对基准的利差，可含预期违约损失、风险补偿与流动性等', '信用风险价格与融资条件', 'EBP、全球因子或已识别外生shock'],
  ['Excess bond premium (EBP)', '模型估计的、公司债利差中超出预期违约损失所解释部分', '信用风险承载与未来活动的候选诊断', '无模型依赖的事实、全部流动性或唯一全球风险shock'],
  ['Leverage / flows', '资产负债表比例与数量行为', '风险承载和传播候选', '主动扩表、机械分母效应和需求变化的自动区分'],
] as const;

const evidenceDesignMatrix = [
  ['宽风险资产动态因子', '跨地区风险资产价格的共同状态', '一个因子可承载显著共同波动', 'universe、样本和normalisation敏感；不是driver', [1, 2] as const],
  ['资本流分类型面板', '85国季度流量，方向与工具拆分', '强版“单因子支配大多数流量”受到反证', '不否认资产价格、尾部或特定流量的全球因素', [4, 11] as const],
  ['美国货币政策外部工具', 'FOMC窄窗口+rich-information VAR', '特定样本内全球资产、杠杆和信用响应', '依relevance、exclusion与信息效应处理', [2, 3] as const],
  ['美国宏观新闻日内事件', '27国股指、VIX、商品等公告窗口', '美国真实经济信息是独立候选driver', '事件窗外推和风险承载解释仍有边界', [10] as const],
  ['长历史资产分解', '17个发达经济体、长期资产回报', '现代同步主要与风险溢价相关', '发达市场历史平均不能直接给EM实时beta', [5] as const],
  ['制度/政策异质面板', '国家敏感度与制度/政策特征', '全球暴露有显著且时变的异质性', '政策变量内生，非通用处方', [12, 13, 15] as const],
] as const;

const referenceIds = new Set<number>(lesson407References.map(reference => reference.id));
const evidenceMapIds = new Set<number>(globalCycleEvidenceGroups.flatMap(group => group.sourceIds));
const routeConceptIds = globalCycleCoreRoute.flatMap(step => step.conceptIds);
const sectionIds = ['thesis', extras[0].id, ...globalCycleConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const renderedCitationIds = [
  ...globalCycleConcepts.flatMap(concept => concept.sourceIds),
  ...globalCycleChecks.flatMap(check => check.sourceIds),
  ...globalCycleResearchQuestions.flatMap(question => question.sourceIds),
  ...globalCycleEvidenceGroups.flatMap(group => group.sourceIds),
  ...globalCycleLabs.flatMap(lab => lab.sourceIds),
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
];

const checkCorrectIndices = globalCycleChecks.map(check => check.correct);
const checkAnswerCounts = [0, 1, 2].map(index => checkCorrectIndices.filter(correct => correct === index).length);
const maxCheckAnswerRun = checkCorrectIndices.reduce(
  (state, current, index) => ({
    max: Math.max(state.max, current === checkCorrectIndices[index - 1] ? state.run + 1 : 1),
    run: current === checkCorrectIndices[index - 1] ? state.run + 1 : 1,
  }),
  { max: 0, run: 0 },
).max;

export const lesson407IntegrityAudit = [
  {
    key: 'twelve single-mechanism units retain causal chain counterexample evidence boundary and interfaces',
    passed: globalCycleConcepts.length === 12 && globalCycleConcepts.every(concept => concept.question.length >= 20 && concept.intuition.length >= 70 && concept.actors.length >= 55 && concept.constraints.length >= 55 && concept.behavior.length >= 45 && concept.transmission.length >= 45 && concept.feedback.length >= 40 && concept.counterexample.length >= 35 && concept.evidenceBoundary.length >= 35 && concept.sourceIds.length > 0),
  },
  { key: '97-minute route covers every concept exactly once and section IDs are unique', passed: globalCycleCoreRoute.length === 12 && globalCycleCoreRoute[0].time === '00–07分钟' && globalCycleCoreRoute[11].time === '91–97分钟' && routeConceptIds.length === 12 && new Set(routeConceptIds).size === 12 && globalCycleConcepts.every(concept => routeConceptIds.includes(concept.id as (typeof routeConceptIds)[number])) && new Set(sectionIds).size === sectionIds.length },
  { key: 'two independent SYN labs attach exactly once and all arithmetic gates pass', passed: Object.values(labAttachments).filter(Boolean).length === 2 && new Set(Object.values(labAttachments).filter(Boolean)).size === 2 && globalCycleLabs.length === 2 && globalCycleLabAudit.every(item => item.passed) },
  { key: 'twenty-two sources and ten readings are continuous traceable and fully mapped', passed: lesson407References.length === 22 && lesson407ReadingList.length === 10 && lesson407References.every((reference, index) => reference.id === index + 1 && reference.url.startsWith('https://') && reference.use.includes('支持') && reference.use.includes('不')) && renderedCitationIds.every(id => referenceIds.has(id)) && lesson407References.every(reference => evidenceMapIds.has(reference.id)) },
  { key: 'checks answer balance questions rubrics passport vocabulary research interfaces boundaries and invariants meet contract', passed: globalCycleChecks.length === 12 && globalCycleChecks.filter(check => check.kind === 'M').length === 6 && globalCycleChecks.filter(check => check.kind === 'K').length === 6 && checkAnswerCounts.every(count => count === 4) && maxCheckAnswerRun <= 2 && globalCycleUnderstandingQuestions.length === 20 && globalCycleUnderstandingGuides.length === 20 && globalCycleUnderstandingGuides.every(guide => guide.mustInclude.length >= 2 && guide.mustInclude.length <= 4 && guide.commonError.length > 12) && globalCyclePassportRules.length === 28 && globalCycleEntryVocabulary.length === 28 && globalCycleResearchQuestions.length === 10 && globalCycleInterfaces.length === 10 && globalCycleEvidenceBoundaries.length === 8 && globalCycleInvariants.length >= 40 },
  { key: 'canonical reviewed body binds exactly two independent approvals while empirical claims remain absent', passed: canonicalGlobalCycleFields.length === 19 && canonicalGlobalCycleAuthorAudit.every(item => item.passed) && canonicalGlobalCycleStateExample.evidenceState.independentReviews.length === 2 && canonicalGlobalCycleStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved') && canonicalGlobalCycleStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers && !canonicalGlobalCycleStateExample.evidenceState.observedDataImported && !canonicalGlobalCycleStateExample.evidenceState.pointInTimeCertified && !canonicalGlobalCycleStateExample.evidenceState.causalEffectIdentified && !canonicalGlobalCycleStateExample.evidenceState.outOfSampleValidated && !canonicalGlobalCycleStateExample.evidenceState.productionEligibility },
] as const;

if (!lesson407IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.07 lesson gate failed: ${lesson407IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson407Content() {
  return <>
    <noscript><style>{'.lesson-page[data-lesson-id="4.07"] .global-cycle-interactive-only{display:none!important}.lesson-page[data-lesson-id="4.07"] .global-cycle-nojs-fallback{display:block!important}'}</style></noscript>
    <p className="global-cycle-nojs-fallback"><b>无脚本静态通道：</b>两个AUTHOR-SYN实验均保留固定输入、同源calculator结果、手算、STOP/null、反例与来源；十二道M/K先显示完整题册，答案位于后续默认关闭的答案册。作者结构与算术检查不等于两名独立审稿人的内容批准。</p>

    <aside className={styles.entryGate} aria-labelledby="global-cycle-entry-gate-title">
      <p className="section-kicker">TWO-MINUTE ENTRY GATE · 先读八个词再进正文</p>
      <h2 id="global-cycle-entry-gate-title">八个词先分层：你看到的是状态、代理、来源、渠道、本地过滤，还是反馈？</h2>
      <div className={styles.entryGateGrid}>{entryGateTerms.map(([term, definition]) => <article key={term}><h3>{term}</h3><p>{definition}</p></article>)}</div>
    </aside>

    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">ONE CENTRAL MECHANISM · COMMON STATE × HETEROGENEOUS EXPOSURE → JOINT BUT NOT IDENTICAL OUTCOMES</p>
      <h2>多国市场同步risk-on / risk-off，先说明存在待测的共同成分；它不自动说明只有一个美国原因，更不说明所有国家无法缓冲。</h2>
      <p><b>先锁定本课唯一中心机制：</b>{globalCycleThesis.statement}如果只记住一句话，请记住：<b>共同运动是被解释对象，不是原因的名字。</b>从“很多市场一起跌”跳到“Fed紧缩、美元荒、全球银行撤资或直接传染”，等于一次跨过测量、识别、渠道和本地过滤四道门。</p>
      <p><b>本课的最小闭环：</b>{globalCycleThesis.causalChain}。这张图允许多个driver和多个channel并存，也允许同一全球状态在本地被缓冲、放大或反转。它既保留Rey和Miranda-Agrippino关于全球共同因子与美国政策溢出的强证据，也把Cerutti—Claessens—Rose关于资本流解释度有限、Jordà等关于风险溢价、以及汇率制度和政策异质的反证纳入同一体系，而不是强迫文献二选一。<Cites ids={[1, 2, 4, 5, 12, 13]} /></p>
      <div className={styles.boundaryGrid} role="group" aria-label="4.07六条不可混同关系">{globalCycleThesis.inequalities.map((inequality, index) => <article key={inequality}><span>BOUNDARY {String(index + 1).padStart(2, '0')}</span><b>{inequality}</b><p>{index < 2 ? '先证明你测量了什么。' : index < 4 ? '再区分代理、通道与因果。' : '最后才进入政策或系统资格。'}</p></article>)}</div>
      <GlobalCycleDiagram />
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 4, 5, 6, 12, 13, 14]} /></p>
    </section>

    <section className="lesson-section" id="global-cycle-route">
      <p className="section-kicker">OBJECT / PANEL / FACTOR / PROXY / DRIVER / CHANNEL / FILTER / FEEDBACK</p>
      <h2>第一遍用97分钟走完整条链：每看到一条risk-on叙事，先问“它在说测量、冲击、渠道，还是结果？”</h2>
      <p>硬先修是3.13 Financial Conditions与4.04–4.06；它们只提供类型和语义接口，不提供可被4.07继承的现实数据、AUTHOR-SYN数值、因果身份或审稿资格。3.13的一国FCI不能直接放进全球PCA；4.04的收益率driver未知就保持unknown；4.05的basis、DXY和设施存在不能单指标定义美元stress；4.06的typed credit edge不能替代截面共同因子。这样既避免重复前课，也防止“上游有一个指标”被改写成“全球状态已经识别”。</p>
      <nav className="international-monetary-core-route" aria-label="4.07 97分钟核心学习路径"><div><span>CORE ROUTE · 97 MINUTES</span><h3>点击每段的机制链接，完成退出检查后返回这里：对象 → 可比面板 → 因子 → 代理 → driver → channel → filter → outcome → feedback。</h3><p>00–07分钟已包含上方八词入口；最后六分钟固定做M1、M4、K5。四对象表、二十八字段护照、完整十二题、二十道作业、研究问题和原典路线都明确属于第二遍，不计入97分钟。</p></div><ol>{globalCycleCoreRoute.map(step => <li key={step.time}><span>{step.time}</span><h4>{step.title}</h4><p>{step.task}</p><p><b>退出检查：</b>{step.exit}</p><p>{step.conceptIds.map((id, index) => <span key={id}>{index ? ' → ' : ''}<a href={`#${id}`}>{globalCycleConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p></li>)}</ol></nav>
      <details className={styles.secondPass}>
        <summary>第二遍附录 · 四种对象、二十八字段护照与三条证据轴（不计入97分钟）</summary>
        <h3>四种常被误写成同一个“周期”的对象</h3>
        <div className={styles.tableWrap} role="region" aria-label="全球与国内金融周期对象比较" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">对象</th><th scope="col">核心观测</th><th scope="col">能回答</th><th scope="col">不能自动回答</th></tr></thead><tbody>{objectComparison.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
        <h3>二十八字段观测—因子—证据护照</h3>
        <div className="term-grid" role="group" aria-label="4.07二十八字段护照">{globalCyclePassportRules.map(([field, rule]) => <article className="term-card" key={field}><span>OBSERVATION / FACTOR / EVIDENCE PASSPORT</span><h4>{field}</h4><p>{rule}</p></article>)}</div>
        <div className="precision-note"><span>三条证据轴必须分开</span><p><b>Measurement：</b>AUTHOR-SYN → observed snapshot → in-sample factor → PIT factor → OOS stability；<b>Causal：</b>not claimed → driver candidate → locally identified shock response → integrated closed loop；<b>Prediction：</b>not estimated → in-sample → OOS candidate → OOS validated。任何一条命题只取最弱箭头等级；双审或构建不能令任何经验轴自动升级。</p></div>
      </details>
    </section>

    {globalCycleConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section className="lesson-section" id={concept.id} key={concept.id}>
        <p className="section-kicker">MECHANISM {String(index + 1).padStart(2, '0')} · {concept.label}</p>
        <h2>{concept.title}</h2>
        <p><b>本节问题：</b>{concept.question}</p>
        <div className="precision-note"><span>先用直觉抓住对象</span><p>{concept.intuition}</p></div>
        <h3>谁参与，谁受到什么约束？</h3>
        <p><b>参与者：</b>{concept.actors}</p>
        <p><b>约束与口径：</b>{concept.constraints}</p>
        <h3>行为怎样进入传导与反馈？</h3>
        <p><b>行为：</b>{concept.behavior}</p>
        <p><b>传导：</b>{concept.transmission}</p>
        <p><b>反馈：</b>{concept.feedback}</p>
        {concept.formula ? <div className="equation-card"><span>{concept.formula.kind.toUpperCase()} · 不是自动因果式</span><code>{concept.formula.expression}</code><dl>{concept.formula.variables.map(variable => <div key={variable.symbol}><dt>{variable.symbol}</dt><dd>{variable.meaning}</dd></div>)}</dl><p><b>白话：</b>{concept.formula.explanation}</p><p><b>STOP规则：</b>{concept.formula.stopRule}</p></div> : null}
        {labId ? <GlobalCycleLab labId={labId} /> : null}
        <div className="case-study"><div><span>反例 / FALSIFIER</span><p>{concept.counterexample}</p></div><div><span>证据边界</span><p>{concept.evidenceBoundary}</p></div></div>
        <div className="interface-grid" role="group" aria-label={`${concept.label}跨章接口`}><article><span>FROM</span><p>{concept.interfaces.from}</p></article><article><span>TO</span><p>{concept.interfaces.to}</p></article></div>
        <p className="section-sources"><b>机制依据：</b><Cites ids={concept.sourceIds} /></p>
      </section>;
    })}

    <section className="lesson-section" id="global-cycle-system-chain">
      <p className="section-kicker">DEBATE MAP · STRONG EVIDENCE, COUNTEREVIDENCE, AND OBSERVATIONAL EQUIVALENCE</p>
      <h2>文献并不矛盾地告诉我们：风险资产可以高度同步，而资本流的大多数变异仍不由一个全球因子解释。</h2>
      <p>“全球金融周期重要吗？”没有脱离对象的单一百分比。Miranda-Agrippino与Rey在跨地区风险资产价格大面板中找到重要共同因子，并用外部工具研究美国货币政策溢出；Cerutti、Claessens与Rose在按方向和类型拆分的85国季度资本流中发现全球因子和中心变量通常解释不到四分之一变异；Jordà等的长历史资产分解又把现代同步更多联系到风险溢价。本课保留这些结果各自的样本、频率与被解释变量，所以它们共同缩小强叙事，而不是相互取消。<Cites ids={[2, 4, 5]} /></p>
      <div className={styles.tableWrap} role="region" aria-label="全球金融周期六类证据设计" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">证据设计</th><th scope="col">对象</th><th scope="col">能支持</th><th scope="col">不能外推</th><th scope="col">来源</th></tr></thead><tbody>{evidenceDesignMatrix.map(row => <tr key={row[0] as string}><th scope="row">{row[0]}</th><td>{row[1]}</td><td>{row[2]}</td><td>{row[3]}</td><td><Cites ids={row[4] as readonly number[]} /></td></tr>)}</tbody></table></div>
      <h3>六个常用diagnostic必须分别问问题</h3>
      <div className={styles.tableWrap} role="region" aria-label="六个全球金融状态代理比较" tabIndex={0}><table className={styles.dataTable}><thead><tr><th scope="col">指标</th><th scope="col">正式对象</th><th scope="col">适合提示</th><th scope="col">不能命名</th></tr></thead><tbody>{diagnosticMatrix.map(row => <tr key={row[0]}>{row.map((cell, index) => index === 0 ? <th scope="row" key={cell}>{cell}</th> : <td key={cell}>{cell}</td>)}</tr>)}</tbody></table></div>
      <h3>三个最容易被同一相关矩阵掩盖的因果图</h3>
      <div className="term-grid"><article className="term-card"><span>COMMON SHOCK</span><h4>G同时进入A与B</h4><p>无需A→B直接边也能高相关；识别重点是G的外生身份和两地loading。</p></article><article className="term-card"><span>SYNCHRONISED LOCAL SHOCKS</span><h4>G遗漏，两地各有同时消息</h4><p>区域政策、共同商品暴露或同时国内动作可以伪装为单一全球因子。</p></article><article className="term-card"><span>DIRECT TRANSMISSION</span><h4>A的创新经typed edge进入B</h4><p>需要时序、网络暴露、外生源和placebo；相关或residual covariance本身不够。</p></article><article className="term-card"><span>ENDOGENOUS FEEDBACK</span><h4>共同仓位与限额把结果再变成原因</h4><p>初始小冲击可因margin、赎回和市场深度放大；也可被长期再平衡负反馈缓冲。</p></article></div>
      <p className={styles.boundary}><b>最低可证伪证据包：</b>预注册universe和信息时钟；PIT标准化、missing与sign anchor；factor/loadings/residual及不确定性；至少两个不重复proxy；driver candidate与识别假设；price/quantity/access渠道；主体和币种暴露；一项本地filter；一项竞争解释；一项能让主叙事失败的反证。只有相关曲线、VIX或一张全球资产热图，不足以得到因果、传染或政策结论。</p>
      <p className="section-sources"><b>争论与反例依据：</b><Cites ids={[1, 2, 3, 4, 5, 6, 10, 11, 12, 13, 14, 17, 21, 22]} /></p>
    </section>

    <section className="lesson-section" id="global-cycle-checks">
      <p className="section-kicker">EXIT CHECKS · MEASURE, DECOMPOSE, IDENTIFY, THEN FALSIFY</p>
      <h2>十二道M/K检查与二十道理解题：答案必须同时守住对象、面板、时钟和证据等级。</h2>
      <GlobalCycleQuiz />
      <h3>二十道第二遍作业</h3>
      <ol className="understanding-list">{globalCycleUnderstandingQuestions.map((question, index) => {
        const guide = globalCycleUnderstandingGuides[index];
        return <li key={question}><b>{String(index + 1).padStart(2, '0')}</b> · {question}<details className={styles.rubric}><summary>作答后展开 · {guide.kind}题最小合格骨架</summary><p><b>必含：</b>{guide.mustInclude.join('；')}。</p><p><b>常见错误：</b>{guide.commonError}</p><p><b>可选延伸：</b>{guide.extension}</p></details></li>;
      })}</ol>
      <p className={styles.boundary}><b>分题型评分：</b>measurement题核对对象、面板和统计量；identification题核对工具、限制和竞争解释；channel题核对主体、价格/数量/可得性与时钟；policy题区分工具、结果和福利；contagion题核对共同因子、异方差、typed edge与placebo。无法识别时必须明确写candidate、partial或null，不再用一把八字段尺子强套所有题。</p>
    </section>

    <section className="lesson-section" id="global-cycle-evidence-research">
      <p className="section-kicker">MEASUREMENT / RESEARCH / INTERFACES / PROVENANCE</p>
      <h2>从会解释全球同步走向可验证研究：先冻结面板和证据轴，再讨论因果、政策或预测。</h2>
      <details className={styles.secondPass}>
        <summary>第二遍附录 · 完整二十八词术语表</summary>
        <div className="term-grid entry-vocabulary" role="group" aria-label="4.07入口术语">{globalCycleEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入现实数据</span><h4>{term}</h4><p>{definition}</p></article>)}</div>
      </details>
      <h3>十个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.07可证伪研究问题">{globalCycleResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>需要：</b>{question.evidenceNeeded}</p><p><b>削弱证据：</b>{question.whatWouldWeakenIt}</p><p><b>拒绝：</b>{question.reject}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}</div>
      <h3>七组命题—证据地图</h3>
      <div className="evidence-map" role="group" aria-label="4.07二十二项来源证据地图">{globalCycleEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>八条证据边界</h3>
      <ol className="understanding-list">{globalCycleEvidenceBoundaries.map((boundary, index) => <li key={boundary}><b>{String(index + 1).padStart(2, '0')}</b> · {boundary}</li>)}</ol>
      <h3>跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.07跨章接口">{globalCycleInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <details className={styles.secondPass}>
        <summary>第二遍附录 · 不变量与作者有限自检</summary>
        <div className="check-grid" role="group" aria-label="4.07不变量"><div><ul>{globalCycleInvariants.slice(0, Math.ceil(globalCycleInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div><div><ul>{globalCycleInvariants.slice(Math.ceil(globalCycleInvariants.length / 2)).map(item => <li key={item}>{item}</li>)}</ul></div></div>
        <div className="yield-fixture-audit" role="group" aria-label="4.07作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...globalCycleLabAudit, ...canonicalGlobalCycleAuthorAudit, ...lesson407IntegrityAudit].map(item => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      </details>
      <div className="precision-note"><span>当前审批与交付边界</span><p>事实／公式／引用席与教学／结构／可访问性席已经分别批准同一冻结BODY-r1；两份报告的P1/P2/P3均为0，并共同绑定内容哈希c38693eb…ee80。运行验收另行覆盖Pages构建、桌面交互、390px、无JavaScript与A4打印；它不替代两席内容审批。页面的双审元数据只登记这些既有结论，不扩张正文主张；任何实质修订都必须生成新哈希并重新审批。即使双审与全部交付门通过，也不会自动生成observed、PIT、historical replay、causal、OOS、forecast、trading或production资格。</p></div>
    </section>
  </>;
}

const lesson407Reviews: LessonRecord['reviews'] = [
  {
    kind: 'accuracy',
    completedAt: '2026-09-22T21:33:34Z',
    decision: 'approved',
    revision: '4.07-r1',
    summary: '独立复核同一只读BODY-r1的12个机制、全部公式与C1/C2、22项来源、全球周期强结果与反证、gross flows、美元／美国冲击／银行／传染边界及跨章接口；P1/P2/P3均为0。批准内容哈希c38693eb…ee80。',
  },
  {
    kind: 'pedagogy',
    completedAt: '2026-09-22T21:34:56Z',
    decision: 'approved',
    revision: '4.07-r1',
    summary: '独立复核同一只读BODY-r1的97分钟路径、两遍式结构、术语入口、两个实验、十二题与二十题、移动端／无脚本／打印等价呈现；P1/P2/P3均为0。批准内容哈希c38693eb…ee80。',
  },
];

export const lesson407: LessonRecord = {
  slug: '4-07',
  id: '4.07',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'Global Financial Cycle：共同成分、风险承受与异质传导',
  subtitle: '为什么许多国家的风险资产会同步上涨或下跌：从跨国跨资产观测护照与潜在共同因子出发，区分美国政策/增长信息、全球折现率、美元融资、银行与非银渠道，再解释本地过滤、结构漂移、反馈及共同冲击/直接传染；VIX在本课仅指由S&P 500期权构造的恒定30日预期波动率代理',
  readingTime: '页面内置97分钟核心路径：12个单一机制、两个可手算且非现实观测的AUTHOR-SYN实验，最后只抽三道机制/口径检查；完整十二道M/K、二十题、十个研究问题、二十八字段护照、证据地图和原典路线另作第二遍。估时来自学习任务，不以重复文字凑时长',
  prerequisite: 'Master prerequisites：3.13 Financial Conditions与4.04–4.06；按需回看T03/T05/T08、2.06、3.20。只继承上游类型、语义与证据上限，不读取其AUTHOR-SYN数值、现实/因果/审稿身份。后续接口为4.08–4.09、4.20–4.21及7.07/7.10/7.17',
  updatedAt: '2026-09-22',
  revision: '4.07-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson407Reviews,
  previous: { slug: '4-06', label: '4.06 Global Banks 与 Cross-border Credit' },
  next: { label: '4.08 Capital Flows into Emerging Markets' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...globalCycleConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson407Content,
  references: [...lesson407References],
  readingList: [...lesson407ReadingList],
  readingListOrder: 'grouped',
};
