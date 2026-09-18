import OptionGreeksLab from '../components/OptionGreeksLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson123Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>期权不是一张“看涨或看跌的彩票”；它是一项不对称的或有请求权，价格来自可复制现金流、状态分布与不能被完全复制的风险，Greeks 只是这张价格地图在当前点附近的局部斜率和曲率。</h2>
        <p>
          一份 call（看涨期权）给予持有人在约定条件下买入某项标的的权利，一份 put（看跌期权）给予卖出的权利；买方拥有选择，writer（卖方或立权人）承担被履约的义务。这个不对称结构把未来世界切成不同状态：不利状态下，买方可以放弃权利；有利状态下，卖方必须按合同兑现。premium（权利金）因此不是对未来方向的一次投票，而是今天为整组状态依赖现金流支付的价格。到期 payoff、建仓 premium、持有期间市值和最终 profit 是四个不同对象，混用它们会让后续所有 Greeks 都失去明确含义。<Cite n={1} /><Cite n={6} />
        </p>
        <p>
          本节从“两个组合在每一种状态下是否给出相同现金流”出发。put–call parity 与一步二叉树先建立无套利复制；Black–Scholes–Merton（BSM）再给出一个连续扩散世界中的基准价格函数。Delta、Gamma、Vega、Theta 与 Rho 是对这个函数不同输入的偏导数，它们回答的是“若其余约定暂时冻结，一个小变化会使模型价值怎样改变”，不是对大跳跃、曲面重塑或真实概率的保证。市场 premium 反演出的 implied volatility（IV，隐含波动率）也依赖定价模型、股息、利率、行权方式与数值方法。整节的中心任务因而是：<b>先定义 claim，再建立复制锚，随后读取局部暴露，最后明确模型与合约何时会使这张局部地图失效。</b><Cite n={19} /><Cite n={20} /><Cite n={10} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="system-map">
        <p className="section-kicker">01 · 完整因果回路</p>
        <h2>期权价格位于“合同—复制—模型—报价—风险管理—市场状态—重新估值”的循环中；Greeks 是循环里的翻译器，不是终点。</h2>
        <div className="mechanism-chain" aria-label="期权价格与 Greeks 的八步因果链">
          <div><span>01</span><b>定义 Claim</b><p>固定标的、K、到期、乘数、行权与结算。</p></div>
          <div><span>02</span><b>画出状态支付</b><p>区分权利、义务、payoff、premium 与 profit。</p></div>
          <div><span>03</span><b>寻找复制锚</b><p>用现货、债券、forward、call 与 put 比较同状态现金流。</p></div>
          <div><span>04</span><b>选择定价模型</b><p>明确过程、股息、利率、行权边界和数值方法。</p></div>
          <div><span>05</span><b>由报价反演</b><p>把可成交 premium 映射为 IV 区间与一组模型 Greeks。</p></div>
          <div><span>06</span><b>聚合仓位暴露</b><p>乘方向、张数、乘数，识别局部 P&amp;L 驱动。</p></div>
          <div><span>07</span><b>状态发生变化</b><p>spot、时间、曲面、利率、股息和流动性共同移动。</p></div>
          <div><span>08</span><b>重算与反馈</b><p>旧 Greeks 失效、风险行动产生订单，新价格成为下一轮输入。</p></div>
        </div>
        <p>
          这条回路中有三种不能互换的语言。合同语言回答“最终必须交付什么”；无套利语言回答“哪些组合若同状态同支付，就不能长期维持不同可执行价格”；模型语言则在无法只靠静态复制覆盖所有状态时，用一组假设把当前输入映射为价格与敏感度。市场报价可以偏离某个模型值，却未必越过无套利边界；某个 Greek 可以帮助解释小幅 P&amp;L，却不能证明模型的状态过程真实。将三种语言分层，是专业期权分析的第一道门禁。<Cite n={18} /><Cite n={23} /><Cite n={40} />
        </p>
        <div className="precision-note"><span>本节最终解决的问题</span><p>拿到任意期权链后，能够先还原每张合约的法律与现金流对象，再用 parity、上下界和复制检查报价；能够说明每个 Greek 的数学定义、单位、符号与局部性，把单张数值转换成组合金额暴露；能够把 IV、smile 与 surface 解释为模型化报价坐标，并指出行权、股息、到期、跳跃、曲面动态和模型风险何时使简单直觉失效。</p></div>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与六阶段路线</p>
        <h2>本节讲“价格和暴露怎样被定义”，不提前把 dealer 对冲行为写成市场反馈，也不把 IV 直接变成波动率交易策略。</h2>
        <p>
          硬先修是 T07：能分辨 equity、bond、forward、futures 与 option 代表不同现金流；建议回看 1.22 的 prepaid forward、贴现、股息和可执行 bid–ask。本节会为 1.24 输出 Delta/Gamma/Vega 的严格语言，但不会提前断言“dealer long gamma 必然压低波动”或“0DTE（zero days to expiration，当日到期）必然放大市场”；那些结论还需净仓位、客户流、对冲频率、库存和市场深度。4.18 才会系统讨论 VIX（Cboe Volatility Index，Cboe 波动率指数）、volatility risk premium（波动率风险溢价）与 realized–implied 关系；这里仅建立 IV 与 variance 的定义边界。<Cite n={5} /><Cite n={38} />
        </p>
        <div className="learning-objectives">
          <span>六阶段学习路线 · 从合同到可审计风险语言</span>
          <ol>
            <li><b>合同与损益（03–08）：</b>辨认 buyer/writer、call/put、行权、结算、乘数、moneyness、payoff 与 profit。</li>
            <li><b>模型无关锚（09–12）：</b>用上下界、prepaid forward、put–call parity 与可执行价格带先排除逻辑错误。</li>
            <li><b>复制与连续基准（13–20）：</b>从一步二叉树进入风险中性定价和 BSM，并明确 American/股息边界。</li>
            <li><b>Greeks 风险坐标（21–30）：</b>逐一定义 Delta、Gamma、Vega、Theta、Rho、单位、组合聚合和截断误差。</li>
            <li><b>IV 与曲面（31–40）：</b>把 IV 当数值反演，进入 bid–ask 区间、smile、期限、静态套利和曲面动态。</li>
            <li><b>失效边界与研究（41–49）：</b>处理 0DTE、assignment、jump、model risk、数据协议、互动实验和可证伪研究。</li>
          </ol>
          <p><b>时间预算：</b>第一轮读 00–30，约 90–105 分钟，建立合同、复制与 Greeks；第二轮读 31–49，约 65–80 分钟，完成 IV 曲面、边界、互动与练习。参考文献和延伸阅读不计入。</p>
        </div>
      </section>

      <section className="lesson-section" id="option-claim">
        <p className="section-kicker">阶段一 · 合同与损益　|　03 · Option claim</p>
        <h2>Call 与 put 首先规定“谁有选择、谁有义务”；方向观点只是购买这项不对称权利的可能动机之一。</h2>
        <div className="table-scroll" role="region" aria-label="看涨看跌期权买卖双方权利义务，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Call 与 put 的买方权利、卖方义务及到期每单位支付</caption>
            <thead><tr><th scope="col">仓位</th><th scope="col">合同权利或义务</th><th scope="col">到期支付</th><th scope="col">最先要问的风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">Long call</th><td>有权按 K 买入标的</td><td>max(S<sub>T</sub>−K,0)</td><td>权利金会否全部损失；何时结算</td></tr>
              <tr><th scope="row">Short call</th><td>若被分配，须按 K 卖出或现金结算</td><td>−max(S<sub>T</sub>−K,0)</td><td>上行义务是否有覆盖；assignment</td></tr>
              <tr><th scope="row">Long put</th><td>有权按 K 卖出标的</td><td>max(K−S<sub>T</sub>,0)</td><td>权利金损失与合约标的是否匹配</td></tr>
              <tr><th scope="row">Short put</th><td>若被分配，须按 K 买入或现金结算</td><td>−max(K−S<sub>T</sub>,0)</td><td>下跌时资金与交割义务</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这里的 K 是 strike（执行价），S<sub>T</sub> 是合同规定到期或结算时的标的值。公式按每单位标的写成 gross payoff，不含初始 premium、融资、手续费、税、借券和提前平仓价值。买方的损失常被权利金限制，不代表账户的全部现金需求在所有产品上都等于成交时支付的 premium；futures-style margin options 可以逐日结算。卖方收到 premium 也不是免费收益，因为它交换了一项状态依赖义务。<Cite n={1} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="payoff-profit">
        <p className="section-kicker">04 · Payoff、premium、value 与 profit</p>
        <h2>“到期价内”只说明 payoff 为正；能否盈利还要跨过初始权利金及其资金成本。</h2>
        <div className="equation-card">
          <span>Long European call · 到期口径</span>
          <div>Payoff<sub>T</sub>=M·max(S<sub>T</sub>−K,0)</div>
          <div>Profit<sub>T</sub>=M·max(S<sub>T</sub>−K,0)−M·p<sub>0</sub>·A(0,T)−Costs</div>
          <p>M 是合约乘数，p₀ 是每单位初始 premium，A(0,T) 把初始现金支出滚到同一终点。若教学题明确忽略融资，才可令 A=1。持有期中的 option value V_t 是剩余权利的市场或模型价值，并不等于当时立即行权的 intrinsic value。</p>
        </div>
        <p>
          例：买入两张 K=105 的 call，premium 3.20、乘数 100。若 S<sub>T</sub>=107，合约是 ITM（价内），总 payoff 为 400 元；忽略融资和费用，总 profit 却是 400−640=−240 元。到期盈亏平衡点是 108.20，不是 105。若在到期前价格上升，持有人通常还可以 sell to close（卖出平仓），得到包含剩余时间价值的市场价格；exercise（行权）只是实现权利的一种方式，未必是最优方式。<Cite n={1} /><Cite n={3} />
        </p>
        <div className="precision-note"><span>四层账本</span><p>Payoff 是合同在某状态的支付；premium 是今天成交的价格；intrinsic value 是立即行权或按当前标的关系计算的内在部分；profit 是把所有现金流放到同一时点后的净结果。任何“期权赚了多少”的表述都必须先说明是哪一层。</p></div>
      </section>

      <section className="lesson-section" id="contract-anatomy">
        <p className="section-kicker">05 · Contract anatomy</p>
        <h2>同样写着“call”的两张合约，可能在标的、乘数、行权时点、结算值和现金时序上完全不同。</h2>
        <div className="table-scroll" role="region" aria-label="期权合约字段及其后果，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">期权合约规格与定价、Greeks、交割风险的关系</caption>
            <thead><tr><th scope="col">字段</th><th scope="col">决定什么</th><th scope="col">忽略后的典型错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Underlying</th><td>股票、ETF、指数、futures、FX 或其他 claim</td><td>用错误 spot、forward 或股息输入</td></tr>
              <tr><th scope="row">Strike / expiry</th><td>状态切分点、剩余期限和最终结算日</td><td>把相近合约的 IV 与 Greeks 混合</td></tr>
              <tr><th scope="row">Multiplier / quote</th><td>一个报价点对应的现金、股数或期货单位</td><td>把 per-unit Greek 当组合金额风险</td></tr>
              <tr><th scope="row">Exercise style</th><td>可何时行权：American、European 或其他</td><td>把提前行权权利塞入 European 公式</td></tr>
              <tr><th scope="row">Settlement</th><td>实物、现金或转成 underlying futures</td><td>误判到期后的资产和资金敞口</td></tr>
              <tr><th scope="row">Margin style</th><td>premium upfront 或逐日 variation</td><td>误判 long option 的现金路径</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国标准股票期权经常以 100 股为一单位，但调整合约、指数期权、mini/nano 产品和期货期权都可能不同；100 不是自然常数。Cboe 的 SPX（标普 500 指数标准期权）与 SPXW（以周度、日度等非标准到期、PM 结算系列为主）规格页面列出 100 倍乘数；两者均采用现金结算与 European exercise，但 AM-settled SPX 和 PM-settled SPXW 的最后交易时点及结算值不同。CME futures option 行权通常形成相应 underlying futures position，而不是立即收到仓库中的商品。任何定价或风险计算都应保存当日有效的完整 specification，而不是靠 ticker 猜测。<Cite n={4} /><Cite n={6} /><Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="underlying-styles">
        <p className="section-kicker">06 · Underlying 与 exercise style</p>
        <h2>American 的价值不低于同条件 European，并不意味着“越早行权越好”；额外的是选择权，不是立即行动命令。</h2>
        <p>
          European option 只能在合同规定的到期时点行权；American option 可以在允许期间内行权。由于 American 持有人可以选择不提前行权，它的机会集合至少包含 European 的机会集合，所以在其他条款完全相同且市场可比时，American value 不应更低。但是否现在 exercise，要比较 immediate exercise value 与 continuation value（继续持有价值）。继续持有保留未来凸性与时间选择；行权可能牺牲这部分价值。无股息股票的标准 American call 在经典非负利率、无摩擦条件下通常不应提前行权；离散股息、借券和融资会改变边界。<Cite n={20} /><Cite n={25} />
        </p>
        <p>
          标的也改变“Delta 是什么”。股票期权的 Delta 可以转换为股数等价；指数现金结算期权没有一篮子股票自动进入账户；futures option 行权后形成期货，风险应围绕期货价格和合约乘数计算。对任何屏幕 Greek，先问模型的 underlying input 是 spot、forward 还是 futures，再问该数值是否包含 carry adjustment。不同平台对同一经济敞口采用不同 convention，并不一定是谁算错。<Cite n={6} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="settlement-margin">
        <p className="section-kicker">07 · Exercise、assignment、settlement 与 margin</p>
        <h2>行权选择在经济上属于买方，但自动处理、反向指令、清算与经纪程序决定它如何提交及义务怎样分配；交易对手并不是原始卖方的一对一终身配对。</h2>
        <p>
          Exercise 是持有人启动合同权利；assignment（被指派履约）是 short position 接到义务。中央清算体系先把行权通知分配给拥有相同 short series 的 clearing member，再由经纪机构按其披露程序分配客户。Options Clearing Corporation（OCC，美国期权清算公司）的 exercise-by-exception threshold 是加速到期处理的行政规则，不是“客户只要价内一美分就保证、应该或必须行权”的经济定理；客户指令、broker cut-off、账户资金与盘后价格变化都会影响最终结果。<Cite n={2} /><Cite n={9} />
        </p>
        <p>
          现金结算只支付合同规定的 settlement value 与 strike 之差；实物结算会产生标的买卖；futures option 则可能产生期货仓位。Premium-paid-upfront（equity-style）与 futures-style margining 又改变现金时序：后者成交时不一定立即交换全部 premium，而会逐日 variation settlement，关闭、行权或到期时再完成总权利金结算。因此“long option 的最大初始现金流就是 premium”必须附产品和 margin-style 条件。<Cite n={4} /><Cite n={7} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="moneyness-value">
        <p className="section-kicker">08 · Moneyness、intrinsic 与 time value</p>
        <h2>Moneyness 只描述标的相对执行价的位置；价值还取决于时间、波动率、carry、行权权利和报价。</h2>
        <div className="equation-card">
          <span>到期前的三个不同对象</span>
          <div>Intrinsic<sub>call</sub>=max(S−K,0)，　Intrinsic<sub>put</sub>=max(K−S,0)</div>
          <div>Quoted extrinsic = option premium − current intrinsic</div>
          <p>ITM / ATM / OTM 分别表示当前价内、平值、价外；它们不是盈利、概率或策略质量标签。对于只能到期行权的 European option，以当前 spot 计算的“quoted extrinsic”在特定 carry、深度 ITM 与报价条件下甚至可为负，所以不要把“time value 永不为负”当作跨产品定律。</p>
        </div>
        <p>
          更稳健的分解基准是与同期限 forward 和贴现后的 strike 对齐。European call 的 lower bound 不是简单的 max(S−K,0)，而与 prepaid forward value 有关；American option 因可立即行权又有不同边界。到期前 option premium 还包含未来跨过 strike 的可能状态、凸性价值、流动性与风险补偿。一个深度 OTM option 的 intrinsic 为零，但它的市场价格可以为正；一个深度 ITM European call 的报价相对 spot intrinsic 看似“负时间价值”，也可能只是 carry 与不可提前行权的结果。<Cite n={1} /><Cite n={20} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="bounds">
        <p className="section-kicker">阶段二 · 模型无关锚　|　09 · No-arbitrage bounds</p>
        <h2>在估计 volatility 之前，价格先要通过非负性、支配关系和可复制组合的基本边界。</h2>
        <div className="equation-card">
          <span>European、连续股息率 q、确定性 r 的基准边界</span>
          <div>max(0,Se<sup>−qτ</sup>−Ke<sup>−rτ</sup>) ≤ C<sub>E</sub> ≤ Se<sup>−qτ</sup></div>
          <div>max(0,Ke<sup>−rτ</sup>−Se<sup>−qτ</sup>) ≤ P<sub>E</sub> ≤ Ke<sup>−rτ</sup></div>
          <p>τ=T−t。下界来自能够产生同终值方向的组合；上界来自逐状态支配：call 的到期支付不会超过一单位标的的到期价值，put 的到期支付不会超过 K，因此它们今天分别不应贵过 prepaid underlying 与 K 的现值。公式假设标的和资金可交易、carry 可锁定；确定性负利率仍可直接代入本式，随机利率、融资与贴现不对称、随机股息、借券约束、American exercise 或不同结算币种则要修改或重新推导相应边界。</p>
        </div>
        <p>
          边界是输入质量的第一道审计。若 mid price 位于界外，先检查 stale quote、crossed market、错误 multiplier、股息、利率、时区、到期年化和 exercise style，而不是立刻把异常送入 IV solver。即使 mid 越界，可执行 bid–ask、标的交易成本、借券和融资仍决定是否存在锁定套利。Merton 的经典分析建立了 option bounds 与提前行权性质；真正数据工程必须把这些理论条件翻译成当时可成交的组合。<Cite n={20} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="prepaid-forward">
        <p className="section-kicker">10 · Prepaid forward 作为统一锚</p>
        <h2>先付远期把“今天取得未来一单位标的”的价值单独抽出，使股息、外汇收益和不同 carry 可以进入同一个 parity 语言。</h2>
        <div className="equation-card">
          <span>统一记号</span>
          <div>S<sup>P</sup><sub>0,T</sub> = 今天支付、到 T 获得一单位标的的 prepaid-forward value</div>
          <div>F<sub>0,T</sub> = S<sup>P</sup><sub>0,T</sub> / D(0,T)</div>
          <p>D(0,T) 是到期一元的折现因子。连续股息率 q 时 Sᴾ=Se<sup>−qT</sup>；已知离散现金股息时，常见基准是 S 减去到期前股息现值，但税、借券、股息不确定和公司行动会改变可复制性。</p>
        </div>
        <p>
          这个对象比直接背 C−P=S−Ke<sup>−rT</sup> 更具迁移性。股票有股息，外汇两种货币都产生利息，商品存在仓储与便利收益，futures option 的自然 underlying 可能是期货而非 spot。只要先问“今天锁定未来标的一单位要付多少”，再把 strike 作为到期支付的零息债务，就能看出 parity 的两边到底复制了什么。1.22 的 carry 语言由此成为本节的定价输入，而不是被期权公式重新隐藏。<Cite n={18} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="put-call-parity">
        <p className="section-kicker">11 · Put–call parity</p>
        <h2>同一标的、strike、expiry 与 European style 的 call 减 put，复制的是一份到期价值 S<sub>T</sub>−K 的 long forward claim。</h2>
        <div className="equation-card">
          <span>European parity</span>
          <div>C<sub>E</sub>−P<sub>E</sub>=S<sup>P</sup><sub>0,T</sub>−K·D(0,T)</div>
          <div>连续 q、r 时：C<sub>E</sub>−P<sub>E</sub>=Se<sup>−qτ</sup>−Ke<sup>−rτ</sup></div>
          <p>到期时，long call + short put 在 S_T&gt;K 时得到 S_T−K，在 S_T&lt;K 时仍得到 S_T−K；这与 long prepaid forward 加一笔到期支付 −K 的债务逐状态相同，所以无套利要求今天价格相同。</p>
        </div>
        <p>
          Parity 不是相关性，也不依赖股票最终上涨概率。它是逐状态现金流身份，因此真正的前提是合同完全对齐。若 call 与 put 的 settlement value、exercise style、multiplier、除息处理或最后交易时点不同，即使 ticker 相似也不能直接相减。American options 一般只有 inequalities；离散股息还会触发提前行权边界。Stoll 给出了 call–put 关系的经典市场分析，现代写法则必须显式加入贴现与收入。<Cite n={18} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="executable-parity">
        <p className="section-kicker">12 · 可执行 parity band</p>
        <h2>用 midquote 计算出的 parity residual 是诊断量；只有两组组合都能按正确 bid–ask、融资与借券建立，才存在可锁定边界。</h2>
        <div className="equation-card">
          <span>诊断残差</span>
          <div>ε<sub>parity</sub>=(C−P)−(S<sup>P</sup>−KD)</div>
          <p>ε&gt;0 表示 call-minus-put 相对 synthetic forward 显得高，ε&lt;0 则相反。可执行检验要分别用买入腿 ask、卖出腿 bid，并加 stock/ETF spread、borrow、股息误差、资金曲线、exercise 和结算成本，得到方向不同的上下界。</p>
        </div>
        <p>
          假设 call mid=7、put mid=5.70，而理论右侧=1.48，mid residual 为 −0.18。若 call ask、put bid、prepaid-forward bid/ask 与融资合在一起形成 ±0.35 的执行带，就没有锁定利润。更进一步，quoted put 可能 stale，股息是预测值，stock borrow 可能只对一小部分数量有效。研究者应保存每条腿的时间戳、价格侧、深度与 capacity；否则所谓“parity arbitrage”可能只是非同步数据或不可交易的中点。<Cite n={18} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="one-step-binomial">
        <p className="section-kicker">阶段三 · 复制与连续基准　|　13 · 一步二叉树</p>
        <h2>期权定价最核心的数学不是先猜概率，而是找到一组股票与债券，使两个未来状态中的现金流都与期权相同。</h2>
        <div className="equation-card">
          <span>State-by-state replication</span>
          <div>Δ=(V<sub>u</sub>−V<sub>d</sub>)/(S<sub>u</sub>−S<sub>d</sub>)</div>
          <div>B=e<sup>−rΔt</sup>(V<sub>d</sub>−ΔS<sub>d</sub>)，　V<sub>0</sub>=ΔS<sub>0</sub>+B</div>
          <p>S_u、S_d 是下一期上、下状态的标的价格，V_u、V_d 是期权支付；Δ 单位标的加一笔无风险借贷 B 在两种状态都复制 option，所以今天的复制成本就是 option price。B 可为负，表示借款。这里的简式假设节点之间 q=0、没有中途现金分配；若存在股息，要把 S_u、S_d 定义为含再投资分配的 total-return 单位，或把现金分配显式写入复制账本。</p>
        </div>
        <p>
          例：S<sub>0</sub>=100，下一期为 120 或 80，K=100 的 call 支付为 20 或 0，且节点之间 q=0。复制 Δ=(20−0)/(120−80)=0.5。若连续利率 5%、期限一年，B=e<sup>−0.05</sup>(0−0.5×80)=−38.049，故 V<sub>0</sub>=11.951。无论真实上涨概率是 20% 还是 80%，只要两项基础资产可按假设交易、两个状态完备，这个逐状态复制成本不变。Cox–Ross–Rubinstein（CRR）的离散模型使套利定价与提前行权的逻辑可以被直接检查。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="risk-neutral-weight">
        <p className="section-kicker">14 · Risk-neutral weight 不是预测</p>
        <h2>风险中性概率 p* 是把复制价格写成贴现期望的定价权重；它没有声称投资者真的风险中性，也不是现实上涨频率。</h2>
        <div className="equation-card">
          <span>二叉树的定价测度</span>
          <div>p*=[e<sup>(r−q)Δt</sup>−d]/(u−d)</div>
          <div>V<sub>0</sub>=e<sup>−rΔt</sup>[p*V<sub>u</sub>+(1−p*)V<sub>d</sub>]</div>
          <p>这里 u=S<sub>u</sub>/S<sub>0</sub>、d=S<sub>d</sub>/S<sub>0</sub>，分别是一周期后上涨与下跌状态的除息价格倍数，并假设 u&gt;d。当 d&lt;e^(r−q)Δt&lt;u 时，p* 位于 0 与 1 之间。在这套定价权重中，含股息并将股息再投资的总回报或自融资 gains process 折现后成为 martingale（鞅）；连续股息率 q 下，等价地说，除息 spot 在该测度中的漂移是 r−q。直白地说，贴现后的总回报不再带额外趋势；这是为了给复制现金流定价而采用的坐标变换，不是在声称真实世界的股票“没有趋势”。若 p* 越界，问题先是 underlying 与 bond 的无套利条件被破坏，而不是出现“负的真实概率”。</p>
        </div>
        <p>
          首读只需保留这一点：p* 是由可复制价格关系算出的权重，不是调查或历史频率。进阶地说，在完备市场——即每项 contingent claim（依赖未来状态的或有请求权）都能由交易资产逐状态复制——等价 martingale measure 可以唯一给价；在不完备市场中，多个定价测度可能都不产生套利，需要风险偏好、可交易工具或校准标准进一步选择。因而“期权隐含概率”必须附测度、模型和数据处理：由 strike 曲率恢复的是 risk-neutral state-price density，不是 physical probability 的无偏预测。Cox–Ross 展示了替代随机过程中风险中性定价的普适思想，Harrison–Pliska 则给出连续交易下的严格框架。<Cite n={22} /><Cite n={23} />
        </p>
        <div className="precision-note"><span>Delta 也不是普遍的 ITM probability</span><p>在 BSM 中，无股息 call Delta 为 N(d₁)，风险中性到期价内概率为 N(d₂)；有股息时 call Delta 是 e^(−qτ)N(d₁)。二者一般不同。把 Delta 当概率最多是一种特定情境的经验近似，不能作为定义。</p></div>
      </section>

      <section className="lesson-section" id="multi-step-american">
        <p className="section-kicker">15 · 多步树与 American recursion</p>
        <h2>多步树把“未来继续持有的价值”向后折现；American option 每个节点还要与立即行权价值取最大值。</h2>
        <div className="equation-card">
          <span>Backward induction</span>
          <div>Continuation=e<sup>−rΔt</sup>[p*V<sub>u</sub>+(1−p*)V<sub>d</sub>]</div>
          <div>V<sub>American</sub>=max(Immediate exercise, Continuation)</div>
          <p>到期节点先写 payoff，再逐层向前。European 每个节点只保留 continuation；American 多了一次最优停止判断。股息、利率和 moneyness 通过两项价值比较进入 exercise boundary。</p>
        </div>
        <p>
          树不是越多步就自动正确。u、d、时间步、股息落点、利率曲线、离散公司行动与数值收敛都要验证；接近除息或行权边界时，粗网格会把边界放错。它的教育价值在于把“额外行权权利”变成可见的节点选择，也提供 American pricing 的透明基准。真实生产系统还会用偏微分方程有限差分法（finite-difference PDE）、least-squares Monte Carlo 或近似公式，但都应与高精度 benchmark 和合约规则核对。<Cite n={21} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="bsm-bridge">
        <p className="section-kicker">16 · 从离散复制到 BSM</p>
        <h2>当时间步变小、标的路径变为连续扩散，频繁更新的复制组合把方向性风险局部抵消，导出一个不含股票预期收益率的定价方程。</h2>
        <p>
          Black 与 Scholes 的关键不是假设“股票平均涨多少”，而是构造 stock–option 组合，使一个无穷小时间段内的随机一阶项抵消；无套利要求剩余局部无风险组合赚取资金利率。由此得到的 PDE 以 terminal payoff 为边界，解出 European option price。Merton 扩展了严格定价与边界分析。Cox–Ross–Rubinstein（CRR）树在合适参数化下向这个连续极限收敛，因此一步复制、风险中性期望和 BSM 并不是三套互不相关的魔法公式，而是同一无套利逻辑在不同数学表示中的版本。<Cite n={19} /><Cite n={20} /><Cite n={21} />
        </p>
        <p>
          这个桥同时暴露模型边界：连续复制需要标的可连续交易、价格没有无法对冲的跳跃、交易成本与市场冲击可忽略，且 volatility 等输入按假设演化。现实中 hedging 是离散的，bid–ask 和 funding 存在，波动率不是常数，极端时标的会 gap。BSM 因而是统一报价与敏感度的基准，不是宣布现实过程已被完整描述。模型价格与市场价格的差异需要先区分输入、微观结构和不可复制风险，不能自动叫作套利。<Cite n={39} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="bsm-formula">
        <p className="section-kicker">17 · BSM–Merton 连续股息基准</p>
        <h2>公式把 spot、strike、期限、贴现、股息与 volatility 压缩为两个标准化距离 d₁、d₂；每个输入都必须带单位和时点。</h2>
        <div className="equation-card">
          <span>European options · continuous q</span>
          <div>d<sub>1</sub>=[ln(S/K)+(r−q+½σ²)τ]/(σ√τ)，　d<sub>2</sub>=d<sub>1</sub>−σ√τ</div>
          <div>C=Se<sup>−qτ</sup>N(d<sub>1</sub>)−Ke<sup>−rτ</sup>N(d<sub>2</sub>)</div>
          <div>P=Ke<sup>−rτ</sup>N(−d<sub>2</sub>)−Se<sup>−qτ</sup>N(−d<sub>1</sub>)</div>
          <p>N 是标准正态累计分布，σ 是按年小数表示的 volatility，r、q 与 τ 必须采用一致复利和 day-count。公式给出每单位标的价值；合约金额还要乘 multiplier 与仓位数。</p>
        </div>
        <p>
          复算基准：S=K=100、r=5%、q=2%、σ=20%、τ=0.5 时，d₁≈0.17677670、d₂≈0.03535534，call≈6.30763515，put≈4.83364298；C−P≈1.47399217，恰等于 100e<sup>−0.02×0.5</sup>−100e<sup>−0.05×0.5</sup>。这组数值将在 Greeks 与有限差分中反复使用；任何实现若不同时通过 call、put 与 parity 三重核对，不应继续用于 IV 或风险汇总。<Cite n={19} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="bsm-assumptions">
        <p className="section-kicker">18 · Assumption ledger</p>
        <h2>BSM 的严谨使用不是在公式后写一句“现实不完美”，而是逐项说明哪个假设支撑哪条推论，失效后应换什么工具。</h2>
        <div className="table-scroll" role="region" aria-label="BSM 假设、作用与失效后果，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">Black-Scholes-Merton 关键假设及其风险后果</caption>
            <thead><tr><th scope="col">基准假设</th><th scope="col">支撑的机制</th><th scope="col">现实偏离</th><th scope="col">后果</th></tr></thead>
            <tbody>
              <tr><th scope="row">连续扩散、无跳跃</th><td>局部 Delta 动态复制</td><td>财报、停牌、宏观 gap</td><td>jump risk 不能靠瞬时再平衡消除</td></tr>
              <tr><th scope="row">σ 为常数或确定输入</th><td>单一 closed form</td><td>smile、随机波动率</td><td>不同 K/T 反演出不同 IV</td></tr>
              <tr><th scope="row">无摩擦连续交易</th><td>无限细再平衡</td><td>spread、impact、离散 hedge</td><td>复制误差与最优 hedge 频率</td></tr>
              <tr><th scope="row">可融资、可卖空</th><td>parity 与动态组合</td><td>borrow、haircut、资金分层</td><td>无套利边界变宽且不对称</td></tr>
              <tr><th scope="row">European、确定 carry</th><td>terminal boundary 简单</td><td>American、离散股息</td><td>需要最优停止与新 pricer</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          模型用途应与假设强度匹配。以 BSM IV 作为跨 strike 的共同报价坐标，可以非常有用；以 BSM Delta 做短时风险近似，也可能足够。但若研究除息前 American call 的 assignment、0DTE 的离散跳跃或深度 OTM 翼部，仍使用同一 European constant-vol Greek 而不报告误差，就把便利坐标误当成真实机制。<Cite n={26} /><Cite n={37} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="dividends-early-exercise">
        <p className="section-kicker">19 · 离散股息与提前行权</p>
        <h2>股息不会机械地“提高或降低所有期权”；它先改变持有标的与持有权利的相对现金流，再移动 continuation 与 exercise 的边界。</h2>
        <p>
          预期现金股息降低 ex-date 后的标的价格基准，通常压低 call、抬高 put 的 European value。对 American call，持有人若跨过 ex-date 仍只持有 option，不能收到股票股息；在 call 足够深度 ITM、剩余时间价值很小且股息相对融资收益足够大时，除息日前 exercise 可能最优。条件不是“dividend&gt;0”或“call ITM”，而是 immediate exercise 与 continuation 的完整比较。Roll 的已知股息模型以及后续 Whaley 检验说明了离散股息与 early-exercise premium 的重要性。<Cite n={25} /><Cite n={26} />
        </p>
        <p>
          实务中，直接用 S−PV(dividends) 塞进 European BSM 可能用于粗略近似，却不能精确处理 American boundary。应采用包含离散股息的 tree、PDE 或经验证的 American approximation，并核对 broker/exchange 的 exercise timetable。Short call 的 assignment risk 会在 ex-date 前集中，但持有人也可能选择卖出期权以保留时间价值。Barone-Adesi–Whaley 提供了经典近似；生产使用仍要用高精度数值基准做参数区间测试。<Cite n={1} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="pricing-inputs">
        <p className="section-kicker">20 · Pricing input map</p>
        <h2>Option price 不是只由 spot 与 volatility 决定；每个输入都来自一个市场、曲线或制度选择，也各自带有观测误差。</h2>
        <div className="model-glossary" aria-label="期权定价输入地图">
          <article><b>S / F</b><p>同步 spot、forward 或 futures；选择取决于模型与 underlying。</p></article>
          <article><b>K</b><p>合同执行价，必须与报价和 settlement currency 同单位。</p></article>
          <article><b>τ</b><p>精确到 expiry/settlement 时刻的 year fraction，不只是日期相减。</p></article>
          <article><b>r / curve</b><p>适用抵押与融资口径的贴现曲线，不是任意国债收益率。</p></article>
          <article><b>q / dividends</b><p>连续收益率或离散现金分布；未来股息本身可能不确定。</p></article>
          <article><b>σ / surface</b><p>模型 volatility 参数；由历史、校准或 market price 反演而来。</p></article>
        </div>
        <p>
          同一 option 在不同 vendor 上出现不同 IV/Greeks，常见原因是 quote side、spot timestamp、dividend forecast、discount curve、exercise model、vol surface interpolation、day-count 与 numerical precision 不同。Cboe 的 calculator 和 trade-by-trade Greeks 产品也把这些数值视为指定模型与输入的计算输出，而非交易所直接观测的合同常数。可审计数据必须保存 model name、version、每个 input、curve timestamp、quote side 和 calculation timestamp。<Cite n={16} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="greeks-definition">
        <p className="section-kicker">阶段四 · Greeks 风险坐标　|　21 · 偏导数语言</p>
        <h2>Greeks 是同一个定价函数对不同输入的局部偏导；“偏”意味着一次只改变一个坐标，并暂时冻结其余约定。</h2>
        <div className="equation-card">
          <span>Local sensitivity map</span>
          <div>V=V(S,σ,t,r,q,…)</div>
          <div>Delta=∂V/∂S，Gamma=∂²V/∂S²，Vega=∂V/∂σ，Theta=∂V/∂t，Rho=∂V/∂r</div>
          <p>Strike 和到期是合同字段，不在持仓期间连续变化；S、surface、时间和曲线会变。每个导数都隐含“其他输入与模型 convention 保持不变”，所以观测到的总价格变化通常不是某一个 Greek 单独造成。</p>
        </div>
        <p>
          Greeks 的价值在于把非线性 claim 翻译成局部风险预算：多少 directional exposure，Delta 会以多快速度变化，对 IV、一天时间和利率 bump 有多敏感。它们不是独立的五种风险资产，而是同一价格曲面的不同切片；当 spot 改变，Delta、Gamma、Vega 与 Theta 会一起重算。Options Industry Council（OIC，期权行业委员会）把它们称为 theoretical guideposts，而非精确 premium 变化保证，这个限定应保留在任何 dashboard 上。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="delta">
        <p className="section-kicker">22 · Delta</p>
        <h2>Delta 是 option value 对 underlying input 的局部斜率；它既是小幅价格敏感度，也是复制组合中标的数量的第一阶近似。</h2>
        <div className="equation-card">
          <span>BSM European Delta</span>
          <div>Δ<sub>call</sub>=e<sup>−qτ</sup>N(d<sub>1</sub>)，　Δ<sub>put</sub>=e<sup>−qτ</sup>[N(d<sub>1</sub>)−1]</div>
          <p>在连续股息 spot-delta convention 下，call Delta 为正、put Delta 为负。每张 underlying-equivalent exposure 是 multiplier × Delta；组合还要乘有符号张数。Forward Delta、premium-adjusted Delta 与 futures-option Delta 会采用不同分母或 carry convention。</p>
        </div>
        <p>
          基准算例的 call Delta≈0.56448493，put Delta≈−0.42556490。若乘数 100，long 一张 call 具有约 +56.45 股的 share-equivalent exposure（股数等价暴露）：在足够小的变化且其他输入冻结时，spot 上涨 1 元，整张合约价值的一阶变化约 +56.45 元。这不是说持有人拥有 56.45 股，也不是大行情中的保证，因为 Gamma、IV、时间和 bid–ask 同时可能改变。Put–call Delta 差为 e<sup>−qτ</sup>，对应 parity 中 prepaid forward 的 spot sensitivity。<Cite n={11} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="gamma">
        <p className="section-kicker">23 · Gamma</p>
        <h2>Gamma 是 Delta 对 spot 的变化率，也就是 option price 对 spot 的曲率；它说明“方向暴露本身会不会随着市场移动而加速变化”。</h2>
        <div className="equation-card">
          <span>BSM European Gamma</span>
          <div>Γ=e<sup>−qτ</sup>φ(d<sub>1</sub>)/(Sσ√τ)</div>
          <p>φ 是标准正态密度。标准 long call 与 long put 的 Gamma 相同且为正；short position 符号相反。单位是每一标的价格单位的 Delta 变化，而不是 option price 直接变化。</p>
        </div>
        <p>
          基准算例 Γ≈0.02749579/元。Spot 从 100 小幅升到 101，call Delta 的线性近似会增加约 0.0275。Gamma 通常在 near-the-money、短期限时集中，因为少量 spot 变化更容易改变到期支付区域；但“短期 Gamma 更高”仍需固定 forward moneyness 与其他输入。接近到期时，ATM Gamma 在 BSM 中大致按 1/√τ 集中，不是无条件“指数级爆炸”；一旦价格跳过 strike，局部导数和连续路径假设可能同时失效。<Cite n={12} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="vega">
        <p className="section-kicker">24 · Vega</p>
        <h2>Vega 衡量模型价值对 volatility 参数的小幅变化；它不是对 realized volatility 的直接头寸，也不是一个希腊字母的正式数学名称。</h2>
        <div className="equation-card">
          <span>BSM European Vega</span>
          <div>𝒱=∂V/∂σ=Se<sup>−qτ</sup>φ(d<sub>1</sub>)√τ</div>
          <p>公式对 σ 的小数变化 1.00 求导。交易台常报告“每 1 vol point”，即 σ 改变 0.01，所以 displayed Vega=𝒱/100。若不注明单位，数值会相差 100 倍。</p>
        </div>
        <p>
          基准算例 𝒱≈27.49579441/vol decimal，即约 0.27495794/vol point。IV 从 20% 变为 21%，在其他输入和曲面 convention 冻结下，option value 的一阶变化约 +0.275。Realized volatility（实现波动率）是价格路径事后按指定采样频率、收益定义和年化规则计算出的统计量；IV 则是当前 option price 在指定模型下的反演参数。Vega 直接描述后者作为定价输入的小变化，并不是对未来 realized volatility 的线性合约。Long vanilla option 的 BSM Vega 通常为正，但持仓“long Vega”并不保证市场波动时赚钱：spot move、Theta、surface skew、realized path、hedging 与买入时支付的 IV 水平共同决定 P&amp;L。0DTE ATM Vega 大致按 √τ 趋近零，同时 Gamma 集中，说明“高 Gamma”与“高 Vega”不是同义词。<Cite n={14} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="theta">
        <p className="section-kicker">25 · Theta</p>
        <h2>Theta 是日历时间推进时、其他模型输入按约定冻结的局部价值变化；它不是每天固定扣款，也没有跨平台唯一换算。</h2>
        <div className="equation-card">
          <span>本节 convention</span>
          <div>Θ=∂V/∂t=−∂V/∂τ</div>
          <div>Θ<sub>call</sub>=−Se<sup>−qτ</sup>φ(d<sub>1</sub>)σ/(2√τ)−rKe<sup>−rτ</sup>N(d<sub>2</sub>)+qSe<sup>−qτ</sup>N(d<sub>1</sub>)</div>
          <p>数学公式通常给每年 Theta；per-day 可以除以 365、252 或按实际 year fraction 重算。周末、节假日与 curve/IV 是否同时移动取决于系统 convention。</p>
        </div>
        <p>
          基准 call annual Theta≈−6.87723193，按 365 约 −0.01884173/天；put annual Theta≈−3.98078204，按 365 约 −0.01090625/天。Long vanilla 的 Theta 经常为负，因为随着选择期限缩短，未来有利状态的机会集合减少；但利率、股息、moneyness、exercise style 与时间定义都可能改变符号或直觉，不能写成“所有 long options 永远负 Theta”。更重要的是，现实一日内 IV 和 spot 不会自动冻结，observed P&amp;L 不能只归因于时耗。<Cite n={13} /><Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="rho">
        <p className="section-kicker">26 · Rho</p>
        <h2>Rho 衡量 option value 对利率输入的局部敏感度；对长久期和 strike 现值占比高的合约更重要，但实际风险通常是一整条曲线而非一个 r。</h2>
        <div className="equation-card">
          <span>BSM European Rho</span>
          <div>ρ<sub>call</sub>=Kτe<sup>−rτ</sup>N(d<sub>2</sub>)，　ρ<sub>put</sub>=−Kτe<sup>−rτ</sup>N(−d<sub>2</sub>)</div>
          <p>公式对利率小数变化 1.00 求导；每 100bp 的金额是 ρ/100，每 1bp 则是 ρ/10,000。若 bump 的是整条 discount curve、forward curve 或 collateral curve，必须记录具体节点与联动规则。</p>
        </div>
        <p>
          基准 call Rho≈25.07042915/rate decimal，即每 +100bp 约 +0.25070429；put 每 +100bp 约 −0.23695066。在连续股息 BSM 里，更高 r 降低 strike 现值，因而提高 call、降低 put；但股票融资、股息预期和波动率曲面常会随利率一起变化。对于 FX option，两种货币利率分别进入 forward；对于 futures-style option，现金时序也会改变利率效应。单一 Rho 是局部简化，不应替代 curve scenario。<Cite n={15} /><Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="units-position">
        <p className="section-kicker">27 · 单位、方向、乘数与组合聚合</p>
        <h2>屏幕上一个“0.40 Delta”没有金额意义；只有附上 position sign、contracts、multiplier、underlying unit 与 quote convention，才能进入风险预算。</h2>
        <div className="table-scroll" role="region" aria-label="Greeks 单位与组合换算，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">每单位 Greeks 转为组合风险的换算规则</caption>
            <thead><tr><th scope="col">Greek</th><th scope="col">常见 per-unit 单位</th><th scope="col">组合换算</th><th scope="col">常见 100 倍错误</th></tr></thead>
            <tbody>
              <tr><th scope="row">Delta</th><td>option price / underlying price</td><td>sign×n×M×Delta</td><td>把 0.40 当 40 股后又乘 100</td></tr>
              <tr><th scope="row">Gamma</th><td>Delta / underlying unit</td><td>sign×n×M×Gamma</td><td>忘记它改变的是 Delta</td></tr>
              <tr><th scope="row">Vega</th><td>price / 1 vol point 或 /1.00</td><td>先统一 vol-point convention</td><td>decimal 与 percentage point 混用</td></tr>
              <tr><th scope="row">Theta</th><td>price / day 或 /year</td><td>先统一 calendar convention</td><td>annual 又除以交易日两次</td></tr>
              <tr><th scope="row">Rho</th><td>price /100bp、/1bp 或 /1.00</td><td>先统一 rate bump</td><td>bp 与 percentage point 混用</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这里 n 是合约张数，M 是合约乘数；使用小写 n，是为了避免与 BSM 中表示标准正态累计分布的 N(·) 混淆。一个组合的 Greek 可以线性相加，但前提是所有腿使用同一模型、同一 underlying coordinate、同一 surface snapshot 与同一单位。跨 expiry Vega 直接相加会掩盖期限桶；跨 strike Gamma 相加仍可能对局部 spot 变化有效，却不能替代全局情景；SPX 指数期权、SPY（跟踪标普 500 的 ETF）期权与 ES（E-mini S&amp;P 500 股指期货）期权的 multiplier、settlement 和 underlying 不同，更不能只按 ticker 家族合并。风险报表应同时保留原生 Greek、标准化金额、bucket 与全重估 scenario。<Cite n={10} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="local-taylor">
        <p className="section-kicker">28 · 局部 P&amp;L 的截断展开</p>
        <h2>Delta–Gamma–Vega–Theta–Rho 是一份局部 attribution，不是完整的二阶 Taylor，也不是大行情中的精确损益公式。</h2>
        <div className="equation-card">
          <span>常用截断</span>
          <div>ΔV≈Delta·ΔS+½Gamma·(ΔS)²+Vega·Δσ+Theta·Δt+Rho·Δr</div>
          <p>公式保留 spot 的二阶项和其他变量的一阶项。Δt 必须与 Theta 单位一致，Δσ 与 Vega convention 一致，Δr 与 Rho convention 一致；乘 position sign、张数与 multiplier 后才得到组合金额。</p>
        </div>
        <p>
          例：每单位 Delta=0.54、Gamma=0.032/元、Vega=0.12/vol point、Theta=−0.04/天、Rho=0.08/100bp；一天内 ΔS=+2、IV −3 vol points、利率 +25bp。截断值为 1.08+0.064−0.36−0.04+0.02=0.764。十张、乘数 100 的估计 P&amp;L 为 764。这个数不是“模型确认的利润”，而是把全量重估（full repricing）与局部风险解释进行比较的基准；全量重估是把变化后的 spot、整张 volatility surface、剩余时间和曲线重新输入完整定价函数，得到新的合约价值。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="cross-greeks">
        <p className="section-kicker">29 · Cross-Greeks 与曲面联动</p>
        <h2>Spot 与 IV、时间与 Delta 并不会在现实中独立移动；遗漏的交叉项解释了为什么单项 Greek 加总常在压力期失真。</h2>
        <div className="equation-card">
          <span>完整二阶会额外包含</span>
          <div>V<sub>Sσ</sub>ΔSΔσ + ½V<sub>σσ</sub>(Δσ)² + V<sub>St</sub>ΔSΔt + …</div>
          <p>V_Sσ 常称 vanna，V_σσ 常称 volga/vomma，V_St 与 charm 类概念相关。名称不是重点；重点是明确变量的共同变化、模型 convention 与量级。</p>
        </div>
        <p>
          Equity selloff 中 spot 下跌往往伴随 skew 与 IV 上升；若只把旧 Delta、旧 Vega 分别乘变化，既漏掉 vanna，也漏掉 surface 在 strike 维度的重新映射。接近到期，Delta 还会随时间和 spot 快速改变。实务应把 Greek attribution 与 shocked-surface full repricing 并列：前者提供可解释性，后者提供非线性覆盖。误差本身也是信号，可能来自大步长、交叉项、曲面动态、跳跃、quote spread 或模型实现。<Cite n={35} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="finite-difference">
        <p className="section-kicker">30 · Finite difference 与 Greek 验收</p>
        <h2>闭式 Greek 也必须用数值 bump 复核；正确做法不是找一个恰好吻合的步长，而是观察缩小步长时是否稳定收敛。</h2>
        <div className="equation-card">
          <span>中心差分</span>
          <div>Delta<sub>h</sub>=[V(S+h)−V(S−h)]/(2h)</div>
          <div>Gamma<sub>h</sub>=[V(S+h)−2V(S)+V(S−h)]/h²</div>
          <div>Vega<sub>hσ</sub>=[V(σ+hσ)−V(σ−hσ)]/(2hσ)</div>
          <p>至少使用两个逐步减小的 bump，记录价格精度和 solver tolerance。h 太大会产生 truncation error，太小会放大浮点 cancellation；离散股息和 exercise boundary 还会导致局部不光滑。</p>
        </div>
        <p>
          验收顺序应先通过 price/parity benchmark，再比 closed-form 与 finite-difference，最后才进入 portfolio aggregation。American pricer、树或 PDE 的 Delta/Gamma 还要做 grid convergence；IV solver 内部的 Vega 必须与价格函数用同一参数化。若 analytic Greek 与 numerical bump 不同，不应简单选择“看起来更合理”的一个，而要定位 day-count、dividend、bump unit、surface refit 或 exercise state 的差异。<Cite n={24} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="implied-volatility">
        <p className="section-kicker">阶段五 · IV 与曲面　|　31 · Implied volatility 是反演根</p>
        <h2>IV 不是从市场屏幕直接测量到的未来波动率；它是令指定定价模型等于某个市场 premium 的 σ。</h2>
        <div className="equation-card">
          <span>Inverse problem</span>
          <div>f(σ)=V<sub>model</sub>(S,K,τ,r,q,σ)−V<sub>market</sub>=0</div>
          <p>先选择 price、model、exercise style、carry 和 numerical solver，再求根。换用 bid、mid、ask，换一条股息或利率曲线，或换 American pricer，得到的 IV 都可能不同。</p>
        </div>
        <p>
          IV 的实用价值在于把不同 strike、标的水平和期限的 option premium 压缩成相对可比的年化参数；它不是声称真实收益服从该模型。一个 25% IV 的 call 和一个 25% IV 的 put，只有在合同、forward moneyness、模型与曲面口径一致时才具有明确的相对含义。市场参与者用 IV 报价，也可以同时知道 BSM 常数波动率假设并不真实：统一坐标与真实生成机制是两个问题。<Cite n={10} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="iv-solver">
        <p className="section-kicker">32 · Solver、Vega 与数值边界</p>
        <h2>IV 不是把 BSM 公式代数移项；它通常需要数值求根，而近价格边界时 Vega 很小，最快的算法反而可能最不可靠。</h2>
        <div className="equation-card">
          <span>Newton update</span>
          <div>σ<sub>n+1</sub>=σ<sub>n</sub>−f(σ<sub>n</sub>)/Vega(σ<sub>n</sub>)</div>
          <p>Vega 是价格函数对 σ 的导数，也是 Newton step 的分母。若 option 深度 ITM/OTM、临近到期或价格接近无套利界，Vega 很小，小的 quote error 会变成巨大的 IV step。</p>
        </div>
        <p>
          European vanilla 在 τ&gt;0、market price 严格位于 σ→0 的价格下限与 σ→∞ 的价格上限之间、且其他输入合理时，price 随 σ 单调上升，因而有唯一有限正根。价格恰好等于下限时对应零波动率极限；恰好等于上限时只能由无限波动率极限逼近；落在边界之外则没有该模型下的根。但“solver 返回数值”不证明 quote 合法：不当初值可能越界，浮点取消会破坏极端尾部，American price 用 European solver 会产生伪 IV。稳健实现先检查 bounds，再用 bracketed bisection/Brent 保证区间，Newton 只用于安全加速，并输出 residual、iterations、bracket 与 failure code。Manaster–Koehler讨论了存在、唯一与迭代条件，Jäckel则专门处理极端区域的数值稳定。<Cite n={28} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="iv-interval">
        <p className="section-kicker">33 · Bid–ask IV interval</p>
        <h2>当 premium 是区间时，IV 也应是区间；用 mid IV 抹掉了流动性、不确定性与可执行方向。</h2>
        <div className="equation-card">
          <span>Executable inversion</span>
          <div>IV<sub>bid</sub>=IV(V<sub>bid</sub>)，　IV<sub>ask</sub>=IV(V<sub>ask</sub>)</div>
          <p>对 standard long vanilla、同一单调 pricer，price bid≤ask 通常映射为 IV_bid≤IV_ask。若出现反向或无根，先检查报价、bounds、模型、股息与数据时钟。</p>
        </div>
        <p>
          S=K=100、r=q=0、T=1 时，ATM BSM call 有 C=100[2N(σ/2)−1]。模型价格 7.965567 对应约 20% IV；若实际 bid/ask=7.80/8.10，其报价中点是 7.95，而两侧反演约为 19.5829%–20.3387%。报告“市场 IV=20%”会隐藏约 0.756 个 vol point 的执行宽度。对于 Vega 极小的尾部，几分钱 spread 可映射成巨大的 IV range；此时 price space 往往比 IV space 更稳定。<Cite n={14} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="smile-skew">
        <p className="section-kicker">34 · Smile 与 skew</p>
        <h2>若所有 strike 共享同一常数 volatility，IV 横截面应是平的；现实 smile/skew 是模型错配被重新编码进报价坐标后的结构。</h2>
        <p>
          同一 expiry 上，把每个 strike 的市场 premium 反演为 BSM IV，得到 smile。Equity index 常见 lower strikes IV 更高的 downside skew；某些 FX 或商品会呈更对称 smile。形状可以反映 risk-neutral tail、jump、stochastic volatility、leverage effect、供需、交易成本和风险补偿的混合，不能从一条 skew 单独识别唯一机制。Heston 的 stochastic variance 与 spot–variance correlation、Bates 的 jumps 都能生成非平坦形状，但它们不是唯一解释。<Cite n={36} /><Cite n={37} />
        </p>
        <p>
          Smile 也不是某个 strike “真的拥有不同未来波动率”的简单陈述。它首先说：用同一个 constant-vol BSM 坐标解释不同状态价格时，需要不同 σ 才能匹配。若把每个 IV 当独立参数而不约束整张 price curve，插值可能产生负 state density 或 butterfly arbitrage。因此市场数据清洗要从可执行 option prices 和 forward 开始，再选择无静态套利的参数化，而不是先平滑 raw IV 点。<Cite n={30} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="surface-coordinates">
        <p className="section-kicker">35 · Forward moneyness 与 total variance 坐标</p>
        <h2>跨日期、spot 和 expiry 比较曲面时，固定 strike 往往比较了不同经济状态；forward log-moneyness 与 total variance 更接近可迁移坐标。</h2>
        <div className="equation-card">
          <span>常用曲面坐标</span>
          <div>k=ln(K/F<sub>T</sub>)，　w(k,T)=σ<sup>2</sup><sub>imp</sub>(k,T)·T</div>
          <p>k=0 是 ATM-forward；k&lt;0 表示 strike 低于 forward，k&gt;0 表示高于 forward。w 是到期累计 implied variance，而 σ_imp 是年化 volatility；20% volatility 对应 variance 0.04，不是“4% volatility”。</p>
        </div>
        <p>
          Spot 从 100 变为 110 时，固定 K=100 的 option 从 ATM 进入 ITM；其 IV 变化同时混合了沿 skew 移动和曲面本身重塑。用 k 或 Delta bucket 可把相似相对位置对齐，但 Delta 自身又依赖模型和 IV，所以也不是无模型坐标。期限比较则应观察 total variance：年化 IV 下降并不意味着累计不确定性下降。坐标选择必须与研究问题一致，并保存 forward construction、discounting 与 interpolation convention。<Cite n={33} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="term-total-variance">
        <p className="section-kicker">36 · Term structure 与 implied-total-variance slope</p>
        <h2>长期 IV 低于短期 IV 不等于 calendar arbitrage；需要比较同一可比状态上的 option prices 或 implied total variance 是否满足时间方向的无套利关系。</h2>
        <div className="equation-card">
          <span>Implied-total-variance 坐标的区间斜率</span>
          <div>v̄<sub>imp</sub>(T<sub>1</sub>,T<sub>2</sub>)=[w(0,T<sub>2</sub>)−w(0,T<sub>1</sub>)]/(T<sub>2</sub>−T<sub>1</sub>)</div>
          <p>这里 w(0,T)=σ²_imp(0,T)T，公式要求可比的 ATM-forward 坐标、确定 carry 和一致的 variance convention。它只是 implied-total-variance 曲线的区间斜率，不是从任意两个 fixed-strike raw IV 直接相减，也不是 model-free variance-swap forward。</p>
        </div>
        <p>
          例：同一 ATM-forward coordinate，T₁=0.25 年的 IV=30%，T₂=1 年的 IV=24%。w₁=0.0225，w₂=0.0576，累计 implied variance 仍增加；区间斜率=(0.0576−0.0225)/0.75=0.0468，其平方根约 21.6333%，可作为这一坐标下的区间 implied-vol summary。它既不是未来 realized variance 在 Q 测度或 P 测度下的预测，也不是可直接交易的 model-free variance forward；后者要由跨 strike option prices 复制。Cboe VIX 方法正是跨执行价聚合期权价格，而不是套用这里两个 ATM IV 的差商。曲线倒挂可以反映近期事件风险集中，而不违反无套利；真正异常是可复制 calendar spread 在考虑 carry 后出现状态支配却价格反向。<Cite n={33} /><Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="static-arbitrage">
        <p className="section-kicker">37 · Surface 的静态无套利</p>
        <h2>一张曲面不仅要“看起来平滑”；它还必须避免同一期限的 butterfly arbitrage 与跨期限的 calendar-spread arbitrage。</h2>
        <p>
          对同 expiry European call，价格随 strike 应非增且对 strike 凸；否则可以用相邻 strikes 构造负成本、非负终值的 vertical 或 butterfly 组合。在适当的 forward/discount 口径下，maturity 方向也要满足 calendar consistency。逐 expiry 独立做漂亮 spline，可能在两条 slice 之间制造套利；只检查 raw annualized IV 单调同样不够。Gatheral–Jacquier 的 SVI（stochastic-volatility-inspired，总方差参数化）工作展示了以 total variance 参数化并显式排除 butterfly 与 calendar static arbitrage 的重要性。<Cite n={33} />
        </p>
        <p>
          静态无套利仍不等于动态模型正确。一个 surface 可以在今天对所有 listed European quotes 无套利地拟合，却在明天 spot 移动时采用错误的 smile dynamics，导致 hedging 失效。极端 wings 还受有限矩与渐近斜率约束；Lee 的 moment formula 是 tail boundary，不是用两条噪声报价外推无限 strike 的万能工具。发布曲面应同时报告 quote filters、bid–ask tolerance、forward/discount inputs、插值、extrapolation 与 arbitrage diagnostics。<Cite n={32} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="sticky-dynamics">
        <p className="section-kicker">38 · Sticky-strike、sticky-delta 与有效 Delta</p>
        <h2>今天的 surface snapshot 没有告诉我们明天 spot 变化后 IV 会留在哪；不同 sticky rule 是动态假设，不是市场定律。</h2>
        <div className="equation-card">
          <span>Surface motion 下的 total derivative</span>
          <div>dV/dS=(∂V/∂S)<sub>σ frozen</sub>+(∂V/∂σ)(∂σ<sub>imp</sub>/∂S)</div>
          <p>屏幕 BSM Delta 通常冻结 IV；若 spot move 同时使该固定 K option 的 IV 沿曲面改变，有效 Delta 还包含 Vega × surface response。</p>
        </div>
        <p>
          Sticky-strike 假设每个绝对 strike 的 IV 暂时不变；sticky-delta 假设 smile 固定在同一 Delta coordinate，并随 spot 移动。在 BSM 教学近似里，相对 moneyness 常被用来帮助理解这一移动，但“同 moneyness”与“同 Delta”不是跨模型恒等式，因为 Delta 本身依赖期限、carry、IV 与模型。Equity downside skew 下，两种规则会给同一固定-K put 不同 IV 变化和 hedge ratio。Derman 强调 volatility regime 会变，Dumas–Fleming–Whaley也表明横截面拟合好不保证样本外 pricing/hedging 好。研究应估计或情景化 surface dynamics，而不是在报告中把一条 sticky rule 隐藏成默认事实。<Cite n={35} /><Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="risk-neutral-density">
        <p className="section-kicker">39 · Risk-neutral density 与证据边界</p>
        <h2>足够平滑、无套利的 European call price 对 strike 的二阶导数可以恢复 state-price density；它仍是 Q 测度下的价格权重，不是现实频率。</h2>
        <div className="equation-card">
          <span>Breeden–Litzenberger relation</span>
          <div>∂²C(K,T)/∂K²=D(0,T)·f<sub>Q</sub>(K)</div>
          <p>需要同一时点、同一 expiry、正确 carry、连续且足够平滑的 strike-price curve。现实只有离散 strikes、bid–ask 与噪声，必须插值和正则化。</p>
        </div>
        <p>
          这个关系使 option surface 成为状态价格信息源：convexity 对应在不同到期状态上分配的贴现权重。Rubinstein 的 implied tree 进一步让观测 smile 与一组 risk-neutral state prices 匹配。但从 Q density 到 physical density 还要识别 stochastic discount factor 与 risk premium；不同模型能拟合同一 surface 却给出不同动态。把“期权隐含尾部”直接称为真实灾难概率，会跨越尚未证明的测度桥。<Cite n={30} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="model-families">
        <p className="section-kicker">40 · 模型家族与识别</p>
        <h2>Local volatility、stochastic volatility 与 jump models 可以拟合同一部分 smile，却对未来曲面、路径和 hedge error 给出不同预测。</h2>
        <div className="table-scroll" role="region" aria-label="期权模型家族、解释机制和边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">常见波动率模型家族的机制、拟合对象与主要风险</caption>
            <thead><tr><th scope="col">模型家族</th><th scope="col">主要自由度</th><th scope="col">能解释什么</th><th scope="col">不能自动证明什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">Local volatility</th><td>σ(S,t) 的状态函数</td><td>给定条件下拟合今天的 European surface</td><td>明天 smile dynamics 与真实扩散机制</td></tr>
              <tr><th scope="row">Stochastic volatility</th><td>随机 variance 与相关性</td><td>vol-of-vol、skew 与动态</td><td>唯一参数识别或无 jump</td></tr>
              <tr><th scope="row">Jump-diffusion</th><td>跳跃频率与幅度分布</td><td>gap 与 tail prices</td><td>连续 hedge 可覆盖 jump</td></tr>
              <tr><th scope="row">Implied/parametric surface</th><td>直接拟合 w(k,T)</td><td>稳定报价、插值与静态无套利</td><td>标的和曲面的联合真实过程</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          校准误差很小只说明模型能在所选 loss function 下匹配 liquid instruments。Cont 证明了多个模型可同时校准基准期权，却对其他 claims 和风险给出显著差异；model risk 因而是可量化的 exposure，不是文末免责声明。模型选择应由用途决定：报价、静态插值、短时 hedge、stress 或 exotic valuation 各需不同验证。<Cite n={36} /><Cite n={37} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="zero-dte">
        <p className="section-kicker">阶段六 · 失效边界与研究　|　41 · 0DTE 的尺度压缩</p>
        <h2>0DTE 只是“今天到期”的合同状态，不代表今天才上市；它把时间、Gamma、执行与结算风险压缩到同一交易日。</h2>
        <p>
          Cboe 将 0DTE 定义为在当前交易日到期的 option；同一合约可能数日、数周或数月前已经挂牌。接近到期时，near-the-money option 对 underlying move 极其敏感，但这种敏感度必须与产品规格一起解释：SPX/SPXW 是现金结算、European-style，单股或 ETF option 可能实物结算、American-style，期货期权又可能转成 futures position。把“0DTE”当成统一产品类别，会混淆 settlement、assignment、last trading time 与 multiplier。<Cite n={5} /><Cite n={4} />
        </p>
        <p>
          在 BSM ATM 附近，Gamma 和主要 Theta 项大致按 τ<sup>−1/2</sup> 集中，Vega 按 √τ 缩小。这意味着很小 spot move 就会迅速改变 Delta，而对一个 vol-point 的价值敏感度反而可能降低；spread、离散 tick、结算 fixing 和盘中跳跃会占据更大比例。旧 Greek 的有效期变短，需要更频繁 full repricing，但这不自动推出净市场反馈方向；1.24 还要加入 dealer 净仓位与 hedge order 才能判断反馈。<Cite n={10} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="expiry-assignment">
        <p className="section-kicker">42 · Expiry、assignment 与 pin risk</p>
        <h2>到期附近最危险的不是“忘记 payoff 公式”，而是最终 settlement value、行权指令和被分配数量在账户层面留下了什么新仓位。</h2>
        <p>
          Physical-delivery option 的标的若收在 strike 附近，short holder 可能在 cut-off 时仍不知道最终有多少张被 exercise；盘后价格变化、客户 contrary instruction 与经纪分配会造成次日意外股票仓位，这类不确定性常称 pin risk。多腿 spread 也不会保证作为整体同时行权或分配：一腿自动处理、另一腿未处理，就可能留下完整 directional exposure。现金结算 European index option 没有传统意义的“意外收股票”，但仍有 settlement calculation、last-trading-time 与 overnight/gap basis 风险。<Cite n={9} /><Cite n={41} />
        </p>
        <p>
          专业到期清单要逐 series 保存 exercise style、broker deadline、OCC/exchange threshold、settlement type、expected cash/asset position、资金需求和盘后 contingency。OCC 明确其行政 threshold 不决定客户仓位应否行权；Cboe 也区分 AM-settled SPX 与 PM-settled SPXW 的交易和结算时点。任何“价内都会自动安全结算”的教学句都应改成条件式流程。<Cite n={2} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="jump-discrete-hedge">
        <p className="section-kicker">43 · Jump、离散对冲与局部地图失效</p>
        <h2>提高再平衡频率可以减少部分连续路径误差，却不能在不可交易的瞬间跨越中复制一个 jump state。</h2>
        <p>
          Delta hedging 的连续极限依赖价格路径连续。若标的从 100 直接跳到 85，中间 strikes 没有可成交时点；持有人不能在 99、98、…逐步更新 Delta，Gamma Taylor 展开也可能远离局部有效区。Merton 的 jump-option 分析表明，只用 underlying 与 bond 通常无法完整对冲不可交易的 jump risk。事件前后 IV surface 还可能重塑，使旧 Vega、vanna 和 sticky rule 同时失效。<Cite n={39} />
        </p>
        <p>
          离散对冲误差还来自 bid–ask、impact、交易延迟、hedge instrument basis、股息和模型参数变化。研究对冲表现时，应固定 hedge schedule 或触发规则，保存每次可执行价格与成本，并将 realized P&amp;L 分成 carry、Delta trading、option terminal payoff 与残余；不能事后用更高频数据假设交易者能够在每个 tick 成交。1.24 将从这份账本进入对冲订单如何反过来影响 underlying market。<Cite n={32} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="model-risk">
        <p className="section-kicker">44 · Model risk 与三层不确定性</p>
        <h2>一个 Greek 数字至少叠加了数据、参数和结构三层不确定性；校准吻合并不能消除其中任何一层。</h2>
        <div className="table-scroll" role="region" aria-label="期权模型风险三层来源与检查，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">数据、参数和模型结构不确定性及验证方法</caption>
            <thead><tr><th scope="col">层级</th><th scope="col">来源</th><th scope="col">最小检查</th><th scope="col">不能声称</th></tr></thead>
            <tbody>
              <tr><th scope="row">Data risk</th><td>stale quote、spread、股息、curve、corporate action</td><td>时间同步、bid/ask、规则版本、异常码</td><td>mid 是可成交真值</td></tr>
              <tr><th scope="row">Parameter risk</th><td>surface fit、solver、interpolation、regularization</td><td>bump、bootstrap、替代参数化与 out-of-sample</td><td>唯一参数集被识别</td></tr>
              <tr><th scope="row">Structural risk</th><td>diffusion/jump、surface dynamics、exercise model</td><td>多模型 full repricing、stress、hedge backtest</td><td>拟合好即机制正确</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Cont 的框架把“同一 liquid benchmark 上校准成功、其他 claim 定价却分歧”视为模型风险的可测量来源。最稳健的报告不是给一个假装精确的 Delta，而是给 base-model Greek、输入版本、替代模型区间、关键 stress 和 residual P&amp;L。对 vanilla 可以依赖强无套利锚；越往 path-dependent、barrier、long-dated 与 illiquid strikes 走，结构选择越成为价格的一部分。<Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="data-protocol">
        <p className="section-kicker">45 · 可审计数据协议</p>
        <h2>一条 IV/Greek 记录若不能重建原 option price，就不是研究数据，而只是供应商给出的不可审计标签。</h2>
        <div className="learning-objectives">
          <span>每条计算记录的最小 schema</span>
          <ol>
            <li><b>Contract key：</b>underlying、series、K、expiry timestamp、style、settlement、multiplier、currency。</li>
            <li><b>Market state：</b>option bid/ask、underlying bid/ask、forward、timestamps、depth 与 trading status。</li>
            <li><b>Carry state：</b>discount curve、funding convention、dividend schedule、borrow 与 day-count。</li>
            <li><b>Model state：</b>pricer family/version、surface snapshot、exercise treatment、interpolation/extrapolation。</li>
            <li><b>Numerical state：</b>solver、bracket、tolerance、iterations、residual、finite-difference bump 与 error code。</li>
            <li><b>Outputs：</b>price reproduction、IV bid/mid/ask、per-unit Greeks、portfolio units 与 scenario revaluation。</li>
          </ol>
        </div>
        <p>
          研究管线应先在 price space 做 bounds、monotonicity、convexity 与 parity 检查，再反演 IV；不要先删除“看起来太高”的 tail IV，因为高值可能只是低 Vega 的坐标放大，也可能是 stale quote。Cboe 的 Greeks 数据产品明确提供模型化输出，OCC 与交易所规格则提供合约事实；二者必须在同一 effective date 上连接。所有 current rules 还应保存抓取日期，因为 multiplier、settlement 与 trading hours 可更新。<Cite n={2} /><Cite n={17} />
        </p>
      </section>

      <section className="lesson-section" id="research">
        <p className="section-kicker">46 · 可证伪研究设计</p>
        <h2>“Greeks 影响市场”不是可检验命题；研究必须冻结一种局部暴露、一个外生变化和一条能被反驳的传导箭头。</h2>
        <p>
          一个合格问题可以是：在同一 underlying、forward-moneyness 与 maturity bucket 内，预定的 expiry/calendar 变化是否使低 Vega、高 Gamma 合约的 quote adjustment、spread 或 full-repricing error 相对对照组发生方向一致变化？另一个问题是：替换 dividend forecast 或 exercise model 后，American option 的 IV/Delta revision 是否集中在 ex-date 前、深度 ITM 区域。结果变量要同时包含 price residual、IV interval、Greek attribution error 与执行宽度，而不是只回归 vendor mid IV。<Cite n={26} /><Cite n={28} />
        </p>
        <p>
          识别必须区分四条竞争链：合同/时钟变化先改变结算对象；quote liquidity 改变 mid 与 IV 映射；surface regime 改变有效 Delta；真实 jump 又会同时扩大 residual 与 spread。预注册应冻结 model version、quote filters、moneyness coordinate、event clock、hedge schedule、placebo expiry 和 alternative surface dynamics。结论只能写成局部条件式，例如“在这些产品与模型下，near-expiry local-Greek error 增大”，不能从中跳到“0DTE 一定导致市场波动”。<Cite n={5} /><Cite n={35} /><Cite n={40} />
        </p>
        <div className="precision-note"><span>世界观与研究问题的分界</span><p>完整世界观允许合同、复制、dealer、客户、曲面、资金和市场深度形成反馈；具体研究只选择其中一条箭头，并把其余机制变成对照、测量或明确边界。复杂不是放弃证伪的理由。</p></div>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">47 · 互动实验</p>
        <h2>Mode A 先辨认合同、payoff、parity 与复制；Mode B 再检验局部 Greeks、IV solver、曲面动态和到期账户状态。</h2>
        <p>
          八个冻结情境刻意把常见误讲变成可观察冲突：合约乘数换算、ITM 却亏损、put–call parity、一步二叉树复制、Greek 局部 P&amp;L、ATM BSM IV 反演、sticky surface，以及 European 现金结算与 American 股息提前行权。必须先选择再揭示计算与机制；完成记录只在当前页面持续打开时保留，刷新或离开后重新载入会清空，也不构成交易建议。
        </p>
        <OptionGreeksLab />
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">48 · 主动练习与理解检查</p>
        <h2>六道可复算练习检验合同、复制、单位和曲面；十个诊断问题检验你能否在公式失效时回到正确层级。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · ITM 不等于盈利</span><p>买入 2 张 K=105 call，premium 3.20、multiplier 100。若 S<sub>T</sub>=107，求 moneyness、payoff、忽略融资费用的 profit 与到期 break-even。</p><details className="practice-answer"><summary>展开核对答案</summary><p>Call 为 ITM；总 payoff=2×100×(107−105)=400。Premium cost=640，profit=−240。到期 break-even=105+3.20=108.20。价内只说明 payoff&gt;0。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 离散股息 parity</span><p>S₀=100、K=100、T=0.5、连续 r=5%；t=0.25 支付确定股息 1，European call C=7。求 parity put。</p><details className="practice-answer"><summary>展开核对答案</summary><p>PV(dividend)=e^(−0.05×0.25)=0.987578；PV(K)=100e^(−0.05×0.5)=97.530991。P=C−S₀+PV(dividend)+PV(K)=5.518569。观察 put mid=5.70 仍需 bid/ask、融资和借券后才能判断执行偏离。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 一步复制</span><p>S₀=100、u=1.2、d=0.8、K=100、r=5%、q=0、Δt=1。求 call 的 Delta、bond B、V₀ 与 p*，并说明 p* 的含义。</p><details className="practice-answer"><summary>展开核对答案</summary><p>V_u=20、V_d=0；Delta=20/(120−80)=0.5；B=e^(−0.05)(0−0.5×80)=−38.049177；V₀=11.950823；p*=(e^0.05−0.8)/0.4=0.628178。p* 是复制价格的定价权重，不是现实上涨预测。</p></details></article>
          <article className="practice-problem"><span>练习 04 · Greek P&amp;L 与单位</span><p>每单位 Delta=0.54、Gamma=0.032/元、Vega=0.12/vol point、Theta=−0.04/天、Rho=0.08/100bp；10 张、乘数 100。一天 ΔS=+2、IV −3 vol points、r +25bp。求截断 P&amp;L。</p><details className="practice-answer"><summary>展开核对答案</summary><p>每单位=0.54×2+0.5×0.032×4+0.12×(−3)−0.04+0.08×0.25=0.764；组合=0.764×100×10=764。遗漏 vanna、volga、surface motion、Greek 重算、spread 与 jump。</p></details></article>
          <article className="practice-problem"><span>练习 05 · IV 区间</span><p>S=K=100、r=q=0、T=1，call bid/ask=7.80/8.10。已知 ATM 公式 C=100[2N(σ/2)−1]，写出应报告的 IV。</p><details className="practice-answer"><summary>展开核对答案</summary><p>分别反演 bid 与 ask，约为 19.5829% 与 20.3387%，所以应报告 IV interval≈[19.5829%,20.3387%]，并附模型与输入。Mid 对应约 19.9608%，不是唯一“市场真值”。</p></details></article>
          <article className="practice-problem"><span>练习 06 · Total-variance 区间斜率</span><p>同一 ATM-forward coordinate，T₁=0.25 年 IV=30%，T₂=1 年 IV=24%。求 w₁、w₂、implied-total-variance 的区间斜率及其平方根，并判断 annualized IV 倒挂是否自动套利。</p><details className="practice-answer"><summary>展开核对答案</summary><p>w₁=0.30²×0.25=0.0225；w₂=0.24²×1=0.0576；区间斜率=(0.0576−0.0225)/0.75=0.0468；平方根约 21.6333%。Total implied variance 仍增加，annualized IV 倒挂本身不是 calendar arbitrage；该差商不是 model-free variance forward，也不是未来 realized variance 的 Q/P 预测。</p></details></article>
        </div>
        <div className="check-grid">
          <details><summary>01 · 为什么 ITM 不等于盈利？</summary><p>ITM 只比较标的与 strike；profit 还要扣 premium、融资、费用和税，并把现金流放到同一时点。</p></details>
          <details><summary>02 · American 为什么不应被理解成“尽早行权”？</summary><p>额外的是选择权；每个时点都要比较立即行权与继续持有价值。未行权保留凸性和时间选择。</p></details>
          <details><summary>03 · p* 为什么不是现实概率？</summary><p>它是使含股息总回报或自融资 gains process 折现后为鞅、让复制成本写成期望的 Q 测度权重；连续股息率下，除息 spot 的 Q 漂移为 r−q。Physical probability 还含风险溢价。</p></details>
          <details><summary>04 · Delta 为什么不是普遍 ITM 概率？</summary><p>BSM call Delta 与 Q 下价内概率分别涉及 d₁、d₂，且股息与 convention 会改变 Delta；二者定义不同。</p></details>
          <details><summary>05 · Vega 为何最容易错 100 倍？</summary><p>数学 Vega 常对 σ 小数变化 1.00，desk Vega 常对 1 vol point=0.01；必须先统一单位。</p></details>
          <details><summary>06 · IV 为什么不是直接观测？</summary><p>它是 market premium 在指定 pricer、carry、exercise 与 solver 下的反演根；输入或模型改变，IV 就会改变。</p></details>
          <details><summary>07 · 长期 IV 低于短期为何不必套利？</summary><p>无套利检查针对价格或可比 coordinate 的 total variance；annualized volatility 可以因近期事件集中而倒挂。</p></details>
          <details><summary>08 · Sticky rule 为什么会改变有效 Delta？</summary><p>若 spot move 同时使 fixed-strike IV 移动，总导数还含 Vega×∂IV/∂S；不同 surface dynamics 给不同项。</p></details>
          <details><summary>09 · 0DTE 高 Gamma 是否意味着高 Vega？</summary><p>不是。BSM ATM 附近 Gamma 约按 1/√τ 集中，而 Vega 约按 √τ 缩小；两者对应不同导数。</p></details>
          <details><summary>10 · 为什么校准好仍有 model risk？</summary><p>多个模型可匹配同一 liquid surface，却对路径、动态、illiquid claim 和 hedge 给不同结果；拟合不是结构识别。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">49 · 课程接口与结课诊断</p>
        <h2>本节输出的是“合同—复制—局部风险—曲面—边界”语言；下一节才把这些暴露变成实际对冲订单与市场反馈。</h2>
        <div className="interface-grid">
          <article><span>← T07</span><h3>合约最小基础</h3><p>输入 option 是一项法律现金流而非价格图形；本节补足行权、分配、结算和乘数。</p></article>
          <article><span>← 1.22</span><h3>Forward 与 carry</h3><p>输入 prepaid forward、贴现、股息与可执行边；构成 parity 和 BSM 的公平锚。</p></article>
          <article><span>→ 1.24</span><h3>Delta / Gamma Hedging</h3><p>输出局部 Greeks、position units、离散误差和 full repricing；下一节加入 dealer 仓位与订单反馈。</p></article>
          <article><span>→ 2.14</span><h3>Options / Volatility Trader</h3><p>输出 Vega、Theta、surface 与 model-risk 语言，供策略目标、约束和损益账本使用。</p></article>
          <article><span>→ 4.18</span><h3>IV、VIX 与风险溢价</h3><p>输出 IV 是模型反演、Q density 不等于 P forecast；后续再讨论 variance replication 与 risk premium。</p></article>
          <article><span>→ 7.24</span><h3>Measurement：Volatility、Liquidity、Flow 与 Position</h3><p>输出合同、曲面、跳跃和反馈接口，供复杂系统层组合多主体与多尺度状态。</p></article>
        </div>
        <p className="closing-thesis">
          面对一张期权链，先不要从 Delta 或 IV 开始。先确认 underlying、strike、expiry、multiplier、exercise、settlement 与 margin style；画出 buyer 的权利、writer 的义务，分开 payoff、premium、value、intrinsic 和 profit。只有 claim 对齐，put–call parity、上下界和复制才有意义。
          <br /><br />
          接着从一步二叉树理解 Delta 是复制数量、p* 是定价权重，再把 BSM 当作连续扩散基准。Greeks 是同一 price function 的局部偏导：先统一单位、方向、乘数与曲面 convention，再用截断 P&amp;L 解释小变化，并用 finite difference、full repricing 和 stress 检查误差。任何单个 Greek 都不是概率、保证或大行情答案。
          <br /><br />
          最后把 IV 视为由可成交 premium 在指定模型下反演出的区间；用 forward moneyness 和 total variance 组织 surface，检查 butterfly/calendar static arbitrage，并明确 sticky dynamics、American exercise、0DTE、assignment、jump 和 model risk。做到这一步，期权不再是一组神秘符号，而成为一项可以逐状态复制、逐输入审计、逐边界证伪的非线性合同。
        </p>
      </section>
    </>
  );
}

export const lesson123: LessonRecord = {
  slug: '1-23',
  id: '1.23',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: '期权价格与 Greeks 的市场含义',
  subtitle: '从权利义务、状态支付、无套利复制与 BSM 基准出发，建立 Delta、Gamma、Vega、Theta、Rho、隐含波动率曲面及模型失效边界的统一风险语言',
  readingTime: '主线首读约 90–105 分钟；零背景完整学习建议分两次，共约 155–185 分钟（含互动实验与练习；参考文献和延伸阅读不计）',
  prerequisite: 'T07 · Bond / Equity / Futures / Options 最小基础；建议回看 1.22 · Futures Basis 与 Cash–Futures Arbitrage',
  updatedAt: '2026-08-29',
  revision: '1.23-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.23-r1',
      summary: '首轮逐项复算确认主要公式、算例、41 条来源和八个互动情境准确；要求补严含股息复制与风险中性鞅的条件、IV 有限正根的严格内点、ATM total-variance 差商的证据边界，并修正可执行 parity 引文、实验描述和 7.24 接口。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.23-r1',
      summary: '首轮教学审阅确认整体因果主线、双轮学习结构、互动与练习可用；要求补足 realized volatility、风险中性、全量重估等零背景桥，展开产品和机构术语，修正上界直觉、IV 区间措辞、页面状态说明与互动进度文字对比度，并拆分四条实务延伸阅读。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.23-r2',
      summary: '回归终审确认 r1 的全部教学整改闭合；仅要求首次定义二叉树价格倍数 u、d，并将合约张数改用小写 n，以免与 BSM 标准正态累计分布 N(·) 发生出版级符号冲突。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.23-r2',
      summary: '回归终审确认正文公式、数值、引文、规则、互动与练习整体成立；要求在互动二叉树同步冻结 q=0，澄清确定性负利率仍可直接进入 European 边界，并将临近到期的 Theta 表述修正为绝对值可能增大。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.23-r3',
      summary: '封存终审确认 50 个单元的零基础认知坡度、风险中性与全量重估桥、符号账本、双轮学习时长、22 张阅读卡、六道隐藏答案练习、十项诊断、八题状态机、可访问性与跨课接口均达到出版要求。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.23-r3',
      summary: '封存终审确认 41 条来源与 120 个引文位置、全部公式和数值、含股息复制与 Q/P 测度、IV 根与曲面边界、现行产品规则、八个互动、六道练习及所有课程接口准确无误。',
    },
  ],
  previous: { slug: '1-22', label: '1.22 Futures Basis 与 Cash–Futures Arbitrage' },
  next: { slug: '1-24', label: '1.24 Delta / Gamma Hedging 的反馈机制' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-map', label: '完整因果回路' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'option-claim', label: 'Option Claim' },
    { id: 'payoff-profit', label: 'Payoff 与 Profit' },
    { id: 'contract-anatomy', label: 'Contract Anatomy' },
    { id: 'underlying-styles', label: 'Underlying 与 Style' },
    { id: 'settlement-margin', label: 'Exercise 与 Settlement' },
    { id: 'moneyness-value', label: 'Moneyness 与 Value' },
    { id: 'bounds', label: 'No-arbitrage Bounds' },
    { id: 'prepaid-forward', label: 'Prepaid Forward' },
    { id: 'put-call-parity', label: 'Put–call Parity' },
    { id: 'executable-parity', label: '可执行 Parity' },
    { id: 'one-step-binomial', label: '一步二叉树' },
    { id: 'risk-neutral-weight', label: 'Risk-neutral Weight' },
    { id: 'multi-step-american', label: 'American Recursion' },
    { id: 'bsm-bridge', label: 'BSM 复制桥' },
    { id: 'bsm-formula', label: 'BSM Formula' },
    { id: 'bsm-assumptions', label: 'Assumption Ledger' },
    { id: 'dividends-early-exercise', label: '股息与提前行权' },
    { id: 'pricing-inputs', label: 'Pricing Inputs' },
    { id: 'greeks-definition', label: 'Greeks 偏导语言' },
    { id: 'delta', label: 'Delta' },
    { id: 'gamma', label: 'Gamma' },
    { id: 'vega', label: 'Vega' },
    { id: 'theta', label: 'Theta' },
    { id: 'rho', label: 'Rho' },
    { id: 'units-position', label: '单位与组合聚合' },
    { id: 'local-taylor', label: '局部 P&L' },
    { id: 'cross-greeks', label: 'Cross-Greeks' },
    { id: 'finite-difference', label: 'Finite Difference' },
    { id: 'implied-volatility', label: 'Implied Volatility' },
    { id: 'iv-solver', label: 'IV Solver' },
    { id: 'iv-interval', label: 'IV Interval' },
    { id: 'smile-skew', label: 'Smile 与 Skew' },
    { id: 'surface-coordinates', label: 'Surface Coordinates' },
    { id: 'term-total-variance', label: 'Term 与 Variance' },
    { id: 'static-arbitrage', label: 'Static Arbitrage' },
    { id: 'sticky-dynamics', label: 'Sticky Dynamics' },
    { id: 'risk-neutral-density', label: 'Q Density' },
    { id: 'model-families', label: '模型家族' },
    { id: 'zero-dte', label: '0DTE' },
    { id: 'expiry-assignment', label: 'Expiry 与 Pin Risk' },
    { id: 'jump-discrete-hedge', label: 'Jump 与离散对冲' },
    { id: 'model-risk', label: 'Model Risk' },
    { id: 'data-protocol', label: '数据协议' },
    { id: 'research', label: '研究设计' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice', label: '练习与检查' },
    { id: 'interfaces', label: '接口与诊断' },
  ],
  Content: Lesson123Content,
  references: [
    { id: 1, authors: 'The Options Clearing Corporation', year: '2024', accessedAt: '2026-08-29', title: 'Characteristics and Risks of Standardized Options', publication: 'Options Disclosure Document, June 2024', url: 'https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document', use: '支持 exchange-traded options 的权利义务、合约单位、exercise、assignment、settlement、moneyness 与风险披露；具体产品和后续更新以当日规则为准。' },
    { id: 2, authors: 'The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'OCC By-Laws and Rules', publication: 'Official Rules Landing Page; Chapters VIII and XVIII of the current consolidated rules', url: 'https://www.theocc.com/company-information/documents-and-archives/by-laws-and-rules', use: '支持 exercise notice、assignment 与到期 exercise-by-exception 行政程序；阈值不决定客户仓位必须行权，规则可能更新。' },
    { id: 3, authors: 'U.S. Securities and Exchange Commission, Office of Investor Education and Assistance', year: '2015; updated 2026', accessedAt: '2026-08-29', title: 'An Introduction to Options', publication: 'Investor Bulletin', url: 'https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-63', use: '提供 listed stock option 的 call/put、premium、moneyness 与盈亏入门；旧到期示例不能替代现行 OCC/交易所规格。' },
    { id: 4, authors: 'Cboe Exchange, Inc.', year: 'current', accessedAt: '2026-08-29', title: 'S&P 500 Index Options Product Specifications', publication: 'Official SPX/SPXW Contract Specifications', url: 'https://www.cboe.com/tradable-products/sp-500/spx-options/spx-specifications', use: '支持 SPX/SPXW multiplier、underlying、cash settlement、European exercise 及 AM/PM series 的交易与结算差异；参数须按 series 和当日规格核对。' },
    { id: 5, authors: 'Cboe Exchange, Inc.', year: 'current', accessedAt: '2026-08-29', title: '0DTE Trading Resources', publication: 'Official Product Education', url: 'https://www.cboe.com/tradable-products/0dte', use: '支持 0DTE 是当前交易日到期、合约可更早挂牌，以及临近到期 near-money 敏感性；营销性策略陈述不作为因果证据。' },
    { id: 6, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Fundamentals of Options on Futures', publication: 'Official Education', url: 'https://www.cmegroup.com/education/whitepapers/fundamentals-of-options-on-futures', use: '支持 futures option 的 underlying、premium、exercise style 与行权后期货仓位；历史示例不替代当前产品 rulebook。' },
    { id: 7, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'Options on Futures: The Exercise and Assignment Process', publication: 'Official Clearing Handbook', url: 'https://www.cmegroup.com/clearing/options-on-futures-the-exercise-and-assignment-process.html', use: '支持 long/short call-put 行权和分配后形成的 futures position、清算成员与时间表；具体产品规则优先。' },
    { id: 8, authors: 'CME Group', year: 'current', accessedAt: '2026-08-29', title: 'A Primer on Margining Styles for Options', publication: 'Official Clearing Education', url: 'https://www.cmegroup.com/education/articles-and-reports/a-primer-on-margining-styles-for-options', use: '区分 premium-paid-upfront equity-style 与逐日 settlement 的 futures-style margining，支持现金时序和利率效应边界。' },
    { id: 9, authors: 'FINRA & The Options Clearing Corporation Staff', year: '2020', accessedAt: '2026-08-29', title: 'Trading Options: Understanding Assignment', publication: 'FINRA Investor Education', url: 'https://syndication.finra.org/content/trading-options-understanding-assignment', use: '支持 American short option assignment、OCC 到 broker 的分配链及盘后变动可能留下意外股票仓位；具体规格仍以交易所为准。' },
    { id: 10, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Understanding Options Greeks', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/understanding-options-greeks', use: '支持 Delta、Gamma、Theta、Vega、Rho 是模型化 guideposts、由多个输入共同决定；教育性经验法不替代数学定义。' },
    { id: 11, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Delta', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/delta', use: '支持 Delta 作为 underlying 小幅变化的价格敏感度与 directional exposure；“概率代理”只可作限定 heuristic。' },
    { id: 12, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Gamma', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/gamma', use: '支持 Gamma 是 Delta 对 underlying 的变化率以及短期限 near-money 集中；实际结果仍依赖模型和有限变动。' },
    { id: 13, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Theta', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/theta', use: '支持 Theta 的时间敏感度与 per-day 报告，同时提醒 decay convention 并非全行业唯一。' },
    { id: 14, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Vega', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/vega', use: '支持 Vega 对 implied-volatility point 的敏感度与 IV 反演入口；IV 不是无模型预测。' },
    { id: 15, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Rho', publication: 'OIC Advanced Concepts', url: 'https://www.optionseducation.org/advancedconcepts/rho', use: '支持 Rho 的利率敏感度和 percentage-point convention；实际风险可涉及整条曲线。' },
    { id: 16, authors: 'Cboe Exchange, Inc.', year: 'current', accessedAt: '2026-08-29', title: 'Options Calculator', publication: 'Cboe Options Institute Tool', url: 'https://www.cboe.com/oi/tools/options_calculator/', use: '说明理论价格、IV 与 Greeks 需要模型输入并可由 premium 反演；计算器输出不是合约常数或交易建议。' },
    { id: 17, authors: 'Cboe DataShop', year: 'current', accessedAt: '2026-08-29', title: 'U.S. Options Trade-by-Trade Greeks', publication: 'Official Data Product Documentation', url: 'https://datashop.cboe.com/us-options-trade-by-trade-greeks', use: '支持实务 Greeks/IV 是带模型、利率、股息和 exercise treatment 的计算数据，要求保存版本与输入。' },
    { id: 18, authors: 'Hans R. Stoll', year: '1969', title: 'The Relationship Between Put and Call Option Prices', publication: 'Journal of Finance, 24(5), 801–824', url: 'https://doi.org/10.1111/j.1540-6261.1969.tb01694.x', use: '提供 put–call 关系的经典市场与复制分析；现代应用须加入 European、贴现、股息与执行报价条件。' },
    { id: 19, authors: 'Fischer Black & Myron Scholes', year: '1973', title: 'The Pricing of Options and Corporate Liabilities', publication: 'Journal of Political Economy, 81(3), 637–654', url: 'https://doi.org/10.1086/260062', use: '通过动态复制和无套利导出 European option 定价框架；连续交易、扩散和无摩擦假设限定现实外推。' },
    { id: 20, authors: 'Robert C. Merton', year: '1973', title: 'Theory of Rational Option Pricing', publication: 'Bell Journal of Economics and Management Science, 4(1), 141–183', url: 'https://doi.org/10.2307/3003143', use: '支持 option bounds、dividends、American properties 与理性定价；提前行权结论依赖具体融资和股息假设。' },
    { id: 21, authors: 'John C. Cox, Stephen A. Ross & Mark Rubinstein', year: '1979', title: 'Option Pricing: A Simplified Approach', publication: 'Journal of Financial Economics, 7(3), 229–263', url: 'https://doi.org/10.1016/0304-405X(79)90015-1', use: '提供离散复制、risk-neutral weight、backward induction、American exercise 与向 BSM 收敛的透明框架。' },
    { id: 22, authors: 'John C. Cox & Stephen A. Ross', year: '1976', title: 'The Valuation of Options for Alternative Stochastic Processes', publication: 'Journal of Financial Economics, 3(1–2), 145–166', url: 'https://doi.org/10.1016/0304-405X(76)90023-4', use: '支持不同资产过程下的风险中性定价思想；风险中性不等于投资者真实偏好或物理概率。' },
    { id: 23, authors: 'J. Michael Harrison & Stanley R. Pliska', year: '1981', title: 'Martingales and Stochastic Integrals in the Theory of Continuous Trading', publication: 'Stochastic Processes and their Applications, 11(3), 215–260', url: 'https://doi.org/10.1016/0304-4149(81)90026-0', use: '提供等价鞅测度、完备市场与 contingent-claim representation 的严格基础；不完备市场定价测度可不唯一。' },
    { id: 24, authors: 'John C. Hull', year: '2022', title: 'Options, Futures, and Other Derivatives, Global Edition, 11th ed.', publication: 'Pearson, Chapters 10–21 and 28', url: 'https://www.pearson.com/en-gb/subject-catalog/p/options-futures-and-other-derivatives-global-edition/P200000004519/9781292410654', use: '统一 option mechanics、bounds、binomial、BSM、Greeks、smile 与数值程序；教材 convention 不替代交易所规则。' },
    { id: 25, authors: 'Richard Roll', year: '1977', title: 'An Analytical Valuation Formula for Unprotected American Call Options on Stocks with Known Dividends', publication: 'Journal of Financial Economics, 5(2), 251–258', url: 'https://doi.org/10.1016/0304-405X(77)90021-6', use: '支持已知现金股息可使 American call 在 ex-date 前出现最优提前行权；并非只要 ITM 或有股息就应行权。' },
    { id: 26, authors: 'Robert E. Whaley', year: '1982', title: 'Valuation of American Call Options on Dividend-Paying Stocks: Empirical Tests', publication: 'Journal of Financial Economics, 10(1), 29–58', url: 'https://doi.org/10.1016/0304-405X(82)90029-0', use: '支持离散股息与 American early-exercise premium 的经验重要性；简单 spot-minus-PV-dividend 不是通用精确解。' },
    { id: 27, authors: 'Giovanni Barone-Adesi & Robert E. Whaley', year: '1987', title: 'Efficient Analytic Approximation of American Option Values', publication: 'Journal of Finance, 42(2), 301–320', url: 'https://doi.org/10.1111/j.1540-6261.1987.tb02569.x', use: '提供 American option early-exercise premium 的经典近似；精度须按参数与高精度数值基准验证。' },
    { id: 28, authors: 'Steven Manaster & Gary Koehler', year: '1982', title: 'The Calculation of Implied Variances from the Black–Scholes Model: A Note', publication: 'Journal of Finance, 37(1), 227–230', url: 'https://doi.org/10.1111/j.1540-6261.1982.tb01105.x', use: '支持 IV 存在唯一条件、迭代求解与错误初值风险；任意正 premium 不必都有有效正 IV。' },
    { id: 29, authors: 'Peter Jäckel', year: '2015', title: 'Let’s Be Rational', publication: 'Wilmott, 2015(75), 40–53', url: 'https://doi.org/10.1002/wilm.10395', use: '支持极端 moneyness 和价格边界附近的稳定 Black IV 反演；专用数值法不能无条件迁移到 American 或其他模型。' },
    { id: 30, authors: 'Douglas T. Breeden & Robert H. Litzenberger', year: '1978', title: 'Prices of State-Contingent Claims Implicit in Option Prices', publication: 'Journal of Business, 51(4), 621–651', url: 'https://doi.org/10.1086/296025', use: '支持 European call strike curvature 与风险中性 state-price density 的联系；需要平滑、无套利、正确 carry，恢复的不是物理密度。' },
    { id: 31, authors: 'Mark Rubinstein', year: '1994', title: 'Implied Binomial Trees', publication: 'Journal of Finance, 49(3), 771–818', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb00079.x', use: '支持从 European option prices 构造与 smile 一致的 implied risk-neutral tree；静态拟合不唯一决定未来 surface dynamics。' },
    { id: 32, authors: 'Bernard Dumas, Jeff Fleming & Robert E. Whaley', year: '1998', title: 'Implied Volatility Functions: Empirical Tests', publication: 'Journal of Finance, 53(6), 2059–2106', url: 'https://doi.org/10.1111/0022-1082.00083', use: '说明横截面/local-vol 拟合优良不保证样本外 pricing 与 hedging 优良；历史 SPX 样本限制外推。' },
    { id: 33, authors: 'Jim Gatheral & Antoine Jacquier', year: '2014', title: 'Arbitrage-Free SVI Volatility Surfaces', publication: 'Quantitative Finance, 14(1), 59–71', url: 'https://doi.org/10.1080/14697688.2013.819986', use: '支持用 total variance 参数化并同时排除 butterfly 与 calendar static arbitrage；平滑单期限 smile 不保证整张 surface 无套利。' },
    { id: 34, authors: 'Roger W. Lee', year: '2004', title: 'The Moment Formula for Implied Volatility at Extreme Strikes', publication: 'Mathematical Finance, 14(3), 469–480', url: 'https://doi.org/10.1111/j.0960-1627.2004.00200.x', use: '提供 extreme-strike IV wing 与风险中性矩的渐近约束；不是由少量噪声尾部报价外推整张曲面的万能公式。' },
    { id: 35, authors: 'Emanuel Derman', year: '1999', title: 'Regimes of Volatility: Some Observations on the Variation of S&P 500 Implied Volatilities', publication: 'Goldman Sachs Quantitative Strategies Research Notes; Risk, April 1999, 55–59', url: 'https://emanuelderman.com/wp-content/uploads/1999/03/risk-regimes_of_volatility.pdf', use: '区分 sticky-strike、sticky-delta 与其他 smile dynamics，并强调 regime 可变；sticky rule 不是市场定律。' },
    { id: 36, authors: 'Steven L. Heston', year: '1993', title: 'A Closed-Form Solution for Options with Stochastic Volatility with Applications to Bond and Currency Options', publication: 'Review of Financial Studies, 6(2), 327–343', url: 'https://doi.org/10.1093/rfs/6.2.327', use: '支持 stochastic variance 与 spot–variance correlation 生成 smile/skew；Heston 只是可能机制之一。' },
    { id: 37, authors: 'David S. Bates', year: '1996', title: 'Jumps and Stochastic Volatility: Exchange Rate Processes Implicit in Deutsche Mark Options', publication: 'Review of Financial Studies, 9(1), 69–107', url: 'https://doi.org/10.1093/rfs/9.1.69', use: '支持 jumps 与 stochastic volatility 共同影响 option-implied distributions；特定 FX 样本不能唯一识别所有市场机制。' },
    { id: 38, authors: 'Cboe Global Indices', year: 'current', accessedAt: '2026-08-29', title: 'Cboe Volatility Index Mathematics Methodology', publication: 'Official Index Methodology', url: 'https://cdn.cboe.com/api/global/us_indices/governance/Cboe_Volatility_Index_Mathematics_Methodology.pdf', use: '支持由跨 strike option prices 聚合 variance exposure 再年化为 volatility 的区别；VIX 复制与风险溢价留待 4.18。' },
    { id: 39, authors: 'Robert C. Merton', year: '1976', title: 'Option Pricing When Underlying Stock Returns Are Discontinuous', publication: 'Journal of Financial Economics, 3(1–2), 125–144', url: 'https://doi.org/10.1016/0304-405X(76)90022-2', use: '支持价格跳跃时 underlying 与 bond 的连续再平衡一般不能完整复制 option；提高 hedge 频率不能消除不可交易 gap。' },
    { id: 40, authors: 'Rama Cont', year: '2006', title: 'Model Uncertainty and Its Impact on the Pricing of Derivative Instruments', publication: 'Mathematical Finance, 16(3), 519–547', url: 'https://doi.org/10.1111/j.1467-9965.2006.00281.x', use: '支持多个校准模型对其他 claims 与 risks 给出不同结果，模型选择本身构成可测风险；小校准误差不等于小 model risk。' },
    { id: 41, authors: 'Options Industry Council / The Options Clearing Corporation', year: 'current', accessedAt: '2026-08-29', title: 'Options Glossary: Pin Risk', publication: 'OIC Reference Library', url: 'https://prd-web.optionseducation.org/referencelibrary/optionsglossary?filter=P', use: '支持实物交割 option 在标的接近 strike 时，writer 对最终 assignment 与次日仓位的不确定性；现金结算产品边界不同。' },
  ],
  readingList: [
    { title: 'Hull · Chapters 10, 11, 13, 15, 19–21', scope: '先读 mechanics 与 properties，再读 binomial、BSM、Greeks、smile 和 numerical procedures。', reason: '最适合把本节分散的合同、公式与实务 convention 串成统一教材路径。', url: 'https://www.pearson.com/en-gb/subject-catalog/p/options-futures-and-other-derivatives-global-edition/P200000004519/9781292410654' },
    { title: 'OCC · Options Disclosure Document', scope: '重点读合约单位、exercise/assignment、settlement、risks 与 adjustments。', reason: '先建立真实合同语言，防止用模型公式替代清算与账户事实。', url: 'https://www.theocc.com/company-information/documents-and-archives/options-disclosure-document' },
    { title: 'Stoll (1969) · Put–Call Relationship', scope: '精读同 strike/expiry call-put 关系及市场限制。', reason: '理解 parity 是状态复制而非经验相关。', url: 'https://doi.org/10.1111/j.1540-6261.1969.tb01694.x' },
    { title: 'Cox, Ross & Rubinstein (1979)', scope: '精读一步复制、risk-neutral weight、backward induction 与 American exercise。', reason: '这是从零背景进入现代期权定价最透明的原始论文。', url: 'https://doi.org/10.1016/0304-405X(79)90015-1' },
    { title: 'Black & Scholes (1973)', scope: '读复制组合、PDE 思路、公式与假设，不必首次就追全部技术细节。', reason: '理解期望收益率为何不进入复制价格，以及连续对冲假设从何而来。', url: 'https://doi.org/10.1086/260062' },
    { title: 'Merton (1973) · Rational Option Pricing', scope: '读 bounds、dividends、American properties 与 generalization。', reason: '补足只读 BSM closed form 时容易遗漏的无套利边界和提前行权条件。', url: 'https://doi.org/10.2307/3003143' },
    { title: 'OIC · Understanding Options Greeks', scope: '配合 Delta、Gamma、Theta、Vega、Rho 各页面核对 desk language。', reason: '连接数学偏导与实际报价界面，同时保留“理论 guidepost”边界。', url: 'https://www.optionseducation.org/advancedconcepts/understanding-options-greeks' },
    { title: 'Manaster & Koehler (1982)', scope: '读 IV 的存在、唯一性和迭代初值。', reason: '把“IV 是数字反演”从概念提升为可验证数值问题。', url: 'https://doi.org/10.1111/j.1540-6261.1982.tb01105.x' },
    { title: 'Jäckel (2015) · Let’s Be Rational', scope: '重点读极端价格、初值和稳定求解。', reason: '理解普通 Newton 在低 Vega 与浮点边界为何失灵。', url: 'https://doi.org/10.1002/wilm.10395' },
    { title: 'Breeden & Litzenberger (1978)', scope: '读 call price 对 strike 的导数与 state-price recovery。', reason: '建立 option surface、Q density 与现实概率之间的严格边界。', url: 'https://doi.org/10.1086/296025' },
    { title: 'Rubinstein (1994) · Implied Binomial Trees', scope: '读由 smile 恢复 state prices 与 implied tree 的思路。', reason: '看到静态曲面如何约束定价，却仍不唯一决定动态。', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb00079.x' },
    { title: 'Gatheral & Jacquier (2014)', scope: '读 total variance、SVI、butterfly 与 calendar no-arbitrage。', reason: '从“拟合曲线”进入可以发布的无静态套利曲面。', url: 'https://doi.org/10.1080/14697688.2013.819986' },
    { title: 'Derman (1999) · Regimes of Volatility', scope: '读 sticky-strike、sticky-delta 与 regime 切换。', reason: '理解 surface snapshot 不能决定 hedge dynamics。', url: 'https://emanuelderman.com/wp-content/uploads/1999/03/risk-regimes_of_volatility.pdf' },
    { title: 'Dumas, Fleming & Whaley (1998)', scope: '读 in-sample fit 与 out-of-sample pricing/hedging 比较。', reason: '防止把拟合优度当作模型机制正确。', url: 'https://doi.org/10.1111/0022-1082.00083' },
    { title: 'Heston (1993)', scope: '读 stochastic variance、correlation 与 option formula 的机制部分。', reason: '理解 skew 可由动态波动率机制生成。', url: 'https://doi.org/10.1093/rfs/6.2.327' },
    { title: 'Bates (1996)', scope: '读 jump 与 stochastic volatility 对 FX option distribution 的识别。', reason: '比较连续随机波动率和不连续 tail risk 的不同解释。', url: 'https://doi.org/10.1093/rfs/9.1.69' },
    { title: 'Merton (1976) · Discontinuous Returns', scope: '读 jump 到来时复制与 hedging 的变化。', reason: '明确提高再平衡频率为什么不能消除 gap risk。', url: 'https://doi.org/10.1016/0304-405X(76)90022-2' },
    { title: 'Cont (2006) · Model Uncertainty', scope: '读 calibration-compatible models 的价格与风险分歧。', reason: '把 model risk 从笼统免责声明变成可以比较的区间。', url: 'https://doi.org/10.1111/j.1467-9965.2006.00281.x' },
    { title: 'Cboe · SPX/SPXW Contract Specifications', scope: '核对 multiplier、cash settlement、European exercise 与 AM/PM series 差异。', reason: '把 Greeks 与到期风险重新接回具体指数合约。', url: 'https://www.cboe.com/tradable-products/sp-500/spx-options/spx-specifications' },
    { title: 'Cboe · 0DTE Trading Resources', scope: '核对 0DTE 的到期日定义、挂牌时点与 near-expiry 风险边界。', reason: '避免把“当日到期”误解成“当日才上市”或统一产品类别。', url: 'https://www.cboe.com/tradable-products/0dte' },
    { title: 'CME · Exercise and Assignment Process', scope: '核对 futures option 行权、分配和形成 underlying futures position 的流程。', reason: '避免把股票期权的实物交割直觉移植到期货期权。', url: 'https://www.cmegroup.com/clearing/options-on-futures-the-exercise-and-assignment-process.html' },
    { title: 'CME · Margining Styles for Options', scope: '比较 premium-paid-upfront 与 futures-style variation settlement 的现金时序。', reason: '理解相同 option value 为什么可以对应不同初始和逐日现金流。', url: 'https://www.cmegroup.com/education/articles-and-reports/a-primer-on-margining-styles-for-options' },
  ],
};
