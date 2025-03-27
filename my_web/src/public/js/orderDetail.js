// Hàm gọi API với token xác thực
async function fetchWithToken(url, method = "GET", body = null) {
  const token = localStorage.getItem("token"); // Lấy token từ localStorage
  if (!token) {
    alert("Vui lòng đăng nhập để xem đơn hàng.");
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

// Hàm xử lý hiển thị đơn hàng
function renderOrder(order) {
  const orderHtml = `
          <div class="order">
            <h3>Mã đơn hàng: ${order.id}</h3>
            <p><strong>Tổng tiền:</strong> ${order.total.toLocaleString()} VNĐ</p>
            <p><strong>Trạng thái:</strong> ${order.status}</p>
            <p><strong>Ngày đặt:</strong> ${new Date(
              order.order_date
            ).toLocaleDateString()}</p>
            <p><strong>Địa chỉ giao hàng:</strong> ${order.shipping_address}</p>
            <p><strong>Phương thức thanh toán:</strong> ${
              order.paymentMethod
            }</p>

            <h4>Danh sách sản phẩm:</h4>
            <table>
              <thead>
                <tr>
                  <th>Tên sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Giá</th>
                </tr>
              </thead>
              <tbody>
                ${order.items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.product_name}</td>
                    <td>${item.quantity}</td>
                    <td>${item.price.toLocaleString()} VNĐ</td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `;
  return orderHtml;
}

// Hàm gọi API để lấy danh sách đơn hàng
async function fetchOrders() {
  try {
    const orders = await fetchWithToken(
      "http://localhost:5000/api/orders/user"
    );
    const ordersListContainer = document.getElementById("orders-list");

    if (orders.length === 0) {
      ordersListContainer.innerHTML = "<p>Không có đơn hàng nào.</p>";
    } else {
      const ordersHtml = orders.map((order) => renderOrder(order)).join("");
      ordersListContainer.innerHTML = ordersHtml;
    }
  } catch (error) {
    console.error("Lỗi khi lấy đơn hàng:", error);
    document.getElementById("orders-list").innerHTML =
      "<p>Không thể tải dữ liệu đơn hàng.</p>";
  }
}

// Gọi hàm fetchOrders khi trang được tải
window.onload = fetchOrders;
