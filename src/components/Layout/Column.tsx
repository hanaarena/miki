import type { ReactNode } from 'react';
import styles from './Column.module.css';

interface ColumnProps {
  size: 'small' | 'full';
  children: ReactNode;
}

export function Column({ size, children }: ColumnProps) {
  return (
    <div className={`${styles.column} ${styles[size]}`}>
      {children}
    </div>
  );
}
