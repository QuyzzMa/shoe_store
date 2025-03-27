// src/models/User.js
const db = require("../config/db");
const bcrypt = require("bcrypt");

class User {
  static async getAllUsers() {
    const [rows] = await db.query(
      "SELECT id, fullName, email, username, role, is_super_admin FROM users"
    );
    return rows;
  }

  static async create(
    fullName,
    email,
    username,
    password,
    role = "user",
    isSuperAdmin = false
  ) {
    const [result] = await db.query(
      "INSERT INTO users (fullName, email, username, password, role, is_super_admin) VALUES (?, ?, ?, ?, ?, ?)",
      [fullName, email, username, password, role, isSuperAdmin]
    );
    return result.insertId;
  }

  static async findByUsername(username) {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      username,
    ]);
    return rows[0] || null;
  }

  static async findById(id) {
    const [rows] = await db.query("SELECT * FROM users WHERE id = ?", [id]);
    return rows[0] || null;
  }

  // Cập nhật thông tin user
  static async updateUser(
    id,
    { fullName, email, username, password, role, isSuperAdmin }
  ) {
    // Nếu có mật khẩu mới, băm lại trước khi lưu
    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const [result] = await db.query(
      `UPDATE users 
       SET fullName = ?, email = ?, username = ?, 
           ${password ? "password = ?, " : ""} 
           role = ?, is_super_admin = ?
       WHERE id = ?`,
      password
        ? [fullName, email, username, hashedPassword, role, isSuperAdmin, id]
        : [fullName, email, username, role, isSuperAdmin, id]
    );

    return result.affectedRows > 0;
  }

  // Xóa user theo ID
  static async deleteUser(id) {
    const [result] = await db.query("DELETE FROM users WHERE id = ?", [id]);
    return result.affectedRows > 0;
  }
}

module.exports = User;
