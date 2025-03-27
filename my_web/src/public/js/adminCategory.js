const API_URL = "http://localhost:5000/api/categories"; // Đổi thành API backend của bạn
const token = localStorage.getItem("token");

// Load danh sách danh mục
async function loadCategories() {
  try {
    const response = await fetch(API_URL);
    const categories = await response.json();
    const tableBody = document.getElementById("categoryTableBody");
    tableBody.innerHTML = "";

    categories.forEach((category) => {
      const row = document.createElement("tr");
      row.innerHTML = `
                <td>${category.id}</td>
                <td>${category.name}</td>
                <td>
                    <button class="edit" onclick="openEditModal(${category.id}, '${category.name}')">Sửa</button>
                    <button class="delete" onclick="deleteCategory(${category.id})">Xóa</button>
                </td>
            `;
      tableBody.appendChild(row);
    });
  } catch (error) {
    console.error("Lỗi tải danh mục:", error);
  }
}

// Thêm danh mục
async function addCategory() {
  const categoryName = document.getElementById("categoryName").value;
  if (!categoryName) {
    alert("Vui lòng nhập tên danh mục!");
    return;
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name: categoryName }),
    });

    if (response.ok) {
      alert("Thêm danh mục thành công");
      document.getElementById("categoryName").value = "";
      loadCategories();
    } else {
      alert("Lỗi khi thêm danh mục");
    }
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

// Mở modal chỉnh sửa danh mục
function openEditModal(id, name) {
  document.getElementById("editCategoryId").value = id;
  document.getElementById("editCategoryName").value = name;
  document.getElementById("editModal").style.display = "flex";
}

// Đóng modal
function closeModal() {
  document.getElementById("editModal").style.display = "none";
}

// Cập nhật danh mục
async function updateCategory() {
  const id = document.getElementById("editCategoryId").value;
  const name = document.getElementById("editCategoryName").value;

  if (!name) {
    alert("Vui lòng nhập tên danh mục mới!");
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      alert("cập nhật danh mục thành công");
      closeModal();
      loadCategories();
    } else {
      alert("Lỗi khi cập nhật danh mục");
    }
  } catch (error) {
    console.error("Lỗi:", error);
  }
}

// Xóa danh mục
async function deleteCategory(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {
      alert("Xóa danh mục thành công");
      loadCategories();
    } else {
      alert("Lỗi khi xóa danh mục");
    }
  } catch (error) {
    console.error("Lỗi:", error);
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
function goHome() {
  window.location.href = "/"; // Thay đổi URL nếu cần
}

// Gọi hàm load khi trang được tải
document.addEventListener("DOMContentLoaded", function () {
  loadCategories();
  checkAdmin();
});
