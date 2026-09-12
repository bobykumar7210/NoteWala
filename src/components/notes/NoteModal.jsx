import { useState, useEffect } from "react";
import { NOTE_STATUS } from "../../utils/constants";
import { validateNote } from "../../validators";
import { CloseIcon, RestoreIcon, UnarchiveIcon, ArchiveIcon, TrashIcon } from "../common/Icons";

function NoteModal({
  note,
  onClose,
  onUpdate,
  onDelete,
  onArchive,
  onRestore,
  activeTab = NOTE_STATUS.ACTIVE,
}) {
  const [prevNoteId, setPrevNoteId] = useState(note?._id);
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState("");

  // Update state during render when note prop changes
  if (note && note._id !== prevNoteId) {
    setPrevNoteId(note._id);
    setTitle(note.title || "");
    setDescription(note.description || "");
    setError("");
  }

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
    const validationErrors = validateNote({ title, description });
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors.title || validationErrors.description || "Invalid note");
      return;
    }

    setError("");
    setIsUpdating(true);
    try {
      await onUpdate(note._id, { title: title.trim(), description: description.trim() });
    } catch (err) {
      setError(err.message || "Failed to update note");
    } finally {
      setIsUpdating(false);
    }
  }

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isTrash = activeTab === NOTE_STATUS.DELETED;

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
            <CloseIcon size={18} color="#ffffff" />
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

        {error && <div className="field-error" style={{ margin: "4px 16px" }}>{error}</div>}

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
                <RestoreIcon size={16} color="#ffffff" />
              </button>
            ) : activeTab === NOTE_STATUS.ARCHIVED ? (
              <button
                className="icon-btn unarchive-btn modal-action-btn"
                title="Unarchive note"
                onClick={() => {
                  onRestore(note);
                  onClose();
                }}
              >
                <UnarchiveIcon size={16} color="#ffffff" />
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
                <ArchiveIcon size={16} color="#ffffff" />
              </button>
            )}

            {/* Delete button */}
            <button
              className="icon-btn delete-btn modal-delete-btn"
              title={isTrash ? "Delete permanently" : "Delete note"}
              onClick={() => onDelete(note)}
            >
              <TrashIcon size={16} color="#ffffff" />
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
                className="btn-blue"
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
