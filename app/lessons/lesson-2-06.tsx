import BankIntermediaryLab from '../components/BankIntermediaryLab';
import { bankScenarios } from '../components/bankIntermediaryScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson206Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>银行的特殊性不在于“手里有很多钱”，而在于它同时创造支付性负债、持有不透明信用资产，并用很薄的资本与有限的即时流动性承接两者之间的风险。</h2>
        <p>
          把银行描述成“吸收储户的钱，再把这些钱借给企业”的资金仓库，会遗漏贷款与存款的同时生成；把银行描述成“凭空印钱”的无限主体，又会删除结算、融资、资本、流动性、信用质量、盈利与法律责任。更准确的起点是：银行取得贷款、证券等资产，同时发行按面值兑付、承担支付功能并可能随时流出的存款负债；股东资本吸收资产损失，准备金和可变现资产支持付款，稳定融资覆盖较长期限的资产。贷款发放可以在同一笔记账中创造存款，却不会同时创造资本、合格抵押品或可信借款人。<Cite n={1} /><Cite n={2} /><Cite n={24} /><Cite n={69} />
        </p>
        <p>
          这组结构使银行既能创造社会需要的流动性，也天然脆弱：资产价值下降会先侵蚀薄股本；存款流失会把多年期贷款变成今日必须筹到的结算资金；卖出资产虽然带来现金，却可能实现损失并使资本约束更紧。Diamond–Dybvig 的流动性转换模型、委托监督理论以及 2023 年银行动荡的官方复盘，分别解释了这种结构为什么有社会价值、集中监督为何可能节省重复成本、以及数字化高速流出如何把久期、集中度、治理和操作准备连接成危机。它们互补，却不能被压缩成“所有挤兑都是纯恐慌”或“所有银行都因债券亏损而失败”。<Cite n={22} /><Cite n={23} /><Cite n={54} /><Cite n={56} />
        </p>
        <p>
          本节因此只追踪一条主线：<b>贷款、违约、利率或存款冲击怎样改变银行的账本；资本率、杠杆率、短期流动性和稳定融资怎样从同一账本读取不同约束；最先变紧的一项又怎样生成贷款标准、融资、证券买卖、对冲、资本补充或处置动作，并通过信用、价格与信心回写下一轮资产负债表。</b>
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>银行决策不是“预测收益以后买资产”，而是从合同和双重记账出发，在多重约束下选择下一步可执行动作。</h2>
        <div className="mechanism-chain" aria-label="银行从信用合同到市场反馈的七步因果链">
          <div><span>01</span><b>筛选与承诺</b><p>借款需求经过信息生产、担保、定价和审批，形成贷款或授信承诺。</p></div>
          <div><span>02</span><b>双边入账</b><p>贷款提款若先记入本行账户，会增加贷款资产和客户存款负债，不自动增加资本或准备金。</p></div>
          <div><span>03</span><b>支付与结算</b><p>支出与提现迁移或转换存款和准备金；本金偿还则收缩贷款，并依付款来源改变存款或准备金。</p></div>
          <div><span>04</span><b>冲击重估</b><p>违约、利率、流失、haircut 和融资成本改变资产、收益与现金。</p></div>
          <div><span>05</span><b>读取约束</b><p>资本、RWA、杠杆、LCR、NSFR、抵押品和内部缓冲分别更新。</p></div>
          <div><span>06</span><b>选择动作</b><p>银行调整贷款、存款价格、融资、证券、对冲、分红或资本。</p></div>
          <div><span>07</span><b>反馈重写</b><p>信用条件和市场订单改变借款人、价格、存款信心与下一轮账本。</p></div>
        </div>
        <p>
          中介资产定价模型把第七步正式化：当银行和其他中介的净值下降，约束的影子成本上升，承接风险资产所要求的回报也会上升；价格下跌又继续削弱共同持仓者。不过这是结构模型与教学压缩，不是对任一市场的固定系数。银行还可能在资本和融资充足时买入被迫出售的证券，因此同一价格下跌的订单方向必须由冲击前状态决定。<Cite n={39} /><Cite n={40} /><Cite n={51} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与术语桥</p>
        <h2>本节建立“单家银行从账本到动作”的共同语言；完整货币创造、贷款渠道和系统性杠杆循环留给后续章节。</h2>
        <p>
          硬先修是 T06 的资产负债表；建议按需回看 T02 的折现、1.20 的保证金与强制平仓、2.01 的状态—目标—约束—订单，以及 2.05 对资本和流动性分账的处理。本节只用一个币种、一个国内支付体系和冻结教学参数。3.09 将把贷款—存款机制放入宏观货币总量，3.10–3.12 处理货币政策、抵押品和风险承担渠道，4.06 处理跨境银行，7.11–7.14 才把多家机构聚合成流动性螺旋与杠杆周期。
        </p>
        <div className="learning-objectives">
          <span>七阶段学习路线 · 从法律主体到可证伪订单</span>
          <ol>
            <li><b>主体与账本（03–09）：</b>分开银行法人、集团、业务部门，以及资产、负债、权益、存量和流量。</li>
            <li><b>贷款与结算（10–16）：</b>用 T-account 连接贷款、存款、跨行准备金、偿还和违约。</li>
            <li><b>资本与杠杆（17–24）：</b>分开经济损失、监管资本、RWA、非风险加权暴露和缓冲。</li>
            <li><b>流动性与稳定融资（25–33）：</b>建立准备金、HQLA、LCR、NSFR 与抵押品瀑布。</li>
            <li><b>信用、利率与融资冲击（34–41）：</b>分开 NII、EVE、拨备、存款与批发融资时钟。</li>
            <li><b>动作与反馈（42–49）：</b>把最紧约束变成贷款价格/数量、融资、证券订单和局部反馈。</li>
            <li><b>实验与研究（50–55）：</b>用十题压力账本、静态变式和识别协议形成可操作诊断。</li>
          </ol>
          <p><b>时间预算：</b>核心阅读约 100–120 分钟；互动实验快速 25–30 分钟，含完整复盘 45–55 分钟；主动练习核对 25–30 分钟，完整书写 45–60 分钟；理解检查快速 10–12 分钟，完整复述 18–22 分钟；接口约 4 分钟。建议分两至三次完成，参考文献与延伸阅读不计。</p>
          <p><b>账本术语：</b>贷款是银行资产，因为借款人欠银行钱；存款是银行负债，因为银行欠存款人可支付的金额；准备金是商业银行对中央银行的资产；权益是资产减负债后的残余损失吸收层，不是一只现金口袋；T-account 是把一个事件对资产、负债与权益的同步变化列在两侧；结算是支付最终在银行之间转移准备金或其他结算资产。</p>
          <p><b>约束术语：</b>RWA 是把暴露按适用规则转换成风险加权资产；CET1 ratio 比较高质量资本与 RWA；Basel leverage ratio 用 Tier 1 资本除以不依赖风险权重的暴露；HQLA 是压力下可被认可并可操作变现的高质量流动资产；LCR 比较 HQLA 与 30 日净现金流出；ASF、RSF 与 NSFR 比较可用稳定融资和资产所需稳定融资；runoff 是压力窗口中的负债流出；encumbrance 表示资产已被占用；NII 是期间净利息收入，EVE 是经济价值视角。</p>
          <p><b>三条防误读：</b>贷款创造存款，不创造资本；存款是银行融资负债，不是库房里的现金资产；资本充足、今日流动性充足和长期稳定融资充足，是三个不同问题。</p>
        </div>
      </section>

      <section className="lesson-section" id="bank-charter-promise">
        <p className="section-kicker">阶段一 · 主体与账本　|　03 · 银行牌照与承诺</p>
        <h2>分析“银行”之前，先冻结持牌法人、银行集团和控股公司；它们不能被当作一个可以自由搬钱的钱包。</h2>
        <p>
          存款合同把银行置于支付链条中：银行欠存款人按约可支取的法定请求权，同时通过贷款合同取得对借款人的债权。在满足各制度的对象、资格与准入条件时，银行牌照及相关授权把这种私人合约连接到审慎监管、支付系统、存款保险、央行流动性与失败处置，因此银行负债与基金份额、保险保单或普通公司债不能只按“都是融资”处理。BCBS 标准本身没有超国家法律效力，必须由各法域实施；中国现行商业银行法、美国资本规则与欧盟审慎法规的主体和适用范围也不相同。<Cite n={5} /><Cite n={6} /><Cite n={7} /><Cite n={20} /><Cite n={71} />
        </p>
        <p>
          分行通常不是独立法人，子公司通常是；solo supervision 读取单个受监管主体，consolidated supervision 则观察集团内风险、资本与关联交易。研究集团合并报表时，集团内部头寸可能抵销；研究某一存款行能否今日付款时，又必须回到法律实体、币种、抵押品所在地和可转移性。法律上属于同一集团，不代表现金可以无条件跨实体、跨境或跨币种移动。<Cite n={72} />
        </p>
      </section>

      <section className="lesson-section" id="actor-map">
        <p className="section-kicker">04 · 主体地图</p>
        <h2>承销信用、管理资产负债表、执行交易、提供结算与决定监管行动，通常由不同主体完成。</h2>
        <div className="table-scroll" role="region" aria-label="银行主体与职责地图，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">借款人、存款人、股东、银行部门、监管者与中央银行的分工</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">核心状态或责任</th><th scope="col">怎样进入动作</th></tr></thead>
            <tbody>
              <tr><th scope="row">Borrower / 借款人</th><td>偿债现金流、抵押品、信用额度与信息</td><td>需求、提款、还款、违约改变贷款与承诺</td></tr>
              <tr><th scope="row">Depositor / 存款人</th><td>对银行的支付请求权与保险覆盖</td><td>支付、提现、迁移和利率敏感性改变融资</td></tr>
              <tr><th scope="row">Shareholder / 股东</th><td>残余请求权与第一损失层</td><td>增资、分红和治理影响资本缓冲</td></tr>
              <tr><th scope="row">Credit / 贷款部门</th><td>承销、定价、限额与客户关系</td><td>调整审批、利率、期限、担保和数量</td></tr>
              <tr><th scope="row">Treasury / ALCO</th><td>资金、流动性、利率、币种与抵押品</td><td>安排存款、批发融资、证券、回购和对冲</td></tr>
              <tr><th scope="row">Regulator / resolution authority</th><td>审慎规则、监督、早期干预与处置</td><td>改变缓冲、分配限制、恢复或处置路径</td></tr>
              <tr><th scope="row">Central bank / payment system</th><td>结算资产、货币政策与合格流动性工具</td><td>影响准备金、融资价格、抵押条件和时钟</td></tr>
            </tbody>
          </table>
        </div>
        <p>董事会批准风险偏好，贷款部门可能希望保留客户，Treasury 可能优先保现金，交易台执行证券订单，监管者又可能要求更快修复。把它们压成一个“银行观点”会把内部约束冲突误写成价格预测。</p>
      </section>

      <section className="lesson-section" id="balance-sheet-identity">
        <p className="section-kicker">05 · 资产负债表恒等式</p>
        <h2>任何银行故事都必须先配平：资产来自负债或权益融资，损失则穿过资产端进入残余权益。</h2>
        <div className="equation-card">
          <span>会计恒等式 · 某一日期、某一口径</span>
          <div>A = L + E</div>
          <p>A 是资产，L 是负债，E 是权益，单位都是货币金额。权益不是一项放在左侧的资产，而是全部资产减去应偿负债后的残余。若资产损失 ℓ 且负债金额不变，E′=E−ℓ。</p>
        </div>
        <p>
          恒等式不会告诉你资产是否按公允价值、摊余成本或其他口径计量，也不会告诉你某项权益能否计入监管资本。它只强迫分析保持双边一致：新增存款必定对应资产或其他用途，支付必定改变某些主体的资产与负债，确认损失不能只在叙事中出现而不落入权益。
        </p>
      </section>

      <section className="lesson-section" id="t-account-reading">
        <p className="section-kicker">06 · T-account 的阅读方法</p>
        <h2>T-account 不是会计术语考试，而是一种防止漏掉交易另一面的因果工具。</h2>
        <div className="table-scroll" role="region" aria-label="贷款发放 T-account，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">本行向客户发放一百单位贷款并记入其存款后的双边变化</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">资产变化</th><th scope="col">负债或权益变化</th><th scope="col">这一时点没有发生</th></tr></thead>
            <tbody>
              <tr><th scope="row">银行</th><td>贷款 +100</td><td>客户存款 +100</td><td>资本没有 +100；准备金未必变化</td></tr>
              <tr><th scope="row">借款人</th><td>银行存款 +100</td><td>欠银行贷款 +100</td><td>净财富不会因借款本金自动增加</td></tr>
            </tbody>
          </table>
        </div>
        <p>每分析一个事件，依次问：哪些法律请求权新增或消失？哪一方把它记作资产，哪一方记作负债？是否产生收入、费用或损失？是否已经付款和结算？这样就不会把贷款审批、实际提款、借款人支出、贷款偿还和信用核销写成同一动作。</p>
      </section>

      <section className="lesson-section" id="asset-liability-equity">
        <p className="section-kicker">07 · 三类账本项目</p>
        <h2>准备金、证券和贷款位于资产端；存款、回购与债券位于负债端；资本回答谁吸收损失，而不是今天能付多少现金。</h2>
        <div className="table-scroll" role="region" aria-label="银行资产负债表项目，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">银行资产、负债、权益及其主要风险</caption>
            <thead><tr><th scope="col">层</th><th scope="col">典型项目</th><th scope="col">首先暴露的风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">资产</th><td>央行准备金、库存现金、政府/信用证券、贷款、逆回购、衍生品正价值</td><td>信用、利率、市场、流动性、对手方</td></tr>
              <tr><th scope="row">负债</th><td>活期/定期存款、同业、回购、存单、债券、央行借款、衍生品负价值</td><td>流失、到期展期、利率、抵押品与结算</td></tr>
              <tr><th scope="row">权益/资本</th><td>普通股、留存收益及符合规则的资本工具</td><td>吸收损失、分配限制、市场融资与控制权</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          增发普通股会增加一种融资来源，收到的资金可以表现为准备金并随后投入贷款；要求银行多持资本，不等于要求它把同额现金闲置在金库。反过来，银行可以持有大量准备金却只有很薄权益，因此“流动”不自动等于“有偿付能力”。<Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="stock-flow-valuation">
        <p className="section-kicker">08 · 存量、流量与估值</p>
        <h2>期末余额变化可能来自新交易、偿还、应计利息、汇率、公允价值、减值或分类变化，不能直接读取为银行主动订单。</h2>
        <p>
          贷款余额下降可能因为银行拒绝续作，也可能因为客户正常还款、核销、出售、证券化或汇率变化；证券余额上升可能是买入，也可能是价格上涨。研究必须建立桥表：期初存量 + 新增/买入 − 到期/偿还/出售 − 核销 ± 估值与汇率 = 期末存量。只有把非交易项剔除，持仓变化才可能接近母订单。
        </p>
        <p>
          会计分类还会改变变化进入损益、其他综合收益或附注的位置。IFRS 9 与中国企业会计准则第 22 号根据业务模式和合同现金流特征区分摊余成本、公允价值计入其他综合收益和公允价值计入损益；这些分类不等同于美国 HTM/AFS 标签，也不消除经济价值与可抵押价值变化。<Cite n={63} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="bank-versus-other-intermediaries">
        <p className="section-kicker">09 · 与其他机构的边界</p>
        <h2>银行、基金、保险、养老金与券商都管理资产负债表，但它们承诺的支付单位、风险承担者和最紧时钟不同。</h2>
        <div className="table-scroll" role="region" aria-label="银行与其他金融机构边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">不同机构的负债承诺和约束边界</caption>
            <thead><tr><th scope="col">机构</th><th scope="col">对外承诺</th><th scope="col">本节不能共用的模型</th></tr></thead>
            <tbody>
              <tr><th scope="row">存款银行</th><td>按面值支付存款、参与结算并持有贷款</td><td>资本、准备金、存款流失与信用创造</td></tr>
              <tr><th scope="row">开放式基金</th><td>按 NAV 赎回份额，投资者承担市值结果</td><td>赎回、NAV 稀释与先动优势留给 2.17</td></tr>
              <tr><th scope="row">养老金/保险</th><td>待遇或保单承诺，或账户型结果</td><td>精算负债、sponsor covenant 与偿付能力见 2.05</td></tr>
              <tr><th scope="row">Broker–dealer</th><td>证券融资、客户保证金与交易履约</td><td>库存、prime brokerage 与 dealer repo 链留给 2.07</td></tr>
            </tbody>
          </table>
        </div>
        <p>Adrian–Shin 的顺周期杠杆证据最强地来自按市值计价、依赖批发融资的 broker–dealer；不能把“恒定目标杠杆”无条件套给所有商业银行。2.06 只保留银行证券与融资接口，下一节再处理 dealer 的库存和市场流动性。<Cite n={38} /></p>
      </section>

      <section className="lesson-section" id="loan-origination">
        <p className="section-kicker">阶段二 · 贷款、存款与结算　|　10 · 贷款形成</p>
        <h2>贷款首先是一份经过筛选、定价和授权的信用合同；批准额度、承诺额度与实际提款不是同一个存量。</h2>
        <p>
          银行需要判断借款人的现金流、信息可信度、担保、期限、行业集中度和违约后回收，再决定价格、契约与额度。Diamond 的委托监督模型解释了为什么由一个中介集中监督可以避免众多资金提供者重复付费；Holmström–Tirole 则说明中介与借款人的资本状态共同决定可融资项目。但模型中的“资本”是特定激励资源，不能逐字等同于当前 CET1。<Cite n={23} /><Cite n={28} />
        </p>
        <p>
          一份尚未提款的授信额度可能没有形成贷款资产或客户存款，却已产生法律承诺、未来流动性需要和表外资本占用。研究贷款供给时，审批、提款、余额、到期续作和违约必须分开；只看期末余额会把需求、供给和合同执行混在一起。
        </p>
      </section>

      <section className="lesson-section" id="loan-creates-deposit">
        <p className="section-kicker">11 · 贷款创造存款</p>
        <h2>实际发放并记入本行账户时，银行同时增加贷款资产与客户存款负债；它不需要先从某位储户那里找到一笔逐项匹配的钱。</h2>
        <div className="equation-card">
          <span>同行内发放金额 Q 的最小分录</span>
          <div>ΔLoans = +Q；ΔDeposits = +Q；ΔEquity = 0</div>
          <p>银行规模扩大 Q，但初始资本不变，因此资本和杠杆余量会改变。这个最小分录假定贷款先记入本行账户，并忽略手续费、日一预期信用损失、税和其他初始计量或监管调整；它没有自动增加准备金，准备金问题在借款人付款、银行间结算和流动性管理时出现。</p>
        </div>
        <p>
          英格兰银行和德国央行都用现代双重记账纠正“银行只是把既有存款转借出去”和“先有超额准备金、再机械倍增贷款”的简单图像。同时，两者也明确指出贷款仍受信用需求、风险、资本、融资成本和货币政策约束。把第一句引用出来、删除第二句，便会从一个误区跳到“无限创造”的另一个误区。<Cite n={1} /><Cite n={2} />
        </p>
      </section>

      <section className="lesson-section" id="borrower-spending">
        <p className="section-kicker">12 · 借款人支出</p>
        <h2>借款人花掉存款，不等于偿还贷款；资产用途和融资合同是两条不同的账。</h2>
        <p>
          若借款人支付给本行另一客户，银行总存款不变，只是负债在两个客户账户间重新分配；贷款仍留在资产端。若支付给他行客户，付款行存款与准备金同时减少，收款行存款与准备金同时增加。只有借款人向贷款行偿还本金，贷款资产和存款负债才会同时缩小。<Cite n={1} />
        </p>
        <p>这一区分解释了为什么“贷款创造的存款很快离开原银行”不等于整个银行体系的存款已经消失。存款可以迁移，原贷款却固定在发放行，迫使单家银行通过吸收存款、同业融资、回购、证券出售或央行工具补足结算资产。借款人用贷款行内存款偿还本金时，该行贷款和存款一起减少；若资金从他行汇入偿还，贷款行的贷款减少、准备金增加，而付款行的存款和准备金减少。两种路径都降低贷款本金，却留下不同的单家银行流动性结果。</p>
      </section>

      <section className="lesson-section" id="interbank-settlement">
        <p className="section-kicker">13 · 跨行结算</p>
        <h2>商业银行存款为公众提供支付，银行之间则用准备金或其他认可结算资产完成最终转移。</h2>
        <div className="table-scroll" role="region" aria-label="跨行支付的两家银行 T-account，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">客户跨行支付一百单位时付款行与收款行的变化</caption>
            <thead><tr><th scope="col">银行</th><th scope="col">资产变化</th><th scope="col">负债变化</th><th scope="col">保持不变</th></tr></thead>
            <tbody>
              <tr><th scope="row">付款行 A</th><td>准备金 −100</td><td>付款人存款 −100</td><td>A 对借款人的贷款</td></tr>
              <tr><th scope="row">收款行 B</th><td>准备金 +100</td><td>收款人存款 +100</td><td>B 的初始贷款</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          公众通常不能直接持有商业银行在央行的准备金账户；现金、准备金与银行存款由不同发行主体承担。支付基础设施原则强调以中央银行货币最终结算可降低结算资产发行人的信用和流动性风险，但各国账户准入和制度安排不同，不能把某一央行操作框架当成全球法律。<Cite n={3} /><Cite n={4} />
        </p>
      </section>

      <section className="lesson-section" id="cash-withdrawal">
        <p className="section-kicker">14 · 现金提取</p>
        <h2>提现把银行对客户的存款负债转换为交付现金的即时义务；它减少的是流动资产和存款，而不是贷款本金。</h2>
        <p>
          客户提取 10 现金时，银行库存现金减少 10，客户存款负债也减少 10；若库存不足，银行需要用准备金换取现金或安排其他流动性。账户从活期转定期可能改变流失时钟，却未必改变银行总负债。数字化转账比实体提现更快地迁移存款，这使“30 日标准化压力”和“数小时实际支付”必须并列观察。
        </p>
        <p>存款保险保护的是法定范围内对投保机构的存款请求权，而不是所有在银行渠道销售的产品。美国、欧盟和中国的覆盖单位、限额与所有权/账户聚合规则不同；它通过降低受保范围内的预期损失，可能降低部分储户的提款激励，却不会保证未保险、大额、集中或操作性现金流不会迁移。<Cite n={22} /><Cite n={59} /><Cite n={60} /><Cite n={61} /><Cite n={62} /></p>
        <p>欧盟 2026 年修法已于 5 月 10 日生效；成员国须最迟于 2028 年 5 月 11 日采用并公布转置措施，并自该日起适用，其中指定预防措施规则自 2029 年 5 月 11 日适用。因此“指令已生效”“成员国完成转置”和“新规则开始适用”必须分开。<Cite n={83} /></p>
      </section>

      <section className="lesson-section" id="repayment-default-writeoff">
        <p className="section-kicker">15 · 偿还、违约、拨备与核销</p>
        <h2>本金偿还收缩贷款与存款；利息影响收入；预期损失、违约和核销则沿不同时间进入利润、权益与监管资本。</h2>
        <p>
          客户用本行存款偿还本金 P 时，贷款资产与存款负债同时减少 P，因此相关存款货币被消灭。支付利息主要是客户向银行的收入转移；扣除存款成本、批发融资、运营费用、减值、税和分配后，净利润才可能增加留存收益。违约只是合同未履行状态，回收仍可能发生；拨备是对损失的会计确认，核销则把不可回收余额移出账面。<Cite n={1} /><Cite n={63} /><Cite n={64} />
        </p>
        <div className="equation-card">
          <span>单期信用损失的教学分解</span>
          <div>EL ≈ PD × LGD × EAD</div>
          <p>PD 是违约概率，LGD 是违约后的损失比例，EAD 是违约时敞口。它帮助定位风险来自概率、回收还是余额，但不是 IFRS 9 ECL、美国 CECL 或 Basel 内部评级法的完整法定公式。<Cite n={63} /><Cite n={64} /><Cite n={77} /></p>
        </div>
      </section>

      <section className="lesson-section" id="bank-system-boundary">
        <p className="section-kicker">16 · 单家银行与银行体系</p>
        <h2>体系层面新增贷款通常伴随新增存款；单家银行却可能同时失去全部新增存款并留下贷款与融资任务。</h2>
        <p>
          这是理解银行的关键尺度切换。宏观层面问总贷款、总存款、现金、准备金和央行操作怎样共同变化；微观层面问哪家银行持有贷款、哪家银行取得存款、谁要支付准备金、谁拥有融资与资本余量。本节只建立静态两行 T-account，完整货币总量、央行准备金供给、货币政策与内生反馈留给 3.09。<Cite n={1} /><Cite n={2} />
        </p>
        <p>“银行体系不需要先有逐笔存款”不能推成“任一银行不需要融资”；“单家银行需要吸收存款”也不能反推“贷款只是把已有存款转手”。两个命题位于不同聚合层级，只有同时保留才不矛盾。</p>
      </section>

      <section className="lesson-section" id="equity-loss-absorption">
        <p className="section-kicker">阶段三 · 资本、RWA 与杠杆　|　17 · 第一损失</p>
        <h2>存款和其他债务仍按约偿付时，资产损失由薄股本放大；资本的首要功能是让损失先落到所有者，而不是立刻落到存款人。</h2>
        <div className="equation-card">
          <span>会计杠杆与资产损失</span>
          <div>λ = A / E；E′ = E − xA = E(1 − λx)</div>
          <p>x 是全部资产的平均损失比例。若 A=100、E=10、λ=10，资产平均损失 1% 会使权益下降 10%；损失 10% 足以耗尽初始权益。公式是静态教学近似，不表示每次市场报价变化都立即按同一口径进入资本。</p>
        </div>
        <p>
          资本缓冲使银行可以吸收部分信用和市场损失、继续兑现高级负债，却也不是绝对保证。账面确认、经济价值、税、担保、拨备和资本扣减会改变进入监管分子的时间。Bank of England 的资本—流动性解释强调：资本解决损失吸收，流动性解决按时付款，两者都重要但不可互换。<Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="regulatory-capital">
        <p className="section-kicker">18 · 监管资本</p>
        <h2>会计权益、市场价值权益与监管合格资本可能同时不同；监管分子关心损失吸收质量，而不只是账面净资产总额。</h2>
        <p>
          Basel 资本定义将 CET1、Additional Tier 1 与 Tier 2 按持续经营和失败处置中的损失吸收能力分层，并对商誉、递延税项、交叉持有等作监管调整。普通股和留存收益通常是最高质量起点，但“账面权益 10”不保证“CET1 10”。中国 2024 年生效的《商业银行资本管理办法》、美国 Regulation Q 和欧盟资本要求法规还会加入各自适用范围、资本栈、过渡和监督要求。<Cite n={9} /><Cite n={18} /><Cite n={20} /><Cite n={71} />
        </p>
        <p>市场价值权益又反映投资者对未来资产、负债、特许权、诉讼和增长机会的估计，可能早于会计资本变化。研究中必须给资本加上标：book equity、market equity、CET1、Tier 1 或 total capital；不能用股票市值直接除以监管 RWA。</p>
      </section>

      <section className="lesson-section" id="rwa-construction">
        <p className="section-kicker">19 · 风险加权资产</p>
        <h2>RWA 不是资产的市场风险分数，而是规则把信用、市场、操作和部分表外风险映射到资本分母的制度量。</h2>
        <div className="equation-card">
          <span>只用于教学的 RWA 汇总</span>
          <div>RWA ≈ Σ(EAD<sub>i</sub> × w<sub>i</sub>) + RWA<sub>market</sub> + RWA<sub>operational</sub></div>
          <p>EAD 是暴露，w 是题设或适用规则的风险权重。真实计算还包括信用转换系数、抵押和担保、内部模型限制、证券化、交易对手风险与 output floor；实验中的 0%、50% 或 100% 都只是冻结参数。</p>
        </div>
        <p>
          在适用规则条件下，部分主权、中央银行或公共部门暴露可能取得较低甚至零信用风险权重，但这不等于没有久期、市场价格、流动性、集中度或抵押品风险；同一贷款因法域、借款人、评级、担保和方法不同也可能占用不同 RWA。Basel 是国际最低标准框架而非各地自动生效的统一法律，中国规则还按银行规模和跨境业务分档。<Cite n={8} /><Cite n={10} /><Cite n={18} /><Cite n={73} />
        </p>
      </section>

      <section className="lesson-section" id="capital-ratio">
        <p className="section-kicker">20 · 资本率与余量</p>
        <h2>比率告诉你离约束多远，货币化 headroom 才能连接到新增贷款、损失或减仓量。</h2>
        <div className="equation-card">
          <span>风险资本率与教学余量</span>
          <div>CET1 ratio = CET1 / RWA；H<sub>C</sub> = CET1 − k<sub>C</sub> × RWA</div>
          <p>k<sub>C</sub> 是适用的目标或最低加缓冲比率；H<sub>C</sub> 单位为货币。H<sub>C</sub>&gt;0 表示相对该目标还有资本余量，但不说明杠杆、流动性或稳定融资也有余量。</p>
        </div>
        <p>
          Basel 基准最低值与资本留存缓冲只是资本栈起点；逆周期、系统重要性、Pillar 2、压力资本缓冲和银行内部管理目标可能叠加。进入缓冲区通常首先限制分红、回购和奖金分配，不应简化为“触线就必须立即卖出全部风险资产”。当地法律与监管沟通决定实际修复时间和动作集合。<Cite n={10} /><Cite n={11} /><Cite n={18} /><Cite n={21} />
        </p>
      </section>

      <section className="lesson-section" id="off-balance-sheet-exposure">
        <p className="section-kicker">21 · 表外承诺</p>
        <h2>未提款额度、担保、信用证、衍生品和证券融资在会计表外或净额较小时，仍可能消耗资本、杠杆与流动性。</h2>
        <p>
          企业在压力中提用承诺额度，会把未来或有义务瞬间变成贷款资产与存款负债；担保在被触发前不一定表现为表内贷款，却可能经信用转换系数进入 RWA；衍生品的当前价值、潜在未来暴露与保证金现金流又分别进入资本和流动性。只用资产负债表面值衡量银行规模，会漏掉这些状态依赖敞口。<Cite n={12} /><Cite n={15} /><Cite n={27} /><Cite n={73} /><Cite n={74} />
        </p>
        <p>证券化同样不能由“卖给特殊目的载体”推断风险已经离开。只有满足显著风险转移、法律与操作条件，资本处理才可能改变；保留次级分层、服务义务、流动性支持或回购承诺会留下风险。<Cite n={65} /></p>
      </section>

      <section className="lesson-section" id="leverage-ratio">
        <p className="section-kicker">22 · 杠杆率后备约束</p>
        <h2>风险权重可能很低，总敞口仍然很大；非风险加权杠杆率因此作为另一只尺子约束扩表。</h2>
        <div className="equation-card">
          <span>Basel 杠杆率的结构</span>
          <div>Leverage ratio = Tier 1 capital / leverage exposure measure</div>
          <p>分母包括表内暴露、衍生品、证券融资交易和转换后的表外项目；它不是会计 A/E 的倒数。Basel 基准最低值为 3%，但当地适用门槛、附加要求和口径不同；中国现行办法规定的本地杠杆要求也不能与美国大行要求互换。</p>
        </div>
        <p>
          一家银行买入由负债融资的零信用权重资产时，CET1/RWA 可以不变，杠杆率却下降。反过来，高权重小规模贷款可能先撞上风险资本率。只有同时计算两项 headroom，才能知道新增一单位资产真正占用哪种稀缺资产负债表空间。<Cite n={12} /><Cite n={18} />
        </p>
      </section>

      <section className="lesson-section" id="capital-versus-liquidity">
        <p className="section-kicker">23 · 资本与流动性四格</p>
        <h2>“能承担最终损失”和“能在截止前付款”是两个轴；把它们混成一个安全指标，会误诊救助工具。</h2>
        <div className="table-scroll" role="region" aria-label="资本与流动性四格，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">经济偿付能力与即时流动性的四种状态</caption>
            <thead><tr><th scope="col">经济状态</th><th scope="col">流动性充足</th><th scope="col">流动性不足</th></tr></thead>
            <tbody>
              <tr><th scope="row">经济上可偿付</th><td>正常经营并保持缓冲</td><td>可用抵押融资、资产变现或最后贷款人争取时间</td></tr>
              <tr><th scope="row">经济净值不足</th><td>短期仍能付款，但商业模式/资本不可持续</td><td>既缺现金又缺资本，通常需要恢复、重组或处置</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          央行抵押贷款可以把未来可收回价值提前变成现金，却不能让坏贷款恢复或自动补充 CET1；股东增资能吸收损失，却不保证抵押品和支付操作即时就绪。官方流动性材料反复强调，discount window readiness 能争取时间，但不能修复有效资不抵债。<Cite n={57} /><Cite n={58} /><Cite n={70} />
        </p>
      </section>

      <section className="lesson-section" id="capital-headroom-actions">
        <p className="section-kicker">24 · 资本余量怎样生成动作</p>
        <h2>资本缺口没有唯一订单：银行可以补分子、降分母、改变风险权重、留存利润或等待资产到期，每条路径的时间和副作用不同。</h2>
        <div className="equation-card">
          <span>出售风险资产后的教学资本余量变化</span>
          <div>ΔH<sub>C</sub> ≈ −ℓ + k<sub>C</sub> × w × B</div>
          <p>B 是出售的账面暴露，w 是风险权重，ℓ 是实现损失。卖出减少 RWA 带来第二项改善，却可能因折价损失减少资本；若 ℓ 更大，资本余量反而恶化。</p>
        </div>
        <p>
          发行普通股、暂停分红和留存利润修复分子；缩减高权重贷款、出售资产、取得满足适用信用风险缓释条件的合格担保或改变组合，才可能修复分母；提高贷款价格与收紧标准影响未来新增。2011 年 EBA 资本演练的准自然实验显示，受约束银行在特定危机期更多依靠压缩 RWA 而非发行股本，且客户企业受到影响；这说明突然缺口的短期调整边际，不证明更高稳态资本长期有害。<Cite n={37} /><Cite n={75} />
        </p>
      </section>

      <section className="lesson-section" id="reserves-and-cash">
        <p className="section-kicker">阶段四 · 流动性与稳定融资　|　25 · 准备金与现金</p>
        <h2>准备金是银行对中央银行的结算资产，库存现金是交付给公众的实物货币；它们都在资产端，却不等于资本或可长期支撑贷款的稳定融资。</h2>
        <p>
          银行收到他行客户转来的存款时，通常同时获得准备金；客户把现金存入时，银行增加现金并增加存款负债。两种事件都扩大或重组流动资产，却不会自动增加权益。准备金可以支持支付、满足适用准备要求并参与央行操作，但银行不能把中央银行准备金直接转入普通企业账户；企业得到的是商业银行存款。<Cite n={3} /><Cite n={4} />
        </p>
        <p>“准备金很多所以一定多放贷”同样错误。贷款需要有可信借款人、正的风险调整回报、资本和限额余量；即使准备金充裕，资本不足或信用需求弱仍可抑制贷款。反之，在准备金相对稀缺的制度中，合格银行可通过市场或央行工具获得结算资金，但价格和抵押条件会进入贷款成本。</p>
      </section>

      <section className="lesson-section" id="hqla-haircuts">
        <p className="section-kicker">26 · HQLA、合格抵押品与 Haircut</p>
        <h2>“安全资产”“HQLA”“央行合格抵押品”和“今日未设押可用资产”是重叠集合，不是同义词。</h2>
        <div className="equation-card">
          <span>抵押借款能力的教学近似</span>
          <div>B<sub>lendable</sub> ≈ Σ M<sub>i</sub>(1 − h<sub>i</sub>) − other deductions</div>
          <p>M<sub>i</sub> 是当前认可市场价值，h<sub>i</sub> 是 haircut。真实借款还取决于资产资格、集中度、币种、法律完善、预先质押、操作测试、工具限额和对手方；账面价值不能代替当前可借金额。</p>
        </div>
        <p>
          Basel HQLA 要求资产在压力中仍具流动性并由银行控制、未被用于其他义务且具备可操作变现能力。某项证券可能信用质量高，却已质押给另一融资方；也可能符合央行抵押品目录，却因尚未完成法律文件和测试而无法在今日截止前借款。研究应建立三张清单：名义持仓、监管认可 HQLA、实际可动用抵押品。<Cite n={14} /><Cite n={57} /><Cite n={58} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="runoff-inflow-clock">
        <p className="section-kicker">27 · 流出、流入与时钟</p>
        <h2>未来 30 日的标准化现金流不是把所有资产负债到期额简单相减，而是先按行为、合同和监管情景分类。</h2>
        <p>
          零售存款、运营存款、企业大额存款、回购、衍生品保证金与未提款额度在压力中具有不同流出系数；贷款回款和证券到期也未必全额、按时或可自由用于流出。Basel LCR 还把可计入流入上限设为流出的 75%，要求银行保留最低 HQLA，而不能声称未来回款会完全替代缓冲。真实法域可以有实施细节和适用差异。<Cite n={15} />
        </p>
        <p>更重要的是操作时钟。一个 30 日比率可以合格，银行仍可能在第一天上午出现巨额集中转账；一项明日到期证券不能覆盖今日支付，一项理论可质押资产也可能因未预先登记而错过窗口。标准化比率负责可比性，现金流台账负责生存。</p>
      </section>

      <section className="lesson-section" id="lcr">
        <p className="section-kicker">28 · Liquidity Coverage Ratio</p>
        <h2>LCR 检查短期标准化压力下的缓冲，而不是给银行贴上“会/不会挤兑”的永久标签。</h2>
        <div className="equation-card">
          <span>Basel 结构</span>
          <div>LCR = HQLA / 30-day net cash outflows</div>
          <p>Net cash outflows = outflows − min(inflows, 75%×outflows)。正常状态基准最低为 100%；压力中框架允许银行使用 HQLA 并可能短时低于 100%，监管反应要结合具体情境。</p>
        </div>
        <p>
          LCR 的价值在于迫使银行把负债行为与可变现资产放进同一压力窗口；其边界是情景参数、聚合速度、币种错配、日内支付和操作准备。2023 年动荡显示，数字渠道、社交网络与高度集中未保险存款可以产生远快于历史模板的流出；因此合格 LCR 不等于没有流动性风险。中国流动性办法还对不同规模银行设置不同指标组合，不能把完整 LCR/NSFR 体系无条件套给每一家小银行。<Cite n={13} /><Cite n={19} /><Cite n={56} />
        </p>
      </section>

      <section className="lesson-section" id="available-stable-funding">
        <p className="section-kicker">29 · Available Stable Funding</p>
        <h2>ASF 询问“这笔融资在约一年压力期限内有多稳定”，而不是负债名义期限有多长或成本有多低。</h2>
        <p>
          资本与长期负债通常获得较高 ASF；零售存款依保险、稳定关系和账户特征获得不同权重；短期批发融资可能贡献很少。存款是银行的重要融资来源，但“存款很多”不足以说明稳定：客户集中、未保险比例、利率敏感性、数字化迁移能力和关联网络都会改变流失行为。ASF 是规则化代理，不是对每一客户下一步行为的精确预测。<Cite n={82} />
        </p>
        <p>把存款称为“银行拥有的现金”会同时犯两错：它位于负债端，而且客户可将其转走；银行真正持有的是准备金、现金和其他资产。存款的价值来自相对稳定和可能较低成本的融资特许权，而不是所有权。</p>
      </section>

      <section className="lesson-section" id="required-stable-funding">
        <p className="section-kicker">30 · Required Stable Funding</p>
        <h2>RSF 读取资产和表外承诺在结构上需要多少稳定融资；越长期、越不流动、越难在压力中变现的资产通常要求越高。</h2>
        <p>
          准备金和某些高流动证券所需稳定融资较低，长期贷款、非流动资产与部分表外承诺较高。RSF 不等同风险权重：一笔信用风险低但期限很长的资产可有较低 RWA，却仍需要稳定融资；一笔短期高信用风险贷款又可能资本占用高而期限错配小。把 RWA 与 RSF 混成一个“风险分数”，会失去资本和融资期限的两条约束。<Cite n={82} />
        </p>
      </section>

      <section className="lesson-section" id="nsfr">
        <p className="section-kicker">31 · Net Stable Funding Ratio</p>
        <h2>NSFR 约束约一年期限上的融资结构；它不能告诉你今天下午是否付得出存款。</h2>
        <div className="equation-card">
          <span>结构性稳定融资</span>
          <div>NSFR = Available Stable Funding / Required Stable Funding ≥ 100%</div>
          <p>分子、分母都经过规则权重处理。100% 是 Basel 基准最低值；实际适用范围和过渡依当地规则。NSFR 高说明结构融资相对充足，不代表 HQLA、准备金或日内操作充足。</p>
        </div>
        <p>
          一家银行可以 LCR 很高但长期依赖短期批发融资，因而 NSFR 较弱；也可以 NSFR 合格，却因突然集中存款迁移出现当日现金缺口。研究压力必须同时列出“今日/日内、30 日、约一年、资本长期修复”四只时钟。<Cite n={16} /><Cite n={82} /><Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="deposit-funding-behavior">
        <p className="section-kicker">32 · 存款融资与特许权</p>
        <h2>存款既是可流出的负债，也是可能具有黏性和低 beta 的融资特许权；利率上升会同时改变它的价格、数量与经济价值。</h2>
        <div className="equation-card">
          <span>存款特许权的教学表达</span>
          <div>V<sub>F</sub> = 𝔼<sub>0</sub>[Σ<sub>t=1…T</sub> m<sub>t</sub>D<sub>t</sub>(r<sub>t</sub> − r<sub>t</sub><sup>D</sup> − c<sub>t</sub>)]</div>
          <p>m<sub>t</sub> 是把 t 期状态现金流折现到 0 期的无量纲折现因子，D<sub>t</sub> 是未来存款量，c<sub>t</sub> 是与利率使用相同期间口径的单位存款服务成本，因此 V<sub>F</sub> 的单位是货币。低 deposit beta 可扩大加息期利差，但若存款外流，未来数量和特许权价值会同时下降。</p>
        </div>
        <p>
          Drechsler、Savov 与 Schnabl 的研究显示，市场利率上升时银行可能少传导给存款利率，存款利差扩大但数量外流；稳定低 beta 存款的经济期限又可被长期固定利率资产部分对冲。这不等于“期限转换没有利率风险”：特许权一旦因竞争、未保险集中或信心冲击消失，原有经济对冲也会弱化。2026 年的 deposit franchise runs 模型强调的正是特许权价值流失，而非逐字重复 Diamond–Dybvig 的提前清算机制。<Cite n={41} /><Cite n={42} /><Cite n={43} />
        </p>
        <p>
          Diamond–Rajan 的另一支理论强调，可随时撤回的债务既制造脆弱性，也可能约束掌握关系贷款回收能力的银行家；提高资本增强持续经营的损失吸收，却会改变这种契约承诺。这个权衡依赖特定模型环境，不能被翻译成“资本要求越低越有效”的政策结论。<Cite n={25} /><Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="contingency-funding-collateral">
        <p className="section-kicker">33 · 应急融资与抵押品瀑布</p>
        <h2>应急融资能力必须从“可以想象”降级为“已签约、已质押、已测试并能在截止前到账”。</h2>
        <div className="equation-card">
          <span>今日流动性缺口 · 始终用正数表示短缺</span>
          <div>Shortfall<sub>L</sub> = max{'{'}Stress need − [R + ΣM<sub>i</sub>(1−h<sub>i</sub>) + B], 0{'}'}</div>
          <p>R 是可用现金和准备金，B 是已确认且未重复计入的借款能力；Stress need 包括存款和批发融资流出、额度提用、保证金与结算需求，并扣除同一截止前可信流入。结果为零表示题设资源足以覆盖需要，正数才是仍须修复的短缺。</p>
        </div>
        <p>
          处置顺序通常从自由现金、可出售 HQLA、市场融资、已准备的央行工具延伸到更昂贵资产出售与资本动作，但不存在全球固定瀑布。美国 discount window 要求合格借款主体、抵押、估值和事前操作准备；其他央行工具、对手方、币种和准入不同。资产已设押、法律文件未完成或员工不会操作，都能让“可借”在危机时变成零。<Cite n={57} /><Cite n={58} /><Cite n={70} /><Cite n={81} />
        </p>
      </section>

      <section className="lesson-section" id="repricing-gap">
        <p className="section-kicker">阶段五 · 信用、利率与融资冲击　|　34 · 重定价缺口</p>
        <h2>合同最终到期日不等于利率重新定价日；浮息贷款、定期存款、活期存款和对冲必须按同一时间桶比较。</h2>
        <p>
          一笔十年贷款可能每三个月重定价，一笔活期存款法律上可随时提取却因客户黏性表现出较长经济期限。短期收益分析先把未来一年内重定价资产与负债列入同一桶；经济价值分析再用久期或关键期限敏感度。把法律期限、会计期限、行为期限和定价期限混成一个 maturity，会同时误算 NII 和 EVE。
        </p>
        <p>BCBS 的 IRRBB 框架要求银行同时观察经济价值和净利息收入，并在 2026 年生效版本中规定监管冲击场景；它属于 Pillar 2 监督框架，不应简单塞进信用 RWA 或当成所有法域逐字相同的 Pillar 1 公式。<Cite n={17} /></p>
      </section>

      <section className="lesson-section" id="net-interest-income">
        <p className="section-kicker">35 · Net Interest Income</p>
        <h2>NII 是一段时间内利息收入减利息费用；加息究竟改善还是压缩它，取决于双方重定价速度和数量，而不是资产端利率一个方向。</h2>
        <div className="equation-card">
          <span>短期教学近似</span>
          <div>ΔNII ≈ A<sub>reprice</sub>β<sub>A</sub>Δr − D<sub>reprice</sub>β<sub>D</sub>Δr − W<sub>reprice</sub>β<sub>W</sub>Δr</div>
          <p>A 是重定价资产，D 是存款，W 是其他融资，β 表示利率传导比例。若资产先重定价且存款 beta 低，NII 可先上升；若存款迁移到高息产品、批发融资上升或贷款 beta 低，方向可反转。</p>
        </div>
        <p>
          期间 NII 改善不保证经济价值改善，也不保证信用质量稳定。借款人利息负担上升可能在稍后增加违约；低存款利率又可能触发外流。存款渠道研究提供的是特定样本的价格—数量证据，不是“银行总能通过压低存款利率从加息获利”的普遍定律。<Cite n={17} /><Cite n={41} />
        </p>
      </section>

      <section className="lesson-section" id="economic-value-duration">
        <p className="section-kicker">36 · EVE 与久期</p>
        <h2>经济价值权益要同时重估资产与负债；只展示证券未实现损失，会删除存款与对冲的价值变化。</h2>
        <div className="equation-card">
          <span>平行、小幅曲线冲击的一阶教学近似</span>
          <div>DD<sub>gap</sub> = D<sub>A</sub>A − D<sub>L</sub>L + DD<sub>hedges</sub>；ΔEVE ≈ −DD<sub>gap</sub>Δy</div>
          <p>A 与 L 是当前经济现值，D 是修正久期，金额乘久期得到货币久期；这里约定 DD<sub>hedges</sub> ≡ −∂V<sub>hedges</sub>/∂y，正值表示对加息为负的价值敏感度。资产久期缺口为正时，加息通常降低 EVE。真实模型需处理非平行曲线、凸性、提前还款、活期存款行为、基差、币种和选择权。<Cite n={17} /></p>
        </div>
        <p>
          在美国 GAAP 报告口径下，HTM 债务证券按摊余成本报告；AFS 债务证券按公允价值报告，未实现的非信用相关价值变动通常进入 OCI/AOCI，利息、信用损失与已实现损益另行处理；AOCI 是否进入 CET1 又取决于适用资本规则和银行类别。<Cite n={20} /> IFRS 9 与中国准则使用另一套分类。确认位置不同，不会让经济价值、可抵押价值或出售时价格恢复；存在经济损失也不等于当下已经现金违约。<Cite n={55} /><Cite n={63} /><Cite n={64} /><Cite n={76} />
        </p>
      </section>

      <section className="lesson-section" id="deposit-beta">
        <p className="section-kicker">37 · Deposit Beta 与行为期限</p>
        <h2>Deposit beta 衡量存款利率对市场利率的传导，不是存款“会不会跑”的完整概率。</h2>
        <p>
          Beta 低意味着银行短期少提高存款利率，可能扩大存款利差；但客户会在数量端转向货币基金、国债、其他银行或高息账户。存款黏性来自交易便利、关系、转换成本、保险、服务和市场竞争，也可能在信心冲击中非线性消失。因此 EVE 模型给活期存款配置的行为期限必须与 beta、流失和特许权假设共同压力测试。<Cite n={41} /><Cite n={42} /><Cite n={43} />
        </p>
        <p>把账面“无期限”直接写成久期零，会高估负债随利率上升的价值稳定；把历史稳定性外推成永久长期负债，又会低估挤兑。正确做法不是寻找唯一期限，而是报告基准、上限、下限与假设失效条件。</p>
      </section>

      <section className="lesson-section" id="credit-loss-provision">
        <p className="section-kicker">38 · 信用损失与拨备时序</p>
        <h2>经济损失可能先于违约，拨备可能先于核销，监管资本调整又可能采用不同过渡；同一坏消息有多只确认时钟。</h2>
        <p>
          贷款现金流预期恶化时，经济价值先下降；会计框架依据适用的预期信用损失规则确认减值，例如 IFRS 9、中国准则与美国 Topic 326/CECL 使用不同口径；真正违约后还要经历重组、担保执行、回收与核销；监管资本再读取合格拨备、预期损失差额和资本调整。研究若只使用核销，会把风险出现推迟；若把全部模型预期损失当成已实现现金流，又会提前过度确认。<Cite n={63} /><Cite n={64} /><Cite n={77} />
        </p>
        <p>信用集中度使平均 PD×LGD 不足以描述尾部：同一行业、地区、商业地产或关联借款人的共同冲击会令违约相关性上升。RWA 和会计拨备提供制度化尺度，内部组合压力仍需补充集中度、迁移和共同因子。</p>
      </section>

      <section className="lesson-section" id="deposit-runoff-stress">
        <p className="section-kicker">39 · 存款流失与 SVB</p>
        <h2>存款流出首先是支付和融资冲击，不自动等于最终信用损失；但它会迫使银行把潜在经济损失转换成当期现金与资本问题。</h2>
        <p>
          Diamond–Dybvig 展示活期负债如何同时提供风险共担与协调脆弱性；Goldstein–Pauzner 将基本面与协调结合，Iyer–Puri 和 Calomiris–Mason 的实证又显示关系网络、存款保险和资产质量会共同影响真实提款。因此“纯恐慌”和“基本面资不抵债”不是互斥标签：弱基本面可以扩大协调区域，流出又可以迫使折价变现，反过来恶化基本面。<Cite n={22} /><Cite n={44} /><Cite n={45} /><Cite n={46} />
        </p>
        <div className="research-card">
          <span>OFFICIAL CASE · SILICON VALLEY BANK, 2023</span>
          <h3>不是“债券亏损”一个变量，而是久期、存款集中、未保险融资、对冲、治理、监管与操作准备的闭合链。</h3>
          <p>美联储复盘记录了快速增长、长久期资产、集中的科技与风投客户、极高未保险存款、薄弱利率与流动性管理，以及 2023 年 3 月 9 日单日超过 400 亿美元流出。利率上升先压低经济价值；流出迫使融资和出售准备，损失与资本筹集信号再改变信心。BCBS 复盘进一步强调数字化速度、抵押品可操作性和二阶反馈。这个案例不能被外推成所有银行在加息时都会卖债。<Cite n={53} /><Cite n={54} /><Cite n={55} /><Cite n={56} /></p>
        </div>
      </section>

      <section className="lesson-section" id="wholesale-rollover-stress">
        <p className="section-kicker">40 · 批发融资与展期压力</p>
        <h2>回购、同业、存单和债券可以补充存款，却把到期、haircut、对手方与市场关闭写入融资时钟。</h2>
        <p>
          存款与授信额度由同一银行共同提供，在正常时期若提款不完全同步，可以共享流动性池；压力中企业同时提用额度、存款人转走资金，相关性却可能骤升。批发融资还可能因资产价格下降、haircut 上升或对手方限额收紧而无法按原规模展期。Kashyap–Rajan–Stein 的共同流动性池解释协同，不保证危机中两类流量仍然对冲。<Cite n={27} /><Cite n={56} />
        </p>
        <div className="equation-card">
          <span>共同流动性池的最小直觉</span>
          <div>Var(X<sub>D</sub> + X<sub>C</sub>) = σ<sub>D</sub><sup>2</sup> + σ<sub>C</sub><sup>2</sup> + 2ρσ<sub>D</sub>σ<sub>C</sub></div>
          <p>X<sub>D</sub> 是存款提款，X<sub>C</sub> 是授信提用。ρ 较低时共享缓冲有节约；ρ 在压力中接近 1 时，两类现金需要会一起上升。</p>
        </div>
      </section>

      <section className="lesson-section" id="constraint-stack">
        <p className="section-kicker">41 · Constraint Stack</p>
        <h2>同一张资产负债表会被多只尺子同时读取；真正决定动作的是最先变成 binding 的约束，而不是最常被媒体引用的比率。</h2>
        <div className="table-scroll" role="region" aria-label="银行约束栈，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">风险资本、杠杆、短期流动性、稳定融资与内部约束</caption>
            <thead><tr><th scope="col">约束</th><th scope="col">分子/资源</th><th scope="col">分母/需要</th><th scope="col">典型修复边际</th></tr></thead>
            <tbody>
              <tr><th scope="row">CET1/RWA</th><td>合格 CET1</td><td>风险加权资产</td><td>补资本、留存收益、降 RWA</td></tr>
              <tr><th scope="row">Leverage ratio</th><td>Tier 1</td><td>非风险加权总暴露</td><td>补资本、缩总敞口</td></tr>
              <tr><th scope="row">LCR</th><td>认可 HQLA</td><td>30 日净流出</td><td>增 HQLA、改负债、减承诺</td></tr>
              <tr><th scope="row">NSFR</th><td>ASF</td><td>RSF</td><td>延长融资、调整资产期限</td></tr>
              <tr><th scope="row">内部/监督</th><td>管理缓冲与操作能力</td><td>压力、集中度与恢复计划</td><td>可能早于法定最低触发动作</td></tr>
            </tbody>
          </table>
        </div>
        <p>一项资产可以 RWA 低却占杠杆和期限，一项融资可提高现金却不增加资本，一次资产出售可改善 LCR 却因折价损失恶化 CET1。ALCO 的任务不是机械最大化某一比率，而是在法律、成本、客户、市场深度和时间约束下找到可行组合。<Cite n={8} /><Cite n={56} /></p>
      </section>

      <section className="lesson-section" id="loan-price-quantity">
        <p className="section-kicker">阶段六 · 信用供给、订单与反馈　|　42 · 贷款价格与数量</p>
        <h2>银行收紧信用不只表现为“少放贷款”，还可以提高价格、缩短期限、增加抵押、降低额度或拒绝边际借款人。</h2>
        <p>
          银行对一笔贷款的最低可接受价格要覆盖资金成本、预期信用损失、运营成本、资本和流动性占用，并补偿不可分散风险与目标回报。资本或稳定融资变稀缺时，银行可提高贷款利差；关系客户和已承诺额度又使数量不能即时归零。委托监督与信息生产让贷款并非总能被债券或另一家银行完美替代，尤其对小型、不透明企业。<Cite n={23} /><Cite n={28} /><Cite n={32} /><Cite n={36} />
        </p>
        <div className="equation-card">
          <span>贷款定价的机制账本，不是法定公式</span>
          <div>Loan all-in rate ≈ marginal funding cost + expected loss + operating cost + capital/liquidity wedge + target margin</div>
          <p>各项都按同一笔贷款余额、同一年度化基准表示，并可能随银行状态改变。观察贷款利率上升不能立刻归因于资金成本，因为风险、资本影子价、借款人构成与市场竞争也会变化。</p>
        </div>
      </section>

      <section className="lesson-section" id="committed-versus-new-credit">
        <p className="section-kicker">43 · 已承诺额度与新信用</p>
        <h2>压力中“贷款余额上升”可能来自客户提用旧承诺，而不是银行主动放松新贷款。</h2>
        <p>
          企业为预防现金短缺提用循环授信时，银行必须兑现合同，贷款和存款同时上升，流动性与资本占用增加；同一银行可能与此同时拒绝新申请、提高新贷款价格或停止续作。只看总贷款余额会把被动承诺履行误写成扩张性信用供给。<Cite n={27} /><Cite n={33} />
        </p>
        <p>研究应并列观察申请、批准、提款、未提款承诺、到期、续作、利率、抵押和契约。对同一借款人在同一时期比较受冲击与未受冲击银行，才更接近识别供给，而不是把企业需求变化归给银行。</p>
      </section>

      <section className="lesson-section" id="securities-liquidity-portfolio">
        <p className="section-kicker">44 · 证券、流动性缓冲与抵押品</p>
        <h2>银行持有证券可能为了收益、利率管理、HQLA、抵押融资或客户业务；同一证券余额不能直接读取一个动机。</h2>
        <p>
          正常状态下，资金和资本充足的银行可以作为耐心固定收益投资者，持有到期并承接非银行卖盘；危机中，证券又常比贷款更容易出售或质押，因此最安全资产可能最先被动用。Hanson 等人的“patient investor”机制与 SVB 并不矛盾：前者依赖稳定融资和持有能力，后者的集中未保险流出摧毁了等待时间。<Cite n={52} /><Cite n={54} />
        </p>
        <p>
          德国危机数据还显示，交易能力强且资本较好的银行会买入跌价证券，同时收缩贷款，说明“证券买入＝整体风险偏好上升”也不成立。资产替换可能把银行变成市场稳定买家，却把稀缺资产负债表空间从实体信贷移走。<Cite n={51} />
        </p>
      </section>

      <section className="lesson-section" id="remediation-waterfall">
        <p className="section-kicker">45 · 修复瀑布与处置边界</p>
        <h2>先判断缺的是现金、抵押品、稳定融资还是资本，再选择工具；流动性工具不能代替资本，资本工具也不能代替今日结算。</h2>
        <ol className="diagnostic-list">
          <li><b>冻结截止时点：</b>今日支付、30 日流出、约一年融资与长期资本修复分开。</li>
          <li><b>冻结资源：</b>自由准备金、可出售 HQLA、未设押抵押品、已确认融资和真实可转移资本。</li>
          <li><b>冻结代价：</b>融资价格、haircut、出售折价、会计确认、RWA relief、客户关系和信号。</li>
          <li><b>验证第二轮：</b>动作后的资本、LCR、NSFR、存款行为与剩余抵押品重新计算。</li>
        </ol>
        <p>
          若银行已不具可持续经济价值，单纯延长融资只会转移或增加损失，恢复与处置制度因而存在。FSB 的 Key Attributes 是国际标准，不直接创设国内处置权。美国 FDIC 依据本国法律对受保存款机构担任 receiver，并可使用 purchase-and-assumption 等路径；欧盟 SRB 与国家处置机构依据 SRMR/BRRD 运用 sale of business、bridge、asset separation 与 bail-in；中国现行商业银行法与存款保险条例则规定接管、合并或破产清算、保险偿付及超额存款债权等路径。手册和概览帮助理解操作，却不能替代具体法源、债权层级与个案决定。<Cite n={7} /><Cite n={62} /><Cite n={66} /><Cite n={67} /><Cite n={68} /><Cite n={78} /><Cite n={79} /><Cite n={80} />
        </p>
      </section>

      <section className="lesson-section" id="funding-and-asset-orders">
        <p className="section-kicker">46 · 从目标修复到母订单</p>
        <h2>“需要提高流动性”不是订单；必须先把每项动作对现金、资本、RWA、期限和价格的联立效果写入同一账本。</h2>
        <div className="equation-card">
          <span>修复动作的通用账本</span>
          <div>Action gap = Target state − Current state − Confirmed pending actions</div>
          <p>Target state 是一组而不是单个数：现金、HQLA、CET1 headroom、杠杆、ASF/RSF 与利率敞口。已签约融资、在途证券、待结算贷款和已宣布增资必须扣除，避免重复下单。</p>
        </div>
        <p>
          银行可以提高存款利率、发行存单/债券、做回购、向央行借款、卖出或质押证券、出售贷款、使用利率衍生品、暂停分红、留存利润或增资。每项动作有自己的决策、交易、结算和监管时钟；证券出售才是传统市场订单，缩减新贷款则通过信用数量和价格影响实体，而不一定出现在交易所订单簿。
        </p>
      </section>

      <section className="lesson-section" id="fire-sale-loss-loop">
        <p className="section-kicker">47 · Fire-sale Loss Loop</p>
        <h2>价格下跌本身不是 fire sale；必须同时证明约束驱动的出售、有限承接资本和折价对其他持仓者的反馈。</h2>
        <div className="equation-card">
          <span>共同持仓反馈的教学近似</span>
          <div>Δp<sub>j</sub> = −κ<sub>j</sub>Σ<sub>k</sub>q<sub>kj</sub>；ΔE<sub>i</sub> = Σ<sub>j</sub>z<sub>ij</sub>Δp<sub>j</sub></div>
          <p>q<sub>kj</sub> 是卖方 k 对资产 j 的出售数量，z<sub>ij</sub> 是机构 i 对同一资产的持有数量，二者使用一致数量单位；κ<sub>j</sub> 是“每单位总卖出量对应多少价格变化”的冲击系数。出售压价、共同持仓者权益下降、约束变紧再促成出售；κ 固定与线性价格冲击只是教学假设。</p>
        </div>
        <p>
          Shleifer–Vishny 强调最懂资产的自然买家也可能受约束，Brunnermeier–Pedersen 连接市场与融资流动性，Greenwood–Landier–Thesmar 和 Duarte–Eisenbach 则测量共同持仓的系统暴露。它们说明必要机制与可测量路径，不证明任何大额卖单都是强迫出售，也不提供所有市场通用 κ。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} />
        </p>
      </section>

      <section className="lesson-section" id="credit-supply-feedback">
        <p className="section-kicker">48 · 信用供给反馈</p>
        <h2>银行资产负债表冲击只有在借款人无法完全替代融资时，才会从单家银行传到企业投资、就业和总需求。</h2>
        <p>
          经典 bank lending channel 要求银行贷款与债券或其他融资并非完全替代；否则一家银行缩贷只会被别的资金补上。可信实证通常寻找银行侧外生冲击，并用同一借款人同时面对多家银行的差异吸收共同需求。巴基斯坦流动性冲击和西班牙贷款申请数据都发现，受冲击、低资本或低流动性银行对同一企业提供更少信用；这些局部结果仍需检查其他银行、债券和非银行是否补位。<Cite n={29} /><Cite n={30} /><Cite n={31} /><Cite n={32} /><Cite n={33} />
        </p>
        <p>
          日本银行损失传到美国地产、国际银行冲击传到秘鲁、雷曼后弱银行关系影响中小企业就业的研究进一步连接实体结果；效应大小依企业透明度、关系强度与替代能力。不能用“政策利率上升后贷款余额下降”的总量相关性直接声称识别了贷款供给。<Cite n={34} /><Cite n={35} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="state-dependent-response">
        <p className="section-kicker">49 · 状态依赖的响应符号</p>
        <h2>同一资产价格下跌或存款流出，可以让银行买入、持有或出售；方向取决于哪项约束最紧和谁还有承接能力。</h2>
        <div className="table-scroll" role="region" aria-label="银行状态依赖动作矩阵，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">资本、融资和市场深度决定银行动作方向</caption>
            <thead><tr><th scope="col">冲击前状态</th><th scope="col">首先变紧</th><th scope="col">更可能动作</th><th scope="col">反馈方向</th></tr></thead>
            <tbody>
              <tr><th scope="row">资本、融资充足</th><td>没有约束 binding</td><td>承接折价证券或维持贷款</td><td>可能稳定价格</td></tr>
              <tr><th scope="row">存款高速流失</th><td>今日现金/抵押品</td><td>借款、质押或出售最易变现资产</td><td>视成交深度而定</td></tr>
              <tr><th scope="row">信用损失、资本薄</th><td>CET1/RWA</td><td>增资、留存、缩高 RWA、新贷收紧</td><td>信用收缩</td></tr>
              <tr><th scope="row">低权重资产过度扩张</th><td>杠杆率/NSFR</td><td>缩总敞口或延长融资</td><td>可传到安全资产和融资价</td></tr>
              <tr><th scope="row">市场浅且共同持仓</th><td>价格—资本联动</td><td>被迫出售后再修资本</td><td>正反馈放大</td></tr>
            </tbody>
          </table>
        </div>
        <p>因此“银行是顺周期还是逆周期”没有脱离状态的固定答案。Abbassi 等发现银行可买入跌价证券却缩减贷款，Hanson 等解释稳定银行的耐心持有，系统性模型则展示资本稀缺时风险溢价上升；这些结论只有放进具体资产、负债与时钟才能共存。<Cite n={39} /><Cite n={40} /><Cite n={51} /><Cite n={52} /></p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">阶段七 · 研究、实验与接口　|　50 · 贷款供给识别协议</p>
        <h2>看到一家银行贷款下降，还不能知道它主动缩供给；先用同一借款人、申请与关系数据隔离需求，再追踪实体替代。</h2>
        <div className="research-card">
          <span>EMPIRICAL DESIGN · BORROWER × BANK × TIME</span>
          <h3>核心问题：外生或预定的银行资产负债表冲击，是否使同一借款人在同一时期从受冲击银行获得更少信用？</h3>
          <p>教学式：ΔCredit<sub>ibt</sub> = α<sub>it</sub> + α<sub>ib</sub> + β(Exposure<sub>b</sub>×Post<sub>t</sub>) + Γ(X<sub>b,pre</sub>×Post<sub>t</sub>) + ε<sub>ibt</sub>。借款人×时间固定效应吸收同一企业当期共同需求，银行—借款人固定效应吸收稳定关系差异；X 只放入预定或处理前银行特征。当期资本、流动性和融资成本属于第一阶段或机制结果，不应在基准式中被误控；β 仍依赖冲击外生性、样本选择与标准误设计。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>冻结冲击：</b>使用事前证券敞口、外国母行损失、监管演练或其他尽量独立于当地需求的变化。</li>
          <li><b>验证第一阶段：</b>冲击确实改变资本余量、流动性、融资成本或抵押品，而不只是标签。</li>
          <li><b>观察合同边际：</b>申请、批准、利率、额度、提款、抵押、期限和续作优于单一余额。</li>
          <li><b>检查替代：</b>其他银行、债券、供应链与非银行融资是否补上关系银行收缩。</li>
          <li><b>连接实体：</b>总信用之后再检验投资、就业、销售、库存和违约；局部份额不是总量效应。</li>
          <li><b>保护推断：</b>冲击赋值层级聚类，银行很少时考虑 wild bootstrap/随机化推断，并检查前趋势与退出。</li>
        </ol>
        <p>这套协议来自贷款级识别研究的共同逻辑，而不是一个万能回归模板。<Cite n={32} /><Cite n={33} /><Cite n={34} /><Cite n={35} /><Cite n={36} /> Fire-sale 研究还需额外证明出售具有约束驱动性、买方资本有限，并估计共同持仓和价格冲击。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} /></p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">51 · 互动实验</p>
        <h2>十道题只做一件事：每次冲击后先配平，再识别最先变紧的约束与真正剩余的修复任务。</h2>
        <BankIntermediaryLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">52 · 主动练习</p>
        <h2>以下十道无脚本变式与互动实验共享同一数据源；先独立计算，再展开核对答案。</h2>
        <div className="exercise-list">
          {bankScenarios.map((scenario, index) => (
            <article className="practice-problem" key={scenario.id}>
              <span>练习 {String(index + 1).padStart(2, '0')} · {scenario.staticTwin.title}</span>
              <p>{scenario.staticTwin.prompt}</p>
              <details className="practice-answer"><summary>展开核对答案</summary><p>{scenario.staticTwin.answer}</p></details>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">53 · 理解检查</p>
        <h2>如果不能分清下面十二组概念，就还没有真正把“银行创造信用”连接到有限资产负债表。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么贷款创造存款，却不创造资本？</summary><p>银行新增贷款资产和等额存款负债，资产与负债同步增加，残余权益不变；只有利润留存或外部增资等才增加资本。</p></details>
          <details><summary>02 · 借款人花掉贷款，为什么贷款本金不下降？</summary><p>支出改变存款归属和跨行准备金，贷款仍是借款人对发放行的债务；只有偿还本金才同时缩小贷款与存款。</p></details>
          <details><summary>03 · 准备金、存款和资本为什么不是三种“钱”而已？</summary><p>准备金是银行对央行的资产，存款是银行欠客户的负债，资本是资产减负债后的损失吸收层；发行人、持有人和功能不同。</p></details>
          <details><summary>04 · CET1/RWA 与杠杆率为什么必须并列？</summary><p>前者按风险权重读取资本，后者用更广的非风险加权暴露作后备约束；低权重资产仍可能扩张总杠杆。</p></details>
          <details><summary>05 · 资本充足为何仍可能缺流动性？</summary><p>经济上可收回的长期资产未必能在今日截止前换成现金；支付需要准备金、可变现资产或确认融资。</p></details>
          <details><summary>06 · LCR 与 NSFR 为什么不能互换？</summary><p>LCR 是 30 日标准化压力缓冲，NSFR 是约一年结构性稳定融资；二者都不能替代日内现金台账。</p></details>
          <details><summary>07 · HQLA、央行合格抵押品与可用抵押品为何不同？</summary><p>监管认可、央行资格和今日未设押/操作就绪是三套条件；已质押、未测试或受法律限制的资产不能按面值计入可借现金。</p></details>
          <details><summary>08 · NII 上升为何仍可能 EVE 下降？</summary><p>短期资产收益可比负债成本更快重定价，而长久期资产经济价值仍因加息下降；收入与价值使用不同时间尺度。</p></details>
          <details><summary>09 · 会计未实现损失为何既不是零，也不等于即时失败？</summary><p>分类可推迟损益确认，却不消除经济与抵押价值变化；银行若融资稳定可等待，若遭流失出售则可能实现损失。</p></details>
          <details><summary>10 · 存款保险为何不能消除所有挤兑？</summary><p>覆盖有法定限额、主体与账户聚合边界；大额未保险、操作风险、关系网络和对资产质量的担忧仍可触发迁移。</p></details>
          <details><summary>11 · 卖出风险资产为何可能恶化资本率？</summary><p>出售减少 RWA，却可能以低于账面价值成交并减少 CET1；实现损失若超过 RWA relief 对 headroom 的改善，净效果为负。</p></details>
          <details><summary>12 · 贷款余额下降为何不能直接证明银行缩供给？</summary><p>借款需求、正常偿还、核销、出售、证券化和汇率都能降低余额；需用申请、关系与同一借款人设计分离供需。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-map">
        <p className="section-kicker">54 · 课程接口</p>
        <h2>2.06 输出一张“单家银行状态—约束—动作”地图，不提前完成宏观信用、券商资产负债表或系统传染。</h2>
        <div className="interface-grid">
          <article><span>← T06 / 2.01 / 2.05</span><h3>Balance Sheet & Constraints</h3><p>调用资产负债表和状态—目标—约束语言；与养老金/保险共享资本和流动性分账，但不共享承诺结构。</p></article>
          <article><span>→ 2.07</span><h3>Broker–Dealer</h3><p>只输出银行批发融资、回购、抵押品和证券头寸接口；dealer inventory、prime brokerage、客户保证金与做市后讲。</p></article>
          <article><span>→ 2.16–2.18</span><h3>Risk, Redemption & Benchmark</h3><p>资本/LCR/NSFR 是机构约束实例；通用 VaR、风险预算留给 2.16，存款提款不是基金赎回，银行也不以 tracking error 为核心目标。</p></article>
          <article><span>→ 3.09–3.12</span><h3>Credit & Monetary Transmission</h3><p>输出贷款—存款 T-account、贷款数量和银行状态；货币总量、政策冲击识别、借款人抵押品与风险承担渠道后讲。</p></article>
          <article><span>→ 4.06</span><h3>Global Banks</h3><p>本节冻结一个币种与国内结算；跨境内部资本市场、美元融资、FX、home/host 监管和分支/子公司传导留后。</p></article>
          <article><span>→ 7.11–7.14</span><h3>Systemic Feedback</h3><p>本节只闭合一家银行的流失—出售—资本—信用回路；共同持仓、网络、市场×融资螺旋与聚合杠杆周期留给 Chapter 7。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="closing-diagnostic">
        <p className="section-kicker">55 · 最终诊断</p>
        <h2>面对任何“银行会扩贷、卖债或出问题”的判断，先重建账本，再寻找最紧约束；不要从一个比率直接跳到唯一订单。</h2>
        <p className="closing-thesis">
          先冻结持牌法人、合并范围、币种、会计口径和规则版本；列出准备金、现金、证券、贷款、衍生品、存款、批发融资、表外承诺与权益，验证 A=L+E；把审批、提款、支出、结算、偿还、违约、拨备和核销逐项过 T-account；分开账面、经济和监管资本，计算 RWA、CET1 headroom 与非风险加权杠杆；把 HQLA、未设押抵押品、haircut、日内现金、30 日净流出、ASF 和 RSF 放入各自时钟；让 NII 与 EVE 分别读取重定价和久期；再把存款集中、保险覆盖、beta、授信提用与批发融资展期加入压力。只有在这些状态冻结后，才能比较提高存款利率、借款、质押、卖证券、卖贷款、对冲、缩贷、留存利润和增资的联合效果。动作进入信用与市场后，价格、借款人现金流和存款信心会立刻回写下一轮资产负债表；这才是银行作为杠杆中介，而不是普通投资者的完整含义。
        </p>
      </section>
    </>
  );
}

export const lesson206: LessonRecord = {
  slug: '2-06',
  id: '2.06',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Banks as Leveraged Intermediaries：资产负债表、信用与约束',
  subtitle: '从贷款—存款双重记账出发，解释资本、RWA、杠杆、流动性和稳定融资怎样把信用、利率与存款冲击转化为贷款供给、融资、证券订单与反馈',
  readingTime: '核心阅读约 100–120 分钟；互动实验快速 25–30／含复盘 45–55，主动练习核对 25–30／完整书写 45–60，理解检查快速 10–12／完整复述 18–22，课程接口 4 分钟；快速路径约 164–196 分钟，完整学习约 212–261 分钟（建议分两至三次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T06；按需回看 T02、1.20、2.01 与 2.05',
  updatedAt: '2026-08-30',
  revision: '2.06-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.06-r2',
      summary: '冻结 r2 无 P0/P1；要求拆分 NSF20 与 NSF30 的证据职责、修正贷款定价量纲、补入欧盟 2026 存款保证修法时序、校正 Basel 章名并为 AOCI/CET1 增加邻接法源。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.06-r2',
      summary: '冻结 r2 无 P0/P1；唯一 P2 为手机端完整展开 56 项目录会把正文推迟数屏，要求限制目录视窗高度并保留键盘可滚动路径。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.06-r3',
      summary: '冻结 r3 的 r2 修复均通过，无 P0–P2；唯一 P3 要求进一步区分欧盟指令的生效、成员国采用并公布转置措施以及规则开始适用三个法律时点。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.06-r3',
      summary: '冻结 r3 的 56 节学习路径、19 个公式卡、十题互动与静态替代、SSR、无脚本、存储恢复、320px 布局、无障碍和导航全部通过；只读类型检查、ESLint 与现有服务 SSR 门禁通过，未重新运行会写产物的生产构建，P0–P3 全清。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.06-r4',
      summary: '冻结 r4 准确区分 Directive (EU) 2026/804 的生效、转置采用公布、适用起点和预防措施时点；83 条来源、162 处引文、公式、二十道题与全部历史修复回归通过，P0–P3 全清。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.06-r4',
      summary: '冻结 r4 的法律时序新增文字清楚且可在 320px 正常换行；56 节、公式、来源、互动与静态替代、移动目录、SSR、无脚本、无障碍和导航均无回归，P0–P3 全清。',
    },
  ],
  previous: { slug: '2-05', label: '2.05 Pension / Insurance Capital' },
  next: { slug: '2-07', label: '2.07 Broker–Dealer / Securities Firms' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整系统' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'bank-charter-promise', label: '银行牌照与承诺' },
    { id: 'actor-map', label: '主体地图' },
    { id: 'balance-sheet-identity', label: '资产负债表恒等式' },
    { id: 't-account-reading', label: 'T-account' },
    { id: 'asset-liability-equity', label: '资产、负债与权益' },
    { id: 'stock-flow-valuation', label: '存量、流量与估值' },
    { id: 'bank-versus-other-intermediaries', label: '机构边界' },
    { id: 'loan-origination', label: '贷款形成' },
    { id: 'loan-creates-deposit', label: '贷款创造存款' },
    { id: 'borrower-spending', label: '借款人支出' },
    { id: 'interbank-settlement', label: '跨行结算' },
    { id: 'cash-withdrawal', label: '现金提取' },
    { id: 'repayment-default-writeoff', label: '偿还、违约与核销' },
    { id: 'bank-system-boundary', label: '单家与体系' },
    { id: 'equity-loss-absorption', label: '第一损失' },
    { id: 'regulatory-capital', label: '监管资本' },
    { id: 'rwa-construction', label: 'RWA' },
    { id: 'capital-ratio', label: '资本率与余量' },
    { id: 'off-balance-sheet-exposure', label: '表外承诺' },
    { id: 'leverage-ratio', label: '杠杆率' },
    { id: 'capital-versus-liquidity', label: '资本与流动性' },
    { id: 'capital-headroom-actions', label: '资本修复动作' },
    { id: 'reserves-and-cash', label: '准备金与现金' },
    { id: 'hqla-haircuts', label: 'HQLA 与 Haircut' },
    { id: 'runoff-inflow-clock', label: '流出与流入时钟' },
    { id: 'lcr', label: 'LCR' },
    { id: 'available-stable-funding', label: 'ASF' },
    { id: 'required-stable-funding', label: 'RSF' },
    { id: 'nsfr', label: 'NSFR' },
    { id: 'deposit-funding-behavior', label: '存款融资与特许权' },
    { id: 'contingency-funding-collateral', label: '应急融资与抵押品' },
    { id: 'repricing-gap', label: '重定价缺口' },
    { id: 'net-interest-income', label: 'NII' },
    { id: 'economic-value-duration', label: 'EVE 与久期' },
    { id: 'deposit-beta', label: 'Deposit Beta' },
    { id: 'credit-loss-provision', label: '信用损失与拨备' },
    { id: 'deposit-runoff-stress', label: '存款流失与 SVB' },
    { id: 'wholesale-rollover-stress', label: '批发融资压力' },
    { id: 'constraint-stack', label: 'Constraint Stack' },
    { id: 'loan-price-quantity', label: '贷款价格与数量' },
    { id: 'committed-versus-new-credit', label: '承诺与新信用' },
    { id: 'securities-liquidity-portfolio', label: '证券与流动性组合' },
    { id: 'remediation-waterfall', label: '修复瀑布与处置' },
    { id: 'funding-and-asset-orders', label: '融资与资产订单' },
    { id: 'fire-sale-loss-loop', label: 'Fire-sale Loop' },
    { id: 'credit-supply-feedback', label: '信用供给反馈' },
    { id: 'state-dependent-response', label: '状态依赖响应' },
    { id: 'research-protocol', label: '研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'interfaces-map', label: '课程接口' },
    { id: 'closing-diagnostic', label: '最终诊断' },
  ],
  Content: Lesson206Content,
  references: [
    { id: 1, authors: 'Bank of England', year: '2014', accessedAt: '2026-08-30', title: 'Money Creation in the Modern Economy', publication: 'Quarterly Bulletin 2014 Q1', url: 'https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy', use: '核对贷款与存款同时生成、本金偿还和准备金边界；英国机制说明不等于全球统一法律。' },
    { id: 2, authors: 'Deutsche Bundesbank', year: '2017', accessedAt: '2026-08-30', title: 'The Role of Banks, Non-banks and the Central Bank in the Money Creation Process', publication: 'Monthly Report, April 2017', url: 'https://www.bundesbank.de/en/publications/search/the-role-of-banks-non-banks-and-the-centralbank-in-the-money-creation-process-654284', use: '核对银行无需先获得逐笔匹配存款/超额准备金，同时仍受资本、风险、需求和融资约束。' },
    { id: 3, authors: 'European Central Bank', year: '2015/2024', accessedAt: '2026-08-30', title: 'What Is Money?', publication: 'ECB Explainer; updated 19 June 2024', url: 'https://www.ecb.europa.eu/ecb-and-you/explainers/tell-me-more/html/what_is_money.en.html', use: '区分现金、商业银行存款与中央银行准备金的发行主体和持有人。' },
    { id: 4, authors: 'CPMI and IOSCO', year: '2012/current', accessedAt: '2026-08-30', title: 'Principles for Financial Market Infrastructures', publication: 'BIS CPMI-IOSCO official framework', url: 'https://www.bis.org/committees/cpmi/pfmi/overview', use: '支持以中央银行货币结算可降低结算资产发行人风险；不外推具体账户准入。' },
    { id: 5, authors: 'Basel Committee on Banking Supervision', year: 'current', accessedAt: '2026-08-30', title: 'BCBS Charter', publication: 'Official BIS charter', url: 'https://www.bis.org/bcbs/charter.htm', use: '明确 BCBS 没有超国家立法权，标准须由各法域实施。' },
    { id: 6, authors: 'Bank for International Settlements, Financial Stability Institute', year: '2019', accessedAt: '2026-08-30', title: 'Basel Framework: Scope of Application — Executive Summary', publication: 'FSI Executive Summary', url: 'https://www.bis.org/fsi/fsisummaries/scope_app.htm', use: '核对 Basel Framework 的单体与合并适用范围；法律人格定义另引 SCA20。' },
    { id: 7, authors: '全国人民代表大会常务委员会', year: '2015/current', accessedAt: '2026-08-30', title: '中华人民共和国商业银行法', publication: '中国商业银行基础法律', url: 'https://www.samr.gov.cn/zw/zfxxgk/fdzdgknr/bgt/art/2023/art_35aff5bda2374572b8eb87cafcd1541a.html', use: '核对中国商业银行法律主体、经营原则与接管/终止框架；不使用修法征求意见稿替代现行法。' },
    { id: 8, authors: 'Basel Committee on Banking Supervision', year: 'current', accessedAt: '2026-08-30', title: 'Basel Framework', publication: 'Consolidated international prudential standards', url: 'https://www.bis.org/committees/bcbs/basel-framework', use: '提供资本、RWA、杠杆、LCR 与 NSFR 的国际标准总入口；各地实施另行核对。' },
    { id: 9, authors: 'Basel Committee on Banking Supervision', year: '2019/current', accessedAt: '2026-08-30', title: 'CAP10: Definition of Eligible Capital', publication: 'Consolidated Basel Framework; version in force from 15 December 2019', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cap/10/inforce/2019-12-15/published/2019-12-15', use: '核对 CET1、AT1、Tier 2 的合格标准和监管调整，避免把会计权益当作监管资本。' },
    { id: 10, authors: 'Basel Committee on Banking Supervision', year: '2020/2023', accessedAt: '2026-08-30', title: 'RBC20: Calculation of Minimum Risk-based Capital Requirements', publication: 'Consolidated Basel Framework; version in force from 1 January 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/rbc/20/inforce/2023-01-01/published/2020-11-26', use: '核对 Basel 风险资本率最低标准；不是任何一家银行的完整当地资本栈。' },
    { id: 11, authors: 'Basel Committee on Banking Supervision', year: '2019/current', accessedAt: '2026-08-30', title: 'RBC30: Buffers above the Regulatory Minimum', publication: 'Consolidated Basel Framework; version in force from 15 December 2019', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/rbc/30/inforce/2019-12-15/published/2019-12-15', use: '核对资本留存缓冲及分配限制，不把进入缓冲区误写成自动停止经营。' },
    { id: 12, authors: 'Basel Committee on Banking Supervision', year: '2020/2023', accessedAt: '2026-08-30', title: 'LEV20: Calculation', publication: 'Consolidated Basel Framework; version in force from 1 January 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lev/20/inforce/2023-01-01/published/2020-03-27', use: '核对 Tier 1/总敞口、3% Basel 基准和表内外分母；不等同 A/E 倒数。' },
    { id: 13, authors: 'Basel Committee on Banking Supervision', year: '2022/current', accessedAt: '2026-08-30', title: 'LCR20: Calculation', publication: 'Consolidated Basel Framework; current version published 8 December 2022', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lcr/20/inforce/2019-12-15/published/2022-12-08', use: '核对 LCR 结构、正常状态 100% 基准和压力中使用缓冲的边界。' },
    { id: 14, authors: 'Basel Committee on Banking Supervision', year: '2020/current', accessedAt: '2026-08-30', title: 'LCR30: High-quality Liquid Assets', publication: 'Consolidated Basel Framework; current version published 5 June 2020', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lcr/30/inforce/2019-12-15/published/2020-06-05', use: '核对 HQLA 资格、未设押、控制和操作性变现条件。' },
    { id: 15, authors: 'Basel Committee on Banking Supervision', year: '2023/current', accessedAt: '2026-08-30', title: 'LCR40: Cash Inflows and Outflows', publication: 'Consolidated Basel Framework; current version published 30 March 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lcr/40/inforce/2019-12-15/published/2023-03-30', use: '核对 30 日压力流量、流失分类与流入上限。' },
    { id: 16, authors: 'Basel Committee on Banking Supervision', year: '2019/current', accessedAt: '2026-08-30', title: 'NSF20: Calculation and Reporting', publication: 'Consolidated Basel Framework; version in force from 15 December 2019', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/nsf/20/inforce/2019-12-15/published/2019-12-15', use: '核对 NSFR 比率计算、最低 100% 基准与报告要求；ASF、RSF 分类和权重另引 NSF30。' },
    { id: 17, authors: 'Basel Committee on Banking Supervision', year: '2024/2026', accessedAt: '2026-08-30', title: 'SRP31: Interest Rate Risk in the Banking Book', publication: 'Consolidated Basel Framework; version effective 1 January 2026', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/srp/31/inforce/2026-01-01/published/2024-07-16', use: '核对 EVE、NII、行为假设与监管冲击；属于 Pillar 2 IRRBB 框架。' },
    { id: 18, authors: '国家金融监督管理总局', year: '2023/2024', accessedAt: '2026-08-30', title: '商业银行资本管理办法', publication: '国家金融监督管理总局令 2023 年第 4 号；2024 年 1 月 1 日施行', url: 'https://www.nfra.gov.cn/cn/view/pages/rulesDetail.html?docId=1134197&itemId=4214', use: '核对中国资本、杠杆、分档与适用范围；不得与 Basel 或美国口径直接互换。' },
    { id: 19, authors: '原中国银保监会', year: '2018/current', accessedAt: '2026-08-30', title: '商业银行流动性风险管理办法', publication: '中国商业银行现行流动性规则入口', url: 'https://www.nfra.gov.cn/cn/view/pages/ItemDetail.html?docId=180252', use: '核对中国 LCR、NSFR 等流动性指标及规模适用差异。' },
    { id: 20, authors: 'Board of Governors of the Federal Reserve System', year: 'current', accessedAt: '2026-08-30', title: 'Regulation Q: Capital Adequacy', publication: 'Federal Reserve Regulatory Resources', url: 'https://www.federalreserve.gov/frrs/regulations/regulation-q-capital-adequacy-of-bank-holding-companies-savings-and-loan-holding-companies-and-state-member-banks.htm', use: '提供美国资本规则入口；不同银行类别和 tailoring 仍须另核。' },
    { id: 21, authors: 'Board of Governors of the Federal Reserve System', year: '2026', accessedAt: '2026-08-30', title: 'Annual Large Bank Capital Requirements', publication: 'Official Federal Reserve supervision page; updated 24 June 2026', url: 'https://www.federalreserve.gov/supervisionreg/large-bank-capital-requirements.htm', use: '核对美国大行压力资本缓冲与附加要求，避免外推到所有银行。' },
    { id: 22, authors: 'Douglas W. Diamond and Philip H. Dybvig', year: '1983', title: 'Bank Runs, Deposit Insurance, and Liquidity', publication: 'Journal of Political Economy, 91(3), 401–419', url: 'https://doi.org/10.1086/261155', use: '流动性转换、风险共担与顺序兑付脆弱性的经典模型；不证明真实挤兑都与基本面无关。' },
    { id: 23, authors: 'Douglas W. Diamond', year: '1984', title: 'Financial Intermediation and Delegated Monitoring', publication: 'Review of Economic Studies, 51(3), 393–414', url: 'https://doi.org/10.2307/2297430', use: '解释中介集中监督与分散化的理论价值；不证明银行是唯一监督技术。' },
    { id: 24, authors: 'Gary Gorton and George Pennacchi', year: '1990', title: 'Financial Intermediaries and Liquidity Creation', publication: 'Journal of Finance, 45(1), 49–71', url: 'https://doi.org/10.1111/j.1540-6261.1990.tb05080.x', use: '解释信息不敏感高级负债与交易流动性；安全依赖资产和制度。' },
    { id: 25, authors: 'Douglas W. Diamond and Raghuram G. Rajan', year: '2000', title: 'A Theory of Bank Capital', publication: 'Journal of Finance, 55(6), 2431–2465; NBER Working Paper 7431', url: 'https://www.nber.org/papers/w7431', use: '解释资本、存续能力与关系银行承诺之间的契约权衡；不支持低资本政策结论。' },
    { id: 26, authors: 'Douglas W. Diamond and Raghuram G. Rajan', year: '2001', title: 'Liquidity Risk, Liquidity Creation, and Financial Fragility: A Theory of Banking', publication: 'Journal of Political Economy, 109(2), 287–327', url: 'https://doi.org/10.1086/319552', use: '说明可撤回债务的承诺价值与脆弱性同源；严格保留模型条件。' },
    { id: 27, authors: 'Anil K. Kashyap, Raghuram Rajan and Jeremy C. Stein', year: '2002', title: 'Banks as Liquidity Providers: An Explanation for the Coexistence of Lending and Deposit-Taking', publication: 'Journal of Finance, 57(1), 33–73', url: 'https://doi.org/10.1111/1540-6261.00415', use: '解释存款提款与授信提用共享流动性池的协同及压力相关性边界。' },
    { id: 28, authors: 'Bengt Holmström and Jean Tirole', year: '1997', title: 'Financial Intermediation, Loanable Funds, and the Real Sector', publication: 'Quarterly Journal of Economics, 112(3), 663–691', url: 'https://doi.org/10.1162/003355397555316', use: '中介资本与借款人净值进入融资的理论模型；模型资本不等同法定 CET1。' },
    { id: 29, authors: 'Ben S. Bernanke and Alan S. Blinder', year: '1988', title: 'Credit, Money, and Aggregate Demand', publication: 'American Economic Review, 78(2), 435–439; NBER Working Paper 2534', url: 'https://www.nber.org/papers/w2534', use: '银行贷款与其他融资不完全替代时的贷款渠道理论起点。' },
    { id: 30, authors: 'Ben S. Bernanke and Mark Gertler', year: '1995', title: 'Inside the Black Box: The Credit Channel of Monetary Policy Transmission', publication: 'Journal of Economic Perspectives, 9(4), 27–48', url: 'https://doi.org/10.1257/jep.9.4.27', use: '提供信用渠道综述与借款人资产负债表接口；非单一因果估计。' },
    { id: 31, authors: 'Anil K. Kashyap and Jeremy C. Stein', year: '2000', title: 'What Do a Million Observations on Banks Say about the Transmission of Monetary Policy?', publication: 'American Economic Review, 90(3), 407–428', url: 'https://doi.org/10.1257/aer.90.3.407', use: '美国银行异质性证据；不外推到所有准备金制度和银行类型。' },
    { id: 32, authors: 'Asim Ijaz Khwaja and Atif Mian', year: '2008', title: 'Tracing the Impact of Bank Liquidity Shocks: Evidence from an Emerging Market', publication: 'American Economic Review, 98(4), 1413–1442', url: 'https://doi.org/10.1257/aer.98.4.1413', use: '同一借款人跨银行设计识别贷款供给冲击，并保留局部样本边界。' },
    { id: 33, authors: 'Gabriel Jiménez, Steven Ongena, José-Luis Peydró and Jesús Saurina', year: '2012', title: 'Credit Supply and Monetary Policy: Identifying the Bank Balance-Sheet Channel with Loan Applications', publication: 'American Economic Review, 102(5), 2301–2326', url: 'https://doi.org/10.1257/aer.102.5.2301', use: '用贷款申请区分供需及资本/流动性异质性；不把余额相关性当识别。' },
    { id: 34, authors: 'Joe Peek and Eric S. Rosengren', year: '2000', title: 'Collateral Damage: Effects of the Japanese Bank Crisis on Real Activity in the United States', publication: 'American Economic Review, 90(1), 30–45', url: 'https://doi.org/10.1257/aer.90.1.30', use: '识别外国银行资本冲击的跨境实体影响；特定地产与历史样本。' },
    { id: 35, authors: 'Philipp Schnabl', year: '2012', title: 'The International Transmission of Bank Liquidity Shocks: Evidence from an Emerging Market', publication: 'Journal of Finance, 67(3), 897–932', url: 'https://doi.org/10.1111/j.1540-6261.2012.01737.x', use: '识别国际银行流动性冲击向国内贷款的传导。' },
    { id: 36, authors: 'Gabriel Chodorow-Reich', year: '2014', title: 'The Employment Effects of Credit Market Disruptions: Firm-level Evidence from the 2008–09 Financial Crisis', publication: 'Quarterly Journal of Economics, 129(1), 1–59', url: 'https://doi.org/10.1093/qje/qjt031', use: '把关系银行冲击连接到企业总信用与就业，并展示融资替代边界。' },
    { id: 37, authors: 'Reint Gropp, Thomas Mosk, Steven Ongena and Carlo Wix', year: '2019', title: 'Banks’ Response to Higher Capital Requirements: Evidence from a Quasi-Natural Experiment', publication: 'Review of Financial Studies, 32(1), 266–299', url: 'https://doi.org/10.1093/rfs/hhy052', use: '识别危机期突然资本缺口主要经 RWA 收缩修复；不推论稳态高资本有害。' },
    { id: 38, authors: 'Tobias Adrian and Hyun Song Shin', year: '2010', title: 'Liquidity and Leverage', publication: 'Journal of Financial Intermediation, 19(3), 418–437; NY Fed Staff Report 328', url: 'https://www.newyorkfed.org/research/staff_reports/sr328.html', use: '顺周期杠杆证据最强来自 broker-dealer；不可无条件套到商业银行。' },
    { id: 39, authors: 'Zhiguo He and Arvind Krishnamurthy', year: '2013', title: 'Intermediary Asset Pricing', publication: 'American Economic Review, 103(2), 732–770', url: 'https://doi.org/10.1257/aer.103.2.732', use: '中介资本约束进入风险溢价的结构模型；不是危机事件因果估计。' },
    { id: 40, authors: 'Markus K. Brunnermeier and Yuliy Sannikov', year: '2014', title: 'A Macroeconomic Model with a Financial Sector', publication: 'American Economic Review, 104(2), 379–421', url: 'https://doi.org/10.1257/aer.104.2.379', use: '非线性中介净值反馈的结构模型；教学链不当作原文逐字公式。' },
    { id: 41, authors: 'Itamar Drechsler, Alexi Savov and Philipp Schnabl', year: '2017', title: 'The Deposits Channel of Monetary Policy', publication: 'Quarterly Journal of Economics, 132(4), 1819–1876', url: 'https://doi.org/10.1093/qje/qjx019', use: '存款利率传导、数量外流与竞争的分支级证据；不假设存款成本固定。' },
    { id: 42, authors: 'Itamar Drechsler, Alexi Savov and Philipp Schnabl', year: '2021', title: 'Banking on Deposits: Maturity Transformation without Interest Rate Risk', publication: 'Journal of Finance, 76(3), 1091–1143', url: 'https://doi.org/10.1111/jofi.13013', use: '稳定低 beta 存款特许权与长期固定利率资产的经济对冲；不等于无利率风险。' },
    { id: 43, authors: 'Itamar Drechsler, Alexi Savov, Philipp Schnabl and Olivier Wang', year: '2026', title: 'Deposit Franchise Runs', publication: 'Journal of Finance, 81(3), 1573–1617', url: 'https://doi.org/10.1111/jofi.70034', use: '特许权价值流失型挤兑模型；与 Diamond–Dybvig 机制明确区分。' },
    { id: 44, authors: 'R. Iyer and M. Puri', year: '2012', title: 'Understanding Bank Runs: The Importance of Depositor-Bank Relationships and Networks', publication: 'American Economic Review, 102(4), 1414–1445', url: 'https://doi.org/10.1257/aer.102.4.1414', use: '真实挤兑中的关系、网络和保险边界；特定印度银行案例。' },
    { id: 45, authors: 'Charles W. Calomiris and Joseph R. Mason', year: '2003', title: 'Fundamentals, Panics, and Bank Distress During the Depression', publication: 'American Economic Review, 93(5), 1615–1647', url: 'https://doi.org/10.1257/000282803322655473', use: '基本面与恐慌并非互斥的历史实证；不直接外推数字化挤兑速度。' },
    { id: 46, authors: 'Itay Goldstein and Ady Pauzner', year: '2005', title: 'Demand-Deposit Contracts and the Probability of Bank Runs', publication: 'Journal of Finance, 60(3), 1293–1327', url: 'https://doi.org/10.1111/j.1540-6261.2005.00762.x', use: '将基本面与协调失败连接的全局博弈模型。' },
    { id: 47, authors: 'Andrei Shleifer and Robert W. Vishny', year: '1992', title: 'Liquidation Values and Debt Capacity: A Market Equilibrium Approach', publication: 'Journal of Finance, 47(4), 1343–1366', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04661.x', use: '自然买家受约束时的资产专用性和折价出售机制。' },
    { id: 48, authors: 'Markus K. Brunnermeier and Lasse Heje Pedersen', year: '2009', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies, 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '市场流动性与融资流动性相互强化的模型；不将任意跌价称作螺旋。' },
    { id: 49, authors: 'Robin Greenwood, Augustin Landier and David Thesmar', year: '2015', title: 'Vulnerable Banks', publication: 'Journal of Financial Economics, 115(3), 471–485', url: 'https://doi.org/10.1016/j.jfineco.2014.11.006', use: '目标杠杆和共同持仓的系统脆弱性测量；线性冲击是近似。' },
    { id: 50, authors: 'Fernando Duarte and Thomas M. Eisenbach', year: '2021', title: 'Fire-Sale Spillovers and Systemic Risk', publication: 'Journal of Finance, 76(3), 1251–1294', url: 'https://doi.org/10.1111/jofi.13010', use: '量化共同持仓与火售外溢；参数并非跨市场固定常数。' },
    { id: 51, authors: 'Puriya Abbassi, Rajkamal Iyer, José-Luis Peydró and Francesc R. Tous', year: '2016', title: 'Securities Trading by Banks and Credit Supply: Micro-Evidence from the Crisis', publication: 'Journal of Financial Economics, 121(3), 569–594', url: 'https://www.sciencedirect.com/science/article/pii/S0304405X16300964', use: '银行可承接证券同时缩贷的微观证据，反驳固定顺/逆周期标签。' },
    { id: 52, authors: 'Samuel G. Hanson, Andrei Shleifer, Jeremy C. Stein and Robert W. Vishny', year: '2015', title: 'Banks as Patient Fixed-Income Investors', publication: 'Journal of Financial Economics, 117(3), 449–469; NBER Working Paper 20288', url: 'https://www.nber.org/papers/w20288', use: '稳定融资银行作为耐心固定收益买家的机制；与高速流失状态区分。' },
    { id: 53, authors: 'Erica Xuewei Jiang, Gregor Matvos, Tomasz Piskorski and Amit Seru', year: '2024', title: 'Monetary Tightening and U.S. Bank Fragility in 2023: Mark-to-Market Losses and Uninsured Depositor Runs?', publication: 'Journal of Financial Economics, 159, 103899', url: 'https://www.sciencedirect.com/science/article/pii/S0304405X24001223', use: '统一重估资产并结合未保险杠杆的描述/反事实测量；不当作已实现失败预测。' },
    { id: 54, authors: 'Board of Governors of the Federal Reserve System', year: '2023', accessedAt: '2026-08-30', title: 'Review of the Federal Reserve’s Supervision and Regulation of Silicon Valley Bank — Key Takeaways', publication: 'Official Federal Reserve review', url: 'https://www.federalreserve.gov/publications/2023-April-SVB-Key-Takeaways.htm', use: '核对 SVB 的增长、治理、利率/流动性风险、存款集中和高速流出。' },
    { id: 55, authors: 'Board of Governors of the Federal Reserve System', year: '2023', accessedAt: '2026-08-30', title: 'Evolution of Silicon Valley Bank', publication: 'Official Federal Reserve review chapter', url: 'https://www.federalreserve.gov/publications/2023-April-SVB-Evolution-of-Silicon-Valley-Bank.htm', use: '核对美国 HTM/AFS、AOCI 与强制出售的案例事实；不替代完整会计准则。' },
    { id: 56, authors: 'Basel Committee on Banking Supervision', year: '2023', accessedAt: '2026-08-30', title: 'Report on the 2023 Banking Turmoil', publication: 'BCBS Report, October 2023', url: 'https://www.bis.org/bcbs/publ/d555.htm', use: '官方跨案例复盘快速流出、集中度、IRRBB、抵押品准备和反馈；不固定单一危机因果权重。' },
    { id: 57, authors: 'Board of Governors of the Federal Reserve System', year: '2025/current', accessedAt: '2026-08-30', title: 'Regulation A: Extensions of Credit by Federal Reserve Banks', publication: 'Official Federal Reserve regulation; effective 19 December 2025', url: 'https://www.federalreserve.gov/frrs/regulations/regulation-a-extensions-of-credit-by-federal-reserve-banks.htm', use: '核对美国联储银行信用延伸的主体、抵押与法律边界；不外推其他央行条款。' },
    { id: 58, authors: 'Board of Governors of the Federal Reserve System', year: '2024', accessedAt: '2026-08-30', title: 'Discount Window Readiness', publication: 'Official Federal Reserve operational guidance; updated 12 April 2024', url: 'https://www.federalreserve.gov/monetarypolicy/discount-window-readiness.htm', use: '核对预先质押、法律文件与操作测试的重要性。' },
    { id: 59, authors: 'Federal Deposit Insurance Corporation', year: 'current', accessedAt: '2026-08-30', title: 'Understanding Deposit Insurance', publication: 'Official FDIC consumer and legal guidance', url: 'https://www.fdic.gov/resources/deposit-insurance/understanding-deposit-insurance', use: '核对美国每位存款人/每家受保银行/每种所有权类别标准限额及非存款排除。' },
    { id: 60, authors: 'European Union', year: '2014/current', accessedAt: '2026-08-30', title: 'Directive 2014/49/EU on Deposit Guarantee Schemes', publication: 'EUR-Lex official text', url: 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX:32014L0049', use: '核对欧盟当前适用的基础存款保证指令；必须与 Directive (EU) 2026/804 的生效、转置和分阶段适用时间表合并阅读。' },
    { id: 61, authors: '中国人民银行', year: '2025', accessedAt: '2026-08-30', title: '存款保险条例修改了保障额度吗？', publication: '中国人民银行官方问答', url: 'https://wzdt.pbc.gov.cn/eportal/ui?msgDataId=d3f5c72a0157407e97b4998676c34ef2&pageId=77c3557bd521439ea5cd869f5393ba98', use: '核对中国现行最高偿付限额及条例修改边界；产品与聚合规则同时回到条例原文。' },
    { id: 62, authors: '中华人民共和国国务院', year: '2015/current', accessedAt: '2026-08-30', title: '存款保险条例', publication: '国务院令第 660 号', url: 'https://www.gov.cn/zhengce/content/2015-03/31/content_9562.htm', use: '核对中国同一存款人在同一投保机构本金利息合计最高偿付限额及超额债权边界。' },
    { id: 63, authors: 'IFRS Foundation', year: 'current', accessedAt: '2026-08-30', title: 'IFRS 9 Financial Instruments', publication: 'Official standard and project page', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ifrs-9-financial-instruments/', use: '核对金融资产分类、计量和预期信用损失入口；不与美国 HTM/AFS 等同。' },
    { id: 64, authors: '中华人民共和国财政部', year: '2017/current', accessedAt: '2026-08-30', title: '企业会计准则第 22 号——金融工具确认和计量', publication: '财会〔2017〕7 号附件', url: 'https://kjs.mof.gov.cn/zhengcefabu/201704/P020170406398225042083.pdf', use: '核对中国金融资产分类、计量和减值；不沿用旧分类名替代现行准则。' },
    { id: 65, authors: 'Basel Committee on Banking Supervision', year: '2020/2023', accessedAt: '2026-08-30', title: 'CRE40: Securitisation — General Provisions', publication: 'Consolidated Basel Framework; version in force from 1 January 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cre/40/inforce/2023-01-01/published/2020-11-26', use: '核对显著风险转移、保留敞口与资本处理的机制边界。' },
    { id: 66, authors: 'Financial Stability Board', year: '2024', accessedAt: '2026-08-30', title: 'Key Attributes of Effective Resolution Regimes for Financial Institutions — Revised Version 2024', publication: 'FSB international standard', url: 'https://www.fsb.org/2024/04/key-attributes-of-effective-resolution-regimes-for-financial-institutions-revised-version-2024/', use: '提供 bridge、转移、bail-in 与关键功能连续性标准；不是国内法。' },
    { id: 67, authors: 'Federal Deposit Insurance Corporation', year: '2025', accessedAt: '2026-08-30', title: 'Depository Institution Resolutions Handbook', publication: 'Official FDIC handbook dated 27 February 2025', url: 'https://www.fdic.gov/bank-failures/resolutions-handbook.pdf', use: '解释美国 receiver、purchase-and-assumption 等操作入口；权限本身回到 12 U.S.C. § 1821。' },
    { id: 68, authors: 'Single Resolution Board', year: 'current', accessedAt: '2026-08-30', title: 'Resolution Tools', publication: 'Official EU Single Resolution Board overview', url: 'https://www.srb.europa.eu/en/content/tasks-tools', use: '解释 sale of business、bridge、asset separation 与 bail-in；法律权限回到 SRMR/BRRD。' },
    { id: 69, authors: 'Farag, Harland and Nixon, Bank of England', year: '2013', accessedAt: '2026-08-30', title: 'Bank Capital and Liquidity', publication: 'Bank of England Quarterly Bulletin 2013 Q3', url: 'https://www.bankofengland.co.uk/quarterly-bulletin/2013/q3/bank-capital-and-liquidity', use: '用官方资产负债表解释资本与流动性的不同功能。' },
    { id: 70, authors: 'Michael S. Barr, Board of Governors of the Federal Reserve System', year: '2023', accessedAt: '2026-08-30', title: 'The Importance of Effective Liquidity Risk Management', publication: 'Official Federal Reserve speech, 1 December 2023', url: 'https://www.federalreserve.gov/newsevents/speech/barr20231201a.htm', use: '支持抵押品和操作准备可争取时间但不能修复有效资不抵债的边界。' },
    { id: 71, authors: 'European Union', year: '2013/2026', accessedAt: '2026-08-30', title: 'Regulation (EU) No 575/2013 on Prudential Requirements for Credit Institutions', publication: 'EUR-Lex consolidated text as of 26 June 2026', url: 'https://eur-lex.europa.eu/eli/reg/2013/575/2026-06-26/eng', use: '提供欧盟资本、适用主体与审慎要求的法源入口；不以 EBA 文档工具替代 authentic legislation。' },
    { id: 72, authors: 'Basel Committee on Banking Supervision', year: 'current', accessedAt: '2026-08-30', title: 'SCA20: Consolidated Supervision', publication: 'Basel consolidated guidelines', url: 'https://www.bis.org/committees/bcbs/basel-consolidated-guidelines/module/sca/20', use: '核对 branch/subsidiary 法律地位及 solo、sub-consolidated、consolidated supervision 的定义。' },
    { id: 73, authors: 'Basel Committee on Banking Supervision', year: '2025/current', accessedAt: '2026-08-30', title: 'CRE20: Standardised Approach — Individual Exposures', publication: 'Consolidated Basel Framework; version published 10 June 2025', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cre/20/inforce/2023-01-01/published/2025-06-10', use: '核对主权等暴露风险权重、表外信用转换及其资格和国家裁量边界。' },
    { id: 74, authors: 'Basel Committee on Banking Supervision', year: '2020/2023', accessedAt: '2026-08-30', title: 'CRE52: Standardised Approach to Counterparty Credit Risk', publication: 'Consolidated Basel Framework; version in force from 1 January 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cre/52/inforce/2023-01-01/published/2020-06-05', use: '核对衍生品当前重置成本、潜在未来暴露和对手方信用风险计量。' },
    { id: 75, authors: 'Basel Committee on Banking Supervision', year: '2020/2023', accessedAt: '2026-08-30', title: 'CRE22: Standardised Approach — Credit Risk Mitigation', publication: 'Consolidated Basel Framework; version in force from 1 January 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/cre/22/inforce/2023-01-01/published/2020-11-26', use: '核对担保与其他信用风险缓释只有满足资格、法律确定性和操作条件才可能改变 RWA。' },
    { id: 76, authors: 'Federal Financial Institutions Examination Council', year: '2026/current', accessedAt: '2026-08-30', title: 'FFIEC 041: Current Reporting Form and Instructions', publication: 'Official Consolidated Reports of Condition and Income instructions', url: 'https://www.ffiec.gov/resources/reporting-forms/ffiec041', use: '核对美国银行 HTM、AFS、OCI/AOCI 和信用损失的当前监管报告入口；不替代完整 GAAP codification。' },
    { id: 77, authors: 'Financial Accounting Standards Board', year: '2016', accessedAt: '2026-08-30', title: 'Accounting Standards Update No. 2016-13 — Financial Instruments—Credit Losses (Topic 326)', publication: 'Official FASB ASU: Measurement of Credit Losses on Financial Instruments', url: 'https://storage.fasb.org/ASU_2016-13.pdf', use: '核对美国 CECL 的原始计量目标；后续修订与当前 codification 仍须另核。' },
    { id: 78, authors: 'United States Congress', year: '2024/current', accessedAt: '2026-08-30', title: '12 U.S.C. § 1821 — Insurance Funds', publication: 'Official U.S. Code via GovInfo', url: 'https://www.govinfo.gov/link/uscode/12/1821', use: '核对 FDIC 作为 receiver、资产负债转移与受保存款机构处置的美国法定权限。' },
    { id: 79, authors: 'European Union', year: '2014/2026', accessedAt: '2026-08-30', title: 'Directive 2014/59/EU Establishing a Framework for the Recovery and Resolution of Credit Institutions and Investment Firms', publication: 'EUR-Lex BRRD consolidated text as of 11 May 2026', url: 'https://eur-lex.europa.eu/eli/dir/2014/59/2026-05-11/eng', use: '核对欧盟恢复与处置工具、权限及债权人保障的法律框架。' },
    { id: 80, authors: 'European Union', year: '2014/2026', accessedAt: '2026-08-30', title: 'Regulation (EU) No 806/2014 Establishing the Single Resolution Mechanism', publication: 'EUR-Lex SRMR consolidated text as of 11 June 2026', url: 'https://eur-lex.europa.eu/eli/reg/2014/806/2026-06-11/eng', use: '核对 SRB 与国家处置机构在单一处置机制中的权限和工具。' },
    { id: 81, authors: 'Federal Reserve Banks', year: '2026/current', accessedAt: '2026-08-30', title: 'Collateral Valuation', publication: 'Federal Reserve Discount Window official guidance; effective 1 July 2026', url: 'https://www.frbdiscountwindow.org/pages/collateral/collateral_valuation', use: '核对美国 discount window 抵押品的估值、margin/haircut 与可借价值；不外推其他央行。' },
    { id: 82, authors: 'Basel Committee on Banking Supervision', year: '2024/current', accessedAt: '2026-08-30', title: 'NSF30: Available and Required Stable Funding', publication: 'Consolidated Basel Framework; current version published 5 July 2024', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/nsf/30/inforce/2019-12-15/published/2024-07-05', use: '核对 ASF 与 RSF 的类别、稳定性期限和规则权重；NSFR 比率计算与报告另引 NSF20。' },
    { id: 83, authors: 'European Union', year: '2026', accessedAt: '2026-08-30', title: 'Directive (EU) 2026/804 Amending Directive 2014/49/EU as Regards the Scope of Deposit Protection, the Use of Deposit Guarantee Schemes Funds, Cross-border Cooperation, and Transparency', publication: 'EUR-Lex Official Journal; entered into force 10 May 2026', url: 'https://eur-lex.europa.eu/eli/dir/2026/804/oj/eng', use: '核对修法于 2026 年 5 月 10 日生效；成员国最迟于 2028 年 5 月 11 日采用并公布转置措施并自该日起适用，指定预防措施条款自 2029 年 5 月 11 日适用。' },
  ],
  readingList: [
    { title: 'Bank of England (2014) · Money Creation in the Modern Economy', scope: '全文与资产负债表框图', reason: '先纠正“先有存款再贷款”和“准备金机械倍增”两个对称误区。', url: 'https://www.bankofengland.co.uk/quarterly-bulletin/2014/q1/money-creation-in-the-modern-economy' },
    { title: 'Deutsche Bundesbank (2017) · Money Creation Process', scope: '银行、非银行与央行分工及约束段落', reason: '把贷款—存款分录连接到单家银行融资、风险与货币政策。', url: 'https://www.bundesbank.de/en/publications/search/the-role-of-banks-non-banks-and-the-centralbank-in-the-money-creation-process-654284' },
    { title: 'Diamond & Dybvig (1983)', scope: '模型环境、风险共担、挤兑均衡与保险', reason: '理解流动性创造和脆弱性为何来自同一合同结构。', url: 'https://doi.org/10.1086/261155' },
    { title: 'Diamond (1984)', scope: '委托监督、分散化与激励约束', reason: '回答为什么贷款监督会集中到中介，而不只记住“银行放贷”。', url: 'https://doi.org/10.2307/2297430' },
    { title: 'Gorton & Pennacchi (1990)', scope: '信息不敏感债务与流动性创造', reason: '理解存款适合支付的契约基础及其尾部边界。', url: 'https://doi.org/10.1111/j.1540-6261.1990.tb05080.x' },
    { title: 'Diamond & Rajan (2000)', scope: '资本、关系贷款与脆弱负债的契约权衡', reason: '避免把资本讨论降格成单纯比率越高越好或越低越好。', url: 'https://www.nber.org/papers/w7431' },
    { title: 'Diamond & Rajan (2001)', scope: '流动性创造、可撤回债务和金融脆弱性', reason: '理解承诺机制为何可能依赖一种有纪律作用的脆弱负债。', url: 'https://doi.org/10.1086/319552' },
    { title: 'Kashyap, Rajan & Stein (2002)', scope: '共同流动性池、存款与授信提用协方差', reason: '理解为何存款与贷款承诺共存，以及压力相关性为何重要。', url: 'https://doi.org/10.1111/1540-6261.00415' },
    { title: 'Holmström & Tirole (1997)', scope: '企业/中介资本与可融资项目', reason: '建立“资本约束怎样进入实体融资”的理论接口。', url: 'https://doi.org/10.1162/003355397555316' },
    { title: 'Basel CAP10 / RBC20 / RBC30', scope: '资本定义、最低要求与缓冲', reason: '把会计权益、合格资本、RWA 与分配限制逐项分开。', url: 'https://www.bis.org/committees/bcbs/basel-framework' },
    { title: 'Basel LEV20', scope: '分子、表内外暴露与最低标准', reason: '理解低风险权重资产为什么仍会占用总杠杆空间。', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lev/20/inforce/2023-01-01/published/2020-03-27' },
    { title: 'Basel LCR20 / LCR30 / LCR40', scope: '比率、HQLA 操作性与压力流量', reason: '从名义安全资产过渡到真正可用的短期流动性。', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lcr/20/inforce/2019-12-15/published/2022-12-08' },
    { title: 'Basel NSF20 / NSF30', scope: 'ASF、RSF 与约一年期限', reason: '把今日现金与结构性稳定融资彻底分开。', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/nsf/30/inforce/2019-12-15/published/2024-07-05' },
    { title: 'Basel SRP31 · IRRBB', scope: 'EVE、NII、行为假设和监管冲击', reason: '建立银行利率风险的双时钟，而非只看债券公允价值。', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/srp/31/inforce/2026-01-01/published/2024-07-16' },
    { title: 'Bernanke & Blinder (1988)', scope: '信贷、货币与总需求模型', reason: '理解贷款不可完全替代时，银行资产负债表如何进入宏观传导。', url: 'https://www.nber.org/papers/w2534' },
    { title: 'Kashyap & Stein (2000)', scope: '银行规模、流动性与货币传导的异质性', reason: '训练将理论渠道变成银行级可检验差异。', url: 'https://doi.org/10.1257/aer.90.3.407' },
    { title: 'Khwaja & Mian (2008)', scope: '同一企业跨银行设计、替代与总量效应', reason: '学习贷款供给识别的基准结构。', url: 'https://doi.org/10.1257/aer.98.4.1413' },
    { title: 'Jiménez et al. (2012)', scope: '贷款申请、审批、银行资本与货币冲击', reason: '看到为什么申请数据优于期末贷款余额。', url: 'https://doi.org/10.1257/aer.102.5.2301' },
    { title: 'Schnabl (2012)', scope: '外国银行冲击、当地需求控制与跨境传导', reason: '为 4.06 全球银行建立识别接口。', url: 'https://doi.org/10.1111/j.1540-6261.2012.01737.x' },
    { title: 'Chodorow-Reich (2014)', scope: '关系银行、融资替代与就业结果', reason: '把银行局部冲击连接到企业总融资和实体结果。', url: 'https://doi.org/10.1093/qje/qjt031' },
    { title: 'Drechsler, Savov & Schnabl (2017)', scope: '存款利率、数量、竞争与贷款', reason: '理解 deposit beta 同时具有价格和数量边际。', url: 'https://doi.org/10.1093/qje/qjx019' },
    { title: 'Drechsler, Savov & Schnabl (2021)', scope: '存款特许权估值与长期资产对冲', reason: '理解稳定存款为何有经济期限，以及假设失效在哪里。', url: 'https://doi.org/10.1111/jofi.13013' },
    { title: 'Iyer & Puri (2012)', scope: '真实挤兑中的关系网络和保险', reason: '用微观证据修正“所有挤兑都是纯恐慌”的叙事。', url: 'https://doi.org/10.1257/aer.102.4.1414' },
    { title: 'Shleifer & Vishny (1992)', scope: '自然买家、专用资产与清算价值', reason: '建立 fire sale 的必要条件，而不是把跌价当定义。', url: 'https://doi.org/10.1111/j.1540-6261.1992.tb04661.x' },
    { title: 'Brunnermeier & Pedersen (2009)', scope: '市场与融资流动性反馈', reason: '为 7.11 的流动性螺旋建立严格模型接口。', url: 'https://doi.org/10.1093/rfs/hhn098' },
    { title: 'He & Krishnamurthy (2013)', scope: '中介资本约束和风险溢价', reason: '理解资产价格为何会反映中介资产负债表的影子成本。', url: 'https://doi.org/10.1257/aer.103.2.732' },
    { title: 'Hanson et al. (2015)', scope: '耐心固定收益投资者的机制与数据', reason: '保留银行在正常状态承接卖盘的反例。', url: 'https://www.nber.org/papers/w20288' },
    { title: 'Federal Reserve SVB Review (2023)', scope: '增长、治理、利率风险、未保险存款与事件时间线', reason: '用一手复盘闭合多因素案例，拒绝单变量故事。', url: 'https://www.federalreserve.gov/publications/2023-April-SVB-Key-Takeaways.htm' },
    { title: 'BCBS Report on the 2023 Banking Turmoil', scope: '跨案例比较、数字化流出、IRRBB 和抵押品准备', reason: '区分个案事实与跨法域监管教训。', url: 'https://www.bis.org/bcbs/publ/d555.htm' },
    { title: 'FSB Key Attributes (2024)', scope: '处置目标、bridge、转移、bail-in 与连续性', reason: '理解流动性支持之后为何还需要可执行的失败处置。', url: 'https://www.fsb.org/2024/04/key-attributes-of-effective-resolution-regimes-for-financial-institutions-revised-version-2024/' },
  ],
};
