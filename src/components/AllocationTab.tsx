import React, { useState } from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, AreaChart, Area, XAxis, YAxis, CartesianGrid, Legend } from "recharts";
import { PieChart as PieIcon, LineChart as AreaIcon, CalendarCheck, TrendingUp } from "lucide-react";
import { CURRENT_ALLOCATION } from "../mockData";

export default function AllocationTab() {
  const [duration, setDuration] = useState<"3M" | "6M" | "1Y" | "3Y" | "5Y">("1Y");

  // Generate 12 data points over time representing dynamic rebalancing allocations %
  const dynamicAllocationHistory = [
    { date: "2016", "股票": 44.5, "债券": 38.2, "黄金": 12.3, "货币": 5.0 },
    { date: "2017", "股票": 55.2, "债券": 32.1, "黄金": 8.5, "货币": 4.2 },
    { date: "2018", "股票": 35.8, "债券": 48.4, "黄金": 11.2, "货币": 4.6 },
    { date: "2019", "股票": 52.1, "债券": 33.5, "黄金": 9.4, "货币": 5.0 },
    { date: "2020", "股票": 58.4, "债券": 28.2, "黄金": 10.4, "货币": 3.0 },
    { date: "2021", "股票": 48.6, "债券": 37.5, "黄金": 9.8, "货币": 4.1 },
    { date: "2022", "股票": 36.2, "债券": 47.1, "黄金": 12.5, "货币": 4.2 },
    { date: "2023", "股票": 41.5, "债券": 44.2, "黄金": 10.8, "货币": 3.5 },
    { date: "2024", "股票": 50.8, "债券": 35.4, "黄金": 10.2, "货币": 3.6 },
    { date: "2025", "股票": 51.9, "债券": 36.6, "黄金": 8.5, "货币": 3.0 },
    { date: "2026", "股票": 51.9, "债券": 36.6, "黄金": 8.5, "货币": 3.0 },
  ];

  // Specific Index Weights Area history over 10-years time series (simulating rebalancing updates)
  const indexAllocationHistory = Array.from({ length: 15 }, (_, idx) => {
    const year = 2016 + Math.floor(idx / 1.5);
    const month = 1 + (idx % 2) * 6;
    const dateStr = `${year}-${String(month).padStart(2, "0")}`;
    
    // add small sine wave variation
    const wave = Math.sin(idx / 1.8);
    const wave2 = Math.cos(idx / 2.2);

    return {
      date: dateStr,
      "沪深300": parseFloat((18.2 + wave * 3.5).toFixed(1)),
      "中证2000": parseFloat((11.5 - wave2 * 2.8).toFixed(1)),
      "自由现金流": parseFloat((12.8 + wave2 * 2.1).toFixed(1)),
      "恒生科技": parseFloat((9.4 - wave * 1.5).toFixed(1)),
      "中证短债": parseFloat((22.1 + wave * 4.2).toFixed(1)),
      "黄金Au99.99": parseFloat((8.5 + wave2 * 1.5).toFixed(1)),
    };
  });

  // Index performance ranges (3M, 6M, 1Y, 3Y, 5Y returns table)
  const indexPerformanceSummary = {
    "3M": [
      { name: "沪深300指数", code: "000300.SH", type: "股票", return: "+4.18%", maxDrawdown: "-3.12%", sharp: "1.15" },
      { name: "中证2000指数", code: "932000.CSI", type: "股票", return: "-5.42%", maxDrawdown: "-11.82%", sharp: "-0.45" },
      { name: "自由现金流指数", code: "H30303.CSI", type: "股票", return: "+1.92%", maxDrawdown: "-2.45%", sharp: "0.85" },
      { name: "恒生科技指数", code: "HSTECH.HK", type: "股票", return: "+8.90%", maxDrawdown: "-9.15%", sharp: "1.42" },
      { name: "中证短债指数", code: "H11001.CSI", type: "债券", return: "+0.82%", maxDrawdown: "0.00%", sharp: "4.82" },
      { name: "中证短融指数", code: "H11021.CSI", type: "债券", return: "+0.68%", maxDrawdown: "0.00%", sharp: "5.12" },
      { name: "黄金Au99.99", code: "AU9999.SGE", type: "黄金", return: "+11.45%", maxDrawdown: "-2.10%", sharp: "2.85" },
      { name: "货币基金指数", code: "H11025.CSI", type: "货币", return: "+0.45%", maxDrawdown: "0.00%", sharp: "6.22" }
    ],
    "6M": [
      { name: "沪深300指数", code: "000300.SH", type: "股票", return: "+8.95%", maxDrawdown: "-6.15%", sharp: "1.05" },
      { name: "中证2000指数", code: "932000.CSI", type: "股票", return: "+12.18%", maxDrawdown: "-16.45%", sharp: "0.55" },
      { name: "自由现金流指数", code: "H30303.CSI", type: "股票", return: "+5.12%", maxDrawdown: "-4.12%", sharp: "0.92" },
      { name: "恒生科技指数", code: "HSTECH.HK", type: "股票", return: "+3.42%", maxDrawdown: "-18.15%", sharp: "0.22" },
      { name: "中证短债指数", code: "H11001.CSI", type: "债券", return: "+1.65%", maxDrawdown: "0.00%", sharp: "4.50" },
      { name: "中证短融指数", code: "H11021.CSI", type: "债券", return: "+1.35%", maxDrawdown: "0.00%", sharp: "4.95" },
      { name: "黄金Au99.99", code: "AU9999.SGE", type: "黄金", return: "+15.92%", maxDrawdown: "-4.95%", sharp: "2.12" },
      { name: "货币基金指数", code: "H11025.CSI", type: "货币", return: "+0.92%", maxDrawdown: "0.00%", sharp: "6.10" }
    ],
    "1Y": [
      { name: "沪深300指数", code: "000300.SH", type: "股票", return: "+14.10%", maxDrawdown: "-14.28%", sharp: "0.85" },
      { name: "中证2000指数", code: "932000.CSI", type: "股票", return: "+18.90%", maxDrawdown: "-24.12%", sharp: "0.72" },
      { name: "自由现金流指数", code: "H30303.CSI", type: "股票", return: "+12.15%", maxDrawdown: "-8.45%", sharp: "1.12" },
      { name: "恒生科技指数", code: "HSTECH.HK", type: "股票", return: "-1.85%", maxDrawdown: "-32.42%", sharp: "-0.08" },
      { name: "中证短债指数", code: "H11001.CSI", type: "债券", return: "+3.28%", maxDrawdown: "-0.05%", sharp: "3.80" },
      { name: "中证短融指数", code: "H11021.CSI", type: "债券", return: "+2.75%", maxDrawdown: "0.00%", sharp: "4.20" },
      { name: "黄金Au99.99", code: "AU9999.SGE", type: "黄金", return: "+24.80%", maxDrawdown: "-8.45%", sharp: "1.95" },
      { name: "货币基金指数", code: "H11025.CSI", type: "货币", return: "+1.85%", maxDrawdown: "0.00%", sharp: "5.85" }
    ],
    "3Y": [
      { name: "沪深300指数", code: "000300.SH", type: "股票", return: "+1.95%", maxDrawdown: "-28.42%", sharp: "0.15" },
      { name: "中证2000指数", code: "932000.CSI", type: "股票", return: "-3.45%", maxDrawdown: "-36.15%", sharp: "-0.05" },
      { name: "自由现金流指数", code: "H30303.CSI", type: "股票", return: "+21.15%", maxDrawdown: "-12.45%", sharp: "0.95" },
      { name: "恒生科技指数", code: "HSTECH.HK", type: "股票", return: "-35.42%", maxDrawdown: "-54.20%", sharp: "-0.48" },
      { name: "中证短债指数", code: "H11001.CSI", type: "债券", return: "+10.15%", maxDrawdown: "-0.15%", sharp: "3.12" },
      { name: "中证短融指数", code: "H11021.CSI", type: "债券", return: "+8.92%", maxDrawdown: "0.00%", sharp: "3.54" },
      { name: "黄金Au99.99", code: "AU9999.SGE", type: "黄金", return: "+42.50%", maxDrawdown: "-11.85%", sharp: "1.35" },
      { name: "货币基金指数", code: "H11025.CSI", type: "货币", return: "+5.92%", maxDrawdown: "0.00%", sharp: "5.12" }
    ],
    "5Y": [
      { name: "沪深300指数", code: "000300.SH", type: "股票", return: "+12.18%", maxDrawdown: "-31.15%", sharp: "0.32" },
      { name: "中证2000指数", code: "932000.CSI", type: "股票", return: "+28.15%", maxDrawdown: "-42.15%", sharp: "0.45" },
      { name: "自由现金流指数", code: "H30303.CSI", type: "股票", return: "+45.18%", maxDrawdown: "-14.22%", sharp: "1.24" },
      { name: "恒生科技指数", code: "HSTECH.HK", type: "股票", return: "-12.50%", maxDrawdown: "-58.12%", sharp: "-0.11" },
      { name: "中证短债指数", code: "H11001.CSI", type: "债券", return: "+17.92%", maxDrawdown: "-0.15%", sharp: "3.95" },
      { name: "中证短融指数", code: "H11021.CSI", type: "债券", return: "+15.12%", maxDrawdown: "0.00%", sharp: "4.12" },
      { name: "黄金Au99.99", code: "AU9999.SGE", type: "黄金", return: "+75.40%", maxDrawdown: "-14.30%", sharp: "1.65" },
      { name: "货币基金指数", code: "H11025.CSI", type: "货币", return: "+10.15%", maxDrawdown: "0.00%", sharp: "5.12" }
    ]
  };

  const activeReturns = indexPerformanceSummary[duration];

  // Colors mapping for doughnut cells
  const assetClassesSummary = [
    { name: "股票资产类 (Stocks)", value: 51.9, color: "#2563EB" },
    { name: "债券资产类 (Bonds)", value: 36.6, color: "#10B981" },
    { name: "黄金避险类 (Gold)", value: 8.5, color: "#F59E0B" },
    { name: "货币备付类 (Cash/MMF)", value: 3.0, color: "#06B6D4" },
  ];

  return (
    <div className="space-y-6" id="allocation-tab-view">
      {/* Current Asset Allocation Structure Doughnut and Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Ring Chart in col-span-5 */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="allocation-doughnut-card">
          <h3 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-1 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <PieIcon className="w-4 h-4 text-emerald-500" />
            组合当前大类资产底合配置占比（一期对齐）
          </h3>
          
          <div className="h-56 relative flex justify-center items-center">
            <ResponsiveContainer width="100%" height="95%">
              <PieChart>
                <Pie
                  data={assetClassesSummary}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={75}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {assetClassesSummary.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-[-5px]">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">股票统配</span>
              <span className="text-xl font-extrabold font-mono text-slate-950">51.90%</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-2">
            {assetClassesSummary.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-[10px] text-slate-500 px-2.5 py-1.5 bg-slate-50 border border-slate-150 rounded-lg">
                <span className="w-2.5 h-2.5 rounded hover:scale-110 duration-150 flex-shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="truncate">{item.name.replace(/\(.*?\)/, "")}</span>
                <span className="font-extrabold text-slate-900 ml-auto">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Allocation detailed breakdown in col-span-7 */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="allocation-details-table-card">
          <h3 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            持有指数标的及最新配置份额比率
          </h3>
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
              <thead>
                <tr className="border-b border-slate-150 bg-[#F8FAFC]/70 font-bold text-[10px] text-slate-450">
                  <th className="py-2.5 px-3">指数成分标的</th>
                  <th className="py-2.5 px-2">指代代码</th>
                  <th className="py-2.5 px-2">资产大类</th>
                  <th className="py-2.5 px-2 text-center">系统配置权重</th>
                  <th className="py-2.5 px-2 text-right">拟真持仓模拟额</th>
                </tr>
              </thead>
              <tbody>
                {CURRENT_ALLOCATION.map((c, i) => (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50 transition duration-100">
                    <td className="py-3 px-3 font-semibold text-slate-800">{c.name}</td>
                    <td className="py-3 px-2 font-mono text-[10px] text-slate-400">{c.code}</td>
                    <td className="py-3 px-2">
                      <span className="px-2 py-0.5 text-[9px] font-sans rounded-md bg-slate-50 border border-slate-205 text-slate-500 font-semibold">{c.type}</span>
                    </td>
                    <td className="py-3 px-2 text-center text-blue-600 font-extrabold font-mono">{c.weight}%</td>
                    <td className="py-3 px-2 text-right font-mono text-slate-600">¥{(c.weight * 10000).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Aggregate Weights Area over time */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Aggregate Asset Class weight history over time */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="aggregate-allocation-weights-card">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <AreaIcon className="w-4 h-4 text-emerald-500" />
            组合资产大类持仓比例时序流变 (按年聚合堆叠)
          </h4>
          <div className="w-full h-64 relative font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dynamicAllocationHistory} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }} />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "9px" }} />
                <Area type="monotone" name="股票 (%)" dataKey="股票" stackId="1" stroke="#2563EB" fill="#2563EB" fillOpacity={0.6} />
                <Area type="monotone" name="债券 (%)" dataKey="债券" stackId="1" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" name="黄金 (%)" dataKey="黄金" stackId="1" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
                <Area type="monotone" name="货币 (%)" dataKey="货币" stackId="1" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* All specific 5 weights stack over time */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="individual-allocation-weights-card">
          <h4 className="text-xs font-bold text-slate-800 border-b border-slate-50 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider font-extrabold">
            <AreaIcon className="w-4 h-4 text-emerald-500" />
            全部持仓指数分项时序堆叠比例历史波动
          </h4>
          <div className="w-full h-64 relative font-mono text-[10px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={indexAllocationHistory} margin={{ top: 10, right: 10, left: -25, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: "#FFFFFF", borderColor: "#E2E8F0" }} />
                <Area type="monotone" name="沪深300" dataKey="沪深300" stackId="a" fill="#3B82F6" fillOpacity={0.4} stroke="#3B82F6" />
                <Area type="monotone" name="中证2000" dataKey="中证2000" stackId="a" fill="#F59E0B" fillOpacity={0.4} stroke="#F59E0B" />
                <Area type="monotone" name="自由现金流" dataKey="自由现金流" stackId="a" fill="#06B6D4" fillOpacity={0.4} stroke="#06B6D4" />
                <Area type="monotone" name="中证短债" dataKey="中证短债" stackId="a" fill="#10B981" fillOpacity={0.4} stroke="#10B981" />
                <Area type="monotone" name="黄金Au99.99" dataKey="黄金Au99.99" stackId="a" fill="#8B5CF6" fillOpacity={0.4} stroke="#8B5CF6" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Index returns ranges interactive section */}
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="indices-term-performance-card">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-50 pb-3 mb-4 gap-4">
          <div>
            <h4 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 uppercase font-display tracking-wider font-semibold">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              各标的指数在多区间深度收益测算评估表
            </h4>
            <span className="text-[10px] text-slate-400 font-medium">
              用于核对大类指数在最近3月、6月、1年、3年或5年等不同宏观周期下的极值历史回报
            </span>
          </div>
          <div className="bg-slate-50 p-1 rounded-xl border border-slate-200/60 flex gap-0.5">
            {(["3M", "6M", "1Y", "3Y", "5Y"] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDuration(d)}
                className={`px-3 py-1 text-[10px] font-mono rounded-lg font-bold transition-all duration-150 cursor-pointer ${
                  duration === d ? "bg-white text-blue-600 border border-slate-205 shadow-sm" : "text-slate-550 hover:text-slate-800"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto w-full no-scrollbar">
          <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
            <thead>
              <tr className="border-b border-slate-150 bg-[#F8FAFC]/70 font-bold text-[10px] text-slate-500">
                <th className="py-2.5 px-3">指数成分标的</th>
                <th className="py-2.5 px-2">代码指代</th>
                <th className="py-2.5 px-2">类型</th>
                <th className="py-2.5 px-2">区间累积收益 (%)</th>
                <th className="py-2.5 px-2">期间最大回撤</th>
                <th className="py-2.5 px-2 text-right">特定夏普比率 (S)</th>
              </tr>
            </thead>
            <tbody>
              {activeReturns.map((r, i) => {
                const isPositive = r.return.startsWith("+");
                return (
                  <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 transition">
                    <td className="py-2.5 px-3 font-semibold text-slate-800">{r.name}</td>
                    <td className="py-2.5 px-2 font-mono text-slate-400 text-[10px]">{r.code}</td>
                    <td className="py-2.5 px-2 text-slate-500">{r.type}</td>
                    <td className={`py-2.5 px-2 font-mono font-bold ${isPositive ? "text-red-600" : "text-emerald-700"}`}>{r.return}</td>
                    <td className="py-2.5 px-2 font-mono text-emerald-600">{r.maxDrawdown}</td>
                    <td className="py-2.5 px-2 text-right font-mono text-slate-700">{r.sharp}</td>
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
