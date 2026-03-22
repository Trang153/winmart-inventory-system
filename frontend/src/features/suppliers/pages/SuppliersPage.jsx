import React, { useEffect, useState } from "react";
import { appRoutes } from "../../../app/routes";
import { getSuppliers } from "../../../services/supplier/supplierService";

const navItems = [
  { page: "dashboard", label: "Dashboard", icon: "⌂" },
  { page: "suppliers", label: "Suppliers", icon: "◎" },
  { page: "products", label: "Products", icon: "▥" },
  { page: "inventory", label: "Inventory", icon: "◉" },
  { page: "orders", label: "Orders", icon: "▤" },
  { page: "reports", label: "Reports", icon: "▥" },
  { page: "rating", label: "Rating", icon: "↑" },
];

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "274px 1fr",
    background: "#eef2f7",
    color: "#3f4a5e",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e4ebf2",
    display: "flex",
    flexDirection: "column",
    padding: "28px 18px 22px",
  },
  brand: {
    margin: "12px 14px 64px",
    color: "#e2382c",
    fontSize: "56px",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-2px",
  },
  nav: {
    display: "grid",
    gap: "12px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    width: "100%",
    border: "none",
    background: "transparent",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#5a6780",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "left",
  },
  navItemActive: {
    color: "#ef4335",
    background: "#fff0ee",
    fontWeight: 600,
  },
  navFooter: {
    marginTop: "auto",
    display: "grid",
    gap: "12px",
  },
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    height: "100px",
    background: "#ffffff",
    borderBottom: "1px solid #e4ebf2",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 34px",
    gap: "20px",
  },
  search: {
    width: "320px",
    height: "44px",
    border: "1px solid #dde5ef",
    borderRadius: "8px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#95a3b8",
    padding: "0 16px",
    boxSizing: "border-box",
    fontSize: "15px",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "22px",
  },
  bell: {
    color: "#71809a",
    fontSize: "22px",
  },
  avatar: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f2d6c3, #6f4120)",
  },
  content: {
    padding: "16px 14px 22px",
  },
  card: {
    background: "#ffffff",
    borderRadius: "12px",
    border: "1px solid #e2e9f2",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "14px 18px 10px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "22px",
    color: "#2f3747",
    fontWeight: 500,
  },
  actions: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
  },
  primaryButton: {
    height: "40px",
    padding: "0 16px",
    border: "none",
    borderRadius: "4px",
    background: "#e5392d",
    color: "#ffffff",
    fontSize: "15px",
    cursor: "pointer",
  },
  secondaryButton: {
    height: "40px",
    padding: "0 16px",
    borderRadius: "4px",
    border: "1px solid #d7dfe9",
    background: "#ffffff",
    color: "#607089",
    fontSize: "15px",
    cursor: "pointer",
  },
  tableWrap: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    minWidth: "980px",
  },
  th: {
    textAlign: "left",
    padding: "8px 18px 10px",
    color: "#6c7890",
    fontSize: "15px",
    fontWeight: 500,
    borderBottom: "1px solid #edf2f7",
  },
  td: {
    padding: "12px 18px",
    borderBottom: "1px solid #f0f4f8",
    fontSize: "14px",
    color: "#465268",
    verticalAlign: "middle",
  },
  contactLink: {
    color: "#465268",
    textDecoration: "underline",
  },
  actionLink: {
    color: "#465268",
    background: "transparent",
    border: "none",
    padding: 0,
    fontSize: "14px",
    cursor: "pointer",
  },
  footer: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "18px 16px 12px",
  },
  pagerButton: {
    justifySelf: "start",
    height: "38px",
    minWidth: "92px",
    padding: "0 16px",
    borderRadius: "4px",
    border: "1px solid #d7dfe9",
    background: "#ffffff",
    color: "#4b586c",
    fontSize: "15px",
    cursor: "pointer",
  },
  pagerButtonRight: {
    justifySelf: "end",
  },
  pageText: {
    color: "#5f6e84",
    fontSize: "15px",
  },
  green: {
    color: "#22a958",
    fontWeight: 500,
  },
  red: {
    color: "#ef4335",
    fontWeight: 500,
  },
  imageThumb: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    objectFit: "cover",
    border: "1px solid #d7dfe9",
    background: "#f8fafc",
  },
  imagePlaceholder: {
    width: "42px",
    height: "42px",
    borderRadius: "10px",
    border: "1px dashed #d7dfe9",
    display: "grid",
    placeItems: "center",
    color: "#94a3b8",
    background: "#f8fafc",
    fontSize: "12px",
  },
  infoText: {
    padding: "24px 18px",
    color: "#607089",
    fontSize: "14px",
  },
};

function Sidebar({ currentPage, onNavigate, onLogout }) {
  return (
    <aside style={styles.sidebar}>
      <div style={styles.brand}>WinMart</div>

      <nav style={styles.nav}>
        {navItems.map((item) => (
          <button
            key={item.page}
            type="button"
            onClick={() => onNavigate(item.page)}
            style={{
              ...styles.navItem,
              ...(currentPage === item.page ? styles.navItemActive : null),
            }}
          >
            <span style={{ width: "28px", textAlign: "center", fontSize: "23px" }}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={styles.navFooter}>
        <button type="button" onClick={() => onNavigate("settings")} style={styles.navItem}>
          <span style={{ width: "28px", textAlign: "center", fontSize: "23px" }}>⚙</span>
          <span>Settings</span>
        </button>
        <button type="button" style={{ ...styles.navItem, color: "#ef4335" }} onClick={onLogout}>
          <span style={{ width: "28px", textAlign: "center", fontSize: "23px" }}>⇥</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

function Supplier({ currentPage = "suppliers", onNavigate = () => {}, onLogout = () => {} }) {
  const [supplierRows, setSupplierRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const suppliers = await getSuppliers();

        if (isMounted) {
          setSupplierRows(suppliers);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load suppliers");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div style={styles.page}>
      <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />

      <main style={styles.main}>
        <header style={styles.topbar}>
          <div style={styles.search}>
            <span style={{ fontSize: "24px", lineHeight: 1 }}>○</span>
            <span>Search product, supplier, order</span>
          </div>

          <div style={styles.topbarRight}>
            <span style={styles.bell}>◔</span>
            <div style={styles.avatar} />
          </div>
        </header>

        <div style={styles.content}>
          <section style={styles.card}>
            <div style={styles.cardHeader}>
              <h1 style={styles.title}>Supplier</h1>

              <div style={styles.actions}>
                <button type="button" style={styles.primaryButton} onClick={() => onNavigate(appRoutes.addSupplier)}>
                  New Supplier
                </button>
                <button type="button" style={styles.secondaryButton}>
                  ⌁ Filters
                </button>
                <button type="button" style={styles.secondaryButton}>
                  Download all
                </button>
              </div>
            </div>

            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Supplier ID</th>
                    <th style={styles.th}>Image</th>
                    <th style={styles.th}>Supplier Name</th>
                    <th style={styles.th}>Category</th>
                    <th style={styles.th}>Contact</th>
                    <th style={styles.th}>Total order value</th>
                    <th style={styles.th}>Created date</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td style={styles.infoText} colSpan={8}>
                        Loading suppliers...
                      </td>
                    </tr>
                  ) : null}
                  {!isLoading && errorMessage ? (
                    <tr>
                      <td style={{ ...styles.infoText, color: "#ef4335" }} colSpan={8}>
                        {errorMessage}
                      </td>
                    </tr>
                  ) : null}
                  {!isLoading && !errorMessage && supplierRows.length === 0 ? (
                    <tr>
                      <td style={styles.infoText} colSpan={8}>
                        No suppliers found.
                      </td>
                    </tr>
                  ) : null}
                  {!isLoading && !errorMessage && supplierRows.map((supplier) => (
                    <tr key={supplier.supplier_id}>
                      <td style={styles.td}>{supplier.supplier_id}</td>
                      <td style={styles.td}>
                        {supplier.image_url ? (
                          <img src={supplier.image_url} alt={supplier.supplier_name} style={styles.imageThumb} />
                        ) : (
                          <div style={styles.imagePlaceholder}>No img</div>
                        )}
                      </td>
                      <td style={styles.td}>{supplier.supplier_name}</td>
                      <td style={styles.td}>{supplier.category}</td>
                      <td style={styles.td}>
                        <span style={supplier.contact_info ? styles.contactLink : null}>
                          {supplier.contact_info || "-"}
                        </span>
                      </td>
                      <td style={styles.td}>
                        {new Intl.NumberFormat("vi-VN").format(supplier.total_order_value || 0)}
                      </td>
                      <td style={styles.td}>
                        {supplier.created_at
                          ? new Date(supplier.created_at).toLocaleDateString("vi-VN")
                          : "-"}
                      </td>
                      <td style={styles.td}>
                        <button
                          type="button"
                          style={styles.actionLink}
                          onClick={() => onNavigate(`${appRoutes.addSupplier}?id=${supplier.supplier_id}`)}
                        >
                          View / Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={styles.footer}>
              <button type="button" style={styles.pagerButton}>
                Previous
              </button>
              <div style={styles.pageText}>Page 1 of 10</div>
              <button type="button" style={{ ...styles.pagerButton, ...styles.pagerButtonRight }}>
                Next
              </button>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Supplier;
