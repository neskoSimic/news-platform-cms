const pool = require("../config/db");

const getAllCategories = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const categoriesResult = await pool.query(
      "SELECT * FROM categories ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    const totalResult = await pool.query("SELECT COUNT(*) FROM categories");
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      categories: categoriesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const result = await pool.query(
      "INSERT INTO categories (name, description) VALUES ($1, $2) RETURNING *",
      [name, description],
    );
    res.status(201).json({
      message: "Category created successfully",
      category: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation za postgres kod je ovaj 23505
      return res.status(400).json({ message: "Category name already exists" });
    }
    console.error("Error creating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM categories WHERE id = $1", [
      id,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    if (
      !name ||
      !description ||
      name.trim() === "" ||
      description.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Name and description are required" });
    }

    const result = await pool.query(
      "UPDATE categories SET name = $1, description = $2 WHERE id = $3 RETURNING *",
      [name, description, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: result.rows[0],
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation za postgres kod je ovaj 23505
      return res.status(400).json({ message: "Category name already exists" });
    }
    console.error("Error updating category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const newsCheck = await pool.query(
      "SELECT * FROM news WHERE category_id = $1",
      [id],
    );
    if (newsCheck.rows.length > 0) {
      return res
        .status(400)
        .json({ message: "Cannot delete category with associated news items" });
    }
    const result = await pool.query(
      "DELETE FROM categories WHERE id = $1 RETURNING *",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json({
      message: "Category deleted successfully",
      category: result.rows[0],
    });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
