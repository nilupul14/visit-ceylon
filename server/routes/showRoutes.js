import express from "express";
import { addShow, getNowPlayingMovies, getShow, getShows } from "../controllers/showController.js";
import { authorizeRoles, ROLE } from "../middleware/auth.js";

const showRouter = express.Router();

const siteOpsAccess = authorizeRoles([ROLE.ADMIN, ROLE.SITE_MANAGER]);

showRouter.get("/now-playing", siteOpsAccess, getNowPlayingMovies);
showRouter.post("/add", siteOpsAccess, addShow);
showRouter.get("/all", getShows)
showRouter.get("/:movieId", getShow)

export default showRouter;
