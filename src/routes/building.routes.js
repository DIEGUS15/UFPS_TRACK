import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  getBuildings,
  getBuilding,
  createBuilding,
  updateBuilding,
  deleteBuilding,
} from "../controllers/building.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

// Todos los usuarios pueden ver los edificios
router.get("/buildings", authRequired, getBuildings);
router.get("/buildings/:id", authRequired, getBuilding);

// Solo "admin" puede crear, actualizar y eliminar edificios
router.post("/buildings", authRequired, checkRole(["admin"]), createBuilding);
router.put(
  "/buildings/:id",
  authRequired,
  checkRole(["admin"]),
  updateBuilding
);
router.delete(
  "/buildings/:id",
  authRequired,
  checkRole(["admin"]),
  deleteBuilding
);

export default router;
