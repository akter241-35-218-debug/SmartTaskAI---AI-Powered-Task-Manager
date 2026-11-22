// Dashboard: stats + recent tasks
onReady(async () => {
  try {
    const s = await apiRequest("/tasks/stats");
    document.getElementById("statTotal").textContent = s.total;
    document.getElementById("statCompleted").textContent = s.completed;
    document.getElementById("statPending").textContent = s.pending;
    document.getElementById("statHigh").textContent = s.high_priority;

    const tasks = await apiRequest("/tasks");
    const list = document.getElementById("recentTasks");
    const recent = tasks.slice(0, 5);
    list.innerHTML = recent.length
      ? recent.map((t) => `<div class="task-item"><div>
          <div class="task-title ${t.status === "completed" ? "done" : ""}">${escapeHtml(t.title)}</div>
          <div class="task-meta">${priorityBadge(t.priority)} ${statusBadge(t.status)}
          ${t.deadline ? "<span>Due: " + escapeHtml(t.deadline) + "</span>" : ""}</div></div></div>`).join("")
      : `<div class="empty">Kono task nai. <a href="tasks.html">Prothom task add koro</a></div>`;
  } catch (err) {
    toast(err.message, "error");
  }
});
