document.addEventListener("DOMContentLoaded", async function () {
  const token = localStorage.getItem("token");
  const loginLink = document.getElementById("login-link");
  const userProfile = document.getElementById("user-profile");
  const logoutBtn = document.getElementById("logout-btn");

  if (!token) {
    // No token → Show login, hide profile and logout
    loginLink.style.display = "inline-block";
    userProfile.style.display = "none";
    logoutBtn.style.display = "none";
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

    const data = await response.json();
    console.log("User Profile:", data);

    // Hide login link, show profile & logout button
    loginLink.style.display = "none";
    userProfile.style.display = "inline-block";
    logoutBtn.style.display = "inline-block";

    userProfile.innerHTML = `Xin chào, ${data.username}!`;
  } catch (error) {
    console.error("Lỗi lấy thông tin:", error);
    // localStorage.removeItem("token"); // Remove invalid token
  }
});

// Logout function
function logout() {
  localStorage.removeItem("token");
  window.location.href = "login.html"; // Redirect after logout
}
// Hàm gọi API với token xác thực
async function fetchWithToken(url, method = "GET", body = null) {
  const token = localStorage.getItem("token"); // Giả định bạn lưu token sau khi đăng nhập
  if (!token) {
    alert("Vui lòng đăng nhập để sử dụng giỏ hàng.");
    window.location.href = "login.html";
    throw new Error("No token found");
  }

  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    if (response.status === 401) {
      alert("Phiên đăng nhập hết hạn. Vui lòng đăng nhập lại.");
      window.location.href = "login.html";
    }
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Lấy danh sách sản phẩm trong giỏ hàng
async function loadCart() {
  try {
    const cartItems = await fetchWithToken("http://localhost:5000/api/cart");

    updateCart(cartItems);
  } catch (err) {
    console.error("Failed to load cart:", err);
    alert("Không thể tải giỏ hàng. Vui lòng thử lại.");
  }
}

// Thêm sản phẩm vào giỏ hàng
async function addProduct() {
  window.location.href = "products.html"; // Sau khi thêm sản phẩm vào giỏ hàng, chuyển hướng đến trang sản phẩm
}

// Xóa sản phẩm khỏi giỏ hàng
async function removeItem(button, cartId) {
  try {
    await fetchWithToken(`http://localhost:5000/api/cart/${cartId}`, "DELETE");
    loadCart(); // Tải lại giỏ hàng sau khi xóa
  } catch (err) {
    console.error("Failed to remove product from cart:", err);
    alert("Không thể xóa sản phẩm khỏi giỏ hàng. Vui lòng thử lại.");
  }
}

// Thanh toán
// Hiển thị popup khi nhấn Thanh toán
function checkout() {
  const paymentPopup = document.getElementById("paymentPopup");
  paymentPopup.style.display = "flex"; // Hiển thị popup
}

// Đóng popup
function closePaymentPopup() {
  const paymentPopup = document.getElementById("paymentPopup");
  paymentPopup.style.display = "none"; // Ẩn popup
}

// Xử lý form thanh toán
document
  .getElementById("paymentForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Ngừng gửi form mặc định

    const shippingAddress = document.getElementById("address").value;
    const phone = document.getElementById("phone").value;
    const paymentMethod = document.getElementById("paymentMethod").value;

    try {
      const response = await fetchWithToken(
        "http://localhost:5000/api/orders",
        "POST",
        {
          shippingAddress,
          phone,
          paymentMethod,
        }
      );

      alert(response.message); // Hiển thị thông báo thành công
      await fetchWithToken("http://localhost:5000/api/cart/checkout", "POST");
      closePaymentPopup(); // Đóng popup
      loadCart(); // Tải lại giỏ hàng sau khi thanh toán thành công
    } catch (error) {
      console.error("Thanh toán thất bại:", error);
      alert("Có lỗi xảy ra khi thanh toán. Vui lòng thử lại.");
    }
  });

// Cập nhật giao diện giỏ hàng
function updateCart(cartItems) {
  const cartItemsDiv = document.getElementById("cartItems");
  const cartTotalDiv = document.getElementById("cartTotal");
  const cartEmptyDiv = document.getElementById("cartEmpty");
  const checkoutBtn = document.getElementById("checkoutBtn");

  if (cartItems.length === 0) {
    cartItemsDiv.style.display = "none";
    cartTotalDiv.style.display = "none";
    checkoutBtn.style.display = "none";
    cartEmptyDiv.style.display = "block";
    return;
  }

  cartEmptyDiv.style.display = "none";
  cartItemsDiv.style.display = "block";
  cartTotalDiv.style.display = "block";
  checkoutBtn.style.display = "block";

  cartItemsDiv.innerHTML = "";
  let total = 0;
  cartItems.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;
    const itemDiv = document.createElement("div");
    itemDiv.className = "cart-item";
    itemDiv.innerHTML = `
                    <p>${item.name}: ${item.price.toLocaleString()} VNĐ x ${
      item.quantity
    }</p>
                    <button onclick="removeItem(this, ${item.id})">Xóa</button>
                `;
    cartItemsDiv.appendChild(itemDiv);
  });

  cartTotalDiv.innerHTML = `<strong>Tổng tiền: <span>${total.toLocaleString()} VNĐ</span></strong>`;
}

// Tải giỏ hàng khi trang được tải
document.addEventListener("DOMContentLoaded", loadCart);
