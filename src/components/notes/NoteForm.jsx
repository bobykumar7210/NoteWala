import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNoteThunk } from "../../redux/actions/noteActions";
import { validateNote } from "../../validators";

function NoteForm({ refreshNotes }) {
  const dispatch = useDispatch();
  const [formOpen, setFormOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validateNote({ title, description });
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors.title || validationErrors.description || "Invalid note");
      return;
    }

    setError("");
    setIsCreating(true);
    try {
      await dispatch(
        createNoteThunk({ title: title.trim(), description: description.trim() })
      );
      setTitle("");
      setDescription("");
      setFormOpen(false);
      if (refreshNotes) refreshNotes();
    } catch (err) {
      setError(err.message || "Failed to create note");
    } finally {
      setIsCreating(false);
    }
  }

  function handleCancel() {
    setTitle("");
    setDescription("");
    setError("");
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
            {error && <p className="field-error" style={{ margin: "4px 8px" }}>{error}</p>}
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
