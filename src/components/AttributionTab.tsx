import React from "react";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar, PieChart, Pie, Cell } from "recharts";
import { GitCompare, Layers, Compass, BarChart3, ShieldAlert, Award } from "lucide-react";
import { CONTRIB_YEARLY_DATA, PORTFOLIO_HISTORY } from "../mockData";

export default function AttributionTab() {
  // 1. Line series data summarizing 4 key indices from launch to current
  // We align them so they show realistic absolute returns from 2016 to 2026
  const normalizedReturnsData = PORTFOLIO_HISTORY.map((p, i) => {
    // Generate simulated normalized relative indices starting from 100
    const factor = i / 250;
    return {
      date: p.date,
      hs300: parseFloat((100 + factor * 22 + Math.sin(i / 15) * 6).toFixed(2)),
      zz2000: parseFloat((100 + factor * 35 + Math.cos(i / 10) * 12).toFixed(2)),
      hstech: parseFloat((100 + factor * 11 + Math.sin(i / 8) * 18).toFixed(2)),
      gold: parseFloat((100 + factor * 48 + Math.sin(i / 25) * 8).toFixed(2)),
    };
  });

  // Brinson Attribution data table
  const brinsonData = [
    { asset: "股票 (Stocks大类)", portWt: "51.0%", benchWt: "40.0%", portRet: "12.4%", benchRet: "4.8%", alloc: "+0.53%", select: "+3.04%", interaction: "+0.84%", total: "+4.41%" },
    { asset: "债券 (Bonds信用类)", portWt: "36.6%", benchWt: "45.0%", portRet: "3.6%", benchRet: "3.20%", alloc: "+0.27%", select: "+0.18%", interaction: "+0.03%", total: "+0.48%" },
    { asset: "黄金现货 (Au99.99)", portWt: "8.5%", benchWt: "5.0%", portRet: "9.5%", benchRet: "7.20%", alloc: "+0.08%", select: "+0.12%", interaction: "+0.08%", total: "+0.28%" },
    { asset: "现金/货币基金 (MMF)", portWt: "3.9%", benchWt: "10.0%", portRet: "1.8%", benchRet: "1.50%", alloc: "+0.11%", select: "+0.03%", interaction: "+0.02%", total: "+0.16%" },
  ];

  // Monthly Excess Return Attribution (Waterfall components)
  const monthlyWaterfallData = [
    { name: "1月", "资产配置效应": 0.15, "品种选择效应": 0.22, "交互效应": 0.05, "累计溢值": 0.42 },
    { name: "2月", "资产配置效应": 0.18, "品种选择效应": -0.12, "交互效应": 0.02, "累计溢值": 0.50 },
    { name: "3月", "资产配置效应": 0.25, "品种选择效应": 0.45, "交互效应": 0.10, "累计溢值": 1.30 },
    { name: "4月", "资产配置效应": -0.05, "品种选择效应": 0.15, "交互效应": -0.02, "累计溢值": 1.38 },
    { name: "5月", "资产配置效应": 0.10, "品种选择效应": 0.35, "交互效应": 0.05, "累计溢值": 1.88 },
    { name: "6月", "资产配置效应": 0.12, "品种选择效应": -0.25, "交互效应": -0.08, "累计溢值": 1.67 },
    { name: "7月", "资产配置效应": 0.08, "品种选择效应": 0.18, "交互效应": 0.04, "累计溢值": 1.97 },
    { name: "8月", "资产配置效应": 0.14, "品种选择效应": 0.30, "交互效应": 0.10, "累计溢值": 2.51 },
    { name: "9月", "资产配置效应": 0.22, "品种选择效应": 0.52, "交互效应": 0.15, "累计溢值": 3.40 },
    { name: "10月", "资产配置效应": -0.08, "品种选择效应": 0.10, "交互效应": -0.04, "累计溢值": 3.38 },
    { name: "11月", "资产配置效应": 0.15, "品种选择效应": 0.28, "交互效应": 0.08, "累计溢值": 3.89 },
    { name: "12月", "资产配置效应": 0.11, "品种选择效应": 0.42, "交互效应": 0.12, "累计溢值": 4.54 },
  ];

  // Risk Attribution Pie Chart Data
  const riskContributionData = [
    { name: "股票资产暴露", value: 75, color: "#1E3A8A" },
    { name: "黄金资产暴露", value: 15, color: "#F59E0B" },
    { name: "债券资产暴露", value: 5, color: "#10B981" },
    { name: "货币资产暴露", value: 5, color: "#06B6D4" },
  ];

  const marginalRiskContributionData = [
    { name: "股票(MCR)", value: 4.85 },
    { name: "黄金(MCR)", value: 1.22 },
    { name: "债券(MCR)", value: 0.18 },
    { name: "货币基金(MCR)", value: 0.02 },
  ];

  // Style factor exposures (Beta, Size, Value, Momentum, Volatility, Quality, Liquidity)
  const styleExposureData = [
    { name: "市场贝塔 (Beta)", wt: "+0.25", code: "H-Beta", contribRet: "+1.85%", contribRisk: "25%" },
    { name: "规模因子 (Size)", wt: "-0.40", code: "L-Cap", contribRet: "+2.12%", contribRisk: "38%" },
    { name: "价值因子 (Value)", wt: "+0.18", code: "H-Value", contribRet: "+1.15%", contribRisk: "12%" },
    { name: "动量因子 (Momentum)", wt: "+0.32", code: "H-Mom", contribRet: "+2.48%", contribRisk: "15%" },
    { name: "残差波动 (Volatility)", wt: "-0.55", code: "L-Vol", contribRet: "+0.95%", contribRisk: "5%" },
    { name: "质量因子 (Quality)", wt: "+0.45", code: "H-Qual", contribRet: "+1.65%", contribRisk: "4%" },
    { name: "流动性因子 (Liquidity)", wt: "-0.15", code: "L-Liq", contribRet: "+0.24%", contribRisk: "1%" },
  ];

  return (
    <div className="space-y-6" id="attribution-tab-view">
      {/* 4 Index Absolute Return Contrast */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="attribution-normalized-chart-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <GitCompare className="w-4 h-4 text-purple-600" />
              四大核心维度指数量化收益对比（归一化起点 = 100）
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              覆盖股票宽基、微盘、科技与避险黄金，体现大类分流轮动优势
            </span>
          </div>
          <div className="flex flex-wrap gap-3 font-mono text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-blue-600 rounded-sm"></span>沪深300</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-amber-500 rounded-sm"></span>中证2000</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-indigo-500 rounded-sm"></span>恒生科技</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-cyan-500 rounded-sm"></span>黄金Au99.99</span>
          </div>
        </div>

        <div className="w-full h-72 relative animate-fade-in">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={normalizedReturnsData} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#FFFFFF", 
                  borderColor: "#E2E8F0", 
                  borderRadius: "12px",
                  fontSize: "12px",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
                }} 
              />
              <Line type="monotone" name="沪深300" dataKey="hs300" stroke="#2563EB" strokeWidth={1.5} dot={false} />
              <Line type="monotone" name="中证2000" dataKey="zz2000" stroke="#F59E0B" strokeWidth={1.5} dot={false} />
              <Line type="monotone" name="恒生科技" dataKey="hstech" stroke="#6366F1" strokeWidth={1.5} dot={false} />
              <Line type="monotone" name="黄金Au99.99" dataKey="gold" stroke="#06B6D4" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Brinson Tables & Allocation Decomposition */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Brinson table */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="brinson-results-wrapper">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <Layers className="w-4 h-4 text-purple-600" />
            Brinson 基本大类资产归因明细表 (2016-2026年化归一计算)
          </h4>
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC]/70 font-bold text-[10px] text-slate-450">
                  <th className="py-3 px-3">大类资产构成</th>
                  <th className="py-3 px-2">组合权重 (wp)</th>
                  <th className="py-3 px-2">基准权重 (wb)</th>
                  <th className="py-3 px-2">组合收益 (Rp)</th>
                  <th className="py-3 px-2">基准收益 (Rb)</th>
                  <th className="py-3 px-2">配置效应</th>
                  <th className="py-3 px-2">选择效应</th>
                  <th className="py-3 px-2 text-right">交互效应</th>
                </tr>
              </thead>
              <tbody>
                {brinsonData.map((b, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition duration-100">
                    <td className="py-3 px-3 font-semibold text-slate-800">{b.asset}</td>
                    <td className="py-3 px-2 font-mono text-slate-600">{b.portWt}</td>
                    <td className="py-3 px-2 font-mono text-slate-400">{b.benchWt}</td>
                    <td className="py-3 px-2 font-mono text-slate-850 font-bold">{b.portRet}</td>
                    <td className="py-3 px-2 font-mono text-slate-400">{b.benchRet}</td>
                    <td className="py-3 px-2 font-mono text-red-600 font-bold">{b.alloc}</td>
                    <td className="py-3 px-2 font-mono text-red-650 font-black">{b.select}</td>
                    <td className="py-3 px-2 text-right font-mono text-red-600 font-bold">{b.interaction}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-400 font-sans leading-relaxed">
            <strong>等式自洽校验</strong>: 配置效应(+1.01%) + 品种选择效应(+3.37%) + 复合交互效应(+0.97%) = <strong>+5.35% 量化累积超额收益率</strong>。
          </div>
        </div>

        {/* Contribution Yearly Details Table */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="yearly-contrib-details-wrapper">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <Award className="w-4 h-4 text-purple-600" />
            年度贡献明细数据表 (历史周期记录)
          </h4>
          <div className="overflow-y-auto max-h-64 w-full pr-1 no-scrollbar">
            <table className="w-full text-left border-collapse font-sans text-xs text-slate-600">
              <thead>
                <tr className="border-b border-slate-100 bg-[#F8FAFC]/70 font-bold text-[10px] text-slate-400 sticky top-0 z-10">
                  <th className="py-2.5 px-3">年份</th>
                  <th className="py-2.5 px-1">股票 (%)</th>
                  <th className="py-2.5 px-1">债券 (%)</th>
                  <th className="py-2.5 px-1">黄金 (%)</th>
                  <th className="py-2.5 px-1">货币 (%)</th>
                  <th className="py-2.5 px-1 text-right">总和 (%)</th>
                </tr>
              </thead>
              <tbody>
                {CONTRIB_YEARLY_DATA.map((d, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{d.year}</td>
                    <td className={`py-2.5 px-1 font-mono font-bold ${d.stock >= 0 ? "text-red-600" : "text-emerald-600"}`}>{d.stock > 0 ? `+${d.stock}` : d.stock}%</td>
                    <td className="py-2.5 px-1 font-mono text-slate-500">+{d.bond}%</td>
                    <td className="py-2.5 px-1 font-mono text-slate-500">+{d.gold}%</td>
                    <td className="py-2.5 px-1 font-mono text-slate-500">+{d.mmf}%</td>
                    <td className={`py-2.5 px-1 text-right font-mono font-black ${d.portTotal >= 0 ? "text-red-700 font-black" : "text-emerald-650"}`}>{d.portTotal > 0 ? `+${d.portTotal}` : d.portTotal}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Waterfall & Risk Attribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Waterfall Chart */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="excess-attribution-waterfall-card">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <BarChart3 className="w-4 h-4 text-purple-600" />
            月度超额收益分解(Brinson三因子联动蓄能)
          </h4>
          <div className="w-full h-64 relative font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyWaterfallData} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="name" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E2E8F0", 
                    borderRadius: "10px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)" 
                  }} 
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "9px" }} />
                <Bar name="大类配置效应" dataKey="资产配置效应" fill="#2563EB" />
                <Bar name="品种精选效应" dataKey="品种选择效应" fill="#F59E0B" />
                <Bar name="交叉互动影响" dataKey="交互效应" fill="#6366F1" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Attribution */}
        <div className="lg:col-span-6 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="risk-attribution-breakdown-card">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <Compass className="w-4 h-4 text-purple-600" />
            资产端组合风险归因占比 (Risk & Marginal contribution)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-6 h-52 relative flex flex-col justify-center items-center">
              <ResponsiveContainer width="100%" height="90%">
                <PieChart>
                  <Pie
                    data={riskContributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {riskContributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
                <span className="text-[9px] text-slate-400 uppercase tracking-widest font-bold">股票统筹</span>
                <span className="text-base font-extrabold font-mono text-slate-900 leading-tight">75%</span>
              </div>
              <div className="flex flex-wrap gap-2 justify-center text-[9px] font-sans text-slate-400 mt-[-10px] w-full">
                {riskContributionData.map((r, i) => (
                  <span key={i} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: r.color }}></span>
                    {r.name.slice(0, 2)}: {r.value}%
                  </span>
                ))}
              </div>
            </div>

            <div className="md:col-span-6 h-52 flex flex-col justify-between">
              <span className="text-[10px] text-slate-400 font-semibold mb-2 block">边际风险贡献 (MCR % 值，度量再加仓带来的额外风险系数)</span>
              <div className="space-y-3.5 font-mono text-[10px] text-slate-650 pr-2">
                {marginalRiskContributionData.map((m, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between text-[9px]">
                      <span className="font-bold text-slate-700">{m.name}</span>
                      <span className="font-extrabold text-slate-900">{m.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden border border-slate-200/50">
                      <div
                        className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                        style={{ width: `${(m.value / 5) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Style factor exposures panel */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm animate-fade-in" id="style-factor-panel">
        <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider font-extrabold">
          <GitCompare className="w-4.5 h-4.5 text-purple-600" />
          BARRA 风格因子暴露与收益/风险贡献三联面板
        </h4>
        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
            <thead>
              <tr className="border-b border-slate-100 bg-[#F8FAFC]/70 font-bold text-[10px] text-slate-500">
                <th className="py-3 px-3">Barra风格因子</th>
                <th className="py-3 px-2">代码指代</th>
                <th className="py-3 px-2 text-center">相对基准主动因子暴露度 (Z-Score)</th>
                <th className="py-3 px-2">因子收益率年度贡献 (%)</th>
                <th className="py-3 px-2 text-right">因子在整体风险的权重百分比 (%)</th>
              </tr>
            </thead>
            <tbody>
              {styleExposureData.map((s, i) => {
                const zScore = parseFloat(s.wt);
                const isPositive = zScore >= 0;
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition duration-150">
                    <td className="py-3 px-3 font-semibold text-slate-800">{s.name}</td>
                    <td className="py-3 px-2 font-mono text-slate-400 text-[10px]">{s.code}</td>
                    <td className="py-3 px-2">
                      <div className="flex items-center justify-center gap-3 w-56 mx-auto">
                        <span className={`w-10 font-bold text-right font-mono ${isPositive ? "text-red-500" : "text-emerald-600"}`}>{s.wt}</span>
                        <div className="w-32 bg-slate-150 h-2 rounded flex items-center relative overflow-hidden border border-slate-200/40">
                          <div
                            className={`h-full absolute transition-all duration-300 ${isPositive ? "bg-red-500 right-1/2 left-auto rounded-l-none" : "bg-emerald-500 left-1/2 right-auto rounded-r-none"}`}
                            style={{
                              width: `${Math.abs(zScore) * 85}%`,
                              left: isPositive ? "50%" : "auto",
                              right: isPositive ? "auto" : "50%",
                            }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 font-mono text-red-650 font-bold">{s.contribRet}</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-500">{s.contribRisk}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
