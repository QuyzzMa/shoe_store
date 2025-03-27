// src/models/Cart.js
const db = require("../config/db");

class Cart {
  static async addToCart(userId, productId, quantity, price) {
    // Kiểm tra sản phẩm đã có trong giỏ hàng chưa
    const [existingItem] = await db.query(
      "SELECT id, quantity FROM cart WHERE user_id = ? AND product_id = ?",
      [userId, productId]
    );

    if (existingItem.length > 0) {
      // Nếu sản phẩm đã tồn tại, cập nhật số lượng
      const newQuantity = existingItem[0].quantity + quantity;
      await db.query("UPDATE cart SET quantity = ? WHERE id = ?", [
        newQuantity,
        existingItem[0].id,
      ]);
      return existingItem[0].id; // Trả về ID của mục đã cập nhật
    } else {
      // Nếu sản phẩm chưa có, thêm mới vào giỏ hàng
      const [result] = await db.query(
        "INSERT INTO cart (user_id, product_id, quantity, price) VALUES (?, ?, ?, ?)",
        [userId, productId, quantity, price]
      );
      return result.insertId;
    }
  }

  static async getCart(userId) {
    const [rows] = await db.query(
      `SELECT cart.id, cart.product_id, cart.quantity, cart.price, products.name 
             FROM cart 
             JOIN products ON cart.product_id = products.id 
             WHERE cart.user_id = ?`,
      [userId]
    );
    return rows;
  }

  static async removeFromCart(userId, cartId) {
    const [result] = await db.query(
      "DELETE FROM cart WHERE id = ? AND user_id = ?",
      [cartId, userId]
    );
    return result.affectedRows > 0;
  }

  static async clearCart(userId) {
    const [result] = await db.query("DELETE FROM cart WHERE user_id = ?", [
      userId,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = Cart;
