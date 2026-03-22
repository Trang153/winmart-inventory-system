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
  { title: "Average Supplier Rating", value: "4.5", suffix: "/5.0", note: "+0.2 from last quarter", icon: "*", tone: "green" },
  { title: "Total Reviews", value: "1,284", suffix: "", note: "+145 new this month", icon: "[]", tone: "green" },
  { title: "Top Rated Category", value: "Produce", suffix: "(4.8)", note: "No change from last month", icon: "A", tone: "orange" },
  { title: "Needs Attention", value: "3", suffix: "Suppliers", note: "Rating below 3.0", icon: "!", tone: "red" },
];

const supplierRatings = [
  { code: "FP", name: "Fresh Produce Co.", category: "Produce", quality: "4.9", delivery: "4.8", support: "5.0", overall: "4.9", reviews: "156", status: "Top Tier", tone: "green" },
  { code: "GV", name: "Green Valley Farms", category: "Dairy", quality: "4.8", delivery: "4.9", support: "4.6", overall: "4.8", reviews: "94", status: "Top Tier", tone: "green" },
  { code: "GT", name: "Global Traders Inc.", category: "Electronics", quality: "4.5", delivery: "4.7", support: "4.8", overall: "4.7", reviews: "215", status: "Good", tone: "blue" },
];

const topSuppliers = [
  { rank: 1, code: "FP", name: "Fresh Produce Co.", category: "Produce", score: "4.9", rankTone: "#ffe78d", codeBg: "#dbe2ff" },
  { rank: 2, code: "GV", name: "Green Valley Farms", category: "Dairy", score: "4.8", rankTone: "#dfe5ef", codeBg: "#daf7e1" },
  { rank: 3, code: "GT", name: "Global Traders", category: "Electronics", score: "4.7", rankTone: "#ffd9b0", codeBg: "#dbe2ff" },
];

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "314px 1fr", background: "#f5f7fb", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: "#1f2937" },
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
  primaryButton: { height: "48px", padding: "0 22px", borderRadius: "10px", border: "none", background: "#d94736", color: "#ffffff", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  cardsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" },
  card: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "16px", padding: "30px 30px 26px" },
  cardTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "18px" },
  cardTitle: { color: "#64748b", fontSize: "16px", fontWeight: 600 },
  cardIcon: { width: "40px", height: "40px", borderRadius: "12px", display: "grid", placeItems: "center", fontSize: "18px", fontWeight: 700 },
  cardValueRow: { display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap", marginBottom: "14px" },
  cardValue: { fontSize: "38px", fontWeight: 800, color: "#172033" },
  cardSuffix: { fontSize: "18px", color: "#71829d", fontWeight: 600 },
  cardNote: { fontSize: "15px", fontWeight: 600 },
  mainGrid: { display: "grid", gridTemplateColumns: "2.35fr 0.7fr", gap: "24px", alignItems: "start" },
  tableCard: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "18px", overflow: "hidden" },
  tableHeader: { padding: "22px 28px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  tableTitle: { margin: 0, fontSize: "18px", fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: "12px" },
  searchTools: { display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" },
  smallSearch: { width: "300px", height: "40px", border: "1px solid #d8e1ec", borderRadius: "10px", display: "flex", alignItems: "center", gap: "10px", padding: "0 14px", color: "#94a3b8", background: "#ffffff", boxSizing: "border-box", fontSize: "15px" },
  smallSelect: { height: "40px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", padding: "0 14px", fontSize: "15px", color: "#1f2937" },
  tableScroll: { overflowX: "auto" },
  table: { width: "100%", minWidth: "980px", borderCollapse: "collapse" },
  th: { padding: "20px 18px", textAlign: "left", color: "#71829d", fontWeight: 700, fontSize: "16px", borderTop: "1px solid #edf2f8", borderBottom: "1px solid #dde6f2" },
  td: { padding: "20px 18px", borderBottom: "1px solid #e8eef5", fontSize: "17px", color: "#1f2937", verticalAlign: "middle" },
  supplierCell: { display: "grid", gridTemplateColumns: "48px 1fr", gap: "14px", alignItems: "center" },
  supplierCode: { width: "46px", height: "46px", borderRadius: "12px", background: "#dbe2ff", color: "#3d4db8", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "14px" },
  supplierName: { fontSize: "18px", fontWeight: 600, marginBottom: "6px" },
  supplierCategory: { color: "#71829d", fontSize: "15px" },
  scoreCell: { display: "flex", alignItems: "center", gap: "8px", color: "#1f2937", fontWeight: 700 },
  overallReviews: { color: "#71829d", fontWeight: 500 },
  statusGreen: { display: "inline-block", padding: "8px 16px", borderRadius: "16px", background: "#dbf7e3", color: "#28a85a", fontWeight: 600, fontSize: "16px" },
  statusBlue: { display: "inline-block", padding: "8px 16px", borderRadius: "16px", background: "#dfefff", color: "#2d7bd6", fontWeight: 600, fontSize: "16px" },
  topCard: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "18px", overflow: "hidden" },
  topHeader: { padding: "22px 24px", borderBottom: "1px solid #e8eef5", fontSize: "18px", fontWeight: 700, color: "#1f2937", display: "flex", alignItems: "center", gap: "10px" },
  topBody: { padding: "18px 18px" },
  topItem: { display: "grid", gridTemplateColumns: "28px 46px 1fr auto", gap: "12px", alignItems: "center", padding: "18px 16px", border: "1px solid #e3eaf3", borderRadius: "12px", marginBottom: "16px" },
  rank: { width: "36px", height: "36px", borderRadius: "50%", display: "grid", placeItems: "center", fontWeight: 700 },
  topCode: { width: "44px", height: "44px", borderRadius: "12px", display: "grid", placeItems: "center", fontWeight: 700, color: "#3d4db8" },
  topName: { fontSize: "17px", fontWeight: 700, marginBottom: "6px" },
  topCategory: { color: "#71829d", fontSize: "15px" },
  topScore: { fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "8px" },
};

function getCardTone(tone) {
  if (tone === "red") return { icon: { background: "#fff1ef", color: "#ef4335" }, note: { color: "#ef4335" } };
  if (tone === "orange") return { icon: { background: "#fff7eb", color: "#f59e0b" }, note: { color: "#f59e0b" } };
  return { icon: { background: "#f8fafc", color: "#ef4335" }, note: { color: "#34a853" } };
}

function getStatusStyle(tone) {
  return tone === "green" ? styles.statusGreen : styles.statusBlue;
}

function Rating({ currentPage = "rating", onNavigate = () => {}, onLogout = () => {} }) {
  return (
    <>
      <style>
        {`
          @media (max-width: 1280px) {
            .rating-cards {
              grid-template-columns: 1fr 1fr;
            }

            .rating-main-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 1024px) {
            .rating-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 820px) {
            .rating-topbar,
            .rating-header,
            .rating-table-header {
              flex-direction: column;
              align-items: stretch;
            }

            .rating-search,
            .rating-small-search {
              max-width: none;
              width: 100%;
            }
          }

          @media (max-width: 640px) {
            .rating-cards {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="rating-page" style={styles.page}>
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
          <header className="rating-topbar" style={styles.topbar}>
            <div className="rating-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search suppliers, ratings...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <div style={styles.avatar}>A</div>
            </div>
          </header>

          <div style={styles.content}>
            <div className="rating-header" style={styles.headerRow}>
              <h1 style={styles.title}>Supplier Ratings & Rankings</h1>

              <div style={styles.headerActions}>
                <button type="button" style={styles.secondaryButton}>
                  <span>T</span>
                  <span>Export Report</span>
                </button>
                <button type="button" style={{ ...styles.secondaryButton, background: "#d94736", color: "#ffffff", border: "none" }}>
                  <span>/</span>
                  <span>Request Reviews</span>
                </button>
              </div>
            </div>

            <div className="rating-cards" style={styles.cardsGrid}>
              {overviewCards.map((card) => {
                const tone = getCardTone(card.tone);
                return (
                  <div key={card.title} style={styles.card}>
                    <div style={styles.cardTop}>
                      <div style={styles.cardTitle}>{card.title}</div>
                      <div style={{ ...styles.cardIcon, ...tone.icon }}>{card.icon}</div>
                    </div>
                    <div style={styles.cardValueRow}>
                      <span style={styles.cardValue}>{card.value}</span>
                      <span style={styles.cardSuffix}>{card.suffix}</span>
                    </div>
                    <div style={{ ...styles.cardNote, ...tone.note }}>{card.note}</div>
                  </div>
                );
              })}
            </div>

            <div className="rating-main-grid" style={styles.mainGrid}>
              <section style={styles.tableCard}>
                <div className="rating-table-header" style={styles.tableHeader}>
                  <h2 style={styles.tableTitle}>/ Detailed Supplier Ratings</h2>

                  <div style={styles.searchTools}>
                    <div className="rating-small-search" style={styles.smallSearch}>
                      <span style={{ fontSize: "18px", color: "#111827" }}>Q</span>
                      <span>Search supplier...</span>
                    </div>
                    <select style={styles.smallSelect} defaultValue="all-categories">
                      <option value="all-categories">All Categories</option>
                    </select>
                  </div>
                </div>

                <div style={styles.tableScroll}>
                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>SUPPLIER</th>
                        <th style={styles.th}>QUALITY</th>
                        <th style={styles.th}>DELIVERY</th>
                        <th style={styles.th}>SUPPORT</th>
                        <th style={styles.th}>OVERALL</th>
                        <th style={styles.th}>STATUS</th>
                        <th style={styles.th}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierRatings.map((item) => (
                        <tr key={item.code}>
                          <td style={styles.td}>
                            <div style={styles.supplierCell}>
                              <div style={styles.supplierCode}>{item.code}</div>
                              <div>
                                <div style={styles.supplierName}>{item.name}</div>
                                <div style={styles.supplierCategory}>{item.category}</div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.scoreCell}>[] {item.quality}</div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.scoreCell}>U {item.delivery}</div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.scoreCell}>O {item.support}</div>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.scoreCell}>
                              * {item.overall} <span style={styles.overallReviews}>({item.reviews})</span>
                            </div>
                          </td>
                          <td style={styles.td}>
                            <span style={getStatusStyle(item.tone)}>{item.status}</span>
                          </td>
                          <td style={styles.td}>:</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside style={styles.topCard}>
                <div style={styles.topHeader}>T Top Suppliers</div>
                <div style={styles.topBody}>
                  {topSuppliers.map((item) => (
                    <div key={item.rank} style={styles.topItem}>
                      <div style={{ ...styles.rank, background: item.rankTone }}>{item.rank}</div>
                      <div style={{ ...styles.topCode, background: item.codeBg }}>{item.code}</div>
                      <div>
                        <div style={styles.topName}>{item.name}</div>
                        <div style={styles.topCategory}>{item.category}</div>
                      </div>
                      <div style={styles.topScore}>* {item.score}</div>
                    </div>
                  ))}
                </div>
              </aside>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Rating;
