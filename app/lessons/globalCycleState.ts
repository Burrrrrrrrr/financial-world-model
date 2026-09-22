import { globalCycleLabAudit } from '../components/globalCycleLabs';

export const globalCycleReviewedBodySha256 = 'c38693ebc5e40930261afd510683b334a303d41f91298708178682ba6d51ee80';

export const canonicalGlobalCycleFields = [
  'schemaVersion',
  'stateId',
  'scopePassport',
  'prerequisiteContracts',
  'observationPanelState',
  'transformationState',
  'overlapState',
  'factorState',
  'proxyDiagnosticState',
  'driverCandidateState',
  'channelStates',
  'localPassThroughState',
  'feedbackState',
  'falsificationState',
  'evidenceClock',
  'evidenceState',
  'downstreamRoutes',
  'observedSnapshots',
  'realDataAdapters',
] as const;

export const canonicalGlobalCycleStateExample = {
  schemaVersion: 'global-cycle-state/v1',
  stateId: 'AUTHOR-SYN-4.07-CANONICAL-R1',
  scopePassport: {
    object: 'cross-country cross-asset common-state teaching contract',
    universe: ['C1: three locked country×asset records', 'C2: three market series plus one VIX-like proxy'],
    unit: 'synthetic adverse/stress score only',
    signConvention: 'higher synthetic score means more adverse/stress only within each declared fixture',
    frequency: 'four synthetic time points for C2; no calendar mapping',
  },
  prerequisiteContracts: {
    lesson313: { imported: 'types and semantic field boundaries only', syntheticValuesImported: false },
    lesson404: { imported: 'curve/driver/pass-through vocabulary only', syntheticValuesImported: false },
    lesson405: { imported: 'entity/currency/horizon and price-quantity-access vocabulary only', syntheticValuesImported: false },
    lesson406: { imported: 'typed credit-edge and evidence-ceiling vocabulary only', syntheticValuesImported: false },
  },
  observationPanelState: {
    observedPanelLoaded: false,
    seriesIds: [] as string[],
    releaseClockComplete: false,
    vintageComplete: false,
    missingPolicy: 'locked inside AUTHOR-SYN fixtures; no real missing values',
  },
  transformationState: {
    realSeriesStandardised: false,
    lookAheadAuditPassed: false,
    signAnchor: 'C2 display convention fixes positive common score as higher synthetic stress; not economic identification',
  },
  overlapState: {
    realProxyOverlapAudited: false,
    teachingRule: 'VIX-like proxy, common score and correlations are shown as different objects',
  },
  factorState: {
    status: 'author-syn-only' as const,
    method: 'closed-form X′X teaching fixture, not a real PCA service',
    globalFactorIdentified: false,
    identifiedShock: null,
    pointInTimeEstimated: false,
    outOfSampleValidated: false,
  },
  proxyDiagnosticState: {
    observedVixSeries: null,
    observedDollarSeries: null,
    observedCreditSeries: null,
    singleProxyCanIdentifyFactor: false,
  },
  driverCandidateState: {
    usMonetaryShock: 'candidate-not-estimated',
    usNewsShock: 'candidate-not-estimated',
    termPremiumShock: 'candidate-not-estimated',
    otherCentres: 'candidate-not-estimated',
  },
  channelStates: {
    treasury: 'semantic-candidate-only',
    dollar: 'semantic-candidate-only',
    globalBanks: 'semantic-candidate-only',
    nonbankRiskBearing: 'semantic-candidate-only',
  },
  localPassThroughState: {
    countryBetasEstimated: false,
    vulnerabilityRankingAvailable: false,
    policyEffectIdentified: false,
  },
  feedbackState: {
    closedLoopIdentified: false,
    typedEdgesObserved: [] as string[],
    reverseSpillover: 'candidate-only',
  },
  falsificationState: {
    maintainedCounterexamples: [
      'same Treasury direction with opposite equity/credit response',
      'proxy match without factor identity',
      'same covariance under common-shock and directional stories',
      'high exposure with low or reversed local outcome',
    ],
  },
  evidenceClock: {
    authoredAt: '2026-09-22T00:00:00Z',
    realDataAsOf: null,
    pitClock: null,
    historicalReplayClock: null,
  },
  evidenceState: {
    authorFiniteAuditIsIndependentReview: false,
    independentReviews: [
      {
        kind: 'accuracy',
        decision: 'approved',
        revision: '4.07-r1',
        completedAt: '2026-09-22T21:33:34Z',
        path: 'tmp/qa/4-07-accuracy-body-r1-review.md',
        reportSha256: 'c1b4c186bfeb63733a0d3f75ffcb46665dbe42ad60896c3ac9c082cd1d92cd6e',
        approvedBodySha256: globalCycleReviewedBodySha256,
        severityCounts: { p1: 0, p2: 0, p3: 0 },
      },
      {
        kind: 'pedagogy',
        decision: 'approved',
        revision: '4.07-r1',
        completedAt: '2026-09-22T21:34:56Z',
        path: 'tmp/qa/4-07-pedagogy-body-r1-review.md',
        reportSha256: 'a83c692a9467ace43f65957ee1021a2d9530c06c4cb72f902e8cc4099503c2d6',
        approvedBodySha256: globalCycleReviewedBodySha256,
        severityCounts: { p1: 0, p2: 0, p3: 0 },
      },
    ] as const,
    bodyApprovedByTwoIndependentReviewers: true,
    runtimeDeliveryQa: {
      decision: 'passed',
      completedAt: '2026-09-22T21:33:34Z',
      path: 'tmp/qa/4-07-runtime-r1-review.md',
      reportSha256: '2edd501b4b2efcf764f01bda7651fe4f3d12e9f2f1566052a22ba5ac91812c97',
      covers: ['desktop', 'C1/C2', 'quiz', '390px', 'no-JavaScript', 'A4 print', 'GitHub Pages basePath'],
    },
    observedDataImported: false,
    pointInTimeCertified: false,
    causalEffectIdentified: false,
    predictionEstimated: false,
    outOfSampleValidated: false,
    tradingEligibility: false,
    productionEligibility: false,
  },
  downstreamRoutes: {
    lesson408: 'factor/loading/residual/currency/clock/evidence only',
    lesson409: 'state and shock-candidate/local-pass-through only',
    lesson420: 'driver-conditioned response vector only',
    lesson421: 'common component/residual covariance/typed-edge candidates only',
    lesson710: 'factor/loadings/covariance/regime/uncertainty only',
  },
  observedSnapshots: [] as unknown[],
  realDataAdapters: [] as unknown[],
} as const;

export const canonicalGlobalCycleAuthorAudit = [
  { key: 'canonical state exposes every declared top-level field exactly once', passed: JSON.stringify(Object.keys(canonicalGlobalCycleStateExample)) === JSON.stringify(canonicalGlobalCycleFields) },
  { key: 'upstream synthetic values and review identities are not inherited', passed: Object.values(canonicalGlobalCycleStateExample.prerequisiteContracts).every(contract => !contract.syntheticValuesImported) },
  { key: 'single proxies cannot identify the global factor', passed: !canonicalGlobalCycleStateExample.proxyDiagnosticState.singleProxyCanIdentifyFactor && !canonicalGlobalCycleStateExample.factorState.globalFactorIdentified },
  { key: 'observed, PIT, causal, prediction, OOS, trading and production claims remain false', passed: !canonicalGlobalCycleStateExample.evidenceState.observedDataImported && !canonicalGlobalCycleStateExample.evidenceState.pointInTimeCertified && !canonicalGlobalCycleStateExample.evidenceState.causalEffectIdentified && !canonicalGlobalCycleStateExample.evidenceState.predictionEstimated && !canonicalGlobalCycleStateExample.evidenceState.outOfSampleValidated && !canonicalGlobalCycleStateExample.evidenceState.tradingEligibility && !canonicalGlobalCycleStateExample.evidenceState.productionEligibility },
  { key: 'two independent approvals bind the same frozen body while author audit remains separate', passed: !canonicalGlobalCycleStateExample.evidenceState.authorFiniteAuditIsIndependentReview && canonicalGlobalCycleStateExample.evidenceState.independentReviews.length === 2 && canonicalGlobalCycleStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.approvedBodySha256 === globalCycleReviewedBodySha256 && review.severityCounts.p1 === 0 && review.severityCounts.p2 === 0 && review.severityCounts.p3 === 0) && canonicalGlobalCycleStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers },
  { key: 'runtime delivery QA is recorded separately from content review and empirical evidence', passed: canonicalGlobalCycleStateExample.evidenceState.runtimeDeliveryQa.decision === 'passed' && canonicalGlobalCycleStateExample.evidenceState.runtimeDeliveryQa.covers.length === 7 && !canonicalGlobalCycleStateExample.evidenceState.observedDataImported && !canonicalGlobalCycleStateExample.evidenceState.pointInTimeCertified && !canonicalGlobalCycleStateExample.evidenceState.causalEffectIdentified && !canonicalGlobalCycleStateExample.evidenceState.outOfSampleValidated && !canonicalGlobalCycleStateExample.evidenceState.productionEligibility },
  { key: 'all finite lab arithmetic audits pass', passed: globalCycleLabAudit.every(item => item.passed) },
] as const;

if (!canonicalGlobalCycleAuthorAudit.every(item => item.passed)) {
  throw new Error(`4.07 canonical state audit failed: ${canonicalGlobalCycleAuthorAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
