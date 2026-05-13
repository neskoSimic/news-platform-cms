import { Link } from "react-router-dom";
function NewsTagsCardComponent({ tags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          to={`/tag/${tag.id}`}
          className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700 no-underline hover:bg-blue-100"
        >
          #{tag.name}
        </Link>
      ))}
    </div>
  );
}
export default NewsTagsCardComponent;
