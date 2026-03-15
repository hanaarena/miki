import styles from './ErrorMessage.module.css';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <div className={styles.error}>
      <span className={styles.icon}>!</span>
      <span>{message}</span>
    </div>
  );
}
