import { useQuery } from '@tanstack/react-query';
import type { RSSItem } from '../types/rss';

async function fetchRSS(urls: string[], limit: number): Promise<RSSItem[]> {
  const params = new URLSearchParams();
  urls.forEach((url) => params.append('urls', url));
  params.set('limit', String(limit));
  const res = await fetch(`/api/rss?${params}`);
  if (!res.ok) throw new Error('Failed to fetch RSS');
  return res.json();
}

export function useRSSFeed(urls: string[], limit: number = 20) {
  return useQuery({
    queryKey: ['rss', urls],
    queryFn: () => fetchRSS(urls, limit),
    refetchInterval: 15 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
}
