import { useQuery } from '@tanstack/react-query';
import type { RealtimeNewsItem } from '../types/realtimeNews';

async function fetchRealtimeNews(): Promise<RealtimeNewsItem[]> {
  const res = await fetch('/api/realtime-news');
  if (!res.ok) throw new Error('Failed to fetch realtime news');
  return res.json();
}

export function useRealtimeNews() {
  return useQuery({
    queryKey: ['realtime-news'],
    queryFn: fetchRealtimeNews,
    refetchInterval: 30 * 1000,
    staleTime: 15 * 1000,
  });
}
