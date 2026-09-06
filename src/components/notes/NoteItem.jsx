function NoteItem({ note, onOpenModal, onDelete }) {
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
            className="icon-btn delete-btn"
            title="Delete"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(note);
            }}
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}

export default NoteItem;
