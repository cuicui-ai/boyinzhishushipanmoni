import React, { useState, useEffect } from "react";
import {
  Atom,
  RefreshCw,
  LayoutGrid,
  TrendingUp,
  Award,
  ShieldCheck,
  PieChart,
  BookOpen
} from "lucide-react";

import { IndexData, IndexId, Holding, Transaction } from "./types";
import { INITIAL_INDICES } from "./mockData";

import OverviewTab from "./components/OverviewTab";
import ReturnsTab from "./components/ReturnsTab";
import AttributionTab from "./components/AttributionTab";
import RiskTab from "./components/RiskTab";
import AllocationTab from "./components/AllocationTab";
import RebalanceTab from "./components/RebalanceTab";
import MetricsInfoTab from "./components/MetricsInfoTab";

export default function App() {
  // 1. Initial configuration loading
  const [indices, setIndices] = useState<IndexData[]>(() => {
    const saved = localStorage.getItem("hc_sim_indices");
    return saved ? JSON.parse(saved) : INITIAL_INDICES;
  });

  const [selectedId, setSelectedId] = useState<IndexId>(IndexId.HS300);

  const [cash, setCash] = useState<number>(() => {
    const saved = localStorage.getItem("hc_sim_cash");
    return saved ? parseFloat(saved) : 1000000.00;
  });

  const [holdings, setHoldings] = useState<Holding[]>(() => {
    const saved = localStorage.getItem("hc_sim_holdings");
    return saved ? JSON.parse(saved) : [];
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem("hc_sim_transactions");
    return saved ? JSON.parse(saved) : [];
  });

  // UI Navigation Control Workspace (7 Tabs layout matching spec section 3)
  const [activeTab, setActiveTab] = useState<"overview" | "returns" | "attribution" | "risk" | "allocation" | "rebalance" | "readme">("overview");

  // Beijing Clock state
  const [beijingClock, setBeijingClock] = useState("");

  const selectedIndex = indices.find((ind) => ind.id === selectedId) || indices[0];
  const activeHolding = holdings.find((h) => h.indexId === selectedId);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem("hc_sim_indices", JSON.stringify(indices));
  }, [indices]);

  useEffect(() => {
    localStorage.setItem("hc_sim_cash", cash.toString());
  }, [cash]);

  useEffect(() => {
    localStorage.setItem("hc_sim_holdings", JSON.stringify(holdings));
  }, [holdings]);

  useEffect(() => {
    localStorage.setItem("hc_sim_transactions", JSON.stringify(transactions));
  }, [transactions]);

  // Clock Update Effect (Beijing Zone)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Shanghai",
        hour12: false,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      };
      setBeijingClock(new Intl.DateTimeFormat("zh-CN", options).format(now));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Soft market fluctuation tick generator (updates every 5 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setIndices((prevIndices) => {
        return prevIndices.map((ind) => {
          // Volatility scale based on assets classification
          let vol = 0.0018; 
          if (ind.id === IndexId.HSTECH || ind.id === IndexId.ZZ2000) vol = 0.0035; // tech, small-cap high vol
          if (ind.id === IndexId.SD || ind.id === IndexId.CP) vol = 0.0003; // bonds ultra low vol
          if (ind.id === IndexId.MMF) vol = 0.0001; // cash MM

          const percentChange = (Math.random() - 0.485) * vol;
          const newValue = parseFloat((ind.currentValue * (1 + percentChange)).toFixed(2));
          const changeVal = parseFloat((newValue - ind.launchValue).toFixed(2));
          const changeRate = parseFloat(((newValue - ind.launchValue) / ind.launchValue * 100).toFixed(2));

          const updated24h = [...ind.history24h];
          if (updated24h.length > 0) {
            const now = new Date();
            const timeStr = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
            updated24h[updated24h.length - 1] = { date: timeStr, value: newValue };
          }

          return {
            ...ind,
            currentValue: newValue,
            changeValue: changeVal,
            changeRate,
            high: newValue > ind.high ? newValue : ind.high,
            low: newValue < ind.low ? newValue : ind.low,
            history24h: updated24h
          };
        });
      });
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Align holdings cost evaluation dynamically
  useEffect(() => {
    setHoldings((prevHoldings) => {
      let changed = false;
      const updated = prevHoldings.map((h) => {
        const liveInd = indices.find((ind) => ind.id === h.indexId);
        if (liveInd) {
          const liveValue = parseFloat((h.shares * liveInd.currentValue).toFixed(2));
          const profitVal = parseFloat((liveValue - h.shares * h.avgCost).toFixed(2));
          const profitRate = parseFloat(((liveInd.currentValue - h.avgCost) / h.avgCost * 100).toFixed(2));

          if (liveValue !== h.currentValue || profitVal !== h.profitVal || profitRate !== h.profitRate) {
            changed = true;
            return {
              ...h,
              currentValue: liveValue,
              profitVal,
              profitRate
            };
          }
        }
        return h;
      });
      return changed ? updated : prevHoldings;
    });
  }, [indices]);

  // Aggregate stats
  const portfolioValue = holdings.reduce((sum, h) => sum + h.currentValue, 0);
  const totalAssets = cash + portfolioValue;
  const initialFunds = 1000000.00;
  const totalProfit = totalAssets - initialFunds;
  const totalProfitPercent = (totalProfit / initialFunds) * 100;

  // Trading execution engine
  function handleExecuteTrade(type: "买入" | "卖出", price: number, shares: number) {
    const totalCost = parseFloat((shares * price).toFixed(2));
    const fee = Math.max(5.0, parseFloat((totalCost * 0.0004).toFixed(2))); // 万四费用

    if (type === "买入") {
      const netDebit = parseFloat((totalCost + fee).toFixed(2));
      if (netDebit > cash) {
        alert("可用资金余额不足以支付买入对冲单！");
        return;
      }
      setCash((prevCash) => parseFloat((prevCash - netDebit).toFixed(2)));

      setHoldings((prevHoldings) => {
        const existing = prevHoldings.find((h) => h.indexId === selectedId);
        if (existing) {
          const totalShares = existing.shares + shares;
          const totalCostBasis = (existing.shares * existing.avgCost) + totalCost;
          const avgCost = parseFloat((totalCostBasis / totalShares).toFixed(4));
          return prevHoldings.map((h) =>
            h.indexId === selectedId
              ? {
                  ...h,
                  shares: totalShares,
                  avgCost: avgCost,
                  currentValue: parseFloat((totalShares * price).toFixed(2)),
                  profitVal: parseFloat((totalShares * price - totalCostBasis).toFixed(2)),
                  profitRate: parseFloat(((price - avgCost) / avgCost * 100).toFixed(2))
                }
              : h
          );
        } else {
          return [
            ...prevHoldings,
            {
              indexId: selectedId,
              indexName: selectedIndex.name,
              code: selectedIndex.code,
              shares: shares,
              avgCost: price,
              currentValue: totalCost,
              profitVal: 0,
              profitRate: 0
            }
          ];
        }
      });
    } else {
      // Sell action
      if (!activeHolding || activeHolding.shares < shares) {
        alert("可售持股份额不足！");
        return;
      }
      const netCredit = parseFloat((totalCost - fee).toFixed(2));
      setCash((prevCash) => parseFloat((prevCash + netCredit).toFixed(2)));

      setHoldings((prevHoldings) => {
        const existing = prevHoldings.find((h) => h.indexId === selectedId);
        if (!existing) return prevHoldings;

        const newShares = parseFloat((existing.shares - shares).toFixed(3));
        if (newShares <= 0) {
          return prevHoldings.filter((h) => h.indexId !== selectedId);
        } else {
          const originalCostBasis = existing.shares * existing.avgCost;
          const partialCostBasis = (originalCostBasis / existing.shares) * newShares;
          const liveValue = parseFloat((newShares * price).toFixed(2));
          return prevHoldings.map((h) =>
            h.indexId === selectedId
              ? {
                  ...h,
                  shares: newShares,
                  currentValue: liveValue,
                  profitVal: parseFloat((liveValue - partialCostBasis).toFixed(2)),
                  profitRate: parseFloat(((price - h.avgCost) / h.avgCost * 100).toFixed(2))
                }
              : h
          );
        }
      });
    }

    // Record trade contract receipt
    const newTx: Transaction = {
      id: "TX-" + Math.floor(100000 + Math.random() * 900000),
      time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
      indexId: selectedId,
      indexName: selectedIndex.name,
      type: type,
      price: price,
      shares: shares,
      totalAmount: totalCost,
      fee: fee
    };
    setTransactions((prev) => [newTx, ...prev]);
  }

  // Account reset operation
  function handleResetSimulation() {
    if (window.confirm("确定要重置整个理投模拟舱的所有交易、持仓与账目数据吗？数据将恢复初始一阶值。")) {
      setCash(1000000.00);
      setHoldings([]);
      setTransactions([]);
      setIndices(INITIAL_INDICES);
      localStorage.clear();
      alert("模拟舱账户数据重置完毕。");
    }
  }

  // A-shares Color Palette Helpers (Red is Up, Green is Down)
  const getRateColor = (num: number) => (num >= 0 ? "text-red-500 font-bold" : "text-emerald-600 font-bold");
  const getRateColorBg = (num: number) => (num >= 0 ? "bg-red-50 text-red-600 border border-red-200/50" : "bg-emerald-50 text-emerald-600 border border-emerald-200/50");
  const getSign = (num: number) => (num >= 0 ? "+" : "");

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900" id="boyin-index-app-root">
      
      {/* 🚀 Top Navigation Header (#153673 background as specified) */}
      <header className="bg-[#153673] px-6 py-4 flex flex-col xl:flex-row items-center justify-between gap-4 lg:sticky lg:top-0 lg:z-50 shadow-md border-b border-blue-900/60 text-white">
        
        {/* Brand System Info */}
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 bg-gradient-to-tr from-[#2172E7] to-[#30BEF0] rounded-xl flex items-center justify-center border border-sky-400/35 shadow shadow-sky-500/10">
            <Atom className="w-5 h-5 text-white animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold tracking-wide font-sans">
                渤银指数实盘模拟
              </h1>
              <span className="text-[9px] bg-sky-400 text-slate-950 px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                V3.0 专业舱
              </span>
            </div>
            <div className="text-[10px] text-blue-200/80 font-mono tracking-wide flex items-center gap-2 mt-0.5">
              <span>汇成对冲因子底座支撑</span>
              <span>•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></span>
                模拟行情连线正常 (TICK 5"s)
              </span>
            </div>
          </div>
        </div>

        {/* Info & Administration clock */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleResetSimulation}
            className="bg-sky-700/60 hover:bg-sky-600/60 border border-sky-400/25 text-white p-2.5 rounded-lg flex items-center justify-center transition active:scale-95 duration-100 cursor-pointer"
            title="一键重置账户"
          >
            <RefreshCw className="w-4 h-4 text-white" />
          </button>
        </div>
      </header>

      {/* 📋 Horizontal navigation for the 7 Tabs (Section 3 of Spec) */}
      <nav className="bg-white border-b border-slate-200 px-6 py-2 flex items-center justify-between sticky top-[72px] z-40 shadow-sm" id="main-navigation-seven-tabs">
        <div className="flex gap-1 overflow-x-auto no-scrollbar py-1">
          {[
            { id: "overview", label: "指标总览 (Overview)", icon: LayoutGrid },
            { id: "returns", label: "收益类指标 (Returns)", icon: TrendingUp },
            { id: "attribution", label: "归因分析指标 (Attribution)", icon: Award },
            { id: "risk", label: "风险类指标 (Risk Profile)", icon: ShieldCheck },
            { id: "allocation", label: "配置收益 (Allocation)", icon: PieChart },
            { id: "rebalance", label: "调仓行为指标 (Rebalance)", icon: RefreshCw },
            { id: "readme", label: "指标精算说明 (Formulas Book)", icon: BookOpen },
          ].map((item) => {
            const IconComp = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as any)}
                className={`flex items-center gap-2 px-4.5 py-2 text-xs font-semibold rounded-lg cursor-pointer transition-all duration-150 border whitespace-nowrap ${
                  isActive
                    ? "bg-[#2172E7]/10 border-[#2172E7] text-[#2172E7] font-bold shadow-sm"
                    : "bg-transparent border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                }`}
              >
                <IconComp className="w-4 h-4 flex-shrink-0" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>


      </nav>

      {/* 📊 Main contents with full workspace layout */}
      <div className="flex-1 px-6 py-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start" id="app-workspace-flow">
        
        {/* LEFT COMPONENT: Full width workspace */}
        <div className="col-span-12 transition-all duration-300 ease-in-out">
          
          {/* Active selection index header tip */}
          <div className="bg-[#2172E7]/5 border border-[#2172E7]/20 p-4.5 rounded-xl mb-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-inner">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-[#2172E7] rounded-full flex-shrink-0"></span>
              <p className="text-xs text-slate-700 font-sans leading-relaxed">
                当前核心调试标的为：<strong className="text-slate-900 font-bold">{selectedIndex.name} ({selectedIndex.code})</strong> • 最新拟真点数 <strong className="font-mono text-blue-600">{selectedIndex.currentValue.toFixed(2)}</strong> ({selectedIndex.changeRate >= 0 ? "+" : ""}{selectedIndex.changeRate.toFixed(2)}%)
              </p>
            </div>
            
            {/* Index rapid selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] text-slate-400 font-sans">点击快速切换调试标的:</span>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value as IndexId)}
                className="bg-white border border-slate-300 text-slate-800 text-xs px-2.5 py-1 rounded-md font-sans outline-none focus:border-blue-500"
              >
                {indices.map((ind) => (
                  <option key={ind.id} value={ind.id}>
                    {ind.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm min-h-[500px]">
            {activeTab === "overview" && (
              <OverviewTab
                indices={indices}
                onSelectIndex={(id) => setSelectedId(id)}
                onSwitchTab={() => {
                  setActiveTab("rebalance");
                }}
              />
            )}
            {activeTab === "returns" && <ReturnsTab />}
            {activeTab === "attribution" && <AttributionTab />}
            {activeTab === "risk" && <RiskTab />}
            {activeTab === "allocation" && <AllocationTab />}
            {activeTab === "rebalance" && <RebalanceTab />}
            {activeTab === "readme" && <MetricsInfoTab />}
          </div>
        </div>
      </div>


    </div>
  );
}
