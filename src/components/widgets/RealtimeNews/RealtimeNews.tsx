import { useRealtimeNews } from '../../../hooks/useRealtimeNews';
import { WidgetContainer } from '../WidgetContainer';
import { CollapsibleList } from '../RSSFeed/CollapsibleList';
import styles from './RealtimeNews.module.css';

interface RealtimeNewsProps {
  title?: string;
  collapseAfter?: number;
}

export function RealtimeNews({
  title = 'Realtime News',
  collapseAfter = 8,
}: RealtimeNewsProps) {
  const { data, isLoading, error } = useRealtimeNews();

  return (
    <WidgetContainer
      title={title}
      titleUrl="https://www.zhitongcaijing.com/immediately.html"
      isLoading={isLoading}
      error={error ? 'Failed to load news' : null}
    >
      {data && data.length > 0 ? (
        <CollapsibleList collapseAfter={collapseAfter}>
          {data.map((item) => (
            <div
              key={item.id}
              className={`${styles.item} ${item.important ? styles.important : ''}`}
            >
              <span className={styles.time}>{item.createTimeDesc}</span>
              <span className={styles.content}>{item.content}</span>
            </div>
          ))}
        </CollapsibleList>
      ) : (
        <div style={{ color: 'var(--color-text-base-muted)' }}>
          No items to show
        </div>
      )}
    </WidgetContainer>
  );
}
