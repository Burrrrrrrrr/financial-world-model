import ExchangeRateLabStatic from '../components/ExchangeRateLabStatic';
import '../components/ExchangeRatePrint.css';
import ExchangeRateQuiz from '../components/ExchangeRateQuiz';
import ExchangeRateStaticQuiz from '../components/ExchangeRateStaticQuiz';
import ExchangeRateScopeDiagram from '../components/ExchangeRateScopeDiagram';
import {exchangeRateLabs,exchangeRateLabAudit} from '../components/exchangeRateLabDefinitions';
import {exchangeRateScenarios,exchangeRateScenarioAudit} from '../components/exchangeRateScenarios';
import {exchangeRateConcepts,exchangeRateThesis} from './exchangeRateConcepts';
import {lesson320References,lesson320ReadingList} from './exchangeRateReferences';
import {exchangeRateChecks,exchangeRateGlossary,exchangeRateInvariants,exchangeRateInterfaces} from './exchangeRateStudy';
import {canonicalExchangeRateStateExample,canonicalExchangeRateFields,canonicalExchangeRateAudit} from './exchangeRateState';
import type {LessonRecord} from './types';
import type {ExchangeRateLabId} from '../components/exchangeRateLabDefinitions';
export {canonicalExchangeRateStateExample,canonicalExchangeRateFields,canonicalExchangeRateAudit} from './exchangeRateState';
function Cites({ids}:{ids:readonly number[]}){return <>{ids.map(id=><a key={id} href={`#ref-${id}`}>[{id}] </a>)}</>;}
const extraSections=[{id:'scope-route',label:'阅读／报价／日期护照'},{id:'exchange-scope-map',label:'四种对象与反馈'},
 {id:'model-map',label:'对账／条件模型／识别'},{id:'interactive-lab',label:'Interactive M1–M10'},
 {id:'exchange-static-twins',label:'Static K1–K10'},{id:'checks-glossary',label:'Checks / Audit / Glossary'},
 {id:'evidence-boundaries',label:'State / Sources / Interfaces'}];
const sectionIds=['thesis',...exchangeRateConcepts.map(c=>c.id),...extraSections.map(s=>s.id)];
const sourceIds=new Set(lesson320References.map(r=>r.id));
const citations=[...exchangeRateConcepts.flatMap(c=>c.sourceIds),...exchangeRateLabs.flatMap(l=>l.sourceIds),
 ...exchangeRateScenarios.flatMap(s=>s.sourceIds),...exchangeRateChecks.flatMap(c=>c.sourceIds)];
export const lesson320IntegrityAudit=[
 {key:'27 single-mechanism editorial units, three paragraphs and explicit source/conditions each',passed:exchangeRateConcepts.length===27&&exchangeRateConcepts.every(c=>c.paragraphs.length===3&&c.paragraphs.every(p=>p.length>=90)&&c.boundary.length>=30&&c.sourceNote.length>=20&&c.sourceIds.length>0)},
 {key:'all section IDs unique; seven actual C labs attached once and only once',passed:new Set(sectionIds).size===sectionIds.length&&exchangeRateConcepts.flatMap(c=>c.labIds??[]).length===7&&new Set(exchangeRateConcepts.flatMap(c=>c.labIds??[])).size===7&&exchangeRateConcepts.flatMap(c=>c.labIds??[]).every(id=>exchangeRateLabs.some(l=>l.id===id))},
 {key:'eight primary references with actual reading scope and eight deeper routes; citation IDs valid',passed:lesson320References.length===8&&lesson320ReadingList.length===8&&citations.every(id=>sourceIds.has(id))&&lesson320References.every(r=>r.use.length>=60&&r.url.startsWith('https://'))},
 {key:'20 checks,40 decoded terms,16 invariants and eight cross-chapter interfaces',passed:exchangeRateChecks.length===20&&exchangeRateGlossary.length===40&&exchangeRateInvariants.length===16&&exchangeRateInterfaces.length===8},
 {key:'finite source-contract audits all pass; these do not supply independent approval',passed:[...exchangeRateLabAudit,...exchangeRateScenarioAudit,...canonicalExchangeRateAudit].every(a=>a.passed)},
] as const;
function Lesson320Content(){return <>
 <noscript><style>{'.lesson-page[data-lesson-id="3.20"] .exchange-rate-interactive-only,.lesson-page[data-lesson-id="3.20"] #interactive-lab{display:none!important}'}</style><p>脚本已关闭：七个C的固定输入、完整结果与手算，K1–K10三个候选及三条诊断、机制图、引用仍可原生阅读。请展开对应固定记录；打印另直接保留全部答案。</p></noscript>
 <section id="thesis" className="lesson-section"><p className="section-kicker">ONE CENTRAL MECHANISM · RELATIVE DATED CLAIMS</p><h2>汇率把不同币种的有日期支付连接起来，报价又反过来改变这些支付。</h2>{exchangeRateThesis.map(p=><p key={p}>{p}</p>)}<p className="section-sources"><Cites ids={[1,2,3,4,5]}/></p></section>
 <section id="scope-route" className="lesson-section"><p className="section-kicker">READING / QUOTATION / DATE / UNIT PASSPORT</p><h2>先锁观察者、币种与日期，再比较利率、价格和资金。</h2>
 <p>Master先修是3.07–3.08：期限结构与名义／实际索赔权的分解，进入跨币种比较后不能被一句“利差扩大”抹掉。遇到回报、复利、期望、会计和历史数据时，按需回查T01/T02/T03/T05/T06/T08；不要求先补完国际金融。3.19是上一节和语义背景，不是本节汇率数值生产者。正文27个机制单元只是同一个Subchapter内部的编辑结构，没有给目录另加27个小章节。</p>
 <p>本币和外币相对于当前观察者定义，例子不默认人民币／美元。S始终表示本币／一单位外币；S上升是本币名义贬值，1/S上升才是本币相对币值提高。S_t是指定现货条件的报价，F_t,T是今天约定到T兑换的远期合约价，S_T是未来才实现的随机现货，E_t[S_T]是给定今天信息的条件期望。单位相同不代表支付权利和时钟相同。 <Cites ids={[1,2,5,6]}/></p>
 <p>报价控件使用“报价乘100”的整数网格，输入700=7.00、1030=10.30；这里的百分刻度不是报价上涨700%或1030%。回报控件用整数基点：100基点=1个百分点，400=4%的整个同一持有期简单净回报，不是未经换算的政策年率；G=1+r是总回报因子。概率50=题设给定50%，不是市场测得风险概率。C5价格控件是各国各自同口径正指数，不是同一篮子在两种货币中的绝对价格。所有整数域只是教学精度与有限显示范围，不是市场tick、法定价格或经济可行域。</p>
 <p>SYN表示独立合成教学合同、账或条件情景。七个C不属于共同国家路径：C4基线与新条件共享估值t、到期T和持有期，不是连续交易；C6是两日期的固定原币资产负债重估；C7是同一付款日的两种替代换算报价。各自结果不会自动成为另一实验输入。精确代数公式、有限浮点运算与显示舍入分别保留；log比值乘100只叫百分log刻度，不能直接冒称普通简单收益百分比。</p>
 <p>抛补利率平价（CIP，covered interest parity）比较今天就用远期覆盖汇率的同到期路线；未抛补利率平价（UIP，uncovered interest parity）涉及未锁汇的未来收益与模型预期，不是无风险套利。π在本课专指外币投资的预期本币简单回报减本币回报；Engel–West原文ρ是其log式的UIP偏离，二者不因共用“风险溢价”名称就逐值兼容。真实风险厌恶、信息误差和政策因果仍需独立证据。 <Cites ids={[1,2]}/></p>
 <div className="precision-note"><span>审稿状态：同版完整正文已通过两位独立审稿人复核</span><p>准确性与教学审稿者分别对同一冻结完整正文给出APPROVE；七组SYN、十组同题M/K、20条错误路径、来源读取边界、无脚本与打印体验均已复核，另有当前71页整版布局PASS。审批限于本课机制与给定教学合同，不认证真实套利、币值高低估、国家安全、历史PIT、政策因果、预测、福利或具体法律。作者自检不是两位审批，正文批准时钟与本次包装时间分别保存。</p></div>
 <p>来源机构先解码：国际清算银行（BIS，Bank for International Settlements）、欧洲中央银行（ECB，European Central Bank）和国际货币基金组织（IMF，International Monetary Fund）分别提供所列文章、演讲与统计定义，不为本课SYN或交易判断背书。BPM7是第七版国际收支与国际投资头寸综合手册（Integrated Balance of Payments and International Investment Position Manual）的所列白皮预编辑版；一价定律（LOP，law of one price）与购买力平价（PPP，purchasing power parity）分别涉及同商品条件和相匹配篮子的购买力关系，不能由报价定义自动得到。 <Cites ids={[1,3,5,6,7]}/></p>
 <p>后文简称也先解码：国际收支（BOP，balance of payments）量期间居民—非居民交易；国际投资头寸（IIP，international investment position）量参考日外部金融存量。CA是经常账户（current account），KA是资本账户（capital account），FA是按注明方向记的金融账户（financial account）；俗称“资本流”不全属于KA。消费价格指数（CPI，consumer price index）各自基期100不是共同篮子货币成本；名义／实际有效汇率（NEER，nominal effective exchange rate／REER，real effective exchange rate）是多币种加权指数，本课双边qIndex不是BIS重算器。PIT（point-in-time）则要求历史时点实际可得版本，当前下载旧文不自动证明当年输入版本。 <Cites ids={[5,7,8]}/></p>
 </section>
 {exchangeRateConcepts.map((c,i)=><section id={c.id} key={c.id} className="lesson-section"><p className="section-kicker">{String(i+1).padStart(2,'0')} · CORE MECHANISM</p><h2>{c.title}</h2>{c.paragraphs.map(p=><p key={p}>{p}</p>)}{c.formula?<div className="equation-card"><span>澄清对象的必要算式</span><div><code>{c.formula.expression}</code></div><p>{c.formula.explanation}</p></div>:null}<div className="precision-note"><span>成立条件、反例与跨章接口</span><p>{c.boundary}</p></div>{c.labIds?.map(id=><ExchangeRateLabStatic key={id} labId={id as ExchangeRateLabId}/>)}<p className="section-sources"><b>本机制依据：</b><Cites ids={c.sourceIds}/>{c.sourceNote}</p></section>)}
 <section id="exchange-scope-map" className="lesson-section"><p className="section-kicker">ONE RELATIVE PRICE / DISTINCT OBJECTS · CONCEPTUAL</p><h2>每个相连对象需要自己的证据，才不会把条件算式变成万能预测。</h2><p>同一报价首先翻译币种和日期，再进入covered或未对冲收益；贸易收付和外币资产负债表改变不同主体的净暴露，持有与套保经执行约束进入报价，报价又反馈支付和预期。图中的行为箭头是待观察的机制连接，不是四个必然先后发生的事件，更不是七个SYN被拼成一条真实轨迹。</p><ExchangeRateScopeDiagram/></section>
 <section id="model-map" className="lesson-section"><p className="section-kicker">IDENTITY / CONDITIONAL MODEL / IDENTIFIED EFFECT</p><h2>会计闭合、回价闭合和现实行为，不属于同一层证据。</h2><div className="evidence-map"><div><h3>定义与条件对账</h3><p>报价倒数、金额翻译、固定原币重估和BPM7记录限制帮助锁对象。C2的理想CIP另需同到期支付与可执行融资套保条件。闭合不证明有成交现金，也不让国际收支恒等式独立给出汇率方向。 <Cites ids={[1,5,6]}/></p></div><div><h3>给定预期的条件模型</h3><p>C3先按状态处理简单、log与倒数，C4从另定义π的简单收益限制反解S。未来期望、外币回报和π都是题设，不是现实估计；正分母是数学域，不是一般均衡存在、无穷期条件或真实可交易性证明。 <Cites ids={[2]}/></p></div><div><h3>现实识别与研究</h3><p>政策消息、组合流与贷款选择须有真实时钟、版本和替代解释。来源里的历史相关或模型识别不被本课移植为因果系数；BIS指数、PPP和近随机游走也不单独认证预测效果。 <Cites ids={[2,3,4,7,8]}/></p></div></div><p>复杂地图的价值在于明确下一条证据该找谁，而不是把所有因素压成一个不可证伪标签。若尚不知道消息改变了预期终点、风险条件还是资金权限，就保持这些入口未识别；不要用“基本面”或“资金推动”把中间桥藏起来。</p></section>
 <section id="interactive-lab" className="lesson-section"><p className="section-kicker">INTERACTIVE M1–M10</p><h2>先选择正在量的对象，再从中性数值中作答。</h2><p>十题各保留对应C的完整输入和成立护照，三个候选初始只显示数值与单位，正确位置分散。作答后才显示当前候选的推理，重新选择立即换成新诊断；题库与K共享实际ABC排列。错误数值来自明确误接：正反报价、净／总回报、状态变换、条件终点、指数分母、权益水平或漏扣付款，不是随意加减一点。</p><ExchangeRateQuiz/></section>
 <section id="exchange-static-twins" className="lesson-section"><p className="section-kicker">STATIC K1–K10 / NATIVE / PRINT</p><h2>关掉脚本或在纸上，也能完整重建三条推理。</h2><p>先手算并注明币种、日期和单位，再展开答案。每题ABC顺序与M完全相同，原生折叠保留正确理由与两条错路径；打印直接保留全部诊断。某个错数能在另一个问题成立，并不让原问题中被漏掉的分母、价格门或费用消失。</p><ExchangeRateStaticQuiz/></section>
 <section id="checks-glossary" className="lesson-section"><p className="section-kicker">CHECKS / INTEGRITY / GLOSSARY</p><h2>能解释还缺什么，才是真正把汇率放回系统。</h2><div className="check-grid">{exchangeRateChecks.map((c,i)=><div key={c.question}><details><summary>{String(i+1).padStart(2,'0')} · {c.question}</summary><p>{c.answer} <Cites ids={c.sourceIds}/></p></details><p className="print-only"><b>{String(i+1).padStart(2,'0')} · {c.question}　答案：</b>{c.answer} <Cites ids={c.sourceIds}/></p></div>)}</div><div className="yield-fixture-audit"><span>有限来源完整性与契约检查（不是独立审批）</span><ul>{[...exchangeRateLabAudit,...exchangeRateScenarioAudit,...canonicalExchangeRateAudit,...lesson320IntegrityAudit].map(a=><li key={a.key} className={a.passed?'passed':''}>{a.passed?'PASS':'FAIL'} · {a.key}</li>)}</ul></div><div className="term-grid">{exchangeRateGlossary.map(([term,meaning,confusion])=><article className="term-card" key={term}><h3>{term}</h3><p>{meaning}</p><em>不可混同：{confusion}</em></article>)}</div></section>
 <section id="evidence-boundaries" className="lesson-section"><p className="section-kicker">STATE / ACTUAL READING / RESEARCH / INTERFACES</p><h2>最终状态保存条件、时钟与未知，不制造全能汇率答案。</h2>
 <p>canonical有{canonicalExchangeRateFields.length}个顶层字段，七组输入保留各自原始身份和结果。现有3.07与3.08实际导出已登记课程的版本和审稿记录，却没有可引用的已实例化canonical数值生产者；因此本课inputLineage为空，数值生产者和批准marker均不虚构。实际先修元数据只作语义身份，不是数值校准。登记{canonicalExchangeRateStateExample.scopePassport.registeredAt}只记录本课建立时钟，不认证历史市场信息可得。</p>
 <div className="precision-note"><span>canonical · {canonicalExchangeRateStateExample.schemaVersion}</span><p><code>{canonicalExchangeRateFields.join(', ')}</code>。现货翻译、covered、未对冲、条件回价、价格指数、贸易净现金与固定资产负债重估分别存放；真实持仓、资金、干预、制度、政策响应、因果、预测和福利保留未知，不从默认SYN输出填出完整国家。</p></div>
 <h3>生产者不变量</h3><ol className="contract-list">{exchangeRateInvariants.map((r,i)=><li key={r}><b>{String(i+1).padStart(2,'0')}</b><span>{r}</span></li>)}</ol>
 <h3>实际读过的原文与尚未读取的边界</h3>
 <p>BIS2016四作者CIP季度文章20页全部文字已读，原PDF4–5报价与BoxA实际看过；图表、回归和所引论文未逐项复现。它不是五作者2018修订WP590，原文Libor也不是当前操作指令。Kearns–Patel金融／贸易渠道19页只实读1–5的完整文字；后续结果、表和Appendix待读。本课七个数值例子均另设，不偷取文章回归作现实参数。 <Cites ids={[1,4]}/></p>
 <p>Engel–West当前作者托管发表排版33页实际读PDF1–14全部文字，覆盖前瞻直觉与SectionIII模型，原8–9公式实际看过；15–33实证、完整Appendix和原数据尚未由作者通读或复算。其logρ、near-unit折现限制及no-bubbles条件不能被简单回报π或有限两状态替代。ECB依据是2017年11月3日《Monetary policy, exchange rates and capital flows》官方完整正文和脚注，不是该页脚注所引7月另一场演讲；所引研究和幻灯片未全部取得，演讲明确的tentative证据也不被本课升级为因果认证。 <Cites ids={[2,3]}/></p>
 <p>BPM7是March2025白封面预编辑版1076页，实际只读列明版本页、PDF50–59的chapter2.1–2.28及2.29开头，303–309的6.69–6.91，345–348的8.1–8.15，363–366的9.7–9.13与完整Box9.1文字。作者没通读全部手册、Annex或具体法律，表图也不是全部原图复现。账户定义、IIP重估和储备分类支持局部桥接，不认证各国历史已统一采用新版或当局实际干预能力。 <Cites ids={[5]}/></p>
 <p>Catão2007官方旧PDF《Why Real Exchange Rates?》与Callen／Jahan更新选编两页实际完整文字、公式侧栏、署名和页脚已读；后者图题及图内提取文字已读，图数据与完整ICP／WEO方法未取得。BIS当前EER的About、Metadata、Methodology摘要、Glossary与全部FAQ已读，没有下载底层指数／完整权重或读完2006方法论文。不把当前HTML迁移题名、基年或更新时间当原出版身份、全部历史版本或PIT证据。 <Cites ids={[6,7,8]}/></p>
 <p>每个人的读取、独立计算和视觉范围分别保留；来源准备不是机构背书，作者自检不是两位审批，局部公式正确也不是现实机制已识别。原件只作私有阅读证据，网页链接官方入口与范围，不发布版权全文镜像。当前取得的旧年文件不能自动认证首次公开版本；此课未导入国家账户、CPI、汇率、政策意外、调查预期、可成交买卖价或银行数据，所有数值都是声明的独立SYN。</p>
 <h3>把开放地图缩成可以验证的问题</h3><p>例如固定“某币种对的政策消息，是否在预先定义窗口内带来报价修订”。先锁S方向、观察者、事件、估值t和目标终点T，再区分公布全量与相对此前预期的意外；把预期短率、期限风险、国外消息和已有资金条件作为替代解释，而不是见加息就命名升值因果。若做预测，应另固定目标收益、当时可得版本、滚动估计、随机游走／简单基线及成本；如果只是做covered残差，则保存实际可执行借贷与套保价。三种研究量不同，不能互相改名。</p>
 <h3 id="exchange-cross-interfaces">跨章接口</h3><div className="interface-grid">{exchangeRateInterfaces.map(([name,payload,guardrail])=><article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}</p><p><b>不可跨越：</b>{guardrail}</p></article>)}</div><p>结束时用一条完整链解释：消息先改变谁的哪种未来支付与约束，主体如何重选持有和套保，报价与成交如何经过承接机制变化，新报价又如何进入外币账、贸易选择、资金和政策反馈。每次都分别问“定义恒等式、条件收益模型还是待识别现实箭头”；理解汇率不是给世界贴分数，而是知道哪一条中间桥仍需要证据。</p>
 </section>
 </>;}
export const lesson320:LessonRecord={slug:'3-20',id:'3.20',chapter:'03',chapterTitle:'Macro State & Financial Conditions',
 title:'Exchange Rate 的宏观基础：相对支付、预期收益与资金反馈',
 subtitle:'从报价与交付日期连接covered和未对冲收益，分清预期终点、政策路径、价格篮子、贸易发票及币种错配，再追组合需求如何经执行约束反馈汇率',
 readingTime:'正文主线约55–75分钟；C1–C7手算与交互约25–45分钟；M/K十题约20–35分钟，检查／术语与复盘约25–40分钟。均为学习估时，不靠填字凑时长；原典深化另计',
 prerequisite:'Master：3.07–3.08；按需T01/T02/T03/T05/T06/T08。先修是实际语义与课程元数据，不虚构canonical数值生产者；3.19只作背景',
 updatedAt:'2026-09-15',revision:'3.20-r1',reviewStatus:'double-reviewed',reviews:[{kind:'accuracy',completedAt:'2026-09-15',decision:'approved',revision:'3.20-r1',summary:'完整同版机制、八来源与读取边界已核；本人重跑48,804/48,804有理／整数域案例、161契约与255纸本文本检查，30候选／20错路无阻断。批准教材，不认证真实市场、套利、PIT或因果预测。'},{kind:'pedagogy',completedAt:'2026-09-15',decision:'approved',revision:'3.20-r1',summary:'完整同版教学与三项分页修订已核；本人原版312源级与新版141真实浏览器回归通过，七C、十M/K、中性当前反馈、键盘、390px、无脚本和纸本可读。旧目录比较器误报记录保留；未认证系统读屏或PDF/UA。'}],
 previous:{slug:'3-19',label:'3.19 Sovereign Debt & Fiscal Sustainability'},next:{label:'3.21 Capital Flow 的国内入口'},
 sections:[{id:'thesis',label:'核心命题'},extraSections[0],...exchangeRateConcepts.map(({id,label})=>({id,label})),...extraSections.slice(1)],
 Content:Lesson320Content,references:lesson320References,readingList:lesson320ReadingList,readingListOrder:'source'};
