// src/controllers/cartController.js
const Cart = require("../models/Cart");
const db = require("../config/db");

exports.addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity } = req.body;

  if (!productId || !quantity || quantity < 1) {
    return res.status(400).json({
      error:
        "Product ID and quantity are required, quantity must be at least 1",
    });
  }

  try {
    const [product] = await db.query(
      "SELECT price FROM products WHERE id = ?",
      [productId]
    );
    if (!product || product.length === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    const price = product[0].price;
    const cartItemId = await Cart.addToCart(userId, productId, quantity, price);
    res.status(201).json({ message: "Product added to cart", cartItemId });
  } catch (err) {
    res.status(500).json({ error: "Failed to add to cart: " + err.message });
  }
};

exports.getCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const cartItems = await Cart.getCart(userId);
    res.status(200).json(cartItems);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch cart: " + err.message });
  }
};

exports.removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const cartId = parseInt(req.params.cartId);

  if (!cartId) {
    return res.status(400).json({ error: "Cart ID is required" });
  }

  try {
    const success = await Cart.removeFromCart(userId, cartId);
    if (!success) {
      return res
        .status(404)
        .json({ error: "Cart item not found or does not belong to user" });
    }
    res.status(200).json({ message: "Product removed from cart" });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to remove from cart: " + err.message });
  }
};

exports.clearCart = async (req, res) => {
  const userId = req.user.id;
  try {
    const success = await Cart.clearCart(userId);
    if (!success) {
      return res
        .status(404)
        .json({ error: "Cart is already empty or user not found" });
    }
    res.status(200).json({ message: "Cart cleared successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to clear cart: " + err.message });
  }
};
