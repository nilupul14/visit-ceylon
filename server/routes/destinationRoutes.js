import express from "express";
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

// Add destinations from dummy data (see controller notes)
destinationRouter.post("/add", addDestination);
destinationRouter.put("/:destinationId", updateDestination);
destinationRouter.delete("/:destinationId", deleteDestination);

// Destination browsing
destinationRouter.get("/", getDestinations);
destinationRouter.get("/:destinationId", getDestination);

// Visit slot management
destinationRouter.post("/visits", addVisit);
destinationRouter.get("/:destinationId/visits", getVisits);

export default destinationRouter;
