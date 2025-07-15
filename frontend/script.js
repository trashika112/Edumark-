// 🔄 Navigation
function goToLogin() {
  window.location.href = "login.html";
}

function goToRegister() {
  window.location.href = "register.html";
}

function goBack() {
  window.history.back();
}

function logout() {
  window.location.href = "index.html";
}

// 🔀 Show/hide Student or Teacher fields during registration
function toggleFields() {
  const role = document.getElementById("role").value;
  document.getElementById("studentFields").style.display = role === "Student" ? "block" : "none";
  document.getElementById("teacherFields").style.display = role === "Teacher" ? "block" : "none";
}

// ✅ Login Function
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const role = document.getElementById("role").value;

  if (!username || !password || !role) {
    document.getElementById("message").innerText = "⚠️ Please fill in all fields.";
    return;
  }

  fetch("https://edumark-oflk.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  })
  .then(res => res.ok ? res.text() : Promise.reject("Login failed"))
  .then(msg => {
    document.getElementById("message").innerText = msg;

    if (msg.toLowerCase().includes("no account")) {
      alert("⚠️ No account found. Please register.");
      window.location.href = "register.html";
    } else if (msg.toLowerCase().includes("success")) {
      alert("✅ Login successful!");
      if (role === "Student") {
        window.location.href = "student-dashboard.html";
      } else if (role === "Teacher") {
        window.location.href = "teacher-dashboard.html";
      }
    } else {
      alert("❌ " + msg);
    }
  })
  .catch(err => {
    console.error("Login error:", err);
    document.getElementById("message").innerText = "❌ Login error. Please try again.";
  });
}

// ✅ Register Function
function registerUser() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value;
  const usn = document.getElementById("usn")?.value.trim();
  const teacherId = document.getElementById("teacherId")?.value.trim();

  if (!username || !password || !confirmPassword || !department || !section || !role) {
    alert("⚠️ Please fill in all required fields.");
    return;
  }

  if (password !== confirmPassword) {
    alert("❌ Passwords do not match.");
    return;
  }

  const data = {
    username,
    password,
    role,
    department,
    section,
    usn: role === "Student" ? usn : null,
    teacherId: role === "Teacher" ? teacherId : null
  };

  fetch("https://edumark-oflk.onrender.com/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  })
  .then(res => res.text())
  .then(msg => {
    alert(msg);
    if (msg.toLowerCase().includes("success")) {
      window.location.href = "login.html";
    }
  })
  .catch(err => {
    console.error("Registration error:", err);
    alert("❌ Registration failed. Try again.");
  });
}

// ✅ Update Marks (for Teacher Dashboard)
function updateMarks() {
  const dept = document.getElementById("department").value;
  const section = document.getElementById("section").value;
  const usn = document.getElementById("usn").value;
  const subject = document.getElementById("subject").value;
  const marks = document.getElementById("marks").value;

  fetch("https://edumark-oflk.onrender.com/api/update-marks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dept, section, usn, subject, marks })
  })
  .then(res => res.text())
  .then(msg => alert("✅ Marks updated: " + msg))
  .catch(err => {
    console.error("Error updating marks:", err);
    alert("❌ Failed to update marks");
  });
}
