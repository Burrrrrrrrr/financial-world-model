const stages = [
  { id: '01', title: '3.06 近端实施', body: 'effective overnight rate、合约、benchmark 测量与多重时钟。', guard: '当前隔夜率不是整条预期短率路径。' },
  { id: '02', title: '现实预期分布', body: '调查、政策沟通与状态模型约束 P-measure 短率路径。', guard: '调查均值不是边际投资者真信念。' },
  { id: '03', title: '跨期限无套利', body: '贴现因子、zero、par 与 forward 受同一现金流价格系统约束。', guard: '无套利不意味风险溢价为零。' },
  { id: '04', title: '风险价格与便利收益', body: 'SDF、P/Q 动态、安全、流动和抵押便利改变跨状态价格。', guard: '不把多个已被 TP 吸收的 wedge 再重复加总。' },
  { id: '05', title: '期限供求与承载', body: 'duration supply、preferred habitat、中介能力与套保流改变局部价格并传播。', guard: '历史事件的 bp 系数不是永久弹性。' },
  { id: '06', title: '观测曲线与模型分解', body: 'level、slope、curvature 只是症状；路径/TP 分解还依赖模型、样本与 vintage。', guard: '描述或模型分解不自动成为结构冲击识别。' },
] as const;

export default function YieldCurveTransmissionChart() {
  return (
    <figure className="growth-transmission-chart yield-transmission-chart" aria-labelledby="yield-transmission-title">
      <div className="growth-transmission-head"><div><span>MECHANISM MAP</span><h3 id="yield-transmission-title">从已实现隔夜率到跨期限贴现价格：每一站都有自己的可观测对象和禁止推论</h3></div></div>
      <ol className="growth-transmission-map">{stages.map((stage) => <li className="growth-stage" key={stage.id}><span>{stage.id}</span><h4>{stage.title}</h4><p>{stage.body}</p><em>护栏：{stage.guard}</em></li>)}</ol>
      <figcaption>长端收益率不是一个待被单一故事“解释”的数字。它是现金流价格系统的一个坐标；只有在 curve passport、分解约定与事件时钟都明确后，候选机制才能被对比。</figcaption>
    </figure>
  );
}
