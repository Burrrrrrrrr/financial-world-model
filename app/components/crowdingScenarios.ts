export type CrowdingMode = 'ledger' | 'evidence';
export type CrowdingChoice = 'a' | 'b' | 'c';

export type CrowdingScenario = {
  id: string;
  mode: CrowdingMode;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  options: { id: CrowdingChoice; label: string; diagnosis: string }[];
  correct: CrowdingChoice;
  calculation: string;
  reveal: string;
  revisit: string;
  sourceIds: number[];
  staticSourceIds: number[];
  staticTwin: { title: string; prompt: string; answer: string };
};

export const crowdingModes: { id: CrowdingMode; label: string; title: string; description: string }[] = [
  { id: 'ledger', label: 'MODE A', title: '把共同暴露变成可复核的拥挤账本', description: '冻结证券映射、方向、组合规模、流量协方差和成交容量，计算 overlap、cosine、HHI、flow fragility 与 exit days。' },
  { id: 'evidence', label: 'MODE B', title: '把拥挤指标变成有边界的机制判断', description: '区分共同 benchmark、active view、herding、报告时滞、short 数据与案例证据，判断静态重叠何时仍不足以证明同步踩踏。' },
];

export const crowdingScenarios: CrowdingScenario[] = [
  {
    id: 'minimum-overlap', mode: 'ledger', label: '账本实验 01 · Minimum Overlap',
    title: '两个 long-only 组合的共同资本暴露究竟是多少？',
    brief: '基金 A 在 X/Y/Z 的长期经济暴露为 60%/40%/0，基金 B 为 30%/20%/50%。两边总长期暴露都为 100%，证券映射、币种和估值时点一致。使用共同暴露除以较小组合总暴露的 minimum-overlap 定义。',
    facts: [
      { label: 'Fund A', value: '60% · 40% · 0%', note: 'X / Y / Z long exposure' },
      { label: 'Fund B', value: '30% · 20% · 50%', note: '同一证券全集' },
      { label: 'Denominator', value: 'min(total long A, total long B)', note: '两边均为 100%' },
    ],
    options: [
      { id: 'a', label: 'Minimum overlap 为 30%', diagnosis: '只取了 X 的较小权重，漏掉两只基金在 Y 上共同持有的 20%。' },
      { id: 'b', label: 'Minimum overlap 为 50%', diagnosis: '正确。逐证券取较小暴露，再除以较小组合的总长期暴露。' },
      { id: 'c', label: 'Minimum overlap 为 100%，因为两只基金都全额投资', diagnosis: '全额投资只规定各自总权重，不表示资本落在相同证券上。' },
    ],
    correct: 'b',
    calculation: 'O_min=[min(60,30)+min(40,20)+min(0,50)]/min(100,100)=(30+20+0)/100=50%。',
    reveal: '50% 是静态共同长期暴露，不说明两只基金使用同一信号、会在同一时点卖出，或这些资产相对退出流动性已经过大。',
    revisit: '回看 23–25「Minimum overlap、cosine 与二部网络」。',
    sourceIds: [16, 17], staticSourceIds: [16, 17],
    staticTwin: { title: '变式 01 · 另一组 minimum overlap', prompt: '基金 C 的 X/Y/Z 暴露为 70%/30%/0，基金 D 为 20%/30%/50%，两边总长期暴露均为 100%。求 minimum overlap。', answer: 'O_min=[min(70,20)+min(30,30)+min(0,50)]/100=(20+30)/100=50%。' },
  },
  {
    id: 'signed-gross-cosine', mode: 'ledger', label: '账本实验 02 · Signed / Gross Cosine',
    title: '经济暴露大小完全相同、方向完全相反时，为什么两个 cosine 会给出相反结论？',
    brief: '两资产 long–short 组合 A 的有符号暴露为 (+0.6, −0.8)，组合 B 为 (−0.6, +0.8)。两者均已换算到相同 delta-adjusted 经济暴露单位；gross cosine 先对各分量取绝对值。',
    facts: [
      { label: 'Signed A', value: '(+0.6, −0.8)', note: '保留多空方向' },
      { label: 'Signed B', value: '(−0.6, +0.8)', note: '与 A 完全反向' },
      { label: 'Vector norm', value: '1 for both', note: '√(0.6²+0.8²)=1' },
    ],
    options: [
      { id: 'a', label: 'Signed cosine=+1，gross cosine=−1', diagnosis: '把保留方向与去掉方向的定义颠倒了。' },
      { id: 'b', label: '两个 cosine 都为 0，因为净敞口都接近零', diagnosis: 'Cosine 比较向量方向，不以净敞口之和作为分母。' },
      { id: 'c', label: 'Signed cosine=−1，gross cosine=+1', diagnosis: '正确。两者押注方向完全相反，但使用了完全相同的风险载体和绝对规模形状。' },
    ],
    correct: 'c',
    calculation: 'Signed dot=0.6×(−0.6)+(−0.8)×0.8=−1，norm product=1，故 cosine=−1；取绝对值后 dot=0.6²+0.8²=1，gross cosine=+1。',
    reveal: 'Signed overlap 回答方向是否一致，gross overlap 回答是否依赖相同风险载体；short crowd 和对手方压力研究通常需要两者并列。',
    revisit: '回看 24「Signed、Gross 与 Active Cosine」。',
    sourceIds: [18, 19], staticSourceIds: [18, 19],
    staticTwin: { title: '变式 02 · 同方向、同形状', prompt: '组合 E 与 F 的有符号暴露都为 (+0.8,+0.6)。求 signed 与 gross cosine。', answer: '两者向量完全相同，signed cosine=+1；取绝对值后仍相同，gross cosine=+1。' },
  },
  {
    id: 'ownership-hhi', mode: 'ledger', label: '账本实验 03 · Ownership HHI',
    title: '三名可观察持有人占一只证券的 50%/30%/20%，集中度是多少？',
    brief: '研究数据覆盖该证券全部可观察机构持有量，三名持有人的份额为 50%、30%、20%。题目先在 0–1 比例上计算 HHI，再换算到常用的 0–10,000 标度；这里不推断他们的卖出触发器。',
    facts: [
      { label: 'Holder shares', value: '0.50 · 0.30 · 0.20', note: '合计为 1' },
      { label: 'HHI definition', value: 'Σ sᵢ²', note: '先用比例而非百分数' },
      { label: 'Scaled HHI', value: 'raw HHI × 10,000', note: '便于常见报告展示' },
    ],
    options: [
      { id: 'a', label: 'Raw HHI=0.38；换算后为 3,800', diagnosis: '正确。份额平方后相加，而不是先把份额相加再平方。' },
      { id: 'b', label: 'Raw HHI=1；换算后为 10,000', diagnosis: '把合计份额 1 的平方误作 HHI，丢失了持有人分布。' },
      { id: 'c', label: 'Raw HHI=0.10；换算后为 1,000', diagnosis: '没有按 0.50²+0.30²+0.20² 计算。' },
    ],
    correct: 'a',
    calculation: 'HHI=0.50²+0.30²+0.20²=0.25+0.09+0.04=0.38；0–10,000 标度为 3,800。',
    reveal: 'HHI 只测所有权集中，未读取流量相关性、杠杆、期限或承接能力；集中既可能放大单一持有人冲击，也可能让大持有人内生考虑价格影响。',
    revisit: '回看 26 与 54「所有权集中、覆盖率及稳定性反例」。',
    sourceIds: [16, 29], staticSourceIds: [16, 29],
    staticTwin: { title: '变式 03 · 四名等权持有人', prompt: '四名持有人各占 25%，求 raw HHI 与 0–10,000 标度。', answer: 'Raw HHI=4×0.25²=0.25；换算后为 2,500。它低于 50/30/20 的 3,800。' },
  },
  {
    id: 'flow-fragility', mode: 'ledger', label: '账本实验 04 · Flow Covariance',
    title: '持仓集中度不变时，为什么持有人流量相关性仍会改变 fragility？',
    brief: '两只基金各占证券 K 的可观察基金持仓一半，h=(0.5,0.5)。两基金标准化流量冲击方差都为 1。情景 A 的流量相关系数为 0，情景 B 为 0.8。使用教学式 Fragility=h′Ωh。',
    facts: [
      { label: 'Holding vector', value: 'h=(0.5,0.5)', note: '两个情景完全相同' },
      { label: 'Flow variance', value: '1 and 1', note: '标准化单位' },
      { label: 'Flow correlation', value: 'A: 0 · B: 0.8', note: '只改变共同流量冲击' },
    ],
    options: [
      { id: 'a', label: 'A=0.50，B=0.90；B 是 A 的 1.8 倍', diagnosis: '正确。相关流量增加协方差交叉项，即使 HHI 与持仓完全不变。' },
      { id: 'b', label: 'A 与 B 都为 0.50，因为持仓向量相同', diagnosis: '忽略了 Ω 中的非对角流量协方差。' },
      { id: 'c', label: 'A=0，B=0.80，因为只需读取相关系数', diagnosis: 'Fragility 同时读取持仓权重、各自流量方差和协方差。' },
    ],
    correct: 'a',
    calculation: 'Fragility=0.5²+0.5²+2×0.5×0.5×ρ=0.50+0.50ρ；ρ=0 时为 0.50，ρ=0.8 时为 0.90，比例 0.90/0.50=1.8。',
    reveal: '相同 HHI 可以对应不同流量脆弱性；实际研究还必须统一基金流量定义、持仓规模、证券流通市值和时间窗口。',
    revisit: '回看 30「Flow Fragility 与 Exit Days」。',
    sourceIds: [16, 20], staticSourceIds: [16, 20],
    staticTwin: { title: '变式 04 · 负相关流量', prompt: '保持 h=(0.5,0.5)、两边流量方差为 1，若流量相关系数为 −0.2，求 Fragility。', answer: 'Fragility=0.50+0.50×(−0.2)=0.40。负相关流量在该线性教学式中提供部分抵消。' },
  },
  {
    id: 'exit-days', mode: 'ledger', label: '账本实验 05 · Exit Days',
    title: '计划出售 1,800 万股、只占日成交量 20% 时，至少需要多少个教学日？',
    brief: '所有受约束持有人合计希望出售证券 M 的 1,800 万股。正常时期平均日成交量 ADV 为 600 万股，执行团队设定参与率 ρ=20%。题设暂时假设 ADV 与参与率在执行期间不变，不把该比率当作价格冲击模型。',
    facts: [
      { label: 'Required sale', value: '18m shares', note: '目标出售量，不等于已成交' },
      { label: 'Normal ADV', value: '6m shares/day', note: '历史正常状态均值' },
      { label: 'Participation cap', value: '20% of ADV', note: '每日最多 1.2m 股' },
    ],
    options: [
      { id: 'a', label: '3 天，因为 18/6=3', diagnosis: '把全部市场成交量都当成自己的可用容量，忽略 20% 参与率。' },
      { id: 'b', label: '15 天，因为 18/(0.2×6)=15', diagnosis: '正确。这是固定容量假设下的执行时间代理。' },
      { id: 'c', label: '90 天，因为还要再除一次 20%', diagnosis: '参与率已经在每日可交易容量中使用了一次。' },
    ],
    correct: 'b',
    calculation: '每日可执行量=0.20×6m=1.2m 股；ExitDays=18m/1.2m=15 个交易日。',
    reveal: 'Position/ADV 或 exit days 不给出确定冲击成本；压力状态下 ADV、spread、depth 和自然买盘都会内生变化，15 天只是冻结假设下的容量诊断。',
    revisit: '回看 30「Flow Fragility 与 Exit Days」。',
    sourceIds: [16, 22, 28], staticSourceIds: [16, 22, 28],
    staticTwin: { title: '变式 05 · 更低参与率', prompt: '计划出售 12m 股，正常 ADV 4m 股，参与率上限 15%。在固定 ADV 假设下求 exit days。', answer: '每日容量=0.15×4m=0.6m 股；ExitDays=12m/0.6m=20 天。' },
  },
  {
    id: 'benchmark-versus-active', mode: 'evidence', label: '证据实验 01 · Common Benchmark',
    title: '两只基金持仓高度相似，已经证明共同主动观点或 herding 了吗？',
    brief: '两只 long-only 基金都相对同一市值加权指数管理，原始持仓 cosine 为 0.98。研究者没有相对 benchmark 的 active weights、经理信息集、target、order 或成交数据。两只基金的客户期限也不同。',
    facts: [
      { label: 'Raw holding cosine', value: '0.98', note: '绝对持仓高度相似' },
      { label: 'Common benchmark', value: 'same cap-weighted index', note: '共同被动底座' },
      { label: 'Missing evidence', value: 'active weights · decision dependence · fills', note: '无法观察主动意图与交易' },
    ],
    options: [
      { id: 'a', label: '已证明两位经理相互模仿，且会同步退出', diagnosis: '从原始持仓重叠越级推断动机、触发器与未来成交。' },
      { id: 'b', label: '只能确认共同持仓底座；还需 active overlap、触发器和决策依赖证据', diagnosis: '正确。共同 benchmark 可机械抬高原始 overlap，却不证明共同主动观点或 herding。' },
      { id: 'c', label: '共同 benchmark 保证 active weights 也相同', diagnosis: '相同基准不限制两位经理必须作出相同超配和低配。' },
    ],
    correct: 'b',
    calculation: '当前证据停在 raw position overlap。要检验主动观点，先计算 a_i=w_i−b_i；要检验 herding，还需证明一方决策因观察或预期他人行为而改变。',
    reveal: '共同 benchmark 是趋同输入，不是同步交易程序；raw、active、signed 与 gross overlap 必须按研究问题分别保存。',
    revisit: '回看 04、11、24 与 53「Herding 边界、共同基准、active overlap 和断链条件」。',
    sourceIds: [14, 15, 70], staticSourceIds: [18, 19, 71],
    staticTwin: { title: '变式 06 · 同一信号仍可生成不同组合', prompt: '两位经理都预测 X 相对 Y 上涨，但一位已重仓 X 且受单一证券上限约束，另一位当前低配 X 且融资宽松。能否仅由同一预测推出相同 target？', answer: '不能。existing inventory、benchmark、risk budget、concentration、funding 和 cost 会把相同 signal 映射成不同 target，甚至一个不交易、另一个买入。' },
  },
  {
    id: 'lsv-boundary', mode: 'evidence', label: '证据实验 02 · LSV Measure',
    title: 'LSV herding measure 很高，最多能支持什么结论？',
    brief: '某季度证券 N 的机构买方比例显著偏离市场整体买方比例，并已完成有限样本 adjustment，因此 LSV measure 较高。同期存在公开盈利公告和指数纳入，但研究者没有经理沟通、信号或逐笔决策资料。',
    facts: [
      { label: 'Observed statistic', value: 'high adjusted LSV', note: '同期买卖方向一致性' },
      { label: 'Common events', value: 'earnings + index inclusion', note: '可共同改变独立决策' },
      { label: 'Unobserved', value: 'private signals · imitation · mandate', note: '动机未识别' },
    ],
    options: [
      { id: 'a', label: '已证明非理性心理模仿', diagnosis: 'LSV 不观察主体为何同向交易，也不能排除共同公开信息和基准变化。' },
      { id: 'b', label: '已证明这些交易必然造成长期错价', diagnosis: '方向一致性不规定信息质量、承接深度或之后的收益路径。' },
      { id: 'c', label: '支持同期方向一致性；herding 动机与价格因果仍需额外设计', diagnosis: '正确。统计量回答行为形态，不直接识别决策依赖或市场影响。' },
    ],
    correct: 'c',
    calculation: 'LSV 当前识别层级：adjusted co-trading pattern。要推进到 herding mechanism，需控制共同信息、指数事件、流量与自身持仓惯性；要推进到 price impact，还需可信反事实。',
    reveal: '把名称叫作 herding measure 不会自动赋予它心理或因果含义；指标的统计对象必须与理论机制分开。',
    revisit: '回看 27–28、41–42 与 55「LSV、Sias、识别边界及 informed herding」。',
    sourceIds: [5, 6, 7, 8], staticSourceIds: [5, 6],
    staticTwin: { title: '变式 07 · 小样本的假一致', prompt: '只有两家机构交易某证券，恰好都买入。为什么不能只用 |p_kt−p_t| 宣称强 herding？', answer: '小样本下随机出现全部买入的概率并不低，必须做有限样本 adjustment，并继续排除共同信息、共同流量和基准事件。' },
  },
  {
    id: 'reporting-lag', mode: 'evidence', label: '证据实验 03 · Knowable When',
    title: '4 月 10 日的实时研究能否使用 3 月 31 日、5 月 15 日才公开的 13F 持仓？',
    brief: '一名机构经理的 Form 13F positionAsOf 为 3 月 31 日，filedAt/publicAt 为 5 月 15 日。研究者要构造只使用当时可知信息的 4 月 10 日 crowding signal；表中还没有股票短仓和完整衍生品。',
    facts: [
      { label: 'Position as of', value: '31 March', note: '经济状态时点' },
      { label: 'Filed / public', value: '15 May', note: '外部研究者最早可见时点' },
      { label: 'Signal date', value: '10 April', note: '早于公开日' },
    ],
    options: [
      { id: 'a', label: '可以，因为持仓经济上属于 3 月 31 日', diagnosis: '这会把 5 月才获得的信息回填到 4 月，形成 look-ahead bias。' },
      { id: 'b', label: '不可以；最早从公开日后使用，并仍须标记持仓陈旧与覆盖缺口', diagnosis: '正确。positionAsOf 与 publicAt 是不同的时间轴。' },
      { id: 'c', label: '可以，而且 13F 足以重建该经理的净股票与衍生品暴露', diagnosis: '不仅存在前视问题，13F 还缺股票短仓与完整衍生品。' },
    ],
    correct: 'b',
    calculation: '4 月 10 日满足 signalDate < publicAt，因此该记录当时不可用；即使 5 月 15 日后使用，也要保存 dataAge=publicAt−positionAsOf=45 天及 coverage。',
    reveal: '任何实时 crowding 研究都必须同时保存 positionAsOf、filedAt、publicAt 与 observedAt；否则漂亮的历史回测可能只是未来信息。',
    revisit: '回看 21–22 与 42「数据时钟、暴露映射和持仓识别边界」。',
    sourceIds: [52, 53, 54, 55], staticSourceIds: [53, 54, 55],
    staticTwin: { title: '变式 08 · Proposal 不是现行数据', prompt: '截至 2026-08-31，SEC 2026 Form N-PORT 页面仍标为 Proposed Rule，提案涉及月度申报并恢复季度公开。研究者能否假定 2026 年已经按提案的新时限申报，并取得更及时的公开数据？', answer: '不能。提案不是最终规则，2024 修订又已被正式延期；研究必须按当时有效的申报、公开结构和 2025 延期文件建立可得性，不能提前使用拟议时限。' },
  },
  {
    id: 'short-data-boundary', mode: 'evidence', label: '证据实验 04 · Short Data',
    title: '某日 short-sale volume 很高，是否已经证明 short interest 上升并即将 squeeze？',
    brief: 'FINRA 日度 short-sale volume 显著升高，但最近的 twice-monthly short-interest 快照尚未更新。研究者没有 lendable supply、utilization、borrow fee、recall terms、做市库存或可转债套利拆分。',
    facts: [
      { label: 'Observed', value: 'high daily short-sale volume', note: '交易流量，不是未平仓快照' },
      { label: 'Not yet observed', value: 'new short interest', note: '下一结算日数据未发布' },
      { label: 'Borrow state', value: 'unknown', note: 'supply、fee、recall 均缺失' },
    ],
    options: [
      { id: 'a', label: '已证明未平仓空头等额增加，并且 squeeze 即将发生', diagnosis: '交易流量可能在日内回补或来自做市/对冲，不能等额映射到期末未平仓。' },
      { id: 'b', label: '只能确认特定场所有较多 short-sale 标记成交；仓位与 squeeze 条件仍未知', diagnosis: '正确。还需 short interest、借券供给、费用、保证金、自然买盘和实际回补。' },
      { id: 'c', label: 'Short-sale volume 与 short interest 是同一指标，只是频率不同', diagnosis: '一个是交易流量，一个是结算日未平仓存量，数据生成过程不同。' },
    ],
    correct: 'b',
    calculation: 'Stock-flow discipline：daily short-sale volume 是期间 gross-like flow；short interest 是结算日 outstanding stock。没有开平仓配对与借券账本，二者不能相减或互换。',
    reveal: 'Short crowd 至少同时看 SI/float、days-to-cover、utilization、borrow fee、供给集中、召回条款和 margin buffer；高值仍不是 squeeze 的充分条件。',
    revisit: '回看 21 与 38「公开数据时钟、Short Squeeze 与数据口径」。',
    sourceIds: [47, 48, 49, 50, 56, 57, 58], staticSourceIds: [47, 48, 49, 50, 56],
    staticTwin: { title: '变式 09 · 高 short interest 也不是倒计时', prompt: '某股 SI/float 高，但 lendable supply 充足、borrow fee 低、空头 margin buffer 大且自然买盘弱。能否仅凭 SI/float 断言即将 squeeze？', answer: '不能。触发器、融资/召回约束、买盘和实际回补尚未对齐；高 short interest 只是必要关注状态之一。' },
  },
  {
    id: 'case-evidence', mode: 'evidence', label: '证据实验 05 · Case Court',
    title: '关于 2018 波动率事件、Archegos 与 GameStop，哪组表述守住了证据边界？',
    brief: '只允许使用 BIS、SEC staff、Credit Suisse 调查与 FINMA 等公开记录。题目要求区分关键放大器、单一主体集中、short covering、情绪交易以及没有被数据支持的 gamma 叙事。',
    facts: [
      { label: '5 Feb 2018', value: 'mechanical VIX ETP rebalance', note: '重要尾盘放大器' },
      { label: 'Archegos', value: 'one hidden concentrated family office', note: 'TRS + multiple prime brokers' },
      { label: 'GameStop 2021', value: 'covering + broad positive sentiment', note: 'staff did not support gamma claim' },
    ],
    options: [
      { id: 'a', label: 'ETP 解释全部股市下跌；Archegos 证明基金羊群；GME 全程由 gamma squeeze 推动', diagnosis: '三句都越过公开证据：把放大器写成唯一原因、把单一主体写成多基金 herding、把未获支持的 gamma 叙事写成事实。' },
      { id: 'b', label: '三个案例都只能证明价格波动，任何机制都无法讨论', diagnosis: '过度否定。官方和交易材料足以支持若干有边界的机制判断。' },
      { id: 'c', label: 'ETP 是 VIX spike 的关键放大器；Archegos 更适合讲隐藏集中与对手方竞速；GME covering 有贡献但持续买量主要与广泛正面情绪一致', diagnosis: '正确。每个判断都限定了对象、层级和公开证据能支持的范围。' },
    ],
    correct: 'c',
    calculation: '证据分类：2018=机械 target/fill 的重要 amplifier，不是全因；Archegos=单一主体集中、TRS 不透明和 prime-broker unwind，不是干净 herding 样本；GME=covering 部分贡献、广泛买盘更大，staff 未发现 gamma squeeze 支持。',
    reveal: '案例的价值不是给理论贴真实标签，而是练习“事实—官方判断—学术推断—未知”四层证据语言。',
    revisit: '回看 41–55「因果设计、案例、断链条件与证据边界」。',
    sourceIds: [60, 62, 63, 64, 68], staticSourceIds: [67],
    staticTwin: { title: '变式 10 · UK LDI 的正确边界', prompt: '长端 gilt 下跌触发 leveraged LDI 追加抵押与售债，收益率继续上升，BoE 临时购债打断循环。可以据此说“所有英国养老金都已资不抵债”吗？', answer: '不能。材料支持 margin—sale—yield feedback 和 backstop 断链；不支持把所有养老金的 funded status 归为同一结论。' },
  },
];
