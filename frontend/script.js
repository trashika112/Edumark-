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

function toggleFields() {
  const role = document.getElementById("role").value;
  document.getElementById("studentFields").style.display = role === "Student" ? "block" : "none";
  document.getElementById("teacherFields").style.display = role === "Teacher" ? "block" : "none";
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const role = document.getElementById("role").value;

  fetch("https://edumark-oflk.onrender.com/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, role })
  })
  .then(res => res.ok ? res.text() : Promise.reject("Login failed"))
  .then(msg => document.getElementById("message").innerText = msg)
  .catch(err => document.getElementById("message").innerText = err);
}

function registerUser() {
  const role = document.getElementById("role").value;
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;
  const department = document.getElementById("department").value;
  const section = document.getElementById("section").value;
  const usn = document.getElementById("usn").value;
  const teacherId = document.getElementById("teacherId").value;

  if (password !== confirmPassword) {
    alert("Passwords do not match.");
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
  .then(msg => alert(msg))
  .catch(err => console.error("Registration error:", err));
}

function updateMarks() {
  const dept = document.getElementById("department").value;
  const section = document.getElementById("section").value;
  const usn = document.getElementById("usn").value;
  const subject = document.getElementById("subject").value;

  fetch("https://edumark-oflk.onrender.com/api/update-marks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ dept, section, usn, subject })
  })
  .then(res => res.text())
  .then(msg => alert("Marks updated"))
  .catch(err => console.error("Error:", err));
}
