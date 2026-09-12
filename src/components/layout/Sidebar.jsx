import { NavLink, useLocation } from "react-router-dom";
import { ROUTES } from "../../utils/constants";
import { NotesIcon, ArchiveIcon, TrashIcon } from "../common/Icons";

function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const menuItems = [
    { to: ROUTES.HOME, label: "Notes", icon: <NotesIcon size={20} color="#ffffff" />, isNoteRoot: true },
    { to: ROUTES.ARCHIVE, label: "Archive", icon: <ArchiveIcon size={20} color="#ffffff" /> },
    { to: ROUTES.TRASH, label: "Trash", icon: <TrashIcon size={20} color="#ffffff" /> },
  ];

  function isItemActive(item) {
    if (item.isNoteRoot) {
      return (
        location.pathname === ROUTES.HOME || location.pathname.startsWith("/note/")
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
