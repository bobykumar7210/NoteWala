function Navbar({ user, onLogout }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="nav-logo-icon">📝</div>
        <span className="nav-logo-text">Notewala</span>
      </div>
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
