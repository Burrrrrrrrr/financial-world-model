import type { ReactNode } from 'react';
import BankLendingLab from '../components/BankLendingLab';
import {
  AllInLoanPricingLab,
  BankBorrowerAllocationLab,
  BankLendingFixtureAudit,
  CreditMenuRationingLab,
  FundingMixBetaLab,
  LendingEstimandLab,
  RepricingClockLab,
  UnifiedCapacityLab,
} from '../components/BankLendingMechanismLabs';
import BankLendingTransmissionChart from '../components/BankLendingTransmissionChart';
import { bankLendingScenarios } from '../components/bankLendingScenarios';
import { lesson309SyntheticExpectedNetReturn, type ExpectedNetReturnObservation } from './lesson-3-09';
import {
  lesson310DynamicCommonRequirements,
  lesson310DynamicSourceRequirements,
  lesson310ReadingList,
  lesson310References,
  lesson310SourceIdentityPassports,
} from './lesson-3-10-sources';
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

function BankLendingConceptSection({ section }: { section: ConceptSection }) {
  return (
    <section className="lesson-section" id={section.id}>
      <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label}</p>
      <h2>{section.title}</h2>
      {section.formula ? <div className="equation-card"><span>{section.formula.label}</span><div><code>{section.formula.expression}</code></div><p>{section.formula.note}</p></div> : null}
      {section.paragraphs.map((paragraph, index) => <p key={`${section.id}:${index}`}>{paragraph}</p>)}
      {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
      {section.after}
      <p className="section-sources"><b>本节依据：</b> <Cites ns={section.sourceIds} /></p>
    </section>
  );
}

export type NullableNumber = number | null;
export type MeasurementFlag = 'observed' | 'estimated' | 'imputed' | 'synthetic' | 'stale' | 'reclassified' | 'structural-break' | 'not-collected' | 'not-applicable' | 'confidential' | 'unknown';
export type IdentificationStatus = 'descriptive' | 'candidate-shock' | 'identified';

export type RateObservation = {
  valuePctPointsPerYear: NullableNumber;
  rateConcept: string | null;
  annualisation: string | null;
  currency: string | null;
  tenor: string | null;
  observationTime: string | null;
};

export type AmountObservation = {
  amount: NullableNumber;
  currency: string | null;
  unitMultiplier: number | null;
  nominalBasis: string | null;
  measurementBasis: string | null;
  observationTime: string | null;
};

export type UpstreamHeadroomState = {
  amount: NullableNumber;
  currency: string | null;
  horizon: string | null;
  capacityUnit: string | null;
};

export type UpstreamPointer = {
  lessonId: '3.05' | '3.06' | '3.07' | '3.08' | '3.09' | '3.23';
  stateId: string | null;
  fieldPaths: string[];
  observationTime: string | null;
  publicationTime: string | null;
  revisionVintage: string | null;
};

export type FundingSourceState = {
  sourceId: string;
  sourceType: 'noninterest-deposit' | 'interest-deposit' | 'wholesale-unsecured' | 'secured' | 'term-debt' | 'central-bank' | 'equity' | 'other';
  stockWeightRatio: NullableNumber;
  marginalFundingShareRatio: NullableNumber;
  averageCostPctPointsPerYear: NullableNumber;
  marginalCostPctPointsPerYear: NullableNumber;
  passThroughCoefficient: NullableNumber;
  pricingTreatment: 'funding-cost' | 'capital-shadow-cost' | 'excluded';
  repricingBucket: string | null;
  maturityBucket: string | null;
  hedgeStatus: string | null;
  collateralIds: string[];
};

export type ConstraintCapacity = {
  constraintId: 'risk-capital' | 'leverage' | 'liquidity' | 'stable-funding' | 'concentration' | 'funding' | 'profitability';
  currentRatio: NullableNumber;
  applicableThresholdRatio: NullableNumber;
  thresholdDirection: 'minimum' | 'maximum' | null;
  bufferRatio: NullableNumber;
  numerator: AmountObservation | null;
  denominator: AmountObservation | null;
  rawHeadroomAmount: AmountObservation | null;
  marginalUsagePerLoanUnit: NullableNumber;
  conversionFormula: string | null;
  convertedLoanCapacityAmount: NullableNumber;
  capacityUnit: string | null;
  nativeHorizon: string | null;
  ruleVersion: string | null;
};

export type ConstraintMappingTarget = {
  loanInstrumentId: string | null;
  lenderLegalEntityId: string | null;
  currency: string | null;
  decisionTime: string | null;
  mappingBasis: string | null;
  comparableLoanPrincipalUnit: string | null;
};

export type LoanContractPassport = {
  contractId: string;
  lenderLegalEntityId: string | null;
  borrowerId: string | null;
  borrowerSector: string | null;
  jurisdiction: string | null;
  currency: string | null;
  product: string | null;
  purpose: string | null;
  applicationAmount: AmountObservation | null;
  approvedAmount: AmountObservation | null;
  commitmentAmount: AmountObservation | null;
  originationAmount: AmountObservation | null;
  drawnAmount: AmountObservation | null;
  outstandingAmount: AmountObservation | null;
  fixedFloating: 'fixed' | 'floating' | 'mixed' | 'unknown';
  benchmarkId: string | null;
  contractualSpreadBp: NullableNumber;
  upfrontFeeAmount: AmountObservation | null;
  recurringFeePctPointsPerYear: NullableNumber;
  floorPctPointsPerYear: NullableNumber;
  resetFrequency: string | null;
  maturityAt: string | null;
  eventTimes: { applicationAt: string | null; approvalAt: string | null; commitmentAt: string | null; signingAt: string | null; originationAt: string | null; drawAt: string | null };
  collateralIds: string[];
  guaranteeIds: string[];
  covenantIds: string[];
};

export type QuoteCostComponent = {
  componentId: 'funding-wedge' | 'expected-loss' | 'operations' | 'capital-shadow-cost' | 'liquidity-shadow-cost' | 'concentration-opportunity-cost' | 'target-residual-return';
  valuePctPointsPerYear: NullableNumber;
  exposureBasis: string | null;
  horizon: string | null;
  sourceCalculation: string | null;
  includedCostIds: string[];
};

export type LoanOfferState = {
  offerId: string;
  benchmarkRate: RateObservation | null;
  componentLedger: QuoteCostComponent[];
  nominalOfferRatePctPointsPerYear: NullableNumber;
  annualisedFeePctPointsPerYear: NullableNumber;
  allInOfferRatePctPointsPerYear: NullableNumber;
  nonpriceTerms: string[];
  validFrom: string | null;
  validUntil: string | null;
};

export type CreditDecisionState = {
  applicationId: string | null;
  stage: 'application' | 'approval' | 'commitment' | 'origination' | 'draw' | 'renewal' | 'rejection' | 'termination' | null;
  approvalStatus: 'approved' | 'conditional' | 'rejected' | 'withdrawn' | 'pending' | null;
  requestedAmount: AmountObservation | null;
  offeredLimit: AmountObservation | null;
  originatedAmount: AmountObservation | null;
  drawnAmount: AmountObservation | null;
  outstandingAmount: AmountObservation | null;
  decisionReasonCodes: string[];
  decisionTime: string | null;
};

export type DynamicDataPassport = {
  sourceId: string;
  provider: string | null;
  retrievedAtUTC: string | null;
  releaseDate: string | null;
  sourceVersion: string | null;
  seriesKeyTableOrItem: string | null;
  jurisdiction: string | null;
  institutionalUniverse: string | null;
  consolidationBasis: string | null;
  lenderType: string | null;
  borrowerSector: string | null;
  loanPurpose: string | null;
  instrument: string | null;
  currency: string | null;
  residency: string | null;
  creditStageConcept: 'application' | 'approval' | 'commitment' | 'origination' | 'draw' | 'outstanding' | null;
  rateConcept: string | null;
  newBusinessOrStock: 'new-business' | 'stock' | 'not-applicable' | null;
  fixedFloatingResetBucket: string | null;
  maturity: string | null;
  collateralGuaranteeFlag: string | null;
  frequency: string | null;
  observationDate: string | null;
  publicationDate: string | null;
  vintageRevisionDate: string | null;
  unit: string | null;
  seasonalAdjustment: string | null;
  weightingAggregation: string | null;
  methodologyURL: string | null;
  licenseAccess: string | null;
  accessStatus: 'public' | 'restricted' | 'blocked-automated-access' | 'unknown';
  confidentiality: string | null;
  missingReclassificationStructuralBreakFlags: string[];
  fieldMissingReasons: { fieldPath: string; reason: 'unknown' | 'not-applicable' | 'confidential' | 'not-collected'; note: string | null }[];
  measurementFlag: MeasurementFlag;
};

export type EstimandRecord = {
  estimandId: 'pair' | 'borrower-total-external-finance' | 'real-outcome';
  status: IdentificationStatus;
  estimate: NullableNumber;
  unit: string | null;
  treatmentScale: string | null;
  horizon: string | null;
  supportPopulation: string | null;
  designId: string | null;
  standardError: NullableNumber;
  confidenceInterval: [number, number] | null;
  clusteringLevel: string | null;
  criticalAssumptions: string[];
  observationWindow: string | null;
};

export type BankLendingChannelState = {
  schemaVersion: string;
  stateId: string;
  scope: { jurisdiction: string | null; currency: string | null; lenderLegalEntityId: string | null; borrowerUniverse: string | null; consolidationBasis: string | null };
  inputLineage: UpstreamPointer[];
  policyImplementationState: { effectiveOvernightRate: RateObservation | null; administeredTerms: string[]; facilityAccess: string | null; collateralStateId: string | null; liquidityBufferStateId: string | null; rateDispersionPct: NullableNumber };
  curveState: { zeroCouponCurveId: string | null; forwardCurveId: string | null; levelFactor: NullableNumber; slopeFactor: NullableNumber; expectedShortRatePathId: string | null; decompositionEstimateRange: [number, number] | null };
  realRatePricingState: { nominalCurveInputId: string | null; modelRealRiskFreeCurveId: string | null; exAntePolicyRealRate: RateObservation | null; realRateGapPct: NullableNumber; claimSpecificPremiumSchemaId: string | null };
  bankCreditInputState: { creditStateId: string | null; fundingMixStateId: string | null; eligibleDemand: UpstreamHeadroomState | null; expectedNetReturn: ExpectedNetReturnObservation | null };
  frozenRiskState: { borrowerStateId: string | null; pdPctPoints: NullableNumber; lgdPctPoints: NullableNumber; ead: AmountObservation | null; collateralValue: AmountObservation | null; bankRiskToleranceScore0To100: NullableNumber; freezeScope: string[]; asOf: string | null };
  bankFundingState: { sources: FundingSourceState[]; averageFundingCostPctPointsPerYear: NullableNumber; marginalFundingCostPctPointsPerYear: NullableNumber; replacementFundingCostPctPointsPerYear: NullableNumber; depositOutflowRatio: NullableNumber; repricingBuckets: { bucket: string; shareRatio: NullableNumber; nextResetAt: string | null }[] };
  bankConstraintState: { upstreamHeadrooms: { capital: UpstreamHeadroomState | null; leverage: UpstreamHeadroomState | null; liquidity: UpstreamHeadroomState | null; stableFunding: UpstreamHeadroomState | null; concentration: UpstreamHeadroomState | null }; capacities: ConstraintCapacity[]; bindingConstraintIds: ConstraintCapacity['constraintId'][]; mappingTarget: ConstraintMappingTarget };
  loanContractPassport: LoanContractPassport | null;
  loanOfferState: LoanOfferState | null;
  creditDecisionState: CreditDecisionState | null;
  relationshipState: { relationshipId: string | null; startDate: string | null; informationCapitalProxy0To1: NullableNumber; primaryBankFlag: boolean | null; existingOrNew: 'existing' | 'new' | 'unknown'; switchingCostProxy0To1: NullableNumber };
  allocationState: { bankPortfolioId: string | null; borrowerRank: NullableNumber; loanTypeShareChangeRatio: NullableNumber; securitiesShareChangeRatio: NullableNumber; coreClientFlag: boolean | null; geographyOrIndustryExpertise: string[] };
  substitutionState: { originalPairChange: AmountObservation | null; otherBankChange: AmountObservation | null; bondFinanceChange: AmountObservation | null; nonbankFinanceChange: AmountObservation | null; borrowerTotalExternalFinanceChange: AmountObservation | null; internalCashBufferUse: AmountObservation | null; postCashResourceChange: AmountObservation | null; externalFinanceSubstitutionRateRatio: NullableNumber; supportStatus: string | null };
  realOutcomeState: { outcomeName: string | null; observedChange: AmountObservation | null; horizon: string | null; sample: string | null; observationWindow: string | null };
  identificationState: { channelStatus: IdentificationStatus; estimands: { pair: EstimandRecord; borrowerTotalExternalFinance: EstimandRecord; realOutcome: EstimandRecord }; shockSource: string | null; demandControls: string[]; placeboIds: string[]; aggregationLevels: string[] };
  dynamicDataPassports: DynamicDataPassport[];
  measurementFlags: { fieldPath: string; flag: MeasurementFlag; note: string | null }[];
  timestamps: { eventTime: string | null; observationTime: string | null; publicationTime: string | null; revisionVintage: string | null; retrievedAtUTC: string | null };
};

const canonicalBankLendingStateFields = [
  'schemaVersion', 'stateId', 'scope', 'inputLineage', 'policyImplementationState', 'curveState',
  'realRatePricingState', 'bankCreditInputState', 'frozenRiskState', 'bankFundingState', 'bankConstraintState', 'loanContractPassport', 'loanOfferState', 'creditDecisionState',
  'relationshipState', 'allocationState', 'substitutionState', 'realOutcomeState', 'identificationState',
  'dynamicDataPassports', 'measurementFlags', 'timestamps',
] as const satisfies readonly (keyof BankLendingChannelState)[];

const canonicalBankLendingStateFieldCoverage = true satisfies Exclude<keyof BankLendingChannelState, (typeof canonicalBankLendingStateFields)[number]> extends never ? true : false;

const amount = (value: number, basis: string): AmountObservation => ({ amount: value, currency: 'SYN', unitMultiplier: 1, nominalBasis: 'nominal-SYN-units', measurementBasis: basis, observationTime: '2026-09-02T00:00:00Z' });
const headroom = (value: number, capacityUnit: string, horizon = '12m'): UpstreamHeadroomState => ({ amount: value, currency: 'SYN', horizon, capacityUnit });
const rate = (value: number, concept: string, tenor: string): RateObservation => ({ valuePctPointsPerYear: value, rateConcept: concept, annualisation: 'simple-annual-percent', currency: 'SYN', tenor, observationTime: '2026-09-02T00:00:00Z' });
const canonicalUpstreamExpectedNetReturn: ExpectedNetReturnObservation = lesson309SyntheticExpectedNetReturn;
const lesson309ExpectedNetReturnRuntimeCoverage = Object.keys(canonicalUpstreamExpectedNetReturn).length === 6
  && Number.isFinite(canonicalUpstreamExpectedNetReturn.valuePctPointsPerYear)
  && canonicalUpstreamExpectedNetReturn.valuePctPointsPerYear === 1.2
  && canonicalUpstreamExpectedNetReturn.rateConcept === 'risk-adjusted-expected-net-return'
  && canonicalUpstreamExpectedNetReturn.annualisation === 'simple-annual-percent'
  && canonicalUpstreamExpectedNetReturn.currency === 'SYN'
  && canonicalUpstreamExpectedNetReturn.horizon === '24m'
  && canonicalUpstreamExpectedNetReturn.observationTime === '2026-09-02T00:00:00Z'
  && !Object.prototype.hasOwnProperty.call(canonicalUpstreamExpectedNetReturn, 'amount')
  && !Object.prototype.hasOwnProperty.call(canonicalUpstreamExpectedNetReturn, 'capacityUnit');

if (!lesson309ExpectedNetReturnRuntimeCoverage) {
  throw new Error('3.09 → 3.10 expectedNetReturn cross-chapter contract failed its imported rate-observation gate.');
}

type ConstraintArithmeticInput = Pick<ConstraintCapacity, 'applicableThresholdRatio' | 'thresholdDirection' | 'numerator' | 'denominator'>;

const deriveConstraintArithmetic = ({
  applicableThresholdRatio,
  thresholdDirection,
  numerator,
  denominator,
}: ConstraintArithmeticInput): { currentRatio: number; bufferRatio: number; rawHeadroomAmount: number } | null => {
  const numeratorAmount = numerator?.amount;
  const denominatorAmount = denominator?.amount;
  if (
    applicableThresholdRatio === null
    || thresholdDirection === null
    || numeratorAmount === null
    || numeratorAmount === undefined
    || denominatorAmount === null
    || denominatorAmount === undefined
    || !Number.isFinite(applicableThresholdRatio)
    || !Number.isFinite(numeratorAmount)
    || !Number.isFinite(denominatorAmount)
    || denominatorAmount <= 0
  ) return null;
  const currentRatio = numeratorAmount / denominatorAmount;
  const directionSign = thresholdDirection === 'minimum' ? 1 : -1;
  return {
    currentRatio,
    bufferRatio: directionSign * (currentRatio - applicableThresholdRatio),
    rawHeadroomAmount: directionSign * (numeratorAmount - applicableThresholdRatio * denominatorAmount),
  };
};

const capacity = (
  constraintId: ConstraintCapacity['constraintId'],
  numeratorAmount: number,
  denominatorAmount: number,
  applicableThresholdRatio: number,
  thresholdDirection: Exclude<ConstraintCapacity['thresholdDirection'], null>,
  marginalUsagePerLoanUnit: number,
  nativeHorizon: string,
): ConstraintCapacity => {
  const numerator = amount(numeratorAmount, `${constraintId}-numerator`);
  const denominator = amount(denominatorAmount, `${constraintId}-denominator`);
  const arithmetic = deriveConstraintArithmetic({ applicableThresholdRatio, thresholdDirection, numerator, denominator });
  if (arithmetic === null || !Number.isFinite(marginalUsagePerLoanUnit) || marginalUsagePerLoanUnit <= 0) {
    throw new Error(`Invalid SYNTHETIC constraint fixture: ${constraintId}`);
  }
  return {
    constraintId,
    currentRatio: arithmetic.currentRatio,
    applicableThresholdRatio,
    thresholdDirection,
    bufferRatio: arithmetic.bufferRatio,
    numerator,
    denominator,
    rawHeadroomAmount: amount(arithmetic.rawHeadroomAmount, `${constraintId}-signed-native-headroom`),
    marginalUsagePerLoanUnit,
    conversionFormula: 'signed native headroom = direction × (numerator − threshold × denominator); converted loan capacity = signed native headroom / marginal usage per target-loan-principal unit',
    convertedLoanCapacityAmount: arithmetic.rawHeadroomAmount / marginalUsagePerLoanUnit,
    capacityUnit: 'SYN-target-loan-principal',
    nativeHorizon,
    ruleVersion: 'SYNTHETIC',
  };
};
const estimand = (
  estimandId: EstimandRecord['estimandId'],
  estimate: number,
  unit: string,
  horizon: string,
  supportPopulation: string,
  clusteringLevel: string,
): EstimandRecord => ({
  estimandId,
  status: 'descriptive',
  estimate,
  unit,
  treatmentScale: 'one-SYNTHETIC-bank-exposure-unit',
  horizon,
  supportPopulation,
  designId: 'SYNTHETIC_NOT_IDENTIFIED',
  standardError: null,
  confidenceInterval: null,
  clusteringLevel,
  criticalAssumptions: ['NO_CAUSAL_INTERPRETATION', 'INDEPENDENT_DESIGN_REQUIRED_FOR_STATUS_UPGRADE'],
  observationWindow: '2026-09-02/2027-09-02',
});

const canonicalQuoteComponentLedger: QuoteCostComponent[] = [
  { componentId: 'funding-wedge', valuePctPointsPerYear: 0.4, exposureBasis: '100 SYN matched-maturity loan principal', horizon: '24m', sourceCalculation: '3.4% matched-maturity MCF − 3.0% benchmark', includedCostIds: ['FUNDING_LIQUIDITY_SPREAD'] },
  { componentId: 'expected-loss', valuePctPointsPerYear: 0.8, exposureBasis: '100 SYN EAD / 100 SYN principal', horizon: '12m', sourceCalculation: '2% PD × 40% LGD × 100 EAD / 100 principal', includedCostIds: ['CREDIT_EXPECTED_LOSS'] },
  { componentId: 'operations', valuePctPointsPerYear: 0.3, exposureBasis: '100 SYN originated principal', horizon: '24m', sourceCalculation: 'synthetic allocated servicing and origination cost', includedCostIds: ['OPERATING_COST'] },
  { componentId: 'capital-shadow-cost', valuePctPointsPerYear: 0.4, exposureBasis: 'marginal risk-capital usage', horizon: '12m', sourceCalculation: 'capital usage × capital shadow price; equity funding is excluded from funding-cost ledger', includedCostIds: ['CAPITAL_SHADOW_COST'] },
  { componentId: 'liquidity-shadow-cost', valuePctPointsPerYear: 0.2, exposureBasis: 'marginal liquidity and stable-funding usage', horizon: '12m', sourceCalculation: 'excludes term-liquidity premium already in FUNDING_LIQUIDITY_SPREAD', includedCostIds: ['LIQUIDITY_CAPACITY_SHADOW_COST'] },
  { componentId: 'concentration-opportunity-cost', valuePctPointsPerYear: 0.1, exposureBasis: 'borrower-group exposure', horizon: '12m', sourceCalculation: 'portfolio-limit opportunity cost not included in capital model', includedCostIds: ['CONCENTRATION_OPPORTUNITY_COST'] },
  { componentId: 'target-residual-return', valuePctPointsPerYear: 0.5, exposureBasis: '100 SYN originated principal', horizon: '24m', sourceCalculation: 'nominal-rate residual target after benchmark and listed costs; annualised fees are explicitly excluded and reconciled only in all-in revenue', includedCostIds: ['TARGET_RESIDUAL_RETURN'] },
];

export const canonicalBankLendingStateExample: BankLendingChannelState = {
  schemaVersion: '3.10-r3-contract',
  stateId: 'SYNTHETIC_BANK_LENDING_STATE',
  scope: { jurisdiction: 'SYNTHETIC', currency: 'SYN', lenderLegalEntityId: 'BANK_A', borrowerUniverse: 'matched-applications', consolidationBasis: 'solo' },
  inputLineage: [
    { lessonId: '3.06', stateId: 'SYNTHETIC_306', fieldPaths: ['effectiveOvernightRate', 'administeredTerms', 'facilityAccess', 'collateralState', 'liquidityBufferState', 'rateDispersion', 'timestamps'], observationTime: '2026-09-02T00:00:00Z', publicationTime: null, revisionVintage: 'SYNTHETIC' },
    { lessonId: '3.07', stateId: 'SYNTHETIC_307', fieldPaths: ['zeroCouponYields', 'forwardRates', 'levelFactor', 'slopeFactor', 'expectedShortRatePath', 'decompositionEstimateRange', 'timestamps'], observationTime: '2026-09-02T00:00:00Z', publicationTime: null, revisionVintage: 'SYNTHETIC' },
    { lessonId: '3.08', stateId: 'SYNTHETIC_308', fieldPaths: ['nominalCurveInput', 'realRateState.modelRealRiskFreeCurve', 'realRateState.exAntePolicyRealRate', 'realRateGap', 'pricingState.claimSpecificPremiumSchema', 'timestamps'], observationTime: '2026-09-02T00:00:00Z', publicationTime: null, revisionVintage: 'SYNTHETIC' },
    { lessonId: '3.09', stateId: 'SYNTHETIC_309', fieldPaths: ['creditState', 'constraintState.fundingMix', 'constraintState.eligibleDemand', 'constraintState.expectedNetReturn'], observationTime: '2026-09-02T00:00:00Z', publicationTime: null, revisionVintage: 'SYNTHETIC' },
  ],
  policyImplementationState: { effectiveOvernightRate: rate(3, 'effective-overnight', 'overnight'), administeredTerms: ['SYNTHETIC_TERM'], facilityAccess: 'eligible-not-drawn', collateralStateId: 'SYNTHETIC_COLLATERAL', liquidityBufferStateId: 'SYNTHETIC_LIQUIDITY', rateDispersionPct: 0.1 },
  curveState: { zeroCouponCurveId: 'SYNTHETIC_ZERO_CURVE', forwardCurveId: 'SYNTHETIC_FORWARD_CURVE', levelFactor: 3.2, slopeFactor: -0.4, expectedShortRatePathId: 'SYNTHETIC_EXPECTED_SHORT_PATH', decompositionEstimateRange: [-0.2, 0.2] },
  realRatePricingState: { nominalCurveInputId: 'SYNTHETIC_ZERO_CURVE', modelRealRiskFreeCurveId: 'SYNTHETIC_REAL_CURVE', exAntePolicyRealRate: rate(1, 'ex-ante-policy-real-rate', 'overnight'), realRateGapPct: 0.2, claimSpecificPremiumSchemaId: 'SYNTHETIC_PREMIUM_SCHEMA' },
  bankCreditInputState: { creditStateId: 'SYNTHETIC_309_CREDIT', fundingMixStateId: 'SYNTHETIC_309_FUNDING', eligibleDemand: headroom(120, 'eligible-requested-principal'), expectedNetReturn: canonicalUpstreamExpectedNetReturn },
  frozenRiskState: { borrowerStateId: 'SYNTHETIC_BORROWER_STATE', pdPctPoints: 2, lgdPctPoints: 40, ead: amount(100, 'exposure-at-default'), collateralValue: amount(80, 'frozen-collateral-value'), bankRiskToleranceScore0To100: 60, freezeScope: ['PD', 'LGD', 'EAD', 'collateral-value', 'bank-risk-tolerance'], asOf: '2026-09-02T00:00:00Z' },
  bankFundingState: { sources: [{ sourceId: 'DEPOSIT_A', sourceType: 'interest-deposit', stockWeightRatio: 0.7, marginalFundingShareRatio: 0.7, averageCostPctPointsPerYear: 1.5, marginalCostPctPointsPerYear: 3.2, passThroughCoefficient: 0.4, pricingTreatment: 'funding-cost', repricingBucket: '0-3m', maturityBucket: 'non-maturity', hedgeStatus: 'unhedged', collateralIds: [] }, { sourceId: 'WHOLESALE_A', sourceType: 'wholesale-unsecured', stockWeightRatio: 0.3, marginalFundingShareRatio: 0.3, averageCostPctPointsPerYear: 3.4, marginalCostPctPointsPerYear: 3.866666666666667, passThroughCoefficient: 1, pricingTreatment: 'funding-cost', repricingBucket: '0-1m', maturityBucket: '0-3m', hedgeStatus: 'unhedged', collateralIds: [] }], averageFundingCostPctPointsPerYear: 2.07, marginalFundingCostPctPointsPerYear: 3.4, replacementFundingCostPctPointsPerYear: 4, depositOutflowRatio: 0.05, repricingBuckets: [{ bucket: '0-3m', shareRatio: 1, nextResetAt: '2026-12-02T00:00:00Z' }] },
  bankConstraintState: {
    upstreamHeadrooms: {
      capital: headroom(25, 'SYN-risk-capital-native-headroom', 'point-in-time'),
      leverage: headroom(20, 'SYN-leverage-native-headroom', 'point-in-time'),
      liquidity: headroom(18, 'SYN-liquidity-native-headroom', '30d'),
      stableFunding: headroom(24, 'SYN-stable-funding-native-headroom'),
      concentration: headroom(14, 'SYN-concentration-native-headroom', 'point-in-time'),
    },
    capacities: [
      capacity('risk-capital', 130, 1_000, 0.105, 'minimum', 0.1, 'point-in-time'),
      capacity('leverage', 50, 1_000, 0.03, 'minimum', 1 / 12, 'point-in-time'),
      capacity('liquidity', 138, 120, 1, 'minimum', 0.1, '30d'),
      capacity('stable-funding', 224, 200, 1, 'minimum', 24 / 220, '12m'),
      capacity('concentration', 36, 200, 0.25, 'maximum', 0.07, 'point-in-time'),
    ],
    bindingConstraintIds: ['liquidity'],
    mappingTarget: {
      loanInstrumentId: 'SYNTHETIC_TERM_LOAN',
      lenderLegalEntityId: 'BANK_A',
      currency: 'SYN',
      decisionTime: '2026-09-02T00:00:00Z',
      mappingBasis: 'incremental-drawn-term-loan-principal',
      comparableLoanPrincipalUnit: 'SYN-target-loan-principal',
    },
  },
  loanContractPassport: { contractId: 'SYNTHETIC_LOAN_001', lenderLegalEntityId: 'BANK_A', borrowerId: 'FIRM_1', borrowerSector: 'nonfinancial-corporation', jurisdiction: 'SYNTHETIC', currency: 'SYN', product: 'term-loan', purpose: 'working-capital', applicationAmount: amount(120, 'requested-principal'), approvedAmount: amount(100, 'approved-limit'), commitmentAmount: amount(100, 'committed-limit'), originationAmount: amount(100, 'originated-principal'), drawnAmount: amount(80, 'drawn-principal'), outstandingAmount: amount(80, 'outstanding-principal'), fixedFloating: 'floating', benchmarkId: 'SYNTHETIC_REF_3M', contractualSpreadBp: 270, upfrontFeeAmount: amount(1, 'upfront-fee'), recurringFeePctPointsPerYear: 0, floorPctPointsPerYear: 0, resetFrequency: '3m', maturityAt: '2028-09-02T00:00:00Z', eventTimes: { applicationAt: '2026-08-03T00:00:00Z', approvalAt: '2026-08-12T00:00:00Z', commitmentAt: '2026-08-20T00:00:00Z', signingAt: '2026-08-25T00:00:00Z', originationAt: '2026-09-01T00:00:00Z', drawAt: '2026-09-02T00:00:00Z' }, collateralIds: ['SYNTHETIC_COLLATERAL_1'], guaranteeIds: [], covenantIds: ['SYNTHETIC_COVENANT_1'] },
  loanOfferState: { offerId: 'SYNTHETIC_OFFER_001', benchmarkRate: rate(3, 'contract-benchmark', '3m'), componentLedger: canonicalQuoteComponentLedger, nominalOfferRatePctPointsPerYear: 5.7, annualisedFeePctPointsPerYear: 0.5, allInOfferRatePctPointsPerYear: 6.2, nonpriceTerms: ['80% draw cap', 'quarterly covenant'], validFrom: '2026-09-02T00:00:00Z', validUntil: '2026-09-09T00:00:00Z' },
  creditDecisionState: { applicationId: 'SYNTHETIC_APPLICATION_001', stage: 'draw', approvalStatus: 'approved', requestedAmount: amount(120, 'requested-principal'), offeredLimit: amount(100, 'approved-limit'), originatedAmount: amount(100, 'originated-principal'), drawnAmount: amount(80, 'drawn-principal'), outstandingAmount: amount(80, 'outstanding-principal'), decisionReasonCodes: ['CAPACITY_AND_MARGIN'], decisionTime: '2026-09-02T00:00:00Z' },
  relationshipState: { relationshipId: 'SYNTHETIC_RELATIONSHIP_001', startDate: '2020-01-01', informationCapitalProxy0To1: 0.8, primaryBankFlag: true, existingOrNew: 'existing', switchingCostProxy0To1: 0.6 },
  allocationState: { bankPortfolioId: 'SYNTHETIC_PORTFOLIO_001', borrowerRank: 2, loanTypeShareChangeRatio: -0.02, securitiesShareChangeRatio: 0.02, coreClientFlag: true, geographyOrIndustryExpertise: ['SYNTHETIC_INDUSTRY_A'] },
  substitutionState: { originalPairChange: amount(-20, 'credit-change'), otherBankChange: amount(8, 'credit-change'), bondFinanceChange: amount(2, 'credit-change'), nonbankFinanceChange: amount(1, 'credit-change'), borrowerTotalExternalFinanceChange: amount(-9, 'external-finance-change'), internalCashBufferUse: amount(4, 'internal-cash-buffer-use'), postCashResourceChange: amount(-5, 'post-cash-resource-change'), externalFinanceSubstitutionRateRatio: 0.55, supportStatus: 'observed-window-only' },
  realOutcomeState: { outcomeName: 'investment', observedChange: amount(-3, 'observed-investment-change'), horizon: '12m', sample: 'SYNTHETIC_MATCHED_BORROWERS', observationWindow: '2026-09-02/2027-09-02' },
  identificationState: { channelStatus: 'descriptive', estimands: { pair: estimand('pair', -20, 'SYN-credit-change', '3m', 'multi-bank borrowers only', 'bank'), borrowerTotalExternalFinance: estimand('borrower-total-external-finance', -9, 'SYN-external-finance-change', '3m', 'SYNTHETIC_BORROWER_1', 'borrower'), realOutcome: estimand('real-outcome', -3, 'SYN-investment-change', '12m', 'SYNTHETIC_BORROWER_1', 'borrower') }, shockSource: null, demandControls: ['same-borrower comparison'], placeboIds: ['PRETREND_PLACEBO'], aggregationLevels: ['bank-borrower-pair', 'borrower-total-external-finance', 'borrower-real-outcome'] },
  dynamicDataPassports: [{ sourceId: 'SYNTHETIC_DYNAMIC_SOURCE', provider: 'SYNTHETIC', retrievedAtUTC: null, releaseDate: null, sourceVersion: 'SYNTHETIC_V1', seriesKeyTableOrItem: 'SYNTHETIC_ITEM', jurisdiction: 'SYNTHETIC', institutionalUniverse: 'SYNTHETIC_BANKS', consolidationBasis: 'solo', lenderType: 'deposit-taking-bank', borrowerSector: 'nonfinancial-corporation', loanPurpose: 'working-capital', instrument: 'term-loan', currency: 'SYN', residency: 'domestic', creditStageConcept: 'origination', rateConcept: 'all-in-equivalent', newBusinessOrStock: 'new-business', fixedFloatingResetBucket: 'floating-3m', maturity: '24m', collateralGuaranteeFlag: 'collateralised', frequency: 'event', observationDate: '2026-09-02', publicationDate: null, vintageRevisionDate: null, unit: 'SYN-percent-and-amount', seasonalAdjustment: 'not-applicable', weightingAggregation: 'contract-level', methodologyURL: null, licenseAccess: 'synthetic-teaching-fixture', accessStatus: 'public', confidentiality: 'none', missingReclassificationStructuralBreakFlags: ['NOT_EMPIRICAL_DATA'], fieldMissingReasons: [{ fieldPath: 'publicationDate', reason: 'not-applicable', note: 'Synthetic fixture has no publication event.' }, { fieldPath: 'retrievedAtUTC', reason: 'not-applicable', note: 'Synthetic fixture is generated locally.' }], measurementFlag: 'synthetic' }],
  measurementFlags: [{ fieldPath: '*', flag: 'synthetic', note: 'Teaching fixture; not empirical data and not a compliance assessment.' }],
  timestamps: { eventTime: '2026-09-02T00:00:00Z', observationTime: '2026-09-02T00:00:00Z', publicationTime: null, revisionVintage: '3.10-r3', retrievedAtUTC: null },
};

const almostEqual = (left: number | null | undefined, right: number, tolerance = 1e-9) => left !== null && left !== undefined && Number.isFinite(left) && Math.abs(left - right) <= tolerance;
const deriveBindingConstraintIds = (capacities: readonly Pick<ConstraintCapacity, 'constraintId' | 'convertedLoanCapacityAmount'>[]) => {
  if (capacities.length === 0 || capacities.some(({ convertedLoanCapacityAmount }) => convertedLoanCapacityAmount === null || !Number.isFinite(convertedLoanCapacityAmount))) return [];
  const minimumCapacity = Math.min(...capacities.map(({ convertedLoanCapacityAmount }) => convertedLoanCapacityAmount as number));
  return capacities
    .filter(({ convertedLoanCapacityAmount }) => almostEqual(convertedLoanCapacityAmount, minimumCapacity))
    .map(({ constraintId }) => constraintId);
};

const constraintArithmeticCounterexamples = [
  { id: 'LCR-minimum-breach', input: { numerator: amount(95, 'counterexample-LCR-numerator'), denominator: amount(100, 'counterexample-LCR-denominator'), applicableThresholdRatio: 1, thresholdDirection: 'minimum' as const }, expectedCurrentRatio: 0.95, expectedBufferRatio: -0.05, expectedRawHeadroomAmount: -5 },
  { id: 'NSFR-minimum-breach', input: { numerator: amount(98, 'counterexample-NSFR-numerator'), denominator: amount(100, 'counterexample-NSFR-denominator'), applicableThresholdRatio: 1, thresholdDirection: 'minimum' as const }, expectedCurrentRatio: 0.98, expectedBufferRatio: -0.02, expectedRawHeadroomAmount: -2 },
  { id: 'concentration-maximum-breach', input: { numerator: amount(28, 'counterexample-concentration-numerator'), denominator: amount(100, 'counterexample-concentration-denominator'), applicableThresholdRatio: 0.25, thresholdDirection: 'maximum' as const }, expectedCurrentRatio: 0.28, expectedBufferRatio: -0.03, expectedRawHeadroomAmount: -3 },
  { id: 'minimum-safe-side', input: { numerator: amount(115, 'counterexample-minimum-safe-numerator'), denominator: amount(100, 'counterexample-minimum-safe-denominator'), applicableThresholdRatio: 1, thresholdDirection: 'minimum' as const }, expectedCurrentRatio: 1.15, expectedBufferRatio: 0.15, expectedRawHeadroomAmount: 15 },
  { id: 'maximum-safe-side', input: { numerator: amount(18, 'counterexample-maximum-safe-numerator'), denominator: amount(100, 'counterexample-maximum-safe-denominator'), applicableThresholdRatio: 0.25, thresholdDirection: 'maximum' as const }, expectedCurrentRatio: 0.18, expectedBufferRatio: 0.07, expectedRawHeadroomAmount: 7 },
] as const;
const constraintArithmeticCounterexampleGate = constraintArithmeticCounterexamples.every(({ input, expectedCurrentRatio, expectedBufferRatio, expectedRawHeadroomAmount }) => {
  const derived = deriveConstraintArithmetic(input);
  return derived !== null
    && almostEqual(derived.currentRatio, expectedCurrentRatio)
    && almostEqual(derived.bufferRatio, expectedBufferRatio)
    && almostEqual(derived.rawHeadroomAmount, expectedRawHeadroomAmount);
});
const constraintBindingTieGate = deriveBindingConstraintIds([
  { constraintId: 'liquidity', convertedLoanCapacityAmount: 40 },
  { constraintId: 'stable-funding', convertedLoanCapacityAmount: 40 },
  { constraintId: 'concentration', convertedLoanCapacityAmount: 55 },
]).join('|') === 'liquidity|stable-funding';

const canonicalBankLendingStateExampleKeys = Object.keys(canonicalBankLendingStateExample);
const canonicalFundingSources = canonicalBankLendingStateExample.bankFundingState.sources;
const canonicalOffer = canonicalBankLendingStateExample.loanOfferState;
const canonicalContract = canonicalBankLendingStateExample.loanContractPassport;
const canonicalConstraints = canonicalBankLendingStateExample.bankConstraintState.capacities;
const canonicalConstraintMappingTarget = canonicalBankLendingStateExample.bankConstraintState.mappingTarget;
const canonicalConstraintArithmeticCoverage = canonicalConstraints.every((constraint) => {
  const numeratorAmount = constraint.numerator?.amount;
  const denominatorAmount = constraint.denominator?.amount;
  const threshold = constraint.applicableThresholdRatio;
  if (
    numeratorAmount === null
    || numeratorAmount === undefined
    || denominatorAmount === null
    || denominatorAmount === undefined
    || threshold === null
    || constraint.thresholdDirection === null
    || !Number.isFinite(numeratorAmount)
    || !Number.isFinite(denominatorAmount)
    || !Number.isFinite(threshold)
    || denominatorAmount <= 0
  ) return false;
  const independentlyDerivedCurrentRatio = numeratorAmount / denominatorAmount;
  const independentlyDerivedBufferRatio = constraint.thresholdDirection === 'minimum'
    ? independentlyDerivedCurrentRatio - threshold
    : threshold - independentlyDerivedCurrentRatio;
  const independentlyDerivedRawHeadroom = constraint.thresholdDirection === 'minimum'
    ? numeratorAmount - threshold * denominatorAmount
    : threshold * denominatorAmount - numeratorAmount;
  return almostEqual(constraint.currentRatio, independentlyDerivedCurrentRatio)
    && almostEqual(constraint.bufferRatio, independentlyDerivedBufferRatio)
    && almostEqual(constraint.rawHeadroomAmount?.amount, independentlyDerivedRawHeadroom)
    && constraint.marginalUsagePerLoanUnit !== null
    && constraint.marginalUsagePerLoanUnit > 0
    && almostEqual(independentlyDerivedRawHeadroom / constraint.marginalUsagePerLoanUnit, constraint.convertedLoanCapacityAmount ?? Number.NaN);
});
const canonicalConstraintHeadroomKeys = {
  'risk-capital': 'capital',
  leverage: 'leverage',
  liquidity: 'liquidity',
  'stable-funding': 'stableFunding',
  concentration: 'concentration',
} as const;
const canonicalConstraintUpstreamCoverage = canonicalConstraints.every((constraint) => {
  if (!(constraint.constraintId in canonicalConstraintHeadroomKeys)) return false;
  const upstreamKey = canonicalConstraintHeadroomKeys[constraint.constraintId as keyof typeof canonicalConstraintHeadroomKeys];
  return almostEqual(
    canonicalBankLendingStateExample.bankConstraintState.upstreamHeadrooms[upstreamKey]?.amount,
    constraint.rawHeadroomAmount?.amount ?? Number.NaN,
  );
});
const canonicalCostIds = canonicalOffer?.componentLedger.flatMap(({ includedCostIds }) => includedCostIds) ?? [];
const canonicalComponentSum = canonicalOffer?.componentLedger.reduce((sum, { valuePctPointsPerYear }) => sum + (valuePctPointsPerYear ?? Number.NaN), 0) ?? Number.NaN;
const canonicalExternalFinanceChange = [
  canonicalBankLendingStateExample.substitutionState.originalPairChange?.amount,
  canonicalBankLendingStateExample.substitutionState.otherBankChange?.amount,
  canonicalBankLendingStateExample.substitutionState.bondFinanceChange?.amount,
  canonicalBankLendingStateExample.substitutionState.nonbankFinanceChange?.amount,
].reduce<number>((sum, value) => sum + (value ?? Number.NaN), 0);
const canonicalEventTimes = canonicalContract ? Object.values(canonicalContract.eventTimes) : [];
const canonicalBankLendingStateRuntimeCoverage = canonicalBankLendingStateExampleKeys.length === canonicalBankLendingStateFields.length
  && canonicalBankLendingStateFields.every((field) => Object.prototype.hasOwnProperty.call(canonicalBankLendingStateExample, field))
  && canonicalBankLendingStateExample.inputLineage.length === 4
  && canonicalBankLendingStateExample.inputLineage.every(({ fieldPaths }) => fieldPaths.length > 0)
  && canonicalBankLendingStateExample.bankCreditInputState.eligibleDemand?.amount === 120
  && canonicalBankLendingStateExample.bankCreditInputState.eligibleDemand.currency === 'SYN'
  && canonicalBankLendingStateExample.bankCreditInputState.expectedNetReturn === lesson309SyntheticExpectedNetReturn
  && lesson309ExpectedNetReturnRuntimeCoverage
  && canonicalBankLendingStateExample.bankFundingState.sources.length > 0
  && almostEqual(canonicalFundingSources.reduce((sum, source) => sum + (source.stockWeightRatio ?? Number.NaN), 0), 1)
  && almostEqual(canonicalFundingSources.reduce((sum, source) => sum + (source.marginalFundingShareRatio ?? Number.NaN), 0), 1)
  && almostEqual(canonicalFundingSources.reduce((sum, source) => sum + (source.stockWeightRatio ?? Number.NaN) * (source.averageCostPctPointsPerYear ?? Number.NaN), 0), canonicalBankLendingStateExample.bankFundingState.averageFundingCostPctPointsPerYear ?? Number.NaN)
  && almostEqual(canonicalFundingSources.reduce((sum, source) => sum + (source.marginalFundingShareRatio ?? Number.NaN) * (source.marginalCostPctPointsPerYear ?? Number.NaN), 0), canonicalBankLendingStateExample.bankFundingState.marginalFundingCostPctPointsPerYear ?? Number.NaN)
  && canonicalFundingSources.filter(({ sourceType }) => sourceType === 'equity').every(({ pricingTreatment }) => pricingTreatment !== 'funding-cost')
  && canonicalConstraints.length === 5
  && constraintArithmeticCounterexampleGate
  && constraintBindingTieGate
  && canonicalConstraintArithmeticCoverage
  && canonicalConstraintUpstreamCoverage
  && canonicalConstraints.every(({ capacityUnit }) => capacityUnit === canonicalConstraintMappingTarget.comparableLoanPrincipalUnit)
  && canonicalConstraintMappingTarget.loanInstrumentId === 'SYNTHETIC_TERM_LOAN'
  && canonicalConstraintMappingTarget.lenderLegalEntityId === canonicalBankLendingStateExample.scope.lenderLegalEntityId
  && canonicalConstraintMappingTarget.currency === canonicalBankLendingStateExample.scope.currency
  && canonicalConstraintMappingTarget.decisionTime === canonicalBankLendingStateExample.creditDecisionState?.decisionTime
  && canonicalConstraintMappingTarget.mappingBasis === 'incremental-drawn-term-loan-principal'
  && canonicalConstraints.every(({ nativeHorizon }) => nativeHorizon !== null)
  && new Set(canonicalConstraints.map(({ nativeHorizon }) => nativeHorizon)).size > 1
  && deriveBindingConstraintIds(canonicalConstraints).join('|') === canonicalBankLendingStateExample.bankConstraintState.bindingConstraintIds.join('|')
  && canonicalBankLendingStateExample.bankConstraintState.bindingConstraintIds.length === 1
  && canonicalBankLendingStateExample.bankConstraintState.bindingConstraintIds[0] === 'liquidity'
  && canonicalEventTimes.length === 6
  && canonicalEventTimes.every((eventTime): eventTime is string => eventTime !== null)
  && canonicalEventTimes.every((eventTime, index) => index === 0 || canonicalEventTimes[index - 1]! <= eventTime)
  && almostEqual(canonicalBankLendingStateExample.frozenRiskState.pdPctPoints, 2)
  && almostEqual(canonicalBankLendingStateExample.frozenRiskState.lgdPctPoints, 40)
  && almostEqual(canonicalOffer?.componentLedger.find(({ componentId }) => componentId === 'expected-loss')?.valuePctPointsPerYear, 0.8)
  && almostEqual((canonicalBankLendingStateExample.bankFundingState.marginalFundingCostPctPointsPerYear ?? Number.NaN) - (canonicalOffer?.benchmarkRate?.valuePctPointsPerYear ?? Number.NaN), canonicalOffer?.componentLedger.find(({ componentId }) => componentId === 'funding-wedge')?.valuePctPointsPerYear ?? Number.NaN)
  && canonicalCostIds.length === new Set(canonicalCostIds).size
  && canonicalOffer?.componentLedger.every(({ exposureBasis, horizon, sourceCalculation, includedCostIds }) => exposureBasis !== null && horizon !== null && sourceCalculation !== null && includedCostIds.length > 0) === true
  && almostEqual((canonicalOffer?.benchmarkRate?.valuePctPointsPerYear ?? Number.NaN) + canonicalComponentSum, canonicalOffer?.nominalOfferRatePctPointsPerYear ?? Number.NaN)
  && almostEqual((canonicalContract?.upfrontFeeAmount?.amount ?? Number.NaN) / (canonicalContract?.originationAmount?.amount ?? Number.NaN) * (12 / 24) * 100, canonicalOffer?.annualisedFeePctPointsPerYear ?? Number.NaN)
  && almostEqual((canonicalOffer?.nominalOfferRatePctPointsPerYear ?? Number.NaN) + (canonicalOffer?.annualisedFeePctPointsPerYear ?? Number.NaN), canonicalOffer?.allInOfferRatePctPointsPerYear ?? Number.NaN)
  && almostEqual(canonicalExternalFinanceChange, canonicalBankLendingStateExample.substitutionState.borrowerTotalExternalFinanceChange?.amount ?? Number.NaN)
  && almostEqual((canonicalBankLendingStateExample.substitutionState.borrowerTotalExternalFinanceChange?.amount ?? Number.NaN) + (canonicalBankLendingStateExample.substitutionState.internalCashBufferUse?.amount ?? Number.NaN), canonicalBankLendingStateExample.substitutionState.postCashResourceChange?.amount ?? Number.NaN)
  && canonicalBankLendingStateExample.dynamicDataPassports.length > 0
  && canonicalBankLendingStateExample.identificationState.channelStatus === 'descriptive'
  && Object.values(canonicalBankLendingStateExample.identificationState.estimands).every(({ status }) => status === 'descriptive')
  && canonicalBankLendingStateExample.measurementFlags.some(({ flag }) => flag === 'synthetic');

if (!canonicalBankLendingStateRuntimeCoverage) {
  throw new Error('3.10 canonical bank-lending contract failed its independent arithmetic or invariance gate.');
}

const conceptSections: ConceptSection[] = [
  {
    id: 'upstream-state-freeze', number: 2, label: 'Upstream State Freeze',
    title: '先冻结政策实施、期限曲线与银行初始状态；3.10 只解释银行怎样把这些输入变成贷款供给决定。',
    paragraphs: [
      '本节不把一次政策声明直接塞进贷款回归。3.06 交付实际隔夜利率、管理利率、便利准入、抵押品与流动性状态；3.07 交付零息与远期曲线；3.08 交付名义—实际定价输入；3.09 交付法律实体级融资结构、合格需求与约束余量。每个字段必须保留币种、期限、法人、观察时点、发布日期和修订版本，无法对齐时就标记不可比较。',
      '冻结的含义不是假设这些变量永远不动，而是在一个局部问题中明确谁是输入、谁是本章输出。银行贷款渠道的输出是边际资金成本、约束影子成本、全口径要约、审批与额度以及跨借款人的重新配置；它不会回写上游曲线，也不会把条件情景改名为已识别政策冲击。',
    ],
    sourceIds: [1, 3, 7, 10],
    formula: { label: '有向接口', expression: 'Upstream states(t,vintage,entity,currency,tenor) → bank offer and quantity margins', note: 't 是经济时点，vintage 是当时可得信息版本；二者不可互换。' },
    boundary: '读取 3.05/3.23 的政策事件或结构冲击护照时仍保留其识别等级；本章不会仅凭利率变化自行授予 exogenous-shock 标签。',
  },
  {
    id: 'strict-loan-supply-definition', number: 3, label: 'Strict Loan Supply',
    title: '贷款供给是银行在借款人风险、需求与合同信息冻结时愿意提供的价格—数量—条款集合。',
    paragraphs: [
      '如果市场利率上升后企业少借款，这既可能是银行提高报价，也可能是企业项目需求下降。要把变化称为贷款供给，必须比较同一借款人或可比申请在银行资金与约束状态变化前后的可获得要约，并把利率、费用、额度、期限、抵押品和契约一起观察。供给不是一条只能沿“贷款利率—贷款量”移动的二维曲线，而是一组条件合同。',
      '严格定义还要求说明保持不变的是什么：预期违约概率、违约损失率、项目现金流、申请金额、抵押品和宏观预期若随政策同时变化，就同时混入借款人资产负债表渠道、风险承担渠道与需求渠道。实证研究可以用固定效应、申请数据或工具变量近似冻结，但任何方法都有明确的支持样本，不能把局部比较外推为全体企业供给。',
    ],
    sourceIds: [1, 2, 3, 7, 12, 43, 44],
    formula: { label: '条件供给对象', expression: 'Offerᵢⱼₜ = S(bank stateⱼₜ | borrower/application stateᵢₜ fixed)', note: 'Offer 同时包含 all-in price、limit、approval、maturity、collateral 与 covenants。' },
  },
  {
    id: 'non-mm-bank-funding', number: 4, label: 'Non-Modigliani–Miller Bank Funding',
    title: '银行不同负债不是无摩擦替代品；融资来源、期限、担保与保险安排会进入边际贷款决策。',
    paragraphs: [
      '若存款、同业拆借、回购、长期债务和股本可随时按同一价格互换，政策改变准备金或短率就很难通过银行负债结构产生独立供给效应。现实中这些来源面对不同投资者、期限、抵押品、监管待遇和调整成本；稳定零售存款还嵌入支付服务与关系租金，所以一单位存款流失往往由更昂贵或更短的批发融资替代。',
      '这正是银行贷款渠道相对一般贴现率渠道的第一道必要门：政策实施必须改变至少一部分银行的边际资金条件、约束容量或资产机会成本。资产负债表会计只说明银行能怎样配平，不能证明新增融资无成本；第 3.09 节的“先提款、后融资”与本节“融资影响未来报价”完全相容。',
    ],
    sourceIds: [5, 6, 8, 9, 10, 19, 25, 27, 29],
    formula: { label: '融资楔子', expression: 's_fund = marginal cost of funds − matched benchmark rate', note: '边际成本包含可获得性与结构变化，不能直接用总利息支出除以平均负债替代。' },
  },
  {
    id: 'borrower-bank-dependence', number: 5, label: 'Borrower Bank Dependence',
    title: '只有借款人不能无摩擦替换受影响银行贷款时，贷款对收缩才可能转化为总融资与实体效应。',
    paragraphs: [
      '企业可以转向另一家银行、发行债券、使用商业信用、租赁或非银融资。大型、透明且有市场准入的企业通常选择更多；年轻、规模小、信息不透明或依赖营运资本的企业更可能依赖银行关系。关系银行积累的软信息难以即时移植，使新贷款行必须重新筛选并承担逆向选择，替代因此具有成本和时滞。',
      '“银行贷款减少”所以不是结论终点。研究必须从原银行—借款人贷款对继续聚合到借款人从其他来源取得的融资，再观察投资、就业或产出。完全替代时，原贷款行的供给冲击仍可重排市场份额，却不必压低总融资；不完全替代才把银行层变化传到实体层。',
    ],
    sourceIds: [1, 4, 7, 14, 15, 16, 17, 18, 43, 47],
    formula: { label: '替代率', expression: 'Substitution rate = Δalternative finance / (−Δoriginal-bank credit), for Δoriginal-bank credit < 0', note: '必须统一窗口、币种和融资口径；大于 1 表示替代来源还发生额外扩张。' },
  },
  {
    id: 'implementation-versus-decision', number: 6, label: 'Decision / Implementation',
    title: '政策决定、货币市场实施结果和可识别政策冲击是三个不同对象。',
    paragraphs: [
      '中央银行先决定目标或工具，再通过准备金供给、管理利率、便利、抵押品与交易安排影响隔夜市场。银行真正面对的是实现后的资金价格、曲线、流动性分布和可用便利条件，而不是新闻稿中的单一数字。操作框架变化还可能让同样的政策利率移动产生不同的数量与流动性含义。',
      '即使隔夜利率准确跟随目标，变化也可能是对通胀、增长或金融压力的内生反应。要估计因果效应，需要在 3.05 或 3.23 取得有时间戳的意外成分、叙事冲击或其他可辩护识别；3.10 只消费该护照，不用“会议日”或“利率变了”替代识别。',
    ],
    sourceIds: [3, 7, 10],
    formula: { label: '三层对象', expression: 'policy decision ≠ implemented money-market state ≠ structural policy shock', note: '描述传导链可以使用前两者；因果估计必须额外交付第三者及其假设。' },
  },
  {
    id: 'lending-versus-rate-channel', number: 7, label: 'Lending / Broad Rate Channel',
    title: '一般利率渠道重估所有现金流；银行贷款渠道要求银行供给在同一无风险利率变化之外额外移动。',
    paragraphs: [
      '政策收紧使无风险曲线上升时，项目现值下降、企业贷款需求减少，银行即使被动按基准重定价也会出现贷款增长放缓。这是广义利率渠道。银行贷款渠道则要求融资结构、资本或流动性约束使一些银行在相同曲线变化下额外提高贷款楔子、削减审批与额度，因而产生跨银行异质性。',
      '经验上应把合同基准利率与银行特定 spread 分开，并比较暴露不同但面对相似借款人的银行。若只观察总贷款量与政策利率负相关，既无法排除需求下降，也无法区分机械基准重定价和供给楔子；“银行在链条中出现”不等于银行贷款渠道已经被识别。',
    ],
    sourceIds: [1, 3, 5, 6, 7, 9, 33],
    formula: { label: '报价分解', expression: 'Δr_loan = Δr_benchmark + Δbank-specific wedge', note: '独立贷款渠道的候选证据来自第二项及数量/条款边际，而不是第一项本身。' },
  },
  {
    id: 'lending-versus-balance-sheet-channel', number: 8, label: 'Lending / Balance-sheet Channel',
    title: '银行贷款渠道改变贷款人的供给能力；资产负债表渠道改变借款人的外部融资溢价。',
    paragraphs: [
      '若紧缩压低抵押品价格或现金流，使同一家银行重新评估借款人违约概率、损失率或可质押价值，变化位于借款人资产负债表渠道。若借款人状态被冻结，而不同资金结构或资本余量的银行仍给出不同要约，才是本节研究的贷款人供给渠道。两条渠道在现实中往往同时发生，但概念上必须先拆开。',
      '因此 3.10 的定价器把 PD、LGD、抵押品和项目现金流作为冻结输入，不允许政策旋钮直接修改它们；3.11 再让净值、抵押品与外部融资溢价内生变化。这个边界不是否认交互，而是为了以后能分别估计银行暴露、借款人暴露及二者乘积。',
    ],
    sourceIds: [7, 14, 15, 16, 44, 50],
    formula: { label: '两维异质性', expression: 'Outcome = f(bank exposure, borrower balance sheet, bank×borrower interaction)', note: '单一总量序列通常无法把三项分开。' },
    boundary: 'borrower risk state 在 3.10 内冻结；净值、抵押品与金融加速器的动态机制由 3.11 接手。',
  },
  {
    id: 'lending-versus-risk-taking-channel', number: 9, label: 'Lending / Risk-taking Channel',
    title: '供给容量变化与风险容忍度变化不是同一机制：前者属于 3.10，后者属于 3.12。',
    paragraphs: [
      '低利率可能抬高估值、改善表面违约指标，也可能压缩净息差并伴随收益追逐；内部风险度量、治理与监管环境还会改变银行愿意接受的尾部风险。这些机制会移动贷款组合的风险阈值，即使融资成本不变也可能改变谁获贷，属于风险承担渠道。',
      '本节允许银行在既定风险评分、既定风险容忍度与既定客户排序下因资金或容量变化重新分配，但不让风险偏好旋钮同步移动。若观察到风险更高的借款人份额上升，必须先排除评分变化、需求构成和存量迁移，不能直接把它当作便宜资金带来的供给扩张。',
    ],
    sourceIds: [22, 34, 35, 36, 37, 38, 39, 65],
    formula: { label: '边界冻结', expression: '3.10: risk metric and risk tolerance fixed; 3.12: risk tolerance becomes endogenous', note: '同一数据可以同时承载两种机制，识别设计必须明确主估计量。' },
    boundary: '筛选强度、收益追逐和内生风险阈值交给 3.12；本节只保留它们的冻结版本与 lineage。',
  },
  {
    id: 'creation-stock-supply-distinction', number: 10, label: 'Creation / Stock / Supply',
    title: '贷款创造存款是一笔提款的账本结果；贷款存量是一段时期的余额；贷款供给是条件行为函数。',
    paragraphs: [
      '3.09 说明实际提款时贷款资产与存款负债如何生成，并在付款、偿还、核销和出售后演化。3.10 问的是银行面对下一笔申请时愿意给什么要约。期末贷款存量还混合本金新增、实际本金偿还、核销、出售与购买、汇率或重估及重分类；合同到期只是事件标签，只有届时实际清偿的本金才进入 repayment，逾期未还不能因“到期”自动从余额扣除。',
      '这一分离消除两个常见推论错误：银行能通过放贷发行存款，不等于它愿意无成本无限扩表；贷款存量下降，也不等于银行主动收紧供给。只有把申请—审批—承诺—发放—提款—存量的阶段数据与事件桥接，才知道数量变化发生在哪个边际。',
    ],
    sourceIds: [3, 7, 10, 53, 54, 57, 58],
    formula: { label: '贷款存量桥', expression: 'Lₜ=Lₜ₋₁+gross principal advances−principal repayments−charge-offs−sales+purchases±FX/revaluation±reclassification', note: '所有流量事件互斥计数；origination 与 draw 若触发同一本金确认只能计一次，maturity paydown 已包含在实际 repayments 中。' },
  },
  {
    id: 'four-necessary-links', number: 11, label: 'Four Necessary Links',
    title: '一个完整贷款渠道必须穿过银行暴露、供给反应、融资替代和实体传导四道门。',
    paragraphs: [
      '第一，政策实施改变银行边际融资、约束或机会成本；第二，在可比风险与需求下，银行改变价格、审批、额度或条款；第三，受影响借款人不能完全由其他银行、债券或非银融资替代；第四，总融资缺口以有理论时滞的方式进入投资、就业或产出。任一道门为零，后续总效应都可能消失。',
      '四道门还规定证据层级：银行资金利差只是第一门，贷款标准调查主要触及第二门，贷款登记数据可以追踪第二与第三门，企业结果数据才触及第四门。把不同来源拼在一起时必须保持样本、法域、时钟和估计量一致，不能用一国调查回答另一国企业的因果效应。',
    ],
    sourceIds: [1, 3, 4, 5, 7, 9, 43, 44, 50, 53, 56],
    formula: { label: '串联门', expression: 'G₁(bank exposure) ∧ G₂(supply response) ∧ G₃(incomplete external-finance substitution) ∧ G₄(real propagation)', note: '逻辑合取表示完整机制要求四门分别成立；它不是有量纲变量的乘法式，每道门都需要独立估计量与识别设计。' },
  },
  {
    id: 'price-quantity-nonprice-margins', number: 12, label: 'Price / Quantity / Terms',
    title: '银行可以沿价格、数量和非价格条款同时调整；单看平均贷款利率会漏掉最重要的供给变化。',
    paragraphs: [
      '价格边际包括基准加点、费用、利率下限和承诺费；数量边际包括是否审批、额度、发放与实际提款；非价格边际包括期限、抵押品、担保、契约、摊还安排和审核速度。银行在逆向选择或客户关系重要时，可能宁愿削减额度和提高抵押要求，也不把全部成本写进显性利率。',
      '观测到平均贷款利率下降甚至可能伴随收紧：银行拒绝边际高风险申请后，剩余获批样本质量更高，组合平均利率会机械下降。这种构成效应要求同时保存申请母体、拒绝、退出和合同条件；只看已发放贷款会产生选择偏差。',
    ],
    sourceIds: [11, 12, 17, 18, 43, 44, 53, 56, 57],
    formula: { label: '多边际要约', expression: 'Offer = {rate, fees, approval, limit, maturity, collateral, covenants, speed}', note: '任何“宽松/收紧”结论都要说明观察了集合中的哪些元素。' },
  },
  {
    id: 'stock-flow-commitment-draw', number: 13, label: 'Stock / Flow / Commitment / Draw',
    title: '存量、发放流量、承诺额度和实际提款各有不同经济时钟，不能放在同一个数量字段。',
    paragraphs: [
      '循环信贷额度可以在银行收紧新审批时继续被既有客户提款，使短期贷款存量反而上升；承诺额度到期未续签后，存量可能延迟下降。定期贷款发放通常更接近合同生效，信用卡与透支则把提款嵌入支付。对每种产品都要保存可用额度、已用额和未用承诺。',
      '政策传导的先后顺序通常先出现在新业务报价、审批标准和承诺，再经重定价、到期、提前偿还和新增提款进入存量利率与余额。用月末存量研究日内政策事件，会把不同批次合同混成一个缓慢移动的状态变量。',
    ],
    sourceIds: [28, 30, 53, 54, 55, 57, 58],
    formula: { label: '承诺桥', expression: 'closing undrawn = opening undrawn + new commitments + restoring repayments − draws − cancellations/expiry', note: '若数据直接给当前 committed limit，则 current undrawn=current committed limit−current drawn；不能再重复减已反映的取消额。' },
  },
  {
    id: 'credit-pipeline-clock', number: 14, label: 'Credit Pipeline',
    title: '申请、审批、合同、发放、提款和余额是一条有流失与延迟的漏斗，而不是同一笔“贷款”。',
    paragraphs: [
      '借款人先提交申请，银行筛选后可拒绝、附条件批准或给出更小额度；借款人又可撤回或拒绝报价。合同签署后仍可能因先决条件未满足而不发放，发放后未用额度也不会立即转成余额。每个阶段的分母不同：批准率以申请为分母，提款率以可用承诺为分母，存量增长则读取期初余额。',
      '漏斗还揭示需求与供给的不同位置。申请数量下降首先像需求变化，条件相同的批准率或额度下降更接近供给；但银行改变宣传、预审或关系管理又会影响谁来申请。完整数据应同时记录申请进入与样本退出，避免只在获贷者中寻找供给。',
    ],
    sourceIds: [12, 17, 18, 40, 43, 44, 48, 53, 56, 58],
    formula: { label: '阶段概率', expression: 'P(draw)=P(apply)×P(approve|apply)×P(contract|approve)×P(draw|contract)', note: '分解是条件概率恒等式；每一项的因果驱动仍需单独识别。' },
  },
  {
    id: 'pair-bank-borrower-aggregate-levels', number: 15, label: 'Pair / Bank / Borrower / Aggregate',
    title: '贷款对、银行、借款人和总量是四个不同聚合层；跨层命名错误会把重新配置误作净收缩。',
    paragraphs: [
      '银行—借款人 pair 记录一家银行对一家企业的合同；银行层聚合资产配置与总额度；借款人层把多家银行、债券和非银融资相加；宏观层再跨主体合并并处理部门边界。某个 pair 减少 20、另一银行增加 15 时，原行冲击是 −20，借款人银行融资只减少 5。',
      '不同层级还要求不同标准误和固定效应。多银行借款人允许同一时期比较不同贷款行，从而吸收一部分借款人需求；单银行借款人却不在这一支持集。聚合到国家总量后，银行间替代、企业退出、新增申请和一般均衡反馈都会改变估计对象。',
    ],
    sourceIds: [31, 32, 43, 44, 45, 46, 49, 50, 51, 52],
    formula: { label: '分叉聚合', expression: 'pair → {Σ lenders for each borrower; Σ borrowers for each bank} → explicitly defined sector aggregate', note: '借款人维度与银行维度是从 pair 出发的两条分支，不是依次执行的同一条链。' },
  },
  {
    id: 'loan-contract-passport', number: 16, label: 'Loan-contract Passport',
    title: '每个贷款合同需要能同时连接价格、数量、条款、主体和时钟的护照。',
    paragraphs: [
      '最低字段包括贷款人与借款人法律身份、居民与部门、用途、币种、申请、审批、承诺、发放、提款和余额，固定或浮动、基准与加点、费用与下限、重定价频率、到期、抵押、担保和契约。缺少这些字段时，同一个“贷款利率”可能混合新业务固定利率、存量浮动利率和包含费用的年化成本。',
      '护照不是为了把所有数据强行填满；未知值应写 null，并用 measurement flag 区分未收集、保密、不可适用和结构断点。合同级数据进入聚合前还要说明名义额、账面额或监管暴露，避免与 3.09 的本金、拨备和核销时钟冲突。',
    ],
    sourceIds: [53, 55, 57, 58, 59, 60],
    formula: { label: '合同键', expression: 'contract = parties + purpose + currency + pipeline amounts + price terms + reset/maturity + security + clocks', note: '只有键与计量口径完整，才能跨行、跨借款人和跨期连接。' },
  },
  {
    id: 'benchmark-maturity-repricing', number: 17, label: 'Benchmark / Maturity / Repricing',
    title: '贷款定价要匹配合同现金流的基准、期限和重定价时钟；隔夜政策利率不是所有贷款的直接基准。',
    paragraphs: [
      '浮动贷款可能锚定隔夜复利、三个月参考率或贷款市场报价利率，固定贷款则读取相应期限的资金与对冲价格。合同到期两年但每三个月重定价，其基准风险与两年固定贷款不同；期限、重定价频率和利率下限共同决定政策变化何时进入现金流。',
      '基准利率还可能含信用或期限成分，因此不能把基准全部解释为无风险预期短率。应从 3.07 读取匹配期限的零息/远期曲线和分解区间，再把银行特定融资楔子与借款人/合同项叠加；任何跨币种比较都要另行处理掉期与基差。',
    ],
    sourceIds: [33, 34, 57, 59],
    formula: { label: '匹配原则', expression: 'reference rate = curve(currency, reset tenor, cash-flow timing, fixing convention)', note: '合同 maturity 与 next reset 是两只时钟，不能用一个期限字段替代。' },
  },
  {
    id: 'marginal-funding-cost', number: 18, label: 'Marginal Funding Cost',
    title: '匹配期限的边际资金机会成本是新贷款报价的一项输入，而不是历史平均负债成本的机械替代。',
    paragraphs: [
      '平均资金成本把过去锁定的定期存款、低息活期存款和债券票息按存量权重加总，适合解释当期利润；边际成本问的是银行今天支持下一单位资产所需的可持续融资包要付多少。专业资金转移定价通常先匹配币种、重定价与期限，把参考曲线、期限流动性溢价和其他已分配成本留在可审计的不同格子；它是报价输入之一，风险、运营、约束与竞争仍会决定最终要约。',
      '若一家银行平均成本仍低，却已在边际上依赖昂贵批发融资，它可以在财报利润看似稳健时先收紧新贷款；相反，旧负债平均成本较高但边际存款流入便宜时，新业务报价可先改善。传导研究因此应尽量构造资金来源级别的边际状态，并报告模型假设而非伪装成直接观测。',
    ],
    sourceIds: [19, 25, 26, 29, 33, 34, 64],
    formula: { label: '边际而非平均', expression: 'FTP input = matched-maturity marginal funding opportunity cost; ACF = interest expense / average funding stock', note: 'MCF/FTP 常需内部模型估计并带区间；它不是唯一报价决定项，ACF 即使可观测也不能替代它。' },
  },
  {
    id: 'deposit-beta', number: 19, label: 'Deposit Beta',
    title: '存款 beta 测量存款价格对市场利率的传递，但价格反应与存款数量流失必须分开。',
    paragraphs: [
      '存款 beta 通常表示一段窗口内存款利率变化相对政策或市场利率变化的比例。交易账户因支付服务、客户惰性与地方竞争可能慢于市场利率，批发或高收益存款反应更快；同一家银行不同客户与产品也有不同 beta。beta 是区间和状态依赖的经验对象，不是固定合同参数。',
      '低 beta 在收紧初期保护净息差，却可能随着利差扩大诱发客户转向货币基金、定期存款或其他银行。银行随后要提高存款报价或用批发融资替代，所以完整路径同时包含“留下来的存款变贵”和“流走的存款由谁补”。只算价格 beta 而冻结数量，会低估负债结构转换。',
    ],
    sourceIds: [19, 25, 29, 35, 36],
    formula: { label: '区间 beta', expression: 'β_deposit = Δdeposit rate / Δreference market rate', note: '需声明窗口、产品、客户、方向和利率下限；分母接近零时不应输出稳定比率。' },
  },
  {
    id: 'wholesale-secured-term-funding', number: 20, label: 'Wholesale / Secured / Term Funding',
    title: '批发、担保与长期融资提供不同的价格、期限与挤兑保护，不能压成一个“非存款融资”桶。',
    paragraphs: [
      '无担保同业和商业票据对信用利差与市场关闭敏感；在币种、期限和交易对手风险可比时，回购的信用利差通常较低，但抵押品机会成本、haircut、对冲和操作费用足以反转全成本排序；长期债务锁定期限却通常更贵，并可能受发行窗口约束；央行融资还要求项目资格、操作准备和抵押品。银行能否替换流失存款取决于这些具体通道。',
      '期限错配使短期资金支持长期贷款时出现滚动风险。压力中，表面上仍可融资的银行可能因担保融资占用最优质流动资产而削弱其他缓冲；长期融资提高稳定性却将较高成本锁定更久。因此资金来源要同时保存利率、期限、担保、可调用容量与下一重定价日。',
    ],
    sourceIds: [27, 28, 29, 30, 31, 32, 64],
    formula: { label: '替代融资全成本', expression: 'replacement cost = coupon/rate + fees + collateral opportunity cost + hedge cost + rollover premium', note: '不同项先统一年化与期限，再进入报价；不可把 haircut 本身直接加成利率。' },
  },
  {
    id: 'frozen-expected-loss', number: 21, label: 'Frozen Expected Loss',
    title: '预期损失是贷款报价的一项输入，但 3.10 必须冻结其风险度量，避免偷渡借款人渠道。',
    paragraphs: [
      '最小定价近似把一年期预期损失写成 PD×LGD×EAD：违约概率描述给定窗口内违约的可能性，违约损失率描述违约后的损失比例，风险暴露描述届时的敞口。三者需要同一情景、期限和口径；它们与会计损失准备、监管资本和已实现核销也不是同一个数。',
      '政策收紧可能真实地改变企业现金流、抵押品和评级，但让这些变化直接进入本节会同时启动 3.11。为单独观察银行供给，C1 在比较银行资金或约束时锁定 PD、LGD 与 EAD；若研究目标本来就是联合渠道，则必须另存 borrower-state path，并把交互项明确命名。',
    ],
    sourceIds: [7, 12, 13, 20, 21, 22, 44, 58, 61],
    formula: { label: '教学近似', expression: 'Expected loss rate ≈ PD × LGD × EAD / committed or drawn basis', note: '分母与期限必须声明；本式不替代会计、监管或内部模型。' },
  },
  {
    id: 'operating-screening-servicing-cost', number: 22, label: 'Operating / Screening / Servicing Cost',
    title: '贷款需要筛选、监督、记录、服务与合规资源；这些成本决定小额和信息密集型贷款的可持续报价。',
    paragraphs: [
      '固定筛选成本摊在小额贷款上会形成更高单位成本，关系贷款则可能在前期投入后逐步积累可复用信息。贷后监督、契约检查、支付服务和催收又随期限持续发生。银行若无法通过利率、费用或交叉服务覆盖这些成本，会降低额度、提高最低规模或退出某类客户。',
      '运营成本不能与预期损失重复：前者是完成信息生产与服务的资源消耗，后者是合同信用损失的概率加权值。自动化可能降低处理成本，却未必减少软信息或尾部风险；比较数字银行与关系银行时，应分别测量获客、筛选、服务和损失。',
    ],
    sourceIds: [13, 14, 15, 16, 17, 18],
    formula: { label: '单位成本', expression: 'c_ops = (screening + monitoring + servicing + compliance cost) / pricing exposure', note: '固定成本的分母选择会改变小额贷款单位值，必须与合同规模一同报告。' },
  },
  {
    id: 'capital-shadow-price', number: 23, label: 'Capital Shadow Price',
    title: '贷款消耗稀缺资本容量时，银行面对的是资本的影子价格，而不是只看是否越过最低比率。',
    paragraphs: [
      '新增贷款会按规则和内部模型增加风险加权资产或杠杆暴露。即使当前比率高于法定最低值，管理缓冲、压力测试、市场预期和未来损失也会让一单位资本容量具有正机会成本；越接近内部约束，影子价格越高，银行越可能提高报价或减少风险加权扩张。',
      '资本比率本身不能直接加到贷款利率。需要先估计新增贷款消耗多少资本、补充资本的边际成本，以及保留该容量用于其他资产的机会成本。C4 的容量式是冻结其他资产、留存收益、风险权重和缓冲的合成敏感性测试，不是某家银行的合规判断。',
    ],
    sourceIds: [20, 21, 22, 23, 24, 26, 40, 67, 68],
    formula: { label: '资本成本楔子', expression: 'φK = marginal capital requirement per loan × shadow cost of capital', note: 'requirement、headroom、shadow price 与贷款利率加点是四个不同对象。' },
  },
  {
    id: 'liquidity-stable-funding-shadow-price', number: 24, label: 'Liquidity / Stable-funding Shadow Price',
    title: '短期支付流动性和长期稳定融资约束作用于不同期限，却都会改变贷款的影子成本与可用容量。',
    paragraphs: [
      '贷款提款可能导致跨行准备金流出，未使用承诺又在压力期被集中提款；这要求银行持有现金、央行准备金或可变现资产。长期贷款还需要更稳定的负债结构，避免持续以短债滚动。相同贷款对短期现金流和一年期结构融资的占用不同，不能用一个“流动性比率”统括。',
      '影子成本取决于银行距离内部阈值有多远以及补充缓冲的边际代价。大量流动资产可以缓冲当期支付，却也有收益机会成本；更稳定的长期融资降低展期风险，却提高票息。研究应保存各约束的 horizon、单位和规则版本，再转换为同一新增贷款容量。',
    ],
    sourceIds: [27, 28, 29, 30, 39, 40, 64, 69, 70],
    formula: { label: '流动性楔子', expression: 'φL = liquidity usage × shadow price(short horizon) + stable-funding usage × shadow price(long horizon)', note: '两项可以进入全成本，但原始比率和 headroom 不能直接相加。' },
  },
  {
    id: 'concentration-opportunity-cost', number: 25, label: 'Concentration / Opportunity Cost',
    title: '单一客户、行业或地区集中会让最后一单位额度占用更稀缺的组合空间。',
    paragraphs: [
      '即使一笔贷款独立看有正利润，若它让银行进一步集中于同一集团、行业、地区或共同风险因子，其边际损失与监管/内部限额占用可能更高。银行因此可给同风险借款人不同报价，或把剩余额度保留给能够改善分散度的客户。',
      '集中度不是借款人 PD 的另一写法：PD 衡量单户风险，集中度衡量多项暴露共同失败时组合缺乏分散。S62概述大额暴露制度，S71给出Basel LEX20规则；二者只为单一交易对手与关联交易对手组提供边界。行业和地区集中须读取具体法域规则、ICAAP或内部限额，不能套用25% Tier 1基准。教学定价把 concentration opportunity cost 单列，防止既在资本权重中计算又在加点中无说明重复计算；真实模型必须说明相关性与限额口径。',
    ],
    sourceIds: [20, 21, 22, 23, 24, 27, 62, 71],
    formula: { label: '边际组合成本', expression: 'c_conc = value of scarce portfolio capacity used by the next exposure', note: '若资本模型已经完整吸收相关性，额外加点要检查重复计量。' },
  },
  {
    id: 'markup-competition-market-power', number: 26, label: 'Markup / Competition',
    title: '目标加价由竞争、客户转换成本与关系价值共同决定，不能被当成纯粹成本残差。',
    paragraphs: [
      '银行在竞争激烈、合同透明且替代来源充足的市场中较难把资金成本完全转给借款人；关系信息、地方市场集中和产品捆绑则可能提供定价空间。加价还会跨期平滑：银行可先以低价建立关系，再通过未来服务回收信息投入，也可能为保留优质客户暂时压缩当期利润。',
      '观察到高 spread 不等于高市场势力，因为它也可能补偿风险、资本或运营成本；低 spread 也不等于竞争充分，因为费用、抵押与额度可能同时收紧。识别市场力量需要比较可替代要约、当地市场结构或制度变化，并保存全口径合同。',
    ],
    sourceIds: [16, 17, 18, 19, 25, 34, 40],
    formula: { label: '名义残差与全口径加价', expression: 'μ_target = r_offer^nominal − r_ref − s_fund − EL − c_ops − φK − φL − c_conc (fees excluded); markup_all-in = μ_target + annualised fees', note: 's_fund 是匹配期限边际融资成本相对基准 r_ref 的楔子；费用只在 all-in 一侧加入一次。只有成本口径一致且无重复计量时，残差才有经济解释。' },
  },
  {
    id: 'all-in-loan-offer', number: 27, label: 'All-in Loan Offer',
    title: '全口径要约把匹配基准、银行资金楔子、冻结损失、运营、约束成本与加价放进同一单位。',
    paragraphs: [
      'C1 的最小分解先用相同币种与期限的合同基准，再加边际融资相对基准的楔子、冻结预期损失、运营成本、资本与流动性影子成本、集中度机会成本以及目标剩余回报。这里的目标剩余回报专指名义利率在扣除基准与逐项成本后的残差；年化费用明确排除，只有下一步构造 all-in revenue 时才另行加入。每个组件都保存暴露基数、期限、计算来源与 included-cost ID；股本若进入资本影子成本就不得再作为资金成本，期限流动性溢价若已在融资楔子中就不得再进入流动性容量成本，集中度若已由资本模型吸收也不得另加。',
      '费用要先按约定本金或实际提款额、期限与摊还模式年化，再加到名义利率形成 all-in cost。一次性费用若已经通过实际利率计入，就不能再次相加；利率下限、重定价和提前偿还会改变真实现金流，应由合同现金流计算器处理，而非只看名义 spread。',
    ],
    sourceIds: [10, 19, 21, 22, 25, 26, 33, 34, 57, 61, 62, 64],
    formula: { label: 'C1 · 冻结分解', expression: 'r_offer^nominal = r_ref + s_fund + EL + c_ops + φK + φL + c_conc + μ_target; μ_target ≡ r_offer^nominal − r_ref − s_fund − EL − c_ops − φK − φL − c_conc; r_offer^all-in = r_offer^nominal + annualised fees', note: 'μ_target 是名义报价的目标剩余回报，明确不含费用；全口径盈利门另用 all-in revenue。s_fund 是边际融资成本相对匹配基准 r_ref 的楔子，所有 cost ID 必须唯一。' },
    after: <><AllInLoanPricingLab /><FundingMixBetaLab /></>,
  },
  {
    id: 'new-business-versus-stock-rates', number: 28, label: 'New Business / Stock Rates',
    title: '新业务利率是当前边际要约的选择后结果；存量利率是历次合同与重定价时钟的加权结果。',
    paragraphs: [
      '新业务口径通常包含新签与符合定义的重新协商，却仍只观察成交者；申请被拒、借款人拒绝要约和未提款承诺不在平均利率中。存量利率则把不同发放年代、固定期、剩余期限和余额权重合在一起，政策变化会随合同重定价和组合更新逐步进入。',
      '比较两者能识别传导时钟，但不能自动识别供给：新业务平均利率会因借款人构成改变，存量平均利率会因提前还款、违约与出售改变权重。ECB MIR 等数据必须保存 AAR/NDER/APRC、新业务或余额、初始固定期和聚合权重。',
    ],
    sourceIds: [33, 34, 53, 54, 57],
    formula: { label: '存量加权', expression: 'r_stock,t = Σ_c outstanding_c,t × contractual rate_c,t / Σ_c outstanding_c,t', note: '合同集合和余额权重也随时间变化，所以差分不仅是重定价。' },
  },
  {
    id: 'fixed-floating-repricing-clock', number: 29, label: 'Fixed / Floating / Repricing',
    title: '固定、浮动和分段重定价把同一政策路径转换成不同现金流速度。',
    paragraphs: [
      '浮动贷款在下一个 fixing date 才按合同规则更新，三个月、六个月和十二个月重定价会产生阶梯式传导；固定贷款在到期或重新协商前可能完全不动。利率下限会在宽松时截断下降，提前还款又让借款人选择性退出高息合同。',
      'C3 用 cohort 桶在 0、3、12 与 24 个月展示存量利率，但明确冻结新增发放、到期、提前偿还、违约和循环额度提款。真实组合必须把这些流量加回，否则“存量传导慢”既可能来自固定合同，也可能来自组合构成变化。',
    ],
    sourceIds: [33, 34, 35, 36, 37, 38, 57],
    formula: { label: '合同重定价', expression: 'r_c,t = max(floor_c, benchmark_(next reset bucket) + spread_c) after reset; otherwise prior rate', note: '这只是浮动合同的一般模板；fixing lag、day count 与 fallback 条款须读取合同。' },
    after: <RepricingClockLab />,
  },
  {
    id: 'spread-fee-floor-collateral-covenant', number: 30, label: 'Spread / Fee / Floor / Security',
    title: '显性利差只是合同的一部分；费用、下限、抵押品、担保与契约共同分配价格和控制权。',
    paragraphs: [
      '银行可以保持 headline spread 不变，却提高发起费、承诺费或未使用额度费；也可设置利率下限，使宽松无法完全传递。抵押与担保影响违约后的回收和借款人的激励，契约则在风险状态恶化前后重新分配控制权。相同名义利率的两份贷款，真实成本与可用性可能完全不同。',
      '条款之间存在替代：更强抵押或更短期限可能换取较低利率，更严格契约可能换取更大额度。研究不应把所有变化硬转成一个百分点；价格项可按现金流年化，控制权和可用性项则保留原始离散状态，再分别报告。',
    ],
    sourceIds: [12, 13, 16, 17, 18, 40, 53, 56, 57],
    formula: { label: '合同向量', expression: 'Contract terms = price vector ⊕ quantity vector ⊕ control-rights vector', note: '⊕ 表示并列保存而非求和；抵押与契约不能随意货币化。' },
  },
  {
    id: 'expected-net-return-threshold', number: 31, label: 'Expected Net Return',
    title: '一笔贷款只有在调整资金、损失、运营与稀缺容量后仍达到最低收益，才进入可供给集合。',
    paragraphs: [
      '银行可以先计算全口径要约下的预期净收益，再与内部最低回报、组合机会或资本成本比较。若借款人不接受覆盖成本的价格，交易可能以更小额度、更强担保或拒绝结束。这个门解释为什么“存在合格需求”仍不必然产生贷款。',
      '最低收益并非天然常数：竞争、关系价值、交叉销售和战略退出都会改变阈值，但在 3.10 的局部比较中应固定其定义，避免把管理风险偏好变化混入供给成本。报告时应区分不含费用的名义利率残差 μ_target 与包含年化费用的 all-in 预期净收益，并同时给出 rate concept、年化方法、币种、期限和使用的暴露分母。',
    ],
    sourceIds: [8, 10, 12, 13, 19, 21, 26],
    formula: { label: '盈利门', expression: 'μ_target = r_offer^nominal − r_ref − s_fund − EL − c_ops − φK − φL − c_conc (fees excluded); Expected net return_all-in = μ_target + annualised fees ≥ hurdle_all-in', note: 'r_ref + s_fund 才是本分解中的边际融资成本；费用只在 all-in 一侧加入一次。若现金流期限不同，应先贴现为可比较的风险调整价值。' },
  },
  {
    id: 'extensive-approval-margin', number: 32, label: 'Extensive Approval Margin',
    title: '审批边际回答“是否提供任何贷款”，是供给调整最早也最容易被成交样本遗漏的一层。',
    paragraphs: [
      '银行可以在报价前拒绝申请、在审批中要求额外材料，或给出借款人不会接受的条件。只使用已发放贷款时，这些零数量结果消失，估计会把幸存客户的较低风险与银行宽松混在一起。申请级数据因此特别重要，因为它保留共同需求进入银行门口后的分流。',
      '批准率仍不是纯供给：借款人会选择向哪家银行申请，银行也会通过预审和营销改变申请池。同一申请向多家银行或同一借款人在同一时点的比较能改善控制，但支持集更窄；研究应报告申请形成机制和拒绝理由。',
    ],
    sourceIds: [12, 17, 18, 40, 43, 44, 48, 53, 56, 58],
    formula: { label: '审批率', expression: 'approval rate = approved applications / eligible submitted applications', note: '“eligible submitted”必须由稳定规则定义；撤回、资料不全与预审拒绝分栏。' },
  },
  {
    id: 'intensive-limit-amount-margin', number: 33, label: 'Intensive Limit Margin',
    title: '在仍然批准的申请中，银行可以通过额度和实际金额收紧供给。',
    paragraphs: [
      '借款人申请 100，银行可能批准 60；若合同签署后只提款 40，审批供给边际是 60/100，提款利用率是 40/60。把最终余额 40 直接解释为银行只愿供给 40，会把借款人未使用额度与银行额度削减混为一谈。',
      '额度还可在续贷时削减、在契约触发后冻结，或在循环贷款偿还后恢复。银行层容量分析应把新额度、未用承诺和预计提款同时计入。C4 先按 minimum 或 maximum 方向直接从规则分子、分母和阈值推导有符号原生余量：安全侧为正，越界为负；随后才在保留各规则原生 horizon 的同时，把边际占用映射到同一目标贷款本金单位、贷款工具、发放法人、币种、决策时点与 mapping basis。只有这份共同映射护照完整，转换容量才允许取最小值；借款人层则另看其他融资是否填补申请—批准缺口。',
    ],
    sourceIds: [18, 27, 28, 29, 30, 40, 44, 53, 56],
    formula: { label: '两个强度', expression: 'offer ratio = approved limit / requested amount; utilisation = drawn amount / current committed limit', note: '也可写 drawn/(drawn+undrawn)。分母为零或合同口径不同则按产品规则处理，不能把未用额度单独当分母。' },
    after: <UnifiedCapacityLab />,
  },
  {
    id: 'adverse-selection-credit-rationing', number: 34, label: 'Adverse Selection / Rationing',
    title: '当更高利率改变申请者构成或借款人行为时，银行预期回报可能不再随利率单调上升。',
    paragraphs: [
      '在 Stiglitz–Weiss 类型模型中，提高贷款利率会赶走较安全借款人，或诱导已借款者选择更高风险项目，使银行的预期回收在某点后下降。于是市场不必靠无限提高利率清算，银行可能在愿意支付更高利率的借款人之间实行数量配给。',
      '这是依赖信息结构、合同和分布假设的条件结果，不是任何拒贷的普遍解释。现实拒贷也可能来自资本、集中度、盈利或合规门。应用时应寻找利率—风险构成非单调、相似申请获得不同数量等可证伪含义，并与普通风险定价区分。',
    ],
    sourceIds: [11, 12, 13],
    formula: { label: '条件非单调', expression: 'd E[bank return | applicant pool(r), borrower action(r)] / dr may become ≤ 0', note: '“may”是关键；若申请池与行为不随利率变，结论未必成立。' },
  },
  {
    id: 'nonprice-tightening-ranking', number: 35, label: 'Nonprice Tightening / Ranking',
    title: '当额度稀缺或价格难以调整时，银行会按既定排序把信用留给更高净价值或更强关系的客户。',
    paragraphs: [
      '银行可缩短期限、提高抵押比例、增加契约、放慢审批并优先续作核心客户。这些变化让边缘借款人的可得性下降，却未必显著抬高成交样本的平均利率。SLOOS 与 BLS 的标准和条款题能提供方向性证据，但净比例只表示报告收紧的银行占比差，不是强度百分点。',
      '本节冻结风险评分和管理风险容忍度，因此排序只响应可用资金与容量；若银行主动改变评分模型或追逐收益，则转入 3.12。关系优先也可能保护信息资本，却把冲击推向新客户和外围客户，形成分配效应。',
    ],
    sourceIds: [16, 17, 18, 19, 27, 44, 53, 56],
    formula: { label: '固定排序下的配给', expression: 'allocate scarce capacity to ranked offers until comparable loan capacity is exhausted', note: '排序规则必须事先冻结；事后按结果重排会形成循环解释。' },
    after: <CreditMenuRationingLab />,
  },
  {
    id: 'pass-through-speed-stickiness', number: 36, label: 'Pass-through Speed / Stickiness',
    title: '贷款传导速度由负债重定价、合同重定价、竞争和关系平滑共同决定。',
    paragraphs: [
      '政策率变化先进入可立即重定价的市场融资，再逐步进入存款报价和较长期负债；银行可以暂时用利润率吸收变化。资产端又受申请处理、报价有效期和合同 fixing lag 影响，所以资金成本与贷款利率可能不同步，甚至在短窗口内方向相反。',
      '黏性不是“银行反应慢”的单一参数。它可以来自固定合同、客户转换成本、平滑关系价格、调整成本或数据聚合。经验分析应估计分布式滞后并按新业务/存量、固定/浮动、银行资金结构分组，同时检查样本构成。',
    ],
    sourceIds: [19, 25, 33, 34, 35, 37, 57],
    formula: { label: '分布式传导', expression: 'Δr_loan,t = Σ_{k=0}^{K} θ_k × Δr_reference,t−k + composition/error terms', note: '只使用当期与过去参考率；θ_k 是经验对象，结构解释还需资金与合同暴露。' },
  },
  {
    id: 'tightening-easing-low-rate-asymmetry', number: 37, label: 'Tightening / Easing Asymmetry',
    title: '收紧、宽松和极低利率区间可能具有不同传导函数，方向不能由线性模型预先规定。',
    paragraphs: [
      '收紧时存款 beta 可能先低、净息差改善，随后存款外流和批发替代使资金成本跳升；宽松时存款利率接近下限，负债成本难以下降，但资产收益继续重定价。资本较弱、久期错配较大或依赖零售存款的银行可能出现更弱传导，特定模型甚至产生 reversal。',
      '这些条件不支持一个跨银行、跨法域固定“反转利率”。净效应还取决于贷款需求、存款迁移、对冲、资产久期、资本化和央行工具设计。稳健做法是预先定义状态变量与非线性区间，报告区间支持，而不是事后寻找最显著阈值。',
    ],
    sourceIds: [25, 34, 35, 36, 37, 38],
    formula: { label: '状态依赖', expression: '∂loan supply/∂policy = g(deposit floor, outflow, NIM, duration, capital, funding access)', note: 'g 可正、弱化或反转；符号是待检验结果。' },
  },
  {
    id: 'deposit-franchise-local-market-power', number: 38, label: 'Deposit Franchise',
    title: '存款特许权把支付服务、客户惰性和地方竞争转换成融资成本优势，也带来利率上升时的流失风险。',
    paragraphs: [
      '银行通过网点、支付账户、工资结算和长期客户关系提供流动性服务，因而某些存款人接受低于市场工具的利率。地方市场集中和转换摩擦可放大这一楔子，使存款丰富的银行在初期拥有更低融资成本，并把政策变化以不同速度传到贷款。',
      '特许权价值不是永续稳定负债。数字转账、货币基金收益和大额未保存款风险会降低惰性；快速迁移时，过去低 beta 的银行可能面对更大数量冲击。研究必须联合观察存款价格、余额、客户类型与替代融资，不能只按历史存款占比贴标签。',
    ],
    sourceIds: [19, 25, 29, 30],
    formula: { label: '特许权楔子', expression: 'deposit franchise value ≈ market funding cost − all-in retained-deposit cost + net bundled-service value', note: 'all-in retained-deposit cost 若已含账户服务成本就不再另扣；净服务价值须把服务收入与尚未计入的服务成本相抵。' },
  },
  {
    id: 'deposit-migration-replacement-funding', number: 39, label: 'Deposit Migration / Replacement',
    title: '存款迁移先改变银行间负债分布，再通过替代融资价格与可得性进入贷款供给。',
    paragraphs: [
      '客户从 A 行转到 B 行时，体系存款总额可以不变，但 A 行失去存款与准备金，B 行取得二者。A 行若要保留贷款资产，必须提高存款报价、借入批发资金、出售资产或使用央行流动性；B 行则未必立即增加贷款，可能先持有流动资产。',
      '因此“体系存款稳定”不否定银行贷款渠道，关键是分布与替代成本；“准备金流入 B 行”也不保证 B 行放贷，因为仍有资本、风险、需求与资产配置门。银行级研究应把存款流出与同日/随后融资动作连接，并处理客户质量和地区冲击。',
    ],
    sourceIds: [10, 25, 27, 29, 31, 32],
    formula: { label: '单行融资缺口', expression: 'replacement need_A = max(0, deposit outflow_A − asset runoff_A − usable liquidity_A)', note: '这是一家法人在给定窗口的需求；体系合并会抵销银行间存款迁移。' },
  },
  {
    id: 'average-versus-marginal-funding-mix', number: 40, label: 'Average / Marginal Funding Mix',
    title: '融资组合权重会内生变化，所以固定权重 pass-through 只是第一轮比较，不是完整预测。',
    paragraphs: [
      '第一轮要分两套权重：stockWeightRatio 乘各来源存量成本，回答期初平均资金篮子怎样重定价；marginalFundingShareRatio 乘下一单位资金包的来源成本，回答匹配期限MCF怎样变化。两套权重可以数值相同，却不能共用一个字段。第二轮才允许低 beta 存款流失、替代来源与期限改变，重算边际资金包；把两轮混在一起会无法判断结果来自存量价格、边际来源还是数量迁移。',
      'C2 因此同时展示存量平均成本、边际资金包及存款流出后的替代效应，并把两套份额和、百分点/基点转换与流出边界设为断言。deposit beta 只用于存款；批发来源使用一般 passThroughCoefficient。它是可复算合成模型，不意味着真实银行按线性系数管理；经验应用必须使用当期产品级数据并给出估计误差。',
    ],
    sourceIds: [8, 10, 19, 25, 27, 29, 33, 64],
    formula: { label: 'C2 · 两套权重', expression: 'ACF = Σ_j w_stock,j c_average,j; MCF = Σ_j m_marginal,j c_marginal,j; then rebuild m after outflow/replacement', note: 'w_stock 与 m_marginal 各自严格合计为1；pass-through、流出和替代分阶段计算。' },
  },
  {
    id: 'liquid-asset-buffer', number: 41, label: 'Liquid-asset Buffer',
    title: '流动资产缓冲让银行暂时吸收资金冲击，但使用缓冲与出售资产都会改变下一轮选择集。',
    paragraphs: [
      '现金、准备金和可变现证券可以满足存款流出或承诺提款，使银行不必立即削减贷款。缓冲较高的银行因而可能在短期维持供给；但证券价格、haircut、市场深度和操作资格决定实际可用价值，账面余额不能直接等同现金容量。',
      '消耗缓冲后，银行更接近内部流动性阈值，未来贷款的影子成本上升；出售证券又可能实现损益、改变久期和资本。危机数据中缓冲与贷款同时变化还可能反映预防性管理，所以因果研究需要事前暴露或外生流动性冲击。',
    ],
    sourceIds: [9, 22, 27, 28, 29, 39],
    formula: { label: '可用流动性', expression: 'usable liquidity = cash + reserves + haircut-adjusted sale/repo capacity − encumbrance − operational reserve', note: '估值日、币种和结算时限必须与资金缺口一致。' },
  },
  {
    id: 'capital-headroom-deleveraging-choice', number: 42, label: 'Capital Headroom / Deleveraging',
    title: '资本余量不足时，银行可补充资本、留存收益、降低分红、减持资产或改变贷款组合；缩贷只是选项之一。',
    paragraphs: [
      '风险资本比率可通过提高分子或降低分母改善。发行股本和留存收益增加资本，但速度、成本与市场窗口受限；减少高风险权重贷款、转向低权重资产、出售或证券化暴露则调整分母。杠杆约束又可能使单纯换成低风险权重资产无法释放同样容量。',
      '教学容量把其他资产、风险权重、留存收益和缓冲冻结后，计算资本可支持的新增同类贷款，再与流动性、稳定融资和集中度容量取同单位最小值。真实银行会在多个边际联立优化，所以结果只能称局部 headroom，不能称未来实际放贷量。',
    ],
    sourceIds: [20, 21, 22, 23, 24, 26, 41, 42],
    formula: { label: '资本容量近似', expression: 'capacity_capital = max(0, CET1 / k_min − current RWA) / marginal risk weight', note: '只适用于冻结其他资产、资本、风险权重与缓冲的 SYNTHETIC 灵敏度；先与其他约束换成同一贷款单位。' },
  },
  {
    id: 'bank-size-is-proxy', number: 43, label: 'Bank Size as Proxy',
    title: '银行规模可能代理市场融资、分散化与组织能力，却不是贷款渠道的原始机制。',
    paragraphs: [
      '早期研究常比较小银行和大银行，理由是小银行更难无摩擦替代存款流失。可是规模还与客户类型、地理市场、业务模式、证券持仓、资本、流动性和集团支持相关；只观察“小银行收缩更多”不能判断究竟是哪条约束发挥作用。',
      '更好的设计把规模作为分层变量，同时直接测量存款 beta、批发融资准入、流动资产、资本余量和借款人构成。若直接指标已进入模型，规模系数应被解释为剩余相关性；如果规模仍是唯一代理，就必须承认它混合多种机制。',
    ],
    sourceIds: [5, 6, 9, 20, 22, 26],
    formula: { label: '代理变量警告', expression: 'size → {funding access, diversification, organisation, client mix}; size ≠ mechanism', note: '异质性分组能发现候选渠道，不能自动为中间变量命名。' },
  },
  {
    id: 'internal-capital-markets-global-banks', number: 44, label: 'Internal Capital / Global Banks',
    title: '银行集团可在法人和国家间调配资金与资产，但可转移性、监管与当地融资让内部市场并非无摩擦。',
    paragraphs: [
      '跨国银行可通过总部—分支、母子公司、内部存款或资产转移缓冲某地冲击，也可能把总部融资压力传给境外贷款组合。同一集团内，流动性、资本与损失吸收能力受法律实体、币种、环形隔离和监管要求限制，集团合并状态不能替代发放贷款法人的状态。',
      '识别国际传导需要保存冲击发生实体、内部流量、当地存款与当地借款人需求。观察某国分支贷款下降，既可能是总部供给冲击，也可能是当地需求或集团把资产转向别处；跨国银行证据不能无条件外推到纯国内小银行。',
    ],
    sourceIds: [31, 32],
    formula: { label: '法人级传导', expression: 'local lending = f(local funding, internal transfer capacity, parent shock, legal transfer constraints, local demand)', note: '内部资金净流入不等于集团新增融资，也可能只是资产负债重排。' },
  },
  {
    id: 'maturity-repricing-mismatch', number: 45, label: 'Maturity / Repricing Mismatch',
    title: '资产负债期限和重定价错配决定利率变化先影响现金流、经济价值还是滚动风险。',
    paragraphs: [
      '长期固定贷款由短期可重定价存款融资时，收紧会先抬高负债成本而资产收益暂时不变；浮动贷款配长期固定债务则可能先改善利差。久期缺口影响资产负债经济价值，重定价缺口影响近期净利息收入，融资到期缺口影响能否续作，三者不应混成一个 maturity mismatch。',
      '银行可通过利率互换、期限债务和贷款销售对冲部分错配，但对冲有基差、保证金和对手方风险。研究应读取名义期限、下一重定价日和对冲后暴露；仅按资产“长期”、负债“短期”分类会误判现金流方向。',
    ],
    sourceIds: [29, 33, 35, 37, 38, 63],
    formula: { label: '三只时钟', expression: 'contract maturity ≠ next rate reset ≠ funding rollover date', note: '每只时钟分别进入信用风险、利率现金流与流动性分析。' },
  },
  {
    id: 'central-bank-term-funding-design', number: 46, label: 'Central-bank Term Funding',
    title: '央行期限融资通过价格、期限、抵押品与激励条件改变银行边际资金状态；工具设计决定估计对象。',
    paragraphs: [
      '长期再融资可减少短期滚动风险，目标性工具还可能将利率优惠与特定贷款增长挂钩。参与并非随机：抵押品、操作资格、预期需求和银行自身压力都会影响借款；阈值或配额设计有时提供准实验，但得到的是规则附近或参与银行的局部效应。',
      '期限央行负债不会机械变成贷款。银行也可替换既有融资、持有证券或修复流动性缓冲；只有比较符合条件与不符合条件的贷款、银行暴露及时间路径，才能判断资产端反应。普通政策率变化、LTRO、TLTRO 和紧急流动性支持必须分别编码。',
    ],
    sourceIds: [10, 39, 40],
    formula: { label: '工具护照', expression: 'facility = price + maturity + collateral + eligibility + incentive threshold + allotment rule + take-up clock', note: '缺任何关键规则时，只能描述余额，不能解释处理强度。' },
  },
  {
    id: 'securities-loan-sale-securitisation', number: 47, label: 'Securities / Loan Sale / Securitisation',
    title: '银行可在贷款、证券和出售渠道间重新配置资产；资产购买政策也可能产生挤入与挤出。',
    paragraphs: [
      '当证券收益或流动性价值变化，银行可能卖券支持贷款，也可能把新增容量配置到被政策直接支持的资产。特定资产购买会改变持有这些资产银行的资本、流动性或相对回报，但总贷款方向取决于资产替代；抵押贷款增加可以同时伴随商业贷款减少。',
      '出售或证券化贷款还会释放或保留不同风险：会计终止确认、追索权、服务相关的继续涉入和留存分层共同决定银行仍保留哪些会计与经济风险；单纯且得到充分补偿的服务义务本身不能被自动等同为继续保留风险。观察发放增加不等于银行最终持有风险，观察存量下降也不等于借款人融资减少。',
    ],
    sourceIds: [3, 6, 9, 41, 42, 54, 55, 66],
    formula: { label: '银行内资产约束', expression: 'Δloans + Δsecurities + Δliquid assets + other asset changes = financed balance-sheet change', note: '恒等式只要求配平；资产选择方向仍由收益、风险和约束决定。' },
  },
  {
    id: 'loan-types-revolvers-commitments', number: 48, label: 'Loan Types / Revolvers',
    title: '按揭、商业定期贷款、循环额度和消费信贷具有不同提款、重定价、担保与需求机制。',
    paragraphs: [
      '定期贷款通常在起始时发放，循环额度允许在承诺期内多次提款与偿还，按揭受长期固定期、抵押品和提前偿还影响，信用卡把授信与日常支付连接。政策变化对“新发放”与“存量”的含义因此因产品而异。',
      '压力期企业会预防性提款既有额度，导致商业贷款存量上升，却同时面对新申请收紧；住房贷款下降又可能来自购房需求和提前还款。实证必须按产品建立 pipeline 与合同护照，不能把 H.8 或资产负债表总贷款的一次跳变直接当供给。',
    ],
    sourceIds: [18, 27, 28, 29, 30, 53, 54, 56, 57],
    formula: { label: '产品状态机', expression: 'product rules determine apply → commit → originate → draw → reset → repay/prepay', note: '同名“贷款增长”跨产品比较前先对齐事件定义。' },
  },
  {
    id: 'banking-competition-local-structure', number: 49, label: 'Competition / Local Structure',
    title: '当地银行竞争同时影响存款融资和贷款加价，并决定受冲击客户是否有替代银行。',
    paragraphs: [
      '市场集中可能让银行压低存款 beta、扩大存款特许权，也可能提高贷款加价；但更高关系投资和网点覆盖也可能改善信息生产。借款人面对的有效竞争集合由产品、地理、规模和信息可移植性决定，国家级银行数量不是充分指标。',
      '竞争还改变政策冲击的重新匹配速度：有多家可比贷款人时，原行收缩更容易被替代；高度集中或关系专用信息强时，总融资效应更大。研究应使用事前市场结构与可行贷款人集合，并警惕银行进入退出对本地经济状态的内生反应。',
    ],
    sourceIds: [17, 18, 19, 25, 40, 49, 50, 52],
    formula: { label: '双侧竞争', expression: 'local structure → deposit pricing/funding and loan pricing/substitution set', note: '同一集中度指标可能通过两侧产生相反作用，不能只保留一个符号。' },
  },
  {
    id: 'information-capital-relationship-lending', number: 50, label: 'Information Capital',
    title: '关系银行积累难以标准化的借款人信息，既能缓解信息不对称，也会提高转换成本。',
    paragraphs: [
      '交易账户、还款记录、管理层互动和贷后监督让银行形成对企业质量的私有判断。该信息可降低筛选成本、支持危机中的持续授信或跨期平滑价格；外部银行却无法立即验证，于是受冲击借款人即使基本面不变也可能失去融资。',
      '关系本身有选择：质量高的企业可能更易建立多重关系，困难企业也可能更依赖一家银行。经验研究应在冲击前定义关系长度、主办行、产品范围与信息代理，避免用冲击后的贷款余额反向定义“强关系”。',
    ],
    sourceIds: [14, 15, 16, 17, 18, 19, 43, 48],
    formula: { label: '关系资产', expression: 'information capital_t = accumulated signals and monitoring history, not merely loan balance_t', note: '它通常不可直接观测，需要多个事前代理与稳健性检验。' },
  },
  {
    id: 'existing-versus-new-relationships', number: 51, label: 'Existing / New Relationships',
    title: '当既有关系信息难以移植且未来关系租金足够高时，银行收紧可能优先保护老客户并削减新关系。',
    paragraphs: [
      '既有关系已经支付筛选成本并积累信息，银行还可能希望保护未来租金；新客户需要重新验证，风险与运营成本更不确定。在关系信息不可移植、未来租金较高且老客户信用质量未恶化的状态下，容量紧张的银行可能维持老客户续贷却提高新客户拒绝率，使总贷款组合看似稳定而市场进入受阻。',
      '相反，僵化或问题关系也可能被终止，不能假定既有客户总获保护。分析应比较新申请、续作、展期和终止，并把关系年龄、客户风险与银行冲击前状态预先固定；只在持续关系中做平衡面板会删除最重要的退出结果。',
    ],
    sourceIds: [16, 17, 18, 19, 28, 44, 48],
    formula: { label: '进入与存续', expression: 'closing relationships = opening relationships + newly formed − terminated/expired = surviving old + newly formed', note: '两种写法等价但不能混写后重复扣除退出；平衡面板只保留存续关系。' },
  },
  {
    id: 'core-peripheral-expertise', number: 52, label: 'Core / Peripheral Clients',
    title: '银行可能依据关系价值、行业知识与地区专长区分核心和外围客户，使冲击沿网络非均匀分配。',
    paragraphs: [
      '核心客户可能贡献存款、支付、费用和长期信息；若这些关系价值超过其资本、流动性和集中度机会成本，银行在资金紧张时可能优先保留它们，外围客户、陌生行业或异地借款人则更容易被削减。反过来，核心客户若高度集中或质量恶化，也可能最先触发限额。专业化同时有两面：更强行业知识降低信息成本，却提高组合集中和共同冲击风险。',
      '“核心”必须用冲击前交易与关系指标定义，而不能用事后是否获贷定义。研究还应分开关系价值和借款人质量：若核心客户本来更稳健，差异不全是分配偏好；银行—行业固定效应和同一借款人比较可改善但不能完全消除选择。',
    ],
    sourceIds: [16, 17, 18, 19, 31, 32, 43, 49],
    formula: { label: '组合排序', expression: 'rank = f(expected net value, information capital, strategic fit, concentration cost), measured pre-shock', note: '排序是多维状态，不应用单一“关系贷款”虚拟变量替代全部机制。' },
  },
  {
    id: 'applications-matching-termination', number: 53, label: 'Applications / Matching / Exit',
    title: '贷款数据由借款人申请、银行筛选、双方接受与关系终止共同生成，匹配不是外生背景。',
    paragraphs: [
      '企业会根据预期成功率和转换成本选择申请银行，银行也通过营销、预审与网点筛选潜在客户。只有双方接受且条件满足才观察到贷款；因此成交数据是双边选择的结果，未匹配的申请和退出关系包含关键反事实信息。',
      '同一借款人固定效应吸收共同需求，但只适用于在同一窗口连接多家银行的企业，且不能净化银行特定申请或关系冲击。申请级设计更接近审批供给，却仍需处理借款人挑选银行与银行选择送审样本。报告支持集比追求单一“净化需求”标签更诚实。',
    ],
    sourceIds: [17, 18, 43, 44, 45, 48, 58],
    formula: { label: '匹配观测门', expression: 'Observed loan = Apply(i,j) × Approve(j,i) × Accept(i,j) × Contract conditions met', note: '任一项为零都不会出现成交；零值本身具有经济含义。' },
  },
  {
    id: 'within-bank-portfolio-reallocation', number: 54, label: 'Within-bank Reallocation',
    title: '银行总贷款不变仍可发生强烈供给冲击：容量会在客户、产品、地区与证券之间重新分配。',
    paragraphs: [
      '定向资产购买或监管权重变化可使银行扩大按揭而挤出商业贷款；资金冲击也可能让银行保护关系客户、削减新客户。总贷款把正负变化相抵，会漏掉谁获得信用和谁承担收缩。银行内比较要求所有用途使用同一容量单位，并保留直接目标与未目标资产。',
      'C6 冻结两家银行的风险评价和容忍度，让资金与容量差异决定多名借款人的要约和重新匹配。它展示总量相同也能改变借款人分布，但不把合成排序当成现实最优；经验应用需用事前专业化、关系和资产暴露解释配置。',
    ],
    sourceIds: [6, 9, 27, 31, 32, 40, 41, 42, 43, 44],
    formula: { label: '银行内分解', expression: 'Δtotal loans = Σ_client/product/geography Δexposure; Σ may be 0 while components are large', note: '总量零不等于没有处理效应，只说明正负重新配置相抵。' },
    after: <BankBorrowerAllocationLab />,
  },
  {
    id: 'other-bank-bond-nonbank-substitution', number: 55, label: 'Other-bank / Bond / Nonbank',
    title: '替代融资是一张有资格、成本与时滞的选择树，不是一项默认等于原贷款缺口的残差。',
    paragraphs: [
      '其他银行需要重新筛选并受自身容量约束；债券融资要求规模、评级、披露和市场窗口；非银融资可能更快却更昂贵、期限更短或担保更强。商业信用属于外部融资，可能把压力传给供应商；内部现金不是融资来源，而是外部融资缺口形成后到实体支出之间的资源缓冲。两层必须分开保存金额、全成本与到达时间。',
      '替代率必须以同一借款人和窗口计算，并处理原银行冲击之外的共同市场变化。若债券发行增加，可能只是大企业主动由银行贷款切换，也可能反映供给冲击；无债券准入的企业不能被当作“选择不替代”的同质对照组。',
    ],
    sourceIds: [2, 4, 5, 31, 43, 45, 46, 47, 48, 51],
    formula: { label: '两层缺口', expression: 'Δexternal finance = Δoriginal bank + Δother bank + Δbond + Δnonbank + Δtrade credit; post-cash resource change = Δexternal finance + cash buffer used', note: '现金使用不进入 borrower-total external-finance estimand；两式均须统一方向、币种和窗口，未观测项保持 missing。' },
  },
  {
    id: 'pair-versus-borrower-total-effect', number: 56, label: 'Pair / Borrower-total Effect',
    title: '贷款对估计量回答原银行发生什么；借款人外部融资总额估计量才回答企业最终从金融与商业信用来源失去多少资金。',
    paragraphs: [
      '令 τ_pair 为受冲击银行对同一借款人的贷款变化，τ_borrower-external 为该借款人全部银行、债券、非银和商业信用等外部融资之和。其他银行若补回一部分，|τ_borrower-external| 小于 |τ_pair|；过度替代时还可能符号不同。二者都有效，但不能互相改名，内部现金也不属于后者。',
      '同一借款人—时期固定效应常帮助识别 τ_pair，因为它比较同一企业的不同银行关系；然而这些企业必须拥有多家活跃贷款行，且该方法把企业共同融资需求吸收掉后无法直接估计 τ_borrower-external。要跨层需要新的聚合、对照与识别设计，而不是把 pair 系数乘余额。',
    ],
    sourceIds: [31, 43, 44, 45, 46, 47],
    formula: { label: '两个估计量', expression: 'τ_pair = effect on lender–borrower exposure; τ_borrower-external = effect on borrower total external finance', note: '估计单位、支持样本、反事实与标准误结构都不同，应并列报告；内部现金随后才进入资源缓冲。' },
  },
  {
    id: 'real-outcomes-lags-spillovers', number: 57, label: 'Real Outcomes / Lags / Spillovers',
    title: '总融资缺口要经过现金缓冲、项目不可逆性与生产网络，才转化为投资、就业和产出。',
    paragraphs: [
      '企业可先使用现金、削减库存、延迟资本开支、压缩招聘或延长供应商账期，不同结果具有不同调整时滞。营运资本依赖高的企业可能迅速缩产，长期投资则在计划与建设周期中延迟。研究应预先指定结果和 3、6、12、24 个月等窗口，而非逐期挑选显著点。',
      '银行冲击还会通过供应链、地方需求和劳动力市场外溢到未直接借款企业，破坏无干扰假设。企业级直接效应不能机械加总成宏观乘数；需要明确网络、地区或投入产出暴露，并把一般均衡替代与价格反馈交给更高层分析。',
    ],
    sourceIds: [48, 49, 50, 51, 52],
    formula: { label: '分层结果', expression: 'bank shock → borrower total external finance → post-cash resources → working-capital/investment margin → direct outcome → network spillover', note: '每个箭头都可能被替代或反馈削弱，不能跳过中间层。' },
  },
  {
    id: 'credit-supply-identification-designs', number: 58, label: 'Supply Identification',
    title: '供给识别需要银行侧外生或准外生暴露、可比需求和明确支持集，固定效应不是万能净化器。',
    paragraphs: [
      '常见设计包括同一借款人跨银行比较、同一申请被不同银行处理、银行对外部流动性冲击的事前暴露、监管资本要求变化、跨境母行冲击、工具分配阈值和资产购买持仓暴露。每种设计识别不同局部处理效应，并依赖暴露排除限制、平行趋势或阈值不可操纵等假设。',
      '需求控制也有代价：borrower×time fixed effects 通常删除单银行企业，并不能控制银行特定需求；行业×地区×规模×时间控制可保留更多企业，却要求组内需求同质。好的研究同时报告第一阶段、预趋势、支持重叠、聚类层级与替代定义，而不是只展示一个显著贷款系数。',
    ],
    sourceIds: [23, 24, 31, 32, 39, 40, 41, 43, 44, 45, 46, 49],
    formula: { label: '识别护照', expression: 'estimand + treatment/shock + exposure + demand control + support + timing + clustering + exclusion restriction', note: '缺任一关键项时，identificationStatus 保持 descriptive 或 candidate-shock。' },
  },
  {
    id: 'falsification-placebo-aggregation', number: 59, label: 'Falsification / Aggregation',
    title: '可信贷款渠道结果必须经得起预趋势、安慰剂、替代、样本与跨层聚合审计。',
    paragraphs: [
      '预趋势检验银行暴露组在冲击前是否已分化；安慰剂可使用不应受影响的贷款类型、虚假事件日或未来暴露；余额桥检查结果是否其实来自核销、出售和重分类；替代检验把其他银行、债券和非银融资加回。还应改变暴露定义、窗口和聚类层级并报告多重检验。',
      'C7 强制把 τ_pair、τ_borrower-external 和 τ_real 分栏，逐步显示替代如何改变估计对象，并把多银行固定效应的外部有效性写进输出。三栏分别拥有识别状态；贷款对设计通过不会让只有前后均值的外部融资或实体栏越级。任何会计一致或条件情景通过都不升级因果状态，只有各栏自己的设计假设、诊断与支持集共同成立，才允许该栏从 descriptive 升级。',
    ],
    sourceIds: [43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 54, 55, 58],
    formula: { label: '三层估计量', expression: 'τ_pair → τ_borrower-external → τ_real, with substitution, cash buffer and timing explicitly measured', note: '箭头表示新的数据、反事实与假设，不表示把前一系数机械缩放即可得到后一系数。' },
    after: <><div className="precision-note"><span>H1–H6 · 六条条件化、可证伪的研究假设</span><ol>
      <li><b>H1 · state / estimand / horizon：</b>状态为短期或浮息负债占比、批发融资依赖、对冲后重定价缺口；估计量为可比借款人下 0–3 个月的银行—申请/贷款对要约。<b>方向：</b>收紧对高暴露银行的楔子与数量条款影响更强。<b>支持/拒绝：</b>只在共同借款人或申请支持集检验；暴露交互项为零、反号或冲击前已同向分化即拒绝。<Cites ns={[8, 9, 10, 25, 33, 63]} /></li>
      <li><b>H2 · state / estimand / horizon：</b>状态为匹配期限MCF、约束容量和冻结风险；估计量为 0–6 个月的 pair-level 全口径报价、审批、额度与条款向量。<b>方向：</b>同一申请面对银行暴露更高者，银行楔子上升或可得数量下降。<b>支持/拒绝：</b>只有共同基准变化而银行特定楔子与数量条款不动，或需求控制失败时，不支持独立供给反应。<Cites ns={[43, 44, 64]} /></li>
      <li><b>H3 · state / estimand / horizon：</b>状态为其他银行、债券、非银与商业信用的资格、成本和到达时滞；估计量为同一借款人 0–6 个月的 τ_borrower-external。<b>方向：</b>替代越不完全，外部融资总额降幅越接近 pair 降幅。<b>支持/拒绝：</b>仅限外部来源可完整观测的借款人；完全替代时估计应接近零，否则拒绝口径或机制，内部现金只进入下一层。<Cites ns={[43, 46, 47, 51]} /></li>
      <li><b>H4 · state / estimand / horizon：</b>状态为替代资格、现金缓冲、营运资本依赖和关系信息可移植性；估计量为独立对照设计下 6、12、24 个月的投资、就业或产出效应。<b>方向：</b>影响集中在替代弱、现金少或营运资本依赖高的企业。<b>支持/拒绝：</b>支持集与结果窗口必须预注册；外部融资未受影响的企业同幅响应或只有同期相关即挑战机制。<Cites ns={[17, 18, 48, 50, 51, 52]} /></li>
      <li><b>H5 · state / estimand / horizon：</b>状态为合同重定价桶、pipeline事件和余额桥；估计量依次为当期新业务报价/审批、随后合同存量利率及 1–12 个月余额。<b>方向：</b>要约与审批先动，存量后动。<b>支持/拒绝：</b>若领先关系消失，或余额变化可由核销、出售、购买、偿还、汇率与重分类解释，则拒绝贷款供给时序解释。<Cites ns={[28, 33, 34, 53, 54, 57]} /></li>
      <li><b>H6 · state / estimand / horizon：</b>状态为存款下限、数量流出、净息差、IRRBB和资本余量；估计量为预设利率区间内 0–12 个月的银行特定要约响应。<b>方向：</b>低利率区间的边际响应由这些状态交互决定，不预设统一反转点。<b>支持/拒绝：</b>在有重叠支持的法域/银行内检验；预设交互不产生异质性或阈值对样本定义不稳健时，拒绝该非线性叙事。<Cites ns={[25, 35, 36, 37, 38, 63]} /></li>
    </ol></div><LendingEstimandLab /></>,
  },
];

const checks = [
  { question: '政策率上升后企业贷款减少，为什么还不能称为银行贷款供给收缩？', answer: '项目现值和借款需求可能同步下降，也可能只是浮动贷款机械重定价。必须在可比借款人/申请下观察银行特定报价、审批、额度或条款变化。', sourceIds: [1, 3, 7, 43, 44] },
  { question: '“贷款能创造存款”为什么不等于融资成本与存款结构无关？', answer: '提款分录与后续资产负债管理是两层问题；跨行支付、存款流失、期限和约束会改变下一单位贷款的边际资金成本与容量。', sourceIds: [8, 10, 19, 25, 29] },
  { question: '平均资金成本为 2%，是否可直接作为新贷款的资金成本？', answer: '不可。历史平均值适合解释当期利润；新贷款应读取下一单位可持续融资的边际成本、预计存款流失、替代来源与期限。', sourceIds: [19, 25, 33] },
  { question: '存款 beta 较低是否必然意味着收紧时银行贷款更多？', answer: '不必然。低 beta 初期保护成本，却可能诱发存款外流和昂贵替代融资；净效应还取决于资本、流动性和需求。', sourceIds: [25, 29, 35, 36] },
  { question: '一笔贷款基准 3%、资金楔子 0.4%、预期损失 0.6%、运营 0.3%、资本 0.4%、流动性 0.2%、集中度 0.1%、加价 0.5%，名义报价是多少？', answer: '在全部均为年化百分点且无重复计量的冻结例中是 5.5%；若另有年化费用 0.5%，all-in 为 6.0%。', sourceIds: [10, 21, 22, 25, 26, 33] },
  { question: '申请 100、批准 60、实际提款 40，银行供给量应写 40 还是 60？', answer: '二者回答不同问题：批准额度为 60，提款为 40；offer ratio 为 60%，utilisation 为 40/60。不能用提款替代审批供给。', sourceIds: [18, 28, 30, 44] },
  { question: '为什么成交贷款平均利率下降也可能伴随信贷收紧？', answer: '边际高风险或高成本申请被拒后，幸存获贷样本质量更高，构成变化可压低均值；需同时观察申请母体、拒绝、额度和非价格条款。', sourceIds: [12, 44, 53, 56, 57] },
  { question: '资本比率高于最低值为什么仍可能形成资本影子成本？', answer: '管理缓冲、压力测试、市场预期和未来损失使剩余容量稀缺；比率是否合规与下一单位容量的机会成本不是同一问题。', sourceIds: [20, 21, 22, 23, 24, 26, 67, 68] },
  { question: '资本、流动性与集中度各支持 250、180、200 单位同类贷款，可行容量为什么不是 630？', answer: '它们是必须同时满足的独立门。每项先从分子、分母与规则阈值推导有符号原生余量，再在保留各自原生 horizon 的前提下，按同一目标贷款本金单位、法人、币种、决策时点与 mapping basis 换算，最后取最小值 180；原始比率或容量不能相加。', sourceIds: [21, 22, 23, 24, 27, 62, 67, 68, 69, 70, 71] },
  { question: '短率下降是否必然通过银行渠道扩大贷款？', answer: '否。存款下限、净息差、存款外流、资产久期、资本化和需求会使传导弱化甚至在特定模型/状态中反转；不存在可跨制度套用的固定阈值。', sourceIds: [35, 36, 37, 38] },
  { question: '一家银行流失存款、另一家等额获得，体系存款未变，为什么贷款供给仍可能变化？', answer: '存款和准备金分布改变；流失行的替代融资成本与获存行的资本、需求、配置选择不同，重新分布可改变银行级要约和借款人匹配。', sourceIds: [10, 25, 29, 31, 32] },
  { question: '同一借款人固定效应是否完全解决贷款需求问题？', answer: '它吸收该企业同一时期的共同需求，但只覆盖拥有多条活跃银行关系的借款人，不能控制银行特定申请/关系需求，也不能直接估计借款人外部融资总额。', sourceIds: [43, 44, 45] },
  { question: '原银行贷款减少 20，其他银行增加 8、债券增加 2、非银增加 1，借款人外部融资总额变化与替代率是多少？', answer: '外部融资总额减少 9；观察到的外部替代为 11，替代率 11/20=55%。内部现金若再补4，只会把后续资源缺口收窄到5，不会把 τ_borrower-external 改写为−5。', sourceIds: [43, 46, 47] },
  { question: '银行总贷款不变，能否断言没有贷款供给效应？', answer: '不能。按揭增加与商业贷款减少、核心客户受保护与外围客户收缩可以相抵；应分客户、产品、地区和证券配置。', sourceIds: [40, 41, 42] },
  { question: 'SLOOS 报告净 30% 银行收紧，是否表示贷款标准平均收紧 30%？', answer: '不是。净比例通常是报告收紧者占比减报告放松者占比，反映方向分布而非连续强度；必须保存原题、样本和符号规则。', sourceIds: [53] },
  { question: 'H.8 贷款余额一周下降，能否直接解释为新贷款供给减少？', answer: '不能。余额还受需求、偿还、到期、核销、出售、合并、重分类和估计调整影响；需用存量—流量桥与更细数据。', sourceIds: [54, 55] },
  { question: '政策工具向银行提供期限资金后，贷款一定增加吗？', answer: '不一定。银行可替换原融资、持有证券或补充缓冲；资格、抵押品、分配和激励条件决定局部处理，资产端仍需验证。', sourceIds: [39, 40, 41] },
  { question: '什么时候可以把描述性银行状态升级为“已识别的贷款渠道”？', answer: '需明确 estimand、可辩护政策冲击/暴露、需求控制、支持集、时序、聚类、排除限制，并通过预趋势、安慰剂、替代和聚合审计。', sourceIds: [23, 24, 31, 39, 40, 43, 44, 49] },
] as const;

const glossary = [
  ['银行贷款渠道', '政策经银行资金、约束和资产端供给反应影响银行贷款的机制', '所有利率传导', '§07'],
  ['广义利率渠道', '无风险曲线变化经贴现和跨资产价格影响需求与支出', '银行特定供给楔子', '§07'],
  ['贷款供给', '在借款人风险与需求状态给定时银行愿意提供的合同集合', '贷款存量', '§03'],
  ['边际资金成本', '取得下一单位可持续融资的全成本', '历史平均利息成本', '§18'],
  ['存款 beta', '存款利率变化相对参考市场利率变化的区间比率', '存款流失率', '§19'],
  ['替代融资', '原融资收缩后由其他银行、债券、非银或商业信用补充的外部融资', '内部现金或原贷款行余额', '§55'],
  ['现金缓冲', '外部融资缺口形成后企业动用内部流动资产维持支出的资源缓冲', '外部融资来源', '§55–57'],
  ['全口径贷款成本', '名义利率与按一致期限年化费用共同形成的借款成本', 'headline spread', '§27'],
  ['基准利率', '与币种、重定价期限和现金流约定匹配的参考率', '政策率本身', '§17'],
  ['资金楔子', '银行边际融资成本相对匹配基准的差额', '全部贷款 spread', '§04'],
  ['预期损失', '给定期限和情景下违约概率、损失率与暴露的概率加权损失', '损失准备或核销', '§21'],
  ['资本影子价格', '稀缺资本容量用于下一单位贷款的机会成本', '资本比率', '§23'],
  ['流动性影子价格', '短期结算与稳定融资容量被占用的边际机会成本', '准备金余额', '§24'],
  ['集中度成本', '新增暴露占用稀缺客户、行业或地区组合空间的价值', '借款人 PD', '§25'],
  ['审批边际', '银行是否向一项合格申请提供任何信用', '实际提款额', '§32'],
  ['额度边际', '在获批条件下银行愿意承诺的最大数量', '期末贷款余额', '§33'],
  ['信用配给', '价格不继续清算时以拒绝或数量限制分配信用的状态', '任何拒贷', '§34'],
  ['非价格条款', '期限、抵押、担保、契约、摊还和审批速度等条件', '零成本附加条件', '§30'],
  ['新业务利率', '按方法定义的当期新签或重新协商业务利率', '所有新申请报价', '§28'],
  ['存量利率', '存续合同按指定余额与方法加权的利率', '当前边际报价', '§28'],
  ['重定价期', '合同基准下一次重新 fixing 的时间桶', '合同最终到期', '§29'],
  ['未用承诺', '银行已承诺但借款人尚未提款的额度', '表内贷款本金', '§13'],
  ['存款特许权', '支付服务、客户关系与转换摩擦带来的低成本存款价值', '无风险永久融资', '§38'],
  ['信息资本', '银行通过筛选、交易与监督积累的借款人专有信息', '贷款余额', '§50'],
  ['贷款对', '特定银行与特定借款人之间的一项关系或合同观测', '借款人全部融资', '§15'],
  ['τ_pair', '冲击对银行—借款人贷款对的处理效应', '借款人外部融资总额效应', '§56'],
  ['τ_borrower-external', '冲击对借款人全部外部融资来源之和的处理效应', '单家银行贷款效应或含内部现金的资源缺口', '§56'],
  ['τ_real', '经融资和行为路径对投资、就业或产出的处理效应', '贷款系数的别名', '§57'],
  ['支持集', '识别设计实际允许比较并承载估计量的观测总体', '目标总体自动代表样本', '§58'],
  ['净比例', '调查中报告一个方向者占比减报告相反方向者占比', '变化幅度百分比', '§35'],
  ['动态来源护照', '保存来源身份、口径版本、时点、序列键和刷新字段的记录', '网页当前值的永久快照', '§63'],
] as const;

const interfaces = [
  { name: 'I1 · 3.06 → 3.10', payload: 'effectiveOvernightRate、administeredTerms、facilityAccess、collateralState、liquidityBufferState、rateDispersion、timestamps', guardrail: '这是政策实施结果；不得把准备金余额或会议决定直接改名为银行供给冲击。' },
  { name: 'I2 · 3.07 → 3.10', payload: 'zeroCouponYields、forwardRates、levelFactor、slopeFactor、expectedShortRatePath、decompositionEstimateRange、timestamps', guardrail: '按币种、期限与重定价时钟匹配合同基准；分解区间不得坍缩成确定真值。' },
  { name: 'I3 · 3.08 → 3.10', payload: 'nominalCurveInput、modelRealRiskFreeCurve、exAntePolicyRealRate、realRateGap、claimSpecificPremiumSchema、timestamps', guardrail: '实际贴现输入服务需求与定价边界；不得作为银行特定融资楔子重复计算。' },
  { name: 'I4 · 3.09 → 3.10', payload: 'creditState、constraintState.fundingMix、eligibleDemand{amount,currency,horizon,capacityUnit}、expectedNetReturn{valuePctPointsPerYear,rateConcept,annualisation,currency,horizon}、legalEntity scope、event clocks', guardrail: '合格需求是金额容量，预期净收益是独立的利率/回报观测；读取信用创造后的银行状态，但不说银行把准备金“借给”企业，也不把存量当供给。' },
  { name: 'I5 · 3.10 → 3.11 / 3.12', payload: 'loanOfferState、creditDecisionState、loanContractPassport、relationshipState、frozen PD/LGD/collateral/risk-tolerance lineage', guardrail: '3.11 让借款人净值与抵押品内生，3.12 让筛选与风险容忍度内生；回传时保留本节冻结基线。' },
  { name: 'I6 · 3.10 → 3.13', payload: 'bankFundingState、bankConstraintState、loanOfferState、creditDecisionState、allocationState、substitutionState', guardrail: '交付多维分布而不是单一“信用条件指数”，并保留价格、数量、条款和法人异质性。' },
  { name: 'I7 · 3.10 → 3.14 / 3.15 / Chapter 4', payload: 'relationshipState、allocationState、substitutionState、repricing/funding buckets、jurisdiction/currency/entity scope', guardrail: '信用周期、跨境银行和非银反馈必须从分布状态出发，不将一国制度外推。' },
  { name: 'I8 · 3.10 → Chapter 7', payload: 'inputLineage、identificationState、measurementFlags、timestamps、pair/borrower-total-external/real estimands、dynamic-source passports', guardrail: '描述状态、候选冲击与已识别结果分级存储；三种 estimand 不得互相改名，每层独立决定是否拥有反事实。' },
] as const;

const contractInvariants = [
  '每个贷款对象必须绑定贷款人与借款人、法域、币种、产品、用途、申请—审批—承诺—发放—提款—存量时钟以及价格与非价格条款；未知写 null。',
  '平均资金成本与边际资金成本、存款价格 beta 与数量流失、合同到期与下一重定价日必须分别存储；不得由一个字段推断另一个。',
  '预期损失、运营成本、资本影子成本、流动性影子成本、集中度成本和目标剩余回报只能在统一年化与暴露口径后进入报价；μ_target 明确等于名义报价扣除匹配基准、资金楔子与逐项成本后的不含费用残差，费用只在 all-in 收入侧加入一次。每项保存 included-cost ID，任何 ID 重复即停止输出。',
  '资本、杠杆、流动性、稳定融资、集中度、资金与盈利门分别保存；minimum/maximum 规则的有符号原生余量必须由分子、分母和适用阈值重新推导，越界为负。各规则保留原生 horizon，只有明确映射到同一目标贷款本金单位、法人、币种、决策时点与 mapping basis 的转换容量才可取最小值；并列最小值须全部报告。',
  '贷款对、银行、借款人外部融资总额和宏观聚合层分别保存；内部现金只进入外部融资缺口之后的资源缓冲，跨层转换必须显式记录替代来源、支持集与新的识别假设。',
  '3.10 内借款人 PD/LGD/抵押品与银行风险容忍度在供给比较中冻结；若允许其内生变化，必须路由至 3.11/3.12 并另立估计量。',
  'SLOOS、H.8、Call Reports、BLS、MIR、AnaCredit、LPR 与社融进入经验分析前必须按各自刷新清单重取；参考身份记录不冒充数值快照。',
  '会计闭合、计算器通过、条件情景和时间相关都不升级因果状态；只有识别护照与预趋势、安慰剂、替代、聚合审计通过后才可标 identified。',
] as const;

const evidenceGroups = [
  { title: 'A｜贷款渠道基准与现代改写', text: 'S01–S10 建立银行贷款与市场融资不完全替代、银行异质性以及从准备金数量叙事转向融资成本与银行实力的框架；历史总量证据不自动识别现代结构冲击。', ids: Array.from({ length: 10 }, (_, index) => index + 1) },
  { title: 'B｜配给、监督与关系信息', text: 'S11–S19 支持价格之外的数量约束、委托监督、知情债务、关系贷款、授信额度与核心存款平滑；模型条件与横截面相关性不能普遍化。', ids: Array.from({ length: 9 }, (_, index) => index + 11) },
  { title: 'C｜资本、资金与流动性约束', text: 'S20–S30 支持资本和流动性缓冲、监管要求、存款渠道、危机融资与承诺提款的异质反应；危机机制与普通政策率冲击必须分开。', ids: Array.from({ length: 11 }, (_, index) => index + 20) },
  { title: 'D｜跨境、利率传导与非线性', text: 'S31–S40 支持全球银行内部传导、融资成本楔子、低/负利率状态、反转边界及期限/目标性融资；不存在跨制度固定阈值。', ids: Array.from({ length: 10 }, (_, index) => index + 31) },
  { title: 'E｜资产重配、微观识别与替代', text: 'S41–S48 支持 QE 暴露、银行内配置、同借款人/申请设计、供给冲击分解、债券替代与贷款申请；每种设计均有局部支持集。', ids: Array.from({ length: 8 }, (_, index) => index + 41) },
  { title: 'F｜实体后果与外溢', text: 'S49–S52 支持跨境银行冲击、就业、投资、贸易信用和地区外溢；直接企业效应不可机械加总成宏观乘数。', ids: Array.from({ length: 4 }, (_, index) => index + 49) },
  { title: 'G｜官方动态测量入口', text: 'S53–S60 分别提供 SLOOS、H.8、Call Reports、ECB BLS/MIR/AnaCredit、PBOC LPR 与社融的身份与方法入口；每项都有专属刷新字段且不单独构成供给冲击。', ids: Array.from({ length: 8 }, (_, index) => index + 53) },
  { title: 'H｜监管、FTP与会计边界', text: 'S61–S71 直接约束PD/LGD/EAD、大额暴露、银行账簿利率风险、匹配期限FTP、风险承担渠道、金融资产转移后的继续涉入，以及风险资本、杠杆、30日流动性、一年稳定融资和单一交易对手五类原生容量规则；规则必须按法域、适用层级与版本落地。', ids: Array.from({ length: 11 }, (_, index) => index + 61) },
  { title: 'I｜课堂合成模型', text: 'C1–C7、M1–M10 与 K1–K10 全部是 SYNTHETIC fixtures；文献只支持公式结构、制度边界与可检验方向，不为参数现实性、银行合规、政策建议或投资结论背书。', ids: [] },
] as const;

const lesson310ReferenceIds = new Set(lesson310References.map(({ id }) => id));
const lesson310LocalCitationIds = [
  ...conceptSections.flatMap(({ sourceIds }) => sourceIds),
  ...checks.flatMap(({ sourceIds }) => sourceIds),
  ...bankLendingScenarios.flatMap((scenario) => [...scenario.sourceIds, ...scenario.staticTwin.sourceIds]),
  ...evidenceGroups.flatMap(({ ids }) => [...ids]),
];
const lesson310EvidenceIntegrity = lesson310References.every(({ id }, index) => id === index + 1)
  && conceptSections.length === 58
  && conceptSections.every(({ number }, index) => number === index + 2)
  && lesson310LocalCitationIds.every((id) => lesson310ReferenceIds.has(id))
  && lesson310References.every(({ id }) => lesson310LocalCitationIds.includes(id))
  && lesson310SourceIdentityPassports.length === 8
  && lesson310SourceIdentityPassports.every(({ requiredRefreshFields }) => lesson310DynamicCommonRequirements.every((field) => requiredRefreshFields.includes(field)));

if (!lesson310EvidenceIntegrity) {
  throw new Error('3.10 evidence map, section sequence, or dynamic-source passport failed its build gate.');
}

function Lesson310Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>银行贷款渠道不是“降息—银行多贷”的直线，而是一条必须穿过银行边际成本、供给决定与借款人替代的条件链。</h2>
        <p>政策首先通过实际实施影响隔夜市场、期限曲线和银行可获得的资金；存款 beta、存款迁移、批发融资、期限错配、资本和流动性余量再决定下一单位贷款的边际成本与可用容量。银行把这些状态转换成基准加点、费用、审批、额度、期限、抵押和契约，并在客户、产品和证券之间重新配置。只有在借款人不能由其他银行、债券或非银融资完全替代时，原贷款行的收缩才会成为总融资缺口，并在具有时滞的现金、营运资本、投资与就业边际上产生实体影响。<Cites ns={[1, 5, 7, 9, 10, 25, 43, 50]} /></p>
        <p>这条链同时规定什么不属于 3.10：贷款与存款怎样生成由 3.09 负责；政策通过净值和抵押品改变借款人风险由 3.11 负责；银行风险容忍度和筛选标准的内生变化由 3.12 负责；3.13 接收的是分布状态而非一个总指数；3.05、3.23 与 Chapter 7 才能授予结构冲击身份。本节冻结这些相邻机制，分别报告贷款对、借款人外部融资总额和实体结果三个估计量，从而避免把会计链、条件模拟或相关性改名为因果结论。<Cites ns={[7, 10, 35, 38, 43, 46, 50]} /></p>
        <BankLendingTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、先修与学习路线</p>
        <h2>先把“供给”定义严格，再拆资金、报价、数量与匹配，最后才进入总融资和实体识别。</h2>
        <div className="learning-objectives"><span>核心首读约 135–180 分钟</span><ol>
          <li><b>边界与对象（02–16）：</b>冻结上游状态，区分贷款供给、存量、广义利率渠道、借款人渠道与风险承担渠道，并建立合同/事件护照。</li>
          <li><b>边际报价（17–31）：</b>从匹配基准、资金组合、预期损失、运营与约束影子成本走到全口径贷款要约和重定价时钟。</li>
          <li><b>数量与资产负债表反应（32–48）：</b>依次观察审批、额度、配给、存款迁移、资本与流动性容量、集团资金、期限工具和银行内资产配置。</li>
          <li><b>匹配、替代与识别（49–59）：</b>解释关系信息、进入退出、客户排序、其他融资替代、三个估计量以及可证伪的因果设计。</li>
        </ol></div>
        <p>零背景首读可按 00 → 03 → 04 → 05 → 07 → 10 → 11 → 12 → 14 → 17 → 18 → 19 → 23 → 24 → 27 → 28 → 29 → 32 → 33 → 35 → 37 → 39 → 42 → 48 → 50 → 53 → 54 → 55 → 56 → 57 → 58 → 59 前进；遇到术语时先查看<a href="#checks-glossary">§62</a>，再回到完整正文。七个 C 实验承担单一机制复算，M1–M10 检验跨机制判断，K1–K10 则在无脚本或打印环境更换数字与对象，防止只记住原题答案。</p>
        <div className="precision-note"><span>渠道成立的四道必要门</span><ol><li>政策实施确实改变银行边际融资、约束或机会成本，而不仅是所有主体共同面对的无风险贴现率。</li><li>借款人风险与需求可比时，银行确实改变价格、审批、额度或非价格条款。</li><li>受影响借款人不能无摩擦、即时并足额地替换原银行贷款。</li><li>未替代融资缺口确实进入预先指定的投资、就业或产出结果与时滞。</li></ol></div>
        <div className="precision-note"><span>章节所有权</span><p>3.09 交付信用创造后的法人、融资与约束状态；3.10 只拥有资产端贷款要约、数量边际、配置、替代和分层估计量。3.11、3.12 分别接管借款人净值/抵押品与银行风险容忍度；3.13 接收完整分布；3.05、3.23 与 Chapter 7 拥有政策冲击识别。任何接口一旦跨界，必须保留上游 stateId、时钟和 identificationStatus。</p></div>
      </section>

      {conceptSections.map((section) => <BankLendingConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Lab</p>
        <h2>十道合成题从报价与重定价走到银行配置、融资替代和三个估计量；每题都要求先声明边界再计算。</h2>
        <p>所有数值与机构均标记 SYNTHETIC，只验证单位、方向和机制接口，不代表任何真实银行、监管要求、政策效果或投资信号。正常作答界面在提交“答案 + 置信度”之前不展示复算；答错只提供针对当前误区的补课入口，答对才解锁完整推导。静态客户端无法阻止主动查看源文件，所以这里的门控是学习节奏设计，不声称服务器级答案保密。</p>
        <BankLendingLab />
        <BankLendingFixtureAudit />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道静态孪生更换数值、合同或聚合层，让打印、无脚本与复盘环境仍能逐步验证迁移能力。</h2>
        <div className="case-grid" id="bank-lending-static-twins">
          {bankLendingScenarios.map((scenario, index) => (
            <article className="case-card" key={scenario.staticTwin.id}>
              <span>STATIC {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.id} · SYNTHETIC</span>
              <h3>{scenario.staticTwin.title}</h3>
              <p><b>题干：</b>{scenario.staticTwin.prompt}</p>
              <ol className="static-choice-list">{scenario.staticTwin.choices.map((choice) => <li key={choice.id}><b>{choice.id.toUpperCase()}.</b> {choice.label}</li>)}</ol>
              <p><b>逐步复算：</b></p><ol>{scenario.staticTwin.calculations.map((step) => <li key={step}>{step}</li>)}</ol>
              <p><b>标准答案：</b>{scenario.staticTwin.answer}</p>
              <p><b>口径护栏：</b>{scenario.staticTwin.formulaUnits ?? scenario.formulaUnits}</p>
              <p><b>机制来源：</b> <Cites ns={scenario.staticTwin.sourceIds} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks / Glossary</p>
        <h2>掌握标准是能说明变化位于资金、报价、审批、额度、匹配还是替代，并知道何时还不能作因果判断。</h2>
        <div className="check-list">{checks.map((check, index) => <div className="check-entry" key={check.question}><details><summary>{index + 1}. {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={check.sourceIds} /></p></details><p className="print-only check-print-answer"><b>{index + 1}. 标准答案：</b>{check.answer} <Cites ns={check.sourceIds} /></p></div>)}</div>
        <div className="term-grid" aria-label="3.10术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces / Reading / Evidence Map</p>
        <h2>本节交付的是带法人、合同、资金、容量、匹配、替代和识别等级的贷款渠道状态，不是一条“政策率决定贷款”的总量线。</h2>
        <div className="interface-grid">{interfaces.map(({ name, payload, guardrail }) => <article key={name}><span>{name}</span><h3>交付字段</h3><p><code>{payload}</code></p><em>{guardrail}</em></article>)}</div>

        <div className="precision-note" data-key-coverage={canonicalBankLendingStateFieldCoverage && canonicalBankLendingStateRuntimeCoverage ? 'complete' : 'incomplete'}><span>3.10 canonical state contract · {canonicalBankLendingStateFields.length} 个顶层键 · compile/runtime 双重闭合</span><p><code>{canonicalBankLendingStateFields.join(', ')}</code>。顶层键先接受 TypeScript 的完整覆盖约束，再由一个非空 SYNTHETIC 状态验证政策实施、名义/实际曲线、3.09信用输入、冻结风险、资金来源、五项约束容量、合同、要约、审批、关系、配置、替代和动态数据护照均可落地。3.09 的合格需求保持金额余量；预期净收益则使用独立利率/回报类型，保存 <code>rateConcept</code>、<code>annualisation</code>、币种与 horizon，不再伪装成带金额币种的容量。五项约束的 current ratio、有符号 buffer 与原生 headroom 均由分子、分母、阈值及 minimum/maximum 方向重新计算，越界反例必须得到负值；再用各自边际占用换算到同一目标贷款本金单位、法人、币种、决策时点与 mapping basis，同时保留原生 horizon。canonical 例中流动性是唯一最小值，独立门禁还验证并列最小时会返回全部绑定约束。贷款对、借款人外部融资总额与实体结果各有独立 estimand 记录，并全部保持 <code>status=descriptive</code>；计算器或字段完整不会自动升级因果等级。所有金额、利率、期限、法人和时点都以嵌套护照绑定，缺失值保留 <code>null</code>，而不是由字段名猜测。</p></div>
        <div className="precision-note"><span>必须保持的八条合同不变量</span><ol>{contractInvariants.map((invariant) => <li key={invariant}>{invariant}</li>)}</ol></div>
        <div className="precision-note" data-dynamic-passports={lesson310SourceIdentityPassports.length} data-missing-identity-check-date={lesson310SourceIdentityPassports.filter((passport) => passport.identityCheckedOnDate === null).length}><span>八个动态官方来源的身份护照 + 通用/专属 refresh checklist</span><p>本参考记录为 {lesson310SourceIdentityPassports.length} 个动态来源保存作者/机构、标题、发布载体、版本或日期、URL 与 <code>identityCheckedOnDate</code>；缺失身份核验日 {lesson310SourceIdentityPassports.filter((passport) => passport.identityCheckedOnDate === null).length} 个。这里只知道核验日期，不把它伪装成精确 UTC 时间。身份记录也不是数据快照：真正刷新数据时仍须另填 <code>retrievedAtUTC</code>。每个来源先填通用字段，再填专属字段；缺失值必须区分 unknown、not-collected、not-applicable 与 confidential。SLOOS/BLS 保存原题与净比例规则，H.8 保存估计与调整口径，Call Reports 保存表种、schedule/item/MDRM 与申报版本，MIR 保存新业务/存量和利率概念，AnaCredit 保存门槛、可得性与保密级别，LPR 保存形成规则，社融优先读取当前中文官方发布并把旧英文页标为历史档案。FFIEC 若阻止自动访问，护照写明 blocked-automated-access，并使用其正式 bulk-data/instructions 入口人工复核。</p><p><b>每个来源共同必填：</b> <code>{lesson310DynamicCommonRequirements.join(', ')}</code></p><ul>{lesson310DynamicSourceRequirements.map((requirement) => <li key={requirement.sourceIds.join('-')}><b>S{requirement.sourceIds.map((id) => String(id).padStart(2, '0')).join(' / S')}：</b><code>{requirement.fields.join(', ')}</code></li>)}</ul></div>

        <h3>Evidence Map · 每组证据既说明能支持什么，也限制不能推出什么</h3>
        <div className="evidence-map" aria-label={`3.10连续覆盖${lesson310References.length}条来源的证据地图`} role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} {group.ids.length ? <Cites ns={group.ids} /> : null}</p></div>)}</div>

        <div className="learning-objectives"><span>延伸阅读顺序</span><ol>
          <li><b>第一遍：</b>Bernanke–Blinder、Kashyap–Stein 与 Disyatat；写出渠道成立的四道必要门，并把传统准备金数量叙事改写为边际融资和银行实力。</li>
          <li><b>第二遍：</b>Jaffee–Russell、Stiglitz–Weiss、Diamond、Rajan 与关系贷款文献；分开配给、监督、私有信息、跨期合同和转换成本。</li>
          <li><b>第三遍：</b>银行资本、存款渠道、流动性承诺、贷款率传导及低/负利率文献；为每篇记录状态依赖、法域和不允许外推的边界。</li>
          <li><b>第四遍：</b>LTRO/TLTRO、QE、同借款人/申请设计、银行—企业网络与融资替代；逐篇写清 treatment、estimand、support 和 exclusion restriction。</li>
          <li><b>第五遍：</b>SLOOS、H.8、Call Reports、ECB BLS/MIR/AnaCredit、PBOC LPR/社融方法页；先建立动态护照，再决定能否回答申请、报价、余额或总融资问题。</li>
        </ol></div>
        <p>最小复述是：<b>政策实施先改变银行面对的资金价格、期限和容量；银行再把匹配基准、边际融资、冻结预期损失、运营、资本与流动性影子成本和目标剩余回报转换成全口径要约，并沿审批、额度与非价格条款调整。贷款存量不是供给函数，平均利率不是边际报价，低存款 beta 也不是必然宽松。原贷款对收缩只有在外部替代不完全时才成为借款人外部融资缺口；内部现金随后缓冲资源缺口，再经生产决策形成具有时滞和外溢的实体结果。贷款对、外部融资总额和实体结果是三个各自需要反事实的估计量；没有冲击护照、需求控制、支持集和反证审计时，系统状态只能保持 descriptive。</b></p>
      </section>
    </>
  );
}

export const lesson310: LessonRecord = {
  slug: '3-10',
  id: '3.10',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Bank Lending Channel：银行资金、贷款要约与实体传导',
  subtitle: '政策实施怎样改变银行边际融资和约束成本，银行如何在价格、审批、额度与条款上调整供给，借款人替代为何决定贷款冲击能否进入总融资与实体经济',
  readingTime: '核心首读约 135–180 分钟；完整正文与机制复算约 360–470 分钟；C1–C7 机制实验约 65–90 分钟，互动题首次完成约 40–55 分钟／含复盘约 60–80 分钟，静态变式、检查题与术语约 75–100 分钟；来源与延伸阅读不计',
  prerequisite: '2.06 Financial Institutions、3.05 Reaction Function、3.06 Policy Implementation、3.07 Yield Curve、3.08 Real Interest Rate、3.09 Bank Credit Creation；按需调用 T02 Compounding / Discounting、T03 Probability / Expectation、T05 Regression / Causality、T06 Balance Sheet、T07 Financial Instruments 与 T08 Time / Vintage',
  updatedAt: '2026-09-03',
  revision: '3.10-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-03',
      decision: 'approved',
      revision: '3.10-r3',
      summary:
        '独立终审 00–63、58 个机制节、C1–C7、M1–M10、K1–K10、22-key canonical contract、H1–H6、71 条连续来源与 22 项延伸阅读；复算有符号约束容量、持续关系支持集、贷款报价与跨章 rate contract，抽查 Basel 当前规则及贷款渠道原始研究，并回归 97/97、15/15、80/80、类型、规范、生产构建与双锚点 SSR，P0–P3 为 0，开审与结束哈希逐项一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-03',
      decision: 'approved',
      revision: '3.10-r3',
      summary:
        '独立终审教学递进、恢复状态机、C4/C7 边界、无脚本与打印降级、响应式和可访问性结构；先发现 #mechanism-c7 缺失并拒绝批准，修复后确认新旧锚点唯一相邻、864 个内部链接闭合、恢复三分支及全部数值断言通过。本轮无可连接浏览器，未把真实截图、Tab 轨迹、console 或物理滚动伪报为已测；其余 SSR、源码与可执行门闭合，P0–P3 为 0，起止哈希一致。',
    },
  ],
  previous: { slug: '3-09', label: '3.09 Bank Credit Creation' },
  next: { slug: '3-11', label: '3.11 Borrower Balance Sheet / Collateral Channel' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson310Content,
  references: lesson310References,
  readingList: lesson310ReadingList,
  readingListOrder: 'source',
};
