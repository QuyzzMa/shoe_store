// src/controllers/authController.js
const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const bcrypt = require("bcrypt");

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    username,
    password,
    role = "user",
    isSuperAdmin = false,
  } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!fullName || !email || !username || !password) {
    return res
      .status(400)
      .json({ error: "Full name, email, username, and password are required" });
  }

  try {
    // Kiểm tra xem username đã tồn tại chưa
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const userId = await User.create(
      fullName,
      email,
      username,
      hashedPassword,
      role,
      isSuperAdmin
    );
    const token = generateToken({
      id: userId,
      email,
      username,
      role,
      isSuperAdmin,
    });

    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user: " + err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra các trường bắt buộc
  if (!username || !password) {
    return res
      .status(400)
      .json({ error: "Username and password are required" });
  }

  try {
    // Tìm người dùng theo username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ error: "Invalid credentials" });
    }
    console.log("Password entered:", password);
    console.log("Hashed password from DB:", user.password);
    console.log(user);
    console.log(user.password);

    const isMatch = bcrypt.compareSync(password, user.password);
    console.log("Do the passwords match?", isMatch);

    // Kiểm tra mật khẩu
    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Tạo token
    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      email: user.email,
      isSuperAdmin: user.is_super_admin,
    });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.log(err);

    res.status(500).json({ error: "Failed to login: " + err.message });
  }
};
