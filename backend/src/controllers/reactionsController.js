const e = require("express");
const pool = require("../config/db");

const reactToNews = async (req, res) => {
  try {
    const { newsId } = req.params;
    const { reaction } = req.body;
    const sessionId = req.sessionID;

    if (!["like", "dislike"].includes(reaction)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const newsResult = await pool.query("SELECT id FROM news WHERE id = $1", [
      newsId,
    ]);
    if (newsResult.rows.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    const existingReaction = await pool.query(
      "SELECT * from news_reactions WHERE news_id = $1 AND session_id = $2",
      [newsId, sessionId],
    );

    if (existingReaction.rows.length > 0) {
      const currentReaction = existingReaction.rows[0];
      if (currentReaction.reaction_type === reaction) {
        await pool.query(
          "DELETE FROM news_reactions WHERE news_id = $1 AND session_id = $2",
          [newsId, sessionId],
        );
        return res.json({ message: "Reaction removed" });
      }

      const updatedReaction = await pool.query(
        "UPDATE news_reactions SET reaction_type = $1 WHERE news_id = $2 AND session_id = $3 RETURNING *",
        [reaction, newsId, sessionId],
      );
      return res.json({
        message: "Reaction updated",
        reaction: updatedReaction.rows[0],
      });
    }
    const newReaction = await pool.query(
      "INSERT INTO news_reactions (news_id, session_id, reaction_type) VALUES ($1, $2, $3) RETURNING *",
      [newsId, sessionId, reaction],
    );
    res
      .status(201)
      .json({ message: "Reaction added", reaction: newReaction.rows[0] });
  } catch (err) {
    console.error("Error reacting to news:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const reactToComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { reaction_type } = req.body;
    const sessionId = req.sessionID;

    if (!["like", "dislike"].includes(reaction_type)) {
      return res.status(400).json({ message: "Invalid reaction type" });
    }

    const commentResult = await pool.query(
      "SELECT id FROM comments WHERE id = $1",
      [commentId],
    );

    if (commentResult.rows.length === 0) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const existingReaction = await pool.query(
      "SELECT * FROM comment_reactions WHERE comment_id = $1 AND session_id = $2",
      [commentId, sessionId],
    );

    if (existingReaction.rows.length > 0) {
      const currentReaction = existingReaction.rows[0];

      if (currentReaction.reaction_type === reaction_type) {
        await pool.query(
          "DELETE FROM comment_reactions WHERE comment_id = $1 AND session_id = $2",
          [commentId, sessionId],
        );

        return res.status(200).json({ message: "Reaction removed" });
      }

      const updatedReaction = await pool.query(
        `UPDATE comment_reactions
         SET reaction_type = $1
         WHERE comment_id = $2 AND session_id = $3
         RETURNING *`,
        [reaction_type, commentId, sessionId],
      );

      return res.status(200).json({
        message: "Reaction updated",
        reaction: updatedReaction.rows[0],
      });
    }

    const newReaction = await pool.query(
      `INSERT INTO comment_reactions (comment_id, session_id, reaction_type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [commentId, sessionId, reaction_type],
    );

    res.status(201).json({
      message: "Reaction added",
      reaction: newReaction.rows[0],
    });
  } catch (error) {
    console.error("Error reacting to comment:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  reactToNews,
  reactToComment,
};
