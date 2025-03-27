const db = require("../config/db");

class Category {
  // Thêm mới danh mục
  static async addCategory(name) {
    const [result] = await db.query(
      "INSERT INTO categories (name) VALUES (?)",
      [name]
    );
    return result.insertId;
  }

  // Lấy tất cả danh mục
  static async getAllCategories() {
    const [rows] = await db.query("SELECT * FROM categories");
    return rows;
  }

  // Lấy danh mục theo ID
  static async getCategoryById(id) {
    const [rows] = await db.query("SELECT * FROM categories WHERE id = ?", [
      id,
    ]);
    return rows[0];
  }
  // Cập nhật danh mục theo ID
  static async updateCategory(id, name) {
    const [result] = await db.query(
      "UPDATE categories SET name = ? WHERE id = ?",
      [name, id]
    );
    return result.affectedRows > 0;
  }
  // Xóa danh mục theo ID
  static async deleteCategory(id) {
    const [result] = await db.query("DELETE FROM categories WHERE id = ?", [
      id,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = Category;
