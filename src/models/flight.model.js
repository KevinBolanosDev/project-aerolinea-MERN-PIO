import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    flight_number: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 10,
      match: /^[A-Z0-9]+$/, // Solo mayúsculas y números
    },
    airplane: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airplane", // Relación con el modelo de avión
      required: true,
    },
    origin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airport", // Relación con el aeropuerto de origen
      required: true,
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airport", // Relación con el aeropuerto de destino
      required: true,
    },
    departure_time: {
      type: Date,
      required: true,
    },
    arrival_time: {
      type: Date,
      required: true,
    },
    status: { 
      type: String,
      enum: {
        values: ["Programado", "En vuelo", "Aterrizado", "Cancelado", "Retrasado"],
        message: "Estado inválido: Programado, En vuelo, Aterrizado, Cancelado, Retrasado",
      },
      default: "Programado",
    },
  },
  { timestamps: true } // Añade createdAt y updatedAt automáticamente
);

export default mongoose.model("Flight", flightSchema);