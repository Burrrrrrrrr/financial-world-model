const nodes = [
  { x: 28, width: 132, step: '01', title: 'Agent state', note: 'wealth · inventory · mandate' },
  { x: 194, width: 132, step: '02', title: 'Target', note: 'belief · rule · objective' },
  { x: 360, width: 132, step: '03', title: 'Projection', note: 'margin · risk · access' },
  { x: 526, width: 132, step: '04', title: 'Order / fill', note: 'capacity · matching · dealer' },
  { x: 692, width: 132, step: '05', title: 'Market state', note: 'price · depth · volatility' },
  { x: 858, width: 132, step: '06', title: 'Update', note: 'P&L · score · weights' },
];

export default function EndogenousLoopChart() {
  return (
    <figure className="endogenous-loop-chart" aria-labelledby="endogenous-loop-title endogenous-loop-caption">
      <div className="endogenous-loop-head">
        <div>
          <span>RECURSIVE STATE MACHINE</span>
          <h3 id="endogenous-loop-title">价格不是闭环的终点：它必须回写主体状态，才会成为下一轮原因</h3>
        </div>
        <div className="endogenous-loop-legend" aria-label="图例">
          <span className="decision">当期决策链</span>
          <span className="feedback">跨期反馈</span>
        </div>
      </div>
      <div className="endogenous-loop-svg-wrap" role="img" tabIndex={0} aria-label="主体状态依次形成目标、约束后的订单、真实成交和市场状态，市场结果再更新财富、保证金、得分和主体权重，并反馈到下一期主体状态；窄屏时可横向滚动">
        <svg viewBox="0 0 1020 260" aria-hidden="true">
          <defs>
            <marker id="loop-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
            <marker id="feedback-arrow" markerHeight="8" markerWidth="8" orient="auto" refX="7" refY="4">
              <path d="M0,0 L8,4 L0,8 Z" />
            </marker>
          </defs>
          {nodes.map((node, index) => (
            <g key={node.step}>
              <rect className={index === 5 ? 'loop-node loop-node-update' : 'loop-node'} height="86" rx="5" width={node.width} x={node.x} y="48" />
              <text className="loop-step" x={node.x + 13} y="70">{node.step}</text>
              <text className="loop-title" x={node.x + 13} y="94">{node.title}</text>
              <text className="loop-note" x={node.x + 13} y="117">{node.note}</text>
              {index < nodes.length - 1 ? <line className="loop-forward" markerEnd="url(#loop-arrow)" x1={node.x + node.width + 7} x2={nodes[index + 1].x - 9} y1="91" y2="91" /> : null}
            </g>
          ))}
          <path className="loop-feedback" d="M924 144 C920 223, 105 223, 94 145" markerEnd="url(#feedback-arrow)" />
          <text className="loop-feedback-label" x="510" y="211" textAnchor="middle">outcome → wealth / constraints / beliefs / composition → next-period action</text>
          <path className="loop-break" d="M511 31 l8 13 m-8 0 l8-13" />
          <text className="loop-break-label" x="515" y="20" textAnchor="middle">外生冲击可在任一节点进入；没有回写时只是一次传播，不是内生循环</text>
        </svg>
      </div>
      <figcaption id="endogenous-loop-caption">
        图按“当期先决策、后成交、再更新”的顺序冻结。若用本期实现收益先更新策略权重，再让更新后的权重解释同一期订单，就产生时间旅行；若客户净买入却没有任何流动性提供者反向成交，则股份账没有闭合。
      </figcaption>
    </figure>
  );
}
