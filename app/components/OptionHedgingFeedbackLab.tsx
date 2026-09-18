'use client';

import { useEffect, useId, useRef, useState } from 'react';

type Mode = 'book' | 'feedback';

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

const bookScenarios: Scenario[] = [
  {
    id: 'portfolio-delta-gamma',
    label: '风险簿 01 · Portfolio Δ / Γ',
    title: '一组 call 与 put 放进同一本账后，真正需要对冲的是多少 Delta，留下多少 Gamma？',
    brief: '某股票期权账簿含 long 20 calls（每份 Δ=+0.55、Γ=+0.04/美元）与 short 10 puts（每份 Δ=−0.35、Γ=+0.03/美元），标准乘数均为 100。所有 Greek 都是每股模型值；忽略费用与其他暴露。',
    facts: [
      { label: 'Long calls', value: '+20 × 100', note: '每份 Δ=+0.55、Γ=+0.04/美元' },
      { label: 'Short puts', value: '−10 × 100', note: '每份 put Δ=−0.35、Γ=+0.03/美元；空头头寸带负号' },
      { label: 'Neutral hedge', value: 'H=−ΔP', note: 'H>0 表示买入股票，H<0 表示卖空股票' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: 'ΔP=+750 股、ΓP=+110 股/美元；卖空 750 股', diagnosis: '这把 short put 的负头寸符号漏掉了。Put 本身 Delta 为负，但 short put 的组合 Delta 为正；它的组合 Gamma 则为负。' },
      { id: 'b', label: 'ΔP=+1,450 股、ΓP=+50 股/美元；卖空 1,450 股', diagnosis: '正确：short put 为账簿增加 +350 股 Delta，同时减少 30 股/美元 Gamma。用股票只能把当前 Delta 调到零，不能消除剩余正 Gamma。' },
      { id: 'c', label: 'ΔP=+1,450 股、ΓP=+110 股/美元；卖空 1,450 股', diagnosis: 'Delta 算对了，但 Gamma 忘了带头寸方向。Long call 与 long put 都是正 Gamma；一旦 put 是空头，它对组合 Gamma 的贡献就变成负值。' },
    ],
    calculation: 'ΔP=20×100×0.55+(−10)×100×(−0.35)=1,450 股；ΓP=20×100×0.04+(−10)×100×0.03=50 股/美元；H=−1,450 股。',
    reveal: '组合 Greek 必须逐腿按“有符号合约数×乘数×单份 Greek”聚合。Delta 中性只冻结当前斜率：若其他输入不变且股价再涨 2 美元，账簿 Delta 约增加 50×2=100 股，因此还需再卖约 100 股。',
  },
  {
    id: 'gamma-direction-mirror',
    label: '风险簿 02 · Gamma direction mirror',
    title: '两个当前都 Delta 中性的账簿，为何面对同一涨跌会下出方向相反的对冲单？',
    brief: '账簿 L 的 ΓP=+50 股/美元，账簿 S 的 ΓP=−50 股/美元；两者此刻都已用股票调成 Delta 中性。冻结隐波、时间与其他 Greeks，比较股价上涨 2 美元以及对称下跌 2 美元时的局部再平衡。',
    facts: [
      { label: 'Long-gamma book L', value: '+50 shares / $', note: '价格变动后，组合 Delta 与价格同向变化' },
      { label: 'Short-gamma book S', value: '−50 shares / $', note: '价格变动后，组合 Delta 与价格反向变化' },
      { label: 'Rehedge rule', value: 'ΔH≈−ΓPΔS', note: '正数为买股，负数为卖股' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '涨 2 美元：L 卖 100 股、S 买 100 股；跌 2 美元时两者方向对称反转', diagnosis: '正确：正 Gamma 上涨后 Delta 增加，须卖股；负 Gamma 上涨后 Delta 减少，须买股。下跌时符号完全对称。' },
      { id: 'b', label: '涨 2 美元：L 买 100 股、S 卖 100 股；跌 2 美元时两者方向对称反转', diagnosis: '这把对冲仓位变化与期权 Delta 变化写成了同号。为保持中性，股票仓位必须取组合 Delta 变化的相反数。' },
      { id: 'c', label: '两本账都买 100 股；call 型 Gamma 上涨买入，put 型 Gamma 下跌卖出', diagnosis: '题面给的是组合 Gamma 符号，并未把账簿限定为 call 或 put。Gamma 对冲方向由净多空 Gamma 决定，不由 call/put 名称决定。' },
    ],
    calculation: 'L：ΔS=+2 时 ΔH=−(+50)×2=−100 股；ΔS=−2 时 ΔH=+100 股。S：ΔS=+2 时 ΔH=−(−50)×2=+100 股；ΔS=−2 时 ΔH=−100 股。',
    reveal: '正 Gamma 的目标对冲单逆势，负 Gamma 的目标对冲单顺势；这是“需要怎样调仓”的局部结论。只有净订单实际成交并对价格产生通常方向的冲击时，才可能进一步形成抑制或放大波动的市场反馈。',
  },
  {
    id: 'gamma-scalp-costs',
    label: '风险簿 03 · Gamma scalp & costs',
    title: '价格先涨后跌回到起点，长 Gamma 为何仍可能在当天亏钱？',
    brief: '一个已 Delta 对冲的长 Gamma 组合在全天冻结 ΓP=200 股/美元，全天 Theta=−1,200 美元。标的先涨 2 美元，重新对冲后再跌 2 美元，并再次对冲；每次交易成本为每股 0.05 美元。忽略融资、价差、跳跃、曲面变化及 Gamma/Theta 自身变化。',
    facts: [
      { label: 'Curvature', value: 'ΓP=+200 shares / $', note: '每段使用 ½ΓP(ΔS)² 的局部曲率损益' },
      { label: 'Path / decay', value: '+$2 → −$2 · Θ=−$1,200', note: 'Theta 是题面给定的整日美元损益' },
      { label: 'Execution cost', value: '$0.05 / share', note: '两次再平衡各 400 股，总 turnover 800 股' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '净赚 760 美元：曲率赚 800，再扣 40 交易成本', diagnosis: '漏掉了整日 Theta −1,200 美元。长 Gamma 的路径收益不是免费收益；权利金时间衰减和执行成本都可能超过它。' },
      { id: 'b', label: '净亏 400 美元：曲率赚 800、Theta 亏 1,200，交易成本已经包含在 Theta 中', diagnosis: '题面把 Theta 与每股执行成本分开给出。模型 Theta 不会自动包含这两次真实成交的 40 美元费用。' },
      { id: 'c', label: '净亏 440 美元：曲率 +800、Theta −1,200、交易成本 −40', diagnosis: '正确：同一起终点不等于零损益；路径波动给长 Gamma 带来正曲率项，但本题不足以覆盖 Theta 与交易成本。' },
    ],
    calculation: '曲率损益≈½×200×[2²+(−2)²]=$800；每段再平衡量 |200×2|=400 股，turnover=800 股，成本=800×$0.05=$40；净损益≈800−1,200−40=−$440。',
    reveal: '“长 Gamma 可以 gamma scalp”是条件命题，不是利润保证。结果依赖实现路径、再平衡时点、成交成本、买入时隐含波动率、Theta、融资和曲面变化；在大幅或离散变动下，冻结 Gamma 的二阶近似还会留下残差。',
  },
  {
    id: 'jump-residual',
    label: '风险簿 04 · Jump residual',
    title: '标的一次跳空 10 美元时，精确 Delta-hedged 残差为何不等于旧 Gamma 的二阶项？',
    brief: '一份 long put 跳前每股价值 6 美元、Δ=−0.40、Γ=0.05/美元；标的一次向下跳空 J=−10 美元，期权按跳后市场状态重估为每股 12 美元。跳前用 H=−Δ=+0.40 股对冲；乘数为 100。忽略跳前后的其他现金流。',
    facts: [
      { label: 'Exact repricing', value: 'V: $6 → $12', note: '期权实际变化 +6 美元/股' },
      { label: 'Frozen local Greeks', value: 'Δ=−0.40 · Γ=0.05/$', note: '都是跳前状态的局部偏导' },
      { label: 'Jump / multiplier', value: 'J=−$10 · m=100', note: '比较每股残差与每张合约金额' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '精确残差与 Gamma 近似都为每股 2.50 美元；二阶 Taylor 对跳跃仍是恒等式', diagnosis: '旧 Gamma 给出的 2.50 美元只是局部二阶近似。题面已经给出跳后真实重估值，可以直接算出精确对冲残差为 2.00 美元。' },
      { id: 'b', label: '精确残差为每股 2.00 美元、每张 200 美元；旧 Gamma 近似为每股 2.50 美元、每张 250 美元', diagnosis: '正确：期权赚 6，持有 +0.40 股的对冲腿因股价下跌亏 4，所以精确组合残差为 2；冻结 Gamma 的近似高估了 0.50。' },
      { id: 'c', label: '精确残差为每股 6.00 美元；Delta 对冲只在上涨时有效，跳空下跌时股票腿不计损益', diagnosis: 'Delta 对冲腿在任何方向的价格变化中都会产生现金损益。本题股票腿变化为 +0.40×(−10)=−4 美元/股，不能从账本中删除。' },
    ],
    calculation: '精确残差=[V(S+J)−V(S)]−ΔJ=(12−6)−(−0.40×−10)=6−4=$2.00/股=$200/张。旧 Gamma 近似=½×0.05×(−10)²=$2.50/股=$250/张。',
    reveal: 'Taylor Gamma 是局部曲率，不是跳跃保险。价格跨过较大区间时 Delta、Gamma、隐波曲面和时间价值都可能改变；精确残差必须用跳后重估减去真实对冲腿损益，而不能把 ½ΓJ² 写成恒等式。',
  },
];

const feedbackScenarios: Scenario[] = [
  {
    id: 'feedback-denominator',
    label: '反馈诊断 01 · Feedback denominator',
    title: '同一个 1 美元外生冲击，为什么在正、负 Gamma 账簿下会变成 0.862 或 1.190 美元？',
    brief: '使用局部线性教学模型 dH=−ΓP dS、dS=dS⁰+λdH。外生价格冲击 dS⁰=+1 美元，价格冲击系数 λ=0.00002 美元/股。比较 ΓP=+8,000 与 −8,000 股/美元；假设对冲即时、全部成交且 λ 在该区间恒定。',
    facts: [
      { label: 'External shock', value: 'dS⁰=+$1.00', note: '尚未包含对冲单自身的价格影响' },
      { label: 'Local impact', value: 'λ=$0.00002 / share', note: '买入推高、卖出压低价格的线性近似' },
      { label: 'Gamma states', value: '+8,000 / −8,000 shares/$', note: '代入 dS=dS⁰/(1+λΓP)' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '正 Gamma：dS≈0.862，卖约 6,897 股；负 Gamma：dS≈1.190，买约 9,524 股', diagnosis: '正确：正 Gamma 的逆势卖单抵消部分冲击，负 Gamma 的顺势买单放大冲击；实际再平衡量要用反馈后的 dS 计算。' },
      { id: 'b', label: '正 Gamma：dS≈1.190，买约 9,524 股；负 Gamma：dS≈0.862，卖约 6,897 股', diagnosis: '这同时翻转了 Gamma 对冲方向和反馈分母。正 Gamma 上涨后应卖，负 Gamma 上涨后应买。' },
      { id: 'c', label: '两种状态都保持 dS=1.000；账簿初始 Delta 中性，所以再平衡单不会影响价格', diagnosis: 'Delta 中性只描述冲击前的一阶暴露。价格变化会通过 Gamma 改变 Delta，若对冲单有价格冲击，就会进入新的价格变化。' },
    ],
    calculation: '正 Γ：dS=1/[1+0.00002×8,000]=1/1.16=0.86207，dH=−8,000×0.86207=−6,896.55 股。负 Γ：dS=1/[1−0.16]=1.19048，dH=+9,523.81 股。',
    reveal: '反馈强度由 λΓP 的乘积决定，而不是 Gamma 单独决定。该分母模型只是一阶、即时、单市场近似；延迟对冲、无交易带、被动挂单、跨产品净额、非线性深度和其他参与者响应都可能削弱或改变观察到的反馈。',
  },
  {
    id: 'gex-unit-audit',
    label: '反馈诊断 02 · GEX unit audit',
    title: '同一个正 Gamma 数字，怎样同时生成卖出 40 个单位、20 万美元名义绝对值和 +1,000 美元曲率损益？',
    brief: '标的价格 S=5,000 美元/单位，组合 spot Gamma ΓP=+0.8 个标的等价单位/美元；该数值已包含所有合约乘数与有符号仓位。考察标的上涨 +1%，分别计算目标对冲变化、名义绝对值和有符号曲率损益。',
    facts: [
      { label: 'Spot / move', value: 'S=$5,000 · 1%=$50', note: '1% 标的变化是 50 美元，不是 0.01 美元' },
      { label: 'Portfolio Gamma', value: '+0.8 units / $1 move', note: '乘数和有符号仓位已经聚合，不能再乘一次' },
      { label: 'Two dollar concepts', value: '|hedge notional| ≠ signed curvature P&L', note: '前者还乘 S 并取绝对值，后者保留 Gamma 符号、½ 与价格变化平方' },
    ],
    correct: 'c',
    options: [
      { id: 'a', label: '+0.8 单位/美元；卖 0.4 单位；名义绝对值 2,000 美元；曲率 +500 美元', diagnosis: '把“1%”误写成乘 0.01，却漏掉了 1% 的价格变化等于 0.01S=50 美元。必须先把百分比冲击换成价格单位。' },
      { id: 'b', label: '+0.8 单位/美元；卖 40 单位；名义绝对值 200,000 美元；曲率 +2,000 美元', diagnosis: '对冲方向和前两个量正确，但曲率损益漏掉了 1/2。对冲名义与二阶损益不是同一 dollar-gamma convention。' },
      { id: 'c', label: '+0.8 单位/美元；卖 40 单位；名义绝对值 200,000 美元；曲率 +1,000 美元', diagnosis: '正确：上涨使正 Gamma 账簿 Delta 增加，所以目标 hedge 卖出 40；名义绝对值和曲率损益回答的是另外两个问题。' },
    ],
    calculation: 'ΔS1%=+0.01×5,000=+$50；ΔH=−ΓPΔS=−0.8×50=−40，故卖 40；名义绝对值=|−40|×$5,000=$200,000；曲率损益=½×(+0.8)×50²=+$1,000。',
    reveal: '供应商常把 +0.01S²ΓP 称为有符号 GEX，但 +1% shock 后的目标 hedge flow 是 −0.01S²ΓP，符号相反；若只报需要交易多少，则应取绝对值。若 ΓP=−0.8，同一上涨的数量仍是 40，方向却变为买入，曲率项也变成负值。任何比较都必须写出公式、单位、仓位符号和 1 美元/1% convention。',
  },
  {
    id: 'gamma-vanna-charm',
    label: '反馈诊断 03 · Gamma / Vanna / Charm',
    title: '价格上涨、隐波下降且时间经过一天后，为什么保持 Delta 中性只需卖 19 股，而不是 45 股？',
    brief: '某组合此刻 Delta 中性。定义 ΓP=30 股/美元；VannaP=∂ΔP/∂σ=800 股/一个完整波动率小数单位；CharmP=∂ΔP/∂t=−10 股/日，其中 t 是向前增加的 calendar time。随后 ΔS=+1.5 美元、Δσ=−0.02（即下降 2 个 vol points）、Δt=+1 日。',
    facts: [
      { label: 'Gamma channel', value: '30 × +$1.5', note: '给组合 Delta 带来 +45 股变化' },
      { label: 'Vanna convention', value: '800 / vol decimal', note: 'Δσ=−0.02，不是 −2；贡献 −16 股' },
      { label: 'Charm convention', value: '−10 / calendar day', note: 't 向前增加一日；若改用剩余期限 τ，符号会相反' },
    ],
    correct: 'b',
    options: [
      { id: 'a', label: '卖 45 股；只有标的变化会改变 Delta，Vanna 与 Charm 只影响期权价格', diagnosis: 'Vanna 与 Charm 都直接描述 Delta 如何随波动率和时间改变。本题它们合计抵消了 Gamma 渠道中的 26 股。' },
      { id: 'b', label: '卖 19 股；Delta 变化为 +45−16−10=+19 股，股票对冲取相反数', diagnosis: '正确：三个局部渠道合计使组合 Delta 增加 19 股，因此要再卖 19 股恢复中性。' },
      { id: 'c', label: '买 19 股；Delta 增加时必须同方向买入股票才能维持中性', diagnosis: '股票对冲仓位满足 H=−ΔP。组合 Delta 增加时，股票仓位必须向更负方向调整，也就是卖出而不是买入。' },
    ],
    calculation: 'ΔΔP≈ΓPΔS+VannaPΔσ+CharmPΔt=30×1.5+800×(−0.02)+(−10)×1=45−16−10=+19 股；ΔH=−19 股。',
    reveal: '真实曲面移动会让 frozen-vol、sticky-strike 与 sticky-delta 下的有效 Delta 不同；Vanna 和 Charm 也会随状态变化。本题只冻结局部偏导并明示单位，不能把 19 股外推到大幅价格、波动率跳跃或不同 Charm convention。',
  },
  {
    id: 'zero-dte-inventory',
    label: '反馈诊断 04 · 0DTE inventory detective',
    title: '公开 OI 有 20,000 张时，为什么不能据此判定 dealer short gamma？',
    brief: '某 European-style、cash-settled、今日到期的指数期权系列从挂牌时零库存开始，现处于最终到期结算前。完整且带符号的 aggregate market-maker 成交流为累计买入 600 张、卖出 450 张；期间没有仓位转移、合约调整或其他生命周期变动。乘数为 100，当前单份模型 Γ=0.08/指数点；公开 OI 为 20,000 张。冻结当前 Gamma，并暂不考虑其他执行价、期限或对冲产品。',
    facts: [
      { label: 'Signed MM flow', value: 'buy 600 · sell 450', note: '从系列挂牌、零初始库存开始完整累计' },
      { label: 'Contract scaling', value: 'm=100 · Γ=0.08 / point', note: '先重建净合约，再乘乘数与单份 Gamma' },
      { label: 'Public open interest', value: '20,000 contracts', note: '每一份 OI 同时对应一名多头与一名空头' },
    ],
    correct: 'a',
    options: [
      { id: 'a', label: '该系列可重建 MM 净多 150 张、ΓP=+1,200 单位/点；但 OI 单独不能识别 dealer 符号', diagnosis: '正确：只有题面额外给出的、从挂牌起完整的带符号 MM flow 才识别了该系列净仓；公开 OI 本身没有持仓者类别或长短边。' },
      { id: 'b', label: '公开 OI 直接给出 dealer ΓP=+160,000 单位/点，因为所有未平仓合约都由 dealer 做多', diagnosis: '20,000×100×0.08 的算术建立在“dealer 做多全部 OI”的无依据假设上。每份 OI 同时有多头和空头，身份及净额未知。' },
      { id: 'c', label: 'dealer 必然净空 150 张、ΓP=−1,200 单位/点，因为 market maker 的每笔买入都代表客户买入', diagnosis: '题面已经把 buy/sell 定义为 market-maker 一侧。MM 买 600、卖 450 的净结果是多 150 张，而不是空；也不能把交易对手方向擅自改写。' },
    ],
    calculation: '净 MM contracts=600−450=+150；该系列 ΓP=150×100×0.08=+1,200 标的等价单位/指数点。公开 OI 的 20,000 张只有总量，无法独立确定 dealer-side 正负号。',
    reveal: '0DTE 表示合约在当前交易日到期，不表示当天才挂牌。本题能重建净仓，还因为产品在结算前、无提前行权，且明确排除了 position transfer、contract adjustment 和未记录的生命周期变化。若数据不是从挂牌开始、初始库存未知、缺少买卖/capacity，或 dealer 在其他执行价、期限、SPY、ES 与其他期权中抵消，结果都会不完整；公开 OI 构造的只能是带明确 dealer-side 假设的 OI-weighted gamma proxy。',
  },
];

const scenarioSequence: { id: string; mode: Mode; index: number }[] = [
  ...bookScenarios.map((item, index) => ({ id: item.id, mode: 'book' as const, index })),
  ...feedbackScenarios.map((item, index) => ({ id: item.id, mode: 'feedback' as const, index })),
];

function ScenarioFacts({ scenario }: { scenario: Scenario }) {
  return (
    <div className="impact-facts" role="group" aria-label="题目教学参数">
      {scenario.facts.map((fact) => (
        <article key={`${scenario.id}:${fact.label}:${fact.value}`}>
          <span>{fact.label}</span>
          <b>{fact.value}</b>
          <p>{fact.note}</p>
        </article>
      ))}
    </div>
  );
}

export default function OptionHedgingFeedbackLab() {
  const [mode, setMode] = useState<Mode>('book');
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
  const scenarios = mode === 'book' ? bookScenarios : feedbackScenarios;
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
    reset('book', 0);
  }

  const modeLabel = mode === 'book' ? '组合账簿与对冲损益' : '价格反馈与测量诊断';
  const nextLabel = !nextUnsubmitted
    ? '完成本实验'
    : nextUnsubmitted.mode === 'feedback' && mode === 'book'
      ? '进入 Mode B'
      : nextUnsubmitted.mode !== mode
        ? '继续未答题'
        : '继续下一道未答题';

  return (
    <div className="auction-mechanism-lab impact-lab">
      <div className="impact-lab-head">
        <div>
          <span>DELTA · GAMMA · HEDGE FLOW · PRICE IMPACT · INVENTORY</span>
          <h3>先从有符号风险簿算出目标对冲单，再判断它何时成为市场的阻尼器或放大器</h3>
        </div>
        <p>两种模式各四题。Mode A 聚合组合暴露并核算离散对冲损益；Mode B 连接价格冲击、GEX 单位、曲面漂移与 0DTE 库存识别。</p>
      </div>

      <div className="impact-mode-picker" role="group" aria-label="Delta 与 Gamma 对冲反馈实验模式">
        <button type="button" aria-pressed={mode === 'book'} onClick={() => selectMode('book')}>
          <span>MODE A</span><b>Risk Book &amp; Hedging P&amp;L</b><small>组合 Δ/Γ、对冲方向、成本与跳跃残差</small>
        </button>
        <button type="button" aria-pressed={mode === 'feedback'} onClick={() => selectMode('feedback')}>
          <span>MODE B</span><b>Feedback &amp; Measurement</b><small>冲击分母、GEX 单位、Vanna / Charm 与 0DTE</small>
        </button>
      </div>

      <div className="impact-task-picker" role="group" aria-label={modeLabel + '题目'}>
        {scenarios.map((item, index) => {
          const submitted = submittedScenarioIds.includes(item.id);
          const result = scenarioResults[item.id];
          const number = String(index + 1).padStart(2, '0');
          const shortLabel = item.label.split(' · ')[1];
          const status = !submitted ? '未提交' : result ? '已提交，正确' : '已提交，需复习';
          return (
            <button
              type="button"
              key={item.id}
              aria-label={`${number} ${shortLabel}，${status}`}
              aria-pressed={index === scenarioIndex}
              aria-current={index === scenarioIndex ? 'step' : undefined}
              onClick={() => selectScenario(index)}
            >
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
            <input
              ref={optionIndex === 0 ? firstOptionRef : undefined}
              type="radio"
              name={'option-hedging-feedback-' + mode + '-' + scenario.id}
              value={option.id}
              checked={choice === option.id}
              onChange={() => setChoice(option.id)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </fieldset>

      {completed ? (
        <div className="impact-result correct" ref={resultRef} tabIndex={-1} role="region" aria-live="polite" aria-labelledby={resultTitleId}>
          <b id={resultTitleId}>两种模式已完整提交</b>
          <p>你已经探索 8/8，当前答对 {correctCount}/8：从组合 Δ/Γ、离散对冲和跳跃残差，推进到价格反馈、单位审计、曲面漂移与 0DTE 库存识别。你仍可从上方题目选择器返回任一题更新答案。</p>
          <strong>关键不是把“正 Gamma 抑制、负 Gamma 放大”背成口号，而是逐层核对净库存符号、目标对冲量、实际成交、价格冲击与流动性状态；任何一层缺失，反馈判断都不能闭合。</strong>
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
          <div>
            <button type="button" className="impact-secondary" onClick={retryScenario}>重新作答</button>
            <button type="button" className="impact-primary" onClick={nextScenario}>{nextLabel}</button>
          </div>
        </div>
      )}

      <p className="impact-lab-caveat"><b>实验边界：</b>八题都使用冻结参数与明确的局部近似，只用于教学，不构成投资或交易建议。真实对冲还受 bid / ask、市场深度、冲击非线性、再平衡频率、交易成本、跳跃、融资与保证金、股息、模型、波动率曲面、cross-greeks、行权与结算、库存净额以及对冲工具影响。公开 OI 不含持仓者身份或长短边，不能直接识别 dealer net gamma。</p>
    </div>
  );
}
