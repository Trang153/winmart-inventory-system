import React, { useState } from "react";

const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "48px",
    padding: "48px 72px",
    backgroundColor: "#ffffff",
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    boxSizing: "border-box",
  },
  brandSection: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "420px",
  },
  brandText: {
    margin: 0,
    fontSize: "clamp(56px, 8vw, 110px)",
    fontWeight: 700,
    lineHeight: 1,
    color: "#e3362c",
    letterSpacing: "-2px",
    textShadow: "0 4px 10px rgba(227, 54, 44, 0.12)",
  },
  formSection: {
    width: "100%",
    maxWidth: "520px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  logoBox: {
    width: "114px",
    height: "114px",
    margin: "0 auto 28px",
    backgroundColor: "#e3362c",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
    fontWeight: 700,
    borderRadius: "2px",
  },
  title: {
    margin: "0 0 14px",
    textAlign: "center",
    fontSize: "31px",
    fontWeight: 700,
    color: "#2f3440",
  },
  subtitle: {
    margin: "0 0 46px",
    textAlign: "center",
    fontSize: "16px",
    color: "#7a8499",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "26px",
  },
  fieldGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  label: {
    fontSize: "16px",
    fontWeight: 600,
    color: "#4c5260",
  },
  input: {
    height: "44px",
    padding: "0 14px",
    border: "1px solid #d5dbe7",
    borderRadius: "8px",
    fontSize: "16px",
    color: "#2f3440",
    outline: "none",
    boxSizing: "border-box",
  },
  optionsRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: "6px",
    gap: "16px",
    flexWrap: "wrap",
  },
  remember: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontSize: "15px",
    color: "#49505e",
  },
  checkbox: {
    width: "17px",
    height: "17px",
    accentColor: "#e3362c",
  },
  forgot: {
    fontSize: "15px",
    fontWeight: 600,
    color: "#e3362c",
    textDecoration: "none",
  },
  button: {
    height: "44px",
    border: "none",
    borderRadius: "4px",
    backgroundColor: "#e3362c",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    cursor: "pointer",
    marginTop: "6px",
  },
  buttonDisabled: {
    opacity: 0.7,
    cursor: "not-allowed",
  },
  errorText: {
    margin: "-8px 0 0",
    color: "#d93025",
    fontSize: "14px",
  },
};

function Login({ onLogin = () => {} }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await onLogin({
        username: username.trim(),
        password,
      });
    } catch (error) {
      setErrorMessage(error.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <style>
        {`
          @media (max-width: 980px) {
            .login-page {
              flex-direction: column;
              justify-content: center;
              padding: 32px 24px;
              gap: 24px;
            }

            .login-brand {
              min-height: auto;
            }

            .login-form {
              max-width: 100%;
            }
          }

          @media (max-width: 640px) {
            .login-title {
              font-size: 28px;
            }

            .login-subtitle {
              margin-bottom: 32px;
            }

            .login-options {
              align-items: flex-start;
              flex-direction: column;
            }
          }
        `}
      </style>

      <div className="login-page" style={styles.page}>
        <div className="login-brand" style={styles.brandSection}>
          <h1 style={styles.brandText}>WinMart</h1>
        </div>

        <div className="login-form" style={styles.formSection}>
          <div style={styles.logoBox}>WinMart</div>
          <h2 className="login-title" style={styles.title}>
            Log in to your account
          </h2>
          <p className="login-subtitle" style={styles.subtitle}>
            Welcome back! Please enter your details.
          </p>

          <form
            style={styles.form}
            onSubmit={handleSubmit}
          >
            <div style={styles.fieldGroup}>
              <label htmlFor="username" style={styles.label}>
                Username
              </label>
              <input
                id="username"
                type="text"
                placeholder="Enter your username"
                style={styles.input}
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
            </div>

            <div style={styles.fieldGroup}>
              <label htmlFor="password" style={styles.label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                placeholder="........"
                style={styles.input}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </div>

            {errorMessage ? <p style={styles.errorText}>{errorMessage}</p> : null}

            <div className="login-options" style={styles.optionsRow}>
              <label style={styles.remember}>
                <input type="checkbox" style={styles.checkbox} />
                <span>Remember for 30 days</span>
              </label>

              <a href="#forgot-password" style={styles.forgot}>
                Forgot password
              </a>
            </div>

            <button
              type="submit"
              style={{
                ...styles.button,
                ...(isSubmitting ? styles.buttonDisabled : null),
              }}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
