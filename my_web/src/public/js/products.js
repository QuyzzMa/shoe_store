document.addEventListener("DOMContentLoaded", () => {
  fetchProducts(); // Gọi API lấy danh sách sản phẩm ngay khi DOM tải xong
});

async function fetchProducts() {
  try {
    const response = await fetch("http://localhost:5000/api/products"); // Đổi URL nếu cần
    if (!response.ok) {
      throw new Error("Không thể tải danh sách sản phẩm");
    }

    const products = await response.json();

    renderProducts(products);
  } catch (err) {
    console.error("Lỗi khi lấy sản phẩm:", err);
    document.getElementById("productList").innerHTML =
      "<p>Không thể tải sản phẩm.</p>";
  }
}

function renderProducts(products) {
  const productList = document.getElementById("productList");
  productList.innerHTML = ""; // Xóa nội dung cũ nếu có
  console.log(products);

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
      <a href="product-detail.html?id=${product.id}">
    <img src="http://localhost:5000${
      product.image || "https://via.placeholder.com/200"
    }" alt="${product.name}" />
  </a>
            <h3>${product.name}</h3>
            <p>${product.price.toLocaleString()} VNĐ</p>
            <button class="btn add-to-cart" onclick="addToCart('${
              product.id
            }', '${product.name}', ${product.price}, 1)">
                Thêm vào giỏ hàng <i class="fas fa-cart-plus"></i>
            </button>
        `;

    productList.appendChild(productCard);
  });
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

// Thêm vào giỏ hàng
async function addToCart(productId, name, price, quantity) {
  if (!productId || quantity < 1) {
    alert("Vui lòng chọn số lượng hợp lệ.");
    return;
  }

  try {
    // Gọi API để thêm sản phẩm vào giỏ hàng
    const response = await fetchWithToken(
      "http://localhost:5000/api/cart",
      "POST",
      {
        productId,
        quantity,
      }
    );

    console.log(response);

    alert(`${name} đã được thêm vào giỏ hàng!`);
    window.location.href = "cart.html"; // Chuyển hướng đến trang giỏ hàng
  } catch (err) {
    console.error("Failed to add to cart:", err);
    alert("Lỗi khi thêm sản phẩm vào giỏ hàng.");
  }
}
