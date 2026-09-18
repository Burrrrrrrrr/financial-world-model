import type { TreasuryCurveSourceId } from '../lessons/treasuryCurveReferences';
import type { TreasuryCurveLabId } from './treasuryCurveFixtures';

export type TreasuryCurveScenario = {
  id: string;
  labId: TreasuryCurveLabId;
  title: string;
  fixture: string;
  question: string;
  options: readonly { id: 'a' | 'b' | 'c'; text: string; correct: boolean; diagnosis: string }[];
  sourceIds: readonly TreasuryCurveSourceId[];
};

export const treasuryCurveScenarios: readonly TreasuryCurveScenario[] = [
  {
    id: '01', labId: 'C1', title: 'Treasury benchmark与swap discounting',
    fixture: 'CCP清算的USD swap按SOFR PAI；风险经理同时用Treasury futures管理部分duration。',
    question: '哪一种表述保留了两个角色而没有混同对象？',
    options: [
      { id: 'a', text: 'Treasury是全球benchmark，所以也是这份swap的合同discount curve。', correct: false, diagnosis: '把reference/hedge与合同折现制度合并；忽略CCP与PAI。' },
      { id: 'b', text: 'SOFR制度约束discounting；Treasury仍可作hedge与relative-value reference。', correct: true, diagnosis: '正确。相互影响不等于对象同一。' },
      { id: 'c', text: '只要用SOFR折现，Treasury就不再影响swap市场。', correct: false, diagnosis: '把“不是同一曲线”误读为“完全无传导”。' },
    ], sourceIds: [7, 8, 9],
  },
  {
    id: '02', labId: 'C1', title: 'On-the-run角色边界',
    fixture: '最新10Y note交易活跃且repo special；研究者想估计较少受个券便利影响的宏观zero curve。',
    question: '最合适的处理是什么？',
    options: [
      { id: 'a', text: '最新券最活跃，因此其yield必然是无噪声的纯宏观利率。', correct: false, diagnosis: '忽略liquidity、deliverability与specialness。' },
      { id: 'b', text: '承认新券适合价格发现；另用声明方法的off-the-run拟合做研究，并保留basis。', correct: true, diagnosis: '正确。工具选择服从用途，价格发现与宏观曲线估计不必共用同一输入。' },
      { id: 'c', text: 'Off-the-run券永远没有流动性楔子，所以直接视为真值。', correct: false, diagnosis: '反向绝对化；旧券仍有流动性、税务和市场结构。' },
    ], sourceIds: [1, 3, 6],
  },
  {
    id: '03', labId: 'C2', title: 'Par quote不能直接贴现',
    fixture: '只知道财政部10Y CMT为4%，资产在1Y、3Y、5Y各有现金流。',
    question: '能否把4%作为continuous zero rate统一贴现三笔现金流？',
    options: [
      { id: 'a', text: '能，因为所有现金流都在10年以内。', correct: false, diagnosis: '期限落在10年内不等于共享同一discount factor。' },
      { id: 'b', text: '不能；CMT是par quote，还缺完整curve、复利、日计数与对应zero nodes。', correct: true, diagnosis: '正确。信息不足必须STOP或明确近似。' },
      { id: 'c', text: '能，但只要把4%除以三笔现金流数量。', correct: false, diagnosis: '贴现率不会按现金流笔数平均；每笔现金流必须匹配自己的期限节点。' },
    ], sourceIds: [1, 2, 3],
  },
  {
    id: '04', labId: 'C2', title: 'Forward不是确定预测',
    fixture: '连续复利D(2)=0.92、D(3)=0.86。',
    question: '关于2Y–3Y forward的正确说法是？',
    options: [
      { id: 'a', text: 'f=ln(0.92/0.86)≈6.74%，是今日曲线隐含区间价格，不是确定未来短率。', correct: true, diagnosis: '正确；还可含期限溢价与其他楔子。' },
      { id: 'b', text: 'f=0.92−0.86=6%，就是市场保证实现的未来短率。', correct: false, diagnosis: '公式漏掉比值与对数，经济解释也把今日隐含价格误写成保证实现的结果。' },
      { id: 'c', text: '只要有discount factors，forward就自动剔除了所有风险溢价。', correct: false, diagnosis: '无套利坐标变换不等于结构分解，forward仍可包含期限溢价与其他楔子。' },
    ], sourceIds: [3],
  },
  {
    id: '05', labId: 'C3', title: '总DV01为0仍有曲线风险',
    fixture: 'Portfolio KRD=[4,2,6,1]，只用10Y hedge=[0,0,−13,0]，总和为0。',
    question: '遇到steepener时应怎样判断？',
    options: [
      { id: 'a', text: '总和为0，所以任何曲线变化P&L都为0。', correct: false, diagnosis: '只中和了平行方向摘要，忽略节点残余。' },
      { id: 'b', text: 'Residual=[4,2,−7,1]，需与各节点shock相乘；steepener可产生非零P&L。', correct: true, diagnosis: '正确；还需另报basis与convexity。' },
      { id: 'c', text: '只要10Y hedge足够大，2Y与30Y风险会自动消失。', correct: false, diagnosis: '单工具不会自动复制其他节点暴露。' },
    ], sourceIds: [3, 15],
  },
  {
    id: '06', labId: 'C3', title: '逐节点相抵后的剩余边界',
    fixture: 'Hedge恰好令四个SYN节点residual均为0。',
    question: '可以宣布组合“无风险”吗？',
    options: [
      { id: 'a', text: '可以，因为KRD是全部市场风险。', correct: false, diagnosis: 'KRD只是选定节点的一阶模型暴露。' },
      { id: 'b', text: '不可以；仍有convexity、basis、optionality、liquidity、funding与跳跃风险。', correct: true, diagnosis: '正确。零残余是有限合同，不是全面无风险。' },
      { id: 'c', text: '不可以，但唯一原因是Treasury有违约风险。', correct: false, diagnosis: '把主要剩余风险错误归为单一信用原因。' },
    ], sourceIds: [3, 9, 15],
  },
  {
    id: '07', labId: 'C4', title: 'Yield↑与股票↑可以共存',
    fixture: 'SYN growth-information：Treasury +20bp；CF +3%；duration 4；ERP −20bp。',
    question: '近似净贡献为何仍可为正？',
    options: [
      { id: 'a', text: 'CF +3%，Rf −0.8%，ERP +0.8%，净约+3%。', correct: true, diagnosis: '正确。增长现金流与ERP下降抵消了更高Treasury rate。' },
      { id: 'b', text: 'Yield上升，所以无论其他输入如何都必须为负。', correct: false, diagnosis: '用yield sign删除现金流和risk premium。' },
      { id: 'c', text: '净为正证明Treasury不影响股票。', correct: false, diagnosis: '净结果不能否定其中一个非零贡献。' },
    ], sourceIds: [12, 13],
  },
  {
    id: '08', labId: 'C4', title: '净0不是没有机制',
    fixture: 'CF +2.5%、Rf拖累−1.0%、ERP拖累−1.5%、basis 0。',
    question: '净变化约0时应怎样解释？',
    options: [
      { id: 'a', text: '所有驱动都等于0。', correct: false, diagnosis: '把净额0误解为各分项0，删除了三个方向相反但非零的传导贡献。' },
      { id: 'b', text: '三个非零贡献在本SYN近似中抵消；需保留分项与driver。', correct: true, diagnosis: '正确。zero outcome不抹去机制。' },
      { id: 'c', text: '价格没有变化，所以无需证据时钟。', correct: false, diagnosis: '即使净0，时钟和识别仍决定分项含义。' },
    ], sourceIds: [12, 13],
  },
  {
    id: '09', labId: 'C5', title: '更高美元回报可被套保成本抵消',
    fixture: 'USD资产+2%；100% hedge；forward cost 2%；basis cost 0.4%。',
    question: '在本SYN贡献约定下，套保后本币回报是多少？',
    options: [
      { id: 'a', text: '+2.0%，因为套保删除了所有成本。', correct: false, diagnosis: '套保删除spot暴露，不会免费。' },
      { id: 'b', text: '约−0.4%，即2−2−0.4。', correct: true, diagnosis: '正确；尚未计roll、collateral、税与交易成本。' },
      { id: 'c', text: '无法为负，因为Treasury是safe asset。', correct: false, diagnosis: '把名义信用服务与本币总回报混同。' },
    ], sourceIds: [14],
  },
  {
    id: '10', labId: 'C5', title: '关键套保输入未知',
    fixture: '只知道USD资产回报+2%；本币、FX报价、hedge ratio与forward cost均未知。',
    question: '套保后本币回报应登记为什么？',
    options: [
      { id: 'a', text: '+2%，因为未知成本可视为0。', correct: false, diagnosis: 'Unknown不等于经济零；缺失的成本与套保比例不能被静默填成0。' },
      { id: 'b', text: 'null，并逐项记录缺失字段。', correct: true, diagnosis: '正确；不强制假定0%或100% hedge。' },
      { id: 'c', text: '−2%，因为外国投资者一定支付2%套保费。', correct: false, diagnosis: '凭空创造统一成本与套保比例，忽略了本币、期限、basis和机构授权差异。' },
    ], sourceIds: [14],
  },
  {
    id: '11', labId: 'C6', title: 'Unknown driver必须保留null',
    fixture: '只观察U.S. long yield +25bp，没有事件窗口或联合资产识别。',
    question: '系统应怎样输出本地short-rate与term-premium贡献？',
    options: [
      { id: 'a', text: '自动按policy shock系数计算。', correct: false, diagnosis: '从yield sign强制命名结构冲击。' },
      { id: 'b', text: 'Driver=unknown，两项贡献保持null，同时列出候选机制。', correct: true, diagnosis: '正确；unknown是信息状态。' },
      { id: 'c', text: '两项都填0，因为无法识别。', correct: false, diagnosis: '不可识别不等于经济上没有作用。' },
    ], sourceIds: [10, 11, 12, 13],
  },
  {
    id: '12', labId: 'C6', title: 'Reverse spillover不能静默净掉',
    fixture: 'SYN本地long-yield response +13bp，同时外国消息对Treasury产生+4bp reverse contribution。',
    question: '最透明的状态记录是什么？',
    options: [
      { id: 'a', text: '只报净17bp，并写“美国传向全球”。', correct: false, diagnosis: '把两条不同方向与时钟的路径净掉，并把双向网络误写成美国单向传导。' },
      { id: 'b', text: '分别报本地渠道与+4bp reverse flag；说明二者时钟和识别。', correct: true, diagnosis: '正确；分别保留方向、时钟和识别状态，网络路径才保持可审计。' },
      { id: 'c', text: 'Reverse spillover理论上不可能，因为Treasury规模最大。', correct: false, diagnosis: '市场规模不构成因果单向性；外国消息和配置仍可进入Treasury term premium。' },
    ], sourceIds: [10, 11],
  },
] as const;

export const treasuryCurveScenarioAudit = [
  { key: 'twelve scenarios allocate exactly two to each independent lab', passed: treasuryCurveScenarios.length === 12 && ['C1', 'C2', 'C3', 'C4', 'C5', 'C6'].every(id => treasuryCurveScenarios.filter(item => item.labId === id).length === 2) },
  { key: 'every scenario has exactly one correct option and unique ids', passed: new Set(treasuryCurveScenarios.map(item => item.id)).size === 12 && treasuryCurveScenarios.every(item => item.options.length === 3 && item.options.filter(option => option.correct).length === 1) },
  { key: 'every scenario has evidence and diagnoses for all answer paths', passed: treasuryCurveScenarios.every(item => item.sourceIds.length > 0 && item.options.every(option => option.diagnosis.length >= 15)) },
] as const;
