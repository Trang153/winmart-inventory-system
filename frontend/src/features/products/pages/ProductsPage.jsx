import React, { useEffect, useState } from "react";
import { appRoutes } from "../../../app/routes";
import { getProducts } from "../../../services/product/productService";

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
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "322px 1fr",
    background: "#f4f7fb",
    color: "#1f2937",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #dde6f2",
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
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    background: "#ffffff",
    borderBottom: "1px solid #dde6f2",
    padding: "20px 38px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
  },
  search: {
    width: "100%",
    maxWidth: "480px",
    height: "48px",
    border: "1px solid #d7e1ed",
    borderRadius: "10px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 16px",
    boxSizing: "border-box",
    color: "#94a3b8",
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
    flexWrap: "wrap",
  },
  titleWrap: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "44px",
    fontWeight: 800,
    color: "#16213a",
  },
  totalBadge: {
    padding: "8px 14px",
    borderRadius: "16px",
    border: "1px solid #d8e1ec",
    color: "#6b7a92",
    fontSize: "18px",
    fontWeight: 600,
    background: "#ffffff",
  },
  headerActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    height: "48px",
    padding: "0 18px",
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
    fontSize: "17px",
    fontWeight: 700,
    display: "flex",
    alignItems: "center",
    gap: "10px",
    cursor: "pointer",
  },
  filterRow: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  selectBox: {
    minWidth: "225px",
    height: "52px",
    borderRadius: "10px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    padding: "0 16px",
    fontSize: "16px",
    color: "#1f2937",
  },
  iconSquare: {
    marginLeft: "auto",
    width: "40px",
    height: "40px",
    borderRadius: "10px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    display: "grid",
    placeItems: "center",
    color: "#334155",
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
    minWidth: "1280px",
    borderCollapse: "collapse",
  },
  headCell: {
    padding: "20px 18px",
    textAlign: "left",
    fontSize: "16px",
    fontWeight: 700,
    color: "#71829d",
    borderBottom: "1px solid #dde6f2",
    letterSpacing: "0.4px",
  },
  bodyCell: {
    padding: "20px 18px",
    borderBottom: "1px solid #e8eef5",
    fontSize: "17px",
    color: "#1f2937",
    verticalAlign: "middle",
  },
  checkbox: {
    width: "22px",
    height: "22px",
    borderRadius: "4px",
    border: "1px solid #a8b4c7",
    background: "#ffffff",
    display: "inline-block",
    boxSizing: "border-box",
  },
  productCell: {
    display: "grid",
    gridTemplateColumns: "56px 1fr",
    gap: "16px",
    alignItems: "center",
  },
  productThumb: {
    width: "54px",
    height: "54px",
    borderRadius: "10px",
    background: "linear-gradient(135deg, #2a3446, #8b5e34)",
    color: "#ffffff",
    display: "grid",
    placeItems: "center",
    fontSize: "14px",
    fontWeight: 700,
    objectFit: "cover",
  },
  productName: {
    fontSize: "18px",
    fontWeight: 600,
    color: "#1f2937",
    marginBottom: "6px",
  },
  productSku: {
    fontSize: "15px",
    color: "#71829d",
    lineHeight: 1.45,
  },
  supplierLink: {
    color: "#2f7dd9",
    fontWeight: 600,
  },
  statusActive: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "16px",
    background: "#dbf7e3",
    color: "#28a85a",
    fontWeight: 600,
    fontSize: "16px",
  },
  statusLow: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "16px",
    background: "#fff0c7",
    color: "#b97712",
    fontWeight: 600,
    fontSize: "16px",
  },
  statusOut: {
    display: "inline-block",
    padding: "8px 16px",
    borderRadius: "16px",
    background: "#fde4e0",
    color: "#ef4335",
    fontWeight: 600,
    fontSize: "16px",
  },
  actionsCell: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#64748b",
    fontSize: "20px",
  },
  actionButton: {
    border: "none",
    background: "transparent",
    color: "#64748b",
    cursor: "pointer",
    fontSize: "15px",
    padding: 0,
  },
  errorText: {
    padding: "18px 28px 0",
    color: "#ef4335",
    fontSize: "14px",
  },
  emptyText: {
    padding: "28px",
    color: "#6b7a92",
    fontSize: "16px",
    textAlign: "center",
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
};

function getStatusStyle(tone) {
  if (tone === "low") return styles.statusLow;
  if (tone === "out") return styles.statusOut;
  return styles.statusActive;
}

function formatPrice(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(Number(value || 0));
}

function getProductTone(priceStock) {
  const normalized = String(priceStock || "").toLowerCase();

  if (normalized.includes("low")) return "low";
  if (normalized.includes("out") || normalized.includes("hidden")) return "out";
  return "active";
}

function getStatusLabel(priceStock) {
  const normalized = String(priceStock || "").toLowerCase();

  if (normalized.includes("low")) return "Low Stock";
  if (normalized.includes("out") || normalized.includes("hidden")) return "Out of Stock";
  return "Active";
}

function getProductInitials(productName) {
  return (
    String(productName || "")
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0]?.toUpperCase() || "")
      .join("") || "PR"
  );
}

function Product({ currentPage = "products", onNavigate = () => {}, onLogout = () => {} }) {
  const [products, setProducts] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        const data = await getProducts();

        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        if (isMounted) {
          setProducts([]);
          setErrorMessage(error.message || "Failed to fetch products");
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <style>
        {`
          @media (max-width: 1080px) {
            .product-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 820px) {
            .product-topbar,
            .product-header,
            .product-footer {
              flex-direction: column;
              align-items: stretch;
            }

            .product-search {
              max-width: none;
            }

            .product-filter-row {
              align-items: stretch;
            }

            .product-filter-row select {
              min-width: 0 !important;
              width: 100%;
            }

            .product-icon-square {
              margin-left: 0;
            }
          }
        `}
      </style>

      <div className="product-page" style={styles.page}>
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
            <button type="button" style={{ ...styles.navItem, color: "#ef4335" }} onClick={onLogout}>
              <span style={styles.navIcon}>-</span>
              <span>Log Out</span>
            </button>
          </div>
        </aside>

        <main style={styles.main}>
          <header className="product-topbar" style={styles.topbar}>
            <div className="product-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search products, SKU...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <div style={styles.avatar}>A</div>
            </div>
          </header>

          <div style={styles.content}>
            <div className="product-header" style={styles.headerRow}>
              <div style={styles.titleWrap}>
                <h1 style={styles.title}>Products</h1>
                <span style={styles.totalBadge}>{products.length} Total</span>
              </div>

              <div style={styles.headerActions}>
                <button type="button" style={styles.secondaryButton}>
                  <span>T</span>
                  <span>Export</span>
                </button>
                <button type="button" style={styles.primaryButton} onClick={() => onNavigate(appRoutes.addProduct)}>
                  <span>+</span>
                  <span>Add Product</span>
                </button>
              </div>
            </div>

            <div className="product-filter-row" style={styles.filterRow}>
              <select style={styles.selectBox} defaultValue="all-categories">
                <option value="all-categories">All Categories</option>
              </select>
              <select style={styles.selectBox} defaultValue="all-suppliers">
                <option value="all-suppliers">All Suppliers</option>
              </select>
              <select style={styles.selectBox} defaultValue="status-all">
                <option value="status-all">Status: All</option>
              </select>
              <div className="product-icon-square" style={styles.iconSquare}>
                =#
              </div>
            </div>

            <section style={styles.tableCard}>
              {errorMessage ? <div style={styles.errorText}>{errorMessage}</div> : null}

              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.headCell}>
                        <span style={styles.checkbox} />
                      </th>
                      <th style={styles.headCell}>PRODUCT</th>
                      <th style={styles.headCell}>CATEGORY</th>
                      <th style={styles.headCell}>SUPPLIER</th>
                      <th style={styles.headCell}>PURCHASE PRICE</th>
                      <th style={styles.headCell}>SELLING PRICE</th>
                      <th style={styles.headCell}>STOCK</th>
                      <th style={styles.headCell}>STATUS</th>
                      <th style={styles.headCell}>ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const tone = getProductTone(product.price_stock);

                      return (
                        <tr key={product.product_id}>
                          <td style={styles.bodyCell}>
                            <span style={styles.checkbox} />
                          </td>
                          <td style={styles.bodyCell}>
                            <div style={styles.productCell}>
                              {product.image_url ? (
                                <img src={product.image_url} alt={product.product_name} style={styles.productThumb} />
                              ) : (
                                <div style={styles.productThumb}>{getProductInitials(product.product_name)}</div>
                              )}
                              <div>
                                <div style={styles.productName}>{product.product_name}</div>
                                <div style={styles.productSku}>Product ID: {product.product_id}</div>
                              </div>
                            </div>
                          </td>
                          <td style={styles.bodyCell}>{product.category || "-"}</td>
                          <td style={{ ...styles.bodyCell, ...styles.supplierLink }}>{product.supplier_name || "-"}</td>
                          <td style={styles.bodyCell}>{formatPrice(product.price)}</td>
                          <td style={styles.bodyCell}>{formatPrice(product.price)}</td>
                          <td style={styles.bodyCell}>{product.price_stock || "-"}</td>
                          <td style={styles.bodyCell}>
                            <span style={getStatusStyle(tone)}>{getStatusLabel(product.price_stock)}</span>
                          </td>
                          <td style={styles.bodyCell}>
                            <div style={styles.actionsCell}>
                              <button
                                type="button"
                                style={styles.actionButton}
                                onClick={() => onNavigate(`${appRoutes.addProduct}?id=${product.product_id}`)}
                              >
                                View / Edit
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!products.length ? <div style={styles.emptyText}>No products found.</div> : null}

              <div className="product-footer" style={styles.tableFooter}>
                <div style={styles.footerText}>
                  Showing {products.length ? 1 : 0} to {products.length} of {products.length} products
                </div>

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
      </div>
    </>
  );
}

export default Product;
