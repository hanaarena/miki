import { useRSSFeed } from '../../../hooks/useRSSFeed';
import { WidgetContainer } from '../WidgetContainer';
import { CollapsibleList } from './CollapsibleList';
import { RSSItem } from './RSSItem';

interface RSSFeedProps {
  title?: string;
  urls: string[];
  collapseAfter?: number;
  limit?: number;
}

export function RSSFeed({
  title = 'Feed',
  urls,
  collapseAfter = 8,
  limit = 20,
}: RSSFeedProps) {
  const { data, isLoading, error } = useRSSFeed(urls, limit);

  return (
    <WidgetContainer
      title={title}
      isLoading={isLoading}
      error={error ? 'Failed to load feed' : null}
    >
      {data && data.length > 0 ? (
        <CollapsibleList collapseAfter={collapseAfter}>
          {data.map((item, i) => (
            <RSSItem key={`${item.link}-${i}`} item={item} />
          ))}
        </CollapsibleList>
      ) : (
        <div style={{ color: 'var(--color-text-base-muted)' }}>No items to show</div>
      )}
    </WidgetContainer>
  );
}
