// Shared helpers: navbar, auth guard, toast, escape
function getToken() { return localStorage.getItem("token"); }

function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("user_email");
  window.location.href = "login.html";
}

function escapeHtml(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

function priorityBadge(p) {
  const v = p || "Medium";
  return `<span class="badge badge-${v.toLowerCase()}">${escapeHtml(v)}</span>`;
}

function statusBadge(s) {
  return `<span class="badge badge-${s === "completed" ? "completed" : "pending"}">${s === "completed" ? "Completed" : "Pending"}</span>`;
}

function toast(msg, type = "success") {
  let box = document.getElementById("toast");
  if (!box) { box = document.createElement("div"); box.id = "toast"; document.body.appendChild(box); }
  const el = document.createElement("div");
  el.className = "toast-msg " + type;
  el.textContent = msg;
  box.appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

function renderNavbar() {
  const holder = document.getElementById("navbar");
  if (!holder) return;
  const page = document.body.dataset.page;
  const link = (href, label, key) =>
    `<a href="${href}" class="${page === key ? "active" : ""}">${label}</a>`;
  let links;
  if (getToken()) {
    const email = localStorage.getItem("user_email");
    links = link("dashboard.html", "Dashboard", "dashboard") +
      link("tasks.html", "My Tasks", "tasks") +
      link("ai-assistant.html", "AI Assistant", "ai") +
      (email ? `<span class="nav-user">${escapeHtml(email)}</span>` : "") +
      `<button id="logoutBtn">Logout</button>`;
  } else {
    links = link("index.html", "Home", "home") + link("login.html", "Login", "login") + link("register.html", "Register", "register");
  }
  holder.innerHTML = `<nav class="navbar"><div class="nav-inner">
    <a class="brand" href="index.html">SmartTask AI</a>
    <button class="hamburger" id="hamburger" aria-label="Menu">&#9776;</button>
    <div class="nav-links" id="navLinks">${links}</div></div></nav>`;
  document.getElementById("hamburger").addEventListener("click", () =>
    document.getElementById("navLinks").classList.toggle("open"));
  const lb = document.getElementById("logoutBtn");
  if (lb) lb.addEventListener("click", logout);
}

// Page script gulo ei function diye start hobe (redirect hole kichu cholbe na)
function onReady(fn) {
  document.addEventListener("DOMContentLoaded", () => { if (!window.__redirecting) fn(); });
}

document.addEventListener("DOMContentLoaded", () => {
  if (document.body.dataset.protected === "true" && !getToken()) {
    window.__redirecting = true;
    window.location.href = "login.html";
    return;
  }
  renderNavbar();
});
