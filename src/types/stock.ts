export interface StockData {
  symbol: string;
  name: string;
  price: number;
  currency: string;
  percentChange: number;
  absoluteChange: number;
  chartPoints: number[];
}
