import RiskParityLab from '../components/RiskParityLab';
import { riskParityScenarios } from '../components/riskParityScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson212Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>Risk parity 不是把资本平均分给资产，也不是“低波动资产多买一点”这句口号；它先用同口径协方差把组合风险分解，再令“当前权重 × 边际风险”匹配目标预算，求出资产间相对构成 q。</h2>
        <p>
          一项资产的 standalone volatility 只描述它单独波动多大；真正进入组合的是它与整个组合怎样共同运动。因而 50% 股票／50% 债券的资本权重可以对应极不对称的风险份额，三项资产即使都用 inverse-volatility 权重，也会因相关网络不同而不再 equal risk contribution。Risk parity 的核心对象是基于给定风险度量和协方差模型的 ex-ante allocation，不是未来损失概率、预期收益最优解或尾部保护保证。<Cite n={3} /><Cite n={4} />
        </p>
        <p>
          本节把两层严格拆开：q 决定 risky basket 内部怎样分；2.11 的 g 决定整个 basket 做多大。随后价格、现金流与保证金先形成 post-shock actual，target−actual 才成为带符号订单，fill 才是成交。没有真实载体、当前仓位、NAV、净额和执行数据，理论风险贡献变化不能被直接翻译成市场流量。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">01 · 范围、先修与排除项</p>
        <h2>硬先修是 T03 与 2.11 的目标—实际—订单语法；本节只回答“跨资产相对权重怎样由风险贡献产生”，不提前讲宏观观点、VaR 治理或系统性 fire sale。</h2>
        <div className="learning-objectives">
          <span>导论＋六阶段学习路线 · 从协方差到候选订单</span>
          <ol>
            <li><b>导论定位（00–02）：</b>冻结对象、时钟和课程边界，先看完整配置链。</li>
            <li><b>拆解组合风险（03–13）：</b>从 portfolio volatility 依次得到 MRC、RC、PCR 与 risk budget。</li>
            <li><b>由贡献求权重（14–24）：</b>区分 ERC、inverse-vol、equal weight、minimum variance 与一般预算；21 为进阶证明选读。</li>
            <li><b>进入可实现世界（25–35）：</b>处理可行域、约束、估计误差、q 更新与 target／flow 边界。</li>
            <li><b>对象与模型边界（36–42）：</b>分开 asset risk、factor risk、非线性工具、收益观点和 Global Macro。</li>
            <li><b>反例、证据与研究（43–51）：</b>检验分散化、杠杆、股债相关状态、容量和可证伪性。</li>
            <li><b>实验与闭环（52–55）：</b>用 10+10 道题、12 道检查和接口复述整条机制。</li>
          </ol>
          <p><b>核心缩写桥：</b>MRC 是 marginal risk contribution（边际风险贡献）；RC 是 component／total risk contribution（成分／总风险贡献）；PCR 是 percentage risk contribution（百分比风险贡献）；ERC 是 equal risk contribution（等风险贡献）。其余方法和优化术语只在首次出现处定义，不构成本节先修。</p>
          <p><b>符号桥：</b>q 是和为 1 的相对资产构成；g≥0 是整个 risky basket 的共同倍率，最终目标 w*=gq。σ<sub>p</sub> 是组合事前波动；b<sub>i</sub> 是目标风险份额，不是金额、最大亏损或机构 limit。Target composition、post-shock actual、order 与 fill 属于四个不同状态。</p>
          <p><b>排除项：</b>2.11 已讲波动估计器、总倍率、现金／融资腿和成交；2.13 才解释增长、通胀、政策与方向观点；2.16 才处理 VaR／ES、限额、授权与 breach；Chapter 7 才聚合共同调仓、市场深度和价格反馈。本节不把 tail-risk parity、期权 Greeks、完整因子模型或聚类算法扩张成主线。</p>
        </div>
      </section>

      <section className="lesson-section" id="allocation-chain">
        <p className="section-kicker">02 · 完整配置链</p>
        <h2>Risk-parity agent 的最小状态链是“截至决策前的数据—协方差—风险贡献—预算—可行权重—外层规模—实际仓位差—成交接口”，任何跳步都会把模型对象误写成市场事实。</h2>
        <div className="mechanism-chain" aria-label="风险平价从数据到订单接口的八步因果链">
          <div><span>01</span><b>冻结宇宙与时钟</b><p>声明资产、币种、收益频率、估计截止和生效日。</p></div>
          <div><span>02</span><b>估计并校验 Σ</b><p>统一单位，检查 symmetry、PSD（半正定，即模型不会给出负方差）、缺失值和版本。</p></div>
          <div><span>03</span><b>分解当前风险</b><p>由 σp、MRC、RC 得到可加总的 PCR。</p></div>
          <div><span>04</span><b>声明预算 b</b><p>ERC 令 b=1/N；一般 risk budget 可不相等。</p></div>
          <div><span>05</span><b>求相对构成 q</b><p>在 long-only、bounds、groups 与 tolerance 下求解。</p></div>
          <div><span>06</span><b>可选外层倍率 g</b><p>把相对篮子同比缩放，但不改变其 PCR。</p></div>
          <div><span>07</span><b>更新 actual</b><p>价格、P&amp;L、FX、现金流和 margin 先改变真实状态。</p></div>
          <div><span>08</span><b>进入执行接口</b><p>Target−actual 生成候选订单；fill 才能改变仓位。</p></div>
        </div>
        <p>
          求解器把风险预算映射为目标构成，却不观察真实成交；额外约束还可能令预算不可达。研究时必须保存 covariance vintage、目标与实现 PCR、active constraints、candidate order 和 fill，不能用一个“risk parity weight”覆盖全部中间状态。<Cite n={5} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="definition">
        <p className="section-kicker">阶段一 · 拆解组合风险　|　03 · Risk Parity 的最小定义</p>
        <h2>本节把标准核心定义为 volatility-based ERC：每项资产对组合预测波动的成分贡献相等；“risk parity”在产品世界却是一个家族名，必须先读具体规则。</h2>
        <p>
          学术 ERC 使用完整 covariance，并要求每项 RC 相同；一般 risk budgeting 则令 RC 按预先给定的 b 分配。Inverse-vol、两层 inverse-vol、HRP、factor parity 和带目标波动的指数都可能被市场语言归入“risk parity”，但优化对象并不相同。S&amp;P 2025 年现行合并方法就是直接证据：传统家族在类内和类间使用逆实现波动率，2.0 家族才使用协方差与贡献优化器。<Cite n={4} /><Cite n={36} />
        </p>
        <p>
          因而阅读任何产品时先问四件事：风险度量是什么，贡献按资产还是分组计算，相关性是否进入求解，是否另有 target-vol multiplier。名称不能代替数学对象，方法书也不能代替真实基金持仓。
        </p>
      </section>

      <section className="lesson-section" id="capital-vs-risk-weight">
        <p className="section-kicker">04 · Capital Weight 与 Risk Weight</p>
        <h2>资本权重回答“投了多少钱”，风险贡献回答“当前 covariance 模型下这项持仓把多少组合风险带进来”；两者只有在特殊结构下才重合。</h2>
        <p>
          两个零相关资产若波动分别为 10% 与 20%，各投 50%，它们的 variance contributions 与 q²σ² 成正比，即 0.0025 与 0.01，风险份额为 20% 与 80%。低波动资产获得更高资本权重，不是偏爱它的收益，而是为了让每单位资本承担的风险更接近预算。Qian 的早期 60/40 讨论正是用这种错位解释传统组合的风险集中，但它是行业研究，不是普适绩效定理。<Cite n={35} />
        </p>
        <p>
          风险权重也不是“这项资产未来造成亏损的概率”。它是给定持仓、协方差与风险度量下的局部分解；换估计窗口、币种或资产宇宙，贡献就会改变。
        </p>
      </section>

      <section className="lesson-section" id="portfolio-volatility">
        <p className="section-kicker">05 · Portfolio Volatility</p>
        <h2>组合波动由每项自身 variance 与所有 covariance 共同决定；只看单体波动，等于把资产之间怎样共同运动从模型中删除。</h2>
        <div className="equation-card">
          <span>同口径 covariance 下的组合波动</span>
          <div>V(q)=q′Σ̂q；　σ<sub>p</sub>(q)=√(q′Σ̂q)</div>
          <p>q∈ℝⁿ 是带符号 exposure；Σ̂ 是截至决策前、同币种／同频率／同持有期／同年化的对称 PSD 协方差矩阵。PSD 的直白含义是任意 q 都满足 q′Σ̂q≥0，因此模型不会算出负方差。V&gt;0 时后续导数才有定义。Variance 对 q 是二阶齐次，volatility 是一阶齐次；本式不包含 expected return、liquidity 或跳跃损失。</p>
        </div>
        <p>
          展开两资产情形可见 V=q₁²σ₁²+q₂²σ₂²+2q₁q₂cov₁₂。正 covariance 抬高共同风险，负 covariance 可提供 hedge；但历史负相关不是结构承诺，估计时钟和制度状态必须另行审计。<Cite n={1} />
        </p>
      </section>

      <section className="lesson-section" id="euler-decomposition">
        <p className="section-kicker">06 · Euler 可加性</p>
        <h2>风险贡献能够加总，不是因为资产风险天然可切割，而是因为可微的一阶齐次风险度量满足 Euler 恒等式。</h2>
        <div className="equation-card">
          <span>Volatility 的 Euler 分解</span>
          <div>σ<sub>p</sub>(q)=Σ<sub>i</sub> q<sub>i</sub> · ∂σ<sub>p</sub>/∂q<sub>i</sub></div>
          <p>要求 σp 在当前非零组合可微，并对正尺度 c 满足 σp(cq)=cσp(q)。恒等式把“局部斜率 × 当前规模”加总回总波动；它是模型内 allocation，不证明各项冲击在现实中独立或可因果归属。</p>
        </div>
        <p>
          Euler principle 广泛用于经济资本分配；一旦风险度量非光滑、组合处在零风险点或模型包含离散非线性，梯度可能不存在或不唯一。不能先选一个分解再把它当自然事实。<Cite n={2} /><Cite n={3} />
        </p>
      </section>

      <section className="lesson-section" id="marginal-risk-contribution">
        <p className="section-kicker">07 · Marginal Risk Contribution</p>
        <h2>MRC 是把某一权重提高一个极小单位时组合波动的局部斜率；它没有乘当前持仓，因此既不是该资产已经占了多少风险，也不应直接相加。</h2>
        <div className="equation-card">
          <span>边际风险贡献</span>
          <div>MRC<sub>i</sub>=∂σ<sub>p</sub>/∂q<sub>i</sub>=(Σ̂q)<sub>i</sub>/σ<sub>p</sub></div>
          <p>MRC 的单位是“组合波动／一单位权重”；(Σq)i 是资产 i 与整个组合的 covariance。若 q_i=0，MRC 仍可非零，因为它回答加入一点该资产会怎样；若 σp=0，分母使该定义失效。</p>
        </div>
        <p>
          同一资产的 MRC 会随其余组合改变：一只波动不高却与所有现仓高度正相关的资产，边际风险可以很大；一项 standalone volatility 较高但与组合负相关的 hedge，MRC 可以为负。<Cite n={4} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="component-risk-contribution">
        <p className="section-kicker">08 · Component / Total Risk Contribution</p>
        <h2>RC 把 MRC 乘回当前权重，才得到这项持仓在当前组合中分到的波动量；variance contribution 则必须守住二阶齐次带来的 factor-of-two。</h2>
        <div className="equation-card">
          <span>Volatility RC 与可加 variance component</span>
          <div>RC<sub>i</sub>=q<sub>i</sub>MRC<sub>i</sub>=q<sub>i</sub>(Σ̂q)<sub>i</sub>/σ<sub>p</sub>；　VC<sub>i</sub>=q<sub>i</sub>(Σ̂q)<sub>i</sub></div>
          <p>ΣRC_i=σp，ΣVC_i=V，且 RC_i=VC_i/σp。因为 ∂V/∂q_i=2(Σq)_i，所以 q_i∂V/∂q_i=2VC_i、加总为 2V；若把它直接命名为“可加方差贡献”，总账会多一倍。</p>
        </div>
        <p>
          文献和产品文件可能把 component contribution 也称 marginal contribution，尤其当公式已经含 q_i。阅读时以公式而非标签为准：有没有乘当前权重，决定它是局部斜率还是持仓贡献。<Cite n={2} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="normalized-risk-share">
        <p className="section-kicker">09 · Percentage Risk Contribution</p>
        <h2>PCR 把绝对 RC 除以总组合波动，成为可与风险预算比较的无量纲份额；在 long-only 正贡献基准里位于 0 与 1 之间，但 hedge 组合不保证如此。</h2>
        <div className="equation-card">
          <span>标准化风险份额</span>
          <div>PCR<sub>i</sub>=RC<sub>i</sub>/σ<sub>p</sub>=q<sub>i</sub>(Σ̂q)<sub>i</sub>/(q′Σ̂q)；　Σ<sub>i</sub>PCR<sub>i</sub>=1</div>
          <p>PCR 没有货币或百分比波动单位，是模型分配份额。带空头或 hedge 时某项 PCR 可为负，其他项可超过 100%，只要总和仍为 100%；这不自动是计算错误，也不意味着未来损失会按这些比例发生。</p>
        </div>
        <p>
          本节后文默认 canonical ERC 使用正预算、long-only 和非退化 covariance，使贡献为正；一旦扩展到 hedge，必须同时报告持仓符号、负贡献解释和使用的 orthant。<Cite n={6} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="risk-budget">
        <p className="section-kicker">10 · Risk Budget b</p>
        <h2>风险预算 b 是策略希望每项资产承担的 ex-ante 模型风险份额，不是资本金额、VaR 上限、未来亏损配额或监管资本。</h2>
        <div className="equation-card">
          <span>一般 risk-budgeting 条件</span>
          <div>b<sub>i</sub>&gt;0，Σb<sub>i</sub>=1；　PCR<sub>i</sub>(q*)=b<sub>i</sub> ⇔ q*<sub>i</sub>(Σ̂q*)<sub>i</sub>=b<sub>i</sub>(q*′Σ̂q*)</div>
          <p>b 由 mandate 或研究设计外生给定；方程只决定一条正尺度射线，通常再令 Σq_i=1。若预算含 0、允许空头或加入一般约束，标准存在性、唯一性和正交域证明不能直接沿用。</p>
        </div>
        <p>
          ERC 只是 b_i=1/N 的特例。机构风险限额还涉及授权、损失度量、breach 和治理，本节只把 bounds 当可行域输入，不把 b 改写为 2.16 的 limit。<Cite n={6} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="symbol-unit-ledger">
        <p className="section-kicker">11 · 符号、单位与时钟总账</p>
        <h2>风险贡献公式很短，但只有资产顺序、币种、收益频率、年化、估计截止和权重口径全部冻结，矩阵乘法才有经济含义。</h2>
        <div className="table-scroll" tabIndex={0} aria-label="风险平价符号、单位和时点对照表，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>对象</th><th>含义</th><th>单位／时点</th><th>不能替代</th></tr></thead>
            <tbody>
              <tr><td>Σ̂<sub>t|t−1</sub></td><td>截至决策前的协方差预测</td><td>同币种、同频、同年化</td><td>未来真实 covariance</td></tr>
              <tr><td>q<sub>t</sub></td><td>相对 risky composition</td><td>通常 1′q=1</td><td>总杠杆或实际仓位</td></tr>
              <tr><td>MRC / RC</td><td>局部斜率／当前成分贡献</td><td>波动／权重；波动</td><td>单体 volatility</td></tr>
              <tr><td>PCR / b</td><td>实现／目标风险份额</td><td>无量纲</td><td>金额或 loss limit</td></tr>
              <tr><td>g / w*</td><td>共同倍率／最终目标 exposure</td><td>g≥0；w*=gq</td><td>order 或 fill</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          跨时区资产若用不同收盘时点，表面 covariance 会被非同步交易压低；未做 FX 转换的本币收益也不能直接装入美元组合。所有结果应带 estimator vintage，而非只保存最终权重。
        </p>
      </section>

      <section className="lesson-section" id="two-asset-number-story">
        <p className="section-kicker">12 · 两资产数值故事</p>
        <h2>用 50/50 资本、10%／20% 波动和零相关可以完整看见：MRC 是斜率，RC 是当前贡献，PCR 才能与 50/50 预算比较。</h2>
        <p>
          q=(0.5,0.5) 时 V=0.25×0.01+0.25×0.04=0.0125，σp≈11.1803%。MRC=(0.005,0.02)/σp≈(4.4721%,17.8885%)；乘当前权重后 RC≈(2.2361%,8.9443%)，两项正好加总为 11.1803%；再除以 σp 得 PCR=(20%,80%)。
        </p>
        <p>
          若要 equal risk contribution，必须让 q₁²σ₁²=q₂²σ₂²，得到 q=(2/3,1/3)。这个例子不是说 covariance 永远不重要，而是为下一节准备一把可核对的基准尺。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="correlation-redistribution">
        <p className="section-kicker">13 · Correlation 怎样重分配风险</p>
        <h2>个体波动不变，相关网络也能改变每项资产与整个组合的 covariance，因此 MRC、RC、PCR 和目标 q 都可能变化。</h2>
        <p>
          三个相同波动资产若前两项高度相关、第三项独立，等权时前两项各自与组合的 covariance 更大，风险份额会超过第三项。相关性不是“额外加在总波动上的一个参数”，而是逐项进入 Σq 的网络结构；某一条边变化会同时改变多个节点的贡献。
        </p>
        <p>
          相关状态也具有宏观条件性。ECB 的 2022 分析显示股债相关性会随通胀、供给冲击和共同贴现率渠道变化，但结论依赖样本与约束，不能简化成一个永久阈值。<Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="erc-condition">
        <p className="section-kicker">阶段二 · 由贡献求权重　|　14 · ERC 条件</p>
        <h2>ERC 要求每项 RC 或 PCR 相等，不要求 MRC 相等；若把局部斜率当贡献，求出的会是另一套组合。</h2>
        <div className="equation-card">
          <span>Equal Risk Contribution</span>
          <div>RC<sub>i</sub>(q*)=σ<sub>p</sub>(q*)/N ⇔ PCR<sub>i</sub>(q*)=1/N ⇔ q*<sub>i</sub>(Σ̂q*)<sub>i</sub>=V(q*)/N</div>
          <p>N 是事前冻结的风险预算单元数，可以是资产或分组；改变资产拆分会改变预算对象。等 MRC 并非 ERC，因为 ERC 还乘当前权重。权重和、long-only 与非退化 Σ 是本节 canonical 基准的组成部分。</p>
        </div>
        <p>
          ERC 是一个 implicit system：每一项方程都依赖整个 q。除窄特例外不能逐资产单独算好再拼接；解出权重后仍须重算 PCR 作为验收，而不是只相信 optimizer success。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="inverse-vol-special-case">
        <p className="section-kicker">15 · Inverse-vol 的特殊成立条件</p>
        <h2>Inverse-vol 平衡 qᵢσᵢ；它在两资产非退化等预算、对角 covariance、equicorrelation 或更一般的非退化等相关矩阵行和结构下等于 ERC，但不是 ERC 的一般定义。</h2>
        <div className="equation-card">
          <span>Inverse-vol 权重与精确条件</span>
          <div>q<sup>IV</sup><sub>i</sub>=(1/σ<sub>i</sub>)/Σ<sub>j</sub>(1/σ<sub>j</sub>)；　若 Σ=DRD，则 VC<sub>i</sub>(q<sup>IV</sup>) ∝ (R1)<sub>i</sub></div>
          <p>D=diag(σ_i)，R 是相关矩阵。只有 R 的每一行和相同且 V(q<sup>IV</sup>)&gt;0，inverse-vol 才构成定义良好的 ERC；若共同的行和为 0，则 VC 虽都为 0，RC 与 PCR 却无定义。两资产等预算中共同 covariance 项会抵消，但 ρ=−1 且权重形成零风险组合时正是这一退化端点。</p>
        </div>
        <p>
          三资产异质相关是必要反例：qᵢσᵢ 全相等不代表每项与组合的 covariance 相等。公式告诉我们何时启发式成立，也告诉我们不能把一个特例升级成产品定义。<Cite n={4} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="inverse-vol-vs-variance">
        <p className="section-kicker">16 · Inverse-vol ≠ Inverse-variance</p>
        <h2>1/σ 与 1/σ² 对低波动资产的倾斜强度不同；前者可在特殊结构下实现 ERC，后者常见于另一类 volatility-managed 研究，二者都不能只叫“risk weighting”。</h2>
        <p>
          两资产波动 10% 与 20% 时，inverse-vol 为 2/3、1/3，inverse-variance 为 80%、20%。前者在两资产等预算基准里平衡贡献，后者把低波动资产再放大一层。2.11 已在学术 inverse-variance 与 fixed target/inverse-vol multiplier 间划界，本节进一步加入 full-covariance ERC。
        </p>
        <p>
          S&amp;P 传统 Risk Parity 家族在合约类内与资产类间使用两层 inverse realized volatility，再加目标波动 multiplier；Risk Parity 2.0 才用优化器匹配预定贡献。因此产品名称相同，不意味着底层使用同一 covariance 方程。<Cite n={36} /><Cite n={33} />
        </p>
      </section>

      <section className="lesson-section" id="equal-weight-vs-erc">
        <p className="section-kicker">17 · Equal Weight 与 ERC</p>
        <h2>Equal weight 对资本标签一视同仁，ERC 对模型风险贡献一视同仁；两者都可以作为基准，但回答的是不同规范问题。</h2>
        <p>
          1/N 不估计 covariance，因而避免了优化器放大估计误差，却会在 standalone volatility 或相关网络不对称时集中风险。ERC 使用更多模型信息，能按预算重排资本，也因此承担 estimator、solver 和 implementation risk。
        </p>
        <p>
          DeMiguel 等对均值—方差优化的样本外比较提醒我们：复杂模型获得的理论增益可能被估计误差吞噬；这使 1/N 成为严肃 benchmark，却不证明 1/N 永远优于 ERC，也不构成反对风险分解本身的证据。<Cite n={16} /><Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="erc-vs-minimum-variance">
        <p className="section-kicker">18 · ERC 与 Minimum Variance</p>
        <h2>GMV 最小化组合总 variance，ERC 平衡成分贡献；GMV 可以把资本集中到少数低波动或强对冲资产，而 ERC 愿意接受更高总风险以避免贡献过度集中。</h2>
        <p>
          GMV（global minimum variance）在 long-only 基准中解 min<sub>q</sub> q′Σq，s.t. 1′q=1、q≥0；目标函数没有“每项承担多少”。ERC 则解 PCR_i=1/N，不以总 variance 最低为准。在特定单因子、长仓结构中可以比较两者的解析关系，但不能把局部排序推广到任意 covariance 与约束。<Cite n={13} /><Cite n={14} /><Cite n={15} /><Cite n={19} />
        </p>
        <p>
          约束对 GMV 也可能产生类似 shrinkage 的稳定效果，这说明“错误约束帮助”是估计与可行域交互，不是所有约束都提高投资结果。<Cite n={13} />
        </p>
      </section>

      <section className="lesson-section" id="erc-vs-max-diversification">
        <p className="section-kicker">19 · “分散化”不是单一目标</p>
        <h2>ERC、Maximum Diversification 与层级方法都可能被称为“更分散”，但它们分别改变贡献目标、优化比率或预算单元；共同标签不能推出相同权重。</h2>
        <p>
          MDP（most diversified portfolio）的 diversification ratio 为 (q′σ)/√(q′Σq)，目标是让单体波动的资本加权平均相对于组合波动尽可能大；ERC 则匹配每项贡献。二者只在特殊结构下重合，因此“diversified”必须跟随一项可计算定义。<Cite n={17} /><Cite n={18} />
        </p>
        <div className="table-scroll" tabIndex={0} aria-label="常见风险配置方法的优化对象比较，可横向滚动">
          <table className="concept-table">
            <thead><tr><th>方法</th><th>核心对象</th><th>完整 covariance</th><th>是否保证资产 ERC</th></tr></thead>
            <tbody>
              <tr><td>Equal weight</td><td>资本 1/N</td><td>否</td><td>通常否</td></tr>
              <tr><td>Inverse-vol</td><td>1/σ 启发式</td><td>只用对角</td><td>仅特殊结构</td></tr>
              <tr><td>ERC / Risk budget</td><td>PCR=b</td><td>是</td><td>若可行且收敛</td></tr>
              <tr><td>GMV</td><td>最小 V</td><td>是</td><td>否</td></tr>
              <tr><td>MDP</td><td>最大 diversification ratio</td><td>是</td><td>否</td></tr>
              <tr><td>HRP / HERC</td><td>树与 cluster allocation</td><td>使用但通常不求逆</td><td>不自动</td></tr>
            </tbody>
          </table>
        </div>
        <details className="practice-answer">
          <summary>选读 · HRP 与 HERC 怎样改变预算单元？</summary>
          <p>HRP（hierarchical risk parity）通过 clustering、quasi-diagonalization 与 recursive bisection 沿树分配资本，HERC（hierarchical equal risk contribution）则在层级上分配风险；tree、linkage、排序和 cluster budget 都是新增模型选择，并不自动满足完整资产级 ERC。2026 年更快的 HRP 算法改进了计算与某些排序性质，但有限实验不是普适绩效保证。<Cite n={20} /><Cite n={21} /><Cite n={22} /><Cite n={23} /></p>
        </details>
      </section>

      <section className="lesson-section" id="unequal-risk-budgeting">
        <p className="section-kicker">20 · Unequal Risk Budgeting</p>
        <h2>一般 risk budgeting 允许不同资产承担不同目标份额；在零 covariance 特例中，权重与 √b/σ 成正比，而不是 b/σ。</h2>
        <div className="equation-card">
          <span>对角 covariance 的闭式解</span>
          <div>若 Σ=diag(σ₁²,…,σₙ²)，则 q*<sub>i</sub> ∝ √b<sub>i</sub>/σ<sub>i</sub></div>
          <p>因为 VC_i=q_i²σ_i²，要令 VC_i/V=b_i，必须先对 b 开平方。只有 b_i 全相等时才退化为 inverse-vol；一般 covariance 中交叉项存在，本闭式不能直接使用。</p>
        </div>
        <p>
          不相等 b 可以表达 mandate 的风险优先级，却不包含 expected-return conviction 的形成过程。谁决定 b、是否随宏观状态改变属于策略设计；本节只研究给定 b 如何映射为 q。<Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="convex-solution">
        <p className="section-kicker">21 · 进阶选读 · Convex Solution 的直觉</p>
        <h2>标准 long-only 正预算问题可以先在正交域求一个未归一化辅助解，再沿同一射线归一化；log barrier 既保持正权重，也把预算写进一阶条件。</h2>
        <div className="precision-note">
          <span>不是后续主线的硬先修</span>
          <p>若尚未学习微积分或优化，可以只保留结论：一般 covariance 下各项方程彼此耦合，需要数值求解，并必须用 achieved PCR 复核。下式的 arg min 意为“寻找让括号内数值最小的正向量”；−log x_i 会在 x_i 接近 0 时急剧增大，因而把正预算留在正权重区域。KKT 是“约束最优解必须满足的一组一阶检查”，Hessian 是描述局部曲率的二阶导数矩阵。</p>
        </div>
        <div className="equation-card">
          <span>正交域 log-barrier formulation</span>
          <div>x*=arg min<sub>x&gt;0</sub>[½x′Σ̂x−κΣ<sub>i</sub>b<sub>i</sub>log x<sub>i</sub>]；　x*<sub>i</sub>(Σ̂x*)<sub>i</sub>=κb<sub>i</sub>；　q*=x*/(1′x*)</div>
          <p>κ&gt;0 只选择辅助解尺度；把第 i 个一阶条件先乘 x_i、再对 i 求和，利用 ∑<sub>i</sub>b<sub>i</sub>=1 得 x′Σx=κ，故 PCR=b。Σ 正定是存在的简单充分条件；PSD 时还需排除非零、非负的零风险方向。零预算、空头、indefinite matrix 与一般 hard constraints 需要另行建模。</p>
        </div>
        <p>
          Hessian 为 Σ+κdiag(b_i/x_i²)，在正预算下提供严格凸性；也就是说，只要最小点存在，就不会有另一个不同的同等最优正解。但“凸”不等于数据正确，也不意味着把 simplex 或其他约束直接塞入原目标后还能沿用同一 KKT 证明。<Cite n={5} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="solution-verification">
        <p className="section-kicker">22 · Solution Verification</p>
        <h2>求解器显示 success 只是开始；所有读者都应验收输入、可行域、Euler 加总、预算残差和重复性，数值实现者再追加矩阵谱与一阶最优性检查。</h2>
        <ol className="diagnostic-list">
          <li><b>输入审计：</b>没有缺失或无限值，资产顺序、币种、频率、持有期与年化单位一致。</li>
          <li><b>可行性审计：</b>权重和、long-only、单项上下限和分组约束全部满足，并列出哪些约束恰好绑定。</li>
          <li><b>贡献审计：</b>ΣRC≈σp、ΣPCR≈1、PCR−b 的 max／RMS residual。</li>
          <li><b>重复性审计：</b>固定数据 vintage、solver 版本和 tie-breaking，避免同输入不同权重。</li>
        </ol>
        <details className="practice-answer">
          <summary>进阶实现审计 · 矩阵谱与求解器诊断</summary>
          <p>实现者还应检查 symmetry、PSD、最小 eigenvalue 与修复 tolerance；保存 KKT（一阶最优性）residual、active set、iteration、stopping tolerance、initialization 和 fallback 原因。这些字段帮助区分“数学问题不可行”“数据矩阵有问题”和“算法尚未收敛”，但不是理解后续 q／g 与 target／flow 主线的硬先修。</p>
        </details>
        <p>
          不同算法在标准问题上都可工作；一旦允许空头、稀疏、一般 bounds 或非凸约束，可能出现多解、局部驻点或只能近似预算。报告必须说明求了哪一个数学问题，而不是只写“用了 risk parity optimizer”。<Cite n={5} /><Cite n={7} /><Cite n={10} /><Cite n={11} />
        </p>
      </section>

      <section className="lesson-section" id="scale-invariance">
        <p className="section-kicker">23 · Scale Invariance</p>
        <h2>风险预算决定的是一条 exposure 射线：共同放大 q 会同比放大总波动和每项绝对 RC，却不会改变 PCR。</h2>
        <div className="equation-card">
          <span>正尺度下的贡献变化</span>
          <div>对 c&gt;0：σ<sub>p</sub>(cq)=cσ<sub>p</sub>(q)；　RC<sub>i</sub>(cq)=cRC<sub>i</sub>(q)；　PCR<sub>i</sub>(cq)=PCR<sub>i</sub>(q)</div>
          <p>这是一阶齐次风险度量的性质。c 改变总风险规模、资金／保证金需求与亏损金额，却不改变相对风险预算；c&lt;0 会翻转持仓 orthant，不属于本节 long-only 外层倍率。</p>
        </div>
        <p>
          因此“ERC 权重和为 1”只是选定一个方便的资本归一化，不是数学方程本身天然 fully invested。产品可在此基础上另加 leverage 或 cash leg。<Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="q-vs-g">
        <p className="section-kicker">24 · Relative Composition q 与 Multiplier g</p>
        <h2>q-update 改变资产之间的相对构成，g-update 同比缩放整个 risky basket；协方差冲击可能同时影响两者，但必须分两本账记录。</h2>
        <div className="equation-card">
          <span>Risk budget 与 outer vol target 的串联</span>
          <div>q*<sub>t</sub>=RB(Σ̂<sub>t</sub>,b,C)；　g*<sub>t</sub>=policyClip[σ*/√(q*′Σ̂q*)]；　w*<sub>t</sub>=g*<sub>t</sub>q*<sub>t</sub></div>
          <p>RB 返回相对构成，C 是可行域；policyClip 继承 2.11 的 cap、floor、lag 与 fallback。g≥0 时不改变 q 的 PCR。若把 q rotation 和 g contraction 混成一次“减仓”，会重复归因 covariance shock。</p>
        </div>
        <p>
          S&amp;P 方法把相对配置与 target-vol leverage 分成顺序步骤；ECB 2020 的风格化出售也同时包含贡献重配和总倍率去杠杆，不能全部归为 fully invested ERC。<Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="feasible-set">
        <p className="section-kicker">阶段三 · 可实现世界　|　25 · Feasible Set</p>
        <h2>理论预算只有落在可行域内才能被精确实现；long-only、单项上下限、组别约束和流动性边界不是求解后的装饰，而是问题定义。</h2>
        <div className="equation-card">
          <span>一个最小线性可行域</span>
          <div>C={'{'}q: 1′q=1，　l≤q≤u，　Aq≤d{'}'}</div>
          <p>l、u∈ℝⁿ 分别是 n 项资产逐项的最低与最高权重；A∈ℝ<sup>m×n</sup> 把 m 条分组、因子或流动性线性约束映射到资产权重，d∈ℝ<sup>m</sup> 是这些约束各自的上界。先检查 C 至少包含一个可行 q，再讨论优化。Bounds、group limits 与 turnover 可能排除精确 PCR=b；此时应定义近似目标与 residual，而不是先算 ERC、机械截断、再沿用“精确风险平价”标签。</p>
        </div>
        <p>
          Cardinality、整数合约、borrow availability、margin 和非线性工具会进一步改变可行域；有些问题变成混合整数或非凸。一个优化器能返回数值，不等于经济账户可执行。<Cite n={29} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="negative-risk-contribution">
        <p className="section-kicker">26 · Hedge 与 Negative RC</p>
        <h2>负 RC 表示该持仓在当前局部 covariance 模型中降低组合波动，不必是计算错误；但 canonical long-only ERC 不应悄悄混入这种 signed-hedge 语义。</h2>
        <p>
          若 q_i 为正而 (Σq)_i 为负，该资产与组合其余部分的负 covariance 足以使 MRC、RC 为负；其他资产 PCR 可因此超过 100%，总和仍为 100%。若允许空头，权重符号与 covariance 符号共同决定贡献，解还可能跨多个 orthant。
        </p>
        <p>
          扩展模型必须声明：是否要求所有 RC 正、如何处理 hedge budget、零风险点与 multiple solutions。把负贡献强制裁成零会破坏 Euler 总账，也改变原问题。<Cite n={6} /><Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="binding-bounds">
        <p className="section-kicker">27 · Binding Bounds 与 Budget Residual</p>
        <h2>当 cap 或 floor 绑定时，求解器可能完全可行且数值收敛，却无法命中 b；偏离预算是约束的经济结果，不应伪装成零误差。</h2>
        <p>
          最小报告至少包括 e_i=PCR_i−b_i、max|e_i|、RMS(e)、active constraints 和 Euler add-up error。相对残差 PCR_i/b_i−1 在小预算附近会被放大，必须与绝对百分点残差并列，而不是只挑好看的指标。
        </p>
        <p>
          Constrained risk budgeting 需要专门 formulation；“无约束解—clip—normalize”通常不保留原预算，也可能触发另一个约束。若最终只能最小二乘近似，应以 achieved PCR 命名和评价。<Cite n={10} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="leverage-implementation">
        <p className="section-kicker">28 · Leverage、Cash 与工具接口</p>
        <h2>低波动资产获得较高资本权重常使组合需要 futures、repo 或其他融资来达到目标总风险；“多配债券”不等于没有 leverage、funding 或 margin risk。</h2>
        <p>
          Fully funded 现货、期货 notional、repo financed bond 与 total-return swap 使用不同现金账本。Risk parity q 只给相对 exposure；g、contract multiplier、collateral、variation margin、cash yield 和 leverage cap 仍须按 2.11 的工具语法落账。S&amp;P 传统家族用期货，2.0 还包含 cash-market TIPS 并限制其 post-leverage weight，正说明载体会反过来约束理论配置。<Cite n={36} />
        </p>
        <p>
          Leverage-aversion 理论可以解释为何低风险资产可能具有不同风险调整后回报，但它依赖融资成本和市场均衡；历史证据不能改写成杠杆越高越优。2020 Treasury 压力也显示 margin 与 dealer balance sheet 可主导反馈。<Cite n={31} /><Cite n={32} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="turnover-regularization">
        <p className="section-kicker">29 · Turnover、Regularization 与 Rebalance Calendar</p>
        <h2>把 q 每次都调到数学精确解能减少当期预算误差，却可能把 covariance 噪声变成高换手；no-trade band、turnover penalty 与慢频再平衡用实现偏差换取稳定。</h2>
        <p>
          交易成本可以进入目标函数，或在求解后通过 buffer 决定是否下单；两种设计产生不同 target path。若上一期权重作为 regularization anchor，最终组合不再是纯 ERC，必须报告 budget residual 与 turnover 两套指标。
        </p>
        <p>
          约束尺度也很重要：对未归一化 x 施加 turnover 与对归一化 q 施加，经济意义不同。不能把可实现性惩罚写进模型后仍声称只由 risk budgets 决定。<Cite n={28} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="covariance-clock">
        <p className="section-kicker">30 · Covariance Estimation Clock</p>
        <h2>截至 t−1 的收益可以形成 t 或更晚使用的 Σ̂，却不能用 t 的冲击重新计算权重并按 t 的旧价格成交；reference、effective 与 execution time 必须分列。</h2>
        <p>
          保存收益窗口起止、缺失值处理、annualizer、FX fixing、matrix repair、计算时间和生效日，才能复现 q。S&amp;P 当前方法使用最长 15 年、最短 5 年的扩展回看并按月生效；这只是该家族的治理选择，不是 risk parity 的学术必需条件。<Cite n={36} />
        </p>
        <p>
          相关状态变化可能快于长窗口，短窗口又更噪。ECB 的 2022 证据提示制度切换，却不提供“最佳窗口”； estimator choice 仍是待检验模型。<Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="sampling-error">
        <p className="section-kicker">31 · Sampling Error 与 Weight Instability</p>
        <h2>Σ 的小误差会同时改变所有 MRC，并经隐式非线性方程放大成 q 的变化；低风险方向、近重复资产和短样本尤其容易产生不稳定权重。</h2>
        <p>
          Eigenvalue（特征值）可以直观理解为 covariance 在某个组合方向上记录的方差强度；当其中一个值很小，该方向就像“几乎零风险组合”。样本噪声只要把这个方向轻微旋转，优化器便可能大幅改变权重。ERC 不直接求逆 Σ，并不意味着免疫估计误差；它仍使用 Σq 和耦合贡献方程。
        </p>
        <p>
          评估应采用 rolling as-of data，报告权重敏感度、turnover、budget error 和样本外 realized contribution；只在 full sample 上展示平滑权重会隐藏 vintage risk。估计误差文献和 1/N 比较提供的是警告，不是单一最佳方案。<Cite n={8} /><Cite n={9} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="shrinkage-psd">
        <p className="section-kicker">32 · Shrinkage、PSD 与坏矩阵</p>
        <h2>Shrinkage 用结构化 target 换取更低估计方差，PSD repair 让矩阵成为合法 covariance；它们能改善数值条件，却不能证明经济相关结构正确。</h2>
        <p>
          向单指数或单位阵收缩会抬高小 eigenvalues、降低 condition number，并改变每一项 RC。Condition number 是最大与最小特征值之比：比值越大，输入的小误差越容易被权重放大。Ledoit–Wolf 的最优性针对特定渐近框架、target 与损失函数；它不能消除结构突变，也不能把 stale-price 造成的伪低相关修好。<Cite n={8} /><Cite n={9} />
        </p>
        <p>
          Matrix repair 应保留修复前后 eigenvalues、Frobenius distance 与权重差。Frobenius distance 是把矩阵每个元素的改变量平方后加总再开根号，用来量化这次修复把原矩阵整体移动了多远。若 repair 主导了 q，研究结论应归因于 regularization choice，而不是说“市场真实风险贡献如此”。
        </p>
      </section>

      <section className="lesson-section" id="stale-fx-synchronization">
        <p className="section-kicker">33 · Stale Price、跨时区与 FX</p>
        <h2>不同市场不同时收盘、假期错位和本币收益未同步，会把共同冲击错开到相邻日期，虚构低 correlation 与过度分散。</h2>
        <p>
          组合应先冻结 return interval：纽约收盘到纽约收盘、伦敦 fixing 或可交易同步窗口，不能逐列随意使用当地收盘。非同步数据会把同一冲击错开，并使同日 covariance 或 beta 出现系统偏差。FX-hedged 与 unhedged return 也是不同资产；把本币债券收益与美元股票收益直接拼接，会漏掉汇率贡献。<Cite n={41} />
        </p>
        <p>
          S&amp;P 方法明确把期货本币回报经 WMR spot 转为美元，并规定非交易日沿用前值；这些细节会影响 realized covariance。官方规则支持该指数的口径，不代表其他基金照搬。<Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="dynamic-q-update">
        <p className="section-kicker">34 · Dynamic q Update</p>
        <h2>新的 volatility 或 correlation 状态首先改变 target composition q；由于权重和为 1，某些资产通常升权、另一些降权，不能把“相关上升”直接翻译成所有资产共同卖出。</h2>
        <p>
          对 fully invested long-only ERC，q rotation 是相对再分配：总资本仍为 1。若另有外层 target-vol g，组合风险上升还可能令 gross 同比收缩；这时同一冲击包含 q-effect 与 g-effect 两条路径。研究必须分别保存 q_old、q_new、g_old、g_new。
        </p>
        <p>
          实施频率、buffer 与 covariance vintage 让 q 具有路径依赖。S&amp;P 按月再平衡与 ECB 2020 的日频风格化模型会产生完全不同的订单时间分布，不能用家族名称推断。<Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="target-weight-not-flow">
        <p className="section-kicker">35 · Target Weight ≠ Actual Flow</p>
        <h2>新 q 或 w* 只是模型目标；从 target 到真实成交流，还缺 post-shock actual、NAV、工具、外部现金流、跨账户净额、订单与 fill。</h2>
        <p>
          订单金额应按交易前账户状态计算：X*<sub>i</sub>=NAV<sup>−</sup>w*<sub>i</sub>，desired order=X*<sub>i</sub>−X<sup>−</sup><sub>i</sub>。价格冲击可能已经让 actual 朝新 target 漂移或远离；赎回、margin call、macro overlay 和 hedge 又能改变符号。期货还需把 notional 转成合约张数并单独记 collateral。
        </p>
        <p>
          ECB 与 BIS 的压力分析能支持条件机制，却不能提供所有 risk-parity fund 的 actual、order 和 fill。没有载体与成交证据，最多构造 candidate-flow scenario，不能宣称市场实际被该策略推动。<Cite n={37} /><Cite n={38} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="asset-vs-factor-risk">
        <p className="section-kicker">阶段四 · 对象与模型边界　|　36 · Asset Risk 与 Factor Risk</p>
        <h2>资产 ERC 平衡的是 ticker／sleeve 标签的贡献；多个资产可以共同暴露于同一个 growth、duration、inflation 或 liquidity factor，因此资产均衡不保证风险源均衡。</h2>
        <div className="equation-card">
          <span>一个线性 factor covariance 分解</span>
          <div>r=Bf+ε；　Σ=BΩB′+D；　y=B′q；　V=y′Ωy+q′Dq</div>
          <p>r∈ℝⁿ 是 n 项资产的收益向量，f∈ℝ<sup>K</sup> 是 K 个因子的收益向量，ε∈ℝⁿ 是因子未解释的资产残差；B∈ℝ<sup>n×K</sup> 是资产对因子的 loading，Ω∈ℝ<sup>K×K</sup> 是 factor covariance，D∈ℝ<sup>n×n</sup> 是 residual covariance，y=B′q∈ℝ<sup>K</sup> 是组合 factor exposure。Factor variance contribution 为 y_k(Ωy)_k；它们只加总到 factor variance，必须另加 residual 才回到总 V。因子定义、标准化与旋转会改变分解。</p>
        </div>
        <p>
          两只资产各占 50% asset PCR，却都对同一 duration factor 暴露 1，公共因子仍可占组合方差的大多数。Factor parity 是另一项模型选择，不是 asset ERC 的自动“真实答案”。<Cite n={24} />
        </p>
      </section>

      <section className="lesson-section" id="hidden-factor-concentration">
        <p className="section-kicker">37 · Hidden Factor Concentration</p>
        <h2>资产数量增加不等于独立 bets 增加：股票、信用与某些商品可以在风险厌恶冲击中共同加载 equity beta 和 liquidity，国债与成长股也可能共享 discount-rate 敏感性。</h2>
        <p>
          主成分或 minimum-torsion 方法试图构造更接近不相关的风险源，再衡量 effective number of bets；但 PCA、旋转、符号和样本窗口都会改变解释。用另一坐标发现集中很有价值，却不能把某一因子基底宣布为唯一真相。<Cite n={25} /><Cite n={26} /><Cite n={27} />
        </p>
        <p>
          研究报告应同时展示 asset PCR、factor contribution、residual share 与 stress loss。若只给“20 个资产均衡”，可能掩盖它们在真正冲击维度上的共同暴露。
        </p>
      </section>

      <section className="lesson-section" id="factor-risk-parity">
        <p className="section-kicker">38 · Factor Risk Parity</p>
        <h2>Factor parity 把预算单元从资产改成因子，先要求一个可识别的 mapping；当因子相关、重叠或带 residual 时，贡献和可行性问题比资产层更复杂。</h2>
        <p>
          若宏观因子不可直接交易，目标 factor budget 需要通过资产权重反求；资产 bounds、leverage 与 loading 共线可能使目标不可达。重叠 group risk 和一般齐次风险度量还能形成 generalized risk budgeting，但数值问题可能非凸。<Cite n={24} /><Cite n={28} />
        </p>
        <p>
          本节只建立接口：2.13 可以用宏观观点改变 factor budget 或加 overlay，Chapter 7 再研究共同因子暴露如何形成 correlation state。这里不展开 factor selection 或 causal macro model。
        </p>
      </section>

      <section className="lesson-section" id="nonlinear-instruments">
        <p className="section-kicker">39 · Nonlinear Instruments</p>
        <h2>线性 covariance 分解默认小幅收益与固定 exposure；期权、可赎回债和路径依赖工具的 delta、gamma 与 state-dependent cash flow 会让静态 q′Σq 不再完整。</h2>
        <p>
          可以先把非线性头寸映射成局部 delta-equivalent factors，再算一阶贡献，但大跳跃、volatility surface 与 gamma P&amp;L 会使局部线性化失效。若改用 full revaluation risk measure，Euler contribution 还需检查可微性和正齐次性。
        </p>
        <p>
          额外工具约束也可能使精确预算不可行；基数、整数与稀疏选择需要专门算法。期权风险本体留给 2.14，组织 risk limit 留给 2.16。<Cite n={28} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="risk-measure-choice">
        <p className="section-kicker">40 · Risk Measure Choice</p>
        <h2>“Risk contribution”只有在先声明 risk measure 后才完整；从 volatility 改成 VaR、ES、CVaR 或 drawdown，贡献、可微性和目标权重都会改变。</h2>
        <p>
          本节选择 ex-ante volatility，是因为 covariance、Euler 与产品方法可形成透明主链。Qian 对标准差和 VaR 的金融解释依赖分布与条件损失联系，不能外推成任意尾部风险的唯一分解。非光滑风险度量可能需要 subgradient，结果还可能不唯一。<Cite n={3} />
        </p>
        <p>
          因此“tail-risk parity”不是给 ERC 换一个营销标题，而是更换目标函数、数据与极端状态假设。2.16 会讨论 VaR／ES 作为治理约束，本节不抢占。
        </p>
      </section>

      <section className="lesson-section" id="expected-return-absence">
        <p className="section-kicker">41 · 没有 Expected-return 输入意味着什么</p>
        <h2>Risk parity 基准没有显式 μ，不等于假设所有资产 expected return 为零、完全相等或永远无关；它只是把收益观点从当前配置规则中拿掉。</h2>
        <p>
          Mean–variance optimization 同时依赖 μ 与 Σ，收益均值比 covariance 更难估；risk-based allocation 通过放弃显式 μ 降低一类估计负担，却仍隐含对风险、杠杆和分散化的规范选择。Wai Lee 的分析说明不同 risk-based 方法可对应不同隐含收益假设，不能称作“无观点的自然组合”。<Cite n={33} />
        </p>
        <p>
          绩效仍取决于资产风险溢价、融资、估值和 regime。Asness 等的 leverage-aversion 论证提供一个经济机制，但并不保证任意未来样本、融资成本或约束下超额表现。<Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="macro-view-boundary">
        <p className="section-kicker">42 · 与 Global Macro 的接口</p>
        <h2>Global Macro 可以通过方向 overlay、动态 b 或资产宇宙把增长、通胀和政策观点叠加到风险预算；观点怎样形成、为何可信以及何时反转属于 2.13。</h2>
        <p>
          2.12 的 counterfactual 是“给定同一个 b 和可行域，Σ 变化会怎样改 q”。如果 macro manager 因通胀上升主动降低债券预算，这同时改变 b 与 Σ；研究必须分解 policy change 与 covariance update，不能把全部权重变化归给 risk parity。
        </p>
        <p>
          ECB 2022 还显示不同约束的投资者面对股债相关上升可能采取相反债券调整；“相关上升→所有人卖债”不是模型恒等式。<Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="diversification-rationale">
        <p className="section-kicker">阶段五 · 反例与证据　|　43 · Diversification 的有限主张</p>
        <h2>Risk parity 能在选定风险模型内减少某一资产标签的贡献集中，却不保证收益最大、尾部安全、流动性分散或经济因子分散。</h2>
        <p>
          Qian 的早期白皮书和后续行业研究把 60/40 风险集中与 leverage aversion 作为动机；这些是重要机制与历史证据，但来源与产品存在商业关联。学术判断应把“为什么可能有效”与“未来是否优于基准”分开。<Cite n={31} /><Cite n={34} /><Cite n={35} />
        </p>
        <p>
          分散化本身也有多种定义：资产数量、PCR entropy、factor bets、drawdown sources 与 liquidity buckets 不必一致。任何优越性主张都要先声明比较对象和度量。
        </p>
      </section>

      <section className="lesson-section" id="performance-evidence">
        <p className="section-kicker">44 · Performance Evidence 的边界</p>
        <h2>回测结果对资产宇宙、起止点、rebalancing、融资、成本、目标波动和 benchmark 高度敏感；风险预算正确不等于样本外收益必然更高。</h2>
        <p>
          Anderson 等显示起止点和 leverage cost 能显著改变 risk parity 的相对表现；Chaves 等比较多个启发式组合也只支持特定历史样本。DeMiguel 的 1/N 结果进一步要求把估计误差作为基准，但不能反向证明所有优化无效。<Cite n={32} /><Cite n={34} /><Cite n={16} />
        </p>
        <p>
          报告应同时给 unlevered q、levered w、gross／net return、funding spread、turnover、drawdown、realized PCR 与 live／backtest 分界。S&amp;P launch 前历史是规则回测，不是当时已有 AUM 与成交。<Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="stock-bond-correlation-state">
        <p className="section-kicker">45 · Stock–Bond Correlation State</p>
        <h2>股债负相关不是 risk parity 的常数：通胀、供给冲击与共同 discount-rate 变化可以令分散失效，使旧 Σ 下的预算在新状态中严重错位。</h2>
        <p>
          当股票与债券 covariance 由负转正，二者不再互相抵消，组合波动和各项 MRC 会改变。在三项以上资产的异质相关网络，或预算、约束不对称时，新的 q 还可能降低某项、提高另一项；若另有外层 g，gross 也可能收缩。窄特例必须单列：只有股票和债券两项、等预算、无约束且组合风险非零时，ERC 的相对 q 仍是 inverse-vol，相关性变化只改变总波动、绝对 RC 与可能的 g。响应始终取决于对象、预算、约束和 actual，不存在不带条件的统一订单符号。
        </p>
        <p>
          ECB 2022 使用历史与非线性回归说明相关状态和投资者约束的重要性；它不识别 risk-parity fund 的真实流，也不证明通胀一过某阈值相关性必然转正。<Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="positive-correlation-counterexample">
        <p className="section-kicker">46 · Positive-correlation Counterexample</p>
        <h2>“债券波动较低，所以多配债券”在相关性转正后可能仍给出高资本权重，却不再提供过去的 hedge；inverse-vol 看不见相关网络，而 full-covariance ERC 是否改变 q 取决于资产数、预算与约束。</h2>
        <p>
          若只用 1/σ，个体波动不变时 q 不变，即使股债 covariance 从负转正；full-covariance ERC 会重算 contributions。在仅有两资产、等预算、无约束的非退化特例里，重算后相对 q 仍不变；到了三项以上的异质相关网络，或预算／约束不对称时，full-covariance q 才可能与 inverse-vol 分叉。两者可以都被产品称作 risk parity，却不能仅凭名称推断 target path。
        </p>
        <p>
          这正是 2022 案例的教学价值：相似的“风险分散”名称不能替代 estimator specification，理论 target 也不能替代真实订单证据。<Cite n={36} /><Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="low-vol-leverage-counterexample">
        <p className="section-kicker">47 · Low-vol Leverage Counterexample</p>
        <h2>低历史波动允许更高 notional，不等于尾部损失低：duration jump、basis widening、margin call 和 liquidity evaporation 可以在同一时刻放大。</h2>
        <p>
          以 leverage 达到目标波动时，平静期的低 σ 会提高 gross；若 shock 使价格下跌、volatility 与 margin 同时上升，agent 可能既亏损又被迫缩表。Leverage-aversion 是风险平价的一种经济解释，真实融资约束却可能把它转成脆弱性。<Cite n={31} /><Cite n={32} />
        </p>
        <p>
          BIS 对 2020 fixed-income market 的分析强调 basis trade、margin spiral 与 dealer capacity；系统化资金的去风险只是更大网络的一部分，不能被改写成“risk parity 单独导致国债失灵”。<Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="estimation-turnover-counterexample">
        <p className="section-kicker">48 · Estimation-noise Counterexample</p>
        <h2>经济风险几乎不变，rolling sample 的 covariance 仍可因窗口边界、异常值或小 eigenvalue 旋转而让目标权重频繁翻动。</h2>
        <p>
          若只展示每期“精确 ERC”，高换手会被误当成市场风险快速变化。应把 q change 分解为新收益进入、旧收益离开、matrix repair、budget change 和约束 active-set change，并用 frozen vintage 重放。
        </p>
        <p>
          Shrinkage、long-only 和 turnover penalty 可提高稳定性，却都改变原模型；样本外比较必须把成本和 budget deviation 一起纳入。<Cite n={8} /><Cite n={9} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="liquidity-capacity-counterexample">
        <p className="section-kicker">49 · Liquidity 与 Capacity Counterexample</p>
        <h2>模型风险分散不等于可交易容量分散：不同资产的 depth、market hours、contract size 和 dealer capacity 差异，会让一张均衡风险表产生高度不均衡的执行冲击。</h2>
        <p>
          低波动但浅薄的市场可能获得较大 target notional；在压力期相关性升高、liquidity 同时下降，按风险预算减仓还会遇到最大的 impact。可行域可加入 liquidity cap，但 binding 后必须报告 budget residual。
        </p>
        <p>
          2020 的 margin 与 dealer balance-sheet 证据支持这种条件通道，不提供单一策略的订单级因果。系统反馈留给 Chapter 7；本节在 candidate order 与 capacity audit 处停止。<Cite n={29} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="constraint-gap-counterexample">
        <p className="section-kicker">50 · Constraint-gap Counterexample</p>
        <h2>“Solver converged”与“risk budget achieved”是两条不同判据；在不相容 bounds、零预算、稀疏或空头问题中，前者甚至可能掩盖后者根本不可达。</h2>
        <p>
          一个低波动资产的无约束 ERC 权重为 80%，cap 却是 40%，任何可行点都不可能 equal contribution。正确结果应写“constrained approximation”，列 achieved PCR、residual 与 binding cap；不应把失败藏在四舍五入或重新命名中。
        </p>
        <p>
          Least-squares、successive convex 与混合整数方法各解决不同扩展，驻点、近似或全局解的保证不相同。方法名必须与实际 objective、constraints 和 tolerance 对齐。<Cite n={10} /><Cite n={11} /><Cite n={29} /><Cite n={30} />
        </p>
      </section>

      <section className="lesson-section" id="research-audit-protocol">
        <p className="section-kicker">51 · 可证伪研究协议</p>
        <h2>研究“risk parity 怎样改变市场”时，先证明单一 agent 的 target 如何改变，再寻找 actual、order 与 fill；从股债同跌倒推共同策略，只是叙事。</h2>
        <ol className="diagnostic-list">
          <li><b>冻结对象：</b>资产、分组、factor、币种、工具与 live／backtest 区间。</li>
          <li><b>冻结模型：</b>risk measure、Σ estimator、budget、constraints、solver 与 tolerance。</li>
          <li><b>保存 as-of：</b>输入截止、reference day、effective day 与 execution window。</li>
          <li><b>分开 q 与 g：</b>记录 relative rotation、gross scaling 和每项贡献变化。</li>
          <li><b>重建 actual：</b>价格、FX、P&amp;L、cash flow、margin 与外部 overlay 先入账。</li>
          <li><b>区分 target／order／fill：</b>载体、netting、partial fill、cost 和 capacity 分列。</li>
          <li><b>证伪归因：</b>若规则未触发、actual gap 不符、窗口错位或没有成交证据，就拒绝 flow 故事。</li>
        </ol>
        <p>
          S&amp;P 方法提供可版本化规则，ECB 提供风格化压力情景，BIS 提供融资反馈诊断；三种证据都重要，却分别不能替代真实 fund order data 和因果价格响应。<Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">阶段六 · 实验与闭环　|　52 · Risk-parity Construction Lab</p>
        <h2>用十组冻结参数拆解 covariance、MRC／RC／PCR，再把预算、约束、q／g 与 post-shock actual 接到候选订单。</h2>
        <p>
          先独立计算，再提交答案。错误选项分别代表把 capital 当 risk、把 MRC 当 RC、把 inverse-vol 当普适 ERC、忽略 factor-of-two、把 solver success 当预算成功、把 asset parity 当 factor parity，以及把 target 当 fill。
        </p>
        <RiskParityLab />
        <div className="print-only">互动实验在打印版中隐藏。请改做下一节“主动练习”的十道同源静态变式；打印时答案会展开。浏览器无 JavaScript 时也可直接使用静态题与理解检查。</div>
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">53 · 主动练习 · 十道静态变式</p>
        <h2>同一机制换一组参数：脱离选项重算，才能判断你掌握的是因果与单位，还是记住了上一题数字。</h2>
        <div className="practice-grid">
          {riskParityScenarios.map((scenario, index) => (
            <article className="practice-card" key={scenario.id + '-static'}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">54 · 理解检查</p>
        <h2>如果不能脱离公式复述这些边界，就还没有真正理解 Risk Parity。</h2>
        <details className="understanding-check"><summary>01 · 为什么 50/50 资本通常不是 50/50 风险？</summary><p>因为每项贡献由当前权重、standalone variance 和它与整个组合的 covariance 共同决定；资本份额没有包含后两项。</p></details>
        <details className="understanding-check"><summary>02 · MRC 与 RC 的定义、单位和关系是什么？</summary><p>MRC=(Σq)i/σp 是每单位权重的局部波动斜率；RC=q_iMRC_i 是当前持仓贡献，单位为波动，RC 才能加总回 σp。</p></details>
        <details className="understanding-check"><summary>03 · 没有 expected-return 输入，为什么不等于预期收益为零或彼此相等？</summary><p>它只表示当前配置规则没有把 μ 作为显式输入；risk parity 仍隐含风险度量、资产宇宙、预算、杠杆与分散化选择，真实绩效仍依赖风险溢价、融资、估值和 regime。</p></details>
        <details className="understanding-check"><summary>04 · Inverse-vol 何时等于 ERC，为什么不能推广？</summary><p>两资产非退化等预算、对角 covariance、equicorrelation，或相关矩阵行和相同且组合风险非零时成立；若行和不同，贡献不相等；若共同的行和为 0，PCR 又因零组合风险而无定义。</p></details>
        <details className="understanding-check"><summary>05 · Inverse-vol 与 inverse-variance 有何不同？</summary><p>前者权重与 1/σ 成正比，后者与 1/σ² 成正比；后者对低波动倾斜更强，两者都不能代替 full-covariance ERC 的定义。</p></details>
        <details className="understanding-check"><summary>06 · 风险预算 b 为什么不是 VaR／ES limit、最大亏损或 breach 规则？</summary><p>b 只是当前模型希望各预算单元承担的事前风险份额；风险限额还需要损失度量、金额或资本口径、授权、监控、breach 与处置规则，属于 2.16 的组织治理层。</p></details>
        <details className="understanding-check"><summary>07 · q 与 g 分别改变什么？</summary><p>q 改变 risky basket 内资产相对构成；g 同比缩放整个 basket。正的共同缩放改变总波动和绝对 RC，却不改变 PCR。</p></details>
        <details className="understanding-check"><summary>08 · 个体波动不变时，相关性为何仍会改变目标权重？</summary><p>每项 MRC 使用它与整个组合的 covariance；相关矩阵一条边变化会改变多个 (Σq)i，从而改变贡献方程与 q。</p></details>
        <details className="understanding-check"><summary>09 · Asset ERC 为什么可能仍集中于一个宏观因子？</summary><p>多个资产标签可以共享同一个 duration、growth 或 liquidity loading；资产贡献均衡不等于 factor contribution 均衡。</p></details>
        <details className="understanding-check"><summary>10 · 怎样识别“solver 成功但预算失败”？</summary><p>同时检查 achieved PCR−b、max／RMS residual、哪些约束绑定，以及 Euler add-up；若约束排除精确解，即使程序正常结束，也应报告 constrained approximation。</p></details>
        <details className="understanding-check"><summary>11 · Target weights 为什么不是 flow？</summary><p>还需要 post-shock actual、NAV、价格、实现工具、外部现金流、跨账户净额、order、capacity 与 fill；任何一层都可能改变金额和符号。</p></details>
        <details className="understanding-check"><summary>12 · 怎样证伪“risk parity flow 放大了这次市场波动”？</summary><p>若 as-of Σ 和预算没有触发相应 target、真实 cohort 没有匹配 actual gap、实施窗口错位、没有同向 fills，或价格由共同新闻先行变化，就应拒绝该归因。</p></details>
      </section>

      <section className="lesson-section" id="glossary-interfaces">
        <p className="section-kicker">55 · Glossary、接口与闭环</p>
        <h2>本节最终产物不是“债券低波所以多买”，而是一张把风险度量、贡献、预算、求解、约束、账户和证据逐层分开的配置地图。</h2>
        <div className="interface-grid">
          <article><span>回接 T03 / 2.11</span><h3>Covariance 与执行</h3><p>T03 提供 variance／covariance；2.11 接收 w*=gq，完成 actual、order、fill、cash 与 cost。</p></article>
          <article><span>连接 2.13</span><h3>Global Macro</h3><p>本节给定 b 与资产宇宙；下一节解释增长、通胀、政策观点怎样改变方向、预算和 overlay。</p></article>
          <article><span>连接 2.16</span><h3>Risk Limits</h3><p>b 是模型风险份额，不是 VaR limit；2.16 再引入授权、breach、ES、资本与组织性强制交易。</p></article>
          <article><span>连接 4.17 / 7.10</span><h3>Correlation State</h3><p>后续把股债状态、共同因子和多主体反馈扩张成跨资产传导与系统性相关网络。</p></article>
        </div>
        <div className="precision-note">
          <span>术语回查</span>
          <p>Portfolio volatility 回到 05；Euler、MRC、RC、VC、PCR 回到 06–09；b 与 ERC 回到 10、14；inverse-vol／variance、GMV、MDP、HRP 回到 15–19；convex solver 与 residual 回到 21–27；q／g／target／flow 回到 23–35；asset／factor risk 回到 36–38；证据和研究协议回到 43–51。</p>
        </div>
        <p>
          最小复述应是：<b>截至决策前、同币种同频率的收益形成可校验协方差；组合波动的一阶齐次性使 q_i(Σq)_i/σp 能加总为总波动，标准化后与 b 比较；ERC 是 b=1/N 的特例，inverse-vol 只在特殊相关结构下等价；求解器在可行域中得到相对构成 q，外层 g 只共同缩放；价格与现金流先形成 post-shock actual，target−actual 才是候选订单，fill 才是成交。没有载体、现仓差、实施窗口和成交证据，不能从理论风险贡献推出真实流量或价格因果。</b>
        </p>
      </section>
    </>
  );
}

export const lesson212: LessonRecord = {
  slug: '2-12',
  id: '2.12',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Risk Parity：从协方差、边际风险贡献到约束下的跨资产权重',
  subtitle: '把资本权重改写为事前风险贡献，严格区分 MRC、RC、inverse-vol、ERC、risk budget、q 与 g，并守住资产／因子风险和目标／真实流量的边界',
  readingTime: '主线首读约 90–110 分钟（跳过标注的进阶证明与选读扩展），完整正文约 140–170；互动实验首次完成 30–40／含复盘 45–55，主动练习核对 20–25／完整书写 35–45，理解检查快速 10–12／完整复述 18–22，课程接口 4 分钟；快速路径约 154–191 分钟，完整学习约 242–296 分钟（建议分三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T03、2.11；按需回看 T01、T08、1.09、1.20 与 2.10',
  updatedAt: '2026-08-30',
  revision: '2.12-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.12-r2',
      summary: '独立复核 56 节、14 张公式卡、10 道互动题与 10 道静态变式、41 条来源和全部引文落点，并逐式核验 Euler、MRC／RC／VC／PCR、inverse-vol 特例、风险预算、约束残差、q／g、资产／因子分解、现行 S&P 方法及 ECB／BIS 证据边界；同时检查 Lab 状态、集成、构建与冻结哈希，P0–P3 均为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.12-r2',
      summary: '独立复核零基础符号与单位桥、导论＋六阶段递进、主线／进阶分层、反例与课程接口、10+10 题、12 道理解检查、阅读路径、来源层级，以及本地保存、损坏恢复、无默认答案、焦点／ARIA、无脚本、打印与移动端降级；结构、渲染和冻结哈希均一致，P0–P3 均为 0。',
    },
  ],
  previous: { slug: '2-11', label: '2.11 Volatility Targeting / Vol-control' },
  next: { slug: '2-13', label: '2.13 Global Macro Fund' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-prerequisite', label: '范围、先修与排除项' },
    { id: 'allocation-chain', label: '完整配置链' },
    { id: 'definition', label: 'Risk Parity 定义' },
    { id: 'capital-vs-risk-weight', label: 'Capital 与 Risk Weight' },
    { id: 'portfolio-volatility', label: 'Portfolio Volatility' },
    { id: 'euler-decomposition', label: 'Euler 可加性' },
    { id: 'marginal-risk-contribution', label: 'Marginal Risk Contribution' },
    { id: 'component-risk-contribution', label: 'Component Risk Contribution' },
    { id: 'normalized-risk-share', label: 'Percentage Risk Contribution' },
    { id: 'risk-budget', label: 'Risk Budget' },
    { id: 'symbol-unit-ledger', label: '符号、单位与时钟总账' },
    { id: 'two-asset-number-story', label: '两资产数值故事' },
    { id: 'correlation-redistribution', label: 'Correlation 重分配风险' },
    { id: 'erc-condition', label: 'ERC 条件' },
    { id: 'inverse-vol-special-case', label: 'Inverse-vol 特例' },
    { id: 'inverse-vol-vs-variance', label: 'Inverse-vol 与 Variance' },
    { id: 'equal-weight-vs-erc', label: 'Equal Weight 与 ERC' },
    { id: 'erc-vs-minimum-variance', label: 'ERC 与 Minimum Variance' },
    { id: 'erc-vs-max-diversification', label: '分散化目标比较' },
    { id: 'unequal-risk-budgeting', label: 'Unequal Risk Budgeting' },
    { id: 'convex-solution', label: 'Convex Solution（进阶）' },
    { id: 'solution-verification', label: 'Solution Verification' },
    { id: 'scale-invariance', label: 'Scale Invariance' },
    { id: 'q-vs-g', label: 'Relative q 与 Multiplier g' },
    { id: 'feasible-set', label: 'Feasible Set' },
    { id: 'negative-risk-contribution', label: 'Negative RC' },
    { id: 'binding-bounds', label: 'Binding Bounds' },
    { id: 'leverage-implementation', label: 'Leverage 与工具接口' },
    { id: 'turnover-regularization', label: 'Turnover 与 Regularization' },
    { id: 'covariance-clock', label: 'Covariance Clock' },
    { id: 'sampling-error', label: 'Sampling Error' },
    { id: 'shrinkage-psd', label: 'Shrinkage 与 PSD' },
    { id: 'stale-fx-synchronization', label: 'Stale、跨时区与 FX' },
    { id: 'dynamic-q-update', label: 'Dynamic q Update' },
    { id: 'target-weight-not-flow', label: 'Target Weight 与 Flow' },
    { id: 'asset-vs-factor-risk', label: 'Asset 与 Factor Risk' },
    { id: 'hidden-factor-concentration', label: 'Hidden Factor Concentration' },
    { id: 'factor-risk-parity', label: 'Factor Risk Parity' },
    { id: 'nonlinear-instruments', label: 'Nonlinear Instruments' },
    { id: 'risk-measure-choice', label: 'Risk Measure Choice' },
    { id: 'expected-return-absence', label: 'Expected-return 缺席' },
    { id: 'macro-view-boundary', label: 'Global Macro 接口' },
    { id: 'diversification-rationale', label: 'Diversification 有限主张' },
    { id: 'performance-evidence', label: 'Performance Evidence' },
    { id: 'stock-bond-correlation-state', label: 'Stock–Bond Correlation' },
    { id: 'positive-correlation-counterexample', label: 'Positive-correlation 反例' },
    { id: 'low-vol-leverage-counterexample', label: 'Low-vol Leverage 反例' },
    { id: 'estimation-turnover-counterexample', label: 'Estimation-noise 反例' },
    { id: 'liquidity-capacity-counterexample', label: 'Liquidity Capacity 反例' },
    { id: 'constraint-gap-counterexample', label: 'Constraint-gap 反例' },
    { id: 'research-audit-protocol', label: '可证伪研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'glossary-interfaces', label: 'Glossary 与接口' },
  ],
  Content: Lesson212Content,
  references: [
    { id: 1, authors: 'Harry Markowitz', year: '1952', accessedAt: '2026-08-30', title: 'Portfolio Selection', publication: 'Journal of Finance 7(1), 77–91', url: 'https://doi.org/10.1111/j.1540-6261.1952.tb01525.x', use: '支持 covariance-based portfolio variance 与均值—方差框架起点；不是 ERC、risk budgeting 或风险平价绩效文献。' },
    { id: 2, authors: 'Dirk Tasche', year: '2007', accessedAt: '2026-08-30', title: 'Capital Allocation to Business Units and Sub-Portfolios: the Euler Principle', publication: 'arXiv:0708.2542', url: 'https://arxiv.org/abs/0708.2542', use: '支持正齐次风险度量的 Euler allocation 与 full-addition principle；不使任意非光滑度量的贡献自动唯一。' },
    { id: 3, authors: 'Edward E. Qian', year: '2006', accessedAt: '2026-08-30', title: 'On the Financial Interpretation of Risk Contribution: Risk Budgets Do Add Up', publication: 'Journal of Investment Management 4(4), 41–51', url: 'https://papers.ssrn.com/sol3/papers.cfm?abstract_id=947876', use: '支持标准差／VaR 风险贡献与条件损失解释及 add-up；不能推广为任意尾部度量或现实因果损失归属。' },
    { id: 4, authors: 'Sébastien Maillard, Thierry Roncalli and Jérôme Teïletche', year: '2010', accessedAt: '2026-08-30', title: 'The Properties of Equally Weighted Risk Contribution Portfolios', publication: 'Journal of Portfolio Management 36(4), 60–70', url: 'https://doi.org/10.3905/jpm.2010.36.4.060', use: '支持 ERC 定义、性质及与 equal weight／minimum variance 的条件关系；不保证样本外绩效或任意约束下精确可行。' },
    { id: 5, authors: 'Florin Spinu', year: '2013; rev. 2020', accessedAt: '2026-08-30', title: 'An Algorithm for Computing Risk Parity Weights', publication: 'SSRN working paper 2297383, revised 13 January 2020', url: 'https://doi.org/10.2139/ssrn.2297383', use: '支持标准正预算、long-only 风险预算的凸 formulation 与计算；零预算、空头和一般约束需另行处理。' },
    { id: 6, authors: 'Benjamin Bruder and Thierry Roncalli', year: '2012', accessedAt: '2026-08-30', title: 'Managing Risk Exposures Using the Risk Budgeting Approach', publication: 'Working paper, MPRA 37749', url: 'https://mpra.ub.uni-muenchen.de/37749/', use: '支持 MRC、RC、一般 risk budget、两资产与对角特例；行业应用叙述不是独立绩效证据。' },
    { id: 7, authors: 'Denis B. Chaves, Jason C. Hsu, Feifei Li and Omid Shakernia', year: '2012', accessedAt: '2026-08-30', title: 'Efficient Algorithms for Computing Risk Parity Portfolio Weights', publication: 'Journal of Investing 21(3), 150–163', url: 'https://doi.org/10.3905/joi.2012.21.3.150', use: '支持若干 ERC 数值算法与计算比较；solver success 不证明任意约束下存在唯一精确解。' },
    { id: 8, authors: 'Olivier Ledoit and Michael Wolf', year: '2003', accessedAt: '2026-08-30', title: 'Improved Estimation of the Covariance Matrix of Stock Returns with an Application to Portfolio Selection', publication: 'Journal of Empirical Finance 10(5), 603–621', url: 'https://doi.org/10.1016/S0927-5398(03)00007-0', use: '支持向结构化 target 收缩以降低特定高维样本协方差误差；不能消除结构断点或证明所有 target 更优。' },
    { id: 9, authors: 'Olivier Ledoit and Michael Wolf', year: '2004', accessedAt: '2026-08-30', title: 'A Well-Conditioned Estimator for Large-Dimensional Covariance Matrices', publication: 'Journal of Multivariate Analysis 88(2), 365–411', url: 'https://doi.org/10.1016/S0047-259X(03)00096-4', use: '支持在论文渐近框架与损失函数下的线性 shrinkage；不保证经济 covariance state 正确。' },
    { id: 10, authors: 'Xi Bai, Katya Scheinberg and Reha Tütüncü', year: '2016', accessedAt: '2026-08-30', title: 'Least-Squares Approach to Risk Parity in Portfolio Selection', publication: 'Quantitative Finance 16(3), 357–376', url: 'https://doi.org/10.1080/14697688.2015.1031815', use: '支持空头 orthants、多解和一般 bounds 下 exact risk parity 可能不存在；least-squares 只是特定近似准则。' },
    { id: 11, authors: 'Yiyong Feng and Daniel P. Palomar', year: '2015', accessedAt: '2026-08-30', title: 'SCRIP: Successive Convex Optimization Methods for Risk Parity Portfolio Design', publication: 'IEEE Transactions on Signal Processing 63(19), 5285–5300', url: 'https://doi.org/10.1109/TSP.2015.2452219', use: '支持带约束／稀疏 RP 的 successive convex 方法；收敛至驻点不自动等于全局最优或样本外优越。' },
    { id: 12, authors: 'Thierry Roncalli', year: '2013', accessedAt: '2026-08-30', title: 'Introduction to Risk Parity and Budgeting', publication: 'Chapman & Hall/CRC Financial Mathematics Series', url: 'https://doi.org/10.1201/b15151', use: '系统支持 risk budgeting、约束、因子预算和多资产实现；教材框架不能替代具体产品方法或因果流量证据。' },
    { id: 13, authors: 'Ravi Jagannathan and Tongshu Ma', year: '2003', accessedAt: '2026-08-30', title: 'Risk Reduction in Large Portfolios: Why Imposing the Wrong Constraints Helps', publication: 'Journal of Finance 58(4), 1651–1684', url: 'https://doi.org/10.1111/1540-6261.00580', use: '支持 GMV 中禁空等约束可隐含改变 covariance 并改善稳定性的条件结果；不表示任意错误约束都有益。' },
    { id: 14, authors: 'Roger Clarke, Harindra de Silva and Steven Thorley', year: '2006', accessedAt: '2026-08-30', title: 'Minimum-Variance Portfolios in the U.S. Equity Market', publication: 'Journal of Portfolio Management 33(1), 10–24', url: 'https://doi.org/10.3905/jpm.2006.661366', use: '支持美国股票 minimum-variance 组合的实证性质；不能外推为跨资产、跨时期稳定优势。' },
    { id: 15, authors: 'Roger Clarke, Harindra de Silva and Steven Thorley', year: '2011', accessedAt: '2026-08-30', title: 'Minimum-Variance Portfolio Composition', publication: 'Journal of Portfolio Management 37(2), 31–45', url: 'https://doi.org/10.3905/jpm.2011.37.2.031', use: '支持单因子 long-only 框架的 GMV 解析构成；不是一般 covariance 或约束下定理。' },
    { id: 16, authors: 'Victor DeMiguel, Lorenzo Garlappi and Raman Uppal', year: '2009', accessedAt: '2026-08-30', title: 'Optimal Versus Naive Diversification: How Inefficient Is the 1/N Portfolio Strategy?', publication: 'Review of Financial Studies 22(5), 1915–1953', url: 'https://doi.org/10.1093/rfs/hhm075', use: '支持估计误差可在论文模型与数据中吞噬优化收益、1/N 是严肃基准；不证明 1/N 永远优于 ERC。' },
    { id: 17, authors: 'Yves Choueifaty and Yves Coignard', year: '2008', accessedAt: '2026-08-30', title: 'Toward Maximum Diversification', publication: 'Journal of Portfolio Management 35(1), 40–51', url: 'https://doi.org/10.3905/JPM.2008.35.1.40', use: '引入 diversification ratio 与 most diversified portfolio；不应与 ERC 合并或作普遍绩效定理。' },
    { id: 18, authors: 'Yves Choueifaty, Tristan Froidure and Julien Reynier', year: '2013', accessedAt: '2026-08-30', title: 'Properties of the Most Diversified Portfolio', publication: 'Journal of Investment Strategies 2(2), 49–70', url: 'https://doi.org/10.21314/JOIS.2013.033', use: '支持 MDP 的若干不变性与性质；规范性条件与商业方法背景限制其外推。' },
    { id: 19, authors: 'Roger Clarke, Harindra de Silva and Steven Thorley', year: '2013', accessedAt: '2026-08-30', title: 'Risk Parity, Maximum Diversification, and Minimum Variance: An Analytic Perspective', publication: 'Journal of Portfolio Management 39(3), 39–53', url: 'https://doi.org/10.3905/jpm.2013.39.3.039', use: '支持三类组合在单因子 long-only 设定的解析比较；不能推广为一般 covariance 下恒定排序。' },
    { id: 20, authors: 'Marcos López de Prado', year: '2016', accessedAt: '2026-08-30', title: 'Building Diversified Portfolios that Outperform Out of Sample', publication: 'Journal of Portfolio Management 42(4), 59–69', url: 'https://doi.org/10.3905/jpm.2016.42.4.059', use: '支持 HRP 的 clustering、quasi-diagonalization 与 recursive bisection；实验 OOS 结果不是普适定理，HRP 不保证资产 ERC。' },
    { id: 21, authors: 'Thomas Raffinot', year: '2018', accessedAt: '2026-08-30', title: 'Hierarchical Clustering-Based Asset Allocation', publication: 'Journal of Portfolio Management 44(2), 89–99', url: 'https://doi.org/10.3905/jpm.2018.44.2.089', use: '支持多层 clustering-based allocation；HCAA 与 HERC 不应混同，树结构是模型选择。' },
    { id: 22, authors: 'Thomas Raffinot', year: '2018', accessedAt: '2026-08-30', title: 'The Hierarchical Equal Risk Contribution Portfolio', publication: 'SSRN working paper 3237540', url: 'https://doi.org/10.2139/ssrn.3237540', use: '支持层级结构与 ERC／其他风险度量结合；层级预算不自动等于完整资产级 ERC。' },
    { id: 23, authors: 'Francisco Salas-Molina and Jordi Nin', year: '2026', accessedAt: '2026-08-30', title: 'Fast Hierarchical Risk Parity Methods for Portfolio Selection', publication: 'Annals of Operations Research, published 9 March 2026', url: 'https://doi.org/10.1007/s10479-026-07149-2', use: '支持 HRP 某些排序性质和大规模计算加速；有限实验不证明一般投资优势。' },
    { id: 24, authors: 'Thierry Roncalli and Guillaume Weisang', year: '2016', accessedAt: '2026-08-30', title: 'Risk Parity Portfolios with Risk Factors', publication: 'Quantitative Finance 16(3), 377–388', url: 'https://doi.org/10.1080/14697688.2015.1046907', use: '支持资产与因子风险贡献映射及 factor budgeting；结果依赖因子定义、标准化、旋转和 residual 处理。' },
    { id: 25, authors: 'Attilio Meucci', year: '2009', accessedAt: '2026-08-30', title: 'Managing Diversification', publication: 'Risk 22(5), 74–79; SSRN 1358533', url: 'https://ssrn.com/abstract=1358533', use: '支持用 entropy／effective bets 描述分散化；正交 bet 选择不唯一，practitioner 文章不是普遍绩效证明。' },
    { id: 26, authors: 'Harald Lohre, Heiko Opfer and Gábor Ország', year: '2014', accessedAt: '2026-08-30', title: 'Diversifying Risk Parity', publication: 'Journal of Risk 16(5), 53–79', url: 'https://doi.org/10.21314/JOR.2014.284', use: '支持 PCA／不相关风险源下的 diversified risk parity；因子基底与样本窗口限制解释。' },
    { id: 27, authors: 'Attilio Meucci, Alberto Santangelo and Romain Deguest', year: '2015', accessedAt: '2026-08-30', title: 'Risk Budgeting and Diversification Based on Optimized Uncorrelated Factors', publication: 'Risk, 5 November 2015, 70–75; SSRN working paper 2276632', url: 'https://www.risk.net/risk-management/2433224/risk-budgeting-and-diversification-based-on-optimised-uncorrelated-factors', use: '支持 optimized uncorrelated factors 与 effective bets；Risk 杂志论文及 SSRN 2276632 工作论文版本不证明该因子体系是唯一真实分散化。' },
    { id: 28, authors: 'Martin B. Haugh, Garud Iyengar and Irene Song', year: '2017', accessedAt: '2026-08-30', title: 'A Generalized Risk Budgeting Approach to Portfolio Construction', publication: 'Journal of Computational Finance 21(2), 29–60', url: 'https://www.risk.net/journal-of-computational-finance/5316546/a-generalized-risk-budgeting-approach-to-portfolio-construction', use: '支持重叠风险组和一般齐次风险度量的预算；一般问题可能非凸，局部解不等于自动全局唯一。' },
    { id: 29, authors: 'Jean-Charles Richard and Thierry Roncalli', year: '2019', accessedAt: '2026-08-30', title: 'Constrained Risk Budgeting Portfolios: Theory, Algorithms, Applications & Puzzles', publication: 'arXiv:1902.05710', url: 'https://arxiv.org/abs/1902.05710', use: '支持额外约束、turnover 与尺度化会改变风险预算问题，天真 clip 通常不可行；工作论文不提供普适绩效结论。' },
    { id: 30, authors: 'Hassan T. Anis and Roy H. Kwon', year: '2022', accessedAt: '2026-08-30', title: 'Cardinality-Constrained Risk Parity Portfolios', publication: 'European Journal of Operational Research 302(1), 392–402', url: 'https://doi.org/10.1016/j.ejor.2021.12.045', use: '支持 cardinality-constrained RP 的混合整数 formulation；样本结果不证明稀疏 RP 普遍更优。' },
    { id: 31, authors: 'Cliff S. Asness, Andrea Frazzini and Lasse Heje Pedersen', year: '2012', accessedAt: '2026-08-30', title: 'Leverage Aversion and Risk Parity', publication: 'Financial Analysts Journal 68(1), 47–59', url: 'https://doi.org/10.2469/faj.v68.n1.1', use: '支持 leverage aversion 对低风险资产定价与 risk parity 逻辑的理论／历史证据；商业关联且不保证未来超额收益。' },
    { id: 32, authors: 'Robert M. Anderson, Stephen W. Bianchi and Lisa R. Goldberg', year: '2012', accessedAt: '2026-08-30', title: 'Will My Risk Parity Strategy Outperform?', publication: 'Financial Analysts Journal 68(6), 75–93', url: 'https://doi.org/10.2469/faj.v68.n6.7', use: '支持回测起止、杠杆成本与统计不确定性显著改变比较；不证明 risk parity 必然跑赢或跑输。' },
    { id: 33, authors: 'Wai Lee', year: '2011', accessedAt: '2026-08-30', title: 'Risk-Based Asset Allocation: A New Answer to an Old Question?', publication: 'Journal of Portfolio Management 37(4), 11–28', url: 'https://doi.org/10.3905/jpm.2011.37.4.011', use: '支持多个 risk-based 方法的结构联系和隐含收益假设；不提供样本外普遍优越性。' },
    { id: 34, authors: 'Denis B. Chaves, Jason C. Hsu, Feifei Li and Omid Shakernia', year: '2011', accessedAt: '2026-08-30', title: 'Risk Parity Portfolio Versus Other Asset Allocation Heuristic Portfolios', publication: 'Journal of Investing 20(1), 108–118', url: 'https://doi.org/10.3905/joi.2011.20.1.108', use: '支持特定历史样本中 risk parity 与启发式配置比较；不能忽略成本、融资、资产选择后外推。' },
    { id: 35, authors: 'Edward E. Qian', year: '2005', accessedAt: '2026-08-30', title: 'Risk Parity Portfolios: Efficient Portfolios Through True Diversification', publication: 'PanAgora Asset Management research paper, September 2005', url: 'https://www.panagora.com/wp-content/uploads/2011/09/PanAgora-Risk-Parity-Portfolios-Efficient-Portfolios-Through-True-Diversification.pdf', use: '支持术语史、60/40 风险集中示例和早期行业逻辑；资产管理人白皮书不能证明普遍效率或未来收益。' },
    { id: 36, authors: 'S&P Dow Jones Indices', year: '2025', accessedAt: '2026-08-30', title: 'S&P Risk Parity Indices Methodology', publication: 'Official methodology, September 2025', url: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-risk-parity-indices.pdf?force_download=true', use: '支持传统家族、2.0 家族的具体 weighting、budget、lookback、leverage 与 monthly rebalance；只是该指数家族规则，不是学术统一定义或真实 fund flow。' },
    { id: 37, authors: 'Danilo Vassallo, Lieven Hermans and Thomas Kostka', year: '2020', accessedAt: '2026-08-30', title: 'Volatility-Targeting Strategies and the Market Sell-Off', publication: 'ECB Financial Stability Review, May 2020, Box 2, 41–43', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2020/html/ecb.fsrbox202005_02~f6616db9be.en.html', use: '支持四资产、日频、一个月风险、8% target 与约 225% 模型化出售情景；不支持行业实际成交或 risk parity 单因果归因。' },
    { id: 38, authors: 'Benjamin Mosk, Lorenzo Pangallo and Sebastiano Michele Zema', year: '2022', accessedAt: '2026-08-30', title: 'Cross-Asset Correlations in a More Inflationary Environment and Challenges for Diversification Strategies', publication: 'ECB Financial Stability Review, November 2022, Box 2, 46–49', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2022/html/ecb.fsrbox202211_02~7abb48e333.en.html', use: '支持股债相关状态、供给／贴现率渠道及约束导致不同再平衡；不支持固定通胀阈值或真实 risk-parity flow 识别。' },
    { id: 39, authors: 'Andreas Schrimpf, Hyun Song Shin and Vladyslav Sushko', year: '2020', accessedAt: '2026-08-30', title: 'Leverage and Margin Spirals in Fixed Income Markets During the Covid-19 Crisis', publication: 'BIS Bulletin No. 2, 2 April 2020', url: 'https://www.bis.org/publ/bisbull02.htm', use: '支持 leverage、margin、forced sale 与 dealer balance-sheet feedback；不支持把 Treasury 压力单独归因于 risk parity。' },
    { id: 40, authors: 'Stephen Boyd and Lieven Vandenberghe', year: '2004', accessedAt: '2026-08-30', title: 'Convex Optimization', publication: 'Cambridge University Press', url: 'https://web.stanford.edu/~boyd/cvxbook/bv_cvxbook.pdf', use: '支持 convexity、strict convexity、KKT 与 log-barrier 基础；不替代风险预算专门存在条件或金融实证。' },
    { id: 41, authors: 'Myron Scholes and Joseph Williams', year: '1977', accessedAt: '2026-08-30', title: 'Estimating Betas from Nonsynchronous Data', publication: 'Journal of Financial Economics 5(3), 309–327', url: 'https://doi.org/10.1016/0304-405X(77)90041-1', use: '支持非同步观测会使同日 covariance／beta 估计产生系统偏差；不直接规定跨资产组合唯一正确的同步窗口或 FX 口径。' },
  ],
  readingList: [
    { title: '本节 03–20、23–24 · Mechanism Core', scope: 'σp、Euler、MRC、RC、PCR、ERC、inverse-vol、risk budget 与 q/g；21–22 的证明／实现审计可后读', reason: '先闭合从 covariance 到相对构成的主链，再进入进阶求解、实施和证据。', url: '#definition', group: 'core', guide: '按顺序精读并手算主线公式卡；约 90–110 分钟。' },
    { title: 'Maillard, Roncalli & Teïletche (2010)', scope: 'ERC 定义、性质及与 EW／GMV 的条件关系', reason: 'Canonical ERC 的最短学术入口。', url: 'https://doi.org/10.3905/jpm.2010.36.4.060', group: 'core', guide: '先读定义与两资产例子，再读性质；约 120–180 分钟。' },
    { title: 'Roncalli (2013) · Introduction to Risk Parity and Budgeting', scope: '风险贡献、一般预算、约束、因子与多资产实现', reason: '把单节机制扩张成系统教材。', url: 'https://doi.org/10.1201/b15151', group: 'core', guide: '先读 risk contribution 与 risk-budgeting 章节；约 4–6 小时。' },
    { title: 'Spinu · Computing Risk Parity Weights', scope: '凸 formulation、正解、数值算法与收敛', reason: '理解“求解器成功”背后的数学条件。', url: 'https://doi.org/10.2139/ssrn.2297383', group: 'core', guide: '配合本节 21–22；约 120–180 分钟。' },
    { title: '方法规则书 · S&P Risk Parity Indices Methodology · September 2025', scope: '传统两层 inverse-vol、2.0 optimizer、target risk、lookback 与 monthly rebalance', reason: '把现行产品规则书与学术定义、经验结果明确分层。', url: 'https://www.spglobal.com/spdji/en/documents/methodologies/methodology-sp-risk-parity-indices.pdf?force_download=true', group: 'core', guide: '重点读 pp.3–12 与 launch/backtest 表；约 90–120 分钟。' },
    { title: 'ECB May 2020 Box 2', scope: '四资产、8% target、日频风格化模型与约 225% sale', reason: '学习把 ERC、外层去杠杆与真实 flow 的证据层级分开。', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2020/html/ecb.fsrbox202005_02~f6616db9be.en.html', group: 'core', guide: '逐项记录假设与未知量；约 45–60 分钟。' },
    { title: 'Tasche · The Euler Principle', scope: '正齐次风险度量、Euler allocation 与 full-addition', reason: '理解风险贡献为什么能够加总。', url: 'https://arxiv.org/abs/0708.2542', group: 'models', guide: '先修微分与齐次函数；约 120–180 分钟。' },
    { title: 'Bruder & Roncalli · Risk Budgeting Approach', scope: 'MRC、RC、一般 budgets、两资产与对角特例', reason: '把 ERC 放回更一般 risk-budgeting 家族。', url: 'https://mpra.ub.uni-muenchen.de/37749/', group: 'models', guide: '重点手推 b 不相等的公式；约 120–180 分钟。' },
    { title: 'Ledoit & Wolf (2004)', scope: '大维 covariance 的 condition 与 linear shrinkage', reason: '理解稳定矩阵和正确经济模型不是同一件事。', url: 'https://doi.org/10.1016/S0047-259X(03)00096-4', group: 'models', guide: '先读直觉、target 与损失函数；约 150–210 分钟。' },
    { title: 'Richard & Roncalli (2019)', scope: '约束风险预算、turnover、scaling 与 puzzles', reason: '防止“先算 ERC 再 clip”的错误实现。', url: 'https://arxiv.org/abs/1902.05710', group: 'models', guide: '与本节 25–29 对读；约 150–210 分钟。' },
    { title: 'Roncalli & Weisang (2016)', scope: 'Asset contribution 与 factor contribution', reason: '理解资产均衡为什么不等于经济因子均衡。', url: 'https://doi.org/10.1080/14697688.2015.1046907', group: 'models', guide: '重点读 factor mapping 与 residual；约 150–210 分钟。' },
    { title: 'López de Prado (2016)', scope: 'HRP 的 clustering、排序与 recursive bisection', reason: '区分层级配置与 canonical ERC。', url: 'https://doi.org/10.3905/jpm.2016.42.4.059', group: 'models', guide: '把 OOS claim 与算法定义分开读；约 120–180 分钟。' },
    { title: 'Choueifaty & Coignard (2008)', scope: 'Diversification ratio 与 MDP', reason: '防止把 maximum diversification 与 ERC 合并。', url: 'https://doi.org/10.3905/JPM.2008.35.1.40', group: 'models', guide: '配合本节 taxonomy；约 90–150 分钟。' },
    { title: 'DeMiguel, Garlappi & Uppal (2009)', scope: '1/N 基准、估计误差与样本外比较', reason: '建立优化组合必须战胜的严肃基准。', url: 'https://doi.org/10.1093/rfs/hhm075', group: 'evidence', guide: '注意其重点是 mean–variance 家族；约 150–210 分钟。' },
    { title: 'Asness, Frazzini & Pedersen (2012)', scope: 'Leverage aversion 与 low-risk asset pricing', reason: '理解 risk parity 可能有效的经济机制及其融资前提。', url: 'https://doi.org/10.2469/faj.v68.n1.1', group: 'evidence', guide: '与 Anderson 等反证对读；约 120–180 分钟。' },
    { title: 'Anderson, Bianchi & Goldberg (2012)', scope: '起止点、leverage cost 与不确定性', reason: '防止把一段历史回测写成普遍收益结论。', url: 'https://doi.org/10.2469/faj.v68.n6.7', group: 'evidence', guide: '逐项记录比较设定；约 120–180 分钟。' },
    { title: 'ECB November 2022 Box 2', scope: '股债 correlation regime、供给冲击与约束差异', reason: '训练拒绝“相关上升→所有人同向卖出”的单箭头叙事。', url: 'https://www.ecb.europa.eu/press/financial-stability-publications/fsr/focus/2022/html/ecb.fsrbox202211_02~7abb48e333.en.html', group: 'evidence', guide: '读原文模型与模态词；约 45–60 分钟。' },
    { title: 'BIS Bulletin No. 2 (2020)', scope: 'Leverage、margin spiral 与 dealer capacity', reason: '把 risk-parity 订单接口放回更大的融资网络。', url: 'https://www.bis.org/publ/bisbull02.htm', group: 'evidence', guide: '不要把 Treasury 压力单因果归于 risk parity；约 45–60 分钟。' },
    { title: 'Clarke, de Silva & Thorley (2013)', scope: 'RP、MDP 与 GMV 的解析比较', reason: '在清楚限定的单因子 long-only 环境中比较三个目标。', url: 'https://doi.org/10.3905/jpm.2013.39.3.039', group: 'evidence', guide: '把特定结构与一般结论分开；约 120–180 分钟。' },
    { title: 'Qian (2005) · Early Risk Parity Paper', scope: '术语史、60/40 风险集中与行业动机', reason: '理解概念如何进入资产管理实践，同时识别白皮书边界。', url: 'https://www.panagora.com/wp-content/uploads/2011/09/PanAgora-Risk-Parity-Portfolios-Efficient-Portfolios-Through-True-Diversification.pdf', group: 'evidence', guide: '作为历史材料读，不作普遍绩效证明；约 60–90 分钟。' },
  ],
};
