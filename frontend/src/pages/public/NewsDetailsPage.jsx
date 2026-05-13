import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import NewsCardComponent from "../../components/news/NewsCardComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
import { getNewsDetailsById } from "../../services/api";

function NewsDetailsPage() {
  const { id } = useParams();
  const [news, setNews] = useState([]);
  const [tags, setTags] = useState([]);
  const [relatedNews, setRelatedNews] = useState([]);

  useEffect(() => {
    async function fetchSearchResults() {
      const data = await getNewsDetailsById(id);

      setNews(data.news);
      setTags(data.tags);
      setRelatedNews(data.relatedNews);
    }
    fetchSearchResults();
  }, [id]);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900"></h1>
      </div>

      <div>
        <NewsCardComponent news={{ ...news, tags, relatedNews }} />
      </div>

      <div>
        <TopReactedNewsSidebar />
      </div>
    </div>
  );
}
//spread ... da moze napraviti polje tags u news
export default NewsDetailsPage;
