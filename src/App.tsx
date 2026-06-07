import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Page } from './components/Layout/Page';
import { Header } from './components/Layout/Header';
import { Column } from './components/Layout/Column';
import { StockMarket } from './components/widgets/StockMarket/StockMarket';
import { RSSFeed } from './components/widgets/RSSFeed/RSSFeed';
import { RealtimeNews } from './components/widgets/RealtimeNews/RealtimeNews';
import { dashboardConfig } from './config';

const queryClient = new QueryClient();

function Dashboard() {
  return (
    <Page width={dashboardConfig.pageWidth} header={<Header />}>
      {dashboardConfig.columns.map((col, i) => (
        <Column key={i} size={col.size}>
          {col.widgets.map((widget, j) => {
            switch (widget.type) {
              case 'stocks':
                return (
                  <StockMarket
                    key={j}
                    title={widget.title}
                    symbols={widget.symbols}
                  />
                );
              case 'rss':
                return (
                  <RSSFeed
                    key={j}
                    title={widget.title}
                    urls={widget.urls}
                    collapseAfter={widget.collapseAfter}
                    limit={widget.limit}
                  />
                );
              case 'realtime-news':
                return (
                  <RealtimeNews
                    key={j}
                    title={widget.title}
                    collapseAfter={widget.collapseAfter}
                  />
                );
            }
          })}
        </Column>
      ))}
    </Page>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  );
}
