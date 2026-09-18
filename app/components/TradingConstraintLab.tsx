'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'rules' | 'displacement';

type Option = {
  id: string;
  label: string;
  diagnosis: string;
};

type Scenario = {
  id: string;
  label: string;
  title: string;
  brief: string;
  facts: { label: string; value: string; note: string }[];
  correct: string;
  options: Option[];
  calculation: string;
  reveal: string;
};

const ruleScenarios: Scenario[] = [
  {
    id: 'mwcb-ladder',
    label: '规则引擎 01 · Market-wide circuit breaker',
    title: 'S&P 500 从前收 5,000 依次跌到 4,650、4,350 与 4,000，全天交易时钟会怎样改变？',
    brief: '按截至 2026-08-29 的美国市场整体熔断规则，Level 1、2、3 分别对应相对前一交易日 S&P 500 收盘点位下跌 7%、13% 与 20%。假设 14:00 ET 首次触及 4,650，复牌后再依次触及另外两档；忽略个股 LULD。',
    facts: [
      { label: 'Prior S&P 500 close', value: '5,000', note: '三档阈值都以此前收盘点位为共同基准，不随盘中反弹重置' },
      { label: 'Level 1 / 2 case', value: '14:00 ET', note: '明确位于收盘前边界之外，触发后启动至少 15 分钟全市场暂停' },
      { label: 'Level 3', value: '−20% at any time', note: '一旦触发，当日剩余时段停止交易' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '4,650 触发 Level 1 至少暂停 15 分钟；4,350 可再触发 Level 2；4,000 触发 Level 3 并结束当日交易', diagnosis: '正确：三点分别是前收的 93%、87% 与 80%。同一 Level 当天不会重复触发，但触发过 Level 1 并不阻止市场后来触发更高一级的 Level 2 或 Level 3。' },
      { id: 'b', label: '4,650、4,350、4,000 每次都只暂停 15 分钟，复牌后同一档还可无限重复', diagnosis: 'Level 3 不是 15 分钟暂停，而是终止当日剩余交易；Level 1 与 Level 2 各自也只在一天内触发一次，不能把反复穿越同一阈值机械地变成反复停牌。' },
      { id: 'c', label: '只有 4,000 会触发熔断；4,650 与 4,350 只是普通波动，因为熔断只看盘中最高点后的回撤', diagnosis: '市场整体熔断以此前一交易日 S&P 500 收盘为固定基准，不是盘中移动高点回撤。4,650 与 4,350 已分别达到 −7% 与 −13%。' },
    ],
    calculation: 'Level 1=5,000×(1−7%)=4,650；Level 2=5,000×(1−13%)=4,350；Level 3=5,000×(1−20%)=4,000。',
    reveal: '“至少暂停 15 分钟”描述的是初始制度时钟，不保证每只证券恰在第 15 分钟同时恢复连续交易；复牌拍卖、价格 collar、订单失衡或运营处置可能延长实际不可交易时间。交易所 FAQ 通常把 Level 1/2 窗口表述为 15:25 ET 以前，个别规则文本对 15:25 整点的措辞并不完全一致，因此实务应核对主上市市场当期规则；Level 3 则在任何交易时点都结束当日交易。阈值并不证明基本面冲击已消失。',
  },
  {
    id: 'luld-bands',
    label: '规则引擎 02 · LULD dynamic bands',
    title: 'Tier 1 股票的五分钟参考价为 50 美元时，正常时段与 15:40 ET 的可执行价格带分别是多少？',
    brief: '假设一只价格高于 3 美元的 Tier 1 NMS 股票，其 LULD 滚动参考价暂时固定为 50 美元。正常价格带为参考价上下 5%；交易日最后 25 分钟带宽翻倍。随后 National Best Bid 停留在上轨，Limit State 持续满 15 秒。',
    facts: [
      { label: 'Rolling reference price', value: '$50.00', note: '教学题冻结五分钟滚动参考价，不模拟它后续更新' },
      { label: 'Normal / doubled width', value: '±5% / ±10%', note: '15:40 ET 位于 15:35–16:00 的最后 25 分钟' },
      { label: 'Limit State clock', value: '15 seconds', note: '未在时钟内解除时，主上市交易所通常启动五分钟 Trading Pause' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '全天都是 $47.50–$52.50；触及上轨立即结束当日交易', diagnosis: '最后 25 分钟对本题 Tier 1 股票采用双倍带宽，因此 15:40 的价格带不是 ±5%。触及或锁在边界也不是市场整体 Level 3 熔断，通常先进入 Limit State。' },
      { id: 'b', label: '正常为 $47.50–$52.50，15:40 为 $45.00–$55.00；上轨 Limit State 持续 15 秒后通常暂停五分钟', diagnosis: '正确：正常上、下轨分别是 50×1.05 与 50×0.95；最后 25 分钟把百分比宽度由 5% 翻倍至 10%。未解除的 15 秒 Limit State 随后进入 Trading Pause。' },
      { id: 'c', label: '正常为 $45.00–$55.00，15:40 收窄为 $47.50–$52.50；只要有报价到达边界就暂停 15 分钟', diagnosis: '带宽方向写反了：临近收盘是翻倍而非收窄。LULD 也不是任何报价接触边界就暂停 15 分钟；本题要求 Limit State 连续存在 15 秒，随后通常是五分钟 Trading Pause。' },
    ],
    calculation: '正常下轨=50×(1−5%)=$47.50，上轨=50×(1+5%)=$52.50；最后 25 分钟下轨=50×(1−10%)=$45.00，上轨=50×(1+10%)=$55.00。',
    reveal: 'LULD 是围绕滚动参考价的动态可执行价格带与单证券暂停机制，不是静态日涨跌幅，也不是全市场熔断。五分钟暂停仍可能延长，复牌还要经过主上市交易所的程序。截至 2026-08-29，本题只把常规交易时段机制视为现行；SEC 已批准的隔夜 LULD 扩展预计 2026-12-06 才启动，不能倒填为当前规则。',
  },
  {
    id: 'cn-daily-limit',
    label: '规则引擎 03 · 沪深主板日涨跌幅',
    title: '前收 10.03 元的普通沪深主板股票，现行 ±10% 日价格边界应怎样落在 0.01 元报价单位上？',
    brief: '假设该股票不属于首次上市前五个交易日或其他无日涨跌幅例外，适用 10% 日涨跌幅限制，最小价格变动单位为 0.01 元。按沪深交易所自 2026-07-06 施行的现行规则口径计算。',
    facts: [
      { label: 'Previous close', value: '¥10.03', note: '日涨跌幅价格以此前收盘价为基准' },
      { label: 'Daily rate / tick', value: '±10% / ¥0.01', note: '理论边界要按最小价格变动单位取整' },
      { label: 'Trading at boundary', value: '仍可成交', note: '价格边界限制可成交价格，不等于停止接受订单或全市场暂停' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '下限 9.02 元、上限 11.04 元；首次触及任一边界立即临停 10 分钟', diagnosis: '未按 0.01 元单位正确处理理论值 9.027 与 11.033，而且把静态日价格限制误写成盘中临停。股票可以在涨跌停价成交，未成交订单也可能继续排队。' },
      { id: 'b', label: '下限 9.03 元、上限 11.03 元；一旦触及边界，当日不再接受任何该股票订单', diagnosis: '价格计算正确，但制度含义错误。到达涨跌停价并不会自动停止全天交易或订单申报；边界内仍可成交，边界上的供需失衡可能表现为排队。' },
      { id: 'c', label: '下限 9.03 元、上限 11.03 元；边界价仍可成交，无法撮合的失衡会留在订单队列中', diagnosis: '正确：10.03×0.9=9.027、10.03×1.1=11.033，按 0.01 元价格单位得到 9.03 与 11.03。价格边界截断的是当日可执行路径，不会自动消灭买卖意愿。' },
    ],
    calculation: '理论下限=10.03×0.90=9.027→9.03 元；理论上限=10.03×1.10=11.033→11.03 元。',
    reveal: '日涨跌幅限制下，“观察到的最大单日跌幅只有 10%”可能只是潜在回报被限界删失为边界观测，而不是潜在价值、卖出意愿或不确定性只移动了 10%。边界仍可成交这一点，把它与交易完全停止的熔断或临时停牌区分开来。2026-07-06 起沪深主板风险警示股票也由旧 5% 调整为 10%；科创板、创业板及其他产品仍须分别核对，不能从本题外推到所有证券。',
  },
  {
    id: 'cn-ipo-pauses',
    label: '规则引擎 04 · 无日限价股票盘中临停',
    title: '开盘价 20 元的无日涨跌幅股票，价格依次触及 ±30% 与 ±60% 时分别对应哪些价格？',
    brief: '假设一只处于首次上市后前五个交易日内、因此不设日涨跌幅限制的沪深股票，开盘价为 20 元。题设价格先首次触及某方向的 30%，复牌后再首次触及同方向 60%；按现行规则，两档分别触发一次 10 分钟盘中临时停牌。',
    facts: [
      { label: 'Opening price', value: '¥20.00', note: '盘中临停阈值相对当日开盘价，而非前一日收盘价' },
      { label: 'Trigger path', value: '先 ±30%，复牌后再到同向 ±60%', note: '依次触发时两档各临停 10 分钟；直接跳到 ±60% 是另一条路径' },
      { label: 'Daily price limit', value: 'None in this scenario', note: '“不设日涨跌幅”不等于“没有盘中波动控制”' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '下行 14 元与 8 元，上行 26 元与 32 元；按题设依次触及时，两档各临停 10 分钟', diagnosis: '正确：20×0.7=14、20×0.4=8、20×1.3=26、20×1.6=32。题设明确先触及 30%、复牌后再触及同方向 60%，所以该方向发生两次临停；“无日限价”与“有盘中临停阈值”可以同时成立。' },
      { id: 'b', label: '下行 17 元与 14 元，上行 23 元与 26 元；阈值按前收的 15% 与 30% 计算', diagnosis: '题面明确给出相对开盘价的 ±30% 与 ±60%，不是相对前收的 15% 与 30%。这也会漏掉第二档 60% 的实际距离。' },
      { id: 'c', label: '下行 18 元，上行 22 元；主板统一 ±10%，触及后余下全天停止交易', diagnosis: '本题处于不设日涨跌幅限制的例外期，不能套用普通主板 ±10% 日边界。盘中临停通常为 10 分钟，也不是自动停止当日剩余交易。' },
    ],
    calculation: '−30%：20×0.70=14 元；−60%：20×0.40=8 元；+30%：20×1.30=26 元；+60%：20×1.60=32 元。',
    reveal: '这套机制把“日价格边界”和“盘中时间暂停”叠加成不同层次：本题没有静态日边界，却仍在大幅盘中移动时暂停撮合。路径条件很重要：若第一笔触发价格直接达到或越过同方向 60%，该方向只临停一次，此后不再重复；只有像题设这样先到 30%、复牌后再到 60%，才会同方向临停两次。上下两边四档若都依次触发，全日最多四次。若临停跨越 14:57，交易所会按规则在 14:57 复牌并进入相应拍卖程序。沪深 2026 修订规则自 2026-07-06 施行，本题不把旧版规则当作现行制度。',
  },
];

const displacementScenarios: Scenario[] = [
  {
    id: 'latent-value-censoring',
    label: '压力迁移 01 · Latent value censoring（限界删失）',
    title: '潜在清算价值从 100 跳到 82，但日跌幅限制为 10%，两天的可执行路径会怎样展开？',
    brief: '某股票前收 100，隔夜消息使参与者共同评估的潜在清算价值瞬间降至 82。假设每天适用 ±10% 日价格限制，第一天在跌停价 90 收盘，第二天以前收 90 重新计算价格边界；忽略价格单位取整。',
    facts: [
      { label: 'Latent value shock', value: '100 → 82', note: '潜在价值是教学设定，不等于第一天能够观察到的成交价' },
      { label: 'Daily lower bound', value: '−10% each day', note: '第二天基准会变成第一天实际收盘 90' },
      { label: 'Observed path', value: '100 → 90 → ?', note: '边界改变价格到达目标的时间，而非保证目标消失' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '第一天可直接成交到 82；日跌幅限制只约束收盘统计，不约束盘中成交', diagnosis: '日价格限制约束当日可执行价格。当前收为 100、下限为 90 时，82 在第一天并不是合规成交价。' },
      { id: 'b', label: '第一天下限 90；第二天下限 81，因此 82 已可成交；若两天都封死在下限，累计跌幅是 19%', diagnosis: '正确：第二天下限为 90×0.9=81，所以 82 进入可执行区间。连续两个 −10% 是乘法路径 100×0.9²=81，相对起点累计 −19%，不是简单相加的 −20%。' },
      { id: 'c', label: '第一天下限 90；第二天下限仍为 90，因为所有日涨跌幅都固定以最初的 100 为基准', diagnosis: '通常每日边界以前一交易日收盘重新计算。第一天若收于 90，第二天的 10% 下限变为 81，而不是永久锁在 90。' },
    ],
    calculation: 'Day 1 floor=100×0.90=90；Day 2 floor=90×0.90=81，因此 82∈[81,99]。若两日均收于下限，累计收益=81/100−1=−19%。',
    reveal: '第一天潜在回报被制度边界限界删失为 −10% 的边界观测，不足以证明潜在冲击只有 10%。第二天可能继续下跌、在 82 附近成交，也可能因新信息和买方流动性出现而反转；“压力被推迟”不是物理守恒定律。研究时应同时观察跌停队列、未成交量、次日开盘、跨市场价格和信息修正，而不能只把受限收盘收益当作完整价格发现。',
  },
  {
    id: 't-plus-one-distinction',
    label: '压力迁移 02 · 两种 T+1',
    title: '昨仓 1,000 股、今日再买 400 股时，中国的当日回转限制与美国 T+1 结算为何不是同一制度？',
    brief: '假设投资者持有一只不属于回转交易例外的沪深股票：昨日可用持仓 1,000 股，今日现金买入 400 股。比较截至 2026-08-29 的沪深交收前卖出限制与美国标准 T+1 结算周期；不考虑融券、证券借贷和经纪商额外限制。',
    facts: [
      { label: 'Yesterday available shares', value: '1,000', note: '这些股份在今日开始时已经可以卖出' },
      { label: 'Today cash purchase', value: '+400', note: '题面证券不在允许当日回转的产品例外中' },
      { label: 'U.S. settlement cycle', value: 'Trade date + 1 business day', note: '描述证券与资金完成交付的时间，不自动构成统一持有期禁售' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '沪深当日最多卖 1,400 股；美国当日最多卖 1,000 股，因为美国 T+1 禁止今日买入今日卖出', diagnosis: '两边都写反了。题面沪深股票的今日买入 400 股尚不能当日卖出，因此当日可卖上限是昨仓 1,000；美国 T+1 结算本身并不是统一的同日反向交易禁令。' },
      { id: 'b', label: '两边当日都最多卖 1,000 股，因为所有名为 T+1 的规则都有相同经济含义', diagnosis: '名称相似不等于约束相同。美国 T+1 主要规定成交后一个工作日结算；现金账户的已付款买入通常可以同日卖出，但资金来源、善意违规、free riding 与经纪商规则仍需另行判断。' },
      { id: 'c', label: '沪深当日最多卖 1,000 股；美国 T+1 仅规定次工作日结算，并不自动禁止已付款证券同日卖出', diagnosis: '正确：沪深题面中的 400 股今日买入数量尚未变成可当日卖出数量。美国的结算时钟、现金账户资金使用规则、保证金规则与 day trading 规则是不同层次，不能被压成一个“今日不能卖”的口号。' },
    ],
    calculation: '沪深题面当日可卖数量=昨日可用持仓 1,000 股；今日买入 400 股在无回转交易例外时留待后续交易日。美国 T+1：交易日 T 成交，通常在下一工作日 T+1 完成证券与资金交付。',
    reveal: '沪深规则本身列有可进行当日回转交易的证券类别，所以本题结论不能外推到所有交易所产品。美国投资者即使能同日卖出，也仍可能受现金账户 settled funds、good-faith violation、free riding、保证金与经纪商风控约束。研究“T+1”影响时，必须先写清它究竟是结算周期、持有期约束，还是账户资金可用性规则，否则因果链会从定义处就混淆。',
  },
  {
    id: 'china-2016-breaker',
    label: '压力迁移 03 · 2016 历史熔断',
    title: '2016 年初曾短暂实施的中国指数熔断，5% 与 7% 两档在交易时钟上怎样运作？',
    brief: '这是历史规则辨识题，不是现行交易指引。按当时以沪深 300 指数为基准的对称熔断安排：涨跌达到 5% 与 7% 为两档阈值。假设 5% 首次发生在 14:45 以前，随后复牌并触及 7%。',
    facts: [
      { label: 'Historical Level 1', value: '±5%', note: '14:45 前触发时暂停 15 分钟；同一方向当日只触发一次' },
      { label: 'Historical Level 2', value: '±7%', note: '一旦触发，停止当日剩余交易' },
      { label: 'Status today', value: '已于 2016-01-08 暂停实施', note: '不得把这套指数熔断写成 2026 年沪深现行规则' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '14:45 前触及 ±5% 暂停 15 分钟；复牌后触及 ±7% 结束当日交易；该机制现已失效', diagnosis: '正确：这准确区分了历史两档时钟，也明确了制度状态。2016 年的短暂事件可用于理解磁吸效应与交易前置，但不能直接充当今天的规则说明。' },
      { id: 'b', label: '±5% 与 ±7% 都只暂停 10 分钟，而且至今仍是沪深市场现行的指数熔断', diagnosis: '当时第一档为 15 分钟，第二档是结束当日交易；更重要的是，这套机制自 2016-01-08 起暂停实施，并非 2026 年现行规则。' },
      { id: 'c', label: '±5% 只是普通股票涨跌停，±7% 才是单只股票 LULD，两档都不影响其他证券', diagnosis: '当时两档是以沪深 300 为基准的市场范围指数熔断，并非个股静态涨跌停或美国式单证券 LULD；触发后的影响覆盖范围远大于一只股票。' },
    ],
    calculation: '历史时钟：|沪深300涨跌幅|达到5%且发生于14:45前→暂停15分钟；随后达到7%→停止当日剩余交易。若5%首次在14:45及以后发生，当时规则也会停止当日剩余交易。',
    reveal: '这段历史的关键不是把“熔断必然失败”写成普遍定律，而是看到阈值附近的行为会内生变化：担心失去退出机会的参与者可能把交易提前，从而产生磁吸效应；暂停也可能给信息核实与流动性重组创造时间。2016 年样本极短且与当时宏观、汇率和风险偏好冲击重叠，不能用几天事件作无条件因果外推。',
  },
  {
    id: 'cross-market-margin',
    label: '压力迁移 04 · Cross-market migration',
    title: '现货被锁在 90、股指期货交易到 86 时，对冲为何既迁移卖压，也可能制造新的保证金传染？',
    brief: '某基金持有与股指高度对应的 10,000 个现货等价单位，现货在日跌停 90 处缺乏买方，无法完成卖出。基金改在 86 做空 10 张期货，每张乘数为 1,000 个等价单位。假设保证金比例由 12% 上调至 18%，忽略逐日盯市盈亏、融资利息、股息与基差收敛。',
    facts: [
      { label: 'Cash / futures price', value: 'S=90 · F=86', note: '现货最后成交受边界约束，期货仍在连续表达更低价格' },
      { label: 'Hedge size', value: '10 × 1,000 units', note: '期货空头覆盖 10,000 个现货等价单位' },
      { label: 'Margin rate', value: '12% → 18%', note: '只计算保证金占用增量，不加入题面排除的盯市盈亏' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '基差为 +4；期货空头保证金减少 51,600，因此不会把冲击传给其他资产', diagnosis: '按 b=F−S 定义，基差是 86−90=−4 而不是 +4。保证金比例从 12% 上升到 18%，占用增加而非减少；若基金缺少现金，可能被迫卖出仍有流动性的其他资产。' },
      { id: 'b', label: '基差为 −4；期货承接卖压，保证金占用增加 51,600，现金不足时可能迫使基金出售其他流动资产', diagnosis: '正确：现货退出受阻时，风险转移需求可以迁移到期货并形成负基差；同一对冲虽降低部分价格暴露，却提高保证金现金需求，进而把冲击传给原本未受限的资产。' },
      { id: 'c', label: '基差必为 0；只要现货停在跌停价，期货在无套利条件下也必须停止在 90，保证金不受影响', diagnosis: '交易约束、融资、可做空性、股息预期和风险承载限制会让短期基差偏离零。潜在现货回报被限界删失为边界观测时，期货尤其可能承担更快的价格发现，不能假设两者机械同步。' },
    ],
    calculation: '基差 b=F−S=86−90=−4，即相对现货约 −4/90=−4.44%。期货名义金额=10×1,000×86=860,000；保证金增量=860,000×(18%−12%)=51,600。',
    reveal: '规则没有消灭风险转移需求，而是改变了它能在哪个市场、以什么资产负债表成本执行。期货卖压可能改善组合方向性对冲，却同时放大基差风险、流动性需求和保证金约束；缺现金的机构再出售其他资产，就形成跨资产传染。真实期货定价还包含融资、股息、期限、可交割性、盯市损益与动态保证金，本题的 −4 不能被直接解释为精确潜在现货价值。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...ruleScenarios.map((item, index) => ({ id: item.id, mode: 'rules' as const, index })),
  ...displacementScenarios.map((item, index) => ({ id: item.id, mode: 'displacement' as const, index })),
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目教学参数">
      {scenario.facts.map((fact) => (
        <article key={`${scenario.id}:${fact.label}:${fact.value}`}>
          <span>{fact.label}</span><b>{fact.value}</b><p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function TradingConstraintLab() {
  const [mode, setMode] = useState<Mode>('rules');
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [choice, setChoice] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [submittedScenarioIds, setSubmittedScenarioIds] = useState<string[]>([]);
  const [scenarioResults, setScenarioResults] = useState<Record<string, boolean>>({});
  const resultRef = useRef<HTMLDivElement>(null);
  const questionTitleRef = useRef<HTMLHeadingElement>(null);
  const firstOptionRef = useRef<HTMLInputElement>(null);
  const pendingFocusRef = useRef<'question' | 'option' | null>(null);
  const resultTitleId = useId();
  const scenarios = mode === 'rules' ? ruleScenarios : displacementScenarios;
  const scenario = scenarios[scenarioIndex];
  const selected = scenario.options.find((option) => option.id === choice);
  const correct = choice === scenario.correct;
  const nextUnsubmitted = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));
  const correctCount = Object.values(scenarioResults).filter(Boolean).length;

  useEffect(() => {
    if (revealed || completed) {
      resultRef.current?.focus();
      return;
    }
    if (pendingFocusRef.current === 'question') questionTitleRef.current?.focus();
    if (pendingFocusRef.current === 'option') firstOptionRef.current?.focus();
    pendingFocusRef.current = null;
  }, [mode, scenarioIndex, revealed, completed]);

  function reset(nextMode = mode, nextIndex = scenarioIndex) {
    setMode(nextMode);
    setScenarioIndex(nextIndex);
    setChoice('');
    setRevealed(false);
    setCompleted(false);
  }

  function selectMode(nextMode: Mode) {
    if (nextMode === mode && !completed) return;
    pendingFocusRef.current = 'question';
    reset(nextMode, 0);
  }

  function selectScenario(nextIndex: number) {
    if (nextIndex === scenarioIndex && !completed) return;
    pendingFocusRef.current = 'question';
    reset(mode, nextIndex);
  }

  function retryScenario() {
    pendingFocusRef.current = 'option';
    setSubmittedScenarioIds((current) => current.filter((id) => id !== scenario.id));
    setScenarioResults((current) => Object.fromEntries(Object.entries(current).filter(([id]) => id !== scenario.id)));
    reset();
  }

  function submitScenario() {
    setSubmittedScenarioIds((current) => current.includes(scenario.id) ? current : [...current, scenario.id]);
    setScenarioResults((current) => ({ ...current, [scenario.id]: correct }));
    setRevealed(true);
  }

  function nextScenario() {
    const nextTarget = scenarioSequence.find((item) => !submittedScenarioIds.includes(item.id));
    if (nextTarget) {
      pendingFocusRef.current = 'question';
      reset(nextTarget.mode, nextTarget.index);
      return;
    }
    setCompleted(true);
  }

  function restartLab() {
    pendingFocusRef.current = 'question';
    setSubmittedScenarioIds([]);
    setScenarioResults({});
    reset('rules', 0);
  }

  const modeLabel = mode === 'rules' ? '规则触发与交易时钟' : '压力迁移与制度诊断';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'displacement' && mode === 'rules'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '继续下一道未答题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div><span>MWCB · LULD · PRICE LIMIT · T+1 · SPILLOVER</span><h3>先判断规则改变了哪一层交易时钟，再追踪未完成的风险转移会去往哪里</h3></div>
        <p>两种模式各四题。Mode A 复算触发阈值、价格边界与暂停时钟；Mode B 追踪限界删失下的价格发现、两种 T+1、历史熔断与跨市场传染。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="交易约束与压力迁移实验模式">
        <button type="button" aria-pressed={mode === 'rules'} onClick={() => selectMode('rules')}><span>MODE A</span><b>Rule Engine &amp; Trigger Math</b><small>MWCB、LULD、日价格边界与无日限价临停</small></button>
        <button type="button" aria-pressed={mode === 'displacement'} onClick={() => selectMode('displacement')}><span>MODE B</span><b>Displacement &amp; Diagnosis</b><small>限界删失下的价格发现、T+1、历史规则与跨市场保证金</small></button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const result = scenarioResults[item.id];
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          const status = !submitted ? '未提交' : result ? '已提交，正确' : '已提交，需复习';
          return (
            <button type="button" key={item.id} aria-label={`${number} ${shortLabel}，${status}`} aria-pressed={index === scenarioIndex} aria-current={index === scenarioIndex ? 'step' : undefined} onClick={() => selectScenario(index)}>
              <span aria-hidden="true">{!submitted ? number : result ? '✓' : '!'}</span>{shortLabel}
            </button>
          );
        })}
      </div>

      <p className="impact-lab-progress" role="status" aria-live="polite">总进度：已提交 {submittedScenarioIds.length}/8，当前答对 {correctCount} 题。</p>

      <div className="impact-question">
        <span>{scenario.label}</span>
        <h3 ref={questionTitleRef} tabIndex={-1} aria-label={`${scenario.label}：${scenario.title}`}>{scenario.title}</h3>
        <p>{scenario.brief}</p>
      </div>

      <ScenarioFacts scenario={scenario} />

      <fieldset className="impact-choice-fieldset" disabled={revealed}>
        <legend className="sr-only">{scenario.title}</legend>
        {scenario.options.map((option, optionIndex) => (
          <label key={option.id} className={choice === option.id ? 'selected' : ''}>
            <input ref={optionIndex === 0 ? firstOptionRef : undefined} type="radio" name={'trading-constraint-' + mode + '-' + scenario.id} value={option.id} checked={choice === option.id} onChange={() => setChoice(option.id)} />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完整提交</b>
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从全市场熔断、单证券动态价格带、静态日限价和无日限价临停，推进到限界删失下的价格发现、两种 T+1、历史制度识别与跨市场保证金传染。你仍可从上方题目选择器返回任一题更新答案。</p>
          <strong>核心不是把交易约束简单贴上“稳定”或“扭曲”的标签，而是逐层追问：什么价格仍可成交、什么订单只能排队、暂停持续多久、谁失去立即退出能力，以及未完成的风险转移是否迁移到复牌、次日、衍生品或其他资产。</strong>
          <div><button type="button" className="impact-primary" onClick={restartLab}>全部重启并回到 Mode A</button></div>
        </div>
      ) : !revealed ? (
        <>
          <button type="button" className="impact-primary" disabled={!choice} onClick={submitScenario}>提交判断并揭示</button>
          <p className="impact-locked">先选择答案。计算过程、机制解释与适用边界仍被锁定。</p>
        </>
      ) : (
        <div className={'impact-result ' + (correct ? 'correct' : '')} ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>{correct ? '判断成立' : '需要修正'}</b>
          <p>{selected?.diagnosis}</p>
          <code>{scenario.calculation}</code>
          <strong>{scenario.reveal}</strong>
          <div><button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button><button type="button" className="impact-primary" onClick={nextScenario}>{nextLabel}</button></div>
        </div>
      )}

      <p className="impact-lab-caveat"><b>规则时点与实验边界：</b>沪深证券交易所 2026 修订交易规则自 2026-07-06 施行；本实验按 2026-08-29 的现行状态编写。SEC 已批准将 LULD 扩展至隔夜时段，但预计 2026-12-06 才启动，因此不把隔夜机制算作当前规则。八题使用冻结参数和简化撮合路径，只用于教学，不构成投资或交易建议。真实结果还取决于证券类别、交易所公告、价格单位、开收盘拍卖、订单队列、经纪商风控、成交概率、融资与保证金、衍生品基差、信息修正和其他市场参与者响应。</p>
    </div>
  );
}
