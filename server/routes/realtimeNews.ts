import { Router } from 'express';
import * as cheerio from 'cheerio';

const router = Router();

interface RealtimeNewsItem {
  id: number;
  content: string;
  createTime: number;
  createTimeDesc: string;
  important: boolean;
}

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const HTML_URL = 'https://www.zhitongcaijing.com/immediately.html';
const MAX_ITEMS = 100;
const UPSTREAM_THROTTLE_MS = 15 * 1000;

let items: RealtimeNewsItem[] = [];
let lastFetch = 0;
let inflight: Promise<void> | null = null;

function unixForTodayHHMMSS(hhmmss: string): number {
  const [h, m, s] = hhmmss.split(':').map((n) => parseInt(n, 10));
  if (Number.isNaN(h) || Number.isNaN(m) || Number.isNaN(s)) {
    return Math.floor(Date.now() / 1000);
  }
  const now = new Date();
  const d = new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, s);
  let t = Math.floor(d.getTime() / 1000);
  if (t > Math.floor(Date.now() / 1000) + 60) t -= 86400;
  return t;
}

async function refresh(): Promise<void> {
  const res = await fetch(HTML_URL, { headers: { 'User-Agent': UA } });
  if (!res.ok) throw new Error(`Upstream HTML fetch failed: ${res.status}`);
  const html = await res.text();
  const $ = cheerio.load(html);

  const known = new Set(items.map((i) => i.id));
  const fresh: RealtimeNewsItem[] = [];

  $('.allday-item').each((_, el) => {
    const node = $(el);
    if (node.hasClass('allday-item-nomore')) return;

    const idAttr = node.attr('id') || '';
    const idMatch = idAttr.match(/(\d+)/);
    const fallbackId = node
      .find('.allday-item-operat-edit-box')
      .attr('data-id');
    const id = parseInt(idMatch?.[1] || fallbackId || '0', 10);
    if (!id) return;

    const timeDesc = node.find('.allday-item-time').first().text().trim();
    const content = node
      .find('.allday-item-content')
      .first()
      .text()
      .replace(/\s+/g, ' ')
      .trim();
    if (!content) return;

    if (!known.has(id)) {
      fresh.push({
        id,
        content,
        createTime: unixForTodayHHMMSS(timeDesc),
        createTimeDesc: timeDesc,
        important: node.hasClass('allday-item-import'),
      });
      known.add(id);
    }
  });

  if (fresh.length > 0) {
    items = [...fresh, ...items]
      .sort((a, b) => b.createTime - a.createTime)
      .slice(0, MAX_ITEMS);
  } else if (items.length === 0) {
    items = [];
  }
}

router.get('/', async (_req, res) => {
  try {
    const now = Date.now();
    const shouldFetch = items.length === 0 || now - lastFetch > UPSTREAM_THROTTLE_MS;
    if (shouldFetch) {
      if (!inflight) {
        lastFetch = now;
        inflight = refresh().finally(() => {
          inflight = null;
        });
      }
      try {
        await inflight;
      } catch (err) {
        console.error('Realtime news refresh error:', err);
        if (items.length === 0) {
          res.status(502).json({ error: 'Failed to fetch realtime news' });
          return;
        }
      }
    }
    res.json(items);
  } catch (err) {
    console.error('Realtime news route error:', err);
    res.status(500).json({ error: 'Failed to fetch realtime news' });
  }
});

export { router as realtimeNewsRouter };
