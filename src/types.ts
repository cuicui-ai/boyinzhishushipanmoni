export enum IndexId {
  HS300 = "HS300",
  ZZ2000 = "ZZ2000",
  FCF = "FCF",
  HSTECH = "HSTECH",
  SD = "SD",
  CP = "CP",
  GOLD = "GOLD",
  MMF = "MMF"
}

export interface PricePoint {
  date: string;
  value: number;
}

export interface SectorWeight {
  name: string;
  value: number;
  color: string;
}

export interface IndexData {
  id: IndexId;
  name: string;
  fullName: string;
  code: string;
  launchValue: number;
  currentValue: number;
  changeValue: number;
  changeRate: number; // e.g. +2.45
  high: number;
  low: number;
  volume: string;
  description: string;
  riskLevel: "低风险" | "中德等风险" | "中高风险" | "最高风险";
  sectors: SectorWeight[];
  history24h: PricePoint[];
  history1Month: PricePoint[];
  history1Year: PricePoint[];
}

export interface Holding {
  indexId: IndexId;
  indexName: string;
  code: string;
  shares: number;       // total shares owned
  avgCost: number;      // average buy price
  currentValue: number; // shares * current price
  profitVal: number;    // floating profit value
  profitRate: number;   // floating profit percent
}

export interface Transaction {
  id: string;
  time: string;
  indexId: IndexId;
  indexName: string;
  type: "买入" | "卖出";
  price: number;
  shares: number;
  totalAmount: number;
  fee: number;
}

export interface AccountState {
  cash: number;
  initialCapital: number;
  totalEquity: number;
  todayProfitRate: number;
}
