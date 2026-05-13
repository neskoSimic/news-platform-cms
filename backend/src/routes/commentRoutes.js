const express = require("express");
const router = express.Router();

const {
  createComment,
  getCommentsByNewsId,
} = require("../controllers/commentCotroller");

router.post("/", createComment);
router.get("/news/:newsId", getCommentsByNewsId);

module.exports = router;
