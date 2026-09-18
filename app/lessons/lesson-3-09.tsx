import type { ReactNode } from 'react';
import BankCreditLab from '../components/BankCreditLab';
import {
  canonicalLoanDrawOpeningPositions,
  canonicalLoanDrawReplayEvent,
  canonicalLoanDrawReplayResult,
  type ReplayLedgerPosition,
  type ReplayLedgerPosting,
} from '../components/bankCreditFixtures';
import {
  BankCreditFixtureAudit,
  ConstraintSafetyNetLab,
  CreditLifecycleLab,
  CreditLossEventLab,
  FiscalCentralBankLab,
  MoneyMultiplierLab,
  MoneyPassportLab,
  PaymentSettlementLab,
} from '../components/BankCreditMechanismLabs';
import BankCreditTransmissionChart from '../components/BankCreditTransmissionChart';
import { bankCreditScenarios } from '../components/bankCreditScenarios';
import { lesson309DynamicSourceRequirements, lesson309ReadingList, lesson309References, lesson309SourceIdentityPassports } from './lesson-3-09-sources';
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

function BankCreditConceptSection({ section }: { section: ConceptSection }) {
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

type MoneyEligibility = 'included' | 'excluded' | 'unknown';

type AmountState = {
  amount: number | null;
  currency: string | null;
  measurementBasis: string | null;
  asOf: string | null;
};

type EntityPassport = {
  entityId: string;
  legalName: string | null;
  sector: string | null;
  residency: string | null;
  jurisdiction: string | null;
  consolidationScope: 'solo' | 'group' | 'depository-system' | null;
};

type ClaimPassport = {
  claimId: string;
  creditorEntityId: string | null;
  debtorEntityId: string | null;
  creditorSector: string | null;
  debtorSector: string | null;
  creditorResidency: string | null;
  debtorResidency: string | null;
  currency: string | null;
  jurisdiction: string | null;
  instrument: string | null;
  measurementBasis: string | null;
  nominalAmount: number | null;
  carryingAmount: number | null;
  accruedInterest: number | null;
  maturityAt: string | null;
  collateralIds: string[];
  seniority: string | null;
  transferable: boolean | null;
  redeemability: string | null;
  moneyEligibility: MoneyEligibility;
  observationTime: string | null;
};

type LedgerPosition = ReplayLedgerPosition;
type LedgerPosting = ReplayLedgerPosting;

type BankCreditEventType =
  | 'approval' | 'commitment' | 'draw' | 'payment-instruction' | 'clearing' | 'settlement-final'
  | 'interest-accrual' | 'cash-payment' | 'past-due' | 'default' | 'allowance' | 'write-off'
  | 'recovery' | 'refinancing' | 'security-trade' | 'fiscal' | 'central-bank' | 'other-volume';

type BankCreditEvent = {
  eventId: string;
  ledgerSequence: number;
  eventType: BankCreditEventType;
  status: 'proposed' | 'committed' | 'posted' | 'final' | 'cancelled' | 'failed';
  amount: number | null;
  currency: string | null;
  actorEntityIds: string[];
  actorRoles: { entityId: string; role: 'lender' | 'borrower' | 'payer' | 'payee' | 'creditor' | 'debtor' | 'deposit-issuer' | 'deposit-holder' | 'settlement-agent' | 'asset-buyer' | 'asset-seller' }[];
  claimIds: string[];
  sourceEventIds: string[];
  applyRuleVersion: string | null;
  postings: LedgerPosting[];
  effectiveAt: string | null;
  postedAt: string | null;
  finalAt: string | null;
};

type LedgerCheck = {
  checkId: string;
  checkType: 'vertical' | 'horizontal';
  positionIds: string[];
  residual: number | null;
  passed: boolean | null;
};

type FundingMixItem = {
  sourceType: 'retained-deposit' | 'interbank' | 'repo' | 'asset-sale' | 'long-term-debt' | 'central-bank' | 'other';
  amount: number | null;
  currency: string | null;
  maturityAt: string | null;
  collateralIds: string[];
  costRate: number | null;
};

type ConstraintSnapshot = {
  ruleId: string | null;
  numerator: number | null;
  denominator: number | null;
  ratio: number | null;
  applicableMinimum: number | null;
  capacityAmount: number | null;
  capacityUnit: string | null;
  status: 'pass' | 'fail' | 'unknown' | null;
  asOf: string | null;
};

type HeadroomState = {
  amount: number | null;
  currency: string | null;
  horizon: string | null;
  capacityUnit: string | null;
};

export type ExpectedNetReturnObservation = {
  valuePctPointsPerYear: number | null;
  rateConcept: string | null;
  annualisation: string | null;
  currency: string | null;
  horizon: string | null;
  observationTime: string | null;
};

type BankCreditCreationState = {
  schemaVersion: string;
  stateId: string;
  scope: { currency: string | null; jurisdiction: string | null; legalEntity: string | null; consolidationScope: 'solo' | 'group' | 'depository-system' | null } | null;
  inputLineage: { capitalLiquidityStateId: string | null; reserveSettlementStateId: string | null; nominalRealRateStateId: string | null } | null;
  moneyPassport: { aggregateDefinitionId: string | null; issuerSet: string[]; holderSet: string[]; instrumentSet: string[]; methodologyVintage: string | null; retrievedAt: string | null } | null;
  balanceSheetUniverse: { entities: EntityPassport[]; openingPositions: LedgerPosition[]; claimPassports: ClaimPassport[]; reciprocalClaimMap: { claimId: string; creditorPositionId: string; debtorPositionId: string }[] } | null;
  transactionEvent: BankCreditEvent | null;
  ledgerState: { eventLedger: BankCreditEvent[]; verticalBalanceChecks: LedgerCheck[]; horizontalCounterpartyChecks: LedgerCheck[]; reconciliationResidual: number | null } | null;
  creditState: { approval: AmountState | null; commitment: AmountState | null; drawnPrincipal: AmountState | null; accruedInterest: AmountState | null; allowance: AmountState | null; writeOff: AmountState | null } | null;
  depositMoneyState: { depositByIssuerHolderInstrument: { issuerEntityId: string; holderSector: string; instrument: string; amount: number | null; eligibilityStatus: MoneyEligibility }[]; broadMoneyChange: number | null; eligibilityStatus: MoneyEligibility | null } | null;
  settlementState: { paymentInstruction: { paymentId: string; payerEntityId: string | null; payeeEntityId: string | null; amount: number | null; currency: string | null; instructedAt: string | null } | null; clearing: { arrangementId: string | null; grossObligation: number | null; netObligation: number | null; calculatedAt: string | null } | null; settlementAsset: ClaimPassport | null; finalityStatus: 'pending' | 'provisional' | 'final' | 'failed' | 'unknown' | null; correspondentChain: string[] | null } | null;
  reserveState: { institutionDistribution: { institutionId: string; amount: number | null; currency: string | null; asOf: string | null }[]; systemTotal: number | null; fundingAfterSettlement: FundingMixItem[] } | null;
  monetaryAggregateBridge: { opening: number | null; transactions: number | null; revaluations: number | null; otherVolumeChanges: number | null; closing: number | null } | null;
  constraintState: { eligibleDemand: HeadroomState | null; expectedNetReturn: ExpectedNetReturnObservation | null; fundingMix: FundingMixItem[]; riskCapital: ConstraintSnapshot | null; leverage: ConstraintSnapshot | null; liquidity: ConstraintSnapshot | null; stableFunding: ConstraintSnapshot | null; concentration: ConstraintSnapshot | null; capitalHeadroom: HeadroomState | null; leverageHeadroom: HeadroomState | null; liquidityHeadroom: HeadroomState | null; stableFundingHeadroom: HeadroomState | null; concentrationHeadroom: HeadroomState | null } | null;
  nonBankBoundaryState: { lenderSector: string | null; liabilityMoneyEligibility: MoneyEligibility | null; bankLinks: { bankEntityId: string; linkType: 'deposit' | 'credit-line' | 'repo' | 'derivative' | 'servicing' | 'other'; claimIds: string[] }[] } | null;
  safetyNetState: { depositInsurance: { ruleId: string | null; coveredAmount: number | null; uncoveredAmount: number | null; currency: string | null; asOf: string | null } | null; centralBankAccess: { facilityId: string | null; eligibilityStatus: 'eligible' | 'ineligible' | 'unknown'; collateralIds: string[]; availableCapacity: number | null; asOf: string | null } | null; resolutionPassport: { authority: string | null; strategy: string | null; claimHierarchyVersion: string | null; legalEntityId: string | null; asOf: string | null } | null } | null;
  regimePassport: { operatingFramework: string | null; reserveRequirementRule: string | null; accountingFramework: string | null; prudentialRuleVersion: string | null; asOf: string | null } | null;
  identificationStatus: 'descriptive' | 'candidate-shock' | 'identified' | null;
  measurementFlags: string[];
  timestamps: { observationTime: string | null; publicationTime: string | null; eventTime: string | null; settlementTime: string | null; revisionVintage: string | null };
};

const canonicalBankCreditStateFields = [
  'schemaVersion', 'stateId', 'scope', 'inputLineage', 'moneyPassport', 'balanceSheetUniverse',
  'transactionEvent', 'ledgerState', 'creditState', 'depositMoneyState', 'settlementState', 'reserveState',
  'monetaryAggregateBridge', 'constraintState', 'nonBankBoundaryState', 'safetyNetState', 'regimePassport',
  'identificationStatus', 'measurementFlags', 'timestamps',
] as const satisfies readonly (keyof BankCreditCreationState)[];

const canonicalBankCreditStateFieldCoverage = true satisfies Exclude<keyof BankCreditCreationState, (typeof canonicalBankCreditStateFields)[number]> extends never ? true : false;

const canonicalEntities: EntityPassport[] = [
  { entityId: 'BANK_A', legalName: 'SYNTHETIC Bank A', sector: 'deposit-taking-corporation', residency: 'DOM', jurisdiction: 'SYNTHETIC', consolidationScope: 'solo' },
  { entityId: 'BORROWER_1', legalName: 'SYNTHETIC Borrower 1', sector: 'resident-nonfinancial-corporation', residency: 'DOM', jurisdiction: 'SYNTHETIC', consolidationScope: 'solo' },
];

const canonicalClaims: ClaimPassport[] = [
  { claimId: 'CLAIM_LOAN_001', creditorEntityId: 'BANK_A', debtorEntityId: 'BORROWER_1', creditorSector: 'deposit-taking-corporation', debtorSector: 'resident-nonfinancial-corporation', creditorResidency: 'DOM', debtorResidency: 'DOM', currency: 'SYN', jurisdiction: 'SYNTHETIC', instrument: 'bank-loan', measurementBasis: 'contract-principal', nominalAmount: 100, carryingAmount: 100, accruedInterest: 0, maturityAt: '2027-09-02T00:00:00Z', collateralIds: [], seniority: 'senior-unsecured', transferable: false, redeemability: 'contractual-amortisation', moneyEligibility: 'excluded', observationTime: '2026-09-02T00:00:00Z' },
  { claimId: 'CLAIM_DEPOSIT_001', creditorEntityId: 'BORROWER_1', debtorEntityId: 'BANK_A', creditorSector: 'resident-nonfinancial-corporation', debtorSector: 'deposit-taking-corporation', creditorResidency: 'DOM', debtorResidency: 'DOM', currency: 'SYN', jurisdiction: 'SYNTHETIC', instrument: 'transaction-deposit', measurementBasis: 'nominal-value', nominalAmount: 100, carryingAmount: 100, accruedInterest: 0, maturityAt: null, collateralIds: [], seniority: 'ordinary-deposit', transferable: true, redeemability: 'on-demand', moneyEligibility: 'included', observationTime: '2026-09-02T00:00:00Z' },
];

const canonicalDrawEvent: BankCreditEvent = {
  ...canonicalLoanDrawReplayEvent,
  eventType: 'draw',
  amount: 100,
  currency: 'SYN',
  actorEntityIds: ['BANK_A', 'BORROWER_1'],
  actorRoles: [
    { entityId: 'BANK_A', role: 'lender' },
    { entityId: 'BANK_A', role: 'deposit-issuer' },
    { entityId: 'BORROWER_1', role: 'borrower' },
    { entityId: 'BORROWER_1', role: 'deposit-holder' },
  ],
  claimIds: ['CLAIM_LOAN_001', 'CLAIM_DEPOSIT_001'],
  sourceEventIds: [],
  effectiveAt: '2026-09-02T00:00:00Z',
  postedAt: '2026-09-02T00:00:01Z',
  finalAt: '2026-09-02T00:00:01Z',
};

export const lesson309SyntheticExpectedNetReturn: ExpectedNetReturnObservation = {
  valuePctPointsPerYear: 1.2,
  rateConcept: 'risk-adjusted-expected-net-return',
  annualisation: 'simple-annual-percent',
  currency: 'SYN',
  horizon: '24m',
  observationTime: '2026-09-02T00:00:00Z',
};

const canonicalBankCreditStateExample: BankCreditCreationState = {
  schemaVersion: '3.09-r5-contract',
  stateId: 'SYNTHETIC_DRAW_REPLAY_STATE',
  scope: { currency: 'SYN', jurisdiction: 'SYNTHETIC', legalEntity: 'BANK_A', consolidationScope: 'solo' },
  inputLineage: { capitalLiquidityStateId: 'SYNTHETIC_2_06_STATE', reserveSettlementStateId: 'SYNTHETIC_3_06_STATE', nominalRealRateStateId: 'SYNTHETIC_3_08_STATE' },
  moneyPassport: { aggregateDefinitionId: 'SYNTHETIC_BROAD_MONEY_V1', issuerSet: ['BANK_A'], holderSet: ['resident-nonfinancial-corporation'], instrumentSet: ['transaction-deposit'], methodologyVintage: 'SYNTHETIC-2026-09-02', retrievedAt: '2026-09-02T00:00:00Z' },
  balanceSheetUniverse: { entities: canonicalEntities, openingPositions: canonicalLoanDrawOpeningPositions, claimPassports: canonicalClaims, reciprocalClaimMap: [{ claimId: 'CLAIM_LOAN_001', creditorPositionId: 'BANK_A_LOAN_ASSET', debtorPositionId: 'BORROWER_LOAN_LIABILITY' }, { claimId: 'CLAIM_DEPOSIT_001', creditorPositionId: 'BORROWER_DEPOSIT_ASSET', debtorPositionId: 'BANK_A_DEPOSIT_LIABILITY' }] },
  transactionEvent: canonicalDrawEvent,
  ledgerState: { eventLedger: [canonicalDrawEvent], verticalBalanceChecks: canonicalLoanDrawReplayResult.verticalResiduals.map(({ entityId, residual }) => ({ checkId: `VERTICAL_${entityId}`, checkType: 'vertical', positionIds: canonicalLoanDrawReplayResult.closingPositions.filter((position) => position.entityId === entityId).map((position) => position.positionId), residual, passed: residual === 0 })), horizontalCounterpartyChecks: canonicalLoanDrawReplayResult.horizontalResiduals.map(({ claimId, residual }) => ({ checkId: `HORIZONTAL_${claimId}`, checkType: 'horizontal', positionIds: canonicalLoanDrawReplayResult.closingPositions.filter((position) => position.claimId === claimId).map((position) => position.positionId), residual, passed: residual === 0 })), reconciliationResidual: canonicalLoanDrawReplayResult.passed ? 0 : null },
  creditState: { approval: null, commitment: null, drawnPrincipal: { amount: 100, currency: 'SYN', measurementBasis: 'contract-principal', asOf: '2026-09-02T00:00:00Z' }, accruedInterest: null, allowance: null, writeOff: null },
  depositMoneyState: { depositByIssuerHolderInstrument: [{ issuerEntityId: 'BANK_A', holderSector: 'resident-nonfinancial-corporation', instrument: 'transaction-deposit', amount: 100, eligibilityStatus: 'included' }], broadMoneyChange: 100, eligibilityStatus: 'included' },
  settlementState: { paymentInstruction: null, clearing: null, settlementAsset: null, finalityStatus: null, correspondentChain: null },
  reserveState: { institutionDistribution: [], systemTotal: 0, fundingAfterSettlement: [] },
  monetaryAggregateBridge: { opening: 0, transactions: 100, revaluations: 0, otherVolumeChanges: 0, closing: 100 },
  constraintState: { eligibleDemand: null, expectedNetReturn: lesson309SyntheticExpectedNetReturn, fundingMix: [], riskCapital: null, leverage: null, liquidity: null, stableFunding: null, concentration: null, capitalHeadroom: null, leverageHeadroom: null, liquidityHeadroom: null, stableFundingHeadroom: null, concentrationHeadroom: null },
  nonBankBoundaryState: { lenderSector: null, liabilityMoneyEligibility: null, bankLinks: [] },
  safetyNetState: { depositInsurance: null, centralBankAccess: null, resolutionPassport: null },
  regimePassport: { operatingFramework: null, reserveRequirementRule: null, accountingFramework: null, prudentialRuleVersion: null, asOf: null },
  identificationStatus: 'descriptive',
  measurementFlags: ['SYNTHETIC_REPLAY_FIXTURE', 'NOT_EMPIRICAL_DATA'],
  timestamps: { observationTime: '2026-09-02T00:00:01Z', publicationTime: null, eventTime: '2026-09-02T00:00:00Z', settlementTime: null, revisionVintage: '3.09-r5' },
};

const canonicalBankCreditStateExampleKeys = Object.keys(canonicalBankCreditStateExample);
const canonicalExpectedNetReturn = canonicalBankCreditStateExample.constraintState?.expectedNetReturn;
const canonicalExpectedNetReturnRuntimeCoverage = canonicalExpectedNetReturn === lesson309SyntheticExpectedNetReturn
  && Object.keys(canonicalExpectedNetReturn).length === 6
  && Number.isFinite(canonicalExpectedNetReturn.valuePctPointsPerYear)
  && canonicalExpectedNetReturn.valuePctPointsPerYear === 1.2
  && canonicalExpectedNetReturn.rateConcept === 'risk-adjusted-expected-net-return'
  && canonicalExpectedNetReturn.annualisation === 'simple-annual-percent'
  && canonicalExpectedNetReturn.currency === 'SYN'
  && canonicalExpectedNetReturn.horizon === '24m'
  && canonicalExpectedNetReturn.observationTime === '2026-09-02T00:00:00Z'
  && !Object.prototype.hasOwnProperty.call(canonicalExpectedNetReturn, 'amount')
  && !Object.prototype.hasOwnProperty.call(canonicalExpectedNetReturn, 'capacityUnit');
const canonicalBankCreditStateRuntimeCoverage = canonicalBankCreditStateExampleKeys.length === canonicalBankCreditStateFields.length
  && canonicalBankCreditStateFields.every((field) => Object.prototype.hasOwnProperty.call(canonicalBankCreditStateExample, field))
  && canonicalExpectedNetReturnRuntimeCoverage
  && canonicalBankCreditStateExample.ledgerState?.eventLedger.length === 1
  && canonicalBankCreditStateExample.ledgerState.eventLedger[0].postings.length === 4
  && canonicalBankCreditStateExample.ledgerState.eventLedger[0].actorRoles.length === 4
  && canonicalBankCreditStateExample.ledgerState.eventLedger[0].postings.every((posting) => canonicalBankCreditStateExample.ledgerState?.eventLedger[0].actorEntityIds.includes(posting.entityId) && (posting.claimId === null || canonicalBankCreditStateExample.ledgerState?.eventLedger[0].claimIds.includes(posting.claimId)))
  && canonicalLoanDrawReplayResult.passed
  && canonicalLoanDrawReplayResult.closingPositions.length === 4
  && canonicalLoanDrawReplayResult.closingPositions.every((position) => position.amount === 100);

if (!canonicalExpectedNetReturnRuntimeCoverage) {
  throw new Error('3.09 expectedNetReturn producer contract failed its dedicated rate-observation gate.');
}

const conceptSections: ConceptSection[] = [
  {
    id: 'upstream-state-freeze', number: 2, label: 'Upstream State Freeze',
    title: '先冻结法律实体、期初账本和上游约束；3.09 只解释事件怎样改变这些对象。',
    paragraphs: [
      '本节从 2.06 的资本与流动性状态、3.06 的准备金实施框架以及 3.08 的名义—实际贴现输入出发，不在这里重新估计它们。每个输入都必须带币种、司法辖区、法律实体、合并层级和时间戳；否则同名的“存款”或“准备金”可能属于完全不同的债务人和统计边界。',
      '本章新增的是事件账本：审批、承诺、提款、支付、清算、最终结算、应计、实际付款、逾期、违约、拨备和核销分别记录。状态更新只能由对应事件触发；期末余额可以核对结果，却不能倒推出中间阶段真实发生过什么。§§50–55 与 C7 的比率、headroom 和容量全部是 SYNTHETIC 单位与方向测试，只验证本章接口，绝不回写或替代 2.06 的真实上游状态。',
    ],
    sourceIds: [5, 7, 8, 26],
    formula: { label: '事件更新', expression: 'ClosingPositions = Applyᵥ(openingPositions, eventLedger[ledgerSequence].postings[postingSequence])', note: 'v 是显式 applyRuleVersion；每条 posting 保存 position、方向、主体、请求权、币种、计量基础与生效时点。' },
    boundary: '读取 inputLineage 与 scope，保存 balanceSheetUniverse.entities、balanceSheetUniverse.openingPositions、带 ledgerSequence / actorRoles / applyRuleVersion / postings 的 ledgerState.eventLedger、timestamps 和 measurementFlags；重放后必须重新通过垂直、横向与非负余额检查。贷款利率形成留给 3.10，资产负债表反馈留给 3.11–3.15。',
  },
  {
    id: 'credit-versus-money', number: 3, label: 'Credit ≠ Money',
    title: '信用是跨期请求权；货币是满足特定发行人、持有人和工具口径的支付性负债，两者既相交也不等同。',
    paragraphs: [
      '供应商赊销、公司债、银行贷款和未提款承诺都属于广义信用关系，却不一定创造银行存款。反过来，银行从居民非银行购买一只既有证券并以新增存款支付，可以增加广义货币，却没有新增私人贷款。因此“贷款创造存款”是一类有资格条件的事件，而不是信用和货币存量的一比一恒等式。',
      '只有当合格发行机构取得资产，同时向所选 money-holding sector 发行被该统计口径纳入的负债时，本次事件才直接增加该口径的货币。持有人若是另一家银行、中央政府或非居民，结论可能改变；任何判断都必须回到当期方法文件。',
    ],
    sourceIds: [1, 3, 5, 16, 57],
    formula: { label: '资格门', expression: 'ΔM=Q only if issuerEligible ∧ instrumentIncluded ∧ holderEligible', note: '一般情况下 ΔCredit 不等于 ΔM。' },
  },
  {
    id: 'vertical-double-entry', number: 4, label: 'Vertical Double-entry',
    title: '垂直复式先保证每个主体自己的资产负债表配平；它不能独自证明对手方也正确入账。',
    paragraphs: [
      '银行向同一行客户实际提款 Q 时，银行增加贷款资产和存款负债；借款人增加存款资产和贷款负债。两张表各自满足资产变化等于负债与净值变化。只有审批或未提款额度时没有这组本金分录，因为贷款本金和可支用存款尚未生成。',
      '这种检查能立即暴露“银行只多了一项贷款资产”或“借款人白得现金”的叙事缺口。贷款本金本身不机械增加任何一方净值：银行取得未来偿付请求权并发行当前负债，借款人取得当前支付能力并承担未来偿付义务。',
    ],
    sourceIds: [1, 7],
    formula: { label: '最小提款分录', expression: 'Bank: +Loan asset, +Deposit liability; Borrower: +Deposit asset, +Loan liability', note: '冻结无费用、无首日损失准备和无第三方支付。' },
  },
  {
    id: 'horizontal-quadruple-entry', number: 5, label: 'Horizontal Quadruple-entry',
    title: '横向对应要求同一请求权在债权人与债务人账本中镜像；与垂直复式结合后形成四重记账。',
    paragraphs: [
      '银行的贷款资产必须对应借款人的贷款负债，借款人的存款资产必须对应银行的存款负债。四项记录不是四笔经济事件，而是同一双边交易在两个主体账本中的镜像；金额、工具分类或记录时点不一致时，聚合账户就会出现统计差异。',
      '四重记账迫使分析者保存 counterpartyPairId 和 instrumentPairId。只画银行 T-account 而忽略借款人，无法判断贷款是否用于购置资产、偿还旧债或留在账户；只看宏观存量又无法判断请求权究竟落在哪家法人。',
    ],
    sourceIds: [7],
    formula: { label: '横向不变量', expression: 'Bank.loanAsset = Borrower.loanLiability; Borrower.depositAsset = Bank.depositLiability', note: '任何缺项都触发 recordingMismatchFlag。' },
  },
  {
    id: 'financial-claim-passport', number: 6, label: 'Financial-claim Passport',
    title: '账户名称不能识别请求权；每项贷款、存款和准备金都需要一张可审计护照。',
    paragraphs: [
      '最小护照保存债权人和债务人的法律实体、居民身份与部门、币种、司法辖区、工具类别、合同本金、账面价值、应计利息、期限、担保、优先级、转让与赎回条件，以及是否进入所选货币口径。客户存款、银行准备金和代理行 nostro 都可能叫 deposit，却对应不同债务人和结算能力。',
      '同一贷款还可能同时有合同面值、摊余成本、扣除损失准备后的净账面额、监管暴露和统计名义价值。若把这些计量基础静默互换，就会把拨备当成还款、把汇率重估当成新放款，甚至在合并时重复计算同一请求权。',
    ],
    sourceIds: [5, 7, 12],
    formula: { label: '请求权对象', expression: 'Claim = parties + sector/residency + currency + contract + measurement + eligibility + clocks', note: '缺债务人、币种、持有人部门或计量基础时返回 unknown。' },
  },
  {
    id: 'two-tier-money', number: 7, label: 'Two-tier Money',
    title: '公众主要持有商业银行负债，银行之间通常以中央银行负债结算；两层货币可按面值连接，却不是同一请求权。',
    paragraphs: [
      '客户存款是商业银行对客户的负债；准备金是中央银行对合格账户持有者的负债。公众通常不能把准备金记入普通账户，银行也不能把准备金直接交给企业而让它继续保持准备金属性。跨行付款的终态是公众层存款换持有人，同时银行层准备金换持有人。',
      '现金是又一种形态：流通纸币通常是中央银行负债，而硬币制度可能不同。商业银行存款能够按面值转换并被普遍接受，依赖监管、存款保险、支付网络和中央银行结算共同支撑，但这不把全部商业银行负债升级为无条件央行货币。',
    ],
    sourceIds: [1, 2, 3, 4, 5, 8, 9],
    formula: { label: '两层结构', expression: 'public payment asset = deposit/currency; interbank settlement asset = reserves or authorised asset', note: '必须同时保存 issuerTier 与 eligibleHolderSet。' },
  },
  {
    id: 'monetary-base-versus-broad-money', number: 8, label: 'Monetary Base / Broad Money',
    title: '基础货币与广义货币读取不同发行人和持有人组合；它们的比率是结果，不是固定传动齿轮。',
    paragraphs: [
      '货币基础主要读取流通货币、其他存款类机构在中央银行的存款以及某些被纳入广义货币的央行负债；广义货币主要读取货币持有部门持有的合格存款类机构负债。准备金通常属于基础货币而不属于公众广义货币，客户存款通常相反。',
      'M1、M2、M3 或 M4 的名称不能跨法域直接比较；外币存款、定期工具、货币市场基金份额、政府和非居民持有量的处理可能不同。即使某时点 M/B=4，基础货币增加 100 也不意味着广义货币自动增加 400。',
    ],
    sourceIds: [5, 6, 14, 16, 57],
    formula: { label: '观察比率', expression: 'mₜ = BroadMoneyₜ / MonetaryBaseₜ', note: 'mₜ 是事后比率；没有行为限制就不是因果系数。' },
  },
  {
    id: 'entity-group-system-boundary', number: 9, label: 'Entity / Group / System',
    title: '单家银行、银行集团和存款类机构体系回答不同问题；合并抵销不能消除法律实体的支付约束。',
    paragraphs: [
      '单家银行视角保留客户存款、贷款、准备金和同业融资，用来判断该法人今天能否付款。集团合并抵销集团内往来，却仍受币种、法律实体和跨境可转移性限制。存款类机构体系再抵销体系内同业请求权，用来观察对其他部门的净头寸和货币负债。',
      'A 行放贷 100、存款随后流向 B 行时，A 留下贷款并失去准备金，B 取得准备金并承担存款。体系层面仍是贷款与存款各增 100，但这不能推出 A 不需要融资；A 的融资压力也不能反推体系放贷前必须收集等额旧存款。',
    ],
    sourceIds: [5, 7],
    formula: { label: '合并', expression: 'System position = Σ entity positions − intra-system reciprocal positions', note: '每个结论必须标 scope=solo、group 或 depository-system。' },
  },
  {
    id: 'transaction-revaluation-other-volume', number: 10, label: 'Transaction / Revaluation / Other Volume',
    title: '期末余额变化必须拆成交易、重估和其他数量变化；余额差本身不是新增信贷。',
    paragraphs: [
      '贷款提款和本金偿还是交易；外币贷款因汇率变化而改变本币报表价值是重估；核销、重分类和某些资产出现或消失属于其他数量变化。三者共同把期初存量桥接到期末，只有逐项分栏才能回答本期真正发生了多少融资。',
      '企业会计、监管报告与宏观统计还可能展示 gross loan、allowance、net carrying amount 或名义本金。研究若直接把 net loan 的变化命名为借款人还款，就会把损失估计、资产出售和核销混入同一因变量。',
    ],
    sourceIds: [5, 7, 36, 39],
    formula: { label: '存量—流量桥', expression: 'Closing = Opening + Transactions + Revaluations + OtherVolumeChanges', note: 'reconciliation residual 非零时必须暂停解释。' },
  },
  {
    id: 'balance-identity-not-causality', number: 11, label: 'Identity ≠ Causality',
    title: '会计恒等式约束结果必须配平，却不能单独决定谁先行动、银行为何放贷或下一期增长多少。',
    paragraphs: [
      '存款类机构调查可以把广义货币与净国外资产、对政府和私人部门的债权及其他净项目重排成恒等式。它保证每项货币负债都有对应项，却不能从等式本身识别贷款需求、银行风险偏好、央行操作或居民资产配置中的冲击。',
      '“贷款创造存款”也不意味着贷款存量永远等于存款存量。证券买卖、长期债务与股本融资、政府和国外部门交易、现金转换、应计、偿还与核销都会改变两者差额；从配平关系跳到单向因果，需要额外行为模型与可识别变动。',
    ],
    sourceIds: [1, 3, 5, 6, 7, 14, 16, 46, 47, 48, 57],
    formula: { label: '识别门', expression: 'identity + behavioural restrictions + exogenous variation → causal estimand', note: '只有 identity 时，方向仍未识别。' },
    after: <MoneyPassportLab />,
  },
  {
    id: 'credit-lifecycle-event-clock', number: 12, label: 'Credit Lifecycle',
    title: '审批、承诺、提款、付款和结算不是“银行放贷”的同义词，而是可以中断或跨日的状态转换。',
    paragraphs: [
      '审批是内部决定，承诺是在条款满足时提供资金的合同义务，提款才把全部或部分额度转成表内贷款。资金随后可以进入借款人账户，也可直接支付第三方；支付指令进入清算后，还要到达不可撤销且最终清偿的结算点。',
      '服务期内又要分开本金、利息、费用、修改和再融资；信用恶化时分开逾期、违约、ECL、拨备与核销。任何阶段都可能取消、失败或延迟，因此生命周期是一张带资格条件的状态机，而不是每笔贷款必然走完的直线。',
    ],
    sourceIds: [8, 32, 33, 34, 36, 39],
    formula: { label: '事件链', expression: 'approved → committed → drawn → paid → cleared → final-settled → serviced', note: '允许 cancelled、modified、refinanced、past-due、defaulted 与 written-off 分支。' },
  },
  {
    id: 'on-us-loan-drawdown', number: 13, label: 'On-us Drawdown',
    title: '提款先记入借款人在同一家银行的账户时，贷款资产与可支用存款负债在同一事件中生成。',
    paragraphs: [
      '实际提款 Q 让银行取得对借款人的贷款债权，同时让借款人取得对银行的存款债权。银行资产和负债各扩大 Q，借款人资产和负债也各扩大 Q；在最小模型中，准备金、现金和资本没有自动变化。',
      '这笔存款不是从另一名储户的账户搬来，但贷款也没有创造资本、抵押品或可信需求。提款后更大的资产、负债和风险暴露会进入既有约束栈；本节只证明交易分录，不证明银行愿意以任何价格无限放贷。',
    ],
    sourceIds: [1, 3],
    formula: { label: '同行提款', expression: 'Bank: Loan +Q | Deposit +Q; Borrower: Deposit +Q | Loan payable +Q', note: '准备金与银行权益在该最小事件中为 0 变化。' },
  },
  {
    id: 'direct-third-party-disbursement', number: 14, label: 'Direct Third-party Payment',
    title: '贷款可以直接支付卖方；货币创造不要求借款人的账户曾短暂出现等额余额。',
    paragraphs: [
      '若借款人在 A 行借款 100 并直接购买本行客户的资产，A 行可增加贷款资产 100 和卖方存款 100；借款人取得实物或金融资产并承担贷款，卖方交付资产并取得存款。融资与购买同时执行，但仍应保存两个事件身份。',
      '若卖方在 B 行，终态可以是 A 行贷款 +100、准备金 −100，B 行准备金 +100、卖方存款 +100。体系仍新增贷款与存款各 100，而 A 行未必曾承担借款人存款；这说明贷款资产和新存款可以位于不同银行。',
    ],
    sourceIds: [1, 3, 7, 8],
    formula: { label: '直接跨行终态', expression: 'A: Loan +Q, Reserve −Q; B: Reserve +Q, Seller deposit +Q', note: '必须分开 fundingTransactionId 与 purchasePaymentId。' },
  },
  {
    id: 'overdraft-revolving-draw', number: 15, label: 'Overdraft / Revolver',
    title: '透支与循环额度把提款嵌入支付过程；已用余额是贷款，未用额度仍只是承诺。',
    paragraphs: [
      '若客户额度上限为 U、原存款为 D、付款为 Q 且 Q>D，冻结模型中的新增透支为 Q−D。原存款先被用尽，超出部分形成贷款；可用额度随之下降，但没有被使用的额度不会自动变成贷款资产或广义货币。',
      '同行付款时，收款人存款增加 Q，付款人存款减少 D，银行新增贷款 Q−D，因此总存款净增加新增信用额。跨行付款还需要准备金结算；手续费、免息期、撤销权和最低还款规则则必须读取具体合同。',
    ],
    sourceIds: [1, 3, 5, 34, 36],
    formula: { label: '额度使用', expression: 'NewDraw=max(0,Q−D); Unused=U−Outstanding−NewDraw', note: 'approvedLimit、committedLimit、drawnBalance 与 availableLimit 必须分栏。' },
  },
  {
    id: 'fee-discount-and-accrual', number: 16, label: 'Fee / Discount / Accrual',
    title: '合同本金、实际支付和初始账面价值可以不同；手续费、折价与应计不能塞进一个“贷款增加额”。',
    paragraphs: [
      '合同本金 100、属于实际利率组成部分的发起费 2 时，借款人可能只收到 98。冻结的摊余成本示例把初始账面金额和支付额记为 98，合同面值 100 另存，差额随后沿实际利率法进入利息收入；若费用对应独立服务或资产采用另一计量类别，分录会不同。',
      '利息应计是在时间经过时确认收入与债权，不等同现金到账。银行确认应计利息 I 时，相关资产增加并确认利息收入，使税前利润增加；在明确忽略所得税及其他同步分录的冻结例中，权益也随利润增加。借款人同时确认费用和应付款；除非合同另行资本化或新增提款，这一步不会给借款人创造可支用存款。',
    ],
    sourceIds: [1, 3, 5, 7, 34, 36, 37],
    formula: { label: '冻结例', expression: 'Contract principal 100; integral fee 2; initial carrying amount/cash 98', note: '合同额、现金额、账面额和后续应计分别保存。' },
    after: <CreditLifecycleLab />,
  },
  {
    id: 'on-us-deposit-payment', number: 17, label: 'On-us Deposit Payment',
    title: '同一家银行内部付款不改该行总存款和准备金；广义货币是否不变还要经过双方持有人资格门。',
    paragraphs: [
      'A 客户向同一银行的 B 客户支付 Q，银行把付款人存款减少 Q、收款人存款增加 Q；该行存款负债总额不变，也无需跨行交付准备金。可是统计货币量要分别判断两名持有人：若双方在冻结 methodology vintage 下都属于同一纳入状态，ΔM 才为零；居民货币持有人向同一行内被排除的中央政府或非居民账户付款时，银行总存款仍不变，冻结广义货币却减少 Q。',
      '若付款使用刚取得的贷款，应该先记录贷款提款，再记录同行存款转移。只有收款人仍是同一口径的合格 money holder，合并终态才只是把新增存款换持有人；若任一方资格未知，就停止输出 ΔM 并回查发行人、持有人、工具和方法版本，不能让“同行”替代统计边界。',
    ],
    sourceIds: [1, 3, 5],
    formula: { label: '同行付款', expression: 'ΔBank deposits=0; ΔBank reserves=0; ΔM=Q×(Ipayee−Ipayer)', note: 'I=1 表示该持有人存款纳入口径，I=0 表示排除；任一 I 未知则 ΔM=null。付款不是贷款本金偿还。' },
  },
  {
    id: 'interbank-deposit-payment', number: 18, label: 'Interbank Deposit Payment',
    title: '跨行付款同时迁移公众存款与银行准备金；原贷款债权不会随付款自动转给收款行。',
    paragraphs: [
      'A 行客户向 B 行客户支付 Q，最终结算后 A 行客户存款负债和 A 行准备金资产各减少 Q，B 行准备金资产与收款人存款负债各增加 Q。两家银行分别配平，银行体系准备金总量和公众存款总量在纯支付事件中都不变。',
      '若付款来自 A 行新贷款，A 行最终留下贷款资产并承受准备金流出，B 行留下准备金和存款。贷款并不会因为支付发生而迁移到 B；A 随后可能通过存款定价、同业借款、资产出售或央行便利补充融资。',
    ],
    sourceIds: [1, 3, 8, 9, 10, 11],
    formula: { label: '跨行终态', expression: 'A: Deposit −Q, Reserve −Q; B: Reserve +Q, Deposit +Q', note: 'ΣΔReserves=0 与 ΣΔDeposits=0 只属于这笔纯支付事件。' },
  },
  {
    id: 'clearing-netting-settlement-finality', number: 19, label: 'Clearing / Netting / Finality',
    title: '支付指令、清算、净额和最终结算是不同法律与操作状态；净额压缩结算义务，却不删除客户交易。',
    paragraphs: [
      '支付报文先表达转账指令，清算负责验证、匹配并计算义务，结算则在指定资产上清偿这些义务。最终性回答从何时起转移不可撤销且不会因参与者失败被追索；具体答案取决于系统规则、适用法律和服务时钟。',
      '若 A→B 为 100、B→A 为 70，客户总额交易是 170，但双边净额只要求 A 向 B 结算 30，名义结算义务压缩 140。这个 140 不是可脱离系统结构宣称的“实际流动性节省”：所需峰值流动性还取决于支付时序、队列规则、日内信用和预置资金；也不能用净额 30 改写两笔客户付款的经济记录。',
    ],
    sourceIds: [8, 9, 10, 11],
    formula: { label: '净额', expression: 'Gross obligations=100+70=170; Net A→B=100−70=30; nominal obligation reduction=140', note: '实际流动性需求取决于时序、队列、日内信用与预置资金；gross transactions 仍全部保留。' },
  },
  {
    id: 'reserve-migration-distribution', number: 20, label: 'Reserve Migration',
    title: '私人跨行支付通常重分配准备金而不改变体系总量；分布和总量必须分成两张表。',
    paragraphs: [
      'A 行准备金减少、B 行准备金增加时，中央银行负债总额可以完全不变。体系总量主要由央行资产负债表操作、现金转换和政府账户等事件改变；银行间客户支付决定的是现有准备金落在哪家机构。',
      '这种区分解决一个常见表面矛盾：体系“准备金充裕”与个别银行临时缺准备金可以同时成立。付款行无法用体系平均值结算自己的到期义务；它需要可转移准备金、合格抵押品、信用额度或足够时间完成融资。',
    ],
    sourceIds: [1, 5, 9, 13, 18],
    formula: { label: '分布不变量', expression: 'Private interbank payment: ΔR_A=−Q, ΔR_B=+Q, ΔR_system=0', note: '总量为零变化不等于每家银行流动性不变。' },
  },
  {
    id: 'private-payment-reserve-invariant', number: 21, label: 'Private-payment Invariant',
    title: '在冻结的纯私人支付中，准备金只换持有人；税收、现金和央行交易则会打破这条条件不变量。',
    paragraphs: [
      '要使用“体系准备金不变”这句话，必须同时冻结：付款和收款都通过准备金账户合格的银行完成、中央银行不提供或回收额外信用、政府央行账户不参与、公众不转换现金，也没有跨币种结算。满足这些条件时，央行只是把同一负债从 A 行重记到 B 行。',
      '一旦税款转入中央银行政府账户、政府支出、央行买卖资产、银行借还央行贷款或公众提取现金，准备金总量就可能改变。因此它不是关于所有支付的普遍定律，而是一条可由事件类型和账户对手方验证的局部不变量。',
    ],
    sourceIds: [5, 8, 9, 22, 24],
    formula: { label: '资格条件', expression: 'pure private payment ∧ same currency ∧ no CB/fiscal/cash event ⇒ ΔRsystem=0', note: '任一条件失败时重新画中央银行账本。' },
  },
  {
    id: 'funding-after-payment-outflow', number: 22, label: 'Funding After Outflow',
    title: '贷款可以先生成存款，付款行仍必须为随后流出的准备金融资；“事后融资”不等于融资不重要。',
    paragraphs: [
      '同行提款本身不要求准备金逐笔先到位，但借款人跨行付款会使发放行承担结算流出。银行可用原有准备金、吸收或留住存款、同业借款、回购、出售资产、发行长期负债，或在合资格时向中央银行借款；每种来源的成本、期限、抵押和稳定性不同。',
      '因此银行不是把预先收集的一笔特定存款原封不动转贷，也不是可以忽略负债结构。它在资产定价时会预期存款留存率、批发融资成本、抵押品占用和监管比率；结算后的资金缺口会反馈到贷款报价和未来信用供给。',
    ],
    sourceIds: [1, 3, 13, 18, 19, 20, 21],
    formula: { label: '结算缺口', expression: 'FundingGap=max(0, netSettlementOutflow−availableSettlementAssets)', note: '缺口为零不表示长期稳定融资与资本约束也通过。' },
    boundary: '本节描述融资渠道，不估计各渠道供给弹性；贷款利率和银行反应函数由 3.10 接手。',
  },
  {
    id: 'deposit-currency-conversion', number: 23, label: 'Deposit / Currency Conversion',
    title: '客户提取现金把商业银行存款换成公众持有的央行货币；广义货币是否改变取决于统计口径。',
    paragraphs: [
      '客户从银行提取 Q 现金时，银行存款负债减少 Q，银行库存现金或准备金相关资产减少 Q，公众持有的流通货币增加 Q。银行体系的负债结构和结算流动性改变，但公众并没有因为转换本身多出净金融资产。',
      '若所选广义货币同时纳入公众现金和该存款，M 可能只换组成而总量不变；若工具、持有人或币种处理不同，结果要按方法文件重算。把提款现金简单称为“货币被销毁”或“央行增发”都会漏掉转换的另一侧。',
    ],
    sourceIds: [2, 4, 5, 14, 16],
    formula: { label: '冻结口径', expression: 'Deposit −Q; public currency +Q; ΔM=0 if both components included', note: '同时记录银行准备金或库存现金的具体结算路径。' },
  },
  {
    id: 'foreign-currency-correspondent-settlement', number: 24, label: 'FX / Correspondent Settlement',
    title: '外币客户存款、代理行 nostro 与本国准备金是三种请求权；跨境报文不等于两条货币腿已经最终结算。',
    paragraphs: [
      '一家本国银行为客户记录美元存款，并不意味着它在本国央行持有“美元准备金”。银行可能通过美国代理行账户、分支机构、清算系统或其他中介完成美元腿；每一层都有独立债务人、时区、法律和最终性安排。',
      '跨币种付款还要分开外汇成交、付款报文、两种货币的资金可用性、代理账户更新和最终结算。若两条腿不同时最终，银行会暴露 principal risk；只有明确使用何种支付对支付机制及其规则，才能判断风险何时消失。',
    ],
    sourceIds: [8, 9, 10, 11, 12],
    formula: { label: '双腿状态', expression: 'FX payment = currency-leg A status + currency-leg B status + linkage/finality rule', note: '不得把 SWIFT 等报文传输本身写成资金结算。' },
    after: <PaymentSettlementLab />,
  },
  {
    id: 'on-us-principal-repayment', number: 25, label: 'On-us Principal Repayment',
    title: '借款人用本行存款偿还本金时，贷款资产与存款负债同时消失；这与支付利息不同。',
    paragraphs: [
      '本金偿还 Q 使银行贷款资产减少 Q、客户存款负债减少 Q；借款人的存款资产和贷款负债也各减少 Q。冻结模型中，银行权益和准备金不变，广义货币因合格存款注销而减少 Q。',
      '这正是同行提款分录的逆事件，但只逆转已经偿还的本金。若借款人出售资产、借新还旧或由第三方付款，资金来源本身另有分录；不能从贷款余额下降单独认定经济部门已经去杠杆。',
    ],
    sourceIds: [1, 3, 5],
    formula: { label: '同行本金偿还', expression: 'Loan asset −Q; Deposit liability −Q; Bank equity 0; Reserves 0', note: '利息、费用和损失不进入这组本金分录。' },
  },
  {
    id: 'cross-bank-principal-repayment', number: 26, label: 'Cross-bank Repayment',
    title: '借款人从另一家银行付款偿还本金时，存款和准备金先跨行迁移，贷款才在债权行注销。',
    paragraphs: [
      'B 行客户向持有贷款的 A 行偿还 Q：B 行减少客户存款和准备金，A 行增加准备金并减少贷款资产。A 行不必新增客户存款；体系贷款与居民存款各减少 Q，体系准备金总量在纯私人支付条件下不变。',
      '若 A 行把到账资金先记入过渡账户、存在结算时间差或付款中含利息，事件账本应分别记录。把跨行还款简化为“A 行贷款和 A 行存款同时下降”会虚构一个原本不存在的存款负债。',
    ],
    sourceIds: [1, 5, 8, 9, 10],
    formula: { label: '跨行本金终态', expression: 'B: Deposit −Q, Reserve −Q; A: Reserve +Q, Loan −Q', note: '体系 ΔLoan=−Q、ΔDeposit=−Q、ΔReserve=0。' },
  },
  {
    id: 'interest-accrual-and-payment', number: 27, label: 'Interest Accrual / Payment',
    title: '利息应计改变收入、费用与应收应付；实际付款只清偿已存在的债权，不能重复确认利润。',
    paragraphs: [
      '应计 I 时，银行增加应计利息或贷款账面额并确认收入，借款人确认利息费用和应付款。若随后用本行存款支付，银行存款负债与应计利息资产各减少 I；付款时权益不再增加，因为收入已在应计阶段确认。',
      '若利息未事先应计、采用现金制展示、发生利息资本化或合同现金流被修改，分录时点会不同。研究必须同时保存 accrual event 和 cash event，避免把存款下降全部误作本金偿还。',
    ],
    sourceIds: [5, 7, 36, 37],
    formula: { label: '两阶段', expression: 'Accrual: InterestReceivable +I, Equity +I; Payment: Deposit −I, Receivable −I', note: '税、信用损失和非应计状态另行处理。' },
  },
  {
    id: 'refinancing-gross-versus-net', number: 28, label: 'Refinancing: Gross / Net',
    title: '借新还旧可以带来很大的总融资流量却只有很小的净贷款变化；gross flow 与 net stock change必须并报。',
    paragraphs: [
      '同一窗口新发放 120、偿还旧本金 100 时，贷款存量净增 20。若两笔都在本行并以存款完成，存款净增也可为 20，但借款人的合同期限、利率和债权银行可能已经显著改变。只报告净额会看不见 120 的新承销和 100 的到期压力。',
      '若新贷款来自 B 行而旧贷款在 A 行，结算还会把准备金和资产负债表规模重新分布。再融资可能延长期限、释放或追加抵押、改变担保人，也可能只是掩盖无法用经营现金流偿债；账本本身不能判定经济质量。',
    ],
    sourceIds: [5, 7, 34, 36],
    formula: { label: '总额—净额', expression: 'Gross origination 120 − Gross repayment 100 = Net loan change +20', note: '必须保存两笔 eventId，不能只保存 +20。' },
  },
  {
    id: 'past-due-versus-default', number: 29, label: 'Past Due ≠ Default',
    title: '逾期是按合同日历计算的状态，违约是按会计或监管定义触发的信用事件；两者不能互作别名。',
    paragraphs: [
      'past due 通常从合同应付款未按时支付开始计日；default 可能综合天数、unlikely-to-pay 判断、重组、破产或其他规则触发。不同会计、监管和内部风险框架拥有不同定义与 cure 条件，同一暴露可以先逾期后违约，也可能在未达到统一天数前因无力偿付判断进入违约。',
      '这些标签影响利息确认、ECL、资本、催收和披露，却不会自动注销贷款或存款。事件记录至少要保留 missedPaymentAt、daysPastDue、defaultDefinitionId、defaultTriggeredAt、forbearance 和 cureStatus，禁止只存一个布尔 badLoan。',
    ],
    sourceIds: [32, 33, 34, 35, 36, 39],
    formula: { label: '状态分离', expression: 'pastDueStatus = contract clock; defaultStatus = rule-qualified credit event', note: '两者相关但不恒等。' },
  },
  {
    id: 'expected-credit-loss-allowance', number: 30, label: 'ECL / Allowance',
    title: '预期信用损失是对未来现金短缺的概率加权估计；在冻结的摊余成本贷款例中，拨备降低净账面额，并经减值损失影响利润与权益，却不是借款人的付款。',
    paragraphs: [
      'IFRS 9 对适用资产区分 12-month 与 lifetime ECL，并在信用风险显著增加时改变计量范围；美国 CECL 对适用摊余成本资产估计合同期预期损失，但不采用同一三阶段结构。两套框架都需要前瞻信息，却不能混成一个标签。',
      '冻结例只处理按摊余成本计量的贷款：gross loan=100、allowance 从 0 增至 8，则 net carrying amount 变为 92；确认 8 的减值损失，使税前利润减少 8，而存款和合同本金不变。在明确忽略当期税、递延税和其他同步分录的冻结例中，权益也减少 8。FVOCI 债务工具与贷款承诺的列报位置不同，不能照抄这组净贷款分录。PD×LGD×EAD 也只是简化教学算式；真实 ECL 还涉及现金短缺时点、情景、提前还款、折现和模型治理。',
    ],
    sourceIds: [5, 7, 32, 33, 36, 37, 38, 39, 40],
    formula: { label: '简化例', expression: 'Net loan = Gross loan − Allowance = 100−8=92', note: '拨备事件 ΔDeposit=0；会计框架与版本必须单独保存。' },
  },
  {
    id: 'writeoff-not-repayment', number: 31, label: 'Write-off ≠ Repayment',
    title: '核销移除无合理回收预期的账面额；它不是借款人归还本金，也不机械销毁存款。',
    paragraphs: [
      'gross loan=100、allowance=9 时核销 8，冻结分录把 gross 降至 92、allowance 降至 1，net loan 仍为 91；存款、准备金和新增损失都不变，因为此前拨备已经吸收了该金额。若只拨备 5 却核销 8，超出的 3 才形成额外损失。',
      '会计核销不必等于法律债权完全免除，后续追偿可能另行确认；具体取决于准则、法律和机构政策。在宏观存量—流量桥中，债权人单方面核销通常归入 other changes in volume；只有债权人与债务人双方同意的债务减免才可能记录为 transaction。两者都不能与正常本金偿还合并。',
    ],
    sourceIds: [5, 7, 32, 33, 36, 37, 39],
    formula: { label: '已覆盖核销', expression: 'Gross 100→92; Allowance 9→1; Net 91→91; Deposit 0', note: 'covered write-off 不在核销日重复打击权益。' },
  },
  {
    id: 'loan-repayment-sale-recourse', number: 32, label: 'Repayment / Sale / Recourse',
    title: '贷款从发起行报表减少，可能来自偿还、真实出售、担保融资或核销；只有请求权护照能区分。',
    paragraphs: [
      '借款人偿还会消灭本金请求权；符合终止确认条件的贷款出售把债权转给买方并带来现金或存款；未转移实质风险报酬的“出售”可能仍按有担保融资处理；核销则是账面移除。四条路径对借款人债务、存款、银行融资和风险承担完全不同。',
      '证券化名称也不能自动证明贷款离开银行风险边界。留存分层、回购义务、流动性支持、服务权和隐性支持可能保留信用或资本暴露；研究必须分别读取会计终止确认、监管暴露和经济风险转移。',
    ],
    sourceIds: [5, 7, 32, 33, 36, 37, 39, 55, 56],
    formula: { label: '分类门', expression: 'loan decline → repayment | derecognised sale | secured funding | write-off | revaluation', note: '先识别事件，再解释存量变化。' },
    after: <CreditLossEventLab />,
  },
  {
    id: 'bank-buys-security-from-nonbank', number: 33, label: 'Bank Buys Security',
    title: '银行从居民非银行购买既有证券并以新增存款支付，可以创造广义货币而不新增贷款。',
    paragraphs: [
      '银行按 Q 买入居民非银行持有的证券，资产端证券增加 Q，负债端卖方存款增加 Q；卖方把证券资产换成存款资产。冻结口径若该卖方属于 money-holding sector，则广义货币增加 Q，央行准备金总量不因该同行交易自动改变。',
      '这进一步说明货币创造取决于银行是否向合格持有人发行合格负债，而不取决于银行资产一定叫贷款。若交易通过另一家结算银行，准备金会在银行间迁移，但体系层的新增存款仍取决于最终经济卖方。',
    ],
    sourceIds: [1, 3, 5, 16],
    formula: { label: '居民非银卖方', expression: 'Bank securities +Q; resident deposit +Q; ΔM=+Q; ΔB=0', note: '价格损益与后续资产配置是另行事件。' },
  },
  {
    id: 'bank-sells-security-to-nonbank', number: 34, label: 'Bank Sells Security',
    title: '居民非银行用既有存款向银行买券时，证券与存款同时退出银行账本，广义货币相应收缩。',
    paragraphs: [
      '交易价 Q 等于冻结账面价时，银行证券资产减少 Q、买方存款负债减少 Q；居民把存款换成证券。银行规模缩小而权益不变，广义货币在所选口径下减少 Q，准备金总量不因同行成交改变。',
      '若买方先向银行借款再购券，必须把贷款—存款创造与证券购买串成两笔事件，净货币结果可能不同；若证券售价偏离账面价值，还会出现实现损益并影响权益。不能仅凭“银行卖券”四个字确定 ΔM。',
    ],
    sourceIds: [1, 5, 7],
    formula: { label: '既有存款购买', expression: 'Bank securities −Q; resident deposit −Q; ΔM=−Q; ΔB=0', note: '冻结无损益、同行结算和无新信用。' },
  },
  {
    id: 'interbank-securities-trade', number: 35, label: 'Interbank Securities Trade',
    title: '银行之间买卖证券主要交换证券与准备金或同业债权；它不直接发行公众广义货币。',
    paragraphs: [
      'A 行向 B 行买券 Q 并以准备金结算，A 的证券增加、准备金减少，B 则相反；银行体系证券和准备金总量在纯内部交易中都不变，只改变分布。因为双方都是银行，公众存款并未直接增减。',
      '若交易通过回购、中央对手方或延期结算，法律所有权、抵押品和融资性质会变化；必须按合同识别 outright sale 与 secured financing。将所有银行间证券交易写成“央行投放”会把交易对手和结算资产弄错。',
    ],
    sourceIds: [5, 8, 9, 26],
    formula: { label: '银行间现券', expression: 'Buyer: Security +Q, Reserve −Q; Seller: Reserve +Q, Security −Q', note: 'ΔM=0，体系资产只重分布。' },
  },
  {
    id: 'bank-issues-bond-or-equity', number: 36, label: 'Bank Bond / Equity Issuance',
    title: '银行向居民非银行发行长期债务或股本并收取既有存款，会改变融资与资本结构，但可减少广义货币。',
    paragraphs: [
      '居民用本行存款 Q 认购银行债券时，银行存款负债减少 Q、长期债务增加 Q；总负债不变但期限更稳定，广义货币若不含该债券则减少 Q。认购新股时，存款减少而股本增加，银行资本上升；投资者只是把货币性资产换成风险证券。',
      '若投资者在另一家银行付款，发行行还会收到准备金；若合格短期银行债务本身进入当地广义货币口径，统计结果也可能不同。债券融资、股权融资和吸收存款都不是“先找到同一笔钱再放贷”的同一种动作。',
    ],
    sourceIds: [5, 16, 26, 27, 30],
    formula: { label: '本行认购', expression: 'Bond: Deposit −Q, long debt +Q; Equity: Deposit −Q, equity +Q', note: '货币资格、付款行和发行成本必须另存。' },
  },
  {
    id: 'tax-to-central-bank-government-account', number: 37, label: 'Tax → Central-bank Government Account',
    title: '税款进入中央银行政府账户时，居民存款与银行准备金下降，政府央行存款上升。',
    paragraphs: [
      '冻结政府账户位于央行且排除于广义货币：居民纳税 Q 后，付款银行减少客户存款和准备金，中央银行减少银行准备金负债并增加政府存款负债。广义货币与货币基础在该定义下各减少 Q。',
      '这是一条账户路径，不是对税收总需求效应或财政乘数的估计。若政府账户位于商业银行、纳税人为非居民，或货币基础定义包含相应政府存款，分录和统计结果必须重算。',
    ],
    sourceIds: [5, 22, 24, 25],
    formula: { label: '冻结 TGA 路径', expression: 'Tax Q: ΔM=−Q; ΔB=−Q; government CB deposit +Q', note: 'accountLocation 是必要制度开关。' },
  },
  {
    id: 'government-spending-from-central-bank-account', number: 38, label: 'Government Spending',
    title: '政府从央行账户向居民支出时，银行准备金与收款人存款同时增加，是税款路径的反向转换。',
    paragraphs: [
      '政府支付 Q 给居民 money holder，央行减少政府存款并增加收款银行准备金，商业银行同时增加居民存款。冻结口径下广义货币与货币基础各增加 Q；银行只是把新增结算资产与新增客户负债成对记录。',
      '支出是否由当期税收、发债或既有余额融资，是另一层预算与时间窗口问题。单笔支出分录不能证明“政府支出无需约束”，也不能识别对产出、通胀或利率的因果效应。',
    ],
    sourceIds: [5, 22, 23, 24, 25],
    formula: { label: '冻结 TGA 支出', expression: 'Spending Q: ΔM=+Q; ΔB=+Q; government CB deposit −Q', note: '收款人居民身份和货币资格必须通过。' },
  },
  {
    id: 'government-debt-issuance', number: 39, label: 'Government Debt Issuance',
    title: '国债发行的货币影响取决于买方和政府账户位置；发债与随后支出必须保留为两笔事件。',
    paragraphs: [
      '居民非银行用存款购买新国债并向央行政府账户付款时，存款与准备金各减少 Q，政府央行存款增加 Q；银行直接认购时，主要是银行准备金换政府证券，居民广义货币不直接变化。两种路径的政府融资额相同，货币持有人却不同。',
      '政府随后向居民支出 Q 会把政府央行存款转回准备金和居民存款。若把发债与支出放在同一窗口净额化，可能看到 M 与 B 回到原位，却不能删除中间融资、证券持有和日内流动性变化。',
    ],
    sourceIds: [5, 22, 23, 24, 25],
    formula: { label: '买方开关', expression: 'Nonbank buyer: ΔM=−Q, ΔB=−Q; Bank buyer: ΔM=0, ΔB=−Q', note: '后续居民支出再分别带来 +Q 与 +Q。' },
  },
  {
    id: 'central-bank-purchase-from-resident-nonbank', number: 40, label: 'Central-bank Purchase: Non-bank',
    title: '央行从居民非银行最终卖方买券时，准备金和居民存款通常同步增加；名义交易商不改变最终部门归属。',
    paragraphs: [
      '央行以 Q 买入居民非银行持有的证券，央行增加证券资产和准备金负债；结算银行增加准备金资产与卖方存款负债；卖方以证券换存款。在冻结货币定义下，货币基础与广义货币各增加 Q。',
      '交易可能由一级交易商代理，但统计判断要穿透到最终经济卖方。若卖方随后购买别的资产，存款只换持有人；若偿还银行贷款，贷款与存款会在新的事件中收缩。央行购买本身不能预先决定后续组合再平衡。',
    ],
    sourceIds: [1, 3, 5, 20, 22],
    formula: { label: '居民非银卖方', expression: 'CB security +Q / reserves +Q; Bank reserves +Q / resident deposit +Q; ΔB=ΔM=+Q', note: '无冲销且卖方属于冻结 money-holding sector。' },
  },
  {
    id: 'central-bank-purchase-from-bank-or-nonresident', number: 41, label: 'Seller-sector Switch',
    title: '央行买券金额相同，银行卖方与非居民卖方也可能只增加基础货币，而不直接增加居民广义货币。',
    paragraphs: [
      '若卖方是银行，银行只把证券资产换成准备金资产，央行准备金负债增加而居民存款不变，因此冻结口径是 ΔB=+Q、ΔM=0。若最终卖方是非居民，结算可能形成非居民存款或代理行负债；该负债通常不进入居民广义货币，但必须按当地方法确认。',
      '所以“央行买券创造货币”至少要说清楚哪一层货币、由谁持有，以及是否有冲销或后续交易。把央行资产端增长机械乘成居民 M，会忽略卖方部门、托管链和统计居民性。',
    ],
    sourceIds: [1, 3, 5, 14, 16, 20],
    formula: { label: '卖方开关', expression: 'Bank seller: ΔB=+Q, ΔM=0; Nonresident seller: ΔB=+Q, resident ΔM usually 0', note: '“通常”必须由具体方法文件和账户链确认。' },
  },
  {
    id: 'central-bank-loan-to-bank', number: 42, label: 'Central-bank Loan',
    title: '央行向银行放款会同时增加准备金与央行借款；它提供结算流动性，却不会直接创造银行资本。',
    paragraphs: [
      '央行向合资格银行发放抵押贷款 Q，央行资产端贷款增加、负债端准备金增加；银行资产端准备金增加、负债端央行借款增加。银行权益与居民广义货币在这一最小事件中都不变。',
      '贷款能否获得取决于机构资格、法律文件、抵押品、估值、haircut、额度和操作准备。若银行已有真实损失导致负资本，新增有追索权借款只会同时扩张资产与负债，不能替代资本重组或处置。',
    ],
    sourceIds: [18, 19, 21, 44, 45],
    formula: { label: '央行信用', expression: 'Bank: Reserves +Q, CB borrowing +Q, Equity 0; ΔB=+Q, ΔM=0', note: '利率、抵押和资格是动态制度字段。' },
  },
  {
    id: 'maturity-runoff-and-qt', number: 43, label: 'Maturity Runoff / QT',
    title: '央行资产到期不续作怎样收缩负债，取决于债务人、政府账户和再融资路径；“QT”不是一笔固定分录。',
    paragraphs: [
      '若央行持有国债到期，由政府央行账户偿付，央行证券资产和政府存款负债同时减少，准备金可以暂时不变；但政府此前通过税收或发债补充该账户时，准备金已经在上游被吸收。若央行持有的银行贷款到期偿还，则银行准备金与对央行负债直接下降。',
      '主动出售证券又要看买方：居民非银行用存款购买时，存款和准备金都可能下降；银行购买则主要减少准备金。分析缩表必须追踪完整融资链和观察窗口，不能只由央行资产减少推出 M 一定按固定比例收缩。',
    ],
    sourceIds: [1, 3, 5, 20, 22, 23, 24, 25],
    formula: { label: '路径依赖', expression: 'ΔCB assets = −Q does not identify Δreserves or ΔM without payer/buyer and funding chain', note: '到期、主动出售与借款偿还分别标记。' },
    after: <FiscalCentralBankLab />,
  },
  {
    id: 'depository-corporations-survey-consolidation', number: 44, label: 'Depository Corporations Survey',
    title: '存款类机构调查通过抵销体系内头寸观察对其他部门的债权与货币负债；合并规则本身就是测量模型。',
    paragraphs: [
      '中央银行调查与其他存款类机构调查合并时，体系内准备金、央行对银行贷款和同业存款等相互请求权被抵销；剩下的是对中央政府、其他居民部门和非居民的净或总头寸，以及对货币持有部门发行的合格负债。',
      '抵销要求双方工具、金额、币种和时点匹配。若一个数据源把某机构归入存款类机构而另一个仍归非银，或两边采用不同计价日，合并会产生残差。调查结果适合宏观对应项分析，却不能回答单家银行今日的结算头寸。',
    ],
    sourceIds: [5, 6, 7, 55],
    formula: { label: '调查合并', expression: 'DCS = CentralBankSurvey + ODCS − reciprocal intra-DC claims', note: '机构清单和 methodology vintage 是必备输入。' },
  },
  {
    id: 'endogenous-money', number: 45, label: 'Endogenous Money',
    title: '货币“内生”是说存款可由合格交易在体系内部生成并随行为反应变化，不是说银行不受价格与数量约束。',
    paragraphs: [
      '银行批准并提款贷款、或向居民非银行购买资产时，可以同步发行存款，不必等待中央银行先按固定倍数投放准备金。随后产生的支付与融资需求由银行在货币市场、存款市场和央行实施框架中管理；央行通常以自己的操作目标供应或吸收结算余额。',
      '但“内生”没有删除合格借款需求、预期收益、资本、杠杆、流动性、稳定融资、集中度、风险管理和货币政策价格。它描述体系变量由相互反应共同决定，而不是赋予单家银行无限制创造真实资源或净值的能力。',
    ],
    sourceIds: [1, 3, 13, 46, 47, 48, 49, 50],
    formula: { label: '反应系统', expression: 'Credit, deposits, reserves and rates are jointly determined under behavioural and institutional constraints', note: '会计可行不等于经济上愿意或监管上允许。' },
  },
  {
    id: 'money-multiplier-boundary', number: 46, label: 'Money-multiplier Boundary',
    title: 'M/B 可以作为事后描述比率；只有在强行为假设下，它才可能近似一个稳定乘数。',
    paragraphs: [
      '教科书乘数把现金—存款偏好、银行超额准备金、准备金规则、贷款需求和资产选择压缩成固定系数。现实中这些行为会随利率、风险、支付技术和央行操作框架变化；资产购买的卖方部门也会让同一 ΔB 对 ΔM 产生不同即时结果。',
      '合成例中 B 从 100 增至 200，M 从 500 增至 520，M/B 从 5 降至 2.6，下降 48%，而 M 本身仍增长 4%。比率下降不能被命名为货币收缩，也不能用初始 5 倍断言 M 必须增至 1,000。',
    ],
    sourceIds: [1, 14, 15, 17, 18, 46, 47, 48],
    formula: { label: '合成复算', expression: 'm₀=500/100=5; m₁=520/200=2.6; m₁/m₀−1=−48%', note: '同时 ΔM/M=+4%；比率与分子增速回答不同问题。' },
  },
  {
    id: 'reserve-requirements-and-operating-framework', number: 47, label: 'Reserve Rules / Operating Framework',
    title: '法定准备金、准备金需求和央行供给机制必须分开；不同实施框架不存在一条全球固定贷款上限公式。',
    paragraphs: [
      '法定准备金是法域对特定负债基数设定的规则，准备金需求还来自支付、流动性管理和利率套利；央行则通过付息、公开市场操作、贷款便利或数量安排实施政策。准备金率为零不意味着贷款无限，正准备金率也不等于银行逐笔先储备再放贷。',
      '截至本章访问日，美国交易账户准备金率仍需从联储当前规则页读取，欧元区最低准备金及其计息和维持期则由 ECB 规则决定。任何数字都要附法域、生效日、负债基数和操作框架，不能把一个制度的参数移植成通用经济定律。',
    ],
    sourceIds: [1, 14, 15, 17, 18, 20, 21, 46, 47, 48, 53, 54],
    formula: { label: '三层护照', expression: 'reserveRequirementRule ≠ reserveDemand ≠ centralBankSupply/implementation', note: '三者分别记录，才可解释准备金与贷款关系。' },
    after: <MoneyMultiplierLab />,
  },
  {
    id: 'eligible-credit-demand-and-underwriting', number: 48, label: 'Eligible Demand / Underwriting',
    title: '银行能记账不等于存在可融资项目；第一道行为门是借款意愿、偿付能力与合同可执行性。',
    paragraphs: [
      '借款需求取决于投资机会、现金流、资产价格、预期销售和贷款条件；银行再评估身份、用途、收入、抵押、担保、相关暴露与欺诈风险。额度审批是对未来条件性提款的承诺，不是把所有申请金额直接变成贷款。',
      '监督和信息生产之所以重要，是因为贷款质量不能只由当期抵押价格或历史违约率充分观察。银行资本也会影响其承担监督成本和吸收意外损失的能力；这些经济机制与监管 CET1 是相关但不同的对象。',
    ],
    sourceIds: [34, 49, 50],
    formula: { label: '资格门', expression: 'eligibleAcceptedDemand = requestedAmount × identity/use/cash-flow/collateral/legal/risk gates', note: '任一关键字段 unknown 时不能输出确定可提款量。' },
  },
  {
    id: 'expected-net-return-and-funding-mix', number: 49, label: 'Expected Net Return',
    title: '贷款利差必须覆盖预期损失、运营、资本和融资成本；负债可以事后形成，不代表其价格与期限无关。',
    paragraphs: [
      '银行比较合同利息与费用的预期现值，扣除资金转移定价、信用损失、运营成本、资本占用、流动性成本和期权价值。客户存款可能低成本但会流出，批发融资更可集中取得却可能短期且顺周期，长期债务稳定但通常更贵。',
      '因此同一会计分录在不同市场状态下可能从有利可图变成不可接受。预期净收益不是观察到的会计息差，也不是单一 funding rate；3.10 会把政策曲线、信用风险、竞争和期限传导接入具体贷款报价。',
    ],
    sourceIds: [1, 3, 46, 48, 49, 50],
    formula: { label: '概念净收益', expression: 'ExpectedNetReturn = contract cash flows − expected loss − operating − funding − liquidity − capital/option costs', note: '各项必须期限和情景一致，不能把比率直接相加。' },
  },
  {
    id: 'risk-weighted-capital-constraint', number: 50, label: 'Risk-weighted Capital',
    title: '风险加权资本把损失吸收资源与按规则加权的暴露比较；国际最低标准不自动等于本地合规结论。',
    paragraphs: [
      'Basel Framework 的国际最低层包括 CET1、Tier 1 和总资本比率，并叠加资本留存、逆周期、系统重要性、Pillar 2 及管理缓冲；各法域还要转置、确定适用主体和过渡安排。Basel 委员会本身不制定超国家直接法律。',
      '合成银行 CET1=9、Tier1=10、RWA=180 时，比率分别为 5% 和 5.556%。若新增风险权重 100%、RWA 增加 100 的贷款，并刻意冻结资本分子及其他 RWA，CET1 降至 9/280=3.214%；现实还要加入拨备、利润、担保与实际权重。',
    ],
    sourceIds: [26, 27, 34, 35, 51, 52],
    formula: { label: '合成分母冲击', expression: 'CET1 ratio=9/180=5%; frozen-numerator expansion=9/(180+100)=3.214%', note: '只隔离分母机制，不判定任何真实银行合规。' },
  },
  {
    id: 'leverage-ratio-backstop', number: 51, label: 'Leverage Ratio',
    title: '杠杆率用非风险加权暴露限制总规模，防止极低风险权重把资本约束压成零。',
    paragraphs: [
      'Basel 杠杆率以 Tier 1 capital 除以规则定义的 exposure measure；分母不仅是会计资产，还包括衍生品、证券融资交易和表外项目。它是风险加权资本的后备约束，不是对所有分母项目风险相同的经济判断。',
      '合成银行 Tier1=10、exposure measure=400 时，杠杆率为 2.5%，低于所引用 Basel 国际最低 3%。一组低风险权重资产可能先触发杠杆率，高风险贷款组合可能先触发 RWA 资本；可行域取决于哪一把尺子的余量最先耗尽。',
    ],
    sourceIds: [26, 27, 51],
    formula: { label: '合成比率', expression: 'Basel leverage ratio = Tier1 / ExposureMeasure = 10/400 = 2.5%', note: '分母不得用未经规则调整的 accounting assets 偷换。' },
  },
  {
    id: 'payment-liquidity-and-lcr', number: 52, label: 'Payment Liquidity / LCR',
    title: '今天能否完成支付与未来三十日能否承受标准化压力流出，是相连却不可互换的两个问题。',
    paragraphs: [
      '跨行存款流出要求付款行在结算截止前交付准备金或取得日内信用；LCR 则把认可且未设押的高质量流动性资产与未来 30 个日历日的压力净现金流出比较。HQLA 仍需控制、变现或在央行操作中转换，不等于此刻已经可用的准备金。',
      '合成例 HQLA=120、总流出=150、合格流入=60；流入未超过 75% 上限 112.5，净流出为 90，LCR=133.33%。它不能证明今日每笔支付都准备就绪；Basel 也允许银行在真实压力中使用 HQLA，由监管者评估暂时低于最低值的情形。',
    ],
    sourceIds: [8, 26, 29],
    formula: { label: '合成 LCR', expression: '120 / [150−min(60,0.75×150)] = 120/90 = 133.33%', note: '国际标准、本地实施和日内现金表分别保存。' },
  },
  {
    id: 'net-stable-funding-ratio', number: 53, label: 'NSFR',
    title: 'NSFR 要求较长期、较不易变现的资产获得更稳定融资；贷款创造的存款不会自动提供等额 ASF。',
    paragraphs: [
      'NSFR 按稳定性给资本和负债赋予 available stable funding，并按流动性和期限给资产及表外暴露赋予 required stable funding，关注约一年的融资结构。贷款增加多少 RSF、同时生成的存款贡献多少 ASF，取决于各自规则类别，二者并非一比一抵销。',
      '合成银行 ASF=110、RSF=100 时 NSFR=110%，但它仍可能明早缺准备金，也可能 30 日 LCR 不足。反过来，LCR 充足也不保证一年期结构稳健；日内、30 日和一年三种时钟必须分别计算。',
    ],
    sourceIds: [26, 29, 30],
    formula: { label: '合成 NSFR', expression: 'NSFR = ASF / RSF = 110/100 = 110%', note: 'ASF/RSF 分类与本地适用范围必须读取对应规则版本。' },
  },
  {
    id: 'large-exposure-constraint', number: 54, label: 'Large Exposures',
    title: '资本总量足够仍可能因单一客户或关联组过度集中而不能继续放贷；平均风险不能掩盖集中度。',
    paragraphs: [
      'Basel 大额风险框架把单一对手方或 connected counterparties 的合并暴露与 Tier 1 capital 比较。所引国际框架一般上限为 25%，G-SIB 对另一 G-SIB 的限额更低；实际暴露计量、豁免、信用缓释和关联组识别必须按规则执行。',
      '合成银行 Tier1=10、对一个关联组暴露 3，则比率 30%，超过一般 25% 上限；即使 CET1 与 LCR 仍有余量，这笔客户贷款也可能不可执行。集中度约束表达损失不能由更多对手方分散，不是在预测该客户必然违约。',
    ],
    sourceIds: [26, 31, 51],
    formula: { label: '合成集中度', expression: 'LargeExposureRatio = 3/10 = 30% > 25%', note: 'connected-counterparty 识别不能按名称字符串机械聚合。' },
  },
  {
    id: 'provision-to-regulatory-capital-bridge', number: 55, label: 'Provision / Capital Bridge',
    title: '预期信用损失先进入会计利润与账面权益，再经税务和监管调整进入资本；IFRS 9、CECL 与 Basel 不是同一公式。',
    paragraphs: [
      '合成 IFRS 9 简化题若 EAD=100、12-month PD=2%、LGD=40%，ECL=0.8；只把 lifetime PD 改为 10% 时简化值为 4.0。真实 ECL 是概率加权现金短缺、前瞻情景、暴露路径和折现结果，而美国 CECL 也不能被写成 IFRS 9 Stage 2。',
      '拨备费用通常降低留存收益，但进入 CET1 还要经过税、监管扣除、标准法或 IRB、eligible provisions、expected-loss comparison 和过渡安排。BCBS 的 ECL 风险管理指引不替代会计准则，也不单独给出所有监管资本桥。',
    ],
    sourceIds: [32, 33, 35, 36, 37, 38, 39, 40],
    formula: { label: '简化教学值', expression: '100×2%×40%=0.8; 100×10%×40%=4.0', note: '必须保存 accountingFramework、规则版本、法域和资本过渡。' },
  },
  {
    id: 'bank-versus-nonbank-credit', number: 56, label: 'Bank / Non-bank Credit',
    title: '银行和非银行都能扩张信用；区别在于新负债是否进入货币口径，而不是谁“真正借出钱”。',
    paragraphs: [
      '存款银行向居民企业放贷 Q 并贷记账户时，冻结口径下信用和 M 各增加 Q。若居民家庭用已有存款直接向企业放贷，出借人存款减少、借款人存款增加，私人信用关系增加 Q 而存款总量不变。两种交易都提供融资，却有不同负债结构。',
      '“非银行绝不创造货币”仍过强，因为货币是统计分类而不是机构俗称。某些货币市场基金份额或短期工具可能被特定法域口径纳入广义货币；必须逐项检查发行人、持有人、可赎回性与方法版本。',
    ],
    sourceIds: [5, 7, 16, 48, 55, 57, 58],
    formula: { label: '对照', expression: 'Bank loan: ΔCredit=+Q, ΔM=+Q; direct nonbank loan: ΔCredit=+Q, ΔM=0', note: '冻结居民持有人和工具定义；现实证券化与回购另行分析。' },
  },
  {
    id: 'deposit-insurance-boundary', number: 57, label: 'Deposit Insurance',
    title: '存款保险为合格存款提供有边界的失败保护；它支持面值信任，却不会把全部银行负债变成央行货币。',
    paragraphs: [
      '覆盖取决于受保机构、存款产品、存款人、所有权类别、账户聚合规则和限额。IADI 原则为法域设计提供框架，不设全球统一金额；银行债券、基金、股票和许多柜台销售产品不会因为由银行销售就成为受保存款。',
      '美国合成例按访问日规则冻结为：同一存款人、同一受保银行、同一所有权类别合格余额 300,000 美元，忽略其他账户和利息，则受保 250,000、未保 50,000。限额不是“每个账户各 250,000”，也不能外推到欧盟或中国。',
    ],
    sourceIds: [41, 42, 59, 60],
    formula: { label: '美国冻结示例', expression: 'insured=min(300,000,250,000)=250,000; uninsured=50,000', note: 'jurisdiction=US、ownership category 与 asOf 缺一不可。' },
  },
  {
    id: 'central-bank-liquidity-backstop', number: 58, label: 'Central-bank Backstop',
    title: '央行后盾把合资格抵押品转换为结算流动性；它可缓解流动性断裂，却不能凭贷款分录修复负资本。',
    paragraphs: [
      '银行可在满足项目资格、法律文件、操作连接、抵押品和 haircut 后取得准备金。潜在借款能力不是资产面值总和，还要扣除既有质押、操作限制与额度；“有抵押品”也不证明今天已经可以调用。',
      '存款保险保护合格存款人，央行贷款向机构提供流动性，有序处置处理不可持续机构，三者不能互相替代。常规货币政策操作、市场功能工具和针对压力机构的流动性支持也要按目的、期限和风险承担分别标记。',
    ],
    sourceIds: [18, 19, 21, 43, 44, 45],
    formula: { label: '潜在容量', expression: 'AdditionalCapacity=max(0, Σ haircutAdjustedEligibleValueᵢ − Σ outstandingSecuredCreditAllocatedᵢ)', note: '两项必须使用同币种、同估值日和同一信用金额单位，再经过法律、操作、项目与额度资格门。' },
  },
  {
    id: 'resolution-hierarchy-and-institution-passport', number: 59, label: 'Resolution / Institutional Passport',
    title: '银行不可持续时，处置维持关键功能并按适用权利分配损失；国际原则不是全球统一债权瀑布。',
    paragraphs: [
      'FSB Key Attributes 要求法域具备转让业务、bridge institution、资产分离、在适当法律条件下 bail-in、融资、保障和跨境合作等工具。具体的担保债权、受保存款、优先存款、运营负债、资本工具与其他无担保债务顺序仍由国内法、合同、法律实体和个案决定。',
      '最终 institutional passport 至少保存法域、法人、牌照、合并层级、会计与审慎规则、存款保险边界、央行准入、处置机关与策略、债权类别、担保和净额权、适用法律、币种、关键支付功能和 asOf。同一集团成员可以拥有不同护照，资本与流动性也未必自由转移。',
    ],
    sourceIds: [26, 27, 28, 29, 30, 31, 33, 41, 42, 43, 44, 45, 51, 59, 60],
    formula: { label: '机构护照', expression: 'jurisdiction + legalEntity + rules + safety nets + claim hierarchy + transferability + asOf', note: '只有护照完整，安全网与损失顺序才可讨论。' },
    after: <ConstraintSafetyNetLab />,
  },
];

const checks = [
  { question: '银行批准额度 500、承诺 400、实际提款 250 时，贷款和存款本金应记多少？', answer: '只按已提款 250 进入本金账本；批准与未用承诺分别保存，不能写成贷款 500。', sourceIds: [1, 34, 36] },
  { question: '同行提款 100 为什么不要求准备金和资本同时增加 100？', answer: '提款使贷款资产与存款负债同时增加；准备金属于另一发行人，资本也不会由本金配平自动生成。', sourceIds: [1, 3, 5] },
  { question: '借款人把新存款跨行支付后，原贷款会迁移到收款行吗？', answer: '不会。存款与准备金迁移，贷款合同仍留在发放行，发放行承担后续融资任务。', sourceIds: [8, 9, 10] },
  { question: 'A→B 100、B→A 70，为何客户交易是 170 而净结算只有 30？', answer: '净额只压缩银行间名义结算义务；两笔客户支付仍分别存在，名义义务压缩为 170−30=140。实际峰值流动性节省还取决于时序、队列、日内信用与预置资金。', sourceIds: [8, 9, 10, 11] },
  { question: '客户把 100 银行存款换成现金，广义货币必然减少吗？', answer: '不必然；若冻结口径同时纳入公众现金与该存款，总量只换组成。必须读取当地方法。', sourceIds: [4, 5, 14, 16] },
  { question: '用存款支付本金和支付已应计利息，为什么不能合并？', answer: '本金支付注销贷款资产；利息支付清偿应计债权，收入已在应计时确认。两者对贷款本金和利润的时点不同。', sourceIds: [5, 36] },
  { question: 'gross loan 100、allowance 9、核销 8 后 net loan 是多少？', answer: '核销前后都为 91：gross 变 92、allowance 变 1。已覆盖核销不改变存款，也不在当日重复确认损失。', sourceIds: [33, 36, 39] },
  { question: '没有新增贷款，银行从居民非银行买券 70 能否增加 M？', answer: '可以。银行证券资产和居民存款负债各增 70；货币资格取决于发行人、工具和持有人，而不取决于资产是否叫贷款。', sourceIds: [1, 5, 16] },
  { question: '税 30 进入央行政府账户、随后向居民支出 45，冻结窗口内 M 与 B 怎样变化？', answer: '税各减 30、支出各增 45，因此净增 15；仍需保留两笔 gross flow，不能只存净额。', sourceIds: [22, 24, 25] },
  { question: '央行买券 80 时，为什么居民非银行卖方与银行卖方的 ΔM 不同？', answer: '非银最终卖方获得居民存款，M 与 B 各增 80；银行卖方只把证券换成准备金，B 增 80 而 M 直接变化为 0。', sourceIds: [1, 3, 5] },
  { question: '存款类机构调查为什么不能回答某家银行今天是否能付款？', answer: '调查会抵销体系内准备金和同业请求权，适合宏观对应项；单家银行结算能力需要法人级未抵销头寸。', sourceIds: [5, 7] },
  { question: 'B 从 100 到 200、M 从 500 到 520，能否用初始乘数 5 预测 M=1,000？', answer: '不能。M/B 从 5 降到 2.6，而 M 仍增长 4%；比率是结果，不是无需行为假设的结构系数。', sourceIds: [1, 46, 47, 48] },
  { question: '准备金率为零是否意味着银行可无限放贷？', answer: '否。准备金规则只是一层；合格需求、收益、资本、杠杆、支付流动性、稳定融资和集中度仍共同约束。', sourceIds: [15, 26, 27, 29, 30, 31] },
  { question: '七项边际容量分别是 150、120、90、110、70、95、85，可行提款为何是 70？', answer: '在同币种、同期限且换成同一容量单位后，同时成立的上限取最小值；large exposure 是绑定约束，容量不能相加。', sourceIds: [26, 27, 29, 30, 31] },
  { question: '为什么不能仅凭 CET1=5% 断言一家银行合规？', answer: '还缺法域、适用主体、缓冲、Pillar 2、过渡和计算版本；Basel 国际最低标准不是超国家直接法律。', sourceIds: [26, 51, 52] },
  { question: '美国同一存款人同一受保银行有两个同一所有权类别账户，是否每个账户各保 25 万美元？', answer: '不是；相同所有权类别按规则聚合。冻结总额 30 万美元时受保 25 万、未保 5 万。', sourceIds: [41, 42] },
  { question: '有合资格抵押品为什么仍不能断言银行今天一定能从央行借到钱？', answer: '还需法律文件、账户与操作连接、质押、估值、haircut、项目资格和额度；操作准备是独立约束。', sourceIds: [18, 19, 44, 45] },
  { question: '资产负债表恒等式能否识别“贷款供给冲击导致 M 上升”？', answer: '不能。恒等式只保证配平；因果判断还需要行为限制、可观察事件和外生或可辩护的识别设计。', sourceIds: [5, 46, 47, 48] },
] as const;

const glossary = [
  ['信用（credit）', '一方对另一方的跨期请求权或条件性融资承诺', '货币或银行贷款', '§03'],
  ['广义货币（broad money）', '由指定发行部门发行、由指定持有人持有并满足工具条件的金融负债集合', '所有流动资产', '§08'],
  ['货币基础（monetary base）', '按方法文件纳入的流通货币、银行准备金及其他合格央行负债', '公众银行存款', '§08'],
  ['存款（deposit）', '存款人对具体发行机构的债权', '装在银行里的实物现金', '§06'],
  ['准备金（reserves）', '合资格机构对中央银行的存款债权', '企业可直接持有的普通存款', '§07'],
  ['nostro', '一家银行在另一家银行以自身名义持有的代理账户资产', '本国央行准备金', '§24'],
  ['审批（approval）', '银行内部同意在条件满足时提供信用的决定', '已提款本金', '§12'],
  ['承诺（commitment）', '按合同条件未来提供资金的义务或或有暴露', '已经形成的表内贷款', '§12'],
  ['提款（drawdown）', '把授信额度实际转换成贷款本金的事件', '支付或结算', '§13'],
  ['四重记账（quadruple entry）', '交易双方各自复式并保持请求权横向镜像的记录结构', '四笔独立交易', '§05'],
  ['清算（clearing）', '验证、匹配并计算支付或证券义务的过程', '最终结算', '§19'],
  ['结算（settlement）', '以指定结算资产清偿义务的过程', '发送支付报文', '§19'],
  ['最终性（finality）', '按适用规则转移不可撤销且不因参与者失败而被追回的状态', '收款人看到待入账提示', '§19'],
  ['净额（netting）', '在法律有效安排下把多笔义务压缩为净结算额', '删除原始交易', '§19'],
  ['总融资（gross origination）', '窗口内所有新形成贷款本金的总和', '贷款存量净增量', '§28'],
  ['应计（accrual）', '权利义务随时间或履约形成时确认收入与费用', '现金已经付款', '§27'],
  ['损失准备（allowance）', '对适用信用损失估计形成的抵减或准备账户', '本金偿还', '§30'],
  ['核销（write-off）', '移除无合理回收预期账面金额的会计事件', '借款人法律债务必然消失', '§31'],
  ['终止确认（derecognition）', '按会计规则把金融资产或负债移出报表', '所有经济风险均已转移', '§32'],
  ['重估（revaluation）', '价格或汇率变化导致存量价值改变', '新发生的交易', '§10'],
  ['其他数量变化', '非交易且非价格变化造成的资产出现、消失或重分类', '现金流', '§10'],
  ['内生货币', '货币量由银行、借款人、央行和资产持有人的互动共同决定', '无限货币创造', '§45'],
  ['货币乘数', '特定假设下基础货币与广义货币关系的简化参数或事后比率', '跨制度固定常数', '§46'],
  ['RWA', '按监管规则把信用、市场和操作等暴露转换成风险加权资产', '会计总资产', '§50'],
  ['CET1', '按监管规则定义和调整的最高质量普通股一级资本', '账面净资产的无条件同义词', '§50'],
  ['杠杆暴露', 'Basel 杠杆率规则定义的表内、衍生品、SFT 与表外暴露总量', '未经调整的会计资产', '§51'],
  ['LCR', 'HQLA 相对 30 日压力净现金流出的流动性比率', '日内准备金余额', '§52'],
  ['NSFR', '可用稳定融资相对所需稳定融资的一年期结构比率', 'LCR', '§53'],
  ['大额风险暴露', '对单一或关联对手方相对 Tier 1 的集中度约束', '平均违约概率', '§54'],
  ['机构护照', '把法人、法域、规则、安全网、债权顺位和时点绑定的结构化记录', '集团品牌名称', '§59'],
] as const;

const interfaces = [
  { name: 'I1 · 2.06 → 3.09', payload: 'inputLineage.capitalLiquidityStateId、scope.legalEntity、constraintState、balanceSheetUniverse.claimPassports', guardrail: '3.09 读取真实上游约束状态；本章 SYNTHETIC 比率只做单位与方向测试，绝不覆盖 2.06。' },
  { name: 'I2 · 3.06 → 3.09', payload: 'inputLineage.reserveSettlementStateId、regimePassport.operatingFramework、safetyNetState.centralBankAccess、timestamps.settlementTime', guardrail: '准备金价格、数量和制度版本必须原样传播。' },
  { name: 'I3 · 3.08 → 3.09', payload: 'inputLineage.nominalRealRateStateId、timestamps、identificationStatus', guardrail: '这些是资金价格输入，不是贷款数量或存款乘数。' },
  { name: 'I4 · 3.09 → 3.10', payload: 'creditState、constraintState.fundingMix、constraintState.eligibleDemand、constraintState.expectedNetReturn', guardrail: 'eligibleDemand 保持金额容量；expectedNetReturn 使用独立年化回报观测并携带 rateConcept、currency、horizon 与 observationTime。3.10 才解释贷款定价与政策传导。' },
  { name: 'I5 · 3.09 → 3.11 / 3.12', payload: 'depositMoneyState、settlementState、reserveState.institutionDistribution、ledgerState.eventLedger[eventType=fiscal|central-bank]', guardrail: '先交付描述性事件，不预先命名货币政策冲击。' },
  { name: 'I6 · 3.09 → 3.13 / 3.14', payload: 'reserveState.fundingAfterSettlement、constraintState.capitalHeadroom、constraintState.leverageHeadroom、constraintState.liquidityHeadroom、constraintState.stableFundingHeadroom、constraintState.concentrationHeadroom', guardrail: '异质比率必须先换算为可比较边际容量。' },
  { name: 'I7 · 3.09 → 3.15 / Chapter 4', payload: 'nonBankBoundaryState、scope.currency、scope.jurisdiction、settlementState.correspondentChain、nonBankBoundaryState.bankLinks', guardrail: '非银和跨境请求权不得静默并入银行或本币体系。' },
  { name: 'I8 · 3.09 → Chapter 7', payload: 'balanceSheetUniverse.openingPositions、ledgerState.eventLedger[ledgerSequence, actorRoles, applyRuleVersion, postings]、scope、moneyPassport.methodologyVintage、measurementFlags、identificationStatus', guardrail: '只有可排序分录能重建期末头寸；恒等式仍只提供测量约束，因果冲击必须另做识别。' },
] as const;

const contractInvariants = [
  '每个金融请求权必须同时有债权人、债务人、币种、工具、计量基础和时钟；未知写 null，不靠名称推断。',
  '每个表内事件必须携带唯一 event/posting 顺序、结构化主体角色、应用规则版本和逐 position 有符号分录；重放后先通过主体内垂直配平，再通过对手方横向镜像，任何 reconciliation residual 都阻止聚合。',
  '审批、承诺、提款、支付、清算、最终结算、应计、付款、违约、拨备和核销不得互作时间别名。',
  '货币成员资格必须由发行人、持有人、工具与 methodology vintage 共同决定，M1/M2/M3/M4 名称不可跨法域猜测。',
  'Closing−Opening 必须拆成 transaction、revaluation 与 other volume；净贷款下降不得默认等于还款。',
  '准备金率、保险限额、Basel 模块、会计准则和便利资格等动态规则，在进入经验分析前必须刷新并保存清单字段；参考记录只保留来源身份与 retrievedAt，不冒充完整版本快照。',
  '资本、杠杆、LCR、NSFR、集中度、需求与收益是独立资格门；比率不可相加，只有同单位边际容量可取最小值。',
  '会计恒等式和事件共现不自动获得因果方向；identificationStatus 未通过时只允许描述性结论。',
] as const;

const evidenceGroups = [
  { title: 'A｜货币、统计与四重记账', text: 'S01–S07 支持贷款—存款机制、两层货币、部门—工具分类、存量流量桥与 2025 SNA 身份；不支持跨法域固定货币定义。', ids: Array.from({ length: 7 }, (_, index) => index + 1) },
  { title: 'B｜支付、结算与代理链', text: 'S08–S12 支持清算、净额、最终性、央行结算资产、Fedwire、T2 和 correspondent banking；报文与最终结算必须分开。', ids: Array.from({ length: 5 }, (_, index) => index + 8) },
  { title: 'C｜准备金、财政与央行操作', text: 'S13–S25 支持当前准备金制度、货币总量门户、IORB、公开市场操作、便利、央行负债和 TGA 路径；动态参数均需按访问日重验。', ids: Array.from({ length: 13 }, (_, index) => index + 13) },
  { title: 'D｜审慎约束', text: 'S26–S35 支持 Basel 总框架、风险资本、杠杆、LCR、NSFR、集中度、问题资产、ECL 与信用风险规则；国际标准不等于国内法。', ids: Array.from({ length: 10 }, (_, index) => index + 26) },
  { title: 'E｜会计、保险、处置与后盾', text: 'S36–S45 支持 IFRS 9、CECL、ACL、美国存款保险、IADI、FSB 处置、Regulation A 与 ECB ELA；各法域和会计体系不得混写。', ids: Array.from({ length: 10 }, (_, index) => index + 36) },
  { title: 'F｜银行行为理论与乘数边界', text: 'S46–S50 支持资产选择、准备金经验关系、银行融资创造模型、监督与资本的理论机制；模型变量不能逐字等同监管字段。', ids: Array.from({ length: 5 }, (_, index) => index + 46) },
  { title: 'G｜法律地位、法域与数据入口', text: 'S51–S60 支持 Basel 法律地位、中国资本规则、ECB 实施、Z.1、证券化、BoE M4、非银监测以及美欧中存款保险边界；状态和版本必须留存。', ids: Array.from({ length: 10 }, (_, index) => index + 51) },
  { title: 'H｜课堂合成数值', text: 'C1–C7、M1–M10 与 K1–K10 均是冻结 SYNTHETIC fixtures；来源只支持公式、制度和方向，不为参数现实性、机构合规或投资含义背书。', ids: [] },
] as const;

function Lesson309Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>银行信用创造不是“先有存款还是先有贷款”的口号争执，而是一组有主体、时钟、请求权和制度边界的事件账本。</h2>
        <p>同行提款时，银行取得贷款资产并发行存款负债；借款人同时取得存款资产并承担贷款负债。借款人随后支付，存款会换持有人，跨行时准备金也换持有人，而贷款留在原银行。银行再根据结算缺口、融资价格、资本、杠杆、流动性、稳定融资和集中度调整行为。由此得到的完整链条是“信用决定 → 承诺与提款 → 存款生成 → 支付与清算 → 准备金迁移 → 事后融资与约束反馈”，而不是把某一张 T-account 当成无限放贷理论。<Cites ns={[1, 3, 5, 8, 26]} /></p>
        <p>同样重要的是，贷款、信用、存款、准备金、基础货币和广义货币从来不是可互换的名称。货币成员取决于发行人、持有人、工具和统计版本；余额变化又可能来自交易、重估或核销。只有先让每一项请求权在债权人与债务人之间闭合，再在正确层级合并，才能把“货币内生”“财政支出增加存款”或“央行买券扩大基础货币”转化为有条件、可核对的命题。<Cites ns={[5, 7, 14, 16, 22, 46]} /></p>
        <BankCreditTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>先建立请求权和事件语法，再沿贷款生命周期逐笔复算；货币统计、央行交易与约束栈最后接入。</h2>
        <div className="learning-objectives"><span>核心首读约 130–170 分钟</span><ol>
          <li><b>对象与账本（02–12）：</b>冻结上游状态，区分信用和货币，掌握垂直复式、横向对应、两层货币、聚合边界和事件时钟。</li>
          <li><b>提款、支付与服务（13–32）：</b>从同行提款、直接付款、透支，走到跨行结算、融资、现金、偿还、利息、ECL、核销和贷款出售。</li>
          <li><b>证券、财政与央行（33–44）：</b>用交易对手开关判断银行买卖证券、政府账户、国债、QE、央行贷款和缩表怎样改变 M 与 B。</li>
          <li><b>行为、监管与安全网（45–59）：</b>把内生货币与固定乘数分开，再叠加需求、收益、资本、杠杆、流动性、集中度、保险、后盾和处置。</li>
        </ol></div>
        <p>完成按需先修后的核心路线是 00、01、03、04、05、06、07、08、09、11、12、13、18、19、20、22、25、27、30、31、33、37、38、40、41、42、44、45、46、47、48、49、50、51、52、53、54、57、58、59；首次遇到陌生术语，可先打开<a href="#checks-glossary">§62 术语表与检查题</a>预览定义，再回到机制正文。每看到一条“某交易创造或销毁货币”的句子，先问四件事：谁取得了什么资产，谁发行了什么负债，在哪个时点最终结算，以及该持有人与工具是否进入所选统计口径。</p>
        <div className="precision-note"><span>章节所有权</span><p>2.06 拥有参与者目标与约束的一般框架；3.05–3.08 拥有政策、实施、名义与实际利率；3.09 只交付信用—货币事件账本、机构护照和局部约束状态。3.10 接手贷款利率，3.11–3.15 接手资产负债表反馈、信用周期、金融条件与非银传导，Chapter 7 才拥有结构冲击识别。</p></div>
      </section>

      {conceptSections.map((section) => <BankCreditConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Lab</p>
        <h2>十道合成题要求先冻结主体、时钟和口径，再复算提款、支付、核销、财政、QE、乘数与约束。</h2>
        <p>所有题均标记 SYNTHETIC。错答只显示当前选择的机制缺口，不提前泄露完整答案、复算或下一题；答对后才解锁计算。静态客户端无法阻止主动查看源代码，因此门控只承诺正常作答界面，不声称具备服务端答案保密能力。</p>
        <BankCreditLab />
        <BankCreditFixtureAudit />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>十道静态孪生更换数值或交易对手，让打印、无脚本和复盘环境也能验证迁移能力。</h2>
        <div className="case-grid" id="bank-credit-static-twins">
          {bankCreditScenarios.map((scenario, index) => (
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
        <h2>掌握标准不是会背“贷款创造存款”，而是能闭合四张表、识别事件时钟，并在口径未知时停止推断。</h2>
        <div className="check-list">{checks.map((check, index) => <div className="check-entry" key={check.question}><details><summary>{index + 1}. {check.question}</summary><p className="check-details-answer">{check.answer} <Cites ns={check.sourceIds} /></p></details><p className="print-only check-print-answer"><b>{index + 1}. 标准答案：</b>{check.answer} <Cites ns={check.sourceIds} /></p></div>)}</div>
        <div className="term-grid" aria-label="3.09术语表" role="group">{glossary.map(([term, definition, confusion, section]) => <article className="term-card" key={term}><span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>不可混同：{confusion}。</em></article>)}</div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces / Reading / Evidence Map</p>
        <h2>本节交付的是可重放的信用—货币事件状态，不是一个脱离法人、时钟和制度的“银行可贷金额”。</h2>
        <div className="interface-grid">{interfaces.map(({ name, payload, guardrail }) => <article key={name}><span>{name}</span><h3>交付字段</h3><p><code>{payload}</code></p><em>{guardrail}</em></article>)}</div>

        <div className="precision-note" data-key-coverage={canonicalBankCreditStateFieldCoverage && canonicalBankCreditStateRuntimeCoverage ? 'complete' : 'incomplete'} data-ledger-replay={canonicalLoanDrawReplayResult.passed ? 'passed' : 'failed'}><span>3.09 canonical state contract · {canonicalBankCreditStateFields.length} 个顶层键 · compile/runtime/replay 三重闭合</span><p><code>{canonicalBankCreditStateFields.join(', ')}</code>。顶层键先接受 TypeScript 完整性约束；随后非空 SYNTHETIC 提款 fixture 从四个零余额 <code>openingPositions</code> 出发，按一个事件的 <code>ledgerSequence</code> 与四条分录的 <code>postingSequence</code> 依次应用 <code>bank-credit-ledger-v1</code>，得到四个余额100的期末头寸，并重新验证银行与借款人垂直残差、贷款与存款请求权横向残差全为0。每个事件还保存结构化 <code>actorRoles</code>；未知规则、身份错配、非有限金额或负期末余额都会让重放失败。<code>scope</code> 和 <code>moneyPassport</code> 分别冻结法人边界与货币口径，任何关键未知仍写 <code>null</code> 并加入 <code>measurementFlags</code>。生产者侧另用一个非空合成值验证 <code>constraintState.expectedNetReturn</code> 是年化回报观测，含 <code>valuePctPointsPerYear</code>、<code>rateConcept</code>、<code>annualisation</code>、币种、horizon 与观察时点；它不得再携带金额余量的 <code>amount</code> 或 <code>capacityUnit</code>，从而与 <code>eligibleDemand</code> 保持类型分离并由 3.10 直接消费。</p></div>
        <div className="precision-note"><span>必须保持的八条合同不变量</span><ol>{contractInvariants.map((invariant) => <li key={invariant}>{invariant}</li>)}</ol></div>
        <div className="precision-note" data-dynamic-passports={lesson309SourceIdentityPassports.length} data-missing-retrieved-at={lesson309SourceIdentityPassports.filter((passport) => passport.retrievedAt === null).length}><span>动态来源身份护照 + refresh checklist</span><p>本参考记录为 {lesson309SourceIdentityPassports.length} 个动态来源保存作者、标题、发布载体、版本/日期、URL 与 retrievedAt；缺失检索日 {lesson309SourceIdentityPassports.filter((passport) => passport.retrievedAt === null).length} 个。它不是完整网页或规则快照。货币定义、支付系统、准备金规则、央行便利、会计准则、Basel 模块、保险和处置文本一旦进入经验分析，必须重新访问并保存下列字段；网页当前状态、文件发布日期、规则生效日与 data-through date 不能互换。</p><ul>{lesson309DynamicSourceRequirements.map((requirement) => <li key={requirement.sourceIds.join('-')}><b>S{requirement.sourceIds.map((id) => String(id).padStart(2, '0')).join(' / S')}：</b><code>{requirement.fields.join(', ')}</code></li>)}</ul></div>

        <h3>Evidence Map · 每组证据支持一段机制，也同时限制不能推出什么</h3>
        <div className="evidence-map" aria-label="3.09连续覆盖60条来源的证据地图" role="group">{evidenceGroups.map((group) => <div key={group.title}><h3>{group.title}</h3><p>{group.text} {group.ids.length ? <Cites ns={group.ids} /> : null}</p></div>)}</div>

        <div className="learning-objectives"><span>延伸阅读顺序</span><ol>
          <li><b>第一遍：</b>BoE、Bundesbank、IMF MFSMCG 与 2025 SNA；为每笔提款画银行和客户两张表，再补交易对手镜像。</li>
          <li><b>第二遍：</b>PFMI、Fedwire、T2 与 correspondent banking；逐项标支付指令、清算、净额、结算资产和最终性。</li>
          <li><b>第三遍：</b>Fed、ECB、BoE 货币统计与操作框架；用同一交易切换卖方、账户位置和法域，观察 M 与 B 如何改变。</li>
          <li><b>第四遍：</b>Basel 风险资本、杠杆、LCR、NSFR、集中度与问题资产模块；把每只尺子换成同单位 headroom 后再找绑定约束。</li>
          <li><b>第五遍：</b>IFRS 9、CECL、IADI、FSB、央行便利与银行理论；分开会计、审慎、流动性后盾、处置和行为模型。</li>
        </ol></div>
        <p>最小复述是：<b>提款时贷款与存款成对生成，支付时存款换持有人，跨行支付再使准备金换持有人；原贷款仍留在发放行。信用不等于货币，准备金不等于公众存款，M/B 不等于固定乘数。任何余额变化先拆交易、重估和其他数量变化，任何货币变化先检查发行人、持有人、工具和方法版本。银行能够内生发行存款，但不能创造资本、合格需求或真实资源；它仍受收益、风险资本、杠杆、流动性、稳定融资、集中度和安全网资格约束。只有把这些请求权、事件、时钟和法域保留下来，3.10 以后才可能解释贷款利率与信用周期，并在 Chapter 7 把事件转化为可证伪的冲击研究。</b></p>
      </section>
    </>
  );
}

export const lesson309: LessonRecord = {
  slug: '3-09',
  id: '3.09',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Bank Credit Creation：贷款、存款、准备金与约束栈',
  subtitle: '银行怎样通过提款发行存款，支付怎样迁移准备金，货币与财政—央行交易怎样跨主体合并，以及资本、流动性和安全网如何反馈到信用供给',
  readingTime: '核心首读约 130–170 分钟；完整正文与逐笔复算约 360–480 分钟；C1–C7 机制实验约 65–90 分钟，互动题首次完成约 40–55 分钟／含复盘约 60–80 分钟，静态变式、检查题与术语约 75–100 分钟；来源与延伸阅读不计',
  prerequisite: '2.06 Financial Institutions、3.05 Reaction Function、3.06 Policy Implementation、3.07 Yield Curve、3.08 Real Interest Rate；按需调用 T02 Compounding / Discounting、T03 Probability / Expectation、T06 Balance Sheet、T07 Financial Instruments 与 T08 Time / Vintage',
  updatedAt: '2026-09-03',
  revision: '3.09-r5',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.09-r4',
      summary:
        '独立通读 00–63、58 个机制节、60 条连续来源与 20 项延伸阅读，审核 C1–C7、M1–M10/K1–K10、20-key canonical contract 及全部章节接口；逐项复算 57 个 fixture、6 个结构断言和 79 个数值断言，验证非空事件重放、同行付款 3×3 货币资格矩阵及本金偿还三态，并从权威原始来源核验货币统计、支付结算、Basel、会计、安全网与处置边界，最终 P0–P3 为 0，冻结指纹逐项一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.09-r4',
      summary:
        '独立审核零背景教学递进、单一机制边界、公式白话解释、局部引用、静态降级和练习门控；真实浏览器全量回归覆盖首页与相邻导航、1280/390 视口、C1–C7、M1–M10 完整闯关、刷新恢复与深链，r4 增量又以当前 SSR、源码和实际纯计算器执行复核 C2 九种资格组合、C4 与 57/57、79/79、6/6，最终 P0–P3 为 0，冻结指纹逐项一致。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-09-03',
      decision: 'approved',
      revision: '3.09-r5',
      summary:
        '因 3.10 消费者审计而独立重审生产者接口：确认 eligibleDemand 保持金额容量，expectedNetReturn 改为非空的六字段年化回报观测，生产者门拒绝 amount/capacityUnit，3.10 直接导入同一类型与对象并通过身份、字段和运行时契约；类型、规范、生产构建及跨章门全部通过，P0–P3 为 0，冻结哈希始终一致。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-03',
      decision: 'approved',
      revision: '3.09-r5',
      summary:
        '独立复审 r5 的零背景接口表达与页面状态：正文和 I4 明确区分“可贷金额需求”与“预期年化回报率”，旧 r4 审批不会误封新版本，SSR、类型、规范、状态机和相关可访问性结构均通过；本轮无可连接浏览器，未把截图、真实焦点或物理滚动位置伪报为已测，P0–P3 为 0，起止哈希一致。',
    },
  ],
  previous: { slug: '3-08', label: '3.08 Real Interest Rate' },
  next: { slug: '3-10', label: '3.10 Bank Lending Channel' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    ...conceptSections.map((section) => ({ id: section.id, label: section.label })),
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson309Content,
  references: lesson309References,
  readingList: lesson309ReadingList,
  readingListOrder: 'source',
};
