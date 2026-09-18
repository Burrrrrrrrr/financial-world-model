export type LaborMode = 'measurement' | 'mechanism';
export type LaborChoice = 'a' | 'b' | 'c';

export type LaborScenario = {
  id: string;
  mode: LaborMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: LaborChoice; label: string; diagnosis: string }[];
  correct: LaborChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
  numericAssertions: { key: string; expected: number; unit: string; tolerance?: number }[];
};

export const laborModes: { id: LaborMode; label: string; title: string; description: string }[] = [
  { id: 'measurement', label: 'MODE A', title: '先把就业与工资量对', description: '校准 E/U/N 分母、persons/jobs、gross flows、平均工资构成和 cash/total compensation。' },
  { id: 'mechanism', label: 'MODE B', title: '再把松紧接到工资、家庭与资产', description: '复算 matching、tightness、Beveridge shift、工资重置、家庭收入与就业 surprise。' },
];

export const laborMarketScenarios: LaborScenario[] = [
  {
    id: 'unemployment-denominator-exit', mode: 'measurement', label: '测量实验 01 · Denominator',
    title: '没有任何人找到工作，失业率为什么仍从 3.75% 降到约 2.53%？',
    brief: '工作年龄人口固定为 200.0 百万人；期初 E=154.0、U=6.0、N=40.0 百万人。其后恰有 2.0 百万名失业者停止主动搜索，由 U 转入 N；没有其他流动，搜索、可工作性和人口口径不变。',
    facts: [
      { label: 'E / U / N before', value: '154.0 / 6.0 / 40.0m persons', note: '三状态和为 200m' },
      { label: 'Only flow', value: 'U→N = 2.0m persons', note: '不是新增就业' },
      { label: 'Rates', value: 'u=U/LF · LFPR=LF/WAP · EPOP=E/WAP', note: '三个分母必须分别保存' },
    ],
    options: [
      { id: 'a', label: 'u：3.75%→2.5316%，下降 1.2184pp；EPOP 仍为 77%，LFPR 80%→79%，没有新增就业', diagnosis: '正确。U 减少的同时劳动力分母由 160 降至 158；失业率下降来自 U→N，而非 U→E。' },
      { id: 'b', label: '新失业率为 2.5%，因为 4/160；退出搜索等于新增 2 百万就业', diagnosis: '分母错误地冻结在 160，也把非劳动力误写为就业。' },
      { id: 'c', label: '就业人数没变，所以失业率仍是 3.75%', diagnosis: '失业率分子和劳动力分母都可以在 E 不变时变化。' },
    ],
    correct: 'a',
    calculation: '① LF₀=154+6=160m，u₀=6/160=3.75%。② E₁=154m、U₁=4m、N₁=42m、LF₁=158m。③ u₁=4/158≈2.53165%，下降约 1.21835pp。④ EPOP 保持 154/200=77%；LFPR 由 80% 降至 79%。',
    reveal: '失业率下降可能来自就业增加，也可能来自停止搜索。方向判断必须并列 U、LFPR、EPOP 和 U→E/U→N gross flows。',
    revisit: '回看 05「E/U/N」、07「失业资格」与 08「u、LFPR、EPOP」。',
    sourceIds: [1, 2, 3, 4], staticSourceIds: [1, 3],
    staticTwin: { title: '变式 01 · 失业者退出分母', prompt: 'E=90、U=10、N=20m；4m 由 U→N，其余冻结。求失业率、EPOP 与 LFPR 的变化。', answer: 'u：10%→6/96=6.25%，下降 3.75pp；EPOP 保持 75%；LFPR 由 100/120≈83.3333% 降至 96/120=80%，下降约 3.3333pp。' },
    numericAssertions: [
      { key: 'u0', expected: 3.75, unit: '%' }, { key: 'u1', expected: 2.531645569620253, unit: '%' },
      { key: 'du', expected: -1.218354430379747, unit: 'pp' }, { key: 'epop', expected: 77, unit: '%' },
      { key: 'lfpr0', expected: 80, unit: '%' }, { key: 'lfpr1', expected: 79, unit: '%' },
    ],
  },
  {
    id: 'persons-versus-payroll-jobs', mode: 'measurement', label: '测量实验 02 · Persons / Jobs',
    title: '就业人数增加 0.6 百万，为什么岗位数可以增加 1.0 百万？',
    brief: '使用同一教学总体；每名就业者至少一份工作，所有多重就业者恰有两份工作，无三份工作、自雇覆盖差异、调查误差或 benchmark 修订。期初就业者 100.0m，其中双职者 8.0m；期末就业者 100.6m，其中双职者 8.4m。',
    facts: [
      { label: 'Employed persons', value: '100.0→100.6m persons', note: '住户侧人数' },
      { label: 'Two-job persons', value: '8.0→8.4m persons', note: '每人恰有两份工作' },
      { label: 'Frozen ledger', value: 'jobs = employed + two-job persons', note: '只隔离一人多岗' },
    ],
    options: [
      { id: 'a', label: 'Persons 与 jobs 都增加 1.0m，因为一个人只能对应一个岗位', diagnosis: '违反双职者假设，混淆 person 与 job。' },
      { id: 'b', label: '岗位只增加 0.4m，因为只需看双职者变化', diagnosis: '遗漏新增 0.6m 就业者各自带来的一份主工作。' },
      { id: 'c', label: 'Persons +0.6m（+0.6%），jobs +1.0m（+0.9259%）；后者还含双职者 +0.4m', diagnosis: '正确。两个序列的单位和基数均不同。' },
    ],
    correct: 'c',
    calculation: '① J₀=(100−8)×1+8×2=108m jobs。② J₁=(100.6−8.4)+8.4×2=109m jobs。③ Persons 增 0.6m，即 0.6%；jobs 增 1.0m，即 1/108≈0.92593%。④ 1.0=0.6+0.4m。',
    reveal: '现实 household/payroll 还会因自雇、行业覆盖、人口控制、企业出生死亡和参考期而分叉；本题仅隔离“一人多岗”。',
    revisit: '回看 02「Person / Job / Match / Contract」、10「Persons / Payroll Jobs」与 11「Household / Establishment」。',
    sourceIds: [5, 6, 7, 8], staticSourceIds: [5, 8],
    staticTwin: { title: '变式 02 · 主工作与第二份工作', prompt: '就业者 50.0→50.3m，双职者 5.0→5.2m；其他假设同题。求人与岗位的增量及增长率。', answer: 'Jobs 55.0→55.5m；persons +0.3m（+0.6%），jobs +0.5m（约 +0.90909%）；0.3m 来自新增就业，0.2m 来自更多双职者。' },
    numericAssertions: [
      { key: 'jobs0', expected: 108, unit: 'm jobs' }, { key: 'jobs1', expected: 109, unit: 'm jobs' },
      { key: 'personsGrowth', expected: 0.6, unit: '%' }, { key: 'jobsGrowth', expected: 0.925925925925926, unit: '%' },
    ],
  },
  {
    id: 'eun-gross-flow-hazards', mode: 'measurement', label: '测量实验 03 · Gross Flows',
    title: '失业存量减少 0.9 百万，为什么当月仍发生了 7.2 百万次状态转换？',
    brief: '期初 E=90、U=6、N=24m persons；每人当月最多记录一次状态转换。六项流量为 E→U=1.8、E→N=0.9、U→E=2.4、U→N=0.6、N→E=1.2、N→U=0.3m。',
    facts: [
      { label: 'Origin stocks', value: 'E / U / N = 90 / 6 / 24m', note: '期初风险集' },
      { label: 'Gross flows', value: '1.8 · .9 · 2.4 · .6 · 1.2 · .3m', note: '六个方向各自保留' },
      { label: 'Hazard', value: 'flow / origin stock', note: '不是 destination share' },
    ],
    options: [
      { id: 'a', label: 'Job-finding hazard=2.4/(2.4+0.6)=80%', diagnosis: '80% 是离开 U 后流向 E 的条件份额；相对于期初全部 U 的 U→E hazard 是 40%。' },
      { id: 'b', label: 'E₁=90.9、U₁=5.1、N₁=24m；U→E hazard=40%，U exit=50%，E→U=2%；u 降 0.9375pp', diagnosis: '正确，逐项保留流入、流出和各自风险集。' },
      { id: 'c', label: 'U 减少 2.4m，因为找到工作的流量就是失业净变化', diagnosis: '遗漏 E→U、N→U 和 U→N；gross flow 不能直接改名为 stock change。' },
    ],
    correct: 'b',
    calculation: '① E₁=90+2.4+1.2−1.8−0.9=90.9m。② U₁=6+1.8+0.3−2.4−0.6=5.1m。③ N₁=24.0m；gross transitions=7.2m。④ U→E=2.4/6=40%，U exit=3/6=50%，E→U=1.8/90=2%。⑤ u：6/96=6.25%→5.1/96=5.3125%，下降 0.9375pp。',
    reveal: '净失业变化很小可以掩盖高 churn；hazard 必须以期初 origin stock 为分母，不能拿目的地份额或净变化替代。',
    revisit: '回看 03「Stock / Flow / Hazard」与 20–23 的 ins-and-outs。',
    sourceIds: [47, 48, 49], staticSourceIds: [47, 49],
    staticTwin: { title: '变式 03 · 相同存量下的多向流动', prompt: 'E/U/N=80/8/12m；E→U=1.6、E→N=.8、U→E=2、U→N=1、N→E=.6、N→U=.4m。求期末存量、gross flows、关键 hazards 和 u。', answer: 'E₁=80.2、U₁=7、N₁=12.8m；gross=6.4m；U→E=25%，U exit=37.5%，E→U=2%；u 由 8/88≈9.09091% 降至 7/87.2≈8.02752%，下降约 1.06339pp。' },
    numericAssertions: [
      { key: 'E1', expected: 90.9, unit: 'm persons' }, { key: 'U1', expected: 5.1, unit: 'm persons' },
      { key: 'N1', expected: 24, unit: 'm persons' }, { key: 'gross', expected: 7.2, unit: 'm transitions' },
      { key: 'jobFinding', expected: 40, unit: '%' }, { key: 'uExit', expected: 50, unit: '%' },
      { key: 'du', expected: -0.9375, unit: 'pp' },
    ],
  },
  {
    id: 'average-wage-composition', mode: 'measurement', label: '测量实验 04 · Wage Composition',
    title: '没有任何岗位加薪，平均时薪为什么仍上涨约 2.56%？',
    brief: '同一周、同一 payroll 覆盖；低薪组时薪固定 $20，高薪组固定 $50。期初 paid hours 为 800k/200k；期末低薪 hours 降至 700k，高薪仍 200k。无奖金、加班溢价、岗位质量或工资率变化。',
    facts: [
      { label: 'Wage rates', value: '$20/h and $50/h', note: '两期均不变' },
      { label: 'Paid hours', value: '800k / 200k → 700k / 200k', note: '低薪工时退出样本' },
      { label: 'Average', value: 'total wage bill / total paid hours', note: '分子分母共同变化' },
    ],
    options: [
      { id: 'a', label: '平均工资增长为 0，因为两组工资率都没变', diagnosis: '忽略高薪组在总工时中的权重上升。' },
      { id: 'b', label: '平均工资下降 10%，因为总工时下降 10%', diagnosis: '总工时变化不是平均时薪变化；必须同时计算工资总额分子。' },
      { id: 'c', label: '平均时薪 $26→$26.6667（+2.5641%），但工资总额 $26m→$24m（−7.6923%）', diagnosis: '正确。平均工资上涨完全来自低薪工时退出样本。' },
    ],
    correct: 'c',
    calculation: '① Bill₀=800k×20+200k×50=$26m，H₀=1,000k，平均 $26/h。② Bill₁=700k×20+200k×50=$24m，H₁=900k，平均约 $26.66667/h。③ 平均时薪约 +2.56410%；工资总额约 −7.69231%。',
    reveal: '聚合平均工资同时受组内工资和样本权重影响；应与 fixed-job index、分位数工资及 aggregate hours 并列。',
    revisit: '回看 15「Wage Object Map」、17「Mean / Median / Quantiles」与 18「Composition Effect」。',
    sourceIds: [5, 6, 12, 13, 14, 30, 31, 37], staticSourceIds: [12, 14, 37],
    staticTwin: { title: '变式 04 · 平均时薪上升、工资总额下降', prompt: '低薪 $15/h、高薪 $45/h；hours 900k/100k→800k/100k，两组工资率不变。求平均时薪和工资总额变化。', answer: '平均时薪 $18→$18.33333，约 +1.85185%；工资总额 $18m→$16.5m，约 −8.33333%；两组组内工资增长均为 0。' },
    numericAssertions: [
      { key: 'average0', expected: 26, unit: '$/h' }, { key: 'average1', expected: 26.666666666666667, unit: '$/h' },
      { key: 'averageGrowth', expected: 2.564102564102564, unit: '%' }, { key: 'billGrowth', expected: -7.692307692307692, unit: '%' },
    ],
  },
  {
    id: 'cash-wage-total-compensation', mode: 'measurement', label: '测量实验 05 · Compensation',
    title: '现金工资上涨 5%，为什么雇主总薪酬成本上涨约 9.29%？',
    brief: '每小时现金工资 $30→$31.50，雇主福利及缴费成本 $12→$14.40；工时、岗位构成、福利估值和税务口径不变。福利是 employer cost，不自动等于员工当期可支配现金。',
    facts: [
      { label: 'Cash wage', value: '$30→$31.50/h', note: '+5%' },
      { label: 'Benefits / contributions', value: '$12→$14.40/h', note: '+20%' },
      { label: 'Compensation', value: 'cash + employer benefits', note: '企业成本口径' },
    ],
    options: [
      { id: 'a', label: '总薪酬也只涨 5%，因为工资是唯一劳动成本', diagnosis: '遗漏福利和雇主缴费。' },
      { id: 'b', label: '总薪酬 $42→$45.90，增长 9.2857%；福利成本份额上升约 2.8011pp', diagnosis: '正确，且区分增长百分比与份额百分点。' },
      { id: 'c', label: '总薪酬增长 25%，即 5%+20%，而且全部成为家庭现金收入', diagnosis: '错误相加不同基数的增长率，也混淆 employer cost 与 take-home cash。' },
    ],
    correct: 'b',
    calculation: '① C₀=30+12=$42/h。② C₁=31.5+14.4=$45.9/h。③ 增长=45.9/42−1≈9.28571%。④ 福利份额由 12/42≈28.57143% 升至 14.4/45.9≈31.37255%，上升约 2.80112pp。',
    reveal: '家庭消费接口更接近现金 earnings、税和转移；企业招聘接口更接近完整 compensation。二者不能互换。',
    revisit: '回看 15「Wage Object Map」与 16「Cash Wage / Total Compensation」。',
    sourceIds: [12, 13, 14, 20], staticSourceIds: [13, 20],
    staticTwin: { title: '变式 05 · 工资与福利不同速', prompt: 'Cash $24→$24.72（+3%），benefits $6→$6.60（+10%）。求 compensation 增速与福利份额变化。', answer: 'Compensation $30→$31.32，增长 4.4%；福利份额由 20% 升至约 21.07280%，上升约 1.07280pp。' },
    numericAssertions: [
      { key: 'comp0', expected: 42, unit: '$/h' }, { key: 'comp1', expected: 45.9, unit: '$/h' },
      { key: 'compGrowth', expected: 9.285714285714286, unit: '%' }, { key: 'benefitShareDelta', expected: 2.801120448179273, unit: 'pp' },
    ],
  },
  {
    id: 'matching-tightness-two-hazards', mode: 'mechanism', label: '机制实验 01 · Tightness',
    title: '职位空缺翻倍后，求职者更容易找到工作，为什么每个 vacancy 反而更难填？',
    brief: '月度 constant-returns matching function M=μ√(UV)；μ=0.50/月，U 固定 8m persons，V 由 4m 增至 8m jobs。无匹配效率、招聘强度、构成或期内库存反馈变化；M/U 与 M/V 作为题设月度 hazard。',
    facts: [
      { label: 'Unemployed U', value: '8m persons', note: '期初风险集冻结' },
      { label: 'Vacancies V', value: '4→8m jobs', note: '岗位存量翻倍' },
      { label: 'Efficiency μ', value: '0.50 / month', note: 'θ=V/U' },
    ],
    options: [
      { id: 'a', label: 'θ：0.5→1；M：2.8284→4m/月；finding 35.3553%→50%，filling 70.7107%→50%', diagnosis: '正确。紧度上升同时改善 worker-side hazard、降低 vacancy-side hazard。' },
      { id: 'b', label: 'M 增加 41.42%，所以 finding 和 filling hazard 都增加 41.42%', diagnosis: '两个 hazard 的分母分别是 U 与 V；V 同时翻倍。' },
      { id: 'c', label: 'θ=U/V，因此由 2 降至 1；这证明 matching efficiency 下降', diagnosis: '倒置 tightness 定义，并把数量变化误写为效率变化。' },
    ],
    correct: 'a',
    calculation: '① θ₀=4/8=.5，θ₁=8/8=1。② M₀=.5√32≈2.82843m，M₁=.5√64=4m，约 +41.42136%。③ f：M/U≈35.35534%→50%。④ q：M/V≈70.71068%→50%。',
    reveal: 'Tightness 是双边拥挤状态，不是充分统计量；现实还需 matching efficiency、recruiting intensity、岗位构成和搜索强度。',
    revisit: '回看 27「Matching Function」、28「Tightness」与 29「Finding / Filling」。',
    sourceIds: [39, 40, 41, 42, 43], staticSourceIds: [39, 41],
    staticTwin: { title: '变式 06 · 匹配数增加、填岗率下降', prompt: 'U=9m，V：1→4m，μ=.30/月，其他冻结。求 θ、M、finding 与 filling。', answer: 'θ：1/9→4/9，增长 300%；M：.9→1.8m/月；finding 10%→20%，上升 10pp；filling 90%→45%，下降 45pp。' },
    numericAssertions: [
      { key: 'M0', expected: 2.82842712474619, unit: 'm/month' }, { key: 'M1', expected: 4, unit: 'm/month' },
      { key: 'f0', expected: 35.35533905932738, unit: '%' }, { key: 'f1', expected: 50, unit: '%' },
      { key: 'q0', expected: 70.71067811865476, unit: '%' }, { key: 'q1', expected: 50, unit: '%' },
    ],
  },
  {
    id: 'beveridge-movement-versus-shift', mode: 'mechanism', label: '机制实验 02 · Beveridge Curve',
    title: '失业率上升、空缺率下降何时只是沿曲线移动，何时才叫 outward shift？',
    brief: '教学 reduced-form curve 为 v_pp=K/u_pp，率以百分数数值代入，因此 K 的单位是 pp²。点 A=(u=5%,v=4%)；点 B=(8%,2.5%)；点 C=(8%,4%)。指标定义和季调不变。',
    facts: [
      { label: 'Point A', value: 'u=5% · v=4% · K=20pp²', note: '旧曲线起点' },
      { label: 'Point B', value: 'u=8% · v=2.5% · K=20pp²', note: '旧曲线上' },
      { label: 'Point C', value: 'u=8% · v=4% · K=32pp²', note: '同一 u、更多 v' },
    ],
    options: [
      { id: 'a', label: 'A→B 与 B→C 都是沿曲线移动，因为 u 与 v 仍呈负相关', diagnosis: 'B→C 在相同 u 下出现更高 v，已不在旧 K=20 曲线上。' },
      { id: 'b', label: 'A→B 是 outward shift；B→C 是需求移动', diagnosis: '分类正好颠倒。' },
      { id: 'c', label: 'A→B 沿 K=20 的旧曲线；B→C 使 K 由 20 升至 32（+60%），是冻结模型中的 outward shift', diagnosis: '正确，但 shift 身份仍不自动识别匹配效率下降的具体原因。' },
    ],
    correct: 'c',
    calculation: '① K_A=5×4=20pp²。② 旧曲线在 u=8% 时预测 v=20/8=2.5%，故 B 仍在旧曲线。③ K_C=8×4=32pp²，比旧 K 高 12pp² 或 60%；C 的 v 比旧曲线预测高 1.5pp。',
    reveal: 'Outward shift 可来自 mismatch、recruiting intensity、搜索行为、构成、制度或测量变化；一两个点不足以识别原因。',
    revisit: '回看 31「Beveridge Movement」、32「Shift」与 30「Recruiting Intensity」。',
    sourceIds: [39, 50, 51, 52, 53], staticSourceIds: [39, 53],
    staticTwin: { title: '变式 07 · 同一失业率下空缺更高', prompt: '旧曲线 K=18pp²，A=(u=6%,v=3%)；u 升至 9% 时旧曲线预测 v=2%，实际 v=3%。判断 movement 与 shift。', answer: 'A→预测点沿旧曲线；实际 K=9×3=27pp²，比 18 高 50%，是冻结模型中的 outward shift；实际 v 比旧曲线高 1pp 或 50%。' },
    numericAssertions: [
      { key: 'KA', expected: 20, unit: 'pp²' }, { key: 'KB', expected: 20, unit: 'pp²' },
      { key: 'KC', expected: 32, unit: 'pp²' }, { key: 'shift', expected: 60, unit: '%' },
    ],
  },
  {
    id: 'new-hire-incumbent-wage-reset', mode: 'mechanism', label: '机制实验 03 · Wage Reset',
    title: '新雇工资下降 10%，为什么当月聚合合同工资只下降 1%？',
    brief: '所有岗位、技能和工时完全同质，期初工资均为 $30/h。需求冲击后，90% incumbent hours 的合同当月不能重置，仍为 $30；10% new-hire/reset hours 可按 $27 签约。权重固定，无构成变化。',
    facts: [
      { label: 'Initial wage', value: '$30/h for all', note: '同质岗位' },
      { label: 'Reset share', value: '10% of hours', note: '其余合同冻结' },
      { label: 'Reset wage', value: '$27/h', note: '相对期初 −10%' },
    ],
    options: [
      { id: 'a', label: 'Incumbent 0%、new/reset −10%、aggregate $30→$29.70（−1%）', diagnosis: '正确。只有 10% 的合同边际吸收了本期冲击。' },
      { id: 'b', label: '聚合工资也下降 10%，因为新雇工资代表所有劳动者', diagnosis: '把边际重置工资直接外推到存量合同。' },
      { id: 'c', label: 'Incumbent 工资未变，证明劳动力需求和 slack 均未变化', diagnosis: '名义刚性会使数量或新合同比存量工资先调整。' },
    ],
    correct: 'a',
    calculation: '① W̄₀=.9×30+.1×30=$30/h。② W̄₁=.9×30+.1×27=$29.70/h。③ 聚合工资 −1%；new/reset wage −10%；incumbent 0%。④ 当期聚合传导比例为 10%，等于冻结 reset share。',
    reveal: '现实 new-hire wage 还受岗位和人员选择影响；题设用同质岗位冻结构成，只隔离合同重置。工资刚性也不意味着总调整消失，它可能转向招聘、工时或就业。',
    revisit: '回看 48「Nominal Wage Rigidity」与 49「Incumbent / New-hire」。',
    sourceIds: [46, 68, 69, 70, 71, 72], staticSourceIds: [46, 71],
    staticTwin: { title: '变式 08 · 重置份额决定聚合速度', prompt: '期初全为 $40/h；80% incumbent 不变，20% reset wage 降 8% 至 $36.80。求聚合工资。', answer: '聚合工资=.8×40+.2×36.8=$39.36/h，下降 1.6%；reset wage 下降 8%，incumbent 为 0。' },
    numericAssertions: [
      { key: 'aggregate0', expected: 30, unit: '$/h' }, { key: 'aggregate1', expected: 29.7, unit: '$/h' },
      { key: 'aggregateGrowth', expected: -1, unit: '%' }, { key: 'resetGrowth', expected: -10, unit: '%' },
    ],
  },
  {
    id: 'household-labor-income-bridge', mode: 'mechanism', label: '机制实验 04 · Household Income',
    title: '工资率上涨 4%、就业增加 1%，家庭劳动相关可支配现金为什么不是简单上涨 5%？',
    brief: 'E、每人月工时 h 和现金时薪 w 来自同一覆盖与月份。期初 E=100m、h=160、w=$25；期末 E=101m、h=156.8、w=$26。转移支付 $20bn→$24bn，劳动收入直接税 $60bn→$63bn；其余收入、福利、缴费、家庭形成和价格均冻结。',
    facts: [
      { label: 'E × h × w', value: '100m×160×$25 → 101m×156.8×$26', note: '同一覆盖与月份' },
      { label: 'Transfers', value: '$20bn→$24bn', note: '家庭现金流入' },
      { label: 'Direct taxes', value: '$60bn→$63bn', note: '家庭现金流出' },
    ],
    options: [
      { id: 'a', label: '劳动现金收入精确增长 1%−2%+4%=3%，可支配现金也增长 3%', diagnosis: '加法只是小变化近似，并遗漏税和转移。' },
      { id: 'b', label: '劳动现金收入 $400bn→$411.7568bn（+2.9392%）；教学可支配现金 $360bn→$372.7568bn（+3.5436%）', diagnosis: '正确，完整穿过就业、工时、工资、税和转移。' },
      { id: 'c', label: '劳动收入增长 5.04%，因为只需 1.01×1.04；福利成本也应全部加入家庭现金', diagnosis: '遗漏工时下降，也混淆 employer compensation 与家庭现金。' },
    ],
    correct: 'b',
    calculation: '① Earnings₀=100m×160×$25=$400bn。② 期末乘数=1.01×.98×1.04=1.029392。③ Earnings₁=$411.7568bn，+2.9392%。④ 教学 disposable₀=400+20−60=$360bn；期末=411.7568+24−63=$372.7568bn，约 +3.54356%。',
    reveal: '工资率必须先穿过就业、工时和覆盖，才成为劳动现金收入；再经过税、转移和其他收入才接近 household disposable income。本题不是完整官方个人收入账户。',
    revisit: '回看 14「Hours」、15–16「Wage Objects / Compensation」与 57「Household Income」。',
    sourceIds: [122, 123, 124], staticSourceIds: [122, 123, 124],
    staticTwin: { title: '变式 09 · 人数、工时、工资、税与转移', prompt: 'E=50m、h=150、w=$20；期末 E+2%、h−1%、w+3%；transfers $10→$11.5bn，taxes $25→$27bn。求劳动收入与教学可支配现金。', answer: 'Earnings $150bn→$156.0141bn，增长 4.0094%；教学可支配现金 $135bn→$140.5141bn，增长约 4.08452%。' },
    numericAssertions: [
      { key: 'earnings0', expected: 400, unit: '$bn' }, { key: 'earnings1', expected: 411.7568, unit: '$bn' },
      { key: 'earningsGrowth', expected: 2.9392, unit: '%' }, { key: 'disposable0', expected: 360, unit: '$bn' },
      { key: 'disposable1', expected: 372.7568, unit: '$bn' }, { key: 'disposableGrowth', expected: 3.543555555555556, unit: '%' },
    ],
  },
  {
    id: 'payroll-surprise-asset-dashboard', mode: 'mechanism', label: '机制实验 05 · Surprise / Assets',
    title: 'Payroll 高于预期 100k jobs，为什么不能直接把股票反应命名为“加息交易”？',
    brief: '同一 payroll 指标公布前预期 +150k jobs，初值 +250k，历史同口径预测误差标准差 50k。前月由 +100k 修订为 +60k。题设两期净 news=本月 surprise+前月 revision；其他同时新闻冻结。2y yield +12bp=expected path +9bp+term premium +3bp；股指 +0.40%=cash-flow +1.10pp−real-rate .50pp−risk-premium .20pp。',
    facts: [
      { label: 'Current payroll', value: 'actual +250k · expected +150k · σ=50k', note: '同一指标与 vintage' },
      { label: 'Prior revision', value: '+100k→+60k = −40k jobs', note: '修订属于新信息' },
      { label: 'Event window', value: '2y +12bp · equity +0.40%', note: '已给定分解' },
    ],
    options: [
      { id: 'a', label: 'z=100/150=0.67；净就业新闻 +140k；12bp 等于收益率上涨 12%', diagnosis: '分别错用了预测值作尺度、错加 revision 符号，并把 bp 当百分比。' },
      { id: 'b', label: 'z=+2、净新闻 +60k，所以股票 +0.40% 唯一证明增长现金流通道占主导，全部 12bp 也是政策路径', diagnosis: '前两项算术正确，但无视题设给出的 term-premium、real-rate 和 risk-premium 分解。' },
      { id: 'c', label: 'Headline error=+100k、z=+2；两期净 news=+60k；12bp=9+3bp；equity .40pp=1.10−.50−.20pp', diagnosis: '正确。Surprise、revision、yield decomposition 与 equity decomposition 是四个不同对象。' },
    ],
    correct: 'c',
    calculation: '① Error=250−150=+100k jobs。② z=100/50=+2。③ Revision=60−100=−40k；题设两期净 news=100−40=+60k。④ 2y +12bp=+0.12pp=9+3bp。⑤ Equity=1.10−.50−.20=+0.40pp。',
    reveal: '同一正就业 surprise 可在不同增长、通胀和政策状态下改变现金流、预期短率与风险溢价；实时研究必须保存 release timestamp、pre-release expectation、revision vintage 和事件窗。',
    revisit: '回看 19「Data Clock」、56「No Single Sufficient Statistic」与 59「Asset Interface」。',
    sourceIds: [5, 8, 104, 111, 112, 114], staticSourceIds: [5, 111, 112],
    staticTwin: { title: '变式 10 · Headline、revision 与价格分解', prompt: 'Actual +220k、expected +160k、σ=30k；前月 +80k 修订为 +50k。2y +8bp=path +5bp+TP +3bp；equity −.20%=cash-flow +.70pp−real-rate .60pp−risk-premium .30pp。求各项。', answer: 'Headline error +60k，z=+2；revision −30k，题设两期净 news +30k；yield +8bp=+.08pp；equity=.70−.60−.30=−.20pp。' },
    numericAssertions: [
      { key: 'headlineError', expected: 100, unit: 'k jobs' }, { key: 'z', expected: 2, unit: 'sd' },
      { key: 'revision', expected: -40, unit: 'k jobs' }, { key: 'netNews', expected: 60, unit: 'k jobs' },
      { key: 'yield', expected: 12, unit: 'bp' }, { key: 'equity', expected: 0.4, unit: '%' },
    ],
  },
];
