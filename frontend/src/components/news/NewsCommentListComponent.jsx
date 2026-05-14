function NewsCommentListComponent({ comments, onReactToComment }) {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <div className="mb-3 flex items-center justify-between">
            <strong className="text-gray-900">{comment.author_name}</strong>

            <span className="text-xs text-gray-500">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>

          <p className="mb-4 text-sm leading-6 text-gray-700">{comment.text}</p>

          <div className="flex gap-3">
            <button
              onClick={() => onReactToComment(comment.id, "like")}
              className="rounded-full bg-gray-100 px-4 py-2 hover:bg-green-100"
            >
              👍 {comment.likes || 0}
            </button>

            <button
              onClick={() => onReactToComment(comment.id, "dislike")}
              className="rounded-full bg-gray-100 px-4 py-2 hover:bg-red-100"
            >
              👎 {comment.dislikes || 0}
            </button>
          </div>
        </div>
      ))}

      {comments.length === 0 && (
        <p className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
          No comments yet. Be the first to comment.
        </p>
      )}
    </div>
  );
}
export default NewsCommentListComponent;
