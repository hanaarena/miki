import { useState, type ReactNode } from 'react';
import styles from './RSSFeed.module.css';

interface CollapsibleListProps {
  collapseAfter: number;
  children: ReactNode[];
}

export function CollapsibleList({ collapseAfter, children }: CollapsibleListProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = children.length > collapseAfter;
  const visible = shouldCollapse && !expanded ? children.slice(0, collapseAfter) : children;

  return (
    <div>
      {visible}
      {shouldCollapse && (
        <button
          className={styles.expandToggle}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show less' : `Show ${children.length - collapseAfter} more`}
        </button>
      )}
    </div>
  );
}
