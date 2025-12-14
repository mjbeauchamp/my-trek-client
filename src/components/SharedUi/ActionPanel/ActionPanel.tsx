import styles from './ActionPanel.module.scss';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface PanelProps {
  title: string;
  headingTag?: HeadingLevel;
  children: React.ReactNode;
}

export default function ActionPanel({ title, headingTag = 'h2', children }: PanelProps) {
  const HeadingTag = headingTag;

  return (
    <section className={styles['action-panel']}>
      <header className={styles.header}>
        <HeadingTag>{title}</HeadingTag>
      </header>

      <div className={styles.body}>{children}</div>
    </section>
  );
}
