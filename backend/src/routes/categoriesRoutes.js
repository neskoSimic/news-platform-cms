const express = require("express");
const router = express.Router();

const {
  getAllCategories,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoriesController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/public", getAllCategories);
router.get("/", authMiddleware, requireRole("admin", "user"), getAllCategories);
router.post("/", authMiddleware, requireRole("admin", "user"), createCategory);
router.get(
  "/:id",
  authMiddleware,
  requireRole("admin", "user"),
  getCategoryById,
);
router.put(
  "/:id",
  authMiddleware,
  requireRole("admin", "user"),
  updateCategory,
);
router.delete(
  "/:id",
  authMiddleware,
  requireRole("admin", "user"),
  deleteCategory,
);

module.exports = router;
