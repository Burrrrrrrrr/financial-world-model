import {cycleDisplayValue,cycleLabs} from './cycleLabDefinitions';
import type {CycleLabId} from './cycleFixtures';
import type {CycleLab} from './cycleLabDefinitions';
export type CycleScenario={id:string;labId:CycleLabId;title:string;question:string;unit:string;correct:number;reason:string;correctPosition:0|1|2;wrong:readonly[{value:number;reason:string},{value:number;reason:string}];scope:string;sourceIds:readonly number[]};
type ScenarioDraft=Omit<CycleScenario,'scope'|'sourceIds'>;
const drafts:readonly ScenarioDraft[]=[
 {id:'M1',labId:'C1',title:'水平与变化不能互换',question:'给定前105、当前103，相邻活动水平变化是多少？不是相对旧峰110的差。',unit:'指数点（当前减前一）',correct:103-105,correctPosition:0,
  reason:'相邻变化103−105=−2指数点。−7是103相对另给旧峰110的水平差，103是当前水平；两者都不是本题变化。这个单序列短窗负变化也不独立认证正式广泛经济衰退。',
  wrong:[{value:103-110,reason:'−7用旧峰110替相邻前期105，回答当前比旧峰低多少；换了参照对象，不能替当前相邻变化。'},{value:103,reason:'103是活动水平，尚未减前一105；水平指数和指数点变化单位相似，但对象不同。'}]},
 {id:'M2',labId:'C1',title:'回升方向不要求恢复到旧峰',question:'另给下一比较104，从当前103到104的水平变化是多少？不是104相对旧峰110。',unit:'指数点（另定下一减当前）',correct:104-103,correctPosition:1,
  reason:'104−103=+1指数点，是另定相邻方向改善。104仍低于旧峰110六点，所以方向改善和水平恢复不是同一命题；也不是实际下一期预测或正式低谷公告。',
  wrong:[{value:104-110,reason:'−6量的是下一比较低于旧峰的距离，没有回答104相对103的方向；低于旧峰仍可出现正相邻变化。'},{value:103-104,reason:'−1反向用当前减下一，本题约定下一减当前；必须固定方向后才解释改善或下降。'}]},
 {id:'M3',labId:'C2',title:'比率上升可以来自分母收缩',question:'信用100不变，等长同口径名义产出100降90，信用/产出上升多少百分点？',unit:'百分点（后比率减前比率）',correct:100/9,correctPosition:2,
  reason:'100/100×100=100%，100/90×100=111.111…%，变化100/9百分点。信用存量净变化是0，不能拿它代替比率；产出跌10%也不能直接变信用率涨10百分点。该合成比率不是正式credit gap或识别的融资繁荣。',
  wrong:[{value:100-100,reason:'0是信用存量的净变化。比率的分母也变了，分子不动不保证整个比率不动。'},{value:(100-90)*100/100,reason:'10是产出下降的绝对百分幅度，把分母变化幅度直接贴成比率百分点；后分母90必须进入新比率，不能仍除100。'}]},
 {id:'M4',labId:'C3',title:'新发贷款与净存量是两个量',question:'起始贷款100、新发40、现金还30、非现金核销10，贷款存量净变化多少？',unit:'本币（贷款存量净变化）',correct:40-30-10,correctPosition:0,
  reason:'净变化40−30−10=0，期末仍100；题设新发贷款毛额40并未消失。现金还30与核销10分别减少存量，但核销不是借款人又付10现金。其余重估/分类/FX明确排除，不能声称真实供给或实际银行利润0。',
  wrong:[{value:40,reason:'40只取新增毛放贷，漏掉同窗口偿还30和核销10；它能回答毛额，却不是净存量变化。'},{value:-10,reason:'−10只取非现金核销，没有把新发40及偿还30接回同一存量桥；核销本身也不是额外现金付款。'}]},
 {id:'M5',labId:'C4',title:'未来分支改写过去的居中残差',question:'t−1=90、t=100固定，t+1从事后A110换为B80，居中残差B减A是多少？',unit:'指数点（事后残差B减A）',correct:(110-80)/3,correctPosition:2,
  reason:'A居中均值100、残差0；B均值90、残差10，B减A=10。未来分支差30只以三点均值的三分之一进入；相同截止历史并不使事后居中结果相同。截止t可得居中残差仍未知，事后演示不是HP算法或实时预测。',
  wrong:[{value:100-(90+100+110)/3,reason:'0只取事后A的残差，把本题B减A的比较换成单个分支；没有证明未来分支不影响结果。'},{value:110-80,reason:'30直接取两个未来水平差，没有经过三点均值的1/3权重，也未把未来水平差转换为两分支残差差。'}]},
 {id:'M6',labId:'C4',title:'后向量与居中量不能改名',question:'截止历史t−2=100、t−1=90、t=100，后向三点残差是多少？不使用t+1。',unit:'指数点（当前减后向均值）',correct:10/3,correctPosition:1,
  reason:'后向均值(100+90+100)/3=290/3，残差100−290/3=10/3。事后A居中残差0依赖未来110，不是这条后向量；当前水平100尚未扣均值。这只是不同信息依赖的教学对照，不是滤波优劣或样本外价值证明。',
  wrong:[{value:100-(90+100+110)/3,reason:'0偷换为另一个事后居中量并用未来110。即使事后数值漂亮，也不能当截止历史后向计算。'},{value:100,reason:'100是当前指数水平，没有减掉三个已知观测的均值；不能把被解释对象本身当残差。'}]},
 {id:'M7',labId:'C5',title:'修订结果没有提前进入信息集',question:'截止序号3，第一版100→98在2发布，修订101→102在4发布；截止可得增长是多少？',unit:'%（截止可得版本增长）',correct:(98-100)*100/100,correctPosition:2,
  reason:'序号2第一版已可得、序号4修订未可得，所以按第一版(98−100)/100=−2%。修订的100/101%是后来对同一对季度的改写，不是截止3已知正增长，也不是下一季度复苏。若截止早于首次发布才留未知，不能把不可得修订填0替现有第一版。',
  wrong:[{value:(102-101)*100/101,reason:'约0.990099%用了序号4后来修订，越过截止3。事件参考季度旧，不等于新版数据在旧判断时刻已经公开。'},{value:0,reason:'0把尚不可得的修订误当无变化，或误以为整组数据不可得；第一版在2已发布，本题有可计算的−2%，未知也不能填数值0。'}]},
 {id:'M8',labId:'C6',title:'同相包含同时扩张和同时收缩',question:'N20、经济扩张14、金融扩张16、同扩张12，实际题设同相比例是多少？',unit:'%（题设同相观测比例）',correct:(12+(20-14-16+12))*100/20,correctPosition:0,
  reason:'同收缩20−14−16+12=2，同相12+2=14，14/20=70%。只取同扩张得到60%；62%是另设独立边际基准而非实际四格表比例。合成相位不认证真实经济/金融定年，也不是危机概率。',
  wrong:[{value:12*100/20,reason:'60%只算同时扩张12，漏掉同时收缩2；本题同相包括两个对角格。'},{value:62,reason:'62%是按给定边际另算的独立状态教学基准，不是这张四格表直接观测的同相14/20；基准不能冒充实际比例。'}]},
 {id:'M9',labId:'C6',title:'高同相比例还需边际基准',question:'题设同相70%，独立边际教学基准62%，二者差多少百分点？',unit:'百分点（题设同相减教学基准）',correct:70-62,correctPosition:1,
  reason:'70−62=8百分点。62来自0.7×0.8+0.3×0.2的独立边际比较，计算它不证明实际两相位独立；差8也不是统计显著性、共同冲击或因果方向。需要真实定年、频率、序列依赖与研究设计另行检验。',
  wrong:[{value:70,reason:'70是原始同相比例，没有扣除62%的另设边际比较；高扩张占比本身会机械抬高独立基准。'},{value:0,reason:'0把“用独立假设构造比较基准”误当“已经证实实际独立且恰等基准”；本题实际70不等62，不能用假设消掉差。'}]},
 {id:'M10',labId:'C7',title:'承损后的杠杆需更新两侧',question:'初贷款80、现金20、负债90、权益10，A已确认损失5%贷款；A总资产/权益是多少？',unit:'倍（A总资产/权益）',correct:96/6,correctPosition:1,
  reason:'另给已确认贷款损失80×5%=4，贷款76、现金20，资产96，负债90固定、权益6，所以96/6=16倍。10倍是旧100/10，6是新权益水平；5%不是房价跌幅或法定确认规则。相同题设产出100→100不让两损失分支风险相同，也不直接认证法律/系统性危机。',
  wrong:[{value:100/10,reason:'10倍保留旧资产100和权益10，漏掉本题明确已确认损失4；没有更新资产分子和权益分母。'},{value:10-4,reason:'6是损失后的权益水平，不是总资产/权益比率；本题还需把资产96除这个分母，不能用资本金额替杠杆。'}]},
];
function labFor(id:CycleLabId):CycleLab{const l=cycleLabs.find(x=>x.id===id);if(!l)throw Error('Cycle lab '+id);return l;}
export const cycleScenarios:readonly CycleScenario[]=drafts.map(d=>{const l=labFor(d.labId);return {...d,scope:l.passport,sourceIds:l.sourceIds};});
export function cycleScenarioInputText(s:CycleScenario):string{const l=labFor(s.labId);return l.fields.map(f=>f.label+' = '+l.initial[f.key]).join('；')+'。';}
export function cycleOptions(s:CycleScenario){const out:{id:string;value:number;correct:boolean;diagnosis:string}[]=[];let w=0;for(let n=0;n<3;n++){const right=n===s.correctPosition,wrong=right?null:s.wrong[w++];out.push({id:'ABC'[n],value:right?s.correct:wrong!.value,correct:right,diagnosis:right?s.reason:wrong!.reason});}return out;}
export const cycleScenarioAudit=[
 {key:'ten same-object shared M/K questions with three finite distinct neutral choices each',passed:cycleScenarios.length===10&&cycleScenarios.every(s=>{const v=cycleOptions(s).map(o=>o.value);return v.every(Number.isFinite)&&new Set(v).size===3&&s.question.length>20&&s.unit.length>5;})},
 {key:'ten full input/passport attachments, ten nonempty authored right-route and twenty nonempty authored wrong-route explanations (semantic quality needs independent review)',passed:cycleScenarios.every(s=>s.scope===labFor(s.labId).passport&&s.sourceIds===labFor(s.labId).sourceIds&&cycleScenarioInputText(s).length>60&&s.reason.trim().length>0&&s.wrong.every(w=>w.reason.trim().length>0))},
 {key:'correct ABC distribution3/4/3 and different sequence from previous lesson',passed:cycleScenarios.map(s=>cycleOptions(s).find(o=>o.correct)!.id).join('/')==='A/B/C/A/C/B/C/A/B/B'&&[0,1,2].map(n=>cycleScenarios.filter(s=>s.correctPosition===n).length).join('/')==='3/4/3'},
 {key:'finite display is explicitly presentation only and all thirty options carry units',passed:cycleScenarios.every(s=>cycleOptions(s).every(o=>cycleDisplayValue(o.value).length>0&&s.unit.length>5))},
] as const;
