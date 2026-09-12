import { useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  selectAllNotes,
  selectIsLoadingNotes,
  selectActiveNote,
  selectSearchQuery,
  selectActiveTab,
  selectNoteToDelete,
  selectIsDeleting,
  selectAuthToken,
  selectCurrentUser,
  fetchNotesThunk,
  fetchSingleNoteThunk,
  updateNoteThunk,
  archiveNoteThunk,
  restoreNoteThunk,
  deleteNoteThunk,
  setActiveNote,
  clearActiveNote,
  setSearchQuery as setReduxSearchQuery,
  setActiveTab as setReduxActiveTab,
  setNoteToDelete as setReduxNoteToDelete,
  clearNoteToDelete,
  logoutUserThunk,
} from "../redux";
import { ROUTES, NOTE_STATUS, APP_TITLES } from "../utils/constants";

/**
 * Custom hook encapsulating all notes state via Redux Toolkit,
 * fetching, mutations, and URL route synchronization
 */
export function useNotes() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeNoteId } = useParams();

  // Redux Selectors
  const token = useSelector(selectAuthToken);
  const user = useSelector(selectCurrentUser);
  const notes = useSelector(selectAllNotes);
  const isLoadingNotes = useSelector(selectIsLoadingNotes);
  const activeNote = useSelector(selectActiveNote);
  const searchQuery = useSelector(selectSearchQuery);
  const activeTab = useSelector(selectActiveTab);
  const noteToDelete = useSelector(selectNoteToDelete);
  const isDeleting = useSelector(selectIsDeleting);

  // Derive base section path using ROUTES constants
  const basePath = location.pathname.startsWith(ROUTES.ARCHIVE)
    ? ROUTES.ARCHIVE
    : location.pathname.startsWith(ROUTES.TRASH)
      ? ROUTES.TRASH
      : ROUTES.HOME;

  // Derive current status tab from URL path
  const urlTab =
    basePath === ROUTES.ARCHIVE
      ? NOTE_STATUS.ARCHIVED
      : basePath === ROUTES.TRASH
        ? NOTE_STATUS.DELETED
        : NOTE_STATUS.ACTIVE;

  // Keep Redux activeTab in sync with URL
  useEffect(() => {
    if (activeTab !== urlTab) {
      dispatch(setReduxActiveTab(urlTab));
    }
  }, [urlTab, activeTab, dispatch]);

  // Reset search input when navigating to a different main section
  useEffect(() => {
    dispatch(setReduxSearchQuery(""));
  }, [basePath, dispatch]);

  // Fetch notes dispatch helper
  const fetchNotes = useCallback(
    (query = searchQuery, tab = urlTab) => {
      return dispatch(fetchNotesThunk({ query, tab }));
    },
    [dispatch, searchQuery, urlTab]
  );

  // Set document title and trigger debounced fetch on searchQuery / urlTab change
  useEffect(() => {
    document.title =
      urlTab === NOTE_STATUS.ARCHIVED
        ? APP_TITLES.ARCHIVE
        : urlTab === NOTE_STATUS.DELETED
          ? APP_TITLES.TRASH
          : APP_TITLES.HOME;

    const timer = setTimeout(() => {
      fetchNotes(searchQuery, urlTab);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, urlTab, fetchNotes]);

  // Sync activeNote with URL routeNoteId (supports direct URL access, refresh, back/forward)
  useEffect(() => {
    if (!routeNoteId) {
      if (activeNote) dispatch(clearActiveNote());
      return;
    }

    if (activeNote?._id === routeNoteId) {
      return;
    }

    const found = notes.find((n) => n._id === routeNoteId);
    if (found) {
      dispatch(setActiveNote(found));
      return;
    }

    if (token) {
      let isMounted = true;
      dispatch(fetchSingleNoteThunk(routeNoteId))
        .then((noteData) => {
          if (!isMounted) return;
          if (!noteData) {
            navigate(basePath, { replace: true });
          }
        })
        .catch(() => {
          if (isMounted) navigate(basePath, { replace: true });
        });

      return () => {
        isMounted = false;
      };
    }
  }, [routeNoteId, notes, token, basePath, navigate, activeNote, dispatch]);

  // Open note modal and update browser URL
  function handleOpenModal(note) {
    dispatch(setActiveNote(note));
    const targetUrl =
      basePath === ROUTES.HOME
        ? ROUTES.NOTE(note._id)
        : `${basePath}/note/${note._id}`;
    navigate(targetUrl);
  }

  // Close note modal and return browser URL back to section base
  function handleCloseModal() {
    dispatch(clearActiveNote());
    if (routeNoteId) {
      navigate(basePath);
    }
  }

  // Update note mutation
  async function handleUpdate(id, { title, description }) {
    try {
      await dispatch(updateNoteThunk(id, { title, description }));
      handleCloseModal();
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  }

  // Archive note mutation
  async function handleArchive(note) {
    try {
      await dispatch(archiveNoteThunk(note));
      if (activeNote?._id === note._id) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  }

  // Restore note mutation
  async function handleRestore(note) {
    try {
      await dispatch(restoreNoteThunk(note));
      if (activeNote?._id === note._id) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to restore note:", err);
    }
  }

  // Request note deletion (opens confirmation modal)
  function requestDelete(noteOrId) {
    if (typeof noteOrId === "object" && noteOrId !== null) {
      dispatch(setReduxNoteToDelete(noteOrId));
    } else {
      const found = notes.find((n) => n._id === noteOrId);
      dispatch(setReduxNoteToDelete(found || { _id: noteOrId, title: "" }));
    }
  }

  // Confirm delete mutation
  async function confirmDelete() {
    if (!noteToDelete?._id) return;
    try {
      await dispatch(deleteNoteThunk(noteToDelete._id));
      if (activeNote?._id === noteToDelete._id) {
        handleCloseModal();
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    }
  }

  // Logout and navigate to login
  function handleLogout() {
    dispatch(logoutUserThunk());
    navigate(ROUTES.LOGIN);
  }

  return {
    notes,
    isLoadingNotes,
    activeNote,
    activeTab: urlTab,
    searchQuery,
    setSearchQuery: (q) => dispatch(setReduxSearchQuery(q)),
    noteToDelete,
    setNoteToDelete: (note) =>
      note ? dispatch(setReduxNoteToDelete(note)) : dispatch(clearNoteToDelete()),
    isDeleting,
    requestDelete,
    confirmDelete,
    handleOpenModal,
    handleCloseModal,
    handleUpdate,
    handleArchive,
    handleRestore,
    fetchNotes,
    user,
    token,
    handleLogout,
  };
}
