/** Independent synthetic contracts, not observed countries, executable arbitrage or forecasts. */
export type FxStop={status:'STOP';reason:string};
export type FxOk<T>={status:'OK';value:T};
const stop=(reason:string):FxStop=>({status:'STOP',reason});
const ok=<T,>(value:T):FxOk<T>=>({status:'OK',value});
const grid=(x:number,min:number,max:number)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const quote=(...xs:number[])=>xs.every(x=>grid(x,1,1_000_000));
const money=(...xs:number[])=>xs.every(x=>grid(x,0,1_000_000));
const rate=(...xs:number[])=>xs.every(x=>grid(x,-9_000,5_000));
const q=(x:number)=>x/100;
const gross=(x:number)=>1+x/10_000;
export function fxQuoteTranslation(v:{oldQuoteCents:number;newQuoteCents:number;foreignUnits:number}){
 if(!quote(v.oldQuoteCents,v.newQuoteCents)||!money(v.foreignUnits))return stop('正报价须为1至1e6整数百分刻度，外币单位须为0至1e6整数；缺失不能填0。');
 const oldQuote=q(v.oldQuoteCents),newQuote=q(v.newQuoteCents),factor=newQuote/oldQuote;
 return ok({oldQuote,newQuote,quoteChangePct:(factor-1)*100,reverseQuoteChangePct:(1/factor-1)*100,oldHomeAmount:oldQuote*v.foreignUnits,newHomeAmount:newQuote*v.foreignUnits,homeAmountChange:(newQuote-oldQuote)*v.foreignUnits,macroCause:null});
}
export function fxCoveredReturn(v:{spotCents:number;forwardCents:number;homeReturnBps:number;foreignReturnBps:number}){
 if(!quote(v.spotCents,v.forwardCents)||!rate(v.homeReturnBps,v.foreignReturnBps))return stop('正现货/远期百分刻度与同一期简单回报整数基点须有效；不是政策年率的自动换算。');
 const spot=q(v.spotCents),forward=q(v.forwardCents),homeGross=gross(v.homeReturnBps),foreignGross=gross(v.foreignReturnBps),coveredGross=foreignGross*forward/spot;
 return ok({spot,forward,homeGross,foreignGross,idealForward:spot*homeGross/foreignGross,forwardPoints:forward-spot,coveredReturnPct:(coveredGross-1)*100,homeReturnPct:v.homeReturnBps/100,coveredExcessPp:(coveredGross-homeGross)*100,executableProfit:null,futureSpotExpectation:null});
}
export function fxUncoveredStates(v:{spotCents:number;futureACents:number;futureBCents:number;probabilityAPct:number;homeReturnBps:number;foreignReturnBps:number}){
 if(!quote(v.spotCents,v.futureACents,v.futureBCents)||!grid(v.probabilityAPct,0,100)||!rate(v.homeReturnBps,v.foreignReturnBps))return stop('两个未来正报价、整数概率0至100和同期间回报均须有效；零概率状态也须符合护照。');
 const spot=q(v.spotCents),a=q(v.futureACents),b=q(v.futureBCents),p=v.probabilityAPct/100,homeGross=gross(v.homeReturnBps),foreignGross=gross(v.foreignReturnBps),meanFuture=p*a+(1-p)*b,meanLogChange=p*Math.log(a/spot)+(1-p)*Math.log(b/spot);
 return ok({meanFuture,expectedQuoteChangePct:(meanFuture/spot-1)*100,expectedForeignReturnPct:(foreignGross*meanFuture/spot-1)*100,expectedSimpleExcessPp:(foreignGross*meanFuture/spot-homeGross)*100,expectedLogQuoteChangePct:meanLogChange*100,logOfMeanQuoteChangePct:Math.log(meanFuture/spot)*100,meanReciprocal:p/a+(1-p)/b,reciprocalOfMean:1/meanFuture,expectedReverseQuoteChangePct:(spot*(p/a+(1-p)/b)-1)*100,realStateProbabilities:null,realRiskCompensation:null});
}
export function fxConditionalRepricing(v:{oldExpectedFutureCents:number;newExpectedFutureCents:number;oldHomeReturnBps:number;newHomeReturnBps:number;foreignReturnBps:number;oldExpectedExcessBps:number;newExpectedExcessBps:number}){
 if(!quote(v.oldExpectedFutureCents,v.newExpectedFutureCents)||!rate(v.oldHomeReturnBps,v.newHomeReturnBps,v.foreignReturnBps,v.oldExpectedExcessBps,v.newExpectedExcessBps))return stop('两个给定算术预期终点与所有回报/预期简单超额基点必须有效；不是EW的log rho。');
 const oldDenominatorGrid=10_000+v.oldHomeReturnBps+v.oldExpectedExcessBps,newDenominatorGrid=10_000+v.newHomeReturnBps+v.newExpectedExcessBps;
 if(oldDenominatorGrid<=0||newDenominatorGrid<=0)return stop('G本币+给定π须按整数基点总和严格为正；两个情景都验证，不让浮点微小正残差冒充零分母。');
 const oldDenominator=oldDenominatorGrid/10_000,newDenominator=newDenominatorGrid/10_000;
 const foreignGross=gross(v.foreignReturnBps),oldSpot=foreignGross*q(v.oldExpectedFutureCents)/oldDenominator,newSpot=foreignGross*q(v.newExpectedFutureCents)/newDenominator,factor=newSpot/oldSpot;
 return ok({oldSpot,newSpot,spotQuoteChangePct:(factor-1)*100,reverseValueChangePct:(1/factor-1)*100,expectedFutureRevisionPct:(v.newExpectedFutureCents/v.oldExpectedFutureCents-1)*100,homeReturnChangePp:(v.newHomeReturnBps-v.oldHomeReturnBps)/100,newExpectedQuoteChangePct:(q(v.newExpectedFutureCents)/newSpot-1)*100,oldConditionResidual:foreignGross*q(v.oldExpectedFutureCents)/oldSpot-oldDenominator,newConditionResidual:foreignGross*q(v.newExpectedFutureCents)/newSpot-newDenominator,policyCausalEffect:null,realSpotForecast:null});
}
export function fxRelativePriceIndex(v:{oldQuoteCents:number;newQuoteCents:number;homeIndexOld:number;homeIndexNew:number;foreignIndexOld:number;foreignIndexNew:number}){
 if(!quote(v.oldQuoteCents,v.newQuoteCents,v.homeIndexOld,v.homeIndexNew,v.foreignIndexOld,v.foreignIndexNew))return stop('正报价百分刻度及四个正指数整数必须有效；各自指数基期不是跨国篮子价格。');
 const sf=v.newQuoteCents/v.oldQuoteCents,hf=v.homeIndexNew/v.homeIndexOld,ff=v.foreignIndexNew/v.foreignIndexOld,realFactor=sf*ff/hf;
 return ok({nominalQuoteChangePct:(sf-1)*100,homePriceChangePct:(hf-1)*100,foreignPriceChangePct:(ff-1)*100,normalizedRealIndex:100*realFactor,realQuoteChangePct:(realFactor-1)*100,realLogChangePct:Math.log(realFactor)*100,constantRealIndexRequiredQuoteChangePct:(hf/ff-1)*100,absolutePppLevel:null,misvaluation:null,officialBisIndex:null});
}
export function fxBalanceSheet(v:{homeAssets:number;homeLiabilities:number;foreignAssets:number;foreignLiabilities:number;oldQuoteCents:number;newQuoteCents:number}){
 if(!money(v.homeAssets,v.homeLiabilities,v.foreignAssets,v.foreignLiabilities)||!quote(v.oldQuoteCents,v.newQuoteCents))return stop('四组金额非负整数、两报价严格正；暴露按合同币种，不由居住地猜。');
 const oldQuote=q(v.oldQuoteCents),newQuote=q(v.newQuoteCents),netForeign=v.foreignAssets-v.foreignLiabilities,oldAssets=v.homeAssets+oldQuote*v.foreignAssets,newAssets=v.homeAssets+newQuote*v.foreignAssets,oldLiabilities=v.homeLiabilities+oldQuote*v.foreignLiabilities,newLiabilities=v.homeLiabilities+newQuote*v.foreignLiabilities,oldEquity=oldAssets-oldLiabilities,newEquity=newAssets-newLiabilities;
 return ok({netForeign,oldAssets,newAssets,oldLiabilities,newLiabilities,oldEquity,newEquity,equityTranslationChange:netForeign*(newQuote-oldQuote),balanceResidual:(newEquity-oldEquity)-netForeign*(newQuote-oldQuote),newBorrowing:0,actualCreditResponse:null,legalDefault:null});
}
export function fxTradeInvoice(v:{foreignReceipts:number;foreignPayments:number;homeFixedCost:number;oldQuoteCents:number;newQuoteCents:number}){
 if(!money(v.foreignReceipts,v.foreignPayments,v.homeFixedCost)||!quote(v.oldQuoteCents,v.newQuoteCents))return stop('固定外币收付、本币费用与两正报价必须符合整数护照；未给成交数量不填弹性。');
 const oldQuote=q(v.oldQuoteCents),newQuote=q(v.newQuoteCents),netForeign=v.foreignReceipts-v.foreignPayments;
 return ok({netForeignReceipts:netForeign,oldHomeReceipts:oldQuote*v.foreignReceipts,newHomeReceipts:newQuote*v.foreignReceipts,oldHomeImportPayments:oldQuote*v.foreignPayments,newHomeImportPayments:newQuote*v.foreignPayments,oldIllustrativeNetCash:oldQuote*netForeign-v.homeFixedCost,newIllustrativeNetCash:newQuote*netForeign-v.homeFixedCost,netCashTranslationChange:(newQuote-oldQuote)*netForeign,realQuantityResponse:null,macroNetExportEffect:null,statutoryAccountingProfit:null});
}
