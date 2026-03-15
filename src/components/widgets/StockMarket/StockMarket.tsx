import { useStocks } from '../../../hooks/useStocks';
import { WidgetContainer } from '../WidgetContainer';
import { StockItem } from './StockItem';
import styles from './StockMarket.module.css';

interface StockMarketProps {
  title?: string;
  symbols: string[];
}

export function StockMarket({ title = 'Markets', symbols }: StockMarketProps) {
  const { data, isLoading, error } = useStocks(symbols);

  return (
    <WidgetContainer
      title={title}
      isLoading={isLoading}
      error={error ? 'Failed to load market data' : null}
    >
      <div className={styles.list}>
        {data?.map((stock) => (
          <StockItem key={stock.symbol} stock={stock} />
        ))}
      </div>
    </WidgetContainer>
  );
}
