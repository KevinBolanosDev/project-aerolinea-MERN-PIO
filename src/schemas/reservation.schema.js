import { z } from "zod";

const reservationSchema = z.object({
  flight: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de vuelo inválido"), // Debe ser un ObjectId válido

  passenger: z.string().regex(/^[0-9a-fA-F]{24}$/, "ID de pasajero inválido"), // Debe ser un ObjectId válido

  seat_number: z
    .string()
    .regex(/^[A-Z]?\d+[A-Z]?$/, "Formato inválido (Ej: 12A, A3, 5B)"),

  price: z
    .number({ required_error: "El precio es obligatorio" })
    .positive({ message: "El precio debe ser un número positivo" }),

  status: z.enum(["Confirmada", "Cancelada", "Pendiente"], {
    required_error: "Estado de reserva obligatorio",
  }),
});

export default reservationSchema;
