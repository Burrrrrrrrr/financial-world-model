import type { ReactNode } from 'react';
import DebtLeverageLab from '../components/DebtLeverageLab';
import {
  DebtOverhangLab,
  DeleveragingPathsLab,
  DistributionTailLab,
  GrossNetDebtLab,
  LeverageRegistryLab,
  MaturityRefinancingLab,
  TargetRebalancingLab,
} from '../components/DebtLeverageMechanismLabs';
import DebtLeverageTransmissionChart from '../components/DebtLeverageTransmissionChart';
import {
  brokerDealerLeverageDataPassport,
  brokerDealerLeverageNormalizedSha256,
  brokerDealerLeverageObservations,
  brokerDealerLeverageRecomputedNormalizedSha256,
  canonicalDebtOverhangInput,
  canonicalDebtOverhangResult,
  canonicalDeleveragingResults,
  canonicalDistributionGroups,
  canonicalDistributionResult,
  canonicalLeverageRegistryInput,
  canonicalLeverageRegistryResult,
  canonicalNetDebtInput,
  canonicalNetDebtResult,
  canonicalPassiveLeverageInput,
  canonicalPassiveLeverageResult,
  canonicalRefinancingGapInput,
  canonicalRefinancingGapResult,
  canonicalTargetLeverageInput,
  canonicalTargetLeverageResult,
  debtLeverageFixtureAudit,
  debtLeverageMechanismLabSourceIds,
  debtLeverageTransmissionSourceIds,
  householdDebtDataPassport,
  householdDebtNormalizedSha256,
  householdDebtObservations,
  householdDebtRecomputedNormalizedSha256,
} from '../components/debtLeverageFixtures';
import {
  debtLeverageNumericAssertionAudit,
  debtLeverageScenarioAssertions,
  debtLeverageScenarios,
} from '../components/debtLeverageScenarios';
import { lesson314, canonicalCreditCycleStateExample } from './lesson-3-14';
import { lesson315ReadingList, lesson315References } from './lesson-3-15-sources';
import type { LessonRecord } from './types';

function Cites({ ns }: { ns: readonly number[] }) {
  return <>{ns.map((n) => <a aria-label={`参考文献 ${n}`} className="citation-mark" href={`#ref-${n}`} key={n}>[{n}]</a>)}</>;
}

function required<T>(value: T | null, label: string): T {
  if (value === null) throw new Error(`3.15 missing canonical ${label}`);
  return value;
}

const registryResult = required(canonicalLeverageRegistryResult, 'leverage registry');
const passiveResult = required(canonicalPassiveLeverageResult, 'passive leverage');
const targetResult = required(canonicalTargetLeverageResult, 'target leverage proposal');
const netDebtResult = required(canonicalNetDebtResult, 'net debt');
const refinancingResult = required(canonicalRefinancingGapResult, 'refinancing gap');
const overhangResult = required(canonicalDebtOverhangResult, 'debt overhang');
const distributionResult = required(canonicalDistributionResult, 'distribution');

type DirectMapping = { sourcePath: string; targetPath: string };

const upstreamMappingSourcePaths = [
  'stateId', 'schemaVersion', 'scopePassport', 'creditAccountingState', 'originationState', 'creditGrowthState',
  'leverageState', 'debtServiceState', 'supplyDemandState', 'underwritingCompositionState',
  'borrowerNetWorthState', 'collateralAssetPriceState', 'refinancingState', 'defaultLossState',
  'intermediaryCapitalState', 'distributionState', 'cyclePhaseState', 'identificationState', 'evidenceState',
  'dynamicDataPassports', 'measurementFlags',
] as const;

const upstreamMappings: readonly DirectMapping[] = upstreamMappingSourcePaths.map((sourcePath) => ({ sourcePath, targetPath: `upstreamCreditCycleState.${sourcePath}` }));

export const canonicalDebtLeverageStateExample = {
  schemaVersion: 'debt-leverage-cycle-state-v1',
  stateId: 'SYNTHETIC_REGISTERED_DEBT_LEVERAGE_CYCLE_STATE',
  scopePassport: {
    subjectId: 'SYNTHETIC-CONSOLIDATED-BORROWER-01', legalEntity: 'SYN-PARENT', sector: 'generic-private-borrower',
    instrumentScope: 'interest-bearing-debt-with-explicit-other-liabilities', consolidationBasis: 'single-legal-entity',
    reportingCurrency: 'SYN', valuationBasis: 'marked-assets-and-contractual-debt-teaching-snapshot',
    asOf: '2026-09-14T00:00:00-04:00', useCaseId: 'MECHANISM-TEACHING-NOT-CYCLE-DATING',
  },
  inputLineage: [{
    lessonId: '3.14', stateId: canonicalCreditCycleStateExample.stateId, schemaVersion: canonicalCreditCycleStateExample.schemaVersion,
    producerLessonRevision: lesson314.revision, producerObservationTime: canonicalCreditCycleStateExample.scopePassport.asOf,
    producerPublicationTime: null, producerRevisionMarker: canonicalCreditCycleStateExample.auditTimestamps.reviewFrozenAt,
    relation: 'direct-contextual-canonical-import-not-entity-calibration', numericCalibration: false as const,
    scopeBridge: 'aggregate-borrower-sector-context-to-single-entity-teaching-ledger-not-a-numeric-transform', mappings: upstreamMappings,
  }],
  clockState: {
    balanceSheetSnapshot: canonicalLeverageRegistryInput.snapshotTime,
    informationCutoff: '2026-09-14T23:59:59-04:00',
    incomeWindow: canonicalLeverageRegistryInput.incomeWindow,
    netDebtTargetDate: canonicalNetDebtInput.targetDate,
    refinancingWindow: `${canonicalRefinancingGapInput.targetWindowStart}/${canonicalRefinancingGapInput.targetWindowEnd}`,
    officialRetrievalDates: [brokerDealerLeverageDataPassport.retrievedAt, householdDebtDataPassport.retrievedAtUtc],
    cycleHorizon: 'state-dependent-no-calendar-forecast',
  },
  unitContract: {
    amountUnit: 'SYN-currency', stockUnit: 'SYN-currency-at-snapshot', flowUnit: 'SYN-currency-per-declared-window',
    leverageUnits: ['assets/equity multiple', 'debt/equity multiple', 'debt/assets decimal ratio', 'debt/income multiple', 'net-debt/EBITDA multiple', 'gross-exposure/NAV multiple'],
    officialUnits: ['broker-dealer assets/equity multiple', 'households-and-nonprofits liabilities/DPI percent'],
    crossUnitArithmeticBlocked: true,
  },
  upstreamCreditCycleState: canonicalCreditCycleStateExample,
  balanceSheetIdentityState: {
    input: canonicalLeverageRegistryInput, result: registryResult, identity: 'assets = debt + other liabilities + equity',
    closes: canonicalLeverageRegistryInput.assets === canonicalLeverageRegistryInput.debt + canonicalLeverageRegistryInput.otherLiabilities + registryResult.equity,
    debtIsAllLiabilities: false,
  },
  leverageMeasureRegistry: {
    measures: [
      { id: 'debt-to-assets', numerator: 'interest-bearing debt', denominator: 'total assets', unit: 'decimal-ratio', value: registryResult.debtToAssets },
      { id: 'debt-to-equity', numerator: 'interest-bearing debt', denominator: 'residual equity under declared valuation basis', unit: 'multiple', value: registryResult.debtToEquity },
      { id: 'assets-to-equity', numerator: 'total assets', denominator: 'residual equity under declared valuation basis', unit: 'multiple', value: registryResult.assetsToEquity },
      { id: 'debt-to-income', numerator: 'interest-bearing debt at snapshot', denominator: 'trailing-twelve-month income', unit: 'multiple', value: registryResult.debtToIncome },
      { id: 'target-date-eligible-net-debt-to-ebitda', numerator: 'course-policy debt less target-date eligible cash', denominator: 'trailing-twelve-month EBITDA', unit: 'multiple', value: registryResult.netDebtToEbitda },
      { id: 'gross-exposure-to-nav', numerator: 'gross exposure', denominator: 'NAV', unit: 'multiple', value: registryResult.grossExposureToNav },
    ],
    baselCapitalOverExposureIsSameMeasure: false,
    nonPositiveDenominatorPolicy: 'STOP',
  },
  grossNetLeverageState: {
    input: canonicalNetDebtInput, result: netDebtResult,
    measureLabel: 'course-target-date-eligible-net-debt', definitionStatus: 'course-canonical-liquidity-policy-not-universal-net-debt-definition',
    eligibilityRule: 'same-legal-entity-and-currency-unrestricted-and-available-by-target-date',
    restrictedOrCrossEntityCashMayEnter: false,
  },
  passiveLeverageState: {
    input: canonicalPassiveLeverageInput, result: passiveResult,
    mechanism: 'asset-price-shock-with-debt-and-other-liabilities-frozen', debtChanged: false,
  },
  targetLeverageRuleState: {
    input: canonicalTargetLeverageInput, result: targetResult, status: 'synthetic-rule-not-observed-target',
    capacityIsTarget: false, targetIsChosenLeverage: false, targetIsActual: false, actualAdjustment: null,
  },
  activeAdjustmentState: {
    proposedAssetTrade: targetResult.proposedAssetTrade, proposedDebtChange: targetResult.proposedDebtChange,
    proposalStatus: targetResult.proposalStatus, observedAction: null, executedPrice: null, executionTime: null,
  },
  debtCompositionState: {
    maturityBuckets: canonicalRefinancingGapInput.maturityBuckets, interestRateType: 'not-collected',
    targetWindowInterestDue: canonicalRefinancingGapInput.interestDue,
    targetWindowInterestAssumptionStatus: 'synthetic-explicit-zero-not-derived-from-rate-type',
    floatingRateShare: null, securedShare: null, seniorityWaterfall: null,
    currencyMismatchState: 'not-computed-without-hedge-and-cash-flow-legs', nominalForeignDebtIsNetExposure: false,
  },
  maturityRefinancingState: {
    input: canonicalRefinancingGapInput, result: refinancingResult,
    bucketsMutuallyExclusive: true, principalCountedOnce: true, interestDueExplicit: true,
    gapClampedAtZero: true, surplusReportedSeparately: true, positiveGapIsDefault: false,
  },
  debtServiceCoverageState: {
    upstreamDebtServiceState: canonicalCreditCycleStateExample.debtServiceState,
    distinction: 'ICR-covers-interest; DSCR-and-DSR-include-declared-principal-window',
    sameWindowRequired: true, individualContractScheduleCollected: false,
  },
  liquidityBufferState: {
    eligibleCash: netDebtResult.eligibleCash, reliableRefinancingSources: refinancingResult.totalReliableSources,
    uncommittedFacilitiesMayEnterAtPar: false, liquidityIsSolvency: false,
  },
  debtOverhangState: {
    input: canonicalDebtOverhangInput, result: overhangResult,
    totalValueTestSeparateFromEquityIncentiveTest: true, observedInvestmentEffect: null,
  },
  deleveragingPathState: {
    paths: canonicalDeleveragingResults,
    writeDownIsCashRepayment: false, identicalEndingRatioImpliesIdenticalEconomicEffect: false,
  },
  assetPriceFeedbackState: {
    firstRoundProposal: targetResult, priceImpactFunction: null, marketDepthState: 'not-estimated',
    fireSaleClaimStatus: 'routed-to-7.13-not-estimated-here',
  },
  realActivityFeedbackState: {
    borrowerSpendingResponse: 'mechanism-supported-not-estimated', lenderLossResponse: 'first-creditor-transfer-only',
    aggregationConditions: ['constrained borrowers have high spending response', 'unconstrained agents do not fully offset', 'prices or rates cannot clear costlessly'],
    multiplier: null,
  },
  distributionState: {
    groups: canonicalDistributionGroups, result: distributionResult,
    ratioOfSumsEqualsAverageOfRatios: false, missingTailIsZero: false, aggregateIsMicroHousehold: false,
  },
  resilienceState: {
    equityIssuanceCapacity: 'not-observed', unencumberedLiquidAssets: 'partially-observed-in-synthetic-eligibility-ledger',
    deepPocketBuyerCapacity: 'not-observed', policyBalanceSheetAbsorption: 'not-observed',
    absenceOfObservedBufferMeansZero: false,
  },
  cyclePhaseState: {
    phaseLabel: 'not-classified', deterministicClockClaimed: false, turningPointObserved: false,
    triggerSeparatedFromVulnerability: true,
  },
  identificationState: {
    leverageShockStatus: 'not-identified', priceDebtDirectionStatus: 'simultaneous-not-resolved',
    targetLeverageObserved: false, causalEstimate: null, standardError: null, supportPopulation: null,
  },
  evidenceState: {
    measurementStatus: 'synthetic-mechanically-audited-with-two-official-orientations',
    predictionStatus: 'not-estimated', causalStatus: 'not-identified', crisisProbability: null,
    theoryModelsAreUniversalCalibration: false,
  },
  dynamicDataPassports: [brokerDealerLeverageDataPassport, householdDebtDataPassport],
  measurementFlags: [
    { objectId: 'C1-C7', flag: 'synthetic', mayEnterCanonicalCalculation: true, reason: 'registered teaching arithmetic only' },
    { objectId: brokerDealerLeverageDataPassport.sourceId, flag: 'observed-official-may-2026-publication-vintage', mayEnterCanonicalCalculation: false, reason: 'sector scale orientation only' },
    { objectId: householdDebtDataPassport.sourceId, flag: 'observed-official-latest-vintage', mayEnterCanonicalCalculation: false, reason: 'sector composition and denominator orientation only' },
    { objectId: 'crisis-probability', flag: 'not-estimated', mayEnterCanonicalCalculation: false, reason: 'no preregistered label, PIT panel, model or OOS evaluation' },
  ],
  boundaryRoutes: [
    { destination: '3.16 Housing–Collateral Feedback', payload: 'mortgage contract, recourse, foreclosure, housing supply and household heterogeneity', guardrail: 'aggregate household liabilities/DPI is not an average mortgage LTV' },
    { destination: '3.09 Intermediaries', payload: 'institution-specific business models, capital and liquidity constraints', guardrail: 'broker-dealer evidence cannot represent banks, insurers or funds' },
    { destination: '7.11 Market Liquidity × Funding Liquidity Spiral', payload: 'funding capacity, market liquidity and their two-way reinforcement', guardrail: '3.15 does not estimate a funding-to-liquidity response function' },
    { destination: '7.12 Leverage Cycle 与 Margin Spiral', payload: 'endogenous haircut, maintenance margin and leverage-target adjustment', guardrail: '3.15 treats a margin change only as a trigger interface' },
    { destination: '7.13 Fire Sale、Crowded Unwind 与 Contagion', payload: 'market depth, price impact, constrained buyers and liquidation externality', guardrail: '3.15 does not estimate a sale-to-price function' },
    { destination: '7.16 Financial Networks 与 Contagion Channels', payload: 'bilateral claims, common exposures and second-round creditor propagation', guardrail: '3.15 stops after the first creditor loss transfer' },
    { destination: '7.24–7.26 Research', payload: 'PIT vintages, labels, horizons, designs, OOS evaluation and causal gates', guardrail: 'descriptive leverage is neither a probability nor an identified shock' },
  ],
  auditTimestamps: {
    constructedAt: '2026-09-14T18:00:00-04:00', sourceRetrievalDate: '2026-09-14', reviewFrozenAt: '2026-09-15T08:46:35.832Z',
  },
} as const;

export const canonicalDebtLeverageStateFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'clockState', 'unitContract',
  'upstreamCreditCycleState', 'balanceSheetIdentityState', 'leverageMeasureRegistry', 'grossNetLeverageState',
  'passiveLeverageState', 'targetLeverageRuleState', 'activeAdjustmentState', 'debtCompositionState',
  'maturityRefinancingState', 'debtServiceCoverageState', 'liquidityBufferState', 'debtOverhangState',
  'deleveragingPathState', 'assetPriceFeedbackState', 'realActivityFeedbackState', 'distributionState',
  'resilienceState', 'cyclePhaseState', 'identificationState', 'evidenceState', 'dynamicDataPassports',
  'measurementFlags', 'boundaryRoutes', 'auditTimestamps',
] as const satisfies readonly (keyof typeof canonicalDebtLeverageStateExample)[];

type PathResolution = { found: true; value: unknown } | { found: false };
function resolvePath(root: unknown, path: string): PathResolution {
  let cursor = root;
  for (const segment of path.split('.')) {
    if (!segment || typeof cursor !== 'object' || cursor === null || !Object.prototype.hasOwnProperty.call(cursor, segment)) return { found: false };
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return { found: true, value: cursor };
}

function mappingMatches(sourceRoot: unknown, targetRoot: unknown, mapping: DirectMapping) {
  const source = resolvePath(sourceRoot, mapping.sourcePath);
  const target = resolvePath(targetRoot, mapping.targetPath);
  return source.found && target.found && source.value !== undefined && target.value !== undefined && Object.is(source.value, target.value);
}

const mappingAudit = upstreamMappings.map((mapping) => ({ ...mapping, passed: mappingMatches(canonicalCreditCycleStateExample, canonicalDebtLeverageStateExample, mapping) }));
const cutoff = Date.parse(canonicalDebtLeverageStateExample.clockState.informationCutoff);
const producerTime = Date.parse(canonicalDebtLeverageStateExample.inputLineage[0].producerObservationTime);
const reviewMarkerTime = Date.parse(canonicalDebtLeverageStateExample.inputLineage[0].producerRevisionMarker ?? '');
const canonicalDebtLeverageStateKeySet = new Set<string>(canonicalDebtLeverageStateFields);
const canonicalDebtLeverageStateKeys = Object.keys(canonicalDebtLeverageStateExample);

export const canonicalDebtLeverageStateAudit = [
  { key: 'all 30 canonical top-level keys covered exactly', passed: canonicalDebtLeverageStateFields.length === 30 && canonicalDebtLeverageStateKeySet.size === 30 && canonicalDebtLeverageStateKeys.length === 30 && canonicalDebtLeverageStateFields.every((field) => Object.prototype.hasOwnProperty.call(canonicalDebtLeverageStateExample, field)) && canonicalDebtLeverageStateKeys.every((field) => canonicalDebtLeverageStateKeySet.has(field)) },
  { key: 'stable schema and registered state identity', passed: canonicalDebtLeverageStateExample.schemaVersion === 'debt-leverage-cycle-state-v1' && !canonicalDebtLeverageStateExample.schemaVersion.includes('draft') && canonicalDebtLeverageStateExample.stateId === 'SYNTHETIC_REGISTERED_DEBT_LEVERAGE_CYCLE_STATE' },
  { key: '3.14 is the sole direct contextual producer and never calibrates the entity ledger', passed: canonicalDebtLeverageStateExample.inputLineage.length === 1 && canonicalDebtLeverageStateExample.inputLineage[0].producerLessonRevision === lesson314.revision && canonicalDebtLeverageStateExample.inputLineage[0].stateId === canonicalCreditCycleStateExample.stateId && canonicalDebtLeverageStateExample.inputLineage[0].relation === 'direct-contextual-canonical-import-not-entity-calibration' && canonicalDebtLeverageStateExample.inputLineage[0].numericCalibration === false },
  { key: 'all upstream source-to-target mappings match by primitive or object identity', passed: mappingAudit.length === upstreamMappingSourcePaths.length && mappingAudit.every(({ passed }) => passed) && new Set(mappingAudit.map(({ sourcePath, targetPath }) => `${sourcePath}->${targetPath}`)).size === mappingAudit.length },
  { key: 'missing source, missing target, unwired object and equal clone are rejected', passed: !mappingMatches(canonicalCreditCycleStateExample, canonicalDebtLeverageStateExample, { sourcePath: '__missing__', targetPath: 'upstreamCreditCycleState.stateId' }) && !mappingMatches(canonicalCreditCycleStateExample, canonicalDebtLeverageStateExample, { sourcePath: 'stateId', targetPath: 'upstreamCreditCycleState.__missing__' }) && !mappingMatches(canonicalCreditCycleStateExample, canonicalDebtLeverageStateExample, { sourcePath: 'creditAccountingState', targetPath: 'upstreamCreditCycleState.leverageState' }) && !mappingMatches({ a: { x: 1 } }, { b: { x: 1 } }, { sourcePath: 'a', targetPath: 'b' }) },
  { key: 'producer observation and review marker are not after information cutoff', passed: Number.isFinite(cutoff) && Number.isFinite(producerTime) && Number.isFinite(reviewMarkerTime) && producerTime <= cutoff && reviewMarkerTime <= cutoff },
  { key: 'scope freezes legal entity, currency, consolidation, valuation and as-of', passed: canonicalDebtLeverageStateExample.scopePassport.legalEntity === canonicalNetDebtInput.debtLegalEntity && canonicalDebtLeverageStateExample.scopePassport.reportingCurrency === canonicalNetDebtInput.debtCurrency && canonicalDebtLeverageStateExample.scopePassport.consolidationBasis === 'single-legal-entity' && Boolean(canonicalDebtLeverageStateExample.scopePassport.valuationBasis) && canonicalDebtLeverageStateExample.scopePassport.asOf === canonicalLeverageRegistryInput.snapshotTime },
  { key: 'balance sheet closes and debt remains narrower than total liabilities', passed: canonicalDebtLeverageStateExample.balanceSheetIdentityState.closes && canonicalDebtLeverageStateExample.balanceSheetIdentityState.debtIsAllLiabilities === false && registryResult.totalLiabilities === 90 && registryResult.equity === 10 },
  { key: 'six leverage measures preserve numerator denominator units and net-debt policy clock', passed: canonicalDebtLeverageStateExample.leverageMeasureRegistry.measures.length === 6 && new Set(canonicalDebtLeverageStateExample.leverageMeasureRegistry.measures.map(({ id }) => id)).size === 6 && canonicalDebtLeverageStateExample.leverageMeasureRegistry.nonPositiveDenominatorPolicy === 'STOP' && canonicalLeverageRegistryInput.eligibleCashPolicy === netDebtResult.policyId && canonicalLeverageRegistryInput.eligibleCashTargetDate === canonicalNetDebtInput.targetDate && canonicalLeverageRegistryInput.eligibleCash === netDebtResult.eligibleCash },
  { key: 'course net-debt policy admits one cash pool and rejects restricted cross-entity currency and future cash', passed: netDebtResult.policyId === 'course-target-date-eligible-cash-v1' && netDebtResult.eligibleCash === 5 && netDebtResult.netDebt === 75 && netDebtResult.decisions.filter(({ eligible }) => eligible).length === 1 && canonicalDebtLeverageStateExample.grossNetLeverageState.restrictedOrCrossEntityCashMayEnter === false && canonicalDebtLeverageStateExample.grossNetLeverageState.definitionStatus.includes('not-universal') },
  { key: 'passive shock freezes debt while target rule remains synthetic and non-actual', passed: passiveResult.debtChanged === false && passiveResult.after.debt === passiveResult.before.debt && targetResult.actualAdjustment === null && canonicalDebtLeverageStateExample.targetLeverageRuleState.capacityIsTarget === false && canonicalDebtLeverageStateExample.targetLeverageRuleState.targetIsActual === false && canonicalDebtLeverageStateExample.activeAdjustmentState.observedAction === null },
  { key: 'maturity uses explicitly include zero interest while gap and surplus are separately clamped', passed: canonicalDebtLeverageStateExample.maturityRefinancingState.bucketsMutuallyExclusive && canonicalDebtLeverageStateExample.maturityRefinancingState.principalCountedOnce && canonicalDebtLeverageStateExample.maturityRefinancingState.interestDueExplicit && canonicalDebtLeverageStateExample.maturityRefinancingState.gapClampedAtZero && canonicalDebtLeverageStateExample.maturityRefinancingState.surplusReportedSeparately && canonicalDebtLeverageStateExample.debtCompositionState.targetWindowInterestDue === 0 && canonicalDebtLeverageStateExample.debtCompositionState.targetWindowInterestAssumptionStatus === 'synthetic-explicit-zero-not-derived-from-rate-type' && refinancingResult.principalDue === 30 && refinancingResult.interestDue === 0 && refinancingResult.otherUsesExcludingPrincipalAndInterest === 0 && refinancingResult.totalUses === 30 && refinancingResult.totalReliableSources === 19 && refinancingResult.refinancingGap === 11 && refinancingResult.surplus === 0 && canonicalDebtLeverageStateExample.maturityRefinancingState.positiveGapIsDefault === false },
  { key: 'debt overhang separates total NPV creditor gain and equity NPV', passed: overhangResult.totalNpv === 5 && overhangResult.creditorGain === 10 && overhangResult.equityNpv === -5 && canonicalDebtLeverageStateExample.debtOverhangState.totalValueTestSeparateFromEquityIncentiveTest },
  { key: 'four repair paths close but write-down is not repayment', passed: canonicalDeleveragingResults.length === 4 && canonicalDeleveragingResults.every((result) => result?.closes && result.reachesTarget) && canonicalDebtLeverageStateExample.deleveragingPathState.writeDownIsCashRepayment === false },
  { key: 'distribution keeps ratio-of-sums average-of-ratios and tail distinct', passed: distributionResult.averageOfRatios !== distributionResult.ratioOfSums && distributionResult.vulnerableWeight === 0.2 && canonicalDebtLeverageStateExample.distributionState.missingTailIsZero === false },
  { key: 'cycle phase is unclassified and trigger stays separate from vulnerability', passed: canonicalDebtLeverageStateExample.cyclePhaseState.phaseLabel === 'not-classified' && !canonicalDebtLeverageStateExample.cyclePhaseState.deterministicClockClaimed && canonicalDebtLeverageStateExample.cyclePhaseState.triggerSeparatedFromVulnerability },
  { key: 'measurement prediction and causality remain separated', passed: canonicalDebtLeverageStateExample.evidenceState.measurementStatus.includes('mechanically-audited') && canonicalDebtLeverageStateExample.evidenceState.predictionStatus === 'not-estimated' && canonicalDebtLeverageStateExample.evidenceState.causalStatus === 'not-identified' && canonicalDebtLeverageStateExample.evidenceState.crisisProbability === null },
  { key: 'official evidence is quarantined and recomputes to both frozen hashes', passed: canonicalDebtLeverageStateExample.dynamicDataPassports.length === 2 && canonicalDebtLeverageStateExample.dynamicDataPassports.every(({ mayEnterCanonicalCalculation }) => mayEnterCanonicalCalculation === false) && brokerDealerLeverageRecomputedNormalizedSha256 === brokerDealerLeverageNormalizedSha256 && householdDebtRecomputedNormalizedSha256 === householdDebtNormalizedSha256 },
  { key: 'Chapter 7 boundary routes use the official liquidity margin fire-sale and network numbering', passed: ['7.11 Market Liquidity × Funding Liquidity Spiral', '7.12 Leverage Cycle 与 Margin Spiral', '7.13 Fire Sale、Crowded Unwind 与 Contagion', '7.16 Financial Networks 与 Contagion Channels'].every((destination) => canonicalDebtLeverageStateExample.boundaryRoutes.some((route) => route.destination === destination)) && canonicalDebtLeverageStateExample.assetPriceFeedbackState.fireSaleClaimStatus === 'routed-to-7.13-not-estimated-here' },
  { key: 'fixture and scenario runtime gates pass', passed: debtLeverageFixtureAudit.every(({ passed }) => passed) && debtLeverageScenarioAssertions.every(({ passed }) => passed) && debtLeverageNumericAssertionAudit.every(({ passed }) => passed) },
] as const;

if (!canonicalDebtLeverageStateAudit.every(({ passed }) => passed)) {
  throw new Error(`3.15 canonical state gate failed: ${canonicalDebtLeverageStateAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

type ConceptSection = {
  number: number;
  id: string;
  label: string;
  title: string;
  paragraphs: readonly string[];
  formula?: { label: string; expression: string; note: string };
  boundary: string;
  sourceIds: readonly number[];
  after?: ReactNode;
};

const conceptSections: readonly ConceptSection[] = [
  {
    number: 2, id: 'object-separation', label: 'DEBT, LEVERAGE & VULNERABILITY',
    title: '第一步不是问“杠杆高不高”，而是把债务合约、杠杆比率与脆弱性状态拆成三个对象。',
    paragraphs: [
      '债务是一组带有币种、利率、期限、优先级、抵押和偿付承诺的合约；杠杆是用某个资产、权益、收入或暴露分母把这些头寸压成比率；脆弱性则是主体遇到价格、收入、利率或再融资冲击后必须怎样反应的状态。三者相关，却绝不等同。只知道“债务80”不知道主体有多少资产与现金流，只知道“A/E十倍”也不知道债务明天到期还是二十年后到期。',
      '因此本课的中心问题不是寻找一个万能杠杆数字，而是追踪固定或优先偿付承诺怎样在好时期累积，并在状态反转时把损失、现金缺口和行为约束连起来。一个低A/E主体可能因短债集中而先发生流动性危机；一个高A/E主体若拥有稳定长期资金和深厚未抵押流动性，也可能承受同样价格波动而无需抛售。',
    ],
    boundary: '3.14拥有信用条件与信用流量如何形成反馈；3.15从已经形成的债务存量和合约结构出发。高债务、高杠杆与高危机概率在本页永久保持不同身份。',
    sourceIds: [1, 5, 6, 9],
  },
  {
    number: 3, id: 'stock-flow-vintages', label: 'STOCK, FLOW & VINTAGE',
    title: '好时期的新增融资是流量；真正留到下一次冲击中的，是不同vintage债务组成的存量。',
    paragraphs: [
      '某季度新增贷款很多，并不意味着期末债务一定等量增加，因为旧债同时偿还、违约核销、汇率与估值变化、重分类都可能改变存量。反过来，新贷增速已经下降时，过去多年累积的本金仍然存在，并继续携带其固定利率、浮动利率、到期日和担保条款。债务周期因而有记忆：今天的脆弱性由多批历史合约共同决定，而不是只由当期信贷流量决定。',
      'vintage视角还解释了为什么加息的作用并不同时到达所有借款人。新借款立即面对新利率，浮息债务在重定价日传导，固定利率债务可能要到到期或再融资时才重设现金负担。若只画一条平均债务余额曲线，便会丢掉决定“谁先被迫行动”的合同日历。',
    ],
    formula: { label: '存量—流量桥', expression: 'Dₜ₊₁ = Dₜ + new borrowingₜ − principal repaidₜ − write-offsₜ + valuation / FX / reclassificationₜ', note: '左侧是期末存量，右侧包含期间流量和其他变化；债务下降可能来自偿还，也可能来自核销，二者福利与损失承担完全不同。' },
    boundary: '完整信用发放、提款、偿还和核销账本已在3.14建立；本节只保留债务vintage怎样把过去融资决定带入当前约束。',
    sourceIds: [9, 22, 23, 25],
  },
  {
    number: 4, id: 'balance-sheet-identity', label: 'BALANCE-SHEET IDENTITY',
    title: '资产负债表恒等式规定损失落点：资产变化不能绕过负债与权益的对账。',
    paragraphs: [
      '在同一法律实体、同一合并口径、同一币种和同一时点上，总资产等于全部负债加权益。若有息债务短期不变、其他负债也被冻结，资产市值下降就会一比一减少权益。这个结论不需要恐慌、行为偏差或网络传染；它只是权益作为剩余索取权和第一损失层的会计结果。',
      '但“有息债务”通常不是“全部负债”。应付账款、准备金、衍生品负债或其他合同承诺都可能占用资产。用A−D直接称作权益，只有在明确声明其他负债为零时才成立。许多看似惊人的杠杆比较，实际源于漏掉负债、跨实体净额结算，或把市场价值资产与滞后账面权益放在不同估值时点。',
    ],
    formula: { label: '恒等式', expression: 'Aₜ = Dₜ + Lᵒᵗʰᵉʳₜ + Eₜ', note: 'A、D、其他负债与E必须属于同一主体和同一快照。恒等式能对账，却不能解释这些头寸为何形成。' },
    boundary: '恒等式是测量地板，不是行为理论；它既不告诉我们主体会不会卖出，也不说明资产价格为何先下降。',
    sourceIds: [1, 3, 6, 11],
  },
  {
    number: 5, id: 'leverage-measure-registry', label: 'LEVERAGE MEASURE REGISTRY',
    title: '“杠杆”必须携带分子、分母、单位、主体与时钟，脱离注册表就没有可比较含义。',
    paragraphs: [
      'D/A回答有多少资产由有息债务支持，D/E刻画债务相对剩余权益的大小，A/E给出资产损失对权益回报的机械放大，D/收入与债务偿付率（debt service ratio, DSR）接近偿付能力问题，本课目标日合资格净债务/息税折旧及摊销前利润（earnings before interest, taxes, depreciation and amortization, EBITDA）还需要一条明确的现金资格政策，gross exposure/基金资产净值（net asset value, NAV）则常用于基金的表内外敞口。它们不能因为都叫“杠杆”就横向相加或替换。',
      '监管语言尤其容易制造方向性误读。Basel杠杆率是Tier 1资本除以监管暴露，数值越高通常表示资本缓冲越厚；本课常用的A/E则是资产除以权益，数值越高表示每单位权益承托更多资产。对冲基金的gross notional/NAV又可能远高于净方向性风险。读任何图之前，应先把名称翻译成完整的分数。',
    ],
    formula: { label: '六个常见口径', expression: 'D/A ; D/E ; A/E ; D/Income ; (D − eligible cash)/EBITDA ; gross exposure/NAV', note: '每个比率都无量纲，但经济含义由分母、净额规则和时钟决定。分母非正时应STOP，而不是继续显示正常倍数。' },
    boundary: '本节用注册表建立可比性，不提供跨部门“统一安全阈值”。真实监管计算仍须回到相应法域、暴露转换和净额规则。',
    sourceIds: [1, 5, 6, 7, 8],
    after: <LeverageRegistryLab />,
  },
  {
    number: 6, id: 'first-loss-equity', label: 'FIRST-LOSS EQUITY',
    title: '杠杆放大的第一发动机是薄权益：资产小幅变化会变成权益的大幅百分比变化。',
    paragraphs: [
      '假设资产100、债务90、权益10，且债务在一个短窗口内不随市场价格调整。资产下跌4只占资产的4%，却会把权益从10压到6，即损失40%。初始A/E越高，同样的资产回报越能放大为权益回报；当资产跌幅达到初始权益占资产的比例时，本课声明估值口径下的剩余权益被耗尽。',
      '这种机械放大只说明损失如何分配，还没有形成周期。要让它演化成下一轮价格与收入冲击，必须再满足约束接近生效、主体难以及时补充权益、资产出售或减支会影响市场、并且没有足够的非约束买家吸收头寸。若这些条件不成立，杠杆会放大所有者损失，却不一定造成系统反馈。',
    ],
    formula: { label: '资产损失到权益损失', expression: 'Eₜ₊₁ = Eₜ(1 − λₜx), where λₜ=Aₜ/Eₜ and x is the asset-loss fraction', note: '在债务与其他负债冻结的简化下，权益回报约为−λx。十倍A/E遇到4%资产损失，权益约损失40%。' },
    boundary: '公式是单期、无现金流、债务短期固定的机械反事实；资产未按市值计量、债务也重估或期间有盈利时，必须重新对账。',
    sourceIds: [1, 18, 20, 21],
  },
  {
    number: 7, id: 'debt-equity-payoff', label: 'PAYOFF ASYMMETRY',
    title: '债务的优先偿付与股权的剩余索取权，把连续资产结果变成有阈值的利益分配。',
    paragraphs: [
      '在最简单的单一优先债务模型里，债权人到期最多收到面值F，也最多只能从资产价值中回收；股东得到偿付债务后的正剩余。资产价值高于F时，额外上行主要进入股权；资产价值低于F时，股权归零，进一步下行转为债权人的损失。有限责任由此制造非线性，并为债务积压与风险转移提供共同底层。',
      '现实合同比这个支付图复杂：债务可能有多级优先权、担保、追索权、破产成本、交叉违约与重组谈判。把股权类比为看涨期权有助于理解阈值，却不能替代法律支付瀑布；特别是有追索权按揭与无追索权合约、公司担保与项目融资的行为激励可能截然不同。',
    ],
    formula: { label: '最简到期支付', expression: 'Equity_T = max(A_T − F, 0); Creditor_T = min(F, A_T)', note: '这是无处置成本、单一优先债务的教学支付图。债权人并非永远无损，股权也不等于真实市场期权价格。' },
    boundary: '破产优先级、担保执行、追索权与网络第二跳属于制度和7.16；本节只使用最简支付结构解释激励阈值。',
    sourceIds: [12, 13, 26],
  },
  {
    number: 8, id: 'solvency-liquidity', label: 'SOLVENCY ≠ LIQUIDITY',
    title: '“最终有足够资产”与“今天有足够现金”是两种约束，资不抵债也不等于立即现金违约。',
    paragraphs: [
      '偿付能力问资产最终价值能否覆盖全部负债；流动性问到期日能否交付指定币种现金。拥有价值100的长期资产和债务80的主体仍可能因明天到期30、手中现金只有5而违约；反过来，一个长期固定利率借款人即使抵押品市值暂低于贷款，只要合同不要求按市值补仓且收入能继续支付，未必立即出售。',
      '周期的下行速度因此由合同触发器决定，而不是由净值状态单独决定。保证金每日重估，企业契约常按季度测试，家庭按月付款，长期债务到期可能在数年以后。把它们压进一个季度平均杠杆，会把“已经损失”“必须今天付钱”和“将来可能无法偿付”混成同一事件。',
    ],
    boundary: '流动性与偿付能力可能相互转化：被迫低价出售会损害最终偿付能力，长期资不抵债也会让续借者退出。但二者在诊断起点上必须分开。',
    sourceIds: [22, 23, 27],
  },
  {
    number: 9, id: 'gross-net-debt', label: 'GROSS / NET DEBT',
    title: '本课目标日合资格净债务不是总债务减“看到的所有现金”，而是按预先声明的资格政策扣除可用现金。',
    paragraphs: [
      '本课先注册一条保守的目标日现金资格政策：只有与债务同一法律实体、币种匹配、没有抵押或监管限制，并且能在目标偿付日之前调动的现金才允许扣除。受限客户资金、海外子公司无法上划的余额、未完成换汇的外币现金或未来才到账的应收款，都不能因为报表上存在就按面值抵销今天的债务。这是教学canonical的流动性压力定义，不是外部文献或实务中唯一通用的net debt定义。',
      '这个净额口径能回答“按本课资格政策动用现金后，剩余债务是多少”，但不能自动回答偿债压力。合并报表、可执行现金池或已锁定换汇安排可以采用另一条已披露规则；即便本课合资格净债务低，期限高度集中或现金必须维持运营，主体仍可能面临再融资缺口；反过来，gross debt很高但期限很长、收入稳定，短期现金压力可以较低。',
    ],
    formula: { label: '本课目标日合资格净债务', expression: 'Course-policy eligible net debt = gross debt − Σ cash_i · 1[same entity, same currency, unrestricted, available by target date]', note: '指示函数只有在四道门同时通过时取1；政策ID为course-target-date-eligible-cash-v1。换口径必须换标签并重新登记，不能把它称为普适恒等式。' },
    boundary: '实务net debt可以基于合并口径、现金池与可兑换性采用不同规则；衍生品净额结算、资本管制与跨境上划仍需合同级核验。本实验不会从名义对冲或集团总现金推断可用净额。',
    sourceIds: [5, 6, 10],
    after: <GrossNetDebtLab />,
  },
  {
    number: 10, id: 'collateral-capacity', label: 'COLLATERAL CAPACITY',
    title: '抵押品价格影响的是可借上限；这个上限并不等于主体愿意借、贷款人实际批或资金已经到账。',
    paragraphs: [
      '抵押型债务把借款上限连接到可执行的抵押品价值。价格上涨、可质押比例提高或advance rate上升，会让同样净值支持更多借款；价格下跌则反向收紧。但这只是一条容量边界，主体可能没有投资需求，贷款人可能因现金流或信誉拒绝，即使批准也可能尚未提款。',
      '这里最重要的语义是capacity、target、choice和actual四分法。容量是合同最大值，目标是主体内部规则，选择是通过治理后的订单或融资申请，实际则需要成交与资金交付证据。把任何一栏自动提升为下一栏，会把一个可能性误写成了真实信用或真实资产需求。',
    ],
    formula: { label: '简化抵押上限', expression: 'Bₜ ≤ θₜ · Eₜ[qₜ₊₁Kₜ] / Rₜ', note: 'θ概括可执行与可质押折扣，qK是抵押价值，R是一周期偿付因子。此式表达机制，不复刻任何一篇论文的全部合同。' },
    boundary: '3.11解释可质押性与执行如何形成θ；3.15只追踪容量如何进入杠杆状态。详细保证金制度和动态haircut由7.12处理。',
    sourceIds: [16, 17, 19],
  },
  {
    number: 11, id: 'ltv-haircut', label: 'LTV, HAIRCUT & MAXIMUM LEVERAGE',
    title: '在最窄的单资产教学模型里，haircut下降会以倒数关系扩大最大杠杆；现实中这组等式极易失效。',
    paragraphs: [
      '若一项资产完全由一笔以该资产担保的债务与股权融资，没有其他资产负债、超额抵押、净额调整或表外敞口，那么LTV=B/(qK)，haircut h=1−LTV，也等于权益占资产比例，因此最大A/E等于1/h。haircut从20%降至10%不是把杠杆增加10%，而是把最大杠杆从5倍提高到10倍。',
      '真实repo、期货和衍生品还有initial margin、maintenance margin、variation margin、组合净额、潜在未来暴露和抵押品折扣；银行资本约束更不是简单haircut。这个倒数关系的用途是让初学者看见小额自有资金如何控制大头寸，而不是把所有机构都塞进同一公式。',
    ],
    formula: { label: '仅限单资产简式', expression: 'LTV = B/(qK); h = 1 − LTV = E/A; maximum A/E = 1/h', note: '只有在单一资产、单一完全担保债务和无其他资产负债的冻结假设下，四项才能连接。' },
    boundary: '保证金为何随波动与融资条件内生变化，以及多人同时补仓如何形成margin spiral，留给7.12；本节只登记它是可能触发器。',
    sourceIds: [17, 19],
  },
  {
    number: 12, id: 'cash-flow-capacity', label: 'CASH-FLOW CAPACITY',
    title: '很多企业债务的边际约束不是抵押品，而是经营现金流能否覆盖利息与本金。',
    paragraphs: [
      '现金流型贷款常用息税折旧及摊销前利润（EBITDA）倍数、利息覆盖率（interest coverage ratio, ICR）或债务偿付覆盖率（debt service coverage ratio, DSCR）限制借款。即使资产价格没有变化，销售下降、利润率压缩或营运资金占用也会减少容量；反过来，缺少实物抵押的企业仍可凭稳定可验证的现金流融资。把所有债务周期都画成“抵押品上涨—借款增加”，会漏掉企业信用中非常重要的一条路径。',
      '经验研究表明，美国非金融公司相当大部分债务在边际上与现金流而非实物抵押价值关联。这不是说抵押不重要，而是说明部门与合同决定主导状态变量：家庭按揭、证券融资和经营型企业贷款不能共享同一简化模型。研究时应先识别合同测试的是资产价值、现金流、资本还是流动性。',
    ],
    formula: { label: '三个不同覆盖问题', expression: 'B ≤ κ·EBITDA ; ICR = EBITDA/Interest ; DSCR = CFADS/(Interest + Principal due)', note: 'EBITDA倍数限制债务存量；ICR只覆盖利息；DSCR的分子是可用于债务偿付的现金流（cash flow available for debt service, CFADS），分母还包含声明窗口内到期本金。分子和分母必须属于同一期间。' },
    boundary: 'κ、ICR与DSCR阈值是合同条款，不是普适安全线。真实定义会调整租赁、一次性项目、资本开支和现金税，必须回到合同文本。',
    sourceIds: [7, 8, 53],
  },
  {
    number: 13, id: 'debt-service-burden', label: 'DEBT-SERVICE BURDEN',
    title: '债务存量不变时，利率、摊还和收入仍能共同改变每期可支配现金流。',
    paragraphs: [
      '债务/收入是存量相对期间收入的比率，DSR则估算一个期间内利息与本金偿付占收入的份额。相同D/Y可以因为利率更高、剩余期限更短或气球本金集中而产生更高DSR；相同DSR也可能由低债务高利率或高债务低利率组成。二者不能互换，更不能从其中任一项反推出实际违约。',
      '现金负担上升首先挤压消费、投资、分红或流动性缓冲，只有当主体无法再配置这些边际、不能融资或重组时才进入违约。宏观BIS DSR使用统一期限与利率近似来比较部门趋势，适合方向监测，却不是某一家公司的逐笔付款表。合同级研究仍需逐笔本金、利息和日期。',
    ],
    formula: { label: '偿债负担', expression: 'DSRₜ = (Interestₜ + Principal dueₜ) / Incomeₜ', note: '分子是声明窗口内现金承诺，分母是同一窗口收入。它不是债务存量/收入，也不是违约概率。' },
    boundary: '3.14已提供宏观DSR真实序列；3.15只用它解释债务结构如何把利率与期限变成现金流约束。',
    sourceIds: [7, 8],
  },
  {
    number: 14, id: 'rate-reset-service', label: 'RATE RESET CLOCK',
    title: '政策利率变化不会同时重定价全部债务；真正的传导速度藏在固定、浮动与到期再融资时钟里。',
    paragraphs: [
      '浮息债务会在下一个重置日把参考利率与信用利差变化带进利息支出；短期固定债务在到期续借时重定价；长期固定利率债务可以多年隔离市场利率变化。若主体同时使用利率互换，名义固定或浮动标签还不足以描述净现金流。于是“央行加息三个百分点”与“借款人利息立刻增加三个百分点”之间没有机械等号。',
      '上行周期中，短期或浮息融资可能因为初始票息低而提高当期可借能力，却把未来状态变化集中到重置窗；下行期价格冲击与利率重置若重合，权益和现金流两条约束会同时恶化。反之，长期固定利率和充分摊还可以延迟甚至切断即时反馈，使账面负资产不必马上变成现金危机。',
    ],
    boundary: '利率对银行贷款供给的入口由3.10、金融条件由3.13解释；本节只拥有既有债务vintage如何把利率变化映射到偿付日历。',
    sourceIds: [7, 8, 22],
  },
  {
    number: 15, id: 'maturity-refinancing', label: 'MATURITY & REFINANCING GAP',
    title: '债务总额一样，期限梯不同，就会形成完全不同的“今天必须找到多少现金”。',
    paragraphs: [
      '再融资缺口把目标窗口内到期本金、利息和其他用途，与合资格现金、非重叠经营现金流和真正已承诺的可用额度对账。正缺口表示主体必须在窗口内取得新融资、出售资产、补充股本或重组；它是压力状态，不等于已经违约。未承诺授信、未来可能出售的资产或同一笔现金的重复计入，都不能让缺口凭空消失。',
      '短债既可能带来信息更新和纪律，也会暴露于滚续协调。每个债权人若担心未来债权人退出，今天就可能拒绝续借；但理论还表明，简单延长合同并非在所有状态都改善激励。期限选择是信息、承诺、优先级与流动性之间的权衡，而不是“越长越安全”的单调规则。',
    ],
    formula: { label: '同窗资金缺口与盈余', expression: 'Gap = max(0, principal due + interest due + other uses − eligible cash − non-overlapping CF − committed available funding); Surplus = max(0, sources − uses)', note: '缺口与盈余分别截零，不能让负缺口承担双重含义。正缺口是需补资金，不是违约判决；到期桶必须互斥，承诺额度需乘以可用系数。' },
    boundary: '动态债务挤兑与债权人网络的第二跳留给7.16；本节只对第一个合同窗口和主体自身资源做账。',
    sourceIds: [10, 22, 23, 24, 25],
    after: <MaturityRefinancingLab />,
  },
  {
    number: 16, id: 'covenant-threshold', label: 'COVENANT THRESHOLD',
    title: '经济状态可以连续变化，合同权利却会在阈值处离散跳变。',
    paragraphs: [
      '收入每下降一元、LTV每上升一个百分点看似都是连续变化，但一旦越过契约阈值，贷款人可能获得加息、限制分红、要求追加抵押、停止提款或宣布违约的权利。系统因此表现出非线性：阈值之外的小冲击只改变缓冲，阈值附近的同样冲击却可能立刻改变可行动集合。',
      '“触发契约”仍不等于贷款人一定行使最严厉权利。豁免、修订、交叉违约、关系贷款和监管环境会影响后续路径。研究需要合同文本、测试日期和豁免记录，而不能只用季度末财务比率倒推当日行为；否则会把结果变量误写成触发原因。',
    ],
    boundary: '本节解释阈值如何把连续状态转为离散选择，不承担不同法域契约执行、破产程序或监管豁免的完整制度比较。',
    sourceIds: [22, 23, 25, 53],
  },
  {
    number: 17, id: 'credit-conditions-input', label: 'CREDIT CONDITIONS AS INPUT',
    title: '信用宽松进入3.15时不是一句“钱多了”，而是一组价格、数量与非价格条款的上游状态。',
    paragraphs: [
      '3.14已经解释了融资条件怎样经申请、批准、发放和提款形成信用流量。3.15接收的不是一个抽象繁荣标签，而是利率、利差、期限、首付、契约、额度、抵押折扣与可得性共同构成的融资菜单。不同组合会留下不同债务vintage：低票息长期固定债与低首付短期浮息债都能扩大当期融资，却把未来风险放在不同状态与日期。',
      '这一区分阻止我们把所有债务扩张都解释成借款人乐观或贷款人放松。融资需求可能因生产率提高，供给可能因资本充足，价格上涨也可能反过来提高抵押容量。观察到贷款与资产价格一起增长，只能确立共同运动；要分离方向，需要外生规则、资格阈值、预定暴露或其他支持反事实。',
    ],
    boundary: '本节直接保留3.14完整canonical对象与21条source-to-target映射，不重新复制3.10–3.13。信用供需识别仍由3.14拥有。',
    sourceIds: [16, 18, 35, 42],
  },
  {
    number: 18, id: 'risk-perception', label: 'MEASURED RISK & EXPECTATIONS',
    title: '稳定期会让测得风险下降；它可以放宽约束，却不必先假定所有参与者都非理性。',
    paragraphs: [
      '连续良好结果会机械降低近期违约率、波动率、VaR或模型损失估计；若风险限额、保证金或资本分配依赖这些指标，同一机构即使保持规则不变，也可能获得更大头寸空间。这个“内生容量”渠道在完全理性主体中也可存在，因为观测窗口和合同函数本身会随平静数据变化。',
      '诊断性预期、外推和Minsky式稳定感可以进一步强化：主体可能高估近期好消息的代表性，压低尾部风险价格并接受更薄缓冲。但低利差也可能来自真实风险下降、流动性溢价变化或政策担保。只有价格和后续回报的联合证据才能间接支持风险忽视，不能由“利差低”一句话直接诊断心理偏差。',
    ],
    boundary: '行为偏差只是增强器，不是杠杆循环成立的必要条件；完整预期与叙事机制留给Chapter 6。',
    sourceIds: [18, 20, 39, 43, 46],
  },
  {
    number: 19, id: 'contract-easing', label: 'CONTRACT EASING',
    title: '风险估计与竞争变化会先改写合同菜单，再由主体选择决定是否真的加杠杆。',
    paragraphs: [
      '在上行期，贷款人可能降低首付或haircut、提高EBITDA倍数、延长期限、减少担保、放宽契约，或以更低利差提供更大额度。这些变化提高债务容量并改变未来现金承诺的状态依赖。尤其值得警惕的是，初始付款更轻的合约可能把风险后移到浮息重置、气球本金或持续滚动。',
      '合同放宽不是无条件错误。信息改善、执行效率提高、现金流更稳定或风险分散都可以合理支持更好的条款。关键不是给每次放宽贴上“泡沫”标签，而是记录它是否降低了真正风险、还是只把当期可见风险转移到未来时钟和尾部状态。',
    ],
    boundary: '谁先改变贷款报价及其供需识别在3.10和3.14；本节只追踪已形成合同对杠杆、期限与触发器的后果。',
    sourceIds: [16, 17, 18, 22, 24],
  },
  {
    number: 20, id: 'leveraged-demand', label: 'LEVERAGED MARGINAL DEMAND',
    title: '容量只有在边际买家愿意并能够把新增借款转成购买时，才会进入资产价格。',
    paragraphs: [
      '降低haircut使每单位自有资金可控制更多资产，约束型或更乐观的买家因此能扩大出价。若他们处在定价边际，新增购买会推高价格；若市场由现金买家定价、借款人没有需求或资产供给高度弹性，容量扩张可能主要停留在未用额度，并不形成同样价格反馈。',
      '因此“可借上限增加”到“资产价格上涨”之间至少要经过申请、批准、提款、订单和成交五道门。不同主体的边际消费或投资用途也不同：企业借款可能扩大生产，家庭借款可能购买住房或消费，中介融资可能增加证券库存。只有明确谁用钱买什么，价格与实体传导才可解释。',
    ],
    boundary: '价格如何由订单形成属于Chapter 1；资产供给弹性与住房制度属于3.16。3.15只保留杠杆化购买力这个接口。',
    sourceIds: [16, 17, 18, 32],
  },
  {
    number: 21, id: 'price-collateral-feedback', label: 'PRICE–COLLATERAL FEEDBACK',
    title: '当同一资产既创造服务又充当抵押品，价格上涨会扩大借款上限，而新增购买又可能继续推高价格。',
    paragraphs: [
      '耐久资产兼具生产或使用价值与抵押价值时，价格变化不仅改变财富，还改变可以承诺给债权人的资源。价格上涨提高净值与借款上限，使受约束买家扩大需求，进一步支撑价格；反转时则相反。这个正反馈解释了小冲击为何可能持续，但强度取决于抵押约束是否真正绑定以及边际买家是否受约束。',
      'Kiyotaki–Moore与Geanakoplos提供不同的理论发动机，不能混成同一模型。前者强调耐久资产、借款上限与生产配置，基本模型并非现代内生haircut周期；后者把异质信念与抵押要求放在均衡核心。二者都提供可能机制，却不直接告诉我们某一市场的真实参数或危机时点。',
    ],
    boundary: '3.15到“购买可能影响价格、价格又影响容量”为止；市场深度、战略清算和火售价格冲击函数由7.13完整展开。',
    sourceIds: [16, 17, 27],
  },
  {
    number: 22, id: 'net-worth-premium', label: 'NET WORTH & EXTERNAL FINANCE PREMIUM',
    title: '净值不仅吸收损失，也影响外部融资的代理成本，因此价格变化会反馈到下一轮融资价格。',
    paragraphs: [
      '当借款人自有净值较厚时，其自身承担更多下行，债权人与借款人的激励更一致，监督和验证成本相对较低；净值下降后，外部融资相对内部资金的溢价可能上升。于是同一个基本面冲击会先损害净值，再提高融资成本、压低投资与资产需求，形成金融加速器。',
      '这条关系是状态依赖而非固定乘数。拥有未抵押资产、长期关系银行、政府担保或可发行股权的主体可能不受同样影响；代理模型里的“外部融资溢价”也不是现实中某一条贷款利差的同义词。研究需要把理论楔子映射到可观察报价、获批率、担保和实际融资。',
    ],
    formula: { label: '教学化单调关系', expression: 'EFPₜ = φ(Nₜ/Aₜ), with φ′ < 0', note: '净值占资产比例下降时，外部融资溢价可能上升。该式只表达方向，不复制BGG模型全部合同或参数。' },
    boundary: '3.11详细建立借款人净值与抵押通道；本节把它作为债务周期的反馈连接器，不重复估计融资溢价。',
    sourceIds: [20, 21, 42],
  },
  {
    number: 23, id: 'passive-leverage', label: 'PASSIVE LEVERAGE',
    title: '价格上涨可能机械降低杠杆，价格下跌可能机械提高杠杆；这与主体主动选择相反也不矛盾。',
    paragraphs: [
      '债务与其他负债在短窗口内固定时，资产上涨会增加权益，使A/E与D/E下降；资产下跌则压缩权益，使比率上升。这是被动杠杆路径。它解释了为什么观察到家庭在房价上涨时杠杆率下降，并不能推断家庭没有增加借款：资产分母和权益分母也在同时变化。',
      '同理，危机中杠杆率下降也不自动表示成功还债。主体可能出售资产、被减记债务、发行股权，或高杠杆机构退出样本；若资产跌得快于债务，A/E甚至可能先上升后因破产消失。研究至少要同时观察A、D、E、融资与偿还流量、核销和样本进入退出。',
    ],
    formula: { label: '被动冲击后的杠杆', expression: 'λₜ₊₁ = λₜ(1−x)/(1−λₜx)', note: 'x为资产损失比例，债务与其他负债冻结；当1−λx接近零，权益接近耗尽，正常倍数解释应停止。' },
    boundary: '被动路径是会计状态，不是目标或交易行为。下一节再加入合成目标杠杆规则。',
    sourceIds: [18, 20, 21],
  },
  {
    number: 24, id: 'target-leverage', label: 'TARGET LEVERAGE & REBALANCING',
    title: '只有部分主体会主动恢复目标杠杆；规则输出的是拟议交易，仍不是实际成交。',
    paragraphs: [
      '若按市值中介希望维持目标A/E，资产升值提高权益后，它会借款并继续买入以恢复倍数；价格下跌压缩权益后，它会提出缩表。Adrian与Shin在危机前美国券商数据中发现这种顺周期资产负债表行为较明显，但家庭更接近被动持有，商业银行也并非同一弹性。不能把券商经验当作所有主体的行为定律。',
      '从目标到实际至少还隔着风险委员会、资本和流动性约束、融资报价、资产市场深度与成交价格。若机构容忍暂时偏离、能发行股权、获得政策融资或卖出会冲击价格，实际调整会与无摩擦提案不同。因此canonical明确保存capacityIsTarget=false、targetIsActual=false与actualAdjustment=null。',
    ],
    formula: { label: '固定目标规则的拟议交易', expression: 'A* = λ̄E ; proposed trade = A* − A_after', note: '正值表示规则拟买入，负值表示拟卖出。假设交易以债务一比一融资或偿还且不影响价格；结果只能叫proposal。' },
    boundary: '融资与市场流动性的双向反馈属于7.11，杠杆／保证金规则属于7.12，实际火售价格冲击属于7.13。本节只输出第一轮、无价格冲击的账本提案。',
    sourceIds: [18, 19, 20, 21],
    after: <TargetRebalancingLab />,
  },
  {
    number: 25, id: 'fragility-vector', label: 'FRAGILITY IS A VECTOR',
    title: '真正决定冲击反应的不是单一杠杆率，而是水平、期限、利率、币种、抵押、缓冲与分布组成的状态向量。',
    paragraphs: [
      '两个主体都可能有D/收入四倍，但一个持有长期本币固定利率债、充足现金与未抵押资产，另一个依赖三个月外币滚动融资且收入以本币计价。平均债务水平相同，利率、汇率和续借冲击下的现金流完全不同。类似地，gross exposure高的对冲基金若方向高度对冲，与同等净多头风险不能用一个名义额比较。',
      '最小诊断至少要登记A/E、LTV、D/收入、DSR、短债份额、浮息份额、到期集中、未抵押抵押品与可用流动性；还应标记法律实体、币种、估值与时间。缺失变量必须写成not collected，而不是零。向量并不意味着所有因素同等重要，而是让研究者先识别哪个约束在当前状态附近可能绑定。',
    ],
    formula: { label: '最小脆弱性向量', expression: 'Vₜ = (A/E, LTV, D/Income, DSR, Short debt/D, Floating debt/D, maturity concentration, liquid buffer)', note: '向量只是状态登记，不是加权得分、危机概率或交易信号。权重必须通过另一个预注册研究问题确定。' },
    boundary: '本课不把向量合成“杠杆周期指数”。任何预测器都须在7.24–7.26声明标签、期限、PIT数据和OOS评估。',
    sourceIds: [1, 5, 6, 7, 10],
  },
  {
    number: 26, id: 'minsky-postures', label: 'OPTIONAL · CASH-FLOW POSTURES',
    title: 'Minsky的hedge、speculative与Ponzi描述的是现金流姿态，不是道德标签或固定危机三阶段。',
    paragraphs: [
      '在统一期间内，经营现金流若覆盖利息与到期本金，可近似称为hedge finance；能覆盖利息但不能覆盖本金，意味着需要滚续或出售资产，可称为speculative finance；连利息都无法覆盖，则依赖新增融资、资产升值或出售来维持，可称为Ponzi finance。这里的speculative不是证券投机，Ponzi也不等同诈骗式庞氏骗局。',
      '这套分类有助于把“稳定期积累不稳定”变成可问的数据问题：经营现金流、利息、本金到期和新融资依赖如何变化。但它对窗口与会计定义高度敏感，也没有给出确定的阶段时钟。一个主体可能因季节性现金流暂时跨类，经济体系也不会整齐地同步迁移。',
    ],
    formula: { label: '教学化现金流分类', expression: 'hedge: CF ≥ I+P ; speculative: I ≤ CF < I+P ; Ponzi posture: CF < I', note: 'I与P必须是同一窗口的利息和到期本金。这是近似操作化，不是官方分类或欺诈判断。' },
    boundary: 'Minsky提供组织问题的框架，不提供已识别的普适阶段定律或精确危机倒计时。',
    sourceIds: [15, 46],
  },
  {
    number: 27, id: 'trigger-vulnerability', label: 'OPTIONAL · TRIGGER ≠ VULNERABILITY',
    title: '危机触发器是新信息或约束变化；脆弱性是冲击到来前已经存在的放大结构。',
    paragraphs: [
      '价格下跌、收入下降、利率上升、汇率贬值、haircut提高或续借拒绝都可能成为触发器；高债务、薄权益、短期限、浮息与集中暴露则是预存脆弱性。一次大冲击遇到厚缓冲可能被吸收，一次小冲击遇到临界契约和共同持仓则可能造成剧烈反应。把两者分开，才能避免用事后坏消息解释事前积累。',
      '这也说明低波动并不自动等于安全。稳定期既可能真实降低基本风险，也可能通过风险度量、条款和目标行为让主体扩大头寸；反转时看似“突然”的危机，往往是触发器与多年积累状态相遇。可是没有约束接近生效、没有强制行为或有深口袋买家时，脆弱性仍未必闭合为系统循环。',
    ],
    boundary: '本课不把某个触发器倒因为全部繁荣，也不从脆弱性向量推出日期。事件研究和结构识别需另建反事实。',
    sourceIds: [20, 35, 38, 40, 41, 46],
  },
  {
    number: 28, id: 'debt-overhang', label: 'OPTIONAL · DEBT OVERHANG',
    title: '旧债可能吸收新项目价值，使企业总价值增加、现有股东却仍不愿投资。',
    paragraphs: [
      '当旧债面临潜在损失时，一个正总NPV项目增加的现金流可能先提高债权人回收。若项目必须由现有股东出资，股东承担全部成本却只能获得剩余增量，自己的NPV可能为负，于是拒绝对整个企业有价值的投资。这就是债务积压：不是项目不好，而是既有索取权改变了新增价值的分配。',
      '债务积压不是所有高杠杆企业投资下降的万能解释。需求走弱、生产率下降、银行供给收缩或管理问题都可能同时发生；债务可以重谈、政府可补贴、新融资可取得不同优先级。实证必须分离这些替代机制，并明确支持样本与制度。',
    ],
    formula: { label: '两套NPV必须分栏', expression: 'Total NPV = ΔA_T − cost ; Equity NPV = Δmax(A_T−F,0) − equity-funded cost', note: '旧债面值F可能截留部分ΔA。企业总价值判断与现有股东激励判断不能合成一个数字。' },
    boundary: '本实验冻结旧债不可重谈、由现有股东出资、无新索取权与确定终值；改变任一条件都须重新计算。',
    sourceIds: [12, 14, 26, 51],
    after: <DebtOverhangLab />,
  },
  {
    number: 29, id: 'deleveraging-paths', label: 'OPTIONAL · REPAIR PATHS',
    title: '去杠杆不是一个动作：还债、缩表、补股本、留存收益与债务减记会改变不同分子和分母。',
    paragraphs: [
      '卖资产并偿债同时减少A与D，可能把头寸供应压向市场；增发股本并保留现金增加A与E，取决于新股东是否愿意供资；留存收益也增加E，却需要盈利与时间，可能以削减分红或支出为代价；债务减记降低D并提高借款人E，但损失转移给债权人，不是现金偿还。',
      '四条路径可以到达同一A/E，却不代表同一福利或宏观后果。卖出是否压价取决于市场深度，发股是否可行取决于信息与控制权，减记是否恢复经营取决于重组制度，留存收益是否拖累需求取决于谁减少支出。只看期末杠杆率会把整个调整过程和损失承担者抹去。',
    ],
    boundary: '本节对第一轮资产负债表做无价格冲击对账；卖出如何影响价格由7.13，债权人损失的第二跳由7.16处理。',
    sourceIds: [26, 27, 28, 29, 30, 31, 50],
    after: <DeleveragingPathsLab />,
  },
  {
    number: 30, id: 'aggregate-demand-feedback', label: 'OPTIONAL · AGGREGATE DEMAND & DEBT DEFLATION',
    title: '每个债务人单独修复资产负债表可能很稳健；很多人同时减支时，合计结果却可能让所有人更难去杠杆。',
    paragraphs: [
      '受约束借款人为了还债减少消费或投资，若未受约束者没有等量增加支出、利率又不能充分下降，总需求与收入会走弱。收入下降提高D/收入与DSR，资产价格下降再压缩净值，于是最初的个体修复产生新的系统输入。这是合成谬误：微观上合理的储蓄和偿债，在共同状态下可能加深衰退。',
      'Fisher的债务通缩还要求名义债务相对黏、价格水平意外下降并触发被迫清算，使实际债务负担上升。历史上通缩与萧条并没有无条件稳定关系，因此不能写成“只要通缩就危机”。政策转移、债务减记、深口袋买家或价格与工资调整都可能切断反馈。',
    ],
    formula: { label: '条件性闭环', expression: 'deleveraging → spending↓ → income / prices↓ → leverage & debt burden↑ → further deleveraging', note: '每个箭头都需要行为反应和市场清算条件。没有总体抵消或政策吸收，是反馈成立的重要条件。' },
    boundary: '3.15建立从主体修复到总需求的接口，不估计财政乘数、自然利率或一般均衡规模；这些需要专门模型与识别。',
    sourceIds: [28, 29, 30, 31, 33, 34, 52],
  },
  {
    number: 31, id: 'distribution-tail', label: 'OPTIONAL · DISTRIBUTION & TAIL',
    title: '谁持有债务、谁接近到期墙、谁会大幅减支，比部门平均杠杆本身更接近系统反应。',
    paragraphs: [
      '平均D/收入可能稳定，但债务若越来越集中于薄缓冲、高边际消费倾向家庭、短债企业或受保证金约束中介，冲击后的行为弹性会提高。人口加权个体比率平均与“总债务/总收入”本来就不是同一统计量；再加上资产和收入分布，两种平均都可能看不见最容易触发现金缺口的尾部。',
      '聚合反馈还取决于另一侧：如果非约束买家拥有充足资本、贷款人能吸收展期、政策资产负债表接住被迫出售，个体压力可能不传成价格螺旋。缺少尾部数据不能写成尾部为零，缺少深口袋买家数据也不能断言无人承接。最稳妥的状态输出是明确缺失与条件，而不是补一个合成危机分数。',
    ],
    formula: { label: '两个常被混淆的平均', expression: 'average of ratios = Σwᵢ(Dᵢ/Yᵢ) ; ratio of sums = ΣwᵢDᵢ / ΣwᵢYᵢ', note: '除非各组收入相同或满足特殊条件，两者通常不等。任何一个都不能替代到期集中与尾部权重。' },
    boundary: '本实验用SYNTHETIC阈值展示尾部概念，绝不把阈值组权重称为真实违约率或危机概率。',
    sourceIds: [33, 35, 36, 37, 38, 40, 48, 51],
    after: <DistributionTailLab />,
  },
] as const;

const corePathSectionIds = new Set(conceptSections.slice(0, 24).map(({ id }) => id));

function DebtLeverageConceptSection({ section }: { section: ConceptSection }) {
  const [firstParagraph, ...remainingParagraphs] = section.paragraphs;
  return <section className="lesson-section" id={section.id}>
    <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label} · {corePathSectionIds.has(section.id) ? 'CORE PATH' : 'OPTIONAL DEEP DIVE'}</p>
    <h2>{section.title}</h2>
    {firstParagraph ? <p>{firstParagraph}</p> : null}
    {section.formula ? <div className="equation-card"><span>{section.formula.label}</span><div><code>{section.formula.expression}</code></div><p>{section.formula.note}</p></div> : null}
    {remainingParagraphs.map((paragraph, index) => <p key={`${section.id}:${index + 1}`}>{paragraph}</p>)}
    <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div>
    {section.after}
    <p className="section-sources"><b>本节依据：</b> <Cites ns={section.sourceIds} /></p>
  </section>;
}

const entryVocabulary = [
  ['Debt contract', '带有本金、币种、利率、期限、优先级、抵押与偿付时钟的承诺；不是一个无结构总量。'],
  ['Leverage', '用资产、权益、收入、资本或基金资产净值（net asset value, NAV）等分母刻画头寸规模；口径不同，问题不同。'],
  ['Equity buffer', '资产扣除全部负债后的剩余索取权，也是资产损失首先侵蚀的缓冲。'],
  ['Passive leverage', '债务不变、资产价格改变权益分母后出现的杠杆变化；尚未包含交易行为。'],
  ['Target leverage', '主体希望维持的行为规则或政策目标；不等于容量、选择或实际成交。'],
  ['Gross / net debt', '本课目标日合资格净债务按已注册政策，只扣同实体、同币种、未受限且及时可用的现金；它不是通用净债务定义。'],
  ['经营利润与偿债现金流', '息税折旧及摊销前利润（earnings before interest, taxes, depreciation and amortization, EBITDA）是经营指标；可用于债务偿付的现金流（cash flow available for debt service, CFADS）是合同定义的现金流。二者都不自动等于自由现金流。'],
  ['债务偿付率', '债务偿付率（debt service ratio, DSR）是声明窗口内利息与到期本金相对同窗收入的现金负担；不是债务/收入。'],
  ['可支配收入与年率化', '可支配个人收入（disposable personal income, DPI）是收入流量；经季节调整的年率（seasonally adjusted annual rate, SAAR）把该流量换算为年率。它们不是期末存量。'],
  ['Maturity wall', '大量互斥本金桶在相近窗口到期形成的再融资暴露；不是违约本身。'],
  ['Debt overhang', '旧债吸收新项目价值，使总净现值（net present value, NPV）为正但现有股东NPV为负的激励扭曲。'],
  ['Deleveraging', '通过减少债务/资产或增加权益/收入降低比率；不同路径的损失与外溢不同。'],
  ['Trigger', '让价格、现金流、利率或融资条件发生变化的新事件；与预存脆弱性不同。'],
  ['历史实时版本', '严格历史时点（point in time, PIT）版本只含当时真实可得的数据；当前完整历史曲线不能倒灌为严格PIT证据。'],
] as const;

const checks = [
  { question: '债务80是否足以判断杠杆高低？', answer: '不足。至少还要知道分母、全部负债、法律实体、币种、估值与时钟；同一债务面对资产、权益和收入回答不同问题。', sourceIds: [1, 5, 6] },
  { question: '为什么权益不总是A−D？', answer: '因为D通常只指有息债务，总资产还要覆盖其他负债；只有明确冻结其他负债为零时，A−D才等于权益。', sourceIds: [3, 6, 9] },
  { question: '十倍A/E遇到4%资产损失，为什么权益损失约40%？', answer: '债务短期固定时，4单位资产损失全部由10单位权益吸收，权益降为6；这是会计放大，不需要恐慌假设。', sourceIds: [18, 20] },
  { question: '被动杠杆上升是否证明主体主动加了债？', answer: '不证明。资产价格下跌压缩权益即可让A/E与D/E上升；必须另观察借款、偿还和交易流量。', sourceIds: [18, 20] },
  { question: '目标杠杆规则算出卖36，是否等于实际卖36？', answer: '不等于。它只是无价格冲击、债务一比一变化的提案；治理、融资、市场深度、成交价和替代修复路径尚未进入。', sourceIds: [18, 19, 21] },
  { question: '为什么集团有31单位现金，本题却只准扣5？', answer: '因为本课预注册的目标日合资格政策只允许扣除同实体、同币种、未受限且及时可用的现金；其余26未过门。这不是所有实务net debt的唯一规则。', sourceIds: [5, 6, 10] },
  { question: '资产大于负债为何仍可能违约？', answer: '长期资产未必能在今天变成指定币种现金；流动性问付款时点，偿付能力问最终价值，两者会互动但不是同一状态。', sourceIds: [22, 23] },
  { question: 'D/收入与DSR为什么不能互换？', answer: '前者用债务存量除收入流量，后者用同窗利息加到期本金除同窗收入；利率与期限会让二者分叉。', sourceIds: [7, 8] },
  { question: '再融资缺口为11是否表示已违约11？', answer: '不是。本例总用途显式冻结为本金30、利息0、其他用途0；可靠来源19，故Gap=max(0,30−19)=11且Surplus=0。它仍可通过新融资、卖资产、补股本或重组填补。', sourceIds: [22, 23, 25] },
  { question: '短债是否总比长债危险？', answer: '不是。短债可能改善信息更新和纪律；其风险来自滚续、协调与优先退出。理论甚至不支持在所有状态下机械延长都更安全。', sourceIds: [22, 23, 24] },
  { question: '正总NPV项目为何会被拒绝？', answer: '若旧债先吸收新增价值，而现有股东支付全部成本，股东增量NPV可以为负；这就是冻结假设下的债务积压。', sourceIds: [12, 14] },
  { question: '降低A/E只有卖资产一条路吗？', answer: '不是。还可补股本、积累留存收益、偿还或减记债务；期末比率可能相同，但损失承担和实体影响不同。', sourceIds: [26, 29, 31] },
  { question: '债务减记为什么不是现金偿还？', answer: '减记在没有现金流出的情况下减少债权人索取权、提高借款人权益；损失被转移给债权人，不能写成借款人支付。', sourceIds: [26, 28, 50] },
  { question: '为什么小触发器也可能造成大反应？', answer: '若薄权益、短期到期和契约阈值已接近生效，小冲击会改变可行动集合；脆弱性在先，触发器只是让它显现。', sourceIds: [20, 41, 46] },
  { question: '平均D/收入稳定是否说明尾部稳定？', answer: '不说明。债务可在高反应主体间重分配；人口加权比率平均与总债务/总收入不同，两者都可能掩盖到期集中。', sourceIds: [33, 35, 48] },
  { question: '2026看到的2008杠杆值能否直接用于2008年实时回测？', answer: '不能。经纪商图来自May 2026出版物快照，家庭表来自2026Q2 current-vintage；二者都不是逐历史时点冻结的发布序列。严格PIT必须按每个决策时点锁定当时版本。', sourceIds: [2, 4, 45, 47] },
  { question: '观察到贷款和资产价格同时上涨能否证明信贷推动价格？', answer: '不能。生产率、共同预期或价格先提高抵押容量都可造成共动；需要外生供给变化、资格阈值或预定暴露构造反事实。', sourceIds: [16, 32, 35] },
  { question: '杠杆何时会从个体损失变成系统循环？', answer: '需要高预存承诺、约束接近生效、难以补股本、被迫行为影响价格或总需求、且非约束买家与政策吸收不足；缺一环反馈都可能变弱。', sourceIds: [19, 20, 27, 29, 31] },
] as const;

const glossary = [
  ['Assets / A', '同一实体在声明时点拥有或控制的经济资源', '抵押品市值或gross exposure', '02–05'],
  ['Debt / D', '需要按合同偿还的有息债务存量', '全部负债或当期新增信贷', '02–05'],
  ['Other liabilities', '不在注册有息债务分子中但仍优先于权益的负债', '可忽略项', '04–05'],
  ['Equity / E', '资产扣除全部负债后的剩余索取权', '现金或监管资本的完整同义词', '04–07'],
  ['A/E', '总资产相对权益的损失放大倍数', 'Basel资本/暴露率', '05–06'],
  ['D/E', '有息债务相对权益的倍数', 'A/E；两者相差其他负债结构', '05'],
  ['D/A', '有息债务占总资产比例', 'LTV或资本率', '05'],
  ['D/Income', '债务存量相对声明收入窗口的倍数', 'DSR', '05、13'],
  ['Course-policy eligible net debt', '本课按政策ID在目标日扣除合资格现金后的债务', '普适net debt定义或债务减所有集团现金', '09'],
  ['EBITDA', '利息税折旧摊销前经营指标', '可自由偿债现金流', '12'],
  ['ICR', '经营指标对利息的覆盖倍数', '包含本金的DSCR', '12'],
  ['DSCR', '可用于偿债现金流对利息加到期本金的覆盖', '宏观DSR的逐笔同义词', '12–13'],
  ['DSR', '偿债支出占同窗收入的比率或估算', '债务/收入', '13'],
  ['NAV', '基金资产扣除负债后的净资产值', '无条件等同企业账面权益', '05'],
  ['Gross exposure', '未净掉方向的表内外名义或调整后敞口', '净市场风险', '05'],
  ['LTV', '债务相对特定抵押品价值', '全资产负债表D/A', '10–11'],
  ['Haircut', '抵押品市值中不能支持借款的折扣部分', '所有保证金制度的完整描述', '11'],
  ['Advance rate', '合资格抵押品价值可支持借款的比例', '实际提款率', '10–11'],
  ['Borrowing capacity', '合同与约束允许的上限', '目标、选择或实际借款', '10'],
  ['Target leverage', '主体希望维持的杠杆规则', '已观察参数或容量上限', '24'],
  ['Passive leverage', '仅由价格和分母变化产生的比率路径', '主动扩表或缩表', '23'],
  ['Active adjustment', '经过决策和执行后的真实资产负债表交易', '模型提案', '24'],
  ['Maturity bucket', '在互斥时间窗内到期的本金分组', '可重复计数的标签', '15'],
  ['Balloon payment', '到期集中支付的大额本金', '额外叠加同一笔计划摊还', '15'],
  ['Refinancing gap', '同窗合同用途超过可靠内部与承诺来源的差额', '已实现违约损失', '15'],
  ['Rate reset', '合同利率按约定日期重新确定', '政策利率公布日', '14'],
  ['Floating-rate share', '在相关窗口会随参考利率重定价的债务份额', '全部短债', '14、25'],
  ['Currency mismatch', '债务现金流币种与可用收入或对冲后现金流不匹配', '外币名义债务本身', '25'],
  ['Covenant', '触发特定债权人权利的合同测试', '自动破产判决', '16'],
  ['First-loss buffer', '资产损失首先侵蚀的权益缓冲', '债权人永不受损', '06'],
  ['Debt overhang', '旧债截留新投资价值形成的股东投资激励不足', '所有高债务后的低投资', '28'],
  ['Risk shifting', '债务存在时股东可能偏好更高波动资产的激励', '实际风险必然上升', '07'],
  ['Leverage ratchet', '既有债务可能让股东抵制主动补股本去杠杆', '无法通过任何制度缓解', '28–29'],
  ['Hedge finance', '现金流覆盖利息与到期本金的Minsky姿态', '有衍生品套期保值', '26'],
  ['Speculative finance', '现金流覆盖利息但依赖滚续本金的姿态', '证券投机', '26'],
  ['Ponzi finance posture', '现金流连利息也无法覆盖、依赖融资或升值的姿态', '诈骗法律标签', '26'],
  ['Trigger', '使价格、收入、利率或融资状态改变的新事件', '预存脆弱性', '27'],
  ['Vulnerability', '使冲击被放大或迫使行为改变的预存结构', '危机日期预测', '25、27'],
  ['Fire sale', '受约束出售与有限买家共同造成的价格外部性', '任何亏损卖出', '29'],
  ['Debt deflation', '名义债务黏性与意外价格下降相互强化的条件机制', '任何通缩', '30'],
  ['Fallacy of composition', '个体合理修复在合计层面压低收入并反噬修复', '个体行为一定错误', '30'],
  ['Ratio of sums', '加权总债务除以加权总收入', '个体比率的加权平均', '31'],
  ['Tail weight', '落在预注册脆弱条件中的主体或暴露权重', '违约概率', '31'],
  ['Current vintage', '取数日可见的完整历史版本', '历史每时点当时可见版本', '01、35'],
  ['PIT', '严格锁定决策时点已发布信息的版本体系', '把今天历史表截断', '35'],
  ['Prediction', '预注册标签和期限上的样本外条件判断', '描述或因果', '35'],
  ['Causal effect', '相对可信反事实下的处理效应', '相关性或理论方向', '35'],
] as const;

const contractInvariants = [
  '先冻结主体、法律实体、合并口径、币种、估值基础和as-of，再计算任何比率。',
  '资产负债表必须以A=D+其他负债+E闭合；有息债务不得冒充全部负债。',
  '每个杠杆率登记分子、分母、单位与时钟；分母非正时输出STOP。',
  '存量、期间流量、重估、汇率变化、核销与重分类保持不同身份。',
  '被动价格冲击不得暗改债务；价格造成的分母变化先于任何行为假设。',
  'capacity、target、chosen leverage、proposed trade与actual adjustment五栏不得互相提升。',
  '本课目标日合资格净债务只按已注册政策扣同实体、同币种、未受限且及时可用的现金；不得冒充唯一通用定义。',
  '外币名义债务与对冲名义额不能直接相减为净现金流暴露。',
  '到期桶必须互斥且不能与目标窗部分重叠；同窗利息必须显式登记（即使为零），气球本金与其他摊还不得对同一本金重复计数，无法原子分配时STOP。',
  '未承诺融资不按面值进入可靠来源；正再融资缺口不等于已经违约。',
  '债务积压必须分别展示企业总NPV、债权人增量价值与股东NPV，并冻结优先级假设。',
  '去杠杆路径逐条闭合sources/uses；债务减记不得称作现金偿还。',
  '平均比率、总量比率、到期集中与尾部权重分别保存；缺失尾部不写成零。',
  '官方数据与SYNTHETIC算术永久隔离；current-vintage历史不冒充PIT。',
  'measurement、prediction、causality三轴分开；没有模型和OOS评估就没有危机概率。',
  '3.15只到第一轮债权损失和资产出售接口；融资—市场流动性、margin、fire sale与网络第二跳分别路由7.11、7.12、7.13与7.16。',
] as const;

const interfaces = [
  { name: '3.14 Credit Cycle', payload: '完整信用存量—流量、融资菜单、借款人与中介反馈canonical。', guardrail: '3.15只把它作为唯一直接上游上下文；聚合借款部门状态不会数值校准单一法律实体的SYNTHETIC账本。' },
  { name: '3.16 Housing–Collateral Feedback', payload: '家庭负债、按揭、LTV、住房供给、追索权、法拍与消费响应。', guardrail: '家庭与非营利组织负债/DPI不是平均家庭DTI、DSR或LTV。' },
  { name: '3.09 Financial Intermediaries', payload: '银行、券商、保险和基金的业务模式、监管资本与流动性约束。', guardrail: '经纪商A/E序列不能代表银行、家庭或对冲基金。' },
  { name: '7.11 Market Liquidity × Funding Liquidity Spiral', payload: '融资能力、市场流动性及其双向强化。', guardrail: '本节只登记可靠资金来源，不估计融资收紧如何改变市场深度。' },
  { name: '7.12 Leverage Cycle 与 Margin Spiral', payload: 'haircut、initial/maintenance/variation margin与目标杠杆调整。', guardrail: '本节只把margin变化登记为触发器，不估计其反应函数。' },
  { name: '7.13 Fire Sale、Crowded Unwind 与 Contagion', payload: '被迫出售、市场深度、有限买家、价格冲击与清算外部性。', guardrail: '本节的无冲击出售量只是第一轮提案，不是价格路径。' },
  { name: '7.16 Financial Networks 与 Contagion Channels', payload: '双边债权、优先级、共同持仓、回收与多跳传染。', guardrail: '3.15只到借款人减记把损失转给直接债权人为止。' },
  { name: '7.24–7.26 Research Pipeline', payload: '标签、期限、PIT vintage、变换、阈值、支持集、OOS和因果审计。', guardrail: '描述性杠杆状态不得成为回测结果或因果冲击。' },
  { name: '5.17 China Property Regime', payload: '土地财政、预售、开发商、地方融资与银行信用链。', guardrail: '通用债务公式不能替代中国制度、法律实体和现金监管账户。' },
] as const;

const dynamicRefreshChecklist = [
  {
    source: 'Federal Reserve FSR Figure 3.7 · broker-dealer leverage',
    refresh: '当前整页只保留一次响应特定哈希，动态edge token使其不能充当稳定源指纹；刷新时必须另存响应原件与元数据，并以Figure 3.7稳定提取行的规范化哈希生成逐行diff。',
    use: '只用于May 2026出版物中经纪商资产/权益的部门尺度与口径示范，不进入合成canonical，也不是逐期PIT版本。',
    sourceUrl: brokerDealerLeverageDataPassport.sourceUrl,
    sourceIds: [1, 2, 3, 4],
  },
  {
    source: 'Federal Reserve Z.1 · households and nonprofit organizations',
    refresh: '当前URL是会随新release变化的latest端点，本仓库未保留2026-09-14所取ZIP原件，既有哈希不能令该URL按哈希重取。后续新release须先进入quarantine；验证系列键、单位、恒等式、首末季度、历史修订和新季度，并实际保存新旧包后才可称作冻结归档。',
    use: '只用于负债构成和分子/分母修复的current-vintage定向，不是微观DTI或PIT回测。',
    sourceUrl: householdDebtDataPassport.sourceUrl,
    sourceIds: [47],
  },
] as const;

const evidenceGroups = [
  { title: '官方测量、监管口径与数据时钟', text: '美联储、FSB、Basel、BIS和IMF定义部门杠杆、监管暴露、偿债率、存量流量、币种期限以及家庭部门对照。', ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 47] },
  { title: '资本结构、合同、期限与激励', text: '无摩擦基准、债务积压、风险转移、Minsky姿态、期限选择、动态滚续、期限竞赛、到期墙、杠杆棘轮与现金流型约束。', ids: [11, 12, 13, 14, 15, 22, 23, 24, 25, 26, 27, 53] },
  { title: '抵押、中介、去杠杆与总需求模型', text: '抵押反馈、杠杆循环、中介目标与净值、融资流动性、清算价值、债务通缩、预防储蓄、需求外部性、金融加速器和诊断预期。', ids: [16, 17, 18, 19, 20, 21, 28, 29, 30, 31, 42, 43, 52] },
  { title: '家庭、外币与重组的微观证据', text: '美国住房净值、消费与县级衰退证据，跨国家庭债务、匈牙利外币重估、日本僵尸贷款及企业债务反例。', ids: [32, 33, 34, 48, 49, 50, 51] },
  { title: '长期历史、条件预警与危机顺序', text: '信用繁荣、衰退强度、有杠杆泡沫、联合条件风险、风险忽视、无恐慌危机、离散转折、credit gap实时边界与危机前后顺序。', ids: [35, 36, 37, 38, 39, 40, 41, 44, 45, 46] },
] as const;

const directCitationRegistry = {
  thesis: [9, 15, 18, 20, 28, 29, 35, 46],
  officialIntroduction: debtLeverageTransmissionSourceIds,
  mechanismLabs: debtLeverageMechanismLabSourceIds,
  cases: [47, 48, 49, 50, 51],
} as const;

const allReferenceIds = new Set(lesson315References.map(({ id }) => id));
const conceptIds = new Set(conceptSections.map(({ id }) => id));
const scenarioAnchorIds = new Set(['official-data', 'evidence-boundaries', ...conceptIds]);
const pageSectionIds = ['thesis', 'official-data', ...conceptSections.map(({ id }) => id), 'interactive-lab', 'debt-leverage-static-twins', 'checks-glossary', 'evidence-boundaries'];
const renderedSourceIds = new Set([
  ...Object.values(directCitationRegistry).flat(),
  ...conceptSections.flatMap(({ sourceIds }) => sourceIds),
  ...checks.flatMap(({ sourceIds }) => sourceIds),
  ...debtLeverageScenarios.flatMap(({ sourceIds, staticTwin }) => [...sourceIds, ...staticTwin.sourceIds]),
  ...dynamicRefreshChecklist.flatMap(({ sourceIds }) => sourceIds),
  ...evidenceGroups.flatMap(({ ids }) => ids),
]);
const evidenceMapSourceIds = new Set<number>(evidenceGroups.flatMap(({ ids }) => ids));
const citationIdsResolve = (ids: Iterable<number>) => [...ids].every((id) => allReferenceIds.has(id));
const labSectionIds = conceptSections.filter(({ after }) => Boolean(after)).map(({ id }) => id);

export const lesson315IntegrityAudit = [
  { key: '30 concepts numbered 02–31', passed: conceptSections.length === 30 && conceptSections.every(({ number }, index) => number === index + 2) },
  { key: '24 core plus 6 optional mechanisms', passed: corePathSectionIds.size === 24 && conceptSections.filter(({ id }) => !corePathSectionIds.has(id)).length === 6 },
  { key: 'all page section IDs are globally unique', passed: new Set(pageSectionIds).size === pageSectionIds.length },
  { key: 'every concept has two substantive paragraphs sources and a boundary', passed: conceptSections.every(({ paragraphs, sourceIds, boundary }) => paragraphs.length >= 2 && paragraphs.every((paragraph) => paragraph.length >= 70) && paragraphs.reduce((total, paragraph) => total + paragraph.length, 0) >= 190 && sourceIds.length > 0 && boundary.length >= 30) },
  { key: 'seven mechanism labs appear at registered concepts', passed: labSectionIds.join('|') === ['leverage-measure-registry', 'gross-net-debt', 'maturity-refinancing', 'target-leverage', 'debt-overhang', 'deleveraging-paths', 'distribution-tail'].join('|') },
  { key: 'all rendered citations resolve and injected bad ID is rejected', passed: citationIdsResolve(renderedSourceIds) && !citationIdsResolve([...renderedSourceIds, 999]) },
  { key: '53 references are continuous HTTPS and declare support and non-support', passed: lesson315References.length === 53 && lesson315References.every(({ id, url, use }, index) => id === index + 1 && url.startsWith('https://') && use.includes('支持') && use.includes('不支持')) },
  { key: 'evidence map covers every reference bidirectionally', passed: lesson315References.every(({ id }) => evidenceMapSourceIds.has(id)) && [...evidenceMapSourceIds].every((id) => allReferenceIds.has(id)) },
  { key: 'all M and K anchors resolve including official data and evidence boundary', passed: debtLeverageScenarios.every(({ primarySectionId, remediationSectionIds }) => scenarioAnchorIds.has(primarySectionId) && remediationSectionIds.every((id) => scenarioAnchorIds.has(id))) },
  { key: 'scenario structures and numeric assertions pass', passed: debtLeverageScenarioAssertions.every(({ passed }) => passed) && debtLeverageNumericAssertionAudit.every(({ passed }) => passed) },
  { key: '18 checks and 40-plus glossary entries', passed: checks.length === 18 && glossary.length >= 40 },
  { key: '16 producer invariants and 9 interfaces', passed: contractInvariants.length === 16 && interfaces.length === 9 },
  { key: '10 guided reading cards use HTTPS and auxiliary links', passed: lesson315ReadingList.length === 10 && lesson315ReadingList.every(({ url, links }) => url.startsWith('https://') && Boolean(links?.length) && links?.every(({ label, url: linkUrl }) => Boolean(label) && linkUrl.startsWith('https://'))) },
  { key: 'two official packets recompute and remain outside synthetic arithmetic', passed: brokerDealerLeverageObservations.length === 32 && householdDebtObservations.length === 8 && brokerDealerLeverageRecomputedNormalizedSha256 === brokerDealerLeverageNormalizedSha256 && householdDebtRecomputedNormalizedSha256 === householdDebtNormalizedSha256 && canonicalDebtLeverageStateExample.dynamicDataPassports.every(({ mayEnterCanonicalCalculation }) => !mayEnterCanonicalCalculation) },
  { key: 'Fed broker-dealer references preserve exact redesigned transaction stock and prior table IDs', passed: lesson315References[2].id === 3 && lesson315References[2].title === 'S125s3.s Security brokers and dealers' && lesson315References[2].publication.includes('S125s3.s (stocks)') && lesson315References[2].url.endsWith('/S125s3_s.htm') && lesson315References[3].use.includes('S125s3.t（交易流量）、S125s3.s（存量）') && lesson315References[3].use.includes('F.130/L.130') && brokerDealerLeverageDataPassport.transactionTableId === 'S125s3.t' && brokerDealerLeverageDataPassport.stockTableId === 'S125s3.s' && brokerDealerLeverageDataPassport.priorTableIds.join('/') === 'F.130/L.130' },
  { key: 'living household download endpoint is never represented as a retained content-addressed archive', passed: householdDebtDataPassport.capturedArchiveRetainedInRepository === false && householdDebtDataPassport.downloadEndpointMutability === 'LIVING_LATEST_RELEASE_URL_NOT_CONTENT_ADDRESSED' && householdDebtDataPassport.latestDownloadUrl.startsWith('https://') },
  { key: 'canonical 30-key and fixture gates pass', passed: canonicalDebtLeverageStateFields.length === 30 && canonicalDebtLeverageStateAudit.every(({ passed }) => passed) && debtLeverageFixtureAudit.every(({ passed }) => passed) },
] as const;

if (!lesson315IntegrityAudit.every(({ passed }) => passed)) {
  throw new Error(`3.15 lesson integrity gate failed: ${lesson315IntegrityAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

function Lesson315Content() {
  return <>
    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">00 · CORE THESIS</p>
      <h2>债务／杠杆周期不是“繁荣时多借、危机时少借”，而是固定承诺、薄缓冲与行为反馈共同塑造的状态转换。</h2>
      <p>3.14已经解释金融条件怎样穿过借款人、合同与中介形成信用流量。本节把镜头移到这些流量留下的债务存量：每一批债务携带利率、期限、币种、优先级、抵押与契约时钟。好时期的低风险读数、高估值与宽松条款可以扩大容量和杠杆化需求；与此同时，短债、浮息、薄权益与依赖升值的偿付姿态也可能悄悄累积。危机不是由“高杠杆”三个字自动生成，而是当价格、现金流、利率或续借触发器撞上这些预存状态时，主体可行动集合突然收窄。</p>
      <div className="impact-facts" role="group" aria-label="3.15核心学习承诺"><article><span>先冻结对象</span><b>contract + entity + clock</b><p>债务、现金、资产与收入必须同主体、同币种并带时间。</p></article><article><span>再拆状态</span><b>passive → target → proposed → actual</b><p>机械分母变化、行为规则、拟议交易和真实成交永久分栏。</p></article><article><span>最后闭环</span><b>repair → prices / income → new constraints</b><p>只有强制行为能返回价格与总需求时，个体损失才成为周期。</p></article></div>
      <div className="equation-card"><span>全章因果骨架</span><div><code>easier contracts → leveraged demand → prices / net worth ↑ → capacity ↑ ; shock → equity / cash buffer ↓ → covenant / refinancing pressure → repair actions → prices / income ↓ → tighter next state</code></div><p>每个箭头都需要主体、合同、时钟与市场清算条件。任何一环缺失，放大都可能减弱或停止。</p></div>
      <p>完成本节后，你应能在看到任何“杠杆率”时写出完整分数与口径护照；能手算被动杠杆、目标规则、净债务资格、再融资缺口、债务积压和四种修复路径；能解释为什么同一个比率下降可能来自偿债、资产出售、补股本、收入增长或债务减记；也能把真实官方数据、合成教学状态、历史预测证据与因果识别放回各自边界。</p>
      <p className="section-sources"><b>核心依据：</b> <Cites ns={directCitationRegistry.thesis} /></p>
    </section>

    <section className="lesson-section" id="official-data">
      <p className="section-kicker">01 · SCOPE, ROUTE & OFFICIAL DATA ORIENTATION</p>
      <h2>先用两个真实部门看见“同名不同物”：家庭负债／收入拆分分子与分母，经纪商资产／权益展示薄缓冲尺度。</h2>
      <div className="term-grid entry-vocabulary" aria-label="3.15核心路径十四词导航" role="group">{entryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>首次出现前先解码</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <DebtLeverageTransmissionChart />
      <div className="case-grid"><article className="case-card"><span>MASTER PREREQUISITE</span><h3>3.14 Credit Cycle</h3><p>完整信用反馈canonical是唯一直接上游上下文，不会数值校准本页单体教学账本；本节也不重新拼装3.10–3.13。</p></article><article className="case-card"><span>CORE PATH</span><h3>24个机制单元</h3><p>从合同、恒等式与口径一路进入容量、分母、目标和脆弱性。</p></article><article className="case-card"><span>OPTIONAL</span><h3>6个深挖单元</h3><p>现金流姿态、触发器、债务积压、修复、总需求与分布尾部。</p></article><article className="case-card"><span>EVIDENCE BOUNDARY</span><h3>official ≠ synthetic</h3><p>两套Fed数据只定向和校准量纲，绝不进入SYNTHETIC canonical算术。</p></article></div>
      <div className="precision-note"><span>为什么需要两个部门而不是一条“全社会杠杆”</span><p>家庭与非营利组织负债/DPI把债务存量相对收入流量，并可拆出按揭、消费信贷与其他负债；经纪商A/E把总资产相对Fed Z.1权益分母。前者不是微观家庭DTI或DSR，后者不是监管资本率，也没有被本页来源证明为通用“账面权益”口径。页面分别保存家庭2026Q2 current-vintage与经纪商May 2026出版物身份，并区分响应特定哈希和稳定提取行哈希；跨部门不可相加，也不能从历史形状推出目标杠杆、危机阈值或因果效应。</p></div>
      <p className="section-sources"><b>本节依据：</b> <Cites ns={directCitationRegistry.officialIntroduction} /></p>
    </section>

    {conceptSections.map((section) => <DebtLeverageConceptSection key={section.id} section={section} />)}

    <section className="lesson-section" id="interactive-lab">
      <p className="section-kicker">32 · INTERACTIVE M1–M10</p>
      <h2>把“正在加杠杆或去杠杆”的模糊判断，拆成十次可复算的账本、合同、行为与证据决定。</h2>
      <DebtLeverageLab />
    </section>

    <section className="lesson-section" id="checks-glossary">
      <p className="section-kicker">34 · CHECKS, CONTRACT AUDIT & GLOSSARY</p>
      <h2>能解释为什么比率会骗人、哪一步必须STOP、哪些条件会切断反馈，才算掌握杠杆周期。</h2>
      <div className="check-grid" role="group" aria-label="3.15理解检查">{checks.map((check, index) => <div key={check.question}><details><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={check.sourceIds} /></p></details><p className="print-only check-print-answer"><b>{String(index + 1).padStart(2, '0')} · 答案：</b>{check.answer} <Cites ns={check.sourceIds} /></p></div>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.15 canonical与fixture断言"><span>Canonical {canonicalDebtLeverageStateAudit.filter(({ passed }) => passed).length}/{canonicalDebtLeverageStateAudit.length} · Fixture {debtLeverageFixtureAudit.filter(({ passed }) => passed).length}/{debtLeverageFixtureAudit.length}</span><ul>{canonicalDebtLeverageStateAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{debtLeverageFixtureAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="yield-fixture-audit" role="group" aria-label="3.15正文引用题库与契约审计"><span>{lesson315IntegrityAudit.filter(({ passed }) => passed).length}/{lesson315IntegrityAudit.length} 项正文、来源、题库与契约门通过</span><ul>{lesson315IntegrityAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="3.15术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>

    <section className="lesson-section" id="evidence-boundaries">
      <p className="section-kicker">35 · CANONICAL STATE, CASES, EVIDENCE & INTERFACES</p>
      <h2>最终交付不是“现在处于哪个阶段”，而是一份能对账、能失败、能刷新并能把下一步问题路由出去的状态合同。</h2>
      <div className="precision-note" data-key-coverage={canonicalDebtLeverageStateAudit.every(({ passed }) => passed) ? 'complete' : 'incomplete'}>
        <span>3.15 canonical state · {canonicalDebtLeverageStateFields.length}个顶层键 · compile/runtime闭合</span>
        <p><code>{canonicalDebtLeverageStateFields.join(', ')}</code>。稳定schema为<code>{canonicalDebtLeverageStateExample.schemaVersion}</code>，3.14的<code>{canonicalCreditCycleStateExample.stateId}</code>只作为唯一直接上下文producer；聚合借款部门状态不数值校准本页单一法律实体账本。21条sourcePath→targetPath逐项按原始值或对象身份核验，缺失路径、错误接线和等值克隆全部失败。SYNTHETIC资产负债表A=100、D=80、其他负债=10、E=10闭合，并注册六种杠杆分母；价格冲击例把D冻结在90，A从100降到96、E从10降到6，A/E被动升至16。10倍目标规则只提出出售36与偿债36，actualAdjustment仍为null。本课政策ID只允许净额扣除通过四道资格门的5单位现金，不声称这是通用net debt定义；总用途显式登记到期本金30、同窗利息0与其他用途0，面对19单位可靠来源形成截零后的缺口11、盈余0，部分跨窗桶则直接STOP，缺口本身也不被标为违约。债务积压例同时保留总NPV +5、债权人增益10与股东NPV −5；四条去杠杆路径全部闭合并明确减记不是偿还。分布层将平均比率、总量比率和20%合成尾部权重分开。经纪商May 2026出版物快照与家庭2026Q2 current-vintage护照均<code>mayEnterCanonicalCalculation=false</code>，标准化行分别重算为<code>{brokerDealerLeverageNormalizedSha256}</code>与<code>{householdDebtNormalizedSha256}</code>。measurement为合成机械审计加官方定向，prediction仍not-estimated，causal仍not-identified，phase保持not-classified。</p>
      </div>

      <h3>三个历史案例与一个直接反例</h3>
      <div className="case-grid"><article className="case-card"><span>UNITED STATES · 2003–2019</span><h4>按揭主导与两种比率修复</h4><p>Fed current-vintage部门数据中，2003Q1至2007Q4总负债/DPI上升27.71pp，按揭贡献约25.08pp；2007Q4至2013Q1负债存量下降而DPI回升，2013Q1至2019Q1则是负债重新增长但收入增长更快。它是会计分解，不识别唯一供给冲击，也不是2007年的实时数据。 <Cites ns={[47, 48]} /></p></article><article className="case-card"><span>HUNGARY · 2008</span><h4>外币本金不变，本币负担也会跃升</h4><p>地区外币债务暴露与福林贬值的研究显示，汇率重估可提高违约、压低支出并产生邻近溢出；结果依赖外币错配和特定冲击，不能外推到本币固定利率或完全对冲债务。 <Cites ns={[49]} /></p></article><article className="case-card"><span>JAPAN · 1990s–2002</span><h4>缓慢确认损失也可能阻碍重组</h4><p>“僵尸贷款”研究把续贷、资源错配与健康企业进入投资受压联系起来，但不意味着所有展期都错误或所有弱企业应立即清算。 <Cites ns={[50]} /></p></article><article className="case-card"><span>COUNTEREXAMPLE</span><h4>企业信用繁荣并非总留下同样拖累</h4><p>跨国长期证据显示，企业信用繁荣的持久宏观后果通常弱于家庭信用繁荣，并取决于重组和清算制度；这直接否定“债务越高，下一轮衰退必然越深”的无条件命题。 <Cites ns={[51]} /></p></article></div>

      <h3>生产者侧不变量</h3><ol className="contract-list">{contractInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
      <h3>动态来源刷新护照</h3><div className="interface-grid" role="group" aria-label="3.15动态来源刷新清单">{dynamicRefreshChecklist.map((item) => <article key={item.source}><span>{item.source}</span><p><b>刷新：</b>{item.refresh} <a href={item.sourceUrl}>打开来源入口</a>。</p><p><b>允许用途：</b>{item.use} <Cites ns={item.sourceIds} /></p></article>)}</div>
      <h3>证据地图</h3><div className="evidence-map" aria-label={`3.15连续覆盖${lesson315References.length}条来源的证据地图`} role="group">{evidenceGroups.map((group) => <div key={group.title}><h4>{group.title}</h4><p>{group.text} <Cites ns={group.ids} /></p></div>)}</div>
      <h3>跨章接口</h3><div className="interface-grid" role="group" aria-label="3.15跨章接口">{interfaces.map((item) => <article key={item.name}><span>{item.name}</span><p><b>Payload：</b>{item.payload}</p><p><b>Guardrail：</b>{item.guardrail}</p></article>)}</div>
      <div className="precision-note"><span>Reading path</span><p>先读Fed、Basel、FSB与BIS，把不同主体的杠杆分数和偿债时钟对齐；再读Myers、Diamond、Kiyotaki–Moore、Geanakoplos与Adrian–Shin建立合同、期限和目标行为；随后进入债务通缩、总需求与中介非线性；最后用家庭、企业、外币和长期历史证据检查哪些结论只在特定部门、法域、样本和识别设计内成立。每张延伸阅读卡都列出具体阅读问题与不能外推的边界。</p></div>
    </section>
  </>;
}

export const lesson315: LessonRecord = {
  slug: '3-15',
  id: '3.15',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Debt / Leverage Cycle：固定承诺、薄缓冲与去杠杆反馈',
  subtitle: '从债务合约、分母、期限与现金流出发，解释好时期如何积累脆弱性、冲击如何先穿透权益与再融资窗口，以及不同修复路径怎样反馈价格、收入与下一轮信用条件',
  readingTime: 'CORE PATH 24个机制单元正文约100–125分钟；6个optional deep dive约30–40分钟。两组官方数据与C1–C7交互约65–90分钟；M1–M10首次完成约35–50分钟／含复盘约55–75分钟；K1–K10、18道检查、术语与接口约90–120分钟；53条来源及延伸阅读不计',
  prerequisite: 'Master prerequisite：3.14 Credit Cycle；建议熟悉3.09 Intermediary、3.11 Borrower Collateral与3.12 Risk-Taking；按需调用T02、T03、T05、T06与T08',
  updatedAt: '2026-09-15',
  revision: '3.15-r1',
  reviewStatus: 'double-reviewed',
  reviews: [
    { kind: 'accuracy', completedAt: '2026-09-15', decision: 'approved', revision: '3.15-r1', summary: '专业准确性通过：债务分数、被动杠杆、目标调整、期限与再融资缺口均可复算；53条来源的支持边界、Fed表号与动态数据护照、Chapter 7接口和canonical审计全部闭合。' },
    { kind: 'pedagogy', completedAt: '2026-09-15', decision: 'approved', revision: '3.15-r1', summary: '教学与可访问性通过：30个机制单元沿固定承诺—薄缓冲—冲击—修复反馈渐进展开；首现术语、C1–C7、M/K双通道、移动端、无JavaScript与打印等价表达均通过。' },
  ],
  previous: { slug: '3-14', label: '3.14 Credit Cycle' },
  next: { label: '3.16 Housing–Collateral Feedback' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'official-data', label: '范围、路线与真实数据' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive M1–M10' },
    { id: 'debt-leverage-static-twins', label: 'Static K1–K10' },
    { id: 'checks-glossary', label: 'Checks / Audit / Glossary' },
    { id: 'evidence-boundaries', label: 'State / Cases / Evidence / Interfaces' },
  ],
  Content: Lesson315Content,
  references: lesson315References,
  readingList: lesson315ReadingList,
  readingListOrder: 'source',
};
