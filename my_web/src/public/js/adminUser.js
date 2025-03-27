const API_URL = "http://localhost:5000/api/users";
let currentUserId = null;
const token = localStorage.getItem("token");

// Load danh sách người dùng
async function loadUsers() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
    });
    console.log(response);

    const users = await response.json();
    const tableBody = document.getElementById("userTableBody");
    tableBody.innerHTML = "";

    users.forEach((user) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.fullName}</td>
                <td>${user.email}</td>
                <td>${user.username}</td>
                <td>${user.role}</td>
                <td>
                    <button class="edit" onclick="openEditModal(${user.id}, '${user.fullName}', '${user.email}', '${user.username}', '${user.role}')">Sửa</button>
                    <button class="delete" onclick="deleteUser(${user.id})">Xóa</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi tải danh sách:", error);
  }
}
async function checkAdmin() {
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

    if (data.role === "user") {
      alert("Bạn không có quyền truy cập trang này!");
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Lỗi lấy thông tin:", error);
  }
}

// Mở modal chỉnh sửa
function openEditModal(id, fullName, email, username, role) {
  currentUserId = id;
  document.getElementById("editFullName").value = fullName;
  document.getElementById("editEmail").value = email;
  document.getElementById("editUsername").value = username;
  document.getElementById("editRole").value = role;
  document.getElementById("editForm").style.display = "flex";
}

// Đóng modal
function closeModal() {
  document.getElementById("editForm").style.display = "none";
}

// Cập nhật người dùng
async function updateUser() {
  const fullName = document.getElementById("editFullName").value;
  const email = document.getElementById("editEmail").value;
  const username = document.getElementById("editUsername").value;
  const role = document.getElementById("editRole").value;

  try {
    const response = await fetch(`${API_URL}/${currentUserId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fullName, email, username, role }),
    });

    if (!response.ok) throw new Error("Cập nhật thất bại");

    alert("Cập nhật thành công!");
    closeModal();
    loadUsers();
  } catch (error) {
    alert("Lỗi cập nhật: " + error.message);
  }
}

// Xóa người dùng
async function deleteUser(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa người dùng này không?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Xóa thất bại");

    alert("Xóa thành công!");
    loadUsers();
  } catch (error) {
    alert("Lỗi xóa: " + error.message);
  }
}
function goHome() {
  window.location.href = "/"; // Thay đổi URL nếu cần
}

// Load danh sách khi trang tải
document.addEventListener("DOMContentLoaded", function () {
  checkAdmin();
  loadUsers();
});
