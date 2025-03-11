import { Router } from "express";
import {
  generateWatchmanToken,
  watchmanLogin,
} from "../controllers/watchman.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";

const router = Router();

router.post(
  "/watchman/generate-token",
  authRequired,
  checkRole(["admin"]),
  generateWatchmanToken
);
router.post("/watchman/login", watchmanLogin);

export default router;
