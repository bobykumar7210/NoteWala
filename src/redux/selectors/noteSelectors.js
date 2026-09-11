/**
 * Selectors for Notes & UI state
 */
export const selectNotesState = (state) => state.notes;
export const selectAllNotes = (state) => state.notes.notes;
export const selectIsLoadingNotes = (state) => state.notes.isLoadingNotes;
export const selectActiveNote = (state) => state.notes.activeNote;
export const selectSearchQuery = (state) => state.notes.searchQuery;
export const selectActiveTab = (state) => state.notes.activeTab;
export const selectNoteToDelete = (state) => state.notes.noteToDelete;
export const selectIsDeleting = (state) => state.notes.isDeleting;
export const selectNotesError = (state) => state.notes.error;
