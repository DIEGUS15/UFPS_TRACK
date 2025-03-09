// import dotenv from "dotenv";
// dotenv.config(); // Carga las variables de entorno

import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "passport";

import authRoutes from "./routes/auth.routes.js";
import roomsRoutes from "./routes/rooms.routes.js";
import "./libs/passport.js"; // Importa la configuración de Passport

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api", authRoutes);
app.use("/api", roomsRoutes);

export default app;
