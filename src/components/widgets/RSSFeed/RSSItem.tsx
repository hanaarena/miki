import type { RSSItem as RSSItemType } from '../../../types/rss';
import { TimeAgo } from '../../ui/TimeAgo';
import styles from './RSSFeed.module.css';

interface RSSItemProps {
  item: RSSItemType;
}

export function RSSItem({ item }: RSSItemProps) {
  return (
    <div className={styles.item}>
      {item.thumbnail && (
        <img
          className={styles.thumbnail}
          src={item.thumbnail}
          alt=""
          loading="lazy"
        />
      )}
      <div className={styles.itemContent}>
        <a
          href={item.link}
          className={styles.title}
          target="_blank"
          rel="noopener noreferrer"
        >
          {item.title}
        </a>
        <div className={styles.meta}>
          <TimeAgo date={item.publishedAt} />
          <span className={styles.separator}>|</span>
          <span className={styles.source}>{item.source}</span>
        </div>
      </div>
    </div>
  );
}
