import { Router } from 'express';

const router = Router();

interface CacheEntry {
  data: unknown;
  timestamp: number;
}

const cache = new Map<string, CacheEntry>();
const CACHE_TTL = 60 * 1000;

const SYMBOL_NAMES: Record<string, string> = {
  SPY: 'S&P 500',
  QQQ: 'Nasdaq 100',
  DIA: 'Dow Jones',
  'BTC-USD': 'Bitcoin',
  'ETH-USD': 'Ethereum',
  AAPL: 'Apple',
  MSFT: 'Microsoft',
  GOOGL: 'Alphabet',
  AMZN: 'Amazon',
  NVDA: 'NVIDIA',
  META: 'Meta',
  TSLA: 'Tesla',
};

function getCached(key: string) {
  const entry = cache.get(key);
  if (entry && Date.now() - entry.timestamp < CACHE_TTL) return entry.data;
  return null;
}

async function fetchStock(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(symbol)}?interval=1d&range=1mo`;
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    },
  });

  if (!res.ok) throw new Error(`Yahoo Finance returned ${res.status}`);

  const data = await res.json();
  const result = data.chart?.result?.[0];
  if (!result) throw new Error('No data for ' + symbol);

  const meta = result.meta;
  const closes = result.indicators?.quote?.[0]?.close || [];
  const validCloses = closes.filter((c: number | null) => c !== null);
  const currentPrice = meta.regularMarketPrice;
  const previousClose = meta.chartPreviousClose || validCloses[0] || currentPrice;
  const absoluteChange = currentPrice - previousClose;
  const percentChange = previousClose ? (absoluteChange / previousClose) * 100 : 0;

  return {
    symbol: symbol.toUpperCase(),
    name: SYMBOL_NAMES[symbol.toUpperCase()] || meta.shortName || symbol,
    price: currentPrice,
    currency: meta.currency || 'USD',
    percentChange: Math.round(percentChange * 100) / 100,
    absoluteChange: Math.round(absoluteChange * 100) / 100,
    chartPoints: validCloses.slice(-20),
  };
}

router.get('/', async (req, res) => {
  try {
    const symbols = ((req.query.symbols as string) || '').split(',').filter(Boolean);

    if (symbols.length === 0) {
      res.json([]);
      return;
    }

    const cacheKey = symbols.sort().join('|');
    const cached = getCached(cacheKey);
    if (cached) {
      res.json(cached);
      return;
    }

    const results = await Promise.allSettled(symbols.map(fetchStock));
    const stocks = results
      .filter((r): r is PromiseFulfilledResult<Awaited<ReturnType<typeof fetchStock>>> => r.status === 'fulfilled')
      .map((r) => r.value);

    cache.set(cacheKey, { data: stocks, timestamp: Date.now() });
    res.json(stocks);
  } catch (err) {
    console.error('Stock fetch error:', err);
    res.status(500).json({ error: 'Failed to fetch stock data' });
  }
});

export { router as stocksRouter };
