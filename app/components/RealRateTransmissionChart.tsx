const stages = [
  {
    id: '01',
    title: '先给“实际”办护照',
    body: '固定价格指数、期限、观察时点、事前或事后口径，以及索赔权与违约状态。',
    guard: '没有护照的 real rate 只是含混标签，不能直接比较。',
  },
  {
    id: '02',
    title: '把购买力换算量对',
    body: '名义总回报除以价格水平变化；精确 Fisher、加法近似与随机通胀期望分开。',
    guard: '点预测 plug-in 不等于严格条件期望，Jensen gap 也不自动是风险溢价。',
  },
  {
    id: '03',
    title: '识别合同与市场楔子',
    body: 'TIPS 本金和票息按 Reference CPI 调整，市场收益率还受流动性、税制、floor 与拟合影响。',
    guard: '观测 TIPS yield 不是无摩擦、无风险的纯实际利率。',
  },
  {
    id: '04',
    title: '再做期限与均衡分解',
    body: '模型实际曲线可拆成预期实际短率路径和实际期限溢价；r* 则来自独立均衡模型。',
    guard: '长期 real forward、TIPS yield 与 r* 回答三个不同问题。',
  },
  {
    id: '05',
    title: '把贴现率接回索赔权',
    body: '先投影名义或实际现金流，再加期限、信用、股权或资产特定风险补偿。',
    guard: '不存在一个可无条件贴现债券、股票、地产和项目的“市场实际利率”。',
  },
  {
    id: '06',
    title: '分开现金流与贴现新闻',
    body: '同一实际曲线冲击会经 duration、growth、risk premium、leverage 与流动性产生不同价格反应。',
    guard: '比较静态不是历史归因；现实冲击可同时改写分子与分母。',
  },
] as const;

export default function RealRateTransmissionChart() {
  return (
    <figure className="growth-transmission-chart real-rate-transmission-chart" aria-labelledby="real-rate-transmission-title">
      <div className="growth-transmission-head">
        <div>
          <span>MECHANISM MAP</span>
          <h3 id="real-rate-transmission-title">从购买力换算到跨资产估值：先识别对象，再沿合同、模型与索赔权逐层传导</h3>
        </div>
      </div>
      <ol className="growth-transmission-map">
        {stages.map((stage) => (
          <li className="growth-stage" key={stage.id}>
            <span>{stage.id}</span>
            <h4>{stage.title}</h4>
            <p>{stage.body}</p>
            <em>护栏：{stage.guard}</em>
          </li>
        ))}
      </ol>
      <figcaption>这条链把“实际利率上升所以资产下跌”的一句话拆成可审计步骤。任何一步的指数、期限、风险或口径不匹配，后面的估值结论都应暂停。</figcaption>
    </figure>
  );
}
