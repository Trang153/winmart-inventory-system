import React, { useEffect, useMemo, useState } from "react";
import { getProducts } from "../../../services/product/productService";
import { getSuppliers } from "../../../services/supplier/supplierService";
import {
  createOrder,
  deleteOrder,
  getDiscountCodes,
  getOrderDetail,
  getNextOrderCode,
  getOrders,
  searchCustomers,
} from "../../../services/order/orderService";
import AppSidebar from "../../../components/AppSidebar";
import RoleAvatar from "../../../components/RoleAvatar";
import { getRoleName, isAdmin } from "../../../auth/rbac";

const navItems = [
  { label: "Dashboard", icon: "#", page: "dashboard" },
  { label: "Suppliers", icon: "O", page: "suppliers" },
  { label: "Products", icon: "[]", page: "products" },
  { label: "Inventory", icon: "[]", page: "inventory" },
  { label: "Orders", icon: "U", page: "orders" },
  { label: "Reports", icon: "|", page: "reports" },
];

const stats = [
  { title: "Total Revenue", value: "0 VND", note: "12.5% from last month", icon: "VND", tone: "green" },
  { title: "Total Orders", value: "1,234", note: "Across all statuses this month", icon: "[]", tone: "blue" },
  { title: "Pending Orders", value: "45", note: "Awaiting processing", icon: "O", tone: "yellow" },
  { title: "Delivered", value: "1,154", note: "Successfully completed", icon: "V", tone: "green" },
];

const procurementStats = [
  { title: "Total Purchase", value: "0", note: "Across all statuses this month", icon: "[]", tone: "blue" },
  { title: "Pending Purchase", value: "0", note: "Awaiting processing", icon: "O", tone: "yellow" },
  { title: "Complete", value: "0", note: "Successfully completed", icon: "V", tone: "green" },
];

const pageLabels = {
  sales: {
    title: "Sales Management",
    createTitle: "Create New Order",
    createButton: "Create Order",
    creatingButton: "Creating...",
    createdMessage: "Order created successfully",
    defaultOrderType: "Sales Order",
    searchPlaceholder: "Search orders, customers, IDs...",
    entityColumn: "CUSTOMER",
    entityDetailLabel: "Customer",
    formHeader: "[] Order Information",
    itemsHeader: "[] Order Items",
    emptyMessage: "No orders found.",
    footerNoun: "orders",
  },
  procurement: {
    title: "Purchase Management",
    createTitle: "Create New Purchase",
    createButton: "Create Purchase",
    creatingButton: "Creating...",
    createdMessage: "Purchase created successfully",
    defaultOrderType: "Purchase Order",
    searchPlaceholder: "Search purchase, supplier, IDs...",
    entityColumn: "SUPPLIERS",
    entityDetailLabel: "Supplier",
    formHeader: "[] Purchase Information",
    itemsHeader: "[] Purchase Items",
    emptyMessage: "No purchases found.",
    footerNoun: "purchases",
  },
};

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "322px 1fr", background: "#f5f7fb", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif', color: "#1f2937" },
  sidebar: { background: "#ffffff", borderRight: "1px solid #dfe7f2", padding: "22px 14px", display: "flex", flexDirection: "column" },
  brand: { margin: "8px 18px 40px", color: "#d14134", fontSize: "30px", fontWeight: 800 },
  nav: { display: "flex", flexDirection: "column", gap: "10px" },
  navItem: { display: "flex", alignItems: "center", gap: "16px", padding: "14px 18px", borderRadius: "10px", color: "#65748f", fontSize: "17px", border: "none", background: "transparent", width: "100%", textAlign: "left", cursor: "pointer" },
  navItemActive: { background: "#fff1ef", color: "#ef4335", fontWeight: 600 },
  sidebarFooter: { marginTop: "auto", display: "flex", flexDirection: "column", gap: "10px" },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #dfe7f2", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "18px" },
  search: { width: "100%", maxWidth: "540px", height: "42px", border: "1px solid #d7e1ed", borderRadius: "10px", display: "flex", alignItems: "center", gap: "12px", padding: "0 14px", color: "#94a3b8", background: "#ffffff", boxSizing: "border-box", fontSize: "16px" },
  searchInput: { flex: 1, border: "none", outline: "none", color: "#1f2937", fontSize: "16px", background: "transparent" },
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
  actionButton: { minWidth: "70px", height: "34px", borderRadius: "8px", border: "1px solid #d8e1ec", background: "#ffffff", color: "#64748b", display: "grid", placeItems: "center", fontSize: "14px", cursor: "pointer" },
  dangerActionButton: { borderColor: "#fecaca", color: "#dc2626" },
  tableFooter: { padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap" },
  footerText: { color: "#6b7a92", fontSize: "17px" },
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
  suggestionList: { border: "1px solid #d8e1ec", borderRadius: "10px", overflow: "hidden", background: "#ffffff" },
  suggestionButton: { width: "100%", border: "none", borderBottom: "1px solid #e8eef5", background: "#ffffff", padding: "12px 14px", textAlign: "left", cursor: "pointer", color: "#1f2937" },
  customerSummary: { border: "1px solid #dbe4ef", borderRadius: "10px", padding: "12px 14px", background: "#fbfdff", color: "#1f2937", display: "grid", gap: "4px" },
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
  errorText: { color: "#ef4335", fontSize: "14px" },
  successText: { color: "#22a958", fontSize: "14px" },
  emptyText: { padding: "28px", color: "#6b7a92", fontSize: "16px", textAlign: "center" },
  overlay: { position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.35)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", zIndex: 1000 },
  modal: { width: "100%", maxWidth: "820px", maxHeight: "90vh", overflow: "auto", background: "#ffffff", borderRadius: "16px", boxShadow: "0 24px 60px rgba(15, 23, 42, 0.18)" },
  modalHeader: { padding: "20px 24px", borderBottom: "1px solid #e5ebf3", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px" },
  modalTitle: { margin: 0, fontSize: "22px", fontWeight: 800, color: "#172033" },
  modalClose: { border: "none", background: "transparent", color: "#64748b", fontSize: "28px", cursor: "pointer", lineHeight: 1 },
  modalBody: { padding: "22px 24px", display: "grid", gap: "18px" },
  detailGrid: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "14px" },
  detailBox: { border: "1px solid #e5ebf3", borderRadius: "10px", padding: "12px 14px", background: "#fbfdff" },
  detailLabel: { color: "#71829d", fontSize: "13px", marginBottom: "6px" },
  detailValue: { color: "#1f2937", fontWeight: 700 },
  detailTable: { width: "100%", borderCollapse: "collapse" },
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

function getStatusTone(status) {
  const normalized = String(status || "").toLowerCase();

  if (normalized.includes("pending")) return "yellow";
  if (normalized.includes("completed") || normalized.includes("approved")) return "blue";
  return "purple";
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  });
}

function formatTime(value) {
  if (!value) return "";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
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
      .join("") || "OR"
  );
}

function matchesDateFilter(value, filter) {
  if (filter === "all-time") {
    return true;
  }

  const orderDate = new Date(value);

  if (Number.isNaN(orderDate.getTime())) {
    return false;
  }

  const now = new Date();
  const start = new Date(now);

  if (filter === "last-7-days") {
    start.setDate(now.getDate() - 7);
    return orderDate >= start;
  }

  if (filter === "this-month") {
    return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
  }

  start.setDate(now.getDate() - 30);
  return orderDate >= start;
}

function Orders({ currentPage = "orders", currentUser = null, onNavigate = () => {}, onLogout = () => {}, pageMode = "sales" }) {
  const isProcurement = pageMode === "procurement";
  const roleName = getRoleName(currentUser).toLowerCase();
  const isStaff = roleName === "staff";
  const isAdminUser = isAdmin(currentUser);
  const canCreateOrder = isProcurement || (isStaff && !isProcurement);
  const labels = isStaff && !isProcurement
    ? { ...pageLabels.sales, title: "Order" }
    : pageLabels[pageMode] || pageLabels.sales;
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [ordersList, setOrdersList] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [products, setProducts] = useState([]);
  const [discountCodes, setDiscountCodes] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [orderCode, setOrderCode] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [orderType, setOrderType] = useState(labels.defaultOrderType);
  const [orderStatus, setOrderStatus] = useState("Pending");
  const [paymentMethod, setPaymentMethod] = useState("Bank Transfer");
  const [paymentStatus, setPaymentStatus] = useState("Unpaid");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [customerId, setCustomerId] = useState(null);
  const [customerSearch, setCustomerSearch] = useState("");
  const [customerSuggestions, setCustomerSuggestions] = useState([]);
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerPoints, setCustomerPoints] = useState("0");
  const [pointsToRedeem, setPointsToRedeem] = useState("0");
  const [selectedDiscountCode, setSelectedDiscountCode] = useState("");
  const [manualDiscountAmount, setManualDiscountAmount] = useState("0");
  const [taxRate, setTaxRate] = useState("10");
  const [orderRows, setOrderRows] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [deletingOrderId, setDeletingOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [dateFilter, setDateFilter] = useState("all-time");
  const subtotal = useMemo(
    () => orderRows.reduce((sum, item) => sum + Number(item.quantity || 0) * Number(item.unit_price || 0), 0),
    [orderRows]
  );
  const selectedDiscount = discountCodes.find((discount) => discount.code === selectedDiscountCode);
  const discountAmount = selectedDiscount
    ? selectedDiscount.discount_type === "percent"
      ? (subtotal * selectedDiscount.discount_value) / 100
      : selectedDiscount.discount_value
    : isProcurement
      ? Number(manualDiscountAmount || 0)
      : 0;
  const totalAmount = useMemo(() => {
    const discounted = Math.max(0, subtotal - discountAmount);
    const totalBeforePoints = discounted + (discounted * Number(taxRate || 0)) / 100;
    const redeemablePoints = Math.min(
      Math.max(0, Math.floor(Number(pointsToRedeem || 0))),
      Math.max(0, Math.floor(Number(customerPoints || 0)))
    );
    const pointsDiscount = Math.min(redeemablePoints * 1000, totalBeforePoints);

    return Math.max(0, totalBeforePoints - pointsDiscount);
  }, [customerPoints, discountAmount, pointsToRedeem, subtotal, taxRate]);
  const redeemablePoints = useMemo(
    () => Math.min(
      Math.max(0, Math.floor(Number(pointsToRedeem || 0))),
      Math.max(0, Math.floor(Number(customerPoints || 0)))
    ),
    [customerPoints, pointsToRedeem]
  );
  const pointsDiscount = useMemo(() => {
    const discounted = Math.max(0, subtotal - discountAmount);
    const totalBeforePoints = discounted + (discounted * Number(taxRate || 0)) / 100;

    return Math.min(redeemablePoints * 1000, totalBeforePoints);
  }, [discountAmount, redeemablePoints, subtotal, taxRate]);
  const pointsEarned = useMemo(() => Math.floor(totalAmount / 100000), [totalAmount]);
  const selectedSupplier = useMemo(
    () => suppliers.find((supplier) => String(supplier.supplier_id) === String(supplierId)),
    [supplierId, suppliers]
  );
  const selectableProducts = useMemo(
    () => isProcurement
      ? products.filter((product) => String(product.supplier_id) === String(supplierId))
      : products,
    [isProcurement, products, supplierId]
  );
  const filteredOrders = useMemo(() => {
    const normalizedSearch = searchQuery.trim().toLowerCase();

    return ordersList.filter((order) => {
      const normalizedOrderType = String(order.order_type || "").toLowerCase();
      const matchesPageMode = isProcurement
        ? normalizedOrderType.includes("purchase")
        : !normalizedOrderType.includes("purchase");
      const matchesSearch = !normalizedSearch
        || String(order.order_code || "").toLowerCase().includes(normalizedSearch)
        || String(order.supplier_name || "").toLowerCase().includes(normalizedSearch)
        || String(order.customer_name || "").toLowerCase().includes(normalizedSearch)
        || String(order.customer_phone || "").toLowerCase().includes(normalizedSearch)
        || String(order.created_by_username || "").toLowerCase().includes(normalizedSearch)
        || String(order.order_status || "").toLowerCase().includes(normalizedSearch);
      const matchesStatus = statusFilter === "all-statuses" || order.order_status === statusFilter;
      const matchesDate = matchesDateFilter(order.order_date, dateFilter);

      return matchesPageMode && matchesSearch && matchesStatus && matchesDate;
    });
  }, [dateFilter, isProcurement, ordersList, searchQuery, statusFilter]);
  const displayStats = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + Number(order.total_amount || 0), 0);
    const pending = filteredOrders.filter((order) => order.order_status === "Pending").length;
    const completed = filteredOrders.filter((order) => order.order_status === "Completed").length;

    if (isProcurement) {
      return [
        { ...procurementStats[0], value: String(filteredOrders.length) },
        { ...procurementStats[1], value: String(pending) },
        { ...procurementStats[2], value: String(completed) },
      ];
    }

    return [
      { ...stats[0], value: formatCurrency(totalRevenue) },
      { ...stats[1], value: String(filteredOrders.length) },
      { ...stats[2], value: String(pending) },
      { ...stats[3], value: String(completed) },
    ];
  }, [filteredOrders, isProcurement]);

  async function loadOrderData() {
    try {
      setIsLoading(true);
      setErrorMessage("");
      const [ordersData, suppliersData, productsData, discountCodesData, nextCode] = await Promise.all([
        getOrders(),
        getSuppliers(),
        getProducts(),
        getDiscountCodes(),
        getNextOrderCode(),
      ]);

      setOrdersList(ordersData);
      setSuppliers(suppliersData);
      setProducts(productsData);
      setDiscountCodes(discountCodesData);
      setOrderCode(nextCode);

      if (!supplierId && suppliersData[0]) {
        setSupplierId(String(suppliersData[0].supplier_id));
      }

      if (!expectedDeliveryDate) {
        const deliveryDate = new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        setExpectedDeliveryDate(deliveryDate.toISOString().slice(0, 10));
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to load order data");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadOrderData();
  }, []);

  useEffect(() => {
    setOrderType(labels.defaultOrderType);
  }, [labels.defaultOrderType]);

  useEffect(() => {
    if (!canCreateOrder && isCreatingOrder) {
      setIsCreatingOrder(false);
    }
  }, [canCreateOrder, isCreatingOrder]);

  useEffect(() => {
    let isMounted = true;
    const normalizedSearch = customerSearch.trim();

    if (!normalizedSearch) {
      setCustomerSuggestions([]);
      return undefined;
    }

    const timeoutId = window.setTimeout(async () => {
      try {
        const customers = await searchCustomers(normalizedSearch);

        if (isMounted) {
          setCustomerSuggestions(customers);
        }
      } catch (_error) {
        if (isMounted) {
          setCustomerSuggestions([]);
        }
      }
    }, 250);

    return () => {
      isMounted = false;
      window.clearTimeout(timeoutId);
    };
  }, [customerSearch]);

  useEffect(() => {
    if (isCreatingOrder) {
      return undefined;
    }

    const intervalId = window.setInterval(async () => {
      try {
        const ordersData = await getOrders();
        setOrdersList(ordersData);
      } catch (_error) {
        // Keep the existing table if a background refresh fails.
      }
    }, 10000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [isCreatingOrder]);

  function addSelectedProduct() {
    const product = selectableProducts.find((item) => String(item.product_id) === String(selectedProductId));

    if (!product) {
      return;
    }

    setOrderRows((currentRows) => {
      const existingRow = currentRows.find((row) => row.product_id === product.product_id);

      if (existingRow) {
        return currentRows.map((row) =>
          row.product_id === product.product_id ? { ...row, quantity: row.quantity + 1 } : row
        );
      }

      return [
        ...currentRows,
        {
          product_id: product.product_id,
          product_name: product.product_name,
          category: product.category,
          image_url: product.image_url,
          stock: Number(product.inventory_quantity || 0),
          quantity: 1,
          unit_price: Number(product.price || 0),
        },
      ];
    });
    setSelectedProductId("");
  }

  function updateOrderRow(productId, changes) {
    setOrderRows((currentRows) =>
      currentRows.map((row) => (row.product_id === productId ? { ...row, ...changes } : row))
    );
  }

  function removeOrderRow(productId) {
    setOrderRows((currentRows) => currentRows.filter((row) => row.product_id !== productId));
  }

  function selectCustomer(customer) {
    setCustomerId(customer.customer_id);
    setCustomerSearch(`${customer.customer_name} - ${customer.phone_number}`);
    setCustomerName(customer.customer_name || "");
    setCustomerPhone(customer.phone_number || "");
    setCustomerPoints(String(customer.loyalty_points || 0));
    setPointsToRedeem("0");
    setCustomerSuggestions([]);
  }

  function clearCustomerSelection() {
    setCustomerId(null);
    setCustomerSearch("");
    setCustomerName("");
    setCustomerPhone("");
    setCustomerPoints("0");
    setPointsToRedeem("0");
    setCustomerSuggestions([]);
  }

  function resetCreateForm(nextCode = orderCode) {
    setOrderCode(nextCode);
    setOrderType(labels.defaultOrderType);
    setOrderStatus("Pending");
    setPaymentMethod("Bank Transfer");
    setPaymentStatus("Unpaid");
    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + 3);
    setExpectedDeliveryDate(deliveryDate.toISOString().slice(0, 10));
    setShippingAddress("");
    setNotes("");
    setCustomerId(null);
    setCustomerSearch("");
    setCustomerSuggestions([]);
    setCustomerName("");
    setCustomerPhone("");
    setCustomerPoints("0");
    setPointsToRedeem("0");
    setSelectedDiscountCode("");
    setManualDiscountAmount("0");
    setTaxRate("10");
    setOrderRows([]);
  }

  async function handleCreateOrder() {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setSuccessMessage("");

      const createdOrder = await createOrder({
        order_code: orderCode,
        order_type: orderType,
        supplier_id: Number(supplierId),
        created_by: currentUser?.userId || 1,
        expected_delivery_date: expectedDeliveryDate || null,
        order_status: orderStatus,
        payment_method: paymentMethod,
        payment_status: paymentStatus,
        discount_code: selectedDiscountCode || null,
        discount_amount: isProcurement ? Number(manualDiscountAmount || 0) : 0,
        tax_rate: Number(taxRate || 0),
        shipping_address: shippingAddress.trim() || null,
        notes: notes.trim() || null,
        customer_id: customerId,
        customer_name: customerName.trim() || null,
        customer_phone: customerPhone.trim() || null,
        points_redeemed: redeemablePoints,
        items: orderRows.map((row) => ({
          product_id: row.product_id,
          quantity: Number(row.quantity || 0),
          unit_price: Number(row.unit_price || 0),
        })),
      });

      const [ordersData, nextCode] = await Promise.all([
        getOrders(),
        getNextOrderCode(),
      ]);

      setOrdersList(ordersData.length ? ordersData : [createdOrder, ...ordersList]);
      resetCreateForm(nextCode);
      setSuccessMessage(labels.createdMessage);
      setIsCreatingOrder(false);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create order");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleViewOrder(orderId) {
    try {
      setIsLoadingDetail(true);
      setErrorMessage("");
      const order = await getOrderDetail(orderId);
      setSelectedOrder(order);
    } catch (error) {
      setErrorMessage(error.message || "Failed to load order detail");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  async function handleDeleteOrder(order) {
    const confirmed = window.confirm(`Delete order #${order.order_code}?`);

    if (!confirmed) {
      return;
    }

    try {
      setDeletingOrderId(order.order_id);
      setErrorMessage("");
      setSuccessMessage("");
      await deleteOrder(order.order_id);
      setOrdersList((currentOrders) => currentOrders.filter((item) => item.order_id !== order.order_id));
      setSuccessMessage("Order deleted successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete order");
    } finally {
      setDeletingOrderId(null);
    }
  }
// chỉnh nhẹ để test commit
  return (
    <>
      <style>
        {`
          @media (max-width: 1181px) {
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
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header className="orders-topbar" style={styles.topbar}>
            <div className="orders-search" style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <input
                style={styles.searchInput}
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={labels.searchPlaceholder}
              />
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <RoleAvatar currentUser={currentUser} style={styles.avatar} />
            </div>
          </header>

          <div style={styles.content}>
            {canCreateOrder && isCreatingOrder ? (
              <>
                <div style={styles.createHeader}>
                  <button type="button" style={styles.backButton} onClick={() => setIsCreatingOrder(false)}>
                    {"<"}
                  </button>
                  <h1 style={styles.title}>{labels.createTitle}</h1>
                </div>

                <div className="orders-create-grid" style={styles.createGrid}>
                  <div style={styles.leftColumn}>
                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>{labels.formHeader}</div>
                      <div style={styles.formBody}>
                        <div style={styles.field}>
                          <label style={styles.label}>Order Type</label>
                          <select style={styles.input} value={orderType} onChange={(event) => setOrderType(event.target.value)}>
                            <option value={labels.defaultOrderType}>{labels.defaultOrderType}</option>
                          </select>
                        </div>
                        <div className="orders-field-two" style={styles.fieldTwo}>
                          <div style={styles.field}>
                            <label style={styles.label}>Order ID</label>
                            <input style={{ ...styles.input, ...styles.inputMuted }} value={orderCode} readOnly />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Order Date</label>
                            <input style={{ ...styles.input, ...styles.inputMuted }} value={new Date().toLocaleDateString("en-US")} readOnly />
                          </div>
                        </div>
                        <div style={styles.field}>
                          <label style={styles.label}>Created By</label>
                          <input style={{ ...styles.input, ...styles.inputMuted }} value={currentUser?.username || "Admin User"} readOnly />
                        </div>
                      </div>
                    </section>

                    {isProcurement ? (
                      <>
                        <section style={styles.formCard}>
                          <div style={styles.formHeader}>Supplier Details</div>
                          <div style={styles.formBody}>
                            <div style={styles.field}>
                              <label style={styles.label}>Select Supplier</label>
                              <select
                                style={styles.input}
                                value={supplierId}
                                onChange={(event) => {
                                  setSupplierId(event.target.value);
                                  setSelectedProductId("");
                                  setOrderRows([]);
                                }}
                              >
                                {suppliers.map((supplier) => (
                                  <option key={supplier.supplier_id} value={supplier.supplier_id}>
                                    {supplier.supplier_name}
                                  </option>
                                ))}
                              </select>
                            </div>
                            <div className="orders-field-two" style={styles.fieldTwo}>
                              <div style={styles.field}>
                                <label style={styles.label}>Category</label>
                                <input style={{ ...styles.input, ...styles.inputMuted }} value={selectedSupplier?.category || "-"} readOnly />
                              </div>
                              <div style={styles.field}>
                                <label style={styles.label}>Contact</label>
                                <input style={{ ...styles.input, ...styles.inputMuted }} value={selectedSupplier?.contact_info || "-"} readOnly />
                              </div>
                            </div>
                          </div>
                        </section>

                        <section style={styles.formCard}>
                          <div style={styles.formHeader}>Shipping & Status</div>
                          <div style={styles.formBody}>
                            <div style={styles.field}>
                              <label style={styles.label}>Order Status</label>
                              <select style={styles.input} value={orderStatus} onChange={(event) => setOrderStatus(event.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Approved">Approved</option>
                              </select>
                            </div>
                            <div style={styles.field}>
                              <label style={styles.label}>Expected Delivery Date</label>
                              <input
                                type="date"
                                style={styles.input}
                                value={expectedDeliveryDate}
                                onChange={(event) => setExpectedDeliveryDate(event.target.value)}
                              />
                            </div>
                            <div style={styles.field}>
                              <label style={styles.label}>Shipping Address</label>
                              <textarea
                                style={styles.textarea}
                                value={shippingAddress}
                                onChange={(event) => setShippingAddress(event.target.value)}
                                placeholder="Warehouse or receiving location"
                              />
                            </div>
                            <div style={styles.field}>
                              <label style={styles.label}>Notes</label>
                              <textarea
                                style={styles.textarea}
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Internal note for Staff inventory"
                              />
                            </div>
                          </div>
                        </section>
                      </>
                    ) : (
                      <section style={styles.formCard}>
                        <div style={styles.formHeader}>/ Customer Information</div>
                        <div style={styles.formBody}>
                          <div style={styles.field}>
                            <label style={styles.label}>Search Customer</label>
                            <input
                              style={styles.input}
                              value={customerSearch}
                              onChange={(event) => {
                                setCustomerSearch(event.target.value);
                                setCustomerId(null);
                              }}
                              placeholder="Search by name or phone number"
                            />
                            {customerSuggestions.length ? (
                              <div style={styles.suggestionList}>
                                {customerSuggestions.map((customer) => (
                                  <button
                                    key={customer.customer_id}
                                    type="button"
                                    style={styles.suggestionButton}
                                    onClick={() => selectCustomer(customer)}
                                  >
                                    <strong>{customer.customer_name}</strong>
                                    <div style={styles.itemMeta}>
                                      {customer.phone_number} - {customer.loyalty_points} pts
                                    </div>
                                  </button>
                                ))}
                              </div>
                            ) : null}
                          </div>

                          {customerId ? (
                            <div style={styles.customerSummary}>
                              <strong>{customerName}</strong>
                              <span>{customerPhone}</span>
                              <span>{customerPoints} accumulated points</span>
                              <button type="button" style={styles.cancelLink} onClick={clearCustomerSelection}>
                                Change customer
                              </button>
                            </div>
                          ) : null}

                          <div style={styles.field}>
                            <label style={styles.label}>Name</label>
                            <input
                              style={styles.input}
                              value={customerName}
                              onChange={(event) => setCustomerName(event.target.value)}
                              placeholder="Enter customer name"
                              readOnly={Boolean(customerId)}
                            />
                          </div>
                          <div style={styles.field}>
                            <label style={styles.label}>Phone Number</label>
                            <input
                              style={styles.input}
                              value={customerPhone}
                              onChange={(event) => setCustomerPhone(event.target.value)}
                              placeholder="Enter phone number"
                              readOnly={Boolean(customerId)}
                            />
                          </div>
                          <div className="orders-field-two" style={styles.fieldTwo}>
                            <div style={styles.field}>
                              <label style={styles.label}>Current Points</label>
                              <input
                                type="number"
                                min="0"
                                style={styles.input}
                                value={customerPoints}
                                readOnly
                              />
                            </div>
                            <div style={styles.field}>
                              <label style={styles.label}>Apply Points</label>
                              <input
                                type="number"
                                min="0"
                                style={styles.input}
                                value={pointsToRedeem}
                                onChange={(event) => setPointsToRedeem(event.target.value)}
                              />
                            </div>
                          </div>
                          <div style={styles.itemMeta}>
                            Earn 1 point per 100,000 VND. 1 point reduces the bill by 1,000 VND.
                          </div>
                        </div>
                      </section>
                    )}
                  </div>

                  <div style={styles.rightColumn}>
                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>{labels.itemsHeader}</div>
                      <div style={styles.formBody}>
                        <div style={styles.itemToolbar}>
                          <div style={styles.itemSearch}>
                            <span>Q</span>
                            <select
                              style={{ border: "none", outline: "none", flex: 1, color: "#64748b", fontSize: "15px", background: "transparent" }}
                              value={selectedProductId}
                              onChange={(event) => setSelectedProductId(event.target.value)}
                            >
                              <option value="">Search product name, SKU, or scan barcode...</option>
                              {selectableProducts.map((product) => (
                                <option key={product.product_id} value={product.product_id}>
                                  {product.product_name} - {Number(product.inventory_quantity || 0)} pcs
                                </option>
                              ))}
                            </select>
                          </div>
                          <button type="button" style={styles.scanButton}>[]</button>
                          <button type="button" style={styles.addButton} onClick={addSelectedProduct}>Add</button>
                        </div>

                        <div style={styles.itemsHead}>
                          <span>PRODUCT DETAILS</span>
                          <span>QUANTITY</span>
                          <span>UNIT PRICE</span>
                          <span>TOTAL</span>
                          <span />
                        </div>

                        {orderRows.map((item) => (
                          <div key={item.product_id} style={styles.itemRow}>
                            <div style={styles.itemProduct}>
                              {item.image_url ? (
                                <img src={item.image_url} alt={item.product_name} style={styles.itemImage} />
                              ) : (
                                <div style={styles.itemImage}>{getInitials(item.product_name)}</div>
                              )}
                              <div>
                                <div style={styles.itemName}>{item.product_name}</div>
                                <div style={styles.itemMeta}>
                                  Product ID: {item.product_id} - In Stock: {item.stock} pcs
                                </div>
                              </div>
                            </div>
                            <div style={styles.quantityBox}>
                              <button type="button" style={styles.qtyBtn} onClick={() => updateOrderRow(item.product_id, { quantity: Math.max(1, item.quantity - 1) })}>-</button>
                              <div style={styles.qtyValue}>{item.quantity}</div>
                              <button type="button" style={styles.qtyBtn} onClick={() => updateOrderRow(item.product_id, { quantity: item.quantity + 1 })}>+</button>
                            </div>
                            <div style={styles.currencyRow}>
                              <span>VND</span>
                              <input
                                style={styles.smallInput}
                                value={item.unit_price}
                                onChange={(event) => updateOrderRow(item.product_id, { unit_price: Number(event.target.value || 0) })}
                              />
                            </div>
                            <div style={{ fontWeight: 700 }}>{formatCurrency(item.quantity * item.unit_price)}</div>
                            <button type="button" style={styles.deleteBtn} onClick={() => removeOrderRow(item.product_id)}>X</button>
                          </div>
                        ))}

                        {!orderRows.length ? <div style={styles.customRow}>Select a product and click Add</div> : null}
                        {isProcurement && supplierId && !selectableProducts.length ? (
                          <div style={styles.customRow}>No products found for this supplier</div>
                        ) : null}
                      </div>
                    </section>

                    <section style={styles.formCard}>
                      <div style={styles.formHeader}>[] Payment & Summary</div>
                      <div style={styles.formBody}>
                        <div className="orders-payment-grid" style={isProcurement ? { display: "grid", gap: "22px" } : styles.paymentGrid}>
                          {!isProcurement ? (
                          <div style={{ display: "grid", gap: "16px" }}>
                            <div style={styles.field}>
                              <label style={styles.label}>Payment Method</label>
                              <select style={styles.input} value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
                                <option value="Bank Transfer">Bank Transfer</option>
                                <option value="Cash">Cash</option>
                              </select>
                            </div>
                            <div style={styles.field}>
                              <label style={styles.label}>Payment Status</label>
                              <select style={styles.input} value={paymentStatus} onChange={(event) => setPaymentStatus(event.target.value)}>
                                <option value="Unpaid">Unpaid</option>
                                <option value="Paid">Paid</option>
                              </select>
                            </div>
                          </div>
                          ) : null}

                          <div style={styles.summaryBox}>
                            <div style={styles.summaryRow}>
                              <span>Subtotal</span>
                              <strong style={{ color: "#1f2937" }}>{formatCurrency(subtotal)}</strong>
                            </div>
                            {!isProcurement ? (
                              <div style={styles.summaryRow}>
                                <span>Discount</span>
                                <select
                                  style={{ ...styles.input, width: "170px", height: "34px" }}
                                  value={selectedDiscountCode}
                                  onChange={(event) => setSelectedDiscountCode(event.target.value)}
                                >
                                  <option value="">No code</option>
                                  {discountCodes.map((discount) => (
                                    <option key={discount.discount_code_id} value={discount.code}>
                                      {discount.code}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            ) : null}
                            <div style={styles.summaryRow}>
                              <span>Discount Amount</span>
                              {isProcurement ? (
                                <div style={styles.summaryInput}>
                                  <div style={styles.summaryPrefix}>VND</div>
                                  <input
                                    style={styles.summaryField}
                                    value={manualDiscountAmount}
                                    onChange={(event) => setManualDiscountAmount(event.target.value)}
                                  />
                                </div>
                              ) : (
                                <strong style={{ color: "#1f2937" }}>-{formatCurrency(discountAmount)}</strong>
                              )}
                            </div>
                            <div style={styles.summaryRow}>
                              <span>Tax</span>
                              <div style={styles.summaryInput}>
                                <div style={styles.summaryPrefix}>%</div>
                                <input style={styles.summaryField} value={taxRate} onChange={(event) => setTaxRate(event.target.value)} />
                              </div>
                            </div>
                            {!isProcurement ? (
                              <>
                                <div style={styles.summaryRow}>
                                  <span>Points Applied</span>
                                  <strong style={{ color: "#1f2937" }}>{redeemablePoints} pts</strong>
                                </div>
                                <div style={styles.summaryRow}>
                                  <span>Point Discount</span>
                                  <strong style={{ color: "#1f2937" }}>-{formatCurrency(pointsDiscount)}</strong>
                                </div>
                              </>
                            ) : null}
                            <div style={styles.summaryDivider} />
                            <div style={styles.totalWrap}>
                              <span>Total Amount</span>
                              <span>{formatCurrency(totalAmount)}</span>
                            </div>
                            {!isProcurement ? <div style={{ ...styles.itemMeta, marginTop: "12px" }}>
                              Earned after payment: {pointsEarned} pts
                            </div> : null}
                          </div>
                        </div>

                        <div className="orders-form-footer" style={styles.footerActions}>
                          <button type="button" style={styles.cancelLink} onClick={() => setIsCreatingOrder(false)}>
                            Cancel
                          </button>

                          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                            {errorMessage ? <span style={styles.errorText}>{errorMessage}</span> : null}
                            <button type="button" style={styles.secondaryButton} onClick={() => setOrderStatus("Pending")}>Save Draft</button>
                            <button type="button" style={styles.primaryButton} onClick={handleCreateOrder} disabled={isSubmitting}>
                              {isSubmitting ? labels.creatingButton : labels.createButton}
                            </button>
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
                  <h1 style={styles.title}>{labels.title}</h1>

                  <div style={styles.headerActions}>
                    <button type="button" style={styles.secondaryButton}>
                      <span>T</span>
                      <span>Export Report</span>
                    </button>
                    {canCreateOrder ? (
                      <button type="button" style={styles.primaryButton} onClick={() => setIsCreatingOrder(true)}>
                        <span>+</span>
                        <span>{labels.createButton}</span>
                      </button>
                    ) : null}
                  </div>
                </div>

                <div className="orders-stats" style={{ ...styles.statsGrid, gridTemplateColumns: `repeat(${displayStats.length}, 1fr)` }}>
                  {displayStats.map((stat) => {
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
                  <select style={styles.selectBox} value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                    <option value="all-statuses">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                  <select style={styles.selectBox} value={dateFilter} onChange={(event) => setDateFilter(event.target.value)}>
                    <option value="all-time">All Time</option>
                    <option value="last-7-days">Last 7 Days</option>
                    <option value="last-30-days">Last 30 Days</option>
                    <option value="this-month">This Month</option>
                  </select>
                </div>

                <section style={styles.tableCard}>
                  {errorMessage ? <div style={{ padding: "18px 28px 0", ...styles.errorText }}>{errorMessage}</div> : null}
                  {successMessage ? <div style={{ padding: "18px 28px 0", ...styles.successText }}>{successMessage}</div> : null}

                  <div style={styles.tableScroll}>
                    <table style={styles.table}>
                      <thead>
                        <tr>
                          <th style={styles.th}>ORDER ID</th>
                          <th style={styles.th}>{labels.entityColumn}</th>
                          <th style={styles.th}>DATE</th>
                          <th style={styles.th}>ITEMS</th>
                          <th style={styles.th}>TOTAL AMOUNT</th>
                          <th style={styles.th}>STATUS</th>
                          <th style={styles.th}>ACTION</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredOrders.map((order) => (
                          <tr key={order.order_id}>
                            <td style={styles.td}>#{order.order_code}</td>
                            <td style={styles.td}>
                              <div style={styles.customerCell}>
                                <div style={styles.customerAvatar}>{getInitials(isProcurement ? order.supplier_name : (order.customer_name || order.supplier_name))}</div>
                                <div>
                                  <div style={styles.customerName}>{isProcurement ? order.supplier_name : (order.customer_name || order.supplier_name)}</div>
                                  <div style={styles.customerEmail}>
                                    {!isProcurement && order.customer_phone ? `${order.customer_phone} - ` : ""}Created by {order.created_by_username || "-"}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td style={styles.td}>
                              <div style={styles.dateText}>{formatDate(order.order_date)}</div>
                              <div style={styles.timeText}>{formatTime(order.order_date)}</div>
                            </td>
                            <td style={styles.td}>{order.item_count} items</td>
                            <td style={styles.td}>{formatCurrency(order.total_amount)}</td>
                            <td style={styles.td}>
                              <span style={getStatusStyle(getStatusTone(order.order_status))}>{order.order_status}</span>
                            </td>
                            <td style={styles.td}>
                              <div style={styles.actionWrap}>
                                <button
                                  type="button"
                                  style={styles.actionButton}
                                  onClick={() => handleViewOrder(order.order_id)}
                                  disabled={isLoadingDetail}
                                >
                                  View
                                </button>
                                {isAdminUser && !isProcurement ? (
                                  <button
                                    type="button"
                                    style={{ ...styles.actionButton, ...styles.dangerActionButton }}
                                    onClick={() => handleDeleteOrder(order)}
                                    disabled={deletingOrderId === order.order_id}
                                  >
                                    {deletingOrderId === order.order_id ? "Deleting" : "Delete"}
                                  </button>
                                ) : null}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {!filteredOrders.length ? <div style={styles.emptyText}>{isLoading ? "Loading orders..." : labels.emptyMessage}</div> : null}

                  <div className="orders-footer" style={styles.tableFooter}>
                    <div style={styles.footerText}>
                      Showing {filteredOrders.length ? 1 : 0} to {filteredOrders.length} of {filteredOrders.length} {labels.footerNoun}
                    </div>
                  </div>
                </section>
              </>
            )}
          </div>
        </main>

        {selectedOrder ? (
          <div style={styles.overlay} onClick={() => setSelectedOrder(null)}>
            <div style={styles.modal} onClick={(event) => event.stopPropagation()}>
              <div style={styles.modalHeader}>
                <h3 style={styles.modalTitle}>Order #{selectedOrder.order_code}</h3>
                <button type="button" style={styles.modalClose} onClick={() => setSelectedOrder(null)}>
                  ×
                </button>
              </div>

              <div style={styles.modalBody}>
                <div style={styles.detailGrid}>
                  <div style={styles.detailBox}>
                    <div style={styles.detailLabel}>{labels.entityDetailLabel}</div>
                    <div style={styles.detailValue}>{isProcurement ? selectedOrder.supplier_name : (selectedOrder.customer_name || "-")}</div>
                    <div style={styles.customerEmail}>{isProcurement ? `Created by ${selectedOrder.created_by_username || "-"}` : (selectedOrder.customer_phone || "-")}</div>
                  </div>
                  <div style={styles.detailBox}>
                    <div style={styles.detailLabel}>Status</div>
                    <span style={getStatusStyle(getStatusTone(selectedOrder.order_status))}>{selectedOrder.order_status}</span>
                  </div>
                  <div style={styles.detailBox}>
                    <div style={styles.detailLabel}>Order Date</div>
                    <div style={styles.detailValue}>{formatDate(selectedOrder.order_date)} {formatTime(selectedOrder.order_date)}</div>
                  </div>
                  <div style={styles.detailBox}>
                    <div style={styles.detailLabel}>Total Amount</div>
                    <div style={styles.detailValue}>{formatCurrency(selectedOrder.total_amount)}</div>
                  </div>
                  <div style={styles.detailBox}>
                    <div style={styles.detailLabel}>Discount</div>
                    <div style={styles.detailValue}>
                      {selectedOrder.discount_code || "No code"} - {formatCurrency(selectedOrder.discount_amount)}
                    </div>
                  </div>
                  <div style={styles.detailBox}>
                    <div style={styles.detailLabel}>Loyalty Points</div>
                    <div style={styles.detailValue}>
                      Used {selectedOrder.points_redeemed || 0} pts, earned {selectedOrder.points_earned || 0} pts
                    </div>
                  </div>
                </div>

                <table style={styles.detailTable}>
                  <thead>
                    <tr>
                      <th style={styles.th}>PRODUCT</th>
                      <th style={styles.th}>QTY</th>
                      <th style={styles.th}>UNIT PRICE</th>
                      <th style={styles.th}>TOTAL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(selectedOrder.items || []).map((item) => (
                      <tr key={item.order_item_id}>
                        <td style={styles.td}>{item.product_name}</td>
                        <td style={styles.td}>{item.quantity}</td>
                        <td style={styles.td}>{formatCurrency(item.unit_price)}</td>
                        <td style={styles.td}>{formatCurrency(item.line_total)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {!selectedOrder.items?.length ? <div style={styles.emptyText}>No order items found.</div> : null}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}

export default Orders;
