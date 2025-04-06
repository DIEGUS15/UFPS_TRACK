import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  getReservations,
  getMyReservations,
  getRoomReservations,
  getReservation,
  createReservation,
  updateReservationStatus,
  markAttendance,
  cancelReservation,
} from "../controllers/reservation.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
// Aquí puedes importar los esquemas de validación si los creas

const router = Router();

// Rutas para todos los roles
router.get("/reservations/:id", authRequired, getReservation);

// Rutas para estudiantes
router.get(
  "/my-reservations",
  authRequired,
  checkRole(["student"]),
  getMyReservations
);
router.post(
  "/reservations",
  authRequired,
  checkRole(["student"]),
  createReservation
);
router.delete(
  "/reservations/:id/cancel",
  authRequired,
  checkRole(["student"]),
  cancelReservation
);

// Rutas para vigilantes y administradores
router.get(
  "/reservations",
  authRequired,
  checkRole(["watchman", "admin"]),
  getReservations
);
router.get(
  "/reservations/room/:roomId",
  authRequired,
  checkRole(["watchman", "admin"]),
  getRoomReservations
);
router.patch(
  "/reservations/:id/status",
  authRequired,
  checkRole(["watchman", "admin"]),
  updateReservationStatus
);
router.patch(
  "/reservations/:id/attendance",
  authRequired,
  checkRole(["watchman", "admin"]),
  markAttendance
);

export default router;
