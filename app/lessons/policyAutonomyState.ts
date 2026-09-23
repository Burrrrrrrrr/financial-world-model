import { policyAutonomyLabAudit } from '../components/policyAutonomyLabs';

export const policyAutonomyReviewedBodySha256 = '33043b999a82ce32e7bad9fc8780ef840966c15af62442cc0e3863010cdaa684';

export const canonicalPolicyAutonomyFields = [
  'schemaVersion',
  'stateId',
  'scopePassport',
  'prerequisiteContracts',
  'autonomyOutcomeState',
  'trilemmaState',
  'regimeState',
  'mobilityState',
  'parityState',
  'globalCycleState',
  'balanceSheetState',
  'policyToolState',
  'identificationState',
  'evidenceClock',
  'evidenceState',
  'downstreamRoutes',
  'observedSnapshots',
  'realDataAdapters',
] as const;

export const canonicalPolicyAutonomyStateExample = {
  schemaVersion: 'policy-autonomy-state/v1',
  stateId: 'AUTHOR-MODEL-SYN-4.09-CANONICAL-R1',
  scopePassport: {
    object: 'trilemma/dilemma compatibility, financial transmission and policy-tool teaching contract',
    universe: ['C1: declared benchmark compatibility plus parity-wedge arithmetic', 'C2: two anonymous economies with the same external and local policy-rate paths but different FX cash and credit vectors'],
    units: 'annualised percentage points and basis points where labelled; otherwise synthetic cash units',
    horizon: 'one declared policy window and one synthetic future FX cash window; no calendar mapping',
  },
  prerequisiteContracts: {
    lesson401: { imported: 'residence, transaction/position, reserves and convertibility semantics only', syntheticValuesImported: false, reviewIdentityImported: false },
    lesson402: { imported: 'anchor, dominant-currency and monetary-network types only', syntheticValuesImported: false, reviewIdentityImported: false },
    lesson405: { imported: 'entity, currency, maturity, hedge and price/quantity/access boundaries only', syntheticValuesImported: false, reviewIdentityImported: false },
    lesson407: { imported: 'global state, candidate/identified shock, loading and local residual only', syntheticValuesImported: false, reviewIdentityImported: false },
    lesson408: { imported: 'typed capital-flow, investor-base, absorption and policy-state fields only', syntheticValuesImported: false, reviewIdentityImported: false },
  },
  autonomyOutcomeState: {
    instrumentAutonomyAssessed: false,
    financialConditionInsulationAssessed: false,
    stabilisationEffectivenessAssessed: false,
    welfareOptimalityAssessed: false,
    fourClaimsKeptSeparate: true,
  },
  trilemmaState: {
    declaredBenchmarkOnly: true,
    commitmentCompatibilityComputed: 'author-model-syn-only',
    predictsCrisisTiming: false,
    impliesOptimalRegime: false,
  },
  regimeState: {
    deJureObserved: false,
    deFactoObserved: false,
    anchorBandReactionExitVersioned: false,
    lowFxVolatilityImpliesPeg: false,
  },
  mobilityState: {
    deJureObserved: false,
    deFactoObserved: false,
    typedByEntityInstrumentDirectionClock: true,
    legalOpennessEqualsEffectiveMobility: false,
  },
  parityState: {
    authorSynResidualComputed: true,
    expectedDepreciationObserved: false,
    riskPremiumObserved: false,
    basisAndSegmentationObserved: false,
    residualHasUniqueStructuralName: false,
  },
  globalCycleState: {
    statisticalFactorObserved: false,
    externalShockIdentified: false,
    floatingGuaranteesInsulation: false,
    trilemmaAndDilemmaAreMutuallyExclusive: false,
  },
  balanceSheetState: {
    observedFxMismatch: false,
    observedHedges: false,
    observedMaturityWall: false,
    localCurrencyCapacityDeductedFromFxCashWithoutConversionRoute: false,
    priceQuantityAccessSeparated: true,
  },
  policyToolState: {
    observedFxIntervention: false,
    usableReservesObserved: false,
    sterilisationLegObserved: false,
    capitalFlowMeasureObserved: false,
    policyActionEqualsPolicyEffect: false,
  },
  identificationState: {
    causalEffectIdentified: false,
    policySelectionAddressed: false,
    anticipationAddressed: false,
    realtimeInformationSetReconstructed: false,
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
        revision: '4.09-r1',
        completedAt: '2026-09-23T02:05:00Z',
        path: 'tmp/qa/4-09-accuracy-body-r5-review.md',
        reportSha256: 'e0489dcd4d0be47276a4d5301a86f8878260878b2315c196adfbb7281cfc89d5',
        approvedBodySha256: policyAutonomyReviewedBodySha256,
        severityCounts: { p1: 0, p2: 0, p3: 0 },
      },
      {
        kind: 'pedagogy',
        decision: 'approved',
        revision: '4.09-r1',
        completedAt: '2026-09-23T02:09:33Z',
        path: 'tmp/qa/4-09-pedagogy-body-r5-review.md',
        reportSha256: 'eae4b65505aa97082decd3e814123169cc30b42372a5cb76ca573b04969219af',
        approvedBodySha256: policyAutonomyReviewedBodySha256,
        severityCounts: { p1: 0, p2: 0, p3: 0 },
      },
    ] as const,
    bodyApprovedByTwoIndependentReviewers: true,
    runtimeDeliveryQa: {
      decision: 'passed',
      completedAt: '2026-09-23T02:05:37Z',
      path: 'tmp/qa/4-09-runtime-body-r5-review.md',
      reportSha256: 'fe2a7fe2027f0d213281559bfa1240642d4896a7948f6b0869a0bb53427d536b',
      approvedBodySha256: policyAutonomyReviewedBodySha256,
      covers: ['desktop', 'C1/C2', 'quiz', '390px', '200% equivalent', 'no-JavaScript', 'A4 print', 'GitHub Pages basePath'],
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
    lesson410: 'versioned regime passport, feasible tool set and trade/financial channel split only',
    lesson506: 'typed CFM scope, route, clock, enforcement and leakage candidates only',
    lesson710: 'evidence-state policy constraint vector plus typed outcome vector only',
    lesson717: 'DAG, estimand, counterfactual, selection, anticipation and falsifiers only',
    lesson724: 'versioned data contract and unknown/null semantics only',
  },
  observedSnapshots: [] as unknown[],
  realDataAdapters: [] as unknown[],
} as const;

export const canonicalPolicyAutonomyAuthorAudit = [
  { key: 'canonical state exposes every declared top-level field exactly once', passed: JSON.stringify(Object.keys(canonicalPolicyAutonomyStateExample)) === JSON.stringify(canonicalPolicyAutonomyFields) },
  { key: 'upstream synthetic values and review identities are not inherited', passed: Object.values(canonicalPolicyAutonomyStateExample.prerequisiteContracts).every(contract => !contract.syntheticValuesImported && !contract.reviewIdentityImported) },
  { key: 'instrument insulation stabilisation and welfare claims remain separate and unassessed', passed: canonicalPolicyAutonomyStateExample.autonomyOutcomeState.fourClaimsKeptSeparate && !canonicalPolicyAutonomyStateExample.autonomyOutcomeState.instrumentAutonomyAssessed && !canonicalPolicyAutonomyStateExample.autonomyOutcomeState.financialConditionInsulationAssessed && !canonicalPolicyAutonomyStateExample.autonomyOutcomeState.stabilisationEffectivenessAssessed && !canonicalPolicyAutonomyStateExample.autonomyOutcomeState.welfareOptimalityAssessed },
  { key: 'trilemma compatibility stays a synthetic benchmark without crisis or regime ranking', passed: canonicalPolicyAutonomyStateExample.trilemmaState.declaredBenchmarkOnly && !canonicalPolicyAutonomyStateExample.trilemmaState.predictsCrisisTiming && !canonicalPolicyAutonomyStateExample.trilemmaState.impliesOptimalRegime },
  { key: 'regime mobility parity and global-cycle fields do not invent observations or structural shocks', passed: !canonicalPolicyAutonomyStateExample.regimeState.deJureObserved && !canonicalPolicyAutonomyStateExample.mobilityState.deFactoObserved && !canonicalPolicyAutonomyStateExample.parityState.expectedDepreciationObserved && !canonicalPolicyAutonomyStateExample.globalCycleState.externalShockIdentified },
  { key: 'cash currency and policy-action boundaries remain explicit', passed: !canonicalPolicyAutonomyStateExample.balanceSheetState.localCurrencyCapacityDeductedFromFxCashWithoutConversionRoute && canonicalPolicyAutonomyStateExample.balanceSheetState.priceQuantityAccessSeparated && !canonicalPolicyAutonomyStateExample.policyToolState.policyActionEqualsPolicyEffect },
  { key: 'two independent approvals bind the frozen body while author audit and runtime delivery QA remain separate', passed: !canonicalPolicyAutonomyStateExample.evidenceState.authorFiniteAuditIsIndependentReview && canonicalPolicyAutonomyStateExample.evidenceState.independentReviews.length === 2 && canonicalPolicyAutonomyStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.revision === '4.09-r1' && review.approvedBodySha256 === policyAutonomyReviewedBodySha256 && review.severityCounts.p1 === 0 && review.severityCounts.p2 === 0 && review.severityCounts.p3 === 0) && canonicalPolicyAutonomyStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers && canonicalPolicyAutonomyStateExample.evidenceState.runtimeDeliveryQa.decision === 'passed' && canonicalPolicyAutonomyStateExample.evidenceState.runtimeDeliveryQa.approvedBodySha256 === policyAutonomyReviewedBodySha256 && canonicalPolicyAutonomyStateExample.evidenceState.runtimeDeliveryQa.covers.length === 8 },
  { key: 'observed PIT causal prediction OOS trading and production claims remain false', passed: !canonicalPolicyAutonomyStateExample.evidenceState.observedDataImported && !canonicalPolicyAutonomyStateExample.evidenceState.pointInTimeCertified && !canonicalPolicyAutonomyStateExample.evidenceState.causalEffectIdentified && !canonicalPolicyAutonomyStateExample.evidenceState.predictionEstimated && !canonicalPolicyAutonomyStateExample.evidenceState.outOfSampleValidated && !canonicalPolicyAutonomyStateExample.evidenceState.tradingEligibility && !canonicalPolicyAutonomyStateExample.evidenceState.productionEligibility },
  { key: 'all finite AUTHOR/MODEL-SYN lab arithmetic audits pass', passed: policyAutonomyLabAudit.every(item => item.passed) },
] as const;

if (!canonicalPolicyAutonomyAuthorAudit.every(item => item.passed)) {
  throw new Error(`4.09 canonical state audit failed: ${canonicalPolicyAutonomyAuthorAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
