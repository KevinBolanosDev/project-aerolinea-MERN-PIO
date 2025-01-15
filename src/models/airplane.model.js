import mongoose from "mongoose";

const airplaneSchema = new mongoose.Schema(
  {
    model: {
      type: String,
      required: [true, "El modelo del avión es obligatorio"],
    },
    manufacturer: {
      type: String,
      required: [true, "El fabricante es obligatorio"],
    },
    capacity: {
      type: Number,
      required: [true, "La capacidad del avión es obligatoria"],
      min: [0, "La capacidad debe ser mayor o igual a 0"],
    },
    manufacturing_date: {
      type: Date,
      required: [true, "La fecha de fabricación es obligatoria"],
    },
    status: {
      type: String,
      enum: ["activo", "en mantenimiento", "inactivo"],
      default: "activo",
      required: true,
    },
    airline: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Airline", // Relación con el modelo de Aerolínea
      required: [true, "El ID de la aerolínea es obligatorio"],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

export default mongoose.model("Airplane", airplaneSchema);
