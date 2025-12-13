import styles from './ArticleSkeleton.module.scss';

export default function ArticleSkeleton() {
  return (
    <article className={styles['article-skeleton']}>
      <div className={styles['text-placeholder']}>
        <div className={styles['title-placeholder']} />
        <div className={styles['author-placeholder']} />
      </div>
      <div className={styles['image-placeholder']} />
      <div className={styles['text-placeholder']}>
        <div className={styles['line-placeholder']} />
        <div className={styles['line-placeholder']} />
        <div className={styles['line-placeholder']} />
        <div className={styles['line-placeholder']} />
      </div>
    </article>
  );
}
