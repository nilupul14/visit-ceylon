import express from "express";
import {
  seedDestinations,
  getDestinations,
  getDestination,
  addVisit,
  getVisits,
} from "../controllers/destinationController.js";

const destinationRouter = express.Router();

// Seed destinations from dummy data (see controller notes)
destinationRouter.post("/seed", seedDestinations);

// Destination browsing
destinationRouter.get("/", getDestinations);
destinationRouter.get("/:destinationId", getDestination);

// Visit slot management
destinationRouter.post("/visits", addVisit);
destinationRouter.get("/:destinationId/visits", getVisits);

export default destinationRouter;
