import { Router } from "express";
import {
  getAirplanes,
  getAirplane,
  createAirplane,
  updateAirplane,
  deleteAirplane,
  searchAirplanesByModel,
  filterAirplanesByStatus,
} from "../controllers/airplane.controller.js";
// Middleware de autenticación
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

// Middleware global para autenticación
// router.use(authRequired);

// Rutas generales
router.get("/", getAirplanes); // Obtener todos los aviones
router.get("/:id", getAirplane); // Obtener un avión por ID

// Rutas de búsqueda personalizada
router.get("/search/model", searchAirplanesByModel); // Buscar por modelo
router.get("/search/status", filterAirplanesByStatus); // Filtrar por estado

// Rutas protegidas
router.post("/", createAirplane); // Crear un nuevo avión
router.put("/:id", updateAirplane); // Actualizar un avión
router.delete("/:id", deleteAirplane); // Eliminar un avión

export default router;
