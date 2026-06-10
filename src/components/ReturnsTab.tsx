import React, { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { Coins, Percent, Award, ShieldAlert, Grid, CheckSquare } from "lucide-react";
import { PORTFOLIO_HISTORY, CONTRIB_YEARLY_DATA } from "../mockData";

export default function ReturnsTab() {
  const [period, setPeriod] = useState<"monthly" | "yearly">("yearly");

  const row1Kpis = [
    { label: "累计收益率", val: "148.50%", color: "text-red-650", desc: "历史累积总回报" },
    { label: "年化收益率", val: "8.50%", color: "text-red-650", desc: "复利折合率" },
    { label: "相对基准超越度", val: "+115.30%", color: "text-red-650", desc: "相对沪深300" },
    { label: "实际超额年化 (Alpha)", val: "+4.63%", color: "text-amber-600", desc: "风险调整后超额" },
    { label: "滚动持有胜率", val: "88.4%", color: "text-emerald-650", desc: "一年度持有期胜率" },
  ];

  const row2Kpis = [
    { label: "年化主动收益率 (Realized Active)", val: "3.70%", desc: "超越基准沪深300的分值比" },
    { label: "跟踪误差 (Tracking Error)", val: "3.50%", desc: "超额收益与基准波动深度差异" },
    { label: "信息比率 (Information Ratio)", val: "1.06", desc: "主动收益能力评价指数" },
    { label: "卡玛比率 (Calmar Ratio)", val: "2.45", desc: "年化收益与最高回撤绝对比例" },
  ];

  const row3Kpis = [
    { label: "实现贝塔系数 (Beta)", val: "0.25", desc: "系统性风险敏感对标度" },
    { label: "实际阿尔法系数 (Alpha)", val: "4.63%", desc: "特异超额自驱回报值" },
    { label: "残差风险 (Residual Risk)", val: "5.37%", desc: "剥离宏观因素后专属波动度" },
    { label: "索提诺比率 (Sortino Ratio)", val: "2.79", desc: "下行单向偏差风险收益指数" },
  ];

  // Simulated Month return data
  const monthlyReturnData = [
    { period: "2025-01", portfolio: 2.15, benchmark: 1.45 },
    { period: "2025-02", portfolio: 3.42, benchmark: 4.80 },
    { period: "2025-03", portfolio: -0.80, benchmark: -2.31 },
    { period: "2025-04", portfolio: 1.22, benchmark: -0.90 },
    { period: "2025-05", portfolio: 0.95, benchmark: 2.10 },
    { period: "2025-06", portfolio: -1.15, benchmark: -3.42 },
    { period: "2025-07", portfolio: 2.30, benchmark: 0.85 },
    { period: "2025-08", portfolio: 1.88, benchmark: -1.40 },
    { period: "2025-09", portfolio: 4.12, benchmark: 6.20 },
    { period: "2025-10", portfolio: -0.45, benchmark: -1.95 },
    { period: "2025-11", portfolio: 1.50, benchmark: 1.10 },
    { period: "2025-12", portfolio: 1.05, benchmark: -0.55 },
    { period: "2026-01", portfolio: -0.65, benchmark: -2.15 },
    { period: "2026-02", portfolio: 2.45, benchmark: 3.80 },
    { period: "2026-03", portfolio: 1.12, benchmark: 0.45 },
    { period: "2026-04", portfolio: -0.30, benchmark: -1.25 },
    { period: "2026-05", portfolio: 1.88, benchmark: 2.10 }
  ];

  const yearlyReturnData = CONTRIB_YEARLY_DATA.map(d => ({
    period: d.year + "年",
    portfolio: parseFloat(d.portTotal.toFixed(2)),
    benchmark: parseFloat(d.benchTotal.toFixed(2))
  }));

  const chartData = period === "monthly" ? monthlyReturnData : yearlyReturnData;

  const stats = [
    { title: "正收益月份占比", value: "78.4%", color: "text-red-650", notes: "全部回测评定月份" },
    { title: "月度平均收益率", value: "+0.72%", color: "text-red-650", notes: "复利率调整平均值" },
    { title: "最佳单月收益", value: "+15.20%", color: "text-red-650", notes: "2020-05 股市牛市主浪" },
    { title: "最差单月损失", value: "-5.41%", color: "text-emerald-600", notes: "2018-10 美股溢出避险" },
  ];

  const rollingTable = [
    { dur: "1个月滚动持有", win: "78.40%", avg: "0.72%", best: "15.20%", worst: "-5.41%", excess: "0.32%" },
    { dur: "3个月滚动持有", win: "85.20%", avg: "2.18%", best: "22.40%", worst: "-6.12%", excess: "1.10%" },
    { dur: "6个月滚动持有", win: "91.10%", avg: "4.42%", best: "28.50%", worst: "-4.25%", excess: "2.25%" },
    { dur: "1年滚动持有", win: "98.50%", avg: "8.95%", best: "34.12%", worst: "-1.85%", excess: "4.65%" },
  ];

  const histogramData = [
    { range: "<-4% 极低水位", freq: 2 },
    { range: "-4%至-2% 中次回退", freq: 5 },
    { range: "-2%至0% 平滑回调", freq: 14 },
    { range: "0%至+2% 温和产出", freq: 48 },
    { range: "+2%至+4% 优渥溢增", freq: 28 },
    { range: "+4%至+6% 强劲攀升", freq: 11 },
    { range: ">+6% 精品爆发", freq: 4 },
  ];

  return (
    <div className="space-y-6" id="returns-tab-view">
      {/* Cumulative Return Summary & General Area Chart */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="returns-area-chart-wrapper">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-50 pb-4 mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2 font-display">
              <Coins className="w-4 h-4 text-amber-500" />
              累计复利增值对冲航线总览（基准起点 = 100）
            </h3>
            <span className="text-[10px] text-slate-400 font-medium">
              数据每日自动拟真链接，采用 logarithmic 平滑算法
            </span>
          </div>
          <div className="flex gap-4 font-mono text-[10px] text-slate-500">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-blue-600 rounded-sm"></span>渤银指数组合-模拟回报 (8.50% 年化)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-red-400 rounded-sm"></span>沪深300-基准回报 (4.80% 年化)</span>
          </div>
        </div>

        <div className="w-full h-72 relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={PORTFOLIO_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
              <defs>
                <linearGradient id="colorPortTab2" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2172E7" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#2172E7" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
              <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
              <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={["dataMin - 2", "dataMax + 2"]} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: "#FFFFFF", 
                  borderColor: "#E2E8F0", 
                  borderRadius: "12px", 
                  fontSize: "11px",
                  boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" 
                }} 
              />
              <Area type="monotone" name="渤银模拟组合" dataKey="navPort" stroke="#2172E7" strokeWidth={2.4} fillOpacity={1} fill="url(#colorPortTab2)" />
              <Area type="monotone" name="沪深300" dataKey="navBench" stroke="#EA4A4A" strokeWidth={1} fillOpacity={0} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* KPI Row 1: Returns Summary */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5" id="returns-kpis-row-1">
        {row1Kpis.map((k, i) => (
          <div key={i} className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md hover:scale-[1.01] transition-all duration-150 shadow-sm">
            <span className="text-[11px] text-slate-500 font-semibold">{k.label}</span>
            <span className={`text-xl font-bold font-mono mt-1 ${k.color}`}>{k.val}</span>
            <span className="text-[9px] text-slate-400 font-medium mt-1.5">{k.desc}</span>
          </div>
        ))}
      </div>

      {/* Periodic Returns Chart and stats */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Switched bar chart */}
        <div className="lg:col-span-8 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="periodic-returns-switcher-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-3 mb-4 gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-950 font-display">周期实际收益率对决</h4>
              <span className="text-[10px] text-slate-400 font-medium">可按月度或年度进行切换，直观红涨绿跌</span>
            </div>
            <div className="bg-slate-50 p-1 rounded-xl border border-slate-250 flex gap-1">
              <button
                onClick={() => setPeriod("monthly")}
                className={`px-3 py-1 text-[10px] rounded-lg transition-all duration-150 cursor-pointer font-bold ${
                  period === "monthly" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                月度数据明细
              </button>
              <button
                onClick={() => setPeriod("yearly")}
                className={`px-3 py-1 text-[10px] rounded-lg transition-all duration-150 cursor-pointer font-bold ${
                  period === "yearly" ? "bg-white text-blue-600 shadow-sm border border-slate-200" : "text-slate-500 hover:text-slate-800"
                }`}
              >
                年度历史战绩
              </button>
            </div>
          </div>

          <div className="w-full h-64 relative font-mono text-[9px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -22, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="period" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E2E8F0", 
                    borderRadius: "10px", 
                    fontSize: "11px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }} 
                />
                <Legend legendType="rect" wrapperStyle={{ fontSize: "10px" }} />
                <Bar name="拟真组合回报 (%)" dataKey="portfolio" fill="#2172E7" radius={[2, 2, 0, 0]} />
                <Bar name="沪深300基准 (%)" dataKey="benchmark" fill="#94A3B8" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Highlight Stats */}
        <div className="lg:col-span-4 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="returns-extreme-stats-card">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <Award className="w-4 h-4 text-emerald-500" />
            综合获益韧性时空统计
          </h4>
          <div className="space-y-3.5 flex-1 flex flex-col justify-center">
            {stats.map((s, i) => (
              <div key={i} className="flex justify-between items-center p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:bg-slate-100/50 transition">
                <div>
                  <span className="text-xs font-bold text-slate-700 block">{s.title}</span>
                  <span className="text-[10px] text-slate-400 font-medium block mt-0.5">{s.notes}</span>
                </div>
                <div className="text-right">
                  <span className={`text-base font-extrabold font-mono ${s.color}`}>{s.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid of secondary statistics & Rolling analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Rolling table analysis */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="rolling-durations-table">
          <div>
            <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
              <CheckSquare className="w-4.5 h-4.5 text-blue-600" />
              不同滚动持仓期 (Holding Period) 拟真绩效测算
            </h4>
            <div className="overflow-x-auto w-full no-scrollbar">
              <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold bg-slate-50 text-[10px]">
                    <th className="py-2.5 px-3">持有投资跨度</th>
                    <th className="py-2.5 px-2">最终胜率 (%)</th>
                    <th className="py-2.5 px-2">平均总收益</th>
                    <th className="py-2.5 px-2">极值最高收益</th>
                    <th className="py-2.5 px-2">历史最差损失</th>
                    <th className="py-2.5 px-2 text-right">年化均超额</th>
                  </tr>
                </thead>
                <tbody>
                  {rollingTable.map((r, i) => (
                    <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition duration-100">
                      <td className="py-2.5 px-3 font-semibold text-slate-800">{r.dur}</td>
                      <td className="py-2.5 px-2 font-mono text-emerald-600 font-bold">{r.win}</td>
                      <td className="py-2.5 px-2 font-mono text-slate-700">{r.avg}</td>
                      <td className="py-2.5 px-2 font-mono text-red-650">{r.best}</td>
                      <td className="py-2.5 px-2 font-mono text-emerald-600">{r.worst}</td>
                      <td className="py-2.5 px-2 text-right font-mono text-red-650 font-bold">{r.excess}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <p className="mt-4 text-[10px] text-slate-400 leading-relaxed font-sans">
            * 综上可以见：<b>随着模拟持有期限的一步步拉长</b>，由于对冲策略下挫抑制，渤银大类理化底座在6个月以上的胜率开始攀升至 91.10% 以上，一年期持有胜率高达 98.50%。
          </p>
        </div>

        {/* Return Volatility Histogram Chart */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="returns-histogram-card">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <Coins className="w-4.5 h-4.5 text-blue-600" />
            测评区间 月度收益率区间分布柱状图 (Frequency)
          </h4>
          <div className="w-full h-52 relative font-mono text-[9px] mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={histogramData} margin={{ top: 5, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="range" stroke="#94A3B8" fontSize={9} />
                <YAxis stroke="#94A3B8" fontSize={9} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E2E8F0", 
                    borderRadius: "10px", 
                    fontSize: "11px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
                  }} 
                />
                <Bar name="出现频次 (月份数)" dataKey="freq" fill="#E0F2FE" stroke="#3B82F6" strokeWidth={1} radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <span className="text-[9px] text-slate-400 block mt-3 font-medium text-center">
            评测统计分布充分证明：极右侧温和与高增长月份数量远重于极左侧深幅亏损月份，呈显著正偏态。
          </span>
        </div>
      </div>

      {/* Advanced Mathematical indicators */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="advanced-attributes-row">
        <span className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4.5 flex items-center gap-1.5 uppercase font-display tracking-wider">
          <Grid className="w-4.5 h-4.5 text-blue-600" />
          全航向细分对冲因子与风险调节复合评价书 (CAPM Parameter Table)
        </span>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Row 2 Indicators */}
          <div className="space-y-2 border-r border-slate-100/80 pr-0 md:pr-4">
            <h5 className="text-[10px] font-black text-slate-450 uppercase mb-2">一、主动管理绩效多项指标</h5>
            {row2Kpis.map((k, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-100 hover:bg-slate-50/50 px-1 transition duration-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700 block">{k.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium block">{k.desc}</span>
                </div>
                <span className="font-mono font-bold text-slate-850 text-right bg-slate-100 px-2 py-0.5 rounded">{k.val}</span>
              </div>
            ))}
          </div>

          {/* Row 3 Indicators */}
          <div className="space-y-2 pl-0 md:pl-2">
            <h5 className="text-[10px] font-black text-slate-450 uppercase mb-2">二、CAPM资本模型超额回归</h5>
            {row3Kpis.map((k, i) => (
              <div key={i} className="flex justify-between items-center text-xs py-2 border-b border-slate-100 hover:bg-slate-50/50 px-1 transition duration-100">
                <div className="space-y-0.5">
                  <span className="font-bold text-slate-700 block">{k.label}</span>
                  <span className="text-[10px] text-slate-400 font-medium block">{k.desc}</span>
                </div>
                <span className="font-mono font-bold text-slate-850 text-right bg-slate-100 px-2 py-0.5 rounded">{k.val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
