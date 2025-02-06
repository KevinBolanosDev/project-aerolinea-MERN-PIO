import mongoose from "mongoose";

const airportSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre del aeropuerto es obligatorio"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "La ciudad es obligatoria"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "El país es obligatorio"],
      trim: true,
    },
    iata_code: {
      type: String,
      required: [true, "El código IATA es obligatorio"],
      trim: true,
    },
    gates: {
      type: String,
      enum: {
        values: ["E12", "G18", "H24", "F34", "D15", "G17", "S19", "E23", "H17"],
        message: "Puertas válidas: E12, G18, H24, F34, D15, G17, S19, E23, H17",
      },
      required: [true, "Puerta de embarque obligatoria"],
    },
    status: {
      type: String,
      enum: ["activo", "cerrado"],
      default: ["activo"],
      required: [true, "Estado del aeropuerto es obligatorio"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Airport", airportSchema);
