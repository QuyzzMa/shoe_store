// src/models/Order.js
const db = require("../config/db");

class Order {
  static async getAllOrders() {
    try {
      const [rows] = await db.query(
        `SELECT orders.id, orders.user_id, orders.total, orders.paymentMethod, orders.status, orders.order_date, orders.shipping_address, orders.phone
         FROM orders`
      );
      return rows; // Trả về tất cả đơn hàng
    } catch (err) {
      throw new Error(`Lỗi khi lấy tất cả đơn hàng: ${err.message}`);
    }
  }
  static async createOrder(
    userId,
    total,
    paymentMethod,
    shippingAddress,
    phone
  ) {
    // Bước 1: Tạo đơn hàng trong bảng `orders`
    const [orderResult] = await db.query(
      `INSERT INTO orders (user_id, total, paymentMethod, shipping_address, phone) 
       VALUES (?, ?, ?, ?, ?)`,
      [userId, total, paymentMethod, shippingAddress, phone]
    );

    const orderId = orderResult.insertId;

    return orderId; // Trả về ID đơn hàng đã tạo
  }

  // Lấy đơn hàng theo userId
  static async getOrdersByUserId(userId) {
    const [rows] = await db.query(
      `SELECT orders.id, orders.total, orders.paymentMethod, orders.status, orders.order_date, orders.shipping_address, orders.phone
       FROM orders
       WHERE orders.user_id = ?`,
      [userId]
    );
    return rows;
  }

  // Lấy chi tiết đơn hàng theo ID
  static async getOrderById(orderId) {
    const [rows] = await db.query(
      `SELECT orders.id, orders.total, orders.paymentMethod, orders.status, orders.order_date, orders.shipping_address, orders.phone
       FROM orders
       WHERE orders.id = ?`,
      [orderId]
    );
    return rows[0]; // Trả về kết quả đơn hàng đầu tiên
  }

  static async addItemsToOrder(orderId, cart) {
    // Bước 2: Lưu các sản phẩm vào bảng `order_items`
    const orderItemsPromises = cart.map((item) => {
      return db.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price) 
         VALUES (?, ?, ?, ?)`,
        [orderId, item.product_id, item.quantity, item.price]
      );
    });

    // Chờ tất cả các sản phẩm được lưu vào bảng `order_items`
    await Promise.all(orderItemsPromises);
  }

  static async getOrdersWithItemsByUser(userId) {
    try {
      // Lấy thông tin các đơn hàng của người dùng
      const [orders] = await db.query(
        `SELECT id, total, status, order_date, shipping_address, paymentMethod FROM orders WHERE user_id = ?`,
        [userId]
      );

      // Lấy các sản phẩm trong đơn hàng
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const [orderItems] = await db.query(
            `SELECT oi.product_id, oi.quantity, oi.price, p.name AS product_name 
          FROM order_items oi 
          JOIN products p ON oi.product_id = p.id 
          WHERE oi.order_id = ?`,
            [order.id]
          );

          // Thêm thông tin sản phẩm vào đơn hàng
          order.items = orderItems;

          return order;
        })
      );

      return ordersWithItems;
    } catch (err) {
      throw new Error(`Lỗi khi lấy đơn hàng với sản phẩm: ${err.message}`);
    }
  }
  // Cập nhật trạng thái đơn hàng
  static async updateOrderStatus(orderId, status) {
    const [result] = await db.query(
      `UPDATE orders SET status = ? WHERE id = ?`,
      [status, orderId]
    );
    return result.affectedRows > 0;
  }

  static async cancelOrder(orderId) {
    try {
      // Kiểm tra trạng thái đơn hàng
      const [order] = await db.query(`SELECT status FROM orders WHERE id = ?`, [
        orderId,
      ]);

      if (order.length === 0) {
        throw new Error("Đơn hàng không tồn tại");
      }

      // Nếu đơn hàng đã được xác nhận thì không cho phép hủy
      if (order[0].status === "shipped") {
        throw new Error("Đơn hàng đã được xác nhận, không thể hủy");
      }

      // Cập nhật trạng thái đơn hàng thành 'cancelled'
      await db.query(`UPDATE orders SET status = 'cancelled' WHERE id = ?`, [
        orderId,
      ]);

      return { message: "Đơn hàng đã được hủy" };
    } catch (err) {
      throw new Error(`Lỗi khi hủy đơn hàng: ${err.message}`);
    }
  }

  // Xóa đơn hàng
  static async deleteOrder(orderId) {
    const [result] = await db.query(`DELETE FROM orders WHERE id = ?`, [
      orderId,
    ]);
    return result.affectedRows > 0;
  }
}

module.exports = Order;
