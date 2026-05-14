import React, { useEffect, useMemo, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import RoleAvatar from "../../../components/RoleAvatar";
import { isAdmin } from "../../../auth/rbac";
import { getOrders, updateOrderStatus } from "../../../services/order/orderService";
import { getProducts, updateProductStock, uploadProductImage } from "../../../services/product/productService";
import {
  createReceiptRequest,
  getReceiptRequests,
  hideReceiptRequest as hideReceiptRequestOnServer,
  reviewReceiptRequest,
} from "../../../services/receipt/receiptService";

const poStatuses = [
  { value: "waiting-delivery", label: "Waiting Delivery" },
  { value: "received", label: "Received" },
  { value: "waiting-check", label: "Waiting Check" },
  { value: "checked", label: "Completed" },
];

const actionConfigs = {
  receipt: {
    title: "Receive Goods",
    action: "Confirm Receipt",
    description: "Confirm the actual received quantity and upload the supplier invoice.",
    status: "received",
    fields: [
      { key: "receivedQty", label: "Actual received quantity", type: "number", placeholder: "Enter quantity" },
      { key: "invoiceImage", label: "Supplier invoice image", type: "file" },
    ],
  },
  count: {
    title: "Stock Count",
    action: "Update Count",
    description: "Update SKU, counted quantity and shelf location.",
    status: "checked",
    fields: [
      { key: "sku", label: "SKU", type: "text", placeholder: "Enter SKU" },
      { key: "countedQty", label: "Counted quantity", type: "number", placeholder: "Enter quantity" },
      { key: "shelfLocation", label: "Shelf location", type: "text", placeholder: "Example: Aisle 02 - Shelf B" },
    ],
  },
  damage: {
    title: "Damage Report",
    action: "Report Damage",
    description: "Record SKU, reason and a photo of damaged products.",
    fields: [
      { key: "sku", label: "SKU", type: "text", placeholder: "Enter SKU" },
      { key: "reason", label: "Reason", type: "textarea", placeholder: "Describe the damage" },
      { key: "damageImage", label: "Damaged product image", type: "file" },
    ],
  },
  lookup: {
    title: "Lookup",
    action: "Check Stock",
    description: "Search stock by keyword or barcode.",
    fields: [
      { key: "keyword", label: "Keyword or barcode", type: "text", placeholder: "Enter product name, SKU or barcode" },
    ],
  },
};

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "322px 1fr", background: "#f5f7fb", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: "#1f2937" },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #dfe7f2", padding: "20px 38px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px" },
  search: { width: "100%", maxWidth: "520px", height: "48px", border: "1px solid #d7e1ed", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px", padding: "0 16px", background: "#ffffff", boxSizing: "border-box" },
  searchInput: { flex: 1, border: "none", outline: "none", color: "#1f2937", fontSize: "16px", background: "transparent" },
  topActions: { display: "flex", alignItems: "center", gap: "18px", color: "#64748b" },
  avatar: { width: "44px", height: "44px", borderRadius: "50%", background: "linear-gradient(135deg, #f1debf, #ba8840)", color: "#ffffff", display: "grid", placeItems: "center", fontWeight: 700 },
  content: { padding: "38px", display: "grid", gap: "24px" },
  headerRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px", flexWrap: "wrap" },
  title: { margin: 0, fontSize: "31px", fontWeight: 800, color: "#172033" },
  subtitle: { margin: "8px 0 0", color: "#64748b", fontSize: "16px" },
  actionGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" },
  actionCard: { border: "1px solid #dbe4ef", borderRadius: "12px", background: "#ffffff", padding: "20px", display: "grid", gap: "10px", textAlign: "left" },
  actionTitle: { fontSize: "20px", fontWeight: 800, color: "#172033" },
  actionName: { color: "#d94736", fontWeight: 700, fontSize: "16px" },
  actionDesc: { color: "#64748b", fontSize: "14px", lineHeight: 1.45 },
  actionButton: { height: "40px", borderRadius: "8px", border: "none", background: "#d94736", color: "#ffffff", fontWeight: 700, cursor: "pointer" },
  filterRow: { display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" },
  statusButton: { height: "40px", padding: "0 16px", borderRadius: "999px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#64748b", fontWeight: 700, cursor: "pointer" },
  statusButtonActive: { background: "#fff1ef", color: "#d94736", borderColor: "#f0b6ae" },
  tableCard: { background: "#ffffff", border: "1px solid #dbe4ef", borderRadius: "16px", overflow: "hidden" },
  tableScroll: { overflowX: "auto" },
  table: { width: "100%", minWidth: "1050px", borderCollapse: "collapse" },
  th: { padding: "18px", textAlign: "left", color: "#71829d", fontWeight: 800, fontSize: "14px", borderBottom: "1px solid #dde6f2", letterSpacing: "0.04em" },
  td: { padding: "18px", borderBottom: "1px solid #e8eef5", fontSize: "16px", color: "#1f2937", verticalAlign: "middle" },
  poCode: { fontWeight: 800, color: "#172033" },
  muted: { color: "#71829d", fontSize: "14px", marginTop: "4px" },
  badge: { display: "inline-block", padding: "7px 14px", borderRadius: "999px", fontWeight: 700, fontSize: "14px" },
  badgeYellow: { background: "#fff0c7", color: "#b97712" },
  badgeBlue: { background: "#dfefff", color: "#2d7bd6" },
  badgePurple: { background: "#efe4ff", color: "#7c3aed" },
  badgeGreen: { background: "#dbf7e3", color: "#28a85a" },
  rowActions: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" },
  smallButton: { height: "34px", padding: "0 12px", borderRadius: "8px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#334155", fontWeight: 700, cursor: "pointer" },
  footer: { padding: "18px 28px", color: "#6b7a92", fontSize: "16px" },
  emptyText: { padding: "28px", color: "#6b7a92", fontSize: "16px", textAlign: "center" },
  errorText: { padding: "18px 28px 0", color: "#ef4335", fontSize: "14px" },
  successText: { padding: "18px 28px 0", color: "#22a958", fontSize: "14px" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 1000 },
  modal: { width: "100%", maxWidth: "620px", maxHeight: "90vh", overflow: "auto", background: "#ffffff", borderRadius: "16px", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)" },
  modalHeader: { padding: "20px 24px", borderBottom: "1px solid #e5ebf3", display: "flex", justifyContent: "space-between", gap: "12px" },
  modalTitle: { margin: 0, fontSize: "22px", fontWeight: 800, color: "#172033" },
  modalClose: { border: "none", background: "transparent", color: "#64748b", fontSize: "28px", cursor: "pointer", lineHeight: 1 },
  modalBody: { padding: "22px 24px", display: "grid", gap: "16px" },
  field: { display: "grid", gap: "8px" },
  label: { fontSize: "15px", fontWeight: 700, color: "#334155" },
  input: { height: "44px", borderRadius: "10px", border: "1px solid #d6dfeb", padding: "0 14px", boxSizing: "border-box", fontSize: "15px", color: "#1f2937", background: "#ffffff", outline: "none", width: "100%" },
  textarea: { minHeight: "92px", borderRadius: "10px", border: "1px solid #d6dfeb", padding: "12px 14px", boxSizing: "border-box", fontSize: "15px", color: "#1f2937", background: "#ffffff", outline: "none", width: "100%", resize: "vertical" },
  modalFooter: { display: "flex", justifyContent: "flex-end", gap: "12px", padding: "0 24px 24px" },
  secondaryButton: { height: "44px", padding: "0 18px", borderRadius: "10px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#1f2937", fontWeight: 700, cursor: "pointer" },
  primaryButton: { height: "44px", padding: "0 20px", borderRadius: "10px", border: "none", background: "#d94736", color: "#ffffff", fontWeight: 800, cursor: "pointer" },
  resultBox: { border: "1px solid #dbe4ef", borderRadius: "10px", padding: "14px", background: "#fbfdff", display: "grid", gap: "10px" },
};

function formatCurrency(value) {
  return new Intl.NumberFormat("vi-VN").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
}

function normalizePoStatus(status) {
  const normalized = String(status || "").toLowerCase();
  if (normalized.includes("completed") || normalized.includes("checked")) return "checked";
  if (normalized.includes("approved") || normalized.includes("received")) return "received";
  if (normalized.includes("processing")) return "waiting-check";
  return "waiting-delivery";
}

function getStatusLabel(value) {
  return poStatuses.find((status) => status.value === value)?.label || "Waiting Delivery";
}

function getStatusStyle(value) {
  if (value === "checked") return { ...styles.badge, ...styles.badgeGreen };
  if (value === "received") return { ...styles.badge, ...styles.badgeBlue };
  if (value === "waiting-check") return { ...styles.badge, ...styles.badgePurple };
  return { ...styles.badge, ...styles.badgeYellow };
}

function canViewInvoice(value) {
  const invoiceUrl = String(value || "");
  return invoiceUrl.startsWith("http://") || invoiceUrl.startsWith("https://") || invoiceUrl.startsWith("/uploads/");
}

function mapOrderToPo(order) {
  const status = normalizePoStatus(order.receiving_status || order.order_status);
  return {
    id: order.order_id,
    code: order.order_code,
    supplier: order.supplier_name || "-",
    createdBy: order.created_by_username || "-",
    date: order.expected_delivery_date || order.order_date,
    items: Number(order.item_count || 0),
    total: Number(order.total_amount || 0),
    status,
    originalStatus: order.order_status || "-",
  };
}

function StaffInventory({ currentPage = "inventory", currentUser = null, onNavigate = () => {}, onLogout = () => {} }) {
  const [poRows, setPoRows] = useState([]);
  const [products, setProducts] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [formValues, setFormValues] = useState({});
  const [lookupResults, setLookupResults] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingBill, setIsUploadingBill] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadData() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [ordersData, productsData] = await Promise.all([getOrders(), getProducts()]);
        const purchaseOrders = ordersData
          .filter((order) => String(order.order_type || "").toLowerCase().includes("purchase"))
          .map(mapOrderToPo);

        if (isMounted) {
          setPoRows(purchaseOrders);
          setProducts(productsData);
        }
      } catch (error) {
        if (isMounted) {
          setPoRows([]);
          setProducts([]);
          setErrorMessage(error.message || "Failed to load inventory tasks");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  const summary = useMemo(() => ({
    waitingDelivery: poRows.filter((po) => po.status === "waiting-delivery").length,
    received: poRows.filter((po) => po.status === "received").length,
    waitingCheck: poRows.filter((po) => po.status === "waiting-check").length,
    checked: poRows.filter((po) => po.status === "checked").length,
  }), [poRows]);

  const filteredRows = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return poRows.filter((po) => {
      const matchesStatus = statusFilter === "all" || po.status === statusFilter;
      const matchesSearch = !normalizedSearch
        || String(po.code || "").toLowerCase().includes(normalizedSearch)
        || String(po.supplier || "").toLowerCase().includes(normalizedSearch)
        || String(po.createdBy || "").toLowerCase().includes(normalizedSearch);

      return matchesStatus && matchesSearch;
    });
  }, [poRows, searchQuery, statusFilter]);

  function openModal(type, po = null) {
    setActiveModal({ type, po });
    setFormValues({});
    setLookupResults([]);
    setSuccessMessage("");
  }

  function closeModal() {
    setActiveModal(null);
    setFormValues({});
    setLookupResults([]);
  }

  function updateField(key, value) {
    setFormValues((current) => ({ ...current, [key]: value }));
  }

  async function completePurchaseOrder(poId) {
    try {
      setErrorMessage("");
      await updateOrderStatus(poId, "Completed");
      setPoRows((currentRows) =>
        currentRows.map((po) => (po.id === poId ? { ...po, status: "checked", originalStatus: "Completed" } : po))
      );
      setSuccessMessage("Purchase order completed.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to complete purchase order");
    }
  }

  async function handleFileFieldChange(fieldKey, file) {
    if (!file) {
      return;
    }

    if (fieldKey !== "invoiceImage") {
      updateField(fieldKey, file.name);
      return;
    }

    try {
      setIsUploadingBill(true);
      setErrorMessage("");
      const result = await uploadProductImage(file);
      updateField(fieldKey, result.imageUrl);
    } catch (error) {
      setErrorMessage(error.message || "Failed to upload bill image");
    } finally {
      setIsUploadingBill(false);
    }
  }

  async function handleSubmitAction() {
    if (!activeModal) return;
    const config = actionConfigs[activeModal.type];

    if (activeModal.type === "lookup") {
      const keyword = String(formValues.keyword || "").trim().toLowerCase();
      const results = products.filter((product) =>
        String(product.product_name || "").toLowerCase().includes(keyword)
        || String(product.product_id || "").toLowerCase().includes(keyword)
        || String(product.category || "").toLowerCase().includes(keyword)
      );
      setLookupResults(keyword ? results.slice(0, 8) : []);
      return;
    }

    if (activeModal.type === "receipt" && activeModal.po) {
      try {
        await createReceiptRequest({
          order_id: activeModal.po.id,
          received_quantity: Number(formValues.receivedQty || 0),
          invoice_image_url: formValues.invoiceImage || null,
        });
      } catch (error) {
        setErrorMessage(error.message || "Failed to create receipt request");
        return;
      }
    }

    if (config.status && activeModal.po) {
      setPoRows((currentRows) =>
        currentRows.map((po) => (po.id === activeModal.po.id ? { ...po, status: config.status } : po))
      );
    }

    setSuccessMessage(`${config.action} recorded${activeModal.po ? ` for PO #${activeModal.po.code}` : ""}.`);
    closeModal();
  }

  const modalConfig = activeModal ? actionConfigs[activeModal.type] : null;

  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .inventory-actions {
              grid-template-columns: 1fr 1fr;
            }
          }

          @media (max-width: 1024px) {
            .inventory-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 720px) {
            .inventory-actions {
              grid-template-columns: 1fr;
            }

            .inventory-topbar,
            .inventory-header {
              flex-direction: column;
              align-items: stretch;
            }
          }
        `}
      </style>

      <div className="inventory-page" style={styles.page}>
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header className="inventory-topbar" style={styles.topbar}>
            <div style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <input
                style={styles.searchInput}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search PO, supplier, creator..."
              />
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <RoleAvatar currentUser={currentUser} style={styles.avatar} />
            </div>
          </header>

          <div style={styles.content}>
            <div className="inventory-header" style={styles.headerRow}>
              <div>
                <h1 style={styles.title}>Purchase Orders to Receive</h1>
                <p style={styles.subtitle}>Staff can receive purchase orders, report stock counts, report damage and look up inventory.</p>
              </div>
            </div>

            <div className="inventory-actions" style={styles.actionGrid}>
              {Object.entries(actionConfigs).map(([type, config]) => (
                <div key={type} style={styles.actionCard}>
                  <div style={styles.actionTitle}>{config.title}</div>
                  <div style={styles.actionName}>{config.action}</div>
                  <div style={styles.actionDesc}>{config.description}</div>
                  <button type="button" style={styles.actionButton} onClick={() => openModal(type)}>
                    Open
                  </button>
                </div>
              ))}
            </div>

            <div style={styles.filterRow}>
              <button
                type="button"
                style={{ ...styles.statusButton, ...(statusFilter === "all" ? styles.statusButtonActive : null) }}
                onClick={() => setStatusFilter("all")}
              >
                All ({poRows.length})
              </button>
              <button type="button" style={{ ...styles.statusButton, ...(statusFilter === "waiting-delivery" ? styles.statusButtonActive : null) }} onClick={() => setStatusFilter("waiting-delivery")}>Waiting Delivery ({summary.waitingDelivery})</button>
              <button type="button" style={{ ...styles.statusButton, ...(statusFilter === "received" ? styles.statusButtonActive : null) }} onClick={() => setStatusFilter("received")}>Received ({summary.received})</button>
              <button type="button" style={{ ...styles.statusButton, ...(statusFilter === "waiting-check" ? styles.statusButtonActive : null) }} onClick={() => setStatusFilter("waiting-check")}>Waiting Check ({summary.waitingCheck})</button>
              <button type="button" style={{ ...styles.statusButton, ...(statusFilter === "checked" ? styles.statusButtonActive : null) }} onClick={() => setStatusFilter("checked")}>Completed ({summary.checked})</button>
            </div>

            <section style={styles.tableCard}>
              {errorMessage ? <div style={styles.errorText}>{errorMessage}</div> : null}
              {successMessage ? <div style={styles.successText}>{successMessage}</div> : null}

              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>PO ID</th>
                      <th style={styles.th}>SUPPLIER</th>
                      <th style={styles.th}>EXPECTED DATE</th>
                      <th style={styles.th}>ITEMS</th>
                      <th style={styles.th}>VALUE</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRows.map((po) => (
                      <tr key={po.id}>
                        <td style={styles.td}>
                          <div style={styles.poCode}>#{po.code}</div>
                          <div style={styles.muted}>Created by {po.createdBy}</div>
                        </td>
                        <td style={styles.td}>{po.supplier}</td>
                        <td style={styles.td}>{formatDate(po.date)}</td>
                        <td style={styles.td}>{po.items} items</td>
                        <td style={styles.td}>{formatCurrency(po.total)} VND</td>
                        <td style={styles.td}><span style={getStatusStyle(po.status)}>{getStatusLabel(po.status)}</span></td>
                        <td style={styles.td}>
                          {po.status === "waiting-delivery" ? (
                            <div style={styles.rowActions}>
                              <button type="button" style={styles.smallButton} onClick={() => openModal("receipt", po)}>Receive</button>
                              <button type="button" style={styles.smallButton} onClick={() => openModal("count", po)}>Count</button>
                              <button type="button" style={styles.smallButton} onClick={() => openModal("damage", po)}>Damage</button>
                            </div>
                          ) : po.status === "received" ? (
                            <button type="button" style={styles.smallButton} onClick={() => completePurchaseOrder(po.id)}>Complete</button>
                          ) : (
                            <span style={styles.muted}>No further edits allowed</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!filteredRows.length ? (
                <div style={styles.emptyText}>{isLoading ? "Loading purchase orders..." : "No matching purchase orders."}</div>
              ) : null}

              <div style={styles.footer}>
                Showing {filteredRows.length ? 1 : 0} to {filteredRows.length} of {filteredRows.length} purchase orders
              </div>
            </section>
          </div>
        </main>

        {activeModal && modalConfig ? (
          <div style={styles.overlay} onClick={closeModal}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{modalConfig.title} - {modalConfig.action}</h3>
                  <div style={styles.muted}>{activeModal.po ? `PO #${activeModal.po.code} - ${activeModal.po.supplier}` : modalConfig.description}</div>
                </div>
                <button type="button" style={styles.modalClose} onClick={closeModal}>x</button>
              </div>

              <div style={styles.modalBody}>
                {modalConfig.fields.map((field) => (
                  <div key={field.key} style={styles.field}>
                    <label style={styles.label}>{field.label}</label>
                    {field.type === "textarea" ? (
                      <textarea
                        style={styles.textarea}
                        value={formValues[field.key] || ""}
                        onChange={(event) => updateField(field.key, event.target.value)}
                        placeholder={field.placeholder}
                      />
                    ) : (
                      <input
                        type={field.type}
                        style={styles.input}
                        value={field.type === "file" ? undefined : (formValues[field.key] || "")}
                        onChange={(event) => {
                          if (field.type === "file") {
                            handleFileFieldChange(field.key, event.target.files?.[0]);
                            event.target.value = "";
                            return;
                          }

                          updateField(field.key, event.target.value);
                        }}
                        placeholder={field.placeholder}
                      />
                    )}
                    {field.type === "file" && isUploadingBill && field.key === "invoiceImage" ? <div style={styles.muted}>Uploading bill...</div> : null}
                    {field.type === "file" && formValues[field.key] ? <div style={styles.muted}>Selected: {formValues[field.key]}</div> : null}
                  </div>
                ))}

                {activeModal.type === "lookup" && lookupResults.length ? (
                  <div style={styles.resultBox}>
                    {lookupResults.map((product) => (
                      <div key={product.product_id}>
                        <strong>{product.product_name}</strong>
                        <div style={styles.muted}>
                          SKU: {product.product_id} - Stock: {Number(product.inventory_quantity || 0)} pcs - Location: {product.category || "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.secondaryButton} onClick={closeModal}>Cancel</button>
                <button type="button" style={styles.primaryButton} onClick={handleSubmitAction} disabled={isUploadingBill}>
                  {activeModal.type === "lookup" ? "Search" : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function getProductStockStatus(quantity) {
  const stock = Number(quantity || 0);
  if (stock <= 0) return { label: "Out of Stock", style: { ...styles.badge, ...styles.badgeYellow } };
  if (stock <= 20) return { label: "Low Stock", style: { ...styles.badge, ...styles.badgePurple } };
  return { label: "In Stock", style: { ...styles.badge, ...styles.badgeGreen } };
}

function AdminInventory({ currentPage = "inventory", currentUser = null, onNavigate = () => {}, onLogout = () => {} }) {
  const [products, setProducts] = useState([]);
  const [receiptRequests, setReceiptRequests] = useState([]);
  const [requestModal, setRequestModal] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockModal, setStockModal] = useState(null);
  const [quantity, setQuantity] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdatingStock, setIsUpdatingStock] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadProducts() {
      try {
        setIsLoading(true);
        setErrorMessage("");
        const [productRows, receiptRows] = await Promise.all([
          getProducts(),
          getReceiptRequests(),
        ]);

        if (isMounted) {
          setProducts(productRows);
          setReceiptRequests(receiptRows);
        }
      } catch (error) {
        if (isMounted) {
          setProducts([]);
          setErrorMessage(error.message || "Failed to load inventory");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadProducts();

    return () => {
      isMounted = false;
    };
  }, []);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return products.filter((product) =>
      !normalizedSearch
      || String(product.product_name || "").toLowerCase().includes(normalizedSearch)
      || String(product.product_id || "").toLowerCase().includes(normalizedSearch)
      || String(product.category || "").toLowerCase().includes(normalizedSearch)
      || String(product.supplier_name || "").toLowerCase().includes(normalizedSearch)
    );
  }, [products, searchQuery]);

  const visibleReceiptRequests = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return receiptRequests.filter((request) => {
      const isHidden = Boolean(request.is_hidden);

      if (!isHidden) {
        return true;
      }

      if (!normalizedSearch) {
        return false;
      }

      return String(request.order_code || "").toLowerCase().includes(normalizedSearch)
        || String(request.supplier_name || "").toLowerCase().includes(normalizedSearch)
        || String(request.requested_by_username || "").toLowerCase().includes(normalizedSearch)
        || String(request.status || "").toLowerCase().includes(normalizedSearch)
        || String(request.receipt_request_id || "").toLowerCase().includes(normalizedSearch);
    });
  }, [receiptRequests, searchQuery]);

  const pendingRequests = visibleReceiptRequests.filter((request) => request.status === "pending");

  async function updateReceiptRequest(requestId, status) {
    try {
      setErrorMessage("");
      const updatedRequest = await reviewReceiptRequest(requestId, { status });

      setReceiptRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.receipt_request_id === updatedRequest.receipt_request_id ? updatedRequest : request
        )
      );
      setSuccessMessage(`Receipt request ${status}.`);
    } catch (error) {
      setErrorMessage(error.message || "Failed to review receipt request");
    }
  }

  function openStockModal(product, mode) {
    setStockModal({ product, mode });
    setQuantity("");
    setSuccessMessage("");
    setErrorMessage("");
  }

  function openRequestModal(request) {
    setRequestModal(request);
    setSuccessMessage("");
    setErrorMessage("");
  }

  function closeRequestModal() {
    setRequestModal(null);
  }

  async function hideReceiptRequest(requestId) {
    try {
      setErrorMessage("");
      const updatedRequest = await hideReceiptRequestOnServer(requestId);

      setReceiptRequests((currentRequests) =>
        currentRequests.map((request) =>
          request.receipt_request_id === updatedRequest.receipt_request_id ? updatedRequest : request
        )
      );
      setSuccessMessage("Receipt request hidden. Use search to find it again.");
    } catch (error) {
      setErrorMessage(error.message || "Failed to hide receipt request");
    }
  }

  function closeStockModal() {
    setStockModal(null);
    setQuantity("");
  }

  async function confirmStockUpdate() {
    const qty = Number(quantity);
    if (!stockModal || !Number.isFinite(qty) || qty <= 0) {
      setErrorMessage("Quantity must be greater than 0.");
      return;
    }

    try {
      setIsUpdatingStock(true);
      setErrorMessage("");
      const updatedProduct = await updateProductStock(stockModal.product.product_id, {
        mode: stockModal.mode,
        quantity: qty,
      });

      setProducts((currentProducts) =>
        currentProducts.map((product) =>
          product.product_id === updatedProduct.product_id ? updatedProduct : product
        )
      );
      setSuccessMessage(stockModal.mode === "increase" ? "Stock imported successfully." : "Stock exported successfully.");
      closeStockModal();
    } catch (error) {
      setErrorMessage(error.message || "Failed to update stock");
    } finally {
      setIsUpdatingStock(false);
    }
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 1024px) {
            .inventory-page {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 720px) {
            .inventory-topbar,
            .inventory-header {
              flex-direction: column;
              align-items: stretch;
            }
          }
        `}
      </style>

      <div className="inventory-page" style={styles.page}>
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header className="inventory-topbar" style={styles.topbar}>
            <div style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <input
                style={styles.searchInput}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search products, receipt requests, PO, supplier..."
              />
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <RoleAvatar currentUser={currentUser} style={styles.avatar} />
            </div>
          </header>

          <div style={styles.content}>
            <div className="inventory-header" style={styles.headerRow}>
              <div>
                <h1 style={styles.title}>Inventory Management</h1>
                <p style={styles.subtitle}>Approve Staff receipt requests and directly import/export product stock.</p>
              </div>
            </div>

            <section style={styles.tableCard}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eef5" }}>
                <h2 style={{ margin: 0, fontSize: "22px", color: "#172033" }}>Confirm Receipt Requests</h2>
                <div style={styles.muted}>Pending Staff requests: {pendingRequests.length}</div>
              </div>

              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>PO ID</th>
                      <th style={styles.th}>SUPPLIER</th>
                      <th style={styles.th}>QTY RECEIVED</th>
                      <th style={styles.th}>INVOICE</th>
                      <th style={styles.th}>REQUESTED BY</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visibleReceiptRequests.map((request) => (
                      <tr key={request.receipt_request_id}>
                        <td style={styles.td}><span style={styles.poCode}>#{request.order_code}</span></td>
                        <td style={styles.td}>{request.supplier_name}</td>
                        <td style={styles.td}>{request.received_quantity || "-"}</td>
                        <td style={styles.td}>
                          {canViewInvoice(request.invoice_image_url) ? (
                            <a
                              href={request.invoice_image_url}
                              target="_blank"
                              rel="noreferrer"
                              style={{ ...styles.smallButton, display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                            >
                              View Bill
                            </a>
                          ) : (
                            request.invoice_image_url || "-"
                          )}
                        </td>
                        <td style={styles.td}>
                          {request.requested_by_username || "-"}
                          <div style={styles.muted}>{formatDate(request.requested_at)}</div>
                        </td>
                        <td style={styles.td}>
                          <span style={request.status === "approved" ? getStatusStyle("checked") : request.status === "rejected" ? getStatusStyle("waiting-delivery") : getStatusStyle("waiting-check")}>
                            {request.status}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <div style={styles.rowActions}>
                            <button type="button" style={styles.smallButton} onClick={() => openRequestModal(request)}>View</button>
                            {request.status === "pending" ? (
                              <>
                                <button type="button" style={styles.smallButton} onClick={() => updateReceiptRequest(request.receipt_request_id, "approved")}>Approve</button>
                                <button type="button" style={styles.smallButton} onClick={() => updateReceiptRequest(request.receipt_request_id, "rejected")}>Reject</button>
                              </>
                            ) : request.is_hidden ? (
                              <span style={styles.muted}>Hidden</span>
                            ) : (
                              <button type="button" style={styles.smallButton} onClick={() => hideReceiptRequest(request.receipt_request_id)}>Hide</button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {!visibleReceiptRequests.length ? <div style={styles.emptyText}>No receipt requests found.</div> : null}
            </section>

            <section style={styles.tableCard}>
              {errorMessage ? <div style={styles.errorText}>{errorMessage}</div> : null}
              {successMessage ? <div style={styles.successText}>{successMessage}</div> : null}

              <div style={{ padding: "20px 24px", borderBottom: "1px solid #e8eef5" }}>
                <h2 style={{ margin: 0, fontSize: "22px", color: "#172033" }}>Direct Stock Control</h2>
                <div style={styles.muted}>Admin can import or export stock for each product.</div>
              </div>

              <div style={styles.tableScroll}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>PRODUCT</th>
                      <th style={styles.th}>CATEGORY</th>
                      <th style={styles.th}>SUPPLIER</th>
                      <th style={styles.th}>STOCK</th>
                      <th style={styles.th}>STATUS</th>
                      <th style={styles.th}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product) => {
                      const stockStatus = getProductStockStatus(product.inventory_quantity);
                      return (
                        <tr key={product.product_id}>
                          <td style={styles.td}>
                            <div style={styles.poCode}>{product.product_name}</div>
                            <div style={styles.muted}>SKU: {product.product_id}</div>
                          </td>
                          <td style={styles.td}>{product.category || "-"}</td>
                          <td style={styles.td}>{product.supplier_name || "-"}</td>
                          <td style={styles.td}>{Number(product.inventory_quantity || 0)} pcs</td>
                          <td style={styles.td}><span style={stockStatus.style}>{stockStatus.label}</span></td>
                          <td style={styles.td}>
                            <div style={styles.rowActions}>
                              <button type="button" style={styles.smallButton} onClick={() => openStockModal(product, "increase")}>Import Stock</button>
                              <button type="button" style={styles.smallButton} onClick={() => openStockModal(product, "decrease")}>Export Stock</button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {!filteredProducts.length ? (
                <div style={styles.emptyText}>{isLoading ? "Loading inventory..." : "No products found."}</div>
              ) : null}

              <div style={styles.footer}>
                Showing {filteredProducts.length ? 1 : 0} to {filteredProducts.length} of {filteredProducts.length} products
              </div>
            </section>
          </div>
        </main>

        {requestModal ? (
          <div style={styles.overlay} onClick={closeRequestModal}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>Receipt Request #{requestModal.order_code}</h3>
                  <div style={styles.muted}>Reviewed status: {requestModal.status}</div>
                </div>
                <button type="button" style={styles.modalClose} onClick={closeRequestModal}>x</button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.resultBox}>
                  <div>
                    <strong>Supplier</strong>
                    <div style={styles.muted}>{requestModal.supplier_name || "-"}</div>
                  </div>
                  <div>
                    <strong>Quantity received</strong>
                    <div style={styles.muted}>{requestModal.received_quantity || "-"}</div>
                  </div>
                  <div>
                    <strong>Requested by</strong>
                    <div style={styles.muted}>
                      {requestModal.requested_by_username || "-"} - {formatDate(requestModal.requested_at)}
                    </div>
                  </div>
                  <div>
                    <strong>Status</strong>
                    <div style={styles.muted}>{requestModal.status || "-"}</div>
                  </div>
                  <div>
                    <strong>Invoice</strong>
                    <div style={{ marginTop: "8px" }}>
                      {canViewInvoice(requestModal.invoice_image_url) ? (
                        <a
                          href={requestModal.invoice_image_url}
                          target="_blank"
                          rel="noreferrer"
                          style={{ ...styles.smallButton, display: "inline-flex", alignItems: "center", textDecoration: "none" }}
                        >
                          View Bill
                        </a>
                      ) : (
                        <span style={styles.muted}>{requestModal.invoice_image_url || "-"}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.secondaryButton} onClick={closeRequestModal}>Close</button>
              </div>
            </div>
          </div>
        ) : null}

        {stockModal ? (
          <div style={styles.overlay} onClick={closeStockModal}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.modalHeader}>
                <div>
                  <h3 style={styles.modalTitle}>{stockModal.mode === "increase" ? "Import Stock" : "Export Stock"}</h3>
                  <div style={styles.muted}>{stockModal.product.product_name}</div>
                </div>
                <button type="button" style={styles.modalClose} onClick={closeStockModal}>x</button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.field}>
                  <label style={styles.label}>Quantity</label>
                  <input
                    type="number"
                    min="1"
                    style={styles.input}
                    value={quantity}
                    onChange={(event) => setQuantity(event.target.value)}
                    placeholder="Enter quantity"
                  />
                </div>
              </div>

              <div style={styles.modalFooter}>
                <button type="button" style={styles.secondaryButton} onClick={closeStockModal}>Cancel</button>
                <button type="button" style={styles.primaryButton} onClick={confirmStockUpdate} disabled={isUpdatingStock}>
                  {isUpdatingStock ? "Saving..." : "Confirm"}
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

function Inventory(props) {
  return isAdmin(props.currentUser) ? <AdminInventory {...props} /> : <StaffInventory {...props} />;
}

export default Inventory;
