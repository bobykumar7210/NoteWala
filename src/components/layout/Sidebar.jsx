import { NavLink, useLocation } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { to: "/", label: "Notes", icon: "📝", isNoteRoot: true },
    { to: "/archive", label: "Archive", icon: "📥" },
    { to: "/trash", label: "Trash", icon: "🗑️" },
  ];

  function isItemActive(item) {
    if (item.isNoteRoot) {
      return (
        location.pathname === "/" || location.pathname.startsWith("/note/")
      );
    }
    return location.pathname.startsWith(item.to);
  }

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="sidebar-overlay"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={`sidebar-item ${isItemActive(item) ? "active" : ""}`}
              onClick={() => {
                if (window.innerWidth <= 768 && onClose) {
                  onClose();
                }
              }}
            >
              <span className="sidebar-item-icon">{item.icon}</span>
              <span className="sidebar-item-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
