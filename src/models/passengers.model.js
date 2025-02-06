import mongoose from "mongoose";

const passengerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [50, "El nombre es demasiado largo"],
    },
    middle_name: {
      type: String,
      default: "",
    },
    last_name: {
      type: String,
      required: [true, "El apellido es obligatorio"],
      minlength: [2, "El apellido debe tener al menos 2 caracteres"],
      maxlength: [50, "El apellido es demasiado largo"],
    },
    second_last_name: {
      type: String,
      default: "",
    },
    document_type: {
      type: String,
      enum: ["DNI", "Pasaporte", "Cédula"],
      required: [true, "Tipo de documento es obligatorio"],
    },
    document_number: {
      type: String,
      required: [true, "Número de documento es obligatorio"],
      unique: true,
      match: [/^[a-zA-Z0-9]+$/, "Número de documento inválido"],
    },
    date_of_birth: {
      type: Date,
      required: [true, "La fecha de nacimiento es obligatoria"],
    },
    nationality: {
      type: String,
      required: [true, "La nacionalidad es obligatoria"],
    },
    gender: {
      type: String,
      enum: ["masculino", "femenino", "otro"],
      required: [true, "El género es obligatorio"],
    },
    country: {
      type: String,
      required: [true, "País es obligatorio"],
    },
    city: {
      type: String,
      required: [true, "Ciudad es obligatoria"],
    },
    phone_number: {
      type: String,
      match: [/^\+(?:[0-9]●?){6,14}[0-9]$/, "Formato: +[código][número]"],
      required: [true, "Debe agregar un teléfono"],
    },
    email: {
      type: String,
      required: [true, "Correo electrónico es obligatorio"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Correo no es válido"],
    },
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

export default mongoose.model("Passenger", passengerSchema);

