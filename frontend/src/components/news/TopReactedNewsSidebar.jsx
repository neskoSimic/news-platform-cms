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
    <aside className="reveal-up sticky top-24 overflow-hidden rounded-2xl border border-ink-750 bg-ink-850/70 shadow-elev-1" style={{ animationDelay: "240ms" }}>
      <div className="border-b border-ink-750 bg-gradient-to-br from-amber-soft to-transparent px-5 py-4">
        <div className="flex items-center gap-2.5">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-amber-accent/20 text-amber-accent">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M12 2 9.91 8.26 3 9.27l5 4.87L6.82 21 12 17.77 17.18 21 16 14.14l5-4.87-6.91-1.01L12 2Z" />
            </svg>
          </span>
          <div>
            <h3 className="font-display text-base text-ink-50">Most Reacted</h3>
            <p className="text-[10px] uppercase tracking-[0.18em] text-ink-400">
              Trending now
            </p>
          </div>
        </div>
      </div>

      <ol className="stagger-children divide-y divide-ink-750/60" style={{ "--stagger-step": "55ms" }}>
        {topNews.map((news, idx) => (
          <li key={news.id}>
            <Link
              to={`/news/${news.id}`}
              className="group flex items-start gap-3 px-5 py-4 transition-colors duration-200 hover:bg-ink-800/60"
            >
              <span className="mt-0.5 grid h-7 w-7 shrink-0 place-items-center rounded-full border border-ink-750 bg-ink-900 font-mono text-xs font-bold text-ink-300 transition-colors group-hover:border-amber-accent/50 group-hover:text-amber-accent">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="block text-sm font-medium leading-5 text-ink-100 transition-colors group-hover:text-amber-accent">
                {news.title}
              </span>
            </Link>
          </li>
        ))}

        {topNews.length === 0 && (
          <li className="px-5 py-8 text-center text-sm text-ink-400">
            Nothing trending yet.
          </li>
        )}
      </ol>
    </aside>
  );
}
export default TopReactedNewsSidebar;
