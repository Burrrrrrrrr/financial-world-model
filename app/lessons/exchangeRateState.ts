import {lesson307} from './lesson-3-07';
import {lesson308} from './lesson-3-08';
import {exchangeRateCanonicalInputs,exchangeRateLabs} from '../components/exchangeRateLabDefinitions';
import {fxQuoteTranslation,fxCoveredReturn,fxUncoveredStates,fxConditionalRepricing,fxRelativePriceIndex,fxBalanceSheet,fxTradeInvoice} from '../components/exchangeRateFixtures';
import type {FxOk,FxStop} from '../components/exchangeRateFixtures';
function required<T>(result:FxOk<T>|FxStop):T {
 if(result.status==='STOP')throw Error(`Invalid exchange-rate canonical: ${result.reason}`);
 return result.value;
}
const registeredAt='2026-09-15T23:11:45Z';
// Existing prerequisites export LessonRecord metadata, NOT instantiated numerical canonical states.
const prerequisites=[lesson307,lesson308].map(lesson=>({
 lessonId:lesson.id,revision:lesson.revision,reviewStatus:lesson.reviewStatus,
 reviews:lesson.reviews,role:'semantic-and-registered-lesson-metadata-only' as const,
 canonicalNumericalState:null,producerMarker:null,numericCalibration:false,
}));
export const canonicalExchangeRateStateExample={
 schemaVersion:'canonicalExchangeRateState.v1',stateId:'3.20-independent-SYN-r1',
 scopePassport:{registeredAt,observedCountry:null,noCommonCountryTrajectory:true,
  scenarios:exchangeRateLabs.map(l=>({id:l.id,scope:l.assumption})),
  noExportedPrerequisiteNumericalProducer:true,semanticPrerequisites:['3.07','3.08'],
  previous319Role:'semantic-background-only; not a numerical producer'},
 inputLineage:[],
 semanticPrerequisiteState:prerequisites,
 clockState:{informationCutoff:registeredAt,ownReviewFrozenAt:'2026-09-15T23:39:32.675Z' as string|null,
  referenceDate:null,firstPublishedAt:null,revisedAt:null,announcementAt:null,
  executionAt:null,obtainedAt:null,historicalAvailabilityVerified:false,
  eachExperimentIsIndependent:true,
  c4:'common valuation t and maturity T; alternative conditions, not successive trades',
  c6:'two valuation dates, unchanged native-currency stocks',
  c7:'one payment date, alternative conversion quotes'},
 unitContract:{quote:'home currency per one foreign unit; integer input /100',
  quoteGridIsNotPercentageChange:true,reverse:'one over S, recompute relative change',
  rates:'integer basis points /10000; whole same-period simple net returns, not annual policy rates',
  grossReturn:'1+r',probability:'given physical integer percent /100; not estimated or risk-neutral',
  simpleExcessPi:'foreign expected home gross return minus home gross return; not EW log rho',
  c4Denominator:'strictly positive integer 10000+homeReturnBps+expectedExcessBps, checked for BOTH conditions before /10000',
  prices:'separate positive own-basket indices; base100 is not a matched basket money cost',
  qIndex:'100 times quote ratio times foreign index ratio / home index ratio; up means real depreciation',
  bisIndex:'NEER/REER up means appreciation; not this bilateral qIndex',
  amounts:'independent synthetic native-currency integer amounts; no cross-C country path',
  computation:'finite floating point; exact algebraic formula is not an exact rational state path; display rounding is not fed back',
  logDisplay:'log ratio times100, percentage-log scale, not ordinary simple-return percent',
  missing:'null remains unknown; invalid complete input yields STOP, not a default value or legal judgment'},
 quotationState:{input:exchangeRateCanonicalInputs.c1,result:required(fxQuoteTranslation(exchangeRateCanonicalInputs.c1))},
 coveredReturnState:{input:exchangeRateCanonicalInputs.c2,result:required(fxCoveredReturn(exchangeRateCanonicalInputs.c2)),actualExecutionCosts:null},
 uncoveredState:{input:exchangeRateCanonicalInputs.c3,result:required(fxUncoveredStates(exchangeRateCanonicalInputs.c3)),actualInformationSet:null},
 conditionalRepricingState:{input:exchangeRateCanonicalInputs.c4,result:required(fxConditionalRepricing(exchangeRateCanonicalInputs.c4)),sharedValuationClock:true,fullMarketClearing:null},
 relativePriceState:{input:exchangeRateCanonicalInputs.c5,result:required(fxRelativePriceIndex(exchangeRateCanonicalInputs.c5)),actualMatchedBasketCosts:null},
 tradeInvoiceState:{input:exchangeRateCanonicalInputs.c7,result:required(fxTradeInvoice(exchangeRateCanonicalInputs.c7)),samePaymentDate:true,statutoryProfit:null},
 currencyBalanceSheetState:{input:exchangeRateCanonicalInputs.c6,result:required(fxBalanceSheet(exchangeRateCanonicalInputs.c6)),actualMaturityMatching:null},
 portfolioDemandState:{actualHoldings:null,hedgeDemand:null,executionQuotes:null,riskBearingCapacity:null,riskAppetite:null},
 externalAccountState:{definitionVersion:'BPM7 March2025 white-cover pre-edited selected passages',
  financialAccountDirection:'net acquisition of external assets minus net incurrence of external liabilities',
  conceptualIdentity:'CA+KA=FA; measured discrepancy remains explicit',
  stockBridge:'opening IIP + transactions + FX/other price revaluation + other volume changes = closing IIP',
  actualCA:null,actualKA:null,actualFA:null,actualIIP:null,actualStatisticalDiscrepancy:null,
  classificationIsNotCause:true,revaluationIsNotTransaction:true},
 ratePathState:{homeExpectedShortRates:null,foreignExpectedShortRates:null,termPremia:null,actualPolicySurprise:null},
 interventionState:{qualifyingReserveAssets:null,actualControl:null,usableResourcesAtDate:null,permissions:null,executedIntervention:null},
 regimeState:{convertibility:null,capitalPermissions:null,settlementRules:null,actualExchangeRegime:null},
 identificationState:{historicalPITVerified:false,causalEffect:null,forecastPerformance:null,executionProfit:null,
  sourceReadingIsNotModelReplication:true,nearRandomWalkIsConditionalNotUniversal:true},
 feedbackState:{actualTradeQuantityResponse:null,actualBankCreditResponse:null,actualPolicyResponse:null,
  actualExpectationsUpdate:null,autoRecursivePath:false},
 outputWelfareState:{actualGDP:null,householdWelfare:null,optimalHedge:null,legalDefault:null,currencyMisvaluation:null},
 evidenceState:{mode:'independent-SYN-and-declared-primary-reading',observedMarketSeriesImported:false,
  numericCalibration:false,realStateProbabilitiesEstimated:false,sourcePreparationIsNotApproval:true,
  sourceTestIsNotWholeLessonApproval:true,productionEligibility:false},
 dynamicDataPassports:[],
 boundaryRoutes:['Chapter1 execution and microstructure','Chapter2 participants and balance sheets',
  '3.07–3.08 semantic prerequisites','Chapter4 cross-market transmission and external accounts',
  'Chapter5 institutions','Chapter6 expectations','Chapter7 local falsifiable research'],
} as const;
export const canonicalExchangeRateFields=[
 'schemaVersion','stateId','scopePassport','inputLineage','semanticPrerequisiteState','clockState',
 'unitContract','quotationState','coveredReturnState','uncoveredState','conditionalRepricingState',
 'relativePriceState','tradeInvoiceState','currencyBalanceSheetState','portfolioDemandState',
 'externalAccountState','ratePathState','interventionState','regimeState','identificationState',
 'feedbackState','outputWelfareState','evidenceState','dynamicDataPassports','boundaryRoutes',
] as const satisfies readonly(keyof typeof canonicalExchangeRateStateExample)[];
const s=canonicalExchangeRateStateExample;
const identityInputs=[s.quotationState.input,s.coveredReturnState.input,s.uncoveredState.input,
 s.conditionalRepricingState.input,s.relativePriceState.input,s.currencyBalanceSheetState.input,s.tradeInvoiceState.input];
export const canonicalExchangeRateAudit=[
 {key:'all25 top-level fields exactly covered, no silent extras',passed:Object.keys(s).length===25&&canonicalExchangeRateFields.length===25&&new Set(canonicalExchangeRateFields).size===25&&canonicalExchangeRateFields.every(k=>Object.prototype.hasOwnProperty.call(s,k))},
 {key:'actual3.07/3.08 metadata identities only; no fabricated numerical producer, lineage or marker',passed:s.inputLineage.length===0&&s.semanticPrerequisiteState.length===2&&s.semanticPrerequisiteState.every((p,i)=>p.lessonId===[lesson307,lesson308][i].id&&p.revision===[lesson307,lesson308][i].revision&&p.reviews===[lesson307,lesson308][i].reviews&&p.reviewStatus==='double-reviewed'&&p.canonicalNumericalState===null&&p.producerMarker===null&&!p.numericCalibration)},
 {key:'seven independent default inputs retain original object identities; no automatic common path',passed:identityInputs.every((input,i)=>input===exchangeRateLabs[i].initial)&&s.scopePassport.noCommonCountryTrajectory&&!s.feedbackState.autoRecursivePath},
 {key:'registered clock is not historical availability; own freeze is absent or separately valid',passed:s.clockState.informationCutoff===s.scopePassport.registeredAt&&Number.isFinite(Date.parse(registeredAt))&&(s.clockState.ownReviewFrozenAt===null||Date.parse(s.clockState.ownReviewFrozenAt)>=Date.parse(registeredAt))&&!s.clockState.historicalAvailabilityVerified},
 {key:'known zero borrowing differs from unknown credit, legal default, quantities, profit and forecasts',passed:s.currencyBalanceSheetState.result.newBorrowing===0&&s.currencyBalanceSheetState.result.actualCreditResponse===null&&s.currencyBalanceSheetState.result.legalDefault===null&&s.tradeInvoiceState.result.realQuantityResponse===null&&s.tradeInvoiceState.result.statutoryAccountingProfit===null&&s.conditionalRepricingState.result.realSpotForecast===null},
 {key:'no observed calibration, invented dynamic data, certified cause or production output',passed:s.dynamicDataPassports.length===0&&!s.evidenceState.observedMarketSeriesImported&&!s.evidenceState.numericCalibration&&!s.evidenceState.productionEligibility&&s.identificationState.causalEffect===null&&s.outputWelfareState.currencyMisvaluation===null},
] as const;
