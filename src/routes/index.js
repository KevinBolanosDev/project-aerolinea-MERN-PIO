import { Router } from "express";

// Importamos todas las rutas creadas
import authRoutes from "./auth.routes.js";
import airlineRoutes from "./airline.routes.js";
import airplaneRoutes from "./airplane.routes.js";
import airportRoutes from "./airport.routes.js";
import passengerRoutes from "./passengers.routes.js";
import flightRoutes from "./flight.routes.js";
import reservationRoutes from "./reservation.routes.js";

const router = Router();

// Rutas principales
router.use("/auth", authRoutes);
router.use("/airline", airlineRoutes);
router.use("/airplane", airplaneRoutes);
router.use("/airport", airportRoutes);
router.use("/passenger", passengerRoutes);
router.use("/flight", flightRoutes);
router.use("/reservation", reservationRoutes);

// Manejador de rutas inexistentes
router.use((req, res) => {
  res.status(404).json({
    message: "Ruta no encontrada",
  });
});

export default router;
