import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote,
  archiveNote,
  restoreNote,
} from "../services/noteService";
import { ROUTES, NOTE_STATUS } from "../utils/constants";
import { Navbar, Sidebar } from "../components/layout";
import { NoteForm, NoteList, NoteModal, ConfirmDeleteModal } from "../components/notes";
import "../styles/Home.css";

function Home() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { id: routeNoteId } = useParams();

  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  // Open note modal and update browser URL to include note ID
  function handleOpenModal(note) {
    setActiveNote(note);
    const targetUrl =
      basePath === ROUTES.HOME
        ? ROUTES.NOTE(note._id)
        : `${basePath}/note/${note._id}`;
    navigate(targetUrl);
  }

  // Close note modal and return browser URL back to base route
  function handleCloseModal() {
    setActiveNote(null);
    if (routeNoteId) {
      navigate(basePath);
    }
  }

  // Delete confirmation state
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Fetch on mount and when searchQuery or activeTab changes (with 300ms debounce)
  useEffect(() => {
    document.title =
      activeTab === NOTE_STATUS.ARCHIVED
        ? "Archive — Notewala"
        : activeTab === NOTE_STATUS.DELETED
          ? "Trash — Notewala"
          : "Notewala";

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

    // Already set to this note
    if (activeNote?._id === routeNoteId) {
      return;
    }

    // Find in already loaded notes list
    const found = notes.find((n) => n._id === routeNoteId);
    if (found) {
      setActiveNote(found);
      return;
    }

    // If not found in list (e.g. page refreshed or direct link), fetch single note by ID
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

  // Update note (called from NoteModal dialog)
  async function handleUpdate(id, { title, description }) {
    try {
      await updateNote(token, id, { title, description });
      handleCloseModal();
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  }

  // Archive an active note
  async function handleArchive(note) {
    try {
      await archiveNote(token, note._id);
      if (activeNote?._id === note._id) {
        handleCloseModal();
      }
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  }

  // Restore an archived or deleted note back to active
  async function handleRestore(note) {
    try {
      await restoreNote(token, note._id);
      if (activeNote?._id === note._id) {
        handleCloseModal();
      }
      fetchNotes(searchQuery, activeTab);
    } catch (err) {
      console.error("Failed to restore note:", err);
    }
  }

  // Open delete confirmation dialog
  function requestDelete(noteOrId) {
    if (typeof noteOrId === "object" && noteOrId !== null) {
      setNoteToDelete(noteOrId);
    } else {
      const found = notes.find((n) => n._id === noteOrId);
      setNoteToDelete(found || { _id: noteOrId, title: "" });
    }
  }

  // Confirm delete execution
  async function confirmDelete() {
    if (!noteToDelete?._id) return;
    setIsDeleting(true);
    try {
      await deleteNote(token, noteToDelete._id);
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

  // Logout handler
  function handleLogout() {
    logout();
    navigate(ROUTES.LOGIN);
  }

  return (
    <div className="home-root">
      {/* ── Navbar Component (with Google Keep Search & Menu Button) ── */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* ── App Layout Body: Sidebar + Main Content ── */}
      <div className="home-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={`home-main ${sidebarOpen ? "with-sidebar" : ""}`}>
          {/* If in active tab, show note creation card; otherwise show section header */}
          {activeTab === NOTE_STATUS.ACTIVE ? (
            <NoteForm
              token={token}
              refreshNotes={() => fetchNotes(searchQuery, activeTab)}
            />
          ) : (
            <div className="section-header">
              <h2 className="section-title">
                {activeTab === NOTE_STATUS.ARCHIVED ? "📥 Archive" : "🗑️ Trash"}
              </h2>
              {activeTab === NOTE_STATUS.DELETED && (
                <p className="trash-hint">
                  Notes in Trash can be restored or deleted permanently.
                </p>
              )}
            </div>
          )}

          {/* ── Note List & Note Items Component ── */}
          <NoteList
            notes={notes}
            isLoadingNotes={isLoadingNotes}
            onOpenModal={handleOpenModal}
            onDelete={requestDelete}
            onArchive={handleArchive}
            onRestore={handleRestore}
            activeTab={activeTab}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {/* ── Note Dialog / Modal Popup Component ── */}
      <NoteModal
        note={activeNote}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        onDelete={requestDelete}
        onArchive={handleArchive}
        onRestore={handleRestore}
        activeTab={activeTab}
      />

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDeleteModal
        isOpen={Boolean(noteToDelete)}
        note={noteToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setNoteToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Home;

