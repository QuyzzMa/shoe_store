// src/routes/order.routes.js
const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");

// Route: Tạo đơn hàng mới
router.get(
  "/user",
  authMiddleware,
  roleMiddleware(["user"]),
  orderController.getOrdersByUserId
);

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["user"]),
  orderController.createOrder
);

// Route: Lấy danh sách đơn hàng của người dùng
router.get("/", orderController.getOrders);

// Route: Lấy chi tiết đơn hàng theo ID
router.get("/:id", orderController.getOrderById);

// Route: Cập nhật trạng thái đơn hàng
router.put(
  "/:id/status",
  authMiddleware,
  roleMiddleware(["admin"]),
  orderController.updateOrderStatus
);
router.get("/confirm/:orderId", orderController.confirmOrder);
router.get("/cancel/:orderId", orderController.cancelOrder);

// Route: Xóa đơn hàng
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  orderController.deleteOrder
);

module.exports = router;
