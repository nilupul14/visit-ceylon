import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const auth = typeof req.auth === "function" ? req.auth() : req.auth;
    const userId = auth?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Authentication required" });
    }

    const user = await clerkClient.users.getUser(userId);
    const role = user?.privateMetadata?.role;

    console.log("Admin - user", user?.privateMetadata);

    if (role === "admin") {
      req.user = user;
      return next();
    }

    return res.status(403).json({ success: false, message: "Not authorized" });
  } catch (error) {
    console.error("protectAdmin error:", error);
    return res.status(401).json({ success: false, message: "Not authorized" });
  }
};
