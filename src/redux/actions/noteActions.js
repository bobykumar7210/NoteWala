import {
  FETCH_NOTES_REQUEST,
  FETCH_NOTES_SUCCESS,
  FETCH_NOTES_FAILURE,
  ADD_NOTE_SUCCESS,
  UPDATE_NOTE_SUCCESS,
  DELETE_NOTE_SUCCESS,
  ARCHIVE_NOTE_SUCCESS,
  RESTORE_NOTE_SUCCESS,
  SET_ACTIVE_NOTE,
  CLEAR_ACTIVE_NOTE,
  SET_SEARCH_QUERY,
  SET_ACTIVE_TAB,
  SET_NOTE_TO_DELETE,
  CLEAR_NOTE_TO_DELETE,
  SET_IS_DELETING,
} from "../types/noteTypes";
import {
  getAllNotes,
  getNoteById,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
  restoreNote as apiRestoreNote,
} from "../../services/noteService";

// ── Plain Action Creators ───────────────────────────────────────────
export const fetchNotesRequest = () => ({ type: FETCH_NOTES_REQUEST });

export const fetchNotesSuccess = (notes) => ({
  type: FETCH_NOTES_SUCCESS,
  payload: notes,
});

export const fetchNotesFailure = (error) => ({
  type: FETCH_NOTES_FAILURE,
  payload: error,
});

export const addNoteSuccess = (note) => ({
  type: ADD_NOTE_SUCCESS,
  payload: note,
});

export const updateNoteSuccess = (note) => ({
  type: UPDATE_NOTE_SUCCESS,
  payload: note,
});

export const deleteNoteSuccess = (id) => ({
  type: DELETE_NOTE_SUCCESS,
  payload: id,
});

export const archiveNoteSuccess = (note) => ({
  type: ARCHIVE_NOTE_SUCCESS,
  payload: note,
});

export const restoreNoteSuccess = (note) => ({
  type: RESTORE_NOTE_SUCCESS,
  payload: note,
});

export const setActiveNote = (note) => ({
  type: SET_ACTIVE_NOTE,
  payload: note,
});

export const clearActiveNote = () => ({ type: CLEAR_ACTIVE_NOTE });

export const setSearchQuery = (query) => ({
  type: SET_SEARCH_QUERY,
  payload: query,
});

export const setActiveTab = (tab) => ({
  type: SET_ACTIVE_TAB,
  payload: tab,
});

export const setNoteToDelete = (note) => ({
  type: SET_NOTE_TO_DELETE,
  payload: note,
});

export const clearNoteToDelete = () => ({ type: CLEAR_NOTE_TO_DELETE });

export const setIsDeleting = (isDeleting) => ({
  type: SET_IS_DELETING,
  payload: isDeleting,
});

// ── Async Thunk Creators ────────────────────────────────────────────

/**
 * Thunk to fetch notes list with current or provided query & tab
 */
export const fetchNotesThunk = (options = {}) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;
  const currentTab = options.tab !== undefined ? options.tab : state.notes.activeTab;
  const currentQuery = options.query !== undefined ? options.query : state.notes.searchQuery;

  dispatch(fetchNotesRequest());
  try {
    const res = await getAllNotes(token, { status: currentTab, q: currentQuery });
    const notes = res.data || [];
    dispatch(fetchNotesSuccess(notes));
    return notes;
  } catch (error) {
    const errorMessage = error.message || "Failed to load notes.";
    dispatch(fetchNotesFailure(errorMessage));
    throw error;
  }
};

/**
 * Thunk to fetch a single note by id and set it active
 */
export const fetchSingleNoteThunk = (id) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;

  try {
    const noteData = await getNoteById(token, id);
    if (noteData) {
      dispatch(setActiveNote(noteData));
      return noteData;
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch single note:", error);
    throw error;
  }
};

/**
 * Thunk to create a new note and refresh list
 */
export const createNoteThunk = (noteData) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;

  try {
    const newNote = await apiCreateNote(token, noteData);
    dispatch(addNoteSuccess(newNote));
    dispatch(fetchNotesThunk());
    return newNote;
  } catch (error) {
    console.error("Failed to create note:", error);
    throw error;
  }
};

/**
 * Thunk to update an existing note
 */
export const updateNoteThunk = (id, noteData) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;

  try {
    const updated = await apiUpdateNote(token, id, noteData);
    dispatch(updateNoteSuccess(updated));
    dispatch(clearActiveNote());
    dispatch(fetchNotesThunk());
    return updated;
  } catch (error) {
    console.error("Failed to update note:", error);
    throw error;
  }
};

/**
 * Thunk to archive an active note
 */
export const archiveNoteThunk = (note) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;

  try {
    const archived = await apiArchiveNote(token, note._id);
    dispatch(archiveNoteSuccess(note));
    if (state.notes.activeNote?._id === note._id) {
      dispatch(clearActiveNote());
    }
    dispatch(fetchNotesThunk());
    return archived;
  } catch (error) {
    console.error("Failed to archive note:", error);
    throw error;
  }
};

/**
 * Thunk to restore an archived/deleted note
 */
export const restoreNoteThunk = (note) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;

  try {
    const restored = await apiRestoreNote(token, note._id);
    dispatch(restoreNoteSuccess(note));
    if (state.notes.activeNote?._id === note._id) {
      dispatch(clearActiveNote());
    }
    dispatch(fetchNotesThunk());
    return restored;
  } catch (error) {
    console.error("Failed to restore note:", error);
    throw error;
  }
};

/**
 * Thunk to delete a note (soft delete / trash)
 */
export const deleteNoteThunk = (noteId) => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth.token;

  dispatch(setIsDeleting(true));
  try {
    await apiDeleteNote(token, noteId);
    dispatch(deleteNoteSuccess(noteId));
    if (state.notes.activeNote?._id === noteId) {
      dispatch(clearActiveNote());
    }
    dispatch(clearNoteToDelete());
    dispatch(fetchNotesThunk());
  } catch (error) {
    console.error("Failed to delete note:", error);
    throw error;
  } finally {
    dispatch(setIsDeleting(false));
  }
};
