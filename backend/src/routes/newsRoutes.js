const express = require("express");
const router = express.Router();

const {
  getAllNews,
  getNewsById,
  createNews,
  searchNews,
  updateNews,
  deleteNews,
  getNewsByTag,
  getLatestNews,
  getMostReadNews,
  getPublicNewsByCategory,
  getPublicNewsByTag,
  searchPublicNews,
  getPublicNewsDetails,
  getTopReactedNews,
  getAllNewsByCategory,
} = require("../controllers/newsController");

const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, requireRole("admin", "user"), getAllNews);
router.get("/search", authMiddleware, requireRole("admin", "user"), searchNews);
router.get(
  "/tag/:tagName",
  authMiddleware,
  requireRole("admin", "user"),
  getNewsByTag,
);
router.get(
  "/category/:id",
  authMiddleware,
  requireRole("admin", "user"),
  getAllNewsByCategory,
);
//public endpointi----------------------------------------
router.get("/public/latest", getLatestNews);
router.get("/public/most-read", getMostReadNews);
router.get("/public/top-reacted", getTopReactedNews);
router.get("/public/category/:categoryId", getPublicNewsByCategory);
router.get("/public/tag/:id", getPublicNewsByTag);
router.get("/public/search", authMiddleware, searchPublicNews);
router.get("/public/:id", getPublicNewsDetails);

//--------------------------------------------------------
router.get("/:id", authMiddleware, requireRole("admin", "user"), getNewsById);
router.post("/", authMiddleware, requireRole("admin", "user"), createNews);
router.patch("/:id", authMiddleware, requireRole("admin", "user"), updateNews);
router.delete("/:id", authMiddleware, requireRole("admin", "user"), deleteNews);

module.exports = router;
