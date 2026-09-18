import SurpriseLabStatic from '../components/SurpriseLabStatic';
import SurpriseQuiz from '../components/SurpriseQuiz';
import SurpriseStaticQuiz from '../components/SurpriseStaticQuiz';
import SurpriseDiagram from '../components/SurpriseDiagram';
import '../components/SurprisePrint.css';
import {surpriseLabs,surpriseLabAudit} from '../components/surpriseLabDefinitions';
import {surpriseScenarios,surpriseScenarioAudit} from '../components/surpriseScenarios';
import type {SurpriseLabId} from '../components/surpriseFixtures';
import {surpriseConcepts} from './surpriseConcepts';
import {lesson323References,lesson323ReadingList} from './surpriseReferences';
import {surpriseChecks,surpriseGlossary,surpriseInvariants,surpriseInterfaces} from './surpriseStudy';
import {canonicalSurpriseStateExample,canonicalSurpriseFields,canonicalSurpriseAudit} from './surpriseState';
import type {LessonRecord} from './types';
export {canonicalSurpriseStateExample,canonicalSurpriseFields,canonicalSurpriseAudit} from './surpriseState';

function Cites({ids}:{ids:readonly number[]}){return <>{ids.map(id=><a key={id} href={`#ref-${id}`} aria-label={`参考文献${id}`}>[{id}] </a>)}</>;}
const surpriseThesis=[
 '宏观公布值本身不是价格方向。价格面对的是公布前已经计入的未来路径；真正新增的信息取决于Actual相对哪一个当时可得的Forecast，以及两者是否匹配对象、参考期、版本、单位和时钟。同一个增长值可以比上期改善、低于指定共识，又在另一代理下高于预期；三个符号都可能正确，却回答不同问题。',
 '代理差进入价格以前，还要经过两道门。认知门决定不同主体怎样修订未来现金流、政策路径和总所需回报；市场门决定持仓、风险限额、流动性和执行怎样把异质修订变成订单与价格。现金流上调和分母上调可以同时发生，所以经济数据“好”而资产价格下跌并不矛盾，但也不是任何时代都成立的口诀。',
 '这条链还会反馈：价格和政策响应改变融资、活动和下一轮预测。因而本课把公开版本、训练/选择钟、并发消息和窗口先锁住，再区分描述、条件解释、结构因果、PIT、OOS与生产资格。七组SYN只演示对象和边界，不是现实事件、国家轨迹或收益模型。',
] as const;
const extras=[
 {id:'surprise-scope-route',label:'对象／单位／信息时钟'},
 {id:'surprise-condition-map',label:'条件更新链'},
 {id:'surprise-model-map',label:'代理／估值／研究层级'},
 {id:'surprise-interactive-section',label:'Interactive M1–M10'},
 {id:'surprise-static-twins',label:'Static K1–K10'},
 {id:'surprise-checks-glossary',label:'Checks / Audit / Glossary'},
 {id:'surprise-evidence-boundaries',label:'State / Sources / Interfaces'},
];
const labAttachments:Readonly<Record<string,SurpriseLabId|undefined>>={
 'surprise-mechanism-02':'C1','surprise-mechanism-07':'C2','surprise-mechanism-08':'C3','surprise-mechanism-10':'C4','surprise-mechanism-14':'C5','surprise-mechanism-18':'C6','surprise-mechanism-21':'C7',
};
const sectionIds=['thesis',...surpriseConcepts.map(c=>c.id),...extras.map(e=>e.id)],sources=new Set(lesson323References.map(r=>r.id));
const citationIds=[...surpriseConcepts.flatMap(c=>c.sourceIds),...surpriseLabs.flatMap(l=>l.sourceIds),...surpriseScenarios.flatMap(s=>s.sourceIds),...surpriseChecks.flatMap(c=>c.sourceIds)];
export const lesson323IntegrityAudit=[
 {key:'27 single-mechanism units,81 connected paragraphs and explicit boundaries/source scope',passed:surpriseConcepts.length===27&&surpriseConcepts.every(c=>c.paragraphs.length===3&&c.paragraphs.every(p=>p.length>=90)&&c.boundary.length>=25&&c.sourceNote.length>=25&&c.sourceIds.length>0)},
 {key:'all section IDs unique and seven independent experiments attached exactly once',passed:new Set(sectionIds).size===sectionIds.length&&Object.values(labAttachments).filter(Boolean).length===7&&new Set(Object.values(labAttachments)).size===7&&Object.values(labAttachments).every(id=>id===undefined||surpriseLabs.some(l=>l.id===id))},
 {key:'nine primary-source routes,ten deeper readings and every citation resolves',passed:lesson323References.length===9&&lesson323ReadingList.length===10&&citationIds.every(id=>sources.has(id))&&lesson323References.every(r=>r.url.startsWith('https://')&&r.use.length>=60)},
 {key:'20 understanding checks,40 terms,16 invariants and eight interfaces',passed:surpriseChecks.length===20&&surpriseGlossary.length===40&&surpriseInvariants.length===16&&surpriseInterfaces.length===8},
 {key:'finite math/source/canonical guards pass; the two registered whole lesson approvals remain separate evidence',passed:[...surpriseLabAudit,...surpriseScenarioAudit,...canonicalSurpriseAudit].every(a=>a.passed)&&canonicalSurpriseStateExample.evidenceState.twoFullApprovalsRegistered},
] as const;

function Lesson323Content(){return <>
 <noscript><style>{'.lesson-page[data-lesson-id="3.23"] .surprise-interactive-only{display:none!important}'}</style><p>脚本已关闭：七C固定默认输入、78行结果、21段手算说明，K1–K10完整输入、ABC与三条推理，条件关系图、术语、引用和阅读路线仍可阅读。折叠记录可以原生展开；打印只保留一次完整固定记录。</p></noscript>
 <section id="thesis" className="lesson-section"><p className="section-kicker">ONE CENTRAL MECHANISM · PRICE REACTS TO THE UPDATE, NOT THE LEVEL ALONE</p><h2>公布值相对哪个事前预期，怎样改写未来索取权，才是价格问题。</h2>{surpriseThesis.map(p=><p key={p}>{p}</p>)}<p className="section-sources"><Cites ids={[1,2,3,9]}/></p></section>
 <section id="surprise-scope-route" className="lesson-section"><p className="section-kicker">OBJECT / UNIT / VERSION / INFORMATION CLOCK</p><h2>先把减号两边对齐，再讨论市场为什么上涨或下跌。</h2>
  <p>Master把本节先修写作“6.01预览”。由于6.01完整课尚未出版，本课只在这里给最小语义桥：资产价格对应未来条件现金流，不是当前统计水平；新消息是相对原先条件判断的更新，而非事实被第二次购买。这不是虚构一个6.01数值producer或审批记录。正式语义地基来自已完成3.01的增长/水平/单位，以及3.22的状态、版本和反馈；本节只保留两课真实身份，不消费其SYN数值作校准。</p>
  <p>从零开始可分三段。01–09先学对象匹配、调查汇总、异质判断与信息时钟；10–18再拆消息包、修订、年化、尺度、现金流和分母；19–27把条件状态、政策target/path、窗口、订单与反馈接回研究设计。遇到C先手算固定默认，再只改一个条件并说明哪个对象改变。十M/K是独立固定题，不跟随控件；检查、术语和原典路线可第二遍完成。</p>
  <p>术语先解码：Actual是指定版本的公布值，Forecast是被选作事前参照的代理，Surprise是两者匹配后的差；这三个英文词不赋予“真值、无偏或价格方向”。bp是basis point基点，100bp等于1个百分点。SYN是synthetic独立合成条件。PIT（point in time）要求当时真实可得版本、参数与选择；OOS（out of sample）要求训练/选择之后的未用样本，两个都不会由日期字段或教材算术自动获得。</p>
  <p>机构和资料再解码：SPF是Philadelphia Fed的Survey of Professional Forecasters；WP8959正文把MMS写作International Money Market Services，论文致谢另写Money Market Services International，本课沿用缩写指该调查代理且没有取得底层资料。FRED/ALFRED分别提供现行/历史版本访问语义；BLS是美国劳工统计局，CES是Current Employment Statistics，PFEI是Principal Federal Economic Indicator；BEA是美国经济分析局，GDP是国内生产总值。FEDS是Federal Reserve Board工作论文系列，NBER是美国全国经济研究局。机构名只界定来源，不保证所有公告同钟、所有调查等于边际市场预期。 <Cites ids={[2,4,5,6,7,8]}/></p>
  <p>本课37个原始控件各用声明的安全整数域。普通增长以基点表示，下界−10000bp；政策水平是另一个signed域；C6现金流金额和总所需回报有自己的正分母约束。七C互不相连，表中合法0、截止不可得null和非法STOP不同。序号只表达合成先后，不是真实日期、时区或延迟；精确有理数决定计算，十二位小数只用于显示。</p>
  <div className="precision-note"><span>{canonicalSurpriseStateExample.evidenceState.twoFullApprovalsRegistered?'审批状态：完整同版正文已由两位非作者独立审查通过':'审批状态：完整成稿仍待同版两位非作者正式审查'}</span><p>{canonicalSurpriseStateExample.evidenceState.twoFullApprovalsRegistered?'正式两份记录对应同一冻结完整正文；有限数学预审和UI作者不占两位审批席。教材审批不认证现实PIT、因果、预测或生产性能。':'七C、30候选与27机制完成有限数学预审，三处非阻断措辞已吸收并重跑；这不批准完整Study、canonical、网页或纸本。UI作者交付也不占两位正式审批。当前不注册完整内容approved记录，不认证现实数据、PIT、因果、预测或生产性能。'}</p></div>
 </section>
 {surpriseConcepts.map((c,i)=>{const labId=labAttachments[c.id];return <section id={c.id} key={c.id} className="lesson-section"><p className="section-kicker">{String(i+1).padStart(2,'0')} · CORE MECHANISM</p><h2>{c.title}</h2>{c.paragraphs.map(p=><p key={p}>{p}</p>)}{c.formula?<div className="equation-card"><span>只用于澄清对象的必要算式</span><div><code>{c.formula.expression}</code></div><p>{c.formula.explanation}</p></div>:null}<div className="precision-note"><span>成立条件、反例与跨章接口</span><p>{c.boundary}</p></div>{labId?<SurpriseLabStatic labId={labId}/>:null}<p className="section-sources"><b>本机制依据：</b><Cites ids={c.sourceIds}/>{c.sourceNote}</p></section>;})}
 <section id="surprise-condition-map" className="lesson-section"><p className="section-kicker">CONDITIONAL UPDATE CHAIN · NOT A HEADLINE TRADING RULE</p><h2>Actual先相对一个可得代理成为更新，再经主体和市场成为价格。</h2><p>图中四卡不是必然按同方向运行的四阶段，而是四道可失败的证据门。只要对象、时钟、现金流/分母或订单机制缺一项，就把对应出口保留未知；不能用最后价格反推所有中间门都已成立。</p><SurpriseDiagram/></section>
 <section id="surprise-model-map" className="lesson-section"><p className="section-kicker">PROXY / VALUATION / RESEARCH CLAIM</p><h2>一个精确减号、一套条件估值和一个因果结论，是三种不同成品。</h2><div className="model-card-grid">
  <div><h3>代理层</h3><p>调查、模型或期货量先回答“相对谁”。形成、截止、公开和陈旧性决定它能否代表事件前信息。均值、中位和分歧不互换；A−F精确也不识别未观察条件平均。 <Cites ids={[2,4,5]}/></p></div>
  <div><h3>估值层</h3><p>更新可进入未来现金流、总所需回报、target和path。C6只证明分子改善不足以决定单期条件价格，交互不能漏；它不是现实股票、多期一般模型或无风险/风险补偿分解。 <Cites ids={[1,3,9]}/></p></div>
  <div><h3>研究层</h3><p>描述可报告代理差与窗口关联；结构因果还需并发消息、反向反馈和外生性设计；预测另需真正PIT训练/选择及OOS基线。教材审查不把三层压成一个总证书。 <Cites ids={[2,3,6,7]}/></p></div>
 </div></section>
 <section id="surprise-interactive-section" className="lesson-section surprise-interactive-only"><p className="section-kicker">INTERACTIVE M1–M10 · FIXED INDEPENDENT QUESTIONS</p><h2>先写清对象、参照和时钟，再选择中性数值。</h2><p>十题各自固定对应C的完整默认输入、护照与单位。ABC先只显示数值，选择后才显示当前候选诊断；改选立即替换旧解释。它们不跟随可编辑C，也不能拼成同一事件或资产路径。</p><SurpriseQuiz/></section>
 <section id="surprise-static-twins" className="lesson-section"><p className="section-kicker">STATIC K1–K10 / NATIVE / PRINT</p><h2>无脚本和纸上，仍保留同题、同选项和三条完整推理。</h2><p>每K与对应M共用同一固定题库、输入、护照、单位和ABC顺序。先独立手算，再展开正确路线和两条错路；错误数可能正确回答另一个问题，所以关键是指出偷换了哪个对象、版本、分母或时钟。</p><SurpriseStaticQuiz/></section>
 <section id="surprise-checks-glossary" className="lesson-section"><p className="section-kicker">UNDERSTANDING / INTEGRITY / GLOSSARY</p><h2>把“这个差到底量什么、还缺什么”变成可复核语言。</h2><div className="check-grid">{surpriseChecks.map((c,i)=><div key={c.question}><details><summary>{String(i+1).padStart(2,'0')} · {c.question}</summary><p>{c.answer} <Cites ids={c.sourceIds}/></p></details><p className="print-only"><b>{String(i+1).padStart(2,'0')} · {c.question}　答案：</b>{c.answer} <Cites ids={c.sourceIds}/></p></div>)}</div><div className="yield-fixture-audit"><span>有限契约／来源结构门（作者自检，非独立完整审批）</span><ul>{[...surpriseLabAudit,...surpriseScenarioAudit,...canonicalSurpriseAudit,...lesson323IntegrityAudit].map(a=><li key={a.key} className={a.passed?'passed':''}>{a.passed?'PASS':'FAIL'} · {a.key}</li>)}</ul></div><div className="term-grid">{surpriseGlossary.map(([term,meaning,confusion])=><article className="term-card" key={term}><h3>{term}</h3><p>{meaning}</p><em>不可混同：{confusion}</em></article>)}</div></section>
 <section id="surprise-evidence-boundaries" className="lesson-section"><p className="section-kicker">STATE / ACTUAL READING / INTERFACES</p><h2>保留真实版本和未知，不构造一个虚假的完整事件。</h2>
  <p>canonical有{canonicalSurpriseFields.length}个顶层字段；七输入各保留其真实默认对象身份。inputLineage为空，因为本课没有消费3.01或3.22数值校准。3.01真实版本{canonicalSurpriseStateExample.semanticPrerequisiteStates[0].revision}及其审稿记录保留；3.22真实版本{canonicalSurpriseStateExample.semanticPrerequisiteStates[1].revision}、canonical对象和批准正文钟{canonicalSurpriseStateExample.semanticPrerequisiteStates[1].producerMarker.value}也只作语义身份，不解释成某个公告的历史可得日。本课草稿准备钟为{canonicalSurpriseStateExample.clockState.draftPreparedAt}，注册钟为{canonicalSurpriseStateExample.clockState.registeredAt??'null（尚未注册网页）'}，完整正文批准钟为{canonicalSurpriseStateExample.clockState.ownReviewFrozenAt??'null（尚未完成同版双审）'}；三者都不能替代真实公告、收到、训练或选择钟。</p>
  <div className="precision-note"><span>canonical · {canonicalSurpriseStateExample.schemaVersion}</span><p><code>{canonicalSurpriseFields.join(', ')}</code>。真实宏观版本、调查panel、市场价格/订单、现金流、无风险/风险补偿、政策因子、PIT/OOS、因果和生产资格保持unknown/false；SYN中位差0、目标差+25或联合回报−29/11%只限各自题设。</p></div>
  <h3>生产者不变量</h3><ol className="contract-list">{surpriseInvariants.map((rule,i)=><li key={rule}><b>{String(i+1).padStart(2,'0')}</b><span>{rule}</span></li>)}</ol>
  <h3>编写者实际读过与尚未读过的原文</h3><p>Boyd–Jagannathan–Hu WP8092实际读原PDF3–12文字并真看原2；原1–2文字提取编码异常不冒称完整，13–41、2005期刊版、代码与数据未读/未复算，原文408与日期范围疑点保留未解。ABDV WP8959读原1–11并真看原8；未读12–38完整结果、2003AER版或取得MMS/Olsen底层资料。GSS FEDS2004-66读原1–8并真看原8；未读9–43及两Appendix，原2003案例的13bp期货测量不改名成本课调查式25bp。 <Cites ids={[1,2,3]}/></p><p>SPF实质FAQ与FRED实时区间Introduction/两组Examples实际读；未读SPF62页Documentation、下载完整调查/vintage或调用API。BLS只读CES修订首段及公布政策指定主要段，原生HTML下载403与官方工具正文表示分开，未读全部历史表/方法；BEA只读主要比较说明、目录与修改日，未下载XLSX或通读深化文献。Cochrane WP16972实际读原1–8文字，未读9–65、全图/表/代码或JF最终版。所有原件只链接官方页；阅读范围不是复现实证、PIT或全文背书。 <Cites ids={[4,5,6,7,8,9]}/></p>
  <h3 id="surprise-cross-interfaces">跨章接口</h3><div className="interface-grid">{surpriseInterfaces.map(([name,payload,guardrail])=><article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div><p>最后复盘同一条局部链：Actual相对哪个截止前代理形成什么更新，谁据此修订哪段现金流或总所需回报，持仓与流动性怎样把修订变成订单和价格，价格或政策怎样再改变下一轮信息。每一步分别标已观测、题设给定或未知，再把描述、因果、PIT/OOS和生产资格交给各自验证。</p>
 </section>
 </>;}

const lesson323Reviews:LessonRecord['reviews']=[
 {kind:'accuracy',completedAt:'2026-09-16T04:51:08.918Z',decision:'approved',revision:'3.23-r1',summary:'从头完整审查同一BODY-r3冻结正文、原典限定读页、公式、七C与十M/K、canonical及74页纸本；P1/P2/P3均为0。未认证现实事件、PIT/OOS、因果、收益、投资建议或生产资格。'},
 {kind:'pedagogy',completedAt:'2026-09-16T04:49:43.383Z',decision:'approved',revision:'3.23-r1',summary:'逐行审查全部3.23生产源并逐页目视74页；对象与时钟、SYN边界、教学链和纸本完整性通过，BODY-r2标题孤字与强制分页留白均关闭；P1/P2/P3均为0。'},
];
export const lesson323:LessonRecord={slug:'3-23',id:'3.23',chapter:'03',chapterTitle:'Macro State & Financial Conditions',title:'宏观意外：实际值、预期与价格更新',subtitle:'Macro Surprise — Actual vs Expectation：先匹配对象、版本、单位与时钟，再拆异质预期、消息包、现金流、总所需回报、政策target/path和市场反馈',readingTime:'主线与七C必要手算约75–105分钟；十M/K约20–35分钟，检查/术语/复盘约30–45分钟可第二遍学习。均是估时，原典深化另计，不靠凑字保证阅读时长',prerequisite:'Master写“6.01预览”；本节内置“价格对应未来条件而非当前事实”的最小语义预览，不虚构未出版6.01 producer。正式语义地基为3.01、3.22；按需调用T01/T03/T05/T08及Chapter1/2',updatedAt:'2026-09-15',revision:'3.23-r1',reviewStatus:'double-reviewed',reviews:lesson323Reviews,previous:{slug:'3-22',label:'3.22 Business Cycle vs Financial Cycle'},next:{label:'6.02–6.04 Belief Updating / Bias / Narrative'},sections:[{id:'thesis',label:'核心命题'},extras[0],...surpriseConcepts.map(({id,label})=>({id,label})),...extras.slice(1)],Content:Lesson323Content,references:lesson323References,readingList:lesson323ReadingList,readingListOrder:'source'};
