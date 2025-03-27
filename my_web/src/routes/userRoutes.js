// src/routes/userRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const {
  register,
  login,
  getUserProfile,
  updateUser,
  deleteUser,
  getAllUsers,
} = require("../controllers/userController");

router.get("", getAllUsers);
router.post("/register", register); // Mọi người đều có thể đăng ký
router.post("/login", login); // Mọi người đều có thể đăng nhập
router.get(
  "/profile",
  authMiddleware,
  roleMiddleware(["user", "admin"]),
  getUserProfile
); // Chỉ người dùng đã đăng nhập
// Cập nhật thông tin người dùng
router.put("/:id", authMiddleware, roleMiddleware(["admin"]), updateUser);
// Xóa người dùng
router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), deleteUser);

module.exports = router;
