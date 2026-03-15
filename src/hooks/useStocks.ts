import { useQuery } from '@tanstack/react-query';
import type { StockData } from '../types/stock';

async function fetchStocks(symbols: string[]): Promise<StockData[]> {
  const res = await fetch(`/api/stocks?symbols=${symbols.join(',')}`);
  if (!res.ok) throw new Error('Failed to fetch stocks');
  return res.json();
}

export function useStocks(symbols: string[]) {
  return useQuery({
    queryKey: ['stocks', symbols],
    queryFn: () => fetchStocks(symbols),
    refetchInterval: 5 * 60 * 1000,
    staleTime: 60 * 1000,
  });
}
