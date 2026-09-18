import {flowTwoLegs,flowBankBorrowing,flowCreditCeiling,flowSecuritySettlement,flowCentralBankOperations,flowForeignPayment,flowFundCashMenu} from './capitalFlowFixtures';
import {flowCanonicalInputs,flowLabs,flowDisplayValue} from './capitalFlowLabDefinitions';
import type {FlowLabId} from './capitalFlowLabDefinitions';
export type FlowScenario={id:string;labId:FlowLabId;title:string;question:string;inputs:Readonly<Record<string,number>>;unit:string;correct:number;reason:string;wrong:readonly{value:number;diagnosis:string}[];scope:string;sourceIds:readonly number[]};
const c=flowCanonicalInputs;
const m5Inputs={...c.c3,existingRWA:100} as const;
function authored(s:Omit<FlowScenario,'scope'|'sourceIds'>):FlowScenario{const l=flowLabs.find(l=>l.id===s.labId);if(!l)throw Error('Unknown flow passport '+s.labId);return {...s,scope:l.assumption,sourceIds:l.sourceIds};}
// Independent authored expressions: never take a fixture-produced value as the expected answer.
export const flowScenarios:readonly FlowScenario[]=[
 authored({id:'M1',labId:'C1',title:'净向内融资要先锁正号方向',inputs:c.c1,question:'求本情景按本课N=L−A定义的净向内融资；不是问FA或腿规模，也不要求重建整个国家账。',unit:'本币（N净向内融资）',correct:c.c1.liabilitiesNetIncurrence-c.c1.assetsNetAcquisition,
  reason:'N按负债净发生减资产净获得：90−80=10。FA按反方向80−90=−10；替代情景0/10也N10，但无法因此说融资依赖相同。|80|+|90|=170只叫教学腿规模，不能叫未净交易gross、现金到期额或净向内融资。',
  wrong:[{value:c.c1.assetsNetAcquisition-c.c1.liabilitiesNetIncurrence,diagnosis:'−10计算的是FA=A−L，把手册金融账户方向复制给本课另定义的N。题目没有改统计标准，而是明确用相反方向讲净向内；先写N=L−A，不能只凭“流入正”猜符号。'},{value:Math.abs(c.c1.assetsNetAcquisition)+Math.abs(c.c1.liabilitiesNetIncurrence),diagnosis:'170把两条已净交易腿的绝对规模相加。它不是净融资，且每条腿内部仍可能有买卖相抵，连官方未净gross也无法恢复；教学规模不能替净额或完整融资网络。'}]}),
 authored({id:'M2',labId:'C2',title:'新增借款不自动增加权益',inputs:c.c2,question:'仅完成借外币并取得等额非居民银行存款资产，不再兑换/贷款。操作后权益是多少本币？',unit:'本币（操作后权益）',correct:c.c2.equity,
  reason:'借10外币按S2每侧增20：资产100→120、负债90→110，差仍10。新的可用外币资产伴随偿还义务，不是免费的资本金；本币准备金、存款、贷款没有被这一步自动增加。期限/信用是否匹配依然未知。',
  wrong:[{value:c.c2.equity+c.c2.newBorrowingForeign*c.c2.spotCents/100,diagnosis:'30把收到20本币等值外币资产全加入原权益10，忘掉同时增加的20借款负债。融资取得是两侧扩张；若只记收入不记义务，起始正确账也会被改成错误资本金。'},{value:c.c2.initialLoans+c.c2.initialHomeReserves+c.c2.newBorrowingForeign*c.c2.spotCents/100,diagnosis:'120正确得出操作后总资产，却把资产水平叫权益。权益须从资产减负债110才是10，不能拿总资产替资本缓冲、可支配现金或法律偿付能力。'}]}),
 authored({id:'M3',labId:'C2',title:'杠杆的分母仍是原权益',inputs:c.c2,question:'同一隔离借款操作后，总资产/权益是多少倍？不是风险加权资本比率。',unit:'倍（总资产/权益）',correct:(c.c2.initialLoans+c.c2.initialHomeReserves+c.c2.newBorrowingForeign*c.c2.spotCents/100)/c.c2.equity,
  reason:'操作后资产120，权益10未增，总资产/权益12倍；原来100/10为10倍。外币本金资产与负债相抵不等于总资产分子不扩张，更不保证到期安全。这个简单杠杆不替C3风险加权资本比率。',
  wrong:[{value:(c.c2.initialLoans+c.c2.initialHomeReserves+c.c2.newBorrowingForeign*c.c2.spotCents/100)/(c.c2.equity+c.c2.newBorrowingForeign*c.c2.spotCents/100),diagnosis:'4倍用120除虚增权益30，把借款收入当资本金。资产与债务同步增加，真正权益仍10，不能用错误分母把更高杠杆伪装成更低。'},{value:(c.c2.initialLoans+c.c2.initialHomeReserves)/c.c2.equity,diagnosis:'10倍保留旧总资产100，因外币净本金0就忽略新增外币存款资产20。净外币暴露与总资产杠杆是不同量，本题须使用操作后资产120。'}]}),
 authored({id:'M4',labId:'C3',title:'取共同可行上限，不取最宽松的门',inputs:c.c3,question:'按给定融资、资本与合格需求三门，菜单可行新增贷款上限是多少？不是实际审批量。',unit:'本币（菜单上限）',correct:Math.min(c.c3.fundingRoom,Math.max(0,(c.c3.equity/(c.c3.capitalFloorBps/10000)-c.c3.existingRWA)/(c.c3.newLoanRiskWeightBps/10000)),c.c3.demand),
  reason:'E/k=10/.1=100，扣已有RWA80、再除新权重1，资本门20；融资门20、需求门30，取min得20，资本/融资并列。菜单不是实际批准量，也没假定银行愿意贷满或所有监管都相同。',
  wrong:[{value:c.c3.demand,diagnosis:'30只取合格需求门，忽略银行资本门与融资门各20。有人想借或题设需求合格不能生成可行资金和资本，上限须同时满足三门；更不能因此认证真实需求或批准量。'},{value:c.c3.equity/(c.c3.capitalFloorBps/10000),diagnosis:'100只算E/k可支持的总风险规模，未扣已使用的RWA80，也未与融资和需求取共同最小。总支持规模不是可新增贷款，更不是把权益倍增为现金。'}]}),
 authored({id:'M5',labId:'C3',title:'整数资本差恰为零时不能继承原余量',inputs:m5Inputs,question:'本题只把C3已有RWA改100，其余输入仍列明。新的教学资本门余量是多少？不是问资金门或原默认上限。',unit:'本币（新资本门余量）',correct:Math.max(0,(m5Inputs.equity/(m5Inputs.capitalFloorBps/10000)-m5Inputs.existingRWA)/(m5Inputs.newLoanRiskWeightBps/10000)),
  reason:'教学资本差10×10000−100×1000恰0；E/k=100扣已有100后无新增余量，资本门0。融资20和需求30不能跨过这道零门，实际批准依然未知，不认证银行全部法律经营状态。此题是改RWA后的独立条件，不是C3与别题连续运行。',
  wrong:[{value:m5Inputs.fundingRoom,diagnosis:'20继承融资余量或原默认资本余量，却漏读已有RWA已经从80改100。钱的菜单没变不能补资本差，须用当前完整输入而不是旧结果。'},{value:m5Inputs.equity,diagnosis:'10把权益余额直接当新增贷款余量。资本门用E/k减已有风险规模，再除新权重；权益不是不受约束的现金贷款池，已有RWA100已经耗完题设空间。'}]}),
 authored({id:'M6',labId:'C4',title:'发行人只收到一级购买现金',inputs:c.c4,question:'非居民已在岸存款按题设比例购买新/旧证券。发行人本窗口收到多少本币现金？不是旧卖方或总证券交易额。',unit:'本币（发行人现金）',correct:c.c4.totalHomePayment*c.c4.primaryPct/100,
  reason:'默认100×40%=40给居民发行人，按价5增8新单位；其余60给居民旧卖方，转12旧单位。同一付款人、不同收款人，旧转手不把发行人现金增成100；真实后续投资未给。',
  wrong:[{value:c.c4.totalHomePayment,diagnosis:'100把全部新/旧证券购买支付都算为发行人融资，漏掉60先交给居民旧卖方。新增非居民证券负债交易100包含旧转手，不等于新发行现金100。'},{value:c.c4.totalHomePayment*(100-c.c4.primaryPct)/100,diagnosis:'60正确算出二级转手现金，但收款人是居民旧卖方，非发行人。本题问一级融资收款对象，不能以都属于居民总量就把两个账本互代。'}]}),
 authored({id:'M7',labId:'C4',title:'证券外部交易腿不同于新发行现金',inputs:c.c4,question:'在已在岸本币存款支付窗口，非居民增持居民证券形成的外部负债交易腿是多少？包含新/旧证券，不是净流入或新发行现金。',unit:'本币（证券外部负债交易腿）',correct:c.c4.totalHomePayment,
  reason:'非居民用100购买居民新证券40和居民持有旧证券60，证券对非居民负债交易+100；同时它对居民银行存款索赔减少100，对应外部存款负债交易−100。两腿合计0，不能把证券腿100改叫新净流入或发行人新融资100。',
  wrong:[{value:c.c4.totalHomePayment*c.c4.primaryPct/100,diagnosis:'40只保留新发行腿，漏掉旧证券从居民卖方转给非居民买方的60。旧转手不增加发行现金，却会改变外部持有人记录；发行量和居民—非居民交易量是不同对象。'},{value:c.c4.totalHomePayment-c.c4.totalHomePayment,diagnosis:'0是证券+100与外部存款−100的合计，不是题目问的证券单腿。净合计相抵不能取消每腿记录；也不能把已有存款支付当本窗口又新增境外现金。'}]}),
 authored({id:'M8',labId:'C5',title:'第一笔投放不能代表两笔净基础变化',inputs:c.c5,question:'按本实验明确先购汇再卖既有国内债权，两笔之后净基础货币变化是多少？不是M2、信贷反应或冲销成本。',unit:'本币（净基础变化）',correct:c.c5.purchasedForeign*c.c5.spotCents/100-c.c5.absorbedHome,
  reason:'购5外币按S2投10银行准备金，基础90→100；另售国内债权10扣准备金，基础回90，净0。资产组合外币30/国内70已改变，净基础0不让真实信用、市场利率或成本自动为0。',
  wrong:[{value:c.c5.purchasedForeign*c.c5.spotCents/100,diagnosis:'+10只算第一笔购汇投放，未扣题目明确的第二笔吸收10。中间基础变化不等于两笔最终净变化；不能把被明确记录的后续操作漏掉。'},{value:-c.c5.absorbedHome,diagnosis:'−10只算第二笔卖资产吸收，忘记先购汇新增10准备金。两笔按同S、同初始账计入净变化，不能把最终账与单笔变化互代。'}]}),
 authored({id:'M9',labId:'C6',title:'折本币缺口不是外币缺口',inputs:c.c6,question:'两项已确认外币不重叠，按题设本币兑换菜单操作后仍缺多少外币？不是折本币缺口或兑换前需要额。',unit:'外币（菜单付款缺口）',correct:c.c6.foreignDue-c.c6.foreignLiquid-c.c6.confirmedForeignReceipts-c.c6.homeCash*c.c6.convertibleHomePct/c.c6.spotCents,
  reason:'确认外币4+3=7，需3；本币5按S2可买2.5，余缺0.5外币，折本币1。4不已经包含单列收款3；如果已包含，必须改输入口径而不是双算。菜单不足不认证真实法律违约或完整偿付能力。',
  wrong:[{value:c.c6.foreignDue-c.c6.foreignLiquid-c.c6.confirmedForeignReceipts,diagnosis:'3只算兑换前仍需外币，漏掉本题明确允许的本币5按S2买2.5。未承诺兑换不能自动加，但题设已允许菜单时也不能无故删除该资源。'},{value:(c.c6.foreignDue-c.c6.foreignLiquid-c.c6.confirmedForeignReceipts)*c.c6.spotCents/100-c.c6.homeCash*c.c6.convertibleHomePct/100,diagnosis:'1是0.5外币缺口按S2折成本币，不是所求外币单位。账上价值换算与付款币种必须区分，不能看数值更大就当同一缺口或违约程度。'}]}),
 authored({id:'M10',labId:'C7',title:'可得现金不等于需求或全库存估值',inputs:c.c7,question:'按给定价/容量的出售菜单，起始现金加可售所得合计多少本币？未自动扣请求，非已付赎回或完成NAV。',unit:'本币（菜单可得现金）',correct:c.c7.cash+Math.min((c.c7.requestedCash-c.c7.cash)*100/c.c7.executionPricePct,c.c7.assetFace,c.c7.buyCapacityFace)*c.c7.executionPricePct/100,
  reason:'需25现金，给定0.9价理论卖约27.7778单位，却受容量20限制；售20得18，加起始现金5为23，仍缺7。剩80面值不是可得现金，全库存按价95也不是本窗口能卖出的现金；实际成交、付款/NAV未知。',
  wrong:[{value:c.c7.requestedCash,diagnosis:'30将请求额当已经可以取得或已经支付的现金，忽略给定买方容量只能承接20。菜单只有23；请求没有自动获满足，更没有据此完成赎回后的NAV。'},{value:c.c7.assetFace*c.c7.executionPricePct/100+c.c7.cash,diagnosis:'95是动用前全部库存按给定价90加现金5的估值，假定全100单位都可按该价变现，漏掉容量20和现金需求。账面估值不能替可售所得或同窗口支付资源。'}]}),
];
const orders:Readonly<Record<string,readonly number[]>>={M1:[0,1,2],M2:[1,2,0],M3:[1,0,2],M4:[1,0,2],M5:[0,1,2],M6:[1,2,0],M7:[1,2,0],M8:[1,0,2],M9:[0,1,2],M10:[1,0,2]};
export function flowOptions(s:FlowScenario){const order=orders[s.id];if(!order)throw Error('Unknown option identity '+s.id);const all=[{value:s.correct,diagnosis:s.reason,correct:true},...s.wrong.map(w=>({...w,correct:false}))];return order.map((index,position)=>({...all[index],id:`${s.id}-choice-${position+1}`}));}
export function flowScenarioInputText(s:FlowScenario){const lab=flowLabs.find(l=>l.id===s.labId);if(!lab)throw Error('Unknown input passport');return lab.fields.map(f=>`${f.label}＝${flowDisplayValue(s.inputs[f.key])}`).join('；');}
const answers=[flowTwoLegs(c.c1),flowBankBorrowing(c.c2),flowBankBorrowing(c.c2),flowCreditCeiling(c.c3),flowCreditCeiling(m5Inputs),flowSecuritySettlement(c.c4),flowSecuritySettlement(c.c4),flowCentralBankOperations(c.c5),flowForeignPayment(c.c6),flowFundCashMenu(c.c7)];
const expected=answers.map((r,i)=>{if(r.status==='STOP')throw Error('Invalid question contract');const v=r.value;const key=['inwardNetFinancing','finalEquity','finalLeverage','feasibleCeiling','capitalHeadroom','primaryCash','newSecurityExternalLiabilityTransaction','netBaseChange','foreignGap','attainableCash'][i];return (v as unknown as Record<string,unknown>)[key];});
export const flowScenarioAudit=[
 {key:'ten shared M/K questions, thirty finite distinct neutral choices and twenty explanatory wrong paths',passed:flowScenarios.length===10&&flowScenarios.every(s=>s.wrong.length===2&&new Set(flowOptions(s).map(o=>o.value)).size===3&&flowOptions(s).every(o=>Number.isFinite(o.value)&&o.diagnosis.length>=50))},
 {key:'independently authored answer expressions agree with same-C pure contracts',passed:flowScenarios.every((s,i)=>s.correct===expected[i])},
 {key:'full Chinese input sets, original same-C scopes and source identity survive each question',passed:flowScenarios.every(s=>{const l=flowLabs.find(l=>l.id===s.labId);return !!l&&s.scope===l.assumption&&s.sourceIds===l.sourceIds&&Object.keys(s.inputs).sort().join('|')===l.fields.map(f=>f.key).sort().join('|')&&l.display(s.inputs).status==='OK';})},
 {key:'actual mixed ABC correct sequence A/C/B/B/A/C/C/B/A/B; counts3/4/3',passed:flowScenarios.map(s=>'ABC'[flowOptions(s).findIndex(o=>o.correct)]).join('/')==='A/C/B/B/A/C/C/B/A/B'},
 {key:'M5 only changes RWA to100 and explicitly retains independent condition; no fake completed NAV',passed:flowScenarios[4].inputs===m5Inputs&&flowScenarios[4].question.includes('已有RWA改100')&&flowScenarios[9].question.includes('非已付赎回或完成NAV')},
] as const;
