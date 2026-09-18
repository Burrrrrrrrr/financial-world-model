import {surpriseCanonicalInputs,surpriseRawDomains,surpriseEvaluators,surpriseExactToNumber} from './surpriseFixtures';
import type {SurpriseLabId,SurpriseDomain,SurpriseResult,ExactQuantity} from './surpriseFixtures';
export type SurpriseLab = Readonly<{
 id:SurpriseLabId; title:string; question:string; passport:string; sourceIds:readonly number[];
 initial:Readonly<Record<string,number>>;
 fields:readonly Readonly<{key:string;label:string;min:number;max:number;step:1}>[];
 display:(input:unknown)=>SurpriseDisplay;
}>;
export type SurpriseDisplay=Readonly<{status:'STOP';reason:string}>|Readonly<{status:'OK';rows:readonly (readonly [string,string])[]}>;
export function surpriseNumber(value:number):string{
 if(!Number.isFinite(value))throw Error('Display requires a finite number');
 return (value===0?'0':String(Number(value.toPrecision(12)))).replace('-','−');
}
function greatestCommonDivisor(a:bigint,b:bigint):bigint{const zero=BigInt(0);let x=a<zero?-a:a,y=b;while(y!==zero){const r=x%y;x=y;y=r;}return x;}
function exactDisplay(q:ExactQuantity):string{
 const n=BigInt(q.numerator)*BigInt(q.scale),d=BigInt(q.denominator),g=greatestCommonDivisor(n,d);
 const nn=n/g,dd=d/g,text=nn.toString().replace('-','−');
 return dd===BigInt(1)?text:text+'/'+dd.toString()+' ≈ '+surpriseNumber(surpriseExactToNumber(q));
}
function valueText(r:Extract<SurpriseResult,{status:'OK'}>,key:string):string{
 const value=r.value[key];if(value===null)return '未知／未识别（不是0）';
 if(r.exact[key])return exactDisplay(r.exact[key]);
 if(typeof value==='number')return surpriseNumber(value);
 if(typeof value==='boolean')return value?'是（仅限已给条件）':'否（仅限已给条件）';
 if(value==='old')return '旧代理';if(value==='new')return '新代理';if(value==='unavailable')return '尚无公开可用代理';
 if(typeof value==='string')return value;
 throw Error('Result key has no declared display: '+key);
}
const labels:Record<SurpriseLabId,Readonly<Record<string,string>>>= {
 C1:{actual:'事后宣布的本期增长（同口径基点）',previous:'上期增长比较值（不是本期预测；基点）',consensus:'指定事前共识代理（非瞬时全市场；基点）',alternateConsensus:'另给事前替代代理（独立对照；基点）'},
 C2:{forecast1:'调查回答一（独立SYN增长基点）',forecast2:'调查回答二（同口径增长基点）',forecast3:'调查回答三（同口径增长基点）',forecast4:'调查回答四（同口径增长基点）',forecast5:'调查回答五（同口径增长基点）',disclosedActual:'教材事后披露的宣布增长（基点）'},
 C3:{oldProxy:'较早公开的同对象预期代理（增长基点）',newProxy:'较晚公开的同对象预期代理（增长基点）',disclosedActual:'公告后教材披露的实际增长（基点）',oldRelease:'旧代理公开合成序号（非真实日期）',newRelease:'新代理公开合成序号（须严格晚于旧）',cutoff:'公告前冻结合成序号（含当序号可得）',announcement:'实际值公布合成序号（须晚于新代理）'},
 C4:{currentAnnounced:'本期当次宣布增长（同口径基点）',currentForecast:'匹配本期当次版本的预期代理（基点）',previousFirst:'上期原先公布的增长（不是本期；基点）',previousRevised:'同一上期本次修订增长（基点）'},
 C5:{disclosedActual:'公告后教材披露的宣布增长（基点）',frozenProxy:'题设另给事前冻结的增长代理（基点）',suppliedScale:'另给同种预测误差尺度（基点；可为0）',trainingCutoff:'尺度训练截止合成序号（非真实数据钟）',modelChoice:'代理／尺度模型选定合成序号',cutoff:'公告前信息冻结合成序号（含端点）',announcement:'实际值公布合成序号（须严格晚于截止）'},
 C6:{cashflowBefore:'消息前另给同一期权益现金流（SYN金额）',cashflowAfter:'消息后另给同一期权益现金流（可为0）',totalRateBefore:'消息前同一期总所需回报（基点）',totalRateAfter:'消息后同一期总所需回报（非GDP增长；基点）'},
 C7:{oldTarget:'公告前当前政策目标水平（SYN基点）',announcedTarget:'公告后政策目标水平（同口径基点）',frozenTargetProxy:'事前调查式目标水平代理（SYN基点）',frozenPathProxy:'另给事前同期限未来路径代理（基点）',announcedInformationPath:'公告信息下同期限未来路径代理（基点）'},
};
const rowKeys:Record<SurpriseLabId,readonly (readonly [string,string])[]>={
 C1:[['宣布增长水平（%）','actualGrowthPercent'],['相对上期改善（基点）','improvementFromPreviousBp'],['相对指定共识差（基点）','relativeToConsensusBp'],['相对替代代理差（基点）','relativeToAlternateConsensusBp'],['真实价格反应','actualPriceReaction'],['真实经济福利','economicWelfare'],['瞬时全市场条件预期','instantaneousMarketExpectation']],
 C2:[['给定调查回答数量','surveySize'],['调查中位数（基点）','surveyMedianBp'],['调查算术均值（基点）','surveyMeanBp'],['事后宣布减中位（基点）','retrospectiveActualMinusMedianBp'],['事后宣布减均值（基点）','retrospectiveActualMinusMeanBp'],['真实净订单','actualNetOrder'],['价格聚合权重','priceAggregationWeights'],['瞬时全市场条件预期','instantaneousMarketExpectation']],
 C3:[['截止可用代理类别','availableProxyKind'],['截止可用冻结代理（基点）','asOfFrozenProxyBp'],['截止实际宣布值（基点）','asOfActualBp'],['截止意外差（基点）','asOfSurpriseBp'],['截止标准化意外','asOfStandardizedSurprise'],['公告后相对合格冻结代理差（基点）','retrospectiveDifferenceUsingEligibleFrozenProxyBp'],['真实历史公开钟','actualHistoricalRelease'],['真实预测形成钟','expectationFormation'],['真实收到钟','actualReception'],['真实历史PIT认证','historicalPitCertification']],
 C4:[['本期匹配差（基点）','currentMatchedDifferenceBp'],['同一上期修订差（基点）','previousReferencePeriodRevisionBp'],['另定义算术和（非本期headline差；基点）','separatelyDefinedSumBp'],['真实完整消息包','actualCompleteNewsPackage'],['消息组合权重','newsCombinationWeights'],['唯一价格冲击','uniquePriceShock'],['真实价格效应','actualPriceEffect']],
 C5:[['代理已事前冻结的题设声明','stipulatedProxyAlreadyFrozenBeforeCut'],['选型在合成截止前合格','modelEligibleBeforeCut'],['训练与选型在合成截止前合格','scaleEligibleBeforeCut'],['截止合格选定代理（基点）','asOfEligibleProxyBp'],['截止合格已给尺度（基点）','asOfEligibleScaleBp'],['截止实际宣布值（基点）','asOfActualBp'],['截止原始意外差（基点）','asOfRawSurpriseBp'],['截止标准化意外','asOfStandardizedSurprise'],['公告后相对题设冻结代理差（基点）','retrospectiveDifferenceUsingStipulatedFrozenProxyBp'],['事后披露尺度的纯除法（未必合格）','retrospectiveSuppliedScaleCalculation'],['公告后使用合格事前冻结正尺度的标准化','retrospectiveStandardizedUsingEligibleFrozenScale'],['真实尺度校准','actualScaleCalibration'],['真实预测形成钟','actualExpectationFormation'],['真实收到钟','actualReception'],['真实历史PIT认证','historicalPitCertification'],['ABDV原研究复制','abdvReplication']],
 C6:[['消息前分母整数刻度（10000+r；实际因子再除10000）','grossDenominatorBefore'],['消息后分母整数刻度（10000+r；实际因子再除10000）','grossDenominatorAfter'],['消息前条件模型价格（SYN金额）','modelPriceBefore'],['消息后条件模型价格（SYN金额）','modelPriceAfter'],['联合条件模型回报（%）','jointModelReturnPercent'],['只改现金流的另假设回报（%）','cashflowOnlyCounterfactualReturnPercent'],['只改所需回报的另假设回报（%）','rateOnlyCounterfactualReturnPercent'],['两单改之和到联合的交互余项（%）','exactAdditivityRemainderPercent'],['真实股票价格','observedStockPrice'],['GDP到权益现金流映射','gdpToEquityCashflowMapping'],['真实无风险回报分量','riskFreeComponent'],['真实风险补偿分量','riskCompensationComponent'],['真实经济状态','actualEconomicPhase'],['真实因果价格效应','causalPriceEffect']],
 C7:[['实际目标变化（基点）','actualTargetChangeBp'],['事后目标相对冻结调查式代理差（基点）','retrospectiveTargetRelativeToFrozenSurveyProxyBp'],['事后同期限路径相对冻结代理差（基点）','retrospectivePathRelativeToFrozenSurveyProxyBp'],['本例独立调查式SYN身份','surveyStyleIndependentSyn'],['原GSS期货测度','originalGssFuturesMeasureBp'],['原GSS月均结算缩放','originalGssScaledSettlement'],['原GSS旋转因子','originalGssRotatedFactors'],['真实证券价格','actualPrice'],['真实长端利率反应','actualLongRateResponse'],['外生政策冲击','externalPolicyShock'],['真实结构归因','structuralAttribution']],
};
const texts:Record<SurpriseLabId,Readonly<{title:string;question:string;passport:string;sourceIds:readonly number[]}>>={
 C1:{title:'增长改善与相对代理意外分列',question:'同一宣布值相对上期、指定共识与替代代理分别是什么？',passport:'独立SYN，本期实际与两份代理匹配同一参考期；上期比较值只保持增长口径一致，参考期不同。普通增长以基点表示，正基数且非负活动使下界−100%；100bp=1个百分点。版本和代理已由题设匹配，不是取得真实公告或证明调查等于市场条件期望；价格与福利未知。',sourceIds:[1,2,9]},
 C2:{title:'五份回答不合成一个市场大脑',question:'按当前五份回答求平均、中位及各人事后差；若相对中位差为零，是否就能消去分歧？',passport:'独立SYN五份同对象增长预测，均值与中位非同义；宣布值为教材事后披露，不是事前已知。回答数量不产生资本、订单或价格权重，未取真实panel或历史汇总vintage。',sourceIds:[2,4]},
 C3:{title:'事前可用的是代理，不是后来意外',question:'按当前公开与截止序号选代理，何者截止可得；公告后才可作哪种差？',passport:'独立SYN含端点公开序号，旧<新<公告且cut<公告。教材披露实际不能越过cut；截止actual/差/标准化均未知。事后差只使用合格已冻结代理，未取得真实日历、形成/收到日志或PIT资料。',sourceIds:[4,5,7]},
 C4:{title:'本期消息与同一上期修订不互换',question:'当前本期匹配差与上期版本修订各是多少，另定义的和能否叫本期意外？',passport:'独立SYN同口径增长基点，当前期与上期明确分开；算术和只显示另一已定义对象，非复合市场冲击。消息权重、其他字段、真实完整公告包和价格效应未知。',sourceIds:[2,6,8]},
 C5:{title:'尺度可冻结，消息不能事前算出',question:'按训练/选型钟判断合格尺；零尺度和截止前实际值分别应怎样保留？',passport:'独立SYN，同种误差尺度由题设另给、非估计样本；proxy候选声明已冻结，但选型也须不晚于cut。合成钟含端点，cut<公告。合法尺度0不供除法；披露但不合格尺的事后算术不认证标准化。无真实校准或ABDV复制。',sourceIds:[2,5]},
 C6:{title:'分子改善仍可能输给分母变化',question:'按当前另给一期现金流与总所需回报算两价格及联合回报；两单改能否精确相加？',passport:'独立SYN一期条件现值，cashflow不是GDP校准值；100bp=同一期总回报1个百分点，10000+r须严格正，前CF正、后可0。精确比率供表示，十二位小数仅展示；不给原研究参数、多期风险定价、实际价格或因果归因背书。',sourceIds:[1,3,9]},
 C7:{title:'动作、目标差与路径差是不同参照',question:'当前政策实际动作与相对指定代理的目标/路径差分别是什么？',passport:'独立调查式SYN，政策水平差为基点；路径是另给同期限标量，不是完整曲线。不是GSS2003期货13bp测度、月均结算缩放或正交因子复制，未知真实价格、长端响应与结构外生性。',sourceIds:[3]},
};
function display(id:SurpriseLabId,input:unknown):SurpriseDisplay{
 const r=surpriseEvaluators[id](input);if(r.status==='STOP')return r;
 const rows:(readonly [string,string])[]=rowKeys[id].map(([label,key])=>[label,valueText(r,key)]);
 if(id==='C2'){
  const differences=r.value.retrospectiveIndividualDifferenceBp;
  if(!Array.isArray(differences)||differences.length!==5||!differences.every(v=>typeof v==='number'))throw Error('Five individual declared differences required');
  rows.splice(5,0,...differences.map((value,index):readonly [string,string]=>['事后宣布减回答'+(index+1)+'（基点）',surpriseNumber(value)]));
 }
 return {status:'OK',rows};
}
export const surpriseLabs:readonly SurpriseLab[]=(Object.keys(surpriseCanonicalInputs) as SurpriseLabId[]).map(id=>({id,...texts[id],initial:surpriseCanonicalInputs[id],fields:Object.entries(surpriseRawDomains[id] as Readonly<Record<string,SurpriseDomain>>).map(([key,domain])=>({key,label:labels[id][key],...domain})),display:input=>display(id,input)}));
export const surpriseLabAudit=[
 {key:'seven independent canonical input identities and exactly37 declared raw fields',passed:surpriseLabs.length===7&&surpriseLabs.reduce((n,l)=>n+l.fields.length,0)===37&&surpriseLabs.every(l=>l.initial===surpriseCanonicalInputs[l.id])},
 {key:'all labels decode objects and native integer domains without global clamping',passed:surpriseLabs.every(l=>l.fields.every(f=>f.label.length>=10&&f.step===1&&Number.isSafeInteger(f.min)&&Number.isSafeInteger(f.max)&&f.min<=f.max))},
 {key:'seven default display records valid and fully named; finite structure is not semantic approval',passed:surpriseLabs.every(l=>{const r=l.display(l.initial);return r.status==='OK'&&r.rows.every(([label,value])=>label.length>0&&value.length>0);})},
] as const;
