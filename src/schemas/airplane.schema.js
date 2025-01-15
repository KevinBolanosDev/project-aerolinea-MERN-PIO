import { z } from "zod";

export const airplaneSchema = z.object({
  model: z.string({
    required_error: "El modelo del avión es obligatorio",
  }),
  manufacturer: z.string({
    required_error: "El fabricante es obligatorio",
  }),
  capacity: z
    .number({
      required_error: "La capacidad del avión es obligatoria",
    })
    .int()
    .nonnegative("La capacidad debe ser mayor o igual a 0"),
  manufacturing_date: z.string({
    required_error: "La fecha de fabricación es obligatoria",
  })
  .transform((value) => new Date(value))
  .refine((date) => !isNaN(date.getTime()), {
    message: "La fecha de fabricación debe ser válida"
  }),
  status: z.enum(["activo", "en mantenimiento", "inactivo"], {
    required_error: "El estado del avión es obligatorio",
    invalid_type_error: "El estado debe ser 'activo', 'en mantenimiento' o 'inactivo'",
  }).default("activo"),
  airline: z.string({
    required_error: "El ID de la aerolínea es obligatorio",
  }),
});

export default airplaneSchema;
