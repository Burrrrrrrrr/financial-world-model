export type FinancialConditionsDomainId =
  | 'safe-rates'
  | 'private-credit'
  | 'equity-wealth'
  | 'dollar-fx'
  | 'bank-availability'
  | 'market-liquidity';

export type FinancialConditionsComponent = {
  id: string;
  domain: FinancialConditionsDomainId;
  label: string;
  transformedTightnessScore: number | null;
  originalUnit: string;
  originalTransformation: string;
  higherOriginalValueMeans: 'tighter' | 'easier' | 'context-dependent';
  measurementFlag: 'synthetic' | 'observed' | 'estimated';
};

export type FinancialConditionsWeight = {
  domain: FinancialConditionsDomainId;
  weight: number;
};

export type WeightedConditionsResult = {
  score: number;
  totalOriginalWeight: number;
  observedWeight: number;
  isPartial: false;
  missingDomains: FinancialConditionsDomainId[];
  renormalized: false;
  compositionVersion: 'full-scope-v1';
  contributions: { domain: FinancialConditionsDomainId; value: number; weight: number; contribution: number }[];
};

export const financialConditionsDomains: readonly FinancialConditionsDomainId[] = [
  'safe-rates',
  'private-credit',
  'equity-wealth',
  'dollar-fx',
  'bank-availability',
  'market-liquidity',
];

export const canonicalFinancialConditionsComponents: readonly FinancialConditionsComponent[] = [
  {
    id: 'SAFE_RATE_STATE',
    domain: 'safe-rates',
    label: '安全利率与期限结构',
    transformedTightnessScore: 0.6,
    originalUnit: 'SYNTHETIC z-like score',
    originalTransformation: '方向统一后直接输入；非真实样本z-score',
    higherOriginalValueMeans: 'tighter',
    measurementFlag: 'synthetic',
  },
  {
    id: 'PRIVATE_CREDIT_PRICE',
    domain: 'private-credit',
    label: '私人信用价格',
    transformedTightnessScore: 1.2,
    originalUnit: 'SYNTHETIC z-like score',
    originalTransformation: '利差/全包融资价格方向统一；非真实样本z-score',
    higherOriginalValueMeans: 'tighter',
    measurementFlag: 'synthetic',
  },
  {
    id: 'EQUITY_WEALTH_STATE',
    domain: 'equity-wealth',
    label: '股票与财富渠道',
    transformedTightnessScore: 0.8,
    originalUnit: 'SYNTHETIC z-like score',
    originalTransformation: '将资产价格下跌翻为正向收紧；非真实样本z-score',
    higherOriginalValueMeans: 'easier',
    measurementFlag: 'synthetic',
  },
  {
    id: 'DOLLAR_FX_STATE',
    domain: 'dollar-fx',
    label: '美元与外汇条件',
    transformedTightnessScore: 0.5,
    originalUnit: 'SYNTHETIC z-like score',
    originalTransformation: '按本例美元融资暴露映射为正向收紧；非真实样本z-score',
    higherOriginalValueMeans: 'context-dependent',
    measurementFlag: 'synthetic',
  },
  {
    id: 'BANK_AVAILABILITY_STATE',
    domain: 'bank-availability',
    label: '银行数量与非价格可得性',
    transformedTightnessScore: 0.8,
    originalUnit: 'SYNTHETIC z-like score',
    originalTransformation: '标准收紧、额度缩减与期限缩短统一为正；非真实样本z-score',
    higherOriginalValueMeans: 'context-dependent',
    measurementFlag: 'synthetic',
  },
  {
    id: 'MARKET_LIQUIDITY_STATE',
    domain: 'market-liquidity',
    label: '市场流动性与交易成本',
    transformedTightnessScore: 0.4,
    originalUnit: 'SYNTHETIC z-like score',
    originalTransformation: '价差扩大/深度下降统一为正；非真实样本z-score',
    higherOriginalValueMeans: 'context-dependent',
    measurementFlag: 'synthetic',
  },
];

export const categoryBalancedWeights: readonly FinancialConditionsWeight[] = financialConditionsDomains.map((domain) => ({
  domain,
  weight: 1 / financialConditionsDomains.length,
}));

export const illustrativeGrowthPurposeWeights: readonly FinancialConditionsWeight[] = [
  { domain: 'safe-rates', weight: 0.1 },
  { domain: 'private-credit', weight: 0.25 },
  { domain: 'equity-wealth', weight: 0.25 },
  { domain: 'dollar-fx', weight: 0.15 },
  { domain: 'bank-availability', weight: 0.15 },
  { domain: 'market-liquidity', weight: 0.1 },
];

export const illustrativeVariancePurposeWeights: readonly FinancialConditionsWeight[] = [
  { domain: 'safe-rates', weight: 0.08 },
  { domain: 'private-credit', weight: 0.35 },
  { domain: 'equity-wealth', weight: 0.15 },
  { domain: 'dollar-fx', weight: 0.12 },
  { domain: 'bank-availability', weight: 0.2 },
  { domain: 'market-liquidity', weight: 0.1 },
];

function hasExactCanonicalDomainUniverse(domains: readonly FinancialConditionsDomainId[]) {
  const uniqueDomains = new Set(domains);
  return domains.length === financialConditionsDomains.length
    && uniqueDomains.size === financialConditionsDomains.length
    && financialConditionsDomains.every((domain) => uniqueDomains.has(domain));
}

export function weightedConditionsScore(
  components: readonly FinancialConditionsComponent[],
  weights: readonly FinancialConditionsWeight[],
): WeightedConditionsResult | null {
  if (!hasExactCanonicalDomainUniverse(components.map(({ domain }) => domain))) return null;
  if (!hasExactCanonicalDomainUniverse(weights.map(({ domain }) => domain))) return null;
  if (new Set(components.map(({ id }) => id)).size !== components.length) return null;
  const componentByDomain = new Map(components.map((component) => [component.domain, component]));
  if (weights.some(({ weight }) => !Number.isFinite(weight) || weight < 0)) return null;
  const totalOriginalWeight = weights.reduce((sum, { weight }) => sum + weight, 0);
  if (Math.abs(totalOriginalWeight - 1) > 1e-9) return null;
  const available = weights.flatMap(({ domain, weight }) => {
    const value = componentByDomain.get(domain)?.transformedTightnessScore;
    return typeof value === 'number' && Number.isFinite(value) ? [{ domain, value, weight }] : [];
  });
  if (available.length !== weights.length) return null;
  const observedWeight = available.reduce((sum, { weight }) => sum + weight, 0);
  const contributions = available.map(({ domain, value, weight }) => ({
    domain,
    value,
    weight,
    contribution: value * weight,
  }));
  return {
    score: contributions.reduce((sum, { contribution }) => sum + contribution, 0),
    totalOriginalWeight,
    observedWeight,
    isPartial: false,
    missingDomains: [],
    renormalized: false,
    compositionVersion: 'full-scope-v1',
    contributions,
  };
}

export const canonicalCategoryBalancedResult = weightedConditionsScore(
  canonicalFinancialConditionsComponents,
  categoryBalancedWeights,
);
export const canonicalGrowthPurposeResult = weightedConditionsScore(
  canonicalFinancialConditionsComponents,
  illustrativeGrowthPurposeWeights,
);
export const canonicalVariancePurposeResult = weightedConditionsScore(
  canonicalFinancialConditionsComponents,
  illustrativeVariancePurposeWeights,
);

export function duplicatedCreditAverage(creditCopyCount: number) {
  if (!Number.isInteger(creditCopyCount) || creditCopyCount < 1 || creditCopyCount > 20) return null;
  const fixedValues = [0.6, 0.8, 0.5, 0.8, 0.4];
  const duplicatedCreditValues = Array.from({ length: creditCopyCount }, () => 1.2);
  const values = [...fixedValues, ...duplicatedCreditValues];
  return {
    score: values.reduce((sum, value) => sum + value, 0) / values.length,
    componentCount: values.length,
    creditShareOfRawInputs: creditCopyCount / values.length,
  };
}

export function populationStandardScore(values: readonly number[], targetIndex: number) {
  if (!values.length || targetIndex < 0 || targetIndex >= values.length || values.some((value) => !Number.isFinite(value))) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / values.length;
  const standardDeviation = Math.sqrt(variance);
  if (!(standardDeviation > 0)) return null;
  return { mean, standardDeviation, score: (values[targetIndex] - mean) / standardDeviation };
}

export const expandingStandardizationExample = populationStandardScore([1, 2, 3], 2);
export const fullSampleLeakageExample = populationStandardScore([1, 2, 3, 10], 2);

export const priceQuantityConflictComponents: readonly FinancialConditionsComponent[] = [
  { ...canonicalFinancialConditionsComponents[0], transformedTightnessScore: 0.2 },
  { ...canonicalFinancialConditionsComponents[1], transformedTightnessScore: -0.4 },
  { ...canonicalFinancialConditionsComponents[2], transformedTightnessScore: -0.6 },
  { ...canonicalFinancialConditionsComponents[3], transformedTightnessScore: 0.1 },
  { ...canonicalFinancialConditionsComponents[4], transformedTightnessScore: 1.5 },
  { ...canonicalFinancialConditionsComponents[5], transformedTightnessScore: -0.3 },
];

export const priceQuantityConflictAggregate = weightedConditionsScore(
  priceQuantityConflictComponents,
  categoryBalancedWeights,
);

export const borrowerExposureProfiles = {
  bankDependentSmallFirm: [
    { domain: 'safe-rates', weight: 0.1 },
    { domain: 'private-credit', weight: 0.15 },
    { domain: 'equity-wealth', weight: 0.05 },
    { domain: 'dollar-fx', weight: 0.05 },
    { domain: 'bank-availability', weight: 0.55 },
    { domain: 'market-liquidity', weight: 0.1 },
  ],
  publicBondIssuer: [
    { domain: 'safe-rates', weight: 0.15 },
    { domain: 'private-credit', weight: 0.4 },
    { domain: 'equity-wealth', weight: 0.2 },
    { domain: 'dollar-fx', weight: 0.1 },
    { domain: 'bank-availability', weight: 0.05 },
    { domain: 'market-liquidity', weight: 0.1 },
  ],
  dollarDebtor: [
    { domain: 'safe-rates', weight: 0.1 },
    { domain: 'private-credit', weight: 0.2 },
    { domain: 'equity-wealth', weight: 0.05 },
    { domain: 'dollar-fx', weight: 0.5 },
    { domain: 'bank-availability', weight: 0.05 },
    { domain: 'market-liquidity', weight: 0.1 },
  ],
} as const satisfies Record<string, readonly FinancialConditionsWeight[]>;

const sharedFixedDirectionRuleByDomain: Record<FinancialConditionsDomainId, string> = {
  'safe-rates': 'higher matched safe-rate tightness score is tighter for the registered net borrower',
  'private-credit': 'higher all-in private-credit price tightness score is tighter',
  'equity-wealth': 'lower equity/wealth support has already been sign-aligned to a higher tightness score',
  'dollar-fx': 'must be replaced by the registered agent-specific net currency exposure rule',
  'bank-availability': 'lower approval, amount or non-price access has already been sign-aligned to a higher tightness score',
  'market-liquidity': 'wider trading costs or lower depth has already been sign-aligned to a higher tightness score',
};

function makeBorrowerDirectionPassport(agentId: string, dollarExposureAssumption: string) {
  return {
    agentId,
    signMapVersion: 'synthetic-shared-fixed-sign-map-v1',
    heterogeneityMode: 'weight-only-under-shared-fixed-sign-map' as const,
    allDirectionsDefined: true,
    measurementFlag: 'synthetic' as const,
    domainDirections: financialConditionsDomains.map((domain) => ({
      domain,
      directionStatus: 'defined-synthetic-assumption' as const,
      rule: domain === 'dollar-fx' ? dollarExposureAssumption : sharedFixedDirectionRuleByDomain[domain],
    })),
  };
}

export const borrowerDirectionPassports = {
  bankDependentSmallFirm: makeBorrowerDirectionPassport(
    'BANK_DEPENDENT_SMALL_FIRM',
    'positive dollar score is tighter only under this fixture\'s registered synthetic USD-input/refinancing exposure; no observed exposure is claimed',
  ),
  publicBondIssuer: makeBorrowerDirectionPassport(
    'PUBLIC_BOND_ISSUER',
    'positive dollar score is tighter only under this fixture\'s registered synthetic unhedged foreign-currency refinancing exposure; no observed exposure is claimed',
  ),
  dollarDebtor: makeBorrowerDirectionPassport(
    'UNHEDGED_DOLLAR_DEBTOR',
    'positive dollar score is tighter for this registered synthetic unhedged dollar-debt exposure',
  ),
} as const;

export const borrowerConflictResults = {
  bankDependentSmallFirm: weightedConditionsScore(priceQuantityConflictComponents, borrowerExposureProfiles.bankDependentSmallFirm),
  publicBondIssuer: weightedConditionsScore(priceQuantityConflictComponents, borrowerExposureProfiles.publicBondIssuer),
  dollarDebtor: weightedConditionsScore(priceQuantityConflictComponents, borrowerExposureProfiles.dollarDebtor),
};

export type FciGObservation = { date: string; total: number };

export const fciGSelectedQuarterEnds: readonly FciGObservation[] = [
  { date: '2020-03-31', total: -0.134475 },
  { date: '2020-06-30', total: -0.475020 },
  { date: '2020-09-30', total: -0.904272 },
  { date: '2020-12-31', total: -1.391870 },
  { date: '2021-03-31', total: -1.532232 },
  { date: '2021-06-30', total: -1.752802 },
  { date: '2021-09-30', total: -1.627581 },
  { date: '2021-12-31', total: -1.560331 },
  { date: '2022-03-31', total: -1.027342 },
  { date: '2022-06-30', total: 0.039862 },
  { date: '2022-09-30', total: 0.643657 },
  { date: '2022-12-30', total: 0.999349 },
  { date: '2023-03-31', total: 0.551131 },
  { date: '2023-06-30', total: 0.479678 },
  { date: '2023-09-29', total: 0.687607 },
  { date: '2023-12-29', total: 0.522281 },
  { date: '2024-03-29', total: 0.063743 },
  { date: '2024-06-28', total: 0.096504 },
  { date: '2024-09-30', total: -0.245675 },
  { date: '2024-12-31', total: -0.215587 },
  { date: '2025-03-31', total: -0.196507 },
  { date: '2025-06-30', total: -0.735772 },
  { date: '2025-09-30', total: -1.040190 },
  { date: '2025-12-31', total: -1.070608 },
  { date: '2026-03-31', total: -0.923186 },
  { date: '2026-06-30', total: -0.992935 },
  { date: '2026-07-31', total: -0.87733131640446 },
];

export const fciGDecompositionSnapshots = [
  {
    label: '2021-06-30 · 所选2020+窗口最强尾风',
    date: '2021-06-30',
    total: -1.75280205164512,
    contributions: {
      FFR: -0.0489326086439937,
      '10Y Treasury': 0.0444177541323336,
      Mortgage: -0.0262834903123052,
      BBB: -0.199180181481634,
      Equity: -0.819566886962048,
      Housing: -0.48138671426599,
      Dollar: -0.221869924111481,
    },
  },
  {
    label: '2022-12-30 · 所选2020+窗口最强逆风',
    date: '2022-12-30',
    total: 0.999348948059591,
    contributions: {
      FFR: 0.276617956347935,
      '10Y Treasury': -0.038945156944448,
      Mortgage: 0.49728117780608,
      BBB: 0.253976217353605,
      Equity: -0.0624948933710357,
      Housing: -0.32862205959857,
      Dollar: 0.401535706466025,
    },
  },
  {
    label: '2026-07-31 · 最新CSV观测',
    date: '2026-07-31',
    total: -0.87733131640446,
    contributions: {
      FFR: -0.0515256396255419,
      '10Y Treasury': -0.00697175961050645,
      Mortgage: 0.016952639928847,
      BBB: -0.0495207055496662,
      Equity: -0.668907837539753,
      Housing: 0.00226751661466024,
      Dollar: -0.1196255306225,
    },
  },
] as const;

export const fciGDataPassport = {
  provider: 'Board of Governors of the Federal Reserve System',
  product: 'Financial Conditions Impulse on Growth (FCI-G), baseline monthly, three-year lookback',
  file: 'fci_g_public_monthly_3yr.csv',
  sourceURL: 'https://www.federalreserve.gov/econres/notes/feds-notes/fci_g_public_monthly_3yr.csv',
  observationStart: '1990-01-31',
  observationEnd: '2026-07-31',
  observationCount: 439,
  selectedPlotRule: '2020-03 through 2026-06 quarter-end rows, plus latest 2026-07 row',
  retrievedAt: '2026-09-11 Asia/Shanghai',
  sha256: 'c3daefa4f1cd09e37197969ffa80f841678aafd47513346d735ff7868e207f2c',
  unit: 'percentage-point contribution to one-year-ahead real GDP growth under model-based rule-of-thumb mapping',
  sign: 'positive=headwind/tighter; negative=tailwind/easier',
  status: 'research product; values may be delayed, revised, changed, or discontinued',
} as const;

const close = (left: number | undefined, right: number, tolerance = 1e-9) =>
  typeof left === 'number' && Math.abs(left - right) <= tolerance;
const sumSnapshot = (snapshot: (typeof fciGDecompositionSnapshots)[number]) =>
  Object.values(snapshot.contributions).reduce((sum, value) => sum + value, 0);
const missingCanonicalComponentExample = canonicalFinancialConditionsComponents.map((component, index) =>
  index === 0 ? { ...component, transformedTightnessScore: null } : component,
);
const singleDomainWeightExample: readonly FinancialConditionsWeight[] = [
  { domain: 'safe-rates', weight: 1 },
];
const duplicatedCanonicalDomainExample: readonly FinancialConditionsComponent[] = [
  ...canonicalFinancialConditionsComponents,
  { ...canonicalFinancialConditionsComponents[0], id: 'SAFE_RATE_STATE_DUPLICATE' },
];

export const financialConditionsFixtureAudit = [
  { key: 'six unique canonical domains', passed: canonicalFinancialConditionsComponents.length === 6 && new Set(canonicalFinancialConditionsComponents.map(({ domain }) => domain)).size === 6 },
  { key: 'canonical components explicitly synthetic', passed: canonicalFinancialConditionsComponents.every(({ measurementFlag, originalUnit, originalTransformation }) => measurementFlag === 'synthetic' && originalUnit.includes('SYNTHETIC') && originalTransformation.includes('非真实样本')) },
  { key: 'category weights sum to one', passed: close(categoryBalancedWeights.reduce((sum, { weight }) => sum + weight, 0), 1) },
  { key: 'category-balanced score equals 43/60', passed: close(canonicalCategoryBalancedResult?.score, 43 / 60) },
  { key: 'purpose weights create distinct valid summaries', passed: close(canonicalGrowthPurposeResult?.score, 0.795) && close(canonicalVariancePurposeResult?.score, 0.848) },
  { key: 'complete scores preserve original weights without renormalisation', passed: [canonicalCategoryBalancedResult, canonicalGrowthPurposeResult, canonicalVariancePurposeResult].every((result) => close(result?.totalOriginalWeight, 1) && close(result?.observedWeight, 1) && result?.isPartial === false && result.renormalized === false && result.missingDomains.length === 0 && result.compositionVersion === 'full-scope-v1') },
  { key: 'missing component stops strict scalar instead of silently renormalising', passed: weightedConditionsScore(missingCanonicalComponentExample, categoryBalancedWeights) === null },
  { key: 'single-domain weight vector cannot masquerade as full-scope scalar', passed: weightedConditionsScore(canonicalFinancialConditionsComponents, singleDomainWeightExample) === null },
  { key: 'duplicated component domain stops strict scalar', passed: weightedConditionsScore(duplicatedCanonicalDomainExample, categoryBalancedWeights) === null },
  { key: 'duplicated credit signal changes naive component average', passed: close(duplicatedCreditAverage(1)?.score, 43 / 60) && close(duplicatedCreditAverage(3)?.score, 6.7 / 8) },
  { key: 'future observation flips historical standardized sign', passed: close(expandingStandardizationExample?.score, Math.sqrt(1.5)) && close(fullSampleLeakageExample?.score, -1 / Math.sqrt(12.5)) },
  { key: 'price-quantity aggregate is near neutral', passed: close(priceQuantityConflictAggregate?.score, 1 / 12) },
  { key: 'bank-dependent borrower remains tight in conflict case', passed: close(borrowerConflictResults.bankDependentSmallFirm?.score, 0.73) && (borrowerConflictResults.bankDependentSmallFirm?.score ?? 0) > (priceQuantityConflictAggregate?.score ?? 0) },
  { key: 'every borrower profile declares six synthetic direction assumptions', passed: Object.values(borrowerDirectionPassports).every((passport) => passport.heterogeneityMode === 'weight-only-under-shared-fixed-sign-map' && passport.allDirectionsDefined && passport.domainDirections.length === financialConditionsDomains.length && passport.domainDirections.every(({ directionStatus }) => directionStatus === 'defined-synthetic-assumption')) },
  { key: 'official selected chart has ordered unique dates', passed: fciGSelectedQuarterEnds.every(({ date }, index, rows) => index === 0 || date > rows[index - 1].date) && new Set(fciGSelectedQuarterEnds.map(({ date }) => date)).size === fciGSelectedQuarterEnds.length },
  { key: 'official latest observation matches passport end', passed: fciGSelectedQuarterEnds.at(-1)?.date === fciGDataPassport.observationEnd && close(fciGSelectedQuarterEnds.at(-1)?.total, -0.87733131640446) },
  { key: 'all official decomposition snapshots close', passed: fciGDecompositionSnapshots.every((snapshot) => close(sumSnapshot(snapshot), snapshot.total, 2e-12)) },
] as const;

if (!financialConditionsFixtureAudit.every(({ passed }) => passed)) {
  throw new Error(`3.13 financial-conditions fixture gate failed: ${financialConditionsFixtureAudit.filter(({ passed }) => !passed).map(({ key }) => key).join(', ')}`);
}
