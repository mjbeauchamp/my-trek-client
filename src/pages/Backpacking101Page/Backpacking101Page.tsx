import { useEffect, useState } from "react";
import { Link } from "react-router";
import styles from "./Backpacking101Page.module.scss"

interface IBackpackingArticle {
  title: string;
  author: string;
  date: string;
  image: string;
  content: string[];
  _id: string;
}

export default function BackpackingBasicsPage() {
    const [articles, setArticles] = useState<Array<IBackpackingArticle>>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

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
        <div>
            <h1>BACKPACKING 101</h1>
            <div className="content-container">
                {
                    isLoading ? <p>Loading...</p> :
                    <section>
                        <ul>
                            {articles.map(article => {
                                return (
                                    <li key={article._id} className={styles['article-card']}>
                                        <Link to={`/backpacking-101/${article._id}`} state={{article}}>
                                            <article>
                                                <img src={article.image}/>
                                                <div className={styles['text-container']}>
                                                    <div className={styles['header']}>
                                                        <div>
                                                            <h2>{article.title}</h2>
                                                            <p>{article.author}</p>
                                                        </div>

                                                        <p>{article.date}</p>
                                                    </div>
                                                    
                                                    <p>{article.content[0]}</p>
                                                </div>
                                                
                                            </article>
                                        </Link>
                                    </li>
                                )
                            })}
                        </ul> 
                    </section>
                }
            </div>
        </div>
    )
}