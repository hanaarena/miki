import type { ReactNode } from 'react';
import styles from './Page.module.css';

interface PageProps {
  width?: 'slim' | 'default' | 'wide';
  header?: ReactNode;
  children: ReactNode;
}

export function Page({ width = 'default', header, children }: PageProps) {
  const widthClass = width !== 'default' ? styles[width] : '';

  return (
    <div className={`${styles.page} ${widthClass}`}>
      {header}
      <div className={styles.columns}>
        {children}
      </div>
    </div>
  );
}
