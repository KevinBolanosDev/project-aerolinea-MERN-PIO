import { Router } from "express";
import {
  getAirlines,
  getAirline,
  createAirline,
  updateAirline,
  deleteAirline,
  changeAirlineStatus,
  searchAirlineByName,
} from "../controllers/airline.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import airlineSchema from "../schemas/airline.schema.js";

const router = Router();

// Middleware global para autenticación
// router.use(authRequired);


router.get("/", getAirlines);
router.get("/:id", getAirline);
router.get("/search/:id", searchAirlineByName);

router.post("/", validateSchema(airlineSchema), createAirline);
router.put("/:id", validateSchema(airlineSchema), updateAirline);
router.patch(
  "/:id/status",
  validateSchema(
    airlineSchema.pick({ status: true }) // Validar solo el campo status
  ),
  changeAirlineStatus
);
router.delete("/:id", deleteAirline);

export default router;
