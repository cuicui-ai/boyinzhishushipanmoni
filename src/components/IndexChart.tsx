import React from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { PricePoint } from "../types";

interface IndexChartProps {
  data: PricePoint[];
  isPositive: boolean;
  activeColor: string;
}

export default function IndexChart({ data, isPositive, activeColor }: IndexChartProps) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-450 font-mono text-xs">
        [暂无指数走势快照]
      </div>
    );
  }

  // Calculate local min and max for fine-grained Y axis zoom
  const values = data.map((d) => d.value);
  const minVal = Math.min(...values);
  const maxVal = Math.max(...values);
  const padding = (maxVal - minVal) * 0.05 || 10;
  const yDomain = [parseFloat((minVal - padding).toFixed(2)), parseFloat((maxVal + padding).toFixed(2))];

  return (
    <div className="w-full h-80 relative" id="index-trend-chart-container">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 20, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="chartColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={activeColor} stopOpacity={0.15} />
              <stop offset="95%" stopColor={activeColor} stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" opacity={0.6} stopOpacity={0.4} />
          <XAxis
            dataKey="date"
            stroke="#94A3B8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dy={10}
          />
          <YAxis
            domain={yDomain}
            stroke="#94A3B8"
            fontSize={10}
            tickLine={false}
            axisLine={false}
            dx={-5}
            tickFormatter={(v) => v.toFixed(1)}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E2E8F0",
              borderRadius: "0.75rem",
              color: "#1E293B",
              fontFamily: "monospace",
              fontSize: "11px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.05)"
            }}
            labelClassName="text-slate-400 font-bold mb-1"
            formatter={(value: any) => [`现值：${value.toFixed(2)}`, "指数趋势"]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={activeColor}
            strokeWidth={2.2}
            fillOpacity={1}
            fill="url(#chartColor)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
