import type { ReactNode } from 'react';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { ErrorMessage } from '../ui/ErrorMessage';
import styles from './WidgetContainer.module.css';

interface WidgetContainerProps {
  title?: string;
  titleUrl?: string;
  className?: string;
  children: ReactNode;
  isLoading?: boolean;
  error?: string | null;
}

export function WidgetContainer({
  title,
  titleUrl,
  className,
  children,
  isLoading,
  error,
}: WidgetContainerProps) {
  return (
    <div className={`${styles.widget} ${className ?? ''}`}>
      {title && (
        <div className={styles.header}>
          {titleUrl ? (
            <a href={titleUrl} target="_blank" rel="noopener noreferrer">
              {title}
            </a>
          ) : (
            title
          )}
        </div>
      )}
      <div className={styles.content}>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          children
        )}
      </div>
    </div>
  );
}
