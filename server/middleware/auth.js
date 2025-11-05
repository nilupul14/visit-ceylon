import { clerkClient } from "@clerk/express";

export const protectAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth();

    const user = await clerkClient.users.getUser(userId);

    console.log("Admin - user", user.privateMetadata);

    if (user.privateMetadata.role === "admin") {
      next();
      return res.json({ success: true, message: "you're authorized" });
    } else {
      return res.json({ success: false, message: "not authorized" });
    }

    // next();
  } catch (error) {
    return res.json({ success: false, message: "not authorized" });
  }
};
