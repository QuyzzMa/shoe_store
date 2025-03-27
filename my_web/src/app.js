const express = require("express");
const cors = require("cors");
const app = express();
const productRoutes = require("./routes/productRoutes");
const userRoutes = require("./routes/userRoutes");
const cartRoutes = require("./routes/cartRoutes");
const authRoutes = require("./routes/authRoutes");
const categoryRouters = require("./routes/categoryRoutes");
const orderRoutes = require("./routes/orderRoutes");

const path = require("path");

// Lấy đường dẫn tuyệt đối đến thư mục uploads
const uploadsPath = path.join(__dirname, "../uploads");
app.use(express.json()); // Để đọc JSON request body
app.use(express.urlencoded({ extended: true })); // Để đọc data từ form gửi lên

// Cho phép truy cập trực tiếp vào thư mục uploads
app.use("/uploads", express.static(uploadsPath));
app.use(cors()); // Thêm middleware CORS
app.use(express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRouters);
app.use("/api/orders", orderRoutes);
app.use(express.static("src/public"));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

module.exports = app;
