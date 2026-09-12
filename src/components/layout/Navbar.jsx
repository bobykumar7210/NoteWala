import { MenuIcon, LogoIcon, SearchIcon, CloseIcon, UserIcon, LogoutIcon } from "../common/Icons";

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
          <MenuIcon size={20} color="#ffffff" />
        </button>
        <div className="nav-logo-icon">
          <LogoIcon size={20} color="#ffffff" />
        </div>
        <span className="nav-logo-text">Notewala</span>
      </div>

      {/* ── Center: Search Bar ── */}
      <div className="navbar-center">
        <div className="search-bar">
          <span className="search-icon">
            <SearchIcon size={18} color="#ffffff" />
          </span>
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
              <CloseIcon size={16} color="#ffffff" />
            </button>
          )}
        </div>
      </div>

      {/* ── Right: User Info & Logout ── */}
      <div className="navbar-right">
        <span className="nav-user">
          <UserIcon size={18} color="#ffffff" />
          <span>{user?.username}</span>
        </span>
        <button id="logout-btn" className="logout-btn" onClick={onLogout}>
          <LogoutIcon size={16} color="#ffffff" />
          <span>Sign out</span>
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
