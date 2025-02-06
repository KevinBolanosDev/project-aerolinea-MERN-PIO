import { z } from "zod";

const flightSchema = z.object({
  flight_number: z
    .string({ required_error: "El número de vuelo es obligatorio" })
    .min(3, "Mínimo 3 caracteres")
    .max(10, "Máximo 10 caracteres")
    .regex(/^[A-Z0-9]+$/, "Solo mayúsculas y números"),

  airplane: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de avión inválido"),

  origin: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de aeropuerto de origen inválido"),

  destination: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/, "ID de aeropuerto de destino inválido"),

    departure_time: z.coerce.date({
      required_error: "Fecha de salida obligatoria",
      invalid_type_error: "Formato de fecha inválido",
    }),

    arrival_time: z.coerce.date(),

  status: z.enum(["Programado", "En vuelo", "Aterrizado", "Cancelado", "Retrasado"], {
    required_error: "Estado del vuelo obligatorio",
  }),
});

export default flightSchema;
