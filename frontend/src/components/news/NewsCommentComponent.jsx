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
      className="rounded-3xl bg-white p-6 shadow-lg"
    >
      <h3 className="mb-5 text-center text-2xl font-extrabold text-gray-900">
        Add new comment
      </h3>

      {errors.author && (
        <p className="mb-2 text-sm font-medium text-red-500">{errors.author}</p>
      )}

      <input
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        placeholder="Your name"
        className={`mb-4 w-full rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 ${
          errors.author ? "border-red-500" : "border-gray-200"
        }`}
      />

      {errors.text && (
        <p className="mb-2 text-sm font-medium text-red-500">{errors.text}</p>
      )}

      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Your comment"
        className={`mb-5 min-h-32 w-full resize-none rounded-2xl border px-4 py-3 outline-none transition focus:ring-2 focus:ring-blue-500 ${
          errors.text ? "border-red-500" : "border-gray-200"
        }`}
      />

      <div className="flex justify-center">
        <button
          type="submit"
          className="rounded-2xl bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-700"
        >
          Submit comment
        </button>
      </div>
    </form>
  );
}
export default NewsCommentComponent;
