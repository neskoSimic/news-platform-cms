import NewsCardComponentHome from "./NewsCardComponentHome";

function NewsListComponent({ news }) {
  if (news.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-ink-750 bg-ink-850/40 px-8 py-14 text-center">
        <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-ink-750 bg-ink-900 text-ink-500">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M4 4h16v16H4zM4 9h16M9 20V9" />
          </svg>
        </div>
        <p className="mt-4 font-display text-xl text-ink-100">
          No stories yet
        </p>
        <p className="mt-1 text-sm text-ink-400">
          Check back soon — fresh editorial coverage is on its way.
        </p>
      </div>
    );
  }

  return (
    <div className="stagger-children grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {news.map((item, idx) => (
        <NewsCardComponentHome key={item.id} news={item} index={idx} />
      ))}
    </div>
  );
}
export default NewsListComponent;
