import React from "react";
import { canAccessPage, getRoleName } from "../auth/rbac";
import { getCurrentUser } from "../services/auth/authService";

const navItems = [
  { label: "Dashboard", icon: "#", page: "dashboard" },
  { label: "Suppliers", icon: "O", page: "suppliers" },
  { label: "Products", icon: "[]", page: "products" },
  { label: "Inventory", icon: "[]", page: "inventory" },
  { label: "Sales Management", icon: "U", page: "orders" },
  { label: "Procurement", icon: "U", page: "procurement" },
  { label: "Reports", icon: "|", page: "reports" },
  { label: "User Management", icon: "@", page: "users" },
];

const styles = {
  sidebar: {
    position: "sticky",
    top: 0,
    height: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #dfe7f2",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
    boxSizing: "border-box",
  },
  brand: {
    margin: "18px 18px 46px",
    color: "#d14134",
    fontSize: "34px",
    fontWeight: 800,
    letterSpacing: "-1px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "16px 18px",
    borderRadius: "10px",
    color: "#65748f",
    fontSize: "18px",
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
  navItemActive: {
    background: "#fff1ef",
    color: "#ef4335",
    fontWeight: 600,
  },
  navIcon: {
    width: "22px",
    textAlign: "center",
    fontSize: "20px",
  },
  sidebarFooter: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
};

function AppSidebar({ currentPage, currentUser = null, onNavigate = () => {}, onLogout = () => {} }) {
  const user = currentUser || getCurrentUser();
  const roleName = getRoleName(user).toLowerCase();
  const visibleNavItems = navItems
    .filter((item) => canAccessPage(user, item.page))
    .map((item) => (
      item.page === "orders" && roleName === "staff"
        ? { ...item, label: "Order" }
        : item
    ));

  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>WinMart</div>

      <nav style={styles.nav}>
        {visibleNavItems.map((item) => (
          <button
            key={item.label}
            style={{
              ...styles.navItem,
              ...(currentPage === item.page ? styles.navItemActive : null),
            }}
            onClick={() => item.page && onNavigate(item.page)}
          >
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={styles.sidebarFooter}>
        {canAccessPage(user, "settings") ? (
          <button style={styles.navItem} onClick={() => onNavigate("settings")}>
            <span style={styles.navIcon}>*</span>
            <span>Settings</span>
          </button>
        ) : null}
        <button type="button" style={{ ...styles.navItem, color: "#ef4335" }} onClick={onLogout}>
          <span style={styles.navIcon}>-</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

export default AppSidebar;
