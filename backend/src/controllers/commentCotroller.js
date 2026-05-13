const pool = require("../config/db");

const createComment = async (req, res) => {
  try {
    const { author_name, text, news_id } = req.body;
    if (
      !author_name ||
      !text ||
      !news_id ||
      author_name.trim() === "" ||
      text.trim() === ""
    ) {
      return res.status(400).json({
        error:
          "Author name, text, and news ID are required and cannot be empty",
      });
    }

    const newsResult = await pool.query("SELECT id FROM news WHERE id = $1", [
      news_id,
    ]);
    if (newsResult.rows.length === 0) {
      return res.status(404).json({ error: "News not found" });
    }

    const result = await pool.query(
      "INSERT INTO comments (author_name, text, news_id) VALUES ($1, $2, $3) RETURNING *",
      [author_name.trim(), text.trim(), news_id],
    );
    res.status(201).json({
      message: "Comment created successfully",
      comment: result.rows[0],
    });
  } catch (err) {
    console.error("Error creating comment:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getCommentsByNewsId = async (req, res) => {
  try {
    const { newsId } = req.params;
    const result = await pool.query(
      "SELECT * FROM comments WHERE news_id = $1 ORDER BY created_at DESC",
      [newsId],
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Error fetching comments:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  createComment,
  getCommentsByNewsId,
};
