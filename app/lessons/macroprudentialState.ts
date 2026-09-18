import { lesson314 } from './lesson-3-14';
import { lesson315 } from './lesson-3-15';
import { macroCanonicalInputs, macroEvaluators } from '../components/macroprudentialFixtures';
import type { MacroLabId } from '../components/macroprudentialFixtures';
import {
  macroprudentialFailedDownloadLedger,
  macroprudentialInterfaces,
  macroprudentialInvariants,
  macroprudentialSourceArchiveLedger,
} from './macroprudentialStudy';

const semanticPrerequisiteStates = [
  {
    lessonId: lesson314.id,
    revision: lesson314.revision,
    reviewStatus: lesson314.reviewStatus,
    reviews: lesson314.reviews,
    actualLesson: lesson314,
    meaning: 'credit stocks, flows, collateral, loss-capital feedback and identification semantics only',
    numericValuesConsumed: false,
    numericCalibration: false,
  },
  {
    lessonId: lesson315.id,
    revision: lesson315.revision,
    reviewStatus: lesson315.reviewStatus,
    reviews: lesson315.reviews,
    actualLesson: lesson315,
    meaning: 'debt contracts, leverage denominators, maturity, debt service and repair-path semantics only',
    numericValuesConsumed: false,
    numericCalibration: false,
  },
] as const;

const labResults = Object.fromEntries((Object.keys(macroCanonicalInputs) as MacroLabId[]).map(id => [id, macroEvaluators[id](macroCanonicalInputs[id])])) as Readonly<Record<MacroLabId, ReturnType<(typeof macroEvaluators)[MacroLabId]>>>;

export const canonicalMacroprudentialStateExample = {
  schemaVersion: 'canonicalMacroprudentialPolicyState.v1',
  lessonId: '3.24',
  clockState: {
    sourcePassportRecordedAt: '2026-09-16T03:58:32Z',
    draftPreparedAt: '2026-09-16',
    registeredAt: '2026-09-16T05:23:17Z',
    ownReviewFrozenAt: '2026-09-16T07:06:09.360Z',
    realPolicyAsOf: null,
    realAnnouncementTime: null,
    realEffectiveTime: null,
    realReleaseTime: null,
    pointInTimeDatasetCutoff: null,
  },
  semanticPrerequisiteStates,
  policyObjectiveState: {
    finalObjective: 'reduce systemic-risk frequency/severity and preserve critical financial services to the real economy',
    intermediateObjectives: ['resilience buffer', 'procyclical vulnerability', 'structural interconnectedness/common exposure', 'liquidity/maturity mismatch', 'critical infrastructure resilience'],
    leaningAndResilienceSeparated: true,
    monetaryPolicyReplacementClaimed: false,
    fiscalPolicyReplacementClaimed: false,
    microprudentialReplacementClaimed: false,
  },
  vulnerabilityMap: {
    timeDimension: ['leverage build-up', 'collateral feedback', 'risk-taking feedback', 'maturity and repricing clocks'],
    crossSectionDimension: ['size', 'substitutability', 'interconnectedness', 'common exposures', 'critical infrastructure'],
    systemicExternalities: ['fire-sale price effects', 'contagion', 'credit-service interruption', 'public-resolution costs'],
    realJurisdictionCalibration: null,
  },
  instrumentMap: {
    lenderCapital: ['broad capital', 'CCyB', 'sectoral capital or risk weights', 'exposure limits'],
    borrowerBased: ['LTV', 'LTI', 'DTI', 'DSTI'],
    liquidityAndFunding: ['HQLA/LCR-type', 'stable-funding-type', 'loan-to-deposit-type', 'FX/maturity mismatch'],
    structural: ['systemic-importance surcharge', 'large exposure', 'resolvability', 'clearing and margin arrangements'],
    instrumentIdentityDependsOnObjectiveCalibrationScopeGovernance: true,
    currentLegalRequirements: null,
  },
  labInputState: {
    inputs: macroCanonicalInputs,
    allIndependentSyn: true,
    commonCountry: null,
    commonEventClock: null,
    realCalibration: false,
  },
  labResultState: {
    results: labResults,
    externalFiniteMathAudit: {
      fixtureSha256: '69abfec363f11a22e1bd87746800febb8f8301be84eb71efa8d56d43499c937c',
      artifact: 'tmp/research/3-24-root-fixture-math-draft-r2.json',
      assertionsPassed: 632,
      assertionsTotal: 632,
      evaluatorCalls: 551,
      isContentApproval: false,
      priorAuditHarnessFailureRetained: true,
    },
  },
  indicatorState: {
    realCreditToGdpGap: null,
    realHousePriceOrCreditGrowth: null,
    realUnderwritingStandards: null,
    realDebtServiceBurden: null,
    realStressTest: null,
    historicalPointInTimeVintagesCollected: false,
    currentVintageMaySubstituteForPIT: false,
    unknownMayBeZeroFilled: false,
  },
  perimeterState: {
    banks: null,
    nonbanks: null,
    branches: null,
    subsidiaries: null,
    offshoreDirectBorrowing: null,
    assetSubstitution: null,
    reciprocityStatus: null,
    unmeasuredChannelsAreZero: false,
  },
  identificationState: {
    measurementStatus: 'synthetic-mechanically-audited-with-primary-source-mechanism-boundaries',
    observationalAssociation: null,
    proximalTargetEffect: null,
    resilienceEffect: null,
    leakageEffect: null,
    distributionalAndAggregateCost: null,
    causalEffectIdentified: false,
    parallelTrendsValidated: false,
    policyExogeneityEstablished: false,
    standardError: null,
    supportPopulation: null,
  },
  evidenceState: {
    approvedBodyIdentity: {
      phase: 'BODY-r4',
      frozenAt: '2026-09-16T07:06:09.360Z',
      manifestSha256: '2e2a3b99bb47ce2449f31379ef4ca9c040955c588cf558b8c2d05f9fb4edc25c',
      constrainedFiles: 509,
      appFiles: 362,
      pdf: 'tmp/pdfs/3-24-candidate-body-r4-a4.pdf',
      pdfPages: 80,
      pdfBytes: 2513683,
      pdfSha256: 'b839bf7e1b856ab41f4f72a55d726a303bc85a581ff4b3cdcfce396e94eb2abc',
    },
    sourceArchiveLedger: macroprudentialSourceArchiveLedger,
    failedDownloadLedger: macroprudentialFailedDownloadLedger,
    inputLineage: [] as const,
    sourcePassportIsContentApproval: false,
    authorFiniteChecksAreIndependentReview: false,
    twoFullApprovalsRegistered: true,
    reviews: [
      { kind: 'accuracy', decision: 'approved', revision: '3.24-r1', completedAt: '2026-09-16T07:20:02.140Z', reportSha256: '6f8bd356df491a74cf9cb44724331535428db380caa49208782fdf4daa708e60' },
      { kind: 'pedagogy', decision: 'approved', revision: '3.24-r1', completedAt: '2026-09-16T07:13:54.217Z', reportSha256: '3ed1a73a1dab7ff1e546ec7dff6a3e638e39c32400caa1ce039be47d5cceb682' },
    ] as const,
    realObservedPolicyData: false,
    pointInTimeCertified: false,
    outOfSampleValidated: false,
    productionEligible: false,
    downstreamReleaseEvidenceIsExternal: true,
  },
  interfaceState: {
    routes: macroprudentialInterfaces.map(([destination, payload, guardrail]) => ({ destination, payload, guardrail })),
    targetLesson: '5.05 Regulation & Market Design',
    givesIndividualCreditAdvice: false,
    givesInvestmentAdvice: false,
    givesRegulatoryComplianceAdvice: false,
  },
  invariants: macroprudentialInvariants,
  eligibilityState: {
    formalCatalogRegistered: true,
    formalRegistryRegistered: true,
    sharedStateRegistered: true,
    completeBodyFrozen: true,
    independentAccuracyApproval: true,
    independentPedagogyApproval: true,
    browserQaPassed: false,
    noJavaScriptQaPassed: false,
    keyboardQaPassed: false,
    responsiveQaPassed: false,
    printQaPassed: false,
    finalPdfProduced: false,
    finalPdfVerified: false,
    completionClaimAllowed: false,
  },
} as const;

export const canonicalMacroprudentialFields = [
  'schemaVersion', 'lessonId', 'clockState', 'semanticPrerequisiteStates', 'policyObjectiveState',
  'vulnerabilityMap', 'instrumentMap', 'labInputState', 'labResultState', 'indicatorState',
  'perimeterState', 'identificationState', 'evidenceState', 'interfaceState', 'invariants', 'eligibilityState',
] as const satisfies readonly (keyof typeof canonicalMacroprudentialStateExample)[];

const stateKeys = Object.keys(canonicalMacroprudentialStateExample);
const fieldSet = new Set<string>(canonicalMacroprudentialFields);

export const canonicalMacroprudentialAudit = [
  {
    key: 'all 16 canonical top-level fields are covered exactly',
    passed: canonicalMacroprudentialFields.length === 16
      && stateKeys.length === 16
      && fieldSet.size === 16
      && canonicalMacroprudentialFields.every(field => Object.prototype.hasOwnProperty.call(canonicalMacroprudentialStateExample, field))
      && stateKeys.every(field => fieldSet.has(field)),
  },
  {
    key: 'actual 3.14 and 3.15 lesson identities are semantic prerequisites without numeric consumption or lineage',
    passed: semanticPrerequisiteStates[0].actualLesson === lesson314
      && semanticPrerequisiteStates[1].actualLesson === lesson315
      && semanticPrerequisiteStates.every(state => state.reviewStatus === 'double-reviewed' && !state.numericValuesConsumed && !state.numericCalibration)
      && canonicalMacroprudentialStateExample.evidenceState.inputLineage.length === 0,
  },
  {
    key: 'seven canonical fixture identities are preserved and every default evaluator is OK',
    passed: canonicalMacroprudentialStateExample.labInputState.inputs === macroCanonicalInputs
      && (Object.keys(labResults) as MacroLabId[]).length === 7
      && (Object.keys(labResults) as MacroLabId[]).every(id => labResults[id].status === 'OK'),
  },
  {
    key: 'external 632/632 math audit is tied to the unchanged fixture SHA and is not content approval',
    passed: canonicalMacroprudentialStateExample.labResultState.externalFiniteMathAudit.fixtureSha256 === '69abfec363f11a22e1bd87746800febb8f8301be84eb71efa8d56d43499c937c'
      && canonicalMacroprudentialStateExample.labResultState.externalFiniteMathAudit.assertionsPassed === 632
      && canonicalMacroprudentialStateExample.labResultState.externalFiniteMathAudit.assertionsTotal === 632
      && canonicalMacroprudentialStateExample.labResultState.externalFiniteMathAudit.evaluatorCalls === 551
      && !canonicalMacroprudentialStateExample.labResultState.externalFiniteMathAudit.isContentApproval,
  },
  {
    key: 'all real policy indicators, perimeter observations and causal effects remain null or false',
    passed: Object.values(canonicalMacroprudentialStateExample.indicatorState).every(value => value === null || value === false)
      && Object.values(canonicalMacroprudentialStateExample.perimeterState).every(value => value === null || value === false)
      && !canonicalMacroprudentialStateExample.identificationState.causalEffectIdentified
      && canonicalMacroprudentialStateExample.identificationState.proximalTargetEffect === null,
  },
  {
    key: 'eight exact source archive identities and four failed HTML identities remain separately recorded',
    passed: canonicalMacroprudentialStateExample.evidenceState.sourceArchiveLedger.length === 8
      && canonicalMacroprudentialStateExample.evidenceState.failedDownloadLedger.length === 4
      && canonicalMacroprudentialStateExample.evidenceState.sourceArchiveLedger.every(record => record.includes('SHA⁠-⁠256'))
      && canonicalMacroprudentialStateExample.evidenceState.failedDownloadLedger.every(record => record.includes('实际HTML')),
  },
  {
    key: 'reviewed lesson records the approved BODY clock and two reviews without treating downstream artifact verification as an internal fact',
    passed: typeof canonicalMacroprudentialStateExample.clockState.registeredAt === 'string'
      && !Number.isNaN(Date.parse(canonicalMacroprudentialStateExample.clockState.registeredAt))
      && canonicalMacroprudentialStateExample.clockState.ownReviewFrozenAt === '2026-09-16T07:06:09.360Z'
      && canonicalMacroprudentialStateExample.evidenceState.reviews.length === 2
      && canonicalMacroprudentialStateExample.evidenceState.reviews.every(review => review.decision === 'approved' && review.revision === '3.24-r1')
      && canonicalMacroprudentialStateExample.evidenceState.twoFullApprovalsRegistered
      && canonicalMacroprudentialStateExample.evidenceState.approvedBodyIdentity.frozenAt === canonicalMacroprudentialStateExample.clockState.ownReviewFrozenAt
      && canonicalMacroprudentialStateExample.evidenceState.approvedBodyIdentity.manifestSha256 === '2e2a3b99bb47ce2449f31379ef4ca9c040955c588cf558b8c2d05f9fb4edc25c'
      && canonicalMacroprudentialStateExample.evidenceState.approvedBodyIdentity.pdfSha256 === 'b839bf7e1b856ab41f4f72a55d726a303bc85a581ff4b3cdcfce396e94eb2abc'
      && canonicalMacroprudentialStateExample.evidenceState.downstreamReleaseEvidenceIsExternal
      && canonicalMacroprudentialStateExample.eligibilityState.formalCatalogRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.formalRegistryRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.sharedStateRegistered
      && canonicalMacroprudentialStateExample.eligibilityState.completeBodyFrozen
      && canonicalMacroprudentialStateExample.eligibilityState.independentAccuracyApproval
      && canonicalMacroprudentialStateExample.eligibilityState.independentPedagogyApproval
      && !canonicalMacroprudentialStateExample.eligibilityState.browserQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.noJavaScriptQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.keyboardQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.responsiveQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.printQaPassed
      && !canonicalMacroprudentialStateExample.eligibilityState.finalPdfProduced
      && !canonicalMacroprudentialStateExample.eligibilityState.finalPdfVerified
      && !canonicalMacroprudentialStateExample.eligibilityState.completionClaimAllowed,
  },
] as const;

if (!canonicalMacroprudentialAudit.every(item => item.passed)) {
  throw new Error(`3.24 canonical gate failed: ${canonicalMacroprudentialAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
