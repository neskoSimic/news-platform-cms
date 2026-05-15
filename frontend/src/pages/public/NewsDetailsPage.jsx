import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import NewsCardComponent from "../../components/news/NewsCardComponent";
import NewsCommentComponent from "../../components/news/NewsCommentComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
import {
  addCommentToNews,
  getNewsDetailsById,
  reactToComment,
  reactToNews,
} from "../../services/api";

function NewsDetailsPage() {
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [tags, setTags] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);
  const [comments, setComments] = useState([]);

  async function loadNewsDetails() {
    const data = await getNewsDetailsById(id);

    setNews(data.news);
    setTags(data.tags);
    setRelatedNews(data.relatedNews);
    setComments(data.comments);
  }

  useEffect(() => {
    loadNewsDetails();
  }, [id]);

  async function handleAddComment(commentData) {
    try {
      const result = await addCommentToNews({
        author_name: commentData.author,
        text: commentData.text,
        news_id: id,
      });

      toast.success(result.message);

      await loadNewsDetails();
    } catch (error) {
      console.log(error);

      console.log(error.response?.data);
      toast.error("Failed to add comment");
    }
  }

  async function handleReactToNews(reactionType) {
    await reactToNews(id, reactionType);
    await loadNewsDetails();
  }
  async function handleReactToComment(commentId, reactionType) {
    await reactToComment(commentId, reactionType);
    await loadNewsDetails();
  }

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="space-y-8">
        <NewsCardComponent
          news={{ ...news, tags, relatedNews, comments }}
          reactToNews={handleReactToNews}
          reactToComment={handleReactToComment}
        />

        <NewsCommentComponent onAddComment={handleAddComment} />
      </div>

      <aside className="lg:order-last">
        <TopReactedNewsSidebar />
      </aside>
    </div>
  );
}
//spread ... da moze napraviti polje tags u news
export default NewsDetailsPage;
