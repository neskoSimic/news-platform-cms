import { Link } from "react-router-dom";
function NewsRelatedSectionComponent({ relatedNews }) {
  return (
    <section className="rounded-2xl border border-ink-750 bg-ink-850/70 p-6 shadow-elev-1">
      <div className="mb-5 flex items-center justify-between">
        <h3 className="font-display text-xl text-ink-50">Read more</h3>
        <span className="text-[10px] uppercase tracking-[0.2em] text-ink-400">
          Related
        </span>
      </div>

      <div className="stagger-children grid grid-cols-1 gap-3 md:grid-cols-2">
        {relatedNews.map((news) => (
          <Link
            key={news.id}
            to={`/news/${news.id}`}
            className="group block rounded-xl border border-ink-750 bg-ink-900/40 p-4 transition-all duration-200 hover:border-amber-accent/40 hover:bg-ink-900"
          >
            <h4 className="font-display text-base font-medium leading-snug text-ink-100 transition-colors duration-200 group-hover:text-amber-accent">
              {news.title}
            </h4>

            <p className="mt-2 line-clamp-2 text-sm leading-6 text-ink-300">
              {news.short_text}
            </p>

            <span className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.18em] text-ink-500 transition-colors duration-200 group-hover:text-amber-accent">
              Read article
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </span>
          </Link>
        ))}

        {relatedNews.length === 0 && (
          <p className="col-span-full rounded-lg border border-dashed border-ink-750 bg-ink-900/40 p-4 text-center text-sm text-ink-400">
            No related news found.
          </p>
        )}
      </div>
    </section>
  );
}
export default NewsRelatedSectionComponent;
