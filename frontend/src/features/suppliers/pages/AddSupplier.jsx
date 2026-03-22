import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  createSupplier,
  getSupplierDetail,
  getSuppliers,
  updateSupplier,
  uploadSupplierImage,
} from "../../../services/supplier/supplierService";

const navItems = [
  { page: "dashboard", label: "Dashboard", icon: "#" },
  { page: "suppliers", label: "Suppliers", icon: "O" },
  { page: "products", label: "Products", icon: "[]" },
  { page: "inventory", label: "Inventory", icon: "[]" },
  { page: "orders", label: "Orders", icon: "U" },
  { page: "reports", label: "Reports", icon: "|" },
  { page: "rating", label: "Rating", icon: "/" },
];

const categoryOptions = ["Snacks", "Dairy", "Drinks", "Frozen Food", "Household"];

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "260px 1fr",
    background: "#f5f7fb",
    color: "#2f3747",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #e7ecf3",
    display: "flex",
    flexDirection: "column",
    padding: "28px 16px 24px",
  },
  brand: {
    margin: "6px 14px 48px",
    color: "#d93d31",
    fontSize: "34px",
    lineHeight: 1,
    fontWeight: 800,
    letterSpacing: "-1px",
  },
  nav: {
    display: "grid",
    gap: "10px",
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    width: "100%",
    border: "none",
    background: "transparent",
    borderRadius: "12px",
    padding: "14px 16px",
    color: "#5f6d84",
    fontSize: "16px",
    cursor: "pointer",
    textAlign: "left",
  },
  navItemActive: {
    color: "#e44537",
    background: "#fff1ee",
    fontWeight: 600,
  },
  navIcon: {
    width: "24px",
    textAlign: "center",
    fontSize: "18px",
  },
  navFooter: {
    marginTop: "auto",
    display: "grid",
    gap: "10px",
  },
  main: {
    minWidth: 0,
    display: "flex",
    flexDirection: "column",
  },
  topbar: {
    height: "76px",
    background: "#ffffff",
    borderBottom: "1px solid #e7ecf3",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 30px",
    gap: "20px",
  },
  search: {
    width: "100%",
    maxWidth: "382px",
    height: "40px",
    border: "1px solid #dde4ef",
    borderRadius: "10px",
    background: "#ffffff",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    color: "#98a3b6",
    padding: "0 14px",
    boxSizing: "border-box",
    fontSize: "14px",
  },
  topbarRight: {
    display: "flex",
    alignItems: "center",
    gap: "18px",
    color: "#6b7990",
  },
  avatar: {
    width: "38px",
    height: "38px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #f2d7c6, #8a5630)",
    display: "grid",
    placeItems: "center",
    color: "#ffffff",
    fontWeight: 700,
  },
  content: {
    padding: "0",
    flex: 1,
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.55fr 0.95fr",
    minHeight: "calc(100vh - 76px)",
  },
  listSection: {
    padding: "34px 30px",
    borderRight: "1px solid #e7ecf3",
  },
  formSection: {
    background: "#ffffff",
    display: "flex",
    flexDirection: "column",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #e1e8f0",
    borderRadius: "16px",
    overflow: "hidden",
    minHeight: "100%",
    display: "flex",
    flexDirection: "column",
  },
  cardHeader: {
    padding: "22px 22px 18px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "12px",
    flexWrap: "wrap",
  },
  title: {
    margin: 0,
    fontSize: "18px",
    fontWeight: 700,
    color: "#273041",
  },
  actionGroup: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  secondaryButton: {
    height: "34px",
    padding: "0 16px",
    borderRadius: "8px",
    border: "1px solid #d7dee8",
    background: "#ffffff",
    color: "#2f3747",
    fontSize: "14px",
    cursor: "pointer",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "16px 22px",
    color: "#6f7d92",
    fontSize: "14px",
    fontWeight: 500,
    borderTop: "1px solid #edf2f7",
    borderBottom: "1px solid #edf2f7",
  },
  td: {
    padding: "15px 22px",
    color: "#2f3747",
    fontSize: "14px",
    borderBottom: "1px solid #edf2f7",
  },
  statusComplete: {
    color: "#22a958",
    fontWeight: 500,
  },
  statusPending: {
    color: "#ef4335",
    fontWeight: 500,
  },
  actionLink: {
    color: "#71809a",
    background: "transparent",
    border: "none",
    padding: 0,
    cursor: "pointer",
  },
  tableFooter: {
    marginTop: "auto",
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    padding: "16px 22px",
    color: "#6b7990",
  },
  pagerButton: {
    height: "34px",
    minWidth: "88px",
    borderRadius: "8px",
    border: "1px solid #d7dee8",
    background: "#ffffff",
    color: "#2f3747",
    cursor: "pointer",
  },
  pagerButtonEnd: {
    justifySelf: "end",
  },
  formHeader: {
    padding: "22px 30px",
    borderBottom: "1px solid #e7ecf3",
  },
  formBody: {
    padding: "28px 30px 24px",
    display: "grid",
    gap: "22px",
  },
  uploadArea: {
    display: "grid",
    gridTemplateColumns: "130px 1fr",
    alignItems: "center",
    gap: "18px",
  },
  uploadCircle: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    border: "2px dashed #cfd8e5",
    display: "grid",
    placeItems: "center",
    color: "#9aa7bb",
    fontSize: "34px",
    justifySelf: "center",
  },
  uploadText: {
    color: "#69768d",
    lineHeight: 1.6,
    fontSize: "15px",
  },
  browseText: {
    color: "#e44537",
    fontWeight: 500,
  },
  uploadPreview: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    objectFit: "cover",
    justifySelf: "center",
    border: "2px solid #e7ecf3",
  },
  fieldRow: {
    display: "grid",
    gridTemplateColumns: "132px 1fr",
    alignItems: "center",
    gap: "14px",
  },
  label: {
    fontSize: "15px",
    color: "#202939",
    fontWeight: 500,
  },
  input: {
    width: "100%",
    height: "40px",
    border: "1px solid #d7dee8",
    borderRadius: "8px",
    padding: "0 14px",
    color: "#2f3747",
    background: "#ffffff",
    outline: "none",
  },
  select: {
    width: "100%",
    height: "40px",
    border: "1px solid #d7dee8",
    borderRadius: "8px",
    padding: "0 14px",
    color: "#2f3747",
    background: "#ffffff",
    outline: "none",
  },
  policyButtons: {
    display: "flex",
    gap: "12px",
  },
  policyButton: {
    flex: 1,
    height: "56px",
    borderRadius: "8px",
    border: "1px solid #d7dee8",
    background: "#ffffff",
    color: "#6f7d92",
    cursor: "pointer",
    lineHeight: 1.2,
  },
  policyButtonActive: {
    background: "#f8f5f1",
    color: "#202939",
  },
  formFooter: {
    marginTop: "auto",
    padding: "24px 30px",
    borderTop: "1px solid #e7ecf3",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
  },
  discardButton: {
    height: "42px",
    minWidth: "98px",
    borderRadius: "8px",
    border: "1px solid #d7dee8",
    background: "#ffffff",
    color: "#2f3747",
    cursor: "pointer",
  },
  primaryButton: {
    height: "42px",
    minWidth: "114px",
    borderRadius: "8px",
    border: "none",
    background: "#d93d31",
    color: "#ffffff",
    cursor: "pointer",
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
            <span style={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div style={styles.navFooter}>
        <button type="button" onClick={() => onNavigate("settings")} style={styles.navItem}>
          <span style={styles.navIcon}>*</span>
          <span>Settings</span>
        </button>
        <button type="button" style={{ ...styles.navItem, color: "#e44537" }} onClick={onLogout}>
          <span style={styles.navIcon}>-</span>
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
}

function AddSupplier({ currentPage = "suppliers", onNavigate = () => {}, onLogout = () => {} }) {
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get("id");
  const isDetailMode = Boolean(supplierId);
  const [supplierRows, setSupplierRows] = useState([]);
  const [supplierName, setSupplierName] = useState("");
  const [category, setCategory] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [totalOrderValue, setTotalOrderValue] = useState("");
  const [returnPolicy, setReturnPolicy] = useState("accept");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        const suppliers = await getSuppliers();

        if (isMounted) {
          setSupplierRows(suppliers);
        }
      } catch (_error) {
        if (isMounted) {
          setSupplierRows([]);
        }
      }
    }

    loadSuppliers();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadSupplierDetail() {
      if (!supplierId) {
        setSupplierName("");
        setCategory("");
        setContactInfo("");
        setTotalOrderValue("");
        setErrorMessage("");
        setMessage("");
        return;
      }

      try {
        setIsLoadingDetail(true);
        setErrorMessage("");
        setMessage("");
        const supplier = await getSupplierDetail(supplierId);

        if (isMounted) {
          setSupplierName(supplier.supplier_name || "");
          setCategory(supplier.category || "");
          setContactInfo(supplier.contact_info || "");
          setTotalOrderValue(String(supplier.total_order_value || ""));
          setImageUrl(supplier.image_url || "");
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load supplier detail");
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetail(false);
        }
      }
    }

    loadSupplierDetail();

    return () => {
      isMounted = false;
    };
  }, [supplierId]);

  async function handleSubmitSupplier() {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setMessage("");

      const payload = {
        supplier_name: supplierName.trim(),
        category: category || null,
        contact_info: contactInfo.trim() || null,
        image_url: imageUrl || null,
        total_order_value: Number(totalOrderValue || 0),
      };

      if (isDetailMode) {
        await updateSupplier(supplierId, payload);
        setMessage("Supplier updated successfully");
      } else {
        await createSupplier(payload);
        setMessage("Supplier created successfully");
        setSupplierName("");
        setCategory("");
        setContactInfo("");
        setTotalOrderValue("");
        setImageUrl("");
        setReturnPolicy("accept");
      }

      const suppliers = await getSuppliers();
      setSupplierRows(suppliers);
    } catch (error) {
      setErrorMessage(error.message || "Failed to create supplier");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);
      setErrorMessage("");
      setMessage("");
      const result = await uploadSupplierImage(file);
      setImageUrl(result.imageUrl);
      setMessage("Image uploaded successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .add-supplier-page {
              grid-template-columns: 1fr;
            }

            .add-supplier-layout {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 720px) {
            .add-supplier-topbar {
              padding: 16px;
              flex-direction: column;
              align-items: stretch;
              height: auto;
            }

            .add-supplier-list-section,
            .add-supplier-form-body,
            .add-supplier-form-header,
            .add-supplier-form-footer {
              padding-left: 16px !important;
              padding-right: 16px !important;
            }

            .add-supplier-field-row,
            .add-supplier-upload {
              grid-template-columns: 1fr !important;
            }

            .add-supplier-policy {
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="add-supplier-page" style={styles.page}>
        <Sidebar currentPage={currentPage} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header className="add-supplier-topbar" style={styles.topbar}>
            <div style={styles.search}>
              <span>Q</span>
              <span>Search product, supplier, order</span>
            </div>

            <div style={styles.topbarRight}>
              <span>!</span>
              <div style={styles.avatar}>U</div>
            </div>
          </header>

          <div style={styles.content}>
            <div className="add-supplier-layout" style={styles.layout}>
              <section className="add-supplier-list-section" style={styles.listSection}>
                <div style={styles.card}>
                  <div style={styles.cardHeader}>
                    <h1 style={styles.title}>Supplier</h1>

                    <div style={styles.actionGroup}>
                      <button type="button" style={styles.secondaryButton}>
                        Filters
                      </button>
                      <button type="button" style={styles.secondaryButton}>
                        Download all
                      </button>
                    </div>
                  </div>

                  <table style={styles.table}>
                    <thead>
                      <tr>
                        <th style={styles.th}>Supplier ID</th>
                        <th style={styles.th}>Supplier Name</th>
                        <th style={styles.th}>Category</th>
                        <th style={styles.th}>Status</th>
                        <th style={styles.th}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {supplierRows.map((supplier) => (
                        <tr key={supplier.supplier_id}>
                          <td style={styles.td}>{supplier.supplier_id}</td>
                          <td style={styles.td}>{supplier.supplier_name}</td>
                          <td style={styles.td}>{supplier.category}</td>
                          <td
                            style={{
                              ...styles.td,
                              ...styles.statusComplete,
                            }}
                          >
                            Active
                          </td>
                          <td style={styles.td}>
                            <button
                              type="button"
                              style={styles.actionLink}
                              onClick={() => onNavigate(`/suppliers/new?id=${supplier.supplier_id}`)}
                            >
                              View / Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>

                  <div style={styles.tableFooter}>
                    <button type="button" style={styles.pagerButton}>
                      Previous
                    </button>
                    <div>Page 1 of 10</div>
                    <button type="button" style={{ ...styles.pagerButton, ...styles.pagerButtonEnd }}>
                      Next
                    </button>
                  </div>
                </div>
              </section>

              <section style={styles.formSection}>
                <div className="add-supplier-form-header" style={styles.formHeader}>
                  <h2 style={{ ...styles.title, fontSize: "17px" }}>
                    {isDetailMode ? "Supplier Detail" : "New Supplier"}
                  </h2>
                </div>

                <div className="add-supplier-form-body" style={styles.formBody}>
                  <div className="add-supplier-upload" style={styles.uploadArea}>
                    {imageUrl ? (
                      <img src={imageUrl} alt="Supplier" style={styles.uploadPreview} />
                    ) : (
                      <div style={styles.uploadCircle}>U</div>
                    )}
                    <div style={styles.uploadText}>
                      <div>{isUploadingImage ? "Uploading image..." : "Drag image here"}</div>
                      <div>or</div>
                      <button
                        type="button"
                        style={{
                          border: "none",
                          background: "transparent",
                          padding: 0,
                          ...styles.browseText,
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoadingDetail || isUploadingImage}
                      >
                        Browse image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        disabled={isLoadingDetail || isUploadingImage}
                      />
                      {imageUrl ? (
                        <div style={{ fontSize: "12px", marginTop: "8px", wordBreak: "break-all" }}>
                          {imageUrl}
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <label htmlFor="supplier-name" style={styles.label}>
                      Supplier Name
                    </label>
                    <input
                      id="supplier-name"
                      type="text"
                      placeholder="Enter supplier name"
                      style={styles.input}
                      value={supplierName}
                      onChange={(event) => setSupplierName(event.target.value)}
                      disabled={isLoadingDetail}
                    />
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <label htmlFor="supplier-id" style={styles.label}>
                      Supplier ID
                    </label>
                    <input
                      id="supplier-id"
                      type="text"
                      placeholder="Generated by system"
                      style={styles.input}
                      value={supplierId || ""}
                      disabled
                    />
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <label htmlFor="category" style={styles.label}>
                      Category
                    </label>
                    <select
                      id="category"
                      value={category}
                      style={styles.select}
                      onChange={(event) => setCategory(event.target.value)}
                      disabled={isLoadingDetail}
                    >
                      <option value="">
                        Select product category
                      </option>
                      {categoryOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <label htmlFor="buying-price" style={styles.label}>
                      Buying Price
                    </label>
                    <input
                      id="buying-price"
                      type="text"
                      placeholder="Enter buying price"
                      style={styles.input}
                      value={totalOrderValue}
                      onChange={(event) => setTotalOrderValue(event.target.value)}
                      disabled={isLoadingDetail}
                    />
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <label htmlFor="contact-number" style={styles.label}>
                      Contact Number
                    </label>
                    <input
                      id="contact-number"
                      type="text"
                      placeholder="Enter supplier contact number"
                      style={styles.input}
                      value={contactInfo}
                      onChange={(event) => setContactInfo(event.target.value)}
                      disabled={isLoadingDetail}
                    />
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <label htmlFor="email" style={styles.label}>
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter supplier email"
                      style={styles.input}
                      value={contactInfo}
                      onChange={(event) => setContactInfo(event.target.value)}
                      disabled={isLoadingDetail}
                    />
                  </div>

                  <div className="add-supplier-field-row" style={styles.fieldRow}>
                    <div style={styles.label}>Return Policy:</div>
                    <div className="add-supplier-policy" style={styles.policyButtons}>
                      <button
                        type="button"
                        style={{
                          ...styles.policyButton,
                          ...(returnPolicy === "accept" ? styles.policyButtonActive : null),
                        }}
                        onClick={() => setReturnPolicy("accept")}
                        disabled={isLoadingDetail}
                      >
                        Accept
                        <br />
                        return
                      </button>
                      <button
                        type="button"
                        style={{
                          ...styles.policyButton,
                          ...(returnPolicy === "no-return" ? styles.policyButtonActive : null),
                        }}
                        onClick={() => setReturnPolicy("no-return")}
                        disabled={isLoadingDetail}
                      >
                        No return
                      </button>
                    </div>
                  </div>
                  {message ? <div style={{ color: "#22a958", fontSize: "14px" }}>{message}</div> : null}
                  {errorMessage ? <div style={{ color: "#ef4335", fontSize: "14px" }}>{errorMessage}</div> : null}
                </div>

                <div className="add-supplier-form-footer" style={styles.formFooter}>
                  <button type="button" style={styles.discardButton} onClick={() => onNavigate("suppliers")}>
                    Discard
                  </button>
                  <button type="button" style={styles.primaryButton} onClick={handleSubmitSupplier} disabled={isSubmitting || isLoadingDetail}>
                    {isSubmitting
                      ? "Saving..."
                      : isDetailMode
                        ? "Update Supplier"
                        : "Add Supplier"}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AddSupplier;
