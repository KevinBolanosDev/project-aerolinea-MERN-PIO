import { Router } from "express";
import {
  getAirports,
  getAirport,
  createAirport,
  updateAirport,
  deleteAirport,
  searchAirportByName,
} from "../controllers/airport.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import airportSchema from "../schemas/airport.schema.js";

const router = Router();

// Middleware global para autenticación
// router.use(authRequired);


router.get("/", getAirports);
router.get("/:id", getAirport);
router.get("/search/:id", searchAirportByName);

router.post("/", validateSchema(airportSchema), createAirport);
router.put("/:id", validateSchema(airportSchema), updateAirport);
router.delete("/:id", deleteAirport);

export default router;
