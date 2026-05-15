import { useEffect, useState } from "react";
import NewsListComponent from "../../components/news/NewsListComponent";
import TopReactedNewsSidebar from "../../components/news/TopReactedNewsSidebar";
import { getMostReadNewsHomePage } from "../../services/api";

function MostReadPage() {
  const [news, setNews] = useState([]);

  useEffect(() => {
    async function fetchSearchResults() {
      const data = await getMostReadNewsHomePage();

      setNews(data.news);
    }
    fetchSearchResults();
  }, []);

  return (
    <div>
      <header className="mb-10 border-b border-ink-750/70 pb-8">
        <p className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
          <span className="h-px w-8 bg-amber-accent/60" />
          30-day digest
        </p>
        <h1 className="mb-3 max-w-3xl font-display text-5xl leading-[1.05] tracking-tight text-ink-50 md:text-6xl">
          The stories readers <em className="text-amber-accent">couldn&apos;t</em> ignore.
        </h1>

        <p className="max-w-2xl text-base leading-7 text-ink-300">
          A monthly snapshot of what captured our audience&apos;s attention —
          ranked strictly by reads.
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

export default MostReadPage;
