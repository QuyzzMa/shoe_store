document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const loginLink = document.getElementById("login-link");
  const userProfile = document.getElementById("user-profile");
  const logoutBtn = document.getElementById("logout-btn");
  const adminProduct = document.getElementById("admin-product");
  const adminUSer = document.getElementById("admin-user");
  const adminCategory = document.getElementById("admin-category");
  const adminOrder = document.getElementById("admin-order");

  if (!token) {
    // Không có token → Hiển thị đăng nhập, ẩn profile và logout
    loginLink.style.display = "inline-block";
    userProfile.style.display = "none";
    logoutBtn.style.display = "none";
    adminProduct.style.display = "none"; // Ẩn liên kết admin nếu không có token
    adminUSer.style.display = "none"; // Ẩn liên kết admin nếu không có token
    adminCategory.style.display = "none"; // Ẩn liên kết admin nếu không có token
    adminOrder.style.display = "none"; // Ẩn liên kết admin nếu không có token

    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }
    const data = await response.json(); // Lấy dữ liệu trả về từ API
    console.log("User Profile:", data);
    // Ẩn nút đăng nhập, hiển thị tên người dùng và logout
    loginLink.style.display = "none";
    userProfile.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";

    userProfile.innerHTML = `Xin chào, ${data.username}!`;
    userProfile.style.marginTop = "8px";
    if (data.role === "admin") {
      adminProduct.style.display = "inline-block"; // Hiển thị link admin
      adminUSer.style.display = "inline-block"; // Hiển thị link admin
      adminCategory.style.display = "inline-block"; // Hiển thị link admin
      adminOrder.style.display = "inline-block"; // Hiển thị link admin
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin:", error);
    // localStorage.removeItem("token"); // Có thể bỏ token nếu không hợp lệ
  }
});

// Hàm đăng xuất
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html";
}
