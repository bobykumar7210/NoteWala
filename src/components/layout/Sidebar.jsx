import { NavLink } from "react-router-dom";

function Sidebar({ isOpen, onClose }) {
  const menuItems = [
    { to: "/", label: "Notes", icon: "📝", end: true },
    { to: "/archive", label: "Archive", icon: "📥" },
    { to: "/trash", label: "Trash", icon: "🗑️" },
  ];

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
              end={item.end}
              className={({ isActive }) =>
                `sidebar-item ${isActive ? "active" : ""}`
              }
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
