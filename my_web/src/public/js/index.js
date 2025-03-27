document.addEventListener("DOMContentLoaded", loadFeaturedProducts());

async function loadFeaturedProducts() {
  const productList = document.getElementById("productList");
  productList.innerHTML = "<p>Đang tải sản phẩm...</p>"; // Placeholder

  try {
    const response = await fetch("http://localhost:5000/api/products");
    if (!response.ok) {
      throw new Error(`Lỗi: ${response.status} - ${response.statusText}`);
    }

    const products = await response.json();
    console.log("Dữ liệu sản phẩm:", products);

    productList.innerHTML = ""; // Xóa nội dung placeholder sau khi có dữ liệu

    products.slice(0, 3).forEach((product, index) => {
      const productItem = document.createElement("div");
      productItem.className = "product-item";
      productItem.innerHTML = `
        <img src="${product.image || "https://via.placeholder.com/150"}"
            alt="Giày bóng đá ${product?.name}"
            loading="${index === 0 ? "eager" : "lazy"}"
            class="loading">
        <h3>${product.name}</h3>
        <p>Giá: ${product.price.toLocaleString()} VNĐ</p>
        <a href="product-detail.html?id=${
          product.id
        }" class="btn">Xem chi tiết</a>
      `;

      productList.appendChild(productItem);
    });
  } catch (err) {
    productList.innerHTML =
      "<p>Không thể tải sản phẩm. Vui lòng thử lại sau.</p>";
    console.error("Lỗi khi tải sản phẩm:", err);
  }
}
// Đếm ngược Flash Sale
const countDownDate = new Date("March 31, 2025 23:59:59").getTime();
const timerUpdate = () => {
  const now = new Date().getTime();
  const distance = countDownDate - now;
  const days = Math.floor(distance / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((distance % (1000 * 60)) / 1000);

  document.getElementById("days").textContent = days;
  document.getElementById("hrs").textContent = hours;
  document.getElementById("mins").textContent = minutes;
  document.getElementById("secs").textContent = seconds;

  if (distance < 0) {
    clearInterval(countdownInterval);
    document.querySelector(".timer").innerHTML =
      "<p>Flash Sale đã kết thúc</p>";
  }
};

const countdownInterval = setInterval(timerUpdate, 1000);
timerUpdate(); // Chạy ngay lần đầu

// Modal Toggle và sao chép mã
const modal = document.getElementById("coupon-modal");
document.querySelector(".coupon-toggle").addEventListener("click", () => {
  modal.style.display = "flex";
});

document.querySelector(".btn-close").addEventListener("click", () => {
  modal.style.display = "none";
});

document.querySelector(".btn-copy").addEventListener("click", () => {
  navigator.clipboard
    .writeText("NEYMAR30")
    .then(() => {
      alert("Đã sao chép mã: NEYMAR30");
    })
    .catch((err) => {
      console.error("Failed to copy:", err);
      alert("Sao chép thất bại. Vui lòng thử lại.");
    });
});

// Tải sản phẩm khi trang được tải
