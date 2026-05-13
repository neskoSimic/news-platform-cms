import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTopReactedNews } from "../../services/api";

function TopReactedNewsSidebar() {
  const [topNews, setTopNews] = useState([]);

  useEffect(() => {
    async function loadTopNews() {
      const data = await getTopReactedNews();
      setTopNews(data.news || []);
    }

    loadTopNews();
  }, []);

  return (
    <aside className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">
        Most reacted news
      </h3>

      <div className="space-y-3">
        {topNews.map((news) => (
          <Link
            key={news.id}
            to={`/news/${news.id}`}
            className="block rounded-xl bg-gray-50 p-3 text-sm font-semibold text-gray-800 no-underline hover:bg-blue-50 hover:text-blue-700"
          >
            {news.title}
          </Link>
        ))}
      </div>
    </aside>
  );
}
export default TopReactedNewsSidebar;
