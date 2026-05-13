const pool = require("../config/db");
const { get } = require("../routes/authRoutes");

const getAllUsers = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const usersResult = await pool.query(
      "SELECT id, email, first_name, last_name, user_type, status FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2",
      [limit, offset],
    );
    const totalResult = await pool.query("SELECT COUNT(*) FROM users");
    const total = Number(totalResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    res.status(200).json({
      page,
      limit,
      total,
      totalPages,
      users: usersResult.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "SELECT id, email, first_name, last_name, user_type, status FROM users WHERE id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const createUser = async (req, res) => {
  try {
    const {
      email,
      first_name,
      last_name,
      password,
      confirm_password,
      user_type,
    } = req.body;
    if (
      !email ||
      !first_name ||
      !last_name ||
      !password ||
      !confirm_password ||
      !user_type ||
      email.trim() === "" ||
      first_name.trim() === "" ||
      last_name.trim() === "" ||
      password.trim() === "" ||
      confirm_password.trim() === "" ||
      user_type.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required and cannot be empty" });
    }
    if (password != confirm_password) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    if (user_type !== "admin" && user_type !== "regular") {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
      "INSERT INTO users (email, first_name, last_name, password_hash, user_type, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, email",
      [email, first_name, last_name, hashedPassword, user_type, "active"],
    );
    res.status(201).json({
      message: "User created successfully",
      userId: result.rows[0].id,
      email: result.rows[0].email,
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation za postgres kod je ovaj 23505
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, first_name, last_name, user_type, status } = req.body;

    if (
      !email ||
      !first_name ||
      !last_name ||
      !user_type ||
      !status ||
      email.trim() === "" ||
      first_name.trim() === "" ||
      last_name.trim() === "" ||
      user_type.trim() === "" ||
      status.trim() === ""
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required and cannot be empty" });
    }
    if (user_type !== "admin" && user_type !== "user") {
      return res.status(400).json({ message: "Invalid user type" });
    }
    const result = await pool.query(
      "UPDATE users SET email = $1, first_name = $2, last_name = $3, user_type = $4, status = $5 WHERE id = $6 RETURNING id, email",
      [email, first_name, last_name, user_type, status, id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({
      message: "User updated successfully",
      userId: result.rows[0].id,
      email: result.rows[0].email,
    });
  } catch (error) {
    if (error.code === "23505") {
      // Unique violation za postgres kod je ovaj 23505
      return res.status(400).json({ message: "Email already exists" });
    }
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;

    const userResult = await pool.query(
      "SELECT id,user_type, status FROM users WHERE id = $1",
      [id],
    );
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userResult.rows[0];

    if (user.user_type === "admin") {
      return res
        .status(400)
        .json({ message: "Cannot change status of an admin user" });
    }

    const newStatus = user.status === "active" ? "inactive" : "active";

    const result = await pool.query(
      "UPDATE users SET status = $1 WHERE id = $2 RETURNING id, email",
      [newStatus, id],
    );

    res.status(200).json({
      message: "User status updated successfully",
      userId: result.rows[0].id,
      email: result.rows[0].email,
      status: newStatus,
    });
  } catch (error) {
    console.error("Error updating user status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
};
