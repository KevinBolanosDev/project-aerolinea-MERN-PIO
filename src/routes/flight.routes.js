import { Router } from "express";
import {
  getFlights,
  getFlightById,
  createFlight,
  updateFlight,
  deleteFlight,
  searchFlights,
} from "../controllers/flight.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import flightSchema from "../schemas/flight.schema.js";

const router = Router();

router.get("/", getFlights);
router.get("/:id", getFlightById);
router.get("/search/:id", searchFlights);

router.post("/", validateSchema(flightSchema), createFlight);
router.put("/:id", validateSchema(flightSchema), updateFlight);
router.delete("/:id", deleteFlight);

export default router;
