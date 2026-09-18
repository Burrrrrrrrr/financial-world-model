/** Seven independent stipulated teaching contracts, not observed transactions, approval rules, capital permissions or forecasts. */
export type FlowStop={status:'STOP';reason:string};
export type FlowOk<T>={status:'OK';value:T};
const stop=(reason:string):FlowStop=>({status:'STOP',reason});
const ok=<T,>(value:T):FlowOk<T>=>({status:'OK',value});
const grid=(x:number,min:number,max:number)=>Number.isSafeInteger(x)&&x>=min&&x<=max;
const amount=(...xs:number[])=>xs.every(x=>grid(x,0,1_000_000));
const positive=(...xs:number[])=>xs.every(x=>grid(x,1,1_000_000));
export type FlowLegInput={assetsNetAcquisition:number;liabilitiesNetIncurrence:number;alternativeAssetsNetAcquisition:number;alternativeLiabilitiesNetIncurrence:number};
export function flowTwoLegs(v:FlowLegInput){
 if(![v.assetsNetAcquisition,v.liabilitiesNetIncurrence,v.alternativeAssetsNetAcquisition,v.alternativeLiabilitiesNetIncurrence].every(x=>grid(x,-1_000_000,1_000_000)))return stop('四项为同窗口交易估值的带符号净交易整数；缺失、字符串或负持仓的隐式解释均不可替代。');
 const a=v.assetsNetAcquisition,l=v.liabilitiesNetIncurrence,aa=v.alternativeAssetsNetAcquisition,al=v.alternativeLiabilitiesNetIncurrence;
 return ok({assetLeg:a,liabilityLeg:l,financialAccount:a-l,inwardNetFinancing:l-a,alternativeAssetLeg:aa,alternativeLiabilityLeg:al,alternativeFinancialAccount:aa-al,alternativeInwardNetFinancing:al-aa,teachingLegMagnitude:Math.abs(a)+Math.abs(l),alternativeTeachingLegMagnitude:Math.abs(aa)+Math.abs(al),closingIip:null,officialGrossTurnover:null,currentAccountCause:null,actualDomesticCredit:null});
}
export type FlowBankInput={initialLoans:number;initialHomeReserves:number;initialHomeDeposits:number;equity:number;newBorrowingForeign:number;spotCents:number};
export function flowBankBorrowing(v:FlowBankInput){
 if(!amount(v.initialLoans,v.initialHomeReserves,v.initialHomeDeposits,v.newBorrowingForeign)||!positive(v.equity,v.spotCents))return stop('金额为非负整数，权益和本币/一外币报价百分刻度严格正；不能将空权益补成1。');
 if(v.initialLoans+v.initialHomeReserves!==v.initialHomeDeposits+v.equity)return stop('起始简化银行账须按整数精确平衡：贷款+本币央行准备金=本币存款+权益。');
 const spot=v.spotCents/100,proceedsHome=v.newBorrowingForeign*v.spotCents/100,initialAssets=v.initialLoans+v.initialHomeReserves;
 return ok({spot,foreignDepositAsset:v.newBorrowingForeign,foreignBorrowingLiability:v.newBorrowingForeign,proceedsHome,initialAssets,finalAssets:initialAssets+proceedsHome,initialLiabilities:v.initialHomeDeposits,finalLiabilities:v.initialHomeDeposits+proceedsHome,initialEquity:v.equity,finalEquity:v.equity,initialLeverage:initialAssets/v.equity,finalLeverage:(initialAssets+proceedsHome)/v.equity,finalHomeReserves:v.initialHomeReserves,finalHomeDeposits:v.initialHomeDeposits,finalHomeLoans:v.initialLoans,netForeignPrincipal:0,isolatedNewHomeLoan:0,isolatedNewHomeBase:0,futureActualLending:null,maturityMatched:null,foreignAssetCreditRisk:null,legalSolvency:null});
}
export type FlowCreditInput={fundingRoom:number;equity:number;capitalFloorBps:number;existingRWA:number;newLoanRiskWeightBps:number;demand:number};
export function flowCreditCeiling(v:FlowCreditInput){
 if(!amount(v.fundingRoom,v.equity,v.existingRWA,v.demand)||!grid(v.capitalFloorBps,1,10_000)||!grid(v.newLoanRiskWeightBps,1,20_000))return stop('融资菜单、权益、RWA与需求为非负整数；教学资本比率1至10000基点、风险权重1至20000基点严格正，非利率网格。');
 const capitalSlackNumerator=v.equity*10_000-v.existingRWA*v.capitalFloorBps;
 // The integer sign is checked before division; no epsilon-clamp converts a zero or negative slack into positive headroom.
 const capitalHeadroom=capitalSlackNumerator<=0?0:capitalSlackNumerator*10_000/(v.capitalFloorBps*v.newLoanRiskWeightBps);
 const feasibleCeiling=Math.min(v.fundingRoom,capitalHeadroom,v.demand);
 return ok({capitalFloor:v.capitalFloorBps/10_000,newLoanRiskWeight:v.newLoanRiskWeightBps/10_000,capitalSlackNumerator,initialStipulatedFloorSatisfied:capitalSlackNumerator>=0,capitalHeadroom,fundingRoom:v.fundingRoom,demand:v.demand,feasibleCeiling,fundingBinding:v.fundingRoom===feasibleCeiling,capitalBinding:capitalHeadroom===feasibleCeiling,demandBinding:v.demand===feasibleCeiling,actualLoanApproved:null,actualLoanRate:null,actualLenderAppetite:null,regulatoryCertification:null});
}
export type FlowSecurityInput={totalHomePayment:number;primaryPct:number;unitPriceCents:number;availableExistingUnits:number};
export function flowSecuritySettlement(v:FlowSecurityInput){
 if(!amount(v.totalHomePayment,v.availableExistingUnits)||!grid(v.primaryPct,0,100)||!positive(v.unitPriceCents))return stop('给定已在岸支付额/可售旧单位非负整数，一级支付比例0至100，单位价格百分刻度严格正。');
 // Both fractional share and /100 unit-price scales cancel, so this availability test is exact on integer products.
 if(v.totalHomePayment*(100-v.primaryPct)>v.availableExistingUnits*v.unitPriceCents)return stop('二级支付需要的旧单位超过题设可售库存；按整数乘积核验，不以浮点舍入放行。');
 const primaryCash=v.totalHomePayment*v.primaryPct/100,secondaryCash=v.totalHomePayment-primaryCash,unitPrice=v.unitPriceCents/100;
 return ok({unitPrice,payerDepositChange:-v.totalHomePayment,issuerDepositChange:primaryCash,sellerDepositChange:secondaryCash,primaryCash,secondaryCash,newIssuedUnits:v.totalHomePayment*v.primaryPct/v.unitPriceCents,existingTransferredUnits:v.totalHomePayment*(100-v.primaryPct)/v.unitPriceCents,totalBankDepositChange:0,newSecurityExternalLiabilityTransaction:v.totalHomePayment,externalBankDepositLiabilityTransaction:-v.totalHomePayment,combinedExternalNetLiabilityTransaction:0,isolatedNewHomeLoan:0,isolatedNewHomeBase:0,priorDepositFunding:null,actualInvestment:null,actualPriceImpact:null,officialBroadMoneyChange:null,actualLegalIssuance:null});
}
export type FlowCentralBankInput={foreignAssetsInitial:number;spotCents:number;domesticClaimsInitial:number;bankReservesInitial:number;currencyInitial:number;equity:number;purchasedForeign:number;absorbedHome:number};
export function flowCentralBankOperations(v:FlowCentralBankInput){
 if(!amount(v.foreignAssetsInitial,v.domesticClaimsInitial,v.bankReservesInitial,v.currencyInitial,v.equity,v.purchasedForeign,v.absorbedHome)||!positive(v.spotCents))return stop('七项本外币原金额非负整数，固定正报价百分刻度有效；央行操作与资产可用性由本SYN明确给定。');
 if(v.foreignAssetsInitial*v.spotCents+v.domesticClaimsInitial*100!==(v.bankReservesInitial+v.currencyInitial+v.equity)*100)return stop('起始央行账须按整数翻译精确平衡；没有自动生成补差资产或权益。');
 if(v.absorbedHome>v.domesticClaimsInitial||v.absorbedHome*100>v.bankReservesInitial*100+v.purchasedForeign*v.spotCents)return stop('另行出售国内债权不能超过已持有债权，也不能扣除超过购买后准备金的余额。');
 // Close every translated ledger on the safe-integer /100 grid before the final division.
 // Independent r1 review found exact zero reserves becoming negative when multiplying an already rounded spot.
 const spot=v.spotCents/100,purchaseGrid=v.purchasedForeign*v.spotCents,assetGrid=v.foreignAssetsInitial*v.spotCents+v.domesticClaimsInitial*100,baseGrid=(v.bankReservesInitial+v.currencyInitial)*100,absorbGrid=v.absorbedHome*100;
 return ok({spot,purchaseHome:purchaseGrid/100,initialAssets:assetGrid/100,assetsAfterPurchase:(assetGrid+purchaseGrid)/100,finalAssets:(assetGrid+purchaseGrid-absorbGrid)/100,initialBase:baseGrid/100,baseAfterPurchase:(baseGrid+purchaseGrid)/100,finalBase:(baseGrid+purchaseGrid-absorbGrid)/100,netBaseChange:(purchaseGrid-absorbGrid)/100,finalBankReserves:(v.bankReservesInitial*100+purchaseGrid-absorbGrid)/100,finalCurrency:v.currencyInitial,finalForeignAssetsNative:v.foreignAssetsInitial+v.purchasedForeign,finalForeignAssetsHome:(v.foreignAssetsInitial+v.purchasedForeign)*v.spotCents/100,finalDomesticClaims:v.domesticClaimsInitial-v.absorbedHome,finalEquity:v.equity,automaticFxPurchaseFromAnyInflow:null,actualBroadMoney:null,actualCreditResponse:null,actualInterestResponse:null,actualExchangePriceResponse:null,sterilizationCost:null,legalReserveClassification:null,policyWelfare:null});
}
export type FlowPaymentInput={foreignDue:number;foreignLiquid:number;confirmedForeignReceipts:number;homeCash:number;convertibleHomePct:number;spotCents:number};
export function flowForeignPayment(v:FlowPaymentInput){
 if(!amount(v.foreignDue,v.foreignLiquid,v.confirmedForeignReceipts,v.homeCash)||!grid(v.convertibleHomePct,0,100)||!positive(v.spotCents))return stop('同一T已确认可用的四项金额非负整数，题设可兑换比例0至100和正报价有效；未承诺未来流入不得填已可用现金。');
 const spot=v.spotCents/100,availableForeign=v.foreignLiquid+v.confirmedForeignReceipts,foreignStillNeeded=Math.max(0,v.foreignDue-availableForeign),convertibleHomeCapacity=v.homeCash*v.convertibleHomePct/100;
 const canFullyCover=v.homeCash*v.convertibleHomePct>=foreignStillNeeded*v.spotCents;
 const homeUsed=canFullyCover?foreignStillNeeded*v.spotCents/100:convertibleHomeCapacity,boughtForeign=canFullyCover?foreignStillNeeded:v.homeCash*v.convertibleHomePct/v.spotCents;
 const foreignGap=canFullyCover?0:(foreignStillNeeded*v.spotCents-v.homeCash*v.convertibleHomePct)/v.spotCents;
 return ok({spot,availableForeign,foreignStillNeeded,convertibleHomeCapacity,homeUsed,boughtForeign,foreignGap,homeEquivalentGap:canFullyCover?0:(foreignStillNeeded*v.spotCents-v.homeCash*v.convertibleHomePct)/100,endingHomeCash:canFullyCover?(v.homeCash*100-foreignStillNeeded*v.spotCents)/100:v.homeCash*(100-v.convertibleHomePct)/100,foreignSurplusBeforeConversion:Math.max(0,availableForeign-v.foreignDue),actualConversionPermission:null,actualFundingRenewal:null,legalDefault:null,totalSolvency:null,futureDomesticLending:null,realExchangePriceCause:null});
}
export type FlowFundInput={assetFace:number;executionPricePct:number;buyCapacityFace:number;cash:number;requestedCash:number};
export function flowFundCashMenu(v:FlowFundInput){
 if(!amount(v.assetFace,v.buyCapacityFace,v.cash,v.requestedCash)||!grid(v.executionPricePct,1,200))return stop('面值单位/买方容量/现金/本窗口给定现金需求非负整数，执行条件价1至200整数百分比严格正；不是已识别价格冲击函数。');
 const executionPrice=v.executionPricePct/100,cashNeed=Math.max(0,v.requestedCash-v.cash),desiredSaleFace=cashNeed*100/v.executionPricePct,availableFace=Math.min(v.assetFace,v.buyCapacityFace);
 const canFullyCover=availableFace*v.executionPricePct>=cashNeed*100,executedSaleFace=canFullyCover?desiredSaleFace:availableFace;
 const saleProceeds=canFullyCover?cashNeed:availableFace*v.executionPricePct/100,attainableCash=v.cash+saleProceeds,cashGap=canFullyCover?0:(cashNeed*100-availableFace*v.executionPricePct)/100;
 return ok({executionPrice,cashNeed,desiredSaleFace,executedSaleFace,saleProceeds,attainableCash,cashGap,saleLossRelativeToStipulatedPar:executedSaleFace-saleProceeds,remainingAssetFace:v.assetFace-executedSaleFace,preUseAssetsAtGivenPrice:v.assetFace*executionPrice+v.cash,preUseAssetsAtStipulatedPar:v.assetFace+v.cash,holdingsBinding:v.assetFace===executedSaleFace,bidCapacityBinding:v.buyCapacityFace===executedSaleFace,needBinding:desiredSaleFace===executedSaleFace,actuallyPaidRedemption:null,finalPostRedemptionNav:null,legalRedemptionRights:null,netCrossBorderOutflow:null,endogenousPriceImpact:null,actualGatingDecision:null,actualFundLeverage:null});
}
