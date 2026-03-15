import type { StockData } from '../../../types/stock';
import { Sparkline } from './Sparkline';
import styles from './StockMarket.module.css';

interface StockItemProps {
  stock: StockData;
}

export function StockItem({ stock }: StockItemProps) {
  const isPositive = stock.percentChange >= 0;
  const sign = isPositive ? '+' : '';
  const changeClass = isPositive ? styles.positive : styles.negative;

  return (
    <div className={styles.item}>
      <div className={styles.info}>
        <span className={styles.symbol}>{stock.symbol}</span>
        <span className={styles.name}>{stock.name}</span>
      </div>
      <div className={styles.chart}>
        <Sparkline points={stock.chartPoints} positive={isPositive} />
      </div>
      <div className={styles.values}>
        <span className={changeClass}>
          {sign}{stock.percentChange.toFixed(2)}%
        </span>
        <span className={styles.price}>
          {stock.currency === 'USD' ? '$' : ''}{stock.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
}
