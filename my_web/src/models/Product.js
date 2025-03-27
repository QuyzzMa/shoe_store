// src/models/Product.js
const db = require("../config/db");

class Product {
  static async create(name, price, description, image, brand, categoryId) {
    const [result] = await db.query(
      "INSERT INTO products (name, price, description, image, brand, category_id) VALUES (?, ?, ?, ?, ?, ?)",
      [
        name,
        price,
        description || "",
        image ||
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEk3gsXfxCVkWGKkqZkijxE1DEOwJr2j8isA&s",
        brand,
        categoryId,
      ]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query("SELECT * FROM products");
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM products WHERE id = ?", [id]);
    return rows[0] || null;
  }

  static async getAllBrands() {
    const [rows] = await db.query("SELECT DISTINCT brand FROM products");
    return rows.map((row) => row.brand);
  }

  static async update(id, name, price, description, brand, categoryId) {
    const [result] = await db.query(
      "UPDATE products SET name = ?, price = ?, description = ?, brand = ?, category_id = ? WHERE id = ?",
      [name, price, description || "", brand, categoryId, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id) {
    const [result] = await db.query("DELETE FROM products WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Product;
