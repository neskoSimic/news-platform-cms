import NewsRelatedSectionComponent from "./NewsRelatedSectionComponent";
import NewsTagsCardComponent from "./NewsTagsCardComponent";
function NewsCardComponent({ news }) {
  if (!news) {
    return <p className="p-10 text-center text-white">No news yet</p>;
  }

  return (
    <main className="min-h-screen bg-gray-950 px-6 py-10">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-8">
          <article className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex items-center justify-between">
              <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
                {news.category_name}
              </span>

              <span className="text-sm text-gray-500">
                {new Date(news.published_at).toLocaleDateString()}
              </span>
            </div>

            <h1 className="mb-4 text-4xl font-extrabold text-gray-950!">
              {news.title}
            </h1>

            <div className="mb-5 flex items-center justify-between border-b border-gray-100 pb-5 text-sm text-gray-500">
              <span>
                By{" "}
                <strong className="text-gray-700">
                  {news.first_name} {news.last_name}
                </strong>
              </span>

              <span>{news.visits || 0} views</span>
            </div>

            <p className="mb-6 whitespace-pre-line text-base leading-8 text-gray-700">
              {news.text}
            </p>

            <div className="mb-6">
              <NewsTagsCardComponent tags={news.tags} />
            </div>

            <div className="flex gap-3 border-t border-gray-100 pt-5">
              <button
                onClick={() => handleReactToNews("like")}
                className="rounded-full bg-gray-100 px-4 py-2 hover:bg-green-100"
              >
                👍 {news.likes || 0}
              </button>

              <button
                onClick={() => handleReactToNews("dislike")}
                className="rounded-full bg-gray-100 px-4 py-2 hover:bg-red-100"
              >
                👎 {news.dislikes || 0}
              </button>
            </div>
          </article>

          <NewsRelatedSectionComponent relatedNews={news.relatedNews} />
        </div>
      </div>
    </main>
  );
}

export default NewsCardComponent;
