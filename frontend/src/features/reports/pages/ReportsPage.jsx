import React, { useEffect, useMemo, useState } from "react";
import { exportOrderReport, getOrderReport } from "../../../services/order/orderService";
import AppSidebar from "../../../components/AppSidebar";
import RoleAvatar from "../../../components/RoleAvatar";
import { getRoleName } from "../../../auth/rbac";

const navItems = [
  { label: "Dashboard", icon: "#", page: "dashboard" },
  { label: "Suppliers", icon: "O", page: "suppliers" },
  { label: "Products", icon: "[]", page: "products" },
  { label: "Inventory", icon: "[]", page: "inventory" },
  { label: "Orders", icon: "U", page: "orders" },
  { label: "Reports", icon: "|", page: "reports" },
];

const summaryCards = [
  { title: "Total Revenue", value: "0 VND", note: "Live from backend", icon: "VND", tone: "green" },
  { title: "Total Orders", value: "0", note: "Live from backend", icon: "[]", tone: "green" },
  { title: "Inventory Value", value: "0 VND", note: "Live from backend", icon: "O", tone: "green" },
  { title: "Low Stock Alerts", value: "0", note: "Live from backend", icon: "!", tone: "red" },
];

const monthlyRevenue = Array.from({ length: 12 }, () => 0);
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

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
  statusText: { color: "#71829d", fontSize: "14px", marginTop: "6px" },
  errorText: { color: "#ef4335", fontSize: "14px", fontWeight: 600, marginTop: "6px" },
  emptyText: { color: "#71829d", fontSize: "14px", padding: "14px 0" },
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

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function Reports({ currentPage = "reports", currentUser = null, onNavigate = () => {}, onLogout = () => {} }) {
  const [report, setReport] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [exportingFormat, setExportingFormat] = useState("");
  const roleName = getRoleName(currentUser).toLowerCase();
  const isStaff = roleName === "staff";

  useEffect(() => {
    let isMounted = true;

    async function loadReport() {
      try {
        const data = await getOrderReport();

        if (isMounted) {
          setReport(data);
          setErrorMessage("");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load report");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadReport();
    const intervalId = window.setInterval(loadReport, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, []);

  const displaySummaryCards = useMemo(() => {
    if (!report) {
      return summaryCards;
    }

    return [
      { ...summaryCards[0], value: formatCurrency(report.summary?.total_revenue) },
      { ...summaryCards[1], value: String(report.summary?.total_orders || 0) },
      { ...summaryCards[2], value: formatCurrency(report.summary?.inventory_value) },
      { ...summaryCards[3], value: String(report.summary?.low_stock_count || 0) },
    ];
  }, [report]);
  const displayMonthlyRevenue = report?.monthly_revenue?.length ? report.monthly_revenue : monthlyRevenue;
  const maxMonthlyRevenue = Math.max(...displayMonthlyRevenue, 1);
  const displayTopProducts = report?.top_products?.length
    ? report.top_products.map((item) => ({
        name: item.name,
        sold: new Intl.NumberFormat("en-US").format(item.sold),
        revenue: formatCurrency(item.revenue),
      }))
    : [];
  const displayInventoryReport = report?.inventory_by_category?.length
    ? report.inventory_by_category.map((item) => ({
        category: item.category,
        value: formatCurrency(item.value),
        items: new Intl.NumberFormat("en-US").format(item.items),
        status: item.status,
      }))
    : [];
  const displaySalesReport = report?.sales_report?.length
    ? report.sales_report.map((item) => ({
        channel: item.channel,
        orders: new Intl.NumberFormat("en-US").format(item.orders),
        revenue: formatCurrency(item.revenue),
      }))
    : [];
  const updatedAt = report?.updated_at
    ? new Date(report.updated_at).toLocaleString("en-US")
    : "";

  async function handleExport(format) {
    try {
      setExportingFormat(format);
      setErrorMessage("");

      const { blob, filename } = await exportOrderReport(format);
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      setErrorMessage(error.message || "Failed to export report");
    } finally {
      setExportingFormat("");
    }
  }

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
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header className="reports-topbar" style={styles.topbar}>
            <div className="reports-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search reports, metrics, products...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <RoleAvatar currentUser={currentUser} style={styles.avatar} />
            </div>
          </header>

          <div style={styles.content}>
            <div className="reports-header" style={styles.headerRow}>
              <div>
                <h1 style={styles.title}>Reports & Analytics</h1>
                <div style={styles.statusText}>
                  {isStaff ? "Staff report" : "Admin report"}
                  {updatedAt ? ` - Updated ${updatedAt}` : ""}
                  {isLoading ? " - Loading..." : ""}
                </div>
                {errorMessage ? <div style={styles.errorText}>{errorMessage}</div> : null}
              </div>

              <div style={styles.headerActions}>
                <button type="button" style={styles.secondaryButton} onClick={() => handleExport("excel")} disabled={Boolean(exportingFormat)}>
                  <span>[]</span>
                  <span>{exportingFormat === "excel" ? "Exporting..." : "Export Excel"}</span>
                </button>
                <button type="button" style={styles.secondaryButton} onClick={() => handleExport("pdf")} disabled={Boolean(exportingFormat)}>
                  <span>[]</span>
                  <span>{exportingFormat === "pdf" ? "Exporting..." : "Export PDF"}</span>
                </button>
              </div>
            </div>

            <div className="reports-cards" style={styles.cardsGrid}>
              {displaySummaryCards.map((card) => {
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
                    {displayMonthlyRevenue.map((value, index) => (
                      <span key={`top-${months[index]}`}>{formatCurrency(value)}</span>
                    ))}
                  </div>

                  <div style={styles.grid}>
                    {Array.from({ length: 5 }).map((_, index) => (
                      <div key={index} style={styles.gridLine} />
                    ))}
                  </div>

                  <div style={styles.bars}>
                    {displayMonthlyRevenue.map((value, index) => (
                      <div key={months[index]} style={styles.barItem}>
                        <div style={{ ...styles.bar, height: `${(Number(value || 0) / maxMonthlyRevenue) * 100}%` }} />
                        <span style={styles.month}>{months[index]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <div className="reports-three-cols" style={styles.threeCols}>
              <section style={styles.miniCard}>
                <div style={styles.miniHeader}>Top Selling Products</div>
                <div style={styles.miniBody}>
                  {displayTopProducts.map((item) => (
                    <div key={item.name} style={styles.listItem}>
                      <span style={styles.primaryText}>{item.name}</span>
                      <span style={styles.secondaryText}>
                        Sold: {item.sold} - Revenue: {item.revenue}
                      </span>
                    </div>
                  ))}
                  {!displayTopProducts.length ? <div style={styles.emptyText}>No sales data found.</div> : null}
                </div>
              </section>

              <section style={styles.miniCard}>
                <div style={styles.miniHeader}>Inventory Report</div>
                <div style={styles.miniBody}>
                  {displayInventoryReport.map((item) => (
                    <div key={item.category} style={styles.row}>
                      <div>
                        <div style={styles.primaryText}>{item.category}</div>
                        <div style={styles.secondaryText}>
                          {item.items} products - {item.value}
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
                  {!displayInventoryReport.length ? <div style={styles.emptyText}>No inventory data found.</div> : null}
                </div>
              </section>

              <section style={styles.miniCard}>
                <div style={styles.miniHeader}>Sales Report</div>
                <div style={styles.miniBody}>
                  {displaySalesReport.map((item) => (
                    <div key={item.channel} style={styles.row}>
                      <div>
                        <div style={styles.primaryText}>{item.channel}</div>
                        <div style={styles.secondaryText}>
                          {item.orders} orders - {item.revenue}
                        </div>
                      </div>
                      <span style={styles.trend}>Live</span>
                    </div>
                  ))}
                  {!displaySalesReport.length ? <div style={styles.emptyText}>No order status data found.</div> : null}
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
