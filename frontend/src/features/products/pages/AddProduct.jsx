import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { appRoutes } from "../../../app/routes";
import { getSuppliers } from "../../../services/supplier/supplierService";
import {
  createProduct,
  getProductDetail,
  updateProduct,
  uploadProductImage,
} from "../../../services/product/productService";

const navItems = [
  { label: "Dashboard", icon: "#", page: "dashboard" },
  { label: "Suppliers", icon: "O", page: "suppliers" },
  { label: "Products", icon: "[]", page: "products" },
  { label: "Inventory", icon: "[]", page: "inventory" },
  { label: "Orders", icon: "U", page: "orders" },
  { label: "Reports", icon: "|", page: "reports" },
  { label: "Rating", icon: "/", page: "rating" },
];

const categoryOptions = ["Snacks", "Dairy", "Drinks", "Frozen Food", "Household"];

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "320px 1fr",
    background: "#f5f7fb",
    color: "#1f2937",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  },
  sidebar: {
    background: "#ffffff",
    borderRight: "1px solid #dde6f2",
    padding: "22px 16px",
    display: "flex",
    flexDirection: "column",
  },
  brand: {
    margin: "16px 20px 46px",
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
    padding: "18px 40px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "18px",
  },
  search: {
    width: "100%",
    maxWidth: "475px",
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
    padding: "28px 40px",
    display: "grid",
    gap: "28px",
  },
  headingRow: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
  },
  backButton: {
    width: "44px",
    height: "44px",
    borderRadius: "8px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    color: "#111827",
    fontSize: "24px",
    cursor: "pointer",
  },
  pageTitle: {
    margin: 0,
    fontSize: "30px",
    fontWeight: 800,
    color: "#1b2437",
  },
  layout: {
    display: "grid",
    gridTemplateColumns: "1.95fr 0.95fr",
    gap: "28px",
    alignItems: "start",
  },
  leftColumn: {
    display: "grid",
    gap: "30px",
  },
  rightColumn: {
    display: "grid",
    gap: "30px",
  },
  card: {
    background: "#ffffff",
    border: "1px solid #dbe4ef",
    borderRadius: "16px",
    padding: "28px 30px",
  },
  cardTitle: {
    margin: "0 0 28px",
    fontSize: "18px",
    fontWeight: 800,
    color: "#1f2937",
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  fieldGroup: {
    display: "grid",
    gap: "12px",
    marginBottom: "22px",
  },
  twoColumns: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
  },
  label: {
    fontSize: "14px",
    color: "#111827",
    fontWeight: 600,
  },
  subLabel: {
    color: "#6b7a92",
    fontWeight: 500,
    marginLeft: "6px",
  },
  input: {
    width: "100%",
    height: "54px",
    borderRadius: "10px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    padding: "0 16px",
    fontSize: "16px",
    color: "#1f2937",
    outline: "none",
  },
  select: {
    width: "100%",
    height: "54px",
    borderRadius: "10px",
    border: "1px solid #d8e1ec",
    background: "#ffffff",
    padding: "0 16px",
    fontSize: "16px",
    color: "#1f2937",
    outline: "none",
  },
  uploadBox: {
    border: "2px dashed #dbe4ef",
    borderRadius: "14px",
    minHeight: "216px",
    display: "grid",
    placeItems: "center",
    textAlign: "center",
    color: "#64748b",
    padding: "24px",
  },
  uploadCircle: {
    width: "62px",
    height: "62px",
    borderRadius: "50%",
    background: "#ffffff",
    border: "1px solid #e8eef5",
    display: "grid",
    placeItems: "center",
    margin: "0 auto 18px",
    boxShadow: "0 8px 20px rgba(15, 23, 42, 0.06)",
    color: "#64748b",
    fontSize: "24px",
  },
  uploadMain: {
    fontSize: "18px",
    color: "#1f2937",
    marginBottom: "8px",
  },
  uploadSub: {
    fontSize: "14px",
    color: "#6b7a92",
    lineHeight: 1.6,
  },
  uploadPreview: {
    width: "160px",
    height: "160px",
    borderRadius: "14px",
    objectFit: "cover",
    border: "1px solid #dbe4ef",
    background: "#f8fafc",
  },
  helperText: {
    fontSize: "14px",
    color: "#6b7a92",
  },
  successText: {
    fontSize: "14px",
    color: "#22a958",
  },
  errorText: {
    fontSize: "14px",
    color: "#ef4335",
  },
  actionButton: {
    width: "100%",
    height: "54px",
    borderRadius: "10px",
    border: "none",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
  },
  primaryButton: {
    background: "#d33d31",
    color: "#ffffff",
  },
  secondaryButton: {
    background: "#ffffff",
    color: "#1f2937",
    border: "1px solid #d8e1ec",
  },
};

function AddProduct({ currentPage = "products", onNavigate = () => {}, onLogout = () => {} }) {
  const fileInputRef = useRef(null);
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("id");
  const isDetailMode = Boolean(productId);
  const [status, setStatus] = useState("active");
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [buyingPrice, setBuyingPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [discount, setDiscount] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [suppliers, setSuppliers] = useState([]);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingDetail, setIsLoadingDetail] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadSuppliers() {
      try {
        const data = await getSuppliers();

        if (isMounted) {
          setSuppliers(data);
        }
      } catch (_error) {
        if (isMounted) {
          setSuppliers([]);
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

    async function loadProductDetail() {
      if (!productId) {
        setProductName("");
        setCategory("");
        setSupplierId("");
        setBuyingPrice("");
        setSellingPrice("");
        setDiscount("");
        setImageUrl("");
        setStatus("active");
        setMessage("");
        setErrorMessage("");
        return;
      }

      try {
        setIsLoadingDetail(true);
        setMessage("");
        setErrorMessage("");
        const product = await getProductDetail(productId);

        if (isMounted) {
          const normalizedStock = String(product.price_stock || "").toLowerCase();

          setProductName(product.product_name || "");
          setCategory(product.category || "");
          setSupplierId(product.supplier_id ? String(product.supplier_id) : "");
          setBuyingPrice(product.price != null ? String(product.price) : "");
          setSellingPrice(product.price != null ? String(product.price) : "");
          setDiscount("");
          setImageUrl(product.image_url || "");
          setStatus(
            normalizedStock.includes("hidden") ? "hidden" : normalizedStock.includes("draft") ? "draft" : "active",
          );
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(error.message || "Failed to load product detail");
        }
      } finally {
        if (isMounted) {
          setIsLoadingDetail(false);
        }
      }
    }

    loadProductDetail();

    return () => {
      isMounted = false;
    };
  }, [productId]);

  const profitMargin = (() => {
    const buy = Number(buyingPrice || 0);
    const sell = Number(sellingPrice || 0);

    if (buy <= 0 || sell <= 0 || sell < buy) {
      return "";
    }

    return `${(((sell - buy) / buy) * 100).toFixed(2)}%`;
  })();

  async function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    try {
      setIsUploadingImage(true);
      setErrorMessage("");
      setMessage("");
      const result = await uploadProductImage(file);
      setImageUrl(result.imageUrl);
      setMessage("Image uploaded successfully");
    } catch (error) {
      setErrorMessage(error.message || "Failed to upload image");
    } finally {
      setIsUploadingImage(false);
      event.target.value = "";
    }
  }

  async function handleSubmitProduct() {
    try {
      setIsSubmitting(true);
      setErrorMessage("");
      setMessage("");

      const payload = {
        product_name: productName.trim(),
        category: category || null,
        supplier_id: Number(supplierId),
        price: Number(sellingPrice || 0),
        price_stock: status === "active" ? "In Stock" : status === "draft" ? "Draft" : "Hidden",
        image_url: imageUrl || null,
      };

      if (isDetailMode) {
        await updateProduct(productId, payload);
        setMessage("Product updated successfully");
      } else {
        await createProduct(payload);
        setMessage("Product created successfully");
        setProductName("");
        setCategory("");
        setSupplierId("");
        setBuyingPrice("");
        setSellingPrice("");
        setDiscount("");
        setImageUrl("");
        setStatus("active");
      }
    } catch (error) {
      setErrorMessage(error.message || "Failed to save product");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 1180px) {
            .add-product-page {
              grid-template-columns: 1fr;
            }

            .add-product-layout {
              grid-template-columns: 1fr !important;
            }
          }

          @media (max-width: 760px) {
            .add-product-topbar,
            .add-product-heading {
              flex-direction: column;
              align-items: stretch;
            }

            .add-product-content {
              padding: 20px !important;
            }

            .add-product-two-columns {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div className="add-product-page" style={styles.page}>
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
          <header className="add-product-topbar" style={styles.topbar}>
            <div style={styles.search}>
              <span style={{ fontSize: "20px", color: "#111827" }}>Q</span>
              <span>Search products, SKU...</span>
            </div>

            <div style={styles.topActions}>
              <span style={{ fontSize: "24px" }}>!</span>
              <div style={styles.avatar}>A</div>
            </div>
          </header>

          <div className="add-product-content" style={styles.content}>
            <div className="add-product-heading" style={styles.headingRow}>
              <button type="button" style={styles.backButton} onClick={() => onNavigate(appRoutes.products)}>
                {"<"}
              </button>
              <h1 style={styles.pageTitle}>{isDetailMode ? "Product Detail" : "Add New Product"}</h1>
            </div>

            <div className="add-product-layout" style={styles.layout}>
              <div style={styles.leftColumn}>
                <section style={styles.card}>
                  <h2 style={styles.cardTitle}>i Basic Information</h2>

                  <div style={styles.fieldGroup}>
                    <label htmlFor="product-name" style={styles.label}>
                      Product Name
                    </label>
                    <input
                      id="product-name"
                      type="text"
                      placeholder="Enter product name"
                      style={styles.input}
                      value={productName}
                      onChange={(event) => setProductName(event.target.value)}
                      disabled={isLoadingDetail}
                    />
                  </div>

                  <div className="add-product-two-columns" style={styles.twoColumns}>
                    <div style={styles.fieldGroup}>
                      <label htmlFor="product-id" style={styles.label}>
                        Product ID
                        <span style={styles.subLabel}>(Generated by system)</span>
                      </label>
                      <input
                        id="product-id"
                        type="text"
                        placeholder="Generated by system"
                        style={styles.input}
                        value={productId || ""}
                        disabled
                      />
                    </div>

                    <div style={styles.fieldGroup}>
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
                        <option value="">Select category</option>
                        {categoryOptions.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={styles.fieldGroup}>
                    <label htmlFor="supplier" style={styles.label}>
                      Supplier
                    </label>
                    <select
                      id="supplier"
                      value={supplierId}
                      style={styles.select}
                      onChange={(event) => setSupplierId(event.target.value)}
                      disabled={isLoadingDetail}
                    >
                      <option value="">Select supplier</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier.supplier_id} value={supplier.supplier_id}>
                          {supplier.supplier_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </section>

                <section style={styles.card}>
                  <h2 style={styles.cardTitle}>$ Pricing & Business Information</h2>

                  <div className="add-product-two-columns" style={styles.twoColumns}>
                    <div style={styles.fieldGroup}>
                      <label htmlFor="buying-price" style={styles.label}>
                        Buying Price
                      </label>
                      <input
                        id="buying-price"
                        type="text"
                        placeholder="$ 0.00"
                        style={styles.input}
                        value={buyingPrice}
                        onChange={(event) => setBuyingPrice(event.target.value)}
                        disabled={isLoadingDetail}
                      />
                    </div>

                    <div style={styles.fieldGroup}>
                      <label htmlFor="selling-price" style={styles.label}>
                        Selling Price
                      </label>
                      <input
                        id="selling-price"
                        type="text"
                        placeholder="$ 0.00"
                        style={styles.input}
                        value={sellingPrice}
                        onChange={(event) => setSellingPrice(event.target.value)}
                        disabled={isLoadingDetail}
                      />
                    </div>
                  </div>

                  <div className="add-product-two-columns" style={styles.twoColumns}>
                    <div style={styles.fieldGroup}>
                      <label htmlFor="discount" style={styles.label}>
                        Discount
                        <span style={styles.subLabel}>(Optional)</span>
                      </label>
                      <input
                        id="discount"
                        type="text"
                        placeholder="% 0"
                        style={styles.input}
                        value={discount}
                        onChange={(event) => setDiscount(event.target.value)}
                        disabled={isLoadingDetail}
                      />
                    </div>

                    <div style={styles.fieldGroup}>
                      <label htmlFor="profit-margin" style={styles.label}>
                        Profit Margin
                      </label>
                      <input
                        id="profit-margin"
                        type="text"
                        placeholder="% Auto-calculated"
                        value={profitMargin}
                        style={{ ...styles.input, background: "#f8fafc", color: "#94a3b8" }}
                        disabled
                      />
                    </div>
                  </div>
                </section>
              </div>

              <div style={styles.rightColumn}>
                <section style={styles.card}>
                  <h2 style={styles.cardTitle}>[] Product Image</h2>

                  <div style={styles.uploadBox}>
                    <div>
                      {imageUrl ? (
                        <img src={imageUrl} alt="Product" style={styles.uploadPreview} />
                      ) : (
                        <div style={styles.uploadCircle}>^</div>
                      )}
                      <div style={styles.uploadMain}>
                        {isUploadingImage ? "Uploading image..." : "Click to upload or drag and drop"}
                      </div>
                      <div style={styles.uploadSub}>SVG, PNG, JPG or GIF (max. 800x800px)</div>
                      <button
                        type="button"
                        style={{
                          marginTop: "12px",
                          border: "none",
                          background: "transparent",
                          color: "#d33d31",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploadingImage || isLoadingDetail}
                      >
                        Browse image
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageChange}
                        disabled={isUploadingImage || isLoadingDetail}
                      />
                      {imageUrl ? (
                        <div style={{ ...styles.helperText, marginTop: "10px", wordBreak: "break-all" }}>
                          {imageUrl}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </section>

                <section style={styles.card}>
                  <h2 style={styles.cardTitle}>/ Status</h2>

                  <div style={styles.fieldGroup}>
                    <label htmlFor="product-status" style={styles.label}>
                      Product Status
                    </label>
                    <select
                      id="product-status"
                      value={status}
                      style={styles.select}
                      onChange={(event) => setStatus(event.target.value)}
                      disabled={isLoadingDetail}
                    >
                      <option value="active">Active (Visible)</option>
                      <option value="draft">Draft</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </div>
                </section>

                {message ? <div style={styles.successText}>{message}</div> : null}
                {errorMessage ? <div style={styles.errorText}>{errorMessage}</div> : null}

                <button
                  type="button"
                  style={{ ...styles.actionButton, ...styles.primaryButton }}
                  onClick={handleSubmitProduct}
                  disabled={isSubmitting || isUploadingImage || isLoadingDetail}
                >
                  {isSubmitting ? "Saving..." : isDetailMode ? "Update Product" : "Add Product"}
                </button>

                <button
                  type="button"
                  style={{ ...styles.actionButton, ...styles.secondaryButton }}
                  onClick={() => onNavigate(appRoutes.products)}
                >
                  Discard / Cancel
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}

export default AddProduct;
