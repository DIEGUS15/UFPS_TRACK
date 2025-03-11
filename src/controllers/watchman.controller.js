import WatchmanToken from "../models/watchmanToken.model.js";
import { createAccessToken } from "../libs/jwt.js";
import { generateToken } from "../utils/tokenGenerator.js";

// Generar un nuevo token para vigilantes
export const generateWatchmanToken = async (req, res) => {
  try {
    // Verificar si el usuario que hace la petición es admin
    if (req.user.role !== "admin") {
      return res
        .status(403)
        .json({ message: "Only admins can generate watchman tokens" });
    }

    // Desactivar tokens anteriores
    await WatchmanToken.updateMany({}, { isActive: false });

    // Generar nuevo token
    const token = generateToken();

    // Calcular fecha de expiración (final del día actual)
    const expiresAt = new Date();
    expiresAt.setHours(23, 59, 59, 999);

    const watchmanToken = new WatchmanToken({
      token,
      expiresAt,
    });

    await watchmanToken.save();

    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Login para vigilantes usando el token
export const watchmanLogin = async (req, res) => {
  const { token } = req.body;

  try {
    const watchmanToken = await WatchmanToken.findOne({
      token,
      isActive: true,
      expiresAt: { $gt: new Date() }, // Verifica que el token no haya expirado
    });

    if (!watchmanToken) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }

    // Crear JWT token para la sesión
    const sessionToken = await createAccessToken({
      role: "watchman",
      tokenId: watchmanToken._id,
    });

    res.cookie("token", sessionToken);

    res.json({
      role: "watchman",
      tokenId: watchmanToken._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
