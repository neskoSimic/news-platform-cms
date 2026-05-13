require("dotenv").config();

const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const session = require("express-session");

const app = express();

const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middlewares/authMiddleware");
const requireRole = require("./middlewares/roleMiddleware");
const categoriesRoutes = require("./routes/categoriesRoutes");
const userRoutes = require("./routes/userRoutes");
const newsRoutes = require("./routes/newsRoutes");
const commentRoutes = require("./routes/commentRoutes");
const reactionsRoutes = require("./routes/reactionRoutes");

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET || "default_secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
    },
  }),
);
app.use("/auth", authRoutes);
app.use("/categories", categoriesRoutes);
app.use("/users", userRoutes);
app.use("/news", newsRoutes);
app.use("/comments", commentRoutes);
app.use("/reactions", reactionsRoutes);

/*app.get("/protected", authMiddleware, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});*/
/*app.get("/admin-only", authMiddleware, requireRole("admin"), (req, res) => {
  res.json({ message: "This is an admin-only route", user: req.user });
});*/

const PORT = process.env.PORT || 3001;

pool
  .connect()
  .then(() => console.log("Connected to the database"))
  .catch((err) => console.error("Database connection error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
