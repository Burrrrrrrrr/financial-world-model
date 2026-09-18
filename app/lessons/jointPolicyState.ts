import {canonicalFiscalPolicyStateExample,lesson317} from './lesson-3-17';
import {jointCanonicalInputs,jointPurchasingPower,jointRandomPurchasingPower,jointConsolidation,jointInterestCost,jointRemittanceLedger,jointRealBudgetIdentity,jointLeeperRootConfiguration} from '../components/jointPolicyFixtures';
import type {JointResult} from '../components/jointPolicyFixtures';
import {jointLabs} from '../components/jointLabDefinitions';
function required<T>(r:JointResult<T>):T{if(r.status==='STOP')throw new Error(`Invalid canonical: ${r.reason}`);return r.result;}
export const jointCanonicalResults={
 c1:required(jointPurchasingPower(5,2)),c2:required(jointRandomPurchasingPower(5,0,10,.5)),c3:required(jointConsolidation(100,60)),c4:required(jointInterestCost(40,3,0,6,60,6,0)),c5:required(jointRemittanceLedger(20,30,5)),c6:required(jointRealBudgetIdentity(100,3,10,5)),c7:required(jointLeeperRootConfiguration(.8,2,1)),
} as const;
const registeredAt='2026-09-15T16:05:04Z';
const contextPaths=['stateId','schemaVersion','scopePassport','interventionPassport','counterfactualState','identificationState','financingState','evidenceState','boundaryRoutes'] as const;
export const canonicalJointPolicyStateExample={
 schemaVersion:'joint-fiscal-monetary-mechanism-state-v1',stateId:'SYNTHETIC_REGISTERED_JOINT_POLICY_STATE',
 scopePassport:{registeredAt,scenarios:jointLabs.map(l=>({id:l.id,scope:l.assumption})),noCommonCountryOrPublicSectorTrajectory:true,observedCountry:null,upstreamContextOnly:true},
 inputLineage:[{producerLessonId:'3.17',producerRevision:lesson317.revision,producerStateId:canonicalFiscalPolicyStateExample.stateId,producerRevisionMarker:canonicalFiscalPolicyStateExample.clockState.ownReviewFrozenAt,registrationCutoff:registeredAt,numericCalibration:false,mappings:contextPaths.map(sourcePath=>({sourcePath,targetPath:`upstreamFiscalPolicyState.${sourcePath}`}))}],
 upstreamFiscalPolicyState:canonicalFiscalPolicyStateExample,
 semanticPrerequisiteState:{lesson:'3.05-r4',canonicalProducerExists:false,role:'semantic-condition-response-only',numericalBridge:null},
 clockState:{informationCutoff:registeredAt,ownReviewFrozenAt:'2026-09-15T21:22:28.666Z',calendarPeriodMapping:null,announcementAt:null,executionAt:null,priceDataAvailableAt:null,eachExperimentIsIndependent:true},
 unitContract:{c1:'net-percent-input-given-one-period-price-ratio',c2:'two-given-price-scenarios-and-probability-not-estimated',c3:'instant-par-principal-swap-whole-SYN-not-fiscal-spending',c4:'fixed-initial-principal-one-common-period-contractual-interest',c5:'whole-SYN-income-expense-flow-and-earnings-carry-stock',c6:'real-given-rate-and-whole-SYN-primary-flow-not-debt-GDP',c7:'dimensionless-local-root-not-general-net-Taylor-percent',amountLimit:1_000_000,rateGrid:'integer-basis-points',probabilityGrid:'integer-probability-percent',finalDivisionRounds:true,outputsAutomaticallyRecursive:false},
 jointInterventionPassport:{realFiscalTreatment:null,realMonetaryRule:null,fixedToolIsFixedRule:false,independentMonetaryInnovation:null,observedCoordination:null},
 purchasingPowerState:{input:jointCanonicalInputs.c1,result:jointCanonicalResults.c1,isStochasticEquilibrium:false},
 randomScenarioState:{input:jointCanonicalInputs.c2,result:jointCanonicalResults.c2,isSWMoneyDemandModel:false},
 consolidationState:{input:jointCanonicalInputs.c3,result:jointCanonicalResults.c3,seller:'private-bank',nonbankDepositLayerIncluded:false},
 interestCostState:{input:jointCanonicalInputs.c4,result:jointCanonicalResults.c4,assetIncomeIncluded:false,financingOfFeesSolved:false},
 remittanceState:{input:jointCanonicalInputs.c5,result:jointCanonicalResults.c5,model:'simplified-US-inspired-not-all-legal-adjustments'},
 realBudgetState:{input:jointCanonicalInputs.c6,result:jointCanonicalResults.c6,realRateIsGiven:true,defaultAllowed:false,assetsAndFXIncluded:false,priceDeterminationSolved:false},
 localRuleState:{input:jointCanonicalInputs.c7,result:jointCanonicalResults.c7,positiveSteadyStateSolved:false,independentInnovationAssumptionsVerifiedForCountry:false,globalEquilibriumSolved:false},
 demandResourceState:{actualOutput:null,employment:null,inflation:null,privateSpending:null,deliveryCapacity:null,financingAvailability:null},
 fiscalBackingState:{futurePrimaryBalancePath:null,noninterestMoneyDemand:null,defaultProbability:null,noBubbleConditionVerified:false},
 identificationState:{realNewsSeries:null,structuralAlpha:null,equilibriumOLSAlpha:null,observedPolicyRegime:null,causalJointResponse:null,fitImpliesStructuralIdentity:false},
 feedbackState:{incomeTaxBase:'conditional-unestimated',publicFeesRemittance:'separate-one-period-SYN-ledgers',futurePolicyExpectation:'conditional-unestimated',fullCountryRecursionSolved:false},
 outputWelfareState:{causalGDP:null,householdWelfare:null,optimalRegime:null,debtSafety:null,assetAllocationInstruction:null},
 evidenceState:{arithmetic:'bounded-SYN-audited-not-content-approval',observedMacroDatasetImported:false,historicalPIT:false,forecastStatus:'not-estimated',causalStatus:'not-identified',swOfficialByteEquivalenceProven:false,bis954HistoricalByteEquivalenceProven:false,allReferencedPapersRead:false},
 dynamicDataPassports:[],
 boundaryRoutes:[{destination:'3.19',payload:'external-principal-interest-clocks-backing-default-boundaries',guardrail:'no-sovereign-safety-from-arithmetic'},{destination:'5.04',payload:'commitment-direction-and-legal-authority',guardrail:'no-country-regime-from-local-roots'},{destination:'Chapter7',payload:'treatment-news-joint-counterfactual-time-and-identification',guardrail:'no-historical-PIT-or-causal-estimate-implied'}],
} as const;
export const canonicalJointPolicyFields=['schemaVersion','stateId','scopePassport','inputLineage','upstreamFiscalPolicyState','semanticPrerequisiteState','clockState','unitContract','jointInterventionPassport','purchasingPowerState','randomScenarioState','consolidationState','interestCostState','remittanceState','realBudgetState','localRuleState','demandResourceState','fiscalBackingState','identificationState','feedbackState','outputWelfareState','evidenceState','dynamicDataPassports','boundaryRoutes'] as const satisfies readonly(keyof typeof canonicalJointPolicyStateExample)[];
function pathValue(object:unknown,path:string):{found:boolean;value?:unknown}{let value=object;for(const key of path.split('.')){if(typeof value!=='object'||value===null||!Object.prototype.hasOwnProperty.call(value,key))return{found:false};value=(value as Record<string,unknown>)[key];}return{found:true,value};}
export function jointSameMapping(source:unknown,target:unknown,a:string,b:string){const x=pathValue(source,a),y=pathValue(target,b);return x.found&&y.found&&x.value!==undefined&&y.value!==undefined&&Object.is(x.value,y.value);}
const s=canonicalJointPolicyStateExample;
export const canonicalJointPolicyAudit=[
 {key:'all 24 top-level canonical fields exactly covered without silent extra keys',passed:Object.keys(s).length===24&&canonicalJointPolicyFields.length===24&&new Set(canonicalJointPolicyFields).size===24&&canonicalJointPolicyFields.every(k=>Object.prototype.hasOwnProperty.call(s,k))},
 {key:'one actual sealed 3.17 context, nine identity maps, no numerical calibration',passed:s.inputLineage.length===1&&!s.inputLineage[0].numericCalibration&&s.upstreamFiscalPolicyState===canonicalFiscalPolicyStateExample&&s.inputLineage[0].producerRevision===lesson317.revision&&s.inputLineage[0].mappings.length===9&&s.inputLineage[0].mappings.every(m=>jointSameMapping(canonicalFiscalPolicyStateExample,s,m.sourcePath,m.targetPath))},
 {key:'missing/wrong/equal-clone bridges fail; 3.05 has no fake canonical producer',passed:!jointSameMapping(canonicalFiscalPolicyStateExample,s,'__missing__','upstreamFiscalPolicyState.stateId')&&!jointSameMapping(canonicalFiscalPolicyStateExample,s,'scopePassport','upstreamFiscalPolicyState.evidenceState')&&!jointSameMapping({a:{x:1}},{b:{x:1}},'a','b')&&!s.semanticPrerequisiteState.canonicalProducerExists},
 {key:'actual producer approved-body marker no later than registration cutoff',passed:Date.parse(s.inputLineage[0].producerRevisionMarker)<=Date.parse(registeredAt)&&s.clockState.informationCutoff===s.scopePassport.registeredAt},
 {key:'seven independent experiments retain canonical input identities',passed:s.scopePassport.scenarios.length===7&&s.scopePassport.noCommonCountryOrPublicSectorTrajectory&&s.purchasingPowerState.input===jointCanonicalInputs.c1&&s.localRuleState.input===jointCanonicalInputs.c7&&!s.unitContract.outputsAutomaticallyRecursive},
 {key:'internal/external principal, flow/stock, and paid/noninterest liabilities separate',passed:s.consolidationState.result.consolidatedExternalPrincipal===100&&s.consolidationState.result.internalBondPairRemoved===60&&s.interestCostState.result.totalExternalInterest===4.8&&s.realBudgetState.result.newRealBondPrincipal===108&&s.realBudgetState.result.realDebtChange===8&&s.remittanceState.result.newDeferredEarningsRequirement===15},
 {key:'no observed macro, PIT, causal output, prediction, welfare or sovereign safety invented',passed:s.dynamicDataPassports.length===0&&!s.evidenceState.observedMacroDatasetImported&&!s.evidenceState.historicalPIT&&s.demandResourceState.actualOutput===null&&s.identificationState.causalJointResponse===null&&s.outputWelfareState.debtSafety===null&&s.outputWelfareState.householdWelfare===null},
] as const;
