import { Link } from "react-router-dom";

function NewsCardComponent({ news }) {
  return (
    <article className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="mb-3 flex items-center justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
          {news.category_name || "Uncategorized"}
        </span>

        <time className="text-xs font-medium text-gray-500">
          {new Date(news.published_at).toLocaleDateString()}
        </time>
      </div>

      <Link
        to={`/news/${news.id}`}
        className="block text-gray-950! no-underline"
      >
        <h2 className="mb-3 text-xl font-extrabold leading-snug text-gray-950! transition-colors hover:text-blue-700!">
          {news.title}
        </h2>
      </Link>

      <p className="text-sm leading-6 text-gray-600">
        {news.short_text}
        {news.short_text?.length >= 50 && "..."}
      </p>
    </article>
  );
}

export default NewsCardComponent;
