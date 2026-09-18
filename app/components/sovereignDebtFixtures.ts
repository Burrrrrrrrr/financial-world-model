/* Independent finite SYN contracts. Draft only: not a country model, forecast or approval. */
export type SovereignStop = {status:"STOP";reason:string};
type Ok<T> = {status:"OK";value:T};
const stop=(reason:string):SovereignStop=>({status:"STOP",reason});
const ok=<T>(value:T):Ok<T>=>({status:"OK",value});
const whole=(x:number,lo:number,hi:number)=>Number.isSafeInteger(x)&&x>=lo&&x<=hi;
const amount=(x:number)=>whole(x,0,1_000_000);
const signedAmount=(x:number)=>whole(x,-1_000_000,1_000_000);
const rate=(x:number)=>whole(x,-9_000,5_000);
const percent=(x:number)=>whole(x,0,100);
const finite=(xs:readonly number[])=>xs.every(Number.isFinite);
type Rational = {n:bigint;d:bigint};
const zeroBig=BigInt(0),tenBig=BigInt(10),gridBig=BigInt(10_000);
const gcd=(a:bigint,b:bigint):bigint=>{let x=a<zeroBig?-a:a,y=b<zeroBig?-b:b;while(y!==zeroBig){const r=x%y;x=y;y=r;}return x;};
const rational=(n:bigint,d:bigint):Rational=>{if(d<=zeroBig)throw Error("Internal positive-denominator contract");const k=gcd(n,d);return {n:n/k,d:d/k};};
const multiply=(a:Rational,b:Rational)=>rational(a.n*b.n,a.d*b.d);
const add=(a:Rational,b:Rational)=>rational(a.n*b.d+b.n*a.d,a.d*b.d);
const asNumber=(a:Rational)=>Number(a.n)/Number(a.d);

export function sovereignDebtPeriod(input:{oldDebt:number;oldGdp:number;interest:number;primarySurplus:number;sfa:number;realGrowthBps:number;deflatorBps:number}){
  const {oldDebt,oldGdp,interest,primarySurplus,sfa,realGrowthBps,deflatorBps}=input;
  if(!amount(oldDebt)||!amount(oldGdp)||oldGdp===0||!amount(interest)||!signedAmount(primarySurplus)||!signedAmount(sfa)||!rate(realGrowthBps)||!rate(deflatorBps))return stop("一期金额须为护照内整数，旧GDP>0；净增长/平减指数为−9000至5000整数基点。");
  if(oldDebt===0&&interest!==0)return stop("零旧债只接零利息的无新增期内计费域；其他债务/计费日须另给账户。");
  const nominalGdpFactor=(1+realGrowthBps/10_000)*(1+deflatorBps/10_000);
  const newGdp=oldGdp*nominalGdpFactor,newDebt=oldDebt+interest-primarySurplus+sfa;
  if(newDebt<0)return stop("期末债为负，超出此gross-debt教学域；不认证现实负净债不可能。");
  const oldDebtRatioPct=100*oldDebt/oldGdp,newDebtRatioPct=100*newDebt/newGdp;
  const implicitInterestPct=oldDebt===0?null:100*interest/oldDebt;
  const stabilizingPrimaryAmount=oldDebt+interest+sfa-oldDebt*nominalGdpFactor;
  const stabilizingPrimaryPct=100*stabilizingPrimaryAmount/newGdp;
  if(!finite([nominalGdpFactor,newGdp,newDebt,oldDebtRatioPct,newDebtRatioPct,stabilizingPrimaryAmount,stabilizingPrimaryPct]))return stop("有限数值门未通过。");
  return ok({nominalGdpFactor,nominalNetGrowthPct:100*(nominalGdpFactor-1),newGdp,newDebt,debtAmountChange:newDebt-oldDebt,oldDebtRatioPct,newDebtRatioPct,debtRatioChangePp:newDebtRatioPct-oldDebtRatioPct,implicitInterestPct,stabilizingPrimaryAmount,stabilizingPrimaryPct,causalEffect:null,sovereignSafety:null});
}

export type SovereignPathStep = {interestBps:number;realGrowthBps:number;deflatorBps:number;primaryCurrentGdpBps:number;sfaCurrentGdpBps:number};
export function sovereignDebtPath(input:{initialDebtRatioBps:number;steps:readonly SovereignPathStep[]}){
  const {initialDebtRatioBps,steps}=input;
  if(!whole(initialDebtRatioBps,0,100_000)||!Array.isArray(steps)||steps.length<1||steps.length>10)return stop("初始债率0至1000%（整数基点）；仅1至10期显式给定路径。");
  let exactDebtRatio=rational(BigInt(initialDebtRatioBps),gridBig);
  const rows:{period:number;nominalGdpFactor:number;accumulationFactor:number;debtRatioPct:number}[]=[];
  for(let i=0;i<steps.length;i++){
    const x=steps[i];
    if(!x||!rate(x.interestBps)||!rate(x.realGrowthBps)||!rate(x.deflatorBps)||!whole(x.primaryCurrentGdpBps,-5_000,5_000)||!whole(x.sfaCurrentGdpBps,-5_000,5_000))return stop("每期率为护照内整数基点；余额/SFA除该期GDP，不用旧GDP。");
    const nominalGdpFactor=(1+x.realGrowthBps/10_000)*(1+x.deflatorBps/10_000),accumulationFactor=(1+x.interestBps/10_000)/nominalGdpFactor;
    const exactFactor=rational(BigInt(10_000+x.interestBps)*gridBig,BigInt(10_000+x.realGrowthBps)*BigInt(10_000+x.deflatorBps));
    const exactBalance=rational(BigInt(x.sfaCurrentGdpBps-x.primaryCurrentGdpBps),gridBig);
    exactDebtRatio=add(multiply(exactFactor,exactDebtRatio),exactBalance);
    const debtRatio=asNumber(exactDebtRatio);
    if(!finite([nominalGdpFactor,accumulationFactor,debtRatio])||exactDebtRatio.n<zeroBig||exactDebtRatio.n>tenBig*exactDebtRatio.d)return stop(`第${i+1}期离开0至1000%有限gross-debt路径域；不是现实不可持续判断。`);
    rows.push({period:i+1,nominalGdpFactor,accumulationFactor,debtRatioPct:100*debtRatio});
  }
  const last=rows[rows.length-1];
  return ok({rows,finalDebtRatioPct:last.debtRatioPct,changePp:last.debtRatioPct-initialDebtRatioBps/100,internalArithmetic:"整数网格有理数；显示转换不递归",infiniteHorizonProof:null,forecast:null,sovereignSafety:null});
}

export function sovereignRepricing(input:{stock:number;replaced:number;oldCouponBps:number;newCouponBps:number}){
  const {stock,replaced,oldCouponBps,newCouponBps}=input;
  if(!amount(stock)||stock===0||!amount(replaced)||replaced>stock||!whole(oldCouponBps,0,5_000)||!whole(newCouponBps,0,5_000))return stop("完整计费年、面值替换；存量>0，替换额不超过存量，非负整数票息基点。");
  const unchangedStock=stock-replaced,oldAnnualCost=stock*oldCouponBps/10_000,newAnnualCost=(unchangedStock*oldCouponBps+replaced*newCouponBps)/10_000;
  return ok({unchangedStock,replaced,oldAnnualCost,newAnnualCost,costChange:newAnnualCost-oldAnnualCost,averageCouponPct:100*newAnnualCost/stock,replacedSharePct:100*replaced/stock,entireStockWasReplaced:replaced===stock,marketPriceChange:null,actualIssuerFinancing:null});
}

export function sovereignCashFinancing(input:{primaryDeficit:number;interest:number;amortization:number;additionalContingentCash:number;cashAccumulation:number;otherFinancing:number}){
  const {primaryDeficit,interest,amortization,additionalContingentCash,cashAccumulation,otherFinancing}=input;
  if(![primaryDeficit,interest,amortization,additionalContingentCash,otherFinancing,cashAccumulation].every(amount))return stop("独立现金/面值账：全部为非负整数。只接现金积累，不计算缺少可用资产护照的提款；其他融资已给定但未认证现实成交。");
  if(otherFinancing!==0)return stop("本实验只接其他融资=0；若有新贷款/非债务来源，须分工具及账户桥接，不能从发行中扣后漏记新债。");
  const grossFinancingNeed=primaryDeficit+interest+amortization+additionalContingentCash;
  const issuanceNeed=grossFinancingNeed+cashAccumulation-otherFinancing;
  if(issuanceNeed<0)return stop("净债务回购/额外资产使用超出本例非负总发行域，须另给账户，不称现实不可能。");
  const debtNetIncrease=issuanceNeed-amortization;
  return ok({grossFinancingNeed,issuanceNeed,debtNetIncrease,cashAssetChange:cashAccumulation,additionalContingentCash,issuanceMinusGfn:issuanceNeed-grossFinancingNeed,contingentAlreadyInDeficit:0,interestRevenue:0,actualIssuance:null,defaultProbability:null});
}

export function sovereignFxTranslation(input:{domesticOld:number;foreignOldTranslated:number;quoteChangeBps:number;gdp:number}){
  const {domesticOld,foreignOldTranslated,quoteChangeBps,gdp}=input;
  if(!amount(domesticOld)||!amount(foreignOldTranslated)||!rate(quoteChangeBps)||!amount(gdp)||gdp===0)return stop("旧外币债已按旧e折成本币；e为本币/外币报价，变动为−9000至5000整数基点，GDP>0。");
  const quoteFactor=1+quoteChangeBps/10_000,oldTotal=domesticOld+foreignOldTranslated,foreignNewTranslated=foreignOldTranslated*quoteFactor,newTotal=domesticOld+foreignNewTranslated;
  return ok({oldTotal,quoteFactor,foreignNewTranslated,newTotal,translationChange:newTotal-oldTotal,debtRatioPct:100*newTotal/gdp,ratioChangePp:100*(newTotal-oldTotal)/gdp,reverseQuoteChangePct:100*(1/quoteFactor-1),newBorrowing:0,interest:0,causalEffect:null,sovereignSafety:null});
}

export function sovereignDatedFunds(input:{dueToday:number;cashToday:number;restrictedCash:number;settlesLaterAsset:number;committedTodayFunds:number}){
  const {dueToday,cashToday,restrictedCash,settlesLaterAsset,committedTodayFunds}=input;
  if(![dueToday,cashToday,restrictedCash,settlesLaterAsset,committedTodayFunds].every(amount)||restrictedCash>cashToday)return stop("整数日期金额；限制现金不超过现金。权限、日期及融资承诺是给定SYN条件，不认证法律或成交。");
  const unrestrictedCash=cashToday-restrictedCash,usableToday=unrestrictedCash+committedTodayFunds,gapToday=Math.max(dueToday-usableToday,0),excessToday=Math.max(usableToday-dueToday,0);
  return ok({unrestrictedCash,usableToday,gapToday,excessToday,settlesLaterExcluded:settlesLaterAsset,bookCashAndLaterAssets:cashToday+settlesLaterAsset,coveredToday:gapToday===0,rolloverProbability:null,defaultOccurred:null,legalPermission:null});
}

export function sovereignStateWeight(input:{probabilityAPct:number;weightABps:number;weightBBps:number;surplusA:number;surplusB:number}){
  const {probabilityAPct,weightABps,weightBBps,surplusA,surplusB}=input;
  if(!percent(probabilityAPct)||!whole(weightABps,1,100_000)||!whole(weightBBps,1,100_000)||!signedAmount(surplusA)||!signedAmount(surplusB))return stop("独立两状态：概率为0至100整数百分数，正状态权重为1至100000整数万分刻度，余额为有号整数。");
  const p=probabilityAPct/100,mA=weightABps/10_000,mB=weightBBps/10_000;
  const meanWeight=p*mA+(1-p)*mB,meanSurplus=p*surplusA+(1-p)*surplusB,weightedSurplus=p*mA*surplusA+(1-p)*mB*surplusB,productOfMeans=meanWeight*meanSurplus;
  // Algebraically equivalent direct covariance avoids inventing independence.
  const covariance=p*(1-p)*(mA-mB)*(surplusA-surplusB);
  const identityResidual=weightedSurplus-productOfMeans-covariance;
  const scale=Math.max(1,Math.abs(weightedSurplus),Math.abs(productOfMeans),Math.abs(covariance));
  if(!finite([meanWeight,meanSurplus,weightedSurplus,productOfMeans,covariance,identityResidual])||Math.abs(identityResidual)>64*Number.EPSILON*scale)return stop("有限浮点恒等式残差超出声明精度；不是经济理论反例。");
  return ok({meanWeight,meanSurplus,weightedSurplus,productOfMeans,covariance,identityResidual,riskNeutralProbability:null,calibratedDiscountFactor:null,infiniteHorizonProof:null,sovereignSafety:null});
}
