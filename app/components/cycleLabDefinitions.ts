import {cycleCanonicalInputs,cycleEvaluators,cycleRawDomains} from './cycleFixtures';
import type {CycleLabId} from './cycleFixtures';
export type CycleValue=number|string|boolean|null;
export type CycleField={key:string;label:string;min:number;max:number;step:1};
export type CycleDisplay={status:'STOP';reason:string}|{status:'OK';rows:readonly(readonly[string,string])[]};
export type CycleLab={id:CycleLabId;title:string;question:string;passport:string;sourceIds:readonly number[];initial:Readonly<Record<string,number>>;fields:readonly CycleField[];display:(input:unknown)=>CycleDisplay};
const labels:Record<CycleLabId,Record<string,string>>={
 C1:{previous:'前一观测期活动水平（SYN正整数指数）',current:'当前观测期活动水平（同口径指数）',earlierPeak:'另给旧峰比较水平（不是本程序定年）',alternateNext:'另定下一期比较水平（不是实际未来）'},
 C2:{creditBefore:'前参考日信用存量（同口径SYN金额）',creditAfter:'后参考日信用存量（同口径SYN金额）',gdpBefore:'前参考窗口名义产出流量（正整数；非增长率）',gdpAfter:'后参考窗口名义产出流量（同长度同口径）'},
 C3:{stockBefore:'起始账面贷款存量（SYN整数金额）',newLending:'本窗口新发贷款毛额（SYN整数金额）',repayments:'本窗口现金偿还额（SYN整数金额）',writeOffs:'本窗口已核销额（非现金偿还）'},
 C4:{twoBefore:'截止前第二观测水平t−2（SYN指数）',oneBefore:'截止前第一观测水平t−1（SYN指数）',current:'截止t的观测水平（SYN指数）',futureA:'另给事后分支A的t+1（截止t不可得）',futureB:'另给事后分支B的t+1（截止t不可得）'},
 C5:{firstPrevious:'第一版前参考季度水平（同一对季度）',firstCurrent:'第一版后参考季度水平（SYN指数）',revisedPrevious:'修订版前参考季度水平（不是另一期）',revisedCurrent:'修订版后参考季度水平（不是未来产出）',firstRelease:'第一版发布合成序号（非真实日期）',revisionRelease:'修订版发布合成序号（须严格较晚）',cutoff:'信息截止合成序号（含当序号已发布）'},
 C6:{observations:'共同窗口观测总数N（正整数）',businessExpansion:'合成经济扩张观测数（不是NBER标签）',financialExpansion:'合成金融扩张观测数（不是估计周期）',bothExpansion:'两组同时扩张的观测数（四格须可行）'},
 C7:{outputBefore:'前观测期产出比较水平（SYN指数）',outputAfter:'后观测期产出比较水平（两分支共用）',loanBook:'银行起始贷款账面额（SYN整数金额）',cash:'银行起始现金额（同口径SYN金额）',liabilities:'银行起始负债额（SYN整数金额）',equity:'银行起始权益额（正整数；须账平）',lossA:'分支A另定已确认贷款损失比例（整数百分比）',lossB:'分支B另定已确认贷款损失比例（不是房价跌幅）'},
};
const rowContracts:Record<CycleLabId,readonly(readonly[string,string])[]>={
 C1:[['本观测水平变化（指数点）','currentChange'],['本观测增长（%）','currentGrowthPercent'],['另定下一观测变化（指数点）','nextChange'],['另定下一观测增长（%）','nextGrowthPercent'],['当前相对旧峰的水平差','currentGapFromEarlierPeak'],['另定下一期相对旧峰的水平差','nextGapFromEarlierPeak'],['正式经济周期相位','officialBusinessPhase'],['正式低谷定年','datedTrough'],['潜在产出','potentialOutput']],
 C2:[['信用存量净变化（本币）','netCreditStockChange'],['给定窗口产出流量变化（本币）','gdpFlowChange'],['前信用/产出（%）','ratioBeforePercent'],['后信用/产出（%）','ratioAfterPercent'],['信用/产出变化（百分点）','ratioChangePercentagePoints'],['真实新发贷款毛额','grossNewLending'],['真实授信批准','realLoanApproval'],['识别的信用供给冲击','creditSupplyShock'],['信用造成的产出变化','creditCausedOutputChange'],['正式信用缺口指标','officialCreditGap']],
 C3:[['期初贷款存量','stockBefore'],['本窗口新发贷款毛额','newGrossLending'],['本窗口现金偿还','cashRepayments'],['本窗口非现金核销','noncashWriteOffs'],['期末贷款存量','stockAfter'],['贷款存量净变化','netStockChange'],['题设排除的其他存量变化','excludedOtherStockChanges'],['现实观测新发贷款毛额','observedRealGrossLending'],['真实贷款需求','actualLoanDemand'],['真实贷款供给','actualLoanSupply'],['真实银行利润','actualBankProfit'],['真实危机标签','crisisLabel'],['因果产出效应','causalOutputEffect']],
 C4:[['事后分支A居中均值','retrospectiveCenteredMeanA'],['事后分支B居中均值','retrospectiveCenteredMeanB'],['事后A残差','retrospectiveResidualA'],['事后B残差','retrospectiveResidualB'],['事后残差B减A','retrospectiveResidualBMinusA'],['截止历史三点后向均值','trailingMean'],['截止历史后向残差','trailingResidual'],['截止t可得居中均值','asOfCenteredMean'],['截止t可得居中残差','asOfCenteredResidual'],['真实未来水平','actualFuture'],['估计的HP周期','estimatedHpCycle'],['原WP380转折定年','originalWp380TurningDate'],['样本外预测价值','outOfSampleForecastValue']],
 C5:[['第一版两季度增长（%）','firstVintageGrowthPercent'],['事后修订版两季度增长（%）','retrospectiveRevisedGrowthPercent'],['截止可得版本','availableVintage'],['截止可得前季度水平','availablePrevious'],['截止可得后季度水平','availableCurrent'],['截止可得增长（%）','availableGrowthPercent'],['截止修订是否可得','revisionIsAvailable'],['真实历史首次发布日期','actualHistoricalReleaseDate'],['正式衰退标签','realRecessionLabel'],['真实历史PIT认证','realHistoricalPitCertification'],['真实NBER公告','publishedNberAnnouncement']],
 C6:[['两组同时扩张（观测数）','bothExpansion'],['仅经济扩张（观测数）','businessExpansionOnly'],['仅金融扩张（观测数）','financialExpansionOnly'],['两组同时收缩（观测数）','bothContraction'],['同相观测数','samePhaseCount'],['异相观测数','differentPhaseCount'],['同相比例（%）','concordancePercent'],['独立边际教学基准（%）','independentMarginalBaselinePercent'],['同相比例减教学基准（百分点）','excessOverBaselinePercentagePoints'],['真实经济周期定年','realBusinessDates'],['真实金融周期定年','realFinancialDates'],['经验独立性','empiricalIndependence'],['统计显著性','statisticalSignificance'],['共同冲击概率','commonShockProbability'],['因果方向','causalDirection'],['危机概率','crisisProbability']],
 C7:[['起始资产','initialAssets'],['起始负债','initialLiabilities'],['起始权益','initialEquity'],['起始总资产/权益（倍）','initialLeverage'],['A已确认损失','recognizedLossA'],['B已确认损失','recognizedLossB'],['A贷款账面额','loanBookA'],['B贷款账面额','loanBookB'],['A资产','assetsA'],['B资产','assetsB'],['A权益','equityA'],['B权益','equityB'],['A总资产/权益（倍）','leverageA'],['B总资产/权益（倍）','leverageB'],['A权益是否非正','nonpositiveEquityA'],['B权益是否非正','nonpositiveEquityB'],['题设产出水平变化','stipulatedOutputChange'],['真实贷款反应','actualLoanResponse'],['房价直接生成的确认损失','recognizedLossFromHousePrice'],['法定资不抵债判断','legalInsolvency'],['系统性危机标签','systemicCrisisLabel'],['实际未来产出','actualFutureOutput'],['因果信用产出效应','causalCreditOutputEffect']],
};
export function cycleDisplayValue(value:CycleValue):string{
 if(value===null)return '未知 / 未识别（不是0）';
 if(typeof value==='boolean')return value?'是（仅所给题设）':'否（仅所给题设）';
 if(typeof value==='string')return value==='first'?'第一版（截止已发布）':value==='revised'?'修订版（截止已发布）':value==='unavailable'?'尚无可得版本（不是0）':value;
 if(!Number.isFinite(value))throw Error('Finite cycle display only');
 return new Intl.NumberFormat('zh-CN',{useGrouping:false,maximumSignificantDigits:12}).format(value);
}
function display(id:CycleLabId,input:unknown):CycleDisplay{
 const result=cycleEvaluators[id](input);if(result.status==='STOP')return result;
 const value:Record<string,CycleValue>=result.value;
 const rows=rowContracts[id].map(([label,key])=>{if(!Object.hasOwnProperty.call(value,key))throw Error('Undeclared cycle row '+id+'.'+key);return [label,cycleDisplayValue(value[key])] as const;});
 return {status:'OK',rows};
}
const texts:Record<CycleLabId,{title:string;question:string;passport:string;sourceIds:readonly number[]}>= {
 C1:{title:'相邻方向与旧峰水平是两个对象',question:'先比较相邻变化，再比较旧峰；这两种比较是否在回答同一问题？',passport:'独立SYN，正整数活动指数，同口径相邻观测；旧峰只是另给比较值，alternateNext是另定比较，不是实际预测。单序列短窗方向不认证正式广泛经济周期相位、衰退或低谷。',sourceIds:[1,2,5]},
 C2:{title:'比率变化要拆开分子与分母',question:'按当前两个信用存量及同长度名义产出窗口比较，比率变化与信用净变化是否同向？',passport:'独立SYN，两个信用存量参考日与等长同口径名义产出流量窗口；不混名义/真实或季度/年度，不把流量分母当季度增长率。比率变化不是正式credit gap、毛放贷或因果冲击。',sourceIds:[3,4]},
 C3:{title:'新发毛额与存量净变化不能互换',question:'按当前新发、现金偿还与非现金核销接回存量桥，能否由净变化倒推出毛新发？',passport:'独立SYN账面贷款桥；新发、现金偿还及核销已另给，其他重估/汇率调整/分类变化明确排除。不能把核销当偿还现金或净变化0当毛供给0，未导入真实登记、需求或银行损益。',sourceIds:[3,10]},
 C4:{title:'同一段已知历史，未来分支改写居中结果',question:'只改变截止后t+1，居中残差如何变化；截止t能否已经计算它？',passport:'独立SYN三点均值与两个事后反事实分支，观察截止t；未来A/B虽作为教材已披露，不能进入截止t可得量。后向三点均值仅作信息依赖对照，不是HP、Hamilton或WP380算法，也不证明预测优劣。',sourceIds:[4,7]},
 C5:{title:'参考季度相同，版本按发布时钟读取',question:'按当前截止序号与两次发布序号判断可得版本；后来修订是否等于下一季度变化？',passport:'独立SYN，同一对参考季度的两个版本；发布与截止是合成序号，约定当序号已发布可得。第一版严格早于修订；截止前首次版也未发时保持未知。不是现实数据库、历史公告滞后或严格PIT认证。',sourceIds:[1,7]},
 C6:{title:'同相比例与独立边际教学基准各量什么',question:'先闭合当前四格表，再比较同相比例与另设独立边际基准；能否由此推出共同冲击？',passport:'独立SYN，同一窗口观测总数N由控件给定，两组合成相位没有真实经济/金融定年。边际独立基准是另设比较式，不是验证独立性、p值、因果方向或危机概率；观测频率与序列依赖另需证据。',sourceIds:[4,5,6]},
 C7:{title:'同样产出变化，损失容量可以不同',question:'在两分支共用的给定产出变化下，控件另给的已确认损失怎样改权益和杠杆？',passport:'独立SYN两种损失确认反事实；起始贷款/现金=负债+权益精确平衡，现金及负债本次固定。控件给定整数百分比是另定已确认贷款损失比例，不是房价跌幅或自动法定记账。权益≤0可作为有效题设结果，资产/权益杠杆不计算；不认证法律、关停或系统性危机。',sourceIds:[3,10]},
};
export const cycleLabs:readonly CycleLab[]=(Object.keys(cycleCanonicalInputs) as CycleLabId[]).map(id=>({id,...texts[id],initial:cycleCanonicalInputs[id],fields:Object.entries(cycleRawDomains[id]).map(([key,d])=>({key,label:labels[id][key],min:d.min,max:d.max,step:1})),display:input=>display(id,input)}));
export const cycleLabAudit=[
 {key:'seven independent exact canonical raw input identities',passed:cycleLabs.length===7&&cycleLabs.every(l=>l.initial===cycleCanonicalInputs[l.id])},
 {key:'36 complete decoded integer controls match exact domains',passed:cycleLabs.reduce((n,l)=>n+l.fields.length,0)===36&&cycleLabs.every(l=>l.fields.every(f=>f.label?.length>=10&&f.step===1))},
 {key:'95 explicit complete presentation rows with no undeclared output keys',passed:cycleLabs.reduce((n,l)=>{const d=l.display(l.initial);return n+(d.status==='OK'?d.rows.length:0);},0)===95},
] as const;
