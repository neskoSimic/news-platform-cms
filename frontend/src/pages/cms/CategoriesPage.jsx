import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  let response;

  async function fetchCategories() {
    const data = await getCategoriesCms(page, limit);

    setCategorise(data.categories);
    setTotalPages(data.totalPages);
  }

  useEffect(() => {
    fetchCategories();
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
      render: (category) => category.name,
    },
    {
      header: "Description",
      render: (category) => category.description,
    },
    {
      header: "Actions",
      render: (category) => (
        <>
          <button onClick={() => handleEdit(category)}>Edit</button>
          <button onClick={() => handleDelete(category)}>Delete</button>
        </>
      ),
    },
  ];

  function handleAdd(enabled) {
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
      response = await deleteCategory(category.id);
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

      if (editingCategory) {
        response = await updateCategory(editingCategory.id, body);
      } else {
        response = await createCategory(body);
      }

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
    <div className="mx-auto max-w-6xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Categories</h1>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
        >
          {enabled ? "Close Form" : "Add Category"}
        </button>
      </div>

      {enabled && (
        <form
          onSubmit={handleSubmit}
          className="mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-md"
        >
          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Category Name
            </label>

            <input
              type="text"
              placeholder="Enter category name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-4">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Description
            </label>

            <textarea
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="min-h-24 w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 transition"
          >
            {editingCategory ? "Update Category" : "Create Category"}
          </button>
        </form>
      )}

      <TableComponent columns={columns} data={categories} />

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
export default CategoriesPage;
