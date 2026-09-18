import Link from 'next/link';
import AShareTradabilityLab from '../components/AShareTradabilityLab';
import type { LessonRecord, LessonReference } from './types';

const SOURCE_ORDER_A = [1, 3, 8, 26, 35, 49, 2, 4, 5, 28, 27, 12, 76, 50, 14, 15, 16, 7, 75, 17, 18, 19, 20] as const;
const SOURCE_ORDER_B = [70, 71, 72, 73, 12, 74, 36, 13, 22, 29, 33, 35, 14, 15, 16, 21, 37, 38, 30, 31, 32, 34, 39, 8, 42, 43, 44, 9, 10, 46, 11, 1, 2, 3, 4, 5, 6, 56, 68, 57, 58, 59, 52, 53, 60, 61, 62, 69, 47, 48, 51, 63, 67, 64, 65, 54, 55, 66, 26, 27] as const;

function Citation({ sourceId, order }: { sourceId: number; order: readonly number[] }) {
  const index = order.indexOf(sourceId);
  if (index < 0) throw new Error(`Source ${sourceId} is not registered for this lesson page.`);
  const localId = index + 1;
  return <a className="citation-mark" href={`#ref-${localId}`} aria-label={`参考文献 ${localId}`}>[{localId}]</a>;
}

function Cite({ n }: { n: number }) {
  return <Citation sourceId={n} order={SOURCE_ORDER_A} />;
}

function CiteB({ n }: { n: number }) {
  return <Citation sourceId={n} order={SOURCE_ORDER_B} />;
}

function Lesson126AContent() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>A 股的特殊性不在某一条孤立规则，而在“可交易集合”会随时间、价格、库存、账户—通道可达性与公司状态离散切换；信息可以连续变化，表达信息的路径却并不连续。</h2>
        <p>
          把 A 股概括成“散户多、T+1、有涨跌停”，只能得到标签，得不到价格机制。09:18 与 09:23 的同一张开盘订单拥有不同撤单权；同一投资者能卖昨日持仓，却不能卖今日新买批次；普通股票、债券 ETF 与股指期货具有不同回转资格；本地投资者 15:10 可以进入沪深盘后固定价格交易，北向通道却尚未覆盖这个时段。信息没有改变，谁能在何时用何种工具表达它却改变了。<Cite n={1} /><Cite n={3} /><Cite n={8} />
        </p>
        <p>
          因而本节的中心不是比较“A 股是否比美股更有效”，而是重建一条条件因果链：信息到达→当时可交易的订单、库存与产品—通道集合→参与者选择替代路径→订单流在时段与产品间迁移→某个市场暂时承担价格发现→拍卖、复牌、库存解锁或套利使价格重新传播。制度可能改善开收盘协调、阻止错误订单，也可能把未完成调整送到次日、期货、期权或其他可售资产；两种结果可以同时存在。<Cite n={26} /><Cite n={35} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>先把“市场是否开放”改写成五维状态，再把目标仓位经过这个状态映射成真实订单；A 股微观结构才从制度背景变成动态价格生成器。</h2>
        <div className="mechanism-chain" aria-label="A股状态依赖价格形成：一次冲击、五个并行门控、真实执行与反馈">
          <div><span>01</span><b>信息与约束冲击</b><p>公告、宏观消息、赎回、保证金或公司行动改变估值和目标仓位。</p></div>
          <div><span>02A</span><b>时间门控</b><p>集合竞价、连续竞价、午休、收盘或盘后决定撮合方式与撤单权。</p></div>
          <div><span>02B</span><b>价格门控</b><p>日边界、动态申报范围、临停和停牌决定哪些价格与订单有效。</p></div>
          <div><span>02C</span><b>库存门控</b><p>旧仓、新买批次、借券库存与衍生品头寸决定谁能立即退出。</p></div>
          <div><span>02D</span><b>可达性门控</b><p>账户权限与通道决定股票、ETF、期货、期权和沪深股通是否可用。</p></div>
          <div><span>02E</span><b>公司门控</b><p>风险警示、停复牌、退市整理与除权除息重写参考价和资格。</p></div>
          <div><span>07</span><b>真实执行</b><p>可用订单进入不同簿册，形成成交、队列、基差或未完成需求。</p></div>
          <div><span>08</span><b>反馈与传播</b><p>新价格改变保证金、套利、可售库存和下一状态中的行为选择。</p></div>
        </div>
        <div className="equation-card">
          <span>可交易集合不是常数</span>
          <div>Ω<sub>i,s,t</sub>=Ω(T<sub>t</sub>,P<sub>s,t</sub>,I<sub>i,s,t</sub>,A<sub>i,s,t</sub>,C<sub>s,t</sub>)</div>
          <div>Ω<sub>i,t</sub>=∪<sub>s</sub>Ω<sub>i,s,t</sub></div>
          <div>x<sub>i,t</sub>=G(x*<sub>i,t</sub>,Ω<sub>i,t</sub>,L<sub>t</sub>)</div>
          <p>s 是“工具—场所—路由”的复合索引，Ωi,s,t 是投资者 i 在该接口真正可执行的订单集合；对所有 s 取并集，才得到该投资者此刻跨接口的总可交易集合 Ωi,t。T、P、I、A、C 分别代表时间、价格、库存、账户/通道可达性与公司状态。x* 是其目标交易，L 是各接口流动性，x 是由不同接口实际成交组成的向量；状态不同会带来不同数量、替代对冲或等待，不必然把交易方向反转。</p>
        </div>
        <p>
          这套状态机跨越秒、日与制度周期。秒级撤单窗口决定集合竞价前是否还能后悔；日内价格笼子和午休决定订单何时出现；隔夜库存解锁决定今日买方何时变成潜在卖方；数年尺度上的互联互通、衍生品限制和披露改革又改变研究者能观察什么。不能先把所有时期拼成一张静态面板，再用一个“China dummy”解释结果。
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与两页路线</p>
        <h2>1.26A–B 共同整合前 25 节，不重复完整推导订单簿、ETF、期货、期权或涨跌停；上篇先锁定交易时钟、价格边界与可售库存，下篇再追踪压力如何迁往产品、跨境接口与公司状态。</h2>
        <p>
          硬先修是 1.02 的市场架构；按需回看 1.04 限价订单簿、1.17 集合竞价、1.19 卖空、1.20 杠杆、1.21–1.24 ETF/期货/期权与 1.25 交易约束。正文规则快照日为 2026-08-29：沪深 2026 修订规则已于 7 月 6 日实施；北交所盘后固定价格及部分风险警示条款虽已写入规则，却有延后或 8 月 31 日才实施的边界；沪深股通操作状态以 7 月 6 日版港交所手册为准。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={8} />
        </p>
        <div className="learning-objectives">
          <span>六阶段学习路线 · 两页完成一条因果链</span>
          <ol>
            <li><b>1.26A · 时间与订单状态（03–16）：</b>重建市场板块、集合竞价、午休、收盘、盘后、申报类型与数量单位。</li>
            <li><b>1.26A · 价格与库存状态（17–24）：</b>区分静态边界、动态价格范围、临停、可售库存、交收、融券与多空不对称。</li>
            <li><b>1.26B · 产品与跨市场接口（25–30）：</b>连接 ETF、期货、期权、基差与状态依赖的价格领先。</li>
            <li><b>1.26B · 跨境与投资者身份（31–36）：</b>拆开沪深股通时钟、额度、披露制度、账户身份和最终资金属性。</li>
            <li><b>1.26B · 公司状态（37–41）：</b>处理风险警示、停复牌、退市整理、公司行动与北交所边界。</li>
            <li><b>1.26B · 证据与研究（42–49）：</b>比较实证、建立数据协议、识别设计、互动、练习、诊断与课程接口。</li>
          </ol>
          <p><b>时间预算：</b>本页主线首读约 75–90 分钟；连同公式复算与四项诊断约 95–110 分钟。下一页 1.26B 主线首读约 70–85 分钟，完成互动与练习约 85–105 分钟。两页都可独立暂停，参考文献与延伸阅读不计入。</p>
        </div>
        <div className="model-glossary" aria-label="本单元最小术语桥">
          <article><b>ETF / LOF</b><p>ETF 是交易型开放式基金，通常同时连接交易所份额买卖与一级申赎；LOF 是上市型开放式基金，交易与申赎接口不应凭名称和 ETF 混同。</p></article>
          <article><b>NAV / bid / ask</b><p>NAV 是基金净资产价值；bid 是当时最高买价，ask 是最低卖价。屏幕净值与真正可成交篮子价格可能不同。</p></article>
          <article><b>ST / *ST</b><p>沪深名称前缀用于提示其他风险警示或退市风险警示；具体触发、板块归属、交易边界和北交所语义必须按规则版本核验。</p></article>
          <article><b>QFII</b><p>合格境外投资者制度，是区别于沪深股通的另一类跨境准入通道；通道标签不等于最终所有者或交易策略。</p></article>
          <article><b>Beta / hedge</b><p>Beta 描述资产相对某个市场因子的统计敏感度；hedge 是对冲，即用另一头寸减少目标风险，二者都不保证一比一复制。</p></article>
          <article><b>Outcome / variation</b><p>outcome 是研究要解释的结果变量；variation 是处理与对照之间可用于识别的差异，不是看到规则变化就自动获得因果实验。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="market-map">
        <p className="section-kicker">阶段一 · 时间与订单状态　|　03 · A 股不是一个单一规则市场</p>
        <h2>“A 股”描述人民币普通股这一大类证券，却横跨不同交易所和板块；板块决定价格边界、申报单位、投资者门槛与新股时钟。</h2>
        <div className="table-scroll" role="region" aria-label="A股主要市场与板块对比，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">沪深北主要股票板块及其制度接口</caption>
            <thead><tr><th scope="col">场所 / 板块</th><th scope="col">典型日限价</th><th scope="col">买入数量入口</th><th scope="col">关键接口</th></tr></thead>
            <tbody>
              <tr><th scope="row">上交所主板</th><td>通常 ±10%</td><td>100 股或整数倍</td><td>沪股通、ETF、上证50/沪深300衍生品</td></tr>
              <tr><th scope="row">科创板</th><td>通常 ±20%</td><td>最低 200，之后逐股</td><td>专业投资者北向边界、纯 ±2% 价格范围</td></tr>
              <tr><th scope="row">深交所主板</th><td>通常 ±10%</td><td>100 股或整数倍</td><td>深股通、ETF、指数衍生品</td></tr>
              <tr><th scope="row">创业板</th><td>通常 ±20%</td><td>100 股或整数倍</td><td>深市统一动态价格范围、专业投资者北向边界</td></tr>
              <tr><th scope="row">北交所</th><td>通常 ±30%</td><td>最低 100，之后逐股</td><td>上市首日无静态限价、部分 2026 条款延后</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          表中的“通常”很重要。无日涨跌幅期、停复牌、除权除息、风险警示与退市状态都可能改写基准和限制；ETF、债券与衍生品又有自己的规则。研究者若把证券代码前缀当作永久制度标签，会在转板、规则修订和特殊交易日产生系统性误分类。<Cite n={1} /><Cite n={3} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="state-vector">
        <p className="section-kicker">04 · 五维状态向量</p>
        <h2>每笔订单都应先回答五个状态问题；任何一个答案改变，都可能使“同样的买卖意愿”变成废单、队列、另一产品的成交或完全等待。</h2>
        <div className="table-scroll" role="region" aria-label="A股可交易性五维状态，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">五类状态、核心问题和可观察变量</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">先问什么</th><th scope="col">最小观测</th><th scope="col">常见误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">时间 T</th><td>集合、连续、午休、收盘还是盘后？</td><td>本地时区、申报/撤单/撮合时钟</td><td>把 15:10 当成普通连续竞价</td></tr>
              <tr><th scope="row">价格 P</th><td>静态边界、动态范围或临停是否生效？</td><td>前收、盘口基准、开盘价、最小价位（tick）</td><td>把价格笼子写成日涨停</td></tr>
              <tr><th scope="row">库存 I</th><td>这批证券今日是否可卖？</td><td>旧仓、新买、借券与冻结批次</td><td>用总持仓代替可售数量</td></tr>
              <tr><th scope="row">可达性 A</th><td>替代产品和跨境接口对该账户是否开放？</td><td>产品时钟、额度、账户与通道权限</td><td>本地开放就推定所有主体均可达</td></tr>
              <tr><th scope="row">公司 C</th><td>风险警示、停牌或公司行动是否重置状态？</td><td>公告、除权因子、复牌与整理期</td><td>把机械除息跌幅当作亏损</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这五维不是彼此独立。跌停会降低现货可成交性，促使机构转向期货；期货保证金上升又迫使其卖出其他可售股票；今日新买股票不能卖，使相同负面消息对旧仓与新仓产生不同订单；午休期间海外市场继续交易，又会改变 13:00 的价格跳跃。真正的系统来自交互项，而不是把五个虚拟变量并排放入回归。
        </p>
      </section>

      <section className="lesson-section" id="day-timeline">
        <p className="section-kicker">05 · 一个完整交易日</p>
        <h2>沪深北股票的普通竞价日由两个集中拍卖窗口、两段连续竞价和一段午休组成；不存在 13:00 的第二次开盘集合竞价。</h2>
        <div className="table-scroll" role="region" aria-label="A股普通竞价交易日时间线，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">沪深北股票普通竞价时段；盘后固定价格行仅适用于沪深</caption>
            <thead><tr><th scope="col">北京时间</th><th scope="col">状态</th><th scope="col">撮合</th><th scope="col">撤单关键点</th></tr></thead>
            <tbody>
              <tr><th scope="row">09:15–09:20</th><td>开盘集合竞价前段</td><td>集中等待</td><td>通常可撤</td></tr>
              <tr><th scope="row">09:20–09:25</th><td>开盘集合竞价锁定段</td><td>09:25 统一成交</td><td>不得撤销竞价申报</td></tr>
              <tr><th scope="row">09:25–09:30</th><td>拍卖结束至连续竞价前</td><td>不进行股票连续撮合</td><td>是否接收申报按场所和业务规则核验</td></tr>
              <tr><th scope="row">09:30–11:30</th><td>上午连续竞价</td><td>订单到达即按优先级撮合</td><td>按连续竞价规则</td></tr>
              <tr><th scope="row">11:30–13:00</th><td>午休</td><td>无股票连续成交</td><td>申报接受依场所规则</td></tr>
              <tr><th scope="row">13:00–14:57</th><td>下午连续竞价</td><td>直接恢复连续撮合</td><td>没有午后集合竞价</td></tr>
              <tr><th scope="row">14:57–15:00</th><td>收盘集合竞价</td><td>15:00 统一成交</td><td>不得撤销竞价申报</td></tr>
              <tr><th scope="row">15:00–15:05</th><td>沪深盘后申报、等待撮合</td><td>不形成新的可变成交价</td><td>可接收盘后固定价申报，撮合自 15:05 开始</td></tr>
              <tr><th scope="row">15:05–15:30</th><td>沪深盘后固定价格（不含北交所）</td><td>按官方收盘价、时间优先</td><td>不是新的价格拍卖</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最后一行在 2026 年尤其容易出错：沪深已把盘后固定价格扩展到全部 A 股和 ETF；北交所虽然修订文本写入类似条款，但相关实施被延后，不能在快照日把三个市场画成完全相同。一个“15:10 全市场成交量”变量若不区分本地场所、产品和实施状态，含义并不一致。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="opening-call">
        <p className="section-kicker">06 · Opening call auction</p>
        <h2>开盘集合竞价把隔夜积累的异质订单同时放入一次清算，而不是让最早到达的市价单沿着空薄订单簿逐级成交。</h2>
        <p>
          隔夜信息可能来自公司公告、海外市场、商品和汇率。若 09:15 就按连续交易逐笔成交，第一批订单会面对尚未聚合的流动性，价格路径依赖很强；集合竞价让买卖意愿先集中，再寻找使成交量最大且失衡较小的单一价格。其制度收益是协调与深度聚合，代价是投资者在 09:25 前只能看到指示状态，不能保证自己的订单最终成交。
        </p>
        <p>
          因而开盘跳空不是“没有交易造成的虚假波动”，而是闭市期间信息在第一个可成交状态中的集中表达。研究隔夜收益时，应把前收至开盘拍卖、开盘后连续吸收和午后重开分开；否则会把拍卖机制、闭市时长与新闻类型混成一个 overnight effect。午休研究显示，隔夜后的开盘拍卖相对午后连续重开往往更快吸收信息，但这并不能只归因于拍卖，因为隔夜更长、公告构成也不同。<Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="cancel-window">
        <p className="section-kicker">07 · 可撤与不可撤窗口</p>
        <h2>09:20 不是普通时间刻度，而是撤单选择权的到期点；越接近它，订单既传递估值，也反映对“锁入拍卖”的策略判断。</h2>
        <p>
          09:15–09:20 的订单通常可以撤销，参与者可用小额申报探索失衡；09:20–09:25 不得撤销，使拍卖前最后五分钟的有效订单更接近承诺。收盘集合竞价 14:57–15:00 也禁止撤销竞价申报。于是同一张买单在 09:19:59 与 09:20:01 的经济含义不同：后者放弃了拍卖前等待新信息再撤单的权利。<Cite n={1} /><Cite n={3} /><Cite n={5} />
        </p>
        <p>
          这会产生可证伪的订单迁移：撤单、改价和策略性试探应在截止点前集中，截止后指示失衡的稳定性提高。若研究者只有最终成交，没有逐笔申报与撤单，就不能把 09:20 后的买卖失衡直接解释为更强信念；它也受到规则冻结和订单提交时机选择影响。
        </p>
      </section>

      <section className="lesson-section" id="auction-price">
        <p className="section-kicker">08 · 集合竞价怎样选出一个价格</p>
        <h2>集合竞价不是计算订单价格平均数，而是在候选价格上累积可成交需求与供给；共同清算条件之后，沪深北仍有不同的最终并列择价规则。</h2>
        <div className="equation-card">
          <span>候选价格 p 的最大可成交量</span>
          <div>D(p)=Σq<sub>buy</sub>·1[p<sub>limit</sub>≥p]</div>
          <div>S(p)=Σq<sub>sell</sub>·1[p<sub>limit</sub>≤p]，　Q(p)=min(D(p),S(p))</div>
          <p>D 是愿意支付至少 p 的累计买量，S 是愿意接受至多 p 的累计卖量；Q 是两边较小者，因为成交必须一买一卖。共同骨架要求最大成交量、更积极的买卖订单全部成交，并让等于候选价的买卖至少一方全部成交；若仍有多价，最终消除并列的方法必须按交易所分别读取。</p>
        </div>
        <p>
          上交所若在上述共同条件后仍得到多个价格，取这些价格的中间价；深交所还比较累计买卖未成交量，开盘时在并列价中取最接近前收的价格，盘中或收盘时取最接近最近成交价的价格；北交所也按其最近成交价、无最近成交时前收等参考口径完成最终择价。于是“一张很高的买单不一定把开盘价推到自己的限价”在三所都成立，但最后一个并列价格怎样被选中不能合写成同一算法。<Cite n={1} /><Cite n={3} /><Cite n={5} />
        </p>
      </section>

      <section className="lesson-section" id="morning-continuous">
        <p className="section-kicker">09 · 上午连续竞价</p>
        <h2>09:30 后订单从“共同等待一次清算”切换为“到达即与现有簿册交互”；相同净买量因到达顺序和深度不同，会形成不同价格路径。</h2>
        <p>
          连续竞价按价格优先、时间优先处理有效订单。开盘拍卖留下的库存、未成交订单和估值分歧进入新订单簿；价格开始逐笔更新，做市、套利和止损反应也开始反馈。09:25 至 09:30 的五分钟不是新的拍卖窗口，研究时间戳时不能把 09:25 开盘价和 09:30 首笔连续成交混成同一事件。
        </p>
        <p>
          上午通常承接隔夜信息、开盘失衡和机构首轮执行，成交、价差与波动具有强日内季节性。比较个股或制度前后时，必须用相同分钟位置或显式去季节化；否则“改革后波动下降”可能只是样本中开盘分钟权重变少。1.16 的日内季节性在这里成为识别前提，而不是图表美化。
        </p>
      </section>

      <section className="lesson-section" id="lunch-break">
        <p className="section-kicker">10 · 午休不是信息休息</p>
        <h2>11:30–13:00 股票停止连续成交，但公司公告、海外资产和投资者估值仍在变化；13:00 没有集合竞价缓冲，信息直接撞上连续订单簿。</h2>
        <p>
          午休把交易时钟与信息时钟分开。投资者可以重新估值、调整待提交订单，相关商品、外汇或海外证券也可能继续交易；但 A 股没有新的成交价格。13:00 连续竞价恢复时，累积意愿通过第一批订单释放，开盘式跳跃可能出现，却没有 09:25 那样的集中拍卖来聚合全部订单。<Cite n={1} /><Cite n={3} /><Cite n={28} />
        </p>
        <p>
          Chu、Goodell 与 Li 比较隔夜和午间公告后的价格反应，发现早盘开盘对信息的吸收更快、更有效；合理解释包括集合竞价聚合，也包括隔夜闭市更长、投资者准备时间更多和公告类型不同。进一步的因果研究仍需匹配消息惊喜、行业、闭市长度和市场状态，并把“有集合竞价”视为机制候选，而非唯一处理。<Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="afternoon-reopen">
        <p className="section-kicker">11 · 13:00 连续重开</p>
        <h2>午后重开不是第二个开盘：没有独立清算价，也没有 09:20 式不可撤锁定；它把午休信息直接交给当时可见深度。</h2>
        <p>
          若午间出现重大坏消息，13:00 的第一批卖单会依次打击订单簿，价格冲击取决于留在簿上的买方深度和动态申报范围。若把 13:00 称为“下午开盘集合竞价”，就会错误推导统一成交价、撤单时钟和失衡指标。时间名称的错误会直接传导成数据事件定义错误。
        </p>
        <p>
          这提供了少见的同市场机制比较：同一股票每天经历一次拍卖式早盘重开和一次连续式午后重开。研究者可匹配隔夜/午间消息，比较首个可交易价格误差、五分钟吸收和随后反转；但必须承认两个闭市窗口不随机、长度不同，不能只凭差异给拍卖机制做因果归功。<Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="closing-call">
        <p className="section-kicker">12 · Closing call auction</p>
        <h2>收盘集合竞价的目标不是压低全天波动，而是让指数估值、基金净值和衍生品结算所依赖的收盘基准，在集中流动性中形成。</h2>
        <p>
          14:57–15:00 的订单集中到一次清算，期间不得撤销。被动基金、指数调整、资产管理估值和衍生品对冲常在收盘附近执行；若用最后一笔连续成交作为基准，少量订单可能产生较大偏离。集中拍卖能聚合这些需求，却也会把成交和波动提前到拍卖入口，并产生围绕失衡信息的策略行为。<Cite n={1} /><Cite n={3} />
        </p>
        <p>
          上交所 2018 年引入收盘集合竞价构成自然实验。Li、Luo 与 Zhou 发现收盘价偏离下降、价格连续性改善，同时活动向拍卖前迁移；Han 等没有发现最后十五分钟的流动性和价格效率普遍改善，却同样发现成交分布改变。它们测量的是不同结果：一个收盘基准更稳健，不等于全天每个维度都改善。<Cite n={26} /><Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="closing-price">
        <p className="section-kicker">13 · 收盘价不是最后一笔成交的同义词</p>
        <h2>沪深优先使用收盘集合竞价成交价；拍卖无成交时再按规则回退，北交所的回退层级又不同，因此 close 字段必须保留生成方法。</h2>
        <p>
          对沪深股票，收盘集合竞价成交价通常成为当日收盘价；若集合竞价没有成交，则使用规则规定的最后一分钟成交量加权平均等回退口径。北交所在收盘集合竞价无成交时可回退到当日最近成交，若全天无成交再使用前收。由此可见，同一个数据库字段 <code>close</code> 可能来自拍卖、分钟加权、最近成交或前收沿用。<Cite n={1} /><Cite n={3} /><Cite n={5} />
        </p>
        <p>
          这种差异影响收益、涨跌幅基准和次日边界。若一只极不活跃股票全天无成交，close 沿用前收并不表示市场估值毫无变化；它只表示没有可执行成交。研究者应保存 close_method、last_trade_time、auction_volume 和 no-trade flag，避免把观测规则当作经济状态。
        </p>
      </section>

      <section className="lesson-section" id="after-hours-fixed">
        <p className="section-kicker">14 · 2026 盘后固定价格交易</p>
        <h2>沪深盘后环节把“形成收盘价”和“按收盘价继续交换库存”拆成两个阶段；后者增加成交机会，却不生成新的官方价格。</h2>
        <p>
          自 2026-07-06 起，沪深盘后固定价格交易从原有部分板块扩展到全部 A 股和 ETF，15:05–15:30 按当日收盘价、时间优先撮合。上交所可接受申报的时段为 09:30–11:30、13:00–15:30；深交所为 09:15–11:30、13:00–15:30。证券若 15:00 仍处于停牌状态，不能把它当作正常盘后参与者。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} />
        </p>
        <p>
          经济上，固定价格拿走的是该场所内的价格竞争，只留下数量、排队和库存选择；未成交风险、逆向选择与隔夜风险仍在。愿付 10.20 与愿卖 9.80 的订单若面对 10.00 收盘价，都以 10.00 成交；高买价不会改善优先级。它可以帮助基金完成收盘价基准交易，也可能把连续竞价末端的一部分交易迁到 15:05 后。评价改革应同时观察 14:50–15:00 的量价迁移、盘后成交率、未成交队列和次日开盘修正，而不是只看总成交量。
        </p>
        <div className="precision-note"><span>北交所边界</span><p>北交所 2026 规则文本已写入盘后固定价格条款，但相关实施被延后并等待另行通知。快照日的数据模型应标为 approved_or_written_not_operative，而不是把 15:05–15:30 自动填给所有 A 股场所。<Cite n={5} /></p></div>
      </section>

      <section className="lesson-section" id="order-types">
        <p className="section-kicker">15 · 订单类型与保护限价</p>
        <h2>“市价单”也不是不计价格地成交；它只在特定连续竞价状态可用，并受保护限价、对手方深度和场所规则约束。</h2>
        <p>
          上交所的市价申报要求包含投资者能够接受的最高买价或最低卖价等保护限价；深交所则按本方最优、对手方最优、即时成交剩余撤销或转限价等具体类型规定执行，并没有一条覆盖全部市价类型的普遍“必填保护限价”要求。两所都只在规定的连续竞价状态接受相应类型，剩余处理也依订单类型而变；保护安排减少穿透空薄订单簿的风险，却不保证全部成交。集合竞价、盘后固定价格与北向沪深股通又有不同订单语言。<Cite n={1} /><Cite n={3} /><Cite n={8} />
        </p>
        <p>
          北向接口只接受限价申报，因此“同一投资者在香港终端点击市价”不代表内地撮合系统收到无价格上限订单。研究冲击性订单时，应保存原始 order type、保护价、路由后的实际订单、拒单原因与剩余处理，而不是只根据成交速度事后贴上 market order 标签。
        </p>
      </section>

      <section className="lesson-section" id="lot-tick">
        <p className="section-kicker">16 · 申报数量、零股与最小价位</p>
        <h2>交易单位决定最小资金门槛和零股退出路径，tick 决定报价网格；把所有 A 股统一成“100 股一手、0.01 元”会在科创板、北交所和 ETF 上产生假异常。</h2>
        <div className="table-scroll" role="region" aria-label="A股主要板块申报数量和最小价位，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">主板、创业板、科创板、北交所和ETF申报单位</caption>
            <thead><tr><th scope="col">产品</th><th scope="col">买入数量</th><th scope="col">零股余额卖出</th><th scope="col">典型 tick</th></tr></thead>
            <tbody>
              <tr><th scope="row">沪深主板</th><td>100 股或整数倍</td><td>不足 100 股通常一次卖出</td><td>0.01 元</td></tr>
              <tr><th scope="row">创业板</th><td>100 股或整数倍</td><td>不足 100 股通常一次卖出</td><td>0.01 元</td></tr>
              <tr><th scope="row">科创板</th><td>最低 200，之后逐股</td><td>不足 200 股余额一次卖出</td><td>0.01 元</td></tr>
              <tr><th scope="row">北交所股票</th><td>最低 100，之后逐股</td><td>不足 100 股余额一次卖出</td><td>0.01 元</td></tr>
              <tr><th scope="row">ETF</th><td>按基金份额和产品规则</td><td>按具体产品</td><td>通常 0.001 元</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          因而科创板 301 股和北交所 101 股买单可以有效，而主板 150 股普通买单通常无效。最小价位又与低价证券的相对价差相互作用：同样 0.01 元，对 0.50 元股票是 2%，对 50 元股票只有 0.02%。比较板块流动性时，应同时控制价格水平、tick-to-price ratio、数量门槛与投资者准入。<Cite n={1} /><Cite n={3} /><Cite n={5} /><Cite n={12} />
        </p>
      </section>

      <section className="lesson-section" id="static-limits">
        <p className="section-kicker">阶段二 · 价格与库存状态　|　17 · 静态日涨跌幅</p>
        <h2>静态边界规定一整天可成交价格的最远范围，却不停止边界价成交；板块差异决定相同信息冲击需要几个交易日才能进入现货价格。</h2>
        <div className="table-scroll" role="region" aria-label="A股主要板块现行日涨跌幅，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">沪深北股票现行典型日涨跌幅与无边界期</caption>
            <thead><tr><th scope="col">板块</th><th scope="col">通常边界</th><th scope="col">新股无静态边界期</th><th scope="col">风险警示边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">沪深主板</th><td>±10%</td><td>上市后前 5 个交易日</td><td>2026-07-06 起主板 ST/*ST 通常也为 ±10%</td></tr>
              <tr><th scope="row">科创板 / 创业板</th><td>±20%</td><td>上市后前 5 个交易日</td><td>风险警示通常不缩到主板式 10%</td></tr>
              <tr><th scope="row">北交所</th><td>±30%</td><td>上市首日</td><td>须按生效中的风险警示条款核验</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          2026 修订已经使“主板 ST 固定 5%”成为过时记忆。边界价格还要按最小价位取整，公司行动又可能重置前收参考。跨板块研究应以 security×date 的规则版本生成真实上、下限，而不能按公司今天属于哪个板块倒填整个历史。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} />
        </p>
        <p>
          日限价既可能避免极端错误成交，也会限界删失潜在回报、形成边界队列和跨日价格发现。1.25 已完整讨论 cooling、magnet 与 delay；本节只强调联合状态：若现金股票跌停、今日新买库存不可售，而期货和期权仍可交易，价格发现会优先迁移到约束较少的接口。
        </p>
      </section>

      <section className="lesson-section" id="dynamic-collar">
        <p className="section-kicker">18 · 动态申报价格范围</p>
        <h2>静态边界约束全天成交集合，动态范围约束此刻新提交限价单相对盘口能有多激进；两者基准、时间尺度与适用产品都不同。</h2>
        <div className="equation-card">
          <span>连续竞价中的股票限价申报边界</span>
          <div>BuyCap=max(R<sub>buy</sub>×1.02, R<sub>buy</sub>+10×tick)</div>
          <div>SellFloor=min(R<sub>sell</sub>×0.98, R<sub>sell</sub>−10×tick)</div>
          <p>这是上交所主板和深交所股票的一般教学式：R 按对手方最优价、本方最优价、最近成交价和前收等规则逐级确定。买入比较两个价格上界并取较高者，卖出比较两个价格下界并取较低者；百分比与价格差不能直接相加。</p>
        </div>
        <p>
          上交所科创板采用纯 102%/98% 口径，不含十个最小价位替代项；北交所股票一般采用 105%/95% 并带十个最小价位的较宽安排；ETF 不适用上述股票动态申报价格范围。因而同为 20% 日限价的科创板和创业板，盘中激进限价单路径仍不同。<Cite n={1} /><Cite n={3} /><Cite n={5} /><Cite n={8} />
        </p>
        <p>
          实际边界的计算结果还要按规则四舍五入到最小价位，极低价格证券的有效报价本身不得低于一个 tick。数据上应保存 reference price、reference hierarchy、tick、raw limit、rounded boundary、accepted/rejected 与 rejection code。只看最终成交无法判断缺少大幅报价是投资者不愿提交，还是系统在入口拒绝。动态价格范围的效果应以废单、重新申报、成交延迟与外部影子价格误差衡量，而不是用“是否触及日涨停”替代。
        </p>
      </section>

      <section className="lesson-section" id="ipo-interruption">
        <p className="section-kicker">19 · 无日限价期与盘中临停</p>
        <h2>“无涨跌幅限制”只移除以前收为中心的静态日边界，不等于没有动态申报保护、临时停牌或数量约束。</h2>
        <p>
          沪深股票上市后前五个交易日通常不设静态日涨跌幅，北交所只在上市首日不设；无日限价股票相对当日开盘价首次达到或超过 ±30%、±60% 时可触发十分钟盘中临停。若价格先到 30%、复牌后再到同方向 60%，可分档停两次；若第一笔触发价格直接达到或越过 60%，该方向只停一次。<Cite n={1} /><Cite n={3} /><Cite n={5} /><Cite n={76} />
        </p>
        <p>
          参考量是当日开盘价，不是发行价、前收或盘中高点。若临停跨过 14:57，复牌和收盘程序又进入特殊时钟。研究新股早期价格发现时，应把 opening price、trigger path、halt state、actual resume、order collar 与板块同时保存；“IPO day 3”在沪深仍是无静态边界状态，在北交所通常已不是。
        </p>
      </section>

      <section className="lesson-section" id="sellable-inventory">
        <p className="section-kicker">20 · 普通股票 T+1 是可售库存约束</p>
        <h2>普通 A 股 T+1 拿走的是今日新买批次的同日出售选择权；昨日库存仍可卖，因此总持仓、可售持仓和经济风险暴露必须分账。</h2>
        <div className="equation-card">
          <span>投资者级最小可售账本</span>
          <div>Sellable<sub>i,t</sub>=PriorEligible<sub>i</sub>+TurnaroundEligibleBuys<sub>i,≤t</sub>−ExecutedSells<sub>i,≤t</sub>−Locks<sub>i,t</sub></div>
          <p>普通股票今日新买数量通常不进入第二项；允许当日回转的具体产品才进入。ExecutedSells 扣除截至时点 t 已成交卖出的数量，Locks 包括司法冻结、担保或其他账户限制。开盘旧仓 800、今日买入普通股 300 且尚未卖出时，当日最多可卖 800，而不是 0 或 1,100。</p>
        </div>
        <p>
          这会制造投资者状态异质性。持有旧仓者可以“卖旧买新”完成经济意义上的日内调仓；刚建立新仓且无旧仓者面对坏消息只能等待；可用期货或融券的机构又能转移部分风险。因而 T+1 的平均效应不是统一持有期，而是由库存历史和替代工具共同决定。股票—衍生品配对研究发现一日卖出锁定具有日内衰减的不可交易折价，隔夜研究也发现开盘附近的出售选择权成本；两者都不是所有时期净福利的直接证明。<Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="turnaround-matrix">
        <p className="section-kicker">21 · 产品回转矩阵</p>
        <h2>“股票 T+1、ETF T+0”同样错误；回转资格属于具体产品属性，债券、货币、黄金、商品和跨境基金与境内股票 ETF 并不共享一个答案。</h2>
        <div className="table-scroll" role="region" aria-label="主要交易所产品当日回转资格，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">A股相关产品的典型当日回转状态</caption>
            <thead><tr><th scope="col">产品</th><th scope="col">今日买入能否今日卖出</th><th scope="col">主要机制</th><th scope="col">边界</th></tr></thead>
            <tbody>
              <tr><th scope="row">普通 A 股</th><td>通常不能</td><td>新买批次出售锁定</td><td>旧仓仍可卖、融券另算</td></tr>
              <tr><th scope="row">境内股票 ETF</th><td>同一批当日竞价买入份额通常不能直接二级卖出</td><td>买入份额可当日赎回；当日申购所得份额可同日卖出</td><td>申赎转换与纯二级回转必须分开</td></tr>
              <tr><th scope="row">债券 / 货币 ETF</th><td>规则列明类别通常可回转</td><td>较短风险与现金管理需求</td><td>逐只查产品属性</td></tr>
              <tr><th scope="row">黄金 / 商品期货 ETF</th><td>规则列明类别通常可回转</td><td>底层市场和套利接口</td><td>并非所有商品基金</td></tr>
              <tr><th scope="row">部分跨境 ETF / LOF</th><td>底层与产品合资格时可回转</td><td>海外时段与申赎套利</td><td>溢价、额度和假期风险</td></tr>
              <tr><th scope="row">股指期货 / 期权</th><td>合约本身可日内平仓</td><td>保证金与衍生品结算</td><td>行权所得标的另算</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          上交所 ETF 产品查询和交易所规则是最终核验入口。即使一只 ETF 可通过一级申赎形成某种日内套利，普通投资者的二级市场新买份额也未必可同日卖出；同样，期权可以日内平仓，不代表行权得到的股票自动获得同日可售资格。研究工具选择时应建立 instrument-level turnaround flag，而不是按“基金/衍生品”大类猜测。<Cite n={1} /><Cite n={3} /><Cite n={12} /><Cite n={14} /><Cite n={15} /><Cite n={16} />
        </p>
      </section>

      <section className="lesson-section" id="settlement-eligibility">
        <p className="section-kicker">22 · 交易资格与结算管道</p>
        <h2>“今日不能卖”发生在交易入口，“证券和资金何时交付”发生在清算结算层；二者相互作用，却不能被一个 T+1 标签代替。</h2>
        <p>
          投资者提交卖单时，交易系统先检查可售数量；成交后，交易所、登记结算机构与结算参与人再完成清算、证券交收和资金净额交收。深圳市场现行指南显示证券处理、可售交收锁定和资金批次具有具体时点，并非所有资产在一个整齐的“T+1 瞬间”同时移动。<Cite n={7} />
        </p>
        <p>
          这一区分决定研究结果变量（outcome）。回转限制直接影响成交量、退出选择权、价差和隔夜风险；结算周期直接影响交收失败（settlement fail）、抵押品、参与人流动性与运营风险。若用日内换手来评估结算规则，或用交收失败来评估股票回转资格，因果变量从定义开始就错位。
        </p>
        <div className="precision-note"><span>三本账</span><p>至少分别保存 position balance（经济持仓）、sellable balance（交易入口可售量）和 settlement receivable/payable（待交收证券与资金）。三者在多数平静日最终会对齐，却在当日新买、融券、冻结、申赎和失败交收时显著不同。</p></div>
      </section>

      <section className="lesson-section" id="margin-shorting">
        <p className="section-kicker">23 · 融资、融券与转融券的当前状态</p>
        <h2>A 股既不是“完全不能做空”，也不是多空对称市场：负面表达依赖客户资格、标的、可借券源、保证金与价格规则，券源扩张通道又曾被政策收紧。</h2>
        <p>
          合资格客户的融资融券业务仍存在，但融券卖出并不是无需券源的“裸卖空”：证券公司向客户融券只能使用融券专用证券账户内的证券，客户可融券卖出的证券不能超出交易所规定范围，交易所还会前端拒绝证券种类或卖出价格不合规的指令；保证金和客户适当性又构成额外门槛。<Cite n={75} />中国证监会自 2024-07-11 暂停中国证券金融公司的转融券业务，暂停的是一条券源批发渠道，不是客户融资融券整体取消，也不是“转融资”同步停止。<Cite n={17} />
        </p>
        <p>
          以上海市场的官方快照为例，融券保证金最低比例自 2024-07-22 提高到 100%，私募证券投资基金提高到 120%；融资保证金最低比例又自 2026-01-19 提高到 100%，存量合约按原规定执行，上交所仍持续发布标的名单。其他市场必须读取对应文件，不能把上交所通知当作全国唯一规则。数据至少要分列 side（融资或融券方向）、client type（客户类型）、contract vintage（合约批次）、collateral（担保品）、security eligibility（证券资格）与 borrow availability（实际可借量）。<Cite n={18} /><Cite n={19} /><Cite n={20} />
        </p>
        <p>
          转融券暂停可能降低可扩张券源，却不能仅凭规则变化推出股票必然高估、跌幅减少或波动下降。负面信息可能迁到卖出旧仓、股指期货、期权或相关股票；同时融资约束收紧也会削弱多头杠杆。净效果要观察真实借券数量、融券成本、替代市场流量和坏消息后的价格延迟。
        </p>
      </section>

      <section className="lesson-section" id="short-asymmetry">
        <p className="section-kicker">24 · 多空表达不对称</p>
        <h2>利好可以由几乎任何有现金和权限的买方表达，利空却常需要可售旧仓、可借券源或衍生品账户；信息本身对称，执行通道并不对称。</h2>
        <p>
          对一名没有持仓、没有融券资格的普通投资者，坏消息只能使其“不买”，无法直接生成卖单；已有旧仓者可以卖出，今日新买者可能被锁定，机构则可卖期货或买看跌期权。边际价格因而取决于持有和权限分布：谁拥有可卖库存、谁能承担保证金、谁可以接入衍生品，比“市场平均看空程度”更接近真实订单流。
        </p>
        <p>
          这种不对称并不自动证明 A 股长期高估。资金约束也会限制买入，衍生品和跨市场套利仍能传播负面信息，公司公告与长期现金流最终也会进入价格。可证伪的命题应更局部：在相同坏消息下，历史券源依赖更高且转融券暂停后实际借券下降的股票，是否出现更慢的负面价格吸收、更大的次日延续或更强的期货/期权替代流？
        </p>
        <div className="precision-note"><span>上篇诊断</span><p>如果你能在不回看规则表的情况下回答下面四题，就已经掌握 1.26A 的核心：制度不是背景标签，而是把目标交易映射为有效订单、等待或替代路径的状态机。</p></div>
        <div className="check-grid">
          <details><summary>01 · 为什么 09:18 与 09:23 的相同开盘订单不是同一个承诺？</summary><p>09:18 仍处在允许撤单阶段，09:23 已进入不可撤窗口。价格与数量相同，撤单选择权却已到期，因此订单的承诺程度和策略空间不同。</p></details>
          <details><summary>02 · 为什么一张低于涨停价的买单仍可能被拒绝？</summary><p>日涨跌幅是相对前收等基准的静态边界；连续竞价的动态申报范围还会围绕即时盘口基准收紧可接受价格。订单可以位于静态边界内，却越过当时的动态上限。</p></details>
          <details><summary>03 · 为什么总持仓 1,100 股不等于当日可卖 1,100 股？</summary><p>普通股票今日新买批次通常不进入当日可售库存。若开盘旧仓 800 股、今日买入 300 股且没有其他资格或冻结，当日可卖量仍是 800 股。</p></details>
          <details><summary>04 · 为什么转融券暂停没有消除全部负面表达？</summary><p>它收紧一条上游券源扩张通道，但客户融资融券、卖出旧仓、期货和期权等路径仍可能存在；真实影响取决于账户资格、实际券源、保证金与替代市场可达性。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="a-handoff">
        <p className="section-kicker">上篇出口 · 把约束带到其他接口</p>
        <h2>到这里，我们已经知道一笔股票订单为什么会失效、等待或缩量；1.26B 将追问未完成的风险究竟迁到哪里，以及何时又传回现货。</h2>
        <p>
          上篇的输出不是一张规则清单，而是投资者级状态 Ω<sub>i,t</sub>：当时钟、价格范围、可售库存、账户权限或公司状态改变时，目标交易先被改写，随后才进入订单簿。下篇将把这一状态机接到 ETF 申赎、股指期货与期权、沪深股通、风险警示、停复牌、退市整理和公司行动，并用数据协议与可证伪设计检验“压力被消除”还是“压力被迁移”。
        </p>
      </section>
    </>
  );
}

function Lesson126BContent() {
  const Cite = CiteB;

  return (
    <>
      <section className="lesson-lead" id="etf-primary-interface">
        <p className="section-kicker">阶段三 · 产品与跨市场接口　|　25 · ETF 一级—二级市场</p>
        <h2>ETF 不是一只“会跟着指数走的股票”，而是二级市场份额与一级申购赎回篮子之间的双层结构；套利只有在两层都可执行时才把价格重新连接起来。</h2>
        <p>
          <Link href="/learn/1-26#system-loop">1.26A 的完整状态回路</Link> 已把投资者 i 在时点 t 的总可交易集合写成跨工具—场所—路由集合的并集 Ω<sub>i,t</sub>。本页从这里继续：当股票现货的时间、价格或库存门控关闭时，ETF、期货、期权与沪深股通是否真的提供可执行替代；公司状态改变后，原来的参考价、账户资格和研究样本又怎样被重写。读者可在此页暂停后独立复习，但公式与五维状态定义以前页为先修。
        </p>
        <p>
          二级市场投资者买卖 ETF 份额，成交价由份额订单簿形成；一级申赎也不是机构投资者的法定专属通道。在通常的申购赎回代理券商路径中，基金管理人签约的合资格券商代投资者提交申赎，委托人既可以是机构，也可以是符合产品、账户与券商受理条件的个人。实务中机构占主导，主要因为最小篮子、资金、系统与执行门槛高；上交所官方投教因此写作“机构投资者或资产规模较大的个人投资者”。只有特定机构直接向基金管理人申赎的特殊通道另有身份限定。<Cite n={70} /><Cite n={71} /><Cite n={72} /><Cite n={73} />
        </p>
        <p>
          若 ETF 相对篮子显著溢价，典型方向是买入或构造篮子、申购份额、卖出 ETF；若 ETF 折价，则买入 ETF、赎回并处置篮子。投资者必须使用产品允许的账户，经该基金的申赎代理券商，按最小申赎单位备足组合证券、现金替代、现金差额或份额。这个回路把相对价格偏离转成扣除成本后的套利收益，通常推动 ETF 与可执行净值重新靠近。<Cite n={12} /><Cite n={70} /><Cite n={71} />
        </p>
        <div className="equation-card">
          <span>溢价与折价方向的可执行套利差额</span>
          <div>Edge<sub>create</sub>=P<sub>ETF,bid</sub>−NAV*<sub>ask</sub>−C<sub>create</sub></div>
          <div>Edge<sub>redeem</sub>=NAV*<sub>bid</sub>−P<sub>ETF,ask</sub>−C<sub>redeem</sub></div>
          <p>NAV* 是本节为机制分析定义的“可执行篮子估值”，不是法定基金净值，也不等同于交易所发布的 IOPV；它按当时真正可成交的篮子买卖价估计。申购侧与赎回侧使用不同报价、交易、资金和未对冲风险成本。只有对应方向的 Edge 为正，且申赎、库存、额度与底层市场同时可用，屏幕价差才可能兑现。<Cite n={74} /></p>
        </div>
        <p>
          A 股的状态错位会切断其中某一腿：成份股涨停或停牌时，篮子价格可能被限界；境外底层休市而跨境 ETF 仍交易时，可执行净值估计会更依赖滞后底层价格、汇率、相关期货或其他代理信息；现金替代会把证券交付风险转成现金结算和估值风险。这里描述的是由不同步交易推导出的估值风险，不是所有跨境 ETF 共用的一套永久参数。某一投资者若没有在该只 ETF 的申赎代理券商获得业务入口，或不满足账户、最小申赎单位、足额对价、风险揭示和当日申赎状态，就只能留在份额订单簿交易；这是一项账户—产品—通道约束，不是“个人天然没有一级资格”。ETF 先动既可能代表更快价格发现，也可能补偿底层不可交易或估值不确定性。<Cite n={70} /><Cite n={71} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="product-t0-heterogeneity">
        <p className="section-kicker">26 · 产品级 T+0 异质性</p>
        <h2>同日回转不是交易所给“ETF”这一名称的统一特权，而是按底层资产、基金类型和具体证券定义的资格；套利速度因此是一项逐产品状态。</h2>
        <p>
          <Link href="/learn/1-26#turnaround-matrix">1.26A 第 21 节</Link> 已经给出产品速查；这里要把“同日转换”与“同日回转”拆开。以下矩阵只描述通过交易所场内组合证券路径申赎的标准境内股票 ETF；债券、黄金、货币、商品期货、跨境 ETF、现金申赎及登记结算机构路径有独立规则，不能照搬。<Cite n={12} /><Cite n={70} /><Cite n={71} />
        </p>
        <div className="table-scroll" role="region" aria-label="标准境内股票ETF四向当日转换资格，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">标准境内股票ETF按当日资产取得来源区分的四向用途</caption>
            <thead><tr><th scope="col">当日取得来源</th><th scope="col">当日允许用途</th><th scope="col">当日不能做什么</th><th scope="col">机制含义</th></tr></thead>
            <tbody>
              <tr><th scope="row">竞价买入 ETF 份额</th><td>可用于当日赎回</td><td>不能把该批份额直接二级卖出</td><td>折价套利可走“买入份额→赎回”，但不是纯二级 T+0</td></tr>
              <tr><th scope="row">申购取得 ETF 份额</th><td>可在当日竞价卖出</td><td>当日不能再次赎回</td><td>溢价套利可走“构造篮子→申购→卖出份额”</td></tr>
              <tr><th scope="row">赎回取得股票</th><td>可在当日竞价卖出</td><td>当日不能再用该批股票申购</td><td>折价套利可处置篮子，但不能无限循环复用</td></tr>
              <tr><th scope="row">竞价买入股票</th><td>可在当日用于申购 ETF</td><td>不能把该批股票直接卖出</td><td>股票 T+1 未消失，只开放了特定非卖出用途</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          规则上的“可以”只代表取得申报资格；停牌、涨跌停、现金替代、申赎暂停、额度、资金或缺少对手方仍可阻止成交。研究应逐方向建立 bought-share-to-redeem、created-share-to-sell、redeemed-stock-to-sell 与 bought-stock-to-create 标志，再分列纯二级回转、申赎状态、现金替代、底层开放与额度。类别名称适合导航，不适合作为永久编码。<Cite n={70} /><Cite n={71} />
        </p>
      </section>

      <section className="lesson-section" id="futures-clock-margin">
        <p className="section-kicker">27 · 股指期货：时钟、保证金与每日结算</p>
        <h2>股指期货用保证金把指数风险压缩成可日内反向交易的合约；它比现金股票更容易表达组合观点，却把融资压力和强平反馈带入价格发现。</h2>
        <p>
          以中金所沪深300股指期货（合约代码 IF）为例，它在 09:25–09:30 有自己的开盘集合竞价：09:25–09:29 接受指令申报、09:29–09:30 集合竞价撮合；随后在 09:30–11:30、13:00–15:00 连续交易。它与股票主体时段大体重合，却不是 09:15 开始的股票拍卖，也不进入 15:05 后的股票固定价格交易。合约可以日内开平仓，按合约乘数把指数点位转成名义敞口，并以保证金而非全额名义价值占用资金；每日无负债结算又会把盈亏变成当日现金流。IH、IC、IM 等其他股指期货必须另读各自现行细则，不能仅凭 IF 页面推定；具体合约月份、乘数、涨跌停板、最低保证金和交割规则也要在交易日核验。<Cite n={13} /><Cite n={22} />
        </p>
        <div className="equation-card">
          <span>名义风险与资金占用不是同一数量</span>
          <div>Notional<sub>t</sub>=F<sub>t</sub>×Multiplier×Contracts</div>
          <div>InitialCash≈Notional<sub>t</sub>×MarginRate</div>
          <p>F 是期货点位，Multiplier 是每点对应金额。保证金率使少量现金控制较大名义敞口；它提高对冲效率，也意味着同样价格变化会相对保证金产生更大的盈亏，并可能触发追加保证金或被迫减仓。</p>
        </div>
        <p>
          当现金指数成份股因 T+1、跌停、停牌或篮子交易成本难以及时调整时，期货可以先吸收组合层面的信息；但若保证金上调、持仓限额收紧或临近交割，期货订单也可能主要反映资金和展期约束。观察到期货领先，只说明在那个状态下它更快形成了一个可成交的组合价格，不自动证明其价格更接近最终基本价值。<Cite n={29} /><Cite n={33} /><Cite n={35} />
        </p>
      </section>

      <section className="lesson-section" id="options-interface">
        <p className="section-kicker">28 · 期权：非线性表达与标的交付边界</p>
        <h2>期权允许投资者交易方向、波动与尾部风险，但合约本身可日内平仓，不等于行权交付的股票也获得同日可售资格。</h2>
        <p>
          沪深股票期权和中金所股指期权有不同标的、行权与交割安排。买入看跌期权可以在预先限定损失的情况下获得下行凸性，卖出期权则承担保证金和非线性风险；做市商的 Delta、Gamma 与 Vega 对冲又会把期权订单传回 ETF、股票或期货。期权合约的日内买卖状态、行权申报、到期结算与交付标的后的可售状态必须分成四层。<Cite n={14} /><Cite n={15} /><Cite n={16} />
        </p>
        <div className="equation-card">
          <span>期权价格变化的局部风险分解</span>
          <div>ΔV≈Δ·ΔS+½Γ(ΔS)<sup>2</sup>+Vega·Δσ+Theta·Δt</div>
          <p>ΔS 是标的价格的小变化，Δσ 是隐含波动率的小变化，Δt 是经过的短时间；Δ 描述方向暴露，Γ 描述 Delta 随标的变化的曲率，Vega 描述波动率敏感度，Theta 描述时间流逝的影响。这是局部近似而非大幅跳跃下的精确恒等式；期权成交反映这些风险的组合，不能把每一笔看跌期权买入都等同于同金额现货卖出。</p>
        </div>
        <p>
          账户构成也随产品改变。上交所年度期权报告所给出的机构与个人成交占比，是特定统计口径下的合约交易结构，不是整个 A 股市场的投资者占比，更不能用于判定最终风险承担者；做市商中介、组合策略和一买一卖会让成交身份与观点方向分离。期权数据若要成为现金市场的先行指标，至少需要方向分类、Delta 等值、到期结构、做市库存与标的可交易状态。<Cite n={21} /><Cite n={37} /><Cite n={38} />
        </p>
      </section>

      <section className="lesson-section" id="state-dependent-discovery">
        <p className="section-kicker">29 · 价格发现的领导者随状态切换</p>
        <h2>没有一个产品永久“领先”；领导者是当时最早开放、约束最少、边际交易者最有信息且套利回路仍可运行的市场。</h2>
        <p>
          设共同潜在价值为 m，现金股票、ETF、期货与期权分别观察到带有微观结构噪声和约束的价格。若现金成份股可以顺畅交易、篮子成本低，现货订单可能贡献更多新信息；若大量成份股触及边界、T+1 锁住新增库存或组合冲击很强，期货和 ETF 可能更快调整；若消息主要改变尾部概率而方向不确定，期权隐含波动可能先响应。领导关系因此是 Ω 的函数，而不是产品名称的属性。
        </p>
        <div className="equation-card">
          <span>状态条件下的价格贡献</span>
          <div>PC<sub>j,t</sub>=f(Open<sub>j,t</sub>,Liquidity<sub>j,t</sub>,Constraint<sub>j,t</sub>,Information<sub>j,t</sub>,Arbitrage<sub>t</sub>)</div>
          <p>PC 是市场 j 在时点 t 对共同价格创新的贡献。开放状态、流动性、交易约束、参与者信息与跨市场套利都会改变它；因此整样本平均的 60% 价格贡献可能掩盖开盘、午休后、触限和到期日完全不同的方向。</p>
        </div>
        <p>
          中国现货—期货的价格发现、波动传递与套利联结文献出现“期货领先”“双向发现”乃至在部分阶段“现货或 ETF 更重要”的差异，并不一定是谁算错了。研究使用的指数代理、采样频率、期货发展阶段、2015 年约束、交易时钟、协整假设、隐含无套利区间与结果指标不同，估计对象也不同。可靠结论应按状态报告领先—滞后、误差修正、信息份额、波动与可交易深度，并用外部价格或后续无约束价格检验哪个先行信号更准确。<Cite n={29} /><Cite n={30} /><Cite n={31} /><Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} /><Cite n={37} /><Cite n={38} /><Cite n={39} />
        </p>
      </section>

      <section className="lesson-section" id="basis-closure">
        <p className="section-kicker">30 · 基差、闭市与不可一比一回填</p>
        <h2>期货或 ETF 在现货受限时提供的是“带持有成本、分红、融资与约束的影子价格”，不是一张可以无误差抄回每只股票的答案。</h2>
        <div className="equation-card">
          <span>股指期货的教学性持有成本关系</span>
          <div>F<sub>t,T</sub>≈S<sub>t</sub>·e<sup>(r−q)(T−t)</sup>+ConstraintWedge<sub>t</sub></div>
          <p>S 是可复制的现金指数，r 是融资成本，q 是预期分红收益，T 是到期时点，T−t（也可写作 τ）是剩余年限；e 是自然指数函数。期限很短、利率较小时，无摩擦部分可近似写成 F≈S[1+(r−q)τ]。最后一项概括卖空、保证金、持仓限额、税费和篮子不可交易等摩擦；它可以为正也可以为负。</p>
        </div>
        <p>
          午休或停牌期间，期货若也闭市，就不存在实时期货价格可供发现；个别海外代理仍交易，也可能因时区、汇率和投资者组成产生自己的冲击。大量成份股跌停、现货篮子受到边界约束时，期货继续下跌可以说明市场预期现货未来还会调整，却不能按一个固定 Beta 把期货跌幅分配给每只成份股。个股公司信息、权重、可交易状态和预期分红仍不同。
        </p>
        <p>
          实证中应把基差分成可预测持有成本、同步市场冲击和约束残差，并明确使用可成交买卖价还是中间价。若只在现货受限日发现期货折价，至少有三种解释：期货更快吸收负面信息、期货多头被保证金压力迫使卖出、现金指数被价格边界机械抬高。需要次日现货修正、保证金流和未受限成份股共同区分。
        </p>
      </section>

      <section className="lesson-section" id="connect-architecture">
        <p className="section-kicker">阶段四 · 跨境与投资者身份　|　31 · 沪深股通是一条有闸门的交易接口</p>
        <h2>沪深股通把香港交易参与者的订单路由到内地市场，但没有复制一个离岸 A 股订单簿；最终成交仍服从内地证券、时钟与价格规则。</h2>
        <p>
          北向投资者通过香港联交所的证券交易服务公司，把合资格证券的订单送往上交所或深交所；结算、名义持有人安排、每日额度、持股比例与投资者资格构成额外接口。它改变了谁能进入 A 股和信息如何跨境传播，却不改变标的股票在哪个交易所形成成交，也不让香港本地交易时钟自动覆盖内地休市。<Cite n={8} />
        </p>
        <p>
          因而“北向资金”首先是路由标签，不是一个同质主体。背后可能是境外资产管理人、主权资金、对冲基金、经纪自营、通过合规产品参与的资金以及不同最终受益人；同一机构也可能同时使用合格境外投资者制度（QFII）、衍生品或本地账户。通道订单能识别接口，不能仅凭接口识别国籍、策略、信息优势或最终风险承担者。<Cite n={42} /><Cite n={43} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="connect-clock-orders">
        <p className="section-kicker">32 · 北向时钟、交易日历与订单语言</p>
        <h2>本地股票可交易不代表北向接口同时可用：订单接受窗口、两地共同交易日与限价单要求共同定义真实开放状态。</h2>
        <div className="table-scroll" role="region" aria-label="北向与本地交易状态差异，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">沪深本地与北向交易接口的时间和订单差异</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">沪深本地</th><th scope="col">北向接口</th><th scope="col">价格发现含义</th></tr></thead>
            <tbody>
              <tr><th scope="row">早盘申报</th><td>按交易所集合竞价时钟</td><td>09:10 起接受，实际撮合服从 A 股时段</td><td>接口可预收不等于提前成交</td></tr>
              <tr><th scope="row">上午 / 下午</th><td>09:30–11:30；13:00–15:00</td><td>接受至 11:30；12:55 后恢复至 15:00</td><td>路由窗口与撮合窗口需分开</td></tr>
              <tr><th scope="row">盘后固定价格</th><td>15:05–15:30 可适用</td><td>当前不覆盖</td><td>15:00 后本地库存仍可交换，北向不能同步表达</td></tr>
              <tr><th scope="row">订单类型</th><td>多类限价 / 市价并有保护规则</td><td>只接受限价申报</td><td>冲击订单的可执行形态不同</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          2023 年交易日历优化减少了只因次日交收安排而关闭的日子，但北向交易仍要求相关市场满足开放条件；香港或内地单边假日都可能造成接口关闭。研究“外资不交易”时必须区分节假日关闭、证券不合资格、额度闸门、系统故障与真实零订单。将香港市场所有交易日直接左连接到 A 股分钟数据，会制造大量假零值。<Cite n={8} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="connect-gates">
        <p className="section-kicker">33 · 额度、持股比例与准入闸门</p>
        <h2>北向可交易集合是“合资格证券 × 合资格投资者 × 剩余额度 × 持股空间”的交集；任一闸门收紧都可能让看多意愿只表现为没有买单。</h2>
        <p>
          沪股通与深股通各有 520 亿元人民币每日额度，按净买入口径监控；额度不足会限制新增买入，但卖出和撤单仍可进行，历史总额度已取消。单一境外投资者持有单一 A 股一般不超过 10%，全部境外投资者合计一般不超过 30%，并设置接近上限时的预警与暂停买入安排。科创板和创业板北向买入还有机构专业投资者边界。<Cite n={8} />
        </p>
        <p>
          自 2023-07-24 起，内地投资者不再能够通过北向通道主动新增买入；既有持仓可按安排卖出。<Cite n={8} />这说明“账户在香港”不等于“境外资金”：渠道资格还取决于投资者身份。研究者如果把所有北向成交解释为新增海外资产配置，会把历史遗留持仓退出、经纪中介和身份筛选混在一起。
        </p>
        <div className="precision-note"><span>额度信号的非对称性</span><p>当额度充足时，看不到它不代表没有约束；当额度耗尽时，只能确认边际新增净买入受阻，不能据此推断所有北向投资者都看多。卖出仍开放，已有买单也可能按规则处理，且额度使用本身是订单结果。</p></div>
      </section>

      <section className="lesson-section" id="connect-disclosure">
        <p className="section-kicker">34 · 2024 年后的北向数据可见性</p>
        <h2>披露制度改变会让同一字段在时间序列中突然消失或变义；“实时北向净流入”不能无缝延长到新口径。</h2>
        <p>
          调整分两阶段生效：自 2024-05-13 起，盘中不再实时公布北向买入成交额、卖出成交额和成交总额，每日额度余额高于或等于初始额度 30% 时只显示“额度充足”；自 2024-08-19 起，其余披露改为收盘后公布当日总成交额、ETF 成交额与成交活跃证券等汇总，单只证券持股数量则在每季度第五个北向交易日公布。<Cite n={10} />
        </p>
        <p>
          这不是资金流机制在 2024 年突然消失，而是观察函数改变。改革前的分钟“净流入”代理与改革后的收盘汇总不再是同一测量；数据供应商若继续显示实时数字，研究者必须追问它来自正式披露、订单推算还是模型估计。把估计值和官方字段拼接，会在 2024-05-13 与 2024-08-19 两个切换点制造人为结构突变，并可能把测量制度变化误判为投资者行为变化。
        </p>
        <p>
          合格的数据字典应同时存 field_name、official_or_estimated、release_time、coverage、aggregation 与 regime_id。北向流量研究还应分离成交额、净买入、净持仓变化与最终受益所有权；它们分别回答交易活动、方向、库存和主体四个不同问题。成交记录、由持仓反推的资金流与通道背后的最终主体需要不同数据，不能用同一个“北向资金”字段替代。<Cite n={42} /><Cite n={43} /><Cite n={44} />
        </p>
      </section>

      <section className="lesson-section" id="identity-axes">
        <p className="section-kicker">35 · 投资者身份的四条正交轴</p>
        <h2>账户类型、交易通道、最终所有者和交易风格不是同一分类；只有把四条轴分开，才能避免把“北向、机构、大户、知情”当成同义词。</h2>
        <div className="table-scroll" role="region" aria-label="投资者身份四条轴，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">账户、通道、最终所有者与行为风格的区别</caption>
            <thead><tr><th scope="col">身份轴</th><th scope="col">可观察例子</th><th scope="col">能说明什么</th><th scope="col">不能说明什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">账户法律身份</th><td>自然人、非自然人、产品账户</td><td>开户和监管分类</td><td>最终出资人或每笔策略</td></tr>
              <tr><th scope="row">交易通道</th><td>本地、沪深股通、QFII、融资融券</td><td>订单经过哪组闸门</td><td>单一国籍或统一观点</td></tr>
              <tr><th scope="row">最终所有者</th><td>个人、基金受益人、公司、国家主体</td><td>经济风险最终归属</td><td>下单执行者必然相同</td></tr>
              <tr><th scope="row">行为风格</th><td>被动、套利、做市、方向、对冲</td><td>交易目的的经验分类</td><td>法律身份或信息优势</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个境外指数基金可以通过北向通道被动买入，一家本地机构可以用期货做方向交易，一个自然人大户也可能拥有更快信息；中介账户还会汇集多个最终客户。若数据只给出通道，就应把结论限定为通道层资金流（channel-level flow）；若只给出账户大小，就不能写成散户与机构因果差异。研究设计应从可观察身份出发，逐层说明连接最终主体所需的额外证据。<Cite n={42} /><Cite n={46} />
        </p>
      </section>

      <section className="lesson-section" id="account-evidence">
        <p className="section-kicker">36 · 账户统计能证明什么</p>
        <h2>投资者账户数描述参与入口的广度，不描述资产所有权、成交份额或边际定价权；“两亿多投资者”不能推出“价格由两亿散户决定”。</h2>
        <p>
          中国结算 2024 年统计年报记录期末持有未注销、非休眠 A/B 股账户的投资者约 2.368 亿，其中自然人约 2.362 亿、非自然人约 56.8 万。这个口径的单位是投资者而非每日活跃交易账户：一个投资者可以拥有多个账户或长期不交易，非自然人账户又可能代表基金、公司或资管产品。<Cite n={11} />
        </p>
        <div className="equation-card">
          <span>边际价格影响不是账户数量占比</span>
          <div>PriceImpact<sub>g,t</sub>∝AggressiveFlow<sub>g,t</sub>×Information<sub>g,t</sub>/ResilientDepth<sub>t</sub></div>
          <p>某组即使账户很多，只要单户交易小、方向彼此抵消或订单不激进，对边际价格影响也可能有限；账户较少的机构若在流动性薄时提交集中订单，影响反而更大。这里是机制比例关系，不是可直接估计的恒等式。</p>
        </div>
        <p>
          不同产品也有不同参与者结构。期权市场报告的机构成交占比显著高于普通股票账户数所暗示的比例，这恰好说明“市场参与者结构”必须按产品、成交、持仓和最终受益人分别测量。判断谁主导价格需要账户级主动成交、订单方向、规模、持仓和后续收益，而不是用开户统计代替。<Cite n={21} /><Cite n={46} />
        </p>
      </section>

      <section className="lesson-section" id="risk-warning">
        <p className="section-kicker">阶段五 · 公司状态　|　37 · 风险警示不是一个统一的“ST 规则”</p>
        <h2>风险警示同时改变名称提示、板块揭示、订单资格和买入上限；它不等于停牌，也不在所有板块自动缩成同一个涨跌幅。</h2>
        <div className="table-scroll" role="region" aria-label="沪深北风险警示状态对比，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">2026年8月29日风险警示交易状态</caption>
            <thead><tr><th scope="col">板块</th><th scope="col">典型风险警示边界</th><th scope="col">买入接口</th><th scope="col">关键时点</th></tr></thead>
            <tbody>
              <tr><th scope="row">沪深主板</th><td>2026-07-06 起通常 ±10%</td><td>首次买入签风险揭示；单日单只合计买入通常不超 50 万股</td><td>旧 5% 资料已经失效</td></tr>
              <tr><th scope="row">科创板 / 创业板</th><td>通常仍为 ±20%</td><td>风险揭示与板块自身适当性叠加</td><td>不能写成“所有 ST 都 10%”</td></tr>
              <tr><th scope="row">北交所</th><td>通常随北交所 ±30% 框架</td><td>截至 8 月 29 日尚未生效；单独显示、首次揭示与 20 万股约束自 8 月 31 日起施行</td><td>已公告、未生效；盘后固定价格仍另行等待</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          在沪深语境中，ST 是“其他风险警示”的常见名称提示，*ST 通常提示“退市风险警示”，但它们仍不是一套跨板块、跨交易所完全相同的交易参数。上交所主板的风险警示与退市整理证券进入风险警示板，科创板同类证券却不进入该板；深市主板与创业板共享交易规则框架，却仍保留 10% 与 20% 的板块边界。北交所的 *ST 语义和制度分类也不能照搬沪深二分。数据应把交易所（exchange）、板块（board）、警示类型（warning_type）、生效日（effective_date）与账户权限（account_permission）分列生成。<Cite n={1} /><Cite n={2} /><Cite n={3} /><Cite n={4} /><Cite n={5} /><Cite n={6} /><Cite n={56} /><Cite n={68} /><Cite n={57} /><Cite n={58} /><Cite n={59} />
        </p>
        <p>
          风险警示源于财务、规范或退市风险，因而状态本身高度内生。历史盈利阈值研究显示刚性亏损标准可能诱发避亏盈余管理；2020 年退市改革削弱壳价值并增加退出，却没有自动改善盈利质量和披露环境，投资者监督还可能随退出概率上升而减弱。不能把 ST 股票的后续收益差异直接归因于交易带宽，也不能把更严格退市等同于信息一定更好。<Cite n={52} /><Cite n={53} />
        </p>
      </section>

      <section className="lesson-section" id="suspension-reopen">
        <p className="section-kicker">38 · 停牌冻结成交，不冻结信息</p>
        <h2>现行原则是持续交易与分阶段披露，停牌是为特定事项保留的例外；复牌把停牌期累积的异质估值重新送入订单簿。</h2>
        <p>
          沪深北停复牌规范都强调及时披露与尽快复牌。发行股份购买资产等事项可以有明确的短期停牌上限，控制权变更、要约收购或破产重整也只有在确有需要时进入有限时钟；“重大事项必然长期停牌”已不是现行原则。研究必须从公告识别发起方（initiating party）、原因（reason）、计划期限（scheduled duration）、延期（extensions）与实际复牌时点（actual resume），而不能把数据库中的缺失成交日都视为同一种停牌。<Cite n={60} /><Cite n={61} /><Cite n={62} /><Cite n={69} />
        </p>
        <div className="mechanism-chain" aria-label="停牌到复牌的五步价格路径">
          <div><span>01</span><b>事件与选择</b><p>消息严重度、公司动机和监管要求共同决定是否停牌。</p></div>
          <div><span>02</span><b>库存冻结</b><p>标的不能成交，但持有人风险和资金约束仍在变化。</p></div>
          <div><span>03</span><b>外部更新</b><p>公告、同行、指数、期货和舆情继续提供估值信号。</p></div>
          <div><span>04</span><b>订单积累</b><p>想买卖的数量无法在标的中成交，形成潜在失衡。</p></div>
          <div><span>05</span><b>复牌释放</b><p>订单进入拍卖或连续市场，价格、成交和波动集中调整。</p></div>
        </div>
        <p>
          普通重大事项复牌首日不会自动取消涨跌幅；只有交易规则穷举的 IPO 无边界期、退市整理首日、沪深重新上市首日等状态例外。历史事件研究发现停牌前常已有价格趋势，复牌后量与波动集中释放；危机样本中停牌股最终追上匹配股；长样本又发现短期信号改善可能与更高资本成本并存。这些结果评价的是不同对象，而且停牌选择内生，不能把复牌后跌幅写成“停牌造成下跌”。<Cite n={1} /><Cite n={3} /><Cite n={5} /><Cite n={47} /><Cite n={48} /><Cite n={51} />
        </p>
      </section>

      <section className="lesson-section" id="delisting-state">
        <p className="section-kicker">39 · 退市整理是有限退出窗口，不是所有退市的统一尾声</p>
        <h2>整理期改变的是退出时钟、风险揭示与买入资格；“还有十五天”并不保证流动性，也不适用于每一种退市路径。</h2>
        <p>
          对适用退市整理期的沪深北证券，现行规则通常给出 15 个交易日，全天停牌日不计入且累计停牌原则上不超过 5 个交易日；整理首日不设静态涨跌幅，其后按主板 10%、科创板/创业板 20% 或北交所 30% 的板块框架运行。沪深个人首次参与退市整理买入通常还需 24 个月交易经验与申请权限前 20 个交易日日均 50 万元资产，并签署风险揭示；板块原有适当性仍可能叠加。<Cite n={1} /><Cite n={3} /><Cite n={5} /><Cite n={56} /><Cite n={68} /><Cite n={57} /><Cite n={58} /><Cite n={59} />
        </p>
        <p>
          交易类强制退市与主动退市等路径并非一律进入整理期，所以 event time 应从正式终止上市决定和适用条款生成，不能按“最后 15 个有成交日”倒推。<Cite n={56} /><Cite n={57} /><Cite n={58} /><Cite n={59} />整理期内的成交也不代表风险被公平分散：卖方可能是被动退出，买方可能受账户门槛和单日数量限制，价差、跌停队列与最终无法再交易的尾部风险都可能上升。
        </p>
        <p>
          退市制度改变壳价值、企业披露、投资者监督和监管执法的相对收益。旧制度的会计阈值可能诱发保壳盈余管理；新制度提高实际退出率，却可能让投资者减少对高退出概率公司的信息生产。评价改革不能只数退市家数，而要沿“壳价值下降→企业行为→投资者监督→交易所问询/正式执法→价格与资源退出”整条链检验。<Cite n={52} /><Cite n={53} />
        </p>
      </section>

      <section className="lesson-section" id="corporate-actions">
        <p className="section-kicker">40 · 除权除息先重置计价单位，再允许非机械交易出现</p>
        <h2>现金分红、送转与配股会改变每股对应的现金和股份数量；未经复权的价格跳变首先是算术，不等于股东财富等额消失。</h2>
        <div className="equation-card">
          <span>常见混合公司行动的教学性参考价</span>
          <div>P<sub>ex</sub>=(P<sub>0</sub>−D+K·r)/(1+b+r)</div>
          <p>P0 是股权登记日收盘价，D 是每股现金分红，b 是免费送转比例，r 是有偿配股比例，K 是配股价。分子扣除离开公司的现金并加入认购新股支付，分母把原来一股扩展成公司行动后的股份数。具体公告和交易所认可公式始终优先。<Cite n={1} /><Cite n={3} /><Cite n={5} /></p>
        </div>
        <p>
          上交所、深交所与北交所的共同骨架可写作“扣息、加入有偿配股价值，再除以股份变动”，但上交所条文使用“流通股份变动比例”，深交所和北交所表述为“股份变动比例”，不能在数据工程中悄然统一。除权日行情展示的前收基准会被参考价替换，涨跌幅也围绕新基准计算。若 P0=12 元、每股派 0.4 元并每 10 股送 2 股，机械参考价约为 (12−0.4)/1.2=9.6667 元；从 12 跳到该数不是 19.4% 的财富损失。<Cite n={1} /><Cite n={3} /><Cite n={5} />
        </p>
        <p>
          配股认购失败须按发行规则处理；向特定对象发行的新增股份上市首日不除权，也只适用于对应业务场景，不能扩展为所有新增股份。<Cite n={63} /><Cite n={67} />差异化分红、回购专用账户股份不参与，以及破产重整资本公积转增，还可能需要专门公式或个案调整。<Cite n={64} /><Cite n={65} />税收、注意力与异质投资者又会在机械参考价周围形成真实交易：历史现金分红研究发现价格下降与税负有关，送转研究发现某类公告后小型账户买入和长期反转，但后者的“可疑”是研究代理而非监管认定。机制上必须先剥离算术重置，再研究税、信息和行为。<Cite n={54} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="bse-boundaries">
        <p className="section-kicker">41 · 北交所边界：相似语法，不同参数与生效日</p>
        <h2>北交所不能被编码成“涨跌幅更宽的沪深小盘股”：数量单位、IPO 无边界期、适当性、风险警示与盘后制度都有独立状态。</h2>
        <p>
          北交所股票通常以 100 股为最低买入数量、之后逐股递增，日涨跌幅通常为 30%，上市首日无静态限制并配有盘中临停；个人准入通常要求 24 个月证券交易经验与开通权限前 20 个交易日日均 50 万元资产。它没有被纳入当前沪股通或深股通北向路由，因此跨境可达性也不同。<Cite n={5} /><Cite n={8} /><Cite n={66} />
        </p>
        <p>
          2026 修订最能说明“规则文本不等于运行状态”：北交所新规则总体自 7 月 6 日施行，但盘后固定价格整节仍暂缓；风险警示单独显示、首次买入风险揭示和单日单只 20 万股买入约束要到 8 月 31 日才实施。以本节快照日 8 月 29 日为界，前者不可用，后者尚未生效。数据库至少需要 enacted、effective 与 operative 三个字段，不能只抓取最新 PDF 就回填全部日期。<Cite n={5} /><Cite n={6} />
        </p>
        <div className="precision-note"><span>跨市场比较的正确单位</span><p>比较北交所与沪深时，处理单位不应只是 exchange dummy，而应分解为日边界、动态申报范围、买入门槛、投资者准入、做市、公司规模、上市年龄和规则生效状态；否则“交易所效应”只是多项制度与样本构成的混合。</p></div>
      </section>

      <section className="lesson-section" id="evidence-conflicts">
        <p className="section-kicker">阶段六 · 证据与研究　|　42 · 文献分歧来自不同问题，不应靠“多数票”消除</p>
        <h2>同一制度可以改善一个结果、恶化另一个结果；先对齐处理（treatment）、结果变量（outcome）、时间窗与反事实，表面矛盾才会变成可解释的条件结论。</h2>
        <div className="table-scroll" role="region" aria-label="A股微观结构文献的表面分歧，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">四类文献的共同事实、分歧与识别边界</caption>
            <thead><tr><th scope="col">领域</th><th scope="col">相对稳健的共同事实</th><th scope="col">分歧来自哪里</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">收盘集合竞价</th><td>交易/波动向拍卖前迁移，收盘价格连续性改善</td><td>最后 3 分钟或 15 分钟、偏离或价格有效性（price effectiveness）</td><td>全天效率必然提高</td></tr>
              <tr><th scope="row">现货—期货发现</th><td>两市场共享信息且领导关系时变</td><td>样本期、代理、频率、协整模型与约束阶段</td><td>期货永久更“正确”</td></tr>
              <tr><th scope="row">沪深股通</th><td>通道改变交易与持股边界</td><td>合资格选择、公告日、流量或持仓、内外资身份</td><td>所有北向流都是知情外资</td></tr>
              <tr><th scope="row">停牌</th><td>信息继续、复牌后量价集中调整</td><td>普通事件或危机、短期信号或长期资本成本</td><td>复牌下跌由停牌造成</td></tr>
              <tr><th scope="row">退市改革</th><td>壳价值和退出概率改变</td><td>企业行为、投资者监督与执法是否同步响应</td><td>退出更严必然改善披露</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Li 等与 Han 等都发现上海 2018 年收盘集合竞价使成交与波动前移、收盘连续性改善；前者强调收盘偏离下降，后者对更广时间窗的流动性和价格有效性没有发现全面改善。停牌文献分别记录复牌释放、危机中的相对追赶与可能上升的资本成本，也不是互相否定。专业综述应写成“在何种测量下改善了什么，同时把什么压力移到哪里”，而不是挑一篇支持预设立场。<Cite n={26} /><Cite n={27} /><Cite n={47} /><Cite n={48} /><Cite n={51} />
        </p>
      </section>

      <section className="lesson-section" id="data-protocol">
        <p className="section-kicker">43 · 五维状态的数据协议</p>
        <h2>可复现研究的最小单位不是“单只股票—交易日”（stock-day），而是证券 × 工具 × 账户 × 通道 × 场所 × 事件时点 × 规则版本；日频价格会丢掉制度真正作用的界面。</h2>
        <div className="learning-objectives">
          <span>可复算的最小数据字典</span>
          <ol>
            <li><b>时间 T：</b>Asia/Shanghai 时间戳、申报/撤单/撮合状态、共同交易日、计划与实际开市/复牌（scheduled / actual open or resume）。</li>
            <li><b>价格 P：</b>前收或除权参考价、最小价位（tick）、静态边界、动态基准、原始申报（raw order）、接受/拒绝状态与临停路径。</li>
            <li><b>库存 I：</b>此前可售、当日买入、回转资格、券源、冻结状态与待交收证券/资金（settlement receivable / payable）。</li>
            <li><b>可达性 A：</b>工具（instrument）、账户（account）、通道（channel）与场所（venue）分列，记录产品时钟、权限、额度、保证金、申赎和底层开放状态。</li>
            <li><b>公司 C：</b>板块、风险警示、停牌原因、退市路径、公司行动、规则生效起止日与公告原文。</li>
            <li><b>结果 Y：</b>成交、价差、深度、队列、废单、信息份额、影子价格误差、次日修正、基差和组合级现金流。</li>
          </ol>
        </div>
        <p>
          每条规则记录已颁布（enacted）、已生效（effective）、实际运行（operative）、暂停（suspended）与废止（repealed）五种状态，并保留条文号、原始 URL、访问日和解析版本。每个资金字段还要标记官方值、供应商衍生值或模型估计值；2024 年北向披露改革正说明，相同字段名可以在制度改变后变成另一种测量。先建立按事件逐次追加的状态表（event-sourced table），再聚合到分钟或日；反向从日频数据猜规则，几乎必然把午休、盘后、停牌和公司行动混在一起。
        </p>
      </section>

      <section className="lesson-section" id="identification-falsification">
        <p className="section-kicker">44 · 六个可证伪研究设计</p>
        <h2>制度边界提供可识别差异（variation），却不是自动的自然实验；每个设计都要说明处理、对照、机制中介、并行改革和会推翻结论的安慰剂。</h2>
        <div className="table-scroll" role="region" aria-label="A股状态依赖交易制度的研究设计，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">六个研究设计及其识别边界</caption>
            <thead><tr><th scope="col">设计</th><th scope="col">处理与对照</th><th scope="col">机制 outcome</th><th scope="col">关键证伪 / 威胁</th></tr></thead>
            <tbody>
              <tr><th scope="row">2026 盘后扩围</th><td>新增主板等 vs 此前已有板块；前后比较</td><td>14:50 后量迁移、盘后成交率、次日修正</td><td>剔除同步 ST 带宽；北交所仅在匹配并验证前趋势后作负向对照时点</td></tr>
              <tr><th scope="row">T+1 库存</th><td>高锁定暴露且无旧仓账户 vs 有可售旧仓的匹配账户</td><td>坏消息后退出缺口、次日解锁与替代对冲（hedge）</td><td>卖单不标经济批次；需用开盘可售库存与旧仓耗尽作第一阶段</td></tr>
              <tr><th scope="row">动态范围</th><td>接近真实申报上限 vs 匹配伪边界</td><td>废单、重报、延迟与 ETF/期货影子误差</td><td>若伪边界同样强，可能只是价格路径选择</td></tr>
              <tr><th scope="row">隔夜 vs 午休</th><td>匹配消息意外成分（surprise）后的开盘拍卖 vs 13:00 连续重开</td><td>首价误差、吸收速度与深度</td><td>闭市长度和公告类型必须匹配</td></tr>
              <tr><th scope="row">2023 股通日历</th><td>新增共同交易日×合资格股×前后</td><td>价差、外部价格误差、跨境流与次日跳跃</td><td>非合资格股、伪假日与香港共同冲击</td></tr>
              <tr><th scope="row">2024 转融券暂停</th><td>历史依赖转融券券源高低×坏消息×前后</td><td>借券量、负面吸收、期货/期权替代</td><td>融资与救市同期变化；实际券源未降则机制失败</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          六个设计都不能只报告价格系数。若盘后改革真把库存交换从尾盘迁出，应看到 14:50 后成交下降与 15:05 后成交上升；若 T+1 真阻碍坏消息表达，效应应集中于新买且无旧仓者，并在次日解锁；若转融券暂停通过券源生效，第一阶段必须是实际可借量或借券成本变化。没有中介量，所谓制度效应可能只是同期风险偏好。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">45 · 互动实验：先判定状态，再解释价格</p>
        <h2>八个冻结情境把“规则背诵”改成执行决策：同一意愿在不同时间、库存、产品和跨境接口下，究竟能否成为订单。</h2>
        <p>
          模式一“时钟与订单状态”重建开盘不可撤窗口、集合竞价清算价、退市整理首日的公司—价格联合状态和板块申报数量；模式二“库存与跨市场接口”重建可售库存、产品级回转、融资融券与转融券分层，以及沪深股通时钟和额度。实验模式名称与 1.26A / 1.26B 页码无关。八题合计覆盖时间、价格、库存、账户—通道可达性与公司状态；每题必须先提交判断才揭示机制，刷新或离开页面会清空进度。实验参数按 2026-08-29 快照冻结，不替代真实交易日前的规则、证券公告和账户权限核验。
        </p>
        <AShareTradabilityLab />
      </section>

      <section className="lesson-section" id="practice">
        <p className="section-kicker">46 · 六道独立复算题</p>
        <h2>这些题换用新的订单、价格和账户参数；能够算对只是第一步，还要说清结果属于哪一维状态、不能外推什么。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · 开盘集合竞价</span><p>买单：10.03 元×200 股、10.01 元×400 股、10.00 元×400 股；卖单：9.99 元×300 股、10.00 元×500 股、10.02 元×300 股。忽略同量择价，因为最大成交量价格唯一。求清算价和成交量。</p><details className="practice-answer"><summary>展开核对答案</summary><p>10.00 元处累计买量为 1,000 股，累计卖量为 800 股，可成交 800 股；9.99 元最多 300 股，10.01 元最多 600 股，10.02 元最多 200 股，因此唯一最大成交量价为 10.00 元。不能对六个限价做简单平均。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 15:10 的两个账户</span><p>一只未停牌沪市主板股票 15:00 收盘价 8.00 元。本地合资格账户与北向账户都想在 15:10 买入，分别能否进入当日盘后固定价格交易？若本地买方限价 8.10 元，成交价是多少？</p><details className="practice-answer"><summary>展开核对答案</summary><p>本地账户可按盘后资格申报，北向窗口 15:00 已结束，当前不能参加 15:05–15:30。本地限价 8.10 只说明愿在 8.00 收盘价成交，不提高排队优先级；有对手方时仍以 8.00 成交。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 价格笼子与日边界</span><p>沪深主板股票连续竞价买入基准价 3.00 元，tick=0.01；动态上限取 max(102%×基准价，基准价+10×tick)，日涨停为 3.30 元。3.08 元与 3.11 元买单分别怎样处理？</p><details className="practice-answer"><summary>展开核对答案</summary><p>动态上限=max(3.06,3.10)=3.10。3.08 在动态和静态范围内，可以成为有效申报；3.11 虽低于 3.30 日涨停，却越过此刻 3.10 的动态上限，是无效申报。动态范围不是小一号日涨停。</p></details></article>
          <article className="practice-problem"><span>练习 04 · 三类可售敞口</span><p>账户开盘有普通 A 股旧仓 600 股，今日再买 400 股；今日新买合资格债券 ETF 500 份；上午新开 2 手股指期货空单。忽略冻结与保证金不足，当日最多可卖/平多少？</p><details className="practice-answer"><summary>展开核对答案</summary><p>普通 A 股最多卖旧仓 600 股；题设债券 ETF 属回转类别，可卖今日买入的 500 份；2 手期货合约可在当日反向平仓。三项答案不同来自 instrument-level eligibility，不来自投资者观点不同。</p></details></article>
          <article className="practice-problem"><span>练习 05 · 额度与披露</span><p>14:10 北向每日额度已不足以接受新增买入。一名北向投资者要卖出已有持仓，另一名要撤销未成交买单。两者是否都被禁止？研究者能否从 2024-05-13 后官方盘中页面直接读取精确买入额和卖出额？</p><details className="practice-answer"><summary>展开核对答案</summary><p>额度闸门限制新增净买入，不把卖出和撤单一并关闭；两项操作可按规则继续。2024-05-13 后官方不再盘中实时公布精确北向买入、卖出和总成交额，供应商实时数字若存在必须标明估计方法，不能与旧官方序列无缝拼接。</p></details></article>
          <article className="practice-problem"><span>练习 06 · 除权不是财富损失</span><p>股权登记日收盘 12.00 元，每股现金分红 0.40 元，并每 10 股送 2 股。忽略税费，求机械除权参考价；若除权日收 9.86 元，按一股旧股计算总回报。</p><details className="practice-answer"><summary>展开核对答案</summary><p>参考价=(12−0.40)/1.2=9.6667 元。旧一股变为 1.2 股并收到 0.40 元，期末财富=1.2×9.86+0.40=12.232 元，总回报=(12.232/12)−1≈1.93%。原始价格从 12 到 9.86 的跌幅不是经济损失。</p></details></article>
        </div>
      </section>

      <section className="lesson-section" id="checks">
        <p className="section-kicker">47 · 十项理解检查</p>
        <h2>若答案仍是“A 股特殊”或“外资更聪明”，就退回五维状态，指出具体是谁在什么时点失去了哪一种可执行选择。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么 09:18 与 09:23 的同一订单含义不同？</summary><p>前者处于开盘集合竞价可撤阶段，后者处于不可撤阶段；09:20 是撤单选择权到期点，订单承诺程度和策略空间随时钟切换。</p></details>
          <details><summary>02 · 盘后固定价格为什么不生成第二个收盘价？</summary><p>撮合价被固定为 15:00 已形成的官方收盘价，系统只决定数量和时间优先队列；买方愿付更高不会改写成交价。</p></details>
          <details><summary>03 · T+1 为什么不是账户整日冻结？</summary><p>限制针对今日新买的普通股票批次；昨日可售库存仍能卖，允许回转的产品和衍生品又有不同资格。</p></details>
          <details><summary>04 · “转融券暂停”为什么不等于融资融券取消？</summary><p>暂停的是中证金融向券商扩张券源的一条上游通道；合资格客户融资融券仍存在，但融券受标的、券源、保证金和价格规则约束。</p></details>
          <details><summary>05 · 期货领先为什么不证明期货永远更正确？</summary><p>领先可能来自现货受限、保证金效率或组合订单，也可能来自期货自身强平和展期压力；需要后续无约束价格与状态条件检验准确性。</p></details>
          <details><summary>06 · 北向资金为什么不是统一的“外资主体”？</summary><p>北向是交易路由，背后主体、最终受益人和策略异质；通道标签只能证明订单经过哪组闸门，不能单独识别国籍、信息或观点。</p></details>
          <details><summary>07 · 停牌后波动上升为什么不等于停牌制造波动？</summary><p>停牌通常由重大内生事件选择，信息在不能成交时继续积累；复牌波动可能是延迟释放。需要可比未停牌反事实和停牌前趋势。</p></details>
          <details><summary>08 · 主板 ST 的 5% 为什么是过时答案？</summary><p>沪深 2026 规则自 7 月 6 日起将主板风险警示股票通常边界调为 10%；科创板和创业板通常 20%，北交所又有独立框架和生效日。</p></details>
          <details><summary>09 · 除息日原始跌幅为什么不能当总回报？</summary><p>现金离开公司进入股东账户，送转又改变股份数；应以除权参考价或股息再投资总回报比较，先剥离机械计价重置。</p></details>
          <details><summary>10 · 什么结果会推翻“约束只是延期价格发现”？</summary><p>若外部价值误差、订单失衡和后续追赶都下降，且替代市场没有同向迁移，约束可能真正消除了暂时误价；若伪边界同样有效，则原结果可能只是路径选择。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces">
        <p className="section-kicker">48 · 课程接口</p>
        <h2>1.26A–B 不是“中国规则附录”，而是 Chapter 1 的双单元总装：前 25 节的订单、流动性和衍生品机制在一个真实制度系统里同时运行。</h2>
        <div className="interface-grid">
          <article><span>← 1.17</span><h3>Opening / Closing Auction</h3><p>输入集中清算、不可撤窗口与失衡；本节把它放入午休、盘后和跨境时钟。</p></article>
          <article><span>← 1.19</span><h3>Short Selling</h3><p>输入借券、保证金与价格测试；本节区分普通融券、转融券暂停和替代衍生品。</p></article>
          <article><span>← 1.20</span><h3>Leverage &amp; Margin</h3><p>输入逐日盯市和强平反馈；本节说明期货价格发现如何反向成为现金压力。</p></article>
          <article><span>← 1.21–1.24</span><h3>ETF / Futures / Options</h3><p>输入申赎、基差与 Greeks；本节说明产品时钟错位时谁暂时承担价格发现。</p></article>
          <article><span>← 1.25</span><h3>Trading Constraints</h3><p>输入涨跌停、动态范围、临停与 T+1；本节把规则映射到逐账户可交易集合。</p></article>
          <article><span>→ 2.01</span><h3>Who Is the Agent?</h3><p>输出账户、通道、最终所有者与策略四轴，下一章再研究异质参与者为何交易。</p></article>
          <article><span>→ 5.05</span><h3>Regulation</h3><p>输出规则版本、生效边界、目标函数与压力迁移，供制度比较而非标签判断。</p></article>
          <article><span>→ 7.28</span><h3>A 股动态系统</h3><p>输出可用于事件研究的五维状态机，把微观执行接入宏观冲击、反馈与跨资产传导。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="closing-thesis">
        <p className="section-kicker">49 · 结课诊断</p>
        <h2>解释 A 股价格，第一问不应是“大家怎么看”，而应是“在这个精确状态下，谁能把看法变成哪一种真实订单”。</h2>
        <p className="closing-thesis">
          从隔夜消息到次日价格，中间不是一条无摩擦直线。09:20 的撤单权到期，09:25 的集合竞价把订单压成一个开盘价，连续竞价受静态边界和动态申报范围约束，午休让信息继续而成交暂停，15:00 后本地库存仍可按固定收盘价交换，但北向通道已关闭。普通股票的新买批次被锁到后续交易日，ETF 的回转资格逐产品变化，期货与期权用保证金和非线性风险提供替代，却又引入基差与强平反馈。公司一旦进入风险警示、停复牌、退市整理或除权状态，参考价、资格和时钟再次切换。
          <br /><br />
          所以 A 股的“特殊性”不是某条规则造成某种性格，而是五维状态共同重写可交易集合。信息到达后，先作用于拥有不同库存、账户与通道的主体；他们把无法在一个市场完成的目标迁到另一个时段、产品或证券；最少受限的接口暂时形成影子价格；拍卖、复牌、库存解锁和套利再把价格传回；新的价格又改变保证金、风险警示、投资者注意和下一轮订单。这才是完整的动态因果链。
          <br /><br />
          面对陌生事件时，依次重建规则版本、五维状态、真实订单、未完成需求、替代市场和后续收敛；再用中介量、反事实和安慰剂区分“消除错误”与“推迟或迁移压力”。做到这一步，你不必背下一张永久规则表，也能在规则更新后重新推导：什么可以交易、谁承担约束、价格在哪里先形成，以及自己的判断可能在哪个接口出错。
        </p>
      </section>
    </>
  );
}

const lesson126Base: LessonRecord = {
  slug: '1-26',
  id: '1.26',
  chapter: '01',
  chapterTitle: 'Price Formation & Market Microstructure',
  title: 'A 股特有微观结构',
  subtitle: '用“状态依赖的可交易性”统一解释交易时钟、价格边界、T+1 库存、融券、ETF/期货/期权、沪深股通、公司状态与跨市场价格发现',
  readingTime: '主线首读约 95–110 分钟；零背景完整学习建议分两次，共约 180–215 分钟（含互动实验与练习；参考文献和延伸阅读不计）',
  prerequisite: '硬先修：1.02 · Market Architecture；按需回看：1.04、1.17、1.19–1.25',
  updatedAt: '2026-08-29',
  revision: '1.26-r1',
  reviewStatus: 'draft',
  reviews: [],
  previous: { slug: '1-25', label: '1.25 Circuit Breaker、Price Limit 与 T+1' },
  next: { label: '2.01 Who Is the Agent?' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整状态回路' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'market-map', label: 'A股市场地图' },
    { id: 'state-vector', label: '五维状态向量' },
    { id: 'day-timeline', label: '完整交易日' },
    { id: 'opening-call', label: 'Opening Call Auction' },
    { id: 'cancel-window', label: '撤单窗口' },
    { id: 'auction-price', label: '集合竞价清算价' },
    { id: 'morning-continuous', label: '上午连续竞价' },
    { id: 'lunch-break', label: '午休信息积累' },
    { id: 'afternoon-reopen', label: '13:00 连续重开' },
    { id: 'closing-call', label: 'Closing Call Auction' },
    { id: 'closing-price', label: '收盘价生成' },
    { id: 'after-hours-fixed', label: '盘后固定价格' },
    { id: 'order-types', label: '订单类型与保护价' },
    { id: 'lot-tick', label: '数量单位与 Tick' },
    { id: 'static-limits', label: '静态日涨跌幅' },
    { id: 'dynamic-collar', label: '动态申报价格范围' },
    { id: 'ipo-interruption', label: '无日限价与临停' },
    { id: 'sellable-inventory', label: '普通股票可售库存' },
    { id: 'turnaround-matrix', label: '产品回转矩阵' },
    { id: 'settlement-eligibility', label: '交易资格与结算' },
    { id: 'margin-shorting', label: '融资融券与转融券' },
    { id: 'short-asymmetry', label: '多空表达不对称' },
    { id: 'etf-primary-interface', label: 'ETF 一级—二级接口' },
    { id: 'product-t0-heterogeneity', label: '产品级 T+0' },
    { id: 'futures-clock-margin', label: '股指期货接口' },
    { id: 'options-interface', label: '期权非线性表达' },
    { id: 'state-dependent-discovery', label: '状态依赖价格发现' },
    { id: 'basis-closure', label: '基差与闭市边界' },
    { id: 'connect-architecture', label: '沪深股通架构' },
    { id: 'connect-clock-orders', label: '股通时钟与订单' },
    { id: 'connect-gates', label: '股通额度与准入' },
    { id: 'connect-disclosure', label: '北向披露制度' },
    { id: 'identity-axes', label: '投资者身份四轴' },
    { id: 'account-evidence', label: '账户统计边界' },
    { id: 'risk-warning', label: '风险警示状态' },
    { id: 'suspension-reopen', label: '停牌与复牌' },
    { id: 'delisting-state', label: '退市整理状态' },
    { id: 'corporate-actions', label: '除权除息' },
    { id: 'bse-boundaries', label: '北交所边界' },
    { id: 'evidence-conflicts', label: '证据分歧' },
    { id: 'data-protocol', label: '五维数据协议' },
    { id: 'identification-falsification', label: '识别与证伪' },
    { id: 'lab', label: '互动实验' },
    { id: 'practice', label: '独立练习' },
    { id: 'checks', label: '理解检查' },
    { id: 'interfaces', label: '课程接口' },
    { id: 'closing-thesis', label: '结课诊断' },
  ],
  Content: Lesson126AContent,
  references: [
    { id: 1, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所交易规则（2026年修订）', publication: '上证发〔2026〕41号，2026-07-06施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml', use: '上交所竞价时钟、申报单位、价位、价格限制、价格笼子、盘后固定价格、回转与除权基准；产品、上市与临时通知仍须另核。' },
    { id: 2, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上交所修订发布《上海证券交易所交易规则》', publication: '上交所官方政策说明，2026-04-24', url: 'https://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20260424_10816474.shtml', use: '解释2026-07-06实施、盘后固定价格扩至A股和ETF、主板风险警示5%改10%及ETF收盘集合竞价；解释稿不替代正式规则。' },
    { id: 3, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '深圳证券交易所交易规则（2026年修订）', publication: '深证上〔2026〕551号，2026-07-06施行', url: 'https://www.szse.cn/lawrules/rule/trade/current/t20260424_620190.html', use: '深市竞价时钟、订单类型、申报单位、价位、价格限制与价格笼子、盘后固定价格、回转与除权；产品和逐日参数另核。' },
    { id: 4, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '关于做好深化创业板改革交易机制相关技术准备的通知', publication: '深交所官方技术通知，2026-04-24', url: 'https://www.szse.cn/marketServices/technicalservice/notice/t20260424_620199.html', use: '核验2026-07-06技术实施及盘后固定价格从创业板扩至A股、CDR与ETF；技术通知不替代正式规则。' },
    { id: 5, authors: '北京证券交易所', year: '2026', accessedAt: '2026-08-29', title: '北京证券交易所交易规则', publication: '北证公告〔2026〕17号，原则上2026-07-06施行；部分条款延后', url: 'https://www.bse.cn/jygl_list/200028217.html', use: '北交所竞价时钟、100股门槛、30%幅度、首日无幅度、价格笼子与除权；第3.7节及第4.5节须结合实施公告判断运行状态。' },
    { id: 6, authors: '北京证券交易所', year: '2026', accessedAt: '2026-08-29', title: '关于实施《北京证券交易所交易规则》相关条款的公告', publication: '北证公告〔2026〕34号，2026-08-21发布；第4.5.1—4.5.4条自2026-08-31施行', url: 'https://www.bse.cn/jygl_list/200029142.html', use: '风险警示证券单独显示、首次买入风险揭示及单日单只20万股买入约束于8月31日生效；未启动第3.7节盘后固定价格。' },
    { id: 7, authors: '中国证券登记结算有限责任公司深圳分公司', year: '2026', accessedAt: '2026-08-29', title: '中国结算深圳分公司关于修订并发布《中国证券登记结算有限责任公司深圳分公司证券资金结算业务指南》的通知', publication: '中国结算深圳分公司官方通知及指南，2026-08-10施行', url: 'https://www.chinaclear.cn/zdjs/szfgsgg/202607/88b2e21f07e1417da56150f04bcff839.shtml', use: '深圳参与人的证券处理、可售交收锁定和资金批次；不能外推为全国所有资产的单一T+1时点。' },
    { id: 8, authors: 'Hong Kong Exchanges and Clearing Limited; Shanghai Stock Exchange; Shenzhen Stock Exchange; China Securities Depository and Clearing Corporation Limited', year: '2026', accessedAt: '2026-08-29', title: 'Frequently Asked Questions — Stock Connect', publication: 'Stock Connect Official FAQ, version dated 6 July 2026', url: 'https://www.hkex.com.hk/-/media/HKEX-Market/Mutual-Market/Stock-Connect/Getting-Started/Information-Booklet-and-FAQ/FAQ/FAQ_En.pdf', use: '互联互通路由、时钟、订单类型、额度、持股和北向范围；法律权利仍以交易所与结算规则为准，通道也不识别最终受益人。' },
    { id: 9, authors: 'Hong Kong Exchanges and Clearing Limited', year: '2024', accessedAt: '2026-08-29', title: 'Trading Calendar Enhancement for Stock Connect — FAQ', publication: 'Stock Connect Official FAQ, version dated 23 September 2024; enhancement effective 24 April 2023', url: 'https://www.hkex.com.hk/-/media/HKEX-Market/Mutual-Market/Stock-Connect/Reference-Materials/Trading-Calendar-Enhancement-for-Stock-Connect/FAQ-for-Trading-Calendar-Enhancement-for-Stock-Connect.pdf', use: '共同交易日与次日银行结算逻辑及2023优化；不代表任何单边假日都开放。' },
    { id: 10, authors: 'Hong Kong Securities Clearing Company Limited', year: '2024', accessedAt: '2026-08-29', title: 'Further Updates — Adjustments to Market Data Dissemination in Relation to Northbound and Southbound Trading under Stock Connect — The Remaining Items', publication: 'HKSCC Circular Ref. CD/DNS/CCASS/217/2024, 26 July 2024', url: 'https://www.hkex.com.hk/-/media/HKEX-Market/Services/Circulars-and-Notices/Participant-and-Members-Circulars/HKSCC/2024/ce_HKSCC_NOM_217_2024.pdf', use: '确认披露调整分2024-05-13和2024-08-19两阶段实施；这是数据发布制度，不是经济资金流变化。' },
    { id: 11, authors: '中国证券登记结算有限责任公司', year: '2025', accessedAt: '2026-08-29', title: '2024年统计年报', publication: '中国结算统计年报，2025-06-27发布', url: 'https://m.chinaclear.cn/zdjs/tjnb/202506/542ecc4ea6e14595ac34be6843c7ebb5/files/2024%E5%B9%B4%E7%BB%9F%E8%AE%A1%E5%B9%B4%E6%8A%A5.pdf', use: '期末持有未注销、非休眠A/B股账户的投资者约2.368亿；投资者不等于活跃账户、交易者或最终受益人。' },
    { id: 12, authors: '上海证券交易所', year: 'current', accessedAt: '2026-08-29', title: 'ETF相关常见问题', publication: '上交所ETF官方常见问题', url: 'https://www.sse.com.cn/assortment/fund/etf/question/', use: 'ETF一级申赎、二级交易与产品级回转核验入口；不能将个别产品的T+0推广为全部ETF。' },
    { id: 13, authors: '中国金融期货交易所', year: 'current', accessedAt: '2026-08-29', title: '沪深300股指期货', publication: '中金所官方产品页面', url: 'https://www.cffex.com.cn/hs300/', use: 'IF合约乘数、月份、连续交易时段、涨跌停、最低保证金与现金交割的当前参数；开盘集合竞价细时钟须见合约细则，日参数仍可调整。' },
    { id: 14, authors: '上海证券交易所', year: '2015', accessedAt: '2026-08-29', title: '上海证券交易所股票期权试点交易规则', publication: '上证发〔2015〕7号，现行有效规则页', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/option/c/c_20250610_10781448.shtml', use: '上交所股票期权交易、行权、交收及标的证券交付；不覆盖深交所或中金所产品。' },
    { id: 15, authors: '深圳证券交易所', year: '2019', accessedAt: '2026-08-29', title: '深圳证券交易所股票期权试点交易规则', publication: '深证上〔2019〕800号，2019-12-07施行', url: 'https://investor.szse.cn/option/rules/optrules/t20191207_572478.html', use: '深市股票期权交易、行权、交付与风险安排；具体合约和产品通知另核。' },
    { id: 16, authors: '中国金融期货交易所', year: '2022', accessedAt: '2026-08-29', title: '中国金融期货交易所股指期权合约交易细则', publication: '2022-12-14第二次修订，2022-12-19实施', url: 'https://www.cffex.com.cn/cn/ssxz/20221214/43100.html', use: 'IO、MO与HO的欧式、现金交割、时钟和行权规则；不支持股票实物交付或当前合约逐日参数。' },
    { id: 17, authors: '中国证券监督管理委员会', year: '2024', accessedAt: '2026-08-29', title: '证监会依法批准暂停转融券业务 进一步强化融券逆周期调节', publication: '证监会公告，2024-07-10', url: 'https://www.csrc.gov.cn/csrc/c100028/c7493852/content.shtml', use: '中国证券金融公司转融券自2024-07-11暂停；不是客户融资融券整体取消，也不是转融资暂停。' },
    { id: 18, authors: '上海证券交易所', year: '2024', accessedAt: '2026-08-29', title: '关于调整融券交易保证金比例的通知', publication: '上证发〔2024〕98号，2024-07-22施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/trade/specific/margin/c/c_20250616_10782021.shtml', use: '融券保证金最低100%、私募证券投资基金120%，存量合约及展期有过渡；上交所通知，其他市场须读对应文件。' },
    { id: 19, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '关于调整融资保证金比例的通知', publication: '上证发〔2026〕5号，2026-01-19施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/trade/specific/margin/c/c_20260114_10805174.shtml', use: '融资保证金最低比例100%，存量融资合约及部分展期沿用旧规则；上交所口径，其他市场另核。' },
    { id: 20, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '关于融资融券标的证券2026年第二季度定期调整有关事项的通知', publication: '上证发〔2026〕72号，调整名单2026-07-13施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/trade/specific/margin/c/c_20260710_10825136.shtml', use: '证明融资融券标的名单按期动态调整；名单资格不等于经纪商实际有券可借。' },
    { id: 21, authors: '上海证券交易所创新产品部', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所股票期权市场发展报告（2025）', publication: '上交所研究报告，2026-04-10', url: 'https://www.sse.com.cn/aboutus/research/report/c/10814750/files/d1800de82bbe4613a2fe93e0853b7a3a.pdf', use: '2025期权市场参与、成交与开仓方向的报告口径；不能代表全部A股投资者结构或最终风险承担者。' },
    { id: 22, authors: '中国金融期货交易所', year: '2018', accessedAt: '2026-08-29', title: '中国金融期货交易所沪深300股指期货合约交易细则', publication: '2018-12-28第七次修订，中金所现行规则目录', url: 'https://www.cffex.com.cn/u/cms/www/202003/27165505w3j5.pdf', use: 'IF 09:25—09:30开盘集合竞价及09:30—11:30、13:00—15:00连续交易；仅限沪深300股指期货，不能代表全部中金所产品。' },
    { id: 26, authors: 'Jiayi Li; Sumei Luo; Guangyou Zhou', year: '2021', title: 'Call auction, continuous trading and closing price formation', publication: 'Quantitative Finance, 21(6), 1037–1065', url: 'https://doi.org/10.1080/14697688.2020.1849782', use: '上海收盘集合竞价改革的自然实验；支持该窗口下成交量与波动迁移及收盘价偏离下降，不外推为所有集合竞价或全日效率结论。' },
    { id: 27, authors: 'Qian Han; Chengzhi Zhao; Jing Chen; Qian Guo', year: '2022', title: 'Reexamining the impact of closing call auction on market quality: A natural experiment from the Shanghai stock exchange', publication: 'Pacific-Basin Finance Journal, 74, 101821', url: 'https://doi.org/10.1016/j.pacfin.2022.101821', use: '上海收盘集合竞价改革；支持流动性与效率效果有限、成交和波动时点迁移及收盘连续性改善，说明市场质量结论并不单向一致。' },
    { id: 28, authors: 'Gang Chu; John W. Goodell; Xiao Li', year: '2024', title: 'Are pre-opening periods important? Evidence from Chinese market lunch breaks', publication: 'Pacific-Basin Finance Journal, 88, 102577', url: 'https://doi.org/10.1016/j.pacfin.2024.102577', use: '比较早盘集合竞价与午休后连续交易重开对隔夜和午间公告的吸收；窗口、公告构成与准备时间不同，不能解释为纯交易机制因果。' },
    { id: 29, authors: 'Jian Yang; Zihui Yang; Yinggang Zhou', year: '2012', title: 'Intraday price discovery and volatility transmission in stock index and stock index futures markets: Evidence from China', publication: 'Journal of Futures Markets, 32(2), 99–121', url: 'https://doi.org/10.1002/fut.20514', use: '早期沪深300现货—期货日内价格发现及双向波动传递；样本中现货占优，不支持期货永久领先。' },
    { id: 30, authors: 'Haiqiang Chen; Qian Han; Yingxing Li; Kai Wu', year: '2013', title: 'Does Index Futures Trading Reduce Volatility in the Chinese Stock Market? A Panel Data Evaluation Approach', publication: 'Journal of Futures Markets, 33(12), 1167–1190', url: 'https://doi.org/10.1002/fut.21573', use: '用面板政策评估研究股指期货推出后的现货波动下降；这是波动效应证据，不是价格发现排序证据。' },
    { id: 31, authors: 'Feng Xu; Difang Wan', year: '2015', title: 'The impacts of institutional and individual investors on the price discovery in stock index futures market: Evidence from China', publication: 'Finance Research Letters, 15, 221–231', url: 'https://doi.org/10.1016/j.frl.2015.10.002', use: '期货价格发现贡献及机构与个人交易同效率的相关关系；观察性结果不能推出身份或信息优势因果。' },
    { id: 32, authors: 'Sungbin Sohn; Xiaofeng Zhang', year: '2017', title: 'Could the Extended Trading of CSI 300 Index Futures Facilitate Its Role of Price Discovery?', publication: 'Journal of Futures Markets, 37(7), 717–740', url: 'https://doi.org/10.1002/fut.21804', use: '历史延长交易时段的信息含量与同步时段早期领先；不能用于描述2026年现行交易时段。' },
    { id: 33, authors: 'Hong Miao; Sanjay Ramchander; Tianyang Wang; Dongxiao Yang', year: '2017', title: 'Role of index futures on China’s stock markets: Evidence from price discovery and volatility spillover', publication: 'Pacific-Basin Finance Journal, 44, 13–26', url: 'https://doi.org/10.1016/j.pacfin.2017.05.003', use: '2010—2015年期货平均信息份额、2015限制后的弱化及波动溢出；价格发现与波动传递方向不能混为一谈。' },
    { id: 34, authors: 'Kwangwon Ahn; Yingyao Bi; Sungbin Sohn', year: '2019', title: 'Price discovery among SSE 50 Index-based spot, futures, and options markets', publication: 'Journal of Futures Markets, 39(2), 238–259', url: 'https://doi.org/10.1002/fut.21970', use: '2015—2017年上证50现货、期货与期权的样本内领先关系；统计领先不等于永久真实价格或库存机制证据。' },
    { id: 35, authors: 'Feng He; Baiao Liu-Chen; Xiangtong Meng; Xiong Xiong; Wei Zhang', year: '2020', title: 'Price discovery and spillover dynamics in the Chinese stock index futures market: a natural experiment on trading volume restriction', publication: 'Quantitative Finance, 20(12), 2067–2083', url: 'https://doi.org/10.1080/14697688.2020.1814037', use: '2015年交易量限制自然实验；短期与长期价格发现效应相反，长期流动性受损，不足以独自证明T+1、涨跌停或全部替代链。' },
    { id: 36, authors: 'Shiyi Chen; Michael T. Chng; Qingfu Liu', year: '2021', title: 'The implied arbitrage mechanism in financial markets', publication: 'Journal of Econometrics, 222(1), 468–483', url: 'https://doi.org/10.1016/j.jeconom.2020.07.011', use: '利用沪深300 ETF推出识别隐含无套利区间及现货—期货修正机制；不直接证明ETF永久领先或跨境ETF机制。' },
    { id: 37, authors: 'Da Dong; Qingfu Liu; Pingping Tao; Zhiliang Ying', year: '2021', title: 'The pricing mechanism between ETF option and spot markets in China', publication: 'Journal of Futures Markets, 41(8), 1286–1300', url: 'https://doi.org/10.1002/fut.22205', use: '沪深300 ETF期权—现货的价格发现与波动联系；不能据此推出做市商库存、订单因果或永久领先。' },
    { id: 38, authors: 'Liwei Jin; Xianghui Yuan; Jun Long; Xiang Li; Feng Lian', year: '2022', title: 'Price discovery in the CSI 300 Index derivatives markets', publication: 'Journal of Futures Markets, 42(7), 1352–1368', url: 'https://doi.org/10.1002/fut.22335', use: '一分钟数据比较指数、期货、ETF与ETF期权的价格发现，样本内期权与期货较强；统计领先不等于因果或真实价值。' },
    { id: 39, authors: 'Xinmiao Zhou; Junru Zhang; Zhaoyong Zhang', year: '2021', title: 'How does news flow affect cross-market volatility spillovers? Evidence from China’s stock index futures and spot markets', publication: 'International Review of Economics & Finance, 73, 196–213', url: 'https://doi.org/10.1016/j.iref.2021.01.003', use: '现货—期货双向、非对称、时变波动溢出及新闻流相关性；新闻并非外生实验，不宜写成单向因果。' },
    { id: 42, authors: 'Jiangze Bian; Kalok Chan; Bing Han; Donghui Shi', year: '2023', title: 'Cross-border equity flows and information transmission: Evidence from Chinese stock markets', publication: 'Journal of International Financial Markets, Institutions and Money, 84, 101755', url: 'https://doi.org/10.1016/j.intfin.2023.101755', use: '专有股票级沪股通买卖与净买入数据连接收益及非对称波动预测；不能识别最终受益所有人，也不能把外资视作同质主体。' },
    { id: 43, authors: 'Keqi Chen; Yuehan Wang; Xiaoquan Zhu', year: '2024', title: 'The value of information in China’s connected market', publication: 'Journal of Empirical Finance, 78, 101526', url: 'https://doi.org/10.1016/j.jempfin.2024.101526', use: '由每日持股反推北向资金流并研究预测性与跟随交易；估算流不等于逐笔成交或身份识别。' },
    { id: 44, authors: 'Zhiguo He; Yuehan Wang; Xiaoquan Zhu', year: '2026', title: 'Homemade Foreign Trading', publication: 'NBER Working Paper No. 35095', url: 'https://doi.org/10.3386/w35095', use: '托管持仓证据识别部分内地投资者经互联互通绕道交易，并研究2018身份识别改革；不能把任意北向订单归属到最终受益人或断言全部北向均为假外资。' },
    { id: 46, authors: 'Lilian Ng; Fei Wu', year: '2007', title: 'The trading behavior of institutions and individuals in Chinese equity markets', publication: 'Journal of Banking & Finance, 31(9), 2695–2710', url: 'https://doi.org/10.1016/j.jbankfin.2006.10.029', use: '约474万投资者账户的早期样本与机构、个人交易行为；账户规模代理不等于身份、机构资格或最终受益人。' },
    { id: 47, authors: 'Qing He; Jingyun Gan; Shuwan Wang; Terence Tai-Leung Chong', year: '2019', title: 'The effects of trading suspensions in China', publication: 'The North American Journal of Economics and Finance, 50, 100985', url: 'https://doi.org/10.1016/j.najef.2019.100985', use: '强制与自愿停牌前信息泄漏及复牌后的波动、成交；停牌内生，不能泛化为干净政策因果。' },
    { id: 48, authors: 'Jennifer Huang; Donghui Shi; Zhongzhi Song; Bin Zhao', year: '2025', title: 'Firm-initiated stock trading suspension during a market crash', publication: 'Journal of Banking & Finance, 177, 107473', url: 'https://doi.org/10.1016/j.jbankfin.2025.107473', use: '2015年7月股灾中的公司主动停牌及复牌追赶；危机期匹配证据不代表一般停牌或净福利因果。' },
    { id: 49, authors: 'Jiangze Bian; Tie Su; Jun Wang', year: '2022', title: 'Non-marketability and one-day selling lockup', publication: 'Journal of Empirical Finance, 65, 1–23', url: 'https://doi.org/10.1016/j.jempfin.2021.10.006', use: '股票相对权证或ETF期权隐含价值的日内折价，识别一日卖出锁定的非市场性；衍生品定价和流动性限制其福利与全市场外推。' },
    { id: 50, authors: 'Kenan Qiao; Lammertjan Dam', year: '2020', title: 'The overnight return puzzle and the “T+1” trading rule in Chinese stock markets', publication: 'Journal of Financial Markets, 50, 100534', url: 'https://doi.org/10.1016/j.finmar.2020.100534', use: 'T+1与平均隔夜及开盘折价现象；跨市场比较非随机，不能独自推出总体福利。' },
    { id: 51, authors: 'Crocker H. Liu; Charles Trzcinka; Ziwei Zhao', year: '2026', title: 'The Chinese trading halt puzzle', publication: 'Journal of Financial Markets, 77, 101007', url: 'https://doi.org/10.1016/j.finmar.2025.101007', use: '1999—2020年专有停牌数据中的信号、噪声与资本成本估计；内生观察性证据中短期信号与长期成本可并存。' },
    { id: 52, authors: 'Guohua Jiang; Hansheng Wang', year: '2008', title: 'Should earnings thresholds be used as delisting criteria in stock market?', publication: 'Journal of Accounting and Public Policy, 27(5), 409–419', url: 'https://doi.org/10.1016/j.jaccpubpol.2008.07.002', use: '历史连续亏损ST与退市阈值及盈余操纵；不能作为2026年现行阈值或规则来源。' },
    { id: 53, authors: 'Shuo Yang; Jingran Zhao', year: '2026', title: 'Delisting reform and the information environment: Evidence from China', publication: 'Journal of Contemporary Accounting & Economics, 22(2), 100546', url: 'https://doi.org/10.1016/j.jcae.2026.100546', use: '2020退市改革降低壳价值、增强退市风险信息性但未改善盈余质量；支持监督、披露与执法渠道，不外推到每家公司。' },
    { id: 54, authors: 'Nikolaos T. Milonas; Nickolaos G. Travlos; Jason Zezhong Xiao; Cunkai Tan', year: '2006', title: 'The ex-dividend day stock price behavior in the Chinese stock market', publication: 'Pacific-Basin Finance Journal, 14(2), 155–174', url: 'https://doi.org/10.1016/j.pacfin.2005.06.004', use: '现金分红除息日价格与历史税制关系；不是现行公司行动公式或税制依据。' },
    { id: 55, authors: 'Sheridan Titman; Chishen Wei; Bin Zhao', year: '2022', title: 'Corporate actions and the manipulation of retail investors in China: An analysis of stock splits', publication: 'Journal of Financial Economics, 145(3), 762–787', url: 'https://doi.org/10.1016/j.jfineco.2021.09.018', use: '作者定义的可疑拆股、小散买入和短期上涨后反转；代理分类不等于监管认定，也不能外推为全部公司行动。' },
    { id: 56, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所股票上市规则（2026年4月修订）', publication: '上证发〔2026〕42号，2026-04-24发布并施行（部分条款设过渡安排）', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/mainipo/c/c_20260424_10816589.shtml', use: '上交所主板风险警示、退市、退市整理与适当性；不覆盖科创板全部特殊规则或交易时钟。' },
    { id: 57, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '深圳证券交易所股票上市规则（2026年修订）', publication: '深证上〔2026〕549号，2026-04-24发布并施行（部分条款自2026-05-24施行，退市规则有衔接安排）', url: 'https://www.szse.cn/lawrules/rule/allrules/bussiness/t20260424_620193.html', use: '深市主板风险警示、退市及退市整理；不覆盖创业板专门上市规则。' },
    { id: 58, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '深圳证券交易所创业板股票上市规则（2026年修订）', publication: '深证上〔2026〕550号，2026-04-24发布并施行（部分条款自2026-05-24施行）', url: 'https://investor.szse.cn/lawrules/rule/allrules/bussiness/t20260424_620189.html', use: '创业板风险警示、退市与退市整理；不代替深市主板规则或通用交易时钟。' },
    { id: 59, authors: '北京证券交易所', year: '2026', accessedAt: '2026-08-29', title: '北京证券交易所股票上市规则', publication: '北证公告〔2026〕18号，2026-04-24发布并施行', url: 'https://www.bse.cn/cxjg_list/200028220.html', use: '北交所*ST、退市与15个交易日退市整理；不能套用沪深ST与*ST完整二分。' },
    { id: 60, authors: '中国证券监督管理委员会', year: '2022', accessedAt: '2026-08-29', title: '上市公司股票停复牌规则', publication: '证监会公告〔2022〕7号，2022-01-05公布并施行', url: 'https://www.csrc.gov.cn/csrc/c101954/c1719627/content.shtml', use: '停牌为例外、期限从短、分阶段披露和尽快复牌的上位规范；精确场景及时钟须看交易所指引。' },
    { id: 61, authors: '上海证券交易所', year: '2025', accessedAt: '2026-08-29', title: '上海证券交易所上市公司自律监管指引第4号——停复牌（2025年3月修订）', publication: '上证发〔2025〕42号，2025-03-28重新发布并施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/mainipo/c/c_20250516_10779127.shtml', use: '上交所停复牌原因、流程和期限；普通复牌本身不会自动取消涨跌幅限制。' },
    { id: 62, authors: '深圳证券交易所', year: '2025', accessedAt: '2026-08-29', title: '深圳证券交易所上市公司自律监管指引第6号——停复牌', publication: '深证上〔2025〕223号，2025-03-28重新发布', url: 'https://www.szse.cn/lawrules/rule/stock/t20250327_612560.html', use: '深市停复牌原因、流程和期限；不覆盖上交所或北交所，也不支持普通复牌首日自动无涨跌幅。' },
    { id: 63, authors: '上海证券交易所', year: '2025', accessedAt: '2026-08-29', title: '上海证券交易所上市公司证券发行与承销业务实施细则（2025年修订）', publication: '上证发〔2025〕47号，2025-03-28发布并施行', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/bond/convertible/issue/c/c_20250609_10781287.shtml', use: '配股认购不足70%等发行失败与承销处理；不直接给出全部除权公式，也不支持所有新增股份上市均不除权。' },
    { id: 64, authors: '上海证券交易所', year: '2025', accessedAt: '2026-08-29', title: '第五号 权益分派（2025年4月修订）', publication: '《上海证券交易所上市公司自律监管指南第2号——业务办理（2026年4月修订）》附件，上证函〔2026〕1445号当前发布入口，2026-04-24', url: 'https://www.sse.com.cn/lawandrules/guide/stock/zbxxpljg/ssgszljg/c/c_20260424_10816642.shtml', use: '差异化权益分派、回购专用账户股份不参与时的特别除权除息流程与公式；不覆盖每一种特殊公司行动。' },
    { id: 65, authors: '上海证券交易所', year: '2017', accessedAt: '2026-08-29', title: '关于上市公司破产重整中资本公积转增股本除权事项答记者问', publication: '上交所官方答记者问，2017-12-22', url: 'https://www.sse.com.cn/aboutus/mediacenter/hotandd/c/c_20171222_4438665.shtml', use: '破产重整资本公积转增在有对价或稀释差异时可申请调整参考价格公式；依个案，不是普遍不除权规则。' },
    { id: 66, authors: '北京证券交易所', year: '2023', accessedAt: '2026-08-29', title: '北京证券交易所投资者适当性管理办法', publication: '北证公告〔2023〕60号，2023-09-01发布并施行', url: 'https://www.bse.cn/jygl_list/200018386.html', use: '北交所个人准入通常为24个月交易经验及开通前20个交易日日均50万元资产；不能据此臆造更高的退市整理专门资产门槛。' },
    { id: 67, authors: '深圳证券交易所', year: '2026', accessedAt: '2026-08-29', title: '深圳证券交易所上市公司自律监管指南第1号——业务办理（2026年修订）', publication: '深证上〔2026〕134号，2026-01-30发布并施行', url: 'https://www.szse.cn/lawrules/service/share/t20260130_618824.html', use: '“向特定对象发行股票”部分要求上市公告书提示新增股份上市首日公司股价不除权、限售期自上市首日起算；不得外推为全部新增股份或全部交易所安排。' },
    { id: 68, authors: '上海证券交易所', year: '2026', accessedAt: '2026-08-29', title: '上海证券交易所科创板股票上市规则（2026年4月修订）', publication: '上证发〔2026〕43号，2026-04-24发布并施行（部分条款自2026-05-24施行，退市规则有衔接安排）', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/bond/convertible/listing/c/c_20260424_10817748.shtml', use: '科创板风险警示、重大违法与财务类退市及退市整理等专门规则；用于区分科创板同类证券不进入主板风险警示板，不能替代通用交易时钟。' },
    { id: 69, authors: '北京证券交易所', year: '2025', accessedAt: '2026-08-29', title: '北京证券交易所上市公司业务办理指南第1号——股票停复牌', publication: '北证公告〔2025〕21号，2025-04-25发布并施行', url: 'https://www.bse.cn/cxjg_list/200025668.html', use: '北交所停牌、复牌、变更停牌事项与延期复牌的办理时钟；应与上位上市规则和具体公司公告共同读取。' },
    { id: 70, authors: '上海证券交易所', year: '2020', accessedAt: '2026-08-29', title: '上海证券交易所交易型开放式指数基金业务实施细则（2020年第二次修订）', publication: '上证发〔2020〕88号，现行有效规则页', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/fund/trading/c/c_20250606_10781071.shtml', use: '一般代理券商申赎路径中的投资者主语、账户与申赎单位，以及股票ETF竞价买入份额、申购份额和组合证券的方向性当日用途；不外推到所有ETF或现金申赎路径。' },
    { id: 71, authors: '深圳证券交易所', year: '2022', accessedAt: '2026-08-29', title: '深圳证券交易所证券投资基金交易和申购赎回实施细则（2022年修订）', publication: '深证上〔2022〕559号，2022-06-10发布', url: 'https://docs.static.szse.cn/www/lawrules/rule/fund/W020220610536157903323.pdf', use: '深市基金申赎委托及单市场、跨市场股票ETF四向当日用途；通过登记结算机构等其他路径有不同交收边界。' },
    { id: 72, authors: '上海证券交易所', year: '2022', accessedAt: '2026-08-29', title: '2、ETF的交易机制', publication: '上交所ETF投资者教育，2022-06-23', url: 'https://etf.sse.com.cn/fund/learning/knowledge/c/5704300.shtml', use: '解释ETF一级与二级市场、代理券商和最小申赎单位，并说明通常参与一级申赎的可包括机构或资产规模较大的个人。' },
    { id: 73, authors: '上海证券交易所', year: '2020', accessedAt: '2026-08-29', title: '特定机构投资者参与证券投资基金申购赎回业务指引', publication: '上证发〔2020〕19号，现行有效规则页', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/fund/trading/c/c_20250609_10781318.shtml', use: '限定特定机构直接向基金管理人申赎的特殊路径；不能把该身份限制移植到投资者经代理券商办理的一般场内申赎。' },
    { id: 74, authors: '上海证券交易所', year: '2022', accessedAt: '2026-08-29', title: '8、ETF瞬时套利策略', publication: '上交所ETF投资者教育，2022-06-23', url: 'https://etf.sse.com.cn/fund/learning/strategy/c/5704303.shtml', use: 'ETF折溢价套利方向、IOPV、最小申赎单位、现金替代、交易及冲击成本；本节自定义NAV*仍不是法定净值或IOPV。' },
    { id: 75, authors: '中国证券监督管理委员会', year: '2015', accessedAt: '2026-08-29', title: '证券公司融资融券业务管理办法', publication: '证监会令第117号，2015-07-01公布并施行', url: 'https://www.csrc.gov.cn/csrc/c106256/c1654005/content.shtml', use: '融资融券定义、客户适当性、融券专用证券账户、标的范围、保证金以及交易所对证券种类和融券卖出价格的前端检查；具体交易参数仍须读交易所细则。' },
    { id: 76, authors: '深圳证券交易所投资者服务部', year: '2023', accessedAt: '2026-08-29', title: '新股上市后的前五个交易日，出现什么情形将导致盘中临时停牌？临时停牌时间为多长？', publication: '深交所投资者教育问答，2023-06-14', url: 'https://investor.szse.cn/index/update/t20230614_601141.html', use: '无价格涨跌幅限制股票先后触及30%与60%可各停一次；若直接达到或越过60%，该方向只实施一次临停且当日不再重复。' },
  ],
  readingList: [
    { title: '上交所 · 交易规则（2026年修订）', scope: '读 3.1、3.3、3.7、4.1、4.3、4.4 与科创板特别规定。', reason: '把交易日时钟、数量、价格范围、盘后固定价格、除权和风险警示放进同一正式规则版本。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/exchange/c/c_20260424_10816482.shtml' },
    { title: '深交所 · 交易规则（2026年修订）', scope: '读 3.1、3.3、3.6、4.2、4.4、4.5。', reason: '核对主板与创业板共同条文中的参数差异，并比较沪深盘后申报时钟。', url: 'https://docs.static.szse.cn/www/lawrules/rule/trade/current/W020260424690713155663.pdf' },
    { title: '北交所 · 交易规则（2026年）', scope: '读 3.1、3.3、3.7、4.3、4.5，并同时读公告中的暂缓条款。', reason: '训练“最新文本不等于全部条款已运行”的生效状态审计。', url: 'https://www.bse.cn/jygl_list/200028217.html' },
    { title: '中国结算深圳分公司 · 证券资金结算业务指南', scope: '读证券处理、可售交收锁定和资金批次。', reason: '把交易入口的可售资格与成交后的证券资金交收彻底分开。', url: 'https://www.chinaclear.cn/zdjs/szfgsgg/202607/88b2e21f07e1417da56150f04bcff839.shtml' },
    { title: 'HKEX · Stock Connect FAQ', scope: '读北向时钟、限价单、每日额度、持股上限、投资者资格和交易日历。', reason: '把沪深股通理解成有闸门的路由，而不是离岸复制的 A 股市场。', url: 'https://www.hkex.com.hk/-/media/HKEX-Market/Mutual-Market/Stock-Connect/Getting-Started/Information-Booklet-and-FAQ/FAQ/FAQ_En.pdf' },
    { title: 'HKEX · Trading Calendar Enhancement FAQ', scope: '读共同交易日、T+1 银行服务约束与 2023 改革。', reason: '理解接口开放为什么由两地市场与结算日历共同决定。', url: 'https://www.hkex.com.hk/-/media/HKEX-Market/Mutual-Market/Stock-Connect/Reference-Materials/Trading-Calendar-Enhancement-for-Stock-Connect/FAQ-for-Trading-Calendar-Enhancement-for-Stock-Connect.pdf' },
    { title: 'HKEX · 2024 Northbound Data Dissemination Adjustment', scope: '读实时成交额、额度显示和季度持股披露的分阶段变化。', reason: '避免把官方观察函数的改变误判为资金流结构突变。', url: 'https://www.hkex.com.hk/-/media/HKEX-Market/Services/Circulars-and-Notices/Participant-and-Members-Circulars/HKSCC/2024/ce_HKSCC_NOM_217_2024.pdf' },
    { title: '中国结算 · 2024年统计年报', scope: '读投资者数、账户、登记存管和结算统计口径。', reason: '练习区分投资者人数、账户数量、活跃成交与资产所有权。', url: 'https://m.chinaclear.cn/zdjs/tjnb/202506/542ecc4ea6e14595ac34be6843c7ebb5/files/2024%E5%B9%B4%E7%BB%9F%E8%AE%A1%E5%B9%B4%E6%8A%A5.pdf' },
    { title: '上交所 · ETF 相关常见问题', scope: '读二级买卖、一级申赎、交易单位与产品级 T+0。', reason: '纠正“所有 ETF 都可日内回转”，并建立一级—二级双层结构。', url: 'https://www.sse.com.cn/assortment/fund/etf/question/' },
    { title: '中金所 · 沪深300股指期货', scope: '读合约乘数、月份、交易时间、涨跌停、保证金与现金交割。', reason: '把指数观点转换成名义敞口，并看到保证金如何引入资金反馈。', url: 'https://www.cffex.com.cn/hs300/' },
    { title: '上交所 · 股票期权市场发展报告（2025）', scope: '读投资者类别、开平仓结构、交易目的和风险管理。', reason: '用产品级成交数据检验“账户很多就主导定价”的错误直觉。', url: 'https://www.sse.com.cn/aboutus/research/report/c/10814750/files/d1800de82bbe4613a2fe93e0853b7a3a.pdf' },
    { title: 'Li, Luo & Zhou (2021)', scope: '读上海 2018 收盘集合竞价 DID、成交迁移与收盘偏离。', reason: '理解基准价连续性改善为何不自动等于全天效率提高。', url: 'https://doi.org/10.1080/14697688.2020.1849782' },
    { title: 'Han et al. (2022)', scope: '读匹配沪深样本、15 分钟市场质量和异质性。', reason: '与 Li 等并读，训练对齐 outcome 后再判断文献是否矛盾。', url: 'https://doi.org/10.1016/j.pacfin.2022.101821' },
    { title: 'Chu, Goodell & Li (2024)', scope: '读隔夜与午休公告比较、开盘拍卖和 13:00 连续重开。', reason: '把交易时钟与信息时钟分离，并审计闭市长度和消息构成。', url: 'https://doi.org/10.1016/j.pacfin.2024.102577' },
    { title: 'Bian, Su & Wang (2022)', scope: '读股票与深度实值衍生品配对、日内不可出售折价。', reason: '观察 T+1 出售选择权怎样随剩余锁定时间衰减。', url: 'https://doi.org/10.1016/j.jempfin.2021.10.006' },
    { title: 'Qiao & Dam (2020)', scope: '读历史制度、多市场比较与开盘不可交易折价。', reason: '把隔夜收益连接到出售选择权，同时保留非随机比较边界。', url: 'https://doi.org/10.1016/j.finmar.2020.100534' },
    { title: 'Yang, Yang & Zhou (2012)', scope: '读中国现货与股指期货的日内价格发现和波动传递。', reason: '建立共同价格、领先—滞后与制度初期外推边界。', url: 'https://doi.org/10.1002/fut.20514' },
    { title: 'He et al. (2020)', scope: '读 2015 年股指期货成交量限制前后，现货—期货价格发现与溢出如何分阶段变化。', reason: '理解领导市场为何随流动性和交易约束改变，而不是永久排名。', url: 'https://doi.org/10.1080/14697688.2020.1814037' },
    { title: 'Xu et al. (2020) · Stock Connect', scope: '读沪港通与市场质量的准实验设计。', reason: '审计合资格选择、平行趋势和通道开放的因果边界。', url: 'https://doi.org/10.1111/jfir.12210' },
    { title: 'Bian et al. (2023) · Cross-border Flows', scope: '读北向跨境流、价格和信息传播。', reason: '区分通道流量、库存变化与最终主体，避免“聪明外资”标签。', url: 'https://doi.org/10.1016/j.intfin.2023.101755' },
    { title: 'He et al. (2019) · Trading Suspensions', scope: '读 36,544 次停牌事件的停牌前趋势与复牌释放。', reason: '理解事件路径，同时看到停牌选择内生为何阻止简单因果。', url: 'https://doi.org/10.1016/j.najef.2019.100985' },
    { title: 'Liu, Trzcinka & Zhao (2026)', scope: '读长期停牌选择、信号质量与资本成本估计。', reason: '看到短期信息成分改善和长期不可交易成本可以同时存在。', url: 'https://doi.org/10.1016/j.finmar.2025.101007' },
    { title: 'Yang & Zhao (2026) · Delisting Reform', scope: '读壳价值、披露质量、投资者监督和正式调查。', reason: '理解更严退出为什么不自动带来更好的信息环境。', url: 'https://doi.org/10.1016/j.jcae.2026.100546' },
    { title: 'Titman, Wei & Zhao (2022)', scope: '读送转公告、账户交易与长期反转，并审计“可疑”代理。', reason: '把机械除权、投资者注意和监管认定三件事分开。', url: 'https://doi.org/10.1016/j.jfineco.2021.09.018' },
    { title: '上交所 · ETF 业务实施细则', scope: '重点读申购赎回参与主体、最小申赎单位，以及份额与组合证券的四向当日用途。', reason: '把一级申赎资格、转换路径与纯二级市场 T+0 三件事分开。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/fund/trading/c/c_20250606_10781071.shtml' },
    { title: '深交所 · 基金交易和申购赎回实施细则', scope: '对照单市场、跨市场股票 ETF 与其他基金的交易、申赎及交收边界。', reason: '检验上交所路径能否外推，并识别登记结算路径差异。', url: 'https://docs.static.szse.cn/www/lawrules/rule/fund/W020220610536157903323.pdf' },
    { title: '上交所 · ETF 瞬时套利策略', scope: '读 IOPV、折溢价方向、最小申赎单位、现金替代及冲击成本。', reason: '把屏幕价差改写为扣除执行成本后才可能兑现的套利边际。', url: 'https://etf.sse.com.cn/fund/learning/strategy/c/5704303.shtml' },
    { title: '上交所 · 股票上市规则（2026年修订）', scope: '读风险警示、退市决定、退市整理期与投资者适当性相关条款。', reason: '用正式上市规则重建公司状态，而不是把 ST、停牌和退市压成一个标签。', url: 'https://www.sse.com.cn/lawandrules/sselawsrules2025/stocks/mainipo/c/c_20260424_10816589.shtml' },
    { title: '深交所 · 股票上市规则（2026年修订）', scope: '读主板风险警示、终止上市与退市整理，并与创业板专门规则交叉核对。', reason: '训练按交易所与板块保存规则版本，避免把沪深参数永久合并。', url: 'https://www.szse.cn/lawrules/rule/allrules/bussiness/t20260424_620193.html' },
    { title: '北交所 · 股票上市规则（2026年）', scope: '读 *ST、终止上市与十五个交易日退市整理的专门安排。', reason: '理解北交所公司状态不能照搬沪深 ST 与 *ST 的完整二分。', url: 'https://www.bse.cn/cxjg_list/200028220.html' },
    { title: '证监会 · 上市公司股票停复牌规则', scope: '读持续交易原则、停牌例外、期限从短与分阶段披露。', reason: '先掌握上位规范，再进入交易所场景和具体公司公告。', url: 'https://www.csrc.gov.cn/csrc/c101954/c1719627/content.shtml' },
    { title: '上交所 · 权益分派业务指南', scope: '读差异化分红、回购专户不参与与特别除权除息公式。', reason: '看到通用参考价公式之外，公司行动何时必须使用专门口径。', url: 'https://www.sse.com.cn/lawandrules/guide/stock/zbxxpljg/ssgszljg/c/c_20260424_10816642.shtml' },
    { title: '证监会 · 融资融券业务管理办法', scope: '读第 2、10–18、24–27、36–38 条，区分券源、标的、担保与交易所前端检查。', reason: '用上位规则说明为何融券不是无券卖空，也不因转融券暂停而整体消失。', url: 'https://www.csrc.gov.cn/csrc/c106256/c1654005/content.shtml' },
    { title: '深交所 · 无价格限制股票临停问答', scope: '读 30% / 60% 分档触发、直接越过 60% 与全日最多停牌次数。', reason: '补足正式规则列出阈值但未显式展开的跳跃路径。', url: 'https://investor.szse.cn/index/update/t20230614_601141.html' },
  ],
};

function referencesFor(order: readonly number[]): LessonReference[] {
  return order.map((sourceId, index) => {
    const source = lesson126Base.references.find((reference) => reference.id === sourceId);
    if (!source) throw new Error(`Missing source ${sourceId} in lesson 1.26 source library.`);
    return { ...source, id: index + 1 };
  });
}

const READING_TITLES_A = new Set<string>([
  '上交所 · 交易规则（2026年修订）',
  '深交所 · 交易规则（2026年修订）',
  '北交所 · 交易规则（2026年）',
  '中国结算深圳分公司 · 证券资金结算业务指南',
  '上交所 · ETF 相关常见问题',
  '证监会 · 融资融券业务管理办法',
  '深交所 · 无价格限制股票临停问答',
  'Li, Luo & Zhou (2021)',
  'Han et al. (2022)',
  'Chu, Goodell & Li (2024)',
  'Bian, Su & Wang (2022)',
  'Qiao & Dam (2020)',
]);

const READING_TITLES_B = new Set<string>([
  '上交所 · 交易规则（2026年修订）',
  '深交所 · 交易规则（2026年修订）',
  '北交所 · 交易规则（2026年）',
  'HKEX · Stock Connect FAQ',
  'HKEX · Trading Calendar Enhancement FAQ',
  'HKEX · 2024 Northbound Data Dissemination Adjustment',
  '中国结算 · 2024年统计年报',
  '上交所 · ETF 相关常见问题',
  '中金所 · 沪深300股指期货',
  '上交所 · 股票期权市场发展报告（2025）',
  'Li, Luo & Zhou (2021)',
  'Han et al. (2022)',
  'Yang, Yang & Zhou (2012)',
  'He et al. (2020)',
  'Xu et al. (2020) · Stock Connect',
  'Bian et al. (2023) · Cross-border Flows',
  'He et al. (2019) · Trading Suspensions',
  'Liu, Trzcinka & Zhao (2026)',
  'Yang & Zhao (2026) · Delisting Reform',
  'Titman, Wei & Zhao (2022)',
  '上交所 · ETF 业务实施细则',
  '深交所 · 基金交易和申购赎回实施细则',
  '上交所 · ETF 瞬时套利策略',
  '上交所 · 股票上市规则（2026年修订）',
  '深交所 · 股票上市规则（2026年修订）',
  '北交所 · 股票上市规则（2026年）',
  '证监会 · 上市公司股票停复牌规则',
  '上交所 · 权益分派业务指南',
]);

function readingListFor(titles: Set<string>) {
  return lesson126Base.readingList.filter((item) => titles.has(item.title));
}

export const lesson126A: LessonRecord = {
  ...lesson126Base,
  slug: '1-26',
  id: '1.26A',
  title: 'A 股特有微观结构（上）：交易时钟、价格边界与库存约束',
  subtitle: '用“状态依赖的可交易性”重建沪深北交易时钟、订单资格、价格边界、T+1 可售库存、融资融券与多空表达不对称',
  readingTime: '主线首读约 75–90 分钟；含公式复算与诊断约 95–110 分钟',
  prerequisite: '硬先修：1.02 · Market Architecture；按需回看：1.04、1.17、1.19–1.25',
  revision: '1.26A-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.26A-r1',
      summary: '首轮教学终审确认五维状态主线、时长、诊断和认知坡度成立；要求统一首页先修口径，并补齐最小价位与交收失败的首次中文桥接。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.26A-r1',
      summary: '首轮准确性终审核对现行规则、公式和实验答案无实质错误；要求为融券操作条件及无日限价股票直接越过60%的临停路径补充就近一手来源。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.26A-r2',
      summary: '回归教学终审确认先修口径、实验命名、首次术语桥和跨页导航全部闭环；00–24的认知坡度、主线时长、公式解释、诊断与延伸阅读达到出版要求，无P0/P1/P2/P3。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.26A-r2',
      summary: '回归准确性终审确认临停跳跃路径与融券操作条件均有就近一手来源，23条书目、78个引文、规则、公式和实验答案无回归，无P0/P1/P2/P3。',
    },
  ],
  previous: { slug: '1-25', label: '1.25 Circuit Breaker、Price Limit 与 T+1' },
  next: { slug: '1-26b', label: '1.26B 产品、跨境、公司状态与研究' },
  sections: lesson126Base.sections.slice(0, 25),
  Content: Lesson126AContent,
  references: referencesFor(SOURCE_ORDER_A),
  readingList: readingListFor(READING_TITLES_A),
};

export const lesson126B: LessonRecord = {
  ...lesson126Base,
  slug: '1-26b',
  id: '1.26B',
  title: 'A 股特有微观结构（下）：产品、跨境、公司状态与可证伪研究',
  subtitle: '沿五维状态机连接 ETF、股指期货与期权、沪深股通、投资者身份、风险警示、停复牌、退市整理、公司行动和实证研究',
  readingTime: '主线首读约 70–85 分钟；含互动实验与练习约 85–105 分钟',
  prerequisite: '1.26A；按需回看：1.21–1.24',
  revision: '1.26B-r2',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '1.26B-r1',
      summary: '首轮教学终审确认跨产品—跨境—公司状态主线、互动、练习和时长成立；要求统一先修口径，消除实验Mode A/B与上下篇命名冲突，并补足实证术语和回链。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.26B-r1',
      summary: '首轮准确性终审确认2026规则快照、ETF四向用途、股通、公司状态、公式、练习及八题实验均准确，60条页内来源连续可追溯，无必改事实问题。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.26B-r2',
      summary: '回归教学终审确认模式一/二与上下篇不再混淆，先修、实证术语和回链完整；25–49主线、互动、练习、检查、无障碍状态与深读路线均达到出版要求，无P0/P1/P2/P3。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '1.26B-r2',
      summary: '回归准确性终审确认2026规则快照、ETF与跨境接口、公司状态、60条书目、114个引文、六道练习及八题实验无事实或计算回归，无P0/P1/P2/P3。',
    },
  ],
  previous: { slug: '1-26', label: '1.26A 交易时钟、价格边界与库存约束' },
  next: { slug: '2-01', label: '2.01 Heterogeneous Agent Framework' },
  sectionNumberStart: 25,
  sections: lesson126Base.sections.slice(25),
  Content: Lesson126BContent,
  references: referencesFor(SOURCE_ORDER_B),
  readingList: readingListFor(READING_TITLES_B),
};
