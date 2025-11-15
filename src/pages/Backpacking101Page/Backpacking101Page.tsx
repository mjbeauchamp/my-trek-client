import { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Backpacking101Page.module.scss"
import LoadingSkeletonSection from "../../components/LoadingSkeletonSection/LoadingSkeletonSection";

interface IBackpackingArticle {
  title: string;
  author: string;
  image: string;
  content: string[];
  _id: string;
}

export default function BackpackingBasicsPage() {
    const [articles, setArticles] = useState<Array<IBackpackingArticle>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');
    const [showSkeleton, setShowSkeleton] = useState(false);

    useEffect(() => {
        let timeout: number;

        if (isLoading) {
            timeout = setTimeout(() => setShowSkeleton(true), 300);
        } else {
            setShowSkeleton(false);
        }

        return () => clearTimeout(timeout);
    }, [isLoading]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch("http://localhost:4000/api/backpacking-articles");
                const data = await res.json();

                if (Array.isArray(data)) {
                    setArticles(data)
                } else {
                    throw new Error('Article data is an unexpected format.')
                }

                
            } catch (err) {
                console.error("Error fetching backpacking articles:", err);
                setError('There was a problem fetching backpacking articles');
            } finally {
                setIsLoading(false);
            }
        };

        fetchArticles();
    }, [])

    return (
        <div className={styles['articles-container']}>
            <section className={`${styles.header} content-container`}>
                <h1 className="merriweather">BACKPACKING 101</h1>
                <p>Expert advice on surviving and thriving on your outdoor adventures</p>
                <hr />
            </section>
            
            <div className="content-container flex-content-container">
                {(() => {
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

                    if (isLoading) return null;

                    if (articles.length > 0) {
                    return (
                        <section>
                        <ul>
                            {articles.map((article) => (
                            <li key={article._id} className={styles['article-card']}>
                                <Link
                                to={`/backpacking-101/${article._id}`}
                                state={{ article }}
                                >
                                <article>
                                    <img src={article.image} />
                                    <div className={styles['text-container']}>
                                        <div className={styles['article-header']}>
                                            <h2 className="merriweather">{article.title}</h2>
                                            <p>by {article.author}</p>
                                        </div>

                                        <p className={styles['article-content']}>
                                            {article.content[0]}
                                        </p>
                                    </div>
                                </article>
                                </Link>
                            </li>
                            ))}
                        </ul>
                        </section>
                    );
                    }

                    return null;
                })()}
            </div>
        </div>
    )
}