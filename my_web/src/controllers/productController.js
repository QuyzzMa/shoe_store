// src/controllers/productController.js
const Product = require("../models/Product");

exports.createProduct = async (req, res) => {
  const { name, price, description, brand, categoryId } = req.body;
  if (req.user.role !== "admin" && !req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ error: "Access denied. Admin or super admin role required." });
  }
  try {
    const image = req.file
      ? `/uploads/${req.file.filename}`
      : "/uploads/default.jpg";
    const productId = await Product.create(
      name,
      price,
      description,
      image,
      brand,
      categoryId
    );
    res
      .status(201)
      .json({ id: productId, message: "Product created successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to create product: " + err.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.findAll();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to get products: " + err.message });
  }
};

exports.getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ error: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: "Failed to get product: " + err.message });
  }
};

exports.updateProduct = async (req, res) => {
  console.log(req.body);

  const { id } = req.params;
  const { name, price, description, brand, categoryId } = req.body;
  if (req.user.role !== "admin" && !req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ error: "Access denied. Admin or super admin role required." });
  }
  try {
    const success = await Product.update(
      id,
      name,
      price,
      description,
      brand,
      categoryId
    );
    if (!success) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product updated successfully" });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to update product: " + err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  const { id } = req.params;
  if (req.user.role !== "admin" && !req.user.isSuperAdmin) {
    return res
      .status(403)
      .json({ error: "Access denied. Admin or super admin role required." });
  }
  try {
    const success = await Product.delete(id);
    if (!success) return res.status(404).json({ error: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product: " + err.message });
  }
};
