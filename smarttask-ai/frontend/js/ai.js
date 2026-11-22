// AI Assistant: analyze task + productivity tips
const TIPS = [
  "Boro task-ke choto choto step-e bhag koro.",
  "Prothome High priority task shesh koro, tarpor baki gulo.",
  "25 minute focus kore 5 minute break nao (Pomodoro).",
  "Ratei porer diner top 3 task likhe rakho.",
  "Ekbare ekta-i kaj koro, multitasking productivity kombay.",
  "Kaj shuru korte 2 minute-er choto step diye shuru koro.",
];
let lastResult = null;

onReady(() => {
  const form = document.getElementById("analyzeForm");
  const box = document.getElementById("aiResult");
  const tipBox = document.getElementById("tipBox");
  let tipIndex = Math.floor(Math.random() * TIPS.length);
  tipBox.textContent = TIPS[tipIndex];

  document.getElementById("nextTip").addEventListener("click", () => {
    tipIndex = (tipIndex + 1) % TIPS.length;
    tipBox.textContent = TIPS[tipIndex];
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = form.text.value.trim();
    if (!text) return;
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Analyzing...";
    try {
      const r = await apiRequest("/ai/analyze", "POST", { text });
      lastResult = { text, ...r };
      box.innerHTML = `
        <h2>Task Analysis</h2>
        <dl>
          <dt>Priority</dt><dd>${priorityBadge(r.priority)}</dd>
          <dt>Task</dt><dd>${escapeHtml(r.task || text)}</dd>
          <dt>Deadline</dt><dd>${escapeHtml(r.deadline || "Not specified")}</dd>
          <dt>Status</dt><dd>${statusBadge("pending")}</dd>
          <dt>AI Suggestion</dt><dd>${escapeHtml(r.suggestion)}</dd>
        </dl>
        <button class="btn" id="addAsTask">Add to My Tasks</button>`;
      box.classList.add("show");
    } catch (err) { toast(err.message, "error"); }
    btn.disabled = false; btn.textContent = "Analyze with AI";
  });

  box.addEventListener("click", async (e) => {
    if (e.target.id !== "addAsTask" || !lastResult) return;
    try {
      await apiRequest("/tasks", "POST", { title: lastResult.text, description: "", deadline: null });
      toast("Task add hoyeche!");
      e.target.disabled = true;
    } catch (err) { toast(err.message, "error"); }
  });
});
