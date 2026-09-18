import type { ReactNode } from 'react';
import PolicyReactionLab from '../components/PolicyReactionLab';
import PolicyReactionTransmissionChart from '../components/PolicyReactionTransmissionChart';
import { policyReactionScenarios } from '../components/policyReactionScenarios';
import { lesson305ReadingList, lesson305References } from './lesson-3-05-sources';
import type { LessonRecord } from './types';

function Cite({ n }: { n: number }) {
  return <a aria-label={'参考文献 ' + n} className="citation-mark" href={'#ref-' + n}>[{n}]</a>;
}

function Cites({ ns }: { ns: number[] }) {
  return <>{ns.map((n) => <Cite key={n} n={n} />)}</>;
}

type ConceptSection = {
  id: string;
  number: number;
  label: string;
  title: string;
  paragraphs: ReactNode[];
  formula?: { label: string; expression: ReactNode; note: ReactNode };
  boundary?: ReactNode;
};

function PolicyConceptSection({ section }: { section: ConceptSection }) {
  return (
    <section className="lesson-section" id={section.id}>
      <p className="section-kicker">{String(section.number).padStart(2, '0')} · {section.label}</p>
      <h2>{section.title}</h2>
      {section.formula ? (
        <div className="equation-card">
          <span>{section.formula.label}</span>
          <div>{section.formula.expression}</div>
          <p>{section.formula.note}</p>
        </div>
      ) : null}
      {section.paragraphs.map((paragraph, index) => <p key={`${section.id}:${index}`}>{paragraph}</p>)}
      {section.boundary ? <div className="precision-note"><span>边界与接口</span><p>{section.boundary}</p></div> : null}
    </section>
  );
}

const conceptSections: ConceptSection[] = [
  {
    id: 'institutional-layers', number: 2, label: 'Institutional Layers',
    title: '一项政策陈述只有放回“法律—策略—当次决定—实施”四层，才知道它能约束什么、不能推出什么。',
    paragraphs: [
      <>法律或条约由立法者赋权，规定目标、治理和问责；策略、remit 或政府—央行协议再解释指数、数值、对称性、期限与权衡；当次决定只是在特定会议和信息 cutoff 下选择利率、资产负债表或措辞；实施则用准备金利率、走廊或地板、公开市场操作和工具条款把决定传到隔夜市场。Fed §2A、TFEU Article 127、BoE Act、BoJ Act、BoC Act、RBA Act 与 PBOC Law 都属于第一层，不能由一次记者会改写。<Cites ns={[1, 5, 6, 9, 12, 15, 18, 20]} /></>,
      <>第五种常被放错位置的材料是 projection。SEP、staff baseline、fan chart 或 conditioning path 是信息产品，可能影响判断和沟通，却不必代表委员会共同预测，更不构成无条件承诺。一次 hold、分裂投票或基线变化也不等于稳定反应系数。<Cites ns={[25, 26, 29, 30, 31, 33, 35, 36]} /></>,
    ],
    boundary: <>本节解释为什么选工具与路径；准备金、走廊、交易执行和市场利率控制由 3.06 完整接手。</>,
  },
  {
    id: 'legal-mandate', number: 3, label: 'Legal Mandate',
    title: '法定授权规定政策的可接受目标集合，却通常不直接给出一条可运行的利率公式。',
    paragraphs: [
      <>Fed 法定文字包含最大就业、稳定价格与适度长期利率，2% PCE 来自 FOMC 策略而非 §2A；ECB 条约把价格稳定置于首位，却没有在条约正文写 2%；BoE Act 规定价格稳定，并在不损害前者时支持政府经济政策，具体 2% CPI 由 remit 给出。把策略数值倒写进法律，会误判谁有权修改什么。<Cites ns={[1, 2, 5, 6, 7, 9, 10]} /></>,
      <>BoJ、BoC、RBA 与 PBOC 也不能被“单一／双重使命”标签抹平。现行 RBA Act s8AA 把促进澳大利亚人民当前与未来的经济繁荣和福利设为全行 overarching objective，s9B(1)(a) 则要求 Monetary Policy Board 的货币政策最有助于价格稳定与充分就业；它不再是旧 s10 的三联表述。PBOC 法律表述为保持币值稳定并以此促进经济增长，2026 政府工作报告的年度 CPI 预期目标约 2% 不是永久央行点目标。<Cites ns={[12, 13, 15, 16, 18, 19, 20, 22]} /></>,
    ],
    boundary: <>法定目标相似不代表实际权重相同；独立性与财政支配的完整政治经济学留给 5.04。</>,
  },
  {
    id: 'assignment-independence', number: 4, label: 'Assignment / Independence',
    title: '独立性不是“央行不受政治影响”的开关，而是目标、工具、人事、财政与问责权限的分配矩阵。',
    paragraphs: [
      <>目标独立性问谁能定义最终目标，工具独立性问谁能在给定目标下选择路径。政府设定 2% CPI 而 MPC 自主决定 Bank Rate，是目标约束与工具自主并存；加拿大由政府与央行共同续约框架，又显示目标可能由协议共同设定。任期、罢免门槛、预算和禁止直接财政融资会改变短期压力怎样进入决策，但都不能取消民主问责。<Cites ns={[9, 10, 15, 16, 18, 19, 45, 46]} /></>,
      <>委托可缓解时间不一致，也会产生代理问题。更重视通胀的决策者可能降低通胀偏差，却在供给冲击下付出更高活动成本；绩效合同只有在目标可测、冲击可辨且政府承诺可信时才复制理想结果。因此独立性应写成制度参数，而不是把所有偏离模型基准的动作叫“政治干预”。<Cites ns={[41, 42, 43, 44, 45, 46]} /></>,
    ],
    boundary: <>5.04 将处理制度可信度、政治压力与财政—货币政体；本节只建立权限护照。</>,
  },
  {
    id: 'accountability', number: 5, label: 'Accountability',
    title: '独立工具权必须与可追溯的目标、解释、记录和纠偏程序成对出现。',
    paragraphs: [
      <>问责不等于逐月命中目标。政策有滞后，冲击不可控；合理制度要求决策者说明当时目标、实时信息、风险、所选路径以及什么状态会改变判断。声明、分钟、投影、听证、公开信与框架复审承担不同功能；分钟能记录分歧，却不提供每个人完整结构模型。<Cites ns={[2, 4, 7, 10, 11, 13, 16, 19]} /></>,
      <>透明度也并非线性越多越好。公开个别观点可暴露异质信息和责任，也可能诱发立场表演、压缩内部探索，或让市场把条件预测读成承诺。评价问责质量，应看信息能否把行动接回目标和实时状态，而不是只统计发布页面。<Cites ns={[95, 99, 100, 102, 103]} /></>,
    ],
    boundary: <>52 节讨论委员会公开度；53–55 节讨论沟通如何进入市场路径。</>,
  },
  {
    id: 'decision-body', number: 6, label: 'Decision Body',
    title: '政策动作是委员会制度、staff 信息、议程与投票规则共同生成的集体选择，不是“央行人格”的单一偏好。',
    paragraphs: [
      <>委员会可能逐人记名投票、共识决策或咨询议事。BoE MPC 公开少数意见；RBA 现由 Monetary Policy Board 负责；PBOC MPC 是咨询议事安排，不能类比成一个完全独立、按公开票数机械聚合的 FOMC。主席的议程权、staff 共同预测、地区信息和外部委员背景都会改变信息汇聚。<Cites ns={[21, 30, 35, 95, 97, 98, 101]} /></>,
      <>实验与理论表明，委员会可借多样信号减少个人误差，也可能因沟通成本、从众或战略投票丢失信息。一次 9–3 或 6–3 只描述当次选择；它不是未来同样数据下的固定概率，也不能把“中位委员”直接等同公布的政策路径。<Cites ns={[25, 30, 96, 97, 98, 100, 101]} /></>,
    ],
  },
  {
    id: 'objective-hierarchy', number: 7, label: 'Objective Hierarchy',
    title: '多个目标可能按首要—次要、平衡权衡、范围约束或共同终点排序；冲突时的次序决定谁先让步。',
    paragraphs: [
      <>ECB 是典型层级：价格稳定为首要目标，只有在不损害它时才支持一般经济政策；Fed 策略在最大就业与价格稳定不互补时采用 balanced approach；澳大利亚框架把价格稳定与充分就业共同操作化。若全部写成固定二次损失中的相同权重，就把法律次序变成研究者偏好。<Cites ns={[1, 2, 5, 6, 7, 18, 19]} /></>,
      <>层级并不意味着次要目标永远为零权重。金融动荡可破坏传导，衰退可改变中期通胀路径，首要价格稳定机构也会回应活动和金融条件；关键是说明它们作为最终目标、预测指标、约束还是传导保护进入。对信用利差反应，可能只是修复传导，而非给资产价格一个独立目标。<Cites ns={[7, 8, 37, 118, 119]} /></>,
    ],
  },
  {
    id: 'price-stability-objective', number: 8, label: 'Price-stability Objective',
    title: '“2%”只有连同指数、总体、变化率、期限、对称性和制度文件，才构成可执行的价格稳定目标。',
    paragraphs: [
      <>Fed 以 PCE 价格指数长期变动衡量 2%；ECB 以欧元区 HICP 中期 2%；BoE 以 12 个月 CPI 2%；BoJ 以 CPI 同比 2%；加拿大以 1–3% 区间中点 2%；澳大利亚以 2–3% 区间中点 2.5%。数字相近，指数覆盖、住房处理、修订性质和决策期限并不相同。<Cites ns={[2, 7, 10, 13, 16, 19]} /></>,
      <>中国 2026 政府工作报告的居民消费价格年度预期目标约 2%，服务年度宏观政策协调；它不是由 PBOC 法律设定、永久不变且只由央行负责兑现的点目标。正确记录应给出发布主体、年度、状态与政策分工。<Cites ns={[20, 22, 24]} /></>,
    ],
    boundary: <>3.02 解释实际通胀测量；本节只定义政策目标对象。</>,
  },
  {
    id: 'employment-activity-objective', number: 9, label: 'Employment / Activity Objective',
    title: '最大就业、充分就业和可持续就业不是固定失业率，而是随供给、匹配与参与变化的状态判断。',
    paragraphs: [
      <>FOMC 明确指出最大就业主要由非货币因素决定，不能用单一长期数值固定；加拿大框架使用 maximum sustainable employment；澳大利亚共同追求 full employment 与价格稳定。就业目标并不授权央行永久把需求推到供给之上，而是要求识别在不造成不可持续通胀下可维持的就业。<Cites ns={[2, 16, 18, 19]} /></>,
      <>失业率下降可能来自岗位需求，也可能来自参与率下降；工资上升可能反映紧张、生产率或一次性追赶。决策者因而联合读取失业、职位空缺、工时、参与、工资、匹配和生产率，而不是把一条失业率与利率一一对应。<Cites ns={[25, 27, 30, 34, 35, 77]} /></>,
    ],
    boundary: <>3.03 提供劳动状态护照；24 节只把它压缩成 policy gap。</>,
  },
  {
    id: 'secondary-objectives', number: 10, label: 'Secondary Objectives',
    title: '增长、汇率、金融条件或一般政府政策可以进入决策，但必须标清其角色。',
    paragraphs: [
      <>ECB 的次级支持义务受“不损害价格稳定”限定；BoE 在价格稳定约束下支持政府经济政策；PBOC 的币值稳定与促进增长又处在不同制度结构。RBA 的经济繁荣与福利属于 s8AA 的全行 overarching objective，而 MPB 的货币政策职能由 s9B 连接价格稳定与充分就业；这仍不意味着每个行业或资产价格都获得独立目标。<Cites ns={[5, 6, 9, 10, 18, 20]} /></>,
      <>汇率在浮动制度下通常通过进口价格、净出口、资产负债表与金融条件进入；在管理或固定汇率制度下，可能成为近端约束。研究者说“央行对汇率反应”时，应区分反应于通胀信息、金融风险，还是维护某个水平承诺。<Cites ns={[20, 23, 24, 50]} /></>,
    ],
    boundary: <>跨国制度与外汇政体在 Chapter 4/5 展开。</>,
  },
  {
    id: 'financial-stability-boundary', number: 11, label: 'Financial-stability Boundary',
    title: '金融稳定会改变货币政策的可行集与传导，却不自动证明政策率应刺破每一次资产繁荣。',
    paragraphs: [
      <>信用利差、杠杆和市场失灵能改变给定政策率下的实际金融条件，也可能让危机尾部进入最优决策；金融稳定因此不是无关变量。但宏观审慎、监管、流动性工具与政策率作用对象不同，Tinbergen 传统提醒：多个独立目标通常需要足够多独立有效工具。<Cites ns={[37, 118, 119, 120]} /></>,
      <>“Lean against the wind”是否合算，取决于利率对脆弱性的边际影响、就业通胀代价、危机概率和替代工具有效性。利差扩大时降息可能修复总需求，也可能放大杠杆；同一个动作不能脱离状态和工具组合判定。<Cites ns={[118, 119, 120]} /></>,
    ],
    boundary: <>3.12、3.14–3.16 与 3.19 分别接手风险承担、银行信用和宏观审慎。</>,
  },
  {
    id: 'fiscal-fx-boundary', number: 12, label: 'Fiscal / FX Boundary',
    title: '央行资产负债表与财政、汇率制度天然相连，但“有交互”不等于目标和责任可以互换。',
    paragraphs: [
      <>利率改变政府融资成本，央行利润与资产购买影响公共部门合并资产负债表；财政税支、补贴和债务期限又改变需求、通胀与传导。政策须把财政路径作为条件输入，同时避免把财政不可持续塞进 r-star 或 output gap。时间不一致与财政支配会改变可行反应函数，却不能从一次购债识别。<Cites ns={[20, 23, 24, 41, 42, 43, 44]} /></>,
      <>外汇干预、资本流动管理与本币流动性工具可能由央行、财政部或共同负责。只看央行资产负债表变化，可能把财政代理操作、储备管理或汇率目标误写成国内利率信号；应先记录权限、交易对手、币种、期限和冲销方式。<Cites ns={[15, 20, 23, 24]} /></>,
    ],
    boundary: <>3.18 接手财政—货币互动，4.06–4.13 接手跨境传导。</>,
  },
  {
    id: 'target-index', number: 13, label: 'Target Index',
    title: '目标指数的覆盖与编制决定什么算偏离；headline、core 与生活成本感受不能互换。',
    paragraphs: [
      <>PCE、CPI 与 HICP 对权重、住房、医疗和样本更新的处理不同；同一冲击可使它们短期分叉。目标常指 headline，因为最终价格稳定覆盖全部消费，但 core、trimmed mean 或服务通胀可作为持久性指标。把 core 低于 2% 当成 headline 目标已实现，或把家庭 prices-in-general 调查当作目标指数，都是对象错配。<Cites ns={[2, 7, 10, 13, 16, 19]} /></>,
      <>指数也有 vintage：PCE 和国民账户会修订，CPI/HICP 发布节奏与季调版本不同。实时反应函数必须使用会前可见版本，并保留同比、环比年化与年度平均的单位；不能以最终修订数据回填当时 gap。<Cites ns={[27, 31, 57, 58, 76]} /></>,
    ],
    boundary: <>3.02 提供指数、权重和成分分解。</>,
  },
  {
    id: 'target-form', number: 14, label: 'Target Form',
    title: '点目标、目标区间、容忍区间、平均通胀与价格水平路径改变误差如何跨期累计。',
    paragraphs: [
      <>点目标规定中心；控制区间可承担容忍、问责或操作弹性；平均通胀或价格水平目标要求过去低于路径后未来部分补偿，普通灵活通胀目标通常“让过去过去”。加拿大 1–3% 区间的 2% 中点与澳大利亚 2–3% 区间的 2.5% 中点，不能只取中心后抹去制度设计。<Cites ns={[2, 7, 10, 16, 19, 49]} /></>,
      <>框架形式会影响预期，但文本承诺不保证公众相信补偿会发生。识别某种目标制效果，需要观察规则是否可信、公众是否理解、冲击时期是否执行，以及框架切换是否伴随其他制度变化。<Cites ns={[41, 47, 49, 104, 105]} /></>,
    ],
  },
  {
    id: 'symmetry', number: 15, label: 'Symmetry',
    title: '对称意味着持续高于和低于目标都不可取，不意味着同幅偏离触发同幅、同速、同工具动作。',
    paragraphs: [
      <>来源不同的 1pp 偏离，可能具有不同持久性、预期反馈和活动代价；对称目标允许条件路径不对称。ECB 与 FOMC 的对称表述约束长期方向，仍允许在风险、滞后和双目标冲突下选择不同速度。<Cites ns={[2, 7]} /></>,
      <>对称也不等于机械补偿历史误差。若框架不是价格水平或平均通胀目标，过去 undershoot 不会自动授权未来任意 overshoot；持续单边偏离仍会经可信度和预期锚定改变当前最优反应。<Cites ns={[2, 7, 41, 47, 50]} /></>,
    ],
    boundary: <>继续到 16 节政策期限、22 节锚定状态和 49 节 forecast-based rule。</>,
  },
  {
    id: 'policy-horizon', number: 16, label: 'Policy Horizon',
    title: '目标期限由冲击传导、政策滞后和权衡共同决定，是状态变量而不是永不移动的日历。',
    paragraphs: [
      <>政策影响需求、工资和价格需要时间；若试图把一次油价跳升在下月完全压回目标，可能制造不必要的活动波动。灵活通胀目标通常使用“中期”或“随时间返回”的语言，但这不是拖延许可证：回归越慢，越需要说明持久性、二轮效应、预期锚定和产出代价。<Cites ns={[7, 10, 13, 16, 19, 47, 50]} /></>,
      <>最优期限随状态改变。短暂、孤立且长端预期稳定的供给冲击可较多 look through；持续、广泛、进入工资定价或使长期预期敏感的冲击，需要更快更强的响应。“供给冲击”本身从来不是一律不反应的充分条件。<Cites ns={[25, 28, 30, 32, 35, 51]} /></>,
    ],
    boundary: <>3.02 提供持久性和二轮效应，3.04 提供锚定状态。</>,
  },
  {
    id: 'escape-accountability-clause', number: 17, label: 'Escape / Accountability Clause',
    title: '偏离条款把不可控冲击转化为可审计解释，而不是宣布目标暂时失效。',
    paragraphs: [
      <>容忍带、公开信或 remit 中的情景条款，通常要求说明偏离来源、预计期限、应对路径和代价。它把“为何暂时不立即回到目标”变成可检验承诺；若不保存预测 vintage，事后仍可以无限改写理由。<Cites ns={[10, 11, 16]} /></>,
      <>问责触发阈值不等于利率动作阈值。通胀越界可能来自税费、能源或汇率，委员会仍须判断持久性和预期；反之 headline 尚在带内，广泛潜在压力与去锚风险也可能要求行动。<Cites ns={[10, 30, 31, 35, 36]} /></>,
    ],
  },
  {
    id: 'objective-indicator-instrument', number: 18, label: 'Objective / Indicator / Instrument',
    title: '最终目标、状态指标、中间条件与政策工具必须分栏，否则相关性会被误写成政策责任。',
    paragraphs: [
      <>最终目标是法律或策略要求实现的结果，如价格稳定与可持续就业；指标帮助估计未来偏离，如 core inflation、vacancies 和信用利差；操作目标或中间条件连接政策与市场；工具则包括利率、准备金、资产交易、贷款便利和沟通。Tinbergen 原则关心独立目标与有效工具，而不是做名词计数。<Cites ns={[37, 40]} /></>,
      <>同一变量会换角色。浮动汇率制度中的汇率多是指标和传导变量，在钉住制度中可成近端目标；信用利差既可指示金融条件，也可能在市场失灵时成为工具干预对象。角色必须按制度和事件重判。<Cites ns={[8, 23, 24, 119]} /></>,
    ],
    boundary: <>例如：2% PCE 是目标；trimmed mean 和工资是指标；联邦基金目标区间是政策决定／近端目标；IORB 与公开市场操作是实施工具；SEP dot 是条件性个人投影，既非工具也非承诺。<Cites ns={[2, 25, 26]} /></>,
  },
  {
    id: 'information-set-vintage', number: 19, label: 'Information Set / Vintage',
    title: '政策只能对当时可见的信息反应；发布日期相同也不代表统计、预测和市场条件拥有统一 cutoff。',
    paragraphs: [
      <>实时记录至少要保存数据观察期、初次发布、修订 vintage、调查 fieldwork、staff cutoff、会议起止、声明时间、市场窗口和访问日。Fed 2026-07 MPR 于 7 月 10 日发布，一般信息截止 7 月 8 日中午，但图表日期各异；它也不能被压成 7 月 29 日决定的信息集。<Cite n={27} /></>,
      <>BoE July MPR 的 conditioning path 使用截至 7 月 20 日的 15 个英国工作日均值，其他序列 cutoff 各异；BoJ 7 月 31 日发布 Bank’s View、8 月 3 日才发布全文；RBA 8 月 11 日 SMP 的数据 cutoff 为 8 月 5 日。最终 output gap 常与实时估计方向不同，回填会让规则看似比当时可行得多。<Cites ns={[31, 32, 33, 36, 57, 58, 76]} /></>,
    ],
    boundary: <>任何 reaction-function 样本都应保存 <code>available_at</code>，而不只有 <code>period</code>。</>,
  },
  {
    id: 'policy-state-vector', number: 20, label: 'Policy State Vector',
    title: '央行反应的对象不是一条 CPI，而是带 vintage 的状态向量、条件预测分布与制度状态。',
    formula: {
      label: 'Policy-ready state',
      expression: <>s<sub>t</sub><sup>v</sup>=[π<sup>h</sup>,π<sup>u</sup>,Eπ,κ,x,ℓ,q,f,e,z | ℐ<sub>t</sub><sup>v</sup>]；　a<sub>t</sub>=g(s<sub>t</sub><sup>v</sup>,D<sub>t</sub>,m<sub>t</sub>,C<sub>t</sub>)</>,
      note: <>π<sup>h</sup>/π<sup>u</sup>是headline/underlying；Eπ与κ是预期和锚定状态；x、ℓ、q是活动、劳动和供给；f、e、z是金融、外部与财政状态；D是另列的条件预测分布，m是制度与工具约束，a<sub>t</sub>是政策行动路径。</>,
    },
    paragraphs: [
      <>向量不是“更多数据更好”的清单，而是把目标偏离、传导、约束和风险分开。每项都要给单位、期限、可得时间、测量误差和决策角色；缺失值不能用事后最终值补齐。<Cites ns={[47, 50, 57, 76, 112, 114]} /></>,
      <>真正状态还包括有效目标、工具边界、ELB、委员会组成及财政或金融稳定约束。因此相同的通胀与失业，在不同层级或下限状态可产生不同路径；这不必是规则失灵，而可能是状态空间变了。<Cites ns={[41, 63, 79, 104, 105]} /></>,
    ],
  },
  {
    id: 'inflation-state', number: 21, label: 'Inflation State',
    title: '政策相关通胀状态是水平、动量、广度、来源、持久性和预测的联合诊断。',
    paragraphs: [
      <>Headline 回答家庭实际篮子，underlying 指标过滤部分波动，短期年化动量反映最近变化，成分广度与工资／利润传导帮助判断持续性。决策者还要区分需求、供给、税费、汇率和相对价格；同样 3% 可以对应完全不同的中期风险。<Cites ns={[25, 28, 30, 32, 34, 35]} /></>,
      <>政策 gap 面向目标期限，即 π<sub>t+h|t</sub>−π*。当前 headline 高但预测快速回落、预期稳定，与 core 广泛上行且工资价格相互强化不同。Projection 又是条件产物，staff baseline 不能当行动承诺或私人信念。<Cites ns={[26, 29, 31, 33, 36, 47]} /></>,
    ],
    boundary: <>3.02 拥有完整价格生成；本节只定义进入决策的压缩状态。</>,
  },
  {
    id: 'expectation-anchor-state', number: 22, label: 'Expectation / Anchor State',
    title: '央行必须同时读取预期中心、期限结构、分歧、不确定性、新闻敏感度和合同传导。',
    paragraphs: [
      <>短端预期可合理追随能源，而长端稳定；市场通胀补偿又混合物理预期、风险和流动性。Anchor state 至少包括不同主体与期限的中心、个体不确定性、横截面分歧、长端对短期新闻的敏感度，以及工资和调价是否条件于目标。<Cites ns={[2, 7, 13, 16, 19]} /></>,
      <>预期高不自动要求一比一加息：可能是指数／期限错配或显著价格；预期稳定也不证明可信，因为调查迟钝、风险溢价变化或注意不足会遮蔽。反应函数应对经三角互证的锚定状态，而不是一条 headline proxy。<Cites ns={[25, 28, 30, 32, 35, 66]} /></>,
    ],
    boundary: <>直接调用 3.04 的 expectation passport 与 anchoring mapping。</>,
  },
  {
    id: 'output-gap-state', number: 23, label: 'Output-gap State',
    title: '产出缺口是潜在供给不可观测条件下的实时估计，不是最终 GDP 减一条已知趋势。',
    formula: {
      label: '两种常用近似必须标明',
      expression: <>x<sub>t</sub><sup>v</sup>=100·(Y<sub>t</sub><sup>v</sup>/Y<sub>t</sub><sup>*,v</sup>−1)　≈　100·(y<sub>t</sub><sup>v</sup>−y<sub>t</sub><sup>*,v</sup>)</>,
      note: <>第一式用于水平指数，第二式用于对数；单位均为相对潜在产出的百分比。上标 v 同时约束实际产出与潜在产出的当时估计。</>,
    },
    paragraphs: [
      <>正 gap 表示需求相对可持续供给偏强，但潜在产出本身会随生产率、资本、劳动和灾害变化；只修订分母就能翻转历史 gap。<Cites ns={[57, 58, 68, 69, 73, 76]} /></>,
      <>制定者会并用 GDP、消费、投资、调查、产能利用与收入数据形成活动判断。把最终 gap 放入 Taylor 回归往往夸大实时拟合；稳健研究要保存多个实时估计，并报告结论对代理的敏感性。<Cites ns={[57, 58, 70, 75, 76]} /></>,
    ],
    boundary: <>3.01 提供增长与潜在供给；互动实验严格使用第一式且显式乘 100。</>,
  },
  {
    id: 'labor-gap-state', number: 24, label: 'Labor-gap State',
    title: '劳动市场“紧”是岗位、求职者、工时、参与、工资与匹配的共同状态。',
    formula: {
      label: 'Unemployment-gap compression',
      expression: <>u-gap<sub>t</sub><sup>v</sup>=u<sub>t</sub><sup>v</sup>−u<sub>t</sub><sup>*,v</sup></>,
      note: <>负值常被解释为较紧，但 u* 不可观察且区间很宽；这只是压缩变量，不是政策触发阈值。</>,
    },
    paragraphs: [
      <>职位空缺下降而失业率不变，可能意味着紧张缓解；参与率回升可在就业增长时抬高失业率；生产率上升可支持更快工资而不增加单位成本。工资增长必须联结生产率、利润率和 composition，不能直接命名为需求压力。<Cites ns={[25, 27, 30, 34, 35, 77]} /></>,
      <>NAIRU 的弱识别意味着决策应报告区间和替代指标。以最终修订 u* 解释历史利率，会把当时未知状态伪装成已知。<Cites ns={[73, 74, 77]} /></>,
    ],
    boundary: <>3.03 完整讲劳动与工资；本节只收取 policy-ready 状态。</>,
  },
  {
    id: 'supply-capacity-state', number: 25, label: 'Supply-capacity State',
    title: '供给能力决定需求多大才可持续；它会被生产率、资本、劳动力、能源与供应网络内生改变。',
    paragraphs: [
      <>潜在增长不是常数。AI 投资可同时抬高当期需求与未来供给；能源冲击会压低可用产能并抬价；移民、参与、工时与匹配改变劳动供给。只把强增长读成过热，可能在供给扩张时过度收紧；只看生产率叙事，又会漏掉当期资本开支需求。<Cites ns={[25, 27, 30, 35, 36]} /></>,
      <>供给状态更适合用情景而非单点表达：不同生产率、能源与贸易路径生成不同 inflation-output 组合。政策不是直接控制潜在产出，而是在授权内避免总需求长期偏离可持续供给并管理调整成本。<Cites ns={[29, 31, 33, 36, 112]} /></>,
    ],
    boundary: <>接口到 3.01 生产率与 4.14 商品—通胀—政策链。</>,
  },
  {
    id: 'financial-external-fiscal-state', number: 26, label: 'Financial / External / Fiscal State',
    title: '同一个政策利率，在不同信用利差、汇率、期限溢价与财政脉冲下代表不同有效金融条件。',
    paragraphs: [
      <>Stance 不能只读隔夜利率。按揭和企业融资成本、贷款标准、信用利差、股价、汇率与长端实际收益率共同决定需求，其中一部分又反映增长新闻而非政策。财政税支、债务期限和担保改变私人现金流与期限供给，外部能源与贸易同时移位通胀和产出。<Cites ns={[25, 27, 28, 30, 34, 35, 119]} /></>,
      <>这些变量既是输入也是结果：预期更紧政策先改变收益率与需求，新数据又反过来改路径。把当期金融条件和利率同时放入静态回归，可能控制掉传导或引入反向因果；设计要按事件时钟与因果位置选变量。<Cites ns={[64, 65, 66, 94, 119]} /></>,
    ],
    boundary: <>3.07–3.11 与 3.17–3.18 展开金融和财政传导。</>,
  },
  {
    id: 'forecast-distribution', number: 27, label: 'Forecast Distribution',
    title: '央行面向未来决策，相关对象是条件预测分布与尾部，而不只是 baseline 一条线。',
    formula: {
      label: 'Conditional forecast distribution',
      expression: <>D<sub>t,h</sub>(y | a,C,M,ℐ<sub>t</sub><sup>v</sup>)=Pr(y<sub>t+h</sub>≤y | 候选路径 a、条件 C、模型 M、实时信息)</>,
      note: <>每条分布依赖政策路径、油价或汇率等技术假设与模型。换条件导致预测变化，不必等于结构判断改变。</>,
    },
    paragraphs: [
      <>公开 projection 往往使用市场路径、固定汇率、油价曲线或“适当政策”条件；因此不能把 staff baseline 当委员会推荐路径。<Cites ns={[26, 29, 31, 33, 36]} /></>,
      <>均值相同的两条分布，一个可能窄而对称，另一个含去锚或危机右尾；非线性损失下动作会不同。Fan chart 和压力情景可暴露尾部，但没有校准概率的 scenario 不能冒充概率预测。<Cites ns={[47, 50, 112, 115, 116]} /></>,
    ],
  },
  {
    id: 'loss-function', number: 28, label: 'Loss Function',
    title: '损失函数把目标与权衡翻译成可计算对象，是研究模型而不是法律文本的隐藏版本。',
    formula: {
      label: 'Illustrative intertemporal loss',
      expression: <>L<sub>t</sub>(a)=E<sub>t</sub><sup>v</sup>Σ<sub>h=0</sub><sup>H</sup>β<sup>h</sup>[λ<sub>π</sub>(π<sub>t+h</sub>−π*)²+λ<sub>x</sub>x<sub>t+h</sub>²+λ<sub>Δ</sub>(Δi<sub>t+h</sub>)²+λ<sub>F</sub>TailRisk<sub>t+h</sub>]</>,
      note: <>β折现未来；λ是研究者设定或估计的模型权重。平滑和尾险项展示可能的约束，不能从一次声明读出精确数值。</>,
    },
    paragraphs: [
      <>二次形式便于解释边际权衡，却会把层级目标、区间、非对称损失和 ELB 非线性压平。公开框架可限制可接受的权重排序，却很少点识别参数；多个权重、预测和 r-star 组合也能生成同一动作。<Cites ns={[7, 10, 16, 19, 38, 47, 50, 113]} /></>,
      <>因此损失值只能在冻结归一化、期限与权重下比较。把课堂 loss=0.64 写成某央行“福利损失”，是类别错误。<Cites ns={[41, 112, 116]} /></>,
    ],
  },
  {
    id: 'weights-hierarchy', number: 29, label: 'Weights / Hierarchy',
    title: '权重不是“更关心谁”的道德评分，而是授权、冲击代价、期限和模型形成的边际权衡。',
    paragraphs: [
      <>Balanced approach 表示双目标不互补时权衡偏离幅度和预计持续时间，不提供固定 λπ/λx。ECB 的首要目标更接近层级约束，不能硬塞进同一加权和；即使使用 loss function，也应以约束或敏感性区间反映制度差异。<Cites ns={[2, 5, 6, 7, 38]} /></>,
      <>从历史利率反推权重有联合识别问题：相同动作可来自不同预测、r-star、模型、风险态度或工具约束。更诚实的结论是“在这些状态与模型假设下，某权重区间可以理解决定”，而非宣布真实 λ 等于某点。<Cites ns={[57, 63, 72, 115]} /></>,
    ],
  },
  {
    id: 'discount-horizon', number: 30, label: 'Discount / Horizon',
    title: '怎样折现未来、选择预测窗口和惩罚路径波动，会改变“早行动还是等信息”的答案。',
    paragraphs: [
      <>高 β 或长 H 让远期偏离更重要，但模型越向远期，误差与制度变化越大。λΔ 可抑制政策大跳，也可能被误读为偏爱平滑；金融脆弱、沟通成本与学习价值同样会生成渐进路径。<Cites ns={[38, 50, 60, 61, 113]} /></>,
      <>等待有 option value，也有失控风险。若数据很快揭示冲击且锚定稳定，等待减少误动；若通胀过程非线性或有去锚尾险，延迟会迫使后来调整更陡。最优期限必须与不确定性结构一同报告。<Cites ns={[39, 78, 116]} /></>,
    ],
  },
  {
    id: 'model-constraint', number: 31, label: 'Model Constraint',
    title: '所有路径都来自某种传导模型；稳健决策寻找跨合理模型仍成立的行动与失效条件。',
    paragraphs: [
      <>DSGE、半结构模型、VAR、微观证据与 judgment 分别擅长一致性、情景、统计动态和制度细节。模型集可给出不同乘数与滞后；ensemble 平均能降低特定误差，却不能消除共同遗漏。<Cites ns={[50, 70, 115, 117]} /></>,
      <>应并列 baseline、替代模型、参数区间和反例。Hansen–Sargent 式稳健控制会对不利邻近模型加权，但“更保守”不总等于动作更小：若错设主要放大通胀右尾，稳健政策可能更强。<Cites ns={[78, 115, 116]} /></>,
    ],
    boundary: <>40 节单独讨论模型不确定性，38 节讨论稳健风险管理。</>,
  },
  {
    id: 'demand-shock', number: 32, label: 'Demand Shock',
    title: '需求冲击常使产出和通胀同向偏离，让两项稳定目标较容易相容；“同向”仍需被识别。',
    paragraphs: [
      <>财政扩张、信用放松、财富增加或偏好变化可以抬高支出，相对供给形成正 output gap 并逐步推升通胀；紧缩经实际率和金融条件逆转这条链。在标准新凯恩斯框架里，此类冲击常使提高利率同时降低未来通胀与过热。<Cites ns={[47, 50, 51]} /></>,
      <>但强增长与高通胀不足以识别需求冲击：生产率上升可提高增长并降低单位成本，能源供给恶化可抬价并压增长，政策本身也改变数据。研究应锁定冲击代理或事件，不能用结果符号给冲击命名。<Cites ns={[64, 65, 66]} /></>,
    ],
    boundary: <>3.01 接手需求分解，3.02 接手通胀生成。</>,
  },
  {
    id: 'supply-shock', number: 33, label: 'Supply Shock',
    title: '供给冲击制造通胀与活动的短期冲突；是否 look through 取决于持久性、二轮效应和锚定。',
    paragraphs: [
      <>能源、关税、灾害或供应链中断可压低实际收入和产能并抬价。立即完全抵消 headline 会进一步压活动，完全不反应又可能让冲击进入工资、调价和长期预期。政策对象不是第一轮相对价格，而是它是否改变中期广泛通胀过程。<Cites ns={[25, 28, 30, 32, 35, 51]} /></>,
      <>短暂、窄、锚定稳且需求弱时，可容许更慢回归；持续、广泛、工资价格反馈强或长端预期敏感时，应更快收紧。反方向的正供给冲击也可能在低通胀或 ELB 下要求宽松。<Cites ns={[7, 10, 16, 19, 47, 50]} /></>,
    ],
    boundary: <>“供给冲击”是待验证分类，不是声明中的标签，也不是一律不反应的许可证。</>,
  },
  {
    id: 'shock-identification', number: 34, label: 'Shock Identification',
    title: '冲击是相对于结构信息集的外生创新；价格、产出或利率残差不会因“意外”二字自动成为结构冲击。',
    formula: {
      label: 'Structural representation',
      expression: <>s<sub>t</sub>=A(L)s<sub>t−1</sub>+Bε<sub>t</sub></>,
      note: <>只有对 B 施加可辩护限制，或使用外部工具、叙事记录与高频窗口后，ε 才获得经济含义；不同方法回答不同 estimand。</>,
    },
    paragraphs: [
      <>递归排序、符号限制、proxy SVAR 与叙事法的结论都依赖识别假设。央行还可能掌握研究者没有的信息：加息伴随增长预测上调时，市场反应混合纯政策收紧与央行信息新闻。<Cites ns={[64, 65, 66]} /></>,
      <>高频窗口减少其他新闻，却不会自动排除信息效应、路径或资产购买新闻、提前泄漏和微观流动性。严谨写法是“在假设 H 下识别的 shock”，而不是“真实 shock”。<Cites ns={[66, 94]} /></>,
    ],
    boundary: <>本章只给识别边界；完整方法、工具有效性与稳健性由 Chapter 7 接手。</>,
  },
  {
    id: 'divine-coincidence-break', number: 35, label: 'Divine Coincidence Break',
    title: '只有价格黏性是扭曲且冲击简单时，稳定通胀才可能同时稳定福利相关产出缺口。',
    paragraphs: [
      <>成本推动冲击、工资黏性、金融摩擦、行业异质性、税收和开放经济楔子会打破 divine coincidence，使通胀、活动和金融稳定不再完全同向。政策前沿因此取代单一最优点：降低更多通胀波动，通常要接受某种活动或路径波动。<Cites ns={[50, 51, 113, 119]} /></>,
      <>这不意味着“什么都重要”。研究应先指定主扭曲与结果，再问加入哪一个楔子会显著改变政策排序；若所有摩擦都可自由变化，任何动作都能事后解释，模型就不可证伪。<Cites ns={[38, 115, 117]} /></>,
    ],
  },
  {
    id: 'risk-distribution', number: 36, label: 'Risk Distribution',
    title: '风险管理关注完整结果分布与尾部损失，不能退化为在 baseline 上主观加几个基点。',
    paragraphs: [
      <>若损失非线性，E[L(y)]≠L(E[y])。同样平均通胀路径，一条含去锚或金融失序右尾会要求不同动作。风险评估应给概率、条件损失、可逆性和工具有效性；无法给概率的 scenario 必须标为压力路径。<Cites ns={[112, 115, 116]} /></>,
      <>风险分布还随政策内生变化：强收紧可缩小通胀右尾，却扩大失业或金融左尾；等待增加信息，也可能使尾险累积。报告“风险偏上”不等于证明加息最优，仍须比较净损失。<Cites ns={[39, 78, 118]} /></>,
    ],
  },
  {
    id: 'brainard-attenuation', number: 37, label: 'Brainard Attenuation',
    title: '经典乘数不确定性可以让反应更谨慎，但“越不确定越少行动”不是普遍定理。',
    formula: {
      label: 'One-period teaching model',
      expression: <>L(a,b)=(g−ba)²；　a*=g·E[b]/E[b²]；　E[b²]=Var(b)+E[b]²</>,
      note: <>g 是 normalized gap，a 是 normalized action，不是利率百分点；b 的单位是 gap/action，E[b²] 的单位是 (gap/action)²。</>,
    },
    paragraphs: [
      <>在这个对称二次模型中，较大的乘数方差抬高 E[b²]，最优动作会小于把 b 固定在均值时的 certainty-equivalent 结果；直觉是担心动作过头。<Cite n={39} /></>,
      <>若不确定性涉及冲击持久性、尾部灾难、预期非线性或乘数方向，等待可能更危险，最优反应反而放大。Söderström 等结果说明方向取决于不确定性的类型；“uncertainty elevated”不能直接翻译为 hold。<Cites ns={[78, 116]} /></>,
    ],
  },
  {
    id: 'robust-risk-management', number: 38, label: 'Robust Risk Management',
    title: '稳健政策不是最温和动作，而是在可信模型集合中避免不可逆大损失并保留纠偏能力。',
    paragraphs: [
      <>Min-max 或 ambiguity-averse 方法对不利模型加权；simple robust rules 则寻找跨模型表现不差的映射。若去锚损失陡峭，稳健动作可能前置；若乘数方向稳定但大小不明，渐进与分步更新可能更优。<Cites ns={[115, 116, 117]} /></>,
      <>稳健性必须有邻域：哪些模型、参数和状态算可信。把一切想象灾难放入最坏情形，会允许任意政策。出版级研究应报告 baseline、使结论翻转的最小条件、可观测预警指标与下一次更新时点。<Cites ns={[70, 115, 116]} /></>,
    ],
  },
  {
    id: 'data-uncertainty', number: 39, label: 'Data Uncertainty',
    title: '抽样、季调、基准修订、发布滞后与不可观测概念会同时污染状态估计和规则回归。',
    paragraphs: [
      <>初值 GDP、就业、价格与工资会修订；潜在产出、output gap 和 NAIRU 甚至没有最终可直接观测真值。Orphanides 的实时证据显示，用最终数据回看会显著改变历史规则评价。<Cites ns={[57, 58, 76, 77]} /></>,
      <>实践应保存 vintage panel、release calendar 与修订分布，并把关键 gap 写成区间。Nowcast 可融合高频数据，却仍受模型和 publication lag 影响；实时误差既不自动支持等待，也不自动支持忽略数据。<Cites ns={[73, 74, 75, 76]} /></>,
    ],
  },
  {
    id: 'model-uncertainty', number: 40, label: 'Model Uncertainty',
    title: '即使数据无误，Phillips 曲线、自然利率、金融乘数和预期形成机制仍可能弱识别或随制度变化。',
    paragraphs: [
      <>不同模型会给同一动作不同的滞后与峰值；r-star 和 output gap 估计又共同依赖趋势、通胀过程和 shock assumptions。模型平均不能修复共同遗漏，单一滤波器的置信带也常未覆盖结构不确定性。<Cites ns={[68, 69, 70, 72, 75, 115]} /></>,
      <>实践要分参数不确定、模型集合不确定和未知未知：前两者可做敏感性与 ensemble，第三类只能靠情景、可逆决策与监测。如果结论只在某个 Phillips slope 或 r-star 点估计下成立，条件应写进主张。<Cites ns={[73, 78, 116, 117]} /></>,
    ],
  },
  {
    id: 'nonlinearity-elb', number: 41, label: 'Nonlinearity / ELB',
    title: '在有效下限、信用断裂或预期失锚附近，政策乘数和可行集会非线性改变。',
    paragraphs: [
      <>名义率接近下限时，负自然率需求与政策率无法充分下调形成缺口；对未来利率路径的可信承诺、资产购买与财政互动变得更重要。“更久更低”通过预期未来短率影响长端，但效果取决于可信度与主体的实际敏感性。<Cites ns={[79, 80, 81, 82, 85]} /></>,
      <>标准模型可能产生 forward-guidance puzzle：遥远承诺效果异常巨大；有限注意、异质主体和市场分割会衰减。ELB 也不意味着长端完全不动，事件期收益率对新闻的敏感度仍可检验。<Cites ns={[86, 87, 88]} /></>,
    ],
    boundary: <>56 节接手工具菜单，58 节接手承诺；3.09–3.11 接手传导。</>,
  },
  {
    id: 'financial-imbalance-risk', number: 42, label: 'Financial-imbalance Risk',
    title: '信用繁荣与资产负债表脆弱性会改变未来损失分布，但工具比较优势必须显式评估。',
    paragraphs: [
      <>低利率可能经风险承担、期限错配和抵押品价格积累脆弱性；危机概率虽低，损失可大。另一方面，以全经济利率压一个市场会伤及就业与价格稳定，定向资本、LTV/DTI 或流动性要求可能更有效。<Cites ns={[118, 119, 120]} /></>,
      <>金融条件收紧也可能来自纯风险溢价而非政策；若信用利差进入 IS 曲线，央行对 spread 反应可能只是在抵消传导楔子。研究要区分“金融稳定是独立终点”与“金融变量预测法定目标”。<Cites ns={[119, 120]} /></>,
    ],
  },
  {
    id: 'distribution-sector-boundary', number: 43, label: 'Distribution / Sector Boundary',
    title: '货币政策有异质分配效应，但分配结果作为目标、约束还是传导，取决于授权与工具。',
    paragraphs: [
      <>加息在借款人／储户、浮动／固定利率、年轻／年长、银行／非银与行业之间重分配现金流；这些差异会改变 aggregate multiplier。因此分配信息即使不是最终目标，也可作为传导状态进入判断。<Cites ns={[1, 5, 9, 18, 20, 50]} /></>,
      <>不能因为政策有分配后果，就推断央行获得任意再分配目标。若某群体受冲击但总目标路径不变，定向财政或监管可能更合适；若异质边际消费倾向改变总需求，它才是反应函数输入。始终标明“目标—机制—工具”角色。<Cites ns={[37, 119, 120]} /></>,
    ],
  },
  {
    id: 'reaction-function', number: 44, label: 'Reaction Function',
    title: '反应函数是制度、实时状态、预测、风险和承诺到政策路径的条件映射，不是利率序列本身。',
    formula: {
      label: 'General conditional mapping',
      expression: <>a<sub>t</sub>=g(s<sub>t</sub><sup>v</sup>,D<sub>t</sub>,m<sub>t</sub>,a<sub>t−1</sub>,C<sub>t</sub>;θ<sub>t</sub>)+u<sub>t</sub></>,
      note: <>a 可是一整条利率、资产负债表与沟通路径；s 是实时状态，D 是预测分布，m 是制度与工具状态，C 是承诺/约束，θ 可随政体变化。u 只是相对所设 g 的未解释项。</>,
    },
    paragraphs: [
      <>结构反应函数、经验回归和规范规则不同：规范规则问“应怎样”，经验规则拟合“曾怎样”，结构函数解释“在该制度和信息下为何怎样”。把三者混用，会用拟合好坏替政策合法性背书，或把法律目标误读成固定系数。<Cites ns={[47, 50, 51, 52, 56, 57, 63]} /></>,
      <>未完成识别前，u 只能叫 residual；漏掉实时 forecast revision 会把系统反应错叫 shock，加入事后数据又会泄漏未来。<Cites ns={[57, 58, 64, 65]} /></>,
    ],
  },
  {
    id: 'taylor-rule', number: 45, label: 'Taylor Rule',
    title: 'Taylor rule 是透明的规范／描述基准，不是任何央行实际遵循的事实法则。',
    formula: {
      label: 'Classic 1993-style benchmark',
      expression: <>i<sub>t</sub>=r*+π<sub>t</sub>+0.5(π<sub>t</sub>−π*)+0.5x<sub>t</sub></>,
      note: <>等价展开后对 π 的总系数为 1.5；不能在已经写了 +π 后再把通胀 gap 乘 1.5。利率为年率百分比，gap 项贡献为百分点。</>,
    },
    paragraphs: [
      <>规则把名义中性率 r*+π 与通胀和产出 gap 修正相加，适合组织反事实、暴露假设并衡量实际决定相对简单系统反应的位置。<Cite n={53} /></>,
      <>1993 示例使用特定美国数据和假设；替换指数、实时 gap、r-star、系数、平滑或 ELB 截断都会大改结果。历史比较可以使用 Taylor-type rules，但必须展示 vintage 与敏感性，不能把偏离直接叫政策错误。<Cites ns={[55, 57, 58, 117]} /></>,
    ],
  },
  {
    id: 'neutral-rate', number: 46, label: 'Neutral Rate',
    title: 'r-star 是使经济中期接近潜在产出并维持价格稳定的实际利率概念，不是当天可观察数字。',
    paragraphs: [
      <>Wicksell 的自然利率连接储蓄、投资与价格稳定；现代 r-star 受趋势增长、人口、风险、全球储蓄、财政和安全资产需求影响。Laubach–Williams 等状态空间模型把它作为随时间变化的潜变量，估计会修订且模型间分叉。<Cites ns={[67, 68, 69, 70, 71]} /></>,
      <>r-star 弱识别意味着区间常很宽。“政策率高于 r-star”只在指定预期通胀、期限与模型后有含义；央行可以综合多个估计形成区间，却不能直接把中位数设为操作目标。<Cites ns={[70, 72, 73]} /></>,
    ],
    boundary: <>3.08 完整讨论实际利率与资产定价。</>,
  },
  {
    id: 'real-rate-gap', number: 47, label: 'Real-rate Gap',
    title: '实际政策缺口要匹配名义路径、预期通胀与 r-star 的期限；符号提供线索，却不是完整 stance。',
    formula: {
      label: 'Horizon-matched real-rate gap',
      expression: <>gap<sup>r</sup><sub>t,h</sub>=i<sub>t,h</sub>−E<sub>t</sub>π<sub>t,t+h</sub>−r*<sub>t,h</sub></>,
      note: <>正值通常表示相对中性偏紧。例：一年名义预期4.0%、同对象预期通胀2.8%、r*=0.8%，gap=+0.4pp。</>,
    },
    paragraphs: [
      <>三项必须匹配期限，Eπ 与 r-star 还有测量和模型误差；将十年通胀补偿、隔夜名义率与中性短率拼在一起，没有明确经济对象。<Cites ns={[67, 68, 69]} /></>,
      <>长期借贷率、期限溢价、信用利差、汇率和资产负债表政策，会让同一短端 gap 对应不同金融条件。声明中的“restrictive”是综合判断，不能只用一个 r-star 点估计裁决。<Cites ns={[70, 71, 72, 119]} /></>,
    ],
    boundary: <>3.07–3.11 接手曲线、期限溢价与传导。</>,
  },
  {
    id: 'policy-inertia', number: 48, label: 'Policy Inertia',
    title: '平滑路径可能来自调整偏好、持续状态、沟通约束或数据学习；看到自回归不等于识别结构惯性。',
    formula: {
      label: 'Partial-adjustment representation',
      expression: <>i<sub>t</sub>=ρi<sub>t−1</sub>+(1−ρ)i<sub>t</sub><sup>*</sup>+ε<sub>t</sub>，　0≤ρ&lt;1</>,
      note: <>ρ 高说明观测路径渐进，但目标路径 i* 本身可能高度持续；两种机制在宏观时间序列中很难区分。</>,
    },
    paragraphs: [
      <>央行可能分步行动以等待信息、降低金融跳跃或引导预期，也可能只是通胀 gap、r-star 和外部状态持续，即使完全反应仍生成平滑利率。经验式的 lagged rate 会把二者混合。<Cites ns={[56, 60, 61]} /></>,
      <>Rudebusch 等争论说明，应同时观察声明路径、预测 revision 与随后动作，不能把 ρ 直接解释成“央行害怕变动”。<Cites ns={[60, 61]} /></>,
    ],
  },
  {
    id: 'forecast-based-rule', number: 49, label: 'Forecast-based Rule',
    title: '前瞻反应把候选路径下的条件预测作为输入，更接近实际决策，却更依赖模型与假设。',
    formula: {
      label: 'Forecast-based mapping',
      expression: <>a<sub>t</sub>=g(E<sub>t</sub><sup>v</sup>[π<sub>t+h</sub>−π*],E<sub>t</sub><sup>v</sup>[x<sub>t+h</sub>],Risk<sub>t</sub>,Constraints<sub>t</sub>)</>,
      note: <>比较的是候选工具路径下的目标预测，不是把一条无条件 baseline 代入机械公式。</>,
    },
    paragraphs: [
      <>若预测已假定市场利率路径，决策者采用另一条路径后必须重算结果；把 conditioning path 当推荐路径会循环论证。<Cites ns={[47, 48, 52]} /></>,
      <>前瞻不等于忽略当前数据：成分、工资、信用和预期为持久性与模型误差提供信号。预测越远，不确定性越大，应辅以情景与稳健性，而非假装精确微调。<Cites ns={[29, 31, 33, 36, 114, 115]} /></>,
    ],
  },
  {
    id: 'targeting-vs-instrument-rule', number: 50, label: 'Targeting Rule vs Instrument Rule',
    title: 'Instrument rule 直接映射工具；targeting rule 规定目标变量关系，再由模型寻找实现路径。',
    paragraphs: [
      <>Taylor rule 是典型 instrument-rule 基准；forecast targeting 更接近“选择能让通胀与活动预测以可接受速度收敛的路径”。后者可容纳多工具与 judgment，代价是复现难且模型依赖强。<Cites ns={[47, 48, 52, 53]} /></>,
      <>Targeting rule 也不是只报目标：必须公开预测条件、criterion 与偏离解释；instrument rule 也不必机械执行，可以作为 cross-check。两者在清晰度与状态适应性之间权衡，不能按标签判优劣。<Cites ns={[48, 52, 113, 114]} /></>,
    ],
  },
  {
    id: 'regime-lucas-critique', number: 51, label: 'Regime / Lucas Critique',
    title: '政策规则一旦改变，私人预期与合同也会改变；旧相关性不能无条件预测新制度效果。',
    paragraphs: [
      <>Kydland–Prescott 与 Barro–Gordon 说明逐期最优可能产生通胀偏差，可信规则、声誉、委托或合约试图改变预期。Lucas critique 在这里意味着：估计于旧政体的 Phillips/IS 关系，换规则后未必保持。<Cites ns={[41, 42, 43, 44, 45, 46]} /></>,
      <>经验 reaction coefficients 也会随趋势通胀、目标框架、ELB 与委员会变化。Markov switching 或分样本只能描述变化，不能自动解释制度因果；还要连接生效日期、公告、过渡预期和同期冲击。<Cites ns={[59, 62, 63, 104, 105]} /></>,
    ],
    boundary: <>5.04 接手政策政体与制度历史。</>,
  },
  {
    id: 'committee-aggregation', number: 52, label: 'Committee Aggregation',
    title: '集体决策不是把每名委员的 Taylor rule 取平均；信息共享、议程、投票与公开度共同决定动作。',
    paragraphs: [
      <>委员可能拥有不同预测、损失、风险判断与工具偏好。多数票、中位选民、共识和顺序投票能生成不同结果，staff baseline 与主席建议也会改变可选集合。<Cites ns={[95, 96, 97, 98, 101]} /></>,
      <>公开记录提高问责并帮助市场理解分歧，却会改变内部发言与战略。SEP dots 或票数是观察窗口，不是稳定偏好参数；用姓名面板估计前，要处理成员更替、共同信息和议题选择。<Cites ns={[99, 100, 102, 103]} /></>,
    ],
  },
  {
    id: 'state-calendar-guidance', number: 53, label: 'State / Calendar / Guidance',
    title: '未来政策语言可分状态依赖、日历依赖与纯预测；三者对承诺和市场路径含义不同。',
    paragraphs: [
      <>状态依赖写“若通胀、就业或传导达到条件则……”，保留对新数据反应；日历依赖写“至少到某日期……”，更清晰但在冲击下可能失配；纯预测只描述当前信息下的可能路径，并不约束未来选择。许多表述混合三者，必须逐句标注。<Cites ns={[2, 7, 10, 80, 91]} /></>,
      <>可信 guidance 需要条件、退出条款与工具能力。市场还会区分“低利率因为经济弱”的 Delphic 信息和“即使改善仍保持低”的 Odyssean 承诺；若不分解，长率下降不能证明承诺渠道有效。<Cites ns={[80, 81, 86, 87, 91]} /></>,
    ],
  },
  {
    id: 'systematic-surprise', number: 54, label: 'Systematic Component / Surprise',
    title: '公告意外必须相对于会前信息与预期定义；反应函数残差要经额外识别才能叫政策 shock。',
    formula: {
      label: 'Announcement-news vector, not an unweighted scalar sum',
      expression: <>z<sub>t</sub><sup>ann</sup>=(S<sub>target</sub>,S<sub>path</sub>,N<sub>info</sub>,N<sub>other</sub>)′；　Δp=β<sub>T</sub>S<sub>T</sub>+β<sub>P</sub>S<sub>P</sub>+β<sub>I</sub>N<sub>I</sub>+β<sub>O</sub>N<sub>O</sub>+η</>,
      note: <>Target、path、information与其他工具新闻先构成向量，可能来自不同合约、期限、事件窗和单位，不能直接相加。只有针对明确资产价格Δp并估计或限制载荷β后，各因素才被映射到共同的左端单位。</>,
    },
    paragraphs: [
      <>Kuttner 用 fed funds futures 区分预期与意外目标变动，是 surprise 算术的重要基准，但它不会自行排除信息效应、前瞻指引或同期资产购买。<Cite n={94} /></>,
      <>回归 residual 取决于研究者放入 g 的变量、vintage 与函数形式。漏掉实时 forecast revision 会把系统反应错叫 shock；加入事后数据又制造 look-ahead。<Cites ns={[57, 58, 64, 65]} /></>,
    ],
  },
  {
    id: 'target-path-information', number: 55, label: 'Target / Path / Information',
    title: '同一次公告至少能改变当前工具、预期未来路径和市场对基本面的判断。',
    paragraphs: [
      <>纯紧缩成分通常抬短率、压股价；若央行同时透露经济比市场想象更强，利率与股价可能同涨；若路径比当前动作更鸽，当期加息也可伴长端下行。利率 surprise 因此不是单维政策量。<Cite n={66} /></>,
      <>高频主成分、不同期限合约与股债联合符号有助分解，却各自依赖窗口、流动性和符号限制。文本 language shock 也会混合信息与承诺，应使用多窗口和替代分类做稳健性。<Cites ns={[89, 90, 91, 92, 93, 99]} /></>,
    ],
    boundary: <>3.23 接手完整宏观 surprise 与资产价格分解。</>,
  },
  {
    id: 'instrument-menu', number: 56, label: 'Instrument Menu',
    title: '央行选择的是工具组合；政策率、操作框架、资产购买、贷款工具、外汇与沟通不能压成同一“利率”。',
    paragraphs: [
      <>常态下短端政策率往往是主要 stance 工具，实施由 3.06 处理；ELB 或市场失灵时，资产购买可经期限、稀缺／便利收益、信号和市场功能渠道作用，贷款工具针对融资摩擦，沟通改变预期路径。<Cites ns={[8, 14, 23, 24, 89, 90, 91, 92, 93]} /></>,
      <>中国框架并行使用总量、价格和结构性工具，不能强找一个与 fed funds target 完全同构的单一利率；反过来，资产负债表扩大也可能只是流动性实施而非额外宽松。每项工具都要记录目标、交易对手、期限、价格、数量与退出条款。<Cites ns={[20, 21, 23, 24]} /></>,
    ],
  },
  {
    id: 'policy-point-path', number: 57, label: 'Policy Point / Path',
    title: '经济与资产主要响应预期整条政策路径和金融条件，而不是公告日的单个利率点。',
    paragraphs: [
      <>SEP dots 是参与者在各自适当政策假设下的个体投影；Eurosystem staff baseline、BoE conditioning path、BoJ、RBA 与 BoC 预测也各有条件。它们帮助理解信息集，却不是委员会共同承诺。<Cites ns={[26, 29, 31, 33, 36]} /></>,
      <>同样的 hold 可以是路径整体不变，也可以是今天不动但未来更陡，或利率不动而 QT／沟通改变。资产定价必须比较会前和会后的预期路径，不能只按“加／减／不变”三分类。<Cites ns={[66, 86, 87, 91]} /></>,
    ],
  },
  {
    id: 'commitment-time-consistency', number: 58, label: 'Commitment / Time Consistency',
    title: '承诺的价值来自改变未来预期，但未来状态到来时重新优化的诱因会削弱可信度。',
    paragraphs: [
      <>时间不一致模型说明，事后可能有制造意外通胀或提前退出宽松的诱因；制度授权、声誉、合约和可验证状态条件可以帮助约束。承诺不是更长的预测，而是让未来选择集合或违约代价发生变化。<Cites ns={[41, 42, 43, 44, 45, 46]} /></>,
      <>ELB 下“更久更低”可降低预期实际长率，但标准模型有时给出不现实的巨大远期效应；有限注意与异质主体会衰减。好的 guidance 同时说明状态、期限、退出条件和不确定性，不把日历语言当永久保证。<Cites ns={[80, 81, 85, 86, 87]} /></>,
    ],
  },
  {
    id: 'closed-policy-loop', number: 59, label: 'Closed Policy Loop',
    title: '政策既回应状态又创造状态；评估必须把预期、金融条件与后续数据放回闭环。',
    formula: {
      label: 'Policy feedback loop',
      expression: <>ℐ<sub>t</sub><sup>v</sup>→s<sub>t</sub><sup>v</sup>→a<sub>t</sub>→&#123;yield,credit,FX,beliefs&#125;→&#123;demand,wages,prices&#125;→s<sub>t+1</sub><sup>v′</sup>→a<sub>t+1</sub></>,
      note: <>公告前市场已经为预期路径定价；动作、路径、信息和随后状态共同演化，不能用单向相关性评价整个系统。</>,
    },
    paragraphs: [
      <>“加息后长率下降”可能因为动作小于预期、路径更鸽或增长信息变化，不证明传导失效；事后通胀回落也不能只归政策，因为供给与财政同时变化。<Cites ns={[50, 51, 64, 66, 94]} /></>,
      <>可识别研究应切断局部边：例如用会前 futures 构造 target surprise，估计分钟级两年收益率响应；或用实时 projection revision 估计系统反应。完整 world model 指导边界，却不要求一次回归识别整个闭环。<Cites ns={[57, 65, 94]} /></>,
    ],
  },
];

const checks: { question: string; answer: string; sourceIds: number[] }[] = [
  { question: '为什么“Fed 有 2% 法定目标”不准确？', answer: '§2A 给出最大就业、稳定价格和适度长期利率；2% PCE 来自 FOMC 策略。最低合格点是明确“法律不等于策略”。', sourceIds: [1, 2] },
  { question: '用四层拆解“BoE 维持 3.75%”。', answer: 'Act 与 remit 分属法律和策略；7月声明是当次决定；隔夜实施属于 3.06。一次 hold 不能推出稳定规则。', sourceIds: [9, 10, 30] },
  { question: '为什么 PBOC 年度 CPI 约 2% 不能写成永久央行点目标？', answer: '发布主体、有效期、法律目标与多工具框架不同。年度政府目标不是法律中的永久数值目标。', sourceIds: [20, 21, 22, 23, 24] },
  { question: '点目标 2%、1–3% 区间中点 2% 和平均通胀 2% 为何不等价？', answer: '越界含义、跨期补偿、问责触发和允许路径不同；相同中点不保存这些制度差异。', sourceIds: [2, 16, 49] },
  { question: '解释“对称不等于同幅即时反应”。', answer: '偏离来源、持久性、锚定、双目标代价和政策滞后不同，对称只约束长期方向。', sourceIds: [2, 7] },
  { question: '解释 7 月 29 日政策时为什么不能用 8 月修订 output gap。', answer: '那是未来信息。基准反应只能使用会前可得 vintage，最终修订只能作为事后敏感性。', sourceIds: [57, 58, 76] },
  { question: '供给冲击何时可较多 look through，何时不能？', answer: '短暂、窄、锚定稳且需求弱时可更慢；持续、广泛、二轮效应强或去锚时需要更强响应。', sourceIds: [7, 51, 112] },
  { question: 'Brainard 原则为什么不是“不确定就少做”？', answer: '经典乘数方差可衰减动作，但方向、持久性、非线性与尾险不确定可放大动作。', sourceIds: [39, 78, 116] },
  { question: 'Taylor 基准中为什么对通胀的总响应是 1.5？', answer: '式中已有 +π，再加 0.5(π−π*)；不能在 gap 项上重复使用 1.5。', sourceIds: [53] },
  { question: 'r-star 为什么不能直接观察？', answer: '它是模型依赖、会修订且弱识别的潜变量；使用时须给期限、预期通胀、模型与区间。', sourceIds: [68, 69, 70, 71, 72, 73] },
  { question: '高 lagged-rate 系数为什么不证明央行偏好平滑？', answer: '持续状态、序列相关冲击、测量误差和遗漏变量也会生成高自回归。', sourceIds: [60, 61] },
  { question: 'Reaction-function residual 何时才可叫 shock？', answer: '保存实时信息、定义系统成分并施加可辩护结构识别之后；未解释项本身不够。', sourceIds: [57, 64, 65] },
  { question: '公告后利率和股价同涨能说明什么？', answer: '可能混合紧缩路径与央行披露的正增长信息；不能只凭符号判定纯政策 shock。', sourceIds: [66, 94] },
  { question: '怎样把完整闭环压成可证伪问题？', answer: '例如用会前 futures 构造分钟级 target surprise，估计两年收益率响应，同时声明事件窗、合约和未排除的信息成分。', sourceIds: [94] },
];

const glossary = [
  ['Mandate', '法律或条约规定的目标与治理', '不可混同策略数值或当次决定', '02–07'],
  ['Goal independence', '自行定义最终目标的权限', '不可混同工具自主', '04'],
  ['Instrument independence', '给定目标下选择工具和路径的权限', '不可混同无问责', '04–05'],
  ['Strategy / framework', '操作化指数、数值、期限与权衡的框架', '不可混同每次决定', '02、08–17'],
  ['Decision', '某会议和实时 vintage 下的行动向量', '不可混同长期规则', '19、44'],
  ['Implementation', '把决定变成市场隔夜条件', '不可混同目标本身', '18、56→3.06'],
  ['Target index', '定义价格稳定的具体篮子和变化率', '不可混同 core 指标或生活感受', '13'],
  ['Symmetric target', '持续上偏与下偏都不理想', '不可混同同幅即时动作或历史补偿', '15'],
  ['Policy horizon', '预期目标回归所用窗口', '不可混同固定日历承诺', '16'],
  ['State vector', '实时目标 gap、传导、约束与风险的有序状态', '不可混同数据堆砌', '20'],
  ['Output gap', '实际产出相对实时潜在产出的估计', '不可混同最终 GDP 增长', '23'],
  ['r-star', '中性实际利率的模型潜变量', '不可混同当前市场实际率或常数', '46'],
  ['Real-rate gap', '期限匹配的实际政策率减 r-star', '不可混同完整金融条件', '47'],
  ['Reaction function', '状态、预测、制度到行动路径的条件映射', '不可混同利率序列或 Taylor rule', '44'],
  ['Taylor principle', '持久通胀上升时名义率总响应大于一', '不可混同法定机械规则', '45'],
  ['Policy inertia', '观测路径渐进或结构调整偏好', '高自回归不自动识别后者', '48'],
  ['Monetary-policy shock', '相对系统反应正交、经假设识别的创新', '不可混同 residual 或公告动作', '34、54'],
  ['Central-bank information shock', '公告披露央行对经济状态的相对信息', '不可混同宽松或 target surprise', '55'],
] as const;

const interfaces = [
  ['I1 · 3.01 → 3.05', 'growthVintage、potentialGrowthRange、outputGapRange、demandVsSupplyTag', '实际增长率不能直接改名为 output gap。'],
  ['I2 · 3.02 → 3.05', 'targetIndex、headline、underlying、momentum、breadth、persistence、shockOrigin', '本节只做政策相关压缩，不重讲价格形成。'],
  ['I3 · 3.03 → 3.05', 'unemployment、participation、vacancies、hours、wageProductivityUnitCost、matchingState', '工资同比不能直接改名为 demand pressure。'],
  ['I4 · 3.04 → 3.05', 'subject×object×horizon×functional×vintage 的 expectation passport 与 anchoring state', 'Breakeven 不能直接当物理预期。'],
  ['I5 · 3.05 → 3.06', 'actionVector、effectiveDate、operatingTarget、corridor/floor terms、balanceSheetInstruction', '3.06 解释如何落到货币市场。'],
  ['I6 · 3.05 → 3.07/3.08', '会前／会后条件路径、target/path/info components 与 real-rate-gap 区间', '后续章节拥有曲线、期限溢价和资产定价。'],
  ['I7 · 3.05 ↔ 3.18', 'fiscalImpulse、debtMaturity、transfers/taxes、consolidatedBSConstraint', '本节不展开财政路径内生机制。'],
  ['I8 · 3.05 → 3.23 / Chapter 7', 'eventTime、expectationCutoff、stateVintage、systematicComponent、residualLabel、identificationAssumption', '只有后续识别后才命名 shock。'],
] as const;

const snapshotRows: { institution: string; mandate: string; decision: string; clock: string; guardrail: string; sourceIds: number[] }[] = [
  { institution: 'Federal Reserve', mandate: '§2A三项目标；FOMC策略为长期2% PCE与最大就业balanced approach', decision: '7/28–29会议；7/29 14:00 EDT维持3.50–3.75%，9–3', clock: '最新SEP为6/17条件性个人投影；7月MPR于7/10发布，一般资料截止7/8中午，各图可更早', guardrail: '一次hold或异议票不是固定反应函数；SEP不是承诺', sourceIds: [1, 2, 4, 25, 26, 27] },
  { institution: 'ECB', mandate: 'TFEU首要价格稳定；策略为欧元区HICP中期对称2%', decision: '7/23维持deposit/MRO/marginal lending 2.25/2.40/2.65%', clock: '公开staff baseline仍为6/11 projections；incoming data没有可压成单一日的统一cutoff', guardrail: '逐次会议且不预承诺路径；staff baseline不是委员会承诺', sourceIds: [5, 6, 7, 28, 29] },
  { institution: 'Bank of England', mandate: 'Act s11；2025 remit为12个月CPI 2% flexible IT', decision: '会议截至7/29；7/30维持Bank Rate 3.75%，6–3', clock: 'July MPR同日发布；cutoff按序列而异，市场路径示例为截至7/20的15个英国工作日均值', guardrail: 'Conditioning path不是MPC背书路径；票数不是稳定概率', sourceIds: [9, 10, 11, 30, 31] },
  { institution: 'Bank of Japan', mandate: 'Act Article 2；price-stability target为CPI同比2%', decision: '7/30–31会议；7/31以8–1维持无担保隔夜拆借率约1.0%，少数提议1.25%', clock: '7/31发布Statement与Bank’s View；完整Outlook于8/3发布', guardrail: 'Outlook预测不是目标；约1.0%不是永久中性率', sourceIds: [12, 13, 14, 32, 33] },
  { institution: 'Bank of Canada', mandate: 'Act与2021–26协议；2%为1–3%区间中点，并考虑maximum sustainable employment', decision: '7/15维持overnight target 2.25%、Bank Rate 2.50%、deposit 2.20%', clock: '截至9/1，7/15仍为最后已公布决定', guardrail: '协议到2026-12-31；截至9/1续约仍在进行，不预告结果', sourceIds: [15, 16, 17, 34] },
  { institution: 'Reserve Bank of Australia', mandate: 'Act ss 8AA, 9B；2025 Statement把2–3%区间、中点2.5%与full employment操作化', decision: '8/11一致维持cash rate target 4.35%', clock: 'August SMP同日发布，data cutoff为8/5', guardrail: 'SMP预测与neutral-rate判断不是承诺；决策体为Monetary Policy Board', sourceIds: [18, 19, 35, 36] },
  { institution: 'PBOC', mandate: '法律为保持币值稳定并以此促进增长；MPC为咨询议事；量、价、结构工具并行', decision: '以8/12 18:26 CST发布的2026Q2执行报告作为截至9/1最新综合框架vintage', clock: '2026政府工作报告的年度CPI预期目标约2%由政府发布', guardrail: '年度预期目标不是永久央行点目标；不强造一个等价fed funds的唯一政策率', sourceIds: [20, 21, 22, 23, 24] },
];

const evidenceGroups: { title: string; text: string; ids: number[] }[] = [
  { title: 'A｜法律、策略与当期 vintage', text: '官方层支持“当前制度或文件是什么”，不负责一般因果。#1–24覆盖七个制度的法律、策略、协议和框架；#25–36冻结截至2026-09-01的决定、预测与报告时钟。', ids: Array.from({ length: 36 }, (_, i) => i + 1) },
  { title: 'B｜目标、控制与规则／裁量', text: '理论层解释在明确假设下目标、工具、不确定性、承诺和forecast targeting为何可能成立；不能替代官方制度事实。', ids: Array.from({ length: 16 }, (_, i) => i + 37) },
  { title: 'C｜规则估计、政体与shock识别', text: '方法层要求声明实时信息集、函数形式与识别限制；规范规则、历史拟合与结构冲击不可互换。', ids: Array.from({ length: 14 }, (_, i) => i + 53) },
  { title: 'D｜潜变量与实时不确定性', text: '自然率、output gap与NAIRU是模型依赖、可修订的测量对象；不提供唯一真值。', ids: Array.from({ length: 12 }, (_, i) => i + 67) },
  { title: 'E｜ELB、非常规工具与公告surprise', text: '约束与事件层连接承诺、forward guidance、资产购买及期货surprise；课堂合成数值不由这些论文背书。', ids: Array.from({ length: 16 }, (_, i) => i + 79) },
  { title: 'F｜委员会与沟通', text: '集体选择层解释信息汇聚、投票程序、透明度与语言；公开分歧不是稳定个人偏好的直接观测。', ids: Array.from({ length: 9 }, (_, i) => i + 95) },
  { title: 'G｜复审、稳健性与金融稳定', text: '边界层区分评估、建议、回应、实施与最终策略，并给出模型稳健和金融稳定工具的条件命题。', ids: Array.from({ length: 17 }, (_, i) => i + 104) },
];

function Lesson305Content() {
  return (
    <>
      <section className="lesson-lead" id="thesis">
        <p className="section-kicker">00 · 核心命题</p>
        <h2>央行不是先“想加息或降息”再寻找理由，而是在法律授权、实时信息、目标权衡与工具约束下，选择一条会反过来改变未来状态的条件政策路径。</h2>
        <p>
          本节把政策生成链冻结为：法律授权与制度分工 → 目标对象、层级和期限 → 截至决策时点可见的实时状态与预测分布 → 冲击性质、风险和工具约束 → 条件反应 → 利率、资产负债表与沟通路径 → 3.06 的市场实施 → 金融条件、需求、就业、工资、通胀与预期 → 新一轮信息。反应函数因此不是按钮规则，而是制度化的状态—行动映射；行动又改变下一期状态，整条链是闭环。<Cites ns={[2, 7, 10, 13, 16, 19, 20, 47, 50]} />
        </p>
        <div className="causal-chain" aria-label="货币政策从授权到反馈的完整链条" role="list">
          <div role="listitem"><span>01</span><b>Mandate</b><p>法律分配目标、权力与责任。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>02</span><b>Objective</b><p>策略固定指数、层级与期限。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>03</span><b>State</b><p>实时信号被压成预测分布。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>04</span><b>Trade-off</b><p>冲击、风险与约束被权衡。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>05</span><b>Path</b><p>选择工具、路径与条件沟通。</p></div>
          <i aria-hidden="true">→</i><div role="listitem"><span>06</span><b>Feedback</b><p>实施和传导生成下一状态。</p></div>
        </div>
        <p>
          最常见的错误，是把法律、策略、某次决定和实施混成“央行政策”。法律回答谁被授权追求什么；策略回答怎样解释目标和权衡；当次决定回答在当时信息集下选择什么；实施回答如何把立场变成市场条件。Taylor rule、loss function 和 r-star 都是分析镜头，不是央行暗中照抄的法条。本节的中心问题不是“下一次加不加息”，而是：什么信息在什么制度下，以何种权重与不确定性进入什么条件路径。<Cites ns={[1, 5, 9, 12, 15, 18, 20, 37, 52, 53]} />
        </p>
        <PolicyReactionTransmissionChart />
      </section>

      <section className="lesson-section" id="scope-route">
        <p className="section-kicker">01 · 范围、边界与学习路线</p>
        <h2>先识别哪一层文件、哪一个时钟和哪一个状态变量，再讨论政策松紧，才能分开解释、预测与因果识别。</h2>
        <div className="learning-objectives">
          <span>四条并行路线 · 最后汇入同一条件映射</span>
          <ol>
            <li><b>制度路线（02–18）：</b>法律、权限、问责、目标层级、指数、形式、期限和目标—指标—工具分栏。</li>
            <li><b>状态路线（19–43）：</b>实时 vintage、状态向量、预测分布、损失权衡、需求／供给冲击、不确定性和金融边界。</li>
            <li><b>映射路线（44–59）：</b>反应函数、Taylor 基准、r-star、惯性、forecast targeting、委员会、guidance、工具与闭环。</li>
            <li><b>研究路线（54、59、62–63）：</b>把 surprise、residual 与 shock 分开，再将 world model 压成局部、可观察、可证伪的边。</li>
          </ol>
        </div>
        <p>
          本节不声称估计任何央行的“真实偏好参数”。公开文本、会议记录、市场价格、forecast revision 与政策动作只是带噪代理；同一动作还可能同时传递当期目标、未来路径和央行私有信息。严谨问题应写成“在冻结会前 cutoff 的预测修订给定后，机械 target surprise 怎样影响两年收益率”，而不是笼统问“央行为什么加息”。<Cites ns={[57, 58, 64, 65, 66, 94]} />
        </p>
        <div className="precision-note"><span>章节所有权</span><p>3.01–3.04 提供增长、通胀、劳动和预期状态；3.06 拥有实施；3.07–3.08 拥有曲线与实际率资产定价；3.23 拥有一般宏观 surprise；5.04 拥有政治经济与独立性制度史；Chapter 7 才完成识别设计。</p></div>
      </section>

      {conceptSections.map((section) => <PolicyConceptSection key={section.id} section={section} />)}

      <section className="lesson-section" id="interactive-lab">
        <p className="section-kicker">60 · Interactive Lab</p>
        <h2>先判对象与时钟，再判机制：十道题把制度分层、实时状态、规则、风险、路径和 surprise 变成可复算诊断。</h2>
        <p>
          测量模式 M1–M5 覆盖四层政策架构、目标指数、实时 gap、委员会聚合与跨央行时钟；机制模式 K1–K5 覆盖 Taylor 基准、Brainard 收缩、需求／供给权衡、ELB 路径和机械 target surprise。每道数值题都冻结单位，现实制度题则冻结到 2026-09-01 的来源时钟；答案与位置分布只保留在题库和工程断言中，不在作答前展示，以保护首次答案和置信度记录的诊断意义。
        </p>
        <PolicyReactionLab />
      </section>

      <section className="lesson-section" id="static-twins">
        <p className="section-kicker">61 · Static Twins</p>
        <h2>静态孪生题提供相同机制的完整、可打印、无脚本版本；它不是互动结果的摘要。</h2>
        <p>每道变式都改变数字或制度对象，却保留相同 estimand。你应先独立计算，再展开中间步骤；“合成教学值”不是任何央行的当前估计，跨央行快照则严格保持历史 cutoff。</p>
        <div className="case-grid" id="policy-static-twins">
          {policyReactionScenarios.map((scenario, index) => (
            <article className="case-card" key={scenario.id}>
              <span>STATIC {String(index + 1).padStart(2, '0')} · {scenario.synthetic ? 'SYNTHETIC' : 'INSTITUTIONAL / REAL-TIME'}</span>
              <h3>{scenario.staticTwin.title}</h3>
              <p><b>题干：</b>{scenario.staticTwin.prompt}</p>
              <ol>{scenario.staticTwin.calculations.map((step) => <li key={step}>{step}</li>)}</ol>
              <p><b>标准答案：</b>{scenario.staticTwin.answer}</p>
              <p><b>单位护栏：</b>{scenario.formulaUnits}</p>
              <p><b>来源：</b> <Cites ns={scenario.staticSourceIds} /></p>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="checks-glossary">
        <p className="section-kicker">62 · Checks / Glossary</p>
        <h2>掌握标准不是背出七家央行利率，而是能在陌生事件中重建层级、状态、映射、路径和识别边界。</h2>
        <p>逐题先口头回答，再展开标准。真正合格的答案必须给出条件或反例：什么时候高通胀不意味着更强收紧、什么时候 uncertainty 不意味着少行动、什么时候利率 surprise 不等于纯政策 shock。</p>
        <div className="check-list">
          {checks.map((check, index) => (
            <details key={check.question}>
              <summary>{index + 1}. {check.question}</summary>
              <p>{check.answer} <Cites ns={check.sourceIds} /></p>
            </details>
          ))}
        </div>
        <div className="term-grid" aria-label="3.05术语表">
          {glossary.map(([term, definition, confusion, section]) => (
            <article className="term-card" key={term}>
              <span>{section}</span><h3>{term}</h3><p>{definition}。</p><em>常见误读：{confusion}。</em>
            </article>
          ))}
        </div>
      </section>

      <section className="lesson-section" id="interfaces-reading">
        <p className="section-kicker">63 · Interfaces / Reading / Evidence Map</p>
        <h2>本节交付的是可追溯的 policy-state 接口；后续只能调用已经注明对象、期限、vintage 与识别状态的变量。</h2>
        <div className="interface-grid">
          {interfaces.map(([name, payload, guardrail]) => (
            <article key={name}><span>{name}</span><h3>交付字段</h3><p><code>{payload}</code></p><em>{guardrail}</em></article>
          ))}
        </div>

        <h3>截至 2026-09-01 的制度与政策快照</h3>
        <p className="precision-note"><span>历史 cutoff，不随页面更新时间滚动</span>观察截止为 2026-09-01 23:59；各来源原时区另列。2026-09-02 及以后发布不得回填，后续页面修订也必须保留这条历史标签。</p>
        <div className="table-scroll" role="region" tabIndex={0} aria-label="截至2026年9月1日的七个央行政策快照，可横向滚动">
          <table className="concept-table">
            <caption>法律／策略、当期决定、信息时钟和不可推出项分别保存</caption>
            <thead><tr><th scope="col">制度</th><th scope="col">目标护照</th><th scope="col">cutoff前最后决定</th><th scope="col">决定与信息时钟</th><th scope="col">不可推出什么</th></tr></thead>
            <tbody>
              {snapshotRows.map((row) => (
                <tr key={row.institution}>
                  <th scope="row">{row.institution}<br /><Cites ns={row.sourceIds} /></th>
                  <td>{row.mandate}</td><td>{row.decision}</td><td>{row.clock}</td><td>{row.guardrail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3>Evidence Map · claim type 先于 citation 数量</h3>
        <p>每条证据都应先标为 <code>institutional-fact | current-snapshot | mechanism | measurement | identification | boundary</code> 之一。官方文件回答“当前是什么”，理论论文回答“在假设下为什么可能”，方法论文回答“怎样识别”；三者不能互相代替。</p>
        <div className="evidence-map" aria-label="3.05连续覆盖120条来源的证据地图" role="group">
          {evidenceGroups.map((group) => (
            <div key={group.title}>
              <h3>{group.title}</h3>
              <p>{group.text} <Cites ns={group.ids} /></p>
            </div>
          ))}
        </div>

        <div className="precision-note"><span>研究落地的最小记录</span><p><code>jurisdiction, documentLayer, objectivePassport, decisionBody, meetingStart/End, informationCutoff, releaseTimeZone, stateVintage, actionVector, conditioningAssumptions, marketWindow, identificationAssumption</code>。缺失字段应标 unknown，不以叙事补齐。</p></div>
        <p>
          本节的最小复述是：<b>央行在法律授权和问责结构下，把目标指数、层级与期限操作化；再用当时可见、带测量误差的状态与条件预测识别目标冲突和尾部风险，形成一条状态依赖的工具与沟通路径。Taylor rule 只是透明基准，r-star 与 gap 是可修订潜变量，委员会投影不是正式决定，政策点位也不是整条路径。公告相对会前预期的机械 surprise、相对模型的 residual 和经结构假设识别的 shock 必须分开；工具通过 3.06 实施并改变金融条件与实体状态，结果再成为下一轮输入。</b>
        </p>
      </section>
    </>
  );
}

export const lesson305: LessonRecord = {
  slug: '3-05',
  id: '3.05',
  chapter: '03',
  chapterTitle: 'Macro State & Financial Conditions',
  title: 'Central Bank Objective & Reaction Function：从法律授权、实时状态到条件政策路径',
  subtitle: '分开法律授权、策略框架、当次决定与实施，再把实时状态、预测分布、冲击权衡和委员会判断接成一条可审计的政策路径',
  readingTime: '核心首读约 90–110 分钟；完整正文含逐式复算约 210–270 分钟；互动实验首次完成 25–35／含复盘 40–50，静态变式 25–35，检查与术语 25–35；来源与延伸阅读不计',
  prerequisite: '3.01–3.04；按需调用 T06 Balance Sheet 与 T08 Time / Vintage；与 3.06、3.07–3.08、3.18、3.23、5.04 和 Chapter 7 只建立清晰接口',
  updatedAt: '2026-09-02',
  revision: '3.05-r4',
  reviewStatus: 'double-reviewed',
  reviews: [
    {
      kind: 'accuracy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.05-r4',
      summary:
        '独立复核 64 个导航单元、120 条连续来源、20 组阅读、10 道互动与 10 道静态孪生，逐项核验七央行法律授权、策略、截至 2026-09-01 的决定与信息时钟，以及 Taylor、Brainard、实时 gap、r-star、委员会聚合、ELB 路径和公告 surprise 的公式、单位、算术、识别边界与章节接口；RBA 现行法、PBOC 2024 修订条例、论文 DOI、公告新闻向量、Kuttner 依据和 KC Fed 官方链接均由一手来源闭合，类型、规范、生产构建与冻结哈希一致，P0–P3 为 0。',
    },
    {
      kind: 'pedagogy',
      completedAt: '2026-09-02',
      decision: 'approved',
      revision: '3.05-r4',
      summary:
        '独立通读制度—状态—预测—权衡—行动—公告的零背景递进，并用真实应用内浏览器逐击 64/64 个深链、完成 10/10 互动题及错答诊断、双击防重、保留首答重做、刷新恢复、跨模式导航、完成态、两步重置、焦点和 ARIA；进一步验证作答前无答案泄露、5／2／1 列断点、390 像素零页面溢出、暗色对比、打印、noscript、首页与 3.04 导航、控制台和工程门禁，末次冻结哈希一致，P0–P3 为 0。',
    },
  ],
  previous: { slug: '3-04', label: '3.04 Inflation Expectations' },
  next: { slug: '3-06', label: '3.06 Monetary Policy Implementation' },
  sections: [
    { id: 'thesis', label: '核心命题' },
    { id: 'scope-route', label: '范围、边界与路线' },
    { id: 'institutional-layers', label: 'Institutional Layers' },
    { id: 'legal-mandate', label: 'Legal Mandate' },
    { id: 'assignment-independence', label: 'Assignment / Independence' },
    { id: 'accountability', label: 'Accountability' },
    { id: 'decision-body', label: 'Decision Body' },
    { id: 'objective-hierarchy', label: 'Objective Hierarchy' },
    { id: 'price-stability-objective', label: 'Price-stability Objective' },
    { id: 'employment-activity-objective', label: 'Employment / Activity' },
    { id: 'secondary-objectives', label: 'Secondary Objectives' },
    { id: 'financial-stability-boundary', label: 'Financial-stability Boundary' },
    { id: 'fiscal-fx-boundary', label: 'Fiscal / FX Boundary' },
    { id: 'target-index', label: 'Target Index' },
    { id: 'target-form', label: 'Target Form' },
    { id: 'symmetry', label: 'Symmetry' },
    { id: 'policy-horizon', label: 'Policy Horizon' },
    { id: 'escape-accountability-clause', label: 'Escape / Accountability' },
    { id: 'objective-indicator-instrument', label: 'Objective / Indicator / Instrument' },
    { id: 'information-set-vintage', label: 'Information Set / Vintage' },
    { id: 'policy-state-vector', label: 'Policy State Vector' },
    { id: 'inflation-state', label: 'Inflation State' },
    { id: 'expectation-anchor-state', label: 'Expectation / Anchor State' },
    { id: 'output-gap-state', label: 'Output-gap State' },
    { id: 'labor-gap-state', label: 'Labor-gap State' },
    { id: 'supply-capacity-state', label: 'Supply-capacity State' },
    { id: 'financial-external-fiscal-state', label: 'Financial / External / Fiscal' },
    { id: 'forecast-distribution', label: 'Forecast Distribution' },
    { id: 'loss-function', label: 'Loss Function' },
    { id: 'weights-hierarchy', label: 'Weights / Hierarchy' },
    { id: 'discount-horizon', label: 'Discount / Horizon' },
    { id: 'model-constraint', label: 'Model Constraint' },
    { id: 'demand-shock', label: 'Demand Shock' },
    { id: 'supply-shock', label: 'Supply Shock' },
    { id: 'shock-identification', label: 'Shock Identification' },
    { id: 'divine-coincidence-break', label: 'Divine Coincidence Break' },
    { id: 'risk-distribution', label: 'Risk Distribution' },
    { id: 'brainard-attenuation', label: 'Brainard Attenuation' },
    { id: 'robust-risk-management', label: 'Robust Risk Management' },
    { id: 'data-uncertainty', label: 'Data Uncertainty' },
    { id: 'model-uncertainty', label: 'Model Uncertainty' },
    { id: 'nonlinearity-elb', label: 'Nonlinearity / ELB' },
    { id: 'financial-imbalance-risk', label: 'Financial-imbalance Risk' },
    { id: 'distribution-sector-boundary', label: 'Distribution / Sector Boundary' },
    { id: 'reaction-function', label: 'Reaction Function' },
    { id: 'taylor-rule', label: 'Taylor Rule' },
    { id: 'neutral-rate', label: 'Neutral Rate' },
    { id: 'real-rate-gap', label: 'Real-rate Gap' },
    { id: 'policy-inertia', label: 'Policy Inertia' },
    { id: 'forecast-based-rule', label: 'Forecast-based Rule' },
    { id: 'targeting-vs-instrument-rule', label: 'Targeting vs Instrument Rule' },
    { id: 'regime-lucas-critique', label: 'Regime / Lucas Critique' },
    { id: 'committee-aggregation', label: 'Committee Aggregation' },
    { id: 'state-calendar-guidance', label: 'State / Calendar / Guidance' },
    { id: 'systematic-surprise', label: 'Systematic / Surprise' },
    { id: 'target-path-information', label: 'Target / Path / Information' },
    { id: 'instrument-menu', label: 'Instrument Menu' },
    { id: 'policy-point-path', label: 'Policy Point / Path' },
    { id: 'commitment-time-consistency', label: 'Commitment / Time Consistency' },
    { id: 'closed-policy-loop', label: 'Closed Policy Loop' },
    { id: 'interactive-lab', label: 'Interactive Lab' },
    { id: 'static-twins', label: 'Static Twins' },
    { id: 'checks-glossary', label: 'Checks / Glossary' },
    { id: 'interfaces-reading', label: 'Interfaces / Reading' },
  ],
  Content: Lesson305Content,
  references: lesson305References,
  readingList: lesson305ReadingList,
};
