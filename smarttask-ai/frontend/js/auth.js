// Login & Register logic
onReady(() => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const errBox = document.getElementById("formError");

  if (getToken()) { window.location.href = "dashboard.html"; return; }

  if (new URLSearchParams(location.search).get("registered")) {
    toast("Account created! Ekhon login koro.");
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errBox.textContent = "";
      const btn = loginForm.querySelector("button[type=submit]");
      btn.disabled = true;
      const email = loginForm.email.value.trim();
      try {
        const data = await apiRequest("/auth/login", "POST", { email, password: loginForm.password.value });
        localStorage.setItem("token", data.access_token);
        localStorage.setItem("user_email", email);
        window.location.href = "dashboard.html";
      } catch (err) {
        errBox.textContent = err.message;
        btn.disabled = false;
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      errBox.textContent = "";
      if (registerForm.password.value.length < 6) { errBox.textContent = "Password kom-pokkhe 6 character hote hobe"; return; }
      if (registerForm.password.value !== registerForm.confirm.value) { errBox.textContent = "Password duto mile nai"; return; }
      const btn = registerForm.querySelector("button[type=submit]");
      btn.disabled = true;
      try {
        await apiRequest("/auth/register", "POST", {
          name: registerForm.name.value.trim(),
          email: registerForm.email.value.trim(),
          password: registerForm.password.value,
        });
        window.location.href = "login.html?registered=1";
      } catch (err) {
        errBox.textContent = err.message;
        btn.disabled = false;
      }
    });
  }
});
