import { Router } from "express";
import {
  createReservation,
  deleteReservation,
  getReservationById,
  getReservations,
  searchReservations,
  seeReservationPDF,
  updateReservation,
} from "../controllers/reservation.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import reservationSchema from "../schemas/reservation.schema.js";

const router = Router();

router.get("/", getReservations);
router.get("/:id", getReservationById);
router.get("/search", searchReservations);
router.get("/:id/pdf", seeReservationPDF);

router.post("/", validateSchema(reservationSchema), createReservation);
router.put("/:id", validateSchema(reservationSchema), updateReservation);
router.delete("/:id", deleteReservation);

export default router;
