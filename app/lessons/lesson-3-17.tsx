import FiscalLabStatic from '../components/FiscalLabStatic';
import FiscalPathChart from '../components/FiscalPathChart';
import FiscalQuiz from '../components/FiscalQuiz';
import FiscalStaticQuiz from '../components/FiscalStaticQuiz';
import { fiscalC1, fiscalC2, fiscalC3, fiscalC4, fiscalC5, fiscalC6, fiscalC7, fiscalCanonicalResults, fiscalFixtureAudit } from '../components/fiscalPolicyFixtures';
import { fiscalLabAudit, fiscalLabs } from '../components/fiscalLabDefinitions';
import { fiscalScenarioAudit, fiscalScenarios } from '../components/fiscalPolicyScenarios';
import { canonicalHousingCollateralStateExample, lesson316 } from './lesson-3-16';
import { fiscalConcepts } from './fiscalPolicyConcepts';
import { fiscalChecks, fiscalGlossary, fiscalInterfaces, fiscalInvariants } from './fiscalPolicyStudyTools';
import { lesson317ReadingList, lesson317References } from './lesson-3-17-sources';
import type { LessonRecord } from './types';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map((id) => <a className="citation-mark" href={`#ref-${id}`} aria-label={`参考文献${id}`} key={id}>[{id}]</a>)}</>;
}

const producerPaths = ['stateId','schemaVersion','scopePassport','inheritedContractState','stressState','householdDistributionState','feedbackState','evidenceState','boundaryRoutes'] as const;
const registrationAt = '2026-09-15T14:39:57Z';
export const canonicalFiscalPolicyStateExample = {
  schemaVersion:'fiscal-policy-mechanism-state-v1', stateId:'SYNTHETIC_REGISTERED_FISCAL_POLICY_STATE',
  scopePassport:{ subjectId:'SYN-FISCAL-INDEPENDENT-EXPERIMENT-REGISTRY', country:'synthetic-no-jurisdiction', currency:'SYN', scenarios:[{id:'C1',subject:'one-period-incremental-accounting'},{id:'C2',subject:'100-households-transfer-uses'},{id:'C3',subject:'unchanged-rules-and-new-law-comparison'},{id:'C4',subject:'finite-versus-infinite-conditional-feedback'},{id:'C5',subject:'three-period-ratio-definitions'},{id:'C6',subject:'four-period-synthetic-response-convolution'},{id:'C7',subject:'local-additional-capacity-diagnostic'}], noCommonCountryOrHouseholdTrajectory:true, registeredAt:registrationAt },
  inputLineage:[{ producerLesson:'3.16', producerRevision:lesson316.revision, producerStateId:canonicalHousingCollateralStateExample.stateId, producerRevisionMarker:canonicalHousingCollateralStateExample.clockState.ownReviewFrozenAt, relation:'direct-contextual-import-only', numericCalibration:false, mappings:producerPaths.map((path)=>({sourcePath:path,targetPath:`upstreamHousingCollateralState.${path}`})) }],
  upstreamHousingCollateralState:canonicalHousingCollateralStateExample,
  clockState:{ informationCutoff:registrationAt, scenarioRegistrationSnapshot:registrationAt, ownReviewFrozenAt:'2026-09-15T15:20:11.993Z', fiscalPeriods:'synthetic-equal-frequency-indexed-from-zero-not-calendar-years', modelRounds:'not-mapped-to-calendar-periods', announcementAt:null, legislationAt:null, deliveredAt:null, paidAt:null, realPolicyDataAvailableAt:null },
  unitContract:{ c1:'same-period-signed-SYN-accounting-differences-not-budget-levels', c2:'SYN-currency-for-100-synthetic-households-in-one-period', c3:'same-period-SYN-income-and-transfer-levels', c4:'fixed-price-SYN-model-output-per-iteration-not-a-calendar-flow-series', c5:'same-frequency-real-SYN-period-flow-not-SAAR', c6:'positive-real-SYN-period-levels-and-nonannualized-growth-gap-percentage-points', c7:'declared-additional-real-SYN-domestic-demand-and-capacity', chainWeightsUsed:false, syntheticParametersAreEstimated:false },
  interventionPassport:{ instruments:['delivered-purchase','cash-transfer','tax-revenue-change'], governmentLevel:null, geographicScope:null, duration:null, beneficiaries:null, taxpayers:null, fundingSource:null, realPolicyAnnouncedAmount:null, realPolicyExecutedAmount:null },
  accountingState:{ input:fiscalC1, result:fiscalCanonicalResults.c1, transferDirectGDPEntry:0, zeroInterestChangeDeclared:true, otherFiscalItemsExcluded:true, observedCausalOutputResponse:null },
  transferAllocationState:{ groups:fiscalC2, result:fiscalCanonicalResults.c2, financialAssetAccumulationIsAllOfficialPersonalSaving:false, consumptionSharesEstimated:false, oldContractPaymentAutomaticallyRecast:false },
  automaticRuleState:{ input:fiscalC3, result:fiscalCanonicalResults.c3, eligibilityTransferIncreaseIsDeclaredNotEstimated:true, unchangedRulesRemainInNoNewLawBaseline:true },
  discretionaryState:{ fixedScenarioNewTransfer:0, separateNewLawExample:2, discretionaryImpliesExogenous:false, realPolicyShock:null },
  counterfactualState:{ c6Baseline:fiscalC6.baselineLevels, includesTheseImpulseEffects:false, isPotentialGDP:false, isObservedAlternativeHistory:false, isHistoricalPIT:false, realEstimatedBaseline:null },
  firmResourceState:{ additionalOrders:null, inventoryDelivery:null, newProduction:null, privateSalesDisplacement:null, workingCapitalAvailable:null, actualDeliveryCapacity:null },
  teachingLoopState:{ input:fiscalC4, result:fiscalCanonicalResults.c4, multiplierLabels:'infinite-model-limit-distinct-from-N-round-total', domain:'0<=q<1-in-this-experiment-only', fixedPriceAndInterest:true, empiricalModelEligibility:false },
  multiplierPathState:{ input:fiscalC5, result:fiscalCanonicalResults.c5, cumulativeDefinition:'lesson-defined-undiscounted-matched-window-not-IMF-Box1-original', empiricalMultiplier:null },
  laggedResponseState:{ input:fiscalC6, result:fiscalCanonicalResults.c6, baselineDoubleCountingStops:true, responseKernelEstimated:false, extrapolationAfterDeclaredKernel:'zero-only-by-teaching-contract' },
  capacityDiagnosticState:{ input:fiscalC7, result:fiscalCanonicalResults.c7, actualOutputIsMinDemandCapacity:false, isPotentialGDPPhysicalCap:false },
  privateExpectationState:{ futureTaxBurden:null, policyCredibility:null, borrowingConstraintBinding:null, ricardianEquivalenceAssumedForAllHouseholds:false },
  tradeState:{ productionGeography:null, actualImportResponse:null, exchangeRateResponse:null, domesticForeignSpillback:null },
  identificationState:{ automaticIsExogenous:false, cyclicallyAdjustedIsExogenous:false, residualIsStructuralShock:false, realFiscalNewsSeries:null, institutionalRestrictionsVerifiedForNewSample:false, narrativeDatabaseBuilt:false, localEstimateIsNationalMultiplier:false },
  feedbackState:{ incomeTaxBase:'conditional-mechanism-not-estimated', taxRevenueResponse:null, automaticTransferResponse:null, realMonetaryResponse:null, postTreatmentStateIsPredetermined:false, announcedMarketMoveIsGDPResponse:false },
  financingState:{ grossFiscalCost:null, taxRevenueFeedback:null, interestCost:null, netFiscalCost:null, primaryBalancePath:null, sovereignDebtSafety:null, largerGDPImpliesSelfFinancing:false },
  outputWelfareState:{ realCausalGDPPath:null, employmentResponse:null, householdWelfare:null, projectServiceValue:null, distributionalEffect:null, GDPImpliesWelfareImprovement:false, policyRanking:null },
  evidenceState:{ arithmetic:'synthetic-audited', observedMacroDatasetImported:false, causalStatus:'not-identified', forecastStatus:'not-estimated', historicalPIT:false, crisisProbability:null, bpReadingVersion:'April2001-author-method-sections-not-final-equivalence', rameyQJEReadingScope:'final-pages-1-to-5-only', imfReadingScope:'root-full-text-33-pages-not-policy-endorsement' },
  dynamicDataPassports:[],
  boundaryRoutes:[{destination:'3.18',payload:'conditional fiscal path and monetary-financing response',guardrail:'requires-a-joint-policy-regime-not-fixed-interest-universalization'},{destination:'3.19',payload:'gross-net cost, primary balance and financing clocks',guardrail:'no-sovereign-safety-inferred-from-GDP-multiplier'},{destination:'7.24–7.26',payload:'treatment, counterfactual, news, units, vintage and identification',guardrail:'synthetic-path-or-current-source-reading-is-not-historical-PIT-causal-evidence'}],
} as const;

export const canonicalFiscalPolicyStateFields = ['schemaVersion','stateId','scopePassport','inputLineage','upstreamHousingCollateralState','clockState','unitContract','interventionPassport','accountingState','transferAllocationState','automaticRuleState','discretionaryState','counterfactualState','firmResourceState','teachingLoopState','multiplierPathState','laggedResponseState','capacityDiagnosticState','privateExpectationState','tradeState','identificationState','feedbackState','financingState','outputWelfareState','evidenceState','dynamicDataPassports','boundaryRoutes'] as const satisfies readonly (keyof typeof canonicalFiscalPolicyStateExample)[];
const state=canonicalFiscalPolicyStateExample;
function resolvePath(object:unknown,path:string):{found:boolean;value?:unknown} {
  let value=object;
  for(const segment of path.split('.')) { if(typeof value!=='object'||value===null||!Object.prototype.hasOwnProperty.call(value,segment))return{found:false}; value=(value as Record<string,unknown>)[segment]; }
  return{found:true,value};
}
function sameMapping(source:unknown,target:unknown,a:string,b:string) { const x=resolvePath(source,a),y=resolvePath(target,b);return x.found&&y.found&&x.value!==undefined&&y.value!==undefined&&Object.is(x.value,y.value); }
export const canonicalFiscalPolicyStateAudit = [
  {key:'all 27 canonical fields covered exactly without silent extra keys',passed:Object.keys(state).length===27&&canonicalFiscalPolicyStateFields.length===27&&new Set(canonicalFiscalPolicyStateFields).size===27&&canonicalFiscalPolicyStateFields.every((key)=>Object.prototype.hasOwnProperty.call(state,key))},
  {key:'sole direct 3.16 contextual producer, not numerical fiscal calibration',passed:state.inputLineage.length===1&&state.inputLineage[0].producerRevision===lesson316.revision&&state.upstreamHousingCollateralState===canonicalHousingCollateralStateExample&&!state.inputLineage[0].numericCalibration},
  {key:'nine producer paths preserve primitive or object identity',passed:state.inputLineage[0].mappings.length===9&&state.inputLineage[0].mappings.every(({sourcePath,targetPath})=>sameMapping(canonicalHousingCollateralStateExample,state,sourcePath,targetPath))},
  {key:'missing mapping, wrong path and equal clone fail identity bridge',passed:!sameMapping(canonicalHousingCollateralStateExample,state,'__missing__','upstreamHousingCollateralState.stateId')&&!sameMapping(canonicalHousingCollateralStateExample,state,'scopePassport','upstreamHousingCollateralState.evidenceState')&&!sameMapping({a:{x:1}},{b:{x:1}},'a','b')},
  {key:'producer approved-body revision clock no later than this registration cutoff',passed:Date.parse(state.inputLineage[0].producerRevisionMarker)<=Date.parse(state.clockState.informationCutoff)&&state.clockState.informationCutoff===state.scopePassport.registeredAt},
  {key:'seven independent synthetic scopes; C2 exactly 100 households',passed:state.scopePassport.scenarios.map(({id})=>id).join('|')==='C1|C2|C3|C4|C5|C6|C7'&&state.scopePassport.noCommonCountryOrHouseholdTrajectory&&state.transferAllocationState.result.households===100&&state.transferAllocationState.groups===fiscalC2},
  {key:'fiscal accounting, household uses and realized output kept separate',passed:state.accountingState.result.outputAccountingChange===10&&state.accountingState.result.primaryDeficitChange===10&&state.accountingState.transferDirectGDPEntry===0&&state.accountingState.observedCausalOutputResponse===null&&!state.transferAllocationState.financialAssetAccumulationIsAllOfficialPersonalSaving&&!state.transferAllocationState.oldContractPaymentAutomaticallyRecast},
  {key:'automatic five, no new law zero, separate discretionary two not exogenous',passed:state.automaticRuleState.result.automaticDeficitIncrease===5&&state.automaticRuleState.result.noNewPolicyDisposable===75&&state.discretionaryState.fixedScenarioNewTransfer===0&&state.discretionaryState.separateNewLawExample===2&&!state.discretionaryState.discretionaryImpliesExogenous},
  {key:'finite rounds, matched-window ratios and nonannualized growth retain units',passed:state.teachingLoopState.input===fiscalC4&&state.multiplierPathState.input===fiscalC5&&state.multiplierPathState.result.cumulativeWindowEndIndex===2&&state.laggedResponseState.input===fiscalC6&&!state.unitContract.syntheticParametersAreEstimated&&!state.unitContract.chainWeightsUsed},
  {key:'synthetic counterfactual not potential GDP, duplicate treatment rejected',passed:state.counterfactualState.c6Baseline===fiscalC6.baselineLevels&&!state.counterfactualState.isPotentialGDP&&!state.counterfactualState.includesTheseImpulseEffects&&state.laggedResponseState.baselineDoubleCountingStops&&!state.laggedResponseState.responseKernelEstimated},
  {key:'capacity diagnostic four; actual quantities and welfare remain unknown',passed:state.capacityDiagnosticState.result.capacityGap===4&&state.capacityDiagnosticState.result.actualOutput===null&&state.capacityDiagnosticState.result.inflation===null&&!state.capacityDiagnosticState.actualOutputIsMinDemandCapacity&&state.outputWelfareState.householdWelfare===null&&state.financingState.sovereignDebtSafety===null},
  {key:'no observed dataset, historical PIT, causal estimate, forecast or national bridge implied',passed:state.dynamicDataPassports.length===0&&!state.evidenceState.observedMacroDatasetImported&&!state.evidenceState.historicalPIT&&state.evidenceState.causalStatus==='not-identified'&&state.evidenceState.forecastStatus==='not-estimated'&&!state.identificationState.localEstimateIsNationalMultiplier&&state.evidenceState.crisisProbability===null},
] as const;

const referenceIds=new Set(lesson317References.map(({id})=>id));
const sectionIds=['thesis','scope-route',...fiscalConcepts.map(({id})=>id),'method-comparison','response-map','interactive-lab','fiscal-static-twins','checks-glossary','evidence-boundaries'];
const citations=[...fiscalConcepts.flatMap(({sourceIds})=>sourceIds),...fiscalLabs.flatMap(({sourceIds})=>sourceIds),...fiscalScenarios.flatMap(({sourceIds})=>sourceIds),...fiscalChecks.flatMap(({sourceIds})=>sourceIds)];
export const lesson317IntegrityAudit = [
  {key:'27 single-mechanism units, three coherent sourced paragraphs and boundary each',passed:fiscalConcepts.length===27&&fiscalConcepts.every(({paragraphs,sourceIds,boundary})=>paragraphs.length===3&&paragraphs.every((p)=>p.length>=90)&&sourceIds.length>0&&boundary.length>=30)},
  {key:'all section IDs unique; each C1–C7 attached once regardless of reading order',passed:new Set(sectionIds).size===sectionIds.length&&fiscalConcepts.filter(({labId})=>labId).length===7&&new Set(fiscalConcepts.filter(({labId})=>labId).map(({labId})=>labId)).size===7},
  {key:'all fixture, lab, M/K and canonical gates actually pass at source evaluation',passed:[...fiscalFixtureAudit,...fiscalLabAudit,...fiscalScenarioAudit,...canonicalFiscalPolicyStateAudit].every(({passed})=>passed)},
  {key:'ten primary references resolve and declare support as well as non-support',passed:lesson317References.length===10&&citations.every((id)=>referenceIds.has(id))&&lesson317References.every(({id,url,use},i)=>id===i+1&&url.startsWith('https://')&&use.includes('支持')&&use.includes('不支持'))},
  {key:'partial BP and QJE scopes explicit; IMF author viewpoint not policy endorsement',passed:lesson317References[2].publication.includes('final全文未取得')&&lesson317References[5].publication.includes('仅核读')&&lesson317References[4].publication.includes('作者观点不等于IMF政策')},
  {key:'20 checks, 45-plus terms, 14 invariants, eight interfaces and nine reading cards',passed:fiscalChecks.length===20&&fiscalGlossary.length>=45&&fiscalInvariants.length===14&&fiscalInterfaces.length===8&&lesson317ReadingList.length===9},
  {key:'cash/output/tax loop closes before identification; public capital remains optional',passed:fiscalConcepts.findIndex(({id})=>id==='tax-return-fiscal-cost')<fiscalConcepts.findIndex(({id})=>id==='discretion-exogeneity')&&fiscalConcepts.filter(({optional})=>optional).length===1&&fiscalConcepts.find(({optional})=>optional)?.id==='public-investment-supply'},
] as const;
if([...canonicalFiscalPolicyStateAudit,...lesson317IntegrityAudit].some(({passed})=>!passed))throw new Error('3.17 state or lesson integrity failed');

function Lesson317Content() {
  return <>
    <noscript><style>{'[data-lesson-id="3.17"] .fiscal-interactive-only, [data-lesson-id="3.17"] #interactive-lab { display:none !important; }'}</style><p className="precision-note" data-fiscal-nojs-notice>JavaScript未启用：动态实验与M题已隐藏，避免输入改变但结果不更新。C1–C7原生固定记录、K1–K10完整题设／答案／错路径，以及固定SYN路径图仍可阅读、手算和打印。</p></noscript>
    <section className="lesson-section lesson-opening" id="thesis"><p className="section-kicker">00 · CORE THESIS</p><h2>财政先改写具体主体的订单或预算，行为再通过资源与金融条件进入产出，收入和税基又返回政府。</h2>
      <p>前几节解释私人债务、信用菜单和住房合同怎样留下付款压力。财政可以通过采购、转移或税收进入同一系统，但不是给总需求加一个无条件数字：谁先收到什么，谁承担成本，行动何时发生，国内企业是否真正增加生产，决定政策如何落到数量、价格与金融状态。赤字还可能由衰退自动扩大，所以财政既是输入，也能是状态变化的反馈。</p>
      <div className="impact-facts" role="group" aria-label="3.17三道传导门"><article><span>干预与预算门</span><b>tool → orders / available resources</b><p>购买、转移、税收和授权先分开；无新立法仍保留旧规则。</p></article><article><span>行为与资源门</span><b>choices → delivery / private substitution / imports</b><p>现金到账不等于消费，订单不等于新增国内产出。</p></article><article><span>反馈与比较门</span><b>income / tax base → budget / next choices</b><p>乘数锁定基线和窗口，产出账不代替成本与福利账。</p></article></div>
      <div className="equation-card"><span>本课唯一中心机制</span><div><code>policy instrument / news → household and firm budgets / orders → private choices → domestic resources and delivery / imports / financial conditions → output and income → taxes and automatic transfers → next budget and choices</code></div><p>箭头是需要条件和证据的传导，不是已估计每个环节。私人替代、未来税负、供给瓶颈、进口与货币反应都可能削弱、延迟或改变方向。</p></div>
      <p>国内生产总值（gross domestic product，GDP）在本课是指定期间与范围的生产指标，不是财政总支出或福利。初级赤字排除利息；Δ表示同基线、同期间增量。SYN是合成教学单位与独立场景，既非真实货币，也非实际政策。边际消费倾向（marginal propensity to consume，MPC）是特定冲击和窗口的边际响应概念，不能由领取之后的消费份额自动估计。</p>
      <p className="precision-note"><b>当前版本：</b>3.17-r1正文依据同一冻结修订稿的两名独立审稿人批准封版；计算、来源边界与60页校样均已核查，SYN实验不升级为实际财政效果，亦不继承3.16的审批。</p><p className="section-sources"><b>机制与定义依据：</b><Cites ids={[1,2,4,5,7]}/></p>
    </section>
    <section className="lesson-section" id="scope-route"><p className="section-kicker">01 · READING ROUTE & SOURCE PASSPORT</p><h2>先把传导闭环讲清，再审查因果；不借一张真实GDP曲线伪装已经知道政策效果。</h2>
      <p>第一轮从工具、购买、转移与税收读到家庭用途、企业交付、资源和进口，再手算有限收入反馈与税收回流。第二轮把产出差变成有定义的时距、累计及滞后路径，最后用新闻和识别方法审核这条回路。公共投资的未来供给单元是可选深化；其他单元服务同一核心机制，而不是各自开启一门新课程。</p>
      <p>首轮正文约55–75分钟，7个C实验约45–65分钟，10道M/K诊断首轮约25–40分钟，术语与理解复盘约30–50分钟；可分几次完成。估时考虑手算和反例，不要求读者坐满某个时长。已熟悉公式者可以更快，首次学习者可以先保留方法细节，延伸论文另计。固定实验每次从完整基准开始，不能把上一步残留输入带进下一道反例。</p>
      <p>美国经济分析局（U.S. Bureau of Economic Analysis，BEA）与人口普查局（U.S. Census Bureau）提供核算、实际量和年率定义；美国国会预算办公室（Congressional Budget Office，CBO）的2024方法提供既有规则反馈与周期调整边界。Olivier Blanchard与Roberto Perotti（下称BP）的实读April2001作者稿提供制度识别限制，Valerie Ramey的综述提供模型、地方与福利比较；国际货币基金组织（International Monetary Fund，IMF）2014技术手册提供条件与投影操作。机构和论文承担不同证据任务，不能互相替代。</p>
      <p>本节没有导入观察GDP、预算或新闻冲击数据；所有图和计算均显著标为SYN。真实数据会有工具聚合、发布修订、季调年率（seasonally adjusted annual rate，SAAR）、链式实际量和识别问题，先学会单位与基线审计，再采集数据更有效。历史时点可知（point-in-time，PIT）要求记录当时实际可获得的版本；当前阅读官方页面只证明作者核读了这版方法，不证明2026取得的修订历史在过去已知。</p>
      <p className="section-sources"><Cites ids={[1,2,3,4,5,7,8,9,10]}/></p>
    </section>
    {fiscalConcepts.map((concept,index)=><section className="lesson-section" id={concept.id} key={concept.id}><p className="section-kicker">{String(index+2).padStart(2,'0')} · {concept.optional?'OPTIONAL SUPPLY DEEP DIVE':'CORE MECHANISM'}</p><h2>{concept.title}</h2>{concept.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{concept.formula?<div className="equation-card"><span>{concept.label} · 必要算式</span><div><code>{concept.formula.expression}</code></div><p>{concept.formula.explanation}</p></div>:null}<div className={concept.labId?'fiscal-lab-bundle':undefined}><div className="precision-note"><span>成立条件与不能推出的结论</span><p>{concept.boundary}</p></div>{concept.labId?<FiscalLabStatic labId={concept.labId}/>:null}</div><p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds}/></p></section>)}
    <section className="lesson-section" id="method-comparison"><p className="section-kicker">METHOD / ESTIMAND MAP</p><h2>把定义、条件模型与识别方法分开，才能知道一条引用究竟证明了什么。</h2>
      <p>BEA可以解释转移为何不直接进入G，却不能证明某次采购创造多少新增产出。CBO可按其2024方法剥离部分自动预算反应，却不保证余下序列外生。BP与财政新闻方法尝试排除不同反向因果和信息错位，仍需检查对象、限制和频率。IMF的操作框架提醒如何使用响应路径，不替合成系数创造因果证据。</p>
      <div className="evidence-map" aria-label="3.17五类证据及不支持范围" role="group"><div><h3>定义与实现后的核算</h3><p>BEA／Census规定产品、贸易、链式量和年率的对象；会计一致是必要条件，不是财政处理的反事实。真实GDP组成项也不能不经链式聚合桥接照搬C1。 <Cites ids={[1,7,8,9,10]}/></p></div><div><h3>既有规则与周期预算</h3><p>CBO2024方法辨别现行税款和资格反馈；部分项目不自动响应是它的方法范围。周期调整仍有资产、裁量和测量影响，不作2026当前预测。 <Cites ids={[2]}/></p></div><div><h3>制度限制与动态残差</h3><p>BP实读April2001方法稿剥离自动净税反应、限制当期裁量速度，并处理同步结构。限制有制度含义，不适用于每种季度政策；final全文未取得，不借最终估计。 <Cites ids={[3]}/></p></div><div><h3>新闻时间与主体预期</h3><p>Ramey timing引言提示采购执行与私人知情错位。本课只核读final1–5页，未审核全部结果；公告或战争的共同信息不能因“更早”自动被排除。 <Cites ids={[6]}/></p></div><div><h3>机制综述与投影操作</h3><p>Ramey JEL全文与IMF TNM14/04全文支持条件、地方及福利地图、时距定义和旧冲击叠加。IMF bucket是判断性框架，作者观点不等于IMF政策，本课无分组参数移植。 <Cites ids={[4,5]}/></p></div></div>
      <p>一项研究同时需要三张护照：干预是什么，响应是哪种变量，方法究竟排除了哪些共同原因。只有三者相符，论文结论才进入当前问题。若只读了身份、引言或部分方法，就应保留相应范围；不因为参考文献标题看起来权威而把未读数量结果带进教材。</p>
    </section>
    <section className="lesson-section" id="response-map"><p className="section-kicker">SYNTHETIC PATH · LEVELS ARE NOT GROWTH</p><h2>同一合成路径中，政策水平高于基线，优势收缩时增长效果仍可变负。</h2>
      <p>下图是C6同一纯计算器的固定记录，不随交互输入改写：基线[100,102,104,106]不含同一措施效应；声明冲量[10,5,0,0]与核[0.8,0.5,0.2]给出水平差[8,9,4.5,1]。期间1至2，优势从9收缩到4.5；两条完整水平路径的非年化增长率差约−4.21304个百分点。看懂这一步，才不会把财政撤回、增长放慢和产出水平低于基线混成一回事。</p>
      <FiscalPathChart baseline={fiscalC6.baselineLevels} withPolicy={fiscalCanonicalResults.c6.withPolicyLevels}/>
      <p className="precision-note">时期从0编号，未指定为日历年、季度或真实国家。图中基线、冲量、核和尾部皆为教学假设；没有真实GDP数据、估计置信区间或预测资格。动态C6可改变输入，图示固定记录、无脚本与纸上版本始终使用同一基准。</p><p className="section-sources"><Cites ids={[5,7,9]}/></p>
    </section>
    <section className="lesson-section" id="interactive-lab"><p className="section-kicker">INTERACTIVE M1–M10</p><h2>十个闭合反例检验预算、核算、窗口、滞后和资源边界。</h2><FiscalQuiz/></section>
    <section className="lesson-section" id="fiscal-static-twins"><p className="section-kicker">STATIC K1–K10 · SAME RECORDS</p><h2>无脚本与纸上学习保留每题完整输入、答案和两个错路径。</h2><p>K题和M题共用同一记录、正确值与诊断，不是另一套简化题。先手算再原生展开；打印版保留答案，不依赖JavaScript或动态选择。每题独立，全部输入以当前题设为准。</p><FiscalStaticQuiz/></section>
    <section className="lesson-section" id="checks-glossary"><p className="section-kicker">CHECKS / ARITHMETIC / GLOSSARY</p><h2>能指出缺失的比较世界或单位桥接，比背一个财政乘数更重要。</h2>
      <div className="check-grid" role="group" aria-label="3.17二十道理解检查">{fiscalChecks.map((check,i)=><div key={check.question}><details><summary>{String(i+1).padStart(2,'0')} · {check.question}</summary><p>{check.answer} <Cites ids={check.sourceIds}/></p></details><p className="print-only"><b>{String(i+1).padStart(2,'0')} · 答案：</b>{check.answer} <Cites ids={check.sourceIds}/></p></div>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.17算术与来源审计"><span>纯计算、身份、来源与定义门（不是独立审批）</span><ul>{[...fiscalFixtureAudit,...fiscalLabAudit,...fiscalScenarioAudit,...canonicalFiscalPolicyStateAudit,...lesson317IntegrityAudit].map((item)=><li key={item.key} className={item.passed?'passed':''}>{item.passed?'PASS':'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" role="group" aria-label="3.17术语与误区">{fiscalGlossary.map(([term,meaning,confusion])=><article className="term-card" key={term}><h3>{term}</h3><p>{meaning}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>
    <section className="lesson-section" id="evidence-boundaries"><p className="section-kicker">CASES / STATE / PROVENANCE / INTERFACES</p><h2>最终产物是可核查、会停止的财政机制登记册，不是一个无条件政策推荐器。</h2>
      <p>canonical状态对象有{canonicalFiscalPolicyStateFields.length}个顶层字段。scopePassport逐一声明7个独立实验，C2是100户用途分布；C1期间增量、C3收入状态、C4模型轮与C6路径不能拼成同一个真实财政历史。唯一直接上游是3.16的合同与家庭上下文，九条路径按对象身份映射，不拿上游金额或响应系数校准财政效果。</p>
      <div className="precision-note"><span>canonical · {state.schemaVersion}</span><p><code>{canonicalFiscalPolicyStateFields.join(', ')}</code>。自动规则、裁量、基线、响应核、资源诊断、识别、融资与福利分开；未知真实行为和因果不填0。3.16修订标记不晚于本节登记截止，只是上下文版本一致，不证明历史PIT或经济预测。</p></div>
      <h3>四个能迁移的案例与反例</h3><div className="case-grid"><article className="case-card"><span>SYN · TWO ACCOUNTS</span><h4>采购10而GDP对账0</h4><p>C1政府购买10且私人投资变化−10，其他项零，初级赤字增加10而GDP对账0。私人变化是完整SYN情景，不是已证明采购挤出投资；这能检验会计门和因果门是否分开。 <Cites ids={[1,4,7]}/></p></article><article className="case-card"><span>OFFICIAL METHOD · 2024 VINTAGE</span><h4>旧规则可以让赤字自动扩大</h4><p>CBO方法说明现行税款和部分资格反馈，不需新立法。它的信息、法律和June2024基线有明确截止；本课没有复算预测图表，也不把2024报告当2026经济状态。 <Cites ids={[2]}/></p></article><article className="case-card"><span>MODEL CONDITIONAL · GEOGRAPHY</span><h4>地方1.5与全国0可以回答不同问题</h4><p>Ramey同质简化模型中全国等额一次性税与转移抵消，而地方相对回归剔除共同税负后可得c/(1−c)。c=0.6只为教学，改异质税负就须重建，全国0不是所有转移无效。 <Cites ids={[4]}/></p></article><article className="case-card"><span>SYN · DIAGNOSTIC NOT FORECAST</span><h4>资源差额4却没有通胀数字</h4><p>C7请求真实额外产出10、声明能力6，只说明固定需求条件不相容。实际产出、进口、价格和私人替代均未知；任何精确分配都需要另建模型和观察证据。 <Cites ids={[2,4,5]}/></p></article></div>
      <h3>生产者不变量</h3><ol className="contract-list">{fiscalInvariants.map((rule,i)=><li key={rule}><b>{String(i+1).padStart(2,'0')}</b><span>{rule}</span></li>)}</ol>
      <h3>作者实际阅读、审稿与来源版本分开记录</h3><p>课程作者核读BEA各指定完整定义页；Census仅第15–17问；CBO完整60970 HTML及landing，未复算图表。BP实际为April2001作者方法稿PDF1–9、17–21，出版final身份已查而全文未取得；Ramey JEL期刊排版全文已读，timing final只读1–5页。IMF33页主文、三个附录及参考分段全文文字核读，封面身份另核；这不等于复制模型、审核所有参考论文或获得IMF政策背书。审稿人的个人读取范围另在报告中登记，不冒称两位审稿人都全文读过每篇论文。 <Cites ids={[1,2,3,4,5,6,7,8,9,10]}/></p>
      <p>BP更早NBER稿、April2001作者稿与2002final不是默认逐字等价。IMF编号采用正文页脚14/04而非错标14/03；原封面确认题名与作者，September2014另见PDF第2页授权页。Ramey QJE采用126(1)，不混入另一综述的49(3)。部分版权PDF只作私有核读证据，不在网站发布全文镜像。外链是访问入口，不是内容寻址档案；未来更新需要另存新版本、日期、读取范围和哈希，不能覆盖旧证据或用新修订值补成过去可知。</p>
      <h3>从世界模型缩小为研究问题</h3><p>不要问“财政究竟有效吗”后同时估计所有箭头。可以先问特定补助在指定资格、到账窗口和群组中是否改变消费；也可以问已交付采购相对可信基线是否改变当地订单、净生产与进口。每项设计只锁定一个处理与结果，记录共同原因、溢出、版本和单位，先取得局部可证伪证据，再桥接全国响应。宏观回路复杂，不意味着每个实证问题都应该无限复杂。 <Cites ids={[3,4,5,6]}/></p>
      <h3>跨章接口</h3><div className="interface-grid" role="group" aria-label="3.17八项跨章接口">{fiscalInterfaces.map(([name,payload,guardrail])=><article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}。</p><p><b>不可跨越的边界：</b>{guardrail}。</p></article>)}</div>
      <p>完成第一轮后，请用自己的话重建一个新政策：工具改变哪位主体，现金或订单如何进入选择，企业在哪道资源门扩量或替代，国内与境外需求如何分流，新收入怎样返回税基与预算。然后问自己：哪些是已实现账目，哪些只是条件机制，哪条比较基线还缺证据？能把这三者分开，才真正掌握财政进入金融世界模型的接口。</p>
    </section>
  </>;
}

export const lesson317: LessonRecord = {
  slug:'3-17', id:'3.17', chapter:'03', chapterTitle:'Macro State & Financial Conditions',
  title:'Fiscal Policy：订单、家庭预算与收入—税基反馈',
  subtitle:'从购买、转移与税收进入不同主体的预算，解释自动稳定器、私人选择、资源与进口、有限反馈、时距与累计比率、政策新闻和识别，分开产出、财政成本与福利',
  readingTime:'正文主线约55–75分钟；公共投资可选深化约5–10分钟；C1–C7手算／交互约45–65分钟；M/K十题首轮约25–40分钟，理解检查／术语／复盘约30–50分钟。均为学习估时而非强制时长，延伸论文另计',
  prerequisite:'Master：T06 Balance Sheet；背景3.01–3.05与3.09–3.16；按需T02、T03、T05、T08。3.16只作直接合同上下文，不是本课数值校准或额外强制先修',
  updatedAt:'2026-09-15',revision:'3.17-r1',reviewStatus:'double-reviewed',reviews:[
    {kind:'accuracy',completedAt:'2026-09-15',decision:'approved',revision:'3.17-r1',summary:'同版核对计算、反事实、来源范围与跨章身份映射；47输出及30选项值闭合，IMF定位已修复，因果、福利与主权安全仍未知。'},
    {kind:'pedagogy',completedAt:'2026-09-15',decision:'approved',revision:'3.17-r1',summary:'同版核对因果顺序、两条错路径、无脚本／移动阅读及60页校样；中文题设与A/B/C标号已修复，不将教学模型冒充估计。'},
  ],
  previous:{slug:'3-16',label:'3.16 Housing–Collateral Feedback'},next:{label:'3.18 Fiscal–Monetary Interaction'},
  sections:[{id:'thesis',label:'核心命题'},{id:'scope-route',label:'阅读路线与来源护照'},...fiscalConcepts.map(({id,label})=>({id,label})),{id:'method-comparison',label:'方法与估计对象'},{id:'response-map',label:'SYN水平与增长路径'},{id:'interactive-lab',label:'Interactive M1–M10'},{id:'fiscal-static-twins',label:'Static K1–K10'},{id:'checks-glossary',label:'Checks / Audit / Glossary'},{id:'evidence-boundaries',label:'State / Cases / Interfaces'}],
  Content:Lesson317Content,references:lesson317References,readingList:lesson317ReadingList,readingListOrder:'source',
};
