import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema(
  {
    flight: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    passenger: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Passenger",
      required: true,
    },
    seat_number: {
      type: String,
      match: [/^[A-Z]?\d+[A-Z]?$/, "Formato inválido (Ej: 12A, A3, 5B)"],
      required: [true, "Número de asiento obligatorio"],
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Aseguramos que el precio sea positivo
    },
    status: {
      type: String,
      enum: ["Confirmada", "Cancelada", "Pendiente"],
      default: "Pendiente",
    },
  },
  { timestamps: true } // Agrega automáticamente createdAt y updatedAt
);

export default mongoose.model("Reservation", reservationSchema);
