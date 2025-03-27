// controllers/category.controller.js
const Category = require("../models/Category"); // Import model Category

// Tạo mới danh mục
exports.createCategory = async (req, res) => {
  const { name } = req.body;
  try {
    const categoryId = await Category.addCategory(name);
    res.status(201).json({
      id: categoryId,
      name,
      message: "Category created successfully",
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to create category: " + err.message });
  }
};

// Lấy tất cả danh mục
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.getAllCategories();
    res.status(200).json(categories);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to fetch categories: " + err.message });
  }
};

// Lấy danh mục theo ID
exports.getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch category: " + err.message });
  }
};

exports.updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  try {
    const success = await Category.updateCategory(id, name);
    if (success) {
      res.json({ message: "Cập nhật danh mục thành công" });
    } else {
      res.status(404).json({ error: "Danh mục không tồn tại" });
    }
  } catch (error) {
    res.status(500).json({ error: "Lỗi cập nhật danh mục" });
  }
};

// Xóa danh mục theo ID
exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const isDeleted = await Category.deleteCategory(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to delete category: " + err.message });
  }
};
