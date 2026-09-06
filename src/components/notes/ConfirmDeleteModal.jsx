import { useEffect } from "react";

function ConfirmDeleteModal({ note, isOpen, onConfirm, onCancel, isDeleting }) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === "Escape" && isOpen) {
        onCancel();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="confirm-backdrop" onClick={onCancel}>
      <div
        className="confirm-card"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="confirm-icon-wrapper">
          <span className="confirm-icon">🗑️</span>
        </div>

        <h3 className="confirm-title">Delete Note?</h3>

        <p className="confirm-message">
          Are you sure you want to delete{" "}
          {note?.title ? (
            <span className="confirm-note-title">"{note.title}"</span>
          ) : (
            "this note"
          )}
          ? This action cannot be undone.
        </p>

        <div className="confirm-actions">
          <button
            id="cancel-delete-btn"
            type="button"
            className="btn-ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>
          <button
            id="confirm-delete-btn"
            type="button"
            className="btn-danger"
            onClick={onConfirm}
            disabled={isDeleting}
            autoFocus
          >
            {isDeleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
