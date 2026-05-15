function NewsCommentListComponent({ comments, onReactToComment }) {
  return (
    <div className="space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-2xl border border-ink-750 bg-ink-850/80 p-5 transition-colors duration-200 hover:border-ink-700"
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-sky-accent/30 to-sky-accent/10 font-mono text-xs font-bold text-sky-accent">
                {comment.author_name?.[0]?.toUpperCase()}
              </span>
              <strong className="text-sm font-semibold text-ink-50">
                {comment.author_name}
              </strong>
            </div>

            <span className="font-mono text-[11px] tabular text-ink-400">
              {new Date(comment.created_at).toLocaleDateString(undefined, {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <p className="mb-4 text-sm leading-6 text-ink-200">{comment.text}</p>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onReactToComment(comment.id, "like")}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-750 bg-ink-900/60 px-3 py-1.5 text-xs text-ink-300 transition-all duration-200 hover:border-emerald-accent/50 hover:bg-emerald-soft hover:text-emerald-accent"
            >
              👍 <span className="font-mono tabular">{comment.likes || 0}</span>
            </button>

            <button
              onClick={() => onReactToComment(comment.id, "dislike")}
              className="inline-flex items-center gap-1.5 rounded-full border border-ink-750 bg-ink-900/60 px-3 py-1.5 text-xs text-ink-300 transition-all duration-200 hover:border-rose-accent/50 hover:bg-rose-soft hover:text-rose-accent"
            >
              👎{" "}
              <span className="font-mono tabular">{comment.dislikes || 0}</span>
            </button>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <p className="rounded-xl border border-dashed border-ink-750 bg-ink-900/40 p-5 text-center text-sm text-ink-400">
          No comments yet. Be the first to share your thoughts.
        </p>
      )}
    </div>
  );
}
export default NewsCommentListComponent;
