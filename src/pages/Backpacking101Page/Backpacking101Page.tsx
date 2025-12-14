import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styles from './Backpacking101Page.module.scss';
import LoadingSkeletonSection from '../../components/SharedUi/LoadingSkeletonSection/LoadingSkeletonSection';
import { ErrorAlertBlock } from '../../components/SharedUi/ErrorAlertBlock/ErrorAlertBlock';

const apiUrl = import.meta.env.VITE_API_URL;

interface IBackpackingArticle {
  title: string;
  tagline: string;
  author: string;
  imageUrl: string;
  imageAlt: string;
  content: string[];
  _id: string;
}

export default function BackpackingBasicsPage() {
  const [articles, setArticles] = useState<Array<IBackpackingArticle>>([]);
  const [isLoading, setIsLoading] = useState(true);
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
    const fetchArticles = async () => {
      setIsLoading(true);
      setError('');
      try {
        const res = await fetch(`${apiUrl}/backpacking-articles`);

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Server error');
        }

        if (Array.isArray(data)) {
          setArticles(data);
        } else {
          throw new Error('Article data is an unexpected format.');
        }
      } catch (err) {
        const message = err instanceof Error && err.message ? err.message : 'Server error fetching articles';
        console.error(message);
        setError('There was an issue fetching Backpacking 101 articles.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchArticles();
  }, []);

  const listContent = () => {
    if (isLoading && showSkeleton) {
      return (
        <div className={styles['card-skeleton']}>
          <LoadingSkeletonSection />
          <LoadingSkeletonSection />
          <LoadingSkeletonSection />
          <LoadingSkeletonSection />
          <LoadingSkeletonSection />
          <LoadingSkeletonSection />
          <LoadingSkeletonSection />
        </div>
      );
    }

    if (error) return <ErrorAlertBlock message={error} />;

    if (articles.length > 0) {
      return (
        <section>
          <ul className={styles.list}>
            {articles.map((article) => (
              <li key={article._id} className={styles['article-card']}>
                <Link to={`/backpacking-101/${article._id}`} state={{ article }}>
                  <article>
                    <img src={`/images/articles/${article.imageUrl}`} alt={article.imageAlt} />
                    <div className={styles['text-container']}>
                      <div className={styles['article-header']}>
                        <h2 className="merriweather">{article.title}</h2>
                        <p>{article.tagline}</p>
                      </div>

                      <p className={styles['article-content']}>{article.content[0]}</p>
                    </div>
                  </article>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      );
    }

    if (!isLoading && articles.length === 0 && !error) {
      return <p>No articles found.</p>;
    }

    return null;
  };

  return (
    <div className={styles['articles-container']}>
      <header className={`${styles.header} content-container`}>
        <h1 className="merriweather">BACKPACKING 101</h1>
        <p>Expert advice on getting the most out of your outdoor adventures</p>
        <hr />
      </header>

      <section className="content-container flex-content-container">{listContent()}</section>
    </div>
  );
}
