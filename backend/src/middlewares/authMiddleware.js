const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      decoded.userId,
    ]);

    const user = result.rows[0];

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    if (user.user_type === "user" && user.status === "inactive") {
      return res.status(403).json({
        message: "Your account is inactive",
      });
    }

    req.user = user;

    next();
  } catch (error) {
    console.error("JWT verification error:", error);

    return res.status(401).json({
      message: "Unauthorized",
    });
  }
};

module.exports = authMiddleware;
