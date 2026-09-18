import { lesson401 } from './lesson-4-01';
import { canonicalBalanceOfPaymentsStateExample } from './balanceOfPaymentsState';
import {
  imsCanonicalInputs,
  imsEvaluators,
  internationalMonetaryStatisticalPassports,
} from '../components/internationalMonetaryFixtures';
import type { InternationalMonetaryResult } from '../components/internationalMonetaryFixtures';
import { internationalMonetaryLabAudit, internationalMonetaryLabs } from '../components/internationalMonetaryLabDefinitions';
import { internationalMonetaryScenarioAudit, internationalMonetaryScenarios } from '../components/internationalMonetaryScenarios';
import {
  internationalMonetarySourceArchiveLedger,
  lesson402ReadingList,
  lesson402References,
} from './internationalMonetaryReferences';

function required<T extends object>(result: InternationalMonetaryResult<T>): Readonly<T> {
  if (result.status === 'STOP') throw Error(`Invalid 4.02 canonical default: ${result.reason}`);
  return result.value;
}

const registeredAt = '2026-09-16T12:48:10Z';
export const internationalMonetaryObservedPassportFields = [
  ['function', 'function / 功能'],
  ['unit', 'unit / 单位'],
  ['referencePeriod', 'reference period / 参考期'],
  ['coverage', 'coverage / 覆盖'],
  ['denominator', 'denominator / 分母'],
  ['vintage', 'vintage / 版本'],
] as const;

const labResults = {
  C1: required(imsEvaluators.C1(imsCanonicalInputs.C1)),
  C2: required(imsEvaluators.C2(imsCanonicalInputs.C2)),
  C3: required(imsEvaluators.C3(imsCanonicalInputs.C3)),
  C4: required(imsEvaluators.C4(imsCanonicalInputs.C4)),
  C5: required(imsEvaluators.C5(imsCanonicalInputs.C5)),
  C6: required(imsEvaluators.C6(imsCanonicalInputs.C6)),
  C7: required(imsEvaluators.C7(imsCanonicalInputs.C7)),
} as const;

const upstream = {
  lessonId: lesson401.id,
  revision: lesson401.revision,
  reviewStatus: lesson401.reviewStatus,
  reviews: lesson401.reviews,
  canonicalNumericalState: canonicalBalanceOfPaymentsStateExample,
  producerMarker: {
    lessonId: lesson401.id,
    revision: lesson401.revision,
    approvedBodyFrozenAt: canonicalBalanceOfPaymentsStateExample.clockState.ownReviewFrozenAt,
  },
  role: 'actual-approved-identity-and-semantic-prerequisite-not-numerical-calibration',
  numericValuesConsumed: false,
  numericCalibration: false,
} as const;

export const canonicalInternationalMonetaryStateExample = {
  schemaVersion: 'canonicalInternationalMonetaryState.v1',
  stateId: '4.02-reviewed-body-r1',
  scopePassport: {
    registeredAt,
    observedCountry: null,
    observedCurrency: null,
    noCommonCurrencyTrajectory: true,
    semanticPrerequisites: ['4.01'],
    scenarioCount: internationalMonetaryScenarios.length,
    labCount: internationalMonetaryLabs.length,
    coordinationIsConditionalNotUniversal: true,
  },
  inputLineage: [] as const,
  semanticPrerequisiteState: upstream,
  clockState: {
    informationCutoff: registeredAt,
    ownReviewFrozenAt: '2026-09-16T16:25:15.573Z',
    referenceDate: null,
    firstPublishedAt: null,
    revisedAt: null,
    announcementAt: null,
    executionAt: null,
    obtainedAt: null,
    historicalAvailabilityVerified: false,
    eachExperimentIsIndependent: true,
    newFlowAndInstalledStockSeparated: true,
    valuationAndTransactionSeparated: true,
  },
  unitContract: {
    c1: 'SYN cost units, interactions and integer acceptance percent; threshold may exceed 100 rather than being clamped',
    c2: 'five same-candidate statistical passports with distinct function, unit, reference period, coverage, denominator and vintage; direct average forbidden',
    c3: 'SYN amount and basis points; two vehicle legs compound multiplicatively rather than being rounded to their simple sum',
    c4: 'SYN FX pair turnover; each trade contributes two currency sides, so currency shares sum to exactly 200 percent',
    c5: 'SYN opening stock, gross issuance and repayment; valuation is frozen at zero',
    c6: 'two fixed SYN holdings and report-currency cents per foreign unit; transaction contribution is frozen at zero',
    c7: 'author-defined six-period score and binary state; exit threshold must be strictly below entry threshold',
    missing: 'null is unknown or inapplicable, never economic zero; illegal raw or cross-field input yields STOP without stale results',
  },
  functionPassportState: {
    candidateCurrency: 'C2_SYN_CANDIDATE',
    passports: internationalMonetaryStatisticalPassports,
    result: labResults.C2,
    directCrossFunctionAverage: null,
    crossFunctionNaturalUnitExists: false,
  },
  coordinationState: { input: imsCanonicalInputs.C1, result: labResults.C1, observedAdoptionThreshold: null, equilibriumProbability: null },
  vehicleRouteState: { input: imsCanonicalInputs.C3, result: labResults.C3, actualExecutableQuote: null, actualBestExecution: null },
  fxTurnoverState: { input: imsCanonicalInputs.C4, result: labResults.C4, observedCurrencyCodes: null, officialMarketShare: null },
  flowStockState: { input: imsCanonicalInputs.C5, result: labResults.C5, actualInstalledStock: null, actualNewIssuance: null, actualRepayment: null },
  reserveValuationState: { input: imsCanonicalInputs.C6, result: labResults.C6, actualReserveHoldings: null, actualTransactions: null, actualPolicyIntent: null },
  hysteresisState: { input: imsCanonicalInputs.C7, result: labResults.C7, transitionRuleIsAuthorSynthetic: true, estimatedTransitionProbability: null },
  observedSnapshotState: [
    {
      id: 'BIS-FX-APRIL-2025-FINAL',
      label: 'FX turnover',
      sourceId: 5,
      vintage: 'final tables released 2026-06-15',
      function: 'OTC FX turnover',
      referencePeriod: 'April 2025 daily average',
      unit: 'USD trillions per day, net-net basis',
      coverage: 'global OTC FX spot and derivatives reported through the 2025 Triennial dealer survey; one unusual survey month',
      denominator: 'total OTC FX turnover on a net-net basis; currency-side shares sum to 200 percent',
      total: 9.51024,
      usdTurnoverUsdTrillions: 8.471519,
      usdOneSideSharePctAuthorDerived: 89.07786764582177,
      usdOneSideSharePctOfficialRounded: 89,
      shareDerivation: 'author-derived from 8.471519 / 9.51024; official Table 25.2 reports a rounded whole-percent share',
      currencyShareSumPct: 200,
      boundary: 'one unusual survey month; not annual payments, settlement, invoicing, debt or reserves',
    },
    {
      id: 'BIS-IBS-GLI-2026Q1',
      label: 'IBS / GLI',
      sourceId: 10,
      vintage: 'release dated 2026-07-31',
      function: 'cross-border bank positions and currency-area-external nonbank credit',
      referencePeriod: 'end-March 2026',
      unit: 'USD trillions for claims, bank credit and USD GLI; EUR trillions for EUR GLI',
      coverage: 'BIS cross-border claims and bank credit plus currency-area-external GLI credit to nonbank borrowers; these sets are not interchangeable',
      denominator: 'no shared market-share denominator; each reported stock retains its own instrument and borrower perimeter',
      crossBorderClaimsUsdTrillions: 47.6,
      crossBorderBankCreditUsdTrillions: 39.5,
      usdGliUsdTrillions: 14.7,
      eurGliEurTrillions: 5.1,
      boundary: 'claims, bank credit and GLI are different sets; GLI includes bank loans plus international bonds',
    },
    {
      id: 'IMF-COFER-2026Q1',
      label: 'COFER',
      sourceIds: [12, 13, 14],
      vintage: 'data brief dated 2026-07-01 under post-2025Q3 imputation method',
      function: 'official foreign exchange reserve market-value stock',
      referencePeriod: 'end-2026Q1',
      unit: 'USD trillions for the total stock; percent for currency composition',
      coverage: 'official foreign exchange reserves covered by IMF COFER; excludes gold and includes imputed unallocated reserves in the 100 percent composition',
      denominator: 'covered foreign exchange reserves after imputation for currency shares; excludes gold',
      totalUsdTrillionsApprox: 13.10,
      usdSharePct: 57.13,
      eurSharePct: 20.03,
      cnySharePct: 1.99,
      boundary: '100 percent composition includes imputation; share change combines transactions, FX, prices and coverage',
    },
  ] as const,
  measurementState: {
    observedSeriesProgrammaticallyImported: false,
    narrativeSnapshotsManuallyRegistered: true,
    snapshotsShareCommonFunction: false,
    snapshotsShareCommonUnit: false,
    snapshotsShareCommonDenominator: false,
    crossFunctionCompositeIndex: null,
    dataDownloadIsReplication: false,
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
    equilibriumSelectionEstimated: false,
    currencyReplacementForecast: null,
  },
  evidenceState: {
    mode: 'reviewed-body-independent-SYN-and-declared-primary-reading',
    approvedBodyIdentity: {
      phase: 'BODY-r8',
      frozenAt: '2026-09-16T16:25:15.573Z',
      manifestSha256: '1fcaa50eafd9c1292cd7b9d788c0fabe95b8e24dd9eeb08347d64ad3d04489f4',
      constrainedFiles: 672,
      appFiles: 393,
      pdf: 'tmp/pdfs/4-02-candidate-draft-author-r8-20260916-a4.pdf',
      pdfPages: 100,
      pdfBytes: 4389184,
      pdfSha256: 'bd2a0f76cbbc8b05197fcc7f52cc8c9a37b0a43ed67ec9c97262052ecc3c8264',
    },
    sourceArchiveLedger: internationalMonetarySourceArchiveLedger,
    referencesRegistered: lesson402References.length,
    readingRoutesRegistered: lesson402ReadingList.length,
    ownReviewFrozenAt: '2026-09-16T16:25:15.573Z',
    reviews: [
      { kind: 'accuracy', decision: 'approved', revision: '4.02-r1', completedAt: '2026-09-16T16:41:32.169Z', reportSha256: 'f1718cfca11dd55d53e24d512a616656d5c5412c6f9e75a9d483c2a7a4afc193' },
      { kind: 'pedagogy', decision: 'approved', revision: '4.02-r1', completedAt: '2026-09-16T16:39:33.531Z', reportSha256: '13f98858c4d032e835f749b60235e30f7d0eb289ebca14922c168b07ea617d8f' },
    ] as const,
    twoFullApprovalsRegistered: true,
    authorFiniteChecksAreIndependentReview: false,
    sourcePassportIsContentApproval: false,
    browserEvidence: null,
    printEvidence: null,
    finalPdfArtifact: null,
    completionEvidence: null,
    productionEligible: false,
    downstreamReleaseEvidenceIsExternal: true,
  },
  interfaceState: {
    upstreamSemanticLessons: ['4.01'],
    downstreamRoutes: ['4.03 Reserve Currency / Safe Asset Demand', '4.04–4.05 Dollar Funding', '4.06 Global Banks', '4.07 Global Financial Cycle', '4.08–4.09 EM / Trilemma-Dilemma', '5.13–5.14 Monetary History', '7.24–7.26 Research Pipeline'] as const,
    realDataAdapters: [] as const,
    givesInvestmentAdvice: false,
    givesBestExecutionAdvice: false,
    givesReserveAllocationAdvice: false,
    givesCurrencyForecast: false,
    givesCausalPolicyAdvice: false,
  },
  invariants: [
    'Every international-currency observation retains function, unit, reference period, coverage, denominator and vintage.',
    'Invoicing, payment, clearing, settlement, funding, reserve and anchor roles are never silently merged.',
    'FX currency-side shares sum to 200 percent and are not renormalised to an ordinary 100 percent composition.',
    'Admission conditions and network amplification remain different causal layers.',
    'Claims, bank credit and GLI preserve their instrument and borrower boundaries.',
    'Transactions, valuation changes, installed stocks and new flows retain separate clocks.',
    'Central-bank backstops remain conditional arrangements rather than universal automatic insurance.',
    'The seven labs and ten M/K cases are independent SYN records and cannot certify real replacement, causality or policy welfare.',
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
  },
} as const;

export const canonicalInternationalMonetaryFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'semanticPrerequisiteState', 'clockState', 'unitContract',
  'functionPassportState', 'coordinationState', 'vehicleRouteState', 'fxTurnoverState', 'flowStockState', 'reserveValuationState',
  'hysteresisState', 'observedSnapshotState', 'measurementState', 'identificationState', 'evidenceState', 'interfaceState',
  'invariants', 'eligibilityState',
] as const satisfies readonly (keyof typeof canonicalInternationalMonetaryStateExample)[];

const state = canonicalInternationalMonetaryStateExample;

export const canonicalInternationalMonetaryAudit = [
  {
    key: 'all 21 top-level canonical fields exactly enumerated without silent extras',
    passed: Object.keys(state).length === 21
      && canonicalInternationalMonetaryFields.length === 21
      && new Set(canonicalInternationalMonetaryFields).size === 21
      && canonicalInternationalMonetaryFields.every(key => Object.hasOwnProperty.call(state, key)),
  },
  {
    key: 'actual approved 4.01 identity and canonical object preserved as semantic prerequisite without numerical calibration',
    passed: upstream.lessonId === '4.01'
      && upstream.revision === lesson401.revision
      && upstream.reviewStatus === 'double-reviewed'
      && upstream.reviews === lesson401.reviews
      && upstream.canonicalNumericalState === canonicalBalanceOfPaymentsStateExample
      && !upstream.numericValuesConsumed
      && !upstream.numericCalibration
      && state.inputLineage.length === 0,
  },
  {
    key: 'seven independent labs and ten fixed M/K scenarios pass author mechanical contracts',
    passed: internationalMonetaryLabs.length === 7
      && internationalMonetaryScenarios.length === 10
      && [...internationalMonetaryLabAudit, ...internationalMonetaryScenarioAudit].every(item => item.passed)
      && state.scopePassport.noCommonCurrencyTrajectory,
  },
  {
    key: 'canonical SYN outputs preserve coordination, 200 percent, stock-flow, valuation and hysteresis invariants',
    passed: labResults.C1.netBenefit === -2
      && labResults.C1.thresholdPct === 60
      && labResults.C4.currencyShareSumPct === 200
      && labResults.C5.bridgeGap === 0
      && labResults.C6.bridgeGap === 0
      && labResults.C6.transactionContribution === 0
      && labResults.C7.switchCount === 3
      && labResults.C7.sameScoreDifferentState,
  },
  {
    key: 'five same-candidate function passports remain heterogeneous and direct cross-function average is unknown',
    passed: internationalMonetaryStatisticalPassports.length === 5
      && state.functionPassportState.result.passportCount === 5
      && state.functionPassportState.result.directAveragePct === null
      && state.functionPassportState.directCrossFunctionAverage === null
      && !state.functionPassportState.crossFunctionNaturalUnitExists,
  },
  {
    key: 'three narrative observed snapshots carry distinct passports and are never treated as one comparable ranking',
    passed: state.observedSnapshotState.length === 3
      && state.observedSnapshotState.every(snapshot => internationalMonetaryObservedPassportFields.every(([field]) => typeof snapshot[field] === 'string' && snapshot[field].length > 0))
      && state.observedSnapshotState[0].total === 9.51024
      && state.observedSnapshotState[0].usdTurnoverUsdTrillions === 8.471519
      && Math.abs(state.observedSnapshotState[0].usdOneSideSharePctAuthorDerived - 8.471519 / 9.51024 * 100) < 1e-12
      && state.observedSnapshotState[0].usdOneSideSharePctOfficialRounded === 89
      && state.observedSnapshotState[0].currencyShareSumPct === 200
      && state.observedSnapshotState[1].crossBorderClaimsUsdTrillions === 47.6
      && state.observedSnapshotState[2].usdSharePct === 57.13
      && !state.measurementState.snapshotsShareCommonFunction
      && state.measurementState.crossFunctionCompositeIndex === null,
  },
  {
    key: 'reviewed BODY identity and two exact approvals are registered without self-certifying delivery or production',
    passed: state.clockState.ownReviewFrozenAt === '2026-09-16T16:25:15.573Z'
      && state.evidenceState.approvedBodyIdentity.frozenAt === state.clockState.ownReviewFrozenAt
      && state.evidenceState.approvedBodyIdentity.manifestSha256 === '1fcaa50eafd9c1292cd7b9d788c0fabe95b8e24dd9eeb08347d64ad3d04489f4'
      && state.evidenceState.approvedBodyIdentity.pdfSha256 === 'bd2a0f76cbbc8b05197fcc7f52cc8c9a37b0a43ed67ec9c97262052ecc3c8264'
      && state.evidenceState.reviews.length === 2
      && state.evidenceState.reviews.every(review => review.decision === 'approved' && review.revision === '4.02-r1')
      && state.evidenceState.twoFullApprovalsRegistered
      && state.eligibilityState.completeBodyFrozen
      && state.eligibilityState.independentAccuracyApproval
      && state.eligibilityState.independentPedagogyApproval
      && state.eligibilityState.twoFullApprovals
      && state.evidenceState.browserEvidence === null
      && state.evidenceState.printEvidence === null
      && state.evidenceState.finalPdfArtifact === null
      && state.evidenceState.completionEvidence === null
      && !state.eligibilityState.completionClaimAllowed
      && !state.evidenceState.productionEligible
      && state.evidenceState.downstreamReleaseEvidenceIsExternal,
  },
] as const;

if (!canonicalInternationalMonetaryAudit.every(item => item.passed)) {
  throw new Error(`4.02 canonical state gate failed: ${canonicalInternationalMonetaryAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
