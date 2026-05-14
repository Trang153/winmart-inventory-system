import React, { useEffect, useMemo, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import RoleAvatar from "../../../components/RoleAvatar";
import { getDashboardSummary } from "../../../services/order/orderService";
import { isAdmin } from "../../../auth/rbac";

const REFRESH_INTERVAL_MS = 5000;

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "322px 1fr",
    background: "#f6f7fb",
    color: "#2f3542",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
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
    borderRadius: "10px",
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
    fontSize: "16px",
  },
  livePill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    borderRadius: "999px",
    background: "#ecfdf3",
    color: "#15803d",
    fontSize: "14px",
    fontWeight: 700,
  },
  liveDot: {
    width: "8px",
    height: "8px",
    borderRadius: "50%",
    background: "#22c55e",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #d9dce7, #a7b0c9)",
    display: "grid",
    placeItems: "center",
    fontSize: "18px",
    color: "#ffffff",
    fontWeight: 800,
  },
  content: {
    padding: "30px",
    display: "grid",
    gap: "20px",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "end",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "32px",
    fontWeight: 800,
    color: "#172033",
  },
  subtitle: {
    margin: "8px 0 0",
    color: "#64748b",
    fontSize: "15px",
  },
  updatedAt: {
    color: "#64748b",
    fontSize: "14px",
  },
  metricGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    gap: "16px",
  },
  metricCard: {
    background: "#ffffff",
    border: "1px solid #dde6f2",
    borderRadius: "8px",
    padding: "22px",
    minHeight: "150px",
    display: "grid",
    alignContent: "space-between",
    gap: "18px",
  },
  metricTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "start",
    gap: "12px",
  },
  metricLabel: {
    color: "#64748b",
    fontSize: "15px",
    fontWeight: 700,
  },
  metricIcon: {
    width: "42px",
    height: "42px",
    borderRadius: "8px",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  metricValue: {
    display: "block",
    fontSize: "34px",
    fontWeight: 800,
    color: "#172033",
    lineHeight: 1.1,
    overflowWrap: "anywhere",
  },
  metricNote: {
    color: "#64748b",
    fontSize: "14px",
  },
  panelGrid: {
    display: "grid",
    gridTemplateColumns: "1.3fr 0.7fr",
    gap: "20px",
    alignItems: "stretch",
  },
  panel: {
    background: "#ffffff",
    border: "1px solid #dde6f2",
    borderRadius: "8px",
    padding: "22px",
  },
  panelTitle: {
    margin: "0 0 18px",
    fontSize: "20px",
    fontWeight: 800,
    color: "#172033",
  },
  bestSeller: {
    display: "grid",
    gridTemplateColumns: "76px 1fr",
    gap: "16px",
    alignItems: "center",
  },
  productImage: {
    width: "76px",
    height: "76px",
    borderRadius: "8px",
    objectFit: "cover",
    background: "#eef2f7",
    display: "grid",
    placeItems: "center",
    color: "#64748b",
    fontWeight: 800,
  },
  productName: {
    margin: "0 0 8px",
    color: "#172033",
    fontSize: "20px",
    fontWeight: 800,
  },
  productMeta: {
    color: "#64748b",
    fontSize: "15px",
    lineHeight: 1.6,
  },
  activityPanel: {
    display: "grid",
    gap: "12px",
  },
  activityRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    padding: "14px 0",
    borderBottom: "1px solid #edf2f8",
    color: "#475569",
  },
  errorText: {
    color: "#dc2626",
    fontSize: "14px",
  },
};

const adminStyles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "322px 1fr",
    background: "#eef0f4",
    color: "#3b404a",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: {
    height: "74px",
    background: "#ffffff",
    borderBottom: "1px solid #e5e7eb",
    padding: "0 26px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "20px",
  },
  search: {
    width: "100%",
    maxWidth: "480px",
    height: "54px",
    border: "1px solid #e1e5ed",
    borderRadius: "6px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 18px",
    boxSizing: "border-box",
    color: "#8a93a4",
    fontSize: "18px",
  },
  topActions: { display: "flex", alignItems: "center", gap: "24px", color: "#5e6675" },
  avatar: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #9aa4b5, #1f2937)",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontWeight: 800,
  },
  content: {
    padding: "34px 26px",
    display: "grid",
    gridTemplateColumns: "minmax(0, 1.8fr) minmax(360px, 1fr)",
    gap: "26px",
    alignItems: "start",
  },
  column: { display: "grid", gap: "26px" },
  card: {
    background: "#ffffff",
    borderRadius: "8px",
    border: "1px solid #e8ecf2",
    padding: "24px",
  },
  cardTitle: { margin: "0 0 26px", fontSize: "24px", color: "#3b404a", fontWeight: 800 },
  wideMetric: {
    minHeight: "150px",
    display: "grid",
    gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
    alignItems: "center",
    gap: "18px",
  },
  metricCell: {
    minHeight: "78px",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    borderRight: "1px solid #edf0f4",
  },
  metricCellLast: { borderRight: "none" },
  iconBox: {
    width: "48px",
    height: "48px",
    borderRadius: "6px",
    display: "grid",
    placeItems: "center",
    marginBottom: "12px",
    fontSize: "24px",
    fontWeight: 800,
  },
  value: { display: "block", color: "#687083", fontSize: "20px", fontWeight: 800 },
  label: { display: "block", color: "#3f3f46", fontSize: "16px", fontWeight: 650, marginTop: "5px" },
  tableHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    marginBottom: "10px",
  },
  seeAll: { border: "none", background: "transparent", color: "#2f63bd", fontWeight: 700, cursor: "pointer" },
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", padding: "14px 0", borderBottom: "1px solid #e6ebf2", color: "#6b7280", fontSize: "15px" },
  td: { padding: "18px 0", borderBottom: "1px solid #edf1f6", color: "#5b5f67", fontSize: "16px", fontWeight: 650 },
  low: { color: "#c2574d", fontWeight: 800 },
  chart: {
    height: "290px",
    border: "3px solid #4b9cff",
    background: "#ffffff",
    position: "relative",
    overflow: "hidden",
  },
  legend: { display: "flex", justifyContent: "center", gap: "28px", color: "#7c8798", marginTop: "14px" },
  legendDot: { width: "16px", height: "16px", borderRadius: "50%", display: "inline-block", marginRight: "8px", verticalAlign: "middle" },
  productList: { display: "grid", gap: "22px" },
  productRow: { display: "grid", gridTemplateColumns: "74px 1fr auto", gap: "18px", alignItems: "center" },
  productImage: { width: "74px", height: "74px", objectFit: "cover", borderRadius: "4px", background: "#ffffff" },
  productFallback: { width: "74px", height: "74px", borderRadius: "4px", background: "#ffffff", display: "grid", placeItems: "center", color: "#7c8798", fontWeight: 800 },
  productName: { margin: "0 0 8px", fontSize: "18px", color: "#3b404a", fontWeight: 800 },
  productMeta: { color: "#7c8798", fontSize: "16px" },
  statusBadge: { padding: "7px 14px", borderRadius: "999px", background: "#f5dedd", color: "#bf4d43", fontSize: "14px", fontWeight: 800 },
  veryLowBadge: { background: "#e9483b", color: "#1f2937" },
  error: { color: "#dc2626", fontSize: "14px" },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatUpdatedAt(value) {
  if (!value) {
    return "Waiting for sync";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Waiting for sync";
  }

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

function getInitials(value) {
  return (
    String(value || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("") || "P"
  );
}

function formatVndText(value) {
  return `${formatNumber(value)} vnd`;
}

function getTrendPoints(items, key, width, height, padding) {
  const maxValue = Math.max(
    1,
    ...items.flatMap((item) => [Number(item.sales || 0), Number(item.purchase || 0)])
  );
  const step = items.length > 1 ? (width - padding * 2) / (items.length - 1) : 0;

  return items
    .map((item, index) => {
      const x = padding + step * index;
      const y = height - padding - (Number(item[key] || 0) / maxValue) * (height - padding * 2);
      return `${x},${y}`;
    })
    .join(" ");
}

function StockStatusBadge({ status }) {
  const veryLow = String(status || "").toLowerCase().includes("very");

  return (
    <span style={{ ...adminStyles.statusBadge, ...(veryLow ? adminStyles.veryLowBadge : null) }}>
      {status || "Low"}
    </span>
  );
}

function AdminDashboard({ currentPage, currentUser, onNavigate, onLogout, summary, errorMessage }) {
  const trend = summary?.sales_purchase_trend?.length ? summary.sales_purchase_trend : [];
  const chartWidth = 460;
  const chartHeight = 270;
  const padding = 42;
  const salesPoints = getTrendPoints(trend, "sales", chartWidth, chartHeight, padding);
  const purchasePoints = getTrendPoints(trend, "purchase", chartWidth, chartHeight, padding);
  const lowStockProducts = summary?.low_stock_products || [];
  const topProducts = summary?.top_products || [];

  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .admin-dashboard-content {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 980px) {
            .admin-dashboard-page {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 720px) {
            .admin-wide-metric {
              grid-template-columns: 1fr 1fr !important;
            }
            .admin-dashboard-topbar {
              flex-direction: column;
              align-items: stretch !important;
              height: auto !important;
              padding: 16px !important;
            }
          }
        `}
      </style>

      <div className="admin-dashboard-page" style={adminStyles.page}>
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={adminStyles.main}>
          <header className="admin-dashboard-topbar" style={adminStyles.topbar}>
            <div style={adminStyles.search}>
              <span>Search product, supplier, order</span>
              <span>Q</span>
            </div>
            <div style={adminStyles.topActions}>
              <span>!</span>
              <RoleAvatar currentUser={currentUser} style={adminStyles.avatar} />
            </div>
          </header>

          <div className="admin-dashboard-content" style={adminStyles.content}>
            <section style={adminStyles.column}>
              {errorMessage ? <div style={adminStyles.error}>{errorMessage}</div> : null}

              <div style={adminStyles.card}>
                <h2 style={adminStyles.cardTitle}>Total Revenue</h2>
                <div className="admin-wide-metric" style={adminStyles.wideMetric}>
                  <div style={adminStyles.metricCell}>
                    <div style={{ ...adminStyles.iconBox, background: "#eee8ff", color: "#9185ff" }}>▥</div>
                    <span style={adminStyles.value}>{formatVndText(summary?.total_revenue)}</span>
                  </div>
                  <div style={adminStyles.metricCell} />
                  <div style={adminStyles.metricCell} />
                  <div style={{ ...adminStyles.metricCell, ...adminStyles.metricCellLast }} />
                </div>
              </div>

              <div style={adminStyles.card}>
                <h2 style={adminStyles.cardTitle}>Total Order <span style={{ color: "#6b7280", fontSize: "16px", marginLeft: "14px" }}>Purchase</span></h2>
                <div className="admin-wide-metric" style={adminStyles.wideMetric}>
                  <div style={adminStyles.metricCell}>
                    <div style={{ ...adminStyles.iconBox, background: "#e8f6ff", color: "#38a5e8" }}>▢</div>
                    <span style={adminStyles.value}>{formatNumber(summary?.purchase_orders)}</span>
                  </div>
                  <div style={adminStyles.metricCell} />
                  <div style={adminStyles.metricCell} />
                  <div style={{ ...adminStyles.metricCell, ...adminStyles.metricCellLast }} />
                </div>
              </div>

              <div style={adminStyles.card}>
                <h2 style={adminStyles.cardTitle}>Total Order <span style={{ color: "#6b7280", fontSize: "16px", marginLeft: "14px" }}>Sell</span></h2>
                <div className="admin-wide-metric" style={adminStyles.wideMetric}>
                  <div style={adminStyles.metricCell}>
                    <div style={{ ...adminStyles.iconBox, background: "#e8f6ff", color: "#38a5e8" }}>▢</div>
                    <span style={adminStyles.value}>{formatNumber(summary?.sales_orders)}</span>
                  </div>
                  <div style={adminStyles.metricCell} />
                  <div style={adminStyles.metricCell} />
                  <div style={{ ...adminStyles.metricCell, ...adminStyles.metricCellLast }} />
                </div>
              </div>

              <div style={adminStyles.card}>
                <div style={adminStyles.tableHeader}>
                  <h2 style={{ ...adminStyles.cardTitle, margin: 0 }}>Low Stock Products</h2>
                  <button type="button" style={adminStyles.seeAll} onClick={() => onNavigate("inventory")}>See All</button>
                </div>
                <table style={adminStyles.table}>
                  <thead>
                    <tr>
                      <th style={adminStyles.th}>Product name</th>
                      <th style={adminStyles.th}>Remaining Stock</th>
                      <th style={adminStyles.th}>Status</th>
                      <th style={adminStyles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lowStockProducts.map((product) => (
                      <tr key={product.product_id}>
                        <td style={adminStyles.td}>{product.product_name}</td>
                        <td style={adminStyles.td}>{formatNumber(product.remaining_stock)}</td>
                        <td style={{ ...adminStyles.td, ...adminStyles.low }}>{product.status}</td>
                        <td style={adminStyles.td}>Reorder</td>
                      </tr>
                    ))}
                    {!lowStockProducts.length ? (
                      <tr>
                        <td style={adminStyles.td} colSpan={4}>No low stock products.</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            </section>

            <aside style={adminStyles.column}>
              <div style={adminStyles.card}>
                <h2 style={adminStyles.cardTitle}>Inventory Summary</h2>
                <div style={{ ...adminStyles.wideMetric, gridTemplateColumns: "1fr 1fr" }}>
                  <div style={adminStyles.metricCell}>
                    <div style={{ ...adminStyles.iconBox, background: "#fff2df", color: "#e7a85c" }}>▤</div>
                    <span style={adminStyles.value}>{formatNumber(summary?.warehouse_count)}</span>
                    <span style={adminStyles.label}>Warehouse</span>
                  </div>
                  <div style={{ ...adminStyles.metricCell, ...adminStyles.metricCellLast }}>
                    <div style={{ ...adminStyles.iconBox, background: "#eee8ff", color: "#9185ff" }}>◎</div>
                    <span style={adminStyles.value}>{formatNumber(summary?.inventory_items)}</span>
                    <span style={adminStyles.label}>Inventory Items</span>
                  </div>
                </div>
              </div>

              <div style={adminStyles.card}>
                <h2 style={adminStyles.cardTitle}>Product Summary</h2>
                <div style={{ ...adminStyles.wideMetric, gridTemplateColumns: "1fr 1fr" }}>
                  <div style={adminStyles.metricCell}>
                    <div style={{ ...adminStyles.iconBox, background: "#e8f6ff", color: "#38a5e8" }}>◎</div>
                    <span style={adminStyles.value}>{formatNumber(summary?.total_products)}</span>
                    <span style={adminStyles.label}>Total Products</span>
                  </div>
                  <div style={{ ...adminStyles.metricCell, ...adminStyles.metricCellLast }} />
                </div>
              </div>

              <div style={adminStyles.card}>
                <h2 style={adminStyles.cardTitle}>Sales vs Purchase Trend</h2>
                <div style={adminStyles.chart}>
                  <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} width="100%" height="100%" preserveAspectRatio="none">
                    {[0.25, 0.5, 0.75].map((ratio) => (
                      <line key={ratio} x1={padding} x2={chartWidth - padding} y1={chartHeight * ratio} y2={chartHeight * ratio} stroke="#d8dde6" strokeWidth="1" />
                    ))}
                    <polyline points={salesPoints} fill="none" stroke="#dea95d" strokeWidth="3" />
                    <polyline points={purchasePoints} fill="none" stroke="#b8d2ff" strokeWidth="3" />
                    {trend.map((item, index) => {
                      const step = trend.length > 1 ? (chartWidth - padding * 2) / (trend.length - 1) : 0;
                      return (
                        <text key={item.label} x={padding + step * index} y={chartHeight - 10} fill="#8b95a6" fontSize="13" textAnchor="middle">
                          {item.label}
                        </text>
                      );
                    })}
                  </svg>
                </div>
                <div style={adminStyles.legend}>
                  <span><span style={{ ...adminStyles.legendDot, background: "#dea95d" }} />Sales</span>
                  <span><span style={{ ...adminStyles.legendDot, background: "#b8d2ff" }} />Purchase</span>
                </div>
              </div>

              <div>
                <h2 style={adminStyles.cardTitle}>Top Selling Products</h2>
                <div style={adminStyles.productList}>
                  {topProducts.map((product) => (
                    <div key={product.product_id} style={adminStyles.productRow}>
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.product_name} style={adminStyles.productImage} />
                      ) : (
                        <div style={adminStyles.productFallback}>{getInitials(product.product_name)}</div>
                      )}
                      <div>
                        <h3 style={adminStyles.productName}>{product.product_name}</h3>
                        <div style={adminStyles.productMeta}>Remaining Quantity : {formatNumber(product.remaining_stock)} Packet</div>
                      </div>
                      <StockStatusBadge status={product.status} />
                    </div>
                  ))}
                  {!topProducts.length ? <div style={adminStyles.productMeta}>No selling products yet.</div> : null}
                </div>
              </div>
            </aside>
          </div>
        </main>
      </div>
    </>
  );
}

function Dashboard({ currentPage = "dashboard", currentUser = null, onNavigate = () => {}, onLogout = () => {} }) {
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function loadSummary() {
      try {
        const data = await getDashboardSummary();

        if (isMounted) {
          setSummary(data);
          setErrorMessage("");
          setIsLoading(false);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to fetch dashboard summary");
          setIsLoading(false);
        }
      }
    }

    loadSummary();
    const intervalId = window.setInterval(loadSummary, REFRESH_INTERVAL_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const cards = useMemo(
    () => [
      {
        label: "Revenue Today",
        value: formatCurrency(summary?.today_revenue),
        note: "Sales orders created today",
        icon: "VND",
        iconStyle: { background: "#ecfdf3", color: "#15803d" },
      },
      {
        label: "Orders Today",
        value: formatNumber(summary?.today_orders),
        note: "Realtime from order records",
        icon: "#",
        iconStyle: { background: "#eff6ff", color: "#2563eb" },
      },
      {
        label: "Low Stock",
        value: formatNumber(summary?.low_stock_count),
        note: "Products with stock <= 20",
        icon: "!",
        iconStyle: { background: "#fff7ed", color: "#c2410c" },
      },
      {
        label: "Best Seller",
        value: summary?.best_seller ? formatNumber(summary.best_seller.sold_quantity) : "0",
        note: summary?.best_seller?.product_name || "No sales orders yet",
        icon: "*",
        iconStyle: { background: "#fef2f2", color: "#dc2626" },
      },
    ],
    [summary]
  );

  const bestSeller = summary?.best_seller;

  if (isAdmin(currentUser)) {
    return (
      <AdminDashboard
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={onNavigate}
        onLogout={onLogout}
        summary={summary}
        errorMessage={errorMessage}
      />
    );
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 1100px) {
            .dashboard-metric-grid,
            .dashboard-panel-grid {
              grid-template-columns: 1fr 1fr !important;
            }
          }

          @media (max-width: 980px) {
            .dashboard-page {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 720px) {
            .dashboard-topbar,
            .dashboard-header {
              flex-direction: column;
              align-items: stretch !important;
            }

            .dashboard-search {
              max-width: none !important;
            }

            .dashboard-metric-grid,
            .dashboard-panel-grid {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div className="dashboard-page" style={styles.page}>
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header className="dashboard-topbar" style={styles.topbar}>
            <div className="dashboard-search" style={styles.searchBox}>
              <span>Search product, supplier, order</span>
              <span>Q</span>
            </div>

            <div style={styles.topActions}>
              <div style={styles.livePill}>
                <span style={styles.liveDot} />
                <span>Live</span>
              </div>
              <RoleAvatar currentUser={currentUser} style={styles.avatar} />
            </div>
          </header>

          <div style={styles.content}>
            <div className="dashboard-header" style={styles.headerRow}>
              <div>
                <h1 style={styles.title}>Dashboard</h1>
                <p style={styles.subtitle}>Daily sales, order, product, and inventory metrics from backend data.</p>
              </div>
              <div style={styles.updatedAt}>
                {isLoading ? "Loading..." : `Last sync: ${formatUpdatedAt(summary?.updated_at)}`}
              </div>
            </div>

            {errorMessage ? <div style={styles.errorText}>{errorMessage}</div> : null}

            <section className="dashboard-metric-grid" style={styles.metricGrid}>
              {cards.map((item) => (
                <div key={item.label} style={styles.metricCard}>
                  <div style={styles.metricTop}>
                    <span style={styles.metricLabel}>{item.label}</span>
                    <span style={{ ...styles.metricIcon, ...item.iconStyle }}>{item.icon}</span>
                  </div>
                  <div>
                    <span style={styles.metricValue}>{item.value}</span>
                    <div style={styles.metricNote}>{item.note}</div>
                  </div>
                </div>
              ))}
            </section>

            <div className="dashboard-panel-grid" style={styles.panelGrid}>
              <section style={styles.panel}>
                <h2 style={styles.panelTitle}>Best Seller</h2>
                {bestSeller ? (
                  <div style={styles.bestSeller}>
                    {bestSeller.image_url ? (
                      <img src={bestSeller.image_url} alt={bestSeller.product_name} style={styles.productImage} />
                    ) : (
                      <div style={styles.productImage}>{getInitials(bestSeller.product_name)}</div>
                    )}
                    <div>
                      <h3 style={styles.productName}>{bestSeller.product_name}</h3>
                      <div style={styles.productMeta}>
                        <div>Category: {bestSeller.category || "Uncategorized"}</div>
                        <div>Sold: {formatNumber(bestSeller.sold_quantity)} units</div>
                        <div>Revenue: {formatCurrency(bestSeller.revenue)}</div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={styles.productMeta}>No sales order has been created yet.</div>
                )}
              </section>

              <section style={styles.panel}>
                <h2 style={styles.panelTitle}>Realtime Source</h2>
                <div style={styles.activityPanel}>
                  <div style={styles.activityRow}>
                    <span>Products</span>
                    <strong>Inventory stock status</strong>
                  </div>
                  <div style={styles.activityRow}>
                    <span>Orders</span>
                    <strong>Revenue and count today</strong>
                  </div>
                  <div style={styles.activityRow}>
                    <span>Inventory</span>
                    <strong>Low stock threshold</strong>
                  </div>
                  <div style={{ ...styles.metricNote, paddingTop: "4px" }}>
                    Auto refreshes every {REFRESH_INTERVAL_MS / 1000} seconds.
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default Dashboard;
