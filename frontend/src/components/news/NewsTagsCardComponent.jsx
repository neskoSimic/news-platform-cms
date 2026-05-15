import { Link } from "react-router-dom";
function NewsTagsCardComponent({ tags }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <Link
          key={tag.id}
          to={`/tag/${tag.id}`}
          className="inline-flex items-center gap-1 rounded-full border border-ink-750 bg-ink-900/60 px-3 py-1 font-mono text-xs lowercase tracking-wide text-ink-200 transition-all duration-200 hover:border-amber-accent/50 hover:bg-amber-soft hover:text-amber-accent"
        >
          <span className="text-amber-accent">#</span>
          {tag.name}
        </Link>
      ))}
    </div>
  );
}
export default NewsTagsCardComponent;
