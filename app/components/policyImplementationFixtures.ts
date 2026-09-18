export type LedgerEntityId = 'centralBank' | 'bankA' | 'bankB' | 'external';

export type LedgerEntry = {
  assetDelta: number;
  liabilityEquityDelta: number;
  assets: string[];
  liabilitiesEquity: string[];
};

export type LedgerOperation = {
  id: 'interbank' | 'government-spending' | 'tax' | 'repo' | 'cash-withdrawal';
  label: string;
  title: string;
  trigger: string;
  entries: Record<LedgerEntityId, LedgerEntry>;
  systemReserveDelta: number;
  distribution: string;
  causalBoundary: string;
};

const zero: LedgerEntry = { assetDelta: 0, liabilityEquityDelta: 0, assets: ['无变化'], liabilitiesEquity: ['无变化'] };

export const ledgerEntities: { id: LedgerEntityId; label: string; role: string }[] = [
  { id: 'centralBank', label: 'Central Bank', role: '以本币准备金和现金作为负债，维护最终结算账本' },
  { id: 'bankA', label: 'Bank A', role: '商业银行；准备金是资产，客户存款和央行 repo 是负债' },
  { id: 'bankB', label: 'Bank B', role: '另一家商业银行；用于显示准备金只重分配的情形' },
  { id: 'external', label: 'Treasury / Households', role: '合并展示政府央行存款、家庭银行存款和现金的资产迁移' },
];

export const ledgerOperations: LedgerOperation[] = [
  {
    id: 'interbank',
    label: '01 · BANK PAYMENT',
    title: 'A 的客户向 B 的客户支付 20',
    trigger: 'A 的准备金子账户转给 B；两家客户存款同步迁移。',
    entries: {
      centralBank: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['总资产 0'], liabilitiesEquity: ['A 准备金 −20', 'B 准备金 +20', '准备金负债净额 0'] },
      bankA: { assetDelta: -20, liabilityEquityDelta: -20, assets: ['准备金 −20'], liabilitiesEquity: ['客户存款 −20'] },
      bankB: { assetDelta: 20, liabilityEquityDelta: 20, assets: ['准备金 +20'], liabilitiesEquity: ['客户存款 +20'] },
      external: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['付款人银行存款 −20', '收款人银行存款 +20'], liabilitiesEquity: ['合并净值 0'] },
    },
    systemReserveDelta: 0,
    distribution: 'R_A −20、R_B +20；系统总量不变。',
    causalBoundary: '这是系统内部重分配，不创造也不消灭央行负债。',
  },
  {
    id: 'government-spending',
    label: '02 · GOVERNMENT SPENDING',
    title: '政府向 Bank A 的家庭客户支付 30',
    trigger: '央行把政府存款负债转换为 Bank A 的准备金负债。',
    entries: {
      centralBank: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['总资产 0'], liabilitiesEquity: ['政府存款 −30', 'Bank A 准备金 +30'] },
      bankA: { assetDelta: 30, liabilityEquityDelta: 30, assets: ['准备金 +30'], liabilitiesEquity: ['客户存款 +30'] },
      bankB: zero,
      external: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['政府央行存款 −30', '家庭银行存款 +30'], liabilitiesEquity: ['合并净值 0'] },
    },
    systemReserveDelta: 30,
    distribution: '系统准备金 +30，首先记入 Bank A。',
    causalBoundary: '会计方向不等于政府支出的宏观乘数，也不把财政动作自动归为货币宽松。',
  },
  {
    id: 'tax',
    label: '03 · TAX PAYMENT',
    title: 'Bank A 的家庭客户向政府缴税 25',
    trigger: 'Bank A 的准备金负债在央行账本上转为政府存款负债。',
    entries: {
      centralBank: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['总资产 0'], liabilitiesEquity: ['Bank A 准备金 −25', '政府存款 +25'] },
      bankA: { assetDelta: -25, liabilityEquityDelta: -25, assets: ['准备金 −25'], liabilitiesEquity: ['客户存款 −25'] },
      bankB: zero,
      external: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['家庭银行存款 −25', '政府央行存款 +25'], liabilitiesEquity: ['合并净值 0'] },
    },
    systemReserveDelta: -25,
    distribution: '系统准备金 −25；政府央行存款等额增加。',
    causalBoundary: '这不是央行出售资产；资产端没有变化。',
  },
  {
    id: 'repo',
    label: '04 · REPO INJECTION',
    title: '央行向 Bank A 做 40 的 repo',
    trigger: '央行取得 repo claim，Bank A 取得准备金并承担 repo payable。',
    entries: {
      centralBank: { assetDelta: 40, liabilityEquityDelta: 40, assets: ['Repo claim +40'], liabilitiesEquity: ['Bank A 准备金 +40'] },
      bankA: { assetDelta: 40, liabilityEquityDelta: 40, assets: ['准备金 +40'], liabilitiesEquity: ['对央行 repo 应付款 +40'] },
      bankB: zero,
      external: zero,
    },
    systemReserveDelta: 40,
    distribution: '系统准备金 +40，期限届满且不续作时反向。',
    causalBoundary: 'repo 是有抵押、可到期的资金供给；用途与定价决定它是常规实施还是压力工具。',
  },
  {
    id: 'cash-withdrawal',
    label: '05 · CASH WITHDRAWAL',
    title: '家庭从 Bank A 存款取现 15',
    trigger: 'Bank A 从央行领取现金交给家庭；准备金与现金在央行负债端互换。',
    entries: {
      centralBank: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['总资产 0'], liabilitiesEquity: ['Bank A 准备金 −15', '流通现金 +15'] },
      bankA: { assetDelta: -15, liabilityEquityDelta: -15, assets: ['准备金 −15'], liabilitiesEquity: ['客户存款 −15'] },
      bankB: zero,
      external: { assetDelta: 0, liabilityEquityDelta: 0, assets: ['银行存款 −15', '持有现金 +15'], liabilitiesEquity: ['家庭净值 0'] },
    },
    systemReserveDelta: -15,
    distribution: '系统准备金 −15，流通现金 +15；央行总资产不变。',
    causalBoundary: '现金需求是自治因素；“央行资产负债表未缩小”不等于准备金没有下降。',
  },
];

export type FrameworkMode = 'corridor' | 'floor' | 'tiered' | 'demandDriven';

export const frameworkModes: {
  id: FrameworkMode;
  label: string;
  supplyRule: string;
  remunerationRule: string;
  numericRole: string;
}[] = [
  { id: 'corridor', label: 'Scarce corridor', supplyRule: '央行把显式供给放在需求曲线斜坡并主动微调。', remunerationRule: '存放与贷款便利提供主体特异的软外部选项。', numericRole: '制度解释层；本图的 Q 仍由滑块外生给定，不求解央行的日常微调规则。' },
  { id: 'floor', label: 'Supply-driven floor', supplyRule: '央行先给定较高供给；需求满足后曲线趋平。', remunerationRule: '边际准备金按同一管理率计息。', numericRole: '制度解释层；本图不自动把 Q 移到平坦区，学习者须用同一曲线比较区域。' },
  { id: 'tiered', label: 'Tiered floor', supplyRule: '总量由既有资产负债表给定。', remunerationRule: '高报酬配额与低报酬超额层使平均率和边际率分离。', numericRole: '唯一进入数值读数的模式开关：超过冻结配额后，边际报酬惩罚与平均惩罚分离。' },
  { id: 'demandDriven', label: 'Demand-driven ample', supplyRule: '央行报出操作价格，合格银行按规则和抵押品内生取用。', remunerationRule: '价格与资格约束需求；full allotment 不等于免费无限供给。', numericRole: '制度解释层；本图不求解固定报价下的内生取用量，Q 仍是用于比较的外生情景。' },
];

export const reserveCurveParameters = {
  lowerSpreadBp: 2,
  spreadRangeBp: 78,
  midpoint: 45,
  steepness: 7,
  tierQuota: 55,
  tierPenaltyBp: 10,
} as const;

export function reserveDemandSpreadBp(reserveSupply: number, demandShift: number) {
  const p = reserveCurveParameters;
  return p.lowerSpreadBp + p.spreadRangeBp / (1 + Math.exp((reserveSupply - (p.midpoint + demandShift)) / p.steepness));
}

export function reserveRegion(reserveSupply: number, demandShift: number) {
  const effectiveQuantity = reserveSupply - demandShift;
  if (effectiveQuantity < 35) return 'scarce';
  if (effectiveQuantity < 70) return 'ample';
  return 'abundant';
}

export function frameworkMetrics(mode: FrameworkMode, reserveSupply: number, demandShift: number) {
  const baseSpread = reserveDemandSpreadBp(reserveSupply, demandShift);
  const tieredMarginalPenalty = mode === 'tiered' && reserveSupply > reserveCurveParameters.tierQuota
    ? reserveCurveParameters.tierPenaltyBp
    : 0;
  const tieredAveragePenalty = mode === 'tiered' && reserveSupply > reserveCurveParameters.tierQuota
    ? reserveCurveParameters.tierPenaltyBp * (reserveSupply - reserveCurveParameters.tierQuota) / reserveSupply
    : 0;
  return {
    baseSpreadBp: baseSpread,
    marginalSpreadBp: baseSpread + tieredMarginalPenalty,
    averageRemunerationPenaltyBp: tieredAveragePenalty,
    marginalRemunerationPenaltyBp: tieredMarginalPenalty,
    region: reserveRegion(reserveSupply, demandShift),
  };
}

export type FrameworkCurvePoint = {
  reserveSupply: number;
  marginalSpreadBp: number;
};

export function frameworkCurvePoints(mode: FrameworkMode, demandShift: number): FrameworkCurvePoint[] {
  return Array.from({ length: 91 }, (_, index) => 10 + index).flatMap((reserveSupply) => {
    const point = {
      reserveSupply,
      marginalSpreadBp: frameworkMetrics(mode, reserveSupply, demandShift).marginalSpreadBp,
    };

    if (mode !== 'tiered' || reserveSupply !== reserveCurveParameters.tierQuota) return [point];

    const rightLimitQuantity = reserveSupply + 1e-6;
    return [
      point,
      {
        reserveSupply,
        marginalSpreadBp: frameworkMetrics(mode, rightLimitQuantity, demandShift).marginalSpreadBp,
      },
    ];
  });
}

const tieredCurveRegressionPoints = frameworkCurvePoints('tiered', 0);
const tieredQuotaPoints = tieredCurveRegressionPoints.filter(
  (point) => point.reserveSupply === reserveCurveParameters.tierQuota,
);

export const frameworkAssertions = [
  {
    id: 'slope-left-shift',
    statement: '在斜坡区把供给从 50 左移到 40，会提高 spread。',
    passed: reserveDemandSpreadBp(40, 0) > reserveDemandSpreadBp(50, 0),
  },
  {
    id: 'flat-small-change',
    statement: '同样减少 10 个单位，平坦区的 spread 变化小于斜坡区。',
    passed: reserveDemandSpreadBp(80, 0) - reserveDemandSpreadBp(90, 0) < reserveDemandSpreadBp(40, 0) - reserveDemandSpreadBp(50, 0),
  },
  {
    id: 'leaky-floor',
    statement: '毛利差 8bp、可执行中介成本 10bp 时，表面地板可以泄漏。',
    passed: 8 - 10 < 0,
  },
  {
    id: 'tier-marginal-vs-average',
    statement: '总量 80、配额 55 时，分层计息使边际报酬惩罚大于平均惩罚。',
    passed: frameworkMetrics('tiered', 80, 0).marginalRemunerationPenaltyBp > frameworkMetrics('tiered', 80, 0).averageRemunerationPenaltyBp,
  },
  {
    id: 'tier-curve-quota-step',
    statement: '分层计息曲线在 Q=55 同一横坐标显式画出右侧 10bp 边际报酬阶跃。',
    passed: tieredQuotaPoints.length === 2
      && Math.abs(
        tieredQuotaPoints[1].marginalSpreadBp - tieredQuotaPoints[0].marginalSpreadBp
          - reserveCurveParameters.tierPenaltyBp,
      ) < 1e-4,
  },
  {
    id: 'tier-curve-slider-points',
    statement: '配额后 Q=56、59、60、80 的曲线样本均与滑块公式读数一致。',
    passed: [56, 59, 60, 80].every((reserveSupply) => {
      const plottedPoint = tieredCurveRegressionPoints.find((point) => point.reserveSupply === reserveSupply);
      return plottedPoint !== undefined
        && Math.abs(plottedPoint.marginalSpreadBp - frameworkMetrics('tiered', reserveSupply, 0).marginalSpreadBp) < 1e-12;
    }),
  },
] as const;
