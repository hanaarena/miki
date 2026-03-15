export const dashboardConfig = {
  pageWidth: 'default' as const,
  columns: [
    {
      size: 'small' as const,
      widgets: [
        {
          type: 'stocks' as const,
          title: 'Markets',
          symbols: ['SPY', 'BTC-USD', 'NVDA', 'AAPL', 'MSFT'],
        },
      ],
    },
    {
      size: 'full' as const,
      widgets: [
        {
          type: 'rss' as const,
          title: 'News',
          urls: [
            'https://hnrss.org/frontpage',
            'https://www.theverge.com/rss/index.xml',
          ],
          collapseAfter: 8,
          limit: 20,
        },
      ],
    },
  ],
};
