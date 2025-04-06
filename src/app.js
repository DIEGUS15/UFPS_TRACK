import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import { configurePassport } from "./libs/passport.js";

import authRoutes from "./routes/auth.routes.js";
import roomsRoutes from "./routes/rooms.routes.js";
import watchmanRoutes from "./routes/watchman.routes.js";
import buildingRoutes from "./routes/building.routes.js";
import floorRoutes from "./routes/floor.routes.js";
import seatRoutes from "./routes/seat.routes.js";
import reservationRoutes from "./routes/reservation.routes.js";

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json()); //Convierte los req.body en formato json
app.use(cookieParser());

app.use("/api", authRoutes);
app.use("/api", roomsRoutes);
app.use("/api", watchmanRoutes);
app.use("/api", buildingRoutes);
app.use("/api", floorRoutes);
app.use("/api", seatRoutes);
app.use("/api", reservationRoutes);

export default app;
