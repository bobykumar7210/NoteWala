import { useState } from "react";
import { useNotes } from "../hooks";
import { Navbar, Sidebar } from "../components/layout";
import { NoteForm, NoteList, NoteModal, ConfirmDeleteModal } from "../components/notes";
import { NOTE_STATUS } from "../utils/constants";
import "../styles/Home.css";

function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const {
    notes,
    isLoadingNotes,
    activeNote,
    activeTab,
    searchQuery,
    setSearchQuery,
    noteToDelete,
    setNoteToDelete,
    isDeleting,
    requestDelete,
    confirmDelete,
    handleOpenModal,
    handleCloseModal,
    handleUpdate,
    handleArchive,
    handleRestore,
    fetchNotes,
    user,
    token,
    handleLogout,
  } = useNotes();

  return (
    <div className="home-root">
      {/* ── Navbar Component ── */}
      <Navbar
        user={user}
        onLogout={handleLogout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
      />

      {/* ── App Layout Body: Sidebar + Main Content ── */}
      <div className="home-body">
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <main className={`home-main ${sidebarOpen ? "with-sidebar" : ""}`}>
          {/* If in active tab, show note creation card; otherwise show section header */}
          {activeTab === NOTE_STATUS.ACTIVE ? (
            <NoteForm
              token={token}
              refreshNotes={() => fetchNotes(searchQuery, activeTab)}
            />
          ) : (
            <div className="section-header">
              <h2 className="section-title">
                {activeTab === NOTE_STATUS.ARCHIVED ? "📥 Archive" : "🗑️ Trash"}
              </h2>
              {activeTab === NOTE_STATUS.DELETED && (
                <p className="trash-hint">
                  Notes in Trash can be restored or deleted permanently.
                </p>
              )}
            </div>
          )}

          {/* ── Note List Component ── */}
          <NoteList
            notes={notes}
            isLoadingNotes={isLoadingNotes}
            onOpenModal={handleOpenModal}
            onDelete={requestDelete}
            onArchive={handleArchive}
            onRestore={handleRestore}
            activeTab={activeTab}
            searchQuery={searchQuery}
          />
        </main>
      </div>

      {/* ── Note Dialog / Modal Popup Component ── */}
      <NoteModal
        note={activeNote}
        onClose={handleCloseModal}
        onUpdate={handleUpdate}
        onDelete={requestDelete}
        onArchive={handleArchive}
        onRestore={handleRestore}
        activeTab={activeTab}
      />

      {/* ── Confirm Delete Dialog ── */}
      <ConfirmDeleteModal
        isOpen={Boolean(noteToDelete)}
        note={noteToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setNoteToDelete(null)}
        isDeleting={isDeleting}
      />
    </div>
  );
}

export default Home;
