import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { checkRole } from "../middlewares/checkRole.js";
import {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
} from "../controllers/rooms.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createRoomSchema } from "../schemas/room.schema.js";

const router = Router();

//All users can see the rooms
router.get("/rooms", authRequired, getRooms);
router.get("/rooms/:id", authRequired, getRoom);

//Only "watchman" and "admin" can create, update and delete rooms
router.post(
  "/rooms",
  authRequired,
  checkRole(["watchman", "admin"]),
  validateSchema(createRoomSchema),
  createRoom
);
router.delete(
  "/rooms/:id",
  authRequired,
  checkRole(["watchman", "admin"]),
  deleteRoom
);
router.put(
  "/rooms/:id",
  authRequired,
  checkRole(["watchman", "admin"]),
  updateRoom
);

export default router;
