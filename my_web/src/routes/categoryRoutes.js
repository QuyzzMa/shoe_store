// routes/category.routes.js
const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

// Route: Tạo mới danh mục
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.createCategory
);

// Route: Lấy tất cả danh mục
router.get("/", categoryController.getCategories);

// Route: Lấy danh mục theo ID
router.get("/:id", categoryController.getCategoryById);

router.put(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.updateCategory
);
// Route: Xóa danh mục theo ID
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  categoryController.deleteCategory
);

module.exports = router;
