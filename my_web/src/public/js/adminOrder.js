const API_URL = "http://localhost:5000/api/orders";

// Hàm tải danh sách đơn hàng
async function loadOrders() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const orders = await response.json();
    const tableBody = document.getElementById("orderTableBody");
    tableBody.innerHTML = ""; // Clear table before inserting new data

    orders.forEach((order) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${order.id}</td>
        <td>${order.customerName}</td>
        <td>${new Date(order.createdAt).toLocaleDateString()}</td>
        <td>${order.status}</td>
        <td>
          <button class="update" onclick="updateOrderStatus(${
            order.id
          })">Cập nhật</button>
          <button class="delete" onclick="deleteOrder(${order.id})">Xóa</button>
        </td>
      `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi tải danh sách đơn hàng:", error);
  }
}

// Hàm cập nhật trạng thái đơn hàng
async function updateOrderStatus(orderId) {
  const newStatus = prompt(
    "Nhập trạng thái mới (ví dụ: Đang giao(shipped), Đã giao(delivered), Hủy(cancelled)):"
  );
  if (newStatus) {
    try {
      const response = await fetch(`${API_URL}/${orderId}/status`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,

          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        alert("Cập nhật trạng thái thành công!");
        loadOrders(); // Reload orders
      } else {
        alert("Cập nhật trạng thái thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật trạng thái đơn hàng:", error);
    }
  }
}

// Hàm xóa đơn hàng
async function deleteOrder(orderId) {
  const confirmDelete = confirm("Bạn có chắc chắn muốn xóa đơn hàng này?");
  if (confirmDelete) {
    try {
      const response = await fetch(`${API_URL}/${orderId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      if (response.ok) {
        alert("Xóa đơn hàng thành công!");
        loadOrders(); // Reload orders
      } else {
        alert("Xóa đơn hàng thất bại!");
      }
    } catch (error) {
      console.error("Lỗi xóa đơn hàng:", error);
    }
  }
}
async function checkAdmin() {
  try {
    const response = await fetch("http://localhost:5000/api/users/profile", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unauthorized");
    }
    const data = await response.json();

    if (data.role === "user") {
      alert("Bạn không có quyền truy cập trang này!");
      window.location.href = "index.html";
    }
  } catch (error) {
    window.location.href = "index.html";
    console.error("Lỗi lấy thông tin:", error);
  }
}
function goHome() {
  window.location.href = "/"; // Thay đổi URL nếu cần
}

// Load danh sách khi trang tải
document.addEventListener("DOMContentLoaded", function () {
  checkAdmin();
  loadOrders();
});
