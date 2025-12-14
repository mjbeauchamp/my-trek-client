import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCompass } from '@fortawesome/free-solid-svg-icons';
import styles from './PageNotFound.module.scss';

export default function PageNotFound() {
  return (
    <div className={styles['page-not-found']}>
      <div className={styles.header}>
        <FontAwesomeIcon icon={faCompass} size="2xl" />
        <h1>Whoops! - 404 Error</h1>
      </div>

      <p>Sorry, the page you’re looking for does not exist.</p>
    </div>
  );
}
