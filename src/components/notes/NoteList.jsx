import NoteItem from "./NoteItem";

function NoteList({ notes, isLoadingNotes, onOpenModal, onDelete }) {
  if (isLoadingNotes) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Loading your notes…</p>
      </div>
    );
  }

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📋</div>
        <p>No notes yet — create your first one above!</p>
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
        />
      ))}
    </div>
  );
}

export default NoteList;
