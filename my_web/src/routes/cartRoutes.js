// src/routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const { authMiddleware } = require("../middleware/authMiddleware");
const { roleMiddleware } = require("../middleware/roleMiddleware");
const {
  addToCart,
  getCart,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

router.post("/", authMiddleware, roleMiddleware(["user"]), addToCart);
router.get("/", authMiddleware, roleMiddleware(["user"]), getCart);
router.delete(
  "/:cartId",
  authMiddleware,
  roleMiddleware(["user"]),
  removeFromCart
);
router.post("/checkout", authMiddleware, roleMiddleware(["user"]), clearCart);

module.exports = router;
