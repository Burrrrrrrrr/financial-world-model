import type { LessonReading, LessonReference } from './types';

export const lesson403References: LessonReference[] = [
  {
    id: 1,
    authors: 'International Monetary Fund',
    year: '2025',
    accessedAt: '2026-09-16',
    title: 'Integrated Balance of Payments and International Investment Position Manual, Seventh Edition (BPM7), White Cover (Pre-Edited) Version',
    publication: 'International Monetary Fund, March 2025',
    url: 'https://www.imf.org/-/media/Files/Data/Statistics/BPM6/draft-bpm7-wcv.ashx',
    use: '核读印刷p.265/PDF p.303 ¶6.69、印刷p.266/PDF p.304 Box 6.5、印刷p.268/PDF p.306 ¶6.74及印刷p.277/PDF p.315 ¶¶6.114–6.117。支持reserve asset的外部资产、控制与可用性、干预/融资/信心用途及工具分类；不提供“储备货币名单”，不认证具体资产永久安全，能作抵押本身也不足以成为reserve asset。',
  },
  {
    id: 2,
    authors: 'International Monetary Fund',
    year: '2014',
    accessedAt: '2026-09-16',
    title: 'Revised Guidelines for Foreign Exchange Reserve Management',
    publication: 'IMF Manuals and Guides, publication page dated 22 July 2014',
    url: 'https://www.imf.org/en/Publications/Manuals-Guides/Issues/2016/12/31/Revised-Guidelines-for-Foreign-Exchange-Reserve-Management-41062',
    use: '核读印刷pp.1–4/PDF pp.7–10 ¶¶1–15及印刷p.18/PDF p.24 ¶¶92–93。支持官方储备的政策用途、安全—流动性—收益次序、市场深度与组合治理；指南明确自愿且非强制，不给所有经济体统一的最优规模、币种、期限或风险容忍度。',
  },
  {
    id: 3,
    authors: 'International Monetary Fund',
    year: 'current framework portal',
    accessedAt: '2026-09-16',
    title: 'Assessing Reserve Adequacy (ARA)',
    publication: 'IMF policy framework portal',
    url: 'https://www.imf.org/external/np/spr/ara/?mod=article_inline',
    use: '支持储备缓冲可降低国际收支危机风险、持有储备有机会成本、适当水平取决于经济体特征且储备不能替代良好政策。本课不据此计算任何国家的充足率、缺口、建议组合或政策处方。',
  },
  {
    id: 4,
    authors: 'International Monetary Fund',
    year: 'current dataset; 2025Q3 methodology break',
    accessedAt: '2026-09-16',
    title: 'Currency Composition of Official Foreign Exchange Reserves (COFER)',
    publication: 'IMF Data, dataset and metadata',
    url: 'https://data.imf.org/Datasets/COFER',
    use: '支持COFER是季度、期末市场汇率折算为美元的官方外汇储备币种构成；当前metadata列147个报告者，并排除货币黄金、SDR holdings与IMF reserve position。自2025Q3起未分配部分被估算并回溯至2000Q1，因此100%构成不等于100%直接观测；数据不能识别匿名国、交易、政策动机或逐工具持有。',
  },
  {
    id: 5,
    authors: 'Glen Kwende & Erin Nephew',
    year: '2025',
    accessedAt: '2026-09-16',
    title: 'Improving the Analytical Usefulness of the IMF’s COFER Data',
    publication: 'IMF Technical Notes and Manuals 2025/014, 26 November 2025',
    url: 'https://www.elibrary.imf.org/view/journals/005/2025/014/article-A001-en.xml',
    use: '核读印刷pp.5–9方法、pp.10–17结果、p.18用途边界、p.19 Annex I、p.21 Annex II及印刷p.10/PDF p.15 Table 1。支持carry-forward、分层均值和大型偏斜报告者的混合估算；Table 1是2025Q2方法比较而非2026Q1观测，估算不能创造直接国别数据。',
  },
  {
    id: 6,
    authors: 'Abdulrahman Gweder, Erin Nephew & Hannah Wei',
    year: '2026',
    accessedAt: '2026-09-16',
    title: 'World Official Foreign Currency Reserves Largely Unchanged in the First Quarter of 2026',
    publication: 'IMF COFER Data Brief, 1 July 2026',
    url: 'https://data.imf.org/en/news/imf%20data%20brief%20july%201',
    use: '支持2026Q1总外汇储备约13.10万亿美元、美元57.13%、欧元20.03%、人民币1.99%，以及美元份额变化的部分汇率估值说明。单季份额不是交易流或长期趋势，不能识别国别行为；黄金不在COFER同一分母。',
  },
  {
    id: 7,
    authors: 'Ricardo J. Caballero, Emmanuel Farhi & Pierre-Olivier Gourinchas',
    year: '2017',
    accessedAt: '2026-09-16',
    title: 'The Safe Assets Shortage Conundrum',
    publication: 'Journal of Economic Perspectives, 31(3), Summer 2017, pp. 29–46',
    url: 'https://www.aeaweb.org/articles?id=10.1257/jep.31.3.29',
    use: '核读p.30定义、p.31供给能力、p.33 Table 1及pp.38–40供给与现代Triffin讨论。支持安全是坏状态中的相对、用途与状态依赖属性，供给受金融发展和财政/货币可信度约束；p.33是作者明确称为粗略的2007/2011历史分类，不能充当当前规模或永久安全名单。',
  },
  {
    id: 8,
    authors: 'Zhiguo He, Arvind Krishnamurthy & Konstantin Milbradt',
    year: '2019',
    accessedAt: '2026-09-16',
    title: 'A Model of Safe Asset Determination',
    publication: 'American Economic Review, 109(4), April 2019, pp. 1230–1262',
    url: 'https://www.aeaweb.org/articles?id=10.1257/aer.20160216',
    use: '出版社abstract与归档工作论文支持：安全地位是相对的；高安全资产需求下，更大float可因流动性与市场深度降低展期风险，低需求或弱基本面下更大债务可损害安全。它是理论模型，不给现实主权安全阈值、评级、最优债务量或单调结论。',
  },
  {
    id: 9,
    authors: 'Zhengyang Jiang, Arvind Krishnamurthy & Hanno Lustig',
    year: '2021',
    accessedAt: '2026-09-16',
    title: 'Foreign Safe Asset Demand and the Dollar Exchange Rate',
    publication: 'The Journal of Finance, 76(3), June 2021, pp. 1049–1089; online 2 February 2021',
    url: 'https://onlinelibrary.wiley.com/doi/abs/10.1111/jofi.13003',
    use: '支持用美国国债与货币套保后外国政府债收益差构造Treasury basis，并研究外国安全资产需求、美元即期升值与后续回报之间的论文关系。basis不是官方储备经理动机的直接观测，该关系不解释全部汇率变化，也不是美元预测规则或无条件因果。',
  },
  {
    id: 10,
    authors: 'Emmanuel Farhi & Matteo Maggiori',
    year: '2018',
    accessedAt: '2026-09-16',
    title: 'A Model of the International Monetary System',
    publication: 'The Quarterly Journal of Economics, 133(1), February 2018, pp. 295–355; online 21 August 2017',
    url: 'https://academic.oup.com/qje/article-abstract/133/1/295/4085837',
    use: '重点使用§III“Limited Commitment and the Triffin Dilemma”。支持有限承诺下储备资产供给、霸权/多极结构与稀缺之间的理论张力；模型均衡不证明当代美元的既定路径、危机日期、债务阈值或“储备货币国必须持续经常账户赤字”。',
  },
  {
    id: 11,
    authors: 'Michael D. Bordo & Robert N. McCauley',
    year: '2017',
    accessedAt: '2026-09-16',
    title: 'Triffin: dilemma or myth?',
    publication: 'BIS Working Papers No 684, 19 December 2017; later IMF Economic Review 67(4), 2019',
    url: 'https://www.bis.org/publications/working-paper-684-triffin-dilemma-or-myth',
    use: '支持必要反方：把Triffin机械改写为现代经常账户必然性可能错误或过时；财政能力版本更合理，但仍依赖储备需求和供给的僵硬假设。不能据此否定所有全球负债服务—发行者可信度张力；BIS明确作者观点不必代表BIS。',
  },
  {
    id: 12,
    authors: 'Bank for International Settlements',
    year: '2023',
    accessedAt: '2026-09-16',
    title: 'II. Monetary and fiscal policy: safeguarding stability and trust',
    publication: 'BIS Annual Economic Report 2023, Chapter II',
    url: 'https://www.bis.org/publications/monetary-fiscal-policy-safeguarding-stability-trust',
    use: '核读Box D印刷p.63/PDF p.23及Graph D1。支持政府债券的基准与抵押品服务，以及haircut、margin、去杠杆和火售反馈；章节示例中的核心政府债0–2% haircut不是所有资产、市场、日期或设施的通则，也不证明所有政府债安全。',
  },
  {
    id: 13,
    authors: 'Committee on Payment and Settlement Systems & Technical Committee of IOSCO',
    year: '2012',
    accessedAt: '2026-09-16',
    title: 'Principles for financial market infrastructures',
    publication: 'CPSS–IOSCO, 16 April 2012',
    url: 'https://www.bis.org/publications/principles-financial-market-infrastructures',
    use: '核读Principle 5印刷pp.46–49/PDF pp.52–55，尤其¶¶3.5.2、3.5.5–3.5.7。支持FMI抵押品应具低信用、流动性与市场风险，并采用保守haircut、集中度约束、压力估值和限制顺周期措施；规范性标准不是特定资产的实证安全认证，也不是reserve asset定义。',
  },
  {
    id: 14,
    authors: 'Tobias Adrian, Michael Fleming & Erik Vogt',
    year: '2017; revised 2023',
    accessedAt: '2026-09-16',
    title: 'The Evolution of Treasury Market Liquidity: Evidence from 30 Years of Limit Order Book Data',
    publication: 'Federal Reserve Bank of New York Staff Report No 827, November 2017; revised January 2023',
    url: 'https://www.newyorkfed.org/research/staff_reports/sr827',
    use: '核读§3印刷p.3、§4.1 pp.10–14、§4.2 pp.14–16、Table 6印刷p.35/PDF p.38与Figure 3印刷p.42/PDF p.45。支持1991–2021 on-the-run interdealer bid–ask、depth与price impact，并说明无单一流动性指标；不定义或测量冲击后的resilience，不覆盖全部Treasury市场或2022–26，也不测官方储备需求。',
  },
];

export const lesson403ReadingList: LessonReading[] = [
  {
    title: '阅读路线一：先分清储备资产、储备货币与安全服务',
    scope: 'BPM7 ¶6.69、Box 6.5、¶6.74、¶¶6.114–6.117；IMF Reserve Guidelines ¶¶5–15',
    reason: '先问资产是否为外部资产、是否由货币当局控制并可用于政策目的，再问它提供何种币种与安全服务；“美元计价”“可作抵押”和“是reserve asset”不是同义句。',
    url: lesson403References[0].url,
    group: 'core',
    links: [{ label: '储备管理目标与约束', url: lesson403References[1].url }],
  },
  {
    title: '阅读路线二：给COFER贴完整统计护照',
    scope: 'COFER metadata；TNM 2025/014 pp.5–21；2026Q1 Data Brief',
    reason: '把币种存量、期末市场价值、分母排除项、报告者、估值效应、方法断点和imputed share放在一起，才能避免把份额变化写成央行净买入。',
    url: lesson403References[3].url,
    group: 'evidence',
    links: [{ label: '估算方法', url: lesson403References[4].url }, { label: '2026Q1快照', url: lesson403References[5].url }],
  },
  {
    title: '阅读路线三：把“安全”读成状态依赖的资产服务',
    scope: 'Caballero–Farhi–Gourinchas pp.29–40；He–Krishnamurthy–Milbradt abstract与机制',
    reason: '安全取决于坏状态、用途、规模、可交易性与替代资产。更大float既可能增加深度，也可能增加展期与财政压力，关系不应预设为单调。',
    url: lesson403References[6].url,
    group: 'models',
    links: [{ label: '安全资产内生决定', url: lesson403References[7].url }],
  },
  {
    title: '阅读路线四：便利收益不是任意两条收益率之差',
    scope: 'Jiang–Krishnamurthy–Lustig的Treasury basis构造、理论映射与经验边界',
    reason: '先登记要识别的目标服务，再匹配信用、期限、现金流、税收、币种与套保等非目标维度；若流动性是目标服务就故意保留，若不是目标就必须匹配或列作污染。声明控制门未通过时，连便利收益候选也不得命名或显示；即使全部通过，结果仍只是候选量，不证明残余楔子纯净。',
    url: lesson403References[8].url,
    group: 'evidence',
  },
  {
    title: '阅读路线五：把Triffin教成条件张力，不教成会计必然',
    scope: 'Farhi–Maggiori §III；Bordo–McCauley全文的历史与财政反论证',
    reason: '先分清原始金汇兑制度、现代毛资产负债表和财政能力版本，再并列模型与反方；“必须持续经常账户赤字”不是恒等式。',
    url: lesson403References[9].url,
    group: 'models',
    links: [{ label: 'Triffin反方', url: lesson403References[10].url }],
  },
  {
    title: '阅读路线六：从毛存量走到压力后的可用抵押现金',
    scope: 'BIS AER 2023 Box D；PFMI Principle 5 ¶¶3.5.2、3.5.5–3.5.7',
    reason: '依次扣除不合格、已质押、集中度约束、价格冲击与haircut，才能得到用途相关的cash capacity；合格抵押品并不自动是统计上的reserve asset。',
    url: lesson403References[11].url,
    group: 'systems',
    links: [{ label: 'PFMI抵押品规范', url: lesson403References[12].url }],
  },
  {
    title: '阅读路线七：用三项来源指标与一项扩展诊断拆开市场流动性',
    scope: 'NY Fed Staff Report 827 §§3–4、Table 6、Figure 3',
    reason: '来源14观测bid–ask、depth与price impact；resilience需要另取冲击后恢复路径，本课只把它列作扩展诊断，不归因给该报告。压力期成交量上升仍可与订单簿变薄、交易规模下降和价格冲击扩大并存。',
    url: lesson403References[13].url,
    group: 'evidence',
  },
  {
    title: '阅读路线八：把“缓冲有用”与“该持有多少”分开',
    scope: 'IMF ARA门户与Reserve Guidelines的目标、成本和非统一性边界',
    reason: '储备可缓冲外部冲击，但有机会成本且依经济体而异；本课只解释需求机制，不把框架偷换成国家评分、最优储备率或资产配置建议。',
    url: lesson403References[2].url,
    group: 'rules',
    links: [{ label: '储备管理指南', url: lesson403References[1].url }],
  },
];

export type SafeAssetEvidenceGroup = {
  key: string;
  title: string;
  sourceIds: readonly number[];
  supports: string;
  doesNotSupport: string;
};

export const safeAssetEvidenceGroups: readonly SafeAssetEvidenceGroup[] = [
  {
    key: 'definition-and-official-demand',
    title: '储备资产定义、官方用途与机会成本',
    sourceIds: [1, 2, 3],
    supports: '定义reserve asset、说明官方持有目的、风险次序与机会成本。',
    doesNotSupport: '不支持储备货币名单、国家充足率、统一最优组合或永久安全认证。',
  },
  {
    key: 'cofer-measurement',
    title: 'COFER存量、估值与估算方法',
    sourceIds: [4, 5, 6],
    supports: '说明币种构成的覆盖、分母、期末估值、方法断点和2026Q1快照。',
    doesNotSupport: '不支持从份额直接识别交易、匿名国、动机、逐工具持有或因果。',
  },
  {
    key: 'safe-asset-capacity',
    title: '安全资产的状态依赖与供给容量',
    sourceIds: [7, 8],
    supports: '解释安全服务、float、市场深度、财政能力与展期风险的条件关系。',
    doesNotSupport: '不提供当前全球安全资产规模、主权排名、固定阈值或债务—安全单调关系。',
  },
  {
    key: 'convenience-yield-and-fx',
    title: '匹配后的便利收益与汇率研究',
    sourceIds: [9],
    supports: '说明Treasury basis的构造思想及论文样本中的资产需求—汇率关系。',
    doesNotSupport: '不把basis当央行行为，也不把论文关系升级为实时官方指标、全部汇率解释或预测规则。',
  },
  {
    key: 'triffin-claim-and-counterclaim',
    title: '有限承诺模型与Triffin反方',
    sourceIds: [10, 11],
    supports: '把全球负债服务—发行者可信度写成条件张力，并呈现历史与现代反论证。',
    doesNotSupport: '不支持经常账户赤字必然性、危机日期、债务阈值或单向崩溃叙事。',
  },
  {
    key: 'collateral-and-market-liquidity',
    title: '抵押品服务、压力反馈与国债市场流动性',
    sourceIds: [12, 13, 14],
    supports: '说明haircut、margin、集中度、火售反馈以及点差、深度和价格冲击的多维测量。',
    doesNotSupport: '不把规范性标准当资产认证，也不把1991–2021 on-the-run interdealer证据写成2026全市场状态。',
  },
];

export type SafeAssetArchiveRecord = {
  sourceIds: readonly number[];
  sourceKey: string;
  version: 'formal-publication' | 'publisher-page' | 'institutional-copy' | 'working-paper-version';
  path: string;
  canonicalUrl: string;
  retrievedAt: string;
  mime: string;
  bytes: number;
  sha256: string;
  pdfPages?: number;
  readLocator: string;
  supports: string;
  doesNotSupport: string;
};

export const safeAssetSourceArchiveLedger: readonly SafeAssetArchiveRecord[] = [
  {
    sourceIds: [1],
    sourceKey: 'imf-bpm7-2025',
    version: 'formal-publication',
    path: 'tmp/research/4-03-draft/originals/imf/imf_bpm7_white_cover_2025.pdf',
    canonicalUrl: 'https://data.imf.org/-/media/iData/External-Storage/Documents/5B776E0E552E4881AF24042EAE7D049B/en/1-BPM7-White-Cover.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 7367226,
    sha256: 'a770e733fed4b20ad8b487ba2281e06d49cf8ff7402a691ab0ae2db3231127e7',
    pdfPages: 1076,
    readLocator: '印刷p.265/PDF p.303 ¶6.69；印刷p.266/PDF p.304 Box 6.5；印刷p.268/PDF p.306 ¶6.74；印刷p.277/PDF p.315 ¶¶6.114–6.117。',
    supports: 'reserve asset定义、分类、用途、流动性与encumbrance边界。',
    doesNotSupport: '储备货币名单、永久安全判断或仅凭抵押能力认定reserve asset。',
  },
  {
    sourceIds: [7],
    sourceKey: 'cfg-safe-assets-2017-published-pdf',
    version: 'institutional-copy',
    path: 'tmp/research/4-03-draft/originals/aea/caballero_farhi_gourinchas_2017_mit.pdf',
    canonicalUrl: 'https://economics.mit.edu/sites/default/files/publications/jep.31.3.29.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 1503971,
    sha256: '71c3bf20f86c8bca1f1ffef118554e8ec9b55a8694eb1dee0adad7db6043b1fb',
    pdfPages: 18,
    readLocator: '期刊p.30定义、p.31供给能力、p.33 Table 1、pp.38–40现代Triffin。',
    supports: '安全资产的相对性、供给能力与短缺机制。',
    doesNotSupport: '当前全球规模或永久安全名单。',
  },
  {
    sourceIds: [7],
    sourceKey: 'cfg-safe-assets-2017-aea-page',
    version: 'publisher-page',
    path: 'tmp/research/4-03-draft/originals/aea/aea_cfg_article_page_2026-09-16.html',
    canonicalUrl: 'https://www.aeaweb.org/articles?id=10.1257/jep.31.3.29',
    retrievedAt: '2026-09-16',
    mime: 'text/html; charset=UTF-8',
    bytes: 31410,
    sha256: 'a9345ba30b481e1134184940e6d01e285a27fe203fef6a2089f5aba0c40bc2d4',
    readLocator: '题名、作者、卷期、Summer 2017、pp.29–46、abstract与DOI。',
    supports: '正式出版身份与摘要边界。',
    doesNotSupport: '未在网页展示的全文段落或当前数量。',
  },
  {
    sourceIds: [8],
    sourceKey: 'hkm-2019-aea-page',
    version: 'publisher-page',
    path: 'tmp/research/4-03-draft/originals/aea/aea_hkm_article_page_2026-09-16.html',
    canonicalUrl: 'https://www.aeaweb.org/articles?id=10.1257/aer.20160216',
    retrievedAt: '2026-09-16',
    mime: 'text/html; charset=UTF-8',
    bytes: 29279,
    sha256: '1c21a19feff680e36ad2e79da5e1c394241c3631fd5192fa1aea8ebb9a6bded3',
    readLocator: '正式题名、作者、AER 109(4)、April 2019、pp.1230–1262与abstract。',
    supports: '正式出版身份和模型摘要。',
    doesNotSupport: '仅凭abstract引用正文定理、校准或页内细节。',
  },
  {
    sourceIds: [8],
    sourceKey: 'hkm-safe-asset-working-draft-2016-bfi',
    version: 'working-paper-version',
    path: 'tmp/research/4-03-draft/originals/aea/he_krishnamurthy_milbradt_working_draft_2016.pdf',
    canonicalUrl: 'https://bfi.uchicago.edu/wp-content/uploads/Krishnamurthy-paper.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 744266,
    sha256: '85dc7b867430e1e762d0d2900541582f2370276124d11aa43db8ba661689df8d',
    pdfPages: 65,
    readLocator: '封面、2016-02-12版本标识、abstract与float—liquidity—rollover机制；不以此反推2019期刊页码。',
    supports: '工作论文版本中的完整模型机制。',
    doesNotSupport: '与2019发表版逐字一致或任何现实主权阈值。',
  },
  {
    sourceIds: [8],
    sourceKey: 'hkm-safe-asset-nber-w22271',
    version: 'working-paper-version',
    path: 'tmp/research/4-03-draft/originals/nber/nber_w22271_hkm.pdf',
    canonicalUrl: 'https://www.nber.org/system/files/working_papers/w22271/w22271.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 874329,
    sha256: 'e99968c01d498890b6541c739c221b2f1e4feef5296f058d9ee24351ad42a61f',
    pdfPages: 71,
    readLocator: '封面、NBER Working Paper 22271版本标识、abstract和模型机制；仅作版本核对。',
    supports: '公开工作论文全文备份。',
    doesNotSupport: '取代AER正式出版身份或证明现实因果。',
  },
  {
    sourceIds: [9],
    sourceKey: 'jkl-safe-demand-nber-w24439',
    version: 'working-paper-version',
    path: 'tmp/research/4-03-draft/originals/nber/nber_w24439_jkl.pdf',
    canonicalUrl: 'https://www.nber.org/system/files/working_papers/w24439/w24439.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 920137,
    sha256: 'c82f28356aef0bf726802d270f1413ac6e90078deae164d813c10f388627e107',
    pdfPages: 98,
    readLocator: '封面、abstract、Treasury basis定义与需求—即期/后续美元回报映射；按working-paper版本读取。',
    supports: '便利收益匹配思想和论文机制。',
    doesNotSupport: '替代2021 Journal of Finance排版、识别央行动机或形成美元预测规则。',
  },
  {
    sourceIds: [10],
    sourceKey: 'farhi-maggiori-nber-w22295',
    version: 'working-paper-version',
    path: 'tmp/research/4-03-draft/originals/nber/nber_w22295_farhi_maggiori.pdf',
    canonicalUrl: 'https://www.nber.org/system/files/working_papers/w22295/w22295.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 699690,
    sha256: '720c25163a586521da66f98801504175834a2f10a19380093a89826f1fc7f0ce',
    pdfPages: 61,
    readLocator: '封面、abstract及有限承诺/Triffin部分；工作论文为2016-12修订版，不用其页码冒充QJE发表页。',
    supports: '储备资产供需、有限承诺与霸权/多极模型。',
    doesNotSupport: '现实美元路径、危机时点或经常账户机械要求。',
  },
  {
    sourceIds: [11],
    sourceKey: 'bordo-mccauley-bis-wp684',
    version: 'formal-publication',
    path: 'tmp/research/4-03-draft/originals/bis/bis_working_papers_684_exact.pdf',
    canonicalUrl: 'https://www.bis.org/publications/working-paper-684-triffin-dilemma-or-myth.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 847245,
    sha256: '93e49d913211029a81dde04f5c031d9217cff08ff930ed63b42faac535e00bf3',
    pdfPages: 43,
    readLocator: 'abstract、历史制度论证、经常账户与财政版本的区分及结论。',
    supports: '对机械Triffin叙事的历史与资产负债表反方。',
    doesNotSupport: '否定所有供给—可信度张力或代表BIS政策立场。',
  },
  {
    sourceIds: [11],
    sourceKey: 'bordo-mccauley-bis-page',
    version: 'publisher-page',
    path: 'tmp/research/4-03-draft/originals/bis/bis_wp684_page_2026-09-16.html',
    canonicalUrl: 'https://www.bis.org/publications/working-paper-684-triffin-dilemma-or-myth',
    retrievedAt: '2026-09-16',
    mime: 'text/html; charset=utf-8',
    bytes: 129315,
    sha256: 'cae4d83285c441ec7eef2cf24ee7837b1d0968e888110d8e2ba6cb3d7a94c824',
    readLocator: '题名、作者、BIS Working Papers No 684、2017-12-19、摘要、PDF链接和观点免责声明。',
    supports: '正式出版身份。',
    doesNotSupport: '把作者结论归为BIS机构政策。',
  },
  {
    sourceIds: [12],
    sourceKey: 'bis-aer-2023-ch2',
    version: 'formal-publication',
    path: 'tmp/research/4-03-draft/originals/bis/bis_aer_2023_chapter_ii.pdf',
    canonicalUrl: 'https://www.bis.org/publications/monetary-fiscal-policy-safeguarding-stability-trust.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 865849,
    sha256: '47af9bbaa4205ffd0b8cb26c9dbe2a8d0cf927c70b750ab9cfe3e52d2440d397',
    pdfPages: 43,
    readLocator: 'Box D印刷p.63/PDF p.23与Graph D1。',
    supports: '政府债基准/抵押品服务及margin—火售反馈。',
    doesNotSupport: '跨市场固定haircut或所有政府债安全。',
  },
  {
    sourceIds: [12],
    sourceKey: 'bis-aer-2023-ch2-page',
    version: 'publisher-page',
    path: 'tmp/research/4-03-draft/originals/bis/bis_aer2023_ch2_page_2026-09-16.html',
    canonicalUrl: 'https://www.bis.org/publications/aer-2023/monetary-fiscal-policy-safeguarding-stability-trust',
    retrievedAt: '2026-09-16',
    mime: 'text/html; charset=utf-8',
    bytes: 287820,
    sha256: '42c3490062905e8730537e2fe66b51e01758dd4b75c8f458b25cd19cb1d658a4',
    readLocator: 'Chapter II出版身份、摘要、导航与PDF链接。',
    supports: '正式章节身份和canonical链接。',
    doesNotSupport: '替代PDF中的Box D定位。',
  },
  {
    sourceIds: [13],
    sourceKey: 'pfmi-principle5',
    version: 'formal-publication',
    path: 'tmp/research/4-03-draft/originals/bis/cpmi_iosco_pfmi_2012_exact.pdf',
    canonicalUrl: 'https://www.bis.org/publications/principles-financial-market-infrastructures.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 1117912,
    sha256: '48b97c7e065b5a3f152e6706e614a662fad4d9908b88c6ffe0f4a011e89478e2',
    pdfPages: 188,
    readLocator: 'Principle 5印刷pp.46–49/PDF pp.52–55，¶¶3.5.2、3.5.5–3.5.7。',
    supports: '抵押品质量、haircut、集中度、压力估值与顺周期管理规范。',
    doesNotSupport: '宏观安全资产供给结论、reserve asset定义或个券认证。',
  },
  {
    sourceIds: [13],
    sourceKey: 'pfmi-publication-page',
    version: 'publisher-page',
    path: 'tmp/research/4-03-draft/originals/bis/bis_pfmi_page_2026-09-16.html',
    canonicalUrl: 'https://www.bis.org/publications/principles-financial-market-infrastructures',
    retrievedAt: '2026-09-16',
    mime: 'text/html; charset=utf-8',
    bytes: 136386,
    sha256: '83de16ca9cc14f4179af1ec093e341253a13e8156ae1aa903382f5837b6080da',
    readLocator: '题名、CPSS–IOSCO身份、2012-04-16日期与正式PDF链接。',
    supports: '正式出版身份与版本。',
    doesNotSupport: '替代Principle 5正文定位。',
  },
  {
    sourceIds: [14],
    sourceKey: 'nyfed-treasury-liquidity-sr827',
    version: 'formal-publication',
    path: 'tmp/research/4-03-draft/originals/nyfed/nyfed_sr827_treasury_liquidity.pdf',
    canonicalUrl: 'https://www.newyorkfed.org/medialibrary/media/research/staff_reports/sr827.pdf',
    retrievedAt: '2026-09-16',
    mime: 'application/pdf',
    bytes: 2305897,
    sha256: 'deba66294672d0470f1a928efe58b9321b181c67840079b0f06ed2b2ebf2a070',
    pdfPages: 48,
    readLocator: '§3印刷p.3；§4.1 pp.10–14；§4.2 pp.14–16；Table 6印刷p.35/PDF p.38；Figure 3印刷p.42/PDF p.45。',
    supports: '1991–2021 on-the-run interdealer流动性的多指标历史证据。',
    doesNotSupport: '全部Treasury市场、2022–26状态、官方储备需求或纽约联储政策立场。',
  },
  {
    sourceIds: [14],
    sourceKey: 'nyfed-treasury-liquidity-page',
    version: 'publisher-page',
    path: 'tmp/research/4-03-draft/originals/nyfed/nyfed_sr827_page_2026-09-16.html',
    canonicalUrl: 'https://www.newyorkfed.org/research/staff_reports/sr827',
    retrievedAt: '2026-09-16',
    mime: 'text/html; charset=utf-8',
    bytes: 98082,
    sha256: '548b732e26d04e9f638f18882b3243096cac0ca2ea916abfda7975440d976d3c',
    readLocator: '题名、作者、Staff Report 827、2017-11与2023-01修订、摘要及PDF链接。',
    supports: '正式出版身份、版本日期和摘要。',
    doesNotSupport: '替代PDF中的样本、表图和指标定义。',
  },
];

export type SafeAssetFailedDownloadRecord = {
  sourceIds: readonly number[];
  request: string;
  retrievedAt: string;
  responses: readonly {
    httpStatus: number;
    mime: string;
    bytes: number;
    responsePath: string;
    headersPath: string;
  }[];
  resolution: string;
};

export const safeAssetFailedDownloadLedger: readonly SafeAssetFailedDownloadRecord[] = [
  {
    sourceIds: [1],
    request: 'https://data.imf.org/-/media/iData/External-Storage/Documents/5B776E0E552E4881AF24042EAE7D049B/en/1-BPM7-White-Cover.pdf',
    retrievedAt: '2026-09-16',
    responses: [{ httpStatus: 403, mime: 'text/html', bytes: 517, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_bpm7_datahost_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_bpm7_datahost_403.headers.txt' }],
    resolution: '当次请求失败；4.03所列PDF来自同日已验证的IMF data-host冻结件，SHA-256与既有官方归档逐字节一致，失败HTML未冒充PDF。',
  },
  {
    sourceIds: [2],
    request: 'https://www.imf.org/-/media/websites/imf/imported-full-text-pdf/external/np/mae/ferm/2014/_revgudferm14.pdf',
    retrievedAt: '2026-09-16',
    responses: [
      { httpStatus: 403, mime: 'text/html', bytes: 516, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_guidelines_media_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_guidelines_media_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html', bytes: 431, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_guidelines_legacy_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_guidelines_legacy_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html', bytes: 423, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_guidelines_policy_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_guidelines_policy_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html', bytes: 538, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_publication_page_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_reserve_publication_page_403.headers.txt' },
    ],
    resolution: '另测legacy与2013 policy路由也为403；仅保留失败响应。reference使用已核验官方出版身份与定位，不声称本地全文归档成功。',
  },
  {
    sourceIds: [3, 4, 6],
    request: 'IMF ARA portal, COFER dataset, and 2026Q1 Data Brief canonical pages',
    retrievedAt: '2026-09-16',
    responses: [
      { httpStatus: 403, mime: 'text/html', bytes: 406, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_ara_portal_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_ara_portal_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html', bytes: 384, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_dataset_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_dataset_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html', bytes: 427, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_brief_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_brief_403.headers.txt' },
    ],
    resolution: '三个官方页面分别406、384、427 bytes，均为403响应；仅引用已实际核验的官方页面内容，不把响应体当快照。',
  },
  {
    sourceIds: [5],
    request: 'https://www.imf.org/-/media/files/publications/tnm/2025/english/tnmea2025014.pdf',
    retrievedAt: '2026-09-16',
    responses: [
      { httpStatus: 403, mime: 'text/html', bytes: 461, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_methodology_pdf_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_methodology_pdf_403.headers.txt' },
      { httpStatus: 202, mime: 'text/html', bytes: 2228, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_elibrary_article_waf.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_elibrary_article_waf.headers.txt' },
      { httpStatus: 202, mime: 'text/html', bytes: 2228, responsePath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_elibrary_issue_waf.html', headersPath: 'tmp/research/4-03-draft/originals/failures/imf_cofer_elibrary_issue_waf.headers.txt' },
    ],
    resolution: 'eLibrary两条候选下载又返回HTTP 202、text/html、2,228-byte AWS WAF challenge；没有PDF魔数，全部隔离，绝不称作全文归档。',
  },
  {
    sourceIds: [7],
    request: 'https://www.aeaweb.org/articles/pdf/doi/10.1257/jep.31.3.29',
    retrievedAt: '2026-09-16',
    responses: [{ httpStatus: 403, mime: 'text/html; charset=UTF-8', bytes: 5541, responsePath: 'tmp/research/4-03-draft/originals/failures/aea_cfg_pdf_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/aea_cfg_pdf_403.headers.txt' }],
    resolution: 'AEA direct PDF路由失败；已冻结MIT作者机构站上的期刊版PDF，并保留AEA 200 HTML正式出版页。',
  },
  {
    sourceIds: [9],
    request: 'Wiley article page and Stanford route-download/445411',
    retrievedAt: '2026-09-16',
    responses: [
      { httpStatus: 403, mime: 'text/html; charset=UTF-8', bytes: 5555, responsePath: 'tmp/research/4-03-draft/originals/failures/wiley_jkl_article_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/wiley_jkl_article_403.headers.txt' },
      { httpStatus: 200, mime: 'text/html; charset=utf-8', bytes: 223812, responsePath: 'tmp/research/4-03-draft/originals/failures/stanford_jkl_route_homepage.html', headersPath: 'tmp/research/4-03-draft/originals/failures/stanford_jkl_route_homepage.headers.txt' },
    ],
    resolution: 'Wiley返回403；Stanford下载路由HTTP 200却落到223,812-byte主页HTML。仅归档NBER WP24439工作论文版本，不冒充Journal of Finance版全文。',
  },
  {
    sourceIds: [10],
    request: 'OUP QJE article/PDF and Harvard author PDF routes',
    retrievedAt: '2026-09-16',
    responses: [
      { httpStatus: 403, mime: 'text/html; charset=UTF-8', bytes: 5584, responsePath: 'tmp/research/4-03-draft/originals/failures/oup_fm_pdf_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/oup_fm_pdf_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html; charset=UTF-8', bytes: 5563, responsePath: 'tmp/research/4-03-draft/originals/failures/oup_fm_article_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/oup_fm_article_403.headers.txt' },
      { httpStatus: 403, mime: 'text/html', bytes: 414, responsePath: 'tmp/research/4-03-draft/originals/failures/harvard_fm_pdf_403.html', headersPath: 'tmp/research/4-03-draft/originals/failures/harvard_fm_pdf_403.headers.txt' },
    ],
    resolution: 'OUP article与PDF及Harvard PDF均受限；仅归档NBER WP22295的2016-12工作论文版本，不冒充2018 QJE排版。',
  },
  {
    sourceIds: [11, 13],
    request: 'https://www.bis.org/publ/work684.pdf and https://www.bis.org/cpmi/publ/d101a.pdf',
    retrievedAt: '2026-09-16',
    responses: [
      { httpStatus: 200, mime: 'text/html; charset=utf-8', bytes: 129315, responsePath: 'tmp/research/4-03-draft/originals/failures/bis_wp684_legacy_redirect.html', headersPath: 'tmp/research/4-03-draft/originals/failures/bis_wp684_legacy_redirect.headers.txt' },
      { httpStatus: 200, mime: 'text/html; charset=utf-8', bytes: 136379, responsePath: 'tmp/research/4-03-draft/originals/failures/pfmi_legacy_redirect.html', headersPath: 'tmp/research/4-03-draft/originals/failures/pfmi_legacy_redirect.headers.txt' },
    ],
    resolution: '旧路由均落到HTML发布页而非PDF；从页面解析出的新canonical PDF已分别成功冻结并验证页数、MIME和SHA。',
  },
];

export type SafeAssetFrontierReadingRecord = {
  title: string;
  authors: string;
  status: 'working-paper-frontier';
  canonicalUrl: string;
  pdfPath: string;
  pagePath: string;
  retrievedAt: string;
  pdfBytes: number;
  pdfPages: number;
  pdfSha256: string;
  pageBytes: number;
  pageSha256: string;
  allowedUse: string;
  forbiddenUse: string;
};

export const safeAssetFrontierReadingLedger: readonly SafeAssetFrontierReadingRecord[] = [
  {
    title: 'Decoupling Dollar and Treasury Privilege',
    authors: 'Wenxin Du, Ritt Keerati & Jesse Schreger',
    status: 'working-paper-frontier',
    canonicalUrl: 'https://www.nber.org/papers/w35000',
    pdfPath: 'tmp/research/4-03-draft/originals/nber/nber_w35000.pdf',
    pagePath: 'tmp/research/4-03-draft/originals/nber/nber_w35000_page_2026-09-16.html',
    retrievedAt: '2026-09-16',
    pdfBytes: 1983941,
    pdfPages: 72,
    pdfSha256: 'a7dca04b02ba9492032b817ab8beed92a6b2b255ba818be20518e544de4740d3',
    pageBytes: 89970,
    pageSha256: '389154bcac6597a29c140b3987655831d0d11ac9b3ea8b56b5258ee2c4720209',
    allowedUse: '只作为“美元货币便利与Treasury便利可能分离”的研究前沿阅读；正式引用须标NBER Working Paper 35000、March 2026与DOI 10.3386/w35000。',
    forbiddenUse: '不进入4.03核心证据、observed state或因果结论；不把工作论文中的样本均值、转负时点或回归系数当官方指标、稳定事实或政策阈值。',
  },
];
