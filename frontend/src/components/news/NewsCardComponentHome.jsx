import { Link } from "react-router-dom";

function NewsCardComponent({ news, index = 0 }) {
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl border border-ink-750 bg-ink-850/70 p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-amber-accent/40 hover:bg-ink-850 hover:shadow-glow-amber">
      {/* Top edge highlight */}
      <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-amber-accent/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Issue-style index marker */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-5 top-5 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-500 transition-colors duration-300 group-hover:text-amber-accent"
      >
        № {indexLabel}
      </span>

      <div className="mb-4 flex items-center gap-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-accent/30 bg-amber-soft px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-accent">
          <span className="h-1 w-1 rounded-full bg-amber-accent" />
          {news.category_name || "Uncategorized"}
        </span>
      </div>

      <Link to={`/news/${news.id}`} className="block flex-1">
        <h2 className="mb-3 font-display text-2xl leading-tight tracking-tight text-ink-50 transition-colors duration-300 group-hover:text-amber-accent">
          {news.title}
        </h2>

        <p className="text-sm leading-6 text-ink-300">
          {news.short_text}
          {news.short_text?.length >= 50 && "…"}
        </p>
      </Link>

      <div className="mt-5 flex items-center justify-between border-t border-ink-750/70 pt-4">
        <time className="font-mono text-[11px] tabular text-ink-400">
          {new Date(news.published_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>

        <Link
          to={`/news/${news.id}`}
          aria-label={`Read more about ${news.title}`}
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300 transition-colors duration-200 group-hover:text-amber-accent"
        >
          Read
          <span className="grid h-7 w-7 place-items-center rounded-full border border-ink-700 transition-all duration-300 group-hover:border-amber-accent group-hover:bg-amber-accent group-hover:text-ink-950">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-transform duration-300 group-hover:translate-x-0.5"
              aria-hidden="true"
            >
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </span>
        </Link>
      </div>
    </article>
  );
}

export default NewsCardComponent;
