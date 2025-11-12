import { useParams, useLocation } from "react-router";

export default function BackpackingArticlePage() {
    const {articleId} = useParams();
    const { state } = useLocation();
    const { article } = state || {};
    
    return (
        <div>
            SINGLE ARTICLE
            <p>{article?.title}</p>
            <p>{article?.author}</p>
        </div>
    )
}