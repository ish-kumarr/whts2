const API_BASE = "http://localhost:3005";

export async function fetchTasks() {
  const res = await fetch(`${API_BASE}/deadlines`);
  return res.json();
}

export async function fetchNotes() {
  const res = await fetch(`${API_BASE}/notes`);
  return res.json();
}

export async function fetchImportantMessages() {
  const res = await fetch(`${API_BASE}/important-messages`);
  return res.json();
}

export async function fetchSimpleMessages() {
  const res = await fetch(`${API_BASE}/simpler-messages`);
  return res.json();
}

export async function createTask(task: any) {
  const res = await fetch(`${API_BASE}/deadlines`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function toggleTaskComplete(taskName: string) {
  const res = await fetch(`${API_BASE}/deadlines/${encodeURIComponent(taskName)}`, {
    method: "PATCH",
  });
  return res.json();
}

export async function deleteTask(taskName: string) {
  const res = await fetch(`${API_BASE}/deadlines/${encodeURIComponent(taskName)}`, {
    method: "DELETE",
  });
  return res.json();
}