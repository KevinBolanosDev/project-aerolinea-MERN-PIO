import { Router } from "express";
import {
  getPassengers,
  getPassengerById,
  createPassenger,
  updatePassenger,
  deletePassenger,
  searchPassengerByName,
} from "../controllers/passengers.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import passengerSchema from "../schemas/passengers.schema.js";

const router = Router();

// Rutas
router.get("/", getPassengers); // Obtener todos los pasajeros con paginación
router.get("/:id", getPassengerById); // Obtener un pasajero por ID
router.get("/search/:id", searchPassengerByName); // Obtener un pasajero por ID

router.post("/", validateSchema(passengerSchema), createPassenger); // Crear un pasajero con validación
router.put("/:id", validateSchema(passengerSchema), updatePassenger); // Actualizar un pasajero con validación
router.delete("/:id", deletePassenger); // Eliminar un pasajero por ID

export default router;
