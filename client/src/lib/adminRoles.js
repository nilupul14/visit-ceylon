export const ROLE = {
  SYS_ADMIN: "sys_admin",
  ADMIN: "admin",
  BUSINESS_MANAGER: "business_manager",
  SITE_MANAGER: "site_manager",
  FINANCIAL_MANAGER: "financial_manager"
};

const ROLE_LABELS = {
  [ROLE.SYS_ADMIN]: "System Admin",
  [ROLE.ADMIN]: "Admin User",
  [ROLE.BUSINESS_MANAGER]: "Business Manager",
  [ROLE.SITE_MANAGER]: "Site Manager",
  [ROLE.FINANCIAL_MANAGER]: "Financial Manager"
};

const ROLE_PRIORITY = [
  ROLE.SYS_ADMIN,
  ROLE.ADMIN,
  ROLE.BUSINESS_MANAGER,
  ROLE.FINANCIAL_MANAGER,
  ROLE.SITE_MANAGER
];

export const normalizeRoles = (roles = []) => {
  if (Array.isArray(roles)) {
    return roles.map((role) => String(role).toLowerCase());
  }

  return roles ? [String(roles).toLowerCase()] : [];
};

export const resolveRoleLabel = (roles = []) => {
  const normalizedRoles = normalizeRoles(roles);
  const matchedRole = ROLE_PRIORITY.find((role) =>
    normalizedRoles.includes(role)
  );

  return ROLE_LABELS[matchedRole] || "Admin User";
};

export const getAdminAccessFlags = (roles = []) => {
  const normalizedRoles = normalizeRoles(roles);
  const isSysOrAdmin =
    normalizedRoles.includes(ROLE.SYS_ADMIN) ||
    normalizedRoles.includes(ROLE.ADMIN);

  return {
    isSysOrAdmin,
    canManageSiteOps: isSysOrAdmin || normalizedRoles.includes(ROLE.SITE_MANAGER),
    canManageBusiness:
      isSysOrAdmin ||
      normalizedRoles.includes(ROLE.BUSINESS_MANAGER) ||
      normalizedRoles.includes(ROLE.FINANCIAL_MANAGER)
  };
};

export const canAccessAdminPath = (roles = [], pathname = "") => {
  const { isSysOrAdmin, canManageBusiness, canManageSiteOps } =
    getAdminAccessFlags(roles);

  if (isSysOrAdmin) return true;

  if (pathname === "/admin" || pathname === "/admin/") {
    return canManageBusiness;
  }

  if (
    pathname.startsWith("/admin/add-destinations") ||
    pathname.startsWith("/admin/list-destinations")
  ) {
    return canManageSiteOps;
  }

  if (pathname.startsWith("/admin/list-bookings")) {
    return canManageBusiness;
  }

  return canManageBusiness || canManageSiteOps;
};

export const getDefaultAdminPath = (roles = []) => {
  const { canManageSiteOps, canManageBusiness } = getAdminAccessFlags(roles);

  if (canManageSiteOps && !canManageBusiness) {
    return "/admin/add-destinations";
  }

  if (canManageBusiness) {
    return "/admin";
  }

  return "/";
};
