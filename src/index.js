import dotenv from "dotenv";
dotenv.config(); // Carga las variables de entorno

import app from "./app.js";
import { connectDB } from "./db.js";

console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID); // Verifica que se cargue
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);

connectDB();
app.listen(4000);
console.log("Server on port", 4000);
