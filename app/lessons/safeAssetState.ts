import { lesson402 } from './lesson-4-02';
import { canonicalInternationalMonetaryStateExample } from './internationalMonetaryState';
import {
  safeAssetCanonicalInputs,
  safeAssetEvaluators,
} from '../components/safeAssetFixtures';
import type { SafeAssetResult } from '../components/safeAssetFixtures';
import { safeAssetLabAudit, safeAssetLabs } from '../components/safeAssetLabDefinitions';
import { safeAssetScenarioAudit, safeAssetScenarios } from '../components/safeAssetScenarios';
import {
  lesson403References,
  safeAssetSourceArchiveLedger,
} from './safeAssetReferences';

function required<T extends object>(result: SafeAssetResult<T>): Readonly<T> {
  if (result.status === 'STOP') throw Error(`Invalid 4.03 canonical default: ${result.reason}`);
  return result.value;
}

const registeredAt = '2026-09-16T17:00:00Z';

export const safeAssetObservedPassportFields = [
  ['function', 'function / 功能'],
  ['holderDecisionRight', 'holder / decision right / 持有人与决策权'],
  ['instrumentLegalClaim', 'instrument / legal claim / 工具与法律债权'],
  ['issuerDebtorBacking', 'issuer / debtor / backing / 发行人、债务人与支持安排'],
  ['currency', 'currency / 币种'],
  ['unit', 'unit / 单位'],
  ['referencePeriod', 'reference period / 参考期'],
  ['coverage', 'coverage / 覆盖'],
  ['denominator', 'denominator / 分母'],
  ['vintage', 'vintage / 版本'],
  ['maturityCashflows', 'maturity / cash flows / 期限与现金流'],
  ['marketValueParValue', 'market value / par value / 市值与面值'],
  ['eligibility', 'eligibility / 资格'],
] as const;

const labResults = {
  C1: required(safeAssetEvaluators.C1(safeAssetCanonicalInputs.C1)),
  C3: required(safeAssetEvaluators.C3(safeAssetCanonicalInputs.C3)),
  C5: required(safeAssetEvaluators.C5(safeAssetCanonicalInputs.C5)),
  C6: required(safeAssetEvaluators.C6(safeAssetCanonicalInputs.C6)),
  C7: required(safeAssetEvaluators.C7(safeAssetCanonicalInputs.C7)),
  C8: required(safeAssetEvaluators.C8(safeAssetCanonicalInputs.C8)),
} as const;

const upstream = {
  lessonId: lesson402.id,
  revision: lesson402.revision,
  reviewStatus: lesson402.reviewStatus,
  reviews: lesson402.reviews,
  canonicalStateReference: canonicalInternationalMonetaryStateExample,
  producerMarker: {
    stateId: canonicalInternationalMonetaryStateExample.stateId,
    schemaVersion: canonicalInternationalMonetaryStateExample.schemaVersion,
    approvedBodyIdentity: canonicalInternationalMonetaryStateExample.evidenceState.approvedBodyIdentity,
    twoFullApprovalsRegistered: canonicalInternationalMonetaryStateExample.evidenceState.twoFullApprovalsRegistered,
  },
  role: 'actual-reviewed-4.02-identity-and-semantic-prerequisite-only',
  syntheticInputsConsumed: false,
  numericalOutputsConsumed: false,
  numericalCalibration: false,
  observedSnapshotValuesCopied: false,
} as const;

export const canonicalSafeAssetStateExample = {
  schemaVersion: 'canonicalSafeAssetState.v1',
  stateId: '4.03-reviewed-body-r1',
  scopePassport: {
    registeredAt,
    observedIssuer: null,
    observedCountry: null,
    observedCurrency: null,
    observedSecurity: null,
    semanticPrerequisites: ['4.02-reviewed-body-r1'],
    labCount: safeAssetLabs.length,
    scenarioCount: safeAssetScenarios.length,
    eachExperimentHasIndependentSyntheticWorld: true,
    noSharedRealityCalibration: true,
    noSovereignSafetyRanking: true,
  },
  inputLineage: [] as const,
  semanticPrerequisiteState: upstream,
  clockState: {
    informationCutoff: registeredAt,
    ownBodyFrozenAt: '2026-09-16T21:40:58.241Z',
    ownReviewFrozenAt: '2026-09-16T21:40:58.241Z',
    observedReferenceDate: null,
    firstPublishedAt: null,
    revisedAt: null,
    announcementAt: null,
    executionAt: null,
    obtainedAt: null,
    historicalAvailabilityVerified: false,
    pointInTimeClockConstructed: false,
    eachExperimentIsIndependent: true,
  },
  assetPassportState: {
    requiredFields: safeAssetObservedPassportFields,
    requiredFieldCount: safeAssetObservedPassportFields.length,
    observedPassports: [] as const,
    completeObservedPassportRegistered: false,
    missingObservedFieldsAreNullNotZero: true,
    functionAndInstrumentNeverMerged: true,
    currencyAndClaimNeverMerged: true,
    collateralEligibilityDoesNotProveReserveAssetStatus: true,
    upstreamCoferHandoff: {
      stateId: canonicalInternationalMonetaryStateExample.stateId,
      snapshotId: 'IMF-COFER-2026Q1',
      role: 'semantic-measurement-boundary-only',
      aggregateValuesConsumed: false,
      currencySharesCopied: false,
      instrumentQuantitiesAvailable: false,
    },
  },
  unitContract: {
    c1: 'six independent 0-100 SYN service dimensions plus strict use-case and market-state enums; no composite label or score',
    c3: 'two finite two-decimal SYN percentage yields; convenience wedge in basis points only after six strict MATCH gates',
    c5: 'finite two-decimal SYN price, integer quantity and three 0-100 percent filters; exact rational cash-capacity arithmetic',
    c6: 'integer SYN gross outstanding and four independent 0-100 percent filters; exact rational gross-to-Qeff funnel',
    c7: 'integer SYN issuance and basis-point service conditions on a fixed 0-200 teaching grid; no real threshold or optimum',
    c8: 'integer SYN aggregate bridge plus two-decimal instrument prices; two exact no-residual paths with different quantities',
    missing: 'null means unknown, inapplicable or not identified and is never economic zero; invalid raw or cross-field input yields STOP with no stale output',
  },
  serviceVectorState: {
    input: safeAssetCanonicalInputs.C1,
    result: labResults.C1,
    observedServiceVector: null,
    permanentSafetyLabel: null,
    crossUseCompositeScore: null,
  },
  convenienceYieldState: {
    input: safeAssetCanonicalInputs.C3,
    result: labResults.C3,
    observedMatchedAssets: null,
    observedConvenienceYieldBps: null,
    contaminationEstimated: false,
  },
  collateralState: {
    input: safeAssetCanonicalInputs.C5,
    result: labResults.C5,
    observedFacility: null,
    observedCollateral: null,
    observedHaircut: null,
    counterpartyWillingness: null,
  },
  capacityState: {
    input: safeAssetCanonicalInputs.C6,
    result: labResults.C6,
    observedGrossOutstanding: null,
    observedFreeFloat: null,
    observedQEff: null,
    officialCapacityMetric: null,
  },
  supplyCurveState: {
    input: safeAssetCanonicalInputs.C7,
    result: labResults.C7,
    observedIssuer: null,
    estimatedThreshold: null,
    estimatedCurve: null,
    debtSustainabilityConclusion: null,
    optimalIssuanceConclusion: null,
  },
  identificationBridgeState: {
    input: safeAssetCanonicalInputs.C8,
    result: labResults.C8,
    observedCoferCurrencyAggregate: null,
    observedPrincipalTransactions: null,
    observedIncomeReinvestment: null,
    observedFxValuation: null,
    observedPriceValuation: null,
    observedCoverageChange: null,
    identifiedSpecificInstrumentQuantity: null,
    anonymousReporterBehavior: null,
  },
  measurementState: {
    observedSeriesProgrammaticallyImported: false,
    narrativeObservedSnapshotsRegistered: false,
    observedSnapshotCount: 0,
    coferCurrentPanelRepublished: false,
    mspdCurrentValueRegistered: false,
    treasuryLiquidityCurrentStateRegistered: false,
    realDataAdapterRegistered: false,
    syntheticExperimentsCalibratedToReality: false,
    syntheticOutputsAreObservedFacts: false,
  },
  identificationState: {
    historicalPointInTimeVintagesCollected: false,
    pointInTimeCertified: false,
    outOfSampleValidated: false,
    observationalAssociation: null,
    causalEffect: null,
    causalEffectIdentified: false,
    forecastPerformance: null,
    policyCounterfactual: null,
    policyOptimum: null,
    sovereignRating: null,
    reserveAllocationRecommendation: null,
    currencyShareForecast: null,
    crisisDateForecast: null,
    productionSignal: null,
  },
  evidenceState: {
    mode: 'reviewed-body-independent-SYN-and-declared-reading-boundaries',
    ownBodyIdentity: {
      phase: 'BODY-r4',
      frozenAt: '2026-09-16T21:40:58.241Z',
      snapshotSha256: '596be53c545cc60a6938f394588db48940bae82fc066c2f81143cd4ef94a19cd',
      manifestSha256: '2dc27469b4de2504f4aa556f780758bcef4be20d96dc0f1a56124068afae092d',
      constrainedFiles: 230,
      bodyFiles: 20,
      pdf: 'tmp/pdfs/4-03-candidate-draft-author-r11-20260916-a4.pdf',
      pdfPages: 112,
      pdfBytes: 5_036_410,
      pdfSha256: '8ba8e1b570926d89ea41b7184219b5afd41599a30ffb156fd4a0fd923925aa3f',
    },
    ownFrozenManifest: {
      path: '/private/tmp/market-403-body-body-r4-20260916/snapshot-sha256-manifest.txt',
      sha256: '2dc27469b4de2504f4aa556f780758bcef4be20d96dc0f1a56124068afae092d',
      snapshotSha256: '596be53c545cc60a6938f394588db48940bae82fc066c2f81143cd4ef94a19cd',
      entries: 230,
      bodyFiles: 20,
    },
    ownPdfArtifact: {
      path: 'tmp/pdfs/4-03-candidate-draft-author-r11-20260916-a4.pdf',
      pages: 112,
      bytes: 5_036_410,
      sha256: '8ba8e1b570926d89ea41b7184219b5afd41599a30ffb156fd4a0fd923925aa3f',
    },
    referencesRegistered: lesson403References.length,
    sourceArchiveLedgerRegistered: safeAssetSourceArchiveLedger.length,
    independentReviews: [
      { kind: 'accuracy', decision: 'approved', revision: '4.03-r1', completedAt: '2026-09-16T21:52:06Z', reportSha256: 'ea23a55d775e956138a9f6da5bb3185aaba62f7abc01d5696fd2d33694f78e8f' },
      { kind: 'pedagogy', decision: 'approved', revision: '4.03-r1', completedAt: '2026-09-16T21:49:38Z', reportSha256: '8e872ee9e9c138e9e5f450001396778a78c671399c44dcb5199f2d5f4f7c382f' },
    ] as const,
    independentAccuracyApproval: true,
    independentPedagogyApproval: true,
    twoFullApprovalsRegistered: true,
    authorFiniteChecksAreIndependentReview: false,
    browserEvidence: null,
    noJavaScriptEvidence: null,
    keyboardEvidence: null,
    responsiveEvidence: null,
    printEvidence: null,
    finalPdfArtifact: null,
    completionEvidence: null,
    productionEligible: false,
    downstreamReleaseEvidenceIsExternal: true,
  },
  interfaceState: {
    upstreamSemanticLessons: ['4.02 International Monetary System'] as const,
    downstreamRoutes: ['4.04 US Treasury as Global Pricing Curve', '4.05 Global Dollar Funding', '4.06 Global Banks', '4.07 Global Financial Cycle', '7.24–7.26 Research Pipeline'] as const,
    payload: 'currency unit, foreign claim and collateral funding remain separate; pass matched convenience-yield logic, service vector, gross-to-Qeff funnel and instrument-identification boundary',
    guardrail: 'no sovereign safety rating, reserve allocation, debt threshold, FX forecast, crisis date, trade, causal policy or welfare advice',
    realDataAdapters: [] as const,
    givesInvestmentAdvice: false,
    givesCollateralEligibilityAdvice: false,
    givesReserveAllocationAdvice: false,
    givesDebtSustainabilityAdvice: false,
    givesCurrencyForecast: false,
    givesCausalPolicyAdvice: false,
  },
  invariants: [
    'Currency unit, reserve asset, claim instrument, collateral eligibility and reserve-currency role remain distinct objects.',
    'Safety is a use- and state-conditioned service vector, never a permanent one-dimensional label.',
    'Convenience yield is displayed only when currency, maturity, cashflow, credit, tax and hedging-cost match gates all pass.',
    'Collateral cash capacity equals price times quantity times eligibility times availability times one minus haircut; it does not infer counterparty willingness.',
    'Gross outstanding, available float, eligible quantity, unencumbered reachable quantity and market-adjusted Qeff remain separate funnel layers.',
    'The nonmonotonic supply curve is an author SYN possibility proof and never an estimated issuer threshold or policy optimum.',
    'COFER currency market value cannot identify a specific bond quantity without instrument-level price, quantity, income, transaction and coverage data.',
    'Unknown bridge components and identified instrument quantity remain null rather than being filled with economic zero.',
    'The six labs and twelve scenarios are independent SYN records and never share a hidden country, issuer, currency, date or calibration.',
    'Observed claims require thirteen minimum identity/statistical/asset fields, then six explicit encumbrance, haircut, price-risk, liquidity, jurisdiction-access and evidence-state extensions; missing fields stay unknown.',
    'The actual reviewed 4.02 object enters only as semantic identity; none of its SYN inputs, outputs or observed snapshot values calibrate 4.03.',
    'PIT, OOS, causal, forecast, policy, sovereign-rating, completion and production fields remain false or null until separately evidenced.',
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
    productionEligible: false,
  },
} as const;

export const canonicalSafeAssetFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'semanticPrerequisiteState', 'clockState',
  'assetPassportState', 'unitContract', 'serviceVectorState', 'convenienceYieldState', 'collateralState',
  'capacityState', 'supplyCurveState', 'identificationBridgeState', 'measurementState', 'identificationState',
  'evidenceState', 'interfaceState', 'invariants', 'eligibilityState',
] as const satisfies readonly (keyof typeof canonicalSafeAssetStateExample)[];

const state = canonicalSafeAssetStateExample;

export const canonicalSafeAssetAudit = [
  {
    key: 'all twenty top-level canonical fields exactly enumerated without silent extras',
    passed: Object.keys(state).length === 20
      && canonicalSafeAssetFields.length === 20
      && new Set(canonicalSafeAssetFields).size === 20
      && canonicalSafeAssetFields.every(key => Object.hasOwnProperty.call(state, key)),
  },
  {
    key: 'actual 4.02 reviewed-body-r1 identity is preserved by reference as semantic prerequisite without consuming values',
    passed: upstream.lessonId === '4.02'
      && upstream.revision === lesson402.revision
      && upstream.reviewStatus === 'double-reviewed'
      && upstream.reviews === lesson402.reviews
      && upstream.canonicalStateReference === canonicalInternationalMonetaryStateExample
      && upstream.producerMarker.stateId === '4.02-reviewed-body-r1'
      && upstream.producerMarker.approvedBodyIdentity === canonicalInternationalMonetaryStateExample.evidenceState.approvedBodyIdentity
      && upstream.producerMarker.twoFullApprovalsRegistered
      && !upstream.syntheticInputsConsumed
      && !upstream.numericalOutputsConsumed
      && !upstream.numericalCalibration
      && !upstream.observedSnapshotValuesCopied
      && state.inputLineage.length === 0,
  },
  {
    key: 'thirteen minimum identity statistical and asset fields are registered before six legal liquidity and evidence extensions',
    passed: safeAssetObservedPassportFields.length === 13
      && new Set(safeAssetObservedPassportFields.map(([field]) => field)).size === 13
      && ['holderDecisionRight', 'instrumentLegalClaim', 'issuerDebtorBacking', 'currency', 'maturityCashflows', 'marketValueParValue', 'eligibility']
        .every(field => safeAssetObservedPassportFields.some(([candidate]) => candidate === field))
      && state.assetPassportState.observedPassports.length === 0
      && !state.assetPassportState.completeObservedPassportRegistered,
  },
  {
    key: 'fourteen references, the source archive and two exact independent BODY-r4 approvals are registered',
    passed: state.evidenceState.referencesRegistered === 14
      && state.evidenceState.referencesRegistered === lesson403References.length
      && state.evidenceState.sourceArchiveLedgerRegistered === safeAssetSourceArchiveLedger.length
      && state.evidenceState.sourceArchiveLedgerRegistered >= 10
      && state.evidenceState.independentReviews.length === 2
      && state.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.revision === '4.03-r1')
      && state.evidenceState.twoFullApprovalsRegistered,
  },
  {
    key: 'six independent labs and twelve scenarios pass author mechanical contracts without reality calibration',
    passed: safeAssetLabs.length === 6
      && safeAssetScenarios.length === 12
      && [...safeAssetLabAudit, ...safeAssetScenarioAudit].every(item => item.passed)
      && state.scopePassport.eachExperimentHasIndependentSyntheticWorld
      && state.scopePassport.noSharedRealityCalibration
      && !state.measurementState.syntheticExperimentsCalibratedToReality,
  },
  {
    key: 'canonical outputs preserve vector match collateral capacity funnel nonmonotonic and dual-path invariants',
    passed: labResults.C1.independentDimensionCount === 6
      && labResults.C1.singleSafetyLabel === null
      && labResults.C3.convenienceYieldBps === 20
      && labResults.C5.cashCapacity === 68_571
      && labResults.C6.qEff === 432
      && labResults.C7.curveTurnsDown
      && labResults.C7.realWorldThresholdEstimated === false
      && labResults.C8.aggregateValuesEquivalent
      && labResults.C8.bondQuantityDifference === 200
      && labResults.C8.identifiedBondQuantity === null,
  },
  {
    key: 'no observed current panel adapter or hidden COFER instrument quantity is registered',
    passed: !state.assetPassportState.upstreamCoferHandoff.aggregateValuesConsumed
      && !state.assetPassportState.upstreamCoferHandoff.currencySharesCopied
      && !state.assetPassportState.upstreamCoferHandoff.instrumentQuantitiesAvailable
      && state.measurementState.observedSnapshotCount === 0
      && !state.measurementState.coferCurrentPanelRepublished
      && !state.measurementState.mspdCurrentValueRegistered
      && !state.measurementState.realDataAdapterRegistered
      && state.interfaceState.realDataAdapters.length === 0,
  },
  {
    key: 'approved BODY-r4 identity and two reports match while PIT OOS delivery completion and production remain external',
    passed: !state.identificationState.historicalPointInTimeVintagesCollected
      && !state.identificationState.pointInTimeCertified
      && !state.identificationState.outOfSampleValidated
      && state.identificationState.causalEffect === null
      && !state.identificationState.causalEffectIdentified
      && state.identificationState.policyCounterfactual === null
      && state.identificationState.policyOptimum === null
      && state.identificationState.productionSignal === null
      && state.clockState.ownBodyFrozenAt === '2026-09-16T21:40:58.241Z'
      && state.clockState.ownReviewFrozenAt === state.clockState.ownBodyFrozenAt
      && state.evidenceState.ownBodyIdentity.phase === 'BODY-r4'
      && state.evidenceState.ownBodyIdentity.frozenAt === state.clockState.ownBodyFrozenAt
      && state.evidenceState.ownBodyIdentity.snapshotSha256 === '596be53c545cc60a6938f394588db48940bae82fc066c2f81143cd4ef94a19cd'
      && state.evidenceState.ownBodyIdentity.manifestSha256 === '2dc27469b4de2504f4aa556f780758bcef4be20d96dc0f1a56124068afae092d'
      && state.evidenceState.ownBodyIdentity.pdfSha256 === '8ba8e1b570926d89ea41b7184219b5afd41599a30ffb156fd4a0fd923925aa3f'
      && state.evidenceState.ownFrozenManifest.sha256 === state.evidenceState.ownBodyIdentity.manifestSha256
      && state.evidenceState.ownPdfArtifact.sha256 === state.evidenceState.ownBodyIdentity.pdfSha256
      && state.evidenceState.independentReviews.length === 2
      && state.evidenceState.independentReviews[0].reportSha256 === 'ea23a55d775e956138a9f6da5bb3185aaba62f7abc01d5696fd2d33694f78e8f'
      && state.evidenceState.independentReviews[1].reportSha256 === '8e872ee9e9c138e9e5f450001396778a78c671399c44dcb5199f2d5f4f7c382f'
      && state.evidenceState.independentAccuracyApproval
      && state.evidenceState.independentPedagogyApproval
      && state.evidenceState.twoFullApprovalsRegistered
      && state.eligibilityState.formalCatalogRegistered
      && state.eligibilityState.formalRegistryRegistered
      && state.eligibilityState.completeBodyFrozen
      && state.eligibilityState.independentAccuracyApproval
      && state.eligibilityState.independentPedagogyApproval
      && state.eligibilityState.twoFullApprovals
      && state.evidenceState.browserEvidence === null
      && state.evidenceState.noJavaScriptEvidence === null
      && state.evidenceState.keyboardEvidence === null
      && state.evidenceState.responsiveEvidence === null
      && state.evidenceState.printEvidence === null
      && state.evidenceState.finalPdfArtifact === null
      && state.evidenceState.completionEvidence === null
      && !state.evidenceState.productionEligible
      && state.evidenceState.downstreamReleaseEvidenceIsExternal
      && !state.eligibilityState.browserQaPassed
      && !state.eligibilityState.noJavaScriptQaPassed
      && !state.eligibilityState.keyboardQaPassed
      && !state.eligibilityState.responsiveQaPassed
      && !state.eligibilityState.printQaPassed
      && !state.eligibilityState.finalPdfProduced
      && !state.eligibilityState.finalPdfVerified
      && !state.eligibilityState.completionClaimAllowed
      && !state.eligibilityState.productionEligible,
  },
] as const;

if (!canonicalSafeAssetAudit.every(item => item.passed)) {
  throw new Error(`4.03 canonical state gate failed: ${canonicalSafeAssetAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
