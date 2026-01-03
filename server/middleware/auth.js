import { clerkClient } from "@clerk/express";

const ROLE = {
  SYS_ADMIN: "sys_admin",
  ADMIN: "admin",
  BUSINESS_MANAGER: "business_manager",
  SITE_MANAGER: "site_manager",
  FINANCIAL_MANAGER: "financial_manager",
};

const getNormalizedRoles = (user) => {
  const meta = user?.privateMetadata || {};
  const roles = meta.roles ?? meta.role;

  if (Array.isArray(roles)) {
    return roles.map((role) => String(role).toLowerCase());
  }

  return roles ? [String(roles).toLowerCase()] : [];
};

export const authorizeRoles = (allowedRoles = []) => {
  return async (req, res, next) => {
    try {
      const auth = typeof req.auth === "function" ? req.auth() : req.auth;
      const userId = auth?.userId;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Authentication required" });
      }

      const user = await clerkClient.users.getUser(userId);
      const userRoles = getNormalizedRoles(user);

      const isSysAdmin = userRoles.includes(ROLE.SYS_ADMIN);
      const isAllowed = allowedRoles.some((role) => userRoles.includes(role.toLowerCase()));

      if (isSysAdmin || isAllowed) {
        req.user = user;
        return next();
      }

      return res.status(403).json({ success: false, message: "Not authorized" });
    } catch (error) {
      console.error("authorizeRoles error:", error);
      return res.status(401).json({ success: false, message: "Not authorized" });
    }
  };
};

// Backwards compatibility for existing admin-only checks
export const protectAdmin = authorizeRoles([ROLE.ADMIN]);

export { ROLE };
