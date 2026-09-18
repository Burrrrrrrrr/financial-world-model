import { lesson307 } from './lesson-3-07';
import { canonicalSafeAssetStateExample, lesson403 } from './lesson-4-03';

export type TreasuryDriverClass = 'policy' | 'growth-information' | 'term-premium' | 'liquidity-convenience' | 'funding-intermediation' | 'foreign' | 'unknown';

export const treasuryCurveObservedPassportFields = [
  'sourceUrl', 'sourcePublisher', 'seriesOrInstrumentId', 'currency', 'curveFamily', 'rateCoordinate', 'quoteSide',
  'priceConvention', 'compounding', 'dayCount', 'maturityGrid', 'collateralRegime', 'valuationAsOf', 'publishedAt',
  'retrievedAt', 'revisionPolicy', 'vintage', 'timezone', 'units', 'missingValuePolicy', 'licenseOrTerms',
] as const;

export const canonicalTreasuryCurveFields = [
  'stateId', 'lesson', 'prerequisites', 'inputLineage', 'curvePassport', 'benchmarkRoleState', 'securityPassport',
  'keyRateShockVector', 'assetExposureGate', 'relativeValueBasisState', 'collateralFundingState', 'fxHedgeGateState',
  'driverClass', 'intermediaryCapacityState', 'localPassThroughState', 'reverseSpilloverFlag', 'evidenceClock',
  'nullReasons', 'observedSnapshots', 'realDataAdapters', 'evidenceState',
] as const;

export const canonicalTreasuryCurveStateExample = {
  stateId: '4.04-reviewed-body-r1',
  lesson: {
    id: '4.04',
    revision: '4.04-r1',
    reviewStatus: 'double-reviewed' as const,
    title: 'US Treasury 作为全球定价曲线',
  },
  prerequisites: {
    yieldCurve: {
      lessonId: lesson307.id,
      revision: lesson307.revision,
      reviewStatus: lesson307.reviewStatus,
      semanticInterfaceDeclared: [
        'curvePassport', 'discountFactors', 'zeroCouponYields', 'forwardRates', 'durationSupplyState',
        'safetyConvenienceState', 'collateralConvenienceState', 'riskBearingCapacityState', 'timestamps',
      ],
      exportedCanonicalNumericalStateConsumed: false,
      reason: '3.07 exports lesson identity but not a canonical numerical state object. 4.04 restates only the reviewed semantic contract and does not invent lineage.',
    },
    safeAsset: {
      lessonId: lesson403.id,
      revision: lesson403.revision,
      reviewStatus: lesson403.reviewStatus,
      upstreamStateId: canonicalSafeAssetStateExample.stateId,
      upstreamApprovalCount: canonicalSafeAssetStateExample.evidenceState.independentReviews.length,
      semanticInterfaceDeclared: ['matched convenience candidate', 'benchmark service', 'liquidity dimensions', 'effective capacity', 'collateral cash capacity'],
      syntheticInputsConsumed: false,
      numericalOutputsConsumed: false,
      observedSnapshotValuesCopied: false,
    },
  },
  inputLineage: [] as const,
  curvePassport: {
    currency: 'USD',
    curveFamily: 'SYN teaching zero curve — not Treasury CMT, GSW, SOFR OIS or a vendor curve',
    instrumentUniverse: 'six independent SYN labs, each with its own fixture; no live securities',
    quoteSide: 'not-applicable/SYN',
    priceConvention: 'lab-specific and explicitly displayed',
    rateCoordinate: 'lab-specific; par/zero/forward/repo never silently substituted',
    compounding: 'lab-specific; continuous only where formula states it',
    dayCount: 'not a real-security convention; omitted labs STOP rather than guess',
    maturityGrid: 'lab-specific synthetic nodes',
    valuationAsOf: null,
    source: 'author-SYN; mechanism sources are cited but do not supply parameters',
    collateralRegime: 'lab-specific SYN or not-applicable',
  },
  benchmarkRoleState: {
    roles: ['reference-coordinate', 'duration-hedge', 'relative-value-anchor', 'collateral-funding-input', 'information-barometer'] as const,
    everyContractDiscountCurve: false,
    monopolyBenchmarkClaim: false,
  },
  securityPassport: {
    realCusip: null,
    observedPrice: null,
    observedYield: null,
    onTheRunStatus: null,
    actualCashFlows: [] as const,
    reason: 'No observed Treasury security is loaded in the reviewed BODY.',
  },
  keyRateShockVector: {
    nodes: ['2Y', '5Y', '10Y', '30Y'] as const,
    observedValuesBp: null,
    syntheticExamplesAreIndependent: true,
    totalDv01NeutralMeansKeyRateNeutral: false,
  },
  assetExposureGate: {
    cashFlowCurrencyMatched: null,
    cashFlowDatesKnown: null,
    keyRateExposureKnown: null,
    optionalityKnown: null,
    riskPremiumDefinitionKnown: null,
    outputIfIncomplete: null,
  },
  relativeValueBasisState: {
    benchmarkCurve: null,
    assetCurve: null,
    cashFlowsMatched: null,
    durationMatched: null,
    optionalityMatched: null,
    fundingMatched: null,
    interpretedSpread: null,
  },
  collateralFundingState: {
    eligibleMarketValue: null,
    haircut: null,
    repoRate: null,
    specialness: null,
    unencumberedQuantity: null,
    rolloverTenor: null,
    cashCapacity: null,
    dealerCapacity: null,
  },
  fxHedgeGateState: {
    investorHomeCurrency: null,
    fxQuoteConvention: null,
    hedgeRatio: null,
    forwardCost: null,
    crossCurrencyBasis: null,
    assetMaturity: null,
    hedgeMaturity: null,
    rolloverGap: null,
    hedgedReturn: null,
  },
  driverClass: 'unknown' as TreasuryDriverClass,
  intermediaryCapacityState: {
    dealerInventory: null,
    balanceSheetShadowPrice: null,
    marginState: null,
    liquidityDimensions: { spread: null, depth: null, priceImpact: null, resilience: null },
    volumeAloneProvesLiquidity: false,
  },
  localPassThroughState: {
    jurisdiction: null,
    exchangeRateRegime: null,
    policyReaction: null,
    dollarLiabilities: null,
    externalFundingDependence: null,
    localRiskBearingCapacity: null,
    expectedShortRateContribution: null,
    termPremiumContribution: null,
    passThroughCoefficient: null,
  },
  reverseSpilloverFlag: null,
  evidenceClock: {
    observedAsOf: null,
    publishedAt: null,
    retrievedAt: null,
    timezone: null,
    eventWindow: null,
    vintage: null,
  },
  nullReasons: [
    'No observed/live/PIT curve or security series is loaded.',
    'No identified structural shock is supplied.',
    'No investor currency or FX hedge mandate is supplied.',
    'No dealer, repo, margin, position or local-market snapshot is supplied.',
  ] as const,
  observedSnapshots: [] as const,
  realDataAdapters: [] as const,
  evidenceState: {
    draftStartedAt: '2026-09-16',
    ownBodyFrozenAt: '2026-09-17T01:42:29.086Z',
    ownReviewFrozenAt: '2026-09-17T01:42:29.086Z',
    ownBodyIdentity: {
      phase: 'BODY-r4',
      path: '/private/tmp/market-404-body-r4-clean-20260916',
      frozenAt: '2026-09-17T01:42:29.086Z',
      files: 154,
      bodyFiles: 20,
      bodyAggregateSha256: '2d85ec18870cf6c3a7f71d79563adb44d1192e1604dced615ffe0626bed48a1b',
      manifestSha256: 'e76b25166829ff159f8ea8fb0c1cc7f31d7bc266ff981e88cf54997ca43aad20',
      snapshotSha256: '18ee723bffa96c5b19fbeb4b56daaa01af08d07993be6a0b8ad8308767707a01',
      pdfSha256: 'b7c312cbd19669201cb5891fdbe5769fe8fdf901a8b111b4650edba500a69f69',
    },
    ownFrozenManifest: {
      path: '/private/tmp/market-404-body-r4-clean-20260916/snapshot-sha256-manifest.txt',
      sha256: 'e76b25166829ff159f8ea8fb0c1cc7f31d7bc266ff981e88cf54997ca43aad20',
      entries: 154,
      bodyFiles: 20,
    },
    ownPdfArtifact: {
      path: 'tmp/pdfs/4-04-candidate-draft-author-r6-20260916-a4.pdf',
      pages: 102,
      bytes: 4_471_385,
      sha256: 'b7c312cbd19669201cb5891fdbe5769fe8fdf901a8b111b4650edba500a69f69',
    },
    authorFiniteChecksAreIndependentReview: false,
    independentReviews: [
      { kind: 'accuracy', decision: 'approved', revision: '4.04-r1', completedAt: '2026-09-17T01:56:04Z', reportSha256: 'bb4e0a783cd029d883f167f9ced81a238f68a5bd120f84d4042502b857d2219a' },
      { kind: 'pedagogy', decision: 'approved', revision: '4.04-r1', completedAt: '2026-09-17T01:54:50Z', reportSha256: '6ff26f82725a2418b60f5c964cf1c082e3bad1c8e8d443d58c549e4c52b6807a' },
    ] as const,
    accuracyApprovalComplete: true,
    pedagogyApprovalComplete: true,
    bodyApprovedByTwoIndependentReviewers: true,
    sealedMetadataDeltaApprovedByTwoIndependentReviewers: false,
    browserQaComplete: false,
    noJavaScriptQaComplete: false,
    keyboardQaComplete: false,
    responsive390QaComplete: false,
    nativeA4PrintComplete: false,
    pdfInspectionComplete: false,
    allPageVisualInspectionComplete: false,
    finalPdfAccepted: false,
    lessonComplete: false,
    productionEligible: false,
    observedData: false,
    strictPointInTime: false,
    outOfSample: false,
    causalIdentification: false,
    forecastValidated: false,
    tradingPerformanceValidated: false,
    investmentAdvice: false,
    legalOrPolicyAdvice: false,
  },
} as const;

const prerequisiteInterface = canonicalTreasuryCurveStateExample.prerequisites.yieldCurve.semanticInterfaceDeclared;
const expectedInterface = [
  'curvePassport', 'discountFactors', 'zeroCouponYields', 'forwardRates', 'durationSupplyState',
  'safetyConvenienceState', 'collateralConvenienceState', 'riskBearingCapacityState', 'timestamps',
] as const;

export const canonicalTreasuryCurveAudit = [
  {
    key: '3.07 semantic interface is exact and explicitly non-numerical',
    passed: JSON.stringify(prerequisiteInterface) === JSON.stringify(expectedInterface)
      && !canonicalTreasuryCurveStateExample.prerequisites.yieldCurve.exportedCanonicalNumericalStateConsumed,
  },
  {
    key: '4.03 prerequisite identity is reviewed while all synthetic and observed values remain unconsumed',
    passed: canonicalTreasuryCurveStateExample.prerequisites.safeAsset.reviewStatus === 'double-reviewed'
      && canonicalTreasuryCurveStateExample.prerequisites.safeAsset.upstreamApprovalCount === 2
      && !canonicalTreasuryCurveStateExample.prerequisites.safeAsset.syntheticInputsConsumed
      && !canonicalTreasuryCurveStateExample.prerequisites.safeAsset.numericalOutputsConsumed
      && !canonicalTreasuryCurveStateExample.prerequisites.safeAsset.observedSnapshotValuesCopied,
  },
  {
    key: 'canonical state contains every declared top-level field',
    passed: canonicalTreasuryCurveFields.every(field => field in canonicalTreasuryCurveStateExample),
  },
  {
    key: 'five benchmark roles remain distinct from universal discounting and monopoly claims',
    passed: canonicalTreasuryCurveStateExample.benchmarkRoleState.roles.length === 5
      && new Set(canonicalTreasuryCurveStateExample.benchmarkRoleState.roles).size === 5
      && !canonicalTreasuryCurveStateExample.benchmarkRoleState.everyContractDiscountCurve
      && !canonicalTreasuryCurveStateExample.benchmarkRoleState.monopolyBenchmarkClaim,
  },
  {
    key: 'unknown driver and every observed value stay null without zero imputation',
    passed: canonicalTreasuryCurveStateExample.driverClass === 'unknown'
      && canonicalTreasuryCurveStateExample.securityPassport.observedPrice === null
      && canonicalTreasuryCurveStateExample.fxHedgeGateState.hedgedReturn === null
      && canonicalTreasuryCurveStateExample.localPassThroughState.passThroughCoefficient === null
      && canonicalTreasuryCurveStateExample.observedSnapshots.length === 0
      && canonicalTreasuryCurveStateExample.realDataAdapters.length === 0,
  },
  {
    key: 'exact clean BODY-r4 identity and two approvals are registered while sealed delivery empirical and production claims remain external',
    passed: canonicalTreasuryCurveStateExample.evidenceState.ownBodyFrozenAt === '2026-09-17T01:42:29.086Z'
      && canonicalTreasuryCurveStateExample.evidenceState.ownReviewFrozenAt === canonicalTreasuryCurveStateExample.evidenceState.ownBodyFrozenAt
      && canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.path === '/private/tmp/market-404-body-r4-clean-20260916'
      && canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.frozenAt === canonicalTreasuryCurveStateExample.evidenceState.ownBodyFrozenAt
      && canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.manifestSha256 === 'e76b25166829ff159f8ea8fb0c1cc7f31d7bc266ff981e88cf54997ca43aad20'
      && canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.snapshotSha256 === '18ee723bffa96c5b19fbeb4b56daaa01af08d07993be6a0b8ad8308767707a01'
      && canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.bodyAggregateSha256 === '2d85ec18870cf6c3a7f71d79563adb44d1192e1604dced615ffe0626bed48a1b'
      && canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.pdfSha256 === 'b7c312cbd19669201cb5891fdbe5769fe8fdf901a8b111b4650edba500a69f69'
      && canonicalTreasuryCurveStateExample.evidenceState.ownFrozenManifest.sha256 === canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.manifestSha256
      && canonicalTreasuryCurveStateExample.evidenceState.ownPdfArtifact.sha256 === canonicalTreasuryCurveStateExample.evidenceState.ownBodyIdentity.pdfSha256
      && canonicalTreasuryCurveStateExample.evidenceState.independentReviews.length === 2
      && canonicalTreasuryCurveStateExample.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.revision === '4.04-r1')
      && canonicalTreasuryCurveStateExample.evidenceState.independentReviews[0].reportSha256 === 'bb4e0a783cd029d883f167f9ced81a238f68a5bd120f84d4042502b857d2219a'
      && canonicalTreasuryCurveStateExample.evidenceState.independentReviews[1].reportSha256 === '6ff26f82725a2418b60f5c964cf1c082e3bad1c8e8d443d58c549e4c52b6807a'
      && canonicalTreasuryCurveStateExample.evidenceState.accuracyApprovalComplete
      && canonicalTreasuryCurveStateExample.evidenceState.pedagogyApprovalComplete
      && canonicalTreasuryCurveStateExample.evidenceState.bodyApprovedByTwoIndependentReviewers
      && !canonicalTreasuryCurveStateExample.evidenceState.sealedMetadataDeltaApprovedByTwoIndependentReviewers
      && !canonicalTreasuryCurveStateExample.evidenceState.browserQaComplete
      && !canonicalTreasuryCurveStateExample.evidenceState.nativeA4PrintComplete
      && !canonicalTreasuryCurveStateExample.evidenceState.finalPdfAccepted
      && !canonicalTreasuryCurveStateExample.evidenceState.lessonComplete
      && !canonicalTreasuryCurveStateExample.evidenceState.productionEligible
      && !canonicalTreasuryCurveStateExample.evidenceState.strictPointInTime
      && !canonicalTreasuryCurveStateExample.evidenceState.outOfSample
      && !canonicalTreasuryCurveStateExample.evidenceState.causalIdentification
      && !canonicalTreasuryCurveStateExample.evidenceState.forecastValidated
      && !canonicalTreasuryCurveStateExample.evidenceState.tradingPerformanceValidated,
  },
] as const;
