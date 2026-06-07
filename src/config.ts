export const dashboardConfig = {
  pageWidth: 'default' as const,
  columns: [
    {
      size: 'small' as const,
      widgets: [
        {
          type: 'stocks' as const,
          title: 'Markets',
          symbols: ['SPY', 'BTC-USD', 'AMD'],
        },
        {
          type: 'stocks' as const,
          title: 'Nikkei',
          symbols: ['5016.T', '1320.T', '200A.T', '2564.T', '314A.T'],
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
    {
      size: 'full' as const,
      widgets: [
        {
          type: 'realtime-news' as const,
          title: 'Realtime News',
          collapseAfter: 8,
        },
      ],
    },
  ],
};
