import LongOnlyManagerLab from '../components/LongOnlyManagerLab';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a className="citation-mark" href={`#ref-${n}`} aria-label={`参考文献 ${n}`}>[{n}]</a>;
}

function Lesson203Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>主动 long-only 公募不是“挑出预期收益最高的股票”，而是在持有人授权的可行域内，把研究判断转化为可承担、可监督、可交易的净主动价值。</h2>
        <p>
          假设研究员正确预见某只股票明年涨幅最高，把基金全部投入它仍可能是错误答案。基金经理并不只面对一个收益排序：投资授权（mandate，即法律文件、基金合同与运营规则共同定义的产品边界）规定可以持有什么，long-only 禁止绝对负持仓，单一证券和行业上限限制集中，流动性与申赎要求保留应付现金，基准和风险预算约束偏离，交易成本侵蚀信号，公司治理又要求决策可解释、可复核。最终订单因此不是“观点强度”的直接显示，而是授权、信号、协方差、资金流、组织激励和执行成本共同求解后的结果。
        </p>
        <p>
          本节建立一条完整因果链：最终储蓄者把资金交给法律载体；基金合同把模糊的投资需求翻译成目标与禁区；基准提供共同坐标，但不自动成为唯一目标；研究信号被投影进 long-only、集中度、主动风险和流动性构成的可行域；可见的相对绩效改变申赎、管理规模、收入和问责；投资经理据此形成目标权重，交易台再在市场冲击与等待风险之间拆分母订单；实施差额决定毛观点能留下多少净价值；结果又反过来改变资金流、容量和下一轮风险预算。只有同时看见这条链，才能理解主动管理人为何会买入“并非最看好”的股票、卖出仍然看好的股票，或在基准上涨时取得正收益却仍被认为落后。
        </p>
      </section>

      <section className="lesson-section" id="system-loop">
        <p className="section-kicker">01 · 完整系统</p>
        <h2>管理人位于最终受益人与市场订单之间：前端是授权与代理，后端是组合投影与执行，结果会沿资金流和治理通道反馈。</h2>
        <div className="mechanism-flow">
          <span>持有人需求与负债</span><i>→</i><span>法律载体、合同与 mandate</span><i>→</i><span>基准和风险预算</span><i>→</i><span>研究信号与预期收益</span><i>→</i><span>约束下目标组合</span><i>→</i><span>申赎、现有持仓与母订单</span><i>→</i><span>交易台拆单与实施成本</span><i>→</i><span>净主动收益、风险与披露</span><i>→</i><span>资金流、容量、问责与下一轮预算</span>
        </div>
        <p>
          这条链必须保留三个主体。持有人承担产品层最终盈亏，却通常不逐笔下单；投资管理组织负责研究、组合、风控与监督，但内部并非一个统一大脑；市场最终接收的是交易台在特定时刻提交的订单。把三者合并成“机构买入”，会同时丢失资金为何进入、基金为何改变目标、订单为何此刻执行以及成交后谁承担结果。
        </p>
        <div className="boundary-box"><b>本节解决的问题</b><p>主动 long-only 产品究竟是什么；基准、Tracking Error、Active Share、Information Ratio 与 Sharpe Ratio 分别测量哪一种距离；法律与合同如何形成可行域；绩效、资金流和职业问责怎样改变风险选择；目标组合怎样经过申赎、容量和执行成本变成订单；经验研究能够识别到因果链的哪一步。</p></div>
      </section>

      <section className="lesson-section" id="scope-prerequisite">
        <p className="section-kicker">02 · 范围与先修契约</p>
        <h2>本节研究有裁量权的、以非负绝对持仓为核心边界的集合投资管理；不把所有公募、共同基金或资产管理人都叫作 long-only。</h2>
        <p>
          硬先修是 2.01 的“状态—目标—约束—期望订单—聚合”语言；按需回看 T03 的期望、方差与协方差，1.09 只提供价格冲击，1.20 提供资产负债表约束。跟踪误差（Tracking Error，后文简称 TE）与 Implementation Shortfall（实施差额）都在本节正式建立，前序课程没有替代入口。这里以可赎回的主动股票产品为主要教学对象，但会明确区分美国 mutual fund、美国《1940 年投资公司法》下的注册基金、欧盟可转让证券集合投资计划（UCITS）、中国公开募集证券投资基金和中国股票基金：它们是不同法律或产品轴，均不天然等于主动 long-only。
        </p>
        <p>
          被动指数基金与 ETF 的申赎、授权参与人和套利机制留给 2.04；开放式基金的赎回与流动性错配留给 2.17；基准选择、Tracking Error 的完整治理与绩效归因留给 2.18；从众与职业顾虑如何形成共同持仓留给 6.10。本文只引入足以闭合“授权如何变成订单”的部分，避免一节提前吞掉后续专题。
        </p>
      </section>

      <section className="lesson-section" id="winner-objective">
        <p className="section-kicker">03 · 事后赢家与事前目标</p>
        <h2>“后来涨得最多”是事后结果，不是管理人在不确定性下应当最大化的完整事前目标。</h2>
        <p>
          事前决策面对的是收益分布而不是已经实现的单一路径。某股票可能有最高的条件期望收益，却同时带来更大的估计误差、尾部损失、与现有持仓高度同向的风险、难以交易的容量或违反合同的集中度。即使一年后它成为赢家，也不能反过来证明当初全仓持有最优；这种倒推删除了当时未知的状态和可行集合。
        </p>
        <p>
          管理目标更接近“在被授权的状态下生产净价值”：预期主动收益必须与主动风险、总风险、费用、交易成本、税务、流动性和持有人期限共同比较。不同产品可以把这些量写成不同目标函数，因此“为什么不买最高收益资产”的第一答案不是经理保守，而是问题少写了风险、约束、成本和委托关系。
        </p>
      </section>

      <section className="lesson-section" id="beneficial-owner">
        <p className="section-kicker">04 · 谁承担最终风险</p>
        <h2>基金产品或组合账户是持仓核算与交易层，但其法律人格、名义持有人和执行责任随载体而变；经济损益最终落在份额持有人或受益人。</h2>
        <p>
          公司型基金可能由公司持有资产；契约型共同基金或信托型载体则可能由管理人、受托人或存管机构代表产品行事。它们都可能以集中登记或托管安排持有证券，背后却聚合了期限、税务、流动性需求和风险承受力完全不同的家庭、养老金计划或机构账户。基金经理管理的是产品层组合，不能观察或优化每位持有人的完整资产负债表；持有人则通过申购、赎回、产品选择和治理权利表达需求，通常不控制逐笔交易。2.02 的家庭可能因此既是“散户最终受益人”，又通过基金账户形成机构订单。
        </p>
        <p>
          研究市场冲击时，基金或账户是合适主体；研究福利时，最终受益人和其全部财富才是合适主体。若只看机构账户，就会把家庭经由基金产生的间接风险误写成与家庭无关；若只看家庭，又会错过合同、团队和交易台独立施加的约束。
        </p>
      </section>

      <section className="lesson-section" id="why-delegate">
        <p className="section-kicker">05 · 为什么委托</p>
        <h2>资产管理把研究、组合、交易、托管与合规的固定成本集中起来，却同时制造了所有权与控制权分离。</h2>
        <p>
          最终储蓄者可能缺少时间、数据、交易设施、分散化规模或持续监督能力。集合载体可以摊薄研究和运营成本，提供记账、托管、估值、申赎、公司行动和风险控制，并把大量小额资金转换成可管理的组合。委托的价值因此不只来自“经理更会选股”，也来自组织化的基础设施与治理。
        </p>
        <p>
          代价是持有人不能实时观察研究质量、风险是否有意改变、交易是否最优，甚至无法仅凭实现收益分开技能、运气和市场暴露。管理人还可能关心管理规模、收入、职业声誉或产品存续。委托不是简单把同一效用函数交给专家求解，而是建立一份必须用合同、披露、基准、风控与问责协调的代理关系。基准薪酬理论说明，相对评价怎样改变经理的最优选择，但其结论依合同结构与可交易集合，不是“有基准必然扭曲”的普遍定理。<Cite n={9} />
        </p>
      </section>

      <section className="lesson-section" id="observability-agency">
        <p className="section-kicker">06 · 可观察性与代理</p>
        <h2>净值容易观察，决策质量难以观察；所以基金治理依赖多项不完美的代理变量，而不是一个万能排名。</h2>
        <p>
          持有人可以看到净值、费率、持仓披露和相对业绩，却通常看不到未被采用的研究、风险模型误差、每笔交易的反事实价格或团队讨论。短期收益同时含市场、风格、随机噪声和主动判断；低 Tracking Error 可能来自纪律，也可能来自不敢偏离；高 Active Share 可能代表独立观点，也可能代表无补偿风险。监督只能组合合同一致性、风险、归因、交易成本、人员与流程，而不能把一种结果指标当作潜在努力的无噪声测量。
        </p>
        <div className="boundary-box"><b>代理问题的最小结构</b><p>委托人选择合同和监督规则；管理人选择不可完全观察的研究与风险行动；市场状态和噪声共同生成结果；结果触发资金流、薪酬、问责或终止。若研究只回归“结果对结果”，就无法直接识别中间的管理行动。</p></div>
      </section>

      <section className="lesson-section" id="three-axes">
        <p className="section-kicker">07 · 三条分类轴</p>
        <h2>法律载体、投资策略与管理组织是三条独立轴；把 mutual fund、active 和 long-only 当同义词，会从定义开始出错。</h2>
        <div className="table-scroll" role="region" aria-label="法律载体、投资策略与管理组织三条分类轴，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <thead><tr><th scope="col">分类轴</th><th scope="col">它回答什么</th><th scope="col">例子</th><th scope="col">不能自动推出什么</th></tr></thead>
            <tbody>
              <tr><th scope="row">法律/产品载体</th><td>谁发行、怎样登记、申赎与披露受何规则</td><td>美国开放式基金、UCITS、中国公募</td><td>是否主动、是否只做多、持有什么资产</td></tr>
              <tr><th scope="row">投资策略</th><td>如何形成暴露和相对偏离</td><td>主动选股、指数复制、量化增强</td><td>法律载体、申赎机制或客户类型</td></tr>
              <tr><th scope="row">管理组织</th><td>谁研究、决策、风控和执行</td><td>单经理、团队制、中央研究平台</td><td>最终受益人、合同目标或风险边界</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          同一法律载体可以承载主动或被动策略；同一管理公司可以同时运行 long-only、市场中性和多资产产品；同一“股票基金”也可能使用衍生品进行高效组合管理或风险对冲。严谨表述应分别说明载体、策略、资产范围、绝对与相对约束，而不是用一个标签替代整份产品契约。
        </p>
      </section>

      <section className="lesson-section" id="active-definition">
        <p className="section-kicker">08 · Active 的最小定义</p>
        <h2>主动管理的核心是管理人对持仓、权重、时机或风险暴露拥有裁量权，不是保证跑赢，也不是必须与某个指数大幅不同。</h2>
        <p>
          主动产品可以使用基本面、量化或两者结合，也可以围绕基准做小幅增强。裁量权可能用于选证券、调行业、控制现金、管理久期或决定再平衡速度。实现的主动收益可能为正、为负或恰好为零；“active”描述决策规则，不描述结果质量。一个经理临时与基准高度接近仍可能属于主动策略，而一个按机械规则大幅偏离传统指数的产品也未必存在逐笔裁量。
        </p>
        <p>
          因此主动程度至少要分开三件事：合同是否赋予裁量，实际持仓离比较坐标多远，结果中有多少收益无法被已知风险因子解释。Active Share 只回答第二件事的一种持仓距离；这里的事后模型 alpha 是控制既定风险因子后仍未被解释的超额收益估计，不同于第 40 节送入优化器的事前 alpha（预期主动收益向量），两者都不能反过来定义法律或合同上的主动管理。
        </p>
      </section>

      <section className="lesson-section" id="long-only-definition">
        <p className="section-kicker">09 · Long-only 的最小定义</p>
        <h2>Long-only 约束绝对权重非负；它并不禁止相对基准低配，也不保证产品没有杠杆、衍生品或嵌入式空头风险。</h2>
        <div className="equation-card">
          <span>绝对持仓与主动持仓</span>
          <div>w<sub>i</sub> ≥ 0　；　a<sub>i</sub>=w<sub>i</sub>−b<sub>i</sub></div>
          <p>w 是基金对证券 i 的绝对权重，b 是可比基准权重，a 是主动权重。long-only 要求 w 不小于零；只要基金持有量少于基准，a 就可以为负。例如基准含 10%、基金不持有，该股票绝对权重为 0，却是 −10% 的主动低配。</p>
        </div>
        <p>
          Long-only 在中、美、欧都不是一项统一法定产品类别，行业里通常用它描述主要依靠持有资产上涨获利、不把借券卖空作为核心策略的管理方式。现实权限仍需由合同逐项解释：衍生品可能用于对冲、现金管理或高效复制，证券借贷、可转债和结构化产品会引入不同风险，基金也可能持有现金或非基准资产。这里把 w≥0 用作绝对现货权重的核心教学边界，不据此推断任何司法辖区产品的完整法律权限。
        </p>
      </section>

      <section className="lesson-section" id="legal-map">
        <p className="section-kicker">10 · 法律地图的读法</p>
        <h2>跨市场比较应问“规则把哪一类载体放进什么可行域”，而不是寻找一个全球统一的公募基金定义。</h2>
        <p>
          美国法常围绕注册投资公司及其开放式、封闭式等类别组织；欧盟 UCITS 是跨成员国协调的集合投资框架；中国法以公开募集与非公开募集等制度类别组织产品，并由基金合同进一步规定投资范围、比例和基准。监管文本还会被后续修订、授权法规、监管解释和产品文件共同补充。相同的日常词汇在不同制度中可能对应不同集合。
        </p>
        <p>
          本节只提取与机制直接相关的边界：谁可以公开募集，产品如何描述目标与风险，资产与集中度怎样受限，重大改变需要什么程序。任何具体投资、合规或发行判断都应回到当期正式文本和基金法律文件；以下比较不是跨法域法律意见。
        </p>
      </section>

      <section className="lesson-section" id="us-mutual-fund">
        <p className="section-kicker">11 · 美国 Mutual Fund</p>
        <h2>美国 mutual fund 通常指可持续发行和赎回份额的注册开放式管理投资公司；这个产品形态本身不规定主动或 long-only。</h2>
        <p>
          《1940 年投资公司法》把 open-end company 定义为提供或拥有尚未发行、可赎回证券的一类管理公司，并区分开放式与封闭式等法定类别。<Cite n={4} /> 一只 mutual fund 可以追踪指数，也可以主动选股；可以主要持有股票，也可以投资债券、货币市场工具或多资产。公开文件中的目标、主要策略、风险和费用才把具体产品从法律外壳进一步收缩为可投资集合。SEC 的 Form N-1A 要求注册开放式管理投资公司披露投资目标、费用、主要策略与主要风险，为持有人提供共同的产品说明入口。<Cite n={5} />
        </p>
        <p>
          因而“美国共同基金买入某股票”仍缺少策略标签：它可能是主动判断、指数再平衡、申购现金配置、赎回后的恢复、税务或公司行动。法律形态解释资金如何集合与赎回，不独自识别订单动机。
        </p>
      </section>

      <section className="lesson-section" id="us-1940-act">
        <p className="section-kicker">12 · 1940 Act Fund</p>
        <h2>“1940 Act fund”是比传统 mutual fund 更宽的法律口语集合；把二者完全等同，会漏掉封闭式和其他注册结构。</h2>
        <p>
          美国法定分类包含 face-amount certificate company、unit investment trust 与 management company；管理公司又分为开放式和封闭式。注册声明、法定分类与基本政策还决定哪些改变需要股东批准。<Cite n={4} /> 所以“受 1940 Act 监管”不能推出每日按净值赎回，也不能推出主动选股、股票为主或禁止做空。
        </p>
        <p>
          对市场机制而言，载体差异改变资金流怎样进入订单：可赎回开放式基金要处理投资者现金申赎，封闭式基金份额主要在二级市场交易，ETF 还存在创建赎回篮子。2.03 主要保留第一类现金申赎逻辑，其他载体不应被悄悄塞进同一个流量方程。
        </p>
      </section>

      <section className="lesson-section" id="ucits">
        <p className="section-kicker">13 · UCITS</p>
        <h2>UCITS 是欧盟协调的可转让证券集合投资框架，不是“欧洲主动 long-only 股票基金”的同义词。</h2>
        <p>
          UCITS 指以公众资本集合投资于可转让证券或其他获准流动金融资产、按风险分散原则运作，并应持有人请求回购或赎回份额的计划；指令同时规定合格资产、发行人集中度与成员国实施框架。截至 2026 年 4 月 16 日的官方合并文本仍允许在投资目标与风险限额内使用金融衍生品，第 89 条禁止的是无覆盖卖出（uncovered sales），而非用一句“所有 UCITS 都不得做空”替代完整覆盖与成员国实施规则。<Cite n={6} />
        </p>
        <p>
          欧盟面向零售投资者的打包式投资产品（PRIIP）披露规则第 2(2a) 款要求，采取 UCITS 或另类投资基金（Alternative Investment Fund，AIF）形式的产品在标准化关键信息文件（KID）中说明是否明示或隐含参照基准、管理人的投资裁量，以及隐含参照时相对基准的自由度；若目标是指数跟踪，还必须明确说明。<Cite n={7} /> 这是一项披露规范，不会把参照基准自动变成复制命令或持仓硬限制。分析具体产品时仍需读取章程、关键信息文件、投资政策、风险限额和实际持仓。
        </p>
      </section>

      <section className="lesson-section" id="china-public-fund">
        <p className="section-kicker">14 · 中国公募基金</p>
        <h2>中国“公开募集证券投资基金”首先是募集与监管类别，不自动等于开放式、股票型、主动或 long-only。</h2>
        <p>
          《中华人民共和国证券投资基金法》围绕公开募集基金的注册、基金合同、管理人、托管人、份额持有人和运作建立基本制度，并要求基金合同约定运作方式、投资目标、范围、策略和限制等关键事项。<Cite n={1} /> 公开募集可以承载不同运作方式与资产策略；“公募”说明面向不特定投资者募集及其治理框架，不说明组合一定怎样偏离基准。
        </p>
        <p>
          市场叙述若把“公募加仓”直接解释为主动看多，需要先排除指数产品、申购配置、赎回现金、合同比例恢复、新股与公司行动等机械通道。账户身份只能识别订单来自基金，不能从法律分类读取研究观点。
        </p>
      </section>

      <section className="lesson-section" id="china-equity-fund">
        <p className="section-kicker">15 · 中国股票基金</p>
        <h2>中国股票基金的“股票”是资产比例类别，不是 100% 股票、永不持现或单一主动风格的保证。</h2>
        <p>
          现行《公开募集证券投资基金运作管理办法》第三十条规定，百分之八十以上基金资产投资于股票的，应载明为股票基金；产品合同与其他适用规则还会进一步规定投资范围、比例、运作和风险控制。<Cite n={2} /> 这里的分母是“基金资产”，不能改写成净资产或非现金资产；第三十一条关于基金名称所示方向的 80% 规则使用“非现金基金资产”，是另一项要求。办法还为合同生效后的建仓及非管理人原因造成的比例偏离规定调整窗口，所以 80% 分类不是“100% 股票”或忽略制度时钟的逐秒恒等式。
        </p>
        <p>
          在订单层，股票比例下限、现金与申赎、单一资产约束、停牌和涨跌停共同形成动态可行域。基金可能因净赎回卖出最有流动性的持仓，或因大额申购先买入高流动性基准成分；这些交易即使由主动基金执行，也未必等于研究信号改变。
        </p>
      </section>

      <section className="lesson-section" id="mandate-feasible-set">
        <p className="section-kicker">16 · Mandate 是可行域</p>
        <h2>Mandate 不是一句营销口号，而是把无限可能组合压缩为一组法律上、合同上和运营上可实施的状态。</h2>
        <div className="equation-card">
          <span>从所有组合到产品可行集合</span>
          <div>𝒲<sub>t</sub>={'{'}w: 1ᵀw=1, w≥0, A<sub>t</sub>w≤c<sub>t</sub>, L(w,z<sub>t</sub>)≤ℓ<sub>t</sub>{'}'}</div>
          <p>w 是权重向量；满仓条件 1ᵀw=1 可按产品现金政策调整；w≥0 是教学 long-only 边界；A 与 c 汇总资产类别、单一发行人、行业、地区和衍生品等线性限制；L 表示流动性、容量或其他随状态 z 变化的约束。真实合同不一定都能写成线性式，这个集合只提供统一语言。</p>
        </div>
        <p>
          可行域具有时间性。停牌、额度、现金申赎、价格波动、成分调整和风险模型更新都会让同一目标在今天可行、明天不可行。管理人做的不是从静态证券列表中选一个赢家，而是在不断移动的集合中寻找足以抵偿风险与成本的组合。
        </p>
      </section>

      <section className="lesson-section" id="mandate-change">
        <p className="section-kicker">17 · 合同与治理改变</p>
        <h2>策略改变不是普通调仓的放大版：当变化触及基本政策或基金合同，决策权可能从经理上移到董事会、持有人或监管程序。</h2>
        <p>
          日常权重变化通常位于既有授权内；改变投资目标、基本政策、运作方式或其他重大合同事项，则可能需要特定披露、批准或持有人程序。美国《1940 年投资公司法》对偏离注册声明中的基本政策设置股东批准边界，中国基金法与基金合同制度也把重大事项置于持有人与法定治理框架中。<Cite n={4} /><Cite n={1} />
        </p>
        <p>
          这一区分解释为何一个经理即使相信另一策略更好，也不能把持有人购买的产品悄悄变成它。mandate 是委托人事前选择的风险包络；经理的专业裁量发生在包络之内，不是替持有人重写包络。
        </p>
      </section>

      <section className="lesson-section" id="why-benchmark">
        <p className="section-kicker">18 · 为什么需要基准</p>
        <h2>基准把“市场整体发生了什么”与“管理人选择偏离后发生了什么”分开，为不同主体提供一套可沟通的共同坐标。</h2>
        <p>
          若股票市场普遍上涨 20%，基金上涨 15%，绝对收益为正却相对落后；若市场下跌 20%，基金下跌 12%，持有人仍亏损却取得正主动收益。没有比较坐标，持有人无法判断结果主要来自购买了某类市场风险，还是来自管理人的主动选择。基准因此首先是一种条件比较：在约定的投资宇宙和风险暴露附近，管理人增加或减少了什么。
        </p>
        <p>
          但选择坐标本身就是建模。宽基指数、风格指数、自定义复合基准与同业组分别控制不同的共同变化；任何一个都可能遗漏现金、规模、地区、行业或不可投资成分。Roll 说明即使经理在均值—方差意义上优化，围绕指数控制 Tracking Error 也会把组合推向特定相对坐标，因此基准不是中性的统计装饰。<Cite n={8} />
        </p>
      </section>

      <section className="lesson-section" id="benchmark-roles">
        <p className="section-kicker">19 · 基准的三种有限角色</p>
        <h2>同一基准可以服务于沟通、监督和组合构建，但三种角色不应被悄悄合并。</h2>
        <div className="table-scroll" role="region" aria-label="基准在沟通、监督与组合构建中的角色，可横向滚动" tabIndex={0}>
          <table className="concept-table">
            <thead><tr><th scope="col">角色</th><th scope="col">回答的问题</th><th scope="col">适合的证据</th><th scope="col">主要失效方式</th></tr></thead>
            <tbody>
              <tr><th scope="row">沟通坐标</th><td>持有人购买了哪类市场暴露</td><td>产品目标、投资范围与可投资指数</td><td>标签宽泛或指数不可复制</td></tr>
              <tr><th scope="row">监督坐标</th><td>相对结果和风险是否符合授权</td><td>主动收益、TE、归因和披露</td><td>基准错配让经理承担错误比较</td></tr>
              <tr><th scope="row">构建坐标</th><td>每项超配、低配与风险预算从何出发</td><td>基准权重、协方差与主动约束</td><td>基准成为不可质疑的投资先验</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          一个产品可以用基准沟通，却不把每一项权重都围绕它优化；也可以在组合构建中使用基准，却同时设置绝对损失、流动性或可持续性目标。分析时应逐项询问“这只基准在哪个方程中起作用”，而不是看到宣传页列出指数，就推断合同、薪酬和每笔订单都由它机械决定。
        </p>
      </section>

      <section className="lesson-section" id="benchmark-boundary">
        <p className="section-kicker">20 · 基准不是保证或唯一目标</p>
        <h2>基准不能保证可投资、合适或唯一；相对超额也不能替代持有人面对的绝对损失与费用。</h2>
        <p>
          指数可能含基金不能持有的资产、采用不同税费、忽略交易冲击，或与产品真实风格错位。持有人买到的是扣费后的基金份额，不是无成本指数；管理人即使跑赢错误基准，也未必完成产品承诺。反过来，一只以绝对收益、负债匹配或资本保全为核心的产品，可能只把基准作为补充披露而非优化中心。
        </p>
        <p>
          所以“基准意识”不等于“基准崇拜”。合格治理同时问四件事：基准是否代表可投资机会集，是否与目标和主要风险一致，是否能长期稳定地监督，偏离它是否仍服从持有人的绝对风险与流动性需要。基准只能解决一个坐标问题，不能替持有人完成产品适配。
        </p>
      </section>

      <section className="lesson-section" id="return-decomposition">
        <p className="section-kicker">21 · 总收益与主动收益</p>
        <h2>主动评价的第一步只是一个恒等分解：基金总收益等于基准收益加主动收益；恒等式本身不证明主动收益来自技能。</h2>
        <div className="equation-card">
          <span>单期收益分解</span>
          <div>R<sub>p,t</sub>=R<sub>b,t</sub>+(R<sub>p,t</sub>−R<sub>b,t</sub>)=R<sub>b,t</sub>+AR<sub>t</sub></div>
          <p>Rₚ 是基金总收益，Rᵦ 是同期间同口径基准收益，AR 是主动收益。若基金 8%、基准 10%，主动收益为 −2 个百分点；若基金 −8%、基准 −10%，主动收益为 +2 个百分点。百分点差不是相对百分比变化，多期累计还必须用复利或财富比率，不能把单期差简单相加。</p>
        </div>
        <p>
          AR 仍混合了风格漂移、未建模因子、现金、费用、交易、税务和随机噪声。它是结果的相对坐标，不是 alpha 的同义词。要把主动收益归因于研究能力，必须说明基准、因子模型、费用、样本外持续性与反事实。
        </p>
      </section>

      <section className="lesson-section" id="active-weights">
        <p className="section-kicker">22 · 主动权重</p>
        <h2>主动权重把组合从“持有什么”改写成“相对共同坐标多持或少持什么”，是连接观点与相对风险的最小变量。</h2>
        <div className="equation-card">
          <span>权重分解与资金守恒</span>
          <div>a=w−b　；　w=b+a　；　1ᵀa=0</div>
          <p>在基金与基准使用同一资产宇宙、都归一到 100% 且不另列现金时，主动权重之和为零：每一份超配都必须由其他证券的低配融资。若基金含现金、基准不含现金，或两边资产宇宙和净敞口不同，必须先补齐共同分类再使用这条等式。</p>
        </div>
        <p>
          研究信号通常先作用于 a 而非 w：管理人不是从空白资产负债表重新选择所有证券，而是在现有组合与基准附近重新分配风险预算。也正因为超配必须由低配融资，“不买”某成分本身就是主动决策，即使 long-only 基金从未建立绝对空头。
        </p>
      </section>

      <section className="lesson-section" id="long-only-underweight">
        <p className="section-kicker">23 · Long-only 的相对空头</p>
        <h2>基准持有而基金不持有，是经济上的相对空头，却不是法律或交易意义上的卖空；两个概念必须同时保留。</h2>
        <p>
          若基准权重 bᵢ=8%、基金 wᵢ=0，主动权重 aᵢ=−8%。股票上涨时，这个低配会拖累主动收益，经济效果像相对坐标中的空头；但基金没有借券、没有负股数，绝对最大损失也不包含传统空头的无限上行风险。称它为“相对空头”有助于理解绩效，称它为“卖空”则会混淆交易权限和资产负债表。
        </p>
        <p>
          long-only 还产生不对称：一项权重最低只能从 bᵢ 降到零，超配上限却由集中度、风险和流动性决定。对低基准权重股票，经理能表达的负观点很小；对高基准权重股票，即使极度悲观也只能归零。这种边界会改变信号向组合的映射，并可能把剩余风险转移到相关证券或行业层。
        </p>
      </section>

      <section className="lesson-section" id="realized-te">
        <p className="section-kicker">24 · 事后 Tracking Error</p>
        <h2>事后 Tracking Error 是已实现主动收益的样本波动，不是平均落后幅度，也不是未来偏离的保证上限。</h2>
        <div className="equation-card">
          <span>等间隔主动收益的样本年化波动</span>
          <div>TE<sub>realized</sub>=√m · √[Σ<sub>t=1</sub><sup>T</sup>(AR<sub>t</sub>−ĀR)²/(T−1)]</div>
          <p>ARₜ 是每期基金减基准收益，ĀR 是样本平均，T 是观测期数，m 是一年中的同类期数，例如月频常用 12。公式要求频率、收益定义和年化规则一致；重叠窗口、自相关、缺失值和非等间隔数据需要另行处理。平均主动收益为 −2% 并不等于 TE 为 2%，因为一个测均值，一个测离散。</p>
        </div>
        <p>
          Roll 以均值—方差框架展示：围绕一个给定基准优化 Tracking Error，与优化基金总收益的均值—方差效率不是同一个问题。<Cite n={8} /> 事后 TE 只总结发生过的路径；用短样本估计时，它对极端月份、基准错配和估计窗口都敏感。
        </p>
      </section>

      <section className="lesson-section" id="ex-ante-active-risk">
        <p className="section-kicker">25 · 事前主动风险</p>
        <h2>事前主动风险把主动权重送入协方差模型，估计未来相对收益可能怎样波动；它是模型输出，不是可观测事实。</h2>
        <div className="equation-card">
          <span>协方差加权的相对风险距离</span>
          <div>TE<sub>ex ante</sub>=√[(w−b)ᵀΣ(w−b)]=√(aᵀΣa)</div>
          <p>Σ 是与权重和持有期相匹配的收益协方差矩阵。两组组合即使 Active Share 相同，只要偏离落在不同波动率、相关性或因子方向上，事前 TE 就会不同。模型通常还把证券风险分成系统因子与特质风险，但分解方式依模型而变。</p>
        </div>
        <p>
          事前与事后 TE 不是谁替代谁。前者用于下单前预算，错误来源是协方差、暴露和制度状态估计；后者用于下单后核验，错误来源是有限样本和实现路径。若两者持续偏离，可能是模型失准、组合变化、波动状态改变或收益口径不一致，不应先归因于经理违规。
        </p>
      </section>

      <section className="lesson-section" id="total-active-risk">
        <p className="section-kicker">26 · 总风险与主动风险</p>
        <h2>总风险度量基金净值本身的波动，主动风险度量相对基准的波动；贴近高风险基准可以让后者很低而前者很高。</h2>
        <div className="equation-card">
          <span>同一协方差下的两种风险</span>
          <div>σ<sub>p</sub>=√(wᵀΣw)　；　σ<sub>active</sub>=√[(w−b)ᵀΣ(w−b)]</div>
          <div>Var(R<sub>p</sub>)=Var(R<sub>b</sub>)+Var(R<sub>p</sub>−R<sub>b</sub>)+2Cov(R<sub>b</sub>,R<sub>p</sub>−R<sub>b</sub>)</div>
          <p>若 w=b，主动风险为零，但基金总风险等于基准风险而非零。若基金大幅偏离低波动基准，主动风险可能明显上升，总风险却未必同比上升。持有人财富损失与适配更关心总风险和尾部；经理相对授权与归因更关心主动风险。</p>
        </div>
        <p>
          方差恒等式进一步说明，TE 上升并不机械推出总波动上升：主动收益与基准收益的协方差可以为正、为负或随状态改变。这也是绩效讨论的基本防错器。称一只低 TE 股票基金“低风险”，可能只意味着它不会明显偏离股票市场；称一只绝对波动较低的防御组合“高风险”，可能只是它偏离高波动基准较多。必须为“风险”补上坐标与期限。
        </p>
      </section>

      <section className="lesson-section" id="risk-budget">
        <p className="section-kicker">27 · 风险预算不是结果</p>
        <h2>风险预算是事前允许使用的资源与治理边界；实现 TE 是事后路径，两者之间隔着模型误差、交易和市场状态。</h2>
        <p>
          当产品说“目标主动风险 4%”时，它可能指长期模型目标、内部正常区间或硬上限，三者治理含义不同。经理可以把预算分配给行业、风格、个股和时机，但预算未使用不等于浪费，全部用满也不等于更有主动性。没有足够预期补偿时保留风险容量可能更优。
        </p>
        <p>
          组合下单后，权重漂移、波动突变、相关性上升和申赎都能把事后结果推离事前预测。审计应保存每个决策时点的模型、权重和限额，区分“当时在预算内、后来波动上升”与“当时已经越限”。用今天的协方差重算过去组合，会造成前视治理判断。
        </p>
      </section>

      <section className="lesson-section" id="ir-sharpe">
        <p className="section-kicker">28 · Information Ratio 与 Sharpe Ratio</p>
        <h2>Information Ratio 评价每单位主动风险对应的主动收益；Sharpe Ratio 评价每单位总风险对应的超无风险收益，分子与分母都不同。</h2>
        <div className="equation-card">
          <span>两个常被混用的风险调整比率</span>
          <div>IR=E[R<sub>p</sub>−R<sub>b</sub>] / σ(R<sub>p</sub>−R<sub>b</sub>)　；　SR=E[R<sub>p</sub>−R<sub>f</sub>] / σ(R<sub>p</sub>−R<sub>f</sub>)</div>
          <p>IR 的零点是基准，分母通常称主动风险或 TE；Sharpe 的零点是无风险资产，分母是基金超额收益的总波动。标准样本估计使用等频算术平均超额收益除以相应样本标准差；几何均值版本必须另行命名，不能当成可互换口径。按 √m 年化还要求频率一致且序列相关可以忽略。费用前后、样本窗口和无风险利率也须固定；分母接近零时比率会不稳定，负分子时排序尤其要谨慎。</p>
        </div>
        <p>
          Sharpe 对其同名比率的适用、时间依赖和外推限制有专门讨论；一个样本比率并不是未来能力常数。<Cite n={26} /> 对主动管理而言，高 IR 可能来自稳定小幅超额，低 Sharpe 仍可能因为基准本身风险很高；反之亦然。先选择评价问题，再选择比率。
        </p>
      </section>

      <section className="lesson-section" id="active-share">
        <p className="section-kicker">29 · Active Share</p>
        <h2>Active Share 用持仓绝对偏离回答“组合与基准在权重空间有多不同”，不读取协方差、收益或交易动机。</h2>
        <div className="equation-card">
          <span>归一化 long-only 组合的持仓距离</span>
          <div>Active Share=½Σ<sub>i</sub>|w<sub>i</sub>−b<sub>i</sub>|</div>
          <p>当基金与基准都在同一完整宇宙内以非负权重归一到 100% 时，Active Share 通常在 0 与 1 之间：0 表示持仓完全相同，1 表示没有重叠。二分之一避免同时计算超配与低配造成的重复。现金、衍生品、净空头、缺失证券或不同归一规则会改变范围与解释，必须先声明映射。</p>
        </div>
        <p>
          Cremers 与 Petajisto 用 Active Share 与 Tracking Error 两个维度区分主动持仓类型，并在历史美国样本研究绩效。<Cite n={11} /> 这项指标的贡献是增加一条持仓坐标，不是证明“越高越好”。高偏离会放大经理选择正确与错误的两端，也可能来自基准不合适或资产集中。
        </p>
      </section>

      <section className="lesson-section" id="active-share-versus-te">
        <p className="section-kicker">30 · Active Share 不等于 TE</p>
        <h2>Active Share 看偏离了多少权重，Tracking Error 看这些偏离落在哪些共同风险方向；同一组合需要同时观察两种距离。</h2>
        <p>
          超配一只高波动科技股、低配另一只高度相关科技股，可以产生较高 Active Share 却因风险抵销而 TE 较低；小幅同时倾斜多个同方向因子，可以 Active Share 不高却产生显著 TE。前者是 L1 持仓距离，后者是协方差加权的二次距离，没有单调一一对应。
        </p>
        <p>
          指标组合的意义是诊断而非贴标签：低—低可能接近指数，高 Active Share—低 TE 可能是配对式证券选择，低 Active Share—高 TE 可能是集中因子倾斜，高—高则代表持仓与风险都显著偏离。任何象限都需要结合产品授权、费用、容量和实际归因，不能直接排序技能。
        </p>
      </section>

      <section className="lesson-section" id="benchmark-mismatch">
        <p className="section-kicker">31 · 基准错配</p>
        <h2>如果比较坐标错了，主动收益、TE、Active Share 和经理问责会同时被污染；漂亮精度不能修复错误目标。</h2>
        <p>
          Sensoy 先用 Morningstar 持仓风格箱确定候选修正基准，再要求该指数与基金收益的相关性高于自报基准；他在 1994–2004 年美国股票基金样本中记录了显著错配，并研究其与未来资金流及绩效评价的关系。论文初始样本为 1,981 只基金，进入 12 个 S&amp;P/Russell 指数比较的分析子集为 1,815 只，其中 31.2% 同时通过论文定义的“风格更匹配且收益相关性更高”检验；这些是论文算法和旧时期样本，不是违法率、当前比例或错配的因果效应。<Cite n={12} />
        </p>
        <p>
          正确做法不是总用拟合度最高的指数。收益拟合可能把经理主动风格漂移吸收到“更合适基准”，反而豁免应被监督的变化。基准选择应先由投资目标、可投资宇宙和事前规则约束，再用持仓、收益与稳定性核验；不能用结果后选坐标来美化结果。
        </p>
      </section>

      <section className="lesson-section" id="performance-to-flows">
        <p className="section-kicker">32 · 可见绩效到资金流</p>
        <h2>相对绩效首先改变的是持有人对产品质量的更新与分配选择，随后才通过净申赎进入管理规模、收入和市场订单。</h2>
        <p>
          投资者无法直接观察技能，往往把历史收益、相对排名、评级、品牌、费用与服务作为信号。表现改善可能引发申购，表现恶化可能引发赎回；但基金回报本身还会机械改变资产管理规模（assets under management，AUM），所以经验研究必须把资产升值与外部净流量分开。Berk 与 Green 建立理性学习与递减规模收益模型：投资者向表现好的经理流入，容量增加又压低未来超额，使平均净 alpha 不必持续为正。<Cite n={13} />
        </p>
        <p>
          资金流不是持有人“奖励过去”的单向故事。税务、养老金渠道、转换成本、平台推荐、基金关闭申购和家庭流动性冲击都能改变反应。管理人面对的不是一个固定弹性，而是一组随渠道、产品年龄、客户类型和市场状态变化的申赎函数。
        </p>
      </section>

      <section className="lesson-section" id="flow-convexity-evidence">
        <p className="section-kicker">33 · 历史资金流凸性证据</p>
        <h2>经典美国样本显示资金流对好排名的反应曾明显强于对差排名的惩罚；这会制造期权式激励，但不是跨时代固定曲线。</h2>
        <p>
          Sirri 与 Tufano 研究 1971–1990 年 690 只美国开放式股票基金，发现消费者对高绩效基金的流入反应更强，并强调搜索成本与营销；主样本存在存续选择，论文另用 1987–1990 年消失的 58 只基金作补充检验。<Cite n={16} /> Chevalier 与 Ellison 在 1982–1992 年美国 growth 和 growth-and-income 基金样本中，把非线性资金流—业绩关系连接到管理人年内风险选择。<Cite n={14} />
        </p>
        <p>
          这些结果支持一个机制可能性：上行排名带来的规模收益若强于下行流出，管理公司对波动的组织价值可能呈凸性。但费率、渠道、退休平台、基金关闭、现代被动竞争与监管均会改变曲线；观察到风险变化也可能来自资金流、持仓漂移或经理选择。教学实验只能说明凸函数如何改变激励，不能把历史回归系数当作当前任一基金的行为规则。
        </p>
      </section>

      <section className="lesson-section" id="client-heterogeneity">
        <p className="section-kicker">34 · 客户异质性</p>
        <h2>共同基金与养老金账户对同一绩效信号可能作出不同资金流反应，因为委托期限、搜索、治理与终止程序不同。</h2>
        <p>
          Del Guercio 与 Tkac 比较 1987–1994 年美国养老金产品和共同基金：最终发表版样本含 562 个养老金产品、2,461 个经理—年，以及 483 个共同基金经理、2,677 个经理—年，发现两类客户的流量—绩效关系不同。作者同时说明生存与回填等数据限制；机构类别不是随机分配，结果不能被读成制度形态的纯因果效应。<Cite n={17} />
        </p>
        <p>
          机制上，零售共同基金持有人可以较分散地申赎，养老金委托通常有正式审查、顾问、负债与终止流程；同一位经理面对的评估窗口、可见指标和资产流惯性因此不同。讨论“资金流纪律”时必须指定客户群，不能用一条共同基金曲线替代全部资产管理。
        </p>
      </section>

      <section className="lesson-section" id="aum-capacity-orders">
        <p className="section-kicker">35 · AUM、费用、容量与订单</p>
        <h2>净流入同时扩大收费基数和必须配置的资本；规模价值与实施难度沿同一条资产管理规模（AUM）通道向相反方向移动。</h2>
        <div className="equation-card">
          <span>从期末规模反推外部净流量率</span>
          <div>flow<sub>t+1</sub>=[AUM<sub>t+1</sub>−AUM<sub>t</sub>(1+R<sub>p,t+1</sub>)]/AUM<sub>t</sub></div>
          <p>这里的 flow 是外部净申赎金额相对期初 AUM 的比例，Rₚ 必须与 AUM 使用一致的含分配总回报口径；若分配未再投资或收益口径不含分配，就要单独调整，不能无条件再扣一次。净值收益机械改变规模，外部净流量另行改变规模。管理费通常与 AUM 相关，但净收入还取决于费率阶梯、渠道分成、成本和减免；不能把每一元 AUM 等同一元组织利润。</p>
        </div>
        <p>
          当信号容量有限，大额流入会迫使基金降低单个高确信仓位比例、进入次优标的、提高现金或承担更高冲击；大额赎回又可能要求卖出流动资产并改变剩余组合。Berk—Green 模型把这种递减规模收益放进均衡。<Cite n={13} /> AUM 因此不是绩效的被动结果，而是下一轮可行域和订单规模的状态变量。
        </p>
      </section>

      <section className="lesson-section" id="career-organization">
        <p className="section-kicker">36 · 职业与组织问责</p>
        <h2>经理不仅面对持有人风险，也面对可被组织评价的职业风险；但“怕落后”可能造成贴近同业，也可能在特定状态下造成加大主动风险。</h2>
        <p>
          Chevalier 与 Ellison 研究 1992–1994 年美国共同基金经理，发现较年轻经理的终止与表现关系更敏感，且其组合更趋常规；这是特定历史样本中的观察关系，不是当前全球经理从众的随机因果证明。<Cite n={15} /> 组织可能用短期排名、风格一致、回撤、合规、团队流程和客户沟通共同评价经理，不同指标把“安全”定义成不同方向。
        </p>
        <p>
          当偏离同业失败最容易被归责时，职业顾虑可能压缩独立仓位；当产品落后且上行资金流凸、下行有限时，经理又可能提高主动风险争取翻盘。两种反应看似矛盾，实际取决于考核窗口、终止概率、产品存续、既有排名和风险限额。职业风险不是固定偏好参数，而是随状态改变的组织约束。
        </p>
      </section>

      <section className="lesson-section" id="risk-shifting-boundary">
        <p className="section-kicker">37 · 风险调整不是单向定律</p>
        <h2>落后者未必总会增加总波动，领先者也未必总会锁定收益；激励作用于哪一种风险坐标必须由模型和数据共同识别。</h2>
        <p>
          Basak、Pavlova 与 Shapiro 建立基准化薪酬下的动态配置模型，并用 1970–1998 年美国主动股票基金数据检验：约 111,810 个基金—月 Tracking Error 观测与约 187 万个基金—日市场 beta（基金收益对市场共同波动的敏感度）观测支持相对落后状态与某些主动风险调整的关系，但总波动提高并不稳健。<Cite n={18} /> 这正说明“提高 TE”“提高 beta”“提高总波动”和“买更彩票型股票”不是同一句话。
        </p>
        <p>
          经验研究应先固定被解释风险：持仓 Active Share、事前 TE、实现 TE、市场 beta、总波动、下行风险或尾部损失。若只看到一个指标上升，不能扩写为经理“整体更冒险”；若总风险不变，也不能否认相对风险在内部重排。
        </p>
      </section>

      <section className="lesson-section" id="regulation-internal-control">
        <p className="section-kicker">38 · 外部监管与内部控制</p>
        <h2>监管设定公共底线，基金合同定义持有人购买的产品，管理公司再用更细的内部限额管理模型和声誉；三层不能互相替代。</h2>
        <p>
          法律规则可能约束合格资产、集中度、披露、估值、流动性和利益冲突；基金合同进一步缩窄策略与风险；内部风控可以设置事前阻断、软预警、压力测试、交易对手和流动性限额。一个组合合法不等于符合合同，符合合同不等于通过内部风险偏好，通过内部限额也不保证经济上最优。
        </p>
        <p>
          订单审计需要保存约束的来源与强度：hard limit 会拒绝交易，soft limit 可能允许有理由的例外，目标区间只用于正常管理。把三者都写成“监管要求”，会错判谁拥有修改权、越限意味着什么以及冲击发生后谁应负责。
        </p>
      </section>

      <section className="lesson-section" id="china-benchmark-rules">
        <p className="section-kicker">39 · 中国 2026 基准治理时钟</p>
        <h2>中国公募业绩比较基准规则已进入分阶段实施；截至 2026 年 8 月 29 日，不能把未来条款写成已经生效，也不能把基准写成收益承诺。</h2>
        <p>
          证监会《公开募集证券投资基金业绩比较基准指引》（证监会公告〔2026〕3 号）整体自 2026 年 3 月 1 日施行，要求基准与基金投资目标、范围、策略和风险收益特征相匹配，并围绕选取、披露、变更、监测与问责建立治理。<Cite n={3} /> 截至本节核验日，第二阶段的第十五条第二、三款将在 2026 年 9 月 1 日施行，尚未生效；第八条第四款、第九条、第十六条第一款和第十七条将在 2027 年 3 月 1 日施行。时间错一日，就会把合规未来式写成现在式。
        </p>
        <p>
          规则强化基准作为产品定义和监督坐标的作用，却不把相对表现变成保本或超额收益保证，也不意味着经理只能最小化 Tracking Error。分析中国基金订单时，应同时读取指引、基金合同、招募说明书、实际策略和当期生效条款；只凭产品名称或网页基准字段不足以重建可行域。
        </p>
      </section>

      <section className="lesson-section" id="signal-corner">
        <p className="section-kicker">40 · 信号为何产生角点</p>
        <h2>如果目标只有线性预期收益、又没有风险与集中约束，优化器会把全部资本推向最高 alpha；这不是主动管理的理想，而是问题遗漏了关键结构。</h2>
        <div className="equation-card">
          <span>被故意写坏的组合问题</span>
          <div>max<sub>w</sub> αᵀw　s.t.　1ᵀw=1, w≥0</div>
          <p>这里的事前 alpha（α）是每只证券的预期收益或预期主动收益，不是第 8 节的事后模型估计。在目标线性、权重非负且合计为 1 的可行域中，最优解通常落在角点：全部权重给 α 最高的证券；若最高值并列，角点之间的组合都可能最优。这个结果不说明集中投资普遍正确，只说明方程没有惩罚协方差、估计误差、流动性或成本。</p>
        </div>
        <p>
          现实 alpha 不是已知常数。它由有限数据、研究判断和模型生成，会衰减、相关并带误差。把点估计直接送进角点优化，会让极小的排名误差造成极大的权重跳变。风险、稳健性和成本项不是为了让经理显得保守，而是把不确定的信号映射为连续、可承受的资本承诺。
        </p>
      </section>

      <section className="lesson-section" id="constrained-optimization">
        <p className="section-kicker">41 · 约束下组合优化</p>
        <h2>管理人真正求解的是“预期主动价值减风险与换仓成本”，再把解投影进 mandate；每一项都代表一条可审计机制。</h2>
        <div className="equation-card">
          <span>教学版主动组合问题</span>
          <div>max<sub>a</sub> αᵀa − (λ/2)aᵀΣa − TC(a−a<sub>0</sub>)</div>
          <div>s.t.　1ᵀa=0,　b+a≥0,　A(b+a)≤c</div>
          <p>αᵀa 是预期主动收益；λ 表示对主动风险的惩罚；Σ 把主动权重变为 TE；TC 对从当前主动权重 a₀ 迁移到新组合的交易成本和换手收费；权重守恒、long-only 与其他合同限制定义可行域。若产品没有基准中心，应改用绝对权重、总风险和自身目标，不能硬套主动权重方程。</p>
        </div>
        <p>
          拉格朗日乘子可以解释约束的“影子价格”：某上限若绑定，轻微放宽它能增加多少模型目标值。但乘子只在当前信号、模型和局部条件下成立，不等于监管规则的社会成本。Grinold 的原始基本定律把预测质量（information coefficient）和近似独立的机会数量（breadth）连接到理想信息比率；Clarke、de Silva 与 Thorley 才进一步用 transfer coefficient 描述约束下信号向组合的传递效率。<Cite n={27} /><Cite n={10} /> 两者都依模型假设，不能把一次估计的传递系数当成长期技能常数。
        </p>
      </section>

      <section className="lesson-section" id="constraints-regularization">
        <p className="section-kicker">42 · 约束的两面</p>
        <h2>约束会丢失真实信号，却也可能抑制估计误差；判断其价值必须分开“已知参数世界”与“参数需要估计的世界”。</h2>
        <p>
          若 alpha 与协方差完全已知，额外约束通常只缩小可行域，不可能改善同一个目标函数的最优值；它会把组合从理论最优点推开。这是约束的机会成本。现实中参数却由噪声估计，尤其协方差矩阵的极端方向可能引导不稳定权重；某些约束能像收缩或正则化一样阻止优化器追逐估计误差，从样本外看反而降低实现风险。
        </p>
        <p>
          Jagannathan 与 Ma 每年 4 月从 1968 至 1998 年形成美国大盘股票的滚动最小方差组合，用此前 60 个月估计协方差并持有随后一年，样本外实现期延伸至 1999 年 4 月。实验展示：对权重设置上限或禁止卖空，在协方差估计误差存在时可以改善样本外风险，本质上相当于对协方差估计作调整。<Cite n={25} /> 这不是“约束总能提高 alpha”或“监管限额天然最优”；结论属于最小方差、特定股票宇宙与历史样本。正确诊断应比较信号损失、估计稳健性、交易成本和合同价值四条通道。
        </p>
      </section>

      <section className="lesson-section" id="gross-to-net">
        <p className="section-kicker">43 · 从毛主动收益到净主动价值</p>
        <h2>研究判断只有在费用、交易、现金拖累与容量之后仍保留补偿，才成为持有人可获得的净主动价值。</h2>
        <div className="equation-card">
          <span>主动价值的实施瀑布</span>
          <div>Net Active Return ≈ Gross Active Portfolio Return − Trading Costs − Fees − Financing/Tax Drag − Residual Frictions</div>
          <p>Gross Active Portfolio Return 是费用和实施摩擦前的组合主动收益，可再按一致归因体系分成证券选择、资产或行业配置、时机、现金与交互项；证券选择只是其中一种来源。这是会计式诊断，不假设各项彼此独立。交易成本会随信号和流量内生变化；费用口径可能在净值中已经扣除；税务由载体与持有人共同决定；使用时必须防止遗漏和重复扣减。</p>
        </div>
        <p>
          Wermers 用 1975–1994 年美国共同基金持仓和收益数据分解股票选择、费用与交易成本，发现基金持有股票的毛表现与投资者获得的净基金回报之间存在实质差距。<Cite n={19} /> 研究的历史结果不能直接当成当前费后 alpha 数值，却提供了稳定的分析顺序：先问持仓产生了什么毛贡献，再问组织与实施拿走多少，最后才评价持有人结果。
        </p>
      </section>

      <section className="lesson-section" id="target-to-parent-order">
        <p className="section-kicker">44 · 目标权重到母订单</p>
        <h2>目标权重不是订单；订单是申赎后的目标金额减去现有和在途持仓，再经过现金、价格、整手与可交易性投影。</h2>
        <div className="equation-card">
          <span>教学版期望母订单</span>
          <div>q<sub>i</sub><sup>desired</sup>=[AUM<sub>post-flow</sub>w<sub>i</sub><sup>*</sup>−V<sub>i,current</sub>−ΔV<sub>i,pending</sub>]/P<sub>i</sub></div>
          <p>w* 是交易后目标权重，AUM_post-flow 包含已确认、按题设时钟可用的净申赎，V_current 是现有市值；ΔV_pending 是在途订单预计带来的有符号持仓变化，买入为正、卖出为负，所以减去待完成买单、减去负的待完成卖单。P 是用于换算数量的决策价格。正 q 表示仍需买入、负 q 表示仍需卖出；随后还要处理现金缓冲、费用、整手、停牌、涨跌停与容量。</p>
        </div>
        <p>
          同一目标权重在流入与流出状态下可以产生不同订单；同一研究信号在现有持仓已经超配时也可能产生卖单。若研究者只看基金最终权重变化，价格重估、申赎、公司行动与主动交易还会观察等价。把目标、订单和成交分开，是从资产管理接回市场微观结构的关键接口。
        </p>
      </section>

      <section className="lesson-section" id="manager-versus-desk">
        <p className="section-kicker">45 · 投资经理与交易台</p>
        <h2>投资经理决定“希望拥有多少风险”，交易台决定“在何时、何地、用什么订单把差额变成成交”；两者共享目标但拥有不同局部信息。</h2>
        <p>
          经理通常掌握研究信号、组合替代关系、风险预算与信号衰减；交易员更接近盘口深度、对手盘、日内流动性、场所、成交概率和信息泄露。经理给出的母订单需要附带紧迫度、价格边界、完成期限和可替代证券，而不是只给数量；交易台的执行反馈又可能让经理调整目标。把交易员当机械按钮，会丢失订单怎样适应市场状态。
        </p>
        <p>
          治理上还要区分执行裁量与投资裁量。交易员可以因深度推迟或拆分订单，却不应无授权改变组合方向；经理可以改变目标，却不能事后把不利价格全部归为执行失败。最小审计链应保存 decision time、目标数量、到达价格、执行计划、成交、未完成量与取消原因。
        </p>
      </section>

      <section className="lesson-section" id="implementation-shortfall">
        <p className="section-kicker">46 · Implementation Shortfall</p>
        <h2>实施差额比较“决定交易时的纸面组合”与“实际成交后的财富”，把延迟、冲击、费用和未完成机会成本放进同一方向一致的账户。</h2>
        <div className="equation-card">
          <span>包含未完成数量的方向一致实施差额</span>
          <div>IS<sub>$</sub>=s[Σ<sub>k</sub>q<sub>k</sub>(P<sub>k</sub>−P<sub>0</sub>)+Q<sub>u</sub>(P<sub>T</sub>−P<sub>0</sub>)]+fees</div>
          <p>s 对买入取 +1、卖出取 −1；qₖ 和 Pₖ 是第 k 笔成交数量与价格，Qᵤ 是评估终点仍未完成的数量，P₀ 是投资决定形成时的 decision price，P_T 是同一终点价格，且 Σqₖ+Qᵤ 等于原母订单数量。正值表示成本。若改用订单到达交易台时的 arrival price，就会把 decision-to-arrival 的延迟成本排除在这个式子之外，必须另行报告。</p>
        </div>
        <p>
          Perold 提出 implementation shortfall，是为了避免只评价已成交部分而忽略未成交订单的机会成本。<Cite n={21} /> 对买单，成交价高于决策价通常是成本；订单未完成而价格上涨，也产生未完成成本；价格下跌则可能形成有利差额。对卖单符号相反。任何汇总都必须固定基准价格、方向、数量和评估终点，否则“节省了冲击”可能只是没有完成最需要完成的交易。
        </p>
        <p>
          Keim 与 Madhavan 分析 1991 年 1 月至 1993 年 3 月 21 家机构的 62,333 笔订单、约 830 亿美元交易，显示成本随交易风格、订单特征和市场条件变化。<Cite n={20} /> 这是早期、选择性机构样本，不是当前执行成本表；它支持的是状态依赖，而非固定基点。执行质量评价必须按订单规模、方向、紧迫度、流动性和信息条件分层。
        </p>
      </section>

      <section className="lesson-section" id="impact-waiting">
        <p className="section-kicker">47 · 冲击—等待前沿</p>
        <h2>快速执行减少等待和 alpha 衰减，却集中消耗流动性；慢速执行降低即时冲击，却暴露于价格漂移、未完成和信息泄露。</h2>
        <div className="equation-card">
          <span>教学版执行权衡</span>
          <div>Objective(T)=E[Impact(T)+Fees(T)]+λ·RiskMeasure(T)</div>
          <p>T 是执行期限，RiskMeasure 可用实施差额的标准差或其他价格风险量度，λ 把一单位风险换算成与期望冲击相同的金额或基点效用成本。典型教学设定让期望 Impact 随 T 延长下降，让风险项随 T 延长上升，于是内部可能出现最优期限；真实函数还依订单方向、参与率、波动、盘口恢复、信号半衰期和其他主体反应。</p>
        </div>
        <p>
          Almgren 与 Chriss 在价格不确定性与临时/永久冲击的设定下形式化了最优执行前沿，展示风险厌恶怎样改变交易轨迹。<Cite n={22} /> 模型不是声称现实冲击恒定或线性，而是提供一个可审计问题：多等一分钟节省的预期冲击，是否足以补偿新增风险与机会成本。互动实验用确定成本函数训练这项权衡，不把数字当成市场校准。
        </p>
      </section>

      <section className="lesson-section" id="flow-induced-trading">
        <p className="section-kicker">48 · 资金流诱发交易</p>
        <h2>申赎可以在研究观点不变时制造同向订单；这些订单影响价格后，又会污染下一轮绩效与资金流信号。</h2>
        <p>
          Coval 与 Stafford 用 1980–2004 年美国开放式基金数据研究极端资金流引发的资产抛售与购入，发现受压力持仓出现价格压力与后续反转；设计是观察性的，不能把所有共同交易都归因于强迫流量。<Cite n={23} /> Lou 进一步在 1980–2006 年美国主动股票基金上构造基于基金流量和持仓的交易代理，研究流量如何帮助解释收益可预测性。<Cite n={24} /> 代理仍依持仓披露、比例配置假设与识别窗口。
        </p>
        <div className="mechanism-flow">
          <span>相对绩效或外部现金冲击</span><i>→</i><span>申购/赎回</span><i>→</i><span>按持仓或流动性配置订单</span><i>→</i><span>价格压力与实施成本</span><i>→</i><span>基金和其他持有人的实现收益</span><i>→</i><span>下一轮排名、流量和约束</span>
        </div>
        <p>
          反馈的强弱取决于基金是否持有相同证券、是否按比例交易、做市与套利资本、披露时滞和流量持续性。看到基金共同卖出只证明共同行为；识别资金流压力，需要冲击前申赎、持仓、可替代流动性和流量停止后的价格恢复。
        </p>
      </section>

      <section className="lesson-section" id="research-protocol">
        <p className="section-kicker">49 · 机构研究协议</p>
        <h2>研究主动管理人不能从一张持仓表直接读取“信念”，而要依次冻结产品、状态、目标、约束、订单和结果。</h2>
        <div className="check-grid">
          <details><summary>01 · 固定法律与产品类别</summary><p>声明是开放式基金、ETF、UCITS、中国公募或养老金委托；再写主动/被动、资产范围、long-only 与衍生品权限，不用一个标签替代三条轴。</p></details>
          <details><summary>02 · 冻结事前 mandate</summary><p>保存当时生效的合同、基准、风险上限、集中度、流动性与内部软硬限额；不要用后来修订的规则审判过去决策。</p></details>
          <details><summary>03 · 分开总量与相对量</summary><p>总收益、主动收益、总波动、TE、Active Share、alpha 与资金流分别定义；频率、年化、费用和基准口径保持一致。</p></details>
          <details><summary>04 · 保存冲击前状态</summary><p>记录 AUM、确认申赎、现金、现有与在途持仓、价格、风险模型、信号和容量，防止从成交后结果反推经理意图。</p></details>
          <details><summary>05 · 追踪决策到订单</summary><p>区分研究建议、目标权重、母订单、子订单、成交和未完成量；价格重估与公司行动不应被误记为主动交易。</p></details>
          <details><summary>06 · 分解实施差额</summary><p>统一 decision price、方向和终点，分别估计延迟、冲击、费用、未完成机会成本与有利价格变化，避免只看已成交部分。</p></details>
          <details><summary>07 · 识别激励而非编写动机</summary><p>资金流、排名和风险相关只能说明模式；识别职业顾虑、冒险或从众需要决策时序、组织数据和可辩护的外生变化。</p></details>
          <details><summary>08 · 处理均衡与外推</summary><p>流量会改变价格、容量和后续绩效，其他主体会承接订单；旧美国样本或极端赎回事件不能无条件外推当前中国常态。</p></details>
        </div>
        <p>
          一个可证伪问题可以写成：“在基金合同和基准未变、控制确认申赎与价格重估后，某一外生收紧的主动风险限额是否使目标权重更接近基准；交易台是否因此降低母订单参与率与实施差额；结果是否通过净主动收益改变下一期资金流？”每个箭头都有时间、变量、竞争解释与失败条件，才把“机构风格保守”变成研究设计。
        </p>
      </section>

      <section className="lesson-section" id="lab">
        <p className="section-kicker">50 · 互动实验</p>
        <h2>用固定数字把可行域、主动权重、两种风险坐标、组织激励、资金流和执行时钟连接起来。</h2>
        <p>
          八道题分成“从 mandate 到组合”和“从组织到订单”两组。每题先锁定目标、单位与可行集合，再提交判断；结果会给出逐选项诊断、完整计算、因果边界与复习入口。所有预期收益、协方差、资金流倍数和执行成本均为教学构造，不代表任何真实基金或市场。
        </p>
        <LongOnlyManagerLab />
      </section>

      <section className="lesson-section" id="active-practice">
        <p className="section-kicker">51 · 主动练习</p>
        <h2>真正掌握，是能把“基金看好所以买入”重写成一条可被数据否证的授权—组合—订单链。</h2>
        <div className="exercise-list">
          <article className="practice-problem"><span>练习 01 · 产品分类</span><p>选择一只你熟悉的公募产品，只用一手文件分别填写法律载体、运作方式、主动或被动、主要资产、绝对空头权限、衍生品用途、基准与现金政策；标出每项来自哪一页。</p><details className="practice-answer"><summary>核对要点与示例答案</summary><p>至少使用基金合同、招募说明书或监管登记，而非销售页。答案应允许“文件未明确”，不能从“股票型”“成长”“UCITS”或“1940 Act”单个标签推断其余轴。若条款版本不同，记录生效日。</p></details></article>
          <article className="practice-problem"><span>练习 02 · 两种风险距离</span><p>构造两组 Active Share 相同但事前 TE 不同的主动权重，写出协方差假设并解释是哪一项相关性造成差异。</p><details className="practice-answer"><summary>核对要点与示例答案</summary><p>可复用实验中的 (+10%,−10%,0) 与 (+10%,0,−10%)，让前两资产高度相关、第一与第三不相关。两组绝对权重差之和相同，但 aᵀΣa 不同；必须同时说明权重归一和 long-only 可行性。</p></details></article>
          <article className="practice-problem"><span>练习 03 · 订单重建</span><p>给定一只基金两个日期的持仓，列出至少五种不依赖“经理信念改变”也能产生权重变化的机制，并为每种机制指定所需中间数据。</p><details className="practice-answer"><summary>核对要点与示例答案</summary><p>价格重估需逐证券收益；申赎需确认现金流与配置规则；公司行动需拆并股、分红或换股记录；指数或基准变化需成分文件；停牌与限额需可交易状态；已挂未成交单需订单审计。只有扣除这些通道后，主动目标变化才更接近剩余解释。</p></details></article>
          <article className="practice-problem"><span>练习 04 · 证据降级</span><p>把“年轻基金经理因为害怕被解雇而从众”改写成观察数据直接支持的最强句子，再设计一项能够推进因果识别的新增证据。</p><details className="practice-answer"><summary>核对要点与示例答案</summary><p>合格降级示例：“在特定历史样本中，较年轻经理的终止—绩效敏感度更高且持仓更常规，结果与职业顾虑模型相容。”推进识别可利用外生改变考核或同业可见性的制度变化，并观察暴露前后同一经理的目标、订单和风险，同时检验共同信息与客户流量通道。</p></details></article>
        </div>
      </section>

      <section className="lesson-section" id="understanding-checks">
        <p className="section-kicker">52 · 理解检查</p>
        <h2>若能不看正文完整回答以下问题，才算把管理人从标签还原成机制。</h2>
        <div className="check-grid">
          <details><summary>01 · 为什么事后赢家不定义事前最优？</summary><p>事前只有条件分布与估计误差，还必须服从 mandate、风险、流动性和成本；实现路径删除了当时可能发生却未发生的状态。</p></details>
          <details><summary>02 · Mutual fund、UCITS、公募与 long-only 有何关系？</summary><p>前三者是不同法域的法律或产品类别，long-only 是绝对持仓约束；它们可以交叉，却不是同义词，active 又是独立的裁量轴。</p></details>
          <details><summary>03 · Long-only 为何仍能低配？</summary><p>约束是绝对权重 w≥0；主动权重 a=w−b。w 低于正的基准权重时 a 为负，但没有负股数或借券卖空。</p></details>
          <details><summary>04 · TE 为零为何仍可能亏损？</summary><p>TE 度量基金减基准的波动。基金完全复制下跌 20% 的基准时，主动收益与 TE 都可为零，持有人总收益仍为 −20%。</p></details>
          <details><summary>05 · Active Share 与 TE 为什么不能替代？</summary><p>前者是绝对权重偏离的 L1 距离，后者是协方差加权的风险距离；相同偏离可落在不同波动和相关方向。</p></details>
          <details><summary>06 · 资金流怎样改变经理问题？</summary><p>它改变 AUM、收费基数、容量、现金和必须交易的数量；实施成本与未来绩效又反过来影响下一轮资金流。</p></details>
          <details><summary>07 · 目标权重为何不是订单？</summary><p>订单还要减现有与在途持仓，纳入确认申赎、现金、价格、费用、整手和可交易状态；随后交易台再选择执行路径。</p></details>
          <details><summary>08 · 共同行为为何不等于从众？</summary><p>共同信息、基准变化、申赎、风险限额与价格重估都能产生同步持仓；从众需要观察同业动作如何进入个体决策的反事实。</p></details>
        </div>
      </section>

      <section className="lesson-section" id="interfaces-closing">
        <p className="section-kicker">53 · 课程接口与最终诊断</p>
        <h2>2.03 输出的不是“基金经理画像”，而是一套可接入被动资金、赎回压力、基准治理、从众与市场冲击的机构状态变量。</h2>
        <div className="interface-grid">
          <article><span>← 2.01–2.02</span><h3>Agents & Beneficiaries</h3><p>把最终家庭、基金产品或组合账户层、管理组织与交易台拆开，并按具体载体识别法律人格、名义持有人和执行责任。</p></article>
          <article><span>→ 2.04</span><h3>Passive Index Fund / ETF</h3><p>输出基准坐标、现金流和目标到订单语言；下一节改写裁量来源，并加入创建赎回篮子与套利机制。</p></article>
          <article><span>→ 2.17</span><h3>Redemption & Liquidity Mismatch</h3><p>输出 AUM、确认申赎、容量和流量诱发交易；后续研究压力赎回怎样改变剩余持有人与市场价格。</p></article>
          <article><span>→ 2.18</span><h3>Benchmark & Tracking Error</h3><p>输出两种风险坐标、Active Share、基准三角色与错配边界；专题章再处理选择、归因和治理。</p></article>
          <article><span>→ 6.10</span><h3>Herding</h3><p>输出职业问责、共同基准与共同行为的竞争解释；行为章再识别观察同业、信息瀑布与声誉学习。</p></article>
          <article><span>← 1.09</span><h3>Price Impact → Execution</h3><p>从 1.09 的价格冲击出发；本节首次建立 Implementation Shortfall，并把目标权重转换成带紧迫度的母订单与冲击—等待前沿。</p></article>
        </div>
        <p className="closing-thesis">
          面对任何“主动基金因为看好而买入”的解释，先辨认法律载体、策略与管理组织；找到最终受益人与实际决策节点；把基金合同、当期生效规则和内部限额写成可行域；说明基准在沟通、监督还是构建中起作用；分开总收益与主动收益、总风险与 Tracking Error、Active Share 与协方差风险；把研究信号与估计误差送进约束优化；用确认申赎、AUM、现有和在途持仓重建母订单；让交易台在冲击、等待与未完成之间求解；按 decision price 计算实施差额；最后让净主动结果通过资金流、容量和问责更新下一轮状态。做到这些，long-only 管理人才不再是一只会“选股”的黑箱，而成为一条可观察、可审计、可反驳的制度—组合—订单机制。
        </p>
      </section>
    </>
  );
}

export const lesson203: LessonRecord = {
  slug: '2-03',
  id: '2.03',
  chapter: '02',
  chapterTitle: 'Participants, Objectives & Constraints',
  title: 'Long-only Asset Manager：主动公募的授权、组合与订单',
  subtitle: '从最终受益人、法律载体、mandate 与基准出发，解释研究信号怎样经过主动风险、资金流、组织问责和执行成本转化为净主动价值',
  readingTime: '核心阅读约 90–110 分钟；互动实验快速 20–26／含复盘 30–40，主动练习核对 18–24／完整书写 35–50，理解检查快速 8–10／完整复述 14–18，课程接口 3–4 分钟；快速路径约 139–174 分钟，完整学习约 172–222 分钟（建议分两次完成；参考文献与延伸阅读不计）',
  prerequisite: '2.01；按需回看 T03、1.09、1.20 与 2.02',
  updatedAt: '2026-08-29',
  revision: '2.03-r3',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '2.03-r1',
      summary: '冻结 r1 无 P0；要求修正跨法域法律主体表述、毛主动收益与在途订单符号、执行风险单位、Grinold 归因、美国法链接与 Form N-1A 年份，并精校旧论文样本和核心公式。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '2.03-r1',
      summary: '冻结 r1 无 P0/P1；要求移除错误的 1.23 先修接口、校准八道实验复习入口，并补齐 mandate、两类 alpha、TE、PRIIP/AIF、AUM、beta 等零基础术语桥。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'changes-requested',
      revision: '2.03-r2',
      summary: '冻结 r2 的全部实质修订均通过；仅要求把 Grinold DOI 改为 409211，并以 Wiley/Crossref 正式元数据将 Jagannathan–Ma 末页恢复为 1683。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '2.03-r2',
      summary: '批准冻结 r2：先修与八题复习入口、术语桥、载体法律边界、公式解释、SSR、存储降级、焦点、ARIA、键盘与窄屏均通过，未发现剩余 P0–P2。',
    },
    {
      kind: 'accuracy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '2.03-r3',
      summary: '批准完整冻结 r3：跨法域产品边界、全部公式与单位、八题唯一答案、历史样本、27 条来源和书目元数据均通过，未发现剩余 P0–P2。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-08-29',
      decision: 'approved',
      revision: '2.03-r3',
      summary: '批准完整冻结 r3：54 节学习坡度、术语桥、练习与检查、实验复习入口、SSR、存储降级、焦点、ARIA、键盘和窄屏均通过，未发现剩余 P0–P2。',
    },
  ],
  previous: { slug: '2-02', label: '2.02 Retail Investor' },
  next: { slug: '2-04', label: '2.04 Passive Index Fund / ETF' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'system-loop', label: '完整系统' },
    { id: 'scope-prerequisite', label: '范围与先修' },
    { id: 'winner-objective', label: '事前目标' },
    { id: 'beneficial-owner', label: '最终风险承担者' },
    { id: 'why-delegate', label: '为什么委托' },
    { id: 'observability-agency', label: '可观察性与代理' },
    { id: 'three-axes', label: '三条分类轴' },
    { id: 'active-definition', label: 'Active 定义' },
    { id: 'long-only-definition', label: 'Long-only 定义' },
    { id: 'legal-map', label: '法律地图' },
    { id: 'us-mutual-fund', label: '美国 Mutual Fund' },
    { id: 'us-1940-act', label: '1940 Act Fund' },
    { id: 'ucits', label: 'UCITS' },
    { id: 'china-public-fund', label: '中国公募' },
    { id: 'china-equity-fund', label: '中国股票基金' },
    { id: 'mandate-feasible-set', label: 'Mandate 可行域' },
    { id: 'mandate-change', label: '合同与治理改变' },
    { id: 'why-benchmark', label: '为什么需要基准' },
    { id: 'benchmark-roles', label: '基准三角色' },
    { id: 'benchmark-boundary', label: '基准边界' },
    { id: 'return-decomposition', label: '收益分解' },
    { id: 'active-weights', label: '主动权重' },
    { id: 'long-only-underweight', label: '相对低配' },
    { id: 'realized-te', label: '事后 TE' },
    { id: 'ex-ante-active-risk', label: '事前主动风险' },
    { id: 'total-active-risk', label: '两种风险坐标' },
    { id: 'risk-budget', label: '风险预算' },
    { id: 'ir-sharpe', label: 'IR 与 Sharpe' },
    { id: 'active-share', label: 'Active Share' },
    { id: 'active-share-versus-te', label: 'Active Share 与 TE' },
    { id: 'benchmark-mismatch', label: '基准错配' },
    { id: 'performance-to-flows', label: '绩效到资金流' },
    { id: 'flow-convexity-evidence', label: '资金流凸性' },
    { id: 'client-heterogeneity', label: '客户异质性' },
    { id: 'aum-capacity-orders', label: 'AUM 与容量' },
    { id: 'career-organization', label: '职业与问责' },
    { id: 'risk-shifting-boundary', label: '风险调整边界' },
    { id: 'regulation-internal-control', label: '三层控制' },
    { id: 'china-benchmark-rules', label: '中国基准时钟' },
    { id: 'signal-corner', label: '信号与角点' },
    { id: 'constrained-optimization', label: '约束优化' },
    { id: 'constraints-regularization', label: '约束的两面' },
    { id: 'gross-to-net', label: '毛到净主动价值' },
    { id: 'target-to-parent-order', label: '目标到母订单' },
    { id: 'manager-versus-desk', label: '经理与交易台' },
    { id: 'implementation-shortfall', label: '实施差额' },
    { id: 'impact-waiting', label: '冲击—等待前沿' },
    { id: 'flow-induced-trading', label: '流量诱发交易' },
    { id: 'research-protocol', label: '研究协议' },
    { id: 'lab', label: '互动实验' },
    { id: 'active-practice', label: '主动练习' },
    { id: 'understanding-checks', label: '理解检查' },
    { id: 'interfaces-closing', label: '接口与诊断' },
  ],
  Content: Lesson203Content,
  references: [
    { id: 1, authors: '全国人民代表大会常务委员会', year: '2015', accessedAt: '2026-08-29', title: '中华人民共和国证券投资基金法（现行有效）', publication: '中国证监会法律法规库；2015 年修正', url: 'https://neris.csrc.gov.cn/falvfagui/rdqsHeader/mainbody?secFutrsLawId=e5cc920d0af7475ca44f1e69c5378244', use: '提供中国公开募集基金、基金合同、组合投资、许可资产、禁止行为和重大事项治理的上位法框架；法律未定义 long-only，也未设股票基金 80% 分类门槛。' },
    { id: 2, authors: '中国证券监督管理委员会', year: '2014', accessedAt: '2026-08-29', title: '公开募集证券投资基金运作管理办法', publication: '中国证监会令第 104 号，2014-08-08 施行，现行有效', url: 'https://www.csrc.gov.cn/csrc/c106256/c1653978/content.shtml', use: '支持中国股票基金以至少 80% 基金资产投资股票的分类、名称方向的独立 80% 非现金口径、集中度及建仓和被动偏离调整时钟；不等于 100% 股票或禁止一切衍生品。' },
    { id: 3, authors: '中国证券监督管理委员会', year: '2026', accessedAt: '2026-08-29', title: '公开募集证券投资基金业绩比较基准指引', publication: '证监会公告〔2026〕3 号', url: 'https://www.csrc.gov.cn/csrc/c101954/c7610812/content.shtml', use: '支持中国公募基准的匹配、治理、披露、监测和三阶段施行日期；截至核验日部分托管监督条款及 2027 年条款尚未开始执行，基准也不是收益承诺。' },
    { id: 4, authors: 'United States Congress', year: '1940', accessedAt: '2026-08-29', title: 'Investment Company Act of 1940, 15 U.S.C. §§ 80a-5, 80a-8 & 80a-13', publication: 'U.S. House Office of the Law Revision Counsel, Title 15 Chapter 2D collection, current preliminary edition', url: 'https://uscode.house.gov/view.xhtml?path=/prelim@title15/chapter2D&edition=prelim', use: '章节合集直接覆盖美国 open-end/closed-end 与 diversified 法定分类、注册声明及 fundamental policy 的股东保护；不定义 active 或 long-only，也不要求每次日常调仓表决。' },
    { id: 5, authors: 'U.S. Securities and Exchange Commission', year: '2023', accessedAt: '2026-08-29', title: 'Form N-1A: Registration Statement of Open-End Management Investment Companies', publication: 'SEC 2052 (12/23), official form and instructions', url: 'https://www.sec.gov/files/form-n-1a.pdf', use: '支持注册开放式管理投资公司披露目标、主要策略、风险、费用、基本政策与业绩比较；披露用广泛市场指数不自动成为组合约束或复制命令。' },
    { id: 6, authors: 'European Parliament & Council of the European Union', year: '2026', accessedAt: '2026-08-29', title: 'Directive 2009/65/EC on UCITS, consolidated text as of 16 April 2026', publication: 'EUR-Lex, Articles 1, 50–52 & 89', url: 'https://eur-lex.europa.eu/eli/dir/2009/65/2026-04-16/eng', use: '支持 UCITS 的公众募集、可赎回、许可流动资产、分散、风险管理、衍生品与 uncovered sales 边界；UCITS 不是欧洲股票基金或 long-only 的同义词。' },
    { id: 7, authors: 'European Commission', year: '2023', accessedAt: '2026-08-29', title: 'Commission Delegated Regulation (EU) 2017/653, consolidated text', publication: 'EUR-Lex, Article 2(2a)', url: 'https://eur-lex.europa.eu/legal-content/EN/TXT/?uri=CELEX%3A02017R0653-20230101', use: '要求采取 UCITS/AIF 形式的 PRIIP 披露是否参照基准、主动裁量和指数跟踪状态；这是 KID 披露规则，不定义 long-only 或把基准变成持仓硬限制。' },
    { id: 8, authors: 'Richard Roll', year: '1992', title: 'A Mean/Variance Analysis of Tracking Error', publication: 'Journal of Portfolio Management, 18(4), 13–22', url: 'https://doi.org/10.3905/jpm.1992.701922', use: '建立均值—方差框架下 Tracking Error 与基准相对优化的结构，并说明指数坐标可能引入组合含义；模型结果依机会集与参数假设。' },
    { id: 9, authors: 'Anat R. Admati & Paul Pfleiderer', year: '1997', title: 'Does It All Add Up? Benchmarks and the Compensation of Active Portfolio Managers', publication: 'Journal of Business, 70(3), 323–350', url: 'https://doi.org/10.1086/209721', use: '分析基准化薪酬如何改变主动经理选择及聚合含义；理论不支持把任何基准或相对薪酬一概称为扭曲。' },
    { id: 10, authors: 'Roger Clarke, Harindra de Silva & Steven Thorley', year: '2002', title: 'Portfolio Constraints and the Fundamental Law of Active Management', publication: 'Financial Analysts Journal, 58(5), 48–66', url: 'https://doi.org/10.2469/faj.v58.n5.2468', use: '说明 long-only 等约束怎样影响理想主动信息向组合的传递和可实现信息比率；transfer coefficient 依模型和参数，不是固定技能值。' },
    { id: 11, authors: 'K. J. Martijn Cremers & Antti Petajisto', year: '2009', title: 'How Active Is Your Fund Manager? A New Measure That Predicts Performance', publication: 'Review of Financial Studies, 22(9), 3329–3365', url: 'https://doi.org/10.1093/rfs/hhp057', use: '提出 Active Share 并与 Tracking Error 联合描述历史美国基金的主动类型；指标和历史绩效关系不证明偏离越高越好。' },
    { id: 12, authors: 'Berk A. Sensoy', year: '2009', title: 'Performance Evaluation and Self-Designated Benchmark Indexes in the Mutual Fund Industry', publication: 'Journal of Financial Economics, 92(1), 25–39', url: 'https://doi.org/10.1016/j.jfineco.2008.02.011', use: '记录 1994–2004 年美国股票基金自报与算法基准错配及评价问题；31.2% 属特定 1,815 只分析子集和论文算法，不是违法或当前比例。' },
    { id: 13, authors: 'Jonathan B. Berk & Richard C. Green', year: '2004', title: 'Mutual Fund Flows and Performance in Rational Markets', publication: 'Journal of Political Economy, 112(6), 1269–1295', url: 'https://doi.org/10.1086/424739', use: '把投资者学习、资金流、管理规模与递减收益结合，说明流入可耗尽可扩展 alpha；理论均衡不是所有基金的已识别现实路径。' },
    { id: 14, authors: 'Judith Chevalier & Glenn Ellison', year: '1997', title: 'Risk Taking by Mutual Funds as a Response to Incentives', publication: 'Journal of Political Economy, 105(6), 1167–1200', url: 'https://doi.org/10.1086/516389', use: '用 1982–1992 年美国成长类基金研究非线性资金流—业绩关系与年内风险调整；观察设计与历史样本不证明当前经理统一赌博。' },
    { id: 15, authors: 'Judith Chevalier & Glenn Ellison', year: '1999', title: 'Career Concerns of Mutual Fund Managers', publication: 'Quarterly Journal of Economics, 114(2), 389–432', url: 'https://doi.org/10.1162/003355399556034', use: '用 1992–1994 年美国经理数据连接年龄、终止敏感性和常规持仓；结果与职业顾虑相容，但不是从众动机的随机因果证明。' },
    { id: 16, authors: 'Erik R. Sirri & Peter Tufano', year: '1998', title: 'Costly Search and Mutual Fund Flows', publication: 'Journal of Finance, 53(5), 1589–1622', url: 'https://doi.org/10.1111/0022-1082.00066', use: '研究 1971–1990 年 690 只美国开放式股票基金的非线性流量—绩效与搜索成本；主样本存续选择和历史渠道结构限制外推。' },
    { id: 17, authors: 'Diane Del Guercio & Paula A. Tkac', year: '2002', title: 'The Determinants of the Flow of Funds of Managed Portfolios: Mutual Funds versus Pension Funds', publication: 'Journal of Financial and Quantitative Analysis, 37(4), 523–557', url: 'https://doi.org/10.2307/3595011', use: '比较 1987–1994 年养老金产品与共同基金的资金流反应；类别不是随机分配，生存和回填限制使结果不能成为制度纯因果效应。' },
    { id: 18, authors: 'Suleyman Basak, Anna Pavlova & Alex Shapiro', year: '2007', title: 'Optimal Asset Allocation and Risk Shifting in Money Management', publication: 'Review of Financial Studies, 20(5), 1583–1621', url: 'https://doi.org/10.1093/rfs/hhm026', use: '建立基准化激励下的动态风险调整并用 1970–1998 年美国基金检验；相对落后与 TE 调整的证据不等于总波动必然上升。' },
    { id: 19, authors: 'Russ Wermers', year: '2000', title: 'Mutual Fund Performance: An Empirical Decomposition into Stock-Picking Talent, Style, Transactions Costs, and Expenses', publication: 'Journal of Finance, 55(4), 1655–1695', url: 'https://doi.org/10.1111/0022-1082.00263', use: '用 1975–1994 年美国持仓和收益分解毛股票选择、交易成本、费用与净基金回报；历史差额不能直接成为当前费后 alpha 数值。' },
    { id: 20, authors: 'Donald B. Keim & Ananth Madhavan', year: '1997', title: 'Transactions Costs and Investment Style: An Inter-Exchange Analysis of Institutional Equity Trades', publication: 'Journal of Financial Economics, 46(3), 265–292', url: 'https://doi.org/10.1016/S0304-405X(97)00031-7', use: '以 1991–1993 年 21 家机构、62,333 笔订单展示成本随风格、订单和市场状态变化；早期选择样本不是当前固定成本表。' },
    { id: 21, authors: 'André F. Perold', year: '1988', title: 'The Implementation Shortfall: Paper versus Reality', publication: 'Journal of Portfolio Management, 14(3), 4–9', url: 'https://doi.org/10.3905/jpm.1988.409150', use: '提出以纸面决策组合对比实际结果的实施差额框架，将已成交成本与未完成机会成本统一；具体计算仍需锁定方向、基准价格和终点。' },
    { id: 22, authors: 'Robert Almgren & Neil Chriss', year: '2001', title: 'Optimal Execution of Portfolio Transactions', publication: 'Journal of Risk, 3(2), 5–39', url: 'https://doi.org/10.21314/JOR.2001.041', use: '形式化价格不确定性和市场冲击之间的最优执行前沿；模型参数和冲击形式是结构假设，不是所有市场的校准事实。' },
    { id: 23, authors: 'Joshua D. Coval & Erik Stafford', year: '2007', title: 'Asset Fire Sales (and Purchases) in Equity Markets', publication: 'Journal of Financial Economics, 86(2), 479–512', url: 'https://doi.org/10.1016/j.jfineco.2006.09.007', use: '用约 1980–2004 年美国开放式基金研究极端流量、共同持仓交易、价格压力与反转；观察结果不把所有共同行为都识别为强迫交易。' },
    { id: 24, authors: 'Dong Lou', year: '2012', title: 'A Flow-Based Explanation for Return Predictability', publication: 'Review of Financial Studies, 25(12), 3457–3489', url: 'https://doi.org/10.1093/rfs/hhs103', use: '用 1980–2006 年美国主动股票基金构造流量诱发交易代理并研究收益可预测性；代理依持仓与比例配置假设，不直接观察每笔订单。' },
    { id: 25, authors: 'Ravi Jagannathan & Tongshu Ma', year: '2003', title: 'Risk Reduction in Large Portfolios: Why Imposing the Wrong Constraints Helps', publication: 'Journal of Finance, 58(4), 1651–1683', url: 'https://doi.org/10.1111/1540-6261.00580', use: '展示最小方差问题中权重约束可在协方差估计误差下发挥正则化作用；1968–1998 年每年形成组合、实现期延伸至 1999 年 4 月的特定实验不证明约束普遍提高 alpha 或福利。' },
    { id: 26, authors: 'William F. Sharpe', year: '1994', title: 'The Sharpe Ratio', publication: 'Journal of Portfolio Management, 21(1), 49–58', url: 'https://doi.org/10.3905/jpm.1994.409501', use: '阐明 Sharpe Ratio 的定义、时间依赖与使用边界；样本比率不应被当作未来能力常数，也不同于以基准和 TE 为坐标的 Information Ratio。' },
    { id: 27, authors: 'Richard C. Grinold', year: '1989', title: 'The Fundamental Law of Active Management', publication: 'Journal of Portfolio Management, 15(3), 30–37', url: 'https://doi.org/10.3905/jpm.1989.409211', use: '原始基本定律连接预测质量、独立机会数量与理想信息比率；约束下的 transfer coefficient 扩展应归于 Clarke、de Silva 与 Thorley，独立性和稳定技能仍须检验。' },
  ],
  readingList: [
    { title: 'Roll (1992) · Tracking Error', scope: '基准与两种风险坐标', reason: '从均值—方差问题理解围绕指数控制相对风险为什么会改变组合，而不是只背 TE 公式。', url: 'https://doi.org/10.3905/jpm.1992.701922' },
    { title: 'Admati & Pfleiderer (1997)', scope: '基准化薪酬与代理', reason: '深入理解相对评价怎样改变经理选择，以及个体合同为何未必在聚合层面相加。', url: 'https://doi.org/10.1086/209721' },
    { title: 'Clarke, de Silva & Thorley (2002)', scope: '约束与实施效率', reason: '学习 long-only 等现实约束如何把理想 alpha 映射成可实施组合。', url: 'https://doi.org/10.2469/faj.v58.n5.2468' },
    { title: 'Cremers & Petajisto (2009)', scope: 'Active Share', reason: '精读指标定义、基金分类和历史绩效设计，并把度量贡献与因果解释分开。', url: 'https://doi.org/10.1093/rfs/hhp057' },
    { title: 'Sensoy (2009)', scope: '基准错配', reason: '理解自报、算法和经济上合适的基准为何可能不同，以及结果后选坐标的危险。', url: 'https://doi.org/10.1016/j.jfineco.2008.02.011' },
    { title: 'Berk & Green (2004)', scope: '技能、规模与资金流均衡', reason: '把好绩效、流入、容量耗尽和未来净 alpha 连接成动态均衡。', url: 'https://doi.org/10.1086/424739' },
    { title: 'Sirri & Tufano (1998)', scope: '搜索与流量凸性', reason: '精读历史样本、存续选择和为何好排名对流入的作用可能不对称。', url: 'https://doi.org/10.1111/0022-1082.00066' },
    { title: 'Chevalier & Ellison (1997)', scope: '资金流激励与风险选择', reason: '观察非线性流量函数怎样进入年内组合风险，同时保留观察性边界。', url: 'https://doi.org/10.1086/516389' },
    { title: 'Chevalier & Ellison (1999)', scope: '职业顾虑', reason: '区分终止敏感性、常规持仓、年龄代理与真正从众因果。', url: 'https://doi.org/10.1162/003355399556034' },
    { title: 'Basak, Pavlova & Shapiro (2007)', scope: '动态风险调整', reason: '成对阅读理论与实证，分开 Tracking Error、beta 和总波动的不同反应。', url: 'https://doi.org/10.1093/rfs/hhm026' },
    { title: 'Wermers (2000)', scope: '毛选择到净结果', reason: '学习如何把持仓表现、风格、交易成本和费用拆成实施瀑布。', url: 'https://doi.org/10.1111/0022-1082.00263' },
    { title: 'Perold (1988)', scope: 'Implementation Shortfall', reason: '建立包含未完成订单机会成本的完整执行评价，而非只看成交价。', url: 'https://doi.org/10.3905/jpm.1988.409150' },
    { title: 'Almgren & Chriss (2001)', scope: '最优执行', reason: '理解冲击与价格风险怎样共同决定执行轨迹，以及模型假设怎样限制应用。', url: 'https://doi.org/10.21314/JOR.2001.041' },
    { title: 'Coval & Stafford (2007)', scope: '资金流与火售', reason: '从基金申赎和共同持仓连接到价格压力与反转，同时训练观察性识别边界。', url: 'https://doi.org/10.1016/j.jfineco.2006.09.007' },
    { title: 'Lou (2012)', scope: '流量诱发交易代理', reason: '理解没有逐笔订单时怎样由流量和持仓构造代理，以及代理假设如何进入结论。', url: 'https://doi.org/10.1093/rfs/hhs103' },
    { title: 'Jagannathan & Ma (2003)', scope: '约束与估计误差', reason: '理解为何错误约束在样本外可能像协方差收缩，同时避免泛化成约束总有益。', url: 'https://doi.org/10.1111/1540-6261.00580' },
    { title: '中国证监会 · 基准指引（2026）', scope: '中国当前基准治理', reason: '逐条核对三阶段施行、偏离监测、变更、报告与评价规则，建立制度时钟。', url: 'https://www.csrc.gov.cn/csrc/c101954/c7610812/content.shtml' },
    { title: '中国证监会令第 104 号', scope: '中国股票基金可行域', reason: '直接阅读股票基金分类、名称口径、集中度、衍生品、建仓与被动偏离调整。', url: 'https://www.csrc.gov.cn/csrc/c106256/c1653978/content.shtml' },
    { title: 'U.S. Investment Company Act §§5, 8, 13', scope: '美国法律分类与基本政策', reason: '区分 open-end、diversified、注册披露和需股东保护的 fundamental policy。', url: 'https://uscode.house.gov/view.xhtml?path=/prelim@title15/chapter2D&edition=prelim' },
    { title: 'UCITS Directive · 2026 consolidated text', scope: '欧盟许可资产与风险边界', reason: '亲自核对衍生品、集中度、global exposure 和 uncovered sales，避免把 UCITS 写成纯股票 long-only。', url: 'https://eur-lex.europa.eu/eli/dir/2009/65/2026-04-16/eng' },
  ],
};
