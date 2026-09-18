import {lesson320} from './lesson-3-20';
import {canonicalExchangeRateStateExample} from './exchangeRateState';
import {flowCanonicalInputs,flowLabs} from '../components/capitalFlowLabDefinitions';
import {flowTwoLegs,flowBankBorrowing,flowCreditCeiling,flowSecuritySettlement,flowCentralBankOperations,flowForeignPayment,flowFundCashMenu} from '../components/capitalFlowFixtures';
import type {FlowStop,FlowOk} from '../components/capitalFlowFixtures';
function required<T>(r:FlowStop|FlowOk<T>):T{if(r.status==='STOP')throw Error('Invalid capital-flow canonical '+r.reason);return r.value;}
const registeredAt='2026-09-16T00:24:35Z';
const upstream={lessonId:lesson320.id,revision:lesson320.revision,reviewStatus:lesson320.reviewStatus,reviews:lesson320.reviews,
 canonicalNumericalState:canonicalExchangeRateStateExample,
 producerMarker:{lessonId:lesson320.id,revision:lesson320.revision,approvedBodyFrozenAt:canonicalExchangeRateStateExample.clockState.ownReviewFrozenAt},
 role:'actual-approved-identity-and-semantic-prerequisite-not-numerical-calibration',numericValuesConsumed:false,numericCalibration:false};
export const canonicalCapitalFlowStateExample={
 schemaVersion:'canonicalCapitalFlowState.v1',stateId:'3.21-independent-SYN-r1',
 scopePassport:{registeredAt,observedCountry:null,noCommonCountryTrajectory:true,semanticPrerequisites:['3.20'],
  scenarios:flowLabs.map(l=>({id:l.id,scope:l.assumption})),classificationIsNotCause:true},
 inputLineage:[],semanticPrerequisiteState:upstream,
 clockState:{informationCutoff:registeredAt,ownReviewFrozenAt:'2026-09-16T01:00:56.768Z' as string|null,referenceDate:null,firstPublishedAt:null,revisedAt:null,announcementAt:null,executionAt:null,obtainedAt:null,historicalAvailabilityVerified:false,
  eachExperimentIsIndependent:true,c1:'same transaction-valuation window; alternate transaction legs, not IIP stocks',c2:'one isolated borrowing operation at t',c3:'independent dated feasible menu, not actual lending',c4:'payer already holds onshore deposit before this settlement window',c5:'fixed S; two explicitly stipulated operations in order',c6:'same T; available liquid amount excludes separately listed confirmed receipts',c7:'one cash menu; no completed redemption or final NAV'},
 unitContract:{quote:'home currency per one foreign unit; raw positive integer /100; not percentage appreciation',amounts:'independent native/home integer amounts0..1000000',c1:'signed net external transaction legs−1000000..1000000; FA=A−L, inwardN=L−A; |A|+|L| not official gross turnover',
  capital:'independent positive teaching capital1..10000bps /10000 and risk weight1..20000bps /10000; not rate/PD/legal grid',share:'integer percent0..100 /100; divisible teaching units, not statutory lots',fundPrice:'positive integer1..200 percent relative stipulated par1',
  ledgers:'C2/C5 initial accounts and C3/C4/C6/C7 domain/sign/capacity tests on safe-integer products before divisions',c5Output:'all translated and remaining accounts close on integer /100 numerators before final division; no epsilon/clamp',
  money:'CB reserves plus currency is monetary base; total bank deposit liability is not automatically official resident broad money',computation:'finite floating computation; rounded12-digit display is not12-digit ledger accuracy or exact rational trajectory',missing:'null is unknown, not zero; illegal raw/domain input yields STOP without stale result'},
 transactionLegState:{input:flowCanonicalInputs.c1,result:required(flowTwoLegs(flowCanonicalInputs.c1)),actualGrossFlowNetwork:null},
 bankBorrowingState:{input:flowCanonicalInputs.c2,result:required(flowBankBorrowing(flowCanonicalInputs.c2)),actualNextUse:null},
 creditMenuState:{input:flowCanonicalInputs.c3,result:required(flowCreditCeiling(flowCanonicalInputs.c3)),noAutomaticRoomFromC2:true},
 securitySettlementState:{input:flowCanonicalInputs.c4,result:required(flowSecuritySettlement(flowCanonicalInputs.c4)),depositIsAlreadyOnshore:true},
 centralBankOperationState:{input:flowCanonicalInputs.c5,result:required(flowCentralBankOperations(flowCanonicalInputs.c5)),operationStipulatedNotReactionEstimated:true},
 foreignPaymentState:{input:flowCanonicalInputs.c6,result:required(flowForeignPayment(flowCanonicalInputs.c6)),nonoverlappingLiquidAndReceiptsRequired:true,realAccountOverlapAutomaticallyDetected:false},
 fundCashMenuState:{input:flowCanonicalInputs.c7,result:required(flowFundCashMenu(flowCanonicalInputs.c7)),fixedQuoteNotImpactFunction:true},
 assetPriceState:{actualForeignOrders:null,localCounterparties:null,executedPrices:null,collateralRevaluation:null,newIssuanceCosts:null},
 externalAccountState:{version:'BPM7 March2025 white-cover pre-edited selected definitions',actualCA:null,actualKA:null,actualFA:null,actualIIP:null,revaluationIsNotTransaction:true,netLegIsNotPaymentTurnover:true},
 creditBehaviorState:{realBankFundingPrice:null,realDemand:null,approvedLoans:null,actualLoanPrices:null,riskAppetite:null,firmTotalFinancing:null},
 policyResponseState:{actualFxPurchase:null,actualSterilization:null,actualCreditEffect:null,actualInterestEffect:null,actualSterilizationCost:null},
 liquidityFeedbackState:{actualRollover:null,confirmedReceipts:null,actualRedemptions:null,firstMoverCostAllocation:null,endogenousPriceImpact:null,autoRecursivePath:false},
 regimeState:{residenceRules:null,conversionPermissions:null,capitalPermissions:null,realReserveEligibility:null,actualFundRights:null,actualExchangeRegime:null},
 identificationState:{historicalPITVerified:false,bankExposureRandomlyAssigned:null,causalEffect:null,forecastPerformance:null,sourceReadingIsNotReplication:true,preflightIsNotWholeLessonApproval:true},
 welfareState:{actualInvestment:null,actualGDP:null,householdWelfare:null,optimalCapitalPolicy:null,legalDefault:null},
 evidenceState:{mode:'independent-SYN-and-declared-primary-reading',observedMarketSeriesImported:false,numericCalibration:false,productionEligibility:false,sourceTestIsNotTwoIndependentApprovals:true},
 dynamicDataPassports:[],boundaryRoutes:['Chapter1 orders/execution/market liquidity','Chapter2 resident institutions and group networks','3.09–3.13 credit/borrower/appetite/conditions','3.14–3.16 credit/leverage/property feedback','3.20 actual approved semantic identity','3.22 distinct real/financial clocks','4.01/4.08 external accounts/emerging markets','Chapter5 regimes and Chapter7 local falsifiable validation'],
} as const;
export const canonicalCapitalFlowFields=['schemaVersion','stateId','scopePassport','inputLineage','semanticPrerequisiteState','clockState','unitContract','transactionLegState','bankBorrowingState','creditMenuState','securitySettlementState','centralBankOperationState','foreignPaymentState','fundCashMenuState','assetPriceState','externalAccountState','creditBehaviorState','policyResponseState','liquidityFeedbackState','regimeState','identificationState','welfareState','evidenceState','dynamicDataPassports','boundaryRoutes'] as const satisfies readonly(keyof typeof canonicalCapitalFlowStateExample)[];
const s=canonicalCapitalFlowStateExample;
const inputs=[s.transactionLegState.input,s.bankBorrowingState.input,s.creditMenuState.input,s.securitySettlementState.input,s.centralBankOperationState.input,s.foreignPaymentState.input,s.fundCashMenuState.input];
export const canonicalCapitalFlowAudit=[
 {key:'all25 top-level fields exactly enumerated without silent extras',passed:Object.keys(s).length===25&&canonicalCapitalFlowFields.length===25&&new Set(canonicalCapitalFlowFields).size===25&&canonicalCapitalFlowFields.every(k=>Object.hasOwnProperty.call(s,k))},
 {key:'actual approved320 identity, reviews and canonical object preserved, not fabricated or numerically calibrated',passed:upstream.lessonId==='3.20'&&upstream.revision===lesson320.revision&&upstream.reviewStatus==='double-reviewed'&&upstream.reviews===lesson320.reviews&&upstream.canonicalNumericalState===canonicalExchangeRateStateExample&&upstream.producerMarker.approvedBodyFrozenAt==='2026-09-15T23:39:32.675Z'&&!upstream.numericValuesConsumed&&!upstream.numericCalibration&&s.inputLineage.length===0},
 {key:'seven independent exact default input objects retain identity and do not form one country path',passed:inputs.every((input,i)=>input===flowLabs[i].initial)&&s.scopePassport.noCommonCountryTrajectory&&!s.liquidityFeedbackState.autoRecursivePath},
 {key:'registered author clock separate from approved-body and historical market availability clocks',passed:s.clockState.informationCutoff===registeredAt&&Number.isFinite(Date.parse(registeredAt))&&(s.clockState.ownReviewFrozenAt===null||Date.parse(s.clockState.ownReviewFrozenAt)>=Date.parse(registeredAt))&&!s.clockState.historicalAvailabilityVerified},
 {key:'known isolated zeros remain separate from unknown credit/money/permission/NAV/legal outcomes',passed:s.bankBorrowingState.result.isolatedNewHomeLoan===0&&s.securitySettlementState.result.totalBankDepositChange===0&&s.centralBankOperationState.result.netBaseChange===0&&s.centralBankOperationState.result.actualCreditResponse===null&&s.securitySettlementState.result.officialBroadMoneyChange===null&&s.foreignPaymentState.result.legalDefault===null&&s.fundCashMenuState.result.finalPostRedemptionNav===null&&s.fundCashMenuState.result.actuallyPaidRedemption===null},
 {key:'source preparation and finite SYN checks are not causal, PIT, forecast, policy welfare or production certificates',passed:!s.evidenceState.observedMarketSeriesImported&&!s.evidenceState.numericCalibration&&!s.evidenceState.productionEligibility&&!s.identificationState.historicalPITVerified&&s.identificationState.causalEffect===null&&s.identificationState.forecastPerformance===null&&s.welfareState.optimalCapitalPolicy===null},
] as const;
