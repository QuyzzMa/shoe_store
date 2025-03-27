const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "", // Thay bằng email của bạn
    pass: "", // Mật khẩu ứng dụng Gmail của bạn
  },
});

exports.sendOrderConfirmation = async (to, order) => {
  try {
    const mailOptions = {
      from: "", // Thay bằng email của bạn
      to,
      subject: "Xác nhận đơn hàng của bạn",
      html: `
        <h2>Đơn hàng của bạn đã được tạo!</h2>
        <p>Vui lòng xác nhận đơn hàng để chúng tôi tiến hành giao hàng.</p>
        <p><strong>Mã đơn hàng:</strong> ${order.id}</p>
        <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString()} VNĐ</p>
        <p><strong>Địa chỉ giao hàng:</strong> ${order.shippingAddress}</p>
        <p><strong>Phương thức thanh toán:</strong> ${order.paymentMethod}</p>
        <p>Chọn một trong hai tùy chọn:</p>

    
          <a href="${order.confirmationLink}" 
             style="display:inline-block;padding:10px 15px;background:#28a745;color:white;text-decoration:none;border-radius:5px;margin-right:10px;">
             ✅ Xác nhận đơn hàng
          </a>
     

        <a href="${order.cancelLink}" 
           style="display:inline-block;padding:10px 15px;background:#dc3545;color:white;text-decoration:none;border-radius:5px;">
           ❌ Hủy đơn hàng
        </a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Email xác nhận đơn hàng đã được gửi!");
  } catch (error) {
    console.error("❌ Lỗi khi gửi email:", error);
  }
};
