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
  let response;

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
        <Link to={`/news/${news.id}`} className="text-blue-600 hover:underline">
          {news.title}
        </Link>
      ),
    },
    {
      header: "Author",
      render: (news) => news.first_name + " " + news.last_name,
    },
    {
      header: "Date",
      render: (news) => new Date(news.published_at).toLocaleDateString(),
    },
    {
      header: "Actions",
      render: (news) => {
        const canModify = userType === "admin" || news.author_id === userId;

        if (!canModify) {
          return <span className="text-gray-400">No actions</span>;
        }

        return (
          <>
            <button onClick={() => handleEdit(news)}>Edit</button>

            <button onClick={() => handleDelete(news)}>Delete</button>
          </>
        );
      },
    },
  ];
  /*-------------------------------------------------------------------------------------------- */

  function handleAdd(enabled) {
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
      response = await deleteNews(news.id);
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
      if (editingNews) {
        response = await updateNews(editingNews.id, body);
      } else {
        response = await createNews(body);
      }

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
      <TableComponent columns={columns} data={news} />

      <button
        onClick={handleAdd}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
      >
        {enabled ? "Close Form" : "Add News"}
      </button>

      {enabled && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md"
        >
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              News Title
            </label>

            <input
              type="text"
              placeholder="Enter news title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Text
            </label>

            <textarea
              placeholder="Enter news text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="min-h-40 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tags
            </label>

            <input
              type="text"
              placeholder="Example: sport, football, world cup"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />

            <p className="mt-1 text-xs text-gray-500">
              Separate tags with commas.
            </p>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
          >
            {editingNews ? "Update News" : "Create News"}
          </button>
        </form>
      )}

      {totalPages > 0 && (
        <div className="mt-6 flex justify-center">
          <PaginationComponent
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handleChangePage}
          />
        </div>
      )}
    </div>
  );
}
export default NewsPage;
