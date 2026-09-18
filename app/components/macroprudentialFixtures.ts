// AUTHOR DRAFT: seven independent SYN contracts for lesson 3.24.
// Not registered, reviewed, calibrated to a jurisdiction, PIT, causal or production eligible.
export type MacroLabId='C1'|'C2'|'C3'|'C4'|'C5'|'C6'|'C7';
export type MacroDomain=Readonly<{min:number;max:number;step:1}>;
export type ExactQuantity=Readonly<{numerator:number;denominator:number;scale:1|100|10000}>;
export type MacroStop=Readonly<{status:'STOP';reason:string}>;
export type MacroOk=Readonly<{status:'OK';value:Readonly<Record<string,unknown>>;exact:Readonly<Record<string,ExactQuantity>>}>;
export type MacroResult=MacroStop|MacroOk;

const signed:MacroDomain=Object.freeze({min:-1000000,max:1000000,step:1});
const amount:MacroDomain=Object.freeze({min:0,max:1000000,step:1});
const positive:MacroDomain=Object.freeze({min:1,max:1000000,step:1});
const bp:MacroDomain=Object.freeze({min:0,max:10000,step:1});
const binary:MacroDomain=Object.freeze({min:0,max:1,step:1});

export const macroRawDomains=Object.freeze({
 C1:Object.freeze({rateTargetChangeBp:signed,rateNonTargetChangeBp:signed,targetedTargetChangeBp:signed,targetedNonTargetChangeBp:signed}),
 C2:Object.freeze({bankCount:positive,initialEquityPerBank:amount,commonAssetUnitsPerBank:positive,soldUnitsPerBank:amount,priceBefore:positive,impactBpPerUnitSold:bp}),
 C3:Object.freeze({cet1Amount:amount,rwa:positive,minimumRequirementBp:bp,conservationBufferBp:bp,ccybBp:bp,managementTargetBp:bp,shockLoss:amount,ccybReleaseBp:bp}),
 C4:Object.freeze({loanAmount:amount,collateralBefore:positive,annualIncomeBefore:positive,annualDebtServiceBefore:amount,collateralAfter:positive,annualIncomeAfter:positive,annualDebtServiceAfter:amount}),
 C5:Object.freeze({hqla:amount,thirtyDayOutflows:positive,eligibleInflows:amount,inflowCapBp:bp,stableFunding:amount,requiredStableFunding:positive,capitalRatioBp:bp}),
 C6:Object.freeze({bankCreditChange:signed,nonbankCreditChange:signed,foreignBranchChange:signed,offshoreDirectChange:signed,unmeasuredChannelObserved:binary,unmeasuredChannelChange:signed}),
 C7:Object.freeze({treatedPreGrowthBp:signed,treatedPostGrowthBp:signed,noPolicyCounterfactualPostGrowthBp:signed,controlPreGrowthBp:signed,controlPostGrowthBp:signed}),
}) satisfies Readonly<Record<MacroLabId,Readonly<Record<string,MacroDomain>>>>;

export const macroCanonicalInputs=Object.freeze({
 C1:Object.freeze({rateTargetChangeBp:-100,rateNonTargetChangeBp:-80,targetedTargetChangeBp:-100,targetedNonTargetChangeBp:-5}),
 C2:Object.freeze({bankCount:5,initialEquityPerBank:1000,commonAssetUnitsPerBank:20,soldUnitsPerBank:2,priceBefore:100,impactBpPerUnitSold:50}),
 C3:Object.freeze({cet1Amount:1200,rwa:10000,minimumRequirementBp:450,conservationBufferBp:250,ccybBp:200,managementTargetBp:100,shockLoss:300,ccybReleaseBp:200}),
 C4:Object.freeze({loanAmount:800,collateralBefore:1000,annualIncomeBefore:200,annualDebtServiceBefore:80,collateralAfter:800,annualIncomeAfter:160,annualDebtServiceAfter:96}),
 C5:Object.freeze({hqla:120,thirtyDayOutflows:200,eligibleInflows:50,inflowCapBp:7500,stableFunding:700,requiredStableFunding:800,capitalRatioBp:1200}),
 C6:Object.freeze({bankCreditChange:-200,nonbankCreditChange:120,foreignBranchChange:40,offshoreDirectChange:30,unmeasuredChannelObserved:0,unmeasuredChannelChange:0}),
 C7:Object.freeze({treatedPreGrowthBp:1200,treatedPostGrowthBp:700,noPolicyCounterfactualPostGrowthBp:1500,controlPreGrowthBp:800,controlPostGrowthBp:1000}),
}) satisfies Readonly<Record<MacroLabId,Readonly<Record<string,number>>>>;

function stop(reason:string):MacroStop{return {status:'STOP',reason};}
function integer(value:number,label:string):number{if(!Number.isSafeInteger(value))throw new RangeError('中间整数不安全：'+label);return value;}
function add(a:number,b:number):number{return integer(a+b,'加法');}
function subtract(a:number,b:number):number{return integer(a-b,'减法');}
function multiply(a:number,b:number):number{return integer(a*b,'乘法');}
function gcd(a:number,b:number):number{let x=Math.abs(integer(a,'gcd输入')),y=Math.abs(integer(b,'gcd输入'));while(y!==0){const r=integer(x%y,'gcd余数');x=y;y=r;}return x;}
function ratio(numerator:number,denominator:number,scale:1|100|10000=1):ExactQuantity{integer(numerator,'分子');integer(denominator,'分母');if(denominator<=0)throw new RangeError('精确比率分母必须严格为正。');const d=gcd(numerator,denominator);return Object.freeze({numerator:integer(numerator/d,'约分分子'),denominator:integer(denominator/d,'约分分母'),scale});}
export function macroExactToNumber(q:ExactQuantity):number{const n=(q.numerator/q.denominator)*q.scale;if(!Number.isFinite(n))throw new RangeError('展示投影不是有限数。');return n===0?0:n;}
function ok(value:Record<string,unknown>,exact:Record<string,ExactQuantity>={}):MacroOk{return {status:'OK',value:Object.freeze(value),exact:Object.freeze(exact)};}
function raw(input:unknown,id:MacroLabId):MacroStop|Readonly<{status:'RAW_OK';value:Record<string,number>}>{
 if(input===null||typeof input!=='object'||Array.isArray(input))return stop('必须提供完整原始整数对象。');
 const domains:Readonly<Record<string,MacroDomain>>=macroRawDomains[id];const keys=Object.keys(domains),supplied=Reflect.ownKeys(input);
 if(supplied.length!==keys.length||supplied.some(k=>typeof k!=='string'||!Object.hasOwnProperty.call(domains,k)))return stop('原始键必须完整，且不得添加其他字段或符号键。');
 const value:Record<string,number>={};
 for(const key of keys){const descriptor=Object.getOwnPropertyDescriptor(input,key);if(!descriptor||!('value' in descriptor))return stop('输入须是自有数据字段，不接受 getter：'+key);const candidate:unknown=descriptor.value,domain=domains[key];if(typeof candidate!=='number'||!Number.isSafeInteger(candidate)||candidate<domain.min||candidate>domain.max)return stop('原始输入须在声明的安全整数域内：'+key);value[key]=candidate===0?0:candidate;}
 return {status:'RAW_OK',value};
}
function checked(input:unknown,id:MacroLabId,calculate:(p:Record<string,number>)=>MacroResult):MacroResult{const v=raw(input,id);if(v.status==='STOP')return v;try{return calculate(v.value);}catch(error){if(error instanceof RangeError)return stop(error.message);throw error;}}
export function parseMacroRawInteger(text:unknown):number|null{if(typeof text!=='string')return null;const trimmed=text.trim();if(!/^(?:0|-?[1-9]\d*)$/.test(trimmed))return null;const value=Number(trimmed);return Number.isSafeInteger(value)?value:null;}

export function policyTargeting(input:unknown):MacroResult{return checked(input,'C1',p=>{
 const sameTargetHit=subtract(p.targetedTargetChangeBp,p.rateTargetChangeBp);
 const rateSpilloverMagnitude=Math.abs(p.rateNonTargetChangeBp),targetedSpilloverMagnitude=Math.abs(p.targetedNonTargetChangeBp);
 const spilloverReduction=rateSpilloverMagnitude===0?null:ratio(subtract(rateSpilloverMagnitude,targetedSpilloverMagnitude),rateSpilloverMagnitude,100);
 return ok({...p,sameTargetHitBp:sameTargetHit,rateSpilloverMagnitudeBp:rateSpilloverMagnitude,targetedSpilloverMagnitudeBp:targetedSpilloverMagnitude,stipulatedSpilloverReductionPercent:spilloverReduction===null?null:macroExactToNumber(spilloverReduction),realElasticities:null,optimalPolicy:null,actualWelfareEffect:null},spilloverReduction===null?{}:{stipulatedSpilloverReductionPercent:spilloverReduction});
});}

export function compositionFireSale(input:unknown):MacroResult{return checked(input,'C2',p=>{
 if(p.soldUnitsPerBank>p.commonAssetUnitsPerBank)return stop('每家出售单位不得超过其共同资产单位。');
 const systemUnitsSold=multiply(p.bankCount,p.soldUnitsPerBank),priceDropBp=multiply(systemUnitsSold,p.impactBpPerUnitSold);
 if(priceDropBp>=10000)return stop('线性 SYN 冲击必须使价格保持严格为正。');
 const priceAfter=ratio(multiply(p.priceBefore,subtract(10000,priceDropBp)),10000);
 const remainingUnitsPerBank=subtract(p.commonAssetUnitsPerBank,p.soldUnitsPerBank);
 const markToMarketLossPerBank=ratio(multiply(remainingUnitsPerBank,multiply(p.priceBefore,priceDropBp)),10000);
 const equityAfterNumerator=subtract(multiply(p.initialEquityPerBank,markToMarketLossPerBank.denominator),multiply(markToMarketLossPerBank.numerator,markToMarketLossPerBank.scale));
 const equityAfter=ratio(equityAfterNumerator,markToMarketLossPerBank.denominator);
 const cashRaisedAtStipulatedPreSalePrice=multiply(p.soldUnitsPerBank,p.priceBefore);
 return ok({...p,systemUnitsSold,priceDropBp,priceAfter:macroExactToNumber(priceAfter),remainingUnitsPerBank,markToMarketLossPerBank:macroExactToNumber(markToMarketLossPerBank),equityAfter:macroExactToNumber(equityAfter),cashRaisedAtStipulatedPreSalePrice,individualLiquidityImproves:cashRaisedAtStipulatedPreSalePrice>0,systemPriceFalls:priceDropBp>0,equilibriumFireSale:null,networkContagion:null},{priceAfter,markToMarketLossPerBank,equityAfter});
});}

export function ccybRelease(input:unknown):MacroResult{return checked(input,'C3',p=>{
 if(p.shockLoss>p.cet1Amount)return stop('冲击损失不得超过题设 CET1 存量。');
 if(p.ccybReleaseBp>p.ccybBp)return stop('CCyB 释放不得超过题设已建立缓冲。');
 if(p.cet1Amount>p.rwa)return stop('本简化题设要求 CET1 不超过风险加权资产。');
 const cet1AfterShock=subtract(p.cet1Amount,p.shockLoss),actualRatioBefore=ratio(p.cet1Amount,p.rwa,10000),actualRatioAfter=ratio(cet1AfterShock,p.rwa,10000);
 const regulatoryThresholdBefore=add(add(p.minimumRequirementBp,p.conservationBufferBp),p.ccybBp),managementThresholdBefore=add(regulatoryThresholdBefore,p.managementTargetBp);
 const regulatoryThresholdAfterRelease=subtract(regulatoryThresholdBefore,p.ccybReleaseBp),managementThresholdAfterRelease=add(regulatoryThresholdAfterRelease,p.managementTargetBp);
 if(managementThresholdBefore>10000)return stop('监管要求与题设管理目标之和不得超过 10000bp。');
 const headroomBefore=ratio(subtract(multiply(p.cet1Amount,10000),multiply(regulatoryThresholdBefore,p.rwa)),p.rwa),headroomAfterShockBeforeRelease=ratio(subtract(multiply(cet1AfterShock,10000),multiply(regulatoryThresholdBefore,p.rwa)),p.rwa),headroomAfterRelease=ratio(subtract(multiply(cet1AfterShock,10000),multiply(regulatoryThresholdAfterRelease,p.rwa)),p.rwa);
 return ok({...p,cet1AfterShock,actualRatioBeforeBp:macroExactToNumber(actualRatioBefore),actualRatioAfterShockBp:macroExactToNumber(actualRatioAfter),regulatoryThresholdBeforeBp:regulatoryThresholdBefore,managementThresholdBeforeBp:managementThresholdBefore,regulatoryThresholdAfterReleaseBp:regulatoryThresholdAfterRelease,managementThresholdAfterReleaseBp:managementThresholdAfterRelease,regulatoryHeadroomBeforeShockBp:macroExactToNumber(headroomBefore),regulatoryHeadroomAfterShockBeforeReleaseBp:macroExactToNumber(headroomAfterShockBeforeRelease),regulatoryHeadroomAfterReleaseBp:macroExactToNumber(headroomAfterRelease),capitalCreatedByRelease:0,actualLendingResponse:null,bufferUsability:null},{actualRatioBeforeBp:actualRatioBefore,actualRatioAfterShockBp:actualRatioAfter,regulatoryHeadroomBeforeShockBp:headroomBefore,regulatoryHeadroomAfterShockBeforeReleaseBp:headroomAfterShockBeforeRelease,regulatoryHeadroomAfterReleaseBp:headroomAfterRelease});
});}

export function borrowerGates(input:unknown):MacroResult{return checked(input,'C4',p=>{
 const ltvBefore=ratio(p.loanAmount,p.collateralBefore,100),ltvAfter=ratio(p.loanAmount,p.collateralAfter,100),dstiBefore=ratio(p.annualDebtServiceBefore,p.annualIncomeBefore,100),dstiAfter=ratio(p.annualDebtServiceAfter,p.annualIncomeAfter,100);
 const ltvChange=ratio(subtract(multiply(p.loanAmount,p.collateralBefore),multiply(p.loanAmount,p.collateralAfter)),multiply(p.collateralBefore,p.collateralAfter),100);
 const dstiChange=ratio(subtract(multiply(p.annualDebtServiceAfter,p.annualIncomeBefore),multiply(p.annualDebtServiceBefore,p.annualIncomeAfter)),multiply(p.annualIncomeBefore,p.annualIncomeAfter),100);
 return ok({...p,ltvBeforePercent:macroExactToNumber(ltvBefore),ltvAfterPercent:macroExactToNumber(ltvAfter),dstiBeforePercent:macroExactToNumber(dstiBefore),dstiAfterPercent:macroExactToNumber(dstiAfter),ltvChangePercentagePoints:macroExactToNumber(ltvChange),dstiChangePercentagePoints:macroExactToNumber(dstiChange),legalLimit:null,defaultProbability:null,lossGivenDefault:null},{ltvBeforePercent:ltvBefore,ltvAfterPercent:ltvAfter,dstiBeforePercent:dstiBefore,dstiAfterPercent:dstiAfter,ltvChangePercentagePoints:ltvChange,dstiChangePercentagePoints:dstiChange});
});}

export function liquidityMismatch(input:unknown):MacroResult{return checked(input,'C5',p=>{
 const capNumerator=multiply(p.thirtyDayOutflows,p.inflowCapBp),eligibleNumerator=multiply(p.eligibleInflows,10000),useEligible=eligibleNumerator<=capNumerator,cappedInflowNumerator=useEligible?eligibleNumerator:capNumerator;
 const netOutflowNumerator=subtract(multiply(p.thirtyDayOutflows,10000),cappedInflowNumerator);
 if(netOutflowNumerator<=0)return stop('简化 30 日净现金流出必须严格为正。');
 const cappedInflows=ratio(cappedInflowNumerator,10000),netCashOutflows=ratio(netOutflowNumerator,10000),simplifiedLcr=ratio(multiply(p.hqla,10000),netOutflowNumerator,100),stableFundingRatio=ratio(p.stableFunding,p.requiredStableFunding,100),hqlaGap=ratio(subtract(multiply(p.hqla,10000),netOutflowNumerator),10000),stableFundingGap=subtract(p.stableFunding,p.requiredStableFunding);
 return ok({...p,cappedEligibleInflowsAmount:macroExactToNumber(cappedInflows),netCashOutflows:macroExactToNumber(netCashOutflows),simplifiedLcrPercent:macroExactToNumber(simplifiedLcr),hqlaGap:macroExactToNumber(hqlaGap),stableFundingRatioPercent:macroExactToNumber(stableFundingRatio),stableFundingGap,capitalRatioPercent:p.capitalRatioBp/100,baselCompliance:null,actualRunRisk:null},{cappedEligibleInflowsAmount:cappedInflows,netCashOutflows,simplifiedLcrPercent:simplifiedLcr,hqlaGap,stableFundingRatioPercent:stableFundingRatio});
});}

export function policyLeakage(input:unknown):MacroResult{return checked(input,'C6',p=>{
 if(p.bankCreditChange>=0)return stop('本 SYN 的银行渠道须为严格负变化，才能定义毛收紧与抵消率。');
 const measuredOffsets=add(add(p.nonbankCreditChange,p.foreignBranchChange),p.offshoreDirectChange),measuredSystemChange=add(p.bankCreditChange,measuredOffsets),grossBankContraction=Math.abs(p.bankCreditChange),offsetRatio=ratio(measuredOffsets,grossBankContraction,100),fullSystemChange=p.unmeasuredChannelObserved===1?add(measuredSystemChange,p.unmeasuredChannelChange):null;
 if(measuredOffsets<0)return stop('本 SYN 的三条已测渠道合计须为非负抵消量。');
 return ok({...p,grossBankContraction,measuredOffsets,measuredSystemChange,measuredOffsetRatioPercent:macroExactToNumber(offsetRatio),fullSystemChange,unmeasuredChannelValue:p.unmeasuredChannelObserved===1?p.unmeasuredChannelChange:null,completeCoverage:p.unmeasuredChannelObserved===1,causalLeakage:null,optimalPerimeter:null},{measuredOffsetRatioPercent:offsetRatio});
});}

export function evaluationEndogeneity(input:unknown):MacroResult{return checked(input,'C7',p=>{
 const naiveBeforeAfter=subtract(p.treatedPostGrowthBp,p.treatedPreGrowthBp),counterfactualGap=subtract(p.treatedPostGrowthBp,p.noPolicyCounterfactualPostGrowthBp),controlChange=subtract(p.controlPostGrowthBp,p.controlPreGrowthBp),syntheticDifferenceInDifferences=subtract(naiveBeforeAfter,controlChange);
 return ok({...p,naiveBeforeAfterBp:naiveBeforeAfter,counterfactualGapBp:counterfactualGap,controlChangeBp:controlChange,syntheticDifferenceInDifferencesBp:syntheticDifferenceInDifferences,identifiedCausalEffect:null,parallelTrendsValidated:null,policyExogeneity:null,observedRealDataset:null});
});}

export const macroEvaluators=Object.freeze({C1:policyTargeting,C2:compositionFireSale,C3:ccybRelease,C4:borrowerGates,C5:liquidityMismatch,C6:policyLeakage,C7:evaluationEndogeneity});
