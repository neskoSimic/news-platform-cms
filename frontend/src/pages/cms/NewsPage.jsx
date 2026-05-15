import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PaginationComponent from "../../components/PaginationComponent";
import TableComponent from "../../components/TableComponent";
import { useAuth } from "../../contexts/AuthContext";
import { newsSchema } from "../../schemas/newsSchema";
import {
  createNews,
  deleteNews,
  getAllNewsByCategory,
  getCategoriesListCms,
  getNewsCms,
  getNewsDetailsById,
  updateNews,
} from "../../services/api";

function NewsPage() {
  const { user } = useAuth();

  const userId = user?.id;
  const userType = user?.user_type;

  const { id } = useParams();

  const [news, setNews] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState([]);
  const limit = 10;

  const [enabled, setEnabled] = useState(false);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [text, setText] = useState("");
  const [tags, setTags] = useState("");
  const [editingNews, setEditingNews] = useState(null);

  async function fetchNews(page, limit) {
    const data = await getNewsCms(page, limit);
    const data2 = await getCategoriesListCms();

    setNews(data.news);
    setTotalPages(data.totalPages);
    setCategories(data2.categories);
  }
  async function fetchTags(id) {
    const data = await getNewsDetailsById(id);
    setTags(data.tags.map((tag) => tag.name).join(", "));
  }

  async function fetchNewsByCategory(id, page, limit) {
    const data = await getAllNewsByCategory(id, page, limit);
    const data2 = await getCategoriesListCms();

    setNews(data.news);
    setTotalPages(data.totalPages);
    setCategories(data2.categories);
  }

  useEffect(() => {
    async function loadNews() {
      try {
        if (id) {
          await fetchNewsByCategory(id, page, limit);
        } else {
          await fetchNews(page, limit);
        }
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to fetch news");
      }
    }

    loadNews();
  }, [page, id]);

  function handleChangePage(newPage) {
    if (newPage < 1 || newPage > totalPages) {
      return;
    }

    setSearchParams({
      page: newPage,
    });
  }

  const columns = [
    {
      header: "Title",
      render: (news) => (
        <Link
          to={`/news/${news.id}`}
          className="font-medium text-ink-50 underline-offset-4 transition-colors hover:text-amber-accent hover:underline"
        >
          {news.title}
        </Link>
      ),
    },
    {
      header: "Author",
      render: (news) => (
        <span className="inline-flex items-center gap-2">
          <span className="grid h-7 w-7 place-items-center rounded-full bg-gradient-to-br from-amber-accent/30 to-amber-accent/10 font-mono text-[10px] font-bold text-amber-accent">
            {news.first_name?.[0]}
            {news.last_name?.[0]}
          </span>
          <span className="text-ink-200">
            {news.first_name} {news.last_name}
          </span>
        </span>
      ),
    },
    {
      header: "Date",
      render: (news) => (
        <span className="font-mono text-xs tabular text-ink-300">
          {new Date(news.published_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (news) => {
        const canModify = userType === "admin" || news.author_id === userId;

        if (!canModify) {
          return (
            <span className="text-xs italic text-ink-500">No actions</span>
          );
        }

        return (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => handleEdit(news)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-all duration-200 hover:border-sky-accent/50 hover:bg-sky-soft hover:text-sky-accent"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
              Edit
            </button>

            <button
              onClick={() => handleDelete(news)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-ink-700 bg-ink-850 px-3 py-1.5 text-xs font-medium text-ink-200 transition-all duration-200 hover:border-rose-accent/50 hover:bg-rose-soft hover:text-rose-accent"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M3 6h18M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6M10 11v6M14 11v6M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
              </svg>
              Delete
            </button>
          </div>
        );
      },
    },
  ];
  /*-------------------------------------------------------------------------------------------- */

  function handleAdd() {
    setEnabled((prev) => !prev);
    setEditingNews(null);
  }

  function handleEdit(news) {
    setEnabled(true);

    setEditingNews(news);

    setTitle(news.title);
    setText(news.text);
    setCategoryId(String(news.category_id));
    fetchTags(news.id);
  }

  async function handleDelete(news) {
    try {
      const response = await deleteNews(news.id);
      toast.success(response.message);
      if (id) {
        await fetchNewsByCategory(id, page, limit);
      } else {
        await fetchNews(page, limit);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = newsSchema.safeParse({
      title,
      category_id: categoryId,
      text,
      tags,
    });

    if (!result.success) {
      const firstError = result.error.issues[0].message;

      toast.error(firstError);

      return;
    }

    try {
      const body = {
        title,
        category_id: Number(categoryId),
        text,
        tags: tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ""),
      };
      const response = editingNews ? await updateNews(editingNews.id, body) : await createNews(body);

      toast.success(response.message);
      setTitle("");
      setText("");
      setCategoryId("");
      setTags("");
      if (id) {
        await fetchNewsByCategory(id, page, limit);
      } else {
        await fetchNews(page, limit);
      }

      setEditingNews(null);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  return (
    <div>
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-ink-750/70 pb-6">
        <div>
          <p className="mb-2 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-amber-accent">
            <span className="h-px w-8 bg-amber-accent/60" />
            CMS · Newsroom
          </p>
          <h1 className="font-display text-4xl tracking-tight text-ink-50">
            News articles
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-400">
            Compose, refine and retire articles. Authors and admins manage their
            own work in this view.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all duration-200 active:scale-[0.98] ${
            enabled
              ? "border border-ink-700 bg-ink-850 text-ink-200 hover:border-rose-accent/40 hover:bg-rose-soft hover:text-rose-accent"
              : "bg-amber-accent text-ink-950 hover:bg-amber-accent-hover hover:shadow-glow-amber"
          }`}
        >
          {enabled ? (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              Close form
            </>
          ) : (
            <>
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add news
            </>
          )}
        </button>
      </header>

      {enabled && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 overflow-hidden rounded-2xl border border-ink-750 bg-ink-850/60 shadow-elev-1"
        >
          <div className="border-b border-ink-750 bg-ink-900/40 px-6 py-4">
            <h2 className="font-display text-lg text-ink-50">
              {editingNews ? "Edit article" : "New article"}
            </h2>
            <p className="mt-1 text-xs text-ink-400">
              All fields are required.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                News title
              </label>

              <input
                type="text"
                placeholder="A clear, compelling headline"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                Category
              </label>

              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full appearance-none rounded-xl border border-ink-750 bg-ink-900/60 bg-[length:14px] bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='%23a1a1aa' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")",
                }}
              >
                <option value="">Select category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                Body
              </label>

              <textarea
                placeholder="Write your story here…"
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-44 w-full resize-y rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm leading-7 text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                Tags
              </label>

              <input
                type="text"
                placeholder="sport, football, world-cup"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
              />

              <p className="mt-1.5 text-[11px] text-ink-500">
                Separate tags with commas.
              </p>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-accent px-5 py-2.5 text-sm font-semibold text-ink-950 transition-all duration-200 hover:brightness-110 active:scale-[0.98]"
              >
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M20 6 9 17l-5-5" />
                </svg>
                {editingNews ? "Update news" : "Create news"}
              </button>
            </div>
          </div>
        </form>
      )}

      <TableComponent columns={columns} data={news} />

      {totalPages > 0 && (
        <PaginationComponent
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handleChangePage}
        />
      )}
    </div>
  );
}
export default NewsPage;
