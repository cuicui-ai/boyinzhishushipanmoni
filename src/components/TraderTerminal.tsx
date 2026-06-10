import React, { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownRight, Wallet, TrendingUp, Landmark, ShieldCheck, CheckCircle2 } from "lucide-react";
import { IndexData, Holding } from "../types";

interface TraderTerminalProps {
  selectedIndex: IndexData;
  accountCash: number;
  currentHolding: Holding | undefined;
  onTrade: (type: "买入" | "卖出", price: number, amount: number) => void;
}

export default function TraderTerminal({ selectedIndex, accountCash, currentHolding, onTrade }: TraderTerminalProps) {
  const [tradeType, setTradeType] = useState<"买入" | "卖出">("买入");
  const [inputMethod, setInputMethod] = useState<"amount" | "shares">("amount");
  const [inputValue, setInputValue] = useState<string>("");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [successMsg, setSuccessMsg] = useState<string>("");

  useEffect(() => {
    setInputValue("");
    setErrorMsg("");
    setSuccessMsg("");
  }, [selectedIndex, tradeType]);

  const FEE_RATE = 0.0005; // 0.05%
  const MIN_FEE = 5.0; // Minimum 5 CNY mock commission fee

  const mockPrice = selectedIndex.currentValue;

  // Compute values dynamically
  let estShares = 0;
  let estTotal = 0;
  let estFee = 0;
  let finalEstValue = 0;

  if (tradeType === "买入") {
    if (inputMethod === "amount") {
      const amount = parseFloat(inputValue) || 0;
      estTotal = amount;
      if (amount > 0) {
        estFee = Math.max(MIN_FEE, amount * FEE_RATE);
        const buyableAmount = amount - estFee;
        estShares = buyableAmount > 0 ? parseFloat((buyableAmount / mockPrice).toFixed(3)) : 0;
        finalEstValue = amount;
      }
    } else {
      const shares = parseFloat(inputValue) || 0;
      estShares = shares;
      if (shares > 0) {
        const netValue = shares * mockPrice;
        estFee = Math.max(MIN_FEE, netValue * FEE_RATE);
        estTotal = netValue + estFee;
        finalEstValue = estTotal;
      }
    }
  } else {
    // Sell
    if (inputMethod === "shares") {
      const shares = parseFloat(inputValue) || 0;
      estShares = shares;
      if (shares > 0) {
        const value = shares * mockPrice;
        estFee = Math.max(MIN_FEE, value * FEE_RATE);
        estTotal = value - estFee;
        finalEstValue = estTotal;
      }
    } else {
      const amount = parseFloat(inputValue) || 0;
      estTotal = amount;
      if (amount > 0) {
        estFee = Math.max(MIN_FEE, amount * FEE_RATE);
        const rawValue = amount + estFee;
        estShares = parseFloat((rawValue / mockPrice).toFixed(3));
        finalEstValue = amount;
      }
    }
  }

  function handlePercentSelect(pct: number) {
    setErrorMsg("");
    setSuccessMsg("");
    if (tradeType === "买入") {
      setInputMethod("amount");
      const targetAmount = accountCash * pct;
      setInputValue(targetAmount > 10 ? Math.floor(targetAmount).toString() : "0");
    } else {
      setInputMethod("shares");
      const ownedShares = currentHolding?.shares || 0;
      const targetShares = ownedShares * pct;
      setInputValue(targetShares > 0 ? parseFloat(targetShares.toFixed(3)).toString() : "0");
    }
  }

  function executeTrade() {
    setErrorMsg("");
    setSuccessMsg("");
    const numericVal = parseFloat(inputValue) || 0;

    if (numericVal <= 0) {
      setErrorMsg("请输入有效的交易数值");
      return;
    }

    if (tradeType === "买入") {
      let cashNeeded = estTotal;
      if (inputMethod === "amount") {
         cashNeeded = numericVal;
      }

      if (cashNeeded > accountCash) {
        setErrorMsg(`实盘可用模拟资金不足（尚缺 ${(cashNeeded - accountCash).toFixed(2)} 元）`);
        return;
      }

      if (estShares < 0.001) {
        setErrorMsg("买入份额极低，无法达成成交");
        return;
      }

      onTrade("买入", mockPrice, estShares);
      setSuccessMsg(`🚀 模拟委成！已成功买入 ${estShares} 份 ${selectedIndex.name}`);
      setInputValue("");
    } else {
      // Sell
      let sharesToSell = estShares;
      if (inputMethod === "shares") {
        sharesToSell = numericVal;
      }

      const ownedShares = currentHolding?.shares || 0;
      if (sharesToSell > ownedShares) {
        setErrorMsg(`当前持仓份额不足，您最多能卖出 ${ownedShares} 份`);
        return;
      }

      onTrade("卖出", mockPrice, sharesToSell);
      setSuccessMsg(`✅ 模拟委成！已成功卖出 ${sharesToSell} 份 ${selectedIndex.name}`);
      setInputValue("");
    }
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col h-[540px] relative justify-between shadow-sm animate-fade-in font-sans" id="trader-terminal-card">
      <div>
        {/* Title */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Landmark className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-sm font-extrabold text-slate-900 font-display">实盘模拟交易终端</span>
          </div>
          <span className="text-[10px] text-slate-450 font-mono flex items-center gap-1 font-bold bg-slate-50 px-2 py-0.5 border border-slate-200 rounded">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            勃银中央拟真撮合引擎
          </span>
        </div>

        {/* Trade Type Tabs */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          <button
            onClick={() => setTradeType("买入")}
            id="buy-tab-btn"
            className={`py-2 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
              tradeType === "买入"
                ? "bg-red-50 border border-red-200 text-red-650 font-bold shadow-sm"
                : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowUpRight className="w-4 h-4" />
            买入建仓 (多)
          </button>
          <button
            onClick={() => setTradeType("卖出")}
            id="sell-tab-btn"
            className={`py-2 text-xs font-extrabold rounded-xl flex items-center justify-center gap-1.5 transition-all duration-150 cursor-pointer ${
              tradeType === "卖出"
                ? "bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold shadow-sm"
                : "bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800"
            }`}
          >
            <ArrowDownRight className="w-4 h-4" />
            卖出平仓 (空)
          </button>
        </div>

        {/* Balance Indicators */}
        <div className="grid grid-cols-2 gap-3.5 p-3.5 bg-slate-50 rounded-xl border border-slate-150 mb-4 shadow-inner">
          <div className="flex flex-col gap-0.5">
            <span className="text-[10px] text-slate-450 flex items-center gap-1 font-bold">
              <Wallet className="w-3 h-3 text-slate-400" />
              当前可用资金
            </span>
            <span className="text-xs font-extrabold font-mono text-slate-800">
              ¥ {accountCash.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </div>
          <div className="flex flex-col gap-0.5 border-l border-slate-200 pl-3.5">
            <span className="text-[10px] text-slate-450 flex items-center gap-1 font-bold">
              <TrendingUp className="w-3 h-3 text-slate-400" />
              当前持仓份额
            </span>
            <span className="text-xs font-extrabold font-mono text-slate-800">
              {currentHolding?.shares.toFixed(3) || "0.000"} 份
            </span>
          </div>
        </div>

        {/* Amount Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1.5">
            <label className="text-[11px] text-slate-500 font-bold">
              {tradeType === "买入"
                ? `买入${inputMethod === "amount" ? "模拟金额 (CNY)" : "指数估算份额"}`
                : `卖出${inputMethod === "shares" ? "指数份额 (份)" : "估算金额 (CNY)"}`}
            </label>
            <button
              onClick={() => {
                setInputMethod((prev) => (prev === "amount" ? "shares" : "amount"));
                setInputValue("");
                setErrorMsg("");
              }}
              id="switch-unit-btn"
              className="text-[10px] text-blue-600 hover:text-blue-700 font-bold transition cursor-pointer"
            >
              切换为 {inputMethod === "amount" ? "份额计价" : "金额计价"}
            </button>
          </div>
          <div className="relative">
            <input
              type="number"
              id="trade-numeric-input"
              value={inputValue}
              onChange={(e) => {
                setErrorMsg("");
                setSuccessMsg("");
                setInputValue(e.target.value);
              }}
              placeholder={inputMethod === "amount" ? "最低 100" : "例如 500.0"}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl text-slate-800 font-mono text-xs px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:bg-white transition"
            />
            <span className="absolute right-3.5 top-2.5 text-xs text-slate-400 font-mono font-semibold">
              {inputMethod === "amount" ? "元" : "份"}
            </span>
          </div>
        </div>

        {/* Quick Percent Buttons */}
        <div className="grid grid-cols-4 gap-1.5 mb-4.5" id="quick-percent-buttons">
          {[0.10, 0.25, 0.50, 1.00].map((pct) => (
            <button
              key={pct}
              onClick={() => handlePercentSelect(pct)}
              className="text-[10px] font-mono font-extrabold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 py-1 rounded-xl transition duration-100 cursor-pointer"
            >
              {pct * 100}%
            </button>
          ))}
        </div>

        {/* Order Estimates */}
        <div className="space-y-2 border-t border-slate-100 pt-3.5" id="order-estimate-details">
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-450 font-semibold">交易指数现值</span>
            <span className="font-mono text-slate-650 font-bold">¥ {mockPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-450 font-semibold">
              {tradeType === "买入" ? "估算买入份额" : "估算返还金额"}
            </span>
            <span className="font-mono text-slate-800 font-bold">
              {tradeType === "买入"
                ? `${estShares.toFixed(3)} 份`
                : `¥ ${estTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </span>
          </div>
          <div className="flex justify-between text-[11px]">
            <span className="text-slate-450 font-semibold">交易佣金扣费 (0.05%)</span>
            <span className="font-mono text-slate-450">¥ {estFee.toFixed(2)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-100 pt-2 text-xs">
            <span className="text-slate-600 font-bold">订单估算总额</span>
            <span className="font-mono text-amber-650 font-black">
              ¥ {finalEstValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}
            </span>
          </div>
        </div>
      </div>

      {/* Messages & Actions at current bottom */}
      <div className="mt-4">
        {errorMsg && (
          <div className="text-[11px] text-red-700 bg-red-50 border border-red-200 p-2.5 rounded-lg mb-3">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-250 p-2.5 rounded-lg mb-3 flex items-start gap-1.5 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{successMsg}</span>
          </div>
        )}

        <button
          onClick={executeTrade}
          id="trade-submit-button"
          className={`w-full py-2.5 rounded-xl text-xs font-bold transition duration-150 cursor-pointer ${
            tradeType === "买入"
              ? "bg-red-650 hover:bg-red-700 text-white shadow-sm shadow-red-550/10"
              : "bg-emerald-650 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-550/10"
          }`}
        >
          {tradeType === "买入" ? "提交买入申请 (模拟委托)" : "提交卖出申请 (模拟委托)"}
        </button>
      </div>
    </div>
  );
}
