import type { ReactNode } from 'react';
import RiskTakingLab from '../components/RiskTakingLab';
import {
  ExAnteExPostLab,
  MarginAmbiguityLab,
  MeasuredRiskOverlayLab,
  RiskAdjustedSelectionLab,
  RiskTakingFixtureAudit,
  RiskTakingIdentificationLab,
  RiskTransferLab,
  SearchForYieldLab,
} from '../components/RiskTakingMechanismLabs';
import RiskTakingTransmissionChart from '../components/RiskTakingTransmissionChart';
import {
  canonicalIdentificationGate,
  canonicalRiskyCandidate,
  canonicalSafeCandidate,
  cohortRiskMetrics,
  riskAdjustedSelectionMetrics,
  riskTakingFixtureAudit,
  riskTakingFixturePassedCount,
  riskTakingIdentificationStatus,
  type RiskSelectionInput,
  type RiskSelectionMetrics,
} from '../components/riskTakingFixtures';
import {
  riskTakingNumericAssertionAudit,
  riskTakingScenarioAssertions,
  riskTakingScenarios,
} from '../components/riskTakingScenarios';
import { lesson305 } from './lesson-3-05';
import { canonicalBankLendingStateExample } from './lesson-3-10';
import { canonicalBorrowerCollateralStateExample } from './lesson-3-11';
import { lesson312ReadingList, lesson312References } from './lesson-3-12-sources';
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

type IdentificationStatus = 'descriptive' | 'mechanism-consistent' | 'identified-candidate' | 'identified';
type ChannelClassification = 'pure-risk-taking' | 'joint-channel' | 'boundary-route';
type RiskDimension = 'credit' | 'duration' | 'liquidity' | 'fx' | 'concentration' | 'tail' | 'leverage' | 'hedging';

type RiskMetricPassport = {
  metricId: string;
  dimension: RiskDimension;
  concept: 'capacity' | 'appetite-translation' | 'perception' | 'pricing' | 'selection' | 'realisation';
  valueBefore: number | null;
  valueAfter: number | null;
  unit: string;
  informationSetTime: string;
  modelVersion: string | null;
  denominator: string;
  pdForecastHorizonMonths?: number;
  contractMaturityMonths?: number;
  eadAmount?: number;
  eadCurrency?: string;
  productExposureBasis?: string;
  measurementFlag: 'observed' | 'estimated' | 'synthetic' | 'not-collected';
};

type RiskTakingEstimand = {
  estimandId: 'appetite-translation' | 'selection' | 'terms' | 'portfolio' | 'realised-loss';
  treatmentDefinition: string;
  treatmentScale: string;
  outcome: string;
  denominator: string;
  unit: string;
  sampleClock: string;
  horizon: string;
  supportPopulation: string;
  estimate: number | null;
  standardError: number | null;
  standardErrorUnit: string | null;
  clusteringLevel: string | null;
  status: IdentificationStatus;
  criticalAssumptions: string[];
};

type DynamicRiskDataPassport = {
  sourceId: string;
  provider: string;
  seriesTableOrItem: string;
  questionWordingOrConcept: string;
  jurisdiction: string;
  institutionalUniverse: string;
  unit: string;
  frequency: string;
  observationWindow: string | null;
  publicationDate: string | null;
  revisionOrFormVersion: string;
  retrievedAtUTC: string | null;
  aggregationAndDenominator: string;
  accessStatus: 'public' | 'restricted' | 'discontinued';
  methodologyURL: string;
  breakAndMissingFlags: string[];
};

export type MonetaryPolicyRiskTakingState = {
  schemaVersion: string;
  stateId: string;
  scopePassport: {
    lenderLegalEntityId: string;
    borrowerUniverse: string;
    focalBorrowerLegalEntityId: string;
    productUniverse: string;
    currency: string;
    consolidationBasis: string;
    decisionBookId: string;
  };
  inputLineage: {
    lessonId: '3.05' | '3.10' | '3.11';
    stateId: string;
    schemaVersion: string;
    fieldPaths: string[];
    relation: string;
    revisionTime: string;
  }[];
  policyTreatmentState: {
    treatmentId: string;
    sourceLessonId: '3.05';
    sourceLessonRevision: string;
    instrument: 'effective-overnight-rate';
    surpriseBasisPoints: number | null;
    expectedPathShiftBasisPoints: { horizonMonths: 3 | 12 | 24; value: number | null }[];
    observedLevelPctPointsPerYear: number;
    counterfactualLevelPctPointsPerYear: number;
    pathOrSurpriseStatus: 'synthetic-conditional-comparison';
    lowForLongDurationQuarters: number;
    assetPurchaseComposition: { assetClass: string; shareRatio: number }[] | null;
    negativeRateRegime: boolean;
    eventTime: string;
    treatmentDefinedBeforeOutcome: true;
    shockExogeneityStatus: 'not-established';
    predeterminedExposureStatus: 'not-established';
    classificationWarning: string;
  };
  frozenBankBaseline: {
    upstreamStateId: string;
    fundingAverageCostPctPointsPerYear: number;
    fundingMarginalCostPctPointsPerYear: number;
    mappedLoanCapacities: { constraintId: string; capacity: number }[];
    bindingConstraintIds: string[];
    capacitySnapshotJson: string;
    fundingSnapshotJson: string;
    freezeScope: string[];
  };
  frozenBorrowerBaseline: {
    upstreamStateId: string;
    borrowerLegalEntityId: string;
    netWorth: number;
    collateralBorrowingBase: number;
    bindingCapacity: number;
    bindingConstraintIds: string[];
    borrowerSnapshotJson: string;
    freezeScope: string[];
  };
  riskCapacityState: {
    capacityConcept: string;
    currentModelMaximumExposure: number;
    stressMaximumExposure: number;
    robustMaximumExposure: number;
    changedInPureComparison: false;
  };
  riskPerceptionState: {
    internalModelVersion: string;
    safeCandidatePdPctPoints: number;
    riskyCandidatePdPctPoints: number;
    pdForecastHorizonMonths: number;
    lgdConcept: string;
    safeCandidateEadAmount: number;
    riskyCandidateEadAmount: number;
    eadCurrency: string;
    contractMaturityMonths: number;
    productExposureBasis: string;
    perceptionChangedInPureComparison: false;
  };
  riskGovernanceState: {
    appetiteTranslation: {
      parameterConcept: string;
      riskShadowPriceBefore: number;
      riskShadowPriceAfter: number;
      governanceLevel: 'decision-book';
      aggregateAppetiteObserved: false;
      boardApprovalStatus: 'not-observed';
      decisionRuleVersion: string;
      mappingRule: string;
      effectiveAt: string;
      changedInPureComparison: true;
    };
    tolerance: {
      maximumDecisionPdPctPoints: number;
      maximumUnexpectedLossProxyPctPoints: number;
      operationalLimitVersion: string;
      changedInPureComparison: false;
    };
    legacyUpstreamRiskToleranceScore0To100: number;
    legacyScoreFrozenAndNotUsedInDecisionRule: true;
    interpretation: string;
  };
  underwritingState: {
    candidateSetId: string;
    candidateInputs: { safe: RiskSelectionInput; risky: RiskSelectionInput };
    fundingCostCrosswalk: {
      sourceFieldPath: '3.10.bankFundingState.marginalFundingCostPctPointsPerYear';
      upstreamValuePctPointsPerYear: number;
      appliedValuePctPointsPerYear: number;
      transformation: 'identity';
    };
    safeBefore: RiskSelectionMetrics;
    riskyBefore: RiskSelectionMetrics;
    safeAfter: RiskSelectionMetrics;
    riskyAfter: RiskSelectionMetrics;
    changedDecisionIds: string[];
    monitoringIntensityBefore0To1: number;
    monitoringIntensityAfter0To1: number;
    monitoringChangedInPureComparison: false;
    classification: ChannelClassification;
  };
  portfolioRiskState: {
    dimensions: RiskMetricPassport[];
    riskyShareBeforeRatio: number;
    riskyShareAfterRatio: number;
    creditRiskChanged: boolean;
    otherDimensionsFrozen: RiskDimension[];
  };
  selectionFunnelState: {
    applicantCount: number;
    approvedBefore: number;
    approvedAfter: number;
    originatedBefore: number;
    originatedAfter: number;
    denominatorsAreInterchangeable: false;
  };
  vintageOutcomeState: {
    originationVintageBefore: string;
    originationVintageAfter: string;
    exAnteRiskyShareBeforeRatio: number;
    exAnteRiskyShareAfterRatio: number;
    performanceWindow: string;
    realisedDefaultRateBeforePctPoints: number;
    realisedDefaultRateAfterPctPoints: number;
    paradoxLabel: string;
  };
  mechanismDecomposition: {
    safeYieldGap: string;
    marginChannel: string;
    valuationAndMeasuredRisk: string;
    limitedLiabilityAndMonitoring: string;
    policyPutBelief: string;
    supervisionInteraction: string;
  };
  identificationState: {
    designStatus: IdentificationStatus;
    estimateStatus: 'descriptive';
    gatePassed: number;
    gateTotal: number;
    failedGateIds: string[];
    estimands: RiskTakingEstimand[];
    noCausalEstimateInFixture: true;
  };
  dynamicDataPassports: DynamicRiskDataPassport[];
  measurementFlags: { fieldPath: string; flag: 'synthetic' | 'observed' | 'estimated'; note: string }[];
  boundaryRoutes: { destination: '3.10' | '3.11' | '3.13' | '3.14/3.15' | '3.24' | '4' | '7.11–7.13'; trigger: string; treatmentHere: string }[];
  auditTimestamps: {
    policyEventTime: string;
    riskInformationSetTime: string;
    decisionTime: string;
    originationTime: string;
    performanceWindowStart: string;
    performanceWindowEnd: string;
    publicationTime: string | null;
    revisionTime: string;
  };
};

const requireMetrics = (metrics: RiskSelectionMetrics | null, label: string) => {
  if (metrics === null) throw new Error(`3.12 invalid risk-selection fixture: ${label}`);
  return metrics;
};

const safeBefore = requireMetrics(riskAdjustedSelectionMetrics({ ...canonicalSafeCandidate, riskShadowPricePerUnexpectedLossPoint: 0.4 }), 'safe-before');
const riskyBefore = requireMetrics(riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, riskShadowPricePerUnexpectedLossPoint: 0.4 }), 'risky-before');
const safeAfter = requireMetrics(riskAdjustedSelectionMetrics({ ...canonicalSafeCandidate, riskShadowPricePerUnexpectedLossPoint: 0.2 }), 'safe-after');
const riskyAfter = requireMetrics(riskAdjustedSelectionMetrics({ ...canonicalRiskyCandidate, riskShadowPricePerUnexpectedLossPoint: 0.2 }), 'risky-after');
const vintageBefore = cohortRiskMetrics({ riskyShareRatio: 0.2, safeRealisedDefaultRatePctPoints: 1, riskyRealisedDefaultRatePctPoints: 8 });
const vintageAfter = cohortRiskMetrics({ riskyShareRatio: 0.4, safeRealisedDefaultRatePctPoints: 0.5, riskyRealisedDefaultRatePctPoints: 4 });

if (vintageBefore === null || vintageAfter === null) throw new Error('3.12 invalid vintage fixture.');

const upstreamBankCapacitySnapshot = canonicalBankLendingStateExample.bankConstraintState.capacities.map(({ constraintId, convertedLoanCapacityAmount }) => ({
  constraintId,
  capacity: convertedLoanCapacityAmount ?? Number.NaN,
}));
const upstreamBankFundingSnapshotJson = JSON.stringify(canonicalBankLendingStateExample.bankFundingState);
const upstreamBankCapacitySnapshotJson = JSON.stringify(canonicalBankLendingStateExample.bankConstraintState);
const upstreamBorrowerSnapshotJson = JSON.stringify({
  borrowerBalanceSheetState: canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState,
  cashFlowState: canonicalBorrowerCollateralStateExample.cashFlowState,
  collateralPoolState: canonicalBorrowerCollateralStateExample.collateralPoolState,
  constraintStackState: canonicalBorrowerCollateralStateExample.constraintStackState,
});
const identificationResult = riskTakingIdentificationStatus(canonicalIdentificationGate);

export const canonicalMonetaryPolicyRiskTakingStateExample: MonetaryPolicyRiskTakingState = {
  schemaVersion: '3.12-draft-contract',
  stateId: 'SYNTHETIC_MONETARY_POLICY_RISK_TAKING_STATE',
  scopePassport: {
    lenderLegalEntityId: canonicalBankLendingStateExample.scope.lenderLegalEntityId ?? 'BANK_A',
    borrowerUniverse: 'SYNTHETIC_MATCHED_APPLICATION_BOOK',
    focalBorrowerLegalEntityId: canonicalBorrowerCollateralStateExample.scopePassport.borrowerLegalEntityId,
    productUniverse: 'SYNTHETIC_TERM_LOANS_AND_MATCHED_ASSET_CANDIDATES',
    currency: canonicalBankLendingStateExample.scope.currency ?? 'SYN',
    consolidationBasis: canonicalBankLendingStateExample.scope.consolidationBasis ?? 'solo',
    decisionBookId: 'SYN_RISK_BOOK_2026Q3',
  },
  inputLineage: [
    {
      lessonId: '3.05', stateId: lesson305.id, schemaVersion: lesson305.revision,
      fieldPaths: ['policy-state-vector', 'information-set-vintage', 'shock-identification', 'systematic-surprise', 'target-path-information', 'instrument-menu', 'policy-point-path'],
      relation: 'inherit the policy-treatment passport vocabulary; keep an observed rate level separate from surprise, expected path, duration, purchases and negative-rate regime', revisionTime: lesson305.revision,
    },
    {
      lessonId: '3.10', stateId: canonicalBankLendingStateExample.stateId, schemaVersion: canonicalBankLendingStateExample.schemaVersion,
      fieldPaths: ['policyImplementationState', 'bankFundingState', 'bankConstraintState', 'frozenRiskState', 'loanOfferState', 'creditDecisionState', 'loanContractPassport', 'relationshipState'],
      relation: 'freeze funding, capacity, contract, borrower-risk baseline and decision clocks; endogenise only risk choice', revisionTime: canonicalBankLendingStateExample.timestamps.revisionVintage ?? '3.10-r3',
    },
    {
      lessonId: '3.11', stateId: canonicalBorrowerCollateralStateExample.stateId, schemaVersion: canonicalBorrowerCollateralStateExample.schemaVersion,
      fieldPaths: ['scopePassport', 'borrowerBalanceSheetState', 'cashFlowState', 'collateralPoolState', 'constraintStackState', 'financingDecisionState', 'auditTimestamps'],
      relation: 'freeze focal borrower state and use it only as a boundary/provenance signal; candidate book is separately marked synthetic', revisionTime: canonicalBorrowerCollateralStateExample.schemaVersion.replace(/-contract$/, ''),
    },
  ],
  policyTreatmentState: {
    treatmentId: 'SYN_CONDITIONAL_POLICY_COMPARISON', sourceLessonId: '3.05', sourceLessonRevision: lesson305.revision,
    instrument: 'effective-overnight-rate', surpriseBasisPoints: null,
    expectedPathShiftBasisPoints: [{ horizonMonths: 3, value: null }, { horizonMonths: 12, value: null }, { horizonMonths: 24, value: null }],
    observedLevelPctPointsPerYear: canonicalBankLendingStateExample.policyImplementationState.effectiveOvernightRate?.valuePctPointsPerYear ?? 3,
    counterfactualLevelPctPointsPerYear: 1, pathOrSurpriseStatus: 'synthetic-conditional-comparison', lowForLongDurationQuarters: 8,
    assetPurchaseComposition: null, negativeRateRegime: false, eventTime: '2026-09-02T00:00:00Z', treatmentDefinedBeforeOutcome: true,
    shockExogeneityStatus: 'not-established', predeterminedExposureStatus: 'not-established',
    classificationWarning: 'A rate level is not an identified monetary-policy shock. Surprise, expected-path shift and purchase composition are unobserved; the fixture is conditional and synthetic.',
  },
  frozenBankBaseline: {
    upstreamStateId: canonicalBankLendingStateExample.stateId,
    fundingAverageCostPctPointsPerYear: canonicalBankLendingStateExample.bankFundingState.averageFundingCostPctPointsPerYear ?? Number.NaN,
    fundingMarginalCostPctPointsPerYear: canonicalBankLendingStateExample.bankFundingState.marginalFundingCostPctPointsPerYear ?? Number.NaN,
    mappedLoanCapacities: upstreamBankCapacitySnapshot,
    bindingConstraintIds: [...canonicalBankLendingStateExample.bankConstraintState.bindingConstraintIds],
    capacitySnapshotJson: upstreamBankCapacitySnapshotJson,
    fundingSnapshotJson: upstreamBankFundingSnapshotJson,
    freezeScope: ['funding composition and costs', 'capital/leverage/liquidity/stable-funding/concentration capacity', 'loan product', 'legal entity', 'decision time'],
  },
  frozenBorrowerBaseline: {
    upstreamStateId: canonicalBorrowerCollateralStateExample.stateId,
    borrowerLegalEntityId: canonicalBorrowerCollateralStateExample.scopePassport.borrowerLegalEntityId,
    netWorth: canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.netWorth.value ?? Number.NaN,
    collateralBorrowingBase: canonicalBorrowerCollateralStateExample.collateralPoolState.totalBorrowingBase.value ?? Number.NaN,
    bindingCapacity: canonicalBorrowerCollateralStateExample.constraintStackState.bindingCapacity.value ?? Number.NaN,
    bindingConstraintIds: [...canonicalBorrowerCollateralStateExample.constraintStackState.bindingConstraintIds],
    borrowerSnapshotJson: upstreamBorrowerSnapshotJson,
    freezeScope: ['borrower identity', 'net worth', 'cash flow', 'collateral pool', 'constraint stack', 'distress and repayment information set'],
  },
  riskCapacityState: { capacityConcept: 'synthetic exposure allowed by current-model and stress-loss budgets', currentModelMaximumExposure: 100, stressMaximumExposure: 40, robustMaximumExposure: 40, changedInPureComparison: false },
  riskPerceptionState: {
    internalModelVersion: 'SYN_PD_MODEL_R1',
    safeCandidatePdPctPoints: canonicalSafeCandidate.pdPctPoints,
    riskyCandidatePdPctPoints: canonicalRiskyCandidate.pdPctPoints,
    pdForecastHorizonMonths: canonicalSafeCandidate.pdForecastHorizonMonths,
    lgdConcept: 'decision-time synthetic downturn-neutral LGD over the same 12-month horizon',
    safeCandidateEadAmount: canonicalSafeCandidate.eadAmount,
    riskyCandidateEadAmount: canonicalRiskyCandidate.eadAmount,
    eadCurrency: canonicalSafeCandidate.eadCurrency,
    contractMaturityMonths: canonicalSafeCandidate.contractMaturityMonths,
    productExposureBasis: canonicalSafeCandidate.productExposureBasis,
    perceptionChangedInPureComparison: false,
  },
  riskGovernanceState: {
    appetiteTranslation: {
      parameterConcept: 'synthetic decision-book tail-risk weight used as a classroom appetite-translation proxy',
      riskShadowPriceBefore: 0.4,
      riskShadowPriceAfter: 0.2,
      governanceLevel: 'decision-book',
      aggregateAppetiteObserved: false,
      boardApprovalStatus: 'not-observed',
      decisionRuleVersion: 'SYN_DECISION_BOOK_R2',
      mappingRule: 'classroom identity mapping from the scenario state to lambda only; not an empirical RAS-to-limit mapping',
      effectiveAt: '2026-09-02T08:00:00Z',
      changedInPureComparison: true,
    },
    tolerance: { maximumDecisionPdPctPoints: 6, maximumUnexpectedLossProxyPctPoints: 5, operationalLimitVersion: 'SYN_LIMITS_R1', changedInPureComparison: false },
    legacyUpstreamRiskToleranceScore0To100: canonicalBankLendingStateExample.frozenRiskState.bankRiskToleranceScore0To100 ?? 60,
    legacyScoreFrozenAndNotUsedInDecisionRule: true,
    interpretation: 'The moving lambda is a synthetic decision-book appetite-translation parameter, not an observed board-approved aggregate appetite. Operational PD and unexpected-loss tolerances stay fixed, as do capacity and the legacy upstream score.',
  },
  underwritingState: {
    candidateSetId: 'SYN_MATCHED_CANDIDATES_R1', candidateInputs: { safe: { ...canonicalSafeCandidate }, risky: { ...canonicalRiskyCandidate } },
    fundingCostCrosswalk: {
      sourceFieldPath: '3.10.bankFundingState.marginalFundingCostPctPointsPerYear',
      upstreamValuePctPointsPerYear: canonicalBankLendingStateExample.bankFundingState.marginalFundingCostPctPointsPerYear ?? Number.NaN,
      appliedValuePctPointsPerYear: canonicalRiskyCandidate.fundingCostPctPointsPerYear,
      transformation: 'identity',
    },
    safeBefore, riskyBefore, safeAfter, riskyAfter,
    changedDecisionIds: [canonicalRiskyCandidate.candidateId], monitoringIntensityBefore0To1: 0.8, monitoringIntensityAfter0To1: 0.8, monitoringChangedInPureComparison: false, classification: 'pure-risk-taking',
  },
  portfolioRiskState: {
    dimensions: [
      { metricId: 'ORIGINATION_PD', dimension: 'credit', concept: 'selection', valueBefore: 1.8, valueAfter: 2.6, unit: 'decision-time-EAD-weighted-12m-PD-pct-points', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: 'SYN_PD_MODEL_R1', denominator: '100 SYN normalised total originated EAD; safe/risky 12m PD fixed at 1%/5%', pdForecastHorizonMonths: 12, contractMaturityMonths: 12, eadAmount: 100, eadCurrency: 'SYN', productExposureBasis: 'same synthetic equal-EAD one-year bullet-loan origination book', measurementFlag: 'synthetic' },
      { metricId: 'DURATION_GAP', dimension: 'duration', concept: 'capacity', valueBefore: null, valueAfter: null, unit: 'years', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: null, denominator: 'not-collected', measurementFlag: 'not-collected' },
      { metricId: 'LIQUIDITY_STRESS_SHARE', dimension: 'liquidity', concept: 'capacity', valueBefore: null, valueAfter: null, unit: 'ratio', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: null, denominator: 'not-collected', measurementFlag: 'not-collected' },
      { metricId: 'FX_OPEN_POSITION', dimension: 'fx', concept: 'selection', valueBefore: null, valueAfter: null, unit: 'SYN', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: null, denominator: 'not-collected', measurementFlag: 'not-collected' },
      { metricId: 'CONCENTRATION_SHARE', dimension: 'concentration', concept: 'selection', valueBefore: null, valueAfter: null, unit: 'ratio', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: null, denominator: 'not-collected', measurementFlag: 'not-collected' },
      { metricId: 'UNEXPECTED_LOSS_PROXY', dimension: 'tail', concept: 'selection', valueBefore: 1.6, valueAfter: 2.2, unit: 'EAD-weighted-synthetic-loss-points', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: 'SYN_TAIL_R1', denominator: 'same synthetic equal-EAD origination book; safe/risky proxies fixed at 1/4', measurementFlag: 'synthetic' },
      { metricId: 'LEVERAGE', dimension: 'leverage', concept: 'capacity', valueBefore: null, valueAfter: null, unit: 'ratio', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: null, denominator: 'frozen and routed to 7.12', measurementFlag: 'not-collected' },
      { metricId: 'HEDGED_SHARE', dimension: 'hedging', concept: 'selection', valueBefore: null, valueAfter: null, unit: 'ratio', informationSetTime: '2026-09-02T00:00:00Z', modelVersion: null, denominator: 'not-collected', measurementFlag: 'not-collected' },
    ],
    riskyShareBeforeRatio: 0.2, riskyShareAfterRatio: 0.4, creditRiskChanged: true,
    otherDimensionsFrozen: ['duration', 'liquidity', 'fx', 'concentration', 'leverage', 'hedging'],
  },
  selectionFunnelState: { applicantCount: 100, approvedBefore: 60, approvedAfter: 70, originatedBefore: 55, originatedAfter: 64, denominatorsAreInterchangeable: false },
  vintageOutcomeState: {
    originationVintageBefore: 'SYN_VINTAGE_BEFORE', originationVintageAfter: 'SYN_VINTAGE_AFTER',
    exAnteRiskyShareBeforeRatio: vintageBefore.riskyShareRatio, exAnteRiskyShareAfterRatio: vintageAfter.riskyShareRatio,
    performanceWindow: '12m fixed horizon; synthetic complete-follow-up example',
    realisedDefaultRateBeforePctPoints: vintageBefore.realisedDefaultRatePctPoints,
    realisedDefaultRateAfterPctPoints: vintageAfter.realisedDefaultRatePctPoints,
    paradoxLabel: 'Selection risk rises while the fixed-window realised default rate falls because borrower repayment conditions improve in the separate performance clock.',
  },
  mechanismDecomposition: {
    safeYieldGap: 'Lower safe yield can increase the risky share needed to reach a sticky nominal target; no target or a flexible target can remove this force.',
    marginChannel: 'Deposit floors can compress margins; risk shifting and capacity retrenchment have opposite signs, so the net effect is state-dependent.',
    valuationAndMeasuredRisk: 'Higher prices and lower measured volatility can loosen model-implied space without reducing stress loss; perception and capacity remain separate.',
    limitedLiabilityAndMonitoring: 'A lower private weight on tail loss can reduce screening or monitoring, but franchise value and capital at risk can reverse the choice.',
    policyPutBelief: 'Belief in future support can lower perceived private tail losses; the belief must be measured and cannot be inferred from the rate level.',
    supervisionInteraction: 'Tighter supervision or macroprudential constraints can dominate or redirect the same monetary impulse.',
  },
  identificationState: {
    designStatus: identificationResult.status, estimateStatus: 'descriptive', gatePassed: identificationResult.passed, gateTotal: identificationResult.total,
    failedGateIds: identificationResult.failedKeys, noCausalEstimateInFixture: true,
    estimands: [
      { estimandId: 'appetite-translation', treatmentDefinition: '3.05-passported 2.0pp synthetic effective-overnight-rate level contrast; no shock claim', treatmentScale: 'counterfactual 3.0%/year versus 1.0%/year level, a −2.0 percentage-point contrast', outcome: 'synthetic decision-book tail-risk weight used to translate appetite into the pricing rule; no board-level aggregate-appetite measurement or approval claim', denominator: 'one lender legal entity × one synthetic decision-book rule version', unit: 'shadow-price points per synthetic unexpected-loss point', sampleClock: 'decision-rule state timestamped after the policy event and before any credit decision', horizon: 'same-day decision-rule state', supportPopulation: 'comparable lender decision books with the same capacity, product basis and model version', estimate: null, standardError: null, standardErrorUnit: null, clusteringLevel: null, status: 'descriptive', criticalAssumptions: ['risk capacity separately frozen or modelled', 'risk measure version held fixed', 'an empirical RAS-to-rule mapping and approval clock would be required before interpreting the parameter as aggregate appetite', 'shock exogeneity and predetermined exposure must be established before causal use'] },
      { estimandId: 'selection', treatmentDefinition: '3.05-passported 2.0pp synthetic effective-overnight-rate level contrast assigned before application decisions; no shock claim', treatmentScale: '−2.0 percentage points in the annualised overnight-rate level', outcome: 'decision-time EAD-weighted 12-month Probability of Default among originated exposures', denominator: 'sum of Exposure at Default across originated exposures only', unit: '12-month PD percentage points', sampleClock: 'application information frozen at decision; membership fixed at origination', horizon: 'one pre-specified origination/response window; distinct from the stored 12-month PD forecast horizon', supportPopulation: 'originated applications on common product, currency, maturity and EAD support', estimate: null, standardError: null, standardErrorUnit: null, clusteringLevel: null, status: 'descriptive', criticalAssumptions: ['application demand controlled', 'approval-to-origination selection addressed', 'PD forecast horizon fixed at 12 months and never replaced by the origination window', 'no future outcomes in decision risk'] },
      { estimandId: 'terms', treatmentDefinition: '3.05-passported 2.0pp synthetic effective-overnight-rate level contrast assigned before offer formation; no shock claim', treatmentScale: '−2.0 percentage points in the annualised overnight-rate level', outcome: 'all-in annualised risk price net of the matched benchmark, conditional on approval', denominator: 'approved offers with a non-missing matched benchmark and expected-loss estimate', unit: 'percentage points per year', sampleClock: 'offer terms recorded at the first binding offer', horizon: 'offer-date cross-section', supportPopulation: 'approved applications on common product, currency and maturity support', estimate: null, standardError: null, standardErrorUnit: null, clusteringLevel: null, status: 'descriptive', criticalAssumptions: ['selection into approval addressed', 'benchmark, expected loss and fees measured on one annualised basis'] },
      { estimandId: 'portfolio', treatmentDefinition: '3.05-passported 2.0pp synthetic effective-overnight-rate level contrast preceding the rebalancing window; no shock claim', treatmentScale: '−2.0 percentage points in the annualised overnight-rate level', outcome: 'share of originated EAD assigned to the pre-specified high-credit-risk candidate class', denominator: 'total originated EAD in the decision book', unit: 'ratio from 0 to 1', sampleClock: 'flows accumulated only during the pre-specified origination window; valuation changes excluded', horizon: 'one pre-specified rebalancing/origination window', supportPopulation: 'the frozen lender decision book and candidate menu', estimate: null, standardError: null, standardErrorUnit: null, clusteringLevel: null, status: 'descriptive', criticalAssumptions: ['flows separated from valuation', 'entry, exit and class migration addressed'] },
      { estimandId: 'realised-loss', treatmentDefinition: '3.05-passported 2.0pp synthetic effective-overnight-rate level contrast in force before origination; no shock claim', treatmentScale: '−2.0 percentage points in the annualised overnight-rate level', outcome: '12-month cumulative realised default rate for the fixed origination vintage', denominator: 'originated exposures with complete 12-month follow-up, or the explicitly censoring-adjusted equivalent', unit: 'percentage of exposures', sampleClock: 'performance starts only after origination and closes at the fixed 12-month horizon', horizon: '12 months after each origination', supportPopulation: 'complete-follow-up vintage or a pre-specified censoring-adjusted sample', estimate: null, standardError: null, standardErrorUnit: null, clusteringLevel: null, status: 'descriptive', criticalAssumptions: ['right-censoring handled', 'borrower support effect separated from selection', 'post-origination policy not silently folded into the treatment'] },
    ],
  },
  dynamicDataPassports: [
    { sourceId: 'ECB_BLS_RTO_ENTERPRISE', provider: 'European Central Bank', seriesTableOrItem: 'BLS.Q.U2.ALL.RTO.E.Z.B3.ST.S.WFNET', questionWordingOrConcept: "Credit standards — impact of bank's risk tolerance — enterprises — backward-looking three months", jurisdiction: 'euro area changing composition', institutionalUniverse: 'representative euro-area BLS bank sample', unit: 'weighted net percentage; positive=tightening contribution, negative=easing contribution', frequency: 'quarterly survey release', observationWindow: '2019-Q1/2026-Q3 publication quarters', publicationDate: '2026-07-21 for latest included round', revisionOrFormVersion: 'ECB BLS user guide April 2026', retrievedAtUTC: '2026-09-03T00:00:00Z', aggregationAndDenominator: 'all banks; country aggregates weighted by national shares in outstanding loans; N/A treatment per guide', accessStatus: 'public', methodologyURL: 'https://data.ecb.europa.eu/methodology/bank-lending-survey-bls', breakAndMissingFlags: ['PERIOD_IS_PUBLICATION_QUARTER_NOT_ACTIVITY_QUARTER', 'SURVEY_CONTRIBUTION_NOT_CAUSAL_EFFECT', 'SOURCE_VOCABULARY_NOT_CANONICAL_OPERATIONAL_TOLERANCE_OR_AGGREGATE_APPETITE', 'RAW_CSV_SHA256_3659ded652a256e037ad2e3ed933e40401514de639f7e215eedfa78cb2205d5f'] },
    { sourceId: 'FED_SLOOS_2026_07', provider: 'Federal Reserve Board', seriesTableOrItem: 'July 2026 SLOOS tables and chart data', questionWordingOrConcept: 'standards, terms, demand and reported reasons including reduced tolerance for risk', jurisdiction: 'United States', institutionalUniverse: 'responding domestic banks and U.S. branches/agencies of foreign banks', unit: 'respondent counts, shares and net percentages by question', frequency: 'quarterly survey', observationWindow: 'approximately 2026-Q2', publicationDate: '2026-08-03 page update', revisionOrFormVersion: '2026-07 questionnaire and release', retrievedAtUTC: '2026-09-03T00:00:00Z', aggregationAndDenominator: 'question-specific respondent universe; net tightening=tightened minus eased', accessStatus: 'public', methodologyURL: 'https://www.federalreserve.gov/data/sloos/sloos-202607.htm', breakAndMissingFlags: ['SELF_REPORTED_DIRECTION', 'QUESTION_SPECIFIC_DENOMINATOR', 'NOT_A_CAUSAL_POLICY_SHOCK'] },
    { sourceId: 'FED_STBL_E2_LEGACY', provider: 'Federal Reserve Board', seriesTableOrItem: 'Survey of Terms of Business Lending / E.2', questionWordingOrConcept: 'historical new business loan rates, amounts and internal risk categories', jurisdiction: 'United States', institutionalUniverse: 'surveyed commercial bank business loans', unit: 'loan-level historical survey fields and published aggregates', frequency: 'historical survey; discontinued', observationWindow: null, publicationDate: 'final release 2017-08-02', revisionOrFormVersion: 'final May 2017 survey', retrievedAtUTC: '2026-09-03T00:00:00Z', aggregationAndDenominator: 'historical STBL sample; do not splice to successor survey', accessStatus: 'discontinued', methodologyURL: 'https://www.federalreserve.gov/releases/e2/', breakAndMissingFlags: ['DISCONTINUED_2017', 'NOT_CURRENT', 'SUCCESSOR_NOT_CONTINUOUS'] },
    { sourceId: 'SEC_FORM_N_MFP', provider: 'U.S. Securities and Exchange Commission', seriesTableOrItem: 'Form N-MFP data sets', questionWordingOrConcept: 'money-fund assets, yields, WAM/WAL, liquidity, flows and holdings', jurisdiction: 'United States', institutionalUniverse: 'registered money market funds filing Form N-MFP', unit: 'as-filed form fields', frequency: 'monthly', observationWindow: null, publicationDate: null, revisionOrFormVersion: 'schema-specific; refresh required', retrievedAtUTC: null, aggregationAndDenominator: 'fund/share-class/holding fields as defined by the active schema', accessStatus: 'public', methodologyURL: 'https://www.sec.gov/data-research/sec-markets-data/dera-form-n-mfp-data-sets', breakAndMissingFlags: ['LIVE_REFRESH_REQUIRED', 'AS_FILED_NOT_SEC_VALIDATED', 'N_MFP_VERSUS_N_MFP3_SCHEMA'] },
  ],
  measurementFlags: [
    { fieldPath: 'policyTreatmentState', flag: 'synthetic', note: 'Conditional classroom comparison; a low observed rate is not an identified monetary-policy shock.' },
    { fieldPath: 'scopePassport|riskCapacityState|riskPerceptionState|riskGovernanceState|mechanismDecomposition', flag: 'synthetic', note: 'Classroom scope, limits, model inputs, governance state and mechanism labels; none are observed bank facts.' },
    { fieldPath: 'underwritingState|portfolioRiskState|selectionFunnelState|vintageOutcomeState', flag: 'synthetic', note: 'Deterministic teaching fixtures, not estimates, forecasts, investment advice or bank decisions.' },
    { fieldPath: 'dynamicDataPassports[0]', flag: 'observed', note: 'Frozen ECB BLS official series snapshot; survey responses describe reported contributions and are not causal estimates.' },
  ],
  boundaryRoutes: [
    { destination: '3.10', trigger: 'funding cost, deposit quantity, capital/liquidity/stable-funding/concentration capacity or total offer schedule changes', treatmentHere: 'freeze or label joint-channel' },
    { destination: '3.11', trigger: 'borrower net worth, collateral, cash flow, true PD/LGD or constraint stack changes', treatmentHere: 'freeze or label joint-channel' },
    { destination: '3.13', trigger: 'aggregate rates, credit, equity and dollar conditions into a market-wide financial-conditions object', treatmentHere: 'export a distribution, not a scalar index' },
    { destination: '3.14/3.15', trigger: 'credit growth, debt accumulation and endogenous cycle feedback', treatmentHere: 'stop at local selection and loss feedback' },
    { destination: '3.24', trigger: 'normative monetary-versus-macroprudential welfare decision', treatmentHere: 'report mechanisms and externalities separately' },
    { destination: '4', trigger: 'cross-border policy spillover, currency mismatch or global bank reallocation', treatmentHere: 'preserve country, currency and bank-nationality keys' },
    { destination: '7.11–7.13', trigger: 'open-fund redemption, leverage, margin calls, forced sales, price impact or network contagion', treatmentHere: 'export exposures and triggers only' },
  ],
  auditTimestamps: { policyEventTime: '2026-09-02T00:00:00Z', riskInformationSetTime: '2026-09-02T08:00:00Z', decisionTime: '2026-09-02T12:00:00Z', originationTime: '2026-09-03T00:00:00Z', performanceWindowStart: '2026-09-03T00:00:00Z', performanceWindowEnd: '2027-09-02T23:59:59Z', publicationTime: null, revisionTime: '3.12-draft' },
};

const canonicalStateFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'policyTreatmentState', 'frozenBankBaseline',
  'frozenBorrowerBaseline', 'riskCapacityState', 'riskPerceptionState', 'riskGovernanceState', 'underwritingState',
  'portfolioRiskState', 'selectionFunnelState', 'vintageOutcomeState', 'mechanismDecomposition', 'identificationState',
  'dynamicDataPassports', 'measurementFlags', 'boundaryRoutes', 'auditTimestamps',
] as const satisfies readonly (keyof MonetaryPolicyRiskTakingState)[];
const canonicalStateCompileCoverage = true satisfies Exclude<keyof MonetaryPolicyRiskTakingState, (typeof canonicalStateFields)[number]> extends never ? true : false;

const close = (left: number | null | undefined, right: number, tolerance = 1e-9) => left !== null
  && left !== undefined && Number.isFinite(left) && Math.abs(left - right) <= tolerance;
const storedCandidateInputs = canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.candidateInputs;
const recomputedSafeBefore = requireMetrics(riskAdjustedSelectionMetrics({ ...storedCandidateInputs.safe, riskShadowPricePerUnexpectedLossPoint: canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.riskShadowPriceBefore }), 'stored-safe-before');
const recomputedRiskyBefore = requireMetrics(riskAdjustedSelectionMetrics({ ...storedCandidateInputs.risky, riskShadowPricePerUnexpectedLossPoint: canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.riskShadowPriceBefore }), 'stored-risky-before');
const recomputedSafeAfter = requireMetrics(riskAdjustedSelectionMetrics({ ...storedCandidateInputs.safe, riskShadowPricePerUnexpectedLossPoint: canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.riskShadowPriceAfter }), 'stored-safe-after');
const recomputedRiskyAfter = requireMetrics(riskAdjustedSelectionMetrics({ ...storedCandidateInputs.risky, riskShadowPricePerUnexpectedLossPoint: canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.riskShadowPriceAfter }), 'stored-risky-after');
const lesson305SectionIds = new Set(lesson305.sections.map(({ id }) => id));
const originationPdPassport = canonicalMonetaryPolicyRiskTakingStateExample.portfolioRiskState.dimensions.find(({ metricId }) => metricId === 'ORIGINATION_PD');
const canonicalStateRuntimeDiagnostics = [
  { key: 'top-level fields', passed: Object.keys(canonicalMonetaryPolicyRiskTakingStateExample).length === canonicalStateFields.length },
  { key: '3.05/3.10/3.11 upstream lineage', passed: canonicalMonetaryPolicyRiskTakingStateExample.inputLineage[0]?.lessonId === '3.05' && canonicalMonetaryPolicyRiskTakingStateExample.inputLineage[0]?.revisionTime === lesson305.revision && canonicalMonetaryPolicyRiskTakingStateExample.inputLineage[1]?.stateId === canonicalBankLendingStateExample.stateId && canonicalMonetaryPolicyRiskTakingStateExample.inputLineage[2]?.stateId === canonicalBorrowerCollateralStateExample.stateId },
  { key: '3.05 lineage field paths resolve', passed: canonicalMonetaryPolicyRiskTakingStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.05')?.fieldPaths.every((id) => lesson305SectionIds.has(id)) === true },
  { key: '3.11 producer revision preserved', passed: canonicalMonetaryPolicyRiskTakingStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.11')?.revisionTime === '3.11-r2' },
  { key: 'full policy-treatment vector and non-identification flags', passed: canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.sourceLessonRevision === lesson305.revision && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.expectedPathShiftBasisPoints.length === 3 && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.expectedPathShiftBasisPoints.every(({ value }) => value === null) && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.surpriseBasisPoints === null && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.assetPurchaseComposition === null && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.negativeRateRegime === false && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.shockExogeneityStatus === 'not-established' && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.predeterminedExposureStatus === 'not-established' },
  { key: 'policy passport drives separate timing/exogeneity/exposure gates', passed: canonicalIdentificationGate.policyTreatmentDefinedBeforeOutcome === canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.treatmentDefinedBeforeOutcome && canonicalIdentificationGate.policyShockExogeneityEstablished === false && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.shockExogeneityStatus === 'not-established' && canonicalIdentificationGate.predeterminedIntermediaryExposure === false && canonicalMonetaryPolicyRiskTakingStateExample.policyTreatmentState.predeterminedExposureStatus === 'not-established' },
  { key: 'upstream snapshots frozen', passed: canonicalMonetaryPolicyRiskTakingStateExample.frozenBankBaseline.fundingSnapshotJson === JSON.stringify(canonicalBankLendingStateExample.bankFundingState) && canonicalMonetaryPolicyRiskTakingStateExample.frozenBankBaseline.capacitySnapshotJson === JSON.stringify(canonicalBankLendingStateExample.bankConstraintState) && canonicalMonetaryPolicyRiskTakingStateExample.frozenBorrowerBaseline.borrowerSnapshotJson === upstreamBorrowerSnapshotJson },
  { key: 'legal-entity crosswalk', passed: canonicalMonetaryPolicyRiskTakingStateExample.scopePassport.lenderLegalEntityId === canonicalBankLendingStateExample.loanContractPassport?.lenderLegalEntityId && canonicalMonetaryPolicyRiskTakingStateExample.scopePassport.focalBorrowerLegalEntityId === canonicalBorrowerCollateralStateExample.scopePassport.borrowerLegalEntityId },
  { key: 'upstream numeric crosswalk', passed: close(canonicalMonetaryPolicyRiskTakingStateExample.frozenBankBaseline.fundingMarginalCostPctPointsPerYear, 3.4) && close(canonicalMonetaryPolicyRiskTakingStateExample.frozenBorrowerBaseline.netWorth, 300) && close(canonicalMonetaryPolicyRiskTakingStateExample.frozenBorrowerBaseline.collateralBorrowingBase, 97) && close(canonicalMonetaryPolicyRiskTakingStateExample.frozenBorrowerBaseline.bindingCapacity, 0) },
  { key: 'candidate funding uses 3.10 marginal cost by identity', passed: close(canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.fundingCostCrosswalk.upstreamValuePctPointsPerYear, 3.4) && close(canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.fundingCostCrosswalk.appliedValuePctPointsPerYear, 3.4) && close(storedCandidateInputs.safe.fundingCostPctPointsPerYear, 3.4) && close(storedCandidateInputs.risky.fundingCostPctPointsPerYear, 3.4) },
  { key: '12m PD/LGD/EAD passport closes annual loss-rate basis', passed: storedCandidateInputs.safe.pdForecastHorizonMonths === 12 && storedCandidateInputs.risky.pdForecastHorizonMonths === 12 && storedCandidateInputs.safe.contractMaturityMonths === 12 && storedCandidateInputs.risky.contractMaturityMonths === 12 && storedCandidateInputs.safe.eadAmount === storedCandidateInputs.risky.eadAmount && storedCandidateInputs.safe.eadCurrency === storedCandidateInputs.risky.eadCurrency && storedCandidateInputs.safe.productExposureBasis === storedCandidateInputs.risky.productExposureBasis && canonicalMonetaryPolicyRiskTakingStateExample.riskPerceptionState.pdForecastHorizonMonths === 12 && canonicalMonetaryPolicyRiskTakingStateExample.riskPerceptionState.eadCurrency === storedCandidateInputs.safe.eadCurrency && originationPdPassport?.pdForecastHorizonMonths === 12 && originationPdPassport.contractMaturityMonths === 12 && originationPdPassport.eadAmount === 100 && originationPdPassport.eadCurrency === 'SYN' && Boolean(originationPdPassport.productExposureBasis) && close(recomputedSafeBefore.expectedLossAmount, storedCandidateInputs.safe.eadAmount * recomputedSafeBefore.expectedLossRatePctPoints / 100) && close(recomputedRiskyBefore.expectedLossAmount, storedCandidateInputs.risky.eadAmount * recomputedRiskyBefore.expectedLossRatePctPoints / 100) },
  { key: 'stored candidate inputs reproduce all outputs', passed: JSON.stringify(recomputedSafeBefore) === JSON.stringify(canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.safeBefore) && JSON.stringify(recomputedRiskyBefore) === JSON.stringify(canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.riskyBefore) && JSON.stringify(recomputedSafeAfter) === JSON.stringify(canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.safeAfter) && JSON.stringify(recomputedRiskyAfter) === JSON.stringify(canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.riskyAfter) },
  { key: 'three approval gates and decision change', passed: safeBefore.accepted && safeBefore.returnHurdlePassed && safeBefore.decisionPdCapPassed && safeBefore.unexpectedLossBudgetPassed && !riskyBefore.accepted && !riskyBefore.returnHurdlePassed && riskyBefore.decisionPdCapPassed && riskyBefore.unexpectedLossBudgetPassed && safeAfter.accepted && riskyAfter.accepted && close(riskyBefore.riskAdjustedContributionPctPoints, -0.1) && close(riskyAfter.riskAdjustedContributionPctPoints, 0.7) && canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.changedDecisionIds.join(',') === canonicalRiskyCandidate.candidateId },
  { key: 'only synthetic appetite-translation shadow weight changes in pure comparison', passed: canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.changedInPureComparison === true && canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.governanceLevel === 'decision-book' && canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.aggregateAppetiteObserved === false && canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.appetiteTranslation.boardApprovalStatus === 'not-observed' && canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.tolerance.changedInPureComparison === false && canonicalMonetaryPolicyRiskTakingStateExample.riskGovernanceState.legacyScoreFrozenAndNotUsedInDecisionRule === true && canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.monitoringChangedInPureComparison === false && canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.monitoringIntensityBefore0To1 === canonicalMonetaryPolicyRiskTakingStateExample.underwritingState.monitoringIntensityAfter0To1 },
  { key: 'capacity and perception freeze', passed: canonicalMonetaryPolicyRiskTakingStateExample.riskCapacityState.changedInPureComparison === false && canonicalMonetaryPolicyRiskTakingStateExample.riskPerceptionState.perceptionChangedInPureComparison === false },
  { key: 'ex-ante/ex-post clocks', passed: vintageAfter.riskyShareRatio > vintageBefore.riskyShareRatio && vintageAfter.realisedDefaultRatePctPoints < vintageBefore.realisedDefaultRatePctPoints },
  { key: 'synthetic level remains mechanism-consistent', passed: identificationResult.status === 'mechanism-consistent' && identificationResult.passed === 9 && identificationResult.total === 11 && identificationResult.failedKeys.includes('policyShockExogeneityEstablished') && identificationResult.failedKeys.includes('predeterminedIntermediaryExposure') && canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimateStatus === 'descriptive' },
  { key: 'five closed, distinct, unestimated estimands', passed: canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimands.length === 5 && new Set(canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimands.map(({ outcome }) => outcome)).size === 5 && new Set(canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimands.map(({ denominator }) => denominator)).size === 5 && canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimands.every(({ treatmentDefinition, treatmentScale, denominator, sampleClock, estimate, standardError, standardErrorUnit, clusteringLevel, status }) => treatmentDefinition.length > 0 && treatmentScale.length > 0 && denominator.length > 0 && sampleClock.length > 0 && estimate === null && standardError === null && standardErrorUnit === null && clusteringLevel === null && status === 'descriptive') },
  { key: 'risk vector', passed: canonicalMonetaryPolicyRiskTakingStateExample.portfolioRiskState.dimensions.length === 8
    && close(originationPdPassport?.valueBefore, 1.8)
    && close(originationPdPassport?.valueAfter, 2.6)
    && close(canonicalMonetaryPolicyRiskTakingStateExample.portfolioRiskState.dimensions.find(({ metricId }) => metricId === 'UNEXPECTED_LOSS_PROXY')?.valueBefore, 1.6)
    && close(canonicalMonetaryPolicyRiskTakingStateExample.portfolioRiskState.dimensions.find(({ metricId }) => metricId === 'UNEXPECTED_LOSS_PROXY')?.valueAfter, 2.2) },
  { key: 'discontinued-source flag', passed: canonicalMonetaryPolicyRiskTakingStateExample.dynamicDataPassports.some(({ sourceId, accessStatus }) => sourceId === 'FED_STBL_E2_LEGACY' && accessStatus === 'discontinued') },
] as const;
const canonicalStateRuntimeCoverage = canonicalStateRuntimeDiagnostics.every(({ passed }) => passed);

if (!canonicalStateCompileCoverage || !canonicalStateRuntimeCoverage || riskTakingFixturePassedCount !== riskTakingFixtureAudit.length) {
  const failures = canonicalStateRuntimeDiagnostics.filter(({ passed }) => !passed).map(({ key }) => key);
  const fixtureFailures = riskTakingFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key);
  throw new Error(`3.12 canonical state or fixture gate failed: ${[...failures, ...fixtureFailures].join(', ') || 'compile-coverage/count-mismatch'}`);
}

const lesson312CorePathSectionIds = new Set([
  'pure-channel-counterfactual', 'risk-taxonomy', 'actor-scope-clocks', 'policy-treatment-passport',
  'safe-yield-target-gap', 'portfolio-substitution', 'margin-franchise-value', 'valuation-measured-risk',
  'policy-put-tail-beliefs', 'risk-hurdle', 'screening-monitoring', 'standards-versus-terms',
  'extensive-intensive-margin', 'origination-vintage', 'intermediary-heterogeneity', 'ex-ante-versus-ex-post',
  'loss-capital-feedback', 'sign-reversal', 'risk-taking-versus-excess', 'measurement-passport',
  'five-estimands', 'identification-falsification',
]);

function RiskTakingConceptSection({ section }: { section: ConceptSection }) {
  const learningTrack = lesson312CorePathSectionIds.has(section.id) ? 'CORE PATH' : 'OPTIONAL DEEP DIVE';
  const [firstParagraph, ...remainingParagraphs] = section.paragraphs;
  return (
    <section className="lesson-section" id={section.id}>
      <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label} · {learningTrack}</p>
      <h2>{section.title}</h2>
      {firstParagraph ? <p>{firstParagraph}</p> : null}
      {section.formula ? <div className="equation-card"><span>{section.formula.label}</span><div><code>{section.formula.expression}</code></div><p>{section.formula.note}</p></div> : null}
      {remainingParagraphs.map((paragraph, index) => <p key={`${section.id}:${index + 1}`}>{paragraph}</p>)}
      {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
      {section.after}
      <p className="section-sources"><b>本节依据：</b> <Cites ns={section.sourceIds} /></p>
    </section>
  );
}

const conceptSections: ConceptSection[] = [
  {
    id: 'pure-channel-counterfactual', number: 2, label: 'Pure Channel Counterfactual',
    title: '风险承担渠道的识别对象不是“贷款多了”，而是可比状态下风险决策规则变了。',
    paragraphs: [
      '设同一家银行面对同一组申请，资金成本、资本与流动性容量、借款人净值、抵押品、产品和决策时钟都保持可比。如果货币政策状态使银行降低风险的影子价格、放宽可接受的决策时违约概率（Probability of Default，PD，以百分点记录）、减少筛选或监控，或者把同一风险收取更少补偿，才出现本章的核心变化。贷款量可以随之改变，却不是定义本身；数量变化而风险排序与阈值不变，仍属于3.10的资金和容量渠道。',
      '现实中这些条件很少天然冻结。降息会同时改善借款人现金流、抬升抵押品、改变存款成本和证券估值，所以“纯渠道”更像一个清楚的反事实坐标，而不是对世界的完整描述。研究可以估计联合效应，但必须列出哪些中介路径被允许变化，并将结果命名为joint-channel；不能一面让资金和借款人状态内生，一面仍声称只识别了风险偏好。',
    ],
    sourceIds: [1, 3, 4, 5],
    formula: { label: '条件反事实', expression: 'ΔRTC θ = θ(m₁ | borrower, funding, capacity, regulation, information set) − θ(m₀ | same states)', note: 'θ可以是筛选、监控、风险加价、非价格条款或风险向量。竖线右侧若没有真正冻结，就要改写为联合渠道。' },
    boundary: '3.10拥有资金、容量与贷款数量；3.11拥有借款人净值、抵押品与真实风险状态。3.12只让中介的风险决策函数内生。',
  },
  {
    id: 'risk-taxonomy', number: 3, label: 'Capacity / Appetite / Perception / Outcome',
    title: '“能承受多少风险”“愿意承担多少风险”“以为风险多大”和“最终损失多少”是四个不同对象。',
    paragraphs: [
      'FSB原则明确区分risk capacity、risk appetite、risk limits与risk profile：capacity是机构在资本、流动性、监管和控制系统约束下最多能够承受的风险，appetite是在不突破capacity的前提下为实现战略与经营目标愿意接受的总体风险类型和总量，limits把它落实为可监控边界。由于业界对risk tolerance用法并不完全统一，本页把它严格约定为围绕具体业务目标可接受的量化偏离，不把它当作appetite同义词。Risk perception是特定模型与信息集对PD、违约损失率（Loss Given Default，LGD，以损失占敞口的百分点表示）、违约时敞口（Exposure at Default，EAD，以金额和币种表示）、波动或尾部损失的判断；risk profile是当前实际暴露；realised risk才是后来发生的违约、核销或损失。',
      '一个常见误判是：模型波动率下降后可持仓规模上升，于是说“风险偏好提高”。更准确的说法可能是风险认知下降或模型给出的容量扩大；若董事会appetite、业务tolerance与尾部权重未变，意愿没有被观察到。本页canonical也不声称观察到董事会总体appetite：它只在相同模型PD、相同capacity和不变PD/tail tolerances下，把一个SYNTHETIC决策账本尾部权重0.4→0.2，作为“appetite怎样可能被翻译进业务规则”的教学代理。没有RAS文本、审批主体/时间和映射规则，就不能把这个参数升级成aggregate appetite。',
    ],
    sourceIds: [1, 2, 23, 24, 27, 41],
    formula: { label: '风险对象分栏', expression: 'capacity boundary → aggregate appetite → business tolerances / risk limits → chosen profile → realised loss', note: '箭头表达治理翻译与时序，不意味着现实银行永不越限；越限应记录为breach，而不是重定义容量。' },
    boundary: '2.16拥有完整risk-limit治理与越限状态机；本章读取容量和限额，只研究政策状态怎样改变风险选择。',
  },
  {
    id: 'actor-scope-clocks', number: 4, label: 'Actor, Scope & Clocks',
    title: '先固定谁在何时为哪本账做决定，才知道所谓“风险增加”落在何处。',
    paragraphs: [
      '银行法人、控股集团、交易台、保险一般账户、养老金计划和货币基金拥有不同负债、监管与决策权。贷款委员会放宽审批、交易台延长久期、资产管理人降低现金、集团把风险转给非银子公司，是四种不同动作。因而最小scope passport要保存法律实体、合并口径、产品、组合、币种、借款人或证券母体、决策人和风险维度。',
      '时钟同样关键：政策公告、市场重估、模型重估、申请、审批、报价、发放、提款与表现期并不同时发生。决策前的内部评级可以测量ex-ante selection；一年后的违约属于performance outcome。把未来违约回填为审批时“已知风险”，会制造前视偏差；把政策前已发生的组合选择当政策反应，则颠倒因果顺序。',
    ],
    sourceIds: [4, 5, 6, 31, 35],
    formula: { label: '最小时序', expression: 'policy information → risk model/version → application → decision/terms → origination → fixed performance window', note: '每一步都要保存event、publication和revision时间；同日数据仍可能需要盘中或批次顺序。' },
    boundary: '跨机构比较必须重写负债和监管护照；不能把银行贷款阈值直接复制给保险、养老金或基金。',
  },
  {
    id: 'policy-treatment-passport', number: 5, label: 'Policy Treatment Passport',
    title: '政策意外、预期路径、长期低利率、资产购买与负利率不是同一个处理变量。',
    paragraphs: [
      '观察到的短期利率水平同时反映央行决策、通胀和增长前景以及金融压力。低利率常常在经济较弱、借款人需求较少、预期违约较高或政策正在缓冲风险时出现；简单比较低利率期与高利率期会把反应函数和经济状态混入渠道。研究必须说明处理是高频政策意外、外部货币锚、预定暴露、政策路径变化，还是仅仅一个描述性低利率状态。',
      '短率下降主要改变浮息与短期安全收益；前瞻指引改变远期路径；资产购买压缩特定期限或资产的期限与流动性溢价；负利率还触发存款利率下限。相同的“100个基点宽松”在不同工具、曲线位置和持续时间下，进入中介资产负债表的入口并不相同，所以policy passport至少要保存工具、surprise/path、期限、公告与实施时点、预期持续期和反事实。',
    ],
    sourceIds: [1, 4, 8, 16, 30, 43],
    formula: { label: '处理向量', expression: 'mₜ = {surprise, expected path, level, duration, purchase composition, negative-rate regime}', note: '把向量压成单一利率会丢失真正暴露；只有3.05或独立识别设计才能授予“政策冲击”身份。' },
    boundary: '本页canonical比较显式标为SYNTHETIC conditional scenario，不声称3%到1%是现实中的已识别政策冲击。',
  },
  {
    id: 'safe-yield-target-gap', number: 6, label: 'Safe Yield & Target Gap',
    title: '安全收益下降只有在目标、费用或承诺具有黏性时，才会形成“为收益而冒险”的缺口。',
    paragraphs: [
      '假设组合只能在安全资产收益yₛ和风险资产承诺收益yᵣ之间分配，机构追求名义目标y*. 当y*短期不动而yₛ下降时，为达到同一承诺收益所需的风险资产权重上升。这可以来自保险保证利率、养老金折现或回报目标、基金费用下限、相对业绩基准，也可以来自管理层奖金；关键不是“投资者喜欢风险”，而是目标调整慢于可得安全收益。',
      '低利率本身并非充分条件。若目标同步下调、风险资产收益也同比下降、机构选择减费或退出、监管限额绑定，组合可保持不变甚至转向安全。计算得到风险权重超过100%时，不应把它截断后宣称目标已实现；那表示在无杠杆约束下目标不可行，真实选择可能是加杠杆、承担其他维度风险、改变承诺或退出业务。',
    ],
    sourceIds: [2, 11, 16, 17, 18, 20],
    formula: { label: '两资产收益目标', expression: 'wᵣ = (y* − yₛ) / (yᵣ − yₛ)', note: '这是承诺收益的教学恒等式，不含违约、相关性、资本、流动性与效用；wᵣ不在[0,1]表示无杠杆组合不可行。' },
    after: <SearchForYieldLab />,
    boundary: '收益目标机制可以解释配置动机，却不能单独证明货币政策外生、风险被错误定价或社会风险过度。',
  },
  {
    id: 'portfolio-substitution', number: 7, label: 'Risk-Adjusted Relative Return',
    title: '真正驱动选择的是扣除预期损失、资本、流动性与尾部代价后的相对回报，而不是票息排序。',
    paragraphs: [
      '高收益资产通常也承担更高的决策时PD、更高LGD、流动性折价、资本占用和尾部共振。预期信用损失若写成金额，就是PD比例×LGD比例×EAD金额；若写成损失率，则只用PD比例×LGD比例，不能再乘一次EAD。PD预测期必须与收益比较期显式对齐：本页候选使用12个月PD、12个月合同期限、100 SYN等EAD与共同币种，所以PD×LGD的12个月损失率可在教学近似下从同期限年化收益中扣除。中介应比较同一期限、币种和敞口基础上的风险调整贡献，再扣资金、运营、资本流动性成本及未预期损失的影子权重。',
      '利差收窄也不自动表示风险被低估。如果宏观支持降低借款人的真实PD、市场流动性改善或期限基准下降，较低利差可能仍给出相同风险调整回报；反之，同一评级桶内的高收益债可能隐藏更高系统性或尾部风险。应联合查看评级、外部市场代理、模型版本、契约、担保和价格组成，而不是从一个spread反推偏好。',
    ],
    sourceIds: [3, 7, 10, 17, 22, 28],
    formula: { label: '风险调整选择量', expression: 'RAR = gross yield − funding − operations − EL − capital/liquidity charge − λ × unexpected-loss proxy', note: 'λ是机构对尾部风险的影子价格；本页算例只展示选择逻辑，不是银行会计利润、监管资本或估计系数。' },
    boundary: '3.10已经拥有完整贷款报价账本；本节只改变风险影子价格或风险选择，不重复计入同一expected loss。',
  },
  {
    id: 'margin-franchise-value', number: 8, label: 'Margin, Franchise Value & Capital',
    title: '利润受压既可能诱发赌博，也可能迫使机构收缩风险；净效应没有固定符号。',
    paragraphs: [
      '当贷款和证券收益随政策利率下降，而零售存款利率受零附近下限约束时，净息差可能压缩。有限责任、奖金或短期回报目标会使股东和管理人尝试用更高风险恢复收益，这是risk-shifting力量。与此同时，较低利润削弱内部资本积累并使违约更昂贵；资本薄弱、融资受限或特许权价值较高的机构可能减少高风险资产以保护生存，这是capacity/retrenchment力量。',
      '因此要分别保存资产收益传递、存款beta和floor、非息收入、拨备、现有资本、可调整的资本结构、特许权价值与监督强度。若资本容量本身因为利润变化而下降，这已经是3.10与3.12联合路径；纯风险偏好实验应冻结容量，只比较机构如何在相同容量内选择。负利率区间的存款下限会放大这种非线性，不能从正利率简单外推。',
    ],
    sourceIds: [3, 12, 13, 14, 15, 27],
    formula: { label: '相反压力', expression: 'Δ risk choice ≈ risk-shifting pressure − capital/franchise retrenchment pressure', note: '这是最终风险选择方向的符号分解而非结构方程；容量收缩项改变可行行为，却不代表风险偏好下降。两项大小依资本、治理、负债和竞争而变。' },
    after: <MarginAmbiguityLab />,
    boundary: '利润与资本变化若进入可贷容量，报告joint-channel并回传3.10；本章不把“压息差”机械翻译为更冒险。',
  },
  {
    id: 'valuation-measured-risk', number: 9, label: 'Valuation & Measured Risk',
    title: '资产升值和低波动能扩张模型给出的风险空间，但“测得更安全”未必等于“真的更安全”。',
    paragraphs: [
      '宽松政策可抬升金融资产价格、压低近期波动和相关性估计，也可改善抵押品与借款人现金流。按市值核算的权益增加、内部PD下降或VaR降低，会让相同损失预算支持更大头寸；这是一条从估值和测量进入风险配置的路径。它可能反映真实风险改善，也可能只反映短样本、平静期数据或模型对尾部结构变化不敏感。',
      '课堂中用loss budget除以“置信倍数×当前波动”展示模型容量，但必须同时保留压力损失上限。当前波动从8%降到4%会使模型容量翻倍，若25%的压力损失仍在，稳健容量仍由压力情景约束。在获准使用内部模型法的交易账簿市场风险资本计算中，Basel MAR33使用97.5%单尾expected shortfall并按流动性期限调整；这不是银行账簿信用风险或全机构appetite公式，页面的简单波动预算更只是机制教学。',
    ],
    sourceIds: [1, 22, 23, 24, 27, 42],
    formula: { label: '模型与压力双门', expression: 'robust exposure = min(loss budget / model loss rate, loss budget / stress loss rate)', note: '压力门不保证覆盖所有尾部；它只防止近期低波动机械放大头寸。监管口径另有完整规则。' },
    after: <MeasuredRiskOverlayLab />,
    boundary: '资产价格和借款人净值真实改变时路由3.11；杠杆、保证金与火售反馈路由7.12–7.13。',
  },
  {
    id: 'policy-put-tail-beliefs', number: 10, label: 'Policy Put & Tail Beliefs',
    title: '对未来托底的信念会降低私人承担的尾部权重，但利率低并不证明存在“央行put”。',
    paragraphs: [
      '如果中介相信系统性下跌时央行、政府或担保体系会稳定融资、资产价格或债权人，其私人预期损失可能小于社会总损失。有限责任与共同救助预期还会造成战略互补：每家机构都持有相似流动性错配或尾部资产，因为大家相信系统性状态会触发支持。政策反应函数因此可以影响风险选择，即使当期政策工具没有改变。',
      '但这种机制需要可观察的制度承诺、历史干预、市场定价或调查信念，不能由“股价在降息后上涨”倒推。稳定市场也可能降低真实清算损失、改善旧资产价值并减少风险；是否产生道德风险取决于谁被保护、损失由谁承担、干预是否有条件以及管理层权益是否被稀释。',
    ],
    sourceIds: [1, 16, 25, 27, 28],
    formula: { label: '私人尾部权重', expression: 'private tail cost = social tail loss × (1 − expected transferred-loss share)', note: '这是概念分解；转移份额必须来自制度与预期证据，不能假设为正，更不能当作央行承诺。' },
    boundary: '系统共同暴露、救助博弈与危机福利属于3.24和Chapter 7；本节只说明信念怎样进入个体风险门。',
  },
  {
    id: 'risk-hurdle', number: 11, label: 'Risk Hurdle',
    title: '总体风险偏好只有经过治理映射才会进入具体审批门；本页只移动一个合成的决策账本尾部权重。',
    paragraphs: [
      '风险偏好不是抽象情绪。机构层面的aggregate appetite必须经风险偏好声明、批准职责、业务限额和定价/审批规则向下翻译，候选项目才会面对可执行的hurdle、决策时PD上限、增量尾部预算、集中度和行业限额。PD上限和尾部预算是本例冻结的operational tolerances；移动的λ只是一个SYNTHETIC decision-book appetite-translation参数。三门必须同时通过，但这个业务参数本身不能反推董事会总体意愿。',
      '本页canonical例子把3.10的3.4个百分点边际资金成本按identity映射到两个候选项目，并把两个项目都定义为100 SYN、同币种、同一等EAD的一年期bullet-loan基础；决策PD均为12个月预测期，所以PD×LGD得到的12个月损失率才可与年化收益和费用在该教学期限上比较。预期损失模型、候选现金流、PD上限6、尾部代理预算5、压力容量、监控强度0.8和借款人状态均冻结；唯一移动项是决策账本尾部权重0.4→0.2。安全项目在两种状态都通过三门；风险项目的风险调整贡献从−0.1升至0.7并跨过0.5回报门，而PD与尾部预算门始终通过。这里没有观察到RAS、董事会批准或现实银行参数，也不说明新增风险有社会净成本。',
    ],
    sourceIds: [3, 4, 5, 7, 29, 41],
    formula: { label: '审批门', expression: 'Approve = 1{risk-adjusted contribution ≥ hurdle, decision PD ≤ PD cap, incremental tail loss ≤ budget}', note: '三门都是必要条件；改变资金容量或借款人真实PD时，纯渠道假设失效。' },
    after: <RiskAdjustedSelectionLab />,
    boundary: 'canonical候选簿与3.11已有设施分开标识；3.11的硬提款上限为0，不能伪称FIRM_1在此获得新增贷款。',
  },
  {
    id: 'screening-monitoring', number: 12, label: 'Screening & Monitoring',
    title: '放松筛选改变谁进入组合，减少监控改变进入以后项目如何演化；两者不能合成一个“标准”。',
    paragraphs: [
      'Screening发生在决策前：核验收入、现金流、抵押权、管理质量和项目用途，决定对哪些申请继续尽调、批准或拒绝。Monitoring发生在存续期：收集财报、检查契约、限制资产替换、督促纠偏或重谈。宽松环境可能降低两者的私人边际收益，使较不透明或风险更高的申请进入，并让同一借款人在贷后获得更大行为自由。',
      '筛选与监控也可能加强。银行若利润和资本更脆弱、特许权价值高、监督趋严或早期预警恶化，会在低利率下投入更多监控，甚至减少总贷款。实证上应分别找尽调时间、文件要求、审批层级、内部评级覆盖、契约频率、例外批准和贷后审查，而不能用后来的违约率反推当时投入了多少监控。',
    ],
    sourceIds: [3, 5, 7, 10, 29],
    formula: { label: '两个边际', expression: 'selection risk = f(screening before approval); performance risk = f(selection, monitoring after approval, borrower shocks)', note: '后续违约同时含选择、监控和环境，不能单独识别任何一个分量。' },
    boundary: '借款人信息真实性和抵押可执行性由3.11提供；本节只研究贷款人投入多少筛选与监控。',
  },
  {
    id: 'standards-versus-terms', number: 13, label: 'Standards / Terms',
    title: 'Credit standards决定谁能进入；terms决定获批者以什么价格、额度、期限与保护条款进入。',
    paragraphs: [
      '贷款标准是内部批准准则，例如最低评级、PD上限、行业准入、文件要求或抵押资格，主要作用于extensive margin。条款是在已经考虑或批准贷款之后给出的价格和非价格条件，包括相对高风险贷款加价、费用、额度、到期日、契约、担保、提款条件和摊还结构，主要作用于intensive margin。放宽标准但收紧条款，或者标准不变但降低高风险加价，都可能发生。',
      'SLOOS与ECB BLS把标准、条款、需求和原因分开询问，提供了重要描述入口；净比例却只是报告收紧的银行占比减报告放松的银行占比。它不告诉我们每家银行改变了多少基点、多少额度或多少笔贷款，也不等于政策因果效应。研究需要回到问题原文、条件分母、贷款类别、银行样本与回顾窗口。',
    ],
    sourceIds: [8, 10, 31, 32],
    formula: { label: '调查净比例', expression: 'net tightening = % reporting tightened − % reporting eased', note: '它测方向的广度，不测平均幅度；正值也不是贷款数量下降的百分比。' },
    boundary: '报价的资金、资本和费用分解留在3.10；3.12只问风险补偿与风险保护相对同风险候选是否改变。',
  },
  {
    id: 'extensive-intensive-margin', number: 14, label: 'Extensive / Intensive Margin',
    title: '风险承担既可来自新增高风险借款人获批，也可来自同一借款人的条款变松。',
    paragraphs: [
      'Extensive margin回答“谁从拒绝变成批准、谁进入资产池”；intensive margin回答“对仍获批的同一借款人，利差、额度、期限、抵押、契约或监控怎样改变”。如果高风险申请者被拒绝，获批贷款平均利差可能下降，即使银行对给定风险要求的加价更高；如果申请构成变差，高风险获批占比也可能上升，即使审批规则完全不变。',
      '因此申请、审批、承诺、发放、提款、余额和存续样本要分别保存。申请母体用于识别接受阈值，已获批样本用于条款，但后者存在选择；存量余额混合旧vintage、偿还、出售、核销和估值，不能替代新发放决策。最有力的设计常在同一借款人、同一时点比较不同银行，但仍只覆盖多银行借款人的共同支持。',
    ],
    sourceIds: [5, 7, 8, 31, 34],
    formula: { label: '漏斗分账', expression: 'applications → considered → approved → committed → originated → drawn → outstanding → surviving', note: '每一箭头都有选择和时钟；分母改变时，estimand也随之改变。' },
    boundary: '总贷款余额属于多条流量和存量路径的结果；不能仅凭余额增长给风险偏好贴标签。',
  },
  {
    id: 'origination-vintage', number: 15, label: 'Origination Vintage',
    title: '事前风险必须在决策时信息集上衡量，并按新发放vintage固定分母。',
    paragraphs: [
      '若要判断银行是否选了更风险的贷款，应使用批准前可得的内部评级、模型PD、外部评分、担保、杠杆或收入波动，并在同一模型版本和预测期限下比较。新发放组合的EAD加权PD比简单贷款笔数平均更接近损失暴露，但仍只是模型估计；评级迁移、模型换版和缺失PD必须单列。',
      '随后观察违约时，要固定origination vintage与表现期限。刚发放贷款没有足够时间违约，长期存续贷款又经过幸存者选择；把二者混在当期NPL会产生右删失和vintage composition bias。正确做法是预先定义12个月或24个月表现窗，处理提前偿还、出售、重组与数据消失，并保留decision-time risk与realised outcome两张表。',
    ],
    sourceIds: [4, 5, 6, 9, 35, 37],
    formula: { label: '新发放事前风险', expression: 'PD̄origination = Σ(EADᵢ × PDᵢ at decision) / ΣEADᵢ', note: '分母仅含定义好的新发放vintage；不能换成申请者、存量贷款或表现期幸存者。' },
    boundary: '内部PD是带模型版本的perception；最终违约是realisation，两者差异既可能来自模型误差，也可能来自政策后的借款人环境。',
  },
  {
    id: 'intermediary-heterogeneity', number: 16, label: 'Intermediary Heterogeneity',
    title: '资本、负债结构、商业模式、治理与监督共同决定同一政策输入的方向。',
    paragraphs: [
      '资本充足机构有空间扩大风险，也有更多自有资本承担损失；高杠杆机构受有限责任激励更强，却可能因为接近约束而无力增加风险。高存款银行在正利率下可享受较低且黏性的资金，在负利率下却因难以向零售存款传递负利率而承受更强利润压力。关系银行、证券交易机构、保险和开放式基金的收入、退出选项与风险期限也不同。',
      '治理与监督会改变激励的落地。董事会风险声明、薪酬递延、独立风险职能、现场检查、资本要求和LTV等宏观审慎工具可以限制或重定向收益追逐；竞争与市场势力又改变贷款利润和客户替代。任何平均系数都应至少按资本、存款依赖、规模、业务模式、监督强度和危机状态报告异质性与共同支持。',
    ],
    sourceIds: [3, 4, 10, 12, 14, 15, 29, 41],
    formula: { label: '条件反应', expression: 'Δ risk choice = f(policy × capital × funding structure × business model × governance × supervision × state)', note: '交互项不是随意分组；每个状态必须在处理前定义，并有足够重叠。' },
    boundary: '当资本或资金状态是政策传导的中介而非预定异质性，估计的是联合渠道，不能把post-treatment control塞进回归后仍称纯效应。',
  },
  {
    id: 'ex-ante-versus-ex-post', number: 17, label: 'Ex-Ante Selection / Ex-Post Default',
    title: '新贷款事前风险上升与旧贷款当期违约下降可以同时成立。',
    paragraphs: [
      '宽松政策可能降低借款人的利息负担、改善收入和抵押品价格，使既有贷款在短期更容易偿付；它也可能提高金融机构旧资产价值和资本。与此同时，更低安全收益、较松风险门或较少监控会让新vintage包含更高事前PD的借款人。一个是performance/support effect，另一个是selection effect，方向相反并不矛盾。',
      'SYNTHETIC反例把风险贷款份额从20%提高到40%，却同时把安全与风险组在同一固定表现窗观察到的实现违约率从1%/8%降到0.5%/4%。按等EAD权重聚合的组合实现违约率因而从2.4%降至1.9%。若只看NPL会误说风险承担下降；若只看风险份额又会忽略政策对借款人偿付的短期支持。两者必须使用不同估计量和时钟；这些比例不换写成离散违约笔数。',
    ],
    sourceIds: [5, 6, 16, 26, 36, 37],
    formula: { label: '两种变化', expression: 'Δ realised default = selection-composition effect + borrower-support effect + monitoring effect + shocks', note: '这是一项分解清单，不代表四项天然可被数据独立识别。' },
    after: <ExAnteExPostLab />,
    boundary: 'ex-post NPL、核销与损失只能辅助验证，不能成为事前风险承担的唯一代理。',
  },
  {
    id: 'loss-capital-feedback', number: 18, label: 'Loss / Capital Feedback',
    title: '新vintage的损失会反馈利润、资本和下一轮风险空间，但单家机构闭环还不是杠杆周期。',
    paragraphs: [
      '风险选择先改变组合的损失分布。违约和减值消耗利润与资本，融资提供者可能提高价格或缩短期限，监督者也可能要求修复；这些变化回到3.10的资金与容量，再影响下一轮贷款和证券选择。若政策在压力时支持资产价格或融资，损失反馈又可能被延缓或重新分配。',
      '本章只保留这条局部反馈及其接口，不展开资产出售如何影响市场价格、价格如何触发保证金、其他机构如何同步去杠杆。只有当多个中介的杠杆、价格与融资约束形成内生共振，才进入3.14、3.15、7.12与7.13。把任何一次坏账后的缩表都称为“leverage cycle”会失去机制边界。',
    ],
    sourceIds: [1, 11, 23, 24, 27, 36],
    formula: { label: '局部反馈', expression: 'risk selectionₜ → vintage lossₜ₊ₕ → profit/capital/funding → capacityₜ₊₁ → next risk choice', note: '这里只保存机构内部有向链；价格冲击与跨机构网络是下游模块。' },
    boundary: '利润、资本和资金一旦变化，下一轮状态由3.10重新计算；强制销售与价格冲击由7.12–7.13拥有。',
  },
  {
    id: 'sign-reversal', number: 19, label: 'Sign Reversal',
    title: '“低利率→风险上升”只是若干力量占优时的条件结论，不是金融学恒等式。',
    paragraphs: [
      '风险上升更可能出现在安全收益下降而目标黏性强、机构资本仍有空间、有限责任或短期薪酬重要、模型测得风险下降、监督较松、尾部支持信念强时。风险下降更可能出现在利润和资本受压导致约束趋紧、特许权价值高、存款下限造成缩表、监督与宏观审慎收紧、目标可调整或机构选择退出时。多股力量接近时，净反应可以不显著。',
      '经验文献中的异质结果不是“谁对谁错”的简单冲突，而是提醒研究者保存制度和状态。负利率、危机、非常规政策、Basel规则变化与普通正利率降息不是同一处理；银行、保险、养老金和基金也没有共同目标函数。好的结论应写成“在何种样本、制度、风险维度和时钟上，哪个机制占优”，而不是写成无条件口号。',
    ],
    sourceIds: [3, 4, 12, 13, 14, 16, 26, 27],
    formula: { label: '符号账本', expression: 'sign(Δ risk) = sign(target-gap + risk-shifting + measured-space + put-belief − retrenchment − franchise-value − supervision)', note: '加减号只表示方向；不能把不可比机制相加成真实分数，必须逐项测量或做情景边界。' },
    boundary: '任何结论都要报告零效应和反向效应的可检验条件；“可能”不能成为永不失败的叙事。',
  },
  {
    id: 'risk-taking-versus-excess', number: 20, label: 'Risk-Taking ≠ Excessive Risk',
    title: '承担更多风险可能是有效信用修复，也可能是外部性；福利判断需要额外模型。',
    paragraphs: [
      '衰退后放宽过度保守的标准，向有正NPV但短期受压的借款人提供信用，可能提高产出并降低长期违约。即使新贷事前PD上升，也不意味着银行错误决策：较高收益可能充分补偿风险，机构资本和治理能够吸收损失，借款项目还有社会收益。Risk-taking描述选择变化，excessive risk则要求相对于明确社会基准存在过量。',
      '要称“过度”，至少需要识别存款保险或救助造成的风险转移、火售和网络传染外部性、共同尾部风险、错误风险权重、代理薪酬或借款人配置损失，并比较政策的稳定与脆弱性效应。监管口径风险下降也不保证资源配置改善；反过来，风险上升也不必然增加系统危机概率。',
    ],
    sourceIds: [16, 25, 26, 27, 28, 29],
    formula: { label: '规范门', expression: 'excess = private chosen risk − socially optimal risk under stated externalities and distributional weights', note: '没有社会目标、外部性和反事实，就只能报告风险选择，不能计算“过度”。' },
    boundary: '货币政策与宏观审慎的规范权衡路由3.24；本章交付机制、暴露和可证伪条件，不替政策做价值判断。',
  },
  {
    id: 'measurement-passport', number: 21, label: 'Measurement Passport',
    title: '每个风险指标都要保存概念、分母、阶段、模型版本、预测期与信息集。',
    paragraphs: [
      '信用风险可以用内部评级、决策时PD、外部评分、预期损失、风险贷款占比、违约或核销表示；久期、流动性、外汇、集中度、尾部、杠杆和对冲又需要不同单位。一个平均“risk score”会掩盖迁移：银行信用门不变，却可能延长久期、降低流动资产或集中于同一系统因子。因而风险应保存为向量，并允许某些维度为not-collected。',
      'passport还必须说明模型是否IRB、评级方向、PD是百分点还是比例、PD预测期、LGD情景、EAD金额与币种、合同期限和产品暴露基础、评级生效日、是否含担保、分母是申请/发放/余额/存续、金额或笔数权重、stock或flow、法人或集团以及修订。PD预测期回答“未来多久可能违约”，origination response window回答“在哪段时间收集政策后的发放”，两者不能互相替代。模型换版造成PD整体下降时，不能说真实风险下降；应在共同旧模型上回算或保留break。',
    ],
    sourceIds: [4, 5, 17, 24, 26, 35, 37, 38, 39, 40],
    formula: { label: '风险向量', expression: 'R = (credit, duration, liquidity, FX, concentration, tail, leverage, hedging)', note: '各分量单位不同，不能未经标准化和经济权重就相加；缺失不是零。' },
    boundary: '监管RWA、内部模型风险和真实尾部损失永久分栏；任何映射都要保存规则版本与生效日。',
  },
  {
    id: 'five-estimands', number: 22, label: 'Five Estimands',
    title: '偏好、选择、条款、组合和实现损失必须各自定义反事实并独立升级证据等级。',
    paragraphs: [
      'Appetite-translation estimand问政策状态如何改变SYNTHETIC决策账本的尾部风险权重，而不把它伪装成已观察的董事会aggregate appetite；selection estimand固定在新发放EAD分母上问决策时12个月加权PD，且把PD预测期与origination response window分别保存；terms estimand只问获批报价相对匹配基准的年化all-in风险价格；portfolio estimand问新发放EAD中预先定义的高风险类别份额；realised-loss estimand问固定vintage在12个月表现窗的累计实现违约率。它们可能沿同一链相连，却各自只有一个结果和一个分母，绝不能用一个结果替代另一个。',
      '每个estimand都显式保存处理定义与尺度、结果、分母、单位、样本时钟、期限、支持总体、估计值、标准误单位、聚类层级与关键假设。未知量用null而不是省略。某项贷款级设计能识别selection，不自动识别董事会appetite；调查报告risk tolerance原因，也不能直接写入本页operational tolerance或aggregate appetite字段；计算器复算通过更不授予因果身份。本页canonical只有观察利率水平的合成对照，冲击外生性与预定暴露两门失败，故设计状态只是mechanism-consistent；五个估计量仍全部descriptive，estimate、standard error和clustering均为空。',
    ],
    sourceIds: [4, 5, 7, 8, 22, 31, 32],
    formula: { label: '五个反事实', expression: 'τtranslation, τselection, τterms, τportfolio, τloss — each with its own outcome, denominator and horizon', note: '“同一个政策”不意味着五个效应共用样本、时钟或识别假设；τtranslation不等于董事会aggregate appetite。' },
    boundary: '证据等级为descriptive、mechanism-consistent、identified-candidate、identified；只有真实估计与审计完成才可逐项升级。',
  },
  {
    id: 'identification-falsification', number: 23, label: 'Identification & Falsification',
    title: '识别要求同时解决政策内生、申请需求、机构容量、时钟和支持集，并允许机制被否证。',
    paragraphs: [
      '可行设计包括高频政策意外乘以处理前中介暴露、美元化经济体的外部货币锚、同一借款人同一时点面对不同银行、监管或制度阈值，以及贷款申请级别的批准比较。它们各有代价：高频冲击不必代表长期低利率，外部锚仍可能有全球共同冲击，同借款人固定效应只覆盖多银行关系且不能吸收产品特定需求，制度阈值需要排除同期改革。',
      '十一道最低门包括：处理在结果前定义；政策冲击外生性成立；中介暴露预定；申请或借款人需求受控；资金和容量冻结或建模；借款人真实风险冻结或建模；使用事前风险结果；共同支持成立；事件—决策—表现时钟有序；不加入处理后控制；推断与处理分配匹配。还应预注册安慰剂：政策前趋势、无暴露资产、不会受该工具影响的期限、模型版本假变化和未获批申请构成。任一关键门失败就降级并说明还能支持什么。',
    ],
    sourceIds: [4, 5, 7, 8, 12, 15, 19, 29],
    formula: { label: '失败优先', expression: 'identified candidate only if all 11 gates pass; a passed design gate still does not create an estimate', note: '“处理先于结果”与“冲击外生”是两道不同的门；门禁检查设计的必要条件，不证明排除限制真实成立，最终identified还需要估计、稳健性与审计。' },
    after: <RiskTakingIdentificationLab />,
    boundary: '结构政策冲击与外部有效性最终由3.05、3.23和Chapter 7研究层授权；本页只建立可失败的候选设计。',
  },
  {
    id: 'negative-rate-nonlinearity', number: 24, label: 'Negative Rates',
    title: '负利率通过存款利率下限制造特殊非线性，可能出现“少贷而更冒险”。',
    paragraphs: [
      '零售存款具有现金替代、客户关系和声誉约束，银行往往不愿把负政策利率完全传递给存款人。当资产收益继续下降而存款成本停在floor附近，高存款银行的相对资金成本和净值受压；它们可能减少贷款总量，同时把有限贷款配置给收益更高、风险也更高的借款人。数量方向和风险构成方向因此可以分叉。',
      '这一结果依赖负利率制度、存款依赖、银团贷款样本和处理前资产负债表，不能成为普通降息的线性规律。若银行收取账户费、转向批发融资、资本充足或政策附带定向融资，传递会改变；模型中的reversal threshold也不是央行可直接观察的一条固定利率线。',
    ],
    sourceIds: [12, 13, 14, 15],
    formula: { label: '存款floor', expression: 'deposit rate after = max(contractual/effective floor, deposit rate before + beta × policy change)', note: 'floor一旦绑定，资产与负债收益传递不再对称；仍需另行判断风险转移和收缩谁占优。' },
    boundary: '负利率机制属于3.12扩展，不允许外推至正利率，也不替代3.10的完整资金结构分析。',
  },
  {
    id: 'nonbank-search-for-yield', number: 25, label: 'Insurance / Pension / Funds',
    title: '非银机构的收益追逐来自不同负债与退出约束，不能套用银行模型。',
    paragraphs: [
      '寿险一般账户面对长期保证负债和资产再投资收益下降，养老金面对资金缺口、折现和出资人财政状态，货币基金面对费用与非负净收益约束，开放式债券基金还面对业绩流入和赎回。安全收益下降时，它们可能分别增加信用风险、久期、私募和非流动资产，降低现金，减费或退出。相同的“search for yield”标签背后是不同目标函数。',
      '证据也并非一致：保险在同一评级桶内偏好高收益债，部分养老金在低利率和低资金率下增险，货币基金有的转向风险资产、有的退出；非常规政策同时可能通过旧资产升值改善寿险和银行偿付能力。跨机构比较必须固定账户、负债保证、监管桶、赎回、费用和样本期，不能把一种机构的反应当作整个金融系统的平均。',
    ],
    sourceIds: [16, 17, 18, 19, 20, 21, 27, 40],
    formula: { label: '机构护照', expression: 'risk choice = f(liability promise, target rigidity, redemption/exit, regulation, accounting, governance)', note: '同一安全收益变化只有经过各自负债和制度，才成为可比较的风险激励。' },
    boundary: '开放式基金赎回、流动性错配和价格影响路由7.11–7.13；这里只到个体配置选择。',
  },
  {
    id: 'securitization-risk-transfer', number: 26, label: 'Securitisation & Risk Transfer',
    title: '出售、对冲或证券化会改变谁持有风险，却不会让系统风险凭空消失。',
    paragraphs: [
      'Originate-to-distribute使银行在发放后出售贷款、购买信用保护或通过显著风险转移释放资本。若发起人保留更少尾部暴露，筛选与监控激励可能减弱；若保留首损、声誉或回购义务，激励仍可能存在。资产购买和低收益环境也可能提高非银对证券化资产的需求，从而反向改变发起标准。',
      '分析必须做风险守恒账本：发起额等于银行未对冲保留、贷款买方持有和保护卖方承担之和，同时另列担保、相关性、基差与表外承诺。银行RWA下降不等于系统尾部风险下降；风险可能迁移到透明度更低、赎回更快或杠杆更高的持有人。只有追踪最终持有人，才能讨论监管边界迁移。',
    ],
    sourceIds: [8, 15, 17, 27, 32, 33, 39, 40],
    formula: { label: '风险守恒', expression: 'originated exposure = bank unhedged retention + loan buyers + protection sellers', note: '若账本不闭合，通常遗漏表外担保、回购、分层或双重计量；闭合也不表示风险质量相同。' },
    after: <RiskTransferLab />,
    boundary: '资本释放后的贷款容量由3.10重算；非银赎回、杠杆和火售反馈由Chapter 7拥有。',
  },
  {
    id: 'ratings-regulation-arbitrage', number: 27, label: 'Ratings, RWA & Regulatory Buckets',
    title: '评级桶和风险权重会塑造选择；桶内高收益、模型变更与担保都可能隐藏风险迁移。',
    paragraphs: [
      '监管资本和投资规则常按评级、抵押、期限或风险权重分桶。机构可以在同一资本成本桶内选择收益更高、CDS更宽或系统性更强的证券；银行也可能偏向具有政府担保或低监管权重但生产率较低的借款人。表面RWA下降可能来自真实风险改善、担保、组合变化、模型更新或规则套利，含义完全不同。',
      '因此要保存内部评级与外部评级、模型版本、生效日期、监管方法、担保人与最终债务人、before/after映射以及固定模型回算。监管和监督变化本身也是处理，不应悄悄归因于货币政策。2026年的中国贷款级证据提供重要反例：监管测量风险可下降，同时资源错配上升；它不能跨法域外推，却足以否定“RWA下降=一切更安全”。',
    ],
    sourceIds: [17, 26, 28, 29, 35, 37, 38],
    formula: { label: '三张风险表', expression: 'internal model risk ≠ regulatory-weighted risk ≠ realised social tail loss', note: '三者可以相关；任何等号都需要稳定映射与外部验证。' },
    boundary: '宏观审慎规则的最优设计路由3.24；本节只说明规则怎样改变风险选择与测量。',
  },
  {
    id: 'cross-border-spillovers', number: 28, label: 'Cross-Border & Currency',
    title: '政策状态与跨境风险可以联动，但方向不能预设；国籍、所在地、币种与最终担保人必须分别保存。',
    paragraphs: [
      '政策状态、全球银行资产负债表、基金跨境配置和资金货币可以同时变化，但本页现有证据不授予“本国宽松必然增加海外贷款”的方向性因果结论。基金论文只覆盖其特定样本与配置边际，BIS合并银行统计则是敞口总量背景。风险可能表现为借款人信用、外汇错配、期限、国家集中度或最终担保人暴露；即期借款人所在地与风险最终归属也不相同。',
      'BIS CBS可以按银行国籍、交易对手国家/部门及即时借款人或最终担保人基础描述合并国别风险，却不直接观测审批阈值，也不提供通用币种分解。资金币种与资产币种必须来自BIS LBS或另一份明示来源；LBS的所在地/非合并口径不能与CBS的国籍/合并口径无条件拼接。识别还需分别处理贷款人国与借款人国政策、母行冲击、当地需求和资本管制。完整网络传导属于Chapter 4，本节只输出带passport的风险向量和缺失键。',
    ],
    sourceIds: [19, 20, 21, 39],
    formula: { label: '跨境键', expression: 'exposure = bank nationality × borrower residence × funding currency × asset currency × immediate/final-risk basis', note: 'CBS只能闭合其中部分键；币种需另接LBS或其他来源，且必须保留统计口径差异。' },
    boundary: '本节不估计Global Financial Cycle；完整跨资产、跨国家传播路由Chapter 4。',
  },
  {
    id: 'macroprudential-welfare', number: 29, label: 'Monetary / Macroprudential Interaction',
    title: '监督与宏观审慎可以抵消、重定向或迁移风险；政策组合要同时看稳定和配置。',
    paragraphs: [
      '资本、LTV、风险限额、现场监督、流动性规则和薪酬治理可以使银行在同一货币环境下保持更严格筛选，也可能把活动迁移到证券化、基金或海外实体。更严规则提高韧性，却可能在短期压低信贷；宽松货币支持需求和偿付，却可能增加某些中介的收益追逐。政策之间既有互补，也有短期权衡。',
      '规范决策不能只盯平均贷款风险。还要比较真实活动、借款人支持、资源配置、资本缓冲、尾部共同暴露和风险迁移，并明确分配权重。风险承担渠道告诉我们哪条行为边际可能被触发，却不自动推出应该加息或收紧监管；“lean versus clean”的结论需要完整福利与工具有效性分析。',
    ],
    sourceIds: [8, 25, 26, 27, 28, 29],
    formula: { label: '政策组合', expression: 'net welfare = stabilisation benefits − private losses − externalities − allocation costs, under instrument constraints', note: '没有可估计的各项和社会权重时，只能做机制与情景分析，不能给出唯一最优政策。' },
    boundary: '政策福利、工具分工和宏观审慎设计交给3.24；本章以可检验风险决策与迁移接口结束。',
  },
];

const checks = [
  { question: '为什么“贷款增加”不能单独证明风险承担渠道？', answer: '贷款量可以只因资金成本下降或资本、流动性容量扩大而增加。3.12要求在这些可行集合以及借款人状态可比时，观察风险影子价、筛选、监控、条款或组合排序本身改变；否则应标为3.10、3.11或joint-channel。', sourceIds: [1, 3, 4] },
  { question: 'risk capacity 与 risk appetite 的最短区别是什么？', answer: 'Capacity回答“制度、资本、流动性和控制系统最多允许多少”；appetite回答“在这个边界内，机构事先愿意承担什么风险”。模型容量上升不等于意愿上升，意愿上升也不创造容量。', sourceIds: [1, 23, 24, 27] },
  { question: '为什么观察到低利率不能直接称为货币政策冲击？', answer: '利率水平也反映增长、通胀、风险与央行反应函数。处理必须区分意外、预期路径、水平、持续期、资产购买与负利率制度；只有额外识别设计才能把相关性升级为政策效应。', sourceIds: [1, 4, 8, 30] },
  { question: '平均贷款信用评级不变，风险承担仍可能增加吗？', answer: '可以。机构可能延长久期、降低流动资产、增加外汇错配、集中度、尾部共振、杠杆或减少对冲。风险必须保存为向量，未收集维度不能填成零。', sourceIds: [17, 20, 23, 27, 39] },
  { question: '安全收益1%、风险收益4%、目标5%时，为什么不能直接写风险份额100%？', answer: '两资产无杠杆恒等式给出 (5−1)/(4−1)=4/3，目标落在可行凸组合之外。把显示值截成100%会隐藏缺口；必须明确选择加杠杆、换资产、降低目标或退出，而不能让计算器代替机构决策。', sourceIds: [2, 11] },
  { question: '为什么高票息资产不一定更符合收益目标？', answer: '票息还要扣资金、运营、预期损失、资本和流动性费用，以及尾部风险影子价。在共同影子价0.4下，合成安全项目贡献0.5pp而高风险项目为−0.1pp；后者票息更高，却因预期与尾部损失更大而被拒绝。', sourceIds: [3, 4, 17] },
  { question: '存款利率下限为什么可能让低利率的风险反应变号？', answer: '资产收益继续下降而零售存款成本难以下调时，息差压缩既可能诱发股东逐利，也可能削弱资本积累、迫使银行保护特许权价值和容量。净符号取决于资本、治理、负债与监督，负利率结果不能线性外推。', sourceIds: [3, 12, 13, 14] },
  { question: '测量波动从8%降到4%，为何稳健敞口可能仍是40？', answer: '预算10、倍数2.5时模型上限从50升到100；但若压力损失率固定25%，压力上限一直是40。稳健门取较小者，所以低后视波动只放松模型门，不能证明真实尾部风险或稳健容量改善。', sourceIds: [22, 23, 24] },
  { question: 'standards 与 terms 分别观察哪一个边际？', answer: 'Standards决定申请是否进入可接受集合，主要是extensive margin；terms是在批准条件下决定价格、额度、期限、抵押与契约，属于intensive margin。只看获批合同会遗漏因标准变化而消失的申请者。', sourceIds: [5, 8, 31, 32] },
  { question: '申请100、批准70、发放64时，为什么64/100与64/70不能互换？', answer: '64/100是申请到发放的联合通过率，64/70是获批后的接受与完成率。政策可能分别改变申请、批准、签约、提款与存续；换分母就换了estimand和支持总体。', sourceIds: [5, 7, 31, 34] },
  { question: '高风险份额20%升到40%，为什么组合违约率仍可从2.4%降到1.9%？', answer: '若支持性状态把安全/风险组在同一固定表现窗观察到的实现违约率从1%/8%降到0.5%/4%，构成更冒险但组内实现风险下降得更多。选择时风险与表现期结果使用不同信息集，NPL下降不能反推审批更保守。', sourceIds: [5, 6, 16] },
  { question: 'same-borrower × time 固定效应关闭了什么，又没有关闭什么？', answer: '它能在多银行借款人支持集中吸收借款人当期共同需求与风险，却不吸收产品特定需求、银行—借款人关系匹配、选择进入多银行样本或银行自身处理后容量变化；外部有效性也不会自动获得。', sourceIds: [4, 5, 7, 29] },
  { question: '内部PD整体下降时，为什么不能立刻说真实风险下降？', answer: '模型版本、输入窗口、担保映射和评级方法都可能改变测量。应保留旧新模型、生效日、评级方向，并在共同模型上回算；内部风险、监管风险权重与真实尾部损失要分栏。', sourceIds: [24, 26, 29, 35] },
  { question: '发起100、保留20、出售80、购买10保护后，系统风险账本如何闭合？', answer: '银行未对冲为10，贷款买家持有80，保护卖方承担10，最终持有人合计仍为100。守恒只针对基础名义敞口；对手方违约、基差、相关性与再证券化仍需另建状态。', sourceIds: [8, 15, 17, 27] },
  { question: '负利率研究为什么不能直接外推到普通正利率降息？', answer: '负利率触发零售存款利率floor和特殊盈利压力，处理、样本和制度均不同。高存款银行“少贷而更冒险”的局部结果并不是任意利率区间的线性规律。', sourceIds: [12, 13, 15] },
  { question: 'risk-taking 为什么不等于 excessive risk-taking？', answer: '前者描述选择或风险向量变化；后者需要明确社会基准、外部性、隐性担保、网络损失和配置权重。新贷事前PD上升可以是有补偿且有效的信用修复，不能仅凭方向作福利判断。', sourceIds: [16, 25, 26, 27, 28] },
  { question: 'ECB BLS 的 WFNET=+5 最窄可说什么？', answer: '按该题方向，只能说受访银行以ECB原词bank’s risk tolerance报告其对企业信贷标准收紧有正的加权净贡献。这是广义供给侧意愿信号，不是贷款量下降5%、标准强度提高5%、违约率、canonical PD/tail tolerance、董事会aggregate appetite或货币政策因果效应。', sourceIds: [32] },
  { question: '为什么通过11/11识别闸门仍只叫 identified-candidate？', answer: '十一门全过只验证已声明设计的必要条件，仍不等于真实估计、标准误、稳健性和排除限制已经审计。本页canonical连这一等级也没有：观察利率水平缺少冲击外生性与预定暴露，只通过9/11并保留mechanism-consistent；五个estimand仍各自为descriptive。', sourceIds: [4, 5, 7, 8] },
] as const;

const glossary = [
  ['Risk capacity', '资本、流动性、监管与控制系统给出的可行风险上限', 'risk appetite；前者是“能”，后者是“愿意”', '§03'],
  ['Risk appetite', '董事会或委托人事先愿意承受的风险类型与水平', 'observed profile；意愿不等于已经持有', '§03'],
  ['Risk tolerance', '本页canonical约定为围绕具体业务目标可接受的局部量化偏离，并由风险限额落实；ECB同名来源词单独保存为广义自报信号', 'risk appetite或ECB调查原词；三者不得自动互相覆盖', '§03/30'],
  ['Appetite translation', '把机构层面意愿映射到业务限额、定价或选择规则的治理步骤；本页λ只是SYNTHETIC决策账本代理', '已观察或已批准的董事会aggregate appetite', '§03/11'],
  ['Risk perception', '特定信息集与模型下对PD、LGD、波动或尾部损失的判断', '真实风险与未来实现结果', '§03'],
  ['Risk profile', '某时点真实持有的多维风险暴露', 'risk appetite声明', '§03'],
  ['Realised risk', '在预定表现窗真正发生的违约、损失、核销或流动性事件', '决策时可见的ex-ante risk', '§17'],
  ['PD · Probability of Default', '违约概率；本页决策时模型值以百分点保存，进入乘法前除以100转为比例', '固定表现窗组内实现违约率；后者是事后频率', '§03/15'],
  ['LGD · Loss Given Default', '违约发生时损失占EAD的比例；本页以百分点保存并在乘法前转为比例', '违约概率或损失金额', '§03/11'],
  ['EAD · Exposure at Default', '违约时敞口金额，必须连同币种、计量边界与时点保存', 'PD或LGD；EAD不是百分比', '§03/15'],
  ['Screening', '发放前搜集、验证并据以接受或拒绝申请的信息生产', 'monitoring；后者发生于合同存续期', '§12'],
  ['Monitoring', '合同存续期内监督、契约测试和干预借款人的活动', '初始审批标准', '§12'],
  ['Credit standard', '决定哪些申请可被接受的政策、门槛或准则', 'terms；标准先决定是否进入合同', '§13'],
  ['Credit terms', '获批后适用的价格、额度、期限、抵押与契约', 'approval probability', '§13'],
  ['Extensive margin', '主体是否申请、获批、发放或进入资产菜单的变化', 'intensive margin；后者是同一获批关系的数量与条款', '§14'],
  ['Intensive margin', '条件于既有或获批关系的金额、价格、期限和保护变化', '新增高风险主体进入', '§14'],
  ['Target gap', '黏性目标收益与当前可得安全收益之间的差距', '已实现损失或风险溢价', '§06'],
  ['Search for yield', '安全收益下降且目标或承诺黏性时向更高承诺收益资产迁移的激励', '任何风险资产上涨', '§06'],
  ['Promised yield', '合同或票面承诺的收益率', 'expected return；后者扣除概率加权损失', '§07'],
  ['Expected return', '按状态概率扣除预期现金流损失后的平均回报', 'risk-adjusted return；后者还扣资本、流动性和尾部代价', '§07'],
  ['Risk-adjusted return', '在匹配基准上扣除EL、费用、资本、流动性与尾部风险价格后的贡献', '票息或会计收入', '§07'],
  ['Risk hurdle', '项目进入可接受集合必须跨过的最低风险调整回报或风险上限', '银行总贷款容量', '§11'],
  ['Expected loss', '金额口径为PD比例×LGD比例×EAD金额；损失率口径为PD比例×LGD比例', 'unexpected loss与尾部资本；不得在损失率里再乘一次EAD', '§11'],
  ['Unexpected loss', '围绕预期损失之外需要资本、流动性或尾部预算吸收的损失', '同一EL再次扣除', '§11'],
  ['Origination vintage', '在同一发放窗口形成并随后按固定期限跟踪的贷款批次', '观察日全部存量', '§15'],
  ['EAD-weighted PD', '在共同预测期、币种、产品和合同期限上，以违约时敞口金额为权重汇总的决策时PD；本例固定12个月', 'origination response window、笔数平均或表现期实现违约率', '§15'],
  ['NPL', '按具体监管或会计定义认定的不良贷款存量/比率', '新发放事前风险或风险偏好', '§17'],
  ['Franchise value', '机构持续经营、牌照、客户关系和未来利润的现值', '当期净息差', '§08'],
  ['Deposit-rate floor', '零售存款因现金替代、关系或制度而难以继续下调的有效下限', '政策利率本身的零下限', '§24'],
  ['Regulatory risk / RWA', '监管规则和模型映射后的风险暴露或风险加权资产', '内部模型风险与真实社会尾部损失', '§27'],
  ['Risk transfer', '通过出售、保护或证券化改变风险最终持有人', '风险消灭', '§26'],
  ['Identified-candidate', '已通过声明设计闸门、但仍待真实估计和完整审计的局部因果候选', 'identified或全球结构常数', '§23'],
  ['Joint-channel', '风险决策与资金容量、借款人状态或其他中介路径共同变化的处理', '纯3.12反事实', '§02'],
  ['Weighted net percentage', '调查中按规定权重汇总的收紧回答占比减放松回答占比', '变化强度、金额或因果系数', '§21'],
] as const;

const interfaces = [
  { name: '3.05 → 3.12', payload: '带工具、surprise/path、期限与事件时钟的政策处理护照。', guardrail: '观察到的低利率水平不得自动获得政策冲击身份。' },
  { name: '3.10 → 3.12', payload: 'bankFundingState、bankConstraintState、loanOfferState、合同、关系，以及冻结且不进入本页决策规则的legacy bankRiskToleranceScore lineage。', guardrail: '资金、容量或旧分数改变即标joint-channel并回传3.10，不能静默改名为appetite。' },
  { name: '3.11 → 3.12', payload: '借款法律实体、净值、现金流、抵押池、约束栈、distress与repayment信息集。', guardrail: '真实借款人风险、申请池或抵押品改变时冻结、控制或路由3.11。' },
  { name: '3.12 → 3.13', payload: '按机构、资产、风险维度与时钟保存的决策账本appetite-translation、筛选、条款和组合分布。', guardrail: '业务翻译参数不等于aggregate appetite；3.13负责聚合金融条件，不得把风险向量提前压成无护照单指数。' },
  { name: '3.12 → 3.14 / 3.15', payload: '新发放风险构成、局部损失与下一期容量触发器。', guardrail: '信用增长、债务累积和周期反馈由后续章节闭合。' },
  { name: '3.12 → 3.24', payload: '外部性、担保、配置损失和政策工具交互的分栏证据。', guardrail: '本章不从risk-taking方向直接推出政策福利结论。' },
  { name: '3.12 → Chapter 4', payload: '银行国籍、借款地、资金/资产币种与即时/最终风险基础。', guardrail: '完整全球金融周期、跨境网络和汇率传导不在本章估计。' },
  { name: '3.12 → 7.11–7.13', payload: '开放式基金赎回、杠杆、尾部、流动性、对冲、最终持有人与压力触发器。', guardrail: '赎回、保证金、强制出售、价格影响和网络传染由下游模块拥有。' },
] as const;

const contractInvariants = [
  '法律实体、合并口径、产品、币种、申请母体、决策账本与事件—决策—发放—表现时钟必须显式闭合。',
  '政策surprise、预期路径、观察水平、low-for-long持续期、资产购买和负利率制度不得合并成一个无护照利率。',
  'pure-channel比较逐字段冻结3.10资金/容量与3.11借款人/抵押状态；任一变化自动标joint-channel并输出目标章节。',
  'risk capacity、aggregate appetite、decision-book appetite translation、business tolerance、perception、profile、pricing、selection与realisation使用独立字段，禁止用同一个risk score覆盖；未观察RAS、批准时钟与映射时，业务影子权重不得改名为aggregate appetite。',
  '信用、久期、流动性、FX、集中度、尾部、杠杆和对冲是八维向量；not-collected不等于零。',
  'PD与LGD的百分点/比例转换只发生一次，PD预测期与收益/合同期限分别保存并对齐，EAD保留金额、币种与产品基础；EL=PD×LGD×EAD只计一次。',
  'promised yield、expected return与risk-adjusted return分栏；风险影子价改变不能重复改写上游资金或资本费用。',
  'eligible、applicant、approved、originated、drawn、outstanding与surviving分母不得互换；stock、flow、发放vintage和表现vintage分开。',
  '审批只使用决策时可得信息；未来违约、修订后评级或事后担保不得回填为ex-ante risk。',
  '内部评级、外部代理、监管权重、模型版本、生效日与固定模型回算分别保存，模型break不得改名为真实风险变化。',
  'appetite-translation、selection、terms、portfolio与realised-loss五个estimand各自保存处理定义与尺度、唯一结果、分母、单位、样本时钟、期限、支持集、估计、标准误、聚类层级与证据状态。',
  'SLOOS、BLS和SCOOS的净比例仅描述回答方向广度；question、分母、权重、回顾窗口、publication与revision必须保存。',
  'ECB BLS原词bank’s risk tolerance只作为广义供给侧意愿的自报机制信号；不得覆盖本页PD/tail operational tolerance，也不得当作董事会aggregate appetite的直接测量。',
  'STBL/E.2永久标记discontinued且不得与KC调查无断点拼接；所有动态官方源均需按研究日刷新。',
  'SYNTHETIC算例、计算器和全通过断言只证明算术与契约一致，绝不自动升级为现实估计、预测、政策建议或因果身份。',
] as const;

const dynamicRefreshChecklist = [
  { source: 'Fed SLOOS', refresh: '抓取当前问卷、表格、chart data、调查窗与发布时间；保存贷款类别、银行组、question ID与有效回答数。', use: '标准、条款、需求和来源原词risk tolerance的自报原因；净比例不是金额、canonical operational tolerance、aggregate appetite或因果效应。', sourceIds: [31] },
  { source: 'ECB BLS', refresh: '抓取series key、问卷/guide版本、国家与权重、TIME_HORIZON、COLLECTION、publication quarter、revision和原文件hash。', use: '标准、条款、风险感知与来源原词bank’s risk tolerance的调查贡献；后者只是广义供给侧意愿信号，不能写入canonical tolerance/appetite，且活动季度与发布季度分开。', sourceIds: [32] },
  { source: 'Fed SCOOS', refresh: '按交易对手和问题保存price/nonprice terms、haircut、covenant、NA分母、survey与release时钟。', use: '证券融资与OTC衍生品条款背景；回答比例不是实际成交或暴露。', sourceIds: [33] },
  { source: 'STBL / KC SBLS', refresh: 'STBL固定为2017已终止历史接口；KC调查单独保存样本、银行规模、问题版本与季度。', use: '新发小企业贷款的历史风险类别及当前申请/批准背景；禁止拼成长连续序列。', sourceIds: [34, 44] },
  { source: 'FFIEC / FR Y-9C', refresh: '保存RSSD、银行法人/集团、RCON/RCFD、schedule、表单版本、并购、CECL与修订。', use: '资本、RWA、贷款、NPL、核销、拨备与表外状态；不观察单笔审批阈值。', sourceIds: [35, 45] },
  { source: 'FDIC QBP / Fed H.8', refresh: '记录机构总体、参考期、年化规则；H.8另存SA/NSA、水平/增长、benchmark与break。', use: '行业盈利、资本、损失与周度资产负债表背景；聚合存量不能识别appetite。', sourceIds: [36, 46] },
  { source: 'ECB Supervisory Statistics', refresh: '保存SI/LSI、合并基础、分母、参考季、年化、会计阶段与修订。', use: '资本、NPL、Stage 2、盈利和流动性状态；不是新发放选择。', sourceIds: [37] },
  { source: 'IMF FSI', refresh: '逐国审计覆盖、consolidation、Basel/会计口径、frequency、vintage与缺失。', use: '跨国稳健性指标背景；元数据未闭合时不得比较。', sourceIds: [38] },
  { source: 'BIS CBS', refresh: '保存银行国籍、即时/最终风险基础、交易对手国/部门、可用期限字段与break-adjusted change；币种键另接BIS LBS或其他明示来源，并保留LBS所在地/非合并与CBS国籍/合并口径差异。', use: '跨境风险迁移与最终担保人背景；CBS不提供通用币种分解，也不是银行风险偏好。', sourceIds: [39] },
  { source: 'SEC Form N-MFP', refresh: '保存CIK/series、基金类型、N-MFP或N-MFP3 schema、period、filing、amendment与feeder处理。', use: 'MMF收益、WAM/WAL、流动性、流量和持仓；as-filed抽取需要质量审计。', sourceIds: [40] },
] as const;

const evidenceGroups = [
  { title: 'A · 定义、模型与资产价格机制', text: '风险承担渠道的定义、收益目标、监控、资本结构、风险厌恶代理、资产负债表容量和共同托底信念共同建立条件理论；任何一篇都不提供跨制度恒定符号。', ids: [1, 2, 3, 11, 22, 23, 24, 25] },
  { title: 'B · 银行贷款、监督与非线性证据', text: '申请、审批、内部评级、风险加价、贷款标准、资本/存款异质性、负利率与统一监管研究支持局部机制；结论保留样本、制度、支持集与时钟。', ids: [4, 5, 6, 7, 8, 9, 10, 12, 13, 14, 15, 29] },
  { title: 'C · 非银、收益追逐与跨部门反例', text: '保险、货币基金、债券基金和机构资产管理研究显示负债承诺、费用、赎回与最低收益保证塑造不同响应；跨机构异质性本身是结论。', ids: [16, 17, 18, 19, 20, 21, 27, 28] },
  { title: 'D · 治理、监管、担保、配置与福利边界', text: '有限责任、救助预期、风险权重、监督、FSB风险治理与Basel交易账簿规则说明测量风险、私人风险与社会尾部损失需分栏；福利判断必须另有外部性模型。', ids: [25, 26, 27, 28, 29, 41, 42] },
  { title: 'E · 政策率与官方贷款/融资调查', text: 'Fed与ECB政策率、SLOOS、BLS、SCOOS、历史E.2和KC小企业贷款调查提供处理背景、标准、条款和报告原因；它们本身不识别政策冲击，也不能把净比例改写成金额。', ids: [30, 31, 32, 33, 34, 43, 44] },
  { title: 'F · 监管、稳健性、跨境与持仓数据', text: '银行法人和控股集团报表、行业与周度统计、跨国FSI、BIS合并银行统计和N-MFP把机构与最终持有人状态接到下游；汇总数据不能倒推出单笔审批规则。', ids: [35, 36, 37, 38, 39, 40, 45, 46] },
] as const;

const allConceptIds = new Set(conceptSections.map(({ id }) => id));
const allSourceIds = new Set(lesson312References.map(({ id }) => id));
const expectedPageSectionAnchorIds = ['thesis', 'scope-route', 'interactive-lab', 'risk-taking-static-twins', 'checks-glossary', 'interfaces-reading'];
const expectedMechanismLabSectionOrder = [
  'safe-yield-target-gap',
  'margin-franchise-value',
  'valuation-measured-risk',
  'risk-hurdle',
  'ex-ante-versus-ex-post',
  'identification-falsification',
  'securitization-risk-transfer',
] as const;
const mechanismLabSectionOrder = conceptSections.filter(({ after }) => Boolean(after)).map(({ id }) => id);
const evidenceMapSourceIds = new Set<number>(evidenceGroups.flatMap(({ ids }) => ids));
const lesson312IntegrityAudit = [
  { key: '28 concept sections', passed: conceptSections.length === 28 },
  { key: '22 core + 6 optional sections', passed: lesson312CorePathSectionIds.size === 22 && conceptSections.filter(({ id }) => !lesson312CorePathSectionIds.has(id)).length === 6 },
  { key: 'thesis + scope + 22 concepts = 24 core units', passed: lesson312CorePathSectionIds.size + 2 === 24 },
  { key: 'concept numbering 02–29 continuous', passed: conceptSections.every(({ number }, index) => number === index + 2) },
  { key: 'concept ids unique', passed: allConceptIds.size === conceptSections.length },
  { key: 'every concept has two explanatory paragraphs and sources', passed: conceptSections.every(({ paragraphs, sourceIds }) => paragraphs.length >= 2 && sourceIds.length > 0) },
  { key: '46 references continuous', passed: lesson312References.length === 46 && lesson312References.every(({ id }, index) => id === index + 1) },
  { key: 'every reference states support and non-support boundary', passed: lesson312References.every(({ use }) => use.includes('支持') && use.includes('不支持')) },
  { key: 'every reference has a non-empty URL and appears in evidence map', passed: lesson312References.every(({ id, url }) => url.startsWith('https://') && evidenceMapSourceIds.has(id)) },
  { key: 'all concept/check/data citations resolve', passed: [...conceptSections.flatMap(({ sourceIds }) => sourceIds), ...checks.flatMap(({ sourceIds }) => sourceIds), ...dynamicRefreshChecklist.flatMap(({ sourceIds }) => sourceIds), ...evidenceGroups.flatMap(({ ids }) => ids)].every((id) => allSourceIds.has(id)) },
  { key: 'C1–C7 placements follow teaching order', passed: mechanismLabSectionOrder.join('|') === expectedMechanismLabSectionOrder.join('|') },
  { key: 'six core labs plus one optional lab', passed: mechanismLabSectionOrder.filter((id) => lesson312CorePathSectionIds.has(id)).length === 6 && mechanismLabSectionOrder.filter((id) => !lesson312CorePathSectionIds.has(id)).length === 1 },
  { key: 'scenario anchors resolve to concept sections', passed: riskTakingScenarios.every(({ primarySectionId, remediationSectionIds }) => allConceptIds.has(primarySectionId) && remediationSectionIds.every((id) => allConceptIds.has(id))) },
  { key: 'M/K source citations resolve', passed: riskTakingScenarios.every(({ sourceIds, staticTwin }) => [...sourceIds, ...staticTwin.sourceIds].every((id) => allSourceIds.has(id))) },
  { key: 'M1–M10 and K1–K10 present', passed: riskTakingScenarios.length === 10 && riskTakingScenarios.every(({ id, staticTwin }, index) => id === `M${index + 1}` && staticTwin.id === `K${index + 1}`) },
  { key: 'nine synthetic tasks plus one official-descriptive task', passed: riskTakingScenarios.filter(({ synthetic }) => synthetic).length === 9 && riskTakingScenarios.find(({ id }) => id === 'M10')?.synthetic === false },
  { key: 'scenario structure assertions pass', passed: riskTakingScenarioAssertions.every(({ passed }) => passed) },
  { key: 'scenario numeric assertions pass', passed: riskTakingNumericAssertionAudit.every(({ passed }) => passed) },
  { key: 'fixture audit passes', passed: riskTakingFixtureAudit.every(({ passed }) => passed) },
  { key: 'canonical state compile/runtime gates pass', passed: canonicalStateCompileCoverage && canonicalStateRuntimeCoverage },
  { key: 'five estimands remain descriptive and explicitly unestimated', passed: canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimands.every(({ status, estimate, standardError, clusteringLevel }) => status === 'descriptive' && estimate === null && standardError === null && clusteringLevel === null) },
  { key: 'five estimand identities include appetite translation not aggregate appetite', passed: canonicalMonetaryPolicyRiskTakingStateExample.identificationState.estimands.map(({ estimandId }) => estimandId).join('|') === 'appetite-translation|selection|terms|portfolio|realised-loss' },
  { key: 'ECB risk-tolerance source vocabulary cannot overwrite canonical governance', passed: canonicalMonetaryPolicyRiskTakingStateExample.dynamicDataPassports.find(({ sourceId }) => sourceId === 'ECB_BLS_RTO_ENTERPRISE')?.breakAndMissingFlags.includes('SOURCE_VOCABULARY_NOT_CANONICAL_OPERATIONAL_TOLERANCE_OR_AGGREGATE_APPETITE') === true },
  { key: 'BIS CBS currency gap routes to separately pass-ported LBS', passed: dynamicRefreshChecklist.find(({ source }) => source === 'BIS CBS')?.refresh.includes('币种键另接BIS LBS') === true && dynamicRefreshChecklist.find(({ source }) => source === 'BIS CBS')?.use.includes('不提供通用币种分解') === true },
  { key: 'ten guided readings and eight interfaces', passed: lesson312ReadingList.length === 10 && interfaces.length === 8 },
  { key: 'every guided reading has usable primary and auxiliary links', passed: lesson312ReadingList.every(({ url, links }) => url.startsWith('https://') && Boolean(links?.length) && links?.every(({ label, url: linkUrl }) => label.length > 0 && linkUrl.startsWith('https://'))) },
  { key: 'page section anchors include static twins and are unique', passed: expectedPageSectionAnchorIds.includes('risk-taking-static-twins') && new Set(expectedPageSectionAnchorIds).size === expectedPageSectionAnchorIds.length },
] as const;

if (lesson312IntegrityAudit.some(({ passed }) => !passed)) {
  throw new Error(`3.12 lesson integrity gate failed: ${lesson312IntegrityAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

function Lesson312Content() {
  return (
    <>
      <section className="lesson-section" id="thesis">
        <p className="section-kicker">00 · CORE THESIS</p>
        <h2>货币政策不会机械地“制造风险”：它先改变收益目标、风险价格、测量空间与尾部权重，再由中介的筛选、监控、条款和组合选择把变化写进新风险分布。</h2>
        <p>这一章研究离风险决策最近的一层。我们继承3.05的政策处理护照，暂时把3.10的资金与容量、3.11的借款人净值与抵押状态固定，追问同一中介面对可比机会集时，是否改变了给风险收取的补偿、拒绝边际和组合排序。董事会aggregate appetite若要进入实证，必须保存RAS、批准时钟与业务映射；本页canonical只移动一个明确标为SYNTHETIC的决策账本尾部权重，展示appetite可能怎样被翻译进规则，而不声称观察到总体意愿。放宽12个月决策时违约概率（Probability of Default，PD，以百分点记录）的操作门、较少监控或同一评级桶内的高收益迁移也都是候选；只有贷款总量增加则不是。</p>
        <p>这条链没有无条件方向。安全收益下降和黏性目标可能推动search for yield；有限责任与托底信念可能降低私人尾部权重；但息差和资本受压、特许权价值、监管监督与存款利率下限也可能使机构收缩或退出。严谨结论因此不是“低利率必然增加风险”，而是指出在哪个机构、制度、风险维度和时钟上，哪一股力量占优，并给出能让叙事失败的反事实。</p>
        <div className="impact-facts" role="group" aria-label="3.12核心学习承诺">
          <article><span>冻结输入</span><b>funding + capacity + borrower state</b><p>任一上游状态变化就标joint-channel并保存lineage。</p></article>
          <article><span>内生对象</span><b>risk price + screening + terms + portfolio</b><p>偏好、认知、选择与实现结果永不混名。</p></article>
          <article><span>输出</span><b>five estimands + risk vector + routes</b><p>局部机制先可证伪，再进入金融条件和系统反馈。</p></article>
        </div>
        <p className="section-sources"><b>核心依据：</b> <Cites ns={[1, 2, 3, 4, 5, 27]} /></p>
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · SCOPE, ROUTE & REAL-DATA ORIENTATION</p>
        <h2>先把“能承受”“愿意承担”“以为多危险”“最终损失”拆开，再沿政策—决策—结果时钟前进。</h2>
        <RiskTakingTransmissionChart />
        <div className="case-grid">
          <article className="case-card"><span>Master prerequisite</span><h3>2.06 + 3.05</h3><p>2.06给出金融机构目标与约束；3.05负责政策工具和冲击身份。本页不静默改写总目录。</p></article>
          <article className="case-card"><span>顺序学习建议</span><h3>回看 3.06–3.11</h3><p>按需调用T03、T05、T06、T08与2.16；这些是理解曲线、资金、借款人和风险治理的接口，不增加新的必修合同。</p></article>
          <article className="case-card"><span>CORE PATH</span><h3>§00–23 · 正文75–90分钟</h3><p>首读正文与C1–C6位于同一路线；六个实验另需约50–70分钟，故核心路线总计约125–160分钟。六个optional deep dives、其中的C7、题库、术语与来源另计。</p></article>
          <article className="case-card"><span>章节所有权</span><h3>risk selection, not the whole cycle</h3><p>完整信用/杠杆周期、住房、全球网络、宏观审慎福利与fire sale均显式路由，不在这里提前讲完。</p></article>
        </div>
        <div className="precision-note"><span>真实数据的最窄身份</span><p>图中的ECB BLS序列是31个发布/收集季度的官方调查读数，只帮助看风险容忍度作为“报告原因”怎样随时期变化。它没有政策反事实，不能证明货币政策导致标准收紧或放松；页面把series key、单位、符号、publication-quarter警示、取数日与原CSV hash一并保存。</p></div>
      </section>

      {conceptSections.map((section) => <RiskTakingConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">30 · INTERACTIVE M1–M10 + STATIC K1–K10</p>
        <h2>把口号变成可复算判断：每一题都要先守住冻结边界、单位、时钟和证据身份。</h2>
        <RiskTakingLab />
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">32 · CHECKS, CONTRACT AUDIT & GLOSSARY</p>
        <h2>先用反例检查概念，再让底层断言复算数值，最后把最容易混同的术语重新分栏。</h2>
        <div className="check-grid" role="group" aria-label="3.12检查题">
          {checks.map((check, index) => <details key={check.question}><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p>{check.answer} <Cites ns={check.sourceIds} /></p></details>)}
        </div>
        <RiskTakingFixtureAudit />
        <div className="yield-fixture-audit" role="group" aria-label="3.12正文与引用完整性审计"><span>{lesson312IntegrityAudit.filter(({ passed }) => passed).length}/{lesson312IntegrityAudit.length} 项正文、来源、题库与契约门通过</span><ul>{lesson312IntegrityAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
        <div className="term-grid" aria-label="3.12术语表" role="group">
          {glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">33 · EVIDENCE, DATA PASSPORTS, INTERFACES & READING</p>
        <h2>最终交付不是一句“宽松使银行冒险”，而是一份可冻结、可复算、可失败、可刷新、可路由的中介风险决策状态。</h2>
        <div className="precision-note" data-key-coverage={canonicalStateCompileCoverage && canonicalStateRuntimeCoverage ? 'complete' : 'incomplete'}>
          <span>3.12 canonical state contract · {canonicalStateFields.length} 个顶层键 · compile/runtime 双重闭合</span>
          <p><code>{canonicalStateFields.join(', ')}</code>。状态显式继承3.05的 <code>{lesson305.revision}</code> 政策护照，真实引用3.10的 <code>{canonicalBankLendingStateExample.stateId}</code> 与3.11的 <code>{canonicalBorrowerCollateralStateExample.stateId}</code>，并逐字段冻结资金、容量、净值、抵押池与约束栈。两个候选都把3.10的3.4pp边际资金成本按identity写入完整输入，并保存共同的12个月PD预测期、12个月合同期限、100 SYN EAD、币种与等EAD产品基础；因此PD×LGD得到的12个月损失率才可与本教学例的同期限年化收益比较。合成纯渠道只把决策账本的SYNTHETIC appetite-translation尾部权重从0.4降至0.2；它没有RAS、董事会批准或aggregate appetite观测。监控0.8、legacy score 60、PD上限6和尾部预算5全部冻结，使高风险候选的风险调整贡献由−0.1pp变为0.7pp。稳健容量仍为40，借款人状态不变。运行门从保存的候选输入重算四组输出，并复核三道审批门、八维风险向量、申请—批准—发放分母、20%→40%的事前高风险份额、2.4%→1.9%的固定表现窗反例，以及五个定义闭合但尚无估计/标准误/聚类的estimand。canonical观察利率水平因冲击外生性与预定暴露两门失败，仅为9/11的mechanism-consistent；11/11只是另一个设计候选边界。任何lineage、快照、单位、公式、引用或情景门失败，构建立刻停止。</p>
        </div>
        <h3>生产者侧不变量</h3>
        <ol className="contract-list">{contractInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
        <h3>动态来源刷新护照</h3>
        <div className="interface-grid" role="group" aria-label="3.12动态来源刷新清单">{dynamicRefreshChecklist.map((item) => <article key={item.source}><span>{item.source}</span><p><b>刷新：</b>{item.refresh}</p><p><b>允许用途：</b>{item.use} <Cites ns={item.sourceIds} /></p></article>)}</div>
        <p className="precision-note"><span>动态值声明</span>本页唯一冻结的真实数值图是2026-09-03取回并保存原CSV哈希的ECB BLS序列；它仍只是一个可复现快照，不是永久“当前值”。SLOOS、SCOOS、监管报表、FSI、CBS和N-MFP均只保存来源身份与刷新规则。用于研究前必须重新取数，并记录observation、survey、publication、filing、revision与retrieved-at时钟。</p>
        <h3>证据地图</h3>
        <div className="evidence-map" aria-label={`3.12连续覆盖${lesson312References.length}条来源的证据地图`} role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} <Cites ns={group.ids} /></p></div>)}</div>
        <h3>跨章接口</h3>
        <div className="interface-grid" role="group" aria-label="3.12跨章接口">{interfaces.map((item) => <article key={item.name}><span>{item.name}</span><p><b>Payload：</b>{item.payload}</p><p><b>Guardrail：</b>{item.guardrail}</p></article>)}</div>
        <div className="precision-note"><span>Reading list 使用顺序</span><p>首读按概念起点、理论符号、贷款级识别和时钟反例推进；随后按需要进入负利率、非银、监管与调查方法，最后才读系统边界和数据工程。每条延伸阅读都列明页段、要回答的问题和不可外推边界，不能只读标题后把局部发现改写成普遍定律。</p></div>
        <p><b>完成标准：</b>读者应能面对“长期低利率是否让机构更冒险”这一问题，先定义政策处理、主体、风险维度和时钟；再冻结资金容量与借款人状态，分解安全收益目标、息差/特许权价值、测量风险、托底信念与监督；随后从申请、审批、条款、组合和固定vintage分别构造五个estimand，并为每个替代解释设置失败条件。最后能够说明risk-taking何时上升、下降或不变，以及何时必须把问题路由3.10、3.11、3.13、3.14/3.15、3.24、Chapter 4或7.11–7.13，才算真正掌握本章。</p>
      </section>
    </>
  );
}

export const lesson312: LessonRecord = {
  slug: '3-12',
  id: '3.12',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Risk-Taking Channel of Monetary Policy：偏好治理翻译、操作容差、筛选、风险定价与组合选择',
  subtitle: '在银行资金容量与借款人状态可比时，货币政策环境怎样改变金融中介对风险的感知、内部价格、审批门槛、监控、合同条款与多维资产组合，以及这些选择怎样与事后违约、风险转移和系统反馈严格分开',
  readingTime: 'CORE PATH §00–23正文约75–90分钟；六个optional deep dive（§24–29）另约20–25分钟，完整正文（§00–29，不含交互、题库、术语、来源与延伸阅读）约95–115分钟。C1–C6交互另约50–70分钟，optional C7另约10–15分钟；M1–M10首次完成约35–50分钟／含复盘约55–75分钟；K1–K10、18道检查题、术语与接口约90–120分钟；46条来源与延伸阅读不计',
  prerequisite: 'Master prerequisite：2.06 Financial Institutions、3.05 Monetary Policy Shock；顺序学习建议回看3.06–3.11，按需调用T03、T05、T06、T08与2.16',
  updatedAt: '2026-09-10',
  revision: '3.12-r1',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-10',
      decision: 'approved',
      revision: '3.12-r1',
      summary:
        '独立终审政策风险承担机制、PD/LGD/EAD期限与币种护照、偏好治理翻译、容量/感知分栏、三道审批门、五个互不混同且尚未估计的estimand、3.05/3.10/3.11 lineage、M1–M10/K1–K10算术、canonical 9/11与候选11/11身份边界；复核ECB、BIS、Basel、Bank of Greece、AEA与New York Fed等一手来源及46条连续参考文献的支持/不支持边界。修订关闭六项专业问题并确认“net risk-choice pressure”重命名不改变算术；最终P1–P3为0，开审与结束十项哈希逐项一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-10',
      decision: 'approved',
      revision: '3.12-r1',
      summary:
        '独立终审零基础教学递进、§02–29正文、C1–C7、互动与静态M/K题、错误反馈与恢复状态、阅读时长、46条来源、10项延伸阅读、无脚本降级、响应式、键盘可达性和A4打印。修订关闭锚点/题卡分页、阅读时长失真、容量与偏好混名、移动端ECB坐标过小及图题孤儿问题；实测窄屏受控横滚、打印整宽、K1–K10不跨页，页面审计与生产构建无回归。最终P1–P3为0，开审与结束十项哈希逐项一致。',
    },
  ],
  previous: { slug: '3-11', label: '3.11 Borrower Balance Sheet / Collateral Channel' },
  next: { slug: '3-13', label: '3.13 Financial Conditions' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive M1–M10' },
    { id: 'risk-taking-static-twins', label: 'Static K1–K10' },
    { id: 'checks-glossary', label: 'Checks / Audit / Glossary' },
    { id: 'interfaces-reading', label: 'Evidence / Interfaces / Reading' },
  ],
  Content: Lesson312Content,
  references: lesson312References,
  readingList: lesson312ReadingList,
  readingListOrder: 'source',
};
