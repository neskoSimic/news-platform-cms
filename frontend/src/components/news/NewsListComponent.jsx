import NewsCardComponentHome from "./NewsCardComponentHome";

function NewsListComponent({ news }) {
  if (news.length === 0) {
    return <p className="text-gray-700">No news found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {news.map((item) => (
        <NewsCardComponentHome key={item.id} news={item} />
      ))}
    </div>
  );
}
export default NewsListComponent;
