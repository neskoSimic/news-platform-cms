import NewsCommentListComponent from "./NewsCommentListComponent";
import NewsRelatedSectionComponent from "./NewsRelatedSectionComponent";
import NewsTagsCardComponent from "./NewsTagsCardComponent";
function NewsCardComponent({ news, reactToNews, reactToComment }) {
  if (!news) {
    return (
      <p className="rounded-2xl border border-ink-750 bg-ink-850/60 p-10 text-center text-ink-400">
        No news yet
      </p>
    );
  }

  return (
    <div className="space-y-8">
      <article className="reveal-up overflow-hidden rounded-3xl border border-ink-750 bg-ink-850/70 shadow-elev-2">
        <div className="border-b border-ink-750 bg-ink-900/50 px-8 py-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-accent/30 bg-amber-soft px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-accent">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-accent" />
              {news.category_name}
            </span>

            <time className="font-mono text-xs tabular text-ink-400">
              {news.published_at &&
                new Date(news.published_at).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
            </time>
          </div>
        </div>

        <div className="px-8 py-8">
          <h1 className="mb-5 font-display text-4xl leading-[1.05] tracking-tight text-ink-50 md:text-5xl">
            {news.title}
          </h1>

          <div className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-ink-750/70 pb-5 text-sm">
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-amber-accent/30 to-amber-accent/10 font-mono text-xs font-bold text-amber-accent">
                {news.first_name?.[0]}
                {news.last_name?.[0]}
              </span>
              <div className="leading-tight">
                <p className="text-[10px] uppercase tracking-[0.2em] text-ink-500">
                  By
                </p>
                <p className="font-medium text-ink-100">
                  {news.first_name} {news.last_name}
                </p>
              </div>
            </div>

            <span className="inline-flex items-center gap-1.5 font-mono text-xs tabular text-ink-300">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
              {news.visits || 0} views
            </span>
          </div>

          <p className="whitespace-pre-line text-base leading-8 text-ink-200">
            {news.text}
          </p>

          <div className="mt-8">
            <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-ink-500">
              Tagged
            </p>
            <NewsTagsCardComponent tags={news.tags} />
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3 border-t border-ink-750/70 pt-6">
            <span className="mr-2 text-[10px] uppercase tracking-[0.2em] text-ink-500">
              React
            </span>
            <button
              onClick={() => reactToNews("like")}
              className="group inline-flex items-center gap-2 rounded-full border border-ink-750 bg-ink-900/60 px-4 py-2 text-sm text-ink-200 transition-all duration-200 hover:border-emerald-accent/50 hover:bg-emerald-soft hover:text-emerald-accent"
            >
              <span className="text-base">👍</span>
              <span className="font-mono tabular">{news.likes || 0}</span>
            </button>

            <button
              onClick={() => reactToNews("dislike")}
              className="group inline-flex items-center gap-2 rounded-full border border-ink-750 bg-ink-900/60 px-4 py-2 text-sm text-ink-200 transition-all duration-200 hover:border-rose-accent/50 hover:bg-rose-soft hover:text-rose-accent"
            >
              <span className="text-base">👎</span>
              <span className="font-mono tabular">{news.dislikes || 0}</span>
            </button>
          </div>
        </div>

        <div className="border-t border-ink-750 bg-ink-900/40 px-8 py-7">
          <h3 className="mb-5 flex items-center gap-2 font-display text-lg text-ink-50">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-amber-accent"
              aria-hidden="true"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Conversation
            <span className="ml-1 rounded-full bg-ink-800 px-2 py-0.5 font-mono text-[11px] tabular text-ink-300">
              {news.comments?.length || 0}
            </span>
          </h3>
          <NewsCommentListComponent
            comments={news.comments}
            onReactToComment={reactToComment}
          />
        </div>
      </article>

      <NewsRelatedSectionComponent relatedNews={news.relatedNews} />
    </div>
  );
}

export default NewsCardComponent;
