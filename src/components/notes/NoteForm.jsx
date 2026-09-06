import { useState } from "react";
import { BASE_URL } from "../../utils/constant";

function NoteForm({ token, onNoteCreated }) {
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!title.trim()) return;

    setIsCreating(true);
    try {
      const res = await fetch(`${BASE_URL}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description }),
      });

      if (res.ok) {
        setTitle("");
        setDescription("");
        setFormOpen(false);
        if (onNoteCreated) onNoteCreated();
      }
    } catch (err) {
      console.error("Failed to create note:", err);
    } finally {
      setIsCreating(false);
    }
  }

  function handleCancel() {
    setTitle("");
    setDescription("");
    setFormOpen(false);
  }

  return (
    <div className="create-card-wrapper">
      <div
        className={`create-card ${formOpen ? "open" : ""}`}
        onClick={() => !formOpen && setFormOpen(true)}
      >
        {!formOpen ? (
          <span className="create-placeholder">Take a note…</span>
        ) : (
          <form onSubmit={handleSubmit} onClick={(e) => e.stopPropagation()}>
            <input
              id="new-note-title"
              className="create-title-input"
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <textarea
              id="new-note-desc"
              className="create-desc-input"
              placeholder="Take a note…"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
            <div className="create-actions">
              <button
                type="button"
                className="btn-ghost"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button
                id="create-note-btn"
                type="submit"
                className="btn-teal"
                disabled={isCreating || !title.trim()}
              >
                {isCreating ? "Saving…" : "Add note"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default NoteForm;
