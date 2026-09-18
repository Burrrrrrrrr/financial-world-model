import {
  allInLoanOfferMetrics,
  bankBorrowerAllocationMetrics,
  creditMenuMetrics,
  fundingPassThroughMetrics,
  identificationSubstitutionMetrics,
  loanCapacityMetrics,
  repricingClockMetrics,
  type AllInLoanCostComponentIds,
  type AllInLoanOfferInput,
  type BankBorrowerAllocationInput,
  type CreditMenuInput,
  type FundingPassThroughInput,
  type IdentificationSubstitutionInput,
  type LoanCapacityInput,
  type RepricingBucketId,
  type RepricingClockInput,
} from './bankLendingFixtures';

export type BankLendingChoice = 'a' | 'b' | 'c';
export type BankLendingMode = 'pricing-clock' | 'allocation-identification';

export type BankLendingAssertion = {
  key: string;
  expected: number | string | boolean;
  unit: string;
  tolerance?: number;
};

export type BankLendingScenario = {
  id: `M${number}`;
  mode: BankLendingMode;
  label: string;
  title: string;
  brief: string;
  synthetic: true;
  facts: { label: string; value: string; note: string }[];
  formulas: string[];
  formulaUnits: string;
  options: { id: BankLendingChoice; label: string; diagnosis: string }[];
  correct: BankLendingChoice;
  calculation: string;
  reveal: string;
  primarySectionId: string;
  remediationSectionIds: string[];
  sourceIds: number[];
  numericAssertions: BankLendingAssertion[];
  staticTwin: {
    id: `K${number}`;
    title: string;
    prompt: string;
    choices: { id: BankLendingChoice; label: string }[];
    correct: BankLendingChoice;
    calculations: string[];
    answer: string;
    formulaUnits?: string;
    sourceIds: number[];
    numericAssertions: BankLendingAssertion[];
  };
};

export const bankLendingModes: { id: BankLendingMode; label: string; title: string; description: string }[] = [
  { id: 'pricing-clock', label: '定价时钟', title: '从政策实施到报价与容量', description: '把基准利率、资金成本、费用、重定价速度和五类约束分别计算。' },
  { id: 'allocation-identification', label: '配置识别', title: '从贷款菜单到总融资与实体结果', description: '冻结借款人风险与银行风险偏好，再区分pair、借款人总量和实体结果。' },
];

function scenarioOfferComponentIds(prefix: string): AllInLoanCostComponentIds {
  return {
    referenceRate: `${prefix}:reference-rate`,
    marginalFundingCost: `${prefix}:marginal-funding-cost`,
    fundingSpread: `${prefix}:funding-spread`,
    expectedLoss: `${prefix}:expected-loss`,
    operatingCost: `${prefix}:operating-cost`,
    capitalShadowCost: `${prefix}:capital-shadow-cost`,
    liquidityShadowCost: `${prefix}:liquidity-shadow-cost`,
    concentrationOpportunityCost: `${prefix}:concentration-opportunity-cost`,
    targetResidualReturn: `${prefix}:target-residual-return`,
    upfrontFee: `${prefix}:upfront-fee`,
  };
}

const m1Input: AllInLoanOfferInput = {
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', feeOutputUnit: 'basis-points',
  referenceRatePct: 4, fundingQuote: { kind: 'all-in-mcf', marginalFundingCostPct: 5 }, expectedLossPct: 0.8,
  operatingCostPct: 0.4, capitalShadowCostPct: 0.6, liquidityShadowCostPct: 0.2,
  concentrationOpportunityCostPct: 0.2, targetResidualReturnPct: 0.8,
  upfrontFeeAmount: 1, principalAmount: 100, termMonths: 12, componentIds: scenarioOfferComponentIds('M1'),
};
const k1Input: AllInLoanOfferInput = {
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', feeOutputUnit: 'basis-points',
  referenceRatePct: 3, fundingQuote: { kind: 'spread-over-reference', fundingSpreadPct: 0.8 }, expectedLossPct: 0.5,
  operatingCostPct: 0.3, capitalShadowCostPct: 0.4, liquidityShadowCostPct: 0.2,
  concentrationOpportunityCostPct: 0.1, targetResidualReturnPct: 0.7,
  upfrontFeeAmount: 0.5, principalAmount: 100, termMonths: 6, componentIds: scenarioOfferComponentIds('K1'),
};
const m2Input: AllInLoanOfferInput = {
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', feeOutputUnit: 'basis-points',
  referenceRatePct: 3.5, fundingQuote: { kind: 'all-in-mcf', marginalFundingCostPct: 4.4 }, expectedLossPct: 0.6,
  operatingCostPct: 0.3, capitalShadowCostPct: 0.5, liquidityShadowCostPct: 0.2,
  concentrationOpportunityCostPct: 0.1, targetResidualReturnPct: 0.6,
  upfrontFeeAmount: 0.25, principalAmount: 100, termMonths: 12, componentIds: scenarioOfferComponentIds('M2'),
};
const k2Input: AllInLoanOfferInput = {
  synthetic: true, currency: 'SYN', amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', feeOutputUnit: 'basis-points',
  referenceRatePct: 2.5, fundingQuote: { kind: 'spread-over-reference', fundingSpreadPct: 1.2 }, expectedLossPct: 0.4,
  operatingCostPct: 0.2, capitalShadowCostPct: 0.3, liquidityShadowCostPct: 0.1,
  concentrationOpportunityCostPct: 0.1, targetResidualReturnPct: 0.5,
  upfrontFeeAmount: 0.6, principalAmount: 120, termMonths: 24, componentIds: scenarioOfferComponentIds('K2'),
};
const m3Input: FundingPassThroughInput = {
  synthetic: true, rateUnit: 'percent-per-year', moveUnit: 'basis-points', weightUnit: 'decimal-ratio',
  policyMoveDirection: 'tightening', policyMoveBp: 100,
  sources: [
    { sourceId: 'deposits', kind: 'deposit', stockWeightRatio: 0.6, marginalFundingShareRatio: 0.6, openingCostPct: 2, depositBeta: 0.3 },
    { sourceId: 'wholesale', kind: 'wholesale', stockWeightRatio: 0.4, marginalFundingShareRatio: 0.4, openingCostPct: 4, passThroughCoefficient: 0.9 },
  ],
  depositSourceId: 'deposits', depositOutflowFraction: 0.25,
  replacementFunding: { openingCostPct: 4, passThroughCoefficient: 1, transitionPremiumBp: 20 },
};
const k3Input: FundingPassThroughInput = {
  synthetic: true, rateUnit: 'percent-per-year', moveUnit: 'basis-points', weightUnit: 'decimal-ratio',
  policyMoveDirection: 'easing', policyMoveBp: 50,
  sources: [
    { sourceId: 'deposits', kind: 'deposit', stockWeightRatio: 0.7, marginalFundingShareRatio: 0.7, openingCostPct: 2, depositBeta: 0.2 },
    { sourceId: 'wholesale', kind: 'wholesale', stockWeightRatio: 0.3, marginalFundingShareRatio: 0.3, openingCostPct: 4, passThroughCoefficient: 1 },
  ],
  depositSourceId: 'deposits', depositOutflowFraction: 0,
  replacementFunding: { openingCostPct: 4, passThroughCoefficient: 1, transitionPremiumBp: 0 },
};
const m4Input: RepricingClockInput = {
  synthetic: true, amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', newBusinessRatePct: 7,
  buckets: (['floating', 'reset-3m', 'reset-6m', 'reset-12m', 'fixed'] as RepricingBucketId[])
    .map((bucket) => ({ bucket, balance: 20, currentRatePct: 5, repricedRatePct: 7 })),
};
const k4Input: RepricingClockInput = {
  synthetic: true, amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', newBusinessRatePct: 5.5,
  buckets: [
    { bucket: 'floating', balance: 40, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'reset-3m', balance: 20, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'reset-6m', balance: 15, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'reset-12m', balance: 15, currentRatePct: 4, repricedRatePct: 5.5 },
    { bucket: 'fixed', balance: 10, currentRatePct: 4, repricedRatePct: 5.5 },
  ],
};
const capacityAssumptions: LoanCapacityInput['assumptions'] = {
  otherAssetsFixed: true, capitalAndEarningsFixed: true, riskWeightsFixed: true,
  lcrNetOutflowAlreadyCapped: true, marginalLoanFactorsFixed: true, regulatoryBuffersIncludedInMinimums: true,
};
const m5Input: LoanCapacityInput = {
  synthetic: true, amountUnit: 'SYN-currency', capacityUnit: 'SYN-currency', ratioUnit: 'decimal-ratio', mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1',
  mappingTarget: { loanInstrumentId: 'SYN-M5-TERM-LOAN', lenderLegalEntityId: 'SYN-BANK-A', currency: 'SYN', decisionTime: '2026-09-03T00:00:00Z', mappingBasis: 'incremental-drawn-term-loan-principal' },
  capital: { nativeHorizon: 'point-in-time', cet1: 15, minimumCET1Ratio: 0.1, rwaBefore: 100, loanRiskWeight: 0.5 },
  leverage: { nativeHorizon: 'point-in-time', tier1Capital: 12, minimumLeverageRatio: 0.03, leverageExposureBefore: 300, loanExposureFactor: 1 },
  lcr: { nativeHorizon: '30-calendar-days', hqla: 30, minimumLCR: 1, cappedNetCashOutflowBefore: 20, loanNetOutflowFactor: 0.2 },
  nsfr: { nativeHorizon: 'one-year', availableStableFunding: 120, minimumNSFR: 1, requiredStableFundingBefore: 100, loanRSFFactor: 0.5 },
  concentration: { nativeHorizon: 'point-in-time', tier1Capital: 12, maximumExposureRatio: 0.25, connectedExposureBefore: 0.5, loanExposureFactor: 0.05 },
  assumptions: capacityAssumptions,
};
const k5Input: LoanCapacityInput = {
  synthetic: true, amountUnit: 'SYN-currency', capacityUnit: 'SYN-currency', ratioUnit: 'decimal-ratio', mappingVersion: 'SYNTHETIC_LOCAL_LINEAR_V1',
  mappingTarget: { loanInstrumentId: 'SYN-K5-TERM-LOAN', lenderLegalEntityId: 'SYN-BANK-A', currency: 'SYN', decisionTime: '2026-09-03T00:00:00Z', mappingBasis: 'incremental-drawn-term-loan-principal' },
  capital: { nativeHorizon: 'point-in-time', cet1: 20, minimumCET1Ratio: 0.1, rwaBefore: 120, loanRiskWeight: 0.8 },
  leverage: { nativeHorizon: 'point-in-time', tier1Capital: 15, minimumLeverageRatio: 0.05, leverageExposureBefore: 200, loanExposureFactor: 1 },
  lcr: { nativeHorizon: '30-calendar-days', hqla: 50, minimumLCR: 1, cappedNetCashOutflowBefore: 30, loanNetOutflowFactor: 0.25 },
  nsfr: { nativeHorizon: 'one-year', availableStableFunding: 150, minimumNSFR: 1, requiredStableFundingBefore: 120, loanRSFFactor: 0.5 },
  concentration: { nativeHorizon: 'point-in-time', tier1Capital: 15, maximumExposureRatio: 0.25, connectedExposureBefore: 1.75, loanExposureFactor: 0.05 },
  assumptions: capacityAssumptions,
};
const m6Input: CreditMenuInput = {
  synthetic: true, amountUnit: 'SYN-currency', rateUnit: 'percent-per-year', probabilityUnit: 'percent-probability',
  baseline: { offerRatePct: 6, approvedLimit: 100, termMonths: 36, collateralRequirementPct: 50, covenantCount: 1, rejectionProbabilityPct: 10 },
  proposed: { offerRatePct: 7, approvedLimit: 80, termMonths: 24, collateralRequirementPct: 70, covenantCount: 3, rejectionProbabilityPct: 25 },
  frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
  rationingModel: { framework: 'stiglitz-weiss', higherRateReducesExpectedReturnUnderModel: true },
};
const k6Input: CreditMenuInput = {
  ...m6Input,
  baseline: { offerRatePct: 5, approvedLimit: 100, termMonths: 36, collateralRequirementPct: 50, covenantCount: 1, rejectionProbabilityPct: 10 },
  proposed: { offerRatePct: 6, approvedLimit: 100, termMonths: 36, collateralRequirementPct: 50, covenantCount: 1, rejectionProbabilityPct: 10 },
  rationingModel: { framework: 'none', higherRateReducesExpectedReturnUnderModel: false },
};
const m7Input: BankBorrowerAllocationInput = {
  synthetic: true, amountUnit: 'SYN-currency', probabilityUnit: 'percent-probability',
  banks: [{ bankId: 'A', fixedRiskToleranceScore: 60 }, { bankId: 'B', fixedRiskToleranceScore: 60 }],
  borrowers: [
    { borrowerId: 'X', fixedPDPct: 2, fixedLGDPct: 40, fixedCollateralValue: 100, totalFinancingDemand: 150, relationshipBankId: 'A' },
    { borrowerId: 'Y', fixedPDPct: 4, fixedLGDPct: 50, fixedCollateralValue: 80, totalFinancingDemand: 130, relationshipBankId: 'A' },
  ],
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 20, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 30 },
  ],
  externalFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 5 }, { borrowerId: 'Y', preAmount: 0, postAmount: 5 }],
  frozen: { borrowerPD: true, borrowerLGD: true, collateralValue: true, bankRiskTolerance: true },
};
const k7Input: BankBorrowerAllocationInput = {
  ...m7Input,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 80 },
    { bankId: 'B', borrowerId: 'X', preAmount: 20, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 70 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 30 },
  ],
  externalFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 0 }, { borrowerId: 'Y', preAmount: 0, postAmount: 0 }],
};
const identificationBase = {
  synthetic: true as const,
  amountUnit: 'SYN-currency' as const,
  realOutcomeUnit: 'SYN-real-index' as const,
  banks: [{ bankId: 'A', exposed: true }, { bankId: 'B', exposed: false }],
  borrowers: [{ borrowerId: 'X' }, { borrowerId: 'Y' }],
  frozen: { borrowerPD: true as const, borrowerLGD: true as const, collateralValue: true as const, bankRiskTolerance: true as const },
};
const passingDesign: IdentificationSubstitutionInput['design'] = {
  shockExogeneitySupported: true, preTrendsPassed: true, demandVariationControlled: true, matchingFormationExitSelectionAddressed: true, spilloversAddressed: true,
};
const m8Input: IdentificationSubstitutionInput = {
  ...identificationBase,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 55 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 30 },
  ],
  otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 10 }, { borrowerId: 'Y', preAmount: 0, postAmount: 5 }],
  realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 48 }, { borrowerId: 'Y', preIndex: 30, postIndex: 29 }],
  design: passingDesign,
};
const k8Input: IdentificationSubstitutionInput = {
  ...m8Input,
  design: { ...passingDesign, shockExogeneitySupported: false },
};
const m9Input: IdentificationSubstitutionInput = {
  ...identificationBase,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 60 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 60 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 40 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 40 },
  ],
  otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 20 }, { borrowerId: 'Y', preAmount: 0, postAmount: 20 }],
  realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 50 }, { borrowerId: 'Y', preIndex: 30, postIndex: 30 }],
  design: { ...passingDesign, spilloversAddressed: false },
};
const k9Input: IdentificationSubstitutionInput = {
  ...identificationBase,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 90 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 70 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 20 },
  ],
  otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 0 }, { borrowerId: 'Y', preAmount: 0, postAmount: 0 }],
  realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 48 }, { borrowerId: 'Y', preIndex: 30, postIndex: 28 }],
  design: passingDesign,
};
const m10Input: IdentificationSubstitutionInput = {
  ...identificationBase,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 90 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 30 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 70 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 10 },
  ],
  otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 0 }, { borrowerId: 'Y', preAmount: 0, postAmount: 0 }],
  realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 49 }, { borrowerId: 'Y', preIndex: 30, postIndex: 29 }],
  design: { ...passingDesign, shockExogeneitySupported: false, preTrendsPassed: false, demandVariationControlled: false },
};
const k10Input: IdentificationSubstitutionInput = {
  ...identificationBase,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 80 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 50 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 30 },
  ],
  otherFinancing: [{ borrowerId: 'X', preAmount: 0, postAmount: 10 }, { borrowerId: 'Y', preAmount: 0, postAmount: 10 }],
  realOutcomes: [{ borrowerId: 'X', preIndex: 50, postIndex: 50 }, { borrowerId: 'Y', preIndex: 30, postIndex: 30 }],
  design: passingDesign,
};

export const bankLendingScenarios: BankLendingScenario[] = [
  {
    id: 'M1', mode: 'pricing-clock', label: '定价 01 · All-in MCF', title: 'MCF已经含基准利率时，报价怎样避免重复计数？', synthetic: true,
    brief: 'SYNTHETIC：reference=4%，银行给出的MCF=5%是全含资金成本；本金100、期限12个月、前端费用1。借款人PD/LGD、抵押价值与银行风险偏好均冻结。',
    facts: [{ label: 'reference / MCF', value: '4% / 5%', note: 'MCF已含reference' }, { label: 'EL / ops', value: '0.8% / 0.4%', note: '风险与运营成本' }, { label: 'capital / liquidity', value: '0.6% / 0.2%', note: '影子成本' }, { label: 'concentration / target / fee', value: '0.2% / 0.8% / 1', note: '目标剩余回报不是第二个hurdle或隐藏markup' }],
    formulas: ['r_offer=MCF+EL+c_ops+φK+φL+c_conc+r_target', 'fee_bp=(fee/principal)×(12/term)×10,000'], formulaUnits: 'reference、MCF与funding spread是有限有符号年利率；EL、运营、资本、流动性、集中度、目标剩余回报与费用非负。费用以SYN金额输入并单列年化bp。',
    options: [{ id: 'a', label: '利息报价12%，因为4% reference还要再加到5% MCF上', diagnosis: 'MCF已是全含资金成本，再加reference会重复计数。' }, { id: 'b', label: '利息报价8%，费用100bp另列；简单全含等价9%', diagnosis: '正确：reference只通过MCF进入一次。' }, { id: 'c', label: '利息报价9%，并把费用视为资金成本的一部分', diagnosis: '总等价数碰巧相同，但你丢失了利息与费用的可审计分列。' }], correct: 'b',
    calculation: '5+0.8+0.4+0.6+0.2+0.2+0.8=8%；费用=(1/100)×(12/12)×10,000=100bp；简单全含等价=8%+1%=9%。',
    reveal: '定价桥先确认MCF口径并检查组件ID唯一。集中度机会成本与目标剩余回报各自单列；目标剩余回报是达到预设收益目标的剩余项，不是在hurdle之上的第二次markup。', primarySectionId: 'all-in-loan-offer', remediationSectionIds: ['marginal-funding-cost', 'spread-fee-floor-collateral-covenant'], sourceIds: [10, 33, 34],
    numericAssertions: [{ key: 'annualInterestRatePct', expected: 8, unit: 'percent-per-year' }, { key: 'annualizedFeeBp', expected: 100, unit: 'basis-points' }, { key: 'allInEquivalentPct', expected: 9, unit: 'percent-per-year' }, { key: 'componentIdCount', expected: 8, unit: 'count' }],
    staticTwin: { id: 'K1', title: '变式 01 · Funding spread口径', prompt: 'SYNTHETIC：reference=3%，funding spread=0.8%；EL、运营、资本、流动性、集中度、目标剩余回报依次0.5%、0.3%、0.4%、0.2%、0.1%、0.7%；本金100、6个月费用0.5。', choices: [{ id: 'a', label: 'MCF=3.8%，利息=6%，费用100bp，全含等价7%' }, { id: 'b', label: 'MCF=0.8%，利息=3%，费用50bp' }, { id: 'c', label: 'MCF=6.8%，因为reference需计两次' }], correct: 'a', calculations: ['MCF=3+0.8=3.8%。', '利息=3.8+0.5+0.3+0.4+0.2+0.1+0.7=6%。', '6个月费用简单年化=(0.5/100)×2×10,000=100bp。'], answer: 'A。spread口径先与reference合成MCF；费用保持分列，全部成本组件ID必须互异。', formulaUnits: 'reference、spread与MCF允许有限有符号值；其他成本非负，单位为年百分比、bp与SYN金额。', sourceIds: [10, 33, 34], numericAssertions: [{ key: 'marginalFundingCostPct', expected: 3.8, unit: 'percent-per-year' }, { key: 'annualInterestRatePct', expected: 6, unit: 'percent-per-year' }, { key: 'allInEquivalentPct', expected: 7, unit: 'percent-per-year' }, { key: 'componentIdCount', expected: 9, unit: 'count' }] },
  },
  {
    id: 'M2', mode: 'pricing-clock', label: '定价 02 · Fee Bridge', title: '同一个报价为何必须把利息与费用分开？', synthetic: true,
    brief: 'SYNTHETIC：reference=3.5%，全含MCF=4.4%，其他年化成本合计2.3%；本金100、12个月前端费用0.25。',
    facts: [{ label: 'MCF', value: '4.4%', note: '含reference 3.5%' }, { label: 'non-funding costs', value: '2.3%', note: 'EL、ops、K、L、concentration、target residual' }, { label: 'upfront fee', value: '0.25 / 100', note: '12个月' }],
    formulas: ['interest=MCF+non-funding costs', 'all-in equivalent=interest+annualised fee'], formulaUnits: '费用使用简单线性年化，仅为本章可比教学口径。',
    options: [{ id: 'a', label: '利息6.95%，费用为0', diagnosis: '把前端费用吞入利息会破坏产品条款的可审计性。' }, { id: 'b', label: '利息10.2%，因为还要加reference', diagnosis: '重复计入了已包含在MCF中的reference。' }, { id: 'c', label: '利息6.7%，费用25bp另列；简单全含等价6.95%', diagnosis: '正确：报价分解与全含比较同时保留。' }], correct: 'c',
    calculation: '利息=4.4+0.6+0.3+0.5+0.2+0.1+0.6=6.7%；费用=(0.25/100)×10,000=25bp；等价=6.95%。',
    reveal: '利息跟随市场利率与产品费用变化可能来自不同机制；合成总价之前保留两条审计链，并用独立组件ID阻止集中度、资本或目标剩余回报重复入账。', primarySectionId: 'spread-fee-floor-collateral-covenant', remediationSectionIds: ['all-in-loan-offer', 'marginal-funding-cost'], sourceIds: [10, 33, 34],
    numericAssertions: [{ key: 'concentrationOpportunityCostPct', expected: 0.1, unit: 'percent-per-year' }, { key: 'targetResidualReturnPct', expected: 0.6, unit: 'percent-per-year' }, { key: 'annualInterestRatePct', expected: 6.7, unit: 'percent-per-year' }, { key: 'allInEquivalentPct', expected: 6.95, unit: 'percent-per-year' }],
    staticTwin: { id: 'K2', title: '变式 02 · 两年期费用年化', prompt: 'SYNTHETIC：reference=2.5%、funding spread=1.2%，EL、运营、资本、流动性、集中度、目标剩余回报为0.4%、0.2%、0.3%、0.1%、0.1%、0.5%；本金120、24个月费用0.6。', choices: [{ id: 'a', label: '利息4.1%，费用50bp，全含4.6%' }, { id: 'b', label: 'MCF3.7%，利息5.3%，费用25bp，全含5.55%' }, { id: 'c', label: 'MCF6.2%，利息7.8%，费用25bp' }], correct: 'b', calculations: ['MCF=2.5+1.2=3.7%。', '利息=3.7+0.4+0.2+0.3+0.1+0.1+0.5=5.3%。', '费用=(0.6/120)×(12/24)×10,000=25bp。'], answer: 'B。期限翻倍时，同额前端费用的简单年化贡献减半；集中度成本与目标剩余回报独立列示。', formulaUnits: 'reference、spread与MCF允许有限有符号值；其他成本非负，单位为年百分比、bp与SYN金额。', sourceIds: [10, 33, 34], numericAssertions: [{ key: 'concentrationOpportunityCostPct', expected: 0.1, unit: 'percent-per-year' }, { key: 'targetResidualReturnPct', expected: 0.5, unit: 'percent-per-year' }, { key: 'annualInterestRatePct', expected: 5.3, unit: 'percent-per-year' }, { key: 'allInEquivalentPct', expected: 5.55, unit: 'percent-per-year' }] },
  },
  {
    id: 'M3', mode: 'pricing-clock', label: '资金 03 · Beta + Outflow', title: '存款beta较低时，为什么资金成本仍可能跳升？', synthetic: true,
    brief: 'SYNTHETIC：政策收紧100bp；存款在存量ACF篮子与下一单位MCF篮子中都占60%，deposit beta 0.3、初始成本2%；批发融资在两篮子都占40%，pass-through coefficient 0.9、初始成本4%。存款流出25%，用初始4%、系数1并带20bp转换溢价的资金替代。',
    facts: [{ label: 'ACF stock basket', value: '60% deposit / 40% wholesale', note: 'stockWeightRatio' }, { label: 'MCF marginal basket', value: '60% deposit / 40% wholesale', note: 'marginalFundingShareRatio' }, { label: 'deposit / wholesale response', value: 'beta 0.3 / coefficient 0.9', note: '非存款来源不借用deposit beta名称' }, { label: 'deposit outflow', value: '25% of each deposit share', note: '第二阶段替代' }],
    formulas: ['ACF basket=Σ stockWeight_j×cost_j', 'MCF basket=Σ marginalFundingShare_j×cost_j', 'replacement effect=displaced deposit share×(replacement post cost−deposit post cost)'], formulaUnits: '两组权重与响应系数无量纲；政策与输出变化用bp；成本水平用年百分比。',
    options: [{ id: 'a', label: '两篮子第一阶段均+54bp，替代均+43.5bp，总变化均+97.5bp', diagnosis: '正确；两组结果相同只因本题刻意令存量权重与边际份额相同。' }, { id: 'b', label: '只有+30bp，因为存款是最大存量资金来源', diagnosis: '遗漏了批发融资、边际篮子与替代融资。' }, { id: 'c', label: '只有+54bp，存量与边际权重必须永远相同', diagnosis: '两个篮子是不同对象；流出替代还是独立的第二阶段。' }], correct: 'a',
    calculation: 'ACF与MCF的系数都=0.6×0.3+0.4×0.9=0.54，所以第一阶段均+54bp。两篮子被替代的存款份额都=0.6×0.25=0.15；替代post成本5.2%，存款post成本2.3%，额外均=0.15×2.9%×100=43.5bp；总变化均97.5bp。',
    reveal: '存量权重解释代表性平均融资成本ACF，边际融资份额才解释下一单位资金包MCF；本题数值相同只是特设权重相同。存款价格beta、数量流失与替代融资仍必须分步。', primarySectionId: 'average-versus-marginal-funding-mix', remediationSectionIds: ['deposit-beta', 'deposit-migration-replacement-funding'], sourceIds: [25, 33, 34],
    numericAssertions: [{ key: 'stockWeightedPassThroughCoefficient', expected: 0.54, unit: 'decimal-ratio' }, { key: 'marginalFundingPassThroughCoefficient', expected: 0.54, unit: 'decimal-ratio' }, { key: 'totalAverageFundingCostChangeBp', expected: 97.5, unit: 'basis-points' }, { key: 'totalMarginalFundingCostChangeBp', expected: 97.5, unit: 'basis-points' }],
    staticTwin: { id: 'K3', title: '变式 03 · 无流出的宽松', prompt: 'SYNTHETIC：政策宽松50bp；ACF存量篮子与MCF边际篮子均为存款70%、批发30%；deposit beta 0.2、批发pass-through coefficient 1；存款不流出。', choices: [{ id: 'a', label: '两篮子系数0.2、总变化均−10bp' }, { id: 'b', label: '两篮子系数1、总变化均−50bp' }, { id: 'c', label: '两篮子系数0.44、总变化均−22bp；替代效应0' }], correct: 'c', calculations: ['两篮子系数都=0.7×0.2+0.3×1=0.44。', '有符号政策移动为−50bp。', '两篮子固定份额变化=0.44×(−50)=−22bp；流出为0。'], answer: 'C。方向单独编码，输入幅度仍非负；两篮子数值相同不代表概念相同。', formulaUnits: '无量纲权重/系数与bp。', sourceIds: [25, 33, 34], numericAssertions: [{ key: 'signedPolicyMoveBp', expected: -50, unit: 'basis-points' }, { key: 'stockWeightedPassThroughCoefficient', expected: 0.44, unit: 'decimal-ratio' }, { key: 'totalAverageFundingCostChangeBp', expected: -22, unit: 'basis-points' }, { key: 'totalMarginalFundingCostChangeBp', expected: -22, unit: 'basis-points' }] },
  },
  {
    id: 'M4', mode: 'pricing-clock', label: '时钟 04 · Stock Repricing', title: '新贷已到7%时，存量为何不会立即全部到7%？', synthetic: true,
    brief: 'SYNTHETIC：浮息、3月重置、6月重置、12月重置、固定五桶各20；当前均为5%，可重定价桶目标7%，固定桶不重定价。',
    facts: [{ label: 'new business', value: '7%', note: '单列，不混入stock' }, { label: 'five buckets', value: '各20', note: '总存量100' }, { label: 'horizons', value: '0 / 3 / 12 / 24月', note: '冻结余额' }],
    formulas: ['stock rate_h=Σ balance_j×applicable rate_j / total balance', 'repriced share_h=Σ repriced balance_j / total'], formulaUnits: '余额为SYN金额；利率为年百分比；未建模提前还款、违约与新增提款。',
    options: [{ id: 'a', label: '0月存量就等于7%，因为新贷报价已更新', diagnosis: '混淆了新发生业务与旧合同重定价。' }, { id: 'b', label: '存量在0/3/12/24月为5.4/5.8/6.6/6.6%', diagnosis: '正确：固定桶在观察窗内始终保持5%。' }, { id: 'c', label: '24月存量必然等于7%，所有固定贷款都会自动重置', diagnosis: '固定利率桶不能被无依据地改成浮息。' }], correct: 'b',
    calculation: '0月仅20浮息变7%，均值5.4%；3月再加20，均值5.8%；12月四个可重定价桶共80变7%，固定20仍5%，均值6.6%；24月不变。',
    reveal: '政策利率、当期新贷报价与存量平均收益率有不同的时钟；实证时不能把三者当成同一个时间序列。', primarySectionId: 'fixed-floating-repricing-clock', remediationSectionIds: ['new-business-versus-stock-rates', 'benchmark-maturity-repricing'], sourceIds: [33, 34, 57],
    numericAssertions: [{ key: 'stockRateMonth0Pct', expected: 5.4, unit: 'percent-per-year' }, { key: 'stockRateMonth3Pct', expected: 5.8, unit: 'percent-per-year' }, { key: 'stockRateMonth12Pct', expected: 6.6, unit: 'percent-per-year' }, { key: 'stockRateMonth24Pct', expected: 6.6, unit: 'percent-per-year' }],
    staticTwin: { id: 'K4', title: '变式 04 · 不等余额桶', prompt: 'SYNTHETIC：浮息/3月/6月/12月/固定余额为40/20/15/15/10；当前4%，可重定价目标5.5%。', choices: [{ id: 'a', label: '0/3/12/24月为4.6/4.9/5.35/5.35%' }, { id: 'b', label: '全部时点均为5.5%' }, { id: 'c', label: '0/3/12/24月为4/4.3/4.9/5.5%' }], correct: 'a', calculations: ['0月40%存量重定价：4+0.4×1.5=4.6%。', '3月累计60%：4.9%。', '12月累计90%：5.35%；固定10%令24月仍为5.35%。'], answer: 'A。权重来自余额，而不是简单数桶。', formulaUnits: 'SYN金额与年百分比。', sourceIds: [33, 34, 57], numericAssertions: [{ key: 'stockRateMonth0Pct', expected: 4.6, unit: 'percent-per-year' }, { key: 'stockRateMonth3Pct', expected: 4.9, unit: 'percent-per-year' }, { key: 'stockRateMonth12Pct', expected: 5.35, unit: 'percent-per-year' }, { key: 'stockRateMonth24Pct', expected: 5.35, unit: 'percent-per-year' }] },
  },
  {
    id: 'M5', mode: 'pricing-clock', label: '容量 05 · Unified Constraints', title: '五个监管比率为什么不能相加？', synthetic: true,
    brief: 'SYNTHETIC局部线性映射：其他资产、资本与利润、风险权重、LCR净流出口径和边际贷款因子均冻结；五项规则保留各自原生horizon，但共同映射到同一贷款工具、法人、币种、决策时点和新增提款本金basis。',
    facts: [{ label: 'capital / leverage', value: '100 / 100', note: 'SYN容量；point-in-time' }, { label: 'LCR / NSFR', value: '50 / 40', note: '30日 / 一年原生horizon' }, { label: 'concentration', value: '50', note: 'point-in-time' }, { label: 'mapping target', value: 'SYN-M5-TERM-LOAN', note: '同一法人、币种、决策时点与basis' }],
    formulas: ['signed capital capacity=(CET1−k_min×RWA_0)/(k_min×rw)', 'feasible capacity=max(0,min(signed capital, leverage, LCR, NSFR, concentration capacities))'], formulaUnits: '先保留每条规则的有符号原始余量，再换算成SYN-currency的有符号边际贷款容量；负值表示已经越界，最后的新增可行容量才在零处截断。该fixture不是完整监管报表。',
    options: [{ id: 'a', label: '容量300，因为五项容量应相加', diagnosis: '同时成立的上限不能相加。' }, { id: 'b', label: '容量100，因为资本与杠杆最重要', diagnosis: '忽略了更紧的稳定融资容量。' }, { id: 'c', label: '容量40，NSFR为绑定约束', diagnosis: '正确：统一单位后的最小容量定义当前可行域。' }], correct: 'c',
    calculation: '五项容量为100、100、50、40、50；min=40，唯一达到40的是NSFR。',
    reveal: '“资本充足”不等于“贷款容量无限”。资本、杠杆、流动性、稳定融资与集中度是原生期限不同的门；只有明确共同mapping target后才可比较教学换算容量，合成参数不构成监管合规判断。', primarySectionId: 'capital-headroom-deleveraging-choice', remediationSectionIds: ['liquid-asset-buffer', 'liquidity-stable-funding-shadow-price'], sourceIds: [21, 23, 24, 62, 67, 68, 69, 70, 71],
    numericAssertions: [{ key: 'feasibleLoanCapacity', expected: 40, unit: 'SYN-currency' }, { key: 'bindingConstraint', expected: 'nsfr', unit: 'string' }, { key: 'lcrCapacity', expected: 50, unit: 'SYN-currency' }, { key: 'mappingBasis', expected: 'incremental-drawn-term-loan-principal', unit: 'string' }],
    staticTwin: { id: 'K5', title: '变式 05 · 集中度绑定', prompt: 'SYNTHETIC：五项规则保留原生horizon，但都映射到同一SYN期限贷款、法人、币种、决策时点与新增提款本金basis；容量为资本100、杠杆100、LCR80、NSFR60、集中度40。这是局部教学映射，不是监管合规判断。', choices: [{ id: 'a', label: '容量480' }, { id: 'b', label: '容量40，集中度绑定' }, { id: 'c', label: '容量60，NSFR绑定' }], correct: 'b', calculations: ['共同mapping target先闭合；原生horizon仍分别保存。', 'min(100,100,80,60,40)=40。', '最小项是集中度。'], answer: 'B。若贷款工具、法人、币种、决策时点、basis或规则版本不同，应停止计算而不是强行比较；真实合规结论必须使用适用规则与完整报表。', formulaUnits: 'SYN-currency；原生horizon不被伪装成同一期限。', sourceIds: [21, 23, 24, 62, 67, 68, 69, 70, 71], numericAssertions: [{ key: 'feasibleLoanCapacity', expected: 40, unit: 'SYN-currency' }, { key: 'bindingConstraint', expected: 'concentration', unit: 'string' }, { key: 'nsfrCapacity', expected: 60, unit: 'SYN-currency' }, { key: 'concentrationCapacity', expected: 40, unit: 'SYN-currency' }] },
  },
  {
    id: 'M6', mode: 'allocation-identification', label: '菜单 06 · Non-price Terms', title: '贷款供给收紧为什么不能只看利率？', synthetic: true,
    brief: 'SYNTHETIC：同一借款人的PD/LGD、抵押品价值及银行risk tolerance冻结；报价从6%到7%，额度100到80，期限36到24月，抵押要求50%到70%，契约1到3，拒绝概率10%到25%。',
    facts: [{ label: 'price / limit', value: '6→7% / 100→80', note: '价格与数量' }, { label: 'term / collateral', value: '36→24 / 50→70%', note: '合同非价格条款' }, { label: 'covenant / reject', value: '1→3 / 10→25%', note: '治理与extensive margin' }],
    formulas: ['credit menu=(price, limit, term, collateral, covenant, rejection)', 'rationing result is conditional on the stated model'], formulaUnits: '利率为年百分比、额度为SYN、概率为百分比；风险状态保持不变。',
    options: [{ id: 'a', label: '六个维度都收紧；Stiglitz-Weiss结论只在给定模型条件下成立', diagnosis: '正确：既保留完整菜单，也不把模型结果普遍化。' }, { id: 'b', label: '只有利率上升，因此其余条款不属于贷款供给', diagnosis: '数量与非价格条款同样改变可获得信贷。' }, { id: 'c', label: '拒绝概率上升必然证明独立银行贷款渠道', diagnosis: '菜单变化本身尚未排除需求和共同冲击。' }], correct: 'a',
    calculation: '利率+100bp、额度−20、期限−12月、抵押要求+20个百分点、契约+2、拒绝概率+15个百分点，共六个收紧维度。',
    reveal: 'Stiglitz-Weiss型配给是模型内机制，不是“所有银行在所有时期都不愿提高利率”的经验定律。', primarySectionId: 'price-quantity-nonprice-margins', remediationSectionIds: ['nonprice-tightening-ranking', 'adverse-selection-credit-rationing'], sourceIds: [11, 12, 13],
    numericAssertions: [{ key: 'offerRateChangeBp', expected: 100, unit: 'basis-points' }, { key: 'approvedLimitChange', expected: -20, unit: 'SYN-currency' }, { key: 'tighteningDimensions', expected: 6, unit: 'count' }, { key: 'stiglitzWeissConditionalResult', expected: true, unit: 'boolean' }],
    staticTwin: { id: 'K6', title: '变式 06 · 只跟随基准利率', prompt: 'SYNTHETIC：同一借款人报价5%到6%，额度、期限、抵押、契约与拒绝概率均不变；没有外生银行侧冲击设计。', choices: [{ id: 'a', label: '六个维度都收紧，独立供给渠道已识别' }, { id: 'b', label: '价格未变，因为条款未变' }, { id: 'c', label: '只有价格维度收紧；相关跟随不等于独立银行贷款渠道' }], correct: 'c', calculations: ['利率变化=+100bp。', '其余五个维度变化均为0。', '报价菜单计算器不提供供给识别。'], answer: 'C。共同跟随无风险利率可以是普通利率渠道，而非银行资产负债表供给渠道。', formulaUnits: 'bp、SYN金额、月与概率百分点。', sourceIds: [1, 3, 10, 33], numericAssertions: [{ key: 'offerRateChangeBp', expected: 100, unit: 'basis-points' }, { key: 'approvedLimitChange', expected: 0, unit: 'SYN-currency' }, { key: 'tighteningDimensions', expected: 1, unit: 'count' }, { key: 'independentBankLendingChannelIdentified', expected: false, unit: 'boolean' }] },
  },
  {
    id: 'M7', mode: 'allocation-identification', label: '配置 07 · Two-bank Matrix', title: '一家银行收缩后，借款人实际少了多少融资？', synthetic: true,
    brief: 'SYNTHETIC：两家银行A/B、借款人X/Y。PD、LGD、抵押价值、risk tolerance与融资需求上限冻结。A分别减少30/20，B分别增加20/10，外部融资各增加5。',
    facts: [{ label: 'Bank A', value: '−30 / −20', note: 'X / Y pair' }, { label: 'Bank B', value: '+20 / +10', note: '其他银行跨行承接' }, { label: 'external', value: '+5 / +5', note: '银行外替代' }],
    formulas: ['borrower bank change=Σ_b ΔL_bi', 'borrower total change=bank change+external change'], formulaUnits: '所有融资金额均为SYN-currency；冻结PD/LGD与risk tolerance。',
    options: [{ id: 'a', label: '借款人总融资减少50，因为只看关系银行A', diagnosis: '遗漏了银行B重配和银行外替代。' }, { id: 'b', label: '银行体系贷款−20；重配30、外部替代10后，总融资−10', diagnosis: '正确：pair收缩、银行体系净额与借款人总融资是三层不同对象。' }, { id: 'c', label: '总融资增加40，因为把替代流量与原贷款相加', diagnosis: '替代只能抵销收缩，不能忽略对应的负变化。' }], correct: 'b',
    calculation: 'A合计−50，B合计+30，所以银行体系−20；跨银行重配吸收30，外部融资+10；X和Y总融资各−5，合计−10。',
    reveal: '银行贷款渠道的中间结果可以在pair层很强，却被其他银行跨行承接或债券/非银融资部分吸收。', primarySectionId: 'pair-bank-borrower-aggregate-levels', remediationSectionIds: ['information-capital-relationship-lending', 'other-bank-bond-nonbank-substitution'], sourceIds: [43, 44, 45, 46],
    numericAssertions: [{ key: 'systemBankLendingChange', expected: -20, unit: 'SYN-currency' }, { key: 'crossBankReallocationAbsorbed', expected: 30, unit: 'SYN-currency' }, { key: 'externalSubstitutionIncrease', expected: 10, unit: 'SYN-currency' }, { key: 'totalFinancingChange', expected: -10, unit: 'SYN-currency' }],
    staticTwin: { id: 'K7', title: '变式 07 · 跨银行完全承接', prompt: 'SYNTHETIC：A对X/Y分别−20/−10，B对X/Y分别+20/+10，外部融资不变；风险与需求冻结。', choices: [{ id: 'a', label: 'A−30、B+30；银行贷款与总融资净变化均0' }, { id: 'b', label: '总融资−30，因为A受冲击' }, { id: 'c', label: '总融资+30，因为B扩张' }], correct: 'a', calculations: ['A变化−30，B变化+30。', '跨银行承接吸收30。', '外部融资不变，所以每个借款人与合计总融资变化均0。'], answer: 'A。pair层冲击并不机械等于借款人总量冲击。', formulaUnits: 'SYN-currency。', sourceIds: [43, 44, 45, 46], numericAssertions: [{ key: 'systemBankLendingChange', expected: 0, unit: 'SYN-currency' }, { key: 'crossBankReallocationAbsorbed', expected: 30, unit: 'SYN-currency' }, { key: 'externalSubstitutionIncrease', expected: 0, unit: 'SYN-currency' }, { key: 'totalFinancingChange', expected: 0, unit: 'SYN-currency' }] },
  },
  {
    id: 'M8', mode: 'allocation-identification', label: '识别 08 · Three Estimands', title: 'pair结果如何传到借款人总融资与实体活动？', synthetic: true,
    brief: 'SYNTHETIC 2×2矩阵：暴露银行A对X/Y变化−30/−20，对照银行B为+15/+10；A、B与两位借款人的关系都在pre和post保持正余额。五项设计证据门与由余额计算的“持续暴露行+至少一条持续控制行”支持门只为pair层提供条件识别；借款人总融资与实体层没有各自的独立反事实，因此保持描述性。',
    facts: [{ label: 'pair contrast', value: '(−45 + −30)/2', note: '持续关系支持集+五门后的条件识别对象' }, { label: 'total financing', value: '−5 / −5', note: '前后观察均值' }, { label: 'real outcome', value: '−2 / −1', note: '前后观察均值' }],
    formulas: ['pair estimand=mean(ΔL_stable-exposed−mean(ΔL_stable-controls))', 'borrower total mean observed change=mean(Σbank ΔL+Δother)', 'real mean observed change=mean(ΔY)'], formulaUnits: '前两层为SYN-currency；实体层为SYN-real-index，禁止跨单位相加。退出、进入和全零控制关系不进入控制均值；后二层公式只生成观察变化，不生成反事实。',
    options: [{ id: 'a', label: '三个输出对象都等于−37.5', diagnosis: '把pair差异错误外推到总融资和实体结果。' }, { id: 'b', label: '只需五项设计开关为真；pre/post各有两行active就必然有持续控制', diagnosis: 'A持续、B退出、C进入时每期可各有两行active，却没有任何持续控制行。' }, { id: 'c', label: '持续暴露/控制支持与五项设计门通过后，分别报告pair −37.5、总融资观察变化−5、实体观察变化−1.5', diagnosis: '正确：实际估计支持集与设计门共同约束pair标签；后二层观察变化仍不可共享其因果标签。' }], correct: 'c',
    calculation: 'X与Y的暴露行A和控制行B均满足pre>0且post>0，控制均值只纳入这条持续控制关系；X pair差=−30−15=−45，Y为−20−10=−30，均值−37.5；银行加其他融资后X/Y均−5，实体前后观察均值=(−2−1)/2=−1.5。',
    reveal: '由数据计算的持续暴露/控制支持与五项设计证据门共同通过，pair层银行供给反应才获得条件支持；每期active行数并不证明存在持续控制。替代后的总融资与实体结果仍需要各自的反事实设计。', primarySectionId: 'pair-versus-borrower-total-effect', remediationSectionIds: ['credit-supply-identification-designs', 'other-bank-bond-nonbank-substitution', 'real-outcomes-lags-spillovers'], sourceIds: [43, 44, 45],
    numericAssertions: [{ key: 'pairEstimandCurrency', expected: -37.5, unit: 'SYN-currency' }, { key: 'borrowerTotalMeanObservedChangeCurrency', expected: -5, unit: 'SYN-currency' }, { key: 'realOutcomeMeanObservedChangeIndex', expected: -1.5, unit: 'SYN-real-index' }, { key: 'pairIdentificationStatus', expected: 'identified-under-stated-assumptions', unit: 'string' }],
    staticTwin: { id: 'K8', title: '变式 08 · 相同数字、缺失外生性', prompt: 'SYNTHETIC：保留完全相同的2×2前后矩阵，持续暴露/控制支持仍满足；但银行A的“暴露”只来自事后相关分类，外生性不成立。', choices: [{ id: 'a', label: '持续关系支持满足，所以仍然识别供给' }, { id: 'b', label: '三个描述量不变，但pair状态降为descriptive-only' }, { id: 'c', label: '所有数字必须改为0' }], correct: 'b', calculations: ['机械量仍为−37.5、−5与−1.5。', '持续关系支持不能替代外生性；外生性门未通过，pair层降为纯描述。', '后二层本来就没有独立反事实，仍为纯描述。'], answer: 'B。持续关系支持是必要而非充分条件；估计量的数值与其因果解释也是两个不同对象。缺外生性时不支持银行供给反应。', formulaUnits: 'SYN-currency、SYN-real-index与分层识别标签。', sourceIds: [43, 44, 45], numericAssertions: [{ key: 'pairEstimandCurrency', expected: -37.5, unit: 'SYN-currency' }, { key: 'pairIdentificationStatus', expected: 'descriptive-only', unit: 'string' }, { key: 'borrowerTotalIdentificationStatus', expected: 'descriptive-only', unit: 'string' }, { key: 'bankSupplyResponseSupported', expected: false, unit: 'boolean' }] },
  },
  {
    id: 'M9', mode: 'allocation-identification', label: '替代 09 · Full Offset', title: '强pair差异为何可能没有总融资或实体观察变化？', synthetic: true,
    brief: 'SYNTHETIC：A对每个借款人−40，B各+20，且A、B关系都在pre/post保持正余额；其他融资各+20，实体指数不变。持续暴露/控制支持满足但spillover门未处理，因此pair层仍是candidate；后二层只有观察变化。',
    facts: [{ label: 'exposed / control', value: '−40 / +20', note: '每个借款人' }, { label: 'other financing', value: '+20', note: '完全补足' }, { label: 'real index', value: '0 change', note: '无实体缺口' }],
    formulas: ['pair contrast=−40−(+20)=−60', 'total=−40+20+20=0'], formulaUnits: 'pair与总融资为SYN-currency；实体为SYN-real-index。',
    options: [{ id: 'a', label: 'pair −60，但总融资与实体观察变化均0；且spillover未处理故pair仍非最终识别', diagnosis: '正确：强中间差异可被替代完全吸收。' }, { id: 'b', label: '总融资必为−60，因为pair estimand就是总量', diagnosis: '忽略了同一借款人的银行B与其他融资。' }, { id: 'c', label: '实体观察变化为0证明pair计算必然错误', diagnosis: '实体没有同期观察变化也可能来自充分替代或其他时钟，不能反证机械计算。' }], correct: 'a',
    calculation: '每个借款人pair差−60；银行合计−20，再由其他融资+20完全抵销，所以借款人总量0；实体指数也0。设计仍缺spillover处理。',
    reveal: '贷款供给收缩能否成为宏观约束，关键取决于借款人的替代弹性，而不只取决于受冲击银行的系数大小。', primarySectionId: 'other-bank-bond-nonbank-substitution', remediationSectionIds: ['pair-versus-borrower-total-effect', 'real-outcomes-lags-spillovers'], sourceIds: [46, 47, 50],
    numericAssertions: [{ key: 'pairEstimandCurrency', expected: -60, unit: 'SYN-currency' }, { key: 'borrowerTotalMeanObservedChangeCurrency', expected: 0, unit: 'SYN-currency' }, { key: 'pairIdentificationStatus', expected: 'candidate-not-identified', unit: 'string' }, { key: 'completeBankLendingTransmissionSupported', expected: false, unit: 'boolean' }],
    staticTwin: { id: 'K9', title: '变式 09 · 无替代的持久变化', prompt: 'SYNTHETIC：A对每个借款人−10，B与其他融资均不变；A、B关系均满足pre>0且post>0，五项pair设计门也通过，实体指数各−2；但没有借款人总量与实体结果的独立反事实。', choices: [{ id: 'a', label: 'pair0、总融资0、实体−2' }, { id: 'b', label: 'pair−20、总融资−10、实体0' }, { id: 'c', label: 'pair−10且银行供给反应获条件支持；后二层仅报告−10与−2的观察变化' }], correct: 'c', calculations: ['暴露行A与控制行B都持续，支持门通过；暴露减持续控制=−10−0=−10。', '无替代，所以总融资观察均值−10。', '实体观察均值−2；只有pair层的设计门与支持门闭合。'], answer: 'C。三层方向一致不等于完整传导已识别；后二层仍需各自反事实。', formulaUnits: 'SYN-currency、SYN-real-index与分层识别标签。', sourceIds: [46, 47, 50], numericAssertions: [{ key: 'pairEstimandCurrency', expected: -10, unit: 'SYN-currency' }, { key: 'pairIdentificationStatus', expected: 'identified-under-stated-assumptions', unit: 'string' }, { key: 'bankSupplyResponseSupported', expected: true, unit: 'boolean' }, { key: 'completeBankLendingTransmissionSupported', expected: false, unit: 'boolean' }] },
  },
  {
    id: 'M10', mode: 'allocation-identification', label: '边界 10 · Common Rate Move', title: '所有银行一起收缩，为什么不能自动叫“独立银行贷款渠道”？', synthetic: true,
    brief: 'SYNTHETIC：A和B对每个借款人都减少10，其他融资不变，实体指数各−1；暴露标签没有外生来源、前趋势与需求控制也未通过。',
    facts: [{ label: 'Bank A / B', value: '各−10', note: '共同变化' }, { label: 'pair contrast', value: '−10−(−10)=0', note: '无银行间差异' }, { label: 'identification', value: '关键门未通过', note: '只可描述' }],
    formulas: ['common co-movement ≠ bank-specific supply identification', 'pair contrast=ΔL_exposed−ΔL_control'], formulaUnits: 'SYN-currency与SYN-real-index；因果标签不是数值单位。',
    options: [{ id: 'a', label: '总贷款下降就足以证明独立银行贷款渠道', diagnosis: '共同需求或普通利率渠道同样可能产生这种共动。' }, { id: 'b', label: 'pair差为0、总融资均值−20、实体−1；只能描述，不能识别独立供给', diagnosis: '正确：必须区分共同利率跟随与银行侧异质冲击。' }, { id: 'c', label: 'pair差为−20，因为两家银行变化应相加', diagnosis: 'pair estimand是暴露减对照，不是两行求和。' }], correct: 'b',
    calculation: '每个借款人A、B均−10，所以pair差0；银行总融资每人−20，其他融资0，实体均值−1。但识别门缺失，状态为descriptive-only。',
    reveal: '普通利率渠道回答“融资价格随政策变化”；独立银行贷款渠道还要求银行侧条件在无风险利率之外产生可识别的供给差异。', primarySectionId: 'strict-loan-supply-definition', remediationSectionIds: ['lending-versus-rate-channel', 'credit-supply-identification-designs'], sourceIds: [1, 3, 7, 10, 43],
    numericAssertions: [{ key: 'pairEstimandCurrency', expected: 0, unit: 'SYN-currency' }, { key: 'borrowerTotalMeanObservedChangeCurrency', expected: -20, unit: 'SYN-currency' }, { key: 'realOutcomeMeanObservedChangeIndex', expected: -1, unit: 'SYN-real-index' }, { key: 'pairIdentificationStatus', expected: 'descriptive-only', unit: 'string' }],
    staticTwin: { id: 'K10', title: '变式 10 · 已识别pair但完全替代', prompt: 'SYNTHETIC：外生冲击使A对每个借款人−20，B各+10，其他融资各+10，实体不变；暴露行A和控制行B都持续，五项pair设计门也通过，但后二层没有各自反事实。', choices: [{ id: 'a', label: 'pair−30且银行供给反应获条件支持；完整贷款传导仍不支持' }, { id: 'b', label: 'pair0，所以不存在银行供给变化' }, { id: 'c', label: '总融资−30且实体必然下降' }], correct: 'a', calculations: ['A与B均满足pre>0且post>0，持续关系支持门通过；pair=−20−(+10)=−30。', '总融资观察变化=−20+10+10=0。', 'pair层设计与支持门通过；充分替代且后二层没有独立反事实，所以完整传导不成立。'], answer: 'A。识别银行供给反应不等于识别替代后的总量后果与实体后果。', formulaUnits: 'SYN-currency、SYN-real-index与分层识别标签。', sourceIds: [43, 46, 50], numericAssertions: [{ key: 'pairEstimandCurrency', expected: -30, unit: 'SYN-currency' }, { key: 'borrowerTotalMeanObservedChangeCurrency', expected: 0, unit: 'SYN-currency' }, { key: 'bankSupplyResponseSupported', expected: true, unit: 'boolean' }, { key: 'completeBankLendingTransmissionSupported', expected: false, unit: 'boolean' }] },
  },
];

const m1 = allInLoanOfferMetrics(m1Input);
const k1 = allInLoanOfferMetrics(k1Input);
const m2 = allInLoanOfferMetrics(m2Input);
const k2 = allInLoanOfferMetrics(k2Input);
const m3 = fundingPassThroughMetrics(m3Input);
const k3 = fundingPassThroughMetrics(k3Input);
const m4 = repricingClockMetrics(m4Input);
const k4 = repricingClockMetrics(k4Input);
const m5 = loanCapacityMetrics(m5Input);
const k5 = loanCapacityMetrics(k5Input);
const minimumRuleBreachCapacity = loanCapacityMetrics({ ...m5Input, capital: { ...m5Input.capital, cet1: 5 } });
const maximumRuleBreachCapacity = loanCapacityMetrics({ ...m5Input, concentration: { ...m5Input.concentration, connectedExposureBefore: 4 } });
const m6 = creditMenuMetrics(m6Input);
const k6 = creditMenuMetrics(k6Input);
const m7 = bankBorrowerAllocationMetrics(m7Input);
const k7 = bankBorrowerAllocationMetrics(k7Input);
const m8 = identificationSubstitutionMetrics(m8Input);
const k8 = identificationSubstitutionMetrics(k8Input);
const m9 = identificationSubstitutionMetrics(m9Input);
const k9 = identificationSubstitutionMetrics(k9Input);
const m10 = identificationSubstitutionMetrics(m10Input);
const k10 = identificationSubstitutionMetrics(k10Input);
const zeroControlRelationshipCounterexample = identificationSubstitutionMetrics({
  ...m8Input,
  pairs: m8Input.pairs.map((pair) => pair.bankId === 'B' ? { ...pair, preAmount: 0, postAmount: 0 } : pair),
});
const pureCrossTimeRelationshipSwitchCounterexample = identificationSubstitutionMetrics({
  ...m8Input,
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 0 },
    { bankId: 'B', borrowerId: 'X', preAmount: 0, postAmount: 100 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 100, postAmount: 0 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 0, postAmount: 100 },
  ],
});
const perPeriodCountsWithoutStableControlCounterexample = identificationSubstitutionMetrics({
  ...m8Input,
  banks: [{ bankId: 'A', exposed: true }, { bankId: 'B', exposed: false }, { bankId: 'C', exposed: false }],
  pairs: [
    { bankId: 'A', borrowerId: 'X', preAmount: 100, postAmount: 70 },
    { bankId: 'B', borrowerId: 'X', preAmount: 40, postAmount: 0 },
    { bankId: 'C', borrowerId: 'X', preAmount: 0, postAmount: 40 },
    { bankId: 'A', borrowerId: 'Y', preAmount: 80, postAmount: 60 },
    { bankId: 'B', borrowerId: 'Y', preAmount: 20, postAmount: 0 },
    { bankId: 'C', borrowerId: 'Y', preAmount: 0, postAmount: 20 },
  ],
});

const calculatedScenarioValues: Record<string, Record<string, unknown>> = {
  M1: m1 ?? {}, K1: k1 ?? {}, M2: m2 ?? {}, K2: k2 ?? {}, M3: m3 ?? {}, K3: k3 ?? {}, M4: m4 ?? {}, K4: k4 ?? {},
  M5: { ...(m5 ?? {}), lcrCapacity: m5?.signedConvertedCapacities.lcr, mappingBasis: m5?.mappingTarget.mappingBasis },
  K5: { ...(k5 ?? {}), nsfrCapacity: k5?.signedConvertedCapacities.nsfr, concentrationCapacity: k5?.signedConvertedCapacities.concentration },
  M6: m6 ?? {}, K6: k6 ?? {}, M7: m7 ?? {}, K7: k7 ?? {}, M8: m8 ?? {}, K8: k8 ?? {}, M9: m9 ?? {}, K9: k9 ?? {}, M10: m10 ?? {}, K10: k10 ?? {},
};

function assertionPasses(actual: unknown, assertion: BankLendingAssertion) {
  if (typeof assertion.expected !== 'number') return actual === assertion.expected;
  return typeof actual === 'number' && Number.isFinite(actual) && Math.abs(actual - assertion.expected) <= (assertion.tolerance ?? 1e-9);
}

export const bankLendingNumericAssertionAudit = bankLendingScenarios.flatMap((scenario) => ([
  ...scenario.numericAssertions.map((assertion) => ({
    scenarioId: scenario.id,
    key: assertion.key,
    expected: assertion.expected,
    actual: calculatedScenarioValues[scenario.id]?.[assertion.key],
    passed: assertionPasses(calculatedScenarioValues[scenario.id]?.[assertion.key], assertion),
  })),
  ...scenario.staticTwin.numericAssertions.map((assertion) => ({
    scenarioId: scenario.staticTwin.id,
    key: assertion.key,
    expected: assertion.expected,
    actual: calculatedScenarioValues[scenario.staticTwin.id]?.[assertion.key],
    passed: assertionPasses(calculatedScenarioValues[scenario.staticTwin.id]?.[assertion.key], assertion),
  })),
]));

function choiceDistribution(choices: BankLendingChoice[]) {
  return (['a', 'b', 'c'] as const).map((choice) => choices.filter((item) => item === choice).length);
}

const canonicalBankLendingSectionIds = new Set([
  'upstream-state-freeze',
  'strict-loan-supply-definition',
  'non-mm-bank-funding',
  'borrower-bank-dependence',
  'implementation-versus-decision',
  'lending-versus-rate-channel',
  'lending-versus-balance-sheet-channel',
  'lending-versus-risk-taking-channel',
  'creation-stock-supply-distinction',
  'four-necessary-links',
  'price-quantity-nonprice-margins',
  'stock-flow-commitment-draw',
  'credit-pipeline-clock',
  'pair-bank-borrower-aggregate-levels',
  'loan-contract-passport',
  'benchmark-maturity-repricing',
  'marginal-funding-cost',
  'deposit-beta',
  'wholesale-secured-term-funding',
  'frozen-expected-loss',
  'operating-screening-servicing-cost',
  'capital-shadow-price',
  'liquidity-stable-funding-shadow-price',
  'concentration-opportunity-cost',
  'markup-competition-market-power',
  'all-in-loan-offer',
  'new-business-versus-stock-rates',
  'fixed-floating-repricing-clock',
  'spread-fee-floor-collateral-covenant',
  'expected-net-return-threshold',
  'extensive-approval-margin',
  'intensive-limit-amount-margin',
  'adverse-selection-credit-rationing',
  'nonprice-tightening-ranking',
  'pass-through-speed-stickiness',
  'tightening-easing-low-rate-asymmetry',
  'deposit-franchise-local-market-power',
  'deposit-migration-replacement-funding',
  'average-versus-marginal-funding-mix',
  'liquid-asset-buffer',
  'capital-headroom-deleveraging-choice',
  'bank-size-is-proxy',
  'internal-capital-markets-global-banks',
  'maturity-repricing-mismatch',
  'central-bank-term-funding-design',
  'securities-loan-sale-securitisation',
  'loan-types-revolvers-commitments',
  'banking-competition-local-structure',
  'information-capital-relationship-lending',
  'existing-versus-new-relationships',
  'core-peripheral-expertise',
  'applications-matching-termination',
  'within-bank-portfolio-reallocation',
  'other-bank-bond-nonbank-substitution',
  'pair-versus-borrower-total-effect',
  'real-outcomes-lags-spillovers',
  'credit-supply-identification-designs',
  'falsification-placebo-aggregation',
]);

export const bankLendingScenarioAssertions = [
  { id: 'main-count', statement: '主场景为M1–M10共10题。', passed: bankLendingScenarios.length === 10 && bankLendingScenarios.every((scenario, index) => scenario.id === `M${index + 1}`) },
  { id: 'twin-count', statement: '每题都有对应K1–K10静态孪生。', passed: bankLendingScenarios.every((scenario, index) => scenario.staticTwin.id === `K${index + 1}`) },
  { id: 'mode-balance', statement: '定价时钟与配置识别两个模式各5题。', passed: bankLendingModes.every((mode) => bankLendingScenarios.filter((scenario) => scenario.mode === mode.id).length === 5) },
  { id: 'unique-options', statement: '每道主场景和孪生题都恰有唯一a/b/c且答案命中一次。', passed: bankLendingScenarios.every((scenario) => {
    const mainIds = scenario.options.map((option) => option.id);
    const twinIds = scenario.staticTwin.choices.map((option) => option.id);
    return scenario.options.length === 3
      && scenario.staticTwin.choices.length === 3
      && new Set(mainIds).size === 3
      && new Set(twinIds).size === 3
      && (['a', 'b', 'c'] as const).every((choice) => mainIds.includes(choice) && twinIds.includes(choice))
      && mainIds.filter((choice) => choice === scenario.correct).length === 1
      && twinIds.filter((choice) => choice === scenario.staticTwin.correct).length === 1;
  }) },
  { id: 'answer-dispersion', statement: '主场景与孪生答案位置均不集中，a/b/c频次最大差不超过1。', passed: [
    choiceDistribution(bankLendingScenarios.map((scenario) => scenario.correct)),
    choiceDistribution(bankLendingScenarios.map((scenario) => scenario.staticTwin.correct)),
  ].every((distribution) => Math.max(...distribution) - Math.min(...distribution) <= 1) },
  { id: 'source-coverage', statement: '每道主场景和孪生题都有正整数sourceIds。', passed: bankLendingScenarios.every((scenario) => scenario.sourceIds.length > 0 && scenario.staticTwin.sourceIds.length > 0 && [...scenario.sourceIds, ...scenario.staticTwin.sourceIds].every((id) => Number.isSafeInteger(id) && id > 0)) },
  { id: 'section-id-integrity', statement: '所有primary/remediation锚点均来自3.10正文canonical集合。', passed: bankLendingScenarios.every((scenario) => canonicalBankLendingSectionIds.has(scenario.primarySectionId) && scenario.remediationSectionIds.length > 0 && scenario.remediationSectionIds.every((id) => canonicalBankLendingSectionIds.has(id))) },
  { id: 'synthetic-only', statement: '全部主场景与静态孪生明确标记SYNTHETIC。', passed: bankLendingScenarios.every((scenario) => scenario.synthetic === true && scenario.brief.startsWith('SYNTHETIC') && scenario.staticTwin.prompt.startsWith('SYNTHETIC')) },
  { id: 'numeric-count', statement: '20道题合计80条数值/状态断言。', passed: bankLendingNumericAssertionAudit.length === 80 },
  { id: 'numeric-audit', statement: '80条断言全部由纯函数实际值通过。', passed: bankLendingNumericAssertionAudit.length === 80 && bankLendingNumericAssertionAudit.every((assertion) => assertion.passed) },
  { id: 'assertion-key-uniqueness', statement: '每道题内部numeric assertion key不重复。', passed: bankLendingScenarios.every((scenario) => new Set(scenario.numericAssertions.map((assertion) => assertion.key)).size === scenario.numericAssertions.length && new Set(scenario.staticTwin.numericAssertions.map((assertion) => assertion.key)).size === scenario.staticTwin.numericAssertions.length) },
  { id: 'signed-capacity-guard', statement: 'C4/M5/K5保留有符号越界深度：最低资本与最高集中度反例分别得到-100与-20的换算容量，feasible才截断为0，并与正常正容量绑定状态区分。', passed: minimumRuleBreachCapacity?.signedRawHeadrooms.capital === -5 && minimumRuleBreachCapacity.signedConvertedCapacities.capital === -100 && minimumRuleBreachCapacity.feasibleLoanCapacity === 0 && minimumRuleBreachCapacity.constraintDiagnostics.capital.bindingState === 'breached' && maximumRuleBreachCapacity?.signedRawHeadrooms.concentration === -1 && maximumRuleBreachCapacity.signedConvertedCapacities.concentration === -20 && maximumRuleBreachCapacity.feasibleLoanCapacity === 0 && maximumRuleBreachCapacity.constraintDiagnostics.concentration.bindingState === 'breached' && m5?.constraintDiagnostics.nsfr.bindingState === 'positive-binding' },
  { id: 'identification-guard', statement: '分层识别防线由M8/K8/K10直接验证：M8持续暴露/控制支持与五项设计门共同通过；缺外生性时不支持银行供给反应；pair条件识别也不升级为完整传导。', passed: m8?.stablePairEstimationSupportEligible === true && m8.stableSupportDerivedFromObservedBalances && m8.pairIdentificationStatus === 'identified-under-stated-assumptions' && m8.borrowerTotalIdentificationStatus === 'descriptive-only' && m8.realOutcomeIdentificationStatus === 'descriptive-only' && k8?.pairIdentificationStatus === 'descriptive-only' && k8.bankSupplyResponseSupported === false && k10?.stablePairEstimationSupportEligible === true && k10.bankSupplyResponseSupported === true && k10.completeBankLendingTransmissionSupported === false },
  { id: 'stable-support-counterexamples', statement: '全零控制、两银行纯换行及三银行A持续/B退出/C进入都不能进入持续关系估计支持集；第三例即使每期各有两条active仍无持续控制，三例都必须pair降级且bankSupply为false。', passed: [zeroControlRelationshipCounterexample, pureCrossTimeRelationshipSwitchCounterexample, perPeriodCountsWithoutStableControlCounterexample].every((result) => result?.stablePairEstimationSupportEligible === false && result.pairEstimandCurrency === null && result.pairIdentificationStatus === 'candidate-not-identified' && result.bankSupplyResponseSupported === false) && perPeriodCountsWithoutStableControlCounterexample?.borrowerTimeRelationshipSupportByBorrower.every((item) => item.preActiveRelationshipCount === 2 && item.postActiveRelationshipCount === 2 && item.perPeriodActiveCountEligible && item.stableExposedRelationship && item.stableControlRelationshipCount === 0 && !item.stableEstimationSupportEligible) === true },
  { id: 'chapter-boundary', statement: '配置与识别fixture冻结PD、LGD、抵押价值和risk tolerance。', passed: m7?.riskMetricsFrozen === true && m7.bankRiskToleranceFrozen === true && m8 !== null && m9 !== null && m10 !== null },
];

export function assertBankLendingScenarioIntegrity() {
  const failedStructure = bankLendingScenarioAssertions.filter((assertion) => !assertion.passed).map((assertion) => assertion.id);
  const failedNumeric = bankLendingNumericAssertionAudit.filter((assertion) => !assertion.passed).map((assertion) => `${assertion.scenarioId}:${assertion.key}`);
  const failed = [...failedStructure, ...failedNumeric];
  if (failed.length > 0) {
    throw new Error(`Bank-lending scenario integrity failed: ${failed.join(', ')}`);
  }
  return {
    total: bankLendingScenarioAssertions.length + bankLendingNumericAssertionAudit.length,
    passed: bankLendingScenarioAssertions.length + bankLendingNumericAssertionAudit.length - failed.length,
    failed,
    allPassed: failed.length === 0,
  };
}

export const bankLendingScenarioIntegrityGate = assertBankLendingScenarioIntegrity();
