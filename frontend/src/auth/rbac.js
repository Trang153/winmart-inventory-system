export const ROLES = {
  admin: "Admin",
  manager: "Manager",
  staff: "Staff",
};

export const PAGE_PERMISSIONS = {
  dashboard: [ROLES.admin, ROLES.manager, ROLES.staff],
  suppliers: [ROLES.admin, ROLES.manager, ROLES.staff],
  products: [ROLES.admin, ROLES.manager, ROLES.staff],
  inventory: [ROLES.admin, ROLES.manager, ROLES.staff],
  orders: [ROLES.admin, ROLES.manager, ROLES.staff],
  procurement: [ROLES.admin],
  reports: [ROLES.admin, ROLES.manager, ROLES.staff],
  settings: [ROLES.admin, ROLES.manager, ROLES.staff],
  users: [ROLES.admin],
};

export function getRoleName(user) {
  return String(user?.roleName || "").trim();
}

export function isAdmin(user) {
  return getRoleName(user).toLowerCase() === ROLES.admin.toLowerCase();
}

export function canAccessPage(user, page) {
  const allowedRoles = PAGE_PERMISSIONS[page] || [];
  const roleName = getRoleName(user).toLowerCase();

  return allowedRoles.some((role) => role.toLowerCase() === roleName);
}
