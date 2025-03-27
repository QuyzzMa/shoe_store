document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  if (token) {
    window.location.href = "/index.html";
  }
});

// Hàm gọi API
async function fetchAuth(url, method = "POST", body = null) {
  const options = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    console.log(response);

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || "Something went wrong");
    }
    return result;
  } catch (err) {
    throw new Error(err.message);
  }
}

// Chuyển đổi giữa đăng nhập và đăng ký
function showRegister() {
  document.getElementById("loginFormSection").style.display = "none";
  document.getElementById("registerFormSection").style.display = "block";
}

function showLogin() {
  document.getElementById("registerFormSection").style.display = "none";
  document.getElementById("loginFormSection").style.display = "block";
}

// Hiển thị/Ẩn mật khẩu
function setupPasswordToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  toggle.addEventListener("click", () => {
    const type = input.type === "password" ? "text" : "password";
    input.type = type;
    toggle.classList.toggle("fa-eye");
    toggle.classList.toggle("fa-eye-slash");
  });
}

setupPasswordToggle("togglePassword", "password");
setupPasswordToggle("toggleRegisterPassword", "register-password");
setupPasswordToggle("toggleConfirmPassword", "register-confirm-password");

// Kiểm tra mật khẩu mạnh
function validatePassword(password) {
  const minLength = 6;
  const hasNumber = /\d/;
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/;
  if (password.length < minLength) {
    return "Mật khẩu phải có ít nhất 6 ký tự";
  }
  if (!hasNumber.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 số";
  }
  if (!hasSpecialChar.test(password)) {
    return "Mật khẩu phải chứa ít nhất 1 ký tự đặc biệt";
  }
  return "";
}

// Hiển thị thông báo lỗi
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  errorElement.textContent = message;
  errorElement.style.display = message ? "block" : "none";
}

// Xử lý đăng ký
document
  .getElementById("registerForm")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    // Reset thông báo lỗi
    showError("register-username-error", "");
    showError("register-email-error", "");
    showError("register-fullname-error", "");
    showError("register-password-error", "");
    showError("register-confirm-password-error", "");

    // Kiểm tra dữ liệu
    if (data.password !== data.confirmPassword) {
      showError("register-confirm-password-error", "Mật khẩu không khớp");
      return;
    }

    const passwordError = validatePassword(data.password);
    if (passwordError) {
      showError("register-password-error", passwordError);
      return;
    }

    try {
      const result = await fetchAuth(
        "http://localhost:5000/api/auth/register",
        "POST",
        {
          fullName: data.fullName,
          email: data.email,
          username: data.username,
          password: data.password,
        }
      );
      alert(result.message);
      showLogin();
    } catch (err) {
      if (err.message.includes("already exists")) {
        showError("register-username-error", "Tên đăng nhập đã tồn tại");
      } else {
        alert("Đăng ký thất bại: " + err.message);
      }
    }
  });

// Xử lý đăng nhập
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  // Reset thông báo lỗi
  showError("username-error", "");
  showError("password-error", "");
  console.log(data);

  try {
    const result = await fetchAuth(
      "http://localhost:5000/api/auth/login",
      "POST",
      {
        username: data.username,
        password: data.password,
      }
    );
    console.log(result);

    localStorage.setItem("token", result.token);
    alert("Đăng nhập thành công!");
    window.location.href = "index.html";
  } catch (err) {
    if (err.message.includes("Invalid credentials")) {
      showError("password-error", "Tên đăng nhập hoặc mật khẩu không đúng");
    } else {
      alert("Đăng nhập thất bại: " + err.message);
    }
  }
});
