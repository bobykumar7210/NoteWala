import { useState, useEffect } from "react";

function NoteModal({
  note,
  onClose,
  onUpdate,
  onDelete,
  onArchive,
  onRestore,
  activeTab = "active",
}) {
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

  const isTrash = activeTab === "deleted";

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
            disabled={isTrash}
            autoFocus={!isTrash}
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
          placeholder={isTrash ? "Note in trash" : "Note..."}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isTrash}
          rows={6}
        />

        {/* ── Footer ── */}
        <div className="modal-footer">
          <div className="modal-footer-left">
            <span className="modal-date">Created {formattedDate}</span>

            {/* Archive / Unarchive / Restore button */}
            {isTrash ? (
              <button
                className="icon-btn restore-btn modal-action-btn"
                title="Restore note"
                onClick={() => {
                  onRestore(note);
                  onClose();
                }}
              >
                🔄
              </button>
            ) : activeTab === "archived" ? (
              <button
                className="icon-btn unarchive-btn modal-action-btn"
                title="Unarchive note"
                onClick={() => {
                  onRestore(note);
                  onClose();
                }}
              >
                📤
              </button>
            ) : (
              <button
                className="icon-btn archive-btn modal-action-btn"
                title="Archive note"
                onClick={() => {
                  onArchive(note);
                  onClose();
                }}
              >
                📥
              </button>
            )}

            {/* Delete button */}
            <button
              className="icon-btn delete-btn modal-delete-btn"
              title={isTrash ? "Delete permanently" : "Delete note"}
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
            {!isTrash && (
              <button
                id="modal-save-btn"
                type="button"
                className="btn-teal"
                disabled={isUpdating || !title.trim()}
                onClick={handleSave}
              >
                {isUpdating ? "Saving…" : "Save"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NoteModal;
