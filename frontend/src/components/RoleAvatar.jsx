import React from "react";
import { getRoleName } from "../auth/rbac";

const baseStyle = {
  width: "44px",
  height: "44px",
  borderRadius: "50%",
  background: "linear-gradient(135deg, #f1debf, #ba8840)",
  color: "#ffffff",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
  fontSize: "16px",
  flex: "0 0 auto",
};

function getRoleInitial(user) {
  const roleName = getRoleName(user).toLowerCase();

  if (roleName === "admin") return "A";
  if (roleName === "staff") return "S";
  if (roleName === "manager") return "M";

  return "U";
}

function RoleAvatar({ currentUser = null, style = {} }) {
  return <div style={{ ...style, ...baseStyle }}>{getRoleInitial(currentUser)}</div>;
}

export default RoleAvatar;
