// Backend call helper (Member 2)
async function apiRequest(path, method = "GET", body = null) {
  const token = localStorage.getItem("token");
  const res = await fetch(API_BASE + path, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : null,
  });
  return res.json();
}
