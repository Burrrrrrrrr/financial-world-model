import TreasuryCurveDiagram from '../components/TreasuryCurveDiagram';
import TreasuryCurveLabStatic from '../components/TreasuryCurveLabStatic';
import TreasuryCurveQuiz from '../components/TreasuryCurveQuiz';
import TreasuryCurveStaticQuiz from '../components/TreasuryCurveStaticQuiz';
import styles from '../components/treasuryCurve.module.css';
import { treasuryCurveFixtureAudit } from '../components/treasuryCurveFixtures';
import type { TreasuryCurveLabId } from '../components/treasuryCurveFixtures';
import { treasuryCurveLabAudit, treasuryCurveLabs } from '../components/treasuryCurveLabDefinitions';
import { treasuryCurveScenarioAudit, treasuryCurveScenarios } from '../components/treasuryCurveScenarios';
import { treasuryCurveConcepts } from './treasuryCurveConcepts';
import {
  lesson404ReadingList,
  lesson404References,
  treasuryCurveEvidenceGroups,
  treasuryCurveFailedSourceLedger,
} from './treasuryCurveReferences';
import {
  treasuryCurveChecks,
  treasuryCurveCoreRoute,
  treasuryCurveEntryVocabulary,
  treasuryCurveEvidenceBoundaries,
  treasuryCurveInterfaces,
  treasuryCurveInvariants,
  treasuryCurvePassportRules,
  treasuryCurveResearchQuestions,
  treasuryCurveThesis,
} from './treasuryCurveStudy';
import {
  canonicalTreasuryCurveAudit,
  canonicalTreasuryCurveFields,
  canonicalTreasuryCurveStateExample,
  treasuryCurveObservedPassportFields,
} from './treasuryCurveState';
import type { LessonRecord } from './types';

export {
  canonicalTreasuryCurveAudit,
  canonicalTreasuryCurveFields,
  canonicalTreasuryCurveStateExample,
} from './treasuryCurveState';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map(id => <a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;
}

const extras = [
  { id: 'treasury-curve-scope-route', label: '86分钟主路径／曲线护照' },
  { id: 'treasury-curve-system-chain', label: '六道门与双向反馈图' },
  { id: 'treasury-curve-interactive-section', label: 'Interactive M1–M12' },
  { id: 'treasury-curve-static-twins', label: 'Static K1–K12' },
  { id: 'treasury-curve-checks-glossary', label: 'Checks / Passport / Vocabulary' },
  { id: 'treasury-curve-evidence-research', label: 'Evidence / Research / Interfaces' },
] as const;

const labAttachments: Readonly<Record<string, TreasuryCurveLabId | undefined>> = {
  'treasury-curve-mechanism-01': 'C1',
  'treasury-curve-mechanism-02': 'C2',
  'treasury-curve-mechanism-06': 'C3',
  'treasury-curve-mechanism-11': 'C4',
  'treasury-curve-mechanism-12': 'C5',
  'treasury-curve-mechanism-13': 'C6',
};

const curveObjects = [
  ['Treasury CMT par', '财政部从最近拍卖券的indicative bid-side quotations构造par curve，再读取固定期限bond-equivalent yield。', '不是实时成交、zero curve、单只可购买证券或任意合同的折现曲线。'],
  ['Treasury security YTM', '使一只具体券的全部现金流现值等于其价格的单一内部收益率。', '不是每一期现金流实际使用的逐期zero rate，也不自动等于同期限CMT。'],
  ['Treasury zero curve', '由一组券价与声明方法估计的discount factors／zero yields期限坐标。', '拟合曲线不是可直接购买的证券；方法、样本券与插值会影响结果。'],
  ['SOFR / OIS curve', '以隔夜担保融资参考率及衍生品构造、并受清算或抵押制度约束的曲线。', 'SOFR以Treasury作抵押，不等于Treasury bond yield；单一fixing也不是整条OIS曲线。'],
  ['Swap curve', '由固定—浮动掉期报价形成的期限坐标，可承担定价、hedge与relative-value基准。', '不是在所有币种与时期都优于政府债；与Treasury之间保留swap spread与basis。'],
  ['On-the-run cash / futures', '最新券与期货提供高度可见、可交易的方向风险和价格发现工具。', '可见不等于纯宏观；repo specialness、交割选择、融资和basis仍会进入价格。'],
] as const;

const benchmarkRoles = [
  ['REFERENCE', '公共报价坐标', '让发行、资产与事件反应可以在声明匹配条件后比较。'],
  ['HEDGE', '期限风险工具', '用现券、期货或swap管理DV01/KRD，但保留basis与convexity。'],
  ['RELATIVE VALUE', '价差锚点', '把资产价格写成benchmark加资产特定楔子；raw spread不是纯信用。'],
  ['COLLATERAL / FUNDING', '抵押与融资投入', '市值、资格、未占用数量、haircut、repo rate与tenor共同决定现金能力。'],
  ['INFORMATION', '预期与风险状态表', '节点变化包含政策、增长、term premium、便利、供给、融资和外国消息；方向本身不识别driver。'],
] as const;

const liquidityDimensions = [
  ['Tightness / spread', '小额即时交易跨越报价的成本；窄点差不说明报价后有多少数量。'],
  ['Depth', '一个或多个价位能承接的数量；深度大不保证冲击后恢复很快。'],
  ['Price impact', '给定交易规模造成的价格变化；没有订单规模和窗口就不可比较。'],
  ['Resilience', '冲击后价格、点差和订单簿恢复的速度；它不是某一时点的成交量。'],
] as const;

const firstUseDecoder = [
  ['Constant Maturity Treasury（CMT）', '财政部从官方par curve读取的固定期限收益率点；它不是某只可直接购买的证券。'],
  ['Zero-coupon yield（zero）', '把单一未来现金流折现回今天的零息收益率；它与par yield、单只券YTM不是同一个对象。'],
  ['Overnight Index Swap（OIS）', '以隔夜参考利率交换固定与浮动现金流的掉期；担保与清算制度决定其折现安排。'],
  ['Key-rate duration（KRD）', '组合对声明期限节点局部变动的敏感度向量；总DV01中性不等于每个节点都中性。'],
  ['Foreign exchange（FX）', '外汇；外国投资者的本币结果还要经过现货汇率、远期点、basis与套保比例。'],
  ['Central counterparty（CCP）', '中央对手方清算机构；它居中承担清算规则、保证金与违约处置，而不是一条曲线。'],
  ['Price alignment interest（PAI）', '清算衍生品变动保证金现金余额的利息安排；其参考率会进入合约估值制度。'],
  ['Credit Support Annex（CSA）', '规定双边衍生品抵押品、计息、门槛等条款的信用支持附件，并会影响折现曲线的选择。'],
  ['Cheapest-to-deliver（CTD）', '期货空方在合格篮子中交割成本最低的候选券；交割选择会产生basis风险。'],
  ['Equity risk premium（ERP）', '股票相对声明无风险期限价格所要求的额外预期回报；它不是可直接观测的常数。'],
] as const;

const sectionIds = ['thesis', extras[0].id, ...treasuryCurveConcepts.map(concept => concept.id), ...extras.slice(1).map(section => section.id)];
const referenceIds = new Set<number>(lesson404References.map(reference => reference.id));
const renderedCitationIds = [
  ...treasuryCurveConcepts.flatMap(concept => concept.sourceIds),
  ...treasuryCurveLabs.flatMap(lab => lab.sourceIds),
  ...treasuryCurveScenarios.flatMap(scenario => scenario.sourceIds),
  ...treasuryCurveChecks.flatMap(check => check.sourceIds),
  ...treasuryCurveResearchQuestions.flatMap(question => question.sourceIds),
  ...treasuryCurveEvidenceGroups.flatMap(group => group.sourceIds),
  1, 2, 3, 4, 7, 8, 9, 10, 11, 12, 13, 14,
];
const evidenceMapIds = new Set<number>(treasuryCurveEvidenceGroups.flatMap(group => group.sourceIds));
const routeConceptIds: readonly string[] = treasuryCurveCoreRoute.flatMap(step => step.conceptIds);
const authorSubAudits = [...treasuryCurveFixtureAudit, ...treasuryCurveLabAudit, ...treasuryCurveScenarioAudit, ...canonicalTreasuryCurveAudit];

export const lesson404IntegrityAudit = [
  {
    key: 'fourteen single-mechanism units preserve full causal chain counterexample evidence boundary and interfaces',
    passed: treasuryCurveConcepts.length === 14
      && treasuryCurveConcepts.every(concept => concept.question.length >= 20
        && concept.intuition.length >= 70
        && concept.actors.length >= 60
        && concept.constraints.length >= 60
        && concept.behavior.length >= 60
        && concept.transmission.length >= 60
        && concept.feedback.length >= 60
        && concept.counterexample.length >= 45
        && concept.evidenceBoundary.length >= 40
        && concept.sourceIds.length > 0),
  },
  {
    key: 'six necessary formulas and six independent labs attach exactly once',
    passed: treasuryCurveConcepts.filter(concept => concept.formula).length === 6
      && Object.values(labAttachments).filter(Boolean).length === 6
      && new Set(Object.values(labAttachments).filter(Boolean)).size === 6
      && Object.values(labAttachments).every(id => id === undefined || treasuryCurveLabs.some(lab => lab.id === id)),
  },
  {
    key: 'nine-step 86-minute route covers every concept once and all visible section ids are unique',
    passed: treasuryCurveCoreRoute.length === 9
      && treasuryCurveCoreRoute[0].time === '00–08分钟'
      && treasuryCurveCoreRoute[8].time === '83–86分钟'
      && routeConceptIds.length === 14
      && new Set(routeConceptIds).size === 14
      && treasuryCurveConcepts.every(concept => routeConceptIds.includes(concept.id))
      && new Set(sectionIds).size === sectionIds.length,
  },
  {
    key: 'sixteen declared sources resolve every citation and evidence map covers all sources',
    passed: lesson404References.length === 16
      && lesson404ReadingList.length === 9
      && lesson404References.every((reference, index) => reference.id === index + 1
        && reference.url.startsWith('https://')
        && reference.use.includes('支持')
        && reference.use.includes('不'))
      && renderedCitationIds.every(id => referenceIds.has(id))
      && lesson404References.every(reference => evidenceMapIds.has(reference.id))
      && [...evidenceMapIds].every(id => referenceIds.has(id)),
  },
  {
    key: 'twenty checks twenty passport rules thirty-two entry terms eight research questions fourteen interfaces seven evidence boundaries and twenty invariants',
    passed: treasuryCurveChecks.length === 20
      && treasuryCurvePassportRules.length === 20
      && treasuryCurveEntryVocabulary.length === 32
      && treasuryCurveResearchQuestions.length === 8
      && treasuryCurveInterfaces.length === 14
      && treasuryCurveEvidenceBoundaries.length === 7
      && treasuryCurveInvariants.length === 20
      && treasuryCurveObservedPassportFields.length === 21,
  },
  {
    key: 'ten first-use abbreviations are decoded before the core route and later glossary remains a review layer',
    passed: firstUseDecoder.length === 10
      && firstUseDecoder.every(([term, definition]) => term.includes('（') && definition.length >= 30),
  },
  {
    key: `fixtures labs scenarios and canonical reviewed-BODY gates pass while downstream delivery remains external${authorSubAudits.every(item => item.passed) ? '' : `; failed sub-audits: ${authorSubAudits.filter(item => !item.passed).map(item => item.key).join(' | ')}`}`,
    passed: authorSubAudits.every(item => item.passed)
      && canonicalTreasuryCurveFields.length === 21
      && !canonicalTreasuryCurveStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalTreasuryCurveStateExample.evidenceState.independentReviews.length === 2
      && canonicalTreasuryCurveStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.revision === '4.04-r1')
      && canonicalTreasuryCurveStateExample.evidenceState.accuracyApprovalComplete
      && canonicalTreasuryCurveStateExample.evidenceState.pedagogyApprovalComplete
      && canonicalTreasuryCurveStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers
      && !canonicalTreasuryCurveStateExample.evidenceState.sealedMetadataDeltaApprovedByTwoIndependentReviewers
      && !canonicalTreasuryCurveStateExample.evidenceState.browserQaComplete
      && !canonicalTreasuryCurveStateExample.evidenceState.finalPdfAccepted,
  },
  {
    key: 'failed-source ledger is explicit and cannot silently upgrade abstract or metadata into full-text evidence',
    passed: treasuryCurveFailedSourceLedger.length === 2
      && treasuryCurveFailedSourceLedger.every(record => record.request.startsWith('https://')
        && record.status.length >= 10
        && record.resolution.length >= 20
        && record.sourceIds.every(id => referenceIds.has(id))),
  },
] as const;

if (!lesson404IntegrityAudit.every(item => item.passed)) {
  throw new Error(`4.04 lesson gate failed: ${lesson404IntegrityAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}

function Lesson404Content() {
  return <>
    <noscript>
      <style>{'.lesson-page[data-lesson-id="4.04"] .treasury-curve-interactive-only{display:none!important}'}</style>
    </noscript>
    <p className="treasury-curve-nojs-fallback">无脚本／打印静态通道：六个C各自保留固定默认输入、完整结果、手算、极端值、反例与来源；K1–K12保留与互动M完全相同的题干、选项和三条答案路径。可编辑C与互动M不会伪装成静态交互。当前机制正文已由两位非作者对同一clean BODY-r4完整批准；页面只登记这一内容审批，sealed元数据差异、浏览器与最终交付状态仍必须由外部收据证明。</p>

    <section id="thesis" className="lesson-section lesson-opening">
      <p className="section-kicker">ONE CENTRAL MECHANISM · A GLOBAL REFERENCE NETWORK, NOT ONE UNIVERSAL DISCOUNT CURVE</p>
      <h2>美债之所以能影响全球，不是因为每份合约都机械复制同一利率，而是因为一组可交易、可套保、可融资、可观察的美元期限价格连接了许多主体。</h2>
      <p>{treasuryCurveThesis.statement}</p>
      <p>真正的因果链不是“10年期（10Y）收益率上升 → 所有资产下跌”，而是：先识别哪条曲线、哪个节点以及什么冲击驱动（driver）改变；再问谁持有什么现金流、用什么公共基准（benchmark）与对冲工具（hedge）、受什么融资和币种约束；这些主体重估、换仓、补保证金或调整套保后，价格才会进入股票、信用、外汇（FX）与外国债券；新价格又改变资产负债表和政策预期，反馈回Treasury。</p>
      <div className="impact-facts" role="group" aria-label="4.04三条核心不等式">
        {treasuryCurveThesis.inequalities.map((inequality, index) => <article key={inequality}><span>BOUNDARY {String(index + 1).padStart(2, '0')}</span><b>{inequality}</b><p>{index === 0 ? '参考坐标、hedge工具与合同折现制度可以相互作用，却不是同一个对象。' : index === 1 ? '同号yield move可能来自增长信息、政策、期限补偿、便利、供给、融资或外国冲击。' : '本地政策、美元融资、市场深度、FX hedge与反向溢出都会改写路径。'}</p></article>)}
      </div>
      <p className="section-sources"><b>核心依据：</b><Cites ids={[1, 2, 3, 4, 9, 10, 11, 12, 13, 14]} /></p>
    </section>

    <section id="treasury-curve-scope-route" className="lesson-section">
      <p className="section-kicker">CURVE / CASH FLOW / ROLE / EXPOSURE / DRIVER / FUNDING / FX / LOCAL GATE</p>
      <h2>第一遍用86分钟走完一条闭合链：先认曲线和暴露，再认冲击与传导门，最后才讨论方向。</h2>
      <p>本课有两个严格分开的先修接口。3.07只提供curve passport、discount factor、zero、forward与风险状态的已审语义合同；它没有导出可供本课消费的canonical数值，因而本课不会虚构数据lineage。4.03提供safe-asset service、有效容量、抵押和流动性边界；本课只读取其已审lesson与state身份，不复制任何SYN输入、数值输出或observed snapshot。</p>
      <h3>先解码十个会贯穿全课的缩写</h3>
      <p>这些术语在后文还会逐机制重讲；这里先给零背景读者一个最小门牌，避免把缩写的熟悉感误当成对象已经分清。</p>
      <div className="term-grid treasury-entry-decoder" role="group" aria-label="4.04十个首次使用术语解码器">{firstUseDecoder.map(([term, definition]) => <article className="term-card" key={term}><span>FIRST-USE DECODER</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <p>下面六张对象卡先解决一个容易被新闻语言遮蔽的问题：所谓“美债利率”究竟是哪种价格坐标。只有对象清楚，reference、discount、hedge、relative value、funding与information这些用途才不会被“全球无风险利率”一句话压成同一件事。</p>
      <div className={styles.curveTableWrap} tabIndex={0} role="region" aria-label="六种美元期限曲线对象对照表">
        <table className={styles.curveTable}>
          <thead><tr><th>对象</th><th>它回答什么</th><th>不能由此推出什么</th></tr></thead>
          <tbody>{curveObjects.map(([name, meaning, boundary]) => <tr key={name}><td><b>{name}</b></td><td>{meaning}</td><td>{boundary}</td></tr>)}</tbody>
        </table>
      </div>
      <nav className="international-monetary-core-route" aria-label="4.04 86分钟核心学习路径">
        <div>
          <span>CORE ROUTE · 86 MINUTES</span>
          <h3>对象先于计算，暴露先于方向，driver先于叙事，门控先于全球结论。</h3>
          <p>每步先完成任务，再回答退出检查。若仍只能用“美债是全球定价锚”解释，就回到当前门，把主体、约束、行为和反馈补齐。</p>
        </div>
        <ol>{treasuryCurveCoreRoute.map(step => <li key={step.time}>
          <span>{step.time}</span><h4>{step.title}</h4><p>{step.task}</p><p><b>退出检查：</b>{step.exit}</p>
          {step.conceptIds.length ? <p>{step.conceptIds.map((id, index) => <span key={id}>{index ? ' → ' : ''}<a href={`#${id}`}>{treasuryCurveConcepts.find(concept => concept.id === id)?.title}</a></span>)}</p> : <p><span className="treasury-curve-interactive-only"><a href="#treasury-curve-interactive-section">进入M1–M12</a>，再</span>用<a href="#treasury-curve-static-twins">K1–K12静态孪生</a>复核。</p>}
        </li>)}</ol>
      </nav>
      <h3>五种全球角色必须分栏登记</h3>
      <div className={styles.roleGrid} role="group" aria-label="Treasury五种全球基准角色">{benchmarkRoles.map(([code, title, body]) => <article key={code}><span>{code}</span><h4>{title}</h4><p>{body}</p></article>)}</div>
      <div className="precision-note"><span>当前状态 · CLEAN BODY-r4 已由两位独立非作者完整批准</span><p><code>stateId={canonicalTreasuryCurveStateExample.stateId}</code>、<code>inputLineage=[]</code>、<code>independentReviews={canonicalTreasuryCurveStateExample.evidenceState.independentReviews.length}</code>。accuracy与pedagogy两席审查的是同一份154行clean冻结正文、清单与102页PDF，P1/P2/P3均为0；六个C仍只是彼此隔离的作者SYN，不加载实时曲线、CUSIP、仓位、PIT/OOS样本、因果冲击、预测或收益。</p></div>
      <p className="section-sources"><b>范围依据：</b><Cites ids={[1, 2, 3, 4, 7, 8, 9]} /></p>
    </section>

    {treasuryCurveConcepts.map((concept, index) => {
      const labId = labAttachments[concept.id];
      return <section id={concept.id} key={concept.id} className="lesson-section">
        <p className="section-kicker">{String(index + 1).padStart(2, '0')} · {concept.label}</p>
        <h2>{concept.title}</h2>
        <p className="lead-question"><b>这一节只解决一个问题：</b>{concept.question}</p>
        <p><b>先用直觉理解：</b>{concept.intuition}</p>
        <p><b>谁在行动：</b>{concept.actors}</p>
        <p><b>约束在哪里：</b>{concept.constraints}</p>
        <p><b>主体怎样反应：</b>{concept.behavior}</p>
        <p><b>行为怎样传导：</b>{concept.transmission}</p>
        <p><b>新状态怎样反馈：</b>{concept.feedback}</p>
        {concept.id === 'treasury-curve-mechanism-03' ? <div className={styles.roleGrid} role="group" aria-label="五种基准服务复核">{benchmarkRoles.map(([code, title, body]) => <article key={code}><span>{code}</span><h4>{title}</h4><p>{body}</p></article>)}</div> : null}
        {concept.id === 'treasury-curve-mechanism-14' ? <div className={styles.roleGrid} role="group" aria-label="Treasury流动性四维">{liquidityDimensions.map(([title, body], position) => <article key={title}><span>LIQ {String(position + 1).padStart(2, '0')}</span><h4>{title}</h4><p>{body}</p></article>)}</div> : null}
        {concept.formula ? <div className="equation-card">
          <span>{concept.formula.kind === 'definition' ? '定义关系' : concept.formula.kind === 'local-approximation' ? '局部近似' : concept.formula.kind === 'measurement-template' ? '测量模板' : '作者SYN式'}</span>
          <div><code>{concept.formula.expression}</code></div>
          <p>{concept.formula.explanation}</p>
          <dl>{concept.formula.variables.map(variable => <div key={variable.symbol}><dt><code>{variable.symbol}</code></dt><dd>{variable.meaning}</dd></div>)}</dl>
          <p><b>STOP规则：</b>{concept.formula.stopRule}</p>
        </div> : null}
        <div className="precision-note"><span>反例、证据边界与章节接口</span><p><b>反例：</b>{concept.counterexample}</p><p><b>证据能支持到哪里：</b>{concept.evidenceBoundary}</p><p><b>从哪里来：</b>{concept.interfaces.from}</p><p><b>向哪里去：</b>{concept.interfaces.to}</p></div>
        {labId ? <TreasuryCurveLabStatic labId={labId} /> : null}
        <p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds} />{concept.sourceNote}</p>
      </section>;
    })}

    <section id="treasury-curve-system-chain" className="lesson-section">
      <p className="section-kicker">SIX GATES · TWO-WAY FEEDBACK · ONE CONDITIONAL SYSTEM</p>
      <h2>把十四节重新接成系统：Treasury先提供公共期限坐标，六道门再决定冲击是否、以何种形式进入某个资产。</h2>
      <TreasuryCurveDiagram />
      <div className="treasury-system-close"><p>这张图刻意不画一根从10Y yield直达“全球资产”的粗箭头。任何下游结论都要依次保留对象、现金流、资产spread、融资中介、FX hedge与本地制度；其中一门缺失，输出就是null或候选集合，而不是由媒体叙事补齐。反方向也必须存在：外国政策、全球配置、margin与本地风险承受会改变美国term premium、basis和Treasury liquidity。</p>
      <p className="section-sources"><b>系统依据：</b><Cites ids={[4, 7, 8, 9, 10, 11, 12, 13, 14]} /></p></div>
    </section>

    <section id="treasury-curve-interactive-section" className="lesson-section">
      <p className="section-kicker">INTERACTIVE M1–M12 · FIXED STEMS / INDEPENDENT LABS</p>
      <h2>十二道互动检查只读取自己的固定题设；它们不会追随上面的可编辑C，也不会把正确SYN答案升级成现实预测。</h2>
      <p>先锁定对象、用途、状态与单位，再选一条完整推理。每题只反馈当前路径的诊断；若要改变参数，请回到对应C实验。</p>
      <TreasuryCurveQuiz />
    </section>

    <section id="treasury-curve-static-twins" className="lesson-section">
      <p className="section-kicker">STATIC K1–K12 · SAME STEM / SAME OPTIONS / THREE ANSWER PATHS</p>
      <h2>无JavaScript与打印版保留同题、同选项、同正确答案和两条完整错误路径。</h2>
      <p>每个K与同号M共享唯一scenario定义；静态答案不是另写的一套内容，因此不会因呈现通道而改变判断。</p>
      <TreasuryCurveStaticQuiz />
    </section>

    <section id="treasury-curve-checks-glossary" className="lesson-section">
      <p className="section-kicker">UNDERSTANDING CHECKS / 20-FIELD PASSPORT / ENTRY VOCABULARY</p>
      <h2>二十题检验能否独立重建机制；二十字段护照约束你怎样把现实数据接入这张世界模型。</h2>
      <div className="check-grid">{treasuryCurveChecks.map((check, index) => <div id={`treasury-curve-check-${check.id}`} key={check.id}>
        <span>{check.id}</span><p><b>{check.title}：</b>{check.question}</p>
        <details><summary>展开参考答案、误区与依据</summary><p><b>答案：</b>{check.answer}</p><p><b>常见误区：</b>{check.trap}</p><p className="section-sources">依据：<Cites ids={check.sourceIds} /></p></details>
        <p className="print-only"><b>{String(index + 1).padStart(2, '0')} · 答案：</b>{check.answer}<br /><b>误区：</b>{check.trap} <Cites ids={check.sourceIds} /></p>
      </div>)}</div>
      <h3>二十字段曲线—资产—证据护照</h3>
      <p>护照不是要求每次都拿到所有字段，而是禁止缺失被悄悄改成默认值。字段未知时，研究仍可继续做描述或列候选机制，但对应定量结果必须是null并附具体原因。</p>
      <div className="term-grid" role="group" aria-label="4.04二十字段护照">{treasuryCurvePassportRules.map(([field, rule]) => <article className="term-card" key={field}><span>CURVE / ASSET / EVIDENCE PASSPORT</span><h3>{field}</h3><p>{rule}</p></article>)}</div>
      <h3>三十二个入口术语</h3>
      <div className="term-grid entry-vocabulary" role="group" aria-label="4.04入口术语">{treasuryCurveEntryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>先解码，再进入现实材料</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
    </section>

    <section id="treasury-curve-evidence-research" className="lesson-section">
      <p className="section-kicker">EVIDENCE STATE / FALSIFIABLE QUESTIONS / SOURCE FAILURES / HANDOFF</p>
      <h2>开放的全球定价世界观必须在这里收束成带时钟、对象、识别和拒绝条件的局部研究。</h2>
      <h3>七条证据边界</h3>
      <ol className="contract-list">{treasuryCurveEvidenceBoundaries.map((boundary, index) => <li key={boundary}><b>{String(index + 1).padStart(2, '0')}</b><span>{boundary}</span></li>)}</ol>
      <h3>八个可证伪研究问题</h3>
      <div className="evidence-map" role="group" aria-label="4.04可证伪研究问题">{treasuryCurveResearchQuestions.map((question, index) => <div key={question.question}><h4>{String(index + 1).padStart(2, '0')} · {question.question}</h4><p><b>设计：</b>{question.design}</p><p><b>拒绝：</b>{question.reject}</p><p className="section-sources">依据：<Cites ids={question.sourceIds} /></p></div>)}</div>
      <h3>二十条反误导不变量</h3>
      <ol className="contract-list">{treasuryCurveInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
      <h3>证据地图</h3>
      <div className="evidence-map" aria-label="4.04十六项来源证据地图" role="group">{treasuryCurveEvidenceGroups.map(group => <div key={group.key}><h4>{group.title}</h4><p><b>支持：</b>{group.supports} <Cites ids={group.sourceIds} /></p><p><b>不支持：</b>{group.doesNotSupport}</p></div>)}</div>
      <h3>失败／受限来源台账</h3>
      <div className="term-grid" role="group" aria-label="4.04失败与受限来源台账">{treasuryCurveFailedSourceLedger.map(record => <article className="term-card" key={record.title}><span>FAILED / LIMITED · PRESERVED</span><h3>{record.title}</h3><p><b>请求：</b><code className="treasury-source-path">{record.request}</code></p><p><b>状态：</b>{record.status}</p><p><b>处置：</b>{record.resolution}</p><p className="section-sources">对应来源：<Cites ids={record.sourceIds} /></p></article>)}</div>
      <h3 id="treasury-curve-cross-interfaces">跨章接口</h3>
      <div className="interface-grid" role="group" aria-label="4.04跨章接口">{treasuryCurveInterfaces.map(([name, payload, guardrail]) => <article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="4.04作者有限自检"><span>作者结构／算术／canonical自检（不是独立完整内容审批）</span><ul>{[...treasuryCurveFixtureAudit, ...treasuryCurveLabAudit, ...treasuryCurveScenarioAudit, ...canonicalTreasuryCurveAudit, ...lesson404IntegrityAudit].map(item => <li key={item.key} className={item.passed ? 'passed' : ''}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="precision-note"><span>当前审批与交付边界</span><p>这是<code>4.04-r1</code>的已登记内容审批：accuracy与pedagogy分别完整批准同一<code>/private/tmp/market-404-body-r4-clean-20260916</code>，两份报告均为P1/P2/P3零问题。本次仅允许catalog、lesson metadata与canonical state三文件从草稿提升；这组三文件差异是否通过同两名审稿人的sealed delta复核，以及browser、无JavaScript、键盘、390px、print、PDF与最终交付是否完成，都只能由外部收据证明。内容双审不构成现实数据校准、PIT/OOS、因果、预测、交易或生产资格。</p></div>
    </section>
  </>;
}

const lesson404Reviews: LessonRecord['reviews'] = [
  { kind: 'accuracy', completedAt: '2026-09-17T01:56:04Z', decision: 'approved', revision: '4.04-r1', summary: '独立复核同一clean BODY-r4的目录闭包、二十个正文文件、十四项机制、六个C、十二M/K、二十题、二十字段护照、十六项来源与102页A4纸本；P1/P2/P3均为0。对象、公式、单位、STOP/null、SYN/observed/PIT边界和引用映射闭合。' },
  { kind: 'pedagogy', completedAt: '2026-09-17T01:54:50Z', decision: 'approved', revision: '4.04-r1', summary: '独立复核同一clean BODY-r4的初学者机制链、86分钟路径、六个实验、十二组互动与静态同题、首次术语、390px、无脚本与102页A4纸本；P1/P2/P3均为0，BODY-r3的系统来源悬挂与Static标题/K01分离问题均已关闭。' },
];

export const lesson404: LessonRecord = {
  slug: '4-04',
  id: '4.04',
  chapter: '04',
  chapterTitle: 'Global Markets & Cross-Asset Transmission',
  title: 'US Treasury 作为全球定价曲线：公共期限坐标、传导门与双向反馈',
  subtitle: '为什么美债收益率会影响全球资产：从固定期限国债收益率（CMT）、零息收益率（zero）与隔夜指数掉期（OIS）的对象分离，经过公共基准、关键利率久期（KRD）对冲、回购融资（repo）、冲击驱动识别、现金流—风险溢价竞赛、外汇（FX）套保、本地制度与2020市场功能压力',
  readingTime: '页面内置86分钟核心路径：14个单一机制与退出检查；六个独立C、十二M/K、二十题、二十字段护照、研究设计与原典路线另作第二遍。均为真实学习估时，不靠凑字保证时长',
  prerequisite: 'Master prerequisites：3.07 Yield Curve与4.03 Reserve Currency / Safe Asset；只消费已审身份与语义接口，不复制上游SYN或观测数值。按需调用T02/T03/T05/T06/T07/T08、2.06 Repo/Haircut与3.08 Term Premium最小直觉；后续接口为4.05–4.17、5.03–5.07及7.10/7.24–7.26',
  updatedAt: '2026-09-16',
  revision: '4.04-r1',
  reviewStatus: 'double-reviewed',
  reviews: lesson404Reviews,
  previous: { slug: '4-03', label: '4.03 Reserve Currency 与 Safe Asset Demand' },
  next: { slug: '4-05', label: '4.05 Global Dollar Funding' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    extras[0],
    ...treasuryCurveConcepts.map(({ id, label }) => ({ id, label })),
    ...extras.slice(1),
  ],
  Content: Lesson404Content,
  references: lesson404References,
  readingList: lesson404ReadingList,
  readingListOrder: 'source',
};
