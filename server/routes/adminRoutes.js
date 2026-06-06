import express from "express";
import { authorizeRoles, ROLE } from "../middleware/auth.js";
import { getAllBookings, getDashboardData, isAdmin } from "../controllers/adminController.js";

const adminRouter = express.Router();

const businessAccess = authorizeRoles([ROLE.ADMIN, ROLE.BUSINESS_MANAGER, ROLE.FINANCIAL_MANAGER]);
const bookingsAccess = authorizeRoles([
  ROLE.ADMIN,
  ROLE.BUSINESS_MANAGER,
  ROLE.FINANCIAL_MANAGER,
]);
const privilegedAccess = authorizeRoles([ROLE.ADMIN, ROLE.BUSINESS_MANAGER, ROLE.FINANCIAL_MANAGER, ROLE.SITE_MANAGER]);

adminRouter.get("/is-admin", privilegedAccess, isAdmin);
adminRouter.get("/dashboard", businessAccess, getDashboardData);
adminRouter.get("/all-bookings", bookingsAccess, getAllBookings);

export default adminRouter;
