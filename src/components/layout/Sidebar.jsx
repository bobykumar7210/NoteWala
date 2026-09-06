function Sidebar({ activeTab, onSelectTab, isOpen, onClose }) {
  const menuItems = [
    { id: "active", label: "Notes", icon: "📝" },
    { id: "archived", label: "Archive", icon: "📥" },
    { id: "deleted", label: "Trash", icon: "🗑️" },
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
          {menuItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`sidebar-tab-${item.id}`}
                type="button"
                className={`sidebar-item ${isActive ? "active" : ""}`}
                onClick={() => {
                  onSelectTab(item.id);
                  if (window.innerWidth <= 768 && onClose) {
                    onClose();
                  }
                }}
              >
                <span className="sidebar-item-icon">{item.icon}</span>
                <span className="sidebar-item-label">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
    </>
  );
}

export default Sidebar;
