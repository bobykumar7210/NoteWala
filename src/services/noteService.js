import apiClient from "./apiClient";
import { NOTE_STATUS } from "../utils/constants";

/**
 * Fetch notes filtered by status and optional search query / pagination
 * Supports calling as getAllNotes(token, options) or getAllNotes(options)
 * @param {string|object} [tokenOrOptions]
 * @param {object} [maybeOptions]
 * @returns {Promise<{ data: Array, meta?: object }>}
 */
export async function getAllNotes(tokenOrOptions, maybeOptions) {
  const token = typeof tokenOrOptions === "string" ? tokenOrOptions : undefined;
  const options =
    typeof tokenOrOptions === "object" && tokenOrOptions !== null
      ? tokenOrOptions
      : maybeOptions || {};

  const { status = NOTE_STATUS.ACTIVE, q = "", page, limit } = options;

  const params = new URLSearchParams();
  if (status) params.append("status", status);
  if (q && q.trim()) params.append("q", q.trim());
  if (page) params.append("page", page);
  if (limit) params.append("limit", limit);

  const fetchOptions = { method: "GET" };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  return apiClient(`/notes?${params.toString()}`, fetchOptions);
}

/**
 * Fetch a single note by ID
 * Supports calling as getNoteById(token, id) or getNoteById(id)
 * @param {string} tokenOrId
 * @param {string} [maybeId]
 * @returns {Promise<object>}
 */
export async function getNoteById(tokenOrId, maybeId) {
  const id = maybeId || tokenOrId;
  const token = maybeId ? tokenOrId : undefined;

  const fetchOptions = { method: "GET" };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  const res = await apiClient(`/notes/${id}`, fetchOptions);
  return res.data || res;
}

/**
 * Create a new note
 * Supports calling as createNote(token, noteData) or createNote(noteData)
 * @param {string|object} tokenOrData
 * @param {object} [maybeData]
 * @returns {Promise<object>}
 */
export async function createNote(tokenOrData, maybeData) {
  const noteData = maybeData || tokenOrData || {};
  const token = maybeData ? tokenOrData : undefined;
  const { title, description = "" } = noteData;

  const fetchOptions = {
    method: "POST",
    body: JSON.stringify({ title, description }),
  };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  const res = await apiClient("/notes", fetchOptions);
  return res.data || res;
}

/**
 * Update an existing note
 * Supports calling as updateNote(token, id, updateData) or updateNote(id, updateData)
 * @param {string} tokenOrId
 * @param {string|object} idOrData
 * @param {object} [maybeData]
 * @returns {Promise<object>}
 */
export async function updateNote(tokenOrId, idOrData, maybeData) {
  let token;
  let id;
  let updateData;

  if (maybeData !== undefined) {
    token = tokenOrId;
    id = idOrData;
    updateData = maybeData;
  } else {
    id = tokenOrId;
    updateData = idOrData || {};
  }

  const { title, description = "" } = updateData;
  const fetchOptions = {
    method: "PUT",
    body: JSON.stringify({ title, description }),
  };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  const res = await apiClient(`/notes/${id}`, fetchOptions);
  return res.data || res;
}

/**
 * Soft delete a note (move to trash)
 * Supports calling as deleteNote(token, id) or deleteNote(id)
 * @param {string} tokenOrId
 * @param {string} [maybeId]
 * @returns {Promise<object>}
 */
export async function deleteNote(tokenOrId, maybeId) {
  const id = maybeId || tokenOrId;
  const token = maybeId ? tokenOrId : undefined;

  const fetchOptions = { method: "DELETE" };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  return apiClient(`/notes/${id}`, fetchOptions);
}

/**
 * Archive an active note
 * Supports calling as archiveNote(token, id) or archiveNote(id)
 * @param {string} tokenOrId
 * @param {string} [maybeId]
 * @returns {Promise<object>}
 */
export async function archiveNote(tokenOrId, maybeId) {
  const id = maybeId || tokenOrId;
  const token = maybeId ? tokenOrId : undefined;

  const fetchOptions = { method: "PATCH" };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  const res = await apiClient(`/notes/${id}/archive`, fetchOptions);
  return res.data || res;
}

/**
 * Restore an archived or deleted note
 * Supports calling as restoreNote(token, id) or restoreNote(id)
 * @param {string} tokenOrId
 * @param {string} [maybeId]
 * @returns {Promise<object>}
 */
export async function restoreNote(tokenOrId, maybeId) {
  const id = maybeId || tokenOrId;
  const token = maybeId ? tokenOrId : undefined;

  const fetchOptions = { method: "PATCH" };
  if (token) {
    fetchOptions.headers = { Authorization: `Bearer ${token}` };
  }

  const res = await apiClient(`/notes/${id}/restore`, fetchOptions);
  return res.data || res;
}

