import React, { useEffect, useMemo, useState } from "react";
import AppSidebar from "../../../components/AppSidebar";
import RoleAvatar from "../../../components/RoleAvatar";
import { createUser, deleteUser, getAccessOptions, getUsers, updateUser } from "../../../services/user/userService";

const blankForm = {
  user_id: null,
  username: "",
  password: "",
  role_id: "",
  store_id: "",
};

const styles = {
  page: { minHeight: "100vh", display: "grid", gridTemplateColumns: "322px 1fr", background: "#f6f7fb", color: "#172033", fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif' },
  main: { minWidth: 0, display: "flex", flexDirection: "column" },
  topbar: { background: "#ffffff", borderBottom: "1px solid #dfe7f2", padding: "18px 32px", display: "flex", justifyContent: "space-between", alignItems: "center" },
  topbarRight: { display: "flex", alignItems: "center", gap: "14px" },
  title: { margin: 0, fontSize: "30px", fontWeight: 800 },
  rolePill: { padding: "8px 12px", borderRadius: "999px", background: "#fff1ef", color: "#d14134", fontWeight: 700 },
  content: { padding: "30px", display: "grid", gridTemplateColumns: "360px 1fr", gap: "22px", alignItems: "start" },
  card: { background: "#ffffff", border: "1px solid #dde6f2", borderRadius: "8px", padding: "22px" },
  cardTitle: { margin: "0 0 18px", fontSize: "19px", fontWeight: 800 },
  form: { display: "grid", gap: "14px" },
  field: { display: "grid", gap: "7px" },
  label: { color: "#475569", fontSize: "14px", fontWeight: 700 },
  input: { height: "42px", border: "1px solid #d7e1ed", borderRadius: "8px", padding: "0 12px", fontSize: "15px", boxSizing: "border-box", background: "#ffffff" },
  actions: { display: "flex", gap: "10px", flexWrap: "wrap" },
  primaryButton: { height: "42px", border: "none", borderRadius: "8px", background: "#d14134", color: "#ffffff", padding: "0 18px", fontWeight: 800, cursor: "pointer" },
  secondaryButton: { height: "42px", border: "1px solid #d7e1ed", borderRadius: "8px", background: "#ffffff", color: "#475569", padding: "0 18px", fontWeight: 700, cursor: "pointer" },
  tableWrap: { overflowX: "auto" },
  table: { width: "100%", borderCollapse: "collapse", minWidth: "760px" },
  th: { textAlign: "left", padding: "14px", borderBottom: "1px solid #e5edf7", color: "#64748b", fontSize: "13px", textTransform: "uppercase" },
  td: { padding: "14px", borderBottom: "1px solid #edf2f8", color: "#1f2937" },
  badge: { display: "inline-flex", padding: "7px 11px", borderRadius: "999px", background: "#eaf2ff", color: "#2563eb", fontWeight: 800 },
  dangerButton: { height: "36px", border: "1px solid #fecaca", borderRadius: "8px", background: "#fff5f5", color: "#dc2626", padding: "0 12px", fontWeight: 700, cursor: "pointer" },
  editButton: { height: "36px", border: "1px solid #d7e1ed", borderRadius: "8px", background: "#ffffff", color: "#475569", padding: "0 12px", fontWeight: 700, cursor: "pointer" },
  rowActions: { display: "flex", gap: "8px" },
  message: { fontSize: "14px", color: "#15803d" },
  error: { fontSize: "14px", color: "#dc2626" },
};

function UsersPage({ currentPage = "users", currentUser = null, onNavigate = () => {}, onLogout = () => {} }) {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [stores, setStores] = useState([]);
  const [form, setForm] = useState(blankForm);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function loadData() {
    const [nextUsers, options] = await Promise.all([getUsers(), getAccessOptions()]);
    setUsers(nextUsers);
    setRoles(options.roles || []);
    setStores(options.stores || []);
  }

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const [nextUsers, options] = await Promise.all([getUsers(), getAccessOptions()]);

        if (mounted) {
          setUsers(nextUsers);
          setRoles(options.roles || []);
          setStores(options.stores || []);
        }
      } catch (error) {
        if (mounted) {
          setErrorMessage(error.message || "Failed to load users");
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  const roleNameById = useMemo(
    () => Object.fromEntries(roles.map((role) => [String(role.role_id), role.role_name])),
    [roles]
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    try {
      const payload = {
        username: form.username.trim(),
        password: form.password.trim(),
        role_id: Number(form.role_id),
        store_id: form.store_id ? Number(form.store_id) : null,
      };

      if (form.user_id) {
        await updateUser(form.user_id, payload);
        setMessage("User updated successfully");
      } else {
        await createUser(payload);
        setMessage("User created successfully");
      }

      setForm(blankForm);
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Failed to save user");
    }
  }

  async function handleDelete(user) {
    setMessage("");
    setErrorMessage("");

    try {
      await deleteUser(user.user_id);
      setMessage("User deleted successfully");
      await loadData();
    } catch (error) {
      setErrorMessage(error.message || "Failed to delete user");
    }
  }

  function handleEdit(user) {
    setForm({
      user_id: user.user_id,
      username: user.username,
      password: "",
      role_id: String(user.role_id),
      store_id: user.store_id ? String(user.store_id) : "",
    });
    setMessage("");
    setErrorMessage("");
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 980px) {
            .users-page {
              grid-template-columns: 1fr !important;
            }
            .users-content {
              grid-template-columns: 1fr !important;
            }
          }
        `}
      </style>

      <div className="users-page" style={styles.page}>
        <AppSidebar currentPage={currentPage} currentUser={currentUser} onNavigate={onNavigate} onLogout={onLogout} />

        <main style={styles.main}>
          <header style={styles.topbar}>
            <h1 style={styles.title}>User Management</h1>
            <div style={styles.topbarRight}>
              <span style={styles.rolePill}>Admin</span>
              <RoleAvatar currentUser={currentUser} />
            </div>
          </header>

          <div className="users-content" style={styles.content}>
            <section style={styles.card}>
              <h2 style={styles.cardTitle}>{form.user_id ? "Edit User" : "Create User"}</h2>

              <form style={styles.form} onSubmit={handleSubmit}>
                <label style={styles.field}>
                  <span style={styles.label}>Username</span>
                  <input style={styles.input} value={form.username} onChange={(event) => setForm({ ...form, username: event.target.value })} required />
                </label>

                <label style={styles.field}>
                  <span style={styles.label}>{form.user_id ? "New Password" : "Password"}</span>
                  <input
                    style={styles.input}
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm({ ...form, password: event.target.value })}
                    required={!form.user_id}
                    placeholder={form.user_id ? "Leave blank to keep current password" : ""}
                  />
                </label>

                <label style={styles.field}>
                  <span style={styles.label}>Role</span>
                  <select style={styles.input} value={form.role_id} onChange={(event) => setForm({ ...form, role_id: event.target.value })} required>
                    <option value="">Select role</option>
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                    ))}
                  </select>
                </label>

                <label style={styles.field}>
                  <span style={styles.label}>Store</span>
                  <select style={styles.input} value={form.store_id} onChange={(event) => setForm({ ...form, store_id: event.target.value })}>
                    <option value="">No store</option>
                    {stores.map((store) => (
                      <option key={store.store_id} value={store.store_id}>{store.store_name}</option>
                    ))}
                  </select>
                </label>

                {message ? <div style={styles.message}>{message}</div> : null}
                {errorMessage ? <div style={styles.error}>{errorMessage}</div> : null}

                <div style={styles.actions}>
                  <button type="submit" style={styles.primaryButton}>{form.user_id ? "Save Changes" : "Create User"}</button>
                  <button type="button" style={styles.secondaryButton} onClick={() => setForm(blankForm)}>Clear</button>
                </div>
              </form>
            </section>

            <section style={styles.card}>
              <h2 style={styles.cardTitle}>Accounts</h2>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>User</th>
                      <th style={styles.th}>Role</th>
                      <th style={styles.th}>Store</th>
                      <th style={styles.th}>Created</th>
                      <th style={styles.th}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user.user_id}>
                        <td style={styles.td}>{user.username}</td>
                        <td style={styles.td}><span style={styles.badge}>{roleNameById[String(user.role_id)] || user.role_name}</span></td>
                        <td style={styles.td}>{user.store_name || "-"}</td>
                        <td style={styles.td}>{user.created_at ? new Date(user.created_at).toLocaleDateString("en-US") : "-"}</td>
                        <td style={styles.td}>
                          <div style={styles.rowActions}>
                            <button type="button" style={styles.editButton} onClick={() => handleEdit(user)}>Edit</button>
                            <button type="button" style={styles.dangerButton} onClick={() => handleDelete(user)}>Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </main>
      </div>
    </>
  );
}

export default UsersPage;
