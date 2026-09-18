import PensionInsuranceLab from '../components/PensionInsuranceLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={'#ref-' + n} aria-label={'参考文献 ' + n}>[{n}]</a>;
}

function Lesson205Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>养老金与保险资本的本质不是“钱很长”，而是今天持有资产、未来必须兑现承诺；长期负债因此既能支持耐心持有，也能制造今天必须筹到的现金。</h2>
        <p>
          市场评论常把养老基金与保险公司合称“长期资金”，仿佛期限足够长就自然低换手、逆周期并偏爱股票或长债。这个标签只抓住了承诺终点，却删除了决定订单的中间系统：谁对谁承诺什么，现金流是否依赖工资、寿命、事故或退保，负债用哪套曲线计量，资产和负债对利率各有多敏感，资金缺口由谁补，资本比率离阈值多远，衍生品抵押品何时到期，以及谁真正有权把战略配置变成交易。负债必须进入投资目标函数，是资产负债管理的经典起点；但由此不能推出某一种组合对所有制度都最优。<Cite n={2} />
        </p>
        <p>
          最有解释力的反例发生在 2022 年英国国债市场。长期收益率急升降低了许多 DB 养老金负债的现值，整体经济资金状况可能改善；同一冲击却让收固定、付浮动的利率互换（receive-fixed swap）立即亏损并触发抵押品追缴。缓冲不足的杠杆负债驱动投资（liability-driven investment，LDI）组合被迫卖出长期国债，价格下跌又制造更多追缴，长期偿付改善与短期流动性危机同时成立。官方复盘、交易级研究与后续监管指引共同表明：这不是“养老金整体资不抵债”，而是多年期风险被交易结构转换成了数小时或数日的现金约束。<Cite n={11} /><Cite n={12} /><Cite n={13} /><Cite n={14} />
        </p>
        <p>
          本节因此始终追问同一问题：<b>法律或合同承诺怎样生成状态依赖的负债现金流，负债又怎样经折现、久期、funded ratio 或偿付能力、流动性与治理约束，转化为战略配置、对冲、抵押品和母订单；成交后的价格变化又怎样回写资产负债表，令同一机构在下一轮成为稳定买方或强迫卖方？</b> DB、DC 与保险会沿同一诊断语言展开，但绝不会被压成同一个“长期投资者需求函数”。
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>完整链条从承诺开始，以新的资产负债表结束；资产偏好只是链中的一个中间结果。</h2>
        <div className="mechanism-chain" aria-label="养老金与保险资本从承诺到市场反馈的八步因果链">
          <div><span>01</span><b>冻结承诺</b><p>计划文件或保单规定金额、状态、受益人和支付时点。</p></div>
          <div><span>02</span><b>生成现金流</b><p>工资、工龄、死亡、长寿、事故、退保与费用形成概率分布。</p></div>
          <div><span>03</span><b>选择计量</b><p>经济、会计、融资或监管曲线把未来支付映射为今日负债。</p></div>
          <div><span>04</span><b>读取状态</b><p>资金充足率、计划盈余（surplus）、合格自有资金（own funds）、资本要求与现金缓冲更新。</p></div>
          <div><span>05</span><b>设定目标</b><p>治理层在承诺、回报需要、风险承担力和法定边界内配置。</p></div>
          <div><span>06</span><b>修复缺口</b><p>缴费、现货、衍生品、再保险、抵押品与资本动作共同调整。</p></div>
          <div><span>07</span><b>执行订单</b><p>交易台按期限、流动性、保证金和市场冲击拆分母订单。</p></div>
          <div><span>08</span><b>反馈重估</b><p>价格、收益率、利差与行为改变资产、负债和下一轮约束。</p></div>
        </div>
        <p>
          这条链解释了为什么“养老金买长债”和“保险配置信用”都不是原始偏好。长债可能用来降低 DB 负债久期缺口，也可能只是抵押品储备；信用资产可能补足保证成本，也可能因为资本收费、评级悬崖或退保风险而被卖出。荷兰负债曲线改革改变了机构不同期限的套保需求并影响长端收益率，说明计量规则可以沿“负债敏感度 → 目标敞口 → 交易 → 价格”进入市场；但这项准实验的法域结论不能直接外推成全球固定规律。<Cite n={7} />
        </p>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围与先修</p>
        <h2>本节建立从承诺到订单的共同语言；具体养老金法、保险产品定价和一般风险限额只讲到接口。</h2>
        <p>
          硬先修是 T02 的折现、T06 的资产负债表与 2.01 的“状态—目标—约束—订单”语言。建议按需回看 1.09 的价格冲击、1.20 的保证金与强制平仓、2.03 的资产所有者和受托管理人、2.04 的规则型资金，以及 T07 的债券与衍生品最小基础。若这些接口没有分开，最常见的错误就是把 sponsor、trustee 与 asset manager 写成同一个“基金”，把三十年负债误读为三十年稳定现金，或把监管上限上调直接翻译成当天买单。
        </p>
        <div className="learning-objectives">
          <span>七阶段学习路线 · 从权利义务到可证伪订单</span>
          <ol>
            <li><b>承诺、主体与三套账（03–08）：</b>分开 DB、DC、保险以及法律、经济、会计与监管口径。</li>
            <li><b>负债数学桥（09–14）：</b>从状态现金流进入现值、久期、DV01 与模型边界。</li>
            <li><b>DB Pension（15–25）：</b>把 funded ratio、LDI、对冲率和抵押品瀑布连成订单。</li>
            <li><b>DC Pension（26–29）：</b>识别风险承担者迁移后，默认配置、缴费与提款怎样形成流量。</li>
            <li><b>Insurance Capital（30–41）：</b>从保单选择权、own funds 和风险资本进入 ALM 与再平衡。</li>
            <li><b>订单与反馈（42–48）：</b>统一母订单、单位、时钟、稳定与放大状态，并建立研究协议。</li>
            <li><b>实验与接口（49–52）：</b>用八题实验、六道练习和十问检查把机制压缩成可操作判断。</li>
          </ol>
          <p><b>时间预算：</b>首次核心阅读约 95–115 分钟；互动实验快速 20–25 分钟，含完整复盘约 35–45 分钟；主动练习核对 15–20 分钟，完整书写 30–40 分钟；理解检查快速 8–10 分钟，完整复述 15–20 分钟；接口另需 3–4 分钟。建议分两次完成，参考文献与延伸阅读不计。</p>
          <p><b>零基础术语桥：</b>DB 是按公式承诺给付，DC 是按规则承诺缴费与账户机制；funded 说明是否已有专门资产，underfunded 说明已有资产低于计量负债；sponsor 是计划发起人，sponsor covenant 是计划对发起人持续补缴与支持能力的评估，不是一张独立资产；trustee / governing body 负责治理，asset manager 执行授权；surplus 是计划资产减计量负债，own funds 是保险监管口径认可的可吸收损失资源；LDI 是围绕负债风险组织资产与对冲的框架，ALM（asset–liability management）是联合管理资产、负债和现金流；1 bp（基点）等于 0.01 个百分点；DV01 是收益率变化 1 bp 时现值变化的货币量；collateral 是为覆盖交易对手风险而交付的合格资产，haircut 是计算可认可价值时的折扣，VM（variation margin）是随市场价值变化追加或收回的变动保证金；lapse / surrender 是保单失效或退保，不是开放式基金赎回。</p>
        </div>
      </section>

      <section className="lesson-section" id="promise-first">
        <p className="section-kicker">阶段一 · 承诺、主体与三套账　|　03 · 承诺优先</p>
        <h2>先冻结“谁在什么状态下应向谁支付什么”，再看资产；持仓不能反推出法律义务。</h2>
        <p>
          同样持有一篮子三十年国债，可能是 DB 计划在对冲退休给付、寿险一般账户在兑现保证年金、DC 默认基金在执行生命周期规则，也可能只是管理人的相对价值仓位。资产名称相同，风险承担者、失败后果与触发订单的状态完全不同。分析必须先读计划文件、保单、法规与授权，记录支付对象、金额公式、触发状态、币种、指数化、终止条款和保障机制；只有这一步冻结后，资产组合才有经济含义。
        </p>
        <p>
          美国劳工部的基础定义将 DB 的给付公式与 DC 的个人账户结果明确分开；NAIC 对养老金风险转移的说明又显示，养老金计划可以通过 buy-in 或 buy-out 把部分给付责任连接到保险合同。它们适合建立分类语言，却不是全球统一法律定义。遇到中国职业年金、欧盟职业养老金或英国 buy-out，必须回到当地文件，不能只凭英文产品名称归类。<Cite n={1} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="pension-insurance-boundary">
        <p className="section-kicker">04 · 养老金与保险边界</p>
        <h2>养老金通常源自雇佣或公共制度中的退休安排，保险源自保单中的风险转移；年金可以连接二者，却不会抹掉主体边界。</h2>
        <p>
          养老金权利可以来自社会保险、雇主职业计划或个人退休账户，核心问题是退休收入怎样积累、由谁保证以及资产是否专门化。保险合同则由投保人支付保费，把死亡、长寿、事故、疾病、财产损失或市场保证等风险转给保险人。养老金计划购买年金后，原计划、受益人与保险人的关系会依 buy-in、buy-out 和法域变化；“买了保险”不自动意味着 sponsor、受托责任或成员保障全部消失。
        </p>
        <p>
          因此不能用“养老金比保险更长期”区分二者。财产责任险可能有多年长尾赔款，DC 账户却可能因退休提款形成近端现金流；寿险一般账户承担资产兑现风险，unit-linked / separate account 则可能把大部分投资结果传给保单持有人。决定投资行为的不是机构名称，而是承诺现金流、选择权、资本与法律隔离的具体组合。NAIC 对 separate accounts 与 pension risk transfer 的制度说明正适合显示这些边界，但破产隔离和保证责任仍须逐州、逐合同核对。<Cite n={46} /><Cite n={58} />
        </p>
      </section>

      <section className="lesson-section" id="db-dc-boundary">
        <p className="section-kicker">05 · DB、DC 与融资方式</p>
        <h2>DB/DC 回答“谁承担结果风险”，funded/unfunded 回答“承诺背后是否积累专门资产”；两条轴必须交叉分类。</h2>
        <div className="table-scroll" role="region" aria-label="DB DC 与 funded unfunded 两条分类轴，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">养老金承诺类型与融资方式的二维边界</caption>
            <thead><tr><th scope="col">轴</th><th scope="col">它回答什么</th><th scope="col">典型但非唯一情形</th><th scope="col">不能据此推出</th></tr></thead>
            <tbody>
              <tr><th scope="row">DB ↔ DC</th><td>最终待遇公式由计划承担，还是账户结果主要由成员承担</td><td>DB 按工资/工龄给付；纯 DC 按缴费与投资结果积累</td><td>是否已有足额资产、谁具体下单</td></tr>
              <tr><th scope="row">Funded ↔ unfunded</th><td>是否存在为支付积累并通常隔离的资产池</td><td>有基金计划；现收现付、账面储备或名义账户</td><td>一定是 DB 或 DC，也不能把 underfunded 当作无资产</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中国职业年金提供了有用反例：个人缴费通常实账积累，财政全额供款单位的单位缴费可先记账，并在工作人员退休前由同级财政做实。它说明“DC 外观＝每一笔当下都已成为可交易资产”并不成立。反过来，一个 funded DB 即使资产低于负债，仍有独立资产池和真实持仓；把它叫 unfunded 会删除资金充足率和再平衡机制。<Cite n={61} />
        </p>
      </section>

      <section className="lesson-section" id="actor-ledgers">
        <p className="section-kicker">06 · 主体与账本</p>
        <h2>承担缺口、负有治理义务、保管资产和点击买卖按钮，通常属于不同主体。</h2>
        <div className="table-scroll" role="region" aria-label="养老金与保险资本主体地图，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">计划发起人、治理机构、管理人、托管人、成员与保险人的分工</caption>
            <thead><tr><th scope="col">主体</th><th scope="col">核心账本或义务</th><th scope="col">怎样进入订单</th></tr></thead>
            <tbody>
              <tr><th scope="row">Sponsor / 发起人</th><td>设立计划并承担约定融资/缴费义务；其经营与信用构成计划面对的 covenant risk</td><td>改变补缴能力、去风险速度与可承受波动</td></tr>
              <tr><th scope="row">Trustee / governing body</th><td>为成员利益治理计划并委任服务者</td><td>批准融资、投资、流动性和衍生品授权</td></tr>
              <tr><th scope="row">Asset manager / 交易台</th><td>在 mandate 内构造和执行组合</td><td>把目标缺口变成证券、掉期、期货与抵押品订单</td></tr>
              <tr><th scope="row">Custodian / 托管人</th><td>保管资产、处理交易结算与托管记录</td><td>影响可用现金、抵押品和结算时钟，不决定投资目标</td></tr>
              <tr><th scope="row">Administrator / 账户与估值服务</th><td>成员账户、估值、记录、报告与运营管理</td><td>影响数据和现金确认，不等于资产保管或组合决策</td></tr>
              <tr><th scope="row">Member / beneficiary</th><td>拥有账户或给付请求权</td><td>缴费、转换、退休领取或保单选择改变现金流</td></tr>
              <tr><th scope="row">Insurer</th><td>对保单持有人承担合同负债并提供自有资本</td><td>ALM、风险资本、产品与再保险共同形成资产预算</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中国企业年金规则明确分开委托人、受托人、账户管理人、托管人和投资管理人；欧盟 IORP II 强调 sponsor 与职业养老金机构的法律分离。同一服务商在具体安排中可以兼任多项角色，但授权、责任和账本仍须分别记录。制度名称会变，研究协议不变：对每一笔目标或订单，分别记录谁承担终局损失、谁有法定义务、谁设定授权、谁拥有账户、谁负责结算以及谁实际下单。把它们合成“养老金买入”，会把 covenant、治理和执行三条因果链揉成无法检验的叙事。<Cite n={43} /><Cite n={60} />
        </p>
      </section>

      <section className="lesson-section" id="valuation-lenses">
        <p className="section-kicker">07 · 三套以上的负债账</p>
        <h2>同一法律承诺可以有经济、会计、融资与监管现值；它们服务不同决策，不构成“谁更真实”的简单排名。</h2>
        <div className="equation-card">
          <span>同一承诺，不同计量映射</span>
          <div>L<sup>economic</sup> ≠ L<sup>accounting</sup> ≠ L<sup>funding</sup> ≠ L<sup>regulatory</sup></div>
          <p>不等号表示曲线、概率、风险边际、平滑和目的可能不同，不表示数值必然按某一方向排序。法律支付权利可以不变，而四种计量随规则与市场状态以不同速度变化。</p>
        </div>
        <p>
          经济口径通常用来回答“怎样对冲未来现金流的市场敏感度”；会计口径回答“报表日确认多少资产、负债和费用”；养老金 funding 口径回答 sponsor 何时需要补足多少；保险监管口径回答可吸收损失资本相对风险要求是否足够。IAS 19 对员工福利折现、IFRS 17 对保险现金流折现、Solvency II 的技术准备金以及中国 C-ROSS II 的监管负债都有各自目的和构造。管理人不能为了让缺口好看任意改曲线，研究者也不能把其中一条叫作无条件“真实负债”。<Cite n={41} /><Cite n={42} /><Cite n={44} /><Cite n={53} />
        </p>
      </section>

      <section className="lesson-section" id="horizon-clocks">
        <p className="section-kicker">08 · 六只时钟</p>
        <h2>负债到期很远，只说明一只时钟很慢；估值、追缴、结算和提款时钟仍可在今天到点。</h2>
        <div className="table-scroll" role="region" aria-label="长期机构六类时间尺度，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">负债、战略、估值、再平衡、抵押品与结算时钟</caption>
            <thead><tr><th scope="col">时钟</th><th scope="col">典型问题</th><th scope="col">若混淆会发生什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">负债期限</th><td>待遇、赔款或年金何时预计支付</td><td>把三十年终点误写成三十年无需现金</td></tr>
              <tr><th scope="row">战略决策</th><td>董事会或受托人何时重设长期目标</td><td>把季度治理决定当成即时订单</td></tr>
              <tr><th scope="row">估值与资本</th><td>负债、own funds 和比率何时更新</td><td>漏掉日度市场变化或季度法定报告的错位</td></tr>
              <tr><th scope="row">再平衡</th><td>何时触发 corridor 或 glide path</td><td>把目标权重当成每天回到单点</td></tr>
              <tr><th scope="row">抵押品</th><td>变动保证金何时必须交付</td><td>把有资产误写成有可用现金</td></tr>
              <tr><th scope="row">交易与结算</th><td>资产何时能卖出、到账并转给对手方</td><td>用次日股票或私募资产覆盖今天追缴</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          英国 LDI 危机之所以反直觉，正是因为负债时钟与抵押品时钟发生分裂。对典型的 gilt-related leveraged LDI，TPR 在假设五个工作日内补充缓冲时，将 250 bp 作为 market stress buffer 的通常最低水平；补充更慢或资产更易波动时可能需要更高，基金构成的内在波动显著较低时则可论证采用更低水平。它不是全球所有养老金的统一杠杆上限，也不能脱离资产构成与治理速度解释。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="liability-cashflows">
        <p className="section-kicker">阶段二 · 负债数学桥　|　09 · 状态现金流</p>
        <h2>负债不是一个静态数字，而是在多个状态、金额和时点上的支付分布。</h2>
        <div className="equation-card">
          <span>第 t 期预期负债现金流</span>
          <div>E[CF<sub>t</sub>] = Σ<sub>s</sub> p<sub>s,t</sub> × B<sub>s,t</sub></div>
          <p>s 表示仍在职、退休、生存、死亡、事故、退保或其他互斥/条件状态；p 是题设模型下该状态的概率，B 是该状态发生时的支付金额。乘积相加得到第 t 期的概率加权现金流，单位仍是货币，不是现值。</p>
        </div>
        <p>
          DB 中，B 可能由工资、工龄、退休年龄和指数化规则决定，p 受离职、退休与生存概率影响；年金负债主要受生存与领取选择影响；财险还要建模事故发生、报案延迟和最终赔款。概率不是永恒常数：医疗进步会改变长寿，市场利率会改变退保，巨灾会同时改变赔款与资产价格。先把合同现金流和行为选择权写出来，才能理解为何保险负债久期会随市场内生变化。
        </p>
      </section>

      <section className="lesson-section" id="present-value">
        <p className="section-kicker">10 · 现值</p>
        <h2>承诺支付未变，计量负债仍会因时间价值和折现曲线变化；这不是“凭空多欠了钱”。</h2>
        <div className="equation-card">
          <span>简化负债现值</span>
          <div>L = Σ<sub>t</sub> E[CF<sub>t</sub>] / (1 + y<sub>t</sub>)<sup>t</sup></div>
          <p>y<sub>t</sub> 是与第 t 期、币种和计量目的相符的折现率。未来 10 年末支付 110，若教学折现率从 3% 降至 2%，现值由 81.85 上升至 90.24；法律上的 110 没变，今天为复制这笔未来支付所需的价值改变了。</p>
        </div>
        <p>
          低折现率令远期现金流现值上升得更明显，因此长久期负债对曲线变化更敏感。但不能从“负债现值上升”直接推出当期现金流出，也不能由会计负债上升直接推断经济对冲缺口同幅恶化。下一步必须同时重估资产、识别使用哪条曲线，并检查 sponsor 缴费、资本规则和现金缓冲是否真正触发动作。
        </p>
      </section>

      <section className="lesson-section" id="discount-curve">
        <p className="section-kicker">11 · 折现曲线的制度目的</p>
        <h2>折现率不是管理人想赚多少，也不是一条适用于所有账本的“市场利率”。</h2>
        <p>
          IAS 19 规定 DB 会计折现通常依据报表日高质量公司债收益率；相关货币不存在深厚市场时使用政府债，并要求币种与期限匹配。欧盟职业养老金技术准备金保留大量成员国规则空间；Solvency II 保险技术准备金从风险无关期限结构出发，并可在条件满足时加入 matching adjustment 或 volatility adjustment；IFRS 17 则要求折现率反映时间价值、合同现金流特征和流动性，排除与合同无关的资产风险。四种规定回答不同问题，不能复制粘贴。<Cite n={41} /><Cite n={42} /><Cite n={43} /><Cite n={44} />
        </p>
        <p>
          中国同样必须分账：C-ROSS II 的监管负债曲线与企业会计准则第 25 号（CAS 25）的保险会计折现不是同一口径。对于不随基础项目回报而变动的保险合同现金流量，CAS 25 实施问答允许企业采用自下而上或自上而下的方法确定相应折现率；这里的“基础项目”是保单给付所挂钩的指定资产、资产池或参考项目。选用自下而上法时，可以考虑从当前风险无关收益率曲线出发，加入反映合同现金流流动性、税收等特征的溢价，并排除与合同现金流无关的逆周期调整。对于随基础项目回报而变动的现金流量，应使折现率与现金流量所反映的回报变动性保持一致，不能直接套用上述构造。直白地说，现金流随哪类回报变化，折现率就要反映同类变化。财政部 2026 年问答还专门规范两种方法之间的变更；对尚未执行新准则的其他企业，2025 年通知原则上规定自 2026 年 1 月 1 日起执行，同时保留符合条件的暂缓边界。最危险的研究捷径仍是用组合预期收益率任意替代负债曲线：提高风险资产预期回报便能机械降低缺口，实际上把承担更多资产风险误装成负债变少。<Cite n={53} /><Cite n={57} /><Cite n={65} /><Cite n={66} /><Cite n={67} />
        </p>
      </section>

      <section className="lesson-section" id="modified-duration">
        <p className="section-kicker">12 · 修正久期</p>
        <h2>久期首先是现值对收益率的小幅一阶敏感度，不是“平均多久拿回本金”的万能期限标签。</h2>
        <div className="equation-card">
          <span>平行、小幅收益率变化的一阶近似</span>
          <div>ΔL / L ≈ −D<sub>L</sub> × Δy</div>
          <p>D<sub>L</sub> 为修正久期，单位近似为“年”；Δy 必须用小数，例如 +50 bp 写成 +0.005。若负债现值 100、久期 12，收益率上升 50 bp，则一阶近似 ΔL≈−6；负号表示收益率与固定现金流现值反向变化。</p>
        </div>
        <p>
          同一公式也可用于固定收益资产，但必须使用与该资产相关的曲线和敏感度。名义国债、信用债、通胀债、掉期与负债可能受不同曲线、利差和基差推动；把它们都塞进一个 y，会隐含完全共同移动的强假设。久期是一座有用的桥，不是完整 ALM 模型。
        </p>
      </section>

      <section className="lesson-section" id="dv01">
        <p className="section-kicker">13 · DV01 与货币久期</p>
        <h2>比较资产与负债对冲能力，要先把百分比敏感度乘以各自规模；两个久期数字不能直接抵消。</h2>
        <div className="equation-card">
          <span>每 1 bp 的近似货币变化</span>
          <div>DV01 = Present Value × Modified Duration × 10<sup>−4</sup></div>
          <p>若负债现值 100 百万元、久期 12，DV01 约为 0.12 百万元/bp；资产 60 百万元、久期 5，DV01 约为 0.03 百万元/bp。虽然两边都有“久期”，资产只覆盖负债敏感度的四分之一。</p>
        </div>
        <p>
          实务也常用 dollar duration 或 PV01；符号约定可能不同，研究前必须声明是“收益率上升 1 bp 的价值变化”还是其绝对额。掉期 notional 不是市值，不能与债券市值直接相加；应先把各头寸转换为同一曲线节点的 DV01，再讨论目标 hedge ratio。
        </p>
      </section>

      <section className="lesson-section" id="duration-boundaries">
        <p className="section-kicker">14 · 久期的边界</p>
        <h2>久期匹配只对局部利率变化有效，不等于现金流匹配，也不覆盖通胀、汇率、信用和选择权。</h2>
        <p>
          大幅利率变化需要凸性；曲线非平行移动需要 key-rate duration；工资或 CPI 指数化负债需要真实利率与通胀敏感度；海外资产需要汇率和套保展期；信用债还承受 spread 与违约；可退保保单和可提前退休计划会在利率变化后改变现金流本身。即使初始总 DV01 相同，各期限节点和状态暴露不同，盈余仍可能大幅变化。Campbell 与 Viceira 的动态模型说明名义长债是否是长期安全资产取决于通胀风险；全球货币套保研究也显示最优对冲依赖资产与汇率协方差，而非“长期资金应全额套保”的固定规则。<Cite n={3} /><Cite n={4} />
        </p>
        <div className="precision-note"><span>Duration match ≠ cash-flow match</span><p>前者在局部曲线冲击下匹配一阶价格敏感度；后者逐期安排资产现金流覆盖负债。现金流匹配通常减少再投资与市场出售需要，却可能昂贵、受资产供给限制，也仍有信用、提前偿还和操作风险。</p></div>
      </section>

      <section className="lesson-section" id="db-benefit">
        <p className="section-kicker">阶段三 · DB Pension　|　15 · 给付公式</p>
        <h2>DB 的起点是一套待遇公式，而不是账户里恰好有多少资产；资产不足不会自动改写已经归属的承诺。</h2>
        <p>
          一个极简年金公式可写为“计提率 × 计入服务年限 × 计入工资”。若计提率 2%、服务 25 年、计入工资 20 万元，则年待遇为 10 万元；真实计划还要处理归属、工资定义、退休年龄、提前或延迟退休调整、遗属待遇、一次性领取与通胀指数化。公式确定名义权利框架，精算假设再把每位成员在各状态下的支付汇总成现金流分布。
        </p>
        <p>
          “Defined” 不等于金额从今天起绝对固定。工资终值、退休选择、生存、指数化和计划修订都能改变未来现金流；也不意味着所有风险最终只由 sponsor 承担，破产保障、集体风险分享和公共财政安排会改变损失分配。合格分析应先写具体制度，再用 DB 作为机制标签。美国 PBGC 只为适用的私人 DB 提供有限保障，并不保障 DC，这一法域事实尤其不能被误写成全球养老金担保规则。<Cite n={59} />
        </p>
      </section>

      <section className="lesson-section" id="db-balance-sheet">
        <p className="section-kicker">16 · DB 的两层资产负债表</p>
        <h2>计划资产负债表与 sponsor 资产负债表相互连接，却不是同一张表。</h2>
        <p>
          计划层记录专门资产 A、计量负债 L、盈余 S=A−L 与现金流；sponsor 层记录自身经营资产、债务、盈利和向计划缴费的能力。计划资金不足时，未来缴费请求取决于融资规则、sponsor covenant 与谈判；sponsor 同时经营困难时，即便承诺理论上存在，补足能力也会下降。于是投资政策不能只看计划内资产波动，还要看缺口与 sponsor 风险是否在同一宏观冲击下恶化。
        </p>
        <p>
          Rauh 的美国企业养老金面板发现，资金不足且 sponsor 信用较弱时，计划不一定更激进，风险管理动机可以压过简单的股东风险转移故事；这仍是观察性证据，不能把相关性当成纯外生因果。Andonov、Bauer 与 Cremers 的跨制度研究又表明，公共与私人计划的治理和折现制度会改变资金状况与配置关系。两项研究共同反驳“一旦 underfunded 就必然加风险”，却没有提供一个跨法域固定方向。<Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="funded-ratio">
        <p className="section-kicker">17 · Funded Ratio 与 Surplus</p>
        <h2>资金充足率描述资产相对负债的比例，盈余描述货币缺口；两者都不等于可立即交付的现金。</h2>
        <div className="equation-card">
          <span>两个互补状态量</span>
          <div>FR = A / L　　S = A − L</div>
          <p>若 A=105、L=100，则 FR=105%，S=5。FR 便于比较不同规模计划，S 直接表示题设口径下的货币缓冲；但二者依赖同一估值口径，并不会告诉你 105 中有多少能在今天无损变现。</p>
        </div>
        <p>
          FR 高于 100% 只说明该计量口径下资产价值大于负债现值。资产可能是私募、房地产或受限制证券，衍生品却要求现金或高质量抵押品；计划也可能必须保留运营现金、即将支付大量待遇。因此研究 LDI 或任何流动性冲击时，必须另建“可用现金与抵押品账本”，不能把 surplus 当作钱包余额。
        </p>
      </section>

      <section className="lesson-section" id="surplus-sensitivity">
        <p className="section-kicker">18 · 盈余的利率敏感度</p>
        <h2>资产价格上涨并不保证 funded ratio 改善；分母若因更长久期上涨得更快，缺口反而扩大。</h2>
        <div className="equation-card">
          <span>资产与负债同时重估的一阶近似</span>
          <div>ΔS ≈ (−A × D<sub>A</sub> + L × D<sub>L</sub>) × Δy</div>
          <p>由 ΔA≈−A D<sub>A</sub>Δy 与 ΔL≈−L D<sub>L</sub>Δy 相减得到。它只适用于同一平行小幅曲线冲击，忽略凸性、现金流和基差；公式中每个规模和久期都必须使用一致单位。</p>
        </div>
        <p>
          设 A₀=105、L₀=100、D<sub>A</sub>=4、D<sub>L</sub>=12，收益率下降 50 bp，即 Δy=−0.005。一阶近似得 A₁=107.10、L₁=106.00：资产确实上涨，但 FR 从 105% 降至约 101.04%，S 从 5 降至 1.10。核心不是“债券涨了”，而是负债货币久期 1,200 高于资产 420；分母对冲击更敏感。
        </p>
      </section>

      <section className="lesson-section" id="contributions-benefits">
        <p className="section-kicker">19 · 缴费、待遇与计划成熟度</p>
        <h2>投资回报之外，sponsor 缴费、成员缴费、待遇支付和转移会直接改变资产与现金；成熟计划甚至可长期净流出。</h2>
        <p>
          计划期末资产恒等式可写成：期初资产＋投资收益＋sponsor/成员缴费−待遇支付−转移−费用。前四项来源不同：资产上涨是估值，缴费是外部现金注入，待遇支付是履约，转移可能随成员离开或风险转移发生。把 AUM 变化全部叫投资收益或资金流，会丢失真正触发订单的节点。
        </p>
        <p>
          成熟度通常反映领取者相对缴费者、近端支付和负债期限。年轻、持续新增成员的计划可能靠缴费覆盖近期支付；关闭新成员、领取者占比上升的计划则需要资产产生现金或定期出售。英国新 DB funding code 把显著成熟计划向低依赖融资与投资状态推进，并要求投资安排能够覆盖可预见及合理意外现金流；这是英国特定规则，不是所有 DB 的统一去风险日历。<Cite n={15} />
        </p>
      </section>

      <section className="lesson-section" id="db-saa">
        <p className="section-kicker">20 · DB 的战略资产配置</p>
        <h2>战略配置是在“履约概率、缺口风险、回报需要、流动性和 sponsor 承担力”之间求可行解，不是单独最大化资产 Sharpe ratio。</h2>
        <p>
          一个资金充足、成熟、sponsor 较弱的计划，可能优先锁定现金流与降低盈余波动；一个年轻、资金不足但 sponsor 强且缴费能力高的计划，可能保留更多增长资产以降低长期补缴压力。这里没有仅凭 funded ratio 就能读取的方向：资金不足可能诱发追求回报，也可能因破产与 covenant 风险促使去风险；监管曲线、会计结果、担保保费和治理问责又会改变边际成本。
        </p>
        <p>
          负债驱动视角的贡献，是把组合风险从“资产独立波动”改写为“资产相对负债的盈余风险”。Sharpe 与 Tint 提供理论起点，Rauh 和 Andonov 等则显示现实配置同时受制度与 sponsor 状态塑造。因而 SAA 的合格输出应是目标区间、对冲目标、现金缓冲、允许工具与治理触发器，而不是一句“养老金适合长期权益”。<Cite n={2} /><Cite n={5} /><Cite n={6} />
        </p>
      </section>

      <section className="lesson-section" id="ldi">
        <p className="section-kicker">21 · Liability-Driven Investment</p>
        <h2>LDI 是围绕负债风险组织 matching 与 growth 资产的框架，不是一种资产类别，也不承诺没有损失。</h2>
        <p>
          Matching portfolio 试图复制负债对名义利率、实际利率、通胀和现金流的敏感度；growth portfolio 则承担权益、信用、房地产或其他风险，以提高长期回报和修复缺口。若只用现金长债对冲，资本占用可能挤压增长资产；利率互换、通胀互换或回购能用较少初始现金获得 DV01，却把一部分长期估值风险转成逐日抵押品义务。
        </p>
        <p>
          通胀对冲也会进入市场微观结构。英国交易数据表明，养老金与 LDI 是通胀互换的重要订单来源，并与持续的相对定价偏差相关；这支持“负债指数化 → 通胀敏感度 → 互换订单 → 价格”的链条，但订单流与误定价相关并不等于纯外生因果，且结果高度依赖英国市场结构。<Cite n={38} />
        </p>
        <p>
          资金不足的计划也可能保留风险资产，同时用掉期增加久期。在做市商资产负债表有限时，聚合的 receive-fixed 需求能够进入长期互换利差；Klingler 与 Sundaresan 的模型和跨地区证据支持这条机制，但不能把所有负 swap spread 都归因于养老金。Domanski、Shin 与 Sushko 又展示了低利率、负债凸性与“追逐久期”的反馈模型；这是一种条件机制，不是每个法域的精确因果弹性。<Cite n={8} /><Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="hedge-ratio">
        <p className="section-kicker">22 · 对冲率与掉期 Notional</p>
        <h2>目标对冲率先作用于负债货币敏感度，再减去现有资产与衍生品敞口；notional 只是实现工具的尺度。</h2>
        <div className="equation-card">
          <span>简化利率对冲缺口</span>
          <div>Gap<sub>DV01</sub> = h* × DV01<sub>L</sub> − DV01<sub>physical</sub> − DV01<sub>derivatives,current</sub> − DV01<sub>derivatives,pending</sub></div>
          <p>h* 是目标覆盖比例；四项必须采用同一曲线节点和同一符号约定，避免把现有掉期重复买入。若用每 1 百万元 notional 提供 k 单位 DV01 的 receive-fixed swap 补足，则 N=Gap/k。方向必须先判断：负债像长期固定现金流，通常需要增加随利率下降而升值的资产敏感度。</p>
        </div>
        <p>
          例：L=100、D<sub>L</sub>=12，目标覆盖 80%，实物债 60、久期 5；用“百万元·年”暂作货币久期单位，目标为 960，实物提供 300，缺口 660。若每 1 百万元 receive-fixed 掉期提供 7，则 notional 约 94.29。Notional 大于某项实物债市值不自动等于过度对冲；真正要核对的是曲线节点、PV01、基差、对手方与抵押品压力。
        </p>
      </section>

      <section className="lesson-section" id="rebalance-corridor">
        <p className="section-kicker">23 · 再平衡区间</p>
        <h2>治理良好的长期目标通常是一组区间和触发器，而不是要求组合每天精确回到一个点。</h2>
        <p>
          当 growth 资产上涨使权重突破上沿，计划可能卖出并补充 matching 资产；下跌触及下沿时则可能买入，形成正常状态下的逆向需求。但 corridor 订单仍要服从 funded ratio、现金、sponsor covenant 和抵押品：若下跌同时触发追加保证金或 sponsor 经营恶化，原本应“逢低买入”的计划可以暂停再平衡，甚至出售最容易变现的安全资产。
        </p>
        <p>
          因此目标区间不是自动稳定器，而是条件规则。研究时要保存上下沿、估值频率、是否允许临时偏离、谁有权暂停、在途订单和补充现金来源；只看到季度持仓从 55% 回到 50%，不能知道是价格漂移、净现金流、对冲调整还是治理决策。
        </p>
      </section>

      <section className="lesson-section" id="collateral-waterfall">
        <p className="section-kicker">24 · 抵押品瀑布</p>
        <h2>“有多少资产”与“今天能交多少合格抵押品”是两张表；顺序、折扣和结算速度决定能否跨过现金悬崖。</h2>
        <p>
          一个简化瀑布可以依次包括：超出运营底线的现金、已质押或可当日质押的短期国债、可当日回购的高质量债券、可快速赎回的流动基金、需要次日或更久结算的证券、最后才是私募与房地产。每层要扣除抵押品折扣（haircut）、已占用金额、操作限制和到账时间；账面市值再高，若不能在追缴截止前交付，就不能覆盖今日变动保证金（variation margin，VM）。
        </p>
        <p>
          荷兰全行业研究发现，互换在样本中贡献了相当大的组合久期，利率急升时低缓冲基金出售中短期安全政府债；工具变量与 granular IV 证据表明这种出售能够影响收益率。结论不是“掉期有害”，而是对冲与流动性必须联合优化：增加 DV01 的同时，要预先购买跨压力状态可用的时间。<Cite n={10} />
        </p>
      </section>

      <section className="lesson-section" id="ldi-stress">
        <p className="section-kicker">25 · 2022 英国 LDI 压力链</p>
        <h2>在负债利率敏感度高于资产等条件下，收益率上升可改善经济 funding；leveraged hedge 却会产生即时现金损失，并把个体约束变成市场正反馈。</h2>
        <div className="mechanism-chain" aria-label="2022 年英国 LDI 压力的六步反馈链">
          <div><span>01</span><b>长债暴跌</b><p>四个交易日内 30 年期 gilt 收益率约上升 140 bp。</p></div>
          <div><span>02</span><b>对冲亏损</b><p>receive-fixed 掉期与回购敞口需要追加保证金或抵押品。</p></div>
          <div><span>03</span><b>补充迟滞</b><p>pooled LDI、小计划与多层授权令现金调拨落后于市场。</p></div>
          <div><span>04</span><b>被迫卖债</b><p>基金出售长期 gilt 降低杠杆，安全资产成为最先卖出的资产。</p></div>
          <div><span>05</span><b>价格再跌</b><p>市场深度不足，销售压低价格并触发新一轮追缴。</p></div>
          <div><span>06</span><b>央行阻断</b><p>临时、定向购债恢复市场功能，为去杠杆争取时间。</p></div>
        </div>
        <p>
          BoE 估计相关抵押品要求超过 700 亿英镑；交易级研究显示危机前回购与互换暴露越大，危机中 gilt 出售越多。后续研究估计 LDI 火售造成约 10% 的额外折价、解释约一半价格跌幅，但该结论来自这一特定事件与识别设计，不能变成一般危机常数。重要的是机制分层：负债现值下降改善经济 funding，receive-fixed 头寸却发生现金亏损；FR 与 collateral sufficiency 因此可以向相反方向运动。<Cite n={11} /><Cite n={12} /><Cite n={13} />
        </p>
        <p>
          事后 TPR 要求市场冲击缓冲与运营缓冲并存，并把补充速度、资产来源和治理能力纳入。正确结论不是“LDI 导致养老金破产”，也不是“提高缓冲就消灭风险”，而是：杠杆套保减少经济久期错配的同时，会增加流动性占用；缓冲越厚，增长资产空间与融资成本可能越受影响，政策设计必须比较两类风险。<Cite n={14} />
        </p>
      </section>

      <section className="lesson-section" id="dc-promise">
        <p className="section-kicker">阶段四 · DC Pension　|　26 · 缴费承诺与风险承担</p>
        <h2>纯 DC 通常承诺缴费与账户机制，不承诺补足某个退休收入；市场与长寿风险因此更多落在参与人。</h2>
        <p>
          若 sponsor 按工资 8% 缴费、工资 20 万元，其明确年度缴费为 1.6 万元；账户终值则取决于成员缴费、投资回报、费用、提款和年金化条件。市场下跌不会像 DB 那样直接形成 sponsor 对同一给付公式的资金缺口，却会减少成员财富，并可能通过延迟退休、提高储蓄或降低消费反馈到实体经济。
        </p>
        <p>
          “成员承担投资结果”也不意味着 sponsor 与管理人没有义务。计划仍可能承担缴费、行政、默认设计、信息披露和受托责任；保证型 DC 或混合计划还会把部分风险重新拉回 sponsor。美国 DOL 的定义适合说明纯型边界，中国企业年金是完全积累的个人账户制度，但其受托链、资产比例和领取规则必须按本地制度分析。<Cite n={1} /><Cite n={48} />
        </p>
      </section>

      <section className="lesson-section" id="dc-default-glidepath">
        <p className="section-kicker">27 · 默认方案与 Glide Path</p>
        <h2>默认基金把拖延、年龄和退休日期转成规则权重；风险从 sponsor 迁给个人后，机构订单并没有消失。</h2>
        <p>
          自动加入和默认投资能显著提高参与并形成黏性。Madrian 与 Shea 的企业管理数据表明，大量员工长期停留在默认缴费率和默认基金；Carroll 等进一步比较主动选择与默认机制，说明最优设计取决于拖延、偏好异质性与金融素养。它们支持“默认很有力量”，不能证明任一默认组合对每个人都福利最优。<Cite n={16} /><Cite n={17} />
        </p>
        <p>
          Target-date fund 通常随目标退休日期接近降低权益并提高债券，但路径可按年龄、资金状况、工资相关性和年金价格而异；固定年龄规则不是理论上的普遍最优。大样本研究发现默认环境显著提高 TDF 使用，随后制度变化使不同年龄群的股票比例按生命周期重新分布；这些证据仍受雇主、服务商和参与者选择限制。<Cite n={18} /><Cite n={20} />
        </p>
      </section>

      <section className="lesson-section" id="dc-flow-orders">
        <p className="section-kicker">28 · DC 资金流与机械订单</p>
        <h2>工资缴费、雇主匹配、账户转换、glide-path 换权和退休提款在载体层聚合，才成为可交易需求。</h2>
        <div className="equation-card">
          <span>简化 DC 目标订单</span>
          <div>O<sub>i</sub> = w<sub>i,t</sub>* × (AUM<sub>t−</sub> + NetFlow<sub>t</sub>) − H<sub>i,t−</sub> − Pending<sub>i,t</sub></div>
          <p>净流量包括确认缴费、匹配、转入减提款与转出；新权重可能由 glide path 或再平衡规则改变。目标金额减去现有与在途暴露才是证券层母订单，正净流入不保证所有资产都被买入。</p>
        </div>
        <p>
          TDF 的规则再平衡可在正常市场形成逆向资金流，并影响集中持有证券的回报，这说明纯账户型养老金仍能成为价格传导节点；证据不能保证危机中每次都稳定。底层若使用共同基金或 ETF，成员账户流还要经过份额、基金和交易台多层账本，不能把工资缴费当成当日同额股票买盘。<Cite n={19} />
        </p>
      </section>

      <section className="lesson-section" id="db-dc-comparison">
        <p className="section-kicker">29 · DB 与 DC 的冲击分流</p>
        <h2>同一利率、股价或人口冲击会先进入不同主体和状态，因此两者不能共享一个“养老金需求函数”。</h2>
        <div className="table-scroll" role="region" aria-label="DB 与 DC 冲击传导比较，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">同一冲击在 DB 与 DC 中的首要状态、风险承担人和订单接口</caption>
            <thead><tr><th scope="col">冲击</th><th scope="col">DB 首要链条</th><th scope="col">纯 DC 首要链条</th></tr></thead>
            <tbody>
              <tr><th scope="row">利率下降</th><td>负债现值与久期缺口 → funding / hedge target → 长债或掉期需求</td><td>债券与年金价格、账户回报 → glide path / 领取选择</td></tr>
              <tr><th scope="row">股市下跌</th><td>计划资产下降 → surplus 与 sponsor 缴费/去风险压力</td><td>个人账户财富下降 → 缴费、转换、退休和消费反应</td></tr>
              <tr><th scope="row">寿命延长</th><td>计划给付期拉长 → 负债与 sponsor 缺口上升</td><td>成员面临资产耗尽风险，除非另购年金或存在保证</td></tr>
              <tr><th scope="row">退休潮</th><td>待遇净流出、计划成熟度和流动性需求上升</td><td>提款、转出与默认基金去风险形成载体层流量</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          中国还需分开基本养老、全国社会保障基金、地方结余受托投资、企业年金、职业年金和个人养老金。基本养老全国统筹是制度与收支协调，不等于全国资产合成一个投资组合；地方基本养老结余中受托投资部分又与全国社保基金中央战略储备分账。个人养老金已全国实施并实行个人账户完全积累，当前年度税前扣除上限为 1.2 万元；这些制度事实只能说明可能流量来源，不能推出参与人会按产品上限等比例配置。<Cite n={47} /><Cite n={50} /><Cite n={51} /><Cite n={62} /><Cite n={63} />
        </p>
      </section>

      <section className="lesson-section" id="insurance-contract">
        <p className="section-kicker">阶段五 · Insurance Capital　|　30 · 保单权利义务</p>
        <h2>保费不是可自由投资的永久资本；保险人取得资产，同时承担对特定事件与受益人的合同负债。</h2>
        <p>
          投保人订立合同并通常支付保费，被保险人是风险所附着的人或标的，受益人在约定事件发生时取得给付，保险人负责承保并用资产和资本履约。三种身份可能由同一人承担，也可能分离。保费进入一般账户后会与投资收益、新业务、费用、赔款、退保和再保险现金流汇合；只有在满足合同、监管与资本约束后，剩余价值才属于股东。
        </p>
        <p>
          年金进一步显示养老金与保险的接口：个人或计划以保费交换未来连续给付，保险人接收资产并承担长寿、利率和资产兑现风险；变额或指数型结构又可能把部分市场结果传回保单持有人。分析不应问“险资偏爱什么”，而应先问保单承诺、保证来源、参与机制、退保权、再保险和账户归属。
        </p>
      </section>

      <section className="lesson-section" id="insurance-product-axes">
        <p className="section-kicker">31 · 三条保险产品轴</p>
        <h2>寿险/财险、一般/独立账户、保证/投资连结回答不同问题；任何一条都不能单独决定风险归属。</h2>
        <div className="table-scroll" role="region" aria-label="保险产品三条分类轴，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">保险事件类型、账户归属与保证结构的分类边界</caption>
            <thead><tr><th scope="col">分类轴</th><th scope="col">核心问题</th><th scope="col">常见误推</th></tr></thead>
            <tbody>
              <tr><th scope="row">寿险/年金 ↔ 财产/责任/健康</th><td>何种事件生成负债，赔付开发与期限怎样分布</td><td>寿险必然很长、财险必然很短</td></tr>
              <tr><th scope="row">General account ↔ separate / linked account</th><td>资产在哪张账上、市场结果多大程度传给持有人</td><td>独立核算自动等于完全破产隔离或无任何保证</td></tr>
              <tr><th scope="row">固定/保证 ↔ 参与/变额/指数型</th><td>最低给付、分红和市场收益怎样分配</td><td>产品名称足以判断全部资产风险由谁承担</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          变量年金可以把独立账户回报传给持有人，同时由一般账户支持最低给付或收入保证；长尾责任险可能比某些可随时退保的寿险具有更稳定的支付期限。NAIC 明确提示 separate accounts 的法律隔离取决于州法与产品，中国 2019 年 ALM 暂行规则也区分普通账户与独立账户风险承担。两套制度不能互译为相同破产法结果。<Cite n={46} /><Cite n={55} />
        </p>
      </section>

      <section className="lesson-section" id="insurance-cashflows">
        <p className="section-kicker">32 · 保险负债现金流</p>
        <h2>死亡、长寿、事故、灾害、费用和退保共同决定金额与时点；负债期限因此不是合同封面上的固定数字。</h2>
        <p>
          寿险现金流需要死亡率、存续、退保、保单贷款、保费续缴和费用假设；年金对长寿尤其敏感；财险要区分事故发生、报案、赔付发展和再保险回收。相关性也很关键：巨灾可能同时提高赔款、扰乱资产市场并延迟再保险回款；利率上升可能降低某些固定现金流现值，却提高旧保单退保吸引力。
        </p>
        <p>
          因而负债现金流应按状态和时间建模，而不是只用平均到期日。尾部情景要同时改变赔付、市场价格、交易深度和行为选择；若压力测试只让资产下跌、负债概率保持不变，就会低估同源冲击。保险会计与偿付能力模型也会用不同风险调整、曲线和边界，研究时必须保存口径。
        </p>
      </section>

      <section className="lesson-section" id="insurer-balance-sheet">
        <p className="section-kicker">33 · 保险公司资产负债表</p>
        <h2>承保风险与投资风险在 own funds 中相遇；一笔资产的经济价值、会计价值与监管资本消耗可能同时不同。</h2>
        <p>
          极简表可写成资产 A、保险负债 L 与可吸收损失资源 OF=A−L，但真实 own funds 还受资格、分层、限制与监管调整影响。资产侧包括现金、政府债、信用、权益、贷款、私募、房地产和衍生品；负债侧包括最佳估计现金流、保证、费用、风险边际或当地准备金；再保险既产生可收回资产，也增加交易对手与法律执行风险。
        </p>
        <p>
          德国寿险会计数据反推出的资产久期低于负债久期，并显示随后逐步收窄，说明负久期缺口是现实问题；估计仍依赖会计与模型假设，不能当作所有保险公司的常数。更一般地，资产价格变动是否穿透股权取决于负债黏性、会计确认和资本压力：正常时期保险人能隔离一部分暂时波动，危机中这种能力会显著减弱。<Cite n={21} /><Cite n={31} />
        </p>
      </section>

      <section className="lesson-section" id="solvency-ratio">
        <p className="section-kicker">34 · 偿付能力比率</p>
        <h2>通用比率只是一座概念桥；EU SCR、美国 RBC 与中国核心/综合偿付能力的分子、分母和干预层级不可互换。</h2>
        <div className="equation-card">
          <span>教学用通用结构</span>
          <div>SR = Eligible Own Funds / Capital Requirement</div>
          <p>分子是规则认可的可吸收损失资源，分母是按风险模块或法定公式计算的资本要求。若 SR=105%，只能说在该题设口径下高于 100%；是否“达标”、能否分红或增持风险资产，还要看法域、资本层级、风险评级和内部底线。</p>
        </div>
        <p>
          Solvency II 的 SCR 目标是覆盖规定置信水平下的一年风险，并另设 MCR 与干预框架；美国 RBC 对寿险、财险和健康险使用不同公式及多级 action levels；中国 C-ROSS II 同时要求核心偿付能力、综合偿付能力与风险综合评级。把某公司的“偿付率 180%”与另一法域同名数字直接比较，会同时错配分子、分母、估值和阈值。<Cite n={44} /><Cite n={45} /><Cite n={53} />
        </p>
      </section>

      <section className="lesson-section" id="risk-based-capital">
        <p className="section-kicker">35 · 风险资本怎样限制资产</p>
        <h2>资本要求把资产类别、期限、信用、集中度、承保与操作风险映射为稀缺资本消耗，从而改变可行投资集合。</h2>
        <p>
          若一项高收益信用资产同时提高违约、利差和集中度资本，表面收益必须与资本影子成本比较；风险降低或对冲只有获得监管认可时，才可能释放相应资本。Sen 对美国变额年金的准实验表明，经济上相似的保证因为监管对冲认可不同，会诱发不同的股票与利率对冲边界；这说明“风险被测量在哪里”会改变真实交易，但不能直接推广到其他产品。<Cite n={30} />
        </p>
        <p>
          阈值还会制造非线性。资产下跌降低 own funds，风险上升又可能抬高 denominator；离内部或法定底线越近，边际减仓越急。中国 2025 年规则把权益类资产许可上限与上季度综合偿付能力区间连接，从低于 100% 到 350% 以上对应不同上限；这些是许可边界，不是目标仓位。上限提高只扩大可行域，不能直接写成保险公司必然买股。<Cite n={54} />
        </p>
      </section>

      <section className="lesson-section" id="insurer-saa">
        <p className="section-kicker">36 · 保险一般账户的战略配置</p>
        <h2>保证成本、负债现金流、资本效率、评级目标、流动性与可得资产共同决定配置；“低利率必然追逐收益”并非定理。</h2>
        <p>
          低利率会提高旧保证的相对成本并压缩再投资收益，可能诱发延长久期、增配信用或私募；但若资本和流动性约束收紧，公司也可能买入更安全、更短的债券。Becker 与 Ivashina 发现保险人在同一监管评级类别内偏向收益率与信用风险更高的公司债，且扩张期和约束较弱公司更明显；这支持特定的 reach-for-yield 机制，不证明政策利率是唯一原因或所有保险人都会冒险。<Cite n={23} />
        </p>
        <p>
          Ge 与 Weisbach 用意外天气损失识别财险经营冲击，发现受压公司反而转向更安全、更流动的信用资产；它不能代表寿险全部 ALM，却构成重要反例。新业务保费、资产供给、税、会计分类、评级和股东目标还会改变边际决策。正确问题不是“低利率下险资买什么”，而是“哪项约束在此公司、此产品与此状态下最紧”。<Cite n={26} />
        </p>
      </section>

      <section className="lesson-section" id="insurance-alm">
        <p className="section-kicker">37 · 保险 ALM</p>
        <h2>期限、币种和现金流匹配能降低再投资与错配风险，却不会把信用、期权、流动性和估值风险变成零。</h2>
        <p>
          保险 ALM 会比较资产与负债在各期限节点的现金流、DV01、通胀与币种，设置流动性缓冲，并考虑保证、退保与新业务。长期贷款、基础设施或私人信用的合同现金流可能接近负债期限，也可能因为违约、展期、提前偿还、基金结构和估值迟滞而无法匹配；“基础设施物理寿命很长”不等于投资载体能稳定支付三十年。
        </p>
        <p>
          机构基础设施投资数据表明，封闭式基金仍具有类似私募股权的周期、费用与退出依赖，公共机构绩效也受治理与载体影响。近年的 BIS 综述进一步指出，私人市场、PE 所有权与资产密集型再保险既可补充资本、分散风险，也会增加估值、流动性、关联与跨境监督难度。结论应是“风险形态和位置改变”，不是“私人资产天然匹配长期负债”。<Cite n={37} /><Cite n={39} /><Cite n={40} />
        </p>
      </section>

      <section className="lesson-section" id="policyholder-options">
        <p className="section-kicker">38 · 保单持有人选择权</p>
        <h2>利率变化不仅重估固定现金流，还改变退保、领取和保证执行；负债因此会对市场价格内生反应。</h2>
        <p>
          当市场新产品收益显著高于旧保单，持有人可能退保并重新配置；保险人立即支付现金，负债规模和有效久期下降，原有利率对冲甚至变成过度。反过来，低利率会使有利保证更可能被持有或执行，负债期限拉长。退保还受费用、税、流动性需要、销售渠道和行为惯性影响，因此不能只用市场利差机械预测。
        </p>
        <p>
          德国寿险研究用外部货币政策意外工具化长期利率，估计长期利率上升 1 个百分点对应退保率约上升 25 bp；随后每年 1%–2% 的资产出售来自结构模型反事实，而非直接观测。Koijen 与 Yogo 对变额年金的结构研究也显示长期市场保证具有尾部凸性，资本压力会改变费用、保证和产品退出；其产品边界不能直接外推到普通寿险。<Cite n={22} /><Cite n={29} />
        </p>
      </section>

      <section className="lesson-section" id="claims-surrenders">
        <p className="section-kicker">39 · 赔款、退保与新业务</p>
        <h2>财险赔款、寿险退保和开放式基金赎回都能制造现金流出，却有不同合同起因、预测结构与反馈。</h2>
        <p>
          巨灾赔款来自承保事件并可能高度集中；退保由持有人行使合同选择权，常对利率、信用与信心敏感；基金赎回则是份额持有人按产品机制撤出资本。三者在交易台上都可能要求卖资产，但风险模型、提前预警、是否可收回再保险、能否收取退保费以及剩余持有人后果不同。统一叫“赎回压力”会妨碍识别。
        </p>
        <p>
          新业务也会改变现金流。保费流入提供可配置资金，却同时生成未来负债与资本需求；危机中资本影子成本上升时，寿险公司可能以异常价格争取或收缩不同产品。Koijen 与 Yogo 利用准备金要求差异识别 2008 年资本摩擦，强力说明资本进入产品定价，但极端影子成本不能代表正常时期。<Cite n={27} />
        </p>
      </section>

      <section className="lesson-section" id="insurance-hedge-collateral">
        <p className="section-kicker">40 · 保险对冲与抵押品</p>
        <h2>衍生品可以降低股票、利率、通胀和汇率风险，却新增基差、展期、对手方、保证金与运营时钟。</h2>
        <p>
          保险公司可用期货、掉期和期权对冲保证，但经济敞口与监管认可未必一致。对冲若被认可，可降低资本要求；若不被认可，可能只改变经济风险而不释放法定资本。资产与负债曲线、保证触发和保单行为模型不同，还会留下 basis 与 model risk。任何“已对冲”声明都应附带工具、名义本金、Greek/DV01、期限节点、抵押品与会计处理。
        </p>
        <p>
          关联再保险或离岸安排也可转移负债和释放显性资本，但会增加交易对手、法律实体、抵押品与透明度链条。Koijen 与 Yogo 的美国结构研究发现影子关联再保险快速扩张，并在模型中降低价格、显性资本和提高预期损失；这不等于所有再保险都是监管套利。分析必须追踪风险最终停在哪张资产负债表，而不是看到原保险人比率改善就认为风险消失。<Cite n={28} />
        </p>
      </section>

      <section className="lesson-section" id="insurer-rebalancing">
        <p className="section-kicker">41 · 保险再平衡与资本动作</p>
        <h2>保险人既可能承接市场卖盘，也可能在评级、资本或流动性阈值附近成为强迫卖家；方向由状态决定。</h2>
        <p>
          德国证券持仓研究发现保险与养老金在样本正常状态中通常买入价格下跌证券，而银行和基金更偏顺周期；约束增强会削弱其逆周期性。荷兰主权债危机样本又显示保险人曾出售南欧债券，未出现普遍本国偏好上升。两者不是矛盾：黏性负债、资本缓冲和深度买盘让机构有能力承接暂时波动，压力接近阈值时同一机构会切换行为。<Cite n={32} /><Cite n={33} />
        </p>
        <p>
          评级降至垃圾级能同时造成价格损失、资本要求上升和授权违规。美国保险交易的事件研究发现受约束持有人卖得更多，价格先跌后反转；历史成本与公允价值导向又会产生不同的顺周期路径，有的出售被重估资产，有的出售盈利资产实现收益。监管宽容可以避免立即火售，也可能鼓励未来在被优待资产中积累风险。结论不是某一计量制度天然稳定，而是每套规则会选择不同的卖单。<Cite n={24} /><Cite n={25} /><Cite n={34} />
        </p>
        <p>
          中国现行保险资产负债管理依据截至本节更新日仍是 2019 年暂行规则；2026 年 8 月公布的新办法到 2027 年 1 月 1 日才生效，并设报告与过渡安排。机构可以提前调整，但教材不能把已公布写成已生效。美国、欧盟、英国与中国规则也不能跨法域互换；先冻结适用日，才能解释某次调仓面对的真实约束。<Cite n={55} /><Cite n={56} />
        </p>
      </section>

      <section className="lesson-section" id="parent-order-ledger">
        <p className="section-kicker">阶段六 · 订单、反馈与研究　|　42 · 母订单账本</p>
        <h2>战略配置、对冲目标与资本修复都只是目标状态；减去现有、在途和可替代暴露后，才得到可执行母订单。</h2>
        <div className="equation-card">
          <span>统一的目标到订单恒等式</span>
          <div>O<sub>i</sub> = E<sub>i</sub>*(L, capital, cashflows, constraints) − E<sub>i</sub><sup>current</sup> − E<sub>i</sub><sup>pending</sup></div>
          <p>E* 是在给定负债、资本、现金流和授权下的目标暴露；current 包括现货与衍生品等价敞口；pending 包括未结算交易、已指令缴费或已安排对冲。O 才是交易台要实施的缺口，不必与资产配置变化同额。</p>
        </div>
        <p>
          例如 funded ratio 改善后，DB 可以把增长资产目标下调，却先用掉期锁定久期，再等私募分配到账后卖权益；保险人接近内部资本底线，也可以增资、购买再保险、减少新业务或出售资产。观察到某类持仓下降，只能说明终点变化，不能知道目标、替代工具与原因。研究需要把决策账、头寸账、现金账和成交账连起来。
        </p>
      </section>

      <section className="lesson-section" id="exposure-units">
        <p className="section-kicker">43 · 暴露单位</p>
        <h2>市值、面值、notional、DV01、capital charge 与可用抵押品回答不同问题；未经转换不能相加。</h2>
        <div className="table-scroll" role="region" aria-label="养老金与保险交易常见暴露单位，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">六类头寸与约束单位的定义及用途</caption>
            <thead><tr><th scope="col">单位</th><th scope="col">回答什么</th><th scope="col">典型误用</th></tr></thead>
            <tbody>
              <tr><th scope="row">Market value</th><td>资产当前账面/经济规模</td><td>直接等同风险或可用现金</td></tr>
              <tr><th scope="row">Face / principal</th><td>合同本金或未来偿还基数</td><td>与现值、资本要求混加</td></tr>
              <tr><th scope="row">Derivative notional</th><td>衍生品支付计算尺度</td><td>把 notional 当成已投入现金</td></tr>
              <tr><th scope="row">DV01 / key-rate DV01</th><td>利率变化 1 bp 的货币敏感度</td><td>跨不同曲线节点无条件抵消</td></tr>
              <tr><th scope="row">Capital requirement</th><td>监管或内部风险消耗</td><td>当成预期损失或市值</td></tr>
              <tr><th scope="row">Available collateral</th><td>在截止前可交付的合格资产</td><td>用私募估值覆盖今日 VM</td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="lesson-section" id="execution-clocks">
        <p className="section-kicker">44 · 从季度治理到日内执行</p>
        <h2>董事会可以按季度设目标，保证金却按日内到期；交易台必须在授权与截止时点内选择可结算路径。</h2>
        <p>
          一项长期去风险决策可能先由精算与 ALM 建议，经受托人批准，再下达给多家管理人；市场冲击期间则可能由预授权的流动性瀑布自动出售。Pooled fund 还增加通知、份额赎回、跨托管转账与结算层。每多一层授权，正常状态治理可能更稳健，压力状态反应却可能更慢。
        </p>
        <p>
          母订单到成交仍需权衡 Q/ADV、spread、depth、价格风险、对手方限额与基准时点。不要把季度持仓变化放到日内价格图上直接归因，也不要假设资本规则触发后所有机构同日卖满许可缺口。唯一稳妥的路径是标明 decision time、instruction time、order time、execution time、settlement time 与 collateral deadline。
        </p>
      </section>

      <section className="lesson-section" id="stabilizing-feedback">
        <p className="section-kicker">45 · 稳定反馈</p>
        <h2>黏性负债、持续缴费、充足缓冲和可暂停的再平衡规则，能让长期机构在正常状态承接暂时价格波动。</h2>
        <p>
          若现金流可预测、无高杠杆追缴、资本远离阈值、sponsor 能补缴且市场有深度，资产价格下跌会把 growth 权重推至 corridor 下沿，机构可用缴费或到期现金买入；保险人也可持有受损但仍履约的债券等待均值回归。Chodorow-Reich、Ghent 与 Haddad 的证券级证据表明，危机外资产价格变动只部分传到寿险股权，黏性负债发挥“隔离器”作用；危机中资本压力会削弱它。<Cite n={31} />
        </p>
        <p>
          这类稳定不是道德品质，而是一种资产负债表期权：有现金、有风险预算、有时间且没有被迫标记或出售，才有能力逆势。Timmer 的机构比较支持保险与养老金在样本正常状态中的逆周期性，但把两类主体部分合并且仍属条件性事实。正确结论是列出稳定成立的状态，不是给机构贴永久“耐心资本”标签。<Cite n={32} />
        </p>
      </section>

      <section className="lesson-section" id="destabilizing-feedback">
        <p className="section-kicker">46 · 放大反馈</p>
        <h2>保证金、赔款、退保、降级、资本阈值与相似套保能把长期持仓者同步转成价格不敏感的卖方。</h2>
        <p>
          放大链通常具有四个条件：冲击同时损害分子并抬高分母或现金需求；阈值触发必须动作；机构持有相似且易卖的资产；市场承接资产负债表有限。评级下调火售、LDI 抵押品螺旋和退保驱动出售只是不同版本。若出售压低其余持仓价值，own funds 继续下降，原定卖单又会被放大。
        </p>
        <p>
          保险人作为资产管理者的结构模型显示，不完全对冲保证可能把风险转入高风险和不流动债券，同步冲击下共同出售会严重侵蚀股权；模型反事实不是实测危机比例。PE 收购寿险公司的事件研究则发现资本与税务套利、短期定价改善与相对资本的预期损失上升并存；不能由此把所有 PE 所有权或私人资产判为有害。<Cite n={35} /><Cite n={36} />
        </p>
      </section>

      <section className="lesson-section" id="state-dependent-sign">
        <p className="section-kicker">47 · 状态依赖的交易符号</p>
        <h2>同一机构、同一资产下跌，在不同 surplus、资本、流动性和市场深度中可以生成相反订单。</h2>
        <div className="table-scroll" role="region" aria-label="养老金与保险状态依赖订单方向矩阵，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">四种资产负债表状态下的典型约束与订单倾向</caption>
            <thead><tr><th scope="col">状态</th><th scope="col">缓冲/现金</th><th scope="col">主导约束</th><th scope="col">可能订单</th></tr></thead>
            <tbody>
              <tr><th scope="row">A · 充足且流动</th><td>高 / 高</td><td>corridor 与长期价值</td><td>买入下跌资产、补足目标权重</td></tr>
              <tr><th scope="row">B · 充足但缺现金</th><td>高 / 低</td><td>抵押品或近期待遇</td><td>卖最流动资产，即使长期 funding 良好</td></tr>
              <tr><th scope="row">C · 资本临界但有现金</th><td>低 / 高</td><td>资本 denominator 与评级</td><td>降风险、对冲、再保险或增资</td></tr>
              <tr><th scope="row">D · 双重受压</th><td>低 / 低</td><td>现金、资本与市场深度</td><td>强迫出售并可能形成正反馈</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          这个矩阵也解释监管宽容的双刃剑：降低某类资产资本要求可以让 C/D 状态少卖，缓和当前火售；同时可能诱发未来在该类资产集中买入。Becker、Opp 与 Saidi 对 2009 年美国非机构 MBS 改革的差分与不连续证据同时观察到这两个方向。政策评价必须跨时间比较即时稳定与风险积累。<Cite n={34} />
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">48 · 可证伪研究协议</p>
        <h2>研究从冻结法律产品、计量口径和冲击前状态开始；持仓变化只能是结果，不能自动充当动机。</h2>
        <div className="table-scroll" role="region" aria-label="养老金与保险资本研究字段协议，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <caption className="sr-only">从制度、负债、资产到订单与识别的最小字段</caption>
            <thead><tr><th scope="col">层</th><th scope="col">至少保存</th><th scope="col">避免的误判</th></tr></thead>
            <tbody>
              <tr><th scope="row">制度/产品</th><td>法域、法律主体、DB/DC、账户、保证、规则版本与生效日</td><td>把公告规则当现行，把名称当风险归属</td></tr>
              <tr><th scope="row">负债</th><td>现金流、曲线、久期/凸性、通胀、币种、选择权与口径</td><td>用资产预期收益率任意折现</td></tr>
              <tr><th scope="row">状态</th><td>A、L、FR/S、own funds、资本要求、评级、现金和 collateral</td><td>FR&gt;100% 等同流动</td></tr>
              <tr><th scope="row">治理/目标</th><td>sponsor covenant、SAA、hedge ratio、corridor、内部底线与授权</td><td>把监管上限当目标仓位</td></tr>
              <tr><th scope="row">头寸/流量</th><td>市值、DV01、notional、缴费、待遇、赔款、退保、在途与再保险</td><td>跨单位相加或把估值变化当交易</td></tr>
              <tr><th scope="row">订单/市场</th><td>母订单、成交、截止、venue、spread、depth、Q/ADV 与对手方</td><td>季度持仓直接解释日内价格</td></tr>
              <tr><th scope="row">识别</th><td>制度冲击、阈值、工具变量、对照、前趋势、共同冲击和外部效度</td><td>观察相关性升级成普遍因果</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          最强设计往往利用计量或监管差异改变约束：荷兰 UFR 改革改变期限需求；监管对冲认可改变保险套保；准备金规则差异识别资本影子成本；评级与资本改革揭示强迫出售。交易级事件研究适合识别订单与价格压力，结构模型适合比较反事实，制度报告适合确定规则边界。三类证据能互补，但任何一种都不能冒充另外两种。<Cite n={7} /><Cite n={24} /><Cite n={27} /><Cite n={30} />
        </p>
        <p>
          若研究中国市场，还要严格分开全国社保基金、地方基本养老受托资产、企业/职业年金、个人养老金、保险普通账户与独立账户，并记录权益上限所属偿付能力档位及 2027 ALM 新规过渡状态。结果变量应落到具体订单、收益率、利差、深度或后续反转，而不是以“长钱入市”作为不可证伪结论。<Cite n={47} /><Cite n={48} /><Cite n={49} /><Cite n={50} /><Cite n={51} /><Cite n={52} /><Cite n={54} /><Cite n={56} /><Cite n={63} /><Cite n={64} />
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">49 · 互动实验</p>
        <h2>八道题先把承诺变成负债和资产负债表，再把对冲、抵押品、DC 流量与资本阈值变成唯一可判订单。</h2>
        <p>
          Mode 01 依次检查风险承担人、折现、资产与负债同时重估，以及同一承诺在两套教学曲线下的不同计量。Mode 02 再计算 DB 掉期 notional、今日抵押品瀑布、DC 新资金与 glide path 的联合订单，以及保险公司为恢复内部资本底线所需的最小卖出块。所有数字均为封闭教学情景，不是实际计划、会计或监管建议。
        </p>
        <PensionInsuranceLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">50 · 主动练习</p>
        <h2>六道练习要求你亲自重建现金流、敏感度、对冲、资本与状态切换，而不是背诵“长期资金稳定”。</h2>
        <div className="exercise-list">
          <article className="practice-problem">
            <span>练习 01 · DB 现金流与现值</span>
            <p>某简化 DB 计划在第 5 年末有 70% 概率支付 40，在第 10 年末有 60% 概率支付 80；两项状态可视为独立的概率加权支付，教学折现率均为 3%。求预期现金流与现值。金额为百万元。</p>
            <details className="practice-answer"><summary>展开核对答案</summary><p>E[CF₅]=0.7×40=28，E[CF₁₀]=0.6×80=48；L=28/1.03⁵+48/1.03¹⁰≈24.15+35.72=59.87。概率加权现金流不是最大承诺，也不是已支付现金。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习 02 · Funded Ratio 与流动性分账</span>
            <p>计划资产 120，其中现金 4、可当日变现 T-bill 6、其余 110 为次日或更慢资产；负债现值 100。今日 VM 为 12，运营现金底线 2。分别求 FR、surplus 与今日可用流动性，并判断是否足额。</p>
            <details className="practice-answer"><summary>展开核对答案</summary><p>FR=120%，S=20；今日可用流动性=(4−2)+6=8，小于 VM 12，缺口 4。资金充足并不等于抵押品充足。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习 03 · 资产负债久期冲击</span>
            <p>A=90、L=100、D<sub>A</sub>=6、D<sub>L</sub>=14，收益率上升 25 bp。忽略凸性与现金流，求 A₁、L₁、初末 FR 与 surplus。</p>
            <details className="practice-answer"><summary>展开核对答案</summary><p>Δy=0.0025；A₁=90(1−6×0.0025)=88.65，L₁=100(1−14×0.0025)=96.50。FR 从 90% 升至约 91.87%，S 从 −10 变为 −7.85。资产下跌，但更长久期负债下降更多，funding 有所改善。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习 04 · Key-rate 边界</span>
            <p>资产与负债总 DV01 都为 0.10 百万元/bp，但资产 DV01 全在 10 年节点，负债 DV01 全在 30 年节点。30 年收益率单独下降 40 bp，10 年不变。说明为什么“总 DV01 匹配”没有保护 surplus。</p>
            <details className="practice-answer"><summary>展开核对答案</summary><p>负债约上升 0.10×40=4，资产对 30 年节点的题设敏感度为零，因此 surplus 约下降 4。总 DV01 只对假设的共同平行移动有意义，期限节点错配需要 key-rate DV01。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习 05 · DC 流量与换权</span>
            <p>DC 基金 AUM 200，股票/债券持仓 140/60；确认净缴费 20，新 glide-path 权重 60%/40%，另有在途债券买单 5。忽略其他摩擦，求新的母订单。</p>
            <details className="practice-answer"><summary>展开核对答案</summary><p>交易后规模 220，目标为 132/88。股票订单=132−140=−8；债券订单=88−60−5=+23；两者净额 +15，加上在途 +5 后总新增暴露为净缴费 20。正流入仍包含股票卖单。</p></details>
          </article>
          <article className="practice-problem">
            <span>练习 06 · 保险资本的反馈</span>
            <p>保险人 own funds=24、requirement=20，内部底线 115%。信用资产价格再跌使 own funds 降至 21、requirement 升至 21。写出冲击前后比率、是否触发动作，并给出一个会放大和一个会阻断卖出循环的条件。开放题评分判据：答案不必与示例用同一机制，但必须明确反馈方向并写出闭合因果链。</p>
            <details className="practice-answer"><summary>展开核对答案</summary><p>初始 SR=120%，冲击后 SR=100%，低于内部 115%，触发修复。若浅市场卖出继续压低余下资产并降低 own funds，会放大；股东注资、合格再保险、深度买盘或允许的渐进修复可阻断。具体可行动作仍受法域和授权约束。</p></details>
          </article>
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">51 · 理解检查</p>
        <h2>若能不看正文解释以下十问，你才真正把“长期资本”还原成承诺、账本、约束与状态依赖订单。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么 DB/DC 与 funded/unfunded 不能互换？</summary><p>前者分配投资与给付结果风险，后者说明是否积累专门资产。DB 可以 funded 或现收现付；DC 也可存在记账尚未完全做实的结构。</p></details>
          <details><summary>02 · 为什么 sponsor、trustee 与 asset manager 不能合称“养老金基金”？</summary><p>Sponsor 承担缴费或缺口，trustee / governing body 负责治理和成员利益，manager 按授权构造并执行组合；三者的目标、责任和时钟不同。</p></details>
          <details><summary>03 · 为什么同一承诺会有多个负债数字？</summary><p>经济对冲、会计报告、最低融资与监管偿付能力使用不同目的、曲线、风险调整和平滑；法律现金流不变并不保证各口径现值相同。</p></details>
          <details><summary>04 · Duration match 为什么不等于 cash-flow match？</summary><p>久期只近似局部利率敏感度；现金流匹配逐期覆盖支付。曲线节点、凸性、通胀、币种、信用与选择权都能让相同总久期仍失配。</p></details>
          <details><summary>05 · FR 高于 100% 为什么仍会出现流动性危机？</summary><p>FR 使用全部资产相对计量负债，抵押品只认可截止前可交付的合格资产。大量私募或次日结算证券不能覆盖今日 VM。</p></details>
          <details><summary>06 · 2022 英国 LDI 为什么不是简单的资不抵债危机？</summary><p>利率上升降低了许多 DB 负债现值、可改善经济 funding；receive-fixed 对冲却立即亏损并追缴抵押品，迫使卖债形成市场反馈。</p></details>
          <details><summary>07 · 纯 DC 为什么仍会生成机械机构订单？</summary><p>工资缴费、雇主匹配、默认基金、glide path、账户转换与退休提款在载体层聚合，管理人仍需把新规模和规则权重变成订单。</p></details>
          <details><summary>08 · 偿付能力比率为什么不能跨法域直接比较？</summary><p>Eligible own funds、capital requirement、风险模块、资本层级、干预阈值与估值口径不同；EU SCR、美国 RBC 与中国核心/综合比率不是同一量。</p></details>
          <details><summary>09 · 低利率为什么不必然令保险公司 reach for yield？</summary><p>保证成本会增加冒险动机，但资本、评级、流动性、治理、产品现金流和资产供给可能使受压公司转向更安全、更流动资产。</p></details>
          <details><summary>10 · 为什么看到持仓变化仍不能知道机构动机？</summary><p>估值、缴费、赔款、退保、在途、现货与衍生品替代、资本和治理都能产生同一终点；需观察冲击前状态、目标、母订单与成交。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-closing">
        <p className="section-kicker">52 · 课程接口与最终诊断</p>
        <h2>2.05 输出的不是一张“长钱持仓表”，而是一套从承诺和计量到订单、价格与下一轮约束的资产负债表诊断协议。</h2>
        <div className="interface-grid">
          <article><span>← T02 / T06 / 2.01</span><h3>Discounting & Balance Sheet</h3><p>调用折现、资产负债表与状态—目标—约束—订单语言；本节新增 liability、funding、solvency 与 collateral。</p></article>
          <article><span>← 2.03–2.04</span><h3>Delegation & Rule Flows</h3><p>区分资产所有者与管理人，并调用 DC 默认规则流量；不重复主动选股、ETF 一级市场或指数事件。</p></article>
          <article><span>→ 2.06 / 2.16</span><h3>Intermediary & Risk Limits</h3><p>输出非银行机构的负债、资本和阈值实例；银行信用创造与通用 VaR / risk budget 留给后续。</p></article>
          <article><span>→ 2.17–2.18</span><h3>Liquidity & Benchmark</h3><p>养老金支付、退保和赔款不是基金 redemption；本节只建立 SAA/hedge target，完整流动性错配和绩效基准后讲。</p></article>
          <article><span>→ 3.07–3.12 / 4.13</span><h3>Rates, Collateral & Credit</h3><p>本节把曲线和利差当外部输入；后续解释它们怎样由宏观、银行与信用网络形成并反馈机构状态。</p></article>
          <article><span>→ 7.08 / 7.11–7.14</span><h3>Endogenous Risk</h3><p>输出机构缓冲、阈值和订单函数；复杂系统章再聚合 liquidity spiral、leverage cycle、crowding 与系统脆弱性。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“养老金或险资将稳定市场 / 推高某类资产”的说法，先冻结法律产品与风险承担者；分开 DB/DC 和 funded/unfunded，分开 sponsor、治理层、管理人、托管人与受益人；把承诺映射为状态现金流，再标明经济、会计、融资或监管口径；用现值、久期、key-rate DV01、通胀、币种和选择权重建负债；同时计算资产、funded ratio、surplus、own funds、资本要求、现金与抵押品；让 SAA、hedge ratio、corridor、glide path 和内部底线形成目标；减去现有、衍生品等价与在途暴露，保留缴费、待遇、赔款、退保和再保险；最后按决策、指令、执行、结算与追缴时钟观察订单怎样进入价格。价格再回写资产、负债、资本与行为后，才知道这笔长期资本在下一轮是耐心买家，还是不得不立刻卖出的机构。
        </p>
      </section>
    </>
  );
}

export const lesson205: LessonRecord = {
  slug: '2-05',
  id: '2.05',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Pension / Insurance Capital：承诺、负债、资本与订单',
  subtitle: '从受益权与保单承诺出发，解释未来现金流怎样经过折现、久期、funded ratio 或偿付能力约束，转化为配置、对冲、抵押品需求、市场订单与状态依赖反馈',
  readingTime: '核心阅读约 95–115 分钟；互动实验快速 20–25／含复盘 35–45，主动练习核对 15–20／完整书写 30–40，理解检查快速 8–10／完整复述 15–20，课程接口 3–4 分钟；快速路径约 141–174 分钟，完整学习约 178–224 分钟（建议分两次完成；参考文献与延伸阅读不计）',
  prerequisite: 'T02、T06、2.01；按需回看 1.09、1.20、2.03–2.04 与 T07',
  updatedAt: '2026-08-30',
  revision: '2.05-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.05-r1',
      summary: '冻结 r1 无 P0/P1，数学题与集成均正确；要求补齐现有衍生品 DV01、TPR 250 bp 例外、CAS 25 两种折现方法与当前实施边界，并替换失效的人社部链接。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.05-r1',
      summary: '冻结 r1 无 P0/P1；要求补齐开篇术语桥，重拆 sponsor、托管人与账户/估值服务角色，并统一 Chapter 2 英文标题。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'changes-requested',
      revision: '2.05-r2',
      summary: '冻结 r2 无 P0/P1；其余事实与数学回归通过，要求限定 CAS 25 折现构造的现金流适用范围与可选性，并更正两条财政部文件的标题、文号和日期元数据。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.05-r2',
      summary: '冻结 r2 的 53 节、八题实验、静态替代、SSR、存储恢复、无障碍、导航和时间预算全量回归通过，无 P0–P3。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.05-r3',
      summary: '冻结 r3 的 CAS 25 适用条件、可选构造、变动回报现金流边界与官方书目元数据全部通过；67 条来源、100 处引文、数学、法域和版本回归无 P0–P3。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.05-r3',
      summary: '冻结 r3 的全页教学、实验、SSR、无障碍、导航与构建无 P0–P2；建议以 P3 为首次出现的“基础项目”补充零基础解释。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.05-r4',
      summary: '冻结 r4 的起止六文件哈希一致；CAS 25 解释、67 条来源、100 处引文、数学、法域、版本与集成回归通过，P0–P3 全清。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-30',
      decision: 'approved',
      revision: '2.05-r4',
      summary: '冻结 r4 的“基础项目”零基础解释、53 节学习路径、实验、静态替代、SSR、无障碍、导航和构建全部通过，P0–P3 全清。',
    },
  ],
  previous: { slug: '2-04', label: '2.04 Passive Index Fund / ETF' },
  next: { slug: '2-06', label: '2.06 Banks as Leveraged Intermediaries' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整系统' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'promise-first', label: '承诺优先' },
    { id: 'pension-insurance-boundary', label: '养老金与保险边界' },
    { id: 'db-dc-boundary', label: 'DB、DC 与融资方式' },
    { id: 'actor-ledgers', label: '主体与账本' },
    { id: 'valuation-lenses', label: '多套负债计量' },
    { id: 'horizon-clocks', label: '六只时钟' },
    { id: 'liability-cashflows', label: '状态现金流' },
    { id: 'present-value', label: '负债现值' },
    { id: 'discount-curve', label: '折现曲线' },
    { id: 'modified-duration', label: '修正久期' },
    { id: 'dv01', label: 'DV01' },
    { id: 'duration-boundaries', label: '久期边界' },
    { id: 'db-benefit', label: 'DB 给付公式' },
    { id: 'db-balance-sheet', label: 'DB 两层资产负债表' },
    { id: 'funded-ratio', label: 'Funded Ratio' },
    { id: 'surplus-sensitivity', label: '盈余敏感度' },
    { id: 'contributions-benefits', label: '缴费、待遇与成熟度' },
    { id: 'db-saa', label: 'DB 战略配置' },
    { id: 'ldi', label: 'LDI 框架' },
    { id: 'hedge-ratio', label: '对冲率' },
    { id: 'rebalance-corridor', label: '再平衡区间' },
    { id: 'collateral-waterfall', label: '抵押品瀑布' },
    { id: 'ldi-stress', label: '英国 LDI 压力' },
    { id: 'dc-promise', label: 'DC 缴费承诺' },
    { id: 'dc-default-glidepath', label: '默认方案与 Glide Path' },
    { id: 'dc-flow-orders', label: 'DC 流量订单' },
    { id: 'db-dc-comparison', label: 'DB 与 DC 比较' },
    { id: 'insurance-contract', label: '保单权利义务' },
    { id: 'insurance-product-axes', label: '保险产品三轴' },
    { id: 'insurance-cashflows', label: '保险负债现金流' },
    { id: 'insurer-balance-sheet', label: '保险资产负债表' },
    { id: 'solvency-ratio', label: '偿付能力比率' },
    { id: 'risk-based-capital', label: '风险资本' },
    { id: 'insurer-saa', label: '保险战略配置' },
    { id: 'insurance-alm', label: '保险 ALM' },
    { id: 'policyholder-options', label: '保单选择权' },
    { id: 'claims-surrenders', label: '赔款与退保' },
    { id: 'insurance-hedge-collateral', label: '保险对冲与抵押品' },
    { id: 'insurer-rebalancing', label: '保险再平衡' },
    { id: 'parent-order-ledger', label: '母订单账本' },
    { id: 'exposure-units', label: '暴露单位' },
    { id: 'execution-clocks', label: '执行时钟' },
    { id: 'stabilizing-feedback', label: '稳定反馈' },
    { id: 'destabilizing-feedback', label: '放大反馈' },
    { id: 'state-dependent-sign', label: '状态依赖符号' },
    { id: 'research-protocol', label: '研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'interfaces-closing', label: '接口与诊断' },
  ],
  Content: Lesson205Content,
  references: [
    { id: 1, authors: 'U.S. Department of Labor, Employee Benefits Security Administration', year: 'current', accessedAt: '2026-08-30', title: 'Types of Retirement Plans and ERISA FAQs', publication: 'Official retirement-plan guidance', url: 'https://www.dol.gov/general/topic/retirement/typesofplans?lang=en', use: '建立美国法域下 DB 与 DC 的基础定义及风险承担边界；不能代替其他国家的计划文件或法律。' },
    { id: 2, authors: 'William F. Sharpe and Lawrence G. Tint', year: '1990', title: 'Liabilities—A New Approach', publication: 'Journal of Portfolio Management, 16(2), 5–10', url: 'https://doi.org/10.3905/jpm.1990.409248', use: '提供以资产相对负债的盈余而非孤立资产收益组织投资目标的经典理论起点；不是实证因果证据。' },
    { id: 3, authors: 'John Y. Campbell and Luis M. Viceira', year: '2001', title: 'Who Should Buy Long-Term Bonds?', publication: 'American Economic Review, 91(1), 99–127', url: 'https://doi.org/10.1257/aer.91.1.99', use: '说明长期名义债的安全性依赖通胀风险，并为动态资产配置和负债期限讨论提供理论边界。' },
    { id: 4, authors: 'John Y. Campbell, Karine Serfaty-de Medeiros and Luis M. Viceira', year: '2010', title: 'Global Currency Hedging', publication: 'Journal of Finance, 65(1), 87–121', url: 'https://doi.org/10.1111/j.1540-6261.2009.01524.x', use: '说明长期全球组合的外汇套保取决于资产与汇率协方差；不能推出所有机构都应百分之百套保。' },
    { id: 5, authors: 'Joshua D. Rauh', year: '2009', title: 'Risk Shifting versus Risk Management: Investment Policy in Corporate Pension Plans', publication: 'Review of Financial Studies, 22(7), 2687–2733', url: 'https://doi.org/10.1093/rfs/hhn068', use: '用美国企业养老金面板检验资金状况、sponsor 信用与配置，支持风险管理可压过简单风险转移动机；保留观察性边界。' },
    { id: 6, authors: 'Aleksandar Andonov, Rob Bauer and K. J. Martijn Cremers', year: '2017', title: 'Pension Fund Asset Allocation and Liability Discount Rates', publication: 'Review of Financial Studies, 30(8), 2555–2595', url: 'https://doi.org/10.1093/rfs/hhx020', use: '展示跨制度折现、治理、资金状况与风险配置的关系；不把相关性升级为统一因果动机。' },
    { id: 7, authors: 'Kristy A. E. Jansen', year: '2025', title: 'Long-Term Investors, Demand Shifts, and Yields', publication: 'Review of Financial Studies, 38(1), 114–157', url: 'https://doi.org/10.1093/rfs/hhae071', use: '利用荷兰 UFR 改革识别负债度量改变期限需求与收益率曲线的传导；外推需标注法域。' },
    { id: 8, authors: 'Sven Klingler and Suresh Sundaresan', year: '2019', title: 'An Explanation of Negative Swap Spreads: Demand for Duration from Underfunded Pension Plans', publication: 'Journal of Finance, 74(2), 675–710', url: 'https://doi.org/10.1111/jofi.12750', use: '解释 underfunded 养老金以互换获得久期及其与 dealer 约束、负 swap spread 的关系；不归因全部利差。' },
    { id: 9, authors: 'Dietrich Domanski, Hyun Song Shin and Vladyslav Sushko', year: '2017', title: 'The Hunt for Duration: Not Waving but Drowning?', publication: 'IMF Economic Review, 65(1), 113–153', url: 'https://doi.org/10.1057/s41308-016-0026-9', use: '提供低利率、负债凸性、久期追逐与长端收益率反馈模型；证据不是通用因果弹性。' },
    { id: 10, authors: 'Kristy A. E. Jansen, Sven Klingler, Angelo Ranaldo and Patty Duijm', year: '2026', title: 'Pension Liquidity Risk', publication: 'Review of Financial Studies, advance article hhag068', url: 'https://doi.org/10.1093/rfs/hhag068', use: '用荷兰养老金证券级持仓、货币政策意外和 granular IV 识别对冲流动性与债券出售价格影响。' },
    { id: 11, authors: 'Bank of England', year: '2022', accessedAt: '2026-08-30', title: 'Financial Stability Report—December 2022', publication: 'Official Financial Stability Report, Section 5', url: 'https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022', use: '提供英国 LDI 危机时间线、抵押品要求和“经济 funding 改善而流动性恶化”的官方区分。' },
    { id: 12, authors: 'Gabor Pinter', year: '2023', title: 'An Anatomy of the 2022 Gilt Market Crisis', publication: 'Bank of England Staff Working Paper No. 1019', url: 'https://www.bankofengland.co.uk/working-paper/2023/an-anatomy-of-the-2022-gilt-market-crisis', use: '以交易级数据连接危机前回购/互换敞口、gilt 出售和市场失序；单次事件且非期刊终版。' },
    { id: 13, authors: 'Gabor Pinter, Emil Siriwardane and Danny Walker', year: '2024', title: 'Fire Sales of Safe Assets', publication: 'Bank of England Staff Working Paper No. 1089; JFE forthcoming status reported by authors', url: 'https://www.bankofengland.co.uk/working-paper/2024/fire-sales-of-safe-assets', use: '估计 2022 LDI 强迫出售的折价与总跌幅贡献，并解释 pooled fund 协调迟滞；不虚构未核验卷页或 DOI。' },
    { id: 14, authors: 'The Pensions Regulator', year: '2023', accessedAt: '2026-08-30', title: 'Using Leveraged Liability-Driven Investment', publication: 'Official UK regulatory guidance, published 24 April 2023', url: 'https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/liability-driven-investment', use: '核对典型 gilt-related LDI 的五日补充假设与 250 bp 通常最低缓冲，并保留更慢/更高波动需上调及低内在波动可论证下调的例外。' },
    { id: 15, authors: 'The Pensions Regulator', year: '2024', accessedAt: '2026-08-30', title: 'Funding Defined Benefits', publication: 'UK Code of Practice: Funding and Investment', url: 'https://www.thepensionsregulator.gov.uk/en/document-library/code-of-practice/funding-and-investment/funding-defined-benefits', use: '说明英国 2024 DB funding code 的计划成熟度、低依赖与流动性要求及适用日期。' },
    { id: 16, authors: 'Brigitte C. Madrian and Dennis F. Shea', year: '2001', title: 'The Power of Suggestion: Inertia in 401(k) Participation and Savings Behavior', publication: 'Quarterly Journal of Economics, 116(4), 1149–1187', url: 'https://doi.org/10.1162/003355301753265543', use: '用企业管理数据说明自动加入、默认缴费和默认基金的黏性；不证明每项默认提升个体福利。' },
    { id: 17, authors: 'Gabriel D. Carroll, James J. Choi, David Laibson, Brigitte C. Madrian and Andrew Metrick', year: '2009', title: 'Optimal Defaults and Active Decisions', publication: 'Quarterly Journal of Economics, 124(4), 1639–1674', url: 'https://doi.org/10.1162/qjec.2009.124.4.1639', use: '比较主动选择与默认机制，说明最优默认依赖拖延、偏好异质性和金融素养。' },
    { id: 18, authors: 'Olivia S. Mitchell and Stephen P. Utkus', year: '2022', title: 'Target-Date Funds and Portfolio Choice in 401(k) Plans', publication: 'Journal of Pension Economics & Finance, 21(4), 519–536', url: 'https://doi.org/10.1017/S1474747221000263', use: '提供大样本 TDF 使用与组合差异，保留雇主和使用者选择限制及模拟福利边界。' },
    { id: 19, authors: 'Jonathan A. Parker, Antoinette Schoar and Yang Sun', year: '2023', title: 'Retail Financial Innovation and Stock Market Dynamics: The Case of Target Date Funds', publication: 'Journal of Finance, 78(5), 2673–2723', url: 'https://doi.org/10.1111/jofi.13258', use: '识别 TDF 规则再平衡的宏观逆向流和持仓证券价格影响；不能保证每次危机都稳定。' },
    { id: 20, authors: 'Jonathan A. Parker, Antoinette Schoar, Allison Cole and Duncan Simester', year: '2025', title: 'Household Portfolios and Retirement Saving over the Life Cycle', publication: 'Journal of Finance, 80(5), 2739–2787', url: 'https://doi.org/10.1111/jofi.13473', use: '利用美国制度变化和数百万账户分析 TDF 默认对不同年龄风险配置的影响；保留非随机与外部效度边界。' },
    { id: 21, authors: 'Axel Möhlmann', year: '2021', title: 'Interest Rate Risk of Life Insurers: Evidence from Accounting Data', publication: 'Financial Management, 50(2), 587–612', url: 'https://doi.org/10.1111/fima.12305', use: '从德国寿险会计数据估计资产负债久期缺口及其收窄；估计依赖会计与估值假设。' },
    { id: 22, authors: 'Christian Kubitza, Nicolaus Grochola and Helmut Gründl', year: '2025', title: 'Life Insurance Convexity', publication: 'Journal of Banking & Finance, 178, 107502', url: 'https://doi.org/10.1016/j.jbankfin.2025.107502', use: '用利率工具变量识别退保率反应，并以模型推演资产出售；严格区分实测系数和反事实。' },
    { id: 23, authors: 'Bo Becker and Victoria Ivashina', year: '2015', title: 'Reaching for Yield in the Bond Market', publication: 'Journal of Finance, 70(5), 1863–1902', url: 'https://doi.org/10.1111/jofi.12199', use: '提供监管评级类别内部保险公司 reach-for-yield 证据；不把低利率或全部机构写成唯一原因。' },
    { id: 24, authors: 'Andrew Ellul, Chotibhak Jotikasthira and Christian T. Lundblad', year: '2011', title: 'Regulatory Pressure and Fire Sales in the Corporate Bond Market', publication: 'Journal of Financial Economics, 101(3), 596–620', url: 'https://doi.org/10.1016/j.jfineco.2011.03.020', use: '利用评级降级事件比较受约束保险人的出售与价格反转；评级下调并非随机且制度样本较早。' },
    { id: 25, authors: 'Andrew Ellul, Chotibhak Jotikasthira, Christian T. Lundblad and Yihui Wang', year: '2015', title: 'Is Historical Cost Accounting a Panacea? Market Stress, Incentive Distortions, and Gains Trading', publication: 'Journal of Finance, 70(6), 2489–2538', url: 'https://doi.org/10.1111/jofi.12357', use: '说明历史成本与公允价值导向会生成不同顺周期出售渠道，而非某一制度绝对稳定。' },
    { id: 26, authors: 'Shan Ge and Michael S. Weisbach', year: '2021', title: 'The Role of Financial Conditions in Portfolio Choices: The Case of Insurers', publication: 'Journal of Financial Economics, 142(2), 803–830', url: 'https://doi.org/10.1016/j.jfineco.2021.05.019', use: '用意外天气损失工具变量说明受压财险公司转向更安全、更流动债券，构成“必然追逐收益”的反例。' },
    { id: 27, authors: 'Ralph S. J. Koijen and Motohiro Yogo', year: '2015', title: 'The Cost of Financial Frictions for Life Insurers', publication: 'American Economic Review, 105(1), 445–475', url: 'https://doi.org/10.1257/aer.20121036', use: '利用产品准备金差异识别危机中资本影子成本进入寿险和年金定价；极端时期结果不代表常态。' },
    { id: 28, authors: 'Ralph S. J. Koijen and Motohiro Yogo', year: '2016', title: 'Shadow Insurance', publication: 'Econometrica, 84(3), 1265–1287', url: 'https://doi.org/10.3982/ECTA12401', use: '追踪美国关联再保险和资本套利并建立结构反事实；不把所有再保险认定为规避监管。' },
    { id: 29, authors: 'Ralph S. J. Koijen and Motohiro Yogo', year: '2022', title: 'The Fragility of Market Risk Insurance', publication: 'Journal of Finance, 77(2), 815–862', url: 'https://doi.org/10.1111/jofi.13118', use: '用变额年金结构模型分析长期保证、资本压力、费用和产品退出；产品边界需保留。' },
    { id: 30, authors: 'Ishita Sen', year: '2023', title: 'Regulatory Limits to Risk Management', publication: 'Review of Financial Studies, 36(6), 2175–2223', url: 'https://doi.org/10.1093/rfs/hhac083', use: '利用监管认可差异识别真实对冲边界，说明计量规则怎样改变股票与利率套保。' },
    { id: 31, authors: 'Gabriel Chodorow-Reich, Andra C. Ghent and Valentin Haddad', year: '2021', title: 'Asset Insulators', publication: 'Review of Financial Studies, 34(3), 1509–1539', url: 'https://doi.org/10.1093/rfs/hhaa061', use: '以证券级资产价值和保险公司股权说明黏性负债在正常期隔离波动、危机资本压力削弱该能力。' },
    { id: 32, authors: 'Yannick Timmer', year: '2018', title: 'Cyclical Investment Behavior across Financial Institutions', publication: 'Journal of Financial Economics, 129(2), 268–286', url: 'https://doi.org/10.1016/j.jfineco.2018.04.012', use: '比较德国机构持仓的顺逆周期交易，并显示约束会削弱保险与养老金的承接能力；保留聚合与识别边界。' },
    { id: 33, authors: 'Melle Bijlsma and Robert Vermeulen', year: '2016', title: 'Insurance Companies’ Trading Behaviour during the European Sovereign Debt Crisis: Flight Home or Flight to Quality?', publication: 'Journal of Financial Stability, 27, 137–154', url: 'https://doi.org/10.1016/j.jfs.2016.11.001', use: '提供荷兰保险人在主权危机出售南欧债券的反例，说明机构交易符号取决于状态与样本。' },
    { id: 34, authors: 'Bo Becker, Marcus M. Opp and Farzad Saidi', year: '2022', title: 'Regulatory Forbearance in the U.S. Insurance Industry', publication: 'Review of Financial Studies, 35(12), 5438–5482', url: 'https://doi.org/10.1093/rfs/hhab102', use: '围绕 2009 年 MBS 资本改革识别少火售与未来风险集中并存的双向政策后果。' },
    { id: 35, authors: 'Andrew Ellul, Chotibhak Jotikasthira, Anastasia Kartasheva, Christian T. Lundblad and Wolf Wagner', year: '2022', title: 'Insurers as Asset Managers and Systemic Risk', publication: 'Review of Financial Studies, 35(12), 5483–5534', url: 'https://doi.org/10.1093/rfs/hhac056', use: '用寿险和变额年金结构模型连接不完全套保、不流动信用与同步出售；模型比例不当作实测危机事实。' },
    { id: 36, authors: 'Divya Kirti and Natasha Sarin', year: '2024', title: 'What Private Equity Does Differently: Evidence from Life Insurance', publication: 'Review of Financial Studies, 37(1), 201–230', url: 'https://doi.org/10.1093/rfs/hhad055', use: '以收购事件研究 PE 所有权、资本与税务策略、定价和相对资本预期损失；不把所有私人资产定性为低质。' },
    { id: 37, authors: 'Aleksandar Andonov, Roman Kräussl and Joshua D. Rauh', year: '2021', title: 'Institutional Investors and Infrastructure Investing', publication: 'Review of Financial Studies, 34(8), 3880–3934', url: 'https://doi.org/10.1093/rfs/hhab048', use: '说明基础设施物理寿命不能自动转化为负债匹配，载体、费用、退出和治理会改变风险。' },
    { id: 38, authors: 'Rodrigo Barria and Gabor Pinter', year: '2023', title: 'Mispricing in Inflation Markets', publication: 'Bank of England Staff Working Paper No. 1034', url: 'https://www.bankofengland.co.uk/working-paper/2023/mispricing-in-inflation-markets', use: '用英国交易数据连接养老金/LDI 通胀互换订单流与相对定价偏差；非纯外生需求实验且非期刊终版。' },
    { id: 39, authors: 'Fabian Garavito, Ulf Lewrick, Tomas Stastny and Karamfil Todorov', year: '2024', accessedAt: '2026-08-30', title: 'Shifting Landscapes: Life Insurance and Financial Stability', publication: 'BIS Quarterly Review, September 2024, 21–34', url: 'https://www.bis.org/publications/shifting-landscapes-life-insurance-and-financial-stability', use: '提供私人市场、PE 关联与离岸资产密集型再保险的跨法域结构综述；不代替单项因果研究。' },
    { id: 40, authors: 'Matteo Aquilina et al.', year: '2025', accessedAt: '2026-08-30', title: 'The Transformation of the Life Insurance Industry: Systemic Risks and Policy Challenges', publication: 'BIS Papers No. 161', url: 'https://www.bis.org/publ/bppdf/bispap161.htm', use: '更新长期保证、私人资产、所有权、再保险和监管数据缺口；作为行业地图而非识别论文。' },
    { id: 41, authors: 'IFRS Foundation', year: '2023', accessedAt: '2026-08-30', title: 'IAS 19 Employee Benefits', publication: 'International Financial Reporting Standard; issued text', url: 'https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2023/issued/part-a/ias-19-employee-benefits.pdf?bypass=on', use: '核对 DB 会计折现的高质量公司债/政府债、币种与期限匹配边界；不是经济或最低融资曲线。' },
    { id: 42, authors: 'IFRS Foundation', year: '2022', accessedAt: '2026-08-30', title: 'IFRS 17 Insurance Contracts', publication: 'International Financial Reporting Standard; issued text', url: 'https://www.ifrs.org/content/dam/ifrs/publications/pdf-standards/english/2022/issued/part-a/ifrs-17-insurance-contracts.pdf?bypass=on', use: '核对保险会计折现反映时间价值、合同现金流特征与流动性，并排除无关资产风险。' },
    { id: 43, authors: 'European Union', year: '2025', accessedAt: '2026-08-30', title: 'Directive (EU) 2016/2341 on Institutions for Occupational Retirement Provision — Consolidated Text', publication: 'EUR-Lex, consolidated 17 January 2025', url: 'https://eur-lex.europa.eu/eli/dir/2016/2341/2025-01-17/eng', use: '核对 sponsor 与 IORP 法律分离、技术准备金、资产覆盖、审慎人和成员国规则空间。' },
    { id: 44, authors: 'European Insurance and Occupational Pensions Authority', year: 'current', accessedAt: '2026-08-30', title: 'Solvency II — Current Framework', publication: 'Official EIOPA regulation and policy portal', url: 'https://www.eiopa.europa.eu/browse/regulation-and-policy/solvency-ii_en', use: '说明欧盟保险技术准备金、SCR/MCR 与审慎框架；2025 修订到 2027 年适用的版本边界另行核对。' },
    { id: 45, authors: 'National Association of Insurance Commissioners', year: 'current', accessedAt: '2026-08-30', title: 'Risk-Based Capital', publication: 'Official NAIC insurance topic', url: 'https://content.naic.org/insurance-topics/risk-based-capital', use: '核对美国州监管 RBC 的寿险、财险、健康险不同公式和多级干预，而非单一全球合格线。' },
    { id: 46, authors: 'National Association of Insurance Commissioners', year: 'current', accessedAt: '2026-08-30', title: 'Separate Accounts', publication: 'Official NAIC insurance topic', url: 'https://content.naic.org/insurance-topics/separate-accounts', use: '建立美国一般/独立账户的制度入口；隔离程度、投资风险传递与附加保证仍需按州法和合同核对。' },
    { id: 47, authors: '全国人民代表大会常务委员会', year: '2018', accessedAt: '2026-08-30', title: '中华人民共和国社会保险法', publication: '国家法律，第十一至十五条等', url: 'https://www.npc.gov.cn/npc/c2/c10134/201905/t20190522_175815.html', use: '核对中国基本养老社会统筹、个人账户、财政责任与权利边界，避免简化为纯现收现付。' },
    { id: 48, authors: '人力资源社会保障部、财政部', year: '2017', accessedAt: '2026-08-30', title: '企业年金办法', publication: '人力资源社会保障部令第 36 号', url: 'https://www.mohrss.gov.cn/SYrlzyhshbzb/shehuibaozhang/zcwj/201712/t20171222_284833.html', use: '核对企业年金的完全积累个人账户、缴费与领取边界；基金治理角色另见 reference 60。' },
    { id: 49, authors: '人力资源社会保障部、财政部', year: '2016', accessedAt: '2026-08-30', title: '职业年金基金管理暂行办法', publication: '人社部发〔2016〕92 号', url: 'https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/201610/t20161013_2434596.htm', use: '核对职业年金代理—受托—托管—投资管理结构；缴费与财政记账做实另见 reference 61。' },
    { id: 50, authors: '国务院办公厅、财政部等', year: '2022–2024', accessedAt: '2026-08-30', title: '个人养老金制度全国实施与税收政策', publication: '中国政府官方政策资料', url: 'https://app.www.gov.cn/govdata/gov/202412/13/522679/article.html', use: '核对个人养老金全国实施、自愿完全积累、封闭账户及当前 1.2 万元年度税前扣除边界。' },
    { id: 51, authors: '国务院、财政部等', year: '2015', accessedAt: '2026-08-30', title: '基本养老保险基金投资管理办法', publication: '中国政府官方制度文件', url: 'https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/201508/t20150824_1431696.htm', use: '核对地方基本养老结余受托投资、支付准备和套期保值边界，避免与全国社保基金混同。' },
    { id: 52, authors: '全国人民代表大会常务委员会', year: '2015/current', accessedAt: '2026-08-30', title: '中华人民共和国保险法', publication: '中国保险业基础法律', url: 'https://www.npc.gov.cn/npc/c2/c183/c198/201905/t20190522_74168.html', use: '核对保险合同、保险资金运用的法律边界与安全稳健原则；具体资产和账户规则另见监管文件。' },
    { id: 53, authors: '原中国银保监会', year: '2021–2022', accessedAt: '2026-08-30', title: '保险公司偿付能力监管规则（II）与偿付能力管理规定', publication: 'C-ROSS II official rule package', url: 'https://www.nfra.gov.cn/cn/view/pages/governmentDetail.html?docId=1027892&generaltype=1&itemId=861', use: '核对核心/综合偿付能力、风险评级、最低资本和监管负债口径；参数版本须与具体日期绑定。' },
    { id: 54, authors: '国家金融监督管理总局', year: '2025', accessedAt: '2026-08-30', title: '关于调整保险资金权益类资产监管比例有关事项的通知', publication: 'Official regulatory notice', url: 'https://www.nfra.gov.cn/cn/view/pages/governmentDetail.html?docId=1203998&generaltype=1&itemId=861', use: '核对权益类资产许可上限与综合偿付能力档位的连接；上限不是目标仓位或必然订单。' },
    { id: 55, authors: '原中国银保监会', year: '2019', accessedAt: '2026-08-30', title: '保险资产负债管理监管暂行办法', publication: '截至 2026-08-30 仍适用的中国 ALM 规则', url: 'https://www.nfra.gov.cn/cn/view/pages/ItemDetail.html?docId=231262', use: '核对当前普通/独立账户、期限、成本收益、流动性与风险承担边界。' },
    { id: 56, authors: '国家金融监督管理总局', year: '2026', accessedAt: '2026-08-30', title: '保险公司资产负债管理办法及配套实施通知', publication: '公布于 20 August 2026；生效于 1 January 2027', url: 'https://www.nfra.gov.cn/cn/view/pages/governmentDetail.html?docId=1268952&itemId=861&generaltype=1', use: '冻结中国新 ALM 规则的公布、生效、首报和过渡时间；不得在 2026 年 8 月写成已生效约束。' },
    { id: 57, authors: '中华人民共和国财政部', year: '2020', accessedAt: '2026-08-30', title: '企业会计准则第 25 号——保险合同', publication: '财会〔2020〕20 号附件', url: 'https://kjs.mof.gov.cn/gongzuodongtai/202012/P020201223674185009899.pdf', use: '提供中国保险会计现金流、折现与计量的准则文本；折现方法问答和当前实施边界分别见 references 65–67。' },
    { id: 58, authors: 'National Association of Insurance Commissioners', year: 'current', accessedAt: '2026-08-30', title: 'Pension Risk Transfer', publication: 'Official NAIC insurance topic', url: 'https://content.naic.org/insurance-topics/pension-risk-transfer', use: '核对美国养老金 buy-in、buy-out 与保险年金承接接口；不替代具体计划、州法或保险合同。' },
    { id: 59, authors: 'Pension Benefit Guaranty Corporation', year: 'current', accessedAt: '2026-08-30', title: 'Plans Paying Premiums FAQs', publication: 'Official PBGC guidance', url: 'https://www.pbgc.gov/wr/benefits/guaranteed-benefits/plans-paying-premiums-faqs', use: '核对 PBGC 对适用私人 DB 的有限保障及 DC 不在保障范围；严格限于美国制度。' },
    { id: 60, authors: '人力资源社会保障部等', year: '2011/current', accessedAt: '2026-08-30', title: '企业年金基金管理办法', publication: '中国企业年金基金治理规则', url: 'https://www.mohrss.gov.cn/xxgk2020/gzk/gz/202112/P020211229553899666697.pdf', use: '核对委托人、受托人、账户管理人、托管人与投资管理人的职责和基金治理链。' },
    { id: 61, authors: '国务院办公厅', year: '2015', accessedAt: '2026-08-30', title: '机关事业单位职业年金办法', publication: '国办发〔2015〕18 号', url: 'https://www.mof.gov.cn/zhengwuxinxi/zhengcefabu/201504/t20150406_1213145.htm', use: '核对个人与单位缴费、财政全额供款单位记账及退休前做实机制，作为 funded/DC 两轴反例。' },
    { id: 62, authors: '新华社（中国就业网转载）', year: '2026', accessedAt: '2026-08-30', title: '如何理解健全社保基金长效筹集、统筹调剂、保值增值和安全监管机制', publication: '中国就业网，人力资源和社会保障部所属网站，29 January 2026', url: 'https://chinajob.mohrss.gov.cn/c/2026-01-29/484156.shtml', use: '区分社会保险、补充保险与国家战略储备基金，说明分账核算及全国统筹调剂金的地区收支协调功能；与 references 47、51、63 合用。' },
    { id: 63, authors: '全国社会保障基金理事会', year: '2026', accessedAt: '2026-08-30', title: '2025 年受托管理基本养老保险基金年度报告', publication: 'Official annual report', url: 'https://www.ssf.gov.cn/portal/yljjgl/webinfo/2026/07/1787323584702755.htm', use: '区分全国社保基金、地方基本养老受托资产与其他受托资产的法律和核算边界。' },
    { id: 64, authors: '原中国银保监会', year: '2018/current', accessedAt: '2026-08-30', title: '保险资金运用管理办法', publication: '中国保险资金运用现行规则', url: 'https://www.nfra.gov.cn/cn/view/pages/rulesDetail.html?docId=1024949&itemId=4214', use: '核对保险资金允许资产、安全稳健、偿付能力与 ALM 约束及独立账户分离管理。' },
    { id: 65, authors: '中华人民共和国财政部会计司', year: '2023', accessedAt: '2026-08-30', title: '保险合同准则实施问答：自下而上法如何确定折现率', publication: '企业会计准则实施问答', url: 'https://kjs.mof.gov.cn/zt/kjzzss/sswd/xbxhtsswd/202303/t20230313_3872126.htm', use: '核对不随基础项目回报而变动的保险合同现金流量采用自下而上法时，可考虑从当前风险无关曲线出发并加入合同相关调整，同时排除无关逆周期调整；该构造不是对全部保险现金流的无条件规则。' },
    { id: 66, authors: '中华人民共和国财政部、国家金融监督管理总局', year: '2025', accessedAt: '2026-08-30', title: '关于进一步贯彻落实新保险合同会计准则的通知', publication: '财会〔2025〕12 号；2025 年 6 月 6 日（官网发布于 2025 年 6 月 12 日）', url: 'https://kjs.mof.gov.cn/zhengcefabu/202506/t20250612_3965538.htm', use: '核对其他执行企业会计准则企业原则上自 2026 年起执行及符合条件的暂缓安排。' },
    { id: 67, authors: '中华人民共和国财政部会计司', year: '2026', accessedAt: '2026-08-30', title: '问：保险公司改变保险合同负债计量所采用的折现率的确定方法，如将“自上而下的方法”修改为“自下而上的方法”，在不存在前期差错的情况下，应当按照会计估计变更还是会计政策变更进行会计处理？', publication: '企业会计准则实施问答；发布日期：2026 年 5 月 7 日', url: 'https://kjs.mof.gov.cn/zt/kjzzss/sswd/xbxhtsswd/202604/t20260430_3988926.htm', use: '核对 CAS 25 自上而下与自下而上两种方法及方法变更的会计处理边界。' },
  ],
  readingList: [
    { title: 'Sharpe & Tint (1990)', scope: '全文，重点读 surplus framework 与 liability-relative objective', reason: '先把资产管理目标从孤立回报切换到相对负债的盈余风险。', url: 'https://doi.org/10.3905/jpm.1990.409248' },
    { title: 'Campbell & Viceira (2001)', scope: '模型直觉、通胀指数债与名义长债的条件安全性', reason: '理解“期限很长”为什么不自动让名义长债成为无风险匹配资产。', url: 'https://doi.org/10.1257/aer.91.1.99' },
    { title: 'Rauh (2009)', scope: '假说、机构样本、固定效应结果与识别限制', reason: '检验 underfunded 计划必然冒险这一流行直觉。', url: 'https://doi.org/10.1093/rfs/hhn068' },
    { title: 'Andonov, Bauer & Cremers (2017)', scope: '跨公共/私人、美国/加拿大/欧洲制度比较', reason: '看到折现与治理怎样改变观察到的资金状况和配置。', url: 'https://doi.org/10.1093/rfs/hhx020' },
    { title: 'Jansen (2025)', scope: 'UFR 改革、期限需求识别与收益率曲线结果', reason: '完整阅读“规则改变负债敏感度，再改变市场价格”的强识别链。', url: 'https://doi.org/10.1093/rfs/hhae071' },
    { title: 'Klingler & Sundaresan (2019)', scope: '养老金掉期需求、dealer 约束与负 swap spread', reason: '理解 underfunded 计划如何同时保留增长资产并购买久期。', url: 'https://doi.org/10.1111/jofi.12750' },
    { title: 'Jansen et al. (2026)', scope: '互换久期、缓冲、工具变量与 granular IV', reason: '把经济对冲、现金缓冲、债券出售和价格影响放进同一设计。', url: 'https://doi.org/10.1093/rfs/hhag068' },
    { title: 'Bank of England FSR (December 2022)', scope: 'Section 5 的事件时间线、抵押品与 funding 区分', reason: '用一手监管材料建立 LDI 危机的制度事实底座。', url: 'https://www.bankofengland.co.uk/financial-stability-report/2022/december-2022' },
    { title: 'Pinter (2023)', scope: '交易级 gilt、repo 与 swap 数据', reason: '观察危机前头寸怎样映射为危机期出售，而不是只读新闻叙事。', url: 'https://www.bankofengland.co.uk/working-paper/2023/an-anatomy-of-the-2022-gilt-market-crisis' },
    { title: 'Pinter, Siriwardane & Walker (2024)', scope: '火售折价、pooled LDI 协调摩擦与买方进入', reason: '理解安全资产也会因资产负债表分割而发生火售。', url: 'https://www.bankofengland.co.uk/working-paper/2024/fire-sales-of-safe-assets' },
    { title: 'TPR Leveraged LDI Guidance', scope: 'market stress buffer、operational buffer、五日补充与治理', reason: '把危机经验转成可操作但有法域边界的流动性治理。', url: 'https://www.thepensionsregulator.gov.uk/en/document-library/scheme-management-detailed-guidance/funding-and-investment-detailed-guidance/liability-driven-investment' },
    { title: 'Madrian & Shea (2001)', scope: '自动加入、默认锚定和数据设计', reason: '理解 DC 的风险承担迁移为何仍会形成机构化规则流。', url: 'https://doi.org/10.1162/003355301753265543' },
    { title: 'Madrian & Shea (2002) · Formal Correction', scope: 'QJE 117(1), 377 的正式勘误', reason: '训练在引用经典经验结果时同时核对作者与期刊发布的修正。', url: 'https://doi.org/10.1162/003355302753399535' },
    { title: 'Parker, Schoar & Sun (2023)', scope: 'TDF 机械再平衡、聚合流量与价格动态', reason: '研究 DC 默认载体怎样把生命周期规则传到资产市场。', url: 'https://doi.org/10.1111/jofi.13258' },
    { title: 'Möhlmann (2021)', scope: '德国寿险资产与负债久期估计方法', reason: '学习如何从不完美会计数据重建保险利率风险，并保留模型边界。', url: 'https://doi.org/10.1111/fima.12305' },
    { title: 'Kubitza, Grochola & Gründl (2025)', scope: '退保识别与结构模型反事实分界', reason: '理解利率上升怎样通过保单选择权改变负债久期和出售需求。', url: 'https://doi.org/10.1016/j.jbankfin.2025.107502' },
    { title: 'Becker & Ivashina (2015)', scope: '监管评级类别内的 reach-for-yield 识别', reason: '精确理解何种意义上的“追逐收益”有证据支持。', url: 'https://doi.org/10.1111/jofi.12199' },
    { title: 'Ge & Weisbach (2021)', scope: '天气损失工具变量与保险资产选择', reason: '用强反例修正“受压保险人必然冒险”的单向故事。', url: 'https://doi.org/10.1016/j.jfineco.2021.05.019' },
    { title: 'Ellul, Jotikasthira & Lundblad (2011)', scope: '评级降级、约束、交易与价格反转', reason: '从资本和授权阈值理解公司债火售。', url: 'https://doi.org/10.1016/j.jfineco.2011.03.020' },
    { title: 'Sen (2023)', scope: '监管认可、股票与利率对冲边界', reason: '看到同一经济风险怎样因监管计量进入不同真实交易。', url: 'https://doi.org/10.1093/rfs/hhac083' },
    { title: 'Koijen & Yogo (2015, 2016, 2022)', scope: '资本摩擦、关联再保险与变额年金保证三篇连读', reason: '形成产品定价—资本—风险转移—长期保证的完整保险链。', url: 'https://doi.org/10.1257/aer.20121036' },
    { title: 'Chodorow-Reich, Ghent & Haddad (2021)', scope: '资产价格到保险股权的状态依赖穿透', reason: '理解“稳定资本”是有条件的资产负债表能力。', url: 'https://doi.org/10.1093/rfs/hhaa061' },
    { title: 'BIS (2024) and BIS Papers 161 (2025)', scope: '私人资产、PE 所有权、资产密集型再保险与监督缺口', reason: '用最新跨法域综述更新传统寿险 ALM 图景，但不替代识别论文。', url: 'https://www.bis.org/publ/bppdf/bispap161.htm' },
    { title: 'IAS 19 + IFRS 17', scope: '分别读养老金折现 83–84 段与保险折现 B72–B85', reason: '训练把会计计量目的与经济/监管对冲曲线分开。', url: 'https://www.ifrs.org/issued-standards/list-of-standards/ias-19-employee-benefits/' },
    { title: 'EIOPA Solvency II + NAIC RBC', scope: '技术准备金、SCR/MCR 与美国多级 action levels 对读', reason: '防止把不同法域的“偿付能力比率”当成同一个数字。', url: 'https://www.eiopa.europa.eu/browse/regulation-and-policy/solvency-ii_en' },
    { title: '中国养老与保险制度文件组', scope: '社会保险法、企业/职业年金、个人养老金、C-ROSS II、2025 权益上限及 2019/2026 ALM 规则', reason: '按资产池、主体、规则版本和生效日建立中国市场研究字段，而不是用“长钱入市”替代机制。', url: 'https://www.nfra.gov.cn/cn/view/pages/governmentDetail.html?docId=1268952&itemId=861&generaltype=1' },
  ],
};
