import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, Legend, BarChart, Bar } from "recharts";
import { TrendingUp, Award, ShieldCheck, PieChart, Users, ArrowUpRight, ArrowDownRight, CircleCheck } from "lucide-react";
import { IndexData, IndexId } from "../types";
import { PORTFOLIO_HISTORY, CONTRIB_YEARLY_DATA, CURRENT_ALLOCATION } from "../mockData";

interface OverviewTabProps {
  indices: IndexData[];
  onSelectIndex: (id: IndexId) => void;
  onSwitchTab: () => void;
}

export default function OverviewTab({ indices, onSelectIndex, onSwitchTab }: OverviewTabProps) {
  // Hardcoded key indices matching spec 4.1
  const kpis = [
    { label: "累计收益率", value: "148.50%", change: "+115.30%", desc: "超额基准", isBetter: true },
    { label: "年化收益率(Rf=0.95%)", value: "8.50%", change: "+3.70%", desc: "超额主动收益", isBetter: true },
    { label: "年化波动率", value: "6.25%", change: "-12.80%", desc: "基准对比", isBetter: true },
    { label: "夏普比率 (Sharpe)", value: "0.96", change: "+0.66", desc: "基准值 (0.30)", isBetter: true },
    { label: "最大回撤 (MDD)", value: "3.47%", change: "-21.84%", desc: "基准值 (25.31%)", isBetter: true },
    { label: "卡玛比率 (Calmar)", value: "2.45", change: "+2.26", desc: "收益/回撤比", isBetter: true },
    { label: "周胜率 (Weekly)", value: "58.4%", change: "+10.2%", desc: "周度胜率表现", isBetter: true },
  ];

  return (
    <div className="space-y-6" id="overview-tab-view">
      {/* Hero KPIs Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3.5" id="hero-kpis-grid">
        {kpis.map((k, i) => (
          <div
            key={i}
            className="bg-white border border-slate-100 rounded-xl p-4 flex flex-col justify-between hover:shadow-md hover:scale-[1.02] transition-all duration-200 shadow-sm"
            id={`kpi-card-${i}`}
          >
            <div>
              <span className="text-[11px] text-slate-500 font-semibold tracking-wide block mb-1">{k.label}</span>
              <div className="text-xl font-extrabold tracking-tight text-slate-900 font-display">{k.value}</div>
            </div>
            <div className="border-t border-slate-100 pt-2.5 mt-2.5 flex items-center justify-between text-[10px]">
              <span className={`font-bold font-mono px-1.5 py-0.5 rounded ${
                k.change.startsWith("+") 
                  ? "bg-red-50 text-red-650 border border-red-100/30" 
                  : "bg-emerald-50 text-emerald-650 border border-emerald-100/30"
              }`}>{k.change}</span>
              <span className="text-slate-400 font-medium">{k.desc}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Main Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Cumulative performance line */}
        <div className="lg:col-span-7 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="portfolio-vs-benchmark-card">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 border-b border-slate-50 pb-4">
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-display tracking-wide">
                <TrendingUp className="w-4 h-4 text-blue-600" />
                渤银理化组合 vs 沪深300基准：累计收益走势
              </h3>
              <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
                10年期历史模拟航线（2016.01 — 2026.05）
              </span>
            </div>
            <div className="flex gap-4 font-mono text-[10px] text-slate-500">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-blue-600 rounded-sm"></span>渤银指数组合 (+148.5%)</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-1 bg-rose-450 rounded-sm"></span>沪深300基准 (+33.0%)</span>
            </div>
          </div>
          
          <div className="w-full h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={PORTFOLIO_HISTORY} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorPort" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2172E7" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="#2172E7" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="date" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} domain={["dataMin - 5", "dataMax + 5"]} />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E2E8F0", 
                    borderRadius: "12px", 
                    fontSize: "12px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)"
                  }}
                  itemStyle={{ color: "#1E293B" }}
                  labelStyle={{ fontWeight: "bold", color: "#64748B" }}
                />
                <Area type="monotone" name="渤银模拟组合" dataKey="navPort" stroke="#2172E7" strokeWidth={2.4} fillOpacity={1} fill="url(#colorPort)" />
                <Area type="monotone" name="沪深300基准" dataKey="navBench" stroke="#EA4A4A" strokeWidth={1.2} fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Yearly stacked returns */}
        <div className="lg:col-span-5 bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="contrib-overview-card">
          <div className="flex flex-col mb-6 border-b border-slate-50 pb-4">
            <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-1.5 font-display tracking-wide">
              <Award className="w-4 h-4 text-amber-500" />
              年度大类资产收益贡献概况
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              各构成类目累计分摊贡献 (债券/股票/货币基金/黄金) 对齐年度表现
            </span>
          </div>

          <div className="w-full h-80 relative">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONTRIB_YEARLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="year" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "#FFFFFF", 
                    borderColor: "#E2E8F0", 
                    borderRadius: "12px", 
                    fontSize: "11px",
                    boxShadow: "0 10px 15px -3px rgba(0,0,0,0.05)" 
                  }} 
                  itemStyle={{ color: "#1E293B" }}
                  labelStyle={{ fontWeight: "bold" }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: "10px", marginTop: "10px" }} />
                <Bar name="股票贡献" dataKey="stock" stackId="a" fill="#1E3A8A" radius={[0, 0, 0, 0]} />
                <Bar name="债券贡献" dataKey="bond" stackId="a" fill="#10B981" radius={[0, 0, 0, 0]} />
                <Bar name="黄金贡献" dataKey="gold" stackId="a" fill="#F59E0B" radius={[0, 0, 0, 0]} />
                <Bar name="货基贡献" dataKey="mmf" stackId="a" fill="#06B6D4" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Tables section: Performance and Holdings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="overview-tables-row">
        {/* Performance summary table */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between" id="perf-summary-card">
          <div>
            <span className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
              <ShieldCheck className="w-4.5 h-4.5 text-emerald-500" />
              渤银生态大类对冲 绩效概览与基准比对表
            </span>
            <div className="overflow-x-auto w-full no-scrollbar">
              <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-bold bg-[#F8FAFC]/70 text-[10px]">
                    <th className="py-3 px-3">比较维度</th>
                    <th className="py-3 px-2">年化收益 (%)</th>
                    <th className="py-3 px-2">最大回撤 (%)</th>
                    <th className="py-3 px-2">年化波动 (%)</th>
                    <th className="py-3 px-2">夏普比率 (S)</th>
                    <th className="py-3 px-2 text-right">卡玛比率 (C)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition duration-150 font-bold text-slate-900">
                    <td className="py-3 px-3 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
                      渤银指数组合
                    </td>
                    <td className="py-3 px-2 text-red-600">8.50%</td>
                    <td className="py-3 px-2 text-emerald-600">3.47%</td>
                    <td className="py-3 px-2">6.25%</td>
                    <td className="py-3 px-2">0.96</td>
                    <td className="py-3 px-2 text-right text-slate-900">2.45</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition duration-150">
                    <td className="py-3 px-3 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-rose-500 rounded-full"></span>
                      股票基准(沪深300)
                    </td>
                    <td className="py-3 px-2 text-red-650">4.80%</td>
                    <td className="py-3 px-2 text-red-650">25.31%</td>
                    <td className="py-3 px-2">12.80%</td>
                    <td className="py-3 px-2">0.30</td>
                    <td className="py-3 px-2 text-right">0.19</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition duration-150">
                    <td className="py-3 px-3 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      债券基准(中证短债)
                    </td>
                    <td className="py-3 px-2 text-red-655">3.20%</td>
                    <td className="py-3 px-2 text-emerald-650">0.15%</td>
                    <td className="py-3 px-2">0.45%</td>
                    <td className="py-3 px-2">2.50</td>
                    <td className="py-3 px-2 text-right text-emerald-600">21.32</td>
                  </tr>
                  <tr className="border-b border-slate-100 hover:bg-slate-50 transition duration-150">
                    <td className="py-3 px-3 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 bg-yellow-500 rounded-full"></span>
                      黄金基准(AU9999)
                    </td>
                    <td className="py-3 px-2 text-red-650">7.20%</td>
                    <td className="py-3 px-2 text-red-650">14.30%</td>
                    <td className="py-3 px-2">11.40%</td>
                    <td className="py-3 px-2">0.55</td>
                    <td className="py-3 px-2 text-right">0.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-[10px] text-slate-500 leading-relaxed font-sans flex items-center gap-2">
            <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
            <span>
              <strong>组合基本配置信息</strong>：成立投运时间为 **2016-01-04**，累计运行天数达 **3,720 天**。管理方为 <u>渤银量化研究中心</u>。当前系统总模拟本金准备就绪。
            </span>
          </div>
        </div>

        {/* Current holdings list table */}
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="portfolio-composition-card">
          <span className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-3 mb-4 flex items-center gap-1.5 uppercase font-display tracking-wider">
            <PieChart className="w-4.5 h-4.5 text-blue-600" />
            组合最新 8 只对冲指数底仓及配置明细
          </span>
          <div className="overflow-x-auto w-full no-scrollbar">
            <table className="w-full text-left border-collapse font-sans text-xs text-slate-650">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-bold bg-[#F8FAFC]/70 text-[10px]">
                  <th className="py-3 px-3">指数底仓名称</th>
                  <th className="py-3 px-2">指代代码</th>
                  <th className="py-3 px-2">指数类型</th>
                  <th className="py-3 px-2">当前模拟净值</th>
                  <th className="py-3 px-2">推荐配置权重</th>
                  <th className="py-3 px-2 text-right">拟真交易入口</th>
                </tr>
              </thead>
              <tbody>
                {CURRENT_ALLOCATION.map((a, i) => {
                  const correlatedIdx = indices.find(ind => ind.id === a.code.split(".")[0] as any) || indices[i % indices.length];
                  return (
                    <tr
                      key={i}
                      className="border-b border-slate-100 hover:bg-slate-50 transition duration-150"
                    >
                      <td className="py-3 px-3 font-semibold text-slate-800">{a.name}</td>
                      <td className="py-3 px-2 font-mono text-[10px] text-slate-400">{a.code}</td>
                      <td className="py-3 px-2 text-slate-500">{a.type}</td>
                      <td className="py-3 px-2 font-mono text-slate-800 font-bold">
                        {correlatedIdx ? correlatedIdx.currentValue.toFixed(2) : "100.00"}
                      </td>
                      <td className="py-3 px-2 text-blue-600 font-mono font-extrabold">{a.weight}%</td>
                      <td className="py-3 px-2 text-right">
                        <button
                          onClick={() => {
                            onSelectIndex(correlatedIdx.id);
                            onSwitchTab();
                          }}
                          className="text-[10px] bg-blue-50 text-blue-600 border border-blue-200 hover:bg-[#2172E7] hover:text-white hover:border-[#2172E7] font-bold px-2.5 py-1 rounded-md transition-all duration-150 cursor-pointer"
                        >
                          配置权重
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
