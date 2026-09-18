import { canonicalDollarFundingStateExample } from './dollarFundingState';

const registeredAt = '2026-09-17T00:00:00Z';

export const globalBanksImportedUpstreamStatusEnum = canonicalDollarFundingStateExample.privateRouteState.statusEnum;
export const globalBanksImportedUpstreamTemporalContract = canonicalDollarFundingStateExample.officialLayers.temporalContract;
export const globalBanksLocalOfficeTypeEnum = ['head_office', 'branch', 'subsidiary'] as const;

export const globalBanksC4LocalScenarioContract = {
  contractId: '406-c4-local-scenario-v1',
  owner: '4.06' as const,
  importedFrom405: {
    fieldsActuallyConsumed: [
      'privateRouteState.statusEnum',
      'officialLayers.temporalContract.timestampFormat',
      'officialLayers.temporalContract.prospectiveWindow',
      'officialLayers.temporalContract.conflictRule',
      'officialLayers.temporalContract.statusScope',
    ] as const,
    statusEnum: globalBanksImportedUpstreamStatusEnum,
    timestampFormat: globalBanksImportedUpstreamTemporalContract.timestampFormat,
    prospectiveWindow: globalBanksImportedUpstreamTemporalContract.prospectiveWindow,
    conflictRule: globalBanksImportedUpstreamTemporalContract.conflictRule,
    statusScope: globalBanksImportedUpstreamTemporalContract.statusScope,
    temporalPredicatesReferenced: [
      'realised requires valueTimestamp <= asOfTimestamp',
      'committed_executable requires valueTimestamp > asOfTimestamp',
    ] as const,
    inherited405BucketInterpretation: false,
    versionedTypedTransferSchemaConsumed: false,
    numericalStateConsumed: false,
  },
  localOfficeTypeEnum: globalBanksLocalOfficeTypeEnum,
  localScenarioIdentityFields: [
    'providerLegalEntityId', 'providerOfficeId', 'providerOfficeType',
    'branchReceiverLegalEntityId', 'branchReceiverOfficeId', 'branchReceiverOfficeType',
    'branchTransactionId', 'branchCashLegId',
    'subsidiaryReceiverLegalEntityId', 'subsidiaryReceiverOfficeId', 'subsidiaryReceiverOfficeType',
    'subsidiaryTransactionId', 'subsidiaryCashLegId',
  ] as const,
  localScenarioValueFields: [
    'commonResourceShockAmount', 'currency', 'valueTimestamp', 'asOfTimestamp', 'decisionHorizonEnd',
    'branchBaseResourcesExcludingTaggedCashLeg', 'branchAdditionalLoanCap',
    'subsidiaryBaseResourcesExcludingTaggedCashLeg', 'subsidiaryAdditionalLoanCap',
  ] as const,
  localStatusTreatment: {
    realised: 'valueTimestamp <= asOfTimestamp; current and decision-horizon contribution equals the local scenario amount',
    committed_executable: 'valueTimestamp > asOfTimestamp; current contribution is zero and only an in-window local prospective contribution may be counted',
    quoted_only: '4.06-local scenario mapping: current contribution known zero, future amount uncounted, base-only capacity',
    unavailable: '4.06-local scenario mapping: tagged route contribution known zero, base-only capacity when the local base passport is complete',
    null: '4.06-local scenario mapping: upstream status unknown; STOP rather than impute zero',
  },
  doubleCountGuard: 'each mutually exclusive scenario base excludes its own scenario cash leg before an eligible contribution is added',
  identityGuard: 'the two counterfactual scenarios share only an abstract shock amount and use different receiver, transaction and cash-leg identities',
} as const;

const hardPrerequisites = [
  {
    lessonId: '2.06',
    role: 'hard-prerequisite-bank-intermediary-semantics',
    canonicalStateConsumed: false,
    numericalOutputsConsumed: false,
    syntheticInputsConsumed: false,
  },
  {
    lessonId: '4.01',
    role: 'hard-prerequisite-residence-position-and-stock-flow-semantics',
    canonicalStateConsumed: false,
    numericalOutputsConsumed: false,
    syntheticInputsConsumed: false,
  },
] as const;

const semanticInterfaces = [
  { lessonId: '3.13', role: 'credit-conditions-language-only', canonicalSchemaConsumed: false, canonicalStateConsumed: false, numericalOutputsConsumed: false },
  { lessonId: '4.03', role: 'safe-asset-and-collateral-language-only', canonicalSchemaConsumed: false, canonicalStateConsumed: false, numericalOutputsConsumed: false },
  { lessonId: '4.04', role: 'curve-and-maturity-language-only', canonicalSchemaConsumed: false, canonicalStateConsumed: false, numericalOutputsConsumed: false },
  { lessonId: '4.05', role: 'status-enum-and-temporal-constraints-only', canonicalSchemaConsumed: false, statusEnumConsumed: true, temporalConstraintsConsumed: true, canonicalStateConsumed: false, numericalOutputsConsumed: false },
] as const;

export const canonicalGlobalBanksStateExample = {
  schemaVersion: 'canonicalGlobalBanksState.v3',
  stateId: '4.06-reviewed-body-r1',
  scopePassport: {
    lessonId: '4.06',
    revision: '4.06-r1',
    title: 'Global Banks 与 Cross-border Credit',
    registeredAt,
    status: 'double-reviewed-body-awaiting-sealed-delta-and-delivery-qa' as const,
    reviewStatus: 'double-reviewed' as const,
    centralQuestion: 'how a typed home, parent, funding or host shock passes group and entity constraints into destination loan offers, retrenchment and borrower substitution',
    hardPrerequisites,
    semanticInterfaces,
    observedParentGroup: null,
    observedLegalEntity: null,
    observedBorrower: null,
    observedCountryPath: null,
    noCommonObservedBankOrBorrowerTrajectory: true,
    isolatedAuthorSyntheticFixturesOnly: true,
    globalFinancialCycleLabelOwnedHere: false,
  },
  inputLineage: [] as const,
  statisticalLensState: {
    activeObservedLens: null,
    lbs: {
      organisingPrinciple: 'bank residence and booking location',
      consolidation: 'unconsolidated-standalone',
      intragroupPositionsIncluded: true,
      benchmarkScope: 'cross-border positions with non-resident related offices; resident-office domestic positions are outside this cross-border aggregate',
      supports: ['currency composition', 'booking geography', 'counterparty residence', 'intragroup positions'] as const,
      doesNotSupport: 'worldwide consolidated group exposure or frictionless group liquidity',
    },
    cbs: {
      organisingPrinciple: 'controlling-parent nationality',
      consolidation: 'worldwide-consolidated-group',
      intragroupPositionsIncluded: false,
      benchmarkScope: 'standard consolidated reporting-area banking groups; standalone/unconsolidated reporting-population exceptions require product metadata',
      bases: ['CBSI-immediate-counterparty', 'CBSG-guarantor'] as const,
      supports: 'country-risk exposure inside a declared consolidation and allocation basis',
      doesNotSupport: 'the original cash route, intragroup transfer path or entity-level executable liquidity',
    },
    locationRule: 'cross-border/local follows booking-office residence versus immediate-counterparty residence; CBSG risk reallocation never rewrites the original borrower or origination route',
    adjustedChangeRule: 'BIS exchange-rate- and break-adjusted changes apply to LBS only and approximate, rather than equal, underlying flows',
    actualLbsSeries: null,
    actualCbsSeries: null,
    actualAdjustedChange: null,
  },
  entityNetworkState: {
    parentGroupId: null,
    parentBankNationality: null,
    reportingLegalEntityId: null,
    officeId: null,
    officeType: null,
    bookingOfficeResidence: null,
    immediateCounterpartyId: null,
    guarantorId: null,
    nodes: [] as const,
    observedEdges: [] as const,
    allowedEdgeTypes: ['ownership', 'intragroup-funding', 'cross-border-claim', 'local-claim', 'guarantee', 'commitment', 'payment'] as const,
    edgeTypesRemainDistinct: true,
    branchOfficeIsSecondLegalEntity: false,
    consolidationCancellationProvesTransferability: false,
  },
  claimChannelState: {
    positionPassportFields: [
      'parentGroupId', 'parentBankNationality', 'reportingLegalEntityId', 'officeId', 'officeType',
      'bookingOfficeResidence', 'immediateCounterpartyResidence', 'immediateCounterpartySector',
      'guarantorResidence', 'guarantorSector', 'allocationBasis', 'riskTransferAmount', 'originationRoute',
      'reportedLocationClass', 'instrument', 'currency', 'remainingMaturity', 'stockOrFlowBasis', 'asOf', 'vintage',
    ] as const,
    observedPositions: [] as const,
    originationRoutes: ['crossBorder', 'local'] as const,
    lbsInstrumentBoundary: {
      credit: 'loans/deposits plus debt securities',
      claims: 'LBS credit plus positive-market-value derivatives plus other residual instruments',
      commitments: 'separate potential exposure; never added to either subtotal',
      universalAcrossDatasets: false,
    },
    cbsInstrumentBoundary: {
      claimsExcludeDerivatives: true,
      derivativesAndCommitmentsRemainSeparateExposureCategories: true,
    },
    remainingMaturityRule: 'time from the reference/as-of date until the claim final contractually scheduled payment; next payment, next reset and upstream value timestamp are separate fields',
    cbsRouteIdentities: {
      foreignClaims: 'XBC + LCFX + LCLC',
      internationalClaims: 'XBC + LCFX',
      bridge: 'ForeignClaims = InternationalClaims + LCLC',
      requiredBasis: 'one foreign borrower country, one nationality, one as-of, one consolidation perimeter, CBSI',
    },
    aggregateIndirectCreditRule: 'positive net cross-border borrowing by resident banks is an aggregate proxy, not traceable funding for a particular loan',
    actualCredit: null,
    actualClaims: null,
    actualCommitments: null,
  },
  upstreamTransferState: {
    interfaceSourceLessonId: '4.05',
    sourceStateFile: 'app/lessons/dollarFundingState.ts',
    sourceStateId: canonicalDollarFundingStateExample.stateId,
    sourceRevision: canonicalDollarFundingStateExample.lesson.revision,
    canonicalSchemaConsumed: false,
    versionedTypedTransferSchemaConsumed: false,
    statusEnumConsumed: true,
    temporalConstraintsConsumed: true,
    interfaceOnly: true,
    numericalStateConsumed: false,
    eligibilityRedecidedHere: false,
    interfaceFieldsActuallyConsumed: globalBanksC4LocalScenarioContract.importedFrom405.fieldsActuallyConsumed,
    allowedStatuses: globalBanksImportedUpstreamStatusEnum,
    importedTemporalConstraints: {
      timestampFormat: globalBanksImportedUpstreamTemporalContract.timestampFormat,
      prospectiveWindow: globalBanksImportedUpstreamTemporalContract.prospectiveWindow,
      conflictRule: globalBanksImportedUpstreamTemporalContract.conflictRule,
      statusScope: globalBanksImportedUpstreamTemporalContract.statusScope,
      temporalPredicatesReferenced: globalBanksC4LocalScenarioContract.importedFrom405.temporalPredicatesReferenced,
      inherited405BucketInterpretation: false,
    },
    localScenarioContract: globalBanksC4LocalScenarioContract,
    observedUpstreamStatus: null,
    observedScenarioInput: null,
  },
  legalFormState: {
    observedLegalForm: null,
    branch: {
      separateLegalEntity: false,
      ownCapitalAssumed: false,
      crossBorderResidentStatisticalOfficePossible: true,
    },
    subsidiary: {
      separateHostLegalEntity: true,
      separatelyCapitalised: true,
      hostRulesCanBind: true,
    },
    universalResilienceRanking: false,
    actualEntityResources: null,
    actualLoanOfferCap: null,
    identifiedLegalFormEffect: null,
  },
  homeHostConstraintState: {
    homeCountry: null,
    hostCountry: null,
    borrowerCountry: null,
    countriesMayDiffer: true,
    homeConstraints: [] as const,
    hostConstraints: [] as const,
    entityInternalLimits: [] as const,
    candidateConstraintTypes: ['capital', 'liquidity', 'currency', 'large-exposure', 'reserve-requirement', 'ring-fencing', 'sanctions', 'operational-timing'] as const,
    bindingConstraint: null,
    constraintObservedToBind: false,
    regulationIsNotUniformLawAcrossJurisdictions: true,
  },
  shockState: {
    observedShock: null,
    shockPassportFields: ['shockId', 'shockType', 'originCountry', 'affectedEntity', 'currency', 'announcementTimestamp', 'effectiveTimestamp', 'measurementWindow', 'sourceEventId'] as const,
    candidateTypes: ['home-policy', 'parent-capital-loss', 'core-currency-funding', 'host-asset-quality', 'home-regulation', 'host-regulation'] as const,
    shockClock: null,
    affectedEntity: null,
    realisedMagnitude: null,
    exposureRandomlyAssigned: null,
    causalInterpretation: null,
  },
  retrenchmentState: {
    observedLoanOfferVector: null,
    observedOrigination: null,
    observedRouteChange: null,
    observedDestinationAllocation: null,
    observedGroupLoanBookChange: null,
    dimensions: ['price', 'quantity', 'maturity', 'covenant', 'collateral', 'renewal', 'approval'] as const,
    termEvidenceMatrix: {
      bankSurveyObservable: ['standards', 'spreads', 'maximum-size', 'maximum-maturity', 'collateral', 'covenants'] as const,
      requiresApplicationOrContractMicrodata: ['approval-probability', 'single-contract-terms', 'renewal', 'drawdown'] as const,
      bisAggregateClaimsObserveFullVector: false,
    },
    feedbackCandidate: {
      arrows: [
        { arrow: 'lender exposure to borrower financing/activity', evidence: 'supported-in-specific-crisis-samples' },
        { arrow: 'borrower loss to bank default/provision', evidence: 'conceptual-unobserved-here' },
        { arrow: 'affiliate provision/profit to parent capital', evidence: 'accounting-candidate-unobserved-here' },
        { arrow: 'parent capital to next cross-host allocation', evidence: 'historical-channel-evidence-but-not-one-closed-loop' },
      ] as const,
      closedLoopObserved: false,
    },
    routeRetreatImpliesGroupContraction: false,
    routeRetreatImpliesBorrowerTotalCreditContraction: false,
    stableGroupTotalCanHideDestinationRetrenchment: true,
    globalCommonFactorIdentified: false,
  },
  substitutionState: {
    observedChannels: [] as const,
    candidateChannels: ['same-bank-other-route', 'other-foreign-bank', 'domestic-bank', 'bond', 'trade-credit', 'borrower-internal-cash'] as const,
    shockedRouteChange: null,
    allBankCoverage: null,
    coveredBankChannelInventory: [] as const,
    requiredAllBankChannels: ['shocked-route', 'same-bank-other-route', 'other-foreign-bank', 'domestic-bank'] as const,
    allBankCreditChange: null,
    coveredBankChannelsChange: null,
    allObservedFinancingChange: null,
    borrowerDemandHeldConstant: null,
    accountingBridgeAvailable: false,
    relativeSupplyIdentified: false,
    totalFinancingEffectIdentified: false,
    realEffectIdentified: false,
  },
  evidenceClock: {
    contractDate: '2026-09-17',
    sourceAccessedAt: '2026-09-17',
    registeredAt,
    observedAsOf: null,
    publishedAt: null,
    retrievedAt: null,
    vintage: null,
    timezone: null,
    eventWindow: null,
    pointInTimeAvailabilityVerified: false,
    historicalReplayClockVerified: false,
    outOfSampleWindow: null,
  },
  observedSnapshots: [] as const,
  realDataAdapters: [] as const,
  evidenceState: {
    mode: 'double-reviewed-body-r3-awaiting-sealed-metadata-delta-and-delivery-qa',
    authoringContractPath: 'tmp/research/4-06-draft/4-06-scope-evidence-contract-r3.md',
    ownBodyFrozenAt: '2026-09-17T11:36:44.028Z',
    ownReviewFrozenAt: '2026-09-17T11:36:44.028Z',
    ownBodyIdentity: {
      phase: 'BODY-r3',
      path: '/private/tmp/market-406-body-r3-clean-20260917',
      frozenAt: '2026-09-17T11:36:44.028Z',
      files: 203,
      bodyFiles: 18,
      bodyAggregateSha256: 'd8045bc53400d5517136e69971bdd6fc7d3cf8374ec403b2586097d39f4ac495',
      manifestSha256: 'e02d42d4b4313318a4d4897ce93c329d8695c2f9966eae7792d30c69b23614d8',
      snapshotSha256: '811f148e29ad6afa80cba6cebc6a494d0f3a7a9ad17094771e40b01747d01dfa',
      pdfSha256: 'f90c40f490e7e2a36b13172c7b426ee800021a07254a5b6b212b90aaf932821b',
    },
    ownFrozenManifest: {
      path: '/private/tmp/market-406-body-r3-clean-20260917/review-bundle-sha256-manifest.txt',
      sha256: 'e02d42d4b4313318a4d4897ce93c329d8695c2f9966eae7792d30c69b23614d8',
      entries: 203,
      bodyFiles: 18,
    },
    ownPdfArtifact: {
      path: 'tmp/pdfs/4-06-candidate-draft-body-r3-author-r1-20260917-a4.pdf',
      pages: 119,
      bytes: 4_341_425,
      sha256: 'f90c40f490e7e2a36b13172c7b426ee800021a07254a5b6b212b90aaf932821b',
    },
    priorBodyR2Reviews: [
      { kind: 'accuracy', path: 'tmp/qa/4-06-accuracy-body-r2-review.md', bytes: 22_531, reportSha256: '863eb1abbf7c12944380595e13925397c0688489b1576fa14b7a9132a16bfc9d', verdict: 'CHANGES_REQUIRED', p1: 0, p2: 2, p3: 3 },
      { kind: 'pedagogy', path: 'tmp/qa/4-06-pedagogy-body-r2-review.md', bytes: 15_664, reportSha256: '1485c6a726eb540d394b9e794362867f5667587a1a29ccfd63b3c61b72ce81a0', verdict: 'CHANGES_REQUIRED', p1: 0, p2: 1, p3: 0 },
    ] as const,
    independentReviews: [
      {
        kind: 'accuracy',
        path: 'tmp/qa/4-06-accuracy-body-r3-review.md',
        bytes: 17_168,
        decision: 'approved',
        verdict: 'APPROVE',
        revision: '4.06-r1',
        completedAt: '2026-09-17T11:43:49Z',
        reportSha256: '834540088ad1172ead0469ff05e412b615a1fb0fa21eb5af7eebffd475dc215d',
        p1: 0,
        p2: 0,
        p3: 0,
      },
      {
        kind: 'pedagogy',
        path: 'tmp/qa/4-06-pedagogy-body-r3-review.md',
        bytes: 14_091,
        decision: 'approved',
        verdict: 'APPROVE',
        revision: '4.06-r1',
        completedAt: '2026-09-17T11:47:33Z',
        reportSha256: 'cacf93d1f27634ac97116d5618479fc5eeb3908fb249defa3213a02845ba9308',
        p1: 0,
        p2: 0,
        p3: 0,
      },
    ] as const,
    bodyFrozen: true,
    accuracyApprovalComplete: true,
    pedagogyApprovalComplete: true,
    bodyApprovedByTwoIndependentReviewers: true,
    sealedMetadataDeltaApprovedByTwoIndependentReviewers: false,
    reviewedBrowserQaComplete: false,
    reviewedNoJavaScriptQaComplete: false,
    reviewedKeyboardQaComplete: false,
    reviewedResponsive390QaComplete: false,
    reviewedNativeA4PrintComplete: false,
    reviewedPdfInspectionComplete: false,
    reviewedAllPageVisualInspectionComplete: false,
    finalPdfAccepted: false,
    lessonComplete: false,
    observedDataImported: false,
    realDataScaleValidated: false,
    pointInTimeCertified: false,
    historicalReplayValidated: false,
    outOfSampleValidated: false,
    causalEffectIdentified: false,
    forecastTargetDefined: false,
    forecastPerformanceValidated: false,
    tradingReturnClaimed: false,
    productionEligibility: false,
    publicationEligibility: false,
    authorFiniteAuditIsIndependentReview: false,
    sourceReadingIsReplication: false,
    eligibility: 'DOUBLE_REVIEWED_BODY_ONLY_AWAITING_SEALED_DELTA_AND_DELIVERY_QA' as const,
  },
} as const;

export const canonicalGlobalBanksFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'statisticalLensState', 'entityNetworkState',
  'claimChannelState', 'upstreamTransferState', 'legalFormState', 'homeHostConstraintState', 'shockState',
  'retrenchmentState', 'substitutionState', 'evidenceClock', 'observedSnapshots', 'realDataAdapters', 'evidenceState',
] as const satisfies readonly (keyof typeof canonicalGlobalBanksStateExample)[];

const state = canonicalGlobalBanksStateExample;

export const canonicalGlobalBanksAuthorAudit = [
  {
    key: 'all canonical top-level fields are explicitly enumerated without silent extras',
    passed: Object.keys(state).length === canonicalGlobalBanksFields.length
      && new Set(canonicalGlobalBanksFields).size === canonicalGlobalBanksFields.length
      && canonicalGlobalBanksFields.every((key) => Object.hasOwnProperty.call(state, key)),
  },
  {
    key: 'only 2.06 and 4.01 are hard prerequisites; 4.05 contributes only its five-state enum and declared temporal constraints with no numerical state',
    passed: state.scopePassport.hardPrerequisites.map((item) => item.lessonId).join('|') === '2.06|4.01'
      && state.scopePassport.semanticInterfaces.map((item) => item.lessonId).join('|') === '3.13|4.03|4.04|4.05'
      && [...state.scopePassport.hardPrerequisites, ...state.scopePassport.semanticInterfaces]
        .every((item) => !item.canonicalStateConsumed && !item.numericalOutputsConsumed)
      && state.scopePassport.semanticInterfaces.find((item) => item.lessonId === '4.05')?.canonicalSchemaConsumed === false
      && state.scopePassport.semanticInterfaces.find((item) => item.lessonId === '4.05')?.statusEnumConsumed === true
      && state.scopePassport.semanticInterfaces.find((item) => item.lessonId === '4.05')?.temporalConstraintsConsumed === true
      && state.scopePassport.semanticInterfaces.filter((item) => item.lessonId !== '4.05').every((item) => !item.canonicalSchemaConsumed),
  },
  {
    key: 'no input lineage, observed snapshot or real-data adapter is silently loaded',
    passed: state.inputLineage.length === 0 && state.observedSnapshots.length === 0 && state.realDataAdapters.length === 0,
  },
  {
    key: 'statistical lenses, legal entities and claim channels retain their non-interchangeable boundaries',
    passed: state.statisticalLensState.lbs.intragroupPositionsIncluded
      && !state.statisticalLensState.cbs.intragroupPositionsIncluded
      && state.statisticalLensState.lbs.benchmarkScope.includes('non-resident related offices')
      && state.statisticalLensState.cbs.benchmarkScope.includes('exceptions')
      && state.claimChannelState.remainingMaturityRule.includes('final contractually scheduled payment')
      && !state.entityNetworkState.branchOfficeIsSecondLegalEntity
      && !state.claimChannelState.lbsInstrumentBoundary.universalAcrossDatasets
      && !state.legalFormState.universalResilienceRanking,
  },
  {
    key: 'upstream provenance imports only the 4.05 status enum and temporal constraints while all C4 identity zero-null and capacity mappings remain a 4.06-local scenario contract',
    passed: state.upstreamTransferState.interfaceOnly
      && !state.upstreamTransferState.canonicalSchemaConsumed
      && !state.upstreamTransferState.versionedTypedTransferSchemaConsumed
      && state.upstreamTransferState.statusEnumConsumed
      && state.upstreamTransferState.temporalConstraintsConsumed
      && !state.upstreamTransferState.numericalStateConsumed
      && state.upstreamTransferState.interfaceFieldsActuallyConsumed.length === 5
      && state.upstreamTransferState.localScenarioContract.contractId === '406-c4-local-scenario-v1'
      && state.upstreamTransferState.localScenarioContract.localStatusTreatment.quoted_only.includes('4.06-local')
      && state.upstreamTransferState.localScenarioContract.localStatusTreatment.unavailable.includes('known zero')
      && state.upstreamTransferState.localScenarioContract.localStatusTreatment.null.includes('STOP')
      && state.upstreamTransferState.localScenarioContract.importedFrom405.inherited405BucketInterpretation === false
      && state.upstreamTransferState.observedUpstreamStatus === null
      && state.upstreamTransferState.observedScenarioInput === null,
  },
  {
    key: 'loan-offer and feedback evidence remain term-specific while all-bank coverage is never inferred',
    passed: !state.retrenchmentState.termEvidenceMatrix.bisAggregateClaimsObserveFullVector
      && state.retrenchmentState.feedbackCandidate.arrows.length === 4
      && !state.retrenchmentState.feedbackCandidate.closedLoopObserved
      && state.substitutionState.allBankCoverage === null
      && state.substitutionState.coveredBankChannelInventory.length === 0
      && state.substitutionState.coveredBankChannelsChange === null,
  },
  {
    key: 'two independent approvals certify only the frozen BODY and do not certify the sealed metadata delta delivery evidence or production',
    passed: state.scopePassport.reviewStatus === 'double-reviewed'
      && state.evidenceState.bodyFrozen
      && state.evidenceState.bodyApprovedByTwoIndependentReviewers
      && state.evidenceState.accuracyApprovalComplete
      && state.evidenceState.pedagogyApprovalComplete
      && state.evidenceState.independentReviews.length === 2
      && state.evidenceState.independentReviews.every((review) => review.verdict === 'APPROVE' && review.p1 === 0 && review.p2 === 0 && review.p3 === 0)
      && state.evidenceState.independentReviews[0].reportSha256 === '834540088ad1172ead0469ff05e412b615a1fb0fa21eb5af7eebffd475dc215d'
      && state.evidenceState.independentReviews[1].reportSha256 === 'cacf93d1f27634ac97116d5618479fc5eeb3908fb249defa3213a02845ba9308'
      && !state.evidenceState.sealedMetadataDeltaApprovedByTwoIndependentReviewers
      && !state.evidenceState.reviewedBrowserQaComplete
      && !state.evidenceState.reviewedNativeA4PrintComplete
      && !state.evidenceState.finalPdfAccepted
      && !state.evidenceState.lessonComplete
      && !state.evidenceState.observedDataImported
      && !state.evidenceState.pointInTimeCertified
      && !state.evidenceState.outOfSampleValidated
      && !state.evidenceState.causalEffectIdentified
      && !state.evidenceState.forecastPerformanceValidated
      && !state.evidenceState.publicationEligibility
      && !state.evidenceState.productionEligibility
      && !state.evidenceState.authorFiniteAuditIsIndependentReview,
  },
] as const;
