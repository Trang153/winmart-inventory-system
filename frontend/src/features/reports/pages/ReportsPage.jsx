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

const summaryCards = [
  { title: "Total Revenue", value: "$124,563.00", note: "+12.5% from last month", icon: "$", tone: "green" },
  { title: "Total Orders", value: "1,429", note: "+8.2% from last month", icon: "[]", tone: "green" },
  { title: "Inventory Value", value: "$45,231.00", note: "+5.1% from last month", icon: "O", tone: "green" },
  { title: "Low Stock Alerts", value: "14", note: "+3 from last month", icon: "!", tone: "red" },
];

const monthlyRevenue = [15, 20, 18, 25, 30, 28, 35, 42, 38, 45, 50, 48];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const topProducts = [
  { name: "Oreo Original 120g", sold: "2,410", revenue: "$6,025" },
  { name: "Coca-Cola 330ml", sold: "1,980", revenue: "$4,752" },
  { name: "Fresh Milk 1L", sold: "1,420", revenue: "$2,556" },
];

const inventoryReport = [
  { category: "Snacks", value: "$18,430", items: "4,820", status: "Healthy" },
  { category: "Drinks", value: "$14,200", items: "3,540", status: "Monitor" },
  { category: "Dairy", value: "$12,601", items: "2,774", status: "Low" },
];

const salesReport = [
  { channel: "In-store", orders: "842", revenue: "$58,420", trend: "+6.4%" },
  { channel: "Online", orders: "391", revenue: "$42,610", trend: "+11.2%" },
  { channel: "Wholesale", orders: "196", revenue: "$23,533", trend: "+4.8%" },
];

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "322px 1fr", background: "#f5f7fb", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: "#1f2937" },
  sidebar: { background: "#ffffff", borderRight: "1px solid #dfe7f2", padding: "22px 18px", display: "flex", flexDirection: "column" },
  brand: { margin: "18px 18px 46px", color: "#d14134", fontSize: "34px", fontWeight: 800, letterSpacing: "-1px" },
  nav: { display: "flex", flexDirection: "column", gap: "14px" },
  navItem: { display: "flex", alignItems: "center", gap: "16px", padding: "16px 18px", borderRadius: "10px", color: "#65748f", fontSize: "18px", border: "none", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" },
  navItemActive: { background: "#fff1ef", color: "#ef4335", fontWeight: 600 },
  sidebarFooter: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "14px" },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #dfe7f2", padding: "20px 38px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px" },
  search: { width: "100%", maxWidth: "476px", height: "48px", border: "1px solid #d7e1ed", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", color: "#94a3b8", background: "#ffffff", boxSizing: "border-box", fontSize: "16px" },
  topActions: { display: "flex", alignItems: "center", gap: "18px", color: "#64748b" },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #f1debf, #ba8840)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 700 },
  content: { padding: "38px", display: "grid", gap: "24px" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", flexWrap: "wrap" },
  title: { margin: 0, fontSize: "31px", fontWeight: 800, color: "#172033" },
  headerActions: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" },
  secondaryButton: { height: "48px", padding: "0 20px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#1f2937", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" },
  card: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "16px", padding: "28px 30px 24px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "18px", gap: "12px" },
  cardTitle: { color: "#64748b", fontSize: "16px", fontWeight: 600 },
  cardIcon: { width: "42px", height: "42px", borderRadius: "12px", display: "grid", placeItems: "center", fontSize: "20px", fontWeight: 700 },
  cardValue: { fontSize: "38px", fontWeight: 800, color: "#172033", marginBottom: "14px" },
  cardNote: { fontSize: "15px", fontWeight: 600 },
  panel: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "18px", padding: "24px 28px" },
  panelTitle: { margin: "0 0 18px", fontSize: "18px", fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: "12px" },
  revenueChart: { height: "380px", display: "grid", gridTemplateColumns: "52px 1fr", gap: "10px", alignItems: "stretch" },
  yAxis: { display: "flex", flexDirection: "column", justifyContent: "space-between", color: "#71829d", fontSize: "14px", padding: "28px 0 6px" },
  barsWrap: { position: "relative", paddingTop: "26px" },
  grid: { position: "absolute", inset: "32px 0 42px 0", display: "grid", gridTemplateRows: "repeat(5, 1fr)", pointerEvents: "none" },
  gridLine: { borderTop: "1px dashed #e3eaf3" },
  topNumbers: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "14px", color: "#6e7f99", fontWeight: 700, fontSize: "14px", marginBottom: "8px" },
  bars: { display: "grid", gridTemplateColumns: "repeat(12, 1fr)", gap: "14px", alignItems: "end", height: "290px", padding: "0 8px" },
  barItem: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "end", gap: "12px" },
  bar: { width: "100%", maxWidth: "58px", background: "#d14d43", borderRadius: "8px 8px 0 0" },
  month: { color: "#6e7f99", fontSize: "15px" },
  threeCols: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px" },
  miniCard: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "16px", overflow: "hidden" },
  miniHeader: { padding: "18px 20px", borderBottom: "1px solid #e8eef5", fontSize: "17px", fontWeight: 700, color: "#1f2937" },
  miniBody: { padding: "18px 20px" },
  listItem: { display: "grid", gap: "6px", padding: "14px 0", borderBottom: "1px solid #edf2f8" },
  primaryText: { fontSize: "16px", fontWeight: 600, color: "#1f2937" },
  secondaryText: { fontSize: "14px", color: "#71829d" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", padding: "14px 0", borderBottom: "1px solid #edf2f8" },
  healthy: { color: "#22a958", fontWeight: 700 },
  monitor: { color: "#d97706", fontWeight: 700 },
  low: { color: "#ef4335", fontWeight: 700 },
  trend: { color: "#22a958", fontWeight: 700 },
};

function getCardTone(tone) {
  if (tone === "red") {
    return {
      icon: { background: "#fff1ef", color: "#ef4335" },
      note: { color: "#ef4335" },
    };
  }

  return {
    icon: { background: "#f8fafc", color: "#ef4335" },
    note: { color: "#34a853" },
  };
}

function Reports({ currentPage = "reports", onNavigate = () => {}, onLogout = () => {} }) {
  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .reports-cards,
            .reports-three-cols {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 1024px) {
            .reports-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 820px) {
            .reports-topbar,
            .reports-header {
              flex-direction: column;
              align-items: stretch;
            }

            .reports-search {
              max-width: none;
            }
          }

          @media (max-width: 640px) {
            .reports-cards,
            .reports-three-cols {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="reports-page" style={styles.page}>
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
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div style={styles.sidebarFooter}>
            <button style={styles.navItem} onClick={() => onNavigate("settings")}>Settings</button>
            <button type="button" style={{ ...styles.navItem, color: "#ef4335" }} onClick={onLogout}>Log Out</button>
          </div>
        </aside>

        <main style={styles.main}>
          <header className="reports-topbar" style={styles.topbar}>
            <div className="reports-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search reports, metrics, products...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <div style={styles.avatar}>A</div>
            </div>
          </header>

          <div style={styles.content}>
            <div className="reports-header" style={styles.headerRow}>
              <h1 style={styles.title}>Reports & Analytics</h1>

              <div style={styles.headerActions}>
                <button type="button" style={styles.secondaryButton}>
                  <span>[]</span>
                  <span>Export Excel</span>
                </button>
                <button type="button" style={styles.secondaryButton}>
                  <span>[]</span>
                  <span>Export PDF</span>
                </button>
              </div>
            </div>

            <div className="reports-cards" style={styles.cardsGrid}>
              {summaryCards.map((card) => {
                const tone = getCardTone(card.tone);
                return (
                  <div key={card.title} style={styles.card}>
                    <div style={styles.cardTop}>
                      <div style={styles.cardTitle}>{card.title}</div>
                      <div style={{ ...styles.cardIcon, ...tone.icon }}>{card.icon}</div>
                    </div>
                    <div style={styles.cardValue}>{card.value}</div>
                    <div style={{ ...styles.cardNote, ...tone.note }}>{card.note}</div>
                  </div>
                );
              })}
            </div>

            <section style={styles.panel}>
              <h2 style={styles.panelTitle}>| Monthly Revenue Statistics</h2>

              <div style={styles.revenueChart}>
                <div style={styles.yAxis}>
                  <span>50k</span>
                  <span>40k</span>
                  <span>30k</span>
                  <span>20k</span>
                  <span>10k</span>
                  <span>0</span>
                </div>

                <div style={styles.barsWrap}>
                  <div style={styles.topNumbers}>
                    {monthlyRevenue.map((value, index) => (
                      <span key={`top-${months[index]}`}>{value}k</span>
                    ))}
                  </div>

                  <div style={styles.grid}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} style={styles.gridLine} />
                    ))}
                  </div>

                  <div style={styles.bars}>
                    {monthlyRevenue.map((value, index) => (
                      <div key={months[index]} style={styles.barItem}>
                        <div style={{ ...styles.bar, height: `${(value / 50) * 100}%` }} />
                        <span style={styles.month}>{months[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="reports-three-cols" style={styles.threeCols}>
              <section style={styles.miniCard}>
                <div style={styles.miniHeader}>Các sản phẩm bán chạy</div>
                <div style={styles.miniBody}>
                  {topProducts.map((item) => (
                    <div key={item.name} style={styles.listItem}>
                      <span style={styles.primaryText}>{item.name}</span>
                      <span style={styles.secondaryText}>
                        Đã bán: {item.sold} • Doanh thu: {item.revenue}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section style={styles.miniCard}>
                <div style={styles.miniHeader}>Báo cáo tồn kho</div>
                <div style={styles.miniBody}>
                  {inventoryReport.map((item) => (
                    <div key={item.category} style={styles.row}>
                      <div>
                        <div style={styles.primaryText}>{item.category}</div>
                        <div style={styles.secondaryText}>
                          {item.items} sản phẩm • {item.value}
                        </div>
                      </div>
                      <span
                        style={
                          item.status === "Healthy"
                            ? styles.healthy
                            : item.status === "Monitor"
                              ? styles.monitor
                              : styles.low
                        }
                      >
                        {item.status}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section style={styles.miniCard}>
                <div style={styles.miniHeader}>Báo cáo bán hàng</div>
                <div style={styles.miniBody}>
                  {salesReport.map((item) => (
                    <div key={item.channel} style={styles.row}>
                      <div>
                        <div style={styles.primaryText}>{item.channel}</div>
                        <div style={styles.secondaryText}>
                          {item.orders} đơn • {item.revenue}
                        </div>
                      </div>
                      <span style={styles.trend}>{item.trend}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Reports;
