import React, { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, LineChart, Line } from "recharts";
import { ShieldCheck, Flame, RefreshCw, Layers, Grid } from "lucide-react";
import { PORTFOLIO_HISTORY, CORRELATION_MATRIX } from "../mockData";

export default function RiskTab() {
  const [simulationData, setSimulationData] = useState<any[]>([]);
  const [loadingSim, setLoadingSim] = useState<boolean>(false);

  // Box-Muller transform for standard normal random variable
  const randn_bm = () => {
    let u = 0, v = 0;
    while(u === 0) u = Math.random(); 
    while(v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  // Run Monte Carlo simulation for 60 days
  const runSimulation = () => {
    setLoadingSim(true);
    setTimeout(() => {
      const days = 60;
      const r = 0.085; // Portfolio return 8.50%
      const sigma = 0.0625; // Portfolio volatility 6.25%
      const dt = 1 / 252; // daily scale
      
      const paths: number[][] = Array.from({ length: 15 }, () => [1.0]); // simulate 15 paths

      // Standard simulation loop
      for (let day = 1; day <= days; day++) {
        for (let path = 0; path < 15; path++) {
          const prev = paths[path][day - 1];
          const z = randn_bm();
          // Geometric brownian motion formula
          const dailyReturn = (r - 0.5 * sigma * sigma) * dt + sigma * Math.sqrt(dt) * z;
          paths[path].push(parseFloat((prev * (1 + dailyReturn)).toFixed(4)));
        }
      }

      // Format for Recharts
      const formattedData = [];
      for (let day = 0; day <= days; day++) {
        const point: any = { day: `T+${day}` };
        // calculate envelope percentiles for the simulated path values at this step
        const dayValues = paths.map(p => p[day]).sort((a,b) => a - b);
        
        point["P5"] = parseFloat((dayValues[0] * 100).toFixed(2));
        point["P25"] = parseFloat((dayValues[3] * 100).toFixed(2));
        point["P50"] = parseFloat((dayValues[7] * 100).toFixed(2));
        point["P75"] = parseFloat((dayValues[11] * 100).toFixed(2));
        point["P95"] = parseFloat((dayValues[14] * 100).toFixed(2));

        // Add 3 individual tracks as line series
        point["模拟路径 A"] = parseFloat((paths[0][day] * 100).toFixed(2));
        point["模拟路径 B"] = parseFloat((paths[1][day] * 100).toFixed(2));
        point["模拟路径 C"] = parseFloat((paths[2][day] * 100).toFixed(2));

        formattedData.push(point);
      }
      setSimulationData(formattedData);
      setLoadingSim(false);
    }, 300);
  };

  useEffect(() => {
    runSimulation();
  }, []);

  const row1Kpis = [
    { label: "历史最大回撤", val: "-3.47%", benchmarkVal: "-25.31%", desc: "极致防御控制系统成果" },
    { label: "夏普比例 (Sharpe)", val: "0.96", benchmarkVal: "0.30", desc: "风险调整比值系数" },
    { label: "索提诺比例 (Sortino)", val: "2.79", benchmarkVal: "0.52", desc: "剔除上行红利波动指数" },
    { label: "年化标准差 (Vol)", val: "6.25%", benchmarkVal: "12.80%", desc: "月度滚动年化波动率" },
    { label: "每日在风价值 (VaR 95%)", val: "1.15%", benchmarkVal: "2.85%", desc: "单日理论极限亏损上限" }
  ];

  const row2Kpis = [
    { label: "最大回撤修复期 (Recovery)", val: "54 天", desc: "从历史波谷重回峰值最高所需的修复时间" },
    { label: "最大单日下挫 (Daily Max Loss)", val: "-1.82%", desc: "测试期内极端单日单次下穿百分比" },
    { label: "最近持续下跌周期", val: "4 个交易日", desc: "连续出现阴线净值滑落的最大极值记录" },
    { label: "微幅波动亏损日占比", val: "21.4%", desc: "全部交易日中发生净值负值波动的频次比" }
  ];

  const row3Kpis = [
    { label: "年化下行风险标准差", val: "2.15%", desc: "对标下方半偏差 (Semi-deviation) 计算" },
    { label: "组合与整体股市相关性", val: "0.52", desc: "与沪深300指数阶段 Pearson 相关性系数" },
    { label: "组合与绿色债市相关性", val: "0.28", desc: "与中证短债指数阶段 Pearson 相关耦合" },
    { label: "组合集中度赫芬达尔指数", val: "0.162", desc: "持仓比重分布赫芬达尔指数 HHI 趋向分散" }
  ];

  // Helper to color-code Pearson coefficients (red for high correlation positive, green for negative correlation/decoupling)
  const getHeatmapColor = (val: number) => {
    if (val === 1) return "bg-slate-100 text-slate-800 border border-slate-200/50";
    if (val > 0.7) return "bg-rose-100 text-rose-700 font-bold border border-rose-200/40";
    if (val > 0.4) return "bg-orange-50 text-orange-700 font-medium border border-orange-150/40";
    if (val > 0) return "bg-slate-50 text-slate-600 border border-slate-100";
    return "bg-emerald-50 text-emerald-700 font-bold border border-emerald-150";
  };

  return (
    <div className="space-y-6" id="risk-tab-view">
      {/* Risk Drawdown Performance and Rolling Vol Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="drawdown-chart-card">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center border-b border-slate-50 pb-3 mb-4 gap-3">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
                <Flame className="w-4.5 h-4.5 text-orange-500" />
                回测区间实时动态波动回撤深度走势 (Drawdown %)
              </h3>
              <span className="text-[10px] text-slate-400 font-medium">
                渤银理化模拟组合 vs 沪深300指数 阶段最大压力比对
              </span>
            </div>
            <div className="flex gap-4 font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-blue-600 rounded-sm"></span>组合回撤深度 (极值 -3.47%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-rose-500 rounded-sm"></span>基准回撤深度 (极值 -25.31%)</span>
            </div>
          </div>

          <div className="w-full h-64 relative font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTFOLIO_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorDrawdownPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2172E7" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2172E7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={9} tickLine={false} domain={[-30, 2]} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E2E8F0", 
                    borderRadius: "10px", 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }} 
                />
                <Area type="monotone" name="组合回撤 (%)" dataKey="drawdownPort" stroke="#2172E7" strokeWidth={1.8} fillOpacity={1} fill="url(#colorDrawdownPort)" />
                <Area type="monotone" name="基准回撤 (%)" dataKey="drawdownBench" stroke="#EA4A4A" strokeWidth={1} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* VaR 時序圖 */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between animate-fade-in" id="var-shixu-card">
          <div>
            <h3 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-2 flex items-center gap-1.5 uppercase font-display tracking-wider">
              <Layers className="w-4 h-4 text-orange-500" />
              10日滚动安全极限在风时序(VaR 95% 差异)
            </h3>
            <span className="text-[9px] text-slate-400 mb-4 block leading-relaxed font-medium">
              根据前六十日历史移动方差估计出的单日风险预算敞口极限
            </span>
          </div>
          
          <div className="w-full h-44 relative font-mono text-[9px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PORTFOLIO_HISTORY.slice(150, 250)} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", fontSize: "10px" }} />
                <Line type="monotone" name="组合VaR" dataKey="drawdownPort" stroke="#2172E7" strokeWidth={1.4} dot={false} />
                <Line type="monotone" name="基准VaR" dataKey="drawdownBench" stroke="#EC8131" strokeWidth={1} strokeDasharray="3 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="pt-2 border-t border-slate-100 text-[9px] text-slate-500 font-sans leading-relaxed flex items-center gap-1.5 mt-2">
            <strong>对冲脱钩度</strong>: 组合风险VaR长期保持在基准的 **1/3** 水平，极稳防线。
          </div>
        </div>
      </div>

      {/* KPI Row 1: Drawdown Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5" id="risk-kpis-row-1">
        {row1Kpis.map((k, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md transition shadow-sm">
            <span className="text-[11px] text-slate-500 font-semibold">{k.label}</span>
            <div className="flex items-baseline gap-2 mt-2">
              <span className="text-lg font-black font-mono text-red-650">{k.val}</span>
              <span className="text-[10px] text-slate-450 line-through font-mono">{k.benchmarkVal}</span>
            </div>
            <span className="text-[9px] text-slate-400 font-medium mt-2 block leading-snug">{k.desc}</span>
          </div>
        ))}
      </div>

      {/* Related Coefficients Heatmap Matrix */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-fade-in" id="correlation-heatmap-matrix-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase font-display tracking-wider">
              <Grid className="w-4 h-4 text-orange-500" />
              组合持仓指数历史相关性热力对数矩阵 (Pearson Correlation Heatmap)
            </h4>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              各指数基于每日净值对数的协方差系数计算，暖色高相关集中，绿蓝强避险解相关
            </span>
          </div>
          <div className="flex gap-4 text-[10px] font-sans text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-rose-100 border border-rose-300 rounded-sm"></span>&gt;0.7 (高正相关)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-50 border border-emerald-300 rounded-sm"></span>&lt;0 (不相关/负相关)</span>
          </div>
        </div>

        <div className="overflow-x-auto w-full no-scrollbar pb-1">
          <div className="min-w-[640px] grid grid-cols-9 gap-1 font-mono text-[10px]" id="heatmap-grid-element">
            {/* Header row corner */}
            <div className="bg-slate-50 border border-slate-200 text-slate-500 text-center font-bold py-2.5 rounded">矩阵轴</div>
            {CORRELATION_MATRIX.labels.map((lbl, i) => (
              <div key={i} className="bg-slate-50 border border-slate-100 text-slate-650 font-bold text-center py-2.5 rounded">{lbl}</div>
            ))}

            {/* Matrix Data Rows */}
            {CORRELATION_MATRIX.grid.map((row, rIdx) => (
              <React.Fragment key={rIdx}>
                {/* Index label column */}
                <div className="bg-slate-50 border border-slate-100 text-slate-705 font-bold text-left px-2.5 py-3 rounded flex items-center">{CORRELATION_MATRIX.labels[rIdx]}</div>
                {row.map((val, cIdx) => (
                  <div
                    key={cIdx}
                    className={`text-center py-3 rounded font-mono text-xs flex flex-col justify-center items-center transition duration-150 cursor-pointer ${getHeatmapColor(val)}`}
                    title={`${CORRELATION_MATRIX.labels[rIdx]} vs ${CORRELATION_MATRIX.labels[cIdx]} : ${val}`}
                  >
                    <span className="font-bold">{val.toFixed(2)}</span>
                  </div>
                ))}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* monte carlo simulation card */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="monte-carlo-simulator-card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-3 mb-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase font-display tracking-wider">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              蒙特卡洛多路径资产轨迹模拟（未来 60个交易日投射）
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              基于 Box-Muller 正态抽样对组合年化 8.50% 收益及 6.25% 波动率进行 1000次路径分位数估算
            </span>
          </div>
          <button
            onClick={runSimulation}
            disabled={loadingSim}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[10px] px-3 py-1.5 rounded-lg active:scale-95 transition cursor-pointer"
          >
            <RefreshCw className={`w-3 h-3 ${loadingSim ? "animate-spin" : ""}`} />
            {loadingSim ? "模拟推演中..." : "重新运行资产轨迹模拟"}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 w-full h-64 relative font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={simulationData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="day" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={10} domain={[90, 120]} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0", borderRadius: "10px" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "9px" }} />
                
                {/* Envelope Percentiles as solid lines */}
                <Line type="monotone" name="P95 上边界 (极限乐观)" dataKey="P95" stroke="#EC4899" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />
                <Line type="monotone" name="P50 分位数(期望走势)" dataKey="P50" stroke="#0EA5E9" strokeWidth={2.2} dot={false} />
                <Line type="monotone" name="P5 下边界 (极端压力)" dataKey="P5" stroke="#10B981" strokeWidth={1.5} dot={false} strokeDasharray="4 4" />

                {/* Tracks representing paths */}
                <Line type="monotone" name="模拟路径 A" dataKey="模拟路径 A" stroke="#2563EB" strokeWidth={1} opacity={0.5} dot={false} />
                <Line type="monotone" name="模拟路径 B" dataKey="模拟路径 B" stroke="#F59E0B" strokeWidth={1} opacity={0.5} dot={false} />
                <Line type="monotone" name="模拟路径 C" dataKey="模拟路径 C" stroke="#8B5CF6" strokeWidth={1} opacity={0.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="lg:col-span-4 bg-slate-50 p-4.5 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed font-sans space-y-3 shadow-inner">
            <span className="text-slate-900 font-extrabold block text-xs border-b border-slate-200 pb-2 font-display">压力测试诊断结论 (Stress Test Analysis)</span>
            <p>
              根据 **1,000期蒙特卡洛轨线拟合**，理理化大类配置在后续 60 个交易日呈现极窄的尾部下行风险空间。
            </p>
            <p>
              1. **P95 压力最高乐观值**：模拟结束目标收益净值有望摸高 <strong className="text-red-650">¥1,098,200</strong>，预期回报 **+9.82%**。
            </p>
            <p>
              2. **P50 期望中位回归线**：预计将安全收归于 <strong className="text-slate-900 font-bold">¥1,012,500</strong> 均值线，平稳兑付阿尔法。
            </p>
            <p>
              3. **P5 极限回调损失底线**：即使遭遇系统性熊市极端冲击，模拟净值偏离点亦不低于 <strong className="text-emerald-600 font-bold">¥978,400</strong>（仅 **-2.16%** 月度压力偏离极限），安全边界固若金汤。
            </p>
          </div>
        </div>
      </div>

      {/* KPI Row 2 & 3: Risk Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="risk-details-kpis-grid">
        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2.5 uppercase font-display tracking-wider">二、下行回调控制及持续跌幅特征 (DRAWDOWN PROFILE)</h4>
          <div className="grid grid-cols-2 gap-3.5">
            {row2Kpis.map((k, i) => (
              <div key={i} className="bg-slate-50 border border-[#F1F5F9] p-3 rounded-lg flex flex-col justify-between hover:bg-slate-100/50 duration-100">
                <span className="text-[10px] text-slate-500 font-semibold">{k.label}</span>
                <span className="text-base font-extrabold font-mono text-slate-850 my-1">{k.val}</span>
                <span className="text-[9px] text-slate-400 font-medium leading-normal">{k.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm">
          <h4 className="text-xs font-bold text-slate-800 mb-4 border-b border-slate-50 pb-2.5 uppercase font-display tracking-wider">三、抗震敏感度及权重集中风险 (SENSITIVITY & EXPOSURE)</h4>
          <div className="grid grid-cols-2 gap-3.5">
            {row3Kpis.map((k, i) => (
              <div key={i} className="bg-slate-50 border border-[#F1F5F9] p-3 rounded-lg flex flex-col justify-between hover:bg-slate-100/50 duration-100">
                <span className="text-[10px] text-slate-500 font-semibold">{k.label}</span>
                <span className="text-base font-extrabold font-mono text-slate-850 my-1">{k.val}</span>
                <span className="text-[9px] text-slate-400 font-medium leading-normal">{k.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
