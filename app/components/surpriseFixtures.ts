// AUXILIARY AUTHOR mathematics copied by ROOT, then ROOT growth-domain revision.
// Seven independent stipulated SYN contracts; publishing draft, not approved.
// No source-paper replication, observed macro surprise, PIT or content approval.
export type SurpriseLabId = 'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7';
export type SurpriseDomain = Readonly<{min:number;max:number;step:1}>;
export type SurpriseStop = Readonly<{status:'STOP';reason:string}>;
export type SurpriseOk = Readonly<{status:'OK';value:Readonly<Record<string,unknown>>;exact:Readonly<Record<string,ExactQuantity>>}>;
export type SurpriseResult = SurpriseStop|SurpriseOk;
// A factored scale keeps the exact integer ratio safe even at the million-unit
// domain endpoints. Decimal projection is display-only, never a branch input.
export type ExactQuantity = Readonly<{numerator:number;denominator:number;scale:1|100|10000}>;
const signed:SurpriseDomain=Object.freeze({min:-1000000,max:1000000,step:1});
// These ordinary percentage growth/forecast objects assume a positive base
// and nonnegative activity, unlike unrestricted signed policy-rate comparators.
const growth:SurpriseDomain=Object.freeze({min:-10000,max:1000000,step:1});
const amount:SurpriseDomain=Object.freeze({min:0,max:1000000,step:1});
const positive:SurpriseDomain=Object.freeze({min:1,max:1000000,step:1});
const clock:SurpriseDomain=amount;
const totalRate:SurpriseDomain=Object.freeze({min:-9999,max:1000000,step:1});
export const surpriseRawDomains = Object.freeze({
 C1:Object.freeze({actual:growth,previous:growth,consensus:growth,alternateConsensus:growth}),
 C2:Object.freeze({forecast1:growth,forecast2:growth,forecast3:growth,forecast4:growth,forecast5:growth,disclosedActual:growth}),
 C3:Object.freeze({oldProxy:growth,newProxy:growth,disclosedActual:growth,oldRelease:clock,newRelease:clock,cutoff:clock,announcement:clock}),
 C4:Object.freeze({currentAnnounced:growth,currentForecast:growth,previousFirst:growth,previousRevised:growth}),
 C5:Object.freeze({disclosedActual:growth,frozenProxy:growth,suppliedScale:amount,trainingCutoff:clock,modelChoice:clock,cutoff:clock,announcement:clock}),
 C6:Object.freeze({cashflowBefore:positive,cashflowAfter:amount,totalRateBefore:totalRate,totalRateAfter:totalRate}),
 C7:Object.freeze({oldTarget:signed,announcedTarget:signed,frozenTargetProxy:signed,frozenPathProxy:signed,announcedInformationPath:signed}),
}) satisfies Readonly<Record<SurpriseLabId,Readonly<Record<string,SurpriseDomain>>>>;
export const surpriseCanonicalInputs = Object.freeze({
 C1:Object.freeze({actual:200,previous:100,consensus:300,alternateConsensus:100}),
 C2:Object.freeze({forecast1:100,forecast2:100,forecast3:200,forecast4:400,forecast5:700,disclosedActual:200}),
 C3:Object.freeze({oldProxy:300,newProxy:200,disclosedActual:200,oldRelease:1,newRelease:4,cutoff:3,announcement:5}),
 C4:Object.freeze({currentAnnounced:200,currentForecast:150,previousFirst:200,previousRevised:100}),
 C5:Object.freeze({disclosedActual:250,frozenProxy:225,suppliedScale:25,trainingCutoff:2,modelChoice:2,cutoff:3,announcement:4}),
 C6:Object.freeze({cashflowBefore:100,cashflowAfter:102,totalRateBefore:500,totalRateAfter:1000}),
 C7:Object.freeze({oldTarget:125,announcedTarget:100,frozenTargetProxy:75,frozenPathProxy:100,announcedInformationPath:125}),
}) satisfies Readonly<Record<SurpriseLabId,Readonly<Record<string,number>>>>;

function stop(reason:string):SurpriseStop{return {status:'STOP',reason};}
function integer(value:number,label:string):number{
 if(!Number.isSafeInteger(value))throw new RangeError('中间整数不安全：'+label);
 return value;
}
function add(a:number,b:number):number{return integer(a+b,'加法');}
function subtract(a:number,b:number):number{return integer(a-b,'减法');}
function multiply(a:number,b:number):number{return integer(a*b,'乘法');}
function gcd(a:number,b:number):number{
 let x=Math.abs(integer(a,'gcd输入')),y=Math.abs(integer(b,'gcd输入'));
 while(y!==0){const remainder=integer(x%y,'gcd余数');x=y;y=remainder;}
 return x;
}
function ratio(numerator:number,denominator:number,scale:1|100|10000=1):ExactQuantity{
 integer(numerator,'有理数分子');integer(denominator,'有理数分母');
 if(denominator<=0)throw new RangeError('有理数分母必须严格为正。');
 const divisor=gcd(numerator,denominator);
 return Object.freeze({numerator:integer(numerator/divisor,'约分分子'),denominator:integer(denominator/divisor,'约分分母'),scale});
}
export function surpriseExactToNumber(q:ExactQuantity):number{
 // Division precedes the factored display scale; no unsafe integer product.
 const value=(q.numerator/q.denominator)*q.scale;
 if(!Number.isFinite(value))throw new RangeError('展示投影不是有限数。');
 return value===0?0:value;
}
function ok(value:Record<string,unknown>,exact:Record<string,ExactQuantity>={}):SurpriseOk{
 return {status:'OK',value:Object.freeze(value),exact:Object.freeze(exact)};
}
function raw(input:unknown,id:SurpriseLabId):SurpriseStop|{status:'RAW_OK';value:Record<string,number>}{
 if(input===null||typeof input!=='object'||Array.isArray(input))return stop('必须提供完整原始整数对象。');
 const domains:Readonly<Record<string,SurpriseDomain>>=surpriseRawDomains[id];
 const keys=Object.keys(domains),supplied=Reflect.ownKeys(input);
 if(supplied.length!==keys.length||supplied.some(k=>typeof k!=='string'||!Object.hasOwnProperty.call(domains,k)))return stop('原始键必须完整，且不得添加其他字段或符号键。');
 const output:Record<string,number>={};
 for(const key of keys){
  const descriptor=Object.getOwnPropertyDescriptor(input,key);
  if(!descriptor||!('value' in descriptor))return stop('输入须是自有数据字段，不接受getter：'+key);
  const value:unknown=descriptor.value,domain=domains[key];
  if(typeof value!=='number'||!Number.isSafeInteger(value)||value<domain.min||value>domain.max)return stop('原始输入须在声明的安全整数域内：'+key);
  output[key]=value===0?0:value;
 }
 return {status:'RAW_OK',value:output};
}
export function parseSurpriseRawInteger(text:unknown):number|null{
 if(typeof text!=='string')return null;
 // trim explicit outer whitespace only; no exponent/decimal/plus/leading zero.
 const trimmed=text.trim();
 if(!/^(?:0|-?[1-9]\d*)$/.test(trimmed))return null;
 const value=Number(trimmed);return Number.isSafeInteger(value)?value:null;
}
function checked(input:unknown,id:SurpriseLabId,calculate:(p:Record<string,number>)=>SurpriseResult):SurpriseResult{
 const checkedRaw=raw(input,id);if(checkedRaw.status==='STOP')return checkedRaw;
 try{return calculate(checkedRaw.value);}catch(error){
  if(error instanceof RangeError)return stop(error.message);
  throw error;
 }
}

export function surpriseComparators(input:unknown):SurpriseResult{
 return checked(input,'C1',p=>ok({...p,actualGrowthPercent:p.actual/100,
  improvementFromPreviousBp:subtract(p.actual,p.previous),relativeToConsensusBp:subtract(p.actual,p.consensus),
  relativeToAlternateConsensusBp:subtract(p.actual,p.alternateConsensus),
  actualPriceReaction:null,economicWelfare:null,instantaneousMarketExpectation:null}));
}
export function surpriseSurvey(input:unknown):SurpriseResult{
 return checked(input,'C2',p=>{
  const predictions=[p.forecast1,p.forecast2,p.forecast3,p.forecast4,p.forecast5];
  const sorted=[...predictions].sort((a,b)=>subtract(a,b));
  const sum=predictions.reduce((total,value)=>add(total,value),0),mean=ratio(sum,5);
  const relativeToMean=ratio(subtract(multiply(p.disclosedActual,5),sum),5);
  return ok({...p,surveySize:5,surveyMedianBp:sorted[2],surveyMeanBp:surpriseExactToNumber(mean),
   retrospectiveActualMinusMedianBp:subtract(p.disclosedActual,sorted[2]),
   retrospectiveActualMinusMeanBp:surpriseExactToNumber(relativeToMean),
   retrospectiveIndividualDifferenceBp:Object.freeze(predictions.map(prediction=>subtract(p.disclosedActual,prediction))),
   actualNetOrder:null,priceAggregationWeights:null,instantaneousMarketExpectation:null},
   {surveyMeanBp:mean,retrospectiveActualMinusMeanBp:relativeToMean});
 });
}
export function surpriseAvailability(input:unknown):SurpriseResult{
 return checked(input,'C3',p=>{
  if(!(p.oldRelease<p.newRelease&&p.newRelease<p.announcement&&p.cutoff<p.announcement))return stop('合成发布须严格旧<新<公告，事前截止须严格早于公告。');
  const availableProxyKind=p.cutoff<p.oldRelease?'unavailable':p.cutoff<p.newRelease?'old':'new';
  const availableProxy=availableProxyKind==='unavailable'?null:availableProxyKind==='old'?p.oldProxy:p.newProxy;
  return ok({...p,availableProxyKind,asOfFrozenProxyBp:availableProxy,
   asOfActualBp:null,asOfSurpriseBp:null,asOfStandardizedSurprise:null,
   retrospectiveDifferenceUsingEligibleFrozenProxyBp:availableProxy===null?null:subtract(p.disclosedActual,availableProxy),
   actualHistoricalRelease:null,expectationFormation:null,actualReception:null,historicalPitCertification:null});
 });
}
export function surpriseNewsPackage(input:unknown):SurpriseResult{
 return checked(input,'C4',p=>ok({...p,currentMatchedDifferenceBp:subtract(p.currentAnnounced,p.currentForecast),
  previousReferencePeriodRevisionBp:subtract(p.previousRevised,p.previousFirst),
  separatelyDefinedSumBp:add(subtract(p.currentAnnounced,p.currentForecast),subtract(p.previousRevised,p.previousFirst)),
  actualCompleteNewsPackage:null,newsCombinationWeights:null,uniquePriceShock:null,actualPriceEffect:null}));
}
export function surpriseScale(input:unknown):SurpriseResult{
 return checked(input,'C5',p=>{
  if(p.cutoff>=p.announcement)return stop('事前截止须严格早于合成公告序号。');
  const modelEligible=p.modelChoice<=p.cutoff,scaleEligible=p.trainingCutoff<=p.cutoff&&modelEligible;
  const difference=subtract(p.disclosedActual,p.frozenProxy);
  const suppliedCalculation=p.suppliedScale===0?null:ratio(difference,p.suppliedScale);
  const eligibleCalculation=scaleEligible?suppliedCalculation:null;
  return ok({...p,stipulatedProxyAlreadyFrozenBeforeCut:true,modelEligibleBeforeCut:modelEligible,scaleEligibleBeforeCut:scaleEligible,
   asOfEligibleProxyBp:modelEligible?p.frozenProxy:null,asOfEligibleScaleBp:scaleEligible?p.suppliedScale:null,
   asOfActualBp:null,asOfRawSurpriseBp:null,asOfStandardizedSurprise:null,
   retrospectiveDifferenceUsingStipulatedFrozenProxyBp:difference,
   retrospectiveSuppliedScaleCalculation:suppliedCalculation===null?null:surpriseExactToNumber(suppliedCalculation),
   retrospectiveStandardizedUsingEligibleFrozenScale:eligibleCalculation===null?null:surpriseExactToNumber(eligibleCalculation),
   actualScaleCalibration:null,actualExpectationFormation:null,actualReception:null,historicalPitCertification:null,
   abdvReplication:null},
   {...(suppliedCalculation===null?{}:{retrospectiveSuppliedScaleCalculation:suppliedCalculation}),
    ...(eligibleCalculation===null?{}:{retrospectiveStandardizedUsingEligibleFrozenScale:eligibleCalculation})});
 });
}
export function surpriseJointValuation(input:unknown):SurpriseResult{
 return checked(input,'C6',p=>{
  const grossBefore=add(10000,p.totalRateBefore),grossAfter=add(10000,p.totalRateAfter);
  if(grossBefore<=0||grossAfter<=0||p.cashflowBefore<=0||p.cashflowAfter<0)return stop('前现金流和两侧总折现分母须正，后现金流可为零。');
  const before=ratio(multiply(p.cashflowBefore,10000),grossBefore);
  const after=ratio(multiply(p.cashflowAfter,10000),grossAfter);
  const afterCross=multiply(p.cashflowAfter,grossBefore),beforeCross=multiply(p.cashflowBefore,grossAfter);
  const joint=ratio(subtract(afterCross,beforeCross),beforeCross,100);
  const cashflowOnly=ratio(subtract(p.cashflowAfter,p.cashflowBefore),p.cashflowBefore,100);
  const rateOnly=ratio(subtract(grossBefore,grossAfter),grossAfter,100);
  // Exact additivity remainder = ((CFafter/CFbefore)-1)*((Gbefore/Gafter)-1).
  const interaction=ratio(multiply(subtract(p.cashflowAfter,p.cashflowBefore),subtract(grossBefore,grossAfter)),beforeCross,100);
  return ok({...p,grossDenominatorBefore:grossBefore,grossDenominatorAfter:grossAfter,
   modelPriceBefore:surpriseExactToNumber(before),modelPriceAfter:surpriseExactToNumber(after),
   jointModelReturnPercent:surpriseExactToNumber(joint),cashflowOnlyCounterfactualReturnPercent:surpriseExactToNumber(cashflowOnly),
   rateOnlyCounterfactualReturnPercent:surpriseExactToNumber(rateOnly),exactAdditivityRemainderPercent:surpriseExactToNumber(interaction),
   observedStockPrice:null,gdpToEquityCashflowMapping:null,riskFreeComponent:null,riskCompensationComponent:null,
   actualEconomicPhase:null,causalPriceEffect:null},
   {modelPriceBefore:before,modelPriceAfter:after,jointModelReturnPercent:joint,
    cashflowOnlyCounterfactualReturnPercent:cashflowOnly,rateOnlyCounterfactualReturnPercent:rateOnly,exactAdditivityRemainderPercent:interaction});
 });
}
export function surpriseSurveyPolicy(input:unknown):SurpriseResult{
 return checked(input,'C7',p=>ok({...p,actualTargetChangeBp:subtract(p.announcedTarget,p.oldTarget),
  retrospectiveTargetRelativeToFrozenSurveyProxyBp:subtract(p.announcedTarget,p.frozenTargetProxy),
  retrospectivePathRelativeToFrozenSurveyProxyBp:subtract(p.announcedInformationPath,p.frozenPathProxy),
  surveyStyleIndependentSyn:true,originalGssFuturesMeasureBp:null,originalGssScaledSettlement:null,
  originalGssRotatedFactors:null,actualPrice:null,actualLongRateResponse:null,externalPolicyShock:null,structuralAttribution:null}));
}
export const surpriseEvaluators=Object.freeze({C1:surpriseComparators,C2:surpriseSurvey,C3:surpriseAvailability,C4:surpriseNewsPackage,C5:surpriseScale,C6:surpriseJointValuation,C7:surpriseSurveyPolicy});
