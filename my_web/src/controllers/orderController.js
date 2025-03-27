// src/controllers/order.controller.js
const Order = require("../models/Order"); // Import model Order
const { sendOrderConfirmation } = require("../middleware/sendEmail");
const Cart = require("../models/Cart");
// Tạo đơn hàng mới
exports.createOrder = async (req, res) => {
  const userId = req.user.id;
  console.log("order here");

  try {
    const cart = await Cart.getCart(userId);
    console.log(cart);
    console.log(req.user);

    if (!cart) {
      return res
        .status(400)
        .json({ error: "Giỏ hàng trống, không thể tạo đơn hàng" });
    }

    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const { paymentMethod, shippingAddress, phone } = req.body;

    const orderId = await Order.createOrder(
      userId,
      total,
      paymentMethod,
      shippingAddress,
      phone
    );

    if (!orderId) {
      return res.status(500).json({ error: "Không thể tạo đơn hàng" });
    }
    await Order.addItemsToOrder(orderId, cart);

    // Tạo link xác nhận và hủy đơn hàng
    const confirmationLink = `http://localhost:5000/api/orders/confirm/${orderId}`;
    const cancelLink = `http://localhost:5000/api/orders/cancel/${orderId}`;

    // Gửi email xác nhận đơn hàng
    await sendOrderConfirmation(req.user.email, {
      id: orderId,
      total,
      shippingAddress,
      paymentMethod,
      confirmationLink,
      cancelLink,
    });

    res.status(200).json({
      message: "Đơn hàng đã được tạo. Vui lòng xác nhận qua email.",
      orderId: orderId,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to create order: " + err.message });
  }
};

// Lấy danh sách đơn hàng của người dùng
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.getAllOrders();
    res.status(200).json(orders); // Trả về tất cả đơn hàng
  } catch (error) {
    res.status(500).json({ message: error.message }); // Xử lý lỗi nếu có
  }
};
exports.getOrdersByUserId = async (req, res) => {
  const userId = req.user.id; // Giả sử bạn đã có userId từ authentication middleware

  try {
    // Gọi phương thức lấy đơn hàng với sản phẩm từ model
    const orders = await Order.getOrdersWithItemsByUser(userId);
    console.log(orders);

    if (orders.length === 0) {
      return res.status(404).json({ message: "Không có đơn hàng nào" });
    }

    // Trả về kết quả dưới dạng JSON
    res.status(200).json(orders);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách đơn hàng với sản phẩm" });
  }
};
// Lấy chi tiết đơn hàng theo ID
exports.getOrderById = async (req, res) => {
  const { id } = req.params; // Lấy orderId từ tham số URL

  try {
    const order = await Order.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch order: " + err.message });
  }
};

// Cập nhật trạng thái đơn hàng
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const isUpdated = await Order.updateOrderStatus(id, status);
    if (!isUpdated) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order status updated successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update order status: " + err.message });
  }
};

/**
 * Xác nhận đơn hàng và chuyển trạng thái sang "Đang giao hàng"
 */
exports.confirmOrder = async (req, res) => {
  const { orderId } = req.params;

  try {
    const isUpdated = await Order.updateOrderStatus(orderId, "shipped");
    if (!isUpdated) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Xác nhận đơn hàng thành công!" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to update order status: " + err.message });
  }
};

exports.cancelOrder = async (req, res) => {
  const orderId = req.params.orderId;

  try {
    // Gọi phương thức cancelOrder trong model
    const result = await Order.cancelOrder(orderId);

    res.status(200).json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Xóa đơn hàng
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const isDeleted = await Order.deleteOrder(id);
    if (!isDeleted) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete order: " + err.message });
  }
};
