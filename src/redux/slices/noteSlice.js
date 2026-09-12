import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllNotes,
  getNoteById,
  createNote as apiCreateNote,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
  restoreNote as apiRestoreNote,
} from "../../services/noteService";
import { NOTE_STATUS } from "../../utils/constants";

const initialState = {
  notes: [],
  isLoadingNotes: true,
  activeNote: null,
  searchQuery: "",
  activeTab: NOTE_STATUS.ACTIVE,
  noteToDelete: null,
  isDeleting: false,
  error: null,
};

// ── RTK Async Thunks ───────────────────────────────────────────────

/**
 * Fetch notes filtered by status and search query
 */
export const fetchNotesAsync = createAsyncThunk(
  "notes/fetchNotes",
  async (options = {}, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;
    const currentTab = options.tab !== undefined ? options.tab : state.notes.activeTab;
    const currentQuery = options.query !== undefined ? options.query : state.notes.searchQuery;

    try {
      const res = await getAllNotes(token, { status: currentTab, q: currentQuery });
      return res.data || [];
    } catch (error) {
      const errorMessage = error.message || "Failed to load notes.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Fetch a single note by ID
 */
export const fetchSingleNoteAsync = createAsyncThunk(
  "notes/fetchSingleNote",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const noteData = await getNoteById(token, id);
      return noteData;
    } catch (error) {
      const errorMessage = error.message || "Failed to fetch note.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Create a new note
 */
export const createNoteAsync = createAsyncThunk(
  "notes/createNote",
  async (noteData, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const newNote = await apiCreateNote(token, noteData);
      dispatch(fetchNotesAsync());
      return newNote;
    } catch (error) {
      const errorMessage = error.message || "Failed to create note.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Update an existing note
 */
export const updateNoteAsync = createAsyncThunk(
  "notes/updateNote",
  async ({ id, noteData }, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const updated = await apiUpdateNote(token, id, noteData);
      dispatch(clearActiveNote());
      dispatch(fetchNotesAsync());
      return updated;
    } catch (error) {
      const errorMessage = error.message || "Failed to update note.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Archive a note
 */
export const archiveNoteAsync = createAsyncThunk(
  "notes/archiveNote",
  async (note, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const archived = await apiArchiveNote(token, note._id);
      if (state.notes.activeNote?._id === note._id) {
        dispatch(clearActiveNote());
      }
      dispatch(fetchNotesAsync());
      return { note, result: archived };
    } catch (error) {
      const errorMessage = error.message || "Failed to archive note.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Restore an archived or deleted note
 */
export const restoreNoteAsync = createAsyncThunk(
  "notes/restoreNote",
  async (note, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      const restored = await apiRestoreNote(token, note._id);
      if (state.notes.activeNote?._id === note._id) {
        dispatch(clearActiveNote());
      }
      dispatch(fetchNotesAsync());
      return { note, result: restored };
    } catch (error) {
      const errorMessage = error.message || "Failed to restore note.";
      return rejectWithValue(errorMessage);
    }
  }
);

/**
 * Delete a note
 */
export const deleteNoteAsync = createAsyncThunk(
  "notes/deleteNote",
  async (noteId, { getState, rejectWithValue, dispatch }) => {
    const state = getState();
    const token = state.auth.token;

    try {
      await apiDeleteNote(token, noteId);
      if (state.notes.activeNote?._id === noteId) {
        dispatch(clearActiveNote());
      }
      dispatch(clearNoteToDelete());
      dispatch(fetchNotesAsync());
      return noteId;
    } catch (error) {
      const errorMessage = error.message || "Failed to delete note.";
      return rejectWithValue(errorMessage);
    }
  }
);

// ── Note Slice ─────────────────────────────────────────────────────

const noteSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    setActiveNote: (state, action) => {
      state.activeNote = action.payload;
    },
    clearActiveNote: (state) => {
      state.activeNote = null;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setNoteToDelete: (state, action) => {
      state.noteToDelete = action.payload;
    },
    clearNoteToDelete: (state) => {
      state.noteToDelete = null;
    },
    setIsDeleting: (state, action) => {
      state.isDeleting = action.payload;
    },
    addNoteSuccess: (state, action) => {
      state.notes.unshift(action.payload);
    },
    updateNoteSuccess: (state, action) => {
      const index = state.notes.findIndex((n) => n._id === action.payload._id);
      if (index !== -1) {
        state.notes[index] = { ...state.notes[index], ...action.payload };
      }
    },
    deleteNoteSuccess: (state, action) => {
      state.notes = state.notes.filter((n) => n._id !== action.payload);
      if (state.activeNote?._id === action.payload) {
        state.activeNote = null;
      }
    },
    archiveNoteSuccess: (state, action) => {
      const noteId = action.payload._id || action.payload;
      state.notes = state.notes.filter((n) => n._id !== noteId);
      if (state.activeNote?._id === noteId) {
        state.activeNote = null;
      }
    },
    restoreNoteSuccess: (state, action) => {
      const noteId = action.payload._id || action.payload;
      state.notes = state.notes.filter((n) => n._id !== noteId);
      if (state.activeNote?._id === noteId) {
        state.activeNote = null;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Fetch Notes ──
      .addCase(fetchNotesAsync.pending, (state) => {
        state.isLoadingNotes = true;
        state.error = null;
      })
      .addCase(fetchNotesAsync.fulfilled, (state, action) => {
        state.isLoadingNotes = false;
        state.notes = action.payload;
        state.error = null;
      })
      .addCase(fetchNotesAsync.rejected, (state, action) => {
        state.isLoadingNotes = false;
        state.error = action.payload || action.error.message || "Failed to load notes";
      })
      // ── Single Note ──
      .addCase(fetchSingleNoteAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.activeNote = action.payload;
        }
      })
      // ── Create Note ──
      .addCase(createNoteAsync.fulfilled, (state, action) => {
        if (action.payload) {
          state.notes.unshift(action.payload);
        }
      })
      // ── Update Note ──
      .addCase(updateNoteAsync.fulfilled, (state, action) => {
        if (action.payload) {
          const index = state.notes.findIndex((n) => n._id === action.payload._id);
          if (index !== -1) {
            state.notes[index] = { ...state.notes[index], ...action.payload };
          }
        }
      })
      // ── Delete Note ──
      .addCase(deleteNoteAsync.pending, (state) => {
        state.isDeleting = true;
      })
      .addCase(deleteNoteAsync.fulfilled, (state, action) => {
        state.isDeleting = false;
        state.notes = state.notes.filter((n) => n._id !== action.payload);
      })
      .addCase(deleteNoteAsync.rejected, (state) => {
        state.isDeleting = false;
      });
  },
});

export const {
  setActiveNote,
  clearActiveNote,
  setSearchQuery,
  setActiveTab,
  setNoteToDelete,
  clearNoteToDelete,
  setIsDeleting,
  addNoteSuccess,
  updateNoteSuccess,
  deleteNoteSuccess,
  archiveNoteSuccess,
  restoreNoteSuccess,
} = noteSlice.actions;

// ── Selectors ──────────────────────────────────────────────────────
export const selectNotesState = (state) => state.notes;
export const selectAllNotes = (state) => state.notes.notes;
export const selectIsLoadingNotes = (state) => state.notes.isLoadingNotes;
export const selectActiveNote = (state) => state.notes.activeNote;
export const selectSearchQuery = (state) => state.notes.searchQuery;
export const selectActiveTab = (state) => state.notes.activeTab;
export const selectNoteToDelete = (state) => state.notes.noteToDelete;
export const selectIsDeleting = (state) => state.notes.isDeleting;
export const selectNotesError = (state) => state.notes.error;

// ── Compatibility Thunk Wrappers ───────────────────────────────────
export const fetchNotesThunk = (options) => (dispatch) =>
  dispatch(fetchNotesAsync(options)).unwrap();

export const fetchSingleNoteThunk = (id) => (dispatch) =>
  dispatch(fetchSingleNoteAsync(id)).unwrap();

export const createNoteThunk = (noteData) => (dispatch) =>
  dispatch(createNoteAsync(noteData)).unwrap();

export const updateNoteThunk = (idOrPayload, maybeNoteData) => (dispatch) => {
  const payload =
    typeof idOrPayload === "object" && !maybeNoteData
      ? idOrPayload
      : { id: idOrPayload, noteData: maybeNoteData };
  return dispatch(updateNoteAsync(payload)).unwrap();
};

export const archiveNoteThunk = (note) => (dispatch) =>
  dispatch(archiveNoteAsync(note)).unwrap();

export const restoreNoteThunk = (note) => (dispatch) =>
  dispatch(restoreNoteAsync(note)).unwrap();

export const deleteNoteThunk = (noteId) => (dispatch) =>
  dispatch(deleteNoteAsync(noteId)).unwrap();

export default noteSlice.reducer;
