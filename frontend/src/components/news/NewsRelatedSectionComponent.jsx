import { Link } from "react-router-dom";
function NewsRelatedSectionComponent({ relatedNews }) {
  return (
    <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      <h3 className="mb-4 text-lg font-bold text-gray-900">Read more...</h3>

      <div className="space-y-3">
        {relatedNews.map((news) => (
          <Link
            key={news.id}
            to={`/news/${news.id}`}
            className="block rounded-xl bg-gray-50 p-4 no-underline hover:bg-blue-50"
          >
            <h4 className="font-bold text-gray-900 hover:text-blue-700">
              {news.title}
            </h4>

            <p className="mt-2 text-sm text-gray-600">{news.short_text}</p>
          </Link>
        ))}

        {relatedNews.length === 0 && (
          <p className="text-sm text-gray-500">No related news found.</p>
        )}
      </div>
    </section>
  );
}
export default NewsRelatedSectionComponent;
