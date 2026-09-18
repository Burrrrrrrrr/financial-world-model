import {lesson301} from './lesson-3-01';
import {lesson322,canonicalCycleStateExample} from './lesson-3-22';
import {surpriseCanonicalInputs,surpriseEvaluators} from '../components/surpriseFixtures';
import type {SurpriseResult} from '../components/surpriseFixtures';
import {surpriseLabs} from '../components/surpriseLabDefinitions';

function required(r:SurpriseResult):Readonly<Record<string,unknown>>{if(r.status==='STOP')throw Error('Invalid canonical surprise '+r.reason);return r.value;}
const draftPreparedAt='2026-09-16T03:16:00Z';
const prerequisites=[
 {lessonId:lesson301.id,revision:lesson301.revision,reviewStatus:lesson301.reviewStatus,actualLesson:lesson301,reviews:lesson301.reviews,canonicalNumericalState:null,producerMarker:null,numericValuesConsumed:false,numericCalibration:false,meaning:'growth objects and units are semantic prerequisites; no 3.01 number is consumed'},
 {lessonId:lesson322.id,revision:lesson322.revision,reviewStatus:lesson322.reviewStatus,actualLesson:lesson322,reviews:lesson322.reviews,canonicalNumericalState:canonicalCycleStateExample,producerMarker:{field:'clockState.ownReviewFrozenAt',value:canonicalCycleStateExample.clockState.ownReviewFrozenAt},numericValuesConsumed:false,numericCalibration:false,meaning:'cycle state identity and actual approved-body clock preserved only as semantic context, never historical event availability'},
] as const;

export const canonicalSurpriseStateExample={
 schemaVersion:'canonicalMacroSurpriseState.v1',stateId:'3.23-independent-SYN-r1',
 scopePassport:{draftPreparedAt,registeredAt:'2026-09-16T03:24:28Z' as string|null,observedCountry:null,observedAnnouncement:null,observedSecurity:null,semanticPrerequisites:['3.01','3.22'],noCommonEventOrCountryTrajectory:true,scenarios:surpriseLabs.map(l=>({id:l.id,scope:l.passport})),headlineSignIsNotPriceSign:true},
 inputLineage:[],semanticPrerequisiteStates:prerequisites,
 clockState:{draftPreparedAt,registeredAt:'2026-09-16T03:24:28Z' as string|null,ownReviewFrozenAt:'2026-09-16T04:36:59.257Z' as string|null,informationCutoff:null as string|null,referencePeriod:null as string|null,expectationFormation:null as string|null,surveyDeadline:null as string|null,proxyPublishedAt:null as string|null,actualAnnouncementAt:null as string|null,actualReceivedAt:null as string|null,trainingCutoff:null as string|null,modelSelectionCutoff:null as string|null,historicalAvailabilityVerified:false,eachExperimentIsIndependent:true,syntheticOrdinalIsNotCalendar:true},
 unitContract:{growth:'ordinary positive-base/nonnegative-activity growth in integer basis points, lower bound -10000bp',policy:'signed policy-level comparisons in integer basis points, distinct from growth domain',cashflow:'independent nonnegative SYN equity cashflow amount; before strictly positive',totalRequiredReturn:'integer basis points with gross denominator 10000+r strictly positive',clocks:'nonnegative synthetic inclusive ordinals only where declared; not dates or reception latency',exactness:'safe integer arithmetic and factored exact ratios decide branches; twelve-digit decimals are display only',missing:'known zero, as-of unavailable null and illegal STOP remain distinct'},
 comparatorState:{input:surpriseCanonicalInputs.C1,result:required(surpriseEvaluators.C1(surpriseCanonicalInputs.C1)),notObservedAnnouncement:true},
 surveyState:{input:surpriseCanonicalInputs.C2,result:required(surpriseEvaluators.C2(surpriseCanonicalInputs.C2)),notMarketBrain:true},
 availabilityState:{input:surpriseCanonicalInputs.C3,result:required(surpriseEvaluators.C3(surpriseCanonicalInputs.C3)),notHistoricalReleaseArchive:true},
 newsPackageState:{input:surpriseCanonicalInputs.C4,result:required(surpriseEvaluators.C4(surpriseCanonicalInputs.C4)),notEstimatedPriceWeight:true},
 scaleState:{input:surpriseCanonicalInputs.C5,result:required(surpriseEvaluators.C5(surpriseCanonicalInputs.C5)),notAbdvReplication:true},
 valuationState:{input:surpriseCanonicalInputs.C6,result:required(surpriseEvaluators.C6(surpriseCanonicalInputs.C6)),notObservedStockOrGeneralAssetPricingModel:true},
 policyState:{input:surpriseCanonicalInputs.C7,result:required(surpriseEvaluators.C7(surpriseCanonicalInputs.C7)),notGssFuturesFactorReplication:true},
 actualMacroState:{actualRelease:null,actualReferencePeriod:null,actualVintage:null,actualRevision:null,officialStatisticTruth:null,observedGrowth:null,observedEmployment:null,observedPolicyAction:null},
 actualExpectationState:{individualFormationTimes:null,surveyPanel:null,surveyWeights:null,instantaneousConditionalMean:null,proxyBias:null,proxyStaleness:null,actualForecastErrorScale:null},
 actualMarketState:{security:null,priceBefore:null,priceAfter:null,returnWindow:null,cashflowRevision:null,riskFreeRevision:null,riskPremiumRevision:null,orders:null,liquidity:null,positionConstraints:null},
 actualPolicyState:{targetSurprise:null,pathSurprise:null,settlementScaling:null,rotatedFactors:null,externalPolicyShock:null,structuralAttribution:null},
 trainingState:{realDataset:null,realVintages:null,realTrainingWindow:null,actualModelChoice:null,actualFrozenParameters:null,actualReceptionLogs:null,futureInfluenceCertifiedAbsent:false},
 identificationState:{historicalPITVerified:false,outOfSampleVerified:false,causalEffect:null,statisticalSignificance:null,proxyValidity:null,windowExogeneity:null,replicationCompleted:false,sourceReadingIsNotReplication:true,finitePreflightIsNotWholeLessonApproval:true},
 feedbackState:{macroToCashflow:null,macroToRequiredReturn:null,priceToPolicy:null,priceToActivity:null,ordersToPrice:null,autoRecursivePath:false},
 evidenceState:{mode:'independent-SYN-with-declared-primary-reading',observedSeriesImported:false,numericCalibration:false,productionEligibility:false,twoFullApprovalsRegistered:true},
 dynamicDataPassports:[],
 boundaryRoutes:['3.01 growth/level/unit semantics','3.22 state/vintage/feedback context','Chapter1 order flow and liquidity','Chapter2 heterogeneous expectations/constraints','Chapter4 cross-asset cashflow/discount/path transmission','Chapter5 release institutions and clocks','Chapter6 beliefs/narratives','Chapter7 PIT/OOS/causal research design'],
} as const;

export const canonicalSurpriseFields=['schemaVersion','stateId','scopePassport','inputLineage','semanticPrerequisiteStates','clockState','unitContract','comparatorState','surveyState','availabilityState','newsPackageState','scaleState','valuationState','policyState','actualMacroState','actualExpectationState','actualMarketState','actualPolicyState','trainingState','identificationState','feedbackState','evidenceState','dynamicDataPassports','boundaryRoutes'] as const satisfies readonly(keyof typeof canonicalSurpriseStateExample)[];
const s=canonicalSurpriseStateExample;
const inputs=[s.comparatorState.input,s.surveyState.input,s.availabilityState.input,s.newsPackageState.input,s.scaleState.input,s.valuationState.input,s.policyState.input];
export const canonicalSurpriseAudit=[
 {key:'all24 top-level fields exactly enumerated with no silent extras',passed:Object.keys(s).length===24&&canonicalSurpriseFields.length===24&&new Set(canonicalSurpriseFields).size===24&&canonicalSurpriseFields.every(k=>Object.hasOwnProperty.call(s,k))},
 {key:'actual approved3.01 and3.22 identities preserved as semantics without numerical consumption',passed:prerequisites[0].actualLesson===lesson301&&prerequisites[0].reviews===lesson301.reviews&&prerequisites[0].reviewStatus==='double-reviewed'&&prerequisites[1].actualLesson===lesson322&&prerequisites[1].reviews===lesson322.reviews&&prerequisites[1].reviewStatus==='double-reviewed'&&prerequisites[1].canonicalNumericalState===canonicalCycleStateExample&&prerequisites[1].producerMarker.value===canonicalCycleStateExample.clockState.ownReviewFrozenAt&&prerequisites.every(p=>!p.numericValuesConsumed&&!p.numericCalibration)&&s.inputLineage.length===0},
 {key:'seven exact independent canonical input identities and no auto-recursive event path',passed:inputs.length===7&&inputs.every((input,i)=>input===surpriseLabs[i].initial)&&s.scopePassport.noCommonEventOrCountryTrajectory&&!s.feedbackState.autoRecursivePath},
 {key:'draft/registration/review clocks never certify historical availability',passed:Number.isFinite(Date.parse(draftPreparedAt))&&(s.clockState.registeredAt===null||Number.isFinite(Date.parse(s.clockState.registeredAt)))&&(s.clockState.ownReviewFrozenAt===null||Number.isFinite(Date.parse(s.clockState.ownReviewFrozenAt)))&&!s.clockState.historicalAvailabilityVerified&&s.clockState.informationCutoff===null},
 {key:'known zero, retrospective arithmetic and as-of unknown remain distinct',passed:s.surveyState.result.retrospectiveActualMinusMedianBp===0&&s.availabilityState.result.asOfActualBp===null&&s.availabilityState.result.retrospectiveDifferenceUsingEligibleFrozenProxyBp===-100&&s.newsPackageState.result.currentMatchedDifferenceBp===50&&s.scaleState.result.asOfStandardizedSurprise===null&&s.valuationState.result.observedStockPrice===null&&s.policyState.result.originalGssFuturesMeasureBp===null},
 {key:'whole-body approval flag matches own clock but never certifies data, PIT/OOS/causal or production',passed:s.evidenceState.twoFullApprovalsRegistered===(s.clockState.ownReviewFrozenAt!==null)&&!s.evidenceState.observedSeriesImported&&!s.evidenceState.numericCalibration&&!s.evidenceState.productionEligibility&&!s.identificationState.historicalPITVerified&&!s.identificationState.outOfSampleVerified&&s.identificationState.causalEffect===null&&s.dynamicDataPassports.length===0},
] as const;
