import styles from './fiscalPolicy.module.css';
export default function FiscalPathChart({baseline,withPolicy}:{baseline:readonly number[];withPolicy:readonly number[]}) {
 const values=[...baseline,...withPolicy];
 if(baseline.length!==4||withPolicy.length!==4||values.some(value=>!Number.isFinite(value)))throw new Error('Invalid four-period SYN fiscal chart');
 const scale=Math.max(...values.map(Math.abs))||1;
 const normalized=values.map(value=>value/scale),minimum=Math.min(...normalized),maximum=Math.max(...normalized);
 const padding=Math.max((maximum-minimum)*.12,Math.min(2/scale,.1),.01);
 const low=minimum-padding,high=maximum+padding;
 const x=(i:number)=>110+i*170,yNormalized=(v:number)=>250-(v-low)/(high-low)*200;
 const y=(v:number)=>yNormalized(v/scale);
 const ticks=minimum===maximum?[minimum]:[minimum,minimum+(maximum-minimum)/2,maximum];
 const label=(v:number)=>Math.abs(v)>=1e5||(v!==0&&Math.abs(v)<.01)?v.toExponential(2):v.toFixed(1);
 const path=(series:readonly number[])=>series.map((v,i)=>`${i?'L':'M'}${x(i)},${y(v)}`).join(' ');
 if(![low,high,...ticks,...values.map(y)].every(Number.isFinite)||high<=low||ticks.some(v=>!Number.isFinite(v*scale)))return <p role="status">STOP：该图形数值域无法有限表示，请使用同源数值记录或恢复基准；不绘制非有限坐标。</p>;
 return <figure><div className={styles.chartFrame} tabIndex={0} aria-label="四期间SYN路径图；窄屏可横向滚动"><svg className={styles.chart} viewBox="0 0 660 310" role="img" aria-label={`SYN四期间产出水平。基线[${baseline.map(label).join(', ')}]；含措施[${withPolicy.map(label).join(', ')}]。不是历史数据或因果估计。`}>
  <title>合成路径：四个期间不是历史年份</title><desc>灰线为声明基线，绿线为同一纯计算函数生成的政策路径；没有观察数据、校准或因果识别。</desc>
  <path d="M110 50V250H620" fill="none" stroke="#7d857c"/>{ticks.map((v,i)=><g key={i}><path d={`M110 ${yNormalized(v)}H620`} stroke="#ddd8cc"/><text x="102" y={yNormalized(v)+5} textAnchor="end" fontSize="13">{label(v*scale)}</text></g>)}
  <path d={path(baseline)} fill="none" stroke="#7d857c" strokeWidth="3" strokeDasharray="6 4"/><path d={path(withPolicy)} fill="none" stroke="#375f59" strokeWidth="3"/>{withPolicy.map((v,i)=><circle key={i} cx={x(i)} cy={y(v)} r="4" fill="#375f59"/>)}{[0,1,2,3].map(i=><text key={i} x={x(i)} y="276" textAnchor="middle" fontSize="16">期间{i}</text>)}
  <text x="65" y="28" fontSize="16" fill="#7d857c">虚线：SYN基线</text><text x="330" y="28" fontSize="16" fill="#375f59">实线：SYN含措施水平</text>
 </svg></div><figcaption className={styles.chartCaption}>纯教学图，不是真实GDP。纵轴为同单位SYN期间水平，横轴为相对期间；完整数值由同一实验函数给出。正水平差收缩时，增长率效果仍可能为负。窄屏可横向滚动图形；数值与完整解释也保留在同源固定记录中。</figcaption></figure>;
}
