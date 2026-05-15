import { useState } from "react";
import { commentSchema } from "../../schemas/commentSchema";

function NewsCommentComponent({ onAddComment }) {
  const [author, setAuthor] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState({});

  async function handleSubmit(e) {
    e.preventDefault();

    const result = commentSchema.safeParse({
      author,
      text,
    });

    if (!result.success) {
      const fieldErrors = {};

      result.error.issues.forEach((issue) => {
        fieldErrors[issue.path[0]] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }
    setErrors({});

    await onAddComment({
      author,
      text,
    });

    setAuthor("");
    setText("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="reveal-up overflow-hidden rounded-3xl border border-ink-750 bg-ink-850/70 shadow-elev-2"
      style={{ animationDelay: "120ms" }}
    >
      <div className="border-b border-ink-750 bg-ink-900/40 px-7 py-5">
        <h3 className="font-display text-2xl text-ink-50">
          Join the conversation
        </h3>
        <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ink-400">
          Share your perspective
        </p>
      </div>

      <div className="space-y-5 px-7 py-7">
        <div>
          <label
            htmlFor="comment-author"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300"
          >
            Your name
          </label>
          <input
            id="comment-author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="How should we address you?"
            className={`w-full rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:bg-ink-900 focus:shadow-glow-amber ${
              errors.author
                ? "border-rose-accent/60 focus:border-rose-accent"
                : "border-ink-750 focus:border-amber-accent/60"
            }`}
          />
          {errors.author && (
            <p className="mt-1.5 text-xs font-medium text-rose-accent">
              {errors.author}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="comment-text"
            className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300"
          >
            Comment
          </label>
          <textarea
            id="comment-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            className={`min-h-32 w-full resize-none rounded-xl border bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:bg-ink-900 focus:shadow-glow-amber ${
              errors.text
                ? "border-rose-accent/60 focus:border-rose-accent"
                : "border-ink-750 focus:border-amber-accent/60"
            }`}
          />
          {errors.text && (
            <p className="mt-1.5 text-xs font-medium text-rose-accent">
              {errors.text}
            </p>
          )}
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-xl bg-amber-accent px-5 py-3 text-sm font-semibold text-ink-950 transition-all duration-200 hover:bg-amber-accent-hover hover:shadow-glow-amber active:scale-[0.98]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m3 11 18-8-8 18-2-8-8-2Z" />
            </svg>
            Post comment
          </button>
        </div>
      </div>
    </form>
  );
}
export default NewsCommentComponent;
