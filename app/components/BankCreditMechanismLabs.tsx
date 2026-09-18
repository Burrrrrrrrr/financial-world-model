'use client';

import { useEffect, useRef, useState } from 'react';
import {
  allowanceMetrics,
  bankCreditFixtureAssertions,
  bankSecurityTradeMetrics,
  bilateralNetSettlement,
  centralBankPurchaseMetrics,
  coveredWriteOffMetrics,
  crossBankPaymentMetrics,
  feasibleCreditCapacity,
  fiscalSettlementMetrics,
  interestMetrics,
  moneyBaseTransitionMetrics,
  moneyPassportEligibility,
  onUsDepositPaymentMetrics,
  onUsLoanMetrics,
  principalRepaymentMetrics,
  prudentialMetrics,
  type ConstraintCapacityInput,
  type EligibilityStatus,
  type SellerSector,
} from './bankCreditFixtures';

function SourceMarks({ ids }: { ids: number[] }) {
  return <>{ids.map((id) => <a aria-label={`参考文献 ${id}`} className="citation-mark" href={`#ref-${id}`} key={id}>[{id}]</a>)}</>;
}

function MechanismNoScriptFallback() {
  return <noscript><style>{'.bank-credit-mechanism-lab > :not(header):not(noscript):not(.yield-static-summary){display:none!important}'}</style><div className="precision-note"><span>无脚本模式</span><p>控件已隐藏，因为没有 JavaScript 时结果不会随输入更新；请使用本实验末尾的冻结静态摘要，并继续完成§61的十道静态孪生题。</p></div></noscript>;
}

function ResetControl({ label, onReset }: { label: string; onReset: () => void }) {
  const [armed, setArmed] = useState(false);
  const requestRef = useRef<HTMLButtonElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);
  const opened = useRef(false);
  useEffect(() => {
    if (armed) { opened.current = true; confirmRef.current?.focus(); }
    else if (opened.current) { opened.current = false; requestRef.current?.focus(); }
  }, [armed]);
  if (!armed) return <button className="yield-reset" onClick={() => setArmed(true)} ref={requestRef} type="button">准备重置{label}</button>;
  return <div className="yield-reset-confirm" role="group" aria-label={`确认重置${label}`}><button onClick={() => setArmed(false)} type="button">取消</button><button onClick={() => { onReset(); setArmed(false); }} ref={confirmRef} type="button">确认重置</button></div>;
}

function AmountInput({ label, max, min = 0, onChange, step = 5, value }: { label: string; max: number; min?: number; onChange: (value: number) => void; step?: number; value: number }) {
  return <label><span>{label}</span><b>{value.toLocaleString()}</b><input max={max} min={min} onChange={(event) => onChange(Number(event.target.value))} step={step} type="range" value={value} /></label>;
}

export function CreditLifecycleLab() {
  const [stage, setStage] = useState<'approved' | 'committed' | 'drawn'>('drawn');
  const [amount, setAmount] = useState(100);
  const metrics = stage === 'drawn' ? onUsLoanMetrics(amount, 'included') : null;
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="credit-lifecycle-lab-title">
      <header><div><span>C1 · CREDIT LIFECYCLE LEDGER</span><h3 id="credit-lifecycle-lab-title">审批、承诺与提款只有最后一步进入贷款—存款本金账本</h3></div><p><SourceMarks ids={[1, 3, 7, 34, 36]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择信用生命周期阶段">{([['approved', '已审批'], ['committed', '已承诺'], ['drawn', '已提款']] as const).map(([id, label]) => <button aria-pressed={stage === id} className={stage === id ? 'active' : ''} key={id} onClick={() => setStage(id)} type="button">{label}</button>)}</div>
      <div className="yield-control-grid"><AmountInput label="合同或提款金额" max={250} onChange={setAmount} value={amount} /></div>
      {metrics ? <div className="holding-return-chain" role="group" aria-label={`提款${amount}，银行贷款与存款各增加${amount}，准备金和权益不变`}><article><span>银行资产</span><b data-testid="c1-loan">贷款 +{metrics.bankLoanAsset}</b><p>取得对借款人的请求权。</p></article><article><span>银行负债</span><b data-testid="c1-deposit">存款 +{metrics.bankDepositLiability}</b><p>发行可支用银行负债。</p></article><article><span>借款人</span><b>资产/负债各 +{amount}</b><p>初始净值变化 {metrics.borrowerNetWorthChange}。</p></article><article className="result"><span>没有自动改变</span><b>准备金 {metrics.bankReserveChange} · 权益 {metrics.bankEquityChange}</b><p>后续支付和ECL另行记账。</p></article></div> : <div className="wacc-decision ineligible" role="status"><span>{stage === 'approved' ? 'APPROVAL' : 'UNDRAWN COMMITMENT'}</span><b>贷款本金 0 · 存款创建 0</b><p>{stage === 'approved' ? '内部决定尚未成为提款。' : '承诺可形成表外风险或拨备，但未用本金不是表内贷款。'}</p></div>}
      <div className="yield-static-summary"><b>静态摘要：</b>冻结借款人为居民货币持有部门、存款进入本课广义货币口径；同行提款100时，银行贷款资产与存款负债各+100，借款人存款资产与贷款负债各+100；准备金、银行权益和借款人净值均不自动改变。</div>
      <ResetControl label="C1" onReset={() => { setStage('drawn'); setAmount(100); }} />
    </section>
  );
}

export function PaymentSettlementLab() {
  const [path, setPath] = useState<'on-us' | 'cross-bank' | 'netted'>('cross-bank');
  const [amount, setAmount] = useState(100);
  const [reverseAmount, setReverseAmount] = useState(70);
  const [payerEligibility, setPayerEligibility] = useState<EligibilityStatus>('included');
  const [payeeEligibility, setPayeeEligibility] = useState<EligibilityStatus>('included');
  const payment = crossBankPaymentMetrics(amount, 120);
  const onUsPayment = onUsDepositPaymentMetrics(amount, payerEligibility, payeeEligibility);
  const net = bilateralNetSettlement(amount, reverseAmount);
  const onUsMoneyText = onUsPayment?.broadMoneyChange === null ? '需方法确认' : `${onUsPayment && onUsPayment.broadMoneyChange > 0 ? '+' : ''}${onUsPayment?.broadMoneyChange}`;
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="payment-settlement-lab-title">
      <header><div><span>C2 · PAYMENT / CLEARING / SETTLEMENT</span><h3 id="payment-settlement-lab-title">同一笔客户付款，在同行、跨行和净额清算中消耗不同结算流动性</h3></div><p><SourceMarks ids={[3, 5, 8, 9, 10, 11, 16]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择付款路径">{([['on-us', '同行'], ['cross-bank', '跨行全额'], ['netted', '双向净额']] as const).map(([id, label]) => <button aria-pressed={path === id} className={path === id ? 'active' : ''} key={id} onClick={() => setPath(id)} type="button">{label}</button>)}</div>
      <div className="yield-control-grid"><AmountInput label="A→B或同行付款" max={120} onChange={setAmount} value={amount} />{path === 'netted' ? <AmountInput label="B→A反向付款" max={120} onChange={setReverseAmount} value={reverseAmount} /> : null}</div>
      {path === 'on-us' ? <fieldset className="yield-model-picker"><legend>冻结货币口径中的持有人资格</legend><label><span>付款人存款</span><select onChange={(event) => setPayerEligibility(event.target.value as EligibilityStatus)} value={payerEligibility}><option value="included">纳入</option><option value="excluded">排除</option><option value="unknown">未知</option></select></label><label><span>收款人存款</span><select onChange={(event) => setPayeeEligibility(event.target.value as EligibilityStatus)} value={payeeEligibility}><option value="included">纳入</option><option value="excluded">排除</option><option value="unknown">未知</option></select></label></fieldset> : null}
      {path === 'on-us' ? <div className="holding-return-chain"><article><span>付款人 / 收款人存款</span><b>−{amount} / +{amount}</b><p>该行总存款变化 {onUsPayment?.bankDepositTotalChange}。</p></article><article><span>准备金</span><b>{onUsPayment?.bankReserveChange}</b><p>同一银行内没有跨行结算。</p></article><article className="result"><span>Broad money ΔM</span><b data-testid="c2-on-us-money">{onUsMoneyText}</b><p>只有双方已知的纳入/排除状态相同才为0；任一未知即停止推断。</p></article></div> : path === 'cross-bank' ? <div className="holding-return-chain"><article><span>A行</span><b>准备金/存款各 −{amount}</b><p>结算后准备金 {payment?.payerReserveAfter}。</p></article><article><span>B行</span><b>准备金/存款各 +{amount}</b><p>原贷款不随付款迁移。</p></article><article className="result"><span>体系</span><b>ΣΔR={payment?.systemReserveChange}</b><p>总存款变化 {payment?.systemDepositChange}。</p></article></div> : <div className="holding-return-chain"><article><span>客户总额</span><b data-testid="c2-gross">{net?.grossPayments}</b><p>{amount}+{reverseAmount}</p></article><article><span>A净付B</span><b data-testid="c2-net">{net?.netAtoB}</b><p>符号为负时方向反转。</p></article><article className="result"><span>名义义务压缩</span><b data-testid="c2-saved">{net?.grossObligationReduction}</b><p>实际流动性节省还取决于时序、队列与日内信用。</p></article></div>}
      <div className="yield-static-summary"><b>静态摘要：</b>同行支付100时该行总存款和准备金不变；双方存款均纳入同一冻结口径时M不变，居民货币持有人向同一行内的排除账户付款时M−100。跨行路径中A/B准备金由120/80变为20/180、体系仍200；若反向付款70，客户总额170而A只净结算30，名义结算义务压缩140。</div>
      <ResetControl label="C2" onReset={() => { setPath('cross-bank'); setAmount(100); setReverseAmount(70); setPayerEligibility('included'); setPayeeEligibility('included'); }} />
    </section>
  );
}

export function MoneyPassportLab() {
  const [issuer, setIssuer] = useState<'bank' | 'central-bank' | 'nonbank'>('bank');
  const [holder, setHolder] = useState<'resident-money-holder' | 'bank' | 'government' | 'nonresident'>('resident-money-holder');
  const [instrument, setInstrument] = useState<'deposit' | 'reserve' | 'bond'>('deposit');
  const [amount, setAmount] = useState(100);
  const eligibility = moneyPassportEligibility(issuer, holder, instrument);
  const broadMoneyText = eligibility.broadMoney === 'included' ? `+${amount}` : eligibility.broadMoney === 'excluded' ? '0' : '需方法确认';
  const baseText = eligibility.monetaryBase === 'included' ? `+${amount}` : eligibility.monetaryBase === 'excluded' ? '0' : '需方法确认';
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="money-passport-lab-title">
      <header><div><span>C3 · MONEY PASSPORT & CONSOLIDATION</span><h3 id="money-passport-lab-title">账户名称不决定货币身份；发行人、持有人和工具必须同时合格</h3></div><p><SourceMarks ids={[5, 6, 7, 14, 16, 57]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-control-grid"><AmountInput label="债权金额" max={300} onChange={setAmount} value={amount} /></div>
      <fieldset className="yield-model-picker"><legend>货币护照</legend><label><span>发行人</span><select onChange={(event) => setIssuer(event.target.value as typeof issuer)} value={issuer}><option value="bank">商业银行</option><option value="central-bank">中央银行</option><option value="nonbank">非银行</option></select></label><label><span>持有人</span><select onChange={(event) => setHolder(event.target.value as typeof holder)} value={holder}><option value="resident-money-holder">居民货币持有部门</option><option value="bank">银行</option><option value="government">中央政府</option><option value="nonresident">非居民</option></select></label><label><span>工具</span><select onChange={(event) => setInstrument(event.target.value as typeof instrument)} value={instrument}><option value="deposit">存款</option><option value="reserve">准备金</option><option value="bond">债券</option></select></label></fieldset>
      <div className="holding-return-chain"><article><span>Broad money</span><b data-testid="c3-money">{broadMoneyText}</b><p>{eligibility.broadMoney === 'included' ? '发行人、居民持有人与存款工具均通过。' : eligibility.broadMoney === 'excluded' ? '明确不属于冻结广义口径。' : '当前组合需要具体方法文件。'}</p></article><article><span>Monetary base</span><b>{baseText}</b><p>{eligibility.monetaryBase === 'included' ? '银行持有的央行准备金通过。' : eligibility.monetaryBase === 'excluded' ? '明确不属于冻结基础口径。' : '央行负债仍需持有人与方法确认。'}</p></article><article className="result"><span>结论</span><b>{eligibility.broadMoney === 'included' ? '广义货币成员' : eligibility.monetaryBase === 'included' ? '基础货币成员' : eligibility.broadMoney === 'unknown' || eligibility.monetaryBase === 'unknown' ? 'UNKNOWN · 查方法' : '两种冻结口径均排除'}</b><p>换法域、持有人或方法版本必须重算。</p></article></div>
      <div className="yield-static-summary"><b>静态摘要：</b>居民企业持有的银行活期存款100进入冻结广义货币；银行持有的央行准备金100进入基础货币；政府央行存款在本课TGA口径中排除。其余央行存款组合返回“需方法确认”，不会因账户名叫deposit而硬判。</div>
      <ResetControl label="C3" onReset={() => { setIssuer('bank'); setHolder('resident-money-holder'); setInstrument('deposit'); setAmount(100); }} />
    </section>
  );
}

export function CreditLossEventLab() {
  const [event, setEvent] = useState<'principal' | 'interest' | 'allowance' | 'writeoff'>('writeoff');
  const [amount, setAmount] = useState(8);
  const repayment = principalRepaymentMetrics(amount, 'included');
  const interest = interestMetrics(amount);
  const allowance = allowanceMetrics(100, 0, Math.min(amount, 100));
  const writeoff = coveredWriteOffMetrics(100, 9, Math.min(amount, 100));
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="credit-loss-event-lab-title">
      <header><div><span>C4 · PRINCIPAL / INTEREST / ECL / WRITE-OFF</span><h3 id="credit-loss-event-lab-title">同样写成“贷款相关8”，四种事件对存款、权益和净贷款的方向完全不同</h3></div><p><SourceMarks ids={[5, 7, 32, 33, 36, 37, 39]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择信用事件">{([['principal', '本金偿还'], ['interest', '已应计利息付款'], ['allowance', '新增拨备'], ['writeoff', '已拨备核销']] as const).map(([id, label]) => <button aria-pressed={event === id} className={event === id ? 'active' : ''} key={id} onClick={() => setEvent(id)} type="button">{label}</button>)}</div>
      <div className="yield-control-grid"><AmountInput label="事件金额" max={20} onChange={setAmount} step={1} value={amount} /></div>
      <div className="holding-return-chain">{event === 'principal' ? <><article><span>贷款</span><b>{repayment?.loanChange}</b><p>合同本金消灭。</p></article><article><span>存款</span><b>{repayment?.depositChange}</b><p>冻结为纳入广义货币的付款资产。</p></article><article className="result"><span>权益 / 广义货币</span><b>{repayment?.bankEquityChange} / {repayment?.broadMoneyChange}</b><p>若存款资格排除则ΔM=0，未知则停止输出。</p></article></> : event === 'interest' ? <><article><span>应计债权</span><b>{interest?.paymentAfterAccrual.accruedInterestChange}</b><p>此前已确认收入。</p></article><article><span>存款</span><b>{interest?.paymentAfterAccrual.depositChange}</b><p>本金不变。</p></article><article className="result"><span>付款时权益</span><b>{interest?.paymentAfterAccrual.bankEquityChange}</b><p>不得重复确认收入。</p></article></> : event === 'allowance' ? <><article><span>Gross loan</span><b>{allowance?.grossLoan}</b><p>合同金额不变。</p></article><article><span>Net loan</span><b>{allowance?.closingNetLoan}</b><p>100−allowance。</p></article><article className="result"><span>税前利润 / 权益 / 存款</span><b>{allowance?.pretaxProfitChange} / {allowance?.equityChangeIgnoringTaxAndOtherEntries} / {allowance?.depositChange}</b><p>权益数值明确忽略税及同步分录。</p></article></> : <><article><span>Gross / allowance</span><b>{writeoff?.grossLoanAfter} / {writeoff?.allowanceAfter}</b><p>初始100/9。</p></article><article><span>Net loan</span><b>{writeoff?.netLoanAfter}</b><p>核销前 {writeoff?.netLoanBefore}。</p></article><article className="result"><span>额外损失 / 存款</span><b>{writeoff?.additionalLoss} / {writeoff?.depositChange}</b><p>核销不是还款。</p></article></>}</div>
      <div className="yield-static-summary"><b>静态摘要：</b>gross100、allowance9、核销8后为gross92、allowance1、net仍91；存款、准备金和新增损失均不变。若只拨备5却核销8，额外损失为3。</div>
      <ResetControl label="C4" onReset={() => { setEvent('writeoff'); setAmount(8); }} />
    </section>
  );
}

export function FiscalCentralBankLab() {
  const [event, setEvent] = useState<'tax' | 'spending' | 'bank-buy' | 'qe'>('qe');
  const [amount, setAmount] = useState(80);
  const [seller, setSeller] = useState<SellerSector>('resident-nonbank');
  const fiscal = fiscalSettlementMetrics(event === 'tax' ? amount : 0, event === 'spending' ? amount : 0);
  const trade = bankSecurityTradeMetrics(amount, event === 'bank-buy' ? 'buy-from-resident-nonbank' : 'interbank');
  const qe = centralBankPurchaseMetrics(amount, seller);
  const deltaM = event === 'tax' ? fiscal?.taxBroadMoneyChange : event === 'spending' ? fiscal?.spendingBroadMoneyChange : event === 'bank-buy' ? trade?.broadMoneyChange : qe?.broadMoneyChange;
  const deltaB = event === 'tax' ? fiscal?.taxBaseChange : event === 'spending' ? fiscal?.spendingBaseChange : event === 'bank-buy' ? 0 : qe?.monetaryBaseChange;
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="fiscal-central-bank-lab-title">
      <header><div><span>C5 · FISCAL / CENTRAL-BANK COUNTERPARTY SWITCH</span><h3 id="fiscal-central-bank-lab-title">交易名称不够：政府账户位置和最终卖方部门决定M与B的方向</h3></div><p><SourceMarks ids={[1, 3, 5, 22, 23, 24]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-view-picker" role="group" aria-label="选择体系交易">{([['tax', '税款→央行政府账户'], ['spending', '政府→居民支出'], ['bank-buy', '银行向居民买券'], ['qe', '央行买券']] as const).map(([id, label]) => <button aria-pressed={event === id} className={event === id ? 'active' : ''} key={id} onClick={() => setEvent(id)} type="button">{label}</button>)}</div>
      <div className="yield-control-grid"><AmountInput label="交易金额" max={120} onChange={setAmount} value={amount} />{event === 'qe' ? <label><span>最终卖方</span><select onChange={(e) => setSeller(e.target.value as SellerSector)} value={seller}><option value="resident-nonbank">居民非银行</option><option value="bank">银行</option><option value="nonresident">非居民</option></select></label> : null}</div>
      <div className="holding-return-chain"><article><span>Broad money ΔM</span><b data-testid="c5-money">{deltaM && deltaM > 0 ? '+' : ''}{deltaM}</b><p>取决于居民货币持有部门。</p></article><article><span>Monetary base ΔB</span><b data-testid="c5-base">{deltaB && deltaB > 0 ? '+' : ''}{deltaB}</b><p>政府央行账户和准备金转换。</p></article><article className="result"><span>身份开关</span><b>{event === 'qe' ? seller : event === 'bank-buy' ? 'resident-nonbank seller' : 'central-bank government account'}</b><p>更换账户或居民性必须重算。</p></article></div>
      <div className="yield-static-summary"><b>静态摘要：</b>税30进入央行政府账户使M/B各−30；居民支出45使各+45；央行向居民非银买券80使M/B各+80，向银行买券80则M0、B+80。</div>
      <ResetControl label="C5" onReset={() => { setEvent('qe'); setAmount(80); setSeller('resident-nonbank'); }} />
    </section>
  );
}

export function MoneyMultiplierLab() {
  const [baseBefore, setBaseBefore] = useState(100);
  const [baseAfter, setBaseAfter] = useState(200);
  const [moneyBefore, setMoneyBefore] = useState(500);
  const [moneyAfter, setMoneyAfter] = useState(520);
  const transition = moneyBaseTransitionMetrics(moneyBefore, baseBefore, moneyAfter, baseAfter);
  const before = transition?.initialRatio ?? null;
  const after = transition?.finalRatio ?? null;
  const ratioChange = transition?.ratioChangePct ?? null;
  const moneyGrowth = transition?.broadMoneyGrowthPct ?? null;
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="money-multiplier-lab-title">
      <header><div><span>C6 · OBSERVED M/B RATIO</span><h3 id="money-multiplier-lab-title">让基础货币和广义货币独立变化，观察事后比率为何不是固定因果乘数</h3></div><p><SourceMarks ids={[1, 14, 15, 17, 18, 46, 47, 48]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-control-grid"><AmountInput label="B before" max={400} min={25} onChange={setBaseBefore} step={25} value={baseBefore} /><AmountInput label="B after" max={500} min={25} onChange={setBaseAfter} step={25} value={baseAfter} /><AmountInput label="M before" max={1000} min={100} onChange={setMoneyBefore} step={20} value={moneyBefore} /><AmountInput label="M after" max={1100} min={100} onChange={setMoneyAfter} step={20} value={moneyAfter} /></div>
      <div className="holding-return-chain"><article><span>Initial M/B</span><b data-testid="c6-before">{before?.toFixed(3)}</b><p>{moneyBefore}/{baseBefore}</p></article><article><span>Final M/B</span><b data-testid="c6-after">{after?.toFixed(3)}</b><p>{moneyAfter}/{baseAfter}</p></article><article><span>Ratio change</span><b>{ratioChange?.toFixed(2)}%</b><p>无量纲描述量。</p></article><article className="result"><span>Broad-money growth</span><b>{moneyGrowth?.toFixed(2)}%</b><p>不能由比率方向替代。</p></article></div>
      <div className="precision-note"><span>禁止命名</span><p>本实验输出字段是 <code>observedMoneyBaseRatio</code>，不是 <code>causalDepositMultiplier</code>。要把它变成预测规则，必须另加现金偏好、准备金行为、资产选择、需求和制度稳定性。</p></div>
      <div className="yield-static-summary"><b>静态摘要：</b>B从100升至200、M从500升至520时，M/B从5降至2.6（−48%），但M本身仍增长4%；比率下降不等于货币收缩。</div>
      <ResetControl label="C6" onReset={() => { setBaseBefore(100); setBaseAfter(200); setMoneyBefore(500); setMoneyAfter(520); }} />
    </section>
  );
}

export function ConstraintSafetyNetLab() {
  const defaults: ConstraintCapacityInput = { capital: 150, leverage: 120, liquidity: 90, stableFunding: 110, largeExposure: 70, eligibleDemand: 95, expectedNetReturn: 85 };
  const [capacities, setCapacities] = useState<ConstraintCapacityInput>(defaults);
  const [underwritingPassed, setUnderwritingPassed] = useState(true);
  const [unitsMatched, setUnitsMatched] = useState(true);
  const result = underwritingPassed && unitsMatched ? feasibleCreditCapacity(capacities) : null;
  const snapshot = prudentialMetrics({ cet1: 9, tier1: 10, tier2: 5, rwa: 180, leverageExposure: 400, hqla: 120, outflows: 150, inflows: 60, asf: 110, rsf: 100, connectedExposure: 3 });
  const labels: { key: keyof ConstraintCapacityInput; label: string }[] = [{ key: 'capital', label: '资本容量' }, { key: 'leverage', label: '杠杆容量' }, { key: 'liquidity', label: '流动性容量' }, { key: 'stableFunding', label: '稳定融资容量' }, { key: 'largeExposure', label: '大额风险容量' }, { key: 'eligibleDemand', label: '合格需求' }, { key: 'expectedNetReturn', label: '预期净收益容量' }];
  return (
    <section className="yield-mechanism-lab bank-credit-mechanism-lab" aria-labelledby="constraint-safety-net-lab-title">
      <header><div><span>C7 · CONSTRAINT & SAFETY-NET STACK</span><h3 id="constraint-safety-net-lab-title">把每只尺子独立换算为边际容量，再由最紧门决定可行提款；任何通过项都不能覆盖失败项</h3></div><p><SourceMarks ids={[26, 27, 28, 29, 30, 31, 33, 41, 42, 43]} /></p></header>
      <MechanismNoScriptFallback />
      <div className="yield-control-grid">{labels.map(({ key, label }) => <AmountInput key={key} label={label} max={200} onChange={(value) => setCapacities((current) => ({ ...current, [key]: value }))} value={capacities[key]} />)}</div>
      <fieldset className="yield-model-picker"><legend>先通过资格门</legend><label><input checked={underwritingPassed} onChange={(event) => setUnderwritingPassed(event.target.checked)} type="checkbox" />借款人与承销资格通过</label><label><input checked={unitsMatched} onChange={(event) => setUnitsMatched(event.target.checked)} type="checkbox" />七项已按同币种、同期限的一阶容量表达</label></fieldset>
      {result ? <output className="wacc-decision eligible"><span>FEASIBLE DRAW · 当前局部上限</span><b data-testid="c7-capacity">{result.capacity}</b><p>绑定约束：{result.bindingConstraints.join(' / ')}</p></output> : <div className="wacc-decision ineligible" role="alert"><span>STOP · 不输出可行容量</span><b>资格或单位尚未闭合</b><ul>{!underwritingPassed ? <li>借款人/承销资格未通过</li> : null}{!unitsMatched ? <li>异质比率尚未换算到同一边际容量</li> : null}</ul></div>}
      <div className="holding-return-chain"><article><span>CET1 / Tier 1</span><b>{snapshot?.cet1RatioPct.toFixed(3)}% / {snapshot?.tier1RatioPct.toFixed(3)}%</b><p>国际最低与本地合规另判。</p></article><article><span>Leverage / LCR</span><b>{snapshot?.leverageRatioPct.toFixed(3)}% / {snapshot?.lcrPct?.toFixed(3)}%</b><p>总暴露与30日压力。</p></article><article><span>NSFR / Large exposure</span><b>{snapshot?.nsfrPct.toFixed(3)}% / {snapshot?.largeExposurePct.toFixed(3)}%</b><p>一年融资与集中度。</p></article></div>
      <div className="yield-static-summary"><b>静态摘要：</b>容量150/120/90/110/70/95/85的最小值是70，大额风险绑定。另一个 SYNTHETIC 单位/方向快照给出CET1 5%、Tier1 5.556%、leverage 2.5%、LCR 133.333%、NSFR 110%、large exposure 30%；它们不能相加、不能直接转成国内合规结论，也绝不覆盖 2.06 的真实上游约束状态。</div>
      <ResetControl label="C7" onReset={() => { setCapacities(defaults); setUnderwritingPassed(true); setUnitsMatched(true); }} />
    </section>
  );
}

export function BankCreditFixtureAudit() {
  const passed = bankCreditFixtureAssertions.filter((item) => item.passed).length;
  return <div className="yield-fixture-audit" role="group" aria-label="3.09冻结机制与边界断言"><span>冻结机制与边界断言 {passed}/{bankCreditFixtureAssertions.length}</span><ul>{bankCreditFixtureAssertions.map((item) => <li className={item.passed ? 'passed' : ''} key={item.id}>{item.passed ? '通过' : '失败'} · {item.statement}</li>)}</ul></div>;
}
