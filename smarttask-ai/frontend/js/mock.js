// Mock API: Backend ready howar age frontend test korar jonno.
// Real backend connect korle config.js-e USE_MOCK = false koro.

const MOCK_HIGH = ["urgent", "asap", "today", "tomorrow", "deadline", "exam", "assignment", "submit", "due", "emergency"];
const MOCK_LOW = ["someday", "later", "optional", "watch", "read", "relax", "hobby"];
const MOCK_SUGGESTIONS = {
  High: "Complete this before the deadline. Start as soon as possible.",
  Medium: "Plan a time slot for this within the next few days.",
  Low: "Do this when you have free time. No rush.",
};

function mockAnalyze(text) {
  const t = text.toLowerCase();
  let priority = "Medium";
  if (MOCK_HIGH.some((w) => t.includes(w))) priority = "High";
  else if (MOCK_LOW.some((w) => t.includes(w))) priority = "Low";
  const dl = ["today", "tomorrow", "next week", "this weekend"].find((w) => t.includes(w));
  const task = dl ? text.replace(new RegExp(dl, "i"), "").replace(/\s+/g, " ").trim() : text;
  return {
    task,
    deadline: dl ? dl.charAt(0).toUpperCase() + dl.slice(1) : null,
    priority,
    suggestion: MOCK_SUGGESTIONS[priority],
  };
}

function mockLoad() {
  return JSON.parse(localStorage.getItem("mock_db") || '{"users":[],"tasks":[],"nextId":1}');
}
function mockSave(db) {
  localStorage.setItem("mock_db", JSON.stringify(db));
}

async function mockApi(path, method, body) {
  await new Promise((r) => setTimeout(r, 150));
  const db = mockLoad();
  const token = localStorage.getItem("token") || "";
  const email = token.replace("mock-token-", "");

  if (path === "/auth/register" && method === "POST") {
    if (db.users.some((u) => u.email === body.email)) throw new Error("Email already registered");
    const user = { id: db.users.length + 1, name: body.name, email: body.email, password: body.password };
    db.users.push(user);
    mockSave(db);
    return { id: user.id, name: user.name, email: user.email };
  }
  if (path === "/auth/login" && method === "POST") {
    const u = db.users.find((x) => x.email === body.email && x.password === body.password);
    if (!u) throw new Error("Invalid email or password");
    return { access_token: "mock-token-" + u.email, token_type: "bearer" };
  }

  if (!email) throw new Error("Not authenticated");
  const mine = db.tasks.filter((t) => t.user_email === email);

  if (path === "/tasks/stats") {
    return {
      total: mine.length,
      completed: mine.filter((t) => t.status === "completed").length,
      pending: mine.filter((t) => t.status === "pending").length,
      high_priority: mine.filter((t) => t.priority === "High" && t.status === "pending").length,
    };
  }
  if (path === "/tasks" && method === "GET") return mine.slice().reverse();
  if (path === "/tasks" && method === "POST") {
    const ai = mockAnalyze(body.title);
    const task = {
      id: db.nextId++, user_email: email, title: body.title, description: body.description || "",
      priority: body.priority || ai.priority, deadline: body.deadline || null,
      status: "pending", suggestion: ai.suggestion,
    };
    db.tasks.push(task);
    mockSave(db);
    return task;
  }

  const m = path.match(/^\/tasks\/(\d+)(\/complete)?$/);
  if (m) {
    const task = db.tasks.find((t) => t.id === Number(m[1]) && t.user_email === email);
    if (!task) throw new Error("Task not found");
    if (method === "PUT") Object.assign(task, body);
    else if (method === "PATCH" && m[2]) task.status = "completed";
    else if (method === "DELETE") db.tasks = db.tasks.filter((t) => t !== task);
    mockSave(db);
    return task;
  }

  if (path === "/ai/analyze" && method === "POST") return mockAnalyze(body.text);
  throw new Error("Mock: unknown endpoint " + method + " " + path);
}
