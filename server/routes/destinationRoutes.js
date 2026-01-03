import express from "express";
import { authorizeRoles, ROLE } from "../middleware/auth.js";
import {
  addDestination,
  updateDestination,
  deleteDestination,
  getDestinations,
  getDestination,
  addVisit,
  getVisits,
} from "../controllers/destinationController.js";

const destinationRouter = express.Router();
const siteOpsAccess = authorizeRoles([ROLE.ADMIN, ROLE.SITE_MANAGER]);

// Add destinations from dummy data (see controller notes)
destinationRouter.post("/add", siteOpsAccess, addDestination);
destinationRouter.put("/:destinationId", siteOpsAccess, updateDestination);
destinationRouter.delete("/:destinationId", siteOpsAccess, deleteDestination);

// Destination browsing
destinationRouter.get("/", getDestinations);
destinationRouter.get("/:destinationId", getDestination);

// Visit slot management
destinationRouter.post("/visits", siteOpsAccess, addVisit);
destinationRouter.get("/:destinationId/visits", getVisits);

export default destinationRouter;
