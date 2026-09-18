export type RiskLimitMode = 'measure' | 'govern';
export type RiskLimitChoice = 'a' | 'b' | 'c';

export type RiskLimitScenario = {
  id: string;
  mode: RiskLimitMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: RiskLimitChoice; label: string; diagnosis: string }[];
  correct: RiskLimitChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  staticTwin: { title: string; prompt: string; answer: string };
};

export const riskLimitModes: { id: RiskLimitMode; label: string; title: string; description: string }[] = [
  { id: 'measure', label: 'MODE A', title: '把持仓翻译成风险用量', description: '冻结损失符号、窗口、置信水平和模型，再计算 VaR、ES、相关性与多限额可行规模。' },
  { id: 'govern', label: 'MODE B', title: '把风险状态翻译成治理动作', description: '区分 warning、alert、confirmed breach、exception、order、fill 与重新计量，禁止从超限直接跳到卖单。' },
];

export const riskLimitScenarios: RiskLimitScenario[] = [
  {
    id: 'delta-normal-var',
    mode: 'measure',
    label: '计量实验 01 · Delta-normal VaR',
    title: '线性股票头寸的一日 99% VaR 是多少，它没有承诺什么？',
    brief: '冻结为零均值、正态、线性的一日教学模型。某账户持有 $20m 的股票多头，日收益标准差为 1.5%，标准正态 99% 单尾分位数 z₉₉=2.33。损失 L=−ΔV，正数表示亏损。',
    facts: [
      { label: 'Position', value: '$20m long', note: '本题只做局部线性映射' },
      { label: 'Daily volatility', value: '1.5%', note: '冻结为条件标准差' },
      { label: 'Quantile', value: 'z₉₉ = 2.33', note: '一日、单尾、正态' },
    ],
    options: [
      { id: 'a', label: 'VaR=$300k，且表示单日最多只会亏 $300k', diagnosis: '少乘了 z₉₉，而且 VaR 从来不是最大损失承诺。' },
      { id: 'b', label: 'VaR=$699k；只是在冻结模型下的 99% 损失分位点', diagnosis: '正确。20m×1.5%×2.33=699k；尾部 1% 仍可能出现更大损失。' },
      { id: 'c', label: 'VaR=$46.6m，因为应把头寸除以 1.5% 再乘 2.33', diagnosis: '单位和方向都错。波动率把名义头寸映射为损益尺度，不是容量分母。' },
    ],
    correct: 'b',
    calculation: '$20m × 0.015 × 2.33 = $0.699m。公式依赖线性、条件正态、零均值和一日窗口；改变任一项都要重算。',
    reveal: '“99%”不是模型有99%概率正确，也不是有99%概率不亏。它只把冻结损失分布切在一个指定分位点。',
    revisit: '回看 06–16「条件损失分布、Quantile、VaR 定义与 Parametric VaR」。',
    staticTwin: {
      title: '变式 01 · 一日 95% 线性 VaR',
      prompt: '线性多头为 $12m，日波动 2%，零均值正态模型的 z₉₅=1.645。计算一日 95% VaR，并写出一句边界。',
      answer: '$12m×2%×1.645=$394,800。它只是冻结正态线性模型下的95%分位点，不是最大损失。',
    },
  },
  {
    id: 'horizon-scaling',
    mode: 'measure',
    label: '计量实验 02 · Horizon Scaling',
    title: '什么时候可以用平方根时间近似把一日 VaR 换成十日？',
    brief: '某线性持仓的一日 VaR 为 $1m。题目明确冻结：每日损益独立同分布、条件波动稳定、均值忽略、期间不调仓且不存在跳跃或流动性成本。求十日近似。',
    facts: [
      { label: '1-day VaR', value: '$1.000m', note: '同一置信水平与模型' },
      { label: 'Horizon', value: '10 days', note: '期间不调仓' },
      { label: 'Teaching assumptions', value: 'iid + stable σ', note: '题目刻意允许 √h' },
    ],
    options: [
      { id: 'a', label: '约 $3.162m；只有题设的 iid、稳定波动与线性条件下才可这样缩放', diagnosis: '正确。$1m×√10≈$3.162m；这是条件近似，不是自然法则。' },
      { id: 'b', label: '$10m；任何多日风险都等于一日风险乘天数', diagnosis: '直接线性相加忽略损益抵消与方差累计；题设下应按方差随时间相加。' },
      { id: 'c', label: '仍是 $1m；VaR 的置信水平不变，所以持有期不影响随机变量', diagnosis: '置信水平相同不代表损失窗口相同；一日和十日 VaR 描述不同随机变量。' },
    ],
    correct: 'a',
    calculation: 'VaR₁₀≈VaR₁×√10=$3.162m。自相关、波动聚集、跳跃、非线性、调仓和市场冲击都会破坏这一步。',
    reveal: '持有期不是 VaR 标签旁的装饰。它决定损失累计多久，也应与治理反应、退出能力和估值频率相匹配。',
    revisit: '回看 09、16 与 22「Holding Period、Horizon Scaling 与 Liquidity Horizon」。',
    staticTwin: {
      title: '变式 02 · 五日平方根时间近似',
      prompt: '一日 VaR=$600k，且题目同样保证 iid、稳定波动、线性与期间不调仓。计算五日近似。',
      answer: '$600k×√5≈$1.342m。若这些假设不成立，不能机械使用该结果。',
    },
  },
  {
    id: 'correlation-aggregation',
    mode: 'measure',
    label: '计量实验 03 · Correlation Aggregation',
    title: '两项风险为什么既不能直接相加，也不能假定会完全抵消？',
    brief: '在同一零均值（或均值已单独剥离）的线性椭圆损失模型、同一持有期和置信水平下，A 与 B 的 volatility VaR kασ 分别为 $3m 与 $4m，损失相关系数 ρ=0.25。用题设聚合式计算组合 VaR。',
    facts: [
      { label: 'VaR A', value: '$3m', note: '零均值 volatility VaR' },
      { label: 'VaR B', value: '$4m', note: '零均值 volatility VaR' },
      { label: 'Correlation', value: 'ρ = 0.25', note: '冻结为模型输入' },
    ],
    options: [
      { id: 'a', label: '$7m，因为任何风险限额都必须把 standalone VaR 全额相加', diagnosis: '在本题零均值椭圆模型中，$7m 对应ρ=1；脱离该模型，stand-alone VaR之和也不保证是组合VaR上界。' },
      { id: 'b', label: '$1m，因为 4−3 表示两项风险自动对冲', diagnosis: 'Standalone VaR 没有给出方向，也不能从数值大小推导完全对冲。' },
      { id: 'c', label: '约 $5.568m，来自 √(3²+4²+2×0.25×3×4)', diagnosis: '正确。组合风险依赖联合分布；压力期相关性改变时仍需重新估计。' },
    ],
    correct: 'c',
    calculation: 'VaRₚ=√(9+16+6)=√31≈$5.568m。该公式继承线性、同口径与椭圆分布等条件。',
    reveal: 'Diversification 是联合损失分布的状态依赖结果，不是一笔可永久存入账户的固定折扣。',
    revisit: '回看 17–18「Portfolio Aggregation 与 Incremental Risk」。',
    staticTwin: {
      title: '变式 03 · 负相关但不完全对冲',
      prompt: '同一零均值线性椭圆模型中，两项同口径 volatility VaR 为 $2m 与 $5m，损失相关系数ρ=−0.2。按同一聚合式计算组合 VaR。',
      answer: '√(2²+5²+2×(−0.2)×2×5)=√25=$5m；负相关减少风险，但没有把组合风险降到3m或0。',
    },
  },
  {
    id: 'var-es-tail',
    mode: 'measure',
    label: '计量实验 04 · VaR 与 Expected Shortfall',
    title: '同一组离散损失里，VaR 为什么看不见最坏尾部的平均严重度？',
    brief: '有 100 个等概率损失情景，已按从小到大排序。前 95 个损失都不超过 $2m，且第 95 个恰为 $2m；最坏五个依次为 $3m、$4m、$5m、$6m、$12m。采用 order-statistic VaR 与最坏 5% 等权平均 ES。',
    facts: [
      { label: 'Sample', value: '100 equal scenarios', note: '每个概率质量为1%' },
      { label: '95th loss', value: '$2m', note: '冻结分位数约定' },
      { label: 'Worst five', value: '3, 4, 5, 6, 12', note: '单位均为 $m' },
    ],
    options: [
      { id: 'a', label: 'VaR₉₅=$12m，ES₉₅=$2m', diagnosis: '把最大损失当VaR、把分位点当ES，两个概念都倒置。' },
      { id: 'b', label: 'VaR₉₅=$2m，ES₉₅=$6m', diagnosis: '正确。ES=(3+4+5+6+12)/5=6；VaR只定位尾部入口。' },
      { id: 'c', label: 'VaR₉₅=ES₉₅=$6m，因为两者都表示最坏5%的平均值', diagnosis: 'VaR是分位点，ES才概括尾部平均；离散分布还必须声明边界质量约定。' },
    ],
    correct: 'b',
    calculation: 'VaR₉₅=$2m；ES₉₅=($3m+$4m+$5m+$6m+$12m)/5=$6m。最大损失$12m既不是VaR也不是ES。',
    reveal: 'ES 比 VaR 多告诉你“越过门槛后平均多严重”，但它仍受样本、模型、估值和流动性假设约束。',
    revisit: '回看 19–21「Expected Shortfall、VaR/ES 信息差与 Tail Shape」。',
    staticTwin: {
      title: '变式 04 · 90% VaR 与 ES',
      prompt: '100个等权情景中，第90个损失为$1m；最坏十个为2、2、2、2、2、4、4、4、8、10（单位$m）。按同一约定计算 VaR₉₀ 与 ES₉₀。',
      answer: 'VaR₉₀=$1m；ES₉₀=(2+2+2+2+2+4+4+4+8+10)/10=$4m。',
    },
  },
  {
    id: 'constraint-stack',
    mode: 'measure',
    label: '计量实验 05 · Constraint Stack',
    title: 'VaR 有余量，为什么原候选交易仍可能不在 pre-trade feasible set？',
    brief: '单位均为 $m，候选交易的增量已经由完整组合重估得到。当前 VaR usage=4.10、limit=5.00、交易增量=+0.45；stress usage=11.50、limit=12.00、交易增量=+1.00。两项都是适用 hard limits。',
    facts: [
      { label: 'VaR post-trade', value: '4.10 + 0.45', note: 'limit 5.00' },
      { label: 'Stress post-trade', value: '11.50 + 1.00', note: 'limit 12.00' },
      { label: 'Rule', value: 'all applicable hard limits must be satisfied', note: '不能跨指标抵消' },
    ],
    options: [
      { id: 'a', label: '可以批准，因为 post-trade VaR=4.55 仍低于5.00', diagnosis: '只检查了一个约束；stress usage 会升到12.50并超限。' },
      { id: 'b', label: '可以批准，因为 VaR headroom 0.90 足以抵消 stress excess 0.50', diagnosis: '不同指标、情景和单位口径的headroom不能互相转账。' },
      { id: 'c', label: '不能按原方案批准：VaR合规，但 stress=12.50 超过12.00', diagnosis: '正确。约束栈中任一适用 hard limit 不满足，原候选动作就不在合规可行集中。' },
    ],
    correct: 'c',
    calculation: 'Post-trade VaR=4.55≤5.00；post-trade stress=12.50>12.00。决策由binding constraint决定。',
    reveal: '机构风险治理需要一个指标向量。VaR、ES、stress、concentration、liquidity 和 Greeks 回答不同问题。',
    revisit: '回看 24 与 29–35「Risk Measure Stack、Limit 规格与 Constraint Stack」。',
    staticTwin: {
      title: '变式 05 · 降低 VaR 仍可能增加集中度',
      prompt: 'VaR limit=6.0、usage=5.7、候选动作增量=−0.4；concentration limit=10.0、usage=9.6、候选动作增量=+0.7。是否合规？',
      answer: '不合规。Post-trade VaR=5.3，但 concentration=10.3 超过10.0；降低一个指标不能豁免另一硬约束。',
    },
  },
  {
    id: 'market-driven-breach',
    mode: 'govern',
    label: '治理实验 01 · Market-driven Breach',
    title: '没有任何新交易，为什么仍可能出现真实 limit breach？',
    brief: 'Actual position 未变，模型版本与估计规则也未变；新市场观测进入既定滚动窗口后，条件波动率按已授权日终流程上升，VaR usage 从 $4.0m 升至 $5.8m。有效 hard limit=$5.0m，仓位、市场数据、FX和limit版本均已复核正确。',
    facts: [
      { label: 'Position change', value: '0', note: '没有新fill' },
      { label: 'Validated usage', value: '$5.8m', note: '此前为$4.0m' },
      { label: 'Effective limit', value: '$5.0m', note: '版本核对无误' },
    ],
    options: [
      { id: 'a', label: '确认 market-state/input-driven breach，再由有权主体选择处置', diagnosis: '正确。既定模型吸收新市场状态后超限；原因不是新交易或模型版本变更，下一步也不是自动卖出。' },
      { id: 'b', label: '不存在 breach，因为只有交易员主动加仓才可能超限', diagnosis: 'Usage会随市场、波动、相关性、非线性和模型输入改变，即使actual position不变。' },
      { id: 'c', label: '系统必须立刻卖出16%的全部资产且无需验证或审批', diagnosis: 'Breach首先是治理状态；减仓比例和工具要由规则、授权、流动性和组合重算决定。' },
    ],
    correct: 'a',
    calculation: 'Headroom=limit−usage=5.0−5.8=−$0.8m，故为confirmed breach；触发源是既定模型读取的新市场状态，不是新仓fill或模型变更。',
    reveal: '“为何超限”与“是否超限”是两列字段。Trade、market、model、data 和 limit change 都可能改变状态。',
    revisit: '回看 37–43「状态机、Cause Taxonomy、Validation Gate 与 Breach≠卖出」。',
    staticTwin: {
      title: '变式 06 · 相关性更新触发超限',
      prompt: '两腿仓位未变，但相关性从0.1升至0.8后组合usage超过有效limit；所有输入经核验正确。应如何分类？',
      answer: '若模型版本与估计规则未变、只是既定流程吸收新市场相关性，这是market-state/input-driven confirmed breach，不是新交易或模型变更；应按authority matrix选择处置。',
    },
  },
  {
    id: 'data-alert',
    mode: 'govern',
    label: '治理实验 02 · Data Alert',
    title: '系统先报超限，为什么验证门可能把它改写成数据控制事件？',
    brief: '系统显示 usage=$5.2m、limit=$4.0m。Pending-validation 核对发现同一笔仓位被重复入账；删除重复记录并以同一市场与模型重算后，正确 usage=$2.6m。',
    facts: [
      { label: 'Alert usage', value: '$5.2m', note: '尚未验证' },
      { label: 'Data defect', value: 'duplicated position', note: '同一仓位两次入账' },
      { label: 'Validated usage', value: '$2.6m', note: 'limit=$4.0m' },
    ],
    options: [
      { id: 'a', label: '仍应卖掉$1.2m风险，因为系统一旦报警就不能撤销', diagnosis: '把未验证alert当confirmed breach；经济减仓会在正确usage已合规时制造新风险。' },
      { id: 'b', label: '直接删除报警记录，不必保留原因，因为最终没有经济超限', diagnosis: '风险usage合规不等于数据控制无事发生；应保留审计轨迹、根因与修复证据。' },
      { id: 'c', label: '修复重复仓位、重算并关闭风险alert，同时单独闭环data incident', diagnosis: '正确。经济风险状态与数据质量事件要分开记录，不能相互吞掉。' },
    ],
    correct: 'c',
    calculation: '验证后 headroom=4.0−2.6=$1.4m；不存在经济hard-limit breach，但重复入账暴露了需要修复的数据控制缺陷。',
    reveal: 'Validation gate 不是拖延处置，而是防止用错误仓位、价格、FX、净额或版本生成真实订单。',
    revisit: '回看 36–40「Authority、Alert、Cause Taxonomy、Validation 与 Remediation Clock」。',
    staticTwin: {
      title: '变式 07 · 过期 FX 制造虚假超限',
      prompt: '跨币种usage因昨日FX被误作今日汇率而超限；更新正确时间戳后usage回到limit内。需要什么动作？',
      answer: '修复FX输入、重算并保留data incident与影响范围；若正确usage合规，不为消除虚假alert而经济减仓。',
    },
  },
  {
    id: 'warning-threshold',
    mode: 'govern',
    label: '治理实验 03 · Warning Threshold',
    title: '超过预警线但没有超过 hard limit，应叫什么状态？',
    brief: '同一metric、scope与时点下，warning threshold=8.0，hard limit=10.0，validated usage=8.4。政策规定 warning 触发监控与限制新增风险，但只有 usage>10.0 才是 hard-limit breach。',
    facts: [
      { label: 'Warning', value: '8.0', note: '提前干预阈值' },
      { label: 'Hard limit', value: '10.0', note: '授权边界' },
      { label: 'Usage', value: '8.4', note: '已验证' },
    ],
    options: [
      { id: 'a', label: 'Normal，因为usage仍小于hard limit，warning没有任何治理含义', diagnosis: '忽略了已获授权的预警状态及其监控/限制增险动作。' },
      { id: 'b', label: 'Warning；执行预警政策，但不能报告为hard-limit breach', diagnosis: '正确。Warning与breach是不同状态，触发器和处置权限也不同。' },
      { id: 'c', label: 'Confirmed breach，且必须立即把usage降到0', diagnosis: '把预警线当hard limit，并虚构了清零要求。' },
    ],
    correct: 'b',
    calculation: '8.0<8.4≤10.0，因此状态为warning；hard-limit headroom仍为10.0−8.4=1.6。',
    reveal: '同一条仪表盘可以同时显示“离边界很近”和“尚未超越授权边界”，两句话并不矛盾。',
    revisit: '回看 29–32 与 37「Limit 规格、Warning/Hard、Usage、Headroom 与状态机」。',
    staticTwin: {
      title: '变式 08 · 不要用四舍五入制造 Warning',
      prompt: 'warning=8.0、hard limit=10.0、精确usage=7.96；仪表盘展示一位小数时为8.0，但政策明确用未舍入底层值判断状态。状态是什么？',
      answer: '仍是normal。7.96没有越过warning=8.0；展示层四舍五入不能制造warning，除非政策事先明确以舍入值作为控制输入。',
    },
  },
  {
    id: 'hedge-remediation',
    mode: 'govern',
    label: '治理实验 04 · Hedge Remediation',
    title: '为什么 hedge fill 可以恢复合规，而“已经发单”还不够？',
    brief: 'ES usage=$11.2m、limit=$10.0m。经授权的流动性对冲预计减少$2.0m ES；直接清仓的market impact更大。对冲已完全成交，按actual fill与最新市场重算后的usage=$9.2m；其他适用hard limits均合规，审批、根因和审计证据也已满足本机构closure policy。',
    facts: [
      { label: 'Pre-action usage', value: '$11.2m', note: 'confirmed breach' },
      { label: 'Approved hedge', value: '−$2.0m expected', note: '不是未授权改limit' },
      { label: 'Retested usage', value: '$9.2m', note: '基于actual fill' },
    ],
    options: [
      { id: 'a', label: '可按题设政策关闭：actual fill后重算9.2，且其他closure条件均满足', diagnosis: '正确。Remediation 可以是对冲；完成标准是actual effect、全约束retest与治理证据，不是动作名称。' },
      { id: 'b', label: '不能关闭，因为任何breach都只能卖出现有资产，hedge不算降险', diagnosis: '治理目标是恢复适用风险边界，不要求唯一工具；对冲可能比直接出售更有效。' },
      { id: 'c', label: '发出hedge order时就应立即关闭，无需等待成交或重算', diagnosis: 'Order不改变actual position；部分成交、滑点与相关性变化都可能使预计降险落空。' },
    ],
    correct: 'a',
    calculation: '经actual fill重算，headroom=10.0−9.2=$0.8m。若只有候选order而无fill，usage仍应按原actual position计量。',
    reveal: 'Breach closure 是“动作生效并通过重新计量”的状态，不是“有人提出了一个好计划”。',
    revisit: '回看 41–44「Response Choice、Exception、Breach边界与 Order–Fill–Retest」。',
    staticTwin: {
      title: '变式 09 · 未成交对冲不能关闭事件',
      prompt: 'Usage=11、limit=10；已发送预计降低2的hedge order，但市场尚无任何fill。当前状态是什么？',
      answer: '仍是execution pending/confirmed breach；actual position与usage尚未改变，不能用target或order代替fill。',
    },
  },
  {
    id: 'unauthorized-limit-change',
    mode: 'govern',
    label: '治理实验 05 · Limit Ownership',
    title: '把 limit 从10改成13，为什么既可能无效，也不会让经济风险消失？',
    brief: 'Validated usage=12、effective hard limit=10。Desk manager 没有limit ownership或exception authority，却把本地表格阈值改成13；正式limit registry和审批记录均未变化。',
    facts: [
      { label: 'Usage', value: '12', note: '已验证且未下降' },
      { label: 'Effective limit', value: '10', note: '正式registry版本' },
      { label: 'Local edit', value: '13', note: '未经授权' },
    ],
    options: [
      { id: 'a', label: 'Breach已自动关闭，因为任何经理都能把limit改到高于usage', diagnosis: '权限错误；本地表格不是有效授权，也没有改变正式limit版本。' },
      { id: 'b', label: '经济风险已从12降到10，因为新数字吸收了2单位usage', diagnosis: 'Limit是行政边界，不是损失分布；提高阈值不会改变持仓或经济usage。' },
      { id: 'c', label: 'Confirmed breach仍在；只有有权主体可改limit或批准有期限例外', diagnosis: '正确。即使日后获批例外，usage仍为12，风险和到期复评义务都不会消失。' },
    ],
    correct: 'c',
    calculation: '有效headroom=10−12=−2。未经授权的本地阈值没有法律/治理效力，且不改变actual position、模型或usage。',
    reveal: '授权状态和经济风险是两条轴：合规边界可以经正式治理改变，但不能把行政动作叙述成风险已经下降。',
    revisit: '回看 29、36、42 与 44「Limit规格、Authority、Temporary Exception 与 Closure」。',
    staticTwin: {
      title: '变式 10 · 有期限 Exception 仍不等于降险',
      prompt: 'CRO按权限批准usage=12相对limit=10的临时exception，明日12:00到期，并附停止增险与每小时监控条件。批准后能说什么？',
      answer: '状态变为authorized temporary exception；经济usage仍是12，附加控制与到期复评继续生效，不能称风险已降到10。',
    },
  },
];
