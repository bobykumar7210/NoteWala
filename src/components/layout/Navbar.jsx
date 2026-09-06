function Navbar({ user, onLogout, searchQuery, onSearchChange, onToggleSidebar }) {
  return (
    <nav className="navbar">
      {/* ── Left: Hamburger Menu & Logo ── */}
      <div className="navbar-left">
        <button
          id="menu-toggle-btn"
          type="button"
          className="menu-btn"
          onClick={onToggleSidebar}
          title="Main menu"
          aria-label="Toggle menu"
        >
          ☰
        </button>
        <div className="nav-logo-icon">📝</div>
        <span className="nav-logo-text">Notewala</span>
      </div>

      {/* ── Center: Search Bar (Google Keep style) ── */}
      <div className="navbar-center">
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input
            id="search-notes-input"
            type="text"
            className="search-input"
            placeholder="Search notes…"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchQuery && (
            <button
              id="clear-search-btn"
              type="button"
              className="search-clear-btn"
              onClick={() => onSearchChange("")}
              title="Clear search"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ── Right: User Info & Logout ── */}
      <div className="navbar-right">
        <span className="nav-user">👤 {user?.username}</span>
        <button id="logout-btn" className="logout-btn" onClick={onLogout}>
          Sign out
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
