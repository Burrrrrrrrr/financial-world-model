import type { ReactNode } from 'react';
import BalanceSheetCollateralLab from '../components/BalanceSheetCollateralLab';
import {
  BalanceSheetCollateralFixtureAudit,
  BindingConstraintLab,
  CollateralIdentificationLab,
  DebtOverhangLab,
  ExternalFinancePremiumLab,
  FinancialAcceleratorLoopLab,
  NetWorthRevaluationLab,
  PledgeableValueLab,
} from '../components/BalanceSheetCollateralMechanismLabs';
import BalanceSheetCollateralTransmissionChart from '../components/BalanceSheetCollateralTransmissionChart';
import {
  balanceSheetCollateralNumericAssertionAudit,
  balanceSheetCollateralScenarioAssertions,
  balanceSheetCollateralScenarios,
} from '../components/balanceSheetCollateralScenarios';
import { canonicalBankLendingStateExample } from './lesson-3-10';
import { lesson311ReadingList, lesson311References } from './lesson-3-11-sources';
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

const lesson311CorePathSectionIds = new Set([
  'scope-passport', 'net-worth-identity', 'valuation-bases', 'net-worth-versus-liquidity', 'collateral-value-ladder',
  'net-worth-reconciliation', 'internal-external-finance', 'external-finance-premium', 'security-interest-recovery',
  'borrowing-base', 'earnings-based-constraints', 'dscr-capacity', 'binding-constraint-stack', 'collateral-capacity',
  'net-worth-agency-cost', 'efp-user-cost', 'price-quantity-branch', 'desired-constrained-investment', 'cash-buffer',
  'financial-accelerator-loop', 'balance-sheet-estimand', 'collateral-capacity-estimand', 'financing-terms-estimand',
  'real-spending-estimand', 'same-lender-time', 'local-demand-confound', 'identification-gates',
]);

function BorrowerConceptSection({ section }: { section: ConceptSection }) {
  const learningTrack = lesson311CorePathSectionIds.has(section.id) ? 'CORE PATH' : 'OPTIONAL DEEP DIVE';
  return (
    <section className="lesson-section" id={section.id}>
      <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label} · {learningTrack}</p>
      <h2>{section.title}</h2>
      {section.formula ? <div className="equation-card"><span>{section.formula.label}</span><div><code>{section.formula.expression}</code></div><p>{section.formula.note}</p></div> : null}
      {section.paragraphs.map((paragraph, index) => <p key={`${section.id}:${index}`}>{paragraph}</p>)}
      {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
      {section.after}
      <p className="section-sources"><b>本节依据：</b> <Cites ns={section.sourceIds} /></p>
    </section>
  );
}

type NullableNumber = number | null;
type AmountPassport = {
  value: NullableNumber;
  currency: string | null;
  unitMultiplier: number | null;
  nominalOrReal: 'nominal' | 'real' | 'not-applicable' | null;
  baseDate: string | null;
  measurementBasis: string | null;
};
type RatePassport = {
  valuePctPointsPerYear: NullableNumber;
  rateConcept: string | null;
  annualisation: string | null;
  currency: string | null;
  tenor: string | null;
  observationTime: string | null;
};
type MeasurementFlag = 'observed' | 'estimated' | 'imputed' | 'synthetic' | 'stale' | 'not-collected' | 'not-applicable' | 'confidential' | 'unknown';
type IdentificationStatus = 'descriptive' | 'mechanism-consistent' | 'identified-candidate' | 'identified';

type BorrowerAssetState = {
  assetId: string;
  assetType: string;
  legalOwnerId: string;
  economicUserId: string;
  bookAmount: AmountPassport;
  marketValue: AmountPassport;
  appraisalValue: AmountPassport | null;
  liquidationValue: AmountPassport | null;
  expectedRecoveryValue: AmountPassport | null;
  valuationMethod: string;
  assetLocation: string;
  observationTime: string;
  appraisalTime: string | null;
  redeployabilityClass: 'high' | 'medium' | 'low' | 'unknown';
};

type BorrowerLiabilityState = {
  liabilityId: string;
  creditorId: string;
  instrumentType: string;
  faceAmount: AmountPassport;
  carryingAmount: AmountPassport;
  seniority: string;
  securedByAssetIds: string[];
  maturityTime: string;
  rateResetTime: string | null;
};

type CollateralPoolAssetState = {
  collateralId: string;
  assetId: string;
  legalOwnerId: string;
  candidateStatus: 'candidate' | 'excluded';
  eligibilityRuleId: string;
  eligibleShareRatio: number;
  appraisedValue: AmountPassport;
  liquidationValue: AmountPassport;
  expectedRecoveryValue: AmountPassport;
  advanceRateRatio: number;
  concentrationCap: AmountPassport | null;
  seniorLienAmount: AmountPassport;
  enforcementCost: AmountPassport;
  lienRank: number;
  registryId: string;
  enforceabilityStatus: 'perfected-and-enforceable' | 'not-perfectable' | 'pending' | 'unknown';
  valuationVintage: string;
  contributionToBorrowingBase: AmountPassport;
};

type FacilityState = {
  facilityId: string;
  lenderId: string;
  borrowerLegalEntityId: string;
  securedStatus: 'secured' | 'unsecured';
  collateralAssetIds: string[];
  commitmentAmount: AmountPassport;
  drawnAmount: AmountPassport;
  undrawnAmount: AmountPassport;
  drawCapSourceTerm: string;
  drawCapRatio: NullableNumber;
  drawCapInterpretation: 'hard-maximum-share-of-commitment' | 'initial-funding-share' | 'unresolved';
  maximumPermittedDrawAmount: AmountPassport | null;
  usableUndrawnAmount: AmountPassport | null;
  borrowingBaseRuleVersion: string | null;
  maxLTVRatio: NullableNumber;
  maxLTVTreatment: 'separate-covenant' | 'embedded-in-borrowing-base' | 'not-applicable';
  maxDebtToEBITDA: NullableNumber;
  minICR: NullableNumber;
  minDSCR: NullableNumber;
  covenantTestTime: string;
  waiverStatus: 'none' | 'granted' | 'pending';
  renegotiationTime: string | null;
};

type CollateralLineageCrosswalk = {
  upstreamCollateralId: string;
  localCollateralIds: string[];
  localAssetIds: string[];
  mappingBasis: 'synthetic-decomposition-for-3.11';
  securityAgreementVersion: string;
};

type ContractFieldProvenance = {
  fieldPath: string;
  provenance: 'frozen-from-3.10' | 'synthetic-3.11-enrichment';
  upstreamFieldPath: string | null;
};

type ComparableConstraintState = {
  constraintId: 'collateral' | 'earnings' | 'interest-coverage' | 'debt-service-coverage' | 'committed-undrawn';
  applicable: boolean;
  signedNativeHeadroom: AmountPassport;
  nativeHorizon: string;
  conversionFormula: string;
  conversionDivisor: number;
  conversionDivisorConcept: 'identity' | 'annual-interest-rate-ratio' | 'annual-debt-service-per-principal';
  conversionRatePassport: RatePassport | null;
  paymentFrequency: 'monthly' | null;
  amortisationTermMonths: number | null;
  convertedIncrementalPrincipalHeadroom: AmountPassport;
  targetBorrowerLegalEntityId: string;
  targetFacilityId: string;
  targetPrincipalConcept: string;
  targetHorizon: string;
  decisionTime: string;
};

type DynamicBorrowerDataPassport = {
  sourceId: string;
  provider: string;
  tableSeriesOrItem: string;
  jurisdiction: string;
  institutionalUniverse: string;
  consolidationBasis: string;
  frequency: string;
  observationDate: string | null;
  publicationDate: string | null;
  revisionDate: string | null;
  retrievedAtUTC: string | null;
  unit: string;
  valuationBasis: string;
  weightingAggregation: string;
  methodologyURL: string;
  accessStatus: 'public' | 'restricted' | 'unknown';
  missingAndBreakFlags: string[];
  measurementFlag: MeasurementFlag;
};

export type BorrowerCollateralChannelState = {
  schemaVersion: string;
  stateId: string;
  scopePassport: {
    borrowerLegalEntityId: string;
    borrowerGroupId: string;
    borrowerType: 'nonfinancial-corporation' | 'household' | 'other';
    sector: string;
    residency: string;
    consolidationBasis: string;
    accountingStandard: string;
    reportingCurrency: string;
    borrowerJurisdiction: string;
    assetJurisdictions: string[];
  };
  inputLineage: {
    lessonId: '3.09' | '3.10';
    stateId: string;
    fieldPaths: string[];
    observationTime: string;
    publicationTime: string | null;
    revisionTime: string;
  }[];
  borrowerBalanceSheetState: {
    assets: BorrowerAssetState[];
    liabilities: BorrowerLiabilityState[];
    totalAssets: AmountPassport;
    totalLiabilities: AmountPassport;
    netWorth: AmountPassport;
    contractAdjustedNetDebt: {
      definitionRuleId: string;
      grossDebtIncluded: AmountPassport;
      unrestrictedCashDeduction: AmountPassport;
      otherPermittedDeductions: AmountPassport;
      netDebt: AmountPassport;
    };
    financialStatementPeriodEnd: string;
    reconciliation: {
      openingNetWorth: AmountPassport;
      netSaving: AmountPassport;
      netCapitalTransfers: AmountPassport;
      holdingGainsLosses: AmountPassport;
      otherVolumeChanges: AmountPassport;
      closingNetWorth: AmountPassport;
    };
  };
  cashFlowState: {
    revenue: AmountPassport;
    contractAdjustedEBITDA: AmountPassport;
    operatingCashFlow: AmountPassport;
    cashFlowAvailableForDebtService: AmountPassport;
    interestExpense: AmountPassport;
    scheduledPrincipal: AmountPassport;
    capitalExpenditure: AmountPassport;
    inventoryChange: AmountPassport;
    payroll: AmountPassport;
    measurementWindow: string;
    frequency: string;
    annualised: boolean;
  };
  collateralPoolState: {
    poolId: string;
    assets: CollateralPoolAssetState[];
    totalBorrowingBase: AmountPassport;
    currentFacilityDrawn: AmountPassport;
    incrementalCollateralHeadroom: AmountPassport;
    doublePledgeCheck: 'passed' | 'failed';
  };
  debtContractState: {
    facilities: FacilityState[];
    collateralLineageCrosswalk: CollateralLineageCrosswalk[];
    fieldProvenance: ContractFieldProvenance[];
    applicableInsolvencyLawVersion: string;
    securityAgreementVersion: string;
  };
  constraintStackState: {
    constraints: ComparableConstraintState[];
    mappingTarget: { borrowerLegalEntityId: string; facilityId: string; currency: string; principalConcept: string; decisionTime: string; horizon: string };
    bindingCapacity: AmountPassport;
    bindingConstraintIds: ComparableConstraintState['constraintId'][];
    tieStatus: 'unique' | 'tie';
  };
  externalFinancePremiumState: {
    nominalOfferRate: RatePassport;
    annualisedFees: RatePassport;
    allInExternalCost: RatePassport;
    matchedBenchmarkRate: RatePassport;
    observableAllInSpreadPctPoints: NullableNumber;
    internalFinanceOpportunityCost: RatePassport | null;
    borrowerExternalFinancePremiumPctPoints: NullableNumber;
    measurementStatus: 'spread-only' | 'efp-estimated' | 'not-comparable';
  };
  financingDecisionState: {
    requested: AmountPassport;
    approved: AmountPassport;
    committed: AmountPassport;
    drawn: AmountPassport;
    outstanding: AmountPassport;
    deniedOrWithdrawn: AmountPassport;
    securedLoanChange: AmountPassport;
    unsecuredLoanChange: AmountPassport;
    bondChange: AmountPassport;
    tradeCreditChange: AmountPassport;
    leaseFinanceChange: AmountPassport;
    totalExternalFinanceChange: AmountPassport;
    internalCashUse: AmountPassport;
    postCashResourceChange: AmountPassport;
    remainingResourceShortfall: AmountPassport;
  };
  realSpendingState: {
    desiredWithoutCurrentFinancingFriction: { capex: AmountPassport; inventory: AmountPassport; payroll: AmountPassport; employmentIndex: number };
    realised: { capex: AmountPassport; inventory: AmountPassport; payroll: AmountPassport; employmentIndex: number };
    counterfactualStatus: 'modelled-synthetic' | 'identified' | 'not-available';
    outcomeWindow: string;
  };
  identificationState: {
    shockDefinition: string;
    predeterminedExposure: string;
    counterfactualGroup: string;
    lenderTimeControls: string[];
    localDemandControls: string[];
    supportDiagnostics: string[];
    standardErrorClustering: string;
    parallelTrendStatus: 'not-tested' | 'supported' | 'rejected';
    identificationStatus: IdentificationStatus;
  };
  dynamicDataPassports: DynamicBorrowerDataPassport[];
  measurementFlags: { fieldPath: string; flag: MeasurementFlag; note: string }[];
  boundaryRoutes: { destination: '3.10' | '3.12' | '3.14' | '3.15' | '3.16' | '7.12' | '7.13'; trigger: string; frozenHere: string }[];
  auditTimestamps: {
    eventTime: string;
    valuationTime: string;
    appraisalTime: string;
    financialStatementPeriodEnd: string;
    publicationTime: string | null;
    revisionTime: string;
    contractTestTime: string;
    decisionTime: string;
    outcomeWindowStart: string;
    outcomeWindowEnd: string;
  };
};

const canonicalBorrowerCollateralFields = [
  'schemaVersion', 'stateId', 'scopePassport', 'inputLineage', 'borrowerBalanceSheetState', 'cashFlowState',
  'collateralPoolState', 'debtContractState', 'constraintStackState', 'externalFinancePremiumState',
  'financingDecisionState', 'realSpendingState', 'identificationState', 'dynamicDataPassports',
  'measurementFlags', 'boundaryRoutes', 'auditTimestamps',
] as const satisfies readonly (keyof BorrowerCollateralChannelState)[];

const canonicalBorrowerCollateralFieldCoverage = true satisfies Exclude<keyof BorrowerCollateralChannelState, (typeof canonicalBorrowerCollateralFields)[number]> extends never ? true : false;

const synAmount = (value: number, basis: string): AmountPassport => ({
  value, currency: 'SYN', unitMultiplier: 1, nominalOrReal: 'nominal', baseDate: '2026-09-02', measurementBasis: basis,
});
const synRate = (value: number, concept: string, tenor = '24m'): RatePassport => ({
  valuePctPointsPerYear: value, rateConcept: concept, annualisation: 'simple-annual-percent', currency: 'SYN', tenor, observationTime: '2026-09-02T00:00:00Z',
});
const upstreamLoanContract = canonicalBankLendingStateExample.loanContractPassport;
const upstreamLoanOffer = canonicalBankLendingStateExample.loanOfferState;
const upstreamCreditDecision = canonicalBankLendingStateExample.creditDecisionState;

if (!upstreamLoanContract || !upstreamLoanOffer || !upstreamCreditDecision) {
  throw new Error('3.10 → 3.11 borrower-side lineage requires a non-empty frozen contract, offer and credit decision.');
}
if (upstreamLoanContract.collateralIds.length === 0) {
  throw new Error('3.10 → 3.11 collateral lineage requires at least one frozen upstream collateralId.');
}

const canonicalAssets: BorrowerAssetState[] = [
  {
    assetId: 'RECEIVABLES_1', assetType: 'trade-receivables', legalOwnerId: 'FIRM_1', economicUserId: 'FIRM_1',
    bookAmount: synAmount(120, 'amortised-cost'), marketValue: synAmount(120, 'synthetic-market-proxy'), appraisalValue: synAmount(120, 'eligible-receivables-appraisal'), liquidationValue: synAmount(96, 'synthetic-orderly-liquidation-value'), expectedRecoveryValue: synAmount(80, 'synthetic-expected-recovery'),
    valuationMethod: 'SYNTHETIC_AGING_SCHEDULE', assetLocation: 'SYNTHETIC', observationTime: '2026-09-02T00:00:00Z', appraisalTime: '2026-09-01T00:00:00Z', redeployabilityClass: 'medium',
  },
  {
    assetId: 'EQUIPMENT_1', assetType: 'production-equipment', legalOwnerId: 'FIRM_1', economicUserId: 'FIRM_1',
    bookAmount: synAmount(80, 'depreciated-cost'), marketValue: synAmount(80, 'synthetic-market-value'), appraisalValue: synAmount(80, 'independent-appraisal'), liquidationValue: synAmount(60, 'synthetic-orderly-liquidation-value'), expectedRecoveryValue: synAmount(44, 'synthetic-expected-recovery'),
    valuationMethod: 'SYNTHETIC_COMPARABLE_SALES', assetLocation: 'SYNTHETIC', observationTime: '2026-09-02T00:00:00Z', appraisalTime: '2026-08-30T00:00:00Z', redeployabilityClass: 'medium',
  },
  {
    assetId: 'OTHER_ASSETS', assetType: 'cash-inventory-property-and-other', legalOwnerId: 'FIRM_1', economicUserId: 'FIRM_1',
    bookAmount: synAmount(800, 'synthetic-aggregate-book-value'), marketValue: synAmount(800, 'synthetic-aggregate-market-value'), appraisalValue: null, liquidationValue: null, expectedRecoveryValue: null,
    valuationMethod: 'SYNTHETIC_AGGREGATE', assetLocation: 'SYNTHETIC', observationTime: '2026-09-02T00:00:00Z', appraisalTime: null, redeployabilityClass: 'unknown',
  },
];

const canonicalLiabilities: BorrowerLiabilityState[] = [
  {
    liabilityId: upstreamLoanContract.contractId, creditorId: upstreamLoanContract.lenderLegalEntityId ?? 'BANK_A', instrumentType: upstreamLoanContract.product ?? 'term-loan',
    faceAmount: synAmount(80, 'drawn-principal'), carryingAmount: synAmount(80, 'amortised-cost'), seniority: 'senior-secured', securedByAssetIds: ['RECEIVABLES_1', 'EQUIPMENT_1'], maturityTime: upstreamLoanContract.maturityAt ?? '2028-09-02T00:00:00Z', rateResetTime: '2026-12-02T00:00:00Z',
  },
  {
    liabilityId: 'OTHER_LIABILITIES', creditorId: 'SYNTHETIC_MULTIPLE', instrumentType: 'other-debt-and-operating-liabilities', faceAmount: synAmount(620, 'face-and-payable-amount'), carryingAmount: synAmount(620, 'carrying-value'), seniority: 'mixed', securedByAssetIds: [], maturityTime: '2030-09-02T00:00:00Z', rateResetTime: null,
  },
];

const canonicalCollateralAssets: CollateralPoolAssetState[] = [
  {
    collateralId: 'COLLATERAL_RECEIVABLES', assetId: 'RECEIVABLES_1', legalOwnerId: 'FIRM_1', candidateStatus: 'candidate', eligibilityRuleId: 'SYN_BB_R1', eligibleShareRatio: 0.8,
    appraisedValue: synAmount(120, 'appraised-value'), liquidationValue: synAmount(96, 'liquidation-value'), expectedRecoveryValue: synAmount(80, 'expected-recovery-value'), advanceRateRatio: 0.75, concentrationCap: synAmount(75, 'contract-cap'), seniorLienAmount: synAmount(12, 'prior-senior-claims'), enforcementCost: synAmount(0, 'synthetic-zero'), lienRank: 2, registryId: 'SYN_REG_1', enforceabilityStatus: 'perfected-and-enforceable', valuationVintage: '2026-09-01', contributionToBorrowingBase: synAmount(60, 'min(120×0.8×0.75,75)−12'),
  },
  {
    collateralId: 'COLLATERAL_EQUIPMENT', assetId: 'EQUIPMENT_1', legalOwnerId: 'FIRM_1', candidateStatus: 'candidate', eligibilityRuleId: 'SYN_BB_R1', eligibleShareRatio: 1,
    appraisedValue: synAmount(80, 'appraised-value'), liquidationValue: synAmount(60, 'liquidation-value'), expectedRecoveryValue: synAmount(44, 'expected-recovery-value'), advanceRateRatio: 0.5, concentrationCap: null, seniorLienAmount: synAmount(3, 'prior-senior-claims'), enforcementCost: synAmount(0, 'synthetic-zero'), lienRank: 2, registryId: 'SYN_REG_2', enforceabilityStatus: 'perfected-and-enforceable', valuationVintage: '2026-08-30', contributionToBorrowingBase: synAmount(37, '80×0.5−3'),
  },
];

const canonicalTargetPrincipalConcept = 'incremental-drawn-term-loan-principal';
const canonicalTargetHorizon = '24m';
const canonicalDecisionTime = upstreamCreditDecision.decisionTime ?? '2026-09-02T00:00:00Z';
const canonicalNominalOfferRateRatio = (upstreamLoanOffer.nominalOfferRatePctPointsPerYear ?? 5.7) / 100;
const canonicalMonthlyAmortisingDebtServiceFactor = (() => {
  const monthlyRate = canonicalNominalOfferRateRatio / 12;
  const months = 24;
  return (monthlyRate === 0 ? 1 / months : monthlyRate / (1 - (1 + monthlyRate) ** (-months))) * 12;
})();
const canonicalInterestCoverageNativeHeadroom = 30 / 3 - 8.8;
const canonicalInterestCoveragePrincipalHeadroom = canonicalInterestCoverageNativeHeadroom / canonicalNominalOfferRateRatio;
const canonicalDebtServiceNativeHeadroom = 24 / 1.5 - (8.8 + 3.2);
const canonicalDebtServicePrincipalHeadroom = canonicalDebtServiceNativeHeadroom / canonicalMonthlyAmortisingDebtServiceFactor;

const canonicalConstraints: ComparableConstraintState[] = [
  { constraintId: 'collateral', applicable: true, signedNativeHeadroom: synAmount(17, 'borrowing-base-minus-current-draw'), nativeHorizon: 'point-in-time', conversionFormula: '17 / 1 = 17 incremental principal', conversionDivisor: 1, conversionDivisorConcept: 'identity', conversionRatePassport: null, paymentFrequency: null, amortisationTermMonths: null, convertedIncrementalPrincipalHeadroom: synAmount(17, 'incremental-principal'), targetBorrowerLegalEntityId: 'FIRM_1', targetFacilityId: upstreamLoanContract.contractId, targetPrincipalConcept: canonicalTargetPrincipalConcept, targetHorizon: canonicalTargetHorizon, decisionTime: canonicalDecisionTime },
  { constraintId: 'earnings', applicable: true, signedNativeHeadroom: synAmount(30, '4×contract-adjusted-EBITDA-minus-contract-adjusted-net-debt'), nativeHorizon: 'trailing-12m', conversionFormula: '30 / 1 = 30 incremental principal', conversionDivisor: 1, conversionDivisorConcept: 'identity', conversionRatePassport: null, paymentFrequency: null, amortisationTermMonths: null, convertedIncrementalPrincipalHeadroom: synAmount(30, 'incremental-principal'), targetBorrowerLegalEntityId: 'FIRM_1', targetFacilityId: upstreamLoanContract.contractId, targetPrincipalConcept: canonicalTargetPrincipalConcept, targetHorizon: canonicalTargetHorizon, decisionTime: canonicalDecisionTime },
  { constraintId: 'interest-coverage', applicable: true, signedNativeHeadroom: synAmount(canonicalInterestCoverageNativeHeadroom, 'maximum-annual-interest-minus-current-interest'), nativeHorizon: 'annual-flow', conversionFormula: '1.2 / 5.7% frozen nominal contractual rate = 21.05263158 principal', conversionDivisor: canonicalNominalOfferRateRatio, conversionDivisorConcept: 'annual-interest-rate-ratio', conversionRatePassport: synRate(upstreamLoanOffer.nominalOfferRatePctPointsPerYear ?? 5.7, 'frozen-3.10-nominal-contractual-interest-rate'), paymentFrequency: null, amortisationTermMonths: null, convertedIncrementalPrincipalHeadroom: synAmount(canonicalInterestCoveragePrincipalHeadroom, 'incremental-principal'), targetBorrowerLegalEntityId: 'FIRM_1', targetFacilityId: upstreamLoanContract.contractId, targetPrincipalConcept: canonicalTargetPrincipalConcept, targetHorizon: canonicalTargetHorizon, decisionTime: canonicalDecisionTime },
  { constraintId: 'debt-service-coverage', applicable: true, signedNativeHeadroom: synAmount(canonicalDebtServiceNativeHeadroom, 'maximum-annual-debt-service-minus-current-interest-and-principal'), nativeHorizon: 'annual-flow', conversionFormula: '4 / 0.5302266637 annual debt service per principal = 7.54394351 principal', conversionDivisor: canonicalMonthlyAmortisingDebtServiceFactor, conversionDivisorConcept: 'annual-debt-service-per-principal', conversionRatePassport: synRate(upstreamLoanOffer.nominalOfferRatePctPointsPerYear ?? 5.7, 'frozen-3.10-nominal-contractual-interest-rate'), paymentFrequency: 'monthly', amortisationTermMonths: 24, convertedIncrementalPrincipalHeadroom: synAmount(canonicalDebtServicePrincipalHeadroom, 'incremental-principal'), targetBorrowerLegalEntityId: 'FIRM_1', targetFacilityId: upstreamLoanContract.contractId, targetPrincipalConcept: canonicalTargetPrincipalConcept, targetHorizon: canonicalTargetHorizon, decisionTime: canonicalDecisionTime },
  { constraintId: 'committed-undrawn', applicable: true, signedNativeHeadroom: synAmount(0, 'hard-draw-cap-maximum-minus-current-draw'), nativeHorizon: 'until-facility-expiry', conversionFormula: '0 / 1 = 0 usable incremental principal', conversionDivisor: 1, conversionDivisorConcept: 'identity', conversionRatePassport: null, paymentFrequency: null, amortisationTermMonths: null, convertedIncrementalPrincipalHeadroom: synAmount(0, 'usable-incremental-principal-after-hard-draw-cap'), targetBorrowerLegalEntityId: 'FIRM_1', targetFacilityId: upstreamLoanContract.contractId, targetPrincipalConcept: canonicalTargetPrincipalConcept, targetHorizon: canonicalTargetHorizon, decisionTime: canonicalDecisionTime },
];

const canonicalSecurityAgreementVersion = 'SYN_SECURITY_R2';
const canonicalCollateralLineageCrosswalk: CollateralLineageCrosswalk[] = [{
  upstreamCollateralId: upstreamLoanContract.collateralIds[0]!,
  localCollateralIds: canonicalCollateralAssets.map(({ collateralId }) => collateralId),
  localAssetIds: canonicalCollateralAssets.map(({ assetId }) => assetId),
  mappingBasis: 'synthetic-decomposition-for-3.11',
  securityAgreementVersion: canonicalSecurityAgreementVersion,
}];
const canonicalContractFieldProvenance: ContractFieldProvenance[] = [
  { fieldPath: 'facilities[0].facilityId', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.contractId' },
  { fieldPath: 'facilities[0].lenderId', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.lenderLegalEntityId' },
  { fieldPath: 'facilities[0].borrowerLegalEntityId', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.borrowerId' },
  { fieldPath: 'facilities[0].commitmentAmount', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.commitmentAmount' },
  { fieldPath: 'facilities[0].drawnAmount', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.drawnAmount' },
  { fieldPath: 'facilities[0].drawCapSourceTerm', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanOfferState.nonpriceTerms' },
  { fieldPath: 'financingDecisionState.requested', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.applicationAmount' },
  { fieldPath: 'financingDecisionState.approved', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.approvedAmount' },
  { fieldPath: 'financingDecisionState.committed', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.commitmentAmount' },
  { fieldPath: 'financingDecisionState.drawn', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.drawnAmount' },
  { fieldPath: 'financingDecisionState.outstanding', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanContractPassport.outstandingAmount' },
  { fieldPath: 'externalFinancePremiumState.nominalOfferRate', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanOfferState.nominalOfferRatePctPointsPerYear' },
  { fieldPath: 'externalFinancePremiumState.annualisedFees', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanOfferState.annualisedFeePctPointsPerYear' },
  { fieldPath: 'externalFinancePremiumState.allInExternalCost', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanOfferState.allInOfferRatePctPointsPerYear' },
  { fieldPath: 'externalFinancePremiumState.matchedBenchmarkRate', provenance: 'frozen-from-3.10', upstreamFieldPath: 'loanOfferState.benchmarkRate' },
  { fieldPath: 'collateralLineageCrosswalk', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'securityAgreementVersion', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'facilities[0].borrowingBaseRuleVersion', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'facilities[0].maxLTVTreatment', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'facilities[0].maxDebtToEBITDA', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'facilities[0].minICR', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'facilities[0].minDSCR', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'constraintStackState.debt-service-coverage.paymentFrequency', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
  { fieldPath: 'constraintStackState.debt-service-coverage.amortisationTermMonths', provenance: 'synthetic-3.11-enrichment', upstreamFieldPath: null },
];

export const canonicalBorrowerCollateralStateExample: BorrowerCollateralChannelState = {
  schemaVersion: '3.11-r2-contract',
  stateId: 'SYNTHETIC_BORROWER_COLLATERAL_STATE',
  scopePassport: { borrowerLegalEntityId: 'FIRM_1', borrowerGroupId: 'GROUP_1', borrowerType: 'nonfinancial-corporation', sector: 'synthetic-manufacturing', residency: 'SYNTHETIC', consolidationBasis: 'solo-legal-entity', accountingStandard: 'SYNTHETIC_STANDARD', reportingCurrency: 'SYN', borrowerJurisdiction: 'SYNTHETIC', assetJurisdictions: ['SYNTHETIC'] },
  inputLineage: [
    { lessonId: '3.09', stateId: canonicalBankLendingStateExample.bankCreditInputState.creditStateId ?? 'SYNTHETIC_309_CREDIT', fieldPaths: ['creditState', 'legalEntityScope', 'eventClocks'], observationTime: '2026-09-02T00:00:00Z', publicationTime: null, revisionTime: '3.09-r5' },
    { lessonId: '3.10', stateId: canonicalBankLendingStateExample.stateId, fieldPaths: ['loanOfferState', 'creditDecisionState', 'loanContractPassport', 'relationshipState', 'frozenRiskState'], observationTime: canonicalBankLendingStateExample.timestamps.observationTime ?? '2026-09-02T00:00:00Z', publicationTime: canonicalBankLendingStateExample.timestamps.publicationTime, revisionTime: canonicalBankLendingStateExample.timestamps.revisionVintage ?? '3.10-r3' },
  ],
  borrowerBalanceSheetState: {
    assets: canonicalAssets, liabilities: canonicalLiabilities, totalAssets: synAmount(1000, 'market-consistent-synthetic-total'), totalLiabilities: synAmount(700, 'carrying-value-total'), netWorth: synAmount(300, 'assets-minus-liabilities'), financialStatementPeriodEnd: '2026-09-02T00:00:00Z',
    contractAdjustedNetDebt: { definitionRuleId: 'SYN_NET_DEBT_R1', grossDebtIncluded: synAmount(100, 'contract-defined-interest-bearing-debt'), unrestrictedCashDeduction: synAmount(10, 'contract-permitted-unrestricted-cash-deduction'), otherPermittedDeductions: synAmount(0, 'none'), netDebt: synAmount(90, 'gross-debt-minus-permitted-deductions') },
    reconciliation: { openingNetWorth: synAmount(300, 'opening-net-worth'), netSaving: synAmount(0, 'net-saving'), netCapitalTransfers: synAmount(0, 'net-capital-transfers'), holdingGainsLosses: synAmount(0, 'holding-gains-and-losses'), otherVolumeChanges: synAmount(0, 'other-volume-changes'), closingNetWorth: synAmount(300, 'closing-net-worth') },
  },
  cashFlowState: { revenue: synAmount(180, 'trailing-12m-revenue'), contractAdjustedEBITDA: synAmount(30, 'contract-definition-SYN_EBITDA_R1'), operatingCashFlow: synAmount(27, 'trailing-12m-operating-cash-flow'), cashFlowAvailableForDebtService: synAmount(24, 'after-tax-and-maintenance-capex'), interestExpense: synAmount(8.8, 'annual-interest-expense'), scheduledPrincipal: synAmount(3.2, 'annual-scheduled-principal'), capitalExpenditure: synAmount(20, 'trailing-12m-capex'), inventoryChange: synAmount(4, 'trailing-12m-inventory-increase'), payroll: synAmount(40, 'trailing-12m-payroll'), measurementWindow: '2025-09-03/2026-09-02', frequency: 'annual', annualised: false },
  collateralPoolState: { poolId: 'SYN_COLLATERAL_POOL_1', assets: canonicalCollateralAssets, totalBorrowingBase: synAmount(97, 'sum-eligible-contributions'), currentFacilityDrawn: synAmount(80, 'drawn-principal'), incrementalCollateralHeadroom: synAmount(17, 'borrowing-base-minus-current-draw'), doublePledgeCheck: 'passed' },
  debtContractState: {
    facilities: [{ facilityId: upstreamLoanContract.contractId, lenderId: upstreamLoanContract.lenderLegalEntityId ?? 'BANK_A', borrowerLegalEntityId: 'FIRM_1', securedStatus: 'secured', collateralAssetIds: canonicalCollateralAssets.map(({ assetId }) => assetId), commitmentAmount: synAmount(100, 'committed-limit'), drawnAmount: synAmount(80, 'drawn-principal'), undrawnAmount: synAmount(20, 'commitment-minus-drawn-not-necessarily-usable'), drawCapSourceTerm: '80% draw cap', drawCapRatio: 0.8, drawCapInterpretation: 'hard-maximum-share-of-commitment', maximumPermittedDrawAmount: synAmount(80, 'commitment-times-hard-draw-cap'), usableUndrawnAmount: synAmount(0, 'maximum-permitted-draw-minus-current-draw'), borrowingBaseRuleVersion: 'SYN_BB_R1', maxLTVRatio: null, maxLTVTreatment: 'embedded-in-borrowing-base', maxDebtToEBITDA: 4, minICR: 3, minDSCR: 1.5, covenantTestTime: '2026-09-02T00:00:00Z', waiverStatus: 'none', renegotiationTime: null }],
    collateralLineageCrosswalk: canonicalCollateralLineageCrosswalk,
    fieldProvenance: canonicalContractFieldProvenance,
    applicableInsolvencyLawVersion: 'SYN_INSOLVENCY_R1',
    securityAgreementVersion: canonicalSecurityAgreementVersion,
  },
  constraintStackState: { constraints: canonicalConstraints, mappingTarget: { borrowerLegalEntityId: 'FIRM_1', facilityId: upstreamLoanContract.contractId, currency: 'SYN', principalConcept: canonicalTargetPrincipalConcept, decisionTime: canonicalDecisionTime, horizon: canonicalTargetHorizon }, bindingCapacity: synAmount(0, 'minimum-comparable-headroom-after-hard-draw-cap'), bindingConstraintIds: ['committed-undrawn'], tieStatus: 'unique' },
  externalFinancePremiumState: { nominalOfferRate: synRate(upstreamLoanOffer.nominalOfferRatePctPointsPerYear ?? 5.7, 'frozen-3.10-nominal-offer'), annualisedFees: synRate(upstreamLoanOffer.annualisedFeePctPointsPerYear ?? 0.5, 'annualised-fees'), allInExternalCost: synRate(upstreamLoanOffer.allInOfferRatePctPointsPerYear ?? 6.2, 'all-in-external-cost'), matchedBenchmarkRate: synRate(upstreamLoanOffer.benchmarkRate?.valuePctPointsPerYear ?? 3, 'matched-contract-benchmark'), observableAllInSpreadPctPoints: 3.2, internalFinanceOpportunityCost: synRate(4.4, 'synthetic-internal-opportunity-cost'), borrowerExternalFinancePremiumPctPoints: 1.8, measurementStatus: 'efp-estimated' },
  financingDecisionState: { requested: synAmount(120, 'requested-principal'), approved: synAmount(100, 'approved-limit'), committed: synAmount(100, 'committed-limit'), drawn: synAmount(80, 'drawn-principal'), outstanding: synAmount(80, 'outstanding-principal'), deniedOrWithdrawn: synAmount(20, 'requested-minus-approved'), securedLoanChange: synAmount(-30, 'window-change'), unsecuredLoanChange: synAmount(10, 'window-change'), bondChange: synAmount(5, 'window-change'), tradeCreditChange: synAmount(3, 'window-change'), leaseFinanceChange: synAmount(0, 'window-change'), totalExternalFinanceChange: synAmount(-12, 'sum-external-finance-changes'), internalCashUse: synAmount(5, 'cash-buffer-use'), postCashResourceChange: synAmount(-7, 'external-finance-change-plus-internal-cash-use'), remainingResourceShortfall: synAmount(7, 'positive-shortfall-after-internal-cash-use') },
  realSpendingState: { desiredWithoutCurrentFinancingFriction: { capex: synAmount(20, 'model-counterfactual'), inventory: synAmount(4, 'model-counterfactual'), payroll: synAmount(40, 'model-counterfactual'), employmentIndex: 100 }, realised: { capex: synAmount(16, 'synthetic-realised'), inventory: synAmount(2, 'synthetic-realised'), payroll: synAmount(39, 'synthetic-realised'), employmentIndex: 99 }, counterfactualStatus: 'modelled-synthetic', outcomeWindow: '2026-09-03/2027-09-02' },
  identificationState: { shockDefinition: 'SYNTHETIC_COLLATERAL_REVALUATION', predeterminedExposure: 'assets owned at SYN-t-minus-1', counterfactualGroup: 'synthetic-renters-with-common-support', lenderTimeControls: ['same-lender-by-calendar-time'], localDemandControls: ['location-by-industry demand proxy'], supportDiagnostics: ['overlap-not-empirically-tested'], standardErrorClustering: 'not-applicable-synthetic', parallelTrendStatus: 'not-tested', identificationStatus: 'descriptive' },
  dynamicDataPassports: [
    { sourceId: 'FED_Z1_S11_1_B', provider: 'Federal Reserve', tableSeriesOrItem: 'S11.1.b', jurisdiction: 'United States', institutionalUniverse: 'nonfinancial-corporate-business', consolidationBasis: 'sector-aggregate', frequency: 'quarterly stock; amounts outstanding at end of period; not seasonally adjusted', observationDate: null, publicationDate: null, revisionDate: null, retrievedAtUTC: null, unit: 'USD billions; ratios in percent only where the line is explicitly labelled', valuationBasis: 'mixed-by-instrument', weightingAggregation: 'sector-accounting-aggregate', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_b.htm', accessStatus: 'public', missingAndBreakFlags: ['LIVE_REFRESH_REQUIRED', 'NOT_CONTRACT_LEVEL', 'END_OF_PERIOD_STOCK'], measurementFlag: 'not-collected' },
    { sourceId: 'FED_Z1_S11_1_T', provider: 'Federal Reserve', tableSeriesOrItem: 'S11.1.t', jurisdiction: 'United States', institutionalUniverse: 'nonfinancial-corporate-business', consolidationBasis: 'sector-aggregate', frequency: 'quarterly flow; seasonally adjusted annual rate unless the table or line note states otherwise', observationDate: null, publicationDate: null, revisionDate: null, retrievedAtUTC: null, unit: 'USD billions at seasonally adjusted annual rates unless the line note states otherwise', valuationBasis: 'transactions-by-instrument', weightingAggregation: 'sector-accounting-aggregate', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_t.htm', accessStatus: 'public', missingAndBreakFlags: ['LIVE_REFRESH_REQUIRED', 'NOT_CONTRACT_LEVEL', 'SAAR_FLOW_NOT_QUARTER_AMOUNT'], measurementFlag: 'not-collected' },
    { sourceId: 'FED_Z1_S11_1_R', provider: 'Federal Reserve', tableSeriesOrItem: 'S11.1.r', jurisdiction: 'United States', institutionalUniverse: 'nonfinancial-corporate-business', consolidationBasis: 'sector-aggregate', frequency: 'quarterly change-in-net-worth bridge; not seasonally adjusted', observationDate: null, publicationDate: null, revisionDate: null, retrievedAtUTC: null, unit: 'USD billions', valuationBasis: 'transactions-plus-holding-gains-and-other-volume-changes', weightingAggregation: 'sector-accounting-aggregate', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_r.htm', accessStatus: 'public', missingAndBreakFlags: ['LIVE_REFRESH_REQUIRED', 'NOT_CONTRACT_LEVEL', 'NOT_SEASONALLY_ADJUSTED'], measurementFlag: 'not-collected' },
    { sourceId: 'FED_Z1_S11_1_I_A', provider: 'Federal Reserve', tableSeriesOrItem: 'S11.1.i.a', jurisdiction: 'United States', institutionalUniverse: 'nonfinancial-corporate-business', consolidationBasis: 'sector-aggregate-integrated-accounts', frequency: 'annual', observationDate: null, publicationDate: null, revisionDate: null, retrievedAtUTC: null, unit: 'USD billions and ratios only where explicitly labelled', valuationBasis: 'integrated-current-capital-financial-revaluation-and-balance-sheet-accounts', weightingAggregation: 'sector-accounting-aggregate', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_i_a.htm', accessStatus: 'public', missingAndBreakFlags: ['LIVE_REFRESH_REQUIRED', 'NOT_CONTRACT_LEVEL', 'ANNUAL_NOT_QUARTERLY'], measurementFlag: 'not-collected' },
    { sourceId: 'BIS_DSR_NFC', provider: 'Bank for International Settlements', tableSeriesOrItem: 'Debt service ratios / non-financial corporations', jurisdiction: 'multi-country', institutionalUniverse: 'nonfinancial-corporations', consolidationBasis: 'country-sector-estimate', frequency: 'quarterly', observationDate: null, publicationDate: null, revisionDate: null, retrievedAtUTC: null, unit: 'percent', valuationBasis: 'estimated-debt-service-flow-over-income', weightingAggregation: 'country-sector', methodologyURL: 'https://data.bis.org/topics/DSR', accessStatus: 'public', missingAndBreakFlags: ['LIVE_REFRESH_REQUIRED', 'MODEL_BASED_MATURITY_ASSUMPTIONS'], measurementFlag: 'not-collected' },
    { sourceId: 'WORLD_BANK_ENTERPRISE_SURVEYS', provider: 'World Bank', tableSeriesOrItem: 'Finance module / collateral and financing', jurisdiction: 'multi-country', institutionalUniverse: 'formal-private-firms-in-survey-frame', consolidationBasis: 'survey-establishment-or-firm-by-instrument', frequency: 'survey-wave', observationDate: null, publicationDate: null, revisionDate: null, retrievedAtUTC: null, unit: 'responses and local-currency amounts', valuationBasis: 'respondent-reported', weightingAggregation: 'survey-weighted', methodologyURL: 'https://www.enterprisesurveys.org/en/data', accessStatus: 'public', missingAndBreakFlags: ['LIVE_REFRESH_REQUIRED', 'APPLICATION_SELECTION', 'SURVEY_WAVE_NOT_PANEL_BY_DEFAULT'], measurementFlag: 'not-collected' },
  ],
  measurementFlags: [{ fieldPath: '*', flag: 'synthetic', note: 'Canonical example is a local teaching fixture, not empirical data, legal advice, credit advice or an eligibility decision.' }],
  boundaryRoutes: [
    { destination: '3.10', trigger: 'bank funding, capital or offer schedule changes', frozenHere: 'lender state and frozen offer lineage' },
    { destination: '3.12', trigger: 'bank risk tolerance, screening or selection rule changes', frozenHere: 'risk tolerance and screening threshold' },
    { destination: '3.14', trigger: 'borrower states aggregate into an endogenous credit cycle', frozenHere: 'aggregate credit feedback' },
    { destination: '3.15', trigger: 'system leverage state becomes the target', frozenHere: 'aggregate leverage cycle' },
    { destination: '3.16', trigger: 'housing institutions, refinancing and household MPC dominate', frozenHere: 'housing-specific mechanisms' },
    { destination: '7.12', trigger: 'margin calls and market leverage create price feedback', frozenHere: 'margin spiral' },
    { destination: '7.13', trigger: 'forced sales change market prices and contaminate other balance sheets', frozenHere: 'fire-sale contagion' },
  ],
  auditTimestamps: { eventTime: '2026-08-30T00:00:00Z', valuationTime: '2026-09-01T00:00:00Z', appraisalTime: '2026-09-01T00:00:00Z', financialStatementPeriodEnd: '2026-09-02T00:00:00Z', publicationTime: null, revisionTime: '2026-09-02T00:00:00Z', contractTestTime: '2026-09-02T00:00:00Z', decisionTime: '2026-09-02T00:00:00Z', outcomeWindowStart: '2026-09-03T00:00:00Z', outcomeWindowEnd: '2027-09-02T00:00:00Z' },
};

const almostEqual = (left: number | null | undefined, right: number, tolerance = 1e-9) => left !== null && left !== undefined && Number.isFinite(left) && Math.abs(left - right) <= tolerance;
const valueOf = (amount: AmountPassport) => amount.value ?? Number.NaN;
const sameUniqueStringSet = (left: readonly string[], right: readonly string[]) => left.length === right.length && new Set(left).size === left.length && new Set(right).size === right.length && left.every((value) => right.includes(value));
const canonicalAssetTotal = canonicalAssets.reduce((sum, asset) => sum + valueOf(asset.marketValue), 0);
const canonicalLiabilityTotal = canonicalLiabilities.reduce((sum, liability) => sum + valueOf(liability.carryingAmount), 0);
const canonicalCollateralTotal = canonicalCollateralAssets.reduce((sum, asset) => sum + valueOf(asset.contributionToBorrowingBase), 0);
const bindingMinimum = Math.min(...canonicalConstraints.filter(({ applicable }) => applicable).map(({ convertedIncrementalPrincipalHeadroom }) => valueOf(convertedIncrementalPrincipalHeadroom)));
const bindingIds = canonicalConstraints.filter(({ applicable, convertedIncrementalPrincipalHeadroom }) => applicable && almostEqual(valueOf(convertedIncrementalPrincipalHeadroom), bindingMinimum)).map(({ constraintId }) => constraintId);
const canonicalFacility = canonicalBorrowerCollateralStateExample.debtContractState.facilities[0]!;
const canonicalEfp = canonicalBorrowerCollateralStateExample.externalFinancePremiumState;
const canonicalNetDebt = canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.contractAdjustedNetDebt;
const canonicalReconciliation = canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.reconciliation;
const canonicalFinancingDecision = canonicalBorrowerCollateralStateExample.financingDecisionState;
const canonicalConstraintConversionGate = canonicalConstraints.every((constraint) => constraint.conversionDivisor > 0
  && almostEqual(valueOf(constraint.convertedIncrementalPrincipalHeadroom), valueOf(constraint.signedNativeHeadroom) / constraint.conversionDivisor)
  && constraint.targetPrincipalConcept === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.principalConcept
  && constraint.targetHorizon === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.horizon)
  && canonicalConstraints.filter(({ conversionDivisorConcept }) => conversionDivisorConcept === 'annual-interest-rate-ratio').every(({ conversionDivisor, conversionRatePassport }) => conversionRatePassport !== null && almostEqual(conversionDivisor, (conversionRatePassport.valuePctPointsPerYear ?? Number.NaN) / 100))
  && canonicalConstraints.filter(({ conversionDivisorConcept }) => conversionDivisorConcept === 'annual-debt-service-per-principal').every(({ conversionDivisor, conversionRatePassport, paymentFrequency, amortisationTermMonths }) => conversionRatePassport !== null
    && paymentFrequency === 'monthly' && amortisationTermMonths === 24
    && almostEqual(conversionDivisor, canonicalMonthlyAmortisingDebtServiceFactor));
const requiredCanonicalConstraintIds = ['collateral', 'earnings', 'interest-coverage', 'debt-service-coverage', 'committed-undrawn'] as const;
const canonicalConstraintIdGate = sameUniqueStringSet(canonicalConstraints.map(({ constraintId }) => constraintId), requiredCanonicalConstraintIds)
  && canonicalConstraints.every(({ applicable }) => applicable);
const canonicalPublicationGate = canonicalBorrowerCollateralStateExample.inputLineage.every(({ publicationTime }) => publicationTime === null || publicationTime <= canonicalBorrowerCollateralStateExample.auditTimestamps.decisionTime)
  && (canonicalBorrowerCollateralStateExample.auditTimestamps.publicationTime === null || canonicalBorrowerCollateralStateExample.auditTimestamps.publicationTime <= canonicalBorrowerCollateralStateExample.auditTimestamps.decisionTime);
const canonicalCollateralRightsGate = canonicalCollateralAssets.every((asset) => asset.legalOwnerId === canonicalBorrowerCollateralStateExample.scopePassport.borrowerLegalEntityId && asset.registryId.length > 0 && asset.enforceabilityStatus === 'perfected-and-enforceable' && asset.eligibleShareRatio >= 0 && asset.eligibleShareRatio <= 1 && asset.advanceRateRatio >= 0 && asset.advanceRateRatio <= 1);
const canonicalCrosswalk = canonicalBorrowerCollateralStateExample.debtContractState.collateralLineageCrosswalk;
const canonicalCollateralCrosswalkGate = sameUniqueStringSet(canonicalCrosswalk.map(({ upstreamCollateralId }) => upstreamCollateralId), upstreamLoanContract.collateralIds)
  && sameUniqueStringSet(canonicalCrosswalk.flatMap(({ localCollateralIds }) => localCollateralIds), canonicalCollateralAssets.map(({ collateralId }) => collateralId))
  && sameUniqueStringSet(canonicalCrosswalk.flatMap(({ localAssetIds }) => localAssetIds), canonicalCollateralAssets.map(({ assetId }) => assetId))
  && sameUniqueStringSet(canonicalFacility.collateralAssetIds, canonicalCollateralAssets.map(({ assetId }) => assetId))
  && canonicalBorrowerCollateralStateExample.debtContractState.securityAgreementVersion.trim().length > 0
  && canonicalBorrowerCollateralStateExample.debtContractState.applicableInsolvencyLawVersion.trim().length > 0
  && canonicalCrosswalk.every(({ mappingBasis, securityAgreementVersion }) => mappingBasis === 'synthetic-decomposition-for-3.11' && securityAgreementVersion === canonicalBorrowerCollateralStateExample.debtContractState.securityAgreementVersion);
const requiredFrozenContractProvenance = [
  ['facilities[0].facilityId', 'loanContractPassport.contractId'],
  ['facilities[0].lenderId', 'loanContractPassport.lenderLegalEntityId'],
  ['facilities[0].borrowerLegalEntityId', 'loanContractPassport.borrowerId'],
  ['facilities[0].commitmentAmount', 'loanContractPassport.commitmentAmount'],
  ['facilities[0].drawnAmount', 'loanContractPassport.drawnAmount'],
  ['facilities[0].drawCapSourceTerm', 'loanOfferState.nonpriceTerms'],
  ['financingDecisionState.requested', 'loanContractPassport.applicationAmount'],
  ['financingDecisionState.approved', 'loanContractPassport.approvedAmount'],
  ['financingDecisionState.committed', 'loanContractPassport.commitmentAmount'],
  ['financingDecisionState.drawn', 'loanContractPassport.drawnAmount'],
  ['financingDecisionState.outstanding', 'loanContractPassport.outstandingAmount'],
  ['externalFinancePremiumState.nominalOfferRate', 'loanOfferState.nominalOfferRatePctPointsPerYear'],
  ['externalFinancePremiumState.annualisedFees', 'loanOfferState.annualisedFeePctPointsPerYear'],
  ['externalFinancePremiumState.allInExternalCost', 'loanOfferState.allInOfferRatePctPointsPerYear'],
  ['externalFinancePremiumState.matchedBenchmarkRate', 'loanOfferState.benchmarkRate'],
] as const;
const requiredSyntheticEnrichmentFields = ['collateralLineageCrosswalk', 'securityAgreementVersion', 'facilities[0].borrowingBaseRuleVersion', 'facilities[0].maxLTVTreatment', 'facilities[0].maxDebtToEBITDA', 'facilities[0].minICR', 'facilities[0].minDSCR', 'constraintStackState.debt-service-coverage.paymentFrequency', 'constraintStackState.debt-service-coverage.amortisationTermMonths'] as const;
const canonicalContractProvenance = canonicalBorrowerCollateralStateExample.debtContractState.fieldProvenance;
const canonicalContractProvenanceGate = canonicalContractProvenance.length === requiredFrozenContractProvenance.length + requiredSyntheticEnrichmentFields.length
  && sameUniqueStringSet(canonicalContractProvenance.map(({ fieldPath }) => fieldPath), [...requiredFrozenContractProvenance.map(([fieldPath]) => fieldPath), ...requiredSyntheticEnrichmentFields])
  && requiredFrozenContractProvenance.every(([fieldPath, upstreamFieldPath]) => canonicalContractProvenance.some((entry) => entry.fieldPath === fieldPath && entry.provenance === 'frozen-from-3.10' && entry.upstreamFieldPath === upstreamFieldPath))
  && requiredSyntheticEnrichmentFields.every((fieldPath) => canonicalContractProvenance.some((entry) => entry.fieldPath === fieldPath && entry.provenance === 'synthetic-3.11-enrichment' && entry.upstreamFieldPath === null));
const canonicalFedPassports = canonicalBorrowerCollateralStateExample.dynamicDataPassports.filter(({ provider }) => provider === 'Federal Reserve');
const requiredFedPassportRows = [
  { sourceId: 'FED_Z1_S11_1_B', tableSeriesOrItem: 'S11.1.b', frequency: 'quarterly stock; amounts outstanding at end of period; not seasonally adjusted', unit: 'USD billions; ratios in percent only where the line is explicitly labelled', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_b.htm', requiredFlag: 'END_OF_PERIOD_STOCK' },
  { sourceId: 'FED_Z1_S11_1_T', tableSeriesOrItem: 'S11.1.t', frequency: 'quarterly flow; seasonally adjusted annual rate unless the table or line note states otherwise', unit: 'USD billions at seasonally adjusted annual rates unless the line note states otherwise', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_t.htm', requiredFlag: 'SAAR_FLOW_NOT_QUARTER_AMOUNT' },
  { sourceId: 'FED_Z1_S11_1_R', tableSeriesOrItem: 'S11.1.r', frequency: 'quarterly change-in-net-worth bridge; not seasonally adjusted', unit: 'USD billions', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_r.htm', requiredFlag: 'NOT_SEASONALLY_ADJUSTED' },
  { sourceId: 'FED_Z1_S11_1_I_A', tableSeriesOrItem: 'S11.1.i.a', frequency: 'annual', unit: 'USD billions and ratios only where explicitly labelled', methodologyURL: 'https://www.federalreserve.gov/releases/z1/current/html/S11_1_i_a.htm', requiredFlag: 'ANNUAL_NOT_QUARTERLY' },
] as const;
const canonicalFedPassportGate = sameUniqueStringSet(canonicalFedPassports.map(({ tableSeriesOrItem }) => tableSeriesOrItem), requiredFedPassportRows.map(({ tableSeriesOrItem }) => tableSeriesOrItem))
  && canonicalFedPassports.every(({ missingAndBreakFlags }) => missingAndBreakFlags.includes('LIVE_REFRESH_REQUIRED') && missingAndBreakFlags.includes('NOT_CONTRACT_LEVEL'))
  && requiredFedPassportRows.every((expected) => canonicalFedPassports.some((passport) => passport.sourceId === expected.sourceId
    && passport.tableSeriesOrItem === expected.tableSeriesOrItem
    && passport.frequency === expected.frequency
    && passport.unit === expected.unit
    && passport.methodologyURL === expected.methodologyURL
    && passport.missingAndBreakFlags.includes(expected.requiredFlag)));
const canonicalBorrowerCollateralRuntimeCoverage = Object.keys(canonicalBorrowerCollateralStateExample).length === canonicalBorrowerCollateralFields.length
  && canonicalBorrowerCollateralFields.every((field) => Object.prototype.hasOwnProperty.call(canonicalBorrowerCollateralStateExample, field))
  && canonicalBorrowerCollateralStateExample.inputLineage.length === 2
  && canonicalBorrowerCollateralStateExample.inputLineage[1]?.stateId === canonicalBankLendingStateExample.stateId
  && canonicalBorrowerCollateralStateExample.debtContractState.facilities[0]?.facilityId === upstreamLoanContract.contractId
  && canonicalFacility.borrowerLegalEntityId === upstreamLoanContract.borrowerId
  && canonicalFacility.lenderId === upstreamLoanContract.lenderLegalEntityId
  && almostEqual(valueOf(canonicalFacility.commitmentAmount), upstreamLoanContract.commitmentAmount?.amount ?? Number.NaN)
  && almostEqual(valueOf(canonicalFacility.drawnAmount), upstreamLoanContract.drawnAmount?.amount ?? Number.NaN)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.financingDecisionState.requested), upstreamLoanContract.applicationAmount?.amount ?? Number.NaN)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.financingDecisionState.approved), upstreamLoanContract.approvedAmount?.amount ?? Number.NaN)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.financingDecisionState.committed), upstreamLoanContract.commitmentAmount?.amount ?? Number.NaN)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.financingDecisionState.drawn), upstreamLoanContract.drawnAmount?.amount ?? Number.NaN)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.financingDecisionState.outstanding), upstreamLoanContract.outstandingAmount?.amount ?? Number.NaN)
  && almostEqual(canonicalAssetTotal, 1000)
  && almostEqual(canonicalLiabilityTotal, 700)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.netWorth), canonicalAssetTotal - canonicalLiabilityTotal)
  && almostEqual(valueOf(canonicalNetDebt.netDebt), valueOf(canonicalNetDebt.grossDebtIncluded) - valueOf(canonicalNetDebt.unrestrictedCashDeduction) - valueOf(canonicalNetDebt.otherPermittedDeductions))
  && almostEqual(valueOf(canonicalNetDebt.netDebt), 90)
  && almostEqual(valueOf(canonicalReconciliation.closingNetWorth), valueOf(canonicalReconciliation.openingNetWorth) + valueOf(canonicalReconciliation.netSaving) + valueOf(canonicalReconciliation.netCapitalTransfers) + valueOf(canonicalReconciliation.holdingGainsLosses) + valueOf(canonicalReconciliation.otherVolumeChanges))
  && almostEqual(valueOf(canonicalReconciliation.closingNetWorth), valueOf(canonicalBorrowerCollateralStateExample.borrowerBalanceSheetState.netWorth))
  && canonicalCollateralRightsGate
  && canonicalCollateralCrosswalkGate
  && canonicalContractProvenanceGate
  && canonicalFacility.borrowingBaseRuleVersion !== null
  && canonicalFacility.borrowingBaseRuleVersion.trim().length > 0
  && canonicalCollateralAssets.every(({ eligibilityRuleId }) => eligibilityRuleId === canonicalFacility.borrowingBaseRuleVersion)
  && new Set(canonicalCollateralAssets.map(({ assetId }) => assetId)).size === canonicalCollateralAssets.length
  && almostEqual(canonicalCollateralTotal, 97)
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.collateralPoolState.incrementalCollateralHeadroom), canonicalCollateralTotal - valueOf(canonicalBorrowerCollateralStateExample.collateralPoolState.currentFacilityDrawn))
  && almostEqual(valueOf(canonicalFacility.undrawnAmount), valueOf(canonicalFacility.commitmentAmount) - valueOf(canonicalFacility.drawnAmount))
  && valueOf(canonicalFacility.drawnAmount) <= valueOf(canonicalFacility.commitmentAmount)
  && canonicalFacility.drawCapSourceTerm === upstreamLoanOffer.nonpriceTerms?.find((term) => term === '80% draw cap')
  && canonicalFacility.drawCapInterpretation === 'hard-maximum-share-of-commitment'
  && almostEqual(valueOf(canonicalFacility.maximumPermittedDrawAmount ?? synAmount(Number.NaN, 'missing')), valueOf(canonicalFacility.commitmentAmount) * (canonicalFacility.drawCapRatio ?? Number.NaN))
  && almostEqual(valueOf(canonicalFacility.usableUndrawnAmount ?? synAmount(Number.NaN, 'missing')), Math.max(0, valueOf(canonicalFacility.maximumPermittedDrawAmount ?? synAmount(Number.NaN, 'missing')) - valueOf(canonicalFacility.drawnAmount)))
  && canonicalFacility.maxLTVRatio === null
  && canonicalFacility.maxLTVTreatment === 'embedded-in-borrowing-base'
  && canonicalConstraintIdGate
  && canonicalConstraintConversionGate
  && canonicalConstraints.every(({ targetBorrowerLegalEntityId, targetFacilityId, targetPrincipalConcept, targetHorizon, decisionTime, convertedIncrementalPrincipalHeadroom }) => targetBorrowerLegalEntityId === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.borrowerLegalEntityId && targetFacilityId === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.facilityId && targetPrincipalConcept === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.principalConcept && targetHorizon === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.horizon && decisionTime === canonicalBorrowerCollateralStateExample.constraintStackState.mappingTarget.decisionTime && convertedIncrementalPrincipalHeadroom.currency === 'SYN')
  && almostEqual(valueOf(canonicalConstraints.find(({ constraintId }) => constraintId === 'collateral')?.signedNativeHeadroom ?? synAmount(Number.NaN, 'missing')), valueOf(canonicalBorrowerCollateralStateExample.collateralPoolState.incrementalCollateralHeadroom))
  && almostEqual(valueOf(canonicalConstraints.find(({ constraintId }) => constraintId === 'earnings')?.signedNativeHeadroom ?? synAmount(Number.NaN, 'missing')), (canonicalFacility.maxDebtToEBITDA ?? Number.NaN) * valueOf(canonicalBorrowerCollateralStateExample.cashFlowState.contractAdjustedEBITDA) - valueOf(canonicalNetDebt.netDebt))
  && almostEqual(valueOf(canonicalConstraints.find(({ constraintId }) => constraintId === 'interest-coverage')?.signedNativeHeadroom ?? synAmount(Number.NaN, 'missing')), valueOf(canonicalBorrowerCollateralStateExample.cashFlowState.contractAdjustedEBITDA) / (canonicalFacility.minICR ?? Number.NaN) - valueOf(canonicalBorrowerCollateralStateExample.cashFlowState.interestExpense))
  && almostEqual(valueOf(canonicalConstraints.find(({ constraintId }) => constraintId === 'debt-service-coverage')?.signedNativeHeadroom ?? synAmount(Number.NaN, 'missing')), valueOf(canonicalBorrowerCollateralStateExample.cashFlowState.cashFlowAvailableForDebtService) / (canonicalFacility.minDSCR ?? Number.NaN) - valueOf(canonicalBorrowerCollateralStateExample.cashFlowState.interestExpense) - valueOf(canonicalBorrowerCollateralStateExample.cashFlowState.scheduledPrincipal))
  && almostEqual(valueOf(canonicalConstraints.find(({ constraintId }) => constraintId === 'committed-undrawn')?.signedNativeHeadroom ?? synAmount(Number.NaN, 'missing')), valueOf(canonicalFacility.usableUndrawnAmount ?? synAmount(Number.NaN, 'missing')))
  && almostEqual(valueOf(canonicalBorrowerCollateralStateExample.constraintStackState.bindingCapacity), bindingMinimum)
  && bindingIds.join('|') === canonicalBorrowerCollateralStateExample.constraintStackState.bindingConstraintIds.join('|')
  && almostEqual(canonicalEfp.nominalOfferRate.valuePctPointsPerYear, upstreamLoanOffer.nominalOfferRatePctPointsPerYear ?? Number.NaN)
  && almostEqual(canonicalEfp.annualisedFees.valuePctPointsPerYear, upstreamLoanOffer.annualisedFeePctPointsPerYear ?? Number.NaN)
  && almostEqual(canonicalEfp.allInExternalCost.valuePctPointsPerYear, upstreamLoanOffer.allInOfferRatePctPointsPerYear ?? Number.NaN)
  && almostEqual(canonicalEfp.matchedBenchmarkRate.valuePctPointsPerYear, upstreamLoanOffer.benchmarkRate?.valuePctPointsPerYear ?? Number.NaN)
  && almostEqual(canonicalEfp.allInExternalCost.valuePctPointsPerYear, (canonicalEfp.nominalOfferRate.valuePctPointsPerYear ?? Number.NaN) + (canonicalEfp.annualisedFees.valuePctPointsPerYear ?? Number.NaN))
  && almostEqual(canonicalEfp.observableAllInSpreadPctPoints, (canonicalEfp.allInExternalCost.valuePctPointsPerYear ?? Number.NaN) - (canonicalEfp.matchedBenchmarkRate.valuePctPointsPerYear ?? Number.NaN))
  && almostEqual(canonicalEfp.borrowerExternalFinancePremiumPctPoints, (canonicalEfp.allInExternalCost.valuePctPointsPerYear ?? Number.NaN) - (canonicalEfp.internalFinanceOpportunityCost?.valuePctPointsPerYear ?? Number.NaN))
  && almostEqual(valueOf(canonicalFinancingDecision.totalExternalFinanceChange), [-30, 10, 5, 3, 0].reduce((sum, value) => sum + value, 0))
  && almostEqual(valueOf(canonicalFinancingDecision.postCashResourceChange), valueOf(canonicalFinancingDecision.totalExternalFinanceChange) + valueOf(canonicalFinancingDecision.internalCashUse))
  && almostEqual(valueOf(canonicalFinancingDecision.remainingResourceShortfall), Math.max(0, -valueOf(canonicalFinancingDecision.postCashResourceChange)))
  && canonicalPublicationGate
  && canonicalBorrowerCollateralStateExample.auditTimestamps.eventTime <= canonicalBorrowerCollateralStateExample.auditTimestamps.valuationTime
  && canonicalBorrowerCollateralStateExample.auditTimestamps.valuationTime <= canonicalBorrowerCollateralStateExample.auditTimestamps.decisionTime
  && canonicalBorrowerCollateralStateExample.auditTimestamps.decisionTime < canonicalBorrowerCollateralStateExample.auditTimestamps.outcomeWindowStart
  && canonicalBorrowerCollateralStateExample.identificationState.identificationStatus === 'descriptive'
  && canonicalBorrowerCollateralStateExample.dynamicDataPassports.length === 6
  && canonicalFedPassportGate
  && canonicalBorrowerCollateralStateExample.measurementFlags.some(({ flag }) => flag === 'synthetic')
  && canonicalBorrowerCollateralStateExample.boundaryRoutes.length === 7;

if (!canonicalBorrowerCollateralRuntimeCoverage) {
  throw new Error('3.11 canonical borrower-collateral contract failed its lineage, arithmetic, rights, timing or identification gate.');
}

const conceptSections: ConceptSection[] = [
  {
    id: 'scope-passport', number: 2, label: 'Borrower Scope Passport',
    title: '在计算任何净值或借款容量之前，先回答：究竟是哪一个法律实体在借款？',
    paragraphs: [
      '“这家公司有一栋楼”在经济叙述里可能足够，在融资合同里却远远不够。借款主体可能是运营子公司，楼宇可能由母公司、项目公司或创始人个人持有；合并报表把集团资源放在一张表上，却不会自动把每项资产变成子公司的可执行担保。第一步因此不是套公式，而是固定借款法律实体、保证人、合并口径、居民身份、报告币种与适用法域。',
      '范围护照还防止分母漂移。企业层净值、集团层 EBITDA、项目公司债务与母公司现金若被拼在一起，LTV、Debt/EBITDA 和 DSCR 都可能看似精确却没有合同含义。一个可复核状态必须让资产、负债、现金流、担保权和结果变量指向同一责任边界；需要集团支持时，必须另存保证、交叉违约或现金上划安排，而不是默认为可得。',
    ],
    sourceIds: [5, 7, 8, 27],
    formula: { label: '范围先于计算', expression: 'Borrowing entity ≠ accounting group ≠ asset owner ≠ economic user', note: '四者可以相同，也可以完全不同；只有合同和法律安排能建立可执行连接。' },
    boundary: '银行一侧的贷款要约和审批由 3.10 交付；本章只读取其 borrower、lender、contract 与 decision time，不重写银行决策。',
  },
  {
    id: 'asset-ownership', number: 3, label: 'Ownership / Use / Lease',
    title: '资产的使用权、收益权与法律所有权可以分离；正在使用不等于能够质押。',
    paragraphs: [
      '企业通过租赁、代工、特许或供应链安排使用大量生产性资源。它们能够创造收入，却未必在借款人财产范围内；反过来，企业拥有但已出租、受信托限制或位于另一法域的资产，也未必能即时用于新贷款。抵押渠道必须从法律所有权与处分权出发，而不能从厂房里“看得见的机器”或财务报表上的使用权资产直接推断。',
      '租赁还会改变融资与投资的观测形式。低净值企业可能租而不买，以减少前期抵押容量占用；若研究者只观察固定资产购买，会把融资方式替代误作生产能力下降。因而资产护照要同时保存 legalOwnerId、economicUserId、租赁合同、担保限制和资产所在地，并在真实支出端把购买、租赁与服务采购分开。',
    ],
    sourceIds: [5, 7, 8, 14],
    formula: { label: '权利门', expression: 'Candidate asset → ownership/transferability/perfection/enforcement gates → eligible collateral', note: '任何一道必要门失败，本设施中的贡献可以为零，即使经济价值很高。' },
  },
  {
    id: 'net-worth-identity', number: 4, label: 'Assets / Liabilities / Net Worth',
    title: '净值是同一估值边界内资产减负债的剩余；固定名义负债会放大资产损失对净值的百分比冲击。',
    paragraphs: [
      '最小恒等式是 N=A−L。它看似简单，却规定了正确的冲击入口：若地产只占总资产 40%，地产价格下降 10% 会使总资产下降 4%；若负债名义额暂时不变，这 4% 的总资产损失全部由更小的净值吸收。资产 1000、负债 700、净值 300 的企业因此从 300 降至 260，净值损失率是 13.33%，而不是 10% 或 4%。',
      '这一步只是一条机械重估桥。它没有说明债权人是否立即重估抵押物、企业是否需要融资、银行是否改变报价，也没有证明投资会下降。专业分析应先把金额恒等式算对，再逐道检验权利、合同、替代与行为门；把恒等式直接写成因果效应，会跳过本章最重要的机制。',
    ],
    sourceIds: [1, 2, 27, 37],
    formula: { label: '带计量护照的净值', expression: 'Nₜ = Σ Aₐ,ₜ⁽ᵇᵃ⁾ − Σ Lⱼ,ₜ⁽ᵇʲ⁾', note: '报表可以按声明准则汇总不同计量基础；结果只能称该准则下的账面或混合口径权益，不能冒充统一 market、appraisal、liquidation 或 recovery 基准的净值。' },
    after: <NetWorthRevaluationLab />,
  },
  {
    id: 'valuation-bases', number: 5, label: 'Book / Market Value',
    title: '账面净值、市场净值与合同估值回答不同问题；没有一种价值可以支配所有决策。',
    paragraphs: [
      '账面价值服务会计确认与历史交易记录，市场价值反映边际交易者对可交易索取权的定价，评估价值按特定方法和日期服务合同测试。设备可能按折旧成本入账，土地按市场估计，负债按摊余成本或公允价值记录；这种按声明准则形成的混合计量报表可以计算账面权益，但若不保留逐项 basis，就不能把结果改称统一市场净值、评估净值或回收净值。C1 明确标为 SYNTHETIC mixed-basis snapshot，只用于演示报表重估桥。',
      '市场价格快速变动也不会自动在所有合同中同步生效。贷款契约可能使用季度财报、年度评估、价格指数或触发式重估；某些价值上升不被认可，下降却触发补充评估。应保存 valuationMethod、observationTime、appraisalTime、baseDate 和 ruleVersion，才能判断价格冲击何时、以何种非线性进入借款容量。',
    ],
    sourceIds: [3, 12, 27, 37],
    formula: { label: '多价值并存', expression: 'book value ≠ market value ≠ appraisal value ≠ liquidation value ≠ expected recovery', note: '差异不是误差的同义词；它们来自不同目的、时点、出售情景与权利顺位。' },
  },
  {
    id: 'net-worth-versus-liquidity', number: 6, label: 'Net Worth / Liquidity',
    title: '正净值企业仍可能无法支付工资；流动性充足企业也可能资不抵债。',
    paragraphs: [
      '净值是存量剩余，流动性是按时获得可用支付手段的能力。企业拥有大量专用设备和土地时可以有正的经济净值，却因应收回款延迟、债务到期集中或授信被冻结而缺少现金；相反，严重负净值企业也可能靠宽限期、股东支持或新增融资暂时维持支付。两者相关，但不存在一一映射。',
      '这种区分决定真实支出的先后顺序。现金短缺通常先打击营运资本、库存补充和工资单，而长期净值恶化可能通过代理成本、偿债容量与投资选择持续影响资本开支。研究若只用现金持有代表净值，或只用账面净值代表即时支付能力，会把不同时间尺度的约束混在一起。',
    ],
    sourceIds: [1, 6, 27, 38, 55],
    formula: { label: '两种状态', expression: 'Solvency: A−L; Liquidity: available cash and committed funding versus dated payments', note: '前者没有支付日历；后者没有完整终值。二者必须分别建模。' },
  },
  {
    id: 'eligible-collateral', number: 7, label: 'Candidate / Eligible Collateral',
    title: '有经济价值只是候选资格；只有满足合同与法律门槛的资产才进入可质押池。',
    paragraphs: [
      '候选资产首先要属于借款人或有效保证人，然后还要可识别、可转让、可登记、无禁止处分条款，并满足贷款合同关于账龄、地理、币种、集中度和资产类别的规则。逾期应收、关联方应收、易腐库存或已出售资产即使账面仍有余额，也可能被排除。合格比例因此是逐项审查结果，而不是对总资产统一打折。',
      '还要区分借款人法下可质押与银行监管资本下可认可。Basel 的信用风险缓释规则回答银行资本计量能否承认某类担保；当地担保法回答借款人能否设立、完成对抗并在破产中维持该权利。两套规则可能交叉，却不是同一资格表，不能互相替代。',
    ],
    sourceIds: [7, 8, 31, 32],
    formula: { label: '资产级资格', expression: 'eligible valueₐ = appraised valueₐ × eligible shareₐ, only after legal and contractual gates pass', note: '总资产合格率会掩盖哪一项失败，也无法审计重复质押。' },
  },
  {
    id: 'collateral-value-ladder', number: 8, label: 'Value Ladder',
    title: '市场价到回收额之间隔着时间、出售方式、执行成本和债权顺位。',
    paragraphs: [
      '市场价值通常假设正常交易与边际买方；评估价值来自指定日期与方法；清算价值考虑压缩出售期和资产专用性；预期回收还要扣执行、保管、税费、诉讼、优先债权和回收时滞。对债权人而言，真正相关的不是“现在有人愿意付多少”，而是在违约状态、既定顺位和可执行程序下能取得多少现值。',
      '这条价值阶梯具有状态依赖。行业繁荣时二手设备容易转售，衰退时同业买家同时缺钱；法庭拥堵或破产规则变化会延长回收期；跨境资产还叠加汇率、登记与承认问题。因此 recovery value 应是带情景、时点和法域的估计，而不是一个从 market value 永久固定折扣得到的常数。',
    ],
    sourceIds: [5, 8, 12, 26, 41],
    formula: { label: '价值阶梯', expression: 'market → appraisal → liquidation → gross recovery → recovery net of senior claims and enforcement costs', note: '每一步都需要独立定义；若合同直接规定某一步，就不要重复扣减同一风险。' },
  },
  {
    id: 'liens-and-priority', number: 9, label: 'Liens / Priority / Encumbrance',
    title: '同一资产上的更优先请求权决定剩余担保覆盖；重复把全部价值分配给多项贷款会虚构容量。',
    paragraphs: [
      '一项资产可以存在第一顺位担保、税收留置、供应商保留所有权、租赁权或交叉担保。新贷款人只对其顺位之后的剩余回收拥有请求权；若现有第一顺位债权已覆盖大部分价值，资产“有价值”并不意味着新增担保容量大。顺位还可能因登记失败、法定优先权或破产撤销规则而改变。',
      '组合数据必须建立 assetId—facilityId—lienRank 映射，并对每项资产进行全局重复质押检查。若一个 100 的仓库被两个系统各按 70 计入借款基础，企业层汇总会得到 140 的伪容量。正确做法不是在最后统一减一个模糊的“其他债务”，而是逐资产、逐顺位分配可回收额。',
    ],
    sourceIds: [5, 7, 8, 12],
    formula: { label: '剩余顺位价值', expression: 'residual collateralₐ = max(0, eligible secured valueₐ − prior senior claimsₐ − enforcement costsₐ)', note: '顺位是权利序列，不是平均损失率；同一优先债权只能扣一次。' },
  },
  {
    id: 'haircut-advance-rate', number: 10, label: 'Haircut / Advance Rate',
    title: 'Haircut 与 advance rate 是把资产价值映射为可贷值的合同参数；互为补数时只能使用一次。',
    paragraphs: [
      'Haircut 表示价值中不被计入的比例，advance rate 表示可计入贷款基础的比例。在最简单定义下 m=1−h；若先乘 (1−h) 又乘一个其实等于 1−h 的 advance rate，就把同一保护重复折价。现实合同还可能分别设置估值折扣、账龄折扣、币种折扣和 advance rate，只有合同明确表明它们针对不同风险时才可串联。',
      '折扣并非纯粹描述资产波动，也包含处置时滞、相关性、集中度和操作风险。它可以随资产类别、借款人报告质量与市场状态变化。因而计算器必须展示每一步、保存 ruleVersion，并在比率不属于 [0,1]、币种不一致或估值过期时停止，而不是自动修正为看似合理的数值。',
    ],
    sourceIds: [7, 12, 13, 32],
    formula: { label: '一次折价原则', expression: 'eligible secured value = V_app × eligible share × advance rate; if advance rate=1−haircut, do not multiply both', note: '多个独立折扣存在时，要逐项命名并证明没有覆盖同一风险。' },
  },
  {
    id: 'asset-redeployability', number: 11, label: 'Specificity / Redeployability',
    title: '可再部署性决定违约后是否存在真实买方，因此同样账面值可以支持完全不同的债务。',
    paragraphs: [
      '标准化车辆、通用机器和活跃交易的飞机通常比定制生产线、品牌专用装修或偏远厂房更容易转售。潜在买方越多、拆卸运输成本越低、二级市场越深，债权人越可能获得较高回收，因而允许更高 LTV 或更低利差。资产专用性把生产效率和融资能力连接起来，却不等于会计“有形性”。',
      '可再部署性还随行业周期变化：同业共同受冲击时，最懂资产的买家同时成为受限者，繁荣期估计的回收率便可能失效。经验研究可以用二手市场交易、同型资产运营者数量或跨用途能力做代理，但必须说明代理与真实回收之间的距离，不能把资产类型固定效应当作直接测量。',
    ],
    sourceIds: [5, 12, 26, 41],
    formula: { label: '回收买方集合', expression: 'recoverable value rises with feasible buyer depth and falls with conversion, transport and delay costs', note: '这是方向性机制，不是跨行业通用的线性定价公式。' },
  },
  {
    id: 'legal-enforceability', number: 12, label: 'Jurisdiction / Enforcement',
    title: '担保品只有在正确实体、资产所在地、登记制度、顺位与破产法版本下才具有可执行意义。',
    paragraphs: [
      '担保权通常需要明确资产描述、有效设立并完成对第三人的对抗；动产登记、不动产登记、账户控制或所有权保留的规则不同。资产位于另一法域时，还会出现法律选择、判决承认与跨境执行问题。一个数据库中的 collateral flag 无法替代这些权利信息，更不能证明贷款人最终可优先受偿。',
      '制度改变既可能扩大可用于担保的资产菜单，也可能强化清算权并改变企业行为。更强执行未必在所有状态都简单增加借款：企业可能减少担保债务、提高现金或回避高清算风险。因此本章把法律规则视为可承诺资源和事后回收的共同约束，并拒绝“法律更强必然信贷更多”的单调外推。',
    ],
    sourceIds: [7, 8, 30, 33, 42, 43],
    formula: { label: '法域键', expression: 'security right = owner × borrower × asset location × registry × lien rank × insolvency-law version', note: '任一键缺失都应返回 unknown/pending，而不是默认 enforceable。' },
  },
  {
    id: 'valuation-contract-clocks', number: 13, label: 'Valuation / Contract / Outcome Clocks',
    title: '价格冲击、评估更新、契约测试、融资决定与真实支出发生在不同时间。',
    paragraphs: [
      '上市资产价格可以分钟级变动，商业地产评估可能按季度或年度更新，契约只在报告日测试，贷款委员会又在申请日使用当时已公开的财务数据。企业随后才调整库存、招聘和资本开支。若把这些时钟压成同一个月份，就会使用未来数据解释过去决定，或把支出领先误作融资结果。',
      '最小时间护照应保存 eventTime、valuationTime、appraisalTime、financialStatementPeriodEnd、publicationTime、revisionTime、contractTestTime、decisionTime 与 outcomeWindow。任何 publicationTime 晚于 decisionTime 的数据都不得进入当时信息集；评估滞后本身可以是机制，却不能通过回填最新值被悄悄消除。',
    ],
    sourceIds: [21, 22, 27, 37],
    formula: { label: '时间有向图', expression: 'shock → valuation/appraisal → contract test → financing decision → outcome window', note: '箭头要求当时可得信息与严格先后；同日仍需更细时间戳或明确同时性假设。' },
  },
  {
    id: 'net-worth-reconciliation', number: 14, label: 'Transactions / Revaluation / Other Volume',
    title: '净值期际变化要区分交易积累、资产重估和其他数量变化，才能知道冲击从哪里进入。',
    paragraphs: [
      '净值桥应把净储蓄、净资本转移、持有损益与其他数量变化分开。借款初始通常同时增加现金和负债，资本开支通常只是现金换成固定资产；在没有费用、折价或其他对应项时，两者都不直接改变净值。市场价格与汇率变化进入持有损益，灾害毁损、核销、统计重分类或实体边界改变进入其他数量变化。期末减期初虽给出总差额，却不能说明变化来自经营积累、估值还是边界。',
      '这种分解尤其重要，因为借款人渠道关心净值变化的来源与可预见性。同样减少 20 的净值，意外资产重估、持续经营亏损和一次性资产剥离对未来现金流、抵押价值和代理问题的含义不同。官方部门账户可帮助完成会计桥，但部门总量不提供企业合同、担保顺位或因果反事实。',
    ],
    sourceIds: [27, 37],
    formula: { label: '净值桥', expression: 'Nₜ−Nₜ₋₁ = net saving + net capital transfers + holding gains/losses + other-volume changes', note: '借款和资本开支不是天然的净值增减项；必须记录资产与负债两端的对应分录。分解还要求同一实体边界。' },
  },
  {
    id: 'internal-external-finance', number: 15, label: 'Internal / External Finance',
    title: '内部资金和外部资金并非无摩擦替代；但内部现金也有机会成本和未来保险价值。',
    paragraphs: [
      '内部资金不需要向外部投资者证明项目质量，也不必支付发行、监督与契约成本，因此融资摩擦模型通常让它比外部资金更便宜。净值和现金越充足，企业越能自筹投资或向债权人投入“skin in the game”，减少激励冲突；这也是为什么资产负债表状态会进入融资条件。',
      '然而现金不是免费资金。用掉一元现金会损失利息、税收选择、收购机会和应对下一次冲击的保险价值；股东资金也有机会成本。只有明确内部资金的边际机会成本，才能估计借款人外部融资溢价；如果没有，最多报告可观测的全口径贷款 spread，不能把基准差额冒充理论楔子。',
    ],
    sourceIds: [1, 6, 15, 18, 38],
    formula: { label: '融资来源', expression: 'resource for spending = internal funds used + total external finance obtained', note: '内部资金使用位于外部融资变化之后的资源桥，不应被加回“外部融资总额”。' },
  },
  {
    id: 'external-finance-premium', number: 16, label: 'External Finance Premium',
    title: '外部融资溢价是同一借款人边际外部资金成本相对边际内部资金机会成本的楔子。',
    paragraphs: [
      '理论上的 EFP 来自信息、监督、激励与执行摩擦：外部出资人不能像企业内部人那样无成本观察和控制项目，因此要求补偿或限制数量。借款人净值越低、外部融资占项目越高，模型中的代理问题通常越严重，EFP 便可能上升。这一方向是金融加速器的核心，却不是每家公司、每个状态都必然线性成立。',
      '实务中容易观测的是名义利率、费用及相对匹配基准的 spread。银行报价还包含银行资金、资本、流动性、运营和目标回报；内部资金机会成本往往不可直接观察。因此必须把 all-in external cost、observable spread 与 model-estimated EFP 分三栏，并保存币种、期限、复利、年化和风险口径。',
    ],
    sourceIds: [1, 2, 4],
    formula: { label: '三个价格对象', expression: 'c_ext=r_offer+annualised fees; spread_obs=c_ext−r_benchmark; EFP=c_ext−c_internal', note: '只有第三式中的内部机会成本被明确定义且可比较时，输出才可命名为 EFP。' },
    after: <><span aria-hidden="true" id="observable-versus-latent" /><ExternalFinancePremiumLab /></>,
  },
  {
    id: 'costly-state-verification', number: 17, label: 'Costly State Verification',
    title: '当项目结果只能付出成本才能核查时，标准债务式契约可以节省普遍监督。',
    paragraphs: [
      '借款人比外部出资人更了解项目结果时，如果每种状态都要核查，融资会十分昂贵。Costly state verification 模型让借款人在正常状态支付固定承诺，只有无法支付时才触发核查与控制权转移，从而解释债务式契约、违约门槛和监督成本为什么出现。净值越高，所需外部融资与预期核查成本通常越低。',
      '这是一个抽象契约原语，不是对现实贷款流程的完整描述。审计费、财务报告、抵押评估、银行监控和破产执行可能分属不同成本；现实合同也可能包含股权、可转债和多重契约。使用模型时应明确哪一类私人信息和核查技术被假设，而不能把所有 spread 都归因于验证成本。',
    ],
    sourceIds: [1, 2, 11],
    formula: { label: '核查摩擦', expression: 'reported payoff is private; verification reveals payoff at real resource cost', note: '最优合同结论依赖风险中性、承诺与核查结构等条件，不是无条件制度定律。' },
  },
  {
    id: 'hidden-action-incentives', number: 18, label: 'Hidden Action / Incentive Compatibility',
    title: '债务融资后借款人可能改变努力、风险与资产处置；可承诺偿付因此小于项目全部价值。',
    paragraphs: [
      '当外部出资人不能完整观察行动时，高杠杆可能诱发风险转移、努力不足、资产替换或把现金转移给股东。贷款人会要求借款人保留足够净值、限制分红和新增负债、设置抵押与信息契约，确保借款人在成功与失败状态都承担足够后果。融资上限由激励相容决定，而不只是项目的期望净现值。',
      '净值在这里是一种承诺装置：它让借款人自身财富与项目结果绑定。但会计净值不必等于真正“at risk”的财富，受保护资产、有限责任、集团转移和政府担保都会改变激励。研究者应寻找契约和控制权证据，而不是仅凭杠杆高就断言隐藏行动主导。',
    ],
    sourceIds: [5, 6, 17, 18],
    formula: { label: '激励相容', expression: 'borrower payoff from prescribed action ≥ payoff from feasible deviation', note: '可承诺收入是满足该不等式后可交给外部投资者的部分。' },
  },
  {
    id: 'adverse-selection-rationing', number: 19, label: 'Adverse Selection / Rationing',
    title: '提高利率会改变申请者与行为构成，所以贷款价格未必能够无限上调并清空市场。',
    paragraphs: [
      '贷款人无法完全观察借款人类型时，更高利率可能让安全项目退出、留下收益高但失败概率也高的项目；还可能诱发已获贷者选择更高风险。贷款人的预期回报因而可能在某个利率后下降，最优反应变成拒绝、缩减额度、提高抵押或改变期限，而不是继续加价。',
      '“存在拒贷”本身不证明均衡信贷配给，因为拒绝也可能来自负净现值、合规限制或银行容量。经验上应观察相似申请在价格、数量与非价格条款上的共同变化，并处理申请选择；只有模型条件与数据边际相符时，才可把结果解释为逆向选择或配给机制。',
    ],
    sourceIds: [4, 9, 51],
    formula: { label: '非单调回报', expression: 'lender expected return may fall when the quoted rate changes borrower type or risk choice', note: '“可能”取决于类型分布与行为反应；不是贷款利率存在普遍上限。' },
  },
  {
    id: 'pledgeable-income', number: 20, label: 'Limited Enforcement / Pledgeable Income',
    title: '即使项目有很高总价值，债权人只能依赖可被承诺、验证和执行的未来收入。',
    paragraphs: [
      '企业家可以隐藏收益、离开项目、转移资产或在违约后重谈时，债权人不能取得全部未来产出。融资容量受可承诺收入约束：只有违约状态下能够实际控制或通过持续关系激励偿还的部分，才可支持今天的资金。可质押收入因此包含法律执行与关系激励，而不只是实体抵押物。',
      '这一机制解释为何轻资产企业仍可凭稳定现金流借款，也解释为何高总资产企业在执行薄弱或收入难核实时受限。它同时提醒我们：资产型与收益型约束是两条不同路径。不能因为模型里都可写成 θ×未来价值，就在数据中把 EBITDA covenant 与地产 LTV 合并为同一变量。',
    ],
    sourceIds: [5, 6, 9, 10],
    formula: { label: '有限执行原语', expression: 'RₜBₜ₊₁ ≤ θₜ Eₜ[Vₜ₊₁ recoverable or pledgeable]', note: 'θ 的经济含义取决于模型：法律执行、可转移资产或激励约束不可混写。' },
  },
  {
    id: 'security-interest-recovery', number: 21, label: 'Security Interest / Recovery',
    title: '抵押不是把资产交给银行，而是预先安排违约后的控制权、优先权与回收路径。',
    paragraphs: [
      '正常履约时借款人通常继续使用资产；担保权的价值在于违约或触发事件后允许贷款人控制、出售或优先受偿。它可以降低损失、改善监督激励并扩大可承诺资源，也可能增加处置威胁和清算偏向。合同经济学关心的是状态依赖的控制权，而不是“银行已经拥有抵押物”的日常语言。',
      '回收率还依赖违约时点的余额、顺位、保证人、程序成本和宏观状态。银行的预期 LGD 是概率加权风险输入，借款人的可质押价值是合同容量输入；二者相关却不应共用一个字段。3.10 冻结银行端 LGD 与报价，本章重算借款人端权利和容量，下一章才让银行风险容忍度内生变化。',
    ],
    sourceIds: [5, 7, 8, 12],
    formula: { label: '状态控制权', expression: 'performing: borrower use; default/trigger: contractually defined control and priority rights activate', note: '激活仍受自动停止、重组与法庭程序限制；不得把合同文本等同最终回收。' },
  },
  {
    id: 'borrowing-base', number: 22, label: 'Borrowing Base',
    title: 'Borrowing base 是逐项资产通过资格、折扣、上限与顺位后的合同化总和。',
    paragraphs: [
      '资产支持型额度常按应收账款、库存或设备逐项计算。先确定合格份额，再应用价值折扣与 advance rate，随后施加单一债务人或资产类别 concentration cap，扣除先顺位债权与明确执行成本，最后跨资产相加。已提款余额从总借款基础中扣除，得到新增 collateral headroom。',
      '顺序会改变结果。应收 120、合格 80%、advance 75% 得 72；若 cap 为 60、先顺位为 20，贡献是 40，而不是 52。代码和讲义都必须展示操作顺序，并保存原始中间量；合同若规定不同顺序，应以规则版本为准，不能把教学公式当作全球统一条款。',
    ],
    sourceIds: [7, 8, 12, 31, 32],
    formula: { label: '资产贡献', expression: 'Pₐ=max[0, min(eₐ×mₐ×V_app, Capₐ)−SeniorLienₐ−EnforcementCostₐ]', note: '这是本章教学合同的顺序；真实应用必须先读取对应 facility 的规则文本。' },
    after: <PledgeableValueLab />,
  },
  {
    id: 'ltv-and-coverage', number: 23, label: 'LTV / Collateral Coverage',
    title: 'LTV 从债务看资产覆盖，coverage 从资产看债务；两者必须固定价值口径和债务范围。',
    paragraphs: [
      'LTV 通常写作债务除以合格抵押价值，coverage 则是合格抵押价值除以债务。80 的债务对应 100 的价值时，LTV 为 80%，coverage 为 1.25 倍；二者互为倒数只在分子分母完全相同且数值非零时成立。使用总债务、该设施余额、承诺额或预期违约暴露会得到不同指标。',
      '阈值也未必直接给出可新增本金。如果资产价值受 cap、顺位或多设施共享影响，必须先重算剩余池；若合同采用动态维持 LTV，还要说明何时测试、是否有 cure period 以及估值下降是否触发补充担保。LTV 是一种合同门，不是所有企业债务的普遍生成函数。',
    ],
    sourceIds: [9, 12, 21, 22],
    formula: { label: '同口径比率', expression: 'LTV = in-scope debt / in-scope eligible value; coverage = in-scope eligible value / in-scope debt', note: '报告比率时同时报告分子、分母、估值日、设施和法域。' },
  },
  {
    id: 'earnings-based-constraints', number: 24, label: 'Debt / EBITDA',
    title: '经营收益可以直接形成借款上限；很多企业债务并不主要依赖实体抵押品。',
    paragraphs: [
      '收益型契约把净债务或总债务限制为合同定义 adjusted EBITDA 的若干倍。若 EBITDA 为 30、最大净债务倍数为 4、当前净债务为 90，则新增净债务 headroom 是 30。这里真正困难的不是乘法，而是 EBITDA 调整项、现金净额、收购 pro forma、租赁负债和测试窗口的定义。',
      'Lian 与 Ma 的美国非金融企业样本显示，按其分类，约 20% 债务价值主要基于资产、约 80% 主要基于现金流。这是特定样本和分类的事实，不是全球常数；但它足以否定“企业借款容量等于房产价格乘 LTV”的通用叙事。资产与盈利冲击甚至可能产生相反的债务反应，必须分别测量。',
    ],
    sourceIds: [9, 10],
    formula: { label: '收益型有符号 headroom', expression: 'H_earn=M×adjusted EBITDA−current contract-defined net debt', note: '诊断层保留负值；只有最终可新增放款 C_new 才截为零。adjusted EBITDA 与 net debt 的纳入和扣除项都必须来自合同规则。' },
  },
  {
    id: 'dscr-capacity', number: 25, label: 'ICR / DSCR',
    title: '覆盖率约束先限制每期可承担的利息或债务服务，再通过期限结构映射为本金。',
    paragraphs: [
      'ICR 常比较 EBITDA 或 EBIT 与利息支出；DSCR 常比较可用于偿债的现金流与利息加计划本金。合格现金流 24、最低 DSCR 1.5 时，最多允许年度债务服务 16；若现有债务服务 12，流量余量是 4。没有新债利率、摊还计划与期限时，不能把 4 直接称为新增本金。',
      '覆盖率的分子尤其容易被滥用。CFADS 通常在税、营运资本与维持性资本开支之后，EBITDA 则在利息、税和多项现金支出之前；二者不能互换。BIS 部门 DSR 可描述总量偿债压力，但依赖平均期限与利率假设，不等于企业合同中的 DSCR，也不能识别抵押渠道。',
    ],
    sourceIds: [9, 10, 20, 25],
    formula: { label: '覆盖余量', expression: 'H_DSCR,flow = CFADS/DSCR_min − existing debt service', note: '保留有符号流量余量；只有明确年金因子后才能除以每单位新增本金的年度债务服务。' },
  },
  {
    id: 'covenant-headroom', number: 26, label: 'Covenant Headroom / Renegotiation',
    title: '距契约阈值还有多远比“是否违约”更有信息；越界后结果取决于宽限、豁免与重谈。',
    paragraphs: [
      '二元 breach 指标把刚好越界和严重越界混为一谈，也忽略接近阈值时的预防行为。应保存 signed headroom：安全侧为正，越界为负。管理层可能提前削减投资、出售资产、保留现金或回购债务，以避免控制权转移；这种内生调整意味着观察到的正式违约者不一定是受约束最严重的企业。',
      '契约违反通常不会机械触发立即清算。贷款人可以收费豁免、提高利率、缩减额度、追加担保或修改期限，借款人也可能主动退出。研究必须保存 waiverStatus、renegotiationTime、修改前后条款和申请选择；否则把重谈后的存续合同当作原合同，会产生幸存者偏差。',
    ],
    sourceIds: [9, 10, 18, 34, 38],
    formula: { label: '有符号余量', expression: 'signed headroom = threshold-implied capacity − current exposure', note: '只有最终“可新增容量”可以截为零；诊断层必须保留负值的越界深度。' },
  },
  {
    id: 'binding-constraint-stack', number: 27, label: 'Binding Constraint Stack',
    title: '抵押、收益、覆盖率与已承诺额度是同时必须满足的串联门；统一后取最小而不是相加。',
    paragraphs: [
      '每一项约束先在自己的原生单位中计算：抵押约束可能是本金存量，ICR 是年度利息流量，DSCR 是年度债务服务，承诺额度又有到期日。只有把它们转换为同一借款法律实体、同一设施、同一币种、同一决策时点、同一新增本金概念和同一期限，才可比较。无法转换时应停止，而不是挑一个看起来更保守的数。',
      '本页 canonical 合同把上游“80% draw cap”明确冻结为承诺额的硬提款上限：承诺100、已提款80，因此名义未提款额虽为20，当前可用未提款额却为0。其余同目标容量分别是抵押17、收益30、ICR 21.0526，以及把 CFADS/DSCR 的年度流量余量4按5.7%、24个月月度摊还换算的7.5439；五项取最小后，硬提款上限唯一绑定，新增本金为0。若原合同中的80%只指首日提款比例而非存续期硬上限，必须取得合同定义并重建该约束，不能沿用这里的0。下方 C3 是另一组独立 SYNTHETIC 参数，用来观察绑定项切换，不是 canonical 合同复述。',
    ],
    sourceIds: [9, 10, 20, 25],
    formula: { label: '容量包络', expression: 'C_new=max[0, minₖ∈Applicable Hₖ converted to the same principal target]', note: '取 min 之前必须完成单位、实体、币种、时点与期限护照；多个必要条件永远不能求和。' },
    after: <><span aria-hidden="true" id="capacity-normalisation" /><BindingConstraintLab /></>,
  },
  {
    id: 'borrower-shock-input', number: 28, label: 'Asset-price Shock as Input',
    title: '资产价格冲击只是借款人状态的输入；同一价格变化可经不同资产权重、负债和合同产生完全不同的结果。',
    paragraphs: [
      '价格下降首先重估借款人已拥有的资产，而不是直接减少贷款或投资。冲击强度应写成“价格变化 × 冲击前资产暴露 × 可被该价格代表的份额”，并固定所有权、地点、价值口径与基期。没有预先持有相关资产的企业，不应仅因位于同一地区就被赋予相同抵押冲击。',
      '资产价格还可能同时携带当地需求、生产率和未来现金流信息。地产上涨既能提高抵押价值，也可能意味着当地销售机会更好；股价下降既可能削弱净值，也可能反映盈利预期恶化。因此价格变量在机制图中只是一项输入，后续必须把重估、借款容量、融资条件和真实支出分别测量。',
    ],
    sourceIds: [3, 21, 22, 23],
    formula: { label: '暴露型冲击', expression: 'borrower exposure shockᵢ = pre-shock owned asset exposureᵢ × common price innovation', note: '暴露必须在冲击前固定；“common”并不自动意味着外生。' },
  },
  {
    id: 'collateral-capacity', number: 29, label: 'Collateral Value → Capacity',
    title: '抵押价值下降只有穿过合同估值与绑定约束，才会压缩新增债务容量。',
    paragraphs: [
      '若资产已在 borrowing base 中，评估值下降会按合格份额、advance rate、cap 和顺位重算贡献。但当 concentration cap 仍然绑定时，小幅价格变化可能完全不改变可贷值；只有跌破阈值后容量才开始下降。相反，若合同允许即时追加其他资产，单项抵押损失可以被池内替代吸收。',
      '即使 collateral headroom 下降，最终借款容量也未必改变，因为 earnings、ICR 或承诺额度可能原本更紧。要声称“抵押渠道”，至少要展示处理资产进入了目标设施、评估已更新、该约束接近或成为 binding，并且没有被其他可质押资产或融资工具完全替代。',
    ],
    sourceIds: [3, 5, 21, 22],
    formula: { label: '分段传导', expression: 'ΔC_new = Δ min(H_collateral, H_earnings, H_coverage, H_commitment, …)', note: '非绑定约束的变化对局部最终容量可为零；跨越阈值时导数会改变。' },
  },
  {
    id: 'net-worth-agency-cost', number: 30, label: 'Net Worth → Agency Cost',
    title: '净值下降提高外部融资占比与利益冲突，使监督、激励和预期违约成本上升。',
    paragraphs: [
      '企业自有净值越多，外部出资人需要承担的比例越小，借款人也有更多财富随项目成败共同变化。净值下降时，同一规模项目需要更多外部资金，贷款人面对更强的核查、风险转移和有限执行问题，因而可能提高价格、要求更多控制权或缩减数量。这是资产负债表渠道比“抵押物变少”更广的部分。',
      '净值不是唯一状态变量。项目透明度、资产可处置性、长期关系、担保、破产制度和未来现金流都会改变代理成本；高净值企业也可能因项目极难验证而融资昂贵。经验研究应检验净值冲击与这些条件的交互，而不是把企业规模、现金或杠杆中的任意一个代理永久命名为净值。',
    ],
    sourceIds: [1, 2, 4, 6],
    formula: { label: '外部融资份额', expression: 'external funding need = project scale − borrower internal funds committed', note: '在许多模型中，外部份额提高会增大代理楔子；函数形状依赖具体契约环境。' },
  },
  {
    id: 'efp-user-cost', number: 31, label: 'EFP → User Cost',
    title: '外部融资溢价通过边际资金成本进入投资门槛，但项目现金流、税收与调整成本仍共同决定选择。',
    paragraphs: [
      '企业比较的不是贷款利率与零，而是项目预期边际收益和完整资本使用成本。无风险曲线、风险与期限溢价、EFP、税收、折旧和安装调整成本共同决定门槛；净值下降抬高 EFP 时，原本略高于门槛的项目首先被推迟或取消。对依赖外部融资的边际项目，效应最强。',
      '不能从观察到的 spread 上升直接读取投资弹性。一方面 spread 可能来自银行资金或风险承担变化；另一方面企业可用现金、债券、贸易信用或缩小项目。互动实验中的线性投资函数只展示方向和单位，所有系数均为 SYNTHETIC，不是经验估计或政策乘数。',
    ],
    sourceIds: [1, 2, 4, 15, 18],
    formula: { label: '投资门槛', expression: 'invest when expected marginal project return ≥ matched user cost including the borrower financing wedge', note: '比较必须在相同币种、期限、风险与现金流口径下进行。' },
  },
  {
    id: 'price-quantity-branch', number: 32, label: 'Price / Quantity Branch',
    title: '融资摩擦可表现为成本上升，也可表现为额度、期限、担保和审批收紧；两条边际不能互相替代。',
    paragraphs: [
      '若贷款人能用价格完整补偿风险，借款人可能仍获得全部资金但支付更高成本；在逆向选择、资本保护或硬契约约束下，贷款人更可能削减额度、拒绝申请或要求追加担保。企业看到的融资集合因此是多维的，平均贷款利率甚至可能因高风险借款人被排除而下降。',
      '研究应分别记录 requested、approved、committed、drawn、outstanding、denied/withdrawn，以及名义利率、费用、期限、担保和契约。只观察已发放合同会漏掉被拒者和退出者；只观察余额又混入还款和核销。价格与数量共同变化时，需要说明哪个边际先绑定、哪个只是选择后的结果。',
    ],
    sourceIds: [4, 9, 10, 31, 51],
    formula: { label: '融资条件集合', expression: 'Financing set = {all-in cost, approval, limit, maturity, collateral, covenants, timing}', note: '“融资收紧”必须注明集合中哪些元素、针对哪个申请母体发生变化。' },
  },
  {
    id: 'desired-constrained-investment', number: 33, label: 'Desired / Constrained Investment',
    title: '观察到的投资是项目机会、融资可得性与企业选择的共同结果；先区分愿意投多少，再问能否融资。',
    paragraphs: [
      '需求改善会同时抬高投资和现金流，抵押价格上涨也可能与更好的项目机会同向。若没有无摩擦反事实，低投资不能自动归因于融资约束。结构模型可以计算 desired investment，调查可以记录计划，准实验可以比较相似企业；无论采用哪条路径，都必须把该反事实标为模型量或调查量，而不是已观测真值。',
      '融资容量只有在低于所需外部资金、内部现金和替代融资又不足时才限制实现投资。另一个独立机制是 debt overhang：正 NPV 项目的收益若大量流向旧债权人，股东可能拒绝出资，即使有物理借款容量。它强调融资结构与控制权，而不是把所有投资不足都归于抵押品数量。',
    ],
    sourceIds: [15, 16, 17, 18],
    formula: { label: '融资约束投资', expression: 'I_realised = min(I_desired, internal funds + usable external-finance capacity after other obligations)', note: '这是资源上界，不含所有投资调整机制；desired 值若不可识别必须标为模型反事实。' },
    after: <><span aria-hidden="true" id="financing-versus-investment" /><div className="precision-note" id="debt-overhang"><span>Debt overhang · 与借款容量不同的投资楔子</span><p>旧债权人吸收新项目的大部分增量价值时，股东可能不愿投入成本。它可以在 collateral headroom 为正时仍压低投资，也可以通过重组、债转股或新资金优先权被缓解；因此不能把项目未实施机械地倒推出“银行拒贷”。</p></div><DebtOverhangLab /></>,
  },
  {
    id: 'investment-irreversibility', number: 34, label: 'Irreversibility / Adjustment Cost',
    title: '不可逆投资和调整成本使企业对同一融资冲击表现出等待、分期与门槛效应。',
    paragraphs: [
      '机器安装、厂房建设和组织资本往往不能无成本撤回。面对融资成本暂时上升，企业可能等待信息、把大项目拆成阶段，或保留对未来投资的选择权；一旦已经开工，又可能因停工损失过大而继续。因而投资对融资条件的反应具有非线性和路径依赖，不是 contemporaneous 的固定斜率。',
      '调整成本还改变经验时钟。订单、承诺、在建工程、现金支付与资本存量在不同日期变化；只看年度 capex 可能错过先行取消或延迟。设计结果窗口时应根据项目准备期和不可逆性预注册多个 horizon，同时避免事后挑选显著窗口。',
    ],
    sourceIds: [15, 18, 52],
    formula: { label: '等待区间', expression: 'with fixed/irreversible adjustment costs, small financing changes may not cross the action threshold', note: '零当期投资反应不等于机制不存在；也不能事后无限延长窗口寻找效应。' },
  },
  {
    id: 'working-capital-inventory', number: 35, label: 'Working Capital / Inventory',
    title: '营运资本要在销售回款前支付投入，融资缺口因此可以先压缩库存、采购与产量。',
    paragraphs: [
      '企业购买原材料、生产、运输后才收到客户付款，库存与应收在这段时间占用资金。授信额度或贸易信用收紧时，即使长期项目仍有正 NPV，企业也可能减少订货、加快催收、延后供应商付款或降低产能利用率。融资摩擦由此在固定投资之前进入短周期生产。',
      '库存变化同时受需求预期和供应链冲击影响。销量下降会主动减少最优库存，原料短缺也会迫使库存下降；要识别融资渠道，需要观察付款期限、额度使用、应收账龄与可比订单需求。把库存下降与银行贷款下降的共变直接解释为营运资本约束，会混淆需求与供给。',
    ],
    sourceIds: [4, 15, 38, 55],
    formula: { label: '现金转换周期', expression: 'working-capital need ≈ inventory days + receivable days − payable days, scaled by operating flows', note: '这是经营诊断，不是跨行业统一融资需求公式；季节性和供应链合同必须保留。' },
  },
  {
    id: 'payroll-employment', number: 36, label: 'Payroll / Employment',
    title: '工资必须持续支付而劳动回报未来才实现，短期融资受限会改变招聘、工时与裁员边际。',
    paragraphs: [
      '服务业和轻资产企业缺少大量实体抵押，却高度依赖人力资本。现金流或授信恶化时，它们可能冻结招聘、减少工时、推迟奖金或裁员；这些动作降低当期现金支出，却可能损害未来收入和组织资本。借款人渠道因此不能只盯固定资产投资。',
      '就业效应通常比贷款决定滞后，并受到劳动法、工资刚性、留才成本和需求冲击影响。企业可能先减少外包与空缺，再调整正式员工；聚合数据还受企业进入退出影响。研究应预先定义 headcount、hours、payroll 或 vacancies 中的目标变量，不能在结果出现后挑选最显著者。',
    ],
    sourceIds: [30, 31, 38, 50],
    formula: { label: '工资单融资门', expression: 'dated payroll payments ≤ operating cash inflow + usable liquidity + financing arriving before payroll date', note: '年度盈利不能替代支付日可用资金；时间错配本身就是机制。' },
  },
  {
    id: 'cash-buffer', number: 37, label: 'Precautionary Cash Buffer',
    title: '现金缓冲吸收短期外部融资缺口，却会消耗未来保险与投资选择权。',
    paragraphs: [
      '预期未来融资困难的企业会持有更多现金或未用额度，以便在收入下降或资产价格波动时维持支出。冲击发生后，使用现金可以让贷款减少不立刻转化为投资下降；因此贷款对效应、外部融资总额效应和现金后的资源缺口必须分栏。完全依靠现金暂时平滑也不表示约束没有成本。',
      '现金缓冲具有内生选择：预见风险更高的企业可能事先多持现金，也可能因长期受限而根本积累不了现金。未用承诺又可能在压力中被缩减或附带条件，不能当作无条件现金等价物。识别时应使用冲击前现金与合同额度，并区分实际可提款、受 covenant 限制和已被其他用途占用的份额。',
    ],
    sourceIds: [6, 13, 38, 43],
    formula: { label: '资源缺口桥', expression: 'post-cash resource change = ΔF_external + cash used; remaining shortfall=max(0, −post-cash change)', note: '融资下降为负、现金使用为正。本例 −12+5=−7，对应正的剩余短缺7；现金不是外部融资。' },
  },
  {
    id: 'retained-earnings', number: 38, label: 'Retained Earnings / Net-worth Accumulation',
    title: '当期利润与分配政策决定下一期内部净值，真实支出变化因而反过来塑造未来融资能力。',
    paragraphs: [
      '企业销售和利润增加后，未分配部分转为内部资金与净值；亏损、分红和回购则削弱它。融资约束压低当期投资、库存或就业，可能降低未来产能和利润，使净值恢复更慢；也可能通过削减支出保存现金，短期改善流动性。反馈方向取决于支出对未来收益的作用和企业分配行为。',
      '会计留存收益不等于市场净值变化，也不等于可质押资源。无形投资可能当期费用化却提高未来价值，资产价格上升也可在没有利润时提高经济净值。动态状态必须分别保存经营交易、估值重估和分配，才能理解下一期融资是由盈利修复还是价格反弹推动。',
    ],
    sourceIds: [1, 2, 27, 37],
    formula: { label: '内部积累', expression: 'next-period net worth = current net worth + retained operating surplus + revaluation + other-volume changes', note: '每项都应与会计桥一致；模型中的净值更新不能冒充现实报表定义。' },
  },
  {
    id: 'distress-and-restructuring', number: 39, label: 'Distress / Solvency',
    title: '财务困境消耗客户、供应商与组织价值，并通过重谈改变融资边界；它不等同于银行风险偏好变化。',
    paragraphs: [
      '接近违约时，供应商可能缩短账期，客户担心售后服务，员工离开，管理层把精力投入重组，资产也可能被迫在不利时点出售。这些直接和间接困境成本会减少可回收价值与未来现金流，使原本的净值冲击继续恶化。正式破产只是连续困境过程中的一个事件。',
      '重组可以延长期限、减记债务、提供新资金优先权或交换股权，从而缓解 debt overhang 和流动性错配。若贷款人因自身资本或风险容忍度同时改变处置策略，机制已与 3.10/3.12 联合；本章只追踪借款人权利、现金流与净值，不能把银行侧选择偷偷写成借款人效应。',
    ],
    sourceIds: [5, 8, 17, 34, 38, 53],
    formula: { label: '困境楔子', expression: 'going-concern value − value net of distress and enforcement costs determines the resource loss from distress', note: '差额不可从市场价格单独识别，需要合同、结果与反事实。' },
  },
  {
    id: 'financial-accelerator-loop', number: 40, label: 'Financial Accelerator',
    title: '初始冲击经净值、融资溢价、真实支出与未来利润闭环，形成借款人侧金融加速器。',
    paragraphs: [
      '第一轮资产或现金流冲击降低净值；较弱净值提高外部融资占比、代理成本或使容量绑定；融资价格上升或数量下降压低投资和营运支出；较弱支出再降低下一期收入与净值。反馈把小而短的冲击变成更大、更持久的真实反应，这也是金融状态影响宏观波动的核心方式。',
      '加速器是“放大与持续”的机制，不负责证明初始冲击外生。它也不必包含抵押品市场价格继续下跌、margin call 或 fire sale；本章实验只让净值与支出相互反馈。若强制出售影响市场价格并污染其他主体，机制已经进入 7.12/7.13，必须另建价格形成与网络状态。',
    ],
    sourceIds: [1, 2, 3, 29],
    formula: { label: '局部反馈', expression: 'g=(∂N_next/∂I)×(∂I/∂EFP)×(∂EFP/∂N); local multiplier=1/(1−g) when |g|<1', note: '每个导数都需方向、单位和时点；局部稳定公式不能外推越过阈值或结构变化。' },
    after: <><span aria-hidden="true" id="shock-versus-amplification" /><FinancialAcceleratorLoopLab /></>,
  },
  {
    id: 'state-dependence', number: 41, label: 'State Dependence / Downside Asymmetry',
    title: '借款人渠道在接近契约阈值、融资替代稀缺和衰退回收率下降时往往更强。',
    paragraphs: [
      '远离阈值时，资产价格小幅波动可能只改变闲置 headroom；接近 LTV、ICR 或 borrowing-base 上限时，同样冲击会压缩实际容量。下行状态还常伴随现金流弱、买方减少、评估折扣上升与替代融资收缩，使多个约束同时收紧。上行时，贷款人可能不对称地缓慢放松规则。',
      '非线性要求研究报告状态变量、阈值距离与正负冲击分开结果，而不是一个全样本平均系数。阈值也可能被企业预防性行为内生避开，造成观测值在边界附近稀少。若事后按照结果选择“高约束”组，会产生选择偏差；分组和函数形式应在看到结果前定义。',
    ],
    sourceIds: [2, 3, 9, 10, 36],
    formula: { label: '局部状态', expression: 'effect = f(distance to binding constraint, substitution capacity, recovery state, shock sign)', note: '这是异质性结构；不应未经支持集检查压成一个恒定乘数。' },
  },
  {
    id: 'balance-sheet-estimand', number: 42, label: 'Balance-sheet Estimand',
    title: '第一层估计量是外生或准外生冲击对借款人净值与流动性状态的影响。',
    paragraphs: [
      '研究必须先定义处理：是冲击前持有地产价值乘当地价格创新、汇率变化乘外币净负债，还是现金流意外？结果也要精确：市场净值、账面净值、现金余额、短期债务缺口或 covenant headroom。把多个状态合成“财务健康指数”会让机制方向难以解释。',
      '这一层的反事实是同一借款人在没有该冲击时的资产负债表，而不是“没有融资摩擦时的投资”。价格、数量与会计边界需要先闭合；若处理同时改变资产价值和经营需求，应分别报告，不能用后续融资结果反向验证冲击确实只经过净值。',
    ],
    sourceIds: [21, 22, 27, 30],
    formula: { label: '第一层 estimand', expression: 'τ_balance-sheet(h)=E[stateᵢ,t+h(1)−stateᵢ,t+h(0) | defined support]', note: '括号中的 1/0 是潜在处理状态，不是观察到的前后差。' },
  },
  {
    id: 'collateral-capacity-estimand', number: 43, label: 'Collateral → Capacity Estimand',
    title: '第二层估计量问：给定权利与合同，抵押价值变化究竟使可用融资容量改变多少？',
    paragraphs: [
      '理想数据同时观察资产、评估、担保登记、设施 borrowing base、已提款、契约阈值与额度。处理应是预先确定资产暴露上的价值创新，结果是可比设施的 approved/committed/drawn capacity 或 signed headroom。只看贷款余额会混入需求、还款和核销。',
      '这一层可被清晰证伪：资产没有进入合同、评估没有更新、约束远离 binding，或容量由 EBITDA/ICR 决定时，抵押价值变化不应显著改变目标设施容量。反之，发现高度特定于受影响资产、评估日与近阈值借款人的响应，才与合同抵押机制一致。',
    ],
    sourceIds: [12, 19, 21, 22, 30],
    formula: { label: '第二层 estimand', expression: 'τ_capacity = effect of a defined pledgeable-value shock on comparable incremental principal capacity', note: '“可比较”要求同实体、设施、币种、决策时点、期限与本金概念。' },
  },
  {
    id: 'financing-terms-estimand', number: 44, label: 'Financing Terms / EFP Estimand',
    title: '第三层估计量分别观察融资价格与数量；理论 EFP 若不可观测，就必须承认它是模型隐变量。',
    paragraphs: [
      '合同数据可以估计冲击对名义利率、年化费用、额度、期限、担保和 covenant 的影响。为了避免把银行基准变化混入，应使用匹配币种与重定价期的 benchmark，并尽可能加入 lender×time 控制。价格、数量和条款是不同结果，不能只挑一个显著边际后把结论扩展到整个融资集合。',
      'EFP 的因果估计还要求内部资金边际机会成本。若只能看到外部报价，严谨名称是 observable all-in spread；结构模型可在明确假设下推断 EFP，但应报告模型不确定性和外部验证。贷款 spread 既不等于银行端 μ_target，也不等于借款人端 EFP。',
    ],
    sourceIds: [2, 4, 28, 30],
    formula: { label: '可观测与隐变量', expression: 'τ_spread is observable under matched pricing data; τ_EFP additionally requires an internal-finance counterfactual', note: '两者应分别储存 identificationStatus，不能由命名自动升级。' },
  },
  {
    id: 'real-spending-estimand', number: 45, label: 'Real-spending Estimand',
    title: '第四层估计量问融资变化是否改变了投资、库存、工资或就业，而不是只观察它们同向移动。',
    paragraphs: [
      '真实结果必须在融资决定之后测量，并与机制时滞匹配。资本开支适合较长窗口，库存、采购与工资单可能更快；每个结果都要预注册单位、基期和聚合层。企业退出与并购会改变样本，零投资也可能来自项目机会消失，不能当作融资约束的直接标签。',
      '完整链条最好同时报告 first stage：抵押价值确实改变容量或条款；再报告融资替代和现金缓冲；最后估计实体结果。若融资没有变化而投资仍下降，结果更像共同需求或其他渠道；若融资变化但企业完全替代，实体效应应接近零。',
    ],
    sourceIds: [21, 22, 24, 30, 36],
    formula: { label: '第四层 estimand', expression: 'τ_real(h)=effect on a prespecified real outcome after financing decision, conditional on the design support', note: '它不是 τ_capacity 乘一个事后选择的投资斜率；每层都需要数据和假设。' },
  },
  {
    id: 'predetermined-collateral-exposure', number: 46, label: 'Predetermined Exposure',
    title: '抵押暴露必须在冲击前确定，否则企业可能因为预见未来机会才购买或持有资产。',
    paragraphs: [
      '持有地产的企业与租户在规模、年龄、行业、管理质量和扩张计划上系统不同。若用冲击后的资产持有量构造处理，企业融资后购买地产会反过来提高“暴露”，造成严重反向因果。应冻结冲击前所有权、份额、账面与地点，并证明资产在处理窗口内没有由结果决定。',
      '预定并不等于外生。早期购买决定仍可能与长期增长机会相关；研究需要企业固定效应、资产构成控制、事件前趋势与可辩护的价格创新。对多地资产，还要按资产所在地加权，而不是用总部城市价格。',
    ],
    sourceIds: [21, 22, 30],
    formula: { label: 'Shift-share 式暴露', expression: 'ExposureShockᵢₜ=Σₗ owned shareᵢₗ,t−1 × price innovationₗₜ', note: '权重必须预定；价格创新的外生性和空间溢出仍需独立论证。' },
  },
  {
    id: 'same-lender-time', number: 47, label: 'Same-lender × Time',
    title: '同一贷款人×时间控制可以冻结共同银行供给，但不能解决关系匹配、申请选择与产品特定变化。',
    paragraphs: [
      '比较同一时期、同一银行面对抵押暴露不同的借款人，可以吸收银行当期共同资金、资本和风险政策。若同一企业从多家银行借款，也可以反向比较银行暴露差异并控制企业需求。这些高维固定效应是区分 3.10 与 3.11 的重要工具。',
      '但银行可能对特定行业、地区或关系客户采用不同策略，借款人也会把不同申请选择性地送往不同银行。固定效应覆盖的通常是多银行借款人或重复申请者，外部有效性有限。研究必须披露支持集、匹配变化和申请母体，不能把控制变量名称当成需求完全冻结的证明。',
    ],
    sourceIds: [21, 22, 35, 40, 54],
    formula: { label: '局部冻结', expression: 'borrower outcomeᵢⱼₜ = borrower collateral shockᵢₜ + lender×time FEⱼₜ + design controls', note: '固定效应吸收共同银行状态，不吸收 borrower×lender 特定供需或选择。' },
  },
  {
    id: 'local-demand-confound', number: 48, label: 'Local Demand Confound',
    title: '当地资产价格与企业需求、生产率和销售前景共同变化，是抵押渠道最核心的混淆。',
    paragraphs: [
      '地产上涨地区往往同时就业更强、消费更高、商业机会更多。拥有地产的企业投资增加，可能因为抵押能力提高，也可能因为预期销售增加；租户也会受到租金和需求冲击。只加入全国时间固定效应或行业固定效应，通常不足以净化这种本地共同状态。',
      '可使用地区×时间控制、当地行业需求、非交易部门暴露、客户地理构成、owner-renter 对照或外部价格工具，但每种策略都有排除限制。最有说服力的证据不是单一回归显著，而是融资 first stage、资产特异性、近约束异质性、安慰剂和替代检验共同指向同一链条。',
    ],
    sourceIds: [21, 22, 23, 24, 30],
    formula: { label: '两条同时路径', expression: 'local asset price → {collateral capacity; local demand/productivity/rents}', note: '设计必须阻断第二条或明确估计的是联合效应。' },
  },
  {
    id: 'owner-renter-control', number: 49, label: 'Owner / Renter Control',
    title: '所有者—租户比较能利用抵押暴露差异，但前提是两组面对可比的经营机会与成本冲击。',
    paragraphs: [
      '同地区、同行业的所有者和租户都经历当地需求，却只有所有者直接获得房产净值变化，因此差分中的差分可帮助隔离抵押渠道。合成例中所有者投资 100→70、租户 100→90，DiD 为 −20，表示所有者额外下降 20 个指数点。这个数值本身仍没有因果身份。',
      '租户同时承受租金、续租和搬迁选择，所有者又可能更老、更大、资产更重。若房价冲击改变租金或企业退出，两组的潜在结果趋势并不平行。需要冲击前趋势、资产构成、现金流与租金控制、共同支持和样本退出审计；否则对照组只是另一个受不同处理的群体。',
    ],
    sourceIds: [21, 22, 30],
    formula: { label: '所有者—租户 DiD', expression: 'DiD=(Owner_post−Owner_pre)−(Renter_post−Renter_pre)', note: '恒等式只计算差分；因果解释来自平行趋势、无差异冲击、无溢出与支持集。' },
  },
  {
    id: 'stale-appraisal-error', number: 50, label: 'Stale Appraisal / Measurement Error',
    title: '陈旧评估会把真实抵押价值变化推迟、压平或错误归入后续窗口。',
    paragraphs: [
      '商业资产缺少连续交易，合同可能沿用数月前评估。用当前地区指数替代设施实际评估，会高估贷款人已知的冲击；用事后更新评估解释早期决策，又会产生未来信息泄漏。测量误差可能衰减平均系数，也可能因重估触发规则造成非经典偏差。',
      '应保存 appraisalTime、valuationVintage、触发事件、方法变化与独立评估标志，并围绕真实重估日建立事件时间。若贷款人只在企业恶化时主动重估，评估更新本身存在选择；简单比较“被重估”与“未重估”会把预期困境混入处理。',
    ],
    sourceIds: [12, 21, 22, 27, 30],
    formula: { label: '可用信息版本', expression: 'contract value at decision t = latest eligible appraisal published and available by t', note: '不是今天回看时最准确的价值；版本与发布时间必须保留。' },
  },
  {
    id: 'support-and-selection', number: 51, label: 'Application Selection / Support',
    title: '只在申请者或获批者中观察合同，会遗漏因预期拒绝而不申请、撤回或退出的企业。',
    paragraphs: [
      '资产负债表恶化可能先让企业放弃申请，银行也可能通过预审和关系沟通筛掉边际借款人。若数据只含已发放贷款，最受影响者消失，剩余样本平均利率和质量可能反而改善。批准条件上的回归因此不是全体企业融资可得性的估计。',
      '支持集要从申请资格、实际申请、审批、签约、提款到存续逐层报告。可以使用调查中的融资需求、拒绝/气馁借款人、申请登记或选择模型补充，但每种数据口径不同。无法观察未申请者时，应把结论限定为观察到的申请者，而不是用权重假装修复不可识别总体。',
    ],
    sourceIds: [16, 31, 45, 46, 48, 50],
    formula: { label: '选择漏斗', expression: 'eligible → apply → approve → accept/sign → draw → remain observed', note: '每一步都可能受处理影响；以末端样本为条件会改变 estimand。' },
  },
  {
    id: 'financing-substitution', number: 52, label: 'Total External Finance / Substitution',
    title: '担保贷款下降不等于总外部融资等量下降；其他银行、无担保债、债券、贸易信用与租赁必须加回。',
    paragraphs: [
      '企业会重排融资结构。合成例中担保贷款 80→50，下降 30；无担保贷款增加 10、债券增加 5、贸易信用增加 3，总外部融资只下降 12。再使用内部现金 5，当前资源缺口缩小到 7。若只报告第一项，会把融资替代和现金缓冲全部误作实体收缩。',
      '替代并非没有成本：新融资可能更贵、更短、附带控制权，或只覆盖特定用途。总额不变也可能伴随风险和未来脆弱性变化；相反，观察窗口过短会漏掉到达较慢的债券融资。应同时报告金额、成本、期限、用途与到达时间，并明确内部现金不属于外部融资。',
    ],
    sourceIds: [9, 35, 36, 38],
    formula: { label: '借款人融资桥', expression: 'ΔF_external=Δsecured bank+Δunsecured bank+Δbonds+Δtrade credit+Δleases+Δother external', note: '每项统一币种、窗口与本金口径；现金使用在下一步资源桥中单列。' },
    after: <span aria-hidden="true" id="total-external-finance" />,
  },
  {
    id: 'secured-unsecured-counterfactual', number: 53, label: 'Secured / Economically Unsecured Response',
    title: '若无担保融资同步增加，简单的“合同抵押减少所以总融资下降”解释就受到挑战。',
    paragraphs: [
      '抵押价值下降后，担保设施可能机械收缩，但企业若仍有稳定盈利、声誉或资本市场准入，可以转向无担保贷款和债券。此时合同层抵押渠道存在，借款人总融资效应却很小。研究必须区分“受影响设施响应”与“企业可用资源响应”，不能用前者替代后者。',
      '所谓无担保也可能在经济上依赖资产：负面质押、交叉违约、子公司保证和破产顺位会使债权人间接受益于资产价值。合同标签与实际控制权不完全相同，需读取 covenant、保证和集团结构。反证的目标不是要求零响应，而是检验替代融资是否按理论边界出现。',
    ],
    sourceIds: [9, 35, 36, 38],
    formula: { label: '两层反事实', expression: 'facility-level collateral effect can be nonzero while borrower-total-external-finance effect is near zero', note: '二者同时成立并不矛盾；它揭示替代边际。' },
  },
  {
    id: 'borrower-heterogeneity', number: 54, label: 'Size / Age / Tangibility / Intangibles',
    title: '规模、年龄、有形性与市场准入改变融资选择，但它们只是状态与代理，不是约束本身。',
    paragraphs: [
      '年轻、小型、信息不透明企业通常缺乏公开债券市场和长期记录，可能更依赖关系贷款；资产有形性高的企业更容易提供担保。无形密集企业虽缺少传统抵押物，却可能拥有高增长机会、专利收入或风险资本。任何单一特征都无法可靠地把企业分成“受约束/不受约束”。',
      '投资—现金流敏感度、KZ/SA/WW 等指标也只能作为特定研究中的代理。已有反证表明敏感度与真实约束程度不必单调，分类指标可能无法预测外生融资需求时的举债能力。更稳健的做法是直接观察申请、合同、headroom、替代和结果，并把异质性分组限定在有共同支持的范围。',
    ],
    sourceIds: [15, 16, 29, 39, 44, 45, 46],
    formula: { label: '代理不等于状态', expression: 'firm characteristic → probability/distribution of constraints, not a deterministic constraint label', note: '异质性检验需预先规定方向并报告组间支持，而不是事后分箱。' },
  },
  {
    id: 'aggregation-boundary', number: 55, label: 'Weighting / Aggregation / General Equilibrium',
    title: '企业层局部效应不能未经权重、进入退出与价格反馈就升级为宏观金融加速器。',
    paragraphs: [
      '上市企业、银行客户或获批贷款样本往往偏向规模大、存续久和融资渠道多的主体。简单平均企业系数不等于总投资效应：需要按目标总体、企业规模或经济权重聚合，并处理未覆盖企业、退出、并购和新进入。不同企业还可能相互替代市场份额，使局部损失被竞争者部分吸收。',
      '总量层面，资产价格、工资、利率、信贷供给和政策会共同反应；这些一般均衡反馈属于 3.14/3.15、住房机制或 Chapter 7。3.11 交付的是可聚合的借款人状态、局部 estimand 与边界标签。没有价格和网络模型时，最严谨的结论是样本内局部效应，而不是经济体乘数。',
    ],
    sourceIds: [2, 21, 22, 27, 30],
    formula: { label: '加权目标', expression: 'aggregate effect = Σ population-consistent weights × unit effects + entry/exit/reallocation/general-equilibrium terms', note: '后四项若未知就必须列为边界，不能默认为零。' },
  },
  {
    id: 'identification-gates', number: 56, label: 'Falsification / Routing',
    title: '一个可信的借款人资产负债表渠道，需要每一段链条都有可失败的检验与明确的跨章路由。',
    paragraphs: [
      '如果没有预先资产暴露、价格冲击不影响实际合同估值、容量远离约束、总外部融资被完全替代，或真实支出在融资变化之前已下降，那么完整渠道不成立。若只有同向相关，状态保持 descriptive；若多项方向和时序吻合，可标 mechanism-consistent；只有明确反事实、支持集、标准误和安慰剂通过，才可升级 identified-candidate 或 identified。',
      '边界诊断同样是结果。银行资金或资本变化路由 3.10，筛选与风险容忍度变化路由 3.12，信用和杠杆总量循环路由 3.14/3.15，住房制度路由 3.16，margin call 与 fire sale 路由 7.12/7.13。联合机制可以研究，但必须保留每个输入 stateId，不能把所有响应都命名为 collateral channel。',
    ],
    sourceIds: [4, 16, 21, 22, 30, 35, 40, 45],
    formula: { label: '识别升级门', expression: 'status upgrade requires design + timing + support + diagnostics + falsification; arithmetic consistency alone is insufficient', note: '每个 estimand 独立升级；上游通过不会自动授予下游因果身份。' },
    after: <><div className="precision-note"><span>H1–H6 · 条件化、可证伪的研究假设</span><ol>
      <li><b>H1 · 重估：</b>冲击前持有相关资产的企业，市场价值冲击应先改变对应净值；若非持有者同幅变化或结果领先冲击，则拒绝纯重估解释。<Cites ns={[21, 22, 27, 37]} /></li>
      <li><b>H2 · 容量：</b>实际进入合同且接近 binding 的资产受到负向估值冲击后，设施 headroom 在评估/测试日下降；远离阈值或资产未入池者应弱得多。<Cites ns={[7, 12, 21, 22]} /></li>
      <li><b>H3 · 价格与数量：</b>净值下降应提高 matched all-in spread 或收紧额度/条款；只有基准率变动而银行特定与借款人特定楔子不动，不支持本章渠道。<Cites ns={[1, 2, 4, 35, 40]} /></li>
      <li><b>H4 · 替代：</b>市场准入和现金缓冲越弱，设施收缩越能进入总外部融资与资源缺口；完全替代者的短期真实支出效应应接近零。<Cites ns={[9, 19, 35, 38]} /></li>
      <li><b>H5 · 实体时序：</b>营运资本密集企业的库存/采购可能先于长期 capex 调整；结果若系统性领先融资决定，应拒绝该时序。<Cites ns={[15, 24, 36, 38, 55]} /></li>
      <li><b>H6 · 状态依赖的竞争性预测：</b>低 headroom 使借款人更容易跨过绑定阈值，因此同样的负向冲击更可能压缩最终容量；但低可再部署性或弱执行既会降低基准容量，也可能降低资产价值进入容量的斜率，例如 <code>∂C/∂V=θ</code> 随执行参数 θ 下降而变小。研究必须把“水平更脆弱”和“边际 pass-through 更强”分开估计，对后者不预设统一符号。<Cites ns={[3, 5, 12, 19, 26]} /></li>
    </ol></div><CollateralIdentificationLab /></>,
  },
];

const checks = [
  { question: '地产占总资产40%，地产价格跌10%，为什么企业净值跌幅可能超过10%？', answer: '若名义负债暂时固定，40的资产损失全部由较小的股东净值吸收。A=1000、L=700时，N由300降至260，净值跌13.33%；这仍只是重估桥，不是融资或投资因果效应。', sourceIds: [1, 2, 27, 37] },
  { question: '企业正在使用一台机器，为什么它仍可能不能进入 borrowing base？', answer: '企业可能只是承租或代管，或者资产不可转让、未完成对抗登记、已有更优先留置权、位于不适用法域，或不符合合同资产类别与估值规则。', sourceIds: [5, 7, 8, 14, 33] },
  { question: 'market value、appraisal value、liquidation value 与 expected recovery 有什么顺序关系？', answer: '它们分别对应正常市场、特定评估日、压缩出售情景和扣除顺位/执行/时滞后的债权人回收。通常逐层更保守，但不存在跨资产必然单调的固定折扣。', sourceIds: [8, 12, 26, 41] },
  { question: 'Haircut 20%、advance rate 80%，是否应同时乘0.8两次？', answer: '若两者只是互补定义，只能使用一次；若合同另有独立估值、流动性或币种折扣，必须逐项命名、保留顺序，并证明没有重复计量。', sourceIds: [7, 12, 32] },
  { question: '应收120、合格80%、advance 75%、cap 60、先顺位20，贡献为何是40？', answer: '教学合同按 min(120×0.8×0.75,60)−20 计算，即 min(72,60)−20=40。先顺位不能在总池末尾模糊扣减，也不能漏掉cap。', sourceIds: [7, 31, 32, 33] },
  { question: 'Canonical 的资产、收益、ICR、DSCR 与名义未提款额分别为17、30、21.0526、7.5439与20，为什么最终可新增本金仍为0？', answer: '它们是同时必须满足的必要门，而且20只是承诺减已提款的名义差额。上游80% draw cap在本合成合同中被明确解释为硬上限，所以可用未提款额是100×80%−80=0；先把五项映射到同一实体、设施、币种、决策时点、期限与新增本金单位，再取最小值0。若draw cap的法律含义不同，必须STOP并读取合同定义。', sourceIds: [9, 10, 20, 25] },
  { question: 'CFADS 24、最低DSCR 1.5、现有年偿债12，能直接说新增本金为4吗？', answer: '不能。4是年度债务服务余量；还需新债利率、摊还频率与期限，用每单位本金的年度债务服务因子换算本金。', sourceIds: [9, 10, 20, 25] },
  { question: '企业贷款报价6%、年化费用0.5%、匹配基准4%，EFP是否为2.5个百分点？', answer: '2.5pp只是observable all-in spread。若内部资金机会成本为4.4%，EFP才是6.5−4.4=2.1pp；内部机会成本未知时不得报告EFP。', sourceIds: [1, 2, 4] },
  { question: '为什么净值不等于现金？', answer: '净值是所有资产减负债的存量剩余，可能主要由难出售的设备和地产构成；现金与可提款额度回答到期支付能力。正净值可同时伴随现金枯竭。', sourceIds: [1, 6, 38] },
  { question: '增加抵押价值为什么未必提高实际借款？', answer: '抵押约束可能原本不绑定；收益、覆盖率、承诺额度或借款需求仍可能更紧，企业也可能选择不提款。必须从headroom继续追踪requested、approved、committed和drawn。', sourceIds: [9, 10, 35] },
  { question: '为什么设施贷款下降30不能直接推断企业外部融资下降30？', answer: '企业可能增加无担保贷款、债券、贸易信用、租赁或其他银行融资；只有在同一窗口把全部外部来源相加，才得到borrower-total external finance。', sourceIds: [35, 36, 38] },
  { question: '外部融资总额下降12、企业使用现金5，真实支出是否必然下降7？', answer: '按统一符号，post-cash resource change为−12+5=−7，正的remaining shortfall是7；它还可能通过延后付款、资产出售、缩小项目或经营现金流调整吸收。实体结果需要独立结果窗口和反事实，不能由资源桥机械给出。', sourceIds: [17, 18, 38] },
  { question: '高杠杆企业不投资，为什么不一定是抵押容量不足？', answer: '可能是旧债权人获得新增项目的大部分价值而形成debt overhang，也可能是项目机会弱、调整成本高或需求下降。需要项目、合同和融资行为证据。', sourceIds: [17, 18] },
  { question: '金融加速器为什么不要求出现fire sale？', answer: '只要净值下降提高融资楔子、压低支出，较低支出再削弱未来利润与净值，就形成借款人侧反馈。强制出售影响市场价格与其他主体时才进入7.12/7.13。', sourceIds: [1, 2, 3, 26, 29] },
  { question: 'owner-renter DiD 为−20，为什么还不能称为已识别抵押效应？', answer: '两组可能在年龄、规模、资产结构、租金冲击、搬迁与退出上不同；还需预趋势、共同支持、地方需求控制、无差异现金流冲击和融资first stage。', sourceIds: [19, 21, 22] },
  { question: 'same-lender×time固定效应能否彻底冻结银行供给？', answer: '它吸收同一贷款人当期共同状态，却不吸收银行针对特定关系、行业、地区或产品的策略，也不能修复申请与匹配选择；结论只属于其支持样本。', sourceIds: [21, 22, 40] },
  { question: '使用最新修订财报解释三个月前贷款决定，有什么问题？', answer: '这是未来信息泄漏。只能使用decisionTime之前已发布的版本；observation、publication与revision时间必须分开，陈旧评估则作为机制或测量误差保留。', sourceIds: [27, 28, 37, 47] },
  { question: '何时应把结果从3.11路由到相邻章节？', answer: '银行资金/资本变动到3.10，筛选与风险容忍度到3.12，信用与杠杆总量循环到3.14/3.15，住房制度到3.16，margin call和fire sale到7.12/7.13。联合机制须显式命名。', sourceIds: [3, 4, 26, 44] },
] as const;

const glossary = [
  ['借款人净值', '同一实体和估值口径下资产减负债的剩余', '现金、可用额度或市场资本化', '§04'],
  ['流动性', '按到期时点获得可用支付手段的能力', '正净值或年度盈利', '§06'],
  ['候选资产', '可能被考虑用于担保的资产', '已满足合同与法律门的合格抵押品', '§07'],
  ['评估价值', '按指定方法和日期为合同或交易目的形成的价值', '连续市场价格、清算价值或最终回收', '§08'],
  ['清算价值', '压缩出售期和处置条件下的估计售价', '扣完顺位、成本和时间后的expected recovery', '§08'],
  ['可再部署性', '资产转移给替代使用者并保持价值的能力', '会计有形性', '§11'],
  ['担保权', '违约或触发状态下对资产控制与优先受偿的法律安排', '贷款人日常拥有并使用资产', '§21'],
  ['顺位', '多个权利人对同一回收额的优先次序', '平均LGD或风险评级', '§09'],
  ['Haircut', '不计入估值基础的合同折扣比例', '与其互补的advance rate再重复相乘', '§10'],
  ['Advance rate', '合格价值可计入借款基础的比例', '所有资产统一LTV', '§10'],
  ['Borrowing base', '逐项合格资产经规则调整后的设施级借款基础', '总资产或抵押物市场价值', '§22'],
  ['Collateral headroom', '借款基础扣除当前占用后的剩余本金空间', '最终借款容量', '§22–27'],
  ['Earnings headroom', '收益倍数阈值推导的新增债务空间', '抵押价值或DSCR流量余量', '§24'],
  ['ICR', '约定收益相对利息支出的覆盖倍数', '含本金的DSCR', '§25'],
  ['DSCR', '可用于偿债现金流相对约定债务服务的倍数', 'Debt/EBITDA或本金容量', '§25'],
  ['Signed headroom', '阈值隐含容量减当前占用，可正可负', '过早截为零的可贷量', '§26'],
  ['Binding constraint', '统一口径后决定最终容量的最小适用约束', '数值最大的安全缓冲', '§27'],
  ['内部融资', '企业内部产生或持有并用于项目的资金', '零成本资金', '§15'],
  ['Observable spread', '全口径外部成本相对匹配外部基准的差额', '借款人EFP', '§16'],
  ['外部融资溢价', '边际外部资金成本相对边际内部资金机会成本的差额', '银行端目标markup或任意贷款spread', '§16'],
  ['可质押收入', '满足验证、激励和执行条件后可向外部出资人承诺的价值', '项目全部社会价值', '§20'],
  ['Debt overhang', '旧债权人吸收新增项目价值导致股东不愿投资的楔子', '任何高杠杆或贷款额度不足', '§33'],
  ['现金缓冲', '外部融资变化后用于平滑资源缺口的内部流动资金', '外部融资替代', '§37'],
  ['金融加速器', '净值、融资楔子、真实支出与未来净值构成的放大反馈', '初始冲击本身或fire sale的同义词', '§40'],
  ['预定暴露', '在冲击发生前固定的资产所有权与权重', '事后持有量或天然外生性', '§46'],
  ['支持集', '设计实际允许可信比较的观测总体', '数据库中的全部企业', '§51'],
  ['τ_balance-sheet', '冲击对借款人净值或流动性状态的处理效应', '融资或投资效应', '§42'],
  ['τ_capacity', '可质押价值变化对可比新增本金容量的处理效应', '贷款余额变化', '§43'],
  ['τ_real', '融资链对预注册真实支出的处理效应', '容量系数机械缩放', '§45'],
  ['动态数据护照', '保存来源、口径、时点、版本、单位与断点的记录', '网页当前值的永久快照', '§63'],
] as const;

const interfaces = [
  { name: 'I1 · 3.09 → 3.11', payload: 'borrower/lender legal entities、credit state、funding event clocks、balance-sheet lineage', guardrail: '读取信用关系与会计事件，但不把银行放贷分录改写成借款人净值冲击。' },
  { name: 'I2 · 3.10 → 3.11', payload: 'loanOfferState、creditDecisionState、loanContractPassport、relationshipState、frozen PD/LGD and risk-tolerance lineage', guardrail: '必须引用真实上游stateId；本章只让借款人资产、现金流和融资楔子变化，银行共同状态保持冻结。' },
  { name: 'I3 · 3.11 → 3.12', payload: 'borrower state、collateral pool、constraint stack、distress and repayment signals', guardrail: '3.12 决定银行筛选与风险容忍度怎样内生变化；若这些量已在本章变化，识别降级为联合渠道。' },
  { name: 'I4 · 3.11 → 3.13', payload: 'borrower financing price/quantity/terms、constraint distribution、substitution and cash buffers', guardrail: '交付分布而非单一“资产负债表健康指数”；保留企业权重、行业与法域。' },
  { name: 'I5 · 3.11 → 3.14 / 3.15', payload: 'net-worth distribution、binding shares、external-finance gaps、real-outcome windows', guardrail: '信用与杠杆周期需要聚合、进入退出和一般均衡；企业层局部效应不自动成为总量乘数。' },
  { name: 'I6 · 3.11 → 3.16', payload: 'household legal entity、housing equity、income、debt service、refinancing eligibility', guardrail: '住房供给、按揭制度、固定/浮息、止赎与MPC异质性由3.16专门展开。' },
  { name: 'I7 · 3.11 → 7.12 / 7.13', payload: 'asset ownership、liens、liquidation value、margin and forced-sale triggers', guardrail: '价格冲击借款人可以留在本章；强制出售改变市场价格、相关性或他人资产负债表时转入螺旋与传染。' },
  { name: 'I8 · 3.11 → Chapter 7', payload: 'four estimands、identification status、support、clocks、data passports、falsification results', guardrail: '描述、机制一致、候选识别与已识别分级；每一层独立升级，计算器通过不授予因果身份。' },
] as const;

const contractInvariants = [
  '资产、负债、现金流、抵押池与合同必须绑定同一借款法律实体；集团、母公司、保证人和经济使用者不得静默合并。',
  '所有金额保存 currency、unitMultiplier、nominalOrReal、baseDate 与 measurementBasis；比率使用 0–1，利率使用年化百分点，无法比较就返回 null/STOP。',
  'book、market、appraisal、liquidation 与 expected recovery 永久分栏；任何一个都不能覆盖另一个。',
  '每项担保权保存法律所有者、资产所在地、登记、顺位、法版本与估值 vintage；上游 aggregate collateralId 拆成 local collateralId / assetId 时必须留 crosswalk 并标明 synthetic enrichment，同一资产不得向多个抵押池重复贡献全部价值。',
  'Haircut 与其互补 advance rate 只能出现一次；合格份额、cap、先顺位与执行成本按合同规则版本逐项复算。',
  '抵押、收益、ICR、DSCR 与承诺额度先保留原生单位和期限，再映射到同一目标新增本金；只有可比项取最小，并列最小全部报告。',
  'drawn≤commitment，undrawn=commitment−drawn；requested、approved、committed、drawn、outstanding 与 denied/withdrawn 不得互换。',
  '没有内部资金机会成本但存在匹配基准时只报告 observable all-in spread，不得生成 EFP；若匹配基准也缺失则状态为not-comparable，3.10 的银行端目标残余回报不得复用为借款人EFP。',
  '担保贷款、银行贷款、总外部融资、内部现金和真实支出分别建账；第一项变化不能直接命名为最后一项效应。',
  'event、valuation、appraisal、statement-end、publication、revision、contract-test、decision 与 outcome clocks 全部保留；publicationTime晚于decisionTime的数据不得进入当时信息集。',
  '银行共同资金/资本状态或风险容忍度变化时，识别标签降级为joint-channel并路由3.10/3.12；住房、margin和fire-sale机制分别路由3.16、7.12与7.13。',
  '所有互动与canonical数值显式标为SYNTHETIC；会计闭合、数值断言或条件模拟通过不会把identificationStatus升级为因果。',
] as const;

const dynamicRefreshChecklist = [
  { source: 'Fed Z.1 S11.1.b', refresh: '最新release、observation quarter、USD billions、期末存量/非季调、部门边界、资产逐项估值基础与修订', use: '部门资产—负债—净值存量桥；不是企业抵押池。', sourceIds: [27] },
  { source: 'Fed Z.1 S11.1.t / S11.1.r', refresh: '把S11.1.t的季度SAAR交易流与S11.1.r非季调的净值变化桥分开，分别记录release、observation quarter、单位与修订', use: '分开交易积累、重估和其他变化；SAAR不是当季发生额，非季调净值桥也不是因果分解。', sourceIds: [28, 37] },
  { source: 'Fed Z.1 S11.1.i.a', refresh: '年度整合账户的release、calendar year、USD billions、账户段与修订；不要标作季度', use: '年度闭合收入、资本、金融、重估与资产负债表账户；短期研究应另取S11.1.i.q并重建护照。', sourceIds: [47] },
  { source: 'BIS DSR', refresh: 'release date、国家、NFC sector、利率与平均期限假设、频率和修订', use: '总量偿债压力背景；不是企业DSCR。', sourceIds: [25] },
  { source: 'World Bank Enterprise Surveys', refresh: 'wave、sample frame、weights、问卷版本、finance items、缺失和气馁借款人', use: '企业融资与抵押描述；横截面回答不自动因果。', sourceIds: [31] },
  { source: 'ECB SAFE / IMF GDD / OECD SME', refresh: '调查期、净比例定义、工具范围、国家覆盖、版本与聚合口径', use: '融资环境和跨国背景；不替代合同级容量。', sourceIds: [48, 49, 50] },
] as const;

const evidenceGroups = [
  { title: 'A｜净值、契约、配给与金融加速器', text: 'S01–S06、S11、S17–S18、S29、S51 建立净值、核查、有限承诺、债务悬置、信贷配给和动态放大；这些模型给出机制，不提供跨企业固定弹性。', ids: [1, 2, 3, 4, 5, 6, 11, 17, 18, 29, 51] },
  { title: 'B｜抵押品、再部署性与法律制度', text: 'S07–S08、S12–S14、S26、S30、S32–S34、S39–S43 连接担保权、登记、顺位、资产可售性、回收、法律改革与重谈；具体个案仍需当地法律和合同。', ids: [7, 8, 12, 13, 14, 26, 30, 32, 33, 34, 39, 40, 41, 42, 43] },
  { title: 'C｜企业借款约束、抵押识别与反证', text: 'S09–S10、S15–S16、S21–S22、S35–S36、S44–S46、S54 支持资产/收益约束、房地产准实验、多银行识别、融资工具替代与代理指标批判；任何单一特征或固定效应都不是充分识别条件。', ids: [9, 10, 15, 16, 21, 22, 35, 36, 44, 45, 46, 54] },
  { title: 'D｜家庭、投资与经营支出边界', text: 'S19、S23–S24、S38、S52–S53、S55 提供住房抵押、消费、创业、投资等待、财务困境与库存调整证据；家庭制度细节路由3.16，模型阈值、调查计划与相关差异都不等于实现的因果效应。', ids: [19, 23, 24, 38, 52, 53, 55] },
  { title: 'E｜官方存量、流量、偿债与企业调查', text: 'S20、S25、S27–S28、S31、S37、S47–S50 提供可刷新数据入口；聚合统计不含企业担保权、合同headroom或因果反事实。', ids: [20, 25, 27, 28, 31, 37, 47, 48, 49, 50] },
] as const;

const lesson311AnchorIds = new Set([
  'thesis', 'scope-route', ...conceptSections.map(({ id }) => id),
  'capacity-normalisation', 'observable-versus-latent', 'financing-versus-investment', 'debt-overhang', 'shock-versus-amplification', 'total-external-finance',
  'interactive-lab', 'static-twins', 'balance-sheet-collateral-static-twins', 'checks-glossary', 'interfaces-reading',
]);
const scenarioAnchorCoverage = balanceSheetCollateralScenarios.every((scenario) => lesson311AnchorIds.has(scenario.primarySectionId) && scenario.remediationSectionIds.every((id) => lesson311AnchorIds.has(id)));
const conceptNumberCoverage = conceptSections.length === 55 && conceptSections.every(({ number }, index) => number === index + 2);
const conceptIdCoverage = new Set(conceptSections.map(({ id }) => id)).size === conceptSections.length;
const lesson311ReferenceIds = new Set(lesson311References.map(({ id }) => id));
const lesson311LocalCitationIds = [
  ...conceptSections.flatMap(({ sourceIds }) => sourceIds),
  ...checks.flatMap(({ sourceIds }) => sourceIds),
  ...dynamicRefreshChecklist.flatMap(({ sourceIds }) => sourceIds),
  ...evidenceGroups.flatMap(({ ids }) => ids),
  ...balanceSheetCollateralScenarios.flatMap((scenario) => [...scenario.sourceIds, ...scenario.staticTwin.sourceIds]),
];
const lesson311EvidenceIntegrity = lesson311References.every(({ id }, index) => id === index + 1)
  && lesson311LocalCitationIds.every((id) => lesson311ReferenceIds.has(id))
  && lesson311References.every(({ id }) => lesson311LocalCitationIds.includes(id))
  && lesson311References.every(({ use, url }) => use.includes('支持') && use.includes('不支持') && /^https:\/\//.test(url));
const staticTwinCoverage = balanceSheetCollateralScenarios.length === 10
  && new Set(balanceSheetCollateralScenarios.map(({ staticTwin }) => staticTwin.id)).size === 10
  && balanceSheetCollateralScenarios.every(({ staticTwin }) => staticTwin.correct === 'a' || staticTwin.correct === 'b' || staticTwin.correct === 'c');
const fixtureAndScenarioGate = balanceSheetCollateralScenarioAssertions.every(({ passed }) => passed)
  && balanceSheetCollateralNumericAssertionAudit.every(({ passed }) => passed);

if (!scenarioAnchorCoverage || !conceptNumberCoverage || !conceptIdCoverage || !lesson311EvidenceIntegrity || !staticTwinCoverage || !fixtureAndScenarioGate) {
  throw new Error('3.11 section sequence, remediation anchors, evidence map, static twins or numeric fixtures failed the build gate.');
}

function Lesson311Content() {
  return (
    <>
      <section className="lesson-section lesson-thesis" id="thesis">
        <p className="section-kicker">00 · CORE THESIS</p>
        <h2>资产价格不会直接“变成”贷款和投资；它先改变借款人的净值、可承诺资源与合同余量，再经融资价格、数量、替代与真实支出形成反馈。</h2>
        <div className="equation-card"><span>3.11 的唯一主线</span><div><code>资产价值 / 现金流冲击 → 借款人净值与可质押资源 → 借款容量 / EFP → 投资、库存、工资与就业 → 未来利润与净值</code></div><p>每个箭头都是一个需要独立测量和可能失败的机制门；会计恒等式、相关性或合成计算器都不能越级替代因果证据。</p></div>
        <p>本章位于信用传导的借款人一侧。3.10 已经说明银行如何把资金、资本、流动性与冻结的借款人风险变成贷款要约；3.11 读取那份要约、审批、合同与关系 stateId，然后只让借款人的资产、负债、现金流、担保权和项目选择发生变化。这样才能区分“银行自己不愿或不能放贷”与“同一家银行面对更弱借款人而改变条件”。两者在现实中经常同时出现，但若概念上不拆开，经验上就无法分别识别。<Cites ns={[1, 2, 4]} /></p>
        <p>最需要修正的直觉是把所有借款能力写成“房产价格 × LTV”。企业可能使用资产型 borrowing base，也可能主要受 Debt/EBITDA、ICR、DSCR、承诺额度与有限执行约束；Lian 与 Ma 在其美国非金融企业合同样本和分类中发现，约 20% 的债务价值主要基于资产、约 80% 主要基于经营现金流。这个比例不能外推为全球常数，却足以证明单一抵押公式不是通用模型。<Cites ns={[9, 10]} /></p>
        <p>本章因此先建立同一实体、同一估值和同一法域的资产负债表，再把 market、appraisal、liquidation 与 recovery value 分开；随后逐项计算抵押、收益与覆盖率容量，统一后取最小；最后才讨论融资替代、现金缓冲、真实支出和金融加速器。所有互动数字均为 <b>SYNTHETIC</b>，不是现实贷款资格、法律意见、政策预测或投资建议。</p>
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · SCOPE, BOUNDARIES & LEARNING ROUTE</p>
        <h2>学习顺序遵循“先权利与计量，后契约与行为，最后因果识别”。</h2>
        <BalanceSheetCollateralTransmissionChart />
        <div className="route-grid" role="group" aria-label="3.11四段学习路线">
          <article><span>ROUTE A · §02–14</span><h3>实体、资产与价值</h3><p>固定谁借款、谁拥有资产、用哪种价值、何时可得，再区分净值、现金与可执行担保。</p></article>
          <article><span>ROUTE B · §15–27</span><h3>摩擦、合同与容量</h3><p>从内部/外部融资、信息与执行摩擦，进入 borrowing base、LTV、收益、覆盖率和绑定约束。</p></article>
          <article><span>ROUTE C · §28–41</span><h3>真实支出与反馈</h3><p>把净值与容量分别接到融资价格、数量、替代、现金、投资、库存、工资和下一期净值。</p></article>
          <article><span>ROUTE D · §42–56</span><h3>Estimand 与识别</h3><p>逐层定义资产负债表、容量、融资与真实结果反事实，并审计地方需求、选择、测量和聚合。</p></article>
        </div>
        <div className="precision-note"><span>75–90 分钟核心首读</span><p>先读带 <b>CORE PATH</b> 标记的27个机制单元，重点完成 C1–C4，并用检查题 1、4、6–10、13–15 自测；带 <b>OPTIONAL DEEP DIVE</b> 的制度细节、异质性、全部实验、静态孪生题与阅读清单用于后续复读。这样首次学习维持一个 subchapter 的目标窗口，同时保留可出版的深读层，而不是删去必要边界。</p></div>
        <div className="precision-note"><span>严格章节所有权</span><p>3.10 拥有贷款人资金、资本、定价与配置；3.11 拥有借款人净值、可质押资源、融资楔子与行为；3.12 拥有银行筛选和风险容忍度；3.14/3.15 拥有信用与杠杆总量循环；3.16 拥有住房制度；7.12/7.13 拥有保证金与火售传染。跨界并非禁止研究，而是必须另立 stateId、估计量和联合渠道标签。</p></div>
      </section>

      {conceptSections.map((section) => <BorrowerConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">57 · INTERACTIVE SYNTHETIC LAB</p>
        <h2>十道主题题把净值、可质押价值、绑定约束、EFP、debt overhang、反馈、替代和识别放进同一套可恢复练习。</h2>
        <p>每道题必须先选择答案和置信度，再提交机制诊断。错误状态不会泄露正确答案、完整计算或来源；重做保留首次答案、首次置信度和提交次数。本设备只保存 3.11 的白名单作答记录，不保存题目、来源、C1–C7 控件或其他课程状态。无脚本和打印环境直接使用下一节 K1–K10 静态孪生题。</p>
        <BalanceSheetCollateralLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">58 · STATIC TWINS & NO-SCRIPT FALLBACK</p>
        <h2>K1–K10 改变参数或边界条件，用可见答案检验能否迁移，而不是背诵 M1–M10。</h2>
        <div className="case-grid" id="balance-sheet-collateral-static-twins">
          {balanceSheetCollateralScenarios.map((scenario) => {
            const twin = scenario.staticTwin;
            return (
              <article className="case-card" key={twin.id}>
                <span>{twin.id} · STATIC · SYNTHETIC</span>
                <h3>{twin.title}</h3>
                <p>{twin.prompt}</p>
                <ol className="static-choice-list">{twin.choices.map((choice) => <li key={choice.id}><b>{choice.id.toUpperCase()}.</b> {choice.label}</li>)}</ol>
                <div className="precision-note"><span>答案与复算</span><p>{twin.answer}</p><ol>{twin.calculations.map((calculation) => <li key={calculation}>{calculation}</li>)}</ol>{twin.formulaUnits ? <p><b>单位：</b>{twin.formulaUnits}</p> : null}</div>
                <p className="section-sources"><b>本题依据：</b> <Cites ns={twin.sourceIds} /></p>
              </article>
            );
          })}
        </div>
        <div className="yield-fixture-audit" role="group" aria-label="3.11静态孪生与题库门禁">
          <span>静态孪生 {balanceSheetCollateralScenarios.length}/10 · 结构门 {balanceSheetCollateralScenarioAssertions.filter(({ passed }) => passed).length}/{balanceSheetCollateralScenarioAssertions.length} · 数值断言 {balanceSheetCollateralNumericAssertionAudit.filter(({ passed }) => passed).length}/{balanceSheetCollateralNumericAssertionAudit.length}</span>
          <ul>{balanceSheetCollateralScenarioAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.key}>{item.passed ? 'PASS' : 'FAIL'} · {item.key}</li>)}{balanceSheetCollateralNumericAssertionAudit.map((item) => <li className={item.passed ? 'passed' : ''} key={`${item.scenarioId}:${item.key}`}>{item.passed ? 'PASS' : 'FAIL'} · {item.scenarioId}.{item.key}</li>)}</ul>
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">59–61 · CHECKS, FORMULA AUDIT & GLOSSARY</p>
        <h2>先用问题检查边界，再用冻结断言复算数字，最后把相似术语重新分开。</h2>
        <div className="check-grid" role="group" aria-label="3.11检查题">
          {checks.map((check, index) => <details key={check.question}><summary>{String(index + 1).padStart(2, '0')} · {check.question}</summary><p>{check.answer} <Cites ns={check.sourceIds} /></p></details>)}
        </div>
        <BalanceSheetCollateralFixtureAudit />
        <div className="term-grid" aria-label="3.11术语表" role="group">
          {glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">62–63 · EVIDENCE, DATA PASSPORTS, INTERFACES & READING</p>
        <h2>最终交付不是一个“财务健康分数”，而是一份可复算、可证伪、可路由的借款人状态。</h2>
        <div className="precision-note" data-key-coverage={canonicalBorrowerCollateralFieldCoverage && canonicalBorrowerCollateralRuntimeCoverage ? 'complete' : 'incomplete'}>
          <span>3.11 canonical state contract · {canonicalBorrowerCollateralFields.length} 个顶层键 · compile/runtime 双重闭合</span>
          <p><code>{canonicalBorrowerCollateralFields.join(', ')}</code>。一个非空 SYNTHETIC 状态真实引用 3.10 的 <code>{upstreamLoanContract?.contractId ?? 'MISSING_CONTRACT'}</code>、<code>{upstreamLoanOffer?.offerId ?? 'MISSING_OFFER'}</code> 与 <code>{upstreamCreditDecision?.applicationId ?? 'MISSING_APPLICATION'}</code>。上游 aggregate collateralId <code>{upstreamLoanContract?.collateralIds.join(', ') ?? 'MISSING_COLLATERAL'}</code> 通过显式 crosswalk 映射到本页两个 local collateralId / assetId；该分解、borrowing-base规则、Debt/EBITDA、ICR、DSCR与24个月月度摊还均标为 <b>synthetic 3.11 enrichment</b>，不是声称它们已经存在于3.10合同字段。运行门重新求和资产1000、负债700、净值300、合同净债务90、抵押池97、已提款80与抵押余量17；逐式复算收益30、ICR 21.0526、DSCR 7.5439和硬提款上限下可用未提款额0，确认五项同目标容量取唯一最小值0。它还验证crosswalk与字段provenance、净值期际桥、80% draw cap解释、名义未提款额与实际可用额分账、外部融资−12加现金5后的资源变化−7与正短缺7、all-in spread和EFP分账、担保权、来源时钟及结果顺序。任何公式、映射或合同全集门失败，模块在构建时停止。</p>
        </div>
        <h3>生产者侧不变量</h3>
        <ol className="contract-list">{contractInvariants.map((rule, index) => <li key={rule}><b>{String(index + 1).padStart(2, '0')}</b><span>{rule}</span></li>)}</ol>
        <h3>动态来源刷新护照</h3>
        <div className="interface-grid" role="group" aria-label="3.11动态来源刷新清单">{dynamicRefreshChecklist.map((item) => <article key={item.source}><span>{item.source}</span><p><b>刷新：</b>{item.refresh}</p><p><b>允许用途：</b>{item.use} <Cites ns={item.sourceIds} /></p></article>)}</div>
        <p className="precision-note"><span>动态值声明</span>本页没有把任何 2026-09-03 以后会变化的网页数值冻结成永久事实。Fed、BIS、World Bank、ECB、IMF 与 OECD 条目提供来源身份、当前表号和刷新规则；用于实证前必须重新取数并记录 release、observation、publication、revision 与 retrieved-at。Fed 仅使用 2026-06-11 后的 S11.1.b、S11.1.t、S11.1.r 与年度 S11.1.i.a，不再使用旧 B.103/R.103/F.103 路径；存量、SAAR交易流、重估桥和年度整合账户各有独立护照。</p>
        <h3>证据地图</h3>
        <div className="evidence-map" aria-label={`3.11连续覆盖${lesson311References.length}条来源的证据地图`} role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} <Cites ns={group.ids} /></p></div>)}</div>
        <h3>跨章接口</h3>
        <div className="interface-grid" role="group" aria-label="3.11跨章接口">{interfaces.map((item) => <article key={item.name}><span>{item.name}</span><p><b>Payload：</b>{item.payload}</p><p><b>Guardrail：</b>{item.guardrail}</p></article>)}</div>
        <div className="precision-note"><span>Reading list 使用顺序</span><p>建议先读净值与契约模型，再读企业抵押识别和反证，随后进入法律/登记、约束测量争论、真实支出与官方数据。每条延伸阅读已经给出具体页段、要回答的问题与不可外推边界；不要按标题把模型预测直接当成现实事实。</p></div>
        <p><b>完成标准：</b>读者应能从一项资产价格或现金流冲击开始，先冻结借款法律实体、所有权、价值与时钟，逐项重算可质押和偿债容量，在统一目标上找出 binding constraint；随后分开 all-in spread 与 EFP、设施融资与总外部融资、内部现金与真实支出，最后为每个箭头提出可失败的识别检验。只有做到这些，才真正理解了借款人资产负债表渠道，而不是记住“抵押品上涨所以贷款增加”的口号。</p>
      </section>
    </>
  );
}

export const lesson311: LessonRecord = {
  slug: '3-11',
  id: '3.11',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Borrower Balance Sheet / Collateral Channel：借款人净值、可质押价值、借款容量与金融加速器',
  subtitle: '资产价值和现金流冲击怎样进入同一法律实体的净值与可承诺资源，资产型、收益型和覆盖率约束如何共同决定融资容量，以及融资价格、替代与真实支出怎样闭合为可识别的借款人侧反馈',
  readingTime: 'CORE PATH 首读约 75–90 分钟；完整正文与机制复算约 390–510 分钟；C1–C7 全部机制实验约 60–85 分钟，互动题首次完成约 45–60 分钟／含复盘约 70–95 分钟，K1–K10、检查题、术语与接口约 90–120 分钟；55条来源与延伸阅读不计',
  prerequisite: 'T02 Compounding / Discounting、T03 Expectation / Variance、T05 Regression / Causality、T06 Balance Sheet、T07 Financial Instruments、T08 Time / Vintage；2.06 Financial Institutions；3.07 Yield Curve、3.08 Real Interest Rate、3.09 Bank Credit Creation、3.10 Bank Lending Channel',
  updatedAt: '2026-09-03',
  revision: '3.11-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-03',
      decision: 'approved',
      revision: '3.11-r2',
      summary:
        '独立终审 §00–63、55 个机制节、C1–C7、M1–M10、K1–K10、canonical borrower/contract/collateral state、H1–H6、55 条连续来源与 11 项延伸阅读；逐式复算净值、borrowing base、五约束统一容量、spread/EFP、债务悬置和识别门，实时核验 Fed S11.1.b/t/r/i.a、BIS、Basel、UNCITRAL、World Bank 与核心论文，并确认 57/57、37/37、11/11、类型、规范、生产构建、SSR 与跨章 provenance 门通过。skip-link 修复版复核后 P0–P3 为 0，开审与结束 16 项哈希逐项一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-03',
      decision: 'approved',
      revision: '3.11-r2',
      summary:
        '独立终审零背景教学递进、27 项 CORE PATH、C1–C7、M/K 门控与恢复状态、动态护照、无脚本静态孪生、响应式、打印和可访问性结构；先因 61 项目录缺少键盘绕过机制拒绝批准，修复后确认 skip link 为首个焦点、唯一正文目标可聚焦且保留 92px 偏移，165 个 ID 唯一、521 个页内链接闭合，生产构建与全部断言无回归。本轮浏览器控制不可用，未把真实 Tab、axe 或像素观察伪报为本审稿人实测；其余 P0–P3 为 0，起止 16 项哈希一致。',
    },
  ],
  previous: { slug: '3-10', label: '3.10 Bank Lending Channel' },
  next: { label: '3.12 Risk-taking Channel' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Evidence / Interfaces / Reading' },
  ],
  Content: Lesson311Content,
  references: lesson311References,
  readingList: lesson311ReadingList,
  readingListOrder: 'source',
};
