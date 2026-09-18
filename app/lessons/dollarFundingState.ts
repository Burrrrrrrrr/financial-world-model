export const dollarFundingObservedPassportFields = [
  'sourceUrl', 'publisher', 'seriesOrContractId', 'legalEntityId', 'bookingLocation', 'parentNationality',
  'currency', 'direction', 'amount', 'tradeTimestamp', 'valueTimestamp', 'horizon', 'transactionId', 'cashLegId',
  'sourceEventId', 'nettingSet', 'instrument', 'residualMaturity', 'routeStatus', 'collateralPoolId', 'publishedAt',
  'retrievedAt', 'vintage', 'timezone', 'units', 'missingValuePolicy', 'licenseOrTerms',
] as const;

export const canonicalDollarFundingFields = [
  'stateId', 'lesson', 'prerequisites', 'authoringGate', 'inputLineage', 'fundingPassport', 'preActionLadder',
  'fxSwapLedger', 'basisQuotePassport', 'privateRouteState', 'collateralState', 'intragroupState', 'officialLayers',
  'priceQuantityAccess', 'evidenceClock', 'nullReasons', 'observedSnapshots', 'realDataAdapters', 'evidenceState',
] as const;

export const canonicalDollarFundingStateExample = {
  stateId: '4.05-reviewed-body-r1',
  lesson: {
    id: '4.05',
    revision: '4.05-r1',
    reviewStatus: 'double-reviewed' as const,
    title: 'Global Dollar Funding',
  },
  prerequisites: {
    safeAsset: { lessonId: '4.03', revision: '4.03-r1', reviewStatus: 'double-reviewed', numericalOutputsConsumed: false, syntheticInputsConsumed: false },
    treasuryCurve: { lessonId: '4.04', revision: '4.04-r1', reviewStatus: 'double-reviewed', numericalOutputsConsumed: false, syntheticInputsConsumed: false },
    declaredInterfaces: ['currency-service', 'safe-asset-effective-capacity', 'collateral-cash-boundary', 'repo/funding passport', 'FX hedge gate', 'local-pass-through gate'] as const,
  },
  authoringGate: {
    specificationPath: 'tmp/research/4-05-blocker-resolution-r4-20260916.md',
    specificationBytes: 27_099,
    specificationSha256: 'abe8c240c10c4abefba940f0ff2fe83bc0cc919899dc4dd62d9b4c44fa383985',
    independentAuditPath: 'tmp/research/4-05-blocker-resolution-r4-independent-audit-20260916.md',
    independentAuditBytes: 8_156,
    independentAuditSha256: '69f5ab471609b6c22147497d7e2d83e664af6983642a5dcf5fe56a1e69ded399',
    verdict: 'APPROVE_FOR_AUTHORING' as const,
    p1: 0,
    p2: 0,
    p3: 0,
    permissionScope: 'authoring only; not BODY approval, publication or production eligibility',
  },
  inputLineage: [] as const,
  fundingPassport: {
    legalEntityId: null,
    bookingLocation: null,
    parentNationality: null,
    settlementCurrency: 'USD',
    asOf: null,
    horizon: null,
    nettingSet: null,
    observedContractIds: [] as const,
    reason: 'No observed entity, account or contract is loaded; six labs are independent author-SYN fixtures.',
  },
  preActionLadder: {
    contract: 'N_pre=C0+Ic−Oc−Ox−Cmin; G_pre=max(0,−N_pre)',
    outputs: ['G_pre', 'five contributions', 'maturity buckets', 'missing/STOP'] as const,
    collateralCapacityIncluded: false,
    routeReceiptsIncluded: false,
    gPostExists: false,
    readsOtherLabs: false,
  },
  fxSwapLedger: {
    observedTrades: [] as const,
    pair: null,
    quoteDirection: null,
    spotLegs: [] as const,
    forwardLegs: [] as const,
    grossNotional: null,
    netDebt: null,
    rolloverNeed: null,
  },
  basisQuotePassport: {
    currencyPair: null,
    spotForwardDirection: null,
    rateBasis: null,
    tenor: null,
    borrowLendSide: null,
    bidAsk: null,
    collateralCreditMatch: null,
    interpretedBasis: null,
  },
  privateRouteState: {
    candidateRoutes: ['cash', 'contractual inflow', 'CP/CD', 'repo', 'FX swap', 'bond', 'asset sale'] as const,
    observedExecutableRoutes: [] as const,
    statusEnum: ['realised', 'committed_executable', 'quoted_only', 'unavailable', 'null'] as const,
    quotedCapacityIsCash: false,
  },
  collateralState: {
    observedLots: [] as const,
    markedValue: null,
    unencumberedValue: null,
    eligibleValue: null,
    haircut: null,
    routeLimit: null,
    capacity: null,
    receipt: null,
    uniqueAllocationVerified: null,
  },
  intragroupState: {
    providerEntity: null,
    recipientEntity: null,
    legalGate: null,
    regulatoryGate: null,
    operationalGate: null,
    bindingAmount: null,
    valueDate: null,
    cashEligible: null,
  },
  officialLayers: {
    temporalContract: {
      timestampFormat: 'UTC ISO minute with Z',
      prospectiveWindow: '(asOfTimestamp, horizonEndTimestamp]' as const,
      derivedDayLabelsAreDisplayOnly: true,
      realisedRule: 'valueTimestamp <= asOfTimestamp; history/C0 attribution only; current X_H/O_H = 0',
      committedRule: 'valueTimestamp > asOfTimestamp; current X_H/O_H only when valueTimestamp <= horizonEndTimestamp; otherwise next bucket',
      conflictRule: 'realised after as-of or committed at/before as-of => STOP',
      statusScope: 'one status per cash leg; never inherit one transaction status across initial/reverse/margin/repayment legs',
    },
    sovereignSwap: {
      fixedSynEntities: { fed: 'SYN-FRBNY-01', foreignCentralBank: 'SYN-FOREIGN-CB-01' },
      fixedSynTransactionId: 'SYN-C6-A-TX-001',
      counterparties: ['Federal Reserve Bank of New York', 'foreign central bank'] as const,
      executionAuthorization: 'FRBNY execution under FOMC authorization',
      readinessRequired: true,
      fedContractualObligor: 'foreign central bank',
      layerCLocalOnwardRisk: 'N/A unless a separate Layer C transaction is created',
      declaredEconomicsRequired: ['termDays', 'fcyPerUsdRate', 'fcyMinorUnitDecimals', 'usdInterestAmount'] as const,
      labTermInputDomain: '1–30 integer calendar days; author-SYN experiment domain only',
      officialTermSupport: 'next day through a maximum of three months',
      fcyMinorUnitDecimals: 2,
      requiredFourLegs: ['initialUsdIn', 'initialFcyOut', 'reversalUsdOut', 'reversalFcyIn'] as const,
      perLegRequiredFields: ['immutableLegId', 'immutableSourceEventId', 'structureStatus', 'cashSettlementStatus', 'positiveAmount', 'canonicalUtcTimestamp'] as const,
      pairingRules: ['initial timestamps equal', 'reversal timestamps equal', 'reversal timestamp = initial timestamp + declared term', 'initial FCY = round(USD principal × rate, 2 FCY minor-unit decimals)', 'reversal USD = principal + USD interest/compensation', 'reversal FCY = initial FCY original quantity'] as const,
      quotedUnavailableReadHiddenTransactionFields: false,
      privateReceiptAutomatic: false,
      observedTransaction: null,
    },
    fimaRepo: {
      counterparties: ['Fed/SOMA', 'approved FIMA account holder'] as const,
      collateral: 'account-holder Treasury',
      allowedTerms: ['overnight', 'seven-calendar-day'] as const,
      termDays: { overnight: 1, sevenCalendarDays: 7 },
      cashEligibleStatuses: ['realised', 'committed_executable'] as const,
      requiredPassport: ['approvedHolder', 'eligibleTreasuryAllocation', 'uniqueAllocation', 'initialTreasuryLeg', 'initialUsdLeg', 'initialValueTimestamp', 'initialCashStatus', 'repurchaseAmount', 'repurchaseValueTimestamp', 'repurchaseCashStatus', 'initialMargin', 'bilateralLimit', 'immutableLegIds'] as const,
      optionalAuthorSynAdditionalMarginFields: ['marginLegStructureStatus', 'marginAmount', 'marginValueTimestamp', 'marginCashStatus'] as const,
      additionalMarginEvidenceBoundary: 'optional author-SYN stress-ledger extension; not an observed or officially published per-leg schedule',
      timestampDomain: { initialThroughDay: 30, reverseThroughDay: 37 },
      additionalMarginLifecycle: 'initialTimestamp < marginTimestamp < repurchaseTimestamp',
      additionalMarginEndpointPolicy: 'equal to either endpoint => STOP',
      privateReceiptAutomatic: false,
      observedTransaction: null,
    },
    localOnward: {
      counterparties: ['local official allocator', 'eligible recipient'] as const,
      independentTransactionRequired: true,
      upstreamProvenanceRequired: true,
      ownTransactionAndLegIdsRequired: true,
      repaymentScheduleRequired: true,
      receiptAndRepaymentStatusesIndependent: true,
      timestampDomain: { receiptThroughDay: 30, repaymentThroughDay: 37, day30ReceiptAndDay37RepaymentRepresentable: true },
      recipientCollateralRule: 'explicit yes/no; if yes, recipient-owned unique allocation',
      observedTransaction: null,
    },
    taxonomyExhaustiveGlobally: false,
  },
  priceQuantityAccess: {
    observedPrices: [] as const,
    observedQuantities: [] as const,
    observedAccessRecords: [] as const,
    basisAloneIsShortage: false,
    dxyAloneIsShortage: false,
    gliAloneIsShortage: false,
    facilityExistenceAloneIsPrivateAccess: false,
  },
  evidenceClock: {
    observedAsOf: null,
    publishedAt: null,
    retrievedAt: null,
    timezone: null,
    eventWindow: null,
    vintage: null,
  },
  nullReasons: [
    'No live or historical legal-entity balance sheet is loaded.',
    'No observed transaction, account, cash leg, collateral lot or counterparty limit is loaded.',
    'No PIT basis quote, DXY, LBS/CBS/GLI vintage or official operation record is loaded.',
    'No identified shock, OOS sample, forecast target or trading strategy is supplied.',
  ] as const,
  observedSnapshots: [] as const,
  realDataAdapters: [] as const,
  evidenceState: {
    draftStartedAt: '2026-09-16',
    authoringGateApproved: true,
    ownBodyFrozenAt: '2026-09-17T07:20:08.483Z',
    ownReviewFrozenAt: '2026-09-17T07:20:08.483Z',
    ownBodyIdentity: {
      phase: 'BODY-r4',
      path: '/private/tmp/market-405-body-r4-clean-20260917',
      frozenAt: '2026-09-17T07:20:08.483Z',
      files: 208,
      bodyFiles: 17,
      bodyAggregateSha256: '19b671bcdb86c2976708274683c6b757ed2127300f9366555faa389588e2a701',
      manifestSha256: '76da7b52311620ec9d9735e59a7b28f07737b06c342a5a4cbef6399409a66247',
      snapshotSha256: 'c23d57dd20531d0eeff647839adc8ddc3251226dc052c87dc22ad9ec031d7668',
      pdfSha256: 'd3f9562d6187cc3189f16077d6d7358d241a2508ead5d5ef6de6c6ea5a2db2d2',
    },
    ownFrozenManifest: {
      path: '/private/tmp/market-405-body-r4-clean-20260917/review-bundle-sha256-manifest.txt',
      sha256: '76da7b52311620ec9d9735e59a7b28f07737b06c342a5a4cbef6399409a66247',
      entries: 208,
      bodyFiles: 17,
    },
    ownPdfArtifact: {
      path: 'tmp/pdfs/4-05-candidate-draft-body-r4-author-r4-20260917-a4.pdf',
      pages: 99,
      bytes: 3_638_373,
      sha256: 'd3f9562d6187cc3189f16077d6d7358d241a2508ead5d5ef6de6c6ea5a2db2d2',
    },
    authorFiniteChecksAreIndependentReview: false,
    priorRejectedBodyR1Reviews: [
      { role: 'accuracy', path: 'tmp/qa/4-05-accuracy-body-r1-review.md', sha256: 'f27a2d450f98b8190e6a6db2dc9dd3f08f170c86f6236774f57dadd9a3cb7b0c', verdict: 'CHANGES_REQUIRED', p1: 0, p2: 3, p3: 1 },
      { role: 'pedagogy', path: 'tmp/qa/4-05-pedagogy-body-r1-review.md', sha256: '9f86fcc0b579084222e9584367e0c378012df8f4e8bf22e73738d4f826db78be', verdict: 'CHANGES_REQUIRED', p1: 0, p2: 1, p3: 1 },
    ] as const,
    priorBodyR2Reviews: [
      { role: 'accuracy', path: 'tmp/qa/4-05-accuracy-body-r2-review.md', bytes: 20_019, sha256: '6d5f17679a2a7bccb0fd1f81f88f8281f8e4b64bd1e99bd461fc3734c9d8275e', verdict: 'CHANGES_REQUIRED', p1: 0, p2: 1, p3: 1 },
      { role: 'pedagogy', path: 'tmp/qa/4-05-pedagogy-body-r2-review.md', bytes: 8_712, sha256: '12479bfe23fbc271f0f51a99f6cbd87c67da920a37e87e4de5406b08d893319f', verdict: 'APPROVE', p1: 0, p2: 0, p3: 1 },
    ] as const,
    priorBodyR3Reviews: [
      { role: 'accuracy', path: 'tmp/qa/4-05-accuracy-body-r3-review.md', bytes: 30_897, sha256: '39e61c6b37354767b52ce1ea62c3381864fe2142718e336f3ba63c36fe85f172', verdict: 'CHANGES_REQUIRED', p1: 0, p2: 3, p3: 1 },
      { role: 'pedagogy', path: 'tmp/qa/4-05-pedagogy-body-r3-review.md', bytes: 20_306, sha256: '9fc8b6a66d0d9d2ace3c4b76c26bfa4667d896523fca091ed9f3a69a7af7af3a', verdict: 'APPROVE', p1: 0, p2: 0, p3: 2 },
    ] as const,
    independentReviews: [
      {
        kind: 'accuracy',
        path: 'tmp/qa/4-05-accuracy-body-r4-review.md',
        bytes: 18_573,
        decision: 'approved',
        verdict: 'APPROVE',
        revision: '4.05-r1',
        completedAt: '2026-09-17T07:33:42Z',
        reportSha256: '719ead1b6caf695efa3db92f80c37967cf80a24e320887b91bca0ba1b48c7bc8',
        p1: 0,
        p2: 0,
        p3: 1,
      },
      {
        kind: 'pedagogy',
        path: 'tmp/qa/4-05-pedagogy-body-r4-review.md',
        bytes: 17_453,
        decision: 'approved',
        verdict: 'APPROVE',
        revision: '4.05-r1',
        completedAt: '2026-09-17T07:31:58Z',
        reportSha256: 'c590d1783398113c15d8159176a034c44f3f675ef57c55343822bc46e160e22e',
        p1: 0,
        p2: 0,
        p3: 2,
      },
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

const state = canonicalDollarFundingStateExample;

export const canonicalDollarFundingAudit = [
  { key: 'canonical state exposes exact declared field order', passed: JSON.stringify(Object.keys(state)) === JSON.stringify(canonicalDollarFundingFields) },
  { key: 'authoring gate identity and independent verdict are exact', passed: state.authoringGate.specificationSha256 === 'abe8c240c10c4abefba940f0ff2fe83bc0cc919899dc4dd62d9b4c44fa383985' && state.authoringGate.independentAuditSha256 === '69f5ab471609b6c22147497d7e2d83e664af6983642a5dcf5fe56a1e69ded399' && state.authoringGate.verdict === 'APPROVE_FOR_AUTHORING' && state.authoringGate.p1 + state.authoringGate.p2 + state.authoringGate.p3 === 0 },
  { key: 'SYN-2 remains pre-action only and never contains collateral or route receipts', passed: !state.preActionLadder.collateralCapacityIncluded && !state.preActionLadder.routeReceiptsIncluded && !state.preActionLadder.gPostExists && !state.preActionLadder.readsOtherLabs },
  { key: 'official layers are separate non-exhaustive routes', passed: !state.officialLayers.sovereignSwap.privateReceiptAutomatic && !state.officialLayers.fimaRepo.privateReceiptAutomatic && state.officialLayers.localOnward.independentTransactionRequired && !state.officialLayers.taxonomyExhaustiveGlobally },
  { key: 'official cash legs use UTC timestamps open-left closed-right window and non-overlapping temporal states', passed: state.officialLayers.temporalContract.timestampFormat === 'UTC ISO minute with Z' && state.officialLayers.temporalContract.prospectiveWindow === '(asOfTimestamp, horizonEndTimestamp]' && state.officialLayers.temporalContract.realisedRule.includes('current X_H/O_H = 0') && state.officialLayers.temporalContract.committedRule.includes('valueTimestamp > asOfTimestamp') && state.officialLayers.temporalContract.statusScope.includes('one status per cash leg') },
  { key: 'sovereign Layer A requires FRBNY execution FOMC authorization four immutable two-currency legs rounded FCY and foreign-CB obligor without private receipt', passed: state.officialLayers.sovereignSwap.fixedSynEntities.fed === 'SYN-FRBNY-01' && state.officialLayers.sovereignSwap.fixedSynEntities.foreignCentralBank === 'SYN-FOREIGN-CB-01' && state.officialLayers.sovereignSwap.executionAuthorization.includes('FOMC authorization') && state.officialLayers.sovereignSwap.labTermInputDomain.includes('experiment domain only') && state.officialLayers.sovereignSwap.officialTermSupport.includes('three months') && state.officialLayers.sovereignSwap.fixedSynTransactionId === 'SYN-C6-A-TX-001' && state.officialLayers.sovereignSwap.fedContractualObligor === 'foreign central bank' && state.officialLayers.sovereignSwap.layerCLocalOnwardRisk.startsWith('N/A') && state.officialLayers.sovereignSwap.fcyMinorUnitDecimals === 2 && state.officialLayers.sovereignSwap.requiredFourLegs.length === 4 && state.officialLayers.sovereignSwap.perLegRequiredFields.includes('cashSettlementStatus') && state.officialLayers.sovereignSwap.pairingRules.length === 6 && !state.officialLayers.sovereignSwap.quotedUnavailableReadHiddenTransactionFields && !state.officialLayers.sovereignSwap.privateReceiptAutomatic },
  { key: 'FIMA canonical route separates required official passport from optional author-SYN additional margin', passed: state.officialLayers.fimaRepo.requiredPassport.length === 13 && !(state.officialLayers.fimaRepo.requiredPassport as readonly string[]).includes('marginValueTimestamp') && state.officialLayers.fimaRepo.optionalAuthorSynAdditionalMarginFields.length === 4 && state.officialLayers.fimaRepo.additionalMarginEvidenceBoundary.includes('author-SYN') && state.officialLayers.fimaRepo.requiredPassport.includes('initialValueTimestamp') && state.officialLayers.fimaRepo.requiredPassport.includes('repurchaseCashStatus') && state.officialLayers.fimaRepo.termDays.overnight === 1 && state.officialLayers.fimaRepo.termDays.sevenCalendarDays === 7 && state.officialLayers.fimaRepo.timestampDomain.initialThroughDay === 30 && state.officialLayers.fimaRepo.timestampDomain.reverseThroughDay === 37 && state.officialLayers.fimaRepo.additionalMarginLifecycle === 'initialTimestamp < marginTimestamp < repurchaseTimestamp' && state.officialLayers.fimaRepo.additionalMarginEndpointPolicy.includes('STOP') && JSON.stringify(state.officialLayers.fimaRepo.cashEligibleStatuses) === JSON.stringify(['realised', 'committed_executable']) },
  { key: 'local onward owns separate receipt repayment statuses dates transaction and collateral rule', passed: state.officialLayers.localOnward.upstreamProvenanceRequired && state.officialLayers.localOnward.ownTransactionAndLegIdsRequired && state.officialLayers.localOnward.repaymentScheduleRequired && state.officialLayers.localOnward.receiptAndRepaymentStatusesIndependent && state.officialLayers.localOnward.timestampDomain.receiptThroughDay === 30 && state.officialLayers.localOnward.timestampDomain.repaymentThroughDay === 37 && state.officialLayers.localOnward.timestampDomain.day30ReceiptAndDay37RepaymentRepresentable && state.officialLayers.localOnward.recipientCollateralRule.includes('recipient-owned') },
  { key: 'reviewed BODY has no observed adapters or unsupported evidence upgrades', passed: state.inputLineage.length === 0 && state.observedSnapshots.length === 0 && state.realDataAdapters.length === 0 && !state.evidenceState.observedData && !state.evidenceState.strictPointInTime && !state.evidenceState.causalIdentification },
  {
    key: 'BODY-r1 r2 and r3 failure provenance is preserved while exact clean BODY-r4 identity and two approvals are registered and downstream delivery remains external',
    passed: state.evidenceState.priorRejectedBodyR1Reviews.length === 2
      && state.evidenceState.priorRejectedBodyR1Reviews.every(review => review.verdict === 'CHANGES_REQUIRED')
      && state.evidenceState.priorBodyR2Reviews.length === 2
      && state.evidenceState.priorBodyR2Reviews.some(review => review.role === 'accuracy' && review.verdict === 'CHANGES_REQUIRED' && review.sha256 === '6d5f17679a2a7bccb0fd1f81f88f8281f8e4b64bd1e99bd461fc3734c9d8275e')
      && state.evidenceState.priorBodyR2Reviews.some(review => review.role === 'pedagogy' && review.verdict === 'APPROVE' && review.sha256 === '12479bfe23fbc271f0f51a99f6cbd87c67da920a37e87e4de5406b08d893319f')
      && state.evidenceState.priorBodyR3Reviews.length === 2
      && state.evidenceState.priorBodyR3Reviews.some(review => review.role === 'accuracy' && review.verdict === 'CHANGES_REQUIRED' && review.bytes === 30_897 && review.sha256 === '39e61c6b37354767b52ce1ea62c3381864fe2142718e336f3ba63c36fe85f172')
      && state.evidenceState.priorBodyR3Reviews.some(review => review.role === 'pedagogy' && review.verdict === 'APPROVE' && review.bytes === 20_306 && review.sha256 === '9fc8b6a66d0d9d2ace3c4b76c26bfa4667d896523fca091ed9f3a69a7af7af3a')
      && state.evidenceState.ownBodyFrozenAt === '2026-09-17T07:20:08.483Z'
      && state.evidenceState.ownReviewFrozenAt === state.evidenceState.ownBodyFrozenAt
      && state.evidenceState.ownBodyIdentity.path === '/private/tmp/market-405-body-r4-clean-20260917'
      && state.evidenceState.ownBodyIdentity.frozenAt === state.evidenceState.ownBodyFrozenAt
      && state.evidenceState.ownBodyIdentity.files === 208
      && state.evidenceState.ownBodyIdentity.bodyFiles === 17
      && state.evidenceState.ownBodyIdentity.bodyAggregateSha256 === '19b671bcdb86c2976708274683c6b757ed2127300f9366555faa389588e2a701'
      && state.evidenceState.ownBodyIdentity.manifestSha256 === '76da7b52311620ec9d9735e59a7b28f07737b06c342a5a4cbef6399409a66247'
      && state.evidenceState.ownBodyIdentity.snapshotSha256 === 'c23d57dd20531d0eeff647839adc8ddc3251226dc052c87dc22ad9ec031d7668'
      && state.evidenceState.ownBodyIdentity.pdfSha256 === 'd3f9562d6187cc3189f16077d6d7358d241a2508ead5d5ef6de6c6ea5a2db2d2'
      && state.evidenceState.ownFrozenManifest.sha256 === state.evidenceState.ownBodyIdentity.manifestSha256
      && state.evidenceState.ownPdfArtifact.sha256 === state.evidenceState.ownBodyIdentity.pdfSha256
      && state.evidenceState.independentReviews.length === 2
      && state.evidenceState.independentReviews.every(review => review.decision === 'approved' && review.verdict === 'APPROVE' && review.revision === '4.05-r1')
      && state.evidenceState.independentReviews[0].reportSha256 === '719ead1b6caf695efa3db92f80c37967cf80a24e320887b91bca0ba1b48c7bc8'
      && state.evidenceState.independentReviews[0].p1 === 0
      && state.evidenceState.independentReviews[0].p2 === 0
      && state.evidenceState.independentReviews[0].p3 === 1
      && state.evidenceState.independentReviews[1].reportSha256 === 'c590d1783398113c15d8159176a034c44f3f675ef57c55343822bc46e160e22e'
      && state.evidenceState.independentReviews[1].p1 === 0
      && state.evidenceState.independentReviews[1].p2 === 0
      && state.evidenceState.independentReviews[1].p3 === 2
      && state.evidenceState.accuracyApprovalComplete
      && state.evidenceState.pedagogyApprovalComplete
      && state.evidenceState.bodyApprovedByTwoIndependentReviewers
      && !state.evidenceState.sealedMetadataDeltaApprovedByTwoIndependentReviewers
      && !state.evidenceState.browserQaComplete
      && !state.evidenceState.noJavaScriptQaComplete
      && !state.evidenceState.keyboardQaComplete
      && !state.evidenceState.responsive390QaComplete
      && !state.evidenceState.nativeA4PrintComplete
      && !state.evidenceState.pdfInspectionComplete
      && !state.evidenceState.allPageVisualInspectionComplete
      && !state.evidenceState.finalPdfAccepted
      && !state.evidenceState.lessonComplete
      && !state.evidenceState.productionEligible
      && !state.evidenceState.strictPointInTime
      && !state.evidenceState.outOfSample
      && !state.evidenceState.causalIdentification
      && !state.evidenceState.forecastValidated
      && !state.evidenceState.tradingPerformanceValidated,
  },
] as const;

if (!canonicalDollarFundingAudit.every(item => item.passed)) {
  throw new Error(`4.05 canonical reviewed-BODY contract failed: ${canonicalDollarFundingAudit.filter(item => !item.passed).map(item => item.key).join(', ')}`);
}
