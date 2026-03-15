import { Router } from 'express';
import Parser from 'rss-parser';

const router = Router();
const parser = new Parser();

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 5 * 60 * 1000;

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  return null;
}

router.get('/', async (req, res) => {
  try {
    const urls = Array.isArray(req.query.urls)
      ? (req.query.urls as string[])
      : req.query.urls
        ? [req.query.urls as string]
        : [];
    const limit = parseInt(req.query.limit as string) || 20;

    if (urls.length === 0) {
      res.json([]);
      return;
    }

    const cacheKey = urls.sort().join('|');
    const cached = getCached(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const feeds = await Promise.allSettled(
      urls.map(async (url) => {
        const feed = await parser.parseURL(url);
        return (feed.items || []).map((item) => ({
          title: item.title || '',
          link: item.link || '',
          source: feed.title || new URL(url).hostname,
          sourceUrl: feed.link || url,
          publishedAt: item.isoDate || item.pubDate || new Date().toISOString(),
          thumbnail: item.enclosure?.url || undefined,
        }));
      })
    );

    const items = feeds
      .filter((r): r is PromiseFulfilledResult<unknown[]> => r.status === 'fulfilled')
      .flatMap((r) => r.value)
      .sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
      .slice(0, limit);

    cache.set(cacheKey, { data: items, timestamp: Date.now() });
    res.json(items);
  } catch (err) {
    console.error('RSS fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch RSS feeds' });
  }
});

export { router as rssRouter };
