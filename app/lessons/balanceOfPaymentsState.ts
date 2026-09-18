import { lesson320 } from './lesson-3-20';
import { lesson321 } from './lesson-3-21';
import { bopCanonicalInputs, bopEvaluators } from '../components/balanceOfPaymentsFixtures';
import type { BopLabId } from '../components/balanceOfPaymentsFixtures';
import { balanceOfPaymentsLabAudit, balanceOfPaymentsLabs } from '../components/balanceOfPaymentsLabDefinitions';
import { balanceOfPaymentsScenarioAudit, balanceOfPaymentsScenarios } from '../components/balanceOfPaymentsScenarios';
import {
  balanceOfPaymentsSourceArchiveLedger,
  lesson401ReadingList,
  lesson401References,
} from './balanceOfPaymentsReferences';

const semanticPrerequisiteStates = [
  {
    lessonId: lesson320.id,
    revision: lesson320.revision,
    reviewStatus: lesson320.reviewStatus,
    reviews: lesson320.reviews,
    actualLesson: lesson320,
    meaning: 'exchange-rate price, residents versus nonresidents, currency denomination and valuation semantics only',
    numericValuesConsumed: false,
    numericCalibration: false,
  },
  {
    lessonId: lesson321.id,
    revision: lesson321.revision,
    reviewStatus: lesson321.reviewStatus,
    reviews: lesson321.reviews,
    actualLesson: lesson321,
    meaning: 'gross capital-flow entry, balance-sheet transmission, maturity and multi-clock semantics only',
    numericValuesConsumed: false,
    numericCalibration: false,
  },
] as const;

const labResults = Object.fromEntries(
  (Object.keys(bopCanonicalInputs) as BopLabId[]).map(id => [id, bopEvaluators[id](bopCanonicalInputs[id])]),
) as Readonly<Record<BopLabId, ReturnType<(typeof bopEvaluators)[BopLabId]>>>;

export const canonicalBalanceOfPaymentsStateExample = {
  schemaVersion: 'canonicalBalanceOfPaymentsState.v1',
  lessonId: '4.01',
  revisionState: {
    revision: '4.01-r1',
    reviewStatus: 'double-reviewed',
    phase: 'REVIEWED-BODY',
    authorSideOnly: false,
    completeBodyFrozen: true,
  },
  clockState: {
    sourcePassportRecordedAt: '2026-09-16T08:23:55Z',
    draftPreparedAt: '2026-09-16',
    registeredAt: '2026-09-16T08:23:55Z',
    ownReviewFrozenAt: '2026-09-16T11:24:40.796Z',
    completeBodyFrozenAt: '2026-09-16T11:24:40.796Z',
    realDataAsOf: null,
    pointInTimeDatasetCutoff: null,
    outOfSampleEvaluationCutoff: null,
    browserQaAt: null,
    printQaAt: null,
    finalPdfVerifiedAt: null,
  },
  semanticPrerequisiteStates,
  accountingFrameworkState: {
    conceptualStandard: 'BPM7 March 2025 white-cover (pre-edited)',
    finalTypesetBpm7Artifact: null,
    currentLiveDataStandards: {
      imfBopAgg: 'BPM6 methodology',
      ecbBopIip: 'BPM6 methodology',
    },
    dualLabelRequired: true,
    bpm6LiveDataMayBeRelabelledBpm7: false,
    currentAndCapitalBalanceConvention: 'credits/revenues minus debits/expenditures',
    financialAccountBalanceConvention: 'net acquisition of financial assets minus net incurrence of liabilities',
    conceptualNetLendingIdentity: 'CAB + KAB = FAB',
    measuredStatisticalDiscrepancyConvention: 'D = FAB - (CAB + KAB)',
    transactionCreditDebitAndPublishedBalanceSignsSeparated: true,
    grossAndNetFlowsSeparated: true,
  },
  labInputState: {
    inputs: bopCanonicalInputs,
    definitions: balanceOfPaymentsLabs,
    scenarios: balanceOfPaymentsScenarios,
    allIndependentSyn: true,
    commonCountry: null,
    commonCurrency: null,
    commonPeriod: null,
    commonReleaseVintage: null,
    realCalibration: false,
  },
  labResultState: {
    results: labResults,
    fixtureCount: 7,
    fixedScenarioCount: 10,
    definitionAuditPassed: balanceOfPaymentsLabAudit.every(item => item.passed),
    scenarioAuditPassed: balanceOfPaymentsScenarioAudit.every(item => item.passed),
    authorMechanicalChecksAreContentApproval: false,
    authorMechanicalChecksAreIndependentReview: false,
  },
  stockFlowState: {
    positionIdentity: 'closing position = opening position + transactions + exchange-rate changes + other-price changes + other-volume changes',
    netIipIdentity: 'NIIP = external financial assets - external financial liabilities',
    openingExternalAssets: null,
    openingExternalLiabilities: null,
    observedFinancialTransactions: null,
    observedExchangeRateChanges: null,
    observedOtherPriceChanges: null,
    observedOtherVolumeChanges: null,
    closingExternalAssets: null,
    closingExternalLiabilities: null,
    observedBridgeVerified: false,
    twoPositionDifferenceMayBeCalledTransactions: false,
  },
  reserveState: {
    functionalCategory: 'reserve assets',
    definitionBoundary: 'external assets readily available to and controlled by monetary authorities for balance-of-payments financing and related purposes',
    actualReserveAssets: null,
    observedReserveTransactions: null,
    observedExchangeRateRevaluation: null,
    observedOtherPriceRevaluation: null,
    observedOtherVolumeChange: null,
    interventionAmount: null,
    reserveAdequacy: null,
    mechanicalCoverageRatioIsAdequacyAssessment: false,
    positionChangeMayBeCalledIntervention: false,
  },
  dataQualityState: {
    observedStatisticalDiscrepancy: null,
    statisticalDiscrepancySource: null,
    discrepancySourceDiagnosed: false,
    observedMirrorGap: null,
    mirrorCounterpartyCoverage: null,
    mirrorValuationAligned: null,
    mirrorTimingAligned: null,
    revisionVintageSeries: null,
    benchmarkRevisionAssessed: false,
    unknownMayBeZeroFilled: false,
    discrepancyMayBeAllocatedWithoutEvidence: false,
    mirrorDataMayBeTreatedAsGroundTruth: false,
    latestVintageMaySubstituteForHistoricalVintage: false,
  },
  identificationState: {
    measurementStatus: 'synthetic-reviewed-body-only',
    realDataImported: false,
    historicalPointInTimeVintagesCollected: false,
    pointInTimeCertified: false,
    outOfSampleValidated: false,
    observationalAssociation: null,
    causalEffect: null,
    causalEffectIdentified: false,
    forecastPerformance: null,
    policyCounterfactual: null,
    supportPopulation: null,
    standardError: null,
  },
  evidenceState: {
    approvedBodyIdentity: {
      phase: 'BODY-r5',
      frozenAt: '2026-09-16T11:24:40.796Z',
      manifestSha256: 'f95b1226ef417a05faff4045678dce3043d3e3d48eb3733c430ea3e65da8507e',
      constrainedFiles: 492,
      appFiles: 377,
      pdf: 'tmp/pdfs/4-01-candidate-body-r8-a4.pdf',
      pdfPages: 87,
      pdfBytes: 2619694,
      pdfSha256: '5460347354f341f8544b9679899bd29439a5ecb97ed6229db85966956e537f58',
    },
    sourceArchiveLedger: balanceOfPaymentsSourceArchiveLedger,
    inputLineage: [] as const,
    referencesRegistered: lesson401References.length,
    readingRoutesRegistered: lesson401ReadingList.length,
    sourcePassportIsContentApproval: false,
    authorFiniteChecksAreIndependentReview: false,
    ownReviewFrozenAt: '2026-09-16T11:24:40.796Z',
    reviews: [
      { kind: 'accuracy', decision: 'approved', revision: '4.01-r1', completedAt: '2026-09-16T11:42:12.651Z', reportSha256: 'b4cd80fc8743e183e59d8249de1a2fd72a6be46217fcbec7283a4ffed082750d' },
      { kind: 'pedagogy', decision: 'approved', revision: '4.01-r1', completedAt: '2026-09-16T11:43:40.720Z', reportSha256: '700e3ba5dced711968cba01c6fa9405bf6f313baf31f2b32631dc8c535446dc3' },
    ] as const,
    twoFullApprovalsRegistered: true,
    realObservedData: false,
    pointInTimeCertified: false,
    outOfSampleValidated: false,
    causalClaimEligible: false,
    browserEvidence: null,
    printEvidence: null,
    finalPdfArtifact: null,
    completionEvidence: null,
    productionEligible: false,
    downstreamReleaseEvidenceIsExternal: true,
  },
  interfaceState: {
    upstreamSemanticLessons: ['3.20', '3.21'],
    downstreamRoutes: ['4.06 Global Banks', '4.07 Global Financial Cycle', '4.08 Capital Flows into Emerging Markets', '4.09 Trilemma / Dilemma', '7.24–7.26 Research Pipeline'] as const,
    realDataAdapters: [] as const,
    dataDownloadPerformed: false,
    givesInvestmentAdvice: false,
    givesReserveAdequacyAdvice: false,
    givesExchangeRateForecast: false,
    givesCausalPolicyAdvice: false,
  },
  invariants: [
    'Every in-scope transaction has equal-value counterpart entries, while independently measured aggregates may retain a statistical discrepancy.',
    'Current and capital balances use revenues less expenditures; the financial account balance uses net asset acquisition less net liability incurrence.',
    'The lesson fixes measured statistical discrepancy as D = FAB - (CAB + KAB) and never auto-allocates D to an account.',
    'Gross acquisitions, disposals, liability incurrences and repayments remain visible even when their net balance is zero.',
    'An IIP position change is separated into transactions, exchange-rate changes, other-price changes and other-volume changes.',
    'Reserve-asset position changes are not automatically central-bank intervention, usable reserves or reserve adequacy.',
    'Mirror data and later revisions are diagnostic evidence with their own coverage, timing, valuation, classification and vintage.',
    'BPM7预编辑版概念与当前BPM6数据标签保持显式分离，绝不静默合并。',
  ] as const,
  eligibilityState: {
    formalCatalogRegistered: true,
    formalRegistryRegistered: true,
    sharedStateRegistered: true,
    completeBodyFrozen: true,
    independentAccuracyApproval: true,
    independentPedagogyApproval: true,
    twoFullApprovals: true,
    browserQaPassed: false,
    noJavaScriptQaPassed: false,
    keyboardQaPassed: false,
    responsiveQaPassed: false,
    printQaPassed: false,
    finalPdfProduced: false,
    finalPdfVerified: false,
    completionClaimAllowed: false,
    realDataEligible: false,
    pointInTimeEligible: false,
    outOfSampleEligible: false,
    causalClaimEligible: false,
    productionEligible: false,
  },
} as const;

export const canonicalBalanceOfPaymentsFields = [
  'schemaVersion', 'lessonId', 'revisionState', 'clockState', 'semanticPrerequisiteStates',
  'accountingFrameworkState', 'labInputState', 'labResultState', 'stockFlowState', 'reserveState',
  'dataQualityState', 'identificationState', 'evidenceState', 'interfaceState', 'invariants', 'eligibilityState',
] as const satisfies readonly (keyof typeof canonicalBalanceOfPaymentsStateExample)[];

const stateKeys = Object.keys(canonicalBalanceOfPaymentsStateExample);
const fieldSet = new Set<string>(canonicalBalanceOfPaymentsFields);
const requiredArchiveIdentities = [
  ['tmp/research/4-01-draft/imf-bpm7-white-cover-2025.pdf', 'a770e733fed4b20ad8b487ba2281e06d49cf8ff7402a691ab0ae2db3231127e7'],
  ['tmp/research/4-01-draft/imf-bpm7-annex13-changes-from-bpm6.pdf', '07c0bf65bf5dd04e2863733669384856c8f28b48cf78eaed966ef2ebaf221b9e'],
  ['tmp/research/4-01-draft/imf-policy-paper-bpm7-release-2025.pdf', 'a9a927fe09c8925d69e61247f561f29bcf4fea1de15871a79d9c902de79c9ddb'],
] as const;

export const canonicalBalanceOfPaymentsAudit = [
  {
    key: 'all 16 canonical top-level fields are covered exactly',
    passed: canonicalBalanceOfPaymentsFields.length === 16
      && stateKeys.length === 16
      && fieldSet.size === 16
      && canonicalBalanceOfPaymentsFields.every(field => Object.prototype.hasOwnProperty.call(canonicalBalanceOfPaymentsStateExample, field))
      && stateKeys.every(field => fieldSet.has(field)),
  },
  {
    key: 'actual 3.20 and 3.21 lesson identities are semantic prerequisites without numeric consumption or lineage',
    passed: semanticPrerequisiteStates[0].actualLesson === lesson320
      && semanticPrerequisiteStates[1].actualLesson === lesson321
      && semanticPrerequisiteStates.every(state => state.reviewStatus === 'double-reviewed' && !state.numericValuesConsumed && !state.numericCalibration)
      && canonicalBalanceOfPaymentsStateExample.evidenceState.inputLineage.length === 0,
  },
  {
    key: 'seven independent SYN fixture identities and ten scenarios are registered with passing mechanical audits',
    passed: canonicalBalanceOfPaymentsStateExample.labInputState.inputs === bopCanonicalInputs
      && (Object.keys(labResults) as BopLabId[]).length === 7
      && (Object.keys(labResults) as BopLabId[]).every(id => labResults[id].status === 'OK')
      && canonicalBalanceOfPaymentsStateExample.labInputState.definitions.length === 7
      && canonicalBalanceOfPaymentsStateExample.labInputState.scenarios.length === 10
      && canonicalBalanceOfPaymentsStateExample.labResultState.definitionAuditPassed
      && canonicalBalanceOfPaymentsStateExample.labResultState.scenarioAuditPassed
      && !canonicalBalanceOfPaymentsStateExample.labResultState.authorMechanicalChecksAreContentApproval
      && !canonicalBalanceOfPaymentsStateExample.labResultState.authorMechanicalChecksAreIndependentReview,
  },
  {
    key: 'fixed source contract contains nine official references and ten reading routes with explicit support boundaries',
    passed: lesson401References.length === 9
      && lesson401ReadingList.length === 10
      && lesson401References.every((reference, index) => reference.id === index + 1 && reference.use.includes('支持') && reference.use.includes('不支持')),
  },
  {
    key: 'only the three confirmed local official PDFs have archive identities and hashes',
    passed: canonicalBalanceOfPaymentsStateExample.evidenceState.sourceArchiveLedger.length === 3
      && canonicalBalanceOfPaymentsStateExample.evidenceState.sourceArchiveLedger.every((record, index) => record.localPath === requiredArchiveIdentities[index][0]
        && record.sha256 === requiredArchiveIdentities[index][1]
        && /^[0-9a-f]{64}$/.test(record.sha256))
      && canonicalBalanceOfPaymentsStateExample.evidenceState.sourceArchiveLedger.map(record => record.sourceId).join('/') === '1/2/8',
  },
  {
    key: 'reviewed BODY clock and exact dual approvals are registered without self-certifying downstream delivery',
    passed: canonicalBalanceOfPaymentsStateExample.revisionState.reviewStatus === 'double-reviewed'
      && canonicalBalanceOfPaymentsStateExample.revisionState.phase === 'REVIEWED-BODY'
      && !Number.isNaN(Date.parse(canonicalBalanceOfPaymentsStateExample.clockState.registeredAt))
      && canonicalBalanceOfPaymentsStateExample.clockState.registeredAt === canonicalBalanceOfPaymentsStateExample.clockState.sourcePassportRecordedAt
      && canonicalBalanceOfPaymentsStateExample.clockState.ownReviewFrozenAt === '2026-09-16T11:24:40.796Z'
      && canonicalBalanceOfPaymentsStateExample.clockState.completeBodyFrozenAt === '2026-09-16T11:24:40.796Z'
      && canonicalBalanceOfPaymentsStateExample.evidenceState.approvedBodyIdentity.frozenAt === canonicalBalanceOfPaymentsStateExample.clockState.ownReviewFrozenAt
      && canonicalBalanceOfPaymentsStateExample.evidenceState.approvedBodyIdentity.manifestSha256 === 'f95b1226ef417a05faff4045678dce3043d3e3d48eb3733c430ea3e65da8507e'
      && canonicalBalanceOfPaymentsStateExample.evidenceState.approvedBodyIdentity.pdfSha256 === '5460347354f341f8544b9679899bd29439a5ecb97ed6229db85966956e537f58'
      && canonicalBalanceOfPaymentsStateExample.evidenceState.reviews.length === 2
      && canonicalBalanceOfPaymentsStateExample.evidenceState.reviews.every(review => review.decision === 'approved' && review.revision === '4.01-r1')
      && canonicalBalanceOfPaymentsStateExample.evidenceState.twoFullApprovalsRegistered
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.authorFiniteChecksAreIndependentReview
      && canonicalBalanceOfPaymentsStateExample.revisionState.completeBodyFrozen
      && canonicalBalanceOfPaymentsStateExample.evidenceState.downstreamReleaseEvidenceIsExternal,
  },
  {
    key: 'BPM7预编辑版概念与BPM6现实数据方法保持可见分离',
    passed: canonicalBalanceOfPaymentsStateExample.accountingFrameworkState.conceptualStandard.includes('pre-edited')
      && canonicalBalanceOfPaymentsStateExample.accountingFrameworkState.currentLiveDataStandards.imfBopAgg === 'BPM6 methodology'
      && canonicalBalanceOfPaymentsStateExample.accountingFrameworkState.currentLiveDataStandards.ecbBopIip === 'BPM6 methodology'
      && canonicalBalanceOfPaymentsStateExample.accountingFrameworkState.dualLabelRequired
      && !canonicalBalanceOfPaymentsStateExample.accountingFrameworkState.bpm6LiveDataMayBeRelabelledBpm7
      && canonicalBalanceOfPaymentsStateExample.accountingFrameworkState.finalTypesetBpm7Artifact === null,
  },
  {
    key: 'all observed-data, PIT, OOS and causal states remain false or null',
    passed: !canonicalBalanceOfPaymentsStateExample.identificationState.realDataImported
      && !canonicalBalanceOfPaymentsStateExample.identificationState.historicalPointInTimeVintagesCollected
      && !canonicalBalanceOfPaymentsStateExample.identificationState.pointInTimeCertified
      && !canonicalBalanceOfPaymentsStateExample.identificationState.outOfSampleValidated
      && !canonicalBalanceOfPaymentsStateExample.identificationState.causalEffectIdentified
      && canonicalBalanceOfPaymentsStateExample.identificationState.observationalAssociation === null
      && canonicalBalanceOfPaymentsStateExample.identificationState.causalEffect === null
      && canonicalBalanceOfPaymentsStateExample.clockState.realDataAsOf === null
      && canonicalBalanceOfPaymentsStateExample.clockState.pointInTimeDatasetCutoff === null
      && canonicalBalanceOfPaymentsStateExample.clockState.outOfSampleEvaluationCutoff === null
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.realObservedData
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.pointInTimeCertified
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.outOfSampleValidated
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.causalClaimEligible,
  },
  {
    key: 'formal registration and BODY approvals are true while downstream, real-data, PIT, OOS, causal and production gates remain false or null',
    passed: canonicalBalanceOfPaymentsStateExample.eligibilityState.formalCatalogRegistered
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.formalRegistryRegistered
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.sharedStateRegistered
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.completeBodyFrozen
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.independentAccuracyApproval
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.independentPedagogyApproval
      && canonicalBalanceOfPaymentsStateExample.eligibilityState.twoFullApprovals
      && Object.entries(canonicalBalanceOfPaymentsStateExample.eligibilityState)
        .filter(([key]) => !['formalCatalogRegistered', 'formalRegistryRegistered', 'sharedStateRegistered', 'completeBodyFrozen', 'independentAccuracyApproval', 'independentPedagogyApproval', 'twoFullApprovals'].includes(key))
        .every(([, value]) => value === false)
      && canonicalBalanceOfPaymentsStateExample.evidenceState.browserEvidence === null
      && canonicalBalanceOfPaymentsStateExample.evidenceState.printEvidence === null
      && canonicalBalanceOfPaymentsStateExample.evidenceState.finalPdfArtifact === null
      && canonicalBalanceOfPaymentsStateExample.evidenceState.completionEvidence === null
      && canonicalBalanceOfPaymentsStateExample.clockState.browserQaAt === null
      && canonicalBalanceOfPaymentsStateExample.clockState.printQaAt === null
      && canonicalBalanceOfPaymentsStateExample.clockState.finalPdfVerifiedAt === null
      && !canonicalBalanceOfPaymentsStateExample.evidenceState.productionEligible,
  },
] as const;

if (!canonicalBalanceOfPaymentsAudit.every(item => item.passed)) {
  throw new Error(`4.01 canonical reviewed-BODY gate failed: ${canonicalBalanceOfPaymentsAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
