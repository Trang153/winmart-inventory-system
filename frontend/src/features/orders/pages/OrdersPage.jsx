import React, { useState } from "react";

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
  { title: "Total Revenue", value: "$45,231", note: "12.5% from last month", icon: "$", tone: "green" },
  { title: "Total Orders", value: "1,234", note: "Across all statuses this month", icon: "[]", tone: "blue" },
  { title: "Pending Orders", value: "45", note: "Awaiting processing", icon: "O", tone: "yellow" },
  { title: "Delivered", value: "1,154", note: "Successfully completed", icon: "V", tone: "green" },
];

const orders = [
  { id: "#ORD-7352", customer: "John Doe", email: "john.doe@example.com", date: "Oct 24, 2023", time: "09:41 AM", items: "12 items", total: "$1,245.00", status: "Pending", tone: "yellow", avatar: "JD" },
  { id: "#ORD-7351", customer: "Sarah Smith", email: "sarah.smith@example.com", date: "Oct 24, 2023", time: "08:20 AM", items: "5 items", total: "$340.50", status: "Processing", tone: "blue", avatar: "SS" },
  { id: "#ORD-7350", customer: "Mike Johnson", email: "mike.j@example.com", date: "Oct 23, 2023", time: "04:15 PM", items: "2 items", total: "$89.00", status: "Shipped", tone: "purple", avatar: "MJ" },
];

const orderItems = [
  { name: "Organic Fuji Apples", sku: "SKU: APP-001", stock: "In Stock: 150 kg", qty: 50, price: "2.50", total: "$125.00", image: "AP" },
  { name: "Premium Bananas", sku: "SKU: BAN-002", stock: "In Stock: 80 box", qty: 20, price: "15.00", total: "$300.00", image: "BN" },
];

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "290px 1fr", background: "#f5f7fb", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: "#1f2937" },
  sidebar: { background: "#ffffff", borderRight: "1px solid #dfe7f2", padding: "22px 14px", display: "flex", flexDirection: "column" },
  brand: { margin: "8px 18px 40px", color: "#d14134", fontSize: "30px", fontWeight: 800 },
  nav: { display: "flex", flexDirection: "column", gap: "10px" },
  navItem: { display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderRadius: "10px", color: "#65748f", fontSize: "17px", border: "none", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" },
  navItemActive: { background: "#fff1ef", color: "#ef4335", fontWeight: 600 },
  sidebarFooter: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #dfe7f2", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px" },
  search: { width: "100%", maxWidth: "540px", height: "42px", border: "1px solid #d7e1ed", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px", padding: "0 14px", color: "#94a3b8", background: "#ffffff", boxSizing: "border-box", fontSize: "16px" },
  topActions: { display: "flex", alignItems: "center", gap: "16px", color: "#64748b" },
  avatar: { width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #f1debf, #ba8840)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 700 },
  content: { padding: "34px", display: "grid", gap: "24px" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", flexWrap: "wrap" },
  title: { margin: 0, fontSize: "32px", fontWeight: 800, color: "#172033" },
  headerActions: { display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" },
  secondaryButton: { height: "48px", padding: "0 20px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#1f2937", fontSize: "16px", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  primaryButton: { height: "48px", padding: "0 22px", borderRadius: "10px", border: "none", background: "#d94736", color: "#ffffff", fontSize: "16px", fontWeight: 700, display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" },
  statCard: { borderRadius: "16px", padding: "30px 30px 28px", border: "1px solid #dde6f2", background: "#ffffff" },
  statTop: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "18px" },
  statLabel: { color: "#64748b", fontSize: "16px", fontWeight: 600 },
  statIcon: { width: "50px", height: "50px", borderRadius: "10px", display: "grid", placeItems: "center", fontSize: "22px", fontWeight: 700 },
  statValue: { fontSize: "46px", fontWeight: 800, marginBottom: "12px", color: "#172033" },
  statNote: { fontSize: "15px" },
  filterRow: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  selectBox: { minWidth: "224px", height: "50px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", padding: "0 16px", fontSize: "16px", color: "#1f2937" },
  tableCard: { background: "#ffffff", border: "1px solid #dbe4ef", borderRadius: "16px", overflow: "hidden" },
  tableScroll: { overflowX: "auto" },
  table: { width: "100%", minWidth: "1100px", borderCollapse: "collapse" },
  th: { padding: "20px 18px", textAlign: "left", color: "#71829d", fontWeight: 700, fontSize: "16px", borderBottom: "1px solid #dde6f2" },
  td: { padding: "20px 18px", borderBottom: "1px solid #e8eef5", fontSize: "17px", color: "#1f2937", verticalAlign: "middle" },
  customerCell: { display: "grid", gridTemplateColumns: "48px 1fr", gap: "14px", alignItems: "center" },
  customerAvatar: { width: "46px", height: "46px", borderRadius: "50%", background: "linear-gradient(135deg, #c7d2e3, #7a8ca5)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 700, fontSize: "14px" },
  customerName: { fontSize: "18px", fontWeight: 600, marginBottom: "6px" },
  customerEmail: { color: "#71829d", fontSize: "15px" },
  dateText: { marginBottom: "6px" },
  timeText: { color: "#71829d" },
  statusYellow: { display: "inline-block", padding: "8px 16px", borderRadius: "16px", background: "#fff0c7", color: "#b97712", fontWeight: 600, fontSize: "16px" },
  statusBlue: { display: "inline-block", padding: "8px 16px", borderRadius: "16px", background: "#dfefff", color: "#2d7bd6", fontWeight: 600, fontSize: "16px" },
  statusPurple: { display: "inline-block", padding: "8px 16px", borderRadius: "16px", background: "#efe4ff", color: "#7c3aed", fontWeight: 600, fontSize: "16px" },
  actionWrap: { display: "flex", alignItems: "center", gap: "10px" },
  actionButton: { width: "34px", height: "34px", borderRadius: "8px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#64748b", display: "grid", placeItems: "center", fontSize: "16px" },
  tableFooter: { padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" },
  footerText: { color: "#6b7a92", fontSize: "17px" },
  pagination: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  pageButton: { minWidth: "40px", height: "40px", borderRadius: "8px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#1f2937", fontSize: "16px", display: "grid", placeItems: "center" },
  pageButtonActive: { background: "#d94736", color: "#ffffff", border: "1px solid #d94736" },
  ellipsis: { padding: "0 8px", color: "#6b7a92", fontSize: "18px" },
  createHeader: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  backButton: { width: "38px", height: "38px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#64748b", fontSize: "22px", cursor: "pointer" },
  createGrid: { display: "grid", gridTemplateColumns: "1fr 1.9fr", gap: "22px", alignItems: "start" },
  leftColumn: { display: "grid", gap: "22px" },
  rightColumn: { display: "grid", gap: "22px" },
  formCard: { background: "#ffffff", border: "1px solid #dbe4ef", borderRadius: "16px", overflow: "hidden" },
  formHeader: { padding: "18px 22px", borderBottom: "1px solid #e5ebf3", fontSize: "16px", fontWeight: 700, color: "#172033", display: "flex", alignItems: "center", gap: "10px" },
  formBody: { padding: "20px 22px 24px", display: "grid", gap: "16px" },
  field: { display: "grid", gap: "8px" },
  fieldTwo: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  label: { fontSize: "15px", fontWeight: 600, color: "#1f2937" },
  input: { height: "40px", borderRadius: "8px", border: "1px solid #d8e1ec", background: "#ffffff", padding: "0 12px", boxSizing: "border-box", fontSize: "15px", color: "#1f2937", width: "100%" },
  inputMuted: { background: "#f8fafc", color: "#71829d" },
  textarea: { minHeight: "72px", borderRadius: "8px", border: "1px solid #d8e1ec", background: "#ffffff", padding: "12px", boxSizing: "border-box", fontSize: "15px", color: "#1f2937", resize: "vertical", width: "100%" },
  uploadBox: { minHeight: "122px", border: "1px dashed #d8e1ec", borderRadius: "10px", display: "grid", placeItems: "center", textAlign: "center", color: "#71829d", padding: "18px" },
  itemToolbar: { display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" },
  itemSearch: { flex: 1, height: "44px", borderRadius: "10px", border: "1px solid #d8e1ec", padding: "0 14px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "10px" },
  scanButton: { width: "42px", height: "42px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#64748b", display: "grid", placeItems: "center" },
  addButton: { height: "42px", padding: "0 18px", borderRadius: "10px", border: "none", background: "#d94736", color: "#ffffff", fontSize: "16px", cursor: "pointer" },
  itemsHead: { display: "grid", gridTemplateColumns: "1.7fr 0.9fr 0.8fr 0.8fr 40px", gap: "16px", padding: "14px 0", borderTop: "1px solid #e8eef5", borderBottom: "1px solid #e8eef5", color: "#71829d", fontWeight: 700 },
  itemRow: { display: "grid", gridTemplateColumns: "1.7fr 0.9fr 0.8fr 0.8fr 40px", gap: "16px", padding: "18px 0", borderBottom: "1px solid #e8eef5", alignItems: "center" },
  itemProduct: { display: "grid", gridTemplateColumns: "44px 1fr", gap: "12px", alignItems: "center" },
  itemImage: { width: "42px", height: "42px", borderRadius: "10px", background: "linear-gradient(135deg, #d9b07f, #f5ead9)", display: "grid", placeItems: "center", fontSize: "13px", fontWeight: 700 },
  itemName: { fontSize: "16px", fontWeight: 600, marginBottom: "4px" },
  itemMeta: { fontSize: "14px", color: "#71829d", lineHeight: 1.35 },
  quantityBox: { display: "flex", alignItems: "center", border: "1px solid #d8e1ec", borderRadius: "8px", overflow: "hidden", width: "98px", height: "32px" },
  qtyBtn: { width: "32px", height: "32px", border: "none", background: "#f8fafc", color: "#71829d", fontSize: "18px" },
  qtyValue: { flex: 1, textAlign: "center", fontSize: "15px" },
  currencyRow: { display: "flex", alignItems: "center", gap: "6px" },
  smallInput: { width: "72px", height: "34px", borderRadius: "8px", border: "1px solid #d8e1ec", padding: "0 10px", fontSize: "15px", textAlign: "right" },
  deleteBtn: { border: "none", background: "transparent", color: "#ef4335", fontSize: "16px", cursor: "pointer" },
  customRow: { marginTop: "16px", border: "1px dashed #d8e1ec", borderRadius: "10px", padding: "18px", textAlign: "center", color: "#71829d" },
  paymentGrid: { display: "grid", gridTemplateColumns: "1fr 340px", gap: "22px", alignItems: "start" },
  summaryBox: { border: "1px solid #dbe4ef", borderRadius: "10px", padding: "18px 20px", background: "#fbfdff" },
  summaryRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", marginBottom: "14px", color: "#64748b" },
  summaryInput: { display: "flex", alignItems: "center", border: "1px solid #d8e1ec", borderRadius: "8px", overflow: "hidden", width: "112px", height: "32px" },
  summaryPrefix: { width: "32px", height: "32px", display: "grid", placeItems: "center", background: "#f8fafc", color: "#64748b" },
  summaryField: { flex: 1, border: "none", outline: "none", textAlign: "right", padding: "0 10px", fontSize: "14px", background: "#ffffff" },
  summaryDivider: { borderTop: "1px solid #d8e1ec", margin: "12px 0 14px" },
  totalWrap: { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "18px", fontWeight: 800, color: "#172033" },
  footerActions: { marginTop: "16px", paddingTop: "18px", borderTop: "1px solid #e8eef5", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", flexWrap: "wrap" },
  cancelLink: { border: "none", background: "transparent", color: "#64748b", fontSize: "16px", cursor: "pointer", padding: 0 },
};

function getStatTone(tone) {
  if (tone === "green") return { icon: { background: "#daf7e1", color: "#34a853" }, note: { color: "#34a853" } };
  if (tone === "yellow") return { icon: { background: "#fff2bf", color: "#dd8b18" }, note: { color: "#64748b" } };
  return { icon: { background: "#ddebfb", color: "#3a82d1" }, note: { color: "#64748b" } };
}

function getStatusStyle(tone) {
  if (tone === "yellow") return styles.statusYellow;
  if (tone === "purple") return styles.statusPurple;
  return styles.statusBlue;
}

function Orders({ currentPage = "orders", onNavigate = () => {}, onLogout = () => {} }) {
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .orders-stats {
              grid-template-columns: 1fr 1fr;
            }

            .orders-create-grid,
            .orders-payment-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 1024px) {
            .orders-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 820px) {
            .orders-topbar,
            .orders-header,
            .orders-footer,
            .orders-form-footer {
              flex-direction: column;
              align-items: stretch;
            }

            .orders-search {
              max-width: none;
            }
          }

          @media (max-width: 680px) {
            .orders-stats,
            .orders-field-two {
              grid-template-columns: 1fr;
            }
          }
        `}
      </style>

      <div className="orders-page" style={styles.page}>
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
          <header className="orders-topbar" style={styles.topbar}>
            <div className="orders-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search orders, customers, IDs...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <div style={styles.avatar}>A</div>
            </div>
          </header>

          <div style={styles.content}>
            {isCreatingOrder ? (
              <>
                <div style={styles.createHeader}>
                  <button type="button" style={styles.backButton} onClick={() => setIsCreatingOrder(false)}>
                    {"<"}
                  </button>
                  <h1 style={styles.title}>Create New Order</h1>
                </div>

                <div className="orders-create-grid" style={styles.createGrid}>
                  <div style={styles.leftColumn}>
                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>[] Order Information</div>
                      <div style={styles.formBody}>
                        <div style={styles.field}>
                          <label style={styles.label}>Order Type</label>
                          <select style={styles.input} defaultValue="Purchase Order">
                            <option>Purchase Order</option>
                            <option>Sales Order</option>
                          </select>
                        </div>
                        <div className="orders-field-two" style={styles.fieldTwo}>
                          <div style={styles.field}>
                            <label style={styles.label}>Order ID</label>
                            <input style={{ ...styles.input, ...styles.inputMuted }} defaultValue="#ORD-7353" />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Order Date</label>
                            <input style={styles.input} defaultValue="10/25/2023" />
                          </div>
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Created By</label>
                          <input style={{ ...styles.input, ...styles.inputMuted }} defaultValue="Admin User" />
                        </div>
                      </div>
                    </section>

                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>[] Supplier Details</div>
                      <div style={styles.formBody}>
                        <div style={styles.field}>
                          <label style={styles.label}>Select Supplier</label>
                          <select style={styles.input} defaultValue="Green Valley Farms">
                            <option>Green Valley Farms</option>
                            <option>Fresh Market Supply</option>
                          </select>
                        </div>
                        <div className="orders-field-two" style={styles.fieldTwo}>
                          <div style={styles.field}>
                            <label style={styles.label}>Contact Number</label>
                            <input style={{ ...styles.input, ...styles.inputMuted }} defaultValue="+1 (555) 123-4567" />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Email Address</label>
                            <input style={{ ...styles.input, ...styles.inputMuted }} defaultValue="contact@greenvalley.com" />
                          </div>
                        </div>
                      </div>
                    </section>

                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>[] Shipping & Status</div>
                      <div style={styles.formBody}>
                        <div style={styles.field}>
                          <label style={styles.label}>Order Status</label>
                          <select style={styles.input} defaultValue="Pending">
                            <option>Pending</option>
                            <option>Processing</option>
                            <option>Shipped</option>
                          </select>
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Expected Delivery Date</label>
                          <input style={styles.input} defaultValue="10/28/2023" />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Shipping Address</label>
                          <textarea style={styles.textarea} defaultValue="123 Logistics Way, Distribution Hub, Warehouse 4" />
                        </div>
                      </div>
                    </section>

                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>/ Additional Information</div>
                      <div style={styles.formBody}>
                        <div style={styles.field}>
                          <label style={styles.label}>Notes</label>
                          <textarea style={styles.textarea} placeholder="Add any special instructions or remarks..." />
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Attachments</label>
                          <div style={styles.uploadBox}>
                            <div>
                              <div style={{ fontSize: "34px", marginBottom: "10px" }}>Y</div>
                              <div>
                                <span style={{ color: "#ef4335", fontWeight: 600 }}>Click to upload</span> or drag and drop
                              </div>
                              <div>SVG, PNG, JPG or PDF (max. 10MB)</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>

                  <div style={styles.rightColumn}>
                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>[] Order Items</div>
                      <div style={styles.formBody}>
                        <div style={styles.itemToolbar}>
                          <div style={styles.itemSearch}>
                            <span>Q</span>
                            <span>Search product name, SKU, or scan barcode...</span>
                          </div>
                          <button type="button" style={styles.scanButton}>[]</button>
                          <button type="button" style={styles.addButton}>Add</button>
                        </div>

                        <div style={styles.itemsHead}>
                          <span>PRODUCT DETAILS</span>
                          <span>QUANTITY</span>
                          <span>UNIT PRICE</span>
                          <span>TOTAL</span>
                          <span />
                        </div>

                        {orderItems.map((item) => (
                          <div key={item.sku} style={styles.itemRow}>
                            <div style={styles.itemProduct}>
                              <div style={styles.itemImage}>{item.image}</div>
                              <div>
                                <div style={styles.itemName}>{item.name}</div>
                                <div style={styles.itemMeta}>
                                  {item.sku} • {item.stock}
                                </div>
                              </div>
                            </div>
                            <div style={styles.quantityBox}>
                              <button type="button" style={styles.qtyBtn}>-</button>
                              <div style={styles.qtyValue}>{item.qty}</div>
                              <button type="button" style={styles.qtyBtn}>+</button>
                            </div>
                            <div style={styles.currencyRow}>
                              <span>$</span>
                              <input style={styles.smallInput} defaultValue={item.price} />
                            </div>
                            <div style={{ fontWeight: 700 }}>{item.total}</div>
                            <button type="button" style={styles.deleteBtn}>X</button>
                          </div>
                        ))}

                        <div style={styles.customRow}>+ Add Custom Product Row</div>
                      </div>
                    </section>

                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>[] Payment & Summary</div>
                      <div style={styles.formBody}>
                        <div className="orders-payment-grid" style={styles.paymentGrid}>
                          <div style={{ display: "grid", gap: "16px" }}>
                            <div style={styles.field}>
                              <label style={styles.label}>Payment Method</label>
                              <select style={styles.input} defaultValue="Bank Transfer">
                                <option>Bank Transfer</option>
                                <option>Cash</option>
                              </select>
                            </div>
                            <div style={styles.field}>
                              <label style={styles.label}>Payment Status</label>
                              <select style={styles.input} defaultValue="Unpaid">
                                <option>Unpaid</option>
                                <option>Paid</option>
                              </select>
                            </div>
                          </div>

                          <div style={styles.summaryBox}>
                            <div style={styles.summaryRow}>
                              <span>Subtotal</span>
                              <strong style={{ color: "#1f2937" }}>$425.00</strong>
                            </div>
                            <div style={styles.summaryRow}>
                              <span>Discount</span>
                              <div style={styles.summaryInput}>
                                <div style={styles.summaryPrefix}>$</div>
                                <input style={styles.summaryField} defaultValue="25.00" />
                              </div>
                            </div>
                            <div style={styles.summaryRow}>
                              <span>Tax</span>
                              <div style={styles.summaryInput}>
                                <div style={styles.summaryPrefix}>%</div>
                                <input style={styles.summaryField} defaultValue="10" />
                              </div>
                            </div>
                            <div style={styles.summaryDivider} />
                            <div style={styles.totalWrap}>
                              <span>Total Amount</span>
                              <span>$440.00</span>
                            </div>
                          </div>
                        </div>

                        <div className="orders-form-footer" style={styles.footerActions}>
                          <button type="button" style={styles.cancelLink} onClick={() => setIsCreatingOrder(false)}>
                            Cancel
                          </button>

                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            <button type="button" style={styles.secondaryButton}>Save Draft</button>
                            <button type="button" style={styles.primaryButton}>Create Order</button>
                          </div>
                        </div>
                      </div>
                    </section>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="orders-header" style={styles.headerRow}>
                  <h1 style={styles.title}>Order Management</h1>

                  <div style={styles.headerActions}>
                    <button type="button" style={styles.secondaryButton}>
                      <span>T</span>
                      <span>Export Report</span>
                    </button>
                    <button type="button" style={styles.primaryButton} onClick={() => setIsCreatingOrder(true)}>
                      <span>+</span>
                      <span>Create Order</span>
                    </button>
                  </div>
                </div>

                <div className="orders-stats" style={styles.statsGrid}>
                  {stats.map((stat) => {
                    const tone = getStatTone(stat.tone);
                    return (
                      <div key={stat.title} style={styles.statCard}>
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
                  <select style={styles.selectBox} defaultValue="all-statuses">
                    <option value="all-statuses">All Statuses</option>
                  </select>
                  <select style={styles.selectBox} defaultValue="last-30-days">
                    <option value="last-30-days">Last 30 Days</option>
                  </select>
                </div>

                <section style={styles.tableCard}>
                  <div style={styles.tableScroll}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>ORDER ID</th>
                          <th style={styles.th}>CUSTOMER</th>
                          <th style={styles.th}>DATE</th>
                          <th style={styles.th}>ITEMS</th>
                          <th style={styles.th}>TOTAL AMOUNT</th>
                          <th style={styles.th}>STATUS</th>
                          <th style={styles.th}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.map((order) => (
                          <tr key={order.id}>
                            <td style={styles.td}>{order.id}</td>
                            <td style={styles.td}>
                              <div style={styles.customerCell}>
                                <div style={styles.customerAvatar}>{order.avatar}</div>
                                <div>
                                  <div style={styles.customerName}>{order.customer}</div>
                                  <div style={styles.customerEmail}>{order.email}</div>
                                </div>
                              </div>
                            </td>
                            <td style={styles.td}>
                              <div style={styles.dateText}>{order.date}</div>
                              <div style={styles.timeText}>{order.time}</div>
                            </td>
                            <td style={styles.td}>{order.items}</td>
                            <td style={styles.td}>{order.total}</td>
                            <td style={styles.td}>
                              <span style={getStatusStyle(order.tone)}>{order.status}</span>
                            </td>
                            <td style={styles.td}>
                              <div style={styles.actionWrap}>
                                <div style={styles.actionButton}>O</div>
                                <div style={styles.actionButton}>Q</div>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="orders-footer" style={styles.tableFooter}>
                    <div style={styles.footerText}>Showing 1 to 5 of 1,234 orders</div>

                    <div style={styles.pagination}>
                      <div style={styles.pageButton}>{"<"}</div>
                      <div style={{ ...styles.pageButton, ...styles.pageButtonActive }}>1</div>
                      <div style={styles.pageButton}>2</div>
                      <div style={styles.pageButton}>3</div>
                      <div style={styles.ellipsis}>...</div>
                      <div style={styles.pageButton}>124</div>
                      <div style={styles.pageButton}>{">"}</div>
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>
      </div>
    </>
  );
}

export default Orders;
