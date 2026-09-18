import FuturesBasisLab from '../components/FuturesBasisLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson122Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>期货基差不是一张隐藏的方向选票；它是两个合约在融资、收入、交割、时钟与中介约束共同作用下形成的相对价格。</h2>
        <p>
          同一个经济风险可以由今天买入的现货、约定未来一次交割的 forward（远期），或逐日结算的 futures（期货）表达。它们的现金流权利并不相同：持有现货要先支付资金，却能收到股息、票息、租借收益或库存服务；期货通常只需提交履约保证金，却要每天收付 variation margin（变动保证金），并在合同指定的结算价、地点、质量或可交割券上闭环。因此，屏幕上的 <b>Futures−Spot</b> 先是在补偿这些权利和义务的差异，只有扣除可复制的 fair carry（公平持有成本）后，剩余部分才可能成为需要解释的 relative-value wedge（相对价值楔子）。股指期货的官方教学材料也明确把融资与预期股息列为公平价值输入，而不是把升水本身解释成看涨预测。<Cite n={9} /><Cite n={14} />
        </p>
        <p>
          这还只是无摩擦起点。真正的 cash–futures arbitrage（期现套利）要求同时完成两条可成交交易腿，持续获得融资或借券，满足整数合约、保证金、限仓、清算与交割规则，并承受价格冲击。到期收敛只告诉我们合同终点怎样计算，不保证途中价差平滑缩小，也不保证高杠杆套利者有现金活到终点。于是本节始终追问同一个可审计问题：<b>在明确的基差符号、合约月份、同步现货代理和交易者边际成本下，哪一条复制链能够闭合，净利润与现金路径是什么，容量由谁限制，它又会怎样把订单和风险传回现货、期货与融资市场？</b><Cite n={6} /><Cite n={45} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 完整反馈回路</p>
        <h2>基差不是一个终点变量，而是“合约对齐—复制—执行—融资—结算—冲击—再定价”的循环状态。</h2>
        <div className="mechanism-chain" aria-label="期货基差与期现套利的八步反馈链">
          <div><span>01</span><b>对齐 Claim</b><p>确认期货最终对应哪一指数、资产、地点、质量或可交割券。</p></div>
          <div><span>02</span><b>同步两腿</b><p>把币种、数量、报价时钟、应计与合约月份放到同一截面。</p></div>
          <div><span>03</span><b>重建 Carry</b><p>加入融资、现金收入、仓储、借券、税费与交割选择。</p></div>
          <div><span>04</span><b>检验边界</b><p>分别用 cash-and-carry（正向期现套利）与 reverse cash-and-carry（反向期现套利）的可执行 bid / ask。</p></div>
          <div><span>05</span><b>取得容量</b><p>确认 repo、borrow、IM、VM、资本、深度与限仓可用。</p></div>
          <div><span>06</span><b>执行与维持</b><p>建立两腿并承受每日结算、追加现金和 hedge drift。</p></div>
          <div><span>07</span><b>平仓或交割</b><p>按合同 fixing、实物发票或两腿市场价格完成闭环。</p></div>
          <div><span>08</span><b>形成新状态</b><p>订单冲击、库存、融资需求和损益成为下一轮输入。</p></div>
        </div>
        <p>
          这条回路包含两种不同的收敛力量。第一种是合同终点：现金结算期货以指定指数 fixing 了结，实物交割期货允许空头交付规定资产并取得发票金额。第二种是到期前的交易反馈：期货过贵时，套利者通常买现金腿、卖期货；期货过便宜时方向相反。两边订单会共同改写价格，但第二种力量有成本、有容量且可能单侧失效。研究者若只画一条 basis 曲线，便把触发条件、交易动作、现金生存和价格结果压成同一个数，因果链无法检验。
        </p>
        <div className="precision-note"><span>本节真正解决的问题</span><p>从任何一条“期货升水 / 贴水”叙述出发，能先重建比较对象与符号，再写出资产特定的公平 carry 和双向执行边界；随后识别 residual basis 来自报价时差、预期收入误差、融资与库存约束、交割选择、需求压力还是风险溢价，并把每种解释转成需要观察的证据。</p></div>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与六阶段路线</p>
        <h2>先修知识只负责辨认合约；本节负责把“期现价差”变成一套跨资产但不乱套公式的诊断方法。</h2>
        <p>
          硬先修是 T07：知道股票、债券、期货与 option 代表不同法律现金流；以及 1.11：知道同一风险的多个市场可以同时生产信息。建议回看 1.20，因为本节的套利能否维持，取决于 leverage、margin 与 forced liquidation。这里不会提供交易建议，也不把某一交易所规则当作全球法。每个真实问题都要重新读取合约规格、清算安排、保证金、现货借贷、税务和交割文件；本节引用 CME、CFTC 与中金所文件，是为了展示不同合同怎样改变机制，而不是把美国规则移植到 A 股。<Cite n={6} /><Cite n={58} /><Cite n={59} />
        </p>
        <div className="learning-objectives">
          <span>六阶段学习路线 · 先闭合对象，再跨资产迁移</span>
          <ol>
            <li><b>对象与语言（03–09）：</b>确认 cash leg、期货合同、主体、符号、单位和三只时钟，拒绝对未定义 basis 作解释。</li>
            <li><b>复制与理论锚（10–17）：</b>从自融资复制推导无收益、离散收入、连续收益与一般 carry，再区分 futures 与 forward。</li>
            <li><b>双向套利账本（18–25）：</b>用正确 bid / ask、乘数、hedge ratio 与终值现金流闭合两种方向，并保留残余风险。</li>
            <li><b>可执行系统（26–34）：</b>把等式扩成非对称成本带，再加入 repo、borrow、IM / VM、冲击、结算、交割选择与换月。</li>
            <li><b>跨资产迁移（35–42）：</b>分别处理股指、单股、外汇、短率、国债、商品、加密与不可储存资产，识别哪项复制条件变化。</li>
            <li><b>诊断与研究（43–49）：</b>构造同步、carry-adjusted residual，完成状态诊断、互动实验、可证伪研究与后续课程接口。</li>
          </ol>
          <p><b>时间预算：</b>第一轮读 00–34，约 85–100 分钟，建立语言、复制和执行账本；第二轮读 35–49，约 65–80 分钟，完成跨资产迁移、案例、实验与练习。参考文献和延伸阅读不计入。</p>
        </div>
      </section>

      <section className="lesson-section" id="cash-leg">
        <p className="section-kicker">阶段一 · 对象与语言　|　03 · Cash leg</p>
        <h2>所谓“现货”首先是一项可取得的经济权利；一个指数点位本身不是可直接交割的证券。</h2>
        <p>
          单只股票、外币与标准化商品可以有相对清晰的 spot asset；股价指数却只是一套计算规则。股指期货套利者实际购买的是按权重配置的成分股篮子、能够充分复制它的 ETF，或一个仍留有 tracking error 的代理组合。美国国债期货的 cash leg 也不是“十年期收益率”，而是合约允许交割的一组具体票息债券；商品现货则必须附地点、等级、批次、运输和可用仓储。若两个价格对应的 claim 不同，价差首先是合同差，不是误价。<Cite n={12} /><Cite n={18} />
        </p>
        <p>
          因此任何 basis 数据表都应保存 `cash_proxy_type`、资产清单或 deliverable ID、币种、数量映射、应计规则与时间戳。用不可交易的官方指数 close 计算描述性 basis 可以服务监测；用它宣称可锁定利润则不够，因为交易者需要在真实篮子上跨越数百条报价、公司行动和税费。1.21 已经建立“官方基准不等于同步可执行价值”的门禁，本节把同一原则应用于现金—期货两腿。
        </p>
      </section>

      <section className="lesson-section" id="contract-anatomy">
        <p className="section-kicker">04 · Futures contract anatomy</p>
        <h2>期货代码不是一条抽象价格线；乘数、到期月、最终结算对象与交割程序共同定义一项 claim。</h2>
        <div className="table-scroll" role="region" aria-label="期货合约字段与其对基差的影响，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">期货合约标的、乘数、期限、结算、交割和风险参数对基差计算的影响</caption>
            <thead><tr><th scope="col">合同字段</th><th scope="col">它决定什么</th><th scope="col">忽略后的典型错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Underlying / reference</th><td>最终对应资产、指数、利率、交割篮子或 fixing</td><td>把相近指数或报价源当成同一 claim</td></tr>
              <tr><th scope="row">Multiplier / quote unit</th><td>一个价格点对应的货币损益与 hedge 数量</td><td>把点差直接当成每张合约利润</td></tr>
              <tr><th scope="row">Contract month</th><td>剩余期限、收入、carry 与可交易流动性</td><td>跨月比较时把期限变化当 mispricing</td></tr>
              <tr><th scope="row">Daily settlement</th><td>每天 VM 的现金时点与保证金账户变化</td><td>只看最终损益，遗漏途中破产风险</td></tr>
              <tr><th scope="row">Final settlement / delivery</th><td>到期收敛的真正对象和最后闭环方式</td><td>要求期货收敛到任意 spot close</td></tr>
              <tr><th scope="row">Limits / clearing</th><td>价格限制、持仓、保证金、净额和违约处理</td><td>从每单位正利润推断无限套利容量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          例如中金所沪深 300 股指期货 IF 当前合约表列明每点 300 元、现金交割、到期月第三个周五为最后交易日，且公开的最低交易保证金只是交易所底线；结算会员可以依据风险另加要求。其交割结算价不是最后一笔指数成交，而是现行细则规定的最后交易日标的指数最后两小时算术平均价。于是到期时应比较期货与该 fixing 的经济敞口，而不是拿 15:00 的一条现货截图强行要求零差。实际适用仍以交易日当时的最新规则与通知为准。<Cite n={58} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="actors-balances">
        <p className="section-kicker">05 · 五张资产负债表</p>
        <h2>“套利者”不是唯一主体；同一闭环分别占用套利基金、dealer、融资方、借券方与清算体系的容量。</h2>
        <div className="table-scroll" role="region" aria-label="期现套利五类主体的现金流、目标与约束，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">期现套利者、执行 dealer、融资方、证券出借方及清算机构的角色对照</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">提供或控制的资源</th><th scope="col">最先绑定的约束</th></tr></thead>
            <tbody>
              <tr><th scope="row">Basis trader</th><td>策略资本、两腿风险与持有期选择</td><td>损失限额、现金缓冲、投资者赎回</td></tr>
              <tr><th scope="row">Cash / futures dealer</th><td>执行、库存、EFP（期转现）/ block（大宗交易）、客户信用</td><td>bid–ask、冲击、资产负债表与集中度</td></tr>
              <tr><th scope="row">Repo / cash lender</th><td>现货腿的回购融资（repo）、期限与 haircut</td><td>抵押品价值、续作、对手方和净额</td></tr>
              <tr><th scope="row">Securities lender</th><td>reverse trade（反向期现套利）所需可交付资产</td><td>可借数量、费率、召回与公司行动</td></tr>
              <tr><th scope="row">FCM（期货佣金商）/ CCP（中央对手方）</th><td>清算、IM、VM、违约瀑布与头寸净额</td><td>模型保证金、附加保证金与流动性</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这些主体看到的“同一套利”并非同一张账。基金可能在经济上 delta-neutral（一阶价格方向暴露近似中性），却仍向 FCM 支付现金 VM；dealer 可能因客户两边流量净额而不需立即交易全部现货；repo lender 的风险是抵押品与对手方，而 CCP 管理的是期货违约暴露。一个局部价差能否关闭，取决于这几张资产负债表能否同时扩张。限制套利理论与 funding-liquidity 研究的核心并非否认相对价值，而是说明正确的终端判断仍可能因资本撤离和短期损失而无法执行。<Cite n={45} /><Cite n={46} /><Cite n={47} />
        </p>
        <div className="model-glossary" aria-label="本节必要术语">
          <article><b>Claim</b><p>一项合同赋予的现金流、交割或结算权利；价格相近不代表 claim 完全相同。</p></article>
          <article><b>Carry</b><p>从今天持有现货到期货终点的净成本或净收益，包括融资和资产收入。</p></article>
          <article><b>Initial margin</b><p>IM，履约抵押；不是购买期货的首付款，也不等于当天损益。</p></article>
          <article><b>Variation margin</b><p>VM，按结算价变化收付的现金；把市场损益逐日实现。</p></article>
          <article><b>Haircut</b><p>抵押品价值中融资方不愿借出的比例；越高，交易者需投入的自有资金越多。</p></article>
          <article><b>Settlement fixing</b><p>合约指定的最终参考价格；可能是开盘组合、时间平均或独立指数值。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="basis-convention">
        <p className="section-kicker">06 · Basis 符号公约</p>
        <h2>同一个“正 basis”在不同市场可以代表相反方向；本节固定 F−S，并在引用外部资料时显式翻译。</h2>
        <div className="equation-card">
          <span>本节统一口径</span>
          <div>B<sup>F−S</sup><sub>t,T</sub>=F<sub>t,T</sub>−S<sub>t</sub>，　b<sup>S−F</sup><sub>t,T</sub>=−B<sup>F−S</sup><sub>t,T</sub></div>
          <p>F 是到期 T 的期货价格，S 是时点 t 的同步 cash proxy。本节 B 为正表示期货高于现货，B 为负表示期货低于现货；很多商品与国债资料把 cash minus futures 定义为 b，所以同一状态的数字正负相反。上标不是幂，而是符号标签。</p>
        </div>
        <p>
          CME 的 equity-index 教学通常把 basis 写成 futures minus spot；其谷物教学则把 basis 写成 local cash minus futures；美国国债资料又把 clean cash price 减去 conversion-factor-adjusted futures 称 gross basis。这三种用法各自在所属市场里成立，却不能把数字直接拼成一个数据库。最稳妥的记录格式是同时保存 `basis_value` 与 `basis_definition`，并在做跨资产比较前统一转换。<Cite n={8} /><Cite n={20} /><Cite n={61} /><Cite n={62} />
        </p>
        <div className="precision-note"><span>Basis 与 basis point 不是一回事</span><p>Basis 是两个价格或收益之间的差；basis point（bp，基点）是利率单位，1 bp=0.01 个百分点。国债价格还常以 1/32 点报价。写“basis 扩大 5bp”时必须说明它是收益率化基差增加 5bp，还是价格基差增加某个 1/32，二者不能自动互换。</p></div>
      </section>

      <section className="lesson-section" id="units-normalization">
        <p className="section-kicker">07 · 单位、归一化与年化</p>
        <h2>点差、货币利润、百分比与年化收益回答不同问题；任何换算都必须保留分母、期限和复利规则。</h2>
        <div className="equation-card">
          <span>四种常见尺度</span>
          <div>B=F−S；　B<sub>%</sub>=B/S；　B<sub>ann</sub>=B/S×Y/d；　V<sub>B</sub>=B×m×N</div>
          <p>B 是价格点差；B% 用现货 S 归一化；简单年化再乘一年天数 Y 除以剩余天数 d；V_B 把点差乘合约乘数 m 和合约数 N，得到尚未扣除 carry 与成本的名义价差金额。它们都还是 raw basis，不是利润；本节把 Π 专门留给完成现金流与成本核算后的利润。若采用实际 / 365、30 / 360、连续复利或收益率 DV01，公式必须改写并注明。</p>
        </div>
        <p>
          假设 S=4,000、F=4,020、剩余 90 天、乘数 300 元，则 raw basis 是 20 点，每张名义价差 6,000 元，简单 360 天年化是 2%。这不等于每张能赚 6,000 元或年化 2%，因为融资与股息可能恰好解释全部 20 点。更危险的是 S 接近零或可以为负的商品：B/S 会爆炸、变号或失去经济意义。2020 年 WTI 事件提醒我们，价格允许为负时必须回到每桶现金流、交割义务和仓储容量，不能机械使用对数与百分比。<Cite n={63} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="term-structure-language">
        <p className="section-kicker">08 · 升贴水、Contango 与 Backwardation</p>
        <h2>期货相对现货的升贴水与不同月份之间的曲线形状不是同一个比较，专业写作应把两种关系分开。</h2>
        <p>
          本节用 futures premium / discount 描述某个到期月 F<sub>T</sub> 相对同步现货 S 的高低；用 contango / backwardation 优先描述远月相对近月的期限结构。现实口语会把 F&gt;S 也称 contango，但若缺少可交易现货、近月受到交割挤压或 cash proxy 与期货质量不同，这种说法会掩盖机制。最清晰的表达是直接写“六月合约相对同步 cash 升水 12 点”“九月相对六月高 8 点”，再在需要时给曲线标签。
        </p>
        <p>
          曲线向上并不自动意味着市场预期未来现货上涨。对可储存商品，远月通常需要补偿融资和仓储；库存稀缺时，持有实物提供生产连续性与缺货保险的 convenience yield，近月反而可高于远月。对股指，融资率与预期股息决定公平斜率；对外汇，两种货币利率差决定 forward points。Futures price、expected future spot 与 risk premium 是三个对象，Fama–French 的商品研究也正是把 storage relation 与预测 / 风险溢价模型分开检验。<Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="three-clocks">
        <p className="section-kicker">09 · 三只时钟</p>
        <h2>报价时钟决定你看见什么，逐日结算时钟决定今天要付多少钱，到期时钟决定最终收敛到哪里。</h2>
        <p>
          第一只时钟是 spot 与 futures 的实时可交易报价；跨时区股指、停牌成分、债券 evaluated price 或延迟指数都会使两腿不同步。第二只是交易所 daily settlement：它可能来自一段结算窗口或规则化估计，用于计算当日 VM，却未必等于最后成交。第三只是 final settlement / delivery：合约可能用成分股 special opening quotation、最后两小时平均、某一利率 fixing，或实物交割月中的可选择日期。把三个时钟混成“收盘价”，会同时制造虚假 basis、错误现金流和错误收敛判断。<Cite n={7} /><Cite n={59} /><Cite n={65} />
        </p>
        <p>
          一个严谨观测至少保存 spot quote timestamp、futures quote timestamp、daily settlement window、final fixing rule、当地交易日和时区。若现金市场已经关闭而期货仍交易，应先用仍可交易的 ETF、相关期货、FX 与成分映射估计 synchronized cash proxy，并把模型误差单独报告；此时 raw overnight basis 可以描述信息到达，却不能直接证明存在两腿同时可执行的套利。这是 1.11 的价格发现与本节相对价值之间最重要的接口。
        </p>
      </section>

      <section className="lesson-section" id="zero-income-replication">
        <p className="section-kicker">阶段二 · 复制与理论锚　|　10 · 无收益资产的复制</p>
        <h2>最简单的期货公平价值来自“今天买入并融资持有”和“未来按合同取得同一资产”必须具有相同终值，而不是来自预测。</h2>
        <div className="equation-card">
          <span>无现金收入、可储存资产的理想远期价</span>
          <div>K<sub>0,T</sub>=S<sub>0</sub>/P(0,T)；若 r 恒定，则 K<sub>0,T</sub>=S<sub>0</sub>e<sup>rT</sup></div>
          <p>P(0,T) 是今天支付 1 元、到 T 收到 1 元的无违约贴现因子；r 是与该贴现因子一致的连续复利率。含义是：今天借 S 买入资产，到期需偿还 S/P；远期交割价若长期高于或低于这一终值，且资产可自由买卖、融资、储存和交割，就能构造相反方向的自融资组合。</p>
        </div>
        <p>
          设今天金属现货为 100，半年连续融资率 4%，且没有存储、收入和交易成本，则复制终值约为 102.02。这个数不是“市场认为半年后金属会涨到 102.02”，而是两种取得同一半年后资产的方法在理想条件下的相对价格。若未来实际现货为 80 或 130，long cash 与 long forward 的终端资产价值都会随之变化；套利比较的是两条采购路径，而不是押注终点。Black 以及 Jarrow–Oldfield 的经典工作为商品 forward / futures 的这一无套利出发点提供了正式框架。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="known-income">
        <p className="section-kicker">11 · 已知离散现金收入</p>
        <h2>持有现货能收到的已知股息或票息会降低净持有成本；每笔现金流必须先按自己的日期估值。</h2>
        <div className="equation-card">
          <span>离散收入的预付远期与交割价</span>
          <div>V<sub>pre,0</sub>(T)=S<sub>0</sub>−ΣD<sub>i</sub>P(0,t<sub>i</sub>)；　K<sub>0</sub>(T)=V<sub>pre,0</sub>(T)/P(0,T)</div>
          <p>D_i 是在 t_i 支付且能够锁定的现金收入；先从现货中扣除每笔收入的现值，得到 prepaid forward（今天一次付清、到期取货）的价格 V_pre,0，再把它融资到 T。常数连续利率时可写成 K=[S−ΣD_i e^(−rt_i)]e^(rT)。股息在不同日期支付，不能简单把总额从到期价格中随意相减。</p>
        </div>
        <p>
          如果一只股票今天 100，三个月后确定支付 2，半年后交割，利率为正，那么持有现货者在到期前已经收到并可再投资这 2 元；远期多头没有。公平交割价因此低于无股息的融资终值。现实普通股股息并不完全确定，除息日和金额可调整，公司还会发生拆股、并购与特别分红；所以单股与股指的 dividend input 通常是预期或已锁定的 dividend swap 值。把预期误差叫“无风险套利利润”，会把模型风险藏进一个确定符号。<Cite n={9} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="continuous-yield">
        <p className="section-kicker">12 · 连续收益率版本</p>
        <h2>连续股息率公式是对大量分散现金流的紧凑近似；它的简洁不意味着输入可观测且无风险。</h2>
        <div className="equation-card">
          <span>连续比例收益的 cost-of-carry 关系</span>
          <div>F<sup>*</sup><sub>t,T</sub>=S<sub>t</sub>e<sup>(r−q)τ</sup>，　τ=T−t</div>
          <p>r 是与融资和抵押品一致的连续利率，q 是持有现货期间按价值比例获得的连续收益率，τ 用年表示。r&gt;q 时公平期货通常高于现货；q&gt;r 时可以低于现货。星号表示给定输入与假设下的 fair-value estimate，不表示观察到的成交价。</p>
        </div>
        <p>
          对宽基股指，q 汇总成分股在剩余期限内的预期普通股息，并随指数权重、公司公告、除息日与税务变化。把昨日 trailing dividend yield 直接代入远月，会把历史分红当成未来已知现金流；把无担保银行借款利率与隔夜抵押融资混用，又会改变 r。一个专业的 fair-value 数据集应保存 dividend curve 的来源、每个期限的融资曲线、复利日数、更新时间与不确定区间，而不是只输出一条“理论价”。<Cite n={9} /><Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="generalized-carry">
        <p className="section-kicker">13 · Generalized carry stack</p>
        <h2>跨资产共用的不是一条万能公式，而是一张“持有成本减持有收益”的现金—服务账本。</h2>
        <div className="table-scroll" role="region" aria-label="不同资产持有成本与持有收益构成，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">股指、单股、外汇、国债、商品和加密资产的 carry 输入及主要不可锁定项</caption>
            <thead><tr><th scope="col">资产</th><th scope="col">持有成本</th><th scope="col">持有收益 / 服务</th><th scope="col">主要不确定项</th></tr></thead>
            <tbody>
              <tr><th scope="row">股指篮子</th><td>融资、交易、税费、再平衡</td><td>成分股股息与借贷收入</td><td>未来股息、复制误差、公司行动</td></tr>
              <tr><th scope="row">单只股票</th><td>融资、borrow、投票权差异</td><td>股息、所有权与可能的借贷收入</td><td>hard-to-borrow、召回、特别分红</td></tr>
              <tr><th scope="row">外汇</th><td>一国货币融资</td><td>另一国存款利息</td><td>资金曲线、信用、cross-currency basis</td></tr>
              <tr><th scope="row">国债</th><td>repo、haircut、资本与交割</td><td>票息、repo specialness、便利属性</td><td>CTD、交割选择与 repo 续作</td></tr>
              <tr><th scope="row">可储存商品</th><td>资金、仓储、保险、损耗、运输</td><td>库存服务与 convenience yield</td><td>库容、地点、质量与库存状态</td></tr>
              <tr><th scope="row">Crypto</th><td>法币 / 稳定币资金、托管、margin</td><td>现货借贷或 staking 等资产特定收益</td><td>venue、抵押币、转账和监管分割</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          某些项是可锁定现金流，例如定期 repo、已宣布固定票息或签好的仓储费；另一些是状态依赖的影子收益，例如生产商持有库存避免停产的 convenience yield。后者可以解释均衡曲线，却不一定能被纯金融套利者收进账户。统一写成 r+u−y 只有在这些项都是比例率、期限一致且可加时才成立；若仓储费按吨按月、股息离散支付、repo 会逐日 special，必须逐笔做终值账本。Working、Brennan 与现代库存模型都强调库存服务价值是内生的，而非固定 coupon。<Cite n={28} /><Cite n={29} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="fair-residual-basis">
        <p className="section-kicker">14 · Fair basis 与 residual basis</p>
        <h2>真正需要解释的不是 raw F−S，而是观察值相对同一状态 carry 锚的剩余；这个剩余仍包含测量误差。</h2>
        <div className="equation-card">
          <span>三层 basis</span>
          <div>B<sub>raw</sub>=F−S；　B<sup>*</sup>=F<sup>*</sup>−S；　ε=F−F<sup>*</sup>=B<sub>raw</sub>−B<sup>*</sup></div>
          <p>B_raw 是屏幕总价差；B* 是给定融资、收入、仓储和合同假设得到的公平 carry；ε 是 residual basis。ε&gt;0 表示期货相对所选模型昂贵，ε&lt;0 表示便宜。由于 F* 使用估计输入，ε 不是无争议真值，更不能不经 bid/ask 和成本检验就称为套利利润。</p>
        </div>
        <p>
          若现货 4,000、期货 4,030，raw basis 为 +30；融资减股息的公平 carry 若为 +38，则 residual 是 −8：期货虽然高于现货，却相对 carry 锚便宜。若次日 raw basis 扩到 +35、fair carry 因利率上升和股息下修扩到 +55，residual 反而降到 −20。由此，“升水扩大”与“期货相对价值变贵”可以同时不成立。所有实证和互动题都应同时存 B_raw、B*、ε 及其输入版本。
        </p>
      </section>

      <section className="lesson-section" id="implied-financing">
        <p className="section-kicker">15 · Implied financing / repo</p>
        <h2>把期货价反解成盈亏平衡融资率，比直接看点差更接近套利者的真实决策，但仍需与自己的边际资金成本比较。</h2>
        <div className="equation-card">
          <span>简单利率、已知到期收入的教学反解</span>
          <div>r<sub>impl</sub>=[F+I<sub>T</sub>−S]/(Sτ)</div>
          <p>I_T 是把持有期现金收入滚存到到期后的价值，τ 是年化期限。r_impl 表示：若现货按这个利率融资，买现货并卖期货的毛终值恰好持平。它不是市场统一的无风险利率，也不是交易者一定能取得的 repo quote。</p>
        </div>
        <p>
          S=1,000、F=1,018、半年期限、股息终值 8 时，implied financing 是 5.2%。若某机构真实边际融资率 4.7%，期货相对其现金复制可能有正 carry；若另一机构要付 5.8%，同一价格对它没有 cash-and-carry 利润。美国国债 desks 使用 implied repo rate（IRR）逐券比较现金券、转换因子、票息和交割发票；最高 IRR 的券通常在冻结交割日下最便宜交割，但这比上式复杂得多。<Cite n={20} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="contractual-convergence">
        <p className="section-kicker">16 · Convergence 的合同原因</p>
        <h2>到期收敛不是市场“相信同一价值”，而是两个 claim 在终点变得可互换或由同一 fixing 结算。</h2>
        <p>
          对现金结算股指期货，最后结算损益由合同 reference index 的指定 fixing 决定；若期货在可交易的最后阶段与可复制 fixing 存在确定性大差，能交易两边的机构会受到激励纠偏。对实物交割商品，空头可按规则交付合格地点与品级，长头支付发票；真正约束期货的是边际可交割品的全成本。对 Treasury futures，发票还乘 conversion factor 并加应计利息。于是“F_T=S_T”只是非常简化的缩写，严谨表达应说明 S_T 究竟是哪一合同结算对象。<Cite n={6} /><Cite n={17} /><Cite n={18} />
        </p>
        <p>
          收敛也可能不平滑。最后交易日前，订单集中、借券稀缺、仓储权、交割品 specialness、涨跌停或 settlement-window 风险都可令 basis 先扩大；现金指数与最终 fixing 的时间窗不同，还能在最后一刻保留显示差。历史 CBOT wheat 的长期 convergence 问题说明，实物交割设计、库容和可交割凭证经济性若错位，合同终点本身也需要修复。<Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="forward-futures">
        <p className="section-kicker">17 · Forward 与 Futures</p>
        <h2>远期通常到期一次结算，期货每天把损益变成现金；利率随机且与价格相关时，两者不应被无条件视为同价。</h2>
        <div className="precision-note">
          <span>进阶边界 · 首读可跳过</span>
          <p>先记住不需要测度语言的结论：利率确定时，理想远期与期货通常共享同一价格锚；利率随机且与标的价格共同变化时，每日现金收付会造成差异。下面一行只是这一边界的严格定价写法，不要求首读时推导。</p>
        </div>
        <div className="equation-card">
          <span>测度与现金路径的严格边界</span>
          <div>G<sub>t</sub>(T)=E<sup>Q</sup><sub>t</sub>[S<sub>T</sub>]；　K<sub>t</sub>(T)=E<sup>Q<sup>T</sup></sup><sub>t</sub>[S<sub>T</sub>]</div>
          <p>E_t[·] 表示只使用时点 t 已有信息的定价条件期望。Q 与 Q^T 不是投资者对真实结果的主观预测概率，而是更换 numeraire（计价基准）后的两套无套利记账框架：Q 以滚动现金账户为基准，Q^T 以到期 T 的贴现资产为基准。在理想连续盯市与一致抵押曲线下，期货价 G 使用前者，远期交割价 K 使用后者；贴现因子确定时二者在这一关系上没有差异，利率与标的共同随机时，早期 VM 的再投资或融资价值才会通过协方差产生调整。</p>
        </div>
        <p>
          直觉上，若 long futures 在价格上涨的日子较早收到现金，而这些日子又伴随较高利率，它能把盈利按更高利率再投资；相反路径则要更早融资亏损。方向取决于标的、利率和贴现因子的协方差，不能把 convexity adjustment 记成恒正数。Cox–Ingersoll–Ross、Jarrow–Oldfield、French 与 Cornell–Reinganum 分别从理论和经验讨论了这种差异；现实场外（OTC）远期还多出对手方信用、抵押、净额和 funding valuation，不能把所有观测 spread 都归因于逐日盯市。<Cite n={1} /><Cite n={2} /><Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="executable-quotes">
        <p className="section-kicker">阶段三 · 双向套利账本　|　18 · Executable quotes</p>
        <h2>套利检验必须让四个报价站在正确方向：买入付 ask，卖出收 bid；中点只能描述，不能成交。</h2>
        <div className="equation-card">
          <span>两种方向的报价门</span>
          <div>cash-and-carry：买 S<sup>a</sup>、卖 F<sup>b</sup>；　reverse：卖 S<sup>b</sup>、买 F<sup>a</sup></div>
          <p>上标 a 与 b 分别表示 ask 和 bid。期货过贵的候选利润从 F^b 减去现金腿的 ask-side 复制终值；期货过低的候选利润从卖空现货所能收到的 S^b 终值减去 F^a 与借券成本。用 F_mid−S_mid 发现异常后，仍须用两条可执行边重算。</p>
        </div>
        <p>
          假设同步报价为 S=99.90/100.10、F=101.00/101.20，忽略 carry。中点显示期货升水 1.10，但正向交易只能在 101.00 卖期货、在 100.10 买现货，毛边际为 0.90；反向交易则要以 99.90 卖现货、101.20 买期货。若两腿不在同一瞬间成交，先成交的一腿还暴露于 leg risk。限价单可以降低价格不确定性，却提高只成交一腿的概率；市价化执行提高完成率，却可能穿透订单簿。早期股指期货实证已经表明，交易成本、执行延迟和现货篮子交易的摩擦会把理论等式扩成一段区间。<Cite n={10} /><Cite n={11} /><Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="cash-carry-direction">
        <p className="section-kicker">19 · Cash-and-carry 的方向</p>
        <h2>当期货 bid 高于买入并持有现金腿的完整终值时，正向套利才开始成立；“F 大于 S”远远不够。</h2>
        <div className="mechanism-chain" aria-label="现金持有套利从建仓到终点的六步现金流链">
          <div><span>01</span><b>借入资金</b><p>按交易者真实可得期限与抵押条件融资。</p></div>
          <div><span>02</span><b>买入 cash</b><p>按 ask 取得合同可交割资产或足够精确的复制篮子。</p></div>
          <div><span>03</span><b>卖出 futures</b><p>按 bid 锁定期货端收入，同时提交 IM。</p></div>
          <div><span>04</span><b>持有与维护</b><p>收股息或票息，支付仓储、再平衡、VM 与融资。</p></div>
          <div><span>05</span><b>合同闭环</b><p>交割现货，或用最终 cash fixing 对冲篮子价值。</p></div>
          <div><span>06</span><b>偿还并归因</b><p>偿还融资本息，扣除全部成本后才得到净利润。</p></div>
        </div>
        <p>
          这套交易不会因为标的价格上涨或下跌而自动失效：只要现金腿与期货终点的 claim 完全匹配，标的终值会在两腿中抵消。真正可能破坏锁定的是复制对象变化、未来收入估错、资金无法续作、保证金现金不足、交割规则选择权或执行数量不匹配。换言之，方向风险可以很小，basis、funding 与 liquidity risk 却仍很大。CFTC 将期货的经济用途描述为风险转移与价格发现；套利正是把相同风险的两种表达连接起来，但交易所并不替套利者提供现金腿或融资。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="cash-carry-ledger">
        <p className="section-kicker">20 · Cash-and-carry 终值账本</p>
        <h2>把每笔现金流滚到同一终点，才能看见利润来自哪里，也才能避免把股息、票息或保证金重复计算。</h2>
        <div className="table-scroll" role="region" aria-label="现金持有套利终值账本，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">以一单位期货 claim 为基准，买入匹配现金腿并卖出期货的初始、持有期与到期现金流</caption>
            <thead><tr><th scope="col">时点</th><th scope="col">现金腿</th><th scope="col">期货腿</th><th scope="col">资金与其他</th></tr></thead>
            <tbody>
              <tr><th scope="row">t 建仓</th><td>按 S<sup>a</sup> 买入与一单位期货 claim 匹配的现金腿</td><td>按 F<sup>b</sup> 卖出匹配期货；提交 IM</td><td>借入购买金额并支付佣金、税费和冲击</td></tr>
              <tr><th scope="row">t 到 T</th><td>收到股息、票息或库存服务；维持篮子</td><td>每日 VM 收付，期货价格路径影响现金账户</td><td>支付融资、仓储、保险、借贷与再平衡成本</td></tr>
              <tr><th scope="row">T 闭环</th><td>交付资产或按 fixing 变现复制篮子</td><td>期货交割 / 最终结算，取得锁定价</td><td>偿还融资本息，收回 IM，扣清算与退出成本</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>每单位终值利润的教学式</span>
          <div>Π<sub>CC</sub>=F<sup>b</sup>−[S<sup>a</sup>A<sub>b</sub>−I<sub>T</sub>+C<sub>hold</sub>]−C<sub>exec</sub></div>
          <p>A_b 是从建仓到 T 的借款累积因子，I_T 是所有现金收入滚到 T 的价值；C_hold 与 C_exec 分别表示未纳入 A_b 的持有和执行成本。只有 Π_CC&gt;0 且可执行数量为正，才存在题设条件下的正向成本后机会。</p>
        </div>
        <p>
          例：现货 ask 为 200，半年借款终值 204，股息终值 3.20，期货 bid 为 204.50，其他成本 0.45 点，则净利润是 204.50−(204−3.20)−0.45=3.25 点；乘数每点 100 元时每张为 325 元。这个数字仍未给出资本回报率：分母可能是 repo haircut、IM、VM 缓冲与运营资本之和，而非 20,000 元现金腿名义价值。实验中的第二题会要求你亲手关闭这张账。
        </p>
      </section>

      <section className="lesson-section" id="reverse-direction">
        <p className="section-kicker">21 · Reverse cash-and-carry 的方向</p>
        <h2>当期货 ask 低于可卖空现金腿的净终值时，反向套利需要先借到完全匹配的资产，再谈价格。</h2>
        <div className="mechanism-chain" aria-label="反向现金持有套利从借券到归还的六步现金流链">
          <div><span>01</span><b>定位 borrow</b><p>确认数量、费率、期限、召回条款和卖空所得限制。</p></div>
          <div><span>02</span><b>卖出 cash</b><p>按 bid 卖出借入资产，处理抵押和收入补偿义务。</p></div>
          <div><span>03</span><b>买入 futures</b><p>按 ask 建立未来取得资产或等值现金的权利。</p></div>
          <div><span>04</span><b>维持空头</b><p>补偿股息、票息与公司行动，承受 borrow repricing。</p></div>
          <div><span>05</span><b>取得资产</b><p>通过交割或最终结算买回匹配资产。</p></div>
          <div><span>06</span><b>归还与结算</b><p>归还借券，释放抵押，扣除全部费用。</p></div>
        </div>
        <p>
          现实中这一方向通常更窄、更不稳定。卖空所得可能被冻结为抵押而不能自由投资；借券费会随拥挤程度上升；出借人可以召回；hard-to-borrow 股票还可能面临 buy-in；指数篮子中只要一小部分成分不可借，完整复制就会断裂。D’Avolio 的证券借贷证据和 BIS 的制度综述都说明，借券供给、费率与召回风险具有强烈的资产异质性。因而理论下界并不是上界的镜像，某些状态下反向纠偏容量可以近似为零。<Cite n={15} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="reverse-ledger">
        <p className="section-kicker">22 · Reverse cash-and-carry 终值账本</p>
        <h2>反向套利的“卖空收入”不是无条件可用现金；可投资比例、股息补偿和归还义务必须写进同一账本。</h2>
        <div className="equation-card">
          <span>每单位反向终值利润的教学式</span>
          <div>Π<sub>RCC</sub>=S<sup>b</sup>[αA<sub>l</sub>+(1−α)A<sub>c</sub>]−F<sup>a</sup>−I<sub>T</sub>−C<sub>borrow</sub>−C<sub>exec</sub></div>
          <p>α 是卖空所得中可自由投资的比例，A_l 是该部分的累积因子；其余部分通常作为受限现金抵押，A_c 表示抵押本金到终点的返还与净 rebate 因子。I_T 是必须补偿给出借人的资产收入终值。即使 α=0，本金也不会凭空消失；受限使用改变的是途中可动用现金、桥接融资与容量。为简写，后文令 A_short=αA_l+(1−α)A_c。</p>
        </div>
        <p>
          例：以 80.00 的 bid 卖空，题设令 α=1，所得允许投资并到期变成 80.60；同时以 78.90 的 ask 买期货，到期补偿股息 0.50，借券与执行成本 0.42，则每单位净利润为 0.78。若乘数 500，是 390 元。可是只要借券不能锁定至到期，这个 390 元就不是无风险终值：提前召回可能迫使交易者在价格最不利时买回现货。实证中应把 locate、available quantity、borrow fee、utilization、recall / buy-in、cash-collateral rebate 和卖空所得用途作为状态变量，而不是把 short-sale feasibility 编码成永远为 1。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="multiplier-hedge">
        <p className="section-kicker">23 · Multiplier 与 hedge ratio</p>
        <h2>一张期货对应多少现金腿，取决于乘数、价格敏感度与合同映射；按“各买一份”不会自动中性。</h2>
        <div className="equation-card">
          <span>名义数量与一阶风险配比</span>
          <div>N<sub>f</sub>≈V<sub>cash</sub>β/(F·m)；　DV01<sub>fut</sub>≈DV01<sub>CTD</sub>/CF<sub>CTD</sub></div>
          <p>股指篮子中，V_cash 是现金组合价值，β 是相对期货指数的一阶暴露，F·m 是每张期货名义价值。国债中不能只配名义本金，要用 CTD 的每基点价值除以转换因子近似期货 DV01，再随 CTD 和期限变化更新。</p>
        </div>
        <p>
          如果用 ETF 代替完整指数篮子，β、费用、股息、净值时钟和跟踪误差都会让 hedge ratio 漂移；若合约数只能取整数，还会留下 rounding residual。Treasury futures 的 CTD 切换更会使 duration 暴露离散跳变。一个专业账本应同时报告 price-basis units、currency P&amp;L、notional hedge ratio、DV01 / beta residual 以及 rebalancing rule。否则“基差收敛但组合亏损”可能只是数量映射错了，而非理论失败。CME 的 Treasury 教材以转换因子、CTD、implied repo 与 risk conversion 共同说明这一点。<Cite n={20} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="pnl-layers">
        <p className="section-kicker">24 · P&amp;L 分层</p>
        <h2>把终端收敛收益、每日现金流、会计估值与资本回报混成一个“套利收益率”，会隐藏策略真正承担的风险。</h2>
        <div className="table-scroll" role="region" aria-label="期现套利利润的四层口径，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">期现套利毛收敛、净经济损益、现金流动性与资本回报的区别</caption>
            <thead><tr><th scope="col">层</th><th scope="col">回答的问题</th><th scope="col">不能替代什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Gross convergence</th><td>观察期货相对复制锚偏离多少</td><td>不能替代 bid / ask、融资与税费后的利润</td></tr>
              <tr><th scope="row">Net economic P&amp;L</th><td>若闭环成功，扣全部成本后赚多少</td><td>不能说明途中要筹多少现金</td></tr>
              <tr><th scope="row">Liquidity path</th><td>VM、haircut、settlement 和 margin call 何时发生</td><td>不能由终端净利润推回</td></tr>
              <tr><th scope="row">Return on constrained capital</th><td>净利润相对 IM、haircut、buffer 与资本占用是否值得</td><td>不能用现金腿名义额或期货保证金单独充当统一分母</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          逐日结算使期货总损益仍等于开仓价与最终结算价之差，却改变现金到达顺序。短期不利波动可先制造 VM 流出，随后才由现金腿浮盈或终端收敛补回；若账户、法律实体或结算币种不同，经济对冲不能保证当天现金净额。CME 的结算资料明确按每日结算价计算 variation margin；CIR 与 French 则说明现金时点在随机利率下还进入 futures–forward 定价差。<Cite n={7} /><Cite n={1} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="residual-risk">
        <p className="section-kicker">25 · Residual risk ledger</p>
        <h2>“Market neutral”只表示某个一阶方向暴露接近零；期现套利仍把多种非方向风险集中到一起。</h2>
        <div className="model-glossary" aria-label="期现套利的八类残余风险">
          <article><b>Basis risk</b><p>cash proxy 与期货合同终点不完全相同，价差可在持有期继续扩大。</p></article>
          <article><b>Dividend / coupon risk</b><p>未来收入金额、时点或税务与建模输入不同。</p></article>
          <article><b>Funding risk</b><p>融资成本、haircut、期限和续作条件改变。</p></article>
          <article><b>Borrow risk</b><p>借券费、可得数量、召回和 buy-in 改变反向闭环。</p></article>
          <article><b>Margin liquidity</b><p>IM 与 VM 在终端利润实现前消耗现金。</p></article>
          <article><b>Execution risk</b><p>一腿成交、另一腿滑点或市场深度不足。</p></article>
          <article><b>Delivery risk</b><p>CTD、质量、地点、日期和 settlement fixing 发生状态切换。</p></article>
          <article><b>Model / legal risk</b><p>合同映射、公司行动、净额、税法或账户规则理解错误。</p></article>
        </div>
        <p>
          这些风险位于不同时间尺度：毫秒级 leg risk、日内价格冲击、每日 VM、数日 repo 续作、合约月 roll 与终点交割选择会彼此耦合。最危险的不是每项单独很大，而是压力期同时同向恶化：basis 扩大带来账面损失，波动上升提高保证金，dealer 收缩降低深度，融资方提高 haircut，投资者又赎回策略资本。Shleifer–Vishny、Gromb–Vayanos 与 Brunnermeier–Pedersen 分别从委托资本、金融中介和融资—市场流动性反馈说明，理论收敛并不保证持仓者有能力等待。<Cite n={45} /><Cite n={46} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="arbitrage-band">
        <p className="section-kicker">阶段四 · 可执行系统　|　26 · 非对称套利带</p>
        <h2>现实无套利关系是一段由两个不同方向、两套边际成本共同形成的带，而不是围绕理论价对称的一条线。</h2>
        <div className="equation-card">
          <span>教学版可执行边界</span>
          <div>F<sup>b</sup>≤U=S<sup>a</sup>A<sub>b</sub>−ΣD<sub>i</sub>A<sub>i,T</sub>+C<sub>CC</sub>；　F<sup>a</sup>≥L=S<sup>b</sup>A<sub>short</sub>−ΣD<sub>i</sub>A<sub>i,T</sub>−C<sub>RCC</sub></div>
          <p>U 是 cash-and-carry 刚好不再盈利的期货上界，L 是 reverse 刚好不再盈利的下界；A_short 是自由投资部分与受限抵押部分合并后的卖空所得净终值因子。C_CC 与 C_RCC 把各自方向的交易、冲击、仓储、借券、税费、资本和交割成本折到 T；它们通常不同，且会随交易量与市场状态变化。</p>
        </div>
        <p>
          只有同时满足“报价越界、成本可锁定、两腿可成交、数量大于零、现金路径可承受”，越界才转化成实际订单。可以把可执行机会写成 `edge × capacity`：每单位 edge 为正而 capacity=0 时，总可锁定利润仍为零；随着规模扩大，market impact 与资产负债表成本上升，边际 edge 会被吃掉。Cornell–French、Modest–Sundaresan 和后续股指研究发现，交易成本与制度摩擦能够解释一部分但并非全部观测偏离；正确做法不是预设“市场有效或无效”，而是估计当时、该交易者、该规模的状态依赖边界。<Cite n={9} /><Cite n={10} /><Cite n={11} /><Cite n={12} />
        </p>
        <div className="precision-note"><span>边界是参与者特定的</span><p>同一报价可以落在低成本 dealer 的套利带外，却仍在零售或未获借券机构的套利带内。市场价格通常由能在边际扩张资产负债表的参与者决定，因此研究应观察融资和借券分布，而不是只代入一个“无风险利率”。</p></div>
      </section>

      <section className="lesson-section" id="funding-repo-haircut">
        <p className="section-kicker">27 · Funding、Repo 与 Haircut</p>
        <h2>现金腿的经济成本由融资利率决定，策略能做多大却常由 haircut 和融资期限决定；二者不是同一个约束。</h2>
        <div className="equation-card">
          <span>repo 的最小资产负债表</span>
          <div>cash borrowed≈P(1−h)；　own cash≈Ph；　ROE≈net convergence profit/(Ph+IM+VM buffer)</div>
          <p>P 是抵押证券市值，h 是 haircut，ROE 是 return on equity（权益或自有资本回报率）；这里采用受约束资本口径，分母近似包括 repo haircut 对应的自有资金、期货 IM、VM 缓冲与运营资本。repo rate 决定借款期间的利息，haircut 决定交易者必须先投入多少自有现金。低利率不等于低流动性需求。</p>
        </div>
        <p>
          一个 1 亿美元现金券头寸在 2% haircut 下需要约 200 万美元自有资金；若压力期 haircut 升到 6%，即使证券价格和终端套利利润完全不变，也要立即多筹 400 万美元。若 repo 是隔夜而期货三个月后交割，策略还做了期限转换：每天能否续借并非由期货合同保证。repo specialness 可以让特定国债的融资率显著低于一般抵押利率，成为持有该券的收入；相反，dealer balance-sheet charge、净额能力和季末窗口也会抬高边际成本。Treasury basis 的现代研究因此把 repo、haircut、资本和 futures margin 一起建模，而非只比较 cash price 与 conversion-factor-adjusted futures。<Cite n={20} /><Cite n={27} /><Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="margin-path">
        <p className="section-kicker">28 · IM、VM 与现金生存</p>
        <h2>期货保证金降低对手方信用风险，却把市场风险转成高频现金需求；终端正收益不提供今天的付款能力。</h2>
        <div className="table-scroll" role="region" aria-label="初始保证金与变动保证金的机制区别，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Initial margin、variation margin 与期现套利经济对冲的区别</caption>
            <thead><tr><th scope="col">项目</th><th scope="col">作用</th><th scope="col">对 basis desk 的现金含义</th></tr></thead>
            <tbody>
              <tr><th scope="row">Initial margin</th><td>覆盖清算期间潜在未来暴露的抵押</td><td>建仓即占用高质量流动资产，可随波动和集中度上调</td></tr>
              <tr><th scope="row">Variation margin</th><td>把每日结算损益转成当前现金</td><td>不利路径先提款；未来收敛盈利不能抵消今日缺口</td></tr>
              <tr><th scope="row">Economic hedge</th><td>让两腿终端价值方向相反</td><td>若在不同账户、实体或结算系统，未必产生即时法律净额</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          假设一张空头期货从 4,020 依次结算到 4,050、3,990、4,005、4,000，乘数 50 元。每日现金流为 −1,500、+3,000、−750、+250 元，最终净赚 1,000 元，但第一天已经需要 1,500 元现金。压力期 IM 同时上调时，策略必须在最差时点卖出流动资产或缩仓。BIS 对 2020 年 3 月 margin dynamics 的分析和 FSB 的系统回顾都指出，保证金在保护交易基础设施的同时，可以通过参与者的现金筹集行为放大市场流动性压力；这不是“保证金有害”，而是风险安全与现金需求之间的系统权衡。<Cite n={50} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="borrow-recall">
        <p className="section-kicker">29 · Borrow、Recall 与单侧边界</p>
        <h2>卖空约束并非只增加一个固定费用；它可能让反向套利的交易数量、持有期限和终点都不再可锁定。</h2>
        <p>
          一次可靠 locate 只说明建仓时可能借到证券，不一定保证到期前不会被 recall。交易者还要知道 borrow fee 是固定还是浮动、抵押品用什么币种、卖空所得能否投资、除息时怎样补偿、公司行动怎样处理，以及 buy-in 在何种条件下发生。对于股指篮子，最难借的一小组权重股可以决定整篮下界；用 ETF 代替又引入 ETF 自身 premium、borrow 与 tracking。D’Avolio 显示借券市场存在从一般 collateral 到极端 special 的显著分布，BIS 制度综述则说明出借、抵押、结算和召回安排因市场而异。<Cite n={15} /><Cite n={16} />
        </p>
        <p>
          这会产生可检验的非对称预测：借券供给骤降或费率上升时，负 residual basis 的绝对值和持续时间应更容易扩大；正 residual basis 未必同步变化。若只用 basis 的无条件标准差检验“套利限制”，便看不到方向。更严格的设计应将 borrow shock 与信息冲击、预期股息变化和共同流动性分开，并检验未来 borrow 恢复是否先于 residual 收敛；相关性本身仍不能证明借券约束造成贴水。
        </p>
      </section>

      <section className="lesson-section" id="impact-capacity">
        <p className="section-kicker">30 · Market impact 与容量</p>
        <h2>套利订单一边纠偏、一边制造自己的成本；最优规模停在边际收敛收益等于边际执行与资本成本的位置。</h2>
        <div className="equation-card">
          <span>从每单位利润到容量选择</span>
          <div>Π<sub>dir</sub>(x)=x·e<sub>dir</sub>−C<sub>cash</sub>(x)−C<sub>fut</sub>(x)−C<sub>fund</sub>(x)；　x≥0；　内点：dΠ<sub>dir</sub>/dx=0</div>
          <p>先选择 cash-and-carry 或 reverse 方向，再把该方向扣除公平 carry、规模不变的单位成本与正确 bid / ask 后、尚未计规模依赖成本的每单位可执行毛边际记为 e_dir；它与 Section 14 有正负方向的 mid residual ε 不是同一变量。x 是非负套利规模，不是 Section 17 的定价测度 Q。两腿冲击和资金成本通常随 x 非线性上升；在内点最优处，新增一单位的方向性毛边际恰好等于新增执行与融资成本。若还存在一次性总固定成本，应另列并影响是否参与，而不进入这个内点边际条件；e_dir&gt;0 也不意味着 x 可以无限增大。</p>
        </div>
        <p>
          买现金、卖期货会抬高 cash ask、压低 futures bid，因此正常情况下形成负反馈；但如果许多机构随后因同一风控信号被迫反向平仓，订单就变成卖现金、买期货，可能进一步扩大原有 basis。深度还取决于执行速度：一次扫完整篮子会遭受冲击，分批执行又暴露 leg risk 与信息泄露。Gromb–Vayanos 说明受限套利者的头寸与市场流动性相互决定，Brunnermeier–Pedersen 则给出 funding liquidity 与 market liquidity 的互相强化机制；这些理论告诉我们，basis 既是信号，也是中介容量的内生结果。<Cite n={46} /><Cite n={47} />
        </p>
      </section>

      <section className="lesson-section" id="settlement-delivery">
        <p className="section-kicker">31 · Settlement 与 Delivery</p>
        <h2>现金结算把终点压缩成一个 fixing，实物交割把终点展开成资产、地点、质量、日期与发票；两者的基差对象不同。</h2>
        <div className="table-scroll" role="region" aria-label="现金结算与实物交割对基差闭环的差异，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">现金结算期货和实物交割期货的终点、套利现金腿与残余风险</caption>
            <thead><tr><th scope="col">结构</th><th scope="col">合同终点</th><th scope="col">现金腿要求</th><th scope="col">主要 basis risk</th></tr></thead>
            <tbody>
              <tr><th scope="row">Cash-settled</th><td>指定窗口计算的 reference fixing</td><td>能复制该 fixing 的资产篮子或代理</td><td>跟踪、指数重构、报价时差与 fixing-window impact</td></tr>
              <tr><th scope="row">Physical delivery</th><td>合格资产交付并按发票付款</td><td>可取得、融资、储存并交付合约规定资产</td><td>质量、地点、运输、应计、交割失败与选择权</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中金所 IF 是现金交割，最终结算依现行结算细则指定的指数时间窗；CME 美国股票指数合约也按各自 final settlement procedure 处理，并非所有合约都用相同 close。CBOT Treasury futures 则由空头在合格篮子中选择证券，发票金额以期货结算价乘 conversion factor，再加 accrued interest。因而“到期 basis 为零”必须改写为“期货与合同定义的交割等价物收敛”；拿另一地点、另一质量、另一指数版本或另一时钟的 spot 去检验，会产生合法的非零差。<Cite n={17} /><Cite n={18} /><Cite n={58} /><Cite n={59} /><Cite n={65} />
        </p>
      </section>

      <section className="lesson-section" id="delivery-option">
        <p className="section-kicker">32 · Delivery option 与 CTD</p>
        <h2>当空头拥有交割选择权，期货对应的不是一只固定现券；cheapest-to-deliver 是价格、票息、repo 与交割日期共同决定的内生状态。</h2>
        <div className="equation-card">
          <span>Treasury futures 的逐券发票与基差</span>
          <div>Invoice<sub>i,d</sub>=F<sub>d</sub>CF<sub>i</sub>+AI<sub>i,d</sub>；　GB<sub>i</sub>=P<sub>i</sub>−FCF<sub>i</sub>；　NB<sub>i</sub>=GB<sub>i</sub>−Carry<sub>i</sub></div>
          <p>i 表示可交割券，d 表示允许的交割日，CF 是 conversion factor，AI 是应计利息；F_d 是按合约规则用于交割日 d 发票计算的期货结算价，F 是计算当下 gross basis 时冻结的同单位期货报价，P_i 是券 i 的 clean cash price，Carry_i 是换成与 gross basis 相同价格单位的持有 carry。Gross basis 使用 clean cash price 减调整后的期货；net basis 再扣持有 carry。注意这里沿用 Treasury 市场的 S−F 传统，与本节统一 F−S 口径符号相反。</p>
        </div>
        <p>
          在冻结交割日、资金和成本时，空头通常偏好 implied repo rate 最高的券；若规则允许交割日选择，还要对券与日期联合优化。Conversion factor 假设一条标准化收益率曲线，只是近似消除不同票息和期限的价格差，不能使所有券经济等价。CTD 会随收益率水平、曲线形状、票息、repo specialness 与时间切换；切换会同时改变期货的 duration、DV01 和 basis hedge ratio。CME 的合约规则与交割教材给出制度细节，Gay–Manaster、Kane–Marcus 与 Boyle 则将质量和时机选择权正式化。<Cite n={17} /><Cite n={18} /><Cite n={19} /><Cite n={20} /><Cite n={23} /><Cite n={24} /><Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="convergence-stress">
        <p className="section-kicker">33 · Convergence under stress</p>
        <h2>2020 年 3 月 Treasury basis 说明：终端逻辑可以不变，而融资、保证金与市场深度先迫使套利容量收缩。</h2>
        <p>
          典型交易是 repo 融资买入可交割 Treasury、同时卖出 futures，赚取很小的净 carry；高杠杆把微小年化边际放大，也让 basis 扩大、价格波动、VM、haircut、风险价值（VaR）限额和 repo 续作变得致命。疫情冲击初期现金需求激增，Treasury cash liquidity 恶化，部分 leveraged funds 缩减 basis 头寸：卖出现金券并回补期货的动作可向本已承压的现金市场增加供给。Fed、FSB、BIS 与跨机构官方报告都把这一渠道视为 2020 年 3 月市场失灵的一部分。<Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={53} /><Cite n={56} /><Cite n={57} />
        </p>
        <p>
          但“basis trade 是唯一或已识别的主要原因”超出了证据。同期 foreign official / private holders、mutual funds 与其他投资者也大规模出售 Treasury；aggregate dealer repo 并未简单停摆；更新的 futures order-book 研究也没有发现 basis traders 是十年期 Treasury futures 场内流动性失灵的主要驱动。不同论文因 holdings 调整、账户分类和时间窗不同给出不同规模，不能把 “quantitative hedge funds”“leveraged funds”“households”直接等同 basis traders。最稳健结论是：高杠杆相对价值头寸通过现金需求和强制缩仓放大了部分压力，但贡献大小、市场分段与净因果仍需逐数据源识别。<Cite n={53} /><Cite n={54} /><Cite n={55} /><Cite n={56} /><Cite n={57} />
        </p>
        <div className="precision-note"><span>数字口径门禁</span><p>若使用 Banegas 等人的估计，必须区分未做估值调整的持仓下降与 valuation-adjusted 现金销售估计；若使用 2020Q1 sector flow，也必须说明 household sector 含 hedge funds 但不等于 hedge funds，更不等于 basis unwind。案例的价值在机制，不在拼一个虚假的唯一规模。</p></div>
      </section>

      <section className="lesson-section" id="roll-calendar">
        <p className="section-kicker">34 · Roll 与日历价差</p>
        <h2>换月不是把一个合约代码替换成另一个；它先关闭旧终点、再开启新终点，因而同时重置 carry、流动性和交割风险。</h2>
        <p>
          当近月流动性迁移至远月，交易者通常用 calendar spread 同时平近月、开远月，减少两笔 outright 的方向暴露。roll price 约等于 F_far−F_near，反映两段期限之间新增的融资、股息、仓储、便利收益与风险溢价，也包含两个月份各自的订单压力。把连续期货序列机械前复权或后复权可以服务收益研究，却会改写价格水平；如果再用这个合成序列计算 spot basis，就可能把人为 roll adjustment 当成经济价差。CME 的官方 roll 教学强调流动性迁移和 spread execution，实际 rollover 仍取决于产品规则和交易者 mandate。<Cite n={67} />
        </p>
        <p>
          一个可审计数据集应保存 raw contract prices、具体月份、last trade / delivery calendar、open interest、volume、chosen roll rule 与 adjustment amount。研究期限结构时使用同一时点的真实月份；研究可投资连续收益时再明确 roll return。对商品 ETF 或指数产品，roll 还可能是产品规则触发的可预测订单，需求冲击反过来影响日历价差。到这里，我们已经建立了可执行系统；下一阶段只做一件事：检查不同资产改变了哪一条复制前提，而不是重新发明一个“专属基差直觉”。
        </p>
      </section>

      <section className="lesson-section" id="equity-index">
        <p className="section-kicker">阶段五 · 跨资产迁移　|　35 · Equity-index futures</p>
        <h2>股指期货的公平 carry 是融资减预期股息；真正 cash leg 是动态成分股篮子，而不是屏幕上的指数点位。</h2>
        <div className="equation-card">
          <span>宽基股指的工作锚</span>
          <div>F<sup>*</sup>=S·A<sub>fund</sub>−D<sub>T</sub>；　ε=F−F<sup>*</sup></div>
          <p>S 应是同步、可复制的 cash-basket value，A_fund 是与交易者抵押和期限匹配的累积融资因子，D_T 是到期前成分股股息的终值。若使用连续近似，才简化为 Se^(r−q)τ。residual ε 仍要经过 bid / ask、指数复制和资本成本检验。</p>
        </div>
        <p>
          交易者要处理成分权重、停牌、涨跌停、除息、公司行动、指数定期调整、税费与整数股；用 ETF 作为 cash proxy 可降低成分股执行复杂度，却继承 ETF premium、管理费、申赎和 tracking error。Cornell–French、Modest–Sundaresan、MacKinlay–Ramaswamy 与 Klemkosky–Lee 的经典研究表明，股息、交易成本、时钟和执行延迟都是观测 basis 的核心部分。CME 的 fair-value 与 basis 材料把融资和预期股息置于模型中心，也明确 basis 会随期限缩短收敛。<Cite n={9} /><Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={14} /><Cite n={61} />
        </p>
        <p>
          A 股应用必须从具体合约出发。以中金所 IF 为例，现金腿对应沪深 300 成分组合，合约乘数、现金交割与最后结算规则由交易所定义；融资融券可得性、现货 T+1、成分股涨跌停、期货保证金和持仓限制又使两种套利方向不对称。由此，“IF 贴水代表普遍悲观”并不成立：贴水可以混合预期股息、现金—衍生品需求、对冲压力、融券约束、资本成本和不同交易时钟。要研究情绪，必须先从 raw basis 中剥离这些可观察机制。<Cite n={58} /><Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="single-stock">
        <p className="section-kicker">36 · Single-stock futures</p>
        <h2>单股让“同一资产”更清晰，却把借券、公司行动和控制权差异放到定价中心；它并不比股指更简单。</h2>
        <p>
          若到期前股息可确定，单股远期锚可逐笔扣除股息现值；但现实股息可能调整，特别分红、rights issue、split、merger、spin-off 与停牌会触发合约调整。现货股东拥有投票权并可能获得借贷收入，期货多头通常没有同样法律权利。cash-and-carry 需要现货融资；reverse 需要借到这只股票，因而 hard-to-borrow fee 与 recall 可能主导下界。D’Avolio 的结果提醒我们，借券成本不是所有股票共享的常数，而会在少数紧俏证券上变成数量约束。<Cite n={15} />
        </p>
        <p>
          单股 basis 因此适合做“事件分解”而非单一情绪指标：先把已公告股息、合约调整、borrow fee 与 funding curve 做成逐日事件表，再观察 residual 是否在 earnings、index inclusion 或 short-interest shock 附近变化。若只用未调整的 close-to-close basis，除息日会机械产生跳跃；若借券数据只覆盖一家 prime broker，又会把机构特定供给误当全市场状态。真正的反例是：即使投资者一致看跌，只要现货借券极度稀缺，期货也可能相对现货更低而无法被 reverse arbitrage 快速修复。
        </p>
      </section>

      <section className="lesson-section" id="fx-cip">
        <p className="section-kicker">37 · FX forward 与 Covered Interest Parity</p>
        <h2>外汇的两条现金腿是两种货币存款；远期点首先连接两国融资曲线，而不是一国货币方向预测。</h2>
        <div className="equation-card">
          <span>以“本币 / 1 单位外币”报价的离散 CIP</span>
          <div>F/S=(1+r<sub>d</sub>τ)/(1+r<sub>f</sub>τ)；　若 basis 加在本币腿：F/S=[1+(r<sub>d</sub>+b<sub>d</sub>)τ]/(1+r<sub>f</sub>τ)</div>
          <p>r_d 与 r_f 分别是本币和外币在相同期限、信用、抵押与日数规则下的资金率。符号方向随报价和 basis 放置位置改变；论文或交易终端中的“美元 basis 为负”不能脱离公式直接翻译。</p>
        </div>
        <p>
          复制关系是：借入本币、在 spot 买外币、投资外币，并用 forward 把到期外币换回本币；反方向则交换两种货币角色。全球金融危机后，主要货币长期出现相对标准 CIP 的偏离。BIS 与 Du–Tepper–Verdelhan 将其连接到银行资产负债表、对冲需求、监管与美元资金成本；Akram–Rime–Sarno 在高频可执行数据中则发现许多偏离短暂且受交易成本约束。这两类证据并不矛盾：短时小偏离可被套利，而持久的 cross-currency basis 可以是边际中介容量的均衡价格。<Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} />
        </p>
        <p>
          研究 FX basis 时必须对齐 spot settlement date、forward tenor、holiday calendar、onshore / offshore venue、抵押币种和信用曲线。NY Fed 对 crisis-era FX basis 的研究说明，资金压力与市场分割会改变边际；把离岸 USD/CNH forward points 直接解释为人民币贬值预期，同样会遗漏中美利差、美元融资、资本流动制度和流动性 premium。<Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="short-rate">
        <p className="section-kicker">38 · Short-rate futures</p>
        <h2>短期利率期货的“现货”不是一只可永久储存资产，而是未来一段日均或复利利率的合同 fixing；报价还常与利率方向相反。</h2>
        <div className="equation-card">
          <span>典型价格—利率翻译</span>
          <div>quoted futures price=100−implied rate；　Δprice=−Δrate</div>
          <p>若报价从 95.00 升至 95.10，隐含利率从 5.00% 降至 4.90%。实际 payoff、最小变动价值、reference period、compounding 与 final settlement 必须以合约规则为准；“期货升水”语言在这里往往不如直接比较隐含利率清楚。</p>
        </div>
        <p>
          forward rate agreement 在期初或期末按单一利率现金流结算，SOFR（Secured Overnight Financing Rate，担保隔夜融资利率）futures 则把合约指定期间的实际隔夜利率路径聚合后结算。逐日盯市与利率—价格相关性造成 convexity bias，因此 futures-implied rate 不等于对应 forward rate 的无条件替代；CIR 的一般理论和 CME 的短率教材都强调要做调整。这里也没有可像股票那样“一次买入指数”的现金腿：套利需要利率 swaps、OIS（overnight indexed swap，隔夜指数掉期）、repo 或一组债券现金流复制，信用和抵押差异会进入 residual。<Cite n={1} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="treasury">
        <p className="section-kicker">39 · Treasury futures</p>
        <h2>国债 basis 是可交割篮子、conversion factor、票息、repo 与交割选择权的联合问题；单一 F−S 图不足以定义交易。</h2>
        <p>
          工作流程必须逐券进行：列出 deliverable basket，读取 clean price 与 accrued interest；按可能交割日计算 invoice；把期间 coupon 按实际日期再投资；锁定或情景化 repo 和 haircut；计算 gross basis、net basis 与 implied repo；选择在该情景下对空头最有利的 CTD；最后用 CTD/CF 的 DV01 配置期货数量。EFP 可以在合格参与者之间把 cash 与 futures 腿作为相关交易报告，但不会消除信用、融资或成交价格的经济成本。<Cite n={17} /><Cite n={18} /><Cite n={20} /><Cite n={21} /><Cite n={22} />
        </p>
        <p>
          这一结构解释了为何 Treasury basis 可以在收益率曲线或 repo specialness 变化时跳跃：不是所有变化都来自“套利拥挤”，也可能是 CTD 切换或交割期权价值变化。Fed 的规模研究必须结合仓位、repo、杠杆和期限来看；若用公开 futures net short 直接等同 cash-futures basis，可能把 dealer hedges、relative-value 之外的 duration trades 和客户头寸混在一起。<Cite n={27} /><Cite n={53} /><Cite n={57} />
        </p>
      </section>

      <section className="lesson-section" id="commodities">
        <p className="section-kicker">40 · Storable commodities</p>
        <h2>商品 carry 不仅支付钱，还支付空间、运输和库存服务；便利收益是实物稀缺状态的影子价格，不是可领取 coupon。</h2>
        <div className="equation-card">
          <span>比例、确定输入下的简化式</span>
          <div>F<sup>*</sup>=S·e<sup>(r+u−y)τ</sup></div>
          <p>r 是融资率，u 是按价值比例表示的仓储、保险与损耗，y 是 convenience yield。只有当这些输入能以同期限比例率表达时才能相加；现实按桶、吨、地点收取的费用应逐项记账。y 往往由 F、S、r、u 反解，不能再把它当独立观测事实解释 F。</p>
        </div>
        <p>
          高库存通常降低边际库存服务价值，使融资和仓储更容易主导、曲线偏向 contango；库存紧张、生产连续性或即时交付需求提高 convenience yield，可能产生 backwardation。Working、Brennan、Fama–French、Routledge–Seppi–Spatt 与 Schwartz 分别从库存、风险溢价和动态模型刻画这种关系。它不是铁律：季节、质量、地点、运输瓶颈和生产套保需求都可改变曲线。商品市场又常把 basis 定义为 local cash−futures，应用本节 F−S 前必须反号。<Cite n={28} /><Cite n={29} /><Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={62} />
        </p>
        <p>
          2020 年 4 月 WTI 近月价格短暂为负，是交割义务、指定地点库容与退出容量共同绑定的极端例子。负价不是“石油没有价值”，而是临近交割的合约持有人为摆脱在 Cushing 接收实物的边际义务而付费；远月与其他地点并未同时等价归零。此时百分比 basis、对数收益和恒定比例仓储式都可能失效，必须用每桶现金流、交割日历与容量约束。CFTC 与 EIA 的事件资料支持这一合同—仓储解释，同时也提醒不能把单日极端机制外推到所有商品期限。<Cite n={63} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="crypto">
        <p className="section-kicker">41 · Crypto dated futures 与 perpetuals</p>
        <h2>加密基差保留融资—持有逻辑，却因 venue、抵押品与 perpetual funding 的制度设计而高度分割。</h2>
        <p>
          有固定到期日且以法币现金结算的 bitcoin futures 可以从现货融资、托管、借贷收益、交易与清算成本建立 carry 锚；若用稳定币、币本位抵押或另一交易所指数，现金流和尾部风险已不同。CME 的规则文件展示受监管 dated futures 的结算结构，BIS 的研究则把 crypto cash-and-carry 回报与中介约束、投资者需求和市场分割联系起来。一个交易所的高 annualized basis 不能脱离提现、托管、信用与结算币种，直接与另一 venue 的低 basis 比较。<Cite n={41} /><Cite n={44} />
        </p>
        <p>
          Perpetual futures 没有固定到期和强制 F_T=S_T 的终点，依赖定期 funding payment、mark-price 规则和清算机制把价格拉向指数。正 funding 通常由 long 向 short 支付，但频率、上限、利率项和 premium index 因 venue 而异；下一期 funding 也不是持仓时就全部锁定。BitMEX 的产品指南给出一种具体实现，学术模型则说明 funding rule、liquidation 与交易者需求怎样共同定价；二者都不能代表所有 perpetual。因而“做多 spot、做空 perp”是滚动、路径依赖的 carry strategy，不是有固定终点的经典 cash-and-carry。<Cite n={42} /><Cite n={43} /><Cite n={66} />
        </p>
      </section>

      <section className="lesson-section" id="non-storable">
        <p className="section-kicker">42 · Non-storable underlyings</p>
        <h2>当标的无法经济地跨期储存，经典买现货持有复制链断裂；期货与预期现货、风险溢价和生产约束的联系会更直接。</h2>
        <p>
          电力必须在网络中实时平衡，低成本大规模储存仍受技术和地点约束；某小时电价不能像黄金一样买下并保存到下月。因此 Se^(r+u−y)T 不是普遍套利等式。发电商与用电方通过 futures / forwards 转移数量和价格风险，边际期货价格同时反映负荷、天气、燃料、机组启停、输电约束、非线性供给与风险厌恶。Bessembinder–Lemmon 的均衡模型预测 forward premium 与 expected demand 的 variance 和 skewness 有系统关系，恰好展示“不可储存”怎样改变理论中心。<Cite n={34} />
        </p>
        <p>
          同类边界也适用于波动率、天气、运费或排放指标等难以直接买入储存的 underlying：可以用动态证券组合、物理运营或其他衍生品近似复制，但不能未经证明就把它称为 spot cash-and-carry。此时 futures−index 的差更接近风险转移价格与模型复制误差，收敛仍由合同 fixing 保证，却不产生一条简单可交易的现货上、下界。这是跨资产迁移的终极门禁：先问复制资产是否存在，再决定能否使用 carry 语言。
        </p>
      </section>

      <section className="lesson-section" id="synchronized-basis">
        <p className="section-kicker">阶段六 · 诊断与研究　|　43 · Synchronized executable basis</p>
        <h2>一条可研究的基差序列不是 F close 减 S close，而是同一 claim、同一时点、同一单位上的双侧可执行比较。</h2>
        <div className="table-scroll" role="region" aria-label="同步可执行基差数据协议，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">构造同步可执行基差必须保存的合同、报价、carry、执行和容量字段</caption>
            <thead><tr><th scope="col">数据层</th><th scope="col">最低字段</th><th scope="col">拒绝的捷径</th></tr></thead>
            <tbody>
              <tr><th scope="row">Claim</th><td>cash proxy / deliverable ID、合约月、乘数、币种、final fixing / delivery</td><td>只按名称相近配对</td></tr>
              <tr><th scope="row">Quotes</th><td>两腿 bid / ask、数量、时间戳、时区、交易状态</td><td>last-to-last、不同步 close</td></tr>
              <tr><th scope="row">Carry</th><td>期限资金曲线、收入现金流、仓储 / borrow、日数与版本</td><td>一条常数无风险率</td></tr>
              <tr><th scope="row">Execution</th><td>spread、depth、fees、tax、impact model、integer hedge</td><td>中点 residual 等同利润</td></tr>
              <tr><th scope="row">Capacity</th><td>borrow / repo quantity、haircut、IM、VM buffer、limits</td><td>每单位正 edge 推断无限规模</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>至少同时发布三条序列</span>
          <div>B<sub>mid</sub>=F<sub>mid</sub>−S<sub>mid</sub>；　E<sub>CC</sub>=F<sup>b</sup>−U；　E<sub>RCC</sub>=L−F<sup>a</sup></div>
          <p>B_mid 用于描述；E_CC&gt;0 表示期货越过正向上界，E_RCC&gt;0 表示越过反向下界。每条 edge 还要配当时最大可执行数量。Equity index 的 Basis Trade at Index Close（BTIC，按指数收盘基差交易）等机制可以围绕指数 close basis 交易，但它定义了特定执行流程，并不让未同步的任意 close 天然可套利。</p>
        </div>
        <p>
          若现货市场关闭而期货继续交易，可以用相关 futures、ETF、FX 和最近成分权重估计 latent synchronized spot，但必须把估计值标为模型代理并给不确定区间。若 cash basket 中部分证券停牌，理论 mid 可以继续算，reverse capacity 却可能已为零。CME 的 BTIC 资料展示围绕 index close 交易 basis 的一套合同化流程；它有助于缩小时钟不确定性，却不能替代对实际产品资格、交易窗口与最终结算的核验。<Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="change-decomposition">
        <p className="section-kicker">44 · Basis change decomposition</p>
        <h2>基差变化必须分成现货信息、期货信息、期限衰减、carry 输入、执行摩擦和容量变化；只有最后的剩余才需要新的故事。</h2>
        <div className="equation-card">
          <span>从总变化到可归因变化</span>
          <div>B<sup>*</sup><sub>carry</sub>=F<sup>*</sup>−S<sub>sync</sub>；　Δε=ΔF−ΔS<sub>sync</sub>−ΔB<sup>*</sup><sub>carry</sub></div>
          <p>先把 fair basis 定义为完整公平期货价减同步现货，避免重复扣除 S。若数据从观察现货出发，定义 S_sync=S_obs+M_sync，则同一式展开为 Δε=ΔF−ΔS_obs−ΔM_sync−ΔB*carry。ΔB*carry 由期限缩短、资金曲线、股息 / 票息、仓储和交割状态更新产生；剩余仍可混合需求、风险溢价、执行误差和未观测约束。</p>
        </div>
        <p>
          一个已经同步的股指 raw basis 从 +20 扩至 +30 点，不代表 residual 一定扩大 10 点：期限缩短本应减少 carry 3 点，利率上升增加 6 点，预期股息下修增加 4 点，因此 fair basis 净增 7 点，residual 只增 10−7=3 点。若原始 cash proxy 另有 4 点 stale correction，应先通过 M_sync 把观察现货转换成 S_sync，而不能又把同一修订塞进 fair carry。反过来，raw basis 不变也可能掩盖大幅 residual 变化。对 Treasury 还要加入 CTD / delivery-date switch；对 commodity 加入库存地点与仓储；对 FX 加入两条资金曲线；对 perpetual 加入已经实现与预期 funding。
        </p>
        <p>
          归因应同时报告 level、change 与现金 P&amp;L，避免把相关变量重复放入。比如 repo specialness 既可能作为 Treasury carry 输入，也可能作为 funding constraint 指标；若两边都完整扣除，就会 double count。最稳妥做法是先冻结一张现金流模型，再用替代规格做敏感性区间，并把“模型解释份额”与“因果解释”分开。
        </p>
      </section>

      <section className="lesson-section" id="state-diagnosis">
        <p className="section-kicker">45 · 五状态诊断</p>
        <h2>同样大小的 residual basis 可以来自五种不同状态；辨认机制要看伴随证据和之后的反馈，而不是给价差贴情绪标签。</h2>
        <div className="table-scroll" role="region" aria-label="五种基差状态的机制、证据和反例，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">正常 carry、信息时钟、需求压力、融资约束和合同交割状态的诊断对照</caption>
            <thead><tr><th scope="col">候选状态</th><th scope="col">首先看什么</th><th scope="col">关键反例</th></tr></thead>
            <tbody>
              <tr><th scope="row">Carry / input revision</th><td>利率、股息、票息、仓储、期限是否同步改变</td><td>扣除新输入后 residual 仍扩大</td></tr>
              <tr><th scope="row">Information-clock mismatch</th><td>cash 是否关闭、停牌或 evaluated；期货是否先吸收新闻</td><td>两腿同时可交易且报价深度正常</td></tr>
              <tr><th scope="row">Hedge-demand pressure</th><td>客户流、open interest、dealer inventory 与期货冲击</td><td>价差变化先于且不伴随需求代理</td></tr>
              <tr><th scope="row">Funding / intermediation constraint</th><td>repo、borrow、haircut、margin、dealer balance sheet 与容量</td><td>低成本套利者容量扩张而价差仍不响应</td></tr>
              <tr><th scope="row">Delivery / contract state</th><td>CTD、库容、地点、fixing、roll 与限价状态</td><td>合同映射固定且交割选项无变化</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          五种状态可以共存，并在不同尺度主导。海外新闻到达而 A 股现金市场关闭时，夜间期货—旧 spot 差首先是信息时钟；开盘后若期货贴水仍持续，同时融券不可得和对冲需求上升，主导机制可能转为单侧容量；临近交割又可能被 fixing 与 roll 取代。所谓“basis 指标”若不允许状态切换，就会把一个变量在夜间、开盘、常态和压力期的不同含义混为一谈。
        </p>
        <div className="precision-note"><span>六问门诊</span><p>先问比较的是哪两个 claim；再问符号、单位与时钟；第三问公平 carry 的每个输入；第四问两条执行边和容量；第五问合同终点与现金路径；最后才问 residual 与哪些竞争机制的预测一致、有什么证据可以推翻它。</p></div>
      </section>

      <section className="lesson-section" id="research">
        <p className="section-kicker">46 · 可证伪研究设计</p>
        <h2>世界观可以包含全部反馈，研究问题必须冻结一条局部箭头：某项外生容量变化是否改变成本调整后 residual 的动态。</h2>
        <p>
          一个可执行模板是：在已控制同步 cash value、期限 carry、公开新闻和合同状态后，利用预定规则变化、差异化保证金、repo / borrow eligibility、dealer constraint exposure 或交割篮子边界，检验受影响合约相对可比对照的 E_CC / E_RCC、深度、成交、收敛半衰期和两腿 price impact 是否发生方向一致的变化。应展示事件前趋势、安慰剂日期、替代 cash proxy、不同执行规模和带有容量为零的样本，而不是只回归 mid basis。Barth–Kahn、Kruttli 等最新研究以及 Segmented Arbitrage 的框架都把不同中介的资产负债表与相对价值分割放到识别中心。<Cite n={48} /><Cite n={49} /><Cite n={60} />
        </p>
        <p>
          识别难点至少有三层。第一，basis 本身会吸引套利头寸，仓位与价差互为因果；第二，波动既扩大价格误差，也提高 margin 和 impact，不能只作为“控制变量”随意吸收；第三，公开仓位类别并不等于具体策略。工具变量或差分设计只有在排除限制可信时才改善因果解释，不能靠名称自动成立。研究结论应写成局部、条件式：例如“在这项规则冲击、这些合约和此执行规模下，下界越界的持续时间增加”，而不是“套利限制决定所有基差”。
        </p>
        <div className="learning-objectives">
          <span>最小可复现研究包</span>
          <ol>
            <li><b>预注册对象：</b>符号、cash proxy、月份、时区、roll、final settlement 和排除规则。</li>
            <li><b>冻结模型：</b>两条资金曲线、收入、成本、bid / ask、depth 与 capacity，保存每次版本。</li>
            <li><b>竞争解释：</b>至少同时列出 carry revision、信息时钟、需求、融资与交割状态。</li>
            <li><b>动态结果：</b>不只看均值，还看方向不对称、尾部、收敛速度、现金需求和两市场冲击。</li>
            <li><b>反事实检查：</b>前趋势、placebo、替代代理、未受影响期限 / 合约和负向对照。</li>
            <li><b>结论边界：</b>区分统计 association、局部因果、可执行利润与策略容量。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">47 · 互动实验</p>
        <h2>Mode A 先闭合符号、双向交易与逐日现金流；Mode B 再诊断 carry、单侧边界、CTD 与 margin feedback。</h2>
        <p>
          八道题使用冻结的教学参数。前四题要求区分中点与执行边、把股息和融资滚到同一终点、识别反向套利的 borrow 条件，并逐日计算 VM；后四题刻意设置“利率升而公平升水收窄”“越过旧下界却无法借券”“raw basis 最小却不是 CTD”和“终端盈利远小于即时现金需求”等反直觉状态。提交选择后才会显示计算和机制诊断。
        </p>
        <FuturesBasisLab />
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">48 · 主动练习与理解检查</p>
        <h2>六道可复算练习检验账本，十个诊断问题检验你能否跨资产迁移，而不是只记住 F=S·e^(r−q)T。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · Raw、fair 与 residual</span><p>同步现货 S=2,500，90 天期货 F=2,528，采用 360 天简单制。现金腿融资本息增加 37.5 点，预期股息终值 18 点。求 raw basis、公平 basis、residual 及 raw basis 简单年化。</p><details className="practice-answer"><summary>展开核对答案</summary><p>Raw basis=2,528−2,500=28 点；fair basis=37.5−18=19.5 点；residual=28−19.5=8.5 点。raw 简单年化=28/2,500×360/90=4.48%。4.48% 未扣 carry，不能当套利收益率。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 正向执行边</span><p>Spot ask=120.20，到期借款累积因子 1.015，期间收入终值 0.80，持有与执行成本 0.35；futures bid=122.10。求 cash-and-carry 每单位净边际。</p><details className="practice-answer"><summary>展开核对答案</summary><p>现金复制终值=120.20×1.015−0.80=121.203；加其他成本后上界 U=121.553。净边际=122.10−121.553=0.547。只有在两腿数量、资金和容量均可锁定时才是候选净利润。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 反向边界失效</span><p>旧模型给出的 reverse 下界 L=74.60，futures ask=73.90，显示越界 0.70；但可借数量为 0。另有一只 tracking beta=0.94 的 ETF 可借。是否仍能称原合约无风险套利？</p><details className="practice-answer"><summary>展开核对答案</summary><p>不能。原现金腿容量为零，所以 exact reverse trade 不存在。可借 ETF 只能构造带 beta、tracking、ETF basis 和股息误差的相对价值对冲；0.70 不再是锁定利润，而是需要重新估计 hedge ratio 与残余风险的信号。</p></details></article>
          <article className="practice-problem"><span>练习 04 · Variation margin 路径</span><p>在 5,100 点卖出两张期货，乘数 200 元；随后结算价为 5,145、5,080、5,110、5,060。求每日现金流、最终损益与最大累计现金流出。</p><details className="practice-answer"><summary>展开核对答案</summary><p>两张每点价值 400 元。每日点数为 −45、+65、−30、+50，对应 −18,000、+26,000、−12,000、+20,000 元；最终累计 +16,000 元。累计路径为 −18,000、+8,000、−4,000、+16,000，最大累计流出为 18,000 元。</p></details></article>
          <article className="practice-problem"><span>练习 05 · Haircut 与资本回报</span><p>现金腿名义 5,000 万元，repo haircut 由 3% 升至 7%；期货新增 IM 60 万元，剩余终端净利润预计 25 万元。求新增即时资本需求及其相对终端利润倍数。</p><details className="practice-answer"><summary>展开核对答案</summary><p>Haircut 增量=5,000 万×4%=200 万元；加新增 IM 60 万，总即时需求 260 万元，是 25 万终端利润的 10.4 倍。终端仍正不意味着交易者能维持持仓。</p></details></article>
          <article className="practice-problem"><span>练习 06 · FX parity 与报价</span><p>S=7.20 本币/外币，半年本币简单利率 3%，外币 1%，忽略成本。求 CIP forward；若实际 forward 为 7.31，先说明偏离方向，再列出至少两项不能据此直接称套利的检查。</p><details className="practice-answer"><summary>展开核对答案</summary><p>F*=7.20×(1+0.03×0.5)/(1+0.01×0.5)=7.271642。实际 7.31 相对该锚高约 0.03836 本币/外币。仍要核对两边可得资金率与信用 / 抵押一致性、spot 与 forward bid / ask、settlement calendar、额度和资本、onshore / offshore 可兑换性；任何一项都可改变可执行边界。</p></details></article>
        </div>
        <div className="check-grid">
          <details><summary>01 · 为什么 F&gt;S 不能推出市场看涨？</summary><p>融资、股息、仓储与其他 carry 在无方向预测下就能产生升水；必须先比较 F 与同状态 F*，而 futures price 也不是物理概率下未来现货的机械期望。</p></details>
          <details><summary>02 · 为什么同一 basis 数字必须附符号定义？</summary><p>股指常用 F−S，商品与 Treasury 常用 S−F；相同市场状态会得到相反正负号。还须附单位、月份、cash proxy 与时间戳。</p></details>
          <details><summary>03 · 为什么反向套利通常比正向更脆弱？</summary><p>它需要可锁定借券、处理股息与公司行动，并受召回、buy-in、费率跳升和卖空所得限制；因此下界可比上界更宽甚至失效。</p></details>
          <details><summary>04 · 到期收敛为什么不保证中途 basis 单调缩小？</summary><p>合同只固定终点；期间信息、carry 输入、订单、资金、margin、交割选择与 roll 都会改变价格，受限套利者还可能在偏离扩大时被迫退出。</p></details>
          <details><summary>05 · IM 与 VM 最关键的区别？</summary><p>IM 是覆盖潜在未来暴露的履约抵押；VM 把已经发生的每日结算损益转为现金。两者都会占用流动性，但经济含义不同。</p></details>
          <details><summary>06 · 为什么 CTD 不能只看 raw basis 最小？</summary><p>应把 clean price、conversion factor、应计、票息时点、repo 与交割日期共同纳入 implied repo / net basis；选择权和 CTD 会随状态改变。</p></details>
          <details><summary>07 · Contango 为什么不等于未来现货上涨预测？</summary><p>远月高于近月可由融资、仓储和低 convenience yield 产生；期货曲线还混合风险溢价和需求，不能直接等同 expected spot path。</p></details>
          <details><summary>08 · Perpetual funding 为什么不等于固定期限 basis？</summary><p>Perpetual 没有到期强制收敛，未来 funding 会重设并依赖价格状态；策略要持续滚动，承担 venue、抵押和清算路径风险。</p></details>
          <details><summary>09 · 如何判断 basis 扩大来自信息还是融资约束？</summary><p>比较交易时钟与新闻到达、两腿 lead-lag，同时观察 repo、borrow、margin、depth、dealer inventory 和收敛速度；两类机制可共存，需要外生变化才能推进因果识别。</p></details>
          <details><summary>10 · 为什么 basis 研究必须报告 capacity？</summary><p>每单位 edge 只有在两腿、资金、借券和风险限额允许的数量上才可实现；capacity=0 时显示越界不会产生纠偏订单。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">49 · 课程接口与结课诊断</p>
        <h2>本节把“升贴水”改写成可审计的合同—现金流—容量系统；下一节先把 forward 与 carry 作为期权定价输入，后续再进入对冲反馈、衍生品联动与 A 股状态。</h2>
        <div className="interface-grid">
          <article><span>← T07</span><h3>合约最小基础</h3><p>输入 spot、forward、futures、bond 与 index claim 的区别，防止把价格线当成同一资产。</p></article>
          <article><span>← 1.11</span><h3>跨市场价格发现</h3><p>输入信息可能先进入期货；本节把 lead–lag 与同步可执行套利、时钟误差分开。</p></article>
          <article><span>← 1.20</span><h3>Leverage 与 Liquidation</h3><p>输入 IM、VM、haircut、强制平仓和流动性反馈，解释正确交易为何也会提前退出。</p></article>
          <article><span>← 1.21</span><h3>ETF Arbitrage</h3><p>输入可交易 cash proxy、双侧报价和一级容量；本节增加期限 carry 与期货结算。</p></article>
          <article><span>→ 1.23</span><h3>期权价格与 Greeks</h3><p>输出合同对齐、贴现、股息与 forward 锚；下一节据此把 option premium 拆成标的水平、期限、波动率与非线性风险暴露。</p></article>
          <article><span>→ 4.24 / 7.28</span><h3>衍生品联动与 A 股案例</h3><p>输出 residual basis、carry decomposition、单侧容量和多时钟协议，供跨资产与本土实证使用。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“期货大幅升水 / 贴水”的判断，先停下来定义 claim：哪一个 cash proxy、哪一个合约月、什么乘数、什么币种、如何最终结算或交割；再固定本节 F−S 符号、bid / ask、时区与三只时钟。一个指数点位、收益率或过期 close 不是可自动成交的现货。
          <br /><br />
          接着从复制而非预测出发，把融资、股息、票息、仓储、便利收益、借券和交割选择放到同一终点，得到 fair carry；把 raw basis 减去它得到 residual。正向用 spot ask 与 futures bid，反向用 spot bid 与 futures ask；加入整数 hedge、impact、tax、repo、borrow、IM、VM 和 capacity，得到两个不对称边界。到期收敛只定义终点，不替任何机构提供途中现金。
          <br /><br />
          最后用五种竞争状态解释 residual：carry 修订、信息时钟、对冲需求、融资中介与合同交割。观察它们首先影响谁、怎样改变两腿订单和资产负债表、何时形成负反馈或强制平仓的正反馈，并明确什么证据会推翻判断。做到这一步，basis 才不再是一张模糊的情绪温度计，而成为一套可以跨股指、外汇、利率、国债、商品与加密市场迁移，也能被逐项证伪的相对价格语言。
        </p>
      </section>

    </>
  );
}

export const lesson122: LessonRecord = {
  slug: '1-22',
  id: '1.22',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Futures Basis 与 Cash–Futures Arbitrage',
  subtitle: '从合约对齐、持有成本复制、双向可执行套利带与保证金现金路径出发，解释期货为何升贴水、何时构成相对价值机会，以及基差怎样跨现货、融资与清算体系传导',
  readingTime: '主线首读约 85–100 分钟；零背景完整学习建议分两次，共约 150–180 分钟（含跨资产变体、互动实验与练习；参考文献和延伸阅读不计）',
  prerequisite: 'T07 · Bond / Equity / Futures / Options 最小基础；1.11 · 跨市场价格发现；建议回看 1.20–1.21',
  updatedAt: '2026-08-29',
  revision: '1.22-r6',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.22-r1',
      summary: '首轮逐项核验 50 节、69 条来源、全部公式、跨资产变体、算例与互动状态后，要求修正受限卖空抵押品的终值账本、消除基差变化分解的重复扣减、更新中金所现行规则链接及两篇正式出版论文元数据，并统一期限结构术语与延伸阅读链接。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.22-r3',
      summary: '终审复算确认核心账本、公式方向、跨资产边界、全部互动与练习成立；要求更正两条来源作者元数据，并消除相邻账本中 α 的双重定义。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.22-r3',
      summary: '教学终审确认六阶段认知坡度、双轮时长、表格语义、迁移互动与隐藏答案成立；要求补足定价测度桥和首次术语解释，提高核心表格与来源字号，分离名义价差、方向性毛边际及利润符号，并统一实验术语与跳转文案。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.22-r4',
      summary: '回归终审确认公式、账本、书目、规则与数值准确；要求消除 prepaid-forward 价格与利润的 Π 复用、定价测度 Q 与交易规模的复用，并澄清方向性单位成本与一次性总固定成本。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.22-r4',
      summary: '回归终审确认 r3 的九类教学整改闭合；要求统一 prepaid-forward 与容量符号，放大 glossary 核心定义，并补足正反向套利、OTC、ROE、VaR、SOFR、OIS 与 BTIC 的首次中文入口。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.22-r5',
      summary: '终审确认全部符号、账本、公式、数值、书目与规则通过回归；仅要求把 ROE 的英文展开恢复为标准 return on equity，并将受约束资本保留为本节分母口径。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.22-r5',
      summary: '终审确认 50 个单元的认知坡度、进阶桥、14px 术语卡、表格与来源可读性、八题互动状态、六道隐藏答案练习、双轮时长及课程接口均达到出版要求。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.22-r6',
      summary: '终审确认 50 节、69 条来源、全部公式、双向终值账本、非对称套利带、跨资产边界、现行规则、八个互动与六道练习全部准确；符号、作者元数据与 ROE 标准释义均已闭合。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.22-r6',
      summary: '终审确认六阶段认知坡度、零基础术语桥、进阶测度入口、双轮学习时长、核心字号、可访问表格、先答后揭示练习、八题状态机及 1.21/1.23 接口均达到出版要求。',
    },
  ],
  previous: { slug: '1-21', label: '1.21 ETF Creation / Redemption 与套利机制' },
  next: { slug: '1-23', label: '1.23 期权价格与 Greeks 的市场含义' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整反馈回路' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'cash-leg', label: 'Cash Leg' },
    { id: 'contract-anatomy', label: 'Futures Contract' },
    { id: 'actors-balances', label: '五张资产负债表' },
    { id: 'basis-convention', label: 'Basis 符号' },
    { id: 'units-normalization', label: '单位与年化' },
    { id: 'term-structure-language', label: '期限结构语言' },
    { id: 'three-clocks', label: '三只时钟' },
    { id: 'zero-income-replication', label: '无收益资产复制' },
    { id: 'known-income', label: '离散现金收入' },
    { id: 'continuous-yield', label: '连续收益率' },
    { id: 'generalized-carry', label: 'Generalized Carry' },
    { id: 'fair-residual-basis', label: 'Fair 与 Residual' },
    { id: 'implied-financing', label: 'Implied Financing' },
    { id: 'contractual-convergence', label: '合同收敛' },
    { id: 'forward-futures', label: 'Forward 与 Futures' },
    { id: 'executable-quotes', label: '可执行报价' },
    { id: 'cash-carry-direction', label: 'Cash-and-Carry' },
    { id: 'cash-carry-ledger', label: '正向终值账本' },
    { id: 'reverse-direction', label: 'Reverse Carry' },
    { id: 'reverse-ledger', label: '反向终值账本' },
    { id: 'multiplier-hedge', label: 'Multiplier 与 Hedge' },
    { id: 'pnl-layers', label: 'P&L 分层' },
    { id: 'residual-risk', label: '残余风险' },
    { id: 'arbitrage-band', label: '非对称套利带' },
    { id: 'funding-repo-haircut', label: 'Repo 与 Haircut' },
    { id: 'margin-path', label: 'IM、VM 与现金' },
    { id: 'borrow-recall', label: 'Borrow 与 Recall' },
    { id: 'impact-capacity', label: 'Impact 与容量' },
    { id: 'settlement-delivery', label: '结算与交割' },
    { id: 'delivery-option', label: 'Delivery Option' },
    { id: 'convergence-stress', label: '压力期收敛' },
    { id: 'roll-calendar', label: 'Roll 与日历价差' },
    { id: 'equity-index', label: 'Equity Index' },
    { id: 'single-stock', label: 'Single Stock' },
    { id: 'fx-cip', label: 'FX 与 CIP' },
    { id: 'short-rate', label: 'Short-rate Futures' },
    { id: 'treasury', label: 'Treasury Futures' },
    { id: 'commodities', label: 'Commodities' },
    { id: 'crypto', label: 'Crypto Futures' },
    { id: 'non-storable', label: '不可储存标的' },
    { id: 'synchronized-basis', label: '同步可执行基差' },
    { id: 'change-decomposition', label: '变化分解' },
    { id: 'state-diagnosis', label: '五状态诊断' },
    { id: 'research', label: '研究设计' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice', label: '练习与检查' },
    { id: 'interfaces', label: '接口与诊断' },
  ],
  Content: Lesson122Content,
  references: [
    { id: 1, authors: 'John C. Cox, Jonathan E. Ingersoll Jr. & Stephen A. Ross', year: '1981', title: 'The Relation between Forward Prices and Futures Prices', publication: 'Journal of Financial Economics, 9(4), 321–346', url: 'https://doi.org/10.1016/0304-405X(81)90002-7', use: '严格区分逐日结算期货与终点结算远期，并给出随机利率下 futures–forward 差异；模型假设不等于任意现实抵押安排。' },
    { id: 2, authors: 'Robert A. Jarrow & George S. Oldfield', year: '1981', title: 'Forward Contracts and Futures Contracts', publication: 'Journal of Financial Economics, 9(4), 373–382', url: 'https://doi.org/10.1016/0304-405X(81)90004-0', use: '提供远期与期货定价及现金流时点的无套利框架；不包含现代清算、信用和 funding valuation 全部制度。' },
    { id: 3, authors: 'Fischer Black', year: '1976', title: 'The Pricing of Commodity Contracts', publication: 'Journal of Financial Economics, 3(1–2), 167–179', url: 'https://doi.org/10.1016/0304-405X(76)90024-6', use: '提供商品合同定价与 futures price、expected spot、risk premium 的经典区分；不可直接替代资产特定仓储和交割规则。' },
    { id: 4, authors: 'Kenneth R. French', year: '1983', title: 'A Comparison of Futures and Forward Prices', publication: 'Journal of Financial Economics, 12(3), 311–342', url: 'https://doi.org/10.1016/0304-405X(83)90052-1', use: '给出期货—远期价差的经验检验和利率相关解释；历史样本不能直接量化现代抵押期货调整。' },
    { id: 5, authors: 'Bradford Cornell & Marc R. Reinganum', year: '1981', title: 'Forward and Futures Prices: Evidence from the Foreign Exchange Markets', publication: 'Journal of Finance, 36(5), 1035–1045', url: 'https://doi.org/10.1111/j.1540-6261.1981.tb01074.x', use: '提供外汇 forward / futures 关系的早期实证；制度、交易成本和样本时期限制当代外推。' },
    { id: 6, authors: 'U.S. Commodity Futures Trading Commission', year: 'current', accessedAt: '2026-08-29', title: 'The Economic Purpose of Futures Markets and How They Work', publication: 'CFTC Learn & Protect', url: 'https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/economicpurpose.html', use: '支持期货的风险转移、价格发现、保证金与经济用途入门；不是具体合约定价或交易建议。' },
    { id: 7, authors: 'CME Clearing', year: 'current', accessedAt: '2026-08-29', title: 'CME Money Calculations for Futures and Options', publication: 'Official clearing methodology', url: 'https://www.cmegroup.com/clearing/files/CME-Money-Calculations-Futures-and-Options.pdf', use: '说明期货结算、价格变化与变动保证金的货币计算；实际参数须按具体合约和当日清算规则核验。' },
    { id: 8, authors: 'U.S. Commodity Futures Trading Commission', year: 'current', accessedAt: '2026-08-29', title: 'CFTC Glossary', publication: 'CFTC Learn & Protect', url: 'https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/CFTCGlossary/index.htm', use: '提供 basis、cash market、delivery、margin 等监管术语入口；不同商品和 desks 仍可能采用相反 basis 符号。' },
    { id: 9, authors: 'Bradford Cornell & Kenneth R. French', year: '1983', title: 'The Pricing of Stock Index Futures', publication: 'Journal of Futures Markets, 3(1), 1–14', url: 'https://doi.org/10.1002/fut.3990030102', use: '建立股指期货融资—股息定价关系和制度讨论；现实执行仍需加入动态篮子、税费与报价边。' },
    { id: 10, authors: 'David M. Modest & Mahadevan Sundaresan', year: '1983', title: 'The Relationship between Spot and Futures Prices in Stock Index Futures Markets: Some Preliminary Evidence', publication: 'Journal of Futures Markets, 3(1), 15–41', url: 'https://doi.org/10.1002/fut.3990030103', use: '提供早期股指期现偏离、交易成本与套利边界证据；旧市场结构不能直接代表当前执行。' },
    { id: 11, authors: 'Robert C. Klemkosky & Jae Ha Lee', year: '1991', title: 'The Intraday Ex Post and Ex Ante Profitability of Index Arbitrage', publication: 'Journal of Futures Markets, 11(3), 291–311', url: 'https://doi.org/10.1002/fut.3990110304', use: '区分事后显示利润与事前可执行 index arbitrage，并纳入延迟和成本；样本与技术环境有历史边界。' },
    { id: 12, authors: 'A. Craig MacKinlay & Krishna Ramaswamy', year: '1988', title: 'Index-Futures Arbitrage and the Behavior of Stock Index Futures Prices', publication: 'Review of Financial Studies, 1(2), 137–158', url: 'https://doi.org/10.1093/rfs/1.2.137', use: '研究股指套利带、期限和交易制度对偏离的影响；不能由 close 数据自动推出可锁定利润。' },
    { id: 13, authors: 'Stephen Figlewski', year: '1984', title: 'Hedging Performance and Basis Risk in Stock Index Futures', publication: 'Journal of Finance, 39(3), 657–669', url: 'https://doi.org/10.1111/j.1540-6261.1984.tb03654.x', use: '支持现货代理、hedge ratio 与 basis risk 的区别；历史合约和数据频率限制当前参数外推。' },
    { id: 14, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Calculating Fair Value', publication: 'CME Equity Index Education', url: 'https://www.cmegroup.com/trading/equity-index/fairvalue.html', use: '给出股指期货公平价值中的融资和预期股息输入；教学式不包含每位交易者的全部执行与资本成本。' },
    { id: 15, authors: 'Gene D’Avolio', year: '2002', title: 'The Market for Borrowing Stock', publication: 'Journal of Financial Economics, 66(2–3), 271–306', url: 'https://doi.org/10.1016/S0304-405X(02)00206-4', use: '提供借券供给、费用和 short-sale constraints 的系统证据；美国历史样本不等于所有市场当前 borrow quote。' },
    { id: 16, authors: 'Committee on Payment and Settlement Systems & Technical Committee of IOSCO', year: '1999', accessedAt: '2026-08-29', title: 'Securities Lending Transactions: Market Development and Implications', publication: 'BIS / IOSCO Report', url: 'https://www.bis.org/publ/cpss32.pdf', use: '解释证券借贷、抵押、召回和结算安排；制度报告需结合现行法域规则更新。' },
    { id: 17, authors: 'Chicago Board of Trade', year: 'current', accessedAt: '2026-08-29', title: 'Chapter 19 — U.S. Treasury Note Futures', publication: 'CBOT Rulebook', url: 'https://www.cmegroup.com/rulebook/CBOT/II/19.pdf', use: '给出 Treasury note futures 的可交割篮子、转换因子与交割法律规则；实际合约资格以当期规则和公告为准。' },
    { id: 18, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'U.S. Treasury Futures Delivery Process', publication: 'Official product guide', url: 'https://www.cmegroup.com/content/dam/cmegroup/trading/interest-rates/files/us-treasury-futures-delivery-process.pdf', use: '解释交割通知、发票、应计、空头选择和时间线；不替代完整 rulebook。' },
    { id: 19, authors: 'CME Group', year: '2024', accessedAt: '2026-08-29', title: 'Calculating U.S. Treasury Futures Conversion Factors', publication: 'CME Education', url: 'https://www.cmegroup.com/articles/2024/calculating-us-treasury-futures-conversion-factors.html', use: '解释 conversion factor 计算与标准化逻辑；转换因子不消除 CTD 和 delivery option。' },
    { id: 20, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Treasury Futures Basis Spreads', publication: 'CME Education', url: 'https://www.cmegroup.com/content/dam/cmegroup/education/files/treasury-futures-basis-spreads.pdf', use: '给出 gross basis、net basis、implied repo、CTD 与风险配比的交易语言；市场材料不保证实际收益。' },
    { id: 21, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Understanding Treasury Futures', publication: 'CME Institute', url: 'https://www.cmegroup.com/education/files/understanding-treasury-futures.pdf', use: '系统介绍 Treasury futures、转换因子、CTD、DV01 和交割；须与最新规则共同使用。' },
    { id: 22, authors: 'CME Group', year: '2023', accessedAt: '2026-08-29', title: 'U.S. Treasury Futures Exchange for Physical (EFP) Transactions', publication: 'CME Education', url: 'https://www.cmegroup.com/articles/2023/us-treasury-futures-exchange-for-physical-efp-transactions.html', use: '说明 Treasury EFP 的关联 cash / futures 执行和报告机制；EFP 不消除融资、信用或合规成本。' },
    { id: 23, authors: 'Gerald D. Gay & Steven Manaster', year: '1984', title: 'The Quality Option Implicit in Futures Contracts', publication: 'Journal of Financial Economics, 13(3), 353–370', url: 'https://doi.org/10.1016/0304-405X(84)90004-7', use: '正式刻画可交割质量选择权；具体合约的资产篮子与制度必须另行建模。' },
    { id: 24, authors: 'Gerald D. Gay & Steven Manaster', year: '1986', title: 'Implicit Delivery Options and Optimal Delivery Strategies for Financial Futures Contracts', publication: 'Journal of Financial Economics, 16(1), 41–72', url: 'https://doi.org/10.1016/0304-405X(86)90042-5', use: '分析金融期货隐含交割期权与最优策略；不意味着所有观察价差都可归于 delivery option。' },
    { id: 25, authors: 'Alex Kane & Alan J. Marcus', year: '1986', title: 'Valuation and Optimal Exercise of the Wild Card Option in the Treasury Bond Futures Market', publication: 'Journal of Finance, 41(1), 195–207', url: 'https://doi.org/10.1111/j.1540-6261.1986.tb04499.x', use: '刻画结算价冻结而现金券仍交易时的 wild-card timing option；论文中的历史交易时钟不能当作当前规则。' },
    { id: 26, authors: 'Phelim P. Boyle', year: '1989', title: 'The Quality Option and Timing Option in Futures Contracts', publication: 'Journal of Finance, 44(1), 101–113', url: 'https://doi.org/10.1111/j.1540-6261.1989.tb02406.x', use: '区分质量与交割时机选择权并形式化其价值；具体应用需按 rulebook 构造。' },
    { id: 27, authors: 'Jonathan Glicoes, Benjamin Iorio, Phillip Monin & Lubomir Petrasek', year: '2024', accessedAt: '2026-08-29', title: 'Quantifying Treasury Cash-Futures Basis Trades', publication: 'FEDS Notes, Board of Governors of the Federal Reserve System, 8 March 2024', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/quantifying-treasury-cash-futures-basis-trades-20240308.html', use: '估计 Treasury basis 交易规模、option-adjusted basis 与融资结构并讨论测量不确定性；公开头寸映射不是逐账户策略标签。' },
    { id: 28, authors: 'Holbrook Working', year: '1949', title: 'The Theory of Price of Storage', publication: 'American Economic Review, 39(6), 1254–1262', url: 'https://www.jstor.org/stable/1816601', use: '奠定商品价格、库存与持有服务的 storage theory；历史制度不提供现代逐品种参数。' },
    { id: 29, authors: 'Michael J. Brennan', year: '1958', title: 'The Supply of Storage', publication: 'American Economic Review, 48(1), 50–72', url: 'https://www.jstor.org/stable/1812340', use: '刻画库存供给与 convenience yield 的内生关系；不支持把便利收益当可直接观察 coupon。' },
    { id: 30, authors: 'Nicholas Kaldor', year: '1939', title: 'Speculation and Economic Stability', publication: 'Review of Economic Studies, 7(1), 1–27', url: 'https://doi.org/10.2307/2967593', use: '提供库存、投机与便利收益思想的经典来源；概念需与现代合同和仓储数据结合。' },
    { id: 31, authors: 'Eugene F. Fama & Kenneth R. French', year: '1987', title: 'Commodity Futures Prices: Some Evidence on Forecast Power, Premiums, and the Theory of Storage', publication: 'Journal of Business, 60(1), 55–73', url: 'https://doi.org/10.1086/296385', use: '区分商品 storage relation、forecast power 与风险溢价；不能由曲线形状单独推断未来 spot。' },
    { id: 32, authors: 'Bryan R. Routledge, Duane J. Seppi & Chester S. Spatt', year: '2000', title: 'Equilibrium Forward Curves for Commodities', publication: 'Journal of Finance, 55(3), 1297–1338', url: 'https://doi.org/10.1111/0022-1082.00248', use: '在动态库存模型中内生 convenience yield 和 forward curve；模型参数并非直接观察事实。' },
    { id: 33, authors: 'Eduardo S. Schwartz', year: '1997', title: 'The Stochastic Behavior of Commodity Prices: Implications for Valuation and Hedging', publication: 'Journal of Finance, 52(3), 923–973', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb02721.x', use: '提供商品现货、便利收益与利率的随机因子模型；模型拟合不取代物理交割约束。' },
    { id: 34, authors: 'Hendrik Bessembinder & Michael L. Lemmon', year: '2002', title: 'Equilibrium Pricing and Optimal Hedging in Electricity Forward Markets', publication: 'Journal of Finance, 57(3), 1347–1382', url: 'https://doi.org/10.1111/1540-6261.00463', use: '说明不可储存电力 forward premium 与需求分布、生产约束和风险厌恶的关系；不适用于可自由储存资产的经典 carry。' },
    { id: 35, authors: 'Commodity Futures Trading Commission, Agricultural Advisory Committee Subcommittee on Convergence', year: '2009', accessedAt: '2026-08-29', title: 'Report on Convergence in Wheat Futures Markets', publication: 'CFTC Advisory Committee Report', url: 'https://www.cftc.gov/sites/default/files/idc/groups/public/%40aboutcftc/documents/file/reportofthesubcommitteeonconve.pdf', use: '记录 wheat futures 长期不收敛与交割仓储制度问题；委员会报告和特定事件不能外推所有商品。' },
    { id: 36, authors: 'Claudio Borio, Robert McCauley, Patrick McGuire & Vladyslav Sushko', year: '2016', accessedAt: '2026-08-29', title: 'Covered Interest Parity Lost: Understanding the Cross-Currency Basis', publication: 'BIS Quarterly Review, September 2016', url: 'https://www.bis.org/publ/qtrpdf/r_qt1609e.htm', use: '解释危机后持续 cross-currency basis 与银行资产负债表、对冲需求和美元融资；描述性证据不赋予单一原因。' },
    { id: 37, authors: 'Claudio Borio, Mobeen Iqbal, Robert N. McCauley, Patrick McGuire & Vladyslav Sushko', year: '2016; revised 2018', accessedAt: '2026-08-29', title: 'The Failure of Covered Interest Parity: FX Hedging Demand and Costly Balance Sheets', publication: 'BIS Working Papers No. 590', url: 'https://www.bis.org/publ/work590.htm', use: '连接 FX hedging demand、美元资金与 costly balance sheets；需与具体抵押、信用及报价口径结合。' },
    { id: 38, authors: 'Wenxin Du, Alexander Tepper & Adrien Verdelhan', year: '2018', title: 'Deviations from Covered Interest Rate Parity', publication: 'Journal of Finance, 73(3), 915–957', url: 'https://doi.org/10.1111/jofi.12620', use: '系统测量 G10 CIP 偏离并连接资产负债表成本；其 basis 符号与币种定义必须随公式读取。' },
    { id: 39, authors: 'Q. Farooq Akram, Dagfinn Rime & Lucio Sarno', year: '2008', title: 'Arbitrage in the Foreign Exchange Market: Turning on the Microscope', publication: 'Journal of International Economics, 76(2), 237–253', url: 'https://doi.org/10.1016/j.jinteco.2008.07.004', use: '使用高频可执行外汇报价研究短暂套利和交易成本；历史电子市场结果不证明长期 CIP 偏离不存在。' },
    { id: 40, authors: 'Niall Coffey, Warren B. Hrung & Asani Sarkar', year: '2009', accessedAt: '2026-08-29', title: 'Capital Constraints, Counterparty Risk, and Deviations from Covered Interest Rate Parity', publication: 'Federal Reserve Bank of New York Staff Reports No. 393', url: 'https://www.newyorkfed.org/research/staff_reports/sr393.html', use: '将危机期 FX basis 与资本和对手方风险联系；特定危机样本不等于常态结构参数。' },
    { id: 41, authors: 'Maik Schmeling, Andreas Schrimpf & Karamfil Todorov', year: '2023; revised 2025', accessedAt: '2026-08-29', title: 'Crypto Carry', publication: 'BIS Working Papers No. 1087', url: 'https://www.bis.org/publ/work1087.htm', use: '研究加密 cash-and-carry、趋势需求与受限中介资本；跨 venue 回报需计入托管、信用、转账和抵押差异。' },
    { id: 42, authors: 'Songrun He, Asaf Manela, Omri Ross & Victor von Wachter', year: '2022; revised 2024', title: 'Fundamentals of Perpetual Futures', publication: 'SSRN Scholarly Paper / arXiv preprint', url: 'https://doi.org/10.2139/ssrn.4301150', use: '建立 perpetual futures、funding rule 与交易成本带的理论框架；工作论文版本与具体 venue 规则都需单独标注。' },
    { id: 43, authors: 'BitMEX', year: 'current', accessedAt: '2026-08-29', title: 'Perpetual Contracts Guide', publication: 'Official product documentation', url: 'https://www.bitmex.com/app/perpetualContractsGuide', use: '展示一种 perpetual funding、mark price 与合约设计；只适用于文件所述 venue 和版本。' },
    { id: 44, authors: 'Chicago Mercantile Exchange Inc.', year: '2021', accessedAt: '2026-08-29', title: 'CME Submission No. 21-002S — Amendments to Bitcoin Futures', publication: 'CFTC Rule Certification Filing', url: 'https://www.cmegroup.com/content/dam/cmegroup/market-regulation/rule-filings/2021/9/21-002S.pdf', use: '提供 CME bitcoin futures 规则变更与结算制度的官方例子；不代表所有 crypto derivatives。' },
    { id: 45, authors: 'Andrei Shleifer & Robert W. Vishny', year: '1997', title: 'The Limits of Arbitrage', publication: 'Journal of Finance, 52(1), 35–55', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x', use: '说明专业套利者受委托资本、短期损失和赎回约束；一般理论不直接给出某合约的实际套利带。' },
    { id: 46, authors: 'Denis Gromb & Dimitri Vayanos', year: '2002', title: 'Equilibrium and Welfare in Markets with Financially Constrained Arbitrageurs', publication: 'Journal of Financial Economics, 66(2–3), 361–407', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3', use: '刻画受限套利者、资产价格和流动性的均衡反馈；风格化模型不识别现实单一冲击。' },
    { id: 47, authors: 'Markus K. Brunnermeier & Lasse Heje Pedersen', year: '2009', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies, 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '给出 funding liquidity 与 market liquidity 的互相强化机制和 margin spiral；不能把所有压力事件归为同一路径。' },
    { id: 48, authors: 'Daniel Barth & R. Jay Kahn', year: '2025', title: 'Hedge Funds and the Treasury Cash-Futures Basis Trade', publication: 'Journal of Monetary Economics, 155, 103823', url: 'https://doi.org/10.1016/j.jmoneco.2025.103823', use: '研究 hedge-fund balance sheets、供需与 Treasury cash-futures basis；策略映射和样本结论有市场与时期边界。' },
    { id: 49, authors: 'Mathias S. Kruttli, Phillip J. Monin, Lubomir Petrasek & Sumudu W. Watugala', year: '2025', title: 'LTCM Redux? Hedge Fund Treasury Trading, Funding Fragility, and Risk Constraints', publication: 'Journal of Financial Economics, 169, 104017', url: 'https://doi.org/10.1016/j.jfineco.2025.104017', use: '连接 Treasury 相对价值仓位、VM、内部风险限额与疫情期脆弱性；局部识别不能证明 basis trade 是全部市场失灵的唯一来源。' },
    { id: 50, authors: 'Andreas Schrimpf, Hyun Song Shin & Vladyslav Sushko', year: '2020', accessedAt: '2026-08-29', title: 'Leverage and Margin Spirals in Fixed Income Markets during the Covid-19 Crisis', publication: 'BIS Bulletin No. 2', url: 'https://www.bis.org/publ/bisbull02.htm', use: '解释 2020 年 3 月 fixed-income leverage、margin 与去杠杆反馈；早期政策分析需与后续微观证据并读。' },
    { id: 51, authors: 'Board of Governors of the Federal Reserve System', year: '2020', accessedAt: '2026-08-29', title: 'Borrowing by Businesses and Households', publication: 'Financial Stability Report, November 2020', url: 'https://www.federalreserve.gov/publications/2020-november-financial-stability-report-borrowing.htm', use: '提供 leveraged funds Treasury futures net shorts 在 2020 压力期下降的官方背景；净空下降不逐笔识别 basis trade。' },
    { id: 52, authors: 'Financial Stability Board', year: '2020', accessedAt: '2026-08-29', title: 'Holistic Review of the March Market Turmoil', publication: 'FSB Report, 17 November 2020', url: 'https://www.fsb.org/2020/11/holistic-review-of-the-march-market-turmoil/', use: '系统回顾 dash-for-cash、margin、fund flows 和核心市场失灵；多渠道并存，报告不支持单一因果叙事。' },
    { id: 53, authors: 'Ayelen Banegas, Phillip Monin & Lubomir Petrasek', year: '2021', accessedAt: '2026-08-29', title: 'Sizing Hedge Funds’ Treasury Market Activities and Holdings', publication: 'FEDS Notes, Board of Governors of the Federal Reserve System, 6 October 2021', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/sizing-hedge-funds-treasury-market-activities-and-holdings-20211006.html', use: '估计 quantitative hedge fund Treasury holdings 和 valuation-adjusted 销售；未调整持仓变化与调整后现金销售数字不可混用。' },
    { id: 54, authors: 'Annette Vissing-Jorgensen', year: '2021', title: 'The Treasury Market in Spring 2020 and the Response of the Federal Reserve', publication: 'Journal of Monetary Economics, 124, 19–47', url: 'https://doi.org/10.1016/j.jmoneco.2021.10.007', use: '分析 2020 年 3 月 Treasury 出售主体、收益率变化与 Fed 干预；household sector 含 hedge funds 但不等同 basis traders。' },
    { id: 55, authors: 'Eleni Gousgounis, Scott Mixon, Tugkan Tuzun & Clara Vega', year: '2025', accessedAt: '2026-08-29', title: 'Market Liquidity in Treasury Futures Market during March 2020', publication: 'Finance and Economics Discussion Series 2025-038, Federal Reserve Board', url: 'https://www.federalreserve.gov/econres/feds/market-liquidity-in-treasury-futures-market-during-march-2020.htm', use: '用 futures order-book 证据评估 2020 年 3 月场内流动性，未发现 basis traders 是十年期 futures dysfunction 的主要驱动；不等于其对 cash / repo 完全无影响。' },
    { id: 56, authors: 'Inter-Agency Working Group for Treasury Market Surveillance', year: '2021', accessedAt: '2026-08-29', title: 'Recent Disruptions and Potential Reforms in the U.S. Treasury Market: A Staff Progress Report', publication: 'U.S. Treasury / Federal Reserve / SEC / CFTC Staff Report', url: 'https://home.treasury.gov/system/files/136/IAWG-Treasury-Report.pdf', use: '综合 2020 Treasury 市场参与者、流动性与改革渠道；官方 staff report 明确多类卖方与多重机制。' },
    { id: 57, authors: 'CFTC Market Risk Advisory Committee, Future of Finance Subcommittee', year: '2024', accessedAt: '2026-08-29', title: 'The Treasury Cash-Futures Basis Trade and Effective Risk Management Practices', publication: 'MRAC Report, 10 December 2024', url: 'https://www.cftc.gov/media/11671/mrac121024_TreasuryCashFuturesBasisTradeReport/download', use: '整理 Treasury basis trade 结构、正常时期作用、风险与数据缺口；committee report 不代表 Commission 规则或唯一因果结论。' },
    { id: 58, authors: '中国金融期货交易所', year: 'current', accessedAt: '2026-08-29', title: '沪深300股指期货', publication: '中金所产品页面', url: 'https://www.cffex.com.cn/hs300/', use: '提供 IF 合约标的、乘数、到期月份、最后交易日、现金交割与最低保证金等当前产品字段；参数可能由通知调整。' },
    { id: 59, authors: '中国金融期货交易所', year: '2018（第七次修订）', accessedAt: '2026-08-29', title: '中国金融期货交易所沪深300股指期货合约交易细则', publication: '中金所业务规则；从现行规则目录核验', url: 'https://www.cffex.com.cn/u/cms/www/202003/27165505w3j5.pdf', use: '支持 IF 当日结算、最后两小时算术平均交割结算价与现金交割；历史修订日期不等于永远有效，使用时仍应核对交易所现行规则目录及交易日通知。' },
    { id: 60, authors: 'Emil N. Siriwardane, Adi Sunderam & Jonathan L. Wallen', year: '2025', title: 'Segmented Arbitrage', publication: 'Journal of Finance, 80(5), 2543–2590', url: 'https://doi.org/10.1111/jofi.13469', use: '把相对价值偏离与分割的中介资本连接；模型和实证框架不替代具体市场规则或执行成本测量。' },
    { id: 61, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'What Is Equity Index Basis?', publication: 'CME Institute Course', url: 'https://www.cmegroup.com/education/courses/introduction-to-equity-index-products/what-is-equity-index-basis', use: '提供 equity-index futures−spot basis 与到期收敛的官方教学口径；fair-value 仍需融资、股息和执行输入。' },
    { id: 62, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Learn about Basis: Grains', publication: 'CME Institute Course', url: 'https://www.cmegroup.com/education/courses/introduction-to-grains-and-oilseeds/learn-about-basis-grains', use: '明确谷物市场常用 local cash−futures 的 basis 符号和地点含义；不能直接套用本节 F−S 而不反号。' },
    { id: 63, authors: 'Commodity Futures Trading Commission, Division of Market Oversight', year: '2020', accessedAt: '2026-08-29', title: 'Interim Staff Report on Trading in NYMEX WTI Crude Oil Futures Contract Leading up to, on, and around April 20, 2020', publication: 'CFTC Staff Report', url: 'https://www.cftc.gov/media/5296/InterimStaffReportNYMEX_WTICrudeOil/download', use: '提供 WTI May 2020 合约负价前后的订单、交割与市场状态；staff report 不给单一操纵或唯一原因结论。' },
    { id: 64, authors: 'U.S. Energy Information Administration', year: '2020', accessedAt: '2026-08-29', title: 'WTI Crude Oil Futures Prices Fell below Zero because of Low Liquidity and Limited Available Storage', publication: 'Today in Energy, 5 May 2020', url: 'https://www.eia.gov/TODAYINENERGY/detail.php?id=43495', use: '解释负 WTI 与临近交割、低流动性和 Cushing 仓储约束；事件机制不代表所有期限和油种。' },
    { id: 65, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Equity Index Final Settlements', publication: 'Official settlement information', url: 'https://www.cmegroup.com/trading/equity-index/settlement.html', use: '汇总 CME equity-index 合约的 final settlement 资源；不同合约的 fixing procedure 必须分别读取。' },
    { id: 66, authors: 'Damien Ackerer, Julien Hugonnier & Urban Jermann', year: '2026', title: 'Perpetual Futures Pricing', publication: 'Mathematical Finance, 36(3), 481–499', url: 'https://doi.org/10.1111/mafi.70018', use: '给出 perpetual futures 在 funding 与市场摩擦下的正式定价；模型不能替代各 venue 实际 liquidation 和 collateral rules。' },
    { id: 67, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Rolling an Equity Position Using Spreads', publication: 'CME Institute Course', url: 'https://www.cmegroup.com/education/courses/understanding-futures-spreads/rolling-an-equity-position-using-spreads.hideSubnav.educationIframe.html.html?hideAddThisExt=y&hideFooter=y&hideHeader=y&hideRightRail=y', use: '解释 calendar spread、近远月同时执行与 roll 流动性；具体 roll rule 仍由策略和合约决定。' },
    { id: 68, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Understanding Basis Trade at Index Close (BTIC)', publication: 'CME Institute Course', url: 'https://www.cmegroup.com/education/courses/trading-at-a-basis-to-an-index-btic-taco/understanding-basis-trade-at-index-close-btic', use: '展示以指数 close 为参考执行 equity-index basis 的特定机制；不使任意不同步 close 成为无风险可交易值。' },
    { id: 69, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Understanding Convexity Bias', publication: 'CME Institute — Understanding STIR Futures', url: 'https://www.cmegroup.com/education/courses/understanding-stir-futures/understanding-convexity-bias.html', use: '解释 short-term interest-rate futures 与 forward rates 的 convexity bias；调整方向和大小取决于模型与市场状态。' },
  ],
  readingList: [
    { title: 'Cox, Ingersoll & Ross (1981)', scope: '全文，重点为 forward 与 futures 的现金流和随机利率差异', reason: '建立本节最严格的 futures–forward 边界，避免把逐日结算仅当会计细节。', url: 'https://doi.org/10.1016/0304-405X(81)90002-7' },
    { title: 'Jarrow & Oldfield (1981)', scope: '定价命题与套利组合', reason: '从复制而不是预测理解现货、远期和期货的相对价格。', url: 'https://doi.org/10.1016/0304-405X(81)90004-0' },
    { title: 'Cornell & French (1983)', scope: '股指期货定价、股息与制度部分', reason: '掌握股指 cash leg 不是指数点位，并把融资与股息放进同一终点。', url: 'https://doi.org/10.1002/fut.3990030102' },
    { title: 'MacKinlay & Ramaswamy (1988)', scope: '套利带、期限动态与实证设计', reason: '观察经典研究怎样把理论等式扩成成本区间，并识别 close 数据的局限。', url: 'https://doi.org/10.1093/rfs/1.2.137' },
    { title: 'CME — Calculating Fair Value', scope: '全文与股息、利率例子', reason: '用官方零背景材料复算 equity-index fair carry，再用正文补上执行和资本约束。', url: 'https://www.cmegroup.com/trading/equity-index/fairvalue.html' },
    { title: 'CFTC — Economic Purpose of Futures', scope: 'futures purpose、hedging、price discovery 与 margin', reason: '先确认期货合同的经济用途和基本术语，不把套利视为交易所提供的承诺。', url: 'https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/economicpurpose.html' },
    { title: 'CME Money Calculations', scope: 'futures variation、settlement 与货币转换章节', reason: '逐日复算 VM 路径，理解终端 P&L 与现金生存为什么必须分开。', url: 'https://www.cmegroup.com/clearing/files/CME-Money-Calculations-Futures-and-Options.pdf' },
    { title: 'D’Avolio (2002)', scope: '借券费用、供给和 short constraints', reason: '理解 reverse cash-and-carry 下界为何非对称，且可因可借数量为零而失效。', url: 'https://doi.org/10.1016/S0304-405X(02)00206-4' },
    { title: 'Shleifer & Vishny (1997)', scope: '全文', reason: '建立“终端判断正确但中途资本退出”的限制套利底层逻辑。', url: 'https://doi.org/10.1111/j.1540-6261.1997.tb03807.x' },
    { title: 'Brunnermeier & Pedersen (2009)', scope: '模型与 margin spiral', reason: '理解 funding liquidity、market liquidity 与 basis 容量怎样构成双向反馈。', url: 'https://doi.org/10.1093/rfs/hhn098' },
    { title: 'CME — Understanding Treasury Futures', scope: 'conversion factor、CTD、DV01 与 delivery', reason: '建立 Treasury futures 完整合同地图，并与 Chapter 19 rulebook 对照。', url: 'https://www.cmegroup.com/education/files/understanding-treasury-futures.pdf' },
    { title: 'CME — Treasury Futures Basis Spreads', scope: 'gross / net basis、IRR 与 hedge ratio', reason: '把逐券现金流转成 desk 使用的 basis 与 implied repo 语言。', url: 'https://www.cmegroup.com/content/dam/cmegroup/education/files/treasury-futures-basis-spreads.pdf' },
    { title: 'Federal Reserve — Quantifying Treasury Cash-Futures Basis Trades (2024)', scope: '方法、规模区间与数据限制', reason: '学习如何从公开仓位估计策略，同时保留分类和融资映射的不确定性。', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/quantifying-treasury-cash-futures-basis-trades-20240308.html' },
    { title: 'IAWG Treasury Market Report (2021)', scope: 'March 2020 narrative、参与者与改革', reason: '用多主体官方证据校正“basis trade 是唯一原因”的过度叙事。', url: 'https://home.treasury.gov/system/files/136/IAWG-Treasury-Report.pdf' },
    { title: 'Vissing-Jorgensen (2021)', scope: 'Spring 2020 flows、yields 与 Fed response', reason: '区分 foreign、mutual funds、households 与 hedge funds，训练严谨的部门口径。', url: 'https://doi.org/10.1016/j.jmoneco.2021.10.007' },
    { title: 'Working (1949)', scope: '全文', reason: '从库存服务理解 convenience yield 的经济来源，而不是把它背成公式残差。', url: 'https://www.jstor.org/stable/1816601' },
    { title: 'Brennan (1958)', scope: '全文', reason: '继续追踪库存供给怎样内生改变 storage return 与期限结构。', url: 'https://www.jstor.org/stable/1812340' },
    { title: 'Fama & French (1987)', scope: 'storage relation、forecast power 与 premiums', reason: '训练将期货曲线、未来现货预期和风险溢价三个对象分开。', url: 'https://doi.org/10.1086/296385' },
    { title: 'Du, Tepper & Verdelhan (2018)', scope: 'CIP measurement 与 balance-sheet explanation', reason: '掌握 cross-currency basis 的符号、期限匹配和中介约束证据。', url: 'https://doi.org/10.1111/jofi.12620' },
    { title: 'Akram, Rime & Sarno (2008)', scope: '高频报价、交易成本与持续时间', reason: '学习从显示 parity violation 推进到可执行双边套利的微观测量。', url: 'https://doi.org/10.1016/j.jinteco.2008.07.004' },
    { title: 'Bessembinder & Lemmon (2002)', scope: '电力 forward premium 模型', reason: '用不可储存资产检验经典 cost-of-carry 的适用边界。', url: 'https://doi.org/10.1111/1540-6261.00463' },
    { title: 'BIS — Crypto Carry', scope: '全文，重点为市场分割与中介约束', reason: '把 crypto 高 basis 从表面年化收益拆成 venue、需求、托管和资产负债表机制。', url: 'https://www.bis.org/publ/work1087.htm' },
    { title: 'Ackerer, Hugonnier & Jermann (2026)', scope: 'perpetual futures 定价与 funding', reason: '理解无到期衍生品为何依靠动态 funding 而非固定终点收敛。', url: 'https://doi.org/10.1111/mafi.70018' },
    { title: '中金所 — 沪深300股指期货', scope: '现行产品页与合约表', reason: '先固定 IF 的标的、乘数、到期月、最后交易日、交割方式与最低保证金字段。', url: 'https://www.cffex.com.cn/hs300/' },
    { title: '中金所 — 沪深300股指期货合约交易细则', scope: '每日结算与交割结算相关条款', reason: '把时钟、最后结算价和现金交割落到合同文本，并在应用前由现行规则目录再次核验。', url: 'https://www.cffex.com.cn/u/cms/www/202003/27165505w3j5.pdf' },
    { title: 'Siriwardane, Sunderam & Wallen (2025)', scope: '模型、实证动机与中介分割', reason: '把不同机构的专属资金成本和相对价值偏离连成可检验研究框架。', url: 'https://doi.org/10.1111/jofi.13469' },
  ],
};
