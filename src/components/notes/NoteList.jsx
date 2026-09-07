import NoteItem from "./NoteItem";
import { NOTE_STATUS } from "../../utils/constants";

function NoteList({
  notes,
  isLoadingNotes,
  onOpenModal,
  onDelete,
  onArchive,
  onRestore,
  activeTab = NOTE_STATUS.ACTIVE,
  searchQuery,
}) {
  if (isLoadingNotes) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>
          {activeTab === NOTE_STATUS.ARCHIVED
            ? "Loading archived notes…"
            : activeTab === NOTE_STATUS.DELETED
            ? "Loading trash…"
            : "Loading your notes…"}
        </p>
      </div>
    );
  }

  if (notes.length === 0) {
    const tabName =
      activeTab === NOTE_STATUS.ARCHIVED
        ? "archive"
        : activeTab === NOTE_STATUS.DELETED
        ? "trash"
        : "notes";

    let emptyIcon = "📋";
    let emptyMessage = "No notes yet — create your first one above!";

    if (searchQuery) {
      emptyIcon = "🔍";
      emptyMessage = `No notes matching "${searchQuery}" in ${tabName}`;
    } else if (activeTab === NOTE_STATUS.ARCHIVED) {
      emptyIcon = "📥";
      emptyMessage = "Your archived notes appear here";
    } else if (activeTab === NOTE_STATUS.DELETED) {
      emptyIcon = "🗑️";
      emptyMessage = "No notes in Trash";
    }

    return (
      <div className="empty-state">
        <div className="empty-icon">{emptyIcon}</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <NoteItem
          key={note._id}
          note={note}
          onOpenModal={onOpenModal}
          onDelete={onDelete}
          onArchive={onArchive}
          onRestore={onRestore}
          activeTab={activeTab}
        />
      ))}
    </div>
  );
}

export default NoteList;
