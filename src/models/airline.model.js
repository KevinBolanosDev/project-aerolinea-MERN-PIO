import mongoose from "mongoose";

const airlineSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "El nombre es obligatorio"],
      trim: true,
    },
    legal_name: {
      type: String,
      required: [true, "El nombre legal es obligatorio"],
      trim: true,
    },
    country_of_origin: {
      type: String,
      required: [true, "El país de origen es obligatorio"],
      trim: true,
    },
    number_of_employees: {
      type: Number,
      required: [true, "El número de empleados es obligatorio"],
      min: [0, "El número de empleados debe ser mayor o igual a 0"],
    },
    main_office: {
      type: String,
      required: [true, "La oficina principal es obligatoria"],
      trim: true,
    },
    phone: {
      type: String,
      required: [true, "El teléfono es obligatorio"],
      validate: {
        validator: function (v) {
          return /^\+?[0-9\s\-()]+$/.test(v);
        },
        message: "Debe ser un número de teléfono válido",
      },
    },
    email: {
      type: String,
      required: [true, "El correo electrónico es obligatorio"],
      lowercase: true,
      validate: {
        validator: function (v) {
          return /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
        },
        message: "Debe ser un correo electrónico válido",
      },
    },
    number_of_airplanes: {
      type: Number,
      required: [true, "El número de aviones es obligatorio"],
      min: [0, "El número de aviones debe ser mayor o igual a 0"],
    },
    status: {
      type: String,
      enum: ["activo", "suspendida", "inactivo"],
      default: "activo",
      required: [true, "El estado es obligatorio"],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Airline", airlineSchema);
