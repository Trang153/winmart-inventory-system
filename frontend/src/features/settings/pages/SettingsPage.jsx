import React from "react";

const navItems = [
  { label: "Dashboard", icon: "#", page: "dashboard" },
  { label: "Suppliers", icon: "O", page: "suppliers" },
  { label: "Products", icon: "[]", page: "products" },
  { label: "Inventory", icon: "[]", page: "inventory" },
  { label: "Orders", icon: "U", page: "orders" },
  { label: "Reports", icon: "|", page: "reports" },
  { label: "Rating", icon: "/", page: "rating" },
];

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "274px 1fr", background: "#f5f7fb", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: "#1f2937" },
  sidebar: { background: "#ffffff", borderRight: "1px solid #dfe7f2", padding: "22px 14px", display: "flex", flexDirection: "column" },
  brand: { margin: "12px 18px 40px", color: "#d14134", fontSize: "34px", fontWeight: 800, letterSpacing: "-1px" },
  nav: { display: "flex", flexDirection: "column", gap: "10px" },
  navItem: { display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderRadius: "10px", color: "#65748f", fontSize: "17px", border: "none", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" },
  navItemActive: { background: "#fff1ef", color: "#ef4335", fontWeight: 600 },
  footer: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #dfe7f2", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" },
  topSearch: { width: "100%", maxWidth: "320px", height: "44px", border: "1px solid #d7e1ed", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", color: "#94a3b8", background: "#ffffff", boxSizing: "border-box", fontSize: "15px" },
  topActions: { display: "flex", alignItems: "center", gap: "16px", color: "#64748b" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #cfd6e4, #6b7486)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 700 },
  content: { padding: "34px 38px", display: "grid", gap: "28px" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "start", gap: "18px", flexWrap: "wrap" },
  title: { margin: 0, fontSize: "29px", fontWeight: 800, color: "#172033" },
  subtitle: { margin: "8px 0 0", color: "#64748b", fontSize: "16px" },
  sectionTitle: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#374151" },
  searchBox: { width: "100%", maxWidth: "380px", height: "46px", border: "1px solid #d7e1ed", borderRadius: "8px", display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", color: "#94a3b8", background: "#ffffff", boxSizing: "border-box" },
  grid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "28px 36px" },
  field: { display: "grid", gap: "10px" },
  label: { color: "#374151", fontSize: "15px", fontWeight: 500 },
  select: { width: "100%", height: "40px", borderRadius: "8px", border: "1px solid #cfe0f5", background: "#ffffff", padding: "0 12px", fontSize: "15px", color: "#95a1b5" },
  toggleWrap: { borderTop: "1px solid #dbe4ef", paddingTop: "10px" },
  toggleLabel: { color: "#374151", fontSize: "15px", fontWeight: 500, marginBottom: "8px" },
  toggleRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", color: "#7a8598" },
  toggle: { width: "46px", height: "26px", borderRadius: "999px", background: "#e13d32", position: "relative" },
  toggleCircle: { width: "22px", height: "22px", borderRadius: "50%", background: "#ffffff", position: "absolute", right: "2px", top: "2px" },
};

function Settings({ currentPage = "settings", onNavigate = () => {}, onLogout = () => {} }) {
  return (
    <>
      <style>
        {`
          @media (max-width: 1100px) {
            .settings-grid {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 900px) {
            .settings-page {
              grid-template-columns: 1fr;
            }

            .settings-topbar,
            .settings-header {
              flex-direction: column;
              align-items: stretch;
            }
          }

          @media (max-width: 640px) {
            .settings-grid {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="settings-page" style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>WinMart</div>

          <nav style={styles.nav}>
            {navItems.map((item) => (
              <button key={item.label} style={styles.navItem} onClick={() => item.page && onNavigate(item.page)}>
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div style={styles.footer}>
            <button style={{ ...styles.navItem, ...styles.navItemActive }}>
              <span>*</span>
              <span>Settings</span>
            </button>
            <button type="button" style={{ ...styles.navItem, color: "#ef4335" }} onClick={onLogout}>
              <span>-</span>
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <header className="settings-topbar" style={styles.topbar}>
            <div style={styles.topSearch}>
              <span>Q</span>
              <span>Search product, supplier, order</span>
            </div>

            <div style={styles.topActions}>
              <span>!</span>
              <div style={styles.avatar}>U</div>
            </div>
          </header>

          <div style={styles.content}>
            <div className="settings-header" style={styles.headerRow}>
              <div>
                <h1 style={styles.title}>System Settings</h1>
                <p style={styles.subtitle}>Setup and edit system settings and preferences</p>
              </div>

              <div style={styles.searchBox}>
                <span>Q</span>
                <span>Search Settings</span>
              </div>
            </div>

            <h2 style={styles.sectionTitle}>General</h2>

            <div className="settings-grid" style={styles.grid}>
              <div style={styles.field}>
                <label style={styles.label}>System Language</label>
                <select style={styles.select} defaultValue="English"><option>English</option></select>
              </div>

              <div style={styles.field}>
                <div style={styles.toggleWrap}>
                  <div style={styles.toggleLabel}>User Sign up</div>
                  <div style={styles.toggleRow}>
                    <span>Allow new users to sign up</span>
                    <div style={styles.toggle}><div style={styles.toggleCircle} /></div>
                  </div>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Default Agents Language</label>
                <select style={styles.select} defaultValue="English"><option>English</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Admin Dashboard Theme</label>
                <select style={styles.select} defaultValue="Light Theme"><option>Light Theme</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Default Theme for Users</label>
                <select style={styles.select} defaultValue="Light Theme"><option>Light Theme</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Default Theme for AI Agents</label>
                <select style={styles.select} defaultValue="Light Theme"><option>Light Theme</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Time Zone</label>
                <select style={styles.select} defaultValue="CET- Central European Time"><option>CET- Central European Time</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Date and Time Format</label>
                <select style={styles.select} defaultValue="DD/MM/YYYY"><option>DD/MM/YYYY</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>System Update Frequency</label>
                <select style={styles.select} defaultValue="Monthly"><option>Monthly</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Currency</label>
                <select style={styles.select} defaultValue="USD ($)"><option>USD ($)</option></select>
              </div>

              <div style={styles.field}>
                <div style={styles.toggleWrap}>
                  <div style={styles.toggleLabel}>Notifications</div>
                  <div style={styles.toggleRow}>
                    <span>Allow system notifications</span>
                    <div style={styles.toggle}><div style={styles.toggleCircle} /></div>
                  </div>
                </div>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Security Checks Frequency</label>
                <select style={styles.select} defaultValue="Weekly"><option>Weekly</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>System Font</label>
                <select style={styles.select} defaultValue="Default- Hanken Grotesk"><option>Default- Hanken Grotesk</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Admin Dashboard Layout</label>
                <select style={styles.select} defaultValue="Default- Spacious"><option>Default- Spacious</option></select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>Logs/Reports File Format for Download</label>
                <select style={styles.select} defaultValue="3 Selected (CSV, PDF & XLS)"><option>3 Selected (CSV, PDF & XLS)</option></select>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Settings;
