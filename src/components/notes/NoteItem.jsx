import { NOTE_STATUS } from "../../utils/constants";

function NoteItem({
  note,
  onOpenModal,
  onDelete,
  onArchive,
  onRestore,
  activeTab = NOTE_STATUS.ACTIVE,
}) {
  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="note-card" onClick={() => onOpenModal(note)}>
      <div className="note-body">
        <h3 className="note-title">{note.title}</h3>
        {note.description && <p className="note-desc">{note.description}</p>}
      </div>

      <div className="note-footer" onClick={(e) => e.stopPropagation()}>
        <span className="note-date">{formattedDate}</span>
        <div className="note-btns">
          {activeTab === NOTE_STATUS.DELETED ? (
            /* ── Trash Actions: Restore & Delete ── */
            <>
              <button
                className="icon-btn restore-btn"
                title="Restore note"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(note);
                }}
              >
                🔄
              </button>
              <button
                className="icon-btn delete-btn"
                title="Delete permanently"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note);
                }}
              >
                🗑️
              </button>
            </>
          ) : activeTab === NOTE_STATUS.ARCHIVED ? (
            /* ── Archive Actions: Edit, Unarchive & Delete ── */
            <>
              <button
                className="icon-btn edit-btn"
                title="View & Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(note);
                }}
              >
                ✏️
              </button>
              <button
                className="icon-btn unarchive-btn"
                title="Unarchive note"
                onClick={(e) => {
                  e.stopPropagation();
                  onRestore(note);
                }}
              >
                📤
              </button>
              <button
                className="icon-btn delete-btn"
                title="Delete note"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note);
                }}
              >
                🗑️
              </button>
            </>
          ) : (
            /* ── Active Notes Actions: Edit, Archive & Delete ── */
            <>
              <button
                className="icon-btn edit-btn"
                title="View & Edit"
                onClick={(e) => {
                  e.stopPropagation();
                  onOpenModal(note);
                }}
              >
                ✏️
              </button>
              <button
                className="icon-btn archive-btn"
                title="Archive note"
                onClick={(e) => {
                  e.stopPropagation();
                  onArchive(note);
                }}
              >
                📥
              </button>
              <button
                className="icon-btn delete-btn"
                title="Delete note"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(note);
                }}
              >
                🗑️
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
