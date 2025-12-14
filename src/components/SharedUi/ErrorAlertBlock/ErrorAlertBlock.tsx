import styles from './ErrorAlertBlock.module.scss';
interface ErrorAlertBlockProps {
  message?: string;
}

export function ErrorAlertBlock({ message = 'Something went wrong.' }: ErrorAlertBlockProps) {
  return (
    <div className={styles['error-block']} role="alert">
      <p className={styles['error-block__message']}>{message}</p>
    </div>
  );
}
