import type { ReactNode } from 'react';
import CreditCycleLab from '../components/CreditCycleLab';
import {
  CapitalLossFeedbackLab,
  CollateralBorrowingBaseLab,
  DebtServiceRepricingLab,
  DistributionCompositionLab,
  PassiveLeverageLab,
  StockFlowBridgeLab,
  WarningCausalGateLab,
} from '../components/CreditCycleMechanismLabs';
import CreditCycleTransmissionChart from '../components/CreditCycleTransmissionChart';
import {
  bisCreditCycleCombinedNormalizedSha256,
  bisCreditCycleDynamicDataPassports,
  bisCreditCycleRecomputedCombinedNormalizedSha256,
  bisCreditCycleRecomputedNormalizedSha256,
  bisCreditCycleSelectedObservations,
  canonicalCapitalLossInput,
  canonicalCapitalLossResult,
  canonicalCollateralCapacityInput,
  canonicalCollateralCapacityResult,
  canonicalCompositionGroups,
  canonicalCompositionResult,
  canonicalDebtServiceInput,
  canonicalDebtServiceResult,
  canonicalPassiveLeverageInput,
  canonicalPassiveLeverageResult,
  canonicalStockFlowInput,
  canonicalStockFlowResult,
  canonicalWarningInput,
  canonicalWarningResult,
  creditCycleMechanismLabSourceIds,
  creditCycleFixtureAudit,
  creditCycleTransmissionSourceIds,
} from '../components/creditCycleFixtures';
import {
  creditCycleNumericAssertionAudit,
  creditCycleScenarioAssertions,
  creditCycleScenarios,
} from '../components/creditCycleScenarios';
import { canonicalBankLendingStateExample, lesson310 } from './lesson-3-10';
import { canonicalBorrowerCollateralStateExample, lesson311 } from './lesson-3-11';
import { canonicalMonetaryPolicyRiskTakingStateExample, lesson312 } from './lesson-3-12';
import { canonicalFinancialConditionsStateExample, lesson313 } from './lesson-3-13';
import { lesson314ReadingList, lesson314References } from './lesson-3-14-sources';
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

type MeasurementStatus = 'synthetic-mechanically-audited-with-official-orientation' | 'empirically-estimated';
type PredictionStatus = 'not-estimated' | 'in-sample-only' | 'oos-candidate' | 'oos-validated';
type CausalStatus = 'not-identified' | 'identified-candidate' | 'identified';
type UpstreamLessonId = '3.10' | '3.11' | '3.12' | '3.13';
type DirectCanonicalMapping = Readonly<{ sourcePath: string; targetPath: string }>;
type CreditCycleInputLineage = Readonly<{
  lessonId: UpstreamLessonId;
  stateId: string;
  schemaVersion: string;
  producerLessonRevision: string;
  producerObservationTime: string;
  producerPublicationTime: string | null;
  producerRevisionMarker: string | null;
  contractStatus: 'stable' | 'legacy-draft-marker-preserved';
  mappings: readonly DirectCanonicalMapping[];
  relation: 'direct-canonical-import';
}>;

type CreditCycleState = {
  schemaVersion: string;
  stateId: string;
  scopePassport: {
    jurisdiction: string;
    borrowerUniverse: string;
    creditorUniverse: string;
    instrumentUniverse: string;
    consolidationBasis: string;
    reportingCurrency: string;
    nominalRealBasis: string;
    useCaseId: string;
    aggregationLevel: string;
    asOf: string;
  };
  inputLineage: readonly CreditCycleInputLineage[];
  clockState: {
    stateObservationTime: string;
    informationCutoff: string;
    stockFlowWindow: string;
    debtServicePaymentWindow: string;
    lossEstimationWindow: string;
    nextStateHorizon: string;
    sourceRetrievalDate: string;
    vintagePolicy: 'synthetic-fixed-plus-latest-vintage-official-orientation';
  };
  unitContract: {
    syntheticAmountUnit: 'SYN-currency';
    endingStockUnit: 'SYN-currency-at-declared-period-end';
    windowFlowUnit: 'SYN-currency-per-declared-window';
    creditToGdpUnit: 'percent-of-GDP';
    creditGapUnit: 'percentage-points-of-credit-to-GDP-ratio';
    debtServiceUnit: 'percent-of-income';
    leverageUnits: readonly string[];
    officialSeriesNeverSummed: true;
  };
  financialConditionsInputState: {
    producerLessonId: '3.13';
    producerStateId: string;
    producerSchemaVersion: string;
    scopePassport: typeof canonicalFinancialConditionsStateExample.scopePassport;
    laneStates: typeof canonicalFinancialConditionsStateExample.laneStates;
    registeredScore: number;
    unit: typeof canonicalFinancialConditionsStateExample.compositeState.unit;
    weightLedger: typeof canonicalFinancialConditionsStateExample.compositeState.weightLedger;
    contributionLedger: typeof canonicalFinancialConditionsStateExample.compositeState.contributionLedger;
    coverage: typeof canonicalFinancialConditionsStateExample.compositeState.coverage;
    distributionState: typeof canonicalFinancialConditionsStateExample.distributionState;
    scalarIsOnlyOutput: false;
  };
  creditAccountingState: {
    identity: string;
    input: typeof canonicalStockFlowInput;
    result: NonNullable<typeof canonicalStockFlowResult>;
    reconciliationStatus: 'closed';
  };
  originationState: {
    producerStateId: string;
    contractPassport: typeof canonicalBankLendingStateExample.loanContractPassport;
    creditDecision: typeof canonicalBankLendingStateExample.creditDecisionState;
    syntheticGrossOriginations: number;
    grossOriginationsEqualStockChange: false;
  };
  creditGrowthState: {
    openingStock: number;
    closingStock: number;
    stockGrowthRatio: number;
    netTransactionFlow: number;
    stockChange: number;
    isAnnualizedTransform: false;
    interpretation: string;
  };
  leverageState: {
    input: typeof canonicalPassiveLeverageInput;
    result: NonNullable<typeof canonicalPassiveLeverageResult>;
    denominatorRegistry: readonly string[];
    debtChangedInShock: false;
  };
  debtServiceState: {
    input: typeof canonicalDebtServiceInput;
    result: NonNullable<typeof canonicalDebtServiceResult>;
    contractClockRequired: true;
  };
  supplyDemandState: {
    aggregateCreditChangeIdentifiesSupply: false;
    upstreamBankIdentificationStatus: typeof canonicalBankLendingStateExample.identificationState.channelStatus;
    applicationLevelDesignRequired: true;
    borrowerSubstitutionState: typeof canonicalBankLendingStateExample.substitutionState;
    resourceBridgeContract: {
      horizon: 'declared-treatment-window';
      comparisonBasis: 'treated-minus-counterfactual';
      componentsAreWindowFlows: true;
      cashBalanceLevelMayEnterDirectly: false;
      cashBufferDrawdownAndOperatingCashFlowAreNonOverlapping: true;
    };
  };
  underwritingCompositionState: {
    producerStateId: string;
    underwritingState: typeof canonicalMonetaryPolicyRiskTakingStateExample.underwritingState;
    portfolioRiskState: typeof canonicalMonetaryPolicyRiskTakingStateExample.portfolioRiskState;
    selectionFunnelState: typeof canonicalMonetaryPolicyRiskTakingStateExample.selectionFunnelState;
    compositionCanMoveWithoutWithinGroupChange: true;
  };
  borrowerNetWorthState: {
    producerStateId: string;
    balanceSheetState: typeof canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState;
    cashFlowState: typeof canonicalBorrowerCollateralStateExample.cashFlowState;
    netWorthAmount: number | null;
    netWorthReconciliation: typeof canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.reconciliation;
  };
  collateralAssetPriceState: {
    upstreamCollateralPool: typeof canonicalBorrowerCollateralStateExample.collateralPoolState;
    syntheticShockInput: typeof canonicalCollateralCapacityInput;
    syntheticShockResult: NonNullable<typeof canonicalCollateralCapacityResult>;
    borrowingBaseIsMarketValue: false;
  };
  refinancingState: {
    contractMaturityAt: string | null;
    repricingBuckets: typeof canonicalBankLendingStateExample.bankFundingState.repricingBuckets;
    principalPartitionRule: 'balloon-maturity-plus-amortisation-excluding-balloon';
    principalCashFlowsCountedOnce: true;
    fxExposureContract: {
      measurementStatus: 'not-computed';
      requiredBasis: 'same-horizon-same-settlement-currency-cash-flows-or-common-date-present-values';
      hedgeNotionalMayEnterDirectly: false;
      incomeOrAssetLevelMayEnterDirectly: false;
      settlementCurrency: null;
      horizon: null;
      presentValueDate: null;
    };
    maturityWallObserved: false;
    refinancingOutcomeEstimated: false;
  };
  defaultLossState: {
    input: typeof canonicalCapitalLossInput;
    syntheticLossEstimate: number;
    lossStatus: 'synthetic-estimate-not-realised-workout-loss';
    recoveryAndGuaranteeTreatmentFrozen: true;
    pdTransitionObserved: false;
    lgdIsStateAndContractDependent: true;
  };
  intermediaryCapitalState: {
    upstreamCapacities: typeof canonicalBankLendingStateExample.bankConstraintState.capacities;
    upstreamBindingConstraintIds: typeof canonicalBankLendingStateExample.bankConstraintState.bindingConstraintIds;
    syntheticLossResult: NonNullable<typeof canonicalCapitalLossResult>;
    simplifiedCapacityIsRegulatoryDecision: false;
  };
  liquidityFeedbackState: {
    chain: readonly string[];
    marketLiquidityObserved: false;
    fundingLiquidityObserved: false;
    fireSaleEstimated: false;
  };
  distributionState: {
    groups: typeof canonicalCompositionGroups;
    decomposition: NonNullable<typeof canonicalCompositionResult>;
    fixedWeightCounterfactualRequired: true;
    borrowerTailObserved: false;
    lenderTailObserved: false;
  };
  cyclePhaseState: {
    orderedMechanismTrace: readonly string[];
    phaseLabel: 'not-classified';
    deterministicClockClaimed: false;
    turningPointObserved: false;
  };
  earlyWarningState: {
    input: typeof canonicalWarningInput;
    result: NonNullable<typeof canonicalWarningResult>;
    isProbability: false;
    officialGapVintageIsPointInTime: false;
  };
  identificationState: {
    aggregateSupplyDemandStatus: 'not-identified';
    causalGateIds: readonly string[];
    failedCausalGateIds: readonly string[];
    warningCausalStatus: NonNullable<typeof canonicalWarningResult>['causalStatus'];
    estimate: null;
    standardError: null;
    supportPopulation: null;
  };
  evidenceState: {
    measurementStatus: MeasurementStatus;
    predictionStatus: PredictionStatus;
    causalStatus: CausalStatus;
  };
  dynamicDataPassports: typeof bisCreditCycleDynamicDataPassports;
  measurementFlags: {
    objectId: string;
    flag: 'synthetic' | 'observed-official-latest-vintage' | 'not-collected';
    mayEnterCanonicalCalculation: boolean;
    reason: string;
  }[];
  boundaryRoutes: { destination: string; payload: string; guardrail: string }[];
  auditTimestamps: { constructedAt: string; sourceRetrievalDate: string; reviewFrozenAt: string | null };
};

const canonicalCreditCycleStateFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'clockState', 'unitContract',
  'financialConditionsInputState', 'creditAccountingState', 'originationState', 'creditGrowthState',
  'leverageState', 'debtServiceState', 'supplyDemandState', 'underwritingCompositionState',
  'borrowerNetWorthState', 'collateralAssetPriceState', 'refinancingState', 'defaultLossState',
  'intermediaryCapitalState', 'liquidityFeedbackState', 'distributionState', 'cyclePhaseState',
  'earlyWarningState', 'identificationState', 'evidenceState', 'dynamicDataPassports',
  'measurementFlags', 'boundaryRoutes', 'auditTimestamps',
] as const satisfies readonly (keyof CreditCycleState)[];

function required<T>(value: T | null | undefined, label: string): T {
  if (value === null || value === undefined) throw new Error(`3.14 missing canonical ${label}`);
  return value;
}

const canonicalLineageMappings = {
  '3.10': [
    { sourcePath: 'stateId', targetPath: 'originationState.producerStateId' },
    { sourcePath: 'loanContractPassport', targetPath: 'originationState.contractPassport' },
    { sourcePath: 'creditDecisionState', targetPath: 'originationState.creditDecision' },
    { sourcePath: 'identificationState.channelStatus', targetPath: 'supplyDemandState.upstreamBankIdentificationStatus' },
    { sourcePath: 'substitutionState', targetPath: 'supplyDemandState.borrowerSubstitutionState' },
    { sourcePath: 'loanContractPassport.maturityAt', targetPath: 'refinancingState.contractMaturityAt' },
    { sourcePath: 'bankFundingState.repricingBuckets', targetPath: 'refinancingState.repricingBuckets' },
    { sourcePath: 'bankConstraintState.capacities', targetPath: 'intermediaryCapitalState.upstreamCapacities' },
    { sourcePath: 'bankConstraintState.bindingConstraintIds', targetPath: 'intermediaryCapitalState.upstreamBindingConstraintIds' },
  ],
  '3.11': [
    { sourcePath: 'stateId', targetPath: 'borrowerNetWorthState.producerStateId' },
    { sourcePath: 'borrowerBalanceSheetState', targetPath: 'borrowerNetWorthState.balanceSheetState' },
    { sourcePath: 'cashFlowState', targetPath: 'borrowerNetWorthState.cashFlowState' },
    { sourcePath: 'borrowerBalanceSheetState.netWorth.value', targetPath: 'borrowerNetWorthState.netWorthAmount' },
    { sourcePath: 'borrowerBalanceSheetState.reconciliation', targetPath: 'borrowerNetWorthState.netWorthReconciliation' },
    { sourcePath: 'collateralPoolState', targetPath: 'collateralAssetPriceState.upstreamCollateralPool' },
  ],
  '3.12': [
    { sourcePath: 'stateId', targetPath: 'underwritingCompositionState.producerStateId' },
    { sourcePath: 'underwritingState', targetPath: 'underwritingCompositionState.underwritingState' },
    { sourcePath: 'portfolioRiskState', targetPath: 'underwritingCompositionState.portfolioRiskState' },
    { sourcePath: 'selectionFunnelState', targetPath: 'underwritingCompositionState.selectionFunnelState' },
  ],
  '3.13': [
    { sourcePath: 'stateId', targetPath: 'financialConditionsInputState.producerStateId' },
    { sourcePath: 'schemaVersion', targetPath: 'financialConditionsInputState.producerSchemaVersion' },
    { sourcePath: 'scopePassport', targetPath: 'financialConditionsInputState.scopePassport' },
    { sourcePath: 'laneStates', targetPath: 'financialConditionsInputState.laneStates' },
    { sourcePath: 'compositeState.registeredScore', targetPath: 'financialConditionsInputState.registeredScore' },
    { sourcePath: 'compositeState.unit', targetPath: 'financialConditionsInputState.unit' },
    { sourcePath: 'compositeState.weightLedger', targetPath: 'financialConditionsInputState.weightLedger' },
    { sourcePath: 'compositeState.contributionLedger', targetPath: 'financialConditionsInputState.contributionLedger' },
    { sourcePath: 'compositeState.coverage.expectedDomains', targetPath: 'financialConditionsInputState.coverage.expectedDomains' },
    { sourcePath: 'compositeState.coverage.observedDomains', targetPath: 'financialConditionsInputState.coverage.observedDomains' },
    { sourcePath: 'compositeState.coverage.totalOriginalWeight', targetPath: 'financialConditionsInputState.coverage.totalOriginalWeight' },
    { sourcePath: 'compositeState.coverage.observedWeight', targetPath: 'financialConditionsInputState.coverage.observedWeight' },
    { sourcePath: 'compositeState.coverage.isPartial', targetPath: 'financialConditionsInputState.coverage.isPartial' },
    { sourcePath: 'compositeState.coverage.missingDomains', targetPath: 'financialConditionsInputState.coverage.missingDomains' },
    { sourcePath: 'compositeState.coverage.renormalized', targetPath: 'financialConditionsInputState.coverage.renormalized' },
    { sourcePath: 'compositeState.coverage.compositionVersion', targetPath: 'financialConditionsInputState.coverage.compositionVersion' },
    { sourcePath: 'distributionState', targetPath: 'financialConditionsInputState.distributionState' },
  ],
} as const satisfies Record<UpstreamLessonId, readonly DirectCanonicalMapping[]>;

const bankProducerObservationTime = required(canonicalBankLendingStateExample.timestamps.observationTime, '3.10 producer observation time');

const stockFlowResult = required(canonicalStockFlowResult, 'stock-flow result');
const leverageResult = required(canonicalPassiveLeverageResult, 'leverage result');
const collateralResult = required(canonicalCollateralCapacityResult, 'collateral result');
const debtServiceResult = required(canonicalDebtServiceResult, 'debt-service result');
const capitalLossResult = required(canonicalCapitalLossResult, 'capital-loss result');
const compositionResult = required(canonicalCompositionResult, 'composition result');
const warningResult = required(canonicalWarningResult, 'warning result');
const upstreamCoverage = canonicalFinancialConditionsStateExample.compositeState.coverage;

export const canonicalCreditCycleStateExample: CreditCycleState = {
  schemaVersion: 'credit-cycle-state-v1',
  stateId: 'SYNTHETIC_REGISTERED_CREDIT_CYCLE_STATE',
  scopePassport: {
    jurisdiction: 'SYNTHETIC-JURISDICTION',
    borrowerUniverse: 'private-nonfinancial-borrowers-on-registered-support',
    creditorUniverse: 'registered-bank-market-and-nonbank-lenders',
    instrumentUniverse: 'loans-bonds-trade-credit-and-leases-on-declared-contract-support',
    consolidationBasis: 'borrower-sector-aggregate-with-micro-lineage',
    reportingCurrency: 'SYN',
    nominalRealBasis: 'nominal-contract-and-balance-sheet amounts',
    useCaseId: 'TEACHING-MECHANISM-TRACE-NOT-CYCLE-DATING',
    aggregationLevel: 'borrower-lender-contract-vintage-and-aggregate-ledgers',
    asOf: '2026-09-11T00:00:00+08:00',
  },
  inputLineage: [
    {
      lessonId: '3.10', stateId: canonicalBankLendingStateExample.stateId, schemaVersion: canonicalBankLendingStateExample.schemaVersion,
      producerLessonRevision: '3.10-r3', producerObservationTime: bankProducerObservationTime, producerPublicationTime: canonicalBankLendingStateExample.timestamps.publicationTime, producerRevisionMarker: canonicalBankLendingStateExample.timestamps.revisionVintage, contractStatus: 'stable',
      mappings: canonicalLineageMappings['3.10'], relation: 'direct-canonical-import',
    },
    {
      lessonId: '3.11', stateId: canonicalBorrowerCollateralStateExample.stateId, schemaVersion: canonicalBorrowerCollateralStateExample.schemaVersion,
      producerLessonRevision: '3.11-r2', producerObservationTime: canonicalBorrowerCollateralStateExample.auditTimestamps.decisionTime, producerPublicationTime: canonicalBorrowerCollateralStateExample.auditTimestamps.publicationTime, producerRevisionMarker: canonicalBorrowerCollateralStateExample.auditTimestamps.revisionTime, contractStatus: 'stable',
      mappings: canonicalLineageMappings['3.11'], relation: 'direct-canonical-import',
    },
    {
      lessonId: '3.12', stateId: canonicalMonetaryPolicyRiskTakingStateExample.stateId, schemaVersion: canonicalMonetaryPolicyRiskTakingStateExample.schemaVersion,
      producerLessonRevision: '3.12-r1', producerObservationTime: canonicalMonetaryPolicyRiskTakingStateExample.auditTimestamps.decisionTime, producerPublicationTime: canonicalMonetaryPolicyRiskTakingStateExample.auditTimestamps.publicationTime, producerRevisionMarker: canonicalMonetaryPolicyRiskTakingStateExample.auditTimestamps.revisionTime, contractStatus: 'legacy-draft-marker-preserved',
      mappings: canonicalLineageMappings['3.12'], relation: 'direct-canonical-import',
    },
    {
      lessonId: '3.13', stateId: canonicalFinancialConditionsStateExample.stateId, schemaVersion: canonicalFinancialConditionsStateExample.schemaVersion,
      producerLessonRevision: '3.13-r1', producerObservationTime: canonicalFinancialConditionsStateExample.scopePassport.asOf, producerPublicationTime: null, producerRevisionMarker: canonicalFinancialConditionsStateExample.auditTimestamps.reviewFrozenAt, contractStatus: 'stable',
      mappings: canonicalLineageMappings['3.13'], relation: 'direct-canonical-import',
    },
  ],
  clockState: {
    stateObservationTime: '2026-09-11T00:00:00+08:00',
    informationCutoff: '2026-09-11T00:00:00+08:00',
    stockFlowWindow: '2026-01-01/2026-09-11',
    debtServicePaymentWindow: `${canonicalDebtServiceInput.paymentWindowStart}/${canonicalDebtServiceInput.paymentWindowEnd} ${canonicalDebtServiceInput.paymentWindowDirection}`,
    lossEstimationWindow: '2026-09-11/2031-09-11 synthetic workout horizon; same estimate assumed recognised once against capital and pre-loss net carrying loans',
    nextStateHorizon: 't+1 mechanism state; no calendar forecast',
    sourceRetrievalDate: '2026-09-11',
    vintagePolicy: 'synthetic-fixed-plus-latest-vintage-official-orientation',
  },
  unitContract: {
    syntheticAmountUnit: 'SYN-currency',
    endingStockUnit: 'SYN-currency-at-declared-period-end',
    windowFlowUnit: 'SYN-currency-per-declared-window',
    creditToGdpUnit: 'percent-of-GDP',
    creditGapUnit: 'percentage-points-of-credit-to-GDP-ratio',
    debtServiceUnit: 'percent-of-income',
    leverageUnits: ['debt/assets', 'debt/equity', 'debt/income'],
    officialSeriesNeverSummed: true,
  },
  financialConditionsInputState: {
    producerLessonId: '3.13',
    producerStateId: canonicalFinancialConditionsStateExample.stateId,
    producerSchemaVersion: canonicalFinancialConditionsStateExample.schemaVersion,
    scopePassport: canonicalFinancialConditionsStateExample.scopePassport,
    laneStates: canonicalFinancialConditionsStateExample.laneStates,
    registeredScore: canonicalFinancialConditionsStateExample.compositeState.registeredScore,
    unit: canonicalFinancialConditionsStateExample.compositeState.unit,
    weightLedger: canonicalFinancialConditionsStateExample.compositeState.weightLedger,
    contributionLedger: canonicalFinancialConditionsStateExample.compositeState.contributionLedger,
    coverage: {
      expectedDomains: upstreamCoverage.expectedDomains,
      observedDomains: upstreamCoverage.observedDomains,
      totalOriginalWeight: upstreamCoverage.totalOriginalWeight,
      observedWeight: upstreamCoverage.observedWeight,
      isPartial: upstreamCoverage.isPartial,
      missingDomains: upstreamCoverage.missingDomains,
      renormalized: upstreamCoverage.renormalized,
      compositionVersion: upstreamCoverage.compositionVersion,
    },
    distributionState: canonicalFinancialConditionsStateExample.distributionState,
    scalarIsOnlyOutput: false,
  },
  creditAccountingState: {
    identity: 'closing stock = opening stock + gross originations − principal repayments − charge-offs + valuation + FX + reclassifications',
    input: canonicalStockFlowInput,
    result: stockFlowResult,
    reconciliationStatus: 'closed',
  },
  originationState: {
    producerStateId: canonicalBankLendingStateExample.stateId,
    contractPassport: canonicalBankLendingStateExample.loanContractPassport,
    creditDecision: canonicalBankLendingStateExample.creditDecisionState,
    syntheticGrossOriginations: canonicalStockFlowInput.grossOriginations,
    grossOriginationsEqualStockChange: false,
  },
  creditGrowthState: {
    openingStock: canonicalStockFlowInput.openingStock,
    closingStock: stockFlowResult.computedClosingStock,
    stockGrowthRatio: stockFlowResult.computedClosingStock / canonicalStockFlowInput.openingStock - 1,
    netTransactionFlow: stockFlowResult.netTransactionFlow,
    stockChange: stockFlowResult.stockChange,
    isAnnualizedTransform: false,
    interpretation: 'synthetic closing-stock growth after an explicitly reconciled declared-window ledger; not annualised, not gross lending and not a supply shock',
  },
  leverageState: {
    input: canonicalPassiveLeverageInput,
    result: leverageResult,
    denominatorRegistry: ['assets at declared valuation time', 'equity as assets minus debt minus registered other liabilities (teaching fixture freezes other liabilities at zero)', 'income over declared flow window'],
    debtChangedInShock: false,
  },
  debtServiceState: { input: canonicalDebtServiceInput, result: debtServiceResult, contractClockRequired: true },
  supplyDemandState: {
    aggregateCreditChangeIdentifiesSupply: false,
    upstreamBankIdentificationStatus: canonicalBankLendingStateExample.identificationState.channelStatus,
    applicationLevelDesignRequired: true,
    borrowerSubstitutionState: canonicalBankLendingStateExample.substitutionState,
    resourceBridgeContract: {
      horizon: 'declared-treatment-window',
      comparisonBasis: 'treated-minus-counterfactual',
      componentsAreWindowFlows: true,
      cashBalanceLevelMayEnterDirectly: false,
      cashBufferDrawdownAndOperatingCashFlowAreNonOverlapping: true,
    },
  },
  underwritingCompositionState: {
    producerStateId: canonicalMonetaryPolicyRiskTakingStateExample.stateId,
    underwritingState: canonicalMonetaryPolicyRiskTakingStateExample.underwritingState,
    portfolioRiskState: canonicalMonetaryPolicyRiskTakingStateExample.portfolioRiskState,
    selectionFunnelState: canonicalMonetaryPolicyRiskTakingStateExample.selectionFunnelState,
    compositionCanMoveWithoutWithinGroupChange: true,
  },
  borrowerNetWorthState: {
    producerStateId: canonicalBorrowerCollateralStateExample.stateId,
    balanceSheetState: canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState,
    cashFlowState: canonicalBorrowerCollateralStateExample.cashFlowState,
    netWorthAmount: canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.netWorth.value,
    netWorthReconciliation: canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.reconciliation,
  },
  collateralAssetPriceState: {
    upstreamCollateralPool: canonicalBorrowerCollateralStateExample.collateralPoolState,
    syntheticShockInput: canonicalCollateralCapacityInput,
    syntheticShockResult: collateralResult,
    borrowingBaseIsMarketValue: false,
  },
  refinancingState: {
    contractMaturityAt: canonicalBankLendingStateExample.loanContractPassport?.maturityAt ?? null,
    repricingBuckets: canonicalBankLendingStateExample.bankFundingState.repricingBuckets,
    principalPartitionRule: 'balloon-maturity-plus-amortisation-excluding-balloon',
    principalCashFlowsCountedOnce: true,
    fxExposureContract: {
      measurementStatus: 'not-computed',
      requiredBasis: 'same-horizon-same-settlement-currency-cash-flows-or-common-date-present-values',
      hedgeNotionalMayEnterDirectly: false,
      incomeOrAssetLevelMayEnterDirectly: false,
      settlementCurrency: null,
      horizon: null,
      presentValueDate: null,
    },
    maturityWallObserved: false,
    refinancingOutcomeEstimated: false,
  },
  defaultLossState: {
    input: canonicalCapitalLossInput,
    syntheticLossEstimate: capitalLossResult.syntheticLossEstimate,
    lossStatus: 'synthetic-estimate-not-realised-workout-loss',
    recoveryAndGuaranteeTreatmentFrozen: true,
    pdTransitionObserved: false,
    lgdIsStateAndContractDependent: true,
  },
  intermediaryCapitalState: {
    upstreamCapacities: canonicalBankLendingStateExample.bankConstraintState.capacities,
    upstreamBindingConstraintIds: canonicalBankLendingStateExample.bankConstraintState.bindingConstraintIds,
    syntheticLossResult: capitalLossResult,
    simplifiedCapacityIsRegulatoryDecision: false,
  },
  liquidityFeedbackState: {
    chain: ['loss or margin call', 'funding withdrawal or collateral demand', 'asset sale', 'market-liquidity deterioration', 'mark-down', 'new balance-sheet constraint'],
    marketLiquidityObserved: false,
    fundingLiquidityObserved: false,
    fireSaleEstimated: false,
  },
  distributionState: {
    groups: canonicalCompositionGroups,
    decomposition: compositionResult,
    fixedWeightCounterfactualRequired: true,
    borrowerTailObserved: false,
    lenderTailObserved: false,
  },
  cyclePhaseState: {
    orderedMechanismTrace: ['financial conditions', 'financing menu', 'origination and repayment flows', 'credit stock and leverage', 'asset prices and net worth', 'debt service and refinancing', 'default and loss', 'intermediary capital and liquidity', 'next financial conditions'],
    phaseLabel: 'not-classified',
    deterministicClockClaimed: false,
    turningPointObserved: false,
  },
  earlyWarningState: {
    input: canonicalWarningInput,
    result: warningResult,
    isProbability: false,
    officialGapVintageIsPointInTime: false,
  },
  identificationState: {
    aggregateSupplyDemandStatus: 'not-identified',
    causalGateIds: ['exogeneity', 'predetermined-exposure', 'demand-counterfactual'],
    failedCausalGateIds: warningResult.failedCausalGates,
    warningCausalStatus: warningResult.causalStatus,
    estimate: null,
    standardError: null,
    supportPopulation: null,
  },
  evidenceState: {
    measurementStatus: 'synthetic-mechanically-audited-with-official-orientation',
    predictionStatus: 'not-estimated',
    causalStatus: 'not-identified',
  },
  dynamicDataPassports: bisCreditCycleDynamicDataPassports,
  measurementFlags: [
    { objectId: 'canonical-credit-cycle-mechanism-state', flag: 'synthetic', mayEnterCanonicalCalculation: true, reason: 'deterministic teaching fixture with pure-function arithmetic and explicit units; not a real estimate' },
    { objectId: 'BIS_US_TOTAL_CREDIT_TO_GDP', flag: 'observed-official-latest-vintage', mayEnterCanonicalCalculation: false, reason: 'real-data orientation only; separate unit, scope and revision vintage' },
    { objectId: 'BIS_US_CREDIT_TO_GDP_GAP', flag: 'observed-official-latest-vintage', mayEnterCanonicalCalculation: false, reason: 'not PIT and not a crisis probability or causal treatment' },
    { objectId: 'BIS_US_PRIVATE_NFS_DSR', flag: 'observed-official-latest-vintage', mayEnterCanonicalCalculation: false, reason: 'aggregate model-based estimate, not a micro contract cash-flow ledger' },
    { objectId: 'borrower-and-lender-distribution-tails', flag: 'not-collected', mayEnterCanonicalCalculation: false, reason: 'absence is not zero; distributional state remains incomplete' },
  ],
  boundaryRoutes: [
    { destination: '3.15 Debt / Leverage Cycle', payload: 'debt stocks, leverage denominator registry, maturity and repayment clocks, distribution tails', guardrail: '3.14 establishes the feedback loop; 3.15 owns the fuller debt-overhang and leverage-vulnerability treatment' },
    { destination: '3.16 Housing', payload: 'house-price, mortgage, borrower and collateral states', guardrail: 'housing institutions and supply are not collapsed into a generic collateral coefficient' },
    { destination: '4.07 Global Financial Cycle', payload: 'jurisdiction, settlement currency, creditor nationality/residence, cross-border instrument and same-horizon debt-service, hedge, operating and asset cash-flow legs', guardrail: 'global comovement or dollar movement alone does not identify a common causal factor; notional hedges, income levels and asset stocks cannot be subtracted directly' },
    { destination: '7.11–7.13', payload: 'margin, funding liquidity, asset-sale, price-impact, network exposure and default waterfalls', guardrail: '3.14 routes rather than estimates fire-sale and network contagion' },
    { destination: '7.24 / 7.26', payload: 'labels, horizons, vintages, transforms, thresholds, evidence axes and audit hashes', guardrail: 'warning score cannot become an OOS probability or causal shock without separate gates' },
  ],
  auditTimestamps: { constructedAt: '2026-09-11T15:00:00+08:00', sourceRetrievalDate: '2026-09-11', reviewFrozenAt: '2026-09-14T17:03:09+08:00' },
};

const directCanonicalStatesByLesson = {
  '3.10': canonicalBankLendingStateExample,
  '3.11': canonicalBorrowerCollateralStateExample,
  '3.12': canonicalMonetaryPolicyRiskTakingStateExample,
  '3.13': canonicalFinancialConditionsStateExample,
} as const satisfies Record<UpstreamLessonId, unknown>;

type PathResolution = { found: true; value: unknown } | { found: false };

const resolveCanonicalPath = (root: unknown, fieldPath: string): PathResolution => {
  const segments = fieldPath.split('.');
  if (segments.length === 0 || segments.some((segment) => segment.length === 0)) return { found: false };
  let cursor = root;
  for (const segment of segments) {
    if (typeof cursor !== 'object' || cursor === null || !Object.prototype.hasOwnProperty.call(cursor, segment)) return { found: false };
    cursor = (cursor as Record<string, unknown>)[segment];
  }
  return { found: true, value: cursor };
};

const directCanonicalMappingMatches = (sourceRoot: unknown, targetRoot: unknown, mapping: DirectCanonicalMapping) => {
  const source = resolveCanonicalPath(sourceRoot, mapping.sourcePath);
  const target = resolveCanonicalPath(targetRoot, mapping.targetPath);
  return source.found && target.found && source.value !== undefined && target.value !== undefined && Object.is(source.value, target.value);
};

const directCanonicalMappingAudit = canonicalCreditCycleStateExample.inputLineage.flatMap((lineage) => lineage.mappings.map((mapping) => ({
  lessonId: lineage.lessonId,
  sourcePath: mapping.sourcePath,
  targetPath: mapping.targetPath,
  passed: directCanonicalMappingMatches(directCanonicalStatesByLesson[lineage.lessonId], canonicalCreditCycleStateExample, mapping),
})));
const directCanonicalMappingsMatch = directCanonicalMappingAudit.length === 36 && directCanonicalMappingAudit.every(({ passed }) => passed);
const directCanonicalMappingPairsAreUnique = (() => {
  const keys = directCanonicalMappingAudit.map(({ lessonId, sourcePath, targetPath }) => `${lessonId}:${sourcePath}->${targetPath}`);
  return new Set(keys).size === keys.length;
})();
const injectedMissingSourceMappingRejected = !directCanonicalMappingMatches(canonicalFinancialConditionsStateExample, canonicalCreditCycleStateExample, { sourcePath: 'compositeState.__injected_missing__', targetPath: 'financialConditionsInputState.registeredScore' });
const injectedMissingTargetMappingRejected = !directCanonicalMappingMatches(canonicalFinancialConditionsStateExample, canonicalCreditCycleStateExample, { sourcePath: 'compositeState.registeredScore', targetPath: 'financialConditionsInputState.__injected_missing__' });
const injectedExistingButUnwiredSourceRejected = !directCanonicalMappingMatches(canonicalBorrowerCollateralStateExample, canonicalCreditCycleStateExample, { sourcePath: 'debtContractState', targetPath: 'borrowerNetWorthState.balanceSheetState' });
const equalButClonedObjectRejected = !directCanonicalMappingMatches({ imported: { value: 1 } }, { consumed: { value: 1 } }, { sourcePath: 'imported', targetPath: 'consumed' });

const expectedProducerLessonRevisions = { '3.10': lesson310.revision, '3.11': lesson311.revision, '3.12': lesson312.revision, '3.13': lesson313.revision } as const;
const expectedProducerIdentity = {
  '3.10': { stateId: canonicalBankLendingStateExample.stateId, schemaVersion: canonicalBankLendingStateExample.schemaVersion },
  '3.11': { stateId: canonicalBorrowerCollateralStateExample.stateId, schemaVersion: canonicalBorrowerCollateralStateExample.schemaVersion },
  '3.12': { stateId: canonicalMonetaryPolicyRiskTakingStateExample.stateId, schemaVersion: canonicalMonetaryPolicyRiskTakingStateExample.schemaVersion },
  '3.13': { stateId: canonicalFinancialConditionsStateExample.stateId, schemaVersion: canonicalFinancialConditionsStateExample.schemaVersion },
} as const;
const isOnOrBefore = (candidate: string, cutoff: string) => {
  const candidateTime = Date.parse(candidate);
  const cutoffTime = Date.parse(cutoff);
  return Number.isFinite(candidateTime) && Number.isFinite(cutoffTime) && candidateTime <= cutoffTime;
};
const producerClockGate = canonicalCreditCycleStateExample.inputLineage.every(({ producerObservationTime, producerPublicationTime }) => isOnOrBefore(producerObservationTime, canonicalCreditCycleStateExample.clockState.informationCutoff) && (producerPublicationTime === null || isOnOrBefore(producerPublicationTime, canonicalCreditCycleStateExample.clockState.informationCutoff)));
const producerRevisionGate = canonicalCreditCycleStateExample.inputLineage.every(({ lessonId, producerLessonRevision }) => producerLessonRevision === expectedProducerLessonRevisions[lessonId]);
const producerIdentityGate = canonicalCreditCycleStateExample.inputLineage.every(({ lessonId, stateId, schemaVersion }) => stateId === expectedProducerIdentity[lessonId].stateId && schemaVersion === expectedProducerIdentity[lessonId].schemaVersion);
const legacyProducerContractPreserved = canonicalCreditCycleStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.12')?.schemaVersion === '3.12-draft-contract'
  && canonicalCreditCycleStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.12')?.producerRevisionMarker === '3.12-draft'
  && canonicalCreditCycleStateExample.inputLineage.find(({ lessonId }) => lessonId === '3.12')?.contractStatus === 'legacy-draft-marker-preserved';

const coverageFieldIds = ['expectedDomains', 'observedDomains', 'totalOriginalWeight', 'observedWeight', 'isPartial', 'missingDomains', 'renormalized', 'compositionVersion'] as const;
const coverageMatchesUpstream = coverageFieldIds.every((field) => JSON.stringify(canonicalCreditCycleStateExample.financialConditionsInputState.coverage[field]) === JSON.stringify(upstreamCoverage[field]));
const close = (left: number | null | undefined, right: number, tolerance = 1e-9) => typeof left === 'number' && Math.abs(left - right) <= tolerance;
const latestOfficial = bisCreditCycleSelectedObservations.at(-1);

const canonicalStateAudit = [
  { key: 'all 29 top-level state keys covered', passed: Object.keys(canonicalCreditCycleStateExample).length === canonicalCreditCycleStateFields.length && canonicalCreditCycleStateFields.length === 29 },
  { key: 'stable schema and registered state identity', passed: canonicalCreditCycleStateExample.schemaVersion === 'credit-cycle-state-v1' && !canonicalCreditCycleStateExample.schemaVersion.includes('draft') && canonicalCreditCycleStateExample.stateId === 'SYNTHETIC_REGISTERED_CREDIT_CYCLE_STATE' },
  { key: 'four upstream canonical producers carry non-empty source-to-target mappings', passed: canonicalCreditCycleStateExample.inputLineage.length === 4 && canonicalCreditCycleStateExample.inputLineage.every(({ relation, mappings }) => relation === 'direct-canonical-import' && mappings.length > 0) },
  { key: 'producer identities, lesson revisions and observation/publication clocks are preserved and cutoff-safe', passed: producerIdentityGate && producerRevisionGate && producerClockGate },
  { key: '3.12 sealed lesson keeps its legacy frozen producer schema and revision markers', passed: legacyProducerContractPreserved },
  { key: 'all 36 declared source-to-target imports match by primitive value or object identity', passed: directCanonicalMappingsMatch && directCanonicalMappingPairsAreUnique },
  { key: 'missing source, missing target, unwired source and cloned-object injections are rejected', passed: injectedMissingSourceMappingRejected && injectedMissingTargetMappingRejected && injectedExistingButUnwiredSourceRejected && equalButClonedObjectRejected },
  { key: '3.13 full vector is preserved rather than scalar only', passed: canonicalCreditCycleStateExample.financialConditionsInputState.laneStates === canonicalFinancialConditionsStateExample.laneStates && canonicalCreditCycleStateExample.financialConditionsInputState.scalarIsOnlyOutput === false },
  { key: '3.13 weight and contribution ledgers are preserved', passed: canonicalCreditCycleStateExample.financialConditionsInputState.weightLedger === canonicalFinancialConditionsStateExample.compositeState.weightLedger && canonicalCreditCycleStateExample.financialConditionsInputState.contributionLedger === canonicalFinancialConditionsStateExample.compositeState.contributionLedger },
  { key: 'all eight 3.13 coverage and composition fields match', passed: coverageMatchesUpstream },
  { key: 'stock-flow identity closes exactly', passed: canonicalCreditCycleStateExample.creditAccountingState.reconciliationStatus === 'closed' && stockFlowResult.accepted && close(stockFlowResult.computedClosingStock, 110) && close(stockFlowResult.reconciliationResidual, 0) },
  { key: 'ending stock and declared-window flow units remain distinct', passed: canonicalCreditCycleStateExample.unitContract.endingStockUnit === 'SYN-currency-at-declared-period-end' && canonicalCreditCycleStateExample.unitContract.windowFlowUnit === 'SYN-currency-per-declared-window' },
  { key: 'originations, net flow and stock change remain distinct', passed: canonicalCreditCycleStateExample.originationState.syntheticGrossOriginations === 20 && stockFlowResult.netTransactionFlow === 12 && stockFlowResult.stockChange === 10 && canonicalCreditCycleStateExample.originationState.grossOriginationsEqualStockChange === false },
  { key: 'credit growth and debt service preserve distinct, explicit windows', passed: close(canonicalCreditCycleStateExample.creditGrowthState.stockGrowthRatio, 0.1) && canonicalCreditCycleStateExample.creditGrowthState.isAnnualizedTransform === false && canonicalCreditCycleStateExample.clockState.stockFlowWindow === `${canonicalStockFlowInput.periodStart}/${canonicalStockFlowInput.periodEnd}` && canonicalCreditCycleStateExample.clockState.debtServicePaymentWindow === `${canonicalDebtServiceInput.paymentWindowStart}/${canonicalDebtServiceInput.paymentWindowEnd} ${canonicalDebtServiceInput.paymentWindowDirection}` },
  { key: 'passive leverage preserves three denominators and subtracts registered other liabilities from equity', passed: canonicalCreditCycleStateExample.leverageState.input.otherLiabilities === 0 && leverageResult.before.totalLiabilities === 80 && close(leverageResult.after.debtToAssets, 80 / 102) && close(leverageResult.after.debtToEquity, 80 / 22) && close(leverageResult.after.debtToIncome, 4) && canonicalCreditCycleStateExample.leverageState.denominatorRegistry.length === 3 },
  { key: 'debt-service repricing uses one exact forward window, mutually exclusive principal buckets and a declared accrual approximation', passed: debtServiceResult.before.totalPrincipalDue === debtServiceResult.before.scheduledAmortisationExcludingBalloon + debtServiceResult.before.balloonPrincipalDue && canonicalDebtServiceInput.paymentWindowDirection === 'forward-contractual-cash-flows' && canonicalDebtServiceInput.interestAccrualAssumption === 'opening-debt-full-window-interest-principal-paid-at-window-end' && close(debtServiceResult.before.dsr, 0.4) && close(debtServiceResult.after.dsr, 13 / 22.5) },
  { key: 'supply demand is not inferred from aggregate quantity and resource bridge uses non-overlapping window flows', passed: canonicalCreditCycleStateExample.supplyDemandState.aggregateCreditChangeIdentifiesSupply === false && canonicalCreditCycleStateExample.supplyDemandState.applicationLevelDesignRequired && canonicalCreditCycleStateExample.supplyDemandState.resourceBridgeContract.componentsAreWindowFlows && !canonicalCreditCycleStateExample.supplyDemandState.resourceBridgeContract.cashBalanceLevelMayEnterDirectly && canonicalCreditCycleStateExample.supplyDemandState.resourceBridgeContract.cashBufferDrawdownAndOperatingCashFlowAreNonOverlapping },
  { key: 'underwriting and composition preserve 3.12 producer identity', passed: canonicalCreditCycleStateExample.underwritingCompositionState.producerStateId === canonicalMonetaryPolicyRiskTakingStateExample.stateId && canonicalCreditCycleStateExample.underwritingCompositionState.compositionCanMoveWithoutWithinGroupChange },
  { key: 'borrower balance and collateral preserve 3.11 producer', passed: canonicalCreditCycleStateExample.borrowerNetWorthState.producerStateId === canonicalBorrowerCollateralStateExample.stateId && canonicalCreditCycleStateExample.collateralAssetPriceState.upstreamCollateralPool === canonicalBorrowerCollateralStateExample.collateralPoolState },
  { key: 'loss-capital teaching bridge recognises one assumed net-LGD estimate across capital and pre-loss net carrying loans', passed: close(capitalLossResult.syntheticLossEstimate, 4) && close(capitalLossResult.postAssumedLossCapacity, 75) && close(capitalLossResult.requiredSimpleShrinkage, 21) && canonicalCreditCycleStateExample.defaultLossState.lossStatus === 'synthetic-estimate-not-realised-workout-loss' && canonicalCreditCycleStateExample.defaultLossState.recoveryAndGuaranteeTreatmentFrozen && canonicalCreditCycleStateExample.defaultLossState.input.currentLoansBasis === 'pre-assumed-loss-net-carrying-loans' && canonicalCreditCycleStateExample.defaultLossState.input.recognitionAssumption.includes('recognised-once') && canonicalCreditCycleStateExample.defaultLossState.input.separateRecoveryOrGuaranteeDeductionApplied === false && canonicalCreditCycleStateExample.intermediaryCapitalState.simplifiedCapacityIsRegulatoryDecision === false },
  { key: 'refinancing principal is counted once and FX exposure rejects direct notional, income-level and asset-level subtraction', passed: canonicalCreditCycleStateExample.refinancingState.principalCashFlowsCountedOnce && canonicalCreditCycleStateExample.refinancingState.principalPartitionRule === 'balloon-maturity-plus-amortisation-excluding-balloon' && canonicalCreditCycleStateExample.refinancingState.fxExposureContract.measurementStatus === 'not-computed' && !canonicalCreditCycleStateExample.refinancingState.fxExposureContract.hedgeNotionalMayEnterDirectly && !canonicalCreditCycleStateExample.refinancingState.fxExposureContract.incomeOrAssetLevelMayEnterDirectly },
  { key: 'distribution decomposition closes', passed: close(compositionResult.aggregateChange, compositionResult.withinEffect + compositionResult.compositionEffect) && close(compositionResult.residual, 0) },
  { key: 'warning prediction and causality remain separate', passed: warningResult.predictionStatus === 'not-estimated' && warningResult.causalStatus === 'not-identified' && canonicalCreditCycleStateExample.earlyWarningState.isProbability === false },
  { key: 'three evidence axes remain separated', passed: canonicalCreditCycleStateExample.evidenceState.measurementStatus === 'synthetic-mechanically-audited-with-official-orientation' && canonicalCreditCycleStateExample.evidenceState.predictionStatus === 'not-estimated' && canonicalCreditCycleStateExample.evidenceState.causalStatus === 'not-identified' },
  { key: 'all full official passports are single-source, latest-vintage and quarantined', passed: canonicalCreditCycleStateExample.dynamicDataPassports === bisCreditCycleDynamicDataPassports && canonicalCreditCycleStateExample.dynamicDataPassports.length === 3 && canonicalCreditCycleStateExample.dynamicDataPassports.every(({ observationCount, selectedObservationCount, sourceUrl, portalDeclaredLastRelease, portalDeclaredNextScheduledRelease, latestVintageOnly, mayEnterCanonicalCalculation }) => observationCount >= selectedObservationCount && selectedObservationCount === 28 && sourceUrl.startsWith('https://') && portalDeclaredLastRelease.length === 10 && portalDeclaredNextScheduledRelease.length === 10 && latestVintageOnly && !mayEnterCanonicalCalculation) },
  { key: 'all 28 official rows and three series projections match frozen SHA-256', passed: bisCreditCycleRecomputedCombinedNormalizedSha256 === bisCreditCycleCombinedNormalizedSha256 && bisCreditCycleRecomputedNormalizedSha256.totalCreditToGdp === canonicalCreditCycleStateExample.dynamicDataPassports[0].normalizedSha256 && bisCreditCycleRecomputedNormalizedSha256.creditGap === canonicalCreditCycleStateExample.dynamicDataPassports[1].normalizedSha256 && bisCreditCycleRecomputedNormalizedSha256.debtServiceRatio === canonicalCreditCycleStateExample.dynamicDataPassports[2].normalizedSha256 },
  { key: 'latest three official observations preserve native units', passed: latestOfficial?.period === '2025-Q4' && close(latestOfficial?.totalCreditToGdp, 140.3) && close(latestOfficial?.creditGap, -11.5378) && close(latestOfficial?.debtServiceRatio, 14.1) },
  { key: 'all fixture and scenario runtime gates pass', passed: creditCycleFixtureAudit.every(({ passed }) => passed) && creditCycleScenarioAssertions.every(({ passed }) => passed) && creditCycleNumericAssertionAudit.every(({ passed }) => passed) },
] as const;

if (!canonicalStateAudit.every(({ passed }) => passed)) {
  throw new Error(`3.14 canonical state gate failed: ${canonicalStateAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

const lesson314CorePathSectionIds = new Set([
  'object-cycle-not-clock', 'stock-flow-accounting', 'credit-growth', 'leverage-ratio', 'credit-gap',
  'cycle-clocks', 'conditions-to-menu', 'supply-demand-nonidentification', 'bank-capacity',
  'underwriting-composition', 'borrower-net-worth', 'collateral-borrowing-base', 'financial-accelerator',
  'channel-substitution', 'origination-stock-disconnect', 'maturity-wall', 'debt-service-ratio',
  'turning-sequence', 'default-transition', 'loss-severity', 'intermediary-capital-feedback',
  'real-activity', 'identification-gate', 'loop-closure',
]);

function CreditCycleConceptSection({ section }: { section: ConceptSection }) {
  const learningTrack = lesson314CorePathSectionIds.has(section.id) ? 'CORE PATH' : 'OPTIONAL DEEP DIVE';
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

const entryVocabulary = [
  ['Credit stock', '信用存量：在某个期末仍未偿的合约本金或统计头寸；不是本期新贷。'],
  ['Gross origination', '总发放：窗口内新签并实际形成的信用流量；不扣偿还和核销。'],
  ['Net transaction flow', '净交易流：发放减本金偿还；仍不包含核销、重估和重分类。'],
  ['Leverage', '杠杆：债务相对资产、权益、收入或资本的比例；分母改变，含义就改变。'],
  ['Credit gap', '信用/GDP比率相对某条估计趋势的百分点偏离；不是均衡缺口或危机概率。'],
  ['Debt-service ratio', '偿债率：声明窗口内利息与摊还占收入的比例；不是债务/收入。'],
  ['Maturity wall', '到期墙：一批债务在相近窗口集中到期或重定价形成的再融资暴露；到期气球本金与其他计划摊还必须互斥。'],
  ['LGD', '违约损失率：在声明回收窗与贴现口径下，违约时EAD中未被净回收覆盖的比例；假设值不是已实现损失。'],
  ['Composition effect', '构成效应：总体变化来自组别权重变化，而不是各组内部状态变化。'],
  ['Vintage', '版本或批次：既可指数据修订版本，也可指同一发放期形成、随后共同跟踪的贷款批次。'],
] as const;

const conceptSections: ConceptSection[] = [
  {
    id: 'object-cycle-not-clock', number: 2, label: 'Object Before Phase',
    title: '信用周期不是一只按固定节拍摆动的钟，而是一组资产负债表反馈在特定制度下反复改变方向。',
    paragraphs: [
      '把信用周期画成“繁荣—顶点—衰退—谷底”的圆环很容易记，却也容易制造错觉：仿佛每个经济体都沿同一路径、用同样速度前进，而且只要找到当前位置就能推出下一站。本节采用更严格的对象：借款人与贷款人的合同存量、融资流量、净值、抵押价值、偿债负担、损失吸收能力和融资条件之间的跨期反馈。所谓阶段只是对这些状态的事后或模型化摘要，不是独立推动系统的力量。',
      '因此，分析必须从护照开始：谁是借款人和债权人，统计哪些工具，按居民地还是母国合并，金额用什么币种，观察时点和发布版本是什么。家庭按揭、企业循环额度、国际债券和贸易信用可以同时扩张，却具有不同重定价、抵押与违约时钟；把它们压成一条线之前，必须知道压缩后丢失了什么。Borio与Drehmann等人的金融周期框架强调信用与资产价格的中期共振，但并没有授权我们把任一单指标称为完整周期。',
      '本节的中心命题是：金融条件先改变边际融资菜单，菜单改变发放、偿还与资产选择，流量累积成信用存量与杠杆，资产价格和收入再改变借款人净值与偿债能力；违约、回收、资本和流动性反馈最终重写下一期金融条件。只有这条闭环被具体变量和时钟连接起来，才是在解释周期，而不是给一条波动曲线贴名称。',
    ],
    sourceIds: [4, 5, 6],
    formula: { label: '机制对象', expression: 'credit cycle = state-dependent feedback among contracts, stocks, flows, net worth, losses and financing conditions', note: '它不是固定正弦波；phase label只能是对已声明状态空间的分类结果。' },
    boundary: '3.14拥有信用反馈闭环；3.15展开债务积压与杠杆脆弱性，3.16处理住房制度，7.11–7.13处理强制去杠杆、火售与网络传染。',
  },
  {
    id: 'stock-flow-accounting', number: 3, label: 'Stock–Flow Accounting',
    title: '先让信用账本闭合：期末存量变化不等于新发放，也不一定等于净融资。',
    paragraphs: [
      '信用存量是在某个期末仍未偿的头寸；gross origination是窗口内新形成的合约流量；净交易流还要扣除本金偿还。即使这三项都准确，期末存量仍会受到核销、证券价格或汇率重估、机构覆盖变化和工具重分类影响。于是“贷款余额增加10”可能来自发放20、偿还8、核销3和其他变化+1；把10直接叫作“银行新放贷”会同时错过交易、损失和统计变动。',
      'IMF的存量—流量框架要求期初头寸、交易、重估、其他数量变化与期末头寸横向相加闭合。这里把核销单列，是为了让信用风险实现与普通交易净流保持可见；在正式统计中它应被映射回相应的其他数量变化或会计处理。若对账残差不为零，应先停止解释并查找覆盖、币种、估值、时间或缺失交易，而不是把残差塞进“其他”。',
      '这一纪律也决定增长率的分母：只有定义一致的期初与期末存量才可计算stock growth；只有同一窗口的发放和偿还才可计算net flow。跨频率年化、合并范围变化或贷款出售都会改变含义，必须显式记录。',
    ],
    sourceIds: [1, 14, 35],
    formula: { label: '存量—流量桥', expression: 'C₁ = C₀ + originations − repayments − charge-offs + valuation + FX + reclassifications', note: '每一项必须使用同一范围、币种和窗口；残差不为零时输出STOP。' },
    boundary: '本节解释会计连接，不识别发放变化来自供给还是需求，也不把核销发生时点当成经济损失最初形成时点。',
    after: <StockFlowBridgeLab />,
  },
  {
    id: 'credit-growth', number: 4, label: 'Credit Growth',
    title: '信用增长率是一个经过分母和统计边界条件化的存量变化率，不是“信用冲击”的同义词。',
    paragraphs: [
      '最简单的信用增长是期末存量除以期初存量减一。它回答“同口径未偿信用扩大了多少”，不回答窗口内贷出了多少，更不回答是谁主动改变。期初存量很小会放大增长率；证券化、贷款出售、坏账核销和汇率变化可让存量移动而新合约不变；长期贷款持续发放但旧债同时到期，也可能使存量增长很低。',
      '把信用除以GDP能部分控制经济规模，却又引入分母渠道。2020年一类典型现象是GDP骤降和应急融资同时发生，credit/GDP可能跳升；这不等于家庭和企业在同一季度完成了典型繁荣式加杠杆。分析者应并列报告名义信用、交易流、GDP分母贡献和部门构成，而不是从比率跳到动机。',
      '增长还必须带窗口：季度同比、年化季环比和五年累计增长不可直接比较。若目标是早期预警，变换、滞后、vintage和危机标签要在观察结果前冻结；若目标是机制识别，总量增长只是一项结果变量，仍需外生处理与反事实。',
    ],
    sourceIds: [1, 2, 8, 14],
    formula: { label: '最小增长定义', expression: 'gᶜₜ = Cₜ / Cₜ₋ₕ − 1', note: 'h、存量口径、币种、合并范围和是否年化都属于变量定义，而不是脚注。' },
    boundary: '信用增长可用于描述或预测；未经过供需分解时，不得命名为credit-supply shock。',
  },
  {
    id: 'leverage-ratio', number: 5, label: 'Leverage Denominators',
    title: '“债务没增加”不等于杠杆没上升：资产价格、权益和收入三个分母会走出不同路径。',
    paragraphs: [
      'D/A衡量债务在资产价值中的占比，D/E强调权益这层损失缓冲有多薄，D/I更接近债务相对收入流的规模。一般资产负债表先用权益=资产−总负债；本页合成例把其他负债明确冻结为0，才可由120−80得到权益40。债务固定为80、资产从120跌到102时，D/A由66.7%升到78.4%，D/E由2倍升到3.64倍，而收入若仍为20，D/I仍是4倍。',
      '这种被动杠杆上升是反馈的关键：价格下跌先侵蚀权益分母，随后触发LTV、资本、保证金或内部限额，即使主体尚未主动新增债务。若为了恢复目标比率而卖资产，销售又可能压低价格并伤害其他持有者；Fisher的债务通缩和现代抵押约束模型正是沿这条分母—行为—价格链放大冲击。',
      '但账面资产、市场价值和监管风险加权资产不是同一分母；企业D/E、家庭LTV与银行资本率也不能互换。权益为零或负时，D/E不再是正常的正倍数，应该报告distress状态，而不是用绝对值美化。',
    ],
    sourceIds: [15, 16, 18, 23, 26],
    formula: { label: '三种杠杆', expression: 'equity = assets − total liabilities; D/A = debt/assets; D/E = debt/equity; D/I = debt/income', note: '若debt不等于总负债，权益还必须扣除其他负债；本页教学例明确令其他负债为0。' },
    boundary: '3.14展示分母反馈；资本结构最优性、债务积压与完整leverage cycle在3.15继续。',
    after: <PassiveLeverageLab />,
  },
  {
    id: 'credit-gap', number: 6, label: 'Credit-to-GDP Gap',
    title: 'Credit gap是“比率减估计趋势”的统计对象，不是结构均衡缺口、政策按钮或危机概率。',
    paragraphs: [
      'BIS基准credit-to-GDP gap将私人非金融部门信用/GDP比率减去单边长期趋势，以便只使用当时及以前的数据估计趋势。正gap表示当前比率高于这条估计趋势若干百分点；负gap表示低于趋势。它没有直接告诉你信用供给松紧、借款人净值或未来危机概率，也不意味着趋势本身就是可持续均衡。',
      '端点是困难所在：新数据到来后，趋势在样本末端会重新估计；信用和GDP历史也会修订。今天下载的latest-vintage完整历史不是过去决策者当时看到的序列。Edge与Meisenzahl展示了实时gap可能大幅改变，BIS后续比较也没有发现一种在所有环境都统治的单变量滤波器。正式回测必须保存逐期vintage，不能用今天的历史冒充实时输入。',
      '监管框架把gap视为共同参考而非机械开关。决策还需结合信贷标准、资产价格、偿债负担、杠杆分布、资本与市场情报；gap阈值跨国搬运尤其危险，因为统计覆盖、金融深化与结构断点不同。',
    ],
    sourceIds: [2, 7, 8, 9, 10],
    formula: { label: 'Gap定义', expression: 'gapₜ = 100·Cₜ/GDPₜ − one-sided trendₜ', note: '单位是credit/GDP比率的百分点；趋势版本、滤波参数和vintage必须一起保存。' },
    boundary: '本节不把HP趋势解释为潜在信用需求或自然杠杆；政策用途必须保留判断空间与多指标证据。',
  },
  {
    id: 'joint-cycle', number: 7, label: 'Joint Financial Cycle',
    title: '信用与资产价格常共同运动，但“共同运动”既不是定义上的恒等式，也不是单向因果证明。',
    paragraphs: [
      '信用扩张可以抬高可融资资产需求，资产涨价又扩大抵押品和净值，从而支持更多信用；这条双向反馈使信用与房地产价格在中期尺度上经常共同波动。它比只看贷款增长更接近金融周期的系统含义，因为同样的贷款流若没有资产负债表反馈，持续性和尾部风险可能完全不同。',
      '然而同步性可能来自共同的收入、技术、人口、监管或全球融资冲击。股票周期通常更短、更噪，住房供给制度又会改变价格反应；信用也可能流向营运资本而非可交易资产。研究者应先声明联合状态的构成和频带，再检验lead–lag与机制，而不是看两条曲线同涨便宣布抵押反馈已被识别。',
    ],
    sourceIds: [4, 5, 6, 37, 38, 39],
    formula: { label: '反馈而非等号', expression: 'credit ↔ asset prices through collateral, net worth, demand and intermediary constraints', note: '双箭头是待检验机制；相关性只说明共同变化，不能自动指定箭头方向。' },
    boundary: '住房价格的供给弹性、按揭制度和追索权差异由3.16展开；这里保留一般资产负债表接口。',
  },
  {
    id: 'cycle-clocks', number: 8, label: 'Multiple Clocks',
    title: '价格、发放、存量、重定价、违约与核销各有时钟；用同一个“本季度”会把因果顺序压扁。',
    paragraphs: [
      '市场利差和资产价格可在分钟内变化，贷款申请到发放需要天或月，存量由长期合约缓慢累积，固定利率债务可能数年后才再融资，拖欠和违约又晚于现金流恶化，核销还受会计与处置程序影响。因此紧缩初期可能先看到新发放下降，却看到存量因既有承诺提款而上升；危机后利率下降，也可能尚未传到旧债的现金流。',
      '正确做法不是强迫数据同频，而是保存事件时钟：申请、批准、承诺、提款、期末余额、重定价、到期、拖欠、违约、回收和核销分别何时发生。模型可以把它们映射到共同状态空间，但映射必须显式；缺少发布时钟时，还会产生未来修订和信息泄漏。',
      '周期“转折点”也依赖对象：价格可能最先转，发放随后，存量最后；DSR可能在利率下降后仍因收入下滑保持高位。于是不存在无需口径的单一顶点。',
    ],
    sourceIds: [5, 6, 13, 28, 44],
    formula: { label: '时钟向量', expression: 'τ = (application, approval, origination, balance, repricing, maturity, default, recovery, write-off, publication)', note: '研究窗口必须说明使用τ中的哪一项；相同日历日期不代表相同经济阶段。' },
    boundary: '本节建立时钟纪律，不提供一个自动cycle-dating算法；正式状态切换与实时识别留给Chapter 7。',
  },
  {
    id: 'conditions-to-menu', number: 9, label: 'Conditions → Financing Menu',
    title: '金融条件不会直接“生成贷款”：它先改写价格、额度、期限、抵押、契约与资格组成的边际菜单。',
    paragraphs: [
      '3.13输出的是主体特定的多维融资条件。进入3.14时必须保留六条lane、方向、权重、贡献与coverage，而不是只传一个0.7167分数。相同总指数可能由高基准利率与宽利差组成，也可能由资产价格下跌与银行额度收紧组成；前者主要改变all-in cost，后者可能让愿意付价的借款人也拿不到资金。',
      '融资菜单变化后，主体首先选择申请、延迟、缩小项目、换贷款人、发行债券、使用贸易信用或动用现金。只有被批准、签约并提款的部分进入发放流；未使用额度仍是或有流动性，不是存量债务。菜单到行为的映射受净值、盈利、投资机会和预期共同影响，因此条件收紧与贷款下降之间没有固定乘数。',
      '这条接口还解释内生反应：经济预期恶化会同时推高利差、降低贷款需求并促使银行收紧标准。若把FCI当外生处理，便把系统对未来的反应误写成冲击。',
    ],
    sourceIds: [16, 17, 18, 24, 31, 35],
    formula: { label: '菜单映射', expression: 'FC vectorₜ → {all-in price, limit, maturity, collateral, covenant, eligibility}ₜ → applications/acceptance/draws', note: '每个箭头依赖主体与合同；scalar只可作为附加视图。' },
    boundary: '融资条件的测量归3.13，银行报价与审批归3.10，借款人约束归3.11；3.14拥有这些选择如何累积成周期。',
  },
  {
    id: 'supply-demand-nonidentification', number: 10, label: 'Supply–Demand Non-identification',
    title: '总贷款下降同时兼容供给收紧、需求转弱和借款人退出；数量本身不能分离哪一侧移动。',
    paragraphs: [
      '成交信用是供给菜单与借款需求共同决定的结果。银行因资本损失拒贷会降低数量；企业因预期销售下降而取消投资也会降低数量；风险较高的申请人退出样本还会让剩余平均利率或违约率改善。只观察总余额、平均利率和GDP，很难从均衡点恢复两条潜在曲线。',
      '可信设计利用更细的双边或申请级数据：同一企业面对不同银行，或同一银行面对相似申请；处理暴露在冲击前确定，并用借款人×时间或申请固定效应控制共同需求。Khwaja–Mian、Jiménez等和Amiti–Weinstein展示了这类思路，但所得estimand仍局限于样本支持、贷款人渠道和特定冲击，不能自动等于借款人总融资效应。',
      '还必须追踪替代。原银行贷款相对反事实减少20、其他银行增加8、债券增加2、非银行增加1时，原配对效应是−20，借款人总外部融资只减少9；若同窗经营现金流相对反事实为0，并额外动用期初现金缓冲4，则可用资源差为−5。这里的4是窗口内cash-buffer drawdown流量，不是现金余额4，也不能与已经计入的经营现金流重复。',
    ],
    sourceIds: [29, 30, 32, 35, 36],
    formula: { label: '均衡不可逆推', expression: 'observed credit = min/interaction of lender menu and borrower demand; Δcredit alone ⇒ no unique Δsupply', note: '要识别供给，需要外生贷款人暴露、共同需求反事实与明确支持总体。' },
    boundary: '配对银行效应、借款人总外部融资和实体结果是三个不同estimand，必须分栏报告。',
  },
  {
    id: 'bank-capacity', number: 11, label: 'Intermediary Capacity',
    title: '银行的贷款能力由资金、资本、杠杆、流动性与集中度中最先约束的那一项决定。',
    paragraphs: [
      '银行不是把存款机械乘一个常数得到贷款。边际贷款同时占用融资、风险加权资产资本、杠杆敞口、流动性缓冲、稳定融资和集中度空间；每项原生headroom必须映射到同一贷款本金与期限后，才能比较。最小容量是约束集合的下包络，binding constraint会随资产价格、风险权重、存款流出和组合变化而切换。',
      '资本约束尤其具有放大性：资本是资产负债表的一层薄缓冲，一单位已实现损失可能削减多单位风险资产容量。但容量下降不等于银行必然立刻同额缩贷；它还可以留存利润、发行资本、改变风险密度、使用缓冲、出售资产或减少其他业务。把简化容量公式称为监管决策会忽略监督判断与并行约束。',
      '危机中信息资本也重要。银行倒闭或关系中断不仅减少资金，还毁损对借款人的专有信息，使替代贷款人难以及时接手；这让同样的资本缺口对关系型借款人更痛。',
    ],
    sourceIds: [19, 20, 25, 36],
    formula: { label: '统一容量', expression: 'loan capacity = minⱼ {signed native headroomⱼ / marginal usageⱼ per target loan unit}', note: '每个j必须映射到同一法律实体、产品、币种、决策时点与期限。' },
    boundary: '本节只解释约束容量；银行是否愿意承担风险还要进入3.12的治理、定价和承保选择。',
  },
  {
    id: 'underwriting-composition', number: 12, label: 'Underwriting & Composition',
    title: '繁荣不只增加“多少信用”，还会改变信用给了谁、以什么条款给、风险在哪个vintage里累积。',
    paragraphs: [
      '当竞争、低利差或风险感知下降改变决策规则时，银行可能提高高PD借款人的批准份额、延长久期、降低抵押与契约保护，或把收益目标转向尾部更重的资产。总发放不变也能发生风险构成迁移；总发放上升也可能主要来自低风险借款人和生产性项目。数量增长因此必须与承保标准、borrower mix、产品、LTV、利差和模型版本共同读取。',
      '事后违约率不能无条件反推事前风险选择。宽松期收入和资产价格改善可能让更高风险vintage短期表现良好；只有固定发放批次、决策时信息、PD期限、EAD权重和完整后续窗口，才能比较选择与结果。退出、提前偿还、贷款出售和右删失都会改变分母。',
      '长期证据表明并非所有繁荣结局相同。组成、融资来源、资产价格共振、外部失衡和监管状态会改变尾部；因此“增长率超过x就是坏繁荣”过于粗糙。',
    ],
    sourceIds: [31, 35, 40, 42],
    formula: { label: 'vintage风险', expression: 'ex-ante riskᵥ = Σᵢ EADᵢ·PDᵢ / Σᵢ EADᵢ, with information frozen at origination', note: '它不同于同批贷款未来实现的违约率；两者的时钟与证据身份必须分开。' },
    boundary: '3.12拥有纯风险选择的识别与治理语义；3.14只追踪选择如何跨vintage累积并反馈。',
  },
  {
    id: 'borrower-net-worth', number: 13, label: 'Borrower Net Worth',
    title: '借款人净值是损失吸收垫、承诺可信度与外部融资溢价共同依赖的状态变量。',
    paragraphs: [
      '资产减负债得到的净值并非只是一项会计结果。净值越厚，借款人越能吸收项目损失、提供自有资金并减少借贷双方的激励冲突；贷款人因而可能要求更低的监督成本、风险溢价或抵押保护。盈利留存和资产升值提高净值时，融资改善可以支持投资和资产需求，形成扩张反馈。',
      '反向链同样成立：收入或资产价格下降侵蚀净值，外部融资溢价上升、额度下降，投资和就业收缩又削弱未来现金流。Eggertsson–Krugman强调高负债主体的支出收缩如何压低总需求，Mian–Sufi则显示住房净值借款的特定美国经验；这些机制不能不加条件地外推到所有部门与制度。',
      '净值必须对账：期初净值加净储蓄、资本转移、持有损益与其他数量变化等于期末净值。把市场涨价当经营现金流，或把集团担保和少数股权忽略，会制造虚假缓冲。',
    ],
    sourceIds: [16, 17, 23, 26],
    formula: { label: '净值反馈', expression: 'net worth ↑ → external-finance premium ↓ / capacity ↑ → spending & asset demand ↑ → next net worth', note: '箭头的强度依赖信息不对称、合同执行、抵押资格和替代融资。' },
    boundary: '净值、现金流与可质押资源的逐项合同实现由3.11提供；这里使用其冻结状态进入跨期反馈。',
  },
  {
    id: 'collateral-borrowing-base', number: 14, label: 'Collateral Borrowing Base',
    title: '抵押品市值要经过所有权、可执行性、资格折扣、advance rate与既有提款，才变成新增借款空间。',
    paragraphs: [
      '“有100元资产”不等于“还能借100元”。贷款人先验证法律所有权和抵押权顺位，再按规则决定eligible share；对合格价值应用advance rate或haircut，并扣除优先权、集中度上限和现有已提款额。得到的是特定合同、币种、时点下的borrowing base和headroom，而不是资产的一般流动性。',
      '资产价格下跌会机械压缩borrowing base，触发补充抵押、还款或停止提款；若借款人出售同类资产应对，价格和其他主体的抵押空间又可能同步下降。Kiyotaki–Moore说明耐久资产兼具生产和抵押用途时，这种价格—信用反馈可放大并延长冲击；现实里法律执行、估值滞后和贷款人重议会改变速度。',
      '本页的C3只隔离算术：市值120×80%×70%=67.2，扣既有提款50后headroom 17.2；市值跌20%后headroom只剩3.76。它是SYNTHETIC教学桥，不能拿来估计真实LTV或放贷。',
    ],
    sourceIds: [18, 26, 27],
    formula: { label: '借款基数', expression: 'headroom = eligible market/appraised value × advance rate − prior claims − existing secured draws', note: '负headroom表示约束超限状态；不能把它截断为“仍有零风险空间”后忘掉缺口。' },
    boundary: '房产供给、按揭追索权和法拍外部性在3.16处理；7.12–7.13处理保证金与火售。',
    after: <CollateralBorrowingBaseLab />,
  },
  {
    id: 'financial-accelerator', number: 15, label: 'Financial Accelerator',
    title: '金融加速器不是“金融会放大一切”，而是净值对外部融资楔子的状态依赖映射。',
    paragraphs: [
      '当贷款人无法无成本观察或约束借款人，外部资金通常比内部资金更贵；净值越薄、可承诺资源越少，监督、激励与违约问题越严重，external finance premium越高。一个原本只减少现金流的冲击会因净值下降再推高融资成本，随后压低投资、就业和资产需求，使最初冲击被内生放大。',
      '“加速”不保证方向和大小恒定。现金富裕企业、政府担保融资、关系银行信息资本、可发行债券的企业或资产供应刚性较弱的市场可能显著缓冲；中介资本受损、抵押品同质且市场流动性差时则更强。识别时还要区分信用利差中的预期违约补偿与超额溢价，不能把全利差变化都命名为融资摩擦。',
      '该机制与抵押反馈相连却不相同：抵押约束直接改变可借上限，金融加速器更广义地让净值改变外部融资楔子。两者可同时存在，实证代理变量不能混为一列。',
    ],
    sourceIds: [16, 17, 18, 19],
    formula: { label: '楔子映射', expression: 'external finance premium = Φ(net worth, collateral, information, enforcement, intermediary state), ∂Φ/∂net worth < 0 locally', note: '负导数是局部模型关系，不是所有样本和状态的固定常数。' },
    boundary: '本节解释传播机制，不以理论函数Φ替代经验估计；每个应用都需声明支持总体与识别设计。',
  },
  {
    id: 'channel-substitution', number: 16, label: 'Channel Substitution',
    title: '一条融资渠道收缩后，问题不是“有没有替代”，而是替代了多少、谁能替代、成本和时钟是否等价。',
    paragraphs: [
      '大企业可能从银行贷款转向债券，小企业可能转向其他银行、贸易信用、租赁、非银行或内部现金。替代使单个贷款人冲击不必等量传到借款人总融资；但新渠道可能期限更短、抵押更重、币种不同或只覆盖高质量借款人。名义融资金额恢复，不代表融资条件或风险分布恢复。',
      '匹配银行—企业研究能分解贷款人冲击，跨境银行冲击还可利用母行暴露；但若不观察债券和非银行资产负债表，结论只覆盖原渠道。实体结果还受现金缓冲、库存调整和项目可延迟性调节。Chodorow-Reich的就业证据说明贷款人健康对特定中小企业重要，却不等于局部估计自动包含一般均衡。',
      '周期下行时替代能力本身会内生下降：市场利差扩大、共同抵押品贬值、多个银行同时受损，原本独立的备选渠道一起收缩。这正是局部冲击走向系统状态的桥。',
    ],
    sourceIds: [32, 33, 34, 35],
    formula: { label: '资源桥', expression: 'Δavailable resourcesₕ = Δoriginal lenderₕ + Δother banksₕ + Δbondsₕ + Δnonbanksₕ + Δoperating cash flowₕ + cash-buffer drawdownₕ', note: '每项都是同一horizon、同币种、相同反事实基准下的窗口流量；现金余额不能直接相加，经营现金流与缓冲动用必须互斥。' },
    boundary: '替代率是样本与状态依赖对象，不应从一次危机估计永久外推。',
  },
  {
    id: 'origination-stock-disconnect', number: 17, label: 'Origination–Stock Disconnect',
    title: '新贷可以骤降而贷款余额暂时上升：承诺提款、偿还、到期与核销把发放时钟和存量时钟拆开。',
    paragraphs: [
      '危机初期企业可能预防性提取既有循环额度，使银行账面贷款余额上升；与此同时新申请批准和新承诺已经冻结。Ivashina–Scharfstein记录的2008年经验展示了这种背离。若分析者只看季度余额，会把流动性防御误解为银行主动扩张新信用。',
      '随后偿还、到期、贷款出售与核销又可能使余额下降，即使新发放已经开始恢复。要诊断周期，至少并列申请、批准、承诺、发放、提款、未偿余额、偿还和核销；每一项有不同的主体行为与风险含义。存量—流量账本为这些事件提供闭合检查，但不会自动告诉我们动机。',
    ],
    sourceIds: [1, 14, 35],
    formula: { label: '背离条件', expression: 'Δoutstanding > 0 can coexist with new originations ↓ when committed draws − repayments − write-offs + other changes > 0', note: '观察余额上升时，要先查是否来自旧额度提款，而不是直接判断新增供给。' },
    boundary: '银行承诺与提款的合同阶段由3.10定义；3.14把它们纳入周期时钟。',
  },
  {
    id: 'maturity-wall', number: 18, label: 'Maturity & Refinancing Wall',
    title: '债务存量相同，集中到期的主体可能比均匀摊还的主体更脆弱，因为旧价格要在坏时点重置。',
    paragraphs: [
      '到期墙是未来某个窗口必须偿还、续作或再融资的本金集中度。本金账本必须把到期日一次性偿还的balloon/bullet principal，与不含该气球本金的计划摊还分成互斥集合；同一笔本金只能进入一个桶。长期固定利率让当前市场加息暂不进入旧债现金流，却把风险推到再融资日；短期或浮动债务更快重定价。',
      'Almeida等利用2007年危机前预定的债务到期结构，说明短期到期在融资冻结时与投资收缩相连。关键识别价值来自到期暴露先于冲击确定；但短债在正常时期可以降低利率或纪律成本，不能由危机样本推出“短期债务总是坏”。',
      '真正的到期墙先把两个互斥本金桶合成total principal due，再净额化期初可用于还债的现金缓冲动用、同窗可信自由现金流、已承诺且可执行的未提款额度和可实现资产现金流，并检查契约触发与评级门槛。任何资源只能抵扣一次；只报告未来一年总到期额会高估或低估实际缺口。',
    ],
    sourceIds: [13, 28, 44],
    formula: { label: '再融资缺口', expression: 'principal dueₕ = balloon principalₕ + amortisation excluding that balloonₕ; refinancing gapₕ = principal dueₕ − available cash-buffer drawdownₕ − committed available linesₕ − non-overlapping free cash flowₕ', note: 'balloon集合与amortisation集合互斥；所有抵扣资源必须在同一horizon内真正可用且不得重复。' },
    boundary: '到期暴露是预定状态，不自动是外生冲击；真正处理可以是市场冻结、评级变化或政策事件。',
  },
  {
    id: 'debt-service-ratio', number: 19, label: 'Debt-Service Ratio',
    title: '违约之前，利息、本金摊还和收入已经通过DSR争夺同一现金流缓冲。',
    paragraphs: [
      '债务/收入只比较存量与流量，忽略利率和偿还结构；DSR把声明窗口内的利息与到期本金合计放入分子，除以同窗收入。C4把窗口冻结为2026-09-11至2027-09-11的前瞻合同现金流，到期本金合计由“不含气球本金的计划摊还”与“气球本金”互斥相加。债务100、年利率4%、前者6、后者0、收入25时，DSR为40%；全部重定价到7%且收入下降10%的同窗情景升到57.78%。',
      '聚合BIS DSR使用统一的分期偿付近似和剩余期限假设，因此适合观察一国时间序列压力，却不是每份合同实际现金流的简单加总。C4也只是教学近似：用期初债务计算全窗利息，并把本金视作窗末支付；若本金在窗内逐步摊还，必须改用真实现金流表或加权平均余额。跨国绝对水平还会受期限、利率结构和统计覆盖影响。',
      'DSR还具有双重内生性：央行降息可降低可重定价利息，但通常发生在收入已经恶化时；分母下降可能抵消利率缓解。看到DSR高不能仅凭时间顺序把它归因于加息。',
    ],
    sourceIds: [11, 12, 13, 23],
    formula: { label: '现金流负担', expression: 'DSRₕ = (interest paymentsₕ + total contractual principal due onceₕ) / disposable or operating incomeₕ', note: '本金必须由互斥现金流桶组成；h、收入定义、浮固比例、重定价份额、利息计提基准和本金支付时点缺一不可。' },
    boundary: '官方三联图的DSR只作真实数据定向；C4使用SYNTHETIC合同桥，两者不得混算。',
    after: <DebtServiceRepricingLab />,
  },
  {
    id: 'turning-sequence', number: 20, label: 'Turning Sequence',
    title: '典型转折更像“价格先动、数量迟到、损失最后确认”的条件性顺序，而不是固定倒计时。',
    paragraphs: [
      '繁荣后段可能先出现风险溢价过低和资产价格上涨，随后融资标准或边际发放转弱；存量因合约惯性仍高，DSR随重定价和收入变化上升，拖欠、违约、LGD与核销更晚显现。损失侵蚀中介资本后，供给与资产价格反馈加强。Krishnamurthy–Muir的危机前后证据与长期历史研究为这种价格—数量—损失顺序提供支持。',
      '但顺序会被政策、担保、会计和冲击类型改写。突发银行挤兑可让融资数量先断裂；疫情政策可能让信用/GDP比率因分母和应急贷款跳升，却延后违约；固定利率按揭可推迟DSR。研究者应把顺序写成可证伪的事件表，而不是用“已到周期第七阶段”替代测量。',
      '领先不等于因果。利差可能因投资者提前预期衰退而上升，信用需求也同时下降；如果没有外生来源，领先指标只能获得描述或预测身份。',
    ],
    sourceIds: [37, 38, 39, 42, 44],
    formula: { label: '多时钟顺序', expression: 'price/terms → marginal origination → stock/leverage → debt service/refinancing → default/LGD → capital/liquidity', note: '这是常见机制候选；任何箭头都可能因制度和政策被延迟、截断或反转。' },
    boundary: '本节不声称一个普适lead length；正式预测需要在每个vintage上重新估计并做时间外验证。',
  },
  {
    id: 'good-bad-booms', number: 21, label: 'Good and Bad Booms',
    title: '信用繁荣不是同质事件：生产性扩张、金融深化与脆弱性积累可以给出相似的总量曲线。',
    paragraphs: [
      '信用增加可以融资高回报投资、扩大金融可得性并平滑临时现金流，也可能追逐供给刚性的既有资产、降低承保标准或依赖短期外币资金。仅凭增长率无法区分。需要同时观察借款人和项目构成、资产价格、期限、币种、贷款人资本、经常账户与偿债能力。',
      '跨国事件研究发现不少繁荣平稳结束，也有一部分以危机收场；信用与资产价格联合加速时条件风险往往更高。但这是概率分布而非道德标签：高增长并非必然坏，低增长也可能隐藏存量脆弱或非银行迁移。政策因此面对“韧性保险”与压制有效融资之间的权衡。',
    ],
    sourceIds: [39, 40, 42],
    formula: { label: '条件风险', expression: 'Pr(crisisₜ₊ₕ | credit growth, asset prices, composition, funding, institutions) ≠ 1', note: '即使模型校准良好，输出也是条件概率；不能把阈值当确定性倒计时。' },
    boundary: '“好/坏”要由明确结果、期限和反事实定义，不能用事后危机标签回填所有繁荣期决策。',
  },
  {
    id: 'default-transition', number: 22, label: 'Default Transition',
    title: '违约是从缓冲耗尽到合同触发的状态转移，不是信用开始恶化的第一刻。',
    paragraphs: [
      '冲击通常先进入收入、利息、本金和可用流动性；借款人可动用现金、出售资产、延迟支出、寻求宽限或再融资。只有当支付义务、契约或法律定义被触发，统计上才出现逾期、非应计、重组或违约。不同数据库对事件定义和日期不同，必须把标签版本写进研究合同。',
      'PD是决策时点对未来声明期限的概率，不等于随后实现的违约率；后者还受政策支持、选择构成和删失影响。宽松期新发放风险上升，短期实现违约却下降完全可能。固定origination vintage并跟踪完整窗口，是把事前选择与事后结果连接起来的最低要求。',
      '总违约率还会被分母构成误导：高风险借款人提前退出、贷款被出售或新增低风险贷款扩大分母，都可让平均率下降。迁移矩阵、进入退出和暴露权重应共同报告。',
    ],
    sourceIds: [13, 31, 37, 44, 49],
    formula: { label: '事件概率', expression: 'PDₜ(h) = Pr(contract-defined default in (t,t+h] | information available at t)', note: 'h、违约定义、信息截点、模型版本与EAD权重必须冻结。' },
    boundary: '本canonical未观察PD迁移，只保存STOP；不得由合成资本损失反推真实违约过程。',
  },
  {
    id: 'loss-severity', number: 23, label: 'Loss Given Default',
    title: '违约余额不是损失：回收价值、优先级、抵押执行与处置拥挤共同决定LGD。',
    paragraphs: [
      '一笔贷款违约后，债权人仍可能通过抵押处置、担保、重组和破产分配回收资金。LGD等于未回收暴露相对违约时EAD的比例；它依赖抵押品在处置时而非繁荣期的可实现价值、法律优先级、执行成本、回收窗口和时间贴现。把defaulted EAD乘固定40%只能得到依赖该净LGD假设的损失估计；本页五年回收路径尚未观测，担保也只按假定可变现现金回收而非名义面额进入，所以这不是已经闭合的实现损失。',
      'LGD具有共同状态性。大量主体同时出售同类抵押品会压低回收价，法院与服务能力拥堵会延长处置，宏观衰退还使企业整体价值下降；因此PD与LGD往往在坏状态同时上升。法拍对附近房价和实体活动的反馈说明回收过程本身也能成为下一轮输入。',
      '危机数据库能提供系统事件、政策与成本标签，却不能把危机附近全部产出损失机械归因给银行损失。微观损失、会计拨备、监管资本扣减和财政成本是不同对象。',
    ],
    sourceIds: [15, 25, 27, 45, 49],
    formula: { label: '损失桥', expression: 'pre-default expected loss = PD × LGD × EAD; C5 synthetic loss estimate = defaulted EAD × assumed net economic LGD', note: 'C5的净LGD按合成路径纳入五年回收窗内、折现到违约日的净回收、假定可变现担保现金回收与处置成本；不使用担保面额、不再二次扣减，真正实现经济损失须等回收窗口闭合。' },
    boundary: '3.14追踪损失如何反馈资本；破产瀑布、网络回收和处置价格由7.13展开。',
  },
  {
    id: 'intermediary-capital-feedback', number: 24, label: 'Loss → Capital → Credit',
    title: '损失穿过薄资本层后，银行的边际资产容量与风险价格会非线性变化。',
    paragraphs: [
      '资本吸收信用损失。若其他条件冻结，资本10、最低资本率10%、贷款RWA density 80%支持125单位简化容量；估计计入前的净账面贷款为100。违约时EAD 10乘假设净经济LGD 40%得到4单位合成损失估计；在教学假设下，同一个估计只确认一次，同时把资本从10降至6、净账面贷款从100降至96，容量降至75，因此还需21单位简化收缩才能回到门槛。',
      '现实反馈更丰富：风险权重会在评级迁移时上升，融资方可能提高haircut或撤资，银行会抬价、收紧标准、保留流动性或出售资产。出售压低市场价格又侵蚀其他中介净值，Brunnermeier–Sannikov与He–Krishnamurthy解释了资本稀缺区为何更非线性；资金与市场流动性螺旋进一步连接保证金和价格冲击。',
      '但“容量75”不是监管裁决，也不是贷款必然落到75。合成估计的确认时点也不是会计判断：真实拨备、账面减记与监管资本处理各有标准。缓冲可被使用，资本可补充，资产可重组，风险密度会变化；本实验只隔离固定密度、单一比率下的一阶算术。',
    ],
    sourceIds: [19, 20, 21, 22, 25],
    formula: { label: '教学容量桥', expression: 'capacity = capital / (minimum capital ratio × fixed RWA density)', note: '只在冻结风险密度与单一约束下成立；不得替代Basel、监督或银行内部决策。' },
    boundary: '火售价格冲击、保证金与多节点传染路由7.11–7.13；本节不在未观测数据上估计它们。',
    after: <CapitalLossFeedbackLab />,
  },
  {
    id: 'crisis-without-panic', number: 25, label: 'Crisis Without a Run',
    title: '没有排队挤兑也可能发生严重银行危机：资产价值损失和慢性收缩可以替代戏剧化恐慌。',
    paragraphs: [
      '大众叙事常把危机等同于储户冲向柜台，但银行净值可以因长期信用损失、证券重估或房地产暴露持续恶化；市场融资和股权价值先反映问题，银行随后多年收缩风险资产，即使存款没有经典式瞬间逃离。Baron、Verner与Xiong的历史证据提醒我们，panic不是定义系统性银行困境的必要条件。',
      '反过来，银行股暴跌或一次流动性事件也不自动等于系统性危机。需要观察广泛资产质量、资本缺口、信用供给、政策干预和实体后果，并采用一致事件标签。模型中的离散恐慌可以放大已有脆弱性，却不是所有下行的唯一路径。',
    ],
    sourceIds: [22, 43, 45],
    formula: { label: '非等价', expression: 'systemic banking distress ⊄ depositor run; depositor run ⊄ automatically systemic crisis', note: '两者可重叠，但事件定义、覆盖范围和后果门必须分别检验。' },
    boundary: '危机事件标签来自独立数据库与制度判断，不能由本页合成状态自动生成。',
  },
  {
    id: 'real-activity', number: 26, label: 'Credit → Real Activity',
    title: '信用只有穿过融资缺口、支出边际和替代能力，才会改变投资、就业与总需求。',
    paragraphs: [
      '借款人若项目依赖外部融资，贷款额度下降或all-in cost上升会迫使其削减资本开支、库存、工资或消费；现金充裕、项目可延迟或能替代融资的主体反应较弱。高负债家庭的消费倾向、关系型中小企业的就业以及到期墙企业的投资，为不同支出边际提供了微观证据。',
      '聚合时会出现一般均衡：一个主体少支出是另一主体少收入，资产出售压价又收紧其他人的约束；但价格、政策和资源再配置也能缓冲。局部银行冲击的企业效应不能直接相加为全国损失，因为其他银行可扩张、劳动力可流动、货币财政政策会反应。',
      '因果链至少要记录处理、借款人总资源变化、真实结果、时间窗与支持总体。只发现信用和GDP共同下降，既可能是信用约束造成支出下降，也可能是需求预期先恶化同时减少借款和产出。',
    ],
    sourceIds: [23, 25, 32, 33, 34, 38],
    formula: { label: '实体传导', expression: 'credit-channel effect = treatment → borrower total financing/resources → pre-specified real outcome', note: '每一箭头都要有独立证据；贷款人pair效应不是最终实体estimand。' },
    boundary: '商业周期与金融周期的系统比较在3.22；本节只建立信用反馈到实体活动的接口。',
  },
  {
    id: 'distribution-heterogeneity', number: 27, label: 'Distribution & Composition',
    title: '总体平均可以在最受约束群体恶化时改善，因为谁还在借、谁占权重本身就在变化。',
    paragraphs: [
      '假设银行依赖小企业的紧张状态为+1，公开债券发行人为−0.5，两组内部都没变；权重从60/40变成30/70，总体由+0.4降至−0.05。看平均值会误判金融条件改善，真实变化只是受约束小企业在新发放或样本中的比重下降。这可来自退出、拒贷、贷款出售或大企业替代融资。',
      '研究应报告固定权重反事实、组内变化和composition effect，并补充分位数、binding share和尾部暴露。贷款申请级设计有助于看见被拒者；只分析实际借款人会产生选择偏差。总体信用/GDP也可能因大企业债券扩张掩盖小企业银行信用收缩。',
      '异质性不是在总结果后附几张分组图，而是机制本身：净值、抵押、期限、关系银行、币种和收入弹性决定同一条件变化先打到谁，受打击者的反应又改变下一期总体权重。',
    ],
    sourceIds: [26, 30, 31, 33],
    formula: { label: '两项分解', expression: 'ΔΣg w_g x_g = Σg w⁰_g·Δx_g + Σg Δw_g·x¹_g', note: '第一项是固定初始权重的组内效应，第二项是构成效应；两者之和应与总体变化闭合。' },
    boundary: 'canonical只含两组合成示例，未观察真实借款人或贷款人尾部；missing不能写成零。',
    after: <DistributionCompositionLab />,
  },
  {
    id: 'global-dollar-credit', number: 28, label: 'Global Dollar Credit',
    title: '全球美元融资把本地信用周期接到跨境银行杠杆、汇率与国际债券市场，但三者不是同一个因子。',
    paragraphs: [
      '企业和非银行可以从本国银行、外国银行与国际债券市场获得美元信用。全球银行融资条件改善时，跨境贷款与当地资产需求可能扩张；美元走强、美元融资收紧或母行资本受损时，未对冲借款人的本币债务负担上升，银行与债券渠道又可能同步回撤。Bruno–Shin与Avdjiev等提供了这条银行杠杆—美元—投资机制的经验基础。',
      '口径必须分清：债权人母国与所在地、借款人居民地、币种、银行贷款与债券、跨境与本地美元头寸，以及自然或金融对冲。净敞口若按现金流测量，债务服务、对冲结算、经营流入与可动用资产流入必须先对齐horizon、结算币种和共同估值日；衍生品名义额、收入水平和资产存量不能直接相减。本canonical未收集这些现金流腿，因此状态保持not-computed。BIS全球流动性指标覆盖特定外币信用，并不代表一国全部国内信用；VIX、美元指数或美国政策冲击也不能互相替代。',
      '识别全球冲击需要独立的政策或融资来源、预定暴露和本地反事实。美国政策会影响全球周期，却不是唯一来源；本地监管、汇率制度、外汇储备和银行资本决定传导强度。',
    ],
    sourceIds: [3, 34, 46, 47, 48],
    formula: { label: '币种现金流暴露合同', expression: 'net FX cash-flow exposureₜ,ₕ,꜀ = PVₜ꜀(foreign-currency debt-service outflowsₕ) − PVₜ꜀(eligible hedge inflowsₕ) − PVₜ꜀(matched operating inflowsₕ) − PVₜ꜀(legally available asset cash inflowsₕ)', note: '每条腿必须属于同一horizon、结算币种、估值日与折现口径；对冲名义额、收入水平或资产存量不能直接相减。' },
    boundary: '3.14只保存跨境接口；全球共同因子的测量与识别归4.07，汇率决定归3.20。',
  },
  {
    id: 'early-warning', number: 29, label: 'Early Warning',
    title: '早期预警是在固定标签、期限、vintage与损失函数下排序条件风险，不是宣告危机必然发生。',
    paragraphs: [
      '长期历史研究显示，信用扩张、资产价格上行、低信用利差和外部失衡的某些组合包含未来银行危机信息。多指标通常优于把一个gap神化为开关，因为周期脆弱性同时位于数量、价格、构成和偿债层。但预测变量可以内生反映共同冲击，能预测不等于造成。',
      '正式系统必须先冻结危机标签、预测horizon、每期信息截止、数据vintage、变换、阈值、训练窗和误报/漏报成本；再按时间顺序训练和评估，保留校准、PR/ROC、基准和子样本稳定性。今天完整修订后的gap回看历史，不是实时OOS证据。',
      '本页C7的1.233只是SYNTHETIC规则分数。它不是概率，predictionStatus仍为not-estimated；三道因果门失败时，causalStatus仍为not-identified。即使分数方向符合文献，也不得用“机制合理”替代验证。',
    ],
    sourceIds: [7, 8, 9, 10, 37, 41, 42, 44, 45],
    formula: { label: '预警合同', expression: 'scoreₜ = f(Xₜ|vintageₜ); evaluate yₜ₊ₕ only after freezing label, horizon, threshold and loss', note: '分数、校准概率、政策阈值和因果效应是四个对象。' },
    boundary: '本节说明研究合同；真正的模型选择、PIT管线、OOS检验和决策损失函数由Chapter 7实施。',
  },
  {
    id: 'identification-gate', number: 30, label: 'Identification Gate',
    title: '描述状态、预测事件和识别冲击必须永久分栏；任何漂亮分数都不能绕过反事实。',
    paragraphs: [
      'Measurement问“对象是否按一致口径被测到”，prediction问“当时可得信息能否改善未来标签预测”，causality问“若处理改变而其他路径按设计保持，结果会怎样”。一条BIS序列可以是高质量测量；一个历史相关模型可以有预测力；二者都不自动给出信用供给的结构效应。',
      '信用供给识别至少需要三道门：冲击来源相对需求外生，借款人或贷款人的处理暴露在冲击前预定，并有可信需求反事实。多银行关系、申请级比较与匹配银行—企业数据可帮助通过这些门；仍要声明support population、聚类层级、替代渠道、并行趋势或安慰剂。',
      '即使三门全过，本页也只授予identified-candidate：还需检查处理定义、排除限制、干扰、样本选择和推断。相反，一项研究可能预测良好却没有因果身份；这不是失败，而是对用途诚实。',
    ],
    sourceIds: [29, 30, 32, 37, 42, 45],
    formula: { label: '三轴证据', expression: 'evidence = (measurement status, prediction status, causal status), never one quality badge', note: '每个target单独保存estimate、uncertainty、sample、clock与vintage；null优于省略。' },
    boundary: 'canonical当前为机械审计通过、预测未估计、因果未识别；官方三联图也不改变后两项。',
    after: <WarningCausalGateLab />,
  },
  {
    id: 'loop-closure', number: 31, label: 'Closing the Loop',
    title: '信用周期真正闭合在“下一期条件”上：今天的融资结果改变明天谁还能融资、以什么价格融资。',
    paragraphs: [
      '扩张链从较宽融资菜单开始，经申请、发放和资产需求累积为信用存量、杠杆与价格上涨；净值和中介利润改善后，标准和风险价格可能继续放松。收缩链则由收入、利率、到期或价格冲击触发，先挤压偿债和抵押空间，再进入违约、LGD、资本与流动性；银行收紧和火售把冲击送回下一期条件。',
      '反馈不是封闭机械系统。政策利率、财政转移、资本注入、担保、监管缓冲、破产规则、住房供给和全球美元融资都能从外部改变某一箭头；主体预期还会提前反应。世界模型因此要允许多入口和状态依赖，却仍用局部可验证链条研究每个箭头。',
      '最终生产对象不是“现在处于扩张第几阶段”，而是一份可审计状态：范围、时钟、单位、上游lineage、存量—流量对账、融资菜单、分布、损失与资本、证据身份和下一章路由。只要任一关键字段缺失，就输出partial或STOP，而不是用叙事补齐。',
    ],
    sourceIds: [4, 15, 18, 19, 21, 44],
    formula: { label: '完整闭环', expression: 'conditionsₜ → menuₜ → flowsₜ → stocks/leverageₜ → net worth & asset pricesₜ₊₁ → debt service/default/lossₜ₊₁ → intermediary capacity/liquidityₜ₊₁ → conditionsₜ₊₁', note: '每个箭头都有主体、合同、分布与时钟条件；外生政策和全球冲击可以在任一节点进入。' },
    boundary: '3.14交付可路由状态而非交易信号；3.15、3.16、4.07与Chapter 7分别扩展脆弱性、住房、全球与研究实施。',
  },
];

const checks = [
  { question: '为什么“信用周期”不能先被定义成固定的繁荣—衰退四阶段时钟？', answer: '阶段只是对多维状态的分类。真正机制是融资菜单、流量、存量、净值、偿债、损失与中介约束之间的状态依赖反馈；制度、政策和冲击可改变顺序与持续时间。', sourceIds: [4, 5, 6] },
  { question: '期初信用100、发放20、偿还8，为何期末不一定是112？', answer: '还要处理核销、重估、汇率和重分类。本页再扣核销3、加其他变化1，期末110；发放20、净交易流12和存量变化10是三个不同对象。', sourceIds: [1, 14] },
  { question: '危机初期贷款余额上升，能否证明银行扩大了新信用供给？', answer: '不能。企业可能提取既有承诺额度，新批准和新发放同时下降；还要并列申请、批准、承诺、提款、偿还、核销和余额。', sourceIds: [14, 35] },
  { question: '债务没变，杠杆为什么仍可能上升？', answer: '资产价格下跌会降低资产和权益分母，D/A与D/E被动上升；D/I若收入不变则可不变。一般权益=资产−总负债；只有其他负债明确为0时，才可写成资产−债务。', sourceIds: [14, 15, 18] },
  { question: 'Credit-to-GDP gap为负，最窄的结论是什么？', answer: '在指定当前vintage和滤波方法下，信用/GDP比率低于估计的单边长期趋势；不能据此说信用供给宽松、系统安全或危机概率为负。', sourceIds: [2, 8, 9] },
  { question: '信用和房价同涨为何仍不足以证明抵押反馈？', answer: '两者可被收入、人口、监管或全球融资共同驱动。要识别双向反馈，还需合同抵押暴露、时序、外生变化和可信反事实。', sourceIds: [4, 5, 18] },
  { question: 'DSR与债务/收入有什么根本差异？', answer: 'DSR的分子包含声明窗口内利息与只计一次的到期本金，因而还依赖利率、剩余期限和重定价；债务/收入只比较存量与收入流。', sourceIds: [11, 12, 13] },
  { question: '相同债务存量的两家公司，为何到期墙风险不同？', answer: '互斥分桶后的气球本金与计划摊还、浮固结构、同窗现金流与承诺额度决定坏时点需要再融资多少；同一本金不得重复入账。', sourceIds: [13, 28] },
  { question: '总贷款下降为何不能单独识别信用供给收紧？', answer: '贷款是供给菜单与借款需求共同决定的均衡结果，借款人退出也会改变样本。需要预定的贷款人暴露、共同需求反事实和细粒度双边或申请数据。', sourceIds: [29, 30, 36] },
  { question: '为什么3.14不能只接收3.13的FCI标量？', answer: '相同标量可来自不同价格、数量与条款组合，传导主体和时钟不同；必须保留完整lane、权重、贡献、coverage、composition和分布。', sourceIds: [4, 24] },
  { question: '事后违约率下降能否否定繁荣期承保风险上升？', answer: '不能。借款人环境改善可降低同一固定窗口的实现违约，样本构成与删失也会改变平均率；要冻结发放vintage、决策时PD和后续窗口。', sourceIds: [31, 37] },
  { question: '为什么抵押品市值120不等于可新增借款120？', answer: '市值要经过所有权和可执行性、eligible share、advance rate、优先权与集中度，再扣已提款；所得headroom属于特定合同与时点。', sourceIds: [18, 26] },
  { question: 'C5的4单位合成损失估计为何可能对应大于4的贷款容量下降？', answer: 'C5以计入前净账面贷款100为基准，用违约时EAD乘假设净LGD；同一估计在教学假设下只确认一次，同时把资本降至6、净账面贷款降至96。固定最低比率与RWA density下容量为75，所以还需收缩21；它不是实现损失、会计处理或监管裁决。', sourceIds: [19, 20, 49] },
  { question: '没有储户挤兑，是否就没有银行危机？', answer: '不是。长期资产损失、资本缺口、市场融资恶化和慢性信用收缩可形成严重危机；panic既非必要条件，也不能单独充分判定系统性事件。', sourceIds: [22, 43, 45] },
  { question: '总体紧张指标下降，为何小企业仍可能更难融资？', answer: '样本或暴露权重可能从受约束小企业转向债券发行人，产生纯构成效应。要报告固定权重组内变化、composition和尾部，而非只报平均。', sourceIds: [30, 31, 33] },
  { question: '一个信用预警分数超过阈值后，最强可以说什么？', answer: '若规则和输入事前冻结，只能说该规则触发；没有时间外估计就不是校准概率，没有识别设计就不是结构冲击。', sourceIds: [9, 37, 42] },
  { question: '信用供给因果识别的三道最低门是什么？', answer: '相对需求外生的冲击来源、冲击前预定暴露、以及可信的需求反事实；通过后仍需支持集、干扰、推断与安慰剂检查。', sourceIds: [29, 30, 32] },
  { question: '怎样判断信用周期的闭环真正完成？', answer: '链条必须从本期条件经菜单、流量、存量和资产负债表进入偿债、损失与中介容量，并明确回到下一期条件；同时保存主体、合同、分布、时钟与证据身份。', sourceIds: [4, 18, 19, 21] },
] as const;

const glossary = [
  ['Credit stock', '声明期末仍未偿的信用头寸', '本期新发放', '§03'],
  ['Gross origination', '窗口内新形成并满足发放定义的信用总流量', '存量增加', '§03'],
  ['Principal repayment', '偿还未偿本金的交易流', '利息支付', '§03'],
  ['Charge-off', '贷款人从账面冲销难以回收的金额', '经济损失最初发生时点', '§03'],
  ['Revaluation', '价格或汇率变化引起的头寸价值变动', '交易流', '§03'],
  ['Reclassification', '覆盖或工具类别改变造成的统计移动', '新增融资', '§03'],
  ['Reconciliation residual', '期末声明值与存量—流量计算值之差', '可任意吸收的其他项', '§03'],
  ['Credit growth', '同口径信用存量在声明窗口内的比例变化', '信用供给冲击', '§04'],
  ['Credit-to-GDP ratio', '信用存量相对GDP流量尺度的比率', '杠杆的唯一度量', '§04'],
  ['Leverage', '债务或资产相对某个损失吸收或收入分母的比率', '不带分母的统一变量', '§05'],
  ['D/A', '债务除以资产价值', 'D/E或D/I', '§05'],
  ['D/E', '债务除以权益；权益先由资产减全部负债得到，权益非正时需特殊报告', '债务除以资产减债务在所有主体上都成立', '§05'],
  ['D/I', '债务存量除以声明窗口收入', '当期偿债率', '§05'],
  ['Credit gap', '信用/GDP比率减估计单边趋势', '均衡缺口或危机概率', '§06'],
  ['One-sided trend', '只用当时及以前观测估计的趋势', '不修订的结构均衡', '§06'],
  ['Endpoint problem', '样本末端趋势随新数据显著变化的问题', '普通测量噪声可忽略项', '§06'],
  ['Financial cycle', '信用、资产价格、净值与约束等中期反馈的联合状态', '单一信用指标', '§07'],
  ['Lead–lag', '两个变量转折或变化的时间先后关系', '因果方向', '§07'],
  ['Origination vintage', '同一发放窗口形成并共同跟踪的贷款批次', '数据修订版本', '§08'],
  ['Data vintage', '某个信息截止时可用的数据和参数版本', 'origination cohort', '§08'],
  ['Financing menu', '价格、额度、期限、抵押、契约和资格的选择集合', '一条利率', '§09'],
  ['All-in cost', '基准、利差、费用及声明调整后的综合融资价格', '政策利率', '§09'],
  ['Credit demand', '给定菜单与项目状态下借款人愿申请和接受的融资', '观察到的贷款数量', '§10'],
  ['Credit supply', '贷款人在资金、约束与风险选择下提供的融资菜单', '实际成交余额', '§10'],
  ['Pair estimand', '特定贷款人—借款人配对上的处理效应对象', '借款人总融资效应', '§10'],
  ['Binding constraint', '映射到共同单位后最先限制边际融资的约束', '最接近监管阈值的原始比率', '§11'],
  ['RWA density', '风险加权资产相对资产或贷款的密度', '固定不变的自然参数', '§11'],
  ['Underwriting', '对申请人、价格和条款的决策过程', '事后违约率', '§12'],
  ['Selection effect', '进入批准、发放或样本的人群构成变化', '同一人群状态变化', '§12'],
  ['Net worth', '声明估值基础上的资产减负债', '现金余额', '§13'],
  ['External finance premium', '外部融资相对匹配内部或无摩擦基准的楔子', '全部信用利差', '§15'],
  ['Financial accelerator', '净值变化经融资楔子放大实体冲击的机制', '金融变量与GDP的任何相关性', '§15'],
  ['Eligible share', '按合同规则可计入抵押基数的价值比例', '资产所有权比例', '§14'],
  ['Advance rate', '对合格抵押价值允许形成借款基数的比例', '市场LTV的普适值', '§14'],
  ['Borrowing base', '合格价值经advance、上限和优先权调整后的担保容量', '资产市场价值', '§14'],
  ['Headroom', '借款基数扣除已占用额度后的剩余空间', '必然会被批准的新增贷款', '§14'],
  ['Channel substitution', '原融资渠道收缩后转向其他资金来源', '金额恢复即风险完全恢复', '§16'],
  ['Cash-buffer drawdown', '声明窗口内对期初现金缓冲的实际动用流量', '现金余额或已计入的经营现金流', '§16'],
  ['Committed line', '符合合同条件时可提款的承诺额度', '已发放或未偿债务', '§17'],
  ['Maturity wall', '相近窗口内集中到期或重定价的债务暴露；本金须互斥分桶', '总债务存量', '§18'],
  ['Balloon principal', '到期日一次性偿还且不再计入其他计划摊还的本金', '与计划摊还重复相加的第二份本金', '§18'],
  ['Refinancing gap', '互斥归集的到期本金扣同窗、非重叠可用资源后的缺口', '未来一年总到期额', '§18'],
  ['Debt-service ratio', '同一明确支付窗内，利息与只计一次的到期本金占声明收入的比例', '债务/收入或不带起止日的年度标签', '§19'],
  ['PD', '在决策时信息下、声明期限内发生定义违约的概率', '实现违约率', '§22'],
  ['LGD', '声明回收窗与贴现口径下未回收暴露占违约时EAD的比例；C5使用未观测的合成假设', '抵押haircut、担保面额或已实现损失金额', '§23'],
  ['EAD', '违约发生时的暴露金额概念', '当前账面余额在所有产品上的固定替身', '§23'],
  ['Funding liquidity', '主体获得资金并满足支付或头寸需求的能力', '市场流动性', '§24'],
  ['Market liquidity', '以有限价格冲击交易资产的能力', '银行信用供给', '§24'],
  ['Fire sale', '受约束出售与有限承接能力共同造成的压价过程', '所有价格下跌', '§24'],
  ['Composition effect', '组别状态固定时仅由权重变化造成的总体变化', '组内传导', '§27'],
  ['Net FX cash-flow exposure', '同一horizon、结算币种与估值日下外币债务服务流出减合格对冲及匹配现金流入的现值', '外币债务名义额减收入或资产存量', '§28'],
  ['Early-warning score', '按冻结规则汇总预测变量的排序或触发量', '危机概率或因果冲击', '§29'],
  ['Support population', '研究设计有共同支持、可被估计覆盖的主体集合', '全体经济', '§30'],
  ['Identified candidate', '最低识别门初步通过、仍待推断与稳健性验证的状态', '已经证实的结构因果', '§30'],
] as const;

const contractInvariants = [
  '范围护照必须同时声明借款人、债权人、工具、法域、合并基础、币种与观察时点；“总信用”不允许无主体口径。',
  '申请、批准、承诺、发放、提款、期末余额、重定价、到期、违约、回收、核销、发布与修订时钟分别保存；存量—流量窗、DSR支付窗与损失回收窗不得互相冒充。',
  '期末存量金额与窗口累计流量分栏；金额、比率、百分点、年化利率和流量窗口不得相加；外币现金流还须同horizon、同结算币种和共同估值日，官方三序列始终保留原生单位。',
  '3.10–3.13 producer只读继承，lineage为36条sourcePath→targetPath显式映射并比较原始值或对象身份；3.12的legacy draft producer标记原样保留，源缺失、目标缺失、未接线源与等值克隆都必须失败。',
  '3.13输入必须保留六维lane、权重、贡献、分布和八项coverage/composition字段；scalar永远不是唯一输入。',
  '期末信用必须与期初、交易、核销、重估、汇率和重分类闭合；残差不为零则STOP。',
  'Gross origination、net transaction flow、stock change与stock growth分栏，任何一项不得替代其他三项。',
  '每个杠杆都保存分母、估值基准与时间窗；权益由资产减全部登记负债得到，权益非正时不输出伪正常D/E。',
  'DSR必须保存前瞻支付窗的起止日，把利息、互斥分桶且只计一次的到期本金、收入、浮固比例与重定价份额对齐；期初债务计全窗利息和本金窗末支付只能作为显式教学近似。',
  '观察到的信用数量不自动识别供给；pair、总融资与实体结果使用独立estimand，可用资源桥只接收同窗、同反事实且非重叠的融资与现金流。',
  '总体均值必须能拆为固定权重组内变化与composition effect，并保留尾部缺失状态。',
  '官方BIS数据只进入orientation和动态护照，mayEnterCanonicalCalculation永远为false。',
  'Measurement、prediction和causal状态独立；一个轴通过不能升级另外两个轴。',
  '违约时EAD乘假设净经济LGD只能命名合成损失估计；回收窗、贴现日、假定可变现担保现金回收与处置成本处理必须冻结且不得二次扣减，同一估计对资本与计入前净账面贷款只确认一次，不冒充实现损失、会计处理或监管裁决。',
  '每个下游路由都携带payload与guardrail；未观察、不可适用、机密和结构断点使用null、显式flag、partial或STOP，未收集的外币现金流腿使净FX暴露保持not-computed，机制边界不能靠章节标题暗示。',
] as const;

const dynamicRefreshChecklist = canonicalCreditCycleStateExample.dynamicDataPassports.map((passport) => ({
  source: `${passport.dataflowVersion} · ${passport.seriesKey}`,
  sourceUrl: passport.sourceUrl,
  refresh: `全序列${passport.observationCount}期，本页冻结${passport.selectedObservationCount}期；当前观测截至${passport.observationEnd}，取数${passport.retrievedAt}，门户最近发布${passport.portalDeclaredLastRelease}、下一计划发布${passport.portalDeclaredNextScheduledRelease}；刷新时重算raw/normalized SHA-256并保存latest-vintage警告。`,
  use: passport.sourceId === 'BIS_US_TOTAL_CREDIT_TO_GDP' ? '总信用存量相对GDP的真实口径定向，不解释为新发放。' : passport.sourceId === 'BIS_US_CREDIT_TO_GDP_GAP' ? '比率相对单边趋势的百分点偏离，不解释为概率或PIT回测。' : '聚合偿债负担估计，不替代微观合同现金流。',
  sourceIds: passport.sourceReferenceIds,
}));

const interfaces = [
  { name: '3.10 Bank Lending', payload: '资金成本、约束容量、binding IDs、合同、要约、审批、配置、替代与时钟。', guardrail: '银行pair效应不自动等于借款人总融资；capacity也不等于appetite。' },
  { name: '3.11 Borrower / Collateral', payload: '净值对账、现金流、抵押池、债务合同、约束栈、融资菜单与真实支出。', guardrail: '市场价值不直接等于borrowing base，净值也不等于现金。' },
  { name: '3.12 Risk-Taking', payload: '风险容量、感知、治理、承保、组合、漏斗和origination vintage。', guardrail: '承保构成与实现违约分开；合成λ不是观测到的总体风险偏好。' },
  { name: '3.13 Financial Conditions', payload: '完整lane vector、主体映射、权重、贡献、coverage、composition、分布与证据轴。', guardrail: '禁止只传FCI scalar；状态不是外生shock。' },
  { name: '3.15 Debt / Leverage Cycle', payload: '债务存量、杠杆分母、到期与偿债时钟、分布尾部。', guardrail: '3.14闭合反馈，3.15才展开债务积压、杠杆目标与去杠杆路径。' },
  { name: '3.16 Housing', payload: '住房价格、按揭合同、借款人和抵押品状态。', guardrail: '住房供给、追索权和法拍制度不得压成通用advance rate。' },
  { name: '4.07 Global Financial Cycle', payload: '居民地、母国、结算币种、同horizon债务服务/对冲/经营/资产现金流腿与本地政策状态。', guardrail: '美元、VIX、美国政策和全球银行杠杆不是同一变量；名义对冲额、收入或资产存量不得直接构成净FX现金流暴露。' },
  { name: '7.11–7.13 / 7.24–7.26', payload: '保证金、火售、网络瀑布，以及标签、vintage、OOS、因果与审计合同。', guardrail: '本节路由未估计的系统反馈，也不把预警分数升级为交易信号。' },
] as const;

const evidenceGroups = [
  { title: '统计对象、周期测量与政策参考', text: '总信用、gap、DSR、存量—流量、金融周期定义、转折方法、实时端点和缓冲政策语义。', ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] },
  { title: '借款人、抵押与中介放大机制', text: '债务通缩、净值、金融加速器、抵押约束、中介资本、流动性螺旋、恐慌与去杠杆。', ids: [15, 16, 17, 18, 19, 20, 21, 22, 23, 24] },
  { title: '损失、匹配数据与供需识别', text: '中介破坏、住房净值与法拍、到期墙、多银行与申请设计、风险选择、投资就业、危机贷款动态与监管风险组件定义。', ids: [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 49] },
  { title: '长期繁荣、衰退与危机标签', text: '长历史信用繁荣、衰退强度、事件研究、政策权衡、多指标预警、无恐慌危机、危机顺序与系统标签。', ids: [37, 38, 39, 40, 41, 42, 43, 44, 45] },
  { title: '全球政策、跨境银行与美元', text: '被识别的美国政策、全球银行杠杆、美元信用与投资的跨境传导。', ids: [46, 47, 48] },
] as const;

const creditCycleDirectCitationRegistry = {
  thesis: [1, 4, 5, 14, 18, 19, 44],
  officialIntroduction: [1, 2, 8, 9, 11, 12, 14],
  transmissionChart: creditCycleTransmissionSourceIds,
  mechanismLabs: creditCycleMechanismLabSourceIds,
} as const;

const allReferenceIds = new Set<number>(lesson314References.map(({ id }) => id));
const conceptIds = new Set(conceptSections.map(({ id }) => id));
const scenarioAnchorIds = new Set(['official-data', ...conceptIds]);
const pageSectionIds = ['thesis', 'official-data', ...conceptSections.map(({ id }) => id), 'interactive-lab', 'credit-cycle-static-twins', 'checks-glossary', 'interfaces-reading'];
const allRenderedSourceIds = new Set<number>([
  ...Object.values(creditCycleDirectCitationRegistry).flat(),
  ...conceptSections.flatMap(({ sourceIds }) => sourceIds),
  ...checks.flatMap(({ sourceIds }) => sourceIds),
  ...creditCycleScenarios.flatMap(({ sourceIds, staticTwin }) => [...sourceIds, ...staticTwin.sourceIds]),
  ...dynamicRefreshChecklist.flatMap(({ sourceIds }) => sourceIds),
  ...evidenceGroups.flatMap(({ ids }) => ids),
]);
const evidenceMapSourceIds = new Set<number>(evidenceGroups.flatMap(({ ids }) => ids));
const labSectionIds = conceptSections.filter(({ after }) => Boolean(after)).map(({ id }) => id);
const citationIdsResolve = (ids: Iterable<number>) => [...ids].every((id) => allReferenceIds.has(id));

const lesson314IntegrityAudit = [
  { key: '30 concepts numbered 02–31', passed: conceptSections.length === 30 && conceptSections.every(({ number }, index) => number === index + 2) },
  { key: '24 core plus 6 optional mechanisms', passed: lesson314CorePathSectionIds.size === 24 && conceptSections.filter(({ id }) => !lesson314CorePathSectionIds.has(id)).length === 6 },
  { key: 'all page section IDs are globally unique', passed: new Set(pageSectionIds).size === pageSectionIds.length },
  { key: 'every concept has two-plus substantive paragraphs, sources and boundary', passed: conceptSections.every(({ paragraphs, sourceIds, boundary }) => paragraphs.length >= 2 && paragraphs.every((paragraph) => paragraph.length >= 60) && paragraphs.reduce((total, paragraph) => total + paragraph.length, 0) >= 200 && sourceIds.length > 0 && Boolean(boundary)) },
  { key: 'seven mechanism labs appear at registered concepts', passed: labSectionIds.join('|') === ['stock-flow-accounting', 'leverage-ratio', 'collateral-borrowing-base', 'debt-service-ratio', 'intermediary-capital-feedback', 'distribution-heterogeneity', 'identification-gate'].join('|') },
  { key: 'all rendered local citations resolve and an injected bad ID is rejected', passed: citationIdsResolve(allRenderedSourceIds) && !citationIdsResolve([...allRenderedSourceIds, 999]) },
  { key: '49 references continuous', passed: lesson314References.length === 49 && lesson314References.every(({ id }, index) => id === index + 1) },
  { key: 'every reference states support and non-support boundaries', passed: lesson314References.every(({ use }) => use.includes('支持') && use.includes('不支持')) },
  { key: 'all references use HTTPS and evidence map coverage is bidirectional', passed: lesson314References.every(({ id, url }) => url.startsWith('https://') && evidenceMapSourceIds.has(id)) && [...evidenceMapSourceIds].every((id) => allReferenceIds.has(id)) },
  { key: 'all M and K anchors resolve including official-data', passed: creditCycleScenarios.every(({ primarySectionId, remediationSectionIds }) => scenarioAnchorIds.has(primarySectionId) && remediationSectionIds.every((id) => scenarioAnchorIds.has(id))) },
  { key: 'scenario structure and numeric assertions pass', passed: creditCycleScenarioAssertions.every(({ passed }) => passed) && creditCycleNumericAssertionAudit.every(({ passed }) => passed) },
  { key: '18 checks and 40-plus glossary entries', passed: checks.length === 18 && glossary.length >= 40 },
  { key: '15 producer invariants and 8 interfaces', passed: contractInvariants.length === 15 && interfaces.length === 8 },
  { key: '10 guided readings include auxiliary links', passed: lesson314ReadingList.length === 10 && lesson314ReadingList.every(({ url, links }) => url.startsWith('https://') && Boolean(links?.length) && links?.every(({ label, url: linkUrl }) => label.length > 0 && linkUrl.startsWith('https://'))) },
  { key: 'official snapshot has 28 rows and recomputes to its frozen combined hash', passed: bisCreditCycleSelectedObservations.length === 28 && bisCreditCycleRecomputedCombinedNormalizedSha256 === bisCreditCycleCombinedNormalizedSha256 },
  { key: 'canonical 29-key and fixture gates pass', passed: canonicalCreditCycleStateFields.length === 29 && canonicalStateAudit.every(({ passed }) => passed) && creditCycleFixtureAudit.every(({ passed }) => passed) },
] as const;

if (!lesson314IntegrityAudit.every(({ passed }) => passed)) {
  throw new Error(`3.14 lesson integrity gate failed: ${lesson314IntegrityAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}

function Lesson314Content() {
  return <>
    <section className="lesson-section lesson-opening" id="thesis">
      <p className="section-kicker">00 · CORE THESIS</p>
      <h2>信用周期不是“贷款先多后少”的曲线，而是今天的融资结果改变明天资产负债表、损失与融资条件的闭环。</h2>
      <p>本节从3.13的金融条件向量出发，但不把它当作外生开关。基准利率、利差、资产价格、汇率、银行可得性和市场流动性先穿过主体与合同，改写边际融资菜单；申请、批准、发放、提款、偿还和核销随后形成不同流量，并累积为信用存量、杠杆与资产价格。新的净值、偿债负担、违约、LGD、银行资本和流动性又会反过来改变下一期融资价格与数量。</p>
      <div className="impact-facts" role="group" aria-label="3.14核心学习承诺"><article><span>先对账</span><b>stock + flow + clocks</b><p>发放、净流、余额、核销和修订各自保留身份。</p></article><article><span>再解释</span><b>agents + contracts + constraints</b><p>价格和数量必须穿过借款人与中介资产负债表。</p></article><article><span>最后主张</span><b>measurement / prediction / causality</b><p>描述、预警与冲击识别永久分栏。</p></article></div>
      <div className="equation-card"><span>全章闭环</span><div><code>conditionsₜ → financing menuₜ → credit flowsₜ → stocks / leverageₜ → net worth / debt service / lossesₜ₊₁ → intermediary capacityₜ₊₁ → conditionsₜ₊₁</code></div><p>每个箭头都由主体、合同、分布和时钟调节；政策、全球融资和制度可以在任一节点进入。</p></div>
      <p>完成本节后，你应能从任何一张“信用周期图”反向追问它测的是存量、流量、比率、趋势偏离还是偿债负担；能手算七个机制桥；能解释为何总贷款变化不能分离供需、为何被动杠杆和构成效应会误导平均值；并能把真实BIS数据、合成教学参数、预测分数与因果证据放回各自边界。</p>
      <p className="section-sources"><b>核心依据：</b> <Cites ns={creditCycleDirectCitationRegistry.thesis} /></p>
    </section>

    <section className="lesson-section" id="official-data">
      <p className="section-kicker">01 · SCOPE, ROUTE & OFFICIAL DATA ORIENTATION</p>
      <h2>先用三条真实BIS序列看见对象与单位，再用合成实验拆开不可直接观测的反馈。</h2>
      <div className="term-grid entry-vocabulary" aria-label="3.14核心路径十词导航" role="group">{entryVocabulary.map(([term, definition]) => <article className="term-card" key={term}><span>首次出现前先解码</span><h3>{term}</h3><p>{definition}</p></article>)}</div>
      <CreditCycleTransmissionChart />
      <div className="case-grid"><article className="case-card"><span>Master prerequisite</span><h3>3.09–3.13</h3><p>中介约束、银行贷款、借款人抵押、风险选择和金融条件共同提供冻结输入。</p></article><article className="case-card"><span>CORE PATH</span><h3>24个机制单元</h3><p>建立账本、分母、合同、供需、损失、资本、实体与识别闭环。</p></article><article className="case-card"><span>OPTIONAL</span><h3>6个深挖单元</h3><p>联合周期、繁荣异质性、无恐慌危机、分布、全球美元与早期预警。</p></article><article className="case-card"><span>Evidence boundary</span><h3>real orientation ≠ synthetic state</h3><p>BIS三联图不进入合成canonical计算；题目和实验逐项标记SYNTHETIC。</p></article></div>
      <div className="precision-note"><span>三面板不能相加</span><p>总信用/GDP是存量比率，credit gap是该比率相对估计趋势的百分点偏离，DSR是估算偿债支出占收入。页面保留各自原生单位、28行选点、SDMX序列键、取数日和哈希；它们提供真实尺度，却不构成“美国信用周期指数”、历史PIT回测或因果结论。</p></div>
      <p className="section-sources"><b>本节依据：</b> <Cites ns={creditCycleDirectCitationRegistry.officialIntroduction} /></p>
    </section>

    {conceptSections.map((section) => <CreditCycleConceptSection key={section.id} section={section} />)}

    <section className="lesson-section" id="interactive-lab">
      <p className="section-kicker">32 · INTERACTIVE M1–M10</p>
      <h2>把“周期正在扩张或收缩”拆成可复算判断：先守账本、分母、合同、vintage与证据身份。</h2>
      <CreditCycleLab />
    </section>

    <section className="lesson-section" id="checks-glossary">
      <p className="section-kicker">34 · CHECKS, CONTRACT AUDIT & GLOSSARY</p>
      <h2>能重建反例、解释STOP并通过合同门，才算掌握信用反馈而不是记住阶段名称。</h2>
      <div className="check-grid" role="group" aria-label="3.14理解检查">{checks.map((check, index) => <div key={check.question}><details><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={check.sourceIds} /></p></details><p className="print-only check-print-answer"><b>{String(index + 1).padStart(2, '0')} · 答案：</b>{check.answer} <Cites ns={check.sourceIds} /></p></div>)}</div>
      <div className="yield-fixture-audit" role="group" aria-label="3.14 canonical与fixture断言"><span>Canonical {canonicalStateAudit.filter(({ passed }) => passed).length}/{canonicalStateAudit.length} · Fixture {creditCycleFixtureAudit.filter(({ passed }) => passed).length}/{creditCycleFixtureAudit.length}</span><ul>{canonicalStateAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{creditCycleFixtureAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="yield-fixture-audit" role="group" aria-label="3.14正文、引用与题库完整性审计"><span>{lesson314IntegrityAudit.filter(({ passed }) => passed).length}/{lesson314IntegrityAudit.length} 项正文、来源、题库与契约门通过</span><ul>{lesson314IntegrityAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="3.14术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>

    <section className="lesson-section" id="interfaces-reading">
      <p className="section-kicker">35 · CANONICAL STATE, EVIDENCE, INTERFACES & READING</p>
      <h2>最终交付不是一个阶段标签，而是一份可对账、可失败、可刷新并能把下一轮输入路由出去的状态合同。</h2>
      <div className="precision-note" data-key-coverage={canonicalStateAudit.every(({ passed }) => passed) ? 'complete' : 'incomplete'}>
        <span>3.14 canonical state · {canonicalCreditCycleStateFields.length}个顶层键 · compile/runtime闭合</span>
        <p><code>{canonicalCreditCycleStateFields.join(', ')}</code>。稳定schema为<code>{canonicalCreditCycleStateExample.schemaVersion}</code>，直接继承3.10的<code>{canonicalBankLendingStateExample.stateId}</code>、3.11的<code>{canonicalBorrowerCollateralStateExample.stateId}</code>、3.12的<code>{canonicalMonetaryPolicyRiskTakingStateExample.stateId}</code>与3.13的<code>{canonicalFinancialConditionsStateExample.stateId}</code>。lineage不再只声明上游字段存在，而是登记36条sourcePath→targetPath，并逐项比较原始值或对象身份；源缺失、目标缺失、未接线源与等值克隆都会失败。每个producer的observation与publication时间通过信息截止门，revision和revision marker另行精确保存；3.12的<code>3.12-draft-contract</code>与<code>3.12-draft</code> legacy标记保持原样。3.13六维lane以及<code>{coverageFieldIds.join(', ')}</code>八项coverage/composition字段逐项保留。SYNTHETIC存量—流量账本覆盖2026-01-01至2026-09-11；DSR另用2026-09-11至2027-09-11前瞻合同支付窗，计划摊还与气球本金互斥、只计一次，并显式声明“期初债务计全窗利息、本金窗末支付”的教学近似。100+20−8−3+1=110，gross origination=20、net flow=12、stock change=10，10%只是声明窗口未年化的存量变化率。杠杆例把其他负债显式冻结为0，一般权益仍等于资产减全部负债。违约时EAD 10乘五年未观测回收路径的假设净经济LGD 40%得到4单位合成损失估计；净LGD只含合成路径中假定可变现的净回收和担保现金回收及处置成本，不使用担保面额且不得二次扣减。同一个估计在教学假设下只确认一次，同时把资本10降至6、计入前净账面贷款100降至96，固定密度简式容量由125降到75；这不是实现损失、会计处理或监管决策。外币债务服务、对冲、经营与资产现金流腿尚未收集，因此净FX现金流暴露保持<code>not-computed</code>，禁止拿名义额或存量相减。三份BIS latest-vintage护照全部<code>mayEnterCanonicalCalculation=false</code>，28行与三列投影逐字节重算SHA-256。measurement为合成机械审计并配官方定向，prediction仍not-estimated，causal仍not-identified；任何lineage、时钟、单位、对账、分母、coverage、vintage或证据门失败，构建立刻停止。</p>
      </div>
      <h3>生产者侧不变量</h3><ol className="contract-list">{contractInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
      <h3>动态来源刷新护照</h3><div className="interface-grid" role="group" aria-label="3.14动态来源刷新清单">{dynamicRefreshChecklist.map((item) => <article key={item.source}><span>{item.source}</span><p><b>刷新：</b>{item.refresh} <a href={item.sourceUrl}>打开冻结系列端点</a>。</p><p><b>允许用途：</b>{item.use} <Cites ns={item.sourceIds} /></p></article>)}</div>
      <h3>证据地图</h3><div className="evidence-map" aria-label={`3.14连续覆盖${lesson314References.length}条来源的证据地图`} role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} <Cites ns={group.ids} /></p></div>)}</div>
      <h3>跨章接口</h3><div className="interface-grid" role="group" aria-label="3.14跨章接口">{interfaces.map((item) => <article key={item.name}><span>{item.name}</span><p><b>Payload：</b>{item.payload}</p><p><b>Guardrail：</b>{item.guardrail}</p></article>)}</div>
      <div className="precision-note"><span>Reading path</span><p>先读IMF存量—流量与BIS三份数据文档建立对象纪律，再读Borio、Drehmann与Kiyotaki–Moore建立中期反馈；随后进入金融加速器、中介资本和供需识别，最后才读长历史预警与全球美元传导。每张延伸阅读卡都给出具体章节或问题，并保留不能外推的边界。</p></div>
    </section>
  </>;
}

export const lesson314: LessonRecord = {
  slug: '3-14',
  id: '3.14',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Credit Cycle：从融资菜单、信用流量与杠杆，到损失—资本反馈、预警与因果边界',
  subtitle: '信用周期不是固定阶段或单一贷款曲线，而是金融条件经合同与异质主体进入发放、偿还、存量、净值、抵押、偿债、违约和中介容量后，再反馈为下一期金融条件的多时钟系统',
  readingTime: 'CORE PATH 24个机制单元正文约95–120分钟；6个optional deep dive另约25–35分钟。C1–C7交互约55–80分钟；M1–M10首次完成约35–50分钟／含复盘约55–75分钟；K1–K10、18道检查、术语与接口约90–120分钟；49条来源与延伸阅读不计',
  prerequisite: 'Master prerequisite：3.09 Intermediary Balance Sheet Constraints、3.10 Bank Lending Channel、3.11 Borrower Balance Sheet / Collateral Channel、3.12 Risk-Taking Channel、3.13 Financial Conditions；按需调用T03、T05、T06与T08',
  updatedAt: '2026-09-11',
  revision: '3.14-r1',
  reviewStatus: 'double-reviewed',
  reviews: [
    { kind: 'accuracy', completedAt: '2026-09-14', decision: 'approved', revision: '3.14-r1', summary: '专业准确性通过：存量—流量、杠杆、抵押、偿债、损失—资本与构成效应复算闭合；36条lineage、四类负测、49条证据边界、BIS冻结快照与canonical隔离全部通过。' },
    { kind: 'pedagogy', completedAt: '2026-09-14', decision: 'approved', revision: '3.14-r1', summary: '教学与可访问性通过：30个机制单元沿完整反馈链渐进展开；多次硬刷新、键盘与焦点、390px移动端、真正无JavaScript静态双生及89页A4打印均通过。' },
  ],
  previous: { slug: '3-13', label: '3.13 Financial Conditions' },
  next: { slug: '3-15', label: '3.15 Debt / Leverage Cycle' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'official-data', label: '范围、路线与真实数据' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive M1–M10' },
    { id: 'credit-cycle-static-twins', label: 'Static K1–K10' },
    { id: 'checks-glossary', label: 'Checks / Audit / Glossary' },
    { id: 'interfaces-reading', label: 'State / Evidence / Interfaces' },
  ],
  Content: Lesson314Content,
  references: lesson314References,
  readingList: lesson314ReadingList,
  readingListOrder: 'source',
};
