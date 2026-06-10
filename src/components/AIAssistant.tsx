import React, { useState } from "react";
import { Send, Sparkles, TrendingUp, AlertTriangle, Cpu, CircleHelp } from "lucide-react";
import { IndexData, Holding } from "../types";

interface AIAssistantProps {
  selectedIndex: IndexData;
  holdings: Holding[];
  accountCash: number;
}

export default function AIAssistant({ selectedIndex, holdings, accountCash }: AIAssistantProps) {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string }>>([
    {
      sender: "ai",
      text: `您好！我是渤银系列指数【AI专属投顾助理】。欢迎来到实盘模拟舱！\n我将实时跟踪 **${selectedIndex.name}** 及您的整体资配结构。\n\n💡 **您可以直接询问我如下量化策略：**\n1. 中短期趋势预测及仓位控制建议？\n2. 针对本指数如何设置智能网格交易？\n3. 我的模拟持仓健康度诊断。`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const presets = [
    { label: "中短期大盘研判", prompt: "请针对当前市场波动状态，对本指数的中短期走势进行全方位研判。" },
    { label: "网格交易实战参数", prompt: "如果我想对该指数进行网格交易，根据目前的高低净值，合理的上下区间及格子密度该如何设置？" },
    { label: "模拟组合健康度", prompt: "根据我当前的持仓结构与资金配置，分析资产包的安全边界与回撤防护建议。" },
  ];

  async function handleSend(textToSend: string) {
    if (!textToSend.trim() || loading) return;

    const userMsg = textToSend;
    setInput("");
    setMessages((prev) => [...prev, { sender: "user", text: userMsg }]);
    setLoading(true);

    try {
      const response = await fetch("/api/gemini/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          indexName: selectedIndex.fullName,
          holdings: holdings,
          question: userMsg,
          marketState: {
            selectedIndexCurrentValue: selectedIndex.currentValue,
            changeRate: selectedIndex.changeRate,
            high: selectedIndex.high,
            low: selectedIndex.low,
            cash: accountCash,
          },
        }),
      });

      if (!response.ok) {
        throw new Error("模型响应出错，请检查接口或Secrets配置");
      }

      const data = await response.json();
      setMessages((prev) => [...prev, { sender: "ai", text: data.analysis }]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `⚠️ **智控助理连接异常**: ${err.message || "无法拉取智能分析。"}\n请确认您在【Settings > Secrets】中正确配置了密钥 \`GEMINI_API_KEY\`。`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  // Beautiful, lightweight custom parser helper to render basic market markdown elegantly
  function renderMarkdown(text: string) {
    return text.split("\n").map((line, idx) => {
      let trimmed = line.trim();

      // Heading 3
      if (trimmed.startsWith("###")) {
        return (
          <h4 key={idx} className="text-slate-800 font-bold text-xs mt-3.5 mb-1.5 flex items-center gap-1.5 border-b border-slate-100 pb-1" id={`heading3-${idx}`}>
            <Cpu className="w-3.5 h-3.5 text-blue-600" />
            {trimmed.replace("###", "").trim()}
          </h4>
        );
      }
      // Heading 2
      if (trimmed.startsWith("##")) {
        return (
          <h3 key={idx} className="text-slate-900 font-extrabold text-sm mt-4 mb-2 flex items-center gap-1.5 border-l-2 border-blue-600 pl-2" id={`heading2-${idx}`}>
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {trimmed.replace("##", "").trim()}
          </h3>
        );
      }
      // Heading 1
      if (trimmed.startsWith("#")) {
        return (
          <h2 key={idx} className="text-slate-900 font-black text-base mt-4.5 mb-2.5 uppercase tracking-wide border-b border-slate-200 pb-1" id={`heading1-${idx}`}>
            {trimmed.replace("#", "").trim()}
          </h2>
        );
      }
      // Divider
      if (trimmed === "---") {
        return <hr key={idx} className="border-slate-200 my-4" id={`hr-${idx}`} />;
      }
      // List item
      if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
        const content = trimmed.substring(2);
        return (
          <li key={idx} className="text-xs text-slate-650 ml-4 list-disc space-y-1 my-1 leading-relaxed" id={`li-${idx}`}>
            {parseInlineStyling(content)}
          </li>
        );
      }
      if (trimmed.match(/^\d+\.\s/)) {
        const content = trimmed.replace(/^\d+\.\s/, "");
        const num = trimmed.match(/^\d+/)?.[0] || "1";
        return (
          <div key={idx} className="text-xs text-slate-650 flex gap-2 my-1.5 leading-relaxed" id={`num-list-${idx}`}>
            <span className="text-blue-600 font-bold font-mono">{num}.</span>
            <span>{parseInlineStyling(content)}</span>
          </div>
        );
      }

      // Default paragraph
      if (trimmed === "") {
        return <div key={idx} className="h-2" id={`empty-${idx}`} />;
      }

      return (
        <p key={idx} className="text-xs text-slate-650 leading-relaxed my-1" id={`p-${idx}`}>
          {parseInlineStyling(line)}
        </p>
      );
    });
  }

  // Parse inline bolding **text** to support clean styled spans
  function parseInlineStyling(str: string) {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={i} className="text-slate-900 font-extrabold bg-blue-50/75 px-1.5 py-0.2 rounded border border-blue-100/50">
            {part.slice(2, -2)}
          </strong>
        );
      }
      // Also highlight percentages to give professional trading desk style look
      const pctMatch = part.split(/(\d+(?:\.\d+)?%)/g);
      if (pctMatch.length > 1) {
        return pctMatch.map((subPart, subIdx) => {
          if (subPart.endsWith("%")) {
            return (
              <span key={subIdx} className="text-red-600 font-mono font-bold">
                {subPart}
              </span>
            );
          }
          return subPart;
        });
      }
      return part;
    });
  }

  return (
    <div className="bg-white border border-slate-100 rounded-2xl flex flex-col h-[540px] relative overflow-hidden shadow-sm animate-fade-in font-sans" id="ai-assistant-wrapper">
      {/* Header */}
      <div className="bg-slate-50 border-b border-slate-150 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600/5 p-1.5 rounded-xl border border-blue-500/20">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
          </div>
          <div>
            <span className="text-sm font-extrabold text-slate-800 flex items-center gap-1 font-display">
              渤银指数智脑分析中心
            </span>
            <div className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">BEYOND AI QUANT ENGINE V2.5</div>
          </div>
        </div>
        <span className="text-[9px] bg-white border border-slate-200 text-slate-500 px-2 py-0.5 rounded font-mono font-bold">
          MODEL: FLASH-3.5
        </span>
      </div>

      {/* Preset Action Buttons */}
      <div className="p-2 bg-[#F8FAFC]/55 border-b border-slate-200/60 flex gap-2 overflow-x-auto no-scrollbar scroll-smooth">
        {presets.map((p, i) => (
          <button
            key={i}
            id={`ai-preset-${i}`}
            onClick={() => handleSend(p.prompt)}
            disabled={loading}
            className="flex-shrink-0 text-[10px] bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 hover:border-slate-300 rounded-xl px-3 py-1.5 font-semibold transition duration-100 disabled:opacity-50 cursor-pointer"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Messages Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4.5 no-scrollbar bg-slate-50/50">
        {messages.map((m, i) => (
          <div
            key={i}
            id={`ai-message-${i}`}
            className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs shadow-sm ${
                m.sender === "user"
                  ? "bg-blue-600 text-white font-bold rounded-tr-none"
                  : "bg-white border border-slate-200/80 rounded-tl-none text-slate-750"
              }`}
            >
              {m.sender === "user" ? m.text : renderMarkdown(m.text)}
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex justify-start items-center" id="ai-loading-container">
            <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-3 shadow-sm">
              <div className="flex gap-1.5">
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-75"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-150"></span>
                <span className="w-1.5 h-1.5 bg-blue-600 rounded-full animate-bounce delay-300"></span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono font-bold uppercase tracking-wider">渤银指数深度研究中...</span>
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="p-3 bg-white border-t border-slate-150 flex items-center gap-2">
        <input
          type="text"
          id="ai-custom-prompt-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend(input)}
          placeholder={`探讨如何配置 ${selectedIndex.name}...`}
          disabled={loading}
          className="flex-1 bg-slate-50 border border-slate-250 rounded-xl text-slate-800 text-xs px-3.5 py-2.5 focus:outline-none focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 font-sans"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={loading || !input.trim()}
          id="ai-send-message-btn"
          className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl flex items-center justify-center transition duration-100 disabled:opacity-40 cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
