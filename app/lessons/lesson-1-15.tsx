import VolumeVolatilityLab from '../components/VolumeVolatilityLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson115Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>成交量只记录有多少头寸调整被执行；波动率记录价格路径移动得多剧烈。二者经常由同一组潜在状态共同推高，但真正把交易活动转成价格变化的桥梁，是订单压力的方向与路径、当时的市场深度，以及主体在价格变化后产生的新一轮反应。</h2>
        <p>
          1.08 已经把 market order flow、signed trade flow 与 OFI 分开，1.09 又说明 causal price impact 必须固定反事实、时间和价格基准。本节处理一个更容易被图表语言误导的问题：为什么“放量”有时伴随信息进入和持续价格修正，有时却只是风险在交易者之间快速传递，甚至在最终持仓几乎没有变化时制造巨额 gross volume？Karpoff 的经典综述总结了量与价格变动幅度通常正相关的事实；但从 Clark、Epps–Epps 与 Tauchen–Pitts 开始的 mixture-of-distributions 传统，恰恰把这种关系解释为潜在信息或 business time 对二者的共同生成，而不是一条从 volume 指向 volatility 的机械因果箭头。<Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={6} />
        </p>
        <p>
          因而，本节对“放量”的默认判断不是确认趋势、看多或看空，而是先暂停归因：总成交量没有方向；每笔成交同时有买卖双方；相同 volume 可以来自很多小单或少数大单、持续单边压力或两侧交替、最终风险转移或中介循环。只有把异常活动、signed flow / OFI、depth、价格永久性和交易者终点持仓放进同一证据链，才能改变“信息进入”“异质解释”“流动性再平衡”或“波动反向触发交易”这些机制的相对可信度。即便价格发现贡献很低的换手，也可能完成套期保值或风险共享，所以“无意义”只能是对特定研究目标的限定描述，不能自动成为福利结论。<Cite n={1} /><Cite n={11} /><Cite n={12} />
        </p>
        <div className="learning-objectives">
          <span>完成本节后，你应当能够</span>
          <ol>
            <li>用一致单位区分 share volume、dollar volume、turnover、trade count、message volume、signed flow、OFI 与终点风险转移。</li>
            <li>区分累计收益、绝对收益、平方收益、realized variance 与 realized volatility，并说明采样和时钟边界。</li>
            <li>从潜在信息状态、顺序扩散、异质信念、流动性需求和市场深度解释量与波动怎样共同生成。</li>
            <li>用 r≈λ(state)·OFI+u 说明为什么相同成交量可以对应完全不同的价格路径。</li>
            <li>把同期相关、结构因果、增量预测和福利评价四种问题彻底分开。</li>
            <li>审计量价实证中的季节性、方向误判、机械恒等式、内生性、样本外泄漏与外推边界。</li>
          </ol>
        </div>
      </section>

      <section className="lesson-section" id="inference-map">
        <p className="section-kicker">01 · 先画完整系统</p>
        <h2>Volume 与 volatility 都是结果变量；在它们之前有状态、信念、约束、订单和流动性，在它们之后还有对冲、保证金、关注与风险控制反馈。</h2>
        <div className="mechanism-chain" aria-label="成交量与波动率的共同生成链">
          {[
            ['潜在状态', '公共/私人信息强度、信念分歧、现金与对冲需求、资金流、深度、融资和风险约束'],
            ['目标持仓', '主体把新信念、效用和约束映射为希望持有或转移的风险敞口'],
            ['订单与报价', '母单被拆分为主动成交、被动挂单、撤单、改价和跨市场 hedge'],
            ['市场活动', '形成无方向 gross volume、trade count、signed flow、OFI 与 message traffic'],
            ['价格路径', '订单压力经状态依赖的 depth / λ 被吸收，形成临时或永久价格移动'],
            ['反馈', '波动触发止损、Gamma hedge、margin、风险限额、注意力和新的订单'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条链包含三类方向。共同原因路径是 state→volume 与 state→volatility；交易传导路径是 signed pressure→liquidity response→price path；反馈路径是 volatility→新的交易与报价。任何只画 Q→σ 的图，都把至少两条路径删掉了。研究者真正需要回答的是：观察窗口内哪条路径占主导、变量是否在正确时钟上测量、以及所用证据能否排除其他路径。
        </p>
      </section>

      <section className="lesson-section" id="scope-contract">
        <p className="section-kicker">02 · 本节范围契约</p>
        <h2>本节解释无方向交易活动与无方向价格变动强度的关系，不把 order-flow 构造、price-impact 识别、日内制度或完整 volatility measurement 重写一遍。</h2>
        <div className="boundary-box">
          <b>输入、输出与暂缓展开</b>
          <p>从 1.08 输入主动方签名、signed flow 和 OFI 的含义，从 1.09 输入 r≈λ·OFI 这一局部价格形成接口；1.15 独占的问题是 gross activity 与 volatility 为何共同变化、总量为什么不足以归因，以及怎样识别信息、分歧、风险转移与反馈。开收盘、午间、集合竞价和 U 型聚集的完整机制留给 1.16；分歧怎样形成与传播留给 6.03；RV 采样、跳跃、噪声和系统化测量留给 7.24。</p>
        </div>
        <p>
          本节默认先研究一只证券在固定窗口内的二级市场交易，再说明跨证券、期货和事件证据为什么不能无条件外推。这里“波动率”若无特别说明，指价格变化强度而非期权隐含波动率；“成交量”若无特别说明，指已执行交易的单边 gross volume，而非新增、撤销和修改消息总数。
        </p>
      </section>

      <section className="lesson-section" id="trade-accounting">
        <p className="section-kicker">03 · 一笔成交的会计恒等式</p>
        <h2>每笔成交同时有买方和卖方，但标准交易所成交量通常把一次已撮合风险转移计一次；“买盘大于卖盘”不能按人数或股数的双边清算恒等式理解。</h2>
        <p>
          设窗口 t 内有 N<sub>t</sub> 笔成交，第 j 笔规模为 q<sub>j</sub>。标准单边股数成交量为 Q<sub>t</sub>=Σ<sub>j</sub>q<sub>j</sub>。买方获得 q 股、卖方失去 q 股，市场总持仓没有因为二级交易凭空增加；但这个事实不等于两侧的交易主动性、信息或紧迫程度相同。“Buyer-initiated”只表示主动方跨越卖价与 resting ask 成交，“seller-initiated”则相反，它们是逐笔角色分类，不是说市场里出现了没有卖方的买入。
        </p>
        <div className="equation-card">
          <span>标准单边成交量</span>
          <div>Q<sub>t</sub> = Σ<sub>j=1</sub><sup>Nₜ</sup> q<sub>j</sub></div>
          <p>单位是股、张或合约/窗口。若数据供应商采用双边计数、场内外合并、成交更正或特殊 trade condition，必须显式记录，不能把口径差异误作市场行为。</p>
        </div>
        <p>
          Lo–Wang 强调，volume 的经济含义取决于定义和组合层级。逐笔记录、单一 venue 报表、全市场 consolidated tape、基金自身成交额和经纪商客户流都可能被叫作“volume”，但它们不是同一个对象。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="share-dollar-turnover">
        <p className="section-kicker">04 · Share、Dollar 与 Turnover</p>
        <h2>股数成交量适合同一证券短期比较，成交金额便于描述资金规模，换手率才把活动相对可交易存量标准化；三者会被不同机械因素改变。</h2>
        <div className="table-scroll" role="region" aria-label="成交量口径比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先写单位、分母和时间，再谈“放量”</caption>
            <thead><tr><th scope="col">对象</th><th scope="col">公式与单位</th><th scope="col">适合回答</th><th scope="col">机械风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">Share / contract volume</th><td>Q=Σq；股或合约/窗口</td><td>同一证券执行了多少单位？</td><td>拆股、lot、合约乘数和 venue 覆盖</td></tr>
              <tr><th scope="row">Dollar volume</th><td>DV=Σpq；货币/窗口</td><td>成交名义金额有多大？</td><td>股价、通胀、汇率与衍生品 multiplier</td></tr>
              <tr><th scope="row">Share turnover</th><td>TO=Q/S；比例/窗口</td><td>相对发行或可交易存量换手多少？</td><td>总股本 vs free float、分母更新日</td></tr>
              <tr><th scope="row">Dollar turnover</th><td>DV/market cap；比例/窗口</td><td>名义交易相对市值多大？</td><td>价格同时进入分子分母、口径不可混称</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          例如公司 1 拆 2 后，在经济风险交换不变时股数成交量可能近似翻倍；股价翻倍也会让 dollar volume 上升，即使成交股数不变。换手率缓解了跨规模比较，却不能消除 free float 估计、借券、回购、增发和跨上市地合并问题。期货还需把成交量与 open interest 分开：前者是期间流量，后者是期末未平仓存量。
        </p>
      </section>

      <section className="lesson-section" id="trade-count-size">
        <p className="section-kicker">05 · Trade Count 与 Average Size</p>
        <h2>同一总量可能来自许多小成交或少数大成交；Q=N·q̄ 是恒等式，不是三项可独立放进模型并分别解释的原因。</h2>
        <div className="equation-card">
          <span>活动的最小乘法分解</span>
          <div>Q<sub>t</sub> = N<sub>t</sub> · q̄<sub>t</sub>　，　q̄<sub>t</sub> = Q<sub>t</sub> / N<sub>t</sub></div>
          <p>N 的单位是笔/窗口；只有 N&gt;0 时，q̄=Q/N 才定义且单位为股/笔。Q、N 与 q̄ 存在机械依赖，系数会对参数化方式敏感；若同时放入 log Q、log N 与 log q̄，更会出现精确线性共线。可改为比较 log N 与 log q̄，或按预先固定的 size bins 统计笔数。</p>
        </div>
        <p>
          交易笔数也不是“信息事件数”。一张机构母单可被算法拆成数千个 child orders；一次订单可与多个 resting orders 撮合并形成多条 print；不同 tick、lot、撮合和报告规则会改变 N。平均成交规模更不等于交易者财富或知情程度，因为同一主体会策略性拆单，匿名簿中也无法从单笔规模还原最终投资意图。Jones–Kaul–Lipson 与后续 Chan–Fong 的分歧，正说明分解结果依赖市场制度、波动指标和交易分类。<Cite n={17} /><Cite n={18} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="message-versus-execution">
        <p className="section-kicker">06 · Message Volume 不是 Trading Volume</p>
        <h2>订单新增、取消、修改和执行都能让市场数据“很忙”，但只有 execution 形成成交量；报价可在没有成交时完成价格更新。</h2>
        <div className="equation-card">
          <span>消息活动的一个显式口径</span>
          <div>M<sub>t</sub> = N<sup>add</sup><sub>t</sub> + N<sup>cancel</sup><sub>t</sub> + N<sup>modify</sup><sub>t</sub> + N<sup>execute</sup><sub>t</sub></div>
          <p>M 的单位是消息/窗口。不同 feed 会把 replace 编成 cancel+add，也可能把一次撮合拆成多条 execution，因此必须先重建数据字典。</p>
        </div>
        <p>
          公共新闻到来时，做市商可能先取消 stale quotes，再在新价值附近提交 bid 和 ask；BBO 已经跳变，第一笔成交稍后才发生。此时信息先进入可交易报价，volatility 可以高而 executed volume 很低。反过来，大量 cancel / replace 若围绕同一价格更新，message volume 可以极高，却没有任何成交或终点风险转移。把 M、Q 与 quote revision 混成一个“活跃度”指标，会把价格发现渠道和风险交换渠道压成同一件事。
        </p>
      </section>

      <section className="lesson-section" id="signed-flow-ofi">
        <p className="section-kicker">07 · Unsigned Volume、Signed Flow 与 OFI</p>
        <h2>总量回答“执行了多少”，signed flow 回答主动压力偏向哪一侧，OFI 进一步纳入未成交报价的新增、撤回和价格变化；三者不能互换。</h2>
        <div className="equation-card">
          <span>已成交记录上的方向分解</span>
          <div>SF<sub>t</sub> = Σ<sub>j</sub> ε<sub>j</sub>q<sub>j</sub>　，　TI<sub>t</sub> = SF<sub>t</sub> / Q<sub>t</sub> ∈ [−1,1]</div>
          <p>ε=+1 表示主动买、−1 表示主动卖。SF 不是市场整体净持仓，因为每笔成交仍有对手方；TI 只有在 Q&gt;0 时定义。若部分成交无法可靠签名，必须说明它们是否只进入 Q 的分母、被剔除，或另作 unknown 类，并做敏感性检验。</p>
        </div>
        <p>
          OFI 通常综合 best bid/ask 价格和数量的 add、cancel 与 execution。它可以在成交很少时因一侧撤单而变得极端，也可能在高成交量窗口中接近零。Cont–Kukanov–Stoikov 在 2010 年 4 月 50 只 S&amp;P 500 股票的 TAQ best-quote 数据上发现，短窗口中间价变化与 OFI 的线性关系比传统成交量更稳定，冲击斜率与平均深度近似反向变化；但 OFI 与报价变化在同一事件序列中内生形成，同期高 R² 不是预测力或外生因果。<Cite n={16} /> 具体签名算法、队列事件和误差已在 1.08 处理，本节只继承其结果。
        </p>
      </section>

      <section className="lesson-section" id="end-risk-transfer">
        <p className="section-kicker">08 · Gross Volume 与终点风险转移</p>
        <h2>高成交量可能是同一库存被反复传递；要判断是否完成实质性风险重配，必须观察参与者组的终点持仓变化，而不是把所有中间成交相加。</h2>
        <p>
          在不含发行、回购和到期转换的单一证券二级市场，所有主体持仓变化满足 Σ<sub>i</sub>Δx<sub>i,t</sub>=0。这个清算恒等式不表示“没有风险转移”，而是卖方减少的风险由买方承接。若账户被划入互斥且穷尽全部对手方的参与者组 g，并以同一证券的股数或合约数计量，组别变化仍满足 Σ<sub>g</sub>ΔX<sub>g,t</sub>=0，此时可用下式描述窗口终点的 gross reallocation：
        </p>
        <div className="equation-card">
          <span>终点组间风险重配</span>
          <div>GRT<sup>end</sup><sub>t</sub> = ½ Σ<sub>g</sub> |ΔX<sub>g,t</sub>|</div>
          <p>在组别穷尽、互斥且总变化为零时，½ 才能避免把同一转移在减少方与增加方各计一次，基准单位是股或合约。用共同冻结价格把股数线性换成金额仍可保持该恒等式；Delta、久期或因子暴露只有在冻结共同线性权重、包含所有 legs 且验证总变化为零后才能沿用。否则只能报告 endpoint L1 exposure change，不能把 ½ 解释成已转移风险。</p>
        </div>
        <p>
          若 A 向 B 卖出 q 股，B 转给 C，C 又卖回 A，三次成交都进入 Q=3q，各方终点持仓却回到起点，GRT<sup>end</sup>=0。这类与 hot-potato trading 相容的路径并非必然“无经济作用”：它可能是在寻找愿意永久承接风险的资产负债表，也会暴露库存容量和交易成本；但仅凭低 GRT 不能诊断循环，因为组内迁移或彼此抵消的独立重配也会产生低值。研究应联合报告 (Q,GRT<sup>end</sup>)、主体路径、峰值库存、depth 与价格恢复；若 Q&gt;0，可再报有界的 GRT<sup>end</sup>/Q，而 Q/GRT 在 GRT=0 时无定义、接近零时也不稳定。
        </p>
      </section>

      <section className="lesson-section" id="volatility-ledger">
        <p className="section-kicker">09 · Volatility 的测量账本</p>
        <h2>累计收益只比较窗口起终点，realized variance 把沿途每段价格变化平方后相加；绝对收益、平方收益、RV 与 √RV 的单位和噪声不同。</h2>
        <div className="table-scroll" role="region" aria-label="波动测量口径比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一个“波动”词可能指向四个不同对象</caption>
            <thead><tr><th scope="col">指标</th><th scope="col">定义</th><th scope="col">单位</th><th scope="col">主要边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">Return</th><td>R=log P<sub>end</sub>−log P<sub>start</sub></td><td>对数收益</td><td>相反路径可在终点抵消</td></tr>
              <tr><th scope="row">Absolute return</th><td>|R|</td><td>对数收益绝对值</td><td>早期日频粗代理，单日很噪</td></tr>
              <tr><th scope="row">Squared return</th><td>R²</td><td>平方对数收益</td><td>仍只用一个起终点变化</td></tr>
              <tr><th scope="row">Realized variance</th><td>RV=Σ<sub>k=1</sub><sup>K</sup>r<sub>k</sub>²</td><td>平方对数收益</td><td>采样太密会受 bid–ask bounce 与噪声污染</td></tr>
              <tr><th scope="row">Realized volatility</th><td>√RV</td><td>对数收益</td><td>不能把其系数与 RV 回归系数混读</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          高频 RV 应优先使用 midquote 或经噪声处理的价格，避免把成交价在 bid 与 ask 间来回跳误作经济波动。5 分钟采样并非普遍最优，只是常见折衷；低流动性资产、夜盘、集合竞价和跳跃需要不同处理。这里冻结最小含义，完整采样、continuous/jump 分解和 estimator 选择留给 7.24。Chan–Fong 以 realized volatility 重新检验旧日绝对收益结果，正说明测量对象改变会改变“谁解释波动”的经验答案。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="clocks-horizons">
        <p className="section-kicker">10 · Calendar、Trade 与 Event Clock</p>
        <h2>把每五分钟、每 100 笔成交和每 1,000 条消息的窗口混在一起，会把“市场更忙”机械变成样本长度变化；量价关系必须绑定时钟与 horizon。</h2>
        <p>
          Calendar time 固定真实时间，适合研究投资者在一分钟或一天承受的风险；trade time 固定成交笔数，主动把活跃时段展开、安静时段压缩；event time 则逐条跟踪 add、cancel、trade 或 quote change。若每 100 笔成交计算一次 RV，活跃时这些窗口对应更短的自然时间，不能直接与每五分钟波动系数比较。Dufour–Engle 说明交易间隔、signed trade persistence 与价格调整速度共同变化，持续时间本身是市场状态的一部分。<Cite n={20} />
        </p>
        <div className="boundary-box">
          <b>最小可复现声明</b>
          <p>任何结果必须同时写明：资产和 venue 覆盖；calendar/trade/event clock；窗口长度；成交量计数规则；价格基准；RV 采样频率；是否包含夜盘、集合竞价、停牌与跨日收益；变量是在窗口内同期构造、窗口开始已知，还是窗口结束后才可得。</p>
        </div>
      </section>

      <section className="lesson-section" id="four-inferences">
        <p className="section-kicker">11 · 四种推断不得互换</p>
        <h2>“一起发生”“谁先出现”“改变谁会怎样”和“对谁有益”是四个不同问题；同一组数据可以支持第一个，却完全无法回答后三个。</h2>
        <p>
          Estimand 是研究希望估计的精确数量，例如“给定历史信息后，异常量与同期 RV 的条件协方差”或“某项规则改变对未来十分钟 RV 的平均总效应”。Treatment 是被比较的明确处理或干预。因果记号 do(A=a) 的意思，是设想把行动 A 外生设成 a，同时切断原来使 A 与结果共同变化的原因；它不是把回归右侧变量随意加一单位。工具变量的 exclusion restriction（排除限制）则要求工具只经指定处理影响结果。把这些对象先写清，才能判断一项制度变化究竟识别什么。
        </p>
        <div className="table-scroll" role="region" aria-label="成交量与波动四种推断比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>先命名 estimand，再选择证据</caption>
            <thead><tr><th scope="col">推断</th><th scope="col">合法问题</th><th scope="col">最低证据</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">同期共同生成</th><td>高 Q 窗口是否也有高 RV？哪些状态共同生成二者？</td><td>一致单位、去季节性、条件相关和机制分层</td><td>Q 导致 RV</td></tr>
              <tr><th scope="row">动态预测</th><td>给定当前信息集，Q 的过去值能否降低未来 RV 的预测损失？</td><td>真实时间顺序、强基准、滚动样本外和不确定性</td><td>可干预的经济因果</td></tr>
              <tr><th scope="row">结构因果</th><td>某个明确干预怎样通过订单、深度与执行改变价格路径？</td><td>随机化、可信自然实验或明确结构限制</td><td>存在一个唯一的 do(volume)</td></tr>
              <tr><th scope="row">福利</th><td>交易是否改善风险共享与价格效率，收益是否超过成本和外部性？</td><td>参与者、反事实配置、真实资源成本与分配结果</td><td>高量、高波动自动好或坏</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          “把 volume 提高 10%”并不是完整干预：可以让每张母单拆得更碎、让更多独立投资者交易、增加双边循环、制造单向净需求，或降低 fees 使流动性供求双方同时活跃。这些操作对 N、q̄、OFI、depth 与 welfare 的影响不同。Tick、fee 或 lot reform 也通常直接改变 queue、spread、拆单和做市，因此一般不满足“只通过 volume 影响 volatility”的排除限制。
        </p>
      </section>

      <section className="lesson-section" id="latent-state">
        <p className="section-kicker">12 · Mixture-of-Distributions 的直觉</p>
        <h2>市场不是按钟表均匀产生价格创新：有时一分钟几乎没有新状态，有时一分钟容纳许多信息、分歧和再平衡；潜在“业务时间”会同时加快成交和价格变化。</h2>
        <p>
          Mixture-of-Distributions Hypothesis（MDH，混合分布假说）指的是：价格变化和成交量各自的观测分布，都是许多不同潜在活动状态下条件分布的混合。Clark 把投机价格写成以随机交易或信息过程为时钟的 subordinated process，即价格过程沿一个快慢变化的经济时钟运行；Epps–Epps 又把价格变化与成交量的联合分布连接到共同 mixing variable；Tauchen–Pitts 则在均衡框架中同时处理价格变动与成交量。其共同思想不是“每一股成交推动一单位波动”，而是日历上的相同五分钟可能包含不同数量的经济事件。<Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <div className="equation-card">
          <span>随机业务时间的教学表示</span>
          <div>R<sub>t</sub> = Σ<sub>j=1</sub><sup>Iₜ</sup> ξ<sub>j</sub>　，　E(ξ<sub>j</sub>)=0　，　Var(ξ<sub>j</sub>)=σ²<sub>ξ</sub></div>
          <p>R<sub>t</sub> 是窗口 t 的累计对数收益；教学式把 I<sub>t</sub> 写成非负整数个有效事件，j 为其中第 j 个事件，ξ<sub>j</sub> 是该事件贡献的对数收益创新。E(·) 是期望算子，E(ξ)=0 表示单个创新没有预设方向；Var(·) 是方差算子，σ²<sub>ξ</sub> 是单个创新的方差。若各 ξ 在给定 I 时条件独立，则 Var(R|I)=σ²<sub>ξ</sub>I；业务时钟越快，条件方差越大。</p>
        </div>
        <p>
          若 Q≈μ<sub>Q</sub>I+η、μ<sub>Q</sub>&gt;0，且测量噪声 η 不随 I 或价格创新系统变化，Q 只是 I 的带噪代理，那么 Q 与 R² 才会在这一简化设定中正相关，即使不存在 Q→R² 的结构箭头。Andersen 在允许信息不对称、流动性需求和成交量噪声后，比标准 MDH 获得更好的拟合；这更像是在提醒“volume 不是纯信息仪”，而不是证明一个唯一潜变量已经被观测。<Cite n={5} />
        </p>
        <p>
          Kyle 模型中的 noise orders 让知情者可以隐藏在聚合订单流中，做市商只能从总流量推断信息；Black 则强调，noise 既让市场持续交易，也使价格和交易活动成为带噪观测。这里“noise”不是对交易者智力的评价，而是说这类订单的动机不能被做市商直接读成资产价值。它们解释了 η 为什么可能很大，也解释了 volume 为什么不是潜在信息时钟的无误差代理。<Cite n={14} /><Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="mdh-identification">
        <p className="section-kicker">13 · MDH 能解释什么，不能识别什么</p>
        <h2>共同潜变量可以生成厚尾、波动聚集与量价正相关，但“模型能拟合”不等于潜在信息流被唯一识别，也不保证不同历史阶段共享同一映射。</h2>
        <div className="equation-card">
          <span>简化条件分布</span>
          <div>R<sub>t</sub> | I<sub>t</sub> ∼ N(0, σ²I<sub>t</sub>)　，　Q<sub>t</sub> = μI<sub>t</sub> + η<sub>t</sub></div>
          <p>N(0,σ²I) 表示：给定 I 后，R 被假定服从条件均值为 0、条件方差为 σ²I 的正态分布；σ² 是单位潜在事件的方差尺度。μ&gt;0 是把一单位潜在业务时间映射为预期成交量的载荷，单位为 Q/I；η 是不能由 I 解释的成交量成分，可包含拆单、流动性交易、制度变化和测量误差。若 I 持续，R² 与 Q 都可能持续；条件正态、独立创新与零均值都只是模型设定，不是数据定义。</p>
        </div>
        <p>
          Tauchen–Pitts 给出一个尤其重要的反例：交易者数量固定时，更强潜在活动可同时提高成交量和价格方差；长期市场扩张时，参与者数量增加却可能使平均成交量上升，而更多保留价格修正相互平均，使价格方差下降。Lamoureux–Lastrapes 在其股票样本中发现把同期 volume 加入 GARCH 后，拟合出的条件方差持续性下降；这只说明在该设定内 volume 改变了持续性估计，并与其代理部分共同驱动的解释相容，不能识别共同状态，更不能把 volume 当成外生原因或跨市场通则。<Cite n={4} /><Cite n={23} />
        </p>
        <p>
          Gallant–Rossi–Tauchen 用 1928–1987 年 16,127 个日观测，把 S&amp;P Composite price change 与 total NYSE share volume 联合建模，并处理日历效应和 volume 的长期趋势；他们记录了条件价格变化与成交量的复杂动态，但市场聚合会隐藏个股间抵消与制度变化。描述性事实有价值，结构归因仍需要额外观测和可反驳限制。<Cite n={22} />
        </p>
      </section>

      <section className="lesson-section" id="sequential-information">
        <p className="section-kicker">14 · Sequential Information Arrival</p>
        <h2>若同一信息逐步到达不同主体，市场会在最终共同状态形成前经历一连串中间持仓和价格修正；更多成交与更多波动来自扩散过程，而不是成交量验证了信息。</h2>
        <p>
          Copeland 的顺序到达模型假定交易者按随机次序获知同一信息。早获知者先调整需求，后来者继续调整，价格与成交量在信息完全扩散前同步演化。这个机制能解释一个 information episode 内的多步共同调整，也提示 trade count 有时近似记录“尚未结束的扩散步骤”；若要进一步产生跨窗口 volatility clustering，还需要信息到达率本身持续或多个 episode 重叠。<Cite n={7} />
        </p>
        <div className="mechanism-chain" aria-label="顺序信息到达机制">
          {[
            ['共同信息产生', '最终价值相关信号已经存在，但并非所有主体同时知道或理解'],
            ['局部更新', '先到达者改变目标持仓并与尚未更新者交易'],
            ['中间价格', '价格只聚合了当前已到达的信息与流动性状态'],
            ['继续扩散', '后到达者更新，引发新的交易、报价和价格修正'],
            ['暂时收敛', '信息近似共同后，额外交易动机下降；新冲击可重新启动过程'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          其边界同样重要：现代公共数据可被算法近乎同时读取，主要 quote adjustment 可能发生在第一笔成交前；母单拆分也能制造看似“顺序学习”的持续 flow。观察到许多笔交易不足以识别信息逐步到达，必须结合发布时点、参与者信息集、报价先后和价格永久性。
        </p>
      </section>

      <section className="lesson-section" id="trade-not-necessary">
        <p className="section-kicker">15 · 信息进入不以成交为必要条件</p>
        <h2>共同公共信号可以让所有供应者同时移动可交易报价，却几乎不产生相互成交；在严格共同先验和理性环境中，私人信息也未必创造投机交易。</h2>
        <p>
          若所有主体对盈利公告形成相同的向上 posterior mean，旧卖价会变成 stale quote。卖方撤单、买卖两侧在新价值附近重报，midquote 可以大幅跳升，但没有人愿意按旧价卖，也没有必要先成交才能“许可”价格变化。此时 high volatility / low volume 完全合理。相反，大量成交也可能只说明主体对同一信号有不同解释，而不是信息本身更大。
        </p>
        <p>
          Milgrom–Stokey 的 no-trade result 是一面逻辑镜子。其基准要求风险厌恶主体拥有共同先验，初始配置相对这一先验已经 ex ante Pareto-efficient——也就是在信息揭示前，已不存在让所有人至少不差且有人更好的可行重配——并且理性、拟议交易的可行性与个体理性成为共同知识，交易只由信息触发。在这些严格条件下，愿意成交本身会泄露信息，从而破坏纯投机交易。现实持续有量，是因为低效初始配置、禀赋与流动性冲击、不同先验或解释、噪声、约束、非共同知识、风险共享和中介摩擦会破坏这些条件。该定理不是“现实不应交易”，而是在提醒：从“有新信息”到“必有高 volume”之间还缺少交易动机。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="belief-dispersion">
        <p className="section-kicker">16 · 加权信念中心与持仓修正离散度</p>
        <h2>在简化出清模型中，按风险厌恶与主观精度共同决定的有效权重形成信念中心，个体目标持仓修正的离散程度影响换手；同一公共信号因此可以产生大价格/小成交或小价格/大成交。</h2>
        <p>
          在一个仅用于教学的 CARA–Normal 表示中，CARA 指 constant absolute risk aversion（绝对风险厌恶系数不随财富变化），Normal 指主体把未来 payoff 近似为正态分布。为避免贴现符号遮蔽主线，下式把当前价格与未来 payoff 都表示为同一终值计价单位，并把无风险总收益归一为 R<sub>f</sub>=1；若 R<sub>f</sub>≠1，分子应写成 m<sub>i,t</sub>−R<sub>f</sub>P<sub>t</sub>。主体 i 的目标持仓可写为：
        </p>
        <div className="equation-card">
          <span>信念、风险与目标持仓</span>
          <div>x*<sub>i,t</sub> = (m<sub>i,t</sub> − P<sub>t</sub>) / (γ<sub>i</sub>σ²<sub>i,t</sub>)</div>
          <p>x* 是该静态模型中的目标持仓，m 是主观预期价值，P 是当前价格，γ 是绝对风险厌恶，σ² 是主观收益方差。分子是主观价值相对价格的距离，分母越大表示主体越不愿承担该风险。这个表达忽略交易成本、财富与约束。</p>
        </div>
        <div className="equation-card">
          <span>固定供给下的简化出清价格</span>
          <div>P<sub>t</sub> = [Σ<sub>i</sub>a<sub>i,t</sub>m<sub>i,t</sub> − S̄] / Σ<sub>i</sub>a<sub>i,t</sub>　，　a<sub>i,t</sub> = 1/(γ<sub>i</sub>σ²<sub>i,t</sub>)</div>
          <p>令全部目标持仓满足 Σ<sub>i</sub>x*<sub>i,t</sub>=S̄，S̄ 是固定证券供给。a 同时随风险厌恶 γ 降低而上升、随主观方差 σ² 降低而上升，所以应称为“有效风险承载/主观精度权重”，而非纯风险承受度。价格等于按 a 加权的信念中心，再减去由正供给与有限有效容量形成的风险折价；因此不是未经加权的“平均看法”单独决定价格。</p>
        </div>
        <div className="equation-card">
          <span>目标持仓修正所暗示的 gross reallocation</span>
          <div>GRT*<sub>t</sub> ≈ ½ Σ<sub>i</sub> |x*<sub>i,t</sub> − x*<sub>i,t−1</sub>|</div>
          <p>GRT* 是目标持仓变化暗示的终点 gross reallocation。只有前后目标持仓都对同一固定证券供给出清，即 Σix*<sub>i,t</sub>=Σix*<sub>i,t−1</sub> 时，½ 才避免把同一转移在买卖双方重复计数。星号提醒它不是实际成交量；实际执行还受库存、财富、短售和交易成本约束。</p>
        </div>
        <p>
          Harris–Raviv 让拥有共同先验的主体对同一公共信息采用不同解释规则，模型中绝对价格变化与 volume 正相关且 volume 自相关；Kandel–Pearson 的公告和分析师修订证据支持“公共信号不必形成同质解释”。这并不证明每次放量都来自分歧，只说明按有效风险承载与主观精度形成的加权信念中心、供给风险折价与持仓修正离散度是不同对象。完整 disagreement 形成机制留给 6.03。<Cite n={9} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-noise-risk-sharing">
        <p className="section-kicker">17 · 非信息交易也有经济结构</p>
        <h2>现金需求、指数调仓、申赎、税务、保证金和套期保值会把非基本面持仓需求交给风险厌恶中介；中介要求价格折让承接库存，压力消退后价格才可能反转。</h2>
        <p>
          Campbell–Grossman–Wang 的风险厌恶中介模型给出完整链条：客户因非信息需求卖出，风险不能瞬间找到永久买方，中介只有得到价格折让才愿意暂时承接；成交量和库存同时上升、价格下跌；当自然买方进入或中介卸载库存时，暂时性压力消退，价格更可能反转。Llorente–Michaely–Saar–Wang 进一步把高量价格变化的延续或反转变成条件性经验诊断：私有信息占主导时更可能延续，流动性/套保需求占主导时更可能反转。动态系数仍是模型和代理变量的联合检验，不是对单笔动机的标签。<Cite n={12} /><Cite n={13} />
        </p>
        <div className="boundary-box">
          <b>不要把“非信息”翻译成“无意义”</b>
          <p>完成养老基金再平衡、企业套保或客户现金需求可以提高私人效用和风险配置，即使对永久 price discovery 贡献很低。福利评价还要计算交易成本、风险由谁承接、价格压力和对其他参与者的外部性，不能用 volume 或后续反转单独裁决。</p>
        </div>
      </section>

      <section className="lesson-section" id="expected-unexpected-volume">
        <p className="section-kicker">18 · Expected 与 Unexpected Volume</p>
        <h2>收盘前的高量若每天可预测，与突然超出条件基准的放量不是同一个状态；但“异常量”也不等于外生信息冲击。</h2>
        <div className="equation-card">
          <span>仅使用当时可得信息的异常活动</span>
          <div>u<sup>Q</sup><sub>t</sub> = log Q<sub>t</sub> − E<sub>t−1</sub>[log Q<sub>t</sub> | calendar, own lags, market state]</div>
          <p>u<sup>Q</sup><sub>t</sub> 是窗口 t 的对数成交量意外；log 是自然对数。E<sub>t−1</sub>[·|·] 是站在 t−1 时点、只用当时可得数据形成的条件期望，竖线后的条件集包含预先指定的日历位置、自身滞后和市场状态。全样本均值、居中移动平均或用同期 RV 拟合后得到的残差，不能在实时研究中称为 volume surprise。</p>
        </div>
        <p>
          该 log 形式只在 Q&gt;0 时定义。若零成交窗口不是可忽略例外，应预先选择 log(1+Q/c)——c 是固定单位尺度——或使用“两部模型”：先预测是否有成交，再预测正成交条件下的规模。删除零值会把低流动性状态从目标总体中移走，不能静默处理。
        </p>
        <p>
          Bessembinder–Seguin 在 1982 年 5 月至 1990 年 3 月八类实物与金融期货的日频样本中，把成交量和 open interest 分成可预期与非预期成分；非预期 volume 与波动的正关系更强，较高 open interest 则缓和波动，支持“活动意外与市场深度必须分开”。但第一阶段模型决定什么算 surprise，异常量也可能来自指数调仓、forced liquidation 或保证金，而非新价值信息。<Cite n={21} />
        </p>
        <p>
          若研究正负活动意外，应写 u<sup>+</sup>=max(u,0) 与 u<sup>−</sup>=max(−u,0)。这里“负 volume surprise”表示低于预期的活动，不是主动卖出量；把两种“负”混称，是量价研究最常见的语义错误之一。
        </p>
      </section>

      <section className="lesson-section" id="minimal-price-map">
        <p className="section-kicker">19 · 从订单压力到价格路径的最小接口</p>
        <h2>成交量只说有多少执行；短周期价格变化更接近“有方向的净订单簿压力 × 单位压力的状态依赖冲击”。</h2>
        <div className="equation-card">
          <span>继承自 1.09 的局部教学映射</span>
          <div>r<sub>t,k</sub> = λ(S<sub>t,k</sub>) · OFI<sub>t,k</sub> + u<sub>t,k</sub></div>
          <p>k 是窗口 t 内的第 k 个等长子区间或预先定义的订单簿事件；r<sub>t,k</sub> 是该格的对数中间价收益。若 OFI 以股计，λ 的单位是对数收益/股；S 是当格状态，包括 depth、spread、库存压力、风险容量和波动。u<sub>t,k</sub> 是 OFI 与该状态映射没有解释的其余价格创新，单位同样为对数收益。盘口越薄，同一口径下 λ 通常越大。</p>
        </div>
        <div className="equation-card">
          <span>从局部收益到窗口 realized variance</span>
          <div>RV<sub>t</sub> ≈ Σ<sub>k</sub> λ(S<sub>t,k</sub>)²OFI<sub>t,k</sub>² + cross terms + other innovations</div>
          <p>把每格 r 平方并求和会产生 OFI 主项、λ·OFI 与 u 的交叉项，以及 u² 等其他创新项；因此这只是机制分解而非精确简化恒等式。λ、OFI 与 u 可能共同内生，交叉项不会一般性消失，报价更新还可在执行前发生。</p>
        </div>
        <p>
          该接口解释了 volume 与 volatility 为什么不是一对一：Q 没有进入等式的方向结构；两侧交替成交可让 Q 很大而 OFI 小；撤单可让 Q 很小而 OFI 大；深度变化又让同一个 OFI 对价格的映射不同。Cont–Kukanov–Stoikov 的短窗口结果与这套分解相容，不能被升级为“OFI 外生导致价格”的普遍因果定律。<Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="same-volume-different-volatility">
        <p className="section-kicker">20 · 同样 Volume，四种不同市场</p>
        <h2>只固定总成交量而改变方向、路径和深度，波动率就可从很低变到很高；这说明“do(volume)”没有唯一经济含义。</h2>
        <div className="table-scroll" role="region" aria-label="相同成交量不同波动情景，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>假设四个窗口均成交 100 万股</caption>
            <thead><tr><th scope="col">情景</th><th scope="col">流与深度</th><th scope="col">可能价格路径</th><th scope="col">更可信解释</th></tr></thead>
            <tbody>
              <tr><th scope="row">双边深盘口</th><td>买卖交替、|OFI|低、depth 高</td><td>小幅来回或近乎不动</td><td>流动性集中、可预期换手</td></tr>
              <tr><th scope="row">单边深盘口</th><td>OFI 持续同向、depth 高</td><td>缓慢、较平滑移动</td><td>持续资金流被逐步吸收</td></tr>
              <tr><th scope="row">单边薄盘口</th><td>OFI 同向、cancel 增、depth 低</td><td>快速穿档、RV 高</td><td>信息/强制流与容量收缩共振</td></tr>
              <tr><th scope="row">Hot potato</th><td>主体间反复转手、终点 GRT 低</td><td>可反转，也可在深度耗尽时剧烈移动</td><td>中介库存搜索与反馈</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          反过来也成立：低 volume 可以在公共报价先跳、停牌后一次性集合、或极薄盘口被小 OFI 穿透时对应高波动。总量最多是潜在共同驱动的一个带噪传感器，不是已被识别的状态，更不是对信息、方向、流动性或福利的充分统计量。
        </p>
      </section>

      <section className="lesson-section" id="path-endpoint">
        <p className="section-kicker">21 · 期末净值不能替代路径</p>
        <h2>窗口末 signed flow 或 return 接近零，不表示沿途压力与波动很小；先买后卖可以在终点抵消方向，却不能抵消平方路径。</h2>
        <p>
          假设两个子区间收益分别为 +1% 与 −1%。教学近似下累计收益约为 0，但 RV=0.01²+(−0.01)²=0.0002，realized volatility 约 1.414%。同样，SF<sub>end</sub>=Σ εq 接近零，只说明窗口内主动买卖股数在代数上抵消；如果它们先后到达、期间 depth 不同，价格可以先升后跌并产生很高 RV。
        </p>
        <p>
          这也是为什么 GRT<sup>end</sup> 与 Q 必须并报：终点风险转移低只与 hot-potato 或中介回转相容，单独不能诊断路径，更不能说过程“没有影响”。中间商承担过库存、价差扩大、对冲市场被触发、其他主体风控阈值被突破，都会留下真实成本与反馈。研究应同时报告 path variables、峰值库存、最大 depth 缺口、恢复时间和终点持仓。
        </p>
      </section>

      <section className="lesson-section" id="transaction-clock-decomposition">
        <p className="section-kicker">22 · 交易笔数与每笔价格变化</p>
        <h2>交易时钟中的 realized variance 等于交易笔数乘以平均每笔平方价格变化；正相关可以来自更多交易，也可以来自每笔交易发生在更脆弱的状态。</h2>
        <div className="equation-card">
          <span>交易时钟的精确算术分解</span>
          <div>r<sub>j</sub> = log m<sub>j</sub> − log m<sub>j−1</sub>　；　RV<sup>trade</sup><sub>t</sub> = Σ<sub>j=1</sub><sup>Nₜ</sup>r<sub>j</sub>² = N<sub>t</sub> · mean<sub>j</sub>(r<sub>j</sub>²)　，　N<sub>t</sub>&gt;0</div>
          <p>m<sub>0</sub> 是窗口开始或第一笔成交前最后一个有效 midquote，m<sub>j</sub> 是第 j 笔成交后的 midquote，因此 N 笔成交对应 N 个明确定义的事件收益。r 的单位是对数收益，mean<sub>j</sub>(r<sub>j</sub>²) 是每个成交事件后平方收益的均值。N=0 时空样本均值和这一定义下的 trade-clock RV 均未定义，应记为缺失并另报 calendar-clock 或 quote-clock 价格变化，因为没有成交时报价仍可能移动。恒等式不说明 N 外生，也不说明价格变化由 execution 单独造成；中间 quote revisions 与事件归因规则都会改变 r<sub>j</sub>。</p>
        </div>
        <p>
          若每笔价格变化的条件分布稳定，N 上升会机械提高交易时钟中平方项总数；若 N 不变但 depth 下降、信息毒性上升，平均每笔平方变化也会提高。把总量拆成 N 与 q̄ 只是第一层，还需加入 signed imbalance、duration、depth、trade size bins 和制度。Dufour–Engle 的结果提醒，交易更密集时冲击、信息吸收与订单符号持续性会共同改变。<Cite n={20} />
        </p>
      </section>
      <section className="lesson-section" id="trade-count-evidence">
        <p className="section-kicker">23 · “交易笔数主导”是一条样本依赖结论</p>
        <h2>经典研究对 trade count、average size 和 imbalance 的相对作用给出不同答案；矛盾本身说明市场制度、波动测量和交易分类是结论的一部分。</h2>
        <p>
          Jones–Kaul–Lipson 使用 1986–1991 年 Nasdaq/NMS 股票的日频数据，把 volume 分成交易笔数与平均规模；在其样本中，N 基本吸收了 volume 对日绝对收益的解释力，q̄ 没有额外信息。不能把这读成“交易笔数造成波动”：旧式 Nasdaq dealer market、日绝对收益的测量噪声和订单拆分规则都属于结论边界。<Cite n={17} />
        </p>
        <p>
          Chan–Fong 使用 1993 年 7–12 月 TAQ、按市值匹配 NYSE 与 Nasdaq 股票，按 size bins 研究主动成交不平衡和日绝对残差；中等规模交易笔数关系较强，控制 imbalance 的价格变化后简单 volume–volatility 关系明显减弱，说明“规模完全无关”并不稳健。后来他们用 30 只 DJIA 股票 1993–2000 年 5 分钟收益构造日 realized volatility，却再次发现 N 的解释力占主导，q̄ 与绝对不平衡在 N 之外增量很小。<Cite n={18} /><Cite n={19} />
        </p>
        <div className="boundary-box">
          <b>正确综合</b>
          <p>不是选择一篇“赢家”，而是先问：波动用 |R| 还是 RV；市场是 dealer 还是现代 CLOB；成交方向是推断还是真实标记；trade size 是均值还是 bins；是否控制 N、OFI 与 depth；时间尺度和拆单制度是否相同。只有目标变量和条件集一致，系数才可比较。</p>
        </div>
      </section>

      <section className="lesson-section" id="asymmetries">
        <p className="section-kicker">24 · 三种“非对称”</p>
        <h2>涨跌方向、活动意外正负和流动性状态的非对称是三件事；无符号 volume 不能被重新命名为“卖出成交量”。</h2>
        <div className="table-scroll" role="region" aria-label="量价非对称类型比较，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同一个 asymmetry 词对应不同条件事件</caption>
            <thead><tr><th scope="col">类型</th><th scope="col">比较对象</th><th scope="col">可能机制</th><th scope="col">识别警告</th></tr></thead>
            <tbody>
              <tr><th scope="row">Return-sign</th><td>R≥0 与 R&lt;0 时 Q–RV 关系</td><td>短售约束、财富与杠杆、下跌时 depth 撤回</td><td>用当期 R 分组会内生选择状态</td></tr>
              <tr><th scope="row">Activity-surprise</th><td>Q 高于或低于 E<sub>t−1</sub>Q</td><td>意外参与、强制流、安静市场容量不足</td><td>依赖第一阶段条件期望模型</td></tr>
              <tr><th scope="row">Impact-state</th><td>同一 OFI 在正常与压力状态的 λ</td><td>库存、融资、抵押品和流动性供给收缩</td><td>λ 与 OFI 同期内生，需明确定义干预</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>按当期收益方向分组的描述性回归</span>
          <div>RV<sub>t</sub> = α + β<sub>+</sub>Q<sub>t</sub>1(R<sub>t</sub>≥0) + β<sub>−</sub>Q<sub>t</sub>1(R<sub>t</sub>&lt;0) + Γ′X<sub>t</sub> + ε<sub>t</sub></div>
          <p>α 是基准截距；1(·) 是条件成立取 1、否则取 0 的指示函数；β+ 与 β− 分别描述上涨/下跌窗口中 Q 与 RV 的条件斜率；X 是预先列明的控制变量，Γ 是其系数，ε 是未解释部分。所有量都在同一窗口观测，所以这仍是描述关系。</p>
        </div>
        <p>
          即使 β<sub>−</sub>&gt;β<sub>+</sub>，也不能翻译成“卖出成交量更有冲击”，因为 Q 仍同时包含主动买卖，而且用当期 R 分组本身会内生选择状态。Bessembinder–Seguin 所说正/负成交量意外，也只是高于/低于条件预期的活动，不是买/卖方向。<Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="reverse-causality">
        <p className="section-kicker">25 · Volatility 也会反向制造 Volume</p>
        <h2>价格先跳动以后，止损、Delta/Gamma hedge、保证金、目标波动策略、风险限额、媒体关注和投资者再平衡会产生新订单；因此 Q 领先与滞后都可能只是反馈链的一部分。</h2>
        <div className="mechanism-chain" aria-label="波动率反向触发成交活动">
          {[
            ['价格创新', '公共新闻、订单冲击或 depth 缺口让价格路径先发生较大变化'],
            ['暴露改变', '期权 Delta、组合权重、杠杆、VaR、保证金与抵押品价值被重新计算'],
            ['规则触发', '止损、hedge、risk limit、目标波动和被动再平衡生成新交易需求'],
            ['流动性响应', '中介吸收库存、扩大 spread、撤减 size 或去其他市场 hedge'],
            ['新一轮价格', '交易和 depth 变化再次影响价格，形成放大或吸收反馈'],
          ].map(([title, detail], index) => <div key={title}><span>{String(index + 1).padStart(2, '0')}</span><b>{title}</b><p>{detail}</p></div>)}
        </div>
        <p>
          这条反馈会让同一日的 volume 与 RV 高度相关，也会让滞后 RV 预测下一期 volume。若研究只把 Q 放在回归右侧、RV 放在左侧，变量位置并不会赋予经济方向。负时点 local projection、预定公告时钟、父订单和风险规则数据，才有助于判断波动是否在放量前已经上升。
        </p>
      </section>

      <section className="lesson-section" id="feedback-loop">
        <p className="section-kicker">26 · 放大与吸收是同一闭环的两种状态</p>
        <h2>更多成交既可能把风险分散给愿意承接者并恢复深度，也可能在共同约束下反复转手、耗尽库存容量并继续放大波动；关键不是量大，而是终点承接与 λ 怎样变化。</h2>
        <div className="table-scroll" role="region" aria-label="成交量反馈的吸收与放大状态，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>同样的初始卖压可以进入两种反馈</caption>
            <thead><tr><th scope="col">环节</th><th scope="col">吸收状态</th><th scope="col">放大状态</th></tr></thead>
            <tbody>
              <tr><th scope="row">承接者</th><td>异质资本和自然买方逐步进入</td><td>中介共享约束，最终买方缺席</td></tr>
              <tr><th scope="row">库存</th><td>向能长期持有者迁移，GRT<sup>end</sup> 上升</td><td>在中介间循环，Q 高而 GRT<sup>end</sup> 低</td></tr>
              <tr><th scope="row">深度 / λ</th><td>补单、depth 恢复、λ 下降</td><td>撤单、depth 枯竭、λ 上升</td></tr>
              <tr><th scope="row">价格</th><td>初始压力被吸收，可出现反转</td><td>同一 OFI 产生更大移动并触发新规则单</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因此“高量说明流动性好”和“高量说明恐慌”都可能在特定条件下成立，但都不是无条件命题。最有辨识力的观测不是 Q 单独，而是 Q 与 participant inventory、GRT<sup>end</sup>、OFI、depth recovery、λ 和后续反转的联合路径。
        </p>
      </section>

      <section className="lesson-section" id="lead-lag-forecasting">
        <p className="section-kicker">27 · Lead–Lag 与 Forecasting</p>
        <h2>成交量领先未来波动，只说明它含有当前基准信息集尚未吸收的增量预测信息；Granger causality 应翻译为增量时间序列可预测性，而不是干预因果或已识别的持续状态。</h2>
        <p>
          Lead–lag 是统计上的先后关系。HAR-RV（heterogeneous autoregressive realized-volatility model）是常用强基准：它用过去日、周、月尺度的 RV 均值刻画波动持续性。检验 volume 是否有增量，不是拿它与“什么都没有”的模型比较，而是问它能否在这类基准和已知市场状态之上进一步降低未来损失。
        </p>
        <div className="equation-card">
          <span>预先固定 horizon 的预测问题</span>
          <div>RV<sub>t+h</sub> = α<sub>h</sub> + φ<sub>h</sub>′X<sub>t</sub> + γ<sub>h</sub>u<sup>Q</sup><sub>t</sub> + ε<sub>t+h</sub></div>
          <p>h 是从预测时点向前的固定 horizon；α 是基准水平；X 是 t 时已知的过去 RV、return、OFI、spread、depth、新闻与时间段状态；φ 是这些基准特征的系数；uQ 是只用 t 时信息估计的异常量；γ 衡量其条件增量；ε 是预测误差。γ≠0 仍只是条件预测关系。</p>
        </div>
        <p>
          Hiemstra–Jones 曾报告 Dow returns 与 NYSE volume changes 的双向非线性 Granger 关系；Diks–Panchenko 随后证明该检验在真实零假设下可严重过度拒绝，样本增大时拒绝概率甚至趋近 1，并提出修正方法。这个文献链说明：一个广为引用的“非线性因果”结果，也可能只是检验统计量失真。<Cite n={32} /><Cite n={33} /><Cite n={34} />
        </p>
        <p>
          Todorova–Souček 用 26 只 DAX 股票 2003–2007 年逐笔数据，以 10 分钟区间构造修正 realized range，并把 volume、trade count 与 overnight returns 加入 HAR；这些活动变量至多带来边际改善，全部股票的样本外精度提升均不显著。样本外（out-of-sample，OOS）是指在没有参与拟合的后续时期检验预测。该结果不排除秒级或事件窗口预测，但阻止我们把强同期关系直接外推为稳健日度预测。<Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="common-seasonality">
        <p className="section-kicker">28 · 共同日内季节性</p>
        <h2>开盘和收盘的高量、高波动可以在没有任何“异常量—异常波动”关系时制造原始正相关；研究机制必须先在相同市场时钟内比较创新。</h2>
        <div className="equation-card">
          <span>把稳定时间格与当日创新分开</span>
          <div>log Q<sub>d,τ</sub> = a<sup>Q</sup><sub>τ</sub> + q̃<sub>d,τ</sub>　；　log RV<sub>d,τ</sub> = a<sup>RV</sup><sub>τ</sub> + ṽ<sub>d,τ</sub></div>
          <p>d 表示交易日，τ 表示该日内预先固定的时间格；log 是自然对数。a<sup>Q</sup><sub>τ</sub> 与 a<sup>RV</sup><sub>τ</sub> 是只用过去数据估计的同一证券、同一时间格基准对数水平；q̃ 与 ṽ 分别是 log Q 与 log RV 偏离各自市场时钟基准的创新，都是无量纲对数差。</p>
        </div>
        <p>
          对 Q=0 或 RV=0 的时间格，log 不定义。研究者必须预先限定为正值样本，或使用带固定尺度的 log(1+x/c) 与零值两部模型，并把选择写进协议；不能在看到结果后静默删除安静窗口。
        </p>
        <p>
          原始协方差包含 Cov(a<sup>Q</sup><sub>τ</sub>,a<sup>RV</sup><sub>τ</sub>) 与 Cov(q̃,ṽ) 等项。Admati–Pfleiderer 说明 informed 与 liquidity traders 的策略互动可以内生形成活动聚集；Foster–Viswanathan 记录 volume、volatility 和 trading cost 的日内与星期变化；Andersen–Bollerslev 则显示日内周期若未建模，会扭曲波动持续性。季节性所以既是需要隔离的混淆，也是有经济机制的结果，完整展开留给 1.16。<Cite n={28} /><Cite n={29} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="evidence-map">
        <p className="section-kicker">29 · 证据地图</p>
        <h2>理论、联合分布、事件研究、交易分解、准实验和样本外预测回答不同层级；证据强不强，取决于它是否对准了声称的推断。</h2>
        <div className="table-scroll" role="region" aria-label="成交量与波动证据地图，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从机制可能性到可干预结论</caption>
            <thead><tr><th scope="col">证据类型</th><th scope="col">代表研究</th><th scope="col">最强可支持</th><th scope="col">核心缺口</th></tr></thead>
            <tbody>
              <tr><th scope="row">结构理论</th><td>Clark；Tauchen–Pitts；Copeland；Wang</td><td>哪些条件可共同生成量与波动</td><td>潜变量和参数未必被现实唯一识别</td></tr>
              <tr><th scope="row">条件时序与联合动态</th><td>Gallant–Rossi–Tauchen；Lamoureux–Lastrapes</td><td>条件动态和共同变化的描述</td><td>共同原因、反向因果与制度漂移</td></tr>
              <tr><th scope="row">逐笔分解</th><td>Jones et al.；Chan–Fong；Cont et al.</td><td>N、size、imbalance、depth 的相对条件关系</td><td>同一期内生与构造机械性</td></tr>
              <tr><th scope="row">可观测新闻/公告</th><td>Beaver；Berry–Howe；Kandel–Pearson</td><td>已知信息事件后的量、价和分歧路径</td><td>新闻重要性、泄漏和其他同期信息</td></tr>
              <tr><th scope="row">交易时段准实验</th><td>French–Roll；Barclay et al.</td><td>交易机会怎样重排波动发生时间</td><td>开闭市同时改变信息、流动性和 venue 迁移</td></tr>
              <tr><th scope="row">严格预测</th><td>Todorova–Souček</td><td>量对强基准的未来损失增量</td><td>市场与 horizon 外部有效性</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          读表时不要按“论文数量投票”。同期机制研究很多，不会自动填补外生因果证据的缺口；一次可信政策冲击也不必识别 volume 的纯中介效应，因为制度往往同时改变 depth、queue 和策略。最诚实的综合，是把每条结果压回 treatment、sample、unit、clock、outcome 和 excluded path。
        </p>
      </section>

      <section className="lesson-section" id="empirical-synthesis">
        <p className="section-kicker">30 · 实证综合：稳健的是条件关系，不是单一因果</p>
        <h2>文献最一致地支持“量与波动在同一状态中共同上升”；一旦追问交易次数、规模、方向、深度、跳跃和预测，结论立即变成市场与测量依赖。</h2>
        <div className="research-card">
          <span>联合动态 · 强描述、弱方向</span>
          <h3>长期市场总量与个股结构模型都记录正向共同运动，却拒绝 volume 是纯信息代理。</h3>
          <p>Gallant–Rossi–Tauchen 联合建模 S&amp;P Composite price change 与 total NYSE share volume，显示条件价格变化与 volume 的丰富动态；Andersen 的五只股票修正模型在加入流动性交易和 volume noise 后优于标准 MDH。这些结果与多种共同驱动相容，却没有识别潜在状态的种类，不识别某一笔成交的动机，也不证明 Q 是可操纵原因。<Cite n={22} /><Cite n={5} /></p>
        </div>
        <div className="research-card">
          <span>分解 · Trade count 常重要，但不是普遍充分统计量</span>
          <h3>N 在多组旧美股样本中占主导；size 与 imbalance 是否有增量，取决于波动指标和市场结构。</h3>
          <p>Jones–Kaul–Lipson 与 Chan–Fong 2006 支持 N 主导；Chan–Fong 2000 则显示 size bins 与 imbalance 会改变结论。三项结果只有在 volatility target、市场制度、交易签名和条件变量对齐后才能比较，不能按论文数量投票。<Cite n={17} /><Cite n={18} /><Cite n={19} /></p>
        </div>
        <div className="research-card">
          <span>新闻与日历 · 信息数量不是信息强度</span>
          <h3>可观测新闻提高成交活动，但新闻条数对波动的解释很弱；交易时段改变波动出现的时点，不必增加更长周期总方差。</h3>
          <p>Berry–Howe 统计 1990–1991 年 Reuters 新闻的 30 分钟流量，新闻数与成交量中等正相关，却与波动不显著；隔夜新闻对开盘后的 9:30–10:00 与 10:00–10:30 两个区间成交量回归的 R² 约为 2.6% 和 2.5%。French–Roll 与交易日历证据则说明交易开启会把价格变化集中到可交易时段，但不等于创造同等数量的长期不确定性。<Cite n={24} /><Cite n={26} /><Cite n={27} /></p>
        </div>
      </section>

      <section className="lesson-section" id="four-cases">
        <p className="section-kicker">31 · 四个真实案例</p>
        <h2>把公告分歧、期货活动意外、连续/跳跃波动和库存循环并置，才能看见同一“高量/高波动”表象下完全不同的机制。</h2>
        <div className="case-study">
          <span>Case A · 盈利公告与异质解释</span>
          <h3>信息进入可以显著放量，却不要求所有人同方向更新。</h3>
          <p>Beaver 研究 143 只 NYSE 股票、1961–1965 年 506 次年度盈利公告；公告周平均成交量约高于正常期 33%，价格变动幅度也上升。该事件窗说明公告对信念和交易有信息含量，但周频设计不能排除同期消息，也不能把量解释成信息方向。Kandel–Pearson 进一步说明同一公开信号的差异化解释能产生大换手与不成比例的净价格变化。<Cite n={25} /><Cite n={10} /></p>
        </div>
        <div className="case-study">
          <span>Case B · 期货活动意外与市场深度</span>
          <h3>超出条件预期的成交活动与波动关系更强，但较高未平仓量可以缓和波动；“放量”必须与容量存量并读。</h3>
          <p>Bessembinder–Seguin 研究 1982 年 5 月至 1990 年 3 月八类实物与金融期货，把成交量和 open interest 分成 expected 与 unexpected components。非预期 volume 的正向关系明显更强，而较高 open interest 会减弱波动。这个结果支持“活动 surprise 与承接容量是不同状态”，却不把 residual 认作信息冲击，也不把 open interest 当作无误差 depth。<Cite n={21} /></p>
        </div>
        <div className="case-study">
          <span>Case C · 连续波动与 Jumps</span>
          <h3>总量—波动正关系可以只存在于连续成分，对跳跃反而失效；研究对象不同，结论的符号和含义就会改变。</h3>
          <p>Giot–Laurent–Petitjean 使用 1995 年 1 月至 1999 年 9 月 1,199 个交易日、当期最大的 100 只 NYSE 股票，以 midquote 高频收益和 bipower variation 把日 RV 分成连续与 jump components。Trade count 仍占主导，活动变量与连续成分正相关，但经典正向关系不适用于 jumps，低活动有时反而伴随更不规则跳跃。Jump 分类依赖采样与阈值，结果不能外推到低流动性股票。<Cite n={31} /></p>
        </div>
        <div className="case-study">
          <span>Case D · 2010 Flash Crash 的 Hot Potato</span>
          <h3>极高 gross volume 可以伴随极低终点库存吸收；深度消失才把持续卖压映射成非线性价格变化。</h3>
          <p>CFTC–SEC 报告记录，一套不以价格和时间为约束的算法计划卖出 75,000 份 E-mini、名义约 41 亿美元。在 14:45:13 至 14:45:27 ET 这一约 15 秒窗口内，HFT 彼此交易超过 27,000 份合约、约占该段 volume 的 49%，合计净持仓却只增加约 200 份；买方深度降至上午水平不足 1%，E-mini 又跌 1.7%。该单一事件支持“高量、低净承接、薄深度可以共存”，不证明 HFT 一般性导致崩盘。<Cite n={36} /><Cite n={37} /></p>
        </div>
      </section>

      <section className="lesson-section" id="data-estimation">
        <p className="section-kicker">32 · 数据与估计协议</p>
        <h2>可信量价研究先重建全市场事件、统一时钟和信息集，再从描述、机制、动态和预测四层逐步升级；不能用一个日频回归替代整条链。</h2>
        <div className="table-scroll" role="region" aria-label="成交量与波动数据协议，可横向滚动" tabIndex={0}>
          <table className="architecture-matrix">
            <caption>从原始消息到可复现结论的最低协议</caption>
            <thead><tr><th scope="col">环节</th><th scope="col">必须做</th><th scope="col">失败表现</th></tr></thead>
            <tbody>
              <tr><th scope="row">交易数据</th><td>合并目标市场 venues；处理 correction、cancelled trade、condition code、off-exchange 与 auction</td><td>把单 venue 份额变化误作总量变化</td></tr>
              <tr><th scope="row">报价数据</th><td>对齐 exchange timestamp；标记 crossed/locked、停牌、LULD；用 midquote 与 depth</td><td>bid–ask bounce 被计为 RV，或未来 quote 配给过去 trade</td></tr>
              <tr><th scope="row">活动口径</th><td>并报 Q、DV、TO、N、q̄、M、SF/TI、OFI 与可得时的 participant GRT</td><td>用一个 volume 列替代方向、消息和承接</td></tr>
              <tr><th scope="row">市场时钟</th><td>按证券×时间格用过去样本估计季节性；开收盘 auction 与连续交易分开</td><td>共同 U 型制造伪关系，或全样本平滑泄漏未来</td></tr>
              <tr><th scope="row">波动</th><td>主报 midquote RV，并用稀疏采样/噪声稳健估计；必要时拆 continuous/jump</td><td>把 |R|、R²、RV 和 √RV 混成同一单位</td></tr>
              <tr><th scope="row">估计</th><td>先条件相关，再做事件路径、负时点 pretrend、机制分层与明确外生设计</td><td>变量放在右侧就称“影响”</td></tr>
              <tr><th scope="row">预测</th><td>滚动/扩展训练；强基准；QLIKE/MSE、OOS R² 与置信区间；全部变换只在训练窗拟合</td><td>用样本内 R² 或全样本标准化宣称可预测</td></tr>
            </tbody>
          </table>
        </div>
        <div className="boundary-box">
          <b>把研究术语翻译成可执行动作</b>
          <p>Condition code 是供应商给成交附加的特殊报告类型，例如 auction、late 或 correction，决定它能否进入连续交易样本；LULD（Limit Up–Limit Down）是美股围绕参考价设置动态价格带、阻止带外成交并可能触发暂停的制度标记。Pretrend 是在事件前检查处理组和对照组是否已经沿不同方向变化；若已不同，事件后差异可能不是处理造成。Fixed effect（固定效应）是在比较前移除同一股票、同一天或同一时间格的稳定平均差异。双向聚类标准误允许误差在同一股票内和同一交易日内相关，避免把重复观测误当独立信息。QLIKE 是针对正方差预测的相对误差损失，MSE 是平方预测误差；OOS R² 则比较新模型与冻结基准在后续样本的损失，正值才表示相对改善。</p>
        </div>
        <p>
          一个有用的描述性面板可写为“股票×交易日×5 分钟”，并估计 RV<sub>i,d,τ</sub> 对异常 N、异常 size、|SF|、|OFI|/depth 和状态控制的条件关系，加入股票—交易日与日内时间格固定效应，并按股票与交易日双向聚类。系数只能称为条件相关。若要谈因果，需另行提供公告 surprise、指数再平衡阈值、交易时段改革或随机化父订单执行等明确 treatment，并报告制度对 N、Q、M、OFI、depth、λ 与 RV 的总路径。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">33 · 互动实验</p>
        <h2>先锁定量、方向、深度、路径和信息集，再揭示结论；每道题都只改变一个关键条件，训练你抵抗“放量等于某种原因”的直觉跳跃。</h2>
        <p>
          Mode A 处理期货合约乘数与单边计数、turnover、OFI×depth 和路径 RV；Mode B 处理同期共变边界、跨市场报价先于本市场成交、同格季节性标准化与严格样本外预测。题目只要求选择在给定事实下最弱且可防守的结论，不输出市场概率或交易建议。
        </p>
        <VolumeVolatilityLab />
      </section>

      <section className="lesson-section" id="counterexamples">
        <p className="section-kicker">34 · 反例库</p>
        <h2>每个把 volume 当作信息、方向、冲击或容量的口号，都应当经受一个只改变关键条件的反例。</h2>
        <div className="myth-grid">
          <article><span>反例 01</span><h3>大新闻、少成交</h3><p>公共信号令全部报价先整体跳升，第一笔成交稍后才发生；信息进入价格不以 executed volume 为必要条件。</p></article>
          <article><span>反例 02</span><h3>小量、巨大波动</h3><p>深度骤降后，一笔不大的单边 OFI 穿透多档；真正放大价格的是高 λ，而非 gross volume。</p></article>
          <article><span>反例 03</span><h3>大量、很小净价格变化</h3><p>乐观与悲观者对同一信号反向更新，绝对持仓修正很大，按有效风险承载与主观精度形成的加权信念中心却近乎不变。</p></article>
          <article><span>反例 04</span><h3>终点不动、路径很波动</h3><p>价格先涨 1% 再跌 1%，累计收益近零但 RV 为 0.0002；终点不能替代路径。</p></article>
          <article><span>反例 05</span><h3>巨额换手、很低终点承接</h3><p>库存由 A→B→C→A 循环，Q 累积三次而各组终点持仓不变，GRT<sup>end</sup>=0。</p></article>
          <article><span>反例 06</span><h3>拆股制造“放量”</h3><p>1 拆 2 让股数成交量机械上升，经济风险交换和换手率可近似不变。</p></article>
          <article><span>反例 07</span><h3>消息爆发、零成交</h3><p>做市商因公共状态变化批量 cancel / replace，message volume 极高，却没有 execution。</p></article>
          <article><span>反例 08</span><h3>U 型制造相关</h3><p>开收盘的 Q 与 RV 都高，午间都低；即使每个时间格内两类创新完全无关，原始样本仍会正相关。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="research-design">
        <p className="section-kicker">35 · 把共同生成压成可证伪研究</p>
        <h2>好的设计不会问“量是否重要”，而会分别检验分歧怎样制造 gross activity、机械需求怎样经深度影响价格，以及活动变量是否真的增加未来预测信息。</h2>
        <div className="research-card">
          <span>研究题 A · 公告、分歧与共同生成</span>
          <h3>在固定公告 surprise 与市场时钟后，公告前分歧是否主要提高 gross activity，而 OFI / depth 更直接解释价格路径？</h3>
          <p><b>设计：</b>预定盈利或宏观公告的窄事件窗，以标准化 surprise（实际值减事前一致预期，再除以历史预测误差尺度）固定信息方向；以公告前已冻结的分析师分歧作 moderator，即检验同样 surprise 在高低分歧状态下是否产生不同反应。并报异常 Q、N、q̄、TI/OFI、depth、RV 和 30 分钟/次日永久性。<b>可证伪：</b>若 surprise×disagreement 不提高异常量，或 volume 在加入 OFI/depth 后不按机制衰减，则该共同生成解释变弱。<b>边界：</b>匹配非公告日与伪时点只能改善条件比较，不把分歧随机化。<Cite n={24} /><Cite n={25} /><Cite n={10} /></p>
        </div>
        <div className="research-card">
          <span>研究题 B · 机械交易需求的局部效应</span>
          <h3>指数再平衡或合约换月产生的预定需求，怎样同时改变 signed flow、depth、RV 和后续反转？</h3>
          <p><b>设计：</b>利用预先规则的权重变化，在阈值附近或窄事件窗比较高低机械 exposure（事前受规则影响的程度）。先做 first stage，也就是验证规则确实怎样改变 Q、SF/OFI、N、q̄ 与 depth；再估计 RV、价格压力与恢复。<b>Estimand：</b>规则性需求冲击的 reduced-form 总效应，即不强行指定中介路径、直接比较规则冲击对最终结果的平均差。<b>失败：</b>指数纳入也改变注意、投资者基础和长期流动性，故不能默认把两个系数的比率解释成纯 volume effect。</p>
        </div>
        <div className="research-card">
          <span>研究题 C · 严格样本外 Feature Horse Race</span>
          <h3>在真实时间顺序下，gross volume 是否提供过去 RV、订单流与流动性状态之外的稳定预测增量？</h3>
          <p><b>模型阶梯：</b>只含季节性 → HAR-RV → 加 Q/DV/TO/N/q̄/M → 再加 SF/TI/OFI/depth/duration。这个 feature horse race 是在完全相同预测日期和损失函数上逐层比较特征组。<b>协议：</b>滚动窗口固定训练长度，扩展窗口则逐日累积历史；所有标准化只在训练窗拟合，报告 QLIKE、MSE、OOS R²、置信区间与正常/压力分层。<b>可证伪：</b>若增量只在样本内、单一危机或泄漏式去趋势后出现，就判定预测命题不成立。<Cite n={35} /></p>
        </div>
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">36 · 主动练习</p>
        <h2>先写单位、时钟、方向与 estimand，再计算；每个答案都要同时说明它没有识别什么。</h2>
        <div className="practice-grid">
          <article>
            <span>练习 01 · 完整成交账本</span>
            <h3>四笔 (p,q,ε) 分别为 (100,200,+1)、(100.01,300,+1)、(100,100,−1)、(99.99,400,−1)，free float=100,000 股。求 Q、DV、TO、N、q̄、SF 与 TI。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>Q=200+300+100+400=1,000 股；DV=20,000+30,003+10,000+39,996=99,999；TO=1,000/100,000=1%；N=4；q̄=250 股/笔；SF=200+300−100−400=0；TI=0/1,000=0。SF=0 不表示沿途 OFI、报价和 RV 为零，也没有说明终点参与者风险转移。</p></details>
          </article>
          <article>
            <span>练习 02 · OFI、λ 与路径平方</span>
            <h3>两个连续子区间 OFI 为 +5,000、−5,000 股。分别在 λ=0.5 与 2 bp/1,000 股时，求净收益和 RV；忽略 u。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>深簿两段收益为 +2.5、−2.5 bp，净收益 0，RV=2.5²+2.5²=12.5 bp²；薄簿为 +10、−10 bp，净收益仍 0，RV=200 bp²。后者是前者 16 倍，因为 λ 放大 4 倍后平方。该计算只在题设固定 λ 与 OFI、忽略内生反馈时成立。</p></details>
          </article>
          <article>
            <span>练习 03 · 异常量不是信息冲击</span>
            <h3>09:30 历史条件量为 200k、实际 260k；13:30 为 100k、实际 150k。求 additive surprise，并解释为什么不能命名为 information shock。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>两者分别是 +60k 与 +50k，所以相对各自时间格均为异常放量。它仍可能来自指数再平衡、申赎、现金需求、保证金或执行排程；只有联合公告意外、OFI、depth、永久价格和持仓数据，才能改变信息机制的可信度。若用 log surprise，数值和比较还会不同。</p></details>
          </article>
          <article>
            <span>练习 04 · Hot Potato 与最终承接</span>
            <h3>A→B、B→C、C→A 各转 100 股，随后 A 向外部组 D 卖 40 股。求 Q 与 GRT<sup>end</sup>。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>Q=100+100+100+40=340 股。前三笔使 A/B/C 终点回到起点；最后 A 为 −40、D 为 +40，所以 GRT=½(|−40|+|+40|)=40 股。340 股成交只完成 40 股终点组间重配，但前三笔仍可能占用库存与深度。</p></details>
          </article>
          <article>
            <span>练习 05 · 预测 Horse Race</span>
            <h3>为“交易笔数比平均规模更能预测下一日 RV”写一个 walk-forward 检验，列出可得时点、基准、损失和否证标准。</h3>
            <details className="practice-answer"><summary>展开参考答案</summary><p>在每个交易日收盘后只使用此前数据估计 seasonality、缩尾和标准化；先拟合 HAR-RV+return+market state，再分别加入 lagged N、q̄，最后加入 Q、OFI、spread、depth。用 expanding/rolling window 预测下一日 RV，比较 QLIKE、MSE、OOS R² 和 block-bootstrap 置信区间。若 N 的增量不稳定、不显著、仅样本内存在，或被 OFI/depth 吸收，就否证“稳定预测主导”，即使 N 的同期系数显著。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">37 · 理解检查</p>
        <h2>能够从一个“放量”图形重新构造单位、方向、深度、潜在状态、反馈与证据边界，才算真正理解。</h2>
        <div className="check-grid">
          <details><summary>01 · 本节正式解决的课程问题是什么？</summary><p>解释哪些潜在机制共同生成 trading volume 与 volatility，为什么 gross activity 不能单独区分信息、分歧、风险转移和循环换手，以及如何把同期、因果、预测和福利推断分开。</p></details>
          <details><summary>02 · 为什么 volume 没有买卖方向？</summary><p>每笔成交同时有买方和卖方，标准 volume 把转移规模计一次；只有主动方签名后的 SF/TI 或含报价事件的 OFI 才描述方向压力。</p></details>
          <details><summary>03 · Q=N·q̄ 为什么具有机制意义？</summary><p>它说明相同总量可来自事件到达次数或单笔规模，两者又受拆单、制度、信息和执行策略不同影响；同时把三者当独立解释变量会产生机械共线性。</p></details>
          <details><summary>04 · Message volume、trade count 与 share volume 有何区别？</summary><p>消息可新增、取消或修改而不成交；trade count 只数 execution 次数；share volume 再把每笔成交规模相加。它们分别测技术活动、执行事件和转移单位。</p></details>
          <details><summary>05 · RV 与窗口累计收益有何区别？</summary><p>累计收益只比较起终点；RV 对路径中每段收益平方再相加，所以往返运动可使终点不变而 RV 很高。</p></details>
          <details><summary>06 · 为什么相同 Q 可以对应不同 RV？</summary><p>主动方向、OFI 路径、撤单、depth、状态依赖 λ 和其他价格创新都可以不同；Q 对这些对象没有充分信息。</p></details>
          <details><summary>07 · Unexpected volume 为什么仍不等于 information shock？</summary><p>它只是相对给定历史信息集的 activity residual，指数调仓、流动性需求、forced trading 和测量误差同样可以让它异常。</p></details>
          <details><summary>08 · 高 turnover 为什么不能证明高风险承接？</summary><p>同一库存可在中介间反复传递并多次计入 Q；真正终点承接需看参与者组 ΔX 和 GRT，同时保留过程库存与深度成本。</p></details>
          <details><summary>09 · Granger、结构因果和预测怎样区分？</summary><p>Granger 是给定模型中的时间序列增量先后；结构因果需要明确外生干预；实用预测还要求严格样本外损失改善。三者都不自动回答福利。</p></details>
          <details><summary>10 · 同期 volume 回归最多直接支持哪种命题？</summary><p>在已说明样本、时钟、变量和条件集下的 contemporaneous association。若无额外设计，不能声称 Q 导致 RV、能预测未来或改善/损害市场。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">38 · 课程接口</p>
        <h2>本节完成活动与波动的共同生成及推断防火墙；方向构造、冲击因果、日内周期、分歧来源与完整测量分别回到对应章节。</h2>
        <div className="interface-grid">
          <article><span>← 1.08</span><h3>Order Flow 与 Imbalance</h3><p>直接输入已审计的主动方符号、SF、TI 与 OFI；具体签名算法、best-level / multi-level 构造和误差不在本节重做。</p></article>
          <article><span>← 1.09</span><h3>Price Impact</h3><p>只借用 r≈λ(state)·OFI+u 说明活动必须经过方向和流动性状态才能映射为价格；temporary/permanent 与 causal impact 留在 1.09。</p></article>
          <article><span>→ 1.16</span><h3>Intraday Seasonality</h3><p>本节只把共同 U 型当作首要识别混淆；开收盘、午间、auction 和内生交易聚集为何形成完整周期，由下一节展开。</p></article>
          <article><span>→ 6.03</span><h3>Heterogeneous Beliefs</h3><p>这里把 disagreement 当潜在状态并展示加权信念中心与修正离散度的差别；分歧的来源、测量、持续和叙事反馈留给 6.03。</p></article>
          <article><span>→ 7.24</span><h3>Volatility System Measurement</h3><p>本节冻结可运算的 Q、TO、N、SF/OFI、GRT 与 RV 最小口径；噪声稳健 RV、jumps、跨场所 flow、position proxy 与误差体系留给 7.24。</p></article>
        </div>
        <p className="closing-thesis">看到“放量伴随高波动”时，应依次追问：量是 Q、DV、TO、N、q̄ 还是 message volume；每笔成交按什么规则计数；活动是否有签名，SF/OFI 与 depth 怎样；价格结果是净收益、|R|、R²、RV 还是 √RV；潜在信息、分歧、流动性需求与容量约束是否共同改变目标持仓和市场时钟；高 turnover 是否对应真实终点风险转移；日内周期是否只用过去样本去除；证据支持的是同期共同生成、局部结构因果、严格样本外预测还是福利。只有这些层级闭合，volume 才不再被误当作信息、方向、冲击或资本容量的万能代理。</p>
      </section>
    </>
  );
}

export const lesson115: LessonRecord = {
  slug: '1-15',
  id: '1.15',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'Trading Volume 与 Volatility 的关系',
  subtitle: '从无方向活动、订单压力和终点风险转移出发，用潜在信息状态、异质信念、state-dependent impact 与反馈链解释：成交量与实现波动率为什么经常共同上升，又为什么不能互作因果代理',
  readingTime: '约 105–115 分钟（核心阅读 63–67＋互动 14–15＋主动练习 18–20＋理解检查 8–11＋课程接口 2；参考文献与延伸阅读不计）',
  prerequisite: '1.08 · Order Flow 与 Order Flow Imbalance；1.09 · Price Impact：订单为什么推动价格',
  updatedAt: '2026-08-28',
  revision: '1.15-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.15-r1',
      summary: '确认总体机制框架成立；要求修正 hot-potato 闭环账本、GRT 的清算与暴露适用条件、no-trade 初始配置假设、trade-clock 收益索引及互动相关题的识别强度，并精确 Q=N·q̄、零值对数、MDH、Copeland、信念出清、Gallant–Rossi–Tauchen、Berry–Howe 与 Diks–Panchenko 的口径和书目信息。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.15-r1',
      summary: '确认主线、反例与练习方向成立；要求为零背景读者即时解释 estimand/do、CARA–Normal、HAR/OOS、QLIKE、固定效应等术语，拆开噪声掩护与中介库存两种机制，减少案例和互动题复述，并让两种互动模式按顺序迁移、显示完成状态且避免重复屏幕朗读。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.15-r2',
      summary: '确认 r1 的 5 项重大与 10 项次要准确性问题全部关闭，公式、算例、练习、互动答案、37 条来源和关键经验数字均通过；要求进一步区分增量预测信息与已识别状态，声明 CARA–Normal 的无风险收益归一化及复合权重，处理 GRT 比率和零成交 trade-clock 分母，并采用官方约 15 秒窗口口径。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'changes-requested',
      revision: '1.15-r2',
      summary: '确认 r1 的全部结构性教学意见关闭，39 节认知坡度、案例、反例、练习、检查、互动主路径、阅读预算与可访问性总体通过；要求为五组公式补齐逐符号解释，并按八个 scenario ID 记录真实提交进度，防止自由跳题后过早宣称两种模式已完成。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.15-r3',
      summary: '最终全量复审确认 r1 与 r2 的全部问题均已关闭；随机业务时间、MDH、CARA–Normal、GRT、OFI、trade-clock、预测与季节性公式，5 项练习、8 道互动题、37 条来源、关键经验数字、推断边界和导航全部通过，未发现 blocker、major 或 minor。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-28',
      decision: 'approved',
      revision: '1.15-r3',
      summary: '最终全量复审确认公式逐符号解释与八题真实提交追踪全部关闭，顺序、跳题、跨模式、重答、完成和重启路径均成立；39 节认知坡度、案例、反例、练习、检查、阅读预算、可访问性、18 张阅读卡和课程接口全部通过，未发现 blocker、major 或 minor。',
    },
  ],
  previous: { slug: '1-14', label: '1.14 Liquidity Provider Competition 与 HFT' },
  next: { slug: '1-16', label: '1.16 Intraday Seasonality' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'inference-map', label: '共同生成系统' },
    { id: 'scope-contract', label: '范围契约' },
    { id: 'trade-accounting', label: '一笔成交的账本' },
    { id: 'share-dollar-turnover', label: 'Share / Dollar / Turnover' },
    { id: 'trade-count-size', label: 'Trade Count 与 Size' },
    { id: 'message-versus-execution', label: 'Message 与 Execution' },
    { id: 'signed-flow-ofi', label: 'Signed Flow 与 OFI' },
    { id: 'end-risk-transfer', label: '终点风险转移' },
    { id: 'volatility-ledger', label: 'Volatility 账本' },
    { id: 'clocks-horizons', label: '时钟与 Horizon' },
    { id: 'four-inferences', label: '四种推断' },
    { id: 'latent-state', label: '随机业务时间' },
    { id: 'mdh-identification', label: 'MDH 识别边界' },
    { id: 'sequential-information', label: '顺序信息到达' },
    { id: 'trade-not-necessary', label: '信息不必先成交' },
    { id: 'belief-dispersion', label: '加权信念与分歧' },
    { id: 'liquidity-noise-risk-sharing', label: '非信息交易' },
    { id: 'expected-unexpected-volume', label: 'Expected / Unexpected' },
    { id: 'minimal-price-map', label: '最小价格映射' },
    { id: 'same-volume-different-volatility', label: '同量不同波动' },
    { id: 'path-endpoint', label: '路径与终点' },
    { id: 'transaction-clock-decomposition', label: '交易时钟分解' },
    { id: 'trade-count-evidence', label: '笔数证据冲突' },
    { id: 'asymmetries', label: '三种非对称' },
    { id: 'reverse-causality', label: '反向因果' },
    { id: 'feedback-loop', label: '反馈符号' },
    { id: 'lead-lag-forecasting', label: 'Lead–Lag 与预测' },
    { id: 'common-seasonality', label: '共同季节性' },
    { id: 'evidence-map', label: '证据地图' },
    { id: 'empirical-synthesis', label: '实证综合' },
    { id: 'four-cases', label: '四个真实案例' },
    { id: 'data-estimation', label: '数据与估计协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'counterexamples', label: '反例库' },
    { id: 'research-design', label: '可证伪研究' },
    { id: 'practice', label: '主动练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
  ],
  Content: Lesson115Content,
  references: [
    { id: 1, authors: 'Andrew W. Lo & Jiang Wang', year: '2000', title: 'Trading Volume: Definitions, Data Analysis, and Implications of Portfolio Theory', publication: 'Review of Financial Studies, 13(2), 257–300', url: 'https://doi.org/10.1093/rfs/13.2.257', use: '冻结 volume 与 turnover 的定义、组合层级和跨证券比较边界；不把其 portfolio-theory 检验外推为微观结构因果。' },
    { id: 2, authors: 'Peter K. Clark', year: '1973', title: 'A Subordinated Stochastic Process Model with Finite Variance for Speculative Prices', publication: 'Econometrica, 41(1), 135–155', url: 'https://doi.org/10.2307/1913889', use: '提供随机业务时间/信息时钟共同生成价格变化的经典起点；subordination 是结构表示，不是直接观测的信息流。' },
    { id: 3, authors: 'Thomas W. Epps & Mary Lee Epps', year: '1976', title: 'The Stochastic Dependence of Security Price Changes and Transaction Volumes: Implications for the Mixture-of-Distributions Hypothesis', publication: 'Econometrica, 44(2), 305–321', url: 'https://doi.org/10.2307/1912726', use: '连接价格变化与成交量的联合随机依赖和 mixing-variable 解释；历史数据与分布限制不可忽略。' },
    { id: 4, authors: 'George E. Tauchen & Mark Pitts', year: '1983', title: 'The Price Variability-Volume Relationship on Speculative Markets', publication: 'Econometrica, 51(2), 485–505', url: 'https://doi.org/10.2307/1912002', use: '提供价格方差、成交量、交易者数量和市场扩张的均衡框架，并给出量升而方差降的条件反例。' },
    { id: 5, authors: 'Torben G. Andersen', year: '1996', title: 'Return Volatility and Trading Volume: An Information Flow Interpretation of Stochastic Volatility', publication: 'Journal of Finance, 51(1), 169–204', url: 'https://doi.org/10.1111/j.1540-6261.1996.tb05206.x', use: '比较标准 MDH 与含信息不对称、流动性需求和 volume noise 的修正解释；模型拟合不作唯一机制识别。' },
    { id: 6, authors: 'Jonathan M. Karpoff', year: '1987', title: 'The Relation between Price Changes and Trading Volume: A Survey', publication: 'Journal of Financial and Quantitative Analysis, 22(1), 109–126', url: 'https://doi.org/10.2307/2330874', use: '综述量与价格变化幅度的经验关系和早期理论；作为问题地图，不把综述规律写成无条件因果。' },
    { id: 7, authors: 'Thomas E. Copeland', year: '1976', title: 'A Model of Asset Trading Under the Assumption of Sequential Information Arrival', publication: 'Journal of Finance, 31(4), 1149–1168', url: 'https://doi.org/10.2307/2326280', use: '提供信息按随机顺序扩散并共同生成中间交易与价格修正的模型基准；现代同步公共信息是重要边界。' },
    { id: 8, authors: 'Paul Milgrom & Nancy Stokey', year: '1982', title: 'Information, Trade and Common Knowledge', publication: 'Journal of Economic Theory, 26(1), 17–27', url: 'https://doi.org/10.1016/0022-0531(82)90046-1', use: '用 no-trade benchmark 说明私人信息本身不足以必然生成成交；结论依赖共同先验、理性与纯信息交易等严格条件。' },
    { id: 9, authors: 'Milton Harris & Artur Raviv', year: '1993', title: 'Differences of Opinion Make a Horse Race', publication: 'Review of Financial Studies, 6(3), 473–506', url: 'https://doi.org/10.1093/rfs/5.3.473', use: '说明共同信息在差异化解释下可同时生成 volume、绝对价格变化与动态规律；DOI 的卷号字段按 OUP 官方登记保留。' },
    { id: 10, authors: 'Eugene Kandel & Neil D. Pearson', year: '1995', title: 'Differential Interpretation of Public Signals and Trade in Speculative Markets', publication: 'Journal of Political Economy, 103(4), 831–872', url: 'https://doi.org/10.1086/262005', use: '用盈利公告和分析师预测修订支持公共信号的异质解释；分析师分歧不是所有投资者信念的无误差代理。' },
    { id: 11, authors: 'Jiang Wang', year: '1994', title: 'A Model of Competitive Stock Trading Volume', publication: 'Journal of Political Economy, 102(1), 127–168', url: 'https://doi.org/10.1086/261924', use: '把信息、非信息交易和动态均衡量放进统一框架；模型对象用于机制组织，不作现实主体动机分类器。' },
    { id: 12, authors: 'John Y. Campbell, Sanford J. Grossman & Jiang Wang', year: '1993', title: 'Trading Volume and Serial Correlation in Stock Returns', publication: 'Quarterly Journal of Economics, 108(4), 905–939', url: 'https://doi.org/10.2307/2118454', use: '说明风险厌恶中介吸收非信息流时，高量价格压力可伴随后续反转；动态经验关系不是单笔动机识别。' },
    { id: 13, authors: 'Guillermo Llorente, Roni Michaely, Gideon Saar & Jiang Wang', year: '2002', title: 'Dynamic Volume-Return Relation of Individual Stocks', publication: 'Review of Financial Studies, 15(4), 1005–1047', url: 'https://doi.org/10.1093/rfs/15.4.1005', use: '比较高量价格变化的延续/反转与信息、流动性交易代理；属于模型和代理变量的联合检验。' },
    { id: 14, authors: 'Albert S. Kyle', year: '1985', title: 'Continuous Auctions and Insider Trading', publication: 'Econometrica, 53(6), 1315–1335', url: 'https://doi.org/10.2307/1913210', use: '说明 noise orders 如何为知情交易提供掩护并让做市商从聚合流推断信息；不把 Kyle λ 与任意经验冲击系数混称。' },
    { id: 15, authors: 'Fischer Black', year: '1986', title: 'Noise', publication: 'Journal of Finance, 41(3), 528–543', url: 'https://doi.org/10.1111/j.1540-6261.1986.tb04513.x', use: '提供 noise trading 维持市场活动同时允许价格偏离的概念框架；noise 不是对交易者智力或福利的直接评价。' },
    { id: 16, authors: 'Rama Cont, Arseniy Kukanov & Sasha Stoikov', year: '2014', title: 'The Price Impact of Order Book Events', publication: 'Journal of Financial Econometrics, 12(1), 47–88', url: 'https://doi.org/10.1093/jjfinec/nbt003', use: '提供 OFI、短周期中间价变化与深度反向冲击系数的经验接口；同期解释率含构造接近和内生性，不作外生因果。' },
    { id: 17, authors: 'Charles M. Jones, Gautam Kaul & Marc L. Lipson', year: '1994', title: 'Transactions, Volume, and Volatility', publication: 'Review of Financial Studies, 7(4), 631–651', url: 'https://doi.org/10.1093/rfs/7.4.631', use: '在历史 Nasdaq 样本中把 volume 分成 trade count 与 average size 并发现笔数占主导；结论限于目标、样本与制度。' },
    { id: 18, authors: 'Kalok Chan & Wai-Ming Fong', year: '2000', title: 'Trade Size, Order Imbalance, and the Volatility–Volume Relation', publication: 'Journal of Financial Economics, 57(2), 247–273', url: 'https://doi.org/10.1016/S0304-405X(00)00057-X', use: '说明 size bins 与 order imbalance 会改变简单量价关系，并与 JKL 形成有解释力的条件冲突。' },
    { id: 19, authors: 'Choon Chat Chan & Wai Mun Fong', year: '2006', title: 'Realized Volatility and Transactions', publication: 'Journal of Banking & Finance, 30(7), 2063–2085', url: 'https://doi.org/10.1016/j.jbankfin.2005.05.021', use: '以 5 分钟收益构造日 realized volatility，重新支持 trade count 主导；单变量解释率不得读作因果份额。' },
    { id: 20, authors: 'Alfonso Dufour & Robert F. Engle', year: '2000', title: 'Time and the Price Impact of a Trade', publication: 'Journal of Finance, 55(6), 2467–2498', url: 'https://doi.org/10.1111/0022-1082.00297', use: '把交易间隔、signed trade persistence 与价格调整速度联系起来；说明 duration 是状态而非可忽略采样细节。' },
    { id: 21, authors: 'Hendrik Bessembinder & Paul J. Seguin', year: '1993', title: 'Price Volatility, Trading Volume, and Market Depth: Evidence from Futures Markets', publication: 'Journal of Financial and Quantitative Analysis, 28(1), 21–39', url: 'https://doi.org/10.2307/2331149', use: '分离期货 expected/unexpected volume 与 open interest，支持活动意外和深度需并读；残差不是天然信息冲击。' },
    { id: 22, authors: 'A. Ronald Gallant, Peter E. Rossi & George Tauchen', year: '1992', title: 'Stock Prices and Volume', publication: 'Review of Financial Studies, 5(2), 199–242', url: 'https://doi.org/10.1093/rfs/5.2.199', use: '刻画 1928–1987 年 16,127 个交易日中 S&P Composite price change 与 total NYSE share volume 的联合条件动态；日历/趋势调整、市场聚合和制度漂移限制结构解释。' },
    { id: 23, authors: 'Christopher G. Lamoureux & William D. Lastrapes', year: '1990', title: 'Heteroskedasticity in Stock Return Data: Volume versus GARCH Effects', publication: 'Journal of Finance, 45(1), 221–229', url: 'https://doi.org/10.1111/j.1540-6261.1990.tb05088.x', use: '在 20 只股票的 1981–1985 年日频样本中显示加入同期 volume 后拟合的 GARCH persistence 下降；不把该变化解释为 volume 干预或共同状态已被识别。' },
    { id: 24, authors: 'Thomas D. Berry & Keith M. Howe', year: '1994', title: 'Public Information Arrival', publication: 'Journal of Finance, 49(4), 1331–1346', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb02456.x', use: '用 Reuters 新闻流检验公共信息到达，显示新闻数与 volume 中等相关而与 volatility 不显著；条数不衡量 surprise 或重要性。' },
    { id: 25, authors: 'William H. Beaver', year: '1968', title: 'The Information Content of Annual Earnings Announcements', publication: 'Journal of Accounting Research, 6, Empirical Research in Accounting: Selected Studies, 67–92', url: 'https://doi.org/10.2307/2490070', use: '提供盈利公告周 volume 与价格变动幅度异常的经典事件证据；周频历史窗口不作现代高频因果外推。' },
    { id: 26, authors: 'Kenneth R. French & Richard Roll', year: '1986', title: 'Stock Return Variances: The Arrival of Information and the Reaction of Traders', publication: 'Journal of Financial Economics, 17(1), 5–26', url: 'https://doi.org/10.1016/0304-405X(86)90004-8', use: '比较交易与非交易时段方差并讨论公共信息、私人信息和交易噪声渠道；开闭市不是单一 volume 干预。' },
    { id: 27, authors: 'Michael J. Barclay, Robert H. Litzenberger & Jerold B. Warner', year: '1990', title: 'Private Information, Trading Volume, and Stock-Return Variances', publication: 'Review of Financial Studies, 3(2), 233–253', url: 'https://doi.org/10.1093/rfs/3.2.233', use: '利用东京星期六制度说明交易机会可重排波动时点而不提高周方差；制度同时改变多条渠道。' },
    { id: 28, authors: 'Anat R. Admati & Paul Pfleiderer', year: '1988', title: 'A Theory of Intraday Patterns: Volume and Price Variability', publication: 'Review of Financial Studies, 1(1), 3–40', url: 'https://doi.org/10.1093/rfs/1.1.3', use: '说明 informed 与 liquidity traders 的策略互动可内生形成 volume/volatility 聚集；完整日内机制留给 1.16。' },
    { id: 29, authors: 'F. Douglas Foster & S. Viswanathan', year: '1993', title: 'Variations in Trading Volume, Return Volatility, and Trading Costs: Evidence on Recent Price Formation Models', publication: 'Journal of Finance, 48(1), 187–211', url: 'https://doi.org/10.1111/j.1540-6261.1993.tb04706.x', use: '记录 volume、volatility、trading cost 的日内和星期共同规律及反例；季节性不等于单一信息率。' },
    { id: 30, authors: 'Torben G. Andersen & Tim Bollerslev', year: '1997', title: 'Intraday Periodicity and Volatility Persistence in Financial Markets', publication: 'Journal of Empirical Finance, 4(2–3), 115–158', url: 'https://doi.org/10.1016/S0927-5398(97)00004-2', use: '说明未建模的日内周期会扭曲 volatility persistence；本节只使用其识别警告。' },
    { id: 31, authors: 'Pierre Giot, Sébastien Laurent & Mikael Petitjean', year: '2010', title: 'Trading Activity, Realized Volatility and Jumps', publication: 'Journal of Empirical Finance, 17(1), 168–175', url: 'https://doi.org/10.1016/j.jempfin.2009.07.001', use: '把 RV 分成 continuous 与 jump components，显示经典正向量价关系不覆盖 jumps；识别依赖采样和 jump estimator。' },
    { id: 32, authors: 'Craig Hiemstra & Jonathan D. Jones', year: '1994', title: 'Testing for Linear and Nonlinear Granger Causality in the Stock Price–Volume Relation', publication: 'Journal of Finance, 49(5), 1639–1664', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb04776.x', use: '提供广为引用的非线性 Granger 结果；必须与后续 size-distortion 批评并读。' },
    { id: 33, authors: 'Cees Diks & Valentyn Panchenko', year: '2005', title: 'A Note on the Hiemstra–Jones Test for Granger Non-Causality', publication: 'Studies in Nonlinear Dynamics & Econometrics, 9(2), Article 4, 1–7', url: 'https://doi.org/10.2202/1558-3708.1234', use: '证明 Hiemstra–Jones 检验可在零假设下严重过度拒绝；用于建立统计检验审计习惯。' },
    { id: 34, authors: 'Cees Diks & Valentyn Panchenko', year: '2006', title: 'A New Statistic and Practical Guidelines for Nonparametric Granger Causality Testing', publication: 'Journal of Economic Dynamics and Control, 30(9–10), 1647–1669', url: 'https://doi.org/10.1016/j.jedc.2005.08.008', use: '提出修正非参数 Granger 统计量并显示 volume→return 的方向证据减弱；Granger 仍不是结构因果。' },
    { id: 35, authors: 'Neda Todorova & Michael Souček', year: '2014', title: 'The Impact of Trading Volume, Number of Trades and Overnight Returns on Forecasting the Daily Realized Range', publication: 'Economic Modelling, 36, 332–340', url: 'https://doi.org/10.1016/j.econmod.2013.10.003', use: '在 26 只 DAX 股票 HAR 预测中发现 volume/trade count 样本外增量不显著；结论限于市场、样本和日度 horizon。' },
    { id: 36, authors: 'CFTC & U.S. Securities and Exchange Commission Staffs', year: '2010', title: 'Findings Regarding the Market Events of May 6, 2010', publication: 'Joint Staff Report, September 30, 2010', url: 'https://www.sec.gov/news/studies/2010/marketevents-report.pdf', use: '提供 Flash Crash 的订单、时间、depth 和 hot-potato 过程数字；属于单一极端事件的官方 staff findings。' },
    { id: 37, authors: 'Andrei Kirilenko, Albert S. Kyle, Mehrdad Samadi & Tugkan Tuzun', year: '2017', title: 'The Flash Crash: High-Frequency Trading in an Electronic Market', publication: 'Journal of Finance, 72(3), 967–998', url: 'https://doi.org/10.1111/jofi.12498', use: '用 E-mini 审计轨迹分析参与者类型、成交循环和库存路径；不把条件事件机制外推为 HFT 一般因果。' },
  ],
  readingList: [
    { title: 'Lo & Wang (2000), Trading Volume: Definitions, Data Analysis, and Implications of Portfolio Theory', scope: 'volume 定义、turnover、组合层级与数据比较', reason: '先建立“量不是一个天然唯一变量”的测量纪律。', url: 'https://doi.org/10.1093/rfs/13.2.257' },
    { title: 'Karpoff (1987), The Relation between Price Changes and Trading Volume: A Survey', scope: '早期经验事实、模型分类和未决问题', reason: '快速获得经典量价研究的全景，并练习把综述事实与因果区分。', url: 'https://doi.org/10.2307/2330874' },
    { title: 'Clark (1973), A Subordinated Stochastic Process Model', scope: '随机时钟、价格创新与有限方差过程', reason: '理解 calendar time 为什么不是均匀经济时间。', url: 'https://doi.org/10.2307/1913889' },
    { title: 'Tauchen & Pitts (1983), The Price Variability–Volume Relationship', scope: '交易者数量、价格方差、成交量与市场扩张', reason: '看到同一理论怎样容纳量价正相关和长期量升方差降的反例。', url: 'https://doi.org/10.2307/1912002' },
    { title: 'Andersen (1996), Return Volatility and Trading Volume', scope: 'MDH、潜在信息流、流动性交易与 volume noise', reason: '学习标准共同潜变量模型为什么需要现实摩擦修正。', url: 'https://doi.org/10.1111/j.1540-6261.1996.tb05206.x' },
    { title: 'Milgrom & Stokey (1982), Information, Trade and Common Knowledge', scope: 'no-trade theorem 的假设、逻辑和现实破口', reason: '防止把“有信息”机械推成“必有成交”。', url: 'https://doi.org/10.1016/0022-0531(82)90046-1' },
    { title: 'Harris & Raviv (1993), Differences of Opinion Make a Horse Race', scope: '共同信号、差异解释、价格与 volume 动态', reason: '理解加权信念中心与持仓修正离散度为什么生成不同结果。', url: 'https://doi.org/10.1093/rfs/5.3.473' },
    { title: 'Campbell, Grossman & Wang (1993), Trading Volume and Serial Correlation in Stock Returns', scope: '风险厌恶中介、流动性压力与后续反转', reason: '把高量价格变化的动态方向连接到交易动机。', url: 'https://doi.org/10.2307/2118454' },
    { title: 'Llorente et al. (2002), Dynamic Volume–Return Relation of Individual Stocks', scope: '信息型与流动性型交易的条件性延续/反转', reason: '学习怎样把理论异号预测转成可检验动态关系并审计代理变量。', url: 'https://doi.org/10.1093/rfs/15.4.1005' },
    { title: 'Jones, Kaul & Lipson (1994), Transactions, Volume, and Volatility', scope: 'trade count、average size 与日绝对收益', reason: '理解“交易笔数主导”结论的原始样本和制度边界。', url: 'https://doi.org/10.1093/rfs/7.4.631' },
    { title: 'Chan & Fong (2000), Trade Size, Order Imbalance, and the Volatility–Volume Relation', scope: 'size bins、签名不平衡与 NYSE/Nasdaq 差异', reason: '与 JKL 对读，观察条件变量和市场结构怎样改变答案。', url: 'https://doi.org/10.1016/S0304-405X(00)00057-X' },
    { title: 'Chan & Fong (2006), Realized Volatility and Transactions', scope: '5 分钟 RV、trade count、size 与 imbalance 的增量', reason: '理解更换 volatility target 后经验结论怎样重新排序。', url: 'https://doi.org/10.1016/j.jbankfin.2005.05.021' },
    { title: 'Cont, Kukanov & Stoikov (2014), The Price Impact of Order Book Events', scope: 'OFI、midquote、depth 与短窗口线性关系', reason: '把无符号 volume 推进到方向压力和状态依赖吸收。', url: 'https://doi.org/10.1093/jjfinec/nbt003' },
    { title: 'Bessembinder & Seguin (1993), Price Volatility, Trading Volume, and Market Depth', scope: '期货 expected/unexpected volume 与 open interest', reason: '学习异常活动与容量存量为什么必须分开。', url: 'https://doi.org/10.2307/2331149' },
    { title: 'Berry & Howe (1994), Public Information Arrival', scope: 'Reuters 新闻流、日内季节性、volume 与 volatility', reason: '直接观察粗新闻数量为什么不是信息强度的充分统计量。', url: 'https://doi.org/10.1111/j.1540-6261.1994.tb02456.x' },
    { title: 'Barclay, Litzenberger & Warner (1990), Private Information, Trading Volume, and Stock-Return Variances', scope: '东京星期六交易、周末方差与周方差', reason: '区分波动被创造和波动被重新安排到可交易时段。', url: 'https://doi.org/10.1093/rfs/3.2.233' },
    { title: 'Diks & Panchenko (2006), A New Statistic for Nonparametric Granger Causality', scope: 'HJ 检验过度拒绝、修正统计量与实务选择', reason: '建立“著名显著结果也必须审计检验尺寸”的研究习惯。', url: 'https://doi.org/10.1016/j.jedc.2005.08.008' },
    { title: 'Todorova & Souček (2014), Trading Activity and Forecasting the Daily Realized Range', scope: 'HAR、volume/trade count 与严格样本外增量', reason: '用直接零结果阻止从强同期关系跳到预测承诺。', url: 'https://doi.org/10.1016/j.econmod.2013.10.003' },
  ],
};
