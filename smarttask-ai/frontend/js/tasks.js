// My Tasks: add, edit, delete, complete, filter
let allTasks = [];

function renderTasks() {
  const status = document.getElementById("filterStatus").value;
  const priority = document.getElementById("filterPriority").value;
  const list = document.getElementById("taskList");
  const items = allTasks.filter((t) =>
    (status === "all" || t.status === status) && (priority === "all" || t.priority === priority));

  if (!items.length) { list.innerHTML = `<div class="empty">Kono task paoa jaini</div>`; return; }

  list.innerHTML = items.map((t) => `
    <div class="task-item">
      <div>
        <div class="task-title ${t.status === "completed" ? "done" : ""}">${escapeHtml(t.title)}</div>
        ${t.description ? `<div class="task-meta">${escapeHtml(t.description)}</div>` : ""}
        <div class="task-meta">${priorityBadge(t.priority)} ${statusBadge(t.status)}
          ${t.deadline ? `<span>Due: ${escapeHtml(t.deadline)}</span>` : ""}</div>
        ${t.suggestion ? `<div class="task-suggestion">AI: ${escapeHtml(t.suggestion)}</div>` : ""}
      </div>
      <div class="task-actions">
        ${t.status !== "completed" ? `<button class="btn btn-sm btn-success" data-action="complete" data-id="${t.id}">Done</button>` : ""}
        <button class="btn btn-sm btn-outline" data-action="edit" data-id="${t.id}">Edit</button>
        <button class="btn btn-sm btn-danger" data-action="delete" data-id="${t.id}">Delete</button>
      </div>
    </div>`).join("");
}

async function loadTasks() {
  try {
    allTasks = await apiRequest("/tasks");
    renderTasks();
  } catch (err) { toast(err.message, "error"); }
}

onReady(() => {
  const addForm = document.getElementById("addForm");
  const modal = document.getElementById("editModal");
  const editForm = document.getElementById("editForm");

  loadTasks();
  document.getElementById("filterStatus").addEventListener("change", renderTasks);
  document.getElementById("filterPriority").addEventListener("change", renderTasks);

  // Add
  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const title = addForm.title.value.trim();
    if (!title) return;
    try {
      await apiRequest("/tasks", "POST", {
        title, description: addForm.description.value.trim(), deadline: addForm.deadline.value || null,
      });
      addForm.reset();
      toast("Task added! AI priority set korse.");
      loadTasks();
    } catch (err) { toast(err.message, "error"); }
  });

  // Complete / Edit / Delete (event delegation)
  document.getElementById("taskList").addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    const task = allTasks.find((t) => t.id === id);
    try {
      if (btn.dataset.action === "complete") {
        await apiRequest(`/tasks/${id}/complete`, "PATCH");
        toast("Task completed!");
        loadTasks();
      } else if (btn.dataset.action === "delete") {
        if (!confirm("Ei task delete korbe?")) return;
        await apiRequest(`/tasks/${id}`, "DELETE");
        toast("Task deleted");
        loadTasks();
      } else if (btn.dataset.action === "edit") {
        editForm.id.value = task.id;
        editForm.title.value = task.title;
        editForm.description.value = task.description || "";
        editForm.deadline.value = task.deadline && /^\d{4}-\d{2}-\d{2}$/.test(task.deadline) ? task.deadline : "";
        editForm.priority.value = task.priority || "Medium";
        modal.classList.add("open");
      }
    } catch (err) { toast(err.message, "error"); }
  });

  // Edit save
  editForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    try {
      await apiRequest(`/tasks/${editForm.id.value}`, "PUT", {
        title: editForm.title.value.trim(),
        description: editForm.description.value.trim(),
        deadline: editForm.deadline.value || null,
        priority: editForm.priority.value,
      });
      modal.classList.remove("open");
      toast("Task updated");
      loadTasks();
    } catch (err) { toast(err.message, "error"); }
  });

  document.getElementById("cancelEdit").addEventListener("click", () => modal.classList.remove("open"));
  modal.addEventListener("click", (e) => { if (e.target === modal) modal.classList.remove("open"); });
});
