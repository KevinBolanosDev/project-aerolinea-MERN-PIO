import { Router } from "express";

// Importamos todas las rutas creadas
import authRoutes from "./auth.routes.js";
import airlineRoutes from "./airline.routes.js";
import airplaneRoutes from "./airplane.routes.js";

const router = Router();

// Rutas principales
router.use("/auth", authRoutes);
router.use("/airlines", airlineRoutes);
router.use("/airplanes", airplaneRoutes);

// Manejador de rutas inexistentes
router.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

export default router;
