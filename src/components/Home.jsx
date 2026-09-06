import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constant";
import Navbar from "./layout/Navbar";
import { NoteForm, NoteList, NoteModal, ConfirmDeleteModal } from "./notes";
import "./Home.css";

function Home() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [isLoadingNotes, setIsLoadingNotes] = useState(true);
  const [activeNote, setActiveNote] = useState(null);

  // Delete confirmation state
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch notes from backend
  const fetchNotes = useCallback(async () => {
    setIsLoadingNotes(true);
    try {
      const res = await fetch(`${BASE_URL}/notes`, {
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
  }, [token]);

  useEffect(() => {
    document.title = "Notewala";
    fetchNotes();
  }, [fetchNotes]);

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
        fetchNotes();
      }
    } catch (err) {
      console.error("Failed to update note:", err);
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
        fetchNotes();
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
      {/* ── Navbar Component ── */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* ── Main Content ── */}
      <main className="home-main">
        {/* ── Create Note Form Component ── */}
        <NoteForm token={token} onNoteCreated={fetchNotes} />

        {/* ── Note List & Note Items Component ── */}
        <NoteList
          notes={notes}
          isLoadingNotes={isLoadingNotes}
          onOpenModal={setActiveNote}
          onDelete={requestDelete}
        />
      </main>

      {/* ── Note Dialog / Modal Popup Component ── */}
      <NoteModal
        note={activeNote}
        onClose={() => setActiveNote(null)}
        onUpdate={handleUpdate}
        onDelete={requestDelete}
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
