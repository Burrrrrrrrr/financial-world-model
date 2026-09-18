// AUTHOR DRAFT: seven independent SYN contracts, not empirical cycle dating or approval.
export type CycleLabId = 'C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7';
export type CycleStop = {status:'STOP';reason:string};
export type CycleOk<T> = {status:'OK';value:T};
export type CycleResult<T> = CycleStop|CycleOk<T>;
type Domain = {min:number;max:number};
const amount:Domain={min:0,max:1000000};
const positive:Domain={min:1,max:1000000};
const percent:Domain={min:0,max:100};
const ordinal:Domain={min:0,max:1000000};
export const cycleRawDomains = {
 C1:{previous:positive,current:positive,earlierPeak:positive,alternateNext:positive},
 C2:{creditBefore:amount,creditAfter:amount,gdpBefore:positive,gdpAfter:positive},
 C3:{stockBefore:amount,newLending:amount,repayments:amount,writeOffs:amount},
 C4:{twoBefore:positive,oneBefore:positive,current:positive,futureA:positive,futureB:positive},
 C5:{firstPrevious:positive,firstCurrent:positive,revisedPrevious:positive,revisedCurrent:positive,firstRelease:ordinal,revisionRelease:ordinal,cutoff:ordinal},
 C6:{observations:positive,businessExpansion:amount,financialExpansion:amount,bothExpansion:amount},
 C7:{outputBefore:positive,outputAfter:positive,loanBook:amount,cash:amount,liabilities:amount,equity:positive,lossA:percent,lossB:percent},
} as const satisfies Record<CycleLabId,Record<string,Domain>>;
export const cycleCanonicalInputs = {
 C1:{previous:105,current:103,earlierPeak:110,alternateNext:104},
 C2:{creditBefore:100,creditAfter:100,gdpBefore:100,gdpAfter:90},
 C3:{stockBefore:100,newLending:40,repayments:30,writeOffs:10},
 C4:{twoBefore:100,oneBefore:90,current:100,futureA:110,futureB:80},
 C5:{firstPrevious:100,firstCurrent:98,revisedPrevious:101,revisedCurrent:102,firstRelease:2,revisionRelease:4,cutoff:3},
 C6:{observations:20,businessExpansion:14,financialExpansion:16,bothExpansion:12},
 C7:{outputBefore:100,outputAfter:100,loanBook:80,cash:20,liabilities:90,equity:10,lossA:5,lossB:20},
} as const satisfies Record<CycleLabId,Record<string,number>>;
function stop(reason:string):CycleStop{return {status:'STOP',reason};}
function ok<T>(value:T):CycleOk<T>{return {status:'OK',value};}
function raw(input:unknown,id:CycleLabId):CycleResult<Record<string,number>>{
 if(input===null||typeof input!=='object'||Array.isArray(input))return stop('必须提供完整的原始整数对象。');
 const domains:Record<string,Domain>=cycleRawDomains[id];
 const keys=Object.keys(domains),supplied=Object.keys(input);
 if(supplied.length!==keys.length||supplied.some(k=>!Object.hasOwnProperty.call(domains,k)))return stop('原始键必须完整且不得添加其他字段。');
 const out:Record<string,number>={};
 for(const key of keys){
  if(!Object.hasOwnProperty.call(input,key))return stop('缺少原始输入：'+key);
  const value=(input as Record<string,unknown>)[key],d=domains[key];
  if(typeof value!=='number'||!Number.isSafeInteger(value)||value<d.min||value>d.max)return stop('原始输入须在声明整数域内：'+key);
  out[key]=value;
 }
 return ok(out);
}
export function parseCycleRawInteger(text:string):number|null{
 const trimmed=text.trim();
 if(!/^(?:0|[1-9]\d*)$/.test(trimmed))return null;
 const value=Number(trimmed);return Number.isSafeInteger(value)?value:null;
}
export function cycleDirection(input:unknown){
 const checked=raw(input,'C1');if(checked.status==='STOP')return checked;
 const p=checked.value;
 return ok({previous:p.previous,current:p.current,earlierPeak:p.earlierPeak,alternateNext:p.alternateNext,
  currentChange:p.current-p.previous,currentGrowthPercent:(p.current-p.previous)*100/p.previous,
  nextChange:p.alternateNext-p.current,nextGrowthPercent:(p.alternateNext-p.current)*100/p.current,
  currentGapFromEarlierPeak:p.current-p.earlierPeak,nextGapFromEarlierPeak:p.alternateNext-p.earlierPeak,
  officialBusinessPhase:null,officialRecession:null,datedTrough:null,potentialOutput:null});
}
export function cycleCreditRatio(input:unknown){
 const checked=raw(input,'C2');if(checked.status==='STOP')return checked;
 const p=checked.value,cross=p.creditAfter*p.gdpBefore-p.creditBefore*p.gdpAfter;
 return ok({creditBefore:p.creditBefore,creditAfter:p.creditAfter,gdpBefore:p.gdpBefore,gdpAfter:p.gdpAfter,
  netCreditStockChange:p.creditAfter-p.creditBefore,gdpFlowChange:p.gdpAfter-p.gdpBefore,
  ratioBeforePercent:p.creditBefore*100/p.gdpBefore,ratioAfterPercent:p.creditAfter*100/p.gdpAfter,
  ratioChangePercentagePoints:cross*100/(p.gdpBefore*p.gdpAfter),grossNewLending:null,realLoanApproval:null,
  creditSupplyShock:null,creditCausedOutputChange:null,officialCreditGap:null});
}
export function cycleLoanStock(input:unknown){
 const checked=raw(input,'C3');if(checked.status==='STOP')return checked;
 const p=checked.value,stockAfter=p.stockBefore+p.newLending-p.repayments-p.writeOffs;
 if(stockAfter<0)return stop('隔离贷款账不能把期末贷款存量减为负数。');
 return ok({stockBefore:p.stockBefore,newGrossLending:p.newLending,cashRepayments:p.repayments,noncashWriteOffs:p.writeOffs,
  stockAfter,netStockChange:p.newLending-p.repayments-p.writeOffs,excludedOtherStockChanges:0,
  observedRealGrossLending:null,actualLoanDemand:null,actualLoanSupply:null,actualBankProfit:null,
  crisisLabel:null,causalOutputEffect:null});
}
export function cycleFutureDependence(input:unknown){
 const checked=raw(input,'C4');if(checked.status==='STOP')return checked;
 const p=checked.value,centerNumeratorA=p.oneBefore+p.current+p.futureA,centerNumeratorB=p.oneBefore+p.current+p.futureB;
 return ok({twoBefore:p.twoBefore,oneBefore:p.oneBefore,current:p.current,disclosedCounterfactualFutureA:p.futureA,disclosedCounterfactualFutureB:p.futureB,
  retrospectiveCenteredMeanA:centerNumeratorA/3,retrospectiveCenteredMeanB:centerNumeratorB/3,
  retrospectiveResidualA:(2*p.current-p.oneBefore-p.futureA)/3,retrospectiveResidualB:(2*p.current-p.oneBefore-p.futureB)/3,
  retrospectiveResidualBMinusA:(p.futureA-p.futureB)/3,
  trailingMean:(p.twoBefore+p.oneBefore+p.current)/3,trailingResidual:(2*p.current-p.twoBefore-p.oneBefore)/3,
  asOfCenteredMean:null,asOfCenteredResidual:null,actualFuture:null,estimatedHpCycle:null,
  originalWp380TurningDate:null,outOfSampleForecastValue:null});
}
export function cycleVintage(input:unknown){
 const checked=raw(input,'C5');if(checked.status==='STOP')return checked;
 const p=checked.value;if(p.firstRelease>=p.revisionRelease)return stop('第一版发布必须严格早于修订版发布；合成时钟不能逆序。');
 const firstGrowth=(p.firstCurrent-p.firstPrevious)*100/p.firstPrevious;
 const revisedGrowth=(p.revisedCurrent-p.revisedPrevious)*100/p.revisedPrevious;
 const availableVintage:'unavailable'|'first'|'revised'=p.cutoff<p.firstRelease?'unavailable':p.cutoff<p.revisionRelease?'first':'revised';
 return ok({firstPrevious:p.firstPrevious,firstCurrent:p.firstCurrent,revisedPrevious:p.revisedPrevious,revisedCurrent:p.revisedCurrent,
  firstRelease:p.firstRelease,revisionRelease:p.revisionRelease,cutoff:p.cutoff,
  firstVintageGrowthPercent:firstGrowth,retrospectiveRevisedGrowthPercent:revisedGrowth,availableVintage,
  availablePrevious:availableVintage==='unavailable'?null:availableVintage==='first'?p.firstPrevious:p.revisedPrevious,
  availableCurrent:availableVintage==='unavailable'?null:availableVintage==='first'?p.firstCurrent:p.revisedCurrent,
  availableGrowthPercent:availableVintage==='unavailable'?null:availableVintage==='first'?firstGrowth:revisedGrowth,
  revisionIsAvailable:p.cutoff>=p.revisionRelease,actualHistoricalReleaseDate:null,realRecessionLabel:null,
  realHistoricalPitCertification:null,publishedNberAnnouncement:null});
}
export function cycleConcordance(input:unknown){
 const checked=raw(input,'C6');if(checked.status==='STOP')return checked;
 const p=checked.value,n=p.observations,be=p.businessExpansion,fe=p.financialExpansion,j=p.bothExpansion;
 if(be>n||fe>n||j>Math.min(be,fe)||n-be-fe+j<0)return stop('两组相位的四格表必须在同一窗口内完整、非负且匹配边际。');
 const bothContraction=n-be-fe+j,businessOnly=be-j,financialOnly=fe-j;
 const samePhase=j+bothContraction,independentNumerator=be*fe+(n-be)*(n-fe);
 return ok({observations:n,businessExpansion:be,financialExpansion:fe,bothExpansion:j,businessExpansionOnly:businessOnly,
  financialExpansionOnly:financialOnly,bothContraction,samePhaseCount:samePhase,differentPhaseCount:n-samePhase,
  concordancePercent:samePhase*100/n,independentMarginalBaselinePercent:independentNumerator*100/(n*n),
  excessOverBaselinePercentagePoints:(samePhase*n-independentNumerator)*100/(n*n),
  realBusinessDates:null,realFinancialDates:null,empiricalIndependence:null,statisticalSignificance:null,
  commonShockProbability:null,causalDirection:null,crisisProbability:null});
}
export function cycleLossCapacity(input:unknown){
 const checked=raw(input,'C7');if(checked.status==='STOP')return checked;
 const p=checked.value,initialAssets=p.loanBook+p.cash;
 if(initialAssets!==p.liabilities+p.equity)return stop('起始贷款、现金、负债与权益必须按同口径精确平衡。');
 const lossANumerator=p.loanBook*p.lossA,lossBNumerator=p.loanBook*p.lossB;
 const equityANumerator=p.equity*100-lossANumerator,equityBNumerator=p.equity*100-lossBNumerator;
 const assetsANumerator=initialAssets*100-lossANumerator,assetsBNumerator=initialAssets*100-lossBNumerator;
 return ok({outputBefore:p.outputBefore,outputAfter:p.outputAfter,stipulatedOutputChange:p.outputAfter-p.outputBefore,
  initialLoanBook:p.loanBook,initialCash:p.cash,initialLiabilities:p.liabilities,initialEquity:p.equity,initialAssets,
  initialLeverage:initialAssets/p.equity,recognizedLossA:lossANumerator/100,recognizedLossB:lossBNumerator/100,
  loanBookA:(p.loanBook*100-lossANumerator)/100,loanBookB:(p.loanBook*100-lossBNumerator)/100,
  assetsA:assetsANumerator/100,assetsB:assetsBNumerator/100,equityA:equityANumerator/100,equityB:equityBNumerator/100,
  leverageA:equityANumerator>0?assetsANumerator/equityANumerator:null,
  leverageB:equityBNumerator>0?assetsBNumerator/equityBNumerator:null,
  nonpositiveEquityA:equityANumerator<=0,nonpositiveEquityB:equityBNumerator<=0,
  actualLoanResponse:null,recognizedLossFromHousePrice:null,legalInsolvency:null,systemicCrisisLabel:null,
  actualFutureOutput:null,causalCreditOutputEffect:null});
}
export const cycleEvaluators={C1:cycleDirection,C2:cycleCreditRatio,C3:cycleLoanStock,C4:cycleFutureDependence,C5:cycleVintage,C6:cycleConcordance,C7:cycleLossCapacity} as const;
