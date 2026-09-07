import { BASE_URL, NOTE_STATUS } from "../utils/constants";

/**
 * Fetch notes filtered by status and optional search query / pagination
 * @param {string} token
 * @param {{ status?: string, q?: string, page?: number, limit?: number }} options
 * @returns {Promise<{ data: Array, meta?: object }>}
 */
export async function getAllNotes(token, { status = NOTE_STATUS.ACTIVE, q = "", page, limit } = {}) {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (q && q.trim()) params.append("q", q.trim());
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  const res = await fetch(`${BASE_URL}/notes?${params.toString()}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch notes");
  }
  return data;
}

/**
 * Fetch a single note by ID
 * @param {string} token
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function getNoteById(token, id) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to fetch note");
  }
  return data.data || data;
}

/**
 * Create a new note
 * @param {string} token
 * @param {{ title: string, description?: string }} noteData
 * @returns {Promise<object>}
 */
export async function createNote(token, { title, description = "" }) {
  const res = await fetch(`${BASE_URL}/notes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to create note");
  }
  return data.data || data;
}

/**
 * Update an existing note
 * @param {string} token
 * @param {string} id
 * @param {{ title: string, description?: string }} updateData
 * @returns {Promise<object>}
 */
export async function updateNote(token, id, { title, description = "" }) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ title, description }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to update note");
  }
  return data.data || data;
}

/**
 * Soft delete a note (move to trash)
 * @param {string} token
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function deleteNote(token, id) {
  const res = await fetch(`${BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to delete note");
  }
  return data;
}

/**
 * Archive an active note
 * @param {string} token
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function archiveNote(token, id) {
  const res = await fetch(`${BASE_URL}/notes/${id}/archive`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to archive note");
  }
  return data.data || data;
}

/**
 * Restore an archived or deleted note
 * @param {string} token
 * @param {string} id
 * @returns {Promise<object>}
 */
export async function restoreNote(token, id) {
  const res = await fetch(`${BASE_URL}/notes/${id}/restore`, {
    method: "PATCH",
    headers: { Authorization: `Bearer ${token}` },
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.message || "Failed to restore note");
  }
  return data.data || data;
}
