import { useEffect, useState } from "react";
import NewsListComponent from "../../components/news/NewsListComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
import { getLatestNewsHomePage } from "../../services/api";

function HomePage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchSearchResults() {
      const data = await getLatestNewsHomePage();

      setNews(data.news);
    }
    fetchSearchResults();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-10">
        <h1 className="mb-3 text-4xl font-extrabold tracking-tight text-gray-900">
          Latest News & Updates
        </h1>

        <p className="max-w-2xl text-lg leading-7 text-gray-600">
          Stay informed with the latest stories from sports, technology, gaming,
          business, and world events. Browse the 10 most recently published news
          articles from our platform.
        </p>
      </div>

      <div>
        <NewsListComponent news={news} />
      </div>
      <div>
        <TopReactedNewsSidebar />
      </div>
    </div>
  );
}

export default HomePage;
