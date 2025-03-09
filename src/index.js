import dotenv from "dotenv";
dotenv.config(); // Carga las variables de entorno

import app from "./app.js";
import { connectDB } from "./db.js";
import { configurePassport } from "./libs/passport.js";

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID); // Verifica que se cargue
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

// Configura Passport después de cargar las variables de entorno
const passport = configurePassport(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET
);

// Inicializa Passport y añade las rutas después
app.use(passport.initialize());

// Añade las rutas después de configurar todo
import authRoutes from "./routes/auth.routes.js";
import roomsRoutes from "./routes/rooms.routes.js";

app.use("/api", authRoutes);
app.use("/api", roomsRoutes);

connectDB();
app.listen(4000);
console.log("Server on port", 4000);
