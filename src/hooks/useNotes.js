import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllNotes,
  getNoteById,
  updateNote as apiUpdateNote,
  deleteNote as apiDeleteNote,
  archiveNote as apiArchiveNote,
  restoreNote as apiRestoreNote,
} from "../services/noteService";
import { ROUTES, NOTE_STATUS, APP_TITLES } from "../utils/constants";

/**
 * Custom hook encapsulating all notes state, fetching, mutations, and URL route synchronization
 */
export function useNotes() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeNoteId } = useParams();

  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Derive base section path using ROUTES constants
  const basePath = location.pathname.startsWith(ROUTES.ARCHIVE)
    ? ROUTES.ARCHIVE
    : location.pathname.startsWith(ROUTES.TRASH)
      ? ROUTES.TRASH
      : ROUTES.HOME;

  // Derive active tab using NOTE_STATUS constants
  const activeTab =
    basePath === ROUTES.ARCHIVE
      ? NOTE_STATUS.ARCHIVED
      : basePath === ROUTES.TRASH
        ? NOTE_STATUS.DELETED
        : NOTE_STATUS.ACTIVE;

  // Reset search input when navigating to a different main section
  useEffect(() => {
    setSearchQuery("");
  }, [basePath]);

  // Fetch notes from backend based on status and search query
  async function fetchNotes(query = searchQuery, tab = activeTab) {
    setIsLoadingNotes(true);
    try {
      const res = await getAllNotes(token, { status: tab, q: query });
      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setIsLoadingNotes(false);
    }
  }

  // Set document title and trigger debounced fetch on searchQuery / activeTab change
  useEffect(() => {
    document.title =
      activeTab === NOTE_STATUS.ARCHIVED
        ? APP_TITLES.ARCHIVE
        : activeTab === NOTE_STATUS.DELETED
          ? APP_TITLES.TRASH
          : APP_TITLES.HOME;

    const timer = setTimeout(() => {
      fetchNotes(searchQuery, activeTab);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Sync activeNote with URL routeNoteId (supports direct URL access, refresh, back/forward)
  useEffect(() => {
    if (!routeNoteId) {
      if (activeNote) setActiveNote(null);
      return;
    }

    if (activeNote?._id === routeNoteId) {
      return;
    }

    const found = notes.find((n) => n._id === routeNoteId);
    if (found) {
      setActiveNote(found);
      return;
    }

    if (token) {
      let isMounted = true;
      async function fetchSingleNote() {
        try {
          const noteData = await getNoteById(token, routeNoteId);
          if (!isMounted) return;
          if (noteData) {
            setActiveNote(noteData);
          } else {
            navigate(basePath, { replace: true });
          }
        } catch {
          if (isMounted) navigate(basePath, { replace: true });
        }
      }
      fetchSingleNote();
      return () => {
        isMounted = false;
      };
    }
  }, [routeNoteId, notes, token, basePath, navigate, activeNote]);

  // Open note modal and update browser URL
  function handleOpenModal(note) {
    setActiveNote(note);
    const targetUrl =
      basePath === ROUTES.HOME
        ? ROUTES.NOTE(note._id)
        : `${basePath}/note/${note._id}`;
    navigate(targetUrl);
  }

  // Close note modal and return browser URL back to section base
  function handleCloseModal() {
    setActiveNote(null);
    if (routeNoteId) {
      navigate(basePath);
    }
  }

  // Update note mutation
  async function handleUpdate(id, { title, description }) {
    try {
      await apiUpdateNote(token, id, { title, description });
      handleCloseModal();
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  }

  // Archive note mutation
  async function handleArchive(note) {
    try {
      await apiArchiveNote(token, note._id);
      if (activeNote?._id === note._id) {
        handleCloseModal();
      }
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  }

  // Restore note mutation
  async function handleRestore(note) {
    try {
      await apiRestoreNote(token, note._id);
      if (activeNote?._id === note._id) {
        handleCloseModal();
      }
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to restore note:", err);
    }
  }

  // Request note deletion (opens confirmation modal)
  function requestDelete(noteOrId) {
    if (typeof noteOrId === "object" && noteOrId !== null) {
      setNoteToDelete(noteOrId);
    } else {
      const found = notes.find((n) => n._id === noteOrId);
      setNoteToDelete(found || { _id: noteOrId, title: "" });
    }
  }

  // Confirm delete mutation
  async function confirmDelete() {
    if (!noteToDelete?._id) return;
    setIsDeleting(true);
    try {
      await apiDeleteNote(token, noteToDelete._id);
      if (activeNote?._id === noteToDelete._id) {
        handleCloseModal();
      }
      setNoteToDelete(null);
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to delete note:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  // Logout and navigate to login
  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN);
  }

  return {
    notes,
    isLoadingNotes,
    activeNote,
    activeTab,
    searchQuery,
    setSearchQuery,
    noteToDelete,
    setNoteToDelete,
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
