const pool = require("../config/db");
const { search, get } = require("../routes/newsRoutes");

const addTagsToNews = async (newsId, tags) => {
  if (!tags || !Array.isArray(tags)) {
    return;
  }
  for (const tagName of tags) {
    const cleanTagName = tagName.trim().toLowerCase();
    if (cleanTagName === "") {
      continue;
    }
    const tagResult = await pool.query(
      "INSERT INTO tags (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id", // on conflict ako postoji da ne baci error, excluded omogucava da returning radi i kada tag postoji
      [cleanTagName],
    );

    const tagId = tagResult.rows[0].id;
    await pool.query(
      "INSERT INTO news_tags (news_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING", // on conflict jer mi je u bazi unique polje
      [newsId, tagId],
    );
  }
};

const getAllNews = async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const newsResult = await pool.query(
      "SELECT news.id, news.title, news.text, news.category_id, news.published_at, news.author_id, news.visits, users.first_name, users.last_name, categories.name AS category_name FROM news JOIN users ON news.author_id = users.id JOIN categories ON news.category_id = categories.id ORDER BY news.published_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );

    const totalResult = await pool.query("SELECT COUNT(*) FROM news");
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      news: newsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNewsById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT news.id, news.title, news.text, news.published_at, news.visits, users.first_name, users.last_name, categories.name AS category_name FROM news JOIN categories ON news.category_id = categories.id JOIN users ON news.author_id = users.id WHERE news.id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    const tagsResult = await pool.query(
      "SELECT tags.id, tagns.name FROM tags JOIN news_tags ON tags.id = news_tags.tag_id WHERE news_tags.news_id = $1",
      [id],
    );

    res.status(200).json({ ...result.rows[0], tags: tagsResult.rows });
  } catch (error) {
    console.error("Error fetching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createNews = async (req, res) => {
  try {
    const { title, text, category_id, tags } = req.body;
    const author_id = req.user.userId;

    if (
      !title ||
      !text ||
      !category_id ||
      title.trim() === "" ||
      text.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "Title, text and category are required" });
    }

    const categoryResult = await pool.query(
      "SELECT id FROM categories WHERE id = $1",
      [category_id],
    );
    if (categoryResult.rows.length === 0) {
      return res.status(400).json({ message: "Category not found" });
    }

    const result = await pool.query(
      "INSERT INTO news (title, text, category_id, author_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [title, text, category_id, author_id],
    );

    const newsId = result.rows[0].id;
    await addTagsToNews(newsId, tags); //prolazim kroz citavu listu tagova i ubacujem sa ovom vijesti

    res.status(201).json({
      message: "News created successfully",
      news: result.rows[0],
    });
  } catch (error) {
    console.error("Error creating news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateNews = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, text, category_id, tags } = req.body;
    const author_id = req.user.userId;

    const newsResult = await pool.query("SELECT * FROM news WHERE id = $1", [
      id,
    ]);
    if (newsResult.rows.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }
    const news = newsResult.rows[0];

    if (news.author_id !== author_id && req.user.user_type !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only update your own news" });
    }
    const result = await pool.query(
      "UPDATE news SET title = $1, text = $2, category_id = $3 WHERE id = $4 RETURNING *",
      [title, text, category_id, id],
    );

    await pool.query("DELETE FROM news_tags WHERE news_id = $1", [id]); // brisem stare i ispod dodajem opet sve tagove, koji su mozda potencijalno promijenjeni, najlaksa logika
    await addTagsToNews(id, tags);
    res
      .status(200)
      .json({ message: "News updated successfully", news: result.rows[0] });
  } catch (error) {
    console.error("Error updating news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getNewsByTag = async (req, res) => {
  try {
    const { tagName } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT news.id, news.title, news.text, news.published_at, news.visits, users.first_name, users.last_name, categories.name AS category_name FROM news JOIN users ON news.author_id = users.id JOIN categories ON news.category_id = categories.id JOIN news_tags ON news.id = news_tags.news_id JOIN tags ON news_tags.tag_id = tags.id WHERE tags.name = $1 ORDER BY news.published_at DESC LIMIT $2 OFFSET $3",
      [tagName.toLowerCase(), limit, offset], // spajaa cetri tabele
    );

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM news JOIN news_tags ON news.id = news_tags.news_id JOIN tags ON news_tags.tag_id = tags.id WHERE tags.name = $1",
      [tagName.toLowerCase()],
    );
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      news: result.rows,
    });
  } catch (error) {
    console.error("Error fetching news by tag:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteNews = async (req, res) => {
  try {
    const { id } = req.params;
    const author_id = req.user.userId;

    const newsResult = await pool.query("SELECT * FROM news WHERE id = $1", [
      id,
    ]);
    if (newsResult.rows.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }
    const news = newsResult.rows[0];

    if (news.author_id !== author_id && req.user.user_type !== "admin") {
      return res
        .status(403)
        .json({ message: "You can only delete your own news" });
    }

    const deleteResult = await pool.query("DELETE FROM news WHERE id = $1", [
      id,
    ]);

    res.status(200).json({
      message: "News deleted successfully",
      news: deleteResult.rows[0],
    });
  } catch (error) {
    console.error("Error deleting news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchNews = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const newsResult = await pool.query(
      "SELECT news.id, news.title, news.text, news.published_at, news.visits, users.first_name, users.last_name, categories.name AS category_name FROM news JOIN users ON news.author_id = users.id JOIN categories ON news.category_id = categories.id WHERE news.title ILIKE $1 OR news.text ILIKE $1 ORDER BY news.published_at DESC LIMIT $2 OFFSET $3",
      [`%${q}%`, limit, offset],
    );
    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM news WHERE title ILIKE $1 OR text ILIKE $1", // case sensitive LIKE a ILIKE nije case sensitive u postgresu
      [`%${q}%`], // bilo sta prije i poslije i safe za sql injection prepared statement
    );
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      news: newsResult.rows,
    });
  } catch (error) {
    console.error("Error searching news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// PUBLIC NEWS ENDPOINTS ----------------------------------------------------------------------------------------------------------------------------------------------
const getLatestNews = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT n.id, n.title, LEFT(n.text, 50) AS short_text, n.published_at, n.visits, u.first_name, u.last_name, c.name AS category_name FROM news n JOIN categories c ON n.category_id = c.id JOIN users u ON n.author_id = u.id ORDER BY n.published_at DESC LIMIT 10",
    );
    res.status(200).json({
      news: result.rows,
    });
  } catch (error) {
    console.error("Error fetching latest news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getMostReadNews = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT n.id, n.title, LEFT(n.text, 50) AS short_text, n.published_at, n.visits, u.first_name, u.last_name, c.name AS category_name FROM news n JOIN categories c ON n.category_id = c.id JOIN users u ON n.author_id = u.id WHERE n.published_at >=NOW() - INTERVAL '30' DAY ORDER BY n.visits DESC, n.published_at DESC LIMIT 10",
    );
    res.status(200).json({
      news: result.rows,
    });
  } catch (error) {
    console.error("Error fetching most read news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPublicNewsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT n.id, n.title, LEFT(n.text, 50) AS short_text, n.published_at, n.visits, u.first_name, u.last_name, c.name AS category_name FROM news n JOIN categories c ON n.category_id = c.id JOIN users u ON n.author_id = u.id WHERE c.id = $1 ORDER BY n.published_at DESC LIMIT $2 OFFSET $3",
      [categoryId, limit, offset],
    );

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM news WHERE category_id = $1",
      [categoryId],
    );
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      news: result.rows,
    });
  } catch (error) {
    console.error("Error fetching news by category:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPublicNewsByTag = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("TAG ID PARAM:", id);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT news.id, news.title, news.text, news.published_at, news.visits, users.first_name, users.last_name, categories.name AS category_name FROM news JOIN news_tags ON news.id = news_tags.news_id JOIN tags ON news_tags.tag_id = tags.id JOIN users ON news.author_id = users.id JOIN categories ON news.category_id = categories.id WHERE tags.id = $1 ORDER BY news.published_at DESC LIMIT $2 OFFSET $3",
      [id, limit, offset],
    );

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM news JOIN news_tags ON news.id = news_tags.news_id JOIN tags ON news_tags.tag_id = tags.id WHERE tags.id = $1",
      [id],
    );
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      news: result.rows,
    });
  } catch (error) {
    console.error("Error fetching news by ID:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const searchPublicNews = async (req, res) => {
  try {
    const q = req.query.q || "";
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const result = await pool.query(
      "SELECT n.id, n.title, LEFT(n.text, 200) AS short_text, n.published_at, n.visits, u.first_name, u.last_name, c.name AS category_name FROM news n JOIN users u ON n.author_id = u.id JOIN categories c ON n.category_id = c.id WHERE n.title ILIKE $1 OR n.text ILIKE $1 ORDER BY n.published_at DESC LIMIT $2 OFFSET $3",
      [`%${q}%`, limit, offset],
    );

    const totalResult = await pool.query(
      "SELECT COUNT(*) FROM news WHERE title ILIKE $1 OR text ILIKE $1",
      [`%${q}%`],
    );
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      news: result.rows,
    });
  } catch (error) {
    console.error("Error searching public news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPublicNewsDetails = async (req, res) => {
  // rijeseno i sa sesijom za povecanje posjeta i sa tagovima i komentarima, sve u jednom endpointu da ne moram svaki put sa frontenda da saljem vise zahtjeva kada korisnik otvori vijest
  try {
    const { id } = req.params;
    if (!req.session.initialized) {
      req.session.initialized = true;
    }
    const sessionId = req.sessionID;
    const result = await pool.query(
      "SELECT news.id, news.title, news.text, news.published_at, news.visits, users.first_name, users.last_name, categories.name AS category_name, (SELECT COUNT(*) FROM news_reactions WHERE news_id=news.id AND reaction_type='like') AS likes, (SELECT COUNT(*) FROM news_reactions WHERE news_id=news.id AND reaction_type='dislike') AS dislikes FROM news JOIN users ON news.author_id = users.id JOIN categories ON news.category_id = categories.id WHERE news.id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "News not found" });
    }

    const insertResults = await pool.query(
      "INSERT INTO news_visits (news_id, session_id) VALUES ($1, $2) ON CONFLICT (news_id,session_id) DO NOTHING RETURNING id",
      [id, sessionId], //// zbog race condition strict mode ereact povecavalo mi je visits dva puta zato sam stavio on conflict
    );
    if (insertResults.rows.length > 0) {
      await pool.query("UPDATE news SET visits = visits + 1 WHERE id = $1", [
        id,
      ]);
      result.rows[0].visits += 1; // da odmah vratim povecani broj posjeta bez potrebe za dodatnim queryjem
    }
    const tagsResult = await pool.query(
      "SELECT tags.id, tags.name FROM tags JOIN news_tags ON tags.id = news_tags.tag_id WHERE news_tags.news_id = $1",
      [id],
    );
    const relatedNewsResult = await pool.query(
      "SELECT DISTINCT related_news.id, related_news.title, LEFT(related_news.text, 200) AS short_text, related_news.published_at, categories.name AS category_name FROM news AS current_news JOIN news_tags as current_news_tags ON current_news.id = current_news_tags.news_id JOIN news_tags AS related_news_tags ON current_news_tags.tag_id = related_news_tags.tag_id JOIN news AS related_news ON related_news_tags.news_id = related_news.id JOIN categories ON related_news.category_id = categories.id WHERE current_news.id = $1 AND related_news.id <> $1 ORDER BY related_news.published_at DESC LIMIT 3",
      [id],
    ); // ogroman querry upit za joinovanje i prikazivanje povezanih vijesti preko tagova.....katastrofa

    const commentsResult = await pool.query(
      "SELECT comments.id, comments.author_name, comments.text, comments.created_at, (SELECT COUNT(*) FROM comment_reactions WHERE comment_id=comments.id AND reaction_type='like') AS likes, (SELECT COUNT(*) FROM comment_reactions WHERE comment_id=comments.id AND reaction_type='dislike') AS dislikes FROM comments WHERE comments.news_id = $1 ORDER BY comments.created_at DESC",
      [id],
    );
    res.status(200).json({
      news: result.rows[0],
      tags: tagsResult.rows,
      comments: commentsResult.rows,
      relatedNews: relatedNewsResult.rows,
    });
  } catch (error) {
    console.error("Error fetching public news details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getTopReactedNews = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT news.id, news.title, COUNT(news_reactions.id) ::INTEGER AS total_reactions FROM news LEFT JOIN news_reactions ON news.id = news_reactions.news_id GROUP BY news.id, news.title ORDER BY total_reactions DESC, news.published_at DESC LIMIT 3",
    );

    res.status(200).json({
      news: result.rows,
    });
  } catch (error) {
    console.error("Error fetching top reacted news:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
  searchNews,
  getNewsByTag,
  getLatestNews,
  getMostReadNews,
  getPublicNewsByCategory,
  getPublicNewsByTag,
  searchPublicNews,
  getPublicNewsDetails,
  getTopReactedNews,
};
