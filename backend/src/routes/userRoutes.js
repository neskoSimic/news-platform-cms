const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateUserStatus,
} = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware");

router.get("/", authMiddleware, requireRole("admin"), getAllUsers);
router.get("/:id", authMiddleware, requireRole("admin"), getUserById);
router.post("/", authMiddleware, requireRole("admin"), createUser);
router.patch("/:id", authMiddleware, requireRole("admin"), updateUser);
router.patch(
  "/:id/status",
  authMiddleware,
  requireRole("admin"),
  updateUserStatus,
);

module.exports = router;
