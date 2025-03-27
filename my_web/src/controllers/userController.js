// src/controllers/userController.js
const User = require("../models/User");
const { generateToken } = require("../config/jwt");
const bcrypt = require("bcrypt");
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Lỗi khi lấy danh sách người dùng: " + err.message });
  }
};

exports.register = async (req, res) => {
  const {
    fullName,
    email,
    username,
    password,
    role = "user",
    isSuperAdmin = false,
  } = req.body;
  try {
    const existingUser = await User.findByUsername(username);
    if (existingUser)
      return res.status(400).json({ error: "Username already exists" });

    const userId = await User.create(
      fullName,
      email,
      username,
      password,
      role,
      isSuperAdmin
    );
    const token = generateToken({ id: userId, username, role, isSuperAdmin });
    res.status(201).json({ message: "User registered successfully", token });
  } catch (err) {
    res.status(500).json({ error: "Failed to register user: " + err.message });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findByUsername(username);
    if (!user) return res.status(401).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = generateToken({
      id: user.id,
      username: user.username,
      role: user.role,
      isSuperAdmin: user.is_super_admin,
    });
    res.json({ message: "Login successful", token });
  } catch (err) {
    res.status(500).json({ error: "Failed to login: " + err.message });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req?.user?.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      username: user.username,
      role: user.role,
    });
  } catch (err) {
    res
      .status(500)
      .json({ error: "Failed to get user profile: " + err.message });
  }
};
// Cập nhật thông tin người dùng
exports.updateUser = async (req, res) => {
  const { fullName, email, username, password, role, isSuperAdmin } = req.body;
  try {
    const existingUser = await User.findById(req.params.id);
    if (!existingUser) return res.status(404).json({ error: "User not found" });

    let updatedData = { fullName, email, username, role, isSuperAdmin };

    const success = await User.updateUser(req.params.id, updatedData);
    if (success) {
      res.json({ message: "User updated successfully" });
    } else {
      res.status(400).json({ error: "Failed to update user" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to update user: " + err.message });
  }
};

// Xóa người dùng
exports.deleteUser = async (req, res) => {
  try {
    const success = await User.deleteUser(req.params.id);
    if (success) {
      res.json({ message: "User deleted successfully" });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (err) {
    res.status(500).json({ error: "Failed to delete user: " + err.message });
  }
};
