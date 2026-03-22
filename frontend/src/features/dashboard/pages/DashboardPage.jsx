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

const overviewCards = [
  { value: "832", label: "Sellers", color: "#4a7cf6", bg: "#edf4ff" },
  { value: "$ 18,300", label: "Revenue", color: "#8570ff", bg: "#f1ecff" },
  { value: "$ 868", label: "Profit", color: "#d99947", bg: "#fff1e4" },
  { value: "$ 17,432", label: "Cost", color: "#67b676", bg: "#ebfff0" },
];

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "#f6f7fb",
    color: "#2f3542",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #eceef5",
    padding: "28px 24px",
    display: "flex",
    flexDirection: "column",
    gap: "28px",
  },
  brand: {
    fontSize: "58px",
    fontWeight: 800,
    lineHeight: 1,
    color: "#de3f30",
    letterSpacing: "-2px",
    margin: "10px 0 30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "12px 12px",
    borderRadius: "14px",
    fontSize: "17px",
    color: "#667085",
    border: "none",
    background: "transparent",
    width: "100%",
    textAlign: "left",
    cursor: "pointer",
  },
  navItemActive: {
    background: "#fff2ef",
    color: "#e14a38",
    fontWeight: 700,
  },
  navIcon: {
    width: "24px",
    textAlign: "center",
    fontSize: "20px",
  },
  sidebarFooter: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  main: {
    display: "flex",
    flexDirection: "column",
    minWidth: 0,
  },
  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #eceef5",
    padding: "20px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },
  searchBox: {
    width: "100%",
    maxWidth: "430px",
    height: "48px",
    border: "1px solid #e3e8f2",
    borderRadius: "14px",
    background: "#fbfcff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 16px",
    boxSizing: "border-box",
    color: "#98a2b3",
    fontSize: "16px",
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#7b8496",
    fontSize: "22px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #d9dce7, #a7b0c9)",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
  },
  content: {
    padding: "30px",
    display: "grid",
    gap: "20px",
  },
  panel: {
    background: "#ffffff",
    borderRadius: "18px",
    padding: "22px",
    boxShadow: "0 10px 30px rgba(30, 41, 59, 0.04)",
  },
  title: {
    margin: 0,
    fontSize: "20px",
    fontWeight: 700,
    color: "#394150",
  },
  metricGrid: {
    marginTop: "22px",
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
  },
  metricCard: {
    padding: "18px",
    borderRadius: "16px",
  },
  metricValue: {
    display: "block",
    fontSize: "24px",
    fontWeight: 800,
    marginBottom: "8px",
  },
  chartArea: {
    marginTop: "18px",
    height: "260px",
    borderRadius: "16px",
    background:
      "linear-gradient(180deg, rgba(217,72,59,0.06), rgba(217,72,59,0.01)), repeating-linear-gradient(to top, #eef2f8 0, #eef2f8 1px, transparent 1px, transparent 52px)",
  },
};

function Dashboard({ currentPage = "dashboard", onNavigate = () => {}, onLogout = () => {} }) {
  return (
    <>
      <style>
        {`
          @media (max-width: 980px) {
            .dashboard-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 760px) {
            .dashboard-topbar,
            .dashboard-metric-grid {
              grid-template-columns: 1fr !important;
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="dashboard-page" style={styles.page}>
        <aside style={styles.sidebar}>
          <div style={styles.brand}>WinMart</div>

          <nav style={styles.nav}>
            {navItems.map((item) => (
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
            <button style={styles.navItem} onClick={() => onNavigate("settings")}>
              <span style={styles.navIcon}>*</span>
              <span>Settings</span>
            </button>
            <button type="button" style={{ ...styles.navItem, color: "#e14a38" }} onClick={onLogout}>
              <span style={styles.navIcon}>-</span>
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <header className="dashboard-topbar" style={styles.topbar}>
            <div style={styles.searchBox}>
              <span>Search product, supplier, order</span>
              <span>Q</span>
            </div>

            <div style={styles.topActions}>
              <span>!</span>
              <div style={styles.avatar}>U</div>
            </div>
          </header>

          <div style={styles.content}>
            <section style={styles.panel}>
              <h2 style={styles.title}>Total Overview</h2>
              <div className="dashboard-metric-grid" style={styles.metricGrid}>
                {overviewCards.map((item) => (
                  <div key={item.label} style={{ ...styles.metricCard, background: item.bg }}>
                    <span style={{ ...styles.metricValue, color: item.color }}>{item.value}</span>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </section>

            <section style={styles.panel}>
              <h2 style={styles.title}>Sales Overview</h2>
              <div style={styles.chartArea} />
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
