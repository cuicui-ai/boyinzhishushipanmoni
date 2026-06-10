import { IndexData, IndexId, PricePoint, SectorWeight } from "./types";

// Helper to generate a realistic random-walk price history
export function generateHistory(
  days: number,
  startValue: number,
  volatility: number,
  drift: number = 0.0002
): PricePoint[] {
  const points: PricePoint[] = [];
  let currentValue = startValue;
  const now = new Date();

  for (let i = days; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    // standard GBM step
    const changePercent = (Math.random() - 0.485) * volatility + drift;
    currentValue = currentValue * (1 + changePercent);
    const dateStr = date.toISOString().split("T")[0];
    points.push({
      date: dateStr,
      value: parseFloat(currentValue.toFixed(2)),
    });
  }
  return points;
}

// Generate highly granular mock intraday points (simulated 24h)
export function generate24hHistory(startValue: number, volatility: number): PricePoint[] {
  const points: PricePoint[] = [];
  let currentValue = startValue;
  const hours = 24;
  const segmentsPerHour = 4; // every 15 minutes
  const totalPoints = hours * segmentsPerHour;

  for (let i = 0; i < totalPoints; i++) {
    const timeStr = `${String(Math.floor(i / segmentsPerHour)).padStart(2, "0")}:${String((i % segmentsPerHour) * 15).padStart(2, "0")}`;
    const changePercent = (Math.random() - 0.488) * (volatility / 4);
    currentValue = currentValue * (1 + changePercent);
    points.push({
      date: timeStr,
      value: parseFloat(currentValue.toFixed(2)),
    });
  }
  return points;
}

export const INITIAL_INDICES: IndexData[] = [
  {
    id: IndexId.HS300,
    name: "沪深300指数",
    fullName: "沪深300蓝筹龙头发达指数",
    code: "000300.SH",
    launchValue: 1000,
    currentValue: 3588.40,
    changeValue: 32.10,
    changeRate: 0.90,
    high: 3610.50,
    low: 3550.20,
    volume: "185.2亿",
    riskLevel: "中高风险",
    description: "选取沪深两市中规模大、流动性好的最具代表性的300只证券作为样本，综合反映沪深证券市场上市公司证券的整体表现。",
    sectors: [
      { name: "主要消费", value: 20, color: "#2172E7" },
      { name: "金融地产", value: 25, color: "#685BE7" },
      { name: "工业制造", value: 18, color: "#0095DE" },
      { name: "信息技术", value: 17, color: "#EC8131" },
      { name: "医药卫生", value: 20, color: "#2BA471" },
    ],
    history24h: generate24hHistory(3556.30, 0.012),
    history1Month: generateHistory(30, 3510.00, 0.015, 0.0006),
    history1Year: generateHistory(250, 3350.00, 0.022, 0.0003),
  },
  {
    id: IndexId.ZZ2000,
    name: "中证2000指数",
    fullName: "中证2000微盘成长先锋指数",
    code: "932000.CSI",
    launchValue: 2000,
    currentValue: 2142.20,
    changeValue: -45.10,
    changeRate: -2.06,
    high: 2210.30,
    low: 2135.00,
    volume: "312.4亿",
    riskLevel: "最高风险",
    description: "中证2000指数选取沪深市场中规模偏小且流动性好的2000只证券作为指数样本，反映核心小微市值公司的成长特征。",
    sectors: [
      { name: "机械设备", value: 22, color: "#EC8131" },
      { name: "电子半导体", value: 28, color: "#2172E7" },
      { name: "计算机软件", value: 18, color: "#685BE7" },
      { name: "基础化工", value: 16, color: "#0095DE" },
      { name: "医药生物", value: 16, color: "#2BA471" },
    ],
    history24h: generate24hHistory(2187.30, 0.028),
    history1Month: generateHistory(30, 2080.00, 0.026, 0.0012),
    history1Year: generateHistory(250, 1850.00, 0.038, 0.0007),
  },
  {
    id: IndexId.FCF,
    name: "自由现金流指数",
    fullName: "中证精选高自由现金流指数",
    code: "H30303.CSI",
    launchValue: 1000,
    currentValue: 2824.50,
    changeValue: 24.80,
    changeRate: 0.89,
    high: 2845.00,
    low: 2795.50,
    volume: "82.4亿",
    riskLevel: "中德等风险",
    description: "主要关注企业创造可分配现金的能力，重点配置自由现金流收益率排名前列、资产负债表极稳健、分红能力充沛的龙头上市企业。",
    sectors: [
      { name: "能源采掘", value: 30, color: "#EC8131" },
      { name: "基础交通", value: 25, color: "#2BA471" },
      { name: "公用事业", value: 20, color: "#0095DE" },
      { name: "核心地产", value: 10, color: "#685BE7" },
      { name: "银行金融", value: 15, color: "#2172E7" },
    ],
    history24h: generate24hHistory(2799.70, 0.010),
    history1Month: generateHistory(30, 2750.00, 0.012, 0.0008),
    history1Year: generateHistory(250, 2400.00, 0.018, 0.0005),
  },
  {
    id: IndexId.HSTECH,
    name: "恒生科技指数",
    fullName: "恒生科技龙头互联网指数",
    code: "HSTECH.HK",
    launchValue: 3000,
    currentValue: 3954.10,
    changeValue: 56.40,
    changeRate: 1.45,
    high: 3995.00,
    low: 3880.50,
    volume: "192.5亿",
    riskLevel: "最高风险",
    description: "追踪港股上市的30家最大的科技板块上市公司，包含主要的平台互联网博弈、智能硬件、生命科技和数字办公巨头。",
    sectors: [
      { name: "电子商务", value: 35, color: "#2172E7" },
      { name: "云端SaaS", value: 20, color: "#685BE7" },
      { name: "半导体芯片", value: 15, color: "#0095DE" },
      { name: "智能车硬件", value: 15, color: "#EC8131" },
      { name: "数字文娱", value: 15, color: "#2BA471" },
    ],
    history24h: generate24hHistory(3897.70, 0.024),
    history1Month: generateHistory(30, 3750.00, 0.022, 0.0015),
    history1Year: generateHistory(250, 3110.00, 0.034, 0.0009),
  },
  {
    id: IndexId.SD,
    name: "中证短债指数",
    fullName: "中证短期信用债券策略指数",
    code: "H11001.CSI",
    launchValue: 100,
    currentValue: 184.22,
    changeValue: 0.06,
    changeRate: 0.03,
    high: 184.25,
    low: 184.15,
    volume: "42.8亿",
    riskLevel: "低风险",
    description: "反映中短期高信用等级企业债、金融债的走势，下行风险极细微，长期向上确定性极强，具备出色的防御收益属性。",
    sectors: [
      { name: "超白金国债", value: 40, color: "#2BA471" },
      { name: "政策金融债", value: 35, color: "#0095DE" },
      { name: "高评级商业公司债", value: 25, color: "#2172E7" },
    ],
    history24h: generate24hHistory(184.16, 0.001),
    history1Month: generateHistory(30, 183.10, 0.0015, 0.00015),
    history1Year: generateHistory(250, 178.00, 0.003, 0.00012),
  },
  {
    id: IndexId.CP,
    name: "中证短融指数",
    fullName: "中证超短期融资券信用债指数",
    code: "H11021.CSI",
    launchValue: 100,
    currentValue: 152.18,
    changeValue: 0.04,
    changeRate: 0.02,
    high: 152.20,
    low: 152.12,
    volume: "21.6亿",
    riskLevel: "低风险",
    description: "样本由在银行间市场上市、剩余期限在270天以内的超短期融资优先信用券构成，抗通胀及低息波能力优秀。",
    sectors: [
      { name: "央企超短期融资券", value: 50, color: "#2BA471" },
      { name: "地方国企流动债", value: 35, color: "#0095DE" },
      { name: "电力/能源中期特专债", value: 15, color: "#685BE7" },
    ],
    history24h: generate24hHistory(152.14, 0.001),
    history1Month: generateHistory(30, 151.30, 0.0012, 0.00012),
    history1Year: generateHistory(250, 148.00, 0.0028, 0.0001),
  },
  {
    id: IndexId.GOLD,
    name: "黄金Au99.99",
    fullName: "上海金交所黄金现货Au99.99",
    code: "AU9999.SGE",
    launchValue: 100,
    currentValue: 546.80,
    changeValue: 5.20,
    changeRate: 0.96,
    high: 549.50,
    low: 541.20,
    volume: "95.4亿",
    riskLevel: "中高风险",
    description: "上海黄金交易所现货Au99.99合约。黄金具备天然抗通胀及极度避险属性，与股市波动呈中高度弱负相关性。",
    sectors: [
      { name: "伦敦金现对冲", value: 30, color: "#685BE7" },
      { name: "金交所实物吨存", value: 70, color: "#EC8131" },
    ],
    history24h: generate24hHistory(541.60, 0.015),
    history1Month: generateHistory(30, 525.00, 0.016, 0.0004),
    history1Year: generateHistory(250, 440.00, 0.024, 0.0008),
  },
  {
    id: IndexId.MMF,
    name: "货币基金指数",
    fullName: "中证偏股型/信用评级超优货币基金指数",
    code: "H11025.CSI",
    launchValue: 100,
    currentValue: 112.45,
    changeValue: 0.01,
    changeRate: 0.01,
    high: 112.46,
    low: 112.44,
    volume: "128.5亿",
    riskLevel: "低风险",
    description: "反映货币市场基金平均整体回报水平，基本不负担市盈变化与降息冲击，完美的现金备付港湾。",
    sectors: [
      { name: "银行协议超约定存", value: 60, color: "#2BA471" },
      { name: "中央质押式逆回购", value: 40, color: "#0095DE" },
    ],
    history24h: generate24hHistory(112.44, 0.0005),
    history1Month: generateHistory(30, 112.20, 0.0004, 0.00008),
    history1Year: generateHistory(250, 110.50, 0.001, 0.00006),
  },
];

// --- ADVANCED STATIC PERFORMANCE DATA (According to Section 3 of Spec) ---

// Portfolio vs baseline滬深300 daily simulated history over 250 days for Tab 1, 2, 4
export interface PerformancePoint {
  date: string;
  navPort: number;       // Portfolio normalized (start 100)
  navBench: number;      // HS300 Benchmark normalized (start 100)
  exReturn: number;      // Excess return (Port - Bench)
  drawdownPort: number;  // drawdown % of Port
  drawdownBench: number; // drawdown % of Bench
}

export function generatePerformanceHistory(): PerformancePoint[] {
  const points: PerformancePoint[] = [];
  const now = new Date();
  
  let navPort = 100.0;
  let navBench = 100.0;
  
  let peakPort = 100.0;
  let peakBench = 100.0;

  for (let i = 250; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];

    // Portfolio step: stable growth ~8.50% annualized, low vol (~6.25% annual vol), drift ~0.00034
    const portStep = (Math.random() - 0.46) * 0.007 + 0.00028;
    navPort = navPort * (1 + portStep);

    // Benchmark step: volatile, e.g.沪深300 vol (~12.80% annual vol), drift ~0.0001
    const benchStep = (Math.random() - 0.495) * 0.016 + 0.00008;
    navBench = navBench * (1 + benchStep);

    // Calculate drawdown
    if (navPort > peakPort) peakPort = navPort;
    if (navBench > peakBench) peakBench = navBench;

    const ddPort = ((peakPort - navPort) / peakPort) * 100;
    const ddBench = ((peakBench - navBench) / peakBench) * 100;

    points.push({
      date: dateStr,
      navPort: parseFloat(navPort.toFixed(2)),
      navBench: parseFloat(navBench.toFixed(2)),
      exReturn: parseFloat((navPort - navBench).toFixed(2)),
      drawdownPort: parseFloat((-ddPort).toFixed(2)),
      drawdownBench: parseFloat((-ddBench).toFixed(2)),
    });
  }
  return points;
}

export const PORTFOLIO_HISTORY = generatePerformanceHistory();

// 11 Years Yearly Return Contribution (for Stacked Bar Charts in Tab 1 and Tab 3)
// Spec: "收益贡献分解: 年度堆叠柱状图 + 明细表（债券/股票/货币基金/黄金）, contribYearlyData （11年数据）"
export interface YearlyContribution {
  year: string;
  bond: number;      // Return contribution from bonds %
  stock: number;     // Return contribution from stocks %
  mmf: number;       // Return contribution from MMF %
  gold: number;      // Return contribution from Gold %
  portTotal: number; // Actual aggregate portfolio return (sum of all segments)
  benchTotal: number;// HS300 Benchmark return for that year %
}

export const CONTRIB_YEARLY_DATA: YearlyContribution[] = [
  { year: "2016", bond: 1.5, stock: -2.3, mmf: 0.3, gold: 1.2, portTotal: 0.7, benchTotal: -11.28 },
  { year: "2017", bond: 1.2, stock: 7.8, mmf: 0.4, gold: 0.5, portTotal: 9.9, benchTotal: 21.78 },
  { year: "2018", bond: 2.1, stock: -5.4, mmf: 0.4, gold: 1.1, portTotal: -1.8, benchTotal: -25.31 },
  { year: "2019", bond: 1.8, stock: 12.5, mmf: 0.3, gold: 2.4, portTotal: 17.0, benchTotal: 36.07 },
  { year: "2020", bond: 1.4, stock: 15.2, mmf: 0.2, gold: 3.1, portTotal: 19.9, benchTotal: 27.21 },
  { year: "2021", bond: 1.9, stock: -1.1, mmf: 0.2, gold: -0.5, portTotal: 0.5, benchTotal: -5.20 },
  { year: "2022", bond: 1.6, stock: -6.8, mmf: 0.3, gold: 1.2, portTotal: -3.7, benchTotal: -21.63 },
  { year: "2023", bond: 2.4, stock: -1.5, mmf: 0.3, gold: 2.5, portTotal: 3.7, benchTotal: -11.38 },
  { year: "2024", bond: 2.1, stock: 5.6, mmf: 0.3, gold: 4.8, portTotal: 12.8, benchTotal: 14.10 },
  { year: "2025", bond: 1.8, stock: 4.5, mmf: 0.2, gold: 3.6, portTotal: 10.1, benchTotal: 8.50 },
  { year: "2026", bond: 0.9, stock: 2.1, mmf: 0.1, gold: 1.4, portTotal: 4.5, benchTotal: 3.90 }, // Partial year through May
];

// Rebalance events representation (Tab 6, spec states 831 simulated rebalance events)
export interface RebalanceEvent {
  id: string;
  date: string;
  type: string;
  turnover: number;      // % of assets traded
  effect: number;        // Rebalance efficacy: 3-day return post rebalance minus 3-day return pre rebalance in %
  hs300Weight: number;   // active allocations %
  zz2000Weight: number;
  fcfWeight: number;
  hstechWeight: number;
  sdWeight: number;
  cpWeight: number;
  goldWeight: number;
  mmfWeight: number;
}

// Generate a summary subset of the 831 rebalance events to display
export function generateRebalanceEvents(): RebalanceEvent[] {
  const list: RebalanceEvent[] = [];
  const now = new Date();
  
  // Create 20 sample recent events to populate beautiful list tables
  for (let i = 1; i <= 20; i++) {
    const daysAgo = Math.floor(i * 12 + Math.random() * 6);
    const date = new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
    const dateStr = date.toISOString().split("T")[0];
    
    // Total rebalance events aggregated is 831, we show details for active list
    const id = `RE-${831 - i}`;
    const turnover = parseFloat((Math.random() * 15 + 4).toFixed(2));
    
    // effect metrics ranging from -0.8% to +1.2%, mean around -0.02% to match spec
    const effect = parseFloat(((Math.random() - 0.51) * 1.5).toFixed(2));

    list.push({
      id,
      date: dateStr,
      type: "多因子周度优化再平衡",
      turnover,
      effect,
      hs300Weight: parseFloat((15 + Math.random() * 5).toFixed(1)),
      zz2000Weight: parseFloat((10 + Math.random() * 4).toFixed(1)),
      fcfWeight: parseFloat((10 + Math.random() * 5).toFixed(1)),
      hstechWeight: parseFloat((8 + Math.random() * 3).toFixed(1)),
      sdWeight: parseFloat((20 + Math.random() * 8).toFixed(1)),
      cpWeight: parseFloat((15 + Math.random() * 5).toFixed(1)),
      goldWeight: parseFloat((10 + Math.random() * 4).toFixed(1)),
      mmfWeight: parseFloat((6 + Math.random() * 4).toFixed(1)),
    });
  }
  return list;
}

export const REBALANCE_EVENTS = generateRebalanceEvents();

// Static asset class groupings to construct doughnut allocations / weights area
export interface AssetAllocation {
  name: string;
  code: string;
  type: "股票" | "债券" | "黄金" | "货币";
  weight: number; // in %
  color: string;
}

export const CURRENT_ALLOCATION: AssetAllocation[] = [
  { name: "沪深300指数", code: "000300.SH", type: "股票", weight: 18.2, color: "#2172E7" },
  { name: "中证2000指数", code: "932000.CSI", type: "股票", weight: 11.5, color: "#EC8131" },
  { name: "自由现金流指数", code: "H30303.CSI", type: "股票", weight: 12.8, color: "#0095DE" },
  { name: "恒生科技指数", code: "HSTECH.HK", type: "股票", weight: 9.4, color: "#685BE7" },
  { name: "中证短债指数", code: "H11001.CSI", type: "债券", weight: 22.1, color: "#2BA471" },
  { name: "中证短融指数", code: "H11021.CSI", type: "债券", weight: 14.5, color: "#153673" },
  { name: "黄金Au99.99", code: "AU9999.SGE", type: "黄金", weight: 8.5, color: "#EC8131" },
  { name: "货币基金指数", code: "H11025.CSI", type: "货币", weight: 3.0, color: "#30BEF0" },
];

// Pearson Correlation Matrix Heatmap
// 8x8 indices correlation matrix
export const CORRELATION_MATRIX = {
  labels: ["HS300", "ZZ2000", "FCF", "HSTECH", "SD", "CP", "GOLD", "MMF"],
  grid: [
    [1.00,  0.65,  0.82,  0.58, -0.15, -0.12, -0.05, -0.08], // HS300
    [0.65,  1.00,  0.55,  0.72, -0.22, -0.18,  0.02, -0.11], // ZZ2000
    [0.82,  0.55,  1.00,  0.42, -0.10, -0.08, -0.04, -0.07], // FCF
    [0.58,  0.72,  0.42,  1.00, -0.18, -0.14,  0.05, -0.09], // HSTECH
    [-0.15, -0.22, -0.10, -0.18,  1.00,  0.78,  0.15,  0.35], // SD
    [-0.12, -0.18, -0.08, -0.14,  0.78,  1.00,  0.12,  0.42], // CP
    [-0.05,  0.02, -0.04,  0.05,  0.15,  0.12,  1.00,  0.05], // GOLD
    [-0.08, -0.11, -0.07, -0.09,  0.35,  0.42,  0.05,  1.00], // MMF
  ]
};
