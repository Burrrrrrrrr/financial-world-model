import type { ReactNode } from 'react';
import FinancialConditionsLab from '../components/FinancialConditionsLab';
import {
  BorrowerFinancingMenuLab,
  DirectionStandardisationLab,
  DuplicateDetectorLab,
  ForecastCausalGateLab,
  StateDependenceLab,
  VintageMachineLab,
  WeightLensLab,
} from '../components/FinancialConditionsMechanismLabs';
import FinancialConditionsTransmissionChart from '../components/FinancialConditionsTransmissionChart';
import {
  borrowerConflictResults,
  borrowerDirectionPassports,
  borrowerExposureProfiles,
  canonicalCategoryBalancedResult,
  canonicalFinancialConditionsComponents,
  canonicalGrowthPurposeResult,
  canonicalVariancePurposeResult,
  categoryBalancedWeights,
  fciGDataPassport,
  fciGDecompositionSnapshots,
  fciGSelectedQuarterEnds,
  financialConditionsDomains,
  financialConditionsFixtureAudit,
  illustrativeGrowthPurposeWeights,
  illustrativeVariancePurposeWeights,
  priceQuantityConflictAggregate,
  type FinancialConditionsComponent,
  type FinancialConditionsDomainId,
  type FinancialConditionsWeight,
} from '../components/financialConditionsFixtures';
import {
  financialConditionsNumericAssertionAudit,
  financialConditionsScenarioAssertions,
  financialConditionsScenarios,
} from '../components/financialConditionsScenarios';
import { canonicalBankLendingStateExample } from './lesson-3-10';
import { canonicalBorrowerCollateralStateExample } from './lesson-3-11';
import { canonicalMonetaryPolicyRiskTakingStateExample } from './lesson-3-12';
import { lesson313ReadingList, lesson313References } from './lesson-3-13-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a aria-label={`参考文献 ${n}`} className="citation-mark" href={`#ref-${n}`}>[{n}]</a>;
}

function Cites({ ns }: { ns: readonly number[] }) {
  return <>{ns.map((n) => <Cite key={n} n={n} />)}</>;
}

type ConceptSection = {
  id: string;
  number: number;
  label: string;
  title: string;
  paragraphs: readonly string[];
  sourceIds: readonly number[];
  formula?: { label: string; expression: string; note: string };
  boundary?: string;
  after?: ReactNode;
};

type MeasurementStatus = 'synthetic-mechanically-audited' | 'descriptive' | 'empirically-constructed';
type PredictionStatus = 'not-estimated' | 'in-sample-only' | 'oos-candidate' | 'oos-validated';
type CausalStatus = 'not-claimed' | 'identified-candidate' | 'identified';

type FinancialConditionsState = {
  schemaVersion: string;
  stateId: string;
  scopePassport: {
    jurisdiction: string;
    reportingCurrency: string;
    agentPopulationId: string;
    financingPurpose: string;
    useCaseId: string;
    aggregationLevel: 'registered-agent-and-category';
    targetHorizon: string;
    observationFrequency: string;
    indexDirection: 'positive-is-tighter';
    asOf: string;
    informationCutoff: string;
    vintagePolicy: 'synthetic-fixed';
  };
  inputLineage: {
    lessonId: '3.06' | '3.07' | '3.08' | '3.09' | '3.10' | '3.11' | '3.12';
    stateId: string;
    schemaVersion: string;
    fieldPaths: string[];
    relation: 'interface-only-not-exported' | 'direct-canonical-import';
  }[];
  componentUniverse: readonly FinancialConditionsComponent[];
  transformationState: {
    directionRule: 'positive-is-tighter-after-agent-mapping';
    rawValuesPreserved: true;
    canonicalScoresAreRealSampleZScores: false;
    normalisationPolicy: 'synthetic-z-like-inputs-no-empirical-fit';
    missingPolicy: 'stop-or-explicit-partial-vector-never-zero';
  };
  redundancyState: {
    groupId: string;
    relation: 'derived-overlap';
    identity: string;
    activeComponentIds: string[];
    excludedComponentIds: string[];
    treatment: 'decompose-and-exclude-total';
  }[];
  laneStates: { domain: FinancialConditionsDomainId; score: number; unit: 'synthetic index points'; measurementFlag: 'synthetic' }[];
  agentExposureMaps: {
    agentId: string;
    weights: readonly FinancialConditionsWeight[];
    directionPassport: {
      signMapVersion: string;
      heterogeneityMode: 'weight-only-under-shared-fixed-sign-map';
      allDirectionsDefined: boolean;
      domainDirections: readonly { domain: FinancialConditionsDomainId; directionStatus: 'defined-synthetic-assumption'; rule: string }[];
    };
    scoreInConflictCase: number | null;
    measurementFlag: 'synthetic';
  }[];
  weightingState: {
    methods: { id: string; purpose: string; weights: readonly FinancialConditionsWeight[]; score: number | null }[];
    registeredMethodId: 'category-balanced';
    weightsChosenBeforeOutcome: true;
    compositeVarianceNormalised: false;
  };
  compositeState: {
    registeredScore: number;
    unit: 'synthetic index points';
    weightLedger: readonly FinancialConditionsWeight[];
    contributionLedger: { domain: FinancialConditionsDomainId; contribution: number }[];
    coverage: {
      expectedDomains: readonly FinancialConditionsDomainId[];
      observedDomains: FinancialConditionsDomainId[];
      totalOriginalWeight: number;
      observedWeight: number;
      isPartial: false;
      missingDomains: FinancialConditionsDomainId[];
      renormalized: false;
      compositionVersion: 'full-scope-v1';
    };
    scalarIsOnlyOutput: false;
  };
  distributionState: {
    aggregateConflictScore: number | null;
    registeredAgentScores: { agentId: string; score: number | null }[];
    bindingShareObserved: false;
    quantilesObserved: false;
  };
  targetRegistry: {
    targetId: 'price-cost-conditions' | 'credit-access-conditions' | 'registered-agent-composite' | 'mean-activity-forecast' | 'downside-activity-forecast';
    outcome: string;
    unit: string;
    horizon: string;
    estimate: number | null;
  }[];
  evidenceState: { measurementStatus: MeasurementStatus; predictionStatus: PredictionStatus; causalStatus: CausalStatus };
  dynamicDataPassports: { sourceId: string; provider: string; product: string; frequency: string; observationEnd: string | null; retrievedAt: string; revisionWarning: string; sourceReferenceIds: number[] }[];
  measurementFlags: { objectId: string; flag: 'synthetic' | 'observed-official-snapshot' | 'estimated' | 'not-collected'; mayEnterCanonicalScore: boolean; reason: string }[];
  boundaryRoutes: { destination: string; payload: string; guardrail: string }[];
  auditTimestamps: { constructedAt: string; sourceRetrievalDate: string; reviewFrozenAt: string | null };
};

const canonicalFinancialConditionsStateFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'componentUniverse', 'transformationState',
  'redundancyState', 'laneStates', 'agentExposureMaps', 'weightingState', 'compositeState', 'distributionState',
  'targetRegistry', 'evidenceState', 'dynamicDataPassports', 'measurementFlags', 'boundaryRoutes', 'auditTimestamps',
] as const satisfies readonly (keyof FinancialConditionsState)[];

const categoryResult = canonicalCategoryBalancedResult;
if (!categoryResult) throw new Error('3.13 canonical category result is unavailable');
const categoryScore = categoryResult.score;

function requireFiniteScore(value: number | null, id: string) {
  if (typeof value !== 'number' || !Number.isFinite(value)) throw new Error(`3.13 missing canonical score: ${id}`);
  return value;
}

export const canonicalFinancialConditionsStateExample: FinancialConditionsState = {
  schemaVersion: 'financial-conditions-state-v1',
  stateId: 'SYNTHETIC_REGISTERED_FINANCIAL_CONDITIONS_STATE',
  scopePassport: {
    jurisdiction: 'SYNTHETIC-JURISDICTION',
    reportingCurrency: 'SYN',
    agentPopulationId: 'REGISTERED-MIXED-FINANCING-AGENTS',
    financingPurpose: 'marginal external financing and balance-sheet support',
    useCaseId: 'TEACHING-DESCRIPTIVE-STATE',
    aggregationLevel: 'registered-agent-and-category',
    targetHorizon: 'current-state; no forecast target estimated',
    observationFrequency: 'synthetic single snapshot',
    indexDirection: 'positive-is-tighter',
    asOf: '2026-09-11T00:00:00+08:00',
    informationCutoff: '2026-09-11T00:00:00+08:00',
    vintagePolicy: 'synthetic-fixed',
  },
  inputLineage: [
    { lessonId: '3.06', stateId: 'INTERFACE_306_REVIEWED', schemaVersion: '3.06-r4', fieldPaths: ['effectiveOvernightRate', 'securedUnsecuredSpread', 'repoSpread', 'rateDispersion', 'targetError', 'timestamps'], relation: 'interface-only-not-exported' },
    { lessonId: '3.07', stateId: 'INTERFACE_307_REVIEWED', schemaVersion: '3.07-r5', fieldPaths: ['zeroCouponYields', 'parYields', 'levelFactor', 'slopeFactor', 'curvatureFactor', 'estimatedYieldTermPremium', 'decompositionUncertainty', 'timestamps'], relation: 'interface-only-not-exported' },
    { lessonId: '3.08', stateId: 'INTERFACE_308_REVIEWED', schemaVersion: '3.08-r4', fieldPaths: ['nominalCurveInput', 'realRateState', 'claimSpecificPremiumSchema', 'valuationState', 'timestamps'], relation: 'interface-only-not-exported' },
    { lessonId: '3.09', stateId: 'INTERFACE_309_REVIEWED', schemaVersion: '3.09-r5', fieldPaths: ['fundingAfterSettlement', 'capitalHeadroom', 'liquidityHeadroom', 'leverageHeadroom', 'concentrationHeadroom'], relation: 'interface-only-not-exported' },
    { lessonId: '3.10', stateId: canonicalBankLendingStateExample.stateId, schemaVersion: canonicalBankLendingStateExample.schemaVersion, fieldPaths: ['bankFundingState', 'bankConstraintState', 'loanOfferState', 'creditDecisionState', 'allocationState', 'substitutionState'], relation: 'direct-canonical-import' },
    { lessonId: '3.11', stateId: canonicalBorrowerCollateralStateExample.stateId, schemaVersion: canonicalBorrowerCollateralStateExample.schemaVersion, fieldPaths: ['externalFinancePremiumState.allInExternalCost', 'externalFinancePremiumState.borrowerExternalFinancePremiumPctPoints', 'financingDecisionState.requested', 'financingDecisionState.approved', 'financingDecisionState.committed', 'financingDecisionState.drawn', 'debtContractState.facilities', 'constraintStackState.constraints', 'constraintStackState.bindingCapacity', 'financingDecisionState.securedLoanChange', 'financingDecisionState.unsecuredLoanChange', 'financingDecisionState.bondChange', 'financingDecisionState.tradeCreditChange', 'financingDecisionState.leaseFinanceChange', 'financingDecisionState.totalExternalFinanceChange', 'financingDecisionState.internalCashUse', 'financingDecisionState.postCashResourceChange', 'financingDecisionState.remainingResourceShortfall'], relation: 'direct-canonical-import' },
    { lessonId: '3.12', stateId: canonicalMonetaryPolicyRiskTakingStateExample.stateId, schemaVersion: canonicalMonetaryPolicyRiskTakingStateExample.schemaVersion, fieldPaths: ['riskGovernanceState', 'underwritingState', 'portfolioRiskState', 'selectionFunnelState'], relation: 'direct-canonical-import' },
  ],
  componentUniverse: canonicalFinancialConditionsComponents,
  transformationState: {
    directionRule: 'positive-is-tighter-after-agent-mapping',
    rawValuesPreserved: true,
    canonicalScoresAreRealSampleZScores: false,
    normalisationPolicy: 'synthetic-z-like-inputs-no-empirical-fit',
    missingPolicy: 'stop-or-explicit-partial-vector-never-zero',
  },
  redundancyState: [
    { groupId: 'CORPORATE_YIELD_IDENTITY', relation: 'derived-overlap', identity: 'corporate all-in yield = matched benchmark yield + credit spread + contract adjustments', activeComponentIds: ['MATCHED_BENCHMARK', 'CREDIT_SPREAD', 'CONTRACT_ADJUSTMENTS'], excludedComponentIds: ['CORPORATE_ALL_IN_YIELD'], treatment: 'decompose-and-exclude-total' },
  ],
  laneStates: canonicalFinancialConditionsComponents.map(({ domain, transformedTightnessScore }) => ({ domain, score: requireFiniteScore(transformedTightnessScore, domain), unit: 'synthetic index points', measurementFlag: 'synthetic' })),
  agentExposureMaps: [
    { agentId: 'BANK_DEPENDENT_SMALL_FIRM', weights: borrowerExposureProfiles.bankDependentSmallFirm, directionPassport: borrowerDirectionPassports.bankDependentSmallFirm, scoreInConflictCase: borrowerConflictResults.bankDependentSmallFirm?.score ?? null, measurementFlag: 'synthetic' },
    { agentId: 'PUBLIC_BOND_ISSUER', weights: borrowerExposureProfiles.publicBondIssuer, directionPassport: borrowerDirectionPassports.publicBondIssuer, scoreInConflictCase: borrowerConflictResults.publicBondIssuer?.score ?? null, measurementFlag: 'synthetic' },
    { agentId: 'UNHEDGED_DOLLAR_DEBTOR', weights: borrowerExposureProfiles.dollarDebtor, directionPassport: borrowerDirectionPassports.dollarDebtor, scoreInConflictCase: borrowerConflictResults.dollarDebtor?.score ?? null, measurementFlag: 'synthetic' },
  ],
  weightingState: {
    methods: [
      { id: 'category-balanced', purpose: 'transparent broad-state teaching baseline', weights: categoryBalancedWeights, score: canonicalCategoryBalancedResult?.score ?? null },
      { id: 'illustrative-growth-purpose', purpose: 'synthetic macro lens; not an estimated growth multiplier', weights: illustrativeGrowthPurposeWeights, score: canonicalGrowthPurposeResult?.score ?? null },
      { id: 'illustrative-variance-purpose', purpose: 'synthetic statistical lens; not PCA output', weights: illustrativeVariancePurposeWeights, score: canonicalVariancePurposeResult?.score ?? null },
    ],
    registeredMethodId: 'category-balanced',
    weightsChosenBeforeOutcome: true,
    compositeVarianceNormalised: false,
  },
  compositeState: {
    registeredScore: categoryScore,
    unit: 'synthetic index points',
    weightLedger: categoryResult.contributions.map(({ domain, weight }) => ({ domain, weight })),
    contributionLedger: categoryResult.contributions.map(({ domain, contribution }) => ({ domain, contribution })),
    coverage: {
      expectedDomains: financialConditionsDomains,
      observedDomains: categoryResult.contributions.map(({ domain }) => domain),
      totalOriginalWeight: categoryResult.totalOriginalWeight,
      observedWeight: categoryResult.observedWeight,
      isPartial: categoryResult.isPartial,
      missingDomains: categoryResult.missingDomains,
      renormalized: categoryResult.renormalized,
      compositionVersion: categoryResult.compositionVersion,
    },
    scalarIsOnlyOutput: false,
  },
  distributionState: {
    aggregateConflictScore: priceQuantityConflictAggregate?.score ?? null,
    registeredAgentScores: [
      { agentId: 'BANK_DEPENDENT_SMALL_FIRM', score: borrowerConflictResults.bankDependentSmallFirm?.score ?? null },
      { agentId: 'PUBLIC_BOND_ISSUER', score: borrowerConflictResults.publicBondIssuer?.score ?? null },
      { agentId: 'UNHEDGED_DOLLAR_DEBTOR', score: borrowerConflictResults.dollarDebtor?.score ?? null },
    ],
    bindingShareObserved: false,
    quantilesObserved: false,
  },
  targetRegistry: [
    { targetId: 'price-cost-conditions', outcome: 'marginal all-in external financing cost for matched contract', unit: 'annual percentage points', horizon: 'contract-specific', estimate: null },
    { targetId: 'credit-access-conditions', outcome: 'approval probability or approved amount among pre-defined eligible applications', unit: 'probability or amount/request ratio', horizon: 'decision window', estimate: null },
    { targetId: 'registered-agent-composite', outcome: 'agent-purpose-specific composite with lane ledger', unit: 'synthetic index points', horizon: 'current synthetic snapshot', estimate: categoryScore },
    { targetId: 'mean-activity-forecast', outcome: 'conditional mean of future real activity', unit: 'target-specific', horizon: 'must be registered before estimation', estimate: null },
    { targetId: 'downside-activity-forecast', outcome: 'pre-registered lower quantile of future real activity', unit: 'target-specific', horizon: 'must be registered before estimation', estimate: null },
  ],
  evidenceState: { measurementStatus: 'synthetic-mechanically-audited', predictionStatus: 'not-estimated', causalStatus: 'not-claimed' },
  dynamicDataPassports: [
    { sourceId: 'FED_FCIG_BASELINE_MONTHLY_3YR', provider: fciGDataPassport.provider, product: fciGDataPassport.product, frequency: 'monthly', observationEnd: fciGDataPassport.observationEnd, retrievedAt: fciGDataPassport.retrievedAt, revisionWarning: fciGDataPassport.status, sourceReferenceIds: [1, 2] },
    { sourceId: 'CHICAGO_FED_NFCI_ANFCI', provider: 'Federal Reserve Bank of Chicago', product: 'NFCI and ANFCI', frequency: 'weekly', observationEnd: null, retrievedAt: '2026-09-11', revisionWarning: 'history changes with new data, revisions, and re-estimated weights; refresh required', sourceReferenceIds: [3, 4] },
    { sourceId: 'FED_SLOOS', provider: 'Board of Governors of the Federal Reserve System', product: 'Senior Loan Officer Opinion Survey', frequency: 'quarterly survey/release', observationEnd: null, retrievedAt: '2026-09-11', revisionWarning: 'questionnaire, response window, denominator and release date must be refreshed', sourceReferenceIds: [17] },
  ],
  measurementFlags: [
    { objectId: 'canonical-six-domain-state', flag: 'synthetic', mayEnterCanonicalScore: true, reason: 'teaching fixture only; no empirical normalisation' },
    { objectId: 'official-fci-g-chart', flag: 'observed-official-snapshot', mayEnterCanonicalScore: false, reason: 'real data orientation is separated from synthetic canonical state' },
    { objectId: 'borrower-quantiles', flag: 'not-collected', mayEnterCanonicalScore: false, reason: 'absence is not zero' },
  ],
  boundaryRoutes: [
    { destination: '3.14 Credit Cycle', payload: 'lane levels/changes, financing menu distribution, weight ledger, component contributions, coverage(expectedDomains/observedDomains/totalOriginalWeight/observedWeight/isPartial/missingDomains/renormalized), compositionVersion, credit stock/flow diagnostics, vintage', guardrail: '3.13 supplies state at t; 3.14 owns conditions→credit→net worth/loss→next conditions feedback' },
    { destination: '3.20 Exchange Rate', payload: 'currency, quote convention, net FX debt/income, hedge ratio and repricing horizon', guardrail: '3.13 maps measured FX exposure; 3.20 owns exchange-rate determination' },
    { destination: '4.07 Global Financial Cycle', payload: 'jurisdiction-local vector, global/local candidate decomposition and currency exposures', guardrail: 'cross-country comovement alone does not identify a global cycle' },
    { destination: '7.10 / 7.17 / 7.24 / 7.26', payload: 'overlap graph, target registry, evidence axes, passports, train windows and OOS record', guardrail: 'descriptive composite cannot be reused as an identified shock' },
  ],
  auditTimestamps: { constructedAt: '2026-09-11T00:00:00+08:00', sourceRetrievalDate: '2026-09-11', reviewFrozenAt: '2026-09-11T14:41:06+08:00' },
};

const directCanonicalStatesByLesson = new Map<string, unknown>([
  ['3.10', canonicalBankLendingStateExample],
  ['3.11', canonicalBorrowerCollateralStateExample],
  ['3.12', canonicalMonetaryPolicyRiskTakingStateExample],
]);

const canonicalFieldPathResolves = (root: unknown, fieldPath: string) => {
  let cursor = root;
  for (const segment of fieldPath.split('.')) {
    if (typeof cursor !== 'object' || cursor === null || !Object.prototype.hasOwnProperty.call(cursor, segment)) return false;
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return true;
};

const directCanonicalFieldPathsResolve = canonicalFinancialConditionsStateExample.inputLineage
  .filter(({ relation }) => relation === 'direct-canonical-import')
  .every(({ lessonId, fieldPaths }) => {
    const upstreamState = directCanonicalStatesByLesson.get(lessonId);
    return upstreamState !== undefined && fieldPaths.length > 0 && fieldPaths.every((fieldPath) => canonicalFieldPathResolves(upstreamState, fieldPath));
  });

const close = (left: number | undefined | null, right: number, tolerance = 1e-9) => typeof left === 'number' && Math.abs(left - right) <= tolerance;
const fciGLatest = fciGDecompositionSnapshots.find(({ date }) => date === fciGDataPassport.observationEnd);
const canonicalStateAudit = [
  { key: 'all top-level state keys covered', passed: Object.keys(canonicalFinancialConditionsStateExample).length === canonicalFinancialConditionsStateFields.length },
  { key: 'stable schema name without draft marker', passed: canonicalFinancialConditionsStateExample.schemaVersion === 'financial-conditions-state-v1' && !canonicalFinancialConditionsStateExample.schemaVersion.includes('draft') },
  { key: 'seven reviewed upstream interfaces and three direct imports', passed: canonicalFinancialConditionsStateExample.inputLineage.length === 7 && canonicalFinancialConditionsStateExample.inputLineage.filter(({ relation }) => relation === 'direct-canonical-import').length === 3 },
  { key: 'direct upstream state IDs resolve', passed: canonicalFinancialConditionsStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.10')?.stateId === canonicalBankLendingStateExample.stateId && canonicalFinancialConditionsStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.11')?.stateId === canonicalBorrowerCollateralStateExample.stateId && canonicalFinancialConditionsStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.12')?.stateId === canonicalMonetaryPolicyRiskTakingStateExample.stateId },
  { key: 'every direct-import field path resolves on its declared canonical producer', passed: directCanonicalFieldPathsResolve },
  { key: 'six-lane synthetic vector preserved', passed: canonicalFinancialConditionsStateExample.laneStates.length === 6 && canonicalFinancialConditionsStateExample.laneStates.every(({ score, measurementFlag }) => Number.isFinite(score) && measurementFlag === 'synthetic') },
  { key: 'all declared weight lenses sum and recompute', passed: canonicalFinancialConditionsStateExample.weightingState.methods.every(({ weights, score }) => close(weights.reduce((sum, { weight }) => sum + weight, 0), 1) && close(score, weights.reduce((sum, { domain, weight }) => sum + weight * requireFiniteScore(canonicalFinancialConditionsComponents.find((component) => component.domain === domain)?.transformedTightnessScore ?? null, domain), 0))) },
  { key: 'registered category score and contributions close', passed: close(canonicalFinancialConditionsStateExample.compositeState.registeredScore, 43 / 60) && close(canonicalFinancialConditionsStateExample.compositeState.contributionLedger.reduce((sum, { contribution }) => sum + contribution, 0), 43 / 60) },
  { key: 'registered scalar carries full weight and coverage contract', passed: canonicalFinancialConditionsStateExample.compositeState.weightLedger.length === financialConditionsDomains.length && close(canonicalFinancialConditionsStateExample.compositeState.weightLedger.reduce((sum, { weight }) => sum + weight, 0), 1) && canonicalFinancialConditionsStateExample.compositeState.coverage.expectedDomains.length === financialConditionsDomains.length && canonicalFinancialConditionsStateExample.compositeState.coverage.observedDomains.length === financialConditionsDomains.length && close(canonicalFinancialConditionsStateExample.compositeState.coverage.totalOriginalWeight, 1) && close(canonicalFinancialConditionsStateExample.compositeState.coverage.observedWeight, 1) && canonicalFinancialConditionsStateExample.compositeState.coverage.isPartial === false && canonicalFinancialConditionsStateExample.compositeState.coverage.missingDomains.length === 0 && canonicalFinancialConditionsStateExample.compositeState.coverage.renormalized === false && canonicalFinancialConditionsStateExample.compositeState.coverage.compositionVersion === 'full-scope-v1' },
  { key: '3.14 route preserves every coverage and composition field', passed: ['expectedDomains', 'observedDomains', 'totalOriginalWeight', 'observedWeight', 'isPartial', 'missingDomains', 'renormalized', 'compositionVersion'].every((field) => canonicalFinancialConditionsStateExample.boundaryRoutes.find(({ destination }) => destination === '3.14 Credit Cycle')?.payload.includes(field)) },
  { key: 'scalar never replaces vector or distribution', passed: canonicalFinancialConditionsStateExample.compositeState.scalarIsOnlyOutput === false && canonicalFinancialConditionsStateExample.distributionState.registeredAgentScores.length === 3 },
  { key: 'agent maps preserve explicit direction passports and label weight-only heterogeneity', passed: canonicalFinancialConditionsStateExample.agentExposureMaps.every(({ directionPassport }) => directionPassport.heterogeneityMode === 'weight-only-under-shared-fixed-sign-map' && directionPassport.allDirectionsDefined && directionPassport.domainDirections.length === 6 && directionPassport.domainDirections.every(({ directionStatus }) => directionStatus === 'defined-synthetic-assumption')) },
  { key: 'aggregate and borrower-specific conflict example closes', passed: close(canonicalFinancialConditionsStateExample.distributionState.aggregateConflictScore, 1 / 12) && close(canonicalFinancialConditionsStateExample.distributionState.registeredAgentScores[0]?.score, 0.73) && close(canonicalFinancialConditionsStateExample.distributionState.registeredAgentScores[1]?.score, -0.195) && close(canonicalFinancialConditionsStateExample.distributionState.registeredAgentScores[2]?.score, 0.005) },
  { key: 'five distinct targets with only synthetic composite populated', passed: canonicalFinancialConditionsStateExample.targetRegistry.length === 5 && new Set(canonicalFinancialConditionsStateExample.targetRegistry.map(({ targetId }) => targetId)).size === 5 && canonicalFinancialConditionsStateExample.targetRegistry.filter(({ estimate }) => estimate !== null).length === 1 },
  { key: 'three evidence axes remain separated', passed: canonicalFinancialConditionsStateExample.evidenceState.measurementStatus === 'synthetic-mechanically-audited' && canonicalFinancialConditionsStateExample.evidenceState.predictionStatus === 'not-estimated' && canonicalFinancialConditionsStateExample.evidenceState.causalStatus === 'not-claimed' },
  { key: 'official chart cannot enter synthetic canonical score', passed: canonicalFinancialConditionsStateExample.measurementFlags.find(({ objectId }) => objectId === 'official-fci-g-chart')?.mayEnterCanonicalScore === false },
  { key: 'official latest decomposition and passport close', passed: fciGLatest?.date === fciGDataPassport.observationEnd && close(fciGLatest ? Object.values(fciGLatest.contributions).reduce((sum, value) => sum + value, 0) : null, fciGLatest?.total ?? Number.NaN, 2e-12) && fciGSelectedQuarterEnds.at(-1)?.date === fciGDataPassport.observationEnd },
  { key: 'all fixture-level gates pass', passed: financialConditionsFixtureAudit.every(({ passed }) => passed) },
] as const;

if (!canonicalStateAudit.every(({ passed }) => passed)) {
  throw new Error(`3.13 canonical state gate failed: ${canonicalStateAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

const lesson313CorePathSectionIds = new Set([
  'object-measured', 'fci-policy-stress-cycle', 'exposure-mapping', 'component-passport', 'level-change-horizon',
  'interest-rate-lane', 'credit-price-lane', 'equity-wealth-lane', 'fx-dollar-lane', 'price-quantity-terms',
  'direction-standardisation', 'weighting-purpose', 'redundancy-double-count', 'realtime-vintage', 'component-contribution',
  'aggregate-borrower-specific', 'prediction-target', 'prediction-not-causation', 'index-families', 'validation-protocol',
  'stress-vulnerability', 'claim-ladder',
]);

const entryVocabulary = [
  ['Scalar', '标量：把多维状态压成的一个数字；便于摘要，但不能替代底层向量。'],
  ['Partial vector', '部分向量：缺项时保留已知各维、缺失列表与覆盖率，不把未知写成零。'],
  ['Normaliser', '标准化器：用冻结的均值、SD或协方差把原始单位映射到可比尺度的规则。'],
  ['Estimand', '估计对象：明确为谁、比较什么处理或状态、哪个结果与期限。'],
  ['Vintage', '信息版本：某一时点真实可见的数据、修订、参数与模型版本集合。'],
  ['Embargo', '隔离窗：训练与测试之间预留的时间间隔，防止相邻标签或发布时间泄漏。'],
  ['Residualise', '残差化：按预注册模型剔除已由另一原语解释的部分，以处理重叠；不是因果净化。'],
  ['Contribution ledger', '贡献账本：逐项保存wᵢzᵢ并验证其和等于总指数。'],
  ['Exposure mapping', '暴露映射：把市场变量经过主体、合同、币种、期限与对冲翻译为有效条件。'],
  ['Shapley / local explanation', '局部解释：围绕指定模型与基准分摊单个预测，不自动等于结构成因。'],
] as const;

function FinancialConditionsConceptSection({ section }: { section: ConceptSection }) {
  const learningTrack = lesson313CorePathSectionIds.has(section.id) ? 'CORE PATH' : 'OPTIONAL DEEP DIVE';
  const [firstParagraph, ...remainingParagraphs] = section.paragraphs;
  return <section className="lesson-section" id={section.id}>
    <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label} · {learningTrack}</p>
    <h2>{section.title}</h2>
    {firstParagraph ? <p>{firstParagraph}</p> : null}
    {section.formula ? <div className="equation-card"><span>{section.formula.label}</span><div><code>{section.formula.expression}</code></div><p>{section.formula.note}</p></div> : null}
    {remainingParagraphs.map((paragraph, index) => <p key={`${section.id}:${index + 1}`}>{paragraph}</p>)}
    {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
    {section.after}
    <p className="section-sources"><b>本节依据：</b> <Cites ns={section.sourceIds} /></p>
  </section>;
}

const conceptSections: ConceptSection[] = [
  {
    id: 'object-measured', number: 2, label: 'The Object Being Measured',
    title: '“金融条件”首先是某个主体在某个时点面对的融资菜单；指数只是对这个对象的二级测量。',
    paragraphs: [
      '在日常语言里，人们常把“利率高、信用紧、股票跌、美元强”合称金融条件收紧。但这些变量并没有天然共同单位，也不会对所有人产生同一方向：固定利率存量债务人未必立刻受短率上升影响，现金充裕企业可能几乎不依赖外部融资，美元收入与美元债务匹配的出口商也不同于未对冲美元债务人。因而金融条件不能先从一条指数开始，必须先问谁在何种合同与期限上需要什么资金。',
      '本章把最小对象写成 FC(a,u,j,c,h,t|v)：a是主体，u是融资用途，j是法域，c是币种与报价方向，h是期限，t是经济观察时点，v是当时的信息和模型vintage（版本）。只有这些键关闭后，利率、利差、资产价格、额度和条款才有可比较的经济含义；缺少任何关键键时，最诚实的输出是partial vector（保留已知各维、缺失项和覆盖率）或STOP，而不是“全国金融条件为0.7”。',
      'FCI因此是一台measurement machine：研究者选择输入、变换、方向、标准化和权重，再得到一个用途特定的数。它可以高质量描述状态或帮助预测，却不是像温度那样能被单一仪器直接观测的自然量。两套FCI在同一天数值不同，往往是对象和问题不同，而不是必有一套错误。',
    ],
    sourceIds: [3, 5, 8, 12, 49, 50],
    formula: { label: '对象护照', expression: 'FC = FC(agent, use, jurisdiction, currency, horizon, time | information vintage)', note: '竖线右侧强调“在当时已知信息下”；这个对象尚未要求压成scalar（标量，即一个压缩后的数字）。' },
    boundary: '3.13拥有状态测量与用途特定压缩；主体行为由2.06和3.10–3.12提供，完整周期反馈由3.14拥有。',
  },
  {
    id: 'fci-policy-stress-cycle', number: 3, label: 'Four Non-equivalences',
    title: 'FCI、政策立场、政策冲击、金融压力与信用周期必须分开，否则一个数字会被迫扮演五种角色。',
    paragraphs: [
      '货币政策会影响金融条件，却不是金融条件的唯一来源。增长或通胀消息、风险溢价、资产负债表约束、全球美元融资和市场流动性都能同时移动；央行还会在条件已经恶化时降息。因此“政策利率下降、FCI仍收紧”完全可能发生，不能据此说指数算错，也不能把FCI高于零翻译为货币政策限制性。政策冲击更窄：它要求把意外、外生的政策变化从系统内生反应中识别出来。',
      '金融压力更关注市场功能失灵、波动、流动性枯竭和跨市场共振。金融条件可以在市场运转正常时逐步收紧，也可以在条件宽松、压力很低时累积杠杆脆弱性；反过来，危机时压力指数会尖峰，但一个增长映射型FCI可能因滞后和组件选择表现得更平滑。两者零点、目标和动态都不同。',
      '信用周期又是跨期反馈：条件影响新信用与杠杆，信用影响净值和资产价格，损失再回到银行与市场条件。3.13只冻结某时点的多维状态及其变化，3.14才闭合conditionsₜ→creditₜ→net worth/lossₜ₊₁→conditionsₜ₊₁。没有存量、流量与反馈，仅凭FCI波动不能称作周期。',
    ],
    sourceIds: [1, 6, 7, 12, 16, 20, 35, 36, 37],
    formula: { label: '对象分栏', expression: 'state FCI ≠ policy stance ≠ identified shock ≠ stress ≠ financial/credit cycle', note: '“不等于”不否认相互作用，而是防止跨对象偷换证据。' },
    boundary: '结构政策处理回到3.05/3.23；压力与脆弱性进入Chapter 7；信用周期进入3.14。',
  },
  {
    id: 'exposure-mapping', number: 4, label: 'Exposure Mapping Mechanism',
    title: '市场变量只有穿过合同、资产负债表和可替代融资，才会成为主体真正面对的金融条件。',
    paragraphs: [
      '安全收益率上升先改变债券、贷款与估值基准；信用利差改变违约风险补偿和中介风险价格；股票与房价改变权益融资稀释、抵押物和净值；汇率改变外币债务服务和贸易现金流；银行标准、额度、期限、担保与契约决定即使愿意付价是否还能借到。主体随后调整申请、发行、投资、雇佣、库存与现金缓冲，新的现金流和资产负债表又反馈到下一轮市场与中介决策。',
      '同一个市场冲击因合同结构而产生不同延迟。浮动贷款在重定价日传入现金流，固定利率债务可能到再融资时才显现；股票下跌对公开发行人和以股权作抵押的中介影响更快，对无上市股权的小企业则主要通过银行、需求和担保间接传导。测量时要保存资格、固定/浮动、剩余期限、融资份额、净外币债务与收入以及对冲比例。',
      '这种映射提醒我们，指数不是独立因果力量。它是系统状态经过测量算子后的摘要；真实因果链仍从新闻、政策、风险承受与约束出发，经价格和条款进入主体选择，再反馈到宏观和金融系统。一个指数可以是这条链的中间状态变量，但不能把其名称当作冲击来源。',
    ],
    sourceIds: [1, 8, 12, 39, 46, 49, 50],
    formula: { label: '传导链', expression: 'market/intermediary state → financing menu → agent choice → cash flow & balance sheet → next state', note: '每一箭头都受合同、主体和时钟调节；FCI只摘要其中的状态节点。' },
    boundary: '汇率决定机制留给3.20，全球美元与跨境银行留给4.05–4.07；本节只建立测量所需的暴露映射。',
  },
  {
    id: 'component-passport', number: 5, label: 'Component Passport',
    title: '每个组件都要带着来源、经济原语、单位、期限、角色、时钟与缺失原因进入聚合。',
    paragraphs: [
      '组件护照至少记录component ID、经济原语、来源lesson/state/field、角色、lane、原始值与单位、名义/实际、价格/收益率、level/change、stock/flow、币种与quote convention、期限、频率、季调、observation/publication/revision/retrieval时钟、方向规则、主体暴露、变换、校准窗、缺失原因和measurement flag。保存原值很重要：一旦只剩z-score，后来无法判断当初是50bp利差变化还是20%股价下跌。',
      '角色字段阻止目标泄漏。贷款余额通常是quantity diagnostic或要预测的outcome；如果同窗口又把它当FCI输入，就可能用结果预测自身。总收益率、benchmark与spread还存在经济恒等式；同一原语通过三个字段进入并不等于三份证据。护照必须给每项一个redundancy group，说明choose-one、decompose、residualise（按预注册模型剔除已解释的重叠部分，但不是因果净化）还是factor。',
      '缺失绝不是零。某主体没有债券融资资格、某调查尚未发布、某市场休市和某系列永久停更，代表四种不同状态。可以输出partial vector（不完整但保留已知各维、缺失项和coverage的向量），也可以按预注册规则另建重估版本；但静默填零或重归一化会改变指数构成，必须产生composition-version break。canonical加权器默认只要缺一项就返回STOP/null；任何显式partial路径至少要交付missingDomains、原始/有效权重、renormalized标记与compositionVersion。',
    ],
    sourceIds: [3, 4, 8, 9, 17, 19, 33, 34],
    formula: { label: '护照最小式', expression: 'component = raw value + economic role + transform + direction + clock + scope + provenance', note: '只有数值而没有这些元数据的列，不具备跨时间或跨主体可比性。' },
    boundary: '数据护照在7.24成为全系统生产合同；3.13给出进入FCI前的最低版本。',
  },
  {
    id: 'level-change-horizon', number: 6, label: 'Level, Change, News & Impulse',
    title: '“当前有多紧”“这个月收紧多少”“相对预期出了什么新闻”“未来增长逆风多大”是四个不同对象。',
    paragraphs: [
      '状态型FCI通常把变量水平相对历史分布标准化，回答当前状态偏离自身历史平均多少；指数差分回答状态变化多少。市场surprise则要用公告前预期作基准，哪怕利率水平很高，只要决策符合预期，surprise也可能接近零。把这三者混用，会让“高利率”“突然加息”和“本月条件收紧”变成同一句话。',
      'FCI-G又是不同对象：它先计算七个金融变量的三个月变化，再用模型的动态乘数把当前和过去变化映射到未来一年实际GDP增长，保留1年或3年lookback。因此FCI-G的+1约指模型rule-of-thumb下100bp增长逆风，不是一个标准差，也不是普通FCI水平。过去的宽松仍可能在今天提供尾风，即使当期价格已开始收紧。',
      '选择level、change、spread或log-return要由机制决定。利率常用百分点差，股票和房价常用log change，信用可用all-in yield或相对匹配benchmark的spread；不同频率不能先随意平均再声称同一期限。每个target都要锁定输入变换与响应horizon。',
    ],
    sourceIds: [1, 2, 3, 8, 9, 25],
    formula: { label: '四对象', expression: 'state level; Δstate; news = realised − expected; growth impulse = ΣⱼΣᵢ βⱼ,ᵢ ΔXⱼ,t−i', note: '四者可以相关，但单位、信息集与因果身份不同。' },
    boundary: '政策surprise由3.05拥有；3.13保存其与状态变化的不同身份。',
  },
  {
    id: 'interest-rate-lane', number: 7, label: 'Interest-Rate Lane',
    title: '“利率”不是一条线：隔夜实施、预期短率、实际率、期限溢价与私人合同必须按期限和现金流匹配。',
    paragraphs: [
      '隔夜有效利率说明政策实施与极短融资，收益率曲线把未来短率预期、期限补偿和期限供求写入不同到期点，实际率还需要通胀预期与通胀风险分解。一个十年期项目若只看隔夜利率，会漏掉预期路径与期限风险；一笔三个月浮动贷款若直接使用十年收益率，又会错配重定价时钟。',
      '进入FCI时可选择一组期限节点、曲线因子或匹配合同的基准，但不能把同一曲线的十个收益率、level/slope/curvature与由它们计算的forward全部当独立证据。若目标是借款人的all-in cost，安全基准只是第一层，还要加信用、银行资金、费用和合同条款；若目标是市场状态，则不应把最终合同结果倒灌为纯安全率。',
      '利率上升通常收紧净借款人的现金流和贴现条件，但对净储蓄者可能增加利息收入，对银行息差的作用取决于资产负债重定价。方向因此要绑定主体和合同，不能把“所有利率越高越紧”当无条件映射。',
    ],
    sourceIds: [1, 8, 12, 25, 26],
    formula: { label: '匹配基准', expression: 'all-in financing rate = matched safe benchmark + credit/funding spread + fees/contract adjustments', note: '若总收益率已入指数，benchmark与spread不得再次作为独立贡献。' },
    boundary: '曲线与实际率分解回看3.07–3.08；本节只决定哪一条状态可进入特定融资条件。',
  },
  {
    id: 'credit-price-lane', number: 8, label: 'Credit-Price Lane',
    title: '信用总收益率、匹配基准、信用利差、预期损失与excess bond premium必须放在一张不重复的账本里。',
    paragraphs: [
      '公司债收益率同时包含安全期限基准和信用补偿；信用spread又含预期违约风险、债券特征、风险厌恶、中介风险承受、流动性与测量误差。Gilchrist–Zakrajšek先用违约风险与债券特征建立spread的模型预测部分，再把观察spread减去该预测部分定义为excess bond premium。EBP有重要预测信息，却仍不是天然的纯供给冲击。',
      '组件设计必须在“总项”与“分解项”之间二选一。若使用all-in corporate yield，就不要再独立加同期限Treasury和同一债券spread；若选择benchmark+spread，则把总收益率标记excluded-derived-overlap。相同原则适用于贷款：基准、银行资金楔子、预期损失、费用和条款各计一次。',
      'spread扩大可能来自借款人真实违约风险上升，也可能来自中介风险价格和流动性收紧。它可以描述融资价格变紧，甚至预测经济下行；但若研究“信用供给冲击”，必须再控制借款人需求/风险并建立外生变化或结构识别。',
    ],
    sourceIds: [8, 10, 16, 21, 22, 30],
    formula: { label: '不重复恒等式', expression: 'corporate all-in yield = matched safe benchmark + observed spread; observed spread = model-predicted default-risk/bond-characteristics component + EBP', note: 'EBP = observed spread − model-predicted component；它本身就是该模型残差，不能在式外再加一次residual。' },
    boundary: '银行贷款价格与供给边际由3.10提供；借款人风险和抵押反馈由3.11提供。',
  },
  {
    id: 'equity-wealth-lane', number: 9, label: 'Equity & Wealth Lane',
    title: '股票上涨通常沿融资、财富、抵押和中介资本指向宽松，但股价不是直接可观察的权益资本成本。',
    paragraphs: [
      '较高股价可以让企业用较少股份募集同额资金，提升Tobin’s q式投资激励，改善创始人和家庭净值，也可能提高金融中介持有资产的资本缓冲。股价下跌则反向压缩这些渠道。因此许多FCI把股票回报翻向：上涨贡献为负、下跌贡献为正。FCI-G也以负号把股票上涨映射为增长尾风。',
      '但市盈率倒数不是无条件的cost of equity。预期现金流、增长、风险溢价与回购都会影响价格；不同企业发行资格和股权依赖也不同。上市大企业能直接使用股票市场，小企业通常通过所有者净值、银行抵押或需求间接受影响。市场指数上涨不能直接代表每家企业融资成本同幅下降。',
      '股票变量还容易和波动率、信用spread、中介净值重复编码同一风险情绪。可以保留多个diagnostic，但构造scalar前要做经济重叠与统计相关两层审计；否则在风险抛售时同一原语被计算多次。',
    ],
    sourceIds: [1, 8, 12, 39, 49, 50],
    formula: { label: '典型方向', expression: 'higher equity price/return → aligned tightness contribution < 0 for an equity-sensitive borrower', note: '箭头依赖主体股权融资、抵押和中介渠道；不是全球统一弹性。' },
    boundary: '资产价格如何影响抵押与外部融资溢价回看3.11；这里仅建立组件方向和异质暴露。',
  },
  {
    id: 'fx-dollar-lane', number: 10, label: 'FX / Dollar Lane',
    title: '不存在主体无关的“美元收紧方向”：币种错配、贸易现金流、报价方式、对冲与期限共同决定符号。',
    paragraphs: [
      '对收入主要是本币、债务却是美元且未对冲的企业，美元升值会抬高本币债务服务和杠杆，通常指向收紧；对美元收入与美元债务匹配的出口商，净效应可能接近零；对依赖进口投入的企业，本币升值可能降低成本。即使研究美国主体，美元升值也同时影响出口竞争、进口价格和海外利润，符号不能只靠地理标签。',
      '护照必须保存base/quote currency、净外币债务、净外币收入、hedge ratio、套保期限和债务重定价。所谓“广义美元指数+5%”只是市场原始变化，只有乘以主体暴露映射后才成为tightness input。缺少暴露时输出方向未定义，而不是沿用其他文献的平均符号。',
      '全球证据显示美元、跨境信用、银行杠杆与新兴市场投资存在重要联系，但关系会随时期、融资结构和中介体系演化。VIX、美元指数或美国FCI中的任一个都不能单独替代全球金融周期。3.13只交付可比较的本地节点，4.05–4.07再识别全球共同因子。',
    ],
    sourceIds: [12, 14, 39, 43, 44, 45, 46, 47, 48],
    formula: { label: '主体净暴露', expression: 'FX condition contribution ≈ market FX move × (unhedged foreign-currency debt − matched foreign-currency income exposure)', note: '这是方向账本而非估计式；真实映射还需期限、非线性与会计口径。' },
    boundary: '3.20拥有汇率决定；4.05拥有全球美元融资；4.07拥有全球周期。',
  },
  {
    id: 'price-quantity-terms', number: 11, label: 'Price, Quantity & Non-price Terms',
    title: '融资菜单必须并列保存价格、批准、额度、期限、抵押与契约；任何单一平均价格都可能遗漏真正绑定的门。',
    paragraphs: [
      '一笔融资不只是利率。申请者先面对是否有资格、是否获批、额度占请求多少、期限多长、需要多少抵押、有哪些covenant与担保，最后才是基准、spread和费用组成的all-in price。银行可以维持报价不变却缩短期限、降低额度或提高抵押；市场发行也可能表现为spread看似可接受、但订单簿和承销容量不足。',
      '条件于“获批者”的平均贷款利率尤其容易产生选择偏差。若银行拒绝风险更高的申请，剩余获批者更安全，平均报价可能下降；对申请总体而言，融资可得性却明显收紧。观察到贷款量下降也不自动证明供给收紧，因为企业需求、提前偿还、核销和重分类都会改变余额。',
      'SLOOS有价值，正因为它把standards、terms与demand分题询问。但净比例只表示报告收紧的银行占比减报告放松的占比，不是强度、金额或批准概率。研究应把调查与合同/申请数据并列，而不是让调查净比例覆盖其他lane。',
    ],
    sourceIds: [8, 17, 18, 21, 22, 23, 24, 25],
    formula: { label: '融资菜单向量', expression: 'C_b,t = {all-in price, approval probability, approved/requested amount, maturity, collateral, covenants}', note: '花括号表示并列状态，不建议未经目标模型把不同单位直接求和。' },
    boundary: '价格、数量与条款的细粒度producer state来自3.10–3.12；3.13只做跨lane测量与聚合。',
  },
  {
    id: 'direction-standardisation', number: 12, label: 'Direction & Standardisation',
    title: '先把“正值代表收紧”的方向绑定主体，再用冻结校准窗标准化；z-score不是经济成本单位。',
    paragraphs: [
      '原始组件可能以百分点、基点、价格、回报、波动率、贷款量或调查净比例表示。常见做法是先选择经济变换gᵢ，并根据主体暴露确定方向sᵢ,b；随后使用vintage v下的原方向冻结均值与标准差，对gᵢ(xᵢ,t|v)做中心化和缩放，最后乘以sᵢ,b，使收紧统一映射为正。股票上涨在典型企业融资护照中通常翻成负号；利差扩大通常保留正号；美元必须先有暴露护照。',
      'z=2只表示变换后的组件高于冻结均值两个组件SD，不表示融资成本高2%、贷款量少2%或增长下降2%。如果组件厚尾、有结构断点、极小SD或大段缺失，均值/SD会失真；可以使用稳健尺度、分位数变换或保留原单位，但必须重新命名并版本化。',
      '即使每个输入都是z-score，Σwz也不天然等于综合指数自身的一个标准差。相关性使其方差为wᵀΣw；只有再按固定校准样本的综合波动缩放，才可把总数称为综合标准差。canonical未做这一步，所以一律称index points。',
    ],
    sourceIds: [3, 5, 8, 9, 31, 32],
    formula: { label: '核心测量式', expression: 'zᵇᵢ,t|v = sᵢ,b · [gᵢ(xᵢ,t|v) − μᵢ,v] / σᵢ,v; FCIᵇ_t|v = Σᵢ wᵇᵢ,v zᵇᵢ,t|v', note: 'b绑定主体，v绑定数据与模型vintage；先用原方向校准均值做中心化，再用s翻向；权重和方向都不是无条件常数。' },
    after: <DirectionStandardisationLab />,
    boundary: '本章canonical输入只是SYNTHETIC z-like scores，明确不是从真实样本估计出的z。',
  },
  {
    id: 'weighting-purpose', number: 13, label: 'Weighting Is a Question',
    title: '等权、PCA、动态因子、增长乘数与主体暴露权重分别回答不同问题；没有脱离用途的“正确权重”。',
    paragraphs: [
      '透明等类别权重适合教学和稳健基线，优点是含义清楚，缺点是未利用预测或协方差信息。PCA与动态因子寻找样本中共同方差最大的方向，适合状态压缩；它们的loading不是宏观影响。增长映射权重以未来活动或结构模型乘数为目标，适合回答增长逆风；主体暴露权重则根据融资资格、渠道、币种和合同，回答某类借款人实际面对什么。',
      '权重护照要保存method、purpose、target、target horizon、fit start/end、information cutoff、reestimation schedule、sign anchor、约束、不确定性和组件/经济块权重。若看完预测结果才挑权重，模型选择已使用未来结果；若每期重新估计却不给旧版回算，指数跳动会混合世界变化与模型变化。',
      '同一输入在不同权重下得到不同读数并不矛盾。真正错误的是把一种用途的数值拿去回答另一种问题，例如用PCA loading声称信用对GDP因果影响最大，或用美国增长权重衡量某个依赖银行且有美元错配的新兴市场企业。',
    ],
    sourceIds: [1, 3, 8, 9, 25, 26, 27, 28, 29, 30, 31],
    formula: { label: '用途索引', expression: 'FCIᵖ = Σᵢ wᵖᵢ zᵢ, where p ∈ {state, forecast, macro-impact, registered-agent}', note: '上标p改变estimand；数值不应脱离p横向排名。' },
    after: <WeightLensLab />,
    boundary: '选择权重是测量设计，不是通过构建测试后自动获得的经济发现。',
  },
  {
    id: 'redundancy-double-count', number: 14, label: 'Redundancy & Double Counting',
    title: '经济恒等式先去重，统计相关再分组；增加高度相关组件不会自动增加独立证据。',
    paragraphs: [
      '最清晰的重复来自恒等式：公司债总收益率等于匹配安全基准加信用spread和合同调整。如果总项与分解项都启用，同一价格被算两次。较隐蔽的重复来自共同原语：股票下跌、VIX上升、信用spread扩大和中介净值下降可能同时反映风险抛售；它们并非完全相同，却也不是四份独立信息。',
      '等组件法会让数据最多的经济块自然获得最大权重。把同一个信用指标复制三次，世界未变，naive平均却更紧。可先按经济block内部聚合，再在block之间给权重；也可choose-one、residualise或用factor，但每种处理都要保存训练窗与经济理由。相关系数高不是自动删除规则，低相关也不保证经济独立。',
      '协方差还影响总指数尺度。若两个组件高度正相关，Σwz的波动可能大于把它们当独立时的直觉；若分项互相抵消，scalar接近零也不等于条件平静。贡献ledger和相关/重叠图必须与总数一起发布。',
    ],
    sourceIds: [1, 3, 5, 8, 9, 10, 31, 32],
    formula: { label: '综合方差', expression: 'Var(FCI) = wᵀΣw; duplicated economic primitive → effective block weight rises under naive equal-component weighting', note: 'Σ描述样本协方差，不是因果网络；经济恒等式仍需先验审计。' },
    after: <DuplicateDetectorLab />,
    boundary: '跨资产相关图由7.10扩展；相关不等于传染路径。',
  },
  {
    id: 'realtime-vintage', number: 15, label: 'Real-time Vintage',
    title: '历史FCI必须写成FCI(t|v)：当时可见数据、当时normaliser与当时权重缺一不可。',
    paragraphs: [
      '一个经济观测有reference date，却常在之后才发布，并可能被多次修订；指数模型还会按计划重估均值、SD、相关矩阵和loading。研究者今天下载的current-vintage history因此不等于过去决策者看到的序列。NFCI历史会因新数据、修订和重新估权变化；季度贷款调查也必须按实际发布日期而非季度标签进入信息集。',
      '使用完整样本均值和SD计算旧日期，是最常见且隐蔽的泄漏。未来危机会抬高均值与波动，让当时异常偏紧的旧值在事后看起来中性甚至偏松；PCA和监督权重也会通过未来协方差与结果泄漏。伪实时回测必须冻结expanding或rolling规则、发布日期、训练窗、重估日程和embargo。',
      'vintage护照至少有observation、release、revision、retrieval和model estimation/effective五个时钟。ALFRED可以帮助重建某些系列的信息集，但不是每条FRED序列都有完整历史vintage；无法重建时，应明确标current-vintage replay，而不是声称严格PIT。',
    ],
    sourceIds: [4, 9, 19, 30, 33, 34],
    formula: { label: '伪实时约束', expression: 'every datum, μ, σ, Σ and w used in FCI(t|v) must have publication/effective time ≤ v', note: '原始观测日期早于v并不够；要检查何时发布和何时修订。' },
    after: <VintageMachineLab />,
    boundary: 'current-vintage historical replay、pseudo-real-time和strict point-in-time三种证据身份永久分栏。',
  },
  {
    id: 'component-contribution', number: 16, label: 'Contribution, Coverage & Uncertainty',
    title: '一个可解释的FCI必须同时交付总数、每项贡献、覆盖率、缺失处理和模型不确定性。',
    paragraphs: [
      '在线性加权中，组件贡献cᵢ,t=wᵢzᵢ,t，所有贡献相加才等于FCI。这个账本让读者区分“总数变紧是因为信用spread扩大”与“权重重估把信用块放大”，也能看见正负分项互相抵消。若页面只展示一条线，零附近读数可能被误解为所有条件都正常，实际上可能是利率大幅收紧与股票大幅宽松相抵。',
      '若综合指数还被重新标准化为自身一个SD，所有贡献必须同时除以同一个冻结尺度√(wᵀΣw)，否则贡献和不再闭合。非线性模型的贡献则依赖解释基准和顺序；Shapley/local explanation（围绕指定模型和基准分摊单个预测）也不是天然因果分解，必须保存方法、baseline和未解释残差。',
      'coverage要显示本期可用组件/经济块和原始权重份额。某项未发布时，把它当零会把“未知”误写成“中性”；按剩余权重重归一化又改变了指数构成。本章strict scalar函数在任何声明domain缺失或权重和不为1时直接STOP/null，并用fixture断言锁定；若另建partial-vector、区间或stale flag路径，必须预注册并保存missingDomains、原始/有效权重、renormalized与compositionVersion。不确定性还包括测量误差、模型权重、修订与结构断点，不能被一条小数位很多的指数掩盖。',
    ],
    sourceIds: [1, 3, 4, 8, 9, 28, 30],
    formula: { label: '贡献闭合', expression: 'cᵢ,t = wᵢzᵢ,t; Σᵢ cᵢ,t = FCIₜ; coverageₜ = Σ available original weights', note: '重归一化后必须另存composition version；缺失不是零。' },
    boundary: '贡献解释“按当前测量规则谁推动总数”，不自动解释经济变量为何变化。',
  },
  {
    id: 'aggregate-borrower-specific', number: 17, label: 'Aggregate vs Borrower-specific',
    title: '总体平均可以接近零，而银行依赖小企业仍明显收紧；真正绑定约束常藏在横截面分布里。',
    paragraphs: [
      '不同主体不仅融资资格和暴露权重不同，组件方向也可能不同。公开债券发行人更受安全曲线、信用spread和市场流动性影响，银行依赖小企业更受审批、额度与抵押影响，未对冲美元债务人更受汇率影响，家庭又因固定/浮动按揭和房产净值分化。因此应先按主体护照得到zᵇᵢ,t，再算FCI_b,t=Σw_b,i zᵇᵢ,t，最后按清楚的总体权重π_b,t聚合；不能先做全国平均，再假定它代表每个主体。',
      '为了单独看清“权重异质性”，本节C5刻意冻结同一套SYNTHETIC方向图，使三类主体在实验中满足zᵇᵢ,t=zᵢ,t，只改变w_b,i。它明确命名为weight-only heterogeneity，并为每类主体保存六项方向假设；这不是“主体特定方向天然相同”的现实主张。若FX等任一方向未知，完整主体FCI必须STOP。',
      '总体变化还可能纯粹来自构成。A组条件保持−1、B组保持+2，但权重从80/20变成20/80，总体就从−0.4变为+1.4。世界的组内状态没有改变，改变的是样本、暴露或申请者份额。研究必须同时报告固定权重反事实和当前权重结果，保存eligible population与退出/进入。',
      '均值也会遗漏尾部。少数融资受限企业可能承担就业和投资的边际调整，而大多数现金充足企业条件不变；信用spread和股票回报的横截面偏度、极端分位数及中介状态因此可含平均值之外的信息。生产输出至少应保留分位数、binding share、行业/规模/融资渠道分组和contribution distribution。',
    ],
    sourceIds: [8, 18, 39, 49, 50],
    formula: { label: '两层聚合', expression: 'FCI_b,t = Σᵢ w_b,i zᵇᵢ,t; aggregate_t = Σ_b π_b,t FCI_b,t', note: 'zᵇ保留主体特定方向；π变化会制造composition effect，必须与组内FCI变化分开。' },
    after: <BorrowerFinancingMenuLab />,
    boundary: 'canonical三类主体只是共享固定方向图下的SYNTHETIC权重反例，没有观察到真实方向、分位数或binding share。',
  },
  {
    id: 'prediction-target', number: 18, label: 'Prediction Target & Horizon',
    title: '“FCI能预测经济”只有在结果、期限、信息集、benchmark与损失函数被锁定后才是一项可检验命题。',
    paragraphs: [
      '预测未来一个季度GDP均值、未来四季度累计增长、衰退概率和5%增长分位数是不同target。金融价格的短期变化可能迅速进入增长预期，信用存量与杠杆却在更长时期塑造下尾；同一FCI对不同horizon和统计量可有不同符号与强度。先选结果再观察哪个期限最好，会产生多重选择偏误。',
      '严格评估要保存forecast origin、当时可见vintage、训练窗、重估规则、rolling或expanding设计、embargo（训练与测试之间防止相邻标签/发布时间泄漏的隔离窗）、benchmark和loss function。时间序列随机切分会把未来状态泄漏进训练；只报告危机样本内R²也无法说明常态预测力。至少与历史均值、简单自回归和单组件基准比较，并报告危机期与非危机期结果。',
      '预测身份还要限定窗口。某模型在1990–2019伪实时样本外胜出，只能称在该目标、损失函数和窗口上validated；制度、成分和数据发布改变后要重新检验。预测失败不证明金融机制不存在，预测成功也不证明指数是结构冲击。',
    ],
    sourceIds: [8, 9, 11, 15, 30, 31, 38, 40, 41],
    formula: { label: '预测合同', expression: 'forecast target = Y_(t+h) statistic | information available at forecast origin v; score against pre-registered benchmark and loss', note: 'h、statistic、v与loss任一改变都形成新的预测任务。' },
    boundary: 'Chapter 7拥有完整研究设计、伪实时回测与模型治理；3.13只规定FCI作为输入的最低证据合同。',
  },
  {
    id: 'prediction-not-causation', number: 19, label: 'Prediction Is Not Causation',
    title: 'FCI可以领先衰退，却仍不能回答“人为把指数提高一个点，增长会下降多少”。',
    paragraphs: [
      '资产价格是前瞻性的：坏增长消息会同时压低股票、扩大信用spread并预示未来产出下降。央行也会对这些消息和金融条件作反应。于是FCI与未来增长之间可以有稳定预测关系，即使不存在可解释为do(FCI)的单一处理。一个综合指数由多种内生变量组成，其“一点变化”也没有唯一可操作含义。',
      '因果研究必须定义具体处理：例如外生货币政策冲击、银行供给创新或全球美元融资冲击；再说明支持集、排除共同消息、处理前暴露、时间顺序和推断层级。即使每一道必要门都声明通过，也只能进入identified-candidate（必要设计门闭合、尚待估计与审计）层级；真实identified还需要估计、标准误、稳健性和证据审计。',
      '研究政策总效应时，FCI组件常是政策传导的中介。回归中把利差、股票和汇率一并控制，可能切断希望估计的政策路径，形成post-treatment bias；若目标是直接效应则需要明确中介estimand。预测模型可以自由利用有用信息，因果模型却必须尊重变量在处理链中的位置。',
    ],
    sourceIds: [1, 8, 11, 16, 21, 22, 32, 33, 38],
    formula: { label: '两种问题', expression: 'E[Y_(t+h) | FCI_t] is predictive; E[Y(do(shock=s)) − Y(do(shock=s₀))] is causal', note: 'FCI通常不是可直接干预且含义唯一的处理。' },
    after: <ForecastCausalGateLab />,
    boundary: '任何“导致”“效应”“乘数”表述都要路由独立的causal target与识别状态。',
  },
  {
    id: 'index-families', number: 20, label: 'Index Families',
    title: '状态型、宏观调整型、增长映射型、压力型与主体暴露型指数的零点和单位都不相同。',
    paragraphs: [
      'NFCI式状态型指数用大量金融指标的共同因子回答相对自身历史平均有多紧；零通常是样本平均。ANFCI把金融指标中与当前活动、失业和通胀相匹配的部分调整掉，零是“与宏观状态相符”的历史基准，不是纯金融结构冲击，也不是因果残差。',
      'FCI-G和部分商业/OECD指数使用宏观模型或经验响应权重，把金融变量变化映射为未来增长逆风/尾风；零表示所含变量的映射贡献相加为零。压力指数也没有统一零点：CISS位于0到1标度，0是极低系统压力的下界而非历史平均；STLFSI4以18个周频市场序列标准化，0表示历史平均压力，正负分别高于或低于平均；OFR FSI又有自己的标准化与贡献口径。它们都更强调波动、融资压力和跨市场共振。主体暴露型指数则服务特定借款人，零取决于其校准窗和权重。',
      '同一天这些指数分歧可能提供信息：短暂市场波动可令压力/统计因子尖峰，而有滞后与持续性要求的增长冲量较慢；贷款标准可显著收紧，却被只含市场价格的FCI-G遗漏。比较前要检查对象、组件、方向、权重、lookback、vintage和输出尺度，绝不能把纵轴叠在一起造成同单位错觉。',
    ],
    sourceIds: [1, 3, 4, 6, 8, 20, 23, 24, 25, 35, 36, 37],
    formula: { label: '同名不同对象', expression: 'state deviation; macro-adjusted state; growth impulse; systemic stress; agent-specific effective conditions', note: '这些对象可以共同使用同一原始变量，却不能共享零点与结论。' },
    boundary: '页面真实图只展示FCI-G自身，不把NFCI、ANFCI、CISS、STLFSI4或OFR FSI重新标准化到同一纵轴；CISS与平均零标准化压力指标尤其不能共享“零”的解释。',
  },
  {
    id: 'validation-protocol', number: 21, label: 'Validation Protocol',
    title: '一个FCI必须同时通过测量、稳定性、伪实时预测与失败模式测试，不能靠漂亮历史图自证有效。',
    paragraphs: [
      '测量层先检查方向和单位、贡献和式、权重总和、覆盖率、经济恒等式去重、缺失处理、符号锚和版本断点。随后做权重敏感性、删除单组件、添加重复项、滚动相关、结构断点和分组暴露测试。若复制同一指标就大幅改变指数，或缺失后方向反转却无break，构造尚不稳健。',
      '预测层必须用publication-as-of信息、时间有序split、固定目标与benchmark做伪实时OOS，并分危机/非危机、期限和损失函数报告。动态因子和PCA的normaliser、loading也要按训练时点重估；不能只把原数据截断，却保留完整样本权重。多模型比较要记录选择过程，防止最终只展示最佳曲线。',
      '最后做语义失败测试：政策率宽松但总体指数收紧、总数相同但贡献结构不同、获批报价下降但批准/额度收紧、美元对两类主体异号、stress低但杠杆脆弱性高。能处理这些反例的系统，才可能成为可用的world-model接口；测试通过只授予相应层级，不会自动升级因果身份。',
    ],
    sourceIds: [3, 4, 8, 9, 15, 19, 26, 28, 30, 31, 34],
    formula: { label: '四层验证', expression: 'arithmetic → semantic contract → pseudo-real-time OOS → causal design (separate)', note: '后一层不能由前一层自动推出；每层失败都应保留证据。' },
    boundary: '本页底层audit覆盖算术与语义契约；predictionStatus=not-estimated，causalStatus=not-claimed。',
  },
  {
    id: 'stress-vulnerability', number: 22, label: 'Conditions, Stress & Vulnerability',
    title: '宽松条件、低压力与低脆弱性可以同时不同步：价格状态、尾部失灵和风险存量位于不同时间尺度。',
    paragraphs: [
      '金融条件描述融资价格、可得性和资产负债表支持，金融压力描述市场功能受损和跨市场共振，脆弱性描述杠杆、期限错配、集中度、外币错配与赎回结构等存量。宽松条件能刺激借贷和风险承担，使当前压力下降却让未来脆弱性上升；危机爆发时，压力急升又会快速收紧条件。',
      '这种时间尺度差异解释为什么“压力指数很低”不是安全证明。较慢积累的资产负债表脆弱性可能在波动很低时被风险模型低估，直到价格冲击、保证金和资金撤回形成正反馈。反过来，短暂波动尖峰也不必意味着广泛借款人长期融资容量永久收缩。',
      '测量系统应把state、stress与vulnerability三栏保存，再在下游建立有向反馈。CISS把时变跨市场相关纳入系统压力，是重要方法；但它没有覆盖所有贷款标准、信用数量或主体融资菜单。任何一栏都不能替另外两栏做结论。',
    ],
    sourceIds: [6, 12, 20, 35, 36, 37, 40],
    formula: { label: '多尺度链', expression: 'easy conditions → leverage/risk accumulation → vulnerability; trigger → stress → tighter conditions → deleveraging', note: '这是候选反馈结构；具体阈值、时滞与因果效应需下游识别。' },
    boundary: '3.13交付条件状态；3.14交付信用反馈；7.11–7.13交付赎回、保证金、火售与网络放大。',
  },
  {
    id: 'claim-ladder', number: 23, label: 'Targets & Evidence Ladders',
    title: '状态、贡献、融资菜单、预测与因果反应必须各自定义target，并在测量、预测、因果三条证据轴上独立升级。',
    paragraphs: [
      'state-index target描述FCI(t|v)；component-contribution描述给定规则下wᵢzᵢ；borrower-menu保留价格、批准、额度和条款分布；mean/downside forecast定义未来活动统计量；causal-response则定义具体冲击的潜在结果差。它们可以沿同一机制链相连，却不共享分母、单位、期限或反事实。',
      '证据状态不能压成一个“已验证”标签。measurement可以是synthetic-mechanically-audited、descriptive或empirically-constructed；prediction可以not-estimated、in-sample-only、oos-candidate或oos-validated；causal可以not-claimed、identified-candidate或identified。本页canonical的合成算例在算术上闭合，但prediction为not-estimated、causal为not-claimed。',
      '真实FCI-G图属于observed official snapshot，却只在其模型和数据护照下描述增长尾风/逆风；它不进入SYNTHETIC canonical score。构建测试、真实数据来源和经济证据因而三分：测试证明代码按声明规则运行，来源证明数值可追溯，研究设计才决定预测或因果结论能走多远。',
    ],
    sourceIds: [1, 2, 8, 11, 19, 21, 22, 38, 40, 41],
    formula: { label: '三轴证据', expression: 'evidence = (measurement status, prediction status, causal status), never one scalar badge', note: '每个target都要单独保存estimate、uncertainty、sample与clock；null比省略更诚实。' },
    boundary: 'Chapter 7会把target registry、识别门和OOS记录扩展成研究协议。',
  },
  {
    id: 'pca-factor', number: 24, label: 'PCA & Dynamic Factor',
    title: 'PCA寻找最大共同方差，动态因子处理时间与缺失；二者都不会自动告诉你经济方向或因果重要性。',
    paragraphs: [
      'PCA把标准化面板投影到解释样本方差最多的正交方向，适合减少维度。第一主成分的正负号在数学上任意，必须用信用spread、波动率等锚定“正值=收紧”；loading会随样本、组件和标准化改变。最大方差也可能来自最波动或数据最多的市场，不代表对家庭、企业或GDP最重要。',
      '动态因子通过状态空间、Kalman filter/smoother等处理混频、ragged edge和测量噪声，可以在新数据到达时更新潜在状态。但filter使用当时信息，smoother利用未来观测；若用平滑历史做实时回测，会泄漏未来。组件发布延迟和参数重估也要按vintage重演。',
      '统计因子仍需经济护照：组件角色、去重、符号锚、训练窗、因子数、旋转/归一化和不确定性。因子稳定性差时可以保留多因子向量或区间，而不是强迫输出唯一scalar。',
    ],
    sourceIds: [3, 5, 9, 16, 17, 28, 31, 32, 33],
    formula: { label: '静态因子表示', expression: 'z_t = Λ f_t + e_t; PCA chooses f to explain covariance, not causal impact', note: 'Λ的符号和尺度需要规范化；动态模型还要区分filter与smoother信息集。' },
    boundary: 'PCA/DFM是weighting method，不是对政策冲击或主体有效条件的默认答案。',
  },
  {
    id: 'fci-g', number: 25, label: 'Outcome-weighted FCI / FCI-G',
    title: '增长映射型FCI把变化与滞后翻译成未来活动逆风；它回答的是“影响镜头”，不是历史状态z-score。',
    paragraphs: [
      'FCI-G使用联邦基金率、十年Treasury、三十年按揭率、BBB收益率、股票、房价和广义美元七项。利率用相邻三个月日均水平差，股票和房价用100倍三个月log difference；美元则先分别计算相邻两个三个月窗口的日均美元指数水平，再取100×两者的log difference，而不是用两个端点做普通回报。随后模型用对未来一年GDP增长的动态乘数累积1年或3年lookback贡献。',
      '正值表示增长逆风、负值表示尾风；+1约对应模型rule-of-thumb下未来一年增长100bp拖累。官方方法明确把金融变量变化“当作”外生来做映射，却同时说明它们实际上由宏观、政策等因素内生决定，也明确遗漏贷款标准与条款。因此FCI-G既不是GDP预测本身，也不是政策冲击或完整金融条件。',
      '本页官方图固定2026-09-11取回的baseline三年回看CSV，展示2020年以来季度末和最新月度观测及三个日期的七项贡献。最新2026-07-31为−0.877331pp，股票贡献−0.668908pp绝对值最大；这只能解释为该模型下的尾风快照。数据是可修订研究产品，使用前必须刷新并保留hash。',
    ],
    sourceIds: [1, 2, 23, 25, 38],
    formula: { label: 'FCI-G', expression: 'FCI-G_t = Σ_(j=1..7) Σ_(i=0..T−1) (β^j_(4+i) − β^j_i) ΔX^j_(t−i)', note: 'T为lookback季度数；β来自模型响应而非PCA loading。' },
    boundary: 'FCI-G真实图与SYNTHETIC canonical状态物理分离，禁止混算或用同一纵轴伪装可比。',
  },
  {
    id: 'mixed-frequency-missingness', number: 26, label: 'Mixed Frequency & Missingness',
    title: '日频市场价、周频状态、月频信用和季度调查形成ragged edge；前填不是无成本的“对齐”。',
    paragraphs: [
      '金融市场价格可以日内更新，银行余额常周/月发布，贷款调查每季度收集并在特定日发布，房价还可能延迟并修订。月末时，最新市场价格是当天信息，最新调查却描述过去三个月并在稍后公布；把季度值向每一天前填，会让未来发布结果提前进入历史。',
      '动态因子与nowcast可以在不同数据到达时更新状态，但必须按release calendar构造ragged edge。stale值可以保留并标龄，也可以让模型预测当前值；两者都不等于已观察。市场休市、系列延迟、主体无资格与数据质量失败还要分不同missing reason。',
      '频率转换也要尊重stock/flow。季度贷款流量可按期内求和，月末余额不能简单求和；利率日均与月末点值含义不同。任何插值、聚合、季调与revision都应成为component passport的一部分，并在构成变化时触发版本记录。',
    ],
    sourceIds: [1, 2, 3, 4, 8, 9, 17, 19, 32, 33, 34],
    formula: { label: '可用性门', expression: 'usable at v only if publication time ≤ v; stale/nowcast/observed are separate states', note: 'reference date早于v不代表数值在v已经可知。' },
    boundary: '完整混频nowcast由Chapter 7实现；本页要求先保存release-aware数据护照。',
  },
  {
    id: 'cross-country-currency', number: 27, label: 'Cross-country & State Dependence',
    title: '跨国比较必须分离本地金融结构、全球共同因子和主体货币错配；相同FCI在不同状态也可产生不同响应。',
    paragraphs: [
      '银行主导与市场主导经济体、固定与浮动按揭、资本项目开放度、外币债务和本地货币可信度不同，同一利率、股票或美元变化不会产生相同有效条件。跨国FCI若强行使用共同权重，可能把结构差异误写成松紧差异；完全用本地权重又可能失去横向可比性。应同时报告共同规范化结果、本地暴露结果和可比性flag。',
      '全球共同成分确实影响多国资产价格和资本流动，但研究显示其解释份额依变量、国家和时期而变。全球与国内周期也有不同时间尺度。一个国家FCI或多市场同涨同跌不足以识别global financial cycle；需要连接美国Treasury、美元融资、全球银行、中介杠杆和已识别冲击。',
      '响应还会随状态非线性：当杠杆高、市场深度低或银行资本靠近约束时，同一+1 index point可能比平静期带来更大下尾风险。教学C7用两个SYNTHETIC β展示这一点，不声称估计现实阈值或结构参数。',
    ],
    sourceIds: [12, 13, 14, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48],
    formula: { label: '分层状态', expression: 'local effective conditions = global candidate factor + domestic residual + agent/currency exposure mapping', note: '这是研究分解的组织式，不保证三项天然可识别或线性可加。' },
    after: <StateDependenceLab />,
    boundary: '全球共同因子的正式所有权在4.07；本节只提供带法域、币种与vintage的本地输入。',
  },
  {
    id: 'governance-revision', number: 28, label: 'Governance, Revision & Publication',
    title: '指数更新不仅是“加一行数据”：成分替换、权重重估与历史修订都要有版本、旧版回算和变更日志。',
    paragraphs: [
      '生产指数需要明确data owner、method owner、reviewer与release authority。每次发布保存原始文件hash、来源URL、retrieved-at、组件vintage、代码版本、权重版本和审计结果；若供应商停更、市场基准迁移或调查问题改变，不能悄悄换列后继续同一历史。',
      '成分替换通常有三种产物：旧方法截至断点的as-published系列、新方法对历史的回算系列，以及桥接期的重叠比较。三者回答不同问题。实时监控可以采用最新方法，但历史绩效要避免把新方法回填到旧决策时点；研究文档应报告哪一条用于生产、哪一条用于比较。',
      '发布还要声明支持与不支持边界。NFCI历史会修订，FCI-G是可能延迟、修订或停更的研究产品，SLOOS净比例不是金额；这些不是脚注装饰，而是防止用户把测量结果升级为政策或交易结论的核心控制。',
    ],
    sourceIds: [1, 2, 3, 4, 17, 19, 28, 30, 34, 37, 48],
    formula: { label: '发布身份', expression: 'release artifact = data vintage + method version + code version + component ledger + validation report', note: '任何一项变化都可能形成新compositionVersion或comparability break。' },
    boundary: '本地教材固定来源快照只用于可复现教学；研究或生产使用前必须按数据护照刷新。',
  },
  {
    id: 'interfaces', number: 29, label: 'Downstream Interfaces',
    title: '3.13的合格输出是一份可路由的多维状态与证据合同，而不是一个脱离来源和主体的scalar。',
    paragraphs: [
      '给3.14的payload包括lane level/change、主体条件、融资price/access/terms分布、组件贡献、信用stock/flow diagnostics、银行/借款人初始分布、权重、coverage和vintage。3.14再把这些状态接到新信用、杠杆、净值、损失和下一期条件，不能把3.13的指数水平本身命名为credit cycle。',
      '给4.07的payload保留法域、reporting/base currency、本地组件向量、FX暴露/对冲、外部融资依赖、候选global/local decomposition及每项发布时间。4.07还要接4.04美国Treasury、4.05全球美元和4.06全球银行，才能研究共同因子；本页不以一国FCI替代全球周期。',
      '给Chapter 7的payload包括重叠图、版本化权重、状态不确定性、五个target、三轴证据、数据护照、训练窗、reestimation schedule、embargo与OOS记录。若要估计shock→FCI，必须新建独立causal estimand，不能把descriptive composite直接改名为处理。',
    ],
    sourceIds: [8, 12, 14, 39, 40, 42, 48, 49, 50],
    formula: { label: '生产者承诺', expression: 'vector + distribution + contribution ledger + scope + vintage + evidence axes + boundary routes', note: 'scalar可作为附加视图，但不得成为唯一输出。' },
    boundary: '下一节3.14接收本页状态并加入动态反馈；本页不提前声称周期闭合。',
  },
];

const checks = [
  { question: 'FCI究竟观察到什么？', answer: '它不是天然可观察的自然量，而是对声明主体、用途、法域、币种、期限与vintage下融资状态的测量结果。', sourceIds: [3, 8] },
  { question: '为什么“正值代表收紧”只是一项约定？', answer: '原始变量方向取决于主体和合同；股票上涨常对企业融资宽松，美元升值对未对冲美元债务人收紧、对收入债务匹配者却可能接近中性。', sourceIds: [1, 46] },
  { question: '组件z=2是否表示融资成本增加2%？', answer: '不是；它表示变换后变量高于冻结校准均值两个组件标准差，单位已不是百分比。', sourceIds: [3, 9] },
  { question: '两项都移动50bp，为什么贡献仍可能不同？', answer: '各自的历史SD、方向、期限和权重不同；同样原始变化不等于同样异常度或经济影响。', sourceIds: [8, 9] },
  { question: '为什么加权z之和不天然是综合指数一个标准差？', answer: '因为总方差为wᵀΣw，依赖组件相关性；只有按冻结综合波动再次缩放，才有该单位。', sourceIds: [31, 32] },
  { question: '权重有没有唯一正确答案？', answer: '没有。等权、统计因子、增长响应与主体暴露分别回答状态、方差、宏观映射和个体有效条件。', sourceIds: [8, 26, 27] },
  { question: 'PCA第一主成分为什么仍要定向？', answer: '主成分正负号数学上任意，最大方差方向也没有天然的“收紧”或经济因果含义。', sourceIds: [31, 32] },
  { question: '复制同一信用指标为什么会改变等组件FCI？', answer: '组件数决定隐含权重；重复项让信用经济块占更多份额，却没有新增独立信息。', sourceIds: [5, 8] },
  { question: '贡献表至少应该显示哪些字段？', answer: '原值、变换、方向、aligned z、权重、wz贡献、coverage、vintage与总和；缺失和模型断点也要显式。', sourceIds: [1, 3, 4] },
  { question: '为什么不能用今天的均值和SD重算并冒充过去的实时FCI？', answer: '未来危机和修订改变normaliser，可能反转旧日期标签；严格回测只能用当时已发布数据与可估权重。', sourceIds: [4, 9, 19] },
  { question: '完整vintage护照有哪些时钟？', answer: 'observation、release、revision、retrieval以及model estimation/effective time；参考期早不代表当时已经可知。', sourceIds: [4, 19] },
  { question: '贷款量下降能证明信用供给收紧吗？', answer: '不能；需求、偿还、核销和重分类也会减量，需要申请或需求反事实。', sourceIds: [17, 21, 22] },
  { question: '获批者平均利率下降为何可能与信贷收紧并存？', answer: '银行拒绝高风险申请后，存活获批样本更安全；批准率、额度和抵押仍可明显收紧。', sourceIds: [17, 21] },
  { question: '总体FCI为什么不能代表每个借款人？', answer: '融资资格、银行/市场依赖、币种、期限、对冲和真正绑定约束不同，必须保留主体权重与分布。', sourceIds: [39, 49, 50] },
  { question: '降息与总体金融条件收紧能否同时发生？', answer: '可以。央行可能在信用、股票和美元已经恶化时反应，政策率只是一个分项。', sourceIds: [1, 16] },
  { question: '有预测力为何不等于因果？', answer: '共同消息、反向因果和内生政策反应都可制造FCI与未来增长的关系；因果还需具体处理与识别。', sourceIds: [11, 16, 32] },
  { question: '金融条件、压力与脆弱性如何区分？', answer: '条件是广义融资状态，压力是尾部市场失灵和共振，脆弱性是杠杆、错配等慢变量存量；三者可不同步。', sourceIds: [6, 20, 37] },
  { question: '面对“FCI上升导致衰退”应先问什么？', answer: '先问对象、组件、方向、权重、vintage、零点、预测期限、具体处理、外生性、支持集和推断，再决定这句话最多是描述、预测还是因果。', sourceIds: [8, 11, 30] },
] as const;

const glossary = [
  ['Financial conditions', '某主体在特定时点面对的融资价格、可得性、条款和资产负债表支持', '单一自然量或政策立场', '§02–04'],
  ['Financing menu', '价格、批准、额度、期限、抵押与契约的并列向量', '一条平均贷款利率', '§11'],
  ['Scalar', '把多维状态压缩成的一个数字', '底层向量、分布或自然真值', '§01–02/16'],
  ['Partial vector', '缺项时仍保留已知各维、缺失列表和覆盖率的输出', '把缺失填零或静默重归一化后的完整指数', '§01/05/16'],
  ['Normaliser', '用冻结均值、SD或协方差把原值映射到可比尺度的规则', '可使用未来样本的无时间版本工具', '§01/12/15'],
  ['Estimand', '为谁、比较什么状态或处理、针对哪个结果和期限的精确定义', '先看结果后挑选的宽泛问题', '§01/13/18–19'],
  ['Embargo', '训练与测试之间预留的时间隔离窗', '足以替代publication-as-of和vintage审计的万能防漏措施', '§01/18/21'],
  ['Residualise', '按预注册模型剔除已由另一原语解释的重叠部分', '自动获得外生冲击或因果净化', '§01/05/14'],
  ['Shapley / local explanation', '围绕指定模型、样本与基准分摊单个预测的解释方法', '结构成因或政策因果贡献', '§01/16'],
  ['Component', '带经济原语、角色、单位和时钟的输入', '没有护照的任意数据列', '§05'],
  ['Raw unit', '基点、百分点、价格、回报、金额或净比例等原始尺度', 'z-score或index points', '§05'],
  ['Transformation', '把原值转成level、change、spread或log-return的规则', '方向权重或因果模型', '§06'],
  ['Level', '变量在某时点的状态', '相邻期变化或公告surprise', '§06'],
  ['Impulse', '当前与过去变化经动态乘数映射到目标的累计贡献', '普通状态水平', '§06/25'],
  ['Direction alignment', '按主体把收紧统一映射为正的符号规则', '所有法域的自然符号', '§12'],
  ['Borrower-specific sign', '由币种、收入、债务、合同与对冲决定的方向', '美元涨跌的统一含义', '§10/12'],
  ['Z-score', '相对冻结校准均值和SD的位置', '经济成本百分比或因果强度', '§12'],
  ['Calibration window', '估计normaliser与统计权重的固定样本窗', '任意完整历史', '§12/15'],
  ['Rolling window', '固定长度、随时点前移的训练窗', '使用全部未来数据的窗口', '§15'],
  ['Expanding window', '只向过去扩展且不引入未来数据的训练窗', 'full-sample hindsight', '§15'],
  ['Vintage', '某时点可得的数据与模型版本集合', '观测参考日期本身', '§15'],
  ['Observation time', '经济活动或价格所对应的参考时点', '发布时间', '§15/26'],
  ['Release time', '该数值首次向使用者可见的时点', '后来修订时点', '§15/26'],
  ['Revision time', '历史值被更新的时点', '原经济事件时间', '§15'],
  ['Retrieval time', '研究者实际取回文件的时点', '来源声称的最新观测期', '§15/28'],
  ['Weight', '为声明用途把组件映射进汇总的系数', '客观或因果重要性', '§13'],
  ['Component contribution', '在线性指数中wᵢzᵢ的分项', '变量变化的结构成因', '§16'],
  ['Block weight', '一个经济类别在总指数中的合计权重', '该类别内原始列数', '§14'],
  ['Correlation', '样本中的共同运动', '经济恒等式、传染或因果链', '§14'],
  ['Redundant signal', '重复或高度重叠地编码同一经济原语的输入', '任何高相关但独立的机制', '§14'],
  ['Composite variance', 'wᵀΣw给出的线性汇总方差', '组件方差的简单平均', '§12/14'],
  ['PCA loading', '最大化样本共同方差投影中的载荷', '宏观乘数或政策弹性', '§24'],
  ['Dynamic factor', '在状态空间中随时间更新的潜在共同状态', '结构金融冲击', '§24'],
  ['Model-based weight', '由声明模型对目标的响应产生的权重', '统计loading或无条件因果效应', '§13/25'],
  ['Price margin', '利率、spread和费用等融资价格边际', '批准、额度或抵押', '§11'],
  ['Quantity margin', '获批金额、提款、发行或余额等数量边际', '纯信用供给', '§11'],
  ['Non-price terms', '期限、抵押、担保、haircut与covenant', '可直接相加的百分点成本', '§11'],
  ['Conditional offer rate', '仅在获得或接受要约样本中观察的价格', '所有申请者可得价格', '§11'],
  ['Approval probability', '预定义合格申请中获批的比例或模型概率', 'SLOOS净比例', '§11/23'],
  ['Aggregate FCI', '按声明群体权重聚合的状态', '每个主体共同处境', '§17'],
  ['Borrower-specific FCI', '按主体暴露权重得到的有效条件摘要', '无需保存底层融资菜单的万能数', '§17'],
  ['Composition effect', '总体因群体权重变化而变、组内状态不变的部分', '组内条件变化', '§17'],
  ['Financial stress index', '聚焦波动、流动性失灵和跨市场共振的指标', '普通时期完整FCI', '§20/22'],
  ['Policy stance', '政策相对目标和经济状态的取向概念', 'FCI零点或水平', '§03'],
  ['Predictive signal', '在声明信息集和OOS窗口中帮助预测目标的变量', '因果处理', '§18–19'],
  ['Pseudo real-time', '用历史可得vintage与当时可估参数重演预测', '今天数据截断后的回放', '§15/21'],
  ['Out-of-sample', '模型选择与估计之外的时间有序评估', '随机切分或危机样本内拟合', '§18/21'],
  ['Causal estimand', '对具体可定义处理与支持集的潜在结果差', 'FCI预测系数', '§19/23'],
  ['Post-treatment control', '位于处理之后且可能切断目标路径的控制变量', '无害的额外解释变量', '§19'],
  ['Identified-candidate', '必要设计门声明闭合、尚待估计与审计的候选身份', '已经identified', '§19/23'],
] as const;

const contractInvariants = [
  '先注册agent、use、jurisdiction、currency、horizon、as-of与information cutoff；任一关键scope缺失时composite为null。',
  '每个组件保存原值、单位、role、lane、变换、方向、频率、五个时钟、来源与measurement flag；z-score不能覆盖原值。',
  '正值统一表示对注册主体收紧，且每项保存zᵇᵢ主体方向护照；FX缺quote convention、净债务/收入或hedge ratio时方向未定义并STOP。',
  'level、change、surprise与growth impulse永久分栏；状态型FCI与FCI-G不共享纵轴或零点。',
  '公司债总收益率与matched benchmark/spread只能启用一层；derived overlap与高相关分别审计。',
  'price、approval、amount、maturity、collateral和covenants先作为向量发布；quantity不自动等于availability或供给。',
  '缺失永不填零；strict scalar默认STOP/null。另建partial vector、stale、nowcast或重归一化路径时必须保存missingDomains、原始/有效权重、renormalized与compositionVersion，构成改变产生comparability break。',
  '历史分数的data、μ、σ、Σ与weights发布时间或生效时间均不得晚于information cutoff。',
  '组件z的加权和若未除以固定√(wᵀΣw)，统一称index points而非综合标准差。',
  '权重绑定purpose、target、horizon、fit window与reestimation schedule；PCA loading不是经济或因果重要性。',
  '总数始终伴随贡献、coverage、主体分布与底层lane；scalar不得成为唯一输出。',
  'measurement、prediction与causal三轴独立；算术通过、真实来源或OOS成功均不能自动授予因果身份。',
  'SYNTHETIC canonical、官方FCI-G快照和真实研究估计物理分栏；不得混算或换名。',
  '3.13只交付时点状态；信用反馈、全球共同因子、压力网络和政策识别分别路由3.14、4.07与Chapter 7。',
] as const;

const dynamicRefreshChecklist = [
  { source: 'Fed FCI-G', refresh: '下载baseline monthly 3-year CSV和definition，保存网页更新时间、观测首末期、行数、字段、原文件hash与retrieved-at。', use: '增长尾风/逆风及七项贡献；不是政策冲击、完整FCI或确定GDP预测。', sourceIds: [1, 2] },
  { source: 'Chicago Fed NFCI / ANFCI', refresh: '保存周五observation、周三release、105项现行组件、历史修订、权重重估和下载hash；需要PIT时逐vintage重建。', use: '状态型与宏观调整状态型指数；零不是政策中性，ANFCI不是因果金融冲击。', sourceIds: [3, 4, 5] },
  { source: 'Fed SLOOS', refresh: '保存question ID、银行/贷款类别、有效回答分母、回顾窗口、调查与发布日期、权重及问卷版本。', use: 'standards、terms与demand方向广度；净比例不是金额、强度或已识别供给。', sourceIds: [17, 18, 21, 22] },
  { source: 'Credit spread / EBP', refresh: '保存债券样本、benchmark匹配、发行人风险模型、观测/月度发布日期、历史修订和数据说明。', use: '信用价格与预测信息；raw spread和EBP都不是天然纯供给冲击。', sourceIds: [10] },
  { source: 'Stress indexes', refresh: '逐产品保存组件、频率、零点、相关结构、基准替换与版本断点；CISS的0–1下界和STLFSI4的历史平均零点分栏。', use: '市场压力与系统共振；不替代融资菜单、普通条件或脆弱性存量，也不跨产品共享纵轴。', sourceIds: [20, 35, 36, 37] },
  { source: 'BIS global liquidity / dollar', refresh: '保存币种、借款人部门、银行/债券渠道、汇率/断点调整、季度vintage与方法版本。', use: '全球外币信用数量和美元暴露背景；存量不是同期条件或外生供给。', sourceIds: [43, 44, 45, 46, 47, 48] },
] as const;

const interfaces = [
  { name: '3.06 → 3.13 · Money-market implementation', payload: 'effective overnight rate、secured/unsecured与repo spread、rate dispersion、target error、timestamps。', guardrail: '隔夜实施结果不是政策立场或冲击；同一原语不能与曲线重复。' },
  { name: '3.07 → 3.13 · Yield curve', payload: 'zero/par yields、level/slope/curvature、term-premium estimate、decomposition uncertainty与timestamps。', guardrail: '节点、因子和由其推导的forward不能全当独立贡献。' },
  { name: '3.08 → 3.13 · Real rates & valuation', payload: 'nominal curve、model real-risk-free state、claim-specific premium、valuation state与scope。', guardrail: '名义/实际、现金流与风险溢价分栏，不能造普适实际贴现率。' },
  { name: '3.09–3.12 → 3.13 · Intermediary and borrower', payload: 'funding/capacity、loan offer/decision、borrower price/quantity/terms、risk choice和分布。', guardrail: '3.10–3.12 direct canonical lineage保留；余额、appetite与风险向量不先压成指数。' },
  { name: '3.13 → 3.14 · Credit Cycle', payload: 'lane levels/changes、融资菜单分布、信用diagnostics、主体初始状态、weight ledger、component contributions、coverage(expectedDomains/observedDomains/totalOriginalWeight/observedWeight/isPartial/missingDomains/renormalized)、compositionVersion和vintage。', guardrail: '3.14才闭合conditions→credit→net worth/loss→next conditions。' },
  { name: '3.13 → 3.20 · Exchange Rate', payload: 'base/quote currency、net FX debt/income、hedge ratio、repricing bucket和local condition。', guardrail: '本页只映射暴露；汇率决定机制归3.20。' },
  { name: '3.13 → 4.07 · Global Financial Cycle', payload: 'jurisdiction-local vector、global/local candidate decomposition、external-finance dependence和数据时钟。', guardrail: '多国同动或美元单变量不识别全球共同因子。' },
  { name: '3.13 → Chapter 7 · Research system', payload: 'overlap graph、target registry、三轴证据、passports、train window、reestimation、embargo与OOS record。', guardrail: 'descriptive composite不得直接复用为identified shock。' },
] as const;

const evidenceGroups = [
  { title: 'A · 定义、官方指数与构造方法', text: 'FCI-G、NFCI/ANFCI、经典广义FCI、MCI边界、实时vintage、动态因子及多方法比较共同说明：金融条件是用途特定的测量系统，零点、权重和输出单位依产品而异。', ids: [1, 2, 3, 4, 5, 7, 8, 9, 15, 19, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34] },
  { title: 'B · 信用价格、贷款条件与内生政策', text: '信用spread/EBP、SLOOS及银行级供给研究把price、standards、terms、demand与shock分开；货币政策会内生回应条件，调查净比例和预测利差都不自动成为外生冲击。', ids: [10, 16, 17, 18, 21, 22, 23] },
  { title: 'C · 压力、脆弱性与增长分布', text: '金融压力研究强调市场失灵与跨市场共振，Growth-at-Risk研究强调条件增长分布与期限；这些对象补充广义FCI，却不能与其共享零点或因果身份。', ids: [6, 11, 20, 35, 36, 37, 38, 40, 41] },
  { title: 'D · 全球、美元与横截面异质性', text: '跨国FCI、全球/国内周期、美元融资和企业横截面证据共同要求保存法域、币种、对冲、融资渠道与分布；全球共同因子的重要性随对象和时期变化。', ids: [12, 13, 14, 39, 42, 43, 44, 45, 46, 47, 48, 49, 50] },
] as const;

const conceptIds = new Set(conceptSections.map(({ id }) => id));
const allReferenceIds = new Set<number>(lesson313References.map(({ id }) => id));
const citedSourceIds = new Set<number>(conceptSections.flatMap(({ sourceIds }) => sourceIds));
const evidenceMapSourceIds = new Set<number>(evidenceGroups.flatMap(({ ids }) => ids));
const mechanismLabSectionOrder = ['direction-standardisation', 'weighting-purpose', 'redundancy-double-count', 'realtime-vintage', 'aggregate-borrower-specific', 'prediction-not-causation', 'cross-country-currency'];
const allScenarioAnchorsResolve = financialConditionsScenarios.every(({ primarySectionId, remediationSectionIds }) => conceptIds.has(primarySectionId) && remediationSectionIds.every((id) => conceptIds.has(id)));

const lesson313IntegrityAudit = [
  { key: '28 concepts numbered 02–29', passed: conceptSections.length === 28 && conceptSections.every(({ number }, index) => number === index + 2) },
  { key: '22 core + 6 optional concepts', passed: lesson313CorePathSectionIds.size === 22 && conceptSections.filter(({ id }) => !lesson313CorePathSectionIds.has(id)).length === 6 },
  { key: 'every concept has at least two paragraphs and sources', passed: conceptSections.every(({ paragraphs, sourceIds }) => paragraphs.length >= 2 && sourceIds.length > 0) },
  { key: 'unique concept IDs', passed: conceptIds.size === conceptSections.length },
  { key: 'all local source IDs resolve', passed: [...citedSourceIds].every((id) => allReferenceIds.has(id)) },
  { key: '50 references continuous', passed: lesson313References.length === 50 && lesson313References.every(({ id }, index) => id === index + 1) },
  { key: 'every reference states support and non-support boundaries', passed: lesson313References.every(({ use }) => use.includes('支持') && use.includes('不支持')) },
  { key: 'all references have https URLs and evidence-map coverage', passed: lesson313References.every(({ id, url }) => url.startsWith('https://') && evidenceMapSourceIds.has(id)) },
  { key: 'seven mechanism labs ordered and anchored', passed: mechanismLabSectionOrder.length === 7 && mechanismLabSectionOrder.every((id, index) => conceptSections.findIndex(({ id: sectionId }) => sectionId === id) > (index ? conceptSections.findIndex(({ id: sectionId }) => sectionId === mechanismLabSectionOrder[index - 1]) : -1)) },
  { key: 'ten M and ten K scenarios with resolved remediation anchors', passed: financialConditionsScenarios.length === 10 && allScenarioAnchorsResolve },
  { key: 'scenario structure and numeric audits pass', passed: financialConditionsScenarioAssertions.every(({ passed }) => passed) && financialConditionsNumericAssertionAudit.every(({ passed }) => passed) },
  { key: 'eighteen checks and forty-plus glossary entries', passed: checks.length === 18 && glossary.length >= 40 },
  { key: 'fourteen producer invariants and eight interfaces', passed: contractInvariants.length === 14 && interfaces.length === 8 },
  { key: 'ten guided readings with primary and auxiliary links', passed: lesson313ReadingList.length === 10 && lesson313ReadingList.every(({ url, links }) => url.startsWith('https://') && Boolean(links?.length) && links?.every(({ label, url: linkUrl }) => label.length > 0 && linkUrl.startsWith('https://'))) },
  { key: 'canonical and fixture audits pass', passed: canonicalStateAudit.every(({ passed }) => passed) && financialConditionsFixtureAudit.every(({ passed }) => passed) },
] as const;

if (lesson313IntegrityAudit.some(({ passed }) => !passed)) {
  throw new Error(`3.13 lesson integrity gate failed: ${lesson313IntegrityAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

function Lesson313Content() {
  return <>
    <section className="lesson-section" id="thesis">
      <p className="section-kicker">00 · CORE THESIS</p>
      <h2>金融条件不是政策利率的别名，也不是天然存在的一条指数：它是多维市场与中介状态经过主体、合同、方向、时钟和用途映射后的融资环境。</h2>
      <p>这一节把3.06–3.12的输出放到同一张但不压扁的地图上。安全利率、期限结构、信用价格、股票与抵押价值、美元/汇率、银行资金和风险约束、贷款批准与条款都可能改变主体融资；它们之所以可以共同描述“条件”，不是因为单位相同，而是因为最终都能通过明确合同进入融资价格、可得数量、非价格条款、资产负债表支持和风险承载。只有对象与映射关闭后，才允许构造用途特定的FCI。</p>
      <p>这套测量没有唯一权重。统计型指数提取共同方差，增长映射型指数估算未来活动逆风，主体暴露型指数刻画真正绑定者；它们的零点、单位和vintage不同。页面因此始终同时交付向量、贡献、主体分布与证据身份。一个总数可以帮助认知压缩，却不能替代政策冲击、金融压力、信用周期或因果效应。</p>
      <div className="impact-facts" role="group" aria-label="3.13核心学习承诺"><article><span>先保存</span><b>vector + menu + passports</b><p>原值、方向、时钟、价格、数量与条款不丢失。</p></article><article><span>再压缩</span><b>purpose-specific operator</b><p>权重回答谁和什么用途，而非客观真值。</p></article><article><span>最终输出</span><b>state + distribution + evidence axes</b><p>描述、预测和因果身份永久分栏。</p></article></div>
      <p className="section-sources"><b>核心依据：</b> <Cites ns={[1, 3, 8, 12, 39, 49]} /></p>
    </section>

    <section className="lesson-section" id="scope-route">
      <p className="section-kicker">01 · SCOPE, ROUTE & OFFICIAL DATA ORIENTATION</p>
      <h2>先用真实FCI-G看见“用途和单位”，再回到合成实验拆开指数每一道选择。</h2>
      <div className="term-grid entry-vocabulary" aria-label="3.13核心路径十词导航" role="group">{entryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>首次出现前先解码</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <FinancialConditionsTransmissionChart />
      <div className="case-grid"><article className="case-card"><span>Master prerequisite</span><h3>3.06–3.12</h3><p>隔夜、曲线、实际率、中介约束、贷款、借款人与风险选择共同形成输入；不要求改动已封版producer。</p></article><article className="case-card"><span>CORE PATH</span><h3>§00–23 · 正文75–90分钟</h3><p>从融资对象到claim ladder；C1–C6交互另计约50–70分钟。</p></article><article className="case-card"><span>OPTIONAL</span><h3>§24–29 · 约20–25分钟</h3><p>PCA、FCI-G、混频、跨国状态依赖、治理和接口；C7另约10–15分钟。</p></article><article className="case-card"><span>章节所有权</span><h3>measurement, not the whole cycle</h3><p>3.14才闭合信用周期；4.07识别全球周期；Chapter 7处理压力、网络和正式研究。</p></article></div>
      <div className="precision-note"><span>真实与合成严格分栏</span><p>上图读取官方FCI-G研究产品，保存数据首末期、选点规则、取数日期和SHA-256；正文canonical与C/M/K实验则使用显式SYNTHETIC教学参数。官方快照绝不进入合成score，测试通过也不把合成数值升级为现实估计。</p></div>
    </section>

    {conceptSections.map((section) => <FinancialConditionsConceptSection key={section.id} section={section} />)}

    <section className="lesson-section" id="interactive-lab">
      <p className="section-kicker">30 · INTERACTIVE M1–M10 + STATIC K1–K10</p>
      <h2>把“指数变紧”拆成可复算判断：每题先守方向、权重、时钟、分母与证据身份。</h2>
      <FinancialConditionsLab />
    </section>

    <section className="lesson-section" id="checks-glossary">
      <p className="section-kicker">32 · CHECKS, CONTRACT AUDIT & GLOSSARY</p>
      <h2>能解释反例、复算断言并区分术语，才算真正掌握这台测量机器。</h2>
      <div className="check-grid" role="group" aria-label="3.13理解检查">{checks.map((check, index) => <div key={check.question}><details><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={check.sourceIds} /></p></details><p className="print-only check-print-answer"><b>{String(index + 1).padStart(2, '0')} · 答案：</b>{check.answer} <Cites ns={check.sourceIds} /></p></div>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.13 canonical与fixture断言"><span>Canonical {canonicalStateAudit.filter(({ passed }) => passed).length}/{canonicalStateAudit.length} · Fixture {financialConditionsFixtureAudit.filter(({ passed }) => passed).length}/{financialConditionsFixtureAudit.length}</span><ul>{canonicalStateAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{financialConditionsFixtureAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="yield-fixture-audit" role="group" aria-label="3.13正文、引用与题库完整性审计"><span>{lesson313IntegrityAudit.filter(({ passed }) => passed).length}/{lesson313IntegrityAudit.length} 项正文、来源、题库与契约门通过</span><ul>{lesson313IntegrityAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="3.13术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>

    <section className="lesson-section" id="interfaces-reading">
      <p className="section-kicker">33 · CANONICAL STATE, EVIDENCE, INTERFACES & READING</p>
      <h2>最终交付是一份可追溯、可复算、可失败、可刷新、可路由的金融条件状态合同。</h2>
      <div className="precision-note" data-key-coverage={canonicalStateAudit.every(({ passed }) => passed) ? 'complete' : 'incomplete'}><span>3.13 canonical state · {canonicalFinancialConditionsStateFields.length}个顶层键 · compile/runtime闭合</span><p><code>{canonicalFinancialConditionsStateFields.join(', ')}</code>。状态使用稳定schema <code>{canonicalFinancialConditionsStateExample.schemaVersion}</code>，真实继承3.10的<code>{canonicalBankLendingStateExample.stateId}</code>、3.11的<code>{canonicalBorrowerCollateralStateExample.stateId}</code>和3.12的<code>{canonicalMonetaryPolicyRiskTakingStateExample.stateId}</code>；3.06–3.09因没有直接导出canonical，仅保存reviewed interface pointer而不修改已封版文件。六个SYNTHETIC z-like lane为0.6、1.2、0.8、0.5、0.8和0.4，类别等权结果43/60=0.7167 index points；它们明确不是真实样本z。这个scalar同一对象内直接携带六项weight ledger和coverage合同：<code>totalOriginalWeight=1</code>、<code>observedWeight=1</code>、<code>isPartial=false</code>、<code>missingDomains=[]</code>、<code>renormalized=false</code>、<code>compositionVersion=full-scope-v1</code>。缺任一声明lane、出现重复lane、缩短domain universe或权重和不为1时，strict scalar都返回STOP/null。price/quantity冲突例冻结共享方向图并把异质性限定为weight-only：总体仅0.083，三类主体分别为0.730、−0.195和0.005；每类仍保存六项SYNTHETIC方向护照，证明scalar不能替方向、分布或融资菜单。唯一有值的target是合成registered-agent composite；predictionStatus=not-estimated，causalStatus=not-claimed。官方FCI-G图作为observed snapshot单独保存并禁止进入canonical score。任一lineage、单位、方向、去重、权重、贡献、coverage、composition、vintage或证据门失败，构建立刻停止。</p></div>
      <h3>生产者侧不变量</h3><ol className="contract-list">{contractInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
      <h3>动态来源刷新护照</h3><div className="interface-grid" role="group" aria-label="3.13动态来源刷新清单">{dynamicRefreshChecklist.map((item) => <article key={item.source}><span>{item.source}</span><p><b>刷新：</b>{item.refresh}</p><p><b>允许用途：</b>{item.use} <Cites ns={item.sourceIds} /></p></article>)}</div>
      <h3>证据地图</h3><div className="evidence-map" aria-label={`3.13连续覆盖${lesson313References.length}条来源的证据地图`} role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} <Cites ns={group.ids} /></p></div>)}</div>
      <h3>跨章接口</h3><div className="interface-grid" role="group" aria-label="3.13跨章接口">{interfaces.map((item) => <article key={item.name}><span>{item.name}</span><p><b>Payload：</b>{item.payload}</p><p><b>Guardrail：</b>{item.guardrail}</p></article>)}</div>
      <div className="precision-note"><span>Reading path</span><p>先读Hatzius与Chicago Fed建立状态型FCI，再精读FCI-G理解增长映射；随后进入权重比较、信用spread与贷款标准，最后才处理实时数据、压力/GaR以及全球与横截面异质性。每张卡都写出“不支持什么”，阅读不会静默升级证据。</p></div>
    </section>
  </>;
}

export const lesson313: LessonRecord = {
  slug: '3-13',
  id: '3.13',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Financial Conditions：从融资价格与可得性向量，到可审计指数、主体分布、预测信号与因果边界',
  subtitle: '利率、信用、股票、美元、银行可得性与市场流动性只有经过对象护照、方向统一、实时标准化、去重和用途特定权重，才有资格共同描述某个主体的融资环境；任何FCI都不是政策立场、金融压力、信用周期或结构冲击的自动替身',
  readingTime: 'CORE PATH §00–23正文约75–90分钟；六个optional deep dive（§24–29）另约20–25分钟，完整正文（§00–29，不含交互、题库、术语、来源与延伸阅读）约95–115分钟。C1–C6交互另约50–70分钟，optional C7约10–15分钟；M1–M10首次完成约35–50分钟／含复盘约55–75分钟；K1–K10、18道检查、术语与接口约90–120分钟；50条来源与延伸阅读不计',
  prerequisite: 'Master prerequisite：3.06 Money Market Implementation、3.07 Yield Curve、3.08 Real Rates、3.09 Intermediary Balance Sheet Constraints、3.10 Bank Lending Channel、3.11 Borrower Balance Sheet / Collateral Channel、3.12 Risk-Taking Channel；按需调用T03、T05、T06与T08',
  updatedAt: '2026-09-11',
  revision: '3.13-r1',
  reviewStatus: 'double-reviewed',
  reviews: [
    { kind: 'accuracy', completedAt: '2026-09-11', decision: 'approved', revision: '3.13-r1', summary: '专业准确性通过：标准化叙述、公式与C1同序；50条来源边界、官方FCI-G快照、strict scalar、上游lineage、数值断言与证据三轴全部闭合。' },
    { kind: 'pedagogy', completedAt: '2026-09-11', decision: 'approved', revision: '3.13-r1', summary: '教学与可访问性通过：屏幕、无JavaScript与A4打印通道对标准化步骤无歧义；移动端、键盘、AX、交互、SSR、长表续页与来源阅读均无回归。' },
  ],
  previous: { slug: '3-12', label: '3.12 Risk-Taking Channel of Monetary Policy' },
  next: { slug: '3-14', label: '3.14 Credit Cycle' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、路线与真实数据' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive M1–M10' },
    { id: 'financial-conditions-static-twins', label: 'Static K1–K10' },
    { id: 'checks-glossary', label: 'Checks / Audit / Glossary' },
    { id: 'interfaces-reading', label: 'State / Evidence / Interfaces' },
  ],
  Content: Lesson313Content,
  references: lesson313References,
  readingList: lesson313ReadingList,
  readingListOrder: 'source',
};
