import { useState, useEffect } from "react";

function NoteModal({ note, onClose, onUpdate, onDelete }) {
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [isUpdating, setIsUpdating] = useState(false);

  // Sync state when note prop changes
  useEffect(() => {
    if (note) {
      setTitle(note.title || "");
      setDescription(note.description || "");
    }
  }, [note]);

  // Close modal when pressing Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  if (!note) return null;

  async function handleSave() {
    if (!title.trim()) return;
    setIsUpdating(true);
    try {
      await onUpdate(note._id, { title, description });
    } finally {
      setIsUpdating(false);
    }
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="note-modal" onClick={(e) => e.stopPropagation()}>
        {/* ── Header ── */}
        <div className="modal-header">
          <input
            id="modal-note-title"
            className="modal-title-input"
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <button
            className="modal-close-icon"
            title="Close"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* ── Body ── */}
        <textarea
          id="modal-note-desc"
          className="modal-desc-input"
          placeholder="Note..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={6}
        />

        {/* ── Footer ── */}
        <div className="modal-footer">
          <div className="modal-footer-left">
            <span className="modal-date">Created {formattedDate}</span>
            <button
              className="icon-btn delete-btn modal-delete-btn"
              title="Delete note"
              onClick={() => onDelete(note)}
            >
              🗑️
            </button>
          </div>

          <div className="modal-footer-right">
            <button
              type="button"
              className="btn-ghost"
              onClick={onClose}
            >
              Close
            </button>
            <button
              id="modal-save-btn"
              type="button"
              className="btn-teal"
              disabled={isUpdating || !title.trim()}
              onClick={handleSave}
            >
              {isUpdating ? "Saving…" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
