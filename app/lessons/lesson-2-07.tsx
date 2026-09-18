import BrokerDealerLab from '../components/BrokerDealerLab';
import { brokerDealerScenarios } from '../components/brokerDealerScenarios';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson207Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>券商／交易商不是把客户订单原样送进市场的透明管道，也不是能够无限承接订单的风险黑箱；它是把客户需求、融资合同、库存、抵押品和清算截止时间接到同一法律实体约束栈上的转换器。</h2>
        <p>
          同一机构可以在一笔交易中作为 broker 替客户寻找对手方，在另一笔交易中作为 dealer 以自身账户成为对手方。前者的核心动作是 agency、routing 与 search，后者会把现金、证券、应收应付、市场风险和结算义务带入 firm 的账本。客户卖出 100 单位，并不自动等于 dealer 最终多头增加 100：dealer 可以保留库存、立即转售、用相关资产对冲、在另一 venue 匹配客户，或因风险空间不足只提供较差价格和较小 size。<Cite n={1} /><Cite n={3} /><Cite n={55} /><Cite n={56} />
        </p>
        <p>
          因而，本节真正解释的是一条条件性因果链：<b>客户订单或融资需求首先改变哪一项资产、负债、抵押品或未交收头寸；净资本、客户资产保护、margin、融资、清算和内部限额中哪一项最先变紧；dealer 随后选择 principal fill、agency、hedge、融资调整还是缩量报价；这些动作怎样进入 spread、depth、price impact 与跨市场订单；价格和资金状态又怎样回写下一轮 headroom。</b> 资产负债表余量充足时，库存吸收可以形成负反馈；约束接近上限时，同一订单可能触发撤报价、追加保证金和同步减仓，形成正反馈。<Cite n={60} /><Cite n={61} /><Cite n={65} /><Cite n={70} /><Cite n={83} /><Cite n={86} />
        </p>
        <p>
          法律名称必须先冻结。本节以美国 broker-dealer 为主模型，以欧盟 investment firm 和中国证券公司作受限对照；三者的会计权益、监管资本、客户资金保护和处置制度不能互换。“Broker–Dealer / Securities Firms”是课程接口标题，不宣称全球存在一种统一法律主体。<Cite n={1} /><Cite n={38} /><Cite n={40} /><Cite n={46} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>从订单到价格之前，必须先经过“产权归属—账本入场—约束读取—动作选择”四道门。</h2>
        <div className="mechanism-chain" aria-label="券商从客户需求到市场反馈的七步因果链">
          <div><span>01</span><b>冻结主体与账户</b><p>确定法律实体、客户或 firm account、币种、净额集合、抵押品权利和清算链。</p></div>
          <div><span>02</span><b>接收客户需求</b><p>订单、融资、借券、衍生品或提款请求先改变待执行承诺和现金时钟。</p></div>
          <div><span>03</span><b>冲击进入账本</b><p>principal fill、repo、margin loan、MtM 与 fails 改变资产、负债、权益或受控客户财产。</p></div>
          <div><span>04</span><b>读取约束栈</b><p>分别计算净资本、客户 reserve、margin、VaR、融资、CCP 和 settlement headroom。</p></div>
          <div><span>05</span><b>选择可执行动作</b><p>保留库存、agency/search、对冲、调报价、加 margin、换抵押品、压缩或筹资。</p></div>
          <div><span>06</span><b>动作进入市场</b><p>订单方向、size、spread、depth、repo terms 与跨市场 hedge 改变。</p></div>
          <div><span>07</span><b>状态反馈</b><p>价格、波动、客户行为与抵押价值重写下一轮 firm 和客户的可行域。</p></div>
        </div>
        <p>
          “最紧约束”不能直接对美元、百分比、证券数量和 VaR 做一个数值上的最小值。研究必须先把每项余量除以“每单位候选动作消耗多少该余量”，再比较同一动作单位下的容量。若动作 q 每增加一单位分别消耗 a<sub>i</sub> 单位约束 i，而该约束余量为 H<sub>i</sub>，冻结线性近似下的动作容量是：
        </p>
        <div className="equation-card">
          <span>约束栈的共同单位 · 教学局部近似</span>
          <div>q<sub>max</sub> = min<sub>i</sub> (H<sub>i</sub> / a<sub>i</sub>)</div>
          <p>H<sub>i</sub> 是金额、风险额度或可交付证券的剩余空间；a<sub>i</sub> 是一单位动作对它的消耗。真实 a<sub>i</sub> 可能非线性、离散并随价格、净额和客户组合改变，所以该式是诊断框架，不是法规公式。</p>
        </div>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围、先修与术语桥</p>
        <h2>先把“角色、产权、账本、保证金、净额和时钟”翻译成共同语言，再讨论 dealer capacity。</h2>
        <p>
          硬先修是 T06 的资产负债表和 2.06 的法律实体—资本—流动性分账；建议按需回看 1.05–1.06 的 spread/liquidity、1.09 的 price impact、1.12–1.14 的做市与库存、1.19 的证券借贷、1.20 的 margin/forced liquidation 和 T07 的合约基础，研究识别部分再按需调用 T05 的相关、回归与条件关系。本节不会提前完成 2.08 的高频做市目标函数、2.16 的通用 VaR、2.17 的基金赎回或 7.11 的系统级流动性螺旋。
        </p>
        <div className="learning-objectives">
          <span>七阶段学习路线 · 从产权到可证伪订单</span>
          <ol>
            <li><b>主体与产权（03–08）：</b>分开品牌、法人、broker/dealer 角色、carrying 安排、PB 服务束与市场基础设施。</li>
            <li><b>账本与合同（09–17）：</b>连接多空库存、客户借贷、衍生品、repo、借券、未交收与客户财产。</li>
            <li><b>融资与报价（18–25）：</b>解释 haircut、matched book、净额、抵押品再使用、库存目标和 price impact。</li>
            <li><b>监管与内部约束（26–36）：</b>分开净资本、客户保护、margin、VaR、融资、CCP 与 settlement 时钟。</li>
            <li><b>动作与反馈（37–42）：</b>把订单角色、报价、融资、正负反馈和网络替代接到真实订单。</li>
            <li><b>法域与案例（43–49）：</b>比较美国、欧盟、中国和国际标准，并复盘 2020、Archegos 与失败处置。</li>
            <li><b>研究与实验（50–55）：</b>用十题共享数据、静态变式和识别协议形成可操作诊断。</li>
          </ol>
          <p><b>时间预算：</b>核心阅读约 100–120 分钟；互动实验快速 25–30 分钟，含完整复盘 45–55 分钟；主动练习核对 25–30 分钟，完整书写 45–60 分钟；理解检查快速 10–12 分钟，完整复述 18–22 分钟；接口约 4 分钟。建议分两至三次完成，参考文献与延伸阅读不计。</p>
          <p><b>角色术语：</b>broker 是为他人账户促成交易的角色；dealer 是以自己账户作为日常业务买卖证券的角色；introducing firm 引入客户，carrying firm 通常维护账户、持有资金证券并承担约定后台责任；prime brokerage 是融资、托管、借券、清算和报告的服务组合，不是一种独立牌照；primary dealer 是纽约联储交易对手指定，不是“最高级券商”。</p>
          <p><b>账本术语：</b>margin debit 是客户欠 firm 的融资应收；free credit balance 是 firm 欠客户、应按要求支付的负债，“free”不表示可任意挪用；MtM 是价值状态，variation margin 结算已发生损益或敞口，initial margin 缓冲潜在未来暴露，default fund 是成员共同化的违约资源。Total return swap（TRS，总收益互换）用合约交换某项资产的总回报与融资等现金流，使经济敞口可以与证券法律持有位置分离；它不是证券所有权本身。</p>
          <p><b>产权与净额术语：</b>collateral reuse 是抵押品再次使用的上位概念，rehypothecation 只在合同与法域允许时使用；gross/net 至少分经济敞口、合同 close-out netting、会计 offset 和清算/监管净额，不能看到经济对冲就直接净额出表；possession or control、客户 reserve 与 firm net capital 是三条不同保护线。</p>
          <p><b>流动性术语：</b>market liquidity 关心交易怎样影响价格，funding liquidity 关心能否按时获得现金或抵押融资，settlement liquidity 关心截止时点能否交付正确币种的现金或证券。Headroom 是某一约束的剩余可用空间，必须同时注明单位和时钟。</p>
          <p><b>监管缩写：</b>PAB 是 proprietary accounts of broker-dealers，和 customer reserve 在 Rule 15c3-3 下分项处理；FOCUS 是 broker-dealer 的 Financial and Operational Combined Uniform Single Report，不是实时风控；CCA 是 covered clearing agency；PDT 是 pattern day trader。FCM（futures commission merchant）属于期货客户与清算的另一注册边界，本节不展开；SBSD（security-based swap dealer）也有独立 perimeter，不能因集团同时经营衍生品就与 registered broker-dealer 合并。<Cite n={1} /><Cite n={8} /><Cite n={17} /><Cite n={18} /><Cite n={22} /></p>
          <p><b>风险术语：</b>gap risk 是上次估值或收取 collateral 到真正 close-out 之间价格跳变造成的缺口；wrong-way risk 是对手方变弱时对它的暴露反而上升；basis risk 是 hedge 与被对冲头寸不完全同步；close-out 是终止并重置或处置合约的法律与交易过程。Delta-one 指标的变化 1 单位时，头寸价值在当前点附近约变化 1 单位的一阶暴露；“约一比一”不表示没有跳跃、基差或非线性风险。Delta、gamma 和 DV01 分别描述价值对标的价格的一阶、二阶以及利率一个基点变化的局部敏感度，都是近似而非最大损失。</p>
          <p><b>数量与符号：</b>notional 是合同标称规模，market value 是当前价值，collateral value 是抵押品按指定价格的价值，cash principal 是实际借贷现金，risk exposure 是按明确模型换算的风险量；五者不得互换。本节客户买入表示客户从 dealer 买、dealer 库存减少；客户卖出表示客户卖给 dealer、dealer 库存增加。Netting set 是合同允许在特定事件下共同结算的一组交易；dealer axes 是 dealer 主动向客户表达的特定买卖兴趣。</p>
        </div>
      </section>

      <section className="lesson-section" id="legal-entity">
        <p className="section-kicker">阶段一 · 主体与产权　|　03 · 法律实体优先</p>
        <h2>集团品牌可以同时包含银行、broker-dealer、derivatives dealer 与海外 investment firm；风险和现金却不能因为共用商标就自由跨法人移动。</h2>
        <p>
          分析第一步不是问“这家大行怎么看市场”，而是问交易、客户资产、repo、TRS、清算会员资格和资本究竟记在哪个法人。母集团的合并权益、银行子公司的 CET1/LCR 与 broker-dealer 的净资本可能同时存在，但不是一只共享钱包。跨法人转移还受公司法、监管、客户资产、税、币种、抵押品和内部交易条件限制。<Cite n={2} /><Cite n={7} /><Cite n={8} /><Cite n={35} /><Cite n={40} /><Cite n={46} /><Cite n={48} />
        </p>
        <p>
          一个正确的状态向量至少写出：legal entity、account type、currency、valuation time、netting set、clearing member、custodian、collateral location 与 payment deadline。若只使用集团总资产，却用 standalone firm 的规则解释；或使用银行流动性，却解释 broker-dealer 当日 CCP call，就发生了层级错配。
        </p>
      </section>

      <section className="lesson-section" id="broker-agency">
        <p className="section-kicker">04 · Broker：Agency 机制</p>
        <h2>Broker 的核心不是“没有风险”，而是不以自身作为最终经济对手方来完成这笔客户交易。</h2>
        <p>
          作为 broker 时，firm 接受客户指令，选择 venue、寻找另一客户或 dealer，协调价格与结算，并收取佣金或其他费用。若交易在客户与外部对手方之间完成，firm 不必先把全部方向风险长期留在自身库存；但它仍可能承担最佳执行、market access、操作、错误订单、临时结算、客户信用和法律责任。Agency 因此减少某些 principal inventory，却不是“账外、无资本、无时钟”的同义词。<Cite n={1} /><Cite n={3} /><Cite n={16} /><Cite n={38} /><Cite n={77} />
        </p>
        <p>
          同一家注册主体可逐笔切换角色：今天替客户代理，明天以 principal 与客户成交。经验数据中的“agency trade”也常由报告标识或成交链推断，不能把 firm 永久贴成 agency dealer，更不能由期末库存不变反推它没有在盘中承担过风险。
        </p>
      </section>

      <section className="lesson-section" id="dealer-principal">
        <p className="section-kicker">05 · Dealer：Principal 机制</p>
        <h2>Dealer 用自己的账户成为客户对手方，换取即时成交服务的补偿，同时接住库存、价格和融资风险。</h2>
        <p>
          客户卖出证券、dealer 买入时，dealer 的现金减少或应付款增加，securities owned 与 long inventory 增加；客户买入、dealer 从库存交付时，库存下降，若交付超过持有量还可能形成 short 与借券需求。Grossman–Miller 把这种服务理解为自然买卖者没有同时到达时的风险桥梁，Ho–Stoll 则说明库存风险会改变保留价格与报价。<Cite n={55} /><Cite n={56} />
        </p>
        <p>
          Principal fill 的成交量不等于最终净库存。dealer 可以先与客户成交，再在同券、相关券、期货、swap 或另一客户上外部化风险；因此研究必须分开 customer-facing fill、hedge flow、end-of-window inventory 和跨法人转移。只有最后几项一起观察，才能判断 dealer 是保留、转移还是放大了风险。
        </p>
      </section>

      <section className="lesson-section" id="introducing-carrying">
        <p className="section-kicker">06 · Introducing 与 Carrying</p>
        <h2>开户获客、维护账簿、持有客户资金证券、发送确认和完成清算，可以由不同 firm 按书面 carrying agreement 分工。</h2>
        <p>
          Fully disclosed introducing broker 往往把账户记录、客户资产保管与后台处理交给 carrying firm；协议必须划分开立账户、资金证券、确认单、信用和监管职责，并向客户说明关系。分工会改变哪一法人持有 free credits、margin debits、客户证券与 reserve obligation，却不会把不可转移的法律责任一笔勾销。<Cite n={5} /><Cite n={8} /><Cite n={17} /><Cite n={18} />
        </p>
        <p>
          因此，“某 app 的客户有多少资产”不能直接变成该品牌自营资产负债表。研究者要追踪 introducing、carrying、clearing bank、custodian 与 CCP 的合同链，识别谁欠客户钱、谁控制证券、谁在结算日必须付款。
        </p>
      </section>

      <section className="lesson-section" id="prime-brokerage">
        <p className="section-kicker">07 · Prime Brokerage 服务束</p>
        <h2>Prime brokerage 把执行、融资、margin loan、证券借贷、托管、衍生品和组合报告捆成关系网络；它不是一种单一牌照或单一账本项目。</h2>
        <p>
          一个 hedge fund 的 long stock 可由 margin loan 融资，short 需要借券，synthetic exposure 可能经 TRS 位于另一集团实体，现金与证券又由 prime broker 或第三方 custodian 持有。相同的经济 beta 因合同不同，会产生不同的 MtM、IM/VM、rehypothecation、close-out 和结算时钟。1994 年 SEC staff no-action letter 描述的是特定事实下的 operating arrangement，不是当前全部 PB 业务的普遍法律定义。<Cite n={6} /><Cite n={8} /><Cite n={37} /><Cite n={69} /><Cite n={85} />
        </p>
        <p>
          PB 关系的核心尾部风险是客户集中、gap risk 与信息分散：多个 prime broker 各自看到局部敞口，历史上准时补 margin 也不能证明组合在下一次跳空中可清算。Archegos 将在第 46 节具体闭合这条链。<Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="role-infrastructure">
        <p className="section-kicker">08 · 标签与基础设施</p>
        <h2>Primary dealer、FCM、SBSD、CCP、CSD 与 custodian 描述不同维度；任何一个标签都不能自动推出其他标签的资本、客户保护或央行准入。</h2>
        <div className="table-scroll" role="region" aria-label="券商角色、指定与市场基础设施边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">券商相关角色和基础设施的功能与误读边界</caption>
            <thead><tr><th scope="col">标签</th><th scope="col">回答的问题</th><th scope="col">不能推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">Primary dealer</th><td>是否为纽约联储公开市场操作对手方并承担相关义务</td><td>不是银行牌照、政府担保或联储全面监管身份</td></tr>
              <tr><th scope="row">Bank / bank affiliate</th><td>交易记在受保存款机构、bank holding company 还是注册 broker-dealer</td><td>银行 statutory exception、Basel consolidated ratio 与 dealer net capital 不是一回事</td></tr>
              <tr><th scope="row">Security-based swap dealer</th><td>实体是否因 security-based swap dealing 落入独立注册与规则 perimeter</td><td>不能由集团有 swap 业务推断证券客户账户或 principal trade 位于该实体</td></tr>
              <tr><th scope="row">CCP</th><td>谁替代买卖双方、净额、收取 margin 并管理成员违约</td><td>不是 custodian，也不会消灭全部对手方与流动性风险</td></tr>
              <tr><th scope="row">CSD / securities settlement system</th><td>证券登记、保管与最终交收怎样组织</td><td>不决定 dealer 的客户定价、全部净资本或投资判断</td></tr>
              <tr><th scope="row">Custodian</th><td>资产保管、记录与指令执行由谁承担</td><td>保管不等于经济所有权、风险承担或做市</td></tr>
            </tbody>
          </table>
        </div>
        <p>美国法对 broker/dealer、bank exceptions 与 security-based swap dealer 使用各自定义，纽约联储则把 primary dealer 作为交易对手安排；CPMI–IOSCO 与本地 clearing rules 描述 CCP/CSD 风险管理。现实集团可以同时处在多列，但每一列的权限、资金和失败路径仍须分别读取。期货佣金商等其他 perimeter 不在本节展开，不能被此表吸收到“derivatives dealer”一栏。<Cite n={1} /><Cite n={4} /><Cite n={25} /><Cite n={31} /><Cite n={43} /><Cite n={52} /></p>
      </section>

      <section className="lesson-section" id="client-firm-property">
        <p className="section-kicker">阶段二 · 账本与合同　|　09 · 客户财产与 Firm Property</p>
        <h2>客户账户页面显示的证券与现金，不等于 firm 可以为自营目的自由使用的资产；但“客户资产全部账外且绝对破产隔离”也同样过度简化。</h2>
        <p>
          正确判断要依次问：法律所有权属于谁，客户是否有 fully paid、margin 或 title-transfer 安排，资产由谁占有或控制，合同是否允许 lending/reuse，记录在 firm 账内、账外还是受限账户，以及失败时进入哪一 customer-property pool。美国 Rule 15c3-3 的 possession or control 与 reserve formula、中国客户交易结算资金专户、欧盟 client-assets safeguards 使用不同法律技术，不能互相翻译成同一条“隔离规则”。<Cite n={8} /><Cite n={9} /><Cite n={39} /><Cite n={46} /><Cite n={50} />
        </p>
        <p>
          正常状态中的客户保护也不等于失败后保证市值。美国 SIPA/SIPC 处理缺失证券或现金、customer status、net equity 与 separate capacity，现行一般上限为每一 customer/separate capacity 50 万美元、其中现金 25 万美元；它不承保价格下跌、坏建议或所有金融产品。具体失败时序留到第 47 节。<Cite n={26} /><Cite n={27} /><Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="balance-sheet-inventory">
        <p className="section-kicker">10 · 资产负债表、多头与空头</p>
        <h2>多头证券是 firm 拥有的资产；short 是未来交付或回购证券的义务。两者可以方向对冲，却不能被口头相减后从账本消失。</h2>
        <div className="equation-card">
          <span>法律实体、同一估值时点</span>
          <div>A = L + E；　λ<sub>accounting</sub> = A / E</div>
          <p>A 是 firm 资产，L 是负债，E 是残余权益，单位为同一货币；λ 是教学会计杠杆，不是 SEC net capital ratio、Basel leverage exposure 或中国证券公司资本杠杆率。</p>
        </div>
        <div className="table-scroll" role="region" aria-label="简化 dealer 资产负债表，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">dealer 的主要资产、负债与权益项目</caption>
            <thead><tr><th scope="col">资产</th><th scope="col">负债与权益</th><th scope="col">首先要问</th></tr></thead>
            <tbody>
              <tr><td>现金、securities owned、reverse repo、securities borrowed、customer margin debits</td><td>repo、securities sold not yet purchased、free credit balances、settlement payables</td><td>是 firm property、客户财产还是受控/受限资产？</td></tr>
              <tr><td>正 MtM 衍生品、应收 VM、CCP IM 与清算基金贡献</td><td>负 MtM 衍生品、应付 VM、债务与合格次级融资</td><td>是否可净额、可动用、何时结算？</td></tr>
              <tr><td>其他应收、固定资产与非流动资产</td><td>普通权益与留存收益</td><td>会计资产是否能计入 net capital 或即时现金？</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          若全部 firm 资产无对冲下跌 x，而负债短时不变，则 A′=A−xA、E′=E−xA。薄权益使小比例资产损失变成大比例权益损失；只有在冲击后 E′&gt;0、目标 λ*≥1、资产能按当前账面价值出售且所得全部用于偿债时，才可用 max(A′−λ*E′,0) 表示恢复目标会计杠杆所需的教学缩表量。若 E′≤0，卖资产还债不会把负权益变正，必须进入增资、债务减记或处置分支。这只是机械近似，正式净资本还要应用自己的规则计算。<Cite n={7} /><Cite n={18} /><Cite n={72} />
        </p>
        <div className="equation-card">
          <span>价格损失与单一修复动作 · 教学机械分支</span>
          <div>E′ = E − xA；　S<sub>delever</sub> = max(A′ − λ*E′, 0)，前提 E′ &gt; 0、λ* ≥ 1</div>
          <p>x 是全部 firm 资产的统一损失比例；S 是以当前价值无损出售资产并把现金全部还债的金额。E′≤0 时该修复式失效；对冲、税费、增资、债务重组、风险权重、负债重估和卖压也都会改变结果。</p>
        </div>
      </section>

      <section className="lesson-section" id="customer-debits-credits">
        <p className="section-kicker">11 · Margin Debits 与 Free Credit Balances</p>
        <h2>客户融资借款通常是 firm 的资产；客户可要求支付的信用余额通常是 firm 的负债。两者不能因为同属“客户账户”就口头相减。</h2>
        <p>
          客户用 margin 买入证券时，dealer 向客户延伸信用，形成 customer debit receivable；客户卖出、存入资金或有未投资现金时，可能形成 free credit balance，代表 firm 欠客户、应按要求支付的金额。“Free”描述可支付性质，不表示 firm 可以无条件挪用，也不表示这笔余额自动成为 FDIC-insured bank deposit。若资金依法 sweep 到银行，债务人和保护制度才可能改变。<Cite n={8} /><Cite n={13} /><Cite n={14} /><Cite n={18} />
        </p>
        <p>
          客户 debit 与 credit 会同时进入流动性、利息收入、reserve formula 和客户退出时钟。聚合报表上的 credits−debits 净额不能回答单一客户能否提款，也不能证明 firm 对所有客户敞口已经法律净额。
        </p>
      </section>

      <section className="lesson-section" id="derivative-margin-ledger">
        <p className="section-kicker">12 · Derivatives：MtM、IM 与 VM</p>
        <h2>小的净公允价值可以伴随很大的 gross notional、潜在未来暴露和今日现金保证金；方向对冲并不删除清算时钟。</h2>
        <p>
          MtM 是合约此刻的价值：正值通常是 firm 对对手方的资产，负值是负债。Variation margin 把已经发生的损益或当前敞口按规则转换为现金/抵押品转移；initial margin 缓冲清算期内潜在未来变化；default fund 则把成员违约尾部资源部分共同化。四者的目的、所有权、可动用性和返还条件不同。<Cite n={25} /><Cite n={31} /><Cite n={32} /><Cite n={43} /><Cite n={88} /><Cite n={89} />
        </p>
        <p>
          TRS 可以让客户获得股票 beta，而 prime broker 或关联实体持有 hedge shares；经济 delta 接近对冲，仍留下客户信用、gap、basis、margin、close-out 和处置风险。不能从“净 delta 很小”推出 gross balance sheet、CCP cash 或 liquidation risk 很小。<Cite n={36} /><Cite n={37} />
        </p>
      </section>

      <section className="lesson-section" id="reverse-repo">
        <p className="section-kicker">13 · Reverse Repo：现金贷出腿</p>
        <h2>从 dealer 视角，reverse repo 通常是以证券作保障的现金贷出资产；收到抵押品不等于获得可无限处分的无风险证券。</h2>
        <p>
          Dealer 向客户交付现金并取得按合同约定返售的证券，账面上形成 reverse-repo receivable。真正风险取决于对手方违约时能否及时、合法地处置抵押品，抵押品价格是否跳空，haircut 是否足够，证券是否合格和可交割，以及净额与 close-out 条款是否可执行。合同被描述为 sale and repurchase，也不能跳过会计控制和法律意见直接认定证券属于自由库存。<Cite n={33} /><Cite n={34} /><Cite n={65} /><Cite n={66} /><Cite n={67} /><Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="repo-funding">
        <p className="section-kicker">14 · Repo：现金借入腿</p>
        <h2>Dealer 用证券换取短期现金时，repo 是融资负债；到期展期、haircut、抵押品替换和 margin call 共同决定它能否继续维持库存。</h2>
        <p>
          若 repo 到期不续作，dealer 必须用现金偿还、提供替代融资、出售资产或压缩客户 reverse repo。即使抵押品是高质量政府债券，融资也可能因对手方额度、期限、操作、净额集合或监管成本变化而收紧。2008 年研究还显示 repo 市场分段很重要：private-collateral、tri-party 与 bilateral 市场并没有一个统一的 run 路径。<Cite n={66} /><Cite n={67} /><Cite n={68} />
        </p>
      </section>

      <section className="lesson-section" id="haircut-dictionary">
        <p className="section-kicker">15 · Haircut 词典</p>
        <h2>Repo haircut、监管证券 haircut、抵押品估值 haircut 和市场折价共享一个词，却回答四个不同问题。</h2>
        <div className="table-scroll" role="region" aria-label="不同 haircut 的主体、基数和用途，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">融资、净资本、抵押品估值和市场价格折扣的区别</caption>
            <thead><tr><th scope="col">名称</th><th scope="col">基数与用途</th><th scope="col">不能互推</th></tr></thead>
            <tbody>
              <tr><th scope="row">Repo advance haircut</th><td>抵押品市值与可借现金之间的缓冲</td><td>不等于客户 maintenance margin</td></tr>
              <tr><th scope="row">Net-capital position deduction</th><td>把证券头寸风险转成监管净资本扣减</td><td>不决定 repo 能借多少现金</td></tr>
              <tr><th scope="row">Collateral valuation haircut</th><td>确定某设施或对手方认可的抵押借款价值</td><td>资格和折扣依工具与规则</td></tr>
              <tr><th scope="row">Market discount / price loss</th><td>成交价相对参照价值的差异</td><td>不是合同或监管百分比</td></tr>
            </tbody>
          </table>
        </div>
        <div className="equation-card">
          <span>Repo 融资折扣 · 单一抵押品池</span>
          <div>F = (1 − h)M；　M<sub>required</sub> = F / (1 − h<sub>new</sub>)</div>
          <p>M 是抵押品市场价值，F 是可借现金，h 是无量纲 repo haircut。固定现金融资时，haircut 上升会非线性增加所需抵押品；价格、资格、币种和最低转移单位必须另外冻结。</p>
        </div>
        <p>美国 Rule 15c3-1、FSB 的限定 SFT haircut framework 和 Basel 银行 SFT exposure 使用不同范围与目标。国际框架不能被写成所有 repo 的统一全球最低 haircut。<Cite n={7} /><Cite n={33} /><Cite n={34} /><Cite n={35} /></p>
      </section>

      <section className="lesson-section" id="securities-lending">
        <p className="section-kicker">16 · Securities Borrowing / Lending</p>
        <h2>借券让 short、做市与交收成为可能；证券 recall、抵押品返还和 T+1 销售又把另一只时钟带入 dealer 账本。</h2>
        <p>
          Dealer 借入证券可用于交付 short sale、覆盖客户需求或避免 fail；借出 firm 或合格客户证券则换取费用和抵押品。必须分开证券的法律所有权、投票与经济收益、抵押品是谁的、客户是否同意 reuse、recall 何时生效以及到期无法交券的后果。Collateral reuse 是上位概念，只有合同与法域支持时才称 rehypothecation。<Cite n={8} /><Cite n={33} /><Cite n={34} /><Cite n={42} /><Cite n={69} />
        </p>
        <p>
          美国 Rule 15c6-1 的 T+1 并不把所有 securities loans 直接改成统一 T+1；但 dealer 若卖出已出借证券，缩短的 sale settlement 会压缩 recall 与 delivery 操作时间。间接时钟不能误写成借券合同本身的统一法定期限。<Cite n={19} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="unsettled-fails">
        <p className="section-kicker">17 · Unsettled Trades 与 Fails</p>
        <h2>成交是价格与数量承诺，结算才是现金和证券的最终交付；经济上对冲不代表两条腿会在同一时点、同一法人顺利到达。</h2>
        <p>
          Trade date 到 settlement date 之间，dealer 记录 receivables、payables、securities due 与 cash due。某证券未交付可能来自操作中断、证券稀缺、借券 recall、链式 fails 或经济激励不足；它不自动等于主体资不抵债，却能沿交易与 repo 链传播，占用流动性和库存，并改变下一笔报价。<Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={29} />
        </p>
        <p>
          美国大多数 Rule 15c6-1(a) 覆盖交易采用 T+1，但 government、municipal、commercial paper 等有明确排除；欧盟 CSDR、中国证券登记结算和各市场规则又使用各自框架。不能用“全球证券都 T+1”替代产品级规则。<Cite n={19} /><Cite n={20} /><Cite n={44} /><Cite n={52} />
        </p>
      </section>

      <section className="lesson-section" id="matched-book">
        <p className="section-kicker">阶段三 · 融资、库存与报价　|　18 · Matched Book 的两种视图</p>
        <h2>现金腿匹配融资额与期限，证券腿匹配抵押品来源与返还；只匹配一条腿，会把另一条腿的风险藏起来。</h2>
        <p>
          Dealer 向客户提供 reverse repo、再向现金提供者做 repo，可以让方向性证券库存近似较小，却仍保留 gross assets、gross funding、counterparty limits、haircut basis、rollover、collateral substitution 和 settlement risk。从 cash view 看，谁付钱、何时收回；从 collateral view 看，哪一证券被取得、再交付、召回与返还。两种视图必须同时配平。<Cite n={3} /><Cite n={33} /><Cite n={34} /><Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} />
        </p>
        <div className="equation-card">
          <span>Matched-book carry · 简单年化教学式</span>
          <div>Carry<sub>T</sub> = (N<sub>RR</sub>r<sub>RR</sub> − N<sub>RP</sub>r<sub>RP</sub>)T</div>
          <p>N<sub>RR</sub>、N<sub>RP</sub> 是 reverse repo 与 repo 的现金本金，r 是各自简单年率，T 以年计。两腿 notional 不同时，不能只用利率差乘一条腿；公式忽略费用、违约、价格、haircut 与再投资。</p>
        </div>
      </section>

      <section className="lesson-section" id="gross-netting">
        <p className="section-kicker">19 · Gross Exposure 与可执行 Netting</p>
        <h2>“经济上方向抵销”只回答风险的一部分；合同、会计、清算和监管能否净额，要逐层证明。</h2>
        <div className="table-scroll" role="region" aria-label="四层净额与所需证据，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">经济、合同、会计和监管净额的区别</caption>
            <thead><tr><th scope="col">层</th><th scope="col">问题</th><th scope="col">典型证据</th></tr></thead>
            <tbody>
              <tr><th scope="row">Economic hedge</th><td>价格方向是否部分抵销</td><td>beta、duration、basis 与 stress sensitivity</td></tr>
              <tr><th scope="row">Close-out netting</th><td>违约时合同现金流能否合并成净额</td><td>master agreement 与可执行法律意见</td></tr>
              <tr><th scope="row">Accounting offset</th><td>报表是否允许资产负债净列</td><td>会计准则、同对手方与结算意图等条件</td></tr>
              <tr><th scope="row">Clearing / regulatory netting</th><td>CCP 或资本规则认可多少净额</td><td>产品集合、margin、规则和报告口径</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          多边 CCP netting 可以减少某些双边暴露，却可能丢失原本的跨资产双边净额；gross balance sheet 也可能在方向风险很小的 matched book 中继续增长。因而“集中清算必然降低全部风险”和“matched book 可以自动出表”都不成立。<Cite n={7} /><Cite n={31} /><Cite n={35} /><Cite n={43} /><Cite n={87} />
        </p>
      </section>

      <section className="lesson-section" id="rehypothecation">
        <p className="section-kicker">20 · Collateral Reuse / Rehypothecation</p>
        <h2>同一抵押品沿融资链再次使用，可以提高正常期资金效率，也会把 recall、返还和违约风险连接成更长的依赖链。</h2>
        <p>
          Prime broker 从客户取得可再使用的证券，可能把它交给现金提供者融资；这样减少自有抵押品需求，并通过不同市场 haircut 释放现金。但原客户、dealer 与现金提供者对同一资产拥有不同合同权利，任一环节的 recall、违约、eligibility 变化或结算延迟都可能迫使下一环寻找替代证券。<Cite n={42} /><Cite n={69} /><Cite n={85} />
        </p>
        <p>
          Reuse 不是“重复创造同一证券所有权”，也不是无风险免费现金。研究 collateral velocity 时必须记录可重用同意、资产来源、链长、币种、haircut、segregation 与返还时钟，否则总量会把法律不可动用资产也算入供给。
        </p>
      </section>

      <section className="lesson-section" id="inventory-target">
        <p className="section-kicker">21 · Inventory Target：目标不是永远归零</p>
        <h2>Dealer 管理的是带方向、期限、基差、流动性和客户价值的组合；“目标库存”因此是状态变量，不是每笔成交后立即回到零的铁律。</h2>
        <p>
          最简单的库存模型把 q=0 当作中性点：客户卖给 dealer 后，long inventory 上升，未来价格下跌会损害财富，因此 dealer 希望降低下一笔继续买入的概率、提高卖出的概率。但真实目标 q* 可以非零。已有客户订单、研究观点、hedge availability、carry、税、交割稀缺、融资成本、风险限额和做市义务都会改变 q*；同一只券的 cash、future、swap 与 basket hedge 还可能拥有不同计量单位。<Cite n={55} /><Cite n={59} /><Cite n={60} />
        </p>
        <p>
          最小诊断先写库存偏离 I=q−q*，再把它翻译成明确风险单位。股票可先用美元 delta，债券常需 duration/DV01，期权则不能只用名义数量；价格、合约乘数与 delta 的定义必须避免重复相乘。这个换算只提供一阶风险视图，不删除 gamma、basis 与流动性。
        </p>
        <p>
          期末库存下降不能证明 dealer 在交易窗口内没有供给流动性，因为它可能先承接再外部化；期末库存上升也不能证明它主动看多，因为客户流和 hedge mismatch 可以被动留下头寸。识别库存机制至少需要 customer-facing direction、盘中 inventory、hedge flow、融资成本和报价同时变化。
        </p>
      </section>

      <section className="lesson-section" id="reservation-price">
        <p className="section-kicker">22 · Reservation Price：把库存影子成本放进中心价</p>
        <h2>Reservation price 是 dealer 在给定库存与风险偏好下愿意围绕其报价的内部中心，不是不可观察“真实价值”的同义词。</h2>
        <p>
          在 Ho–Stoll 一类库存模型中，多头库存提高继续持有一单位风险的边际成本，因此内部中心相对共同价值代理下移；空头则相反。一个便于实验的局部压缩式是 r=m−κ(q−q*)：m 是外部参考中价或共同价值估计，κ 把一单位库存偏离翻译成货币价格调整。κ 会随波动、持有期、风险厌恶、对冲成本和剩余资本变化，不是证券永久参数。<Cite n={55} /><Cite n={59} />
        </p>
        <div className="equation-card">
          <span>Reservation-price skew · 冻结教学近似</span>
          <div>r = m − κ(q − q*)；　bid = r − s/2；　ask = r + s/2</div>
          <p>若 q&gt;q*，dealer 多头偏高，r 下移；若 q&lt;q*，r 上移。s 是货币单位的 full spread。价格须使用同一币种/每单位报价，q 与 κ 的单位必须互为倒数；真实最优控制通常非线性且具有动态期限。</p>
        </div>
        <p>
          这个中心移动与 spread widening 是两种动作。dealer 可以保持 bid–ask 距离不变而整体下移，也可以同时扩大 spread、缩小 size，或只在一侧撤量。若数据只有成交价而没有双边报价和库存，就无法唯一分辨“价值信息”与“库存 skew”。
        </p>
      </section>

      <section className="lesson-section" id="spread-quote">
        <p className="section-kicker">23 · Spread、Skew 与 Size</p>
        <h2>一张报价有中心、宽度、数量和存续时间四个自由度；把所有反应都叫“spread 变宽”，会删除真正的行为边际。</h2>
        <p>
          在最小表示中 bid=r−s/2、ask=r+s/2。库存偏离主要可移动 r；adverse selection、波动、操作成本、搜索摩擦与稀缺资产负债表可以提高 s；剩余 inventory/capital headroom 则常首先缩小 displayed size。不同机制可以同时出现，但它们有不同预测：私人信息风险上升应更集中于信息敏感方向和时段，单纯库存压力应随 dealer 自身 q 与 hedge 成本改变。<Cite n={55} /><Cite n={57} /><Cite n={60} />
        </p>
        <p>
          “报价变差”也必须从客户方向定义。客户卖出时关心 dealer bid；dealer 下移 bid 可能同时意味着中心下移、spread 加宽或二者兼有。Size 还可以写成 headroom、hedge depth 与客户关系价值的条件函数；当最紧约束余量下降时，数量可能先于价格剧烈变化。用 midquote spread 解释实际 execution cost 前，还要加入成交 size、venue fees、price improvement 和后续价格变化。
        </p>
      </section>

      <section className="lesson-section" id="price-impact">
        <p className="section-kicker">24 · Price Impact：订单如何穿过 Dealer Capacity</p>
        <h2>价格冲击不是“大单天然推动价格”的常数，而是订单在当时可用承接资本、信息环境和替代网络中的边际清算代价。</h2>
        <p>
          Kyle 的 λ 把净订单流映射成价格变化；现代 dealer-market 证据进一步表明，成交链的长度、客户—dealer 网络、inventory sharing 和 capital commitment 都会改变同一 notional 的冲击。市场深度充足、dealer 余量大且能找到 offsetting flow 时，客户单可被分散吸收；自然买家缺席、dealer 同向拥挤或 hedge market 变薄时，冲击会凸性上升。<Cite n={58} /><Cite n={75} /><Cite n={76} /><Cite n={77} /><Cite n={79} />
        </p>
        <div className="equation-card">
          <span>局部冲击式 · 必须注明窗口与符号</span>
          <div>Δp<sub>t,t+h</sub> = λ<sub>t,h</sub>Q<sub>signed</sub> + ε<sub>t,h</sub></div>
          <p>Q<sub>signed</sub> 以客户买入为正或卖出为正都可以，但必须固定；λ 的单位是“每单位净订单对应的价格变化”，并依赖时点 t 与衡量窗口 h。ε 包含同期公共信息和未观察流，故简单回归系数不自动是结构因果效应。</p>
        </div>
        <p>
          永久与暂时冲击也要分开。若成交透露基本面信息，部分价格变化可持续；若冲击主要补偿临时库存，随后自然买家进入时可能回转。只观察回转不能证明初始交易无信息，因为信息和库存成分可以共存。
        </p>
      </section>

      <section className="lesson-section" id="inventory-reversion">
        <p className="section-kicker">25 · Inventory Reversion：为什么不是必然均值回归</p>
        <h2>Dealer 有动机减少不希望的库存，却未必有能力、期限或价格意愿立即完成；“最终回归”与“路径稳定”不是一回事。</h2>
        <p>
          库存可通过三条路径下降：等待反向客户流、跨 dealer 转售，或在相关市场对冲。第一条保存 spread 但占用时间与风险；第二条把订单转给网络并可能形成 interdealer price impact；第三条降低一阶风险却留下 basis、gamma、funding 与 settlement exposure。交易活跃、网络密集且 hedge liquid 时，回归较快；稀缺券、压力状态和共同约束下，库存可持续甚至被迫在最差时点释放。<Cite n={59} /><Cite n={60} /><Cite n={74} />
        </p>
        <p>
          因而经验研究不能预设 AR(1) 系数恒定小于一，然后把偏离全叫暂时冲击。应允许 reversion speed 随波动、dealer capital、客户集中、证券流动性和政策工具切换，并检验 inventory 的 measurement window 是否把日内往返交易净掉。库存均值回归是可检验状态命题，不是做市定义。
        </p>
      </section>

      <section className="lesson-section" id="net-capital">
        <p className="section-kicker">阶段四 · 约束栈　|　26 · Rule 15c3-1 Net Capital</p>
        <h2>美国 broker-dealer 的 net capital 是面向流动清算能力的规则量：从会计净值出发，经不可认可资产、证券风险和其他调整后，与适用最低要求比较。</h2>
        <p>
          Rule 15c3-1 不是 Basel CET1 的另一名称。概念顺序必须分两步：先从按规则调整的净值扣除非流动或不可认可资产及其他 pre-haircut 项目，得到 tentative net capital；再从 tentative net capital 扣除 securities/commodity positions 的 haircut、集中或适用模型与附录费用，得到 net capital。适用最低要求又依 broker-dealer 的业务和方法而异，并可能受多个 greater-of tests 约束。FOCUS 报告提供监管报表入口，但单个公开净值不能复建完整 headroom。<Cite n={7} /><Cite n={17} /><Cite n={18} />
        </p>
        <div className="equation-card">
          <span>概念桥 · 不是完整 Rule 15c3-1 计算</span>
          <div>TNC ≈ adjusted net worth − nonallowable assets − pre-haircut deductions<br />NC ≈ TNC − securities haircuts − applicable post-TNC charges</div>
          <p>TNC 是扣除证券 haircut 等市场风险费用之前的 tentative net capital，不能再重复扣除已经在它形成前移除的 nonallowable assets；NC 是规则定义的 net capital。这里的两步式只标出顺序，不穷尽 Rule 15c3-1 的定义、附录与 firm-specific adjustments；headroom=NC−applicable requirement 也只有在适用方法、业务分类、早期预警线与全部调整已冻结时才有意义。监管 haircut 是资本扣减，不是融资 haircut。</p>
        </div>
        <p>
          约束可能在法定最低之前通过内部 buffer 变得有效：管理层不愿接近 early-warning 或 reporting trigger，融资方也会观察更粗的 equity/leverage 指标。因此“净资本尚合规”不能推出 dealer 仍愿意以原价承接边际库存；反过来，spread 变宽也不能单独证明净资本 binding。
        </p>
      </section>

      <section className="lesson-section" id="customer-reserve">
        <p className="section-kicker">27 · Rule 15c3-3 Customer Reserve</p>
        <h2>Customer reserve 通过规定的 credits 减允许的 adjusted debits 计算客户现金净额；它不是把每位客户每一美元逐笔放进专属保险箱。</h2>
        <p>
          Exhibit A 的 reserve formula 聚合特定 customer credit items 与 permitted debit items，并按 Notes 作调整；正差额须以 cash and/or qualified securities 存入 Special Reserve Bank Account。这个数既不是 firm net capital，也不是某客户对账户内某张证券的直接物权，更不是 SIPC 的赔付上限。<Cite n={8} /><Cite n={9} />
        </p>
        <p>
          频率也不是静态背景。SEC 2024 年最终规则把平均 customer 加 PAB total credits 达到 5 亿美元门槛的 carrying broker-dealers 改为每日计算；2025 年延后合规后，该要求自 2026 年 6 月 30 日起适用。门槛以此前连续 12 个 month-end FOCUS reports 的平均值判断，不能写成“所有美国券商从该日起每日计算”。SEC FAQ 还处理首次计算和 operational questions。<Cite n={10} /><Cite n={11} /><Cite n={12} />
        </p>
        <div className="equation-card">
          <span>Reserve formula 的教学压缩</span>
          <div>R<sub>raw</sub> = max(0, prescribed credits − permitted adjusted debits)</div>
          <p>输入必须已经完成适用 Notes 与 aggregate-debit reduction。R<sub>raw</sub> 是原始储备要求；本次新增存入额还需与截止时点 Special Reserve Bank Account 已存金额比较。不得把原始 debits 直接代入。</p>
        </div>
      </section>

      <section className="lesson-section" id="possession-control">
        <p className="section-kicker">28 · Possession or Control</p>
        <h2>客户 reserve 主要保护现金净额；possession or control 则追踪 fully paid 与 excess-margin securities 是否位于合格控制地点并可向客户交付。</h2>
        <p>
          Rule 15c3-3 要求 carrying firm 取得并保持相关客户证券的 physical possession or control，并对 deficits 采取指定步骤。证券可能在合格 bank、clearing corporation 或其他 control location；账面显示客户持有不够，还要验证 firm 能否不依赖受限、已质押或第三方不履约的证券完成返还。<Cite n={8} />
        </p>
        <p>
          这条规则不等于“客户所有证券永不被借出”。Margin securities、客户同意、borrowing/lending 合同和适用限制会改变可使用范围；fully paid 与 excess-margin securities 的要求也不能被一个总客户资产百分比替代。分析失败时必须分别核对证券 location deficit、reserve cash deficit、记录错误与市场价值损失。<Cite n={8} /><Cite n={42} /><Cite n={69} />
        </p>
      </section>

      <section className="lesson-section" id="margin-stack">
        <p className="section-kicker">29 · Margin Stack：同一个词的六层约束</p>
        <h2>Margin 只有在写清“谁向谁、对什么敞口、以什么基数、何时补足”后才是可计算变量。</h2>
        <div className="table-scroll" role="region" aria-label="保证金约束栈，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">初始保证金、维持保证金、house margin、融资折扣、CCP margin 与资本扣减</caption>
            <thead><tr><th scope="col">层</th><th scope="col">主体与用途</th><th scope="col">主要时钟</th></tr></thead>
            <tbody>
              <tr><th scope="row">Regulation T initial margin</th><td>美国 broker-dealer 客户证券信用的初始支付/延伸信用框架</td><td>交易与付款规则</td></tr>
              <tr><th scope="row">FINRA maintenance</th><td>会员维持客户账户最低权益</td><td>持续与 margin call</td></tr>
              <tr><th scope="row">House margin</th><td>firm 基于集中、流动性与客户风险设定更高要求</td><td>合同与 firm notice</td></tr>
              <tr><th scope="row">Repo haircut</th><td>现金融资额相对抵押品市值的缓冲</td><td>融资开立、重估与展期</td></tr>
              <tr><th scope="row">CCP IM / VM</th><td>清算成员覆盖潜在未来暴露／结算当前损益</td><td>日终或日内 call</td></tr>
              <tr><th scope="row">Net-capital haircut</th><td>firm 自有头寸对监管净资本的扣减</td><td>监管计算与报告</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Regulation T、FINRA Rule 4210 与 firm house requirement 可以同时作用于同一客户；2026 年美国 intraday-margin 制度还有逐 firm 迁移期。CCP 规则和 PFMI/国际 margin principles 又面向 clearing network。较高 house margin 可以保护 firm，却也可能迫使客户同步出售；较低 margin 可以延缓清算，却把 gap loss 留给 firm。任何“margin 上调导致卖盘”的判断都要证明客户已不足、无法补充合格 collateral 且 firm 选择或必须 liquidate。<Cite n={13} /><Cite n={14} /><Cite n={15} /><Cite n={25} /><Cite n={31} /><Cite n={32} />
        </p>
        <div className="equation-card">
          <span>多头证券账户的 maintenance 缺口 · 冻结教学式</span>
          <div>Equity = market value − debit balance；　Deficiency = max(0, m × market value − Equity)</div>
          <p>m 是适用于题设账户和时点的 maintenance/house 比例。Reg T initial margin、FINRA maintenance、firm house add-on 和 portfolio-margin 模型不得使用同一个 m 替代。</p>
        </div>
      </section>

      <section className="lesson-section" id="pb-concentration-margin">
        <p className="section-kicker">30 · Prime Brokerage Concentration Margin</p>
        <h2>组合在历史波动下看似低风险，也可能因单一标的、相关头寸、流动性和 gap risk 被 house add-on 主导。</h2>
        <p>
          Prime broker 通常把基础 margin 与集中度、wrong-way risk、流动性、jump-to-default、large position liquidation period 和客户信用 add-on 叠加。多个 swap 形式上分散在不同标的，若由同一因子驱动或需要在同一市场退出，真实 close-out capacity 仍集中；跨 prime 分散还会让每家只看到局部 gross exposure。<Cite n={36} /><Cite n={37} /><Cite n={85} />
        </p>
        <p>
          追加 margin 的因果链不是“波动上升→必然卖出”一跳完成。先要知道合同允许的 recalibration、call amount 与 deadline，客户可动用现金/证券、其他 primes 是否同步 call、头寸能否 transfer/hedge，以及 dealer 是否给予 cure period。Archegos 的核心教训之一正是过去准时缴纳 margin 不能替代独立的极端清算分析。
        </p>
      </section>

      <section className="lesson-section" id="internal-risk-limits">
        <p className="section-kicker">31 · Internal Risk Limits：法定最低之前的真实边界</p>
        <h2>Desk limit、VaR、stress loss、concentration、DV01、gamma、issuer 和 settlement limit 会把同一监管余量切成更小的可执行预算。</h2>
        <p>
          法定净资本是一条外部底线；董事会风险偏好、business-unit limits、counterparty credit、market access pre-trade controls 与融资额度通常更早约束交易。限额具有不同聚合层级：一只券、一个 issuer、一个客户、一个 desk、一个法人和集团可能各有上限；经济 hedge 能降低某些 risk-factor limit，却不一定释放 gross notional、leverage、issuer concentration 或 settlement line。<Cite n={16} /><Cite n={36} /><Cite n={37} /><Cite n={79} />
        </p>
        <div className="equation-card">
          <span>单资产 VaR 容量 · 只作局部直觉</span>
          <div>VaR ≈ zσ|X|；　|X|<sub>max</sub> = Limit / (zσ)</div>
          <p>X 是 delta-one 美元名义，σ 是同一持有期收益波动率，z 是单侧分位数。波动率翻倍会在其他假设不变时令容量减半；真实 limit 还需相关性、非线性、厚尾、流动性、stress 和 model-risk add-on。VaR 不是最大损失。</p>
        </div>
        <p>
          限额使用也有内生性：波动与相关性上升会在不新增头寸时消耗更多 VaR；价格下跌会改变 delta 与 collateral；管理层在损失后可能降低 limit。若研究只观察 position reduction，必须区分客户流、模型参数重估、限额下调和主动观点变化。
        </p>
      </section>

      <section className="lesson-section" id="funding-rollover">
        <p className="section-kicker">32 · Funding Rollover：有资产不等于今日有现金</p>
        <h2>Dealer 的库存可以在经济上有价值、在会计上有资产，却仍因 repo 到期、抵押品不合格或付款截止而出现融资缺口。</h2>
        <p>
          Rollover risk 来自“旧融资到期”与“新融资可执行”之间的差。对手方可以降低额度、提高 haircut、缩短期限、拒绝某抵押品或要求更早结算；价格下降还会同时降低 collateral value 并增加 margin。Dealer 的响应顺序取决于未设押证券、可承诺 credit lines、央行/清算资格、资产出售深度和法律实体间现金可转移性。<Cite n={33} /><Cite n={34} /><Cite n={65} /><Cite n={66} /><Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} />
        </p>
        <div className="equation-card">
          <span>截止时点融资缺口 · 现金与抵押品分别计算</span>
          <div>Cash gap<sub>τ</sub> = max(0, due cash<sub>≤τ</sub> − usable cash<sub>≤τ</sub> − confirmed inflows<sub>≤τ</sub>)</div>
          <p>τ 是明确时区下的截止时点；due cash 包括到期融资、付款与按合约计算的 VM。Usable 只包括同一法人、币种、账户且能在 τ 前到位的资源；明日应收与未完成条件的额度不能提前计入。</p>
        </div>
        <p>
          “融资成本上升”与“融资数量消失”要分开：前者可能只压缩 carry，后者会迫使缩表。观察 repo rate spike 也不能唯一归因 dealer 信用，因为 collateral scarcity、期末 balance-sheet cost、交割 fails 与特定净额集合都会改变利率。
        </p>
      </section>

      <section className="lesson-section" id="ccp-initial-margin">
        <p className="section-kicker">33 · CCP Initial Margin</p>
        <h2>Initial margin 是为成员违约后的未来价格变化预先配置的可用资源；集中清算改变对手方结构，却没有删除尾部风险或现金需求。</h2>
        <p>
          CCP 成为买方之卖方、卖方之买方，对可净额产品实施多边净额并按模型收取 IM。模型通常读取历史/压力波动、持有或清算期、相关性、集中度与流动性 add-on；组合 hedge 可以降低某些 IM，但资格、账户、产品与方向集合决定可认可净额。PFMI 提供国际原则，美国 Rule 17Ad-22 只约束其法定范围内的 clearing agencies；具体算法仍由各 CCP rulebook 和本地实施决定。<Cite n={25} /><Cite n={31} /><Cite n={32} /><Cite n={89} />
        </p>
        <p>
          IM 上升既可能反映风险真的上升，也可能通过同步现金需求放大去杠杆。经验识别必须分开 position change 与 parameter change，并记录 call 是否日内、可用 collateral、haircut、转换成本和 clearing member 是否把 add-on 转嫁给客户。PFMI 要求在可行和审慎范围内限制 destabilising procyclical changes；具体 anti-procyclicality 安排仍依本地实施与 CCP rulebook，也不会把所有周期性消除。<Cite n={31} /><Cite n={88} />
        </p>
      </section>

      <section className="lesson-section" id="variation-margin">
        <p className="section-kicker">34 · Variation Margin：把昨日价格变成今日现金</p>
        <h2>VM 不增加过去损失；它改变的是损失结算的时间、币种、账户和无法等待价格回转的程度。</h2>
        <p>
          对每日或日内盯市的清算头寸，价格变化形成 payable/receivable VM。经济上被另一头寸对冲的损失，若位于不同 CCP、不同法人、不同币种或不同截止时间，仍可能先付后收。正 MtM 是资产也不等于可在今日 deadline 前变成现金；已承诺 line 也必须已经满足法律文件、抵押品与操作条件。<Cite n={25} /><Cite n={31} /><Cite n={32} /><Cite n={88} />
        </p>
        <p>
          在线性期货教学例中，可把流出写成 max(−N×multiplier×ΔP,0)，其中 long 的 N 为正、ΔP 是新减旧结算价；option、swap、跨币种、netting 与 intraday call 必须按合约重建。VM 可以降低累积 unsecured exposure，同时提高短时资金流尖峰。资本充足回答吸收损失的能力，settlement liquidity 回答按时付款的能力；二者相关但不能互换。
        </p>
      </section>

      <section className="lesson-section" id="default-fund">
        <p className="section-kicker">35 · Default Fund 与 Loss Waterfall</p>
        <h2>CCP 把双边违约风险集中管理并部分共同化；它把风险重组为 margin、成员贡献、评估权与流动性义务，而不是把风险消灭。</h2>
        <p>
          典型 waterfall 先使用违约成员的 margin 和 default-fund contribution，再依规则动用 CCP 自有资源与非违约成员共同基金；极端情况下可能还有 assessment、gain haircut、variation-margin-gains haircut 或其他 recovery tool。具体顺序、金额与法律终局性取决于 CCP rulebook 和法域，不能用一张通用图替代。<Cite n={25} /><Cite n={31} /><Cite n={89} />
        </p>
        <p>
          Dealer 加入 CCP 后，一部分 bilateral credit exposure 降低，但集中于 CCP/clearing member 的 liquidity、operational 与 wrong-way dependencies 上升。一个成员违约时，非违约成员可能同时面对客户提款、市场 hedge 和 default-fund call；因此“安全的中央节点”也必须纳入全网现金压力，而不只是静态 loss allocation。
        </p>
      </section>

      <section className="lesson-section" id="settlement-headroom">
        <p className="section-kicker">36 · Settlement Headroom：最短时钟的约束</p>
        <h2>日终净敞口很小，也可能在盘中因为 cash、specific securities 或 operational capacity 到达顺序错误而违约。</h2>
        <p>
          Settlement headroom 至少包含三类资源：可在 deadline 前支付的正确币种现金、可在正确 CSD/CCP 交付的特定证券，以及 processing/credit lines 能处理的峰值。T+1 压缩了 allocation、affirmation、FX funding 与 securities recall 的操作窗口；Treasury central clearing 又把更多交易带入 clearing-member 和 CCP margin/netting 体系。<Cite n={19} /><Cite n={20} /><Cite n={21} /><Cite n={22} /><Cite n={23} /><Cite n={24} /><Cite n={29} />
        </p>
        <p>
          Fail 不必等于最终 default：一条证券链可能因暂时稀缺而延迟，随后补交；但 fail 会占用对手方额度、延长融资、产生费用并把缺券传给下一环。诊断要写出每条 cash/security leg、settlement location、cut-off、可净额集合和 back-up path，而不是只看 EOD P&amp;L。
        </p>
      </section>

      <section className="lesson-section" id="principal-agency-hedge">
        <p className="section-kicker">阶段五 · 动作选择　|　37 · Principal、Agency 与 Hedge</p>
        <h2>客户要的是交易结果，dealer 选择的是实现路径；同一客户订单可以对应完全不同的 firm inventory 和市场母订单。</h2>
        <div className="table-scroll" role="region" aria-label="dealer 三种主要执行动作，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">principal fill、agency search 与 hedge 的账本和市场差异</caption>
            <thead><tr><th scope="col">动作</th><th scope="col">先改变什么</th><th scope="col">主要残余风险</th></tr></thead>
            <tbody>
              <tr><th scope="row">Principal fill / retain</th><td>firm inventory、现金/应付与客户成交承诺</td><td>方向、融资、资本、结算与退出风险</td></tr>
              <tr><th scope="row">Agency / search</th><td>待执行指令、venue 与对手方搜索</td><td>执行、机会、信息泄露、操作与临时信用风险</td></tr>
              <tr><th scope="row">Principal fill / hedge</th><td>先接客户，再生成同券或相关市场 hedge order</td><td>basis、liquidity、model、timing 与 gross balance sheet</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          法律上的 broker/dealer 角色、欧盟 own-account/agency perimeter 与经济学上的 immediacy 机制共同说明：dealer 的价值在于跨时间和网络桥接自然买卖者，而不是永久吞下全部风险。选择 principal 还是 agency 取决于客户愿意支付的 immediacy premium 与 dealer 的边际影子成本；选择 hedge 则把风险传到期货、ETF、swap、相关债券或 interdealer market。<Cite n={1} /><Cite n={3} /><Cite n={38} /><Cite n={55} /><Cite n={56} /><Cite n={60} />
        </p>
        <p>
          因而“dealer principal volume 上升”既可能代表资本供给增加，也可能只是先成交后快速外部化；“agency share 上升”既可能是技术效率提高，也可能是 dealer 不愿占用资产负债表。需要把角色标识与库存/hedge/funding 联合解释。
        </p>
      </section>

      <section className="lesson-section" id="financing-collateral-response">
        <p className="section-kicker">38 · Financing 与 Collateral Response</p>
        <h2>库存压力不只转成证券卖单；dealer 也可以在负债和抵押品一侧修复可行域。</h2>
        <p>
          可选动作包括延长 repo 期限、替换现金提供者、增加 overcollateralization、把稀缺证券换成合格 collateral、压缩 customer reverse repo、提高融资利差、召回借券、限制 reuse，或保留未设押证券作为 liquidity buffer。每一步都在 cash amount、haircut、maturity、collateral identity、netting set 与 settlement time 上重新分配风险。<Cite n={33} /><Cite n={34} /><Cite n={67} /><Cite n={68} /><Cite n={69} /><Cite n={70} />
        </p>
        <p>
          负债侧修复可能避免立即卖出，却把成本和约束传给客户：更高 haircut 与更低 advance rate 要求客户提供更多 collateral，较高 PB margin 迫使客户筹资，reverse-repo 缩量减少杠杆可得性。研究“dealer 卖了多少”会漏掉这一条数量与合同条款渠道。
        </p>
      </section>

      <section className="lesson-section" id="positive-feedback">
        <p className="section-kicker">39 · 正反馈：约束如何把局部冲击变成流动性螺旋</p>
        <h2>当价格、波动、margin、融资和 dealer capacity 相互回写时，一次客户卖单可以增加下一笔卖单的必要性。</h2>
        <p>
          典型链条是：价格下跌或波动上升 → inventory/客户 collateral 价值下降、VaR 与 IM 消耗上升 → dealer headroom 变紧并提高 margin/haircut、缩减 bid size → 客户和 dealer 被迫外部化风险 → market depth 下降、price impact 上升 → 新价格再次压缩 headroom。Brunnermeier–Pedersen 描述 market 与 funding liquidity 的相互强化，中介资产定价模型则说明资本稀缺会抬高风险承担的影子价格。<Cite n={61} /><Cite n={62} /><Cite n={65} /><Cite n={70} /><Cite n={83} />
        </p>
        <p>
          放大强度取决于“headroom 下降对 forced sales 的敏感度、价格对 headroom 的回写和出售对价格的冲击”三条局部斜率；真实函数有阈值、离散 margin call、政策与新资本，不能把它压成跨市场常数。每一箭头都必须有证据：spread widening 可能来自信息；margin call 可能由现金补足；dealer hedge 可能被自然买家吸收。只有关键中介变量按正确时序共同变化，才可称为融资—市场流动性正反馈。
        </p>
      </section>

      <section className="lesson-section" id="negative-feedback">
        <p className="section-kicker">40 · 负反馈：库存吸收何时稳定价格</p>
        <h2>资产负债表余量、稳定融资和可用网络充足时，dealer 可以把客户流从立即价格清算转成跨时间库存清算。</h2>
        <p>
          客户因非信息性现金需求卖出时，dealer 以 principal 买入并暂存；报价小幅下移补偿持有风险，却无需把全部数量立即抛回市场。随后反向客户流、跨 dealer 转售或 hedge market 逐步消化库存，初始 price impact 部分回转。库存吸收、价格回转、内部限额与客户反向流研究共同刻画了这一有条件的桥接机制。<Cite n={56} /><Cite n={60} /><Cite n={79} /><Cite n={86} />
        </p>
        <p>
          负反馈不是“dealer 逆势买入”的人格特征，而是有条件的状态结果：需要可用 net capital、funding、risk limits、settlement capacity，以及客户流主要为 liquidity-driven。若订单包含强私人信息，盲目承接会产生 adverse-selection loss；若所有 dealer 同时接近上限，interdealer transfer 只是在网络内搬运约束。稳定功能必须以事前 headroom 与事后 inventory path 证明。
        </p>
      </section>

      <section className="lesson-section" id="customer-liquidity">
        <p className="section-kicker">41 · Customer Liquidity：约束会先传给客户</p>
        <h2>Dealer 可以通过价格、数量、融资条件和账户 margin 四条边际把自身影子成本传给客户，客户再决定卖资产、补现金或迁移关系。</h2>
        <p>
          当 balance-sheet capacity 变贵，dealer 可扩大 bid–ask、降低 quote size、减少 axes（主动向客户展示的特定买卖兴趣）、提高 repo/borrow fee、上调 house margin 或缩短承诺期限。客户若有现金和替代 dealer，可以补 collateral 或转移；若多家同时收紧、资产又不透明，客户只能减少 leverage 或出售。Corporate-bond 研究显示危机中 dealer intermediation、客户交易成本和 selling pressure 的关系具有显著状态差异。<Cite n={77} /><Cite n={80} /><Cite n={81} />
        </p>
        <p>
          “客户卖出导致 spread 变宽”与“spread 变宽导致客户卖出”可以同时成立。识别方向需用 margin-call timestamp、dealer-specific exposure、客户跨 dealer routing 和自然实验，而不能只把同日成交量与 spread 的相关性解释为单向冲击。
        </p>
      </section>

      <section className="lesson-section" id="network-substitution">
        <p className="section-kicker">42 · Dealer Network 与替代</p>
        <h2>一家 dealer 缩表是否变成全市场流动性危机，取决于订单能否跨网络迁移，以及替代者是否共享同一约束。</h2>
        <p>
          客户可以转向另一 dealer，dealer 可以在 interdealer venue 卸载，central clearing 可以改变净额，电子平台可以扩大搜索范围。若网络中存在未受冲击、资本充足且了解资产的节点，局部冲击被重分配；若核心 dealer 高度集中、替代者使用相同融资方和风险模型，迁移会形成 crowded hedge 与共同限额。Dealer balance-sheet 证据、OTC 网络研究和 Treasury intermediation 研究共同指向这种异质性。<Cite n={74} /><Cite n={75} /><Cite n={76} /><Cite n={78} /><Cite n={79} /><Cite n={83} /><Cite n={84} /><Cite n={86} />
        </p>
        <p>
          网络韧性不能只用 dealer 数量衡量。应观察可替代边、客户切换时间、清算会员集中、共同 collateral、相似 inventory、跨境法人限制和极端状态下的有效 capacity。新增一个“名义连接”若依赖同一 scarce balance sheet，可能增加正常期效率却不增加危机承接力。
        </p>
      </section>

      <section className="lesson-section" id="jurisdiction-status">
        <p className="section-kicker">阶段六 · 法域、现行规则与案例　|　43 · 法域与法律状态</p>
        <h2>相似业务会落入不同主体、资本和客户资产制度；国际原则提供比较语言，却不会自动变成本地法律。</h2>
        <div className="table-scroll" role="region" aria-label="美国、欧盟、中国证券中介规则边界，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">三法域主体、审慎框架、客户资产和失败处置边界</caption>
            <thead><tr><th scope="col">法域/层</th><th scope="col">本节读取的主体与规则</th><th scope="col">不得替换成</th></tr></thead>
            <tbody>
              <tr><th scope="row">美国</th><td>broker-dealer；15c3-1 net capital、15c3-3、Reg T/FINRA、SIPA</td><td>银行 Basel CET1/LCR 或 FDIC deposit insurance</td></tr>
              <tr><th scope="row">欧盟</th><td>MiFID II investment firm；IFR/IFD、client-assets safeguards、SFTR/EMIR/CSDR</td><td>一套不经成员国转置与 firm classification 的统一美国式规则</td></tr>
              <tr><th scope="row">中国</th><td>证券公司；证券法、监督管理条例、风险控制指标、客户结算资金与中登规则</td><td>Rule 15c3-1/15c3-3 或固定 SIPC 账户额度</td></tr>
              <tr><th scope="row">国际标准</th><td>IOSCO principles、PFMI、FSB SFT/haircut frameworks、Basel bank standards</td><td>无需国内实施即可直接执行的全球法</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          美国 broker/dealer 定义与注册以 Securities Exchange Act 为起点；欧盟 dealing on own account、execution on behalf 和 investment-firm perimeter 回到 MiFID II，审慎要求还依 IFR/IFD classification；中国证券公司以证券法和现行行政规章为起点。欧盟 IFR、EMIR、SFTR 与 CSDR 是 regulations，在自身适用范围内直接适用；MiFID II、IFD 与相关 delegated directive 则涉及成员国转置。Consolidated text 便于阅读，但最终法源仍需核对 Official Journal authentic acts、technical rules 和适用的国内实施。中国 2023 年《证券公司监督管理条例》征求意见稿截至本节访问日仍不能当作生效规则；2026 年证监会立法计划仍将配合修订该条例列为工作。<Cite n={1} /><Cite n={2} /><Cite n={38} /><Cite n={39} /><Cite n={40} /><Cite n={41} /><Cite n={42} /><Cite n={43} /><Cite n={44} /><Cite n={46} /><Cite n={47} /><Cite n={90} /><Cite n={91} />
        </p>
        <p>
          客户保护尤其不能做名词直译：欧盟 Delegated Directive 的 records、segregated identification、third-party custody 与 reuse consent，需要结合成员国财产/破产法；中国客户交易结算资金专户与第三方存管不是美国 reserve formula；IOSCO、PFMI 和 FSB 文件给出监管目标与原则，不自行创造私人权利。<Cite n={30} /><Cite n={31} /><Cite n={39} /><Cite n={42} /><Cite n={43} /><Cite n={44} /><Cite n={50} /><Cite n={51} /><Cite n={52} />
        </p>
        <p>
          中国证券公司还使用风险覆盖率、资本杠杆率、流动性覆盖率和净稳定资金率等本地指标；现行《风险控制指标计算标准规定》自 2025 年 1 月 1 日施行。名称与 Basel 指标相似不代表分子、分母、主体和计算系数相同。<Cite n={48} /><Cite n={49} />
        </p>
      </section>

      <section className="lesson-section" id="us-current-transitions">
        <p className="section-kicker">44 · 美国现行过渡事项 · 截至 2026-08-30</p>
        <h2>规则生效、强制合规、firm 迁移和 pending relief 是四种不同法律状态；“已经宣布”不能自动写成“所有主体今天都按新制运行”。</h2>
        <div className="table-scroll" role="region" aria-label="美国券商当前规则转换时间表，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">截至 2026 年 8 月 30 日的 daily reserve、intraday margin、T+1 和 Treasury clearing 状态</caption>
            <thead><tr><th scope="col">事项</th><th scope="col">截至访问日状态</th><th scope="col">最易误写</th></tr></thead>
            <tbody>
              <tr><th scope="row">Daily reserve</th><td>适用门槛的 carrying firms 已于 2026-06-30 进入强制每日计算</td><td>不是所有 broker-dealers；5 亿美元是平均 customer+PAB total credits</td></tr>
              <tr><th scope="row">Intraday margin</th><td>新 FINRA framework 2026-06-04 生效，member firm 可迁移至 2027-10-20</td><td>过渡期不能说每家 firm 的旧 PDT/$25,000 处理都已消失</td></tr>
              <tr><th scope="row">T+1</th><td>大多数 Rule 15c6-1 覆盖交易自 2024-05-28 实施</td><td>不覆盖所有 government/municipal/CP 等，也非所有 securities loans</td></tr>
              <tr><th scope="row">Treasury clearing</th><td>Trade Submission Requirement：规则范围内 eligible secondary-market cash transactions 的 direct-participant compliance date 为 2026-12-31；eligible repo transactions 为 2027-06-30</td><td>不是所有 Treasury 交易或投资者；规则 effective date、compliance date、final order 与 pending request 也不同</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          Daily reserve 的最终规则、延期规则和 staff FAQ 要一起读；新 intraday-margin order 与 FINRA 官方过渡说明共同确认监管转换和 firm-level migration，不保证所有经纪账户在同一天切换。<Cite n={10} /><Cite n={11} /><Cite n={12} /><Cite n={14} /><Cite n={15} /><Cite n={92} /> Treasury clearing 的 Trade Submission Requirement 是由 U.S. Treasury securities CCA 的 participant rules 约束 direct participant 提交其作为对手方的、定义范围内 eligible secondary-market transactions；cash 与 repo 的范围和排除项必须分别判断，不能把日期扩展成所有 Treasury 投资者的普遍强制清算日。正式 2025 延期将上述范围内 cash 和 repo 的 compliance date 分别移至表中日期。SEC implementation hub 与固定 releases 显示：34-105248、34-105736 已是 final orders，34-105980 仍是 notice/comment；其他申请也必须逐件读取，不能从申请标题推断豁免已获准。<Cite n={22} /><Cite n={23} /><Cite n={24} /><Cite n={93} /><Cite n={94} /><Cite n={95} />
        </p>
        <p>
          这一节是有日期的法律快照，不是永久教材常数。任何实务或研究复现都应保存访问日、release/order 编号、适用产品、主体和过渡选择；未来网页更新必须先复核一手法源，再改叙述和练习。
        </p>
      </section>

      <section className="lesson-section" id="march-2020">
        <p className="section-kicker">45 · CASE · 2020 年 3 月的 Dealer Capacity</p>
        <h2>“安全资产被抛售”和“公司债流动性消失”不是单一市场故障，而是客户卖压、相对价值减仓、dealer 余量与现金 margin 时钟在不同市场相遇。</h2>
        <p>
          在美国 Treasury 市场，投资者现金需求与 leveraged relative-value trades 减仓增加可交易供给；dealer 虽吸收大量库存，但 balance-sheet utilization、风险与融资约束令承接边际变贵，Treasury convenience yield 与相对价值关系异常。<Cite n={82} /><Cite n={83} /><Cite n={84} /> 在公司债市场，dealer 风险本金承接下降、agency/search 比重上升，客户交易成本扩大。<Cite n={80} /><Cite n={81} /> 结果不是“所有 dealer 完全停止做市”，而是不同 dealer、资产与客户方向下的 capacity 更不均匀。
        </p>
        <p>
          Margining review 还显示 2020 年 3–4 月 IM/VM calls 给非银与中介带来显著现金需求；聚合 broker-dealer leverage 的顺周期证据解释一条可能机制，但不能把每家 firm 的动作机械化。外部 repo 信贷不必先全面撤回：内部 VaR、precautionary liquidity、basis losses 和最终客户提款同样可以推动减仓。<Cite n={32} /><Cite n={72} /><Cite n={73} /><Cite n={84} />
        </p>
        <div className="research-card">
          <span>CASE DIAGNOSTIC · 不做单变量归因</span>
          <h3>客户为什么卖、dealer 接住多少、风险如何外部化、哪项余量先变紧、政策首先修复哪条链，必须分别回答。</h3>
          <p>观察价格异常只是起点。可信复盘要并列 Treasury/customer flow、dealer inventories、repo terms、VaR/IM/VM、interdealer transactions、corporate-bond agency/principal share 和政策工具时序；不同研究覆盖不同切片，合并结论时需保留样本边界。</p>
        </div>
      </section>

      <section className="lesson-section" id="archegos">
        <p className="section-kicker">46 · CASE · Archegos：客户信用怎样变成 Dealer 损失</p>
        <h2>经济 beta 被 swap 包装、多个 prime broker 各看局部，而具体 prime 的 margin 与控制未匹配集中尾部暴露；再遇到跳空与拥挤清算，才形成完整损失链。</h2>
        <p>
          Archegos 通过 total return swaps 和其他 financing relationships 获得集中权益敞口。Prime broker 收到 margin、持有 hedge 或相关头寸，看似日常 delta 可控；但客户 default 时，close-out price 与最后一次 margin valuation 之间的 gap、集中持仓的 market depth、跨 prime 的信息不完整和 liquidation coordination 共同决定最终损失。Delta hedge 降低日常方向暴露，不消灭客户信用和 gap risk。<Cite n={36} /><Cite n={37} />
        </p>
        <p>
          FINMA 和 Credit Suisse 特别委员会材料记录了 limit exceptions、margin erosion、escalation 与治理失败。教训不是“TRS 本身危险”或“只要多收固定比例保证金即可”，而是 limit 必须绑定 liquidation horizon、concentration、wrong-way risk 和可信退出价格；过去按时补足 call 不能验证下一次跳空后的可清算性。Prime-broker network 研究还提醒，客户可以尝试跨关系替代融资，但替代在 stress 中不完整。<Cite n={36} /><Cite n={37} /><Cite n={85} />
        </p>
        <p>
          计算时应先把 close-out exposure 定义为真实清算价格下的合约应收，再减去同一 netting set 内可执行、可处置的 collateral 与其他 recoveries，并加入 execution、funding、税务和诉讼成本。若所谓 shortfall 已经是 collateral 后净额，就不得再减一次抵押品；最后屏幕中价也不能替代大额退出价格。
        </p>
      </section>

      <section className="lesson-section" id="dealer-failure-sipc">
        <p className="section-kicker">47 · Dealer Failure 与 Customer Recovery</p>
        <h2>失败时最先问的不是“券商市值跌了多少”，而是客户身份、财产池、记录、控制位置、未交收和适用处置法怎样决定返还路径。</h2>
        <p>
          美国 SIPA liquidation 由法院 protective decree、trustee、claims、customer/net equity 与 customer-property pool 组织；SIPC advances 可在法定范围内补充客户财产短缺。现行通常上限为每一 customer/separate capacity 50 万美元、其中现金 25 万美元，但它不保障 market loss、承诺收益、所有商品/衍生品或任何不具 customer status 的债权。账户转移或 direct payment 也有核对和申报时序，不是即时“保险赔付”。<Cite n={26} /><Cite n={27} /><Cite n={28} />
        </p>
        <p>
          学术上的 dealer-bank failure mechanics 说明 repo、derivatives、prime-broker clients 与 settlement 会在 close-out 和客户迁移中相互牵连；它解释经济过程，不创设法律权限。<Cite n={71} /> 欧盟 BRRD 只覆盖其法定 perimeter 内的 credit institutions 与某些 investment firms；中国《证券公司风险处置条例》提供停业整顿、托管、接管、行政重组、撤销与清算等本地路径，中国投资者保护基金也不是每户固定额度的 SIPC 克隆。<Cite n={45} /><Cite n={53} /><Cite n={54} />
        </p>
        <p>
          “客户资产已隔离”可以显著改善返还，却不能保证记录永远准确、证券从未被合法借出、所有 pending trades 已完成或市场价值不变。正常期 control/reserve 证据与失败期 claim classification 必须分别审计。
        </p>
      </section>

      <section className="lesson-section" id="stress-comparison">
        <p className="section-kicker">48 · 三类压力的机制比较</p>
        <h2>市场流动性危机、客户集中违约和 dealer 自身失败可能同时出现，但它们的第一损失承担者、最短时钟和修复工具不同。</h2>
        <div className="table-scroll" role="region" aria-label="三类 dealer 压力比较，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">2020 市场冲击、Archegos 客户违约和 carrying dealer 失败的机制区别</caption>
            <thead><tr><th scope="col">情景</th><th scope="col">第一冲击</th><th scope="col">最短时钟</th><th scope="col">关键证据/工具</th></tr></thead>
            <tbody>
              <tr><th scope="row">市场共同卖压</th><td>客户流、价格、波动与 dealer inventory</td><td>报价、hedge、IM/VM、repo 与日内结算</td><td>flow/inventory/terms；市场与融资工具</td></tr>
              <tr><th scope="row">PB 客户违约</th><td>counterparty gap、集中头寸与 collateral shortfall</td><td>margin call、close-out、跨 prime liquidation</td><td>合同/netting/真实退出；对冲与有序处置</td></tr>
              <tr><th scope="row">Carrying dealer 失败</th><td>firm capital/liquidity/operations 与客户财产缺口</td><td>支付、控制证券、账户冻结/迁移、claims</td><td>账本/control/reserve；SIPA 或本地处置法</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          同一个新闻标签“券商爆雷”可能混合三行。若 dealer 只是暂时缺日内现金，外部 liquidity 可争取时间；若客户 collateral 无法覆盖 close-out loss，需要先分配信用损失；若 firm 自身不可持续，继续融资不能替代处置。工具与缺口错配会暂时移动风险，却不闭合账本。
        </p>
      </section>

      <section className="lesson-section" id="state-dependent-response">
        <p className="section-kicker">49 · 状态依赖的最终响应</p>
        <h2>“Dealer 稳定市场”与“Dealer 放大市场”不是两套互斥理论，而是同一约束系统在冲击前状态不同的两条分支。</h2>
        <div className="table-scroll" role="region" aria-label="dealer 状态依赖响应矩阵，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">冲击前余量、订单性质、动作和反馈方向</caption>
            <thead><tr><th scope="col">冲击前状态</th><th scope="col">客户流/信息</th><th scope="col">更可能动作</th><th scope="col">反馈</th></tr></thead>
            <tbody>
              <tr><th scope="row">余量充足、融资稳定</th><td>非信息性暂时卖压</td><td>principal retain、缓慢 hedge、网络匹配</td><td>库存吸收，负反馈</td></tr>
              <tr><th scope="row">余量充足、信息风险高</th><td>可能 informed order</td><td>spread/center 更新、限 size、快速 hedge</td><td>价格发现，不一定回转</td></tr>
              <tr><th scope="row">库存/风险限额接近上限</th><td>同向客户卖压</td><td>缩 bid、下移中心、转 agency、外部化</td><td>冲击增大</td></tr>
              <tr><th scope="row">客户 collateral 与 funding 同时紧</th><td>margin-driven flow</td><td>加 margin、召回、卖/hedge、压融资</td><td>正反馈螺旋</td></tr>
              <tr><th scope="row">本 firm 紧、网络替代充分</th><td>可迁移订单</td><td>转另一 dealer/venue；合格交易进入 CCP 只改变净额与 margin</td><td>替代 dealer 承接时局部冲击可被吸收</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中介资产定价、aggregate leverage 和 dealer-level risk-limit 研究各测量不同层级；不能把 holding-company capital factor 直接当作单家 broker-dealer net capital，也不能由总杠杆周期推出每个 desk 的订单。<Cite n={62} /><Cite n={63} /><Cite n={64} /><Cite n={72} /><Cite n={73} /><Cite n={79} /> 正确预测必须明确条件：“在某法人、某时钟、某客户方向和某一 binding constraint 下，更可能出现哪种动作”。
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">阶段七 · 研究、实验与接口　|　50 · Dealer-Capacity 识别协议</p>
        <h2>看到 spread、库存和 dealer leverage 同时变化，还不能知道谁导致谁；先冻结冲击与可行域，再用 dealer×security×client×time 的异质性拆因果。</h2>
        <div className="research-card">
          <span>EMPIRICAL DESIGN · TESTABLE LOCAL CLAIM</span>
          <h3>核心问题：事前暴露于一项外生或预定的融资/资本/内部限额冲击，是否使同一证券、同一时段的受冲击 dealer 减少 principal absorption，并提高其客户的 immediacy cost？</h3>
          <p>报价或库存结果使用 dealer×security×time 单位：Y<sub>dst</sub>=α<sub>st</sub>+α<sub>ds</sub>+β(Exposure<sub>d,pre</sub>×Shock<sub>t</sub>)+ΓX<sub>d,pre</sub>×Shock<sub>t</sub>+ε<sub>dst</sub>。若研究客户成交或融资条款，再加入预先定义且不随结果改变含义的 customer×side cell c，并使用 Y<sub>dsct</sub>、security×customer-side×time fixed effects。Inventory change、quote size、spread、principal share、price impact 和 financing terms 必须分别估计，不能用一个回归和不透明指数跨越不同观测单位。</p>
          <p><b>逐项翻译：</b>d 是 dealer，s 是 security，t 是时间；扩展式中的 c 是事前定义的客户类型与买卖方向格。α<sub>st</sub> 吸收同一证券同一时点面对的共同冲击，α<sub>ds</sub> 吸收该 dealer 在该证券上的稳定差异。Exposure<sub>d,pre</sub> 是冲击前已经冻结的暴露，Shock<sub>t</sub> 标记冲击强度；β 才是主要比较量，表示高一单位事前暴露的 dealer 在冲击后相对低暴露 dealer 多改变多少 Y。ΓX<sub>d,pre</sub>×Shock<sub>t</sub> 允许其他事前特征也产生不同反应，ε 是这些项没有解释的结果差异。β 的预期符号必须随 Y 预注册：若 Y 是 principal absorption 或 quote size，容量收紧假说通常预测 β&lt;0；若 Y 是 spread 或客户 immediacy cost，通常预测 β&gt;0。符号相符仍不自动证明因果，还要满足冲击外生性、前趋势、第一阶段和无差异性遗漏冲击等识别条件。</p>
        </div>
        <ol className="diagnostic-list">
          <li><b>冻结法律和计量主体：</b>desk、registered entity、holding company 与 clearing member 不混用；跨法人转移单列。</li>
          <li><b>寻找事前冲击：</b>融资方暴露、预定 limit reset、规则阈值或与本地客户需求尽量独立的损失；不得使用当期库存下降定义“受约束”。</li>
          <li><b>验证第一阶段：</b>证明 funding terms、headroom、limit utilization、margin 或 settlement capacity 确实变化。</li>
          <li><b>观察动作而非只有结果：</b>分开 principal/agency、customer-facing/hedge、quote center/spread/size、retain/externalise。</li>
          <li><b>检查替代与网络：</b>客户是否转 dealer、其他节点是否承接、总成交与总融资是否恢复；份额迁移不等于总量修复。</li>
          <li><b>保护时序与标准误：</b>使用 event-time、前趋势、冲击赋值层级聚类；少数 dealer 时报告随机化或 wild-bootstrap 稳健性。</li>
          <li><b>检验状态符号：</b>按事前 headroom、订单信息性、资产流动性和网络替代分层，而不是只估计全样本平均 β。</li>
        </ol>
        <p>
          既有研究分别利用 funding reform、index exclusions、internal limits、疫情卖压和 Treasury utilization 建立局部识别；它们共同提供设计工具，却不构成一条跨市场永恒系数。<Cite n={70} /><Cite n={74} /><Cite n={75} /><Cite n={76} /><Cite n={79} /><Cite n={80} /><Cite n={83} /><Cite n={85} /><Cite n={86} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">51 · 互动实验</p>
        <h2>十道题反复训练同一顺序：先冻结主体、单位和时钟，再配平账本，最后比较约束容量与可执行动作。</h2>
        <BrokerDealerLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">52 · 主动练习</p>
        <h2>以下十道无脚本变式与互动实验共享同一数据源；先独立写出单位、公式和动作，再展开核对。</h2>
        <div className="exercise-list">
          {brokerDealerScenarios.map((scenario, index) => (
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
        <h2>如果下面十二组概念仍会互相替换，就还没有把客户订单连接到有限 dealer balance sheet。</h2>
        <div className="check-grid">
          <details><summary>01 · Broker 与 dealer 为什么不是两类永久机构？</summary><p>它们首先是逐笔角色：broker 为他人账户执行或促成，dealer 以自身账户成为对手方；同一注册主体可以在不同交易中切换，但披露、账本与责任随角色改变。</p></details>
          <details><summary>02 · Principal fill 为什么不等于期末库存增加同样数量？</summary><p>dealer 可以先与客户成交，再转售、跨市场 hedge、匹配另一客户或在窗口内平仓；必须联合观察 customer-facing flow、hedge flow 与 inventory path。</p></details>
          <details><summary>03 · Matched book 为什么不是 riskless 或零资产负债表？</summary><p>方向和期限可近似匹配，reverse repo 资产、repo 负债、gross notional、haircut basis、对手方、rollover、抵押品返还和结算义务仍存在。</p></details>
          <details><summary>04 · Repo haircut 与 net-capital haircut 有何根本不同？</summary><p>前者决定抵押品可换多少现金，后者把 firm 证券头寸风险转成监管净资本扣减；主体、基数、目的与时钟均不同。</p></details>
          <details><summary>05 · Net capital、customer reserve 与 possession/control 为什么要三分？</summary><p>Net capital 保护 firm 的流动清算能力，reserve 支持规定的客户现金净额，possession/control 处理特定客户证券位置；一项合规不证明另外两项合规。</p></details>
          <details><summary>06 · Margin 上调为什么不必立刻造成卖出？</summary><p>客户可以补现金、提供其他合格抵押品、降低另一敞口、迁移或协商；只有 call binding、资源不足且 close-out/清算发生时才形成强迫订单。</p></details>
          <details><summary>07 · IM 与 VM 为什么不能相互替代？</summary><p>IM 缓冲违约后潜在未来变化，VM 结算已经发生的当前损益或敞口；一方有足够 IM 不等于能在今日 VM deadline 前支付现金。</p></details>
          <details><summary>08 · 经济对冲为何仍可能出现 settlement shortfall？</summary><p>两条腿可能位于不同法人、币种、CCP、账户和截止时间；明日应收不能自动覆盖今日先付，特定证券也不能由总现金替代。</p></details>
          <details><summary>09 · Spread widening 为什么不能单独证明 dealer 受资本约束？</summary><p>Adverse selection、波动、订单处理、竞争与信息也会扩大 spread；需验证事前 headroom、第一阶段冲击以及 inventory/size/funding 的共同变化。</p></details>
          <details><summary>10 · Dealer 为什么既能稳定又能放大价格？</summary><p>余量充足时库存桥接和网络替代吸收暂时流；余量紧时 margin、融资、撤量和 hedge/sales 相互回写。反馈符号由冲击前状态决定。</p></details>
          <details><summary>11 · SIPC 为什么不是市值保险或 FDIC？</summary><p>SIPA/SIPC 处理合格 customer、net equity 与缺失 customer property，并有账户/现金上限；市场亏损、坏建议和所有产品不在统一保障内。</p></details>
          <details><summary>12 · 怎样把“dealer capacity 下降”变成可证伪研究？</summary><p>用事前外生/预定冲击、第一阶段 headroom 证据、同证券同客户方向比较、principal/agency/hedge 动作与网络替代，预先声明状态异质性和失败条件。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-map">
        <p className="section-kicker">54 · 课程接口</p>
        <h2>2.07 输出“客户需求—dealer 账本—约束—动作—市场反馈”这一转换层，不提前吞并高频算法、通用风险管理或系统级传染。</h2>
        <div className="interface-grid">
          <article><span>← 1.05–1.14 / 1.19–1.20</span><h3>Microstructure Inputs</h3><p>调用 spread、price impact、inventory 与 margin 基础；本节补上 legal entity、融资、客户产权、净资本与清算。</p></article>
          <article><span>← 2.06</span><h3>Bank versus Broker–Dealer</h3><p>继承资产负债表、资本与流动性分账；银行 CET1/LCR、存款和贷款合同不能替代 dealer net capital、reserve、inventory 与 PB。</p></article>
          <article><span>→ 2.08</span><h3>Market Maker / HFT</h3><p>输出 inventory target、reservation price、spread/size 与 risk limits；下一节进入更短时标的算法目标、queue、latency 与 adverse selection。</p></article>
          <article><span>→ 2.16–2.18</span><h3>Risk & Other Investors</h3><p>本节只展示 dealer 约束实例；通用 VaR/stress、基金赎回和 benchmark/tracking-error 留给各自主体。</p></article>
          <article><span>→ Chapter 3–4</span><h3>Macro & Cross-Market</h3><p>输出 repo、Treasury、collateral 与美元 settlement 的中介接口；利率、全球美元融资和跨资产传播后续展开。</p></article>
          <article><span>→ 7.11–7.14</span><h3>Systemic Feedback</h3><p>本节闭合单家 dealer 与局部网络；共同持仓、CCP network、aggregate leverage 和内生风险留给系统层。</p></article>
        </div>
      </section>

      <section className="lesson-section" id="closing-diagnostic">
        <p className="section-kicker">55 · 最终诊断</p>
        <h2>面对任何“券商会接盘、撤单、加保证金或被迫卖出”的判断，先重建产权和约束，再推导动作；不要从机构标签直接跳到价格方向。</h2>
        <p className="closing-thesis">
          先冻结 legal entity、法域、account type、broker/principal role、币种、净额集合、custodian/CCP/CSD 与截止时点；把客户证券和现金、firm inventory、margin debits/free credits、derivatives MtM、IM/VM、reverse repo/repo、借券、未交收和 fails 放入同一双重记账，同时保留现金腿与证券腿。随后分别读取 Rule 15c3-1 或本地资本、customer reserve、possession/control、Reg T/maintenance/house margin、PB concentration、VaR/stress、funding rollover、CCP default resources 与 settlement headroom，把每项余量换算成“每单位候选动作的容量”。只有这时，才能比较 principal retain、agency/search、same-security sale、cross-market hedge、quote-center skew、spread、size、margin、haircut、collateral substitution、融资和网络迁移。动作进入市场后，spread、depth、price impact、客户 collateral、波动和融资条件会回写下一轮可行域：余量充足时形成库存吸收的负反馈，余量紧张时形成 margin—funding—sale 的正反馈。最后用事前冲击、第一阶段、动作数据、网络替代和状态异质性去证伪这条链；这才是 broker-dealer 作为市场中介的完整含义。
        </p>
      </section>
    </>
  );
}

export const lesson207: LessonRecord = {
  slug: '2-07',
  id: '2.07',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Broker–Dealer / Securities Firms：客户、融资、库存与市场流动性',
  subtitle: '从法律实体与客户产权出发，解释订单、repo、证券借贷、margin、净资本和清算时钟怎样进入 dealer 库存、报价、融资动作与状态依赖反馈',
  readingTime: '核心阅读约 100–120 分钟；互动实验快速 25–30／含复盘 45–55，主动练习核对 25–30／完整书写 45–60，理解检查快速 10–12／完整复述 18–22，课程接口 4 分钟；快速路径约 164–196 分钟，完整学习约 212–261 分钟（建议分两至三次完成；参考文献与延伸阅读不计）',
  prerequisite: '2.06；零背景先读 T06；按需回看 1.05–1.06、1.09、1.12–1.14、1.19–1.20 与 T07；研究部分按需 T05',
  updatedAt: '2026-08-30',
  revision: '2.07-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.07-r2',
      summary: '冻结 r2 无 P0；要求修正 tentative net capital 的法定计算顺序，并补足机械去杠杆的正权益定义域与 Treasury clearing 的 CCA／direct-participant／eligible-transaction 适用边界。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.07-r2',
      summary: '冻结 r2 无 P0/P1；要求消除目录双编号，为研究回归式逐项翻译并补 T05 先修，以及在首次使用前定义 TRS 与 delta-one。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.07-r3',
      summary: '冻结 r3 已闭合全部事实与数学问题；95 条来源、12 个公式、十道互动题与十道静态变式全量回归，P0–P3 全清。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.07-r3',
      summary: '冻结 r3 的 56 节单编号目录、术语与回归解释、互动状态、SSR、无脚本替代、移动目录、无障碍和导航全部通过，P0–P3 全清。',
    },
  ],
  previous: { slug: '2-06', label: '2.06 Banks as Leveraged Intermediaries' },
  next: { slug: '2-08', label: '2.08 Market Maker / HFT 作为 Agent' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整系统' },
    { id: 'scope-prerequisite', label: '范围、先修与术语桥' },
    { id: 'legal-entity', label: '法律实体优先' },
    { id: 'broker-agency', label: 'Broker：Agency 机制' },
    { id: 'dealer-principal', label: 'Dealer：Principal 机制' },
    { id: 'introducing-carrying', label: 'Introducing 与 Carrying' },
    { id: 'prime-brokerage', label: 'Prime Brokerage 服务束' },
    { id: 'role-infrastructure', label: '标签与基础设施' },
    { id: 'client-firm-property', label: '客户财产与 Firm Property' },
    { id: 'balance-sheet-inventory', label: '资产负债表、多头与空头' },
    { id: 'customer-debits-credits', label: 'Margin Debits 与 Free Credits' },
    { id: 'derivative-margin-ledger', label: 'Derivatives：MtM、IM 与 VM' },
    { id: 'reverse-repo', label: 'Reverse Repo：现金贷出腿' },
    { id: 'repo-funding', label: 'Repo：现金借入腿' },
    { id: 'haircut-dictionary', label: 'Haircut 词典' },
    { id: 'securities-lending', label: 'Securities Borrowing / Lending' },
    { id: 'unsettled-fails', label: 'Unsettled Trades 与 Fails' },
    { id: 'matched-book', label: 'Matched Book 的两种视图' },
    { id: 'gross-netting', label: 'Gross Exposure 与可执行 Netting' },
    { id: 'rehypothecation', label: 'Collateral Reuse / Rehypothecation' },
    { id: 'inventory-target', label: 'Inventory Target' },
    { id: 'reservation-price', label: 'Reservation Price' },
    { id: 'spread-quote', label: 'Spread、Skew 与 Size' },
    { id: 'price-impact', label: 'Price Impact' },
    { id: 'inventory-reversion', label: 'Inventory Reversion' },
    { id: 'net-capital', label: 'Rule 15c3-1 Net Capital' },
    { id: 'customer-reserve', label: 'Rule 15c3-3 Customer Reserve' },
    { id: 'possession-control', label: 'Possession or Control' },
    { id: 'margin-stack', label: 'Margin Stack' },
    { id: 'pb-concentration-margin', label: 'PB Concentration Margin' },
    { id: 'internal-risk-limits', label: 'Internal Risk Limits' },
    { id: 'funding-rollover', label: 'Funding Rollover' },
    { id: 'ccp-initial-margin', label: 'CCP Initial Margin' },
    { id: 'variation-margin', label: 'Variation Margin' },
    { id: 'default-fund', label: 'Default Fund 与 Loss Waterfall' },
    { id: 'settlement-headroom', label: 'Settlement Headroom' },
    { id: 'principal-agency-hedge', label: 'Principal、Agency 与 Hedge' },
    { id: 'financing-collateral-response', label: 'Financing 与 Collateral Response' },
    { id: 'positive-feedback', label: '正反馈：流动性螺旋' },
    { id: 'negative-feedback', label: '负反馈：库存吸收' },
    { id: 'customer-liquidity', label: 'Customer Liquidity' },
    { id: 'network-substitution', label: 'Dealer Network 与替代' },
    { id: 'jurisdiction-status', label: '法域与法律状态' },
    { id: 'us-current-transitions', label: '美国现行过渡事项' },
    { id: 'march-2020', label: 'CASE：2020 年 3 月' },
    { id: 'archegos', label: 'CASE：Archegos' },
    { id: 'dealer-failure-sipc', label: 'Dealer Failure 与 Customer Recovery' },
    { id: 'stress-comparison', label: '三类压力的机制比较' },
    { id: 'state-dependent-response', label: '状态依赖的最终响应' },
    { id: 'research-protocol', label: 'Dealer-Capacity 识别协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'interfaces-map', label: '课程接口' },
    { id: 'closing-diagnostic', label: '最终诊断' },
  ],
  Content: Lesson207Content,
  references: [
    { id: 1, authors: 'United States Congress', year: '1934/current', accessedAt: '2026-08-30', title: '15 U.S.C. § 78c — Definitions and Application', publication: 'Securities Exchange Act § 3; preliminary U.S. Code current through 27 August 2026', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title15-section78c', use: '核对 broker、dealer 及 statutory exceptions；不能按集团品牌推断具体法律实体身份。' },
    { id: 2, authors: 'United States Congress', year: '1934/current', accessedAt: '2026-08-30', title: '15 U.S.C. § 78o — Registration and Regulation of Brokers and Dealers', publication: 'Securities Exchange Act § 15', url: 'https://uscode.house.gov/view.xhtml?edition=prelim&num=0&req=granuleid%3AUSC-prelim-title15-section78o', use: '核对注册要求及资本、客户证券与客户信用余额规则的授权层；具体公式另引实施规则。' },
    { id: 3, authors: 'SEC Division of Trading and Markets', year: '2008/2009', accessedAt: '2026-08-30', title: 'Guide to Broker-Dealer Registration', publication: 'SEC staff compliance guide, April 2008; posted 6 October 2009', url: 'https://www.sec.gov/about/divisions-offices/division-trading-markets/division-trading-markets-compliance-guides/guide-broker-dealer-registration', use: '解释 broker/dealer、matched-book repo dealer、注册及主要 financial-responsibility obligations；不是完整法律意见。' },
    { id: 4, authors: 'Federal Reserve Bank of New York', year: '2026/current', accessedAt: '2026-08-30', title: 'Primary Dealers', publication: 'Current standing-counterparty and eligibility page', url: 'https://www.newyorkfed.org/markets/primarydealers', use: '核对 primary dealer 的交易对手指定、国债拍卖、做市和报告义务；不是银行牌照或政府担保。' },
    { id: 5, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'FINRA Rule 4311 — Carrying Agreements', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4311', use: '核对 introducing 与 carrying firm 的书面责任划分及不可转移监管责任。' },
    { id: 6, authors: 'SEC Division of Market Regulation', year: '1994', accessedAt: '2026-08-30', title: 'Prime Broker Committee, Securities Industry Association — No-Action Letter', publication: 'SEC staff no-action letter, 25 January 1994', url: 'https://www.sec.gov/divisions/marketreg/mr-noaction/pbroker012594-out.pdf', use: '提供特定事实下 executing broker、prime broker、custodian 与客户协议结构；旧结算时序须由当前规则更新。' },
    { id: 7, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.15c3-1 — Net Capital Requirements for Brokers or Dealers', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-1', use: '核对 tentative net capital、不可认可资产、证券扣减、集中度和最低要求；不等于 GAAP equity 或 Basel CET1。' },
    { id: 8, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.15c3-3 — Customer Protection: Reserves and Custody of Securities', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-3', use: '核对 possession or control 与 customer/PAB reserve 两套机制；不等于存款保险。' },
    { id: 9, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.15c3-3a — Exhibit A, Formula for Determination of Customer and PAB Account Reserve Requirements', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-3a', use: '核对规定 credits、允许 debits、Notes 与 special reserve deposit；不能把原始客户现金机械代入。' },
    { id: 10, authors: 'U.S. Securities and Exchange Commission', year: '2024', accessedAt: '2026-08-30', title: 'Daily Computation of Customer and Broker-Dealer Reserve Requirements under the Broker-Dealer Customer Protection Rule', publication: 'Release No. 34-102022; adopted 20 December 2024; effective 14 March 2025', url: 'https://www.sec.gov/files/rules/final/2024/34-102022.pdf', use: '核对平均 customer 与 PAB total credits 至少 5 亿美元的 carrying broker-dealers 改为每日计算。' },
    { id: 11, authors: 'U.S. Securities and Exchange Commission', year: '2025', accessedAt: '2026-08-30', title: 'Extension of Compliance Date for Required Daily Computation of Customer and Broker-Dealer Reserve Requirements under the Broker-Dealer Customer Protection Rule', publication: 'Release No. 34-103320; effective 1 July 2025', url: 'https://www.sec.gov/files/rules/final/2025/34-103320.pdf', use: '核对 mandatory compliance date 延至 2026-06-30；不是撤销规则或扩大主体。' },
    { id: 12, authors: 'SEC Division of Trading and Markets', year: '2025/current', accessedAt: '2026-08-30', title: 'Frequently Asked Questions — Rule 15c3-3 and Daily Customer and PAB Reserve Computations', publication: 'SEC staff FAQ', url: 'https://www.sec.gov/rules-regulations/staff-guidance/trading-markets-frequently-asked-questions/frequently-asked-questions-rule-15c3-3-daily-customer-pab-reserve-computations', use: '核对首批测算期、起始日、voluntary daily computation 和 staff operational views；无独立法律效力。' },
    { id: 13, authors: 'Board of Governors of the Federal Reserve System', year: '2026/current', accessedAt: '2026-08-30', title: '12 CFR Part 220 — Credit by Brokers and Dealers (Regulation T)', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-12/chapter-II/subchapter-A/part-220', use: '核对客户证券信用、账户、付款时限和适用初始保证金；50% 不是所有证券与账户的统一比例。' },
    { id: 14, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'FINRA Rule 4210 — Margin Requirements', publication: 'FINRA Rulebook', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210', use: '核对 maintenance、portfolio、house margin 与 Covered Agency Transactions；过渡期须逐 firm 确认。' },
    { id: 15, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'Self-Regulatory Organizations; Financial Industry Regulatory Authority, Inc.; Notice of Filing of Amendment No. 1 and Order Granting Accelerated Approval of a Proposed Rule Change, as Modified by Amendment No. 1, to Amend FINRA Rule 4210 (Margin Requirements) to Replace the Day Trading Margin Provisions with Intraday Margin Standards', publication: 'Release No. 34-105226; approved 14 April 2026', url: 'https://www.sec.gov/files/rules/sro/finra/2026/34-105226.pdf', use: '核对 SEC 批准、相对生效和 phase-in 框架；具体日历日期与 firm-level transition 联合引用 FINRA 官方说明。' },
    { id: 16, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.15c3-5 — Risk Management Controls for Brokers or Dealers With Market Access', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-5', use: '核对 pre-trade thresholds、erroneous-order controls、authorized access 与 review；订单阈值不是 firm-wide capital。' },
    { id: 17, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.17a-5 — Reports To Be Made by Certain Brokers and Dealers', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17a-5', use: '核对 FOCUS、年度审计与 compliance/exemption reports；FOCUS 不是实时风险系统。' },
    { id: 18, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'eFOCUS — Financial and Operational Combined Uniform Single Reports', publication: 'FINRA regulatory filing portal and current instructions; amendments effective 2026-03-01 and 2027-03-01', url: 'https://www.finra.org/filing-reporting/efocus', use: '连接证券头寸、应收应付、净资本与 reserve 报表；须标注 Part、版本与报告期。' },
    { id: 19, authors: 'U.S. Securities and Exchange Commission', year: '2023', accessedAt: '2026-08-30', title: 'Shortening the Securities Transaction Settlement Cycle', publication: 'Release Nos. 34-96930 and IA-6239; 88 FR 13872; compliance 28 May 2024', url: 'https://www.sec.gov/files/rules/final/2023/34-96930.pdf', use: '核对大多数适用证券的默认 T+1 和 trade-date processing；不是所有证券借贷、government securities 或 derivatives 的统一 T+1。' },
    { id: 20, authors: 'SEC Staff', year: '2024/current', accessedAt: '2026-08-30', title: 'Shortening the Securities Transaction Settlement Cycle — Frequently Asked Questions Regarding the Transition to a T+1 Standard Settlement Cycle', publication: 'SEC staff FAQ, 27 March 2024', url: 'https://www.sec.gov/exams/educationhelpguidesfaqs/t1-faq', use: '核对 product exclusions 与 securities-lending recall 的间接压力；staff FAQ 无独立法律效力。' },
    { id: 21, authors: 'FINRA', year: '2026/current', accessedAt: '2026-08-30', title: 'FINRA Rule 11320 — Dates of Delivery', publication: 'FINRA Uniform Practice Code', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/11320', use: '核对 FINRA-covered regular-way delivery；不能替代专门产品规则。' },
    { id: 22, authors: 'U.S. Securities and Exchange Commission', year: '2023', accessedAt: '2026-08-30', title: 'Standards for Covered Clearing Agencies for U.S. Treasury Securities and Application of the Broker-Dealer Customer Protection Rule With Respect to U.S. Treasury Securities', publication: 'Release No. 34-99149; effective 18 March 2024', url: 'https://www.sec.gov/files/rules/final/2023/34-99149.pdf', use: '核对 Treasury CCA participant submission、eligible secondary transactions、margin separation 与 Note H；不是所有客户直接入会。' },
    { id: 23, authors: 'U.S. Securities and Exchange Commission', year: '2025', accessedAt: '2026-08-30', title: 'Extension of Compliance Dates for Standards for Covered Clearing Agencies for U.S. Treasury Securities and Application of the Broker-Dealer Customer Protection Rule With Respect to U.S. Treasury Securities', publication: 'Release No. 34-102487; effective 4 March 2025', url: 'https://www.sec.gov/files/rules/final/2025/34-102487.pdf', use: '核对 cash compliance 2026-12-31、repo compliance 2027-06-30；延期不是改变 effective date。' },
    { id: 24, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: 'Treasury Clearing Implementation', publication: 'SEC live implementation hub', url: 'https://www.sec.gov/featured-topics/treasury-clearing-implementation', use: '提供当前 deadlines、FAQs、orders 与 applications 总入口；final/pending 状态另以固定 Release 34-105248、34-105736、34-105980 冻结。' },
    { id: 25, authors: 'U.S. Securities and Exchange Commission', year: '2026/current', accessedAt: '2026-08-30', title: '17 CFR § 240.17Ad-22 — Standards for Clearing Agencies', publication: 'Electronic Code of Federal Regulations', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17ad-22', use: '核对 CCP credit、liquidity、margin、default resources、custody、operations 与 settlement finality；不直接给出全部客户 margin。' },
    { id: 26, authors: 'United States Congress', year: '1970/current', accessedAt: '2026-08-30', title: 'Securities Investor Protection Act of 1970, as Amended', publication: '15 U.S.C. §§ 78aaa–78lll; official compilation', url: 'https://www.govinfo.gov/app/details/COMPS-1886/', use: '核对 protective decree、trustee、customer/net equity、customer property、claims 与 SIPC advances；不是银行存款保险。' },
    { id: 27, authors: 'Securities Investor Protection Corporation', year: '2026/current', accessedAt: '2026-08-30', title: 'What SIPC Protects', publication: 'Official SIPC investor guidance', url: 'https://www.sipc.org/for-investors/what-sipc-protects', use: '核对每一 customer/separate capacity 上限 50 万美元、其中现金 25 万美元，以及 market-loss exclusions。' },
    { id: 28, authors: 'Securities Investor Protection Corporation', year: '2026/current', accessedAt: '2026-08-30', title: 'How a Liquidation Works', publication: 'Official SIPC process guide', url: 'https://www.sipc.org/cases-and-claims/how-a-liquidation-works', use: '解释 trustee、claims、账户转移、customer-property recovery 与 direct-payment 时序；返还并非即时。' },
    { id: 29, authors: 'Rajkamal Iyer and Marco Macchiavelli', year: '2017', accessedAt: '2026-08-30', title: 'The Systemic Nature of Settlement Fails', publication: 'Federal Reserve Board FEDS Notes, 3 July 2017; DOI 10.17016/2380-7172.1997', url: 'https://www.federalreserve.gov/econres/notes/feds-notes/the-systemic-nature-of-settlement-fails-20170703.html', use: '支持 Treasury fails-to-receive 沿交易链转成 fails-to-deliver 并占用 headroom；历史样本不能量化所有当前市场。' },
    { id: 30, authors: 'International Organization of Securities Commissions', year: '2017', accessedAt: '2026-08-30', title: 'Objectives and Principles of Securities Regulation', publication: 'IOSCO, May 2017', url: 'https://www.iosco.org/library/pubdocs/pdf/IOSCOPD561.pdf', use: '提供中介准入、资本、风险、客户资产与 failure procedures 的国际原则；不是国内现行法。' },
    { id: 31, authors: 'CPSS and IOSCO', year: '2012', accessedAt: '2026-08-30', title: 'Principles for Financial Market Infrastructures', publication: 'CPSS–IOSCO, April 2012', url: 'https://www.bis.org/cpmi/publ/d101a.htm', use: '支持 CCP/CSD collateral、margin、liquidity、segregation、portability、waterfall 与 finality；具体义务由本地实施。' },
    { id: 32, authors: 'BCBS, CPMI and IOSCO', year: '2022', accessedAt: '2026-08-30', title: 'Review of Margining Practices', publication: 'Final report, 29 September 2022', url: 'https://www.bis.org/publications/review-margining-practices', use: '复盘 2020 年 IM/VM calls 与流动性准备；不是统一 margin formula。' },
    { id: 33, authors: 'Financial Stability Board', year: '2013', accessedAt: '2026-08-30', title: 'Policy Framework for Addressing Shadow Banking Risks in Securities Lending and Repos', publication: 'FSB policy framework, 29 August 2013', url: 'https://www.fsb.org/2013/08/r_130829b/', use: '支持 SFT transparency、haircut methodology、cash-collateral reinvestment 与 reuse 风险；不是全球统一法律。' },
    { id: 34, authors: 'Financial Stability Board', year: '2015/2020', accessedAt: '2026-08-30', title: 'Regulatory Framework for Haircuts on Non-Centrally Cleared Securities Financing Transactions', publication: 'FSB framework; updated through 7 September 2020', url: 'https://www.fsb.org/2020/09/regulatory-framework-for-haircuts-on-non-centrally-cleared-securities-financing-transactions-5/', use: '支持特定 non-bank-to-non-bank SFT haircut floors；不覆盖全部 repo 或 CCP-cleared transactions。' },
    { id: 35, authors: 'Basel Committee on Banking Supervision', year: '2023/current', accessedAt: '2026-08-30', title: 'Basel Framework — LEV: Leverage Ratio', publication: 'Consolidated Basel Framework; effective 1 January 2023', url: 'https://www.bis.org/committees/bcbs/basel-framework/standard/lev', use: '解释银行 consolidated leverage exposure 对 derivatives、SFT 与 off-balance-sheet items 的处理；不能套到 standalone securities firm。' },
    { id: 36, authors: 'Swiss Financial Market Supervisory Authority', year: '2023', accessedAt: '2026-08-30', title: 'Archegos: FINMA Concludes Proceedings Against Credit Suisse', publication: 'FINMA media release, 24 July 2023', url: 'https://www.finma.ch/en/news/2023/07/20230724-mm-archegos/', use: '核对 Credit Suisse 的 governance、limits、margin 与 control failures；结论针对特定集团和程序。' },
    { id: 37, authors: 'Credit Suisse Group Special Committee of the Board', year: '2021', accessedAt: '2026-08-30', title: 'Report on Archegos Capital Management', publication: 'Company special-committee report filed with SEC, 29 July 2021', url: 'https://www.sec.gov/Archives/edgar/data/1159510/000137036821000064/a210729-ex992.htm', use: '核对 exposure、margin erosion、limit exceptions、escalation failures 与 liquidation timeline；不是监管裁决。' },
    { id: 38, authors: 'European Parliament and Council', year: '2014/current', accessedAt: '2026-08-30', title: 'Directive 2014/65/EU on Markets in Financial Instruments (MiFID II)', publication: 'EUR-Lex consolidated text as of 6 June 2026', url: 'https://eur-lex.europa.eu/eli/dir/2014/65', use: '核对 execution on behalf、dealing on own account、matched-principal trading 与 investment-firm perimeter；须看成员国转置。' },
    { id: 39, authors: 'European Commission', year: '2017/current', accessedAt: '2026-08-30', title: 'Commission Delegated Directive (EU) 2017/593 on Safeguarding Client Financial Instruments and Funds', publication: 'EUR-Lex consolidated text as of 6 June 2026', url: 'https://eur-lex.europa.eu/eli/dir_del/2017/593', use: '核对 client-asset records、reconciliation、segregated identification、third-party custody 与 reuse consent；破产效果依本地法。' },
    { id: 40, authors: 'European Parliament and Council', year: '2019/current', accessedAt: '2026-08-30', title: 'Regulation (EU) 2019/2033 on the Prudential Requirements of Investment Firms (IFR)', publication: 'EUR-Lex consolidated text as of 9 January 2024', url: 'https://eur-lex.europa.eu/eli/reg/2019/2033', use: '支持 own funds、K-factors、concentration 与 liquidity；适用依 firm class，部分大型 firms 受 CRR。' },
    { id: 41, authors: 'European Parliament and Council', year: '2019/current', accessedAt: '2026-08-30', title: 'Directive (EU) 2019/2034 on the Prudential Supervision of Investment Firms (IFD)', publication: 'EUR-Lex consolidated text as of 24 December 2024', url: 'https://eur-lex.europa.eu/eli/dir/2019/2034', use: '支持 supervision、internal capital/liquidity、governance 与 powers；须核对成员国转置。' },
    { id: 42, authors: 'European Parliament and Council', year: '2015/current', accessedAt: '2026-08-30', title: 'Regulation (EU) 2015/2365 on Transparency of Securities Financing Transactions and of Reuse (SFTR)', publication: 'EUR-Lex consolidated text as of 9 January 2024', url: 'https://eur-lex.europa.eu/eli/reg/2015/2365', use: '核对 SFT reporting 及 reuse 前 disclosure/consent；同意不等于无限制处分权。' },
    { id: 43, authors: 'European Parliament and Council', year: '2012/current', accessedAt: '2026-08-30', title: 'Regulation (EU) No 648/2012 on OTC Derivatives, Central Counterparties and Trade Repositories (EMIR)', publication: 'EUR-Lex consolidated text as of 17 January 2025', url: 'https://eur-lex.europa.eu/eli/reg/2012/648', use: '支持 clearing、CCP margin/default resources、segregation 与 portability；thresholds 和 technical standards 另查。' },
    { id: 44, authors: 'European Parliament and Council', year: '2014/current', accessedAt: '2026-08-30', title: 'Regulation (EU) No 909/2014 on Central Securities Depositories (CSDR)', publication: 'EUR-Lex consolidated text as of 17 January 2026', url: 'https://eur-lex.europa.eu/eli/reg/2014/909', use: '支持 settlement、CSD 和 fails framework；不能把 intended settlement date 与所有 broker deadlines 混同。' },
    { id: 45, authors: 'European Parliament and Council', year: '2014/current', accessedAt: '2026-08-30', title: 'Directive 2014/59/EU Establishing a Framework for Recovery and Resolution of Credit Institutions and Investment Firms (BRRD)', publication: 'EUR-Lex consolidated text as of 11 May 2026', url: 'https://eur-lex.europa.eu/eli/dir/2014/59/2026-05-11/eng', use: '支持 in-scope investment firms 的 recovery/resolution、transfer 与 safeguards；并非覆盖每一家 EU investment firm。' },
    { id: 46, authors: '全国人民代表大会常务委员会', year: '2019/2020', accessedAt: '2026-08-30', title: '中华人民共和国证券法', publication: '2019-12-28 第二次修订；2020-03-01 施行', url: 'https://www.npc.gov.cn/c2/c30834/201912/t20191231_304436.html', use: '核对证券公司主体、客户交易结算资金与证券分离等上位法边界；不能单独推出全部账户与破产流程。' },
    { id: 47, authors: '中华人民共和国国务院', year: '2008/2014/current', accessedAt: '2026-08-30', title: '证券公司监督管理条例', publication: '国务院令第 522 号；2014-07-29 修订；国家行政法规库现行文本', url: 'https://xzfg.moj.gov.cn/front/law/detail?LawID=213&Query=%E8%AF%81%E3%80%82', use: '支持现行业务许可、审慎经营、客户资产和第三方存管；草案与修法状态另引证监会材料。' },
    { id: 48, authors: '中国证券监督管理委员会', year: '2020/current', accessedAt: '2026-08-30', title: '证券公司风险控制指标管理办法', publication: '证监会令第 166 号，第三次修订', url: 'https://www.csrc.gov.cn/csrc/c106256/c1653957/content.shtml', use: '核对本地风险覆盖率、资本杠杆率、LCR 与 NSFR 等指标及公式；不是 Basel 或美国净资本。' },
    { id: 49, authors: '中国证券监督管理委员会', year: '2024/2025/current', accessedAt: '2026-08-30', title: '证券公司风险控制指标计算标准规定', publication: '证监会公告〔2024〕13 号；2025-01-01 施行', url: 'https://www.csrc.gov.cn/csrc/c101954/c7507765/content.shtml', use: '核对自营、做市、衍生品、REITs 等现行计算系数；不能沿用旧版表格。' },
    { id: 50, authors: '中国证券监督管理委员会', year: '2001/2021/current', accessedAt: '2026-08-30', title: '客户交易结算资金管理办法', publication: '证监会令第 3 号，依第 184 号令修订', url: 'https://www.csrc.gov.cn/csrc/c106256/c1653953/content.shtml', use: '支持客户资金全额存入指定商业银行、单独立户和定向划转监督；不是 Rule 15c3-3 reserve formula。' },
    { id: 51, authors: '中国证券监督管理委员会', year: '2015/current', accessedAt: '2026-08-30', title: '证券公司融资融券业务管理办法', publication: '证监会令第 117 号', url: 'https://www.csrc.gov.cn/csrc/c106256/c1654005/content.shtml', use: '支持融资融券、授信、担保物和客户账户；具体比例与时序需查交易所和中登现行规则。' },
    { id: 52, authors: '中国证券监督管理委员会', year: '2022/current', accessedAt: '2026-08-30', title: '证券登记结算管理办法', publication: '证监会令第 197 号；2022-06-20 施行', url: 'https://www.csrc.gov.cn/csrc/c101953/c2801304/content.shtml', use: '支持中央对手方、DVP、结算参与人和交收违约；不能推出所有市场统一 T+n。' },
    { id: 53, authors: '中华人民共和国国务院', year: '2008/current', accessedAt: '2026-08-30', title: '证券公司风险处置条例', publication: '国务院令第 523 号', url: 'https://www.gov.cn/zhengce/content/2008-04/24/content_2204.htm', use: '支持停业整顿、托管、接管、行政重组、撤销与清算；不能等同普通破产或美国 SIPA。' },
    { id: 54, authors: '中国证券监督管理委员会、财政部、中国人民银行', year: '2005/2016/current', accessedAt: '2026-08-30', title: '证券投资者保护基金管理办法', publication: '证监会令第 27 号；2016 年第 124 号令修订', url: 'https://www.csrc.gov.cn/csrc/c106256/c1654018/content.shtml', use: '支持保护基金用于证券公司风险防范和处置且投资风险原则上自担；不是固定账户额度的 SIPC 等价物。' },
    { id: 55, authors: 'Thomas S. Y. Ho and Hans R. Stoll', year: '1981', accessedAt: '2026-08-30', title: 'Optimal Dealer Pricing under Transactions and Return Uncertainty', publication: 'Journal of Financial Economics 9(1), 47–73', url: 'https://doi.org/10.1016/0304-405X(81)90020-9', use: '支持库存风险改变 reservation price 与 spread；不能直接校准现代电子 dealer。' },
    { id: 56, authors: 'Sanford J. Grossman and Merton H. Miller', year: '1988', accessedAt: '2026-08-30', title: 'Liquidity and Market Structure', publication: 'Journal of Finance 43(3), 617–633', url: 'https://doi.org/10.1111/j.1540-6261.1988.tb04594.x', use: '支持有限 immediacy suppliers 与客户流共同决定 liquidity premium。' },
    { id: 57, authors: 'Lawrence R. Glosten and Paul R. Milgrom', year: '1985', accessedAt: '2026-08-30', title: 'Bid, Ask and Transaction Prices in a Specialist Market with Heterogeneously Informed Traders', publication: 'Journal of Financial Economics 14(1), 71–100', url: 'https://doi.org/10.1016/0304-405X(85)90044-3', use: '支持 adverse-selection spread；不同时解释融资或资本约束。' },
    { id: 58, authors: 'Albert S. Kyle', year: '1985', accessedAt: '2026-08-30', title: 'Continuous Auctions and Insider Trading', publication: 'Econometrica 53(6), 1315–1335', url: 'https://doi.org/10.2307/1913210', use: '支持 order-flow informativeness、market depth 和 Kyle lambda；lambda 不是固定监管参数。' },
    { id: 59, authors: 'Ananth Madhavan and Seymour Smidt', year: '1993', accessedAt: '2026-08-30', title: 'An Analysis of Changes in Specialist Inventories and Quotations', publication: 'Journal of Finance 48(5), 1595–1628', url: 'https://doi.org/10.1111/j.1540-6261.1993.tb05122.x', use: '支持 inventory mean reversion 与 quote adjustment；历史 specialist 半衰期不能普遍外推。' },
    { id: 60, authors: 'Terrence Hendershott and Albert J. Menkveld', year: '2014', accessedAt: '2026-08-30', title: 'Price Pressures', publication: 'Journal of Financial Economics 114(3), 405–423', url: 'https://doi.org/10.1016/j.jfineco.2014.08.001', use: '支持 inventory imbalance 的 transitory price pressure；不是所有 impact 都反转。' },
    { id: 61, authors: 'Denis Gromb and Dimitri Vayanos', year: '2002', accessedAt: '2026-08-30', title: 'Equilibrium and Welfare in Markets with Financially Constrained Arbitrageurs', publication: 'Journal of Financial Economics 66(2–3), 361–407', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3', use: '支持资本约束、mispricing feedback 与 welfare ambiguity；不能推出放松监管必然改善福利。' },
    { id: 62, authors: 'Zhiguo He and Arvind Krishnamurthy', year: '2013', accessedAt: '2026-08-30', title: 'Intermediary Asset Pricing', publication: 'American Economic Review 103(2), 732–770', url: 'https://doi.org/10.1257/aer.103.2.732', use: '支持中介资本稀缺时 risk premia 非线性上升；校准模型不能识别单项法规因果。' },
    { id: 63, authors: 'Tobias Adrian, Erkko Etula and Tyler Muir', year: '2014', accessedAt: '2026-08-30', title: 'Financial Intermediaries and the Cross-Section of Asset Returns', publication: 'Journal of Finance 69(6), 2557–2596', url: 'https://doi.org/10.1111/jofi.12189', use: '支持 aggregate broker-dealer leverage factor 与资产回报的关系；不是单一实体的监管杠杆。' },
    { id: 64, authors: 'Zhiguo He, Bryan Kelly and Asaf Manela', year: '2017', accessedAt: '2026-08-30', title: 'Intermediary Asset Pricing: New Evidence from Many Asset Classes', publication: 'Journal of Financial Economics 126(1), 1–35', url: 'https://doi.org/10.1016/j.jfineco.2017.08.002', use: '支持 primary-dealer holding-company capital 与多资产风险价格；不能当 standalone net capital。' },
    { id: 65, authors: 'Markus K. Brunnermeier and Lasse Heje Pedersen', year: '2009', accessedAt: '2026-08-30', title: 'Market Liquidity and Funding Liquidity', publication: 'Review of Financial Studies 22(6), 2201–2238', url: 'https://doi.org/10.1093/rfs/hhn098', use: '支持 loss–margin–forced-sale–liquidity spiral；仅在融资约束和 margin sensitivity 等条件下成立。' },
    { id: 66, authors: 'Gary Gorton and Andrew Metrick', year: '2012', accessedAt: '2026-08-30', title: 'Securitized Banking and the Run on Repo', publication: 'Journal of Financial Economics 104(3), 425–451', url: 'https://doi.org/10.1016/j.jfineco.2011.03.016', use: '支持 private-collateral repo contraction；不能代表全部 Treasury、tri-party 或 bilateral repo。' },
    { id: 67, authors: 'Adam Copeland, Antoine Martin and Michael Walker', year: '2014', accessedAt: '2026-08-30', title: 'Repo Runs: Evidence from the Tri-Party Repo Market', publication: 'Journal of Finance 69(6), 2343–2380', url: 'https://doi.org/10.1111/jofi.12205', use: '提供除 Lehman 外未见简单广泛 tri-party run 的反例，限制“所有 repo 同时挤兑”叙事。' },
    { id: 68, authors: 'Arvind Krishnamurthy, Stefan Nagel and Dmitry Orlov', year: '2014', accessedAt: '2026-08-30', title: 'Sizing Up Repo', publication: 'Journal of Finance 69(6), 2381–2417', url: 'https://doi.org/10.1111/jofi.12168', use: '支持 private-collateral repo 的规模、集中度与数据缺口；bilateral segment 覆盖不全。' },
    { id: 69, authors: 'Sebastian Infante', year: '2019', accessedAt: '2026-08-30', title: 'Liquidity Windfalls: The Consequences of Repo Rehypothecation', publication: 'Journal of Financial Economics 133(1), 42–63', url: 'https://doi.org/10.1016/j.jfineco.2019.02.004', use: '支持 collateral reuse 同时降低融资成本并延长风险链；rehypothecation 不是无条件所有权。' },
    { id: 70, authors: 'Marco Macchiavelli and Alex Zhou', year: '2022', accessedAt: '2026-08-30', title: 'Funding Liquidity and Market Liquidity: The Broker-Dealer Perspective', publication: 'Management Science 68(5), 3379–3398', url: 'https://doi.org/10.1287/mnsc.2021.4053', use: '支持 dealer funding shock 与 corporate-bond liquidity；识别限于特定 reform 和 funding segment。' },
    { id: 71, authors: 'Darrell Duffie', year: '2010', accessedAt: '2026-08-30', title: 'The Failure Mechanics of Dealer Banks', publication: 'Journal of Economic Perspectives 24(1), 51–72', url: 'https://doi.org/10.1257/jep.24.1.51', use: '支持 prime-broker clients、repo、derivatives 与 settlement 在 failure 中的交互；不能代替当前成文法。' },
    { id: 72, authors: 'Tobias Adrian and Hyun Song Shin', year: '2010', accessedAt: '2026-08-30', title: 'Liquidity and Leverage', publication: 'Journal of Financial Intermediation 19(3), 418–437', url: 'https://doi.org/10.1016/j.jfi.2008.12.002', use: '支持 aggregate broker-dealer procyclical leverage；不是所有时期和实体的机械规律。' },
    { id: 73, authors: 'Tobias Adrian and Hyun Song Shin', year: '2014', accessedAt: '2026-08-30', title: 'Procyclical Leverage and Value-at-Risk', publication: 'Review of Financial Studies 27(2), 373–403', url: 'https://doi.org/10.1093/rfs/hht068', use: '支持 VaR limits 将波动变化转成扩表或减仓压力；依赖模型假设。' },
    { id: 74, authors: 'Tobias Adrian, Nina Boyarchenko and Or Shachar', year: '2017', accessedAt: '2026-08-30', title: 'Dealer Balance Sheets and Bond Liquidity Provision', publication: 'Journal of Monetary Economics 89, 92–109', url: 'https://doi.org/10.1016/j.jmoneco.2017.03.011', use: '支持 dealer type、balance-sheet conditions 与 bond liquidity 的异质性；不能单独归因某一法规。' },
    { id: 75, authors: 'Hendrik Bessembinder, Stacey E. Jacobsen, William F. Maxwell and Kumar Venkataraman', year: '2018', accessedAt: '2026-08-30', title: 'Capital Commitment and Illiquidity in Corporate Bonds', publication: 'Journal of Finance 73(4), 1615–1661', url: 'https://doi.org/10.1111/jofi.12694', use: '支持 dealer capital commitment、nonbank 部分替代和交易成本；不能推出 stress 时替代总是充分。' },
    { id: 76, authors: 'Jens Dick-Nielsen and Marco Rossi', year: '2019', accessedAt: '2026-08-30', title: 'The Cost of Immediacy for Corporate Bonds', publication: 'Review of Financial Studies 32(1), 1–41', url: 'https://doi.org/10.1093/rfs/hhy080', use: '支持 index-exclusion flow shock 附近的 immediacy cost；只适用于特定债券与事件。' },
    { id: 77, authors: 'Michael A. Goldstein and Edith S. Hotchkiss', year: '2020', accessedAt: '2026-08-30', title: 'Providing Liquidity in an Illiquid Market: Dealer Behavior in U.S. Corporate Bonds', publication: 'Journal of Financial Economics 135(1), 16–40', url: 'https://doi.org/10.1016/j.jfineco.2019.05.014', use: '支持 agency/search 与 principal inventory 的状态切换；TRACE classification 存在推断边界。' },
    { id: 78, authors: 'Jack Bao, Maureen O’Hara and Alex Zhou', year: '2018', accessedAt: '2026-08-30', title: 'The Volcker Rule and Corporate Bond Market Making in Times of Stress', publication: 'Journal of Financial Economics 130(1), 95–113', url: 'https://doi.org/10.1016/j.jfineco.2018.06.001', use: '支持 fallen-angel stress sample 中 liquidity provision 变化；不能推出总福利或全部市场效果。' },
    { id: 79, authors: 'Christopher S. Anderson, David C. McArthur and Ke Wang', year: '2023', accessedAt: '2026-08-30', title: 'Internal Risk Limits of Dealers and Corporate Bond Market Making', publication: 'Journal of Banking & Finance 147, 106653', url: 'https://doi.org/10.1016/j.jbankfin.2022.106653', use: '支持 desk limits 接近约束时 inventory growth 降低；样本限于大型 bank-affiliated dealer desks。' },
    { id: 80, authors: 'Mahyar Kargar, Benjamin Lester, David Lindsay, Shuo Liu, Pierre-Olivier Weill and Diego Zúñiga', year: '2021', accessedAt: '2026-08-30', title: 'Corporate Bond Liquidity during the COVID-19 Crisis', publication: 'Review of Financial Studies 34(11), 5352–5401', url: 'https://doi.org/10.1093/rfs/hhab063', use: '支持 2020 年 3 月 risky-principal capacity、agency shift 与交易成本；异常事件不能机械外推常态。' },
    { id: 81, authors: 'Maureen O’Hara and Alex Zhou', year: '2021', accessedAt: '2026-08-30', title: 'Anatomy of a Liquidity Crisis: Corporate Bonds in the COVID-19 Crisis', publication: 'Journal of Financial Economics 142(1), 46–68', url: 'https://doi.org/10.1016/j.jfineco.2021.05.052', use: '支持 dealer inventories、PDCF 与 liquidity recovery 时序；不能把恢复唯一归因某一政策。' },
    { id: 82, authors: 'Zhiguo He, Stefan Nagel and Zhaogang Song', year: '2022', accessedAt: '2026-08-30', title: 'Treasury Inconvenience Yields during the COVID-19 Crisis', publication: 'Journal of Financial Economics 143(1), 57–79', url: 'https://doi.org/10.1016/j.jfineco.2021.05.044', use: '支持 Treasury sell pressure、dealer absorption constraints 与 relative-value dislocations；投资者动机识别不完整。' },
    { id: 83, authors: 'Darrell Duffie, Michael Fleming, Frank Keane, Claire Nelson, Or Shachar and Peter Van Tassel', year: '2023', accessedAt: '2026-08-30', title: 'Dealer Capacity and U.S. Treasury Market Functionality', publication: 'BIS Working Papers No. 1138 / NY Fed Staff Report No. 1070', url: 'https://www.bis.org/publ/work1138.htm', use: '支持高 balance-sheet utilization 时 dealer capacity 对 Treasury functionality 的额外影响；utilization 仍有内生性。' },
    { id: 84, authors: 'Mathias S. Kruttli, Phillip J. Monin, Lubomir Petrasek and Sumudu W. Watugala', year: '2025', accessedAt: '2026-08-30', title: 'LTCM Redux? Hedge Fund Treasury Trading, Funding Fragility, and Risk Constraints', publication: 'Journal of Financial Economics 169, 104017', url: 'https://doi.org/10.1016/j.jfineco.2025.104017', use: '支持 repo credit 相对稳定时内部 VaR 与 precautionary liquidity 仍可迫使 Treasury arbitrage funds 减仓。' },
    { id: 85, authors: 'Mathias S. Kruttli, Phillip J. Monin and Sumudu W. Watugala', year: '2022', accessedAt: '2026-08-30', title: 'The Life of the Counterparty: Shock Propagation in Hedge Fund–Prime Broker Credit Networks', publication: 'Journal of Financial Economics 146(3), 965–988', url: 'https://doi.org/10.1016/j.jfineco.2022.02.002', use: '支持 prime-broker credit-supply shock、rehypothecable collateral 与 imperfect funding substitution；不是 Archegos 研究。' },
    { id: 86, authors: 'Jaewon Choi, Yesol Huh and Sean Seunghun Shin', year: '2024', accessedAt: '2026-08-30', title: 'Customer Liquidity Provision: Implications for Corporate Bond Transaction Costs', publication: 'Management Science 70(1), 187–206', url: 'https://doi.org/10.1287/mnsc.2022.4646', use: '支持客户反向流量可以替代 dealer inventory；样本限于美国 corporate bonds。' },
    { id: 87, authors: 'Darrell Duffie and Haoxiang Zhu', year: '2011', accessedAt: '2026-08-30', title: 'Does a Central Clearing Counterparty Reduce Counterparty Risk?', publication: 'Review of Asset Pricing Studies 1(1), 74–95', url: 'https://doi.org/10.1093/rapstu/rar001', use: '支持 CCP multilateral netting 与 cross-asset bilateral netting 的 trade-off；模型未包含 CCP 全部其他收益与风险。' },
    { id: 88, authors: 'Paul Glasserman and Qi Wu', year: '2018', accessedAt: '2026-08-30', title: 'Persistence and Procyclicality in Margin Requirements', publication: 'Management Science 64(12), 5705–5724', url: 'https://doi.org/10.1287/mnsc.2017.2915', use: '支持稳定 margin 与风险敏感 margin 的 protection/procyclicality 权衡；不是特定 CCP 实际模型。' },
    { id: 89, authors: 'Albert J. Menkveld', year: '2017', accessedAt: '2026-08-30', title: 'Crowded Positions: An Overlooked Systemic Risk for Central Clearing Parties', publication: 'Review of Asset Pricing Studies 7(2), 209–242', url: 'https://doi.org/10.1093/rapstu/rax016', use: '支持 CCP participant crowding 与 default-fund tail risk；量化结果来自特定 CCP 与样本。' },
    { id: 90, authors: '中国证券监督管理委员会', year: '2023', accessedAt: '2026-08-30', title: '关于就《证券公司监督管理条例（修订草案征求意见稿）》公开征求意见的通知', publication: '中国证监会公开征求意见材料，2023-03-31', url: 'https://www.csrc.gov.cn/csrc/c101981/c7399297/content.shtml', use: '确认 2023 年文本属于修订草案征求意见材料，不能当作现行行政法规。' },
    { id: 91, authors: '中国证券监督管理委员会', year: '2026', accessedAt: '2026-08-30', title: '中国证监会印发2026年度立法工作计划', publication: '中国证监会，2026-04-10', url: 'https://www.csrc.gov.cn/csrc/c100028/c7625742/content.shtml', use: '确认 2026 年计划仍将配合国务院有关部门推进《证券公司监督管理条例》修订，支持区分现行文本与修订进程。' },
    { id: 92, authors: 'FINRA', year: '2026', accessedAt: '2026-08-30', title: 'Understanding the New Intraday Margin Requirements', publication: 'FINRA investor guidance, 20 April 2026', url: 'https://syndication.finra.org/content/understanding-new-intraday-margin-requirements', use: '支持新 intraday-margin framework 于 2026-06-04 生效、会员可过渡至 2027-10-20，以及过渡期内不同券商可能采用不同制度。' },
    { id: 93, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'Order Under Section 36 of the Securities Exchange Act of 1934 Granting Conditional Exemptive Relief from Section 15(c)(3) of and Rule 15c3-3 under the Exchange Act for Cross-Margining of Cleared U.S. Treasury Securities and Related Futures', publication: 'Release No. 34-105248; 15 April 2026', url: 'https://www.sec.gov/files/rules/exorders/2026/34-105248.pdf', use: '固定 cross-margining 条件性豁免的 final-order 状态与准确范围；不是一般性的 Treasury clearing 豁免。' },
    { id: 94, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'Order Granting Conditional Exemptive Relief, Pursuant to Sections 17A and 36(a) of the Securities Exchange Act of 1934, from the Definition of an “Eligible Secondary Market Transaction” in Rule 17Ad-22(a)', publication: 'Release No. 34-105736; 18 June 2026', url: 'https://www.sec.gov/files/rules/other/2026/34-105736.pdf', use: '固定特定 captive-clearing-subsidiary/private-fund 结构的条件性豁免 final-order 状态；不得泛化为所有主体或交易。' },
    { id: 95, authors: 'U.S. Securities and Exchange Commission', year: '2026', accessedAt: '2026-08-30', title: 'Notice of an Application of the Securities Industry and Financial Markets Association for an Exemption Pursuant to Section 36 of the Securities Exchange Act of 1934 from Certain Conditions of Note H to Exchange Act Rule 15c3-3a', publication: 'Release No. 34-105980; 24 July 2026; File No. S7-2026-26', url: 'https://www.sec.gov/files/rules/exorders/2026/34-105980.pdf', use: '固定 Note H/net-omnibus 事项截至本课截点仍为申请通知与征求意见，而不是已经生效的最终豁免。' },
  ],
  readingList: [
    { title: '17 CFR § 240.15c3-1 · Net Capital', scope: '主文、定义、最低要求、扣减与适用 appendices', reason: '把会计权益、tentative net capital、监管扣减和最低要求拆成可审计计算链。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-1' },
    { title: '17 CFR § 240.15c3-3 · Customer Protection', scope: 'possession/control、reserve account 与客户 securities 条款', reason: '理解客户现金、客户证券与 firm capital 为什么是三条不同保护线。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.15c3-3' },
    { title: 'FINRA Rule 4210 · Margin Requirements', scope: 'maintenance、portfolio、house discretion 与当前过渡说明', reason: '建立客户 margin 的主体、基数、时钟与 firm override。', url: 'https://www.finra.org/rules-guidance/rulebooks/finra-rules/4210' },
    { title: 'SEC (2023) · Shortening the Settlement Cycle', scope: 'Rule 15c6-1、15c6-2、排除产品与 operational analysis', reason: '理解成交承诺、allocation/affirmation 和最终交收为何属于不同时间层。', url: 'https://www.sec.gov/files/rules/final/2023/34-96930.pdf' },
    { title: 'SEC (2023) · U.S. Treasury Clearing Final Rule', scope: 'eligible transactions、participant submission、margin separation 与 15c3-3 Note H', reason: '连接 dealer、clearing member、CCP 和客户财产。', url: 'https://www.sec.gov/files/rules/final/2023/34-99149.pdf' },
    { title: '17 CFR § 240.17Ad-22 · Clearing Standards', scope: 'credit/liquidity、margin、default resources、operations 与 finality', reason: '从法律规则理解 CCP 不只是净额器，也是现金与损失分配节点。', url: 'https://www.ecfr.gov/current/title-17/chapter-II/part-240/section-240.17ad-22' },
    { title: 'Securities Investor Protection Act', scope: 'customer、net equity、customer property、trustee 与 advances', reason: '用原始法源纠正“券商账户等同银行存款保险”的误读。', url: 'https://www.govinfo.gov/app/details/COMPS-1886/' },
    { title: 'IOSCO (2017) · Objectives and Principles of Securities Regulation', scope: '中介准入、资本、客户资产与 failure principles', reason: '获得跨法域比较语言，同时保持“国际原则不是国内法”的边界。', url: 'https://www.iosco.org/library/pubdocs/pdf/IOSCOPD561.pdf' },
    { title: 'EU IFR · Regulation (EU) 2019/2033', scope: 'own funds、K-factors、concentration、liquidity 与 firm classes', reason: '理解欧盟 investment-firm prudential regime 不能翻译成美国净资本或 Basel 银行指标。', url: 'https://eur-lex.europa.eu/eli/reg/2019/2033' },
    { title: '证监会（2024）· 证券公司风险控制指标计算标准规定', scope: '自营、做市、衍生品与现行计算表', reason: '建立中国证券公司本地指标与业务系数，不沿用旧版或外域公式。', url: 'https://www.csrc.gov.cn/csrc/c101954/c7507765/content.shtml' },
    { title: 'Ho & Stoll (1981)', scope: 'dealer objective、inventory risk、reservation prices 与 spread', reason: '建立库存为何进入报价的经典动态机制。', url: 'https://doi.org/10.1016/0304-405X(81)90020-9' },
    { title: 'Grossman & Miller (1988)', scope: 'immediacy suppliers、客户流与 liquidity premium', reason: '理解 dealer 如何在自然买卖者不同步时桥接时间。', url: 'https://doi.org/10.1111/j.1540-6261.1988.tb04594.x' },
    { title: 'Glosten & Milgrom (1985)', scope: 'informed/uninformed traders 与 adverse-selection spread', reason: '把信息风险与库存/资本成本从 spread 中概念分离。', url: 'https://doi.org/10.1016/0304-405X(85)90044-3' },
    { title: 'Hendershott & Menkveld (2014)', scope: 'inventory imbalance、price pressure 与 reversion', reason: '把库存吸收转化为可检验的价格路径，同时保留永久信息成分。', url: 'https://doi.org/10.1016/j.jfineco.2014.08.001' },
    { title: 'Gromb & Vayanos (2002)', scope: 'capital constraints、arbitrage、equilibrium 与 welfare', reason: '理解有限中介资本为何改变价格且政策福利方向并非单调。', url: 'https://doi.org/10.1016/S0304-405X(02)00228-3' },
    { title: 'He & Krishnamurthy (2013)', scope: 'intermediary capital、risk premia 与非线性状态', reason: '把 dealer headroom 连接到资产定价，而不把模型因子误当法规指标。', url: 'https://doi.org/10.1257/aer.103.2.732' },
    { title: 'Brunnermeier & Pedersen (2009)', scope: 'market liquidity、funding liquidity、margin 与 spirals', reason: '建立正反馈的必要箭头和状态条件。', url: 'https://doi.org/10.1093/rfs/hhn098' },
    { title: 'Gorton & Metrick (2012)', scope: 'private-collateral repo contraction 与 securitized banking', reason: '理解 repo run 机制，同时避免把结论泛化到全部 repo segments。', url: 'https://doi.org/10.1016/j.jfineco.2011.03.016' },
    { title: 'Copeland, Martin & Walker (2014)', scope: 'tri-party repo 数据、dealer 与 cash-investor responses', reason: '用反例修正“所有 repo 市场发生同一种 run”的叙事。', url: 'https://doi.org/10.1111/jofi.12205' },
    { title: 'Krishnamurthy, Nagel & Orlov (2014)', scope: 'repo market size、segments 与 data limits', reason: '给融资链建立数量级与覆盖边界。', url: 'https://doi.org/10.1111/jofi.12168' },
    { title: 'Infante (2019)', scope: 'repo rehypothecation、融资节约与风险链', reason: '理解 collateral reuse 的正常期效率和压力期依赖。', url: 'https://doi.org/10.1016/j.jfineco.2019.02.004' },
    { title: 'Macchiavelli & Zhou (2022)', scope: 'dealer funding shock、corporate-bond positions 与 liquidity', reason: '学习如何用具体融资改革识别 dealer balance-sheet channel。', url: 'https://doi.org/10.1287/mnsc.2021.4053' },
    { title: 'Duffie (2010) · Failure Mechanics of Dealer Banks', scope: 'repo、derivatives、PB clients、settlement 与 failure sequence', reason: '把静态资本不足扩展成违约时的合同和操作动态。', url: 'https://doi.org/10.1257/jep.24.1.51' },
    { title: 'Adrian & Shin (2014)', scope: 'VaR constraints、procyclical leverage 与模型假设', reason: '理解波动率如何内生改变风险容量，同时保留聚合到个体的边界。', url: 'https://doi.org/10.1093/rfs/hht068' },
    { title: 'Adrian, Boyarchenko & Shachar (2017)', scope: 'dealer balance sheets、bond liquidity 与 dealer heterogeneity', reason: '把“dealer sector”拆成状态和类型不同的实际中介。', url: 'https://doi.org/10.1016/j.jmoneco.2017.03.011' },
    { title: 'Anderson, McArthur & Wang (2023)', scope: 'desk-level internal risk limits 与 market making', reason: '看到法定资本之前，内部限额怎样成为真实交易边界。', url: 'https://doi.org/10.1016/j.jbankfin.2022.106653' },
    { title: 'Duffie et al. (2023) · Dealer Capacity and Treasury Market Functionality', scope: 'balance-sheet utilization、Treasury depth 与状态异质性', reason: '建立 Treasury dealer capacity 的现代实证基准。', url: 'https://www.bis.org/publ/work1138.htm' },
    { title: 'Kruttli, Monin & Watugala (2022)', scope: 'prime-broker credit networks、collateral 与 funding substitution', reason: '理解客户冲击如何沿 PB 关系传播，以及替代为何不完整。', url: 'https://doi.org/10.1016/j.jfineco.2022.02.002' },
    { title: 'Choi, Huh & Shin (2024)', scope: 'customer liquidity provision 与 corporate-bond transaction costs', reason: '保留客户反向流量可以替代 dealer inventory 的重要反例。', url: 'https://doi.org/10.1287/mnsc.2022.4646' },
    { title: 'Duffie & Zhu (2011)', scope: 'bilateral versus multilateral netting trade-off', reason: '理解 CCP 可以降低某些暴露却不必机械降低所有净额风险。', url: 'https://doi.org/10.1093/rapstu/rar001' },
  ],
};
