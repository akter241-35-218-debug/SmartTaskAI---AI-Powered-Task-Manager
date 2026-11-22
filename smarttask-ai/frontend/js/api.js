// Backend call helper. Sob page ei function diye API call kore.
async function apiRequest(path, method = "GET", body = null) {
  if (USE_MOCK) return mockApi(path, method, body);

  const token = localStorage.getItem("token");
  let res;
  try {
    res = await fetch(API_BASE + path, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : null,
    });
  } catch (e) {
    throw new Error("Server-er sathe connect kora jachhe na");
  }

  let data = null;
  try { data = await res.json(); } catch (e) { /* empty body */ }

  if (!res.ok) {
    if (res.status === 401 && token) logout();
    const detail = data && data.detail;
    throw new Error(typeof detail === "string" ? detail : (data && data.message) || "Something went wrong");
  }
  return data;
}
