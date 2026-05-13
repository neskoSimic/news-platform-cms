const express = require("express");
const router = express.Router();

const {
  reactToNews,
  reactToComment,
} = require("../controllers/reactionsController");

router.post("/news/:newsId", reactToNews);
router.post("/comment/:commentId", reactToComment);

module.exports = router;
