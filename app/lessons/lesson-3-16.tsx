import HousingLabStatic from '../components/HousingLabStatic';
import HousingPriceChart from '../components/HousingPriceChart';
import HousingQuiz from '../components/HousingQuiz';
import HousingStaticQuiz from '../components/HousingStaticQuiz';
import { housingCanonicalResults, housingC1, housingC2, housingC3, housingC4, housingC5, housingC6, housingC7, housingFixtureAudit } from '../components/housingCollateralFixtures';
import { housingScenarioAudit, housingScenarios } from '../components/housingCollateralScenarios';
import { housingLabDefinitionsAudit, housingLabs } from '../components/housingLabDefinitions';
import { housingPriceDataAudit, housingPricePassport } from '../components/housingPriceData';
import styles from '../components/housingCollateral.module.css';
import { canonicalDebtLeverageStateExample, lesson315 } from './lesson-3-15';
import { housingConcepts } from './housingCollateralConcepts';
import { lesson316ReadingList, lesson316References } from './lesson-3-16-sources';
import type { LessonRecord } from './types';

function Cites({ ids }: { ids: readonly number[] }) {
  return <>{ids.map((id)=><a className="citation-mark" key={id} aria-label={`参考文献${id}`} href={`#ref-${id}`}>[{id}]</a>)}</>;
}

const producerPaths = ['stateId', 'schemaVersion', 'scopePassport', 'balanceSheetIdentityState', 'maturityRefinancingState', 'liquidityBufferState', 'distributionState', 'evidenceState', 'dynamicDataPassports'] as const;
const optionalCount = housingConcepts.filter(({optional})=>optional).length;
export const canonicalHousingCollateralStateExample = {
  schemaVersion: 'housing-collateral-feedback-state-v1', stateId: 'SYNTHETIC_REGISTERED_HOUSING_COLLATERAL_STATE',
  scopePassport: { subjectId: 'SYN-HOUSING-TEACHING-SCENARIO-REGISTRY', country: 'synthetic-no-jurisdiction', currency: 'SYN', propertyScope: 'seven-independent-experiments-not-one-household-trajectory', scenarioScopes: [{id:'C1',subject:'single-owner-equity-snapshot'},{id:'C2',subject:'single-new-buyer-capacity-and-closing'},{id:'C3',subject:'single-refinancing-closing'},{id:'C4',subject:'single-comparison-date-payment-contract'},{id:'C5',subject:'single-household-frozen-stress-window'},{id:'C6',subject:'single-executed-sale-recovery'},{id:'C7',subject:'100-household-synthetic-distribution'}], valuationBasis: 'nominal-teaching-market-value', snapshotAt: '2026-09-15T09:18:23Z', amountUnit: 'SYN currency', incomeUnit: 'SYN currency per month' },
  inputLineage: [{ producerLesson: '3.15', producerRevision: lesson315.revision, producerStateId: canonicalDebtLeverageStateExample.stateId, producerRevisionMarker: canonicalDebtLeverageStateExample.auditTimestamps.reviewFrozenAt, relation: 'direct-contextual-import-only', numericCalibration: false, mappings: producerPaths.map((path)=>({sourcePath:path,targetPath:`upstreamDebtLeverageState.${path}`})) }],
  upstreamDebtLeverageState: canonicalDebtLeverageStateExample,
  clockState: { informationCutoff: '2026-09-15T09:18:23Z', scenarioRegistrationSnapshot: '2026-09-15T09:18:23Z', budgetWindow: 'next-12-months-frozen-teaching-window', spendingResponseWindow: 'next-12-months-cumulative', officialRetrievalAtUtc: housingPricePassport.retrievedAtUtc, ownReviewFrozenAt: '2026-09-15T14:21:05.552Z' },
  unitContract: { priceAndDebt: 'nominal-SYN-stock', cash: 'nominal-SYN-stock', budgetFlows: 'nominal-SYN-per-month', interestRate: 'monthly-decimal', annuityPeriods: 'integer-months', officialIndex: housingPricePassport.unit, officialIndexMayCalibrateHousehold: false },
  valuationState: { marketValue: housingC1.price, lenderApprovedAppraisal: null, executedSalePrice: housingC6.salePrice, officialPriceContext: housingPricePassport.sourceId, differentScenariosMustNotMerge: true },
  homeEquityState: { input: housingC1, result: housingCanonicalResults.c1, cashIsHousingEquity: false },
  originationState: { input: housingC2, result: housingCanonicalResults.c2, ltvLimitIsSynthetic: true, bindingGateIsLoanApproval: false },
  closingCashState: { cashGapAtCapacity: housingCanonicalResults.c2.cashGapAtCap, transactionCompleted: null },
  cashOutState: { input: housingC3, result: housingCanonicalResults.c3, oldLoanFullyDischargedInScenario: true, accruedUnpaidOldInterest: 0, otherClosingChargesIncludedInFees: true, actualConsumerSpending: null },
  inheritedContractState: { frmHasPriceMaintenanceMarginInTeachingModel: false, incomeAndTaxInsuranceFrozenByPrice: false, realContractCollected: false },
  resetState: { input: housingC4, result: housingCanonicalResults.c4, resetDueNow: false, armCapsCollected: false, futureBalanceKnown: false },
  additionalDrawState: { product: 'US-open-end-HELOC-legal-orientation-only', frozenUnusedDrawIsPrincipalAcceleration: false, actualPlanEligibility: null },
  stressState: { input: housingC5, result: housingCanonicalResults.c5, negativeEquityIsDefault: false, cashRunwayIsDefaultDate: false },
  eventState: { missedPayment: null, delinquencyDefinition: null, defaultConfirmedAt: null, foreclosureCompletedAt: null, modelImmediateForeclosureIsObservedClock: false },
  recoveryState: { input: housingC6, result: housingCanonicalResults.c6, priorityStatus: 'declared-teaching-assumption', legalRecourse: null, deficiencyEqualsFinalLoss: false },
  householdDistributionState: { groups: housingC7, result: housingCanonicalResults.c7, responseCoefficientsStatus: 'synthetic-not-estimated-MPC', incomeFeedbackIncluded: false },
  localMarketState: { housingStock: null, constructionFlow: null, listings: null, turnover: null, searchTime: null, supplyElasticity: null, nationalPriceIsLocalLiquidity: false },
  lenderState: { holderIdentity: null, realizedLoss: null, capitalConstraintBinding: null, guaranteeRecovery: null, newLoanSupplyEffect: null },
  feedbackState: { priceCreditDirection: 'simultaneous-unidentified', priceImpactFunction: null, localIncomeResponse: null, nationalMultiplier: null, aPossibleArrowIsAnObservedAction: false },
  evidenceState: { householdArithmetic: 'synthetic-audited', priceContext: 'official-current-endpoint-historical-snapshot', historicalPIT: false, causalStatus: 'not-identified', predictionStatus: 'not-estimated', crisisProbability: null, phaseLabel: 'not-classified', gmReadingVersion: '2019-11-19-author-manuscript-not-verified-typeset-final-equivalence' },
  dynamicDataPassports: [housingPricePassport],
  boundaryRoutes: [{ destination: '5.17', payload: 'China property, presales, developer, local fiscal and banking institutions', guardrail: 'US HELOC/foreclosure contracts are not imported as Chinese law' }, { destination: '7.24–7.26', payload: 'PIT archive, target and identification design', guardrail: 'no crisis predictor inferred from retrospective peak/trough' }],
} as const;

export const canonicalHousingCollateralStateFields = [
  'schemaVersion','stateId','scopePassport','inputLineage','upstreamDebtLeverageState','clockState','unitContract','valuationState','homeEquityState','originationState','closingCashState','cashOutState','inheritedContractState','resetState','additionalDrawState','stressState','eventState','recoveryState','householdDistributionState','localMarketState','lenderState','feedbackState','evidenceState','dynamicDataPassports','boundaryRoutes',
] as const satisfies readonly (keyof typeof canonicalHousingCollateralStateExample)[];
function resolvePath(object: unknown, path: string): {found:boolean;value?:unknown} {
  let cursor=object;
  for(const segment of path.split('.')) { if(typeof cursor!=='object'||cursor===null||!Object.prototype.hasOwnProperty.call(cursor,segment)) return {found:false}; cursor=(cursor as Record<string,unknown>)[segment]; }
  return {found:true,value:cursor};
}
function sameMapping(source: unknown,target: unknown,sourcePath: string,targetPath: string) { const a=resolvePath(source,sourcePath),b=resolvePath(target,targetPath);return a.found&&b.found&&a.value!==undefined&&b.value!==undefined&&Object.is(a.value,b.value); }
const state=canonicalHousingCollateralStateExample;
export const canonicalHousingCollateralStateAudit = [
  {key:'canonical keys covered exactly without silent extra fields',passed:new Set(canonicalHousingCollateralStateFields).size===canonicalHousingCollateralStateFields.length&&Object.keys(state).length===canonicalHousingCollateralStateFields.length&&canonicalHousingCollateralStateFields.every((key)=>Object.prototype.hasOwnProperty.call(state,key))},
  {key:'sole direct 3.15 producer contextual, not numeric household calibration',passed:state.inputLineage.length===1&&state.inputLineage[0].producerRevision===lesson315.revision&&state.upstreamDebtLeverageState===canonicalDebtLeverageStateExample&&!state.inputLineage[0].numericCalibration},
  {key:'all nine producer mappings preserve primitive or object identity',passed:state.inputLineage[0].mappings.length===9&&state.inputLineage[0].mappings.every(({sourcePath,targetPath})=>sameMapping(canonicalDebtLeverageStateExample,state,sourcePath,targetPath))},
  {key:'missing paths, mismatched scope and equal clone rejected',passed:!sameMapping(canonicalDebtLeverageStateExample,state,'__missing__','upstreamDebtLeverageState.stateId')&&!sameMapping(canonicalDebtLeverageStateExample,state,'stateId','upstreamDebtLeverageState.__missing__')&&!sameMapping(canonicalDebtLeverageStateExample,state,'scopePassport','upstreamDebtLeverageState.evidenceState')&&!sameMapping({a:{x:1}},{b:{x:1}},'a','b')},
  {key:'producer revision marker and official acquisition before information cutoff',passed:Date.parse(state.inputLineage[0].producerRevisionMarker)<=Date.parse(state.clockState.informationCutoff)&&Date.parse(housingPricePassport.retrievedAtUtc)<=Date.parse(state.clockState.informationCutoff)},
  {key:'seven separate scenario scopes; C7 is 100 households, not C1 or C6 trajectory',passed:state.scopePassport.scenarioScopes.map(({id})=>id).join('|')==='C1|C2|C3|C4|C5|C6|C7'&&state.scopePassport.scenarioScopes[6].subject==='100-household-synthetic-distribution'&&state.valuationState.differentScenariosMustNotMerge&&state.homeEquityState.input===housingC1&&state.recoveryState.input===housingC6&&state.unitContract.officialIndexMayCalibrateHousehold===false},
  {key:'capacity approval closing feasibility and actual draw remain separate',passed:state.originationState.result.approval===null&&state.originationState.result.actualDraw===null&&state.closingCashState.transactionCompleted===null&&!state.originationState.bindingGateIsLoanApproval},
  {key:'cash-out uses actual debt and complete closing; zero unpaid interest explicit, spending unknown',passed:state.cashOutState.result.cashOut===8&&state.cashOutState.result.newDebt===85&&state.cashOutState.accruedUnpaidOldInterest===0&&state.cashOutState.otherClosingChargesIncludedInFees&&state.cashOutState.actualConsumerSpending===null},
  {key:'inherited payment and HELOC additional-draw freeze never become price margin call',passed:!state.inheritedContractState.frmHasPriceMaintenanceMarginInTeachingModel&&!state.additionalDrawState.frozenUnusedDrawIsPrincipalAcceleration},
  {key:'negative equity budget gap and observed default separate; legal recovery unfilled',passed:state.stressState.result.default===null&&state.eventState.defaultConfirmedAt===null&&state.recoveryState.result.finalCreditorLoss===null&&state.recoveryState.legalRecourse===null},
  {key:'synthetic spending coefficient, local price and lender bridge never estimated implicitly',passed:state.householdDistributionState.responseCoefficientsStatus==='synthetic-not-estimated-MPC'&&state.localMarketState.supplyElasticity===null&&state.lenderState.newLoanSupplyEffect===null&&state.feedbackState.nationalMultiplier===null},
  {key:'official snapshot provenance outside synthetic inputs, no prediction or causal claims',passed:!state.dynamicDataPassports[0].mayEnterHouseholdCalculation&&!state.evidenceState.historicalPIT&&state.evidenceState.causalStatus==='not-identified'&&state.evidenceState.crisisProbability===null},
] as const;

const checks: readonly {question:string;answer:string;ids:readonly number[]}[] = [
  {question:'房价跌10%，房屋权益为什么可能跌50%？',answer:'债务本金冻结，损失先穿透残余权益。100房价、80抵押债务留下20；跌至90后权益10。机械放大不代表现金已损失10或按揭被追缴。',ids:[2,5]},
  {question:'一押LTV70%能说明总住房抵押负债只有70%吗？',answer:'不能；还要查二押与同快照余额。本实验70一押加10二押形成CLTV80%，未提款HELOC不当作已借本金，家庭其他债务仍需另列。',ids:[2,9]},
  {question:'提高LTV上限为什么可能不增加可借金额？',answer:'若付款预算先绑定，抵押门放宽没有改变较小上限。C2付款容量约62.811低于80；收入、利率、期限及其他义务决定支付门。',ids:[1,2,7]},
  {question:'月付款预算合格为什么仍无法交割？',answer:'未来月收入不能自动替代交割日现金；按容量借满仍需自有资金37.189加费用2，现金25留下14.189缺口。批准与实际成交还未知。',ids:[2,7]},
  {question:'cash-out8和新增贷款85、净增债10为什么不同？',answer:'新借85先清旧债75，再扣费用2，真正额外现金8。旧债全清后的新存量85，不能把已注销75继续加进去。',ids:[2,9]},
  {question:'实际借入70而交割用途77时，清旧债是否已经完成？',answer:'只有另提供7外部现金才可完成本课全清旧债的条件成交；计算现金需求不是观察到资金已提供。若旧债没清，必须保留旧债另建账本。',ids:[2,9]},
  {question:'存量FRM负权益意味着普通按揭立即补仓吗？',answer:'不能仅因价格推断。普通长期固定合同与每日证券保证金不同；正常付款且无持续市值补仓条款时，价格先影响净值、退出或新融资机会。',ids:[1,2,7]},
  {question:'固定P&I不变，家庭住房账单与付款压力也不变吗？',answer:'不是。税险等支出可以独立变化，收入下降会减少现金覆盖。固定P&I、总住房支出和月预算余额是三个状态。',ids:[7,10]},
  {question:'ARM未来重置为何不能一直用今日余额和剩期？',answer:'未来已还本和到期时间不同；在重置日重新登记余额、剩期、指数、加点与cap。C4只有同日冻结比较，不是未来日期预测。',ids:[7,10]},
  {question:'冻结额外HELOC提款等于原本金立即加速到期吗？',answer:'不是。特定美国open-end规则区分额外扩张限制和终止加速；未提款选项也不是现金。具体有效条款和法域仍需查。',ids:[8,9]},
  {question:'为什么负权益和收入压力应二维交叉？',answer:'负权益可能阻断退出，收入短缺造成付款赤字。房价70收入2可以负权益但无赤字；房价100收入1.2可以正权益但有赤字；相遇时缓冲与选项同时变弱。',ids:[4,5]},
  {question:'现金runway7.5个月能预测第7.5个月违约吗？',answer:'不能。它在固定赤字0.4、现金3及无其他调整下计算覆盖；真实收入恢复、支出重配、融资和重组会改变事件。没有逾期观察就没有默认事件。',ids:[4,5]},
  {question:'止赎模型即时完成能当作现实执行时钟吗？',answer:'不能。遗漏付款、研究逾期定义、法院执行、收回和REO成交不是同一时点；模型即时完成是条件假设，法域和收入恢复会改变反馈。',ids:[4,5,6]},
  {question:'C6次级抵押回收不足13就是最终法律损失吗？',answer:'不是。净池57先优先50再次级7；剩欠13还需后续追偿、担保、成本和时间。排序也仅为声明的教学输入，不是全球法律。',ids:[4,6]},
  {question:'业主都因涨价多消费，租户完全不受影响吗？',answer:'两项都不成立。未来换大房者和缩小住房者净需要不同；租户可经租金、首付、当地就业受影响。C7零直接资产暴露只是第一轮隔离条件。',ids:[2,3,11]},
  {question:'县级地理支出响应就是纯粹个人住房MPC吗？',answer:'不是。测量单位、支出类别、当地收入反馈和IV排除限制决定估计对象；MRS汽车ZIP与县级支付卡也不能直接替全部个人消费。',ids:[3]},
  {question:'新建减少、挂牌增多、成交减少能同时发生吗？',answer:'能。新建是流量，总房屋是耐久存量，挂牌是待交易库存，成交是匹配结果；衰退时新建停下不会让旧房存量即时消失。',ids:[4,11]},
  {question:'优惠旧FRM减少换房，净价格效果必然向上吗？',answer:'不必然。留住旧房同时可能减少卖盘和新买盘；迁居方向、首次及现金买家、供给和替代决定净结果。本课未导入锁定估计。',ids:[2,7,19]},
  {question:'正确重画FHFA峰谷就完成历史PIT与因果识别吗？',answer:'没有。当前快照会修订，季度是观察归属而不是当年收到日期；事后选峰谷不是事先信号。因果还需合同、收入、供给及可辩护处理。',ids:[12,13,14]},
  {question:'为什么降月付、减本金、延迟执行不能作为同义政策？',answer:'分别先影响现金覆盖、净权益与债权分配、执行和恢复时钟；还需财政成本、资本、激励及福利权重。模型价格改善不是无条件福利排名。',ids:[2,4,18]},
];

const glossary: readonly (readonly [string,string,string])[] = [
  ['Housing services','居住面积、质量与使用服务','不是可立即支出的资产售价'],['Market value','快照中住房可交易估值','不是已成交净售价'],['Appraisal','特定日期和规则下评估的物业价值','不是全国指数按比例缩放'],['Purchase-only HPI','覆盖定义下的住房购买重复销售指数','不是美元平均售价或全体房产'],['SA / NSA','季调／未季调口径','两个字段不可混用'],['Nominal / real','名义货币价值／经购买力调整价值','名义回峰不等于实际财富恢复'],['Home equity','房屋市值扣全部已借住房抵押余额','不含流动现金'],['First lien','已声明较优先的住房担保债权','未核法律时不自动定义所有优先权'],['Second lien','另列的住房担保债务','不能从一押LTV消失'],['LTV','本课一押余额／同快照认可房价','不是家庭总负债／收入'],['CLTV','合并已借住房抵押余额／房价','不含未提款额度'],['Liquid buffer','目标日可实际调动的现金','不是住房权益或未承诺授信'],['Origination','新合同发放过程及当时资格','不是存量按揭重新测试所有条件'],['Payment budget','明确扣其他用途后可用于P&I的月预算','不是法定统一DSR线'],['P&I','principal and interest，本金加利息付款','不是所有税险住房账单'],['Annuity factor','给定月息剩期的全摊还付款系数','不是任意贷款产品的报价'],['Down payment','交割日自有购房资金','不是未来工资自动到账'],['Closing cost','同次成交另计用途或费用','不能在净值提取漏掉'],['Capacity','满足声明技术上限的可借空间','不是批准'],['Approval','贷款人的条件决定','不是实际提款'],['Drawdown','已交付的借款资金','不是全部都可消费'],['Cash-out','新债成交清旧债扣费用后的额外现金','不是房价升值本身'],['FRM','fixed-rate mortgage，固定利率按揭','固定P&I不代表总支出固定'],['ARM','adjustable-rate mortgage，可调利率按揭','新报价不等于立刻到重置日'],['Index / margin / cap','ARM参考指数／加点／变化限制','忽略cap的教学值不是真实合同'],['HELOC','home equity line of credit，房屋净值信贷额度','不是闭合一押或证券补仓'],['Draw freeze','对未来额外授信的限制','不是原本金立即加速清偿'],['Negative equity','房屋市值低于声明抵押本金','不是家庭现金违约'],['Double trigger','负权益与流动性困难结合的模型违约机制','不是现实只存在这类违约'],['Runway','冻结赤字下现金能覆盖的期间','不是违约预测日期'],['Delinquency','按明确文件定义的逾期状态','不是法院已收回物业'],['Foreclosure','特定法律环境下担保执行过程','不是负权益快照'],['REO','real estate owned，贷款人收回后拥有房产','不是所有低价挂牌'],['Deficiency','首次抵押回收不足的债权余额','不是已判追索或最终损失'],['Recourse','对抵押以外资源的有效追偿可能性','法条标签不等于实际收款'],['Housing stock','已存在房屋存量','不是新建或当期成交'],['Listings / turnover','待售挂牌／实际交易周转','不是全市房屋总量'],['Supply elasticity','供给对价格的响应且带市场／期间','不是各地区恒定普适系数'],['Lock-in','旧贷退出或换房的条件机会成本','不是所有未出售家庭都受处理'],['MPC','marginal propensity to consume，特定资源变化的边际消费倾向','合成β和地理总响应不自动等于个人因果MPC'],['IV exclusion','工具通过指定渠道影响结果的排除限制','仅与供给相关不够'],['Structural counterfactual','在模型假设内关闭或改变渠道的反事实','不是直接观察历史冲击份额'],['Current vintage','本次取得时的修订历史','不是historical point-in-time'],['PIT','point-in-time，当时真实可见的信息版本','当前哈希不替代当年发布时间'],
];

const invariants = [
  '每笔输入冻国家／家庭／物业／币种／估值日／合同日期；全国指数与单户账本不同域。',
  '房屋权益、流动现金、新贷容量、实际提款、付款与最终损失永久分栏。',
  '一押、二押均以同快照已借本金计入；未提款授信另列，旧债已清则不再计入新存量。',
  '支付模型固定为名义月末全摊还；月息、月数、月收入匹配，年率不可未经转换直接输入。',
  '容量不是批准；首付缺口不是成交；cash-out不是实际消费。',
  '固定按揭没有教学价格补仓条款；现实有效合同未知，不作全球免责判断。',
  'ARM只在声明比较日重置；未来余额、剩期与cap缺失时不得外推。',
  'HELOC额外提款冻结与本金加速清偿分别识别，Reg Z只适用所述美国open-end范围。',
  '负权益、月赤字、窗口资金缺口、逾期、违约、止赎和实际售出按独立事件时钟记录。',
  '回收先扣声明费用再按声明顺序分配同一净池；未收余额不默认最终法律损失。',
  '每组响应保留人数、货币冲击、响应期间和合成系数身份；分母相消返回未定义。',
  '住房存量、新建流量、挂牌、成交、市场搜寻和中介资本不得缺失填零。',
  '官方当前快照只作描述背景；原字节不覆盖，峰谷规则事后标签、发布日和取得日分开。',
  '模型、地理因果设计和法律规则各有支持范围；没有实际研究就不填预测概率、乘数或周期阶段。',
] as const;

const interfaces = [
  ['3.11 Borrower Collateral','净值、可质押与融资选择集合','住房新贷、旧按揭和退出分别登记，不把一般加速器变成所有存量补仓'],
  ['3.14–3.15 Credit / Leverage','唯一直接3.15上下文对象，背景信用循环与固定承诺','上下文不是家庭SYN账本校准；部门负债／DPI不能当平均LTV'],
  ['3.09–3.10 Intermediaries','贷款持有人、风险转移、损失与新贷供给','先识别实际机构资本是否绑定，再讨论房价二轮反馈'],
  ['3.17 Fiscal Policy','政策资源、收入缓冲和损失转移','降月付／减本金／资本补充不是同一财政处理；福利与融资另研究'],
  ['5.17 China Property Regime','预售、开发商、交付、土地与地方财政及银行耦合','美国HELOC与止赎不是中国默认法律；每项制度需重新核读'],
  ['7.11–7.13 Feedback / Fire Sale','融资流动性、保证金和市场处置反馈','普通FRM不自动等于维护保证金；本地处置价格函数未估计'],
  ['7.16 Networks','担保持有人与跨机构、共同风险暴露','C6只停在首次回收；未核二跳不得宣称系统总损失'],
  ['7.24–7.26 Research','版本、目标、信息时钟、对照与可证伪设计','当前峰谷描述不是PIT信号，相关、模型份额与因果系数分开'],
] as const;

const referenceIds=new Set(lesson316References.map(({id})=>id));
const sectionIds=['thesis','official-data',...housingConcepts.map(({id})=>id),'model-comparison','interactive-lab','housing-static-twins','checks-glossary','evidence-boundaries'];
const citations=[...housingConcepts.flatMap(({sourceIds})=>sourceIds),...housingLabs.flatMap(({sourceIds})=>sourceIds),...housingScenarios.flatMap(({sources})=>sources),...checks.flatMap(({ids})=>ids)];
export const lesson316IntegrityAudit = [
  {key:'25 concepts, 21 core and 4 optional; three coherent paragraphs source and boundary each',passed:housingConcepts.length===25&&optionalCount===4&&housingConcepts.every(({paragraphs,sourceIds,boundary})=>paragraphs.length===3&&paragraphs.every((p)=>p.length>=90)&&sourceIds.length>0&&boundary.length>=30)},
  {key:'all section IDs unique and M/K routes resolve',passed:new Set(sectionIds).size===sectionIds.length&&housingScenarios.every(({anchor})=>sectionIds.includes(anchor))},
  {key:'C1–C7 once each, pure outputs and wrong paths audited',passed:housingConcepts.filter(({labId})=>labId).map(({labId})=>labId).join('|')==='C1|C2|C3|C4|C5|C6|C7'&&housingFixtureAudit.every(({passed})=>passed)&&housingLabDefinitionsAudit.every(({passed})=>passed)&&housingScenarioAudit.every(({passed})=>passed)},
  {key:'all citations resolve; nineteen primary identities declare support and non-support',passed:citations.every((id)=>referenceIds.has(id))&&lesson316References.length===19&&lesson316References.every(({id,url,use},i)=>id===i+1&&url.startsWith('https://')&&use.includes('支持')&&use.includes('不支持'))},
  {key:'candidate readings do not imply full verification or imported numerical estimates',passed:lesson316References.slice(14).every(({publication,use})=>publication.includes('全文')&&use.includes('不支持'))},
  {key:'twenty checks, forty-plus glossary, fourteen invariants, eight interfaces and ten reading cards',passed:checks.length===20&&glossary.length>=40&&invariants.length===14&&interfaces.length===8&&lesson316ReadingList.length===10},
  {key:'canonical state and retained official observation transformations pass',passed:canonicalHousingCollateralStateAudit.every(({passed})=>passed)&&housingPriceDataAudit.every(({passed})=>passed)},
] as const;
if(lesson316IntegrityAudit.some(({passed})=>!passed)) throw new Error(`3.16 lesson integrity: ${lesson316IntegrityAudit.filter(({passed})=>!passed).map(({key})=>key).join('; ')}`);

function Lesson316Content() {
  return <>
    <noscript><style>{'[data-lesson-id="3.16"] .housing-interactive-only, [data-lesson-id="3.16"] #interactive-lab { display: none !important; }'}</style><p className="precision-note" data-housing-nojs-notice>JavaScript未启用，动态实验与M题已隐藏，避免修改输入后结果不更新。C1–C7固定记录仍可原生展开，K1–K10保留全部题设、答案与错路径诊断，可手算和打印。</p></noscript>
    <section className="lesson-section lesson-opening" id="thesis"><p className="section-kicker">00 · CORE THESIS</p><h2>住房放大金融周期，不是因为房价一跌所有按揭立即追缴，而是住房把估值、边际融资、继承合同和本地交易接在一起。</h2>
      <p>3.15已经解释固定债务承诺怎样留下薄缓冲和偿付时钟。房地产将这个框架落在一个特殊对象上：住房既是居住服务、资产，又是担保；不易快速拆分交易，供给与执行都有延迟，家庭的未来住房需要也不同。我们先让现金、权益和贷款容量各归其位，再追踪真正的申请、提款、支出与交易如何返回本地价格和收入。</p>
      <div className="impact-facts" role="group" aria-label="3.16核心门槛"><article><span>价值门</span><b>price → equity / appraisal</b><p>账面缓冲变化，尚未证明现金流出或实际损失。</p></article><article><span>合同门</span><b>new eligibility ≠ inherited payment</b><p>新贷、再融资、额外提款和旧月供用不同规则与时钟。</p></article><article><span>市场门</span><b>actual action → matching / price / income</b><p>真实行为与本地吸收决定反馈，而不是箭头自身证明放大。</p></article></div>
      <div className="equation-card"><span>本课唯一中心机制</span><div><code>price / income / beliefs → household and lender constraints → application / approval / draw / purchase or spending → local transactions / prices / income → next eligibility and payment stress</code></div><p>每个箭头都需要明确主体和条件；固定合同、现金缓冲、租住替代、补股和供给扩张可削弱甚至切断反馈。</p></div>
      <p>主线不要求先解一个完整动态均衡模型。先手算净权益、新贷容量、首付、净值提取、月付和净处置，再用异质家庭与市场吸收理解闭环。最后比较四篇核心研究的合同和估计对象，学会区别一项有条件机制、一个地理总响应、模型反事实和当前法规，避免引用同名词却回答不同问题。</p>
      <p className="precision-note"><b>当前版本：</b>3.16-r1正文依据同一冻结修订稿的两名独立审稿人批准封版；计算、来源边界与63页校样均已核查，不继承3.15的审批。</p><p className="section-sources"><b>核心依据：</b><Cites ids={[1,2,3,4,11]} /></p>
    </section>
    <section className="lesson-section" id="official-data"><p className="section-kicker">01 · READING ROUTE & OFFICIAL PRICE CONTEXT</p><h2>先看真实价格历史，再承认曲线不能替我们识别合同、现金和因果方向。</h2>
      <p>图形来源是美国联邦住房金融局（Federal Housing Finance Agency，FHFA）。购买型房价指数记录覆盖范围内的重复住房购买价格变化；它不是全国平均房屋售价，也不包含某个家庭的贷款合同。下方图注与数据护照给出具体口径、版本和不可推论的范围。</p>
      <p>这张图展示一个足够长的历史价格背景，而非我们正在运行的预测模型。C1–C7的所有金额都是独立合成家庭例子，不能按全国指数直接计算某套房抵押。第一轮请依序读核心单元；{optionalCount}个optional deep dive用于补足止赎、中介、收入和政策反馈，不是先修障碍。每个实验先手算固定基准，再只改变一个门槛。</p><HousingPriceChart />
      <div className="precision-note"><span>首现术语四分法</span><p><b>equity</b>是资产减债务的剩余价值；<b>cash</b>是实际可用货币；<b>capacity</b>是满足声明上限的可能借款；<b>payment</b>是某期间真正应付的本金利息。将它们分开以后，LTV、FRM、ARM和HELOC将在对应单元逐一解释；不需要事前背完术语表。</p></div><p className="section-sources"><Cites ids={[12,13,14]} /></p>
    </section>
    {housingConcepts.map((concept,index)=><section className="lesson-section" id={concept.id} key={concept.id}><p className="section-kicker">{String(index+2).padStart(2,'0')} · {concept.optional?'OPTIONAL DEEP DIVE':'CORE MECHANISM'}</p><h2>{concept.title}</h2>{concept.paragraphs.map((paragraph)=><p key={paragraph}>{paragraph}</p>)}{concept.formula?<div className="equation-card"><span>{concept.label} · 必要算式</span><div><code>{concept.formula.expression}</code></div><p>{concept.formula.explanation}</p></div>:null}<div className={concept.labId?'housing-lab-bundle':undefined}><div className="precision-note"><span>成立条件与不能推出的结论</span><p>{concept.boundary}</p></div>{concept.labId?<HousingLabStatic labId={concept.labId}/>:null}</div><p className="section-sources"><b>本机制依据：</b><Cites ids={concept.sourceIds}/></p></section>)}
    <section className="lesson-section" id="model-comparison"><p className="section-kicker">MODEL / ESTIMAND MAP</p><h2>四篇核心研究的分歧先来自合同、市场和估计对象，不是对同一因果故事的赞成票数。</h2>
      <p>一个重要阅读练习是替换单一道门：将一周期续借换为长期正常付款，会改变多少债务及时受到价格约束；将深口袋贷款人换为补股受限者，会新增资本反馈；加入租住与新建，会改变融资需求落在价格还是数量。这些反事实比记住模型结论更能建立可迁移理解，但替换后仍需用本地制度和数据检验。</p>
      <p>对照表中的付款收入比（payment-to-income，PTI）用指定期间的按揭付款除以同期间收入，检查付款负担；它不同于贷款价值比LTV检查的担保比例。本课C2直接登记扣除其他用途后的付款预算，不声称采用现实统一PTI上限。工具变量（instrumental variable，IV）则用于研究识别：它必须有可辩护的相关性与排除限制，不能只因为变量与房价一起动就称为有效工具。</p>
      <div className={styles.markerTable}><table><caption>只列实际核读范围内的机制；GM限定November2019作者稿，MRS限定June2013作者稿</caption><thead><tr><th>研究</th><th>债务与市场门</th><th>回答的问题</th><th>本课不借用的结论</th></tr></thead><tbody><tr><th>Iacoviello2005 <Cites ids={[1]}/></th><td>一周期名义借款、预期担保、固定总住房</td><td>指定商业周期冲击如何条件性放大</td><td>普通长期FRM即时市值追缴</td></tr><tr><th>KMV2020 <Cites ids={[2]}/></th><td>长期实质固定按揭、新发LTV/PTI、租住与建设、深口袋中介</td><td>异质家庭下boom–bust结构反事实</td><td>信念校准份额是独立观察历史因果、模型HELOC排序是法律</td></tr><tr><th>MRS2013作者稿 <Cites ids={[3]}/></th><td>县级支付卡／ZIP汽车；地理暴露IV并允许收入反馈</td><td>特定美国周期的地方总响应和异质性</td><td>每个居民纯抵押MPC、所有信用菜单系数显著</td></tr><tr><th>GM作者稿 <Cites ids={[4]}/></th><td>双触发、固定存量、搜寻、购房排除与受限中介资本</td><td>市场级止赎反馈和条件政策反事实</td><td>普适违约阈值、回归识别的全国乘数或无条件福利排名</td></tr></tbody></table></div>
    </section>
    <section className="lesson-section" id="interactive-lab"><p className="section-kicker">INTERACTIVE M1–M10</p><h2>用十道闭合题检验是否真正分开存量、流量、条件与事件。</h2><HousingQuiz /></section>
    <section className="lesson-section" id="housing-static-twins"><p className="section-kicker">STATIC K1–K10 · SAME FROZEN RECORDS</p><h2>无JavaScript与纸上学习不缺题设、答案或错路径诊断。</h2><p>K题使用和M题相同记录、同一正确路径与两个算得出的错误路径。纸上先遮答案独立计算；浏览器原生展开可读，打印版完整保留答案。固定基准不会被交互改写。</p><HousingStaticQuiz /></section>
    <section className="lesson-section" id="checks-glossary"><p className="section-kicker">CHECKS / AUDIT / GLOSSARY</p><h2>能指出某个结论不能推出什么，比只背“房价—信用正反馈”更重要。</h2>
      <div className="check-grid" aria-label="3.16二十道理解检查" role="group">{checks.map((check,i)=><div key={check.question}><details><summary>{String(i+1).padStart(2,'0')} · {check.question}</summary><p>{check.answer} <Cites ids={check.ids}/></p></details><p className="print-only"><b>{String(i+1).padStart(2,'0')} · 答案：</b>{check.answer} <Cites ids={check.ids}/></p></div>)}</div>
      <div className="yield-fixture-audit" aria-label="3.16计算与来源审计" role="group"><span>纯计算、错路径、来源与canonical检查（不是独立审稿批准）</span><ul>{[...housingFixtureAudit,...housingScenarioAudit,...housingPriceDataAudit,...canonicalHousingCollateralStateAudit,...lesson316IntegrityAudit].map((item)=><li className={item.passed?'passed':''} key={item.key}>{item.passed?'PASS':'FAIL'} · {item.key}</li>)}</ul></div>
      <div className="term-grid" aria-label="3.16术语与误区" role="group">{glossary.map(([term,meaning,confusion])=><article className="term-card" key={term}><h3>{term}</h3><p>{meaning}。</p><em>不可混同：{confusion}。</em></article>)}</div>
    </section>
    <section className="lesson-section" id="evidence-boundaries"><p className="section-kicker">STATE / CASES / PROVENANCE / INTERFACES</p><h2>最终交付的是分门、可失败的住房状态，而不是由一条价格曲线猜出的危机标签。</h2>
      <p>下述状态对象是合成场景登记册，不是一名家庭的连续历史。scopePassport逐一登记C1–C7对象；C1–C6各为独立的单户／单房实验，C7是100户分布。即使金额单位和登记时点相同，也不能跨场景拼接市值、已售房、现金或债务。</p>
      <div className="precision-note"><span>canonical · {state.schemaVersion}</span><p><code>{canonicalHousingCollateralStateFields.join(', ')}</code>。3.15是唯一直接上游上下文，九条路径按对象身份核对，等值克隆不通过。当前家庭为合成SYN域，七个实验是不同场景，不把C1估值和C6已售房拼成同一个真实家庭历史。官方当前房价快照单独保存；prediction仍未估计、causal仍未识别、phase不分类，未知中介和当地市场不填0。</p></div>
      <h3>案例、反例与证据身份</h3><div className="case-grid"><article className="case-card"><span>OBSERVED · PRICE CONTEXT</span><h4>美国名义价格回峰不等于合同复原</h4><p>指定回溯窗口的2007Q1峰222.84、2011Q2谷175.49和2016Q2首次旧峰跨越223.11来自保留的FHFA快照。它没有逐户债务、就业与信用菜单，因此不证明2016年所有家庭权益、现金或融资已恢复。 <Cites ids={[12,13]}/></p></article><article className="case-card"><span>EMPIRICAL · GEOGRAPHIC RESPONSE</span><h4>地方支出与借款菜单同时研究，仍要查显著性</h4><p>MRS比较2006–09住房暴露和当地支出，允许当地收入反馈；ZIP汽车异质性不等于所有消费，高住房杠杆信用卡限额交互及HELOC IV也不是全部显著。阅读表格对象比照抄标题更重要。 <Cites ids={[3]}/></p></article><article className="case-card"><span>SYNTHETIC · DIRECT COUNTEREXAMPLE</span><h4>负权益而正常付款</h4><p>C5房价70、债80、月收入2、必要支出1、月P&I0.6，权益−10但月余额+0.4。普通旧贷无教学补仓，不能由负权益推导当天违约。不是某个真实贷款人的观察案例。 <Cites ids={[2,5,7]}/></p></article><article className="case-card"><span>MODEL-CONDITIONAL · AUTHOR VERSION</span><h4>更多急售房与更少合格买家</h4><p>GM作者稿将双触发、购房排除和资本受限接成市场级反馈。换掉资本或收入恢复条件，政策结果可能变化；本课未复现，不引用未对齐版本的反事实份额。 <Cites ids={[4]}/></p></article></div>
      <h3>生产者不变量</h3><ol className="contract-list">{invariants.map((rule,i)=><li key={rule}><b>{String(i+1).padStart(2,'0')}</b><span>{rule}</span></li>)}</ol>
      <h3>动态来源刷新，保留旧证据而不覆盖</h3><p>若FHFA端点更新，另存新命名的原始文件和响应头、计算哈希，核对同一family、USA、SA列、季度和基期，再逐项比较共同季度修订；展示截止仍为2019Q4，除非明确另修。每次从原值重算同样峰谷窗口，不将活端点链接冒充内容寻址档案。要做historical PIT，另需当年发布版本与收取证据。公开指数归属允许按官方说明使用，不代表机密逐笔数据或论文全文可以作为网站资源再分发。 <Cites ids={[12,13,14]}/></p>
      <h3>来源阅读透明度</h3><div className="evidence-map" aria-label="3.16十九项来源支持地图" role="group"><div><h4>实际核心理论与地理证据</h4><p>Iacoviello与KMV核读作者托管期刊final的相关章节；MRS核读作者最终手稿web，原PDF未留存；GM核读November2019作者稿，未声明出版排版全文等价。来源末尾记录实际版本，不声称已复制任何模型或专有交易。 <Cites ids={[1,2,3,4]}/></p></div><div><h4>合同、事件与历史追索</h4><p>历史工作论文只支持样本和定义范围；CFPB当前条款限定美国产品。把合同门和事件门连起来，不引用历史法律表作为当代建议。 <Cites ids={[5,6,7,8,9,10]}/></p></div><div><h4>供给与真实数据</h4><p>供给综述核读期刊3–8页；FHFA公开指数已保留原字节与116选定原值。没有观测建设或按揭个人数据，图形不识别反馈。 <Cites ids={[11,12,13,14]}/></p></div><div><h4>下一步候选阅读，不提升为已核验量化结论</h4><p>Saiz原文、微观合同／付款／政策三篇和锁定论文尚待独立全文核读；本课只核查身份或摘要／官方说明，不导入估计。它们作为reading list而非本课计算器参数。 <Cites ids={[15,16,17,18,19]}/></p></div></div>
      <h3>跨章接口</h3><div className="interface-grid" aria-label="3.16八项跨章接口" role="group">{interfaces.map(([name,payload,guardrail])=><article key={name}><span>{name}</span><p><b>传递什么：</b>{payload}。</p><p><b>不可跨越的边界：</b>{guardrail}。</p></article>)}</div>
      <p>第一次学完请用自己的话解释一个陌生房市：价格先改变哪类家庭，哪道合同门先绑定，资金是否真的到账，用途是什么，本地供给和交易如何吸收，收入与贷款人是否再反馈。然后将其中一个箭头缩小为可观察、有对照、有信息时钟且可证伪的问题。这个能力才是本节的目标，而不是给所有国家复制同一张房地产危机图。</p>
    </section>
  </>;
}

export const lesson316: LessonRecord = {
  slug:'3-16',id:'3.16',chapter:'03',chapterTitle:'Macro State & Financial Conditions',
  title:'Housing–Collateral Feedback：住房价值、合同门槛与本地金融反馈',
  subtitle:'将居住服务、净权益、边际融资与继承付款分开，解释新买家首付、净值提取、固定与可调利率按揭、房屋净值信贷额度、负权益、处置回收和异质家庭如何经本地供给与交易形成有条件反馈',
  readingTime:`正文核心路径约50–70分钟；${optionalCount}个optional deep dive约15–25分钟。C1–C7手算与交互约45–65分钟；M/K十题首轮约25–40分钟，检查／术语／模型对照与复盘约30–50分钟。均为学习估时而非强制时长；论文延伸阅读另计`,
  prerequisite:'Master：3.15 Debt / Leverage Cycle；背景3.11 Borrower Collateral与3.14 Credit Cycle；按需T02、T05、T06、T08',
  updatedAt:'2026-09-15',revision:'3.16-r1',reviewStatus:'double-reviewed',reviews:[
    {kind:'accuracy',completedAt:'2026-09-15',decision:'approved',revision:'3.16-r1',summary:'同版核对合同、计算、来源与跨章身份映射；未知行为、因果与法律损失边界保留。'},
    {kind:'pedagogy',completedAt:'2026-09-15',decision:'approved',revision:'3.16-r1',summary:'同版核对因果顺序、反例、无脚本／移动阅读及63页校样；模型表与实验成组问题已修复。'},
  ],
  previous:{slug:'3-15',label:'3.15 Debt / Leverage Cycle'},next:{label:'3.17 Fiscal Policy'},
  sections:[{id:'thesis',label:'核心命题'},{id:'official-data',label:'阅读路线与真实价格'},...housingConcepts.map(({id,label})=>({id,label})),{id:'model-comparison',label:'模型与估计对象对照'},{id:'interactive-lab',label:'Interactive M1–M10'},{id:'housing-static-twins',label:'Static K1–K10'},{id:'checks-glossary',label:'Checks / Audit / Glossary'},{id:'evidence-boundaries',label:'State / Cases / Interfaces'}],
  Content:Lesson316Content,references:lesson316References,readingList:lesson316ReadingList,readingListOrder:'source',
};
