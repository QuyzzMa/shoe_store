// Hàm gọi API (không yêu cầu token cho chi tiết sản phẩm)
async function fetchProduct(url, method = "GET", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
}

// Hàm gọi API với token xác thực (dùng khi thêm vào giỏ hàng)
async function fetchWithToken(url, method = "GET", body = null) {
  const token = localStorage.getItem("token"); // Giả định bạn lưu token sau khi đăng nhập
  if (!token) {
    alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
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

// Lấy ID sản phẩm từ URL
function getProductIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const productId = params.get("id");
  console.log("Product ID from URL:", productId); // Debug để xem ID có được lấy đúng không
  return productId;
}

// Hiển thị chi tiết sản phẩm
async function loadProductDetails() {
  const productId = getProductIdFromUrl();
  if (!productId) {
    alert("Không tìm thấy ID sản phẩm.");
    window.location.href = "index.html";
    return;
  }

  try {
    const product = await fetchProduct(
      `http://localhost:5000/api/products/${productId}`
    );
    document.getElementById("productImage").src =
      product.image || "https://via.placeholder.com/300";
    document.getElementById(
      "productImage"
    ).alt = `Giày bóng đá ${product.name}`;
    document.getElementById("productName").textContent = product.name;
    document.getElementById(
      "productPrice"
    ).textContent = `Giá: ${product.price.toLocaleString()} VNĐ`;
    document.getElementById(
      "productDescription"
    ).textContent = `Giày bóng đá ${product.name} của thương hiệu ${product.brand}, mang lại cảm giác nhẹ và thoải mái khi chơi bóng.`;
  } catch (err) {
    console.error("Failed to load product:", err);
    alert("Không thể tải thông tin sản phẩm. Vui lòng thử lại.");
    window.location.href = "index.html";
  }
}

// Xử lý thêm vào giỏ hàng
document
  .getElementById("addToCartBtn")
  .addEventListener("click", async function () {
    const productId = getProductIdFromUrl();
    const quantity = parseInt(document.getElementById("quantity").value);

    if (!productId || quantity < 1) {
      alert("Vui lòng chọn số lượng hợp lệ.");
      return;
    }

    try {
      const response = await fetchWithToken(
        "http://localhost:5000/api/cart",
        "POST",
        {
          productId,
          quantity,
        }
      );
      alert(response.message);
      window.location.href = "cart.html"; // Chuyển hướng đến trang giỏ hàng
    } catch (err) {
      console.error("Failed to add to cart:", err);
      // Lỗi đã được xử lý trong fetchWithToken (chuyển hướng đến login nếu cần)
    }
  });

// Tải chi tiết sản phẩm khi trang được tải
document.addEventListener("DOMContentLoaded", loadProductDetails);
