import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import { Navbar, Sidebar } from "./layout";
import { NoteForm, NoteList, NoteModal, ConfirmDeleteModal } from "./notes";
import "./Home.css";

function Home() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [activeNote, setActiveNote] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Derive active tab from URL route (URL-driven navigation)
  const activeTab =
    location.pathname === "/archive"
      ? "archived"
      : location.pathname === "/trash"
        ? "deleted"
        : "active";

  // Reset search input when navigating to a different page route
  useEffect(() => {
    setSearchQuery("");
  }, [location.pathname]);

  // Delete confirmation state
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch notes from backend based on status and search query
  async function fetchNotes(query = searchQuery, tab = activeTab) {
    setIsLoadingNotes(true);
    try {
      const params = new URLSearchParams();
      if (tab) params.append("status", tab);
      if (query && query.trim()) params.append("q", query.trim());

      const res = await fetch(`${BASE_URL}/notes?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setNotes(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    } finally {
      setIsLoadingNotes(false);
    }
  }

  // Fetch on mount and when searchQuery or activeTab changes (with 300ms debounce)
  useEffect(() => {
    document.title =
      activeTab === "archived"
        ? "Archive — Notewala"
        : activeTab === "deleted"
          ? "Trash — Notewala"
          : "Notewala";

    const timer = setTimeout(() => {
      fetchNotes(searchQuery, activeTab);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, activeTab]);

  // Update note (called from NoteModal dialog)
  async function handleUpdate(id, { title, description }) {
    try {
      const res = await fetch(`${BASE_URL}/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });
      if (res.ok) {
        setActiveNote(null);
        fetchNotes(searchQuery, activeTab);
      }
    } catch (err) {
      console.error("Failed to update note:", err);
    }
  }

  // Archive an active note
  async function handleArchive(note) {
    try {
      const res = await fetch(`${BASE_URL}/notes/${note._id}/archive`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (activeNote?._id === note._id) {
          setActiveNote(null);
        }
        fetchNotes(searchQuery, activeTab);
      }
    } catch (err) {
      console.error("Failed to archive note:", err);
    }
  }

  // Restore an archived or deleted note back to active
  async function handleRestore(note) {
    try {
      const res = await fetch(`${BASE_URL}/notes/${note._id}/restore`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (activeNote?._id === note._id) {
          setActiveNote(null);
        }
        fetchNotes(searchQuery, activeTab);
      }
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
      const res = await fetch(`${BASE_URL}/notes/${noteToDelete._id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        if (activeNote?._id === noteToDelete._id) {
          setActiveNote(null);
        }
        setNoteToDelete(null);
        fetchNotes(searchQuery, activeTab);
      }
    } catch (err) {
      console.error("Failed to delete note:", err);
    } finally {
      setIsDeleting(false);
    }
  }

  // Logout handler
  function handleLogout() {
    logout();
    navigate("/login");
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
          {activeTab === "active" ? (
            <NoteForm
              token={token}
              refreshNotes={() => fetchNotes(searchQuery, activeTab)}
            />
          ) : (
            <div className="section-header">
              <h2 className="section-title">
                {activeTab === "archived" ? "📥 Archive" : "🗑️ Trash"}
              </h2>
              {activeTab === "deleted" && (
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
            onOpenModal={setActiveNote}
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
        onClose={() => setActiveNote(null)}
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
