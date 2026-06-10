import React, { useState } from "react";
import { BookOpen, Hash, Calculator, HelpCircle, Code } from "lucide-react";

export default function MetricsInfoTab() {
  const [activeSection, setActiveSection] = useState<string>("sec1");

  const sections = [
    {
      id: "sec1",
      title: "一、指标总览 (Tab 1 指标体系)",
      count: "10个基础指标",
      items: [
        { name: "累计收益率 (Cumulative Return)", formula: "R = P_t / P_0 - 1", desc: "自投资成立起点日至今组合资产净值累积变动的绝对幅度。" },
        { name: "年化收益率 (Annualized Return)", formula: "R_{ann} = (1 + R)^{252 / N} - 1", desc: "把累计收益率根据历史交易日数折算为每年度的几何复合收益回报。" },
        { name: "年化波动率 (Annual Volatility)", formula: "σ_{ann} = σ_{daily} \\times \\sqrt{252}", desc: "每日收益率标准差以年化交易周期进行对数平滑平稳折算，度量整体价格不确定风险风险。" },
        { name: "夏普比率 (Sharpe Ratio)", formula: "Sharpe = (R_{ann} - Rf) / σ_{ann}", desc: "每单位总风险资产波动下所获得的超额于无风险资产的复合回报度量。" },
        { name: "最大回撤 (Max Drawdown)", formula: "MDD = \\max_{i < j} \\frac{V_i - V_j}{V_i}", desc: "在历史观测周期中，任何历史高点至后续最低低谷的极限回吐深度的最坏幅度。" },
        { name: "卡玛比率 (Calmar Ratio)", formula: "Calmar = R_{ann} / |MDD|", desc: "年化增值收益率与历史最大回撤幅度的对称壁垒比，是评价抗跌持盈力的核心。" },
        { name: "周度胜率 (Weekly Win Rate)", formula: "WinReader = \\frac{N_{weeks\\ positive}}{N_{total\\ weeks}}", desc: "根据多期滚动，周净收益率为正数的比率占全部测算周期的占比。" },
        { name: "基准回报对决 (Benchmark Comparative Return)", formula: "R_{diff} = R_{port} - R_{bench}", desc: "组合累计复合增长高出基准标的绝对数值收益百分差。" },
        { name: "投资初始本金 (Initial Capital)", formula: "C_0 = ¥1,000,000", desc: "模拟后台成立测算投运开始默认备置的本币流动底资。" },
        { name: "组合年化主动收益 (Active Premium)", formula: "R_{p} - R_{m}", desc: "简单投资组合复年期望超出整体大盘股票全收益水平的主动增长差值。" }
      ]
    },
    {
      id: "sec2",
      title: "二、收益类指标 (Tab 2 收益衍生系数)",
      count: "16个细节指标",
      items: [
        { name: "月度平均收益率", formula: "R_{avg\\ month} = \\frac{1}{M}\\sum R_{month}", desc: "历史上各物理自然观测月份绝对期望增长率之算术平均表现。" },
        { name: "超额收益率 (Alpha)", formula: "α = R_{p} - [Rf + β(R_{m} - Rf)]", desc: "基于资本资产定价模型(CAPM)剥离市场波动敏感风险补偿后，组合所沉淀出的绝对主动阿尔法溢额。" },
        { name: "跟踪误差 (Tracking Error)", formula: "TE = \\sqrt{\\frac{252}{N - 1} \\sum (R_{p,t} - R_{m,t} - \\mu_{ex})^2}", desc: "每日超出基准收益偏差幅度时序在复合年化周期下的非系统分布标准偏差。" },
        { name: "信息比率 (Information Ratio)", formula: "IR = (R_{ann} - R_{bench}) / TE", desc: "度量每单位跟踪偏差过载风险下，由量化投研主动策略带来的极限超收益表现。" },
        { name: "索提诺比率 (Sortino Ratio)", formula: "Sortino = (R_{ann} - Rf) / σ_{down}", desc: "每单位偏斜下行负向资产偏离波动中，组合获取的绝对溢值回报（不对称防御评价）。" },
        { name: "实现贝塔系数 (Beta)", formula: "β = \\frac{Cov(R_p, R_m)}{Var(R_m)}", desc: "组合相对于股票大盘(沪深300)整体走势变化的系统结构性共振敏感性度数。" },
        { name: "残差风险 (Residual Risk / Unique Tracking)", formula: "σ_{residual} = \\sqrt{σ_p^2 - β^2 \\times σ_m^2}", desc: "组合在剔除所有市场贝塔敏感波及后的非公开因子及特质个股精选风险标准偏差。" },
        { name: "滚动正收益比率 (Rolling Positive Rate)", formula: "W_{positive} = \\frac{T_{R>0}}{T_{all}}", desc: "滚动任意区间，最终盈利阶段在复合统计周期出现的频次胜算度。" }
      ]
    },
    {
      id: "sec3",
      title: "三、归因分析指标 (Tab 3 Brinson体系)",
      count: "8个归因因子",
      items: [
        { name: "Brinson 资产配置效应 (Allocation Effect)", formula: "AE_i = (w_{p,i} - w_{b,i}) \\times R_{b,i}", desc: "由于超配或低配某一大类资产，而获得的偏离溢流业绩增减效果。" },
        { name: "Brinson 品种选择效应 (Selection Effect)", formula: "SE_i = w_{b,i} \\times (R_{p,i} - R_{b,i})", desc: "在特定资产类型内部，偏向挑选比该类型大盘基准收益更好的成分股或指数所获取的主动选股增量。" },
        { name: "Brinson 交互影响效应 (Interaction Effect)", formula: "IE_i = (w_{p,i} - w_{b,i}) \\times (R_{p,i} - R_{b,i})", desc: "因主动权重超配与持仓品种超收益结合带来的协同杠杆式复合影响溢值。" },
        { name: "BARRA 风格因子暴露 (Style Factor Exposure)", formula: "Z_f = (X_i - \\mu_f) / σ_f", desc: "多因子量化资产中，大类资产相对于全样本底盘在规模、价值、动量等维度上的标准特征偏差值 (Z-Score)。" },
        { name: "边际风险贡献 (MCR - Marginal Contribution to Risk)", formula: "MCR_i = \\frac{\\partial σ_p}{\\partial w_i} = \\frac{Cov(R_i, R_p)}{σ_p}", desc: "每微增一单位资产成分权重，对投资组合整体下行标准标准差带来的敏感波动影响，用于量化风控归因。" }
      ]
    },
    {
      id: "sec4",
      title: "四、风险类指标 (Tab 4 极限回撤与风控)",
      count: "16个风控指标",
      items: [
        { name: "在风价值 (VaR - Value at Risk 95%)", formula: "VaR_{95} = - (\\mu_p - Z_{0.95} \\times σ_p)", desc: "在正常市场波动下，未来特定一日在95%置信度下的理论极限持有下行资产流失上限。" },
        { name: "蒙特卡罗协方差随机模拟 (Monte Carlo Paths)", formula: "dS_t = r S_t dt + σ S_t dW_t", desc: "运用几何布朗运动模型，输入协方差与历史波动，基于随机微积分(Box-Muller)推演上千条独立平行时空的未来资产走势。" },
        { name: "赫芬达尔集中度指数 (HHI - Herfindahl-Hirschman)", formula: "HHI = \\sum_{i=1}^n w_i^2", desc: "度量持仓标的配重的主动性集中风险，指数值高说明资产高度依赖于单一个体。" },
        { name: "下行半偏差波动 (Downside Semi-Deviation)", formula: "σ_{down} = \\sqrt{\\frac{252}{N_{down}} \\sum_{R_t < Rf} (R_t - Rf)^2}", desc: "专为索提诺构造，仅将低出期望无风险增长部分的负跌收益作为离散损失波动测算，上行爆发利润不计波动。" }
      ]
    },
    {
      id: "sec5",
      title: "五、配置收益指标 (Tab 5 时序轮动)",
      count: "4个轮动指标",
      items: [
        { name: "成分持仓漂移 (Holding Weight Drift)", formula: "Drift_t = w_{exp, t} - w_{rebal, 0}", desc: "由于不均衡的市场波动带来的底层成分价值自发溢缩，导致实际权重偏离初始计划设定比率的漂移偏差。" },
        { name: "大类拟合度与自回归", formula: "Regression\\ Corr", desc: "底层构成品种在多阶段区间重叠轮转收益与市场宏观因子的关联耦合度。" }
      ]
    },
    {
      id: "sec6",
      title: "六、调仓行为指标 (Tab 6 审计效能)",
      count: "7个调仓评优",
      items: [
        { name: "双边单期换手率 (Turnover Rate)", formula: "TO = \\frac{1}{2} \\sum_{i} |w_{i, t^+} - w_{i, t^-}|", desc: "单次平衡调整动作中，换出重组权重占组合持仓的实际单边成交规模。" },
        { name: "调仓胜算度 (Rebalance Efficacy Ratio)", formula: "Efficacy = R^{+3D}_{post} - R^{-3D}_{pre}", desc: "核心指标：计算再平衡交易执行后3个交易日收益，偏离扣减交易前3日原始惯性收益后的差额。为正代表对冲调节卡位正确。" },
        { name: "年化摩擦总损耗", formula: "Cost = TO_{year} \\times Fee_{ratio}", desc: "考虑调仓频率引起的双边万二印花/佣金和溢折冲击，对组合年化增长带来的实际点位扣抵。" }
      ]
    }
  ];

  return (
    <div className="space-y-6" id="metrics-tab-view">
      <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm" id="docs-wrapper">
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4 mb-4">
          <BookOpen className="w-5 h-5 text-amber-500" />
          <div>
            <h3 className="text-sm font-extrabold text-slate-900 font-display">
              渤银指数实盘模拟 · 极限绩效评测公式手册 (Methodology & Formula Ledger)
            </h3>
            <span className="text-[10px] text-slate-400 font-medium block mt-0.5">
              全自洽金融计算框架底层学术规范支持，提供全部 Tab 所牵引的统计动力学、组合分析及风险精算算式阐明
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Docs Section Quick link cards */}
          <div className="lg:col-span-3 flex flex-col gap-2">
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => setActiveSection(sec.id)}
                className={`w-full p-3.5 rounded-xl border text-left font-sans transition-all duration-150 cursor-pointer ${
                  activeSection === sec.id
                    ? "bg-blue-600/5 border-blue-600/30 text-blue-600 font-bold shadow-sm"
                    : "bg-slate-50/70 border-slate-200/60 text-slate-550 hover:bg-slate-50 hover:text-slate-800"
                }`}
              >
                <div className="flex justify-between items-center text-xs">
                  <span className="truncate">{sec.title.split(" ")[0]} {sec.title.split(" ")[1]}</span>
                  <Hash className="w-3.5 h-3.5 opacity-60 flex-shrink-0 ml-1" />
                </div>
                <span className="text-[9px] font-normal text-slate-450 block mt-1.5">{sec.count}</span>
              </button>
            ))}
          </div>

          {/* Section details block */}
          <div className="lg:col-span-9 bg-slate-50/50 p-6 rounded-2xl border border-slate-150 shadow-inner">
            {sections.map((sec) => (
              <div
                key={sec.id}
                className={`space-y-4 ${activeSection === sec.id ? "block" : "hidden md:hidden"}`}
              >
                <h4 className="text-xs font-bold text-slate-800 flex items-center gap-2 uppercase tracking-wider border-b border-slate-200 pb-2.5 font-display font-extrabold">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  {sec.title} - 底层数理运算库定义（标准)
                </h4>

                <div className="space-y-3.5 pt-1.5 overflow-y-auto max-h-[500px] pr-1.5 no-scrollbar">
                  {sec.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="bg-white border border-slate-200/60 p-4.5 rounded-xl flex flex-col justify-between hover:border-slate-300 transition duration-100 shadow-sm"
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-2 mb-2.5 gap-2">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1">
                          <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
                          {item.name}
                        </span>
                        <div className="flex items-center gap-1.5 text-[9px] bg-slate-50 px-2 py-0.5 rounded border border-slate-200 font-mono text-indigo-650 font-bold">
                          <Code className="w-3 h-3 text-indigo-500" />
                          算式：{item.formula}
                        </div>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-relaxed font-sans">{item.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
