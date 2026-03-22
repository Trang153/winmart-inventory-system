import React, { useMemo, useState } from "react";

const navItems = [
  { label: "Dashboard", icon: "#", page: "dashboard" },
  { label: "Suppliers", icon: "O", page: "suppliers" },
  { label: "Products", icon: "[]", page: "products" },
  { label: "Inventory", icon: "[]", page: "inventory" },
  { label: "Orders", icon: "U", page: "orders" },
  { label: "Reports", icon: "|", page: "reports" },
  { label: "Rating", icon: "/", page: "rating" },
];

const stats = [
  {
    title: "Total Items in Stock",
    value: "24,592",
    note: "2.4% from last month",
    icon: "[]",
    tone: "blue",
  },
  {
    title: "Healthy Stock",
    value: "1,154",
    note: "Products with optimal stock levels",
    icon: "O",
    tone: "green",
  },
  {
    title: "Low Stock Alerts",
    value: "45",
    note: "12 new alerts today",
    icon: "!",
    tone: "yellow",
  },
  {
    title: "Out of Stock",
    value: "12",
    note: "Requires immediate reordering",
    icon: "X",
    tone: "red",
  },
];

const inventoryRows = [
  {
    name: "Oreo Original 120g",
    sku: "SKU: OR-120-ORG",
    category: "Snacks",
    stock: "450",
    minStock: "50",
    status: "In Stock",
    updated: "Today, 09:41 AM",
    tone: "green",
    fill: "78%",
    image: "OO",
  },
  {
    name: "Lays Classic Potato Chips",
    sku: "SKU: LY-150-CLS",
    category: "Snacks",
    stock: "12",
    minStock: "20",
    status: "Low Stock",
    updated: "Yesterday, 14:20",
    tone: "yellow",
    fill: "18%",
    image: "LY",
  },
  {
    name: "Fresh Milk 1L",
    sku: "SKU: FM-100-1L",
    category: "Dairy",
    stock: "0",
    minStock: "20",
    status: "Out of Stock",
    updated: "Oct 24, 08:00",
    tone: "red",
    fill: "0%",
    image: "FM",
  },
];

function parseStockValue(value) {
  return Number(String(value).replace(/,/g, ""));
}

function formatStockValue(value) {
  return new Intl.NumberFormat("en-US").format(value);
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "322px 1fr",
    background: "#f5f7fb",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: "#1f2937",
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #dfe7f2",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
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
  sidebarFooter: {
    marginTop: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
  },
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #dfe7f2",
    padding: "20px 38px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
  },
  search: {
    width: "100%",
    maxWidth: "476px",
    height: "48px",
    border: "1px solid #d7e1ed",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    color: "#94a3b8",
    background: "#ffffff",
    boxSizing: "border-box",
    fontSize: "16px",
  },
  topActions: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#64748b",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f1debf, #ba8840)",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
  },
  content: {
    padding: "38px",
    display: "grid",
    gap: "24px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "31px",
    fontWeight: 800,
    color: "#172033",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    height: "48px",
    padding: "0 20px",
    borderRadius: "10px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "16px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  primaryButton: {
    height: "48px",
    padding: "0 22px",
    borderRadius: "10px",
    border: "none",
    background: "#d94736",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "18px",
  },
  statCard: {
    borderRadius: "16px",
    padding: "30px 30px 28px",
    border: "1px solid #dde6f2",
    background: "#ffffff",
  },
  statTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "12px",
    marginBottom: "18px",
  },
  statLabel: {
    color: "#64748b",
    fontSize: "16px",
    fontWeight: 600,
  },
  statIcon: {
    width: "50px",
    height: "50px",
    borderRadius: "10px",
    display: "grid",
    placeItems: "center",
    fontSize: "22px",
    fontWeight: 700,
  },
  statValue: {
    fontSize: "46px",
    fontWeight: 800,
    marginBottom: "12px",
    color: "#172033",
  },
  statNote: {
    fontSize: "15px",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  selectBox: {
    minWidth: "224px",
    height: "50px",
    borderRadius: "10px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    padding: "0 16px",
    fontSize: "16px",
    color: "#1f2937",
  },
  tableCard: {
    background: "#ffffff",
    border: "1px solid #dbe4ef",
    borderRadius: "16px",
    overflow: "hidden",
  },
  tableScroll: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    minWidth: "1200px",
    borderCollapse: "collapse",
  },
  th: {
    padding: "20px 18px",
    textAlign: "left",
    color: "#71829d",
    fontWeight: 700,
    fontSize: "16px",
    borderBottom: "1px solid #dde6f2",
  },
  td: {
    padding: "22px 18px",
    borderBottom: "1px solid #e8eef5",
    fontSize: "17px",
    color: "#1f2937",
    verticalAlign: "middle",
  },
  productCell: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: "14px",
    alignItems: "center",
  },
  productImage: {
    width: "54px",
    height: "54px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2a3446, #8b5e34)",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontWeight: 700,
    fontSize: "14px",
  },
  productName: {
    fontSize: "18px",
    fontWeight: 600,
    marginBottom: "6px",
  },
  sku: {
    color: "#71829d",
    fontSize: "15px",
  },
  stockWrap: {
    minWidth: "110px",
  },
  stockNumber: {
    fontSize: "18px",
    fontWeight: 700,
    marginBottom: "10px",
  },
  progressTrack: {
    width: "110px",
    height: "8px",
    background: "#dbe4ef",
    borderRadius: "999px",
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: "999px",
  },
  statusGreen: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "16px",
    background: "#dbf7e3",
    color: "#28a85a",
    fontWeight: 600,
    fontSize: "16px",
  },
  statusYellow: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "16px",
    background: "#fff0c7",
    color: "#b97712",
    fontWeight: 600,
    fontSize: "16px",
  },
  statusRed: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "16px",
    background: "#fde4e0",
    color: "#ef4335",
    fontWeight: 600,
    fontSize: "16px",
  },
  rowActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  miniButton: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    color: "#64748b",
    fontSize: "24px",
    display: "grid",
    placeItems: "center",
    lineHeight: 1,
  },
  tableFooter: {
    padding: "20px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    flexWrap: "wrap",
  },
  footerText: {
    color: "#6b7a92",
    fontSize: "17px",
  },
  pagination: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    flexWrap: "wrap",
  },
  pageButton: {
    minWidth: "40px",
    height: "40px",
    borderRadius: "8px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    color: "#1f2937",
    fontSize: "16px",
    display: "grid",
    placeItems: "center",
  },
  pageButtonActive: {
    background: "#d94736",
    color: "#ffffff",
    border: "1px solid #d94736",
  },
  ellipsis: {
    padding: "0 8px",
    color: "#6b7a92",
    fontSize: "18px",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.35)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
    zIndex: 1000,
  },
  modal: {
    width: "100%",
    maxWidth: "520px",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)",
    overflow: "hidden",
  },
  modalHeader: {
    padding: "20px 24px",
    borderBottom: "1px solid #e5ebf3",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "12px",
  },
  modalTitle: {
    margin: 0,
    fontSize: "22px",
    fontWeight: 700,
    color: "#172033",
  },
  modalClose: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    fontSize: "28px",
    cursor: "pointer",
    lineHeight: 1,
  },
  modalBody: {
    padding: "24px",
    display: "grid",
    gap: "18px",
  },
  modalField: {
    display: "grid",
    gap: "8px",
  },
  modalLabel: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#334155",
  },
  modalInput: {
    height: "44px",
    borderRadius: "10px",
    border: "1px solid #d6dfeb",
    padding: "0 14px",
    boxSizing: "border-box",
    fontSize: "15px",
    color: "#1f2937",
    background: "#ffffff",
    outline: "none",
    width: "100%",
  },
  modalInputReadonly: {
    background: "#f8fafc",
    color: "#64748b",
  },
  modalFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    padding: "0 24px 24px",
  },
};

function getStatTone(tone) {
  if (tone === "green") {
    return {
      card: { background: "#ffffff", border: "1px solid #dde6f2" },
      icon: { background: "#daf7e1", color: "#34a853" },
      note: { color: "#64748b" },
    };
  }

  if (tone === "yellow") {
    return {
      card: { background: "#fffdf2", border: "1px solid #f0d266" },
      icon: { background: "#fff2bf", color: "#dd8b18" },
      note: { color: "#dd8b18" },
    };
  }

  if (tone === "red") {
    return {
      card: { background: "#fff7f7", border: "1px solid #f5b6af" },
      icon: { background: "#ffe4e0", color: "#ef4335" },
      note: { color: "#c24135" },
    };
  }

  return {
    card: { background: "#ffffff", border: "1px solid #dde6f2" },
    icon: { background: "#ddebfb", color: "#3a82d1" },
    note: { color: "#64748b" },
  };
}

function getRowTone(tone) {
  if (tone === "yellow") {
    return {
      row: { background: "#fffdf4" },
      fill: { background: "#e9a63b" },
      status: styles.statusYellow,
      stock: { color: "#d9822b" },
    };
  }

  if (tone === "red") {
    return {
      row: { background: "#fff7f7" },
      fill: { background: "#ef4335" },
      status: styles.statusRed,
      stock: { color: "#ef4335" },
    };
  }

  return {
    row: {},
    fill: { background: "#34a853" },
    status: styles.statusGreen,
    stock: { color: "#1f2937" },
  };
}

function Inventory({ currentPage = "inventory", onNavigate = () => {}, onLogout = () => {} }) {
  const [rows, setRows] = useState(inventoryRows);
  const [stockModal, setStockModal] = useState(null);
  const [quantity, setQuantity] = useState("");

  const summary = useMemo(() => {
    const totalItems = rows.reduce((sum, row) => sum + parseStockValue(row.stock), 0);
    const healthy = rows.filter((row) => row.tone === "green").length;
    const low = rows.filter((row) => row.tone === "yellow").length;
    const out = rows.filter((row) => row.tone === "red").length;

    return {
      totalItems: formatStockValue(totalItems),
      healthy,
      low,
      out,
    };
  }, [rows]);

  const displayStats = [
    { ...stats[0], value: summary.totalItems },
    { ...stats[1], value: String(summary.healthy) },
    { ...stats[2], value: String(summary.low) },
    { ...stats[3], value: String(summary.out) },
  ];

  function openStockModal(row, mode) {
    setStockModal({ row, mode });
    setQuantity("");
  }

  function closeStockModal() {
    setStockModal(null);
    setQuantity("");
  }

  function confirmStockUpdate() {
    const qty = Number(quantity);
    if (!stockModal || !Number.isFinite(qty) || qty <= 0) {
      return;
    }

    setRows((currentRows) =>
      currentRows.map((row) => {
        if (row.sku !== stockModal.row.sku) {
          return row;
        }

        const currentStock = parseStockValue(row.stock);
        const minStock = parseStockValue(row.minStock);
        const nextStock =
          stockModal.mode === "increase"
            ? currentStock + qty
            : Math.max(0, currentStock - qty);

        let tone = "green";
        let status = "In Stock";

        if (nextStock === 0) {
          tone = "red";
          status = "Out of Stock";
        } else if (nextStock <= minStock) {
          tone = "yellow";
          status = "Low Stock";
        }

        const fill = `${Math.min(100, Math.max(0, (nextStock / Math.max(minStock * 2, 1)) * 100))}%`;

        return {
          ...row,
          stock: formatStockValue(nextStock),
          tone,
          status,
          fill,
          updated: "Just now",
        };
      })
    );

    closeStockModal();
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .inventory-stats {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 1024px) {
            .inventory-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 820px) {
            .inventory-topbar,
            .inventory-header,
            .inventory-footer {
              flex-direction: column;
              align-items: stretch;
            }

            .inventory-search {
              max-width: none;
            }
          }

          @media (max-width: 620px) {
            .inventory-stats {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="inventory-page" style={styles.page}>
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
          <header className="inventory-topbar" style={styles.topbar}>
            <div className="inventory-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search inventory, SKU, categories...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <div style={styles.avatar}>A</div>
            </div>
          </header>

          <div style={styles.content}>
            <div className="inventory-header" style={styles.headerRow}>
              <h1 style={styles.title}>Inventory Management</h1>

              <div style={styles.headerActions}>
                <button type="button" style={styles.secondaryButton}>
                  <span>T</span>
                  <span>Export Report</span>
                </button>
                <button type="button" style={styles.primaryButton}>
                  <span>Y</span>
                  <span>Receive Stock</span>
                </button>
              </div>
            </div>

            <div className="inventory-stats" style={styles.statsGrid}>
              {displayStats.map((stat) => {
                const tone = getStatTone(stat.tone);
                return (
                  <div key={stat.title} style={{ ...styles.statCard, ...tone.card }}>
                    <div style={styles.statTop}>
                      <div style={styles.statLabel}>{stat.title}</div>
                      <div style={{ ...styles.statIcon, ...tone.icon }}>{stat.icon}</div>
                    </div>
                    <div style={styles.statValue}>{stat.value}</div>
                    <div style={{ ...styles.statNote, ...tone.note }}>{stat.note}</div>
                  </div>
                );
              })}
            </div>

            <div style={styles.filterRow}>
              <select style={styles.selectBox} defaultValue="all-categories">
                <option value="all-categories">All Categories</option>
              </select>
              <select style={styles.selectBox} defaultValue="status-all">
                <option value="status-all">Stock Status: All</option>
              </select>
            </div>

            <section style={styles.tableCard}>
              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>PRODUCT DETAILS</th>
                      <th style={styles.th}>CATEGORY</th>
                      <th style={styles.th}>STOCK LEVEL</th>
                      <th style={styles.th}>MIN. STOCK</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>LAST UPDATED</th>
                      <th style={styles.th}>UPDATE STOCK</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => {
                      const tone = getRowTone(row.tone);
                      return (
                        <tr key={row.sku} style={tone.row}>
                          <td style={styles.td}>
                            <div style={styles.productCell}>
                              <div style={styles.productImage}>{row.image}</div>
                              <div>
                                <div style={styles.productName}>{row.name}</div>
                                <div style={styles.sku}>{row.sku}</div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>{row.category}</td>
                          <td style={styles.td}>
                            <div style={styles.stockWrap}>
                              <div style={{ ...styles.stockNumber, ...tone.stock }}>
                                {row.stock} <span style={{ fontWeight: 400, color: "#71829d" }}>pcs</span>
                              </div>
                              <div style={styles.progressTrack}>
                                <div style={{ ...styles.progressFill, ...tone.fill, width: row.fill }} />
                              </div>
                            </div>
                          </td>
                          <td style={styles.td}>
                            {row.minStock} <span style={{ color: "#71829d" }}>pcs</span>
                          </td>
                          <td style={styles.td}>
                            <span style={tone.status}>{row.status}</span>
                          </td>
                          <td style={{ ...styles.td, color: "#64748b" }}>{row.updated}</td>
                          <td style={styles.td}>
                            <div style={styles.rowActions}>
                              <button
                                type="button"
                                style={styles.miniButton}
                                onClick={() => openStockModal(row, "decrease")}
                              >
                                -
                              </button>
                              <button
                                type="button"
                                style={styles.miniButton}
                                onClick={() => openStockModal(row, "increase")}
                              >
                                +
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="inventory-footer" style={styles.tableFooter}>
                <div style={styles.footerText}>Showing 1 to 10 of 1,245 products</div>

                <div style={styles.pagination}>
                  <div style={styles.pageButton}>{"<"}</div>
                  <div style={{ ...styles.pageButton, ...styles.pageButtonActive }}>1</div>
                  <div style={styles.pageButton}>2</div>
                  <div style={styles.pageButton}>3</div>
                  <div style={styles.ellipsis}>...</div>
                  <div style={styles.pageButton}>125</div>
                  <div style={styles.pageButton}>{">"}</div>
                </div>
              </div>
            </section>
          </div>
        </main>

        {stockModal ? (
          <div style={styles.overlay} onClick={closeStockModal}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>
                  {stockModal.mode === "increase" ? "Receive Stock" : "Reduce Stock"}
                </h3>
                <button type="button" style={styles.modalClose} onClick={closeStockModal}>
                  ×
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>Sản phẩm</label>
                  <input
                    style={{ ...styles.modalInput, ...styles.modalInputReadonly }}
                    value={stockModal.row.name}
                    readOnly
                  />
                </div>

                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>Mã sản phẩm</label>
                  <input
                    style={{ ...styles.modalInput, ...styles.modalInputReadonly }}
                    value={stockModal.row.sku}
                    readOnly
                  />
                </div>

                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>Loại cập nhật</label>
                  <input
                    style={{ ...styles.modalInput, ...styles.modalInputReadonly }}
                    value={stockModal.mode === "increase" ? "Thêm stock" : "Giảm stock"}
                    readOnly
                  />
                </div>

                <div style={styles.modalField}>
                  <label style={styles.modalLabel}>Số lượng</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="Nhập số lượng cập nhật"
                    style={styles.modalInput}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.secondaryButton} onClick={closeStockModal}>
                  Hủy
                </button>
                <button type="button" style={styles.primaryButton} onClick={confirmStockUpdate}>
                  Xác nhận
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Inventory;
