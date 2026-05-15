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
    <div>
      <header className="mb-8">
        <h1 className="font-display text-3xl tracking-tight text-ink-50 md:text-4xl">
          Latest news
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          The most recently published stories.
        </p>
      </header>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section>
          <NewsListComponent news={news} />
        </section>

        <aside className="lg:order-last">
          <TopReactedNewsSidebar />
        </aside>
      </div>
    </div>
  );
}

export default HomePage;
