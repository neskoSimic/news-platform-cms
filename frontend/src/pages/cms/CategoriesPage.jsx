import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import PaginationComponent from "../../components/PaginationComponent";
import TableComponent from "../../components/TableComponent";
import { categorySchema } from "../../schemas/categorySchema";
import {
  createCategory,
  deleteCategory,
  getCategoriesCms,
  updateCategory,
} from "../../services/api";

function CategoriesPage() {
  const [categories, setCategorise] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const limit = 10;
  const [enabled, setEnabled] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [totalPages, setTotalPages] = useState(1);


  async function fetchCategories(page, limit) {
    const data = await getCategoriesCms(page, limit);

    setCategorise(data.categories);
    setTotalPages(data.totalPages);
  }

  useEffect(() => {
    fetchCategories(page, limit);
  }, [page]);

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
      header: "Name",
      render: (category) => (
        <Link
          to={`/news/category/${category.id}`}
          className="font-medium text-ink-50 underline-offset-4 transition-colors hover:text-amber-accent hover:underline"
        >
          {category.name}
        </Link>
      ),
    },
    {
      header: "Description",
      render: (category) => (
        <span className="line-clamp-2 max-w-xl text-ink-300">
          {category.description}
        </span>
      ),
    },
    {
      header: "Actions",
      render: (category) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => handleEdit(category)}
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
            onClick={() => handleDelete(category)}
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
      ),
    },
  ];

  function handleAdd() {
    setEnabled((prev) => !prev);
    setEditingCategory(null);
  }
  function handleEdit(category) {
    setEnabled(true);

    setEditingCategory(category);

    setName(category.name);
    setDescription(category.description);
  }

  async function handleDelete(category) {
    try {
      const response = await deleteCategory(category.id);
      toast.success(response.message);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const result = categorySchema.safeParse({
      name,
      description,
    });

    if (!result.success) {
      const firstError = result.error.issues[0].message;

      toast.error(firstError);

      return;
    }

    try {
      const body = {
        name,
        description,
      };

      const response= editingCategory ? await updateCategory(editingCategory.id, body) : await createCategory(body);
      toast.success(response.message);
      fetchCategories();

      setEditingCategory(null);

      setName("");
      setDescription("");
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
            CMS · Taxonomy
          </p>
          <h1 className="font-display text-4xl tracking-tight text-ink-50">
            Categories
          </h1>
          <p className="mt-2 max-w-xl text-sm text-ink-400">
            Organize your editorial coverage. Add, rename or retire sections at
            any time.
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
              Add category
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
              {editingCategory ? "Edit category" : "New category"}
            </h2>
            <p className="mt-1 text-xs text-ink-400">
              All fields are required.
            </p>
          </div>

          <div className="space-y-5 px-6 py-6">
            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                Category name
              </label>

              <input
                type="text"
                placeholder="e.g. Technology"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
              />
            </div>

            <div>
              <label className="mb-2 block text-[11px] font-semibold uppercase tracking-[0.16em] text-ink-300">
                Description
              </label>

              <textarea
                placeholder="A short summary of what this category covers"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-28 w-full resize-none rounded-xl border border-ink-750 bg-ink-900/60 px-4 py-3 text-sm text-ink-50 outline-none transition-all duration-200 focus:border-amber-accent/60 focus:bg-ink-900 focus:shadow-glow-amber"
              />
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
                {editingCategory ? "Update category" : "Create category"}
              </button>
            </div>
          </div>
        </form>
      )}

      <TableComponent columns={columns} data={categories} />

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
export default CategoriesPage;
