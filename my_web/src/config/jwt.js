// src/config/jwt.js
const jwt = require("jsonwebtoken");

const secret =
  process.env.JWT_SECRET || "6c48871bc60c3912b4bbb7456c04e28c21a20e1c3130437e"; // Sử dụng biến môi trường hoặc secret mặc định

const generateToken = (payload) => {
  return jwt.sign(payload, secret, { expiresIn: "2h" });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, secret);
  } catch (err) {
    throw new Error("Invalid token");
  }
};

module.exports = { generateToken, verifyToken };
