import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import styles from './Backpacking101Page.module.scss';
import LoadingSkeletonSection from '../../components/SharedUi/LoadingSkeletonSection/LoadingSkeletonSection';
import { ErrorAlertBlock } from '../../components/SharedUi/ErrorAlertBlock/ErrorAlertBlock';
import { parseFetchError } from '../../utils/parseFetchError';

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

        if (!res.ok) {
          const message = await parseFetchError(res);
          console.error('Error fetching articles:', message);
          throw new Error(message);
        }

        const data = await res.json();

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

  const getArticlePreview = (article: IBackpackingArticle) => {
    if (Array.isArray(article?.content) && typeof article.content[0] === 'string') {
      return article.content[0].length <= 80 ? article.content[0] : `${article.content[0].slice(0, 80).trim()}...`;
    }
    return '';
  };

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
        <ul className={styles.list}>
          {articles.map((article) => (
            <li key={article._id} className={styles['article-card']}>
              <Link to={`/backpacking-101/${article._id}`} state={{ article }}>
                <article>
                  <img src={`/images/articles/${article.imageUrl}`} alt={article.imageAlt} />
                  <div className={styles['text-container']}>
                    <div className={styles['article-header']}>
                      <h2 className="merriweather warm-text">{article.title}</h2>
                      <p>{article.tagline}</p>
                    </div>

                    <p className={styles['article-content']}>{getArticlePreview(article)}</p>
                  </div>
                </article>
              </Link>
            </li>
          ))}
        </ul>
      );
    }

    if (!isLoading && articles.length === 0 && !error) {
      return <p>No articles found.</p>;
    }

    return null;
  };

  return (
    <div className={`base-padding-top ${styles['articles-container']}`}>
      <header className={`${styles.header} content-container`}>
        <h1 className="fjord-one warm-text">BACKPACKING 101</h1>
        <p className="warm-text">Expert advice on getting the most out of your outdoor adventures</p>
        <hr className={styles['articles-section-line']} />
      </header>

      <section className="content-container flex-content-container">{listContent()}</section>
    </div>
  );
}
