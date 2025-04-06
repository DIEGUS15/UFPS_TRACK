import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  getFloors,
  getFloor,
  createFloor,
  updateFloor,
  deleteFloor,
} from "../controllers/floor.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
// Aquí puedes importar los esquemas de validación si los creas

const router = Router();

// Todos los usuarios pueden ver los pisos
router.get("/floors", authRequired, getFloors);
router.get("/floors/:id", authRequired, getFloor);

// Solo "admin" puede crear, actualizar y eliminar pisos
router.post("/floors", authRequired, checkRole(["admin"]), createFloor);
router.put("/floors/:id", authRequired, checkRole(["admin"]), updateFloor);
router.delete("/floors/:id", authRequired, checkRole(["admin"]), deleteFloor);

export default router;
