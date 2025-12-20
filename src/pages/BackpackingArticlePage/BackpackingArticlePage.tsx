import { useEffect, useState } from 'react';
import { useParams, useLocation, Link } from 'react-router';
import ArticleSkeleton from '../../components/ArticleSkeleton/ArticleSkeleton';
import { ErrorAlertBlock } from '../../components/SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import styles from './BackpackingArticlePage.module.scss';
import { parseFetchError } from '../../utils/parseFetchError';

const apiUrl = import.meta.env.VITE_API_URL;

export default function BackpackingArticlePage() {
  const { articleId } = useParams();
  const location = useLocation();
  const [article, setArticle] = useState(location.state?.article);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (isLoading) {
      const timeout = setTimeout(() => setShowSkeleton(true), 300);

      return () => clearTimeout(timeout);
    } else {
      setShowSkeleton(false);
    }
  }, [isLoading]);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) {
        console.error('No articleId found');
        setError('There was a problem fetching the article. Article ID not found');
        return;
      }

      setIsLoading(true);
      setError('');

      try {
        const res = await fetch(`${apiUrl}/backpacking-articles/${articleId}`);

        if (!res.ok) {
          const message = await parseFetchError(res);
          console.error(`There was an issue fetching article: ${message}`);
          setError(`There was a problem fetching the article: ${message}`);
          return;
        }

        const data = await res.json();

        if (data.title && data.content && data.imageUrl) {
          setArticle(data);
        } else {
          throw new Error('Article data is an unexpected format.');
        }
      } catch (err) {
        const message = err instanceof Error && err.message ? err.message : 'Server error fetching article';
        console.error(message);
        setError('There was an issue fetching the article.');
      } finally {
        setIsLoading(false);
      }
    };

    if (!article) {
      // fallback to fetch by id if router state isn't available
      fetchArticle();
    }
  }, [article, articleId]);

  const renderContent = () => {
    if (isLoading && showSkeleton) {
      return <ArticleSkeleton />;
    }

    if (error) return <ErrorAlertBlock message={error} />;

    if (article && article.title && article.content && article.imageUrl) {
      return (
        <article>
          <header>
            <h1 className={`fjord-one ${styles.title}`}>{article.title}</h1>
            {article.tagline && <p className={styles.tagline}>{article.tagline}</p>}
            {article.author && <address className={styles.byline}>By {article.author}</address>}
          </header>

          <hr />

          {article.imageUrl && <img src={`/images/articles/large/${article.imageUrl}`} alt={article.imageAlt} />}

          <section className={styles.copy}>
            {article.content.map((paragraph: string, i: number) => {
              return <p key={i}>{paragraph}</p>;
            })}
          </section>
        </article>
      );
    }

    if (!isLoading && !error) {
      return <p>No article found.</p>;
    }

    return null;
  };

  return (
    <div className={`${styles['article-content']}`}>
      <Link to="/backpacking-101" className="back-link">
        <FontAwesomeIcon icon={faArrowLeft} size="sm" />
        <span>Backpacking 101</span>
      </Link>
      {renderContent()}
    </div>
  );
}
