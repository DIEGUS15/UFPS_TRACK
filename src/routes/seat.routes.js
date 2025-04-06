import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  getSeats,
  getSeatsByRoom,
  getSeat,
  createSeat,
  updateSeat,
  deleteSeat,
  updateComputerAvailability,
} from "../controllers/seat.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
// Aquí puedes importar los esquemas de validación si los creas

const router = Router();

// Todos los usuarios pueden ver los asientos
router.get("/seats", authRequired, getSeats);
router.get("/seats/room/:roomId", authRequired, getSeatsByRoom);
router.get("/seats/:id", authRequired, getSeat);

// Solo "watchman" y "admin" pueden crear, actualizar y eliminar asientos
router.post(
  "/seats",
  authRequired,
  checkRole(["watchman", "admin"]),
  createSeat
);
router.put(
  "/seats/:id",
  authRequired,
  checkRole(["watchman", "admin"]),
  updateSeat
);
router.delete(
  "/seats/:id",
  authRequired,
  checkRole(["watchman", "admin"]),
  deleteSeat
);

// Actualizar disponibilidad del computador
router.patch(
  "/seats/:id/computer-availability",
  authRequired,
  checkRole(["watchman", "admin"]),
  updateComputerAvailability
);

export default router;
